<?php
/**
 * wabot/test-ia.php — OpenAI en el bot (27-sep-2026), sin red (solo CLI).
 *
 * La API de OpenAI se simula con WABOT_TEST_OPENAI_HTTP: cada prueba le carga
 * las respuestas en orden y mira lo que se le pidió. Cubre la configuración,
 * el pedido (Structured Outputs), lo que sale al cliente en cada acción, los
 * controles de los mensajes, las fallas y el respaldo del motor, el costo, el
 * modo shadow y, de punta a punta por el webhook, el cliente que sigue
 * escribiendo mientras OpenAI piensa.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

$cfg = wabot_config_load();
$cfg['activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;

$tmp = sys_get_temp_dir() . '/wabot-test-ia-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_IA_SOMBRA_DIR'] = $tmp . '/sombra';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';

/** Una decisión del modelo, con lo que no se pasa en blanco. */
function decision(array $d = []) {
    $base = ['accion' => 'responder', 'mensajes' => [], 'info_claves' => [], 'tipo_web' => 'sin_definir',
             'etapa' => 'ENTENDIENDO_NEGOCIO', 'requiere_humano' => false, 'motivo' => null,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null,
                         'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) { $d['ficha'] = array_merge($base['ficha'], $d['ficha']); }
    return array_merge($base, $d);
}

/** Carga lo que va a contestar la API, en orden. Cada item: una decisión, o ['http' => ..., 'body' => ...]. */
function openai_responde(array $cola, $alLlamar = null) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) use ($alLlamar) {
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        if ($alLlamar) $alLlamar(count($GLOBALS['OA_PEDIDOS']));
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) return [0, ''];
        if (isset($sig['http'])) return [$sig['http'], (string)($sig['body'] ?? ''), (float)($sig['retry'] ?? 0)];
        if (isset($sig['crudo'])) return [200, json_encode($sig['crudo'], JSON_UNESCAPED_UNICODE)];
        return [200, json_encode([
            'id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
            'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($sig, JSON_UNESCAPED_UNICODE)]]]],
            'usage' => ['input_tokens' => 3000, 'input_tokens_details' => ['cached_tokens' => 2000], 'output_tokens' => 200,
                        'output_tokens_details' => ['reasoning_tokens' => 50], 'total_tokens' => 3200],
        ], JSON_UNESCAPED_UNICODE)];
    };
}

function pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }

/** Un cliente nuevo para OpenAI: sin la pregunta de reconocimiento hecha (test-lib la da por hecha). */
function conv_ia($clave, array $extra = []) {
    return conv_nueva($clave, array_merge(['reconocimiento_hecho' => false, 'nombre' => 'Marta'], $extra));
}

echo "— 1. Configuración y la key —\n";

caso('sin key, openai y shadow quedan en gemini (lo de siempre)',
    (function () { $k = $GLOBALS['WABOT_TEST_OPENAI_KEY']; $GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';
        $p = wabot_ia_proveedor(['ia_proveedor' => 'openai']); $GLOBALS['WABOT_TEST_OPENAI_KEY'] = $k; return $p; })() === 'gemini');
unset($GLOBALS['WABOT_TEST_IA_PROVEEDOR']);
caso('el modo sale del panel', wabot_ia_proveedor(['ia_proveedor' => 'shadow']) === 'shadow' && wabot_ia_proveedor(['ia_proveedor' => 'openai']) === 'openai');
caso('un modo inventado vuelve a gemini', wabot_ia_proveedor(['ia_proveedor' => 'claude']) === 'gemini');
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
caso('el modelo sale del panel, y sin nada es el default',
    wabot_openai_modelo(['openai_modelo' => 'gpt-6-luna']) === 'gpt-6-luna' && wabot_openai_modelo(['openai_modelo' => '']) === wabot_openai_modelo_default());
caso('un modelo con caracteres raros se ignora', wabot_openai_modelo(['openai_modelo' => 'gpt-6"; rm -rf']) === wabot_openai_modelo_default());
caso('los ajustes nuevos se guardan desde el panel', !array_diff(['ia_proveedor', 'openai_modelo', 'ia_max_mensajes', 'ia_historial', 'openai_max_tokens'], wabot_ajustes_claves()));
$src = '';
foreach (['ia.php', 'ia-instrucciones.php', 'lib.php', 'webhook.php', 'admin.php'] as $a) $src .= (string)file_get_contents(__DIR__ . '/' . $a);
caso('ninguna key de OpenAI escrita en el código', !preg_match('/sk-(proj-)?[A-Za-z0-9_\-]{20,}/', $src));
$ejemplo = (string)@file_get_contents(__DIR__ . '/../config/wabot-config.example.php');
caso('el config de ejemplo trae el lugar para la key, vacío', strpos($ejemplo, "WABOT_OPENAI_KEY") !== false && !preg_match("/WABOT_OPENAI_KEY',\s*'sk-/", $ejemplo));
$ignorado = trim((string)shell_exec('git -C ' . escapeshellarg(__DIR__ . '/..') . ' check-ignore config/wabot-config.php 2>&1'));
caso('config/wabot-config.php está fuera de git', $ignorado === 'config/wabot-config.php', $ignorado);

