<?php
/**
 * wabot/seguimiento.php — dispara el seguimiento comercial y el de muestras
 * presentadas sin confirmar. Lo llama un cron.
 *
 * Desde Hostinger (hPanel → Avanzado → Cron Jobs), cada 30 minutos:
 *   php /home/USUARIO/public_html/wabot/seguimiento.php
 * o por URL, con el verify token como clave:
 *   https://gokywebs.com/wabot/seguimiento.php?clave=VERIFY_TOKEN
 *
 * Correrlo de más no duplica nada: cada conversación recibe un solo
 * seguimiento (y un solo recordatorio de muestra) en su vida, y solo dentro
 * de la ventana de 24 h de Meta.
 */

require_once __DIR__ . '/lib.php';

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
$res = wabot_seguimiento_correr($cfg);
$aviso = wabot_muestra_aviso_correr($cfg);
$presentados = wabot_presentados_correr($cfg);

echo json_encode([
    'revisadas' => $res['revisadas'],
    'enviados'  => $res['enviados'],
    'fallidos'  => $res['fallidos'],
    'detalle'   => $res['detalle'],
    'muestra_aviso' => [
        'revisadas' => $aviso['revisadas'],
        'enviados'  => $aviso['enviados'],
        'detalle'   => $aviso['detalle'],
    ],
    'presentados' => [
        'revisadas'     => $presentados['revisadas'],
        'recordatorios' => $presentados['recordatorios'],
        'archivados'    => $presentados['archivados'],
        'detalle'       => $presentados['detalle'],
    ],
], JSON_UNESCAPED_UNICODE) . "\n";
