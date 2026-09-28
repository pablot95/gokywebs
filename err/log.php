<?php
/*
 * GokyWebs – err/log.php
 * Recibe lo que manda err/err.js desde las webs de los clientes y lo guarda en
 * Firestore para la pestaña "Errores" del admin. No hay lista de webs que mantener:
 * cada web se identifica sola por el header Origin (su dominio) y aparece en el panel
 * en cuanto avisa por primera vez.
 *
 * - POST { tipo:"ping" }  -> una vez por día por web: `errores_pings/{dominio}` = "esta web está viva".
 * - POST { tipo, nivel, msg, src, line, col, stack, url } -> un error en `errores_web`.
 *
 * Se ignoran localhost, IPs y los dominios de prueba/preview (vercel.app, etc.): una web
 * cuenta cuando está en su dominio real. Topes por IP y por día para que nadie pueda
 * llenar la base de basura; el panel además esconde bajo "Otras webs" todo dominio que
 * no coincida con el de un cliente.
 *
 * Mismo patrón que mantenimiento/api/webhook-mp.php: escribe con la API key web
 * (las reglas de Firestore solo dejan escribir estas colecciones con campos acotados).
 */

date_default_timezone_set('America/Argentina/Buenos_Aires');

$FB_PROJECT   = 'gokywebs-967cd';
$FB_APIKEY    = 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ';
$TOPE_IP_HORA   = 40;    // reportes por IP por hora (todas las webs juntas)
$TOPE_TOTAL_DIA = 2000;  // reportes totales por día, sumando todas las webs
$REPETIDO_SEG   = 600;   // el mismo error de la misma IP no se vuelve a guardar por 10 min

/* ── Solo POST: guardar un ping o un error ── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') { http_response_code(404); exit; }
function host_de($url) {
    $h = parse_url((string)$url, PHP_URL_HOST);
    return is_string($h) ? strtolower($h) : '';
}
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = host_de($origen) ?: host_de($_SERVER['HTTP_REFERER'] ?? '');

// Dominio de la web = host del Origin sin "www.". Solo caracteres de dominio (va de id en Firestore).
$sitio = preg_replace('/^www\./', '', $host);
$esPrueba = $sitio === '' || strlen($sitio) > 80 || !preg_match('/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/', $sitio)
    || preg_match('/\.(test|local|localhost|internal)$/', $sitio)
    || preg_match('/(^|\.)(vercel\.app|netlify\.app|pages\.dev|github\.io|hostingersite\.com|onrender\.com|web\.app|firebaseapp\.com)$/', $sitio);
if ($esPrueba) $sitio = null;

if ($sitio && $origen !== '') {
    header('Access-Control-Allow-Origin: ' . $origen);
    header('Vary: Origin');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}
http_response_code(204);   // siempre 204: no le contamos a nadie qué se guardó y qué no
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$sitio) exit;

$raw = file_get_contents('php://input', false, null, 0, 8192);
$in  = json_decode((string)$raw, true);
if (!is_array($in)) exit;

function limpiar($v, $max) {
    $v = is_string($v) ? $v : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
}
$esPing = ($in['tipo'] ?? '') === 'ping';
$tipo  = in_array($in['tipo'] ?? '', ['error', 'promesa', 'recurso', 'fetch'], true) ? $in['tipo'] : 'error';
$nivel = ($in['nivel'] ?? '') === 'bajo' ? 'bajo' : 'alto';
$msg   = limpiar($in['msg'] ?? '', 400);
$src   = limpiar($in['src'] ?? '', 300);
$stack = limpiar($in['stack'] ?? '', 1200);
$url   = limpiar($in['url'] ?? '', 200);
$line  = max(0, min(1000000, (int)($in['line'] ?? 0)));
$col   = max(0, min(1000000, (int)($in['col'] ?? 0)));
if (!$esPing && ($msg === '' || $msg === 'Script error.')) exit;
if (preg_match('#^(chrome|moz|safari)-extension:#i', $src)) exit;

$id   = $sitio;
$ua   = limpiar($_SERVER['HTTP_USER_AGENT'] ?? '', 160);
$ip   = $_SERVER['REMOTE_ADDR'] ?? '0';
// Mismo error = mismo hash (sin números del mensaje ni query del archivo), para que el panel lo agrupe.
$hash = substr(md5($id . '|' . $tipo . '|' . preg_replace('/\d+/', '#', $msg) . '|' . preg_replace('/[?#].*$/', '', $src) . '|' . $line), 0, 12);

/* ── Topes (archivos chicos con lock en err/data/) ── */
$dir = __DIR__ . '/data';
if (!is_dir($dir)) @mkdir($dir, 0755, true);

