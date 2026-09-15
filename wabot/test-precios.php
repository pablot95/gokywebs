<?php
/**
 * wabot/test-precios.php — el modelo comercial de las dos formas (solo CLI).
 *
 * Cada web se contrata de dos formas: pago único con seña y saldo al
 * entregar, o servicio mensual sin pago inicial (Pablo, 15-sep). Esta suite
 * fija lo que eso tiene que garantizar:
 *  1. La lista de precios de los cuatro tipos.
 *  2. El turno del precio: dos mensajes, el segundo son los tres pasos sin link.
 *  3. El link del formulario sale recién con el sí del cliente.
 *  4. El precio se congela en la charla y no cambia si cambia la lista.
 *  5. Las respuestas fijas de pago (seña, saldo, cuál conviene, devolución…).
 *  6. Ningún texto sale con {precio} o {mensualidad} crudos.
 *  7. El que no quiere pagar por mes, o quiere pagar una sola vez.
 *  8. Tienda + cursos se cotiza, no se deriva.
 *  9. El precio de otro tipo y la alternativa cotizada (upgrade).
 * 10. Los textos de venta en el formato de Pablo.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['form_activo'] = true;
$TIPOS = ['landing', 'ecommerce', 'elearning', 'inmobiliaria'];

/** Charla ya cotizada, esperando el sí a la demo. */
function conv_cotizada($tipo, $cfg, $clave = '5491177770000TEST') {
    $c = conv_nueva($clave);
    $c['tipo'] = $tipo; $c['fase'] = 'prediseno';
    $c['precio_dado'] = true; $c['cta_muestra'] = true;
    wabot_precio_congelar($c, $tipo, $cfg);
    return $c;
}

echo "— 1. La lista de precios —\n";

foreach (['landing' => ['$180.000', '$40.000', '$20.000'], 'ecommerce' => ['$290.000', '$60.000', '$30.000'],
          'elearning' => ['$290.000', '$60.000', '$30.000'], 'inmobiliaria' => ['$240.000', '$60.000', '$30.000']] as $t => $par) {
    caso("$t: pago único {$par[0]}, seña {$par[1]} y servicio mensual {$par[2]}",
        ($cfg['tipos'][$t]['precio'] ?? '') === $par[0] && ($cfg['tipos'][$t]['sena'] ?? '') === $par[1]
        && ($cfg['tipos'][$t]['mensualidad'] ?? '') === $par[2]);
    caso("$t: sin montos de cuota guardados", empty($cfg['tipos'][$t]['cuotas']) && empty($cfg['tipos'][$t]['pagos3']));
}
caso('los tipos son exactamente esos cuatro', array_keys($cfg['tipos']) === $TIPOS);
caso('la config es los textos del código más los ajustes de bot-config.json',
    $cfg['menu'] === wabot_textos_default()['menu'] && isset($cfg['activo']));
$v = wabot_precio_vigente(null, $cfg, 'ecommerce');
caso('el precio vigente sin charla es el de lista, modelo doble, con el saldo calculado',
    $v['modelo'] === 'doble' && $v['precio'] === '$290.000' && $v['sena'] === '$60.000' && $v['saldo'] === '$230.000' && $v['mensualidad'] === '$30.000');
caso('la tabla de precios agrupa por par', strpos(wabot_tabla_precios_texto($cfg), 'Sitio profesional: $180.000 en un pago único o $20.000 por mes.') === 0);

echo "— 2. El turno del precio: dos mensajes, los tres pasos sin link —\n";

$c = conv_nueva('5491177770001TEST');
$r = wabot_pitch('landing', $c, $cfg);
caso('son dos mensajes: la oferta y, aparte, los tres pasos (14-sep)', count($r) === 2);
caso('arranca con la oferta y abajo lo que incluye y las dos formas, sin link (15-sep)',
    preg_match('/^Para \{rubro\} podemos hacer .+\.\n\nIncluye:\n•/u', $r[0]) === 1 && strpos($r[0], '1. Pago único de $180.000: la web queda paga y listo.') !== false
    && strpos($r[0], '2. Servicio mensual de $20.000, sin pago inicial') !== false && strpos($r[0], 'presupuestos/') === false, $r[0]);
caso('y el mensual con soporte y mantenimiento técnico', mb_stripos($r[0], 'soporte y mantenimiento técnico') !== false);
caso('el segundo mensaje son los tres pasos con la pregunta de la demo, sin montos (14-sep)',
    ($r[1] ?? '') === wabot_tres_pasos_texto($c, $cfg) && preg_match('/^El primer paso es gratis: te armamos una demo de tu web para que veas cómo quedaría\./u', $r[1]) === 1
    && strpos($r[1], '$') === false && preg_match('/\nQuerés que preparemos la demo para tu negocio\?$/u', $r[1]) === 1, $r[1] ?? '');
caso('con el plazo de la demo que pidió Pablo', mb_stripos($r[1] ?? '', 'menos de 24 horas') !== false);
caso('y sin el link del formulario', strpos(implode("\n", $r), 'gokywebs.com/form/') === false);
caso('el precio queda congelado en la charla: pago único, seña y mensual, modelo doble',
    ($c['precio_cotizado'] ?? '') === '$180.000' && ($c['sena_cotizada'] ?? '') === '$40.000' && ($c['mensualidad_cotizada'] ?? '') === '$20.000'
    && ($c['precio_modelo'] ?? '') === 'doble');
caso('el link todavía no se marcó como enviado', empty($c['link_form_enviado']));
caso('la demo queda ofrecida en el mismo turno', $c['fase'] === 'prediseno' && !empty($c['cta_muestra']));
caso('el bot reconoce ese mensaje como demo ya ofrecida',
    wabot_cta_muestra_ya_ofrecida(['session_started_ts' => time() - 100, 'transcript' => [['q' => 'bot', 't' => $r[1], 'ts' => time()]]]) === true);
caso('el segundo mensaje sale 2 segundos después del precio (Pablo, 14-sep)',
    wabot_demora_tipeo($r[1], $cfg) === 2.0 && wabot_demora_tipeo($r[1], array_merge($cfg, ['demora_entre_mensajes' => 3])) === 2.0);
caso('pasa entero por el punto único de salida: el servicio y, aparte, la demo',
    (function () use ($cfg, $r, $c) { $out = wabot_salida_preparar($r, $c, $cfg);
        return count($out) === 2 && stripos($out[0], 'servicio mensual') !== false && stripos($out[1], 'demo') !== false; })());
