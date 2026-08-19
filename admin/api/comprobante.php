<?php

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/comprobante.php';

if (!verifyAdminToken()) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'No autorizado']);
    exit;
}

$config = require __DIR__ . '/../../config/arca/arca-config.php';
$entrada = json_decode(file_get_contents('php://input'), true);

$factura = is_array($entrada) && isset($entrada['factura']) ? $entrada['factura'] : null;
if (!$factura && is_array($entrada) && !empty($entrada['clienteId'])) {
    $registro = is_readable($config['registro'])
        ? json_decode(file_get_contents($config['registro']), true)
        : [];
    if (is_array($registro)) {
        foreach ($registro as $candidata) {
            if (($candidata['clienteId'] ?? null) !== $entrada['clienteId']) continue;
            if (!$factura || ($candidata['emitidaEl'] ?? '') > ($factura['emitidaEl'] ?? '')) $factura = $candidata;
        }
    }
}

$faltan = [];
foreach (['puntoVenta', 'numero', 'fecha', 'total', 'cae', 'caeVence'] as $campo) {
    if (!isset($factura[$campo]) || $factura[$campo] === '') $faltan[] = $campo;
}
if ($faltan) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Faltan datos de la factura: ' . implode(', ', $faltan)]);
    exit;
}

if (!isset($factura['tipoComprobante'])) $factura['tipoComprobante'] = 11;

if (($_GET['formato'] ?? 'pdf') === 'html') {
    header('Content-Type: text/html; charset=utf-8');
    echo comprobante_html($config, $factura);
    exit;
}

$pdf = comprobante_pdf($config, $factura);
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . comprobante_nombre_archivo($factura) . '"');
header('Content-Length: ' . strlen($pdf));
header('X-Nombre-Archivo: ' . comprobante_nombre_archivo($factura));
echo $pdf;
