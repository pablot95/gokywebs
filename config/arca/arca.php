<?php

class ArcaError extends Exception {}

class Arca
{
    const ENDPOINTS = [
        'homologacion' => [
            'wsaa' => 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms',
            'wsfe' => 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
        ],
        'produccion' => [
            'wsaa' => 'https://wsaa.afip.gov.ar/ws/services/LoginCms',
            'wsfe' => 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
        ],
    ];

    private $entorno;
    private $cuit;
    private $certPath;
    private $keyPath;
    private $ticketPath;

    public function __construct(array $config)
    {
        $this->entorno = $config['entorno'];
        $this->cuit = (string) $config['cuit'];
        $this->certPath = $config['cert'];
        $this->keyPath = $config['key'];
        $this->ticketPath = $config['ticket'];

        if (!isset(self::ENDPOINTS[$this->entorno])) {
            throw new ArcaError("Entorno desconocido: {$this->entorno}");
        }
        foreach (['certPath' => $this->certPath, 'keyPath' => $this->keyPath] as $campo => $ruta) {
            if (!is_readable($ruta)) {
                throw new ArcaError("No se puede leer $campo: $ruta");
            }
        }
    }

    public function estaVivo()
    {
        $respuesta = $this->llamarWsfe('FEDummy', '');
        return [
            'appserver' => $this->valorDe($respuesta, 'AppServer'),
            'dbserver' => $this->valorDe($respuesta, 'DbServer'),
            'authserver' => $this->valorDe($respuesta, 'AuthServer'),
        ];
    }

    public function ultimoComprobante($puntoVenta, $tipoComprobante)
    {
        $cuerpo = $this->bloqueAuth()
            . '<ar:PtoVta>' . (int) $puntoVenta . '</ar:PtoVta>'
            . '<ar:CbteTipo>' . (int) $tipoComprobante . '</ar:CbteTipo>';
        $respuesta = $this->llamarWsfe('FECompUltimoAutorizado', $cuerpo);
        $this->abortarSiHayErrores($respuesta);
        return (int) $this->valorDe($respuesta, 'CbteNro');
    }

    public function tiposDeComprobante()
    {
        $respuesta = $this->llamarWsfe('FEParamGetTiposCbte', $this->bloqueAuth());
        $this->abortarSiHayErrores($respuesta);
        $tipos = [];
        foreach ($this->nodos($respuesta, 'CbteTipo') as $nodo) {
            $tipos[] = [
                'id' => (int) $this->textoHijo($nodo, 'Id'),
                'descripcion' => $this->textoHijo($nodo, 'Desc'),
            ];
        }
        return $tipos;
    }

    public function consultarComprobante($puntoVenta, $tipoComprobante, $numero)
    {
        $cuerpo = $this->bloqueAuth()
            . '<ar:FeCompConsReq>'
            . '<ar:CbteTipo>' . (int) $tipoComprobante . '</ar:CbteTipo>'
            . '<ar:CbteNro>' . (int) $numero . '</ar:CbteNro>'
            . '<ar:PtoVta>' . (int) $puntoVenta . '</ar:PtoVta>'
            . '</ar:FeCompConsReq>';
        $respuesta = $this->llamarWsfe('FECompConsultar', $cuerpo);
        $this->abortarSiHayErrores($respuesta);

        $cae = $this->valorDe($respuesta, 'CodAutorizacion');
        if (!$cae) return null;

        return [
            'numero' => (int) $this->valorDe($respuesta, 'CbteDesde'),
            'fecha' => $this->valorDe($respuesta, 'CbteFch'),
            'total' => (float) $this->valorDe($respuesta, 'ImpTotal'),
            'documento' => $this->valorDe($respuesta, 'DocNro'),
            'cae' => $cae,
            'caeVence' => $this->valorDe($respuesta, 'FchVto'),
            'resultado' => $this->valorDe($respuesta, 'Resultado'),
            'emitido' => $this->valorDe($respuesta, 'FchProceso'),
        ];
    }

    public function puntosDeVenta()
    {
        $respuesta = $this->llamarWsfe('FEParamGetPtosVenta', $this->bloqueAuth());
        $this->abortarSiHayErrores($respuesta);
        $puntos = [];
        foreach ($this->nodos($respuesta, 'PtoVenta') as $nodo) {
            $baja = $this->textoHijo($nodo, 'FchBaja');
            $puntos[] = [
                'numero' => (int) $this->textoHijo($nodo, 'Nro'),
                'tipo' => $this->textoHijo($nodo, 'EmisionTipo'),
                'bloqueado' => $this->textoHijo($nodo, 'Bloqueado') === 'S',
                'baja' => ($baja === 'NULL' || $baja === '') ? null : $baja,
            ];
        }
        return $puntos;
    }

