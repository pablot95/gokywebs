<?php
/**
 * wabot/test-charlas.php — la batería conversacional EN VIVO, con Gemini real (solo CLI).
 *
 *   php wabot/test-charlas.php                      → corre test-charlas.json
 *   php wabot/test-charlas.php otro.json            → otro fixture
 *   php wabot/test-charlas.php test-charlas.json 03 07   → solo esos ids
 *
 * Cada escenario trae "id", "titulo", "turnos" y "esperado" (para revisar A
 * MANO), y opcionalmente "nombre" y "estado": campos que se mezclan en la
 * conversación antes del primer turno, para llegar a fases a las que no se
 * llega escribiendo (postdemo necesita presentado_ts, que lo pone el botón
 * Presentar del panel; una charla ya cotizada necesita el precio congelado).
 * El valor "@ahora" se reemplaza por time().
 *
 * Mismo pipeline que webhook.php: wabot_responder() y después los filtros de
 * wabot_salida_preparar(). Una batería que no reproduce producción no sirve
 * para decidir si un fix funciona. Las claves QATEST* no crean leads reales.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';

$escenariosPath = $argv[1] ?? (__DIR__ . '/test-charlas.json');
if (!file_exists($escenariosPath)) {
    fwrite(STDERR, "uso: php wabot/test-charlas.php [escenarios.json] [id ...]\n");
    exit(1);
}
$escenarios = json_decode((string)file_get_contents($escenariosPath), true);
if (!is_array($escenarios)) {
    fwrite(STDERR, "json invalido: $escenariosPath\n");
    exit(1);
}

$soloIds = array_slice($argv, 2);
if ($soloIds) {
    $escenarios = array_values(array_filter($escenarios, function ($e) use ($soloIds) {
        return in_array((string)$e['id'], $soloIds, true);
    }));
}

if (WABOT_GEMINI_KEY === 'COMPLETAR') {
    fwrite(STDERR, "Falta la key de Gemini en config/wabot-config.php: esta bateria conversa con la IA real.\n");
    exit(1);
}

$cfg = wabot_config_load();
$pausaEntreTurnos = 7;

echo "Bateria conversacional wabot — " . count($escenarios) . " escenarios, motor " . wabot_version() . "\n";
echo "Las claves QATEST* no crean leads reales. Revisar cada transcript A MANO contra su campo 'esperado'.\n";

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
           . " precio_dado=" . (int)($conv['precio_dado'] ?? 0)
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
        echo "    [fase={$conv['fase']} tipo=" . ($conv['tipo'] ?? '-') . " precio_dado=" . (int)($conv['precio_dado'] ?? 0)
           . " handoff=" . (int)($conv['handoff_pendiente'] ?? 0) . " lead=" . (int)($conv['lead_creado'] ?? 0)
           . " cierre=" . ($conv['cierre'] ?? '-') . "]\n";
        if ($i < count($esc['turnos']) - 1) sleep($pausaEntreTurnos);
    }
    wabot_conv_save($conv);
    sleep($pausaEntreTurnos);
}

echo "\n########## FIN — borrar wabot/data/conv/QATEST*.json despues de revisar\n";
