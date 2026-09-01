<?php
/* Igual que wabot/test-charlas.php —mismo pipeline, mismos filtros de salida—
 * con una sola diferencia: acepta un campo "estado" por escenario que se mezcla
 * en la conversación antes del primer turno. Sirve para probar fases a las que
 * no se llega escribiendo (postdemo necesita presentado_ts, que lo pone el
 * botón Presentar del panel). */
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';

$escenariosPath = $argv[1] ?? '';
$escenarios = json_decode((string)@file_get_contents($escenariosPath), true);
if (!is_array($escenarios)) { fwrite(STDERR, "json invalido: $escenariosPath\n"); exit(1); }

$soloIds = array_slice($argv, 2);
if ($soloIds) {
    $escenarios = array_values(array_filter($escenarios, function ($e) use ($soloIds) {
        return in_array($e['id'], $soloIds, true);
    }));
}
if (WABOT_GEMINI_KEY === 'COMPLETAR') { fwrite(STDERR, "Falta la key de Gemini.\n"); exit(1); }

$cfg = wabot_config_load();
$pausaEntreTurnos = 7;

echo "Bateria conversacional wabot — " . count($escenarios) . " escenarios, modo " . ($cfg['modo_redaccion'] ?? 'fijo')
   . ", motor " . wabot_version() . "\n";
echo "Las claves QATEST* no crean leads reales ni muestras. Revisar cada transcript A MANO contra su campo 'esperado'.\n";

foreach ($escenarios as $esc) {
    $clave = 'QATEST' . $esc['id'];
    @unlink(WABOT_DATA . '/conv/' . $clave . '.json');

    echo "\n########## ESCENARIO {$esc['id']} — {$esc['titulo']}\n";
    if (!empty($esc['esperado'])) echo "ESPERADO: {$esc['esperado']}\n";

    $conv = wabot_conv_load($clave);
    $conv['nombre'] = $esc['nombre'] ?? 'Cliente';
    if (!empty($esc['estado']) && is_array($esc['estado'])) {
        foreach ($esc['estado'] as $k => $v) {
            $conv[$k] = ($v === '@ahora') ? time() : $v;
        }
        echo "ESTADO PREVIO: fase={$conv['fase']} tipo=" . ($conv['tipo'] ?? '-')
           . " presentado=" . (!empty($conv['presentado_ts']) ? 'si' : 'no') . "\n";
    }

    foreach ($esc['turnos'] as $i => $msj) {
        echo ">>> CLIENTE: $msj\n";
        wabot_conv_transcript($conv, 'cliente', $msj);
        $conv['ultimo_cliente_ts'] = time();
        try {
            $r = wabot_salida_preparar(wabot_responder($msj, $conv, $cfg), $conv, $cfg);
        } catch (Throwable $e) {
            echo "!!! EXCEPCION: " . $e->getMessage() . "\n";
            $r = null;
        }
        if (!$r) {
            echo "<<< BOT: (silencio)\n";
        } else {
            foreach ((array)$r as $globo) {
                wabot_conv_transcript($conv, 'bot', $globo);
                echo "<<< BOT [" . mb_strlen($globo) . "c]: " . str_replace("\n", "\n           ", $globo) . "\n";
            }
        }
        $conv['ultimo_ts'] = time();
        echo "    [fase={$conv['fase']} tipo=" . ($conv['tipo'] ?? '-') . " precio_dado=" . (int)$conv['precio_dado']
           . " handoff=" . (int)$conv['handoff_pendiente'] . " lead=" . (int)$conv['lead_creado']
           . " cierre=" . ($conv['cierre'] ?? '-') . "]\n";
        if ($i < count($esc['turnos']) - 1) sleep($pausaEntreTurnos);
    }
    wabot_conv_save($conv);
    sleep($pausaEntreTurnos);
}

echo "\n########## FIN — borrar wabot/data/conv/QATEST*.json despues de revisar\n";
