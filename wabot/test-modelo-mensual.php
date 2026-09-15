<?php
/**
 * wabot/test-modelo-mensual.php — el modelo comercial del 10-sep-2026 (solo CLI).
 *
 * Pablo cambió el modelo: se terminó el pago único. Cada web tiene un PRIMER
 * PAGO ($40.000 el sitio profesional, $50.000 el resto) y un PLAN MENSUAL
 * obligatorio ($15.000 / $25.000) que arranca a los 7 días. Esta suite fija
 * lo que el cambio tiene que garantizar:
 *  1. La lista nueva y la config vieja de producción, que converge sola.
 *  2. El turno del precio: dos mensajes, el segundo son los tres pasos sin link.
 *  3. El link del formulario sale recién con el sí del cliente.
 *  4. El precio se congela en la charla y no cambia si cambia la lista.
 *  5. Las charlas cotizadas antes del 10-sep conservan su pago único.
 *  6. Los guards no tiran las respuestas correctas del modelo nuevo.
 *  7. Ningún texto sale con {precio} o {mensualidad} crudos.
 *  8. Los 12 meses (eran 18 hasta el 11-sep) se dicen solo si preguntan.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

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

function clasifica($acciones, $extra = []) {
    $GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () use ($acciones, $extra) {
        return array_merge(['acciones' => (array)$acciones, 'info_keys' => [], 'descripcion' => null, 'colores' => null], $extra);
    };
}

function conv_mm($tel) {
    return ['tel' => $tel, 'channel_user_id' => $tel, 'canal' => 'whatsapp', 'conversation_key' => $tel,
        'fase' => 'nuevo', 'tipo' => null, 'descripcion' => null, 'colores' => null, 'msgs' => [],
        'ultimo_ts' => 0, 'transcript' => [], 'espera_avisada' => false, 'no_texto_avisado' => false,
        'bot_off' => false, 'pausado_hasta' => 0, 'lead_creado' => false];
}

echo "— 1. La lista de precios del modelo nuevo —\n";

foreach (['landing' => ['$180.000', '$20.000'], 'ecommerce' => ['$290.000', '$30.000'],
          'elearning' => ['$290.000', '$30.000'], 'inmobiliaria' => ['$240.000', '$30.000']] as $t => $par) {
    caso("$t: pago único {$par[0]} y servicio mensual {$par[1]}",
        ($cfg['tipos'][$t]['precio'] ?? '') === $par[0] && ($cfg['tipos'][$t]['mensualidad'] ?? '') === $par[1]);
    caso("$t: con su seña y sin montos de cuota guardados",
        trim((string)($cfg['tipos'][$t]['sena'] ?? '')) !== '' && empty($cfg['tipos'][$t]['cuotas']) && empty($cfg['tipos'][$t]['pagos3']));
    caso("$t: guarda su pago único de antes, para las charlas viejas",
        wabot_monto_a_numero((string)($cfg['tipos'][$t]['precio_anterior'] ?? '')) >= 100000);
}
caso('turnos e institucional, variantes del sitio profesional, van con el plan de $20.000',
    $cfg['tipos']['turnos']['mensualidad'] === '$20.000' && $cfg['tipos']['institucional']['mensualidad'] === '$20.000');
caso('el control del panel no encuentra ningún texto del modelo viejo',
    wabot_textos_problemas($cfg) === [], json_encode(wabot_textos_problemas($cfg), JSON_UNESCAPED_UNICODE));

echo "— 2. Una config vieja de producción converge sola, por contenido —\n";

$prod = wabot_config_load();
$prod['tipos']['landing']['precio'] = '$180.000';
unset($prod['tipos']['landing']['mensualidad'], $prod['tipos']['landing']['precio_anterior']);
$prod['tipos']['landing']['sena'] = '$40.000';
$prod['tipos']['ecommerce']['precio'] = '$290.000';
unset($prod['tipos']['ecommerce']['mensualidad'], $prod['tipos']['ecommerce']['precio_anterior']);
$prod['tipos']['ecommerce']['cuotas'] = ['12' => '$36.494'];
$prod['info']['mantenimiento'] = 'El mantenimiento es opcional e incluye un cambio por mes. Sale {precio} por mes: {link}';
$prod['info']['proceso'] = 'Primero la demo gratis. Si te gusta, se abona una seña y el resto con la web terminada.';
$prod['info']['pago'] = 'El desarrollo completo es {precio}. Para arrancar se deja una seña de {sena} y el saldo al entregar la web.';
$prod['info']['hosting'] = 'Hosting y dominio están incluidos en el precio, con el primer año cubierto.';
$prod['info']['titularidad'] = 'El dominio se puede registrar directamente a tu nombre, así queda tuyo desde el primer día.';
$prod['caro'] = 'Es pago único, sin costos mensuales de plataforma: la web queda a tu nombre y es a medida.';
$prod['plataformas'] = 'Esas plataformas son un alquiler mensual que aumenta. Lo nuestro es pago único.';
$prod['hosting_renovacion'] = 'Después del primer año se renuevan: ronda los $50.000 anuales.';
$prod['muestra_presentar_seguimiento'] = 'Cuando puedas mirala y contame qué te pareció.';
$prod['presentados_archivar_horas'] = 168;
$prod['msg_precio_variantes'] = ["Te conviene {desc}. El desarrollo completo tiene un valor de {precio}.\nDetalle: {link}"];
unset($prod['info']['confianza']);   // en la config real de producción la clave no existe (11-sep)
wabot_config_migrar($prod);

caso('un pago único de seis cifras se respeta (15-sep)',
    $prod['tipos']['landing']['precio'] === '$180.000' && $prod['tipos']['ecommerce']['precio'] === '$290.000');
caso('y el de antes queda guardado',
    $prod['tipos']['landing']['precio_anterior'] === '$180.000' && $prod['tipos']['ecommerce']['precio_anterior'] === '$290.000');
caso('aparece la mensualidad',
    $prod['tipos']['landing']['mensualidad'] === '$20.000' && $prod['tipos']['ecommerce']['mensualidad'] === '$30.000');
caso('la seña queda y las cuotas se van', ($prod['tipos']['landing']['sena'] ?? '') === '$40.000' && empty($prod['tipos']['ecommerce']['cuotas']));
foreach (['mantenimiento', 'proceso', 'pago', 'hosting', 'titularidad'] as $k) {
    caso("info.$k deja de hablar del modelo viejo",
        !preg_match('/primer pago|(?<!no )es opcional|queda tuyo desde|No es un mantenimiento aparte|No hay un pago inicial aparte/iu', (string)$prod['info'][$k])
        && $prod['info'][$k] === $cfg['info'][$k], (string)$prod['info'][$k]);
}
caso('"es caro" converge al argumento nuevo', $prod['caro'] === $cfg['caro'] && strpos($prod['caro'], '{mensualidad}') !== false);
caso('la comparación con plataformas converge', $prod['plataformas'] === $cfg['plataformas']);
caso('la renovación del hosting pasa a hablar del pago único (15-sep)', mb_stripos($prod['hosting_renovacion'], 'Con el pago único') === 0);
caso('la presentación de la demo avisa los 5 días', mb_stripos($prod['muestra_presentar_seguimiento'], '5 días') !== false);
caso('y el archivado del panel pasa a 5 días', (float)$prod['presentados_archivar_horas'] === 120.0);
caso('todas las variantes del precio nombran la mensualidad',
    count(array_filter($prod['msg_precio_variantes'], function ($v) { return strpos($v, '{mensualidad}') !== false; }))
    === count($prod['msg_precio_variantes']));
caso('el segundo mensaje del precio lo fija el código', $prod['msg_tres_pasos'] === wabot_tres_pasos_default());
caso('info.confianza, que en producción faltaba, sale con las dos formas y el portfolio',
    strpos($prod['info']['confianza'], 'elegís cómo contratarla') !== false && strpos($prod['info']['confianza'], 'gokywebs.com/portfolio') !== false, $prod['info']['confianza']);

/* La migración corre en cada carga y el panel guarda lo migrado: si un segundo
 * pase cambia algo, los textos de producción cambian solos la próxima vez que
 * Pablo guarda cualquier cosa. Con la config real del 11-sep pasaba con las
 * variantes del precio (línea del link) y con info.confianza (/portfolio). */
