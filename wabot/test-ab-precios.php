<?php
/**
 * Prueba A/B de precios (Pablo, 31-oct-2026; ab-precios.php):
 *   A2 (desde el 2-nov): plan anual o plan mensual, con los textos de antes
 *      del 26-oct; el pago único solo si lo pide.
 *   B: pago inicial ($100.000 tienda / $80.000 sitio) sin seña, y la
 *      mensualidad desde el mes siguiente; el pago único solo si lo pide.
 *   A (31-oct al 2-nov, cerrado): pago único o plan mensual, sin plan anual,
 *      para las charlas que ya lo recibieron.
 *
 * GPT se simula con WABOT_TEST_OPENAI_HTTP (no gasta créditos), como en
 * test-comercial.php. Uso: php wabot/test-ab-precios.php
 */
$GLOBALS['WABOT_TEST_SIN_AB'] = false;
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;
// 3-nov: la prueba quedó apagada en textos.php; acá se prende para seguir probando la maquinaria de los grupos.
$cfg['ab_precios']['activo'] = true;

$tmp = sys_get_temp_dir() . '/wabot-test-ab-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';

function dc(array $d = []) {
    $base = ['accion' => 'responder', 'solucion' => 'sin_definir', 'intencion' => 'ninguna', 'pago_unico' => false, 'mensajes' => [],
             'info_claves' => [], 'motivo' => null,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null,
                         'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) $d['ficha'] = array_merge($base['ficha'], $d['ficha']);
    return array_merge($base, $d);
}
/** Lo que contesta GPT, en orden; el revisor aprueba y la bienvenida da el rubro por dicho. */
function oa(array $cola) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        $tarea = (string)($payload['prompt_cache_key'] ?? '');
        $ok = function ($datos) {
            return [200, json_encode(['id' => 'r', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($datos, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 100, 'output_tokens' => 10, 'total_tokens' => 110]], JSON_UNESCAPED_UNICODE)];
        };
        if (str_ends_with($tarea, 'comercial_revisor') || str_ends_with($tarea, 'comercial_revisor_sombra')) return $ok(['ok' => true, 'problemas' => [], 'falta_contestar' => []]);
        if (str_ends_with($tarea, 'bienvenida_rubro')) return $ok(['ya_dice_rubro' => true]);
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        return $sig === null ? [0, ''] : $ok($sig);
    };
}
function prompt_ultimo() { $p = end($GLOBALS['OA_PEDIDOS']); return is_array($p) ? json_encode($p, JSON_UNESCAPED_UNICODE) : ''; }
/** Una charla nueva: el último dígito del teléfono decide el grupo (par A2, impar B). */
function charla($tel) { return conv_nueva($tel . 'TEST', ['nombre' => 'Marta']); }
function cotizar_charla(&$c, $solucion, $texto = 'Vendo zapatillas') {
    global $cfg;
    oa([dc(['accion' => 'cotizar', 'solucion' => $solucion, 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas desde la web.'],
            'ficha' => ['rubro' => 'zapatillas', 'que_vende' => 'zapatillas']])]);
    return turno($texto, $c, $cfg);
}
function junto($r) { return implode("\n---\n", (array)$r); }

echo "— 1. Grupo por teléfono —\n";
caso('par = A2, impar = B (el A ya no recibe charlas nuevas)', wabot_ab_grupo_por_id(['tel' => '5491140000002']) === 'a2' && wabot_ab_grupo_por_id(['tel' => '5491140000007']) === 'b');
caso('siempre el mismo para la misma persona', wabot_ab_grupo_por_id(['tel' => '5491140000007']) === wabot_ab_grupo_por_id(['tel' => '5491140000007']));
caso('una charla con precio de antes de la prueba no entra en ningún grupo',
    wabot_ab_grupo(['tel' => '5491140000007', 'comercial_cotizacion' => ['plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000']], $cfg) === ''
    && wabot_ab_grupo(['tel' => '5491140000007', 'precio_dado' => true], $cfg) === '');
