<?php
/** Contratos comerciales y silencio posterior al precio, sin red ni pagos reales. */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/respuestas-rapidas.php';
require_once __DIR__ . '/push.php';
$cfg = wabot_config_load();
$cfg['postprecio_activo'] = true;
$GLOBALS['WABOT_TEST_POSTPRECIO_ACTIVO'] = true;
$cfg['form_activo'] = true;
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-real';

$c = pp_conv(); pp_api(pp_decision(['cupones']));
$r = turno('Puedo crear cupones de descuento para mis clientes?', $c, $cfg);
caso('cupón del comercio no se confunde con pedir rebaja de la web', $r !== [] && empty($c['control_manual']) && str_contains(implode(' ', $r), 'cupones'));
$c = pp_conv(); pp_api(pp_decision(['plan_servicio']));
$r = turno('Lo mensual son cuotas del desarrollo?', $c, $cfg);
caso('el mensual se explica como servicio, no cuotas', str_contains(implode(' ', $r), 'No son cuotas'));
$c = pp_conv(); pp_api(pp_decision(['plazos']));
$r = turno('Cuándo llega la demo?', $c, $cfg);
caso('no se usa el plazo de desarrollo para contestar por la demo', pp_silencio($c, $r));
$c = pp_conv(); pp_api(pp_decision(['demo_plazo']));
$r = turno('Cuándo llega la muestra?', $c, $cfg);
caso('la muestra depende del formulario real', str_contains(implode(' ', $r), 'necesitamos recibir el formulario'));
$c = pp_conv('ecommerce', ['form_completado_ts' => time() - 2 * 86400]); pp_api(pp_decision(['demo_plazo']));
$r = turno('Cuándo llega la muestra?', $c, $cfg);
caso('una demora vencida pasa a Pablo sin renovar la promesa', pp_silencio($c, $r));
$c = pp_conv('ecommerce', ['pago_avisado_ts' => time()]); pp_api(pp_decision(['cambios']));
$r = turno('Quiero cambiar las fotos', $c, $cfg);
caso('un pago existente no vuelve al flujo de venta', pp_silencio($c, $r) && $GLOBALS['PP_PEDIDOS'] === []);
$c = pp_conv(); pp_api(pp_decision(['hosting'], ['consultas' => [['texto' => 'Pregunta nueva', 'reglas' => []]]]));
$r = turno('Tengo una pregunta nueva y el hosting?', $c, $cfg);
caso('una consulta sin regla asociada deriva toda la tanda', pp_silencio($c, $r));

$c = pp_conv('landing');
$c['precio_cotizado'] = '$180.000'; $c['mensualidad_cotizada'] = '$25.000'; $c['precio_unico_cotizado'] = '$240.000';
$p = wabot_precio_vigente($c, $cfg);
caso('cotización original de septiembre toma las nuevas tarifas menores', $p['precio'] === '$140.000' && $p['mensualidad'] === '$22.000' && $p['precio_unico'] === '$220.000');
$c2 = pp_conv('ecommerce');
$c2['precio_cotizado'] = '$190.000'; $c2['mensualidad_cotizada'] = '$29.900'; $c2['precio_unico_cotizado'] = '$290.000';
$p2 = wabot_precio_vigente($c2, $cfg);
// 2-oct la lista bajó a $29.000 y valía la lista; desde el 3-oct la lista ($32.000 / $220.000 / $330.000) es más alta: vale lo congelado.
caso('cotización del 1-oct con $29.900 conserva sus montos, más bajos que la lista del 3-oct', $p2['mensualidad'] === '$29.900' && $p2['precio'] === '$190.000' && $p2['precio_unico'] === '$290.000');
$c['precio_cotizado'] = '$120.000'; $c['presentado_ts'] = time(); $c['modalidad_elegida'] = 'anual';
pp_api(pp_decision(['pago_link']));
$r = turno('Mandame el link del anual', $c, $cfg);
caso('una oferta especial menor no recibe una página que cobra más', pp_silencio($c, $r));

