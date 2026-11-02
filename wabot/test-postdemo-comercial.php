<?php
/**
 * wabot/test-postdemo-comercial.php — la etapa post-demo del flujo comercial
 * (Pablo, 1-nov-2026), sin red.
 *
 *   php wabot/test-postdemo-comercial.php
 *
 * Los casos salen de los chats del 4-oct al 1-nov (wabot/data/informe-chats-
 * postdemo-1nov.md, fuera de git): de 772 mensajes de clientes después de la
 * demo, el bot contestó 0. GPT Sol se simula (WABOT_TEST_OPENAI_HTTP): cada
 * caso carga la decisión que daría el modelo y mira qué hace el SISTEMA con
 * ella: los tres candados (formulario completo, Presentar, elegibilidad), la
 * casilla «Bot después de la demo», el modelo elegido, el link de pago de la
 * modalidad y los montos de ESA charla, los datos de transferencia, los
 * cambios, «ya pagué», las respuestas oficiales nuevas y lo que sigue yendo a
 * Pablo. Lo que NO prueba es que Sol interprete bien.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
$cfg['plantillas'] = wabot_textos_default()['plantillas'];
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;

$tmp = sys_get_temp_dir() . '/wabot-test-postdemo-comercial-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;

const LINK_MENSUAL_30 = 'Te dejo el link de Mercado Pago para activar el plan mensual de la web. En ese enlace podés ver todos los detalles del servicio. Una vez realizado el pago queda activo y avanzamos con las modificaciones y el desarrollo completo: gokywebs.com/pago/mensual30000';
const LINK_MENSUAL_20 = 'Te dejo el link de Mercado Pago para activar el plan mensual de la web. En ese enlace podés ver todos los detalles del servicio. Una vez realizado el pago queda activo y avanzamos con las modificaciones y el desarrollo completo: gokywebs.com/pago/mensual20000';
const PREGUNTA_MODELO = 'Cuál de los dos modelos te gustó más?';
const PAGO_AVISADO = 'Perfecto, revisamos el pago y te confirmamos por acá.';

/** Una decisión del modelo en la etapa post-demo, con lo que no se pasa en blanco. */
function dc(array $d = []) {
    $base = ['accion' => 'responder', 'solucion' => 'tienda', 'segunda_solucion' => 'ninguna', 'intencion' => 'ninguna', 'pago_unico' => false, 'internacional' => false,
             'mensajes' => [], 'info_claves' => [], 'motivo' => null,
             'modelo_elegido' => 'ninguno', 'quiere_avanzar' => false, 'pide_pago' => false, 'pide_transferencia' => false, 'pide_cambios' => false, 'avisa_pago' => false,
             'ficha' => ['nombre' => null, 'negocio' => null, 'rubro' => null, 'que_vende' => null, 'objetivo' => null, 'necesidad' => null, 'funciones' => [], 'observaciones' => null]];
    if (isset($d['ficha'])) $d['ficha'] = array_merge($base['ficha'], $d['ficha']);
    return array_merge($base, $d);
}

/** Carga lo que contesta la API, en orden; el revisor aprueba salvo que se le cargue otra cosa. */
function oa(array $cola, array $revisor = []) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['OA_REVISOR'] = $revisor;
    $GLOBALS['OA_REVISIONES'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        $tarea = (string)($payload['prompt_cache_key'] ?? '');
        $ok = function ($datos) {
            return [200, json_encode(['id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
                'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($datos, JSON_UNESCAPED_UNICODE)]]]],
                'usage' => ['input_tokens' => 4000, 'input_tokens_details' => ['cached_tokens' => 3000], 'output_tokens' => 120, 'total_tokens' => 4120]], JSON_UNESCAPED_UNICODE)];
        };
        if (str_ends_with($tarea, 'comercial_revisor_sombra')) return $ok(['ok' => true, 'problemas' => [], 'falta_contestar' => []]);
        if (str_ends_with($tarea, 'comercial_revisor') || str_ends_with($tarea, 'comercial_revisor_postdemo')) {
            $GLOBALS['OA_REVISIONES'][] = $payload;
            return $ok(array_shift($GLOBALS['OA_REVISOR']) ?? ['ok' => true, 'problemas' => [], 'falta_contestar' => []]);
        }
        if (str_ends_with($tarea, 'bienvenida_rubro')) return $ok(['ya_dice_rubro' => true]);
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) return [0, ''];
        return $ok($sig);
    };
}
function pedidos() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }
function tarea_pedida($i = 0) { return (string)(pedidos()[$i]['prompt_cache_key'] ?? ''); }
function contexto_pedido($i = 0) { return (string)(pedidos()[$i]['input'][0]['content'] ?? ''); }
function tiene($r, $frase) { foreach ((array)$r as $m) if (mb_strpos((string)$m, $frase) !== false) return true; return false; }

/**
 * Una charla que ya pasó por todo el flujo: cotizada, con la demo ofrecida, el
 * formulario mandado y completado, y (si $presentada) la demo entregada por el
 * botón Presentar con «Bot después de la demo» prendido.
 */
function cv_demo($tipo = 'ecommerce', array $extra = [], $presentada = true) {
    global $cfg;
    static $n = 0;
    $n++;
    $tel = '54911000091' . str_pad((string)$n, 2, '0', STR_PAD_LEFT) . 'TEST';
    $panel = $tipo !== 'landing';
    $cot = $panel
        ? ['origen' => 'bot', 'plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000', 'ts' => time() - 7200]
        : ['origen' => 'bot', 'plan' => 'informativa', 'anual' => '$140.000', 'mensual' => '$20.000', 'unico' => '$240.000', 'ts' => time() - 7200];
    $c = conv_nueva($tel, array_merge([
        'nombre' => 'Marta', 'nombre_confirmado' => true, 'nombre_negocio' => 'Zapas Marta', 'tipo' => $tipo,
        'precio_dado' => true, 'comercial_cotizacion' => $cot, 'comercial_solucion' => $panel ? 'tienda' : 'informativa',
        'precio_cotizado' => $cot['anual'], 'mensualidad_cotizada' => $cot['mensual'], 'precio_unico_cotizado' => $cot['unico'],
        'sena_cotizada' => '$60.000', 'precio_modelo' => 'anual', 'precio_cotizado_ts' => time() - 7200,
        'comercial_oferta_ts' => time() - 7000, 'cta_muestra' => true, 'saludo_devuelto' => true,
        'link_form_enviado' => true, 'form_link_mandado_ts' => time() - 6900, 'comercial_pausa' => 'formulario', 'comercial_pausa_ts' => time() - 6900,
        'form_completado_ts' => time() - 6000, 'lead_creado' => true, 'lead_doc' => 'projects/x/databases/(default)/documents/propuestas/abc',
        'fase' => 'derivado', 'cierre' => 'prediseno', 'descripcion' => 'Vendo zapatillas', 'colores' => 'rojo',
        // La forma de pago del formulario (obligatoria hasta el 2-nov). Sin ella, la sección 12.
        'modalidad_elegida' => 'mensual',
    ], $extra));
    wabot_conv_transcript($c, 'cliente', 'Hola! Vendo zapatillas');
    wabot_conv_transcript($c, 'bot', 'Perfecto, te podemos armar una tienda online para que vendas las zapatillas directo desde la web');
    wabot_conv_transcript($c, 'bot', "Tenemos distintas modalidades de pago para que elijas la que mejor se adapte a vos.\n\n1) Pago único: {$cot['unico']}\nLa web queda 100% tuya. Incluye el primer año de hosting y dominio.\n\nPor suscripción, con dos opciones:\n2) Plan anual: {$cot['anual']}\n3) Plan mensual: {$cot['mensual']}");
    wabot_conv_transcript($c, 'bot', (string)$cfg['comercial']['oferta_demo']);
    wabot_conv_transcript($c, 'cliente', 'Dale');
    wabot_conv_transcript($c, 'bot', 'Para hacer la demo, solo tendrías que llenar este formulario, toma 2 minutos: https://gokywebs.com/form/?c=AB');
    wabot_conv_transcript($c, 'sistema', '[Formulario web] Nombre: Marta · Negocio: Zapas Marta · Resumen: Vendo zapatillas · Colores: rojo');
    if ($presentada) {
        wabot_conv_preparar_postdemo($c, $cfg);
        $c['presentado_ts'] = time() - 3600;
        $c['presentado_slug'] = 'zapasmarta';
        $c['presentado_confirmado'] = false;
        $c['presentado_via_bot'] = true;
        $c['cliente_id'] = 'ficha123';
        wabot_conv_transcript($c, 'bot', 'Acá tenés la demo de tu tienda: https://gokywebs.com/demo/zapasmarta');
        wabot_conv_transcript($c, 'bot', 'Hay dos modelos para elegir. Contame qué te pareció');
    }
    return $c;
}

