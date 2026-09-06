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
    global $AVISO;
    foreach ((array)$out as $t) if (trim((string)$t) === trim($AVISO)) return true;
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

list($out) = responder('Una consulta, los textos los puedo editar yo después?');
caso('pregunta suelta: la contesta el agente (null)', $out === null, json_encode($out, JSON_UNESCAPED_UNICODE));

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
    $AVISO === 'Para seguir con el proyecto te va a escribir el desarrollador desde otro número.', $AVISO);

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
    $viejo['postdemo_derivar'] === 'Para seguir con el proyecto te va a escribir el desarrollador desde otro número.',
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

echo "\n" . ($fallas === 0 ? "TODO OK" : "$fallas FALLAS") . " de $total casos\n";
exit($fallas === 0 ? 0 : 1);
