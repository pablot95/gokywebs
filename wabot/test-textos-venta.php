<?php
/**
 * wabot/test-textos-venta.php — los textos de venta del 11-sep (solo CLI).
 *
 * Segunda parte de lo que salió de la batería V01–V10 del 10-sep, con las
 * reglas que dio Pablo el 11-sep:
 *  1. El precio en su formato: "Para tu centro de estética podemos hacer una web
 *     donde…" y, aparte, "Empezás con un primer pago de…". Igual en el pitch y
 *     en el que pide el precio de entrada.
 *  2. El formulario en dos líneas, sin la coletilla "Es gratis y sin
 *     compromiso." colgando (tampoco en el cierre del prediseño).
 *  3. Lo incluido que se contesta SOLO si lo pregunta: turnos online, usuarios,
 *     hasta 3 idiomas, el dominio .com (+$40.000 por año) y las estadísticas.
 *  4. "Qué incluye" y las estadísticas según el tipo cotizado.
 *  5. La config de producción converge en un pase.
 * El para_que del modelo, el paraguas (V01) y la objeción de Wix (V06) se
 * prueban en test-agente.php y test-salida.php; los caminos con Gemini, en la
 * batería.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';
require_once __DIR__ . '/agente.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$cfg['form_activo'] = true;

$fallas = 0; $total = 0;
function caso($nombre, $ok, $detalle = '') {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . ($ok || $detalle === '' ? '' : "  -> $detalle") . "\n";
    if (!$ok) $fallas++;
}

function conv_tv($tel) {
    return ['tel' => $tel, 'channel_user_id' => $tel, 'canal' => 'whatsapp', 'conversation_key' => $tel,
        'fase' => 'nuevo', 'tipo' => null, 'descripcion' => null, 'colores' => null, 'msgs' => [],
        'ultimo_ts' => 0, 'transcript' => [], 'espera_avisada' => false, 'no_texto_avisado' => false,
        'bot_off' => false, 'pausado_hasta' => 0, 'lead_creado' => false];
}

echo "— 1. El precio en el formato de Pablo —\n";

$c = conv_tv('5491166660001TEST');
$r = wabot_pitch('landing', $c, $cfg);
$precio = wabot_personalizar($r[0], $c);
caso('sin rubro ni para_que arranca "Podemos hacer" con la frase fija del sitio profesional',
    strpos($precio, "Podemos hacer una web a tu medida, que presente tu negocio, explique tus servicios y haga que los clientes te escriban directo por WhatsApp.\n\n") === 0, $precio);
caso('el primer pago y el plan van en su párrafo, con las palabras de Pablo',
    strpos($precio, "\n\nEmpezás con un primer pago de \$60.000. A los 30 días de ese pago comienza el plan de \$20.000 por mes, esto incluye todo lo necesario para mantener tu web funcionando correctamente y actualizada, sin que tengas que ocuparte de lo técnico.\n") !== false, $precio);
caso('y termina en el link del presupuesto',
    preg_match('/\nEn este enlace podés verlo bien detallado: gokywebs\.com\/presupuestos\/\S+\n\nAsí trabajamos, en tres pasos:/u', $precio) === 1, $precio);
caso('"primer pago", nunca "pago inicial"', mb_stripos($precio, 'pago inicial') === false);
/* 11-sep, segunda vuelta: todo en UN mensaje, con los pasos
 * explayados y el primer pago en el paso 2. */
caso('es un solo mensaje, con los tres pasos y la pregunta pegados abajo',
    count($r) === 1
    && mb_strpos($precio, "\n\n" . str_replace('{precio}', '$60.000', wabot_tres_pasos_default()) . "\n" . wabot_tres_pasos_pregunta()) !== false, $precio);
caso('el paso 2 dice el primer pago de lo cotizado y para qué es',
    mb_strpos($precio, '2. Si te gusta y querés avanzar, se hace un primer pago de $60.000 y con eso avanzamos hacia el desarrollo completo.') !== false);
caso('y el paso 3, el plan mensual con su monto y para qué sirve',
    mb_strpos($precio, '3. A los 30 días del primer pago comienza el plan mensual, para mantener tu web funcionando correctamente y actualizada.') !== false);

