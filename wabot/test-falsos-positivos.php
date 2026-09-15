<?php
/**
 * wabot/test-falsos-positivos.php — auditoría del 9-sep-2026 (solo CLI).
 *
 * Los detectores deterministas que corren ANTES del modelo decidían cosas
 * irreversibles (baja, cierre, derivación, tipo de web) sobre frases normales
 * de cliente. Cada bloque tiene los controles NEGATIVOS (lo que no puede
 * disparar) junto a los POSITIVOS que ya existían (lo que sí tiene que seguir
 * disparando): un fix que apaga el detector entero también rompe esta suite.
 *
 * Informe: Gokywebsweb/auditoria-wabot-2026-09-09.md.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/agente.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();

$fallas = 0; $total = 0;
function caso($nombre, $ok, $detalle = '') {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . ($ok || $detalle === '' ? '' : "  -> $detalle") . "\n";
    if (!$ok) $fallas++;
}

echo "— 1. La baja: solo dirigida al bot, nunca por cortesía ni reclamo —\n";
foreach ([
    'Hola, no quiero molestar, cuánto sale una página web?',
    'no te quiero molestar, solo quería saber el precio',
    'perdón que moleste, me pasás el precio?',
    'Hola, no me mandaron nada todavía, la demo?',
    'no me llegó nada, no me mandaste nada',
    'no me escribieron más, sigue en pie?',
    'no me contactaron nunca más',
    'no me manden nada todavía, primero quiero ver la demo',
    'no me manden el presupuesto por mail',
] as $f) caso('NO es baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) !== 'baja', (string)wabot_cierre_sin_presion_tipo($f));
foreach (['No molesten mas', 'no quiero que me molesten mas', 'no me molesten', 'dejen de escribirme',
          'dejen de mandarme mensajes', 'paren de escribir', 'basta de molestar', 'no me escriban mas',
          'no me contacten nunca mas', 'sacame de la lista', 'borren mi numero', 'quiero darme de baja',
          'no me llamen mas', 'no quiero que me escriban mas', 'no me manden mas mensajes', 'borrame, no quiero recibir mas mensajes',
          'podrian dejar de escribirme?'] as $f) {
    caso('sigue siendo baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'baja');
}

echo "— 2. El cierre sin presión: no sobre el que explora, pregunta o promete datos —\n";
foreach ([
    'Hola, estoy viendo de hacer una web para mi negocio de ropa',
    'estaba consultando por el precio de una web',
    'estamos viendo la posibilidad de armar una tienda online',
    'estoy viendo cómo hacer para vender más',
    'no puedo pagar todo junto, se puede en cuotas?',
    'no puedo pagar todo junto, en cuotas se puede',
    'estoy averiguando nomás, cuánto sale?',
    'cuando tenga las fotos te escribo',
    'cuando pueda te paso el logo y avanzamos',
    'no tengo plata para publicidad, por eso quiero una web',
] as $f) caso('NO cierra: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === null, (string)wabot_cierre_sin_presion_tipo($f));
foreach (['estoy averiguando nomas', 'estoy viendo opciones nomas', 'por ahora solo estaba averiguando precios',
          'no tengo plata ahora', 'Revisaré el portafolio y los vuelvo a contactar',
          'mas adelante te escribo, ahora no puedo', 'no puedo pagar eso ahora'] as $f) {
    caso('sigue cerrando como consulta: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'consulta', (string)wabot_cierre_sin_presion_tipo($f));
}

echo "— 3. El rechazo: solo del proyecto, no de una parte —\n";
foreach (['no me interesa el mantenimiento, solo la web', 'no me interesa la videollamada, prefiero por acá',
          'no me interesa lo del hosting', 'no me interesa vender online', 'no estoy interesado en el mantenimiento',
          'no me interesa la demo, pasame el precio nomas'] as $f) {
    caso('NO es rechazo: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) !== 'rechazo', (string)wabot_cierre_sin_presion_tipo($f));
}
foreach (['no me interesa', 'no me interesa, gracias', 'no estoy interesado', 'no estoy interesada por ahora',
          'no me interesa la verdad', 'no me interesa la propuesta', 'gracias pero no', 'dejalo ahi'] as $f) {
    caso('sigue siendo rechazo: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'rechazo', (string)wabot_cierre_sin_presion_tipo($f));
}

echo "— 4. Un rubro de una palabra larga no es el teclado apretado al azar —\n";
foreach (['Electricista', 'Veterinaria', 'Inmobiliaria', 'Nutricionista', 'Odontología', 'Kinesiología', 'Restaurante',
          'Construcción', 'Distribuidora', 'Indumentaria', 'Marroquinería', 'Gastronomía', 'Consultoría', 'Arquitectura',
          'Emprendimiento', 'Instructor', 'Electricista matriculado', 'Cerrajería, Herrajes', 'Una consultora',
          'Distribuidora Herrajes don Alfredo'] as $f) {
    caso('es un mensaje real: "' . $f . '"', wabot_texto_ininteligible($f) === false);
}
foreach (['Bxjxdid', 'Djdududeididurureueieies', 'zzz', 'asdfgh', 'asdfghjkl'] as $f) {
    caso('sigue siendo ininteligible: "' . $f . '"', wabot_texto_ininteligible($f) === true);
}
/* Y de punta a punta, por el camino del agente sin IA: el rubro de una palabra
 * llega al motor de reglas, no a "te lo pregunto de otra forma". */
$cIn = wabot_conv_load('999FPTEST'); $cIn['transcript'] = []; $cIn['fase'] = 'menu';
wabot_conv_transcript($cIn, 'cliente', 'Veterinaria'); $cIn['ultimo_cliente_ts'] = time();
$rIn = wabot_salida_preparar(wabot_responder('Veterinaria', $cIn, $cfg), $cIn, $cfg);
caso('"Veterinaria" en fase menu cotiza el sitio profesional', ($cIn['tipo'] ?? '') === 'landing' && (int)($cIn['ininteligibles'] ?? 0) === 0,
    json_encode($rIn, JSON_UNESCAPED_UNICODE));

echo "— 5. Pedir una llamada vs. atender por llamada —\n";
foreach (['Soy psicóloga, atiendo por videollamada, quiero una web', 'doy clases de inglés por videollamada',
          'tengo un call center de llamadas', 'podemos hablar por acá?', 'podemos hablar mañana?',
          'hago sesiones por zoom', 'ofrezco consultas por videollamada y presenciales'] as $f) {
    caso('NO pide llamada: "' . $f . '"', wabot_pide_llamada($f) === false);
}
foreach (['Llamame', 'quiero hablar', 'podemos hacer una llamada?', 'se puede hacer una videollamada',
          'hacemos una videollamada?', 'mejor por videollamada', 'quiero hablar con una persona',
          'prefiero hablarlo por telefono', 'me llamas asi te explico mejor', 'podemos hablar un rato?'] as $f) {
    caso('sigue pidiendo llamada: "' . $f . '"', wabot_pide_llamada($f) === true);
}