    public function condicionesIvaReceptor($claseComprobante)
    {
        $cuerpo = $this->bloqueAuth() . '<ar:ClaseCmp>' . $claseComprobante . '</ar:ClaseCmp>';
        $respuesta = $this->llamarWsfe('FEParamGetCondicionIvaReceptor', $cuerpo);
        $this->abortarSiHayErrores($respuesta);
        $condiciones = [];
        foreach ($this->nodos($respuesta, 'CondicionIvaReceptor') as $nodo) {
            $condiciones[] = [
                'id' => (int) $this->textoHijo($nodo, 'Id'),
                'descripcion' => $this->textoHijo($nodo, 'Desc'),
                'clase' => $this->textoHijo($nodo, 'Cmp_Clase'),
            ];
        }
        return $condiciones;
    }

    public function emitirFacturaC(array $factura)
    {
        $puntoVenta = (int) $factura['puntoVenta'];
        $numero = $this->ultimoComprobante($puntoVenta, 11) + 1;
        $total = round((float) $factura['total'], 2);
        $fecha = isset($factura['fecha']) ? $factura['fecha'] : date('Ymd');
        $concepto = isset($factura['concepto']) ? (int) $factura['concepto'] : 2;
        if (!in_array($concepto, [1, 2, 3], true)) $concepto = 2;

        // Concepto 1 (solo productos) no lleva periodo ni vencimiento: ARCA rechaza el
        // comprobante si se mandan esas fechas.
        $llevaPeriodo = $concepto !== 1;
        $desde = isset($factura['servicioDesde']) ? $factura['servicioDesde'] : $fecha;
        $hasta = isset($factura['servicioHasta']) ? $factura['servicioHasta'] : $fecha;
        $vence = isset($factura['vencimientoPago']) ? $factura['vencimientoPago'] : $fecha;

        $detalle = '<ar:Concepto>' . $concepto . '</ar:Concepto>'
            . '<ar:DocTipo>' . (int) $factura['tipoDocumento'] . '</ar:DocTipo>'
            . '<ar:DocNro>' . (int) $factura['numeroDocumento'] . '</ar:DocNro>'
            . '<ar:CbteDesde>' . $numero . '</ar:CbteDesde>'
            . '<ar:CbteHasta>' . $numero . '</ar:CbteHasta>'
            . '<ar:CbteFch>' . $fecha . '</ar:CbteFch>'
            . '<ar:ImpTotal>' . $total . '</ar:ImpTotal>'
            . '<ar:ImpTotConc>0</ar:ImpTotConc>'
            . '<ar:ImpNeto>' . $total . '</ar:ImpNeto>'
            . '<ar:ImpOpEx>0</ar:ImpOpEx>'
            . '<ar:ImpTrib>0</ar:ImpTrib>'
            . '<ar:ImpIVA>0</ar:ImpIVA>'
            . ($llevaPeriodo
                ? '<ar:FchServDesde>' . $desde . '</ar:FchServDesde>'
                    . '<ar:FchServHasta>' . $hasta . '</ar:FchServHasta>'
                    . '<ar:FchVtoPago>' . $vence . '</ar:FchVtoPago>'
                : '')
            . '<ar:MonId>PES</ar:MonId>'
            . '<ar:MonCotiz>1</ar:MonCotiz>'
            . '<ar:CondicionIVAReceptorId>' . (int) $factura['condicionIvaReceptor'] . '</ar:CondicionIVAReceptorId>';

        $cuerpo = $this->bloqueAuth()
            . '<ar:FeCAEReq>'
            . '<ar:FeCabReq><ar:CantReg>1</ar:CantReg>'
            . '<ar:PtoVta>' . $puntoVenta . '</ar:PtoVta>'
            . '<ar:CbteTipo>11</ar:CbteTipo></ar:FeCabReq>'
            . '<ar:FeDetReq><ar:FECAEDetRequest>' . $detalle . '</ar:FECAEDetRequest></ar:FeDetReq>'
            . '</ar:FeCAEReq>';

        $respuesta = $this->llamarWsfe('FECAESolicitar', $cuerpo);
        $this->abortarSiHayErrores($respuesta);

        $resultado = $this->valorDe($respuesta, 'Resultado');
        if ($resultado !== 'A') {
            throw new ArcaError('ARCA rechazo el comprobante (Resultado=' . $resultado . '): ' . $this->observaciones($respuesta));
        }

        return [
            'puntoVenta' => $puntoVenta,
            'tipoComprobante' => 11,
            'numero' => $numero,
            'fecha' => $fecha,
            'total' => $total,
            'concepto' => $concepto,
            'tipoDocumento' => (int) $factura['tipoDocumento'],
            'numeroDocumento' => (string) $factura['numeroDocumento'],
            'condicionIvaReceptor' => (int) $factura['condicionIvaReceptor'],
            'servicioDesde' => $llevaPeriodo ? $desde : '',
            'servicioHasta' => $llevaPeriodo ? $hasta : '',
            'vencimientoPago' => $llevaPeriodo ? $vence : '',
            'cae' => $this->valorDe($respuesta, 'CAE'),
            'caeVence' => $this->valorDe($respuesta, 'CAEFchVto'),
            'observaciones' => $this->observaciones($respuesta),
        ];
    }

