<?php
/**
 * wabot/test-datos-demo.php — los datos de la demo por el chat (Pablo, 9-nov-2026), sin red.
 *
 *   php wabot/test-datos-demo.php
 *
 * El bot ya no manda el link de /form/: cuando el cliente acepta la demo le pide
 * los datos en el chat, y con lo que contesta arma la misma ficha que armaba el
 * formulario (datos-demo.php). GPT Sol se simula: la decisión del flujo comercial
 * y la lectura de los datos (tarea `datos_demo`) salen de colas cargadas por caso.
 * Lo que se prueba es lo que hace el SISTEMA con cada respuesta, no la precisión
 * del modelo real.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

// Las demás suites corren con el link del formulario; esta prueba el pedido por el chat.
$GLOBALS['WABOT_TEST_FORM_LINK'] = false;

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;
// Las secciones 1-20 se escribieron con la espera de 5 minutos (10-nov); la de 2 h (11-nov) se prueba en la 21.
$cfg['datos_demo_espera_min'] = 5;

$tmp = sys_get_temp_dir() . '/wabot-test-datos-demo-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$GLOBALS['TC_DICE_RUBRO'] = true;
// La espera antes de armar la ficha (10-nov): el índice del cron va a un archivo de prueba.
$GLOBALS['WABOT_TEST_DATOS_DEMO_ESPERA_ARCHIVO'] = $tmp . '/datos-demo-espera.json';
@unlink($GLOBALS['WABOT_TEST_DATOS_DEMO_ESPERA_ARCHIVO']);

const INTRO = 'Para armar la demo necesito los siguientes datos';

/** Una decisión del modelo comercial, con lo que no se pasa en blanco. */
function dc(array $d = []) {
    $base = ['accion' => 'responder', 'solucion' => 'sin_definir', 'intencion' => 'ninguna', 'pago_unico' => false, 'mensajes' => [],
             'info_claves' => [], 'motivo' => null,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null,
                         'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) $d['ficha'] = array_merge($base['ficha'], $d['ficha']);
    return array_merge($base, $d);
}

/** Lo que devuelve el extractor, con todos los campos. */
function dd(array $d = []) {
    return array_merge(['es_datos' => true, 'nombre_negocio' => '', 'resumen' => '', 'instagram' => '', 'colores' => '',
                        'referencia' => '', 'incluir' => '', 'whatsapp' => ''], $d);
}

/**
 * La API simulada: $cola para la tarea comercial, $datos para la lectura de los
 * datos (`datos_demo`); el revisor aprueba. 'falla' simula que no contesta.
 */
function oa(array $cola, array $datos = []) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['OA_DATOS'] = $datos;
    $GLOBALS['OA_DATOS_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        $tarea = (string)($payload['prompt_cache_key'] ?? '');
        $ok = function ($datos) {
            return [200, json_encode(['id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($datos, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 2000, 'input_tokens_details' => ['cached_tokens' => 1500], 'output_tokens' => 120,
                            'output_tokens_details' => ['reasoning_tokens' => 10], 'total_tokens' => 2120]], JSON_UNESCAPED_UNICODE)];
        };
        if (str_ends_with($tarea, 'comercial_revisor_sombra') || str_ends_with($tarea, 'comercial_revisor')) {
            return $ok(['ok' => true, 'problemas' => [], 'falta_contestar' => []]);
        }
        if (str_ends_with($tarea, 'bienvenida_rubro')) return $ok(['ya_dice_rubro' => !empty($GLOBALS['TC_DICE_RUBRO'])]);
        if (str_ends_with($tarea, 'datos_demo')) {
            $GLOBALS['OA_DATOS_PEDIDOS'][] = $payload;
            $sig = array_shift($GLOBALS['OA_DATOS']);
            if ($sig === null || $sig === 'falla') return [500, '{"error":{"message":"simulada"}}', 0];
            return $ok($sig);
        }
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) return [0, ''];
        return $ok($sig);
    };
}
function pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }
function pedidos_datos() { return (array)($GLOBALS['OA_DATOS_PEDIDOS'] ?? []); }
function cv($clave = '5491100009001TEST', array $extra = []) { return conv_nueva($clave, array_merge(['nombre' => 'Marta'], $extra)); }

/** Una charla ya cotizada por el flujo comercial, con la oferta de la demo hecha. */
function cv_cotizada(array $extra = [], $solucion = 'tienda') {
    global $cfg;
    $c = cv('5491100009002TEST', $extra);
    oa([dc(['accion' => 'cotizar', 'solucion' => $solucion, 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas desde la web.'],
            'ficha' => ['rubro' => 'tu local de zapatillas', 'que_vende' => 'zapatillas']])]);
    turno('Vendo zapatillas', $c, $cfg);
    return $c;
}
/** Acepta la demo: el sistema le pide los datos. */
function cv_con_pedido(array $extra = []) {
    global $cfg;
    $c = cv_cotizada($extra);
    oa([dc(['accion' => 'formulario', 'intencion' => 'acepta'])]);
    turno('Dale, armala', $c, $cfg);
    return $c;
}
function linea_sistema($c, $prefijo) {
    foreach ((array)$c['transcript'] as $f) if (($f['q'] ?? '') === 'sistema' && str_starts_with((string)$f['t'], $prefijo)) return (string)$f['t'];
    return '';
}
/**
 * Pasa el cron a los $min minutos del último mensaje del cliente (10-nov): devuelve lo
 * que le mandó a esa charla, o null si todavía no le tocaba.
 */
function espera_pasa(&$c, $min) {
    global $cfg;
    $convs = [&$c];
    $ahora = wabot_datos_demo_ultimo_cliente_ts($c) + $min * 60;
    $res = wabot_datos_demo_espera_correr($cfg, $ahora, $convs);
    return $res['detalle'][wabot_conversation_key($c)] ?? null;
}

echo "— 1. El pedido de datos (textos.php) —\n";
$c = cv();
$pedido = wabot_datos_demo_texto($c, $cfg);
caso('empieza con el texto de Pablo', str_starts_with($pedido, INTRO) && str_contains($pedido, 'no son todos obligatorios'), $pedido);
caso('lista los 7 datos del formulario, con guion', preg_match_all('/^- /m', $pedido) === 7, $pedido);
caso('nombre, qué ofrece, Instagram, colores, referencia, incluir, fotos', str_contains($pedido, 'Nombre de tu negocio') && str_contains($pedido, 'Instagram') && str_contains($pedido, 'Colores')
    && str_contains($pedido, 'referencia') && str_contains($pedido, 'sí o sí') && str_contains($pedido, 'fotos'));
caso('sin el link del formulario', !tiene_form([$pedido]));
caso('en WhatsApp no pide el número', !str_contains($pedido, 'WhatsApp'));
$ig = cv('IGTEST001', ['canal' => 'instagram']);
$pedidoIg = wabot_datos_demo_texto($ig, $cfg);
caso('en Instagram suma el WhatsApp (8 líneas)', preg_match_all('/^- /m', $pedidoIg) === 8 && str_contains($pedidoIg, 'WhatsApp'), $pedidoIg);
$hecho = cv('5491100009003TEST', ['form_completado_ts' => time() - 100]);
caso('al que ya mandó los datos no se le vuelven a pedir', wabot_datos_demo_texto($hecho, $cfg) === '');
caso('el detector reconoce el pedido', wabot_texto_pide_datos_demo($pedido) && wabot_texto_pide_datos_demo($pedido, $cfg));
caso('el detector lo reconoce con una coma cambiada', wabot_texto_pide_datos_demo(str_replace('datos,', 'datos.', $pedido)));
caso('y no confunde otros textos', !wabot_texto_pide_datos_demo('Hola! Para la demo necesito que me digas tu nombre') && !wabot_texto_pide_datos_demo('dale'));
caso('wabot_datos_por_chat prendido de fábrica', wabot_datos_por_chat($cfg) && wabot_datos_por_chat([]));
caso('y se apaga con datos_por_chat false', !wabot_datos_por_chat(array_merge($cfg, ['datos_por_chat' => false])));

echo "\n— 2. El pedido deja la charla como con el link mandado —\n";
$c = cv();
wabot_conv_transcript($c, 'humano', $pedido);   // Pablo lo pega desde el panel
caso('form_link_mandado_ts marcado', (int)($c['form_link_mandado_ts'] ?? 0) > 0);
caso('datos_pedidos_ts marcado', (int)($c['datos_pedidos_ts'] ?? 0) > 0);
caso('el panel lo cuenta como form recibido', wabot_conv_form_recibido($c));
caso('estado comercial: formulario', wabot_comercial_estado($c) === 'formulario');
caso('datos pendientes', wabot_datos_demo_pendiente($c));
$c2 = cv();
wabot_conv_transcript($c2, 'bot', 'Hola, cómo estás?');
caso('otro texto del bot no marca nada', empty($c2['form_link_mandado_ts']) && empty($c2['datos_pedidos_ts']));