echo "— 6. \"Local\" no es un producto —\n";
foreach (['tengo un local de comidas y hago delivery' => null, 'somos una agencia de viajes con local en el centro' => null,
          'tengo un restaurante en Tigre' => 'landing', 'tengo un bar' => 'landing',
          'tengo un local de ropa' => 'ecommerce', 'tengo una ferreteria' => 'ecommerce',
          'fabricamos piscinas de fibra' => null] as $f => $esperado) {
    caso('rubro local de "' . $f . '" = ' . var_export($esperado, true), wabot_fallback_rubro_local($f) === $esperado,
        var_export(wabot_fallback_rubro_local($f), true));
}
$cLoc = ['fase' => 'menu', 'tipo' => null, 'session_started_ts' => time() - 10,
         'transcript' => [['q' => 'cliente', 't' => 'Hola, tengo un local de comidas y hago delivery, quiero una web', 'ts' => time()]]];
caso('el agente que eligió sitio profesional para el local de comidas no se pisa a ecommerce',
    wabot_agente_desempate_pendiente('landing', wabot_contexto_cliente_texto($cLoc), $cLoc, $cfg) === null);
$cRopa = ['fase' => 'menu', 'tipo' => null, 'session_started_ts' => time() - 10,
          'transcript' => [['q' => 'cliente', 't' => 'tengo un local de ropa de mujer', 'ts' => time()]]];
caso('pero el local de ropa sí va a ecommerce', (wabot_agente_desempate_pendiente('landing', wabot_contexto_cliente_texto($cRopa), $cRopa, $cfg)['tipo'] ?? '') === 'ecommerce');

echo "— 7. \"La semana pasada\" no agenda nada —\n";
$ahoraR = gmmktime(18, 0, 0, 9, 8, 2026);
foreach (['les escribí la semana pasada y no me contestaron', 'ya hablamos con Pablo la semana pasada',
          'te escribí ayer y no me respondieron', 'hablamos hace dos semanas'] as $f) {
    caso('NO agenda retomar: "' . $f . '"', wabot_retomar_detectar($f, $ahoraR) === null);
}
caso('"escribime la semana que viene" sigue en 7', wabot_texto_pide_retomar_en('escribime la semana que viene') === 7);
caso('"contactame la proxima semana" también', wabot_texto_pide_retomar_en('contactame la proxima semana') === 7);
caso('"hablamos mañana" sigue siendo mañana', (wabot_retomar_detectar('hablamos mañana', $ahoraR)['humano'] ?? '') === 'mañana');
caso('"la semana pasada no pude, escribime el lunes" agenda el lunes',
    (wabot_retomar_detectar('la semana pasada no pude, escribime el lunes', $ahoraR)['humano'] ?? '') === 'el lunes 14');

echo "— 8. Postdemo: dos elogios seguidos no derivan —\n";
function convPost() {
    $c = wabot_conv_load('999FPTEST'); $c['transcript'] = [];
    return array_merge($c, ['fase' => 'postdemo', 'presentado_ts' => time() - 600, 'presentado_slug' => 'x',
        'tipo' => 'landing', 'precio_dado' => true, 'lead_creado' => true, 'cta_muestra' => true, 'nombre' => 'Ana']);
}
function turnoFP(&$c, $m) {
    global $cfg;
    wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    $r = wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg);
    foreach ((array)$r as $g) wabot_conv_transcript($c, 'bot', $g);
    return (array)$r;
}
$cP = convPost();
$r1 = turnoFP($cP, 'me encanta!!'); $r2 = turnoFP($cP, 'quedó hermosa la verdad');
caso('el primer elogio pregunta por los cambios', count($r1) === 1 && strpos($r1[0], '?') !== false);
caso('el segundo se calla en vez de derivar', $r2 === [] && $cP['fase'] === 'postdemo' && empty($cP['handoff_pendiente']), json_encode($r2, JSON_UNESCAPED_UNICODE) . ' fase=' . $cP['fase']);
$r3 = turnoFP($cP, 'no le cambiaría nada, cómo sigo?');
caso('y el interés real de después sí avisa que sigue el desarrollador',
    in_array((string)$cfg['postdemo_derivar'], $r3, true) && !empty($cP['postdemo_avisado']), json_encode($r3, JSON_UNESCAPED_UNICODE));
$cM = convPost();
turnoFP($cM, 'dale, la voy a mirar y te digo'); $rM = turnoFP($cM, 'ahora la miro tranquilo y te aviso');
caso('dos "la miro" seguidos tampoco derivan', $rM === [] && $cM['fase'] === 'postdemo');
$cC = convPost();
turnoFP($cC, 'quiero cambiar el color del fondo'); $rC = turnoFP($cC, 'y también cambiar la foto de arriba');
caso('dos pedidos de cambio se acusan los dos y se anotan',
    $rC !== [] && strpos((string)($cC['cambios_pedidos'] ?? ''), 'foto de arriba') !== false, json_encode($rC, JSON_UNESCAPED_UNICODE));
$cA = convPost(); $rA = turnoFP($cA, 'puedo agregar más fotos a la demo?');
caso('"puedo agregar más fotos a la demo?" es un pedido de cambio, no la info de carga',
    strpos((string)($cA['cambios_pedidos'] ?? ''), 'fotos') !== false && stripos(implode(' ', $rA), 'cargamos hasta 10') === false,
    json_encode($rA, JSON_UNESCAPED_UNICODE));

echo "— 9. \"Te paso X con Y\" no es una derivación —\n";
foreach (['Te paso el detalle con lo que incluye el hosting: está incluido el primer año.',
          'Perfecto, te paso el link con los trabajos: gokywebs.com/portfolio',
          'Te paso la info directamente: el mantenimiento es opcional.',
          'Sí, te lo paso con el detalle en un momento.',
          'La conecto con el pixel de Meta sin problema.'] as $f) {
    caso('NO anuncia handoff: "' . mb_substr($f, 0, 50) . '"', wabot_texto_anuncia_handoff($f) === false);
}
foreach (['Dale, te comunico directamente con el desarrollador.', 'Te paso con el desarrollador para que coordinen.',
          'Perfecto, te paso directamente con él.', 'Sí, te paso con el desarrollador.', 'Te paso con él para que lo vean.'] as $f) {
    caso('sigue anunciando handoff: "' . $f . '"', wabot_texto_anuncia_handoff($f) === true);
}

echo "— 10. Los descuentos de SU tienda no son regateo —\n";
foreach (['la tienda puede tener cupones de descuento?', 'vendo con 10% de descuento los lunes', 'remeras 100% algodón',
          'quiero que la web muestre las ofertas y promos'] as $f) {
    caso('NO es regateo: "' . $f . '"', wabot_es_regateo($f) === false);
}
foreach (['no hay forma de que me lo dejes en 150?', 'dale, si me haces 10 por ciento de descuento cierro ya',
          'y si pago en efectivo, ahi si baja?', 'me baja el precio si pago todo junto?', 'me haces un descuento?'] as $f) {
    caso('sigue siendo regateo: "' . $f . '"', wabot_es_regateo($f) === true);
}

