<?php
require_once __DIR__ . '/test-lib.php';
$cfg = wabot_config_load();

echo "— Prospectos, pagos y portfolio —\n";

$c = conv_nueva('549110001TEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$r = turno('dale', $c, $cfg);
// 18-sep: el formulario va con el código de la charla, no el link pelado.
caso('un sí corto inmediatamente después del precio manda solo el formulario',
    count($r) === 1 && tiene_form($r) && strpos($r[0], 'gokywebs.com/form/?c=') !== false, json_encode($r));
caso('queda marcado como prospecto y el bot se apaga', !empty($c['esProspecto']) && !empty($c['bot_off']) && !empty($c['handoff_pendiente']));

$c = conv_nueva('549110001BTEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$r = turno('dale, armala', $c, $cfg);
caso('un interés claro como "dale, armala" también deriva y manda solo el formulario',
    count($r) === 1 && tiene_form($r) && !empty($c['esProspecto']) && !empty($c['bot_off']), json_encode($r));

$c = conv_nueva('549110002TEST', ['tipo' => 'ecommerce', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'ecommerce', $cfg);
$r = turno('¿Qué diferencia hay entre un precio y el otro?', $c, $cfg);
$texto = implode(' ', $r);
// 26-sep a la noche: sin el plan con cambios, los dos planes incluyen un cambio por mes.
caso('explica la diferencia entre los planes, con sus montos y sin seña (19-sep)', str_contains($texto, 'Los dos planes incluyen lo mismo')
    && str_contains($texto, 'Plan anual de ' . $cfg['tipos']['ecommerce']['precio'] . ' por año')
    && str_contains($texto, 'Plan mensual de ' . $cfg['tipos']['ecommerce']['mensualidad'] . ' por mes') && !str_contains($texto, 'seña')
    && str_contains($texto, 'Los dos incluyen un cambio por mes') && !str_contains($texto, 'con cambios'), $texto);
caso('una pregunta de pago no manda el formulario ni crea prospecto', !str_contains($texto, 'gokywebs.com/form') && empty($c['esProspecto']));
$r = turno('ok', $c, $cfg);
caso('un ok posterior a una duda no apaga el bot', empty($c['esProspecto']) && empty($c['bot_off']));
$yaTeniaForm = !empty($c['link_form_enviado']);
$r = turno('prefiero el abono mensual', $c, $cfg);
// Con el formulario ya mandado por el "ok", la elección no lo repite: marca
// el prospecto y el bot se calla.
caso('la elección explícita posterior deja el prospecto con su forma, con el enlace una sola vez',
    ($yaTeniaForm ? $r === [] : (count($r) === 1 && tiene_form($r)))
    && !empty($c['esProspecto']) && !empty($c['bot_off']) && ($c['modalidad_elegida'] ?? '') === 'mensual', json_encode($r));

/* El número solo, según el orden que vio: la cotizada con las imágenes de hoy
 * (desde el 27-sep a las 00:15) vio "1 plan anual, 2 plan mensual"; la
 * cotizada con la imagen del 25 y el 26-sep, "1 plan mensual, 2 plan anual";
 * la cotizada antes de la imagen del 25-sep, "1. Plan anual, 2. Plan
 * mensual". Sin rastro en el transcript, lo dice la fecha: fija, así la
 * prueba no depende de la hora en que corre. */
$c = conv_nueva('549110003TEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$c['precio_cotizado_ts'] = strtotime('2026-09-27 10:00:00 -03:00');
$r = turno('2', $c, $cfg);
caso('cotizada con las imágenes de hoy: "2" es el plan mensual y queda como prospecto con esa modalidad',
    tiene_form($r) && !empty($c['esProspecto']) && ($c['modalidad_elegida'] ?? '') === 'mensual', json_encode($r));
$c = conv_nueva('549110005TEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$c['precio_cotizado_ts'] = strtotime('2026-09-26 18:00:00 -03:00');
$r = turno('2', $c, $cfg);
caso('cotizada con la imagen del 26-sep: "2" es el plan anual',
    tiene_form($r) && !empty($c['esProspecto']) && ($c['modalidad_elegida'] ?? '') === 'unico', json_encode($r));
$c = conv_nueva('549110004TEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0, 'precio_cotizado' => '$120.000', 'sena_cotizada' => '$40.000',
    'mensualidad_cotizada' => '$20.000', 'precio_modelo' => 'anual', 'precio_cotizado_ts' => strtotime('2026-09-24 12:00:00 -03:00')]);
$r = turno('1', $c, $cfg);
caso('cotizada el 24-sep: "1" sigue siendo el plan anual',
    tiene_form($r) && !empty($c['esProspecto']) && ($c['modalidad_elegida'] ?? '') === 'unico', json_encode($r));

$s = wabot_rubro_sugerencias('Tengo una panadería y hacemos tortas', 'landing');
caso('el matcher devuelve cinco trabajos y modelos filtrados', $s && substr_count($s['texto'], '• ') === 5 && str_contains($s['texto'], 'modelos/?rubro=gastronomia'), $s['texto'] ?? '');

todo_ok();
