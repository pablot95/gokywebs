<?php
/**
 * wabot/test-comercial.php — el flujo comercial unificado (plan del 9-oct-2026), sin red.
 *
 *   php wabot/test-comercial.php
 *
 * GPT Sol se simula con WABOT_TEST_OPENAI_HTTP: cada caso le carga la decisión
 * que daría el modelo y mira lo que el SISTEMA hace con ella: los bloques
 * aprobados, los montos (incluidas las cotizaciones históricas), el orden de la
 * secuencia, las redes deterministas sobre la decisión, los estados (formulario
 * enviado, para Pablo, rechazo), el recordatorio del formulario y el modo
 * automático de punta a punta por el webhook. Lo que NO prueba es que Sol
 * interprete bien: para eso está test-comercial-vivo.php, con el modelo real.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;

$tmp = sys_get_temp_dir() . '/wabot-test-comercial-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$GLOBALS['TC_DICE_RUBRO'] = true;   // la bienvenida fija no sale: el primer mensaje ya cuenta el rubro

const PLANES_PANEL = "Podés elegir entre dos planes:\n\n1) Plan anual: {anual}\n2) Plan mensual: {mensual}\n\nAmbos incluyen todo:\n✓ Desarrollo completo de la web\n✓ Panel para autogestionar contenido\n✓ Preparada para Google\n✓ Un cambio por mes en la web\n\nMantenimiento:\n✓ Renovación de hosting y dominio\n✓ Actualizaciones\n✓ Soporte técnico";
const PLANES_INFO = "Podés elegir entre dos planes:\n\n1) Plan anual: {anual}\n2) Plan mensual: {mensual}\n\nAmbos incluyen todo:\n✓ Desarrollo completo de la web\n✓ Adaptada para celular\n✓ Preparada para Google\n✓ Un cambio por mes en la web\n\nMantenimiento:\n✓ Renovación de hosting y dominio\n✓ Actualizaciones\n✓ Soporte técnico";
const OFERTA = 'Si te interesa, te preparamos una demo gratis para que veas cómo quedaría tu web antes de decidir. Querés que la armemos?';
function planes($cual, $anual, $mensual) { return strtr($cual === 'panel' ? PLANES_PANEL : PLANES_INFO, ['{anual}' => $anual, '{mensual}' => $mensual]); }

/** Una decisión del modelo, con lo que no se pasa en blanco. */
function dc(array $d = []) {
    $base = ['accion' => 'responder', 'solucion' => 'sin_definir', 'intencion' => 'ninguna', 'pago_unico' => false, 'mensajes' => [],
             'info_claves' => [], 'motivo' => null,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null,
                         'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) $d['ficha'] = array_merge($base['ficha'], $d['ficha']);
    return array_merge($base, $d);
}

/**
 * Carga lo que contesta la API, en orden (solo para la tarea comercial; la de
 * la bienvenida contesta sola). $revisor: lo que contesta el revisor, en orden;
 * si no hay nada cargado, aprueba. 'falla' simula que no contesta.
 */
function oa(array $cola, array $revisor = []) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['OA_REVISOR'] = $revisor;
    $GLOBALS['OA_REVISIONES'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        if (str_ends_with((string)($payload['prompt_cache_key'] ?? ''), 'comercial_revisor')) {
            $GLOBALS['OA_REVISIONES'][] = $payload;
            $rev = array_shift($GLOBALS['OA_REVISOR']) ?? ['ok' => true, 'problemas' => [], 'falta_contestar' => []];
            if ($rev === 'falla') return [400, '{"error":{"message":"simulada"}}', 0];
            return [200, json_encode(['id' => 'resp_rev', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($rev, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 4000, 'input_tokens_details' => ['cached_tokens' => 3500], 'output_tokens' => 60, 'total_tokens' => 4060]], JSON_UNESCAPED_UNICODE)];
        }
        $tarea = (string)($payload['prompt_cache_key'] ?? '');
        $ok = function ($datos) {
            return [200, json_encode(['id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($datos, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 4000, 'input_tokens_details' => ['cached_tokens' => 3000], 'output_tokens' => 220,
                            'output_tokens_details' => ['reasoning_tokens' => 40], 'total_tokens' => 4220]], JSON_UNESCAPED_UNICODE)];
        };
        if (str_ends_with($tarea, 'bienvenida_rubro')) return $ok(['ya_dice_rubro' => !empty($GLOBALS['TC_DICE_RUBRO'])]);
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) return [0, ''];
        if (isset($sig['http'])) return [$sig['http'], (string)($sig['body'] ?? ''), 0];
        return $ok($sig);
    };
}
function pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }
function cv($clave = '5491100009001TEST', array $extra = []) { return conv_nueva($clave, array_merge(['nombre' => 'Marta'], $extra)); }
/** Una charla ya cotizada por el flujo nuevo, con la oferta hecha. */
function cv_cotizada($solucion = 'tienda', array $extra = []) {
    global $cfg;
    $c = cv('5491100009002TEST', $extra);
    wabot_conv_transcript($c, 'cliente', 'Vendo zapatillas');
    oa([dc(['accion' => 'cotizar', 'solucion' => $solucion, 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas desde la web.'],
            'ficha' => ['rubro' => 'tu local de zapatillas', 'que_vende' => 'zapatillas']])]);
    turno('Vendo zapatillas', $c, $cfg);
    return $c;
}
function con_form($r) { return count(array_filter((array)$r, fn($m) => strpos((string)$m, 'gokywebs.com/form/?c=') !== false)) > 0; }

echo "— 1. Configuración —\n";
caso('arranca apagado de fábrica (la activación no es un efecto del deploy)', (wabot_textos_default()['flujo_comercial'] ?? '') === 'off');
caso('es un ajuste del panel', in_array('flujo_comercial', wabot_ajustes_claves(), true));
caso('un modo inventado vuelve a off', (function () { unset($GLOBALS['WABOT_TEST_FLUJO_COMERCIAL']); $m = wabot_flujo_comercial(['flujo_comercial' => 'turbo']); $GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto'; return $m; })() === 'off');
caso('los bloques aprobados están tal cual', ($cfg['comercial']['oferta_demo'] ?? '') === OFERTA && trim((string)$cfg['comercial']['planes_panel']) === PLANES_PANEL && trim((string)$cfg['comercial']['planes_informativa']) === PLANES_INFO);
caso('el texto del formulario es el aprobado', str_starts_with((string)$cfg['prediseno_link'], 'Para hacer la demo, solo tendrías que llenar este formulario, toma 2 minutos: {link}'));
$ins = wabot_comercial_instrucciones_comportamiento();
foreach (['catalogo', 'reservas', 'crm', 'dos webs', 'descuento', 'pago_unico', 'formulario', 'presenciales'] as $p) {
    caso("las instrucciones hablan de «{$p}»", mb_stripos($ins, $p) !== false);
}
caso('las instrucciones viejas no se cargan en este flujo (nada de "vender o mostrar")', mb_stripos($ins, 'solo mostrar?') === false && mb_stripos($ins, 'Después del precio no conversás') === false);
$info = wabot_comercial_info($cfg);
caso('la descripción de las soluciones y planes no trae montos', strpos((string)strstr($info, 'RESPUESTAS OFICIALES', true), '$') === false);
caso('y lista las respuestas oficiales (incluido el descuento) con cómo las preguntan', strpos($info, '- descuento:') !== false && strpos($info, '- pago_antes_demo:') !== false && strpos($info, 'lo preguntan así') !== false);
caso('el descuento y "pagar antes?" se pueden pedir por clave', in_array('descuento', wabot_comercial_info_claves($cfg), true) && in_array('pago_antes_demo', wabot_comercial_info_claves($cfg), true));
caso('el esquema exige todos los campos', (wabot_comercial_esquema($cfg)['schema']['required'] ?? []) === ['accion', 'solucion', 'intencion', 'pago_unico', 'internacional', 'mensajes', 'info_claves', 'motivo', 'ficha']);

echo "— 2. La secuencia de la cotización: tres mensajes —\n";
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas las zapatillas directo desde la web, sin estar pendiente de cada consulta.'],
        'ficha' => ['rubro' => 'tu local de zapatillas', 'que_vende' => 'zapatillas']])]);