$c = conv_tv('5491166660002TEST');
$c['rubro_pitch'] = 'tu centro de estética';
$c['pitch_para_que'] = 'muestres los tratamientos y tus clientas reserven turno online';
$c['pitch_para_que_tipo'] = 'landing';
$r = wabot_pitch('landing', $c, $cfg);
caso('con rubro y para_que sale la oración que dictó Pablo, con el link pegado',
    strpos(wabot_personalizar($r[0], $c), "Para tu centro de estética podemos hacer una web donde muestres los tratamientos y tus clientas reserven turno online.\n\nEmpezás con un primer pago de \$60.000.") === 0,
    wabot_personalizar($r[0], $c));

foreach (['ecommerce' => 'una web para vender online', 'inmobiliaria' => 'una web para publicar tus propiedades',
          'elearning' => 'una plataforma para vender tus cursos'] as $tipo => $arranque) {
    $c = conv_tv('5491166660003TEST');
    $r = wabot_pitch($tipo, $c, $cfg);
    $t = wabot_personalizar($r[0], $c);
    caso("$tipo: la frase fija de su tipo y \$90.000 + \$30.000 por mes",
        strpos($t, 'Podemos hacer ' . $arranque) === 0 && strpos($t, 'primer pago de $90.000') !== false
        && strpos($t, 'plan de $30.000 por mes') !== false, $t);
}

/* El que pregunta "cuánto sale" antes de decir el rubro entra por el camino
 * sin pitch: antes recibía la redacción de msg_precio ("Perfecto, para lo tuyo
 * va…"), ahora la misma que el resto. */
$c = conv_tv('5491166660004TEST');
$c['pidio_precio'] = true;
$c['rubro_pitch'] = 'tu pastelería';
$r = wabot_precio('ecommerce', $c, $cfg);
caso('el que pidió el precio de entrada recibe el mismo formato',
    strpos(wabot_personalizar($r[0], $c), 'Para tu pastelería podemos hacer una web para vender online') === 0
    && mb_stripos($r[0], 'para lo tuyo va') === false, $r[0]);
caso('con los tres pasos pegados abajo, en el mismo mensaje', count($r) === 1 && mb_stripos($r[0], 'tres pasos') !== false);

