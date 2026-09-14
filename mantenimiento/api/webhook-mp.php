<?php
/**
 * Webhook de suscripciones de Mercado Pago para los planes mensuales.
 *
 * Recibe la notificación de MP cuando alguien se suscribe (preapproval),
 * consulta el detalle en la API de MP con el token, deduce el plan por el
 * preapproval_plan_id (mapa $MP_PLANES de abajo) o, como respaldo, por el
 * monto, y crea el suscriptor en la colección Firestore "mantenimiento" vía REST.
 *
 * Planes vigentes (modelo del 10-sep-2026):
 *   - plan 'landing' → plan mensual del sitio profesional ($15.000/mes desde el 14-sep-2026; antes $20.000)
 *   - plan 'mensual' → plan mensual de tienda online, cursos e inmobiliaria ($25.000/mes desde el 14-sep-2026; antes $30.000)
 *   Los valores 'landing' / 'mensual' del campo `plan` se conservan porque el
 *   panel admin los usa como claves.
 *
 * - Usa el preapproval_id como ID del documento → idempotente: si MP reenvía
 *   la misma notificación, Firestore responde 409 (ya existe) y no duplica.
 * - Escribe con la regla `create: if true` (mismo patrón que /form → propuestas),
 *   así no hace falta service-account.json. La API key de Firebase es pública.
 *
 * Configurar en el panel de MP (para AMBOS planes) la URL de notificaciones:
 *   https://gokywebs.com/mantenimiento/api/webhook-mp.php
 */

// --- Mapa de planes de Mercado Pago (preapproval_plan_id → plan) ---
// Los dos planes del modelo nuevo (10-sep-2026). El id es el valor de
// "preapproval_plan_id" del link de suscripción: el del sitio profesional
// ($20.000/mes, link viejo mpago.la/1pfejMG) y el del resto ($30.000/mes). Desde el
// 14-sep-2026 la web ofrece los planes nuevos mpago.la/1hYAiTM ($15.000/mes) y
// mpago.la/28VK7Ev ($25.000/mes), con los ids de abajo. Los planes viejos siguen
// en el mapa para sus suscriptores.
// Un plan que no esté en este mapa cae al respaldo por importe.
const MP_PLAN_ID_SITIO_PROFESIONAL = 'b7d653f4f61a445ba8859ae497e7ca66';   // $15.000/mes, mpago.la/1hYAiTM (14-sep-2026)
const MP_PLAN_ID_RESTO             = '56340e241c87402c81c02d43ce472fd7';   // $25.000/mes, mpago.la/28VK7Ev (14-sep-2026)

$MP_PLANES = [
    MP_PLAN_ID_SITIO_PROFESIONAL => ['plan' => 'landing', 'label' => 'Plan mensual sitio profesional'],
    MP_PLAN_ID_RESTO             => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
    // Planes de $20.000 y $30.000 (10 al 14-sep-2026): sus suscriptores siguen entrando igual.
    'ea40c15059ec42a7ac5b6293d77ae148' => ['plan' => 'landing', 'label' => 'Plan mensual sitio profesional'],
    '36a67a7e42e7404989beb99703a0569b' => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
    // Plan viejo de 15.000/mes: ya no se ofrece en la web, pero sus suscriptores
    // existentes siguen entrando como 'mensual'.
    '17321dd1a34e4ea0979175293297d60f' => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
];

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

// --- Deducir el plan ---
// 1) Por preapproval_plan_id (mapa $MP_PLANES del principio): no depende del
//    importe, que cambia con la actualización anual del plan.
// 2) Respaldo por el monto, para planes que todavía no están en el mapa. Se
//    conservan los importes viejos para los suscriptores de los planes anteriores:
//    15.000 (vigente desde el 14-sep-2026) / 20.000, 7.000 y 10.000 (viejos) → landing;
//    25.000 (vigente desde el 14-sep-2026) / 30.000 y 15.000 (viejos) → mensual.
//    Ojo: 15.000 figura en las dos listas; como landing se evalúa primero, un
//    suscriptor viejo del plan 'mensual' de 15.000 que no esté en $MP_PLANES
//    caería como landing (el plan viejo de 15.000 sí está en el mapa).
$planId = (string)($pre['preapproval_plan_id'] ?? '');
if ($planId !== '' && isset($MP_PLANES[$planId])) {
    $plan      = $MP_PLANES[$planId]['plan'];
    $planLabel = $MP_PLANES[$planId]['label'];
} elseif (in_array($amount, [15000, 20000, 7000, 10000], true)) {
    $plan      = 'landing';
    $planLabel = $MP_PLANES[MP_PLAN_ID_SITIO_PROFESIONAL]['label'];
} elseif (in_array($amount, [25000, 30000, 15000], true)) {
    $plan      = 'mensual';
    $planLabel = $MP_PLANES[MP_PLAN_ID_RESTO]['label'];
} else {
    $plan      = 'mensual';
    $planLabel = $reason ?: 'Plan mensual';
}

// --- Armar el documento Firestore (typed values del REST API) ---
$fields = [
    'nombre'        => ['stringValue' => ''],
    'email'         => ['stringValue' => (string)$email],
    'whatsapp'      => ['stringValue' => ''],
    'plan'          => ['stringValue' => $plan],
    'planLabel'     => ['stringValue' => $planLabel],
    'estado'        => ['stringValue' => 'activo'],
    'monto'         => ['integerValue' => (string)$amount],
    'montoMensual'  => ['integerValue' => (string)$amount],
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
    wlog($logFile, 'OK creado email=' . $email . ' plan=' . $plan . ' planId=' . $planId . ' $' . $amount);
} elseif ($fsCode === 409) {
    wlog($logFile, 'DUP ya existía id=' . $preId); // notificación repetida
} else {
    wlog($logFile, 'FS error http=' . $fsCode . ' res=' . substr((string)$fsRes, 0, 300));
}

http_response_code(200);
echo 'ok';
?>
