<?php
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

echo "— Flujo comercial (18-sep): pregunta, cotiza, ofrece el primer diseño y espera UNA respuesta —\n";

// De punta a punta, con la pregunta de reconocimiento del 21-sep incluida.
$c = conv_nueva('549110000FINALTEST', ['fase' => 'menu', 'reconocimiento_hecho' => false]);
clasifica(['rubro_comercio']); // incluso si la IA se equivoca, la guarda manda.
$r = turno('Es para un negocio', $c, $cfg);
caso('"es para un negocio" no se clasifica como ecommerce',
    empty($c['tipo']) && ($c['fase'] ?? '') === 'algo_diferente');
caso('primero pregunta qué vende o qué servicio ofrece',
    count($r) === 1 && mb_stripos($r[0], 'qué vendés o qué servicio ofrecés') !== false,
    implode(' | ', $r));

clasifica(['rubro_comercio']);
$r = turno('Vendo ropa', $c, $cfg);
/* Sin la pregunta "vender o mostrar" (Pablo, 24-sep: "le damos mucha
 * elección"): si vende algo, se cotiza la tienda online derecho. */
caso('vende algo: cotiza la tienda sin preguntar si vende por la web',
    mb_stripos(implode(' ', $r), 'Buscás vender') === false && ($c['fase'] ?? '') !== 'reconocimiento'
    && !empty($c['precio_dado']) && ($c['tipo'] ?? '') === 'ecommerce', implode(' | ', $r));
$todo = implode("\n", $r);
caso('al conocer el rubro manda exactamente tres mensajes: propuesta, imagen y oferta (25-sep)', count($r) === 3, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la propuesta arranca "Para lo que me contás, te armamos", nunca "Lo mejor para"',
    str_starts_with($r[0] ?? '', 'Para lo que me contás, te armamos una tienda online completa.')
    && mb_stripos($todo, 'Lo mejor para') === false, $r[0] ?? '');
caso('termina con la intro de las 3 modalidades; los montos y lo incluido ahora van en la imagen (22-sep, 25-sep)',
    str_ends_with($r[0] ?? '', 'Podés elegir una de estas 3 modalidades de pago:')
    && strpos($r[0] ?? '', '$') === false && strpos($r[0] ?? '', 'Las 3 incluyen la web completa:') === false
    && mb_stripos($todo, 'Son alternativas') === false, $r[0] ?? '');
caso('el segundo mensaje es la imagen de modalidades de la tienda (tiendacursosinmo.png, con los montos de la lista)',
    ($r[1] ?? '') === wabot_precio_imagen_marcador('ecommerce') && wabot_precio_imagen_archivo('ecommerce') === 'tiendacursosinmo.png', $r[1] ?? '');
caso('el tercer mensaje ofrece el primer diseño sin cargo, atado a la tienda (26-sep), y pregunta, sin formulario',
    ($r[2] ?? '') === 'Si te interesa, te preparamos sin cargo un primer diseño de tu tienda online, así ves cómo quedaría y cómo se verían presentados tus productos antes de decidir. Querés que lo armemos?'
    && !tiene_form($r) && mb_stripos($todo, 'demo gratis') === false, $r[2] ?? '');
