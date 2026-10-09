<?php
/**
 * wabot/ia.php — OpenAI en el bot (27-sep-2026).
 *
 * Tres modos, en Ajustes → Inteligencia artificial (clave `ia_proveedor`):
 *   - gemini: como siempre. Gemini clasifica y el motor contesta con los textos fijos.
 *   - openai: OpenAI conversa desde el primer mensaje hasta el precio: entiende el
 *     negocio, contesta, pregunta lo que falta y decide cuándo cotizar. El precio,
 *     la oferta del primer diseño y el silencio de después siguen saliendo del
 *     motor con los textos de siempre (wabot_precio). Clasificar, resumir el negocio
 *     y pasar colores a hex también van a OpenAI. Fotos, audios y archivos los sigue
 *     leyendo Gemini.
 *   - shadow: contesta Gemini, como siempre, y OpenAI piensa en paralelo lo que
 *     habría contestado. Lo suyo no sale por WhatsApp: queda en data/ia-sombra/
 *     para compararlo en el panel (pestaña IA).
 *
 * Si OpenAI falla (caído, sin key, respuesta rota o con un monto inventado), ese
 * turno lo contesta el motor de siempre: el cliente nunca ve un error.
 *
 * La key nunca va en el repo: variable de entorno OPENAI_API_KEY o la constante
 * WABOT_OPENAI_KEY de config/wabot-config.php (fuera de git, igual que la de Gemini).
 */

require_once __DIR__ . '/ia-instrucciones.php';

/* ─────────────────────────────── Configuración ─────────────────────────────── */

/** Lo que se toca desde Ajustes (se suman a wabot_ajustes_claves). */
function wabot_ia_ajustes_claves() {
    return ['ia_proveedor', 'openai_modelo', 'openai_esfuerzo', 'openai_max_tokens', 'openai_timeout',
            'ia_historial', 'ia_max_mensajes', 'openai_precio_entrada', 'openai_precio_cache', 'openai_precio_salida'];
}

/** Lee un ajuste de bot-config.json cuando no hay $cfg a mano (una vez por request). */
function wabot_ia_ajuste_guardado($clave) {
    static $guardado = null;
    if ($guardado === null) {
        $raw = @file_get_contents(WABOT_DIR . '/bot-config.json');
        $j = $raw ? json_decode($raw, true) : null;
        $guardado = is_array($j) ? $j : [];
    }
    return $guardado[$clave] ?? null;
}

function wabot_ia_ajuste($cfg, $clave) {
    return is_array($cfg) ? ($cfg[$clave] ?? null) : wabot_ia_ajuste_guardado($clave);
}

/**
 * El modo pedido: gemini, openai o shadow. El panel manda; si nunca se tocó,
 * vale la variable de entorno AI_PROVIDER; si no, gemini (lo de siempre).
 */
function wabot_ia_proveedor_pedido($cfg = null) {
    if (isset($GLOBALS['WABOT_TEST_IA_PROVEEDOR'])) return (string)$GLOBALS['WABOT_TEST_IA_PROVEEDOR'];
    $p = trim((string)wabot_ia_ajuste($cfg, 'ia_proveedor'));
    if ($p === '') $p = strtolower(trim((string)getenv('AI_PROVIDER')));
    return in_array($p, ['gemini', 'openai', 'shadow'], true) ? $p : 'gemini';
}

/** El modo que de verdad corre: sin key de OpenAI, openai y shadow quedan en gemini. */
function wabot_ia_proveedor($cfg = null) {
    $p = wabot_ia_proveedor_pedido($cfg);
    return ($p !== 'gemini' && wabot_openai_key() === '') ? 'gemini' : $p;
}

function wabot_openai_key() {
    if (isset($GLOBALS['WABOT_TEST_OPENAI_KEY'])) return (string)$GLOBALS['WABOT_TEST_OPENAI_KEY'];
    $env = getenv('OPENAI_API_KEY');
    if (is_string($env) && trim($env) !== '') return trim($env);
    if (defined('WABOT_OPENAI_KEY')) {
        $k = trim((string)constant('WABOT_OPENAI_KEY'));
        if ($k !== '' && $k !== 'COMPLETAR') return $k;
    }
    return '';
}

/**
 * Precios oficiales por millón de tokens en dólares (developers.openai.com/api/docs/pricing,
 * 27-sep-2026): [entrada, entrada en caché, salida]. Solo sirven para estimar el
 * costo en el panel; si OpenAI los cambia o se usa otro modelo, se cargan en Ajustes.
 */
function wabot_openai_precios() {
    return [
        'gpt-6-astra'   => [10.00, 1.00, 50.00],
        'gpt-6-sol'     => [2.00, 0.20, 10.00],
        'gpt-6-luna'    => [0.10, 0.01, 0.50],
        'gpt-5.6-sol'   => [4.00, 0.40, 20.00],
        'gpt-5.6-terra' => [2.00, 0.20, 12.00],
        'gpt-5.6-luna'  => [0.20, 0.02, 1.20],
        'gpt-5.5'       => [5.00, 0.50, 30.00],
        'gpt-5.4'       => [2.50, 0.25, 15.00],
        'gpt-5.4-mini'  => [0.75, 0.075, 4.50],
        'gpt-5.4-nano'  => [0.20, 0.02, 1.25],
        'gpt-5-mini'    => [0.25, 0.025, 2.00],
        'gpt-5-nano'    => [0.05, 0.005, 0.40],
    ];
}

/** Los que ofrece el selector del panel. Se puede escribir cualquier otro. */
function wabot_openai_modelos_sugeridos() {
    return [
        'gpt-6-sol'   => 'GPT-6 Sol — recomendado: entiende bien y cuesta poco por mensaje',
        'gpt-6-luna'  => 'GPT-6 Luna — el más barato, para mucho volumen',
        'gpt-6-astra' => 'GPT-6 Astra — el más capaz, bastante más caro',
    ];
}

function wabot_openai_modelo_default() {
    return 'gpt-6-sol';
}

function wabot_openai_modelo_valido($m) {
    return is_string($m) && preg_match('/^[a-z0-9][a-z0-9._:\-]{1,63}$/i', trim($m)) === 1;
}

/** El panel manda; después la variable OPENAI_MODEL; después el default. */
function wabot_openai_modelo($cfg = null) {
    $m = trim((string)wabot_ia_ajuste($cfg, 'openai_modelo'));
    if (wabot_openai_modelo_valido($m)) return $m;
    $env = trim((string)getenv('OPENAI_MODEL'));
    if (wabot_openai_modelo_valido($env)) return $env;
    return wabot_openai_modelo_default();
}

/** Un ajuste numérico acotado: un valor raro en el panel no puede romper el bot. */
function wabot_ia_numero($cfg, $clave, $default, $min, $max) {
    $v = wabot_ia_ajuste($cfg, $clave);
    if (!is_numeric($v)) return $default;
    return max($min, min($max, $v + 0));
}

function wabot_openai_esfuerzo($cfg = null) {
    $e = trim((string)wabot_ia_ajuste($cfg, 'openai_esfuerzo'));
    return in_array($e, ['none', 'low', 'medium', 'high'], true) ? $e : 'low';
}

/* ─────────────────────────────── Llamada a la API ─────────────────────────────── */

/** Un POST a /v1/responses: [código http, cuerpo, segundos de Retry-After]. El gancho de test lo simula. */
function wabot_openai_post($payload, $timeout) {
    if (isset($GLOBALS['WABOT_TEST_OPENAI_HTTP'])) {
        $r = call_user_func($GLOBALS['WABOT_TEST_OPENAI_HTTP'], $payload);
        return [(int)($r[0] ?? 0), (string)($r[1] ?? ''), (float)($r[2] ?? 0)];
    }
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED'])) return [0, '', 0];
    $retry = 0.0;
    $ch = curl_init('https://api.openai.com/v1/responses');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_openai_key(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => (int)ceil($timeout),
        CURLOPT_HEADERFUNCTION => function ($ch, $linea) use (&$retry) {
            if (stripos($linea, 'retry-after:') === 0) $retry = (float)trim(substr($linea, 12));
            return strlen($linea);
        },
    ]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, is_string($body) ? $body : '', $retry];
}

/** ¿Se puede llamar a OpenAI ahora? Sin key o con el circuito abierto, no. */
function wabot_openai_disponible() {
    if (wabot_openai_key() === '') return false;
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED']) && !isset($GLOBALS['WABOT_TEST_OPENAI_HTTP'])) return false;
    $j = json_decode((string)@file_get_contents(WABOT_DATA . '/openai-circuit.json'), true);
    return !is_array($j) || (int)($j['hasta_ts'] ?? 0) <= time();
}

