<?php
/**
 * wabot/revision-export.php — lo que necesita la revisión de Claude (Pablo,
 * 1-nov-2026: "4 veces al día revisá vos las conversaciones para ver que no
 * esté cometiendo errores, y solucionalos"). La tarea programada de Claude
 * Desktop «Revisión del bot» lo baja con curl y lo analiza.
 *
 * Devuelve, en texto plano:
 *   1. los hallazgos de la revisión de GPT (revision.php) de la ventana;
 *   2. los errores técnicos del log en la ventana;
 *   3. cada charla con mensajes en las últimas `horas`, en el mismo formato
 *      que «Imprimir chats» del panel (admin.php, imprimir_chats), con una
 *      marca donde empieza lo nuevo.
 *
 * Solo lee. Autoriza un token derivado del access token de Mercado Pago de
 * config/mp-config.php (no viaja en el repo; la PC de Pablo tiene la misma
 * copia, así que la tarea lo calcula igual): HMAC, nunca el token en sí.
 *
 *   GET revision-export.php?t=<token>&horas=6      (horas: 1 a 48)
 */

require_once __DIR__ . '/lib.php';

/** El token de acceso: HMAC del access token de Mercado Pago, o '' si no está. */
function wabot_revision_export_token() {
    if (!defined('MP_ACCESS_TOKEN')) {
        $configMp = __DIR__ . '/../config/mp-config.php';
        if (is_file($configMp)) require_once $configMp;
    }
    if (!defined('MP_ACCESS_TOKEN') || strlen((string)MP_ACCESS_TOKEN) < 20 || strpos((string)MP_ACCESS_TOKEN, 'PEGÁ') === 0) return '';
    return hash_hmac('sha256', 'revision-export', (string)MP_ACCESS_TOKEN);
}

/** Las líneas de un .jsonl del día $fecha cuyo `ts` cae en la ventana. */
function wabot_revision_export_jsonl($ruta, $desde, $hasta) {
    $filas = [];
    if (!is_file($ruta)) return $filas;
    foreach (file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $linea) {
        $f = json_decode($linea, true);
        if (!is_array($f)) continue;
        $ts = is_numeric($f['ts'] ?? null) ? (int)$f['ts'] : (int)strtotime((string)($f['ts'] ?? ''));
        if ($ts >= $desde && $ts < $hasta) $filas[] = $f + ['_ts' => $ts];
    }
    return $filas;
}