caso('lo congelado manda sobre el teléfono', wabot_ab_grupo(['tel' => '5491140000002', 'comercial_cotizacion' => ['modelo' => 'b', 'mensual' => '$30.000', 'inicial' => '$100.000']], $cfg) === 'b');
caso('una charla que ya cotizó en el A sigue en el A', wabot_ab_grupo(['tel' => '5491140000002', 'ab_grupo' => 'a', 'comercial_cotizacion' => ['modelo' => 'a', 'mensual' => '$30.000', 'unico' => '$330.000', 'anual' => '']], $cfg) === 'a');
caso('sin anual: A y B sí, A2 no', wabot_ab_sin_anual(['tel' => '5491140000007'], $cfg) && !wabot_ab_sin_anual(['tel' => '5491140000002'], $cfg)
    && wabot_ab_sin_anual(['tel' => '5491140000002', 'ab_grupo' => 'a'], $cfg));
$apagada = $cfg; $apagada['ab_precios']['activo'] = false;
caso('con la prueba apagada todos van al A2 (anual o mensual)', wabot_ab_grupo(['tel' => '5491140000007'], $apagada) === 'a2');

echo "— 2. Modelo B: tienda —\n";
$b = charla('5491100009001');
$r = cotizar_charla($b, 'tienda');
$t = junto($r);
caso('sale el texto de Pablo con $100.000 y $30.000', strpos($t, "Para tu tienda online, el desarrollo completo tiene un precio inicial de \$100.000\n\nLuego del primer mes abonás \$30.000 mensuales, que incluyen hosting, dominio, mantenimiento y soporte") !== false, $t);
caso('sin anual, sin pago único y sin seña', mb_stripos($t, 'anual') === false && mb_stripos($t, 'pago único') === false && mb_stripos($t, 'seña') === false, $t);
caso('y la oferta de la demo', strpos($t, 'demo gratis') !== false);
$cot = $b['comercial_cotizacion'] ?? [];
caso('congela modelo B con pago inicial y mensual', ($cot['modelo'] ?? '') === 'b' && ($cot['inicial'] ?? '') === '$100.000' && ($cot['mensual'] ?? '') === '$30.000' && ($cot['anual'] ?? 'x') === '', json_encode($cot));
caso('la charla queda en el grupo B, con el pago inicial como primer pago', ($b['ab_grupo'] ?? '') === 'b' && ($b['precio_cotizado'] ?? '') === '$100.000'
    && ($b['inicial_cotizado'] ?? '') === '$100.000' && ($b['precio_modelo'] ?? '') === 'inicial' && !empty($b['ab_grupo_ts']));
$p = prompt_ultimo();
caso('GPT lee que hay una sola modalidad y que no hay anual', strpos($p, 'Hay UNA sola modalidad') !== false && strpos($p, 'Las dos modalidades de cada plan son anual') === false);
caso('la respuesta oficial de suspensión existe solo en B', strpos($p, '- suspension:') !== false);

oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['pago']])]);
$r = turno('Y cómo es el pago?', $b, $cfg);
caso('la respuesta oficial de pago dice el pago inicial y la mensualidad', strpos(junto($r), 'pago inicial de $100.000') !== false && strpos(junto($r), 'mensualidad de $30.000') !== false, junto($r));
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['titularidad']])]);
$r = turno('El código es mío?', $b, $cfg);
caso('titularidad: con el pago inicial no compra la web, al mes 12', strpos(junto($r), 'no estás comprando la web') !== false && strpos(junto($r), 'mes 12') !== false, junto($r));

oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda'])]);
$r = turno('Cuánto era el precio?', $b, $cfg);
caso('si pide el precio otra vez, el mismo bloque B', strpos(junto($r), 'precio inicial de $100.000') !== false && mb_stripos(junto($r), 'anual') === false, junto($r));

oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
$r = turno('Dale, el mensual', $b, $cfg);
// Desde el 2-nov el link del formulario va sin parámetros: la forma de pago la pregunta el bot antes del link de pago.
caso('"el mensual" en B es elegir el pago inicial + mensualidad y va el formulario, sin parámetros', strpos(junto($r), 'gokywebs.com/form/') !== false && strpos(junto($r), 'm=') === false, junto($r));
caso('queda anotada la modalidad inicial', ($b['modalidad_elegida'] ?? '') === 'inicial', (string)($b['modalidad_elegida'] ?? ''));