/**
 * Circuito propio de OpenAI (el de Gemini es otro): después de fallar con
 * reintentos, los turnos siguientes no esperan otra vez el timeout y van
 * directo al motor. Una key rechazada (401/403) frena 5 minutos.
 */
function wabot_openai_circuito_abrir($http) {
    if ($http === 429) $segundos = 60;
    elseif ($http === 401 || $http === 403) $segundos = 300;
    elseif ($http === 0 || $http >= 500) $segundos = 20;
    else return;
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED'])) return;
    wabot_json_guardar_atomico(WABOT_DATA . '/openai-circuit.json', ['hasta_ts' => time() + $segundos, 'http' => $http]);
}

/** El texto que devolvió el modelo, o [null, motivo] si no vino (rechazo, vacío). */
function wabot_openai_texto_de($json) {
    foreach ((array)($json['output'] ?? []) as $item) {
        if (($item['type'] ?? '') !== 'message') continue;
        foreach ((array)($item['content'] ?? []) as $parte) {
            if (($parte['type'] ?? '') === 'refusal') return [null, 'rechazo'];
            if (($parte['type'] ?? '') === 'output_text' && trim((string)($parte['text'] ?? '')) !== '') {
                return [(string)$parte['text'], null];
            }
        }
    }
    if (is_string($json['output_text'] ?? null) && trim($json['output_text']) !== '') return [$json['output_text'], null];
    return [null, 'vacia'];
}

/**
 * Una llamada a la Responses API, con reintentos razonables:
 *   - 429, 5xx y sin respuesta (timeout, red): hasta dos reintentos, respetando
 *     Retry-After (máximo 4 s) — el cliente ya está esperando;
 *   - un parámetro que el modelo no acepta (el razonamiento en uno que no razona):
 *     se saca y se reintenta;
 *   - respuesta cortada por el tope de tokens: una vez más con un tope mayor;
 *   - JSON roto: una vez más.
 * Devuelve ['ok', 'datos' (JSON decodificado), 'texto', 'uso', 'modelo', 'http', 'error'].
 * Nunca devuelve ni loguea la key.
 */
function wabot_openai_llamar($tarea, $instrucciones, $entrada, $formato, $cfg = null, $opciones = []) {
    $modelo = wabot_openai_modelo($cfg);
    $falla = function ($error, $http = 0) use ($modelo) {
        return ['ok' => false, 'datos' => null, 'texto' => '', 'uso' => null, 'modelo' => $modelo, 'http' => $http, 'error' => $error];
    };
    if (!wabot_openai_disponible()) return $falla('no_disponible');

    $payload = [
        'model' => $modelo,
        'instructions' => (string)$instrucciones,
        'input' => $entrada,
        'max_output_tokens' => (int)($opciones['max_tokens'] ?? wabot_ia_numero($cfg, 'openai_max_tokens', 1600, 300, 8000)),
        'store' => false,
        'text' => ['format' => $formato],
        // Las instrucciones son iguales en cada llamada de la misma tarea: con la misma
        // clave, OpenAI reusa la caché y esa parte se cobra 10 veces menos.
        'prompt_cache_key' => 'gokywebs-wabot-' . $tarea,
    ];
    $esfuerzo = (string)($opciones['esfuerzo'] ?? wabot_openai_esfuerzo($cfg));
    if ($esfuerzo !== '' && $esfuerzo !== 'none') $payload['reasoning'] = ['effort' => $esfuerzo];
    // Identifica al cliente ante OpenAI sin mandarle el teléfono: un hash.
    if (!empty($opciones['usuario'])) $payload['safety_identifier'] = substr(hash('sha256', 'gokywebs|' . $opciones['usuario']), 0, 32);

    $timeout = (float)wabot_ia_numero($cfg, 'openai_timeout', 25, 5, 60);
    $inicio = microtime(true);
    $http = 0; $error = 'sin_respuesta'; $jsonRoto = 0; $cortada = 0;
    for ($intento = 0; $intento < 4; $intento++) {
        [$http, $body, $retry] = wabot_openai_post($payload, $timeout);
        $json = json_decode($body, true);

        if ($http >= 200 && $http < 300 && is_array($json)) {
            $uso = wabot_ia_uso_registrar($tarea, (string)($json['model'] ?? $modelo), (array)($json['usage'] ?? []), $opciones);
            if (($json['status'] ?? 'completed') === 'incomplete') {
                $error = 'incompleta:' . (string)($json['incomplete_details']['reason'] ?? '');
                if (($json['incomplete_details']['reason'] ?? '') === 'max_output_tokens' && $cortada++ === 0) {
                    $payload['max_output_tokens'] = (int)ceil($payload['max_output_tokens'] * 1.8);
                    continue;
                }
                break;
            }
            [$texto, $motivo] = wabot_openai_texto_de($json);
            if ($texto === null) { $error = $motivo; break; }
            $datos = null;
            if (in_array($formato['type'] ?? '', ['json_schema', 'json_object'], true)) {
                $datos = json_decode($texto, true);
                if (!is_array($datos)) {
                    $error = 'json_invalido';
                    if ($jsonRoto++ === 0) continue;
                    break;
                }
            }
            return ['ok' => true, 'datos' => $datos, 'texto' => $texto, 'uso' => $uso, 'modelo' => (string)($json['model'] ?? $modelo),
                    'http' => $http, 'error' => null, 'segundos' => round(microtime(true) - $inicio, 2)];
        }

        $mensaje = is_array($json) ? (string)($json['error']['message'] ?? '') : '';
        $parametro = is_array($json) ? (string)($json['error']['param'] ?? '') : '';
        // Un parámetro que este modelo no acepta: se saca y se vuelve a pedir.
        if ($http === 400) {
            $sacar = null;
            foreach (['reasoning', 'safety_identifier', 'prompt_cache_key'] as $p) {
                if (isset($payload[$p]) && (strpos($parametro, $p) === 0 || stripos($mensaje, $p) !== false)) { $sacar = $p; break; }
            }
            if ($sacar !== null) { unset($payload[$sacar]); continue; }
        }
        $error = 'http_' . $http . ($mensaje !== '' ? ': ' . mb_substr($mensaje, 0, 160) : '');
        $reintentable = $http === 0 || $http === 429 || $http >= 500;
        if (!$reintentable || $intento >= 2) break;
        wabot_log('reintento', ['donde' => 'openai', 'tarea' => $tarea, 'http' => $http, 'modelo' => $modelo]);
        $espera = $retry > 0 ? min(4.0, $retry) : 0.8 * ($intento + 1);
        if (!isset($GLOBALS['WABOT_TEST_OPENAI_HTTP'])) usleep((int)($espera * 1000000));
    }
    wabot_log('error', ['donde' => 'openai', 'tarea' => $tarea, 'http' => $http, 'modelo' => $modelo, 'msg' => mb_substr($error, 0, 200)]);
    wabot_openai_circuito_abrir($http);
    return $falla($error, $http);
}

/**
 * Las tareas viejas de Gemini (clasificar, resumir el negocio, colores): mismo
 * prompt, respuesta en JSON. Devuelve el JSON decodificado o null.
 */
function wabot_openai_json($prompt, $tarea, $cfg = null, $maxTokens = 900) {
    $r = wabot_openai_llamar($tarea,
        'Seguí al pie de la letra las instrucciones del mensaje. Respondé únicamente con el objeto JSON que se pide, sin texto alrededor.',
        (string)$prompt, ['type' => 'json_object'], $cfg,
        // Estas tareas son de leer y etiquetar: sin razonamiento largo, que suma demora.
        ['max_tokens' => $maxTokens, 'esfuerzo' => wabot_openai_esfuerzo($cfg) === 'none' ? 'none' : 'low']);
    return $r['ok'] ? $r['datos'] : null;
}

/* ─────────────────────────────── Consumo y costo ─────────────────────────────── */

function wabot_ia_uso_dir() {
    return (string)($GLOBALS['WABOT_TEST_IA_USO_DIR'] ?? (WABOT_DATA . '/ia-uso'));
}

/** Costo estimado en dólares, o null si el modelo no tiene precio cargado. */
function wabot_openai_costo($modelo, $entrada, $cache, $salida, $cfg = null) {
    $precios = wabot_openai_precios();
    $p = null;
    foreach ($precios as $nombre => $valores) {
        // "gpt-6-sol-2026-09-01" es el mismo modelo con fecha.
        if ($modelo === $nombre || strpos($modelo, $nombre . '-2') === 0) { $p = $valores; break; }
    }
    $manual = [wabot_ia_ajuste($cfg, 'openai_precio_entrada'), wabot_ia_ajuste($cfg, 'openai_precio_cache'), wabot_ia_ajuste($cfg, 'openai_precio_salida')];
    if (is_numeric($manual[0]) && is_numeric($manual[2]) && (float)$manual[0] > 0) {
        $p = [(float)$manual[0], is_numeric($manual[1]) ? (float)$manual[1] : (float)$manual[0], (float)$manual[2]];
    }
    if ($p === null) return null;
    $sinCache = max(0, $entrada - $cache);
    return round(($sinCache * $p[0] + $cache * $p[1] + $salida * $p[2]) / 1000000, 6);
}

