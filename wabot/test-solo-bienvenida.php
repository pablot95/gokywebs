<?php
/**
 * Solo bienvenida (Pablo, 3-oct-2026): "su única función por el momento sea
 * dar la bienvenida (además de mandar templates y bocetos…), pero
 * conversacionalmente, solo da la bienvenida, yo me encargo del resto". Sin red.
 */
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = true;
require_once __DIR__ . '/test-lib.php';
$cfg = wabot_config_load();
$bienvenida = 'Hola cómo estás? Para poder asesorarte y darte un precio adecuado, por favor contanos brevemente a qué te dedicás, o para qué necesitarías una web';

caso('el texto de la bienvenida es el de Pablo', trim((string)$cfg['bienvenida']) === $bienvenida, (string)$cfg['bienvenida']);
caso('viene prendido de fábrica', !empty(wabot_textos_default()['solo_bienvenida']));

// El primer mensaje recibe la bienvenida, sea un saludo o ya cuente el negocio.
foreach (['Hola', 'Hola, quiero una página web', 'Buenas, tengo una pastelería y quiero vender online', 'Cuánto sale una web?'] as $primero) {
    $c = conv_nueva('999TEST999');
    $r = turno($primero, $c, $cfg);
    caso("«{$primero}» → la bienvenida, sola", $r === [$bienvenida], json_encode($r, JSON_UNESCAPED_UNICODE));
}

// Después de la bienvenida, el bot no contesta más: lo ve Pablo.
$c = conv_nueva('999TEST999');
turno('Hola', $c, $cfg);
foreach (['Tengo una pastelería', 'Cuánto sale?', 'sí, quiero la demo', 'Hola?', 'quiero hablar con una persona'] as $sigue) {
    $r = turno($sigue, $c, $cfg);
    caso("después de la bienvenida, «{$sigue}» → silencio", $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));
}
caso('queda marcada para Pablo', !empty($c['handoff_pendiente']));
caso('lo que contó queda en la ficha', mb_stripos(json_encode($c, JSON_UNESCAPED_UNICODE), 'pastel') !== false);
caso('no se dio precio', empty($c['precio_dado']));

// Una charla en la que ya habló Pablo (o el bot antes) no se saluda de nuevo.
$c = conv_nueva('999TEST999');
wabot_conv_transcript($c, 'cliente', 'Hola');
wabot_conv_transcript($c, 'humano', 'Hola! Contame a qué te dedicás');
$r = turno('Tengo un taller mecánico', $c, $cfg);
caso('si Pablo ya escribió, no hay bienvenida', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('999TEST999');
wabot_conv_transcript($c, 'cliente', 'Hola');
wabot_conv_transcript($c, 'bot', 'Hola! Gracias por contactarnos.');
$r = turno('volví, sigo interesado', $c, $cfg);
caso('una charla vieja con el bot tampoco se saluda de nuevo', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));

// Un audio o una foto que no se pudo leer (llega vacío) también se saluda.
$c = conv_nueva('999TEST999');
$r = wabot_responder('', $c, $cfg);
caso('un archivo sin leer de entrada → la bienvenida', $r === [$bienvenida], json_encode($r, JSON_UNESCAPED_UNICODE));

// Instagram ya preguntó el rubro con su mensaje automático (4-oct): sin bienvenida, para Pablo.
foreach (['Tengo una peluquería', 'Hola', ''] as $primero) {
    $c = conv_nueva('999TEST999', ['canal' => 'instagram']);
    $r = $primero === '' ? wabot_responder('', $c, $cfg) : turno($primero, $c, $cfg);
    caso("Instagram «{$primero}» → sin bienvenida, para Pablo", $r === [] && !empty($c['handoff_pendiente']) && empty($c['bienvenida_ts']),
        json_encode($r, JSON_UNESCAPED_UNICODE));
}
$c = conv_nueva('999TEST999', ['canal' => 'instagram']);
turno('Tengo una peluquería', $c, $cfg);
$r = turno('Y cuánto sale?', $c, $cfg);
caso('Instagram, segundo mensaje → tampoco', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));

// El que no viene a comprar no se lleva "para pasarte el valor de tu web".
$c = conv_nueva('999TEST999');
$r = turno('Ya pagué la seña, cuando empiezan?', $c, $cfg);
caso('cliente que ya pagó → sin bienvenida, para Pablo', $r === [] && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('999TEST999');
$r = turno('Hola, quiero mandarles mi CV', $c, $cfg);
caso('el que busca trabajo → sin bienvenida', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));

// Con el bot apagado en el chat o en control manual, nada.
$c = conv_nueva('999TEST999', ['bot_off' => true]);
caso('chat con el bot apagado → nada', turno('Hola', $c, $cfg) === []);
$c = conv_nueva('999TEST999', ['control_manual' => true]);
caso('en control manual → nada', turno('Hola', $c, $cfg) === []);

// Destildado en el panel, vuelve la charla de siempre (el saludo con las opciones).
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = false;
$c = conv_nueva('999TEST999');
$r = turno('Hola', $c, $cfg);
caso('apagado, el primer "Hola" recibe la bienvenida de antes', $r !== [] && $r !== [$bienvenida], json_encode($r, JSON_UNESCAPED_UNICODE));
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = true;

// El ajuste se guarda desde el panel.
caso('solo_bienvenida es un ajuste del panel', in_array('solo_bienvenida', wabot_ajustes_claves(), true));

todo_ok();
