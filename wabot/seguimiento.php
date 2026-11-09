<?php
/**
 * wabot/seguimiento.php — automatismos por cron:
 *   - la confirmación del formulario, a los 5 minutos de que lo completa;
 *   - la "última llamada" antes de que cierre la ventana de Meta;
 *   - seguimiento_demo_72h, a las 18 h tras 72 h sin respuesta;
 *   - seguimiento_interesado, a las 18 h tras 4 días sin mensajes;
 *   - la presentación automática de la demo: 18 h o 14 h del día siguiente (presentar.php, 18-oct);
 *   - el aviso de renovación del día del cobro a los que pagan por afuera (renovacion.php, 25-oct);
 *   - el monitoreo de las webs en mantenimiento, el aviso de caída resuelta y el
 *     resumen mensual de cada web (webs.php, 29-oct);
 *   - el re-aviso a Pablo (push) de las charlas que le tocan y siguen sin respuesta.
 *   - los pagos que entraron en Mercado Pago, atados a su chat y confirmados (pagos.php, 1-nov);
 *   - el recordatorio al cliente que pagó y dejó a medias los datos para la web (onboarding.php, 1-nov).
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
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/presentar.php';
require_once __DIR__ . '/renovacion.php';
require_once __DIR__ . '/webs.php';
require_once __DIR__ . '/pagos.php';
require_once __DIR__ . '/onboarding.php';
require_once __DIR__ . '/clientes.php';

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
// En este orden: el recordatorio del formulario (más temprano en la charla),
// la última llamada y las plantillas. Cada uno respeta wabot_auto_reciente(),
// así que en la misma pasada nunca salen dos al mismo cliente.
$confirmacion = wabot_form_confirmacion_correr($cfg);
$recordatorio = wabot_form_recordatorio_correr($cfg);
$ofertaEntrega = wabot_oferta_entrega_seguimiento_correr($cfg);
$ultima = wabot_ultima_llamada_correr($cfg);
$plantillas = wabot_plantillas_auto_correr($cfg);
// La demo de los bocetos de antes de las 15 h sale a las 18 h; la de los de después, al otro día a las 14 h (18-oct).
$presentarAuto = wabot_presentar_auto_correr($cfg);
// El día del cobro, la plantilla de renovación a los que pagan por afuera de Mercado Pago (25-oct).
$renovacion = wabot_renovacion_correr($cfg);
// Las webs en mantenimiento: ¿responden? Avisa las caídas resueltas y, desde el día 1, el resumen del mes (29-oct).
$webs = wabot_webs_correr($cfg);
// Los pagos que entraron en Mercado Pago: atados al chat y confirmados, o a la lista de sin asignar (pagos.php, 1-nov).
$pagos = wabot_pagos_correr($cfg);
// Al que pagó y se cortó en el medio de los datos para la web, el recordatorio a las 24 h (onboarding.php).
$onboarding = wabot_onboarding_recordatorio_correr($cfg);
// Los clientes del admin cruzados con sus chats (clientes.php): la vista Clientes de Conversaciones los lee de esta caché.
try { wabot_clientes_datos(); } catch (\Throwable $e) { wabot_log('error', ['donde' => 'clientes_cron', 'msg' => mb_substr($e->getMessage(), 0, 200)]); }
// No le escribe a nadie: le vuelve a avisar a Pablo lo que sigue esperando (16-oct).
$reaviso = wabot_push_reaviso_correr();
// El resumen de los sin leer a su WhatsApp: los que entraron mientras se esperaban los 10 minutos (3-nov).
try { $resumen = wabot_aviso_resumen_correr(); } catch (\Throwable $e) { $resumen = ['error' => mb_substr($e->getMessage(), 0, 200)]; }
// El resumen diario de los chats sin responder a su WhatsApp, a la hora elegida en Estado (9-nov).
try { $pendientes = wabot_aviso_pendientes_correr(); } catch (\Throwable $e) { $pendientes = ['error' => mb_substr($e->getMessage(), 0, 200)]; }

echo json_encode([
    'ultima_llamada' => [
        'revisadas' => $ultima['revisadas'],
        'enviados'  => $ultima['enviados'],
        'detalle'   => $ultima['detalle'],
    ],
    'plantillas' => $plantillas,
    'form_confirmacion' => $confirmacion,
    'form_recordatorio' => $recordatorio,
    'oferta_entrega' => $ofertaEntrega,
    'presentar_auto' => $presentarAuto,
    'renovacion' => $renovacion,
    'webs' => $webs,
    'push_reaviso' => $reaviso,
    'aviso_resumen' => $resumen,
    'aviso_pendientes' => $pendientes,
    'pagos' => $pagos,
    'onboarding' => $onboarding,
], JSON_UNESCAPED_UNICODE) . "\n";
