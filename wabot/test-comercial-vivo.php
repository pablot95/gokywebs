<?php
/**
 * wabot/test-comercial-vivo.php — el flujo comercial contra GPT Sol REAL, con charlas reales (9-oct-2026).
 *
 *   php wabot/test-comercial-vivo.php [--grupo=evaluacion|guia|todos] [--ids=C1a2b3-1,C9f8e7-2] [--max=N]
 *                                      [--guardar=ruta.jsonl] [--viejo] [--silencio]
 *
 * Carga wabot/test-comercial-charlas.json (fragmentos anonimizados del export
 * del 4 al 9-oct): por cada caso arma la charla con el historial ANTERIOR al
 * mensaje nuevo (nunca ve lo que siguió ni lo que contestó Pablo), piensa el
 * turno con wabot_comercial_pensar + validar + construir y compara la acción
 * con la esperada. Imprime lo que mandaría, el motivo, la latencia y el costo.
 * No manda WhatsApp, no crea leads ni toca charlas reales: todo pasa en memoria.
 *
 * LLAMA A OPENAI DE VERDAD (hace falta la key en config/wabot-config.php):
 * cuesta ~US$ 0,01 por caso. No va en los barridos de tests.
 *
 * --viejo compara además con la decisión del flujo anterior (wabot_ia_pensar,
 * el de antes del precio) en los casos sin precio, para ver la diferencia.
 */
if (PHP_SAPI !== 'cli') exit;
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';

$opciones = getopt('', ['grupo::', 'ids::', 'max::', 'guardar::', 'viejo', 'silencio']);
$grupo = (string)($opciones['grupo'] ?? 'evaluacion');
$ids = array_filter(array_map('trim', explode(',', (string)($opciones['ids'] ?? ''))));
$max = (int)($opciones['max'] ?? 0);
$guardar = (string)($opciones['guardar'] ?? (sys_get_temp_dir() . '/wabot-comercial-vivo-' . date('Ymd-His') . '.jsonl'));
$conViejo = isset($opciones['viejo']);
$silencio = isset($opciones['silencio']);

$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-comercial-vivo-uso';
$cfg = wabot_config_load();
if (wabot_openai_key() === '') { fwrite(STDERR, "Falta la key de OpenAI (config/wabot-config.php).\n"); exit(2); }
$casos = json_decode((string)file_get_contents(__DIR__ . '/test-comercial-charlas.json'), true);
if (!is_array($casos)) { fwrite(STDERR, "No se pudo leer test-comercial-charlas.json\n"); exit(2); }

echo 'Modelo ' . wabot_openai_modelo($cfg) . " · grupo $grupo · " . date('Y-m-d H:i') . "\n";
$equivale = ['cotizar' => ['cotizar'], 'cotizar_repite' => ['cotizar'], 'formulario' => ['formulario'],
             'responder' => ['responder', 'esperar'], 'responder_pregunta' => ['responder'], 'humano' => ['humano'], 'esperar' => ['esperar']];
