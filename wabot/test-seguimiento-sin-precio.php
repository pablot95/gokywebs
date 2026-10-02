<?php
/**
 * El aviso antes de que cierre la ventana de 24 h para el que escribió y no
 * llegó al precio (Pablo, 2-oct-2026): "Hola buenas tardes, queríamos saber si
 * seguías con interés de hacer la página web. Te compartimos el portfolio…",
 * con el portfolio solo si no se lo mandamos antes. Sin red.
 */
require_once __DIR__ . '/test-lib.php';
$cfg = array_merge(wabot_config_load(), ['activo' => true, 'ultima_llamada_activa' => true, 'ultima_llamada_horas' => 23,
    'seguimiento_hora_desde' => 8, 'seguimiento_hora_hasta' => 20]);

// Hoy a las 15:00 de Argentina (UTC-3): dentro del horario de contacto.
$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$ahora = strtotime($hoy . ' 18:00:00 UTC');   // 15:00 en Argentina

/** Escribió hace $horas, el bot le contestó y no volvió a escribir. */
function sp_conv($horas, $extra = [], $botTexto = 'Te consulto, qué productos vendés?') {
    global $ahora;
    $cliente = $ahora - (int)($horas * 3600);
    return array_merge([
        'fase' => 'reconocimiento', 'ultimo_cliente_ts' => $cliente, 'nombre' => 'Cliente',
        'transcript' => [
            ['q' => 'cliente', 't' => 'Hola, quiero una página web', 'ts' => $cliente],
            ['q' => 'bot', 't' => $botTexto, 'ts' => $cliente + 30],
        ],
    ], $extra);
}

caso('a las 23 h sin contestar, al que no llegó al precio le corresponde el aviso', wabot_ultima_llamada_corresponde(sp_conv(23.2), $cfg, $ahora));
caso('antes de las 23 h todavía no', !wabot_ultima_llamada_corresponde(sp_conv(20), $cfg, $ahora));
caso('con la ventana ya cerrada, no', !wabot_ultima_llamada_corresponde(sp_conv(23.8), $cfg, $ahora));
caso('fuera del horario de contacto, no', !wabot_ultima_llamada_corresponde(sp_conv(23.2), $cfg, $ahora + 8 * 3600));
caso('si el último en escribir fue el cliente, no (la charla está viva)',
    !wabot_ultima_llamada_corresponde(sp_conv(23.2, ['transcript' => [['q' => 'cliente', 't' => 'hola', 'ts' => $ahora - 23.2 * 3600]]]), $cfg, $ahora));
caso('una sola vez', !wabot_ultima_llamada_corresponde(sp_conv(23.2, ['ultima_llamada_enviada' => true]), $cfg, $ahora));
foreach ([
    'con el bot apagado' => ['bot_off' => true],
    'archivada' => ['archivado' => true],
    'con una duda esperando a Pablo' => ['handoff_pendiente' => true],
    'con seguimiento bloqueado' => ['seguimiento_bloqueado' => true],
    'que dijo que no' => ['cierre' => 'sin_interes'],
    'que se despidió' => ['cierre' => 'despedida'],
    'que viene por trabajo' => ['contexto_consulta' => 'laboral'],
    'conocido' => ['contexto_consulta' => 'conocido'],
    'con el formulario ya mandado' => ['link_form_enviado' => true],
    'con la ficha creada' => ['lead_creado' => true],
] as $que => $extra) {
    caso("no le escribe a uno $que", !wabot_ultima_llamada_corresponde(sp_conv(23.2, $extra), $cfg, $ahora));
}
caso('con el aviso apagado en el panel, no', !wabot_ultima_llamada_corresponde(sp_conv(23.2), array_merge($cfg, ['ultima_llamada_activa' => false]), $ahora));

$texto = wabot_seguimiento_sin_precio_texto(sp_conv(23.2), $cfg, $ahora);
caso('el texto es el de Pablo, con el portfolio',
    $texto === 'Hola, buenas tardes, queríamos saber si seguías con interés de hacer la página web. Te compartimos el portfolio con páginas que realizamos y están en funcionamiento: gokywebs.com/portfolio, para que puedas ver un poco nuestros trabajos.', $texto);
$conPortfolio = sp_conv(23.2, [], 'Podés ver trabajos en gokywebs.com/portfolio/?tipo=ecommerce');
$texto2 = wabot_seguimiento_sin_precio_texto($conPortfolio, $cfg, $ahora);
caso('si ya le pasamos el portfolio, va sin el link',
    $texto2 === 'Hola, buenas tardes, queríamos saber si seguías con interés de hacer la página web.', $texto2);
$texto3 = wabot_seguimiento_sin_precio_texto(sp_conv(23.2), $cfg, $ahora - 5 * 3600);
caso('a la mañana saluda con buen día', str_starts_with($texto3, 'Hola, buen día, '), $texto3);
caso('el que vio el precio sigue con su última llamada de siempre',
    !wabot_conv_sin_precio_seguible(['precio_dado' => true, 'ultimo_cliente_ts' => $ahora]) && str_contains((string)$cfg['ultima_llamada'], 'por última vez'));

todo_ok();
