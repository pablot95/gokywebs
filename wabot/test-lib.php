<?php
/**
 * wabot/test-lib.php — lo que comparten todas las suites (solo CLI).
 *
 *   require_once __DIR__ . '/test-lib.php';
 *
 * Corta la red antes de cargar el motor (sin WhatsApp, Firestore ni Gemini:
 * ver los ganchos WABOT_TEST_* en lib.php), trae el borde común
 * (redactor.php → engine.php → lib.php) y define el helper de casos.
 * Cada suite termina con todo_ok(), que imprime el resumen y sale con el
 * código que corresponde.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$GLOBALS['WABOT_TEST_FALLAS'] = 0;
$GLOBALS['WABOT_TEST_TOTAL']  = 0;

require_once __DIR__ . '/redactor.php';

/** Un caso: imprime ✓/✗ y, si falló y hay detalle, lo que salió. */
function caso($nombre, $ok, $detalle = '') {
    $GLOBALS['WABOT_TEST_TOTAL']++;
    if (!$ok) $GLOBALS['WABOT_TEST_FALLAS']++;
    echo ($ok ? '  ✓ ' : '  ✗ ') . $nombre . ($ok || $detalle === '' ? '' : "  -> $detalle") . "\n";
}

/** Resumen final y código de salida. */
function todo_ok() {
    $fallas = (int)$GLOBALS['WABOT_TEST_FALLAS'];
    $total  = (int)$GLOBALS['WABOT_TEST_TOTAL'];
    echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
    exit($fallas === 0 ? 0 : 1);
}

/**
 * Una conversación desde cero, sin tocar disco. La clave con "TEST" adentro
 * hace que lib.php no cree leads ni mande nada aunque se olvide el gancho.
 */
function conv_nueva($clave = '999TEST999', array $extra = []) {
    $c = [
        'tel' => $clave, 'channel_user_id' => $clave, 'canal' => 'whatsapp', 'conversation_key' => $clave,
        'fase' => 'nuevo', 'tipo' => null, 'descripcion' => null, 'colores' => null, 'colores_hex' => null,
        'referencia' => null, 'msgs' => [], 'ultimo_ts' => 0, 'ultimo_cliente_ts' => 0, 'transcript' => [],
        'espera_avisada' => false, 'no_texto_avisado' => false, 'bot_off' => false, 'pausado_hasta' => 0,
        'lead_creado' => false,
    ];
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

/** El clasificador simulado: se setea antes de cada llamada a wabot_engine(). */
function clasifica($acciones, $extra = []) {
    $GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () use ($acciones, $extra) {
        return array_merge(['acciones' => (array)$acciones, 'info_keys' => [], 'descripcion' => null, 'colores' => null], $extra);
    };
}

/** Un turno por el borde común, con el mensaje ya en el transcript (como el webhook). */
function turno($texto, &$c, $cfg) {
    wabot_conv_transcript($c, 'cliente', $texto);
    $c['ultimo_cliente_ts'] = time();
    $r = wabot_salida_preparar(wabot_responder($texto, $c, $cfg), $c, $cfg);
    foreach ((array)$r as $m) wabot_conv_transcript($c, 'bot', (string)$m);
    return (array)$r;
}

function tiene_form($r) { return strpos(implode(' ', (array)$r), 'gokywebs.com/form/') !== false; }
