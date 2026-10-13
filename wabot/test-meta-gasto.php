<?php
/**
 * wabot/test-meta-gasto.php — el gasto en publicidad leído de Meta (meta-gasto.php, 13-oct-2026), sin red.
 *
 *   php wabot/test-meta-gasto.php
 *
 * La API de Marketing es un doble que contesta lo que dice cada caso. Suma
 * por semana de domingo a sábado, sigue las páginas, los días sin gasto son
 * cero, no vuelve a preguntar antes de media hora, si Meta falla queda lo ya
 * leído y el token nunca aparece en lo que se guarda ni en el error.
 * Escribe dos .json en el directorio temporal y los borra al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/meta-gasto.php';

$tmp = sys_get_temp_dir() . '/wabot-test-meta-' . getmypid();
$GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO'] = $tmp . '-dias.json';
$GLOBALS['WABOT_TEST_META_GASTO_ANUNCIOS_ARCHIVO'] = $tmp . '-anuncios.json';
$borrar = function () { @unlink($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO']); @unlink($GLOBALS['WABOT_TEST_META_GASTO_ANUNCIOS_ARCHIVO']); };
$borrar();

$TOKEN = 'EAAtokenSecreto123';
$cfg = ['meta_ads_token' => $TOKEN];
$pedidos = [];
// Lo que contesta Meta: una función por caso que recibe los parámetros del pedido.
$contesta = null;
$GLOBALS['WABOT_TEST_META_ADS'] = function ($url) use (&$pedidos, &$contesta) {
    $pedidos[] = $url;
    parse_str((string)parse_url($url, PHP_URL_QUERY), $q);
    return $contesta($q, $url);
};
$ok = function (array $data, $next = '') {
    return [200, json_encode(['data' => $data] + ($next !== '' ? ['paging' => ['next' => $next]] : []))];
};
$dia = function ($fecha, $gasto) { return ['spend' => (string)$gasto, 'date_start' => $fecha, 'date_stop' => $fecha]; };

echo "Semanas\n";
caso('el domingo es el id de la semana', wabot_meta_gasto_domingo('2026-10-11') === '2026-10-11'
    && wabot_meta_gasto_domingo('2026-10-13') === '2026-10-11' && wabot_meta_gasto_domingo('2026-10-17') === '2026-10-11'
    && wabot_meta_gasto_domingo('2026-10-10') === '2026-10-04');
$s = wabot_meta_gasto_semanas(['2026-10-10' => 100.5, '2026-10-11' => 200, '2026-10-13' => 50.25, '2026-10-04' => 10]);
caso('suma de domingo a sábado', $s === ['2026-10-04' => 110.5, '2026-10-11' => 250.25], json_encode($s));

echo "Sin token\n";
$contesta = function () { return [500, '']; };
$r = wabot_meta_gasto([]);
caso('sin token no pregunta nada y avisa que no está configurado', !$r['configurado'] && $r['dias'] === [] && $r['error'] === '' && !$pedidos);
$r = wabot_meta_gasto_anuncios('2026-10-01', '2026-10-13', []);
caso('por anuncio, lo mismo', !$r['configurado'] && $r['anuncios'] === [] && !$pedidos);
caso('la cuenta de fábrica es la de Gokywebs; la de Ajustes la pisa',
    wabot_meta_ads_cuenta([]) === '135326826' && wabot_meta_ads_cuenta(['meta_ads_cuenta' => 'act_999']) === '999');
caso('el token y la cuenta se guardan desde el panel', !array_diff(['meta_ads_token', 'meta_ads_cuenta'], wabot_ajustes_claves()));

echo "Primera lectura\n";
$contesta = function ($q, $url) use ($ok, $dia) {
    if (strpos($url, 'pagina2') !== false) return $ok([$dia('2026-10-12', '3000.50')]);
    return $ok([$dia('2026-10-04', '1000'), $dia('2026-10-11', '2000')], 'https://graph.facebook.com/v25.0/act_135326826/insights?pagina2=1&access_token=x');
};
$r = wabot_meta_gasto($cfg);
$q0 = []; parse_str((string)parse_url($pedidos[0], PHP_URL_QUERY), $q0);
caso('pide a la cuenta publicitaria, día por día, desde el 1-ago la primera vez',
    strpos($pedidos[0], '/' . WABOT_META_ADS_VERSION . '/act_135326826/insights?') !== false && ($q0['time_increment'] ?? '') === '1'
    && ($q0['level'] ?? '') === 'account' && json_decode($q0['time_range'] ?? '', true)['since'] === WABOT_META_GASTO_DESDE
    && json_decode($q0['time_range'], true)['until'] === date('Y-m-d') && ($q0['fields'] ?? '') === 'spend');
caso('sigue las páginas', count($pedidos) === 2 && $r['dias'] === ['2026-10-04' => 1000.0, '2026-10-11' => 2000.0, '2026-10-12' => 3000.5], json_encode($r['dias']));
caso('queda configurado, sin error y con la hora', $r['configurado'] && $r['error'] === '' && $r['actualizado'] >= time() - 5);
$guardado = (string)@file_get_contents($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO']);
caso('lo guarda en disco, sin el token', $guardado !== '' && strpos($guardado, $TOKEN) === false);

echo "Media hora\n";
$pedidos = [];
$r = wabot_meta_gasto($cfg);
caso('antes de media hora no vuelve a preguntar', !$pedidos && count($r['dias']) === 3);
$r = wabot_meta_gasto($cfg, true);
caso('el botón Actualizar tampoco, si pasó menos de un minuto', !$pedidos);

echo "Repaso de los últimos días\n";
// Hace 40 minutos: toca preguntar de nuevo, solo los últimos 35 días.
$c = json_decode($guardado, true); $c['actualizado'] = time() - 40 * 60;
$c['dias'][date('Y-m-d', strtotime('-3 days'))] = 999;   // un día que Meta ahora no manda: sin gasto
$c['dias']['2026-08-05'] = 777;                        // viejo, fuera del repaso: queda
file_put_contents($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO'], json_encode($c));
$ayer = date('Y-m-d', strtotime('-1 day'));
$contesta = function () use ($ok, $dia, $ayer) { return $ok([$dia($ayer, '4500.25')]); };
$r = wabot_meta_gasto($cfg);
$q1 = []; parse_str((string)parse_url($pedidos[0] ?? '', PHP_URL_QUERY), $q1);
$since = json_decode($q1['time_range'] ?? '{}', true)['since'] ?? '';
caso('pide solo los últimos 35 días', $since === max(WABOT_META_GASTO_DESDE, date('Y-m-d', strtotime('-35 days'))), $since);
caso('lo nuevo entra, lo que Meta ya no manda en ese tramo es cero y lo viejo queda',
    ($r['dias'][$ayer] ?? null) === 4500.25 && !isset($r['dias'][date('Y-m-d', strtotime('-3 days'))]) && ($r['dias']['2026-08-05'] ?? null) == 777,
    json_encode($r['dias']));

echo "Meta falla\n";
$c = json_decode((string)file_get_contents($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO']), true);
$c['actualizado'] = time() - 40 * 60;
file_put_contents($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO'], json_encode($c));
$pedidos = [];
$contesta = function () { return [400, json_encode(['error' => ['message' => 'Error validating access token: Session has expired', 'type' => 'OAuthException', 'code' => 190]])]; };
$r = wabot_meta_gasto($cfg);
caso('token vencido: lo dice en criollo', strpos($r['error'], 'venció') !== false, $r['error']);
caso('lo ya leído sigue ahí', ($r['dias'][$ayer] ?? null) == 4500.25);
caso('el error no trae el token', strpos(json_encode($r), $TOKEN) === false && strpos((string)file_get_contents($GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO']), $TOKEN) === false);
$pedidos = [];
$r = wabot_meta_gasto($cfg);
caso('después de un error espera también (no martilla a Meta)', !$pedidos && $r['error'] !== '');
$contesta = function () { return [403, json_encode(['error' => ['message' => '(#200) Ad account owner has NOT grant ads_management or ads_read permission', 'code' => 200]])]; };
$r = wabot_meta_gasto($cfg, 'ahora');
caso('al guardar un token nuevo se prueba en el momento', count($pedidos) === 1);
caso('sin ads_read: dice qué permiso falta', strpos($r['error'], 'ads_read') !== false, $r['error']);

echo "Otra cuenta\n";
$pedidos = [];
$contesta = function () use ($ok, $dia) { return $ok([$dia('2026-10-13', '10')]); };
$r = wabot_meta_gasto($cfg + ['meta_ads_cuenta' => '555']);
$q2 = []; parse_str((string)parse_url($pedidos[0] ?? '', PHP_URL_QUERY), $q2);
caso('con otra cuenta no mezcla lo de la anterior y la lee desde el principio',
    $r['dias'] === ['2026-10-13' => 10.0] && strpos($pedidos[0] ?? '', '/act_555/') !== false
    && (json_decode($q2['time_range'] ?? '{}', true)['since'] ?? '') === WABOT_META_GASTO_DESDE);

echo "Por anuncio\n";
$borrar();
$pedidos = [];
$contesta = function ($q) use ($ok, $dia) {
    if (($q['level'] ?? '') === 'ad') {
        return $ok([['ad_id' => '120200000000000001', 'ad_name' => 'Multiimagenes', 'spend' => '1500'],
                    ['ad_id' => '120200000000000002', 'ad_name' => 'Video', 'spend' => '500.5'],
                    ['ad_id' => '120200000000000003', 'ad_name' => 'Apagado', 'spend' => '0']]);
    }
    return $ok([$dia('2026-10-01', '1200'), $dia('2026-10-02', '1000'), $dia('2026-09-20', '50000')]);
};
$r = wabot_meta_gasto_anuncios('2026-10-01', '2026-10-13', $cfg);
$qa = []; parse_str((string)parse_url($pedidos[0], PHP_URL_QUERY), $qa);
caso('pide por anuncio, en esas fechas', ($qa['level'] ?? '') === 'ad' && json_decode($qa['time_range'], true) === ['since' => '2026-10-01', 'until' => '2026-10-13']);
caso('por id de anuncio, con el nombre de Meta; los que no gastaron no van',
    count($r['anuncios']) === 2 && $r['anuncios']['120200000000000001'] === ['nombre' => 'Multiimagenes', 'gasto' => 1500.0], json_encode($r['anuncios']));
caso('el total es el de la cuenta en esas fechas (incluye los que Meta ya no lista)', $r['total'] === 2200.0, (string)$r['total']);
$pedidos = [];
$r = wabot_meta_gasto_anuncios('2026-10-01', '2026-10-13', $cfg);
caso('las mismas fechas antes de media hora no vuelven a preguntar', !$pedidos && count($r['anuncios']) === 2);
$c = json_decode((string)file_get_contents($GLOBALS['WABOT_TEST_META_GASTO_ANUNCIOS_ARCHIVO']), true);
foreach ($c as &$x) $x['ts'] = time() - 3600; unset($x);
file_put_contents($GLOBALS['WABOT_TEST_META_GASTO_ANUNCIOS_ARCHIVO'], json_encode($c));
$contesta = function () { return [500, json_encode(['error' => ['message' => 'An unknown error occurred', 'code' => 1]])]; };
$r = wabot_meta_gasto_anuncios('2026-10-01', '2026-10-13', $cfg);
caso('si Meta falla, queda lo último leído para esas fechas, con el aviso', count($r['anuncios']) === 2 && $r['error'] !== '', $r['error']);
$r = wabot_meta_gasto_anuncios('2026-01-01', '2026-01-31', $cfg);
caso('y si nunca se leyeron esas fechas, vacío con el aviso', $r['anuncios'] === [] && $r['error'] !== '');

$borrar();
todo_ok();
