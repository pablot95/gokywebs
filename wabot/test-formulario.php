<?php
/**
 * wabot/test-formulario.php — cuándo sale el formulario y qué pasa cuando llega (solo CLI).
 *
 * Parte A (flujo): qué es un sí a la demo, los tres pasos terminan preguntando
 * si la quiere, el motor solo manda el link con el sí, y con el link mandado
 * el sí repetido, los datos por chat y "ya lo llené" se contestan sin modelo.
 * Parte B (form-lead): el formulario web ↔ boceto, sin pegarle a Firestore ni
 * a WhatsApp real: el código corto, el mismo abonado escrito de dos formas,
 * Instagram → formulario → WhatsApp como un solo cliente.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['form_activo'] = true;

/** Charla recién cotizada: precio y tres pasos dados, esperando el sí. */
function conv_tres_pasos($tel, $tipo, $cfg) {
    $c = conv_nueva($tel);
    wabot_conv_transcript($c, 'cliente', 'hola, necesito una web');
    foreach (wabot_pitch($tipo, $c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
    return $c;
}

/** Charla con el link ya mandado, como quedó V08 después de "Vestidos y conjuntos". */
function conv_con_link($tel, $cfg) {
    $c = conv_tres_pasos($tel, 'ecommerce', $cfg);
    $c['descripcion'] = 'indumentaria femenina, vestidos y conjuntos';
    foreach ((array)wabot_prediseno_texto($c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
    return $c;
}

echo "— 1. Qué es un sí a la demo —\n";

foreach (['si', 'Sí!', 'Si dale, armenla', 'Si, quiero la muestra gratis', 'dale', 'ok', 'dale, mandame el formulario',
          'pasame el link', 'sí por favor', 'me interesa', 'quiero la demo', 'de una', 'obvio', 'Sí, ármenla porfa',
          'bueno dale', 'si quiero', 'armenla', 'genial, avancemos', '👍', 'Perfecto', 'sii prepárenla', 'quiero'] as $si) {
    caso("\"$si\" es un sí", wabot_acepta_demo($si));
}
foreach (['Vestidos y conjuntos', 'Consultas y vacunacion', 'Reservas online', 'Clases grupales',
          'Detergentes y suavizantes', 'No tengo mas nada que agregar, es alquiler de equipos',
          'si tengo 50 productos', 'si quiero vender también ropa', 'no por ahora', 'lo voy a pensar',
          'después te aviso', 'Lo voy a charlar con mi pareja y despues te escribo, gracias', 'gracias',
          'Uh esta caro para mi ahora, no puedo pagar eso', 'dale, cuánto tarda la demo?', 'vamos a ver'] as $no) {
    caso("\"$no\" no es un sí", !wabot_acepta_demo($no));
}
caso('"Sí, cuánto tarda?" acepta y pregunta', wabot_acepta_demo('Sí, cuánto tarda?', true));
caso('pero "cuánto tarda?" solo es una pregunta', !wabot_acepta_demo('cuánto tarda?', true));
foreach (['ya esta todo arriba, fijate', 'ya lo completé', 'listo, ya lo llené', 'ya te mandé los datos',
          'el formulario ya está completado', 'ahí lo envié'] as $dice) {
    caso("\"$dice\" dice que completó el formulario", wabot_dice_que_completo_form($dice));
}
foreach (['listo', 'ok', 'ya te dije que vendo ropa', 'dale'] as $noDice) {
    caso("\"$noDice\" no dice que lo completó", !wabot_dice_que_completo_form($noDice));
}
foreach (['Hola! Quiero mi demo gratis para mi negocio.', 'Dale, me interesa la muestra gratis', 'armame la muestra', 'igual mandame la demo asi la veo tranquila'] as $frase) {
    caso("\"$frase\" pide la demo con todas las letras", wabot_pidio_demo_explicita($frase) === true);
}
caso('"me pasas el precio?" y "la demo hasta cuándo me dura?" no la piden',
    wabot_pidio_demo_explicita('me pasas el precio?') === false && wabot_pidio_demo_explicita('la demo hasta cuando me dura?') === false);

echo "— 2. El precio ofrece el primer diseño (18-sep) —\n";

$c = conv_nueva('5491188880001TEST');
$r = wabot_pitch('landing', $c, $cfg);
caso('el tercer mensaje ofrece el primer diseño sin cargo', mb_stripos($r[2] ?? '', 'sin cargo un primer diseño') !== false, $r[2] ?? '');
caso('y termina preguntando si lo armamos', str_ends_with($r[2] ?? '', 'Querés que lo armemos?'), $r[2] ?? '');
caso('sin el link: ese sale con el sí', !tiene_form($r));
$c = conv_nueva('5491188880002TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('un anuncio viejo de demo también ve el precio y espera una aceptación actual',
    count($r) === 3 && mb_stripos($r[2], 'primer diseño') !== false && !tiene_form($r),
    json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y todavía no marca el formulario como enviado', empty($c['link_form_enviado']));

echo "— 3. El motor manda el link solo con el sí —\n";

$c = conv_tres_pasos('5491188880010TEST', 'landing', $cfg);
clasifica(['otro']);
$r = wabot_engine('Reservas online', $c, $cfg);
caso('"Reservas online" no se lleva el pedido de colores por chat', stripos(implode(' ', $r), 'colores') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('ni el formulario', !tiene_form($r) && empty($c['link_form_enviado']));
caso('se toma y se vuelve a preguntar si quiere la demo', ($r[0] ?? '') === wabot_tres_pasos_repregunta_texto(), json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
$r = wabot_engine('Si dale, armenla', $c, $cfg);
caso('"Si dale, armenla" después se lleva el formulario', tiene_form($r) && !empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_tres_pasos('5491188880011TEST', 'ecommerce', $cfg);
$respuestas = [];
foreach (['Vestidos y conjuntos', 'Tengo local en Palermo', 'Hacemos envios a todo el pais'] as $m) {
    clasifica(['otro']);
    $respuestas[] = wabot_salida_preparar(wabot_engine($m, $c, $cfg), $c, $cfg);
}
caso('tres datos seguidos sin contestar: pregunta una vez, deja la puerta abierta y después se calla',
    ($respuestas[0][0] ?? '') === wabot_tres_pasos_repregunta_texto()
    && strpos($respuestas[1][0] ?? '', 'avisame y te paso el formulario') !== false && $respuestas[2] === [],
    json_encode($respuestas, JSON_UNESCAPED_UNICODE));
caso('y nunca deriva ni manda el link', ($c['fase'] ?? '') === 'prediseno' && empty($c['link_form_enviado']));

$c = conv_tres_pasos('5491188880012TEST', 'landing', $cfg);
clasifica(['otro']);
$r = wabot_engine('no', $c, $cfg);
caso('un "no" a la demo cierra sin presión, sin mandar el formulario', !tiene_form($r) && ($c['cierre'] ?? '') === 'consulta_sin_presion',
    json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_tres_pasos('5491188880013TEST', 'landing', $cfg);
clasifica(['otro']);
$r = wabot_engine('y mi cuñado puede editarla desde su casa?', $c, $cfg);
caso('una pregunta en el prediseño que nada supo contestar no se lleva el formulario: queda para el desarrollador',
    !tiene_form($r) && $r === [(string)$cfg['info']['otra']] && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));

/* El "Ok dale" pelado tras el precio y una duda (chat real: precio → mantenimiento → "Ok dale" → derivaba). */
$c = conv_nueva('5491188880014TEST');
clasifica(['rubro_landing']);
wabot_engine('soy plomero', $c, $cfg);
clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
wabot_engine('Por mes cuanto tengo que pagar', $c, $cfg);
clasifica(['quiere_avanzar']);
$r = wabot_engine('Ok dale', $c, $cfg);
caso('"Ok dale" tras el precio no deriva y recibe el formulario',
    $c['fase'] === 'prediseno' && tiene_form($r) && implode(' ', $r) !== (string)$cfg['prediseno_espera']);

echo "— 4. Con el link ya mandado —\n";

/* Desde el 18-sep, en la charla real el formulario sale con el sí y el bot
 * se apaga (lo sigue Pablo): después del link no contesta nada más. */
$c = conv_tres_pasos('5491188880030TEST', 'ecommerce', $cfg);
clasifica(['otro']);
$r = turno('Si, quiero la muestra gratis', $c, $cfg);
caso('"Sí, quiero la muestra gratis" después de la oferta recibe el formulario de la charla',
    count($r) === 1 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y queda como prospecto para que siga Pablo', ($c['fase'] ?? '') === 'derivado' && !empty($c['esProspecto']) && !empty($c['bot_off']));
foreach (['si quiero la demo', 'Malena - IndumentariaMale - negro y dorado', 'ya esta todo arriba, fijate', 'Ya completé todo, te llegó?'] as $m) {
    caso("después del formulario, \"$m\" no recibe respuesta automática", turno($m, $c, $cfg) === []);
}
caso('y los datos quedan pendientes para Pablo', !empty($c['handoff_pendiente']));

/* wabot_form_enviado_responder() sigue siendo el que contesta si Pablo vuelve
 * a prender el bot en una charla con el link mandado: se prueba directo. */
$c = conv_con_link('5491188880031TEST', $cfg);
caso('(la charla de prueba tiene el link mandado)', !empty($c['link_form_enviado']) && $c['fase'] === 'prediseno');
$r = wabot_form_enviado_responder('ya esta todo arriba, fijate', $c, $cfg);
caso('"ya está todo arriba" sin el formulario recibido: se le avisa que no llegó, con el link',
    strpos($r[0] ?? '', 'Todavía no me llegó el formulario') === 0 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('sin derivar', ($c['fase'] ?? '') === 'prediseno');
$r = wabot_form_enviado_responder('ya lo complete, fijate bien', $c, $cfg);
caso('si insiste, algo anda mal con el formulario: lo toma una persona', ($c['fase'] ?? '') === 'derivado', json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_con_link('5491188880032TEST', $cfg);
$c['form_completado_ts'] = time(); $c['lead_creado'] = 'propuestas/test';
wabot_handoff_marcar($c, 'prediseno');
$r = wabot_form_enviado_responder('ya lo complete, fijate', $c, $cfg);
caso('con el formulario recibido, "ya lo completé" se confirma con la entrega',
    strpos($r[0] ?? '', 'Sí, ya lo tengo: la demo te llega') === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$r = wabot_form_enviado_responder('ya esta todo arriba', $c, $cfg);
caso('y una sola vez', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ([false, true] as $recibido) {
    $c = conv_con_link('5491188880035TEST', $cfg);
    $c['form_completado_ts'] = $recibido ? time() : 0;
    $r = (array)wabot_form_enviado_responder('Ya completé todo, te llegó?', $c, $cfg);
    caso('consulta recepción con formulario ' . ($recibido ? 'recibido' : 'pendiente'),
        strpos(implode(' ', $r), $recibido ? 'Sí, ya lo tengo' : 'Todavía no me llegó el formulario') !== false
        && ($c['fase'] ?? '') !== 'derivado', json_encode($r, JSON_UNESCAPED_UNICODE));
}
caso('el aviso de formulario no tapa una pregunta distinta',
    !wabot_form_pregunta_recepcion('Ya completé todo, te llegó? Cuánto tarda la demo?'));

$c = conv_con_link('5491188880034TEST', $cfg);
$c['nombre_negocio'] = 'IndumentariaMale'; $c['colores'] = 'negro y dorado';
caso('con los datos ya sabidos, una pregunta no se cierra encima: queda para quien la conteste',
    wabot_form_enviado_responder('el dominio viene incluido?', $c, $cfg) === null
    && !in_array('prediseno_datos_por_chat', array_keys((array)($c['eventos_emitidos_sesion'] ?? [])), true));

echo "— 5. Repetirse con el formulario de por medio no deriva —\n";

$c = conv_con_link('5491188880040TEST', $cfg);
$texto = 'Perfecto, quedo atento.';
$c['tandas_bot'] = [wabot_normalizar_frase($texto)];
$r = wabot_anti_repeticion([$texto], $c, $cfg);
caso('con el link mandado, un texto repetido se calla en vez de derivar', $r === [] && ($c['fase'] ?? '') === 'prediseno',
    json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_tres_pasos('5491188880041TEST', 'landing', $cfg);
$c['tandas_bot'] = [wabot_normalizar_frase($texto)];
$r = wabot_anti_repeticion([$texto], $c, $cfg);
caso('y esperando el sí a la demo, también', $r === [] && ($c['fase'] ?? '') === 'prediseno', json_encode($r, JSON_UNESCAPED_UNICODE));
$cEsp = conv_nueva('5491188880042TEST', ['fase' => 'prediseno', 'tipo' => 'landing', 'precio_dado' => true, 'cta_muestra' => true, 'link_form_enviado' => true]);
$e1 = wabot_anti_repeticion([(string)$cfg['prediseno_espera']], $cEsp, $cfg);
$e2 = wabot_anti_repeticion([(string)$cfg['prediseno_espera']], $cEsp, $cfg);
caso('"cuando completes el formulario" repetido se calla en vez de derivar', $e1 !== [] && $e2 === [] && $cEsp['fase'] === 'prediseno');
$cLink = ['link_form_enviado' => true];
foreach (['ah ok, dale lo completo', 'gracias', 'perfecto', 'ok'] as $acuse) {
    caso("\"$acuse\" no hace repetir el link", wabot_link_form_ya_enviado($cLink, $acuse) === true);
}
foreach (['y la demo esa como es? me la podes hacer?', 'mandamelo de nuevo', 'no me llega el link', 'quiero la demo'] as $pide) {
    caso("\"$pide\" sí vuelve a mandar el link", wabot_link_form_ya_enviado($cLink, $pide) === false);
}
caso('y con el lead ya creado el guard no aplica', wabot_link_form_ya_enviado(['link_form_enviado' => true, 'lead_creado' => true], 'hola') === false);

echo "— 6. El texto del formulario —\n";

$c = conv_nueva('5491166660010TEST');
foreach (wabot_pitch('ecommerce', $c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
$form = wabot_prediseno_texto($c, $cfg);
caso('el texto auxiliar del formulario usa la redacción nueva (primer diseño 18-sep, 24 hs y sin la coletilla de las dudas, 21-sep)',
    preg_match('/^Dale\. Para prepararte el primer diseño completá este formulario:\nhttps:\/\/gokywebs\.com\/form\/\S+\nUna vez que lo completes, va a estar listo en menos de 24 hs\.$/u', $form) === 1, $form);
$salida = wabot_salida_preparar([$form], $c, $cfg);
caso('y sale sin "Es gratis y sin compromiso." pegado al final', mb_stripos(end($salida), 'sin compromiso') === false, json_encode($salida, JSON_UNESCAPED_UNICODE));
caso('ni promete un minuto', mb_stripos($form, 'minuto') === false);
caso('el texto contiene un único enlace al formulario', substr_count($form, 'gokywebs.com/form/') === 1);
$cierre = 'Listo, con eso ya lo preparamos. Para que la demo sea tuya de verdad y no una genérica, mandame el logo y fotos de tus productos, aunque sean 4 o 5 para arrancar. Con eso te la dejo lista mañana.';
caso('el cierre del prediseño tampoco se lleva la coletilla', wabot_demo_siempre_gratis([$cierre], $cfg) === [$cierre]);
foreach ([0, 1] as $imagenes) {
    $cI = conv_nueva('5491166660011TEST', ['tipo' => 'landing', 'imagenes_recibidas' => $imagenes]);
    if ($imagenes) $cI['transcript'][] = ['q' => 'cliente', 't' => '[foto] Mandó el logo de su marca', 'ts' => time(), 'media' => ['clase' => 'imagen', 'archivo' => 'logo-test.jpg']];
    $rI = wabot_texto_prediseno_completo($cI, $cfg);
    caso("las fotos son opcionales con $imagenes imágenes previas", strpos($rI, 'podemos empezar igual') !== false
        && strpos($rI, 'para personalizarla') !== false && strpos($rI, '{imagenes}') === false, $rI);
}

echo "— 7. wabot_form_link() y el código corto —\n";

$convWsp = ['tel' => '5491122334455TEST', 'channel_user_id' => '5491122334455TEST', 'canal' => 'whatsapp', 'nombre_negocio' => 'Panadería Sur'];
$link = wabot_form_link($convWsp, $cfg);
caso('arma la URL con el código corto de dos caracteres en ?c=', (bool)preg_match('~^https://gokywebs\.com/form/\?c=[A-Z0-9]{2}$~', $link));
caso('y el teléfono NO viaja en el link', strpos($link, '5491122334455') === false);
caso('el código queda guardado en la conversación', ($convWsp['codigo'] ?? '') !== '' && strpos($link, $convWsp['codigo']) !== false);
caso('y es estable: pedirlo de nuevo devuelve el mismo', wabot_form_link($convWsp, $cfg) === $link);
$cfgFormOff = $cfg; $cfgFormOff['form_activo'] = false;
$convWspOff = ['tel' => '5491122334466TEST', 'channel_user_id' => '5491122334466TEST', 'canal' => 'whatsapp'];
caso('con el form apagado, no da link', wabot_form_link($convWspOff, $cfgFormOff) === '');
caso('el formulario está activo por defecto', !empty(wabot_config_load()['form_activo']));
caso('normalizar saca lo que no es del alfabeto y pasa a mayúsculas', wabot_codigo_normalizar(' a-b c ') === 'ABC');
caso('los caracteres ambiguos NO se remapean a otro código válido', wabot_codigo_normalizar('0O1IL') === '');
caso('buscar con un código ilegible no devuelve ninguna conversación', wabot_codigo_buscar('0O1IL') === '' && wabot_codigo_buscar('') === '');
caso('dos conversaciones distintas no comparten código',
    (function () {
        $a = ['tel' => 'TESTCOD1', 'channel_user_id' => 'TESTCOD1', 'canal' => 'whatsapp'];
        $b = ['tel' => 'TESTCOD2', 'channel_user_id' => 'TESTCOD2', 'canal' => 'whatsapp'];
        return wabot_codigo_asignar($a) !== wabot_codigo_asignar($b);
    })());
caso('un código que no existe no valida', wabot_form_lead_validar(['c' => 'ZZZ', 'nombre' => 'A', 'nombre_negocio' => 'B', 'resumen' => 'C', 'colores' => 'D']) === null);
$convIg = ['tel' => 'IG1', 'channel_user_id' => 'IG1', 'canal' => 'instagram'];
$linkIg = wabot_form_link($convIg, $cfg);
caso('en Instagram también sale el link del formulario, y avisa que ahí hay que pedir el WhatsApp',
    strpos($linkIg, '/form/?c=') !== false && strpos($linkIg, '&ig=1') !== false);
$convWsp1 = ['tel' => 'TESTWSP1', 'channel_user_id' => 'TESTWSP1', 'canal' => 'whatsapp'];
caso('en WhatsApp el link sigue sin esa marca', strpos(wabot_form_link($convWsp1, $cfg), '&ig=1') === false);
$convSinTel = ['tel' => '', 'channel_user_id' => '', 'canal' => 'whatsapp'];
caso('ni sin teléfono', wabot_form_link($convSinTel, $cfg) === '');
$cForm = wabot_conv_load('QATESTFORM1'); $cForm['form_completado_ts'] = time();
caso('con el formulario ya completado, no vuelve a dar link', wabot_form_link($cForm, $cfg) === '');
caso('el aviso que manda el propio formulario se reconoce, incluso con los emojis rotos',
    wabot_texto_es_aviso_de_formulario("Hola! Acabo de completar el formulario de la demo gratis.\n\n🙋 Nombre: Natalia\n🏢 Negocio: Secretos Compartidos") === true
    && wabot_texto_es_aviso_de_formulario("Hola! Acabo de completar el formulario de la demo gratis.\n\n\u{FFFD} Nombre: Natalia\n\u{FFFD} Negocio: Secretos Compartidos") === true
    && wabot_texto_es_aviso_de_formulario('Hola, quería consultar por el formulario que me mandaste') === false);

$claveIg = 'ig17841400000000000';
$idxPath = wabot_codigo_indice_path();
$idxPrevio = @file_get_contents($idxPath);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(), ['K7' => $claveIg])));
$datosIg = wabot_form_lead_validar(['c' => 'K7', 't' => '1123456789', 'nombre' => 'Ana', 'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']);
caso('la charla sigue siendo la de Instagram, no el teléfono', is_array($datosIg) && $datosIg['clave'] === $claveIg);
caso('y el WhatsApp tipeado queda como dato aparte', is_array($datosIg) && $datosIg['telWsp'] === '1123456789');
caso('sin WhatsApp no se acepta: el boceto llegaría sin destinatario',
    wabot_form_lead_validar(['c' => 'K7', 'nombre' => 'Ana', 'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']) === null);
if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);

$claveWsp = '5491167134135';
$idxPrevio = @file_get_contents($idxPath);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(), ['K8' => $claveWsp])));
$mismoNumero = ['c' => 'K8', 't' => '1167134135', 'nombre' => 'Silvia', 'nombre_negocio' => 'Cuidar+', 'resumen' => 'Cuidados a domicilio', 'colores' => 'crema y verde'];
$datosWsp = wabot_form_lead_validar($mismoNumero);
caso('el mismo número escrito sin el 549 no abre otra conversación', is_array($datosWsp) && $datosWsp['clave'] === $claveWsp);
caso('y no se guarda como WhatsApp aparte', is_array($datosWsp) && $datosWsp['telWsp'] === '');
$datosCorr = wabot_form_lead_validar(array_merge($mismoNumero, ['t' => '3814002001']));
caso('un número de OTRO abonado sigue siendo una corrección, no una clave nueva',
    is_array($datosCorr) && $datosCorr['clave'] === $claveWsp && $datosCorr['telWsp'] === '3814002001');
if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);

@unlink(WABOT_DATA . '/conv/5493810004001.json');
caso('sin código y sin charla previa, la clave es lo que tipeó',
    (wabot_form_lead_validar(['t' => '3810004001', 'nombre' => 'Ana', 'nombre_negocio' => 'B', 'resumen' => 'C', 'colores' => 'D'])['clave'] ?? '') === '3810004001');
wabot_conv_save(wabot_conv_load('5493810004001'));
caso('sin código pero con la charla ya abierta, cae en la charla',
    (wabot_form_lead_validar(['t' => '3810004001', 'nombre' => 'Ana', 'nombre_negocio' => 'B', 'resumen' => 'C', 'colores' => 'D'])['clave'] ?? '') === '5493810004001');
@unlink(WABOT_DATA . '/conv/5493810004001.json');
caso('mismo abonado escrito de las dos formas', wabot_mismo_abonado('1167134135', '5491167134135') && wabot_mismo_abonado('3814002001', '5493814002001'));
caso('dos números distintos no se confunden', !wabot_mismo_abonado('1167134135', '5493814002001'));

echo "— 8. wabot_form_lead_procesar(): validación y freno por IP —\n";

$rK = wabot_form_lead_procesar(['t' => '123', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => 'X', 'colores' => 'X'], $cfg);
caso('rechaza sin teléfono válido, y dice que fue el teléfono', $rK['ok'] === false && ($rK['motivo'] ?? '') === 'telefono' && ($rK['campo'] ?? '') === 'telefono');
$rK = wabot_form_lead_procesar(['t' => '5493810001001', 'nombre' => 'X', 'nombre_negocio' => '', 'resumen' => 'X', 'colores' => 'X'], $cfg);
caso('campo vacío: dice cuál', $rK['ok'] === false && ($rK['motivo'] ?? '') === 'vacio' && ($rK['campo'] ?? '') === 'nombre_negocio');
$rK = wabot_form_lead_procesar(['t' => '5493810001002', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => str_repeat('a', 601), 'colores' => 'X'], $cfg);
caso('resumen largo: dice el campo y el máximo', $rK['ok'] === false && ($rK['motivo'] ?? '') === 'largo' && ($rK['campo'] ?? '') === 'resumen' && ($rK['max'] ?? 0) === 600);
@unlink(WABOT_DATA . '/form-rate.json');
$okRate = true;
for ($i = 0; $i < 10; $i++) $okRate = $okRate && wabot_form_rate_ok('203.0.113.9', 10, 600, 1000000 + $i);
caso('10 envíos en 10 minutos pasan', $okRate);
caso('el 11° no', wabot_form_rate_ok('203.0.113.9', 10, 600, 1000011) === false);
caso('otra IP no se ve afectada', wabot_form_rate_ok('203.0.113.10', 10, 600, 1000011) === true);
caso('pasada la ventana, vuelve a pasar', wabot_form_rate_ok('203.0.113.9', 10, 600, 1000000 + 700) === true);
caso('sin IP no frena', wabot_form_rate_ok('', 10, 600) === true);
@unlink(WABOT_DATA . '/form-rate.json');

echo "— 9. Sin código, el formulario no pisa una charla que ya existe —\n";

@unlink(WABOT_DATA . '/conv/5493810003001.json');
$victima = wabot_conv_load('5493810003001');
$victima['transcript'] = [['q' => 'cliente', 't' => 'Hola, tengo una panadería', 'ts' => time() - 500]];
$victima['ultimo_cliente_ts'] = time() - 500;
$victima['nombre'] = 'Rosa'; $victima['nombre_negocio'] = 'Panadería Sur';
$victima['descripcion'] = 'Panadería artesanal'; $victima['colores'] = 'marrón y crema';
$victima['form_completado_ts'] = time() - 400;
wabot_conv_save($victima);
$rF = wabot_form_lead_procesar(['t' => '3810003001', 'nombre' => 'Atacante', 'nombre_negocio' => 'Otro', 'resumen' => 'Descripción pisada', 'colores' => 'negro'], $cfg);
$victimaDespues = wabot_conv_load('5493810003001');
caso('con formulario previo: el envío se acepta pero NO se aplica', ($rF['ok'] ?? false) === true && ($rF['aplicado'] ?? true) === false);
caso('la descripción y los colores quedan como estaban',
    $victimaDespues['descripcion'] === 'Panadería artesanal' && $victimaDespues['colores'] === 'marrón y crema'
    && $victimaDespues['nombre'] === 'Rosa' && $victimaDespues['nombre_negocio'] === 'Panadería Sur');
caso('y lo enviado queda en el transcript para el desarrollador', strpos(json_encode($victimaDespues['transcript'], JSON_UNESCAPED_UNICODE), 'NO aplicado') !== false);
@unlink(WABOT_DATA . '/conv/5493810003001.json');

@unlink(WABOT_DATA . '/conv/5493810003002.json');
$parcial = wabot_conv_load('5493810003002');
$parcial['transcript'] = [['q' => 'cliente', 't' => 'Hola, tengo una panadería', 'ts' => time() - 500]];
$parcial['ultimo_cliente_ts'] = time() - 500;
$parcial['descripcion'] = 'Panadería artesanal en Caballito';
wabot_conv_save($parcial);
$rF2 = wabot_form_lead_procesar(['t' => '3810003002', 'nombre' => 'Rosa', 'nombre_negocio' => 'Panadería Sur', 'resumen' => 'Otra descripción', 'colores' => 'marrón'], $cfg);
$parcialDespues = wabot_conv_load('5493810003002');
caso('con chat pero sin formulario previo: completa lo que falta', ($rF2['ok'] ?? false) === true
    && $parcialDespues['nombre'] === 'Rosa' && $parcialDespues['nombre_negocio'] === 'Panadería Sur' && $parcialDespues['colores'] === 'marrón');
caso('...pero no pisa lo que el cliente ya contó por chat', $parcialDespues['descripcion'] === 'Panadería artesanal en Caballito');
caso('...y el lead se crea igual', !empty($parcialDespues['lead_creado']));
@unlink(WABOT_DATA . '/conv/5493810003002.json');

@unlink(WABOT_DATA . '/conv/5493810003003.json');
$propia = wabot_conv_load('5493810003003');
$propia['transcript'] = [['q' => 'cliente', 't' => 'Hola', 'ts' => time() - 500]];
$propia['ultimo_cliente_ts'] = time() - 500;
$propia['descripcion'] = 'vieja'; $propia['form_completado_ts'] = time() - 400;
wabot_conv_save($propia);
$idxPrevio = @file_get_contents($idxPath);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(), ['JZ' => '5493810003003'])));
$rF3 = wabot_form_lead_procesar(['c' => 'JZ', 't' => '3810003003', 'nombre' => 'Rosa', 'nombre_negocio' => 'Panadería Sur', 'resumen' => 'Descripción nueva del propio cliente', 'colores' => 'marrón'], $cfg);
caso('con código sí actualiza la charla', ($rF3['ok'] ?? false) === true && wabot_conv_load('5493810003003')['descripcion'] === 'Descripción nueva del propio cliente');
if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);
@unlink(WABOT_DATA . '/conv/5493810003003.json');

echo "— 10. Sin chat previo, el brief refleja lo tipeado; reenviar no duplica —\n";

@unlink(WABOT_DATA . '/conv/5493810002001.json');
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
caso('el envío se acepta', $r['ok'] === true);
// El aviso a Pablo por WhatsApp de un lead nuevo se sacó (25-sep): fallaba
// seguido con "ventana de 24h cerrada" (131047) porque ese número no le
// escribe al bot, y el panel + el push ya avisan sin depender de esa ventana.
caso('ya no manda ningún WhatsApp al procesar el formulario', ($GLOBALS['WABOT_TEST_ENVIADOS'] ?? []) === []);
$conv = wabot_conv_load('5493810002001');
caso('el nombre de la persona queda confirmado', $conv['nombre'] === 'Carla' && !empty($conv['nombre_confirmado']));
caso('el negocio, la descripción y los colores quedan anotados',
    $conv['nombre_negocio'] === 'Carla Deco' && $conv['descripcion'] === 'Vendo objetos de decoración hechos a mano' && $conv['colores'] === 'Beige y dorado');
caso('queda marcado el origen y el boceto se cierra igual que por chat',
    $conv['origen_prediseno'] === 'form' && $conv['fase'] === 'derivado' && !empty($conv['lead_creado']));
caso('el brief NO queda vacío', !empty($conv['brief']) && $conv['brief']['marca'] === 'Carla Deco');
caso('queda una sola línea de transcript, de sistema', count($conv['transcript']) === 1 && $conv['transcript'][0]['q'] === 'sistema');
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r2 = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
$conv2 = wabot_conv_load('5493810002001');
caso('el reenvío se acepta, no duplica el transcript ni vuelve a avisarle a Pablo',
    $r2['ok'] === true && count($conv2['transcript']) === 1 && ($GLOBALS['WABOT_TEST_ENVIADOS'] ?? []) === []);
@unlink(WABOT_DATA . '/conv/5493810002001.json');

@unlink(WABOT_DATA . '/conv/5493810002002.json');
$convPrevio = wabot_conv_load('5493810002002');
$convPrevio['transcript'] = [['q' => 'cliente', 't' => 'Hola, tengo una florería', 'ts' => time() - 100]];
$convPrevio['ultimo_cliente_ts'] = time() - 100;
wabot_conv_save($convPrevio);
wabot_form_lead_procesar(['t' => '5493810002002', 'nombre' => 'Marta', 'nombre_negocio' => 'Flores Marta', 'resumen' => 'Florería de barrio', 'colores' => 'Verde y blanco'], $cfg);
caso('con chat real previo, el brief queda vacío para que corra wabot_resumen_negocio()', empty(wabot_conv_load('5493810002002')['brief']));
@unlink(WABOT_DATA . '/conv/5493810002002.json');

echo "— 11. Instagram → formulario → WhatsApp: un solo lead —\n";

$igNat = wabot_conv_load('igQATESTNATALIA1');
$igNat['canal'] = 'instagram';
$igNat['telefono_wsp'] = '2494691266';
$igNat['nombre'] = 'Natalia'; $igNat['nombre_confirmado'] = true;
$igNat['nombre_negocio'] = 'Secretos Compartidos';
$igNat['descripcion'] = 'Ofrecemos prendas femeninas de calidad para diferentes edades y estilos';
$igNat['colores'] = 'Color principal: #ffffff'; $igNat['tipo'] = 'ecommerce';
$igNat['precio_dado'] = true; $igNat['pitch_hecho'] = true; $igNat['cta_muestra'] = true;
$igNat['lead_creado'] = true; $igNat['form_completado_ts'] = time(); $igNat['fase'] = 'prediseno';
wabot_conv_save($igNat);
caso('la conversación de WhatsApp encuentra a su hermana de Instagram por el telefono_wsp', wabot_conv_hermana('5492494691266') === 'igQATESTNATALIA1');
$wspNat2 = wabot_conv_load('5492494691266');
caso('y adopta lo que ella ya había dejado allá', wabot_conv_adoptar_hermana($wspNat2, $cfg) === true);
caso('trae la descripción, el tipo, el precio, lead_creado y form_completado_ts',
    mb_stripos((string)$wspNat2['descripcion'], 'prendas femeninas') !== false && ($wspNat2['tipo'] ?? '') === 'ecommerce'
    && !empty($wspNat2['precio_dado']) && !empty($wspNat2['lead_creado']) && (int)($wspNat2['form_completado_ts'] ?? 0) > 0);
caso('con eso, el formulario ya no se le vuelve a ofrecer', wabot_form_link($wspNat2, $cfg) === '');
caso('la adopción ocurre una sola vez', wabot_conv_adoptar_hermana($wspNat2, $cfg) === false);
$wspTurno = wabot_conv_load('5492494691266');
$msgForm = "Hola! Acabo de completar el formulario de la demo gratis.\n\n\u{FFFD} Nombre: Natalia\n\u{FFFD} Negocio: Secretos Compartidos\n\nQuedo atento/a!";
wabot_conv_transcript($wspTurno, 'cliente', $msgForm);
$wspTurno['ultimo_cliente_ts'] = time();
clasifica(['otro']);
$rTurno = wabot_responder($msgForm, $wspTurno, $cfg);
caso('la adopción corre igual con el mensaje ya escrito por el webhook', !empty($wspTurno['hermana_adoptada']));
caso('el aviso del formulario lo contesta el texto oficial, sin volver a preguntar por el negocio ni mandar otro formulario',
    is_array($rTurno) && count($rTurno) === 1 && mb_stripos($rTurno[0], 'ya quedó todo anotado') !== false
    && mb_stripos($rTurno[0], 'contame') === false && !tiene_form($rTurno), json_encode($rTurno, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/igQATESTNATALIA1.json');
@unlink(WABOT_DATA . '/conv/5492494691266.json');
$vacia1 = wabot_conv_load('5491199887766'); wabot_conv_save($vacia1);
$vacia2 = wabot_conv_load('igQATESTVACIA1'); $vacia2['canal'] = 'instagram'; $vacia2['telefono_wsp'] = '1199887766'; wabot_conv_save($vacia2);
$vacia1b = wabot_conv_load('5491199887766');
caso('sin formulario ni boceto del otro lado, no se adopta nada', wabot_conv_adoptar_hermana($vacia1b, $cfg) === false);
@unlink(WABOT_DATA . '/conv/5491199887766.json');
@unlink(WABOT_DATA . '/conv/igQATESTVACIA1.json');
@unlink(WABOT_DATA . '/conv/QATESTFORM1.json');
foreach (glob(WABOT_DATA . '/conv/54911888800*TEST.json') ?: [] as $f) @unlink($f);
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

echo "— 12. /formb: el pago único llega al boceto (21-sep) —\n";

/* form-lead.php es el endpoint: al incluirlo atiende un POST y termina. Acá se
 * cargan solo sus funciones, que son lo que va antes del primer header(). */
$srcFormLead = (string)file_get_contents(__DIR__ . '/form-lead.php');
eval('?>' . substr($srcFormLead, 0, (int)strpos($srcFormLead, "header('Access-Control-Allow-Origin")));

foreach (['unico', 'mensual'] as $plan) {
    $ePlan = formlead_extras(['modalidad' => $plan]);
    caso("\"$plan\" sigue siendo un plan: sin la marca de web propia",
        ($ePlan['modalidad_elegida'] ?? '') === $plan && !isset($ePlan['quiere_web_propia']), json_encode($ePlan));
}
$ePropia = formlead_extras(['modalidad' => 'propia']);
caso('"propia" (el pago único) se acepta y marca la web propia',
    ($ePropia['modalidad_elegida'] ?? '') === 'propia' && ($ePropia['quiere_web_propia'] ?? false) === true, json_encode($ePropia));
$motivoPropia = null;
caso('una forma inventada se sigue rechazando',
    formlead_extras(['modalidad' => 'gratis'], $motivoPropia) === null && ($motivoPropia['campo'] ?? '') === 'modalidad');

$htmlB = (string)file_get_contents(__DIR__ . '/../formb/index.html');
$htmlPrincipal = (string)file_get_contents(__DIR__ . '/../form/index.html');
/* 26-sep a la noche: el pago único incluye el hosting y el dominio el primer
 * año y el mantenimiento se contrata aparte; ya no "No incluye mantenimiento
 * ni renovaciones". */
caso('el formulario principal ofrece el pago único, con el primer año de hosting y el mantenimiento aparte',
    preg_match('/<option value="propia" data-desc="[^"]*primer año de hosting y dominio[^"]*mantenimiento se contrata aparte[^"]*">Pago único<\/option>/u', $htmlPrincipal) === 1
    && strpos($htmlPrincipal, 'No incluye mantenimiento ni renovaciones') === false);
caso('el HTML de /formb manda el pago único en un campo oculto',
    strpos($htmlB, '<input type="hidden" id="modalidad" name="modalidad" value="propia">') !== false);
caso('y no muestra la forma de pago: ni el selector ni los planes',
    strpos($htmlB, '<select id="modalidad"') === false && stripos($htmlB, 'Plan anual') === false
    && stripos($htmlB, 'Plan mensual') === false && stripos($htmlB, 'elegí un plan') === false);
caso('comparte el JS y el CSS de /form, no una copia',
    strpos($htmlB, 'src="/form/script.js') !== false && strpos($htmlB, 'href="/form/styles.css') !== false);

@unlink(WABOT_DATA . '/conv/5493810009001.json');
$payloadB = ['t' => '5493810009001', 'nombre' => 'Lucía', 'nombre_negocio' => 'Taller Lucía',
    'resumen' => 'Taller mecánico de barrio', 'colores' => 'Rojo y negro', 'modalidad' => 'propia',
    'modelos' => [['id' => 'a', 'nombre' => 'Uno'], ['id' => 'b', 'nombre' => 'Dos']]];
$baseB = wabot_form_lead_validar($payloadB);
$extrasB = formlead_extras($payloadB);
caso('el paso 2 con pago único se guarda', $baseB !== null && $extrasB !== null && formlead_extras_guardar($baseB, $extrasB) === true);
$rB = wabot_form_lead_procesar($payloadB, $cfg);
$convB = wabot_conv_load('5493810009001');
caso('el envío se acepta y la charla queda con el pago único, la web propia y como prospecto',
    ($rB['ok'] ?? false) === true && ($convB['modalidad_elegida'] ?? '') === 'propia'
    && !empty($convB['quiere_web_propia']) && !empty($convB['esProspecto']) && !empty($convB['lead_creado']),
    json_encode($rB) . ' ' . ($convB['modalidad_elegida'] ?? ''));
$fichaB = wabot_ficha_resumen($convB, $cfg);
/* 26-sep a la noche: el pago único es una de las 3 modalidades y la ficha lo
 * dice como a las otras dos; la línea de la web propia queda para el que lo
 * pidió sin elegirlo. */
caso('la ficha dice "Eligió: pago único", sin repetirlo en la línea de la web propia',
    strpos($fichaB, 'Eligió: pago único') !== false && strpos($fichaB, 'Web propia: le interesa el pago único') === false, $fichaB);
$lineasB = implode("\n", array_map(function ($l) { return (string)($l['t'] ?? ''); }, (array)($convB['transcript'] ?? [])));
caso('el transcript anota la forma de pago como Pago único', strpos($lineasB, 'Forma de pago: Pago único') !== false, $lineasB);
$camposB = wabot_lead_campos($convB, $cfg, false);
caso('el documento del boceto viaja con modalidad "propia"', ($camposB['modalidad']['stringValue'] ?? '') === 'propia', json_encode($camposB['modalidad'] ?? null));
@unlink(WABOT_DATA . '/conv/5493810009001.json');

echo "— 13. El link del formulario que copia Pablo desde el chat (21-sep) —\n";

/* Pablo, 21-sep: "un cliente me dice que sí al formulario, estoy contestando
 * yo, le paso el form sin código: ¿cómo se vincula el chat con el form?".
 * Sin ?c=, lo único que ata el envío a la charla es el teléfono que el cliente
 * tipea, y desde Instagram no hay ninguno. El panel arma el link con el código
 * de esa conversación (accion=form_link) aunque el bot nunca lo haya mandado. */
$idxPath = wabot_codigo_indice_path();
$idxPrevio = @file_get_contents($idxPath);

$cPanel = conv_nueva('5491133344455');
caso('una charla sin código todavía', trim((string)($cPanel['codigo'] ?? '')) === '');
$codPanel = wabot_codigo_asignar($cPanel);
caso('el panel le asigna uno y queda guardado en la charla',
    $codPanel !== '' && ($cPanel['codigo'] ?? '') === $codPanel);
caso('pedirlo de nuevo no cambia el código', wabot_codigo_asignar($cPanel) === $codPanel);
// En el sandbox el código sale derivado de la clave y no escribe el índice real: se registra a mano, como los casos de arriba.
$cIg = conv_nueva('ig17841400000000009', ['canal' => 'instagram']);
$codIg = wabot_codigo_asignar($cIg);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(),
    [$codPanel => '5491133344455', $codIg => 'ig17841400000000009'])));
caso('el índice lo devuelve a esa conversación', wabot_codigo_buscar($codPanel) === '5491133344455');
$datosPanel = wabot_form_lead_validar(['c' => $codPanel, 't' => '1133344455', 'nombre' => 'Ana',
    'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']);
caso('un envío con ese código cae en la charla, no en una nueva',
    is_array($datosPanel) && $datosPanel['clave'] === '5491133344455' && !empty($datosPanel['conCodigo']));

caso('en Instagram también hay código', $codIg !== '' && wabot_codigo_buscar($codIg) === 'ig17841400000000009');
$datosIgPanel = wabot_form_lead_validar(['c' => $codIg, 't' => '1123456789', 'nombre' => 'Ana',
    'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']);
caso('y el envío queda atado a la charla de Instagram, con el WhatsApp aparte',
    is_array($datosIgPanel) && $datosIgPanel['clave'] === 'ig17841400000000009' && $datosIgPanel['telWsp'] === '1123456789');
/* Lo que pasaba antes: el mismo formulario sin código desde Instagram no tiene
 * con qué encontrar la charla y abre una nueva por el teléfono tipeado. */
$datosSinCodigo = wabot_form_lead_validar(['t' => '1123456789', 'nombre' => 'Ana',
    'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']);
caso('sin código, el envío queda en la charla del teléfono tipeado y sin permiso de pisar',
    is_array($datosSinCodigo) && $datosSinCodigo['clave'] !== 'ig17841400000000009' && empty($datosSinCodigo['conCodigo']));

$adminForm = (string)@file_get_contents(__DIR__ . '/admin.php');
caso('el panel tiene la acción y el botón para copiarlo',
    strpos($adminForm, "\$a === 'form_link'") !== false
    && strpos($adminForm, "accion: 'form_link'") !== false
    && strpos($adminForm, 'Copiar form') !== false);
// En los dos lugares donde Pablo trabaja: las columnas del live y la ficha del chat.
caso('el boton esta en el live y tambien en la ficha de la conversacion',
    strpos($adminForm, "form.className = 'live-form'") !== false
    && strpos($adminForm, 'class="sec form-copiar"') !== false
    && strpos($adminForm, "ev.target.closest('.form-copiar')") !== false);
// Y copia el mensaje entero, no el link pelado (Pablo, 21-sep).
caso('copia el mensaje completo, con el texto arriba del link',
    strpos($adminForm, '\'mensaje\' => $intro') !== false
    && substr_count($adminForm, 'j.mensaje || j.link') === 3
    && strpos((string)wabot_textos_default()['form_link_panel'], 'primera muestra gratis') !== false);
caso('y arma el link igual que el bot, con &ig=1 en Instagram',
    strpos($adminForm, "'https://gokywebs.com/form/?c=' . \$codigo") !== false
    && strpos($adminForm, "\$link .= '&ig=1'") !== false);

if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);

echo "— 14. Presentar la demo no puede mandar al vacío (21-sep) —\n";

/* El 21-sep salió la demo de Pescadería Las Grutas a un número que había
 * llegado por el formulario y nunca había escrito por WhatsApp: la ventana de
 * 24 h de Meta estaba cerrada, el envío se perdió y el panel lo mostró como
 * enviado. `responder` ya miraba la ventana; `presentar_muestra` no. */
$cForm = conv_nueva('5492944814198');
$cForm['ultimo_cliente_ts'] = 0;
caso('el que llegó por el formulario y nunca escribió está fuera de la ventana',
    wabot_ventana_restante($cForm) <= 0);
$cViejo = conv_nueva('5492944814199');
$cViejo['ultimo_cliente_ts'] = time() - 25 * 3600;
caso('y el que escribió hace más de un día, también', wabot_ventana_restante($cViejo) <= 0);
$cVivo = conv_nueva('5492944814197');
$cVivo['ultimo_cliente_ts'] = time() - 3600;
caso('el que escribió hace un rato sigue adentro', wabot_ventana_restante($cVivo) > 0);

$adminPres = (string)@file_get_contents(__DIR__ . '/admin.php');
caso('presentar_muestra mide la ventana antes de mandar y no manda si está cerrada',
    strpos($adminPres, '$fueraVentana = wabot_ventana_restante($conv) <= 0;') !== false
    && strpos($adminPres, 'foreach ($fueraVentana ? [] : $textos as $i => $texto)') !== false);
caso('y se lo avisa al panel, diciendo si el cliente nunca escribió',
    strpos($adminPres, "'fuera_ventana' => \$fueraVentana,") !== false
    && strpos($adminPres, "'nunca_escribio'") !== false);
$dashPres = (string)@file_get_contents(__DIR__ . '/../admin/dashboard.js');
caso('el admin lo explica en vez de decir que no pudo confirmar el envío',
    strpos($dashPres, 'envio.fuera_ventana') !== false
    && strpos($dashPres, 'nunca escribió por WhatsApp') !== false);

echo "— 15. Meta avisa que no entregó: el aviso va al chat de verdad (21-sep) —\n";

/* El status failed llega segundos después del envío, con el número en formato
 * de Meta (549...). La charla puede estar guardada como el cliente escribió su
 * número en el formulario (2944814198): sin resolver, el aviso caía en una
 * conversación fantasma y en el chat real no aparecía nada. */
$cFalla = conv_nueva('5492944814100');
$cFalla['presentado_ts'] = time() - 5;
$cFalla['presentado_via_bot'] = true;
$desmarco = wabot_entrega_fallida_marcar($cFalla, 'Re-engagement message');
caso('el aviso queda en el transcript del chat',
    $desmarco === true && str_contains((string)(end($cFalla['transcript'])['t'] ?? ''), 'no pudo entregar el último mensaje'));
caso('y la demo deja de figurar como entregada por el bot', empty($cFalla['presentado_via_bot']));

$cVieja = conv_nueva('5492944814101');
$cVieja['presentado_ts'] = time() - 3 * 86400;
$cVieja['presentado_via_bot'] = true;
wabot_entrega_fallida_marcar($cVieja, 'Re-engagement message');
caso('una demo de hace tres días no se desmarca por un mensaje que falló hoy',
    !empty($cVieja['presentado_via_bot']));

$webhookSrc = (string)@file_get_contents(__DIR__ . '/webhook.php');
caso('el webhook resuelve la conversación antes de escribir el aviso',
    strpos($webhookSrc, '$claveReal = wabot_conv_resolver($clave);') !== false
    && strpos($webhookSrc, 'wabot_entrega_fallida_marcar($conv, $motivo);') !== false);
caso('y si no hay charla, no crea una fantasma', strpos($webhookSrc, 'if ($claveReal === null) continue;') !== false);

echo "— 16. Qué quiere lograr con la web y formulario sin elección de estilo —\n";

// formlead_extras() y compañía ya están cargadas desde la sección 12.
preg_match_all('/<input type="checkbox" name="objetivos" value="([^"]+)"/u', $htmlPrincipal, $mObj);
caso('las casillas del formulario son las que acepta el servidor, en el mismo orden',
    $mObj[1] === formlead_objetivos(), json_encode($mObj[1], JSON_UNESCAPED_UNICODE));
caso('el campo de "Otra" va a su derecha, en la misma grilla, y arranca apagado',
    preg_match('/value="Otra"[^>]*>.*?<\/label>\s*<div class="objetivo-otro"[^>]*>\s*<input [^>]*id="objetivo_otro"[^>]*\bdisabled>/us', $htmlPrincipal) === 1);

$eObj = formlead_extras(['objetivos' => ['Tener una web visualmente atractiva', 'Generar más ventas', 'Generar más ventas', 'Algo inventado', 'Otra'],
    'objetivo_otro' => "  Que me   escriban\nempresas  "]);
caso('quedan en el orden del formulario, sin repetir, sin lo inventado y con lo que escribió en "Otra"',
    ($eObj['objetivos'] ?? null) === 'Generar más ventas, Tener una web visualmente atractiva, Otra: Que me escriban empresas',
    json_encode($eObj, JSON_UNESCAPED_UNICODE));
$eSoloOtra = formlead_extras(['objetivos' => ['Otra'], 'objetivo_otro' => '']);
caso('"Otra" sin escribir nada no se anota', ($eSoloOtra['objetivos'] ?? null) === '', json_encode($eSoloOtra));
$eNoLista = formlead_extras(['objetivos' => 'Generar más ventas']);
caso('lo que no es una lista no se anota, pero tampoco frena el envío', $eNoLista !== null && ($eNoLista['objetivos'] ?? null) === '');
caso('el formulario que no manda objetivos no toca los de la charla',
    !array_key_exists('objetivos', (array)formlead_extras(['estilo' => 'Minimalista'])));
$motivoObj = null;
caso('"Otra" de más de 120 caracteres se rechaza en su campo',
    formlead_extras(['objetivos' => ['Otra'], 'objetivo_otro' => str_repeat('a', 121)], $motivoObj) === null
    && ($motivoObj['campo'] ?? '') === 'objetivo_otro' && ($motivoObj['max'] ?? 0) === 120, json_encode($motivoObj));

@unlink(WABOT_DATA . '/conv/5493810009002.json');
$payloadObj = ['t' => '5493810009002', 'nombre' => 'Marta', 'nombre_negocio' => 'Vivero Marta',
    'resumen' => 'Vivero con plantas de interior', 'colores' => 'Verde', 'modalidad' => 'mensual',
    'objetivos' => ['Generar más ventas', 'Recibir reservas o turnos'], 'objetivo_otro' => '', 'estilo' => 'Cálido y cercano',
    'modelos' => [['id' => 'a', 'nombre' => 'Uno'], ['id' => 'b', 'nombre' => 'Dos']]];
$baseObj = wabot_form_lead_validar($payloadObj);
$extrasObj = formlead_extras($payloadObj);
caso('se guarda con el resto del paso 2', $baseObj !== null && $extrasObj !== null && formlead_extras_guardar($baseObj, $extrasObj) === true);
$rObj = wabot_form_lead_procesar($payloadObj, $cfg);
$convObj = wabot_conv_load('5493810009002');
caso('la charla queda con lo que quiere lograr',
    ($rObj['ok'] ?? false) === true && ($convObj['objetivos'] ?? '') === 'Generar más ventas, Recibir reservas o turnos',
    json_encode($rObj) . ' ' . (string)($convObj['objetivos'] ?? ''));
$lineasObj = implode("\n", array_map(function ($l) { return (string)($l['t'] ?? ''); }, (array)($convObj['transcript'] ?? [])));
caso('el transcript lo anota', strpos($lineasObj, 'Quiere lograr: Generar más ventas, Recibir reservas o turnos') !== false, $lineasObj);
$camposObj = wabot_lead_campos($convObj, $cfg, false);
caso('el boceto lo lleva en `objetivos`, que el admin muestra como "Objetivos de la web"',
    ($camposObj['objetivos']['stringValue'] ?? '') === 'Generar más ventas, Recibir reservas o turnos',
    json_encode($camposObj['objetivos'] ?? null, JSON_UNESCAPED_UNICODE));
caso('y no se repite en el bloque que se lee al diseñar: el admin le da su fila',
    mb_strpos((string)($camposObj['objetivo_web']['stringValue'] ?? ''), 'Generar más ventas') === false,
    (string)($camposObj['objetivo_web']['stringValue'] ?? ''));
$cRObj = array_merge($convObj, ['ultimo_ts' => time() - 30 * 86400, 'presentado_ts' => 0]);
wabot_conv_reset_si_vieja($cRObj, $cfg, time());
caso('el reset de sesión lo limpia, igual que al estilo', empty($cRObj['objetivos']));
@unlink(WABOT_DATA . '/conv/5493810009002.json');

// La elección de estilo ya no se pide en ninguna variante del formulario.
$htmlFormb = (string)file_get_contents(__DIR__ . '/../formb/index.html');
$scriptForm = (string)file_get_contents(__DIR__ . '/../form/script.js');
caso('ninguna variante muestra ni exige elegir un estilo',
    strpos($htmlPrincipal, 'id="estilo"') === false && strpos($htmlFormb, 'id="estilo"') === false
    && strpos($scriptForm, "get('estilo')") === false && strpos($scriptForm, "'estilo', 'referencia'") === false);
caso('el servidor acepta formularios nuevos sin estilo y conserva compatibilidad con los anteriores',
    !array_key_exists('estilo', (array)formlead_extras(['referencia' => 'ejemplo.com']))
    && (formlead_extras(['estilo' => 'Minimalista'])['estilo'] ?? '') === 'Minimalista');

// El admin conserva la lectura y edición del estilo para bocetos anteriores.
$dashObj = (string)file_get_contents(__DIR__ . '/../admin/dashboard.js');
caso('el "Copiar" del boceto conserva objetivos, estilo anterior y lo de sí o sí',
    strpos($dashObj, '{ title: "Objetivos de la web", value: objetivosTexto }') !== false
    && strpos($dashObj, '{ title: "Estilo de página", value: cleanFieldValue(p.estilo_pagina) }') !== false
    && strpos($dashObj, '{ title: "Incluir sí o sí", value: cleanFieldValue(p.incluir_si_o_si) }') !== false);
caso('y el boceto los muestra para editar y los guarda en sus campos',
    strpos($dashObj, 'id="propEstiloPagina"') !== false && strpos($dashObj, 'data.estilo_pagina = getInputValue("propEstiloPagina")') !== false
    && strpos($dashObj, 'id="propIncluirSiOSi"') !== false && strpos($dashObj, 'data.incluir_si_o_si = getInputValue("propIncluirSiOSi")') !== false);

echo "— 17. Instagram del negocio, opcional (28-sep) —\n";

caso('el formulario tiene el campo, opcional', preg_match('/<input type="text" id="instagram" name="instagram"[^>]*>/', $htmlPrincipal) === 1
    && strpos($htmlPrincipal, 'Instagram del negocio <span class="optional">') !== false);
foreach (['@lashojas' => 'lashojas', 'https://www.instagram.com/las.hojas_vivero/?igsh=abc' => 'las.hojas_vivero',
          'instagram.com/lashojas' => 'lashojas', 'Las Hojas Vivero' => '', 'www.instagram.com/p/xyz' => ''] as $escrito => $usuario) {
    $eIg = formlead_extras(['instagram' => $escrito]);
    caso("\"$escrito\" queda como " . ($usuario === '' ? 'vacío (no frena el envío)' : "\"$usuario\""), ($eIg['instagram'] ?? null) === $usuario, json_encode($eIg));
}
$motivoIg = null;
caso('uno de más de 100 caracteres se rechaza en su campo',
    formlead_extras(['instagram' => str_repeat('a', 101)], $motivoIg) === null && ($motivoIg['campo'] ?? '') === 'instagram');
caso('el formulario que no lo manda no toca la charla', !array_key_exists('instagram', (array)formlead_extras(['estilo' => 'Minimalista'])));

@unlink(WABOT_DATA . '/conv/5493810009003.json');
$payloadIg = ['t' => '5493810009003', 'nombre' => 'Marta', 'nombre_negocio' => 'Vivero Las Hojas', 'resumen' => 'Vivero',
    'colores' => 'Verde', 'modalidad' => 'mensual', 'instagram' => '@las.hojas', 'estilo' => 'Minimalista',
    'modelos' => [['id' => 'a', 'nombre' => 'Uno'], ['id' => 'b', 'nombre' => 'Dos']]];
$baseIg = wabot_form_lead_validar($payloadIg);
formlead_extras_guardar($baseIg, formlead_extras($payloadIg));
$rIg = wabot_form_lead_procesar($payloadIg, $cfg);
$convIg = wabot_conv_load('5493810009003');
caso('la charla queda con el usuario', ($rIg['ok'] ?? false) === true && ($convIg['instagram'] ?? '') === 'las.hojas', (string)($convIg['instagram'] ?? ''));
$lineasIg = implode("\n", array_map(function ($l) { return (string)($l['t'] ?? ''); }, (array)($convIg['transcript'] ?? [])));
caso('el transcript lo anota', strpos($lineasIg, 'Instagram: instagram.com/las.hojas') !== false, $lineasIg);
caso('sin boceto en Firestore no hay a dónde mandarlo', formlead_instagram_sincronizar('5493810009003') === false);
// En los tests el boceto no se crea de verdad: se simula el documento.
$convIg['lead_doc'] = 'projects/demo/databases/(default)/documents/propuestas/abc';
wabot_conv_save($convIg);
caso('y con el boceto creado, se le manda', formlead_instagram_sincronizar('5493810009003') === true);
@unlink(WABOT_DATA . '/conv/5493810009003.json');

$dashIg = (string)file_get_contents(__DIR__ . '/../admin/dashboard.js');
caso('el boceto ya no dice "Prospecto · eligió avanzar": muestra el Instagram como link',
    strpos($dashIg, 'Prospecto · eligió avanzar') === false && strpos($dashIg, 'instagramLinkHTML(p.instagram)') !== false
    && strpos($dashIg, 'target="_blank" rel="noopener noreferrer" class="prop-instagram"') !== false);
caso('y el Copiar lo lleva como link', strpos($dashIg, '{ title: "Instagram", value: instagramUrl(p.instagram) }') !== false);

todo_ok();
