<?php
/**
 * "Te hablo el martes" (Pablo, 11-oct): la fecha prometida frena los avisos
 * automáticos hasta dos días después, y el seguimiento del favorito sale ese
 * día a las 18 h. Solo CLI, sin red. Las fechas son fijas (octubre de 2026).
 */
require_once __DIR__ . '/test-lib.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };   // "2026-10-08 15:00:00", hora argentina

echo "=== Qué fecha promete cada mensaje (sábado 10-oct, 15 h) ===\n";
$sab = $ar('2026-10-10 15:00:00');
foreach ([
    'te hablo el martes'                                         => '2026-10-13',
    'Dale, el lunes te confirmo'                                 => '2026-10-12',
    'Mañana te aviso!'                                           => '2026-10-11',
    'pasado mañana te escribo'                                   => '2026-10-12',
    'mañana a la mañana te confirmo'                             => '2026-10-11',
    'la semana que viene lo vemos'                               => '2026-10-16',
    'el finde te aviso'                                          => '2026-10-11',
    'en 15 días te hablo'                                        => '2026-10-25',
    'dentro de una semana lo hablamos'                           => '2026-10-17',
    'cobro el 5 y te pago'                                       => '2026-11-05',
    'me gusta el 2, te confirmo mañana'                          => '2026-10-11',
    'el 20 de octubre arrancamos'                                => '2026-10-20',
    'te paso las fotos el 15/10'                                 => '2026-10-15',
    'a fin de mes te transfiero'                                 => '2026-10-31',
    'el mes que viene arrancamos'                                => '2026-11-10',
    'el lunes lo hablo con mi socio y el miércoles te confirmo' => '2026-10-14',
    'hoy a la noche te escribo'                                  => '2026-10-10',
    // Sin cita: una fecha suelta, un horario o nada.
    'trabajo de lunes a viernes'                                 => '',
    'te escribo porque abro de lunes a viernes de 9 a 18'        => '',
    'atiendo los sábados'                                        => '',
    'hola, vi tu anuncio'                                        => '',
    'el martes'                                                  => '',
    'en 3 meses lo vemos'                                        => '',
    'me gusta el modelo 2'                                       => '',
] as $texto => $esperado) {
    $dia = wabot_fecha_prometida($texto, $sab);
    caso("«{$texto}» → " . ($esperado ?: 'sin fecha'), $dia === $esperado, $dia ?: 'sin fecha');
}
caso('«te hablo el martes» un martes es el martes que viene',
    wabot_fecha_prometida('te hablo el martes', $ar('2026-10-13 10:00:00')) === '2026-10-20');
caso('«mañana te aviso» a la 1:30 es el día que ya empezó (corte de las 3 AM)',
    wabot_fecha_prometida('mañana te aviso', $ar('2026-10-11 01:30:00')) === '2026-10-11');

/* Romi (25-oct): "entre lunes y miércoles te vuelvo a escribir" es un margen,
 * vale el último día; antes lo borraba el filtro de horarios. */
$dom25 = $ar('2026-10-25 21:57:00');
foreach ([
    'Entre lunes y miércoles te vuelvo a escribir'           => '2026-10-28',
    'entre el lunes y el miércoles te escribo'               => '2026-10-28',
    'entre jueves y lunes te confirmo'                       => '2026-11-02',
    'trabajo de lunes a miércoles'                           => '',
    'abro lunes y miércoles, te escribo mañana'              => '2026-10-26',
] as $texto => $esperado) {
    $dia = wabot_fecha_prometida($texto, $dom25);
    caso("domingo 25-oct: «{$texto}» → " . ($esperado ?: 'sin fecha'), $dia === $esperado, $dia ?: 'sin fecha');
}
caso('un martes, «entre el lunes y el miércoles te escribo» es la semana que viene',
    wabot_fecha_prometida('entre el lunes y el miércoles te escribo', $ar('2026-10-27 10:00:00')) === '2026-11-04');

echo "\n=== La fecha en la charla ===\n";
$c = conv_nueva('TESTRETOMAR');
wabot_retomar_fijar($c, '2026-10-13', 'cliente', 'te hablo el martes', $ar('2026-10-08 15:00:00'));
caso('los avisos vuelven dos días después: el jueves 15 a las 00:00',
    $c['retomar_ts'] === $ar('2026-10-15 00:00:00') && wabot_retomar_vuelve_dia($c) === '2026-10-15');
