<?php
/**
 * wabot/test-charlas-vivo-1oct.php — charlas contra OpenAI REAL (gpt-6-sol, modo openai forzado), mismo pipeline que el webhook.
 *   php wabot/test-charlas-vivo-1oct.php wabot/test-charlas-1oct.json [id ...]
 * Claves QATESTV*: sin leads ni envíos. Borrar wabot/data/conv/QATEST*.json después. Auditoría del 1-oct-2026.
 */
/* Runner de charlas contra OpenAI real (modo openai, gpt-6-sol), mismo pipeline que el webhook. Claves QATEST*: sin leads ni envíos. */
if (PHP_SAPI !== 'cli') exit;
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-vivo-1oct';
$escenarios = json_decode(file_get_contents($argv[1]), true);
$solo = array_slice($argv, 2);
$cfg = wabot_config_load();
$cfg['openai_modelo'] = 'gpt-6-sol';
$cfg['postprecio_activo'] = true;
echo "Modelo " . wabot_openai_modelo($cfg) . " · proveedor " . wabot_ia_proveedor($cfg) . " · motor " . wabot_version() . "\n";
$t0 = microtime(true);
foreach ($escenarios as $esc) {
    if ($solo && !in_array($esc['id'], $solo, true)) continue;
    $clave = 'QATESTV' . $esc['id'];
    @unlink(WABOT_DATA . '/conv/' . $clave . '.json');
    echo "\n########## {$esc['id']} — {$esc['titulo']}\nESPERADO: {$esc['esperado']}\n";
    $conv = wabot_conv_load($clave);
    $conv['nombre'] = $esc['nombre'] ?? 'Cliente';
    if (($esc['canal'] ?? '') === 'instagram') { $conv['canal'] = 'instagram'; }
    foreach ($esc['turnos'] as $i => $msj) {
        echo ">>> CLIENTE: $msj\n";
        wabot_conv_transcript($conv, 'cliente', $msj);
        $conv['ultimo_cliente_ts'] = time();
        $ti = microtime(true);
        try { $r = wabot_salida_preparar(wabot_responder($msj, $conv, $cfg), $conv, $cfg); }
        catch (Throwable $e) { echo "!!! EXCEPCION: " . $e->getMessage() . " @ " . $e->getFile() . ':' . $e->getLine() . "\n"; $r = null; }
        $seg = round(microtime(true) - $ti, 1);
        if (!$r) echo "<<< BOT: (silencio) [{$seg}s]\n";
        else foreach ((array)$r as $globo) {
            $legible = wabot_respuesta_texto_transcript($globo);
            wabot_conv_transcript($conv, 'bot', $legible);
            echo "<<< BOT [{$seg}s]: " . str_replace("\n", "\n           ", $legible) . "\n";
        }
        $conv['ultimo_ts'] = time();
        $ia = $conv['ia_ultimo'] ?? null;
        $ficha = wabot_ficha($conv);
        echo "    [fase={$conv['fase']} tipo=" . ($conv['tipo'] ?? '-') . " precio_dado=" . (int)($conv['precio_dado'] ?? 0)
           . " handoff=" . (int)($conv['handoff_pendiente'] ?? 0) . " bot_off=" . (int)($conv['bot_off'] ?? 0) . " control_manual=" . (int)($conv['control_manual'] ?? 0)
           . " form=" . (int)($conv['link_form_enviado'] ?? 0)
           . ($ia ? " ia={$ia['accion']}/{$ia['tipo_web']}" . (!empty($ia['motivo']) ? " motivo=\"{$ia['motivo']}\"" : '') : '')
           . (!empty($conv['postprecio_reglas']) ? " reglas=" . implode(',', $conv['postprecio_reglas']) : '')
           . (!empty($conv['postprecio_derivacion']) ? " derivacion=\"{$conv['postprecio_derivacion']}\"" : '')
           . " rubro=\"" . ($ficha['rubro'] ?? '') . "\"]\n";
        sleep(1);
    }
    wabot_conv_save($conv);
}
echo "\nTotal " . round(microtime(true) - $t0) . "s\n";
echo "Uso IA: " . json_encode(wabot_ia_uso_resumen(), JSON_UNESCAPED_UNICODE) . "\n";