echo "\n— 3. Flujo comercial: acepta la demo y se le piden los datos —\n";
$c = cv_cotizada();
oa([dc(['accion' => 'formulario', 'intencion' => 'acepta'])]);
$r = turno('Dale, armala', $c, $cfg);
caso('sale el pedido de datos', count(array_filter($r, fn($m) => str_starts_with((string)$m, INTRO))) === 1, implode(' | ', $r));
caso('y no el link del formulario', !tiene_form($r));
caso('link_form_enviado + esProspecto', !empty($c['link_form_enviado']) && !empty($c['esProspecto']));
caso('comercial_pausa = formulario', ($c['comercial_pausa'] ?? '') === 'formulario');
caso('datos_pedidos_ts marcado por el efecto', (int)($c['datos_pedidos_ts'] ?? 0) > 0);
caso('etiqueta Formulario en el panel', ($c['comercial_ultimo']['accion'] ?? '') === 'formulario', json_encode($c['comercial_ultimo'] ?? null));
oa([dc(['accion' => 'formulario'])]);
$r = turno('Sí dale', $c, $cfg);
caso('un segundo sí no repite el pedido', !count(array_filter($r, fn($m) => str_contains((string)$m, INTRO))), implode(' | ', $r));

echo "\n— 4. Manda los datos: espera unos minutos de silencio, arma la ficha y le confirma —\n";
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas deportivas y urbanas, venta online y en el local de Lanús',
            'instagram' => 'zapaslanus', 'colores' => 'negro y dorado', 'referencia' => 'nike.com', 'incluir' => 'un mapa con la ubicación'])]);
$r = turno("Zapas Lanús\nVendemos zapatillas deportivas y urbanas, online y en el local de Lanús\nIg @zapaslanus\nColores negro y dorado\nMe gusta nike.com\nQuiero un mapa con la ubicación", $c, $cfg);
caso('en el turno no contesta: espera a que termine de mandar', $r === [] && empty($c['lead_creado']) && (int)($c['datos_demo_espera_ts'] ?? 0) > 0, implode(' | ', $r));
caso('lo leído queda anotado y el panel ve que espera', ($c['datos_demo_parcial']['nombre_negocio'] ?? '') === 'Zapas Lanús' && ($c['comercial_ultimo']['accion'] ?? '') === 'esperar');
caso('mientras espera, cada renglón de datos no le suena a Pablo (11-nov)', wabot_conv_bot_con_datos_demo($c) && (!function_exists('wabot_push_debe_avisar') || !wabot_push_debe_avisar($c)));
caso('la charla queda anotada para el cron', array_key_exists(wabot_conversation_key($c), wabot_datos_demo_espera_indice()));
caso('a los 4 minutos el cron todavía no la toca', espera_pasa($c, 4) === null && empty($c['lead_creado']));
$r = espera_pasa($c, 6);
caso('a los 6 minutos sin escribir arma la ficha y le confirma', is_array($r) && count($r) === 1 && str_starts_with((string)$r[0], 'Perfecto, con eso armamos la demo'), implode(' | ', (array)$r));
$ultima = end($c['transcript']);
caso('la confirmación quedó en el chat', ($ultima['q'] ?? '') === 'bot' && str_starts_with((string)($ultima['t'] ?? ''), 'Perfecto, con eso armamos'));
caso('y ya no está anotada para el cron', !array_key_exists(wabot_conversation_key($c), wabot_datos_demo_espera_indice()));
caso('sin volver a gastar la lectura (no escribió nada más)', count(pedidos_datos()) === 1);
caso('con la entrega (hoy a la tarde / mañana / hora)', str_contains((string)($r[0] ?? ''), 'Estará lista para '), (string)($r[0] ?? ''));
caso('le pidió la lectura a GPT (datos_demo_v1)', count(pedidos_datos()) === 1 && (pedidos_datos()[0]['text']['format']['name'] ?? '') === 'datos_demo_v1');
caso('la lectura lleva lo que escribió y lo que ya sabíamos', str_contains((string)(pedidos_datos()[0]['input'] ?? ''), 'Zapas Lanús') && str_contains((string)(pedidos_datos()[0]['input'] ?? ''), 'zapatillas'));
caso('sin gastar un turno del modelo comercial', count(pedidos()) === 0);
caso('nombre_negocio', ($c['nombre_negocio'] ?? '') === 'Zapas Lanús', (string)($c['nombre_negocio'] ?? ''));
caso('descripcion = el resumen', str_contains((string)($c['descripcion'] ?? ''), 'Zapatillas deportivas'));
caso('colores', ($c['colores'] ?? '') === 'negro y dorado');
caso('instagram', ($c['instagram'] ?? '') === 'zapaslanus');
// La referencia pasa por wabot_referencia_final al crear la ficha: junta los links y @ de toda la charla (como con el formulario).
caso('referencia e incluir', str_contains((string)($c['referencia'] ?? ''), 'nike.com') && ($c['incluir'] ?? '') === 'un mapa con la ubicación', (string)($c['referencia'] ?? ''));
caso('form_completado_ts + origen chat', (int)($c['form_completado_ts'] ?? 0) > 0 && ($c['origen_prediseno'] ?? '') === 'chat');
caso('la ficha se creó (lead_creado)', !empty($c['lead_creado']));
caso('el bot sigue en el chat hasta la demo (11-nov): sin apagarse ni pasarle la charla a Pablo', empty($c['bot_off']) && empty($c['handoff_pendiente'])
    && ($c['fase'] ?? '') === 'prediseno' && ($c['cierre'] ?? '') === 'prediseno' && wabot_conv_grupo($c) === 'muestra');
caso('el panel no lo cuenta como sin leer ni como pendiente de Pablo', wabot_conv_muestra_del_bot($c) && !wabot_conv_bot_inactivo($c));
$cPush = $c; wabot_conv_transcript($cPush, 'cliente', '[foto] Mandó el logo.');
caso('y una foto después no le suena a Pablo como notificación', function_exists('wabot_push_debe_avisar') && !wabot_push_debe_avisar($cPush));
$cPush['handoff_pendiente'] = true;
caso('salvo que el bot se la haya pasado', wabot_push_debe_avisar($cPush));
caso('la confirmación de los 5 minutos ya no corresponde', !empty($c['form_recibido_confirmado']) && !wabot_form_confirmacion_corresponde($c, $cfg, time() + 600));
$linea = linea_sistema($c, '[Datos de la demo por chat]');
caso('línea de sistema con los datos', str_contains($linea, 'Negocio: Zapas Lanús') && str_contains($linea, 'Colores: negro y dorado') && str_contains($linea, 'Instagram: instagram.com/zapaslanus'), $linea);
caso('ya no hay datos pendientes', !wabot_datos_demo_pendiente($c));
$campos = wabot_lead_campos($c, $cfg);
caso('la ficha lleva nombre_negocio, colores, referencias, incluir_si_o_si e instagram',
    ($campos['nombre_negocio']['stringValue'] ?? '') === 'Zapas Lanús' && ($campos['colores']['stringValue'] ?? '') === 'negro y dorado'
    && str_contains((string)($campos['referencias']['stringValue'] ?? ''), 'nike.com') && ($campos['incluir_si_o_si']['stringValue'] ?? '') === 'un mapa con la ubicación'
    && ($campos['instagram']['stringValue'] ?? '') === 'zapaslanus' && !empty($campos['createdAt']['timestampValue']),
    json_encode(array_intersect_key($campos, array_flip(['nombre_negocio', 'colores', 'referencias', 'incluir_si_o_si', 'instagram', 'createdAt'])), JSON_UNESCAPED_UNICODE));
caso('esProspecto en la ficha', !empty($campos['esProspecto']['booleanValue']));
oa([dc(['accion' => 'responder', 'mensajes' => ['no debería salir']])]);
$cMat = $c;
$r = turno('Gracias!', $cMat, $cfg);
caso('después, un «gracias» no gasta el modelo ni queda para Pablo', $r === [] && count(pedidos()) === 0 && empty($cMat['handoff_pendiente']), implode(' | ', $r));
$cMat = $c;
caso('una foto sin texto: el webhook no la deriva', wabot_prediseno_material_sin_texto($cMat, $cfg) && empty($cMat['control_manual']) && empty($cMat['handoff_pendiente']));
oa([dc(['accion' => 'responder', 'mensajes' => ['¡Recibido! Lo sumamos a la demo']])]);
$cMat = $c;
$r = turno('Te paso los horarios: lunes a sábado de 10 a 20', $cMat, $cfg);
caso('más info para la demo → el acuse del modelo', $r === ['¡Recibido! Lo sumamos a la demo'] && count(pedidos()) === 1 && empty($cMat['handoff_pendiente']), implode(' | ', $r));
$GLOBALS['WABOT_TEST_BOT_HASTA_DEMO'] = false;
$cMat = $c; $cMat['bot_off'] = true;
oa([dc(['accion' => 'responder', 'mensajes' => ['no debería salir']])]);
$r = turno('Gracias! Te mando fotos después', $cMat, $cfg);
caso('con «Seguir hasta la demo» apagado, después el chat es de Pablo (bot apagado)', $r === [] && count(pedidos()) === 0, implode(' | ', $r));
caso('y una foto sin texto no se queda en el bot', !wabot_prediseno_material_sin_texto($cMat, $cfg));
$GLOBALS['WABOT_TEST_BOT_HASTA_DEMO'] = true;