/**
 * Anota una llamada en data/ia-uso/AAAA-MM.jsonl: tarea, modo (real o sombra),
 * modelo, tokens y costo, con la conversación que la originó. De ahí salen los
 * totales del panel y el costo de cada charla.
 */
function wabot_ia_uso_registrar($tarea, $modelo, $uso, $opciones = []) {
    $entrada = (int)($uso['input_tokens'] ?? 0);
    $cache   = (int)($uso['input_tokens_details']['cached_tokens'] ?? 0);
    $salida  = (int)($uso['output_tokens'] ?? 0);
    $razon   = (int)($uso['output_tokens_details']['reasoning_tokens'] ?? 0);
    $costo   = wabot_openai_costo($modelo, $entrada, $cache, $salida);
    $fila = [
        'ts' => date('c'), 'tarea' => $tarea, 'modo' => (string)($opciones['modo'] ?? 'real'), 'modelo' => $modelo,
        'conv' => (string)($opciones['usuario'] ?? ($GLOBALS['WABOT_IA_CLAVE'] ?? '')),
        'entrada' => $entrada, 'cache' => $cache, 'salida' => $salida, 'razonamiento' => $razon, 'costo_usd' => $costo,
    ];
    if (empty($GLOBALS['WABOT_TEST_SIN_RED']) || isset($GLOBALS['WABOT_TEST_IA_USO_DIR'])) {
        $dir = wabot_ia_uso_dir();
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        @file_put_contents($dir . '/' . date('Y-m') . '.jsonl', json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    }
    return $fila;
}

/**
 * Totales de un mes (AAAA-MM): general, por tarea, por modo, por modelo y por
 * conversación. `sin_precio` cuenta las llamadas de un modelo sin tarifa cargada.
 */
function wabot_ia_uso_resumen($mes = null) {
    $mes = $mes ?: date('Y-m');
    $vacio = ['llamadas' => 0, 'entrada' => 0, 'cache' => 0, 'salida' => 0, 'costo_usd' => 0.0];
    $r = ['mes' => $mes, 'total' => $vacio, 'por_tarea' => [], 'por_modo' => [], 'por_modelo' => [], 'por_conv' => [], 'sin_precio' => 0];
    $archivo = wabot_ia_uso_dir() . '/' . preg_replace('/[^0-9-]/', '', $mes) . '.jsonl';
    $h = @fopen($archivo, 'r');
    if (!$h) return $r;
    $sumar = function (&$dest, $f) use ($vacio) {
        if (!$dest) $dest = $vacio;
        $dest['llamadas']++;
        foreach (['entrada', 'cache', 'salida'] as $k) $dest[$k] += (int)($f[$k] ?? 0);
        $dest['costo_usd'] += (float)($f['costo_usd'] ?? 0);
    };
    while (($linea = fgets($h)) !== false) {
        $f = json_decode($linea, true);
        if (!is_array($f)) continue;
        $sumar($r['total'], $f);
        $sumar($r['por_tarea'][(string)($f['tarea'] ?? '?')], $f);
        $sumar($r['por_modo'][(string)($f['modo'] ?? 'real')], $f);
        $sumar($r['por_modelo'][(string)($f['modelo'] ?? '?')], $f);
        if (($f['conv'] ?? '') !== '') $sumar($r['por_conv'][(string)$f['conv']], $f);
        if (!isset($f['costo_usd']) || $f['costo_usd'] === null) $r['sin_precio']++;
    }
    fclose($h);
    uasort($r['por_conv'], function ($a, $b) { return $b['costo_usd'] <=> $a['costo_usd']; });
    return $r;
}

/** Lo que costó una conversación, sumando este mes y el anterior. */
function wabot_ia_uso_conversacion($clave) {
    $total = ['llamadas' => 0, 'costo_usd' => 0.0, 'entrada' => 0, 'salida' => 0];
    foreach ([date('Y-m', strtotime('first day of last month')), date('Y-m')] as $mes) {
        $c = wabot_ia_uso_resumen($mes)['por_conv'][(string)$clave] ?? null;
        if (!$c) continue;
        foreach ($total as $k => $v) $total[$k] += $c[$k];
    }
    return $total;
}

/* ─────────────────────────── La conversación antes del precio ─────────────────────────── */

/** Los tipos que puede elegir el modelo y a qué tipo del motor van. */
function wabot_ia_tipos_web() {
    return [
        'sitio_profesional'  => 'landing',
        'tienda_online'      => 'ecommerce',
        'catalogo_sin_venta' => 'ecommerce',   // el motor lo cotiza como sitio profesional con catálogo
        'plataforma_cursos'  => 'elearning',
        'tienda_con_cursos'  => 'ecommerce',
        'inmobiliaria'       => 'inmobiliaria',
        'sistema_gestion'    => 'sistema',
        'sin_definir'        => null,
    ];
}

function wabot_ia_etapas() {
    return ['NUEVO_CONTACTO', 'ENTENDIENDO_NEGOCIO', 'ENTENDIENDO_NECESIDAD', 'COTIZACION', 'DERIVAR_A_HUMANO', 'SIN_INTERES'];
}

/**
 * En qué etapa comercial está la charla, mirando lo que ya pasó. Antes del precio
 * manda lo último que dijo el modelo; después, los hechos del motor.
 */
function wabot_ia_etapa($conv) {
    if (!empty($conv['presentado_ts'])) {
        if (!empty($conv['pago_avisado_ts'])) return 'PAGO';
        if (!empty($conv['cambios_pedidos']) || !empty($conv['cambios'])) return 'CAMBIOS_SOLICITADOS';
        return 'DEMO_ENVIADA';
    }
    if ((int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['link_form_enviado'])) return 'DEMO_EN_PROCESO';
    if (!empty($conv['precio_dado'])) return 'DEMO_OFRECIDA';
    if (($conv['fase'] ?? '') === 'derivado') return 'DERIVAR_A_HUMANO';
    $e = (string)($conv['etapa_comercial'] ?? '');
    return in_array($e, wabot_ia_etapas(), true) ? $e : 'NUEVO_CONTACTO';
}

/**
 * ¿Este turno lo atiende OpenAI? Solo antes del precio y en una charla abierta:
 * lo demás (el precio y lo que sigue, el formulario, la demo, una charla ya
 * derivada o cerrada, un sistema de gestión) lo sigue manejando el motor.
 */
function wabot_ia_turno_elegible($conv) {
    foreach (['precio_dado', 'presentado_ts', 'link_form_enviado', 'lead_creado', 'cierre', 'bot_off',
              'control_manual', 'contexto_consulta', 'upgrade_pendiente', 'oferta_diseno_ts'] as $k) {
        if (!empty($conv[$k])) return false;
    }
    if ((int)($conv['form_completado_ts'] ?? 0) > 0) return false;
    return in_array((string)($conv['fase'] ?? 'nuevo'),
        ['nuevo', 'menu', 'algo_diferente', 'reconocimiento', 'desempate_hibrido', 'desempate_cursos'], true);
}

/**
 * Cómo preguntan los clientes cada tema (consultas-ejemplos.php, 2-oct): las
 * formas reales de las charlas, para que el modelo reconozca la consulta
 * aunque venga con otras palabras. Como mucho $max por clave.
 */
function wabot_consultas_ejemplos($clave = null, $max = 6) {
    static $todos = null;
    if ($todos === null) {
        $todos = is_file(__DIR__ . '/consultas-ejemplos.php') ? (array)(require __DIR__ . '/consultas-ejemplos.php') : [];
    }
    if ($clave === null) return $todos;
    return array_slice(array_values(array_filter((array)($todos[$clave] ?? []), 'is_string')), 0, $max);
}

/** " (lo preguntan así: «a» / «b»)", o '' si la clave no tiene ejemplos. */
function wabot_consultas_ejemplos_texto($clave, $max = 6) {
    $ej = wabot_consultas_ejemplos($clave, $max);
    if (!$ej) return '';
    return ' (lo preguntan así: «' . implode('» / «', array_map(static fn($e) => trim(preg_replace('/\s+/u', ' ', $e)), $ej)) . '»)';
}

/** Las claves de respuestas oficiales que puede pedir el modelo (sin el comodín). */
function wabot_ia_info_claves($cfg) {
    return array_values(array_filter(array_keys((array)($cfg['info'] ?? [])), function ($k) {
        return $k !== 'otra';
    }));
}

/**
 * La parte B: la información comercial, armada desde textos.php y el motor. Los
 * montos no están: el precio lo manda el motor y las respuestas oficiales van
 * con sus marcadores ({mensualidad}), que el sistema completa al mandarlas.
 */
function wabot_ia_info_comercial($cfg) {
    $lineas = ["INFORMACIÓN COMERCIAL DE GOKYWEBS (es la única fuente válida; no agregues nada)"];
    $lineas[] = "\nTIPOS DE WEB QUE COTIZAMOS (tipo_web → qué es):";
    $descripciones = [
        'sitio_profesional'  => wabot_propuesta_texto('landing', []),
        'tienda_online'      => wabot_propuesta_texto('ecommerce', []),
        'catalogo_sin_venta' => 'Para quien vende productos pero dijo que NO quiere vender por la web: un sitio profesional con el catálogo de sus productos, para que le consulten por WhatsApp.',
        'plataforma_cursos'  => wabot_propuesta_texto('elearning', []),
        'tienda_con_cursos'  => wabot_propuesta_texto('ecommerce', ['combo_cursos' => true]),
        'inmobiliaria'       => wabot_propuesta_texto('inmobiliaria', []),
        'sistema_gestion'    => 'No es una página web: un sistema a medida para ordenar la gestión interna. Lo cotiza una persona después de una pregunta.',
    ];
    foreach ($descripciones as $k => $d) $lineas[] = "- $k: " . trim((string)$d);
    $lineas[] = "\nLO QUE NO HACEMOS: publicidad, redes sociales ni marketing; diseño de logos. Tampoco cotizamos con el precio de lista: más de "
        . (int)($cfg['productos_derivar_desde'] ?? 0) . " productos, conexión con Mercado Libre o con un sistema que ya usa, marketplaces de varios vendedores, entrega automática de los archivos al pagar (solo si la pide con esas palabras: vender descargables sin eso es una tienda_online), portales de noticias (lo detecta el sistema).";
    $lineas[] = "\nRESPUESTAS OFICIALES (clave → texto que manda el sistema; los {marcadores} los completa el sistema). Pedilas en info_claves; nunca las copies ni las parafrasees:";
    foreach ((array)($cfg['info'] ?? []) as $k => $t) {
        if ($k === 'otra') continue;
        $lineas[] = "- $k: " . mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$t)), 0, 260) . wabot_consultas_ejemplos_texto($k);
    }
    return implode("\n", $lineas);
}

