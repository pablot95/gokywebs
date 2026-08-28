<?php
/**
 * wabot/push.php — notificaciones push de los mensajes que tiene que contestar
 * Pablo (los "SL" del panel: sin leer y con el bot ya callado).
 *
 * Pablo, 28-ago: "quiero notificaciones para cuando llega un mensaje en wabot
 * que tengo que responder yo". Le llegan al celular y a la compu aunque el
 * panel esté cerrado, porque van por Firebase Cloud Messaging.
 *
 * Se usa la API HTTP v1 de FCM, que pide un access token de OAuth2 firmado con
 * la cuenta de servicio del proyecto (las server keys viejas las dio de baja
 * Google). El JWT se firma con openssl, sin librerías.
 *
 * Hace falta, del lado de Pablo:
 *   1. config/service-account.json    (la cuenta de servicio de Firebase)
 *   2. define('WABOT_FCM_VAPID', ...) en config/wabot-config.php
 *      Firebase → Configuración del proyecto → Cloud Messaging → Certificados
 *      push web → "Generar par de claves". Esa clave pública va acá.
 * Sin alguna de las dos, todo esto se queda callado y el bot sigue igual.
 */

require_once __DIR__ . '/lib.php';

define('WABOT_PUSH_TOKENS',  WABOT_DATA . '/push-tokens.json');
define('WABOT_PUSH_OAUTH',   WABOT_DATA . '/fcm-oauth.json');
/* Un cliente que manda cinco mensajes seguidos es UNA notificación, no cinco.
   Igual que la tanda que junta el bot antes de contestar. */
define('WABOT_PUSH_ESPACIADO', 120);

/**
 * La cuenta de servicio de Firebase. Vive en config/ —que el .htaccess bloquea
 * entera— y no en el repo: es una credencial.
 */
function wabot_push_cuenta() {
    static $cache = false;
    if ($cache !== false) return $cache;
    foreach ([__DIR__ . '/../config/service-account.json', __DIR__ . '/../service-account.json'] as $ruta) {
        if (!is_file($ruta)) continue;
        $d = json_decode((string)@file_get_contents($ruta), true);
        if (is_array($d) && !empty($d['client_email']) && !empty($d['private_key'])) {
            return $cache = $d;
        }
    }
    return $cache = null;
}

/** ¿Está todo lo que hace falta para mandar? */
function wabot_push_configurado() {
    return wabot_push_cuenta() !== null;
}

/** La clave pública VAPID que necesita el navegador para suscribirse. */
function wabot_push_vapid() {
    return defined('WABOT_FCM_VAPID') ? trim((string)WABOT_FCM_VAPID) : '';
}

/**
 * Un access token de Google, firmando un JWT con la clave de la cuenta de
 * servicio. Dura una hora y se cachea: pedir uno por notificación sería
 * gastar un viaje de red por mensaje.
 */
function wabot_push_access_token() {
    $guardado = json_decode((string)@file_get_contents(WABOT_PUSH_OAUTH), true);
    if (is_array($guardado) && !empty($guardado['token']) && (int)($guardado['vence'] ?? 0) > time() + 60) {
        return (string)$guardado['token'];
    }

    $sa = wabot_push_cuenta();
    if (!$sa) return '';

    $b64 = function ($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); };
    $ahora = time();
    $cabecera = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $cuerpo   = $b64(json_encode([
        'iss'   => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $ahora,
        'exp'   => $ahora + 3600,
    ]));
    $firma = '';
    if (!@openssl_sign($cabecera . '.' . $cuerpo, $firma, $sa['private_key'], 'sha256WithRSAEncryption')) {
        wabot_log('error', ['donde' => 'push_jwt', 'msg' => 'no se pudo firmar']);
        return '';
    }
    $jwt = $cabecera . '.' . $cuerpo . '.' . $b64($firma);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    ]);
    $res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    $d = json_decode((string)$res, true);
    if ($code < 200 || $code >= 300 || empty($d['access_token'])) {
        wabot_log('error', ['donde' => 'push_oauth', 'http' => $code]);
        return '';
    }
    wabot_json_guardar_atomico(WABOT_PUSH_OAUTH, json_encode([
        'token' => $d['access_token'],
        'vence' => time() + (int)($d['expires_in'] ?? 3600),
    ]));
    return (string)$d['access_token'];
}

/* ── Los dispositivos de Pablo ────────────────────────────────────────── */

function wabot_push_tokens() {
    $d = json_decode((string)@file_get_contents(WABOT_PUSH_TOKENS), true);
    return is_array($d) ? $d : [];
}

/** Alta o refresco de un dispositivo. El token lo da el navegador. */
function wabot_push_token_guardar($token, $agente = '') {
    $token = trim((string)$token);
    if ($token === '' || strlen($token) > 400) return false;
    wabot_ensure_dirs();
    $todos = wabot_push_tokens();
    $todos[$token] = ['ts' => time(), 'agente' => mb_substr((string)$agente, 0, 120)];
    // Un dispositivo que no se usa en tres meses ya no existe.
    foreach ($todos as $t => $meta) {
        if ((int)($meta['ts'] ?? 0) < time() - 90 * 86400) unset($todos[$t]);
    }
    return wabot_json_guardar_atomico(WABOT_PUSH_TOKENS, json_encode($todos));
}

