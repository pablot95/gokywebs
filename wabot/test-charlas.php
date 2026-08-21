<?php
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';

$escenariosPath = $argv[1] ?? (__DIR__ . '/test-charlas.json');
if (!file_exists($escenariosPath)) {
    fwrite(STDERR, "uso: php wabot/test-charlas.php [escenarios.json]\n");
    exit(1);
}
$escenarios = json_decode(file_get_contents($escenariosPath), true);
if (!is_array($escenarios)) {
    fwrite(STDERR, "json invalido: $escenariosPath\n");
    exit(1);
}

$soloIds = array_slice($argv, 2);
if ($soloIds) {
    $escenarios = array_values(array_filter($escenarios, function ($e) use ($soloIds) {
        return in_array($e['id'], $soloIds, true);
    }));
}

if (WABOT_GEMINI_KEY === 'COMPLETAR') {
    fwrite(STDERR, "Falta la key de Gemini en config/wabot-config.php: esta bateria conversa con la IA real.\n");
    exit(1);
}

$cfg = wabot_config_load();
$pausaEntreTurnos = 7;

echo "Bateria conversacional wabot — " . count($escenarios) . " escenarios, modo " . ($cfg['modo_redaccion'] ?? 'fijo') . "\n";
echo "Las claves QATEST* no crean leads reales ni muestras. Revisar cada transcript A MANO contra su campo 'esperado'.\n";

foreach ($escenarios as $esc) {
    $clave = 'QATEST' . $esc['id'];
    @unlink(WABOT_DATA . '/conv/' . $clave . '.json');

    echo "\n########## ESCENARIO {$esc['id']} — {$esc['titulo']}\n";
    if (!empty($esc['esperado'])) echo "ESPERADO: {$esc['esperado']}\n";

    $conv = wabot_conv_load($clave);
    $conv['nombre'] = $esc['nombre'] ?? 'Cliente';

    foreach ($esc['turnos'] as $i => $msj) {
        echo ">>> CLIENTE: $msj\n";
        wabot_conv_transcript($conv, 'cliente', $msj);
        $conv['ultimo_cliente_ts'] = time();
        try {
            $r = wabot_responder($msj, $conv, $cfg);
        } catch (Throwable $e) {
            echo "!!! EXCEPCION: " . $e->getMessage() . "\n";
            $r = null;
        }
        if (!$r) {
            echo "<<< BOT: (silencio)\n";
        } else {
            foreach ((array)$r as $globo) {
                wabot_conv_transcript($conv, 'bot', $globo);
                $chars = mb_strlen($globo);
                echo "<<< BOT [{$chars}c]: " . str_replace("\n", "\n           ", $globo) . "\n";
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
