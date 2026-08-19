<?php
/*
 * GokyWebs – track.php
 * - POST: registra eventos del embudo del formulario (entrada, paso 2, envío)
 *         en data/events.log (una línea JSON por evento).
 * - GET : devuelve los totales agregados en JSON para el panel admin.
 *
 * Eventos válidos: enter | step2 | precio_visto | success
 *                  ('precio_visto' = apretó "Ver mi presupuesto", el lead ya quedó
 *                   guardado; 'success' = confirmó "Sí, quiero mi muestra". Desde
 *                   18-jul-2026 reemplazan a 'send_click', que queda como legado.)
 *                  + microembudo acumulativo del paso 1 (orden visual desde 18-jul-2026,
 *                    contacto al final): form_start | field_objetivo | field_negocio |
 *                    field_rubro | field_nombre | field_telefono
 * Orígenes válidos: whatsapp | instagram | nativo (default si falta o es inválido)
 */

date_default_timezone_set('America/Argentina/Buenos_Aires');
header('Access-Control-Allow-Origin: https://gokywebs.com');

$logFile = __DIR__ . '/data/events.log';

/* ─────────────────────────────────────────────
   GET → agregados para el panel admin
   ───────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json; charset=utf-8');

    /* ── Solo el admin logueado puede leer los agregados ──
       Verifica el ID token de Firebase (header Authorization: Bearer) contra Google.
       $ADMIN_EMAILS vacío = alcanza con ser un usuario válido del proyecto Firebase;
       completarlo con el/los email(s) de login del admin restringe aún más. */
    $ADMIN_EMAILS = [];
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

    $order    = ['enter', 'step2', 'precio_visto', 'success'];
    $origenes = ['whatsapp', 'instagram', 'nativo'];
    $stages   = ['enter' => [], 'step2' => [], 'precio_visto' => [], 'success' => []];

    // Microembudo acumulativo del paso 1: cada hito nuevo exige los anteriores.
    // 'prefill' = sesiones que llegaron con datos pre-cargados por el bot (link con parámetros).
    $fieldOrder = ['form_start', 'field_objetivo', 'field_negocio', 'field_rubro', 'field_nombre', 'field_telefono', 'field_email', 'field_productos', 'prefill'];
    $fields = array_fill_keys($fieldOrder, []);
    $origenBySid = [];
    $byDay    = [];

    if (is_file($logFile) && ($fh = fopen($logFile, 'r'))) {
        while (($l = fgets($fh)) !== false) {
            $r = json_decode($l, true);
            if (!is_array($r) || !isset($r['event'], $r['sid'], $r['ts'])) continue;
            $ev = $r['event'];
            $esCampo = isset($fields[$ev]);
            if (!$esCampo && !isset($stages[$ev])) continue;
            $t = strtotime($r['ts']);
            if ($since && $t < $since) continue;
            if ($until && $t > $until) continue;

            $sid = $r['sid'];
            if ($esCampo) { $fields[$ev][$sid] = true; continue; } // los campos no suman a byDay/origen
            $stages[$ev][$sid] = true;

            // Logs previos a este feature no traen 'origen' → caen en 'nativo'.
            $origen = isset($r['origen']) && in_array($r['origen'], $origenes, true) ? $r['origen'] : 'nativo';
            if (!isset($origenBySid[$sid])) $origenBySid[$sid] = $origen;

            $d = date('Y-m-d', $t);
            if (!isset($byDay[$d])) {
                $byDay[$d] = ['enter' => [], 'step2' => [], 'precio_visto' => [], 'success' => []];
            }
            $byDay[$d][$ev][$sid] = true;
        }
        fclose($fh);
    }

    $stageCounts = [];
    foreach ($order as $ev) $stageCounts[$ev] = count($stages[$ev]);

    // Totales de entradas por canal (para las cardcitas 💬 📸 🌐 junto al embudo).
    $origenTotals = ['whatsapp' => 0, 'instagram' => 0, 'nativo' => 0];
    foreach (array_keys($stages['enter']) as $sid) {
        $o = $origenBySid[$sid] ?? 'nativo';
        $origenTotals[$o]++;
    }

    // Desglose por canal en CADA etapa (cuántos de cada origen llegan a paso 2, envían y completan).
    $stageOrigenes = [];
    foreach ($order as $ev) {
        $so = ['whatsapp' => 0, 'instagram' => 0, 'nativo' => 0];
        foreach (array_keys($stages[$ev]) as $sid) {
            $so[$origenBySid[$sid] ?? 'nativo']++;
        }
        $stageOrigenes[$ev] = $so;
    }

    krsort($byDay);
    $dayRows = [];
    foreach ($byDay as $d => $sets) {
        // Mismo desglose por canal pero acotado a ese día (columna "Origen" de la tabla).
        $origenDelDia = ['whatsapp' => 0, 'instagram' => 0, 'nativo' => 0];
        foreach (array_keys($sets['enter']) as $sid) {
            $o = $origenBySid[$sid] ?? 'nativo';
            $origenDelDia[$o]++;
        }
        $dayRows[] = [
            'date'         => $d,
            'enter'        => count($sets['enter']),
            'step2'        => count($sets['step2']),
            'precio_visto' => count($sets['precio_visto']),
            'success'      => count($sets['success']),
            'origenes'     => $origenDelDia,
        ];
    }

    $fieldCounts = [];
    foreach ($fieldOrder as $f) $fieldCounts[$f] = count($fields[$f]);

    echo json_encode(['range' => $range, 'stages' => $stageCounts, 'byDay' => $dayRows, 'origenTotals' => $origenTotals, 'stageOrigenes' => $stageOrigenes, 'fields' => $fieldCounts]);
    exit;
}

/* ─────────────────────────────────────────────
   POST → registrar un evento
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

$allowed = [
    'enter', 'step2', 'precio_visto', 'success',
    'send_click',   // legado (pre 18-jul-2026): se acepta para no perder beacons viejos
    // micro-embudo por campo (paso 1)
    'form_start', 'field_nombre', 'field_email', 'field_telefono',
    'field_negocio', 'field_rubro', 'field_productos', 'field_objetivo',
    // llegó con datos pre-cargados por el bot
    'prefill',
];
$event   = isset($data['event']) ? (string) $data['event'] : '';
if (!in_array($event, $allowed, true)) {
    http_response_code(400);
    exit;
}

$sid = isset($data['sid']) ? preg_replace('/[^a-zA-Z0-9-]/', '', (string) $data['sid']) : '';
$sid = substr($sid, 0, 40);
if ($sid === '') {
    http_response_code(400);
    exit;
}

$origen = isset($data['origen']) ? strtolower((string) $data['origen']) : 'nativo';
if (!in_array($origen, ['whatsapp', 'instagram', 'nativo'], true)) $origen = 'nativo';

/* ── Carpeta de datos (protegida de acceso público) ── */
$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}
$ht = $dir . '/.htaccess';
if (!file_exists($ht)) {
    @file_put_contents($ht, "Require all denied\nDeny from all\n");
}

/* ── Registrar evento ── */
$line = json_encode([
    'ts'     => date('c'),
    'sid'    => $sid,
    'event'  => $event,
    'origen' => $origen,
]) . "\n";

@file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

http_response_code(204);