$r = turno('Hola! Vendo zapatillas', $c, $cfg);
caso('«Vendo zapatillas» → tres mensajes separados', count($r) === 3, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('1: la propuesta breve del modelo, con el saludo devuelto (el nombre del perfil no se usa)', ($r[0] ?? '') === 'Hola! Perfecto, te podemos armar una tienda online para que vendas las zapatillas directo desde la web, sin estar pendiente de cada consulta', $r[0] ?? '');
caso('2: los planes con panel, anual primero, $190.000 / $30.000', ($r[1] ?? '') === planes('panel', '$190.000', '$30.000'), $r[1] ?? '');
caso('3: la oferta de la demo, tal cual, sin coletilla', ($r[2] ?? '') === OFERTA, $r[2] ?? '');
caso('una sola llamada al modelo', count(pedidos()) === 1);
caso('queda cotizada: precio congelado, tipo tienda, oferta abierta', !empty($c['precio_dado']) && ($c['tipo'] ?? '') === 'ecommerce' && ($c['comercial_cotizacion']['anual'] ?? '') === '$190.000'
    && ($c['precio_cotizado'] ?? '') === '$190.000' && ($c['mensualidad_cotizada'] ?? '') === '$30.000' && !empty($c['comercial_oferta_ts']) && ($c['fase'] ?? '') === 'prediseno', json_encode(array_intersect_key($c, array_flip(['precio_dado', 'tipo', 'comercial_cotizacion', 'fase']))));
caso('la ficha guarda lo que entendió', wabot_ficha($c)['rubro'] === 'tu local de zapatillas' && ($c['comercial_solucion'] ?? '') === 'tienda');
caso('y nada queda pendiente para Pablo', empty($c['handoff_pendiente']) && empty($c['control_manual']));
$ctx = (string)(pedidos()[0]['input'][0]['content'] ?? '');
caso('el contexto le dice que todavía no había precio ni oferta', strpos($ctx, 'Todavía no le pasamos el precio') !== false && strpos($ctx, 'Todavía no le ofrecimos la demo') !== false);
caso('el mensaje nuevo va entero en el contexto', strpos($ctx, 'Hola! Vendo zapatillas') !== false);

$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Perfecto, te podemos armar un catálogo con tus suplementos para que armen el pedido y te llegue por WhatsApp.'], 'ficha' => ['que_vende' => 'suplementos']])]);
$r = turno('Vendo suplementos, solo quiero mostrarlos y que me pidan por WhatsApp', $c, $cfg);
caso('catálogo sin cobro → plan con panel (tienda), no la informativa barata', ($r[1] ?? '') === planes('panel', '$190.000', '$30.000') && ($c['tipo'] ?? '') === 'ecommerce' && ($c['comercial_solucion'] ?? '') === 'catalogo', $r[1] ?? '');

$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Buenísimo, te podemos armar una página con tu información y el contacto directo por WhatsApp.'], 'ficha' => ['rubro' => 'tu consultorio de psicología']])]);
$r = turno('Soy psicóloga, solo quiero información y contacto', $c, $cfg);
caso('informativa → $140.000 / $20.000 con el bloque informativo, sin panel', ($r[1] ?? '') === planes('informativa', '$140.000', '$20.000') && ($c['tipo'] ?? '') === 'landing', $r[1] ?? '');

foreach (['reservas' => 'landing', 'cursos' => 'elearning', 'inmobiliaria' => 'inmobiliaria'] as $sol => $tipo) {
    $c = cv();
    oa([dc(['accion' => 'cotizar', 'solucion' => $sol, 'mensajes' => ['Perfecto, te la podemos armar.'], 'ficha' => ['rubro' => 'tu negocio de ' . $sol]])]);
    $r = turno('Tengo un negocio de ' . $sol . ' y quiero una web', $c, $cfg);
    caso("$sol → plan con panel ($190.000 / $30.000), tipo $tipo", ($r[1] ?? '') === planes('panel', '$190.000', '$30.000') && ($c['tipo'] ?? '') === $tipo, json_encode($r, JSON_UNESCAPED_UNICODE));
}
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'cursos', 'mensajes' => ['Perfecto, te podemos armar una web con tus cursos de maquillaje y la inscripción desde ahí.'], 'ficha' => ['que_vende' => 'cursos de maquillaje presenciales']])]);
$r = turno('Dicto cursos de maquillaje presenciales, para mostrarlos y que me escriban', $c, $cfg);
caso('cursos presenciales solo para mostrar → igual el plan con panel (no se rebajan a informativa)', ($r[1] ?? '') === planes('panel', '$190.000', '$30.000'), $r[1] ?? '');

echo "— 3. La propuesta: adaptada por el modelo, con red —\n";
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos la tienda por $30.000 por mes.'], 'ficha' => ['que_vende' => 'ropa']]),
    dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online para que vendas tu ropa directo desde la web.'], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Vendo ropa', $c, $cfg);
caso('una propuesta con un monto se corrige una vez (y el "Perfecto," de Pablo se conserva)', count(pedidos()) === 2 && ($r[0] ?? '') === 'Perfecto, te podemos armar una tienda online para que vendas tu ropa directo desde la web', json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la corrección le dice por qué', strpos((string)(pedidos()[1]['input'][2]['content'] ?? ''), 'nombra un monto') !== false);
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos la tienda integrada con Mercado Libre.'], 'ficha' => ['que_vende' => 'ropa']]),
    dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te la armamos con facturación electrónica incluida.'], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Vendo ropa', $c, $cfg);
caso('si insiste con una función no aprobada, falla y el turno se calla (nunca improvisa)', $r === [] && !empty($c['handoff_pendiente']) && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => [], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Vendo ropa', $c, $cfg);
caso('sin propuesta del modelo sale la fija de la solución', ($r[0] ?? '') === 'Hola Marta! ' . $cfg['comercial']['propuesta_fija']['tienda'] || ($r[0] ?? '') === $cfg['comercial']['propuesta_fija']['tienda'], $r[0] ?? '');
foreach (['Sale $25.000.' => 'nombra un monto', 'Te lo conectamos con Mercado Libre.' => 'nombra una función o condición que no corresponde',
          'Podés pagar en cuotas sin interés.' => 'ofrece una condición comercial', 'Te escribe Pablo.' => 'nombra a alguien del equipo',
          'La demo es gratis.' => 'ofrece una condición comercial'] as $m => $motivo) {
    caso("red: «{$m}» ($motivo)", wabot_comercial_mensaje_problema($m) === $motivo, (string)wabot_comercial_mensaje_problema($m));
}
caso('una propuesta normal pasa', wabot_comercial_mensaje_problema('Perfecto, te podemos armar una tienda online para que vendas directo desde la web, incluso sin estar pendiente del celular 24/7.') === null);

echo "— 4. Sin negocio no hay precio —\n";
$c = cv();
oa([dc(['accion' => 'responder', 'info_claves' => ['precio_sin_rubro']])]);
$r = turno('Hola, cuánto sale?', $c, $cfg);
caso('«cuánto sale?» sin datos → explica que varía y pregunta, sin montos', count($r) === 1 && strpos($r[0], '$') === false && stripos($r[0], 'a qué te dedicás') !== false && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'responder', 'mensajes' => ['Depende de lo que necesites.']])]);
$r = turno('Cuánto cuesta una página?', $c, $cfg);
caso('si el modelo no pidió la oficial, la red la pone igual (y saca lo demás)', count($r) === 1 && stripos($r[0], 'a qué te dedicás') !== false && stripos($r[0], 'Depende') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos una tienda.']])]);
$r = turno('Quiero una tienda online', $c, $cfg);
caso('cotizar sin saber qué vende se frena: se pregunta', empty($c['precio_dado']) && count($r) === 1 && strpos($r[0], '?') !== false && !empty($c['rubro_preguntado']), json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos una tienda.']])]);
$r = turno('Es para vender', $c, $cfg);
caso('y no se pregunta dos veces: sin negocio y ya preguntado, silencio para Pablo', $r === [] && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'responder', 'info_claves' => ['pago']])]);
$r = turno('Cómo se paga?', $c, $cfg);
caso('antes del precio no sale ninguna respuesta oficial con montos', !array_filter($r, fn($m) => strpos($m, '$') !== false), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 5. Aceptación de la demo y formulario —\n";
$c = cv_cotizada();
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$r = turno('Dale, a ver cómo quedaría', $c, $cfg);
caso('«Dale, a ver cómo quedaría» → el formulario, una sola vez', count($r) === 1 && con_form($r) && str_starts_with($r[0], 'Para hacer la demo, solo tendrías que llenar este formulario'), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('queda en pausa por formulario (sin control manual, sin bloquear el recordatorio)', !empty($c['link_form_enviado']) && ($c['comercial_pausa'] ?? '') === 'formulario' && empty($c['control_manual']) && empty($c['seguimiento_bloqueado']) && !empty($c['form_link_mandado_ts']));
oa([dc(['accion' => 'responder', 'mensajes' => ['Tarda poco.']])]);
$r = turno('Y cuánto tarda?', $c, $cfg);
caso('después del formulario, una duda habitual → silencio, pendiente para Pablo, sin llamar al modelo', $r === [] && !empty($c['handoff_pendiente']) && count(pedidos()) === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$r = turno('Dale', $c, $cfg);
caso('un segundo sí no manda el formulario de nuevo', $r === []);

$c = cv_cotizada();
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$r = turno('Qué necesitás para hacerla?', $c, $cfg);
caso('«Qué necesitás para hacerla?» → formulario', con_form($r) && count($r) === 1, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta', 'info_claves' => ['demo_gratis']])]);
$r = turno('Dale, pero tengo que pagar algo antes?', $c, $cfg);
caso('acepta con una duda habitual → la respuesta oficial y el formulario en el mismo turno', count($r) === 2 && stripos($r[0], 'No tiene costo') !== false && con_form([$r[1]]), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'intencion' => 'ninguna', 'mensajes' => ['Contame un poco más.']])]);
$r = turno('Dale', $c, $cfg);
caso('un «Dale» pelado justo después de la oferta, aunque el modelo dude, se lleva el formulario (red del sí claro)', con_form($r) && count($r) === 1, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'intencion' => 'posterga', 'mensajes' => ['Dale, sin apuro. Cuando lo charles me avisás y seguimos.']])]);
$r = turno('Me interesa, pero lo hablo con mi socio y te aviso', $c, $cfg);
caso('postergar no manda el formulario', !con_form($r) && count($r) === 1 && empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv();
oa([dc(['accion' => 'formulario', 'solucion' => 'sin_definir', 'intencion' => 'acepta'])]);
$r = turno('Sí', $c, $cfg);
caso('un «sí» sin oferta previa nunca manda el formulario', !con_form($r) && empty($c['link_form_enviado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta', 'ficha' => ['que_vende' => 'velas']])]);
$r = turno('Sí, quiero la demo, vendo velas', $c, $cfg);
caso('pide la demo sin precio todavía → se cotiza (la oferta sale con el precio)', count($r) === 3 && ($r[2] ?? '') === OFERTA && !con_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['ejemplos']])]);
$r = turno('Solo quiero ver ejemplos de trabajos', $c, $cfg);
caso('ver ejemplos no es aceptar la demo', !con_form($r) && count($r) === 1 && stripos($r[0], 'portfolio') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 6. Casos para Pablo: silencio con motivo —\n";
$c = cv();
oa([dc(['accion' => 'humano', 'solucion' => 'crm', 'motivo' => 'Pide un CRM para su equipo de ventas'])]);
$r = turno('Necesito un CRM para gestionar a mis vendedores y el seguimiento de clientes', $c, $cfg);
caso('CRM → sin respuesta, sin precio, para Pablo con el motivo', $r === [] && empty($c['precio_dado']) && ($c['comercial_pausa'] ?? '') === 'humano'
    && ($c['comercial_motivo'] ?? '') === 'Pide un CRM para su equipo de ventas' && !empty($c['control_manual']) && !empty($c['handoff_pendiente']) && !empty($c['seguimiento_bloqueado']), json_encode($c['comercial_ultimo'] ?? []));
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te armamos una tienda.']])]);
$r = turno('Y si fuera una tienda cuánto sale?', $c, $cfg);
caso('pasado un día sigue para Pablo: no se reactiva sola', $r === [] && count(pedidos()) === 0);
wabot_conv_encender_manual($c);
caso('solo "Encender bot" la devuelve', empty($c['comercial_pausa']) && empty($c['control_manual']) && empty($c['seguimiento_bloqueado']));

$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'crm', 'mensajes' => ['Te armamos el sistema.']])]);
$r = turno('Quiero un sistema para gestionar el stock del depósito', $c, $cfg);
caso('cotizar con solución crm lo corrige la red: humano', $r === [] && ($c['comercial_pausa'] ?? '') === 'humano');

