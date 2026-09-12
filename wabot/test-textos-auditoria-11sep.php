<?php
/** Regresiones de redacción y contexto aprobadas después de la auditoría. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/agente.php';
$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$total = 0; $fallas = 0;
function caso($nombre, $ok) {
    global $total, $fallas; $total++;
    if (!$ok) $fallas++;
    echo ($ok ? 'OK ' : 'FALLO ') . $nombre . "\n";
}
function charla_textos() {
    global $cfg;
    $c = wabot_conv_load('QATESTTEXTOS11SEP');
    $c['tipo'] = 'landing'; $c['fase'] = 'prediseno';
    $c['precio_dado'] = true; $c['cta_muestra'] = true;
    wabot_precio_congelar($c, 'landing', $cfg);
    wabot_conv_transcript($c, 'bot', 'Querés que preparemos la demo para tu negocio?');
    wabot_conv_transcript($c, 'cliente', 'Se pueden reservar turnos online?');
    return $c;
}

foreach (["Querés que te preparemos la demo gratis para ver cómo quedaría?",
    'Te gustaría que armemos la muestra?', 'Te parece que avancemos con la demo?'] as $cta) {
    $c = charla_textos();
    $r = wabot_salida_preparar(["Los turnos online están incluidos.\n\n$cta"], $c, $cfg);
    caso("responde sin repetir: $cta", implode(' ', $r) === 'Los turnos online están incluidos.');
}
$c = charla_textos();
$r = wabot_salida_preparar(['Los turnos online están incluidos.', 'Querés que te preparemos la demo gratis?'], $c, $cfg);
caso('tampoco repite la invitación en otro globo', $r === ['Los turnos online están incluidos.']);
$c = charla_textos(); $c['transcript'] = [];
$primera = 'Los turnos online están incluidos. Querés que preparemos la demo para tu negocio?';
caso('conserva la primera oferta', wabot_salida_sin_cta_repetida([$primera], $c) === [$primera]);
$c = charla_textos();
foreach (['La demo es gratis. El primer pago es de $40.000 y el plan de $20.000 por mes.',
    'La demo es gratis. Qué colores te gustan?', 'Querés que la demo use el color azul o verde?',
    "Completá el formulario cortito:\nhttps://gokywebs.com/form/?c=TEST"] as $texto) {
    caso('conserva información o pregunta necesaria: ' . $texto, wabot_salida_sin_cta_repetida([$texto], $c) === [$texto]);
}
wabot_conv_transcript($c, 'cliente', 'Sí, quiero la demo');
$r = wabot_salida_preparar(wabot_responder('Sí, quiero la demo', $c, $cfg), $c, $cfg);
caso('aceptar después de consultar entrega el formulario', strpos(implode(' ', $r ?? []), 'gokywebs.com/form/') !== false);
caso('el formulario ya no promete un minuto', strpos(implode(' ', $r ?? []), 'formulario cortito') !== false
    && strpos(implode(' ', $r ?? []), 'minuto') === false);

foreach (['tu alquiler de sonido e iluminación', 'tu servicio de alquiler de sonido e iluminación'] as $rubro) {
    $c = charla_textos(); wabot_conv_transcript($c, 'cliente', 'Alquilamos sonido e iluminación para eventos');
    caso('rubro de alquiler natural: ' . $rubro, wabot_rubro_valido($rubro, $c) === 'tu servicio de alquiler de sonido e iluminación');
}
$c = charla_textos();
caso('no inventa alquiler para una psicóloga', wabot_rubro_valido('tu servicio de alquiler de sonido e iluminación', $c) === '');

foreach (['agente', 'fijo'] as $modo) {
    $conf = $cfg; $conf['modo_redaccion'] = $modo;
    $c = charla_textos(); $c['fase'] = 'postdemo'; $c['presentado_ts'] = time(); $c['lead_creado'] = true;
    $c['cambios_pedidos'] = 'Fondo beige';
    $p = 'Me encantó, quedó muy linda'; wabot_conv_transcript($c, 'cliente', $p);
    $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
    caso("$modo recuerda los cambios al recibir un elogio", strpos(implode(' ', $r ?? []), 'ya quedaron anotados') !== false
        && empty($c['handoff_pendiente']) && $c['cambios_pedidos'] === 'Fondo beige');
    $c['postdemo_pregunto_cambios'] = false; $c['cambios_pedidos'] = '';
    caso("$modo no inventa cambios", strpos(wabot_postdemo_texto_elogio($c, $conf), 'anotados') === false);
    foreach (['Cómo hago el primer pago?', 'Cuánto es el primer pago?', 'Cómo te pago?'] as $p) {
        $c = charla_textos(); $c['fase'] = 'postdemo'; $c['presentado_ts'] = time(); $c['lead_creado'] = true;
        wabot_conv_transcript($c, 'cliente', $p);
        $r = wabot_salida_preparar(wabot_responder($p, $c, $conf), $c, $conf);
        caso("$modo aclara el motivo del contacto: $p", strpos(implode(' ', $r ?? []), 'para coordinar el primer pago y los cambios') !== false
            && !empty($c['handoff_pendiente']));
    }
}
$c = charla_textos(); $c['fase'] = 'postdemo'; $c['presentado_ts'] = time();
$r = wabot_postdemo_responder('Listo, quiero avanzar con la web', $c, $cfg);
caso('avance general usa aviso general', in_array($cfg['postdemo_derivar'], $r ?? [], true));
caso('cobros de sus compradores no se confunden con nuestro primer pago',
    !wabot_postdemo_pregunta_como_pagar('Mis clientes pueden hacer un primer pago y después pagar el resto?'));

$previa = $cfg;
$previa['info']['que_incluye'] = str_replace('Nos ocupamos del armado y de lo técnico.', 'No tenés que ocuparte de nada.', $previa['info']['que_incluye']);
$previa['prediseno_completo'] = 'Listo {nombre}, con eso ya lo preparamos. Para que la demo sea tuya de verdad y no una genérica, mandame {imagenes}. Con eso te la dejo lista {entrega}.';
$previa['prediseno_completo_solo_logo'] = 'Perfecto {nombre}, el logo ya lo tengo. Mandame {imagenes} y con eso te la dejo lista {entrega}.';
$previa['postdemo_derivar'] = 'Para seguir con el proyecto te va a escribir el desarrollador desde otro número.';
wabot_config_migrar($previa);
caso('también migra los textos guardados', $previa === $cfg);
$otra = $previa; wabot_config_migrar($otra);
caso('la migración no oscila entre versiones', $otra === $previa);
foreach ([0, 1] as $imagenes) {
    $c = charla_textos(); $c['imagenes_recibidas'] = $imagenes;
    if ($imagenes) $c['transcript'][] = ['q' => 'cliente', 't' => '[foto] Mandó el logo de su marca',
        'ts' => time(), 'media' => ['clase' => 'imagen', 'archivo' => 'logo-test.jpg']];
    $r = wabot_texto_prediseno_completo($c, $cfg);
    caso("las fotos son opcionales con $imagenes imágenes previas", strpos($r, 'podemos empezar igual') !== false
        && strpos($r, 'para personalizarla') !== false && strpos($r, '{imagenes}') === false);
}
echo "\n" . ($fallas ? "FALLAS: $fallas" : 'TODO OK') . " — $total casos\n";
exit($fallas ? 1 : 0);
