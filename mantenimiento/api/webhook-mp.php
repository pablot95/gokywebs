<?php
/**
 * Webhook de suscripciones de Mercado Pago para los planes mensuales.
 *
 * Recibe la notificación de MP cuando una suscripción (preapproval) se crea o
 * cambia, consulta el detalle en la API de MP con el token, deduce el plan por
 * el preapproval_plan_id (mapa $MP_PLANES de abajo) o, como respaldo, por el
 * monto, y escribe en la colección Firestore "mantenimiento" vía REST:
 *   - status "authorized" → crea el suscriptor (ID del doc = preapproval id).
 *   - status "cancelled"  → crea el aviso de baja  (ID "baja_<preapproval id>").
 *   - status "paused"     → crea el aviso de pausa (ID "pausa_<preapproval id>").
 *   - cualquier otro (pending…) → no escribe nada.
 *
 * Modelo vigente (14-sep-2026): sin pago inicial y sin permanencia, solo la
 * suscripción mensual:
 *   - plan 'landing' → sitio profesional, $20.000/mes
 *   - plan 'mensual' → tienda online, cursos, inmobiliaria y noticias, $30.000/mes
 *   Los valores 'landing' / 'mensual' del campo `plan` se conservan porque el
 *   panel admin los usa como claves.
 *
 * - Idempotente: si MP reenvía la misma notificación, Firestore responde 409
 *   (el doc ya existe) y no se duplica nada.
 * - Escribe con la regla `create: if true` de "mantenimiento" (mismo patrón que
 *   /form → propuestas), así no hace falta service-account.json. La API key de
 *   Firebase es pública. Esa regla no deja leer ni actualizar sin login: por eso
 *   la baja no toca el doc del suscriptor, va en un doc aparte (tipoEvento
 *   "baja" / "pausa") y el admin los cruza por preapprovalId.
 *   Limitación: si una suscripción pausada se reactiva, el aviso de pausa queda
 *   hasta que se lo quita desde el admin (Mantenimiento → "Quitar aviso").
 *
 * Configurar en el panel de MP (para AMBOS planes) la URL de notificaciones:
 *   https://gokywebs.com/mantenimiento/api/webhook-mp.php
 */

// --- Mapa de planes de Mercado Pago (preapproval_plan_id → plan) ---
// El id es el valor de "preapproval_plan_id" del link de suscripción. Las dos
// constantes son los planes que ofrece la web desde el 14-sep-2026 (sin pago
// inicial); el resto sigue en el mapa para que sus suscriptores entren igual.
// Un plan que no esté en este mapa cae al respaldo por importe.
const MP_PLAN_ID_SITIO_PROFESIONAL = 'ea40c15059ec42a7ac5b6293d77ae148';   // $20.000/mes, mpago.la/1pfejMG
const MP_PLAN_ID_RESTO             = '36a67a7e42e7404989beb99703a0569b';   // $30.000/mes

$MP_PLANES = [
    MP_PLAN_ID_SITIO_PROFESIONAL => ['plan' => 'landing', 'label' => 'Plan mensual sitio profesional'],
    MP_PLAN_ID_RESTO             => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
    // Planes de $15.000 (mpago.la/1hYAiTM) y $25.000 (mpago.la/28VK7Ev): se crearon
    // y se reemplazaron el mismo 14-sep-2026. Sus suscriptores siguen entrando igual.
    'b7d653f4f61a445ba8859ae497e7ca66' => ['plan' => 'landing', 'label' => 'Plan mensual sitio profesional'],
    '56340e241c87402c81c02d43ce472fd7' => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
    // Plan viejo de 15.000/mes: ya no se ofrece en la web, pero sus suscriptores
    // existentes siguen entrando como 'mensual'.
    '17321dd1a34e4ea0979175293297d60f' => ['plan' => 'mensual', 'label' => 'Plan mensual tienda online, cursos e inmobiliaria'],
];

// Status de MP que dejan un aviso para el admin en vez de crear el suscriptor.
$MP_AVISOS = ['cancelled' => 'baja', 'paused' => 'pausa'];

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

// Escriben solo las suscripciones autorizadas (alta del suscriptor) y las
// canceladas o pausadas (aviso para el admin). Cualquier otro status, nada.
if ($status !== 'authorized' && !isset($MP_AVISOS[$status])) {
    wlog($logFile, 'skip status=' . $status . ' email=' . $email);
    http_response_code(200);
    echo 'not-authorized';
    exit;
}

