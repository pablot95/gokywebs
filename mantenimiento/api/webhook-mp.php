<?php
/**
 * Webhook de suscripciones de Mercado Pago para los planes de mantenimiento.
 *
 * Recibe la notificación de MP cuando alguien se suscribe (preapproval),
 * consulta el detalle en la API de MP con el token, deduce el plan por el
 * monto ($7.000 = landing / $15.000 = mensual) y crea el suscriptor en la
 * colección Firestore "mantenimiento" vía REST.
 *
 * - Usa el preapproval_id como ID del documento → idempotente: si MP reenvía
 *   la misma notificación, Firestore responde 409 (ya existe) y no duplica.
 * - Escribe con la regla `create: if true` (mismo patrón que /form → propuestas),
 *   así no hace falta service-account.json. La API key de Firebase es pública.
 *
 * Configurar en el panel de MP (para AMBOS planes) la URL de notificaciones:
 *   https://gokywebs.com/mantenimiento/api/webhook-mp.php
 */

// --- Config: token secreto de MP (fuera del webroot) ---
$configPath = __DIR__ . '/../../config/mp-config.php';
if (!file_exists($configPath)) { http_response_code(200); echo 'no-config'; exit; }
require $configPath;

// --- Datos públicos de Firebase (ya expuestos en admin/firebase-config.js) ---
$FB_PROJECT = 'gokywebs-967cd';
$FB_APIKEY  = 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ';

// --- Log para debug (mismo patrón que presupuesto/api/webhook-mp.php) ---
$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
$logFile = $logDir . '/webhook.log';
function wlog($logFile, $msg) { @file_put_contents($logFile, date('Y-m-d H:i:s') . ' | ' . $msg . PHP_EOL, FILE_APPEND | LOCK_EX); }

// --- Leer la notificación (MP la manda por query o por JSON body) ---
$body  = json_decode(file_get_contents('php://input'), true) ?: [];
$topic = $_GET['topic'] ?? $_GET['type'] ?? ($body['type'] ?? '');
$preId = $_GET['id'] ?? ($_GET['data_id'] ?? ($body['data']['id'] ?? ''));

wlog($logFile, 'IN topic=' . $topic . ' id=' . $preId);

// Solo nos interesan las notificaciones de suscripción (preapproval).
// Cualquier otra (payment recurrente, test, etc.) → 200 y listo, sin escribir.
if (stripos($topic, 'preapproval') === false || !$preId) {
    http_response_code(200);
    echo 'ignored';
    exit;
}

// --- Consultar el detalle del preapproval en MP ---
$ch = curl_init('https://api.mercadopago.com/preapproval/' . rawurlencode($preId));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . MP_ACCESS_TOKEN],
    CURLOPT_TIMEOUT        => 20
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
    wlog($logFile, 'MP preapproval error http=' . $code . ' res=' . substr((string)$res, 0, 300));
    http_response_code(200); // no reintentar en loop
    echo 'mp-error';
    exit;
}

$pre    = json_decode($res, true) ?: [];
$status = $pre['status'] ?? '';
$email  = $pre['payer_email'] ?? '';
$payer  = (string)($pre['payer_id'] ?? '');
$reason = $pre['reason'] ?? '';
$amount = (int) round($pre['auto_recurring']['transaction_amount'] ?? 0);

// Solo registramos suscripciones activas (autorizadas). Pausadas / canceladas
// se gestionan a mano desde el admin (limitación conocida del v1).
if ($status !== 'authorized') {
    wlog($logFile, 'skip status=' . $status . ' email=' . $email);
    http_response_code(200);
    echo 'not-authorized';
    exit;
}

// --- Deducir el plan por el monto ---
if ($amount === 7000)       { $plan = 'landing'; $planLabel = 'Mantenimiento Landing'; }
elseif ($amount === 15000)  { $plan = 'mensual'; $planLabel = 'Mantenimiento Mensual'; }
else                        { $plan = 'mensual'; $planLabel = $reason ?: 'Mantenimiento'; }

// --- Armar el documento Firestore (typed values del REST API) ---
$fields = [
    'nombre'        => ['stringValue' => ''],
    'email'         => ['stringValue' => (string)$email],
    'whatsapp'      => ['stringValue' => ''],
    'plan'          => ['stringValue' => $plan],
    'planLabel'     => ['stringValue' => $planLabel],
    'estado'        => ['stringValue' => 'activo'],
    'monto'         => ['integerValue' => (string)$amount],
    'origen'        => ['stringValue' => 'mp-webhook'],
    'preapprovalId' => ['stringValue' => (string)$preId],
    'payerId'       => ['stringValue' => $payer],
    'cambiosMes'    => ['stringValue' => ''],
    'createdAt'     => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
];

// --- Crear en Firestore con el preapproval_id como ID (idempotente) ---
$fsUrl = "https://firestore.googleapis.com/v1/projects/{$FB_PROJECT}/databases/(default)/documents/mantenimiento"
       . '?documentId=' . rawurlencode($preId) . '&key=' . $FB_APIKEY;

$ch = curl_init($fsUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['fields' => $fields]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 20
]);
$fsRes  = curl_exec($ch);
$fsCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($fsCode === 200) {
    wlog($logFile, 'OK creado email=' . $email . ' plan=' . $plan . ' $' . $amount);
} elseif ($fsCode === 409) {
    wlog($logFile, 'DUP ya existía id=' . $preId); // notificación repetida
} else {
    wlog($logFile, 'FS error http=' . $fsCode . ' res=' . substr((string)$fsRes, 0, 300));
}

http_response_code(200);
echo 'ok';
?>
