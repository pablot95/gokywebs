<?php
require_once __DIR__ . '/redactor.php';

/* ── Paso 2 del formulario (10-sep) ───────────────────────────────────────────
 * Estilo de página, web de referencia y lo que quiere incluir sí o sí. Son
 * opcionales y wabot_form_lead_procesar() (lib.php) no los conoce: los ignora.
 * Acá se validan con el mismo criterio que los campos de siempre (trim y tope
 * de largo; si se pasa, datos_invalidos con el campo y el máximo, así el
 * formulario marca el que corresponde) y se guardan en la charla ANTES de
 * procesar, con el mismo candado, así el boceto se crea con ellos adentro:
 *   - referencia → $conv['referencia'], la clave que ya usaba el chat;
 *                  wabot_lead_campos() ya la manda a Firestore (`referencias`).
 *   - estilo     → $conv['estilo']
 *   - incluir    → $conv['incluir']
 * Además queda una línea "[Formulario web, paso 2] ..." en el transcript, para
 * verlo en el panel. */

/* La misma lista que el <select id="estilo"> de form/index.html: si se suma un
 * estilo allá, va también acá. Lo que no está en la lista se guarda vacío. */
function formlead_estilos() {
    return ['Minimalista', 'Moderno y audaz', 'Elegante / premium', 'Cálido y cercano',
            'Colorido y divertido', 'Corporativo / sobrio', 'No lo sé'];
}

/**
 * Los campos del paso 2 que vinieron, limpios. null (con $motivo) si alguno se
 * pasa del tope. El formulario viejo que quedó en caché no los manda: el campo
 * que no viene no aparece en el resultado y la charla no se toca.
 */
function formlead_extras($payload, &$motivo = null) {
    $motivo = null;
    $extras = [];
    foreach (['estilo' => 40, 'referencia' => 300, 'incluir' => 600] as $campo => $max) {
        if (!array_key_exists($campo, $payload)) continue;
        $valor = is_scalar($payload[$campo]) ? trim((string)$payload[$campo]) : '';
        if (mb_strlen($valor) > $max) {
            $motivo = ['motivo' => 'largo', 'campo' => $campo, 'max' => $max];
            return null;
        }
        $extras[$campo] = $valor;
    }
    if (isset($extras['estilo']) && !in_array($extras['estilo'], formlead_estilos(), true)) {
        $extras['estilo'] = '';
    }
    // "No tengo", "ya te la pasé": no es una referencia (mismo criterio que el chat).
    if (isset($extras['referencia']) && function_exists('wabot_referencia_utilizable')
        && !wabot_referencia_utilizable($extras['referencia'])) {
        $extras['referencia'] = '';
    }
    return $extras;
}

/**
 * Guarda el paso 2 en la charla con las mismas reglas que
 * wabot_form_lead_procesar(): con el código del link, actualiza; sin código,
 * solo completa lo que falta, y si la ficha ya tenía formulario no aplica nada
 * (queda anotado en el transcript). false = la charla estaba ocupada.
 */
