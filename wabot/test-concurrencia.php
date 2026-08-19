<?php
/**
 * wabot/test-concurrencia.php — mensajes seguidos del mismo cliente (solo CLI).
 *
 * Meta abre un proceso por mensaje entrante. Este test lanza procesos PHP DE
 * VERDAD en paralelo, porque el bug que arregla solo aparece con concurrencia
 * real: simulado en un solo proceso, siempre da bien.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/lib.php';

define('WABOT_SALIDA', WABOT_DATA . '/log/test-concurrencia.jsonl');

function registrar($que, $detalle) {
    @file_put_contents(WABOT_SALIDA, json_encode(['que' => $que, 'detalle' => $detalle], JSON_UNESCAPED_UNICODE) . "\n",
                       FILE_APPEND | LOCK_EX);
}

/* ── Rol trabajador: imita exactamente lo que hace webhook.php por mensaje ── */
if (($argv[1] ?? '') === 'worker') {
    list(, , $tel, $texto, $id, $demora) = $argv;
    usleep((int)(($argv[6] ?? 0) * 1000));   // arranque escalonado

    if (!wabot_msg_visto_marcar($id)) { registrar('duplicado', $texto); exit; }
    wabot_cola_encolar($tel, $texto, $texto, '');

    $arranque = microtime(true);
    $lock = wabot_lock_tomar($tel);
    if (!$lock) { registrar('encolado', $texto); exit; }

    try {
        do {
            $espera = (float)$demora - (microtime(true) - $arranque);
            if ($espera > 0) usleep((int)($espera * 1000000));

            $tanda = wabot_cola_drenar($tel);
            if (!$tanda) break;

            $juntos = [];
            foreach ($tanda as $t) $juntos[] = $t['t'];
            registrar('respuesta', implode(' + ', $juntos));

            $arranque = microtime(true);
        } while (wabot_cola_tiene($tel));
    } finally {
        wabot_lock_soltar($lock);
    }
    exit;
}

/* ─────────────────────────── Rol conductor ─────────────────────────── */

$fallas = 0; $total = 0;
function caso($nombre, $ok) {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . "\n";
    if (!$ok) $fallas++;
}

function limpiar($tel) {
    @unlink(WABOT_SALIDA);
    @unlink(wabot_cola_path($tel));
    @unlink(WABOT_DATA . '/vistos.json');
    @unlink(WABOT_DATA . '/lock/' . preg_replace('/[^0-9A-Za-z]/', '', $tel) . '.lock');
}

function correr($tel, $mensajes, $demora) {
    $procs = [];
    foreach ($mensajes as $i => $m) {
        list($texto, $id, $retrasoMs) = $m;
        // Usa exactamente el runtime que lanzó la suite. En desarrollo puede
        // ser un PHP portátil que no está agregado al PATH del sistema.
        $cmd = sprintf('%s %s worker %s %s %s %s %d',
            escapeshellarg(PHP_BINARY), escapeshellarg(__FILE__), escapeshellarg($tel), escapeshellarg($texto),
            escapeshellarg($id), escapeshellarg((string)$demora), $retrasoMs);
        $procs[] = proc_open($cmd, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes[$i]);
        foreach ($pipes[$i] as $p) stream_set_blocking($p, false);
    }
    foreach ($procs as $k => $pr) {
        if (!is_resource($pr)) continue;
        while (proc_get_status($pr)['running']) usleep(50000);
        proc_close($pr);
    }
    $out = [];
    foreach (@file(WABOT_SALIDA, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
        $r = json_decode($l, true);
        if (is_array($r)) $out[] = $r;
    }
    return $out;
}

function soloDe($eventos, $que) {
    $out = [];
    foreach ($eventos as $e) if ($e['que'] === $que) $out[] = $e['detalle'];
    return $out;
}

echo "— Tres mensajes seguidos mientras el bot piensa —\n";

$tel = '5490000000001';
limpiar($tel);
$ev = correr($tel, [
    ['Hola', 'wamid.C1', 0],
    ['Quiero vender', 'wamid.C2', 300],
    ['Son mates', 'wamid.C3', 700],
], 3.0);

$respuestas = soloDe($ev, 'respuesta');
caso('contesta UNA sola vez, no una por mensaje', count($respuestas) === 1);
caso('los tres mensajes entran en esa única respuesta',
    count($respuestas) === 1
    && strpos($respuestas[0], 'Hola') !== false
    && strpos($respuestas[0], 'Quiero vender') !== false
    && strpos($respuestas[0], 'Son mates') !== false);
caso('los otros dos procesos encolaron y se fueron', count(soloDe($ev, 'encolado')) === 2);
caso('no se perdió ningún mensaje del cliente',
    count($respuestas) === 1 && substr_count($respuestas[0], ' + ') === 2);

echo "— El reintento de Meta no entra dos veces —\n";

$tel = '5490000000002';
limpiar($tel);
$ev = correr($tel, [
    ['Hola', 'wamid.R1', 0],
    ['Hola', 'wamid.R1', 250],   // mismo id: Meta reintentando
    ['Otra cosa', 'wamid.R2', 400],
], 2.5);

$respuestas = soloDe($ev, 'respuesta');
caso('el id repetido se descarta', count(soloDe($ev, 'duplicado')) === 1);
caso('sigue contestando una sola vez', count($respuestas) === 1);
caso('y el saludo aparece una vez sola, no dos',
    count($respuestas) === 1 && substr_count($respuestas[0], 'Hola') === 1);

echo "— Lo que llega DESPUÉS de contestar es un turno nuevo —\n";

$tel = '5490000000003';
limpiar($tel);
$ev = correr($tel, [
    ['Primero', 'wamid.T1', 0],
    ['Ahora si, mucho despues', 'wamid.T2', 1600],
], 0.4);

$respuestas = soloDe($ev, 'respuesta');
caso('se contesta en dos turnos separados, no pegados', count($respuestas) === 2);
caso('cada turno lleva su mensaje',
    count($respuestas) === 2
    && strpos($respuestas[0], 'Primero') !== false
    && strpos($respuestas[1], 'mucho despues') !== false);

echo "— El candado se suelta aunque el proceso reviente —\n";

$tel = '5490000000004';
limpiar($tel);
$h = wabot_lock_tomar($tel);
caso('el primero toma el candado', $h !== null);
caso('el segundo no puede tomarlo', wabot_lock_tomar($tel) === null);
wabot_lock_soltar($h);
$h2 = wabot_lock_tomar($tel);
caso('soltado, otro lo puede tomar', $h2 !== null);
wabot_lock_soltar($h2);

foreach (['5490000000001','5490000000002','5490000000003','5490000000004'] as $t) limpiar($t);
@unlink(WABOT_SALIDA);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
