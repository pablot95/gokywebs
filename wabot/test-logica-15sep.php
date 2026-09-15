<?php
/** Regresiones: actividad conocida, cotizaciones y separación de modalidades. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/agente.php';
$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$cfg = wabot_config_load();
$total = 0; $fallas = 0;
function verificar15($nombre, $ok, $detalle = '') {
    global $total, $fallas;
    $total++;
    if (!$ok) $fallas++;
    echo ($ok ? 'OK ' : 'FALLO ') . $nombre . (!$ok && $detalle !== '' ? ' :: ' . $detalle : '') . "\n";
}
function charla15($mensajes = []) {
    $c = wabot_conv_load('QATESTREGLOGICA15');
    $c['transcript'] = []; $c['msgs'] = []; $c['fase'] = 'nuevo';
    foreach ($mensajes as $m) wabot_conv_transcript($c, 'cliente', $m);
    return $c;
}
function texto15($r, &$c, $cfg) {
    return implode("\n", wabot_salida_preparar($r, $c, $cfg) ?? []);
}
foreach (['Soy electricista, cuánto sale la web?' => 'landing',
          'Tengo una inmobiliaria, qué precio tiene?' => 'inmobiliaria',
          'Vendo ropa para bebés, cuánto sale una tienda con carrito?' => 'ecommerce'] as $m => $tipo) {
    $c = charla15([$m]);
    $txt = texto15(wabot_agente_intento($m, $c, $cfg), $c, $cfg);
    $v = wabot_precio_vigente($c, $cfg, $tipo);
    verificar15('rubro y precio en un turno: ' . $tipo, $c['tipo'] === $tipo && !empty($c['precio_dado']), $txt);
    verificar15('dos alternativas completas: ' . $tipo, strpos($txt, $v['precio']) !== false && strpos($txt, $v['mensualidad']) !== false && strpos($txt, 'sin pago inicial') !== false, $txt);
    verificar15('sin repregunta ni marcadores: ' . $tipo, !preg_match('/a qu[eé] te dedic|\{\w+\}/iu', $txt), $txt);
}
foreach (['Cuánto sale una web?', 'Cuánto sale una web para mostrar mis servicios y cuánto una tienda online?'] as $m) {
    $c = charla15([$m]); $txt = texto15(wabot_agente_intento($m, $c, $cfg), $c, $cfg);
    verificar15('sin actividad no inventa precio: ' . $m, empty($c['precio_dado']) && strpos($txt, '$') === false && strpos($txt, 'primero contame') !== false, $txt);
}
$m = 'Soy taxidermista y quiero mostrar mis trabajos y recibir consultas.';
$c = charla15([$m, 'Cuánto sale?']);
verificar15('la actividad poco común se conserva', wabot_rubro_desde_contexto($c) !== '');
verificar15('no repregunta actividad poco común', wabot_agente_repite_pregunta_contestada('Primero contame a qué te dedicás', $c));
foreach (['rangos', 'precio_sin_rubro'] as $clave) {
    $r = wabot_agente_ejecutar('consultar_info', ['clave' => $clave], $c, $cfg, 'Cuánto sale?');
    verificar15('la herramienta exige usar la actividad existente: ' . $clave, !empty($r['error']) && empty($r['texto']), json_encode($r, JSON_UNESCAPED_UNICODE));
}
foreach (['landing', 'ecommerce', 'elearning', 'inmobiliaria'] as $tipo) {
    $c = charla15(); $c['tipo'] = $tipo; $c['precio_dado'] = true; $c['cta_muestra'] = true; $c['fase'] = 'prediseno';
    wabot_precio_congelar($c, $tipo, $cfg); $v = wabot_precio_vigente($c, $cfg);
    foreach (['rangos', 'precio_sin_rubro'] as $clave) {
        $r = wabot_agente_ejecutar('consultar_info', ['clave' => $clave], $c, $cfg, 'Cuál era el precio?');
        $txt = $r['texto'] ?? '';
        verificar15("$tipo / $clave conserva ambos montos", strpos($txt, $v['precio']) !== false && strpos($txt, $v['mensualidad']) !== false && strpos($txt, $v['sena']) !== false && !empty($r['exacta']), $txt);
        verificar15("$tipo / $clave: el motor tampoco repregunta", wabot_texto_info($clave, $cfg, $c) === wabot_precio_resumen($c, $cfg));
    }
    verificar15("$tipo: el tipo confirmado impide pedir rubro aunque el historial se recorte", wabot_agente_repite_pregunta_contestada('Para qué sería la web?', $c));
    $otraLista = $cfg; $otraLista['tipos'][$tipo]['precio'] = '$999.000'; $otraLista['tipos'][$tipo]['mensualidad'] = '$99.000';
    verificar15("$tipo: no cambia una cotización ya dada", wabot_precio_vigente($c, $otraLista) === $v);
    $txt = implode(' ', wabot_respuesta_pago_fija('La mensualidad es de ' . $v['sena'] . '?', $c, $cfg) ?? []);
    verificar15("$tipo: seña no es mensualidad", strpos($txt, $v['mensualidad']) !== false && strpos($txt, 'seña') !== false, $txt);
}
$c = charla15(); $c['rubro_pitch'] = 'tu taller de taxidermia';
verificar15('rubro validado persiste aunque no esté en la lista local', wabot_agente_repite_pregunta_contestada('A qué rubro te dedicás?', $c));
foreach (['agente', 'fijo'] as $modo) {
    $config = $cfg; $config['modo_redaccion'] = $modo;
    $c = charla15(); $c['tipo'] = 'ecommerce'; $c['precio_dado'] = true; $c['cta_muestra'] = true; $c['fase'] = 'prediseno';
    wabot_precio_congelar($c, 'ecommerce', $cfg);
    $m = 'Y con el pago único después qué tengo que seguir pagando?';
    wabot_conv_transcript($c, 'cliente', $m);
    $txt = texto15(wabot_responder($m, $c, $config), $c, $config);
    verificar15("$modo: después del pago único responde renovación, no demo", strpos($txt, 'una vez al año') !== false
        && strpos($txt, 'segundo año') !== false && strpos($txt, 'demo') === false, $txt);
    $m = 'Los 30 mil son la seña?'; wabot_conv_transcript($c, 'cliente', $m);
    $txt = texto15(wabot_responder($m, $c, $config), $c, $config);
    verificar15("$modo: niega explícitamente confundir mensualidad con seña", strpos($txt, 'No:') === 0
        && strpos($txt, '$30.000') !== false && strpos($txt, '$60.000') !== false, $txt);
    $m = 'Si elijo el pago único, cuánto pongo para empezar y cuánto al entregar?'; wabot_conv_transcript($c, 'cliente', $m);
    $txt = texto15(wabot_responder($m, $c, $config), $c, $config);
    verificar15("$modo: informa seña y saldo de la modalidad consultada", strpos($txt, '$60.000') !== false
        && strpos($txt, '$230.000') !== false && strpos($txt, '$290.000') !== false, $txt);
    $c = charla15(['Doy clases de yoga']); $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['cta_muestra'] = true; $c['fase'] = 'prediseno';
    wabot_precio_congelar($c, 'landing', $cfg);
    foreach (['Quiero vender cursos grabados y que los alumnos accedan con usuario desde la web.', 'Cuánto sale?'] as $m) {
        wabot_conv_transcript($c, 'cliente', $m);
        $txt = texto15(wabot_responder($m, $c, $config), $c, $config);
        wabot_conv_transcript($c, 'bot', $txt);
        verificar15("$modo: cambio a cursos conserva su alternativa y ambos precios", ($c['upgrade_pendiente']['tipo'] ?? '') === 'elearning'
            && strpos($txt, '$290.000') !== false && strpos($txt, '$30.000') !== false && $c['tipo'] === 'landing', $txt);
    }
    $m = 'Sí, quiero la demo con los cursos'; wabot_conv_transcript($c, 'cliente', $m);
    $txt = texto15(wabot_responder($m, $c, $config), $c, $config);
    verificar15("$modo: acepta los cursos con la cotización correcta", $c['tipo'] === 'elearning'
        && $c['precio_cotizado'] === '$290.000' && $c['mensualidad_cotizada'] === '$30.000'
        && strpos($txt, 'gokywebs.com/form/') !== false, $txt);
}
echo "\n" . ($fallas ? "FALLAS: $fallas" : 'TODO OK') . " — $total casos\n";
exit($fallas ? 1 : 0);