echo "— 2. El pedido a OpenAI —\n";

openai_responde([decision(['mensajes' => ['Buscás vender por la web, o solo mostrar tus productos?'], 'etapa' => 'ENTENDIENDO_NECESIDAD',
    'ficha' => ['rubro' => 'tu pañalera', 'que_vende' => 'pañales y juguetes']])]);
$c = conv_ia('5491100000001TEST');
$r = turno("hola\ntengo una pañalera\ny también vendo juguetes", $c, $cfg);
$p = pedidos()[0] ?? [];
$json = json_encode($p, JSON_UNESCAPED_UNICODE);
caso('una sola llamada por tanda', count(pedidos()) === 1);
caso('va con Structured Outputs estricto', ($p['text']['format']['type'] ?? '') === 'json_schema' && ($p['text']['format']['strict'] ?? false) === true);
caso('el esquema exige todos los campos',
    ($p['text']['format']['schema']['required'] ?? []) === ['accion', 'mensajes', 'info_claves', 'tipo_web', 'etapa', 'ficha', 'requiere_humano', 'motivo']);
caso('no guarda la charla en OpenAI (store: false)', ($p['store'] ?? null) === false);
caso('la key no viaja en el cuerpo', strpos($json, 'sk-test') === false);
caso('el teléfono tampoco: el cliente va como un hash', strpos($json, '5491100000001') === false && strlen((string)($p['safety_identifier'] ?? '')) === 32);
caso('las instrucciones traen el comportamiento y la información comercial',
    strpos((string)$p['instructions'], 'voseo') !== false && strpos((string)$p['instructions'], 'TIPOS DE WEB') !== false
    && strpos((string)$p['instructions'], 'tienda_online') !== false);
$ctx = (string)($p['input'][0]['content'] ?? '');
caso('el mensaje nuevo va entero, las tres partes juntas', strpos($ctx, "hola\ntengo una pañalera\ny también vendo juguetes") !== false);
caso('y no aparece repetido en el historial', substr_count($ctx, 'tengo una pañalera') === 1, $ctx);
caso('le avisa que todavía no le escribimos', strpos($ctx, 'Todavía no le escribimos') !== false);

echo "— 3. Responder —\n";

caso('sale la pregunta del modelo', $r === ['Buscás vender por la web, o solo mostrar tus productos?'], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la ficha guarda lo que entendió', wabot_ficha($c)['rubro'] === 'tu pañalera' && wabot_ficha($c)['que_vende'] === 'pañales y juguetes', json_encode(wabot_ficha($c), JSON_UNESCAPED_UNICODE));
caso('y la etapa', ($c['etapa_comercial'] ?? '') === 'ENTENDIENDO_NECESIDAD' && wabot_ia_etapa($c) === 'ENTENDIENDO_NECESIDAD');
caso('sin precio todavía', empty($c['precio_dado']));

openai_responde([decision(['mensajes' => ['¡Perfecto! Te cuento que se puede.']])]);
$c2 = conv_ia('5491100000002TEST');
$r2 = turno('se puede tener carrito?', $c2, $cfg);
caso('la muletilla del arranque se saca', ($r2[0] ?? '') === 'Te cuento que se puede.', json_encode($r2, JSON_UNESCAPED_UNICODE));

openai_responde([decision(['mensajes' => ['Y qué vendés?'], 'info_claves' => ['envios']])]);
$c3 = conv_ia('5491100000003TEST');
$r3 = turno('hacen envios?', $c3, $cfg);
caso('una duda con respuesta oficial va primero, tal cual, y después la pregunta',
    count($r3) === 2 && strpos($r3[0], 'la tienda calcula el envío') !== false && $r3[1] === 'Y qué vendés?', json_encode($r3, JSON_UNESCAPED_UNICODE));

openai_responde([decision(['mensajes' => ['Uno', 'Dos', 'Tres', 'Cuatro']])]);
$c4 = conv_ia('5491100000004TEST');
$r4 = turno('contame', $c4, $cfg);
caso('nunca más mensajes que el tope del panel', count($r4) <= 2, json_encode($r4));

echo "— 4. Cotizar: el precio sigue siendo el fijo —\n";

openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'tienda_online', 'etapa' => 'COTIZACION',
    'ficha' => ['rubro' => 'tu pañalera', 'que_vende' => 'pañales', 'objetivo' => 'vender online']])]);
