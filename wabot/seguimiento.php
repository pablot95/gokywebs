<?php
/**
 * wabot/seguimiento.php — automatismos por cron:
 *   - la "última llamada" a las 23 h del último mensaje del cliente, antes de
 *     que cierre la ventana de 24 h de Meta (wabot_ultima_llamada_correr).
 *
 * La plantilla seguimiento_demo_72h ya NO sale desde este cron: se envía
 * únicamente con el botón manual de la conversación.
 *
 * Desde Hostinger (hPanel → Avanzado → Cron Jobs), cada 30 minutos:
 *   php /home/USUARIO/public_html/wabot/seguimiento.php
 * o por URL, con el verify token como clave:
 *   https://gokywebs.com/wabot/seguimiento.php?clave=VERIFY_TOKEN
 *
 * Correrlo de más no duplica la última llamada.
 */

// engine.php, no lib.php: los textos de los crons también pasan por el punto
// único de salida (wabot_salida_emisor_texto), que vive en engine. Con solo
// lib.php cargado la función no existe y el cron moría con un fatal.
require_once __DIR__ . '/engine.php';

if (php_sapi_name() !== 'cli') {
    $auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    $bearer = preg_match('/^Bearer\s+(.+)$/i', $auth, $m) ? trim($m[1]) : '';
    // Query queda por compatibilidad, pero para nuevos cron HTTP se recomienda
    // Authorization: Bearer para no dejar la clave en logs e historial.
    $clave = $bearer !== '' ? $bearer : (string)($_GET['clave'] ?? '');
    if ($clave === '' || !hash_equals(WABOT_VERIFY_TOKEN, $clave)) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
}

$cfg = wabot_config_load();
$ultima = wabot_ultima_llamada_correr($cfg);

echo json_encode([
    'ultima_llamada' => [
        'revisadas' => $ultima['revisadas'],
        'enviados'  => $ultima['enviados'],
        'detalle'   => $ultima['detalle'],
    ],
    'confirmacion_demo' => [
        'automatico' => false,
        'revisadas' => 0,
        'enviados'  => 0,
        'detalle'   => [],
    ],
], JSON_UNESCAPED_UNICODE) . "\n";