function formlead_extras_guardar($base, $extras) {
    $clave = preg_replace('/[^0-9A-Za-z]/', '', (string)($base['clave'] ?? ''));
    if ($clave === '') return true;

    $lock = null;
    for ($intento = 0; $intento < 6; $intento++) {
        $lock = wabot_lock_tomar($clave);
        if ($lock !== null) break;
        usleep(500000);
    }
    if ($lock === null) return false;

    $conv = wabot_conv_load($clave);
    $conCodigo = !empty($base['conCodigo']);
    $huboChatReal = wabot_ultimo_cliente_ts($conv) > 0;
    $aplicar = $conCodigo || !$huboChatReal || empty($conv['form_completado_ts']);
    $soloCompletar = !$conCodigo && $huboChatReal;

    if ($aplicar) {
        foreach ($extras as $campo => $valor) {
            if ($valor === '') continue;   // vacío no borra lo que ya se sabía
            if ($soloCompletar && trim((string)($conv[$campo] ?? '')) !== '') continue;
            $conv[$campo] = $valor;
        }
        // El formulario ya se la preguntó: el chat no se la vuelve a pedir.
        if (array_key_exists('referencia', $extras)) $conv['referencia_preguntada'] = true;
    }

    $partes = [];
    if (($extras['estilo'] ?? '') !== '')     $partes[] = 'Estilo: ' . $extras['estilo'];
    if (($extras['referencia'] ?? '') !== '') $partes[] = 'Referencia: ' . $extras['referencia'];
    if (($extras['incluir'] ?? '') !== '')    $partes[] = 'Incluir sí o sí: ' . $extras['incluir'];
    if ($partes) {
        $linea = ($aplicar ? '[Formulario web, paso 2] ' : '[Formulario web, paso 2, sin código — NO aplicado] ')
               . implode(' · ', $partes);
        // Un reintento (charla ocupada) trae lo mismo: no se anota dos veces.
        $yaAnotada = false;
        foreach (array_slice((array)($conv['transcript'] ?? []), -15) as $fila) {
            if (($fila['q'] ?? '') === 'sistema' && ($fila['t'] ?? '') === $linea) { $yaAnotada = true; break; }
        }
        if (!$yaAnotada) wabot_conv_transcript($conv, 'sistema', $linea);
    }

    wabot_conv_save($conv);
    wabot_lock_soltar($lock);
    wabot_log('form_lead_paso2', ['tel' => $clave, 'aplicado' => $aplicar,
        'campos' => array_keys(array_filter($extras, function ($v) { return $v !== ''; }))]);
    return true;
}

header('Access-Control-Allow-Origin: https://gokywebs.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
// 8000 y no 4000 desde el paso 2 (10-sep): la referencia y "incluir sí o sí"
// suman hasta 900 caracteres más, y con tildes o emojis cada uno pesa más de un byte.
if ($raw === false || strlen($raw) > 8000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'body_invalido']);
    exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'json_invalido']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Freno por IP: el endpoint es público y sin esto se podía martillar.
// Detrás del proxy de Cloudflare REMOTE_ADDR es la IP del borde, compartida
// por todos los visitantes: la real viaja en CF-Connecting-IP (9-sep).
$ipForm = trim((string)($_SERVER['HTTP_CF_CONNECTING_IP'] ?? ''));
if ($ipForm === '') $ipForm = (string)($_SERVER['REMOTE_ADDR'] ?? '');
if (!wabot_form_rate_ok($ipForm)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'demasiados_intentos', 'reintentar' => false]);
    exit;
}

$cfg = wabot_config_load();

/* Paso 2 (ver formlead_extras): primero lo mismo que valida procesar, así un
 * error de esos se sigue contestando igual que siempre, desde procesar; recién
 * con eso en orden, los campos nuevos. Charla ocupada: se pide reintentar,
 * igual que procesar, y el formulario reintenta solo. */
$motivoBase = null;
$base = function_exists('wabot_form_lead_validar') ? wabot_form_lead_validar($payload, $motivoBase) : null;
if ($base !== null) {
    $motivoExtra = null;
    $extras = formlead_extras($payload, $motivoExtra);
    if ($extras === null) {
        http_response_code(400);
        echo json_encode(array_merge(['ok' => false, 'error' => 'datos_invalidos'], $motivoExtra));
        exit;
    }
    if ($extras && !formlead_extras_guardar($base, $extras)) {
        http_response_code(200);
        echo json_encode(['ok' => false, 'error' => 'ocupado', 'reintentar' => true]);
        exit;
    }
}

$res = wabot_form_lead_procesar($payload, $cfg);

if (empty($res['ok']) && !empty($res['reintentar'])) {
    http_response_code(200);
    echo json_encode($res);
    exit;
}
if (empty($res['ok'])) {
    http_response_code(400);
    echo json_encode($res);
    exit;
}

http_response_code(200);
echo json_encode($res);
