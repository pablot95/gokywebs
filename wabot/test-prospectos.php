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
caso('explica la diferencia entre los planes, con sus montos y sin seña (19-sep)', str_contains($texto, 'Los dos planes incluyen lo mismo')
    && str_contains($texto, 'Plan anual de $190.000 por año') && str_contains($texto, 'Plan mensual de $30.000 por mes') && !str_contains($texto, 'seña'), $texto);
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

$s = wabot_rubro_sugerencias('Tengo una panadería y hacemos tortas', 'landing');
caso('el matcher devuelve cinco trabajos y modelos filtrados', $s && substr_count($s['texto'], '• ') === 5 && str_contains($s['texto'], 'modelos/?rubro=gastronomia'), $s['texto'] ?? '');

todo_ok();