$c5 = conv_ia('5491100000005TEST');
$r5 = turno('tengo una pañalera y quiero que me compren desde la web', $c5, $cfg);
$texto5 = implode("\n", $r5);
caso('cotiza la tienda con el texto fijo del precio',
    !empty($c5['precio_dado']) && ($c5['tipo'] ?? '') === 'ecommerce' && strpos($texto5, 'tienda online completa') !== false, $texto5);
caso('y queda esperando el sí al primer diseño, como siempre', !empty($c5['oferta_diseno_ts']) && ($c5['fase'] ?? '') === 'prediseno');
caso('la pregunta fija de vender o mostrar no se repite', strpos($texto5, 'Buscás vender por la web') === false);
$antes = count(pedidos());
openai_responde([decision(['mensajes' => ['esto no tendría que salir']])]);
$r5b = turno('y cuánto tarda?', $c5, $cfg);
caso('después del precio OpenAI ya no interviene', count(pedidos()) === 0);
caso('y una duda queda para una persona, en silencio (regla del 20-sep)', $r5b === [], json_encode($r5b, JSON_UNESCAPED_UNICODE));

openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'catalogo_sin_venta', 'ficha' => ['rubro' => 'tu dietética', 'que_vende' => 'suplementos']])]);
$c6 = conv_ia('5491100000006TEST');
$r6 = turno('vendo suplementos pero solo quiero mostrarlos, que me consulten por whatsapp', $c6, $cfg);
caso('catálogo sin venta = sitio profesional con catálogo', ($c6['tipo'] ?? '') === 'landing' && !empty($c6['catalogo']), json_encode($r6, JSON_UNESCAPED_UNICODE));

openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'sistema_gestion'])]);
$c7 = conv_ia('5491100000007TEST');
$r7 = turno('necesito un sistema para el stock del depósito', $c7, $cfg);
caso('un sistema de gestión sigue su camino de siempre: una pregunta y lo toma una persona',
    ($c7['fase'] ?? '') === 'sistema_problema' && empty($c7['precio_dado']) && $r7 === [wabot_sistema_texto($cfg)], json_encode($r7, JSON_UNESCAPED_UNICODE));

echo "— 5. Derivar, esperar y los cortes fijos —\n";

openai_responde([decision(['accion' => 'derivar', 'motivo' => 'reclamo por una web anterior', 'etapa' => 'DERIVAR_A_HUMANO', 'mensajes' => ['esto no sale']])]);
$c8 = conv_ia('5491100000008TEST');
$r8 = turno('me hicieron una web y no funciona nada, quiero una solución', $c8, $cfg);
caso('derivar manda el aviso fijo, no lo del modelo', count($r8) === 1 && strpos($r8[0], 'sigue el desarrollador') !== false && strpos($r8[0], 'esto no sale') === false, json_encode($r8, JSON_UNESCAPED_UNICODE));
caso('y la charla queda con una persona', ($c8['fase'] ?? '') === 'derivado' && !empty($c8['handoff_pendiente']) && ($c8['ia_derivar_motivo'] ?? '') === 'reclamo por una web anterior');

openai_responde([decision(['accion' => 'esperar', 'requiere_humano' => true, 'motivo' => 'pregunta algo que no sabemos'])]);
$c9 = conv_ia('5491100000009TEST');
$r9 = turno('la web se puede conectar con mi balanza?', $c9, $cfg);
caso('esperar: cero mensajes', $r9 === []);
caso('con requiere_humano el chat queda pendiente para una persona', !empty($c9['handoff_pendiente']));

openai_responde([decision(['mensajes' => ['no tendría que llamarse']])]);
$c10 = conv_ia('5491100000010TEST');
$r10 = turno('quiero hablar con una persona', $c10, $cfg);
caso('pedir una persona sigue siendo un corte fijo: OpenAI ni se entera', count(pedidos()) === 0 && ($c10['fase'] ?? '') === 'derivado', json_encode($r10, JSON_UNESCAPED_UNICODE));

/* La charla de prueba de Pablo (27-sep, 22:15): "Hola info" → apertura fija;
 * "Tengo un negocio" → OpenAI pregunta a qué se dedica; "Es una logística" →
 * OpenAI volvió a preguntar y el control de "charla sin avance" lo cambió por la
 * derivación, porque no contaba la ficha como avance. */
