<?php
/**
 * wabot/seguimiento.php — automatismos por cron:
 *   - la "última llamada" antes de que cierre la ventana de Meta;
 *   - seguimiento_demo_72h, a las 18 h tras 72 h sin respuesta;
 *   - seguimiento_interesado, a las 18 h tras 7 días sin mensajes.
 *
 * Desde el hosting, cada 5-30 minutos (zona horaria argentina para las plantillas):
 *   php /home/USUARIO/public_html/wabot/seguimiento.php
 * o por URL, con el verify token como clave:
 *   https://gokywebs.com/wabot/seguimiento.php?clave=VERIFY_TOKEN
 *
 * Correrlo de más no duplica los envíos: cada conversación registra su intento.
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
$plantillas = wabot_plantillas_auto_correr($cfg);

echo json_encode([
    'ultima_llamada' => [
        'revisadas' => $ultima['revisadas'],
        'enviados'  => $ultima['enviados'],
        'detalle'   => $ultima['detalle'],
    ],
    'plantillas' => $plantillas,
], JSON_UNESCAPED_UNICODE) . "\n";
