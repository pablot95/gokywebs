<?php
/**
 * wabot/test-flujo-demo.php — cuándo sale el formulario y cuándo se deriva (solo CLI).
 *
 * La batería del 10-sep (V01–V10, con la config real y Gemini) mostró que el
 * problema no eran las palabras sino el momento: el formulario salía con un
 * dato del negocio ("Vestidos y conjuntos"), un "sí" con el link ya mandado
 * terminaba derivado, los datos por chat no creaban el lead y "ya está todo
 * arriba" derivaba sin mirar si el formulario había llegado. Pablo, 11-sep:
 * "corregir cuándo manda el formulario y cuándo deriva". Esta suite fija:
 *  1. Qué es un sí a la demo y qué no.
 *  2. Los tres pasos terminan preguntando si la quiere.
 *  3. El motor (respaldo del agente) solo manda el link con el sí.
 *  4. La herramienta del agente tampoco, diga lo que diga el modelo.
 *  5. Con el link mandado: el sí repetido, los datos por chat, "ya lo llené".
 *  6. Repetirse con el formulario de por medio no deriva.
 *  7. La baja del plan y la cuenta de Mercado Pago (Pablo, 11-sep).
 * Nada de esto llama a la IA: los caminos del modelo se prueban en la batería.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';
require_once __DIR__ . '/agente.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$cfg['form_activo'] = true;

$fallas = 0; $total = 0;
function caso($nombre, $ok, $detalle = '') {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . ($ok || $detalle === '' ? '' : "  -> $detalle") . "\n";
    if (!$ok) $fallas++;
}

function clasifica($acciones, $extra = []) {
    $GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () use ($acciones, $extra) {
        return array_merge(['acciones' => (array)$acciones, 'info_keys' => [], 'descripcion' => null, 'colores' => null], $extra);
    };
}

function conv_fd($tel) {
    return ['tel' => $tel, 'channel_user_id' => $tel, 'canal' => 'whatsapp', 'conversation_key' => $tel,
        'fase' => 'nuevo', 'tipo' => null, 'descripcion' => null, 'colores' => null, 'msgs' => [],
        'ultimo_ts' => 0, 'transcript' => [], 'espera_avisada' => false, 'no_texto_avisado' => false,
        'bot_off' => false, 'pausado_hasta' => 0, 'lead_creado' => false];
}

/** Charla recién cotizada: precio y tres pasos dados, esperando el sí. */
function conv_tres_pasos($tel, $tipo, $cfg) {
    $c = conv_fd($tel);
    wabot_conv_transcript($c, 'cliente', 'hola, necesito una web');
    foreach (wabot_pitch($tipo, $c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
    return $c;
}

/** Charla con el link ya mandado, como quedó V08 después de "Vestidos y conjuntos". */
function conv_con_link($tel, $cfg) {
    $c = conv_tres_pasos($tel, 'ecommerce', $cfg);
    $c['descripcion'] = 'indumentaria femenina, vestidos y conjuntos';
    foreach ((array)wabot_prediseno_texto($c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
    return $c;
}

/** Un turno por el borde común, con el agente "caído" para que conteste el motor si llega. */
function turno($texto, &$c, $cfg) {
    $GLOBALS['WABOT_TEST_AGENTE_LLAMADO'] = false;
    $GLOBALS['WABOT_TEST_AGENTE'] = function () { $GLOBALS['WABOT_TEST_AGENTE_LLAMADO'] = true; return null; };
    wabot_conv_transcript($c, 'cliente', $texto);
    $c['ultimo_cliente_ts'] = time();
    $cfgAgente = $cfg; $cfgAgente['modo_redaccion'] = 'agente';
    $r = wabot_responder($texto, $c, $cfgAgente);
    foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', (string)$m);
    unset($GLOBALS['WABOT_TEST_AGENTE']);
    return (array)$r;
}

function tiene_form($r) { return strpos(implode(' ', (array)$r), 'gokywebs.com/form/') !== false; }

echo "— 1. Qué es un sí a la demo —\n";

foreach (['si', 'Sí!', 'Si dale, armenla', 'Si, quiero la muestra gratis', 'dale', 'ok', 'dale, mandame el formulario',
          'pasame el link', 'sí por favor', 'me interesa', 'quiero la demo', 'de una', 'obvio', 'Sí, ármenla porfa',
          'bueno dale', 'si quiero', 'armenla', 'genial, avancemos', '👍', 'Perfecto', 'sii prepárenla', 'quiero'] as $si) {
    caso("\"$si\" es un sí", wabot_acepta_demo($si));
}
// Los de la batería: contaban más del negocio, no aceptaban nada.
foreach (['Vestidos y conjuntos', 'Consultas y vacunacion', 'Reservas online', 'Clases grupales',
          'Detergentes y suavizantes', 'No tengo mas nada que agregar, es alquiler de equipos',
          'si tengo 50 productos', 'si quiero vender también ropa', 'no por ahora', 'lo voy a pensar',
          'después te aviso', 'Lo voy a charlar con mi pareja y despues te escribo, gracias', 'gracias',
          'Uh esta caro para mi ahora, no puedo pagar eso', 'dale, cuánto tarda la demo?', 'vamos a ver'] as $no) {
    caso("\"$no\" no es un sí", !wabot_acepta_demo($no));
}
caso('"Sí, cuánto tarda?" acepta y pregunta: vale para el guard de la herramienta', wabot_acepta_demo('Sí, cuánto tarda?', true));
caso('pero "cuánto tarda?" solo es una pregunta', !wabot_acepta_demo('cuánto tarda?', true));

foreach (['ya esta todo arriba, fijate', 'ya lo completé', 'listo, ya lo llené', 'ya te mandé los datos',
          'el formulario ya está completado', 'ahí lo envié'] as $dice) {
    caso("\"$dice\" dice que completó el formulario", wabot_dice_que_completo_form($dice));
}
foreach (['listo', 'ok', 'ya te dije que vendo ropa', 'dale'] as $noDice) {
    caso("\"$noDice\" no dice que lo completó", !wabot_dice_que_completo_form($noDice));
}

echo "— 2. Los tres pasos terminan preguntando si la quiere —\n";

$c = conv_fd('5491188880001TEST');
$r = wabot_pitch('landing', $c, $cfg);
caso('los tres pasos arrancan con la primera entrega gratis', strpos($r[0] ?? '', '1. La primera entrega es gratis') !== false);
caso('y cierran con la pregunta de la demo', preg_match('/\nQuerés que preparemos la demo para tu negocio\?$/u', $r[0] ?? '') === 1, $r[0] ?? '');
caso('sin el link: ese sale con el sí', !tiene_form($r));

$c = conv_fd('5491188880002TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('quien la pidió al entrar recibe los tres pasos SIN la pregunta y el formulario atrás',
    count($r) === 2 && strpos($r[0], 'Querés que preparemos') === false && tiene_form([$r[1] ?? '']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 3. El motor manda el link solo con el sí (V05) —\n";

$c = conv_tres_pasos('5491188880010TEST', 'landing', $cfg);
clasifica(['otro']);
$r = wabot_engine('Reservas online', $c, $cfg);
caso('"Reservas online" no se lleva el pedido de colores por chat', stripos(implode(' ', $r), 'colores') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('ni el formulario', !tiene_form($r) && empty($c['link_form_enviado']));
caso('se toma y se vuelve a preguntar si quiere la demo', ($r[0] ?? '') === wabot_tres_pasos_repregunta_texto(), json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
$r = wabot_engine('Si dale, armenla', $c, $cfg);
caso('"Si dale, armenla" después se lleva el formulario', tiene_form($r) && !empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_tres_pasos('5491188880011TEST', 'ecommerce', $cfg);
$respuestas = [];
foreach (['Vestidos y conjuntos', 'Tengo local en Palermo', 'Hacemos envios a todo el pais'] as $m) {
    clasifica(['otro']);
    $respuestas[] = wabot_salida_preparar(wabot_engine($m, $c, $cfg), $c, $cfg);
}
caso('tres datos seguidos sin contestar: pregunta una vez, deja la puerta abierta y después se calla',
    ($respuestas[0][0] ?? '') === wabot_tres_pasos_repregunta_texto()
    && strpos($respuestas[1][0] ?? '', 'avisame y te paso el formulario') !== false && $respuestas[2] === [],
    json_encode($respuestas, JSON_UNESCAPED_UNICODE));
caso('y nunca deriva ni manda el link', ($c['fase'] ?? '') === 'prediseno' && empty($c['link_form_enviado']));

$c = conv_tres_pasos('5491188880012TEST', 'landing', $cfg);
clasifica(['otro']);
$r = wabot_engine('no', $c, $cfg);
caso('un "no" a la demo cierra sin presión, sin mandar el formulario', !tiene_form($r) && ($c['cierre'] ?? '') === 'consulta_sin_presion',
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 4. La herramienta del agente no manda el link sin el sí (V08, V09) —\n";

foreach (['Vestidos y conjuntos', 'Consultas y vacunacion'] as $i => $dato) {
    $c = conv_tres_pasos('54911888800' . (20 + $i) . 'TEST', 'landing', $cfg);
    $res = wabot_agente_ejecutar('consultar_info', ['clave' => 'prediseno'], $c, $cfg, $dato);
    caso("con \"$dato\" consultar_info('prediseno') no da el link", isset($res['error']) && !isset($res['texto'])
        && empty($c['link_form_enviado']), json_encode($res, JSON_UNESCAPED_UNICODE));
}
$c = conv_tres_pasos('5491188880022TEST', 'landing', $cfg);
$res = wabot_agente_ejecutar('consultar_info', ['clave' => 'prediseno'], $c, $cfg, 'Si dale, armenla');
caso('con "Si dale, armenla" sí lo da', isset($res['texto']) && tiene_form([$res['texto']]), json_encode($res, JSON_UNESCAPED_UNICODE));
$c = conv_tres_pasos('5491188880023TEST', 'landing', $cfg);
$res = wabot_agente_ejecutar('consultar_info', ['clave' => 'prediseno'], $c, $cfg, 'Sí, cuánto tarda?');
caso('y con "Sí, cuánto tarda?" también: aceptó', isset($res['texto']) && tiene_form([$res['texto']]), json_encode($res, JSON_UNESCAPED_UNICODE));

$c = conv_tres_pasos('5491188880024TEST', 'ecommerce', $cfg);
$r = wabot_agente_intento('Si dale, armenla', $c, $cfg);
caso('el atajo del agente entiende "Si dale, armenla" sin pasar por el modelo (V07)', is_array($r) && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 5. Con el link ya mandado (V07, V08) —\n";

$c = conv_con_link('5491188880030TEST', $cfg);
caso('(la charla de prueba tiene el link mandado)', !empty($c['link_form_enviado']) && $c['fase'] === 'prediseno');
$r = turno('Si, quiero la muestra gratis', $c, $cfg);
caso('"Sí, quiero la muestra gratis" se lleva dónde está el formulario, con el link', tiene_form($r)
    && strpos($r[0] ?? '', 'Dale, la demo sale del formulario que te pasé') === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y NO lo deriva', ($c['fase'] ?? '') === 'prediseno' && ($c['cierre'] ?? null) !== 'derivacion');
$r = turno('si quiero la demo', $c, $cfg);
caso('la segunda vez no se repite ni deriva: se calla', $r === [] && ($c['fase'] ?? '') === 'prediseno', json_encode($r, JSON_UNESCAPED_UNICODE));
$r = turno('Malena - IndumentariaMale - negro y dorado', $c, $cfg);
caso('los datos por chat se toman', ($c['nombre_negocio'] ?? '') === 'IndumentariaMale' && ($c['colores'] ?? '') === 'negro y dorado');
caso('y cierran el prediseño como si hubiera llegado el formulario, no con el aviso de derivación',
    ($c['cierre'] ?? '') === 'prediseno' && ($r[0] ?? '') === wabot_texto_prediseno_completo($c, $cfg), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('con la descripción de lo que contó', trim((string)($c['descripcion'] ?? '')) !== '');

$c = conv_con_link('5491188880031TEST', $cfg);
$r = turno('ya esta todo arriba, fijate', $c, $cfg);
caso('"ya está todo arriba" sin el formulario recibido: se le avisa que no llegó, con el link',
    strpos($r[0] ?? '', 'Todavía no me llegó el formulario') === 0 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('sin derivar', ($c['fase'] ?? '') === 'prediseno');
$r = turno('ya lo complete, fijate bien', $c, $cfg);
caso('si insiste, algo anda mal con el formulario: lo toma una persona', ($c['fase'] ?? '') === 'derivado', json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_con_link('5491188880032TEST', $cfg);
$c['form_completado_ts'] = time(); $c['lead_creado'] = 'propuestas/test';
wabot_handoff_marcar($c, 'prediseno');
$r = turno('ya lo complete, fijate', $c, $cfg);
caso('con el formulario recibido, "ya lo completé" se confirma con la entrega',
    strpos($r[0] ?? '', 'Sí, ya lo tengo: la demo te llega') === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$r = turno('ya esta todo arriba', $c, $cfg);
caso('y una sola vez', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_con_link('5491188880033TEST', $cfg);
$r = turno('cuanto tarda la demo?', $c, $cfg);
caso('una pregunta con el link mandado sigue de largo al agente', !empty($GLOBALS['WABOT_TEST_AGENTE_LLAMADO']));

$c = conv_con_link('5491188880034TEST', $cfg);
$c['nombre_negocio'] = 'IndumentariaMale'; $c['colores'] = 'negro y dorado';
clasifica(['pregunta_info'], ['info_keys' => ['hosting']]);
$r = turno('el dominio viene incluido?', $c, $cfg);
caso('con los datos ya sabidos, una pregunta se contesta: el borde no cierra encima de ella',
    !empty($GLOBALS['WABOT_TEST_AGENTE_LLAMADO']) && !in_array('prediseno_datos_por_chat', array_keys((array)($c['eventos_emitidos_sesion'] ?? [])), true),
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 6. Repetirse con el formulario de por medio no deriva —\n";

$c = conv_con_link('5491188880040TEST', $cfg);
$texto = 'Perfecto, quedo atento.';
$c['tandas_bot'] = [wabot_normalizar_frase($texto)];
$r = wabot_anti_repeticion([$texto], $c, $cfg);
caso('con el link mandado, un texto repetido se calla en vez de derivar', $r === [] && ($c['fase'] ?? '') === 'prediseno',
    json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_tres_pasos('5491188880041TEST', 'landing', $cfg);
$c['tandas_bot'] = [wabot_normalizar_frase($texto)];
$r = wabot_anti_repeticion([$texto], $c, $cfg);
caso('y esperando el sí a la demo, también', $r === [] && ($c['fase'] ?? '') === 'prediseno', json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 7. La baja del plan y la cuenta de Mercado Pago (Pablo, 11-sep) —\n";

$baja = wabot_texto_info('baja_del_plan', $cfg);
caso('la baja se hace desde Mercado Pago', mb_stripos($baja, 'desde Mercado Pago') !== false, $baja);
caso('y el que se suscribió sin cuenta, llamando al banco de la tarjeta', mb_stripos($baja, 'banco') !== false && mb_stripos($baja, 'sin cuenta') !== false);
caso('sigue diciendo que no hay permanencia y que la web se desactiva', mb_stripos($baja, 'permanencia') !== false && mb_stripos($baja, 'desactiva') !== false);
$c = conv_tres_pasos('5491188880050TEST', 'landing', $cfg);
$pago = wabot_texto_pago($c, $cfg);
caso('cómo se paga aclara que no hace falta cuenta de Mercado Pago', mb_stripos($pago, 'cualquier tarjeta') !== false, $pago);
foreach (['como doy de baja el plan?', 'se puede cancelar la suscripcion?', 'necesito cuenta de mercado pago?',
          'no tengo mercado pago, puedo pagar igual?', 'hay permanencia?', 'que pasa si dejo de pagar?'] as $p) {
    caso("\"$p\" → baja_del_plan", wabot_info_por_palabras($p, 'prediseno') === 'baja_del_plan', (string)wabot_info_por_palabras($p, 'prediseno'));
}
caso('"puedo dar de baja una propiedad?" es del panel, no del plan',
    wabot_info_por_palabras('puedo dar de baja una propiedad?', 'prediseno') !== 'baja_del_plan');

echo "\n" . ($fallas === 0 ? "TODO OK — $total casos" : "FALLAS: $fallas de $total") . "\n";
exit($fallas === 0 ? 0 : 1);
