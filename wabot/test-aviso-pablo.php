<?php
/**
 * Avisos a Pablo por WhatsApp (1-nov-2026, push.php).
 *
 * "Las notificaciones en el celular ya no me llegan, se desactivan" y
 * "llegaban re tarde": el aviso principal pasa a ser un WhatsApp del bot a su
 * número personal; el push de Firebase queda de respaldo. Sin red: los envíos
 * quedan en WABOT_TEST_ENVIADOS / WABOT_TEST_PLANTILLAS y el estado en memoria.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

// Solo esta suite quiere ver los avisos: en las demás un WhatsApp a Pablo les cambiaría la cuenta de envíos.
$GLOBALS['WABOT_TEST_AVISO_PABLO'] = true;
$GLOBALS['WABOT_TEST_AVISO_ESTADO'] = [];

$cfg = wabot_config_load();
// De fábrica apagado desde el 2-nov (Pablo): las pruebas lo prenden para ver cómo manda.
caso('de fábrica los avisos por WhatsApp a Pablo están apagados', (wabot_textos_default()['aviso_whatsapp_activo'] ?? null) === false);
$cfg['aviso_whatsapp_activo'] = true; $GLOBALS['WABOT_TEST_AVISO_ACTIVO'] = true;
$pablo = '5491125068578';

echo "Número propio\n";
caso('el número de los avisos es de Pablo', wabot_numero_propio($pablo, $cfg));
caso('sin el 549 adelante también', wabot_numero_propio('1125068578', $cfg));
caso('con + y espacios también', wabot_numero_propio('+54 9 11 2506-8578', $cfg));
caso('un cliente no', !wabot_numero_propio('5491155551234', $cfg));
caso('una clave corta no', !wabot_numero_propio('TEST', $cfg));
caso('con otro número configurado, el viejo deja de ser propio', !wabot_numero_propio($pablo, ['numeros_propios' => ['5491140688675']]));

echo "Ventana de 24 h\n";
caso('arranca cerrada', !wabot_aviso_ventana_abierta());
wabot_aviso_entrante_registrar($pablo, 'hola');
caso('después de escribirle al bot queda abierta', wabot_aviso_ventana_abierta());
caso('vence a las 24 h (menos el margen)', wabot_aviso_ventana_hasta() <= time() + 24 * 3600 && wabot_aviso_ventana_hasta() > time() + 23 * 3600);
caso('con la ventana abierta hay aviso configurado aunque falte Firebase', wabot_aviso_configurado($cfg));

echo "Con la ventana abierta sale como texto\n";
$GLOBALS['WABOT_TEST_ENVIADOS'] = []; $GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$link = 'https://www.gokywebs.com/wabot/admin.php?tab=conversaciones&ver=549TEST1';
// 3-nov: los avisos de a uno ya no van por WhatsApp, solo por push.
$n = wabot_push_enviar('⚠ Marcela · quiere pagar', 'hola', ['tel' => '549TEST1', 'link' => $link]);
caso('el aviso de a uno ya no sale por WhatsApp', $n === 0 && empty($GLOBALS['WABOT_TEST_ENVIADOS']), (string)$n);
$n = wabot_aviso_whatsapp_enviar('⚠ Marcela · quiere pagar', "pasame el alias\nasí te transfiero", ['tel' => '549TEST1', 'link' => $link]) ? 1 : 0;
caso('el envío por WhatsApp sigue andando', $n === 1, (string)$n);
$e = $GLOBALS['WABOT_TEST_ENVIADOS'][0] ?? null;
caso('va al número de Pablo', $e && $e[0] === $pablo);
caso('lleva el título, los renglones del cliente y el link al chat',
     $e && strpos($e[1], '⚠ Marcela · quiere pagar') === 0 && strpos($e[1], "pasame el alias\nasí te transfiero") !== false && strpos($e[1], $link) !== false,
     $e ? $e[1] : '');
caso('no sale ninguna plantilla', empty($GLOBALS['WABOT_TEST_PLANTILLAS']));
$est = wabot_aviso_estado();
caso('queda anotado cómo salió', !empty($est['ultimo_aviso_ok']) && ($est['ultimo_aviso_via'] ?? '') === 'texto');

echo "Con la ventana cerrada\n";
wabot_aviso_estado_guardar(['entrante_ts' => time() - 25 * 3600]);
caso('cerrada a las 25 h', !wabot_aviso_ventana_abierta());
// Hasta el 9-nov la plantilla no existía en Meta y venía apagada de fábrica; ese día se creó,
// la aprobaron y pasó a activa. El caso la apaga a mano para ver qué pasa sin ella.
caso('de fábrica la plantilla aviso_pablo está activa (9-nov)', !empty(wabot_textos_default()['plantillas']['aviso_pablo']['activa']));
$cfgSinPlantilla = $cfg;
$cfgSinPlantilla['plantillas']['aviso_pablo']['activa'] = false;
$GLOBALS['WABOT_TEST_ENVIADOS'] = []; $GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$n = wabot_aviso_whatsapp_enviar('Marcela', 'hola?', ['tel' => '549TEST1', 'link' => $link], $cfgSinPlantilla) ? 1 : 0;
caso('con la plantilla apagada no sale nada por WhatsApp', $n === 0 && empty($GLOBALS['WABOT_TEST_ENVIADOS']) && empty($GLOBALS['WABOT_TEST_PLANTILLAS']));
caso('y queda anotado que no salió', empty(wabot_aviso_estado()['ultimo_aviso_ok']) && (wabot_aviso_estado()['ultimo_aviso_via'] ?? '') === 'ninguna');

$cfgPlantilla = $cfg;
$cfgPlantilla['plantillas']['aviso_pablo']['activa'] = true;
$GLOBALS['WABOT_TEST_ENVIADOS'] = []; $GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$ok = wabot_aviso_whatsapp_enviar('Marcela · Panadería La Espiga', "pasame el alias\n\n  así te   transfiero", ['tel' => '549TEST1', 'link' => $link], $cfgPlantilla);
caso('con la plantilla activa sale por plantilla', $ok && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1 && empty($GLOBALS['WABOT_TEST_ENVIADOS']));
$p = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [null, null, null, [], []];
caso('al número de Pablo, con el nombre aprobado', $p[0] === $pablo && $p[1] === 'aviso_pablo_mensaje' && $p[2] === 'es_AR');
caso('quién, y el texto en un solo renglón', ($p[3][0] ?? '') === 'Marcela · Panadería La Espiga' && ($p[3][1] ?? '') === 'pasame el alias · así te transfiero', json_encode($p[3], JSON_UNESCAPED_UNICODE));
caso('la clave del chat va en el botón', ($p[4][0] ?? '') === '549TEST1');
caso('queda anotado que salió por plantilla', (wabot_aviso_estado()['ultimo_aviso_via'] ?? '') === 'plantilla');

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
wabot_aviso_whatsapp_enviar('Revisión', 'Dos charlas sin respuesta', ['tel' => 'revision', 'link' => 'https://www.gokywebs.com/wabot/admin.php?tab=revision'], $cfgPlantilla);
caso('sin clave de chat el botón lleva un guion y no se rompe', ($GLOBALS['WABOT_TEST_PLANTILLAS'][0][4][0] ?? '') === 'revision' || ($GLOBALS['WABOT_TEST_PLANTILLAS'][0][4][0] ?? '') === '-');

echo "Apagado y sin número\n";
wabot_aviso_estado_guardar(['entrante_ts' => time()]);
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$cfgOff = $cfg; $cfgOff['aviso_whatsapp_activo'] = false;
caso('apagado no manda', !wabot_aviso_whatsapp_enviar('x', 'y', [], $cfgOff) && empty($GLOBALS['WABOT_TEST_ENVIADOS']));
$cfgSinTel = $cfg; $cfgSinTel['aviso_whatsapp_tel'] = '';
caso('sin número no manda ni cuenta como configurado', !wabot_aviso_whatsapp_enviar('x', 'y', [], $cfgSinTel) && !wabot_aviso_whatsapp_activo($cfgSinTel));
caso('un número con basura se limpia', wabot_aviso_tel(['aviso_whatsapp_tel' => '+54 9 11 2506-8578']) === $pablo);

echo "Resumen de los sin leer (3-nov)\n";
$ahora = time();
$fila = function ($clave, $grupo, $hace, $extra = []) use ($ahora) {
    return $extra + ['conversation_key' => $clave, 'grupo' => $grupo, 'estado' => 'pausado', 'handoff_pendiente' => false,
                     'ultimo_cliente_ts' => $ahora - $hace, 'ultimo_salida_ts' => $ahora - $hace - 60,
                     'no_leido' => true, 'contestado' => false, 'sin_respuesta_bienvenida' => false];
};
$items = [
    $fila('5491100000001', 'presentados', 300),
    $fila('5491100000002', 'presentadas_48', 600),
    $fila('5491100000003', 'chat', 120),
    $fila('5491100000004', 'interesado', 900),
    $fila('5491100000005', 'muestra', 100),                                   // demo por presentar: no cuenta
    $fila('5491100000006', 'chat', 100, ['no_leido' => false]),               // ya lo abrió
    $fila('5491100000007', 'chat', 100, ['ultimo_salida_ts' => $ahora]),      // ya le contestaron
    $fila('5491100000008', 'chat', 25 * 3600),                                // vencido
    $fila('5491100000009', 'archivado', 100),
    $fila('5491100000010', 'chat', 100, ['estado' => 'bot']),                 // lo lleva el bot
    $fila('5491100000011', 'chat', 100, ['sin_respuesta_bienvenida' => true]),
    $fila('549TEST12', 'chat', 100),
];
$c = wabot_aviso_resumen_cuentas($items, $ahora);
caso('cuenta 2 demos entregadas y 2 normales', $c['demos'] === 2 && $c['normal'] === 2, json_encode($c));
caso('el texto es solo las dos cuentas', wabot_aviso_resumen_texto($c) === "DemosE: 2\nNormal: 2");

echo "Solo demos entregadas, de a una persona (4-nov)\n";
$mandados = [];
$enviar = function ($t) use (&$mandados) { $mandados[] = $t; return true; };
wabot_aviso_estado_guardar(['entrante_ts' => $ahora]);
$demoA = $fila('5491100000001', 'presentados', 300, ['nombre_agenda' => 'Marcela']);
$demoB = $fila('5491100000002', 'presentadas_48', 200, ['nombre_negocio' => 'Panadería La Espiga']);
$normal = $fila('5491100000003', 'chat', 100);
$porPresentar = $fila('5491100000005', 'muestra', 100);
$r = wabot_aviso_resumen_correr($ahora, [$demoA, $normal, $porPresentar], $enviar);
caso('la demo entregada avisa con su nombre', $r['enviado'] && $mandados === ['Tenés un mensaje de Marcela'], json_encode($mandados, JSON_UNESCAPED_UNICODE));
$r = wabot_aviso_resumen_correr($ahora + 5, [$demoA, $normal, $porPresentar], $enviar);
caso('sin nada nuevo no se repite', !$r['enviado'] && count($mandados) === 1);
$demoA2 = $demoA; $demoA2['ultimo_cliente_ts'] = $ahora + 30;
$r = wabot_aviso_resumen_correr($ahora + 40, [$demoA2, $normal], $enviar);
caso('la misma persona sigue escribiendo: silencio', !$r['enviado'] && $r['motivo'] === 'misma_persona' && count($mandados) === 1, json_encode($r));
$normal2 = $normal; $normal2['ultimo_cliente_ts'] = $ahora + 50;
$r = wabot_aviso_resumen_correr($ahora + 60, [$demoA2, $normal2], $enviar);
caso('un chat normal no avisa', !$r['enviado'] && count($mandados) === 1);
$demoB2 = $demoB; $demoB2['ultimo_cliente_ts'] = $ahora + 70;
$r = wabot_aviso_resumen_correr($ahora + 80, [$demoA2, $demoB2], $enviar);
caso('escribe otra demo: avisa', $r['enviado'] && end($mandados) === 'Tenés un mensaje de Panadería La Espiga', json_encode($mandados, JSON_UNESCAPED_UNICODE));
$demoA3 = $demoA; $demoA3['ultimo_cliente_ts'] = $ahora + 90;
$r = wabot_aviso_resumen_correr($ahora + 95, [$demoA3, $demoB2], $enviar);
caso('vuelve la primera después de otra: avisa de nuevo', $r['enviado'] && end($mandados) === 'Tenés un mensaje de Marcela' && count($mandados) === 3);
$demoB3 = $demoB; $demoB3['ultimo_cliente_ts'] = $ahora + 110;
$r = wabot_aviso_resumen_correr($ahora + 130, [$demoB3], $enviar);
caso('B escribe mientras A era la última: avisa B', end($mandados) === 'Tenés un mensaje de Panadería La Espiga' && count($mandados) === 4);
caso('sin demos entregadas no sale', !wabot_aviso_resumen_correr($ahora + 9999, [$porPresentar, $normal], $enviar)['enviado'] && count($mandados) === 4);

$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
wabot_aviso_whatsapp_enviar('Chats sin leer', "DemosE: 1\nNormal: 2", ['solo_texto' => true, 'tel' => '-'], $cfg);
caso('por WhatsApp va pelado: sin título ni link', ($GLOBALS['WABOT_TEST_ENVIADOS'][0][1] ?? '') === "DemosE: 1\nNormal: 2", json_encode($GLOBALS['WABOT_TEST_ENVIADOS'], JSON_UNESCAPED_UNICODE));

echo "Las demás suites no ven avisos\n";
$GLOBALS['WABOT_TEST_AVISO_PABLO'] = false;
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
caso('sin el gancho de test no sale nada', !wabot_aviso_whatsapp_enviar('x', 'y', ['tel' => '549TEST1'], $cfg) && empty($GLOBALS['WABOT_TEST_ENVIADOS']));

todo_ok();
