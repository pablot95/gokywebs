<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';
require __DIR__ . '/../../config/arca/arca.php';
require __DIR__ . '/../../config/arca/receptor.php';
require __DIR__ . '/../../config/arca/registro.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

// Responsable Inscripto emitiendo Factura A: el receptor tiene que estar
// identificado con CUIT y ser Responsable Inscripto o Responsable Monotributo
// (ids 1 y 6 en el catalogo de respaldo de receptor.php) — ARCA rechaza
// cualquier otra combinacion para clase A.
const FACTURADOR_TIPO_DOC_CUIT = 80;
const FACTURADOR_CONDICION_IVA_RI = 1;
const FACTURADOR_CONDICION_IVA_MONOTRIBUTO = 6;

function claseComprobante($tipoComprobante)
{
    $clases = [1 => 'A', 6 => 'B', 11 => 'C'];
    return $clases[(int) $tipoComprobante] ?? 'C';
}

// El catalogo de condiciones frente al IVA lo define ARCA para toda la red, no
// varia por CUIT: se cachea una sola vez por clase de comprobante, compartido
// entre todos los usuarios del facturador (no por tenant).
function rutaCacheCondiciones($claseCmp)
{
    return __DIR__ . '/../data/condiciones-' . $claseCmp . '.json';
}

function condicionesIvaCacheadas($claseCmp)
{
    $cache = rutaCacheCondiciones($claseCmp);
    if (is_readable($cache)) {
        $guardadas = json_decode(file_get_contents($cache), true);
        if (is_array($guardadas) && $guardadas) return $guardadas;
    }
    return receptor_condiciones_respaldo();
}

function condicionesIvaDisponibles(Arca $arca, $claseCmp)
{
    $cache = rutaCacheCondiciones($claseCmp);
    if (is_readable($cache) && time() - filemtime($cache) < 30 * 86400) {
        return condicionesIvaCacheadas($claseCmp);
    }
    try {
        $lista = [];
        foreach ($arca->condicionesIvaReceptor($claseCmp) as $condicion) {
            $lista[] = ['id' => $condicion['id'], 'descripcion' => $condicion['descripcion']];
        }
        if ($lista) {
            @file_put_contents($cache, json_encode($lista, JSON_UNESCAPED_UNICODE), LOCK_EX);
            return $lista;
        }
    } catch (Exception $e) {
        // Sin conexion con el padron: seguimos con la tabla de respaldo.
    }
    return receptor_condiciones_respaldo();
}

// Los rechazos por datos del pedido (400) llevan datosInvalidos: "Emitir todas"
// sigue con el próximo cliente; cualquier otro error corta la tanda.
function responderDatosInvalidos($mensaje)
{
    facturador_responder(['ok' => false, 'datosInvalidos' => true, 'error' => $mensaje], 400);
}

