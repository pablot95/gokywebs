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
$n = wabot_push_enviar('⚠ Marcela · quiere pagar', "pasame el alias\nasí te transfiero", ['tel' => '549TEST1', 'link' => $link]);
caso('cuenta un destino (el push sin red no suma)', $n === 1, (string)$n);
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
$GLOBALS['WABOT_TEST_ENVIADOS'] = []; $GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$n = wabot_push_enviar('Marcela', 'hola?', ['tel' => '549TEST1', 'link' => $link]);
caso('sin la plantilla aprobada no sale nada por WhatsApp', $n === 0 && empty($GLOBALS['WABOT_TEST_ENVIADOS']) && empty($GLOBALS['WABOT_TEST_PLANTILLAS']));
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

echo "Las demás suites no ven avisos\n";
$GLOBALS['WABOT_TEST_AVISO_PABLO'] = false;
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
caso('sin el gancho de test no sale nada', !wabot_aviso_whatsapp_enviar('x', 'y', ['tel' => '549TEST1'], $cfg) && empty($GLOBALS['WABOT_TEST_ENVIADOS']));

todo_ok();
