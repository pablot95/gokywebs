<?php
/**
 * Cron de Hostinger: cada prospecto nuevo de Firestore manda su «Copiar 10»
 * por correo, para que una tarea de ChatGPT Work activada por Gmail lo procese.
 * Solo CLI. La primera ejecución recupera los prospectos desde el inicio acordado.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/push.php';
require_once __DIR__ . '/prospecto-chatgpt.php';

const PROSPECTO_CHATGPT_ESTADO = WABOT_DATA . '/prospectos-chatgpt-estado.json';
const PROSPECTO_CHATGPT_OAUTH = WABOT_DATA . '/prospectos-chatgpt-oauth.json';
const PROSPECTO_CHATGPT_DESDE = '2026-10-16T03:45:00Z';

function prospecto_chatgpt_access_token(): string {
    $cache = json_decode((string)@file_get_contents(PROSPECTO_CHATGPT_OAUTH), true);
    if (is_array($cache) && !empty($cache['token']) && (int)($cache['vence'] ?? 0) > time() + 60) {
        return (string)$cache['token'];
    }
    $sa = wabot_push_cuenta();
    if (!$sa) throw new RuntimeException('Falta config/service-account.json en el servidor.');
    $b64 = fn($s) => rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
    $ahora = time();
    $cabecera = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $cuerpo = $b64(json_encode([
        'iss' => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/datastore',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $ahora,
        'exp' => $ahora + 3600,
    ]));
    if (!openssl_sign($cabecera . '.' . $cuerpo, $firma, $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('No se pudo firmar el token de Firestore.');
    }
    $jwt = $cabecera . '.' . $cuerpo . '.' . $b64($firma);
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $datos = json_decode((string)$res, true);
    if ($http !== 200 || empty($datos['access_token'])) {
        throw new RuntimeException('No se pudo autenticar con Google (HTTP ' . $http . ').');
    }
    $token = (string)$datos['access_token'];
    if (!wabot_json_guardar_atomico(PROSPECTO_CHATGPT_OAUTH, [
        'token' => $token, 'vence' => $ahora + (int)($datos['expires_in'] ?? 3600),
    ])) throw new RuntimeException('No se pudo guardar el token temporal.');
    return $token;
}

function prospecto_chatgpt_firestore_valor(array $valor) {
    foreach (['stringValue', 'timestampValue', 'referenceValue'] as $tipo) {
        if (array_key_exists($tipo, $valor)) return $valor[$tipo];
    }
    foreach (['integerValue', 'doubleValue'] as $tipo) {
        if (array_key_exists($tipo, $valor)) return (float)$valor[$tipo];
    }
    if (array_key_exists('booleanValue', $valor)) return (bool)$valor['booleanValue'];
    if (isset($valor['arrayValue'])) {
        return array_map('prospecto_chatgpt_firestore_valor', $valor['arrayValue']['values'] ?? []);
    }
    if (isset($valor['mapValue'])) {
        return array_map('prospecto_chatgpt_firestore_valor', $valor['mapValue']['fields'] ?? []);
    }
    return null;
}

function prospecto_chatgpt_nuevos(string $desde): array {
    $sa = wabot_push_cuenta();
    $url = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id'])
        . '/databases/(default)/documents:runQuery';
    $consulta = ['structuredQuery' => [
        'from' => [['collectionId' => 'propuestas']],
        'where' => ['fieldFilter' => [
            'field' => ['fieldPath' => 'createdAt'],
            'op' => 'GREATER_THAN_OR_EQUAL',
            'value' => ['timestampValue' => $desde],
        ]],
        'orderBy' => [['field' => ['fieldPath' => 'createdAt'], 'direction' => 'ASCENDING']],
    ]];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($consulta),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . prospecto_chatgpt_access_token(),
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas = json_decode((string)$res, true))) {
        throw new RuntimeException('No se pudo consultar Firestore (HTTP ' . $http . ').');
    }
    $docs = [];
    foreach ($filas as $fila) {
        if (empty($fila['document']['name'])) continue;
        $doc = $fila['document'];
        $id = basename($doc['name']);
        $campos = array_map('prospecto_chatgpt_firestore_valor', $doc['fields'] ?? []);
        $docs[$id] = $campos;
    }
    return $docs;
}

function prospecto_chatgpt_enviar(string $id, array $prospecto): bool {
    $destino = defined('GOKY_PROSPECTO_MAIL_TO') ? trim((string)GOKY_PROSPECTO_MAIL_TO) : 'gokywebs@gmail.com';
    $remitente = defined('GOKY_PROSPECTO_MAIL_FROM') ? trim((string)GOKY_PROSPECTO_MAIL_FROM) : 'no-reply@gokywebs.com';
    if (!filter_var($destino, FILTER_VALIDATE_EMAIL) || !filter_var($remitente, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('El correo de destino o remitente no es válido.');
    }
    $asunto = PROSPECTO_CHATGPT_ASUNTO . ' | ' . $id;
    // En base64: el chat trae líneas de más de 998 caracteres (el tope de SMTP)
    // y con 8bit el servidor de correo las corta o rebota el mail.
    $encabezados = [
        'From: Gokywebs <' . $remitente . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];
    $cuerpo = chunk_split(base64_encode(prospecto_chatgpt_prompt($prospecto)));
    return @mail($destino, $asunto, $cuerpo, implode("\r\n", $encabezados));
}

function prospecto_chatgpt_cron(): void {
    wabot_ensure_dirs();
    $lock = fopen(WABOT_DATA . '/prospectos-chatgpt.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) return;
    try {
        $estado = json_decode((string)@file_get_contents(PROSPECTO_CHATGPT_ESTADO), true);
        if (!is_array($estado) || empty($estado['inicio'])) {
            $inicio = PROSPECTO_CHATGPT_DESDE;
            if (!wabot_json_guardar_atomico(PROSPECTO_CHATGPT_ESTADO, [
                'inicio' => $inicio, 'ultimo' => $inicio, 'enviados' => [],
            ])) throw new RuntimeException('No se pudo guardar el inicio del monitoreo.');
            $estado = ['inicio' => $inicio, 'ultimo' => $inicio, 'enviados' => []];
            echo "Monitoreo iniciado desde {$inicio}.\n";
        }
        $ahora = gmdate('Y-m-d\TH:i:s\Z');
        $ultimo = strtotime((string)($estado['ultimo'] ?? $estado['inicio']));
        $inicio = strtotime((string)$estado['inicio']);
        $desde = gmdate('Y-m-d\TH:i:s\Z', max($inicio, $ultimo - 60));
        $docs = prospecto_chatgpt_nuevos($desde);
        $enviados = is_array($estado['enviados'] ?? null) ? $estado['enviados'] : [];
        $fallo = false;
        foreach ($docs as $id => $p) {
            if (isset($enviados[$id])) continue;
            if (strtotime((string)($p['createdAt'] ?? '')) < $inicio) continue;
            if (!prospecto_chatgpt_enviar($id, $p)) {
                $fallo = true;
                wabot_log('error', ['donde' => 'prospecto_chatgpt_mail', 'id' => $id]);
                continue;
            }
            $enviados[$id] = $ahora;
            if (!wabot_json_guardar_atomico(PROSPECTO_CHATGPT_ESTADO, [
                'inicio' => $estado['inicio'], 'ultimo' => $estado['ultimo'], 'enviados' => $enviados,
            ])) throw new RuntimeException('No se pudo guardar el envío del prospecto ' . $id);
            echo "Correo aceptado por el servidor: {$id}\n";
        }
        if (!$fallo && !wabot_json_guardar_atomico(PROSPECTO_CHATGPT_ESTADO, [
            'inicio' => $estado['inicio'], 'ultimo' => $ahora, 'enviados' => $enviados,
        ])) throw new RuntimeException('No se pudo guardar el avance del monitoreo.');
        if ($fallo) throw new RuntimeException('Algunos correos no fueron aceptados; se reintentará en el próximo ciclo.');
    } catch (Throwable $e) {
        // Desde facturar-cobros.php el error solo se imprime en la salida del
        // cron, que Hostinger pisa en cada corrida: queda también en el log.
        wabot_log('error', ['donde' => 'prospecto_chatgpt_cron', 'msg' => $e->getMessage()]);
        throw $e;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    try {
        if (in_array('--check', $argv ?? [], true)) {
            $docs = prospecto_chatgpt_nuevos(gmdate('Y-m-d\TH:i:s\Z', time() - 60));
            echo 'Firestore accesible; prospectos del último minuto: ' . count($docs) . "\n";
        } else {
            prospecto_chatgpt_cron();
        }
    } catch (Throwable $e) {
        fwrite(STDERR, $e->getMessage() . "\n");
        exit(1);
    }
}