echo "— 3. Modelo B: sitio profesional —\n";
$bs = charla('5491100009003');
$r = cotizar_charla($bs, 'informativa', 'Soy contadora');
caso('sitio profesional: $80.000 y $20.000', strpos(junto($r), 'Para tu sitio profesional, el desarrollo completo tiene un precio inicial de $80.000') !== false && strpos(junto($r), '$20.000 mensuales') !== false, junto($r));

// «No tienen para pagar una sola vez?» en vivo (31-oct): salía «{precio_web_propia}» sin el monto.
$u = wabot_texto_info('un_solo_pago', wabot_ab_cfg($cfg, $bs), $bs);
caso('B: el pago único lo pide → dice el monto, sin la llave suelta', strpos($u, '{') === false && preg_match('/pago único, de \$[\d.]+, pagás/u', $u), $u);
// Nutricionista con turnos en vivo (2-nov): la web con reservas es tipo landing con el plan con panel, y el pago único salía de $240.000 (el del sitio).
foreach (['5491100009013' => 'b', '5491100009012' => 'a'] as $tel => $g) {
    $cr = charla($tel);
    if ($g === 'a') $cr['ab_grupo'] = 'a';
    cotizar_charla($cr, 'reservas', 'Soy nutricionista y quiero que reserven turnos desde la web');
    $cfgG = wabot_ab_cfg($cfg, $cr);
    $u = wabot_texto_info('un_solo_pago', $cfgG, $cr);
    $w = wabot_texto_info('web_propia', $cfgG, $cr);
    $vig = wabot_precio_vigente($cr, $cfgG);
    caso(strtoupper($g) . ': con reservas, el pago único que pide es el que vio ($330.000), no el del sitio profesional',
        ($cr['tipo'] ?? '') === 'landing' && strpos($u, '$330.000') !== false && strpos($w, '$330.000') !== false && strpos($u . $w, '$240.000') === false
        && $vig['precio_unico'] === '$330.000' && $vig['mensualidad'] === '$30.000', json_encode([$u, $vig], JSON_UNESCAPED_UNICODE));
}

echo "— 4. Modelo A (cerrado el 2-nov: solo las charlas que ya estaban) —\n";
$a = charla('5491100009002');
$a['ab_grupo'] = 'a';
$r = cotizar_charla($a, 'tienda');
$t = junto($r);
caso('pago único y plan mensual, numerados 1 y 2', strpos($t, '1) Pago único: $330.000') !== false && strpos($t, '2) Plan mensual: $30.000') !== false, $t);
caso('sin plan anual', mb_stripos($t, 'anual') === false, $t);
$cot = $a['comercial_cotizacion'] ?? [];
caso('congela modelo A sin anual', ($cot['modelo'] ?? '') === 'a' && ($cot['unico'] ?? '') === '$330.000' && ($cot['anual'] ?? 'x') === '' && ($a['ab_grupo'] ?? '') === 'a', json_encode($cot));
caso('GPT lee que el anual ya no existe', strpos(prompt_ultimo(), 'El plan anual YA NO EXISTE') !== false);
caso('el link del formulario va sin parámetros (2-nov)', strpos(wabot_form_link($a, $cfg), 'm=') === false, wabot_form_link($a, $cfg));
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['pago']])]);
$r = turno('Cómo se paga?', $a, $cfg);
caso('la respuesta de pago habla del pago único y el mensual, sin anual', strpos(junto($r), 'pago único de $330.000') !== false && mb_stripos(junto($r), 'anual') === false, junto($r));
$a2 = $a;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
$r = turno('la 2', $a2, $cfg);
caso('"la 2" en A es el plan mensual', ($a2['modalidad_elegida'] ?? '') === 'mensual' && strpos(junto($r), 'gokywebs.com/form/') !== false, (string)($a2['modalidad_elegida'] ?? ''));
$a3 = $a;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
turno('la 1', $a3, $cfg);
caso('"la 1" en A es el pago único', ($a3['modalidad_elegida'] ?? '') === 'propia');
caso('"voy con el anual" en A no elige nada (no existe)', wabot_comercial_elige_plan('voy con el anual', $a) === null);

