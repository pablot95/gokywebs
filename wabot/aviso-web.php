<?php
/**
 * wabot/aviso-web.php — avisos de las webs de los clientes a su dueño, por el WhatsApp de Gokywebs
 * (24-nov, Vitamov: el bot de CallMeBot se llenó y dejó de dar claves nuevas; Pablo: «Sí, armalo»).
 *
 * Sale con la plantilla de Utilidad `aviso_web_cliente` (es_AR, creada por la API el 24-nov, id
 * 2379559486179138), que no necesita ventana de 24 h:
 *   Nuevo aviso de la web de {{1}}: {{2}}.
 *   Cliente: {{3}}
 *   Detalle: {{4}}
 *   Es un aviso automático de tu web, no hace falta responder. Lo ves completo en el panel.
 *
 * Cada web tiene su clave; el número al que llega lo fija el bot (data/avisos-webs.json), nunca la
 * web: una clave filtrada solo puede mandarle avisos al dueño de esa web, con tope diario.
 *
 * Por consola (ssh):
 *   php aviso-web.php alta sitio=vitamov negocio="Vitamov" tel=5491156347960   imprime la clave UNA vez
 *   php aviso-web.php listar
 *   php aviso-web.php probar sitio=vitamov                                      manda un aviso de prueba
 *   php aviso-web.php baja sitio=vitamov                                        deja de mandar (la clave muere)
 * La web llama por POST (JSON) a https://gokywebs.com/wabot/aviso-web.php:
 *   {"sitio": "vitamov", "clave": "...", "estado": "reserva confirmada y pagada", "cliente": "...", "detalle": "..."}
 */

require_once __DIR__ . '/lib.php';

const WABOT_AVISO_WEBS = WABOT_DATA . '/avisos-webs.json';
const WABOT_AVISO_PLANTILLA = 'aviso_web_cliente';
const WABOT_AVISO_MAX_DIA = 40;

function wabot_aviso_webs_leer() {
    $j = is_file(WABOT_AVISO_WEBS) ? json_decode((string)file_get_contents(WABOT_AVISO_WEBS), true) : null;
    return is_array($j) ? $j : [];
}

function wabot_aviso_webs_guardar(array $webs) {
    wabot_json_guardar_atomico(WABOT_AVISO_WEBS, $webs);
}

/** Meta rechaza variables vacías, con saltos de línea, tabs o más de 4 espacios seguidos. */
function wabot_aviso_campo($v, $max) {
    $v = trim(preg_replace('/\s+/u', ' ', (string)$v));
    if (mb_strlen($v) > $max) $v = rtrim(mb_substr($v, 0, $max - 1)) . '…';
    return $v === '' ? '-' : $v;
}

/** Manda el aviso y anota el uso del día. Devuelve 'ok', 'tope' o 'error'. */
function wabot_aviso_enviar(array &$webs, $sitio, array $datos) {
    $w = &$webs[$sitio];
    $hoy = date('Y-m-d');
    if (($w['uso_dia'] ?? '') !== $hoy) { $w['uso_dia'] = $hoy; $w['uso'] = 0; }
    if ((int)$w['uso'] >= WABOT_AVISO_MAX_DIA) { wabot_log('aviso_web', ['sitio' => $sitio, 'resultado' => 'tope']); return 'tope'; }
    $params = [
        wabot_aviso_campo($w['negocio'], 60),
        wabot_aviso_campo($datos['estado'] ?? '', 80),
        wabot_aviso_campo($datos['cliente'] ?? '', 120),
        wabot_aviso_campo($datos['detalle'] ?? '', 600),
    ];
    $ok = wabot_wa_send_template($w['tel'], WABOT_AVISO_PLANTILLA, 'es_AR', $params);
    $w['uso']++;
    $w['ultimo'] = ['ts' => time(), 'ok' => $ok];
    wabot_log('aviso_web', ['sitio' => $sitio, 'tel' => $w['tel'], 'resultado' => $ok ? 'ok' : 'error']);
    return $ok ? 'ok' : 'error';
}