echo "\n— 5. Lo que no son los datos sigue el camino de siempre —\n";
$c = cv_con_pedido();
oa([dc(['accion' => 'responder', 'mensajes' => ['No, la demo no tiene costo.'], 'info_claves' => []])], [dd(['es_datos' => false])]);
$r = turno('La demo tiene algún costo?', $c, $cfg);
caso('una pregunta la contesta el flujo comercial', count($r) === 1 && str_starts_with((string)$r[0], 'No, la demo no tiene costo'), implode(' | ', $r));
caso('sin ficha ni apagado', empty($c['lead_creado']) && empty($c['bot_off']) && empty($c['form_completado_ts']));
caso('los datos siguen pendientes', wabot_datos_demo_pendiente($c));
oa([dc(['accion' => 'esperar'])], [dd(['nombre_negocio' => 'no debería llamarse'])]);
$r = turno('Dale, ahora te paso todo', $c, $cfg);
caso('un «ahora te paso» no gasta la lectura', count(pedidos_datos()) === 0 && empty($c['lead_creado']), implode(' | ', $r));
oa([dc(['accion' => 'esperar'])], [dd(['nombre_negocio' => 'no debería llamarse'])]);
$r = turno('ok', $c, $cfg);
caso('un «ok» tampoco', count(pedidos_datos()) === 0 && empty($c['lead_creado']));
oa([dc(['accion' => 'responder', 'mensajes' => ['Gracias, las uso para la demo.']])], [dd(['nombre_negocio' => 'no debería llamarse'])]);
$r = turno("[foto] (Una foto de la vidriera de un local de zapatillas)", $c, $cfg);
caso('solo una foto: no hay nada que leer, lo agradece el flujo', count(pedidos_datos()) === 0 && count($r) === 1 && str_starts_with((string)$r[0], 'Gracias, las uso para la demo'), implode(' | ', $r));

echo "\n— 6. Datos en varios mensajes y lo que falta —\n";
$c = cv('5491100009010TEST');
wabot_conv_transcript($c, 'bot', $pedido);   // sin ficha: la charla no sabe a qué se dedica
oa([], [dd(['nombre_negocio' => 'Pelu Mari'])]);
$r = turno('Se llama Pelu Mari', $c, $cfg);
caso('solo el nombre: en el turno no dice nada (puede estar buscando el resto)', $r === [] && empty($c['lead_creado']), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('a los minutos de silencio pide lo que falta, una vez', is_array($r) && count($r) === 1 && str_contains((string)$r[0], 'Para arrancar me falta') && str_contains((string)$r[0], 'resumen'), implode(' | ', (array)$r));
caso('sin ficha todavía, y ya no espera', empty($c['lead_creado']) && empty($c['form_completado_ts']) && !wabot_datos_demo_espera_sigue($c));
oa([], [dd(['nombre_negocio' => 'Pelu Mari', 'resumen' => 'Peluquería en Lanús: cortes, color y peinados'])]);
$r = turno('Hago cortes, color y peinados en Lanús', $c, $cfg);
caso('la lectura lee los dos mensajes juntos', str_contains((string)(pedidos_datos()[0]['input'] ?? ''), 'Se llama Pelu Mari') && str_contains((string)(pedidos_datos()[0]['input'] ?? ''), 'Hago cortes'));
caso('vuelve a esperar', $r === [] && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('con el resumen se completa', is_array($r) && count($r) === 1 && str_starts_with((string)$r[0], 'Perfecto, con eso armamos la demo') && !empty($c['lead_creado']), implode(' | ', (array)$r));
caso('colores a elección del diseñador cuando no los dijo', ($c['colores'] ?? '') === 'A elección del diseñador');
caso('nombre y descripción', ($c['nombre_negocio'] ?? '') === 'Pelu Mari' && str_contains((string)$c['descripcion'], 'Peluquería'));

$c = cv_con_pedido();   // la ficha ya sabe que vende zapatillas
oa([], [dd(['nombre_negocio' => 'Zapas Lanús'])]);
$r = turno('El negocio se llama Zapas Lanús', $c, $cfg);
caso('solo el nombre pero la charla ya sabe el rubro: igual espera (hasta el 9-nov se armaba al instante)', $r === [] && empty($c['lead_creado']), implode(' | ', $r));
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'instagram' => 'zapaslanus', 'colores' => 'negro y dorado'])]);
$r = turno('El ig es @zapaslanus y los colores negro y dorado', $c, $cfg);
caso('lo que manda a los 2 minutos se suma, sin armar todavía', $r === [] && ($c['datos_demo_parcial']['instagram'] ?? '') === 'zapaslanus' && empty($c['lead_creado']), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('después del silencio se completa con todo', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto') && ($c['instagram'] ?? '') === 'zapaslanus' && ($c['colores'] ?? '') === 'negro y dorado', implode(' | ', (array)$r));
caso('la descripción sale de la ficha', str_contains((string)($c['descripcion'] ?? ''), 'zapatillas'), (string)($c['descripcion'] ?? ''));

// «Listo» mientras espera: terminó de mandar, se arma en el turno.
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'colores' => 'negro'])]);
turno('Zapas Lanús, colores negro', $c, $cfg);
oa([], [dd(['nombre_negocio' => 'no debería leerse'])]);
$r = turno('Listo, eso es todo', $c, $cfg);
caso('un «listo, eso es todo» mientras espera: arma en el turno, sin otra lectura', count($r) === 1 && str_starts_with((string)$r[0], 'Perfecto') && !empty($c['lead_creado']) && count(pedidos_datos()) === 0 && ($c['nombre_negocio'] ?? '') === 'Zapas Lanús', implode(' | ', $r));
caso('wabot_datos_demo_es_acuse', wabot_datos_demo_es_acuse('listo') && wabot_datos_demo_es_acuse('Sí, con eso alcanza') && wabot_datos_demo_es_acuse('ya está todo')
    && !wabot_datos_demo_es_acuse('ok, después te paso las fotos') && !wabot_datos_demo_es_acuse('cuánto tarda?') && !wabot_datos_demo_es_acuse('Zapas Lanús, colores negro'));