echo "— 11. Claves de info: tema + forma de pregunta —\n";
caso('"vendo abonos mensuales de gimnasio" no es mantenimiento', wabot_info_por_palabras('vendo abonos mensuales de gimnasio', 'menu') !== 'mantenimiento');
caso('"tiene mantenimiento mensual?" sí', wabot_info_por_palabras('tiene mantenimiento mensual?', 'prediseno') === 'mantenimiento');
caso('"y despues tengo que pagarles mantenimiento todos los meses?" sí', wabot_info_por_palabras('y despues tengo que pagarles mantenimiento todos los meses?') === 'mantenimiento');
caso('"hay que pagar algo por mes?" sí', wabot_info_por_palabras('hay que pagar algo por mes?') === 'mantenimiento');
caso('"quiero que mis clientes paguen por mercado pago" no es pago', wabot_info_por_palabras('quiero que mis clientes paguen por mercado pago', 'menu') !== 'pago');
caso('"se puede pagar con mercado pago?" sí', wabot_info_por_palabras('se puede pagar con mercado pago?', 'prediseno') === 'pago');
caso('"cuánto tiempo llevan en el mercado?" no son plazos', wabot_info_por_palabras('cuánto tiempo llevan en el mercado?', 'prediseno') === 'ejemplos');
caso('"cuánto tiempo tarda?" sigue siendo plazos', wabot_info_por_palabras('cuánto tiempo tarda?', 'prediseno') === 'plazos');
caso('"mi negocio se llama Buen Valor" no pide el precio', wabot_info_por_palabras('mi negocio se llama Buen Valor', 'prediseno') !== 'precio_actual');
caso('"costo?" solo sí', wabot_info_por_palabras('costo?', 'prediseno') === 'precio_actual');
caso('"y el precio" también', wabot_info_por_palabras('y el precio', 'prediseno') === 'precio_actual');

caso('"atiendo por videollamada" no es la info de reuniones', wabot_info_por_palabras('Soy psicóloga, atiendo por videollamada, quiero una web', 'menu') !== 'reuniones');
caso('"podemos hacer una reunión?" sí', wabot_info_por_palabras('podemos hacer una reunión?', 'prediseno') === 'reuniones');
caso('"ahí te mandé el formulario" no pregunta por formularios', wabot_info_por_palabras('ahí te mandé el formulario', 'prediseno') !== 'formularios');
caso('"se pueden hacer formularios en la web?" sí', wabot_info_por_palabras('se pueden hacer formularios en la web?', 'prediseno') === 'formularios');
caso('"soy psicóloga" es sitio profesional', wabot_fallback_rubro_local('soy psicologa, atiendo por videollamada') === 'landing');
caso('"vendo insumos médicos" sigue siendo comercio', wabot_fallback_rubro_local('vendo insumos medicos') !== 'landing');
caso('"dale, hagamos la demo" no es una descripción del negocio', wabot_texto_no_es_descripcion('dale, hagamos la demo') === true);
caso('"vendo ropa de mujer, tengo local en Salta" sí lo es', wabot_texto_no_es_descripcion('vendo ropa de mujer, tengo local en Salta') === false);
$cEsp = wabot_conv_load('999FPTEST'); $cEsp['transcript'] = [];
$cEsp = array_merge($cEsp, ['fase' => 'prediseno', 'tipo' => 'landing', 'precio_dado' => true, 'cta_muestra' => true, 'link_form_enviado' => true]);
$e1 = wabot_anti_repeticion([(string)$cfg['prediseno_espera']], $cEsp, $cfg);
$e2 = wabot_anti_repeticion([(string)$cfg['prediseno_espera']], $cEsp, $cfg);
caso('"cuando completes el formulario" repetido se calla en vez de derivar', $e1 !== [] && $e2 === [] && $cEsp['fase'] === 'prediseno');

echo "— 12. El flyer del propio cliente no es un proveedor —\n";
caso('la agencia que pega su flyer y pide su web es un cliente',
    wabot_texto_es_proveedor("Hola! Somos una agencia de marketing digital y manejo de redes sociales para pymes. Nuestros planes son desde \$50.000 por mes. Consultanos por WhatsApp. Quiero una página web para mostrar nuestros servicios.") === false);
caso('el volante que solo ofrece sigue siendo proveedor',
    wabot_texto_es_proveedor('Somos una agencia de marketing digital, hacemos paginas web y redes sociales. Consultanos por nuestros planes: 15000 por mes.') === true);

echo "— 13. Trabajo y clientes viejos por palabras sueltas —\n";
caso('"necesito más trabajo para mi taller" no es laboral', wabot_contexto_consulta('necesito más trabajo para mi taller') === null);
caso('"busco trabajo, soy plomero" sigue siendo laboral', wabot_contexto_consulta('busco trabajo, soy plomero') === 'laboral');
caso('"ya pagué otra web y fue un desastre, quiero una nueva" es un lead', wabot_contexto_consulta('ya pagué otra web y fue un desastre, quiero una nueva') === null);
caso('"Ya pagué la seña, cuando empiezan?" sigue siendo cliente existente', wabot_contexto_consulta('Ya pagué la seña, cuando empiezan?') === 'cliente_existente');

echo "— 14. \"Quiero avanzar con la demo\" no autoriza un handoff de pago —\n";
caso('"Dale, quiero avanzar con la demo gratis"', wabot_handoff_causa_explicita('Dale, quiero avanzar con la demo gratis') === null);
caso('"quiero arrancar con una web para mi negocio"', wabot_handoff_causa_explicita('quiero arrancar con una web para mi negocio') === null);
caso('"quiero contratar" sigue siendo pago', wabot_handoff_causa_explicita('quiero contratar') === 'pago_explicito');
caso('"mandame el cbu" también', wabot_handoff_causa_explicita('mandame el cbu') === 'pago_explicito');

echo "— 15. El reset a los 7 días arranca el proyecto de cero —\n";
$cR = wabot_conv_load('999FPTEST');
$cR = array_merge($cR, ['tipo' => 'landing', 'precio_dado' => true, 'pitch_hecho' => true, 'pitch_tipo' => 'landing', 'fase' => 'prediseno',
    'link_form_enviado' => true, 'cta_muestra' => true, 'form_completado_ts' => time() - 20 * 86400, 'lead_creado' => true,
    'ultimo_ts' => time() - 20 * 86400, 'codigo' => 'ZZ', 'transcript' => []]);
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('pitch_hecho y pitch_tipo se limpian', empty($cR['pitch_hecho']) && empty($cR['pitch_tipo']));
caso('link_form_enviado y form_completado_ts también', empty($cR['link_form_enviado']) && (int)$cR['form_completado_ts'] === 0);
caso('el código corto se conserva', $cR['codigo'] === 'ZZ');
$cR['transcript'][] = ['q' => 'cliente', 't' => 'Hola, soy abogado y quiero una web', 'ts' => time()];
$rR = wabot_precio('landing', $cR, $cfg);
caso('el precio del que vuelve sale con descripción y, en otro mensaje, los tres pasos (sin link)',
    count($rR) === 2 && wabot_texto_arranca_con_propuesta($rR[0]) && stripos($rR[0], 'que presente tu negocio') !== false
    && stripos($rR[1], 'El primer paso es gratis') !== false
    && strpos(implode("\n", $rR), 'gokywebs.com/form/') === false,
    json_encode($rR, JSON_UNESCAPED_UNICODE));