$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online con tus productos y el stock desde el panel.'], 'ficha' => ['que_vende' => 'bazar']])]);
$r = turno('Vendo bazar y quiero manejar el stock y los pedidos de mi tienda', $c, $cfg);
caso('stock y pedidos del panel estándar no se derivan por el vocabulario', count($r) === 3 && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_cotizada();
$c['ficha']['senales'] = ['mercadolibre'];
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$r = turno('Dale, y que se sincronice con Mercado Libre', $c, $cfg);
caso('una conexión no aprobada frena el formulario aunque acepte la demo', $r === [] && empty($c['link_form_enviado']) && ($c['comercial_pausa'] ?? '') === 'humano' && stripos((string)$c['comercial_motivo'], 'Mercado Libre') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv();
oa([dc(['accion' => 'humano', 'solucion' => 'sin_definir', 'motivo' => 'Pide dos webs: una para la agencia y otra para la pañalera'])]);
$r = turno('Necesito dos webs, una para mi agencia de viajes y otra para la pañalera de mi hija', $c, $cfg);
caso('dos webs → para Pablo con el motivo (sin inventar descuento)', $r === [] && ($c['comercial_pausa'] ?? '') === 'humano' && stripos((string)$c['comercial_motivo'], 'dos webs') !== false);

$c = cv_cotizada();
oa([dc(['accion' => 'humano', 'solucion' => 'tienda', 'motivo' => 'No puede abrir el formulario'])]);
$c['link_form_enviado'] = true; $c['comercial_pausa'] = 'formulario';
$r = turno('No me abre el link del formulario', $c, $cfg);
caso('problemas con el formulario → silencio y pendiente para Pablo', $r === [] && !empty($c['handoff_pendiente']));

echo "— 7. Descuento, pago único, cotización previa —\n";
$c = cv_cotizada();
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'mensajes' => []])]);
$r = turno('Me hacés descuento?', $c, $cfg);
caso('«Me hacés descuento?» → el texto aprobado, sin derivar', count($r) === 1 && $r[0] === $cfg['descuento'] && empty($c['comercial_pausa']) && empty($c['control_manual']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_cotizada();
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['cupones']])]);
$r = turno('Puedo hacer cupones de descuento para mis clientes?', $c, $cfg);
caso('los cupones de descuento de SU tienda no se confunden con pedir rebaja', count($r) === 1 && stripos($r[0], 'cupones') !== false && $r[0] !== $cfg['descuento'], json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'pago_unico' => true, 'mensajes' => ['Perfecto, te podemos armar una web con tus servicios y el contacto directo.'], 'ficha' => ['rubro' => 'tu estudio contable']])]);
$r = turno('Soy contador. No quiero suscripción, quiero comprar la web', $c, $cfg);
caso('«quiero comprarla» → los planes más el pago único ($220.000) debajo', strpos($r[1] ?? '', planes('informativa', '$140.000', '$20.000')) === 0 && strpos($r[1] ?? '', 'pago único: $220.000') !== false && !empty($c['quiere_web_propia']), $r[1] ?? '');
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online.'], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Vendo ropa', $c, $cfg);
caso('sin pedirlo, el pago único no se ofrece', strpos(implode(' ', $r), 'pago único') === false);
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Dale, entonces lo armamos como catálogo y los pedidos te llegan por WhatsApp.']])]);
$r = turno('Solo quiero mostrar los productos y que me pidan por WhatsApp', $c, $cfg);
caso('aclara la solución con el mismo plan: no se repiten los planes, sale solo la aclaración (simulación del 9-oct)',
    $r === ['Dale, entonces lo armamos como catálogo y los pedidos te llegan por WhatsApp'] && ($c['comercial_solucion'] ?? '') === 'catalogo', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_cotizada('tienda', ['quiere_web_propia' => true]);
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['hosting']])]);
$r = turno('Y el hosting quién lo paga?', $c, $cfg);
caso('hosting del pago único → incluido el primer año; a su nombre, aparte (Pablo, 9-oct)', count($r) === 1 && $r[0] === $cfg['info']['hosting_pago_unico'] && empty($c['comercial_pausa']), json_encode($r, JSON_UNESCAPED_UNICODE));

// Pablo cotizó a mano en la charla (los planes del 7-oct, hoy más baratos que la lista): se mantienen.
$c = cv('5491100009003TEST');
wabot_conv_transcript($c, 'cliente', 'Vendo zapatillas');
wabot_conv_transcript($c, 'humano', 'Perfecto, te podemos armar una tienda online para que vendas directamente desde la web');
wabot_conv_transcript($c, 'humano', "Podés elegir entre dos planes:\n\n• Plan mensual: \$30.000 por mes\n• Plan anual: \$220.000 por año\n\nAmbos incluyen todo:\n✓ Desarrollo completo de la web");
wabot_conv_transcript($c, 'humano', OFERTA);
$cot = wabot_comercial_cotizacion($c, $cfg);
caso('la cotización que pegó Pablo se lee de la charla: $220.000 / $30.000, plan con panel', $cot && $cot['origen'] === 'chat' && $cot['anual'] === '$220.000' && $cot['mensual'] === '$30.000' && $cot['plan'] === 'panel', json_encode($cot));
caso('y la oferta de Pablo cuenta como hecha', wabot_comercial_oferta_hecha($c, $cfg) && wabot_comercial_ultimo_es_oferta($c, $cfg));
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te lo repito.']])]);
$r = turno('Perdón, cuánto era el precio?', $c, $cfg);
caso('pide el precio de nuevo → solo los planes, con los montos de antes ($220.000, no los $240.000 de lista), sin volver a ofrecer la demo',
    count($r) === 1 && $r[0] === planes('panel', '$220.000', '$30.000'), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('el contexto le avisó que ya tenía precio', strpos((string)(pedidos()[0]['input'][0]['content'] ?? ''), 'YA LE PASAMOS EL PRECIO') !== false);
$c = cv('5491100009004TEST');
wabot_conv_transcript($c, 'cliente', 'Hola, soy abogado');
wabot_conv_transcript($c, 'humano', "Podés elegir entre dos planes:\n\n1) Plan anual: \$190.000 \n2) Plan mensual: \$30.000 \n\nAmbos incluyen todo:");
$cot = wabot_comercial_cotizacion($c, $cfg);
caso('el formato con 1) y 2) también se lee', $cot && $cot['anual'] === '$190.000' && $cot['mensual'] === '$30.000', json_encode($cot));
$m = wabot_comercial_montos_de_texto('Entiendo, si querés comprar la web en su totalidad, es un pago único de $330.000 .');
caso('el pago único dicho a mano también', $m['unico'] === '$330.000' && $m['anual'] === '', json_encode($m));

// Cotizada por el motor de antes, por encima y por debajo de la lista: se respeta lo congelado (9-oct).
foreach (['$180.000' => 'por encima', '$120.000' => 'por debajo'] as $congelado => $como) {
    $c = cv('5491100009005TEST', ['tipo' => 'landing', 'precio_dado' => true, 'precio_cotizado' => $congelado, 'mensualidad_cotizada' => '$20.000',
        'precio_unico_cotizado' => '$220.000', 'sena_cotizada' => '$60.000', 'precio_modelo' => 'anual', 'precio_cotizado_ts' => time() - 86400, 'fase' => 'prediseno', 'oferta_diseno_ts' => time() - 86400]);
    $v = wabot_precio_vigente($c, $cfg);
    caso("congelado $como de la lista ($congelado) se mantiene en wabot_precio_vigente", $v['precio'] === $congelado, $v['precio']);
    oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['De nuevo.']])]);
    $r = turno('cuánto era?', $c, $cfg);
    caso("y en los planes que se repiten", ($r[0] ?? '') === planes('informativa', $congelado, '$20.000'), $r[0] ?? '');
}
$cfgLista = $cfg; $cfgLista['cotizacion_conservar'] = false;
$c = cv('5491100009006TEST', ['tipo' => 'landing', 'precio_dado' => true, 'precio_cotizado' => '$180.000', 'precio_modelo' => 'anual']);
caso('con el ajuste apagado vuelve la regla vieja (vale la lista si es más baja)', wabot_precio_vigente($c, $cfgLista)['precio'] === '$140.000');
caso('wabot_monto_congelado: el congelado si existe, si no la lista', wabot_monto_congelado('$180.000', '$160.000') === '$180.000' && wabot_monto_congelado('', '$160.000') === '$160.000' && wabot_monto_congelado('$0', '$160.000') === '$160.000');