// «Después te paso» mientras espera: ni arma ni gasta lectura; el cron la arma igual a los minutos.
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús'])]);
turno('Zapas Lanús', $c, $cfg);
oa([dc(['accion' => 'esperar'])], [dd(['nombre_negocio' => 'no debería leerse'])]);
$r = turno('Después te paso las fotos', $c, $cfg);
caso('un «después te paso» no arma ni gasta lectura: sigue esperando', count(pedidos_datos()) === 0 && empty($c['lead_creado']) && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
caso('el silencio se cuenta desde ese último mensaje', espera_pasa($c, 4) === null && is_array(espera_pasa($c, 6)) && !empty($c['lead_creado']));

// Una pregunta en el medio: la contesta el flujo; al vencer, como escribió después de la lectura, se relee todo.
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús'])]);
turno('Zapas Lanús', $c, $cfg);
// 10-nov: la pregunta corta ya no gasta una lectura (antes dependía de que GPT dijera «no son datos»); la única lectura es la del cron.
oa([dc(['accion' => 'responder', 'mensajes' => ['No, la demo no tiene costo.']])], [dd(['nombre_negocio' => 'Zapas Lanús', 'incluir' => 'un mapa'])]);
$r = turno('La demo tiene costo?', $c, $cfg);
caso('la pregunta no gasta lectura', count(pedidos_datos()) === 0);
caso('una pregunta en el medio la contesta el flujo y la espera sigue', count($r) === 1 && str_starts_with((string)$r[0], 'No, la demo') && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('al vencer relee todo (escribió después de la lectura) y arma', !empty($c['lead_creado']) && count(pedidos_datos()) === 1 && ($c['incluir'] ?? '') === 'un mapa', implode(' | ', (array)$r));

$c = cv('5491100009011TEST');
wabot_conv_transcript($c, 'bot', $pedido);
oa([], [dd(['colores' => 'rojo y blanco'])]);
turno('Los colores son rojo y blanco', $c, $cfg);
$r = espera_pasa($c, 6);
caso('solo colores: al vencer la espera pide nombre y resumen', str_contains((string)($r[0] ?? ''), 'nombre de tu negocio') && str_contains((string)($r[0] ?? ''), 'resumen'), implode(' | ', (array)$r));
oa([], [dd(['colores' => 'rojo y blanco', 'referencia' => 'adidas.com'])]);
$r = turno('Y me gusta adidas.com', $c, $cfg);
caso('sigue sin lo esencial: vuelve a esperar', $r === [] && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('la segunda vez sin lo esencial: lo ve Pablo, en silencio', $r === [] && !empty($c['handoff_pendiente']) && empty($c['lead_creado']), implode(' | ', (array)$r));

echo "\n— 7. Instagram: hace falta el WhatsApp —\n";
$c = cv('IGTEST777', ['canal' => 'instagram', 'channel_user_id' => 'IGTEST777']);
wabot_conv_transcript($c, 'bot', wabot_datos_demo_texto($c, $cfg));
oa([], [dd(['nombre_negocio' => 'Velas Luz', 'resumen' => 'Velas artesanales de soja', 'colores' => 'beige y verde'])]);
$r = turno('Velas Luz, velas artesanales de soja, colores beige y verde', $c, $cfg);
caso('con los datos pero sin número: primero la espera', $r === [] && empty($c['lead_creado']), implode(' | ', $r));
$r = espera_pasa($c, 6);
caso('al vencer pide el WhatsApp', is_array($r) && count($r) === 1 && str_contains((string)$r[0], 'WhatsApp') && empty($c['lead_creado']), implode(' | ', (array)$r));
$r = turno('Es 11 2506-8578', $c, $cfg);
caso('con el número se completa', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', $r));
caso('telefono_wsp guardado', !empty($c['telefono_wsp']), (string)($c['telefono_wsp'] ?? ''));
caso('la ficha lleva ese teléfono', str_contains((string)(wabot_lead_campos($c, $cfg)['telefono']['stringValue'] ?? ''), '2506'));
$c = cv('IGTEST778', ['canal' => 'instagram', 'channel_user_id' => 'IGTEST778']);
wabot_conv_transcript($c, 'bot', wabot_datos_demo_texto($c, $cfg));
oa([], [dd(['nombre_negocio' => 'Velas Luz', 'resumen' => 'Velas artesanales', 'whatsapp' => '11 2506 8578'])]);
turno('Velas Luz, velas artesanales, mi wsp 11 2506 8578', $c, $cfg);
$r = espera_pasa($c, 6);
caso('si el número viene con los datos, al vencer se completa sin pedir nada', !empty($c['lead_creado']) && !empty($c['telefono_wsp']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));

echo "\n— 8. Sin OpenAI: reglas —\n";
$c = cv_con_pedido();
$key = $GLOBALS['WABOT_TEST_OPENAI_KEY'];
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';
turno("Zapas Lanús, vendemos zapatillas deportivas y urbanas en Lanús, colores negro y dorado, ig @zapaslanus", $c, $cfg);
$r = espera_pasa($c, 6);
caso('un texto con cuerpo se toma como los datos (y se arma al vencer la espera)', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));
caso('todo el texto queda como descripción', str_contains((string)$c['descripcion'], 'zapatillas deportivas'));
caso('el Instagram sale igual', ($c['instagram'] ?? '') === 'zapaslanus');
caso('y la línea avisa que se leyó sin IA', str_contains(linea_sistema($c, '[Datos de la demo por chat]'), 'sin IA'));
$c = cv_con_pedido();
$r = turno('Cuánto tarda la demo?', $c, $cfg);
caso('una pregunta sin OpenAI no se toma como datos', empty($c['lead_creado']), implode(' | ', $r));
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = $key;
$c = cv_con_pedido();
oa([], ['falla', 'falla', 'falla', 'falla', 'falla']);
turno("Zapas Lanús, vendemos zapatillas deportivas y urbanas en Lanús, colores negro y dorado", $c, $cfg);
$r = espera_pasa($c, 6);
caso('si la API falla también valen las reglas', !empty($c['lead_creado']), implode(' | ', (array)$r));

echo "\n— 8b. Con la espera en 0 minutos se arma en el mismo turno (como el 9-nov) —\n";
$cfg0 = ['datos_demo_espera_min' => 0] + $cfg;
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas en Lanús'])]);
$r = turno('Zapas Lanús, zapatillas en Lanús', $c, $cfg0);
caso('en el turno: ficha y confirmación', count($r) === 1 && str_starts_with((string)$r[0], 'Perfecto') && !empty($c['lead_creado']), implode(' | ', $r));
caso('los minutos: 120 de fábrica (11-nov), de 0 a 120, lo raro vuelve a 120', wabot_datos_demo_espera_min([]) === 120 && wabot_datos_demo_espera_min(['datos_demo_espera_min' => 0]) === 0
    && wabot_datos_demo_espera_min(['datos_demo_espera_min' => 500]) === 120 && wabot_datos_demo_espera_min(['datos_demo_espera_min' => 12]) === 12);
$rc = wabot_datos_demo_espera_correr(['datos_por_chat' => false] + $cfg, time());
caso('con el pedido por chat apagado el cron no hace nada', ($rc['motivo'] ?? '') === 'apagado');

echo "\n— 9. Con datos_por_chat apagado vuelve el link —\n";
$cfgLink = array_merge($cfg, ['datos_por_chat' => false]);
$c = cv('5491100009020TEST');
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos una tienda online.'], 'ficha' => ['rubro' => 'zapatillas', 'que_vende' => 'zapatillas']])]);
turno('Vendo zapatillas', $c, $cfgLink);
oa([dc(['accion' => 'formulario', 'intencion' => 'acepta'])]);
$r = turno('Dale', $c, $cfgLink);
caso('sale el link de gokywebs.com/form/', tiene_form($r), implode(' | ', $r));
caso('y no el pedido por el chat', !count(array_filter($r, fn($m) => str_contains((string)$m, INTRO))));
caso('wabot_oferta_diseno_form_texto también', tiene_form([wabot_oferta_diseno_form_texto($c, $cfgLink)]));

echo "\n— 10. El texto de confirmación —\n";
$c = cv();
$t = wabot_datos_demo_confirmacion_texto($c, $cfg, strtotime('today 10:00'));
caso('a la mañana: hoy a la tarde', str_contains($t, 'hoy a la tarde'), $t);
$t = wabot_datos_demo_confirmacion_texto($c, $cfg, strtotime('today 16:00'));
caso('a la tarde: mañana', str_contains($t, 'para mañana'), $t);
caso('con {saludo} no queda la llave', !str_contains($t, '{'));

echo "\n— 11. «Dale aguantame» no arma la ficha (10-nov, GREY) —\n";
caso('aguantame, esperame, bancame, un toque: pide tiempo', wabot_datos_demo_pide_tiempo('Dale aguantame') && wabot_datos_demo_pide_tiempo('esperame un toque')
    && wabot_datos_demo_pide_tiempo('Bancame que busco el logo') && wabot_datos_demo_pide_tiempo('ahora te paso el resto'));
caso('«listo», «eso es todo», «espero la demo» no piden tiempo', !wabot_datos_demo_pide_tiempo('Listo') && !wabot_datos_demo_pide_tiempo('eso es todo')
    && !wabot_datos_demo_pide_tiempo('Dale, espero la demo'));
caso('«Dale aguantame» no es un «listo»', !wabot_datos_demo_es_acuse('Dale aguantame') && wabot_datos_demo_es_acuse('Dale') && wabot_datos_demo_es_acuse('Listo, eso es todo'));
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
$r = turno('GREY INOVACION', $c, $cfg);
caso('manda el nombre: espera', $r === [] && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
oa([dc(['accion' => 'esperar'])]);
$r = turno('Dale aguantame', $c, $cfg);
caso('«Dale aguantame»: la ficha NO se arma', empty($c['lead_creado']) && wabot_datos_demo_espera_sigue($c) && !count(array_filter($r, fn($m) => str_starts_with((string)$m, 'Perfecto, con eso'))), implode(' | ', $r));
oa([], [dd(['nombre_negocio' => 'GREY INNOVACIÓN', 'resumen' => 'Promoción de APEX AIMS por afiliación', 'colores' => 'azul eléctrico y gris plata'])]);
$r = turno("Nombre: GREY INNOVACIÓN\nQué ofrezco: promoción de APEX AIMS por afiliación\nColores: azul eléctrico y gris plata", $c, $cfg);
$r = espera_pasa($c, 6);
caso('con el brief completo, al vencer la espera se arma con todo', !empty($c['lead_creado']) && str_contains((string)$c['descripcion'], 'APEX AIMS') && str_contains((string)$c['colores'], 'azul'), implode(' | ', (array)$r));

echo "\n— 12. Solo el flyer o fotos después del pedido (10-nov, Walter) —\n";
$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', '[foto] Mandó una imagen promocional de alquiler turístico con fotos de los espacios.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'flyer.jpg']);
caso('cuenta el material mandado después del pedido', wabot_datos_demo_material_recibido($c) === 1);
oa([dc(['accion' => 'responder', 'mensajes' => ['Sí, nos sirve, gracias!']])], [dd(['es_datos' => false])]);
$r = turno('Tengo un flayer puede ser', $c, $cfg);
caso('el flujo agradece el material como siempre', count($r) === 1 && str_contains((string)$r[0], 'nos sirve'), implode(' | ', $r));
caso('y la charla queda esperando para armar', wabot_datos_demo_espera_sigue($c) && !empty($c['datos_demo_parcial']['_material']) && empty($c['lead_creado']));
$r = turno('Okey', $c, $cfg);
caso('al «Okey»: con el rubro sabido y sin nombre, se le pide el nombre', count($r) === 1 && str_contains((string)$r[0], 'el nombre de tu negocio') && !str_contains((string)$r[0], 'resumen'), implode(' | ', $r));
oa([], [dd(['nombre_negocio' => 'Cabaña Los Coihues'])]);
turno('Cabaña Los Coihues', $c, $cfg);
$r = espera_pasa($c, 6);
caso('con el nombre se arma la ficha', !empty($c['lead_creado']) && ($c['nombre_negocio'] ?? '') === 'Cabaña Los Coihues' && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));
$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', '[foto] Mandó el flyer.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'flyer.jpg']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Sí, nos sirve, gracias!']])], [dd(['es_datos' => false])]);
turno('Tengo un flayer puede ser', $c, $cfg);
oa([], [dd(['es_datos' => false])]);
$r = espera_pasa($c, 6);
caso('si no escribe más, a los minutos el cron le pide el nombre', is_array($r) && count($r) === 1 && str_contains((string)$r[0], 'el nombre de tu negocio') && empty($c['lead_creado']), implode(' | ', (array)$r));
$c = cv_con_pedido(['nombre_negocio' => 'Zapas Lanús']);
wabot_conv_transcript($c, 'cliente', '[foto] Mandó el logo.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'logo.jpg']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Gracias, lo sumamos!']])]);
turno('Ahí va el logo', $c, $cfg);
$r = espera_pasa($c, 6);
caso('con el nombre y el rubro ya sabidos, las fotos solas alcanzan para armar', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));

