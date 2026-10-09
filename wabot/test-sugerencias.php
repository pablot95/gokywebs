<?php
/**
 * wabot/test-sugerencias.php — el modo de sugerencias del flujo comercial (9-oct-2026), sin red.
 *
 *   php wabot/test-sugerencias.php
 *
 * Con flujo_comercial = sugerencias: el webhook manda solo la bienvenida, por
 * cada mensaje del cliente queda una sugerencia en un archivo aparte (nunca en
 * la charla), generar no tiene efectos, una sugerencia vieja no se puede
 * mandar, mandar aplica los efectos de lo que de verdad salió (editado
 * incluido), no duplica, toma el control y deja registro. GPT Sol se simula.
 * Escribe charlas *TEST* en wabot/data/conv y las borra al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
// La bienvenida la decide el modo de sugerencias, no el gancho de las otras suites.
unset($GLOBALS['WABOT_TEST_SOLO_BIENVENIDA']);

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;

$tmp = sys_get_temp_dir() . '/wabot-test-sugerencias-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_SUGERENCIAS_DIR'] = $tmp . '/sugerencias';
$GLOBALS['WABOT_TEST_SUGERENCIAS_LOG_DIR'] = $tmp . '/log';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'sugerencias';
$GLOBALS['WABOT_TEST_SIN_ESPERA'] = true;   // los 4 s entre mensajes sugeridos no se esperan acá
$GLOBALS['TS_DICE_RUBRO'] = true;

const OFERTA_S = 'Si te interesa, te preparamos una demo gratis para que veas cómo quedaría tu web antes de decidir. Querés que la armemos?';

function dc(array $d = []) {
    $base = ['accion' => 'responder', 'solucion' => 'sin_definir', 'intencion' => 'ninguna', 'pago_unico' => false, 'mensajes' => [],
             'info_claves' => [], 'motivo' => null,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null,
                         'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) $d['ficha'] = array_merge($base['ficha'], $d['ficha']);
    return array_merge($base, $d);
}
function oa(array $cola) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        $ok = function ($datos) {
            return [200, json_encode(['id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($datos, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 4000, 'input_tokens_details' => ['cached_tokens' => 3000], 'output_tokens' => 200,
                            'output_tokens_details' => ['reasoning_tokens' => 30], 'total_tokens' => 4200]], JSON_UNESCAPED_UNICODE)];
        };
        if (str_ends_with((string)($payload['prompt_cache_key'] ?? ''), 'bienvenida_rubro')) return $ok(['ya_dice_rubro' => !empty($GLOBALS['TS_DICE_RUBRO'])]);
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) return [0, ''];
        return $ok($sig);
    };
}
function pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }
function log_filas() { return wabot_sugerencias_log_leer(1, 50); }
function entra($tel, $texto, $cfg) {
    $GLOBALS['WABOT_TEST_ENVIADOS'] = [];
    wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('ts.'), 'canal' => 'whatsapp',
                             'texto' => $texto, 'nombre' => 'Marta', 'media' => null], $cfg);
    return (array)$GLOBALS['WABOT_TEST_ENVIADOS'];
}
$src = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($src, 'function wabot_conv_identidad_entrante');
$hasta = strpos($src, '/* ── Instagram: otro formato');
eval(substr($src, $desde, $hasta - $desde));
$cotizar = dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas tus zapatillas directo desde la web.'],
               'ficha' => ['rubro' => 'tu local de zapatillas', 'que_vende' => 'zapatillas']]);
$tels = ['5491100009101TEST', '5491100009102TEST', '5491100009103TEST', '5491100009104TEST', '5491100009105TEST'];
foreach ($tels as $t) { @unlink(wabot_conv_path($t)); @unlink(wabot_cola_path($t)); }

echo "— 1. El bot solo saluda; lo demás queda como sugerencia —\n";
$tel = $tels[0];
$GLOBALS['TS_DICE_RUBRO'] = false;
oa([$cotizar]);
$env = entra($tel, 'Hola, quiero info', $cfg);
caso('el primer mensaje recibe la bienvenida (modo sugerencias = solo bienvenida)', count($env) === 1 && $env[0][1] === trim((string)$cfg['bienvenida']), json_encode($env, JSON_UNESCAPED_UNICODE));
caso('y no hay sugerencia: el último mensaje es nuestro', wabot_sugerencia_leer($tel) === null && count(pedidos()) === 0);
$GLOBALS['TS_DICE_RUBRO'] = true;
oa([$cotizar]);
$env = entra($tel, 'Vendo zapatillas', $cfg);
$s = wabot_sugerencia_leer($tel);
caso('«Vendo zapatillas» → nada sale por WhatsApp', $env === []);
caso('queda la sugerencia de cotizar, con los tres mensajes etiquetados', $s && $s['accion'] === 'cotizar' && $s['estado'] === 'pendiente' && count($s['mensajes']) === 3
    && array_column($s['mensajes'], 'efecto') === ['propuesta', 'planes', 'oferta'] && $s['mensajes'][2]['t'] === OFERTA_S, json_encode($s['mensajes'] ?? null, JSON_UNESCAPED_UNICODE));
$cv = wabot_conv_load($tel);
caso('la charla NO cambió: sin precio, sin oferta, sin formulario, el último mensaje es del cliente',
    empty($cv['precio_dado']) && empty($cv['comercial_cotizacion']) && empty($cv['comercial_oferta_ts']) && empty($cv['link_form_enviado'])
    && end($cv['transcript'])['q'] === 'cliente' && !empty($cv['handoff_pendiente']));
caso('pero la ficha de la sugerencia sí guarda lo que entendió (en el archivo, no en la charla)', ($s['resumen']['ficha']['rubro'] ?? '') === 'tu local de zapatillas' && wabot_ficha($cv)['rubro'] === '');
$panel = wabot_sugerencia_para_panel($cv, $cfg);
caso('el panel la ve vigente', $panel && $panel['vigente'] === true && $panel['id'] === $s['id'] && $panel['mensajes'][1]['etiqueta'] === 'Planes');
caso('y la lista la marca', wabot_sugerencia_pendiente($cv) && !empty(wabot_lista_item($tel)['sugerencia']));
$usoFilas = array_map(fn($l) => json_decode($l, true), (array)@file(wabot_ia_uso_dir() . '/' . date('Y-m') . '.jsonl', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
caso('el costo quedó anotado como "sugerencia"', ($s['costo_usd'] ?? 0) > 0 && count(array_filter($usoFilas, fn($f) => ($f['modo'] ?? '') === 'sugerencia' && ($f['tarea'] ?? '') === 'comercial')) === 1);
oa([$cotizar]);
$otra = wabot_sugerencia_tras_turno($tel, $cfg);
caso('pedirla de nuevo con la misma charla no vuelve a pensar', $otra['id'] === $s['id'] && count(pedidos()) === 0);

echo "— 2. Una sugerencia vieja no se manda —\n";
$cv = wabot_conv_load($tel);
wabot_conv_transcript($cv, 'cliente', 'Ah, y también vendo medias');
wabot_conv_save($cv);
caso('el cliente escribió después → desactualizada', wabot_sugerencia_para_panel(wabot_conv_load($tel), $cfg)['vigente'] === false && !wabot_sugerencia_pendiente(wabot_conv_load($tel)));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_sugerencia_enviar($tel, $s['id'], array_column($s['mensajes'], 't'), uniqid('e1'), $cfg);
caso('mandarla igual se rechaza y no sale nada', $r['ok'] === false && !empty($r['desactualizada']) && $GLOBALS['WABOT_TEST_ENVIADOS'] === [], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la charla sigue sin tocar', empty(wabot_conv_load($tel)['precio_dado']) && empty(wabot_conv_load($tel)['control_manual']));

echo "— 3. Recalcular y mandar —\n";
oa([$cotizar]);
$s2 = wabot_sugerencia_generar($tel, $cfg, true);
caso('recalcular da una sugerencia nueva y vigente', $s2['id'] !== $s['id'] && wabot_sugerencia_para_panel(wabot_conv_load($tel), $cfg)['vigente'] === true);
caso('y el contexto que vio traía los dos mensajes del cliente juntos', strpos((string)(pedidos()[0]['input'][0]['content'] ?? ''), "Vendo zapatillas\nAh, y también vendo medias") !== false);
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$envio2 = uniqid('e2');
$r = wabot_sugerencia_enviar($tel, $s2['id'], array_column($s2['mensajes'], 't'), $envio2, $cfg);
$cv = wabot_conv_load($tel);
caso('salen los tres mensajes, en orden', $r['ok'] === true && $r['enviados'] === 3 && array_column($GLOBALS['WABOT_TEST_ENVIADOS'], 1) === array_column($s2['mensajes'], 't'), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('quedan en la charla como mensajes de Pablo', count(array_filter(array_slice($cv['transcript'], -3), fn($l) => $l['q'] === 'humano')) === 3);
caso('recién ahora se congela el precio y se abre la oferta', !empty($cv['precio_dado']) && ($cv['comercial_cotizacion']['anual'] ?? '') === '$190.000' && ($cv['precio_cotizado'] ?? '') === '$190.000'
    && !empty($cv['comercial_oferta_ts']) && ($cv['tipo'] ?? '') === 'ecommerce' && wabot_ficha($cv)['rubro'] === 'tu local de zapatillas', json_encode(array_intersect_key($cv, array_flip(['precio_dado', 'comercial_cotizacion', 'tipo']))));
caso('mandar cuenta como intervención de Pablo: control manual, nada pendiente', !empty($cv['control_manual']) && !empty($cv['bot_off']) && empty($cv['handoff_pendiente']) && !empty($cv['comercial_sugerencia_enviada_ts']));
caso('la sugerencia queda como enviada y registrada', wabot_sugerencia_leer($tel)['estado'] === 'enviada' && wabot_sugerencia_para_panel($cv, $cfg) === null
    && (log_filas()[0]['resultado'] ?? '') === 'enviada' && (log_filas()[0]['editada'] ?? null) === false && count(log_filas()[0]['finales']) === 3);
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_sugerencia_enviar($tel, $s2['id'], array_column($s2['mensajes'], 't'), $envio2, $cfg);
caso('mandarla dos veces no la repite', $r['ok'] === false && $GLOBALS['WABOT_TEST_ENVIADOS'] === [] && stripos((string)$r['error'], 'ya se mandó') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['envios']])]);
$env = entra($tel, 'Hacen envíos?', $cfg);
$s3 = wabot_sugerencia_leer($tel);
caso('con la charla en control manual las sugerencias siguen (es la prueba)', $env === [] && $s3 && $s3['estado'] === 'pendiente' && $s3['accion'] === 'responder' && count($s3['mensajes']) === 1 && $s3['mensajes'][0]['efecto'] === 'info');
caso('y el contexto le contó al modelo que ya le pasamos el precio', strpos((string)(pedidos()[0]['input'][0]['content'] ?? ''), 'YA LE PASAMOS EL PRECIO') !== false && strpos((string)(pedidos()[0]['input'][0]['content'] ?? ''), 'Gokywebs (persona): Podés elegir entre dos planes') !== false);

echo "— 4. Editada: vale lo que salió de verdad —\n";
$tel = $tels[1];
$cv = wabot_conv_load($tel);
wabot_conv_transcript($cv, 'cliente', 'Vendo ropa');
wabot_conv_save($cv);
oa([$cotizar]);
$s = wabot_sugerencia_generar($tel, $cfg, true);
$finales = [$s['mensajes'][0]['t'], str_replace('$190.000', '$220.000', $s['mensajes'][1]['t']), ''];
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_sugerencia_enviar($tel, $s['id'], $finales, uniqid('e3'), $cfg);
$cv = wabot_conv_load($tel);
caso('salen solo los dos tildados', $r['ok'] === true && $r['enviados'] === 2 && count($GLOBALS['WABOT_TEST_ENVIADOS']) === 2);
caso('el precio congelado es el que vio el cliente ($220.000), no el de la lista', ($cv['comercial_cotizacion']['anual'] ?? '') === '$220.000' && ($cv['precio_cotizado'] ?? '') === '$220.000', json_encode($cv['comercial_cotizacion'] ?? null));
caso('sin la oferta mandada, la oferta no queda abierta', empty($cv['comercial_oferta_ts']));
caso('el registro dice que fue editada', (log_filas()[0]['editada'] ?? null) === true && count(log_filas()[0]['finales']) === 2);
$cv = wabot_conv_load($tel);
wabot_conv_transcript($cv, 'cliente', 'Dale');
wabot_conv_save($cv);
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$s = wabot_sugerencia_generar($tel, $cfg, true);
caso('sin oferta hecha, un "dale" no sugiere el formulario: con el precio ya dado, sugiere solo la oferta (sin repetir los planes)', $s['accion'] === 'cotizar' && array_column($s['mensajes'], 'efecto') === ['oferta'], json_encode(array_column($s['mensajes'], 'efecto')));

echo "— 5. El formulario: sugerido no es enviado —\n";
$tel = $tels[2];
$cv = wabot_conv_load($tel);
wabot_conv_transcript($cv, 'cliente', 'Vendo velas');
wabot_conv_transcript($cv, 'humano', 'Perfecto, te podemos armar una tienda online.');
wabot_conv_transcript($cv, 'humano', "Podés elegir entre dos planes:\n\n1) Plan anual: \$240.000\n2) Plan mensual: \$30.000\n\nAmbos incluyen todo:");
wabot_conv_transcript($cv, 'humano', OFERTA_S);
wabot_conv_transcript($cv, 'cliente', 'Dale, armala');
wabot_conv_save($cv);
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$s = wabot_sugerencia_generar($tel, $cfg, true);
caso('con la oferta ya hecha por Pablo, el "dale" sugiere el formulario', $s['accion'] === 'formulario' && count($s['mensajes']) === 1 && strpos($s['mensajes'][0]['t'], 'gokywebs.com/form/?c=') !== false, json_encode($s['mensajes'], JSON_UNESCAPED_UNICODE));
$cv = wabot_conv_load($tel);
caso('pero el formulario NO figura como enviado hasta que Pablo lo manda', empty($cv['link_form_enviado']) && empty($cv['form_link_mandado_ts']) && empty($cv['comercial_pausa']));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_sugerencia_enviar($tel, $s['id'], [$s['mensajes'][0]['t']], uniqid('e4'), $cfg);
$cv = wabot_conv_load($tel);
caso('mandado: formulario enviado, pausa por formulario, sin bloquear el recordatorio', $r['ok'] === true && !empty($cv['link_form_enviado']) && !empty($cv['form_link_mandado_ts'])
    && ($cv['comercial_pausa'] ?? '') === 'formulario' && empty($cv['seguimiento_bloqueado']) && !empty($cv['esProspecto']));
caso('y el precio que puso Pablo a mano sigue valiendo (se lee de la charla)', (wabot_comercial_cotizacion($cv, $cfg)['anual'] ?? '') === '$240.000' && wabot_comercial_cotizacion($cv, $cfg)['origen'] === 'chat');
oa([dc(['accion' => 'responder', 'mensajes' => ['no'] ])]);
$env = entra($tel, 'Y cuánto tarda la demo?', $cfg);
$s = wabot_sugerencia_leer($tel);
caso('después del formulario no se piensa más: sugerencia de pausa con el motivo, sin llamar al modelo', $env === [] && $s['accion'] === 'pausa' && stripos($s['motivo'], 'Formulario enviado') !== false && count(pedidos()) === 0 && $s['mensajes'] === []);
caso('el panel la muestra como aviso', wabot_sugerencia_para_panel(wabot_conv_load($tel), $cfg)['accion'] === 'pausa' && !wabot_sugerencia_pendiente(wabot_conv_load($tel)));

echo "— 6. Para Pablo y descartar —\n";
$tel = $tels[3];
oa([dc(['accion' => 'humano', 'solucion' => 'crm', 'motivo' => 'Pide un CRM con facturación'])]);
$env = entra($tel, 'Necesito un CRM con facturación integrada', $cfg);
$s = wabot_sugerencia_leer($tel);
caso('un caso para Pablo: sin mensajes y con el motivo', $env === [] && $s['accion'] === 'humano' && $s['mensajes'] === [] && $s['motivo'] === 'Pide un CRM con facturación');
$cv = wabot_conv_load($tel);
caso('la charla no se marca derivada por una sugerencia (solo el panel lo muestra)', empty($cv['comercial_pausa']) && empty($cv['control_manual']) && !empty($cv['handoff_pendiente']));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_sugerencia_enviar($tel, $s['id'], [], uniqid('e5'), $cfg);
caso('no hay nada que mandar', $r['ok'] === false && $GLOBALS['WABOT_TEST_ENVIADOS'] === []);
caso('descartar la saca del panel y queda registrada', wabot_sugerencia_descartar($tel, $s['id'], 'la contesto yo') && wabot_sugerencia_para_panel(wabot_conv_load($tel), $cfg) === null
    && (log_filas()[0]['resultado'] ?? '') === 'descartada' && (log_filas()[0]['descarte'] ?? '') === 'la contesto yo');
caso('descartar dos veces no rompe', wabot_sugerencia_descartar($tel, $s['id']) === true && wabot_sugerencia_descartar($tel, 'otro-id') === false);

echo "— 7. Fallas y modo apagado —\n";
$tel = $tels[4];
oa([]);
$env = entra($tel, 'Vendo zapatillas', $cfg);
$s = wabot_sugerencia_leer($tel);
caso('si OpenAI no contesta, la sugerencia lo dice y nada sale', $env === [] && $s['accion'] === 'error' && $s['mensajes'] === [] && stripos($s['motivo'], 'No se pudo preparar') !== false);
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'off';
caso('con el modo apagado no se genera nada', wabot_sugerencia_tras_turno($tel, $cfg) === null);
caso('entre un mensaje sugerido y el siguiente van 4 segundos (Pablo, 9-oct), acotados entre 0 y 20',
    wabot_sugerencia_demora($cfg) === 4.0 && wabot_sugerencia_demora(['comercial' => ['demora_entre_sugeridos' => 99]]) === 20.0 && wabot_sugerencia_demora([]) === 4.0);
unset($GLOBALS['WABOT_TEST_SIN_ESPERA']);
$t0 = microtime(true);
wabot_sugerencia_esperar(conv_nueva('5491100009198TEST'), ['comercial' => ['demora_entre_sugeridos' => 0.3]], 'wamid.x');
caso('y la espera se cumple de verdad cuando no es un test', microtime(true) - $t0 >= 0.28);
$GLOBALS['WABOT_TEST_SIN_ESPERA'] = true;
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'sugerencias';
$cvOff = conv_nueva('5491100009199TEST', ['control_manual' => true]);
caso('el modo sugerencias deja el bot en "solo bienvenida" aunque el ajuste viejo esté apagado', wabot_solo_bienvenida(['solo_bienvenida' => false]) === true);

foreach ($tels as $t) { @unlink(wabot_conv_path($t)); @unlink(wabot_cola_path($t)); }
foreach (['uso', 'sugerencias', 'log'] as $d) { foreach ((array)glob($tmp . "/$d/*") as $f) @unlink($f); @rmdir($tmp . "/$d"); }
@rmdir($tmp);
todo_ok();
