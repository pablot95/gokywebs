<?php
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

echo "— Flujo comercial (18-sep): pregunta, cotiza, ofrece el primer diseño y espera UNA respuesta —\n";

$c = conv_nueva('549110000FINALTEST', ['fase' => 'menu']);
clasifica(['rubro_comercio']); // incluso si la IA se equivoca, la guarda manda.
$r = turno('Es para un negocio', $c, $cfg);
caso('"es para un negocio" no se clasifica como ecommerce',
    empty($c['tipo']) && ($c['fase'] ?? '') === 'algo_diferente');
caso('primero pregunta qué vende o qué servicio ofrece',
    count($r) === 1 && mb_stripos($r[0], 'qué vendés o qué servicio ofrecés') !== false,
    implode(' | ', $r));

clasifica(['rubro_comercio']);
$r = turno('Vendo ropa', $c, $cfg);
$todo = implode("\n", $r);
caso('al conocer el rubro manda exactamente dos mensajes', count($r) === 2, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la propuesta arranca "Para lo que me contás, te armamos", nunca "Lo mejor para"',
    str_starts_with($r[0] ?? '', 'Para lo que me contás, te armamos una tienda online completa.')
    && mb_stripos($todo, 'Lo mejor para') === false, $r[0] ?? '');
caso('los dos planes, con los montos, lo que incluyen y sin "son alternativas" (19-sep)',
    strpos($r[0] ?? '', "Podés elegir entre dos planes:\n\n• Plan anual: $190.000 por año\n• Plan mensual: $30.000 por mes\n\nAmbos incluyen todo:") !== false
    && strpos($r[0] ?? '', "Mantenimiento:\n✓ Renovación de hosting y dominio") !== false
    && strpos($r[0] ?? '', '✓ Actualizaciones de SDK y plugins') !== false && strpos($r[0] ?? '', '✓ Soporte técnico') !== false
    && mb_stripos($r[0] ?? '', 'pago único') === false
    && mb_stripos($todo, 'Son alternativas') === false, $r[0] ?? '');
caso('el segundo mensaje ofrece el primer diseño sin cargo y pregunta, sin formulario',
    ($r[1] ?? '') === 'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?'
    && !tiene_form($r) && mb_stripos($todo, 'demo gratis') === false, $r[1] ?? '');