echo "— 1. La casilla y lo que cambia en el prompt —\n";
caso('«Bot después de la demo» arranca apagada de fábrica', (wabot_textos_default()['bot_postdemo_activo'] ?? null) === false);
caso('es un ajuste del panel', in_array('bot_postdemo_activo', wabot_ajustes_claves(), true));
caso('los tests la prenden con WABOT_TEST_BOT_POSTDEMO', wabot_postdemo_bot_activo(['bot_postdemo_activo' => false]) === true);
unset($GLOBALS['WABOT_TEST_BOT_POSTDEMO']);
$flujoTest = $GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] ?? null; unset($GLOBALS['WABOT_TEST_FLUJO_COMERCIAL']);
caso('y sin el gancho manda la config (prendido y con el flujo comercial en Automático)', wabot_postdemo_bot_activo(['bot_postdemo_activo' => true, 'flujo_comercial' => 'auto']) === true
    && wabot_postdemo_bot_activo(['bot_postdemo_activo' => true, 'flujo_comercial' => 'off']) === false && wabot_postdemo_bot_activo(['bot_postdemo_activo' => false, 'flujo_comercial' => 'auto']) === false);
if ($flujoTest !== null) $GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = $flujoTest;
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
$insPre = wabot_comercial_instrucciones($cfg);
$insPost = wabot_comercial_instrucciones($cfg, true);
caso('antes de la demo el prompt es el de siempre: sin el bloque post-demo ni sus respuestas', strpos($insPre, 'DESPUÉS DE LA DEMO') === false && strpos($insPre, '- google_difusion:') === false
    && strpos($insPre, '- cambios_demo:') === false && mb_strlen($insPre) < 55000, (string)mb_strlen($insPre));
caso('después de la demo el prompt trae el bloque y las respuestas nuevas', strpos($insPost, 'DESPUÉS DE LA DEMO') !== false && strpos($insPost, '- google_difusion:') !== false
    && strpos($insPost, '- dejo_de_pagar:') !== false && strpos($insPost, '- material_web:') !== false);
foreach (['modelo_elegido', 'quiere_avanzar', 'pide_pago', 'pide_transferencia', 'pide_cambios', 'avisa_pago', 'lo veo y te aviso', 'comprobante'] as $p) {
    caso("el bloque post-demo habla de «{$p}»", mb_stripos($insPost, $p) !== false);
}
caso('las claves nuevas solo entran al esquema post-demo', !in_array('google_difusion', wabot_comercial_info_claves($cfg), true) && in_array('google_difusion', wabot_comercial_info_claves($cfg, true), true)
    && count(wabot_comercial_info_claves($cfg, true)) === count(wabot_comercial_info_claves($cfg)) + count(wabot_comercial_info_claves_postdemo()));
caso('el esquema post-demo es otro, con sus campos; el de antes no cambia', (wabot_comercial_esquema($cfg)['name'] ?? '') === 'turno_comercial_v3'
    && (wabot_comercial_esquema($cfg, true)['name'] ?? '') === 'turno_postdemo_v1'
    && in_array('avisa_pago', wabot_comercial_esquema($cfg, true)['schema']['required'], true) && !in_array('avisa_pago', wabot_comercial_esquema($cfg)['schema']['required'], true));
$rev = wabot_comercial_instrucciones_revisor_completas($cfg, true);
caso('el revisor post-demo sabe que el link de pago y la pregunta del modelo son bloques de Pablo', strpos($rev, 'Link de pago') !== false && strpos($rev, 'Pregunta del modelo') !== false
    && strpos(wabot_comercial_instrucciones_revisor_completas($cfg), 'Link de pago') === false);
foreach (wabot_comercial_info_claves_postdemo() as $k) caso("la respuesta oficial «{$k}» existe y es corta (≤ 300)", trim((string)($cfg['info'][$k] ?? '')) !== '' && mb_strlen($cfg['info'][$k]) <= 300, (string)mb_strlen((string)($cfg['info'][$k] ?? '')));
caso('los textos fijos del post-demo están, con sus marcadores', strpos((string)$cfg['comercial']['postdemo']['link_mensual'], '{link}') !== false
    && strpos((string)$cfg['comercial']['postdemo']['link_anual'], '{sena}') !== false && strpos((string)$cfg['comercial']['postdemo']['link_anual'], '{saldo}') !== false
    && strpos((string)$cfg['comercial']['postdemo']['modelo_elegido'], '{modelo}') !== false
    && strpos((string)$cfg['comercial']['postdemo']['transferencia_cbu'], 'Alias: pablotravi') !== false && strpos((string)$cfg['comercial']['postdemo']['transferencia_cbu'], 'CVU: 0000003100053462800156') !== false);
caso('la seña del pago único es la de sus páginas (unico240 → $80.000, unico330 → $100.000)', ($cfg['tipos']['landing']['sena_unico'] ?? '') === '$80.000' && ($cfg['tipos']['ecommerce']['sena_unico'] ?? '') === '$100.000');

