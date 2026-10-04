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

// Sin OpenAI (los tests no tienen red), el primer mensaje recibe la bienvenida, sea un saludo o ya cuente el negocio.
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

// Con OpenAI (simulado): si ya dice el rubro, sin bienvenida (4-oct); si no, la bienvenida.
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-test-bienvenida-' . getmypid();
$oaPedidos = 0;
$oaRespuesta = function ($valor) use (&$oaPedidos) {
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) use ($valor, &$oaPedidos) {
        $oaPedidos++;
        if ($valor === null) return [500, '{"error":{"message":"caido"}}'];
        return [200, json_encode(['model' => 'gpt-6-sol', 'status' => 'completed', 'usage' => ['input_tokens' => 300, 'output_tokens' => 10],
            'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode(['ya_dice_rubro' => $valor])]]]]])];
    };
};
$oaRespuesta(true);
$c = conv_nueva('999TEST999');
$r = turno('Hola. ¿Puedo obtener más información sobre esto?presio soy pintor de obra', $c, $cfg);
caso('ya dice el rubro → sin bienvenida, para Pablo', $r === [] && !empty($c['handoff_pendiente'])
    && ($c['bienvenida_omitida'] ?? '') === 'ya_dijo_rubro', json_encode($r, JSON_UNESCAPED_UNICODE));
$oaRespuesta(false);
$c = conv_nueva('999TEST999');
$r = turno('Hola. ¿Puedo obtener más información sobre esto?', $c, $cfg);
caso('no dice el rubro → la bienvenida', $r === [$bienvenida], json_encode($r, JSON_UNESCAPED_UNICODE));
$oaRespuesta(null);
$c = conv_nueva('999TEST999');
$r = turno('Tengo una verdulería', $c, $cfg);
caso('OpenAI caído → la bienvenida, como siempre', $r === [$bienvenida], json_encode($r, JSON_UNESCAPED_UNICODE));
$oaRespuesta(true);
$oaPedidos = 0;
$c = conv_nueva('999TEST999');
wabot_responder('', $c, $cfg);
caso('un archivo sin leer no le pregunta a OpenAI', $oaPedidos === 0);
unset($GLOBALS['WABOT_TEST_OPENAI_HTTP'], $GLOBALS['WABOT_TEST_OPENAI_KEY']);
foreach ((array)glob($GLOBALS['WABOT_TEST_IA_USO_DIR'] . '/*') as $f) @unlink($f);
@rmdir($GLOBALS['WABOT_TEST_IA_USO_DIR']);

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

// La lista del panel no muestra al que recibió la bienvenida y no contestó más (4-oct).
$fila = function ($q, $t) { return ['q' => $q, 't' => $t, 'ts' => time()]; };
$casos = [
    'pidió info y no contestó la bienvenida' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida)], [], true],
    'tampoco con el seguimiento de 23 h' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida), $fila('bot', 'Hola, buenas tardes, queríamos saber…')], [], true],
    'contestó la bienvenida' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida), $fila('cliente', 'Tengo una verdulería')], [], false],
    'Pablo le escribió' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida), $fila('humano', 'Hola!')], [], false],
    'sin bienvenida todavía (o Instagram)' => [[$fila('cliente', 'Tengo una verdulería')], [], false],
    'en favoritos' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida)], ['favorito' => true], false],
    'completó el formulario' => [[$fila('cliente', 'Info'), $fila('bot', $bienvenida)], ['form_completado_ts' => time()], false],
];
foreach ($casos as $nombre => [$transcript, $extra, $oculto]) {
    $c = conv_nueva('999TEST999', $extra + ['transcript' => $transcript]);
    caso(($oculto ? 'oculto en la lista: ' : 'se ve en la lista: ') . $nombre, wabot_conv_sin_respuesta_a_bienvenida($c) === $oculto);
}

// Mandada la plantilla de interesado, el chat sale de favoritos (4-oct).
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$c = conv_nueva('999TEST999', ['favorito' => true, 'favorito_ts' => time()]);
$ok = wabot_template_interesado_enviar($c, $cfg);
caso('plantilla de interesado → sale de favoritos', $ok === 'ok' && empty($c['favorito']) && empty($c['favorito_ts']), $ok);

todo_ok();
