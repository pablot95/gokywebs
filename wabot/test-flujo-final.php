<?php
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
// Flujo anterior con la función desactivada; test-postprecio cubre el flujo nuevo.
$cfg['postprecio_activo'] = false;

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
caso('al conocer el rubro manda exactamente dos mensajes: propuesta con las modalidades y oferta; los links al detalle ya no van (2-oct)', count($r) === 2, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la propuesta arranca "Para lo que me contás, te podemos armar", nunca "Lo mejor para"',
    str_starts_with($r[0] ?? '', 'Para lo que me contás, te podemos armar una tienda online completa, para vender directo desde la web')
    && mb_stripos($todo, 'Lo mejor para') === false, $r[0] ?? '');
caso('termina con las 2 modalidades y su monto; lo incluido de cada una queda para las páginas de detalle (22-sep, 29-sep; 3-oct)',
    str_ends_with($r[0] ?? '', modalidades_de_precio('$30.000', '$220.000'))
    && strpos($r[0] ?? '', 'Las 2 incluyen la web completa:') === false && mb_stripos($r[0] ?? '', 'pago único') === false
    && mb_stripos($todo, 'Son alternativas') === false, $r[0] ?? '');
caso('los links al detalle de las modalidades de la tienda (pago/mensual30000 y anual220) no van en el turno del precio (2-oct)',
    !in_array(links_de_precio('ecommerce'), $r, true) && strpos($todo, 'gokywebs.com/pago/') === false, $todo);
caso('el segundo mensaje ofrece el primer diseño sin cargo, atado a la tienda (26-sep), y pregunta, sin formulario',
    ($r[1] ?? '') === 'Si te interesa, te preparamos sin cargo un primer diseño de tu tienda online, así ves cómo quedaría y cómo se verían presentados tus productos antes de decidir. Querés que lo armemos?'
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
    count($rSi) === 1 && tiene_form($rSi) && str_starts_with($rSi[0], 'Para hacer la primera entrega gratuita de la web, solo tendrías que llenar este formulario, toma 2 minutos: https://gokywebs.com/form/'),
    json_encode($rSi, JSON_UNESCAPED_UNICODE));
caso('el formulario aclara que la entregamos en menos de 24 hs (21-sep; texto de Pablo del 2-oct)',
    mb_strpos($rSi[0] ?? '', 'La entregamos en menos de 24 hs') !== false, json_encode($rSi, JSON_UNESCAPED_UNICODE));
caso('y queda como prospecto, con el bot apagado y pendiente para Pablo',
    !empty($si['esProspecto']) && !empty($si['link_form_enviado']) && !empty($si['bot_off'])
    && !empty($si['handoff_pendiente']) && ($si['cierre'] ?? '') === 'cotizacion_final' && empty($si['oferta_diseno_ts']));
caso('después del formulario el bot no contesta nada más', turno('Listo, ya lo estoy llenando', $si, $cfg) === []);

$m = $c;
$rM = turno('Prefiero el plan anual', $m, $cfg);
caso('elegir una forma de pago también es avanzar: formulario', tiene_form($rM) && ($m['modalidad_elegida'] ?? '') === 'unico');
/* Las opciones salen numeradas, así que el cliente puede contestar el número
 * solo. Desde el 26-sep a la noche el número es el de la imagen que acaba de
 * ver: "1 plan mensual, 2 plan anual, 3 pago único" (las imágenes del 27-sep). */
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
    'oferta_diseno_ts' => time(), 'precio_cotizado' => '$89.000', 'sena_cotizada' => '$40.000', 'mensualidad_cotizada' => '$20.000',
    'precio_modelo' => 'anual', 'precio_cotizado_ts' => strtotime('2026-09-24 12:00:00 -03:00')]);
wabot_conv_transcript($cAntes, 'bot', "Para lo que me contás, te armamos un sitio profesional completo.\n\nPodés elegir entre tres opciones:\n\n"
    . "1. Plan anual: \$89.000 incluye mantenimiento\n2. Plan mensual: \$20.000 incluye mantenimiento\n3. Pago único: \$200.000 NO incluye mantenimiento*");
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
/* La que vio la imagen del 25 y el 26-sep ("01 plan mensual, 02 plan anual"):
 * su "1" es el mensual. */