function wabot_push_token_borrar($token) {
    $todos = wabot_push_tokens();
    if (!isset($todos[$token])) return;
    unset($todos[$token]);
    wabot_json_guardar_atomico(WABOT_PUSH_TOKENS, json_encode($todos));
}

/* ── El envío ─────────────────────────────────────────────────────────── */

/**
 * Manda la notificación a todos los dispositivos registrados. Los que Google
 * rechaza por token inválido se borran solos: un celular formateado no tiene
 * que hacer fallar los envíos para siempre.
 *
 * Devuelve a cuántos dispositivos llegó.
 */
function wabot_push_enviar($titulo, $cuerpo, $datos = []) {
    $sa = wabot_push_cuenta();
    $tokens = wabot_push_tokens();
    if (!$sa || !$tokens) return 0;

    $access = wabot_push_access_token();
    if ($access === '') return 0;

    $url = 'https://fcm.googleapis.com/v1/projects/' . rawurlencode((string)$sa['project_id']) . '/messages:send';
    $enviados = 0;

    foreach (array_keys($tokens) as $token) {
        $mensaje = [
            'message' => [
                'token' => $token,
                'notification' => ['title' => (string)$titulo, 'body' => (string)$cuerpo],
                // Los datos viajan como strings sí o sí: FCM rechaza el resto.
                'data' => array_map('strval', $datos),
                'webpush' => [
                    'notification' => [
                        'icon'  => 'https://www.gokywebs.com/logo.png',
                        'badge' => 'https://www.gokywebs.com/logo.png',
                        // Mismo tag = la notificación nueva reemplaza a la vieja
                        // del mismo chat en vez de apilar diez.
                        'tag'   => 'wabot-' . (string)($datos['tel'] ?? 'sl'),
                        'renotify' => true,
                    ],
                    'fcm_options' => ['link' => (string)($datos['link'] ?? 'https://www.gokywebs.com/wabot/admin.php')],
                ],
            ],
        ];
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($mensaje, JSON_UNESCAPED_UNICODE),
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $access, 'Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
        ]);
        $res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);

        if ($code >= 200 && $code < 300) { $enviados++; continue; }
        // 404 = el token ya no existe; 403 = no es de este proyecto.
        if ($code === 404 || $code === 403) {
            wabot_push_token_borrar($token);
            wabot_log('push_token_baja', ['http' => $code]);
            continue;
        }
        wabot_log('error', ['donde' => 'push_envio', 'http' => $code,
                            'msg' => mb_substr((string)$res, 0, 200)]);
    }
    return $enviados;
}

/* ── Cuándo avisar ────────────────────────────────────────────────────── */

/**
 * Avisa si esta conversación quedó esperando a Pablo. Se llama después de que
 * el bot terminó su turno, con lo que quedó guardado en disco.
 */
function wabot_push_si_sl($cv, $cfg = null) {
    if (!wabot_push_configurado()) return false;
    if (!is_array($cv) || !wabot_conv_es_sl($cv)) return false;

    // Una ráfaga de mensajes es una sola notificación.
    $ultimo = (int)($cv['push_sl_ts'] ?? 0);
    if (time() - $ultimo < WABOT_PUSH_ESPACIADO) return false;

    $quien = trim((string)($cv['nombre_agenda'] ?? ''));
    if ($quien === '') $quien = trim((string)($cv['nombre_negocio'] ?? ''));
    if ($quien === '') $quien = trim((string)($cv['nombre'] ?? ''));
    if ($quien === '') {
        $quien = (($cv['canal'] ?? '') === 'instagram' ? 'Instagram · ' : '+')
               . (string)($cv['channel_user_id'] ?? $cv['tel'] ?? '');
    }

    $ultimoTexto = '';
    foreach (array_reverse((array)($cv['transcript'] ?? [])) as $linea) {
        if (($linea['q'] ?? '') !== 'cliente') continue;
        $ultimoTexto = trim((string)($linea['t'] ?? ''));
        break;
    }
    if ($ultimoTexto === '') $ultimoTexto = 'Te escribió y espera respuesta.';
    $ultimoTexto = mb_substr(preg_replace('/\s+/u', ' ', $ultimoTexto), 0, 140);

    $sinLeer = wabot_conv_sin_leer_cuenta($cv);
    $titulo  = $sinLeer > 1 ? "$quien · $sinLeer sin leer" : $quien;
    $clave   = (string)($cv['conversation_key'] ?? $cv['tel'] ?? '');

    $ok = wabot_push_enviar($titulo, $ultimoTexto, [
        'tel'   => $clave,
        'grupo' => wabot_conv_grupo($cv),
        'link'  => 'https://www.gokywebs.com/wabot/admin.php?chat=' . rawurlencode($clave),
    ]);
    if ($ok > 0) {
        // El sello se guarda aparte, sin pisar lo que el turno haya escrito.
        $fresca = wabot_conv_load($clave);
        $fresca['push_sl_ts'] = time();
        wabot_conv_save($fresca);
        wabot_log('push_sl', ['tel' => $clave, 'dispositivos' => $ok]);
    }
    return $ok > 0;
}