function wabot_revision_export_txt($horas, $ahora = null) {
    $ahora = $ahora ?? time();
    $horas = max(1, min(48, (int)$horas));
    $desde = $ahora - $horas * 3600;
    $cfg = wabot_config_load();
    $dias = [];
    for ($t = $desde; $t < $ahora + 86400; $t += 86400) $dias[date('Y-m-d', $t)] = true;
    $dias[date('Y-m-d', $ahora)] = true;

    $salida = [];
    $salida[] = 'Revisión del bot — ventana: ' . date('d/m H:i', $desde) . ' a ' . date('d/m H:i', $ahora) . " (hora Argentina, $horas h)";
    $salida[] = 'Formato de las charlas: [dd/mm HH:MM] Cliente / Bot / Vos (Pablo): texto. «---- nuevo desde acá ----» marca dónde empieza lo de la ventana.';
    $salida[] = '';

    /* 1. Lo que ya marcó la revisión de GPT (revision.php) en la ventana. */
    $hallazgos = [];
    foreach (array_keys($dias) as $dia) {
        foreach (wabot_revision_export_jsonl(WABOT_DATA . '/revision/' . $dia . '.jsonl', $desde, $ahora) as $f) {
            $quien = trim((string)($f['nombre'] ?? '')) ?: (string)($f['clave'] ?? '?');
            if (array_key_exists('ok', $f) && $f['ok'] === null) {
                $hallazgos[] = '[' . date('d/m H:i', $f['_ts']) . "] $quien (" . ($f['clave'] ?? '') . ') — la revisión de GPT falló: ' . mb_substr((string)($f['error'] ?? ''), 0, 160);
                continue;
            }
            foreach ((array)($f['problemas'] ?? []) as $p) {
                $hallazgos[] = '[' . date('d/m H:i', $f['_ts']) . "] $quien (" . ($f['clave'] ?? '') . ') — ' . ($p['tipo'] ?? 'otro') . ' · ' . ($p['gravedad'] ?? 'leve')
                             . ': ' . trim((string)($p['detalle'] ?? ''))
                             . (trim((string)($p['mensaje'] ?? '')) !== '' ? ' | mensaje del bot: «' . trim((string)$p['mensaje']) . '»' : '')
                             . (trim((string)($p['sugerencia'] ?? '')) !== '' ? ' | sugerencia: ' . trim((string)$p['sugerencia']) : '');
            }
        }
    }
    $salida[] = '== Hallazgos de la revisión de GPT en la ventana: ' . count($hallazgos) . ' ==';
    foreach ($hallazgos as $h) $salida[] = $h;
    $salida[] = '';

    /* 2. Errores técnicos del log (OpenAI caído, Meta que rechaza, PHP). */
    $errores = [];
    foreach (array_keys($dias) as $dia) {
        foreach (wabot_revision_export_jsonl(WABOT_DATA . '/log/' . $dia . '.jsonl', $desde, $ahora) as $f) {
            if (($f['tipo'] ?? '') !== 'error') continue;
            unset($f['tipo'], $f['v']);
            $ts = $f['_ts']; unset($f['_ts'], $f['ts']);
            $errores[] = '[' . date('d/m H:i', $ts) . '] ' . mb_substr(json_encode($f, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 0, 300);
        }
    }
    $salida[] = '== Errores técnicos del log en la ventana: ' . count($errores) . ' ==';
    foreach (array_slice($errores, 0, 80) as $e) $salida[] = $e;
    if (count($errores) > 80) $salida[] = '… y ' . (count($errores) - 80) . ' más.';
    $salida[] = '';

    /* 3. Las charlas con mensajes en la ventana, la charla entera. */
    $chats = [];
    foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
        $clave = basename($f, '.json');
        if (stripos($clave, 'TEST') !== false) continue;
        $cv = wabot_conv_load($clave);
        $t = (array)($cv['transcript'] ?? []);
        if (!$t) continue;
        $ult = (int)($t[count($t) - 1]['ts'] ?? 0);
        if ($ult < $desde) continue;   // lo último es viejo: nada nuevo que mirar
        $cv['_ultimo'] = $ult;
        $chats[] = $cv;
    }
    usort($chats, function ($a, $b) { return (int)$a['_ultimo'] - (int)$b['_ultimo']; });

    $salida[] = '== Charlas con mensajes en la ventana: ' . count($chats) . ' ==';
    foreach ($chats as $cv) {
        $nombre = wabot_nombre_agenda($cv) ?: 'Sin nombre';
        $tel    = wabot_canal($cv) === 'instagram' ? ('IG:' . wabot_channel_user_id($cv)) : wabot_formatear_tel($cv['tel'] ?? '');
        $tipo   = wabot_tipo_label($cv['tipo'] ?? '', $cfg) ?: ($cv['tipo'] ?? '-');
        $salida[] = '';
        $salida[] = str_repeat('=', 60);
        $salida[] = "Nombre: $nombre | Clave: " . ($cv['conversation_key'] ?? $cv['tel'] ?? '') . " | Tel: $tel | Canal: " . wabot_canal($cv)
                  . ' | Fase: ' . ($cv['fase'] ?? '-') . " | Tipo: $tipo"
                  . (!empty($cv['comercial_estado']) ? ' | Estado comercial: ' . $cv['comercial_estado'] : '')
                  . (!empty($cv['presentado_ts']) ? ' | demo entregada' : '')
                  . (!empty($cv['pago_confirmado_ts']) ? ' | PAGÓ' : (!empty($cv['pago_avisado_ts']) ? ' | avisó que pagó' : ''))
                  . (!empty($cv['control_manual']) ? ' | lo sigue Pablo' : '')
                  . (!empty($cv['bot_off']) && empty($cv['control_manual']) ? ' | bot apagado en este chat' : '')
                  . (!empty($cv['handoff_pendiente']) ? ' | PABLO PENDIENTE' : '')
                  . (!empty($cv['archivado']) ? ' | archivado' : '');
        $salida[] = str_repeat('=', 60);
        $marcado = false;
        foreach ((array)($cv['transcript'] ?? []) as $linea) {
            $ts = (int)($linea['ts'] ?? 0);
            if (!$marcado && $ts >= $desde) { $salida[] = '---- nuevo desde acá ----'; $marcado = true; }
            $horaLinea = $ts ? date('d/m H:i', $ts) : '--/-- --:--';
            $quien = ['cliente' => 'Cliente', 'bot' => 'Bot', 'humano' => 'Vos (Pablo)'][$linea['q'] ?? ''] ?? ($linea['q'] ?? '?');
            $texto = trim((string)($linea['t'] ?? ''));
            if (!empty($linea['media']['clase'])) $texto .= ($texto !== '' ? ' ' : '') . '[adjunto: ' . $linea['media']['clase'] . ']';
            if (!empty($linea['plantilla'])) $texto .= ' [plantilla: ' . $linea['plantilla'] . ']';
            $salida[] = "[$horaLinea] $quien: $texto";
        }
    }
    return implode("\n", $salida) . "\n";
}

if (PHP_SAPI !== 'cli' && basename((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
    $esperado = wabot_revision_export_token();
    $t = (string)($_GET['t'] ?? '');
    if ($esperado === '' || $t === '' || !hash_equals($esperado, $t)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        exit('token invalido');
    }
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: private, max-age=0, no-store');
    echo wabot_revision_export_txt((int)($_GET['horas'] ?? 6));
    exit;
}
