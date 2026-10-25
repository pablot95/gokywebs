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
$mandados = [];
$enviar = function ($clave, $f, $valores) use (&$mandados) { $mandados[] = [$clave, $f['id'], $valores]; return true; };
$avisos = [];
$avisar = function ($t, $c) use (&$avisos) { $avisos[] = $t; };

$hoy = $ar('2026-10-25 11:00:00');
caso('la fila sin id válido no entra', count($estadoBase($hoy)['lista']) === 3);
caso('sin día, cuenta el del alta', $estadoBase($hoy)['lista'][1]['dia'] === 26);

$r = wabot_renovacion_correr($cfg, $hoy, $estadoBase($hoy), $enviar, $avisar);
caso('el 25 a las 11 sale solo el del día 25', $r['enviados'] === 1 && count($mandados) === 1 && $mandados[0][1] === 'clientes:AAA', json_encode($r));
caso('a un número sin chat le arma el 549', ($mandados[0][0] ?? '') === '5491144445555', $mandados[0][0] ?? '');
caso('nombre, negocio y monto en la plantilla', ($mandados[0][2] ?? []) === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000 por mes'], json_encode($mandados[0][2] ?? []));
caso('el que se dio de alta hoy no recibe aviso', !in_array('clientes:CCC', array_column($mandados, 1), true));
caso('Pablo recibe el push', $avisos === ['Aviso de renovación enviado']);

$mandados = [];
$otra = wabot_renovacion_correr($cfg, $ar('2026-10-25 15:00:00'), $r['estado'], $enviar, $avisar);
caso('una segunda pasada el mismo día no lo repite', $otra['enviados'] === 0 && !$mandados);

$mandados = [];
wabot_renovacion_correr($cfg, $ar('2026-10-25 09:30:00'), $estadoBase($hoy), $enviar, $avisar);
caso('antes de las 10 no sale', !$mandados);

$mandados = [];
wabot_renovacion_correr($cfg, $ar('2026-10-26 10:05:00'), $estadoBase($hoy), $enviar, $avisar);
caso('al otro día sale el del alta del 26 (sin día de cobro)', array_column($mandados, 1) === ['mantenimiento:BBB'], json_encode(array_column($mandados, 1)));
caso('sin negocio dice «tu web»', ($mandados[0][2]['negocio'] ?? '') === 'tu web');

$mandados = [];
wabot_renovacion_correr($cfg, $ar('2026-11-30 12:00:00'), $estadoBase($ar('2026-11-30 12:00:00')), $enviar, $avisar);
caso('el día 31 en noviembre es el 30', array_column($mandados, 1) === ['clientes:CCC'], json_encode(array_column($mandados, 1)));

$mandados = []; $avisos = [];
$vieja = $estadoBase($hoy); $vieja['sync_ts'] = $hoy - 40 * 86400;
$rv = wabot_renovacion_correr($cfg, $hoy, $vieja, $enviar, $avisar);
caso('con la lista de hace 40 días no manda y avisa', !$mandados && !empty($rv['lista_vieja']) && $avisos === ['Avisos de renovación frenados']);

$mandados = [];
$apagada = $cfg; $apagada['plantillas']['renovacion_por_fuera']['activa'] = false;
$ra = wabot_renovacion_correr($apagada, $hoy, $estadoBase($hoy), $enviar, $avisar);
caso('con la plantilla apagada no hace nada', !$mandados && !empty($ra['apagado']));

$mandados = []; $avisos = [];
$sinTel = $estadoBase($hoy); $sinTel['lista'][0]['tel'] = '123';
$rt = wabot_renovacion_correr($cfg, $hoy, $sinTel, $enviar, $avisar);
caso('con un teléfono raro no manda y le avisa a Pablo', !$mandados && $rt['fallidos'] === 1 && $avisos === ['Aviso de renovación sin enviar']);
caso('y no lo reintenta en la pasada siguiente', ($rt['estado']['enviados']['clientes:AAA']['mes'] ?? '') === '2026-10');

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$cv = conv_nueva();
$okP = wabot_enviar_plantilla($cv, 'renovacion_por_fuera', $cfg, ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000 por mes']);
$pl = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('la plantilla va con sus 3 variables en orden', $okP && ($pl[1] ?? '') === 'renovacion_plan_mensual' && ($pl[3] ?? []) === ['Juan', 'Panadería Sol', '$20.000 por mes'], json_encode($pl, JSON_UNESCAPED_UNICODE));
$ult = end($cv['transcript']);
caso('en el chat queda el texto con los datos', strpos((string)($ult['t'] ?? ''), 'Hola Juan, hoy se renueva el plan mensual de Panadería Sol: $20.000 por mes.') === 0, (string)($ult['t'] ?? ''));
caso('y el bot queda apagado en ese chat (contesta Pablo)', !empty($cv['bot_off']));

echo "\n=== Clave del chat para un número sin charla ===\n";
foreach (['011 15 4444-5555' => '5491144445555', '+54 9 11 4444-5555' => '5491144445555', '0351 15 512-3456' => '5493515123456', '2214567890' => '5492214567890'] as $tel => $esperada) {
    $c = wabot_renovacion_clave($tel, $m);
    caso("$tel → $esperada", $c === $esperada, (string)$c . ' ' . (string)$m);
}

todo_ok();