echo "\n— 13. Datos que llegan después de armada la ficha (10-nov, GREY) —\n";
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
turno('GREY INOVACION', $c, $cfg);
turno('Listo', $c, $cfg);
caso('ficha armada con el nombre solo', !empty($c['lead_creado']) && ($c['colores'] ?? '') === 'A elección del diseñador');
oa([], []);
caso('un mensaje corto después no gasta lectura', wabot_datos_demo_tardios($c, $cfg) === false && count(pedidos_datos()) === 0);
unset($GLOBALS['WABOT_TEST_DATOS_TARDE_PATCH']);
$c['lead_doc'] = 'projects/prueba/databases/(default)/documents/propuestas/FICHATEST';   // el alta simulada no deja documento
wabot_conv_transcript($c, 'cliente', "Nombre de mi negocio: GREY INNOVACIÓN.\nQué ofrezco: promoción de APEX AIMS mediante afiliación.\nColores: azul eléctrico, azul profundo, gris plata y blanco.\nIncluir: portada con mi imagen, preguntas frecuentes, botón a mi enlace de afiliada.");
oa([], [dd(['nombre_negocio' => 'GREY INNOVACIÓN', 'resumen' => 'Promoción y comercialización de APEX AIMS mediante afiliación', 'colores' => 'Azul eléctrico, azul profundo, gris plata y blanco',
             'incluir' => 'Portada con su imagen, preguntas frecuentes, botón a su enlace de afiliada'])]);
$ok = wabot_datos_demo_tardios($c, $cfg);
caso('el brief que llega después se lee', $ok === true && count(pedidos_datos()) === 1);
caso('y pisa lo anterior en la charla', str_contains((string)$c['descripcion'], 'APEX AIMS') && str_contains((string)$c['colores'], 'Azul eléctrico') && str_contains((string)$c['incluir'], 'preguntas frecuentes'));
caso('queda anotado como actualización', str_contains(linea_sistema($c, '[Datos de la demo por chat: actualización]'), 'APEX AIMS'));
$patch = (array)($GLOBALS['WABOT_TEST_DATOS_TARDE_PATCH'] ?? []);
caso('la ficha se completa: colores, rubro y objetivos', str_contains((string)($patch['colores']['stringValue'] ?? ''), 'Azul eléctrico')
    && str_contains((string)($patch['objetivos']['stringValue'] ?? ''), 'preguntas frecuentes') && str_contains((string)($patch['rubro']['stringValue'] ?? ''), 'APEX AIMS'));
caso('solo campos que las reglas de Firestore dejan tocar sin login', $patch && !array_diff(array_keys($patch), ['nombre_negocio', 'rubro', 'negocio_rubro', 'colores', 'color_principal', 'color_secundario', 'color_fondos', 'instagram', 'objetivos', 'updatedAt']));
caso('con el bot siguiendo hasta la demo no queda pendiente para Pablo (lo acusa el bot)', empty($c['handoff_pendiente']) && empty($c['bot_off']));
caso('lo ya leído no se vuelve a leer', wabot_datos_demo_tardios($c, $cfg) === false && count(pedidos_datos()) === 1);
wabot_conv_transcript($c, 'cliente', 'Fíjate si ese dominio o esa web ya la tiene otra persona por favor');
oa([], [dd(['es_datos' => false])]);
caso('una consulta larga que no son datos no cambia nada', wabot_datos_demo_tardios($c, $cfg) === false && !str_contains((string)$c['descripcion'], 'dominio'));
$c['presentado_ts'] = time();
wabot_conv_transcript($c, 'cliente', "Otra cosa: cambiame los colores a rojo y negro, y sumá una sección de testimonios de clientes.");
oa([], [dd(['colores' => 'rojo y negro'])]);
caso('con la demo ya entregada no se toca la ficha', wabot_datos_demo_tardios($c, $cfg) === false && str_contains((string)$c['colores'], 'Azul'));

echo "\n— 14. Flujo comercial: «mañana te mando», la pregunta de reservas, soy_bot y cobro_banco (10-nov) —\n";
caso('la pregunta de reservas de un alojamiento se reconoce', wabot_comercial_es_pregunta_turnos('Para tu web propia, preferís coordinar las reservas por WhatsApp o que puedan reservar directamente desde la página?'));
caso('y la de siempre también', wabot_comercial_es_pregunta_turnos('Querés que la gente solamente te escriba por WhatsApp o también que pueda reservar turnos desde la página?'));
caso('una frase sin pregunta, no', !wabot_comercial_es_pregunta_turnos('Podés coordinar las reservas por WhatsApp desde la página.'));
$c = cv_cotizada();
wabot_conv_transcript($c, 'cliente', 'una duda');
wabot_conv_transcript($c, 'cliente', 'otra duda');
$dR = ['intencion' => 'ninguna'];
caso('con una respuesta armada, la demo se vuelve a ofrecer', wabot_comercial_reoferta_corresponde($dR, 'Y cómo se paga?', $c, $cfg, [['t' => 'Se paga por transferencia.']]) === true);
$c['retomar_ts'] = time() + 86400;
caso('si avisó que vuelve mañana, no se le insiste con la demo', wabot_comercial_reoferta_corresponde($dR, 'Y cómo se paga?', $c, $cfg, [['t' => 'Se paga por transferencia.']]) === false);
caso('soy_bot no arranca con «No»', str_starts_with((string)$cfg['info']['soy_bot'], 'Soy el asistente automático'));
caso('cobro_banco existe y el asistente la puede pedir', in_array('cobro_banco', wabot_comercial_info_claves($cfg), true) && str_contains((string)$cfg['info']['cobro_banco'], 'transferencia'));

echo "\n— 15. Revisión del 10-nov: más tiempo al que lo pide, material una sola vez, charlas largas —\n";
caso('«un toque de dorado», «La Espera Bar» y «Banca Digital» no piden tiempo', !wabot_datos_demo_pide_tiempo('Pelu Mari, negro con un toque de dorado')
    && !wabot_datos_demo_pide_tiempo('La Espera Bar, cervezas artesanales') && !wabot_datos_demo_pide_tiempo('Banca Digital SRL'));