/** A (comportamiento) + B (información comercial): igual en cada llamada, así se aprovecha la caché. */
function wabot_ia_instrucciones($cfg) {
    return wabot_ia_instrucciones_comportamiento() . "\n\n" . wabot_ia_info_comercial($cfg);
}

/** La parte C: lo que sabemos de ESTE cliente, su etapa y lo último de la charla. */
function wabot_ia_contexto($texto, $conv, $cfg) {
    $f = wabot_ficha($conv);
    $dato = function ($v) { $v = is_array($v) ? implode(', ', array_filter(array_map('strval', $v))) : trim((string)$v); return $v === '' ? '(no lo dijo)' : $v; };
    $funciones = [];
    foreach ((array)$f['funciones'] as $k) $funciones[] = (string)($cfg['funciones_pedidas'][$k] ?? $k);
    $funciones = array_merge($funciones, (array)($f['pedidos_ia'] ?? []));

    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $sesion = array_values(array_filter((array)($conv['transcript'] ?? []), function ($t) use ($inicio) {
        return in_array(($t['q'] ?? ''), ['cliente', 'bot', 'humano'], true) && ($inicio <= 0 || (int)($t['ts'] ?? 0) >= $inicio);
    }));
    // Los últimos mensajes del cliente del transcript son esta misma tanda: van aparte.
    while ($sesion && ($sesion[count($sesion) - 1]['q'] ?? '') === 'cliente') array_pop($sesion);
    $yaHablo = false;
    foreach ($sesion as $t) if (in_array($t['q'] ?? '', ['bot', 'humano'], true)) { $yaHablo = true; break; }

    $limite = (int)wabot_ia_numero($cfg, 'ia_historial', 16, 4, 60);
    $viejos = array_slice($sesion, 0, max(0, count($sesion) - $limite));
    $recientes = array_slice($sesion, -$limite);

    $c = ["LO QUE YA SABEMOS DEL CLIENTE (confirmado: no lo vuelvas a preguntar)"];
    $c[] = '- Nombre: ' . $dato(wabot_nombre_confirmado_de($conv) ?: '');
    $c[] = '- Negocio o marca: ' . $dato($conv['nombre_negocio'] ?? '');
    $c[] = '- Rubro: ' . $dato($f['rubro']);
    $c[] = '- Qué vende u ofrece: ' . $dato($f['que_vende']);
    $c[] = '- Qué quiere lograr con la web: ' . $dato($f['objetivo']);
    $c[] = '- Necesidad detectada: ' . $dato(str_replace('_', ' ', (string)$f['necesidad']));
    $c[] = '- Funciones que pidió: ' . $dato($funciones);
    $c[] = '- Pidió y no hacemos: ' . $dato($f['fuera']);
    if ((int)$f['cantidad_productos'] > 0) $c[] = '- Cantidad de productos: ' . (int)$f['cantidad_productos'];
    $c[] = '- Observaciones: ' . $dato($f['observaciones_ia'] ?? '');
    $c[] = "\nESTADO DE LA CHARLA";
    $c[] = '- Etapa: ' . wabot_ia_etapa($conv);
    $c[] = '- ' . ($yaHablo ? 'Ya le escribimos antes en esta charla: no lo vuelvas a saludar.' : 'Todavía no le escribimos nada en esta charla.');
    if (($conv['fase'] ?? '') === 'reconocimiento') $c[] = '- La última pregunta fue si busca vender por la web o solo mostrar: su mensaje probablemente la contesta.';
    if (($conv['fase'] ?? '') === 'desempate_hibrido') $c[] = '- La última pregunta fue si busca mostrar sus trabajos o vender online: su mensaje probablemente la contesta.';
    /* Nunca el precio (que trae la oferta del primer diseño) sin saber qué vende
     * o a qué se dedica (28-sep). */
    $nombres = ['landing' => 'la web informativa (sitio_profesional)', 'ecommerce' => 'la tienda online (tienda_online)',
                'elearning' => 'la plataforma de cursos (plataforma_cursos)', 'inmobiliaria' => 'la web inmobiliaria (inmobiliaria)'];
    $pend = (string)($conv['tipo_pendiente'] ?? '');
    $pend2 = (string)($conv['tipo_pendiente_2'] ?? '');
    if ($pend !== '' && empty($conv['precio_dado'])) {
        $c[] = '- Ya eligió ' . ($nombres[$pend] ?? $pend) . ($pend2 !== '' ? ' y ' . ($nombres[$pend2] ?? $pend2) . ': son DOS webs' : '')
            . ', y le preguntamos qué vende o a qué se dedica. Si su mensaje lo cuenta, cotizá ' . ($pend2 !== '' ? 'las dos (tipo_web y segunda_web)' : 'ese tipo')
            . ', salvo que lo que cuente sea claramente otro tipo.';
    } elseif (empty($conv['precio_dado']) && wabot_negocio_conocido($conv) === false) {
        $c[] = !empty($conv['rubro_preguntado'])
            ? '- Ya le preguntamos qué vende o a qué se dedica y no lo dijo: si pide el precio o elige un tipo, cotizá igual.'
            : '- Todavía no contó qué vende ni a qué se dedica: no cotices, preguntáselo (una sola pregunta).';
    }
    $opciones = wabot_normalizar_frase((string)($cfg['menu_opciones'] ?? ''));
    if ($opciones !== '' && mb_strpos(wabot_normalizar_frase(wabot_ultimo_texto_bot($conv)), $opciones) !== false) {
        $c[] = '- La última pregunta fue la de la bienvenida (qué tipo de web busca: 1 web informativa, 2 tienda online, 3 algo diferente): su mensaje probablemente elige una.';
    }
    $c[] = '- Canal: ' . (wabot_canal($conv) === 'instagram' ? 'Instagram' : 'WhatsApp');
    // El anuncio del que escribió (9-oct): qué le ofrecimos, con lo que se ve en la imagen.
    $anuncio = wabot_anuncio_contexto_texto($conv);
    if ($anuncio !== '') $c[] = '- Escribió desde un anuncio nuestro: ' . $anuncio . '. Si pide "info" o dice "me interesa", se refiere a lo que ofrece ese anuncio.';
    if ($viejos) {
        $antes = [];
        foreach ($viejos as $t) if (($t['q'] ?? '') === 'cliente') $antes[] = mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$t['t'])), 0, 200);
        if ($antes) $c[] = "\nANTES EL CLIENTE TAMBIÉN DIJO (resumen de lo viejo): " . implode(' | ', array_slice($antes, -12));
    }
    $c[] = "\nÚLTIMOS MENSAJES (del más viejo al más nuevo)";
    if (!$recientes) $c[] = '(ninguno: es el primer mensaje)';
    // Lo que cita cada mensaje ("Responder" de WhatsApp o Instagram), 9-oct.
    $porId = wabot_lineas_por_id($conv, $recientes);
    foreach ($recientes as $t) {
        $quien = ($t['q'] ?? '') === 'cliente' ? 'Cliente' : 'Gokywebs';
        $c[] = $quien . ': ' . wabot_cita_prefijo_ia($t, $porId) . mb_substr(trim((string)$t['t']), 0, 700);
    }
    $citasTanda = wabot_tanda_citas_texto($conv);
    if ($citasTanda !== '') {
        $c[] = "\nEL MENSAJE NUEVO RESPONDE A OTRO MENSAJE (el cliente tocó \"Responder\" sobre él): " . $citasTanda
            . "\nInterpretalo en relación con ESE mensaje, aunque no sea el último de la charla.";
    }
    $c[] = "\nMENSAJE NUEVO DEL CLIENTE (puede venir en varias partes; respondé todo junto una sola vez)";
    $c[] = '"""' . "\n" . mb_substr(trim((string)$texto), 0, 3000) . "\n" . '"""';
    return implode("\n", $c);
}