$rlPath = $dir . '/ip-' . md5($ip) . '.json';
$fh = @fopen($rlPath, 'c+');
if (!$fh) exit;
flock($fh, LOCK_EX);
$rl  = json_decode((string)stream_get_contents($fh), true);
$now = time();
if (!is_array($rl) || ($rl['t'] ?? 0) < $now - 3600) $rl = ['t' => $now, 'n' => 0, 'seen' => []];
$rl['seen'] = array_filter((array)$rl['seen'], function ($ts) use ($now, $REPETIDO_SEG) { return $ts > $now - $REPETIDO_SEG; });
$clave = $esPing ? 'ping|' . $id : $hash;
$ok = $rl['n'] < $TOPE_IP_HORA && !isset($rl['seen'][$clave]);
if ($ok) { $rl['n']++; $rl['seen'][$clave] = $now; }
ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($rl));
flock($fh, LOCK_UN); fclose($fh);
if (!$ok) exit;

$diaPath = $dir . '/dia-' . date('Ymd') . '.txt';
$fd = @fopen($diaPath, 'c+');
if (!$fd) exit;
flock($fd, LOCK_EX);
$n = (int)stream_get_contents($fd);
$pasa = $n < $TOPE_TOTAL_DIA;
if ($pasa) { ftruncate($fd, 0); rewind($fd); fwrite($fd, (string)($n + 1)); }
flock($fd, LOCK_UN); fclose($fd);
if (!$pasa) exit;
// Limpieza de topes viejos (1 de cada 50 pedidos): más de 2 días.
if (mt_rand(1, 50) === 1) {
    foreach (glob($dir . '/{ip-*.json,dia-*.txt}', GLOB_BRACE) ?: [] as $f) { if (@filemtime($f) < $now - 172800) @unlink($f); }
}

/* ── Guardar en Firestore (typed values del REST API) ── */
if ($esPing) {
    // PATCH sin updateMask crea el doc o lo pisa: `errores_pings/{dominio}` = última señal de vida.
    $ch = curl_init("https://firestore.googleapis.com/v1/projects/{$FB_PROJECT}/databases/(default)/documents/errores_pings/" . rawurlencode($id) . "?key={$FB_APIKEY}");
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => 'PATCH',
        CURLOPT_POSTFIELDS     => json_encode(['fields' => [
            'dominio' => ['stringValue' => $id],
            'at'      => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
        ]]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 10,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200) error_log('[err/log.php] ping Firestore ' . $code . ': ' . substr((string)$res, 0, 300));
    exit;
}
$s = function ($v) { return ['stringValue' => (string)$v]; };
$fields = [
    'site'  => $s($id),
    'tipo'  => $s($tipo),
    'nivel' => $s($nivel),
    'msg'   => $s($msg),
    'src'   => $s($src),
    'line'  => ['integerValue' => (string)$line],
    'col'   => ['integerValue' => (string)$col],
    'stack' => $s($stack),
    'url'   => $s($url),
    'ua'    => $s($ua),
    'hash'  => $s($hash),
    'at'    => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
];
$ch = curl_init("https://firestore.googleapis.com/v1/projects/{$FB_PROJECT}/databases/(default)/documents/errores_web?key={$FB_APIKEY}");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['fields' => $fields]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 10,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($code !== 200) error_log('[err/log.php] Firestore ' . $code . ': ' . substr((string)$res, 0, 300));