caso('en el panel: «mar 13/10» y «jue 15/10»',
    wabot_retomar_dia_corto('2026-10-13') === 'mar 13/10' && wabot_retomar_dia_corto(wabot_retomar_vuelve_dia($c)) === 'jue 15/10');
/* Giancarlo (26-oct): "más tarde lo voy a hacer" es una promesa para hoy; frenaba
 * los avisos hasta el 28 y no le salió el recordatorio del formulario. */
$g = conv_nueva('TESTRETOMARHOY');
$lun26 = $ar('2026-10-26 15:31:00');
caso('«más tarde lo voy a hacer… y vemos» promete hoy', wabot_fecha_prometida('Dale, perfecto. Bueno, más tarde lo voy a hacer, voy a llenar eso y vemos si no hay ningún asterisco', $lun26) === '2026-10-26');
wabot_retomar_fijar($g, '2026-10-26', 'cliente', 'más tarde lo voy a hacer', $lun26);
caso('una promesa para hoy frena solo hasta mañana a las 00:00, no dos días',
    $g['retomar_ts'] === $ar('2026-10-27 00:00:00') && wabot_retomar_vuelve_dia($g) === '2026-10-27', (string)wabot_retomar_vuelve_dia($g));
caso('a la 1:30, "hoy" sigue siendo el día que ya empezó (corte de las 3 AM)', (function () use ($ar) {
    $c = conv_nueva('TESTRETOMAR');
    wabot_retomar_fijar($c, '2026-10-26', 'cliente', 'hoy a la noche te escribo', $ar('2026-10-27 01:30:00'));
    return $c['retomar_ts'] === $ar('2026-10-27 00:00:00');
})());
caso('activa el miércoles a la noche, no el jueves',
    wabot_retomar_activo($c, $ar('2026-10-14 23:59:00')) && !wabot_retomar_activo($c, $ar('2026-10-15 00:00:01')));
wabot_retomar_fijar($c, '', '');
caso('«Quitar» la libera', !wabot_retomar_activo($c, $ar('2026-10-09 10:00:00')) && $c['retomar_dia'] === '' && $c['retomar_marcado_ts'] === 0);

$v = conv_nueva('TESTRETOMAR2');
$manana = gmdate('Y-m-d', time() - 6 * 3600 + 86400);
wabot_conv_transcript($v, 'cliente', 'Dale, mañana te confirmo');
caso('un mensaje del cliente con fecha la anota solo', $v['retomar_dia'] === $manana && $v['retomar_origen'] === 'cliente'
    && $v['retomar_texto'] === 'Dale, mañana te confirmo', $v['retomar_dia'] ?? '');
wabot_conv_transcript($v, 'bot', 'Te escribo el martes');
caso('lo que escribe el bot no la cambia', $v['retomar_dia'] === $manana);
wabot_conv_transcript($v, 'cliente', 'ok');
caso('un «ok» después no la borra', $v['retomar_dia'] === $manana);
$p = conv_nueva('TESTRETOMAR3');
wabot_conv_transcript($p, 'humano', 'Dale, te escribo pasado mañana');
caso('lo que escribe Pablo desde el panel también cuenta', $p['retomar_origen'] === 'humano' && $p['retomar_dia'] !== '');

echo "\n=== El seguimiento del favorito ===\n";
$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['plantillas'] = wabot_textos_default()['plantillas'];
$jue = $ar('2026-10-08 15:00:00');
$fav = function ($extra = []) use ($jue) {
    return conv_nueva('TESTRETOMARFAV', array_merge([
        'favorito' => true, 'favorito_ts' => $jue - 86400, 'ultimo_cliente_ts' => $jue,
        'transcript' => [['q' => 'cliente', 't' => 'Dale, te hablo el martes', 'ts' => $jue]],
    ], $extra));
};
$sin = $fav();
caso('sin fecha prometida sale el lunes a las 18 (4 días): el problema que contó Pablo',
    wabot_seguimiento_interesado_corresponde($sin, $cfg, $ar('2026-10-12 18:00:00')));
