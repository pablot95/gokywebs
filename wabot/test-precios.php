<?php
/**
 * wabot/test-precios.php — el modelo comercial de las dos formas (solo CLI).
 *
 * Cada web se contrata con uno de dos planes: anual (una vez por año) o
 * mensual, sin seña y con lo mismo incluido (Pablo, 19-sep); el pago único
 * queda para el que pide la web propia. Esta suite fija lo que eso tiene
 * que garantizar:
 *  1. La lista de precios de los cuatro tipos.
 *  2. El turno del precio: dos mensajes, el segundo son los tres pasos sin link.
 *  3. El link del formulario sale recién con el sí del cliente.
 *  4. El precio se congela en la charla y no cambia si cambia la lista.
 *  5. Las respuestas fijas de pago (seña, saldo, cuál conviene, devolución…).
 *  6. Ningún texto sale con {precio} o {mensualidad} crudos.
 *  7. El que no quiere pagar por mes, quiere pagar una sola vez o quiere la web propia.
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

/**
 * Charla cotizada en la que Pablo volvió a prender el bot (18-sep): después
 * del precio la charla queda derivada, y con el bot prendido de nuevo siguen
 * valiendo las respuestas de la alternativa cotizada y el sí con formulario.
 */
function conv_reactivada($tipo, $cfg, $clave = '5491177770000TEST') {
    $c = conv_cotizada($tipo, $cfg, $clave);
    $c['fase'] = 'derivado';
    return $c;
}

echo "— 1. La lista de precios —\n";

foreach (['landing' => ['$120.000', '$180.000', '$20.000', '$40.000'], 'ecommerce' => ['$190.000', '$290.000', '$30.000', '$60.000'],
          'elearning' => ['$190.000', '$290.000', '$30.000', '$60.000'], 'inmobiliaria' => ['$170.000', '$240.000', '$30.000', '$60.000']] as $t => $par) {
    caso("$t: plan anual {$par[0]} con seña de {$par[3]}, plan mensual {$par[2]} y pago único de la web propia {$par[1]} (19-sep)",
        ($cfg['tipos'][$t]['precio'] ?? '') === $par[0] && ($cfg['tipos'][$t]['sena'] ?? '') === $par[3]
        && ($cfg['tipos'][$t]['mensualidad'] ?? '') === $par[2] && ($cfg['tipos'][$t]['precio_unico'] ?? '') === $par[1]);
    caso("$t: sin montos de cuota guardados", empty($cfg['tipos'][$t]['cuotas']) && empty($cfg['tipos'][$t]['pagos3']));
}
caso('los tipos son exactamente esos cuatro', array_keys($cfg['tipos']) === $TIPOS);
caso('la config es los textos del código más los ajustes de bot-config.json',
    $cfg['menu'] === wabot_textos_default()['menu'] && isset($cfg['activo']));
$v = wabot_precio_vigente(null, $cfg, 'ecommerce');
caso('el precio vigente sin charla es el de lista, modelo anual, con la seña y el resto calculado (19-sep)',
    $v['modelo'] === 'anual' && $v['precio'] === '$190.000' && $v['sena'] === '$60.000' && $v['saldo'] === '$130.000' && $v['mensualidad'] === '$30.000');
caso('la tabla de precios agrupa por par', strpos(wabot_tabla_precios_texto($cfg), 'Sitio profesional: plan anual de $120.000 o plan mensual de $20.000.') === 0);

echo "— 2. El turno del precio: la propuesta y la oferta del primer diseño (18-sep) —\n";

$c = conv_nueva('5491177770001TEST');
$r = wabot_pitch('landing', $c, $cfg);
$r0 = wabot_personalizar($r[0] ?? '', $c);
caso('son dos mensajes: la propuesta y, aparte, la oferta del primer diseño', count($r) === 2);
caso('arranca "Para lo que me contás, te armamos", sin "Lo mejor para" ni link (18-sep)',
    str_starts_with($r0, 'Para lo que me contás, te armamos un sitio profesional completo')
    && mb_stripos($r0, 'Lo mejor para') === false && strpos($r0, 'presupuestos/') === false, $r0);
caso('los dos planes con sus montos y, abajo, todo lo que incluyen (19-sep)',
    strpos($r0, "Podés elegir entre dos planes:\n\n• Plan anual: $120.000 por año\n• Plan mensual: $20.000 por mes\n\nAmbos incluyen todo:\n✓ Desarrollo completo de la web") !== false
    && strpos($r0, "Mantenimiento:\n✓ Renovación de hosting y dominio") !== false
    && strpos($r0, '✓ Actualizaciones de SDK y plugins') !== false && strpos($r0, '✓ Arreglo de errores') !== false
    && strpos($r0, '✓ Soporte técnico') !== false && mb_stripos($r0, 'pago único') === false && mb_stripos($r0, 'seña') === false, $r0);
caso('el panel figura incluido en todos los tipos, también en el sitio profesional (20-sep)',
    strpos($r0, '✓ Panel para autogestionar contenido') !== false, $r0);
$cTiendaPanel = conv_nueva('5491177770006TEST');
$rTiendaPanel = wabot_personalizar(implode("\n", wabot_pitch('ecommerce', $cTiendaPanel, $cfg)), []);
caso('la tienda usa el mismo texto breve del panel', strpos($rTiendaPanel, '✓ Panel para autogestionar contenido') !== false, $rTiendaPanel);
caso('sin "son alternativas, no se abonan las dos"', mb_stripos($r0, 'alternativas') === false && mb_stripos($r0, 'no se abonan') === false);
caso('el segundo mensaje ofrece el primer diseño sin cargo y pregunta',
    ($r[1] ?? '') === wabot_tres_pasos_texto($c, $cfg) && mb_stripos($r[1], 'sin cargo un primer diseño') !== false
    && str_ends_with($r[1], 'Querés que lo armemos?') && strpos($r[1], '$') === false, $r[1] ?? '');
caso('la oferta ya no dice "demo gratis"', mb_stripos($r[1] ?? '', 'demo') === false && mb_stripos($r[1] ?? '', 'gratis') === false);
caso('y sin el link del formulario', strpos(implode("\n", $r), 'gokywebs.com/form/') === false);
caso('el precio queda congelado en la charla: plan anual con su seña y mensual, modelo anual (19-sep)',
    ($c['precio_cotizado'] ?? '') === '$120.000' && ($c['sena_cotizada'] ?? '') === '$40.000' && ($c['mensualidad_cotizada'] ?? '') === '$20.000'
    && ($c['precio_modelo'] ?? '') === 'anual');
$cSinSena = $c; $cSinSena['sena_cotizada'] = '';
caso('una charla cotizada el 19-sep a la mañana, sin seña congelada, toma la de lista',
    wabot_precio_vigente($cSinSena, $cfg)['sena'] === '$40.000' && wabot_precio_vigente($cSinSena, $cfg)['saldo'] === '$80.000');
