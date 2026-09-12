<?php
/**
 * wabot/test-postdemo.php — la parte 2, después de presentar la demo (solo CLI).
 *
 * Pablo, 5-sep-2026: "el wabot deriva directo, como que deja de interpretar lo
 * que dice el cliente (...) la idea es que siga contestando dudas, no venda,
 * que conteste más natural. Pero que deje en claro que yo le voy a escribir
 * desde otro whatsapp para seguir. Que diga desarrollador, no Pablo" — y
 * después: "mejor que solo diga eso, pero que identifique si de verdad el
 * cliente mostró interés".
 *
 * Lo que se prueba: el aviso de handoff sale UNA sola vez y SOLO con interés
 * real; mientras el cliente está mirando, el bot sigue disponible.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$AVISO = (string)$cfg['postdemo_derivar'];

$fallas = 0; $total = 0;
function caso($nombre, $ok, $detalle = '') {
    global $fallas, $total; $total++;
    echo ($ok ? "  OK  " : "  FALLA  ") . $nombre . ($ok || $detalle === '' ? '' : "  -> $detalle") . "\n";
    if (!$ok) $fallas++;
}

/** Una conversación con la demo recién presentada. */
function conv_postdemo(array $extra = []) {
    return array_merge([
        'fase' => 'postdemo', 'presentado_ts' => time() - 600, 'presentado_slug' => 'demo-test',
        'tipo' => 'landing', 'precio_dado' => true, 'nombre' => 'Ana',
        'transcript' => [], 'handoff_pendiente' => false, 'espera_avisada' => false,
    ], $extra);
}

function responder($texto, array $extra = []) {
    global $cfg;
    $conv = conv_postdemo($extra);
    $out  = wabot_postdemo_responder($texto, $conv, $cfg);
    return [$out, $conv];
}

function tiene_aviso($out) {
    global $AVISO, $cfg;
    foreach ((array)$out as $t) if (in_array(trim((string)$t), [$AVISO, $cfg['postdemo_derivar_pago']], true)) return true;
    return false;
}

echo "\n=== El aviso NO sale mientras el cliente está mirando ===\n";

foreach ([
    'la va a mirar'      => 'Dale, la voy a mirar y te digo',
    'elogio suelto'      => 'Me encantó, quedó hermosa',
    'pide un cambio'     => 'Se puede cambiar el color del fondo?',
    'no le gustó'        => 'La verdad no me gustó',
    'lo tiene que pensar'=> 'Lo tengo que pensar',
] as $nombre => $texto) {
    list($out, $conv) = responder($texto);
    caso("$nombre: sin aviso", !tiene_aviso($out), json_encode($out, JSON_UNESCAPED_UNICODE));
    caso("$nombre: la charla sigue viva", ($conv['fase'] ?? '') === 'postdemo' && empty($conv['handoff_pendiente']));
    caso("$nombre: el bot no se calla", empty($conv['postdemo_avisado']));
}

list($out) = responder('Dale, la voy a mirar y te digo');
caso('la va a mirar: contesta lo suyo', $out === [(string)$cfg['postdemo_la_miro']], json_encode($out, JSON_UNESCAPED_UNICODE));