/** El formato de la respuesta (Structured Outputs estricto). */
function wabot_ia_esquema($cfg) {
    // Sin maxItems ni maxLength: no todas las versiones de Structured Outputs los
    // aceptan en modo estricto. Los topes los aplica wabot_ia_decision_normalizar().
    $texto = function () { return ['type' => ['string', 'null']]; };
    return [
        'type' => 'json_schema',
        'name' => 'turno_comercial',
        'strict' => true,
        'schema' => [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['accion', 'mensajes', 'info_claves', 'tipo_web', 'segunda_web', 'etapa', 'ficha', 'requiere_humano', 'motivo'],
            'properties' => [
                'accion' => ['type' => 'string', 'enum' => ['responder', 'cotizar', 'derivar', 'esperar']],
                'mensajes' => ['type' => 'array', 'items' => ['type' => 'string']],
                'info_claves' => ['type' => 'array', 'items' => ['type' => 'string', 'enum' => wabot_ia_info_claves($cfg)]],
                'tipo_web' => ['type' => 'string', 'enum' => array_keys(wabot_ia_tipos_web())],
                // Dos webs (28-sep): la segunda, con el mismo criterio que tipo_web; si es una sola, sin_definir.
                'segunda_web' => ['type' => 'string', 'enum' => array_keys(wabot_ia_tipos_web())],
                'etapa' => ['type' => 'string', 'enum' => wabot_ia_etapas()],
                'ficha' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'required' => ['nombre', 'negocio', 'rubro', 'que_vende', 'objetivo', 'necesidad', 'funciones', 'observaciones'],
                    'properties' => [
                        'nombre' => $texto(), 'negocio' => $texto(), 'rubro' => $texto(), 'que_vende' => $texto(), 'objetivo' => $texto(),
                        'necesidad' => ['type' => ['string', 'null'], 'enum' => array_merge(wabot_ficha_necesidades(), [null])],
                        'funciones' => ['type' => 'array', 'items' => ['type' => 'string']],
                        'observaciones' => $texto(),
                    ],
                ],
                'requiere_humano' => ['type' => 'boolean'],
                'motivo' => $texto(),
            ],
        ],
    ];
}

/**
 * Por qué un mensaje del modelo no se puede mandar, o null si está bien. Es la
 * red contra lo que tumbó al agente de Gemini el 15-sep: montos y condiciones
 * inventados, promesas de contacto, links y nombres internos.
 */
function wabot_ia_mensaje_problema($m) {
    $t = mb_strtolower((string)$m);
    if (trim($t) === '') return 'vacío';
    if (mb_strlen($t) > 700) return 'demasiado largo';
    if (strpos($t, '$') !== false || preg_match('/\b(usd|u\$s|ars|pesos|d[oó]lares)\b|\d[\d.,]*\s*(mil\b|k\b|%)|\bpor ciento\b/u', $t)) return 'nombra un monto';
    if (preg_match('/\b\d+\s*(d[ií]as?|semanas?|mes(es)?|horas?|hs)\b/u', $t)) return 'nombra un plazo';
    if (preg_match('/https?:|www\.|\.com\b|\.ar\b|@/u', $t)) return 'trae un link o un mail';
    if (preg_match('/\bpablo\b/u', $t)) return 'nombra a alguien del equipo';
    if (preg_match('/\b(gratis|sin cargo|sin costo|bonificad\w*|descuentos?|promo\w*|oferta especial|cuotas? sin inter\w*)\b/u', $t)) return 'ofrece una condición comercial';
    if (preg_match('/\b(te|lo|la) (va|van|vamos) a (llamar|escribir|contactar)|\bte (llamo|llamamos|escribo|escribimos|contacto|contactamos)\b|\b(en breve|a la brevedad)\b/u', $t)) return 'promete un contacto';
    if (preg_match('/[{}\[\]]|\b(accion|info_claves|tipo_web|requiere_humano)\b/u', $t)) return 'trae formato interno';
    if (preg_match('/\b(inteligencia artificial|modelo de lenguaje|openai|chatgpt|gpt|gemini|prompt|mis instrucciones)\b/u', $t)) return 'habla de cómo funciona por dentro';
    return null;
}

/**
 * Saca la muletilla de manual del arranque ("¡Perfecto! Te cuento…" → "Te cuento…").
 * "Dale", "Claro" y "Buenísimo" quedan (2-oct, Pablo: "es muy seco y directo,
 * tiene que ser un poco más cordial"); "Perfecto", "Genial" y "Excelente" en
 * cada mensaje suenan a robot.
 */
function wabot_ia_sin_muletilla($m) {
    $limpio = preg_replace('/^\s*[¡!]?\s*(perfecto|genial|excelente)\s*[!.,]+\s*/iu', '', (string)$m, 1);
    $limpio = trim((string)$limpio);
    if ($limpio === '') return trim((string)$m);
    return mb_strtoupper(mb_substr($limpio, 0, 1)) . mb_substr($limpio, 1);
}

/** Deja la decisión del modelo en un formato seguro: enums válidos, textos limpios y topes. */
function wabot_ia_decision_normalizar($d, $cfg) {
    if (!is_array($d)) return null;
    $acciones = ['responder', 'cotizar', 'derivar', 'esperar'];
    $max = (int)wabot_ia_numero($cfg, 'ia_max_mensajes', 2, 1, 3);
    $mensajes = [];
    foreach (array_slice((array)($d['mensajes'] ?? []), 0, $max) as $m) {
        if (!is_string($m)) continue;
        $m = wabot_ia_sin_muletilla(trim(str_replace(["\r\n", "\r"], "\n", $m)));
        if ($m !== '') $mensajes[] = $m;
    }
    $info = array_values(array_intersect(array_unique(array_filter((array)($d['info_claves'] ?? []), 'is_string')), wabot_ia_info_claves($cfg)));
    $tipo = (string)($d['tipo_web'] ?? 'sin_definir');
    $segunda = (string)($d['segunda_web'] ?? 'sin_definir');
    $ficha = is_array($d['ficha'] ?? null) ? $d['ficha'] : [];
    $limpiar = function ($v, $max) {
        if (!is_string($v)) return null;
        $v = trim(preg_replace('/\s+/u', ' ', $v));
        return ($v === '' || strtolower($v) === 'null') ? null : mb_substr($v, 0, $max);
    };
    return [
        'accion' => in_array($d['accion'] ?? '', $acciones, true) ? $d['accion'] : 'responder',
        'mensajes' => $mensajes,
        // Como mucho dos respuestas oficiales por turno (2-oct: "tiene que ser mucho más simple todo").
        'info_claves' => array_slice($info, 0, 2),
        'tipo_web' => array_key_exists($tipo, wabot_ia_tipos_web()) ? $tipo : 'sin_definir',
        'segunda_web' => array_key_exists($segunda, wabot_ia_tipos_web()) ? $segunda : 'sin_definir',
        'etapa' => in_array($d['etapa'] ?? '', wabot_ia_etapas(), true) ? $d['etapa'] : null,
        'ficha' => [
            'nombre' => $limpiar($ficha['nombre'] ?? null, 60), 'negocio' => $limpiar($ficha['negocio'] ?? null, 80),
            'rubro' => $limpiar($ficha['rubro'] ?? null, 60), 'que_vende' => $limpiar($ficha['que_vende'] ?? null, 120),
            'objetivo' => $limpiar($ficha['objetivo'] ?? null, 160),
            'necesidad' => in_array($ficha['necesidad'] ?? null, wabot_ficha_necesidades(), true) ? $ficha['necesidad'] : null,
            'funciones' => array_values(array_filter(array_map(function ($v) use ($limpiar) { return $limpiar($v, 80); }, array_slice((array)($ficha['funciones'] ?? []), 0, 8)))),
            'observaciones' => $limpiar($ficha['observaciones'] ?? null, 300),
        ],
        'requiere_humano' => !empty($d['requiere_humano']),
        'motivo' => $limpiar($d['motivo'] ?? null, 200),
    ];
}

