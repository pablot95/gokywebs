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

// Primer pago (modelo 10-sep-2026: primer pago + plan mensual obligatorio). Se
// recalcula server-side a partir del siteType, nunca se confía en un monto mandado
// desde el cliente: sitio profesional (clave 'landing') $60.000 · ecommerce,
// inmobiliaria y elearning $90.000. Tiene que coincidir con PRIMER_PAGO de
// presupuesto/script.js y de presupuesto/exito.html.
$siteType   = trim($body['siteType'] ?? '');
$primerPago = ($siteType === 'landing') ? 60000 : 90000;

// TODO (Pablo): el plan mensual NO se crea acá. Es una suscripción automática de
// Mercado Pago (preapproval) que arranca a los 30 días del primer pago: $20.000/mes
// sitio profesional, $30.000/mes el resto. Se da de alta desde la cuenta de MP de
// Gokywebs y las altas las procesa mantenimiento/api/webhook-mp.php (crea el
// suscriptor en Firestore /mantenimiento; ahí falta pegar los ids de los dos
// planes nuevos). Para que el primer débito caiga a los 30 días, el plan tiene que
// tener un mes de prueba (free_trial) o el link se manda a los 30 días.
// Si algún día se crea por API: sin preapproval_plan_id (con plan, MP exige
// card_token_id) y cancelando el preapproval anterior antes de crear otro.

$preference = [
    'items' => [[
        'id'          => 'primer-pago-web-gokywebs',
        'title'       => 'Primer pago — Desarrollo Web Gokywebs',
        'description' => 'Primer pago para el desarrollo de tu sitio web. El plan mensual arranca a los 30 días.',
        'quantity'    => 1,
        'currency_id' => 'ARS',
        'unit_price'  => $primerPago
    ]],
    'payer' => ['name' => $nombre, 'email' => $email],
    // Con tarjeta, hasta 12 cuotas con interés: el valor de cada cuota lo calcula
    // la tarjeta y no se escribe en ningún texto.
    'payment_methods' => ['installments' => 12],
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