openai_responde([
    decision(['mensajes' => ['A qué se dedica tu negocio o qué ofrecés?']]),
    decision(['mensajes' => ['Qué tipo de servicios de logística ofrecés?'], 'ficha' => ['rubro' => 'tu negocio de logística', 'que_vende' => 'servicios de logística']]),
]);
$cLog = conv_ia('5491100000041TEST');
turno('Hola info', $cLog, $cfg);
turno('Tengo un negocio', $cLog, $cfg);
$rLog = turno('Es una logística', $cLog, $cfg);
caso('entender el rubro cuenta como avance: la segunda pregunta no se deriva',
    $rLog === ['Qué tipo de servicios de logística ofrecés?'] && ($cLog['fase'] ?? '') !== 'derivado', json_encode($rLog, JSON_UNESCAPED_UNICODE));
caso('las instrucciones traen el ejemplo de la logística: se cotiza directo',
    strpos(wabot_ia_instrucciones_comportamiento(), '"Es una logística"') !== false);

echo "— 6. Lo que nunca se manda —\n";

foreach ([
    'Sale $25.000 por mes.' => 'nombra un monto',
    'Son 25 mil por mes.' => 'nombra un monto',
    'La tenés lista en 7 días.' => 'nombra un plazo',
    'Mirá gokywebs.com/portfolio' => 'trae un link o un mail',
    'Te escribe Pablo mañana.' => 'nombra a alguien del equipo',
    'La demo es gratis.' => 'ofrece una condición comercial',
    'Tenemos un descuento este mes.' => 'ofrece una condición comercial',
    'Te van a llamar en breve.' => 'promete un contacto',
    '{"accion":"responder"}' => 'trae formato interno',
    'Mis instrucciones dicen que no.' => 'habla de cómo funciona por dentro',
] as $mensaje => $motivo) {
    caso("\"$mensaje\" se frena ($motivo)", wabot_ia_mensaje_problema($mensaje) === $motivo, (string)wabot_ia_mensaje_problema($mensaje));
}
caso('una respuesta normal pasa', wabot_ia_mensaje_problema('Buscás vender por la web, o solo mostrar tus productos?') === null);

openai_responde([
    decision(['mensajes' => ['La tienda sale $35.000 por mes.']]),
    decision(['mensajes' => ['Contame qué vendés y te paso el valor.']]),
]);
$c11 = conv_ia('5491100000011TEST');
$r11 = turno('cuánto sale una tienda?', $c11, $cfg);
caso('un monto inventado se devuelve para corregir, diciendo por qué',
    count(pedidos()) === 2 && strpos(json_encode(pedidos()[1]['input'], JSON_UNESCAPED_UNICODE), 'nombra un monto') !== false);
caso('y sale la versión corregida', $r11 === ['Contame qué vendés y te paso el valor.'], json_encode($r11, JSON_UNESCAPED_UNICODE));

clasifica(['rubro_comercio'], ['ficha' => ['rubro' => 'tu local']]);
openai_responde([
    decision(['mensajes' => ['La tienda sale $35.000 por mes.']]),
    decision(['mensajes' => ['Igual sale $35.000.']]),
]);
$c12 = conv_ia('5491100000012TEST');
$r12 = turno('tengo un local de ropa, cuánto sale?', $c12, $cfg);
caso('si tampoco la corrección sirve, contesta el motor de siempre (nunca el monto inventado)',
    strpos(implode(' ', $r12), '35.000') === false || !empty($c12['precio_dado']), json_encode($r12, JSON_UNESCAPED_UNICODE));
caso('y queda anotado que OpenAI no pudo', isset($c12['eventos_emitidos_sesion']['ia_openai_fallo']));
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

echo "— 7. Fallas de la API: el cliente nunca ve un error —\n";

// Un saludo pelado sigue saliendo con la apertura fija, sin gastar una llamada.
openai_responde([decision(['mensajes' => ['no tendría que llamarse']])]);
$c13b = conv_ia('5491100000031TEST');
$r13b = turno('hola, quiero una página', $c13b, $cfg);
caso('un saludo pelado sale con la apertura fija, sin llamar a OpenAI', count(pedidos()) === 0 && $r13b === [$cfg['menu'], $cfg['menu_opciones']], json_encode($r13b, JSON_UNESCAPED_UNICODE));