echo "— 16. Contar cómo cobra uno no pregunta cuándo se paga —\n";
caso('"Hago pagos con mercado pago en mi local, primero quiero ver ejemplos"',
    wabot_texto_pregunta_cuando_se_paga('Hago pagos con mercado pago en mi local, primero quiero ver ejemplos') === false);
caso('"se paga antes o despues?" sigue', wabot_texto_pregunta_cuando_se_paga('se paga antes o despues?') === true);

echo "— 17. La baja se reabre cuando el cliente vuelve a pedir una web —\n";
caso('el motor levanta la baja ante "quiero una web"', (function () use ($cfg) {
    $c = wabot_conv_load('999FPTEST'); $c['transcript'] = [];
    $c['cierre'] = 'baja'; $c['bot_off'] = true; $c['seguimiento_bloqueado'] = true;
    wabot_conv_transcript($c, 'cliente', 'hola, quiero una web para mi negocio'); $c['ultimo_cliente_ts'] = time();
    wabot_responder('hola, quiero una web para mi negocio', $c, $cfg);
    return ($c['cierre'] ?? '') !== 'baja' && empty($c['bot_off']);
})());

echo "— 18. Los tres pasos van en su propio mensaje, detrás del precio (Pablo, 14-sep) —\n";
$cPaso = wabot_conv_load('999FPTEST'); $cPaso['transcript'] = []; $cPaso['tel'] = '5491100000000TEST';
$cPaso['channel_user_id'] = '5491100000000TEST'; $cPaso['canal'] = 'whatsapp';
$rPaso = wabot_pitch('landing', $cPaso, $cfg);
caso('son dos mensajes y los pasos arrancan el segundo',
    count($rPaso) === 2 && mb_strpos($rPaso[1], "El primer paso es gratis:") === 0);
caso('el segundo mensaje ofrece la demo gratis (Pablo, 14-sep)', preg_match('/^El primer paso es gratis: te armamos una demo de tu web para que veas cómo quedaría\./u', $rPaso[1]) === 1);
caso('y la demo está lista en menos de 24 horas (Pablo, 10-sep)', preg_match('/La tenés en menos de 24 horas\./u', $rPaso[1]) === 1);
caso('el primer mensaje trae las dos formas con sus montos (Pablo, 15-sep)',
    preg_match('/1\. Pago único de \$180\.000: la web queda paga/u', $rPaso[0]) === 1);
caso('y el mensual con soporte y mantenimiento técnico (Pablo, 15-sep)',
    mb_stripos($rPaso[0], 'soporte y mantenimiento técnico') !== false);
caso('y cierra preguntando si quiere la demo (11-sep)', preg_match('/\nQuerés que preparemos la demo para tu negocio\?$/u', $rPaso[1]) === 1);
caso('y NO lleva el link del formulario: ese sale cuando el cliente contesta que sí',
    strpos($rPaso[0], 'gokywebs.com/form/') === false);
caso('el bot reconoce ese mensaje como demo ya ofrecida',
    wabot_cta_muestra_ya_ofrecida(['session_started_ts' => time() - 100, 'transcript' => [['q' => 'bot', 't' => $rPaso[1], 'ts' => time()]]]) === true);
caso('pasa entero por el punto único de salida: el servicio y, aparte, la demo',
    (function () use ($cfg, $rPaso, $cPaso) { $c = $cPaso; $out = wabot_salida_preparar($rPaso, $c, $cfg);
        return count($out) === 2 && stripos($out[0], 'servicio mensual') !== false && stripos($out[1], 'demo') !== false
            && stripos(implode("\n", $out), 'seña') === false; })());

echo "— 19. Batería en vivo del 14-sep: cuatro turnos que salían por el camino equivocado —\n";
caso('"¿hay que pagar algo al principio?" no apunta a lo ya dicho (derivaba la charla)',
    wabot_apunta_a_lo_ya_dicho('Como se paga? Hay que pagar algo al principio?') === false);
caso('"como te dije al principio" sí apunta a lo ya dicho',
    wabot_apunta_a_lo_ya_dicho('Como te dije al principio, vendo ropa') === true);
caso('"está al principio del chat" también', wabot_apunta_a_lo_ya_dicho('está al principio del chat') === true);
caso('pagarla una sola vez y mantenerla uno mismo no es preguntar cuándo se paga',
    wabot_texto_pregunta_cuando_se_paga('Y si la pago una sola vez y despues la mantengo yo?') === false
    && wabot_info_por_palabras('Y si la pago una sola vez y despues la mantengo yo?', 'prediseno') === 'un_solo_pago');
caso('"¿se paga antes o después?" sigue siendo cuándo se paga',
    wabot_texto_pregunta_cuando_se_paga('se paga antes o después?') === true);
foreach ([
    'Buenas, tengo un taller de artesanias. Quiero vender insumos online y mas adelante subir cursos',
    'Hola, tengo una tienda de ropa y quiero subir mis productos a una web',
    'Tengo una inmobiliaria y quiero subir mis propiedades',
] as $f) caso('cuenta el proyecto, no pregunta quién carga: "' . $f . '"', wabot_carga_es_el_proyecto($f, []) === true);
foreach (['Los productos los cargo yo?', 'quiero saber si puedo cargar los productos yo', 'quien carga los productos'] as $f) {
    caso('SÍ pregunta quién carga: "' . $f . '"', wabot_carga_es_el_proyecto($f, []) === false);
}
caso('con el precio ya dado, "quiero subir mis productos" vuelve a ser la pregunta de carga',
    wabot_carga_es_el_proyecto('quiero subir mis productos', ['precio_dado' => true, 'tipo' => 'ecommerce']) === false);

$cCombo = wabot_conv_load('998FPTEST'); $cCombo['transcript'] = []; $cCombo['fase'] = 'nuevo';
$cCombo['tel'] = '5491100000001TEST'; $cCombo['channel_user_id'] = '5491100000001TEST'; $cCombo['canal'] = 'whatsapp';
$msjCombo = 'Buenas, tengo un taller de artesanias. Quiero vender insumos online y mas adelante subir cursos';
wabot_conv_transcript($cCombo, 'cliente', $msjCombo);
$rCombo = wabot_agente_intento($msjCombo, $cCombo, $cfg);
caso('el taller de artesanías recibe la cotización de tienda + cursos, no el texto de carga',
    is_array($rCombo) && strpos(implode("\n", $rCombo), 'Plataforma de cursos en módulos') !== false
    && strpos(implode("\n", $rCombo), (string)wabot_texto_info('carga', $cfg)) === false, json_encode($rCombo, JSON_UNESCAPED_UNICODE));

