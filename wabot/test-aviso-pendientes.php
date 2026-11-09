<?php
/**
 * Resumen diario de los chats sin responder a su WhatsApp (9-nov-2026).
 * Pablo: «¿se puede agregar algo que cada 20 hs me diga si hay chats que
 * quedaron pendientes? quizás los abro y después no me doy cuenta».
 * Sin red: charlas en memoria y un envío falso.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

// Hoy a las 20:00 de Argentina (23:00 UTC).
$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$a20 = strtotime($hoy . ' 23:00:00 UTC');
$GLOBALS['WABOT_TEST_AVISO_PENDIENTES_ARCHIVO'] = sys_get_temp_dir() . '/wabot-test-aviso-pendientes-' . getmypid() . '.json';
@unlink($GLOBALS['WABOT_TEST_AVISO_PENDIENTES_ARCHIVO']);
$cfg = ['aviso_pendientes_activo' => true, 'aviso_pendientes_hora' => 20, 'aviso_whatsapp_activo' => true, 'aviso_whatsapp_tel' => '5491100000000'] + wabot_config_load();

/** Una charla que el bot le pasó a Pablo; el cliente escribió $texto hace $horas. */
function ap_conv($clave, $texto, $horas, $extra = []) {
    global $a20;
    $ts = $a20 - (int)($horas * 3600);
    $c = conv_nueva($clave, ['handoff_pendiente' => true, 'nombre' => 'Cliente ' . $clave, 'transcript' => [
        ['q' => 'bot', 't' => 'Podés elegir entre dos planes', 'ts' => $ts - 600],
        ['q' => 'cliente', 't' => $texto, 'ts' => $ts],
    ]]);
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

echo "Qué entra\n";
$abierta    = ap_conv('P1', 'Hola, ¿pudiste ver lo que te mandé?', 5, ['panel_visto_ts' => $a20 - 3600]);
$sinAbrir   = ap_conv('P2', 'Cómo manejan el SEO?', 2);
$contestada = ap_conv('P3', 'Cómo manejan el SEO?', 3);
$contestada['transcript'][] = ['q' => 'humano', 't' => 'Sí, la dejamos lista para Google', 'ts' => $a20 - 3600];
$marcada    = ap_conv('P4', 'hola?', 3, ['contestado_ts' => $a20]);
$archivada  = ap_conv('P5', 'hola?', 3, ['archivado' => true]);
$delBot     = ap_conv('P6', 'hola?', 3, ['handoff_pendiente' => false]);
$vieja      = ap_conv('P7', 'hola?', 4 * 24);
$urgente    = ap_conv('P8', 'Si no me contestan los descarto', 1);
$deprueba   = ap_conv('999TEST1', 'hola?', 1);
$items = wabot_aviso_pendientes_items([$abierta, $sinAbrir, $contestada, $marcada, $archivada, $delBot, $vieja, $urgente, $deprueba], $a20);
$claves = array_column($items['recientes'], 'clave');
caso('abierta y sin contestar → entra (lo que Pablo pidió)', in_array('P1', $claves, true));
caso('…y queda marcada como abierta', ($items['recientes'][array_search('P1', $claves, true)]['abierta'] ?? false) === true);
caso('sin abrir → entra, marcada como no abierta', in_array('P2', $claves, true) && ($items['recientes'][array_search('P2', $claves, true)]['abierta'] ?? true) === false);
caso('Pablo ya contestó → no', !in_array('P3', $claves, true));
caso('marcada «ya le contesté» → no', !in_array('P4', $claves, true));
caso('archivada → no', !in_array('P5', $claves, true));
caso('la sigue el bot → no', !in_array('P6', $claves, true));
caso('de hace 4 días → cuenta entre las viejas, no renglón', !in_array('P7', $claves, true) && $items['viejas'] === 1);
caso('la de prueba (TEST) → no', !in_array('999TEST1', $claves, true));
caso('la urgente va primera', ($claves[0] ?? '') === 'P8', json_encode($claves));
caso('después, de la más nueva a la que más espera (lo de hoy todavía se contesta como texto)', array_slice($claves, 1) === ['P2', 'P1'], json_encode($claves));

echo "El texto\n";
[$titulo, $cuerpo] = wabot_aviso_pendientes_texto($items, $a20);
caso('título con la cuenta y cuántos ya abrió', $titulo === 'Chats sin responder: 3 (1 ya abierto)', $titulo);
caso('la urgente con ⚠, cuánto hace y su último mensaje', strpos($cuerpo, '⚠ Cliente P8 (hace 1 h): Si no me contestan los descarto') === 0, $cuerpo);
caso('cada renglón con nombre, espera y último mensaje', strpos($cuerpo, "\n• Cliente P2 (hace 2 h): Cómo manejan el SEO?\n• Cliente P1 (hace 5 h): Hola, ¿pudiste ver lo que te mandé?") !== false, $cuerpo);
caso('las viejas como número al final', substr($cuerpo, -strlen('De más de 3 días: 1.')) === 'De más de 3 días: 1.', $cuerpo);
$muchos = [];
for ($i = 1; $i <= 11; $i++) $muchos[] = ap_conv('M' . $i, 'hola ' . $i, $i);
[$t2, $c2] = wabot_aviso_pendientes_texto(wabot_aviso_pendientes_items($muchos, $a20), $a20);
caso('hasta 8 renglones y «y N más»', substr_count($c2, "\n") === 8 && substr($c2, -strlen('y 3 más')) === 'y 3 más', $c2);
caso('sin viejas no hay renglón de viejas', strpos($c2, 'De más de') === false);
caso('los 8 que se ven son los más nuevos', strpos($c2, '• Cliente M1 (hace 1 h)') === 0 && strpos($c2, 'Cliente M8 (hace 8 h)') !== false && strpos($c2, 'Cliente M9') === false, $c2);
$largo = ap_conv('L1', str_repeat('palabra ', 20), 1);
[$t3, $c3] = wabot_aviso_pendientes_texto(wabot_aviso_pendientes_items([$largo], $a20), $a20);
caso('el último mensaje se recorta a 80', mb_strlen(explode(': ', $c3, 2)[1]) === 80 && mb_substr($c3, -1) === '…', $c3);
[$t4, $c4] = wabot_aviso_pendientes_texto(wabot_aviso_pendientes_items([$sinAbrir, ap_conv('P9', 'hola?', 6)], $a20), $a20);
caso('sin abiertas, el título va sin paréntesis', $t4 === 'Chats sin responder: 2', $t4);

echo "La pasada del cron\n";
$enviados = [];
$falso = function ($t, $c) use (&$enviados) { $enviados[] = [$t, $c]; return true; };
$convs = [$abierta, $sinAbrir, $contestada, $vieja];
$r = wabot_aviso_pendientes_correr($a20 - 3600, $convs, $falso, $cfg);
caso('a las 19 no es la hora', empty($r['enviado']) && ($r['motivo'] ?? '') === 'no_es_la_hora' && !$enviados, json_encode($r));
$r = wabot_aviso_pendientes_correr($a20, $convs, $falso, $cfg);
caso('a las 20 manda el resumen', !empty($r['enviado']) && count($enviados) === 1 && $r['recientes'] === 2 && $r['viejas'] === 1, json_encode($r));
caso('con el título y el cuerpo', ($enviados[0][0] ?? '') === 'Chats sin responder: 2 (1 ya abierto)' && strpos($enviados[0][1] ?? '', 'De más de 3 días: 1.') !== false, json_encode($enviados));
$r = wabot_aviso_pendientes_correr($a20 + 1800, $convs, $falso, $cfg);
caso('a las 20:30 del mismo día no repite', empty($r['enviado']) && ($r['motivo'] ?? '') === 'ya_mandado_hoy' && count($enviados) === 1, json_encode($r));
$r = wabot_aviso_pendientes_correr($a20 + 86400, $convs, $falso, $cfg);
caso('al día siguiente vuelve a salir', !empty($r['enviado']) && count($enviados) === 2, json_encode($r));

// Un envío que falla (Meta, plantilla sin aprobar): no se anota el día y la vuelta siguiente reintenta.
@unlink($GLOBALS['WABOT_TEST_AVISO_PENDIENTES_ARCHIVO']);
$enviados = [];
$falla = function ($t, $c) { return false; };
$r = wabot_aviso_pendientes_correr($a20, $convs, $falla, $cfg);
caso('si no sale, no se anota el día', empty($r['enviado']) && ($r['motivo'] ?? '') === 'no_salio', json_encode($r));
$r = wabot_aviso_pendientes_correr($a20 + 1800, $convs, $falso, $cfg);
caso('…y a las 20:30 reintenta', !empty($r['enviado']) && count($enviados) === 1, json_encode($r));

@unlink($GLOBALS['WABOT_TEST_AVISO_PENDIENTES_ARCHIVO']);
$r = wabot_aviso_pendientes_correr($a20, [$contestada, $vieja], $falso, $cfg);
caso('sin pendientes recientes no manda nada (las viejas solas no alcanzan)', empty($r['enviado']) && ($r['motivo'] ?? '') === 'sin_pendientes' && count($enviados) === 1, json_encode($r));
$r = wabot_aviso_pendientes_correr($a20, $convs, null, ['aviso_pendientes_activo' => false] + $cfg);
caso('apagado en Estado → no hace nada', empty($r['enviado']) && ($r['motivo'] ?? '') === 'apagado', json_encode($r));
$r = wabot_aviso_pendientes_correr($a20, $convs, null, ['aviso_whatsapp_activo' => false] + $cfg);
caso('con los avisos por WhatsApp apagados tampoco', empty($r['enviado']) && ($r['motivo'] ?? '') === 'apagado', json_encode($r));
$r = wabot_aviso_pendientes_correr($a20, $convs, $falso, ['aviso_pendientes_hora' => 21] + $cfg);
caso('con la hora en 21, a las 20 no sale', empty($r['enviado']) && ($r['motivo'] ?? '') === 'no_es_la_hora', json_encode($r));
$r = wabot_aviso_pendientes_correr($a20 + 3600, $convs, $falso, ['aviso_pendientes_hora' => 21] + $cfg);
caso('…y a las 21 sí', !empty($r['enviado']) && count($enviados) === 2, json_encode($r));
caso('una hora fuera de rango vuelve a las 20', wabot_aviso_pendientes_hora(['aviso_pendientes_hora' => 25]) === 20 && wabot_aviso_pendientes_hora(['aviso_pendientes_hora' => -1]) === 20);

@unlink($GLOBALS['WABOT_TEST_AVISO_PENDIENTES_ARCHIVO']);
todo_ok();