clasifica(['saludo']);
openai_responde([['http' => 500, 'body' => '{"error":{"message":"server error"}}'], ['http' => 503], ['http' => 502]]);
$c13 = conv_ia('5491100000013TEST');
$r13 = turno('hola buenas, quería hacer una consulta por una web', $c13, $cfg);
caso('tres intentos y después el motor', count(pedidos()) === 3 && isset($c13['eventos_emitidos_sesion']['ia_openai_fallo']));
caso('lo que sale no tiene rastros técnicos', !preg_match('/error|500|openai|server/i', implode(' ', $r13)), json_encode($r13, JSON_UNESCAPED_UNICODE));
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

openai_responde([['http' => 429, 'retry' => 1], decision(['mensajes' => ['A qué te dedicás?']])]);
$c14 = conv_ia('5491100000014TEST');
$r14 = turno('tengo una ferretería y quiero una página', $c14, $cfg);
caso('un 429 se reintenta y sigue', $r14 === ['A qué te dedicás?'] && count(pedidos()) === 2, json_encode($r14, JSON_UNESCAPED_UNICODE));

openai_responde([['http' => 400, 'body' => '{"error":{"message":"Unsupported parameter: reasoning.effort","param":"reasoning.effort"}}'],
                 decision(['mensajes' => ['A qué te dedicás?']])]);
$c15 = conv_ia('5491100000015TEST');
turno('tengo una ferretería y quiero una página', $c15, $cfg);
caso('un modelo que no acepta razonamiento: se saca el parámetro y se reintenta',
    count(pedidos()) === 2 && isset(pedidos()[0]['reasoning']) && !isset(pedidos()[1]['reasoning']));

openai_responde([['crudo' => ['status' => 'incomplete', 'incomplete_details' => ['reason' => 'max_output_tokens'], 'output' => [], 'usage' => []]],
                 decision(['mensajes' => ['A qué te dedicás?']])]);
$c16 = conv_ia('5491100000016TEST');
turno('tengo una ferretería y quiero una página', $c16, $cfg);
caso('una respuesta cortada por el tope se pide otra vez con más lugar',
    count(pedidos()) === 2 && (pedidos()[1]['max_output_tokens'] ?? 0) > (pedidos()[0]['max_output_tokens'] ?? 0));

clasifica(['saludo']);
openai_responde([['crudo' => ['status' => 'completed', 'model' => 'gpt-6-sol', 'output' => [['type' => 'message', 'content' => [['type' => 'refusal', 'refusal' => 'no']]]], 'usage' => []]]]);
$c17 = conv_ia('5491100000017TEST');
turno('tengo una ferretería y quiero una página', $c17, $cfg);
caso('un rechazo del modelo cae al motor', isset($c17['eventos_emitidos_sesion']['ia_openai_fallo']));
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

openai_responde([['http' => 401, 'body' => '{"error":{"message":"Incorrect API key provided"}}']]);
$c18 = conv_ia('5491100000018TEST');
turno('tengo una ferretería y quiero una página', $c18, $cfg);
// Solo las llamadas de conversación: después el motor clasifica y, en producción,
// ese intento ni sale porque la key rechazada abre el circuito 5 minutos.
$deConversacion = array_filter(pedidos(), function ($p) { return ($p['text']['format']['type'] ?? '') === 'json_schema'; });
caso('una key rechazada no se reintenta', count($deConversacion) === 1);

echo "— 8. Consumo y costo —\n";

$uso = wabot_ia_uso_resumen();
caso('cada llamada queda anotada con tokens y costo', $uso['total']['llamadas'] >= 10 && $uso['total']['entrada'] > 0 && $uso['total']['costo_usd'] > 0, json_encode($uso['total']));
caso('el costo usa la entrada en caché', abs(wabot_openai_costo('gpt-6-sol', 3000, 2000, 200) - 0.0044) < 0.0000001);
caso('un modelo sin precio no inventa un costo', wabot_openai_costo('modelo-nuevo', 1000, 0, 100) === null);
caso('y se puede cargar el precio a mano', wabot_openai_costo('modelo-nuevo', 1000000, 0, 0, ['openai_precio_entrada' => 3, 'openai_precio_salida' => 9]) === 3.0);
caso('el costo se puede ver por conversación', (wabot_ia_uso_conversacion('5491100000001TEST')['llamadas'] ?? 0) === 1, json_encode(wabot_ia_uso_conversacion('5491100000001TEST')));
caso('y por tarea', isset($uso['por_tarea']['conversacion']));

echo "— 9. Modo shadow: contesta Gemini, OpenAI solo se anota —\n";