caso('el link todavía no se marcó como enviado', empty($c['link_form_enviado']));
caso('el bot queda esperando la respuesta a la oferta', $c['fase'] === 'prediseno' && !empty($c['oferta_diseno_ts']) && empty($c['bot_off']));
caso('el contador para el sí corto empieza en cero', ($c['precio_turnos_desde'] ?? null) === 0);
caso('la oferta sale con la demora fija de 2 segundos', wabot_demora_tipeo($r[1], $cfg) === 2.0);
caso('pasa entero por el punto único de salida: propuesta y oferta',
    (function () use ($cfg, $r, $c) { $out = wabot_salida_preparar($r, $c, $cfg);
        return count($out) === 2 && mb_stripos($out[0], 'plan mensual') !== false && mb_stripos($out[1], 'primer diseño') !== false; })());
caso('y en ninguno de los dos aparece la línea vieja de "si te cierra"',
    preg_match('/si te cierra|si va por ah|si te gusta la idea/iu', implode(' ', $r)) === 0);

foreach (['ecommerce' => 'una tienda online completa', 'inmobiliaria' => 'una web inmobiliaria completa',
          'elearning' => 'una plataforma de cursos completa'] as $tipo => $arranque) {
    $c = conv_nueva('5491177770003TEST');
    $r = wabot_pitch($tipo, $c, $cfg);
    $t = wabot_personalizar(implode("\n\n", $r), $c);
    caso("$tipo: la frase fija de su tipo y las dos formas",
        strpos($t, 'Para lo que me contás, te armamos ' . $arranque) === 0 && strpos($t, '• Plan mensual: $30.000 por mes') !== false, $t);
}
$c = conv_nueva('5491177770002TEST');
$c['rubro_pitch'] = 'tu centro de estética';
$r = wabot_pitch('landing', $c, $cfg);
caso('con el rubro sabido, la propuesta lo nombra: "Para tu centro de estética, te armamos…"',
    strpos(wabot_personalizar($r[0], $c), 'Para tu centro de estética, te armamos un sitio profesional completo') === 0,
    wabot_personalizar($r[0], $c));
caso('"pago inicial", nunca "primer pago" (14-sep)', mb_stripos(implode(' ', $r), 'primer pago') === false);

$c = conv_nueva('5491177770004TEST');
$c['pidio_precio'] = true;
$c['rubro_pitch'] = 'tu pastelería';
$r = wabot_precio('ecommerce', $c, $cfg);
caso('el que pidió el precio de entrada recibe el mismo formato',
    strpos(wabot_personalizar($r[0], $c), 'Para tu pastelería, te armamos una tienda online') === 0
    && mb_stripos($r[0], 'para lo tuyo va') === false, $r[0]);
caso('con la oferta del primer diseño en su propio mensaje, detrás del precio', count($r) === 2 && mb_stripos($r[1], 'primer diseño') !== false);