echo "— 8. Rechazo, acuses, fallas —\n";
$c = cv_cotizada();
oa([dc(['accion' => 'esperar', 'solucion' => 'tienda', 'intencion' => 'rechaza'])]);
$r = turno('No, no me interesa, gracias', $c, $cfg);
caso('rechazo → silencio, sin recordatorios para avanzar', $r === [] && ($c['comercial_pausa'] ?? '') === 'rechazo' && ($c['cierre'] ?? '') === 'rechazo' && !empty($c['seguimiento_bloqueado']) && empty($c['handoff_pendiente']));
$c = cv_cotizada();
oa([dc(['accion' => 'esperar', 'solucion' => 'tienda'])]);
$r = turno('Ok, gracias', $c, $cfg);
caso('un acuse → nada, y nada pendiente', $r === [] && empty($c['handoff_pendiente']) && empty($c['comercial_pausa']));
$c = cv();
oa([['http' => 500, 'body' => '{"error":{"message":"caido"}}'], ['http' => 500, 'body' => '{}'], ['http' => 500, 'body' => '{}']]);
$r = turno('Vendo ropa', $c, $cfg);
caso('OpenAI caído → silencio y pendiente para Pablo (nunca el motor viejo)', $r === [] && !empty($c['handoff_pendiente']) && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'responder', 'mensajes' => ['Te consulto, a qué te dedicás?']])]);
$r = turno('Hola, buenas tardes', $c, $cfg);
caso('devuelve el saludo una vez', ($r[0] ?? '') === 'Hola, buenas tardes! Te consulto, a qué te dedicás?', $r[0] ?? '');
oa([dc(['accion' => 'responder', 'mensajes' => ['Te consulto, qué vendés?']])]);
$r = turno('Hola de nuevo', $c, $cfg);
caso('y no lo repite', ($r[0] ?? '') === 'Te consulto, qué vendés?', $r[0] ?? '');

echo "— 9. La bienvenida, el proveedor y el que no viene a comprar —\n";
$GLOBALS['TC_DICE_RUBRO'] = false;
$c = cv();
oa([dc(['accion' => 'responder', 'mensajes' => ['esto no sale']])]);
$r = turno('Hola, quiero info', $c, $cfg);
caso('el primer mensaje sin rubro recibe la bienvenida fija (sin modelo)', $r === [trim((string)$cfg['bienvenida'])] && count(pedidos()) === 0 && !empty($c['bienvenida_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
$GLOBALS['TC_DICE_RUBRO'] = true;
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Buenísimo, te podemos armar una página para tu verdulería con toda la info y el contacto.'], 'ficha' => ['rubro' => 'tu verdulería']])]);
$r = turno('Tengo una verdulería', $c, $cfg);
caso('después de la bienvenida sigue el flujo', count($r) === 3 && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv('5491100009007TEST', ['canal' => 'instagram', 'conversation_key' => 'ig5491100009007TEST']);
oa([dc(['accion' => 'responder', 'mensajes' => ['Te consulto, a qué te dedicás?']])]);
$GLOBALS['TC_DICE_RUBRO'] = false;
$r = turno('Hola', $c, $cfg);
caso('en Instagram no hay bienvenida: contesta el flujo', $r === ['Hola! Te consulto, a qué te dedicás?'], json_encode($r, JSON_UNESCAPED_UNICODE));
$GLOBALS['TC_DICE_RUBRO'] = true;
$c = cv();
oa([dc(['accion' => 'responder', 'mensajes' => ['no']])]);
$r = turno('Somos una agencia de marketing digital, hacemos paginas web y redes sociales. Consultanos por nuestros planes: 15000 por mes.', $c, $cfg);
caso('un proveedor con su promo: nada, sin modelo', $r === [] && count(pedidos()) === 0 && ($c['cierre'] ?? '') === 'proveedor');
$c = cv();
oa([dc(['accion' => 'responder', 'mensajes' => ['no']])]);
$r = turno('Hola, les mando mi CV para sumarme al equipo', $c, $cfg);
caso('el que busca trabajo recibe el texto de siempre y queda para Pablo', $r === [$cfg['mensaje_laboral']] && count(pedidos()) === 0 && !empty($c['handoff_pendiente']));

echo "— 10. El recordatorio del formulario según el estado —\n";
$cfgRec = $cfg; $cfgRec['form_recordatorio_activo'] = true; $cfgRec['seguimiento_hora_desde'] = 0; $cfgRec['seguimiento_hora_hasta'] = 24;
$hace13h = time() - 13 * 3600;
$base = ['form_link_mandado_ts' => $hace13h, 'ultimo_cliente_ts' => time() - 3 * 3600,
         'transcript' => [['q' => 'cliente', 't' => 'dale', 'ts' => time() - 3 * 3600], ['q' => 'bot', 't' => 'Para hacer la demo… gokywebs.com/form/?c=AB', 'ts' => $hace13h]]];
$c = cv('5491100009008TEST', $base + ['link_form_enviado' => true, 'comercial_pausa' => 'formulario']);
caso('formulario mandado por el flujo, sin intervención ni rechazo → el recordatorio sigue vigente', wabot_form_recordatorio_corresponde($c, $cfgRec));
$c = cv('5491100009008TEST', $base + ['link_form_enviado' => true, 'comercial_pausa' => 'humano', 'seguimiento_bloqueado' => true]);
caso('derivada a Pablo por un caso especial → sin recordatorio', !wabot_form_recordatorio_corresponde($c, $cfgRec));
$c = cv('5491100009008TEST', $base + ['comercial_pausa' => 'rechazo', 'cierre' => 'rechazo', 'seguimiento_bloqueado' => true]);
caso('el que rechazó → sin recordatorio', !wabot_form_recordatorio_corresponde($c, $cfgRec));
caso('la oferta aprobada se reconoce para el seguimiento de las 23 h', wabot_texto_es_oferta_entrega(OFERTA) && wabot_texto_es_oferta_entrega('Siempre antes de avanzar, armamos una primera entrega de la web, sin costo, para que puedas verla antes de decidir'));
caso('y un texto cualquiera no', !wabot_texto_es_oferta_entrega('La demo queda disponible 5 días.'));

echo "— 11. El contexto y el estado —\n";
$c = cv();
$largo = str_repeat('necesito que la web tenga turnos online y ', 40) . 'FINAL_DEL_AUDIO';
wabot_conv_transcript($c, 'cliente', $largo);
wabot_conv_transcript($c, 'bot', 'Te consulto, a qué te dedicás?');
wabot_conv_transcript($c, 'cliente', 'Soy dentista');
$ctx = wabot_comercial_contexto('Soy dentista', $c, $cfg);
caso('un audio largo de antes no pierde el final (2500 caracteres por mensaje del cliente)', strpos($ctx, 'FINAL_DEL_AUDIO') !== false);
for ($i = 0; $i < 45; $i++) { wabot_conv_transcript($c, 'cliente', "mensaje $i"); wabot_conv_transcript($c, 'bot', "respuesta nuestra $i"); }
$ctx = wabot_comercial_contexto('otro', $c, $cfg);
caso('lo viejo se resume con los dos lados', strpos($ctx, 'ANTES EN LA CHARLA') !== false && strpos($ctx, 'Gokywebs: respuesta nuestra') !== false);
caso('estado: atención / formulario / humano / rechazo', wabot_comercial_estado(cv()) === 'atencion' && wabot_comercial_estado(cv('x', ['form_link_mandado_ts' => 1])) === 'formulario'
    && wabot_comercial_estado(cv('x', ['comercial_pausa' => 'humano'])) === 'humano' && wabot_comercial_estado(cv('x', ['comercial_pausa' => 'rechazo'])) === 'rechazo');
caso('con el modo sugerencias, el control manual no frena la sugerencia', wabot_comercial_elegible(cv('x', ['control_manual' => true]), $cfg, 'sugerencias')[0] === true
    && wabot_comercial_elegible(cv('x', ['control_manual' => true]), $cfg, 'auto')[0] === false);

echo "— 12. De punta a punta por el webhook —\n";
$src = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($src, 'function wabot_conv_identidad_entrante');
$hasta = strpos($src, '/* ── Instagram: otro formato');
eval(substr($src, $desde, $hasta - $desde));
$tel = '5491100009009TEST';
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online para tus zapatillas.'], 'ficha' => ['que_vende' => 'zapatillas']])]);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('tc.1'), 'canal' => 'whatsapp', 'texto' => 'Vendo zapatillas', 'nombre' => 'Marta', 'media' => null], $cfg);
$cvd = wabot_conv_load($tel);
caso('el webhook manda los tres mensajes y guarda la charla cotizada', count($GLOBALS['WABOT_TEST_ENVIADOS']) === 3 && !empty($cvd['precio_dado']) && ($cvd['comercial_cotizacion']['anual'] ?? '') === '$190.000'
    && count(array_filter($cvd['transcript'], fn($l) => $l['q'] === 'bot')) === 3, json_encode($GLOBALS['WABOT_TEST_ENVIADOS'], JSON_UNESCAPED_UNICODE));
caso('el segundo mensaje enviado es el bloque de planes exacto', ($GLOBALS['WABOT_TEST_ENVIADOS'][1][1] ?? '') === planes('panel', '$190.000', '$30.000'));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('tc.2'), 'canal' => 'whatsapp', 'texto' => 'Dale, armala', 'nombre' => 'Marta', 'media' => null], $cfg);
$cvd = wabot_conv_load($tel);
caso('el sí manda el formulario y la charla queda en pausa por formulario', count($GLOBALS['WABOT_TEST_ENVIADOS']) === 1 && strpos($GLOBALS['WABOT_TEST_ENVIADOS'][0][1], 'gokywebs.com/form/') !== false
    && ($cvd['comercial_pausa'] ?? '') === 'formulario' && !empty($cvd['form_link_mandado_ts']));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
oa([dc(['accion' => 'responder', 'mensajes' => ['no']])]);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('tc.3'), 'canal' => 'whatsapp', 'texto' => 'Y el hosting va incluido?', 'nombre' => 'Marta', 'media' => null], $cfg);
caso('después del formulario el webhook no manda nada y no llama al modelo', $GLOBALS['WABOT_TEST_ENVIADOS'] === [] && count(pedidos()) === 0 && !empty(wabot_conv_load($tel)['handoff_pendiente']));
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel));