$c = conv_tv('5491166660005TEST');
$c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('el que pidió la demo al entrar: precio con los tres pasos sin la pregunta, y el formulario atrás',
    count($r) === 2 && wabot_texto_arranca_con_propuesta($r[0]) && strpos($r[0], wabot_tres_pasos_pregunta()) === false
    && mb_stripos($r[0], 'tres pasos') !== false
    && strpos($r[1], 'gokywebs.com/form/') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

/* Cotizada antes del 10-sep, sin precio congelado: conserva su pago único y
 * su redacción. El formato nuevo habla de un plan que para ella no existe. */
$c = conv_tv('5491166660006TEST');
$c['tipo'] = 'landing'; $c['precio_dado'] = true;
$viejo = wabot_pitch_precio_texto('landing', $cfg, $c);
caso('una charla del modelo viejo no recibe el formato nuevo',
    !wabot_texto_arranca_con_propuesta($viejo) && mb_stripos($viejo, 'Empezás con un primer pago') === false, $viejo);

caso('el texto de los cuatro tipos es el mismo: lo que cambia lo pone el código',
    count(array_unique(wabot_precio_ideal_defaults())) === 1);
caso('y la config sigue sin problemas en los textos del precio', wabot_textos_problemas($cfg) === [],
    json_encode(wabot_textos_problemas($cfg), JSON_UNESCAPED_UNICODE));

echo "— 2. El formulario en dos líneas y sin coletilla —\n";

$c = conv_tv('5491166660010TEST');
foreach (wabot_pitch('ecommerce', $c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
$form = wabot_prediseno_texto($c, $cfg);
caso('el texto del formulario es el nuevo',
    preg_match('/^Dale\. Para preparar la demo completá este formulario cortito:\nhttps:\/\/gokywebs\.com\/form\/\S+\nSi algo no te queda claro, escribime por acá y te ayudo\.$/u', $form) === 1, $form);
$salida = wabot_salida_preparar([$form], $c, $cfg);
caso('y sale sin "Es gratis y sin compromiso." pegado al final',
    mb_stripos(end($salida), 'sin compromiso') === false, json_encode($salida, JSON_UNESCAPED_UNICODE));
caso('el bot lo reconoce como la demo ya ofrecida',
    wabot_cta_muestra_ya_ofrecida(['transcript' => [['q' => 'bot', 't' => $form, 'ts' => time()]]]) === true);
$cierre = 'Listo, con eso ya lo preparamos. Para que la demo sea tuya de verdad y no una genérica, mandame el logo y fotos de tus productos, aunque sean 4 o 5 para arrancar. Con eso te la dejo lista mañana.';
caso('el cierre del prediseño tampoco se lleva la coletilla', wabot_demo_siempre_gratis([$cierre], $cfg) === [$cierre]);
$oferta = 'Qué te parece si te armamos una versión de tu web para que la veas antes de decidir?';
caso('pero una oferta de verdad sin "gratis" sí la lleva (27-ago)',
    mb_stripos(wabot_demo_siempre_gratis([$oferta], $cfg)[0], 'gratis') !== false);

echo "— 3. Lo incluido, solo si lo pregunta —\n";

foreach ([
    'se pueden sacar turnos online?' => 'turnos',
    'la web tiene reservas online?' => 'turnos',
    'puedo tener un sistema de turnos?' => 'turnos',
    'se puede que me reserven desde la pagina?' => 'turnos',
    'los clientes se pueden registrar?' => 'usuarios',
    'tiene area de socios?' => 'usuarios',
    'se pueden crear usuarios?' => 'usuarios',
    'se puede traducir la web al ingles?' => 'bilingue',
    'la pagina puede estar en varios idiomas?' => 'bilingue',
    'cuantos idiomas trae?' => 'bilingue',
    'puede ser .com?' => 'dominio_com',
    'quiero un .com, se puede?' => 'dominio_com',
    'y el dominio puede ser punto com?' => 'dominio_com',
    'tiene estadisticas?' => 'estadisticas',
    'puedo ver cuanta gente entra a la pagina?' => 'estadisticas',
] as $pregunta => $clave) {
    $vista = wabot_info_por_palabras($pregunta, 'prediseno');
    caso("\"$pregunta\" → $clave", $vista === $clave, (string)$vista);
}
foreach ([
    'el dominio es .com.ar?' => 'hosting',
    'el dominio esta incluido?' => 'hosting',
    'me pasas el usuario y contraseña del hosting?' => 'accesos',
    'le pueden poner google analytics?' => 'pixel',
] as $pregunta => $clave) {
    $vista = wabot_info_por_palabras($pregunta, 'prediseno');
    caso("\"$pregunta\" sigue yendo a $clave", $vista === $clave, (string)$vista);
}
foreach ([
    'doy clases de idiomas',
    'mi web actual es www.tortasdemaru.com',
    'tengo un consultorio y atiendo con turnos',
    'hola, vendo ropa por instagram',
] as $noPregunta) {
    $vista = wabot_info_por_palabras($noPregunta, 'prediseno');
    caso("\"$noPregunta\" no es ninguna de estas preguntas",
        !in_array($vista, ['turnos', 'usuarios', 'bilingue', 'dominio_com', 'estadisticas'], true), (string)$vista);
}

caso('turnos online: incluido y sin costo aparte',
    mb_stripos($cfg['info']['turnos'], 'turnos online') !== false && mb_stripos($cfg['info']['turnos'], 'No se paga aparte') !== false);
caso('usuarios: incluido y sin costo aparte',
    mb_stripos($cfg['info']['usuarios'], 'usuarios') !== false && mb_stripos($cfg['info']['usuarios'], 'No se paga aparte') !== false);
caso('idiomas: hasta 3, incluido, sin "lo confirma el desarrollador"',
    mb_stripos($cfg['info']['bilingue'], '3 idiomas') !== false && mb_stripos($cfg['info']['bilingue'], 'desarrollador') === false);
caso('el .com: .com.ar incluido y $40.000 por año de renovación',
    mb_stripos($cfg['info']['dominio_com'], '.com.ar') !== false && strpos($cfg['info']['dominio_com'], '$40.000') !== false);
caso('el hosting nombra el .com.ar y no el .com', mb_stripos($cfg['info']['hosting'], '.com.ar') !== false
    && strpos($cfg['info']['hosting'], '$40.000') === false);
caso('"qué incluye" ya no manda a confirmar las reservas ni el área de socios',
    mb_stripos($cfg['info']['que_incluye'], 'reservas online') === false && mb_stripos($cfg['info']['que_incluye'], 'te lo confirmamos') === false);
foreach (['turnos', 'usuarios', 'dominio_com', 'estadisticas'] as $clave) {
    caso("la herramienta del agente conoce la clave $clave", wabot_info_clave_del_enum($clave));
}
$sys = wabot_agente_sistema(['fase' => 'menu', 'tipo' => null, 'transcript' => []], $cfg);
caso('el prompt dice que eso se contesta solo si pregunta',
    mb_stripos($sys, 'los turnos online, los usuarios, los idiomas, el dominio .com ni las estadísticas: si el cliente no pregunta, no existen') !== false);
caso('y ya no manda a decir que "lo confirma Pablo"', mb_stripos($sys, 'lo confirma Pablo') === false);

echo "— 4. Según el tipo cotizado —\n";

$incluyeSitio = wabot_texto_info('que_incluye', $cfg, ['tipo' => 'landing']);
caso('al sitio profesional no le habla de cargar productos',
    mb_stripos($incluyeSitio, 'producto') === false && mb_stripos($incluyeSitio, '$10.000') !== false, $incluyeSitio);
caso('a la tienda sí', mb_stripos(wabot_texto_info('que_incluye', $cfg, ['tipo' => 'ecommerce']), '10 productos') !== false);
caso('sin tipo, el general', wabot_texto_info('que_incluye', $cfg, ['tipo' => null]) === $cfg['info']['que_incluye']);
caso('las estadísticas de la tienda son las del panel',
    mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'ecommerce']), 'panel') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'elearning']), 'panel') !== false);