echo "— 4b. Modelo A2 (desde el 2-nov): anual o mensual, como antes del 26-oct —\n";
$n = charla('5491100009004');
$r = cotizar_charla($n, 'tienda');
$t = junto($r);
caso('A2: el texto de Pablo del 3-nov, con el anual y el mensual', strpos($t, "Tenemos dos modalidades de pago para que elijas la que mejor se adapte a vos\n\n1. Plan anual: \$190.000\n2. Plan mensual: \$30.000\n\nLos dos planes incluyen todo:") !== false, $t);
caso('A2: sin pago único ni pago inicial', mb_stripos($t, 'pago único') === false && mb_stripos($t, 'inicial') === false, $t);
$cot = $n['comercial_cotizacion'] ?? [];
caso('A2: congela anual, mensual y el pago único de lista (por si lo pide)', ($cot['modelo'] ?? '') === 'a2' && ($cot['anual'] ?? '') === '$190.000' && ($cot['mensual'] ?? '') === '$30.000'
    && ($cot['unico'] ?? '') === '$330.000' && empty($cot['inicial']) && ($n['ab_grupo'] ?? '') === 'a2', json_encode($cot));
caso('A2: la charla queda como antes (precio anual, seña de siempre, modelo anual)', ($n['precio_cotizado'] ?? '') === '$190.000' && ($n['sena_cotizada'] ?? '') === '$60.000'
    && ($n['precio_modelo'] ?? '') === 'anual' && !empty($n['ab_grupo_ts']), json_encode([$n['precio_cotizado'] ?? null, $n['sena_cotizada'] ?? null, $n['precio_modelo'] ?? null]));
$p = prompt_ultimo();
caso('A2: GPT lee las dos modalidades de siempre (anual y mensual; el pago único, solo si lo pide)', strpos($p, 'Las dos modalidades de cada plan son anual') !== false
    && strpos($p, 'YA NO EXISTE') === false && strpos($p, 'UNA sola modalidad') === false);
caso('A2: el link del formulario va sin m= (anual o mensual)', strpos(wabot_form_link($n, $cfg), 'm=') === false, wabot_form_link($n, $cfg));
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['pago']])]);
$r = turno('Cómo se paga?', $n, $cfg);
caso('A2: la respuesta de pago es la de siempre (mensual o anual)', strpos(junto($r), 'anual de $190.000') !== false && strpos(junto($r), 'mensual de $30.000') !== false, junto($r));
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda'])]);
$r = turno('Me pasás el precio de nuevo?', $n, $cfg);
caso('A2: si pide el precio otra vez, el mismo bloque', strpos(junto($r), '1. Plan anual: $190.000') !== false && mb_stripos(junto($r), 'pago único') === false, junto($r));
$n1 = $n;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
turno('la 1', $n1, $cfg);
caso('A2: "la 1" es el plan anual', ($n1['modalidad_elegida'] ?? '') === 'unico', (string)($n1['modalidad_elegida'] ?? ''));
$n2 = $n;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
turno('la 2', $n2, $cfg);
caso('A2: "la 2" es el plan mensual', ($n2['modalidad_elegida'] ?? '') === 'mensual', (string)($n2['modalidad_elegida'] ?? ''));
caso('A2: "voy con el anual" elige el anual', wabot_comercial_elige_plan('voy con el anual', $n) === 'unico');
$ns = charla('5491100009006');
$r = cotizar_charla($ns, 'informativa', 'Soy contadora');
caso('A2: sitio profesional con $140.000 y $20.000', strpos(junto($r), "1. Plan anual: \$140.000\n2. Plan mensual: \$20.000") !== false && ($ns['ab_grupo'] ?? '') === 'a2', junto($r));
$np = charla('5491100009008');
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'pago_unico' => true, 'mensajes' => ['Perfecto, te podemos armar una tienda online.'],
        'ficha' => ['rubro' => 'zapatillas', 'que_vende' => 'zapatillas']])]);
$r = turno('Cuánto sale? Quiero que la web sea mía', $np, $cfg);
caso('A2: si pide comprar la web, el pago único va debajo de los dos planes (como antes)', strpos(junto($r), '2. Plan mensual: $30.000') !== false
    && strpos(junto($r), 'está el pago único: $330.000') !== false, junto($r));
