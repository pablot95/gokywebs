<?php
/* Webhook de Mercado Pago de la calculadora /presupuesto/ (notification_url de la
   preferencia del primer pago que arma api/crear-preferencia.php). Solo deja una
   línea por notificación en ../logs/webhook.log.

   Modelo 10-sep-2026 (primer pago + plan mensual): si MP manda acá eventos de la
   suscripción del plan mensual — preapproval / subscription_preapproval (alta,
   pausa, baja) o subscription_authorized_payment (cada cobro mensual, aprobado o
   rechazado) — se loguean con la marca [PLAN MENSUAL] para encontrarlos con grep.

   TODO (Pablo): este webhook no escribe a Firestore (acá no hay credenciales).
   Las altas del plan las procesa mantenimiento/api/webhook-mp.php, pero todavía
   nadie registra los cobros rechazados ni las bajas: hace falta que ese estado
   llegue al admin para saber a quién desactivar la web cuando deja de pagar. */
$payload = file_get_contents('php://input');
$data    = json_decode($payload, true);
if (!is_array($data)) $data = [];

$logDir  = __DIR__ . '/../logs';
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
$logFile = $logDir . '/webhook.log';

// MP manda el tipo en el body (webhooks) o por query (IPN: ?topic=...&id=...).
// Se limpia antes de loguearlo para que no pueda meter saltos de línea en el log.
$type = (string)($data['type'] ?? $data['topic'] ?? $_GET['type'] ?? $_GET['topic'] ?? '-');
$type = preg_replace('/[^A-Za-z0-9_.\-]/', '', $type) ?: '-';
$datos = $data['data'] ?? array_filter(['id' => $_GET['id'] ?? $_GET['data_id'] ?? null]);

$esPlanMensual = stripos($type, 'preapproval') !== false || stripos($type, 'authorized_payment') !== false;
$marca = $esPlanMensual ? '[PLAN MENSUAL] | ' : '';

$entry = date('Y-m-d H:i:s') . ' | ' . $marca . 'type=' . $type . ' | data=' . json_encode($datos) . PHP_EOL;
file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);

http_response_code(200);
echo 'OK';
?>
