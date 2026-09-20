<?php
/**
 * wabot/test-detectores.php — los detectores deterministas (solo CLI).
 *
 * Los matchers que corren ANTES del clasificador deciden cosas irreversibles
 * (baja, cierre, derivación, tipo de web) sobre frases normales de cliente.
 * Cada bloque tiene los controles NEGATIVOS (lo que no puede disparar) junto a
 * los POSITIVOS (lo que sí tiene que seguir disparando): un fix que apaga el
 * detector entero también rompe esta suite. Viene de la auditoría del 9-sep,
 * la batería del 14/15-sep y las diez conversaciones reales del 11-sep.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

/** Charla cotizada, esperando el sí a la demo. */
function conv_audit($tipo = 'ecommerce', $clave = 'QATESTREG11SEP') {
    global $cfg;
    $c = conv_nueva($clave);
    $c['tipo'] = $tipo; $c['fase'] = 'prediseno';
    $c['precio_dado'] = true; $c['cta_muestra'] = true;
    wabot_precio_congelar($c, $tipo, $cfg);
    return $c;
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
    'no me escribas al otro numero, mejor por aca', 'no tengo logo', 'no se, mandame info', 'no me acuerdo el nombre del dominio',
] as $f) caso('NO es baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) !== 'baja', (string)wabot_cierre_sin_presion_tipo($f));
foreach (['No molesten mas', 'no quiero que me molesten mas', 'no me molesten', 'dejen de escribirme',
          'dejen de mandarme mensajes', 'paren de escribir', 'basta de molestar', 'no me escriban mas',
          'no me contacten nunca mas', 'sacame de la lista', 'borren mi numero', 'quiero darme de baja',
          'no me llamen mas', 'no quiero que me escriban mas', 'no me manden mas mensajes', 'borrame, no quiero recibir mas mensajes',
          'podrian dejar de escribirme?', 'Quiero dar de baja', 'Darme de baja', 'Bloqueame', 'Borren mi número'] as $f) {
    caso('sigue siendo baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'baja');
}
foreach (['Puedo dar de baja una propiedad cuando se vende y cargar otra yo mismo?',
          'Quiero dar de baja un producto', 'Puedo bloquear un usuario?', 'Eliminen mi foto de la demo'] as $p) {
    caso("no es baja de contacto: $p", wabot_cierre_sin_presion_tipo($p) !== 'baja');
}
caso('la baja contesta una línea, apaga el bot y bloquea el seguimiento', (function () use ($cfg) {
    $c = conv_nueva(); clasifica(['otro']);
    $r = wabot_engine('no me escriban mas por favor, quiero darme de baja', $c, $cfg);
    return $r === [$cfg['baja']] && $c['bot_off'] === true && $c['seguimiento_bloqueado'] === true && $c['cierre'] === 'baja';
})());
caso('con la baja marcada, otro mensaje no recibe respuesta; pedir una web de nuevo la reabre', (function () use ($cfg) {
    $c = conv_nueva(); $c['cierre'] = 'baja'; $c['seguimiento_bloqueado'] = true; $c['bot_off'] = true;
    clasifica(['otro']);
    $mudo = wabot_responder('pero cuanto sale?', $c, $cfg) === [];
    clasifica(['rubro_landing']);
    $r = wabot_responder('bueno en realidad si quiero una pagina para mi negocio', $c, $cfg);
    return $mudo && $r !== [] && $c['cierre'] === null && empty($c['bot_off']);
})());
/* 18-sep: después del precio, una pregunta la contesta Pablo. Lo que se
 * cuida acá es que "dar de baja una propiedad" no se lea como una baja. */
$cInm = conv_nueva('QATESTREG11SEP');
wabot_pitch('inmobiliaria', $cInm, $cfg);
$p = 'Puedo dar de baja una propiedad cuando se vende y cargar otra yo mismo?';
clasifica(['otro']);
$r = turno($p, $cInm, $cfg);
caso('editar una propiedad no es darse de baja: queda para Pablo, no cerrada',
    ($cInm['cierre'] ?? '') !== 'baja' && !empty($cInm['handoff_pendiente']) && empty($cInm['seguimiento_estado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$cInm = conv_nueva('QATESTREG11SEP');
wabot_pitch('inmobiliaria', $cInm, $cfg);
$r = turno('Dale, mandame el formulario para la demo', $cInm, $cfg);
caso('y el sí a la oferta recibe el formulario', count($r) === 1 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 2. El cierre sin presión: no sobre el que explora, pregunta o promete datos —\n";
foreach ([
    'Hola, estoy viendo de hacer una web para mi negocio de ropa',
    'estaba consultando por el precio de una web',
    'estamos viendo la posibilidad de armar una tienda online',
    'estoy viendo cómo hacer para vender más',
    'no puedo pagar todo junto, se puede en cuotas?',
    'estoy averiguando nomás, cuánto sale?',
    'cuando tenga las fotos te escribo',
    'cuando pueda te paso el logo y avanzamos',
    'no tengo plata para publicidad, por eso quiero una web',
    'no quiero vender, solo recibir consultas',
    'solo vendo por instagram, queria consultar por una web',
    'por ahora solo estoy consultando precios, me pasas el de una landing?',
    'hola, no tengo presupuesto todavia, me pasas uno?',
    'Ay la estoy viendo esta hermoso.', 'Si, si la verdad me encanto', 'quedo muy linda',
    'la voy a mirar tranquila y te digo',
] as $f) caso('NO cierra: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === null, (string)wabot_cierre_sin_presion_tipo($f));
foreach (['estoy averiguando nomas', 'estoy viendo opciones nomas', 'por ahora solo estaba averiguando precios',
          'no tengo plata ahora', 'Revisaré el portafolio y los vuelvo a contactar',
          'mas adelante te escribo, ahora no puedo', 'no puedo pagar eso ahora'] as $f) {
    caso('sigue cerrando como consulta: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'consulta', (string)wabot_cierre_sin_presion_tipo($f));
}
caso('"estaba viendo y consultar precios" es comparar', wabot_texto_esta_comparando('Si estaba viendo y consultar precios. Muchas gracias') === true
    && wabot_texto_esta_comparando('mañana lo veo y te digo') === false);

echo "— 3. El rechazo: solo del proyecto, no de una parte —\n";
foreach (['no me interesa el mantenimiento, solo la web', 'no me interesa la videollamada, prefiero por acá',
          'no me interesa lo del hosting', 'no me interesa vender online', 'no estoy interesado en el mantenimiento',
          'no me interesa la demo, pasame el precio nomas', 'no me interesa el mensual'] as $f) {
    caso('NO es rechazo: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) !== 'rechazo', (string)wabot_cierre_sin_presion_tipo($f));
}
foreach (['no me interesa', 'no me interesa, gracias', 'no estoy interesado', 'no estoy interesada por ahora',
          'no me interesa la verdad', 'no me interesa la propuesta', 'gracias pero no', 'dejalo ahi'] as $f) {
    caso('sigue siendo rechazo: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'rechazo', (string)wabot_cierre_sin_presion_tipo($f));
}
caso('"no se si vale la pena" es una duda, no un cierre',
    wabot_texto_es_duda_de_valor('No se si vale la pena hacerla de nuevo') && wabot_texto_es_duda_de_valor('no se si me conviene')
    && !wabot_texto_es_duda_de_valor('no me interesa'));

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
$cIn = conv_nueva('999FPTEST'); $cIn['fase'] = 'menu';
clasifica(['otro']);
$rIn = turno('Veterinaria', $cIn, $cfg);
caso('"Veterinaria" en fase menu cotiza el sitio profesional', ($cIn['tipo'] ?? '') === 'landing' && (int)($cIn['ininteligibles'] ?? 0) === 0,
    json_encode($rIn, JSON_UNESCAPED_UNICODE));
/* La escalera de los mensajes ininteligibles (antes vivía en el agente): a la
 * primera se repregunta, a la segunda se avisa que no se entiende, después silencio. */
$cEsc = conv_nueva('999FPTEST'); $cEsc['fase'] = 'menu';
wabot_conv_transcript($cEsc, 'bot', $cfg['menu']);
clasifica(['otro']);
$e1 = wabot_engine('Bxjxdid', $cEsc, $cfg);
$e2 = wabot_engine('asdfghjkl', $cEsc, $cfg);
$e3 = wabot_engine('zzz', $cEsc, $cfg);
caso('escalera: repregunta, aviso de que no entiende, silencio',
    $e1 === [(string)$cfg['contame_2']] && $e2 === [(string)$cfg['no_entiendo']] && $e3 === []
    && (int)$cEsc['ininteligibles'] === 3 && !empty($cEsc['handoff_pendiente']), json_encode([$e1, $e2, $e3], JSON_UNESCAPED_UNICODE));
$cEsc0 = conv_nueva('999FPTEST');
clasifica(['otro']);
caso('si el bot todavía no habló, el primero se lleva la repregunta inicial',
    wabot_engine('Bxjxdid', $cEsc0, $cfg) === [(string)$cfg['ininteligible_primero']]);
$cEsc2 = conv_nueva('999FPTEST'); $cEsc2['fase'] = 'menu'; $cEsc2['ininteligibles'] = 1;
clasifica(['rubro_landing']);
wabot_engine('Soy plomero', $cEsc2, $cfg);
caso('un mensaje real después reinicia la escalera y cotiza', (int)$cEsc2['ininteligibles'] === 0 && $cEsc2['tipo'] === 'landing');

echo "— 5. Pedir una llamada vs. atender por llamada —\n";
foreach (['Soy psicóloga, atiendo por videollamada, quiero una web', 'doy clases de inglés por videollamada',
          'tengo un call center de llamadas', 'podemos hablar por acá?', 'podemos hablar mañana?',
          'hago sesiones por zoom', 'ofrezco consultas por videollamada y presenciales',
          'hola quiero hablar sobre una pagina web', 'quiero hablar de precios', 'prefiero por whatsapp', 'no me llamen mas'] as $f) {
    caso('NO pide llamada: "' . $f . '"', wabot_pide_llamada($f) === false);
}
foreach (['Llamame', 'quiero hablar', 'podemos hacer una llamada?', 'se puede hacer una videollamada',
          'hacemos una videollamada?', 'mejor por videollamada', 'quiero hablar con una persona',
          'prefiero hablarlo por telefono', 'me llamas asi te explico mejor', 'podemos hablar un rato?',
          'podriamos tener una reunion', 'hablemos por telefono mejor'] as $f) {
    caso('sigue pidiendo llamada: "' . $f . '"', wabot_pide_llamada($f) === true);
}
caso('"prefiero hablarlo con alguien técnico" es pedir un humano',
    wabot_handoff_causa_explicita('Es algo complejo, prefiero hablarlo con alguien técnico') === 'pide_humano');
caso('"prefiero hablarlo con mi socio" NO deriva (es su socio, no el nuestro)',
    wabot_handoff_causa_explicita('prefiero hablarlo con mi socio') !== 'pide_humano');
foreach (['Se puede hablar con un agente', 'quiero un operador', 'hablar con un representante', 'necesito una persona'] as $pedido) {
    caso("\"$pedido\" deriva", wabot_handoff_causa_explicita($pedido) === 'pide_humano');
}
foreach (['necesito un vendedor para mi local', 'necesito un asesor de seguros para mi empresa', 'tengo un local de ropa',
          'Soy asesor de seguros y me gustaría mostrar mis servicios en una web'] as $rubroPropio) {
    caso("\"" . mb_substr($rubroPropio, 0, 34) . "\" NO se confunde con pedir humano", wabot_handoff_causa_explicita($rubroPropio) !== 'pide_humano');
}
$cAs = conv_audit('landing');
clasifica(['otro']);
$r = turno('Me gustaría hablar por acá con un asesor antes de decidir', $cAs, $cfg);
caso('el pedido cordial de asesor deriva sin mandar el formulario', !empty($cAs['handoff_pendiente']) && $cAs['fase'] === 'derivado' && !tiene_form($r));

echo "— 6. \"Local\" no es un producto —\n";
foreach (['tengo un local de comidas y hago delivery' => null, 'somos una agencia de viajes con local en el centro' => null,
          'tengo un restaurante en Tigre' => 'landing', 'tengo un bar' => 'landing',
          'tengo un local de ropa' => 'ecommerce', 'tengo una ferreteria' => 'ecommerce',
          'fabricamos piscinas de fibra' => null] as $f => $esperado) {
    caso('rubro local de "' . $f . '" = ' . var_export($esperado, true), wabot_fallback_rubro_local($f) === $esperado,
        var_export(wabot_fallback_rubro_local($f), true));
}
foreach (['Tengo una empresa de limpieza', 'Somos una empresa familiar de fletes', 'Tengo una empresa de seguridad',
          'Hola, somos una ONG que da capacitacion laboral a jovenes', 'somos una fundacion que da talleres a chicos'] as $frase) {
    caso("\"$frase\" es sitio profesional", wabot_fallback_rubro_local($frase) === 'landing');
}
caso('"doy clases de yoga y quiero vender mis cursos grabados" es cursos, no el yoga de la lista',
    wabot_fallback_rubro_local('Doy clases de yoga y quiero vender mis cursos grabados') === 'cursos');
caso('un estudio de yoga solo sigue siendo sitio profesional', wabot_fallback_rubro_local('Tengo un estudio de yoga') === 'landing');
caso('"soy psicóloga" es sitio profesional y "vendo insumos médicos" comercio',
    wabot_fallback_rubro_local('soy psicologa, atiendo por videollamada') === 'landing' && wabot_fallback_rubro_local('vendo insumos medicos') !== 'landing');
caso('el fallback nunca devuelve un tipo retirado', (function () {
    foreach (['tengo una peluqueria', 'somos una asociacion civil', 'tengo un club', 'quiero un catalogo de productos', 'somos una fundacion'] as $f) {
        if (in_array(wabot_fallback_rubro_local($f), ['turnos', 'institucional', 'catalogo', 'lms'], true)) return false;
    }
    return true;
})());
caso('wabot_rubro_de no devuelve turnos ni institucional',
    wabot_rubro_de(['servicio_con_turnos']) === null && wabot_rubro_de(['rubro_institucional']) === null && wabot_rubro_de(['rubro_landing']) === 'landing');
caso('un servicio con turnos ya no abre un desempate', wabot_desempate_de('turnos') === null && wabot_desempate_de('turnos_pendiente') === null);
caso('los desempates vivos son cursos, híbrido y el sistema',
    wabot_desempate_de('cursos') === ['desempate_cursos', 'desempate_cursos'] && wabot_desempate_de('hibrido_pendiente') === ['desempate_hibrido', 'desempate_hibrido']
    && wabot_desempate_de('sistema_pendiente') === ['sistema_problema', 'sistema_pregunta']);
caso('"dale, hagamos la demo" no es una descripción del negocio', wabot_texto_no_es_descripcion('dale, hagamos la demo') === true
    && wabot_texto_no_es_descripcion('vendo ropa de mujer, tengo local en Salta') === false);

echo "— 7. Postdemo: dos elogios seguidos no derivan —\n";
function convPost() {
    return conv_nueva('999FPTEST', ['fase' => 'postdemo', 'presentado_ts' => time() - 600, 'presentado_slug' => 'x',
        'tipo' => 'landing', 'precio_dado' => true, 'lead_creado' => true, 'cta_muestra' => true, 'nombre' => 'Ana']);
}
clasifica(['otro']);
$cP = convPost();
$r1 = turno('me encanta!!', $cP, $cfg); $r2 = turno('quedó hermosa la verdad', $cP, $cfg);
caso('el primer elogio pregunta por los cambios', count($r1) === 1 && strpos($r1[0], '?') !== false);
caso('el segundo se calla en vez de derivar', $r2 === [] && $cP['fase'] === 'postdemo' && empty($cP['handoff_pendiente']), json_encode($r2, JSON_UNESCAPED_UNICODE) . ' fase=' . $cP['fase']);
$r3 = turno('no le cambiaría nada, cómo sigo?', $cP, $cfg);
caso('y el interés real de después sí avisa que sigue el desarrollador',
    in_array((string)$cfg['postdemo_derivar'], $r3, true) && !empty($cP['postdemo_avisado']), json_encode($r3, JSON_UNESCAPED_UNICODE));
$cM = convPost();
turno('dale, la voy a mirar y te digo', $cM, $cfg); $rM = turno('ahora la miro tranquilo y te aviso', $cM, $cfg);
caso('dos "la miro" seguidos tampoco derivan', $rM === [] && $cM['fase'] === 'postdemo');
$cC = convPost();
turno('quiero cambiar el color del fondo', $cC, $cfg); $rC = turno('y también cambiar la foto de arriba', $cC, $cfg);
caso('dos pedidos de cambio se acusan los dos y se anotan',
    $rC !== [] && strpos((string)($cC['cambios_pedidos'] ?? ''), 'foto de arriba') !== false, json_encode($rC, JSON_UNESCAPED_UNICODE));
$cA = convPost(); $rA = turno('puedo agregar más fotos a la demo?', $cA, $cfg);
caso('"puedo agregar más fotos a la demo?" es un pedido de cambio, no la info de carga',
    strpos((string)($cA['cambios_pedidos'] ?? ''), 'fotos') !== false && stripos(implode(' ', $rA), 'cargamos hasta 10') === false,
    json_encode($rA, JSON_UNESCAPED_UNICODE));
$cB = convPost();
$rB = turno('Me gustó la demo, pero podés cambiar el fondo a beige? Y los turnos online están incluidos?', $cB, $cfg);
caso('postdemo anota el beige y también responde los turnos', strpos($cB['cambios_pedidos'] ?? '', 'beige') !== false
    && strpos(implode(' ', $rB), 'turnos online') !== false && strpos(implode(' ', $rB), 'anoto esos cambios') !== false
    && empty($cB['handoff_pendiente']), json_encode($rB, JSON_UNESCAPED_UNICODE));
caso('las preguntas separadas conservan el dominio .com',
    in_array('dominio_com', wabot_preguntas_del_mensaje('El dominio puede ser .com? Y tiene estadísticas?', $cB), true));
foreach (['vamos con el pago unico', 'me pasas el CBU?', 'como me suscribo?', 'prefiero pagarla una sola vez', 'quiero el mensual'] as $f) {
    caso('después de la demo es interés real: "' . $f . '"', wabot_postdemo_avance_explicito($f) === true);
}
caso('"ya me suscribí" avisa el pago', wabot_dice_que_pago('ya me suscribi') === true);
caso('cobros de sus compradores no se confunden con nuestro primer pago',
    !wabot_postdemo_pregunta_como_pagar('Mis clientes pueden hacer un primer pago y después pagar el resto?'));

echo "— 8. \"Te paso X con Y\" no es una derivación —\n";
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

echo "— 9. Los descuentos de SU tienda no son regateo —\n";
foreach (['la tienda puede tener cupones de descuento?', 'vendo con 10% de descuento los lunes', 'remeras 100% algodón',
          'quiero que la web muestre las ofertas y promos', 'me parece caro', 'no me escriban mas por favor, quiero darme de baja'] as $f) {
    caso('NO es regateo: "' . $f . '"', wabot_es_regateo($f) === false);
}
foreach (['no hay forma de que me lo dejes en 150?', 'dale, si me haces 10 por ciento de descuento cierro ya',
          'y si pago en efectivo, ahi si baja?', 'me baja el precio si pago todo junto?', 'me haces un descuento?'] as $f) {
    caso('sigue siendo regateo: "' . $f . '"', wabot_es_regateo($f) === true);
}
caso('"no hay forma de que me lo dejes en 150?" es contraoferta; "si pago todo junto me hacés descuento?" no',
    wabot_regateo_es_contraoferta('no hay forma de que me lo dejes en 150?') === true && wabot_regateo_es_contraoferta('Si pago todo junto me haces descuento?') === false);
$pregunta = 'Puedo poner cupones de descuento para mis clientes?';
caso('cupones tienen respuesta propia', wabot_info_por_palabras($pregunta, 'prediseno') === 'cupones');
// Antes del precio: después, desde el 18-sep, las dudas las contesta Pablo.
$cCup = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
clasifica(['otro']);
$rCup = turno($pregunta, $cCup, $cfg);
caso('contesta los cupones sin desviar al carrito', mb_stripos(implode(' ', $rCup), 'cupones de descuento') !== false
    && empty($cCup['handoff_pendiente']) && empty($cCup['precio_dado']), json_encode($rCup, JSON_UNESCAPED_UNICODE));
caso('un código de descuento para pagar nuestra web no ofrece cupones de tienda',
    wabot_info_por_palabras('Me das un código de descuento para pagar la web?', 'prediseno') !== 'cupones');
$cMP = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
clasifica(['otro']);
$rMP = turno('Quiero que mis clientes paguen por Mercado Pago, se puede?', $cMP, $cfg);
caso('responde Mercado Pago de sus compradores, no nuestro pago', strpos(implode(' ', $rMP), 'Mercado Pago') !== false
    && strpos(implode(' ', $rMP), 'tus clientes') !== false && strpos(implode(' ', $rMP), 'primer pago') === false, json_encode($rMP, JSON_UNESCAPED_UNICODE));

echo "— 10. Claves de info: tema + forma de pregunta —\n";
foreach ([
    ['vendo abonos mensuales de gimnasio', 'menu', 'mantenimiento', false],
    ['tiene mantenimiento mensual?', 'prediseno', 'mantenimiento', true],
    ['y despues tengo que pagarles mantenimiento todos los meses?', null, 'mantenimiento', true],
    ['hay que pagar algo por mes?', null, 'mantenimiento', true],
    ['quiero que mis clientes paguen por mercado pago', 'menu', 'pago', false],
    ['se puede pagar con mercado pago?', 'prediseno', 'pago', true],
    ['cuánto tiempo llevan en el mercado?', 'prediseno', 'ejemplos', true],
    ['cuánto tiempo tarda?', 'prediseno', 'plazos', true],
    ['mi negocio se llama Buen Valor', 'prediseno', 'precio_actual', false],
    ['costo?', 'prediseno', 'precio_actual', true],
    ['y el precio', 'prediseno', 'precio_actual', true],
    ['Soy psicóloga, atiendo por videollamada, quiero una web', 'menu', 'reuniones', false],
    ['podemos hacer una reunión?', 'prediseno', 'reuniones', true],
    ['ahí te mandé el formulario', 'prediseno', 'formularios', false],
    ['se pueden hacer formularios en la web?', 'prediseno', 'formularios', true],
    ['Soy tecnico de mantenimiento y tengo una empresa de servicio de mantenimiento', 'menu', 'mantenimiento', false],
    ['el mantenimiento es obligatorio?', 'menu', 'mantenimiento', true],
    ['Y si la pago una sola vez y despues la mantengo yo?', 'prediseno', 'web_propia', true],
    ['ustedes se quedan con una comision?', 'pitch', 'comisiones', true],
    ['como se paga?', 'pitch', 'pago', true],
] as [$frase, $fase, $clave, $si]) {
    $v = wabot_info_por_palabras($frase, $fase);
    caso('"' . $frase . '" ' . ($si ? '→ ' : 'NO es ') . $clave, $si ? $v === $clave : $v !== $clave, (string)$v);
}
caso('"¿hay que pagar algo al principio?" no apunta a lo ya dicho', wabot_apunta_a_lo_ya_dicho('Como se paga? Hay que pagar algo al principio?') === false);
caso('"como te dije al principio" y "está al principio del chat" sí',
    wabot_apunta_a_lo_ya_dicho('Como te dije al principio, vendo ropa') === true && wabot_apunta_a_lo_ya_dicho('está al principio del chat') === true);
caso('el saludo repetido por el modelo se reformula en vez de derivar',
    wabot_texto_reformulado([(string)$cfg['menu']], $cfg) === (string)$cfg['contame']);
caso('"cuánto sale?" repetido sin rubro se repregunta con otras palabras, no se deriva',
    wabot_texto_reformulado([wabot_texto_info('precio_sin_rubro', $cfg)], $cfg) === (string)$cfg['contame_2']);

echo "— 11. El flyer del propio cliente no es un proveedor —\n";
caso('la agencia que pega su flyer y pide su web es un cliente',
    wabot_texto_es_proveedor("Hola! Somos una agencia de marketing digital y manejo de redes sociales para pymes. Nuestros planes son desde \$50.000 por mes. Consultanos por WhatsApp. Quiero una página web para mostrar nuestros servicios.") === false);
caso('el volante que solo ofrece sigue siendo proveedor',
    wabot_texto_es_proveedor('Somos una agencia de marketing digital, hacemos paginas web y redes sociales. Consultanos por nuestros planes: 15000 por mes.') === true);

echo "— 12. Trabajo y clientes viejos por palabras sueltas —\n";
caso('"necesito más trabajo para mi taller" no es laboral', wabot_contexto_consulta('necesito más trabajo para mi taller') === null);
caso('"busco trabajo, soy plomero" sigue siendo laboral', wabot_contexto_consulta('busco trabajo, soy plomero') === 'laboral');
caso('"ya pagué otra web y fue un desastre, quiero una nueva" es un lead', wabot_contexto_consulta('ya pagué otra web y fue un desastre, quiero una nueva') === null);
caso('"Ya pagué la seña, cuando empiezan?" sigue siendo cliente existente', wabot_contexto_consulta('Ya pagué la seña, cuando empiezan?') === 'cliente_existente');

echo "— 13. \"Quiero avanzar con la demo\" no autoriza un handoff de pago —\n";
caso('"Dale, quiero avanzar con la demo gratis"', wabot_handoff_causa_explicita('Dale, quiero avanzar con la demo gratis') === null);
caso('"quiero arrancar con una web para mi negocio"', wabot_handoff_causa_explicita('quiero arrancar con una web para mi negocio') === null);
caso('"quiero contratar" sigue siendo pago', wabot_handoff_causa_explicita('quiero contratar') === 'pago_explicito');
caso('"mandame el cbu" también', wabot_handoff_causa_explicita('mandame el cbu') === 'pago_explicito');

echo "— 14. El reset a los 7 días arranca el proyecto de cero —\n";
$cR = conv_nueva('999FPTEST', ['tipo' => 'landing', 'precio_dado' => true, 'pitch_hecho' => true, 'pitch_tipo' => 'landing', 'fase' => 'prediseno',
    'link_form_enviado' => true, 'cta_muestra' => true, 'form_completado_ts' => time() - 20 * 86400, 'lead_creado' => true,
    'ultimo_ts' => time() - 20 * 86400, 'codigo' => 'ZZ']);
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('pitch_hecho, pitch_tipo, link_form_enviado y form_completado_ts se limpian',
    empty($cR['pitch_hecho']) && empty($cR['pitch_tipo']) && empty($cR['link_form_enviado']) && (int)$cR['form_completado_ts'] === 0);
caso('el código corto se conserva', $cR['codigo'] === 'ZZ');
$cR['transcript'][] = ['q' => 'cliente', 't' => 'Hola, soy abogado y quiero una web', 'ts' => time()];
$rR = wabot_precio('landing', $cR, $cfg);
caso('el precio del que vuelve sale con la propuesta y, en otro mensaje, la oferta del primer diseño',
    count($rR) === 2 && stripos($rR[0], 'donde presentes tu negocio') !== false
    && mb_stripos($rR[1], 'primer diseño') !== false && !tiene_form($rR), json_encode($rR, JSON_UNESCAPED_UNICODE));

echo "— 15. Las dudas de pago del modelo doble —\n";
foreach (['Con el pago unico despues tengo que pagar algo mas?', 'Si pago la seña y despues no me gusta, me la devuelven?', 'Y no se puede pagar de una?'] as $f) {
    caso('no es una pregunta por la demo: "' . $f . '"', wabot_texto_pregunta_pago_demo($f) === false);
}
caso('"¿no se puede pagar de una?" pide el pago único', wabot_pide_un_solo_pago('Y no se puede pagar de una?') === true);
caso('"no puedo pagar todo junto, en cuotas?" no lo pide', wabot_pide_un_solo_pago('no puedo pagar todo junto, en cuotas?') === false);
$fCambio = 'Si arranco con el mensual y despues me quiero pasar al pago unico se puede?';
caso('pasarse del mensual al pago único no es pedir el pago único',
    wabot_pide_un_solo_pago($fCambio) === false && wabot_texto_pregunta_cambio_modalidad($fCambio) === true);
caso('cambiar los textos más adelante no es cambiar de forma de pago',
    wabot_texto_pregunta_cambio_modalidad('con el mensual puedo cambiar los textos despues?') === false);
caso('las devoluciones de SU tienda no son esto', wabot_texto_pregunta_devolucion('la tienda permite devoluciones de productos a mis clientes?') === false);
caso('"cuánto es la seña para arrancar?" sigue siendo la seña del pago único', wabot_texto_pregunta_inicio_mensual('Cuánto es la seña para arrancar?') === false);
foreach (['el pago unico incluye lo mismo que el mensual?', 'con el pago unico tengo que pagar mantenimiento?',
          'el mensual a la larga no sale mas caro que el pago unico?', 'el pago unico incluye el desarrollo completo?'] as $f) {
    caso('compara o pregunta qué trae, no pide el pago único: "' . $f . '"', wabot_pide_un_solo_pago($f) === false);
}
caso('"tienen pago único?" y "puedo pagarla una sola vez?" sí lo piden', wabot_pide_un_solo_pago('tienen pago unico?') === true && wabot_pide_un_solo_pago('puedo pagarla una sola vez?') === true);
caso('"la diferencia entre las dos formas" es la pregunta de cuál conviene', wabot_texto_pregunta_cual_forma_conviene('cual es la diferencia entre las dos formas?') === true);
foreach (['cuanto es la seña?', 'cual es la seña?', 'de cuanto es el adelanto?', 'cuanto hay que dejar de anticipo?'] as $preg) {
    caso('"' . $preg . '" se reconoce como pregunta por el monto', wabot_texto_pregunta_cuanto_anticipo($preg) === true);
}
caso('avisar que ya pagó, preguntar el abono o el precio de la web no son la pregunta por la seña',
    wabot_texto_pregunta_cuanto_anticipo('ya te hice la seña') === false && wabot_texto_pregunta_cuanto_anticipo('cuanto es el mantenimiento mensual?') === false
    && wabot_texto_pregunta_cuanto_anticipo('cuanto sale la web?') === false);
foreach (['Cuánto tengo que pagar ahora para ver la demo?', 'La demo se paga?', 'Cuánto cuesta la demo?', 'Tengo que abonar antes de ver la muestra?'] as $p) {
    $c = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
    clasifica(['otro']);
    $r = turno($p, $c, $cfg);
    caso("la demo no se paga: el primer diseño es sin cargo (18-sep): $p", mb_stripos(implode(' ', $r), 'primer diseño es sin cargo') !== false
        && strpos(implode(' ', $r), '$') === false && empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
}
caso('pagar el desarrollo después de la demo sigue siendo otra consulta',
    !wabot_texto_pregunta_pago_demo('Ya vi la demo, cuánto es el primer pago del desarrollo?'));

echo "— 16. Objeciones que derivan: el socio y el que ya tiene web (Pablo, 15-sep) —\n";
// Antes del precio (después, desde el 18-sep, cualquier respuesta la ve Pablo).
$cSoc = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
clasifica(['objecion_socio']);
$rSoc = turno('Lo tengo que hablar con mi socio y te digo', $cSoc, $cfg);
caso('el socio deriva al desarrollador', $cSoc['fase'] === 'derivado' && !empty($cSoc['handoff_pendiente']) && in_array(wabot_personalizar($cfg['derivar'], $cSoc), $rSoc, true),
    json_encode($rSoc, JSON_UNESCAPED_UNICODE));
$cWeb = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
clasifica(['objecion_ya_tiene_web']);
$rWeb = turno('Ya tengo una web pero quiero mejorarla', $cWeb, $cfg);
caso('el que ya tiene web deriva al desarrollador', $cWeb['fase'] === 'derivado' && !empty($cWeb['handoff_pendiente']), json_encode($rWeb, JSON_UNESCAPED_UNICODE));
$cSinWeb = conv_nueva('QATESTREG11SEP', ['fase' => 'menu']);
clasifica(['objecion_ya_tiene_web']);
$rSinWeb = turno('no tengo pagina todavia, quiero arrancar de cero', $cSinWeb, $cfg);
caso('pero el que dice que NO tiene web no se lleva esa objeción', $cSinWeb['fase'] !== 'derivado', json_encode($rSinWeb, JSON_UNESCAPED_UNICODE));
foreach (['no tengo pagina', 'no tengo web todavia', 'nunca tuve una pagina', 'quiero arrancar de cero'] as $f) {
    caso('dice que no tiene web: "' . $f . '"', wabot_texto_dice_sin_web($f) === true);
}
caso('"tengo mi web pero es fea" SÍ tiene web', wabot_texto_dice_sin_web('tengo mi web pero es fea') === false);

echo "— 17. Los sistemas de gestión: una pregunta y deriva —\n";
$cSis = conv_nueva('QATESTSIS1'); $cSis['fase'] = 'menu';
clasifica(['rubro_sistema']);
$rSis = wabot_engine('quiero un sistema para controlar el stock de mi deposito', $cSis, $cfg);
caso('un sistema abre la única pregunta', $rSis === [(string)$cfg['sistema_pregunta']] && $cSis['fase'] === 'sistema_problema');
caso('el texto de la pregunta es el de la config', wabot_sistema_texto($cfg) === (string)$cfg['sistema_pregunta']);
clasifica(['otro']);
$rSis2 = wabot_engine('necesito ver el stock por sucursal y que avise cuando falta mercaderia', $cSis, $cfg);
caso('con la respuesta crea el lead y deriva, con el problema anotado',
    $rSis2 === [(string)$cfg['sistema_cierre']] && $cSis['fase'] === 'derivado' && $cSis['tipo'] === 'sistema'
    && !empty($cSis['sistema_lead_creado']) && strpos((string)$cSis['descripcion'], 'stock por sucursal') !== false, json_encode($rSis2, JSON_UNESCAPED_UNICODE));
$cSisQ = conv_nueva('QATESTSIS2'); $cSisQ['fase'] = 'sistema_problema';
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$rSisQ = wabot_engine('cuanto tardan?', $cSisQ, $cfg);
caso('una duda en el medio se contesta y la pregunta sigue en pie', count($rSisQ) === 2 && $cSisQ['fase'] === 'sistema_problema', json_encode($rSisQ, JSON_UNESCAPED_UNICODE));
$cSisIg = conv_nueva('igQATESTSIS3'); $cSisIg['canal'] = 'instagram'; $cSisIg['fase'] = 'sistema_problema';
clasifica(['otro']);
$rSisIg = wabot_engine('quiero controlar las reservas de mi hostel', $cSisIg, $cfg);
caso('en Instagram primero pide el WhatsApp', $rSisIg === [wabot_sistema_whatsapp_texto($cfg)] && $cSisIg['fase'] === 'sistema_wsp');
clasifica(['otro']);
$rSisIg2 = wabot_engine('11 2506-8578', $cSisIg, $cfg);
caso('y con el número cierra', $rSisIg2 === [(string)$cfg['sistema_cierre']] && $cSisIg['fase'] === 'derivado' && $cSisIg['telefono_wsp'] === '5491125068578');
caso('una app para stock es un sistema, no un handoff pelado; una app de celular sí se deriva',
    wabot_handoff_causa_explicita('quiero una app para stock') === null && wabot_handoff_causa_explicita('necesito una app para celular, para pedidos') === 'app_movil');

echo "— 18. Rubros naturales y textos que no se repiten —\n";
$cRub = conv_audit('landing', 'QATESTTEXTOS11SEP');
wabot_conv_transcript($cRub, 'cliente', 'Alquilamos sonido e iluminación para eventos');
foreach (['tu alquiler de sonido e iluminación', 'tu servicio de alquiler de sonido e iluminación'] as $rubro) {
    caso('rubro de alquiler natural: ' . $rubro, wabot_rubro_valido($rubro, $cRub) === 'tu servicio de alquiler de sonido e iluminación');
}
caso('no inventa alquiler para una psicóloga', wabot_rubro_valido('tu servicio de alquiler de sonido e iluminación', conv_audit('landing')) === '');
function charla_textos($cfg) {
    $c = conv_audit('landing', 'QATESTTEXTOS11SEP');
    wabot_conv_transcript($c, 'bot', 'Querés que preparemos la demo para tu negocio?');
    wabot_conv_transcript($c, 'cliente', 'Se pueden reservar turnos online?');
    return $c;
}
foreach (["Querés que te preparemos la demo gratis para ver cómo quedaría?", 'Te gustaría que armemos la muestra?', 'Te parece que avancemos con la demo?'] as $cta) {
    $c = charla_textos($cfg);
    $r = wabot_salida_preparar(["Los turnos online están incluidos.\n\n$cta"], $c, $cfg);
    caso("responde sin repetir la invitación: $cta", implode(' ', $r) === 'Los turnos online están incluidos.');
}
$c = charla_textos($cfg);
caso('tampoco repite la invitación en otro globo',
    wabot_salida_preparar(['Los turnos online están incluidos.', 'Querés que te preparemos la demo gratis?'], $c, $cfg) === ['Los turnos online están incluidos.']);
$c = charla_textos($cfg); $c['transcript'] = [];
$primera = 'Los turnos online están incluidos. Querés que preparemos la demo para tu negocio?';
caso('conserva la primera oferta', wabot_salida_sin_cta_repetida([$primera], $c) === [$primera]);
$c = charla_textos($cfg);
foreach (['La demo es gratis. El pago único es de $180.000 y el servicio mensual de $20.000 por mes.',
    'La demo es gratis. Qué colores te gustan?', "Completá el formulario cortito:\nhttps://gokywebs.com/form/?c=TEST"] as $texto) {
    caso('conserva información o pregunta necesaria: ' . mb_substr($texto, 0, 40), wabot_salida_sin_cta_repetida([$texto], $c) === [$texto]);
}
// 18-sep: la oferta dice "primer diseño", pero el cliente puede decir "demo".
$c = conv_nueva('QATESTTEXTOS11SEP');
wabot_pitch('landing', $c, $cfg);
clasifica(['otro']);
$r = turno('Sí, quiero la demo', $c, $cfg);
caso('una aceptación con la palabra demo recibe solo el formulario de la charla',
    count($r) === 1 && tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));

foreach (['999FPTEST', 'QATESTREG11SEP', 'QATESTTEXTOS11SEP', 'QATESTSIS1', 'QATESTSIS2', 'igQATESTSIS3'] as $k) @unlink(WABOT_DATA . '/conv/' . $k . '.json');
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

echo "\n-- La forma de pago que eligió el cliente va al boceto (15-sep) --\n";
foreach (['Prefiero pagarla una sola vez' => 'unico', 'Vamos con el pago unico, me pasas el CBU?' => 'unico',
          'No me interesa el mensual' => 'unico', 'Quiero avanzar con el pago mensual' => 'mensual',
          'quiero el mensual' => 'mensual', 'No quiero pagar todo junto, prefiero por mes' => 'mensual'] as $f => $esperada) {
    caso("elige $esperada: \"$f\"", wabot_modalidad_elegida_en($f) === $esperada, (string)wabot_modalidad_elegida_en($f));
}
/* 19-sep: los planes se llaman "plan anual" y "plan mensual", que es como los
 * nombra el propio bot dos mensajes antes. "Me quedo con el plan mensual" no
 * elegía nada y el bot se callaba justo al cerrar. */
foreach (['Me quedo con el plan mensual' => 'mensual', 'Vamos con el plan mensual' => 'mensual',
          'Dale, el mensual' => 'mensual', 'Prefiero el plan anual' => 'unico', 'Dale el plan anual' => 'unico',
          'No quiero el plan mensual' => 'unico', 'Arranco con el plan mensual' => 'mensual'] as $f => $esperada) {
    caso("elige $esperada: \"$f\"", wabot_modalidad_elegida_en($f) === $esperada, (string)wabot_modalidad_elegida_en($f));
    // Rechazar una forma elige la otra, pero no es aceptar el primer diseño.
    if (stripos($f, 'no quiero') === false) {
        caso("y \"$f\" cuenta como aceptar el primer diseño", wabot_oferta_diseno_aceptada($f));
    }
}
foreach (['Puedo pagarla una sola vez?', 'Y si no quiero pagar todo junto?', 'Quiero saber del pago unico',
          'Cual me conviene mas, pagar una vez o por mes?', 'dale vamos de una',
          'cuanto sale el plan mensual?', 'el plan mensual incluye cambios?'] as $f) {
    caso('no elige nada: "' . $f . '"', wabot_modalidad_elegida_en($f) === null, (string)wabot_modalidad_elegida_en($f));
}

echo "\n-- La inmobiliaria que vende propiedades no es un proyecto mixto (19-sep) --\n";
foreach (['Tengo una inmobiliaria en Tigre, publico alquileres y ventas',
          'Soy martillero: alquileres y ventas',
          'Venta y alquiler de propiedades en zona sur',
          'Inmobiliaria, vendo y alquilo departamentos'] as $f) {
    caso('no es mixto: "' . mb_substr($f, 0, 46) . '"', wabot_ejes_mixtos($f) === null,
        json_encode(wabot_ejes_mixtos($f), JSON_UNESCAPED_UNICODE));
}
foreach (['Vendo ropa y alquilo departamentos', 'Alquilo departamentos y vendo muebles a medida'] as $f) {
    $e = wabot_ejes_mixtos($f);
    caso('sí es mixto: "' . mb_substr($f, 0, 46) . '"', $e !== null && isset($e['productos']) && isset($e['propiedades']),
        json_encode($e, JSON_UNESCAPED_UNICODE));
}

echo "\n-- Los días de entrega se dicen una sola vez (19-sep) --\n";
caso('preguntando el proceso y los plazos juntos, el plazo sale solo en los tres pasos',
    wabot_info_claves_sin_repetidas(['proceso', 'plazos']) === ['proceso']
    && wabot_info_claves_sin_repetidas(['plazos']) === ['plazos']);
$cDias = conv_nueva('999DIASTEST', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['proceso', 'plazos']]);
$rDias = turno('Cómo trabajan? y cuánto tardan más o menos?', $cDias, $cfg);
caso('y en la charla, "7 días" aparece una sola vez',
    substr_count(implode("\n", $rDias), '7 días') === 1, implode(' | ', $rDias));
clasifica(['otro']);
$cMod = conv_nueva('999MODTEST', ['tipo' => 'ecommerce', 'precio_dado' => true, 'fase' => 'prediseno']);
wabot_precio_congelar($cMod, 'ecommerce', $cfg);
$cMod['modalidad_elegida'] = ''; $cMod['modalidad_sincronizada'] = ''; $cMod['lead_creado'] = false; $cMod['lead_doc'] = null;
caso('anota la forma elegida', wabot_modalidad_anotar('Prefiero pagarla una sola vez', $cMod, $cfg) === true && $cMod['modalidad_elegida'] === 'unico');
caso('y el boceto la lleva en modalidad', strpos(json_encode(wabot_lead_campos($cMod, $cfg)), '"modalidad":{"stringValue":"unico"}') !== false);
$cMod['lead_creado'] = true; $cMod['lead_doc'] = 'projects/demo/databases/(default)/documents/propuestas/abc'; $cMod['modalidad_sincronizada'] = 'unico';
caso('si después cambia de idea, se completa en el boceto que ya existe',
    wabot_modalidad_anotar('Mejor quiero el mensual', $cMod, $cfg) === true
    && $cMod['modalidad_elegida'] === 'mensual' && $cMod['modalidad_sincronizada'] === 'mensual');
@unlink(WABOT_DATA . '/conv/999MODTEST.json');

todo_ok();
