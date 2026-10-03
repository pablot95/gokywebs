<?php

/**
 * Facturas emitidas (3-oct-2026): la lista de todo el registro y la descarga,
 * de a una o todas juntas en un .zip. Los PDF salen del archivo del server
 * (config/arca/archivo.php); los que todavía no estaban guardados se arman y
 * se guardan en el momento.
 *
 *   GET ?accion=lista              → { ok, facturas: [...], meses: ["2026-10", ...] }
 *   GET ?accion=pdf&clave=<clave>  → el PDF de una factura
 *   GET ?accion=zip[&mes=AAAA-MM]  → un .zip con todas (o las de ese mes)
 */

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/registro.php';
require __DIR__ . '/../../config/arca/archivo.php';

function responder_json($datos, $codigo = 200)
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function responder_archivo($contenido, $tipo, $nombre)
{
    header('Content-Type: ' . $tipo);
    // filename* para las tildes; el ASCII de respaldo para navegadores viejos.
    $ascii = preg_replace('/[^A-Za-z0-9 ._()-]/', '_', $nombre);
    header('Content-Disposition: attachment; filename="' . $ascii . '"; filename*=UTF-8\'\'' . rawurlencode($nombre));
    header('X-Nombre-Archivo: ' . rawurlencode($nombre));
    header('Content-Length: ' . strlen($contenido));
    header('Cache-Control: no-store');
    echo $contenido;
    exit;
}

if (!verifyAdminToken()) {
    responder_json(['ok' => false, 'error' => 'No autorizado'], 401);
}

$config = require __DIR__ . '/../../config/arca/arca-config.php';
$accion = $_GET['accion'] ?? 'lista';

try {
    $registro = registro_leer($config);
} catch (RuntimeException $e) {
    responder_json(['ok' => false, 'error' => $e->getMessage()], 500);
}

if ($accion === 'lista') {
    $facturas = [];
    $meses = [];
    foreach (archivo_facturas($registro) as $clave => $f) {
        $mes = substr((string) $f['fecha'], 0, 4) . '-' . substr((string) $f['fecha'], 4, 2);
        $meses[$mes] = true;
        $facturas[] = [
            'clave' => $clave,
            'puntoVenta' => (int) $f['puntoVenta'],
            'numero' => (int) $f['numero'],
            'fecha' => (string) $f['fecha'],
            'mes' => $mes,
            'total' => (float) $f['total'],
            'cliente' => (string) ($f['cliente'] ?? ''),
            'receptor' => $f['receptor'] ?? null,
            'descripcion' => (string) ($f['descripcion'] ?? ''),
            // automatica / lista (facturación de suscripciones) o el modal de siempre.
            'origen' => (string) ($f['origen'] ?? 'modal'),
            'guardada' => is_file(archivo_ruta($config, $f)),
        ];
    }
    responder_json(['ok' => true, 'facturas' => $facturas, 'meses' => array_keys($meses)]);
}

if ($accion === 'pdf') {
    $clave = (string) ($_GET['clave'] ?? '');
    $factura = $registro[$clave] ?? null;
    if (!archivo_es_factura($factura)) responder_json(['ok' => false, 'error' => 'No existe esa factura.'], 404);
    try {
        $pdf = archivo_pdf($config, $factura);
    } catch (Throwable $e) {
        responder_json(['ok' => false, 'error' => 'No se pudo armar el PDF: ' . $e->getMessage()], 500);
    }
    responder_archivo($pdf, 'application/pdf', archivo_nombre_en_zip($factura));
}

if ($accion === 'zip') {
    $mes = (string) ($_GET['mes'] ?? '');
    if ($mes !== '' && !preg_match('/^\d{4}-\d{2}$/', $mes)) responder_json(['ok' => false, 'error' => 'Mes inválido.'], 400);
    $facturas = archivo_facturas($registro, $mes);
    if (!$facturas) responder_json(['ok' => false, 'error' => 'No hay facturas' . ($mes !== '' ? ' de ese mes.' : '.')], 404);

    @set_time_limit(120);
    $archivos = [];
    $fallaron = [];
    foreach (array_reverse($facturas, true) as $clave => $f) {
        try {
            $archivos[archivo_nombre_en_zip($f)] = archivo_pdf($config, $f);
        } catch (Throwable $e) {
            $fallaron[] = comprobante_nombre_archivo($f + ['tipoComprobante' => 11]) . ': ' . $e->getMessage();
        }
    }
    if ($fallaron) $archivos['NO SE PUDIERON ARMAR.txt'] = implode("\r\n", $fallaron) . "\r\n";

    $nombre = 'Facturas Gokywebs ' . ($mes !== '' ? $mes : 'todas hasta ' . gmdate('Y-m-d')) . '.zip';
    responder_archivo(archivo_zip($archivos), 'application/zip', $nombre);
}

responder_json(['ok' => false, 'error' => 'Acción desconocida'], 400);
