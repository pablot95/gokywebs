<?php
/**
 * Factura sola cada mensualidad que cobra Mercado Pago (26-sep-2026).
 *
 * Lo corre el cron de Hostinger cada hora:
 *   /usr/bin/php /home/u739671719/domains/gokywebs.com/public_html/mantenimiento/api/facturar-cobros.php
 * Busca en la API de Mercado Pago los cobros aprobados de las suscripciones y
 * emite la Factura C de cada uno que todavía no la tenga (la lógica está en
 * config/arca/suscripciones.php). Correrlo de más no factura dos veces: cada
 * cobro queda en el registro con el ID de su pago en Mercado Pago.
 *
 * No hace nada hasta que se activa en el admin (Mantenimiento → Facturación),
 * y factura solo los cobros aprobados desde ese momento.
 *
 * Solo por consola: por HTTP da 404, porque emite facturas.
 *   php facturar-cobros.php --simular                    qué facturaría, sin emitir ni guardar nada
 *   php facturar-cobros.php --simular --desde=2026-09-01  ídem, como si se hubiera activado ese día
 *   php facturar-cobros.php --diagnostico                chequea sin emitir lo que necesita (PHP, MP, registro, ARCA)
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/../../config/arca/suscripciones.php';

$opciones = getopt('', ['simular', 'desde:', 'diagnostico']);
$simular = isset($opciones['simular']);
$config = require __DIR__ . '/../../config/arca/arca-config.php';

if (isset($opciones['diagnostico'])) {
    facturar_cobros_diagnostico($config);
    exit(0);
}

// Una corrida a la vez: si una se estira (ARCA lento), la siguiente del cron sale sin hacer nada.
$corriendo = fopen($config['automaticaEstado'] . '.corrida', 'c');
if (!$simular && (!$corriendo || !flock($corriendo, LOCK_EX | LOCK_NB))) {
    echo "Hay otra corrida en curso.\n";
    exit(0);
}

$estadoAnterior = [];
try {
    $estadoAnterior = sus_estado($config);
} catch (Throwable $e) {
    // Lo va a volver a encontrar sus_correr() y ahí queda anotado.
}

try {
    $resumen = sus_correr($config, $simular ? null : new Arca($config), 'sus_mp', [
        'simular' => $simular,
        'desde' => $opciones['desde'] ?? '',
    ]);
} catch (Throwable $e) {
    $resumen = [
        'inicio' => gmdate('c'), 'simulada' => $simular, 'emitidas' => [], 'errores' => [],
        'aManoDetectadas' => [], 'quedan' => 0, 'aviso' => '', 'falla' => $e->getMessage(),
    ];
}

$texto = facturar_cobros_texto($resumen);
echo $texto;
if ($simular) exit(0);

@file_put_contents(
    dirname($config['automaticaEstado']) . '/facturacion-automatica.log',
    gmdate('Y-m-d H:i:s') . ' | ' . str_replace("\n", ' / ', trim($texto)) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);
try {
    sus_anotar_corrida($config, $resumen);
} catch (Throwable $e) {
    echo 'No se pudo anotar la corrida: ' . $e->getMessage() . "\n";
}
facturar_cobros_avisar($resumen, $estadoAnterior['ultimaCorrida']['falla'] ?? '');

/**
 * Chequeo sin emitir de lo que el proceso necesita, con el mismo PHP del cron:
 * extensiones, token de Mercado Pago, registro, escritura en config/arca y ARCA
 * (el último número del punto de venta, que no emite nada). Correrlo en el
 * server y nunca desde otra máquina contra producción: pedirle un ticket a ARCA
 * desde otro lado deja al server sin ticket hasta que venza (12 h).
 */
function facturar_cobros_diagnostico(array $config)
{
    $pruebas = [
        'PHP ' . PHP_VERSION => function () {
            $faltan = array_filter(['curl', 'openssl', 'dom', 'mbstring'], function ($e) { return !extension_loaded($e); });
            if ($faltan) throw new RuntimeException('faltan extensiones: ' . implode(', ', $faltan));
            return 'curl, openssl, dom y mbstring';
        },
        'Mercado Pago' => function () { return 'cuenta ' . sus_yo('sus_mp'); },
        'Registro de facturas' => function () use ($config) { return count(registro_leer($config)) . ' facturas'; },
        'Facturación automática' => function () use ($config) {
            $a = sus_ajustes($config);
            return $a['activa'] ? 'activa desde ' . $a['desde'] : ($a['desde'] !== '' ? 'pausada' : 'sin activar');
        },
        'Escritura en config/arca' => function () use ($config) {
            $prueba = $config['automaticaEstado'] . '.prueba';
            if (@file_put_contents($prueba, 'ok') === false) throw new RuntimeException('no se puede escribir');
            @unlink($prueba);
            return 'ok';
        },
        'ARCA ' . $config['entorno'] => function () use ($config) {
            return 'último comprobante C del punto de venta ' . $config['puntoVenta'] . ': '
                . (new Arca($config))->ultimoComprobante($config['puntoVenta'], 11);
        },
    ];
    foreach ($pruebas as $que => $prueba) {
        try {
            echo "OK     $que: " . $prueba() . "\n";
        } catch (Throwable $e) {
            echo "FALLA  $que: " . $e->getMessage() . "\n";
        }
    }
}