$d = ['accion' => 'cotizar', 'tipo_web' => 'plataforma_cursos', 'mensajes' => [], 'segunda_web' => 'sin_definir'];
$c = conv_nueva();
$r = wabot_ia_redes($d, 'Doy cursos', $c, $cfg);
caso('cursos sin modalidad se aclaran antes de cotizar', $r['accion'] === 'responder' && str_contains(implode(' ', $r['mensajes']), 'online o presenciales'));
$r = wabot_ia_redes($d, 'Doy cursos grabados online', $c, $cfg);
caso('cursos con modalidad conocida conservan cotización', $r['accion'] === 'cotizar');
$r = wabot_ia_redes(array_merge($d, ['tipo_web' => 'tienda_online']), 'Ofrezco servicios financieros', $c, $cfg);
caso('servicios financieros se presentan con sitio profesional', $r['tipo_web'] === 'sitio_profesional');

// Mismo borde de envío y cola que usa producción, con WhatsApp simulado.
$src = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($src, 'function wabot_conv_identidad_entrante');
$hasta = strpos($src, '/* ── Instagram: otro formato');
eval(substr($src, $desde, $hasta - $desde));
$cfg['activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;
$tel = '5491100000088TEST';
$c = pp_conv(); $c['tel'] = $tel; $c['conversation_key'] = $tel; $c['channel_user_id'] = $tel;
wabot_conv_save($c); $GLOBALS['WABOT_TEST_ENVIADOS'] = [];
pp_api(pp_decision(['hosting']));
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pp.host'),
    'canal' => 'whatsapp', 'texto' => 'Incluye hosting?', 'nombre' => 'Cliente', 'media' => null], $cfg);
$cv = wabot_conv_load($tel);
caso('webhook envía y registra respuesta aprobada', count($GLOBALS['WABOT_TEST_ENVIADOS']) === 1
    && !empty($cv['postprecio_auto']) && end($cv['transcript'])['q'] === 'bot');
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
pp_api(pp_decision([], ['accion' => 'derivar', 'cobertura_completa' => false, 'no_cubierto' => ['SAP']]));
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pp.unknown'),
    'canal' => 'whatsapp', 'texto' => 'Integrás SAP?', 'nombre' => 'Cliente', 'media' => null], $cfg);
$cv = wabot_conv_load($tel);
caso('webhook deriva sin enviar ni registrar una respuesta inexistente', $GLOBALS['WABOT_TEST_ENVIADOS'] === []
    && pp_silencio($cv, []) && end($cv['transcript'])['q'] === 'cliente');
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pp.late'),
    'canal' => 'whatsapp', 'texto' => 'Dale', 'nombre' => 'Cliente', 'media' => null], $cfg);
caso('webhook mantiene silencio en el siguiente mensaje', $GLOBALS['WABOT_TEST_ENVIADOS'] === [] && !empty(wabot_conv_load($tel)['control_manual']));
$cv = pp_conv(); $cv['tel'] = $tel; $cv['conversation_key'] = $tel; $cv['channel_user_id'] = $tel; wabot_conv_save($cv);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pp.media'),
    'canal' => 'whatsapp', 'texto' => '', 'nombre' => 'Cliente', 'media' => null], $cfg);
caso('media no interpretable después del precio queda para humano sin aviso', $GLOBALS['WABOT_TEST_ENVIADOS'] === [] && !empty(wabot_conv_load($tel)['postprecio_derivacion']));
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel));
$tmp = sys_get_temp_dir() . '/wabot-postprecio-' . getmypid();
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_IA_SOMBRA_DIR'] = $tmp . '/sombra';
function pp_conv($tipo = 'ecommerce', $extra = []) {
    global $cfg;
    $c = conv_nueva('999POSTTEST999', array_merge(['tipo' => $tipo, 'precio_dado' => true,
        'fase' => 'prediseno', 'nombre' => 'Cliente', 'oferta_diseno_ts' => time()], $extra));
    wabot_precio_congelar($c, $tipo, $cfg);
    return $c;
}
function pp_decision($reglas, $extra = []) {
    return array_merge(['accion' => 'responder', 'reglas' => $reglas, 'cobertura_completa' => true,
        'consultas' => [['texto' => 'Consulta del caso', 'reglas' => $reglas]],
        'no_cubierto' => [], 'modelo' => 'ninguno', 'motivo' => 'Consulta cubierta'], $extra);
}
function pp_api($d, $http = 200) {
    $GLOBALS['PP_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($p) use ($d, $http) {
        $GLOBALS['PP_PEDIDOS'][] = $p;
        if ($http !== 200) return [$http, '{}'];
        return [200, json_encode(['status' => 'completed', 'model' => 'gpt-6-sol',
            'output' => [['type' => 'message', 'content' => [['type' => 'output_text',
                'text' => json_encode($d, JSON_UNESCAPED_UNICODE)]]]]])];
    };
}
function pp_silencio($c, $r) {
    return $r === [] && !empty($c['control_manual']) && !empty($c['bot_off'])
        && !empty($c['handoff_pendiente']) && !empty($c['seguimiento_bloqueado']);
}