$cMensualPrimero = conv_nueva('549110000MENSPRIMTEST', ['tipo' => 'landing', 'precio_dado' => true, 'fase' => 'prediseno', 'cta_muestra' => true,
    'oferta_diseno_ts' => time(), 'precio_cotizado' => '$160.000', 'sena_cotizada' => '$40.000', 'mensualidad_cotizada' => '$30.000',
    'precio_modelo' => 'anual', 'precio_cotizado_ts' => strtotime('2026-09-26 12:00:00 -03:00')]);
wabot_conv_transcript($cMensualPrimero, 'bot', "Para lo que me contás, te armamos un sitio profesional completo.\n\nPodés elegir una de estas 3 modalidades de pago:");
wabot_conv_transcript($cMensualPrimero, 'bot', '[Imagen: modalidades de pago]');
wabot_conv_transcript($cMensualPrimero, 'bot', wabot_tres_pasos_texto($cMensualPrimero, $cfg));
foreach (['1' => 'mensual', '2' => 'unico'] as $numero => $plan) {
    $n = $cMensualPrimero;
    clasifica(['otro']);
    $rN = turno((string)$numero, $n, $cfg);
    caso("en la charla que vio la imagen con el mensual primero, \"$numero\" elige {$nombrePlan[$plan]}",
        tiene_form($rN) && ($n['modalidad_elegida'] ?? '') === $plan, json_encode($rN, JSON_UNESCAPED_UNICODE));
}
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
echo "— Pedir ver el diseño también es un sí (28-sep, simulación con OpenAI) —\n";
foreach (['Dale, armame el diseño asi veo como queda', 'Dale, me interesa ver el primer diseño. Después elegiría el plan mensual.',
          'Keria ver cómo quedaría y el viernes te confirmo', 'Armame el diseño', 'Me interesa verlo', 'Quiero ver cómo queda',
          'Quiero ver el primer diseño', 'Hacelo así lo veo', 'Mandame la muestra', 'Quiero ver cómo quedaría',
          'Si me interesa pero resien el viernes cobro', 'Dale, pero te pago a fin de mes'] as $afirma) {
    $a = $c;
    clasifica(['otro']);
    $rA = turno($afirma, $a, $cfg);
    caso("\"$afirma\" → el formulario", count($rA) === 1 && tiene_form($rA) && !empty($a['bot_off']), json_encode($rA, JSON_UNESCAPED_UNICODE));
}
foreach (['Sí, me interesa ver el diseño gratis. Y quería saber cuánto sería por mes', 'Si me interesa pero yo cobro el viernes, puedo ver el diseño primero?',
          'Me interesa verlo pero es caro', 'Quiero ver el diseño pero lo tengo que consultar', 'No quiero ver el diseño todavía',
          'Keria aser unas consultas antes de pagar', 'Si, pero no tengo plata ahora'] as $resp) {
    $d = $c;
    clasifica(['otro']);
    $rD = turno($resp, $d, $cfg);
    caso("\"$resp\" → sigue siendo para Pablo", $rD === [] && !empty($d['handoff_pendiente']), json_encode($rD, JSON_UNESCAPED_UNICODE));
}

// El sí que llega después de una pregunta (el pintor): si Pablo no escribió, se lleva el formulario.
$d = $c;
clasifica(['otro']);
turno('Si me interesa pero yo cobro el viernes, puedo ver el diseño primero?', $d, $cfg);
$rTarde = turno('Keria ver cómo quedaría y el viernes te confirmo', $d, $cfg);
caso('pregunta y después "quería ver cómo quedaría" → el formulario en el segundo mensaje',
    count($rTarde) === 1 && tiene_form($rTarde) && !empty($d['bot_off']) && !empty($d['link_form_enviado']), json_encode($rTarde, JSON_UNESCAPED_UNICODE));