// En el modo off, nada de esto corre: la charla se atiende como siempre.
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'off';
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = true;
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['no'], 'ficha' => ['que_vende' => 'ropa']])]);
$GLOBALS['TC_DICE_RUBRO'] = false;
$r = turno('Hola', $c, $cfg);
caso('en off, el primer mensaje recibe la bienvenida de siempre y el flujo no interviene', $r === [trim((string)$cfg['bienvenida'])] && count(pedidos()) === 0);
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = false;
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';

echo "— 13. Reglas del 9-oct a la noche (Pablo) —\n";
$GLOBALS['TC_DICE_RUBRO'] = true;
caso('anual de lista: $140.000 la informativa y $190.000 el resto; mantenimiento del pago único $15.000 para todos',
    $cfg['tipos']['landing']['precio'] === '$140.000' && $cfg['tipos']['ecommerce']['precio'] === '$190.000' && $cfg['tipos']['elearning']['precio'] === '$190.000'
    && $cfg['tipos']['inmobiliaria']['precio'] === '$190.000' && $cfg['tipos']['landing']['mantenimiento'] === '$15.000' && $cfg['tipos']['ecommerce']['mantenimiento'] === '$15.000');
caso('pago único sigue $220.000 / $330.000', $cfg['tipos']['landing']['precio_unico'] === '$220.000' && $cfg['tipos']['ecommerce']['precio_unico'] === '$330.000');
caso('las páginas de pago del anual son anual140 y anual190', wabot_planes_paginas()['landing']['anual']['pagina'] === 'anual140' && wabot_planes_paginas()['ecommerce']['anual']['pagina'] === 'anual190');
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa_panel', 'mensajes' => ['Perfecto, te podemos armar una web para tu estudio, con un panel para que cambies vos los textos y las fotos.'], 'ficha' => ['rubro' => 'tu estudio de arquitectura']])]);
$r = turno('Soy arquitecta y quiero una web para mostrar mis obras, y poder cambiar yo misma las fotos', $c, $cfg);
caso('informativa con panel (quiere cambiar ella el contenido) → plan con panel $190.000 / $30.000, tipo landing con panel',
    ($r[1] ?? '') === planes('panel', '$190.000', '$30.000') && ($c['tipo'] ?? '') === 'landing' && !empty($c['landing_con_panel']), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('a esa charla sí le corresponde el texto con panel', !wabot_conv_sin_panel($c));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Buenísimo, te podemos armar una página para tu estudio contable.'], 'ficha' => ['rubro' => 'tu estudio contable']])]);
turno('Soy contadora', $c, $cfg);
caso('la informativa de $20.000 queda sin panel', wabot_conv_sin_panel($c) && empty($c['landing_con_panel']));
$incl = wabot_texto_info('que_incluye', $cfg, $c);
caso('"qué incluye" en la informativa no nombra un panel', mb_stripos($incl, 'panel') === false && mb_stripos($incl, 'un cambio por mes') !== false, $incl);
$carga = wabot_texto_info('carga', $cfg, $c);
caso('"lo puedo cambiar yo?" en la informativa: los cambios los hacemos nosotros, con panel va el plan de $30.000', mb_stripos($carga, 'los hacemos nosotros') !== false && strpos($carga, '$30.000') !== false, $carga);
caso('la propuesta de respaldo de la informativa no nombra un panel', mb_stripos($cfg['comercial']['propuesta_fija']['informativa'], 'panel') === false);
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'cursos', 'internacional' => true, 'mensajes' => ['Perfecto, te podemos armar una web para tus cursos, con inscripción y pago online desde cualquier país.'], 'ficha' => ['que_vende' => 'cursos de ayurveda']])]);
$r = turno('Doy cursos de ayurveda online para toda Latinoamérica y necesito cobrar desde otros países', $c, $cfg);
caso('cobros internacionales → plan internacional $40.000 por mes, con su bloque', strpos($r[1] ?? '', '2) Plan mensual: $40.000') !== false && strpos($r[1] ?? '', 'Cobros internacionales') !== false
    && ($c['comercial_cotizacion']['plan'] ?? '') === 'internacional' && ($c['mensualidad_cotizada'] ?? '') === '$40.000', json_encode($r, JSON_UNESCAPED_UNICODE));
$cot = wabot_comercial_cotizacion(['transcript' => [['q' => 'humano', 't' => "Podés elegir entre dos planes:\n\n1) Plan anual: \$240.000\n2) Plan mensual: \$40.000", 'ts' => time()]]], $cfg);
caso('una cotización internacional pegada a mano se reconoce por el mensual de $40.000', ($cot['plan'] ?? '') === 'internacional', json_encode($cot));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'internacional' => true, 'pago_unico' => true, 'mensajes' => ['Te armamos la tienda.'], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Vendo ropa a todo el mundo y quiero comprar la web, no suscripción', $c, $cfg);
caso('internacional con pago único (sin precio de lista) → para Pablo', $r === [] && ($c['comercial_pausa'] ?? '') === 'humano', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online con todos tus repuestos.'], 'ficha' => ['que_vende' => 'repuestos']])]);
$r = turno('Vendo repuestos de autos, tengo unos 3000 productos', $c, $cfg);
caso('miles de productos ya no van a Pablo: se cotiza y se avisa que lo digan antes', !empty($c['precio_dado']) && empty($c['comercial_pausa'])
    && strpos(implode(' ', $r), 'miles de productos') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'info_claves' => ['instagram_sigue', 'muchos_productos'], 'mensajes' => ['Buenas! Te podemos armar una tienda online de ropa.'], 'ficha' => ['que_vende' => 'ropa']])]);