$cOblig = ['tipo' => 'landing', 'precio_dado' => true, 'precio_cotizado' => '$20.000', 'mensualidad_cotizada' => '$20.000',
    'precio_modelo' => 'mensual', 'transcript' => [
        ['q' => 'cliente', 't' => 'Soy psicóloga y quiero una web'],
        ['q' => 'bot', 't' => $rPaso[0]], ['q' => 'bot', 't' => $rPaso[1]],
        ['q' => 'cliente', 't' => 'Es obligatorio pagar todos los meses?']]];
$rOblig = wabot_respuesta_obligatorio($cOblig, $cfg, 'Es obligatorio pagar todos los meses?');
caso('"¿es obligatorio pagar todos los meses?" con el precio en dos mensajes: contesta el texto del servicio, no el modelo',
    wabot_texto_pregunta_si_es_obligatorio('Es obligatorio pagar todos los meses?')
    && $rOblig !== null && mb_strpos($rOblig, 'No: el servicio mensual es una de las dos formas') === 0, (string)$rOblig);
@unlink(WABOT_DATA . '/conv/998FPTEST.json');

echo "-- 20. El saludo repetido y la empresa de mantenimiento (lead 5735, 14-sep) --\n";
caso('el saludo repetido por el modelo se reformula en vez de derivar',
    wabot_texto_reformulado([(string)$cfg['menu']], $cfg) === (string)$cfg['contame']);
caso('empresa de mantenimiento cuenta su negocio: no es la pregunta por el plan',
    wabot_info_por_palabras('Soy tecnico de mantenimiento y tengo una empresa de servicio de mantenimiento', 'menu') === null);
caso('pero la pregunta por el mantenimiento sigue siendo mantenimiento',
    wabot_info_por_palabras('el mantenimiento es obligatorio?', 'menu') === 'mantenimiento');

echo "-- 21. Auditoría del modelo doble (batería del 15-sep) --\n";
$c21 = wabot_conv_load('997FPTEST'); $c21['transcript'] = [];
$c21['tel'] = '5491100000002TEST'; $c21['channel_user_id'] = '5491100000002TEST'; $c21['canal'] = 'whatsapp';
$c21['tipo'] = 'landing'; $c21['precio_dado'] = true; $c21['fase'] = 'prediseno';
wabot_precio_congelar($c21, 'landing', $cfg);
$v21 = wabot_precio_vigente($c21, $cfg);

foreach (['Con el pago unico despues tengo que pagar algo mas?', 'Si pago la seña y despues no me gusta, me la devuelven?', 'Y no se puede pagar de una?'] as $f) {
    caso('no es la pregunta del orden del pago: "' . $f . '"', wabot_texto_pregunta_cuando_se_paga($f) === false);
}
caso('"¿no se puede pagar de una?" pide el pago único', wabot_pide_un_solo_pago('Y no se puede pagar de una?') === true);
caso('"no puedo pagar todo junto, en cuotas?" no lo pide', wabot_pide_un_solo_pago('no puedo pagar todo junto, en cuotas?') === false);
$fCambio = 'Si arranco con el mensual y despues me quiero pasar al pago unico se puede?';
caso('pasarse del mensual al pago único no es pedir el pago único',
    wabot_pide_un_solo_pago($fCambio) === false && wabot_texto_pregunta_cambio_modalidad($fCambio) === true);
caso('cambiar los textos más adelante no es cambiar de forma de pago',
    wabot_texto_pregunta_cambio_modalidad('con el mensual puedo cambiar los textos despues?') === false);

$rCostos = wabot_respuesta_pago_fija('Con el pago unico despues tengo que pagar algo mas?', $c21, $cfg);
caso('lo que queda para después con el pago único: la renovación, sin la demo',
    is_array($rCostos) && mb_stripos($rCostos[0], 'renovar el hosting') !== false && mb_stripos($rCostos[0], 'demo') === false,
    json_encode($rCostos, JSON_UNESCAPED_UNICODE));
$c21b = $c21;
$rDev = wabot_respuesta_pago_fija('Si pago la seña y despues no me gusta, me la devuelven?', $c21b, $cfg);
caso('la devolución no se inventa y queda para el desarrollador',
    is_array($rDev) && mb_stripos($rDev[0], 'te lo confirma el desarrollador') !== false && !empty($c21b['handoff_pendiente']));
caso('las devoluciones de SU tienda no son esto',
    wabot_texto_pregunta_devolucion('la tienda permite devoluciones de productos a mis clientes?') === false);
$rCambio = wabot_respuesta_pago_fija($fCambio, $c21, $cfg);
caso('pasarse de forma: sin prometer que se puede',
    is_array($rCambio) && mb_stripos($rCambio[0], 'se puede') === false && mb_stripos($rCambio[0], 'desarrollador') !== false,
    json_encode($rCambio, JSON_UNESCAPED_UNICODE));
$rCual = wabot_respuesta_pago_fija('Cual me conviene mas, pagar una vez o por mes?', $c21, $cfg);
caso('"cuál conviene": las dos formas con los montos de la charla, sin elegir por él',
    is_array($rCual) && mb_strpos($rCual[0], $v21['precio']) !== false && mb_strpos($rCual[0], $v21['mensualidad']) !== false
    && mb_stripos($rCual[0], 'entonces te conviene') === false, json_encode($rCual, JSON_UNESCAPED_UNICODE));
$cSin = wabot_conv_load('996FPTEST'); $cSin['transcript'] = [];
$cSin['tel'] = '5491100000003TEST'; $cSin['channel_user_id'] = '5491100000003TEST'; $cSin['canal'] = 'whatsapp';
wabot_conv_transcript($cSin, 'cliente', 'Doy clases de yoga y quiero vender mis cursos grabados');
$rCualSin = wabot_respuesta_pago_fija('Cual me conviene mas, pagar una vez o por mes?', $cSin, $cfg);
caso('"cuál conviene" sin tipo: sin montos y sin volver a pedir el rubro ya dicho',
    is_array($rCualSin) && mb_strpos($rCualSin[0], '$') === false && mb_stripos($rCualSin[0], 'a qué te dedicás') === false,
    json_encode($rCualSin, JSON_UNESCAPED_UNICODE));

$sena21 = $v21['sena']; $mens21 = $v21['mensualidad'];
$senaMil = (int)(wabot_monto_a_numero($sena21) / 1000);
$mensMil = (int)(wabot_monto_a_numero($mens21) / 1000);
$rSena = wabot_respuesta_pago_fija("Entonces pago $senaMil mil por mes?", $c21, $cfg);
caso('la seña leída como mensualidad se corrige con un no',
    is_array($rSena) && mb_strpos($rSena[0], 'No: los ' . $sena21 . ' son la seña') === 0 && mb_strpos($rSena[0], $mens21) !== false,
    json_encode($rSena, JSON_UNESCAPED_UNICODE));