caso('y en ninguno de los dos aparece la línea vieja de "si te cierra"',
    preg_match('/si te cierra|si va por ah|si te sirve|si te gusta la idea/iu', implode(' ', $r)) === 0);

foreach (['ecommerce' => 'una web para vender online', 'inmobiliaria' => 'una web para publicar tus propiedades',
          'elearning' => 'una plataforma para vender tus cursos'] as $tipo => $arranque) {
    $c = conv_nueva('5491177770003TEST');
    $r = wabot_pitch($tipo, $c, $cfg);
    $t = wabot_personalizar(implode("\n\n", $r), $c);
    caso("$tipo: la frase fija de su tipo y las dos formas",
        strpos($t, 'Podemos hacer ' . $arranque) === 0 && strpos($t, '2. Servicio mensual de $30.000, sin pago inicial') !== false, $t);
}
$c = conv_nueva('5491177770002TEST');
$c['rubro_pitch'] = 'tu centro de estética';
$c['pitch_para_que'] = 'muestres los tratamientos y tus clientas reserven turno online';
$c['pitch_para_que_tipo'] = 'landing';
$r = wabot_pitch('landing', $c, $cfg);
caso('con rubro y para_que sale la oración que dictó Pablo (14-sep)',
    strpos(wabot_personalizar($r[0], $c), "Para tu centro de estética podemos hacer una web donde muestres los tratamientos y tus clientas reserven turno online.\n\nIncluye:") === 0,
    wabot_personalizar($r[0], $c));
caso('"pago inicial", nunca "primer pago" (14-sep)', mb_stripos(implode(' ', $r), 'primer pago') === false);

$c = conv_nueva('5491177770004TEST');
$c['pidio_precio'] = true;
$c['rubro_pitch'] = 'tu pastelería';
$r = wabot_precio('ecommerce', $c, $cfg);
caso('el que pidió el precio de entrada recibe el mismo formato',
    strpos(wabot_personalizar($r[0], $c), 'Para tu pastelería podemos hacer una web para vender online') === 0
    && mb_stripos($r[0], 'para lo tuyo va') === false, $r[0]);
caso('con los tres pasos en su propio mensaje, detrás del precio', count($r) === 2 && mb_stripos($r[1], 'El primer paso es gratis') !== false);