$c = conv_nueva('5491177770005TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('el anuncio viejo de demo también ve primero el precio y la oferta, sin el formulario pegado',
    count($r) === 2 && mb_stripos($r[1], 'primer diseño') !== false && !tiene_form($r),
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
    caso('dos alternativas completas: ' . $par[1], strpos($txt, $v['precio']) !== false && strpos($txt, $v['mensualidad']) !== false && strpos($txt, 'Ambos incluyen todo:') !== false, $txt);
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
    !tiene_form($r) && !empty($r), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 4. El precio congelado no cambia si cambia la lista —\n";

$c = conv_nueva('5491177770040TEST');
wabot_pitch('ecommerce', $c, $cfg);
$cfgSube = $cfg;
$cfgSube['tipos']['ecommerce']['precio'] = '$395.000';
$cfgSube['tipos']['ecommerce']['mensualidad'] = '$33.000';
$res = wabot_precio_resumen($c, $cfgSube);
caso('el resumen repite el precio que se le dio, no el de la lista nueva',
    strpos($res, '$190.000') !== false && strpos($res, '$30.000') !== false && strpos($res, '$395.000') === false, $res);
caso('lo mismo la respuesta de pago',
    strpos(wabot_texto_pago($c, $cfgSube), '$30.000') !== false && strpos(wabot_texto_pago($c, $cfgSube), '$33.000') === false);
caso('y la del plan mensual', strpos(wabot_texto_mantenimiento($c, $cfgSube), '$30.000') !== false
    && strpos(wabot_texto_mantenimiento($c, $cfgSube), '$33.000') === false);
caso('un cliente nuevo sí recibe la lista nueva',
    strpos(wabot_msg_precio_texto('ecommerce', $cfgSube, conv_nueva('5491177770041TEST')), '$33.000') !== false);
caso('wabot_precio_vigente devuelve lo congelado aunque la lista cambie',
    wabot_precio_vigente($c, $cfgSube) === wabot_precio_vigente($c, $cfg));
$cR = $c; $cR['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('el reset de sesión libera el precio congelado', empty($cR['precio_cotizado']) && empty($cR['mensualidad_cotizada']));

/* Cotizada del 10 al 14-sep, con la mensualidad sola (snapshot 'mensual'):
 * conserva SU mensualidad y se le ofrece también el plan anual de lista. */
$cM = array_merge(conv_nueva('5491177770050TEST'), ['tipo' => 'landing', 'precio_dado' => true, 'fase' => 'prediseno',
    'cta_muestra' => true, 'precio_cotizado' => '$40.000', 'mensualidad_cotizada' => '$15.000', 'precio_modelo' => 'mensual']);
$vM = wabot_precio_vigente($cM, $cfg);
caso('el snapshot mensual conserva su mensualidad y toma el plan anual de lista (19-sep)',
    $vM['modelo'] === 'anual' && $vM['mensualidad'] === '$15.000' && $vM['precio'] === '$120.000' && $vM['sena'] === '$40.000');
caso('y la respuesta de pago dice los dos planes con esos montos',
    strpos(wabot_texto_pago($cM, $cfg), 'el mensual, de $15.000 por mes') !== false && strpos(wabot_texto_pago($cM, $cfg), 'el anual, de $120.000') !== false, wabot_texto_pago($cM, $cfg));
$cV = array_merge(conv_nueva('5491177770051TEST'), ['tipo' => 'landing', 'precio_dado' => true]);
caso('sin snapshot (charla anterior al 10-sep) vale la lista de hoy, modelo anual',
    wabot_precio_vigente($cV, $cfg)['precio'] === '$120.000' && wabot_precio_vigente($cV, $cfg)['modelo'] === 'anual');

echo "— 5. Las respuestas fijas de pago (batería del 15-sep) —\n";

$c21 = conv_cotizada('landing', $cfg, '997FPTEST');
$v21 = wabot_precio_vigente($c21, $cfg);
$sena21 = $v21['sena']; $mens21 = $v21['mensualidad'];
$anualMil = (int)(wabot_monto_a_numero($v21['precio']) / 1000);
$mensMil = (int)(wabot_monto_a_numero($mens21) / 1000);

$rCostos = wabot_respuesta_pago_fija('Con el plan anual despues tengo que pagar algo mas?', $c21, $cfg);
caso('lo que queda para después: nada aparte con los planes, salvo los cambios, sin la demo (19-sep)',
    is_array($rCostos) && mb_stripos($rCostos[0], 'no hay costos aparte') !== false && mb_stripos($rCostos[0], 'plan mensual con cambios') !== false && mb_stripos($rCostos[0], 'demo') === false,
    json_encode($rCostos, JSON_UNESCAPED_UNICODE));
$rCostosPropia = wabot_respuesta_pago_fija('Con el pago unico despues tengo que pagar algo mas?', $c21, $cfg);
caso('la misma duda sobre el pago único queda para la respuesta de la web propia (19-sep)', $rCostosPropia === null
    && wabot_info_por_palabras('Con el pago unico despues tengo que pagar algo mas?', 'prediseno') === 'web_propia',
    json_encode($rCostosPropia, JSON_UNESCAPED_UNICODE));
$c21b = $c21;
$rDev = wabot_respuesta_pago_fija('Si pago y despues no me gusta, me devuelven la plata?', $c21b, $cfg);
caso('la devolución: primero el diseño sin cargo y las dos oportunidades de rediseño, y la sigue Pablo (19-sep)',
    is_array($rDev) && mb_stripos($rDev[0], 'primer diseño sin cargo') !== false && mb_stripos($rDev[0], 'dos veces') !== false
    && !empty($c21b['handoff_pendiente']), json_encode($rDev, JSON_UNESCAPED_UNICODE));
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

$rSena = wabot_respuesta_pago_fija("Entonces pago $anualMil mil por mes?", $c21, $cfg);
caso('el plan anual leído como mensualidad se corrige con un no (19-sep)',
    is_array($rSena) && mb_strpos($rSena[0], 'No: los ' . $v21['precio'] . ' son el plan anual') === 0 && mb_strpos($rSena[0], $mens21) !== false,
    json_encode($rSena, JSON_UNESCAPED_UNICODE));
$rMens = wabot_respuesta_pago_fija("Ah o sea que son $mensMil mil y listo, pago una sola vez?", $c21, $cfg);
caso('la mensualidad leída como un pago solo también',
    is_array($rMens) && mb_strpos($rMens[0], 'No: los ' . $mens21 . ' son por mes') === 0 && mb_strpos($rMens[0], $v21['precio']) !== false,
    json_encode($rMens, JSON_UNESCAPED_UNICODE));
caso('entenderlo bien no dispara la corrección', wabot_texto_confusion_montos("Los $mensMil mil por mes incluyen el hosting?", $c21, $cfg) === null);
$rInicio = wabot_respuesta_pago_fija('Y si elijo el mensual cuánto pago al principio?', $c21, $cfg);
caso('"con el mensual cuánto pago al principio?": no hay pago inicial, con la mensualidad',
    is_array($rInicio) && mb_strpos($rInicio[0], 'no hay pago inicial') !== false && mb_strpos($rInicio[0], $mens21) !== false
    && mb_strpos($rInicio[0], $v21['precio']) === false, json_encode($rInicio, JSON_UNESCAPED_UNICODE));
$rSaldoAnual = wabot_respuesta_pago_fija('el saldo cuando se paga?', $c21, $cfg);
caso('plan anual (19-sep): "¿el saldo cuándo se paga?" al entregar, con la seña y el resto',
    is_array($rSaldoAnual) && mb_strpos($rSaldoAnual[0], 'Con el plan anual') === 0 && mb_strpos($rSaldoAnual[0], $v21['sena']) !== false
    && mb_strpos($rSaldoAnual[0], $v21['saldo']) !== false && mb_stripos($rSaldoAnual[0], 'una vez por año') !== false, json_encode($rSaldoAnual, JSON_UNESCAPED_UNICODE));
$rSenaAnual = wabot_respuesta_pago_fija('cuanto es la seña?', $c21, $cfg);
caso('plan anual: "¿cuánto es la seña?" con su monto y el resto al entregar',
    is_array($rSenaAnual) && mb_strpos($rSenaAnual[0], 'Con el plan anual arrancás con una seña de ' . $v21['sena']) === 0
    && mb_strpos($rSenaAnual[0], $v21['saldo']) !== false, json_encode($rSenaAnual, JSON_UNESCAPED_UNICODE));
$rSenaMes = wabot_respuesta_pago_fija('Entonces pago ' . (int)(wabot_monto_a_numero($v21['sena']) / 1000) . ' mil por mes?', $c21, $cfg);
caso('plan anual: la seña leída como mensualidad se corrige con un no',
    is_array($rSenaMes) && mb_strpos($rSenaMes[0], 'No: los ' . $v21['sena'] . ' son la seña del plan anual') === 0
    && mb_strpos($rSenaMes[0], $mens21) !== false, json_encode($rSenaMes, JSON_UNESCAPED_UNICODE));
$cDoble = array_merge(conv_nueva('5491177770052TEST'), ['tipo' => 'landing', 'precio_dado' => true, 'fase' => 'derivado',
    'precio_cotizado' => '$180.000', 'sena_cotizada' => '$40.000', 'mensualidad_cotizada' => '$15.000', 'precio_modelo' => 'doble']);
$rSaldo = wabot_respuesta_pago_fija('el saldo cuando se paga?', $cDoble, $cfg);
// El saldo del pago único congelado: $180.000 menos la seña de $40.000, no el precio nuevo.
caso('la charla cotizada con seña (15 al 18-sep) sí: al entregar, con el monto', is_array($rSaldo) && mb_strpos($rSaldo[0], '$140.000') !== false,
    json_encode($rSaldo, JSON_UNESCAPED_UNICODE));
$rAntes = wabot_respuesta_pago_fija('Pasame el link de mercado pago para suscribirme al mensual', $c21, $cfg);
caso('pedir el link de pago antes del formulario: primero el formulario', is_array($rAntes) && mb_strpos($rAntes[0], 'Antes de pagar') === 0,
    json_encode($rAntes, JSON_UNESCAPED_UNICODE));
$rRechMens = wabot_respuesta_pago_fija('No me interesa el mensual', $c21, $cfg);
caso('rechazar el mensual ofrece el plan anual (19-sep)', is_array($rRechMens) && mb_stripos($rRechMens[0], 'plan anual') !== false,
    json_encode($rRechMens, JSON_UNESCAPED_UNICODE));
$rRechUnico = wabot_respuesta_pago_fija('no me interesa el plan anual', $c21, $cfg);
caso('rechazar el plan anual ofrece el mensual con su monto', is_array($rRechUnico) && mb_strpos($rRechUnico[0], $mens21) !== false,
    json_encode($rRechUnico, JSON_UNESCAPED_UNICODE));
caso('"el anual no es la mensualidad": la pregunta al revés se contesta con los dos montos',
    (function () use ($c21, $cfg, $v21) { $txt = implode(' ', wabot_respuesta_pago_fija('La mensualidad es de ' . $v21['precio'] . '?', $c21, $cfg) ?? []);
        return strpos($txt, $v21['mensualidad']) !== false && strpos($txt, 'plan anual') !== false; })());

$c21d = $c21;
$rDesc = wabot_regateo_responder('Con transferencia hay descuento?', $c21d, $cfg);
caso('"¿hay descuento?" se contesta con el no y las dos formas, no con el texto de caro',
    is_array($rDesc) && mb_strpos($rDesc[0], 'No manejamos descuentos') === 0 && mb_strpos($rDesc[0], $v21['precio']) !== false
    && mb_strpos($rDesc[0], $mens21) !== false, json_encode($rDesc, JSON_UNESCAPED_UNICODE));
wabot_regateo_responder('Dejamelo en 150 mil y cerramos', $c21d, $cfg);
caso('y si después regatea con un número, lo toma el desarrollador', ($c21d['fase'] ?? '') === 'derivado');

/* Por el borde común, como llega en producción (18-sep): después del precio
 * y la oferta del primer diseño, una duda de pago NO se contesta sola. La
 * contesta Pablo, que ve el chat pendiente (las respuestas fijas de arriba
 * siguen sirviendo antes del precio y si Pablo vuelve a prender el bot). */
foreach (['Con el pago unico despues tengo que pagar algo mas?', 'Cual es la diferencia entre las dos formas?',
          'Y si elijo el mensual cuánto pago al principio?', 'Los 25 mil son la seña?',
          'Si elijo el pago único, cuánto pongo para empezar y cuánto al entregar?'] as $m) {
    $c = conv_nueva('5491177770033TEST');
    wabot_pitch('ecommerce', $c, $cfg);
    wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $out = wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg);
    caso('después de la oferta, por el borde, la duda queda para Pablo: ' . $m,
        $out === [] && !empty($c['bot_off']) && !empty($c['handoff_pendiente']), json_encode($out, JSON_UNESCAPED_UNICODE));
}

/* "¿Es obligatorio?" después del plan: no, es una de las dos formas. */
$cObl = ['transcript' => [['q' => 'bot', 't' => wabot_texto_mantenimiento(['tipo' => 'landing'], $cfg), 'ts' => time()]]];
caso('"es obligatorio?" después del plan: no, es una de las dos formas (15-sep)',
    ($ro = wabot_respuesta_obligatorio($cObl, $cfg, 'es obligatorio?')) !== null
    && mb_strpos($ro, 'No: el plan mensual es una de las dos formas') === 0 && mb_stripos($ro, 'una vez por año') !== false);
$cP = conv_nueva('5491177770060TEST');
$rPitch = wabot_pitch('landing', $cP, $cfg);
$cOblig = ['tipo' => 'landing', 'precio_dado' => true, 'precio_cotizado' => '$120.000', 'mensualidad_cotizada' => '$15.000',
    'precio_modelo' => 'anual', 'transcript' => [
        ['q' => 'cliente', 't' => 'Soy psicóloga y quiero una web'],
        ['q' => 'bot', 't' => $rPitch[0]], ['q' => 'bot', 't' => $rPitch[1]],
        ['q' => 'cliente', 't' => 'Es obligatorio pagar todos los meses?']]];
caso('"¿es obligatorio pagar todos los meses?" con el precio en dos mensajes: contesta el texto del servicio',
    wabot_texto_pregunta_si_es_obligatorio('Es obligatorio pagar todos los meses?')
    && ($rOblig = wabot_respuesta_obligatorio($cOblig, $cfg, 'Es obligatorio pagar todos los meses?')) !== null
    && mb_strpos($rOblig, 'No: el plan mensual es una de las dos formas') === 0);
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
    'cuenta_mercado_pago'    => wabot_texto_info('cuenta_mercado_pago', $cfg),
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
caso('el pago genérico explica los dos planes sin montos antes de saber el rubro (19-sep)',
    stripos(wabot_texto_pago_generico($cfg), 'Hay dos planes') !== false && strpos(wabot_texto_pago_generico($cfg), '$') === false
    && stripos(wabot_texto_pago_generico($cfg), 'una vez por año') !== false && stripos(wabot_texto_pago_generico($cfg), 'sin permanencia') !== false);
caso('el resumen del precio dice los dos planes con el bloque único, sin seña (19-sep)',
    strpos((string)$cfg['precio_resumen'], '{dos_formas}') !== false && strpos((string)$cfg['precio_resumen'], '{sena}') === false
    && strpos(wabot_precio_resumen($cLanding, $cfg), '• Plan anual: $120.000 por año') !== false
    && mb_stripos(wabot_precio_resumen($cLanding, $cfg), 'seña') === false, wabot_precio_resumen($cLanding, $cfg));
caso('el resumen conserva el portfolio filtrado',
    strpos(wabot_precio_resumen(['tipo' => 'ecommerce', 'precio_dado' => true], $cfg), 'gokywebs.com/portfolio/?tipo=ecommerce') !== false);
$pagoLanding = wabot_texto_pago(conv_cotizada('landing', $cfg), $cfg);
caso('info.pago explica los dos planes con sus montos, lo que incluyen y la seña del anual sin su monto (19-sep)',
    strpos($pagoLanding, 'el anual, de $120.000') !== false && strpos($pagoLanding, 'el mensual, de $20.000 por mes') !== false
    && strpos($cfg['info']['pago'], '{sena}') === false && strpos($pagoLanding, 'Los dos incluyen lo mismo') !== false
    && mb_stripos($pagoLanding, 'El anual arranca con una seña') !== false && strpos($pagoLanding, '$40.000') === false, $pagoLanding);
caso('el proceso explica modelos y los dos planes, sin demo gratis',
    stripos($cfg['info']['proceso'], 'modelos') !== false && mb_stripos($cfg['info']['proceso'], 'el plan anual o el mensual') !== false
    && stripos($cfg['info']['proceso'], 'demo gratis') === false && strpos(wabot_texto_info('proceso', $cfg), '$') === false);
caso('la renovación del hosting: no hay, va incluida en los dos planes (19-sep)', mb_stripos((string)$cfg['hosting_renovacion'], 'No hay renovación aparte') === 0);
caso('"es caro" no menciona cuotas sin interés', stripos($cfg['caro'], 'sin interés') === false && stripos($cfg['caro'], 'cuotas') === false);

echo "— 7. El código, la propiedad y la baja no los dice el bot (19-sep) —\n";

$salenSolos = [$cfg['tipos']['landing']['precio_ideal'], $cfg['msg_precio'], $cfg['caro'], $cfg['plataformas'],
    $cfg['info']['que_incluye'], $cfg['info']['mantenimiento'], $cfg['info']['pago'],
    $cfg['msg_tres_pasos'], $cfg['prediseno_link']];
caso('ningún texto que sale solo nombra cuándo se reclama el código',
    count(array_filter($salenSolos, function ($t) { return preg_match('/12 meses|2 años|reclamar el código/iu', (string)$t); })) === 0);
caso('si preguntan, la propiedad del código se contesta con sus plazos (20-sep)',
    mb_stripos($cfg['info']['entrega_codigo'], 'al pagar el segundo año') !== false
    && mb_stripos($cfg['info']['entrega_codigo'], 'a los 18 meses') !== false
    && mb_stripos($cfg['info']['entrega_codigo'], 'cuando abonás el total') !== false);
$cuentaMp = wabot_texto_info('cuenta_mercado_pago', $cfg);
caso('"¿necesito cuenta de Mercado Pago?": no hace falta, con cualquier tarjeta, y nada de la baja',
    mb_stripos($cuentaMp, 'No hace falta') === 0 && mb_stripos($cuentaMp, 'cualquier tarjeta') !== false
    && !preg_match('/baja|permanencia|desactiva|dejás de pagar/iu', $cuentaMp), $cuentaMp);
caso('cómo se paga aclara que no hace falta cuenta de Mercado Pago', mb_stripos(wabot_texto_pago(conv_cotizada('landing', $cfg), $cfg), 'cualquier tarjeta') !== false);
foreach (['como doy de baja el plan?', 'se puede cancelar la suscripcion?', 'hay permanencia?', 'que pasa si dejo de pagar?'] as $p) {
    caso("\"$p\" → baja_del_plan, con su respuesta", wabot_info_por_palabras($p, 'prediseno') === 'baja_del_plan'
        && trim(wabot_texto_info('baja_del_plan', $cfg)) !== '', (string)wabot_info_por_palabras($p, 'prediseno'));
}
foreach (['necesito cuenta de mercado pago?', 'no tengo mercado pago, puedo pagar igual?'] as $p) {
    caso("\"$p\" → cuenta_mercado_pago, no la baja", wabot_info_por_palabras($p, 'prediseno') === 'cuenta_mercado_pago',
        (string)wabot_info_por_palabras($p, 'prediseno'));
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
foreach (['puedo pagar la web de una sola vez sin el plan mensual?', 'tienen plan anual?'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso('"' . mb_substr($p, 0, 48) . '" → un_solo_pago', $k === 'un_solo_pago', (string)$k);
}
/* Pagar la creación una vez y encargarse él (14-sep) es, desde el 19-sep, la
 * web propia: el pago único, sin hosting, dominio ni mantenimiento. */
foreach ([$realUnaVez, 'se puede hacer en un solo pago y yo me encargo del hosting?'] as $p) {
    $k = wabot_info_por_palabras($p, 'prediseno');
    caso('"' . mb_substr($p, 0, 48) . '" → web_propia', $k === 'web_propia', (string)$k);
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
caso('al que no quiere pagar por mes le ofrece el plan anual (19-sep)',
    mb_stripos($serv, 'te conviene el plan anual') !== false && mb_stripos($serv, 'no tenés que pagar todos los meses') !== false, $serv);
caso('sin plataformas de streaming y sin el detalle de los cambios extra',
    mb_stripos($serv, 'netflix') === false && strpos($serv, '$10.000') === false);
caso('y aclara que incluye lo mismo que el mensual (19-sep)', mb_stripos($serv, 'Incluye lo mismo que el mensual') !== false);
$cU = conv_cotizada('ecommerce', $cfg, '5491177770090TEST');
$u = wabot_texto_info('un_solo_pago', $cfg, $cU);
caso('la tienda con el plan anual sale $190.000 por año, con seña sin su monto (19-sep)',
    strpos($u, '$190.000') !== false && mb_stripos($u, 'plan anual') !== false && mb_stripos($u, 'arrancás con una seña') !== false
    && strpos($u, '$60.000') === false, $u);
foreach (['landing' => '$120.000', 'inmobiliaria' => '$170.000', 'elearning' => '$190.000'] as $t => $p) {
    $cU = conv_cotizada($t, $cfg, '5491177770090TEST');
    caso("$t con el plan anual sale $p", strpos(wabot_texto_info('un_solo_pago', $cfg, $cU), $p) !== false);
}
$uSin = wabot_texto_info('un_solo_pago', $cfg);
caso('sin tipo cotizado no da montos: pregunta a qué se dedica (15-sep)',
    strpos($uSin, '$') === false && mb_stripos($uSin, 'Contame a qué te dedicás') !== false, $uSin);
echo "— 8b. La web propia: el pago único, sin hosting ni mantenimiento (Pablo, 19-sep) —\n";

foreach (['landing' => '$180.000', 'ecommerce' => '$290.000', 'elearning' => '$290.000', 'inmobiliaria' => '$240.000'] as $t => $p) {
    $wp = wabot_texto_info('web_propia', $cfg, conv_cotizada($t, $cfg, '5491177770093TEST'));
    // 20-sep: es solo la página (sin hosting ni dominio) y el mantenimiento se puede sumar aparte.
    caso("$t: la web propia es el pago único de $p, solo la página",
        strpos($wp, 'pago único, de ' . $p) !== false && mb_stripos($wp, 'es solo la página') !== false
        && mb_stripos($wp, 'No incluye hosting ni dominio') !== false
        && mb_stripos($wp, 'le sumás el mantenimiento') !== false, $wp);
}
$wpSin = wabot_texto_info('web_propia', $cfg);
caso('sin tipo, la web propia no da el precio de la página y pregunta a qué se dedica',
    mb_stripos($wpSin, 'pago único, de $') === false && mb_stripos($wpSin, 'Contame a qué te dedicás') !== false
    && mb_stripos($wpSin, '$10.000 por mes en sitio profesional') !== false, $wpSin);
foreach (['Quiero que la web sea mía', 'Tengo mi propio hosting', 'Ya tengo hosting y dominio', 'Quiero comprar la web',
          'Tienen pago único?', 'Prefiero que quede a mi nombre', 'Quiero tener el código', 'Cuánto sale sin mantenimiento?',
          'El mantenimiento lo hago yo'] as $p) {
    caso("pide la web propia: \"$p\"", wabot_pide_web_propia($p));
}
foreach (['Quiero mi propia web', 'Quiero una web propia para mi negocio', 'No tengo hosting ni dominio', 'Tengo que pagar el hosting aparte?',
          'La web queda a mi nombre?', 'Quiero el código de descuento', 'Tienen plan anual?', 'No me interesa el pago único',
          'Vendo mi propiedad en Palermo', $realRechazo] as $p) {
    caso('no pide la web propia: "' . mb_substr($p, 0, 48) . '"', !wabot_pide_web_propia($p));
}
caso('"¿la web queda a mi nombre?" va a la titularidad, que se contesta con los plazos (20-sep)',
    wabot_info_por_palabras('la web queda a mi nombre?', 'prediseno') === 'titularidad'
    && mb_stripos(wabot_texto_info('titularidad', $cfg, conv_cotizada('landing', $cfg, '5491177770093TEST')), 'a los 18 meses') !== false);
foreach (['landing' => '$10.000', 'ecommerce' => '$15.000'] as $t => $mant) {
    $wp = wabot_texto_info('web_propia', $cfg, conv_cotizada($t, $cfg, '5491177770093TEST'));
    caso("$t: el pago único es solo la página, con el código al abonar el total y el mantenimiento opcional de $mant",
        mb_stripos($wp, 'es solo la página') !== false && mb_stripos($wp, 'el código queda tuyo') !== false
        && mb_stripos($wp, 'No incluye hosting ni dominio') !== false && strpos($wp, $mant . ' por mes') !== false, $wp);
}

// Por el borde: sin rubro, contesta el pago único y pregunta a qué se dedica.
$cW = conv_nueva('5491177770094TEST'); $cW['fase'] = 'menu';
clasifica(['otro']);
$rW = turno('Quiero la web a mi nombre, en mi propio hosting', $cW, $cfg);
caso('sin rubro, la web propia se contesta y queda anotada', count($rW) === 1 && mb_stripos($rW[0], 'pago único') !== false
    && mb_stripos($rW[0], 'Contame a qué te dedicás') !== false && !empty($cW['quiere_web_propia']), json_encode($rW, JSON_UNESCAPED_UNICODE));
clasifica(['rubro_landing']);
$rW = turno('Soy electricista', $cW, $cfg);
caso('y el precio después suma el pago único debajo de los planes',
    strpos($rW[0] ?? '', 'Y si la querés en tu propio hosting, está el pago único: $180.000. Ese es solo la página, sin hosting ni dominio, y el código queda tuyo cuando abonás el total; si querés, le sumás el mantenimiento por $10.000 por mes.') !== false
    && strpos($rW[0] ?? '', 'Y si la querés en tu propio hosting') > strpos($rW[0] ?? '', '✓ Soporte técnico'), $rW[0] ?? '');
caso('el boceto lo lleva en el precio cotizado y en la ficha',
    wabot_lead_cotizado($cW, $cfg) === 'Plan anual $120.000 (seña $40.000) o plan mensual $20.000 · pidió la web propia: pago único $180.000'
    && mb_stripos(wabot_ficha_resumen($cW, $cfg), 'Web propia') !== false, wabot_lead_cotizado($cW, $cfg));
$cN = conv_nueva('5491177770095TEST'); $cN['fase'] = 'menu';
clasifica(['rubro_landing']);
$rN = turno('Soy electricista', $cN, $cfg);
caso('sin el pedido, el precio no nombra el pago único', !empty($cN['precio_dado']) && mb_stripos(implode("\n", $rN), 'pago único') === false);
$cW2 = conv_nueva('5491177770096TEST'); $cW2['fase'] = 'menu';
clasifica(['rubro_comercio']);
$rW2 = turno('Vendo ropa de mujer y la quiero en mi propio hosting', $cW2, $cfg);
caso('rubro y pedido en el mismo mensaje: la tienda con el pago único de $290.000', !empty($cW2['precio_dado'])
    && strpos($rW2[0] ?? '', 'está el pago único: $290.000') !== false, $rW2[0] ?? '');
$cW3 = conv_nueva('5491177770097TEST'); $cW3['fase'] = 'menu';
clasifica(['pregunta_info'], ['info_keys' => ['hosting']]);
$rW3 = turno('Tengo mi propio hosting, la pueden subir ahí?', $cW3, $cfg);
caso('el clasificador dice hosting: igual va la web propia, sin "el hosting va incluido"', count($rW3) === 1
    && mb_stripos($rW3[0], 'pago único') !== false && mb_stripos($rW3[0], 'van incluidos') === false, json_encode($rW3, JSON_UNESCAPED_UNICODE));
$cW4 = conv_nueva('5491177770098TEST'); $cW4['fase'] = 'menu';
clasifica(['rubro_inmobiliaria']);
turno('Tengo una inmobiliaria', $cW4, $cfg);
clasifica(['otro']);
$rW4 = turno('Y si la quiero en mi hosting?', $cW4, $cfg);
caso('después del precio, la web propia queda para Pablo y anotada en la ficha', $rW4 === [] && !empty($cW4['quiere_web_propia'])
    && mb_stripos(wabot_ficha_resumen($cW4, $cfg), 'Web propia') !== false);
$cW5 = conv_nueva('5491177770099TEST'); $cW5['fase'] = 'menu';
clasifica(['rubro_landing']);
turno('Soy electricista', $cW5, $cfg);
clasifica(['otro']);
$rW5 = turno('Sí, vamos con el pago único', $cW5, $cfg);
caso('elegir el pago único en la oferta manda el formulario pero no lo anota como plan anual', tiene_form($rW5)
    && ($cW5['modalidad_elegida'] ?? '') === '' && !empty($cW5['quiere_web_propia']), json_encode($rW5, JSON_UNESCAPED_UNICODE));
$cWd = array_merge(conv_nueva('5491177770100TEST'), ['tipo' => 'ecommerce', 'precio_dado' => true, 'fase' => 'derivado',
    'precio_cotizado' => '$290.000', 'sena_cotizada' => '$40.000', 'mensualidad_cotizada' => '$25.000', 'precio_modelo' => 'doble']);
$wpd = wabot_texto_info('web_propia', $cfg, $cWd);
caso('la charla del pago único de antes (15 al 18-sep) recibe sus condiciones, no las de la web propia nueva',
    mb_stripos($wpd, 'Incluye mantenimiento el primer año') !== false && mb_stripos($wpd, 'no incluye hosting') === false, $wpd);
$cWd2 = $cWd;
wabot_web_propia_anotar($cWd2, 'Quiero la web en mi hosting', $cfg);
caso('y no se le anota la web propia', empty($cWd2['quiere_web_propia']));
$cR3 = array_merge($cW, ['ultimo_ts' => time() - 30 * 86400]);
wabot_conv_reset_si_vieja($cR3, $cfg, time());
caso('el reset de sesión olvida el pedido de la web propia', empty($cR3['quiere_web_propia']));

/* Los dos casos reales llegaron DESPUÉS del precio: desde el 18-sep esa
 * respuesta la da Pablo (el bot solo contesta el sí al primer diseño). */
foreach ([$realUnaVez, $realRechazo] as $m) {
    $cA = conv_nueva('5491177770091TEST');
    wabot_pitch('ecommerce', $cA, $cfg);
    wabot_conv_transcript($cA, 'cliente', $m); $cA['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $sA = wabot_salida_preparar(wabot_responder($m, $cA, $cfg), $cA, $cfg);
    caso('el caso real después del precio queda para Pablo: ' . mb_substr($m, 0, 40),
        $sA === [] && !empty($cA['handoff_pendiente']) && !empty($cA['bot_off']), json_encode($sA, JSON_UNESCAPED_UNICODE));
}
$cA = conv_nueva('5491177770092TEST');
wabot_pitch('ecommerce', $cA, $cfg);
turno('No me interesa el mensual', $cA, $cfg);
caso('el que rechaza el mensual después del precio deja anotada la forma que prefiere, para el boceto',
    ($cA['modalidad_elegida'] ?? '') === 'unico' && !empty($cA['bot_off']));
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
    (string)$val('presupuesto_cotizado') === 'Plan anual $120.000 (seña $40.000) o plan mensual $20.000', (string)$val('presupuesto_cotizado'));
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
    ($cTM['fase'] ?? '') !== 'derivado' && empty($cTM['bot_off']) && ($cTM['tipo'] ?? '') === 'ecommerce' && !empty($cTM['combo_cursos'])
    && strpos(implode("\n", (array)$rTM), 'una tienda online completa, con tus cursos') !== false
    && strpos(implode("\n", (array)$rTM), '$190.000') !== false
    && strpos(implode("\n", (array)$rTM), '$30.000') !== false, json_encode($rTM, JSON_UNESCAPED_UNICODE));
caso('con la frase del combinado y sin el aviso de "el precio no sale de la lista"',
    mb_stripos(implode("\n", (array)$rTM), 'una tienda online completa, con tus cursos') !== false
    && mb_stripos(implode("\n", (array)$rTM), 'no sale de la lista') === false);
caso('el resumen del precio no manda link de presupuesto', strpos(wabot_precio_resumen($cTM, $cfg), 'presupuestos/') === false);
caso('y el boceto dice que es tienda + cursos',
    mb_stripos((string)reset(wabot_lead_campos($cTM, $cfg, false)['tipoDetectadoLabel']), 'cursos') !== false);
$cTS = conv_nueva('5491177770098TEST');
clasifica(['rubro_ecommerce']);
$rTS = wabot_engine('Tengo una tienda de ropa y quiero vender online', $cTS, $cfg);
caso('una tienda sin cursos se cotiza como tienda sola', empty($cTS['combo_cursos'])
    && strpos($rTS[0], '• Plan anual: $190.000 por año') !== false && strpos($rTS[0], 'una tienda online completa, con tus cursos') === false);
$cCombo = conv_nueva('998FPTEST'); $cCombo['fase'] = 'nuevo';
$msjCombo = 'Buenas, tengo un taller de artesanias. Quiero vender insumos online y mas adelante subir cursos';
wabot_conv_transcript($cCombo, 'cliente', $msjCombo); $cCombo['ultimo_cliente_ts'] = time();
clasifica(['productos_y_cursos']);
$rCombo = wabot_salida_preparar(wabot_responder($msjCombo, $cCombo, $cfg), $cCombo, $cfg);
caso('por el borde común: el taller de artesanías recibe la cotización de tienda + cursos, no el texto de carga',
    strpos(implode("\n", $rCombo), 'una tienda online completa, con tus cursos') !== false
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
    strpos($textoOtro, '$120.000') !== false && strpos($textoOtro, '$190.000') !== false, $textoOtro);
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
    is_string($up) && strpos($up, '$190.000') !== false && strpos($up, 'No es un adicional') !== false, (string)$up);

$c = conv_reactivada('landing', $cfg, 'QATESTREG11SEP');
$p = 'Y si además quiero vender productos de skincare y cobrarlos online, cuánto sale todo junto?';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
clasifica(['otro']);
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('cotiza la alternativa sin cambiar aún el tipo', $c['tipo'] === 'landing'
    && ($c['upgrade_pendiente']['tipo'] ?? '') === 'ecommerce' && strpos(implode(' ', $r ?? []), '$30.000') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', $m);
$p = 'Entonces serían 90 mil de primer pago y 25 mil por mes en total, no los dos planes juntos?';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('aclara el total sin sumar planes ni volver al anterior',
    strpos(implode(' ', $r ?? []), 'tienda online: plan anual de $190.000 o plan mensual de $30.000') !== false
    && strpos(implode(' ', $r ?? []), 'No es un adicional') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', $m);
$vUp = $c['upgrade_pendiente'];
$rUpSena = wabot_upgrade_pago_texto($vUp, $c, $cfg);
// Los montos después del upgrade son los de la tienda ($190.000 y $30.000),
// no los del sitio ($120.000 y $20.000). La seña, sin su monto.
caso('el pago después del upgrade es el de la tienda, no el del sitio',
    mb_strpos($rUpSena, '$190.000') !== false && mb_strpos($rUpSena, '$60.000') === false
    && mb_strpos($rUpSena, '$30.000') !== false && mb_strpos($rUpSena, '$20.000') === false, $rUpSena);
caso('la tienda consultada de nuevo se confirma corta, no con el mismo texto',
    wabot_upgrade_confirmacion_texto($vUp, $c, $cfg) !== wabot_upgrade_texto('ecommerce', $c, $cfg));
$p = 'Sí, quiero la demo con la tienda';
wabot_conv_transcript($c, 'cliente', $p); $c['ultimo_cliente_ts'] = time();
$r = wabot_salida_preparar(wabot_responder($p, $c, $cfg), $c, $cfg);
caso('acepta la tienda con cotización y formulario coherentes', $c['tipo'] === 'ecommerce'
    && $c['precio_cotizado'] === '$190.000' && $c['mensualidad_cotizada'] === '$30.000'
    && count($r) === 1 && tiene_form($r) && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
$cRes = conv_cotizada('landing', $cfg);
$cRes['upgrade_pendiente'] = wabot_precio_vigente(null, $cfg, 'ecommerce');
$cRes['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cRes, $cfg);
caso('el cambio de alcance pendiente no sobrevive una sesión vieja', empty($cRes['upgrade_pendiente']));

/* Cambio a cursos desde un sitio profesional cotizado (15-sep). */
$c = conv_reactivada('landing', $cfg, 'QATESTREGLOGICA15');
wabot_conv_transcript($c, 'cliente', 'Doy clases de yoga');
foreach (['Quiero vender cursos grabados y que los alumnos accedan con usuario desde la web.', 'Cuánto sale?'] as $m) {
    wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
    clasifica(['otro']);
    $txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
    wabot_conv_transcript($c, 'bot', $txt);
    caso('cambio a cursos conserva su alternativa y ambos precios: ' . mb_substr($m, 0, 24), ($c['upgrade_pendiente']['tipo'] ?? '') === 'elearning'
        && strpos($txt, '$190.000') !== false && strpos($txt, '$30.000') !== false && $c['tipo'] === 'landing', $txt);
}
$m = 'Sí, quiero la demo con los cursos'; wabot_conv_transcript($c, 'cliente', $m); $c['ultimo_cliente_ts'] = time();
$txt = implode("\n", wabot_salida_preparar(wabot_responder($m, $c, $cfg), $c, $cfg) ?? []);
caso('acepta los cursos con la cotización correcta', $c['tipo'] === 'elearning'
    && $c['precio_cotizado'] === '$190.000' && $c['mensualidad_cotizada'] === '$30.000' && tiene_form([$txt]), $txt);
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
caso('el sitio profesional incluye panel sin hablar de cargar productos, y usa el plan con cambios de su tipo (20-sep)',
    mb_stripos($incluyeSitio, 'producto') === false && mb_stripos($incluyeSitio, 'un panel para editar') !== false && mb_stripos($incluyeSitio, '$25.000 por mes') !== false
    && mb_stripos($incluyeSitio, '{cambios_mes}') === false, $incluyeSitio);
caso('a la tienda sí', mb_stripos(wabot_texto_info('que_incluye', $cfg, ['tipo' => 'ecommerce']), '10 productos') !== false);
caso('sin tipo, el general, con los planes con cambios de lista',
    wabot_texto_info('que_incluye', $cfg, ['tipo' => null]) === str_replace('{cambios_mes}', '$25.000 por mes en sitio profesional y $35.000 en tienda online, plataforma de cursos o inmobiliaria', $cfg['info']['que_incluye']),
    wabot_texto_info('que_incluye', $cfg, ['tipo' => null]));
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
// El handoff pendiente lo pone el precio (el chat figura para Pablo desde ahí,
// 18-sep); lo que se mira acá es que las dudas no deriven solas.
caso('tres dudas seguidas después del precio no derivan', !$derivo && ($c['fase'] ?? '') !== 'derivado');
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

echo "— 14. Condiciones del 16-sep: mantenimiento, suscripción sin cambios y plan con cambios —\n";

foreach (['landing' => ['$20.000', '$25.000', '$10.000'], 'ecommerce' => ['$30.000', '$35.000', '$15.000'],
          'elearning' => ['$30.000', '$35.000', '$15.000'], 'inmobiliaria' => ['$30.000', '$35.000', '$15.000']] as $t => $m) {
    $vT = wabot_precio_vigente(null, $cfg, $t);
    caso("$t: suscripción {$m[0]}, plan con cambios {$m[1]} y mantenimiento {$m[2]}",
        $vT['mensualidad'] === $m[0] && $vT['mensualidad_cambios'] === $m[1] && $vT['mantenimiento'] === $m[2]);
}
$cViejo = array_merge(conv_nueva('5491177770140TEST'), ['tipo' => 'ecommerce', 'precio_dado' => true,
    'precio_cotizado' => '$290.000', 'sena_cotizada' => '$60.000', 'mensualidad_cotizada' => '$30.000', 'precio_modelo' => 'doble']);
caso('una charla cotizada con $30.000 por mes conserva su mensualidad (19-sep: la congelada se respeta)',
    wabot_precio_vigente($cViejo, $cfg)['mensualidad'] === '$30.000');
$cViejoL = array_merge(conv_nueva('5491177770141TEST'), ['tipo' => 'landing', 'precio_dado' => true,
    'precio_cotizado' => '$180.000', 'mensualidad_cotizada' => '$20.000', 'precio_modelo' => 'doble']);
caso('y la de $20.000 del sitio profesional también', wabot_precio_vigente($cViejoL, $cfg)['mensualidad'] === '$20.000');
$cBarata = array_merge(conv_nueva('5491177770143TEST'), ['tipo' => 'ecommerce', 'precio_dado' => true,
    'precio_cotizado' => '$190.000', 'sena_cotizada' => '$60.000', 'mensualidad_cotizada' => '$25.000', 'precio_modelo' => 'anual']);
caso('la cotizada del 16 al 19-sep con $25.000 los conserva: el plan mensual volvió a $30.000 para los nuevos',
    wabot_precio_vigente($cBarata, $cfg)['mensualidad'] === '$25.000' && wabot_precio_vigente(null, $cfg, 'ecommerce')['mensualidad'] === '$30.000');

$cT = conv_cotizada('ecommerce', $cfg, '5491177770142TEST');
foreach (['El mensual incluye cambios?', 'Y si después quiero hacer cambios en la web?', 'los cambios se pagan aparte?',
          'el mantenimiento incluye modificaciones?'] as $p) {
    $rC = wabot_respuesta_pago_fija($p, $cT, $cfg);
    caso("\"$p\" → el plan con cambios de su tipo",
        is_array($rC) && strpos($rC[0], '$35.000 por mes') !== false && mb_stripos($rC[0], 'un cambio por mes') !== false
        && strpos($rC[0], '{') === false, json_encode($rC, JSON_UNESCAPED_UNICODE));
}
foreach (['cuantos cambios puedo pedir?', 'quiero cambiar el color de la demo', 'me puedo pasar al mensual despues?',
          'quiero hacer cambios'] as $p) {
    caso("\"$p\" no es la pregunta del plan con cambios", !wabot_texto_pregunta_cambios_plan($p, $cT));
}
caso('en postdemo los cambios son sobre la demo, no el plan',
    !wabot_texto_pregunta_cambios_plan('los cambios se pagan aparte?', ['fase' => 'postdemo']));
$rSin = wabot_texto_cambios_plan(['tipo' => null], $cfg);
$rCambiosSitio = wabot_texto_cambios_plan(['tipo' => 'landing'], $cfg);
caso('el sitio profesional también permite cambiar textos e imágenes desde el panel (20-sep)',
    mb_stripos($rCambiosSitio, 'desde tu panel') !== false && strpos($rCambiosSitio, 'le sumamos un panel') === false, $rCambiosSitio);
$sitio = ['tipo' => 'landing', 'precio_dado' => true];
foreach (['carga', 'manual', 'que_incluye'] as $clavePanel) {
    $tPanel = wabot_texto_info($clavePanel, $cfg, $sitio);
    caso("$clavePanel del sitio profesional: el panel está incluido (20-sep)",
        mb_stripos($tPanel, 'panel') !== false && strpos($tPanel, 'pasa a $25.000 por mes') === false
        && strpos($tPanel, '{') === false, $tPanel);
}
caso('la tienda sigue con su panel', mb_stripos(wabot_texto_info('carga', $cfg, ['tipo' => 'ecommerce']), 'panel de administración') !== false);
foreach (['puedo cambiar yo los textos de la web?', 'la web la manejo yo?', 'los textos los cambio yo?'] as $pPanel) {
    caso("\"$pPanel\" → carga", wabot_info_por_palabras($pPanel, 'derivado') === 'carga', (string)wabot_info_por_palabras($pPanel, 'derivado'));
}
caso('a la tienda sí', mb_stripos((string)wabot_texto_cambios_plan($cT, $cfg), 'desde tu panel') !== false);
caso('sin tipo, los dos planes con cambios de lista',
    strpos($rSin, '$25.000 por mes en sitio profesional y $35.000 en tienda online') !== false, $rSin);

$hostT = wabot_texto_hosting($cT, $cfg, 'y despues del primer año cuanto sale el hosting?');
caso('después del primer año: no hay renovación aparte, va incluida en los planes (19-sep)',
    mb_stripos($hostT, 'No hay renovación aparte') !== false && strpos($hostT, '$50.000') === false && strpos($hostT, '{') === false, $hostT);
$rT = wabot_pitch('ecommerce', $cT, $cfg);
caso('el turno del precio dice los dos planes con sus montos y lo que incluyen (19-sep)',
    mb_stripos($rT[0], '• Plan anual: $190.000 por año') !== false
    && mb_stripos($rT[0], '• Plan mensual: $30.000 por mes') !== false && mb_stripos($rT[0], 'Ambos incluyen todo:') !== false, $rT[0]);
$todos = json_encode(wabot_textos_default(), JSON_UNESCAPED_UNICODE);
/* "En tu caso podemos hacer…" volvió a estar permitido (Pablo, 18-sep: "Para
 * lo que me contás, te armamos…" o "En tu caso podemos hacer…"). */
caso('ningún texto dice "servicio mensual", "abono mensual", "Lo mejor para" ni "te podemos ofrecer"',
    !preg_match('/servicio mensual|abono mensual|lo mejor para|te podemos ofrecer/iu', $todos));
caso('ningún texto promete un cambio por mes incluido en la suscripción ni los $10.000 por cambio extra',
    mb_stripos($todos, 'Con el servicio mensual, además, un cambio por mes') === false && mb_stripos($todos, '$10.000 más por mes') === false);

foreach (glob(WABOT_DATA . '/conv/54911777700*TEST.json') ?: [] as $f) @unlink($f);
foreach (glob(WABOT_DATA . '/conv/54911777701*TEST.json') ?: [] as $f) @unlink($f);
foreach (['997FPTEST', '996FPTEST', '998FPTEST', 'QATESTREG11SEP', 'QATESTREGLOGICA15'] as $k) @unlink(WABOT_DATA . '/conv/' . $k . '.json');
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

todo_ok();
