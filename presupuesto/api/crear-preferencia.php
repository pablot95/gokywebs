<?php
/* Seña del plan anual de la calculadora /presupuesto/ (19-sep-2026; del 15 al
   19-sep fue la seña del pago único, por los mismos montos). La misma web se
   contrata con uno de dos planes: el anual (una seña para arrancar, el resto al
   entregar la web y después se renueva cada año, contado desde la seña) o el
   mensual por suscripción de Mercado Pago. Este archivo arma la preferencia de
   Checkout Pro solo para la seña: la llama handlePayment('unico') de
   presupuesto/script.js y Mercado Pago vuelve a exito.html con payment_id. La
   suscripción no pasa por acá: script.js manda directo al link del plan. */
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

// Seña del plan anual, recalculada server-side a partir del siteType: nunca se
// confía en un monto mandado desde el cliente. Sitio profesional (clave 'landing')
// $40.000 · ecommerce, inmobiliaria y elearning $60.000. Tiene que coincidir con
// SENA de presupuesto/script.js y de presupuesto/exito.html. Un tipo desconocido
// no cobra nada, antes que cobrar una seña que no corresponde.
$SENAS    = ['landing' => 40000, 'ecommerce' => 60000, 'inmobiliaria' => 60000, 'elearning' => 60000];
$siteType = is_string($body['siteType'] ?? null) ? trim($body['siteType']) : '';
if (!isset($SENAS[$siteType])) { http_response_code(400); echo json_encode(['error' => 'Tipo de web inválido']); exit; }
$sena = $SENAS[$siteType];

// El plan mensual no se cobra acá: es una suscripción de Mercado Pago
// (preapproval) y el link del plan lo abre directo presupuesto/script.js. Las altas
// y las bajas las procesa mantenimiento/api/webhook-mp.php.

$preference = [
    'items' => [[
        'id'          => 'sena-web-gokywebs',
        'title'       => 'Seña — Desarrollo Web Gokywebs',
        'description' => 'Seña del plan anual de tu sitio web. El resto se abona al entregar la web.',
        'quantity'    => 1,
        'currency_id' => 'ARS',
        'unit_price'  => $sena
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
