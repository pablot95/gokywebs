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

// Monto dinámico (?monto= en pago/index.html → enviado acá en el body). Se valida
// server-side por seguridad (nunca confiar en el unit_price que mandaría el cliente
// sin validar): entero, dentro de un rango razonable. Desde el 14-sep-2026 no hay
// monto por defecto (el que había era el del modelo anterior): sin un monto válido
// no se crea la preferencia. El servicio mensual no pasa por acá: va por
// suscripción de Mercado Pago.
$montoRaw = $body['monto'] ?? null;
$monto    = is_numeric($montoRaw) ? (int) $montoRaw : 0;
if ($monto < 1000 || $monto > 5000000) { http_response_code(400); echo json_encode(['error' => 'Monto inválido']); exit; }

$descripcion = 'Pago a Gokywebs' . ($whatsapp !== '' ? ' (' . $whatsapp . ')' : '');

$preference = [
    'items' => [[
        'id'          => 'pago-web-gokywebs',
        'title'       => 'Pago — Gokywebs',
        'description' => $descripcion,
        'quantity'    => 1,
        'currency_id' => 'ARS',
        'unit_price'  => $monto
    ]],
    // Con tarjeta se puede pagar hasta en 12 cuotas (con interés: el valor de cada
    // cuota lo calcula la tarjeta, acá no se escribe nunca).
    'payment_methods' => ['installments' => 12],
    'payer' => ['name' => $nombre],
    'back_urls' => [
        'success' => $BASE_URL . '/exito.html?monto=' . $monto,
        // Lleva el monto también en el retry: sin él, el que reintenta después de un
        // pago fallido volvería a una página sin monto y no podría pagar con Mercado Pago.
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