/** Los problemas de los mensajes que se mandarían (solo cuenta si la acción es responder). */
function wabot_ia_problemas($d) {
    if ($d['accion'] !== 'responder') return [];
    $problemas = [];
    foreach ($d['mensajes'] as $i => $m) {
        $p = wabot_ia_mensaje_problema($m);
        if ($p !== null) $problemas[] = 'el mensaje ' . ($i + 1) . ' ' . $p;
    }
    return $problemas;
}

/**
 * Piensa el turno: arma A+B+C, llama y revisa. Si un mensaje no se puede
 * mandar, le pide UNA corrección diciendo por qué; si tampoco sirve, null y el
 * turno lo contesta el motor. $modo: 'real' o 'sombra' (para el registro de costo).
 */
function wabot_ia_pensar($texto, $conv, $cfg, $modo = 'real') {
    $clave = function_exists('wabot_conversation_key') ? (string)wabot_conversation_key($conv) : '';
    $instrucciones = wabot_ia_instrucciones($cfg);
    $contexto = wabot_ia_contexto($texto, $conv, $cfg);
    $entrada = [['role' => 'user', 'content' => $contexto]];
    $opciones = ['usuario' => $clave, 'modo' => $modo];
    $gastado = ['llamadas' => 0, 'costo_usd' => 0.0];

    for ($vuelta = 0; $vuelta < 2; $vuelta++) {
        $r = wabot_openai_llamar('conversacion', $instrucciones, $entrada, wabot_ia_esquema($cfg), $cfg, $opciones);
        if (!$r['ok']) return ['ok' => false, 'error' => $r['error'], 'gastado' => $gastado];
        $gastado['llamadas']++;
        $gastado['costo_usd'] += (float)($r['uso']['costo_usd'] ?? 0);
        $d = wabot_ia_decision_normalizar($r['datos'], $cfg);
        if ($d === null) return ['ok' => false, 'error' => 'decision_invalida', 'gastado' => $gastado];
        $problemas = wabot_ia_problemas($d);
        if (!$problemas) {
            return ['ok' => true, 'decision' => $d, 'modelo' => $r['modelo'], 'gastado' => $gastado, 'corregida' => $vuelta > 0,
                    'segundos' => $r['segundos'] ?? null];
        }
        wabot_log('ia_corrige', ['tel' => $clave, 'problemas' => implode('; ', $problemas)]);
        $entrada[] = ['role' => 'assistant', 'content' => $r['texto']];
        $entrada[] = ['role' => 'user', 'content' => 'Esa respuesta no se puede mandar: ' . implode('; ', $problemas)
            . '. Recordá: nada de montos, plazos, promociones, links ni promesas de contacto en tus mensajes; para eso están info_claves o cotizar. Devolvé la respuesta corregida.'];
    }
    return ['ok' => false, 'error' => 'mensajes_no_validos', 'gastado' => $gastado];
}

/** Guarda en la ficha lo que entendió el modelo. Todo pasa por las mismas validaciones que el clasificador. */
function wabot_ia_ficha_aplicar($d, $texto, &$conv) {
    $f = $d['ficha'];
    wabot_ficha_actualizar($conv, $texto, ['ficha' => array_filter([
        'rubro' => $f['rubro'], 'que_vende' => $f['que_vende'], 'objetivo' => $f['objetivo'], 'necesidad' => $f['necesidad'],
    ], function ($v) { return $v !== null; })]);
    $ficha = wabot_ficha($conv);
    if ($f['funciones']) $ficha['pedidos_ia'] = array_values(array_unique(array_merge((array)($ficha['pedidos_ia'] ?? []), $f['funciones'])));
    if ($f['observaciones'] !== null) $ficha['observaciones_ia'] = $f['observaciones'];
    $conv['ficha'] = $ficha;
    // El nombre que dijo en la charla (no el del perfil) y el del negocio, si todavía no los teníamos.
    if ($f['nombre'] !== null && empty($conv['nombre_confirmado']) && wabot_nombre_usable($f['nombre']) !== ''
        && mb_stripos(wabot_contexto_cliente_texto($conv), $f['nombre']) !== false) {
        $conv['nombre'] = wabot_nombre_usable($f['nombre']);
        $conv['nombre_confirmado'] = true;
    }
    if ($f['negocio'] !== null && trim((string)($conv['nombre_negocio'] ?? '')) === '' && function_exists('wabot_nombre_negocio_limpiar')) {
        $n = wabot_nombre_negocio_limpiar($f['negocio']);
        if ($n !== '' && mb_stripos(wabot_contexto_cliente_texto($conv), $n) !== false) $conv['nombre_negocio'] = $n;
    }
}

/**
 * Convierte la decisión en lo que sale. Cotizar y derivar van por los caminos
 * del motor, con sus textos fijos y sus guardas (complejidad, necesidad mixta);
 * responder junta las respuestas oficiales pedidas + los mensajes del modelo.
 * Devuelve la lista de mensajes o null si no hay nada que el modelo pueda
 * resolver (ahí contesta el motor).
 */
function wabot_ia_aplicar($d, $texto, &$conv, $cfg) {
    wabot_turno_marcar($conv);
    wabot_ia_ficha_aplicar($d, $texto, $conv);
    if ($d['etapa'] !== null) $conv['etapa_comercial'] = $d['etapa'];
    $conv['ia_ultimo'] = ['ts' => time(), 'accion' => $d['accion'], 'tipo_web' => $d['tipo_web'], 'motivo' => $d['motivo']];
    if (($conv['fase'] ?? 'nuevo') === 'nuevo') $conv['fase'] = 'menu';
    if ($d['requiere_humano']) {
        $conv['handoff_pendiente'] = true;
        wabot_evento_sesion($conv, 'ia_requiere_humano', ['motivo' => (string)$d['motivo']]);
    }

    if ($d['accion'] === 'cotizar') {
        $tipo = wabot_ia_tipos_web()[$d['tipo_web']] ?? null;
        if ($tipo === 'sistema') {
            $conv['fase'] = 'sistema_problema';
            wabot_handoff_aclaracion_resuelta($conv);
            return [wabot_sistema_texto($cfg)];
        }
        if ($tipo !== null && isset($cfg['tipos'][$tipo]) && empty($cfg['tipos'][$tipo]['retirado'])) {
            // El modelo ya entendió si vende por la web o solo muestra: la pregunta fija no se repite.
            $conv['reconocimiento_hecho'] = true;
            $ficha = wabot_ficha($conv);
            if ($d['tipo_web'] === 'catalogo_sin_venta') $ficha['catalogo_explicito'] = true;
            elseif ($tipo === 'ecommerce') $ficha['catalogo_explicito'] = false;
            $conv['ficha'] = $ficha;
            if ($d['tipo_web'] === 'tienda_con_cursos') $conv['combo_cursos'] = true;
            wabot_evento_sesion($conv, 'ia_cotiza', ['tipo' => $d['tipo_web']]);
            $segunda = wabot_ia_tipos_web()[$d['segunda_web'] ?? 'sin_definir'] ?? null;
            $salida = ($segunda !== null && $segunda !== 'sistema' && isset($cfg['tipos'][$segunda]))
                ? wabot_precio_dos($tipo, $segunda, $conv, $cfg)
                : wabot_precio($tipo, $conv, $cfg);
            // Lo que preguntó además del precio ("tenés algún ejemplo?") se contesta antes (28-sep),
            // sin repetir lo que la propuesta ya dice (la publicidad, el logo).
            $dePaso = wabot_ia_info_de_paso($d, $texto, $conv, $cfg, $salida);
            return $dePaso !== '' ? array_merge([$dePaso], $salida) : $salida;
        }
        // "Cotizar" sin un tipo que exista: si trajo algo para decir, se usa; si no, el motor.
        if (!$d['mensajes']) return null;
        $d['accion'] = 'responder';
    }

    if ($d['accion'] === 'derivar') {
        $conv['ia_derivar_motivo'] = (string)$d['motivo'];
        return wabot_derivar($conv, $cfg, 'ia');
    }

    if ($d['accion'] === 'esperar') {
        if ($d['etapa'] === 'SIN_INTERES') wabot_evento_sesion($conv, 'ia_sin_interes');
        return [];
    }

    // responder: primero las respuestas oficiales, con los mismos filtros que el motor.
    $claves = wabot_info_claves_web_propia($d['info_claves'], $texto, $conv, $cfg);
    $claves = wabot_info_claves_sin_repetidas(wabot_info_claves_sin_baja_falsa($claves, $texto));
    $lineas = [];
    foreach ($claves as $k) {
        if ($k === 'otra') continue;
        $una = wabot_info_lineas([$k], $conv, $cfg);
        if ($una !== '') $lineas[] = $una;
    }
    $salida = $lineas ? [wabot_info_unir($lineas)] : [];
    $mensajes = wabot_ia_sin_repetir_oficial($d['mensajes'], $salida);
    // Si el modelo ya preguntó a qué se dedica, el motor no lo vuelve a preguntar (28-sep).
    if (empty($conv['precio_dado']) && wabot_negocio_conocido($conv) === false) {
        foreach ($mensajes as $m) if (wabot_ia_pregunta_negocio($m)) { $conv['rubro_preguntado'] = true; break; }
    }
    return array_merge($salida, $mensajes);
}