echo "— 2. Los tres candados —\n";
// 1) El formulario completo: con la casilla apagada apaga el bot (10-oct); prendida, no.
foreach ([false => 'apagada', true => 'prendida'] as $prendida => $nombre) {
    $GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = (bool)$prendida;
    $tel = $prendida ? '5491100009231' : '5491100009230';
    @unlink(wabot_conv_path($tel));
    $r = wabot_form_lead_procesar(['t' => $tel, 'nombre' => 'Marta', 'nombre_negocio' => 'Zapas Marta', 'resumen' => 'Vendo zapatillas', 'colores' => 'rojo'], $cfg);
    $cv = wabot_conv_load($tel);
    caso("formulario completo con la casilla {$nombre}: " . ($prendida ? 'el bot sigue' : 'el bot se apaga en el chat'), !empty($r['ok']) && (int)($cv['form_completado_ts'] ?? 0) > 0
        && (bool)($cv['bot_off'] ?? false) === !$prendida && !empty($cv['handoff_pendiente']), json_encode([$r, $cv['bot_off'] ?? null], JSON_UNESCAPED_UNICODE));
    @unlink(wabot_conv_path($tel));
}
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
// 2) Presentar: con la casilla apagada toma el control; prendida, deja la charla como estaba.
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = false;
$cOff = cv_demo('ecommerce');
caso('Presentar con la casilla apagada toma el control (como siempre)', !empty($cOff['control_manual']) && !empty($cOff['bot_off']) && ($cOff['fase'] ?? '') === 'postdemo');
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
$c = cv_demo('ecommerce');
caso('Presentar con la casilla prendida no toma el control y deja la etapa post-demo', empty($c['control_manual']) && empty($c['bot_off']) && ($c['fase'] ?? '') === 'postdemo' && empty($c['seguimiento_bloqueado']));
$cPablo = cv_demo('ecommerce', ['control_manual' => true]);
caso('si Pablo ya la tenía, Presentar se la deja a él', !empty($cPablo['control_manual']));
// 3) La elegibilidad.
caso('con la demo entregada el estado es postdemo', wabot_comercial_estado($c) === 'postdemo' && wabot_comercial_estado(cv_demo('ecommerce', [], false)) === 'formulario');
caso('elegible en post-demo (sin control manual, sin pago)', wabot_comercial_elegible($c, $cfg, 'auto') === [true, '']);
caso('cliente_id (la ficha del admin desde la que salió la demo) no frena', !empty($c['cliente_id']));
caso('con pago_confirmado_ts (lo setea el onboarding de la otra sesión) el post-demo terminó', wabot_comercial_elegible(array_merge($c, ['pago_confirmado_ts' => time()]), $cfg, 'auto')[0] === false);
caso('con pago_avisado_ts lo verifica Pablo', wabot_comercial_elegible(array_merge($c, ['pago_avisado_ts' => time()]), $cfg, 'auto')[0] === false);
caso('si Pablo escribió (control manual) o apagó el bot, el bot no se mete', wabot_comercial_elegible(array_merge($c, ['control_manual' => true]), $cfg, 'auto')[0] === false
    && wabot_comercial_elegible(array_merge($c, ['bot_off' => true]), $cfg, 'auto')[0] === false);
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = false;
caso('con la casilla apagada no es elegible: «Demo presentada: lo sigue Pablo»', wabot_comercial_elegible($c, $cfg, 'auto') === [false, 'Demo presentada: lo sigue Pablo']);
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
// La plantilla de la demo (72 h) no le saca la charla al bot post-demo.
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$c72 = cv_demo('ecommerce');
caso('la plantilla de la demo sale y con la casilla prendida no toma el control', wabot_template_72h_enviar($c72, $cfg) === 'ok' && empty($c72['control_manual']) && empty($c72['bot_off'])
    && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1 && !empty($c72['confirmacion_demo_enviada']));
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = false;
$c72off = cv_demo('ecommerce');
$c72off['control_manual'] = false; $c72off['bot_off'] = false;
caso('con la casilla apagada la plantilla toma el control, como siempre', wabot_template_72h_enviar($c72off, $cfg) === 'ok' && !empty($c72off['control_manual']));
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];

echo "— 3. Entre el formulario completo y la demo: lo simple se contesta —\n";
$c = cv_demo('ecommerce', [], false);
caso('con el formulario completo y la casilla prendida puede contestar lo simple', wabot_comercial_post_form_permitido($c, $cfg) === true);
oa([dc(['accion' => 'responder', 'info_claves' => ['plazos']])]);
$r = turno('Y cuánto tarda?', $c, $cfg);
// Entre el formulario y la demo, "plazos" es cuándo llega LA DEMO (wabot_texto_plazos, caso Lara del 28-ago), no los 7 días de la web.
caso('«Y cuánto tarda?» → cuándo le llega la demo, y la charla sigue sin control manual', count($r) === 1 && strpos($r[0], 'la demo te llega') !== false && empty($c['control_manual']) && empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('el modelo sabe que ya completó el formulario y cuándo llega la demo', strpos(contexto_pedido(), 'Ya completó el formulario de la demo') !== false && strpos(contexto_pedido(), 'la demo se la mandamos nosotros por acá') !== false);
caso('y sigue con el prompt de antes de la demo (sin el bloque post-demo)', str_ends_with(tarea_pedida(), '-comercial') && strpos((string)pedidos()[0]['instructions'], 'DESPUÉS DE LA DEMO') === false);
oa([dc(['accion' => 'esperar'])]);
$r = turno('Dale, gracias', $c, $cfg);
caso('un «dale, gracias» → esperar', $r === [] && empty($c['handoff_pendiente']));
oa([dc(['accion' => 'humano', 'motivo' => 'Pide una llamada'])]);
$r = turno('Me pueden llamar? Prefiero hablarlo por teléfono', $c, $cfg);
caso('lo que no es simple sigue yendo a Pablo en silencio, sin tomar el control', $r === [] && !empty($c['handoff_pendiente']) && empty($c['control_manual']) && (int)($c['form_duda_pablo_ts'] ?? 0) > 0);
caso('la confirmación de los 5 minutos sigue igual (no la frena la casilla)', (int)($cfg['form_confirmacion_minutos'] ?? 0) === 5 && !empty($cfg['form_confirmacion_activo']));
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = false;
$cOff = cv_demo('ecommerce', [], false);
oa([dc(['accion' => 'responder', 'info_claves' => ['plazos']])]);
$r = turno('Y cuánto tarda?', $cOff, $cfg);
caso('con la casilla apagada, con el formulario completo el bot sigue callado (10-oct)', $r === [] && count(pedidos()) === 0 && !empty($cOff['handoff_pendiente']));
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;

echo "— 4. Elige modelo, le gustó, quiere avanzar: el link de pago como lo manda Pablo —\n";
$c = cv_demo('ecommerce');
oa([dc(['modelo_elegido' => '2', 'quiere_avanzar' => true, 'mensajes' => ['Buenísimo! Me alegra que te haya gustado']])]);
$r = turno("Hola me encanto el modelo 2\nNo se nada de esto pero lo veo mas completo al modelo 2", $c, $cfg);
caso('«me encantó el modelo 2» → «Perfecto, tomamos el modelo 2», lo del modelo y el link mensual de la tienda', $r === ['Perfecto, tomamos el modelo 2', 'Buenísimo! Me alegra que te haya gustado', LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('queda el modelo elegido y el link mandado', ($c['modelo_elegido'] ?? '') === '2' && (int)($c['postdemo_link_pago_ts'] ?? 0) > 0 && ($c['postdemo_link_pago'] ?? '') === 'mensual' && empty($c['handoff_pendiente']));
caso('la llamada fue con la clave de caché y el esquema post-demo', str_ends_with(tarea_pedida(), 'comercial_postdemo') && (pedidos()[0]['text']['format']['name'] ?? '') === 'turno_postdemo_v1'
    && strpos((string)pedidos()[0]['instructions'], 'DESPUÉS DE LA DEMO') !== false);
caso('el modelo vio la demo, el link y que no eligió modelo', strpos(contexto_pedido(), 'YA LE MANDAMOS LA DEMO (gokywebs.com/demo/zapasmarta)') !== false && strpos(contexto_pedido(), 'Todavía no dijo cuál de los dos modelos') !== false);
oa([dc(['accion' => 'esperar'])]);
$r = turno('Perfecto, gracias!', $c, $cfg);
caso('un acuse después del link no gasta una llamada: esperar', $r === [] && count(pedidos()) === 0 && empty($c['handoff_pendiente']));
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Genial']])]);
$r = turno('Ya vi todo, genial, quiero avanzar', $c, $cfg);
caso('el link no se repite si ya se lo mandamos', $r === ['Genial'] && strpos(contexto_pedido(), 'Ya le mandamos el link de pago (mensual)') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['pide_pago' => true, 'mensajes' => []])]);
$r = turno('Pasame el link de nuevo porfa', $c, $cfg);
caso('salvo que lo pida de nuevo', $r === [LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_demo('ecommerce');
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Me alegro!']])]);
$r = turno('Me gustó mucho, quedó linda', $c, $cfg);
caso('le gustó sin elegir modelo → se le pregunta cuál (Pablo: «Cuál de los dos modelos te gustó más?»)', $r === ['Me alegro!', PREGUNTA_MODELO] && (int)($c['postdemo_pregunto_modelo_ts'] ?? 0) > 0, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'esperar'])]);
$r = turno('El 1', $c, $cfg);
caso('«El 1» aunque el modelo quiera esperar → «Perfecto, tomamos el modelo 1» y el link', $r === ['Perfecto, tomamos el modelo 1', LINK_MENSUAL_30] && ($c['modelo_elegido'] ?? '') === '1', json_encode($r, JSON_UNESCAPED_UNICODE));
caso('el modelo lo supo (se lo preguntamos, no repetir)', strpos(contexto_pedido(), 'ya se lo preguntamos') !== false);
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Dale']])]);
$cYa = cv_demo('ecommerce', ['postdemo_pregunto_modelo_ts' => time() - 600]);
$r = turno('Están geniales los dos, decime como seguimos', $cYa, $cfg);
caso('si ya le preguntamos el modelo y quiere avanzar igual, va el link sin insistir', $r === ['Dale', LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));