$n = 0; $ok = 0; $fallas = []; $costo = 0.0; $segundos = 0.0;
$t0 = microtime(true);
foreach ($casos as $caso) {
    if ($grupo !== 'todos' && ($caso['grupo'] ?? '') !== $grupo) continue;
    if ($ids && !in_array((string)$caso['id'], $ids, true)) continue;
    if ($max > 0 && $n >= $max) break;
    $n++;
    $clave = '5491100008' . str_pad((string)$n, 3, '0', STR_PAD_LEFT) . 'TEST';
    $conv = ['tel' => $clave, 'channel_user_id' => $clave, 'canal' => (string)($caso['canal'] ?? 'whatsapp'), 'conversation_key' => $clave,
             'fase' => 'nuevo', 'tipo' => null, 'msgs' => [], 'transcript' => [], 'nombre' => 'Cliente', 'reconocimiento_hecho' => true];
    $ts = time() - 3600 - 60 * count($caso['historial']);
    foreach ((array)$caso['historial'] as $linea) {
        // Por el mismo camino que el webhook: el link del formulario deja su marca.
        wabot_conv_transcript($conv, (string)$linea['q'], (string)$linea['t']);
        $conv['transcript'][count($conv['transcript']) - 1]['ts'] = $ts;
        if ($linea['q'] === 'bot' && (strpos($linea['t'], 'primera propuesta para la web') !== false || strpos($linea['t'], 'gokywebs.com/demo/') !== false)) $conv['presentado_ts'] = $ts;
        $ts += 60;
        if ($linea['q'] === 'cliente') wabot_ficha_actualizar($conv, (string)$linea['t']);
    }
    $texto = (string)$caso['mensaje'];
    $conv['transcript'][] = ['q' => 'cliente', 't' => $texto, 'ts' => time()];
    $conv['ultimo_cliente_ts'] = time();
    wabot_ficha_actualizar($conv, $texto);
    $GLOBALS['WABOT_IA_CLAVE'] = $clave;
    $esperados = (array)$caso['esperado'];
    $fila = ['id' => $caso['id'], 'grupo' => $caso['grupo'] ?? '', 'esperado' => $caso['esperado'], 'mensaje' => $texto, 'pablo' => $caso['pablo'] ?? []];

    // Antes del modelo, el estado: con el formulario o la demo ya mandados no se contesta (sin gastar).
    [$elegible, $motivoEstado] = wabot_comercial_elegible($conv, $cfg, 'sugerencias');
    if (!$elegible) {
        $coincide = in_array('pausa', $esperados, true);
        if ($coincide) $ok++; else $fallas[] = $fila + ['accion' => 'pausa'];
        $fila += ['accion' => 'pausa', 'motivo' => $motivoEstado, 'mensajes' => [], 'coincide' => $coincide, 'costo_usd' => 0];
        if (!$silencio || !$coincide) echo "\n### {$caso['id']} esperado=" . json_encode($caso['esperado']) . " → pausa" . ($coincide ? ' ✓' : ' ✗') . " ($motivoEstado)\n";
        @file_put_contents($guardar, json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
        continue;
    }
    $r = wabot_comercial_pensar($texto, $conv, $cfg, 'prueba');
    if (!$r['ok']) {
        $fila += ['accion' => 'ERROR', 'error' => (string)$r['error'], 'mensajes' => []];
        $fallas[] = $fila;
        echo "\n### {$caso['id']} ERROR {$r['error']}\n";
    } else {
        [$d, $ajustes] = wabot_comercial_validar($r['decision'], $texto, $conv, $cfg);
        $b = wabot_comercial_construir($d, $texto, $conv, $cfg);
        $accion = $b['accion'];
        $coincide = false;
        foreach ($esperados as $e) if (in_array($accion, $equivale[(string)$e] ?? [(string)$e], true)) { $coincide = true; break; }
        if ($coincide) $ok++; else $fallas[] = $fila + ['accion' => $accion];
        $costo += (float)($r['gastado']['costo_usd'] ?? 0);
        $segundos += (float)($r['segundos'] ?? 0);
        $fila += ['accion' => $accion, 'solucion' => $b['solucion'], 'intencion' => $b['intencion'], 'motivo' => $b['motivo'],
                  'decision_modelo' => $r['decision']['accion'], 'ajustes' => $ajustes, 'mensajes' => array_map(fn($m) => $m['t'], $b['mensajes']),
                  'efectos' => array_map(fn($m) => $m['efecto'], $b['mensajes']), 'segundos' => $r['segundos'] ?? null,
                  'costo_usd' => round((float)($r['gastado']['costo_usd'] ?? 0), 5), 'coincide' => $coincide];
        if ($conViejo && empty($conv['precio_dado']) && wabot_ia_turno_elegible($conv)) {
            $v = wabot_ia_pensar($texto, $conv, $cfg, 'prueba');
            $fila['viejo'] = $v['ok'] ? ['accion' => $v['decision']['accion'], 'tipo' => $v['decision']['tipo_web'], 'mensajes' => $v['decision']['mensajes'], 'info' => $v['decision']['info_claves']] : ['error' => $v['error']];
        }
        if (!$silencio || !$coincide) {
            echo "\n### {$caso['id']} [{$caso['grupo']}] esperado=" . json_encode($caso['esperado']) . " → {$accion}" . ($coincide ? ' ✓' : ' ✗')
               . " (modelo: {$r['decision']['accion']}" . ($ajustes ? ', red: ' . implode(',', $ajustes) : '') . ") sol={$b['solucion']} int={$b['intencion']}"
               . " {$fila['segundos']}s US\$" . $fila['costo_usd'] . "\n";
            foreach (array_slice((array)$caso['historial'], -3) as $l) echo '    ' . substr($l['q'], 0, 3) . ': ' . mb_substr(str_replace("\n", ' / ', $l['t']), 0, 160) . "\n";
            echo ' >> CLIENTE: ' . mb_substr(str_replace("\n", ' / ', $texto), 0, 300) . "\n";
            foreach ($b['mensajes'] as $m) echo ' << BOT [' . $m['efecto'] . ']: ' . mb_substr(str_replace("\n", ' / ', $m['t']), 0, 260) . "\n";
            if ($b['motivo']) echo '    motivo: ' . $b['motivo'] . "\n";
            foreach (array_slice((array)($caso['pablo'] ?? []), 0, 2) as $p) echo ' == PABLO: ' . mb_substr(str_replace("\n", ' / ', $p), 0, 200) . "\n";
            if (isset($fila['viejo'])) echo '    viejo: ' . json_encode($fila['viejo'], JSON_UNESCAPED_UNICODE) . "\n";
        }
    }
    @file_put_contents($guardar, json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}
echo "\n" . str_repeat('─', 60) . "\nCasos: $n · coinciden: $ok · no coinciden: " . count($fallas) . " · costo US\$" . round($costo, 3)
   . ' · latencia media ' . ($n ? round($segundos / $n, 1) : 0) . "s · total " . round(microtime(true) - $t0) . "s\nResultados: $guardar\n";
if ($fallas) {
    echo "\nNo coinciden:\n";
    foreach ($fallas as $f) echo "  {$f['id']}: esperado " . json_encode($f['esperado']) . " → {$f['accion']}" . (isset($f['error']) ? " ({$f['error']})" : '') . "\n";
}
