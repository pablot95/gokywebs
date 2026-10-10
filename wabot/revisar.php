<?php
/**
 * wabot/revisar.php — corre la revisión de las charlas del bot (revision.php).
 *
 * Desde el hosting, dos veces por hora, a las y cuarto y menos cuarto (el cron
 * de seguimiento.php corre en punto y y media: así no se pisan y la revisión ve
 * los avisos que acaba de mandar):
 *   15,45 * * * *  php /home/USUARIO/domains/gokywebs.com/public_html/wabot/revisar.php
 * o por URL, con el verify token como clave (Authorization: Bearer VERIFY_TOKEN).
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

echo json_encode(wabot_revision_correr(wabot_config_load()), JSON_UNESCAPED_UNICODE) . "\n";