caso('el bot sigue prendido, esperando la respuesta, y el chat ya figura para Pablo',
    empty($c['bot_off']) && !empty($c['oferta_diseno_ts']) && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']) && ($c['fase'] ?? '') === 'prediseno');
caso('la oferta sale dos segundos después del precio', wabot_demora_tipeo($r[2] ?? '', $cfg) === 2.0);

echo "— El sí se lleva el formulario y el bot se calla —\n";
$si = $c;
clasifica(['otro']);
$rSi = turno('Sí, dale', $si, $cfg);
caso('un sí recibe solo el formulario, con el link de la charla',
    count($rSi) === 1 && tiene_form($rSi) && str_starts_with($rSi[0], 'Dale. Para prepararte el primer diseño completá este formulario:'),
    json_encode($rSi, JSON_UNESCAPED_UNICODE));
caso('el formulario aclara que el primer diseño va a estar listo en menos de 24 hs (21-sep)',
    mb_strpos($rSi[0] ?? '', 'va a estar listo en menos de 24 hs') !== false, json_encode($rSi, JSON_UNESCAPED_UNICODE));
caso('y queda como prospecto, con el bot apagado y pendiente para Pablo',
    !empty($si['esProspecto']) && !empty($si['link_form_enviado']) && !empty($si['bot_off'])
    && !empty($si['handoff_pendiente']) && ($si['cierre'] ?? '') === 'cotizacion_final' && empty($si['oferta_diseno_ts']));
caso('después del formulario el bot no contesta nada más', turno('Listo, ya lo estoy llenando', $si, $cfg) === []);

$m = $c;
$rM = turno('Prefiero el plan anual', $m, $cfg);
caso('elegir una forma de pago también es avanzar: formulario', tiene_form($rM) && ($m['modalidad_elegida'] ?? '') === 'unico');
/* Las opciones salen numeradas, así que el cliente puede contestar el número
 * solo. Desde el 26-sep a la noche el número es el de la imagen que acaba de
 * ver: "1 plan mensual, 2 plan anual, 3 pago único". */
$nombrePlan = ['mensual' => 'el plan mensual', 'unico' => 'el plan anual', 'propia' => 'el pago único'];
foreach (['1' => 'mensual', '2' => 'unico', '3' => 'propia', 'el 1' => 'mensual', '2)' => 'unico', 'La opción 3' => 'propia'] as $numero => $plan) {
    $n = $c;
    clasifica(['otro']);
    $rN = turno((string)$numero, $n, $cfg);
    caso("\"$numero\" elige {$nombrePlan[$plan]} y se lleva el formulario",
        tiene_form($rN) && ($n['modalidad_elegida'] ?? '') === $plan && !empty($n['esProspecto'])
        && ($plan !== 'propia' || !empty($n['quiere_web_propia'])), json_encode($rN, JSON_UNESCAPED_UNICODE));
}
/* La charla cotizada antes de la imagen vio "1. Plan anual, 2. Plan mensual,
 * 3. Pago único" en texto: su "1" sigue siendo el anual. */
$cAntes = conv_nueva('549110000ANTESTEST', ['tipo' => 'landing', 'precio_dado' => true, 'fase' => 'prediseno', 'cta_muestra' => true,
    'oferta_diseno_ts' => time(), 'precio_cotizado' => '$120.000', 'sena_cotizada' => '$40.000', 'mensualidad_cotizada' => '$20.000',
    'precio_modelo' => 'anual', 'precio_cotizado_ts' => strtotime('2026-09-24 12:00:00 -03:00')]);
wabot_conv_transcript($cAntes, 'bot', "Para lo que me contás, te armamos un sitio profesional completo.\n\nPodés elegir entre tres opciones:\n\n"
    . "1. Plan anual: \$120.000 incluye mantenimiento\n2. Plan mensual: \$20.000 incluye mantenimiento\n3. Pago único: \$200.000 NO incluye mantenimiento*");
wabot_conv_transcript($cAntes, 'bot', wabot_tres_pasos_texto($cAntes, $cfg));
foreach (['1' => 'unico', '2' => 'mensual', '3' => 'propia'] as $numero => $plan) {
    $n = $cAntes;
    clasifica(['otro']);
    $rN = turno((string)$numero, $n, $cfg);
    caso("en la charla que vio el orden de antes, \"$numero\" elige {$nombrePlan[$plan]} y se lleva el formulario",
        tiene_form($rN) && ($n['modalidad_elegida'] ?? '') === $plan && !empty($n['esProspecto']), json_encode($rN, JSON_UNESCAPED_UNICODE));
}
$fichaAntes = $cAntes;
turno('1', $fichaAntes, $cfg);
caso('y la ficha dice "Eligió: plan anual"', mb_strpos(wabot_ficha_resumen($fichaAntes, $cfg), 'Eligió: plan anual') !== false,
    wabot_ficha_resumen($fichaAntes, $cfg));
// Pablo, 20-sep: contesta solo ante un sí, un dale, un bueno, un ok o algo parecido.
foreach (['si', 'Sí', 'sii', 'sisi', 'dale', 'Dale!', 'bueno', 'ok', 'OK', 'oka', 'oki', 'okey', 'okay', 'listo', 'perfecto',
          'de una', 'joya', 'genial', 'claro', 'por supuesto', 'vamos', 'ok dale', 'bueno dale', 'sí, armalo', '👍'] as $afirma) {
    $a = $c;
    clasifica(['otro']);
    $rA = turno($afirma, $a, $cfg);
    caso("\"$afirma\" → el formulario, y el bot se calla",
        count($rA) === 1 && tiene_form($rA) && !empty($a['esProspecto']) && !empty($a['bot_off']), json_encode($rA, JSON_UNESCAPED_UNICODE));
}

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
caso('precio, imagen y oferta, sin el formulario pegado al monto',
    count($rA) === 3 && !tiene_form($rA) && mb_stripos($rA[2] ?? '', 'primer diseño') !== false, json_encode($rA, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
caso('y con el sí, el formulario', tiene_form(turno('si', $ca, $cfg)));

// Las imágenes del 26-sep a la noche: tienda, cursos e inmobiliaria cuestan lo mismo y comparten la suya.
$esperados = [
    'landing' => ['un sitio profesional completo', 'sitioprofesional.png'],
    'inmobiliaria' => ['una web inmobiliaria completa', 'tiendacursosinmo.png'],
    'elearning' => ['una plataforma de cursos completa', 'tiendacursosinmo.png'],
];
foreach ($esperados as $tipo => [$frase, $archivo]) {
    $ct = conv_nueva('549110000' . strtoupper($tipo) . 'TEST', ['fase' => 'menu']);
    $salida = wabot_pitch($tipo, $ct, $cfg);
    $primero = wabot_personalizar($salida[0] ?? '', $ct);
    caso("$tipo también usa su texto fijo, la intro de modalidades y su imagen, y espera la respuesta",
        str_starts_with($primero, 'Para lo que me contás, te armamos ' . $frase)
        && str_ends_with($primero, 'Podés elegir una de estas 3 modalidades de pago:')
        && ($salida[1] ?? '') === wabot_precio_imagen_marcador($tipo) && wabot_precio_imagen_archivo($tipo) === $archivo
        && count($salida) === 3 && empty($ct['bot_off']) && !empty($ct['oferta_diseno_ts']), $primero);
}

/* Por Instagram no hay envío de imagen (26-sep a la noche): las 3 modalidades
 * salen en texto, en el mismo orden que la imagen, y la oferta aparte. */
$cIg = conv_nueva('ig549110000FINALTEST', ['fase' => 'menu', 'canal' => 'instagram']);
clasifica(['rubro_comercio']);
$rIg = turno('Vendo ropa', $cIg, $cfg);
$tIg = $cfg['tipos']['ecommerce'];
caso('por Instagram son dos mensajes, la propuesta con las 3 modalidades en texto y la oferta, sin la imagen',
    count($rIg) === 2 && !in_array(wabot_precio_imagen_marcador('ecommerce'), $rIg, true)
    && mb_stripos($rIg[1] ?? '', 'primer diseño') !== false && !tiene_form($rIg), json_encode($rIg, JSON_UNESCAPED_UNICODE));
caso('en el orden de la imagen y con los montos de la lista',
    mb_strpos($rIg[0] ?? '', "1. Plan mensual: {$tIg['mensualidad']} por mes") !== false
    && mb_strpos($rIg[0] ?? '', "2. Plan anual: {$tIg['precio']} por año") !== false
    && mb_strpos($rIg[0] ?? '', "3. Pago único: {$tIg['precio_unico']} una vez") !== false, $rIg[0] ?? '');
clasifica(['otro']);
$rIgUno = turno('1', $cIg, $cfg);
caso('y su "1" también es el plan mensual, con el formulario',
    tiene_form($rIgUno) && ($cIg['modalidad_elegida'] ?? '') === 'mensual', json_encode($rIgUno, JSON_UNESCAPED_UNICODE));

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
caso('procedimiento + rubro claro manda solamente la cotización, la imagen y la oferta',
    count($salidaCosmeticos) === 3
    && mb_stripos($textoCosmeticos, 'Te paso el valor según') === false
    && ($salidaCosmeticos[1] ?? '') === wabot_precio_imagen_marcador('ecommerce')
    && mb_stripos($salidaCosmeticos[2] ?? '', 'primer diseño') !== false,
    implode(' | ', $salidaCosmeticos));

todo_ok();
