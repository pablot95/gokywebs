<?php
/**
 * wabot/push.php — notificaciones push al celular de Pablo cuando entra un
 * mensaje que el bot no contestó.
 *
 * Pablo, 24-sep: "que suene cada mensaje que entra que NO esté contestando el
 * bot". Ya no es solo el SL del 28-ago (demo entregada, derivado): también
 * suena con el bot apagado o pausado, cuando el bot eligió callarse, y cuando
 * su respuesta no salió. Si el bot contestó, no suena: eso lo resolvió él.
 *
 * Va por Firebase Cloud Messaging (gratis en el plan Spark) con la API HTTP v1,
 * que pide un access token de OAuth2 firmado con la cuenta de servicio (las
 * server keys viejas las dio de baja Google). El JWT se firma con openssl, sin
 * librerías.
 *
 * Hace falta, del lado de Pablo:
 *   1. config/service-account.json    (la cuenta de servicio de Firebase)
 *   2. La clave pública VAPID (Firebase → Configuración del proyecto → Cloud
 *      Messaging → Certificados push web). Ya está abajo, en
 *      WABOT_PUSH_VAPID_PROYECTO; WABOT_FCM_VAPID en la config la pisa.
 *   3. Tocar "Activar acá" en la pestaña Estado del panel, una vez por
 *      dispositivo.
 * Sin alguna de esas cosas, todo esto se queda callado y el bot sigue igual.
 */

require_once __DIR__ . '/lib.php';

define('WABOT_PUSH_TOKENS', WABOT_DATA . '/push-tokens.json');
define('WABOT_PUSH_OAUTH',  WABOT_DATA . '/fcm-oauth.json');

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
        if (is_array($d) && !empty($d['client_email']) && !empty($d['private_key']) && !empty($d['project_id'])) {
            return $cache = $d;
        }
    }
    return $cache = null;
}

/** ¿Está todo lo que hace falta del lado del server para mandar? */
function wabot_push_configurado() {
    return wabot_push_cuenta() !== null;
}

/**
 * La clave pública VAPID que necesita el navegador para suscribirse. Es
 * pública de verdad —termina impresa en el JS del panel—, así que la del
 * proyecto va acá como valor por defecto y viaja con el deploy; la config del
 * server solo la pisa si alguna vez se regenera el par en Firebase.
 */
define('WABOT_PUSH_VAPID_PROYECTO', 'BPnob8uWfrcW3oXPUTNydqpEJ2bQ-BovevwrTgwJ7feb5TuSComH7CwYAs3RwKxXRKLUknmm4b-cEXEIHbzf7wM');