$rMens = wabot_respuesta_pago_fija("Ah o sea que son $mensMil mil y listo, pago una sola vez?", $c21, $cfg);
caso('la mensualidad leída como pago único también',
    is_array($rMens) && mb_strpos($rMens[0], 'No: los ' . $mens21 . ' son por mes') === 0 && mb_strpos($rMens[0], $v21['precio']) !== false,
    json_encode($rMens, JSON_UNESCAPED_UNICODE));
caso('entenderlo bien no dispara la corrección', wabot_texto_confusion_montos("Los $mensMil mil por mes incluyen el hosting?", $c21, $cfg) === null);
$rInicio = wabot_respuesta_pago_fija('Y si elijo el mensual cuánto pago al principio?', $c21, $cfg);
caso('"con el mensual cuánto pago al principio?": no hay pago inicial, con la mensualidad',
    is_array($rInicio) && mb_strpos($rInicio[0], 'no hay pago inicial') !== false && mb_strpos($rInicio[0], $mens21) !== false
    && mb_strpos($rInicio[0], $v21['precio']) === false, json_encode($rInicio, JSON_UNESCAPED_UNICODE));
caso('"cuánto es la seña para arrancar?" sigue siendo la seña del pago único',
    wabot_texto_pregunta_inicio_mensual('Cuánto es la seña para arrancar?') === false);

$c21d = $c21;
$rDesc = wabot_regateo_responder('Con transferencia hay descuento?', $c21d, $cfg);
caso('"¿hay descuento?" se contesta con el no y las dos formas, no con el texto de caro',
    is_array($rDesc) && mb_strpos($rDesc[0], 'No manejamos descuentos') === 0 && mb_strpos($rDesc[0], $v21['precio']) !== false
    && mb_strpos($rDesc[0], $mens21) !== false, json_encode($rDesc, JSON_UNESCAPED_UNICODE));
wabot_regateo_responder('Dejamelo en 150 mil y cerramos', $c21d, $cfg);
caso('y si después regatea con un número, lo toma el desarrollador', ($c21d['fase'] ?? '') === 'derivado');
caso('"no hay forma de que me lo dejes en 150?" es contraoferta', wabot_regateo_es_contraoferta('no hay forma de que me lo dejes en 150?') === true);
caso('"si pago todo junto me hacés descuento?" no lo es', wabot_regateo_es_contraoferta('Si pago todo junto me haces descuento?') === false);

caso('"contame a qué te dedicás y te paso el valor" no es una promesa sin entregar',
    wabot_texto_promete_info_sin_entregar('Si me contás brevemente a qué te dedicás, te paso el presupuesto exacto al toque.') === false
    && wabot_texto_promete_info_sin_entregar('Contame a qué te dedicás y te paso el valor.') === false);
caso('la primera cuota del servicio mensual, con su monto, no es un monto de cuota inventado',
    wabot_texto_dice_monto_de_cuota('Para arrancar con el servicio mensual pagás únicamente la primera cuota de ' . $mens21 . ', no hay pago inicial.', $cfg) === false);
caso('pero 12 cuotas con monto se sigue cortando aunque haya cfg',
    wabot_texto_dice_monto_de_cuota('Se puede en 12 cuotas de $20.135', $cfg) === true);

$cUp = $c21;
$cUp['upgrade_pendiente'] = wabot_precio_vigente(null, $cfg, 'ecommerce');
$vUp = $cUp['upgrade_pendiente'];
wabot_conv_transcript($cUp, 'bot', (string)wabot_upgrade_texto('ecommerce', $cUp, $cfg));
$rUpSena = wabot_upgrade_pago_texto($vUp, $cUp, $cfg);
caso('la seña después del upgrade es la de la tienda, no la del sitio',
    mb_strpos($rUpSena, $vUp['sena']) !== false && mb_strpos($rUpSena, $v21['sena']) === false, $rUpSena);
caso('la tienda consultada de nuevo se confirma corta, no con el mismo texto',
    wabot_upgrade_confirmacion_texto($vUp, $cUp, $cfg) !== wabot_upgrade_texto('ecommerce', $cUp, $cfg));

caso('"doy clases de yoga y quiero vender mis cursos grabados" es cursos, no el yoga de la lista',
    wabot_fallback_rubro_local('Doy clases de yoga y quiero vender mis cursos grabados') === 'cursos');
caso('un estudio de yoga solo sigue siendo sitio profesional', wabot_fallback_rubro_local('Tengo un estudio de yoga') === 'landing');
echo "-- 22. Auditoría estática del modelo doble (15-sep) --\n";
require_once __DIR__ . '/redactor.php';
caso('"no me interesa el mensual" no cierra la venta', wabot_cierre_sin_presion_tipo('no me interesa el mensual') === null);
caso('"no me interesa" solo sigue siendo rechazo', wabot_cierre_sin_presion_tipo('no me interesa') === 'rechazo');
$rRechMens = wabot_respuesta_pago_fija('No me interesa el mensual', $c21, $cfg);
caso('rechazar el mensual ofrece el pago único', is_array($rRechMens) && mb_stripos($rRechMens[0], 'pago único') !== false,
    json_encode($rRechMens, JSON_UNESCAPED_UNICODE));
$rRechUnico = wabot_respuesta_pago_fija('no me interesa el pago unico', $c21, $cfg);
caso('rechazar el pago único ofrece el mensual con su monto', is_array($rRechUnico) && mb_strpos($rRechUnico[0], $mens21) !== false,
    json_encode($rRechUnico, JSON_UNESCAPED_UNICODE));
caso('"cuánto sale?" repetido sin rubro se repregunta con otras palabras, no se deriva',
    wabot_texto_reformulado([wabot_texto_info('precio_sin_rubro', $cfg)], $cfg) === (string)$cfg['contame_2']);

foreach (['el pago unico incluye lo mismo que el mensual?', 'con el pago unico tengo que pagar mantenimiento?',
          'el mensual a la larga no sale mas caro que el pago unico?', 'el pago unico incluye el desarrollo completo?'] as $f) {
    caso('compara o pregunta qué trae, no pide el pago único: "' . $f . '"', wabot_pide_un_solo_pago($f) === false);
}
caso('"tienen pago único?" sí lo pide', wabot_pide_un_solo_pago('tienen pago unico?') === true);
caso('"puedo pagarla una sola vez?" también', wabot_pide_un_solo_pago('puedo pagarla una sola vez?') === true);
caso('"la diferencia entre las dos formas" es la pregunta de cuál conviene',
    wabot_texto_pregunta_cual_forma_conviene('cual es la diferencia entre las dos formas?') === true);