$c = cv_demo('landing');
oa([dc(['solucion' => 'informativa', 'modelo_elegido' => '1', 'quiere_avanzar' => true, 'pide_pago' => true, 'mensajes' => ['Hola! Me alegra que te haya gustado']])]);
$r = turno('Hola, cómo estás? Me gustó la opción 1. Me podrías comentar cómo seguimos', $c, $cfg);
// Ya lo saludamos en la charla (saludo_devuelto): el "Hola!" del modelo se saca, como siempre.
caso('sitio profesional: «me gustó la opción 1, cómo seguimos» → modelo 1 y el link mensual20000', $r === ['Perfecto, tomamos el modelo 1', 'Me alegra que te haya gustado', LINK_MENSUAL_20], json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 5. Elige plan, pide pagar, no quiere Mercado Pago —\n";
$c = cv_demo('ecommerce');
oa([dc(['mensajes' => ['Genial']])]);
$r = turno('Hola, elegiría plan mensual', $c, $cfg);
caso('«elegiría plan mensual» → se anota la modalidad, se pregunta el modelo y va el link mensual', $r === ['Genial', PREGUNTA_MODELO, LINK_MENSUAL_30] && ($c['modalidad_elegida'] ?? '') === 'mensual', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '1']);
oa([dc(['mensajes' => []])]);
$r = turno('plan anual', $c, $cfg);
caso('«plan anual» → el plan anual con la seña y el resto, como Pablo', $r === ['Te paso el plan anual con todas las condiciones y los datos para la transferencia. Para arrancar con todas las modificaciones son $60.000 y el resto ($150.000) se paga al finalizar la web, que no demora más de 7 días: gokywebs.com/pago/anual210']
    && ($c['modalidad_elegida'] ?? '') === 'unico', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '2']);