$con = $fav();
wabot_retomar_detectar($con, 'Dale, te hablo el martes', $jue, 'cliente');
foreach (['2026-10-12 18:00:00' => false, '2026-10-13 18:00:00' => false, '2026-10-14 18:00:00' => false, '2026-10-15 18:00:00' => true] as $cuando => $sale) {
    caso(($sale ? 'sale ' : 'no sale ') . $cuando . ' («te hablo el martes» un jueves)',
        wabot_seguimiento_interesado_corresponde($con, $cfg, $ar($cuando)) === $sale);
}
$lun = $ar('2026-10-12 10:00:00');
$cerca = $fav(['ultimo_cliente_ts' => $lun, 'transcript' => [['q' => 'cliente', 't' => 'te hablo mañana', 'ts' => $lun]]]);
wabot_retomar_detectar($cerca, 'te hablo mañana', $lun, 'cliente');
caso('si la fecha es cerca, sale a los 2 días de la fecha aunque no pasaron 4 desde el mensaje',
    wabot_seguimiento_interesado_corresponde($cerca, $cfg, $ar('2026-10-15 18:00:00')));
$atento = $con;
$atento['transcript'][] = ['q' => 'humano', 't' => 'Dale, quedo atento', 'ts' => $jue + 600];
caso('un «quedo atento» de Pablo en el momento no cambia nada',
    wabot_seguimiento_interesado_corresponde($atento, $cfg, $ar('2026-10-15 18:00:00')));
$volvio = $con;
$volvio['transcript'][] = ['q' => 'cliente', 't' => 'una pregunta, ¿el dominio está incluido?', 'ts' => $ar('2026-10-13 11:00:00')];
$volvio['ultimo_cliente_ts'] = $ar('2026-10-13 11:00:00');
caso('si el cliente volvió a escribir, vuelven los 4 días: no el jueves…',
    !wabot_seguimiento_interesado_corresponde($volvio, $cfg, $ar('2026-10-15 18:00:00')));
caso('…sí el sábado 17', wabot_seguimiento_interesado_corresponde($volvio, $cfg, $ar('2026-10-17 18:00:00')));
$pabloDespues = $con;
$pabloDespues['transcript'][] = ['q' => 'humano', 't' => '¿Pudiste verlo?', 'ts' => $ar('2026-10-14 10:00:00')];
caso('si Pablo le escribió de nuevo más tarde, también los 4 días desde ese mensaje',
    !wabot_seguimiento_interesado_corresponde($pabloDespues, $cfg, $ar('2026-10-15 18:00:00'))
    && wabot_seguimiento_interesado_corresponde($pabloDespues, $cfg, $ar('2026-10-18 18:00:00')));
$aMano = $fav(['ultimo_cliente_ts' => $jue - 10 * 86400, 'transcript' => [['q' => 'cliente', 't' => 'gracias', 'ts' => $jue - 10 * 86400]]]);
wabot_retomar_fijar($aMano, '2026-10-13', 'panel', '', $jue);
caso('con la fecha puesta a mano en el panel, tampoco sale antes y sí el jueves',
    !wabot_seguimiento_interesado_corresponde($aMano, $cfg, $ar('2026-10-12 18:00:00'))
    && wabot_seguimiento_interesado_corresponde($aMano, $cfg, $ar('2026-10-15 18:00:00')));

echo "\n=== Los demás avisos automáticos esperan ===\n";
caso('las plantillas de las 18 h (también la de la demo) esperan',
    !wabot_plantillas_auto_contacto_ok($con, $ar('2026-10-14 18:00:00')) && wabot_plantillas_auto_contacto_ok($con, $ar('2026-10-15 18:00:00')));
$cfgForm = array_merge($cfg, ['form_recordatorio_activo' => true, 'form_recordatorio_horas' => 12, 'seguimiento_hora_desde' => 8, 'seguimiento_hora_hasta' => 20]);
$ahoraForm = $ar('2026-10-09 15:00:00');
$conLink = conv_nueva('TESTRETOMARFORM', [
    'form_link_mandado_ts' => $ahoraForm - 13 * 3600, 'ultimo_cliente_ts' => $ahoraForm - 13.5 * 3600,
    'transcript' => [['q' => 'cliente', 't' => 'dale, mandame el form', 'ts' => $ahoraForm - 13.5 * 3600],
                     ['q' => 'bot', 't' => 'Acá está: gokywebs.com/form', 'ts' => $ahoraForm - 13 * 3600]],
]);
caso('(sin fecha, el recordatorio del formulario sí sale)', wabot_form_recordatorio_corresponde($conLink, $cfgForm, $ahoraForm));
wabot_retomar_fijar($conLink, '2026-10-10', 'cliente', 'lo completo mañana', $ahoraForm - 13.5 * 3600);
caso('el recordatorio del formulario espera', !wabot_form_recordatorio_corresponde($conLink, $cfgForm, $ahoraForm));

todo_ok();