$cFall = $c21;
$cFall['cta_muestra'] = true; $cFall['link_form_enviado'] = false; $cFall['lead_creado'] = false;
$cFall['form_completado_ts'] = 0; $cFall['presentado_ts'] = 0; $cFall['prediseno_pedido'] = []; $cFall['handoff_pendiente'] = false;
$cfgForm = $cfg; $cfgForm['form_activo'] = true;
$rFall = wabot_fallback_ia('me pasas el link para suscribirme?', $cFall, $cfgForm);
caso('sin IA, una pregunta en el prediseño no se lleva el formulario',
    is_array($rFall) && strpos(implode(' ', $rFall), 'gokywebs.com/form') === false && !empty($cFall['handoff_pendiente']),
    json_encode($rFall, JSON_UNESCAPED_UNICODE));

foreach (['vamos con el pago unico', 'me pasas el CBU?', 'como me suscribo?', 'prefiero pagarla una sola vez', 'quiero el mensual'] as $f) {
    caso('después de la demo es interés real: "' . $f . '"', wabot_postdemo_avance_explicito($f) === true);
}
caso('"ya me suscribí" avisa el pago', wabot_dice_que_pago('ya me suscribi') === true);
caso('"¿tienen factura?" va a facturación', wabot_info_por_palabras('tienen factura?', 'prediseno') === 'facturacion');
caso('"¿con el mensual a los cuántos meses la web es mía?" va a titularidad',
    wabot_info_por_palabras('con el mensual a los cuantos meses la web es mia?', 'prediseno') === 'titularidad');

foreach (['Con el servicio mensual arrancás con una seña de $40.000 y el resto al entregar.',
          'El pago único es de $20.000 y listo.',
          'El mantenimiento es obligatorio: son $20.000 por mes.',
          'El servicio mensual tiene una permanencia mínima de 12 meses.',
          'El saldo lo pagás en 8 pagos de $30.000.'] as $mal) {
    caso('mezcla las dos formas: "' . mb_substr($mal, 0, 50) . '"', wabot_texto_mezcla_formas($mal, $cfg) === true);
}
foreach ([wabot_texto_pago($c21, $cfg), wabot_texto_mantenimiento($c21, $cfg), wabot_texto_caro($c21, $cfg),
          wabot_texto_info('titularidad', $cfg, $c21), wabot_texto_info('baja_del_plan', $cfg, $c21),
          wabot_texto_info('que_incluye', $cfg, $c21), wabot_texto_descuento($c21, $cfg), (string)wabot_texto_saldo_cuando($c21, $cfg),
          'No, el servicio mensual no es obligatorio y no tiene permanencia.'] as $bien) {
    caso('texto correcto no se toma como mezcla: "' . mb_substr($bien, 0, 50) . '"', wabot_texto_mezcla_formas($bien, $cfg) === false);
}

$cObl2 = $c21;
$cObl2['transcript'] = [['q' => 'cliente', 't' => 'Es obligatorio pagar todos los meses?'],
    ['q' => 'bot', 't' => (string)$cfg['respuesta_plan_obligatorio']], ['q' => 'cliente', 't' => 'O sea que no es obligatorio?']];
caso('"¿o sea que no es obligatorio?" después de la respuesta también se contesta fijo',
    wabot_respuesta_obligatorio($cObl2, $cfg, 'O sea que no es obligatorio?') !== null);

$rSaldo = wabot_respuesta_pago_fija('el saldo cuando se paga?', $c21, $cfg);
caso('"¿el saldo cuándo se paga?": al entregar, con el monto', is_array($rSaldo) && mb_strpos($rSaldo[0], $v21['saldo']) !== false,
    json_encode($rSaldo, JSON_UNESCAPED_UNICODE));
$rAntes = wabot_respuesta_pago_fija('Pasame el link de mercado pago para suscribirme al mensual', $c21, $cfg);
caso('pedir el link de pago antes de la demo: primero va la demo gratis', is_array($rAntes) && mb_strpos($rAntes[0], 'Primero va la demo') === 0,
    json_encode($rAntes, JSON_UNESCAPED_UNICODE));

$baseDos = wabot_texto_pago($c21, $cfg);
caso('en modo agente, "la seña es de $X" alcanza sin repetir los otros montos',
    wabot_validar_redaccion('La seña es de ' . $sena21 . '.', $baseDos, $cfg, false) !== null
    && wabot_validar_redaccion('La seña es de ' . $sena21 . '.', $baseDos, $cfg) === null);
caso('pero un monto que no está en la base se sigue cortando', wabot_validar_redaccion('La seña es de $35.000.', $baseDos, $cfg, false) === null);

$cQ07 = wabot_conv_load('995FPTEST'); $cQ07['transcript'] = []; $cQ07['fase'] = 'nuevo';
$cQ07['tel'] = '5491100000004TEST'; $cQ07['channel_user_id'] = '5491100000004TEST'; $cQ07['canal'] = 'whatsapp';
$mQ07 = 'Cuanto sale una web para mostrar mis servicios y cuanto una tienda online?';
wabot_conv_transcript($cQ07, 'cliente', $mQ07);
$rQ07 = wabot_agente_intento($mQ07, $cQ07, $cfg);
caso('dos tipos en la pregunta y sin rubro dicho antes: pide el rubro, no cotiza uno solo',
    $rQ07 === [wabot_texto_info('precio_sin_rubro', $cfg)], json_encode($rQ07, JSON_UNESCAPED_UNICODE));
$cF04 = wabot_conv_load('994FPTEST'); $cF04['transcript'] = []; $cF04['fase'] = 'nuevo';
$cF04['tel'] = '5491100000005TEST'; $cF04['channel_user_id'] = '5491100000005TEST'; $cF04['canal'] = 'whatsapp';
wabot_conv_transcript($cF04, 'cliente', 'Doy clases de yoga y quiero vender mis cursos grabados');
wabot_conv_transcript($cF04, 'bot', 'Buenísimo. Querés que los alumnos compren y vean los cursos desde la web, o que te consulten por WhatsApp?');
wabot_conv_transcript($cF04, 'cliente', 'Cuanto sale?');
$rF04 = wabot_agente_intento('Cuanto sale?', $cF04, $cfg);
caso('con el rubro dicho antes, "cuánto sale?" da los dos precios del desempate de cursos',
    is_array($rF04) && strpos(implode(' ', $rF04), 'Cuál de las dos te sirve más') !== false && ($cF04['fase'] ?? '') === 'desempate_cursos',
    json_encode($rF04, JSON_UNESCAPED_UNICODE));

// Lo viejo no se toca (Pablo, 15-sep): la charla del pago único de antes del 10-sep sigue igual.
$cViejo = $c21;
$cViejo['precio_cotizado'] = '$160.000'; $cViejo['sena_cotizada'] = ''; $cViejo['mensualidad_cotizada'] = ''; $cViejo['precio_modelo'] = 'unico';
caso('la charla con el pago único viejo no recibe las respuestas fijas nuevas',
    wabot_precio_vigente($cViejo, $cfg)['modelo'] === 'unico'
    && wabot_respuesta_pago_fija('Con el pago unico despues tengo que pagar algo mas?', $cViejo, $cfg) === null
    && wabot_respuesta_pago_fija('cual es la diferencia entre las dos formas?', $cViejo, $cfg) === null);