caso('y esos mensajes se leen como datos', !wabot_datos_demo_es_acuse_o_posterga('Pelu Mari, negro con un toque de dorado') && !wabot_datos_demo_es_acuse_o_posterga('La Espera Bar, cervezas artesanales'));
caso('«Pelu Mari, ahora te paso el logo» trae un dato: se lee', !wabot_datos_demo_es_acuse_o_posterga('Pelu Mari, ahora te paso el logo'));
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
turno('GREY INOVACION', $c, $cfg);
oa([dc(['accion' => 'esperar'])]);
turno('Dale aguantame', $c, $cfg);
caso('pidió tiempo: a los 6 minutos el cron todavía no arma', espera_pasa($c, 6) === null && empty($c['lead_creado']) && wabot_datos_demo_espera_sigue($c));
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
$r = espera_pasa($c, 31);
caso('a los 31 minutos arma con lo que hay', is_array($r) && !empty($c['lead_creado']), implode(' | ', (array)$r));
$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', 'GREY INOVACION');
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
turno('Dale aguantame', $c, $cfg);
caso('el nombre y «aguantame» en la misma tanda: también espera', wabot_datos_demo_espera_sigue($c) && espera_pasa($c, 6) === null && empty($c['lead_creado']));
oa([], [dd(['nombre_negocio' => 'GREY INNOVACIÓN', 'resumen' => 'Afiliada de APEX AIMS', 'colores' => 'azul y plata'])]);
turno('GREY INNOVACIÓN, afiliada de APEX AIMS, colores azul y plata', $c, $cfg);
$r = espera_pasa($c, 6);
caso('si después manda los datos, vuelve el silencio de 5 minutos', is_array($r) && !empty($c['lead_creado']) && str_contains((string)$c['descripcion'], 'APEX'), implode(' | ', (array)$r));

$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', '[foto] Mandó el flyer.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'flyer.jpg']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Sí, nos sirve, gracias!']])], [dd(['es_datos' => false])]);
turno('Tengo un flayer puede ser', $c, $cfg);
caso('el material lo lee el turno, una vez', count(pedidos_datos()) === 1 && wabot_datos_demo_espera_sigue($c));
oa([], []);
$r = espera_pasa($c, 6);
caso('el cron no vuelve a pagar la misma lectura y pide el nombre', count(pedidos_datos()) === 0 && is_array($r) && count($r) === 1 && str_contains((string)$r[0], 'el nombre de tu negocio'), implode(' | ', (array)$r));
oa([dc(['accion' => 'responder', 'mensajes' => ['Lo usamos para el título de tu web.']])], [dd(['es_datos' => false])]);
turno('Para qué necesitan el nombre?', $c, $cfg);
caso('otro mensaje sin fotos nuevas no vuelve a armar la espera', !wabot_datos_demo_espera_sigue($c) && empty($c['handoff_pendiente']));
wabot_conv_transcript($c, 'cliente', '[foto] Mandó otra foto.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'otra.jpg']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Gracias, la sumamos!']])], [dd(['es_datos' => false])]);
turno('Ahí va otra foto del frente', $c, $cfg);
caso('una foto nueva sí vuelve a anotarla', wabot_datos_demo_espera_sigue($c) && (int)($c['datos_demo_material_n'] ?? 0) === 2);

$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús'])]);
turno('Zapas Lanús', $c, $cfg);
turno('Listo', $c, $cfg);
caso('la ficha guarda la firma del último renglón leído', !empty($c['lead_creado']) && (string)($c['datos_demo_tarde_firma'] ?? '') !== '');
$c['lead_doc'] = 'projects/prueba/databases/(default)/documents/propuestas/FICHATEST2';
$c['transcript'] = array_slice($c['transcript'], -1);   // charla larga: el archivo guarda solo los últimos renglones
wabot_conv_transcript($c, 'cliente', "Colores: negro y dorado, con el logo arriba a la izquierda.\nIncluir: mapa y horarios del local de Lanús.");
oa([], [dd(['colores' => 'negro y dorado', 'incluir' => 'mapa y horarios del local'])]);
caso('con el archivo recortado igual se lee lo que llega después', wabot_datos_demo_tardios($c, $cfg) === true && str_contains((string)$c['colores'], 'dorado'));
caso('y no se relee', wabot_datos_demo_tardios($c, $cfg) === false && count(pedidos_datos()) === 1);

echo "\n— 16. Datos que se leían como postergación o como un «ok» (revisión del 10-nov) —\n";
caso('con coma o dos puntos son datos aunque diga «te paso» o «mañana»', !wabot_datos_demo_es_acuse_o_posterga('Te paso los datos: Pelu Mari, cortes y color')
    && !wabot_datos_demo_es_acuse_o_posterga('Kiosco El Sol, abierto de mañana y tarde'));
caso('un negocio que se llama «Joya Mística» o «Dale Gas» no es un «ok»', !wabot_datos_demo_es_acuse_o_posterga('Joya Mística') && !wabot_datos_demo_es_acuse_o_posterga('Dale Gas')
    && !wabot_datos_demo_es_acuse('Joya Mística') && !wabot_datos_demo_es_acuse('Dale Gas'));
caso('los acuses de siempre siguen siéndolo', wabot_datos_demo_es_acuse_o_posterga('Dale, gracias') && wabot_datos_demo_es_acuse_o_posterga('ok perfecto') && wabot_datos_demo_es_acuse_o_posterga('Listo')
    && wabot_datos_demo_es_acuse('Dale gracias') && wabot_datos_demo_es_acuse('Listo, eso es todo') && wabot_datos_demo_es_acuse('ok'));
caso('las postergaciones también', wabot_datos_demo_es_acuse_o_posterga('Ok, mañana te mando todo') && wabot_datos_demo_es_acuse_o_posterga('después te paso los datos')
    && wabot_datos_demo_es_acuse_o_posterga('a la noche lo veo') && !wabot_datos_demo_es_acuse('Ok, mañana te mando todo'));
caso('«todavía no está listo el logo» no es un «listo»', !wabot_datos_demo_es_acuse('todavía no está listo el logo') && wabot_datos_demo_es_acuse('ya está listo'));

echo "\n— 17. La ficha que Firestore no creó no se confirma: se reintenta (revisión del 10-nov) —\n";
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas en Lanús'])]);
turno('Zapas Lanús, zapatillas en Lanús', $c, $cfg);
$GLOBALS['WABOT_TEST_LEAD_FALLA'] = true;
$r = espera_pasa($c, 6);
caso('Firestore falla: no se le confirma nada y la charla sigue pendiente', $r === [] && empty($c['lead_creado']) && empty($c['form_completado_ts'])
    && wabot_datos_demo_pendiente($c) && empty($c['bot_off']) && linea_sistema($c, '[Datos de la demo por chat]') === '', json_encode($r, JSON_UNESCAPED_UNICODE));
