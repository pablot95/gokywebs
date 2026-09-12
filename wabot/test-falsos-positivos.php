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
caso('el precio del que vuelve sale con descripción y con los tres pasos pegados (sin link)',
    count($rR) === 1 && wabot_texto_arranca_con_propuesta($rR[0]) && stripos($rR[0], 'que presente tu negocio') !== false
    && stripos($rR[0], 'tres pasos') !== false
    && strpos($rR[0], 'gokywebs.com/form/') === false,
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

echo "— 18. Los tres pasos van pegados al precio, en el mismo mensaje (Pablo, 11-sep) —\n";
$cPaso = wabot_conv_load('999FPTEST'); $cPaso['transcript'] = []; $cPaso['tel'] = '5491100000000TEST';
$cPaso['channel_user_id'] = '5491100000000TEST'; $cPaso['canal'] = 'whatsapp';
$rPaso = wabot_pitch('landing', $cPaso, $cfg);
caso('es un solo mensaje y los pasos arrancan después del precio',
    count($rPaso) === 1 && mb_strpos($rPaso[0], "\n\nAsí trabajamos, en tres pasos:") !== false);
caso('paso 1: la primera entrega es gratis (Pablo, 11-sep)', preg_match('/1\. La primera entrega es gratis: te armamos una demo de tu web para que veas cómo quedaría\./u', $rPaso[0]) === 1);
caso('paso 1: y la demo está lista en menos de 24 horas (Pablo, 10-sep)', preg_match('/1\. .*La tenés en menos de 24 horas\./u', $rPaso[0]) === 1);
caso('paso 2: el primer pago con su monto y para qué es (Pablo, 11-sep)',
    preg_match('/2\. Si te gusta y querés avanzar, se hace un primer pago de \$60\.000 y con eso avanzamos hacia el desarrollo completo\./u', $rPaso[0]) === 1);
caso('paso 3: a los 30 días, el plan mensual con su monto y para qué sirve',
    preg_match('/3\. A los 30 días del primer pago comienza el plan mensual, para mantener tu web funcionando correctamente y actualizada\./u', $rPaso[0]) === 1);
caso('y cierra preguntando si quiere la demo (11-sep)', preg_match('/\nQuerés que preparemos la demo para tu negocio\?$/u', $rPaso[0]) === 1);
caso('y NO lleva el link del formulario: ese sale cuando el cliente contesta que sí',
    strpos($rPaso[0], 'gokywebs.com/form/') === false);
caso('el bot reconoce ese mensaje como demo ya ofrecida',
    wabot_cta_muestra_ya_ofrecida(['session_started_ts' => time() - 100, 'transcript' => [['q' => 'bot', 't' => $rPaso[0], 'ts' => time()]]]) === true);
caso('pasa entero por el punto único de salida, con el primer pago y el plan mensual',
    (function () use ($cfg, $rPaso, $cPaso) { $c = $cPaso; $out = wabot_salida_preparar($rPaso, $c, $cfg);
        return count($out) === 1 && stripos($out[0], 'primer pago') !== false && stripos($out[0], 'plan mensual') !== false
            && stripos($out[0], 'seña') === false; })());

@unlink(WABOT_DATA . '/conv/999FPTEST.json');
echo "\n" . ($fallas ? "FALLAS: $fallas de $total" : "TODO OK — $total casos") . "\n";
exit($fallas ? 1 : 0);