caso('las del sitio profesional y la inmobiliaria, Google Analytics',
    mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'landing']), 'Google Analytics') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'inmobiliaria']), 'Google Analytics') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'landing']), 'panel') === false);
$cAg = conv_tv('5491166660020TEST'); $cAg['tipo'] = 'landing'; $cAg['precio_dado'] = true; $cAg['fase'] = 'prediseno';
$rAg = wabot_agente_ejecutar('consultar_info', ['clave' => 'que_incluye'], $cAg, $cfg, 'Y las reservas online entran?');
caso('el agente contesta "qué incluye" con la versión del tipo (V05: "reservas online")',
    mb_stripos((string)($rAg['texto'] ?? ''), 'todo incluido') !== false
    && mb_stripos((string)($rAg['texto'] ?? ''), 'producto') === false, json_encode($rAg, JSON_UNESCAPED_UNICODE));
$rAgT = wabot_agente_ejecutar('consultar_info', ['clave' => 'turnos'], $cAg, $cfg, 'Y las reservas online entran?');
caso('y "turnos" le contesta que están incluidos', mb_stripos((string)($rAgT['texto'] ?? ''), 'turnos online') !== false,
    json_encode($rAgT, JSON_UNESCAPED_UNICODE));

echo "— 5. La config de producción converge —\n";

$prod = wabot_config_load();
$prod['info']['bilingue'] = 'Sí, la podemos hacer bilingüe. Como depende de cuánto contenido haya que traducir, eso te lo confirma el desarrollador.';
$prod['info']['hosting'] = "El hosting y el dominio están incluidos mientras dure el plan: van dentro de la mensualidad, sin costo aparte.\nNo los contratás ni los renovás vos, se ocupa Gokywebs.";
$prod['info']['que_incluye'] = "Está todo incluido: el desarrollo completo a medida, el hosting, el dominio, el soporte, un cambio por mes y la carga de hasta 10 productos. No tenés que ocuparte de nada.\nAdicionales hay solo dos: \$500 por cada producto arriba de 10, y \$10.000 por mes si querés más de un cambio mensual. Si tenés en mente algo puntual, como reservas online o un área de socios, decime cuál y te lo confirmamos.";
unset($prod['info']['turnos'], $prod['info']['usuarios'], $prod['info']['dominio_com'], $prod['info']['estadisticas'],
      $prod['info']['estadisticas_tienda'], $prod['info']['estadisticas_sitio'], $prod['info']['que_incluye_sin_productos']);
