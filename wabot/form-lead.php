<?php
require_once __DIR__ . '/redactor.php';

/* ── Paso 2 del formulario (10-sep) ───────────────────────────────────────────
 * Web de referencia y lo que quiere incluir sí o sí. El estilo de página se
 * conserva solo para formularios anteriores que todavía estén en caché.
 * Son opcionales y wabot_form_lead_procesar() (lib.php) no los conoce: los ignora.
 * Acá se validan con el mismo criterio que los campos de siempre (trim y tope
 * de largo; si se pasa, datos_invalidos con el campo y el máximo, así el
 * formulario marca el que corresponde) y se guardan en la charla ANTES de
 * procesar, con el mismo candado, así el boceto se crea con ellos adentro:
 *   - referencia → $conv['referencia'], la clave que ya usaba el chat;
 *                  wabot_lead_campos() ya la manda a Firestore (`referencias`).
 *   - estilo     → $conv['estilo']
 *   - incluir    → $conv['incluir']
 *   - objetivos  → $conv['objetivos'] (27-sep): las casillas de "Qué querés
 *                  lograr con tu web" en un texto ("Generar más ventas,
 *                  Otra: …"), con lo que escribió en objetivo_otro. El
 *                  formulario ya no lo pregunta (2-oct): queda para los que
 *                  estén en caché.
 * Además queda una línea "[Formulario web, paso 2] ..." en el transcript, para
 * verlo en el panel. */

/* Compatibilidad con formularios anteriores que todavía envían estilo.
 * Lo que no está en la lista se guarda vacío. */
function formlead_estilos() {
    return ['Minimalista', 'Moderno y audaz', 'Elegante / premium', 'Cálido y cercano',
            'Colorido y divertido', 'Corporativo / sobrio', 'No lo sé'];
}

/* Las mismas casillas de "Qué querés lograr con tu web" de form/index.html, en
 * el mismo orden: si se suma una allá, va también acá. Lo que no está en la
 * lista se descarta. */
function formlead_objetivos() {
    return ['Generar más ventas', 'Conseguir más clientes', 'Recibir reservas o turnos',
            'Tener una web visualmente atractiva', 'Otra'];
}

/**
 * El usuario de Instagram a partir de lo que escriba el cliente: "@lashojas",
 * "lashojas", "instagram.com/lashojas" o el link entero con ?igsh=. Devuelve
 * el usuario sin @, o '' si no tiene forma de usuario (el lead no se frena).
 */
function formlead_instagram_usuario($texto) {
    $t = trim((string)$texto);
    if (preg_match('~instagram\.com/([A-Za-z0-9._]{1,30})~i', $t, $m)) $t = $m[1];
    $t = ltrim($t, '@ ');
    return preg_match('/^[A-Za-z0-9._]{1,30}$/', $t) && !in_array(strtolower($t), ['p', 'reel', 'reels', 'stories', 'explore'], true) ? $t : '';
}

/**
 * Lo manda al boceto de Firestore, que se crea sin él (wabot_lead_campos no lo
 * conoce): un PATCH del campo `instagram`, que es el que ya lee el admin.
 */
function formlead_instagram_sincronizar($clave) {
    $clave = preg_replace('/[^0-9A-Za-z]/', '', (string)$clave);
    if ($clave === '') return false;
    $conv = wabot_conv_load($clave);
    $usuario = trim((string)($conv['instagram'] ?? ''));
    if ($usuario === '' || empty($conv['lead_creado']) || empty($conv['lead_doc'])) return false;
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED']) || stripos($clave, 'TEST') !== false) return true;
    $url = 'https://firestore.googleapis.com/v1/' . $conv['lead_doc'] . '?key=' . WABOT_FIREBASE_API_KEY
         . '&updateMask.fieldPaths=instagram&updateMask.fieldPaths=updatedAt&currentDocument.exists=true';
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => [
            'instagram' => ['stringValue' => $usuario],
            'updatedAt' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
        ]], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20]);
    $res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if ($code >= 200 && $code < 300) return true;
    if ($code !== 404) wabot_log('error', ['donde' => 'firestore_instagram', 'http' => $code, 'res' => substr((string)$res, 0, 300)]);
    return false;
}

/**
 * Los campos del paso 2 que vinieron, limpios. null (con $motivo) si alguno se
 * pasa del tope. El formulario viejo que quedó en caché no los manda: el campo
 * que no viene no aparece en el resultado y la charla no se toca.
 */