list($out, $conv) = responder('Me encantó, quedó hermosa');
caso('elogio: pregunta por los cambios', $out === [(string)$cfg['postdemo_elogio']], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('elogio: queda anotado que preguntó', !empty($conv['postdemo_pregunto_cambios']));

list($out, $conv) = responder('Lo tengo que pensar');
caso('duda: ofrece la videollamada', $out === [(string)$cfg['postdemo_videollamada']], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('duda: no deriva todavía', empty($conv['handoff_pendiente']));

list($out) = responder('Una consulta, la demo tiene animaciones cuando hago scroll?');
caso('pregunta suelta sin texto oficial: la contesta el agente (null)', $out === null, json_encode($out, JSON_UNESCAPED_UNICODE));
list($out) = responder('Una consulta, los textos los puedo editar yo después?');
caso('pregunta suelta con texto oficial: se contesta acá, sin agente',
    is_array($out) && count($out) === 1 && stripos($out[0], 'panel') !== false, json_encode($out, JSON_UNESCAPED_UNICODE));

echo "\n=== El aviso SÍ sale con interés real ===\n";

$interes = [
    'pregunta cómo sigue'   => ['Buenísimo, cómo seguimos?', []],
    'quiere contratar'      => ['Listo, quiero avanzar con la web', []],
    'pregunta por la seña'  => ['Cuánto es la seña para arrancar?', []],
    'pregunta cómo pagar'   => ['Cómo te pago?', []],
    'pide el link de pago'  => ['Puedo pagarlo con tarjeta en cuotas?', []],
    'regatea el precio'     => ['Me parece un poco caro, no hay descuento?', []],
    'acepta videollamada'   => ['Dale, buenísimo', ['videollamada_ofrecida' => true]],
    'no le cambia nada'     => ['No, así está perfecta', ['postdemo_pregunto_cambios' => true]],
];
foreach ($interes as $nombre => $par) {
    list($texto, $extra) = $par;
    list($out, $conv) = responder($texto, $extra);
    caso("$nombre: manda el aviso", tiene_aviso($out), json_encode($out, JSON_UNESCAPED_UNICODE));
    caso("$nombre: queda para el desarrollador", !empty($conv['handoff_pendiente']) && ($conv['fase'] ?? '') === 'derivado');
    caso("$nombre: no vuelve a avisar", !empty($conv['postdemo_avisado']));
}

list($out, $conv) = responder('Ya te hice la transferencia');
caso('avisa que pagó: acusa recibo', is_array($out) && strpos(implode(' ', $out), (string)$cfg['postdemo_pago_avisado']) !== false, json_encode($out, JSON_UNESCAPED_UNICODE));
caso('avisa que pagó: queda marcado el pago', (int)($conv['pago_avisado_ts'] ?? 0) > 0);

echo "\n=== El aviso, una sola vez y sin nombre propio ===\n";

caso('el aviso es el texto corto pedido',
    $AVISO === 'Para seguir con el proyecto te va a escribir el desarrollador desde nuestro número de proyectos.', $AVISO);

$conNombre = [];
array_walk_recursive($cfg, function ($v, $k) use (&$conNombre) {
    if (!is_string($v) || $v === '') return;
    if (preg_match('/(token|key|secret|alias|titular|cbu|documento|password)/i', (string)$k)) return;
    if (preg_match('/\bPablo\b/u', $v)) $conNombre[] = "$k: " . mb_substr($v, 0, 60);
});
caso('ningún texto del bot lo nombra', $conNombre === [], implode(' | ', array_slice($conNombre, 0, 4)));

// Segunda respuesta después del aviso: el corte de redactor.php ya no lo repite.
$conv = conv_postdemo(['fase' => 'derivado', 'postdemo_avisado' => true, 'handoff_pendiente' => true]);
$out = wabot_responder('Perfecto, gracias', $conv, $cfg);
caso('después del aviso, un "gracias" no recibe nada', $out === [], json_encode($out, JSON_UNESCAPED_UNICODE));

$conv = conv_postdemo(['fase' => 'derivado', 'postdemo_avisado' => true, 'handoff_pendiente' => true]);
$out = wabot_responder('Y el dominio lo pagan ustedes?', $conv, $cfg);
caso('después del aviso, una pregunta no muere en el silencio', $out !== [], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('y esa respuesta no repite el aviso', !tiene_aviso($out), json_encode($out, JSON_UNESCAPED_UNICODE));

echo "\n=== Una config vieja como la de producción converge sola ===\n";

/* La bot-config.json de producción la reescribe el panel y diverge de la
 * local: la única prueba que vale es reproducir los textos viejos y pasarlos
 * por la cadena de migraciones (ver la nota de config que diverge). */
$viejo = [
    'postdemo_derivar' => 'A partir de ahora el desarrollo completo lo va a continuar el desarrollador, Pablo, te va a escribir desde otro número.',
    'postdemo_elogio'  => 'Le cambiarías algo, o avanzamos para dejarla lista?',
    'postdemo_videollamada' => 'Si te sirve, coordinamos una videollamada con Pablo, el desarrollador: te muestra todo en vivo y te saca las dudas de una. Te lo paso así arreglan el horario?',
    'derivar'          => 'Perfecto. Tu consulta la sigue Pablo directamente: te escribe a la brevedad por acá.',
    'espera'           => 'Pablo ya tiene tu consulta y te escribe en un rato por acá.',
    'pago_alias'       => 'pablotravis',
    'pago_titular'     => 'Pablo Travi',
];
wabot_config_migrar($viejo);
caso('el aviso viejo se reemplaza por el corto',
    $viejo['postdemo_derivar'] === 'Para seguir con el proyecto te va a escribir el desarrollador desde nuestro número de proyectos.',
    $viejo['postdemo_derivar']);
caso('el elogio deja de proponer avanzar',
    mb_stripos($viejo['postdemo_elogio'], 'avanzamos') === false, $viejo['postdemo_elogio']);
foreach (['postdemo_videollamada', 'derivar', 'espera'] as $k) {
    caso("$k pierde el nombre propio", mb_stripos($viejo[$k], 'pablo') === false, $viejo[$k]);
}
caso('pero el alias de cobro NO se toca', $viejo['pago_alias'] === 'pablotravis', $viejo['pago_alias']);
caso('ni el titular de la cuenta', $viejo['pago_titular'] === 'Pablo Travi', $viejo['pago_titular']);

echo "\n=== El agente no puede anunciar el contacto por su cuenta ===\n";
require_once __DIR__ . '/agente.php';
foreach ([
    'El desarrollador te va a escribir desde otro número para seguir.' => true,
    'De acá en más lo sigue el desarrollador.'                          => true,
    'Te lo paso al desarrollador así lo ven juntos.'                    => true,
    'Dale, miralo tranquilo y cualquier duda escribime por acá.'        => false,
    'Me alegro que te haya gustado. Le cambiarías algo?'                => false,
    'El dominio queda a tu nombre y lo renovás una vez por año.'        => false,
] as $texto => $esperado) {
    caso(($esperado ? 'detecta' : 'deja pasar') . ': ' . mb_substr($texto, 0, 42),
        wabot_texto_anuncia_contacto($texto) === $esperado);
}

/* ─── Auditoría 7-sep: A (preguntas que se comían), B (cambios que no se
 *     guardaban), E (actividad ≠ interés) ─── */

echo "\n=== A. El texto fijo no se come las preguntas del mismo mensaje ===\n";

list($out, $conv) = responder('Me gustó, pero cuánto sale y tiene mantenimiento mensual?');
$todo = implode("\n", (array)$out);
caso('elogio + 2 preguntas: contesta el precio', stripos($todo, 'seña') !== false || preg_match('/\$\s?\d/', $todo), json_encode($out, JSON_UNESCAPED_UNICODE));
caso('elogio + 2 preguntas: contesta el mantenimiento', stripos($todo, 'mantenimiento') !== false || stripos($todo, 'plan mensual') !== false, json_encode($out, JSON_UNESCAPED_UNICODE));
caso('elogio + 2 preguntas: y la pregunta por los cambios va ÚLTIMA', end($out) === (string)$cfg['postdemo_elogio'], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('elogio + 2 preguntas: sin aviso, la charla sigue viva', !tiene_aviso($out) && empty($conv['handoff_pendiente']));

list($out, $conv) = responder('Quiero cambiar el color y saber cuánto cuesta el mantenimiento');
caso('cambio + pregunta: primero acusa el cambio', ($out[0] ?? '') === (string)$cfg['postdemo_cambios'], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('cambio + pregunta: después contesta el mantenimiento', count($out) === 2 && (stripos($out[1], 'mantenimiento') !== false || stripos($out[1], 'plan mensual') !== false), json_encode($out, JSON_UNESCAPED_UNICODE));
caso('cambio + pregunta: y el cambio quedó ANOTADO en la ficha', stripos((string)($conv['cambios_pedidos'] ?? ''), 'cambiar el color') !== false, (string)($conv['cambios_pedidos'] ?? ''));

list($out, $conv) = responder('Se puede cambiar el color del fondo?');
caso('la pregunta que ES el cambio no dispara nada extra', $out === [(string)$cfg['postdemo_cambios']], json_encode($out, JSON_UNESCAPED_UNICODE));

list($out, $conv) = responder('Me encantó! Los botones se pueden hacer más grandes en el celular?');
caso('elogio + pregunta sin texto oficial: null (la contesta el agente)', $out === null, json_encode($out, JSON_UNESCAPED_UNICODE));
caso('...y el texto fijo queda pendiente para ponerlo adelante', ($conv['_postdemo_prefijo'] ?? '') === (string)$cfg['postdemo_elogio'], (string)($conv['_postdemo_prefijo'] ?? ''));

// El wrapper del agente pone el fijo con la respuesta del modelo.
require_once __DIR__ . '/agente.php';
$GLOBALS['WABOT_TEST_AGENTE'] = function ($m, &$c, $cfg) { return ['Sí, en el celular los botones se hacen más grandes.']; };
$convA = conv_postdemo(['_postdemo_prefijo' => (string)$cfg['postdemo_elogio']]);
$out = wabot_agente('Me encantó! Los botones se pueden hacer más grandes en el celular?', $convA, $cfg);
caso('agente: contesta la pregunta y cierra con la pregunta fija', $out === ['Sí, en el celular los botones se hacen más grandes.', (string)$cfg['postdemo_elogio']], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('agente: la transitoria no queda en la conversación', !array_key_exists('_postdemo_prefijo', $convA));
$convB = conv_postdemo(['_postdemo_prefijo' => (string)$cfg['postdemo_cambios']]);
$out = wabot_agente('Cambiame el verde. Y el logo lo puedo mandar después?', $convB, $cfg);
caso('agente: el acuse de cambios (sin pregunta) va ADELANTE', ($out[0] ?? '') === (string)$cfg['postdemo_cambios'] && count($out) === 2, json_encode($out, JSON_UNESCAPED_UNICODE));
unset($GLOBALS['WABOT_TEST_AGENTE']);

// Sin agente, el motor manda el fijo solo: el peor caso es el de antes.
$convC = conv_postdemo();
$out = wabot_engine('Me encantó! Los botones se pueden hacer más grandes en el celular?', $convC, $cfg);
caso('motor sin agente: sale el fijo, nunca "contame qué te pareció"', $out === [(string)$cfg['postdemo_elogio']], json_encode($out, JSON_UNESCAPED_UNICODE));
caso('motor: la transitoria se consumió', !array_key_exists('_postdemo_prefijo', $convC));

// Por el borde real (wabot_responder), con el orden del webhook: la línea
// del cliente ya está en el transcript cuando corre el corte.
$convD = conv_postdemo(['tel' => 'TEST-A', 'transcript' => [['q' => 'cliente', 't' => 'Me gustó, pero cuánto sale y tiene mantenimiento mensual?', 'ts' => time()]]]);
$convD['ultimo_cliente_ts'] = time();
$out = wabot_responder('Me gustó, pero cuánto sale y tiene mantenimiento mensual?', $convD, array_merge($cfg, ['modo_redaccion' => 'fijo']));
caso('por wabot_responder: las dos preguntas salen contestadas', (stripos(implode("\n", (array)$out), 'mantenimiento') !== false || stripos(implode("\n", (array)$out), 'plan mensual') !== false) && count($out) >= 2, json_encode($out, JSON_UNESCAPED_UNICODE));

echo "\n=== B. Lo que dice que anota, lo anota ===\n";

list($out, $conv) = responder('Sí, quiero cambiar los colores');
caso('postdemo: "anoto esos cambios" con cambios_pedidos cargado', $out === [(string)$cfg['postdemo_cambios']] && trim((string)($conv['cambios_pedidos'] ?? '')) !== '', json_encode($conv['cambios_pedidos'] ?? null, JSON_UNESCAPED_UNICODE));
list($out, $conv) = responder('Quiero cambiar los colores', ['cambios_pedidos' => 'Quiero cambiar los colores']);
caso('el mismo pedido dos veces no se duplica', $conv['cambios_pedidos'] === 'Quiero cambiar los colores', $conv['cambios_pedidos']);
$convE = conv_postdemo(['cambios_pedidos' => 'sacar el banner']);
wabot_cambios_anotar($convE, 'cambiar el verde');
caso('helper: acumula con separador', $convE['cambios_pedidos'] === 'sacar el banner | cambiar el verde', $convE['cambios_pedidos']);
caso('helper: vacío no anota', wabot_cambios_anotar($convE, '   ') === false);

echo "\n=== E. Actividad no es interés ===\n";

list($out, $conv) = responder('No me interesa, no quiero avanzar');
caso('rechazo postdemo: se cierra sin presión', ($conv['cierre'] ?? '') === 'sin_interes' && !empty($conv['seguimiento_bloqueado']), json_encode($conv['cierre'] ?? null));
caso('rechazo postdemo: contesta la despedida, no "le cambiarías algo?"', is_array($out) && count($out) === 1 && stripos($out[0], 'cambiar') === false, json_encode($out, JSON_UNESCAPED_UNICODE));
caso('rechazo postdemo: el panel NO lo cuenta como demo con interés', wabot_presentada_con_interes($conv) === false && wabot_presentada_nivel($conv) === 'rechazo', wabot_presentada_nivel($conv));
list($out, $conv) = responder('No me interesa vender online, solo que me consulten');
caso('"no me interesa vender" NO es un rechazo', ($conv['cierre'] ?? '') !== 'sin_interes');

$base = ['presentado_ts' => time() - 3600, 'transcript' => []];
caso('demo sin respuesta → sin_respuesta', wabot_presentada_nivel($base) === 'sin_respuesta');
$hablo = $base; $hablo['transcript'][] = ['q' => 'cliente', 't' => 'Dale, la miro', 'ts' => time()];
caso('escribió después de la demo → respondio (DEI)', wabot_presentada_nivel($hablo) === 'respondio' && wabot_presentada_con_interes($hablo));
caso('se le avisó que sigue el desarrollador → avanza', wabot_presentada_nivel(array_merge($hablo, ['postdemo_avisado' => true])) === 'avanza');
caso('pidió que lo busquemos → pausa', wabot_presentada_nivel(array_merge($hablo, ['retomar_ts' => time() + 86400 * 20])) === 'pausa');

$precio = ['precio_dado' => true, 'fase' => 'precio', 'transcript' => [
    ['q' => 'cliente', 't' => 'cuánto sale?', 'ts' => time() - 100],
    ['q' => 'bot', 't' => 'Una landing sale $190.000 por todo el desarrollo. gokywebs.com/presupuestos/Landing', 'ts' => time() - 90],
]];
caso('precio dado y silencio: NO es "interesado"', wabot_conv_interesado($precio) === false);
$precio['transcript'][] = ['q' => 'cliente', 't' => 'y tiene mantenimiento?', 'ts' => time() - 10];
caso('precio dado y siguió hablando: sí', wabot_conv_interesado($precio) === true);
caso('sin precio en el transcript se asume como antes', wabot_conv_interesado(['precio_dado' => true, 'transcript' => []]) === true);
caso('y la última llamada respeta lo mismo',
    wabot_ultima_llamada_corresponde(['precio_dado' => true, 'ultimo_cliente_ts' => time() - 23.2 * 3600,
        'transcript' => [['q' => 'cliente', 't' => 'precio?', 'ts' => time() - 23.2 * 3600], ['q' => 'bot', 't' => 'Sale $190.000. gokywebs.com/presupuestos/Landing', 'ts' => time() - 23.1 * 3600]]],
        array_merge($cfg, ['activo' => true, 'ultima_llamada_activa' => true]), time()) === false);

/* ─── La plantilla de las 48 h es SOLO para el que nunca contestó ───
 *
 * De `presentado_confirmado` cuelgan tres automatismos: la plantilla de las
 * 48 h, el archivado a los 7 días y la columna "presentadas sin respuesta".
 * El flag se marcaba adentro del corte de postdemo, así que cualquier corte
 * anterior que contestara y terminara el turno lo dejaba apagado: el de
 * retomar (8-sep) hacía que "dale, la miro y te escribo el lunes" recibiera
 * igual la plantilla. Ahora se marca en el borde común de wabot_responder().
 */
echo "\n=== La plantilla de 48 h no le llega al que contestó ===\n";

$cfg48 = array_merge($cfg, ['activo' => true, 'modo_redaccion' => 'fijo']);
function conv48($texto) {
    return [
        'tel' => 'TEST48', 'canal' => 'whatsapp', 'fase' => 'postdemo',
        'presentado_ts' => time() - 49 * 3600, 'presentado_via_bot' => true,
        'presentado_slug' => 'demo-test', 'tipo' => 'landing', 'precio_dado' => true, 'nombre' => 'Ana',
        // Orden del webhook: la línea del cliente ya está escrita cuando corre
        // wabot_responder() (ver tecnica_wabot_webhook_escribe_antes_de_responder).
        'transcript' => [
            ['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => time() - 49 * 3600],
            ['q' => 'cliente', 't' => $texto, 'ts' => time()],
        ],
        'ultimo_cliente_ts' => time(),
    ];
}

foreach ([
    'elogio'                 => 'Me gustó mucho, quedó linda',
    'la va a mirar'          => 'Dale, la voy a mirar',
    'pide un cambio'         => 'Se puede cambiar el color?',
    'contesta con fecha'     => 'Dale, la miro y te escribo el lunes',
    'promete avisar'         => 'La veo tranquilo y te aviso mañana',
    'pide que lo busquen'    => 'Buenísimo. Contactame en 30 dias',
    'rechaza'                => 'No me interesa, no quiero avanzar',
    'pide la baja'           => 'Sacame de la lista, no me escriban mas',
    'solo agradece'          => 'gracias!!',
    'un pulgar'              => '👍',
] as $nombre => $texto) {
    $c = conv48($texto);
    wabot_responder($texto, $c, $cfg48);
    caso("$nombre: queda marcado como que contestó", !empty($c['presentado_confirmado']));
    caso("$nombre: NO se le manda la plantilla de 48 h", wabot_confirmacion_demo_corresponde($c, $cfg48) === false);
    caso("$nombre: y no se archiva a los 7 días", wabot_presentado_archivar_corresponde($c, $cfg48, time() + 8 * 86400) === false);
}

$mudo = ['tel' => 'TEST48MUDO', 'canal' => 'whatsapp', 'fase' => 'postdemo', 'tipo' => 'landing',
         'presentado_ts' => time() - 49 * 3600, 'presentado_via_bot' => true,
         'transcript' => [['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => time() - 49 * 3600]]];
caso('el que NUNCA contestó sí la recibe', wabot_confirmacion_demo_corresponde($mudo, $cfg48) === true);
caso('a las 47 h todavía no', wabot_confirmacion_demo_corresponde(array_merge($mudo, ['presentado_ts' => time() - 47 * 3600]), $cfg48) === false);
caso('si la demo no la mandó el bot, nunca', wabot_confirmacion_demo_corresponde(array_merge($mudo, ['presentado_via_bot' => false]), $cfg48) === false);
caso('y una sola vez por conversación', wabot_confirmacion_demo_corresponde(array_merge($mudo, ['confirmacion_demo_enviada' => true]), $cfg48) === false);

$sinDemo = ['tel' => 'TEST48SIN', 'fase' => 'menu', 'transcript' => []];
caso('sin demo entregada no hay nada que marcar', wabot_presentado_marcar_respuesta($sinDemo) === false && empty($sinDemo['presentado_confirmado']));

echo "\n" . ($fallas === 0 ? "TODO OK" : "$fallas FALLAS") . " de $total casos\n";
exit($fallas === 0 ? 0 : 1);