foreach (['landing' => ['$22.000', '$140.000', '$220.000', '$80.000', '$160.000'],
    'ecommerce' => ['$32.000', '$220.000', '$330.000', '$160.000', '$270.000'],
    'elearning' => ['$32.000', '$220.000', '$330.000', '$160.000', '$270.000'],
    'inmobiliaria' => ['$32.000', '$220.000', '$330.000', '$160.000', '$270.000']]
    as $tipo => [$mes, $anual, $unico, $saldo, $saldoUnico]) {
    $c = pp_conv($tipo);
    $p = wabot_precio_vigente($c, $cfg, $tipo);
    caso("$tipo: nuevos precios y saldo anual", $p['mensualidad'] === $mes && $p['precio'] === $anual
        && $p['precio_unico'] === $unico && $p['sena'] === '$60.000' && $p['saldo'] === $saldo);
    caso("$tipo: páginas coinciden con cotización", wabot_planes_paginas_corresponde($tipo, $c, $cfg));
    caso("$tipo: imagen histórica no se envía con tarifas nuevas", !wabot_precio_imagen_corresponde($tipo, $c, $cfg));
    pp_api(pp_decision(['pago']));
    $r = turno('Cómo se abona la seña y el saldo?', $c, $cfg);
    // Corta desde el 2-oct: el primer mes y la seña de ESTA cotización, sin otros importes.
    $todoPago = implode(' ', $r);
    preg_match_all('/\$\d{1,3}(?:\.\d{3})+/u', $todoPago, $importes);
    caso("$tipo: respuesta de pago no inventa importes", str_contains($todoPago, $mes) && str_contains($todoPago, '$60.000')
        && !array_diff($importes[0], [$mes, '$60.000']), $todoPago);
    $c = pp_conv($tipo, ['presentado_ts' => time(), 'modalidad_elegida' => 'mensual']);
    pp_api(pp_decision(['pago_link']));
    $r = turno('Pasame el link para pagar el mensual', $c, $cfg);
    $pagina = $tipo === 'landing' ? 'mensual22000' : 'mensual32000';
    caso("$tipo: enlace mensual correcto", str_contains(implode(' ', $r), '/pago/' . $pagina . '/'));
}
// 3-oct: el pago único no se ofrece; la respuesta de pago lo nombra solo al que lo eligió.
$c = pp_conv('ecommerce'); pp_api(pp_decision(['pago']));
$r = turno('Cómo se abona la seña y el saldo?', $c, $cfg);
caso('la respuesta de pago nombra el mensual y el anual, sin el pago único (3-oct)',
    str_contains(implode(' ', $r), 'Con el anual dejás una seña') && !str_contains(implode(' ', $r), 'pago único'), implode(' ', $r));
$c = pp_conv('ecommerce', ['modalidad_elegida' => 'propia']); pp_api(pp_decision(['pago']));
$r = turno('Cómo se abona la seña y el saldo?', $c, $cfg);
caso('al que eligió el pago único, la seña vale también para el pago único (3-oct)',
    str_contains(implode(' ', $r), 'Con el anual o el pago único dejás una seña'), implode(' ', $r));