$cViejoD = $cViejo;
$rViejoD = wabot_regateo_responder('Con transferencia hay descuento?', $cViejoD, $cfg);
caso('y a su "¿hay descuento?" le llega la respuesta de siempre',
    is_array($rViejoD) && $rViejoD[0] === wabot_texto_caro($cViejo, $cfg), json_encode($rViejoD, JSON_UNESCAPED_UNICODE));

@unlink(WABOT_DATA . '/conv/997FPTEST.json');
@unlink(WABOT_DATA . '/conv/996FPTEST.json');
@unlink(WABOT_DATA . '/conv/995FPTEST.json');
@unlink(WABOT_DATA . '/conv/994FPTEST.json');

echo "-- 23. La forma de pago que eligió el cliente va al boceto (15-sep) --\n";
foreach (['Prefiero pagarla una sola vez' => 'unico', 'Vamos con el pago unico, me pasas el CBU?' => 'unico',
          'No me interesa el mensual' => 'unico', 'Quiero avanzar con el pago mensual' => 'mensual',
          'quiero el mensual' => 'mensual', 'No quiero pagar todo junto, prefiero por mes' => 'mensual'] as $f => $esperada) {
    caso("elige $esperada: \"$f\"", wabot_modalidad_elegida_en($f) === $esperada, (string)wabot_modalidad_elegida_en($f));
}
foreach (['Puedo pagarla una sola vez?', 'Y si no quiero pagar todo junto?', 'Quiero saber del pago unico',
          'Cual me conviene mas, pagar una vez o por mes?', 'dale vamos de una'] as $f) {
    caso('no elige nada: "' . $f . '"', wabot_modalidad_elegida_en($f) === null, (string)wabot_modalidad_elegida_en($f));
}
$cMod = $c21;
$cMod['modalidad_elegida'] = ''; $cMod['modalidad_sincronizada'] = ''; $cMod['lead_creado'] = false; $cMod['lead_doc'] = null;
caso('anota la forma elegida', wabot_modalidad_anotar('Prefiero pagarla una sola vez', $cMod, $cfg) === true && $cMod['modalidad_elegida'] === 'unico');
caso('y el boceto la lleva en modalidad', strpos(json_encode(wabot_lead_campos($cMod, $cfg)), '"modalidad":{"stringValue":"unico"}') !== false);
$cMod['lead_creado'] = true; $cMod['lead_doc'] = 'projects/demo/databases/(default)/documents/propuestas/abc'; $cMod['modalidad_sincronizada'] = 'unico';
caso('si después cambia de idea, se completa en el boceto que ya existe',
    wabot_modalidad_anotar('Mejor quiero el mensual', $cMod, $cfg) === true
    && $cMod['modalidad_elegida'] === 'mensual' && $cMod['modalidad_sincronizada'] === 'mensual');
$cModViejo = $cViejo; $cModViejo['modalidad_elegida'] = '';
caso('la charla del pago único viejo no se toca',
    wabot_modalidad_anotar('Quiero el mensual', $cModViejo, $cfg) === false && $cModViejo['modalidad_elegida'] === '');

@unlink(WABOT_DATA . '/conv/999FPTEST.json');

echo "-- 24. Prospecto: eligió una forma después del precio, el bot se calla (15-sep) --\n";
$c24 = wabot_conv_load('993FPTEST'); $c24['transcript'] = [];
$c24['tel'] = '5491100000006TEST'; $c24['channel_user_id'] = '5491100000006TEST'; $c24['canal'] = 'whatsapp';
$c24['tipo'] = 'landing'; $c24['precio_dado'] = true; $c24['fase'] = 'prediseno';
$c24['bot_off'] = false; $c24['prospecto'] = false; $c24['cierre'] = null;
wabot_precio_congelar($c24, 'landing', $cfg);
// Forzado a 'doble' por si el bot-config de este entorno de test no tiene
// mensualidad cargada para 'landing' (wabot_precio_congelar cae a 'unico'
// cuando eso pasa): el caso que este bloque prueba es justo el de las dos
// formas, así que no puede depender de que el config del entorno la tenga.
$c24['precio_modelo'] = 'doble';
if ($c24['mensualidad_cotizada'] === '') $c24['mensualidad_cotizada'] = '$20.000';
if ($c24['sena_cotizada'] === '') $c24['sena_cotizada'] = '$40.000';
if ($c24['precio_cotizado'] === '') $c24['precio_cotizado'] = '$180.000';

caso('elegir el pago único ya cotizado dispara prospecto', wabot_prospecto_detectar('Vamos con el pago único', $c24, $cfg) === true);
caso('preguntar (sin elegir) no dispara prospecto', wabot_prospecto_detectar('¿Puedo pagarla de una sola vez?', $c24, $cfg) === false);
$cSinPrecio = $c24; $cSinPrecio['precio_dado'] = false;
caso('sin precio dado, no dispara aunque elija', wabot_prospecto_detectar('Vamos con el mensual', $cSinPrecio, $cfg) === false);
$cYa = $c24; $cYa['prospecto'] = true;
caso('ya marcado como prospecto, no vuelve a disparar', wabot_prospecto_detectar('Vamos con el pago único', $cYa, $cfg) === false);
$cOff = $c24; $cOff['bot_off'] = true;
caso('con el bot ya apagado acá, no vuelve a disparar', wabot_prospecto_detectar('Vamos con el pago único', $cOff, $cfg) === false);

$cResp = $c24;
$out24 = wabot_responder('Prefiero pagarla una sola vez', $cResp, $cfg);
caso('el bot no contesta nada (se calla)', $out24 === [], json_encode($out24, JSON_UNESCAPED_UNICODE));
caso('la charla queda marcada como prospecto', !empty($cResp['prospecto']));
caso('se apaga el bot acá (reusa bot_off)', !empty($cResp['bot_off']));
caso('guarda la forma que eligió', $cResp['prospecto_forma'] === 'unico');
caso('y el boceto la lleva en esProspecto', strpos(json_encode(wabot_lead_campos($cResp, $cfg)), '"esProspecto":{"booleanValue":true}') !== false);

$cViejoProsp = $cViejo; $cViejoProsp['prospecto'] = false; $cViejoProsp['bot_off'] = false;
caso('la charla del pago único viejo no tiene "dos formas" para elegir',
    wabot_prospecto_detectar('Vamos con el pago único', $cViejoProsp, $cfg) === false);

@unlink(WABOT_DATA . '/conv/993FPTEST.json');
echo "\n" . ($fallas ? "FALLAS: $fallas de $total" : "TODO OK — $total casos") . "\n";
exit($fallas ? 1 : 0);
