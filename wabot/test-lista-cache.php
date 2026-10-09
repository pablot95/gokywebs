<?php
/**
 * La lista de Conversaciones guardada en data/lista-cache.json (9-oct-2026,
 * "anda muy lento gokywebs"): una charla se vuelve a leer solo si su archivo
 * cambió o si su fila venció. Las demás suites la arman de cero; esta prende
 * la caché con WABOT_TEST_LISTA_CACHE.
 */
require_once __DIR__ . '/test-lib.php';
$GLOBALS['WABOT_TEST_LISTA_CACHE'] = true;
$ruta = WABOT_DATA . '/lista-cache.json';
@unlink($ruta);

$claves = ['5491100000101TEST', '5491100000102TEST'];
foreach ($claves as $i => $k) {
    @unlink(wabot_conv_path($k));
    $c = conv_nueva($k, ['nombre' => "Cliente $i", 'transcript' => [['q' => 'cliente', 't' => "hola $i", 'ts' => time() - 60 * ($i + 1)]]]);
    wabot_conv_save($c);
}
$fila = function ($k) {
    foreach (wabot_lista_items() as $it) if ($it['tel'] === $k) return $it;
    return null;
};

caso('la primera vez arma la lista y la guarda', ($fila($claves[0])['nombre'] ?? '') === 'Cliente 0' && is_file($ruta));
$leer = fn() => json_decode((string)file_get_contents($ruta), true);
$escribir = fn($c) => file_put_contents($ruta, json_encode($c, JSON_UNESCAPED_UNICODE));
$cache = $leer();
$c0 = $cache['filas'][$claves[0]] ?? [];
caso('cada fila guarda la fecha, el tamaño y el inodo del archivo y cuándo vence; la caché, la versión del código',
    isset($c0['m'], $c0['s'], $c0['n'], $c0['vence'], $c0['i']) && $c0['vence'] > time() && $c0['vence'] <= time() + WABOT_LISTA_CACHE_SEG
    && ($cache['version'] ?? '') !== '');

// Una marca en la caché prueba que la fila salió de ahí y no de releer la charla.
$cache['filas'][$claves[0]]['i']['nombre'] = 'DESDE_CACHE';
$escribir($cache);
caso('si la charla no cambió, la fila sale de la caché', ($fila($claves[0])['nombre'] ?? '') === 'DESDE_CACHE');

// Otra versión del código (un deploy): se arma de cero.
$cache = $leer();
$cache['version'] = 'otra';
$cache['filas'][$claves[0]]['i']['nombre'] = 'DESDE_CACHE';
$escribir($cache);
caso('si cambió el código, la lista se arma de cero', ($fila($claves[0])['nombre'] ?? '') === 'Cliente 0');

// Cambia la charla (otro tamaño): se vuelve a leer.
$c = wabot_conv_load($claves[0]);
$c['nombre'] = 'Cliente Cambiado';
wabot_conv_transcript($c, 'cliente', 'mensaje nuevo, más largo que el anterior');
wabot_conv_save($c);
clearstatcache();
$f0 = $fila($claves[0]);
caso('si la charla cambió, la fila se vuelve a leer', ($f0['nombre'] ?? '') === 'Cliente Cambiado' && ($f0['ult'] ?? '') === 'mensaje nuevo, más largo que el anterior');

// Una fila vencida se vuelve a leer aunque el archivo sea el mismo (lo que depende de la hora).
$cache = $leer();
$cache['filas'][$claves[1]]['i']['nombre'] = 'VIEJA';
$cache['filas'][$claves[1]]['vence'] = time() - 1;
$escribir($cache);
caso('una fila vencida se vuelve a leer', ($fila($claves[1])['nombre'] ?? '') === 'Cliente 1');

// Una charla borrada desaparece de la lista y de la caché.
@unlink(wabot_conv_path($claves[1]));
caso('una charla borrada sale de la lista', $fila($claves[1]) === null && !isset($leer()['filas'][$claves[1]]));

caso('la lista sigue ordenada por actividad', (function () {
    $ts = array_map(fn($it) => (int)$it['ts'], wabot_lista_items());
    $ord = $ts; rsort($ord);
    return $ts === $ord;
})());

foreach ($claves as $k) @unlink(wabot_conv_path($k));
@unlink($ruta);
unset($GLOBALS['WABOT_TEST_LISTA_CACHE']);
todo_ok();