oa([dc(['mensajes' => []])]);
$r = turno('Me quedo con el pago único', $c, $cfg);
caso('«me quedo con el pago único» → el pago único con su seña ($100.000) y el resto', $r === ['Te paso el pago único con todas las condiciones y los datos para la transferencia. Para arrancar con todas las modificaciones son $100.000 y el resto ($230.000) se paga al finalizar la web, que no demora más de 7 días: gokywebs.com/pago/unico330'], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('landing', ['modelo_elegido' => '1']);
oa([dc(['solucion' => 'informativa', 'mensajes' => []])]);
$r = turno('Vamos con el pago único', $c, $cfg);
caso('sitio profesional: pago único → seña $80.000 y resto $160.000 en unico240', $r === ['Te paso el pago único con todas las condiciones y los datos para la transferencia. Para arrancar con todas las modificaciones son $80.000 y el resto ($160.000) se paga al finalizar la web, que no demora más de 7 días: gokywebs.com/pago/unico240'], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '1']);
oa([dc(['accion' => 'humano', 'motivo' => 'Quiere pagar: pide el link'])]);
$r = turno('Cómo te pago? Pasame el link', $c, $cfg);
caso('«cómo te pago? pasame el link» aunque el modelo lo derive (antes de la demo era para Pablo) → el link, sin control manual', $r === [LINK_MENSUAL_30] && empty($c['control_manual']) && in_array('postdemo_no_humano', (array)($c['comercial_ultimo']['ajustes'] ?? []), true), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '1']);
oa([dc(['pide_transferencia' => true, 'mensajes' => ['Sí, no hay problema']])]);
$r = turno('No tengo Mercado Pago, puedo hacer transferencia?', $c, $cfg);
caso('no quiere Mercado Pago → los datos de transferencia tal cual Pablo (alias pablotravi, CVU)', $r === ['Sí, no hay problema', (string)$cfg['comercial']['postdemo']['transferencia_cbu']] && (int)($c['postdemo_transferencia_ts'] ?? 0) > 0, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['mensajes' => ['Sí, es ese']])]);
$r = turno('El alias es pablotravi?', $c, $cfg);
caso('los datos no se repiten si ya se los pasamos', $r === ['Sí, es ese'], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['mensajes' => ['Sí, podés poner transferencia, efectivo y Mercado Pago'], 'info_claves' => ['medios_pago_tienda']])]);
$r = turno('Mis clientes pueden pagar por transferencia en la tienda?', $c, $cfg);
caso('hablar de cómo le pagan SUS clientes no es pedir nuestros datos', !tiene($r, 'pablotravi') && count($r) === 2, json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 6. «Ya pagué», el comprobante: lo confirma y le avisa a Pablo —\n";
foreach (["Listo ya estoy suscripto\nNecesito que podamos avanzar con las modificaciones", 'Pago realizado te dejo el número de operación 183983287677',
          "[foto] (Captura de pantalla de un comprobante de transferencia de Mercado Pago por \$30.000 a Pablo Travi)", 'Listo, ya te transferí la seña'] as $t) {
    $c = cv_demo('ecommerce', ['modelo_elegido' => '1']);
    oa([dc(['mensajes' => ['no'], 'avisa_pago' => false])]);
    $r = turno($t, $c, $cfg);
    caso('«' . mb_substr(str_replace("\n", ' / ', $t), 0, 60) . '» → «Perfecto, revisamos el pago…» sin gastar una llamada, y queda para Pablo', $r === [PAGO_AVISADO] && count(pedidos()) === 0
        && (int)($c['pago_avisado_ts'] ?? 0) > 0 && !empty($c['handoff_pendiente']) && empty($c['control_manual']) && wabot_conv_grupo($c) === 'pago', json_encode($r, JSON_UNESCAPED_UNICODE));
}
oa([dc(['mensajes' => ['Hola!']])]);
$r = turno('Hola? Vieron el pago?', $c, $cfg);
caso('después de avisar que pagó, el bot ya no se mete: lo sigue Pablo', $r === [] && count(pedidos()) === 0 && !empty($c['handoff_pendiente']) && wabot_comercial_elegible($c, $cfg, 'auto')[1] === 'Avisó que pagó: lo verifica Pablo');
$c = cv_demo('ecommerce', ['modelo_elegido' => '1']);
oa([dc(['avisa_pago' => true, 'mensajes' => []])]);
$r = turno('Ahí te mandé lo de la suscripción, fijate', $c, $cfg);
caso('si lo ve el modelo y no las reglas, lo mismo', $r === [PAGO_AVISADO] && (int)($c['pago_avisado_ts'] ?? 0) > 0 && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('el aviso a Pablo es el de siempre (push.php lo marca «avisó que pagó» por la columna Pago)', wabot_push_urgencia($c) === 'avisó que pagó');
$c = cv_demo('ecommerce');
oa([dc(['mensajes' => ['Dale, cuando cobres escribime y avanzamos'], 'intencion' => 'posterga'])]);
$r = turno('cuando cobre te pago', $c, $cfg);
caso('«cuando cobre te pago» no es haber pagado', $r === ['Dale, cuando cobres escribime y avanzamos'] && empty($c['pago_avisado_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 7. Cambios a la demo, «lo veo y te aviso», rechazo —\n";
$c = cv_demo('ecommerce');
oa([dc(['modelo_elegido' => '1', 'quiere_avanzar' => true, 'mensajes' => ['Sí, el color lo cambiamos sin problema']])]);
$r = turno("Perfecto el tema del color de la página se puede cambiar no.?\nMe gustó el modelo 1", $c, $cfg);
caso('pide un cambio y elige modelo → se toma el modelo, la respuesta de los cambios (Pablo), lo del modelo y el link', $r === ['Perfecto, tomamos el modelo 1', $cfg['info']['cambios_demo'], 'Sí, el color lo cambiamos sin problema', LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y el cambio queda anotado en la ficha', strpos((string)($c['cambios_pedidos'] ?? ''), 'color de la página') !== false && in_array('postdemo_cambios', (array)($c['comercial_ultimo']['ajustes'] ?? []), true));
oa([dc(['pide_cambios' => true, 'mensajes' => ['Sí, el logo lo cambiamos']])]);
$r = turno('Otra pregunta me podés cambiar el diseño del logo?', $c, $cfg);
caso('otro cambio: la respuesta oficial no se repite, queda lo del modelo, y se anota', $r === ['Sí, el logo lo cambiamos'] && strpos((string)$c['cambios_pedidos'], 'logo') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['quiere_avanzar' => true, 'intencion' => 'posterga', 'mensajes' => ['Dale, no hay problema']])]);
$r = turno('Recién vuelvo a mi casa, muchas gracias, en una horita aprox lo estoy mirando', $c, $cfg);
caso('«lo estoy mirando» → respuesta corta, sin link aunque el modelo marque avanzar', $r === ['Dale, no hay problema'] && empty($c['postdemo_link_pago_ts']) && in_array('postdemo_posterga', (array)($c['comercial_ultimo']['ajustes'] ?? []), true), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['intencion' => 'posterga', 'mensajes' => ['Dale, quedo atento']])]);
$r = turno('La veo tranquilo y te aviso el lunes', $c, $cfg);
caso('«te aviso el lunes» → respuesta corta y la fecha queda anotada (retomar_ts frena los avisos)', $r === ['Dale, quedo atento'] && (int)($c['retomar_ts'] ?? 0) > time(), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'esperar', 'intencion' => 'rechaza'])]);
$r = turno('Te agradezco, pero no es lo que busco. Gracias', $c, $cfg);
caso('«no es lo que busco» → silencio y la charla cerrada por rechazo', $r === [] && ($c['comercial_pausa'] ?? '') === 'rechazo', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'esperar'])]);
$r = turno('Perfecto muchas gracias por la info', $c, $cfg);
caso('«Perfecto muchas gracias por la info» → nada, sin llamada ni pendiente', $r === [] && count(pedidos()) === 0 && empty($c['handoff_pendiente']));