function facturar_cobros_texto(array $r)
{
    $pesos = function ($monto) { return '$' . number_format((float) $monto, 0, ',', '.'); };
    $lineas = [];
    if (!empty($r['falla'])) $lineas[] = 'FALLA: ' . $r['falla'];
    if ($r['aviso'] !== '') $lineas[] = $r['aviso'];
    foreach ($r['emitidas'] as $e) {
        $lineas[] = ($r['simulada'] ? 'Facturaría ' : 'Emitida ')
            . ($e['numero'] ? 'C ' . str_pad((string) $e['puntoVenta'], 4, '0', STR_PAD_LEFT) . '-' . str_pad((string) $e['numero'], 8, '0', STR_PAD_LEFT) . ' ' : '')
            . $pesos($e['monto']) . ' · ' . ($e['nombre'] !== '' ? $e['nombre'] : $e['suscripcion'])
            . ' · cobro ' . $e['cobro'] . ' del ' . $e['dia'] . ' · a ' . $e['receptor']
            . (($e['resultado'] ?? '') === 'recuperada' ? ' (recuperada de un intento anterior)' : '');
    }
    foreach ($r['aManoDetectadas'] as $m) {
        $lineas[] = 'Cobro ' . $m['cobro'] . ': ya estaba facturado a mano (' . $m['factura'] . ')';
    }
    foreach ($r['errores'] as $e) {
        $lineas[] = 'ERROR cobro ' . $e['cobro'] . ' (' . $pesos($e['monto']) . ', ' . ($e['nombre'] ?: $e['suscripcion']) . '): ' . $e['mensaje'];
    }
    if ($r['quedan'] > 0) $lineas[] = 'Quedan ' . $r['quedan'] . ' cobros para la próxima corrida.';
    if (!$lineas) $lineas[] = 'Nada para facturar.';
    return implode("\n", $lineas) . "\n";
}

/**
 * Aviso al celular de Pablo (las mismas notificaciones del bot, wabot/push.php):
 * cada factura emitida, cada cobro que no se pudo facturar (la primera vez) y
 * si la corrida entera empieza a fallar. El aviso es lo de menos: si falla, las
 * facturas ya están.
 */
function facturar_cobros_avisar(array $r, $fallaAnterior)
{
    $pesos = function ($monto) { return '$' . number_format((float) $monto, 0, ',', '.'); };
    $nombre = function ($e) { return $e['nombre'] !== '' ? $e['nombre'] : 'Suscripción'; };
    // Cada aviso con su etiqueta: los de la misma etiqueta se reemplazan en la barra del celular.
    $avisos = [];
    $emitidas = $r['emitidas'];
    if (count($emitidas) === 1) {
        $avisos[] = ['Factura emitida · ' . $pesos($emitidas[0]['monto']), $nombre($emitidas[0]) . ' · ' . $emitidas[0]['receptor'], 'facturas'];
    } elseif ($emitidas) {
        $avisos[] = [
            count($emitidas) . ' facturas emitidas · ' . $pesos(array_sum(array_column($emitidas, 'monto'))),
            implode(', ', array_map($nombre, $emitidas)),
            'facturas',
        ];
    }
    foreach ($r['errores'] as $e) {
        if (!empty($e['nuevo'])) {
            $avisos[] = ['No se pudo facturar un cobro', $nombre($e) . ' · ' . $pesos($e['monto']) . ': ' . $e['mensaje'], 'facturas-error-' . $e['cobro']];
        }
    }
    if (!empty($r['falla']) && $r['falla'] !== $fallaAnterior) {
        $avisos[] = ['La facturación automática falló', $r['falla'], 'facturas-falla'];
    }
    // Un require de un archivo que no está es un error fatal que ningún catch agarra.
    $push = __DIR__ . '/../../wabot/push.php';
    if (!$avisos || !is_file($push)) return;

    try {
        require_once $push;
        foreach ($avisos as [$titulo, $cuerpo, $etiqueta]) {
            wabot_push_enviar($titulo, mb_substr($cuerpo, 0, 180), [
                'link' => 'https://www.gokywebs.com/admin/dashboard.html',
                'tel' => $etiqueta,
            ]);
        }
    } catch (Throwable $e) {
        echo 'No se pudo avisar al celular: ' . $e->getMessage() . "\n";
    }
}