$prod['prediseno_link'] = "Perfecto. Para armarte la demo completá este formulario con el nombre del negocio, qué ofrecés y los colores que te gustan:\n{link}\nNo te lleva más de un minuto, y en menos de 24 horas la tenés lista.";
$prod['tipos']['landing']['precio_ideal'] = "Perfecto, para {rubro} sería un sitio profesional. El primer pago es de {precio} y a los 30 días arranca el plan mensual de {mensualidad}, que incluye el hosting, el dominio, el soporte y un cambio por mes.\nEn este enlace podés verlo bien detallado: {link}";
wabot_config_migrar($prod);
foreach (['bilingue', 'hosting', 'que_incluye', 'turnos', 'usuarios', 'dominio_com', 'estadisticas', 'estadisticas_tienda',
          'estadisticas_sitio', 'que_incluye_sin_productos'] as $k) {
    caso("info.$k queda en el texto nuevo", ($prod['info'][$k] ?? null) === $cfg['info'][$k], (string)($prod['info'][$k] ?? '(falta)'));
}
caso('el formulario y el precio los fija el código',
    $prod['prediseno_link'] === $cfg['prediseno_link'] && $prod['tipos']['landing']['precio_ideal'] === $cfg['tipos']['landing']['precio_ideal']);
$segunda = $prod;
wabot_config_migrar($segunda);
$cambian = array_keys(array_filter($segunda, function ($v, $k) use ($prod) { return ($prod[$k] ?? null) !== $v; }, ARRAY_FILTER_USE_BOTH));
caso('una segunda carga no cambia nada', !$cambian, implode(', ', $cambian));
$editado = $prod;
$editado['info']['dominio_com'] = 'Sí. El .com.ar va incluido; un .com suma $40.000 por año de renovación.';
wabot_config_migrar($editado);
caso('un texto del .com que Pablo edite en el panel se respeta', $editado['info']['dominio_com'] === 'Sí. El .com.ar va incluido; un .com suma $40.000 por año de renovación.');

echo "— 6. El que pregunta no está trabado —\n";

/* Batería del 11-sep: después del precio, "se pueden sacar turnos online?" y
 * "puede estar en inglés?" se contestaron con la demo ofrecida atrás, sin que
 * cambiara el estado, y a la segunda duda wabot_salida_sin_avance() derivó. */
$c = conv_tv('5491166660030TEST');
foreach (wabot_pitch('landing', $c, $cfg) as $m) wabot_conv_transcript($c, 'bot', $m);
$respuesta = ['Sí, está incluido: la web puede tener turnos online. No se paga aparte.', 'Querés que te preparemos la demo gratis?'];
$derivo = false;
foreach (['Se pueden sacar turnos online?', 'Y puede estar en ingles tambien?', 'El dominio puede ser .com?'] as $duda) {
    wabot_conv_transcript($c, 'cliente', $duda);
    $sal = wabot_salida_sin_avance($respuesta, $c, $cfg);
    if ($sal === [(string)$cfg['derivar']]) $derivo = true;
    foreach ($sal as $m) wabot_conv_transcript($c, 'bot', $m);
}
caso('tres dudas seguidas después del precio no derivan', !$derivo && empty($c['handoff_pendiente']));

/* Lo que sí sigue: el bot repreguntando lo mismo mientras el cliente no
 * contesta nada que haga avanzar (el marketplace del 27-ago). */
$c = conv_tv('5491166660031TEST');
$c['fase'] = 'sistema_usuarios'; $c['tipo'] = 'sistema';
$repregunta = ['Cuántas personas usarían el sistema?'];
$salidas = [];
foreach (['no se bien', 'es un marketplace', 'prefiero hablarlo con alguien tecnico'] as $noAvanza) {
    wabot_conv_transcript($c, 'cliente', $noAvanza);
    $salidas[] = wabot_salida_sin_avance($repregunta, $c, $cfg);
}
caso('el bot trabado repreguntando sigue derivando a la tercera', end($salidas) === [(string)$cfg['derivar']],
    json_encode($salidas, JSON_UNESCAPED_UNICODE));

echo "\n" . ($fallas === 0 ? "TODO OK — $total casos" : "FALLAS: $fallas de $total") . "\n";
exit($fallas === 0 ? 0 : 1);