$d = $c;
turno('Si me interesa pero yo cobro el viernes, puedo ver el diseño primero?', $d, $cfg);
wabot_conv_transcript($d, 'humano', 'Sí, te lo armamos igual');
$rPablo = turno('Dale, armame el diseño', $d, $cfg);
caso('pero si Pablo ya contestó, la charla es suya: silencio', $rPablo === [] && empty($d['link_form_enviado']), json_encode($rPablo, JSON_UNESCAPED_UNICODE));
$d = $c;
turno('Cuánto tarda?', $d, $cfg);
$rOtra = turno('y aceptan transferencia?', $d, $cfg);
caso('y otra pregunta después de la pregunta sigue siendo para Pablo', $rOtra === [] && empty($d['link_form_enviado']));
// Postergar no es aceptar (28-sep, charla real de Ale: recibió el formulario).
foreach (['Dale, te vuelvo a escribir más tarde / mañana x favor', 'dale mañana te escribo', 'Ok, me comunico la semana que viene',
          'Me encanta déjame que lo consulto y me vuelvo a comunicar'] as $resp) {
    $d = $c;
    clasifica(['otro']);
    $rD = turno($resp, $d, $cfg);
    caso("\"$resp\" → posterga: para Pablo, sin formulario", $rD === [] && empty($d['link_form_enviado']), json_encode($rD, JSON_UNESCAPED_UNICODE));
}
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

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
caso('precio y oferta, sin los links ni el formulario pegado al monto (2-oct)',
    count($rA) === 2 && !tiene_form($rA) && mb_stripos($rA[1] ?? '', 'primer diseño') !== false
    && !in_array(links_de_precio('landing'), $rA, true), json_encode($rA, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
caso('y con el sí, el formulario', tiene_form(turno('si', $ca, $cfg)));

// Tienda, cursos e inmobiliaria cuestan lo mismo y comparten las páginas de detalle (pago/mensual30000, anual220; 3-oct).
$esperados = [
    'landing' => ['un sitio profesional completo', ['$20.000', '$140.000']],
    'inmobiliaria' => ['una web inmobiliaria completa', ['$30.000', '$220.000']],
    'elearning' => ['una plataforma de cursos completa', ['$30.000', '$220.000']],
];
foreach ($esperados as $tipo => [$frase, $montos]) {
    $ct = conv_nueva('549110000' . strtoupper($tipo) . 'TEST', ['fase' => 'menu']);
    $salida = wabot_pitch($tipo, $ct, $cfg);
    $primero = wabot_personalizar($salida[0] ?? '', $ct);
    caso("$tipo también usa su texto fijo y las 2 modalidades con su monto, sin los links de sus páginas (2-oct; 3-oct), y espera la respuesta",
        str_starts_with($primero, 'Para lo que me contás, te podemos armar ' . $frase)
        && str_ends_with($primero, modalidades_de_precio(...$montos))
        && !in_array(links_de_precio($tipo), $salida, true)
        && count($salida) === 2 && empty($ct['bot_off']) && !empty($ct['oferta_diseno_ts']), $primero);
}

/* Por Instagram sale igual que por WhatsApp (29-sep): la propuesta con las
 * modalidades (2 desde el 3-oct) y su monto y la oferta aparte (los links al
 * detalle ya no van desde el 2-oct). Hasta el 28-sep, sin imagen, la propuesta
 * llevaba la versión larga de las 3. */
$cIg = conv_nueva('ig549110000FINALTEST', ['fase' => 'menu', 'canal' => 'instagram']);
clasifica(['rubro_comercio']);
$rIg = turno('Vendo ropa', $cIg, $cfg);
$tIg = $cfg['tipos']['ecommerce'];
caso('por Instagram son dos mensajes, como por WhatsApp: la propuesta con las 2 modalidades y la oferta, sin los links (2-oct; 3-oct)',
    count($rIg) === 2 && !in_array(links_de_precio('ecommerce'), $rIg, true)
    && mb_stripos($rIg[1] ?? '', 'primer diseño') !== false && !tiene_form($rIg), json_encode($rIg, JSON_UNESCAPED_UNICODE));
caso('en el orden mensual, anual y con los montos de la lista, sin el pago único (3-oct)',
    mb_strpos($rIg[0] ?? '', "1. Mensual: {$tIg['mensualidad']} por mes") !== false
    && mb_strpos($rIg[0] ?? '', "2. Anual: {$tIg['precio']} por año") !== false
    && mb_stripos($rIg[0] ?? '', 'Pago único') === false && strpos($rIg[0] ?? '', $tIg['precio_unico']) === false, $rIg[0] ?? '');
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
caso('procedimiento + rubro claro manda solamente la cotización y la oferta, sin los links (2-oct)',
    count($salidaCosmeticos) === 2
    && mb_stripos($textoCosmeticos, 'Te paso el valor según') === false
    && !in_array(links_de_precio('ecommerce'), $salidaCosmeticos, true)
    && mb_stripos($salidaCosmeticos[1] ?? '', 'primer diseño') !== false,
    implode(' | ', $salidaCosmeticos));

echo "— Instagram: los textos largos llegan en partes de menos de 1000 bytes (28-sep) —\n";
/* La API de Instagram rechaza más de 1000 bytes. Hasta el 28-sep el precio iba
 * escrito con la versión larga de las 3 modalidades (~1090 bytes) y el cliente
 * recibía la oferta del diseño sin precio. Desde el 29-sep el turno del precio
 * son mensajes cortos (dos desde el 2-oct, sin los links al detalle). */
$ig = conv_nueva('igQATESTPARTES', ['canal' => 'instagram', 'channel_user_id' => 'igQATESTPARTES']);
$salidaIg = wabot_salida_preparar(wabot_precio('ecommerce', $ig, $cfg), $ig, $cfg);
caso('el turno del precio de Instagram ya entra sin cortar: dos mensajes de menos de 1000 bytes',
    count($salidaIg) === 2 && max(array_map('strlen', $salidaIg)) <= 1000, json_encode(array_map('strlen', $salidaIg)));
/* Ningún texto suelto del bot pasa hoy los 1000 bytes, pero las respuestas que
 * se juntan en un mismo mensaje sí (wabot_derivar_contestando las une con una
 * línea en blanco): acá, el resumen del precio, la respuesta de pago, lo que
 * incluye y el mantenimiento (desde el 3-oct, con 2 modalidades, el resumen y
 * el pago solos ya no llegan a los 1000 bytes). */
$largoIg = wabot_precio_resumen($ig, $cfg) . "\n\n" . $cfg['info']['pago'] . "\n\n" . $cfg['info']['que_incluye']
    . "\n\n" . $cfg['info']['mantenimiento'];
$esperadoIg = wabot_variar_muletilla(wabot_personalizar($largoIg, $ig), $ig);
caso('varias respuestas juntas en Instagram pasan los 1000 bytes: por eso hace falta cortarlas', strlen($esperadoIg) > 1000, (string)strlen($esperadoIg));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$okIg = wabot_enviar($ig, $largoIg);
$partesIg = array_map(function ($e) { return (string)$e[1]; }, (array)$GLOBALS['WABOT_TEST_ENVIADOS']);
caso('salen en partes de hasta 1000 bytes, sin perder nada y sin cortar palabras',
    $okIg && count($partesIg) >= 2 && max(array_map('strlen', $partesIg)) <= 1000
    && implode("\n\n", $partesIg) === $esperadoIg,
    json_encode(array_map('strlen', $partesIg)));
caso('un texto corto sigue saliendo en un solo mensaje', wabot_ig_partes('Hola, qué tal?') === ['Hola, qué tal?']);
caso('un párrafo enorme sin renglones se corta entre palabras', count(wabot_ig_partes(str_repeat('palabra ', 400))) >= 3
    && max(array_map('strlen', wabot_ig_partes(str_repeat('palabra ', 400)))) <= 950);

todo_ok();