caso('queda anotada para el reintento y a la vista de Pablo', wabot_datos_demo_espera_sigue($c) && (int)($c['datos_demo_ficha_fallos'] ?? 0) === 1 && !empty($c['handoff_pendiente']));
unset($GLOBALS['WABOT_TEST_LEAD_FALLA']);
oa([], []);
$r = espera_pasa($c, 12);
caso('al reintento entra: ficha, confirmación y sin pagar otra lectura', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto') && count(pedidos_datos()) === 0
    && linea_sistema($c, '[Datos de la demo por chat]') !== '' && !isset($c['datos_demo_ficha_fallos']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas en Lanús'])]);
turno('Zapas Lanús, zapatillas en Lanús', $c, $cfg);
$GLOBALS['WABOT_TEST_LEAD_FALLA'] = true;
for ($iF = 1; $iF <= 6; $iF++) espera_pasa($c, 6 * $iF);
unset($GLOBALS['WABOT_TEST_LEAD_FALLA']);
caso('a la sexta falla deja de reintentar y lo ve Pablo', (int)($c['datos_demo_ficha_fallos'] ?? 0) === 6 && !wabot_datos_demo_espera_sigue($c) && !empty($c['handoff_pendiente']) && empty($c['lead_creado']));

echo "\n— 18. La charla la lleva Pablo: la ficha se arma en silencio (revisión del 10-nov) —\n";
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Pelu Mari', 'resumen' => 'Cortes y color'])]);
turno('Pelu Mari, cortes y color', $c, $cfg);
wabot_conv_transcript($c, 'humano', 'Hola Mari, te leo yo por acá.');
wabot_conv_tomar_control($c);
$r = espera_pasa($c, 6);
$confirmo = count(array_filter($c['transcript'], fn($f) => ($f['q'] ?? '') === 'bot' && str_starts_with((string)($f['t'] ?? ''), 'Perfecto, con eso')));
caso('Pablo tomó la charla mientras mandaba los datos: la ficha se arma y el bot no le escribe', $r === [] && !empty($c['lead_creado']) && $confirmo === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_con_pedido();
oa([], [dd(['colores' => 'rojo'])]);
turno('Mis colores son rojo y blanco', $c, $cfg);
wabot_conv_tomar_control($c);
$r = espera_pasa($c, 6);
caso('si falta lo esencial tampoco le escribe: queda para Pablo', $r === [] && empty($c['lead_creado'])
    && !count(array_filter($c['transcript'], fn($f) => ($f['q'] ?? '') === 'bot' && str_contains((string)($f['t'] ?? ''), 'Para arrancar me falta'))), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
wabot_conv_transcript($c, 'humano', wabot_datos_demo_texto($c, $cfg));   // Pablo pega el pedido desde el panel
wabot_conv_tomar_control($c);
caso('el pedido que manda Pablo deja los datos pendientes, con el bot apagado en ese chat', wabot_datos_demo_pendiente($c) && !empty($c['bot_off']));
oa([], []);
wabot_conv_transcript($c, 'cliente', 'Dale gracias');
caso('un «dale gracias» no gasta lectura', wabot_datos_demo_en_silencio($c, $cfg) === false && count(pedidos_datos()) === 0);
wabot_conv_transcript($c, 'cliente', 'Zapas Lanús, vendemos zapatillas, colores negro y dorado');
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas', 'colores' => 'negro y dorado'])]);
caso('lo que contesta el cliente se lee sin mandarle nada', wabot_datos_demo_en_silencio($c, $cfg) === true && count(pedidos_datos()) === 1 && wabot_datos_demo_espera_sigue($c));
caso('no se vuelve a leer si no escribió nada nuevo', wabot_datos_demo_en_silencio($c, $cfg) === false && count(pedidos_datos()) === 1);
$r = espera_pasa($c, 6);
caso('cuando deja de escribir se arma la ficha, en silencio', $r === [] && !empty($c['lead_creado']) && ($c['nombre_negocio'] ?? '') === 'Zapas Lanús' && ($c['colores'] ?? '') === 'negro y dorado',
    json_encode([$r, $c['nombre_negocio'] ?? null], JSON_UNESCAPED_UNICODE));
$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', 'Zapas Lanús, vendemos zapatillas, colores negro y dorado');
oa([], [dd(['nombre_negocio' => 'no debería leerse acá'])]);
caso('con el bot atendiendo no hace nada: lo lleva el turno', wabot_datos_demo_en_silencio($c, $cfg) === false && count(pedidos_datos()) === 0);

echo "\n— 19. Con la demo ya publicada, un nombre escrito distinto no cambia el de la ficha —\n";
$GLOBALS['WABOT_TEST_DEMO_PUBLICADA'] = [];
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
turno('GREY INOVACION', $c, $cfg);
turno('Listo', $c, $cfg);
$c['lead_doc'] = 'projects/prueba/databases/(default)/documents/propuestas/FICHATEST3';
wabot_conv_transcript($c, 'cliente', "Nombre de mi marca: GREY INNOVACIÓN.\nColores: azul eléctrico y gris plata.\nIncluir: preguntas frecuentes.");
oa([], [dd(['nombre_negocio' => 'GREY INNOVACIÓN', 'colores' => 'azul eléctrico y gris plata', 'incluir' => 'preguntas frecuentes'])]);
wabot_datos_demo_tardios($c, $cfg);
caso('sin demo publicada, el nombre nuevo se toma', ($c['nombre_negocio'] ?? '') === 'GREY INNOVACIÓN', (string)($c['nombre_negocio'] ?? ''));
$GLOBALS['WABOT_TEST_DEMO_PUBLICADA'] = ['greyinovacion'];
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'GREY INOVACION'])]);
turno('GREY INOVACION', $c, $cfg);
turno('Listo', $c, $cfg);
$c['lead_doc'] = 'projects/prueba/databases/(default)/documents/propuestas/FICHATEST4';
wabot_conv_transcript($c, 'cliente', "Nombre de mi marca: GREY INNOVACIÓN.\nColores: azul eléctrico y gris plata.\nIncluir: preguntas frecuentes.");
oa([], [dd(['nombre_negocio' => 'GREY INNOVACIÓN', 'colores' => 'azul eléctrico y gris plata', 'incluir' => 'preguntas frecuentes'])]);
wabot_datos_demo_tardios($c, $cfg);
caso('con la demo publicada, la ficha conserva el nombre (y la carpeta)', ($c['nombre_negocio'] ?? '') === 'GREY INOVACION' && str_contains((string)$c['colores'], 'azul eléctrico'), (string)($c['nombre_negocio'] ?? ''));
caso('y el nombre nuevo queda anotado para Pablo', str_contains(linea_sistema($c, '[Datos de la demo por chat: actualización]'), 'Nombre que escribió después: GREY INNOVACIÓN'));
caso('la ficha se actualiza con el nombre de antes', (string)(($GLOBALS['WABOT_TEST_DATOS_TARDE_PATCH']['nombre_negocio']['stringValue'] ?? '')) === 'GREY INOVACION');
caso('un nombre que da la misma carpeta sí se acepta', wabot_datos_demo_nombre_fijo(['nombre_negocio' => 'GREY INOVACION'], 'Grey Inovación') === false);
unset($GLOBALS['WABOT_TEST_DEMO_PUBLICADA']);

echo "\n— 20. Charlas del 11-nov: demo con contenido de ejemplo, logo con el nombre, fotos cortadas —\n";
// Mica: «Podrías preparar la demo con otros datos», con el rubro ya sabido.
$c = cv_con_pedido();
oa([], [dd(['es_datos' => false, 'pide_ejemplo' => true])]);
$r = turno("Podrías preparar la demo con otros datos. Es solo para ver cómo quedaría después yo me imagino mis productos en la página", $c, $cfg);
caso('pide la demo con contenido de ejemplo: la ficha se arma en el turno', !empty($c['lead_creado']) && count($r) === 1 && str_starts_with((string)$r[0], 'Perfecto, con eso'), implode(' | ', $r));
caso('sin pedirle el nombre', !str_contains(implode(' ', $r), 'el nombre de tu negocio'));
caso('la ficha lo dice', str_contains(linea_sistema($c, '[Datos de la demo por chat]'), 'contenido de ejemplo') && str_contains((string)($c['incluir'] ?? ''), 'Contenido de ejemplo'), linea_sistema($c, '[Datos de la demo por chat]'));
$c = cv_con_pedido();
oa([], [dd(['es_datos' => false, 'pide_ejemplo' => false])]);
oa([dc(['accion' => 'responder', 'mensajes' => ['Dale, cuando puedas me lo pasás.']])], [dd(['es_datos' => false])]);
$r = turno('Ahora estoy trabajando, después veo bien qué te mando de todo esto', $c, $cfg);
caso('una postergación sigue sin armar la ficha', empty($c['lead_creado']), implode(' | ', $r));

