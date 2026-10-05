<?php
/*
 * GokyWebs – err/agrupados.php
 * Resumen en disco de los errores de las webs, agrupados por hash (el mismo que usa el
 * panel): cuántas veces pasó y a cuántos visitantes distintos. Lo escribe log.php y lo
 * lee pendientes.php para la rutina de Claude en la nube, que no puede leer Firestore
 * (`errores_web` solo lo lee el admin logueado).
 *
 * - data/agrupados.json  { hash: { site, tipo, nivel, msg, src, line, col, stack, url, ua,
 *                                  primera, ultima, veces, visitantes[], urls[] } }
 * - data/estados.json    { hash: { estado, nota, rama, at } }  (lo escribe la rutina)
 *
 * Los dos viven en err/data/ (gitignored, con .htaccess que niega todo).
 */

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) { http_response_code(404); exit; }

const ERR_AGRUPADOS_DIAS = 14;      // se olvida un error que no se repite hace 14 días
const ERR_AGRUPADOS_MAX  = 3000;    // tope de grupos guardados (los más viejos se van)
const ERR_VISITANTES_MAX = 10;      // alcanza con saber si fueron 1, 2... o muchos

function err_data_dir() {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    return $dir;
}

/** Abre un JSON de data/ con lock exclusivo, se lo pasa a $cambiar y guarda lo que devuelve. */
function err_json_editar($nombre, callable $cambiar) {
    $fh = @fopen(err_data_dir() . '/' . $nombre, 'c+');
    if (!$fh) return null;
    flock($fh, LOCK_EX);
    $datos = json_decode((string)stream_get_contents($fh), true);
    if (!is_array($datos)) $datos = [];
    $datos = $cambiar($datos);
    ftruncate($fh, 0); rewind($fh);
    fwrite($fh, json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fh);
    flock($fh, LOCK_UN); fclose($fh);
    return $datos;
}

function err_json_leer($nombre) {
    $f = err_data_dir() . '/' . $nombre;
    if (!is_file($f)) return [];
    $fh = @fopen($f, 'r');
    if (!$fh) return [];
    flock($fh, LOCK_SH);
    $datos = json_decode((string)stream_get_contents($fh), true);
    flock($fh, LOCK_UN); fclose($fh);
    return is_array($datos) ? $datos : [];
}

/**
 * Suma una aparición del error $e (los campos que guarda log.php) a su grupo.
 * $visitante: identificador corto y anónimo (hash de IP + navegador).
 */
function err_agrupar($hash, array $e, $visitante, $ahora = null) {
    $ahora = $ahora ?? time();
    err_json_editar('agrupados.json', function ($g) use ($hash, $e, $visitante, $ahora) {
        $grupo = $g[$hash] ?? null;
        if (!is_array($grupo)) {
            $grupo = $e + ['primera' => $ahora, 'veces' => 0, 'visitantes' => [], 'urls' => []];
        }
        $grupo['ultima'] = $ahora;
        $grupo['veces'] = (int)$grupo['veces'] + 1;
        if (!in_array($visitante, $grupo['visitantes'], true) && count($grupo['visitantes']) < ERR_VISITANTES_MAX) $grupo['visitantes'][] = $visitante;
        if ($e['url'] !== '' && !in_array($e['url'], $grupo['urls'], true) && count($grupo['urls']) < 5) $grupo['urls'][] = $e['url'];
        // El stack más reciente suele ser el más útil (el primero puede venir de una versión vieja).
        if ($e['stack'] !== '') $grupo['stack'] = $e['stack'];
        $g[$hash] = $grupo;
        // Olvidar lo viejo y no crecer sin límite.
        $limite = $ahora - ERR_AGRUPADOS_DIAS * 86400;
        $g = array_filter($g, function ($x) use ($limite) { return is_array($x) && ($x['ultima'] ?? 0) >= $limite; });
        if (count($g) > ERR_AGRUPADOS_MAX) {
            uasort($g, function ($a, $b) { return ($b['ultima'] ?? 0) <=> ($a['ultima'] ?? 0); });
            $g = array_slice($g, 0, ERR_AGRUPADOS_MAX, true);
        }
        return $g;
    });
}