$segunda = $prod;
wabot_config_migrar($segunda);
$cambian = array_keys(array_filter($segunda, function ($v, $k) use ($prod) { return ($prod[$k] ?? null) !== $v; }, ARRAY_FILTER_USE_BOTH));
caso('una segunda carga no cambia nada: la config converge en un solo pase', !$cambian, implode(', ', $cambian));

$prodPanel = wabot_config_load();
$prodPanel['tipos']['landing']['mensualidad'] = '$35.000';
$prodPanel['tipos']['landing']['precio'] = '$65.000';
wabot_config_migrar($prodPanel);
caso('la mensualidad que Pablo edite desde el panel se respeta, y un precio de menos de seis cifras vuelve al pago único de lista (15-sep)',
    $prodPanel['tipos']['landing']['mensualidad'] === '$35.000' && $prodPanel['tipos']['landing']['precio'] === '$180.000',
    $prodPanel['tipos']['landing']['precio'] . ' / ' . $prodPanel['tipos']['landing']['mensualidad']);

echo "— 3. El turno del precio: dos mensajes, los tres pasos sin link —\n";

$c = conv_mm('5491177770001TEST');
$r = wabot_pitch('landing', $c, $cfg);
caso('son dos mensajes: la oferta y, aparte, los tres pasos (14-sep)', count($r) === 2);
caso('arranca con la oferta y abajo lo que incluye y las dos formas, sin link (15-sep)',
    preg_match('/^Para \{rubro\} podemos hacer .+\.\n\nIncluye:\n•/u', $r[0]) === 1 && strpos($r[0], '1. Pago único de $180.000: la web queda paga y listo.') !== false
    && strpos($r[0], '2. Servicio mensual de $20.000, sin pago inicial') !== false && strpos($r[0], 'presupuestos/') === false, $r[0]);
