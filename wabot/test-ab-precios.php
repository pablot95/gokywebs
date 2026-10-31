<?php
/**
 * Prueba A/B de precios (Pablo, 31-oct-2026; ab-precios.php):
 *   A: pago único o plan mensual, sin plan anual.
 *   B: pago inicial ($100.000 tienda / $80.000 sitio) sin seña, y la
 *      mensualidad desde el mes siguiente; el pago único solo si lo pide.
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
/** Una charla nueva: el último dígito del teléfono decide el grupo (par A, impar B). */
function charla($tel) { return conv_nueva($tel . 'TEST', ['nombre' => 'Marta']); }
function cotizar_charla(&$c, $solucion, $texto = 'Vendo zapatillas') {
    global $cfg;
    oa([dc(['accion' => 'cotizar', 'solucion' => $solucion, 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas desde la web.'],
            'ficha' => ['rubro' => 'zapatillas', 'que_vende' => 'zapatillas']])]);
    return turno($texto, $c, $cfg);
}
function junto($r) { return implode("\n---\n", (array)$r); }

echo "— 1. Grupo por teléfono —\n";
caso('par = A, impar = B', wabot_ab_grupo_por_id(['tel' => '5491140000002']) === 'a' && wabot_ab_grupo_por_id(['tel' => '5491140000007']) === 'b');
caso('siempre el mismo para la misma persona', wabot_ab_grupo_por_id(['tel' => '5491140000007']) === wabot_ab_grupo_por_id(['tel' => '5491140000007']));
caso('una charla con precio de antes de la prueba no entra en ningún grupo',
    wabot_ab_grupo(['tel' => '5491140000007', 'comercial_cotizacion' => ['plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000']], $cfg) === ''
    && wabot_ab_grupo(['tel' => '5491140000007', 'precio_dado' => true], $cfg) === '');
caso('lo congelado manda sobre el teléfono', wabot_ab_grupo(['tel' => '5491140000002', 'comercial_cotizacion' => ['modelo' => 'b', 'mensual' => '$30.000', 'inicial' => '$100.000']], $cfg) === 'b');
$apagada = $cfg; $apagada['ab_precios']['activo'] = false;
caso('con la prueba apagada todos van al A (sin anual)', wabot_ab_grupo(['tel' => '5491140000007'], $apagada) === 'a');

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
caso('"el mensual" en B es elegir el pago inicial + mensualidad y va el formulario con &m=b', strpos(junto($r), 'gokywebs.com/form/?c=') !== false && strpos(junto($r), '&m=b') !== false, junto($r));
caso('queda anotada la modalidad inicial', ($b['modalidad_elegida'] ?? '') === 'inicial', (string)($b['modalidad_elegida'] ?? ''));

echo "— 3. Modelo B: sitio profesional —\n";
$bs = charla('5491100009003');
$r = cotizar_charla($bs, 'informativa', 'Soy contadora');
caso('sitio profesional: $80.000 y $20.000', strpos(junto($r), 'Para tu sitio profesional, el desarrollo completo tiene un precio inicial de $80.000') !== false && strpos(junto($r), '$20.000 mensuales') !== false, junto($r));

echo "— 4. Modelo A —\n";
$a = charla('5491100009002');
$r = cotizar_charla($a, 'tienda');
$t = junto($r);
caso('pago único y plan mensual, numerados 1 y 2', strpos($t, '1) Pago único: $330.000') !== false && strpos($t, '2) Plan mensual: $30.000') !== false, $t);
caso('sin plan anual', mb_stripos($t, 'anual') === false, $t);
$cot = $a['comercial_cotizacion'] ?? [];
caso('congela modelo A sin anual', ($cot['modelo'] ?? '') === 'a' && ($cot['unico'] ?? '') === '$330.000' && ($cot['anual'] ?? 'x') === '' && ($a['ab_grupo'] ?? '') === 'a', json_encode($cot));
caso('GPT lee que el anual ya no existe', strpos(prompt_ultimo(), 'El plan anual YA NO EXISTE') !== false);
caso('el link del formulario no lleva &m=b', strpos(wabot_form_link($a, $cfg), '&m=') === false);
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['pago']])]);
$r = turno('Cómo se paga?', $a, $cfg);
caso('la respuesta de pago habla del pago único y el mensual, sin anual', strpos(junto($r), 'pago único de $330.000') !== false && mb_stripos(junto($r), 'anual') === false, junto($r));
$a2 = $a;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
$r = turno('la 2', $a2, $cfg);
caso('"la 2" en A es el plan mensual', ($a2['modalidad_elegida'] ?? '') === 'mensual' && strpos(junto($r), 'gokywebs.com/form/?c=') !== false, (string)($a2['modalidad_elegida'] ?? ''));
$a3 = $a;
oa([dc(['accion' => 'responder', 'solucion' => 'tienda'])]);
turno('la 1', $a3, $cfg);
caso('"la 1" en A es el pago único', ($a3['modalidad_elegida'] ?? '') === 'propia');
caso('"voy con el anual" en A no elige nada (no existe)', wabot_comercial_elige_plan('voy con el anual', $a) === null);

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
$form = file_get_contents(__DIR__ . '/form-lead.php');
caso('form-lead acepta la modalidad inicial', strpos($form, "['unico', 'mensual', 'propia', 'inicial']") !== false);
$html = file_get_contents(__DIR__ . '/../form/index.html');
caso('el formulario ya no ofrece el plan anual', strpos($html, 'value="unico"') === false && strpos($html, 'value="propia"') !== false && strpos($html, 'value="mensual"') !== false);
foreach (['inicial100' => ['$100.000', '$30.000'], 'inicial80' => ['$80.000', '$20.000']] as $pag => [$ini, $men]) {
    $h = (string)@file_get_contents(__DIR__ . '/../pago/' . $pag . '/index.html');
    caso("pago/$pag: pago inicial $ini, mensualidad $men, titularidad al mes 12 y no compra la web",
        strpos($h, '<strong class="plan-price">' . $ini . '</strong>') !== false && strpos($h, $men) !== false
        && strpos($h, 'mes 12') !== false && strpos($h, 'no estás comprando la web') !== false && strpos($h, 'se suspende') !== false && mb_stripos($h, 'plan anual') === false);
}

todo_ok();