$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'shadow';
clasifica(['rubro_comercio'], ['ficha' => ['rubro' => 'tu vivero']]);
openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'tienda_online', 'ficha' => ['rubro' => 'tu vivero', 'que_vende' => 'plantas']])]);
$c19 = conv_ia('5491100000019TEST');
wabot_conv_transcript($c19, 'cliente', 'tengo un vivero y quiero vender online');
$r19 = wabot_salida_preparar(wabot_responder('tengo un vivero y quiero vender online', $c19, $cfg), $c19, $cfg);
$pend = $GLOBALS['WABOT_IA_SOMBRA_PENDIENTE'] ?? null;
unset($GLOBALS['WABOT_IA_SOMBRA_PENDIENTE']);
caso('en el turno, OpenAI no se llama: contesta el motor', count(pedidos()) === 0 && $r19 !== []);
caso('queda anotado para pensar después', is_array($pend) && $pend['texto'] === 'tengo un vivero y quiero vender online');
$fila = wabot_ia_sombra_ejecutar($pend, $r19, $cfg);
caso('después piensa OpenAI y anota las dos respuestas',
    count(pedidos()) === 1 && $fila['gemini'] === array_values($r19) && ($fila['openai']['accion'] ?? '') === 'cotizar');
caso('lo que habría mandado OpenAI incluye el precio fijo', strpos(implode(' ', (array)($fila['openai']['enviaria'] ?? [])), 'tienda online completa') !== false,
    json_encode($fila['openai'], JSON_UNESCAPED_UNICODE));
caso('la charla real no se toca', empty($pend['conv']['precio_dado']) && ($c19['tipo'] ?? '') === 'ecommerce');
caso('queda en el archivo para el panel', count(wabot_ia_sombra_leer(1)) >= 1 && (wabot_ia_sombra_leer(1)[0]['conv'] ?? '') === '5491100000019TEST');
caso('el costo de la sombra se cuenta aparte', isset(wabot_ia_uso_resumen()['por_modo']['sombra']));
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';

echo "— 10. Memoria: lo que ya sabemos no se vuelve a preguntar —\n";

$c20 = conv_ia('5491100000020TEST', ['fase' => 'menu', 'nombre_confirmado' => true, 'nombre_negocio' => 'Las Hojas',
    'ficha' => ['rubro' => 'tu vivero', 'que_vende' => 'plantas de interior', 'objetivo' => 'vender online']]);
for ($i = 1; $i <= 30; $i++) {
    wabot_conv_transcript($c20, 'cliente', "mensaje viejo $i");
    wabot_conv_transcript($c20, 'bot', "respuesta $i");
}
wabot_conv_transcript($c20, 'cliente', 'y hacen envios?');
$ctx20 = wabot_ia_contexto('y hacen envios?', $c20, $cfg);
caso('el contexto trae la ficha como datos confirmados',
    strpos($ctx20, 'Rubro: tu vivero') !== false && strpos($ctx20, 'Qué vende u ofrece: plantas de interior') !== false && strpos($ctx20, 'Negocio o marca: Las Hojas') !== false);
caso('avisa que no hay que volver a saludar', strpos($ctx20, 'no lo vuelvas a saludar') !== false);
caso('solo los últimos mensajes van completos', strpos($ctx20, 'respuesta 30') !== false && strpos($ctx20, 'Gokywebs: respuesta 2' . "\n") === false);
caso('lo viejo del cliente va resumido', strpos($ctx20, 'ANTES EL CLIENTE TAMBIÉN DIJO') !== false && strpos($ctx20, 'mensaje viejo 3') !== false);

echo "— 11. Las tareas de Gemini también pasan a OpenAI —\n";

openai_responde([['crudo' => ['status' => 'completed', 'model' => 'gpt-6-sol', 'usage' => [],
    'output' => [['type' => 'message', 'content' => [['type' => 'output_text',
        'text' => '{"acciones":["rubro_comercio"],"info_keys":[],"descripcion":null,"colores":null,"ficha":{"rubro":"tu kiosco"}}']]]]]]]);
$cl = wabot_clasificar('tengo un kiosco', conv_ia('5491100000021TEST'), $cfg);
caso('el clasificador usa el mismo prompt con OpenAI y se lee igual',
    ($cl['acciones'] ?? null) === ['rubro_comercio'] && ($cl['ficha']['rubro'] ?? '') === 'tu kiosco'
    && (pedidos()[0]['text']['format']['type'] ?? '') === 'json_object', json_encode($cl, JSON_UNESCAPED_UNICODE));

echo "— 12. De punta a punta por el webhook: el cliente sigue escribiendo mientras OpenAI piensa —\n";

