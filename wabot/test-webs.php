<?php
/**
 * El mantenimiento contado por WhatsApp (Pablo, 29-oct): monitoreo de las webs,
 * aviso de caída resuelta y resumen mensual (webs.php). Solo CLI, sin red ni
 * disco: la lista, las respuestas de cada web y los envíos se simulan.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/webs.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
$cfg = wabot_config_load();
foreach (['reporte_mensual_web', 'web_caida_resuelta'] as $k) {
    $cfg['plantillas'][$k] = array_merge((array)$cfg['plantillas'][$k], ['activa' => true, 'automatico' => true]);
}

echo "=== La lista que manda el admin ===\n";
$lista = array_values(array_filter(array_map('wabot_webs_fila', [
    ['id' => 'clientes:AAA', 'tel' => '11 4444-5555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'dominio' => 'https://www.PanaderiaSol.com.ar/inicio', 'plan' => 'mensual', 'desde' => '2026-09-25'],
    ['id' => 'mantenimiento:BBB', 'tel' => '1155556666', 'persona' => 'Ana', 'negocio' => '', 'dominio' => 'gomeria.com.ar', 'plan' => 'anual'],
    ['id' => 'clientes:CCC', 'tel' => '', 'persona' => 'Leo', 'negocio' => 'Sin dominio', 'dominio' => '', 'plan' => 'raro'],
    ['id' => 'malo', 'tel' => '1', 'dominio' => 'x.com'],
    ['id' => 'clientes:DDD', 'tel' => '1177778888', 'persona' => 'Mia', 'negocio' => 'Local', 'dominio' => 'localhost'],
])));
caso('la fila sin id válido no entra', count($lista) === 4);
caso('el dominio queda limpio', $lista[0]['dominio'] === 'panaderiasol.com.ar', $lista[0]['dominio']);
caso('un plan desconocido cuenta como mensual', $lista[2]['plan'] === 'mensual' && $lista[1]['plan'] === 'anual');
caso('localhost no es un dominio', $lista[3]['dominio'] === '');
caso('el teléfono queda solo con dígitos', $lista[0]['tel'] === '1144445555');

echo "\n=== Cómo se interpreta una respuesta ===\n";
caso('200 es ok', wabot_webs_resultado(0, '', 200, '<html>hola</html>', 1800000000)['ok'] === true);
caso('301 seguida hasta un 200 es ok', wabot_webs_resultado(0, '', 200, 'x')['ok'] === true);
$r = wabot_webs_resultado(0, '', 503, '');
caso('503 no es ok y dice el motivo', !$r['ok'] && $r['motivo'] === 'error 503 del servidor', $r['motivo']);
caso('404 tampoco', wabot_webs_resultado(0, '', 404, '')['motivo'] === 'error 404');
caso('la página de cuenta suspendida de Hostinger no es ok aunque sea 200', wabot_webs_resultado(0, '', 200, '<h1>This website has been suspended</h1>')['motivo'] === 'cuenta suspendida en el hosting');
caso('DNS', wabot_webs_resultado(6, 'Could not resolve host', 0, '')['motivo'] === 'el dominio no resuelve (DNS)');
caso('tiempo de espera', wabot_webs_resultado(28, 'Timeout', 0, '')['motivo'] === 'no responde (tiempo de espera agotado)');
caso('certificado', wabot_webs_resultado(60, 'SSL', 0, '')['motivo'] === 'certificado de seguridad inválido');
caso('la fecha del certificado viaja', wabot_webs_resultado(0, '', 200, 'x', 1800000000)['ssl_hasta'] === 1800000000);

echo "\n=== Textos de tiempo ===\n";
$ahora = $ar('2026-11-03 15:30:00');
caso('hoy a las 15:00', wabot_webs_cuando_texto($ar('2026-11-03 15:00:00'), $ahora) === 'hoy a las 15:00', wabot_webs_cuando_texto($ar('2026-11-03 15:00:00'), $ahora));
caso('ayer a las 23:30', wabot_webs_cuando_texto($ar('2026-11-02 23:30:00'), $ahora) === 'ayer a las 23:30');
caso('el 30/10 a las 9:05', wabot_webs_cuando_texto($ar('2026-10-30 09:05:00'), $ahora) === 'el 30/10 a las 9:05', wabot_webs_cuando_texto($ar('2026-10-30 09:05:00'), $ahora));
caso('30 minutos', wabot_webs_duracion_texto(1800) === '30 minutos');
caso('2 horas y 30 minutos', wabot_webs_duracion_texto(9000) === '2 horas y 30 minutos');
caso('1 día y 3 horas', wabot_webs_duracion_texto(97200) === '1 día y 3 horas', wabot_webs_duracion_texto(97200));
caso('1 hora justa', wabot_webs_duracion_texto(3600) === '1 hora');
caso('mes anterior', wabot_webs_mes_anterior('2026-01') === '2025-12' && wabot_webs_mes_anterior('2026-11') === '2026-10');
caso('nombre del mes', wabot_webs_mes_nombre('2026-10') === 'octubre');

echo "\n=== Monitoreo: caída, vuelta y aviso ===\n";
$respuestas = [];   // dominio => lista de resultados, se consumen de a uno por pedido
$pedidos = [];
$pedir = function ($dominios) use (&$respuestas, &$pedidos) {
    $out = [];
    foreach ($dominios as $d) {
        $pedidos[] = $d;
        $out[$d] = !empty($respuestas[$d]) ? array_shift($respuestas[$d]) : wabot_webs_resultado(0, '', 200, 'ok', 1800000000);
    }
    return $out;
};
$ok   = wabot_webs_resultado(0, '', 200, 'ok', 1800000000);
$mal  = wabot_webs_resultado(28, 'Timeout', 0, '');
$avisos = [];
$avisar = function ($t, $c) use (&$avisos) { $avisos[] = [$t, $c]; };
$mandados = [];
$enviar = function ($clave, $f, $valores, $plantilla) use (&$mandados) { $mandados[] = [$clave, $f['id'], $plantilla, $valores]; return true; };

$t0 = $ar('2026-10-29 14:00:00');
$c1 = wabot_webs_chequear($lista, $t0, [], $pedir, $avisar);
caso('se piden solo los dominios cargados, una vez cada uno', $pedidos === ['panaderiasol.com.ar', 'gomeria.com.ar'], json_encode($pedidos));
caso('las dos quedan online', $c1['monitor']['panaderiasol.com.ar']['ok'] === true && $c1['monitor']['gomeria.com.ar']['ok'] === true);
caso('el mes suma el chequeo y el día', $c1['monitor']['panaderiasol.com.ar']['meses']['2026-10'] === ['chequeos' => 1, 'fallidos' => 0, 'dias' => ['29' => 1]], json_encode($c1['monitor']['panaderiasol.com.ar']['meses']));
caso('guarda hasta cuándo vale el certificado', $c1['monitor']['panaderiasol.com.ar']['ssl_hasta_ts'] === 1800000000);
caso('sin novedades, ningún push', !$avisos);

// Un corte de un segundo: falla la primera vez y responde en el reintento.
$pedidos = []; $respuestas = ['panaderiasol.com.ar' => [$mal, $ok]];
$c2 = wabot_webs_chequear($lista, $t0 + 1800, $c1['monitor'], $pedir, $avisar);
caso('lo que falla se vuelve a pedir en la misma pasada', $pedidos === ['panaderiasol.com.ar', 'gomeria.com.ar', 'panaderiasol.com.ar'], json_encode($pedidos));
caso('si responde en el reintento no es una caída', $c2['monitor']['panaderiasol.com.ar']['ok'] === true && !$c2['caidas'] && !$avisos);
caso('y no cuenta como fallido', $c2['monitor']['panaderiasol.com.ar']['meses']['2026-10']['fallidos'] === 0);

// Caída de verdad: falla las dos veces.
$respuestas = ['panaderiasol.com.ar' => [$mal, $mal]];
$t1 = $t0 + 3600;
$c3 = wabot_webs_chequear($lista, $t1, $c2['monitor'], $pedir, $avisar);
caso('dos fallas seguidas = caída', $c3['caidas'] === ['panaderiasol.com.ar'] && $c3['monitor']['panaderiasol.com.ar']['ok'] === false);
caso('Pablo recibe el push con el negocio y el motivo', count($avisos) === 1 && $avisos[0][0] === 'Se cayó la web de Panadería Sol' && strpos($avisos[0][1], 'no responde (tiempo de espera agotado)') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));
caso('desde cuándo', $c3['monitor']['panaderiasol.com.ar']['desde_ts'] === $t1);
caso('el mes suma el fallido', $c3['monitor']['panaderiasol.com.ar']['meses']['2026-10']['fallidos'] === 1);

$avisos = []; $respuestas = ['panaderiasol.com.ar' => [$mal, $mal]];
$c4 = wabot_webs_chequear($lista, $t1 + 1800, $c3['monitor'], $pedir, $avisar);
caso('sigue caída: sin push nuevo', $c4['siguen_caidas'] === ['panaderiasol.com.ar'] && !$avisos);

// Vuelve a la hora.
$avisos = []; $respuestas = [];
$t2 = $t1 + 3600;
$c5 = wabot_webs_chequear($lista, $t2, $c4['monitor'], $pedir, $avisar);
$m5 = $c5['monitor']['panaderiasol.com.ar'];
caso('volvió', $c5['volvieron'] === ['panaderiasol.com.ar'] && $m5['ok'] === true);
caso('la caída queda anotada con desde y hasta', $m5['caidas'] === [['desde' => $t1, 'hasta' => $t2, 'motivo' => 'no responde (tiempo de espera agotado)']], json_encode($m5['caidas']));
caso('Pablo recibe el push con cuánto duró', $avisos[0][0] === 'Volvió la web de Panadería Sol' && strpos($avisos[0][1], 'Estuvo caída 1 hora') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));
caso('queda el aviso al cliente pendiente', $m5['aviso_pendiente'] === ['desde' => $t1, 'hasta' => $t2]);

$av1 = wabot_webs_avisos_correr($lista, $t2, $c5['monitor'], $cfg, $enviar, $avisar);
caso('en horario, el aviso sale al cliente de ese dominio', $av1['enviados'] === 1 && count($mandados) === 1 && $mandados[0][1] === 'clientes:AAA' && $mandados[0][2] === 'web_caida_resuelta', json_encode($av1));
caso('con nombre, negocio, desde y hasta', $mandados[0][3] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'desde' => 'hoy a las 15:00', 'hasta' => 'hoy a las 16:00'], json_encode($mandados[0][3], JSON_UNESCAPED_UNICODE));
caso('a un número sin chat le arma el 549', $mandados[0][0] === '5491144445555');
caso('y el pendiente se limpia', $av1['monitor']['panaderiasol.com.ar']['aviso_pendiente'] === null && $av1['monitor']['panaderiasol.com.ar']['aviso_ts'] === $t2);

// Otra caída el mismo día: Pablo sí, el cliente no (una por día).
$mandados = []; $avisos = [];
$mon = $av1['monitor'];
$mon['panaderiasol.com.ar']['aviso_pendiente'] = ['desde' => $t2 + 3600, 'hasta' => $t2 + 7200];
$av2 = wabot_webs_avisos_correr($lista, $t2 + 7200, $mon, $cfg, $enviar, $avisar);
caso('una segunda caída el mismo día no se le repite al cliente', $av2['enviados'] === 0 && !$mandados && $av2['monitor']['panaderiasol.com.ar']['aviso_pendiente'] === null);

// Caída corta (una sola pasada de 30 min... que vuelve en 10): no se le cuenta.
$respuestas = ['gomeria.com.ar' => [$mal, $mal]];
$c6 = wabot_webs_chequear($lista, $t2 + 1800, $av2['monitor'], $pedir, $avisar);
$respuestas = [];
$c7 = wabot_webs_chequear($lista, $t2 + 1800 + 600, $c6['monitor'], $pedir, $avisar);
caso('una caída de 10 minutos vuelve sin aviso pendiente', $c7['monitor']['gomeria.com.ar']['ok'] === true && empty($c7['monitor']['gomeria.com.ar']['aviso_pendiente']));

// De noche: el aviso espera a la mañana.
$respuestas = ['gomeria.com.ar' => [$mal, $mal]];
$n0 = $ar('2026-10-30 03:00:00');
$c8 = wabot_webs_chequear($lista, $n0, $c7['monitor'], $pedir, $avisar);
$respuestas = [];
$c9 = wabot_webs_chequear($lista, $n0 + 1800, $c8['monitor'], $pedir, $avisar);
$mandados = [];
$av3 = wabot_webs_avisos_correr($lista, $n0 + 1800, $c9['monitor'], $cfg, $enviar, $avisar);
caso('a las 3:30 no se le escribe al cliente, queda pendiente', !$mandados && $av3['monitor']['gomeria.com.ar']['aviso_pendiente'] === ['desde' => $n0, 'hasta' => $n0 + 1800]);
$av4 = wabot_webs_avisos_correr($lista, $ar('2026-10-30 10:05:00'), $av3['monitor'], $cfg, $enviar, $avisar);
caso('a las 10 sale, y dice "hoy a las 3:00"', count($mandados) === 1 && $mandados[0][1] === 'mantenimiento:BBB' && $mandados[0][3]['desde'] === 'hoy a las 3:00' && $mandados[0][3]['hasta'] === 'hoy a las 3:30', json_encode($mandados, JSON_UNESCAPED_UNICODE));
caso('sin negocio dice "tu negocio" y el nombre es la persona', $mandados[0][3]['negocio'] === 'tu negocio' && $mandados[0][3]['nombre'] === 'Ana');

$mandados = [];
$apagada = $cfg; $apagada['plantillas']['web_caida_resuelta']['automatico'] = false;
$mon = $av4['monitor']; $mon['gomeria.com.ar']['aviso_pendiente'] = ['desde' => $n0, 'hasta' => $n0 + 1800];
$av5 = wabot_webs_avisos_correr($lista, $ar('2026-10-30 11:00:00'), $mon, $apagada, $enviar, $avisar);
caso('con la plantilla en manual no sale y el pendiente se descarta', !$mandados && $av5['monitor']['gomeria.com.ar']['aviso_pendiente'] === null);

echo "\n=== El resumen del mes ===\n";
// Un octubre entero monitoreado: 20 días, 48 chequeos por día, una caída de 1 hora.
$monitorMes = function ($fallidos, $caidas, $dias = 20) {
    $d = [];
    for ($i = 1; $i <= $dias; $i++) $d[sprintf('%02d', $i)] = 1;
    return ['ok' => true, 'desde_ts' => 0, 'ultimo_ts' => 0, 'http' => 200, 'motivo' => '', 'ssl_hasta_ts' => 1800000000,
            'meses' => ['2026-10' => ['chequeos' => 48 * $dias, 'fallidos' => $fallidos, 'dias' => $d]],
            'caidas' => $caidas, 'aviso_pendiente' => null, 'aviso_ts' => 0];
};
$ar10 = function ($s) use ($ar) { return $ar("2026-10-$s"); };
$monitor = [
    'panaderiasol.com.ar' => $monitorMes(2, [['desde' => $ar10('12 03:00:00'), 'hasta' => $ar10('12 04:00:00'), 'motivo' => 'x']]),
    'gomeria.com.ar'      => $monitorMes(0, []),
];
$err = [
    'visitas' => ['panaderiasol.com.ar' => ['total' => 1234, 'dias' => []]],
    'errores' => ['panaderiasol.com.ar' => ['veces' => 40, 'grupos' => ['aaa' => 30, 'bbb' => 8, 'ccc' => 2]]],
    'estados' => ['aaa' => ['estado' => 'pr'], 'bbb' => ['estado' => 'descartado']],
];
$d1 = wabot_webs_reporte_datos('panaderiasol.com.ar', '2026-10', $monitor, $err);
caso('disponibilidad con una caída', $d1['disponibilidad'] === '99,8 % (una caída de 1 hora, ya resuelta)', $d1['disponibilidad']);
caso('visitas con punto de miles', $d1['visitas'] === '1.234 visitas', $d1['visitas']);
caso('errores: corregidos, revisados y en revisión', $d1['errores'] === '3 detectados, 1 corregido, 1 revisado sin impacto, 1 en revisión', $d1['errores']);
caso('certificado con fecha', $d1['ssl'] === 'vigente hasta el 15/01/2027', $d1['ssl']);
$d2 = wabot_webs_reporte_datos('gomeria.com.ar', '2026-10', $monitor, $err);
caso('sin caídas: 100 %', $d2['disponibilidad'] === '100 % (online todo el mes)');
caso('sin visitas ni errores', $d2['visitas'] === 'sin visitas registradas' && $d2['errores'] === 'ninguno detectado');
caso('un mes sin monitoreo no tiene datos', wabot_webs_reporte_datos('gomeria.com.ar', '2026-09', $monitor, $err) === null);
$errTodos = $err; $errTodos['estados'] = ['aaa' => ['estado' => 'pr'], 'bbb' => ['estado' => 'rama'], 'ccc' => ['estado' => 'pr']];
caso('todos corregidos', wabot_webs_reporte_datos('panaderiasol.com.ar', '2026-10', $monitor, $errTodos)['errores'] === '3 detectados, los 3 ya corregidos');
$errUno = $err; $errUno['errores']['panaderiasol.com.ar']['grupos'] = ['aaa' => 5]; $errUno['estados'] = [];
caso('uno en revisión', wabot_webs_reporte_datos('panaderiasol.com.ar', '2026-10', $monitor, $errUno)['errores'] === '1 detectado, en revisión');

echo "\n=== Cuándo sale el reporte ===\n";
$estadoBase = function ($ahora) use ($lista) { return ['lista' => $lista, 'sync_ts' => $ahora - 3600, 'reportes' => [], 'aviso_vieja_ts' => 0]; };
$mandados = []; $avisos = [];
$h = $ar('2026-11-01 10:05:00');
$r1 = wabot_webs_reporte_correr($cfg, $h, $estadoBase($h), $monitor, $err, $enviar, $avisar);
caso('el 1 a las 10 sale a los dos con dominio', $r1['enviados'] === 2 && count($mandados) === 2, json_encode($r1));
caso('con las 7 variables en orden', $mandados[0][3] === ['nombre' => 'Juan', 'mes' => 'octubre', 'negocio' => 'Panadería Sol', 'disponibilidad' => '99,8 % (una caída de 1 hora, ya resuelta)', 'visitas' => '1.234 visitas', 'errores' => '3 detectados, 1 corregido, 1 revisado sin impacto, 1 en revisión', 'ssl' => 'vigente hasta el 15/01/2027'], json_encode($mandados[0][3], JSON_UNESCAPED_UNICODE));
caso('es la plantilla del reporte', $mandados[0][2] === 'reporte_mensual_web');
caso('el que no tiene dominio queda marcado sin reintento', ($r1['estado']['reportes']['clientes:CCC']['resultado'] ?? '') === 'sin_dominio' && ($r1['estado']['reportes']['clientes:DDD']['resultado'] ?? '') === 'sin_dominio');
caso('Pablo recibe un solo push con el total', count($avisos) === 1 && $avisos[0][1] === 'Salió el resumen de octubre a 2 clientes.', json_encode($avisos, JSON_UNESCAPED_UNICODE));

$mandados = [];
$r2 = wabot_webs_reporte_correr($cfg, $h + 1800, $r1['estado'], $monitor, $err, $enviar, $avisar);
caso('una segunda pasada no lo repite', $r2['enviados'] === 0 && !$mandados && $r2['revisados'] === 0);

$mandados = [];
wabot_webs_reporte_correr($cfg, $ar('2026-11-01 09:30:00'), $estadoBase($h), $monitor, $err, $enviar, $avisar);
caso('antes de las 10 no sale', !$mandados);
wabot_webs_reporte_correr($cfg, $ar('2026-11-01 20:30:00'), $estadoBase($h), $monitor, $err, $enviar, $avisar);
caso('después de las 20 tampoco', !$mandados);

$mandados = [];
$r3 = wabot_webs_reporte_correr($cfg, $ar('2026-11-04 12:00:00'), $estadoBase($h), $monitor, $err, $enviar, $avisar);
caso('si el 1 no salió, sale otro día del mes (sigue siendo octubre)', $r3['enviados'] === 2 && $mandados[0][3]['mes'] === 'octubre');

$mandados = []; $avisos = [];
$pocos = $monitor; $pocos['gomeria.com.ar'] = $monitorMes(0, [], 5);
$r4 = wabot_webs_reporte_correr($cfg, $h, $estadoBase($h), $pocos, $err, $enviar, $avisar);
caso('con 5 días monitoreados no hay reporte de esa web', $r4['enviados'] === 1 && ($r4['estado']['reportes']['mantenimiento:BBB']['resultado'] ?? '') === 'pocos_datos', json_encode($r4['estado']['reportes']));

$mandados = [];
$caida = $monitor; $caida['gomeria.com.ar']['ok'] = false;
$r5 = wabot_webs_reporte_correr($cfg, $h, $estadoBase($h), $caida, $err, $enviar, $avisar);
caso('a una web caída ahora no se le manda, y queda para la próxima pasada', $r5['enviados'] === 1 && !isset($r5['estado']['reportes']['mantenimiento:BBB']));

$mandados = []; $avisos = [];
$sinTel = $estadoBase($h); $sinTel['lista'][0]['tel'] = '123';
$r6 = wabot_webs_reporte_correr($cfg, $h, $sinTel, $monitor, $err, $enviar, $avisar);
caso('con un teléfono raro no manda, lo marca y se lo dice a Pablo', $r6['fallidos'] === 1 && ($r6['estado']['reportes']['clientes:AAA']['resultado'] ?? '') === 'telefono' && strpos($avisos[0][1], 'Sin enviar: Panadería Sol (teléfono raro)') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));

$mandados = [];
$apagada = $cfg; $apagada['plantillas']['reporte_mensual_web']['activa'] = false;
$r7 = wabot_webs_reporte_correr($apagada, $h, $estadoBase($h), $monitor, $err, $enviar, $avisar);
caso('con la plantilla apagada no hace nada', !$mandados && !empty($r7['apagado']));

echo "\n=== La pasada completa del cron ===\n";
$mandados = []; $avisos = []; $respuestas = [];
$todo = wabot_webs_correr($cfg, $h, ['estado' => $estadoBase($h), 'monitor' => $monitor, 'pedir' => $pedir, 'enviar' => $enviar, 'avisar' => $avisar, 'err' => $err]);
caso('chequea, no avisa nada y manda el reporte', $todo['chequeo']['chequeadas'] === 2 && $todo['avisos']['enviados'] === 0 && $todo['reporte']['enviados'] === 2, json_encode($todo['reporte']));
caso('el chequeo del 1 de noviembre abre el mes nuevo sin perder octubre', isset($todo['monitor']['panaderiasol.com.ar']['meses']['2026-11']) && isset($todo['monitor']['panaderiasol.com.ar']['meses']['2026-10']));
$vieja = $estadoBase($h); $vieja['sync_ts'] = $h - 40 * 86400;
$avisos = [];
$tv = wabot_webs_correr($cfg, $h, ['estado' => $vieja, 'monitor' => $monitor, 'pedir' => $pedir, 'enviar' => $enviar, 'avisar' => $avisar, 'err' => $err]);
caso('con la lista de hace 40 días monitorea igual pero avisa una vez', !empty($tv['lista_vieja']) && $avisos[0][0] === 'Lista de webs sin actualizar' && $tv['chequeo']['chequeadas'] === 2);
caso('sin lista no hace nada', !empty(wabot_webs_correr($cfg, $h, ['estado' => ['lista' => [], 'sync_ts' => 0, 'reportes' => [], 'aviso_vieja_ts' => 0], 'monitor' => []])['sin_lista']));

echo "\n=== Las plantillas en el chat ===\n";
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$cv = conv_nueva();
$okP = wabot_enviar_plantilla($cv, 'reporte_mensual_web', $cfg, ['nombre' => 'Juan', 'mes' => 'octubre', 'negocio' => 'Panadería Sol', 'disponibilidad' => '100 % (online todo el mes)', 'visitas' => '312 visitas', 'errores' => 'ninguno detectado', 'ssl' => 'vigente hasta el 15/01/2027']);
$pl = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('el reporte va con sus 7 variables en orden', $okP && ($pl[1] ?? '') === 'reporte_mensual_web' && ($pl[3] ?? []) === ['Juan', 'octubre', 'Panadería Sol', '100 % (online todo el mes)', '312 visitas', 'ninguno detectado', 'vigente hasta el 15/01/2027'], json_encode($pl, JSON_UNESCAPED_UNICODE));
$ult = end($cv['transcript']);
caso('en el chat queda el texto con los datos', strpos((string)($ult['t'] ?? ''), "Hola Juan, te paso el resumen de octubre de la web de Panadería Sol:\n\n✅ Disponibilidad: 100 % (online todo el mes)\n👥 Visitas: 312 visitas") === 0, (string)($ult['t'] ?? ''));
caso('y el bot queda apagado en ese chat (contesta Pablo)', !empty($cv['bot_off']));
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$cv2 = conv_nueva();
wabot_enviar_plantilla($cv2, 'web_caida_resuelta', $cfg, ['nombre' => 'Ana', 'negocio' => 'Gomería', 'desde' => 'hoy a las 3:00', 'hasta' => 'hoy a las 3:30']);
$pl2 = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('el aviso de caída va con sus 4 variables', ($pl2[3] ?? []) === ['Ana', 'Gomería', 'hoy a las 3:00', 'hoy a las 3:30'], json_encode($pl2, JSON_UNESCAPED_UNICODE));
caso('y su texto', strpos((string)(end($cv2['transcript'])['t'] ?? ''), 'Hola Ana, te aviso que la web de Gomería dejó de responder hoy a las 3:00 y hoy a las 3:30 ya estaba funcionando otra vez.') === 0, (string)(end($cv2['transcript'])['t'] ?? ''));

todo_ok();
