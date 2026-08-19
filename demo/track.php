<?php
/*
 * GokyWebs – demo/track.php
 * Estadística de visitas POR DEMO (cada demo vive en /demo/NombreCarpeta).
 *
 * - POST: registra una visita { demo, sid, ref } en data/visits.log
 *         (una línea JSON por visita). Lo dispara demo/track.js desde cada demo.
 * - GET : devuelve los agregados por demo en JSON para el panel admin
 *         (solo el admin logueado — verifica el ID token de Firebase).
 *
 * Mismo patrón que /form/track.php (log plano + lectura gateada por Firebase).
 */

date_default_timezone_set('America/Argentina/Buenos_Aires');
header('Access-Control-Allow-Origin: https://gokywebs.com');

$logFile = __DIR__ . '/data/visits.log';

/* ─────────────────────────────────────────────
   GET → agregados por demo para el panel admin
   ───────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json; charset=utf-8');

    /* ── Solo el admin logueado puede leer los agregados ──
       Verifica el ID token de Firebase (Authorization: Bearer) contra Google. */
    $ADMIN_EMAILS = ['pablo.travi95@gmail.com'];
    $FIREBASE_API_KEY = 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ';

    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if ($authHeader === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strcasecmp($k, 'Authorization') === 0) { $authHeader = $v; break; }
        }
    }
    $idToken = preg_match('/Bearer\s+(\S+)/i', $authHeader, $m) ? $m[1] : '';

    $email = null;
    if ($idToken !== '') {
        $ch = curl_init('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . $FIREBASE_API_KEY);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['idToken' => $idToken]),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 6,
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($code === 200) $email = json_decode($res, true)['users'][0]['email'] ?? null;
    }

    $autorizado = $email !== null
        && (empty($ADMIN_EMAILS) || in_array(strtolower($email), array_map('strtolower', $ADMIN_EMAILS), true));
    if (!$autorizado) {
        http_response_code(403);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }

    // Rango de fechas: presets (today/7d/30d/all) o rango a medida con
    // ?from=YYYY-MM-DD&to=YYYY-MM-DD (cualquiera de los dos alcanza para activarlo).
    $reDate = '/^\d{4}-\d{2}-\d{2}$/';
    $from   = (string) ($_GET['from'] ?? '');
    $to     = (string) ($_GET['to']   ?? '');
    $since  = 0;   // 0 = sin piso
    $until  = 0;   // 0 = sin techo
    if (preg_match($reDate, $from) || preg_match($reDate, $to)) {
        $range = 'custom';
        if (preg_match($reDate, $from)) $since = strtotime($from . ' 00:00:00');
        if (preg_match($reDate, $to))   $until = strtotime($to   . ' 23:59:59');
    } else {
        $rangesDays = ['today' => 1, '7d' => 7, '30d' => 30, 'all' => 0];
        $range = $_GET['range'] ?? '7d';
        if (!isset($rangesDays[$range])) $range = '7d';
        $days  = $rangesDays[$range];
        $since = $days ? strtotime('today') - ($days - 1) * 86400 : 0;
    }

    // Por demo: visitas totales, personas únicas (sid distintos), última visita,
    // y visitas por día (para el mini-gráfico). $seen dedupe sid global del rango.
    $demos    = [];   // demo => ['visits'=>int, 'sids'=>[sid=>1], 'last'=>ts, 'byDay'=>[d=>int]]
    $sidsAll  = [];   // personas únicas globales del rango
    // Visitas por hora del día (0-23), SUMANDO todas las demos (no demo por demo).
    // El panel las agrupa en franjas (2 h en general, 1 h entre las 14 y las 22).
    $byHour   = array_fill(0, 24, 0);

    if (is_file($logFile) && ($fh = fopen($logFile, 'r'))) {
        while (($l = fgets($fh)) !== false) {
            $r = json_decode($l, true);
            if (!is_array($r) || !isset($r['event'], $r['demo'], $r['sid'], $r['ts'])) continue;
            if ($r['event'] !== 'view') continue;
            $t = strtotime($r['ts']);
            if ($t === false) continue;
            if ($since && $t < $since) continue;
            if ($until && $t > $until) continue;

            $demo = (string) $r['demo'];
            $sid  = (string) $r['sid'];
            if (!isset($demos[$demo])) $demos[$demo] = ['visits' => 0, 'sids' => [], 'last' => 0, 'byDay' => []];
            $demos[$demo]['visits']++;
            $demos[$demo]['sids'][$sid] = true;
            if ($t > $demos[$demo]['last']) $demos[$demo]['last'] = $t;
            $d = date('Y-m-d', $t);
            $demos[$demo]['byDay'][$d] = ($demos[$demo]['byDay'][$d] ?? 0) + 1;
            $sidsAll[$sid] = true;
            $byHour[(int) date('G', $t)]++;   // 'G' = hora 0-23 sin cero inicial
        }
        fclose($fh);
    }

    $rows = [];
    $totalVisits = 0;
    foreach ($demos as $demo => $x) {
        ksort($x['byDay']);
        $rows[] = [
            'demo'    => $demo,
            'visits'  => $x['visits'],
            'uniques' => count($x['sids']),
            'last'    => $x['last'] ? date('c', $x['last']) : null,
            'byDay'   => $x['byDay'],
        ];
        $totalVisits += $x['visits'];
    }
    // Más visitados primero.
    usort($rows, function ($a, $b) { return $b['visits'] <=> $a['visits']; });

    echo json_encode([
        'range'       => $range,
        'from'        => $since ? date('Y-m-d', $since) : null,
        'to'          => $until ? date('Y-m-d', $until) : null,
        'generatedAt' => date('c'),
        'totals'      => ['visits' => $totalVisits, 'uniques' => count($sidsAll), 'demos' => count($rows)],
        'byHour'      => array_values($byHour),
        'demos'       => $rows,
    ]);
    exit;
}

/* ─────────────────────────────────────────────
   POST → registrar una visita a un demo
   ───────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 2000) {
    http_response_code(400);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    exit;
}

// Nombre de carpeta del demo: letras, números, punto, guion, guion bajo. Máx 60.
$demo = isset($data['demo']) ? strtolower((string) $data['demo']) : '';
$demo = preg_replace('/[^a-z0-9._-]/', '', $demo);
$demo = substr($demo, 0, 60);
if ($demo === '') {
    http_response_code(400);
    exit;
}

// Identificador anónimo del visitante (persistente en su navegador). Máx 40.
$sid = isset($data['sid']) ? preg_replace('/[^a-zA-Z0-9-]/', '', (string) $data['sid']) : '';
$sid = substr($sid, 0, 40);
if ($sid === '') {
    http_response_code(400);
    exit;
}

// Origen aproximado (directo / whatsapp / instagram / otro). Solo para color.
$ref = isset($data['ref']) ? strtolower((string) $data['ref']) : 'directo';
if (!in_array($ref, ['directo', 'whatsapp', 'instagram', 'otro'], true)) $ref = 'directo';

/* ── Carpeta de datos (protegida de acceso público) ── */
$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}
$ht = $dir . '/.htaccess';
if (!file_exists($ht)) {
    @file_put_contents($ht, "Require all denied\nDeny from all\n");
}

/* ── Registrar visita ── */
$line = json_encode([
    'ts'    => date('c'),
    'demo'  => $demo,
    'sid'   => $sid,
    'event' => 'view',
    'ref'   => $ref,
]) . "\n";

@file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

http_response_code(204);