echo "— 8. Las dudas de después de la demo: respuestas oficiales nuevas, con rastro —\n";
$c = cv_demo('ecommerce');
oa([dc(['info_claves' => ['google_difusion']])]);
$r = turno('Dale !! Esto figura solo en Google o también e instagram face y otros ? O como seria ?', $c, $cfg);
caso('Google / redes → google_difusion', $r === [$cfg['info']['google_difusion']], json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['info_claves' => ['dominio_com_ar']])]);
$r = turno('Qué diferencia hay entre .com y .com.ar? Cuál me conviene', $c, $cfg);
caso('.com vs .com.ar → dominio_com_ar', $r === [$cfg['info']['dominio_com_ar']], json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['info_claves' => ['dejo_de_pagar']])]);
$r = turno('Y si el pago mensual es indefinidamente o una determinada cantidad de meses', $c, $cfg);
caso('«indefinidamente o una cantidad de meses» → dejo_de_pagar (15 días de espera, renovación fija, 18 meses)', $r === [$cfg['info']['dejo_de_pagar']] && strpos($r[0], '15 días') !== false && strpos($r[0], 'mes de gracia') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['info_claves' => ['comisiones_mp']])]);
$r = turno('La comisión eso después la configuro desde mercado?', $c, $cfg);
caso('comisión de Mercado Pago → comisiones_mp', $r === [$cfg['info']['comisiones_mp']], json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['info_claves' => ['tiempo_entrega']])]);
$r = turno('Cuánto tarda más o menos en hacer la página???', $c, $cfg);
caso('cuánto tarda → tiempo_entrega', $r === [$cfg['info']['tiempo_entrega']], json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['info_claves' => ['material_web']])]);
$r = turno('Okey. Por donde tengo q pasar las fotos o como seria esa parte de pasarte la info?', $c, $cfg);
caso('por dónde paso las fotos → material_web', $r === [$cfg['info']['material_web']], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '1', 'postdemo_link_pago_ts' => time() - 100]);
oa([dc(['info_claves' => ['dejo_de_pagar'], 'mensajes' => ['Buenísimo']])]);
$r = turno('Buenísimo, me gustó', $c, $cfg);
caso('una respuesta oficial sin rastro en lo que dijo se descarta (sin_rastro)', $r === ['Buenísimo'] && in_array('sin_rastro', (array)($c['comercial_ultimo']['ajustes'] ?? []), true), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda'])]);
$r = turno('cuánto era el mensual?', $c, $cfg);
caso('vuelve a pedir el precio → los mismos planes, sin volver a ofrecer la demo', count($r) === 1 && strpos($r[0], '$30.000') !== false && strpos($r[0], '$210.000') !== false && !tiene($r, 'demo gratis'), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'formulario', 'intencion' => 'acepta', 'mensajes' => ['Dale']])]);
$r = turno('Dale, quiero la web', $c, $cfg);
caso('el formulario nunca vuelve a salir después de la demo', !tiene($r, 'gokywebs.com/form') && !tiene($r, 'demo gratis'), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 9. Lo que sigue yendo a Pablo —\n";
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'humano', 'motivo' => 'Pide el nombre de quien escribe'])]);
$r = turno('Hola buenas tardes!! Nombre del que me está escribiendo!!', $c, $cfg);
caso('pide el nombre → humano: silencio y pendiente para Pablo, sin tomar el control (1-nov: "solo calla en esa")', $r === [] && empty($c['control_manual']) && !empty($c['handoff_pendiente']) && ($c['comercial_pausa'] ?? '') === 'humano' && wabot_comercial_estado($c) === 'humano');
oa([dc(['mensajes' => ['no']])]);
$r = turno('Hola?', $c, $cfg);
caso('si vuelve a escribir y Pablo no contestó, el flujo sigue (la pausa era solo para esa pregunta)', count(pedidos()) === 1 && empty($c['comercial_pausa']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce');
oa([dc(['accion' => 'humano', 'motivo' => 'Pide una llamada'])]);
$r = turno('Podemos hablar por teléfono? Me decís tu nombre y apellido, de dónde sos?', $c, $cfg);
caso('pide una llamada → humano: silencio, pendiente, sin control', $r === [] && empty($c['control_manual']) && !empty($c['handoff_pendiente']));
// Sin página de pago/ que cobre sus montos, el link lo manda Pablo.
$c = cv_demo('ecommerce', ['modelo_elegido' => '1', 'comercial_cotizacion' => ['origen' => 'chat', 'plan' => 'panel', 'anual' => '$250.000', 'mensual' => '$25.000', 'unico' => '$360.000', 'ts' => time() - 7200],
                           'mensualidad_cotizada' => '$25.000', 'precio_cotizado' => '$250.000', 'precio_unico_cotizado' => '$360.000']);
oa([dc(['pide_pago' => true, 'mensajes' => []])]);
$r = turno('Pasame el link de pago', $c, $cfg);
caso('pide el link y ningún pago/ cobra $25.000 → humano, en silencio, con el motivo', $r === [] && empty($c['control_manual']) && !empty($c['handoff_pendiente']) && strpos((string)($c['comercial_motivo'] ?? ''), 'no hay página en pago/') !== false);
$c = cv_demo('ecommerce', ['modelo_elegido' => '1', 'comercial_cotizacion' => ['origen' => 'chat', 'plan' => 'panel', 'anual' => '$250.000', 'mensual' => '$25.000', 'unico' => '$360.000', 'ts' => time() - 7200],
                           'mensualidad_cotizada' => '$25.000', 'precio_cotizado' => '$250.000', 'precio_unico_cotizado' => '$360.000']);
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Me alegro!']])]);
$r = turno('Me encantó, está buenísima', $c, $cfg);
caso('le gustó y no hay link para sus montos → sale lo del modelo y queda pendiente para Pablo', $r === ['Me alegro!'] && !empty($c['handoff_pendiente']) && empty($c['control_manual']), json_encode($r, JSON_UNESCAPED_UNICODE));
// Cotizaciones congeladas de antes: la página que cobra ESE monto.
$c = cv_demo('ecommerce', ['modelo_elegido' => '2', 'comercial_cotizacion' => ['origen' => 'bot', 'plan' => 'panel', 'anual' => '$190.000', 'mensual' => '$30.000', 'unico' => '$330.000', 'ts' => time() - 7200],
                           'precio_cotizado' => '$190.000']);
oa([dc(['mensajes' => []])]);
$r = turno('Dale, vamos con el plan anual', $c, $cfg);
caso('cotizada con el anual viejo ($190.000) → pago/anual190 con seña $60.000 y resto $130.000', $r === ['Te paso el plan anual con todas las condiciones y los datos para la transferencia. Para arrancar con todas las modificaciones son $60.000 y el resto ($130.000) se paga al finalizar la web, que no demora más de 7 días: gokywebs.com/pago/anual190'], json_encode($r, JSON_UNESCAPED_UNICODE));
// La prueba de precios (31-oct): B manda el pago inicial; en A no hay plan anual.
$c = cv_demo('ecommerce', ['modelo_elegido' => '1', 'ab_grupo' => 'b', 'comercial_cotizacion' => ['origen' => 'bot', 'plan' => 'panel', 'anual' => '', 'mensual' => '$30.000', 'unico' => '$330.000', 'inicial' => '$100.000', 'modelo' => 'b', 'ts' => time() - 7200],
                           'inicial_cotizado' => '$100.000', 'precio_cotizado' => '$100.000', 'precio_modelo' => 'inicial']);
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Buenísimo']])]);
$r = turno('Me gustó mucho, avancemos', $c, $cfg);
caso('grupo B: le gustó → el detalle del pago inicial (pago/inicial100)', $r === ['Buenísimo', 'Te paso el detalle con todas las condiciones y los datos para la transferencia del pago inicial: gokywebs.com/pago/inicial100'] && ($c['postdemo_link_pago'] ?? '') === 'inicial', json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modelo_elegido' => '1', 'ab_grupo' => 'a', 'comercial_cotizacion' => ['origen' => 'bot', 'plan' => 'panel', 'anual' => '', 'mensual' => '$30.000', 'unico' => '$330.000', 'modelo' => 'a', 'ts' => time() - 7200]]);
oa([dc(['mensajes' => ['Te cuento']])]);
$r = turno('plan anual', $c, $cfg);
caso('grupo A: «plan anual» no existe en su cotización → sin link (lo ve Pablo con lo del modelo)', $r === ['Te cuento'] && empty($c['postdemo_link_pago_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 10. Antes de la demo nada cambia —\n";
$c = conv_nueva('5491100009301TEST', ['nombre' => 'Marta']);
oa([dc(['accion' => 'cotizar', 'solucion' => 'tienda', 'mensajes' => ['Perfecto, te podemos armar una tienda online para tus zapatillas.'], 'ficha' => ['que_vende' => 'zapatillas']])]);
$r = turno('Hola! Vendo zapatillas', $c, $cfg);
caso('la cotización sigue saliendo en tres mensajes con el prompt y el esquema de siempre', count($r) === 3 && str_ends_with(tarea_pedida(), '-comercial') && (pedidos()[0]['text']['format']['name'] ?? '') === 'turno_comercial_v3'
    && strpos((string)pedidos()[0]['instructions'], 'DESPUÉS DE LA DEMO') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['accion' => 'humano', 'solucion' => 'tienda', 'motivo' => 'Quiere pagar ya'])]);
$r = turno('Dale, pasame el link que lo pago ya', $c, $cfg);
caso('antes de la demo, pedir el link sigue siendo para Pablo (en silencio, sin control)', $r === [] && empty($c['control_manual']) && !empty($c['handoff_pendiente']));

echo "— 11. De punta a punta por el webhook —\n";
$src = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($src, 'function wabot_conv_identidad_entrante');
$hasta = strpos($src, '/* ── Instagram: otro formato');
eval(substr($src, $desde, $hasta - $desde));
$tel = '5491100009399TEST';
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel));
$c = cv_demo('ecommerce');
foreach (['tel', 'channel_user_id', 'conversation_key'] as $k) $c[$k] = $tel;
wabot_conv_save($c);
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
oa([dc(['modelo_elegido' => '2', 'quiere_avanzar' => true, 'mensajes' => []])]);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pd.1'), 'canal' => 'whatsapp', 'texto' => 'El modelo 2', 'nombre' => 'Marta', 'media' => null], $cfg);
$cvd = wabot_conv_load($tel);
// Al mandar, los links salen con https:// (25-oct), por eso el texto enviado no es idéntico al bloque.
caso('el webhook manda «Perfecto, tomamos el modelo 2» y el link, y guarda la charla', count($GLOBALS['WABOT_TEST_ENVIADOS']) === 2 && str_ends_with((string)($GLOBALS['WABOT_TEST_ENVIADOS'][1][1] ?? ''), 'gokywebs.com/pago/mensual30000')
    && ($GLOBALS['WABOT_TEST_ENVIADOS'][0][1] ?? '') === 'Perfecto, tomamos el modelo 2'
    && ($cvd['modelo_elegido'] ?? '') === '2' && (int)($cvd['postdemo_link_pago_ts'] ?? 0) > 0 && !empty($cvd['presentado_confirmado']), json_encode($GLOBALS['WABOT_TEST_ENVIADOS'], JSON_UNESCAPED_UNICODE));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
oa([dc(['mensajes' => ['no']])]);
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('pd.2'), 'canal' => 'whatsapp', 'texto' => 'Listo, ya pagué. Te mando el comprobante', 'nombre' => 'Marta', 'media' => null], $cfg);
$cvd = wabot_conv_load($tel);
caso('«ya pagué» por el webhook → el acuse, la columna Pago y pendiente para Pablo', count($GLOBALS['WABOT_TEST_ENVIADOS']) === 1 && ($GLOBALS['WABOT_TEST_ENVIADOS'][0][1] ?? '') === PAGO_AVISADO
    && wabot_conv_grupo($cvd) === 'pago' && !empty($cvd['handoff_pendiente']) && count(pedidos()) === 0, json_encode($GLOBALS['WABOT_TEST_ENVIADOS'], JSON_UNESCAPED_UNICODE));
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel));