function wabot_push_vapid() {
    $config = defined('WABOT_FCM_VAPID') ? trim((string)WABOT_FCM_VAPID) : '';
    return $config !== '' ? $config : WABOT_PUSH_VAPID_PROYECTO;
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
        wabot_log('error', ['donde' => 'push_oauth', 'http' => $code, 'msg' => mb_substr((string)$res, 0, 200)]);
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
    // Un dispositivo que no abre el panel en tres meses ya no existe.
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
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED'])) return 0;

    $access = wabot_push_access_token();
    if ($access === '') return 0;

    $url = 'https://fcm.googleapis.com/v1/projects/' . rawurlencode((string)$sa['project_id']) . '/messages:send';
    $link = (string)($datos['link'] ?? 'https://www.gokywebs.com/wabot/admin.php');
    $datos['link'] = $link;
    $enviados = 0;

    foreach (array_keys($tokens) as $token) {
        $mensaje = [
            'message' => [
                'token' => $token,
                'notification' => ['title' => (string)$titulo, 'body' => (string)$cuerpo],
                // Los datos viajan como strings sí o sí: FCM rechaza el resto.
                'data' => array_map('strval', $datos),
                'webpush' => [
                    // Que la entregue ya aunque el celular esté en ahorro de batería.
                    'headers' => ['Urgency' => 'high', 'TTL' => '86400'],
                    'notification' => [
                        'icon'  => 'https://www.gokywebs.com/logo.png',
                        // Mismo tag = el mensaje nuevo del mismo chat reemplaza
                        // al anterior en la barra en vez de apilar diez, pero
                        // renotify hace que vuelva a sonar igual.
                        'tag'   => 'wabot-' . (string)($datos['tel'] ?? 'msg'),
                        'renotify' => true,
                    ],
                    'fcm_options' => ['link' => $link],
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
 * ¿Esta conversación quedó con un mensaje del cliente sin contestar? Se mira el
 * estado FINAL del turno, así que cubre de una todos los caminos donde el bot
 * no habla: apagado global o del chat, pausa por respuesta humana, derivado,
 * el bot que eligió callarse, un archivo que no pudo leer, o una respuesta que
 * Meta rechazó. Si el bot contestó, el último mensaje es suyo y no suena.
 *
 * Archivado no suena (Pablo lo sacó de la vista a mano; si el cliente escribe
 * se desarchiva solo, ver wabot_conv_transcript). "Ya le contesté" marcado
 * desde el panel tampoco, mientras el chat no se mueva.
 */
function wabot_push_debe_avisar($cv) {
    if (!is_array($cv) || empty($cv['transcript'])) return false;
    if (wabot_conv_grupo($cv) === 'archivado') return false;
    if (wabot_conv_contestada($cv)) return false;
    $lineas = (array)$cv['transcript'];
    $ult = end($lineas);
    return is_array($ult) && ($ult['q'] ?? '') === 'cliente';
}

/** Cómo se llama en la notificación: agenda, negocio, nombre o el número. */
function wabot_push_quien($cv) {
    foreach (['nombre_agenda', 'nombre_negocio', 'nombre'] as $campo) {
        $v = trim((string)($cv[$campo] ?? ''));
        if ($v !== '') return $v;
    }
    return (($cv['canal'] ?? '') === 'instagram' ? 'Instagram · ' : '+')
         . (string)($cv['channel_user_id'] ?? $cv['tel'] ?? '');
}

/**
 * Avisa si esta conversación quedó esperando a Pablo. Se llama cuando el
 * webhook terminó su turno, con lo que quedó guardado en disco.
 *
 * No hay espaciado entre avisos: una ráfaga que entra junta la procesa un solo
 * webhook (el que tiene el candado), así que ya llega como UNA notificación;
 * un mensaje que llega más tarde es otro aviso, que es lo que pidió Pablo.
 */
function wabot_push_avisar_si_corresponde($cv) {
    if (!wabot_push_configurado() || !wabot_push_debe_avisar($cv)) return false;

    // Todos los mensajes del cliente desde lo último que se le contestó.
    $pendientes = [];
    foreach (array_reverse((array)$cv['transcript']) as $linea) {
        if (($linea['q'] ?? '') !== 'cliente') break;
        $t = trim(preg_replace('/\s+/u', ' ', (string)($linea['t'] ?? '')));
        if ($t !== '') array_unshift($pendientes, $t);
    }
    $cuerpo = $pendientes ? implode(' · ', $pendientes) : 'Te escribió y espera respuesta.';
    if (mb_strlen($cuerpo) > 160) $cuerpo = '…' . mb_substr($cuerpo, -159);

    $quien  = wabot_push_quien($cv);
    $titulo = count($pendientes) > 1 ? $quien . ' · ' . count($pendientes) . ' mensajes' : $quien;
    $clave  = (string)($cv['conversation_key'] ?? $cv['tel'] ?? '');

    $ok = wabot_push_enviar($titulo, $cuerpo, [
        'tel'  => $clave,
        'link' => 'https://www.gokywebs.com/wabot/admin.php?tab=conversaciones&ver=' . rawurlencode($clave),
    ]);
    if ($ok > 0) wabot_log('push', ['tel' => $clave, 'dispositivos' => $ok]);
    return $ok > 0;
}