/** ¿El mensaje le pregunta qué vende o a qué se dedica? */
function wabot_ia_pregunta_negocio($m) {
    $t = wabot_normalizar_frase((string)$m);
    return (mb_strpos((string)$m, '?') !== false || preg_match('/\b(contame|decime|contanos)\b/u', $t))
        && (bool)preg_match('/\b(dedic\w*|vend\w*|ofrec\w*|producto\w*|servicio\w*|negocio\w*|rubro|cursos?|emprendimiento)\b/u', $t);
}

/**
 * Las respuestas oficiales que pidió el modelo al cotizar, sin las del precio
 * (el precio fijo ya lo dice todo): "tenés algún ejemplo para ver?" se quedaba
 * sin contestar porque cotizar descartaba todo lo demás (28-sep, Luciana).
 */
function wabot_ia_info_de_paso($d, $texto, &$conv, $cfg, $salida = []) {
    $delPrecio = ['precio_sin_rubro', 'rangos', 'pago', 'pago_generico', 'mantenimiento', 'que_incluye', 'que_incluye_sin_productos',
                  'un_solo_pago', 'web_propia', 'las_dos_formas', 'plan_es_servicio', 'pago_sin_precio', 'baja_del_plan', 'proceso', 'otra'];
    // Lo que no hacemos ya lo aclara la propuesta (wabot_fuera_de_servicio_texto): dicho dos veces sobra (28-sep, Alex).
    $avisado = (array)($conv['fuera_avisado'] ?? []);
    if (in_array('publicidad', $avisado, true)) $delPrecio[] = 'marketing';
    if (in_array('logo', $avisado, true)) { $delPrecio[] = 'logo'; $delPrecio[] = 'sin_logo'; }
    $textos = array_values(array_filter((array)$salida, function ($m) { return is_string($m) && !wabot_es_marcador_imagen_precio($m); }));
    $claves = wabot_info_claves_sin_repetidas(wabot_info_claves_sin_baja_falsa((array)($d['info_claves'] ?? []), $texto));
    $lineas = [];
    foreach ($claves as $k) {
        if (in_array($k, $delPrecio, true)) continue;
        $una = wabot_info_lineas([$k], $conv, $cfg);
        if ($una === '' || strpos($una, '$') !== false) continue;
        if ($textos && !wabot_ia_sin_repetir_oficial([$una], $textos)) continue;
        $lineas[] = $una;
    }
    return $lineas ? wabot_info_unir($lineas) : '';
}

/**
 * Lo que el modelo escribe no repite la respuesta oficial que ya sale (28-sep):
 * pedía "precio_sin_rubro" y además escribía "Hola, te paso el valor exacto.
 * Primero contame a qué te dedicás…", y el cliente recibía dos veces lo mismo.
 * Se sacan las oraciones que ya dice la oficial; si no queda nada, el mensaje
 * entero. Lo nuevo (una pregunta distinta, un dato más) se queda.
 */
function wabot_ia_sin_repetir_oficial($mensajes, $oficiales) {
    if (!$mensajes || !$oficiales) return $mensajes;
    $palabras = function ($t) {
        $vacias = ['para', 'pero', 'porque', 'como', 'cuando', 'donde', 'esto', 'esta', 'este', 'todo', 'toda', 'solo', 'tambien',
                   'hola', 'desde', 'sobre', 'entre', 'hasta', 'cada', 'algo', 'tenes', 'tengo', 'tiene', 'podes', 'puedo', 'sea', 'seria'];
        $w = preg_split('/\s+/u', wabot_normalizar_frase($t), -1, PREG_SPLIT_NO_EMPTY);
        return array_values(array_unique(array_filter($w, function ($x) use ($vacias) {
            return mb_strlen($x) >= 4 && !in_array($x, $vacias, true);
        })));
    };
    $dicho = $palabras(implode(' ', $oficiales));
    $out = [];
    foreach ($mensajes as $m) {
        $quedan = [];
        $saco = false;
        foreach (preg_split('/(?<=[.;?!])\s+/u', trim((string)$m)) as $oracion) {
            $w = $palabras($oracion);
            $repetidas = count(array_intersect($w, $dicho));
            if (count($w) >= 3 && $repetidas / count($w) >= 0.6) { $saco = true; continue; }
            $quedan[] = preg_replace('/;$/u', '.', $oracion);
        }
        if (!$saco) { $out[] = $m; continue; }
        $texto = trim(implode(' ', $quedan));
        // Lo que quedó suelto sin contenido propio ("Hola,") no se manda.
        if (count($palabras($texto)) >= 2) $out[] = $texto;
    }
    return $out;
}

/**
 * El turno de OpenAI, si corresponde. null = lo contesta el motor (modo gemini,
 * turno no elegible, OpenAI caído o respuesta que no se pudo usar). En shadow
 * solo anota lo necesario para pensar en paralelo después de contestar.
 */
function wabot_ia_turno($texto, &$conv, $cfg) {
    $modo = wabot_ia_proveedor($cfg);
    if ($modo === 'gemini' || !wabot_ia_turno_elegible($conv)) return null;
    if ($modo === 'shadow') {
        $GLOBALS['WABOT_IA_SOMBRA_PENDIENTE'] = ['texto' => (string)$texto, 'conv' => $conv, 'ts' => time()];
        return null;
    }
    $r = wabot_ia_pensar($texto, $conv, $cfg, 'real');
    if (!$r['ok']) {
        wabot_evento_sesion($conv, 'ia_openai_fallo', ['error' => (string)$r['error']]);
        wabot_log('ia_respaldo', ['tel' => $conv['tel'] ?? '', 'error' => (string)$r['error']]);
        return null;
    }
    $r['decision'] = wabot_ia_redes($r['decision'], $texto, $conv, $cfg);
    $salida = wabot_ia_aplicar($r['decision'], $texto, $conv, $cfg);
    if ($salida === null) return null;
    $salida = wabot_saludo_devolver($texto, $salida, $conv);
    // Si llega otro mensaje antes de mandar esto, el webhook lo descarta y vuelve a pensar con todo.
    $conv['_ia_recalculable'] = true;
    return $salida;
}

/**
 * Devolver el saludo (2-oct, Pablo: "el bot no saluda bien, no se refiere bien
 * a las personas, es muy seco y directo"). En las charlas del 11-sep al 2-oct,
 * de 61 clientes que saludaron, a unos 50 no se les devolvió el saludo: la
 * respuesta oficial o el precio salían primero y el modelo no podía saludar
 * antes. Si el cliente saluda ("hola", "buenas tardes", "bien y vos?") y el
 * primer mensaje no saluda, arranca devolviéndolo, con su nombre si lo sabemos.
 * Una vez por sesión.
 */
function wabot_saludo_eco($texto, $conv) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return '';
    $saludo = '';
    if (preg_match('/^(hola+\s+)?(muy\s+)?buenas tardes\b/u', $t)) $saludo = 'buenas tardes';
    elseif (preg_match('/^(hola+\s+)?(muy\s+)?buenas noches\b/u', $t)) $saludo = 'buenas noches';
    elseif (preg_match('/^(hola+\s+)?(muy\s+)?(buen dia|buenos dias)\b/u', $t)) $saludo = 'buen día';
    elseif (preg_match('/^(hola+\s+)?buenas\b/u', $t)) $saludo = 'buenas';
    elseif (!preg_match('/^(hola+|holis|hello|hi)\b/u', $t)) return '';
    $nombre = wabot_primer_nombre($conv);
    $eco = 'Hola' . ($nombre !== '' ? ' ' . $nombre : '') . ($saludo !== '' ? ', ' . $saludo : '') . '!';
    // "Bien vos?", "cómo estás?": se contesta antes de seguir.
    if (preg_match('/\b(bien (y )?vos|como (estas|andas|va|te va|estan)|todo bien)\b/u', $t)) $eco .= ' Muy bien, gracias.';
    return $eco;
}

