<?php
/**
 * Seguimiento de la oferta de la primera entrega (Pablo, 4-oct-2026): si lo
 * último que le mandamos fue la propuesta, el precio y "Siempre antes de
 * avanzar, armamos una primera entrega de la web, sin costo…" y no contestó,
 * a las 23 h: "Buenas, avisame si te interesa la idea de que te armemos una
 * primera entrega gratis". Sin red.
 */
require_once __DIR__ . '/test-lib.php';
$cfg = array_merge(wabot_config_load(), ['activo' => true, 'oferta_entrega_seguimiento_activo' => true, 'oferta_entrega_seguimiento_horas' => 23,
    'ultima_llamada_activa' => true, 'ultima_llamada_horas' => 23, 'seguimiento_hora_desde' => 8, 'seguimiento_hora_hasta' => 20]);

// Hoy a las 15:00 de Argentina (UTC-3): dentro del horario de contacto.
$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$ahora = strtotime($hoy . ' 18:00:00 UTC');
$oferta = 'Siempre antes de avanzar, armamos una primera entrega de la web, sin costo, para que puedas verla antes de decidir';

/** El cliente escribió hace $horas y Pablo le mandó propuesta, precio y la oferta. */
function oe_conv($horas, $extra = [], $ultimas = null) {
    global $ahora, $oferta;
    $cliente = $ahora - (int)($horas * 3600);
    $c = conv_nueva('999TEST999', ['bot_off' => true, 'ultimo_cliente_ts' => $cliente, 'transcript' => [
        ['q' => 'cliente', 't' => 'Tengo una verdulería, cuánto sale?', 'ts' => $cliente],
        ['q' => 'humano', 't' => 'Te podemos armar un sitio profesional para mostrar tu negocio', 'ts' => $cliente + 60],
        ['q' => 'humano', 't' => "Podés elegir entre dos planes:\n• Plan mensual: \$20.000 por mes", 'ts' => $cliente + 70],
    ]]);
    foreach ($ultimas ?? [['humano', $oferta]] as $i => [$q, $t]) $c['transcript'][] = ['q' => $q, 't' => $t, 'ts' => $cliente + 80 + $i];
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

caso('detecta la oferta de Pablo', wabot_texto_es_oferta_entrega($oferta));
caso('y no confunde otro mensaje', !wabot_texto_es_oferta_entrega('La demo es gratis. Es un primer diseño de tu propia página'));

caso('a las 23 h sin respuesta, corresponde', wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2), $cfg, $ahora));
caso('antes de las 23 h, no', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(20), $cfg, $ahora));
caso('con la ventana cerrada, no', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.8), $cfg, $ahora));
caso('fuera de horario, no', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2), $cfg, $ahora + 7 * 3600));
caso('si el cliente contestó después de la oferta, no',
    !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, [], [['humano', $oferta], ['cliente', 'lo pienso']]), $cfg, $ahora));
caso('si lo último no fue la oferta (le mandé otra cosa sin oferta), no',
    !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, [], [['humano', 'Cualquier duda avisame']]), $cfg, $ahora));
caso('si después de la oferta le mandé algo más, igual cuenta',
    wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, [], [['humano', $oferta], ['humano', 'Cualquier duda avisame']]), $cfg, $ahora));
caso('una sola vez', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, ['oferta_entrega_seguimiento_ts' => $ahora - 86400]), $cfg, $ahora));
caso('no si otro automático salió hace poco', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, ['auto_ultimo_ts' => $ahora - 3600]), $cfg, $ahora));
foreach ([
    'que completó el formulario' => ['form_completado_ts' => $ahora - 3600],
    'con la demo presentada' => ['presentado_ts' => $ahora - 3600],
    'archivada' => ['archivado' => true],
    'que dijo que no' => ['cierre' => 'sin_interes'],
] as $que => $extra) {
    caso("no le escribe a uno $que", !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2, $extra), $cfg, $ahora));
}
caso('apagado en el panel, no', !wabot_oferta_entrega_seguimiento_corresponde(oe_conv(23.2), array_merge($cfg, ['oferta_entrega_seguimiento_activo' => false]), $ahora));
caso('el texto es el de Pablo', $cfg['oferta_entrega_seguimiento'] === 'Buenas, avisame si te interesa la idea de que te armemos una primera entrega gratis');

// La última llamada sigue igual después de mover su cuenta a wabot_cerca_del_cierre().
$ul = conv_nueva('999TEST999', ['fase' => 'reconocimiento', 'ultimo_cliente_ts' => $ahora - 23.2 * 3600, 'nombre' => 'Cliente', 'transcript' => [
    ['q' => 'cliente', 't' => 'Hola, quiero una página web', 'ts' => $ahora - 23.2 * 3600],
    ['q' => 'bot', 't' => 'Te consulto, qué productos vendés?', 'ts' => $ahora - 23.2 * 3600 + 30],
]]);
caso('la última llamada sigue saliendo a las 23 h', wabot_ultima_llamada_corresponde($ul, $cfg, $ahora));
$ul['ultimo_cliente_ts'] = $ahora - 20 * 3600;
caso('…y no antes', !wabot_ultima_llamada_corresponde($ul, $cfg, $ahora));

todo_ok();