    private function observaciones(DOMDocument $respuesta)
    {
        $textos = [];
        foreach ($this->nodos($respuesta, 'Obs') as $nodo) {
            $textos[] = $this->textoHijo($nodo, 'Code') . ': ' . $this->textoHijo($nodo, 'Msg');
        }
        return implode(' | ', $textos);
    }

    private function bloqueAuth()
    {
        $ticket = $this->obtenerTicket();
        return '<ar:Auth>'
            . '<ar:Token>' . htmlspecialchars($ticket['token'], ENT_XML1) . '</ar:Token>'
            . '<ar:Sign>' . htmlspecialchars($ticket['sign'], ENT_XML1) . '</ar:Sign>'
            . '<ar:Cuit>' . $this->cuit . '</ar:Cuit>'
            . '</ar:Auth>';
    }

    public function obtenerTicket()
    {
        $guardado = $this->ticketGuardadoVigente();
        if ($guardado) return $guardado;

        $firmado = $this->firmarSolicitud($this->armarSolicitudDeAcceso('wsfe'));
        $sobre = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"'
            . ' xmlns:wsaa="http://wsaa.view.sua.dvadac.desarrollo.afip.gov">'
            . '<soapenv:Body><wsaa:loginCms><wsaa:in0>' . $firmado . '</wsaa:in0></wsaa:loginCms></soapenv:Body>'
            . '</soapenv:Envelope>';

        $respuesta = $this->postSoap(self::ENDPOINTS[$this->entorno]['wsaa'], $sobre, '');
        $contenido = $this->valorDe($respuesta, 'loginCmsReturn');
        if ($contenido === null) {
            throw new ArcaError('WSAA rechazo el login: ' . $this->mensajeDeFalla($respuesta));
        }

        $login = new DOMDocument();
        $login->loadXML($contenido);
        $ticket = [
            'token' => $this->valorDe($login, 'token'),
            'sign' => $this->valorDe($login, 'sign'),
            'expira' => $this->valorDe($login, 'expirationTime'),
        ];
        if (file_put_contents($this->ticketPath, json_encode($ticket), LOCK_EX) === false) {
            throw new ArcaError(
                'Se obtuvo el ticket pero no se pudo guardar en ' . $this->ticketPath
                . '. Sin cache, ARCA rechaza los pedidos siguientes: dale permiso de escritura a la carpeta.'
            );
        }
        return $ticket;
    }

    private function ticketGuardadoVigente()
    {
        if (!is_readable($this->ticketPath)) return null;
        $ticket = json_decode(file_get_contents($this->ticketPath), true);
        if (!$ticket || empty($ticket['expira'])) return null;
        if (strtotime($ticket['expira']) - 600 <= time()) return null;
        return $ticket;
    }

    private function armarSolicitudDeAcceso($servicio)
    {
        $ahora = time();
        $unico = $ahora;
        return '<?xml version="1.0" encoding="UTF-8"?>'
            . '<loginTicketRequest version="1.0"><header>'
            . '<uniqueId>' . $unico . '</uniqueId>'
            . '<generationTime>' . date('c', $ahora - 600) . '</generationTime>'
            . '<expirationTime>' . date('c', $ahora + 600) . '</expirationTime>'
            . '</header><service>' . $servicio . '</service></loginTicketRequest>';
    }