$srcWebhook = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($srcWebhook, 'function wabot_conv_identidad_entrante');
$hasta = strpos($srcWebhook, '/* ── Instagram: otro formato');
eval(substr($srcWebhook, $desde, $hasta - $desde));

$telW = '5491100000099TEST';
@unlink(WABOT_DATA . '/conv/' . $telW . '.json');
@unlink(wabot_cola_path($telW));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$uid = uniqid('wamid.test', true);
openai_responde([
    decision(['mensajes' => ['Qué tipo de ropa vendés?']]),
    decision(['accion' => 'cotizar', 'tipo_web' => 'tienda_online', 'ficha' => ['rubro' => 'tu marca de ropa', 'que_vende' => 'ropa mayorista', 'objetivo' => 'vender online a mayoristas']]),
], function ($n) use ($telW) {
    // Mientras OpenAI piensa la primera respuesta, el cliente manda otro mensaje.
    if ($n === 1) wabot_cola_encolar($telW, 'pero únicamente mayorista, que me compren desde la web', 'pero únicamente mayorista, que me compren desde la web', 'Marta', null, 'wamid.segundo');
});
wabot_procesar_entrante(['channel_user_id' => $telW, 'conversation_key' => $telW, 'id' => $uid, 'canal' => 'whatsapp',
    'texto' => 'Quiero vender ropa', 'nombre' => 'Marta', 'media' => null], $cfg);
$enviados = array_map(function ($e) { return (string)$e[1]; }, (array)$GLOBALS['WABOT_TEST_ENVIADOS']);
$convW = wabot_conv_load($telW);
caso('la primera respuesta se descartó sin mandarse', !in_array('Qué tipo de ropa vendés?', $enviados, true), json_encode($enviados, JSON_UNESCAPED_UNICODE));
caso('la segunda vez OpenAI vio los dos mensajes juntos y en orden',
    count(pedidos()) === 2 && preg_match('/Quiero vender ropa\s*\npero únicamente mayorista/u', (string)(pedidos()[1]['input'][0]['content'] ?? '')) === 1);
caso('y lo que salió es la cotización, con la información completa',
    !empty($convW['precio_dado']) && strpos(implode(' ', $enviados), 'tienda online completa') !== false);
$orden = array_map(function ($t) { return ($t['q'] ?? '') . ':' . mb_substr((string)($t['t'] ?? ''), 0, 25); }, (array)$convW['transcript']);
caso('el transcript quedó en orden: los dos del cliente y después el bot',
    ($orden[0] ?? '') === 'cliente:Quiero vender ropa' && strpos($orden[1] ?? '', 'cliente:pero únicamente') === 0 && strpos($orden[2] ?? '', 'bot:') === 0,
    json_encode($orden, JSON_UNESCAPED_UNICODE));
caso('la cola quedó vacía', !wabot_cola_tiene($telW));
@unlink(WABOT_DATA . '/conv/' . $telW . '.json');

$a = 'wabot-test-cola-' . getmypid();
wabot_cola_encolar($a, 'nuevo', 'nuevo');
wabot_cola_devolver($a, [['t' => 'viejo 1', 'u' => 'viejo 1'], ['t' => 'viejo 2', 'u' => 'viejo 2']]);
caso('devolver una tanda la deja adelante de lo nuevo', array_column(wabot_cola_drenar($a), 't') === ['viejo 1', 'viejo 2', 'nuevo']);

echo "— 13. La bienvenida y sus tres opciones (28-sep) —\n";

/** Un cliente que saludó y recibió la bienvenida fija (sin llamar a OpenAI). */
function conv_bienvenida_ia($clave, $cfg) {
    openai_responde([]);
    $c = conv_ia($clave);
    $r = turno('hola', $c, $cfg);
    caso("la bienvenida sale en dos mensajes, fija ($clave)", $r === [$cfg['menu'], $cfg['menu_opciones']] && count(pedidos()) === 0);
    return $c;
}

$c = conv_bienvenida_ia('5491100000131TEST', $cfg);
openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'sitio_profesional', 'etapa' => 'COTIZACION'])]);
$r = turno('Una web informativa', $c, $cfg);
$p = pedidos()[0] ?? [];
$ctx = (string)($p['input'][0]['content'] ?? '');
caso('las instrucciones explican las tres opciones y qué hacer con cada una',
    strpos((string)$p['instructions'], 'LA BIENVENIDA Y SUS TRES OPCIONES') !== false
    && strpos((string)$p['instructions'], 'Opción 3, "Algo diferente"') !== false);
caso('el contexto le avisa que está eligiendo una opción de la bienvenida',
    strpos($ctx, 'La última pregunta fue la de la bienvenida') !== false && strpos($ctx, 'Gokywebs: ' . $cfg['menu_opciones']) !== false, $ctx);
