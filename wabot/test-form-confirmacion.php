<?php
/**
 * Confirmación del formulario (Pablo, 12-oct-2026): "a los 5 minutos de que el cliente llena el
 * formulario, si no mandó ni un mensaje extra, el bot manda un mensaje de confirmación". Sin red.
 */
require_once __DIR__ . '/test-lib.php';
$cfg = array_merge(wabot_config_load(), ['activo' => true, 'form_confirmacion_activo' => true, 'form_confirmacion_minutos' => 5]);

$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$ahora = strtotime($hoy . ' 18:00:00 UTC');   // 15:00 en Argentina

/** El cliente chateó, llenó el formulario hace $min minutos y no volvió a escribir. */
function fc_conv($min, $extra = []) {
    global $ahora;
    $form = $ahora - (int)($min * 60);
    $c = conv_nueva('999TEST999', ['bot_off' => true, 'ultimo_cliente_ts' => $form - 600, 'transcript' => []]);
    $c['transcript'][] = ['q' => 'cliente', 't' => 'Dale, quiero la demo', 'ts' => $form - 600];
    $c['transcript'][] = ['q' => 'bot', 't' => 'Completá este formulario: https://gokywebs.com/form/?c=AB12', 'ts' => $form - 590];
    $c['transcript'][] = ['q' => 'sistema', 't' => '[Formulario web] datos', 'ts' => $form];
    $c['form_completado_ts'] = $form;
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

echo "Cuándo sale\n";
caso('a los 5 minutos, sin nada más, corresponde', wabot_form_confirmacion_corresponde(fc_conv(5.2), $cfg, $ahora));
caso('antes de los 5 minutos, no', !wabot_form_confirmacion_corresponde(fc_conv(4), $cfg, $ahora));
caso('con el bot apagado (lo apaga el propio formulario) igual sale', wabot_form_confirmacion_corresponde(fc_conv(6, ['bot_off' => true]), $cfg, $ahora));
$ahoraDia = $ahora;
$ahora += 8 * 3600;   // 23:00 en Argentina, fuera del horario de contacto
caso('de noche también sale (es una respuesta a lo que acaba de hacer)', wabot_form_confirmacion_corresponde(fc_conv(6), $cfg, $ahora));
$ahora = $ahoraDia;
caso('con otro automático reciente igual sale', wabot_form_confirmacion_corresponde(fc_conv(6, ['auto_ultimo_ts' => $ahora - 3600]), $cfg, $ahora));
caso('una vez por formulario', !wabot_form_confirmacion_corresponde(fc_conv(6, ['form_confirmacion_auto_ts' => $ahora - 60]), $cfg, $ahora));
caso('un formulario nuevo después de la confirmación vuelve a confirmarse',
    wabot_form_confirmacion_corresponde(fc_conv(6, ['form_confirmacion_auto_ts' => $ahora - 86400]), $cfg, $ahora));
caso('formulario de hace más de 6 h (cron caído), no', !wabot_form_confirmacion_corresponde(fc_conv(7 * 60), $cfg, $ahora));
$c = fc_conv(6);
$c['transcript'][0]['ts'] = $ahora - 30 * 3600;   // el último mensaje del cliente es de hace 30 h: la ventana de Meta se cerró
$c['ultimo_cliente_ts'] = $ahora - 30 * 3600;
caso('con la ventana de 24 h cerrada (texto libre no sale), no', !wabot_form_confirmacion_corresponde($c, $cfg, $ahora));
$c = fc_conv(6);
$c['transcript'] = array_slice($c['transcript'], 2);   // nunca chateó: solo llenó el formulario de la web
$c['ultimo_cliente_ts'] = 0;
caso('que nunca escribió por el chat (sin ventana), no', !wabot_form_confirmacion_corresponde($c, $cfg, $ahora));

echo "Si pasó algo después del formulario\n";
$c = fc_conv(10);
$c['transcript'][] = ['q' => 'cliente', 't' => 'ya lo mandé', 'ts' => $ahora - 120];
$c['ultimo_cliente_ts'] = $ahora - 120;
caso('el cliente escribió otro mensaje, no', !wabot_form_confirmacion_corresponde($c, $cfg, $ahora));
$c = fc_conv(10);
$c['transcript'][] = ['q' => 'humano', 't' => 'Recibido, gracias', 'ts' => $ahora - 120];
caso('Pablo ya le contestó, no', !wabot_form_confirmacion_corresponde($c, $cfg, $ahora));
$c = fc_conv(10);
$c['transcript'][] = ['q' => 'bot', 't' => 'Sí, ya lo tengo', 'ts' => $ahora - 120];
caso('el bot ya le contestó, no', !wabot_form_confirmacion_corresponde($c, $cfg, $ahora));
$c = fc_conv(10);
$c['transcript'][] = ['q' => 'sistema', 't' => '[Formulario web, paso 2] algo', 'ts' => $ahora - 120];
caso('una línea del sistema (paso 2 del formulario) no cuenta', wabot_form_confirmacion_corresponde($c, $cfg, $ahora));

echo "A quién no\n";
foreach ([
    'ya confirmado por el motor ("ya lo completé")' => ['form_recibido_confirmado' => true],
    'con la demo presentada' => ['presentado_ts' => $ahora - 3600],
    'que avisó que pagó' => ['pago_avisado_ts' => $ahora - 3600],
    'archivada' => ['archivado' => true],
    'que dijo que no' => ['cierre' => 'sin_interes'],
    'que viene por trabajo' => ['contexto_consulta' => 'laboral'],
    'sin formulario completado' => ['form_completado_ts' => 0],
] as $que => $extra) {
    caso("no le escribe a uno $que", !wabot_form_confirmacion_corresponde(fc_conv(6, $extra), $cfg, $ahora));
}
caso('apagado en el panel, no', !wabot_form_confirmacion_corresponde(fc_conv(6), array_merge($cfg, ['form_confirmacion_activo' => false]), $ahora));
caso('bot apagado del todo (activo=false), no', !wabot_form_confirmacion_corresponde(fc_conv(6), array_merge($cfg, ['activo' => false]), $ahora));
caso('con 10 minutos configurados, a los 6 todavía no', !wabot_form_confirmacion_corresponde(fc_conv(6), array_merge($cfg, ['form_confirmacion_minutos' => 10]), $ahora));

echo "Texto\n";
$c = fc_conv(6);
$texto = wabot_form_confirmacion_texto($c, $cfg, $ahora);
caso('saludo según la hora y la entrega resuelta (sin llaves)',
    strpos($texto, 'Hola, buenas tardes, ya recibimos tu formulario.') === 0 && strpos($texto, '{') === false, $texto);
caso('corto: una confirmación, no un párrafo', mb_strlen($texto) <= 200, (string)mb_strlen($texto));
echo "Cuándo se la entrega\n";
// El corte pasó de las 14 a las 15 h el 18-oct (presentación automática: 18 h el mismo día, 14 h del siguiente).
foreach ([['07:00', 'Hola, buen día', 'hoy a la tarde'], ['14:05', 'Hola, buenas tardes', 'hoy a la tarde'],
          ['14:59', 'Hola, buenas tardes', 'hoy a la tarde'], ['15:00', 'Hola, buenas tardes', 'mañana'],
          ['18:00', 'Hola, buenas tardes', 'mañana'], ['22:30', 'Hola, buenas noches', 'mañana'], ['01:00', 'Hola, buen día', 'mañana']] as [$hora, $saludo, $cuando]) {
    $t = strtotime($hoy . ' ' . $hora . ':00 UTC') + 3 * 3600;   // la hora es la argentina
    $c = fc_conv(6);
    $texto = wabot_form_confirmacion_texto($c, $cfg, $t);
    caso("a las $hora: \"$cuando\"", $texto === "$saludo, ya recibimos tu formulario. Con esos datos preparamos la demo. Estará lista para $cuando.", $texto);
}

todo_ok();
