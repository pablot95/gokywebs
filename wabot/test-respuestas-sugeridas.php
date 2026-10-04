<?php
/**
 * wabot/test-respuestas-sugeridas.php — las 1 o 2 respuestas rápidas que
 * OpenAI sugiere en el panel para lo último que escribió el cliente (4-oct).
 * OpenAI se simula con WABOT_TEST_OPENAI_HTTP; la caché va a una carpeta
 * temporal (solo CLI).
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/respuestas-rapidas.php';

$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-test-ia-uso-' . getmypid();
$GLOBALS['WABOT_TEST_RR_SUGERIDAS_DIR'] = sys_get_temp_dir() . '/wabot-test-rr-sugeridas-' . getmypid();

function oa_elige($ids) {
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) use ($ids) {
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        if ($ids === null) return [500, '{"error":{"message":"caido"}}'];
        return [200, json_encode([
            'id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
            'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode(['ids' => $ids])]]]],
            'usage' => ['input_tokens' => 2500, 'input_tokens_details' => ['cached_tokens' => 2000], 'output_tokens' => 40],
        ])];
    };
}
function oa_pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }

$cats = wabot_rr_03oct_catalogo([]);
$cfg = wabot_config_load();
$conv = conv_nueva('999TESTRRSUG1');
wabot_conv_transcript($conv, 'bot', 'Hola cómo estás? Para poder asesorarte y darte un precio adecuado, por favor contanos brevemente a qué te dedicás, o para qué necesitarías una web');
wabot_conv_transcript($conv, 'cliente', 'Hola! Vendo ropa de mujer y quiero vender online');

echo "Catálogo\n";
$catalogo = wabot_rr_sugeridas_catalogo($cats, $conv);
caso('mismo orden que lo que ve el panel', count($catalogo) === array_sum(array_map(function ($c) { return count($c['items']); },
    wabot_respuestas_rapidas_visibles($cats, $conv, $cfg))));
caso('sin la categoría del código si no lo pidió', !in_array('Propiedad absoluta del código', array_column($catalogo, 'categoria'), true));
caso('textos sin completar los montos (instrucciones iguales en todas las charlas)',
    strpos(wabot_rr_sugeridas_instrucciones($catalogo), '{ecommerce_mensual}') !== false);

echo "Pide y guarda\n";
oa_elige(['1.1']);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('devuelve la elegida', $r['ids'] === ['1.1'] && $r['estado'] === 'listo', json_encode($r));
$p = oa_pedidos()[0] ?? [];
caso('Structured Outputs estricto con los ids como enum',
    ($p['text']['format']['strict'] ?? false) === true
    && in_array('1.1', (array)($p['text']['format']['schema']['properties']['ids']['items']['enum'] ?? []), true));
caso('el mensaje del cliente va marcado sin respuesta',
    strpos((string)($p['input'][0]['content'] ?? ''), 'Cliente [SIN RESPUESTA]: Hola! Vendo ropa') !== false);
caso('la tarea queda anotada para la pestaña IA', is_file($GLOBALS['WABOT_TEST_IA_USO_DIR'] . '/' . date('Y-m') . '.jsonl')
    && strpos(file_get_contents($GLOBALS['WABOT_TEST_IA_USO_DIR'] . '/' . date('Y-m') . '.jsonl'), 'sugerir_respuestas') !== false);

oa_elige(['9.9']);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('mismo mensaje: sale de la caché sin llamar de nuevo', $r['ids'] === ['1.1'] && count(oa_pedidos()) === 0);

echo "Mensaje nuevo del cliente\n";
wabot_conv_transcript($conv, 'cliente', '¿Y cómo se paga? ¿Tiene permanencia?');
oa_elige(['3.2', '4.0', '2.0', '2.0']);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('vuelve a pedir y corta en dos', count(oa_pedidos()) === 1 && $r['ids'] === ['3.2', '4.0'], json_encode($r));
caso('los dos mensajes sin respuesta van marcados',
    substr_count((string)(oa_pedidos()[0]['input'][0]['content'] ?? ''), '[SIN RESPUESTA]') === 2);

echo "Sin pendiente, ids raros, caído\n";
wabot_conv_transcript($conv, 'humano', 'El mensual es una suscripción de Mercado Pago.');
oa_elige(['1.1']);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('si lo último es de Pablo no se sugiere ni se llama', $r['estado'] === 'sin_pendiente' && !oa_pedidos());

wabot_conv_transcript($conv, 'cliente', 'ok gracias');
oa_elige(['99.1', 'cualquiera']);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('un id que no está en la lista se descarta', $r['ids'] === [], json_encode($r));

wabot_conv_transcript($conv, 'cliente', '?');
oa_elige(null);
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('OpenAI caído: nada, sin romper', $r['ids'] === [] && $r['estado'] === 'error', json_encode($r));

$k = $GLOBALS['WABOT_TEST_OPENAI_KEY'];
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';
wabot_conv_transcript($conv, 'cliente', 'hola?');
$r = wabot_rr_sugeridas($conv, $cats, $cfg);
caso('sin key: no disponible', $r['estado'] === 'no_disponible');
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = $k;

foreach ([$GLOBALS['WABOT_TEST_IA_USO_DIR'], $GLOBALS['WABOT_TEST_RR_SUGERIDAS_DIR']] as $dir) {
    foreach ((array)glob($dir . '/*') as $f) @unlink($f);
    @rmdir($dir);
}
todo_ok();
