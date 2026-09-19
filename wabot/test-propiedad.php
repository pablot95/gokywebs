<?php
/**
 * wabot/test-propiedad.php — la propiedad de la web no la contesta el bot
 * (Pablo, 19-sep): de quién es la web, el dominio o el código, si le entregan
 * el código o los archivos, qué pasa si cancela o deja de pagar, si se la
 * puede llevar a otro hosting o a otro programador. El bot no responde ni
 * explica condiciones: se calla, se apaga en ese chat y la charla queda
 * pendiente para Pablo (solo CLI).
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

echo "— Las preguntas de Pablo, tal cual —\n";
foreach (['La página queda a mi nombre?', 'La web es mía?', 'Soy dueño de la página?', 'El código me pertenece?',
          'Me entregan el código fuente?', 'Qué pasa con la página si dejo de pagar?', 'Si cancelo la suscripción pierdo la web?',
          'Puedo llevarme la página a otro hosting?', 'Puedo contratar a otro programador después?', 'Me dan los archivos de la web?',
          'Después de un año la página queda para mí?', 'Si pago mensualmente, en algún momento pasa a ser mía?',
          'Qué pasa con el dominio si cancelo?'] as $p) {
    caso("no la contesta: \"$p\"", wabot_pregunta_propiedad($p) !== null);
}

echo "— Otras formas de preguntar lo mismo —\n";
foreach (['la web queda a mi nombre', 'de quien es la web?', 'quien es el dueño del dominio', 'y es mia?',
          'el dominio a nombre de quien queda?', 'la web es de ustedes o mia?', 'quien tiene los derechos de la web',
          'puedo vender mi dominio a futuro?', 'quiero saber si la pagina queda a mi nombre', 'Quiero que quede a mi nombre, se puede?',
          'La compro o la alquilo?', 'quien se queda con el codigo?', 'las licencias de plugins estan a mi nombre?',
          'si me doy de baja que pasa', 'tiene permanencia?', 'hay un minimo de meses?', 'me quedo atado?',
          'si no renuevo el plan anual que pasa?', 'y si dejo de pagar el mensual?', 'puedo cancelar cuando quiera?',
          'y si después no quiero seguir?', 'que pasa cuando termine el año?',
          'puedo cambiar de hosting mas adelante?', 'otro programador la podria modificar?', 'la puedo llevar a otro servidor?',
          'si mas adelante quiero pasarla a otro proveedor se puede?', 'se puede migrar a otro hosting despues?',
          'me pasan los accesos del hosting?', 'tengo acceso al codigo?', 'me puedo quedar con la web si me voy?',
          'me pasan el cpanel?', 'hacen backup?', 'y lo del codigo como es?', 'Cuanto sale una tienda? Y la web queda a mi nombre?'] as $p) {
    caso("no la contesta: \"$p\"", wabot_pregunta_propiedad($p) !== null);
}

echo "— Lo que no es la propiedad sigue igual —\n";
foreach (['Hola, quiero hacer mi propia página web', 'Quiero una web propia para mi negocio',
          'Soy dueña de una peluquería y quiero una web', 'Hola soy el dueño de Pizzeria Don Juan',
          'la empresa es mía y quiero una web', 'quiero una web para llevar más clientes a mi empresa', 'cuanto sale?',
          'necesito cuenta de mercado pago para pagar?', 'puedo cambiar yo los textos?', 'los clientes pueden cancelar un turno?',
          'puedo dar de baja una propiedad desde el panel?', 'si cancelo un turno le avisa al cliente?', 'tiene panel de control?',
          'la factura sale a mi nombre?', 'pago con transferencia a mi nombre', 'quiero cambiar de programador, el mio no me responde',
          'Tuve otra agencia que me dejó colgado', 'otro programador me la hizo y no puede actualizarla',
          'quiero migrar mi web actual a otro hosting', 'se cae la pagina si hay mucho trafico?', 'que pasa si no me gusta el diseño?',
          'cual es el tiempo minimo de entrega?', 'me dan acceso al panel para cargar productos?', 'queda linda para mi negocio?',
          'Tengo un dominio comprado, lo puedo usar?', 'se puede pagar en cuotas?', 'el mantenimiento que incluye?',
          'cuanto tarda en estar lista?', 'con el codigo postal calcula el envio?', 'aceptan el codigo de descuento?'] as $p) {
    caso("sigue: \"$p\"", wabot_pregunta_propiedad($p) === null, (string)wabot_pregunta_propiedad($p));
}

echo "— Decir que la quiere propia no es preguntar: sigue el pago único (19-sep) —\n";
foreach (['Quiero que la web sea mía', 'la quiero en mi hosting', 'Tengo mi propio hosting', 'Quiero la web a mi nombre, en mi propio hosting',
          'Tengo mi propio hosting, la pueden subir ahí?', 'Cuánto sale sin mantenimiento?', 'Tienen pago único?'] as $p) {
    caso("web propia, no la propiedad: \"$p\"", wabot_pregunta_propiedad($p) === null, (string)wabot_pregunta_propiedad($p));
}

echo "— En la charla: no contesta nada y queda para Pablo —\n";
$c = conv_nueva('549110000PROPTEST1');
clasifica(['saludo']);
$r = turno('Hola! La página queda a mi nombre?', $c, $cfg);
caso('primer mensaje con la pregunta: no contesta nada, ni el saludo', $r === [], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('el bot queda apagado en el chat, sin seguimientos y pendiente para Pablo',
    !empty($c['bot_off']) && ($c['cierre'] ?? '') === 'propiedad' && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']) && ($c['fase'] ?? '') === 'derivado');
caso('con el evento de la sesión', isset($c['eventos_emitidos_sesion']['propiedad_para_pablo']));
caso('lo que mande después tampoco lo contesta', turno('Hola? Me decís?', $c, $cfg) === [] && turno('Cuánto sale?', $c, $cfg) === []);

$c = conv_nueva('549110000PROPTEST2', ['fase' => 'menu']);
clasifica(['rubro_comercio']);
$r = turno('Vendo ropa. Cuánto sale? Y la web queda a mi nombre?', $c, $cfg);
caso('con otra pregunta en el mismo mensaje no contesta ninguna: ni el precio', $r === [] && empty($c['precio_dado']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('549110000PROPTEST3', ['fase' => 'menu']);
clasifica(['rubro_comercio']);
$r = turno('Vendo ropa', $c, $cfg);
caso('(se cotiza y se ofrece el primer diseño)', !empty($c['precio_dado']) && !empty($c['oferta_diseno_ts']) && count($r) === 2);
clasifica(['otro']);
$r = turno('Y si dejo de pagar, pierdo la web?', $c, $cfg);
caso('después del precio, tampoco: silencio con el motivo de la propiedad',
    $r === [] && ($c['cierre'] ?? '') === 'propiedad' && !empty($c['bot_off']) && empty($c['oferta_diseno_ts']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('549110000PROPTEST4', ['fase' => 'postdemo', 'tipo' => 'landing', 'precio_dado' => true,
    'presentado_ts' => time() - 3600, 'presentado_slug' => 'demo-test']);
clasifica(['otro']);
$r = turno('Me encantó! Me dan el código fuente cuando esté lista?', $c, $cfg);
caso('con la demo entregada, tampoco', $r === [] && ($c['cierre'] ?? '') === 'propiedad', json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— El mismo freno para lo que clasifica Gemini —\n";
$c = conv_nueva('549110000PROPTEST5', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['titularidad']]);
$r = turno('Una consulta sobre lo legal del sitio', $c, $cfg);
caso('Gemini dice titularidad: se calla igual', $r === [] && ($c['cierre'] ?? '') === 'propiedad' && !empty($c['bot_off']),
    json_encode($r, JSON_UNESCAPED_UNICODE));
caso('(esas dos no las agarra el borde: las frena el motor)',
    wabot_pregunta_propiedad('Una consulta sobre lo legal del sitio') === null && wabot_pregunta_propiedad('una pregunta tecnica sobre el codigo') === null);
foreach (['entrega_codigo' => 'una pregunta tecnica sobre el codigo', 'licencias' => 'y las licencias?', 'accesos' => 'me pasan el ftp despues?'] as $clave => $p) {
    $c = conv_nueva('549110000PROPTEST6', ['fase' => 'menu']);
    clasifica(['pregunta_info'], ['info_keys' => [$clave]]);
    $r = turno($p, $c, $cfg);
    caso("Gemini dice $clave: se calla", $r === [] && ($c['cierre'] ?? '') === 'propiedad', json_encode($r, JSON_UNESCAPED_UNICODE));
}
$c = conv_nueva('549110000PROPTEST7', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['baja_del_plan']]);
$r = turno('Necesito cuenta de Mercado Pago?', $c, $cfg);
caso('"¿necesito cuenta de Mercado Pago?" se contesta aunque Gemini diga baja',
    mb_stripos(implode(' ', $r), 'No hace falta tener cuenta de Mercado Pago') !== false && empty($c['bot_off'])
    && !preg_match('/permanencia|de baja|desactiva/iu', implode(' ', $r)), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_nueva('549110000PROPTEST8', ['fase' => 'menu']);
clasifica(['otro']);
$r = turno('Quiero que la web sea mía', $c, $cfg);
caso('"quiero que la web sea mía" sigue con el pago único de la web propia', count($r) >= 1
    && mb_stripos(implode(' ', $r), 'pago único') !== false && empty($c['bot_off']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— Si Pablo vuelve a prender el bot —\n";
$c = conv_nueva('549110000PROPTEST9', ['fase' => 'menu']);
clasifica(['otro']);
turno('Soy dueño de la página?', $c, $cfg);
wabot_conv_encender_manual($c);
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = turno('Cuánto tarda en estar lista?', $c, $cfg);
caso('prendido a mano, el corte de la propiedad ya no lo frena', $r !== [], json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
$r = turno('Y el dominio es mío?', $c, $cfg);
caso('y otra pregunta de propiedad lo vuelve a callar', $r === [] && !empty($c['bot_off']) && ($c['cierre'] ?? '') === 'propiedad',
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— Ningún texto del bot explica la propiedad —\n";
$todo = json_encode($cfg, JSON_UNESCAPED_UNICODE);
foreach (['a nombre de Gokywebs', '2 años de plan', 'reclamar el código', 'es tuyo es la web', 'La web queda a tu nombre',
          'si la querés tuya'] as $frase) {
    caso("ningún texto dice \"$frase\"", mb_stripos($todo, $frase) === false);
}
foreach (wabot_claves_propiedad() as $clave) {
    caso("\"$clave\" no tiene texto", !isset($cfg['info'][$clave]) && wabot_texto_info($clave, $cfg) === '');
}

todo_ok();