    private function firmarSolicitud($solicitud)
    {
        $entrada = tempnam(sys_get_temp_dir(), 'tra');
        $salida = tempnam(sys_get_temp_dir(), 'cms');
        file_put_contents($entrada, $solicitud);

        $ok = openssl_pkcs7_sign(
            $entrada,
            $salida,
            'file://' . $this->certPath,
            ['file://' . $this->keyPath, ''],
            [],
            !PKCS7_DETACHED
        );
        $firmado = $ok ? file_get_contents($salida) : '';
        @unlink($entrada);
        @unlink($salida);

        if (!$ok) {
            throw new ArcaError('No se pudo firmar el TRA: ' . openssl_error_string());
        }
        $partes = preg_split("/\n\s*\n/", $firmado, 2);
        return preg_replace('/\s+/', '', $partes[1]);
    }

    private function llamarWsfe($metodo, $cuerpo)
    {
        $sobre = '<?xml version="1.0" encoding="UTF-8"?>'
            . '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"'
            . ' xmlns:ar="http://ar.gov.afip.dif.FEV1/">'
            . '<soap:Body><ar:' . $metodo . '>' . $cuerpo . '</ar:' . $metodo . '></soap:Body>'
            . '</soap:Envelope>';
        return $this->postSoap(
            self::ENDPOINTS[$this->entorno]['wsfe'],
            $sobre,
            'http://ar.gov.afip.dif.FEV1/' . $metodo
        );
    }

    private function postSoap($url, $sobre, $accion)
    {
        $intento = $this->ejecutarPost($url, $sobre, $accion, null);

        if ($intento['cuerpo'] === false && stripos($intento['error'], 'ssl') !== false) {
            $intento = $this->ejecutarPost($url, $sobre, $accion, 'ECDHE:DEFAULT@SECLEVEL=1');
        }

        $cuerpo = $intento['cuerpo'];
        $codigo = $intento['codigo'];

        if ($cuerpo === false) throw new ArcaError("Fallo la conexion con $url: " . $intento['error']);

        $documento = new DOMDocument();
        if (!@$documento->loadXML($cuerpo)) {
            throw new ArcaError("Respuesta no es XML (HTTP $codigo): " . substr($cuerpo, 0, 400));
        }
        return $documento;
    }

    private function ejecutarPost($url, $sobre, $accion, $cifrados)
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $sobre,
            CURLOPT_HTTPHEADER => [
                'Content-Type: text/xml; charset=utf-8',
                'SOAPAction: "' . $accion . '"',
                'Content-Length: ' . strlen($sobre),
            ],
            CURLOPT_TIMEOUT => 30,
        ]);
        if ($cifrados !== null) {
            curl_setopt($ch, CURLOPT_SSL_CIPHER_LIST, $cifrados);
        }
        $resultado = [
            'cuerpo' => curl_exec($ch),
            'error' => curl_error($ch),
            'codigo' => curl_getinfo($ch, CURLINFO_HTTP_CODE),
        ];
        curl_close($ch);
        return $resultado;
    }

    private function abortarSiHayErrores(DOMDocument $respuesta)
    {
        $fallas = [];
        foreach ($this->nodos($respuesta, 'Err') as $nodo) {
            $fallas[] = $this->textoHijo($nodo, 'Code') . ': ' . $this->textoHijo($nodo, 'Msg');
        }
        if ($fallas) throw new ArcaError(implode(' | ', $fallas));

        $falla = $this->mensajeDeFalla($respuesta);
        if ($falla) throw new ArcaError($falla);
    }

    private function mensajeDeFalla(DOMDocument $respuesta)
    {
        return $this->valorDe($respuesta, 'faultstring');
    }

    private function nodos(DOMDocument $documento, $nombre)
    {
        $xpath = new DOMXPath($documento);
        return $xpath->query("//*[local-name()='$nombre']");
    }

    private function valorDe(DOMDocument $documento, $nombre)
    {
        $encontrados = $this->nodos($documento, $nombre);
        return $encontrados->length ? $encontrados->item(0)->textContent : null;
    }

    private function textoHijo(DOMNode $nodo, $nombre)
    {
        foreach ($nodo->childNodes as $hijo) {
            if ($hijo->localName === $nombre) return $hijo->textContent;
        }
        return null;
    }
}
