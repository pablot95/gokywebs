<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';
require __DIR__ . '/../../config/arca/comprobante.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

// El PDF no firma nada: no hace falta el certificado, solo los datos del emisor.
$config = facturador_arca_config($uid, false);
if (!$config) {
    facturador_responder(['ok' => false, 'necesitaConfiguracion' => true, 'error' => 'Todavía no terminaste de configurar ARCA.']);
}

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
    facturador_responder(['ok' => false, 'error' => 'Faltan datos de la factura: ' . implode(', ', $faltan)], 400);
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