function leerRegistro($config)
{
    try {
        return registro_leer($config);
    } catch (RuntimeException $e) {
        facturador_responder(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

// Fecha del comprobante en hora argentina (el server está en UTC: de 21 a 24 h
// salía con la fecha de mañana, y el último día del mes caía en el mes que
// viene). ARCA no acepta una fecha anterior a la del último comprobante del
// punto de venta, así que si ese ya salió con la fecha de mañana, se usa esa.
function fechaComprobante(Arca $arca, $puntoVenta, $tipoComprobante, $ultimoNumero)
{
    $hoy = (new DateTime('now', new DateTimeZone('America/Argentina/Buenos_Aires')))->format('Ymd');
    if ($ultimoNumero > 0 && $hoy !== gmdate('Ymd')) {
        $ultimo = $arca->consultarComprobante($puntoVenta, $tipoComprobante, $ultimoNumero);
        if ($ultimo && (string) $ultimo['fecha'] > $hoy) return (string) $ultimo['fecha'];
    }
    return $hoy;
}

/**
 * Un intento que quedó sin respuesta (se cortó la conexión justo después de que
 * ARCA autorizó, o el server se cayó antes de guardar): se busca entre los
 * comprobantes posteriores al último que había antes del intento uno de la
 * misma fecha, importe y documento. Mismo criterio que sus_recuperar_intento()
 * del admin. Devuelve los datos del comprobante o null si no se emitió.
 */
function recuperarIntento(Arca $arca, array $intento, array $registro)
{
    $puntoVenta = (int) $intento['puntoVenta'];
    $tipo = (int) $intento['tipoComprobante'];
    $anterior = (int) $intento['anterior'];
    $ultimo = $arca->ultimoComprobante($puntoVenta, $tipo);
    if ($ultimo <= $anterior) return null;
    if ($ultimo - $anterior > 20) {
        throw new RuntimeException('Un intento anterior de esta factura quedó sin respuesta de ARCA y desde entonces se emitieron muchos comprobantes: '
            . 'revisá en ARCA si ya existe una factura del ' . $intento['fecha'] . ' por $' . $intento['total'] . ' antes de emitirla de nuevo.');
    }
    $conocidos = [];
    foreach ($registro as $f) {
        if ((int) ($f['puntoVenta'] ?? 0) === $puntoVenta && (int) ($f['tipoComprobante'] ?? 11) === $tipo) {
            $conocidos[(int) ($f['numero'] ?? 0)] = true;
        }
    }
    for ($numero = $anterior + 1; $numero <= $ultimo; $numero++) {
        if (isset($conocidos[$numero])) continue;
        $c = $arca->consultarComprobante($puntoVenta, $tipo, $numero);
        if (!$c) continue;
        if ((string) $c['fecha'] !== (string) $intento['fecha']) continue;
        if (abs((float) $c['total'] - (float) $intento['total']) > 0.005) continue;
        if ((int) $c['documento'] !== (int) $intento['numeroDocumento']) continue;
        return ['numero' => $numero, 'cae' => (string) $c['cae'], 'caeVence' => (string) $c['caeVence']];
    }
    return null;
}

function guardarRegistro($config, array $registro)
{
    try {
        registro_guardar($config, $registro);
        return true;
    } catch (RuntimeException $e) {
        error_log('facturador: ' . $e->getMessage());
        return false;
    }
}

$config = facturador_arca_config($uid);
if (!$config) {
    facturador_responder(['ok' => false, 'necesitaConfiguracion' => true, 'error' => 'Todavía no terminaste de configurar ARCA.']);
}

try {
    $arca = new Arca($config);
} catch (Exception $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

$accion = $_GET['accion'] ?? 'emitir';

if ($accion === 'proximo') {
    $tipoComprobante = (int) ($_GET['tipoComprobante'] ?? 11);
    $claseCmp = claseComprobante($tipoComprobante);

    try {
        $proximo = $arca->ultimoComprobante($config['puntoVenta'], $tipoComprobante) + 1;
    } catch (Exception $e) {
        facturador_responder(['ok' => false, 'error' => $e->getMessage()], 502);
    }

    // Ultimo receptor facturado a este cliente, para no recargar los datos
    // fiscales cada vez que se le emite una factura mensual.
    $ultimoReceptor = null;
    $clienteId = trim((string) ($_GET['clienteId'] ?? ''));
    if ($clienteId !== '') {
        $masReciente = '';
        foreach (leerRegistro($config) as $emitida) {
            if (($emitida['clienteId'] ?? null) !== $clienteId) continue;
            if (empty($emitida['receptor'])) continue;
            if (($emitida['emitidaEl'] ?? '') < $masReciente) continue;
            $masReciente = $emitida['emitidaEl'] ?? '';
            $ultimoReceptor = $emitida['receptor'];
        }
    }

    facturador_responder([
        'ok' => true,
        'puntoVenta' => $config['puntoVenta'],
        'tipoComprobante' => $tipoComprobante,
        'proximoNumero' => $proximo,
        'condicionesIva' => condicionesIvaDisponibles($arca, $claseCmp),
        'tiposDocumento' => receptor_tipos_documento(),
        'condicionesVenta' => receptor_condiciones_venta(),
        'ultimoReceptor' => $ultimoReceptor,
    ]);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    facturador_responder(['ok' => false, 'error' => 'Cuerpo inválido'], 400);
}

$requestId = trim((string) ($entrada['requestId'] ?? ''));
$clienteId = trim((string) ($entrada['clienteId'] ?? ''));
$total = round((float) ($entrada['total'] ?? 0), 2);
$tipoComprobante = (int) ($entrada['tipoComprobante'] ?? 11);

if (!in_array($tipoComprobante, [1, 6, 11], true)) responderDatosInvalidos('Tipo de comprobante inválido');
if ($requestId === '') responderDatosInvalidos('Falta el identificador del pedido');
if ($clienteId === '') responderDatosInvalidos('Falta el identificador del cliente');
if ($total <= 0) responderDatosInvalidos('El importe tiene que ser mayor a cero');

$claseCmp = claseComprobante($tipoComprobante);

try {
    $receptor = receptor_normalizar($entrada, array_column(condicionesIvaCacheadas($claseCmp), 'id'));
    $comprobante = receptor_normalizar_comprobante($entrada);
} catch (InvalidArgumentException $e) {
    responderDatosInvalidos($e->getMessage());
}

// Factura A: receptor identificado con CUIT, y Responsable Inscripto o
// Responsable Monotributo (este ultimo valido segun el manual de WSFEv1 --
// validacion 10063/10217 -- para el procedimiento de transicion al Regimen
// General; ARCA lo acepta con una observacion, que ya se le muestra al
// usuario mas abajo via $factura['observaciones']). receptor_normalizar() no
// sabe nada de esto (es generico para cualquier clase), asi que la regla
// extra se valida aca, no adentro de receptor.php.
if ($tipoComprobante === 1) {
    $condicionesValidas = [FACTURADOR_CONDICION_IVA_RI, FACTURADOR_CONDICION_IVA_MONOTRIBUTO];
    if ($receptor['tipoDocumento'] !== FACTURADOR_TIPO_DOC_CUIT || !in_array($receptor['condicionIvaId'], $condicionesValidas, true)) {
        responderDatosInvalidos('La Factura A solo se le puede emitir a un cliente con CUIT de Responsable Inscripto o Responsable Monotributo.');
    }
}

// Desglose de IVA: obligatorio para A/B, ausente para C (Monotributo/Exento).
$ivaDetalle = [];
if ($tipoComprobante !== 11) {
    $itemsEntrada = is_array($entrada['ivaDetalle'] ?? null) ? $entrada['ivaDetalle'] : [];
    if (!$itemsEntrada) {
        responderDatosInvalidos('Falta el desglose de IVA.');
    }
    $sumaBase = 0.0;
    $sumaIva = 0.0;
    foreach ($itemsEntrada as $item) {
        $base = round((float) ($item['baseImponible'] ?? 0), 2);
        $iva = round((float) ($item['importe'] ?? 0), 2);
        $id = (int) ($item['alicuotaId'] ?? 0);
        if ($id <= 0 || $base < 0 || $iva < 0) {
            responderDatosInvalidos('El desglose de IVA tiene datos inválidos.');
        }
        $ivaDetalle[] = ['alicuotaId' => $id, 'baseImponible' => $base, 'importe' => $iva];
        $sumaBase += $base;
        $sumaIva += $iva;
    }
    if (abs(($sumaBase + $sumaIva) - $total) > 0.02) {
        responderDatosInvalidos('El neto más el IVA no coincide con el importe total.');
    }
}

// La descripción por defecto de receptor.php es la del admin de Gokywebs
// ("Diseño y desarrollo web"): acá cada usuario factura otra cosa.
if (trim((string) ($entrada['descripcion'] ?? '')) === '') {
    $comprobante['descripcion'] = [1 => 'Productos', 2 => 'Servicios', 3 => 'Productos y servicios'][$comprobante['concepto']] ?? 'Servicios';
}

// Leer el registro, emitir y guardar va entero adentro de un lock: dos emisiones
// a la vez (dos pestañas, el modal y "Emitir todas") se pisaban el registro.
try {
    $lock = registro_lock($config);
} catch (RuntimeException $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

$registro = leerRegistro($config);
$previo = $registro[$requestId] ?? null;
if (is_array($previo) && empty($previo['enCurso'])) {
    facturador_responder(['ok' => true, 'yaEmitida' => true, 'factura' => $previo]);
}

$extras = [
    'entorno' => 'produccion',
    'cliente' => $receptor['nombre'] !== '' ? $receptor['nombre'] : trim((string) ($entrada['cliente'] ?? '')),
    'clienteId' => $clienteId,
    'receptor' => $receptor,
    'descripcion' => $comprobante['descripcion'],
    'condicionVenta' => $comprobante['condicionVenta'],
];

try {
    // Un intento anterior de este mismo pedido quedó sin respuesta: antes de
    // emitir otra vez se verifica en ARCA si ya había salido.
    if (is_array($previo)) {
        $recuperado = recuperarIntento($arca, $previo, $registro);
        if ($recuperado) {
            $datos = $previo['datos'];
            $desglose = $datos['iva'] ?? [];
            unset($datos['iva']);
            $factura = $recuperado + $datos + ['observaciones' => ''] + $extras + ['emitidaEl' => date('c'), 'recuperada' => true];
            // Mismo formato que devuelve emitirFactura() para A/B: neto, iva (importe) e ivaDetalle.
            if ($desglose) {
                $factura['neto'] = round(array_sum(array_column($desglose, 'baseImponible')), 2);
                $factura['iva'] = round(array_sum(array_column($desglose, 'importe')), 2);
                $factura['ivaDetalle'] = array_map(function ($i) {
                    return ['id' => (int) $i['alicuotaId'], 'base' => (float) $i['baseImponible'], 'importe' => (float) $i['importe']];
                }, $desglose);
            }
            $registro[$requestId] = $factura;
            guardarRegistro($config, $registro);
            facturador_responder(['ok' => true, 'yaEmitida' => true, 'factura' => $factura]);
        }
    }

    $anterior = $arca->ultimoComprobante($config['puntoVenta'], $tipoComprobante);
    $fecha = fechaComprobante($arca, $config['puntoVenta'], $tipoComprobante, $anterior);
    $vence = $comprobante['vencimientoPago'];
    if ($comprobante['concepto'] !== 1 && $vence < $fecha) $vence = $fecha;
    $datosFactura = [
        'puntoVenta' => $config['puntoVenta'],
        'tipoComprobante' => $tipoComprobante,
        'total' => $total,
        'fecha' => $fecha,
        'concepto' => $comprobante['concepto'],
        'tipoDocumento' => $receptor['tipoDocumento'],
        'numeroDocumento' => $receptor['numeroDocumento'],
        'condicionIvaReceptor' => $receptor['condicionIvaId'],
        'servicioDesde' => $comprobante['servicioDesde'],
        'servicioHasta' => $comprobante['servicioHasta'],
        'vencimientoPago' => $vence,
    ];
    if ($tipoComprobante !== 11) $datosFactura['iva'] = $ivaDetalle;

    // El intento queda anotado ANTES de pedir el CAE: si la respuesta no llega,
    // el próximo intento con el mismo requestId lo verifica en vez de duplicar.
    $registro[$requestId] = [
        'enCurso' => true, 'puntoVenta' => (int) $config['puntoVenta'], 'tipoComprobante' => $tipoComprobante,
        'anterior' => $anterior, 'fecha' => $fecha, 'total' => $total,
        'numeroDocumento' => $receptor['numeroDocumento'], 'clienteId' => $clienteId,
        'datos' => $datosFactura, 'intentoEl' => date('c'),
    ];
    if (!guardarRegistro($config, $registro)) {
        facturador_responder(['ok' => false, 'error' => 'No se pudo guardar el registro de facturas: no se emitió nada.'], 500);
    }

    try {
        $factura = $tipoComprobante === 11
            ? $arca->emitirFacturaC($datosFactura)
            : $arca->emitirFactura($datosFactura);
    } catch (ArcaError $e) {
        // ARCA contestó y rechazó: no se emitió, el intento se borra. Si ni
        // siquiera contestó, queda anotado para verificarlo al reintentar.
        $sinRespuesta = stripos($e->getMessage(), 'Fallo la conexion') === 0 || stripos($e->getMessage(), 'Respuesta no es XML') === 0;
        if (!$sinRespuesta) {
            unset($registro[$requestId]);
            guardarRegistro($config, $registro);
        }
        facturador_responder(['ok' => false, 'rechazada' => !$sinRespuesta, 'error' => $e->getMessage()], 502);
    }
} catch (ArcaError $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Exception $e) {
    facturador_responder(['ok' => false, 'error' => 'Error inesperado: ' . $e->getMessage()], 500);
}

$factura = $factura + $extras + ['emitidaEl' => date('c')];
$registro[$requestId] = $factura;
$guardada = guardarRegistro($config, $registro);
registro_soltar($lock);

facturador_responder(['ok' => true, 'factura' => $factura] + ($guardada ? [] : ['aviso' => 'La factura se emitió pero no se pudo anotar en tu historial.']));