$c = conv_nueva('5491177770005TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('quien la pidió al entrar recibe los tres pasos SIN la pregunta y el formulario atrás',
    count($r) === 3 && mb_stripos($r[1], 'El primer paso es gratis') !== false && strpos($r[1], 'Querés que preparemos') === false && tiene_form([$r[2] ?? '']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

/* Rubro y precio en un solo turno (15-sep): el que dice a qué se dedica y
 * pregunta cuánto sale recibe el precio, sin repregunta. */
foreach (['Soy electricista, cuánto sale la web?' => ['rubro_landing', 'landing'],
          'Tengo una inmobiliaria, qué precio tiene?' => ['rubro_inmobiliaria', 'inmobiliaria'],
          'Vendo ropa para bebés, cuánto sale una tienda con carrito?' => ['rubro_ecommerce', 'ecommerce']] as $m => $par) {
    $c = conv_nueva('QATESTREGLOGICA15'); wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica([$par[0]]);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    $v = wabot_precio_vigente($c, $cfg, $par[1]);
    caso('rubro y precio en un turno: ' . $par[1], $c['tipo'] === $par[1] && !empty($c['precio_dado']), $txt);
    caso('dos alternativas completas: ' . $par[1], strpos($txt, $v['precio']) !== false && strpos($txt, $v['mensualidad']) !== false && strpos($txt, 'sin pago inicial') !== false, $txt);
    caso('sin repregunta ni marcadores: ' . $par[1], !preg_match('/a qu[eé] te dedic|\{\w+\}/iu', $txt), $txt);
}
foreach (['Cuánto sale una web?', 'Cuánto sale una web para mostrar mis servicios y cuánto una tienda online?'] as $m) {
    $c = conv_nueva('QATESTREGLOGICA15'); wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['pregunta_info'], ['info_keys' => ['precio_sin_rubro']]);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    caso('sin actividad no inventa precio: ' . $m, empty($c['precio_dado']) && strpos($txt, '$') === false && strpos($txt, 'primero contame') !== false, $txt);
}

echo "— 3. El link del formulario sale con el sí —\n";

foreach (['dale', 'si, quiero la demo', 'ok', 'me interesa'] as $i => $si) {
    $c = conv_nueva('549117777002' . $i . 'TEST');
    clasifica(['rubro_landing']);
    wabot_engine('soy abogado', $c, $cfg);
    clasifica(['otro']);
    $r = wabot_engine($si, $c, $cfg);
    caso("\"$si\" después de los tres pasos recibe el formulario", tiene_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
}
$c = conv_nueva('5491177770030TEST');
clasifica(['rubro_landing']); wabot_engine('soy abogado', $c, $cfg);
clasifica(['otro']);          wabot_engine('dale', $c, $cfg);
clasifica(['otro']);          $r = wabot_engine('gracias', $c, $cfg);
caso('una vez mandado, el acuse siguiente no lo repite', !tiene_form($r));
$c = conv_nueva('5491177770034TEST');
wabot_pitch('landing', $c, $cfg);
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('dale, cuánto tarda la demo?', $c, $cfg);
caso('pero una pregunta no cuenta como sí: se le contesta en lugar de mandarle el formulario',
    !tiene_form($r) && stripos(implode(' ', $r), 'demo') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 4. El precio congelado no cambia si cambia la lista —\n";

$c = conv_nueva('5491177770040TEST');
wabot_pitch('ecommerce', $c, $cfg);
$cfgSube = $cfg;
$cfgSube['tipos']['ecommerce']['precio'] = '$395.000';
$cfgSube['tipos']['ecommerce']['mensualidad'] = '$33.000';
$res = wabot_precio_resumen($c, $cfgSube);
caso('el resumen repite el precio que se le dio, no el de la lista nueva',
    strpos($res, '$290.000') !== false && strpos($res, '$30.000') !== false && strpos($res, '$395.000') === false, $res);
caso('lo mismo la respuesta de pago',
    strpos(wabot_texto_pago($c, $cfgSube), '$30.000') !== false && strpos(wabot_texto_pago($c, $cfgSube), '$33.000') === false);
caso('y la del plan mensual', strpos(wabot_texto_mantenimiento($c, $cfgSube), '$30.000') !== false);
caso('un cliente nuevo sí recibe la lista nueva',
    strpos(wabot_msg_precio_texto('ecommerce', $cfgSube, conv_nueva('5491177770041TEST')), '$33.000') !== false);
caso('wabot_precio_vigente devuelve lo congelado aunque la lista cambie',
    wabot_precio_vigente($c, $cfgSube) === wabot_precio_vigente($c, $cfg));
$cR = $c; $cR['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('el reset de sesión libera el precio congelado', empty($cR['precio_cotizado']) && empty($cR['mensualidad_cotizada']));

/* Cotizada del 10 al 14-sep, con la mensualidad sola (snapshot 'mensual'):
 * conserva SU mensualidad y se le ofrece también el pago único de lista. */
$cM = array_merge(conv_nueva('5491177770050TEST'), ['tipo' => 'landing', 'precio_dado' => true, 'fase' => 'prediseno',
    'cta_muestra' => true, 'precio_cotizado' => '$40.000', 'mensualidad_cotizada' => '$15.000', 'precio_modelo' => 'mensual']);
$vM = wabot_precio_vigente($cM, $cfg);
caso('el snapshot mensual conserva su mensualidad y toma el pago único de lista',
    $vM['modelo'] === 'doble' && $vM['mensualidad'] === '$15.000' && $vM['precio'] === '$180.000' && $vM['sena'] === '$40.000');
caso('y la respuesta de pago dice las dos con esos montos',
    strpos(wabot_texto_pago($cM, $cfg), 'Servicio mensual de $15.000') !== false && strpos(wabot_texto_pago($cM, $cfg), 'Pago único de $180.000') !== false, wabot_texto_pago($cM, $cfg));
$cV = array_merge(conv_nueva('5491177770051TEST'), ['tipo' => 'landing', 'precio_dado' => true]);
caso('sin snapshot (charla anterior al 10-sep) vale la lista de hoy, modelo doble',
    wabot_precio_vigente($cV, $cfg)['precio'] === '$180.000' && wabot_precio_vigente($cV, $cfg)['modelo'] === 'doble');

echo "— 5. Las respuestas fijas de pago (batería del 15-sep) —\n";

$c21 = conv_cotizada('landing', $cfg, '997FPTEST');
$v21 = wabot_precio_vigente($c21, $cfg);
$sena21 = $v21['sena']; $mens21 = $v21['mensualidad'];
$senaMil = (int)(wabot_monto_a_numero($sena21) / 1000);
$mensMil = (int)(wabot_monto_a_numero($mens21) / 1000);

$rCostos = wabot_respuesta_pago_fija('Con el pago unico despues tengo que pagar algo mas?', $c21, $cfg);
caso('lo que queda para después con el pago único: la renovación, sin la demo',
    is_array($rCostos) && mb_stripos($rCostos[0], 'renovar el hosting') !== false && mb_stripos($rCostos[0], 'demo') === false,
    json_encode($rCostos, JSON_UNESCAPED_UNICODE));
$c21b = $c21;
$rDev = wabot_respuesta_pago_fija('Si pago la seña y despues no me gusta, me la devuelven?', $c21b, $cfg);
caso('la devolución no se inventa y queda para el desarrollador',
    is_array($rDev) && mb_stripos($rDev[0], 'te lo confirma el desarrollador') !== false && !empty($c21b['handoff_pendiente']));
$fCambio = 'Si arranco con el mensual y despues me quiero pasar al pago unico se puede?';
$rCambio = wabot_respuesta_pago_fija($fCambio, $c21, $cfg);
caso('pasarse de forma: sin prometer que se puede',
    is_array($rCambio) && mb_stripos($rCambio[0], 'se puede') === false && mb_stripos($rCambio[0], 'desarrollador') !== false,
    json_encode($rCambio, JSON_UNESCAPED_UNICODE));
$rCual = wabot_respuesta_pago_fija('Cual me conviene mas, pagar una vez o por mes?', $c21, $cfg);
caso('"cuál conviene": las dos formas con los montos de la charla, sin elegir por él',
    is_array($rCual) && mb_strpos($rCual[0], $v21['precio']) !== false && mb_strpos($rCual[0], $v21['mensualidad']) !== false
    && mb_stripos($rCual[0], 'entonces te conviene') === false, json_encode($rCual, JSON_UNESCAPED_UNICODE));
$cSin = conv_nueva('996FPTEST');
wabot_conv_transcript($cSin, 'cliente', 'Doy clases de yoga y quiero vender mis cursos grabados');
$rCualSin = wabot_respuesta_pago_fija('Cual me conviene mas, pagar una vez o por mes?', $cSin, $cfg);
caso('"cuál conviene" sin tipo: sin montos y sin volver a pedir el rubro ya dicho',
    is_array($rCualSin) && mb_strpos($rCualSin[0], '$') === false && mb_stripos($rCualSin[0], 'a qué te dedicás') === false,
    json_encode($rCualSin, JSON_UNESCAPED_UNICODE));

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
$rSaldo = wabot_respuesta_pago_fija('el saldo cuando se paga?', $c21, $cfg);
caso('"¿el saldo cuándo se paga?": al entregar, con el monto', is_array($rSaldo) && mb_strpos($rSaldo[0], $v21['saldo']) !== false,
    json_encode($rSaldo, JSON_UNESCAPED_UNICODE));
$rAntes = wabot_respuesta_pago_fija('Pasame el link de mercado pago para suscribirme al mensual', $c21, $cfg);
caso('pedir el link de pago antes de la demo: primero va la demo gratis', is_array($rAntes) && mb_strpos($rAntes[0], 'Primero va la demo') === 0,
    json_encode($rAntes, JSON_UNESCAPED_UNICODE));
$rRechMens = wabot_respuesta_pago_fija('No me interesa el mensual', $c21, $cfg);
caso('rechazar el mensual ofrece el pago único', is_array($rRechMens) && mb_stripos($rRechMens[0], 'pago único') !== false,
    json_encode($rRechMens, JSON_UNESCAPED_UNICODE));
$rRechUnico = wabot_respuesta_pago_fija('no me interesa el pago unico', $c21, $cfg);
caso('rechazar el pago único ofrece el mensual con su monto', is_array($rRechUnico) && mb_strpos($rRechUnico[0], $mens21) !== false,
    json_encode($rRechUnico, JSON_UNESCAPED_UNICODE));
caso('"seña no es mensualidad": la pregunta al revés se contesta con la mensualidad y la seña',
    (function () use ($c21, $cfg, $v21) { $txt = implode(' ', wabot_respuesta_pago_fija('La mensualidad es de ' . $v21['sena'] . '?', $c21, $cfg) ?? []);
        return strpos($txt, $v21['mensualidad']) !== false && strpos($txt, 'seña') !== false; })());

$c21d = $c21;
$rDesc = wabot_regateo_responder('Con transferencia hay descuento?', $c21d, $cfg);
caso('"¿hay descuento?" se contesta con el no y las dos formas, no con el texto de caro',
    is_array($rDesc) && mb_strpos($rDesc[0], 'No manejamos descuentos') === 0 && mb_strpos($rDesc[0], $v21['precio']) !== false
    && mb_strpos($rDesc[0], $mens21) !== false, json_encode($rDesc, JSON_UNESCAPED_UNICODE));
wabot_regateo_responder('Dejamelo en 150 mil y cerramos', $c21d, $cfg);
caso('y si después regatea con un número, lo toma el desarrollador', ($c21d['fase'] ?? '') === 'derivado');

/* Por el borde común, como llega en producción. */
foreach (['Con el pago unico despues tengo que pagar algo mas?' => 'renovar el hosting',
          'Cual es la diferencia entre las dos formas?' => $v21['precio'],
          'Y si elijo el mensual cuánto pago al principio?' => 'no hay pago inicial'] as $m => $frag) {
    $c = conv_cotizada('landing', $cfg); wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    caso('por wabot_responder: ' . $m, mb_stripos($txt, $frag) !== false, $txt);
}
$c = conv_cotizada('ecommerce', $cfg, '5491177770033TEST');
foreach (['Y con el pago único después qué tengo que seguir pagando?' => ['una vez al año', 'segundo año'],
          'Los 30 mil son la seña?' => ['No:', '$30.000', '$60.000'],
          'Si elijo el pago único, cuánto pongo para empezar y cuánto al entregar?' => ['$60.000', '$230.000', '$290.000']] as $m => $frags) {
    wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    wabot_conv_transcript($c, 'bot', $txt);
    $ok = true; foreach ($frags as $f) if (mb_strpos($txt, $f) === false) $ok = false;
    caso('tienda cotizada, por el borde: ' . $m, $ok && mb_stripos($txt, 'gokywebs.com/form') === false, $txt);
}

/* "¿Es obligatorio?" después del plan: no, es una de las dos formas. */
$cObl = ['transcript' => [['q' => 'bot', 't' => wabot_texto_mantenimiento(['tipo' => 'landing'], $cfg), 'ts' => time()]]];
caso('"es obligatorio?" después del plan: no, es una de las dos formas (15-sep)',
    ($ro = wabot_respuesta_obligatorio($cObl, $cfg, 'es obligatorio?')) !== null
    && mb_strpos($ro, 'No: el servicio mensual es una de las dos formas') === 0 && mb_stripos($ro, 'una sola vez') !== false);
$cP = conv_nueva('5491177770060TEST');
$rPitch = wabot_pitch('landing', $cP, $cfg);
$cOblig = ['tipo' => 'landing', 'precio_dado' => true, 'precio_cotizado' => '$180.000', 'mensualidad_cotizada' => '$20.000',
    'precio_modelo' => 'doble', 'transcript' => [
        ['q' => 'cliente', 't' => 'Soy psicóloga y quiero una web'],
        ['q' => 'bot', 't' => $rPitch[0]], ['q' => 'bot', 't' => $rPitch[1]],
        ['q' => 'cliente', 't' => 'Es obligatorio pagar todos los meses?']]];
caso('"¿es obligatorio pagar todos los meses?" con el precio en dos mensajes: contesta el texto del servicio',
    wabot_texto_pregunta_si_es_obligatorio('Es obligatorio pagar todos los meses?')
    && ($rOblig = wabot_respuesta_obligatorio($cOblig, $cfg, 'Es obligatorio pagar todos los meses?')) !== null
    && mb_strpos($rOblig, 'No: el servicio mensual es una de las dos formas') === 0);
$cObl2 = $c21;
$cObl2['transcript'] = [['q' => 'cliente', 't' => 'Es obligatorio pagar todos los meses?'],
    ['q' => 'bot', 't' => (string)$cfg['respuesta_plan_obligatorio']], ['q' => 'cliente', 't' => 'O sea que no es obligatorio?']];
caso('"¿o sea que no es obligatorio?" después de la respuesta también se contesta fijo',
    wabot_respuesta_obligatorio($cObl2, $cfg, 'O sea que no es obligatorio?') !== null);
$cOblM = conv_cotizada('landing', $cfg);
wabot_conv_transcript($cOblM, 'bot', wabot_texto_mantenimiento($cOblM, $cfg));
wabot_conv_transcript($cOblM, 'cliente', 'es obligatorio?'); $cOblM['ultimo_cliente_ts'] = time();
clasifica(['otro']);
caso('y por el motor entero sale la respuesta corta',
    wabot_engine('es obligatorio?', $cOblM, $cfg) === [trim((string)$cfg['respuesta_plan_obligatorio'])]);

echo "— 6. Ningún texto sale con un marcador crudo ni con el modelo viejo —\n";

$cLanding = conv_nueva('5491177770061TEST');
wabot_pitch('landing', $cLanding, $cfg);
$cCopia = $cLanding;
$sinTipo = conv_nueva('5491177770062TEST');
foreach ([
    'caro (con tipo)'        => wabot_texto_caro($cLanding, $cfg),
    'caro (sin tipo)'        => wabot_texto_caro($sinTipo, $cfg),
    'objeción caro'          => wabot_objecion_texto('caro', $cfg['caro'], $cCopia, $cfg),
    'pago'                   => wabot_texto_pago($cLanding, $cfg),
    'pago sin tipo'          => wabot_texto_pago($sinTipo, $cfg),
    'mantenimiento'          => wabot_texto_mantenimiento($cLanding, $cfg),
    'mantenimiento sin tipo' => wabot_texto_mantenimiento($sinTipo, $cfg),
    'resumen'                => wabot_precio_resumen($cLanding, $cfg),
    'rangos'                 => wabot_texto_rangos($cfg),
    'precio_sin_rubro'       => wabot_texto_info('precio_sin_rubro', $cfg),
    'hosting'                => wabot_texto_hosting($cLanding, $cfg),
    'baja_del_plan'          => wabot_texto_info('baja_del_plan', $cfg),
    'que_incluye'            => wabot_texto_info('que_incluye', $cfg),
    'desempate de cursos'    => (string)wabot_desempate_precios_texto('desempate_cursos', $cfg),
    'upgrade a tienda'       => (string)wabot_upgrade_texto('ecommerce', $cLanding, $cfg),
    'precio de otro tipo'    => (string)wabot_precio_de_tipo_texto('ecommerce', $cLanding, $cfg),
    'pago genérico'          => wabot_texto_pago_generico($cfg),
    'proceso'                => wabot_texto_info('proceso', $cfg),
    'plan_es_servicio'       => wabot_texto_info('plan_es_servicio', $cfg),
    'un_solo_pago'           => wabot_texto_info('un_solo_pago', $cfg, $cLanding),
] as $nombre => $texto) {
    caso("$nombre: sin marcadores crudos ni modelo viejo",
        trim($texto) !== '' && strpos($texto, '{') === false && !preg_match('/primer pago|No es un mantenimiento aparte|No hay un pago inicial aparte|12 cuotas/iu', $texto),
        $texto);
}
caso('el pago genérico explica las dos formas sin montos antes de saber el rubro (15-sep)',
    stripos(wabot_texto_pago_generico($cfg), 'dos formas de pagarla') !== false && strpos(wabot_texto_pago_generico($cfg), '$') === false
    && stripos(wabot_texto_pago_generico($cfg), 'seña para arrancar') !== false && stripos(wabot_texto_pago_generico($cfg), 'sin pago inicial') !== false);
caso('el resumen del precio dice las dos formas, con la seña (15-sep)',
    strpos((string)$cfg['precio_resumen'], 'seña de {sena}') !== false && strpos(wabot_precio_resumen($cLanding, $cfg), 'seña de $40.000') !== false);
caso('el resumen conserva el portfolio filtrado',
    strpos(wabot_precio_resumen(['tipo' => 'ecommerce', 'precio_dado' => true], $cfg), 'gokywebs.com/portfolio/?tipo=ecommerce') !== false);
caso('info.pago explica las dos formas: pago único con seña y mensual sin pago inicial (15-sep)',
    strpos($cfg['info']['pago'], 'Pago único de {precio}') !== false && strpos($cfg['info']['pago'], 'seña de {sena}') !== false && strpos($cfg['info']['pago'], 'No hay pago inicial') !== false);
caso('el proceso explica las dos formas de contratarla, con la demo gratis primero',
    stripos($cfg['info']['proceso'], 'elegís cómo contratarla') !== false && stripos($cfg['info']['proceso'], 'demo gratis') !== false && strpos(wabot_texto_info('proceso', $cfg), '$') === false);
caso('la renovación del hosting habla del pago único', mb_stripos((string)$cfg['hosting_renovacion'], 'Con el pago único') === 0);
caso('"es caro" no menciona cuotas sin interés', stripos($cfg['caro'], 'sin interés') === false && stripos($cfg['caro'], 'cuotas') === false);

echo "— 7. Los 12 meses se dicen solo si preguntan —\n";

$salenSolos = [$cfg['tipos']['landing']['precio_ideal'], $cfg['msg_precio'], $cfg['caro'], $cfg['plataformas'],
    $cfg['info']['que_incluye'], $cfg['info']['mantenimiento'], $cfg['info']['pago'], $cfg['info']['baja_del_plan'],
    $cfg['msg_tres_pasos'], $cfg['prediseno_link']];
caso('ningún texto que sale solo nombra los 12 meses',
    count(array_filter($salenSolos, function ($t) { return mb_stripos((string)$t, '12 meses') !== false; })) === 0);
caso('solo las respuestas de titularidad y del código, que salen si preguntan',
    mb_stripos($cfg['info']['titularidad'], '12 meses') !== false && mb_stripos($cfg['info']['entrega_codigo'], '12 meses') !== false);
caso('y los 18 meses ya no aparecen en ningún texto', mb_stripos(json_encode($cfg, JSON_UNESCAPED_UNICODE), '18 meses') === false);
caso('"y si dejo de pagar?" dice que no hay permanencia y que la web se desactiva',
    mb_stripos($cfg['info']['baja_del_plan'], 'permanencia') !== false && mb_stripos($cfg['info']['baja_del_plan'], 'desactiva') !== false);
$baja = wabot_texto_info('baja_del_plan', $cfg);
caso('la baja se hace desde Mercado Pago, o llamando al banco si se suscribió sin cuenta',
    mb_stripos($baja, 'desde Mercado Pago') !== false && mb_stripos($baja, 'banco') !== false && mb_stripos($baja, 'sin cuenta') !== false, $baja);
caso('cómo se paga aclara que no hace falta cuenta de Mercado Pago', mb_stripos(wabot_texto_pago(conv_cotizada('landing', $cfg), $cfg), 'cualquier tarjeta') !== false);
foreach (['como doy de baja el plan?', 'se puede cancelar la suscripcion?', 'necesito cuenta de mercado pago?',
          'no tengo mercado pago, puedo pagar igual?', 'hay permanencia?', 'que pasa si dejo de pagar?'] as $p) {
    caso("\"$p\" → baja_del_plan", wabot_info_por_palabras($p, 'prediseno') === 'baja_del_plan', (string)wabot_info_por_palabras($p, 'prediseno'));
}
caso('"con el mensual a los cuántos meses la web es mía?" va a titularidad',
    wabot_info_por_palabras('con el mensual a los cuantos meses la web es mia?', 'prediseno') === 'titularidad');
caso('"¿tienen factura?" va a facturación', wabot_info_por_palabras('tienen factura?', 'prediseno') === 'facturacion');

echo "— 8. El que no quiere el plan todos los meses, o quiere pagar una sola vez (Pablo, 14-sep) —\n";

$realRechazo = 'Déjame que consulte... No me interesa el mantenimiento. Si poder hacerlo de vez en cuando si es necesario pero no creo que sea necesario mensualmente. Son 4 productos solamente';
$realUnaVez  = 'Y si quisiera hacerlo en un solo pago para ls creación y encargarme yo de mantenerla?';
foreach ([$realRechazo, 'no creo que sea necesario pagar todos los meses', 'el mantenimiento lo quiero solo cuando lo necesite',
          'no necesito un plan mensual', 'no me hace falta todos los meses'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso('"' . mb_substr($p, 0, 48) . '" → plan_es_servicio', $k === 'plan_es_servicio', (string)$k);
}
foreach ([$realUnaVez, 'puedo pagar la web de una sola vez sin el plan mensual?',
          'se puede hacer en un solo pago y yo me encargo del hosting?'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso('"' . mb_substr($p, 0, 48) . '" → un_solo_pago', $k === 'un_solo_pago', (string)$k);
}
foreach (['el mantenimiento es obligatorio?', 'hay algo mensual?', 'cuanto es por mes?'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso("\"$p\" sigue siendo mantenimiento", $k === 'mantenimiento', (string)$k);
}
foreach (['no puedo pagar todo junto, se puede en cuotas?', 'como doy de baja el plan?', 'hay permanencia?'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso("\"$p\" no es ninguna de las dos", !in_array($k, ['plan_es_servicio', 'un_solo_pago'], true), (string)$k);
}
$serv = wabot_texto_info('plan_es_servicio', $cfg);
caso('al que no quiere pagar por mes le ofrece el pago único (15-sep)',
    mb_stripos($serv, 'te conviene el pago único') !== false && mb_stripos($serv, 'no tenés abono mensual') !== false, $serv);
caso('sin plataformas de streaming y sin el detalle de los cambios extra',
    mb_stripos($serv, 'netflix') === false && strpos($serv, '$10.000') === false);
caso('y aclara que el hosting y el dominio van el primer año', mb_stripos($serv, 'primer año') !== false);
$cU = conv_cotizada('ecommerce', $cfg, '5491177770090TEST');
$u = wabot_texto_info('un_solo_pago', $cfg, $cU);
caso('la tienda en un pago único sale $290.000, con su seña y hosting y dominio el primer año (15-sep)',
    strpos($u, '$290.000') !== false && strpos($u, 'seña de $60.000') !== false
    && mb_stripos($u, 'hosting y el dominio el primer año') !== false && mb_stripos($u, 'pago único') !== false, $u);
foreach (['landing' => '$180.000', 'inmobiliaria' => '$240.000', 'elearning' => '$290.000'] as $t => $p) {
    $cU = conv_cotizada($t, $cfg, '5491177770090TEST');
    caso("$t en un pago único sale $p", strpos(wabot_texto_info('un_solo_pago', $cfg, $cU), $p) !== false);
}
$uSin = wabot_texto_info('un_solo_pago', $cfg);
caso('sin tipo cotizado no da montos: pregunta a qué se dedica (15-sep)',
    strpos($uSin, '$') === false && mb_stripos($uSin, 'Contame a qué te dedicás') !== false, $uSin);
$cA = conv_cotizada('ecommerce', $cfg, '5491177770091TEST');
foreach ([$realUnaVez => ['$290.000', 'no es opcional'], $realRechazo => ['te conviene el pago único', '$10.000']] as $m => $par) {
    wabot_conv_transcript($cA, 'cliente', $m); $cA['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $sA = wabot_salida_preparar(wabot_responder($m, $cA, $cfg), $cA, $cfg);
    caso('el caso real por el motor: ' . mb_substr($m, 0, 40), count($sA) === 1 && mb_stripos($sA[0], $par[0]) !== false && mb_stripos($sA[0], $par[1]) === false,
        json_encode($sA, JSON_UNESCAPED_UNICODE));
}
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

echo "— 9. El paso 2 del formulario llega al brief del boceto —\n";

$cL = array_merge(conv_cotizada('landing', $cfg, '5491177770080TEST'), [
    'descripcion' => 'estudio contable', 'colores' => 'azul y blanco', 'nombre' => 'Ana',
    'estilo' => 'Minimalista', 'incluir' => 'mapa con la ubicación', 'referencia' => 'sparrow.com.ar']);
$campos = wabot_lead_campos($cL, $cfg, false);
$val = function ($k) use ($campos) { $v = $campos[$k] ?? null; return $v ? (string)reset($v) : null; };
caso('el estilo viaja en su campo', $val('estilo_pagina') === 'Minimalista');
caso('lo que quiere sí o sí también', $val('incluir_si_o_si') === 'mapa con la ubicación');
caso('y los dos van en el bloque que se lee al diseñar',
    mb_stripos((string)$val('objetivo_web'), 'Minimalista') !== false
    && mb_stripos((string)$val('objetivo_web'), 'mapa con la ubicación') !== false, (string)$val('objetivo_web'));
caso('el precio del boceto nombra las dos formas',
    (string)$val('presupuesto_cotizado') === 'Pago único $180.000 (seña $40.000) o $20.000 por mes', (string)$val('presupuesto_cotizado'));
$cL['estilo'] = 'No lo sé';
$campos2 = wabot_lead_campos($cL, $cfg, false);
$objetivo2 = (string)reset($campos2['objetivo_web']);
caso('"No lo sé" no ensucia el brief', mb_stripos($objetivo2, 'No lo sé') === false, $objetivo2);
$cR2 = array_merge($cL, ['ultimo_ts' => time() - 30 * 86400]);
wabot_conv_reset_si_vieja($cR2, $cfg, time());
caso('el reset de sesión limpia el estilo y lo que quería incluir', empty($cR2['estilo']) && empty($cR2['incluir']));

echo "— 10. Tienda + cursos se cotiza, no se deriva (Pablo, 14-sep) —\n";

$msgTaller = "Tengo un taller donde se dictan clases de artesanias\n.. velas\n. Yeso ceramico..m macrame... etc...\nEs para hacer una página online para ve der.insumos.. y mas adelante cargar cursos online tambien";
$cTM = conv_nueva('5491177770095TEST');
wabot_conv_transcript($cTM, 'cliente', $msgTaller);
clasifica(['productos_y_cursos']);
$rTM = wabot_engine($msgTaller, $cTM, $cfg);
caso('el motor cotiza tienda + cursos en vez de derivar',
    empty($cTM['handoff_pendiente']) && ($cTM['tipo'] ?? '') === 'ecommerce' && !empty($cTM['combo_cursos'])
    && strpos(implode("\n", (array)$rTM), 'Plataforma de cursos en módulos') !== false
    && strpos(implode("\n", (array)$rTM), '$30.000') !== false, json_encode($rTM, JSON_UNESCAPED_UNICODE));
caso('con la frase del combinado y sin el aviso de "el precio no sale de la lista"',
    mb_stripos(implode("\n", (array)$rTM), 'plataforma para tus cursos') !== false
    && mb_stripos(implode("\n", (array)$rTM), 'no sale de la lista') === false);
caso('el resumen del precio no manda link de presupuesto', strpos(wabot_precio_resumen($cTM, $cfg), 'presupuestos/') === false);
caso('y el boceto dice que es tienda + cursos',
    mb_stripos((string)reset(wabot_lead_campos($cTM, $cfg, false)['tipoDetectadoLabel']), 'cursos') !== false);
$cTS = conv_nueva('5491177770098TEST');
clasifica(['rubro_ecommerce']);
$rTS = wabot_engine('Tengo una tienda de ropa y quiero vender online', $cTS, $cfg);
caso('una tienda sin cursos se cotiza como tienda sola', empty($cTS['combo_cursos'])
    && strpos($rTS[0], 'Pago único de $290.000') !== false && strpos($rTS[0], 'Plataforma de cursos en módulos') === false);
$cCombo = conv_nueva('998FPTEST'); $cCombo['fase'] = 'nuevo';
$msjCombo = 'Buenas, tengo un taller de artesanias. Quiero vender insumos online y mas adelante subir cursos';
wabot_conv_transcript($cCombo, 'cliente', $msjCombo); $cCombo['ultimo_cliente_ts'] = time();
clasifica(['productos_y_cursos']);
$rCombo = wabot_salida_preparar(wabot_responder($msjCombo, $cCombo, $cfg), $cCombo, $cfg);
caso('por el borde común: el taller de artesanías recibe la cotización de tienda + cursos, no el texto de carga',
    strpos(implode("\n", $rCombo), 'Plataforma de cursos en módulos') !== false
    && strpos(implode("\n", $rCombo), (string)wabot_texto_info('carga', $cfg)) === false, json_encode($rCombo, JSON_UNESCAPED_UNICODE));
caso('combinar tienda y cursos conserva el alcance especial',
    wabot_texto_pregunta_upgrade('Quiero agregar una tienda y cursos grabados, cuánto sale todo junto?', 'landing') === null);
caso('"cuánto sale todo eso?" pregunta por el combinado, "cuánto sale?" no',
    wabot_texto_pregunta_precio_combinado('cuanto sale todo eso?') === true
    && wabot_texto_pregunta_precio_combinado('cuanto seria todo junto?') === true
    && wabot_texto_pregunta_precio_combinado('cuanto sale?') === false);

echo "— 11. El precio de otro tipo y la alternativa cotizada —\n";

$convVeg = conv_cotizada('ecommerce', $cfg);
caso('"y la página común que precio tiene?" pregunta por la landing',
    wabot_texto_pregunta_precio_de_tipo('Y la página común que precio tiene ?', $cfg, 'ecommerce') === 'landing');
$textoOtro = wabot_precio_de_tipo_texto('landing', $convVeg, $cfg);
caso('y la respuesta trae el precio de la landing y el ya cotizado',
    strpos($textoOtro, '$180.000') !== false && strpos($textoOtro, '$290.000') !== false, $textoOtro);
caso('preguntar por el tipo que YA tiene cotizado no dispara nada',
    wabot_texto_pregunta_precio_de_tipo('cuanto sale la tienda online?', $cfg, 'ecommerce') === null);
caso('y contar el rubro sin preguntar precio tampoco',
    wabot_texto_pregunta_precio_de_tipo('vendo ropa en una tienda del centro', $cfg, 'landing') === null);
caso('"Y una que sea solo landing?" con ecommerce cotizado pide el precio de la landing',
    wabot_texto_pregunta_precio_de_tipo('Y una que sea solo landing?', $cfg, 'ecommerce') === 'landing');
caso('un tipo que no existe no se cotiza',
    wabot_texto_pregunta_precio_de_tipo('cuanto sale una web institucional?', $cfg, 'landing') === null
    && wabot_precio_de_tipo_texto('turnos', conv_nueva(), $cfg) === null);
$cOtro = conv_cotizada('ecommerce', $cfg); wabot_conv_transcript($cOtro, 'cliente', 'Y la página común que precio tiene?');
clasifica(['otro']);
caso('por el motor entero contesta el precio del otro tipo',
    wabot_engine('Y la página común que precio tiene?', $cOtro, $cfg) === [$textoOtro]);

caso('"cuánto cuesta agregar venta y cobro online" con una landing cotizada → ecommerce',
    wabot_texto_pregunta_upgrade('Cuánto cuesta agregar venta y cobro online?', 'landing') === 'ecommerce');
caso('un "cuánto sale" pelado NO recotiza por su cuenta', wabot_texto_pregunta_upgrade('Cuánto sale?', 'landing') === null);
caso('con un ecommerce ya cotizado la pregunta no aplica', wabot_texto_pregunta_upgrade('Puedo agregar cobro online?', 'ecommerce') === null);
$cUp = conv_cotizada('landing', $cfg);
$up = wabot_upgrade_texto('ecommerce', $cUp, $cfg);
caso('la respuesta trae el precio del ecommerce y aclara que no es un adicional',
    is_string($up) && strpos($up, '$290.000') !== false && strpos($up, 'No es un adicional') !== false, (string)$up);

$c = conv_cotizada('landing', $cfg, 'QATESTREG11SEP');
$p = 'Y si además quiero vender productos de skincare y cobrarlos online, cuánto sale todo junto?';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
clasifica(['otro']);
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('cotiza la alternativa sin cambiar aún el tipo', $c['tipo'] === 'landing'
    && ($c['upgrade_pendiente']['tipo'] ?? '') === 'ecommerce' && strpos(implode(' ', $r ?? []), '$30.000') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', $m);
$p = 'Entonces serían 90 mil de primer pago y 30 mil por mes en total, no los dos planes juntos?';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('aclara el total sin sumar planes ni volver al anterior',
    strpos(implode(' ', $r ?? []), 'tienda online: $290.000 en un pago único o $30.000 por mes') !== false
    && strpos(implode(' ', $r ?? []), 'No es un adicional') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', $m);
$vUp = $c['upgrade_pendiente'];
$rUpSena = wabot_upgrade_pago_texto($vUp, $c, $cfg);
caso('la seña después del upgrade es la de la tienda, no la del sitio',
    mb_strpos($rUpSena, '$60.000') !== false && mb_strpos($rUpSena, '$40.000') === false, $rUpSena);
caso('la tienda consultada de nuevo se confirma corta, no con el mismo texto',
    wabot_upgrade_confirmacion_texto($vUp, $c, $cfg) !== wabot_upgrade_texto('ecommerce', $c, $cfg));
$p = 'Sí, quiero la demo con la tienda';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('acepta la tienda con cotización y formulario coherentes', $c['tipo'] === 'ecommerce'
    && $c['precio_cotizado'] === '$290.000' && $c['mensualidad_cotizada'] === '$30.000'
    && tiene_form($r) && empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
$cRes = conv_cotizada('landing', $cfg);
$cRes['upgrade_pendiente'] = wabot_precio_vigente(null, $cfg, 'ecommerce');
$cRes['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cRes, $cfg);
caso('el cambio de alcance pendiente no sobrevive una sesión vieja', empty($cRes['upgrade_pendiente']));

/* Cambio a cursos desde un sitio profesional cotizado (15-sep). */
$c = conv_cotizada('landing', $cfg, 'QATESTREGLOGICA15');
wabot_conv_transcript($c, 'cliente', 'Doy clases de yoga');
foreach (['Quiero vender cursos grabados y que los alumnos accedan con usuario desde la web.', 'Cuánto sale?'] as $m) {
    wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    wabot_conv_transcript($c, 'bot', $txt);
    caso('cambio a cursos conserva su alternativa y ambos precios: ' . mb_substr($m, 0, 24), ($c['upgrade_pendiente']['tipo'] ?? '') === 'elearning'
        && strpos($txt, '$290.000') !== false && strpos($txt, '$30.000') !== false && $c['tipo'] === 'landing', $txt);
}
$m = 'Sí, quiero la demo con los cursos'; wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
$txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
caso('acepta los cursos con la cotización correcta', $c['tipo'] === 'elearning'
    && $c['precio_cotizado'] === '$290.000' && $c['mensualidad_cotizada'] === '$30.000' && tiene_form([$txt]), $txt);
caso('la comparación "sin carrito" contesta que la tienda trae las dos formas',
    (string)wabot_comparacion_tipo_texto('ecommerce', conv_cotizada('ecommerce', $cfg), $cfg) === (string)$cfg['info']['las_dos_formas']);

echo "— 12. Lo incluido, solo si lo pregunta —\n";

foreach ([
    'se pueden sacar turnos online?' => 'turnos',
    'la web tiene reservas online?' => 'turnos',
    'los clientes se pueden registrar?' => 'usuarios',
    'tiene area de socios?' => 'usuarios',
    'se puede traducir la web al ingles?' => 'bilingue',
    'cuantos idiomas trae?' => 'bilingue',
    'puede ser .com?' => 'dominio_com',
    'y el dominio puede ser punto com?' => 'dominio_com',
    'tiene estadisticas?' => 'estadisticas',
    'puedo ver cuanta gente entra a la pagina?' => 'estadisticas',
    'el dominio es .com.ar?' => 'hosting',
    'me pasas el usuario y contraseña del hosting?' => 'accesos',
    'le pueden poner google analytics?' => 'pixel',
] as $pregunta => $clave) {
    $vista = wabot_info_por_palabras($pregunta, 'prediseno');
    caso("\"$pregunta\" → $clave", $vista === $clave, (string)$vista);
}
foreach (['doy clases de idiomas', 'mi web actual es www.tortasdemaru.com', 'tengo un consultorio y atiendo con turnos', 'hola, vendo ropa por instagram'] as $noPregunta) {
    $vista = wabot_info_por_palabras($noPregunta, 'prediseno');
    caso("\"$noPregunta\" no es ninguna de estas preguntas",
        !in_array($vista, ['turnos', 'usuarios', 'bilingue', 'dominio_com', 'estadisticas'], true), (string)$vista);
}
caso('turnos online y usuarios: incluidos y sin costo aparte',
    mb_stripos($cfg['info']['turnos'], 'No se paga aparte') !== false && mb_stripos($cfg['info']['usuarios'], 'No se paga aparte') !== false);
caso('idiomas: hasta 3, incluido, sin "lo confirma el desarrollador"',
    mb_stripos($cfg['info']['bilingue'], '3 idiomas') !== false && mb_stripos($cfg['info']['bilingue'], 'desarrollador') === false);
caso('el .com: .com.ar incluido y $40.000 por año de renovación',
    mb_stripos($cfg['info']['dominio_com'], '.com.ar') !== false && strpos($cfg['info']['dominio_com'], '$40.000') !== false);
caso('el hosting nombra el .com.ar y no el .com', mb_stripos($cfg['info']['hosting'], '.com.ar') !== false && strpos($cfg['info']['hosting'], '$40.000') === false);
$incluyeSitio = wabot_texto_info('que_incluye', $cfg, ['tipo' => 'landing']);
caso('al sitio profesional no le habla de cargar productos',
    mb_stripos($incluyeSitio, 'producto') === false && mb_stripos($incluyeSitio, '$10.000') !== false, $incluyeSitio);
caso('a la tienda sí', mb_stripos(wabot_texto_info('que_incluye', $cfg, ['tipo' => 'ecommerce']), '10 productos') !== false);
caso('sin tipo, el general', wabot_texto_info('que_incluye', $cfg, ['tipo' => null]) === $cfg['info']['que_incluye']);
caso('las estadísticas de la tienda y los cursos son las del panel; sitio e inmobiliaria, Google Analytics',
    mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'ecommerce']), 'panel') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'elearning']), 'panel') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'landing']), 'Google Analytics') !== false
    && mb_stripos(wabot_texto_info('estadisticas', $cfg, ['tipo' => 'inmobiliaria']), 'Google Analytics') !== false);
caso('"qué incluye" no contradice el adicional del .com',
    !preg_match('/solo dos|[úu]nico adicional/iu', $cfg['info']['que_incluye'] . $cfg['info']['que_incluye_sin_productos']));
caso('los productos extra solo se cobran si los cargamos nosotros',
    strpos($cfg['info']['que_incluye'], 'que carguemos') !== false && strpos($cfg['info']['que_incluye'], 'podés cargarlos vos') !== false);

echo "— 13. El que pregunta después del precio no está trabado —\n";

$c = conv_nueva('5491166660030TEST');
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
$c = conv_nueva('5491166660031TEST');
$c['fase'] = 'sistema_problema';
$repregunta = ['Y qué problema necesitás que resuelva el sistema?'];
$salidas = [];
foreach (['no se bien', 'es un marketplace', 'prefiero hablarlo con alguien tecnico'] as $noAvanza) {
    wabot_conv_transcript($c, 'cliente', $noAvanza);
    $salidas[] = wabot_salida_sin_avance($repregunta, $c, $cfg);
}
caso('el bot trabado repreguntando sigue derivando a la tercera', end($salidas) === [(string)$cfg['derivar']],
    json_encode($salidas, JSON_UNESCAPED_UNICODE));

foreach (glob(WABOT_DATA . '/conv/54911777700*TEST.json') ?: [] as $f) @unlink($f);
foreach (['997FPTEST', '996FPTEST', '998FPTEST', 'QATESTREG11SEP', 'QATESTREGLOGICA15'] as $k) @unlink(WABOT_DATA . '/conv/' . $k . '.json');
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

todo_ok();
