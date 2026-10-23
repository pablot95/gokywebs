<?php
/**
 * wabot/revisar.php — corre la revisión de las charlas del bot (revision.php).
 *
 * Una vez por hora, a las y cuarto (el cron de seguimiento.php corre en punto
 * y y media: así no se pisan y la revisión ve los avisos que acaba de mandar):
 *   15 * * * *  php /home/USUARIO/domains/gokywebs.com/public_html/wabot/revisar.php
 * o por URL, con el verify token como clave (Authorization: Bearer VERIFY_TOKEN).
 * Hasta el 23-oct eran dos por hora (15,45): si el cron quedó así, la pasada
 * que llega antes de la hora se saltea sola (wabot_revision_toca). Con
 * --forzar (o ?forzar=1 por URL) corre igual.
 *
 * Correrlo de más no repite nada: cada tramo de cada charla se revisa una vez.
 */

require_once __DIR__ . '/revision.php';

if (php_sapi_name() !== 'cli') {
    $auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    $bearer = preg_match('/^Bearer\s+(.+)$/i', $auth, $m) ? trim($m[1]) : '';
    $clave = $bearer !== '' ? $bearer : (string)($_GET['clave'] ?? '');
    if ($clave === '' || !hash_equals(WABOT_VERIFY_TOKEN, $clave)) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
}
@set_time_limit(WABOT_REVISION_MAX_SEG + 300);

$forzar = php_sapi_name() === 'cli' ? in_array('--forzar', array_slice($argv ?? [], 1), true) : !empty($_GET['forzar']);
if (!$forzar && !wabot_revision_toca()) {
    echo json_encode(['estado' => 'todavia_no', 'ultima_ts' => wabot_revision_estado_leer()['ultima_ts']], JSON_UNESCAPED_UNICODE) . "\n";
    exit;
}

echo json_encode(wabot_revision_correr(wabot_config_load()), JSON_UNESCAPED_UNICODE) . "\n";