// El carpintero: Pablo en el chat, fotos y una imagen con el logo y los servicios, sin escribir el nombre.
$c = cv_con_pedido();
wabot_conv_tomar_control($c);
wabot_conv_transcript($c, 'cliente', 'Dame un rato y te lo armo');
wabot_conv_transcript($c, 'cliente', '[foto] Mandó una foto de un juego de living exterior de madera rústica.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'a.jpg']);
wabot_conv_transcript($c, 'cliente', 'Instagram no tengo');
wabot_conv_transcript($c, 'cliente', '[foto] Mandó', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'b.jpg']);
wabot_conv_transcript($c, 'cliente', '[foto] Mandó el logo de su carpintería «Taller Baum» con sus servicios: muebles a medida y restauración.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'c.jpg']);
$fotos = wabot_datos_demo_fotos_texto($c);
caso('lo que se ve en las fotos se junta (sin el «Mandó» vacío)', substr_count($fotos, "\n- ") === 1 && str_contains($fotos, 'Taller Baum') && !preg_match('/^- Mandó$/m', $fotos), $fotos);
oa([], [dd(['nombre_negocio' => 'Taller Baum', 'resumen' => 'Muebles a medida y restauración'])]);
caso('con Pablo en el chat se lee igual', wabot_datos_demo_en_silencio($c, $cfg) === true);
$entrada = json_encode(pedidos_datos()[0] ?? [], JSON_UNESCAPED_UNICODE);
caso('el lector recibe lo que se ve en las fotos', str_contains($entrada, 'LO QUE SE VE EN SUS FOTOS') && str_contains($entrada, 'Taller Baum'));
caso('y el esquema pregunta si pide contenido de ejemplo', str_contains($entrada, 'pide_ejemplo'));
$r = espera_pasa($c, 6);
caso('con el nombre del logo la ficha se arma, en silencio', $r === [] && !empty($c['lead_creado']) && ($c['nombre_negocio'] ?? '') === 'Taller Baum', json_encode([$r, $c['nombre_negocio'] ?? null], JSON_UNESCAPED_UNICODE));

// Solo fotos con el bot atendiendo: el cron lee una vez lo que se ve antes de pedir el nombre.
$c = cv_con_pedido();
wabot_conv_transcript($c, 'cliente', '[foto] Mandó una imagen con el logo de «Taller Baum» y sus servicios.', ['clase' => 'imagen', 'mime' => 'image/jpeg', 'archivo' => 'logo.jpg']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Gracias, lo sumamos!']])], []);
turno('Ok', $c, $cfg);
caso('una foto con un «Ok» no gasta lectura en el turno', count(pedidos_datos()) === 0 && wabot_datos_demo_espera_sigue($c));
oa([], [dd(['nombre_negocio' => 'Taller Baum'])]);
$r = espera_pasa($c, 6);
caso('el cron lee el logo y arma sin pedir el nombre', count(pedidos_datos()) === 1 && !empty($c['lead_creado']) && ($c['nombre_negocio'] ?? '') === 'Taller Baum'
    && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));

// Descripciones cortadas por el tope de tokens.
caso('«Mandó» solo no queda como descripción', wabot_media_texto_hasta_frase('Mandó') === '');
caso('una cortada queda hasta la última frase entera',
    wabot_media_texto_hasta_frase('Mandó el logo de su carpintería Taller Baum. Incluye servicios (muebles a medida y') === 'Mandó el logo de su carpintería Taller Baum.');
caso('una entera queda igual', wabot_media_texto_hasta_frase('Mandó una foto de sus muebles de madera clara.') === 'Mandó una foto de sus muebles de madera clara.');
// Gemini simulado: sin «sin red» por un momento (el gancho no deja salir nada) y sin circuito abierto.
$sinRed = $GLOBALS['WABOT_TEST_SIN_RED'] ?? null;
unset($GLOBALS['WABOT_TEST_SIN_RED']);
$circuitoIa = WABOT_DATA . '/ia-circuit.json';
$circuitoIaAntes = @file_get_contents($circuitoIa);
@unlink($circuitoIa);
if (wabot_ia_disponible() && WABOT_GEMINI_KEY !== 'COMPLETAR') {
    $cuerpos = [];
    $GLOBALS['WABOT_TEST_GEMINI_HTTP'] = function ($modelo, $body) use (&$cuerpos) {
        $cuerpos[] = json_decode($body, true);
        return [200, json_encode(['candidates' => [['finishReason' => 'STOP', 'content' => ['parts' => [
            ['text' => 'pensando…', 'thought' => true], ['text' => 'Mandó el logo de '], ['text' => 'Taller Baum.']]]]]], JSON_UNESCAPED_UNICODE)];
    };
    caso('junta todas las partes de la descripción, sin el razonamiento', wabot_media_a_texto('x', 'image/jpeg', 'imagen') === 'Mandó el logo de Taller Baum.');
    caso('el tope de las fotos ya no es 800', (int)($cuerpos[0]['generationConfig']['maxOutputTokens'] ?? 0) >= 2000);
    $GLOBALS['WABOT_TEST_GEMINI_HTTP'] = function ($modelo, $body) {
        return [200, json_encode(['candidates' => [['finishReason' => 'MAX_TOKENS', 'content' => ['parts' => [['text' => 'Mandó']]]]]])];
    };
    caso('cortada por el tope y sin frase entera: la foto queda sin descripción', wabot_media_a_texto('x', 'image/jpeg', 'imagen') === null);
    unset($GLOBALS['WABOT_TEST_GEMINI_HTTP']);
} else {
    echo "  (sin Gemini en esta PC: las pruebas de wabot_media_a_texto se saltean)\n";
}
if ($sinRed !== null) $GLOBALS['WABOT_TEST_SIN_RED'] = $sinRed;
if ($circuitoIaAntes !== false) @file_put_contents($circuitoIa, $circuitoIaAntes);

echo "\n— 21. La espera de 2 h (Pablo, 11-nov: «la gente sigue mandando info») —\n";
$cfg5 = $cfg;
$cfg['datos_demo_espera_min'] = 120;
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas'])]);
$r = turno('Zapas Lanús, vendemos zapatillas', $c, $cfg);
caso('con los primeros datos le acusa recibo, sin confirmar la demo', count($r) === 1 && str_starts_with((string)$r[0], '¡Anotado!') && empty($c['lead_creado']) && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
oa([dc(['accion' => 'esperar'])]);
$r = turno('Gracias', $c, $cfg);
caso('un «gracias» al acuse no arma la ficha', empty($c['lead_creado']) && wabot_datos_demo_espera_sigue($c), implode(' | ', $r));
oa([dc(['accion' => 'esperar'])]);
turno('Listo', $c, $cfg);
caso('un «listo» suelto tampoco', empty($c['lead_creado']));
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas', 'colores' => 'negro y dorado'])]);
$r = turno('Los colores son negro y dorado', $c, $cfg);
caso('lo que manda después no repite el acuse', $r === [] && empty($c['lead_creado']), implode(' | ', $r));
caso('a los 60 minutos todavía espera', espera_pasa($c, 60) === null && empty($c['lead_creado']));
$r = espera_pasa($c, 121);
caso('a las 2 h sin escribir arma con todo y confirma', !empty($c['lead_creado']) && ($c['colores'] ?? '') === 'negro y dorado' && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', (array)$r));
$c = cv_con_pedido();
oa([], [dd(['nombre_negocio' => 'Zapas Lanús', 'resumen' => 'Zapatillas'])]);
turno('Zapas Lanús, vendemos zapatillas', $c, $cfg);
$r = turno('Eso es todo', $c, $cfg);
caso('«eso es todo» la arma al instante', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', $r));
caso('cierres explícitos sí, «ok»/«listo»/«gracias» no', wabot_datos_demo_es_acuse('Nada más', true) && wabot_datos_demo_es_acuse('Ya te mandé todo', true)
    && !wabot_datos_demo_es_acuse('ok', true) && !wabot_datos_demo_es_acuse('Listo', true) && !wabot_datos_demo_es_acuse('Gracias!', true)
    && !wabot_datos_demo_es_acuse('No es todo, falta el logo', true));
$c = cv_con_pedido();
oa([], [dd(['es_datos' => false, 'pide_ejemplo' => true])]);
$r = turno('Armala con datos de ejemplo, es para ver cómo queda', $c, $cfg);
caso('la demo con contenido de ejemplo no espera las 2 h', !empty($c['lead_creado']) && str_starts_with((string)($r[0] ?? ''), 'Perfecto'), implode(' | ', $r));
$cfg = $cfg5;

echo "\n— 22. Armando la demo, los chats no quedan como sin leer (Pablo, 11-nov) —\n";
$esSinLeer = function ($c) { return !empty($c['handoff_pendiente']) || wabot_conv_es_sl($c); };
$c = cv_con_pedido();
caso('con los datos pedidos se está armando la demo', wabot_comercial_armando_demo($c));
oa([dc(['accion' => 'esperar'])]);
turno('Haaa ok', $c, $cfg);
caso('«Haaa ok» (Carina) no le queda a Pablo', !$esSinLeer($c), json_encode($c['comercial_ultimo'] ?? null, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'esperar'])]);
turno('Mañana sin falta te paso todo', $c, $cfg);
caso('«Mañana sin falta te paso todo» (Gisela) tampoco', !$esSinLeer($c));
oa([dc(['accion' => 'esperar'])]);
turno('Bueno te preparo la información y te la paso. Me interesa tener una página', $c, $cfg);
caso('«te preparo la información y te la paso» (Rodrigo) tampoco', !$esSinLeer($c));
oa([dc(['accion' => 'esperar'])]);
turno('', $c, $cfg);
caso('una foto o un sticker sin texto mientras manda los datos tampoco', !$esSinLeer($c));
oa([dc(['accion' => 'humano', 'motivo' => 'Quiere pagar ya'])]);
turno('Puedo pagar ahora y me la hacen directo?', $c, $cfg);
caso('lo que sí es para Pablo (la acción «humano») le queda', !empty($c['handoff_pendiente']));
$c = cv_cotizada();
oa([dc(['accion' => 'esperar'])]);
turno('Lo voy a pensar con mi socio', $c, $cfg);
caso('antes de pedir los datos, un «esperar» sin respuesta sigue quedándole a Pablo', !wabot_comercial_armando_demo($c) && !empty($c['handoff_pendiente']));
$c = cv_con_pedido();
$c['presentado_ts'] = time();
caso('con la demo entregada ya no es «armando la demo»', !wabot_comercial_armando_demo($c));

todo_ok();
