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
$BASE_URL     = 'https://gokywebs.com/presupuesto';

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { http_response_code(400); echo json_encode(['error' => 'Payload inválido']); exit; }

$nombre    = htmlspecialchars(trim($body['nombre']    ?? ''), ENT_QUOTES);
$email     = filter_var(trim($body['email']           ?? ''), FILTER_SANITIZE_EMAIL);
$reference = htmlspecialchars(trim($body['reference'] ?? ('GKY-' . time() . '-' . rand(1000,9999))), ENT_QUOTES);

// Seña por franja (24-jul-2026): landing puro $60.000 · el resto $90.000 — se recalcula
// server-side a partir del siteType (nunca se confía en un monto mandado directo desde
// el cliente), mismo criterio que PRICING.*.sena de /form/script.js.
$siteType = trim($body['siteType'] ?? '');
$sena     = ($siteType === 'landing') ? 60000 : 90000;

$preference = [
    'items' => [[
        'id'          => 'sena-web-gokywebs',
        'title'       => 'Seña — Desarrollo Web Gokywebs',
        'description' => 'Seña inicial para el desarrollo de tu sitio web.',
        'quantity'    => 1,
        'currency_id' => 'ARS',
        'unit_price'  => $sena
    ]],
    'payer' => ['name' => $nombre, 'email' => $email],
    'back_urls' => [
        'success' => $BASE_URL . '/exito.html',
        'failure' => $BASE_URL . '/?pago=fallido',
        'pending' => $BASE_URL . '/exito.html?status=pending'
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
