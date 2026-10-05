<?php
/**
 * Recordatorio del formulario (Pablo, 4-oct-2026): "si después de 12 horas que
 * se le envió el enlace del form, se mande un mensaje preguntando si pudo
 * completar el form. Asegurate que los mensajes automáticos no se pisen entre
 * sí". Sin red.
 */
require_once __DIR__ . '/test-lib.php';
$cfg = array_merge(wabot_config_load(), ['activo' => true, 'form_recordatorio_activo' => true, 'form_recordatorio_horas' => 12,
    'ultima_llamada_activa' => true, 'ultima_llamada_horas' => 23, 'seguimiento_hora_desde' => 8, 'seguimiento_hora_hasta' => 20]);

// Hoy a las 15:00 de Argentina (UTC-3): dentro del horario de contacto.
$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$ahora = strtotime($hoy . ' 18:00:00 UTC');

/** El cliente escribió, Pablo le mandó el link hace $horas y nadie volvió a escribir. */
function fr_conv($horas, $extra = []) {
    global $ahora;
    $link = $ahora - (int)($horas * 3600);
    $c = conv_nueva('999TEST999', ['bot_off' => true, 'ultimo_cliente_ts' => $link - 60, 'transcript' => []]);
    $c['transcript'][] = ['q' => 'cliente', 't' => 'Dale, quiero la demo', 'ts' => $link - 60];
    $c['transcript'][] = ['q' => 'humano', 't' => 'Dale, completá este formulario: https://gokywebs.com/form/?c=AB12 y te la armo', 'ts' => $link];
    $c['form_link_mandado_ts'] = $link;
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

echo "Cuándo sale\n";
caso('a las 12 h del link, sin completar, corresponde', wabot_form_recordatorio_corresponde(fr_conv(12.5), $cfg, $ahora));
caso('antes de las 12 h, no', !wabot_form_recordatorio_corresponde(fr_conv(11), $cfg, $ahora));
caso('con el bot apagado (lo atiende Pablo) igual sale', wabot_form_recordatorio_corresponde(fr_conv(12.5, ['bot_off' => true]), $cfg, $ahora));
caso('fuera del horario de contacto, no', !wabot_form_recordatorio_corresponde(fr_conv(12.5), $cfg, $ahora + 7 * 3600));
caso('con la ventana de 24 h por cerrar, no', !wabot_form_recordatorio_corresponde(fr_conv(23.7), $cfg, $ahora));
caso('una vez por link', !wabot_form_recordatorio_corresponde(fr_conv(12.5, ['form_recordatorio_auto_ts' => $ahora - 3600]), $cfg, $ahora));
$c = fr_conv(12.5);
$c['transcript'][] = ['q' => 'cliente', 't' => 'ahora lo hago', 'ts' => $ahora - 1800];
$c['ultimo_cliente_ts'] = $ahora - 1800;
caso('en medio de una charla (algo en las últimas 2 h), no', !wabot_form_recordatorio_corresponde($c, $cfg, $ahora));
foreach ([
    'que ya completó el formulario' => ['form_completado_ts' => $ahora - 3600],
    'con la ficha creada' => ['lead_creado' => true],
    'con la demo presentada' => ['presentado_ts' => $ahora - 3600],
    'que avisó que pagó' => ['pago_avisado_ts' => $ahora - 3600],
    'archivada' => ['archivado' => true],
    'que dijo que no' => ['cierre' => 'sin_interes'],
    'que viene por trabajo' => ['contexto_consulta' => 'laboral'],
    'sin la hora del link (link de antes del 4-oct)' => ['form_link_mandado_ts' => 0],
] as $que => $extra) {
    caso("no le escribe a uno $que", !wabot_form_recordatorio_corresponde(fr_conv(12.5, $extra), $cfg, $ahora));
}
caso('apagado en el panel, no', !wabot_form_recordatorio_corresponde(fr_conv(12.5), array_merge($cfg, ['form_recordatorio_activo' => false]), $ahora));

echo "Texto\n";
$c = fr_conv(12.5);
$texto = wabot_form_recordatorio_texto_auto($c, $cfg, $ahora);
caso('saludo según la hora y el mismo link que se le mandó',
    $texto === 'Hola, buenas tardes, ¿pudiste completar el formulario? Si tuviste algún problema, avisame y te ayudo. Te lo dejo de nuevo por acá: https://gokywebs.com/form/?c=AB12', $texto);

echo "Que no se pisen\n";
caso('con otro automático en las últimas 12 h, el recordatorio espera',
    !wabot_form_recordatorio_corresponde(fr_conv(12.5, ['auto_ultimo_ts' => $ahora - 5 * 3600]), $cfg, $ahora));
caso('pasadas las 12 h desde el otro, sale',
    wabot_form_recordatorio_corresponde(fr_conv(12.5, ['auto_ultimo_ts' => $ahora - 13 * 3600]), $cfg, $ahora));
// La última llamada tampoco sale si recién salió el recordatorio.
$ul = conv_nueva('999TEST999', ['fase' => 'reconocimiento', 'ultimo_cliente_ts' => $ahora - 23.2 * 3600, 'nombre' => 'Cliente', 'transcript' => [
    ['q' => 'cliente', 't' => 'Hola, quiero una página web', 'ts' => $ahora - 23.2 * 3600],
    ['q' => 'bot', 't' => 'Te consulto, qué productos vendés?', 'ts' => $ahora - 23.2 * 3600 + 30],
]]);
caso('la última llamada sale sola', wabot_ultima_llamada_corresponde($ul, $cfg, $ahora));
$ul['auto_ultimo_ts'] = $ahora - 2 * 3600;
caso('…pero no si hace 2 h salió otro automático', !wabot_ultima_llamada_corresponde($ul, $cfg, $ahora));
// Las plantillas de las 18 h, igual.
$demo = conv_nueva('999TEST999', ['presentado_ts' => $ahora - 80 * 3600, 'presentado_via_bot' => true, 'auto_ultimo_ts' => $ahora - 3600,
    'transcript' => [['q' => 'bot', 't' => 'Te paso la demo', 'ts' => $ahora - 80 * 3600]]]);
$cfgPl = array_replace_recursive($cfg, ['plantillas' => ['confirmacion_demo_48h' => ['activa' => true, 'automatico' => true]]]);
$a18 = strtotime($hoy . ' 21:00:00 UTC');
caso('la plantilla de 72 h espera si otro automático salió hace poco', !wabot_confirmacion_demo_corresponde($demo, $cfgPl, $a18));
$demo['auto_ultimo_ts'] = $a18 - 20 * 3600;
caso('…y sale cuando pasaron más de 12 h', wabot_confirmacion_demo_corresponde($demo, $cfgPl, $a18));

echo "La marca del link\n";
$c = conv_nueva('999TEST999');
wabot_conv_transcript($c, 'humano', 'Te paso el form: gokywebs.com/form/?c=ZZ9');
caso('el link mandado por Pablo deja la hora para el recordatorio', (int)($c['form_link_mandado_ts'] ?? 0) > 0);

todo_ok();