function wabot_saludo_devolver($texto, $salida, &$conv) {
    if (!is_array($salida) || !$salida || !empty($conv['saludo_devuelto'])) return $salida;
    $eco = wabot_saludo_eco($texto, $conv);
    if ($eco === '') return $salida;
    $primero = (string)$salida[0];
    $conv['saludo_devuelto'] = true;
    if (preg_match('/^\s*[¡!]?\s*(hola|buen d[ií]a|buenas|muy bien)\b/iu', $primero)) return $salida;
    $salida[0] = $eco . ' ' . ltrim($primero);
    return $salida;
}

/**
 * Las redes deterministas sobre la decisión del modelo (28-sep). Cada una sale
 * de un error visto en charlas reales o simuladas y solo corrige la acción:
 * nunca escribe un texto nuevo.
 *  1. Eligió una opción de la bienvenida. Si no contó qué vende, el modelo le
 *     pregunta y el tipo queda anotado; si lo contó y el modelo igual
 *     repregunta, se cotiza la opción.
 *  2. Ya eligió y se le preguntó qué vende: con la respuesta se cotiza.
 *  3. "¿Qué me recomendás?" con el negocio contado: se cotiza lo que el motor
 *     recomienda para ese negocio, en vez de devolverle otra pregunta.
 */
function wabot_ia_redes($d, $texto, &$conv, $cfg) {
    $normalizado = wabot_normalizar_frase($texto);
    $contextoCliente = $normalizado . ' ' . implode(' ', wabot_contexto_cliente_sesion($conv, 8));
    $contextoCliente = wabot_normalizar_frase($contextoCliente);
    if (($d['accion'] ?? '') === 'cotizar' && empty($conv['precio_dado'])
        && preg_match('/\b(cursos?|clases?|talleres?)\b/u', $normalizado)
        && !preg_match('/\b(online|presenciales?|virtuales?|grabados?|videos?)\b/u', $contextoCliente)) {
        $d['accion'] = 'responder';
        $d['mensajes'] = ['Te consulto, de qué son tus cursos? Los das online o presenciales?'];
        $d['tipo_web'] = 'sin_definir';
        return $d;
    }
    if (($d['accion'] ?? '') === 'cotizar' && preg_match('/\bservicios financieros\b/u', $normalizado)) {
        $d['tipo_web'] = 'sitio_profesional';
    }
    $tipoWeb = ['landing' => 'sitio_profesional', 'ecommerce' => 'tienda_online', 'elearning' => 'plataforma_cursos', 'inmobiliaria' => 'inmobiliaria'];
    $cotizar = function ($d, $tipo, $segunda, $evento) use (&$conv, $texto, $tipoWeb) {
        wabot_evento_sesion($conv, $evento, ['tipo' => $tipo . ($segunda ? '+' . $segunda : '')]);
        wabot_log($evento, ['tel' => $conv['tel'] ?? '', 'tipo' => $tipo, 'msg' => mb_substr((string)$texto, 0, 90)]);
        $d['accion'] = 'cotizar';
        $d['tipo_web'] = $tipoWeb[$tipo];
        $d['segunda_web'] = $segunda ? $tipoWeb[$segunda] : 'sin_definir';
        $d['mensajes'] = [];   // las info_claves quedan: las que no son del precio salen antes
        return $d;
    };
    $propio = function () use ($texto) {
        $r = wabot_fallback_rubro_local(wabot_normalizar_frase((string)$texto));
        return $r === 'cursos' ? 'elearning' : ($r === 'inmobiliaria' ? 'inmobiliaria' : null);
    };
    $negocio = wabot_negocio_conocido($conv) !== false;

    $eleccion = wabot_menu_contestado($texto, $conv, $cfg);
    if (in_array($eleccion, ['landing', 'ecommerce', 'dos'], true)) {
        $conv['menu_eligio'] = true;
        if (!$negocio) {
            $conv['tipo_pendiente'] = $eleccion === 'dos' ? 'landing' : $eleccion;
            if ($eleccion === 'dos') $conv['tipo_pendiente_2'] = 'ecommerce';
            else unset($conv['tipo_pendiente_2']);
        } elseif ($d['accion'] === 'responder') {
            if ($eleccion === 'dos') return $cotizar($d, 'landing', 'ecommerce', 'ia_menu_corregido');
            return $cotizar($d, $propio() ?? $eleccion, null, 'ia_menu_corregido');
        }
        return $d;
    }

    $pendiente = (string)($conv['tipo_pendiente'] ?? '');
    if ($pendiente !== '' && isset($tipoWeb[$pendiente]) && $negocio && $d['accion'] === 'responder'
        && empty($conv['precio_dado']) && !wabot_mensaje_pregunta_algo($texto)) {
        $segunda = (string)($conv['tipo_pendiente_2'] ?? '');
        return $cotizar($d, $propio() ?? $pendiente, isset($tipoWeb[$segunda]) ? $segunda : null, 'ia_pendiente_corregido');
    }

    if ($d['accion'] === 'responder' && $negocio && wabot_pide_que_elijamos($texto)) {
        $recomendado = wabot_tipo_recomendado($conv);
        if (isset($tipoWeb[$recomendado])) return $cotizar($d, $recomendado, null, 'ia_recomendacion_corregida');
    }
    return $d;
}

/* ─────────────────────────────── Modo shadow ─────────────────────────────── */

function wabot_ia_sombra_dir() {
    return (string)($GLOBALS['WABOT_TEST_IA_SOMBRA_DIR'] ?? (WABOT_DATA . '/ia-sombra'));
}

/**
 * Lo que OpenAI habría hecho con el mismo turno que contestó Gemini. Se aplica
 * sobre una COPIA de la charla (nada se guarda ni se manda) para ver los
 * mensajes exactos que habrían salido, precio fijo incluido.
 * $enviado = lo que de verdad recibió el cliente.
 */
function wabot_ia_sombra_ejecutar($pendiente, $enviado, $cfg) {
    $conv = $pendiente['conv'];
    $clave = (string)wabot_conversation_key($conv);
    $r = wabot_ia_pensar($pendiente['texto'], $conv, $cfg, 'sombra');
    $fila = [
        'ts' => date('c'), 'conv' => $clave, 'nombre' => (string)($conv['nombre'] ?? ''), 'canal' => wabot_canal($conv),
        'fase' => (string)($conv['fase'] ?? ''), 'cliente' => mb_substr((string)$pendiente['texto'], 0, 2000),
        'gemini' => array_values(array_map('strval', (array)$enviado)),
        'openai' => null, 'error' => null, 'modelo' => wabot_openai_modelo($cfg), 'costo_usd' => round((float)($r['gastado']['costo_usd'] ?? 0), 6),
    ];
    if (!$r['ok']) {
        $fila['error'] = (string)$r['error'];
    } else {
        $d = $r['decision'];
        $copia = $conv;
        $d = wabot_ia_redes($d, $pendiente['texto'], $copia, $cfg);
        $salida = wabot_ia_aplicar($d, $pendiente['texto'], $copia, $cfg);
        $mensajes = $salida === null ? null : wabot_salida_preparar($salida, $copia, $cfg);
        $fila['openai'] = [
            'accion' => $d['accion'], 'tipo_web' => $d['tipo_web'], 'etapa' => $d['etapa'], 'requiere_humano' => $d['requiere_humano'],
            'motivo' => $d['motivo'], 'info_claves' => $d['info_claves'], 'ficha' => $d['ficha'], 'corregida' => !empty($r['corregida']),
            'enviaria' => $mensajes === null ? null : array_values(array_map(function ($m) use ($copia) {
                return wabot_respuesta_texto_transcript(wabot_personalizar((string)$m, $copia));
            }, $mensajes)),
            'segundos' => $r['segundos'] ?? null,
        ];
    }
    $dir = wabot_ia_sombra_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/' . date('Y-m-d') . '.jsonl', json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    return $fila;
}

/** Las últimas comparaciones, de la más nueva a la más vieja. */
function wabot_ia_sombra_leer($dias = 7, $max = 200) {
    $filas = [];
    for ($i = 0; $i < max(1, (int)$dias) && count($filas) < $max; $i++) {
        $archivo = wabot_ia_sombra_dir() . '/' . date('Y-m-d', strtotime("-$i day")) . '.jsonl';
        $lineas = @file($archivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach (array_reverse($lineas) as $l) {
            $f = json_decode($l, true);
            if (is_array($f)) $filas[] = $f;
            if (count($filas) >= $max) break;
        }
    }
    return $filas;
}
