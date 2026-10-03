<?php

/**
 * Archivo de las facturas emitidas (3-oct-2026): cada factura queda guardada
 * como PDF en el server, tal cual salió, y el admin baja todas (o las de un mes)
 * en un .zip con un clic (admin/api/facturas.php).
 *
 * El registro (emitidas-<entorno>.json) ya tiene los datos de cada factura; el
 * PDF se guarda aparte para que no cambie si algún día cambia el diseño del
 * comprobante. Se guarda al emitir (admin/api/facturar.php y la facturación
 * automática de suscripciones.php) y, para las que se emitieron antes de esto
 * o si el guardado falló, la primera vez que se piden.
 *
 * Carpeta: config/arca/facturas-<entorno>/ (config/ no se sirve por HTTP y la
 * carpeta no va al repo). Un archivo por comprobante, con el nombre de siempre:
 * "Factura C 00010-00000121.pdf".
 */

require_once __DIR__ . '/comprobante.php';

function archivo_dir(array $config)
{
    return $config['archivo'] ?? (dirname($config['registro']) . '/facturas-' . $config['entorno']);
}

// ¿Tiene lo mínimo para armar el comprobante? (lo mismo que pide admin/api/comprobante.php)
function archivo_es_factura($factura)
{
    if (!is_array($factura)) return false;
    foreach (['puntoVenta', 'numero', 'fecha', 'total', 'cae', 'caeVence'] as $campo) {
        if (!isset($factura[$campo]) || $factura[$campo] === '') return false;
    }
    return true;
}

function archivo_ruta(array $config, array $factura)
{
    if (!isset($factura['tipoComprobante'])) $factura['tipoComprobante'] = 11;
    return archivo_dir($config) . '/' . comprobante_nombre_archivo($factura);
}

/**
 * El PDF de una factura: el guardado si existe; si no, se arma y se guarda.
 * @throws RuntimeException si no se puede armar.
 */
function archivo_pdf(array $config, array $factura)
{
    if (!archivo_es_factura($factura)) throw new RuntimeException('Faltan datos de la factura.');
    // Sin emisor, comprobante_pdf arma igual un PDF con huecos: mejor no guardar eso.
    if (empty($config['emisor']['razonSocial']) || empty($config['cuit'])) throw new RuntimeException('Faltan los datos del emisor.');
    if (!isset($factura['tipoComprobante'])) $factura['tipoComprobante'] = 11;

    $ruta = archivo_ruta($config, $factura);
    if (is_file($ruta)) {
        $pdf = @file_get_contents($ruta);
        if (is_string($pdf) && $pdf !== '') return $pdf;
    }

    $pdf = comprobante_pdf($config, $factura);
    archivo_escribir($ruta, $pdf);
    return $pdf;
}

/**
 * Guarda el PDF recién emitido. Nunca frena una emisión: la factura ya tiene
 * CAE y está en el registro, así que si esto falla se arma cuando se pida.
 * Devuelve true si quedó guardado.
 */
function archivo_guardar(array $config, $factura)
{
    try {
        archivo_pdf($config, (array) $factura);
        return true;
    } catch (Throwable $e) {
        return false;
    }
}

function archivo_escribir($ruta, $contenido)
{
    $dir = dirname($ruta);
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) return false;
    $temporal = $ruta . '.tmp' . getmypid();
    if (@file_put_contents($temporal, $contenido, LOCK_EX) === false) return false;
    if (!@rename($temporal, $ruta)) {
        @unlink($temporal);
        return false;
    }
    return true;
}

/**
 * Las facturas del registro, de la más nueva a la más vieja. $mes "AAAA-MM"
 * filtra por la fecha del comprobante; vacío = todas.
 */
function archivo_facturas(array $registro, $mes = '')
{
    $filtro = preg_match('/^(\d{4})-(\d{2})$/', (string) $mes, $m) ? $m[1] . $m[2] : '';
    $facturas = [];
    foreach ($registro as $clave => $factura) {
        if (!archivo_es_factura($factura)) continue;
        if ($filtro !== '' && strpos((string) $factura['fecha'], $filtro) !== 0) continue;
        $facturas[(string) $clave] = $factura;
    }
    uasort($facturas, function ($a, $b) {
        return [(int) $b['puntoVenta'], (int) $b['numero']] <=> [(int) $a['puntoVenta'], (int) $a['numero']];
    });
    return $facturas;
}

// Nombre dentro del .zip: el del comprobante más el cliente, para que el contador no tenga que abrirlas.
function archivo_nombre_en_zip(array $factura)
{
    if (!isset($factura['tipoComprobante'])) $factura['tipoComprobante'] = 11;
    $base = preg_replace('/\.pdf$/', '', comprobante_nombre_archivo($factura));
    $cliente = trim(preg_replace('/[\\\\\/:*?"<>|\x00-\x1F]+/u', ' ', (string) ($factura['cliente'] ?? '')));
    $cliente = rtrim(mb_substr(preg_replace('/\s+/u', ' ', $cliente), 0, 60), ' .');
    return $base . ($cliente !== '' ? ' - ' . $cliente : '') . '.pdf';
}

/**
 * Arma un .zip con [nombre => contenido]. Escrito a mano (deflate de zlib) para
 * no depender de que el server tenga la extensión zip.
 */
function archivo_zip(array $archivos)
{
    $locales = '';
    $central = '';
    $cantidad = 0;
    $hora = getdate();
    $dosHora = ($hora['hours'] << 11) | ($hora['minutes'] << 5) | intdiv($hora['seconds'], 2);
    $dosFecha = (max($hora['year'] - 1980, 0) << 9) | ($hora['mon'] << 5) | $hora['mday'];

    foreach ($archivos as $nombre => $contenido) {
        $nombre = (string) $nombre;
        $contenido = (string) $contenido;
        $crc = crc32($contenido);
        $comprimido = gzdeflate($contenido, 6);
        $metodo = 8;
        if ($comprimido === false || strlen($comprimido) >= strlen($contenido)) {
            $comprimido = $contenido;
            $metodo = 0;
        }
        // Bit 11: el nombre va en UTF-8 (tildes y eñes de los clientes).
        $comun = pack('vvvvVVVv', 0x0800, $metodo, $dosHora, $dosFecha, $crc, strlen($comprimido), strlen($contenido), strlen($nombre));
        $desplazamiento = strlen($locales);
        $locales .= "PK\x03\x04" . pack('v', 20) . $comun . pack('v', 0) . $nombre . $comprimido;
        $central .= "PK\x01\x02" . pack('vv', 20, 20) . $comun . pack('vvvvVV', 0, 0, 0, 0, 0, $desplazamiento) . $nombre;
        $cantidad++;
    }

    return $locales . $central
        . "PK\x05\x06" . pack('vvvvVVv', 0, 0, $cantidad, $cantidad, strlen($central), strlen($locales), 0);
}