$rr = wabot_ab_rr_categoria($n, $cfg);
caso('A2: en el panel, arriba el precio del grupo con el anual', is_array($rr) && strpos($rr['titulo'], 'grupo A2') !== false && strpos(implode("\n", $rr['items']), '1. Plan anual: $190.000') !== false,
    json_encode($rr, JSON_UNESCAPED_UNICODE));
caso('A2: el chip dice el grupo', wabot_ab_grupo_nombre('a2') === 'Grupo A2 · anual o mensual');

echo "— 5. Charla cotizada antes de la prueba —\n";
$v = charla('5491100009005');
$v['comercial_cotizacion'] = ['origen' => 'bot', 'plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000', 'ts' => time() - 86400];
$v['precio_dado'] = true; $v['comercial_solucion'] = 'tienda'; $v['comercial_oferta_ts'] = time() - 86000;
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda'])]);
$r = turno('Me pasás los precios de nuevo?', $v, $cfg);
caso('sigue con sus tres modalidades de siempre (con el anual)', strpos(junto($r), '2) Plan anual: $210.000') !== false && empty($v['ab_grupo']), junto($r));

echo "— 6. Dos webs y formulario —\n";
$d = charla('5491100009007');
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'segunda_solucion' => 'informativa', 'mensajes' => ['Perfecto.'], 'ficha' => ['rubro' => 'ropa', 'que_vende' => 'ropa']])]);
$r = turno('Quiero una tienda y otra web para mi estudio', $d, $cfg);
caso('dos webs durante la prueba: lo cotiza Pablo, en silencio', $r === [] && ($d['comercial_ultimo']['accion'] ?? '') === 'humano', json_encode($d['comercial_ultimo'] ?? null, JSON_UNESCAPED_UNICODE));
// 10-nov: con la prueba apagada todas las charlas nuevas son A2 (anual o mensual) y las dos webs las cotiza el bot con el descuento cargado.
$cfgSinPrueba = $cfg;
$cfgSinPrueba['ab_precios']['activo'] = false;
$d2 = charla('5491100009017');
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'segunda_solucion' => 'informativa', 'mensajes' => ['Perfecto.'], 'ficha' => ['rubro' => 'ropa', 'que_vende' => 'ropa']])]);
$r = turno('Quiero una tienda y otra web para mi estudio', $d2, $cfgSinPrueba);
caso('dos webs con la prueba apagada: las cotiza el bot, anual y mensual con el descuento', strpos(junto($r), 'Por las dos webs') !== false
    && strpos(junto($r), '$280.000') !== false && strpos(junto($r), '$40.000') !== false && ($d2['ab_grupo'] ?? '') === 'a2', junto($r));
$form = file_get_contents(__DIR__ . '/form-lead.php');
caso('form-lead acepta la modalidad inicial', strpos($form, "['unico', 'mensual', 'propia', 'inicial']") !== false);
$html = file_get_contents(__DIR__ . '/../form/index.html');
caso('el formulario ya no pregunta la forma de pago (2-nov): sin el selector ni lo de m=a / m=b', strpos($html, 'id="modalidad"') === false && strpos($html, 'm=a') === false
    && strpos((string)file_get_contents(__DIR__ . '/../form/script.js'), "get('m')") === false);foreach (['mensual20000' => 'anual140', 'unico240' => 'anual140', 'mensual30000' => 'anual190', 'unico330' => 'anual190'] as $pag => $anual) {
    $h = (string)@file_get_contents(__DIR__ . '/../pago/' . $pag . '/index.html');
    caso("pago/$pag: vuelve la pestaña Anual ($anual)", strpos($h, '<a href="../' . $anual . '/">Anual</a>') !== false);
}
foreach (['inicial100' => ['$100.000', '$30.000'], 'inicial80' => ['$80.000', '$20.000']] as $pag => [$ini, $men]) {
    $h = (string)@file_get_contents(__DIR__ . '/../pago/' . $pag . '/index.html');
    caso("pago/$pag: pago inicial $ini, mensualidad $men, titularidad al mes 12 y no compra la web",
        strpos($h, '<strong class="plan-price">' . $ini . '</strong>') !== false && strpos($h, $men) !== false
        && strpos($h, 'mes 12') !== false && strpos($h, 'no estás comprando la web') !== false && strpos($h, 'se suspende') !== false && mb_stripos($h, 'plan anual') === false);
}

