<?php

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/arca.php';

header('Content-Type: application/json; charset=utf-8');

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!verifyAdminToken()) {
    responder(['ok' => false, 'error' => 'No autorizado'], 401);
}

$config = require __DIR__ . '/../../config/arca/arca-config.php';

try {
    $arca = new Arca($config);
} catch (Exception $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

$accion = $_GET['accion'] ?? 'emitir';

if ($accion === 'proximo') {
    try {
        responder([
            'ok' => true,
            'entorno' => $config['entorno'],
            'puntoVenta' => $config['puntoVenta'],
            'proximoNumero' => $arca->ultimoComprobante($config['puntoVenta'], 11) + 1,
        ]);
    } catch (Exception $e) {
        responder(['ok' => false, 'error' => $e->getMessage()], 502);
    }
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(['ok' => false, 'error' => 'Cuerpo invalido'], 400);
}

$requestId = trim((string) ($entrada['requestId'] ?? ''));
$clienteId = trim((string) ($entrada['clienteId'] ?? ''));
$total = round((float) ($entrada['total'] ?? 0), 2);
$documento = preg_replace('/\D/', '', (string) ($entrada['documento'] ?? ''));

if ($requestId === '') responder(['ok' => false, 'error' => 'Falta el identificador del pedido'], 400);
if ($clienteId === '') responder(['ok' => false, 'error' => 'Falta el identificador del cliente'], 400);
if ($total <= 0) responder(['ok' => false, 'error' => 'El importe tiene que ser mayor a cero'], 400);

$registro = is_readable($config['registro'])
    ? json_decode(file_get_contents($config['registro']), true)
    : [];
if (!is_array($registro)) $registro = [];

if (isset($registro[$requestId])) {
    responder(['ok' => true, 'yaEmitida' => true, 'factura' => $registro[$requestId]]);
}

if ($documento === '') {
    $tipoDocumento = 99;
    $numeroDocumento = 0;
    $condicionIva = 5;
} elseif (strlen($documento) === 11) {
    $tipoDocumento = 80;
    $numeroDocumento = $documento;
    $condicionIva = (int) ($entrada['condicionIva'] ?? 6);
} else {
    $tipoDocumento = 96;
    $numeroDocumento = $documento;
    $condicionIva = 5;
}

try {
    $factura = $arca->emitirFacturaC([
        'puntoVenta' => $config['puntoVenta'],
        'total' => $total,
        'tipoDocumento' => $tipoDocumento,
        'numeroDocumento' => $numeroDocumento,
        'condicionIvaReceptor' => $condicionIva,
        'servicioDesde' => date('Ymd', strtotime('-30 days')),
        'servicioHasta' => date('Ymd'),
        'vencimientoPago' => date('Ymd'),
    ]);
} catch (ArcaError $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Exception $e) {
    responder(['ok' => false, 'error' => 'Error inesperado: ' . $e->getMessage()], 500);
}

$factura['entorno'] = $config['entorno'];
$factura['cliente'] = trim((string) ($entrada['cliente'] ?? ''));
$factura['clienteId'] = $clienteId;
$factura['emitidaEl'] = date('c');

$registro[$requestId] = $factura;
file_put_contents($config['registro'], json_encode($registro, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

responder(['ok' => true, 'factura' => $factura]);