$r = turno('Hola buenas, quiero pasar mi tienda de Instagram a una web, son unos 400 productos de ropa', $c, $cfg);
caso('al cotizar sin pregunta: como mucho una respuesta oficial (los muchos productos), un solo saludo y después la propuesta (simulación 11)',
    count($r) === 4 && strpos($r[0], 'miles de productos') !== false && str_starts_with($r[0], 'Hola') && str_starts_with($r[1], 'Te podemos armar'), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Te podemos armar una tienda.'], 'ficha' => ['que_vende' => 'leches']])]);
turno('Vendo leches maternizadas', $c, $cfg);
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Entonces lo armamos como catálogo con pedido por WhatsApp.']])]);
turno('Solo quiero mostrar y que me pidan por WhatsApp', $c, $cfg);
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Entonces lo armamos como catálogo.']])]);
$r = turno('Si', $c, $cfg);
caso('"Si" después de aclarar la solución, con la oferta abierta → el formulario (simulación 10)', con_form($r) && count($r) === 1, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('envíos: por provincia, con Correo Argentino y Andreani integrados, sin "por zona"', mb_stripos($cfg['info']['envios'], 'provincia') !== false
    && mb_stripos($cfg['info']['envios'], 'Andreani') !== false && mb_stripos($cfg['info']['envios'], 'por zona') === false);
caso('el dominio se transfiere con el primer pago', mb_stripos($cfg['info']['dominio_a_nombre'], 'primer pago') !== false);
caso('el dominio no protege la marca', mb_stripos($cfg['info']['marca'], 'registrar') !== false);
$d = wabot_comercial_normalizar(dc(['mensajes' => ["Dale, pensalo con calma.\nCuando quieras me escribís."]]), $cfg);
caso('sin punto final en los mensajes del modelo (los "..." quedan)', $d['mensajes'] === ["Dale, pensalo con calma\nCuando quieras me escribís"]
    && wabot_comercial_normalizar(dc(['mensajes' => ['Mmm...']]), $cfg)['mensajes'] === ['Mmm...'], json_encode($d['mensajes'], JSON_UNESCAPED_UNICODE));
$ins = wabot_comercial_instrucciones_comportamiento();
caso('las instrucciones piden no asumir el género y presentar la web como herramienta', mb_stripos($ins, 'género') !== false && mb_stripos($ins, 'herramienta') !== false);

echo "— 14. Devolución del 9-oct a la noche: pregunta pendiente, quién carga, catálogo, herramienta —\n";
// La web es una herramienta: el modelo nunca promete resultados.
foreach (['Con la web vas a conseguir más clientes', 'Te ayuda a llegar a más gente', 'Así vendés más', 'Te garantizamos ventas',
          'La tienda te va a traer clientes nuevos', 'Vas a tener más ventas'] as $m) {
    $p = (string)wabot_comercial_mensaje_problema($m);
    caso("red: «{$m}» promete resultados", str_starts_with($p, 'promete resultados'), $p);
}
foreach (['Si tenés más consultas, escribime', 'Si vendés más de un rubro, va todo en la misma tienda', 'Te ayuda a vender más fácil desde el celular',
          'Perfecto, te podemos armar una tienda online para que vendas directamente desde la web, incluso generar ventas sin que estés pendiente del celular',
          'Así aprovechás mejor a la gente que te llega por Instagram o por tus anuncios'] as $m) {
    caso("red: «{$m}» no es una promesa", wabot_comercial_mensaje_problema($m) === null, (string)wabot_comercial_mensaje_problema($m));
}
foreach ((array)$cfg['comercial']['propuesta_fija'] as $s => $p) {
    caso("la propuesta de respaldo de $s pasa la red, sin punto final", wabot_comercial_mensaje_problema($p) === null && !str_ends_with($p, '.'), (string)wabot_comercial_mensaje_problema($p));
}
$ins = wabot_comercial_instrucciones_comportamiento();
caso('instrucciones: la propuesta dice para qué le sirve como herramienta y nunca promete resultados',
    mb_stripos($ins, 'Para qué le sirve como herramienta') !== false && mb_stripos($ins, 'Nunca prometas resultados') !== false && mb_stripos($ins, 'alcanzar a más público') === false);
caso('instrucciones: la palabra "catálogo" sola no alcanza (asumir venta online)', mb_stripos($ins, 'La palabra "catálogo" sola no alcanza') !== false && mb_stripos($ins, 'También si pide "un catálogo"') === false);
caso('instrucciones: la pregunta de los turnos queda pendiente (ya no "no vuelvas a preguntar: cotizá")',
    mb_stripos($ins, 'no vuelvas a preguntar: cotizá la informativa') === false && mb_stripos($ins, 'la pregunta queda pendiente') !== false);

// Quién carga los productos: "Se pueden cargar todos ustedes?" no es "lo puedo manejar yo?".
$cn = (string)($cfg['info']['carga_nosotros'] ?? '');
caso('carga_nosotros: con las palabras de Pablo (costo adicional según la cantidad), corta y sin monto',
    mb_stripos($cn, 'costo adicional según la cantidad') !== false && mb_strlen($cn) <= 260 && strpos($cn, '$') === false, $cn);
$infoTxt = wabot_comercial_info($cfg);
caso('carga_nosotros se le ofrece al modelo, con cómo lo preguntan', in_array('carga_nosotros', wabot_comercial_info_claves($cfg), true)
    && strpos($infoTxt, '- carga_nosotros:') !== false && strpos($infoTxt, 'Se pueden cargar todos ustedes?') !== false);
foreach (['Se pueden cargar todos ustedes?' => true, 'Los articulos los cargan ustedes o lo debo hacer yo?' => true, 'yo te paso los precios, los ponés vos?' => true,
          'los productos vienen ya cargados?' => true, 'y vos me cargás los productos?' => true, 'El contenido lo cargan ustedes?' => true,
          'Los productos los cargo yo?' => false, 'Ustedes hacen la demo sin cargo?' => false, 'Ustedes ponen el dominio?' => false,
          'Puedo cambiar yo los precios?' => false] as $m => $esperado) {
    caso("¿pide que carguemos nosotros? «{$m}» → " . ($esperado ? 'sí' : 'no'), wabot_comercial_pide_que_carguemos($m) === $esperado);
}
$c = cv_cotizada('tienda');
oa([dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['carga'], 'mensajes' => []])]);
$r = turno('Se pueden cargar todos ustedes?', $c, $cfg);
caso('"Se pueden cargar todos ustedes?" con la respuesta de "lo manejás vos" elegida → sale carga_nosotros (simulación 11)',
    count($r) === 1 && $r[0] === $cn, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Buenísimo, te podemos armar una página para tu estudio contable.'], 'ficha' => ['rubro' => 'tu estudio contable']])]);
turno('Soy contadora', $c, $cfg);
oa([dc(['accion' => 'responder', 'solucion' => 'informativa', 'info_claves' => ['carga_nosotros'], 'mensajes' => []])]);
$r = turno('El contenido lo cargan ustedes?', $c, $cfg);
caso('en la informativa sin panel, "lo cargan ustedes?" → los cambios los hacemos nosotros (carga_sitio)',
    count($r) === 1 && mb_stripos($r[0], 'los hacemos nosotros') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

// La pregunta de los turnos queda pendiente: no se elige por el cliente ni se cotiza.
function cv_turnos() {
    $c = cv('5491100009003TEST');
    wabot_conv_transcript($c, 'cliente', 'Tengo una peluquería');
    wabot_conv_transcript($c, 'bot', 'Para tu peluquería, preferís que te pidan turno por WhatsApp o que reserven día y horario desde la web?');
    return $c;
}
$propPelu = ['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Para tu peluquería podemos armarte una web con tus servicios y horarios, para que te pidan turno por WhatsApp'], 'ficha' => ['rubro' => 'tu peluquería']];
caso('la pregunta de los turnos se reconoce (la del modelo y la fija)', wabot_comercial_es_pregunta_turnos('Para tu peluquería, preferís que te pidan turno por WhatsApp o que reserven día y horario desde la web?')
    && wabot_comercial_es_pregunta_turnos($cfg['comercial']['pregunta_turnos'])
    && wabot_comercial_es_pregunta_turnos('querés solamente mostrar tus servicios y recibir consultas, o también necesitás que puedan reservar turnos directamente desde la página?')
    && !wabot_comercial_es_pregunta_turnos('Te consulto, a qué te dedicás o qué vendés?'));
$c = cv_turnos();
oa([dc($propPelu + ['info_claves' => ['plazos']])]);
$r = turno('Y cuánto tardan en hacerla?', $c, $cfg);
caso('turnos sin contestar + "cuánto tardan?" → el plazo y se le recuerda la pregunta, sin cotizar (simulación 02)',
    count($r) === 2 && mb_stripos($r[0], '7 días') !== false && ($r[1] ?? '') === $cfg['comercial']['pregunta_turnos'] && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_turnos();
oa([dc($propPelu)]);
$r = turno('Por WhatsApp está bien', $c, $cfg);
caso('turnos contestados ("por WhatsApp") → se cotiza la informativa', count($r) === 3 && ($r[1] ?? '') === planes('informativa', '$140.000', '$20.000'), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_turnos();
oa([dc($propPelu)]);
turno('Y tardan mucho?', $c, $cfg);
oa([dc($propPelu)]);
$r = turno('Y hacen logos también?', $c, $cfg);
caso('ya recordada una vez y sigue sin contestar → decide el modelo (no repregunta en loop)', count($r) === 3 && ($r[1] ?? '') === planes('informativa', '$140.000', '$20.000'), json_encode($r, JSON_UNESCAPED_UNICODE));

// "Si tiene un costo" sin contestar: los dos precios y que elija, como Pablo el 9-oct.
foreach (['Cuánto sale?' => true, 'Si tiene un costo' => true, 'Precio?' => true, 'Cuánto?' => true, 'cuánto tardan y cuánto sale?' => true,
          'Y cuánto tardan en hacerla?' => false, 'Y hacen logos también?' => false] as $m => $esperado) {
    caso("¿pregunta el costo? «{$m}» → " . ($esperado ? 'sí' : 'no'), wabot_comercial_pregunta_costo($m) === $esperado);
}
$conConReservas = "Con reservas quedaría en:\n\n1) Plan anual: \$190.000\n2) Plan mensual: \$30.000";
$c = cv_turnos();
oa([dc($propPelu + ['accion' => 'responder', 'mensajes' => ['Depende de cómo quieras los turnos']])]);
$r = turno('Si tiene un costo', $c, $cfg);
caso('turnos sin contestar + "Si tiene un costo" → "Es otro plan si incluye reservas", sin reservas y con reservas, sin oferta todavía',
    count($r) === 3 && $r[0] === 'Es otro plan si incluye reservas'
    && $r[1] === 'Sin reservas p' . mb_substr(planes('informativa', '$140.000', '$20.000'), 1) && $r[2] === $conConReservas
    && !empty($c['precio_dado']) && ($c['comercial_cotizacion']['plan'] ?? '') === 'informativa' && empty($c['comercial_oferta_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
$cDos = $c;
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Perfecto, entonces'], 'ficha' => ['rubro' => 'tu peluquería']])]);
$r = turno('Sin reservas, que me escriban por WhatsApp', $c, $cfg);
caso('elige sin reservas → "Perfecto, entonces" pegado a la oferta de la demo, sin repetir los planes',
    count($r) === 1 && $r[0] === 'Perfecto, entonces si te interesa, te preparamos una demo gratis para que veas cómo quedaría tu web antes de decidir. Querés que la armemos?'
    && !empty($c['comercial_oferta_ts']) && ($c['comercial_cotizacion']['mensual'] ?? '') === '$20.000', json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'formulario', 'solucion' => 'informativa', 'intencion' => 'acepta', 'mensajes' => []])]);
$r = turno('Dale', $c, $cfg);
caso('y la oferta pegada se reconoce: "Dale" → el formulario', con_form($r), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = $cDos;
oa([dc(['accion' => 'cotizar', 'solucion' => 'reservas', 'mensajes' => ['Perfecto, entonces'], 'ficha' => ['rubro' => 'tu peluquería']])]);
$r = turno('Con reservas', $c, $cfg);
caso('elige con reservas → "Perfecto, entonces podés elegir entre dos planes:" con panel y la oferta, como Pablo',
    count($r) === 2 && $r[0] === 'Perfecto, entonces p' . mb_substr(planes('panel', '$190.000', '$30.000'), 1) && $r[1] === OFERTA
    && ($c['comercial_cotizacion']['plan'] ?? '') === 'panel' && ($c['mensualidad_cotizada'] ?? '') === '$30.000', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv('5491100009004TEST');
wabot_conv_transcript($c, 'cliente', 'Soy masajista');
wabot_conv_transcript($c, 'bot', "Buenísimo. Podemos armarte una web para mostrar los tipos de masajes que ofrecés, precios, horarios y contacto directo\n\nTe consulto: querés que la gente solamente te escriba por WhatsApp o también que pueda reservar turnos desde la página?");
oa([dc(['accion' => 'cotizar', 'solucion' => 'informativa', 'mensajes' => ['Perfecto, entonces'], 'ficha' => ['rubro' => 'tus masajes']])]);
$r = turno('Que escriba por Whatsapp solamente', $c, $cfg);
caso('la pregunta de Pablo contestada → "Perfecto, entonces podés elegir entre dos planes:" + la oferta (dos mensajes)',
    count($r) === 2 && $r[0] === 'Perfecto, entonces p' . mb_substr(planes('informativa', '$140.000', '$20.000'), 1) && $r[1] === OFERTA, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv('5491100009005TEST');
wabot_conv_transcript($c, 'cliente', 'Tengo un gabinete de estética y vendo mi línea de cosmética');
wabot_conv_transcript($c, 'bot', "Buenísimo. Podemos armarte una web para mostrar los tratamientos y vender tu línea de cosmética\n\nTe consulto: querés que la gente pueda reservar turnos directamente desde la página también?");
oa([dc(['accion' => 'cotizar', 'solucion' => 'reservas', 'mensajes' => ['Perfecto, entonces'], 'ficha' => ['rubro' => 'tu gabinete de estética']])]);
$r = turno('Si', $c, $cfg);
caso('"Si" a "querés que también puedan reservar turnos?" contesta la pregunta → se cotiza con reservas', count($r) === 2 && strpos($r[0], '$30.000') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));

// Lo que salió de los chats de Pablo del 9-oct.
foreach (['medios_pago_tienda' => 'billetera virtual', 'mp_nombre_negocio' => 'nombre del negocio'] as $k => $frase) {
    caso("respuesta oficial nueva $k (texto de Pablo), corta y ofrecida al modelo", mb_stripos((string)($cfg['info'][$k] ?? ''), $frase) !== false
        && mb_strlen((string)$cfg['info'][$k]) <= 260 && in_array($k, wabot_comercial_info_claves($cfg), true) && strpos($infoTxt, "- $k:") !== false);
}
caso('instrucciones: la herramienta con las palabras de Pablo, "no hacemos publicidad directamente", dropshipping y nada de mes de gracia',
    mb_stripos($ins, 'La web te sirve como herramienta para') !== false && mb_stripos($ins, 'Nosotros no hacemos publicidad directamente') !== false
    && mb_stripos($ins, 'dropshipping') !== false && mb_stripos($ins, 'nunca ofrezcas un mes de gracia') !== false);
caso('instrucciones: la pregunta de los turnos como la hace Pablo, y "Perfecto, entonces" al contestarla',
    mb_stripos($ins, 'Te consulto: querés que la gente solamente te escriba por WhatsApp') !== false && mb_stripos($ins, '"Perfecto, entonces"') !== false);
foreach (['La web te ayuda a captar nuevos clientes'] as $m) {
    caso("red: «{$m}» promete resultados", str_starts_with((string)wabot_comercial_mensaje_problema($m), 'promete resultados'));
}
foreach (["Buenísimo. En tu caso podemos armarte una tienda online para vender los productos del bazar y regalería directamente desde la web, con fotos, precios, stock y categorías\n\nLa web te sirve como una herramienta para ordenar mejor el negocio y aprovechar a la gente que llegue desde Instagram, Facebook, WhatsApp, Google o publicidad, sin tener que responder cada producto uno por uno\n\nDespués tendrías un panel para cargar productos nuevos, cambiar precios, imágenes y stock cuando quieras",
          'La web te sirve como herramienta para presentar mejor tus servicios y facilitar que potenciales clientes te contacten directamente',
          'La web te sirve como herramienta para tener presencia profesional y poder compartirla en Google, redes y publicidad. Nosotros no hacemos publicidad directamente, así que el alcance se trabaja aparte'] as $m) {
    caso('red: una propuesta real de Pablo (9-oct) pasa: «' . mb_substr(str_replace("\n", ' ', $m), 0, 60) . '…»', wabot_comercial_mensaje_problema($m) === null, (string)wabot_comercial_mensaje_problema($m));
}
caso('"Perfecto, entonces" se reconoce como confirmación corta; una propuesta entera no', wabot_comercial_es_confirmacion_corta('Perfecto, entonces')
    && wabot_comercial_es_confirmacion_corta('Perfecto entonces') && !wabot_comercial_es_confirmacion_corta('Perfecto, entonces te armamos una web para tu peluquería'));

// Productos: venta online salvo que diga expresamente que no quiere cobrar (Pablo, 9-oct).
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Podemos armarte un catálogo de velas para que te pidan por WhatsApp'], 'ficha' => ['que_vende' => 'velas']]),
    dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Podemos armarte una tienda online de velas para que la gente compre directo desde la web, con un panel para manejar los productos'], 'ficha' => ['que_vende' => 'velas']])]);
$r = turno('Necesito armar un catálogo de velas', $c, $cfg);
caso('"catálogo de velas" sin decir que no quiere cobrar → una corrección y queda tienda (simulación 19)', count(pedidos()) === 2 && ($c['comercial_solucion'] ?? '') === 'tienda'
    && strpos((string)(pedidos()[1]['input'][2]['content'] ?? ''), 'asumí venta online') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Podemos armarte un catálogo de velas'], 'ficha' => ['que_vende' => 'velas']]),
    dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Podemos armarte un catálogo de velas'], 'ficha' => ['que_vende' => 'velas']])]);
$r = turno('Necesito armar un catálogo de velas', $c, $cfg);
caso('si el modelo insiste con catálogo, vale (la duda nunca deja al cliente sin respuesta)', count($r) === 3 && ($c['comercial_solucion'] ?? '') === 'catalogo', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv();
oa([dc(['accion' => 'cotizar', 'solucion' => 'catalogo', 'mensajes' => ['Te armamos un catálogo con pedido por WhatsApp'], 'ficha' => ['que_vende' => 'suplementos']])]);
turno('Vendo suplementos, solo quiero mostrarlos y que me pidan por WhatsApp', $c, $cfg);
caso('catálogo pedido expresamente → sin corrección (una sola llamada)', count(pedidos()) === 1 && ($c['comercial_solucion'] ?? '') === 'catalogo');

echo "— 15. El revisor: se da cuenta antes de mandar (Pablo, 9-oct) —\n";
$revMal = ['ok' => false, 'problemas' => [['tipo' => 'contradice', 'detalle' => 'Preguntó por los envíos y se le contesta sobre publicidad']], 'falta_contestar' => ['hacen envíos al interior?']];
$revRepite = ['ok' => false, 'problemas' => [['tipo' => 'repite', 'detalle' => 'Dice dos veces que la publicidad va aparte']], 'falta_contestar' => []];
$decMal = dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['marketing'], 'mensajes' => []]);
$decBien = dc(['accion' => 'responder', 'solucion' => 'tienda', 'info_claves' => ['envios'], 'mensajes' => []]);
$c = cv_cotizada('tienda');
oa([$decMal, $decBien], [$revMal]);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('el revisor ve que contesta otra cosa → el modelo corrige una vez y sale la corregida', $r === [$cfg['info']['envios']] && count(pedidos()) === 2
    && count($GLOBALS['OA_REVISIONES']) === 2 && ($c['comercial_ultimo']['revision']['estado'] ?? '') === 'corregida', json_encode($r, JSON_UNESCAPED_UNICODE));
$pedidoCorr = (string)(pedidos()[1]['input'][2]['content'] ?? '');
caso('la corrección le dice qué vio el revisor y lo que iba a salir', strpos($pedidoCorr, 'Preguntó por los envíos y se le contesta sobre publicidad') !== false
    && strpos($pedidoCorr, 'hacen envíos al interior?') !== false && strpos($pedidoCorr, 'Publicidad y redes no hacemos') !== false, $pedidoCorr);
$revIn = (string)($GLOBALS['OA_REVISIONES'][0]['input'][0]['content'] ?? '');
caso('el revisor recibe la charla y la respuesta propuesta con su tipo', strpos($revIn, 'Y hacen envíos al interior?') !== false
    && strpos($revIn, 'RESPUESTA PROPUESTA') !== false && strpos($revIn, '[Respuesta oficial] Publicidad y redes no hacemos') !== false, mb_substr($revIn, -400));
caso('y sus instrucciones traen la información comercial (para ver si inventa)', strpos((string)($GLOBALS['OA_REVISIONES'][0]['instructions'] ?? ''), 'INFORMACIÓN COMERCIAL DE GOKYWEBS') !== false);
$c = cv_cotizada('tienda');
oa([$decMal, $decMal], [$revMal, $revMal]);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('si lo corregido sigue mal (grave), en automático no sale nada y lo ve Pablo con el motivo', $r === [] && ($c['comercial_pausa'] ?? '') === 'humano'
    && str_starts_with((string)($c['comercial_motivo'] ?? ''), 'Revisión: ') && !empty($c['handoff_pendiente']), json_encode([$r, $c['comercial_motivo'] ?? ''], JSON_UNESCAPED_UNICODE));
$c = cv_cotizada('tienda');
oa([$decBien, $decBien], [$revRepite, $revRepite]);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('si lo que queda es menor (repite), sale igual y queda anotado como dudosa', $r === [$cfg['info']['envios']] && empty($c['comercial_pausa'])
    && ($c['comercial_ultimo']['revision']['estado'] ?? '') === 'dudosa', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_cotizada('tienda');
oa([$decBien], ['falla']);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('si el revisor no contesta, el turno sigue como estaba (nunca frena por eso)', $r === [$cfg['info']['envios']] && ($c['comercial_ultimo']['revision']['estado'] ?? '') === 'sin_revisar', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_cotizada('tienda');
oa([dc(['accion' => 'esperar', 'solucion' => 'tienda', 'mensajes' => []]), $decBien],
   [['ok' => false, 'problemas' => [], 'falta_contestar' => ['hacen envíos al interior?']]]);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('no contestar una pregunta también se revisa ("se saltea respuestas") → la corrige', $r === [$cfg['info']['envios']] && count($GLOBALS['OA_REVISIONES']) === 2, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_cotizada('tienda');
oa([dc(['accion' => 'humano', 'solucion' => 'tienda', 'motivo' => 'Pide conectar con Mercado Libre'])]);
turno('Se puede conectar con Mercado Libre?', $c, $cfg);
caso('pasarlo a Pablo no se revisa', count($GLOBALS['OA_REVISIONES']) === 0);
$c = cv_cotizada('tienda');
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
$r = turno('Dale', $c, $cfg);
caso('solo el formulario, sin pregunta del cliente, no se revisa (no gasta)', con_form($r) && count($GLOBALS['OA_REVISIONES']) === 0, json_encode($r, JSON_UNESCAPED_UNICODE));
$GLOBALS['WABOT_TEST_REVISOR'] = false;
$c = cv_cotizada('tienda');
oa([$decMal]);
$r = turno('Y hacen envíos al interior?', $c, $cfg);
caso('con el revisor apagado no hay llamada de más', count($GLOBALS['OA_REVISIONES']) === 0 && count($r) === 1);
unset($GLOBALS['WABOT_TEST_REVISOR']);
caso('de fábrica el revisor está prendido', ($cfg['comercial']['revisor'] ?? null) === true && wabot_comercial_revisor_activo($cfg));
$insRev = wabot_comercial_instrucciones_revisor();
foreach (['no_contesta', 'contradice', 'decide_por_cliente', 'se_saltea_paso', 'repite', 'inventa', 'promete', 'Ante la duda, ok = true'] as $p) {
    caso("las instrucciones del revisor hablan de «{$p}»", mb_stripos($insRev, $p) !== false);
}

echo "— 16. Conversaciones live: solo las que tiene el bot (Pablo, 9-oct) —\n";
$c = cv('5491100009010TEST');
wabot_conv_transcript($c, 'cliente', 'Hola! Quiero mas información');
wabot_conv_transcript($c, 'bot', trim((string)$cfg['bienvenida']));
caso('solo la bienvenida, sin respuesta del cliente → no se vigila', !wabot_comercial_bot_tiene($c, $cfg));
wabot_conv_transcript($c, 'cliente', 'Vendo zapatillas');
caso('el cliente le contestó a la bienvenida → la tiene el bot', wabot_comercial_bot_tiene($c, $cfg) && wabot_comercial_bot_salio($c) === null);
$c = cv_cotizada('tienda');
caso('el bot cotizó y espera al cliente → la tiene el bot', wabot_comercial_bot_tiene($c, $cfg));
$tomada = $c;
wabot_conv_tomar_control($tomada);
$salio = wabot_comercial_bot_salio($tomada);
caso('la tomó Pablo → sale, "La tomaste vos", con la hora', !wabot_comercial_bot_tiene($tomada, $cfg) && ($salio['motivo'] ?? '') === 'La tomaste vos' && abs(($salio['ts'] ?? 0) - time()) < 5, json_encode($salio, JSON_UNESCAPED_UNICODE));
$c2 = cv_cotizada('tienda');
oa([dc(['accion' => 'humano', 'solucion' => 'tienda', 'motivo' => 'Pide conectar con Mercado Libre'])]);
turno('Se puede conectar con Mercado Libre?', $c2, $cfg);
$salio = wabot_comercial_bot_salio($c2);
caso('el bot se la pasó a Pablo → sale, con el motivo', !wabot_comercial_bot_tiene($c2, $cfg) && ($salio['motivo'] ?? '') === 'Te la pasó: Pide conectar con Mercado Libre' && ($salio['ts'] ?? 0) > 0, json_encode($salio, JSON_UNESCAPED_UNICODE));
$c3 = cv_cotizada('tienda');
oa([dc(['accion' => 'formulario', 'solucion' => 'tienda', 'intencion' => 'acepta'])]);
turno('Dale', $c3, $cfg);
caso('mandó el formulario → sale ("la seguís vos")', !wabot_comercial_bot_tiene($c3, $cfg) && str_starts_with((string)(wabot_comercial_bot_salio($c3)['motivo'] ?? ''), 'Le mandó el formulario'));
$c4 = cv_cotizada('tienda');
$c4['archivado'] = true;   // archivarla después del turno: un mensaje del cliente la saca del archivo
$c5 = cv_cotizada('tienda');
$c5['pausado_hasta'] = time() + 3600;
caso('archivada o en pausa → no se vigila', !wabot_comercial_bot_tiene($c4, $cfg) && !wabot_comercial_bot_tiene($c5, $cfg));
$telLive = '5491100009011TEST';
$cl = cv($telLive);
wabot_conv_transcript($cl, 'cliente', 'Hola! Quiero mas información');
wabot_conv_transcript($cl, 'bot', trim((string)$cfg['bienvenida']));
wabot_conv_transcript($cl, 'cliente', 'Tengo una peluquería');
wabot_conv_save($cl);
$fila = wabot_lista_item($telLive);
caso('la fila de la lista dice si la tiene el bot (para no abrir cada charla en cada refresco)', !empty($fila['bot_tiene']) && array_key_exists('bot_salio', $fila) && $fila['bot_salio'] === null);
@unlink(wabot_conv_path($telLive));

foreach ((array)glob($tmp . '/uso/*') as $f) @unlink($f);
@rmdir($tmp . '/uso'); @rmdir($tmp);
todo_ok();