caso('el bot sigue prendido, esperando la respuesta, y el chat ya figura para Pablo',
    empty($c['bot_off']) && !empty($c['oferta_diseno_ts']) && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']) && ($c['fase'] ?? '') === 'prediseno');
caso('la oferta sale dos segundos después del precio', wabot_demora_tipeo($r[1] ?? '', $cfg) === 2.0);

echo "— El sí se lleva el formulario y el bot se calla —\n";
$si = $c;
clasifica(['otro']);
$rSi = turno('Sí, dale', $si, $cfg);
caso('un sí recibe solo el formulario, con el link de la charla',
    count($rSi) === 1 && tiene_form($rSi) && str_starts_with($rSi[0], 'Dale. Para prepararte el primer diseño completá este formulario:'),
    json_encode($rSi, JSON_UNESCAPED_UNICODE));
caso('y queda como prospecto, con el bot apagado y pendiente para Pablo',
    !empty($si['esProspecto']) && !empty($si['link_form_enviado']) && !empty($si['bot_off'])
    && !empty($si['handoff_pendiente']) && ($si['cierre'] ?? '') === 'cotizacion_final' && empty($si['oferta_diseno_ts']));
caso('después del formulario el bot no contesta nada más', turno('Listo, ya lo estoy llenando', $si, $cfg) === []);

$m = $c;
$rM = turno('Prefiero el plan anual', $m, $cfg);
caso('elegir una forma de pago también es avanzar: formulario', tiene_form($rM) && ($m['modalidad_elegida'] ?? '') === 'unico');

echo "— Cualquier otra respuesta la contesta Pablo —\n";
foreach (['Cuánto tarda?', 'y la seña de cuánto es', 'No, gracias', 'Lo voy a pensar', 'Ok gracias',
          'Me interesa pero lo hablo con mi socia', 'Quiero hablar con una persona', 'Tienen factura?',
          'Me pasás el CBU?'] as $resp) {
    $d = $c;
    $rD = turno($resp, $d, $cfg);
    caso("\"$resp\" → silencio y pendiente para Pablo",
        $rD === [] && !empty($d['bot_off']) && !empty($d['handoff_pendiente']) && empty($d['esProspecto'])
        && empty($d['oferta_diseno_ts']), json_encode($rD, JSON_UNESCAPED_UNICODE));
}
/* El panel (lib.php, lista de conversaciones, y el JavaScript de admin.php):
 * un chat es "del bot" solo si su estado es 'bot' y NO tiene handoff
 * pendiente. Con el handoff, es de Pablo: "Esperando cliente" mientras el
 * cliente no contesta, y "Sin leer / Sin contestar" cuando contesta. */
$estadoPanel = function ($cv) {
    return !empty($cv['bot_off']) ? 'apagado'
        : (((int)($cv['pausado_hasta'] ?? 0) > time()) ? 'pausado'
        : ((($cv['fase'] ?? '') === 'derivado') ? 'pausado' : 'bot'));
};
$delBot = function ($cv) use ($estadoPanel) { return $estadoPanel($cv) === 'bot' && empty($cv['handoff_pendiente']); };
caso('mientras espera la respuesta, el panel lo muestra como chat de Pablo esperando al cliente (como antes)',
    !$delBot($c) && wabot_ultima_salida_ts($c) >= wabot_ultimo_cliente_ts($c));
$d = $c;
turno('Cuánto tarda?', $d, $cfg);
caso('con la pregunta, queda como chat de Pablo que espera respuesta',
    !$delBot($d) && $estadoPanel($d) === 'apagado' && !empty($d['handoff_pendiente'])
    && wabot_ultimo_cliente_ts($d) >= wabot_ultima_salida_ts($d));
$p = $c;
wabot_conv_tomar_control($p);
wabot_conv_encender_manual($p);
caso('si Pablo escribe a mano mientras espera, la espera se cancela: el bot no toma lo siguiente como respuesta a la oferta',
    empty($p['oferta_diseno_ts']) && wabot_oferta_diseno_responder('sí', $p, $cfg) === null);

echo "— El que pidió la demo en el primer mensaje también ve el precio primero —\n";
$ca = conv_nueva('549110000ANUNCIOTEST', ['fase' => 'menu']);
clasifica(['saludo']);
turno('Hola! Quiero mi demo gratis para mi negocio.', $ca, $cfg);
clasifica(['rubro_landing']);
$rA = turno('Soy nutricionista', $ca, $cfg);
caso('precio y oferta, sin el formulario pegado al monto',
    count($rA) === 2 && !tiene_form($rA) && mb_stripos($rA[1] ?? '', 'primer diseño') !== false, json_encode($rA, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
caso('y con el sí, el formulario', tiene_form(turno('si', $ca, $cfg)));

$esperados = [
    'landing' => ['un sitio profesional completo', '$120.000', '$20.000'],
    'inmobiliaria' => ['una web inmobiliaria completa', '$170.000', '$30.000'],
    'elearning' => ['una plataforma de cursos completa', '$190.000', '$30.000'],
];
foreach ($esperados as $tipo => [$frase, $precio, $mensualidad]) {
    $ct = conv_nueva('549110000' . strtoupper($tipo) . 'TEST', ['fase' => 'menu']);
    $salida = wabot_pitch($tipo, $ct, $cfg);
    $primero = wabot_personalizar($salida[0] ?? '', $ct);
    caso("$tipo también usa su texto fijo y espera la respuesta",
        str_starts_with($primero, 'Para lo que me contás, te armamos ' . $frase)
        && strpos($primero, "• Plan anual: $precio por año") !== false
        && strpos($primero, "• Plan mensual: $mensualidad por mes") !== false
        && count($salida) === 2 && empty($ct['bot_off']) && !empty($ct['oferta_diseno_ts']), $primero);
}

// Regresión 16-sep: al detectar "fábrica de máquinas", el borde común
// agregaba cinco trabajos y modelos después de la pregunta mostrar/vender.
$cf = conv_nueva('549110000FABRICATEST', ['fase' => 'desempate_hibrido']);
wabot_conv_transcript($cf, 'cliente', 'Fábrica de máquinas para emprendimientos');
$pregunta = (string)$cfg['desempate_hibrido'];
$salidaFabrica = wabot_salida_preparar([$pregunta], $cf, $cfg);
caso('una pregunta de aclaración sale sola, sin portfolio ni modelos',
    $salidaFabrica === [$pregunta]
    && mb_stripos(implode("\n", $salidaFabrica), 'cinco trabajos') === false
    && mb_stripos(implode("\n", $salidaFabrica), 'modelos') === false,
    implode(' | ', $salidaFabrica));

// Regresión 16-sep: si en el mismo mensaje pregunta el procedimiento y deja
// claro que necesita ecommerce, no se antepone info.proceso a la cotización.
$cc = conv_nueva('549110000COSMETICATEST', ['fase' => 'menu']);
clasifica(['pregunta_info', 'rubro_ecommerce'], ['info_keys' => ['proceso']]);
$salidaCosmeticos = turno('Consulto por precios y cómo sería el procedimiento. Quiero un catálogo de cosméticos con producto, stock y precio.', $cc, $cfg);
$textoCosmeticos = implode("\n", $salidaCosmeticos);
caso('procedimiento + rubro claro manda solamente la cotización y la oferta',
    count($salidaCosmeticos) === 2
    && mb_stripos($textoCosmeticos, 'Te paso el valor según') === false
    && mb_stripos($salidaCosmeticos[1] ?? '', 'primer diseño') !== false,
    implode(' | ', $salidaCosmeticos));

todo_ok();