echo "— 7. El precio que Pablo pasa a mano queda como el de la charla (2-nov, BLIZZ) —\n";
require_once __DIR__ . '/pagos.php';
$k = charla('5491100009011');
$k['tipo'] = 'landing'; $k['comercial_solucion'] = 'informativa'; $k['ab_grupo'] = 'b'; $k['precio_dado'] = true; $k['precio_modelo'] = 'inicial';
$k['comercial_cotizacion'] = ['origen' => 'bot', 'plan' => 'informativa', 'anual' => '', 'mensual' => '$20.000', 'unico' => '$240.000', 'modelo' => 'b', 'inicial' => '$80.000', 'ts' => time() - 3600];
$k['precio_cotizado'] = '$80.000'; $k['inicial_cotizado'] = '$80.000'; $k['mensualidad_cotizada'] = '$20.000'; $k['sena_cotizada'] = '$80.000';
$textoPablo = "Perfecto! Podemos incluir las dos opciones en tu web:\n\nPara este tipo de web, el desarrollo completo cuesta $100.000 iniciales, sin saldo pendiente.\n\nA partir del segundo mes abonás $30.000 mensuales, que incluyen hosting, dominio, mantenimiento y soporte técnico.";
caso('«$100.000 iniciales … $30.000 mensuales» de Pablo reemplaza lo que había congelado el bot', wabot_comercial_cotizacion_de_pablo($k, $textoPablo, $cfg)
    && ($k['comercial_cotizacion']['inicial'] ?? '') === '$100.000' && ($k['comercial_cotizacion']['mensual'] ?? '') === '$30.000'
    && ($k['comercial_cotizacion']['plan'] ?? '') === 'panel' && ($k['comercial_cotizacion']['modelo'] ?? '') === 'b' && !empty($k['landing_con_panel']),
    json_encode($k['comercial_cotizacion'] ?? null, JSON_UNESCAPED_UNICODE));
$k['modalidad_elegida'] = 'mensual';
$pagoK = wabot_comercial_postdemo_pago($k, $cfg);
caso('…y el link de pago es el de $100.000 (pago/inicial100), no el de $80.000', strpos((string)($pagoK['t'] ?? ''), 'gokywebs.com/pago/inicial100') !== false, (string)($pagoK['t'] ?? ''));
caso('…y «Confirmar pago» propone el pago inicial de $100.000', wabot_pagos_modalidad_de_conv($k) === 'inicial'
    && (int)(wabot_pagos_montos_esperados($k, $cfg)['inicial'] ?? 0) === 100000, json_encode(wabot_pagos_montos_esperados($k, $cfg)));
caso('el mismo mensaje otra vez no cambia nada', !wabot_comercial_cotizacion_de_pablo($k, $textoPablo, $cfg));
$n2 = charla('5491100009014');
$n2['comercial_cotizacion'] = ['origen' => 'bot', 'plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000', 'modelo' => 'a2', 'ts' => time() - 3600];
caso('un precio de anual y mensual a mano queda, en su grupo (A2)', wabot_comercial_cotizacion_de_pablo($n2, "Podés elegir entre dos planes:\n\n1) Plan anual: $140.000\n2) Plan mensual: $20.000", $cfg)
    && ($n2['comercial_cotizacion']['anual'] ?? '') === '$140.000' && ($n2['comercial_cotizacion']['plan'] ?? '') === 'informativa' && ($n2['comercial_cotizacion']['modelo'] ?? '') === 'a2');
caso('un mensaje sin precio completo no toca nada', !wabot_comercial_cotizacion_de_pablo($n2, 'Son $30.000 por mes, te paso el link?', $cfg)
    && !wabot_comercial_cotizacion_de_pablo($n2, 'Te paso el enlace donde están todos los detalles del servicio y los datos para el pago. Para arrancar son $60.000 y el resto ($150.000) al final', $cfg));
todo_ok();