caso('el segundo mensaje son los tres pasos, textuales con los dos montos resueltos, y la pregunta de la demo (14-sep)',
    ($r[1] ?? '') === str_replace(['{precio}', '{mensualidad}'], ['$40.000', '$15.000'], wabot_tres_pasos_default()) . "\n" . wabot_tres_pasos_pregunta(), $r[1] ?? '');
caso('con el plazo de la demo que pidió Pablo', mb_stripos($r[1] ?? '', 'menos de 24 horas') !== false);
caso('y sin el link del formulario', strpos($r[0], 'gokywebs.com/form/') === false);
caso('el precio queda congelado en la charla: pago único, seña y mensual',
    ($c['precio_cotizado'] ?? '') === '$180.000' && ($c['sena_cotizada'] ?? '') === '$40.000' && ($c['mensualidad_cotizada'] ?? '') === '$20.000'
    && ($c['precio_modelo'] ?? '') === 'doble');
caso('el link todavía no se marcó como enviado', empty($c['link_form_enviado']));
caso('el segundo mensaje, el de los pasos, sale 2 segundos después del precio (Pablo, 14-sep)',
    count($r) === 2 && mb_stripos($r[1], 'demo') !== false && wabot_demora_tipeo($r[1], $cfg) === 2.0
    && wabot_demora_tipeo($r[1], array_merge($cfg, ['demora_entre_mensajes' => 3])) === 2.0);

echo "— 4. El link del formulario sale con el sí —\n";