caso('opción 1 → el precio fijo del sitio profesional', ($c['tipo'] ?? '') === 'landing' && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_bienvenida_ia('5491100000132TEST', $cfg);
openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'tienda_online', 'etapa' => 'COTIZACION'])]);
$r = turno('la 2', $c, $cfg);
caso('opción 2 → el precio fijo de la tienda, sin preguntar si vende por la web',
    ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado']) && strpos(implode(' ', $r), 'Buscás vender por la web') === false,
    json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_bienvenida_ia('5491100000133TEST', $cfg);
openai_responde([decision(['mensajes' => ['Contame qué tenés en mente y a qué te dedicás, así te oriento.']])]);
$r = turno('Algo diferente', $c, $cfg);
caso('opción 3 → OpenAI pregunta qué tiene en mente, sin cotizar',
    $r === ['Contame qué tenés en mente y a qué te dedicás, así te oriento.'] && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

// La red: si el modelo repregunta después de la opción 1 o 2, se cotiza igual.
$c = conv_bienvenida_ia('5491100000134TEST', $cfg);
openai_responde([decision(['mensajes' => ['A qué te dedicás?']])]);
$r = turno('la primera', $c, $cfg);
caso('opción 1 con el modelo repreguntando → se cotiza el sitio profesional igual',
    ($c['tipo'] ?? '') === 'landing' && !empty($c['precio_dado']) && !in_array('A qué te dedicás?', $r, true)
    && isset($c['eventos_emitidos_sesion']['ia_menu_corregido']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_bienvenida_ia('5491100000135TEST', $cfg);
openai_responde([decision(['mensajes' => ['Qué cursos das?']])]);
$r = turno('la tienda, para vender mis cursos de maquillaje', $c, $cfg);
caso('y si nombra cursos, la red cotiza la plataforma de cursos', ($c['tipo'] ?? '') === 'elearning' && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_bienvenida_ia('5491100000136TEST', $cfg);
openai_responde([decision(['mensajes' => ['Contame qué tenés en mente.']])]);
$r = turno('la 3', $c, $cfg);
caso('la red no toca la opción 3', $r === ['Contame qué tenés en mente.'] && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

// Si solo eligió la opción, la propuesta no dice "Para lo que me contás" (28-sep).
$c = conv_bienvenida_ia('5491100000138TEST', $cfg);
openai_responde([decision(['accion' => 'cotizar', 'tipo_web' => 'tienda_online', 'etapa' => 'COTIZACION'])]);
$r = turno('Tienda online', $c, $cfg);
caso('eligió "Tienda online" sin contar nada → "Perfecto, te podemos armar una tienda online…"',
    str_starts_with($r[0] ?? '', 'Perfecto, te podemos armar una tienda online completa') && mb_stripos($r[0], 'me contás') === false, $r[0] ?? '');

// "¿Qué me recomendás?" con el negocio contado: se cotiza, no otra pregunta.
$c = conv_bienvenida_ia('5491100000139TEST', $cfg);
openai_responde([decision(['mensajes' => ['Buscás vender los muebles, o mostrarlos?']]), decision(['mensajes' => ['Vendés modelos definidos o a medida?']])]);
turno('Muebleria', $c, $cfg);
$r = turno('Que me recomendas ?', $c, $cfg);
caso('mueblería + "qué me recomendás?" con el modelo repreguntando → se cotiza la tienda',
    ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado']) && isset($c['eventos_emitidos_sesion']['ia_recomendacion_corregida']),
    json_encode($r, JSON_UNESCAPED_UNICODE));
caso('las instrucciones dicen que ante "qué me recomendás" se decide y se cotiza',
    strpos(wabot_ia_instrucciones($cfg), 'no le devuelvas la pregunta: decidí vos y cotizá') !== false);

// Con OpenAI caído, el motor lee la opción igual.
$c = conv_bienvenida_ia('5491100000137TEST', $cfg);
clasifica(['otro']);
openai_responde([['http' => 500], ['http' => 503], ['http' => 502]]);
$r = turno('Una tienda online', $c, $cfg);
caso('OpenAI caído: el motor cotiza la tienda igual', ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

// Limpieza.
foreach (glob(WABOT_DATA . '/conv/54911000000*TEST.json') ?: [] as $f) @unlink($f);
foreach (['uso', 'sombra'] as $d) { foreach (glob("$tmp/$d/*") ?: [] as $f) @unlink($f); @rmdir("$tmp/$d"); }
@rmdir($tmp);

todo_ok();
