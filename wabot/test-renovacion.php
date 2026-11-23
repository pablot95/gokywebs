<?php
/**
 * Links con https y aviso de renovación a los que pagan por afuera (Pablo,
 * 25-oct). Solo CLI, sin red ni disco: la lista y los envíos se simulan.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/renovacion.php';

echo "=== Los links salen con https ===\n";
foreach ([
    'Se encuentra en este link: gokywebs.com/demo/panaderia'      => 'Se encuentra en este link: https://gokywebs.com/demo/panaderia',
    'En gokywebs.com/portfolio tenés webs.'                       => 'En https://gokywebs.com/portfolio tenés webs.',
    'Mirá www.gokywebs.com/modelos/?tipo=ecommerce, y contame'     => 'Mirá https://www.gokywebs.com/modelos/?tipo=ecommerce, y contame',
    'Pagás acá: mpago.la/1pfejMG'                                 => 'Pagás acá: https://mpago.la/1pfejMG',
    'El viejo http://gokywebs.com/pago/anual210'                  => 'El viejo https://gokywebs.com/pago/anual210',
    'Ya está bien: https://gokywebs.com/form/?c=AB'               => 'Ya está bien: https://gokywebs.com/form/?c=AB',
    "Escribinos a wa.me/5491140688675\nGracias"                    => "Escribinos a https://wa.me/5491140688675\nGracias",
    'Visitá gokywebs.com.'                                        => 'Visitá https://gokywebs.com.',
    'Mail: no-reply@gokywebs.com'                                 => 'Mail: no-reply@gokywebs.com',
    'Otro sitio: tienda.gokywebs.com/x'                           => 'Otro sitio: tienda.gokywebs.com/x',
    'https://www.mercadopago.com.ar/subscriptions/checkout?x=1'   => 'https://www.mercadopago.com.ar/subscriptions/checkout?x=1',
    'Sin links, solo texto'                                       => 'Sin links, solo texto',
] as $entra => $sale) {
    $r = wabot_links_https($entra);
    caso('«' . str_replace("\n", ' ', $entra) . '»', $r === $sale, $r);
}

$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
wabot_wa_send_text('5491100000000', 'Mirala: gokywebs.com/demo/x');
caso('el envío por WhatsApp lo agrega', ($GLOBALS['WABOT_TEST_ENVIADOS'][0][1] ?? '') === 'Mirala: https://gokywebs.com/demo/x');
$cfgDemo = ['muestra_presentar' => 'Tu demo: {link}', 'muestra_presentar_seguimiento' => 'Contame'];
$textos = wabot_muestra_presentar_textos('panaderia', $cfgDemo);
caso('la presentación de la demo (también la que se copia a mano)', strpos($textos[0], 'https://gokywebs.com/demo/panaderia') !== false, $textos[0]);
$eco = conv_nueva('999TEST999', ['transcript' => [['q' => 'bot', 't' => 'Mirá gokywebs.com/portfolio', 'ts' => time()]]]);
caso('el eco con https se reconoce como propio', wabot_eco_es_propio($eco, 'Mirá https://gokywebs.com/portfolio'));

echo "\n=== Aviso de renovación ===\n";
$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
$cfg = wabot_config_load();
$cfg['plantillas']['renovacion_por_fuera'] = array_merge((array)$cfg['plantillas']['renovacion_por_fuera'], ['activa' => true, 'automatico' => true]);
$cfg['plantillas']['pago_recibido'] = array_merge((array)$cfg['plantillas']['pago_recibido'], ['activa' => true, 'automatico' => true]);
$estadoBase = function ($ahora) {
    return [
        'lista' => array_values(array_filter(array_map('wabot_renovacion_fila', [
            ['id' => 'clientes:AAA', 'tel' => '11 4444-5555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'monto' => 20000, 'dia' => 25, 'desde' => '2026-09-25'],
            ['id' => 'mantenimiento:BBB', 'tel' => '1155556666', 'persona' => 'Ana', 'negocio' => '', 'monto' => 10000, 'dia' => 0, 'desde' => '2026-08-26'],
            ['id' => 'clientes:CCC', 'tel' => '1166667777', 'persona' => 'Leo', 'negocio' => 'Gomería', 'monto' => 30000, 'dia' => 31, 'desde' => '2026-10-25'],
            ['id' => 'malo', 'tel' => '1', 'dia' => 3],
        ]))),
        'sync_ts' => $ahora - 3600, 'enviados' => [], 'aviso_vieja_ts' => 0,
    ];
};
// 16-nov (Pablo): ya no sale la plantilla al cliente; el aviso con los datos le llega a él.
$avisos = [];
$okAvisar = true;
$avisar = function ($t, $l, $c) use (&$avisos, &$okAvisar) { $avisos[] = [$t, implode("\n", $l), $c]; return $okAvisar; };
// 23-nov: vuelve a salir la plantilla al cliente; en las pruebas no va a la red.
$plantCli = [];
$enviarR = function ($clave, $f, $valores, $plantilla) use (&$plantCli) { $plantCli[] = [$plantilla, $clave, $valores]; return true; };
$ids = function () use (&$avisos) { return array_map(function ($a) { return $a[1]; }, $avisos); };

$hoy = $ar('2026-10-25 11:00:00');
caso('la fila sin id válido no entra', count($estadoBase($hoy)['lista']) === 3);
caso('sin día, cuenta el del alta', $estadoBase($hoy)['lista'][1]['dia'] === 26);

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$r = wabot_renovacion_correr($cfg, $hoy, $estadoBase($hoy), $enviarR, $avisar);
caso('el 25 a las 11 le avisa a Pablo solo el del día 25', $r['enviados'] === 1 && count($avisos) === 1 && strpos($avisos[0][1], 'Panadería Sol') !== false, json_encode($r));
caso('el aviso trae cliente, WhatsApp, monto y día', strpos($avisos[0][0], 'Pago por afuera') !== false
    && strpos($avisos[0][1], 'Cliente: Juan Pérez — Panadería Sol') !== false && strpos($avisos[0][1], 'WhatsApp: +5491144445555') !== false
    && strpos($avisos[0][1], '$20.000 por mes') !== false && strpos($avisos[0][1], 'el 25 de cada mes') !== false && strpos($avisos[0][1], '25/09/2026') !== false,
    $avisos[0][1] ?? '');
caso('23-nov: al cliente le sale la plantilla de renovación con sus datos', count($plantCli) === 1 && $plantCli[0][0] === 'renovacion_por_fuera'
    && $plantCli[0][1] === '5491144445555' && $plantCli[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000 por mes'], json_encode($plantCli, JSON_UNESCAPED_UNICODE));
caso('y el aviso a Pablo lo dice', strpos($avisos[0][1], 'Plantilla al cliente: enviada') !== false, $avisos[0][1]);
caso('el que se dio de alta hoy no recibe aviso', strpos(implode(' ', $ids()), 'Gomería') === false);

$avisos = [];
$otra = wabot_renovacion_correr($cfg, $ar('2026-10-25 15:00:00'), $r['estado'], $enviarR, $avisar);
caso('una segunda pasada el mismo día no lo repite', $otra['enviados'] === 0 && !$avisos);

$avisos = [];
wabot_renovacion_correr($cfg, $ar('2026-10-25 09:30:00'), $estadoBase($hoy), $enviarR, $avisar);
caso('antes de las 10 no sale', !$avisos);

$avisos = [];
wabot_renovacion_correr($cfg, $ar('2026-10-26 10:05:00'), $estadoBase($hoy), $enviarR, $avisar);
caso('al otro día sale el del alta del 26 (sin día de cobro)', count($avisos) === 1 && strpos($avisos[0][1], 'Cliente: Ana') !== false, json_encode($ids(), JSON_UNESCAPED_UNICODE));

$avisos = [];
wabot_renovacion_correr($cfg, $ar('2026-11-30 12:00:00'), $estadoBase($ar('2026-11-30 12:00:00')), $enviarR, $avisar);
caso('el día 31 en noviembre es el 30', count($avisos) === 1 && strpos($avisos[0][1], 'Gomería') !== false, json_encode($ids(), JSON_UNESCAPED_UNICODE));

$avisos = [];
$vieja = $estadoBase($hoy); $vieja['sync_ts'] = $hoy - 40 * 86400;
$rv = wabot_renovacion_correr($cfg, $hoy, $vieja, $enviarR, $avisar);
caso('con la lista de hace 40 días no avisa cobros y pide abrir el admin', !empty($rv['lista_vieja']) && count($avisos) === 1 && $avisos[0][0] === 'Avisos de pago por afuera frenados');

$avisos = []; $okAvisar = false;
$rf = wabot_renovacion_correr($cfg, $hoy, $estadoBase($hoy), $enviarR, $avisar);
caso('si el WhatsApp a Pablo no sale, no lo anota', $rf['fallidos'] === 1 && empty($rf['estado']['enviados']['clientes:AAA']['mes']));
$okAvisar = true; $avisos = [];
$rf2 = wabot_renovacion_correr($cfg, $hoy + 1800, $rf['estado'], $enviarR, $avisar);
caso('y la pasada siguiente lo reintenta', $rf2['enviados'] === 1 && count($avisos) === 1);
caso('sin volver a mandarle la plantilla al cliente', ($rf2['clientes'] ?? -1) === 0);

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$cv = conv_nueva();
$okP = wabot_enviar_plantilla($cv, 'renovacion_por_fuera', $cfg, ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000 por mes']);
$pl = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('la plantilla va con sus 3 variables en orden', $okP && ($pl[1] ?? '') === 'renovacion_plan_mensual' && ($pl[3] ?? []) === ['Juan', 'Panadería Sol', '$20.000 por mes'], json_encode($pl, JSON_UNESCAPED_UNICODE));
$ult = end($cv['transcript']);
caso('en el chat queda el texto con los datos', strpos((string)($ult['t'] ?? ''), 'Hola Juan, hoy se renueva el plan mensual de Panadería Sol: $20.000 por mes.') === 0, (string)($ult['t'] ?? ''));
caso('y el bot queda apagado en ese chat (contesta Pablo)', !empty($cv['bot_off']));

echo "\n=== 23-nov: pagó por adelantado y «recibimos tu pago» ===\n";
$plantCli = []; $avisos = [];
$adelantado = $estadoBase($hoy);
$adelantado['lista'][0]['pagado'] = '2026-10-25';
$ra = wabot_renovacion_correr($cfg, $hoy, $adelantado, $enviarR, $avisar);
caso('el que ya está marcado pagado este cobro no recibe el recordatorio', !$plantCli && count($avisos) === 1
    && strpos($avisos[0][1], 'Ya lo marcaste pagado') !== false, json_encode([$plantCli, $avisos], JSON_UNESCAPED_UNICODE));

$fila = function ($pagado) { return wabot_renovacion_fila(['id' => 'clientes:AAA', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'monto' => 20000, 'dia' => 19, 'desde' => '2026-10-19', 'pagado' => $pagado]); };
$ahoraS = $ar('2026-11-19 12:00:00');
$e0 = wabot_renovacion_pagos_detectar(['lista' => [$fila('2026-10-19')], 'sync_ts' => $ahoraS, 'pagos_visto' => [], 'pagos_cola' => [], 'pagos_init' => false]);
caso('la primera lista solo anota (no avisa pagos viejos)', !$e0['pagos_cola'] && $e0['pagos_init'] && $e0['pagos_visto']['clientes:AAA'] === '2026-10-19');
$e1 = wabot_renovacion_pagos_detectar(array_merge($e0, ['lista' => [$fila('2026-11-19')]]));
caso('Pablo marca «Pagó» el cobro del 19/11: entra a la cola', ($e1['pagos_cola']['clientes:AAA']['pagado'] ?? '') === '2026-11-19');
$e2 = wabot_renovacion_pagos_detectar(array_merge($e1, ['lista' => [$fila('')]]));
caso('si lo deshace, sale de la cola', !isset($e2['pagos_cola']['clientes:AAA']));
$nuevo = wabot_renovacion_pagos_detectar(array_merge($e1, ['lista' => [$fila('2026-11-19'), wabot_renovacion_fila(['id' => 'clientes:NUE', 'tel' => '1100001111', 'dia' => 5, 'pagado' => '2026-11-05'])], 'pagos_cola' => []]));
caso('un cliente que aparece por primera vez ya marcado no se avisa', !isset($nuevo['pagos_cola']['clientes:NUE']));

$plantCli = []; $avisos = [];
$cola = array_merge($e1, ['aviso_vieja_ts' => 0, 'enviados' => []]);
$rp = wabot_renovacion_correr($cfg, $ar('2026-11-20 10:30:00'), $cola, $enviarR, $avisar);
$pr = array_values(array_filter($plantCli, function ($p) { return $p[0] === 'pago_recibido'; }));
caso('sale «recibimos tu pago», al día hasta el próximo cobro', count($pr) === 1 && $pr[0][1] === '5491144445555'
    && $pr[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000', 'fecha' => '19/12/2026'], json_encode($plantCli, JSON_UNESCAPED_UNICODE));
caso('y sale de la cola', !$rp['estado']['pagos_cola']);
$plantCli = [];
$vieja2 = wabot_renovacion_correr($cfg, $ar('2026-11-24 10:30:00'), array_merge($cola, ['sync_ts' => $ar('2026-11-24 09:00:00')]), $enviarR, $avisar);
caso('una marca de hace más de 3 días ya no se manda', !$plantCli && !$vieja2['estado']['pagos_cola']);
caso('31/01 + 1 mes = 28/02', wabot_renovacion_mas_un_mes('2027-01-31') === '2027-02-28' && wabot_renovacion_mas_un_mes('2026-12-15') === '2027-01-15');

echo "\n=== Registro de avisos: no se borra con la lista (5-nov) ===\n";
$ahoraP = gmmktime(15, 0, 0, 11, 5, 2026);
$env = ['clientes:AAA' => ['mes' => '2026-11', 'ts' => $ahoraP - 3600, 'ok' => true],
        'clientes:BBB' => ['mes' => '2026-10', 'ts' => $ahoraP - 20 * 86400, 'ok' => true],
        'clientes:VIE' => ['mes' => '2026-08', 'ts' => $ahoraP - 70 * 86400, 'ok' => true],
        'roto' => 'x'];
$pod = wabot_renovacion_enviados_podar($env, $ahoraP);
caso('los avisos recientes quedan aunque no estén en la lista', isset($pod['clientes:AAA'], $pod['clientes:BBB']), json_encode($pod));
caso('los de hace más de dos meses y los rotos se sacan', !isset($pod['clientes:VIE']) && !isset($pod['roto']));

echo "\n=== Clave del chat para un número sin charla ===\n";
foreach (['011 15 4444-5555' => '5491144445555', '+54 9 11 4444-5555' => '5491144445555', '0351 15 512-3456' => '5493515123456', '2214567890' => '5492214567890'] as $tel => $esperada) {
    $c = wabot_renovacion_clave($tel, $m);
    caso("$tel → $esperada", $c === $esperada, (string)$c . ' ' . (string)$m);
}

todo_ok();
