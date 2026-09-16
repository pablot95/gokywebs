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

echo "— 2. El precio muestra trabajos y modelos —\n";

$c = conv_nueva('5491188880001TEST');
$r = wabot_pitch('landing', $c, $cfg);
caso('el segundo mensaje muestra cinco trabajos reales', substr_count($r[1] ?? '', '• ') === 5);
caso('y cierra con modelos y la pregunta de arranque', strpos($r[1] ?? '', 'gokywebs.com/modelos/') !== false && str_ends_with($r[1] ?? '', '¿Arrancamos?'), $r[1] ?? '');
caso('sin el link: ese sale con el sí', !tiene_form($r));
$c = conv_nueva('5491188880002TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('un anuncio viejo de demo entra al flujo nuevo y espera una aceptación actual',
    count($r) === 2 && mb_stripos($r[1], 'modelos') !== false && !tiene_form($r),
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

$c = conv_con_link('5491188880030TEST', $cfg);
caso('(la charla de prueba tiene el link mandado)', !empty($c['link_form_enviado']) && $c['fase'] === 'prediseno');
clasifica(['otro']);
$r = turno('Si, quiero la muestra gratis', $c, $cfg);
caso('"Sí, quiero la muestra gratis" heredado recibe solo el enlace simple', $r === ['gokywebs.com/form'], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y queda como prospecto para que siga Pablo', ($c['fase'] ?? '') === 'derivado' && !empty($c['esProspecto']) && !empty($c['bot_off']));
$r = turno('si quiero la demo', $c, $cfg);
caso('la segunda vez no se repite: se calla', $r === [] && ($c['fase'] ?? '') === 'derivado', json_encode($r, JSON_UNESCAPED_UNICODE));
$r = turno('Malena - IndumentariaMale - negro y dorado', $c, $cfg);
caso('los datos posteriores quedan para Pablo y el bot no responde', $r === [] && !empty($c['handoff_pendiente']));

$c = conv_con_link('5491188880031TEST', $cfg);
clasifica(['otro']);
$r = turno('ya esta todo arriba, fijate', $c, $cfg);
caso('"ya está todo arriba" sin el formulario recibido: se le avisa que no llegó, con el link',
    strpos($r[0] ?? '', 'Todavía no me llegó el formulario') === 0 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('sin derivar', ($c['fase'] ?? '') === 'prediseno');
$r = turno('ya lo complete, fijate bien', $c, $cfg);
caso('si insiste, algo anda mal con el formulario: lo toma una persona', ($c['fase'] ?? '') === 'derivado', json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_con_link('5491188880032TEST', $cfg);
$c['form_completado_ts'] = time(); $c['lead_creado'] = 'propuestas/test';
wabot_handoff_marcar($c, 'prediseno');
$r = turno('ya lo complete, fijate', $c, $cfg);
caso('con el formulario recibido, "ya lo completé" se confirma con la entrega',
    strpos($r[0] ?? '', 'Sí, ya lo tengo: la demo te llega') === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$r = turno('ya esta todo arriba', $c, $cfg);
caso('y una sola vez', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ([false, true] as $recibido) {
    $c = conv_con_link('5491188880035TEST', $cfg);
    $c['form_completado_ts'] = $recibido ? time() : 0;
    $r = turno('Ya completé todo, te llegó?', $c, $cfg);
    caso('consulta recepción con formulario ' . ($recibido ? 'recibido' : 'pendiente'),
        strpos(implode(' ', $r), $recibido ? 'Sí, ya lo tengo' : 'Todavía no me llegó el formulario') !== false
        && empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
}
caso('el aviso de formulario no tapa una pregunta distinta',
    !wabot_form_pregunta_recepcion('Ya completé todo, te llegó? Cuánto tarda la demo?'));

$c = conv_con_link('5491188880034TEST', $cfg);
$c['nombre_negocio'] = 'IndumentariaMale'; $c['colores'] = 'negro y dorado';
clasifica(['pregunta_info'], ['info_keys' => ['hosting']]);
$r = turno('el dominio viene incluido?', $c, $cfg);
caso('con los datos ya sabidos, una pregunta se contesta: el borde no cierra encima de ella',
    stripos(implode(' ', $r), 'hosting') !== false && !in_array('prediseno_datos_por_chat', array_keys((array)($c['eventos_emitidos_sesion'] ?? [])), true),
    json_encode($r, JSON_UNESCAPED_UNICODE));

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
caso('el texto auxiliar del formulario usa la redacción nueva',
    preg_match('/^Para avanzar completá este formulario:\nhttps:\/\/gokywebs\.com\/form\/\S+\nSi algo no te queda claro, escribime por acá\.$/u', $form) === 1, $form);
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
caso('avisa a Pablo por WhatsApp con el nombre y el negocio del lead',
    (function () {
        foreach ($GLOBALS['WABOT_TEST_ENVIADOS'] ?? [] as $env) {
            if (($env[0] ?? '') === '5491125068578' && strpos($env[1] ?? '', 'Carla') !== false && strpos($env[1] ?? '', 'Carla Deco') !== false) return true;
        }
        return false;
    })());
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

todo_ok();