echo "Revisión del 1-nov (noche)\n";
foreach (['Cómo hago para que te pague?' => false, 'cuando te pague el viernes arrancamos?' => false, 'Me das comprobante?' => false,
          'me mandás factura cuando pague?' => false, 'Ya te pagué' => true, 'Listo, ya transferí' => true, 'Pago realizado, te dejo el número de operación' => true,
          '[foto] Mandó un comprobante de transferencia por $30.000' => true, 'ya pagué, te llegó?' => true,
          'Sí, ya te pagué' => true, 'Si, ya aboné' => true, 'Pagué, ¿te llegó?' => true, 'Te pasé el comprobante, ¿lo recibiste?' => true,
          'Transferencia realizada, ¿me confirmás?' => true, 'Pago realizado, ¿cuándo arrancan?' => true, 'Me suscribí, ¿qué sigue?' => true,
          'Número de operación 12345 ¿lo ves?' => true, 'Les dejo el comprobante, ¿está bien?' => true, 'Apenas cobré te pagué' => true, 'Cuando pude te pagué' => true,
          'No pagué todavía' => false, 'todavía no te transferí' => false, 'Aún no hice el pago' => false, 'todavía no me suscribí' => false,
          'Ya pagué el dominio, sirve?' => false, 'El comprobante te lo mando mañana' => false, 'no me llegó el comprobante de mercado pago' => false,
          'Listo transferido' => true, 'Te llegó la transferencia?' => true, 'Ya pagué, no tengo el comprobante a mano' => true, 'necesito el comprobante para mi contador' => false] as $m => $esperado) {
    caso("¿avisa que pagó? «{$m}» → " . ($esperado ? 'sí' : 'no'), wabot_comercial_postdemo_avisa_pago($m) === $esperado);
}
foreach (['Te pago el 1 de diciembre' => null, 'lo veo y el 2 te aviso' => null, 'Es la primera vez que hago una web' => null, 'quiero hacer el primer pago' => null,
          'me gustó el 1' => '1', 'me quedo con el 2' => '2', 'Modelo 1' => '1', 'la segunda' => '2', 'me gustó el 1 y quiero avanzar' => '1', 'la opción 2' => '2',
          'el 2 me gusta más' => '2', 'la 1 me encanta' => '1', 'el 2 lo quiero' => '2', 'me gusta el primer modelo' => '1', 'la primera vez que veo algo así' => null,
          'El 1 de una' => '1', 'me quedo con el 2 de una' => '2', 'Me encantó el 1, de verdad' => '1', 'el 2 del todo' => '2',
          'el 1 no me gusta' => null, 'el 2 está muy cargado' => null, 'pago el 1' => null, 'Pago el 1 y el resto el 15' => null,
          'la 1 de la tarde te llamo' => null, 'el 1 o el 2 de diciembre' => null, 'me gustó el 2, pago el 10' => '2'] as $m => $esperado) {
    caso("¿elige modelo? «{$m}» → " . var_export($esperado, true), wabot_comercial_postdemo_modelo($m) === $esperado, var_export(wabot_comercial_postdemo_modelo($m), true));
}
// La pausa «humano» se levanta con el mensaje nuevo aunque el transcript esté recortado a 80.
$cvPausa = ['comercial_pausa' => 'humano', 'comercial_pausa_ts' => 1000, 'comercial_pausa_n' => 81, 'comercial_pausa_cliente_ts' => 990, 'transcript' => []];
for ($i = 0; $i < 79; $i++) $cvPausa['transcript'][] = ['q' => $i % 2 ? 'bot' : 'cliente', 't' => 'x', 'ts' => 900 + $i];
$cvPausa['transcript'][] = ['q' => 'cliente', 't' => 'ya pude ver', 'ts' => 990];
caso('la pausa sigue mientras el cliente no volvió a escribir (charla de 80 renglones)', wabot_comercial_estado($cvPausa) === 'humano');
array_shift($cvPausa['transcript']);
$cvPausa['transcript'][] = ['q' => 'cliente', 't' => 'hola?', 'ts' => 1200];
caso('… y se levanta con su mensaje nuevo aunque el transcript se haya recortado a 80', wabot_comercial_estado($cvPausa) !== 'humano', wabot_comercial_estado($cvPausa));
$cvPausa['comercial_derivado'] = ['motivo' => 'Pregunta si se puede pagar en cuotas', 'ts' => time()];
foreach (['¿Puedo pagar la seña ahora?' => true, '¿El pago inicial incluye el dominio?' => false, 'Te adelanto que me gustó' => false,
          'Te adelanto la seña' => true, '¿Te transfiero la seña?' => true, '¿Mando la seña?' => true, '¿Cuánto es el pago inicial?' => true, 'Seña?' => true, '¿Y la seña cuánto sería?' => true,
          'te adelanto, quiero cambiar el logo' => false, 'Les adelanto: el logo nuevo lo mando mañana' => false, 'quiero arrancar con los cambios' => false,
          'No tengo para la seña ahora' => false, 'Donde pago el dominio?' => false, 'me pasas el link para ver la web de nuevo?' => false,
          'quiero avanzar' => true, 'pasame el link' => true, 'Ya pagué la seña' => false, 'Después de la seña cuánto queda?' => false, 'voy a pagar el lunes' => false] as $m => $esperado) {
    caso("¿pide pagar? «{$m}» → " . ($esperado ? 'sí' : 'no'), wabot_comercial_postdemo_pide_pago($m) === $esperado);
}
caso('lo que quedó para Pablo va en el contexto: no lo contesta', strpos(wabot_comercial_contexto('hola?', $cvPausa + ['tel' => '5491100009999TEST'], $cfg), 'pagar en cuotas') !== false);