function formlead_extras($payload, &$motivo = null) {
    $motivo = null;
    $extras = [];
    // Incluir hasta 2000 (Pablo, 9-oct; era 600). Mismo tope en form/script.js.
    foreach (['estilo' => 40, 'referencia' => 300, 'incluir' => 2000, 'instagram' => 100] as $campo => $max) {
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
    // Instagram (28-sep), opcional: queda el usuario solo; lo que no lo es, vacío.
    if (isset($extras['instagram'])) $extras['instagram'] = formlead_instagram_usuario($extras['instagram']);
    if (array_key_exists('objetivos', $payload)) {
        /* Llegan como la lista de casillas marcadas. Quedan en el orden del
         * formulario y sin repetir; "Otra" solo cuenta con lo que escribió. No
         * marcar ninguna no frena el envío: el formulario ya lo pide y el lead
         * vale más que la respuesta. */
        $marcados = is_array($payload['objetivos']) ? $payload['objetivos'] : [];
        $otro = is_scalar($payload['objetivo_otro'] ?? null) ? trim((string)$payload['objetivo_otro']) : '';
        $otro = trim((string)preg_replace('/[\s\x00-\x1F\x7F]+/u', ' ', $otro));
        if (mb_strlen($otro) > 120) {
            $motivo = ['motivo' => 'largo', 'campo' => 'objetivo_otro', 'max' => 120];
            return null;
        }
        $lista = [];
        foreach (formlead_objetivos() as $opcion) {
            if (!in_array($opcion, $marcados, true)) continue;
            if ($opcion !== 'Otra') $lista[] = $opcion;
            elseif ($otro !== '') $lista[] = 'Otra: ' . $otro;
        }
        $extras['objetivos'] = implode(', ', $lista);
    }
    // "No tengo", "ya te la pasé": no es una referencia (mismo criterio que el chat).
    if (isset($extras['referencia']) && function_exists('wabot_referencia_utilizable')
        && !wabot_referencia_utilizable($extras['referencia'])) {
        $extras['referencia'] = '';
    }
    if (array_key_exists('modalidad', $payload)) {
        $modalidad = is_string($payload['modalidad']) ? $payload['modalidad'] : '';
        /* 'unico' es el plan anual, 'mensual' el plan mensual y 'propia' el
         * pago único. El formulario principal ya no ofrece el pago único
         * (6-oct): 'propia' llega de /formb o de un formulario en caché. */
        if (!in_array($modalidad, ['unico', 'mensual', 'propia'], true)) {
            $motivo = ['motivo' => 'vacio', 'campo' => 'modalidad']; return null;
        }
        $extras['modalidad_elegida'] = $modalidad;
        // Además de la forma, la marca que el bot ya pone cuando el cliente pide el
        // pago único por chat: con ella la ficha y el precio del boceto lo dicen.
        if ($modalidad === 'propia') $extras['quiere_web_propia'] = true;
    }
    if (array_key_exists('modelos', $payload)) {
        /* Paso 3 (16-sep): llegan como [{id, nombre}]. No hay catálogo del lado
         * del servidor —nuevos.js arma las letras en el navegador—, así que se
         * valida la forma: id de 1 a 3 letras (a, k, ab…), la letra es el id
         * en mayúscula y el nombre es el que vio el cliente, recortado. */
        $lista = $payload['modelos'];
        if (!is_array($lista) || count($lista) < 1 || count($lista) > 2) {
            $motivo = ['motivo' => 'modelos', 'campo' => 'modelos']; return null;
        }
        $nombres = [];
        foreach ($lista as $item) {
            $id = is_array($item) ? ($item['id'] ?? '') : $item;
            $nombre = is_array($item) && is_string($item['nombre'] ?? null) ? trim($item['nombre']) : '';
            if (!is_string($id) || !preg_match('/^[a-z]{1,3}$/', $id) || isset($nombres[$id])) {
                $motivo = ['motivo' => 'modelos', 'campo' => 'modelos']; return null;
            }
            $nombre = mb_substr(preg_replace('/[\x00-\x1F\x7F]/u', '', $nombre), 0, 80);
            $nombres[$id] = ['id' => $id, 'letra' => strtoupper($id), 'nombre' => $nombre];
        }
        $extras['modelos_elegidos'] = array_values($nombres);
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
            if ($soloCompletar && !empty($conv[$campo])) continue;
            $conv[$campo] = $valor;
        }
        // El formulario ya se la preguntó: el chat no se la vuelve a pedir.
        if (array_key_exists('referencia', $extras)) $conv['referencia_preguntada'] = true;
        // Con los modelos ocultos en el form (4-oct) alcanza con la forma de pago.
        if (!empty($extras['modalidad_elegida'])) $conv['esProspecto'] = true;
    }

    $partes = [];
    if (($extras['objetivos'] ?? '') !== '')  $partes[] = 'Quiere lograr: ' . $extras['objetivos'];
    if (($extras['instagram'] ?? '') !== '')  $partes[] = 'Instagram: instagram.com/' . $extras['instagram'];
    if (($extras['estilo'] ?? '') !== '')     $partes[] = 'Estilo: ' . $extras['estilo'];
    if (($extras['referencia'] ?? '') !== '') $partes[] = 'Referencia: ' . $extras['referencia'];
    if (($extras['incluir'] ?? '') !== '')    $partes[] = 'Incluir sí o sí: ' . $extras['incluir'];
    if (($extras['modalidad_elegida'] ?? '') !== '') $partes[] = 'Forma de pago: ' . (['unico' => 'Plan anual', 'propia' => 'Pago único'][$extras['modalidad_elegida']] ?? 'Plan mensual');
    if (!empty($extras['modelos_elegidos'])) $partes[] = 'Modelos: ' . implode(' + ', array_map(function ($m) { return 'Modelo ' . $m['letra'] . ' · ' . $m['nombre'] . ' (carpeta ' . $m['id'] . ')'; }, $extras['modelos_elegidos']));
    elseif (array_key_exists('modalidad_elegida', $extras)) $partes[] = 'Modelos: a elección del diseñador (dos)';
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

    if ($aplicar && !empty($extras['modalidad_elegida'])) wabot_modalidad_sincronizar($conv);
    if ($aplicar && !empty($extras['modelos_elegidos'])) wabot_modelos_sincronizar($conv);
    if ($aplicar && !empty($conv['esProspecto'])) wabot_prospecto_sincronizar($conv);

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
// Con el boceto ya creado, el Instagram que dejó en el formulario (28-sep).
if (!empty($res['ok']) && $base !== null) formlead_instagram_sincronizar($base['clave'] ?? '');

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
