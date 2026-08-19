<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Método no permitido']); exit; }

$configPath = __DIR__ . '/../../config/mp-config.php';
if (!file_exists($configPath)) { http_response_code(500); echo json_encode(['error' => 'Configuración no disponible']); exit; }
require $configPath;

$ACCESS_TOKEN = MP_ACCESS_TOKEN;
$BASE_URL     = 'https://gokywebs.com/pago';

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(['error' => 'Payload inválido']); exit; }

$nombre    = htmlspecialchars(trim($body['nombre']    ?? ''), ENT_QUOTES);
$whatsapp  = htmlspecialchars(trim($body['whatsapp']  ?? ''), ENT_QUOTES);
$reference = htmlspecialchars(trim($body['reference'] ?? ('GKY-PAGO-' . time() . '-' . rand(1000,9999))), ENT_QUOTES);

// Monto dinámico (?monto= en pago/index.html → enviado acá en el body). Se recalcula
// server-side por seguridad (nunca confiar en el unit_price que mandaría el cliente
// sin validar): entero, dentro de un rango razonable; si falta o es inválido, cae al
// default histórico de $90.000.
$montoRaw = $body['monto'] ?? null;
$monto    = is_numeric($montoRaw) ? (int) $montoRaw : 90000;
if ($monto < 1000 || $monto > 5000000) $monto = 90000;

$descripcion = 'Seña para arrancar el proyecto' . ($whatsapp !== '' ? ' (' . $whatsapp . ')' : '');

$preference = [
    'items' => [[
        'id'          => 'sena-web-gokywebs',
        'title'       => 'Seña — Desarrollo Web Gokywebs',
        'description' => $descripcion,
        'quantity'    => 1,
        'currency_id' => 'ARS',
        'unit_price'  => $monto
    ]],
    'payer' => ['name' => $nombre],
    'back_urls' => [
        'success' => $BASE_URL . '/exito.html?monto=' . $monto,
        // Lleva el monto también en el retry, si no el que reintenta después de un pago
        // fallido cae al default $90.000 en vez del monto real que estaba pagando.
        'failure' => $BASE_URL . '/?pago=fallido&monto=' . $monto,
        'pending' => $BASE_URL . '/exito.html?status=pending&monto=' . $monto
    ],
    'auto_return'          => 'approved',
    'external_reference'   => $reference,
    'statement_descriptor' => 'GOKYWEBS',
    'notification_url'     => 'https://gokywebs.com/presupuesto/api/webhook-mp.php'
];

$ch = curl_init('https://api.mercadopago.com/checkout/preferences');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($preference),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $ACCESS_TOKEN
    ]
]);

$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($err) { http_response_code(500); echo json_encode(['error' => $err]); exit; }
http_response_code($code);
echo $res;
?>