// --- Deducir el plan (también para los avisos de baja / pausa) ---
// 1) Por preapproval_plan_id (mapa $MP_PLANES del principio): no depende del
//    importe, que cambia con la actualización anual del plan.
// 2) Respaldo por el monto, para planes que todavía no están en el mapa. Se
//    conservan los importes viejos para los suscriptores de los planes anteriores:
//    20.000 (vigente desde el 14-sep-2026) / 15.000, 7.000 y 10.000 (viejos) → landing;
//    30.000 (vigente desde el 14-sep-2026) / 25.000 y 15.000 (viejos) → mensual.
//    20.000 y 30.000 figuran en una sola lista cada uno. Ojo: 15.000 figura en las
//    dos; como landing se evalúa primero, un suscriptor viejo del plan 'mensual'
//    de 15.000 que no esté en $MP_PLANES caería como landing (el plan viejo de
//    15.000 sí está en el mapa).
$planId = (string)($pre['preapproval_plan_id'] ?? '');
if ($planId !== '' && isset($MP_PLANES[$planId])) {
    $plan      = $MP_PLANES[$planId]['plan'];
    $planLabel = $MP_PLANES[$planId]['label'];
} elseif (in_array($amount, [20000, 15000, 7000, 10000], true)) {
    $plan      = 'landing';
    $planLabel = $MP_PLANES[MP_PLAN_ID_SITIO_PROFESIONAL]['label'];
} elseif (in_array($amount, [30000, 25000, 15000], true)) {
    $plan      = 'mensual';
    $planLabel = $MP_PLANES[MP_PLAN_ID_RESTO]['label'];
} else {
    $plan      = 'mensual';
    $planLabel = $reason ?: 'Plan mensual';
}

// --- Crear un doc en "mantenimiento" con un ID fijo (typed values del REST API) ---
// Devuelve el código HTTP: 200 = creado, 409 = ya existía (notificación repetida).
function fsCrear($project, $apiKey, $docId, array $fields, &$respuesta = null) {
    $url = "https://firestore.googleapis.com/v1/projects/{$project}/databases/(default)/documents/mantenimiento"
         . '?documentId=' . rawurlencode($docId) . '&key=' . $apiKey;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['fields' => $fields]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 20
    ]);
    $respuesta = curl_exec($ch);
    $code      = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code;
}

// Fecha de MP ("2026-09-14T10:22:11.123-04:00") → timestamp de Firestore en UTC.
// '' si no viene o no se puede leer.
function fsFecha($iso) {
    if (!is_string($iso) || trim($iso) === '') return '';
    try {
        return gmdate('Y-m-d\TH:i:s\Z', (new DateTime($iso))->getTimestamp());
    } catch (Exception $e) {
        return '';
    }
}

$ahora = gmdate('Y-m-d\TH:i:s\Z');

// --- Cancelada o pausada: aviso aparte para el admin, nunca un suscriptor nuevo ---
// Las reglas no dejan actualizar el doc del suscriptor sin login, así que la baja
// va en su propio doc: "baja_<id>" o "pausa_<id>". Un ID por status, para que una
// pausa anterior no tape la baja que llega después. El admin lo cruza por preapprovalId.
if (isset($MP_AVISOS[$status])) {
    $tipo   = $MP_AVISOS[$status];
    $fields = [
        'tipoEvento'    => ['stringValue' => $tipo],
        'estado'        => ['stringValue' => $status],
        'preapprovalId' => ['stringValue' => (string)$preId],
        'payerId'       => ['stringValue' => $payer],
        'email'         => ['stringValue' => (string)$email],
        'plan'          => ['stringValue' => $plan],
        'planLabel'     => ['stringValue' => $planLabel],
        'monto'         => ['integerValue' => (string)$amount],
        'reason'        => ['stringValue' => (string)$reason],
        'origen'        => ['stringValue' => 'mp-webhook'],
        // Cuándo se canceló (o pausó) según MP; si no viene, cuándo llegó el aviso.
        'fechaBaja'     => ['timestampValue' => fsFecha($pre['last_modified'] ?? '') ?: $ahora],
        // Obligatorio: el admin lista "mantenimiento" ordenado por createdAt y
        // Firestore deja afuera de esa consulta a los docs que no lo tienen.
        'createdAt'     => ['timestampValue' => $ahora],
    ];
    $fechaAlta = fsFecha($pre['date_created'] ?? '');
    if ($fechaAlta !== '') $fields['fechaAlta'] = ['timestampValue' => $fechaAlta];

    $fsCode = fsCrear($FB_PROJECT, $FB_APIKEY, $tipo . '_' . $preId, $fields, $fsRes);
    if ($fsCode === 200) {
        wlog($logFile, 'OK ' . $tipo . ' email=' . $email . ' plan=' . $plan . ' id=' . $preId);
    } elseif ($fsCode === 409) {
        wlog($logFile, 'DUP ' . $tipo . ' ya registrada id=' . $preId); // notificación repetida
    } else {
        wlog($logFile, 'FS error ' . $tipo . ' http=' . $fsCode . ' res=' . substr((string)$fsRes, 0, 300));
    }
    http_response_code(200);
    echo 'ok';
    exit;
}

// --- Autorizada: armar el documento del suscriptor ---
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
    'createdAt'     => ['timestampValue' => $ahora],
];

// --- Crear en Firestore con el preapproval_id como ID (idempotente) ---
$fsCode = fsCrear($FB_PROJECT, $FB_APIKEY, $preId, $fields, $fsRes);

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
