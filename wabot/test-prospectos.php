<?php
require_once __DIR__ . '/test-lib.php';
$cfg = wabot_config_load();

echo "— Prospectos, pagos y portfolio —\n";

$c = conv_nueva('549110001TEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$r = turno('dale', $c, $cfg);
caso('un sí corto inmediatamente después del precio manda solo el formulario', $r === ['gokywebs.com/form'], json_encode($r));
caso('queda marcado como prospecto y el bot se apaga', !empty($c['esProspecto']) && !empty($c['bot_off']) && !empty($c['handoff_pendiente']));

$c = conv_nueva('549110001BTEST', ['tipo' => 'landing', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'landing', $cfg);
$r = turno('dale, armala', $c, $cfg);
caso('un interés claro como "dale, armala" también deriva y manda solo el formulario',
    $r === ['gokywebs.com/form'] && !empty($c['esProspecto']) && !empty($c['bot_off']), json_encode($r));

$c = conv_nueva('549110002TEST', ['tipo' => 'ecommerce', 'fase' => 'prediseno', 'precio_dado' => true,
    'precio_cta_pendiente' => true, 'precio_turnos_desde' => 0]);
wabot_precio_congelar($c, 'ecommerce', $cfg);
$r = turno('¿Qué diferencia hay entre un precio y el otro?', $c, $cfg);
$texto = implode(' ', $r);
caso('explica la diferencia sin confundir seña y mensualidad', str_contains($texto, 'no dos cuotas del mismo precio') && str_contains($texto, 'sin seña ni saldo final'), $texto);
caso('una pregunta de pago no manda el formulario ni crea prospecto', !str_contains($texto, 'gokywebs.com/form') && empty($c['esProspecto']));
$r = turno('ok', $c, $cfg);
caso('un ok posterior a una duda no apaga el bot', empty($c['esProspecto']) && $r !== ['gokywebs.com/form']);
$r = turno('prefiero el abono mensual', $c, $cfg);
caso('la elección explícita posterior sí manda el enlace', $r === ['gokywebs.com/form'] && ($c['modalidad_elegida'] ?? '') === 'mensual', json_encode($r));

$s = wabot_rubro_sugerencias('Tengo una panadería y hacemos tortas', 'landing');
caso('el matcher devuelve cinco trabajos y modelos filtrados', $s && substr_count($s['texto'], '• ') === 5 && str_contains($s['texto'], 'modelos/?rubro=gastronomia'), $s['texto'] ?? '');

todo_ok();
