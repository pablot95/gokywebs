<?php
/**
 * Después del precio, el bot solo espera el sí a la demo (Pablo, 2-oct-2026:
 * "el bot no contesta muy bien las preguntas, volvemos a hacer que solo da el
 * precio, ofrece la demo y se calla. Únicamente si el cliente afirma la demo,
 * manda el form, nada más"). La atención automática posterior al precio
 * (postprecio.php) queda apagada por defecto. Sin red: no llama a OpenAI.
 */
require_once __DIR__ . '/test-lib.php';
$cfg = wabot_config_load();
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-real';

caso('la atención posterior al precio viene apagada', empty(wabot_textos_default()['postprecio_activo']) && !wabot_postprecio_encendido($cfg));

/** Una charla a la que se le acaba de pasar el precio con la oferta de la demo. */
function apagado_conv($tipo = 'ecommerce', $extra = []) {
    global $cfg;
    $c = conv_nueva('999APAGADO999', array_merge(['tipo' => $tipo, 'precio_dado' => true,
        'fase' => 'prediseno', 'nombre' => 'Cliente', 'oferta_diseno_ts' => time()], $extra));
    wabot_precio_congelar($c, $tipo, $cfg);
    return $c;
}

foreach (['Sí, dale', 'Me gustaría', 'Si armala porfa'] as $texto) {
    $c = apagado_conv();
    $r = turno($texto, $c, $cfg);
    caso("el sí a la demo manda el formulario y nada más: \"$texto\"", count($r) === 1 && tiene_form($r) && !empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));
}
foreach (['Cuánto sale el dominio .com?', 'Y el mantenimiento qué incluye?', 'Tenés más info de cada plan?', 'Lo voy a pensar'] as $texto) {
    $c = apagado_conv();
    $r = turno($texto, $c, $cfg);
    caso("cualquier otra cosa no se contesta y queda para Pablo: \"$texto\"", $r === [] && !empty($c['bot_off'])
        && ($c['cierre'] ?? '') === 'cotizacion_final' && empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));
    $r2 = turno('Hola?', $c, $cfg);
    caso("y después de eso el bot sigue callado: \"$texto\"", $r2 === []);
}

/* Las charlas que quedaron en la atención automática mientras estuvo prendida
 * (1 y 2-oct) vuelven al corte de siempre. */
$c = apagado_conv('landing', ['postprecio_auto' => true, 'oferta_diseno_ts' => 0]);
$r = turno('Cuánto tarda en estar lista?', $c, $cfg);
caso('una charla que estaba en la etapa automática no recibe respuesta a una pregunta', $r === [] && !empty($c['bot_off']) && empty($c['postprecio_auto']));
$c = apagado_conv('landing', ['postprecio_auto' => true, 'oferta_diseno_ts' => 0]);
$r = turno('Si, quiero la muestra', $c, $cfg);
caso('y si dice que sí a la demo, se lleva el formulario', count($r) === 1 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = apagado_conv('landing', ['postprecio_auto' => true, 'oferta_diseno_ts' => 0, 'link_form_enviado' => true, 'esProspecto' => true]);
caso('con el formulario ya enviado, no se repite', turno('Dale', $c, $cfg) === []);

/* Presentar la demo o recibir el formulario no la deja en la etapa automática. */
$c = apagado_conv('ecommerce', ['postprecio_auto' => true, 'oferta_diseno_ts' => 0]);
wabot_conv_preparar_postdemo($c);
caso('entregar la demo deja la charla en manos de Pablo', !empty($c['control_manual']) && !empty($c['bot_off']));
$c = apagado_conv('ecommerce', ['precio_dado' => true]);
wabot_conv_encender_manual($c);
caso('encender el bot a mano no la vuelve a la etapa automática', empty($c['postprecio_auto']));

/* Preguntas sin sequedad (Pablo, 2-oct: "'Qué productos vendés?' es muy agresiva,
 * tiene que ser 'Te consulto, qué productos vendés?'"). */
foreach (wabot_textos_default()['pide_negocio'] as $tipo => $pregunta) {
    caso("la pregunta por el negocio arranca con \"Te consulto,\": $tipo", str_starts_with($pregunta, 'Te consulto, '), $pregunta);
}
caso('la pregunta de vender o mostrar también', str_starts_with(wabot_textos_default()['reconocimiento'], 'Te consulto, '));
$instr = wabot_ia_instrucciones_comportamiento();
caso('OpenAI tiene la regla de no preguntar seco, con el ejemplo de Pablo',
    str_contains($instr, 'Te consulto, qué productos vendés?') && !str_contains($instr, 'responder: "Qué productos vendés?"'));

todo_ok();
