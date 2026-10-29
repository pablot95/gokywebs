<?php
/**
 * wabot/test-form-hora-demo.php — la hora en que el cliente pide la demo en el
 * formulario (29-oct-2026) y su envío automático a esa hora, sin red:
 *
 *   php wabot/test-form-hora-demo.php
 *
 * 15 a 03 h → elige de 11 a 14 h; 03 a 11 h → de 14 a 01 h; 11 a 15 h → de 17
 * a 01 h. La demo sale sola a esa hora si está publicada (presentar.php).
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/presentar.php';

$ar = function ($dia, $hora, $min = 0) { [$a, $m, $d] = array_map('intval', explode('-', $dia)); return gmmktime($hora + 3, $min, 0, $m, $d, $a); };
$iso = function ($ts) { return gmdate('Y-m-d\TH:i:s\Z', $ts); };
$cfg = wabot_config_load();

echo "Ventana de horas\n";
$v = wabot_demo_horas_ventana($ar('2026-10-29', 16));
caso('a las 16 h: de 11 a 14 del día siguiente', array_keys($v) === [11, 12, 13, 14] && $v[11] === $ar('2026-10-30', 11) && $v[14] === $ar('2026-10-30', 14));
$v = wabot_demo_horas_ventana($ar('2026-10-29', 22));
caso('a las 22 h no puede elegir las 23 (Pablo)', !isset($v[23]) && array_keys($v) === [11, 12, 13, 14]);
$v = wabot_demo_horas_ventana($ar('2026-10-30', 1, 30));
caso('a la 1:30 de la madrugada: de 11 a 14 de ese mismo día', array_keys($v) === [11, 12, 13, 14] && $v[11] === $ar('2026-10-30', 11));
$v = wabot_demo_horas_ventana($ar('2026-10-30', 2, 59));
caso('a las 2:59 sigue igual', $v[14] === $ar('2026-10-30', 14));
$v = wabot_demo_horas_ventana($ar('2026-10-30', 3));
caso('a las 3 h: de 14 a 01 h', array_keys($v) === [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1]
    && $v[14] === $ar('2026-10-30', 14) && $v[0] === $ar('2026-10-31', 0) && $v[1] === $ar('2026-10-31', 1));
$v = wabot_demo_horas_ventana($ar('2026-10-30', 10, 59));
caso('a las 10:59 todavía de 14 a 01', array_key_first($v) === 14);
$v = wabot_demo_horas_ventana($ar('2026-10-30', 11));
caso('a las 11 h no puede elegir las 13 (Pablo): de 17 a 01', !isset($v[13]) && array_keys($v) === [17, 18, 19, 20, 21, 22, 23, 0, 1]);
$v = wabot_demo_horas_ventana($ar('2026-10-30', 14, 59));
caso('a las 14:59 todavía de 17 a 01', array_key_first($v) === 17 && $v[1] === $ar('2026-10-31', 1));
$v = wabot_demo_horas_ventana($ar('2026-10-30', 15));
caso('a las 15 h ya de 11 a 14 del día siguiente', array_keys($v) === [11, 12, 13, 14] && $v[11] === $ar('2026-10-31', 11));
$v = wabot_demo_horas_ventana($ar('2026-10-31', 20));
caso('fin de mes: el 31 a la noche pasa al 1', $v[11] === $ar('2026-11-01', 11));

echo "La hora en palabras\n";
caso('el mismo día: "hoy a las 18:00"', wabot_demo_hora_frase($ar('2026-10-30', 18), $ar('2026-10-30', 9)) === 'hoy a las 18:00');
caso('al día siguiente: "mañana a las 11:00"', wabot_demo_hora_frase($ar('2026-10-31', 11), $ar('2026-10-30', 20)) === 'mañana a las 11:00');
caso('de madrugada, para él sigue siendo "mañana"', wabot_demo_hora_frase($ar('2026-10-30', 12), $ar('2026-10-30', 1)) === 'mañana a las 12:00');
caso('la 1 de la mañana: "esta noche a la 01:00"', wabot_demo_hora_frase($ar('2026-10-31', 1), $ar('2026-10-30', 9)) === 'esta noche a la 01:00');
caso('la medianoche: "esta noche a las 00:00"', wabot_demo_hora_frase($ar('2026-10-31', 0), $ar('2026-10-30', 12)) === 'esta noche a las 00:00');

echo "El formulario\n";
$srcFormLead = (string)file_get_contents(__DIR__ . '/form-lead.php');
eval('?>' . substr($srcFormLead, 0, (int)strpos($srcFormLead, "header('Access-Control-Allow-Origin")));
$m = null;
$e = formlead_extras(['modalidad' => 'mensual', 'hora_demo' => '13'], $m, $ar('2026-10-30', 9));
caso('a las 9 h no se aceptan las 13 (la ventana arranca a las 14)', $e === null && ($m['motivo'] ?? '') === 'hora_demo' && ($m['campo'] ?? '') === 'hora_demo');
$e = formlead_extras(['modalidad' => 'mensual', 'hora_demo' => '18'], $m, $ar('2026-10-30', 9));
caso('las 18 a las 9 h queda con la hora de ese día', ($e['demo_hora_ts'] ?? 0) === $ar('2026-10-30', 18), json_encode($e));
$e = formlead_extras(['modalidad' => 'mensual', 'hora_demo' => 1], $m, $ar('2026-10-30', 12));
caso('la 1 elegida a las 12 h es la de esa noche', ($e['demo_hora_ts'] ?? 0) === $ar('2026-10-31', 1));
foreach (['abc', '13.5', '25', '-1', null] as $malo) {
    $m = null;
    caso('se rechaza ' . json_encode($malo), formlead_extras(['hora_demo' => $malo], $m, $ar('2026-10-30', 9)) === null && ($m['motivo'] ?? '') === 'hora_demo');
}
$e = formlead_extras(['modalidad' => 'mensual', 'hora_demo' => ''], $m, $ar('2026-10-30', 9));
caso('vacío = «Cualquier horario»: se acepta, sin hora programada (es opcional)', $e === ['modalidad_elegida' => 'mensual'], json_encode($e));
caso('el formulario viejo (sin el campo) sigue andando', formlead_extras(['modalidad' => 'mensual']) === ['modalidad_elegida' => 'mensual']);

@unlink(WABOT_DATA . '/conv/5493810009077.json');
$ahora = time();
$ventana = wabot_demo_horas_ventana($ahora);
$horaElegida = array_key_last($ventana);
$payload = ['t' => '5493810009077', 'nombre_negocio' => 'Vivero Hora', 'resumen' => 'Plantas y macetas',
    'colores' => '', 'modalidad' => 'mensual', 'hora_demo' => (string)$horaElegida];
$base = wabot_form_lead_validar($payload);
$extras = formlead_extras($payload);
caso('el paso 2 con la hora se guarda', $base !== null && $extras !== null && formlead_extras_guardar($base, $extras) === true);
$r = wabot_form_lead_procesar($payload, $cfg);
$conv = wabot_conv_load('5493810009077');
caso('la charla queda con la hora elegida', ($r['ok'] ?? false) === true && (int)($conv['demo_hora_ts'] ?? 0) === $ventana[$horaElegida]);
$lineas = implode("\n", array_map(function ($l) { return (string)($l['t'] ?? ''); }, (array)($conv['transcript'] ?? [])));
caso('y en el chat del panel se ve la hora', strpos($lineas, 'Demo: ') !== false && strpos($lineas, sprintf('%02d:00', $horaElegida)) !== false, $lineas);
$campos = wabot_lead_campos($conv, $cfg);
caso('el boceto nace con demoProgramadaAt', ($campos['demoProgramadaAt']['timestampValue'] ?? '') === $iso($ventana[$horaElegida]));
$cfgConf = ['form_confirmacion' => '{saludo}, ya recibimos tu formulario. Con esos datos preparamos la demo. Estará lista para {entrega}.'];
$conf = wabot_form_confirmacion_texto($conv, $cfgConf, $ahora);
caso('la confirmación le dice la hora que eligió', strpos($conf, 'Estará lista para ' . wabot_demo_hora_frase($ventana[$horaElegida], $ahora) . '.') !== false, $conf);
caso('y el «ya lo tengo» también', strpos(wabot_personalizar('la demo te llega {entrega}.', $conv), sprintf('%02d:00', $horaElegida)) !== false);
$conv['lead_doc'] = 'projects/x/databases/(default)/documents/propuestas/TEST';
wabot_conv_save($conv);
caso('el sincronizar no sale a la red en los tests', formlead_demo_hora_sincronizar('5493810009077') === true);
$conv['demo_hora_ts'] = $ahora - 60;
caso('una hora que ya pasó no viaja', !isset(wabot_lead_campos($conv, $cfg)['demoProgramadaAt']));
@unlink(WABOT_DATA . '/conv/5493810009077.json');

echo "El envío a esa hora\n";
$espera = WABOT_DATA . '/presentar-auto-espera.json';
$esperaPrevia = @file_get_contents($espera);
@unlink($espera);
$props = [
    // Llenó a las 16 h y pidió las 12 del día siguiente.
    'P' => ['createdAt' => $iso($ar('2026-10-29', 16)), 'demoProgramadaAt' => $iso($ar('2026-10-30', 12)), 'nombre_negocio' => 'Pan Paula', 'telefono' => '1150000011'],
    // Llenó a las 9 y pidió la 1 de la mañana.
    'N' => ['createdAt' => $iso($ar('2026-10-30', 9)), 'demoProgramadaAt' => $iso($ar('2026-10-31', 1)), 'nombre_negocio' => 'Noche Nico', 'telefono' => '1150000012'],
    // Pidió las 13 y la demo no está.
    'S' => ['createdAt' => $iso($ar('2026-10-29', 17)), 'demoProgramadaAt' => $iso($ar('2026-10-30', 13)), 'nombre_negocio' => 'Sin Demo', 'telefono' => '1150000013'],
    // Sin hora (formulario viejo): la de las 18/14 h, que sigue apagada.
    'V' => ['createdAt' => $iso($ar('2026-10-29', 16)), 'nombre_negocio' => 'Viejo Vic', 'telefono' => '1150000014'],
];
$enviadas = []; $marcas = []; $avisos = [];
$presentar = function ($d) use (&$enviadas) {
    $enviadas[] = $d['negocio'];
    return ['ok' => true, 'enviado' => true, 'demo_ok' => true, 'slug' => wabot_slug_demo($d['negocio']), 'textos' => ['link'], 'textos_enviados' => [true]];
};
$marcar = function ($id, $mm) use (&$marcas, &$props) { $marcas[$id] = $mm; $props[$id]['autoPresentada'] = $mm; return true; };
$publicadas = ['panpaula' => true, 'nochenico' => true];
$hayDemo = function ($slug) use (&$publicadas) { return !empty($publicadas[$slug]); };
$avisar = function ($t, $c) use (&$avisos) { $avisos[] = $t . ': ' . $c; return 1; };
$cfgAuto = [];   // presentar_auto apagada (como en producción), la de la hora elegida prendida por defecto

wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 11, 30), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 11:30 no sale nada todavía', !$marcas);
caso('a más de una hora de las 13, todavía no avisa que falta Sin Demo',
    !array_filter($avisos, fn($a) => strpos($a, 'Sin Demo') !== false));
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 12, 0), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 12 sale la que pidió las 12', isset($marcas['P']) && $marcas['P']['demo_ok'] && $marcas['P']['hora_elegida'] === true && $enviadas === ['Pan Paula']);
caso('y una hora antes de las 13 avisa que la de Sin Demo no está', count(array_filter($avisos, fn($a) => strpos($a, 'Sin Demo') !== false && strpos($a, '13:00') !== false)) === 1, implode(' | ', $avisos));
caso('la vieja sin hora no sale (la de las 18/14 h sigue apagada)', !isset($marcas['V']));
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 12, 30), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('el aviso de antes no se repite', count(array_filter($avisos, fn($a) => strpos($a, 'Sin Demo') !== false)) === 1);
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 13, 0), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 13 sin demo espera y avisa que se pasó la hora', !isset($marcas['S'])
    && count(array_filter($avisos, fn($a) => strpos($a, 'Sin Demo') !== false && strpos($a, 'prometimos') !== false)) === 1);
$publicadas['sindemo'] = true;
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 13, 30), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('apenas se publica, sale', ($marcas['S']['demo_ok'] ?? false) === true);
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-30', 23, 30), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 23:30 la de la 1 todavía no', !isset($marcas['N']));
wabot_presentar_auto_correr($cfgAuto, $ar('2026-10-31', 1, 0), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a la 1 de la mañana sale aunque sea de noche', ($marcas['N']['demo_ok'] ?? false) === true);
caso('la vieja sigue sin salir', !isset($marcas['V']));

// Una demo pedida a las 0 que se publica a las 4 h: espera a la mañana.
$props['T'] = ['createdAt' => $iso($ar('2026-10-31', 9)), 'demoProgramadaAt' => $iso($ar('2026-11-01', 0)), 'nombre_negocio' => 'Tarde Tomi', 'telefono' => '1150000015'];
$publicadas['tardetomi'] = true;
wabot_presentar_auto_correr($cfgAuto, $ar('2026-11-01', 4), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('pasadas 2 h de su hora, de madrugada no sale', !isset($marcas['T']));
wabot_presentar_auto_correr($cfgAuto, $ar('2026-11-01', 9), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('sale a las 9', ($marcas['T']['demo_ok'] ?? false) === true);

$props['X'] = ['createdAt' => $iso($ar('2026-11-01', 9)), 'demoProgramadaAt' => $iso($ar('2026-11-01', 14)), 'nombre_negocio' => 'Pan Paula', 'telefono' => '1150000016'];
$r = wabot_presentar_auto_correr(['presentar_hora_elegida' => false], $ar('2026-11-01', 15), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('con presentar_hora_elegida: false no sale ninguna', !empty($r['apagado']) && !isset($marcas['X']));

if ($esperaPrevia !== false) file_put_contents($espera, $esperaPrevia); else @unlink($espera);
todo_ok();