/* ---------- Consola ---------- */
if (PHP_SAPI === 'cli') {
    $modo = $argv[1] ?? '';
    $a = [];
    foreach (array_slice($argv, 2) as $par) { [$k, $v] = array_pad(explode('=', $par, 2), 2, ''); $a[$k] = $v; }
    $sitio = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($a['sitio'] ?? '')));
    $webs = wabot_aviso_webs_leer();

    if ($modo === 'listar') {
        foreach ($webs as $id => $w) echo "$id | {$w['negocio']} | {$w['tel']} | " . (empty($w['activo']) ? 'BAJA' : 'activo')
            . ' | hoy ' . (($w['uso_dia'] ?? '') === date('Y-m-d') ? (int)$w['uso'] : 0)
            . (isset($w['ultimo']) ? ' | último ' . date('d/m H:i', $w['ultimo']['ts']) . ($w['ultimo']['ok'] ? ' ok' : ' ERROR') : '') . "\n";
        exit(0);
    }
    if ($sitio === '') { fwrite(STDERR, "uso: php aviso-web.php alta|listar|probar|baja sitio=<id> [negocio=… tel=…]\n"); exit(2); }

    if ($modo === 'alta') {
        $tel = preg_replace('/\D/', '', (string)($a['tel'] ?? ''));
        $negocio = trim((string)($a['negocio'] ?? ''));
        if (strlen($tel) < 10 || $negocio === '') { fwrite(STDERR, "falta tel (con 549…) o negocio\n"); exit(2); }
        $clave = bin2hex(random_bytes(24));
        $webs[$sitio] = ['negocio' => $negocio, 'tel' => $tel, 'clave_sha' => hash('sha256', $clave), 'activo' => true, 'alta' => date('c')];
        wabot_aviso_webs_guardar($webs);
        // Si el dueño contesta el aviso, que le conteste Pablo y no el bot de ventas.
        $conv = wabot_conv_resolver($tel, $motivo);
        if ($conv !== null && wabot_conv_existe($conv)) {
            $lock = wabot_lock_tomar($conv);
            if ($lock) try { $c = wabot_conv_load($conv); $c['bot_off'] = true; $c['control_manual'] = true; wabot_conv_save($c); } finally { wabot_lock_soltar($lock); }
        }
        echo "alta $sitio -> $tel\nclave (va a secrets.local.php de la web como GOKY_AVISO_CLAVE, no se vuelve a mostrar):\n$clave\n";
        exit(0);
    }
    if (!isset($webs[$sitio])) { fwrite(STDERR, "no existe $sitio\n"); exit(1); }
    if ($modo === 'baja') { $webs[$sitio]['activo'] = false; $webs[$sitio]['clave_sha'] = ''; wabot_aviso_webs_guardar($webs); echo "baja $sitio\n"; exit(0); }
    if ($modo === 'probar') {
        $r = wabot_aviso_enviar($webs, $sitio, ['estado' => 'aviso de prueba', 'cliente' => 'Gokywebs',
            'detalle' => 'Así te van a llegar los avisos de tu web. No hace falta hacer nada.']);
        wabot_aviso_webs_guardar($webs);
        echo "$r\n";
        exit($r === 'ok' ? 0 : 1);
    }
    fwrite(STDERR, "modo desconocido\n");
    exit(2);
}

/* ---------- HTTP ---------- */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$responder = function ($code, $datos) { http_response_code($code); echo json_encode($datos, JSON_UNESCAPED_UNICODE); exit; };

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') $responder(405, ['error' => 'POST']);
$cuerpo = (string)file_get_contents('php://input', false, null, 0, 8192);
$in = json_decode($cuerpo, true);
if (!is_array($in)) $responder(400, ['error' => 'json']);
$sitio = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($in['sitio'] ?? '')));
$clave = (string)($in['clave'] ?? '');

$fp = fopen(WABOT_AVISO_WEBS . '.lock', 'c');
flock($fp, LOCK_EX);
try {
    $webs = wabot_aviso_webs_leer();
    $w = $webs[$sitio] ?? null;
    if (!$w || empty($w['activo']) || ($w['clave_sha'] ?? '') === '' || !hash_equals($w['clave_sha'], hash('sha256', $clave))) {
        wabot_log('aviso_web', ['sitio' => $sitio, 'resultado' => 'clave']);
        $responder(403, ['error' => 'clave']);
    }
    $r = wabot_aviso_enviar($webs, $sitio, $in);
    wabot_aviso_webs_guardar($webs);
} finally {
    flock($fp, LOCK_UN);
    fclose($fp);
}
$responder($r === 'ok' ? 200 : ($r === 'tope' ? 429 : 502), ['resultado' => $r]);
