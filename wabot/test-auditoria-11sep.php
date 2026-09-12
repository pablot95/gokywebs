<?php
/** Regresiones de las diez conversaciones reales del 11-sep. Solo CLI, sin red. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/agente.php';
$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$total = 0; $fallas = 0;
function caso($nombre, $ok) {
    global $total, $fallas;
    $total++;
    if (!$ok) $fallas++;
    echo ($ok ? 'OK ' : 'FALLO ') . $nombre . "\n";
}
function conv_audit($tipo = 'ecommerce') {
    global $cfg;
    $c = wabot_conv_load('QATESTREG11SEP');
    $c['tipo'] = $tipo; $c['fase'] = 'prediseno';
    $c['precio_dado'] = true; $c['cta_muestra'] = true;
    wabot_precio_congelar($c, $tipo, $cfg);
    return $c;
}

$pregunta = 'Puedo poner cupones de descuento para mis clientes?';
caso('cupones del cliente no es regateo', !wabot_es_regateo($pregunta));
caso('cupones tienen respuesta propia', wabot_info_por_palabras($pregunta, 'prediseno') === 'cupones');
foreach (['cupones', 'otra', 'como_funciona_tienda', 'que_incluye'] as $clave) {
    $c = conv_audit();
    wabot_conv_transcript($c, 'cliente', $pregunta);
    $r = wabot_agente_ejecutar('consultar_info', ['clave' => $clave], $c, $cfg, $pregunta);
    caso("$clave contesta los cupones sin desviar al carrito", mb_stripos($r['texto'] ?? '', 'cupones de descuento') !== false
        && empty($c['handoff_pendiente']) && $c['tipo'] === 'ecommerce');
}
foreach (['cobros_tienda', 'como_funciona_tienda', 'pago', 'otra'] as $clave) {
    $c = conv_audit();
    $p = 'Quiero que mis clientes paguen por Mercado Pago, se puede?';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_agente_ejecutar('consultar_info', ['clave'=>$clave], $c, $cfg, $p);
    caso("$clave responde Mercado Pago de sus compradores", strpos($r['texto'] ?? '', 'Mercado Pago') !== false
        && strpos($r['texto'] ?? '', 'tus clientes') !== false && strpos($r['texto'] ?? '', 'primer pago') === false);
}
caso('un código de descuento para pagar nuestra web no ofrece cupones de tienda',
    wabot_info_por_palabras('Me das un código de descuento para pagar la web?', 'prediseno') !== 'cupones');
$c = conv_audit('landing');
$r = wabot_agente_ejecutar('consultar_info', ['clave' => 'cupones'], $c, $cfg, $pregunta);
caso('no promete un panel de cupones en sitio profesional', !empty($r['error']));

// Una configuración ya migrada ayer también tiene que corregirse en un pase.
$previa = $cfg;
$previa['info']['que_incluye'] = "Está todo incluido. Adicionales hay solo dos: \$500 por producto y \$10.000 por mes. Preguntame y te digo si está incluido.";
$previa['info']['que_incluye_sin_productos'] = 'Está todo incluido. El único adicional es más de un cambio mensual. Preguntame y te digo si está incluido.';
wabot_config_migrar($previa);
foreach (['que_incluye', 'que_incluye_sin_productos'] as $clave) {
    caso("$clave no contradice el adicional del .com", !preg_match('/solo dos|[úu]nico adicional/iu', $previa['info'][$clave])
        && strpos($previa['info']['dominio_com'], '$40.000') !== false);
}
caso('los productos extra solo se cobran si los cargamos nosotros',
    strpos($previa['info']['que_incluye'], 'que carguemos') !== false && strpos($previa['info']['que_incluye'], 'podés cargarlos vos') !== false);
$otra = $previa;
wabot_config_migrar($otra);
caso('la configuración corregida es estable', $previa === $otra);

foreach (['Puedo dar de baja una propiedad cuando se vende y cargar otra yo mismo?',
          'Quiero dar de baja un producto', 'Puedo bloquear un usuario?', 'Eliminen mi foto de la demo'] as $p) {
    caso("no es baja de contacto: $p", wabot_cierre_sin_presion_tipo($p) !== 'baja');
}
foreach (['Quiero dar de baja', 'Darme de baja', 'No me escriban más', 'Bloqueame', 'Borren mi número'] as $p) {
    caso("respeta una baja real: $p", wabot_cierre_sin_presion_tipo($p) === 'baja');
}
$c = conv_audit('inmobiliaria');
$p = 'Puedo dar de baja una propiedad cuando se vende y cargar otra yo mismo?';
wabot_conv_transcript($c, 'cliente', $p);
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('editar una propiedad conserva el contacto activo', empty($c['bot_off']) && ($c['cierre'] ?? '') !== 'baja');
wabot_conv_transcript($c, 'cliente', 'Dale, mandame el formulario para la demo');
$r = wabot_salida_preparar(wabot_responder('Dale, mandame el formulario para la demo', $c, $cfg), $c, $cfg);
caso('después de editar una propiedad puede pedir el formulario', strpos(implode(' ', $r ?? []), 'gokywebs.com/form/') !== false);

foreach (['Cuánto tengo que pagar ahora para ver la demo?', 'La demo se paga?', 'Cuánto cuesta la demo?',
          'Tengo que abonar antes de ver la muestra?'] as $p) {
    foreach (['agente', 'fijo'] as $modo) {
        $c = conv_audit('elearning');
        $conf = $cfg; $conf['modo_redaccion'] = $modo;
        wabot_conv_transcript($c, 'cliente', $p);
        $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
        $txt = implode(' ', $r ?? []);
        caso("$modo explica que ver la demo no se paga: $p", strpos($txt, 'La demo no se paga') !== false
            && strpos($txt, '$90.000') === false && empty($c['handoff_pendiente']));
    }
}
caso('pagar el desarrollo después de la demo sigue siendo otra consulta',
    !wabot_texto_pregunta_pago_demo('Ya vi la demo, cuánto es el primer pago del desarrollo?'));
$c = conv_audit('elearning');
$r = wabot_agente_ejecutar('consultar_info', ['clave'=>'que_incluye'], $c, $cfg,
    'El acceso de alumnos está incluido? Y el dominio puede ser .com?');
caso('acceso de alumnos responde usuarios sin el bloque genérico', strpos($r['texto'] ?? '', 'usuarios') !== false);

$c = conv_audit('landing');
$c['fase'] = 'postdemo'; $c['presentado_ts'] = time(); $c['lead_creado'] = true;
$p = 'Me gustó la demo, pero podés cambiar el fondo a beige? Y los turnos online están incluidos?';
wabot_conv_transcript($c, 'cliente', $p);
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
$txt = implode(' ', $r ?? []);
caso('postdemo anota el beige y también responde los turnos', strpos($c['cambios_pedidos'] ?? '', 'beige') !== false
    && strpos($txt, 'turnos online') !== false && strpos($txt, 'anoto esos cambios') !== false
    && empty($c['handoff_pendiente']));
caso('las preguntas separadas conservan el dominio .com',
    in_array('dominio_com', wabot_preguntas_del_mensaje('El dominio puede ser .com? Y tiene estadísticas?', $c), true));

foreach (['agente', 'fijo'] as $modo) {
    $conf = $cfg; $conf['modo_redaccion'] = $modo;
    $c = conv_audit('landing');
    $p = 'Y si además quiero vender productos de skincare y cobrarlos online, cuánto sale todo junto?';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
    caso("$modo cotiza alternativa sin cambiar aún el tipo", $c['tipo'] === 'landing'
        && ($c['upgrade_pendiente']['tipo'] ?? '') === 'ecommerce'
        && strpos(implode(' ', $r ?? []), '$90.000') !== false);
    $p = 'Entonces serían 90 mil de primer pago y 30 mil por mes en total, no los dos planes juntos?';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
    caso("$modo aclara total sin sumar planes ni volver al anterior", strpos(implode(' ', $r ?? []), 'tienda online: $90.000') !== false
        && strpos(implode(' ', $r ?? []), 'No es un adicional') !== false);
    $p = 'Sí, quiero la demo con la tienda y los turnos';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
    caso("$modo acepta tienda con cotización y formulario coherentes", $c['tipo'] === 'ecommerce'
        && $c['precio_cotizado'] === '$90.000' && $c['mensualidad_cotizada'] === '$30.000'
        && strpos(implode(' ', $r ?? []), 'gokywebs.com/form/') !== false && empty($c['handoff_pendiente']));
}
caso('combinar tienda y cursos conserva el alcance especial',
    wabot_texto_pregunta_upgrade('Quiero agregar una tienda y cursos grabados, cuánto sale todo junto?', 'landing') === null);
$c = conv_audit('landing');
$c['upgrade_pendiente'] = wabot_precio_vigente(null, $cfg, 'ecommerce');
$c['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($c, $cfg);
caso('el cambio de alcance pendiente no sobrevive una sesión vieja', empty($c['upgrade_pendiente']));

foreach ([false, true] as $recibido) {
    $c = conv_audit('landing'); $c['link_form_enviado'] = true;
    $c['form_completado_ts'] = $recibido ? time() : 0;
    $p = 'Ya completé todo, te llegó?';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
    caso('consulta recepción con formulario ' . ($recibido ? 'recibido' : 'pendiente'),
        strpos(implode(' ', $r ?? []), $recibido ? 'Sí, ya lo tengo' : 'Todavía no me llegó el formulario') !== false
        && empty($c['handoff_pendiente']));
}
foreach (['agente', 'fijo'] as $modo) {
    $conf = $cfg; $conf['modo_redaccion'] = $modo;
    $c = conv_audit('landing');
    $p = 'Me gustaría hablar por acá con un asesor antes de decidir';
    wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
    caso("$modo respeta el pedido cordial de asesor sin mandar el formulario", !empty($c['handoff_pendiente'])
        && $c['fase'] === 'derivado' && strpos(implode(' ', $r ?? []), 'gokywebs.com/form/') === false);
}
caso('el asesor que cuenta su propio rubro no pide un humano',
    wabot_handoff_causa_explicita('Soy asesor de seguros y me gustaría mostrar mis servicios en una web') !== 'pide_humano');
caso('el aviso de formulario no tapa una pregunta distinta',
    !wabot_form_pregunta_recepcion('Ya completé todo, te llegó? Cuánto tarda la demo?'));

echo "\n" . ($fallas ? "FALLAS: $fallas" : 'TODO OK') . " — $total casos\n";
exit($fallas ? 1 : 0);