echo "— 12. Sin la forma de pago del formulario (2-nov): el bot la pregunta antes del link —\n";
// Con la prueba de precios prendida, para que cada grupo use su pregunta.
$GLOBALS['WABOT_TEST_SIN_AB'] = false;
$cotA2 = ['origen' => 'bot', 'plan' => 'panel', 'anual' => '$210.000', 'mensual' => '$30.000', 'unico' => '$330.000', 'modelo' => 'a2', 'ts' => time() - 7200];
const PREGUNTA_MODALIDAD_A2 = 'Para pasarte el link de pago, preferís el plan anual o el plan mensual?';
$c = cv_demo('ecommerce', ['modalidad_elegida' => '', 'ab_grupo' => 'a2', 'comercial_cotizacion' => $cotA2]);
oa([dc(['modelo_elegido' => '2', 'quiere_avanzar' => true, 'mensajes' => ['Me alegra que te haya gustado']])]);
$r = turno('Me encantó el modelo 2', $c, $cfg);
caso('A2: le gustó y eligió modelo → «tomamos el modelo 2» y la pregunta de la modalidad, sin link', $r === ['Perfecto, tomamos el modelo 2', 'Me alegra que te haya gustado', PREGUNTA_MODALIDAD_A2]
    && !empty($c['postdemo_pregunto_modalidad_ts']) && empty($c['postdemo_link_pago_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
oa([dc(['mensajes' => []])]);
caso('el modelo sabe que ya se la preguntamos', $c && strpos(wabot_comercial_contexto('mensual', $c, $cfg), 'ya se la preguntamos') !== false);
$cm = $c;
oa([dc(['mensajes' => []])]);
$r = turno('Sería el mensual', $cm, $cfg);
caso('«Sería el mensual» → el link mensual y queda anotada la modalidad', $r === [LINK_MENSUAL_30] && ($cm['modalidad_elegida'] ?? '') === 'mensual' && !empty($cm['postdemo_link_pago_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
$ca = $c;
oa([dc(['mensajes' => []])]);
$r = turno('anual', $ca, $cfg);
caso('«anual» → el plan anual con la seña y el resto', $r === ['Te paso el plan anual con todas las condiciones y los datos para la transferencia. Para arrancar con todas las modificaciones son $60.000 y el resto ($150.000) se paga al finalizar la web, que no demora más de 7 días: gokywebs.com/pago/anual210']
    && ($ca['modalidad_elegida'] ?? '') === 'unico', json_encode($r, JSON_UNESCAPED_UNICODE));
$cl = $c;
oa([dc(['pide_pago' => true, 'mensajes' => []])]);
$r = turno('pasame el link', $cl, $cfg);
caso('si ya se la preguntamos y pide el link sin decirla, va el mensual (no insiste)', $r === [LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modalidad_elegida' => '', 'ab_grupo' => 'a2', 'comercial_cotizacion' => $cotA2]);
oa([dc(['pide_pago' => true, 'mensajes' => []])]);
$r = turno('Cómo te pago?', $c, $cfg);
caso('pide pagar sin modelo ni modalidad → las dos preguntas, sin link', $r === [PREGUNTA_MODELO, PREGUNTA_MODALIDAD_A2] && empty($c['postdemo_link_pago_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modalidad_elegida' => 'mensual', 'ab_grupo' => 'a2', 'comercial_cotizacion' => $cotA2, 'modelo_elegido' => '1']);
oa([dc(['pide_pago' => true, 'mensajes' => []])]);
$r = turno('pasame el link', $c, $cfg);
caso('si ya la eligió en el chat, el link directo', $r === [LINK_MENSUAL_30], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modalidad_elegida' => '', 'ab_grupo' => 'b', 'modelo_elegido' => '1',
    'comercial_cotizacion' => ['origen' => 'bot', 'plan' => 'panel', 'anual' => '', 'mensual' => '$30.000', 'unico' => '$330.000', 'inicial' => '$100.000', 'modelo' => 'b', 'ts' => time() - 7200]]);
oa([dc(['quiere_avanzar' => true, 'mensajes' => ['Buenísimo']])]);
$r = turno('Me gustó mucho, cómo sigo?', $c, $cfg);
caso('grupo B: una sola modalidad → el link del pago inicial, sin preguntar', tiene($r, 'gokywebs.com/pago/inicial100') && !tiene($r, 'preferís') && empty($c['postdemo_pregunto_modalidad_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modalidad_elegida' => '', 'ab_grupo' => 'a', 'modelo_elegido' => '1',
    'comercial_cotizacion' => ['origen' => 'bot', 'plan' => 'panel', 'anual' => '', 'mensual' => '$30.000', 'unico' => '$330.000', 'modelo' => 'a', 'ts' => time() - 7200]]);
oa([dc(['quiere_avanzar' => true, 'mensajes' => []])]);
$r = turno('Dale, avancemos', $c, $cfg);
caso('grupo A (cerrado): la pregunta con el pago único y el mensual', $r === ['Para pasarte el link de pago, preferís el pago único o el plan mensual?'], json_encode($r, JSON_UNESCAPED_UNICODE));
$c = cv_demo('ecommerce', ['modalidad_elegida' => '', 'modelo_elegido' => '1']);
oa([dc(['quiere_avanzar' => true, 'mensajes' => []])]);
$r = turno('Dale, avancemos', $c, $cfg);
caso('cotizada antes de la prueba: la pregunta con las tres', $r === ['Para pasarte el link de pago, preferís el pago único, el plan anual o el plan mensual?'], json_encode($r, JSON_UNESCAPED_UNICODE));
foreach (['Sería el mensual' => 'mensual', 'el anual' => 'unico', 'Mensual porfa' => 'mensual', 'pago único' => 'propia', 'anual o mensual?' => null,
          'no, el mensual no' => null, 'el mensual o el anual, no sé' => null, 'Me gustó el modelo 1' => null] as $m => $esperado) {
    caso("respuesta a la pregunta: «{$m}» → " . var_export($esperado, true),
        wabot_comercial_postdemo_respuesta_modalidad($m, ['postdemo_pregunto_modalidad_ts' => time(), 'comercial_cotizacion' => $cotA2]) === $esperado);
}
caso('sin habérsela preguntado, «sería el mensual» no la elige por esta vía', wabot_comercial_postdemo_respuesta_modalidad('Sería el mensual', ['comercial_cotizacion' => $cotA2]) === null);
$GLOBALS['WABOT_TEST_SIN_AB'] = true;

foreach ((array)glob($tmp . '/uso/*') as $f) @unlink($f);
@rmdir($tmp . '/uso'); @rmdir($tmp);
todo_ok();