foreach (['dale', 'si, quiero la demo', 'ok', 'me interesa'] as $i => $si) {
    $c = conv_mm('549117777002' . $i . 'TEST');
    clasifica(['rubro_landing']);
    wabot_engine('soy abogado', $c, $cfg);
    clasifica(['otro']);
    $r = wabot_engine($si, $c, $cfg);
    caso("\"$si\" después de los tres pasos recibe el formulario",
        strpos(implode(' ', $r), 'gokywebs.com/form/') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
}
$c = conv_mm('5491177770030TEST');
clasifica(['rubro_landing']); wabot_engine('soy abogado', $c, $cfg);
clasifica(['otro']);          wabot_engine('dale', $c, $cfg);
clasifica(['otro']);          $r = wabot_engine('gracias', $c, $cfg);
caso('una vez mandado, el acuse siguiente no lo repite', strpos(implode(' ', $r), 'gokywebs.com/form/') === false);

$c = conv_mm('5491177770031TEST');
wabot_pitch('ecommerce', $c, $cfg);
$r = wabot_agente_intento('dale, quiero la demo gratis', $c, $cfg);
caso('en modo agente, pedir la demo con todas las letras trae el formulario sin pasar por el modelo',
    is_array($r) && strpos(implode(' ', $r), 'gokywebs.com/form/') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_mm('5491177770033TEST');
wabot_pitch('landing', $c, $cfg);
$r = wabot_agente_intento('dale', $c, $cfg);
caso('en modo agente, un "dale" pelado a los tres pasos también trae el formulario, sin el modelo',
    is_array($r) && strpos(implode(' ', $r), 'gokywebs.com/form/') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_mm('5491177770034TEST');
wabot_pitch('landing', $c, $cfg);
$r = wabot_agente_intento('dale, cuánto tarda la demo?', $c, $cfg);
caso('pero una pregunta no cuenta como sí: no se le manda el formulario en lugar de contestarle',
    !is_array($r) || strpos(implode(' ', $r), 'gokywebs.com/form/') === false, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_mm('5491177770032TEST'); $c['demo_pedida_entrada'] = true;
$r = wabot_precio('landing', $c, $cfg);
caso('quien pidió la demo al entrar recibe precio con los tres pasos y, atrás, el formulario',
    count($r) === 3
    && mb_strpos($r[1], str_replace(['{precio}', '{mensualidad}'], ['$40.000', '$15.000'], wabot_tres_pasos_default())) === 0
    && strpos($r[2] ?? '', 'gokywebs.com/form/') !== false,
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 5. El precio congelado no cambia si cambia la lista —\n";

$c = conv_mm('5491177770040TEST');
wabot_pitch('ecommerce', $c, $cfg);
$cfgSube = $cfg;
$cfgSube['tipos']['ecommerce']['precio'] = '$95.000';
$cfgSube['tipos']['ecommerce']['mensualidad'] = '$33.000';
$res = wabot_precio_resumen($c, $cfgSube);
caso('el resumen repite el precio que se le dio, no el de la lista nueva',
    strpos($res, '$30.000') !== false && strpos($res, '$30.000') !== false && strpos($res, '$95.000') === false, $res);
caso('lo mismo la respuesta de pago',
    strpos(wabot_texto_pago($c, $cfgSube), '$30.000') !== false && strpos(wabot_texto_pago($c, $cfgSube), '$33.000') === false);
caso('y la del plan mensual', strpos(wabot_texto_mantenimiento($c, $cfgSube), '$30.000') !== false);
caso('un cliente nuevo sí recibe la lista nueva',
    strpos(wabot_msg_precio_texto('ecommerce', $cfgSube, conv_mm('5491177770041TEST')), '$33.000') !== false);
$cR = $c; $cR['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('el reset de sesión libera el precio congelado', empty($cR['precio_cotizado']) && empty($cR['mensualidad_cotizada']));

echo "— 6. La charla cotizada antes del 10-sep conserva su pago único —\n";

$v = array_merge(conv_mm('5491177770050TEST'), ['tipo' => 'ecommerce', 'precio_dado' => true, 'fase' => 'prediseno',
    'cta_muestra' => true, 'ultimo_ts' => time() - 86400,
    'transcript' => [['q' => 'bot', 't' => 'Perfecto, para las velas sería un ecommerce. Es un pago único de $290.000.', 'ts' => time() - 86400]]]);
wabot_precio_sembrar($v, $cfg);
caso('se le siembra el precio que el bot le dijo',
    ($v['precio_cotizado'] ?? '') === '$290.000' && ($v['precio_modelo'] ?? '') === 'unico');
$res = wabot_precio_resumen($v, $cfg);
caso('el resumen repite SU total', strpos($res, '$290.000') !== false && stripos($res, 'plan mensual') === false, $res);
caso('la respuesta de pago mantiene las condiciones de entonces', strpos(wabot_texto_pago($v, $cfg), '$290.000') !== false);
caso('el mantenimiento sigue siendo opcional para él', stripos(wabot_texto_mantenimiento($v, $cfg), 'opcional') !== false);
caso('y "es caro" recibe el argumento que se le dio', stripos(wabot_texto_caro($v, $cfg), 'pago único') !== false);
$v2 = array_merge(conv_mm('5491177770051TEST'), ['tipo' => 'landing', 'precio_dado' => true]);
caso('sin el monto en el transcript, vale el último precio de lista viejo',
    wabot_precio_vigente($v2, $cfg)['precio'] === '$180.000' && wabot_precio_vigente($v2, $cfg)['modelo'] === 'unico');

echo "— 7. Los guards no tiran las respuestas correctas del modelo nuevo —\n";

foreach ([
    'El primer pago de $50.000 se puede hacer en 12 cuotas; el plan es $15.000 por mes.',
    'Se puede en hasta 12 cuotas y $25.000 por mes.',
    'Primer pago $50.000 (hasta 12 cuotas con interés) + $25.000/mes.',
    'El primer pago de $90000 en 12 cuotas con tarjeta.',
] as $bien) {
    caso("no es un monto de cuota: \"$bien\"", wabot_texto_dice_monto_de_cuota($bien) === false);
}
foreach (['12 cuotas de $8.500', 'cada cuota queda en $7.000', 'te queda en $7.500 por cuota', '12 x $7.500', 'la cuota sale $8.000'] as $mal) {
    caso("sí es un monto de cuota: \"$mal\"", wabot_texto_dice_monto_de_cuota($mal) === true);
}
caso('una mensualidad dicha de memoria, con monto, se corta',
    wabot_texto_inventa_pago('El plan mensual es de $25.000 por mes.', []) === true);
caso('pero si la trajo una herramienta en el mismo turno, pasa',
    wabot_texto_inventa_pago('El plan mensual es de $15.000 por mes.', ['El plan mensual de $15.000 arranca a los 7 días.']) === false);
caso('nombrar el plan sin monto no se corta',
    wabot_texto_inventa_pago('El plan mensual incluye el hosting y el dominio.', []) === false);
caso('un porcentaje sigue sin salir nunca',
    wabot_texto_inventa_pago('El primer pago es el 50% y el resto después.', ['El primer pago es de $50.000']) === true);

$cObl = ['transcript' => [['q' => 'bot', 't' => wabot_texto_mantenimiento(['tipo' => 'landing'], $cfg), 'ts' => time()]]];
caso('"es obligatorio?" después del plan: no, es una de las dos formas (15-sep)',
    ($ro = wabot_respuesta_obligatorio($cObl, $cfg, 'es obligatorio?')) !== null
    && mb_strpos($ro, 'No: el servicio mensual es una de las dos formas') === 0 && mb_stripos($ro, 'una sola vez') !== false);

echo "— 8. Ningún texto sale con un marcador crudo ni con el modelo viejo —\n";

$cLanding = conv_mm('5491177770060TEST');
wabot_pitch('landing', $cLanding, $cfg);
$cCopia = $cLanding;
$sinTipo = conv_mm('5491177770061TEST');
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
] as $nombre => $texto) {
    caso("$nombre: sin marcadores crudos ni modelo viejo",
        trim($texto) !== '' && strpos($texto, '{') === false && !preg_match('/primer pago|No es un mantenimiento aparte|No hay un pago inicial aparte/iu', $texto),
        $texto);
}

echo "— 9. Los 12 meses se dicen solo si preguntan (eran 18 hasta el 11-sep) —\n";

$salenSolos = [$cfg['tipos']['landing']['precio_ideal'], $cfg['msg_precio'], $cfg['caro'], $cfg['plataformas'],
    $cfg['info']['que_incluye'], $cfg['info']['mantenimiento'], $cfg['info']['pago'], $cfg['info']['baja_del_plan'],
    wabot_tres_pasos_default(), $cfg['muestra_presentar_seguimiento'], $cfg['prediseno_link']];
caso('ningún texto que sale solo nombra los 12 meses',
    count(array_filter($salenSolos, function ($t) { return mb_stripos((string)$t, '12 meses') !== false; })) === 0);
caso('solo las respuestas de titularidad y del código, que salen si preguntan',
    mb_stripos($cfg['info']['titularidad'], '12 meses') !== false && mb_stripos($cfg['info']['entrega_codigo'], '12 meses') !== false);
caso('a los 12 meses puede reclamar el código y la propiedad', mb_stripos($cfg['info']['titularidad'], 'reclamar el código y la propiedad') !== false);
caso('y los 18 meses ya no aparecen en ningún texto', mb_stripos(json_encode($cfg, JSON_UNESCAPED_UNICODE), '18 meses') === false);
caso('"y si dejo de pagar?" tiene su clave y su texto',
    wabot_info_clave_del_enum('baja_del_plan') && trim((string)$cfg['info']['baja_del_plan']) !== '');
caso('y dice que no hay permanencia y que la web se desactiva',
    mb_stripos($cfg['info']['baja_del_plan'], 'permanencia') !== false && mb_stripos($cfg['info']['baja_del_plan'], 'desactiva') !== false);

echo "— 10. El prompt del agente habla del modelo nuevo —\n";

$sis = wabot_agente_sistema(conv_mm('5491177770070TEST'), $cfg);
caso('explica el servicio mensual sin pago inicial (14-sep)', mb_stripos($sis, 'SERVICIO MENSUAL') !== false && mb_stripos($sis, 'NO hay pago inicial') !== false);
caso('prohíbe decir que el servicio mensual es obligatorio (15-sep)', mb_stripos($sis, 'Nunca digas que el servicio mensual es obligatorio') !== false);
caso('ya no afirma que el mantenimiento es opcional', mb_stripos($sis, 'El mantenimiento es opcional') === false);
caso('ni que existe la seña', mb_stripos($sis, 'La seña NUNCA es un porcentaje') === false);
caso('los 12 meses, solo si pregunta', mb_stripos($sis, 'a los 12 meses de plan') !== false && mb_stripos($sis, 'SOLO si pregunta de quién es la web') !== false);
caso('y el prompt ya no dice 18 meses', mb_stripos($sis, '18 meses') === false);
caso('la demo queda disponible 5 días', mb_stripos($sis, 'disponible 5 días') !== false);

echo "— 11. El paso 2 del formulario llega al brief del boceto —\n";

$cL = array_merge(conv_mm('5491177770080TEST'), ['tipo' => 'landing', 'precio_dado' => true,
    'precio_cotizado' => '$40.000', 'mensualidad_cotizada' => '$15.000', 'precio_modelo' => 'mensual',
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
    preg_match('/^Pago único \$[\d.]+ \(seña \$[\d.]+\) o \$[\d.]+ por mes$/u', (string)$val('presupuesto_cotizado')) === 1, (string)$val('presupuesto_cotizado'));
$cL['estilo'] = 'No lo sé';
$campos2 = wabot_lead_campos($cL, $cfg, false);
$objetivo2 = (string)reset($campos2['objetivo_web']);
caso('"No lo sé" no ensucia el brief', mb_stripos($objetivo2, 'No lo sé') === false, $objetivo2);
$cR2 = array_merge($cL, ['ultimo_ts' => time() - 30 * 86400]);
wabot_conv_reset_si_vieja($cR2, $cfg, time());
caso('el reset de sesión limpia el estilo y lo que quería incluir', empty($cR2['estilo']) && empty($cR2['incluir']));

echo "— 12. El que no quiere el plan todos los meses, o quiere pagar una sola vez (Pablo, 14-sep) —\n";

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

$cU = array_merge(conv_mm('5491177770090TEST'), ['tipo' => 'ecommerce', 'precio_dado' => true,
    'precio_cotizado' => '$50.000', 'mensualidad_cotizada' => '$25.000', 'precio_modelo' => 'mensual']);
$u = wabot_texto_info('un_solo_pago', $cfg, $cU);
caso('la tienda en un pago único sale $290.000, con su seña y hosting y dominio el primer año (15-sep)',
    strpos($u, '$290.000') !== false && strpos($u, 'seña de $60.000') !== false
    && mb_stripos($u, 'hosting y el dominio el primer año') !== false, $u);
caso('y lo dice como pago único (15-sep)', mb_stripos($u, 'pago único') !== false);
$cU['tipo'] = 'landing';
caso('el sitio profesional en un pago único sale $180.000', strpos(wabot_texto_info('un_solo_pago', $cfg, $cU), '$180.000') !== false);
$uSin = wabot_texto_info('un_solo_pago', $cfg);
caso('sin tipo cotizado no da montos: pregunta a qué se dedica (15-sep)',
    strpos($uSin, '$') === false && mb_stripos($uSin, 'Contame a qué te dedicás') !== false, $uSin);
$cU['tipo'] = 'inmobiliaria';
caso('la inmobiliaria en un pago único sale $240.000', strpos(wabot_texto_info('un_solo_pago', $cfg, $cU), '$240.000') !== false);
$cU['tipo'] = 'elearning';
$uCursos = wabot_texto_info('un_solo_pago', $cfg, $cU);
caso('y la plataforma de cursos, $290.000', strpos($uCursos, '$290.000') !== false, $uCursos);
caso('las dos claves están en consultar_info', wabot_info_clave_del_enum('plan_es_servicio') && wabot_info_clave_del_enum('un_solo_pago'));

$cA = array_merge(conv_mm('5491177770091TEST'), ['fase' => 'prediseno', 'tipo' => 'ecommerce', 'precio_dado' => true,
    'cta_muestra' => true, 'precio_cotizado' => '$50.000', 'mensualidad_cotizada' => '$25.000', 'precio_modelo' => 'mensual']);
$rA = wabot_agente_intento($realUnaVez, $cA, $cfg);
$sA = is_array($rA) ? wabot_salida_preparar($rA, $cA, $cfg) : [];
caso('el caso real por el agente: el pago único de $290.000, no el detalle del plan',
    count($sA) === 1 && strpos($sA[0], '$290.000') !== false && mb_stripos($sA[0], 'no es opcional') === false,
    json_encode($sA, JSON_UNESCAPED_UNICODE));
$rB = wabot_agente_intento($realRechazo, $cA, $cfg);
$sB = is_array($rB) ? wabot_salida_preparar($rB, $cA, $cfg) : [];
caso('y el que no lo cree necesario todos los meses: le ofrece el pago único',
    count($sB) === 1 && mb_stripos($sB[0], 'te conviene el pago único') !== false && strpos($sB[0], '$10.000') === false,
    json_encode($sB, JSON_UNESCAPED_UNICODE));

echo "— 13. Tienda + cursos se cotiza, no se deriva (Pablo, 14-sep) —\n";

$msgTaller = "Tengo un taller donde se dictan clases de artesanias\n.. velas\n. Yeso ceramico..m macrame... etc...\nEs para hacer una página online para ve der.insumos.. y mas adelante cargar cursos online tambien";

// Por el motor: el clasificador dice productos_y_cursos.
$cTM = conv_mm('5491177770095TEST');
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

// Por el agente: el modelo pide derivar → se le frena; cotiza con con_cursos.
$cTA = conv_mm('5491177770096TEST');
wabot_conv_transcript($cTA, 'cliente', $msgTaller);
$rDer = wabot_agente_ejecutar('derivar', ['causa' => 'productos_y_cursos', 'motivo' => 'vende insumos y cursos'], $cTA, $cfg, $msgTaller);
caso('el agente no puede derivar tienda + cursos: se le pide cotizar', isset($rDer['error'])
    && stripos($rDer['nota'] ?? '', 'con_cursos') !== false && empty($cTA['handoff_pendiente']));
$rDP = wabot_agente_ejecutar('dar_precio', ['tipo' => 'ecommerce', 'con_cursos' => true, 'rubro' => 'tu taller de artesanías',
    'para_que' => 'vendas tus insumos online y más adelante cargues tus cursos'], $cTA, $cfg, $msgTaller);
$todoDP = (string)($rDP['texto'] ?? '') . "\n" . implode("\n", (array)($rDP['aparte'] ?? []));
caso('dar_precio con con_cursos: tienda con plataforma de cursos, al precio de la tienda',
    !empty($cTA['combo_cursos']) && ($cTA['tipo'] ?? '') === 'ecommerce'
    && strpos($todoDP, 'Plataforma de cursos en módulos') !== false
    && strpos($todoDP, '$30.000') !== false && strpos($todoDP, '$30.000') !== false, $todoDP);
caso('el resumen del precio no manda link de presupuesto (14-sep)',
    strpos(wabot_precio_resumen($cTA, $cfg), 'presupuestos/') === false);
caso('y el boceto dice que es tienda + cursos',
    mb_stripos((string)reset(wabot_lead_campos($cTA, $cfg, false)['tipoDetectadoLabel']), 'cursos') !== false);

// Si el modelo se olvida del argumento, el contexto alcanza.
$cTO = conv_mm('5491177770097TEST');
wabot_conv_transcript($cTO, 'cliente', $msgTaller);
wabot_agente_ejecutar('dar_precio', ['tipo' => 'ecommerce', 'rubro' => 'tu taller de artesanías', 'para_que' => 'vendas tus insumos online'], $cTO, $cfg, $msgTaller);
caso('sin con_cursos pero con productos y cursos en la charla, igual va el combinado', !empty($cTO['combo_cursos']));

// El atajo del agente: el caso real se cotiza sin pasar por el modelo.
$cTX = conv_mm('5491177770099TEST');
$cTX['fase'] = 'menu';
wabot_conv_transcript($cTX, 'cliente', $msgTaller);
$rTX = wabot_agente_intento($msgTaller, $cTX, $cfg);
$sTX = is_array($rTX) ? wabot_salida_preparar($rTX, $cTX, $cfg) : [];
caso('el caso real por el agente: precio del combinado y los tres pasos, sin derivar ni el texto de la carga',
    count($sTX) === 2 && !empty($cTX['combo_cursos']) && empty($cTX['handoff_pendiente'])
    && strpos($sTX[0], 'Plataforma de cursos en módulos') !== false && mb_strpos($sTX[1], 'El primer paso es gratis') === 0
    && mb_stripos(implode("\n", $sTX), 'Todas nuestras webs traen un panel') === false, json_encode($sTX, JSON_UNESCAPED_UNICODE));

// Una tienda sola sigue siendo tienda sola.
$cTS = conv_mm('5491177770098TEST');
wabot_conv_transcript($cTS, 'cliente', 'Tengo una tienda de ropa y quiero vender online');
$rTS = wabot_agente_ejecutar('dar_precio', ['tipo' => 'ecommerce', 'rubro' => 'tu tienda de ropa', 'para_que' => 'vendas tu ropa online'], $cTS, $cfg, 'Tengo una tienda de ropa y quiero vender online');
caso('una tienda sin cursos se cotiza como tienda sola', empty($cTS['combo_cursos'])
    && strpos((string)($rTS['texto'] ?? ''), 'Pago único de $290.000') !== false
    && strpos((string)($rTS['texto'] ?? ''), 'Plataforma de cursos en módulos') === false);

foreach (glob(WABOT_DATA . '/conv/54911777700*TEST.json') ?: [] as $f) @unlink($f);
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

echo $fallas === 0 ? "\nTODO OK — $total casos\n" : "\nFALLAS: $fallas de $total\n";
exit($fallas === 0 ? 0 : 1);