$c = pp_conv('ecommerce', ['presentado_ts' => time()]); pp_api(pp_decision(['pago_link']));
$r = turno('Pasame el link para pagar', $c, $cfg);
caso('sin modalidad elegida, pregunta entre el mensual y el anual (3-oct)',
    $r === ['Qué modalidad preferís para avanzar: mensual o anual?'] && ($c['postprecio_pregunta'] ?? '') === 'modalidad', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = pp_conv();
pp_api(pp_decision(['mantenimiento', 'hosting', 'carga']));
$r = turno('Qué mantenimiento incluye? El hosting va incluido y puedo cargar yo los productos?', $c, $cfg);
$salida = implode(' ', $r);
caso('tres preguntas conocidas se responden juntas, sin reiniciar el embudo', count($r) === 1
    && str_contains($salida, 'hosting') && str_contains($salida, 'panel') && empty($c['control_manual']));
$payload = $GLOBALS['PP_PEDIDOS'][0];
caso('Sol recibe clasificación cerrada con esquema estricto y sin teléfono', $payload['model'] === 'gpt-6-sol'
    && $payload['text']['format']['strict'] === true && $payload['store'] === false
    && !str_contains($payload['safety_identifier'], '999POSTTEST999'));

$c = pp_conv();
pp_api(pp_decision(['hosting'], ['cobertura_completa' => false, 'no_cubierto' => ['Integración nueva'], 'motivo' => 'Integración nueva']));
$r = turno('Incluye hosting? Podés integrar mi ERP?', $c, $cfg);
caso('consulta mixta deriva completa sin responder la parte conocida', pp_silencio($c, $r));
$r = turno('Dale, pasame el formulario', $c, $cfg);
caso('una derivación no se reabre con un sí posterior', pp_silencio($c, $r));
$c['ultimo_ts'] = time() - 30 * 86400;
caso('una derivación no vence por antigüedad', wabot_conv_reset_si_vieja($c, $cfg) === false);
wabot_conv_encender_manual($c);
pp_api(pp_decision(['hosting']));
$r = turno('El hosting está incluido?', $c, $cfg);
caso('solo la reactivación manual permite seguir', $r !== [] && empty($c['control_manual']));

foreach (['Ya pagué, te mando el comprobante', 'Podemos negociar el precio?', 'Quiero hablar con Pablo', 'Me llamás?', 'Tengo un reclamo'] as $texto) {
    $c = pp_conv(); pp_api(pp_decision(['precio']));
    $r = turno($texto, $c, $cfg);
    caso('intervención personal: ' . $texto, pp_silencio($c, $r) && $GLOBALS['PP_PEDIDOS'] === []);
}
$c = pp_conv(); pp_api(pp_decision(['precio']), 503);
$r = turno('Qué precio tenía?', $c, $cfg);
caso('falla de API produce silencio sin respuesta de respaldo', pp_silencio($c, $r));
$c = pp_conv(); $d = pp_decision(['precio']); unset($d['no_cubierto']); pp_api($d);
$r = turno('Cuánto costaba?', $c, $cfg);
caso('respuesta incompleta se rechaza en el servidor', pp_silencio($c, $r));
$c = pp_conv(); pp_api(pp_decision(['precio'], ['mensajes' => ['Descuento inventado']]));
$r = turno('Precio?', $c, $cfg);
caso('un campo de texto libre no se acepta', pp_silencio($c, $r));
$c = pp_conv(); pp_api(pp_decision(['no_existe']));
$r = turno('Consulta nueva', $c, $cfg);
caso('regla inexistente se rechaza', pp_silencio($c, $r));
$c = pp_conv('landing'); pp_api(pp_decision(['modelo', 'envios'], ['modelo' => '2']));
$c['presentado_ts'] = time();
$r = turno('Elijo el 2, tiene envíos?', $c, $cfg);
caso('si una regla no aplica al tipo no hay salida ni cambios parciales', pp_silencio($c, $r) && empty($c['postprecio_modelo']));

$c = pp_conv(); pp_api(pp_decision(['demo_aceptar']));
$r = turno('Dale', $c, $cfg);
caso('aceptar la muestra envía formulario, no suscribe ni apaga el bot', tiene_form($r)
    && !empty($c['link_form_enviado']) && !empty($c['postprecio_auto']) && empty($c['bot_off']));
$c['form_completado_ts'] = time(); pp_api(pp_decision(['form_estado']));
$r = turno('Te llegó el formulario?', $c, $cfg);
caso('formulario recibido se confirma por el registro real sin prometer mañana', str_contains(implode(' ', $r), 'recibimos') && !str_contains(implode(' ', $r), 'mañana'));
$c = pp_conv(); pp_api(pp_decision(['form_estado']));
$r = turno('Te llegó el formulario?', $c, $cfg);
caso('formulario no recibido no se da por recibido', str_contains(implode(' ', $r), 'Todavía no figura'));
$c = pp_conv(); $c['postprecio_auto'] = true; $c['presentado_ts'] = time();
wabot_conv_preparar_postdemo($c);
caso('entregar demo conserva automatización aprobada', empty($c['control_manual']) && empty($c['bot_off']) && $c['fase'] === 'postdemo');
pp_api(pp_decision(['modelo'], ['modelo' => '2']));
$r = turno('Me gusta la segunda', $c, $cfg);
caso('modelo elegido se guarda y se piden los cambios', ($c['postprecio_modelo'] ?? '') === '2' && str_contains(implode(' ', $r), 'cambios'));
pp_api(pp_decision(['cambios']));
$r = turno('Quiero el fondo azul y cambiar las fotos', $c, $cfg);
caso('cambios se anotan sin afirmar que ya se realizaron', !empty($c['cambios_pedidos']) && str_contains(implode(' ', $r), 'Anoté'));
wabot_conv_tomar_control($c); wabot_conv_preparar_postdemo($c);
caso('entregar demo con control humano conserva el silencio', !empty($c['bot_off']) && !empty($c['control_manual']));

foreach (['Gracias', '👍', 'Gracias por comunicarte, nuestro horario de atención es de 9 a 18'] as $texto) {
    $c = pp_conv(); pp_api(pp_decision(['form_estado']));
    $r = turno($texto, $c, $cfg);
    caso('acuse o respuesta automática no inventa avance: ' . $texto, $r === [] && empty($c['control_manual']) && $GLOBALS['PP_PEDIDOS'] === []);
}
// El pago único ya no se ofrece (3-oct), pero al que lo elige igual se le manda su página.
foreach (['landing' => ['anual140', 'unico220'], 'ecommerce' => ['anual220', 'unico330']] as $tipo => [$anual, $propia]) {
    foreach (['El plan anual' => [$anual, 'plan anual'], 'El pago único' => [$propia, 'pago único']] as $texto => [$pagina, $nombre]) {
        $c = pp_conv($tipo, ['presentado_ts' => time()]);
        pp_api(pp_decision(['pago_link']));
        $r = turno($texto, $c, $cfg);
        caso("$tipo: elección real de $nombre usa su página correcta", str_contains(implode(' ', $r), '/pago/' . $pagina . '/')
            && str_contains(implode(' ', $r), $nombre));
    }
}
// 2-oct (Pablo): los links al detalle de cada modalidad ya no van en el turno
// del precio; salen cuando el cliente los pide.
caso('detalle_modalidades está en el catálogo que ve el clasificador', isset(wabot_postprecio_catalogo()['detalle_modalidades']));
foreach (['landing' => ['mensual22000', 'anual140'], 'ecommerce' => ['mensual32000', 'anual220']] as $tipo => $paginas) {
    $c = pp_conv($tipo);
    pp_api(pp_decision(['detalle_modalidades']));
    $r = turno('Tenés más info de cada plan? Dónde veo qué incluye cada uno?', $c, $cfg);
    $todo = implode(' ', $r);
    caso("$tipo: si pide el detalle, manda los links de sus 2 páginas (mensual y anual; 3-oct, sin el pago único)", count($r) === 1 && $r[0] === links_de_precio($tipo)
        && !array_filter($paginas, static fn($p) => !str_contains($todo, 'gokywebs.com/pago/' . $p))
        && !str_contains($todo, 'gokywebs.com/pago/unico') && empty($c['control_manual']), $todo);
}
$c = pp_conv('ecommerce');
$c['mensualidad_cotizada'] = '$15.000';
pp_api(pp_decision(['detalle_modalidades']));
$r = turno('Pasame el detalle de cada modalidad', $c, $cfg);
caso('con un precio especial más bajo que las páginas, el detalle lo ve Pablo', pp_silencio($c, $r));

$c = pp_conv('ecommerce', ['presentado_ts' => time()]);
pp_api(pp_decision(['modelo', 'postergar'], ['modelo' => '1']));
$r = turno('Me gustó el primer diseño, estoy resolviendo en familia si mensual o anual', $c, $cfg);
caso('primer diseño guarda el modelo 1 sin derivar', ($c['postprecio_modelo'] ?? '') === '1' && empty($c['control_manual']) && $r !== []);
$c = pp_conv('landing', ['presentado_ts' => time(), 'postprecio_modelo' => '2']);
pp_api(pp_decision(['modelo', 'que_necesitan'], ['modelo' => '2']));
$r = turno('Si así es. Te paso los números de contacto y mail?', $c, $cfg);
caso('confirmación del modelo guardado permite contestar la consulta adicional', $r !== [] && empty($c['control_manual']) && ($c['postprecio_modelo'] ?? '') === '2');
$c = pp_conv('landing', ['presentado_ts' => time(), 'postprecio_modelo' => '1']);
pp_api(pp_decision(['modelo', 'que_necesitan'], ['modelo' => '2']));
$r = turno('Si así es. Te paso los números de contacto y mail?', $c, $cfg);
caso('confirmación no permite cambiar el modelo sin una elección explícita', pp_silencio($c, $r) && ($c['postprecio_modelo'] ?? '') === '1');
foreach (['unico' => 'anual', 'propia' => 'pago único'] as $interno => $comercial) {
    $c = pp_conv('ecommerce', ['presentado_ts' => time(), 'modalidad_elegida' => $interno]);
    pp_api(pp_decision(['pago_link']));
    turno('Me pasás el enlace?', $c, $cfg);
    $contenido = $GLOBALS['PP_PEDIDOS'][0]['input'][0]['content'] ?? '';
    caso("Sol recibe la modalidad comercial $comercial y no su nombre interno", str_contains(json_encode($contenido, JSON_UNESCAPED_UNICODE), '\"modalidad\":\"' . $comercial . '\"'));
}
/* Dos webs (1-oct, Gustavo y Sergio en la batería en vivo): "ok" y "si, armalo"
 * derivaban en silencio por "cotización especial" antes de mirar el sí, y el que
 * aceptó la muestra nunca recibía el formulario. */
foreach (['si, armalo', 'Sí dale', 'si', 'Dale', 'mandame el formulario'] as $si) {
    $c = pp_conv('landing', ['dos_webs' => ['landing', 'ecommerce']]); pp_api(pp_decision(['precio']));
    $r = turno($si, $c, $cfg);
    caso("dos webs: \"$si\" a la oferta manda el formulario", tiene_form($r) && !empty($c['link_form_enviado']) && empty($c['control_manual']) && $GLOBALS['PP_PEDIDOS'] === []);
}
$c = pp_conv('landing', ['dos_webs' => ['landing', 'ecommerce']]); pp_api(pp_decision(['precio']));
$r = turno('gracias', $c, $cfg);
caso('dos webs: un acuse es silencio sin apagar el bot', $r === [] && empty($c['control_manual']) && empty($c['bot_off']) && $GLOBALS['PP_PEDIDOS'] === []);
$r = turno('como se paga?', $c, $cfg);
caso('dos webs: una pregunta sigue yendo a Pablo sin consultar al modelo (las reglas cotizan un solo tipo)', pp_silencio($c, $r) && $GLOBALS['PP_PEDIDOS'] === []);
$c = pp_conv('landing'); $c['precio_modelo'] = 'doble'; pp_api(pp_decision(['precio']));
$r = turno('si', $c, $cfg);
caso('cotización vieja (modelo doble): el sí también manda el formulario', tiene_form($r) && empty($c['control_manual']));
$r = turno('y como se paga?', $c, $cfg);
caso('cotización vieja: lo demás sigue siendo para Pablo', pp_silencio($c, $r));
$c = pp_conv(); pp_api(pp_decision(['precio']));
$r = turno('si quiero', $c, $cfg);
caso('"si quiero" a la oferta es un sí sin pasar por el modelo', tiene_form($r) && $GLOBALS['PP_PEDIDOS'] === []);
// El sí con palabras extra (21-sep, ~20 charlas sin link): arranca con sí, no pregunta, no posterga.
foreach (['Si te paso el logo', 'Sisi es sin compromiso si', 'Si si me interesa', 'Dale si me interesa un primer diseño para ver como seria', 'Sisi kiero que lo armen'] as $si) {
    $c = pp_conv(); pp_api(pp_decision(['precio']));
    $r = turno($si, $c, $cfg);
    caso("\"$si\" manda el formulario sin consultar al modelo", tiene_form($r) && !empty($c['link_form_enviado']) && $GLOBALS['PP_PEDIDOS'] === []);
}
// "Si si me interesa y puedo pagar por mes" salió de esta lista el 2-oct: en las charlas es un sí (test-aceptacion-demo.php).
foreach (['si yo ya tengo pagina', 'si pero cuanto sale el dominio?', 'Si podrian por favor?', 'si, lo veo con mi socio y te aviso'] as $dudoso) {
    $c = pp_conv(); pp_api(pp_decision(['postergar']));
    $r = turno($dudoso, $c, $cfg);
    caso("\"$dudoso\" no es un sí automático: lo decide el modelo", empty($c['link_form_enviado']) && $GLOBALS['PP_PEDIDOS'] !== []);
}
$c = pp_conv(); pp_api(pp_decision(['postergar']));
$r = turno('si, pero me gustaría hablar con una persona', $c, $cfg);
caso('"si, pero quiero hablar con una persona" no manda el formulario: va a Pablo', empty($c['link_form_enviado']) && pp_silencio($c, $r));
$c = pp_conv(); pp_api(['accion' => 'esperar', 'reglas' => [], 'consultas' => [], 'cobertura_completa' => true, 'no_cubierto' => [], 'modelo' => 'ninguno', 'motivo' => 'Acuse']);
$r = turno('bueno te paso el logo después', $c, $cfg);
caso('esperar con la oferta abierta y sin formulario queda pendiente para Pablo', $r === [] && !empty($c['handoff_pendiente']) && empty($c['control_manual']));
$c = pp_conv('ecommerce', ['link_form_enviado' => true, 'oferta_diseno_ts' => 0]); pp_api(['accion' => 'esperar', 'reglas' => [], 'consultas' => [], 'cobertura_completa' => true, 'no_cubierto' => [], 'modelo' => 'ninguno', 'motivo' => 'Acuse']);
$r = turno('bueno después lo completo', $c, $cfg);
caso('esperar con el formulario ya mandado no marca nada', $r === [] && empty($c['handoff_pendiente']));

$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'shadow';
$c = pp_conv(); pp_api(pp_decision(['demo_aceptar']));
$r = turno('Dale', $c, $cfg);
caso('modo sombra no envía formulario ni crea prospecto con un sí', $r === [] && empty($c['link_form_enviado']) && empty($c['esProspecto']));
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$c = pp_conv(); $GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';
$r = turno('Me explicás las alternativas?', $c, $cfg);
caso('sin credencial no improvisa una respuesta posterior al precio', pp_silencio($c, $r));
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-real';

$rr = wabot_respuestas_rapidas_precios_1oct([['titulo' => 'Pago', 'items' => [
    'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($25.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual25',
    'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($29.900 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual29900',
    'Mi respuesta personalizada con $25.000']]]);
caso('respuestas rápidas migran el enlace estándar y conservan texto personalizado', str_contains($rr[0]['items'][0], 'mensual22000') && str_contains($rr[0]['items'][0], '$22.000')
    && $rr[0]['items'][2] === 'Mi respuesta personalizada con $25.000');
caso('respuestas rápidas guardadas con $29.900 pasan a $32.000 y a pago/mensual32000 (3-oct)', str_contains($rr[0]['items'][1], '($32.000 por mes)') && str_ends_with($rr[0]['items'][1], 'pago/mensual32000'));
caso('curso de marketing no se confunde con contratar publicidad', !in_array('publicidad', wabot_ficha_fuera_de('Vendo cursos de marketing digital online'), true));
caso('pedido real de publicidad se sigue reconociendo', in_array('publicidad', wabot_ficha_fuera_de('Quiero que hagan publicidad y manejen mis redes'), true));

foreach (['uso', 'sombra'] as $dir) {
    foreach (glob($tmp . '/' . $dir . '/*') ?: [] as $f) if (is_file($f)) @unlink($f);
    @rmdir($tmp . '/' . $dir);
}
@rmdir($tmp);
todo_ok();
