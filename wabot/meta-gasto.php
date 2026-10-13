<?php
/**
 * wabot/meta-gasto.php — lo que se gastó en publicidad, leído de Meta (API de
 * Marketing). Pablo, 13-oct: "¿no podríamos agregar en Inversión el gasto
 * semanal de publicidad automáticamente?".
 *
 * Hasta acá el gasto de cada semana lo tipeaba él en Inversión (Firestore
 * `gastoPublicidad`). Ahora el admin le pide a este archivo el gasto día por
 * día de la cuenta publicitaria, lo suma por semana (de domingo a sábado, el
 * mismo id que usa Inversión) y lo usa en las semanas que no tienen un número
 * cargado a mano. También da el gasto de cada anuncio para Por anuncio.
 *
 * Meta da el gasto SIN impuestos: el admin le aplica el mismo × 1,23 que a lo
 * que tipea Pablo.
 *
 * Hace falta, del lado de Pablo, un token con el permiso ads_read sobre la
 * cuenta publicitaria (Usuarios del sistema del administrador comercial). El
 * de la API de conversiones no alcanza: ese solo manda eventos. Se carga en
 * Ajustes del panel del bot; sin token, todo esto queda callado.
 *
 * Lo que se trae se guarda en data/meta-gasto.json: si el token se vence o
 * Meta no contesta, lo ya leído sigue ahí.
 */

/* La API de Marketing jubila sus versiones antes que la de WhatsApp (la v21
   que usa el bot ya no sirve para esto). v25.0 salió el 18-feb-2026. */
define('WABOT_META_ADS_VERSION', 'v25.0');
/* La cuenta publicitaria de Gokywebs (la que muestra el Administrador de
   anuncios arriba de todo). No es secreta; la de Ajustes la pisa. */
define('WABOT_META_ADS_CUENTA_PROYECTO', '135326826');
/* Desde cuándo se trae la primera vez: los anuncios con datos en el bot
   arrancan el 24-ago-2026. */
define('WABOT_META_GASTO_DESDE', '2026-08-01');
/* Cada cuánto se vuelve a preguntar. Meta acomoda el gasto de los últimos días
   un rato después, así que en cada vuelta se piden de nuevo los últimos 35. */
define('WABOT_META_GASTO_FRESCO', 30 * 60);
define('WABOT_META_GASTO_REPASO_DIAS', 35);

function wabot_meta_ads_cuenta($cfg) {
    $c = preg_replace('/\D+/', '', (string)($cfg['meta_ads_cuenta'] ?? ''));
    return $c !== '' ? $c : WABOT_META_ADS_CUENTA_PROYECTO;
}

function wabot_meta_ads_token($cfg) {
    return trim((string)($cfg['meta_ads_token'] ?? ''));
}

function wabot_meta_ads_configurado($cfg) {
    return wabot_meta_ads_token($cfg) !== '';
}

function wabot_meta_gasto_archivo() {
    return $GLOBALS['WABOT_TEST_META_GASTO_ARCHIVO'] ?? (WABOT_DATA . '/meta-gasto.json');
}

function wabot_meta_gasto_anuncios_archivo() {
    return $GLOBALS['WABOT_TEST_META_GASTO_ANUNCIOS_ARCHIVO'] ?? (WABOT_DATA . '/meta-gasto-anuncios.json');
}

/**
 * Un GET a la API de Marketing que sigue las páginas. Devuelve
 * ['ok' => bool, 'filas' => [...], 'error' => texto para Pablo].
 * El token nunca sale de acá: ni en el error ni en el log.
 */
function wabot_meta_ads_get($ruta, array $params, $cfg) {
    $params['access_token'] = wabot_meta_ads_token($cfg);
    $url = 'https://graph.facebook.com/' . WABOT_META_ADS_VERSION . '/' . $ruta . '?' . http_build_query($params);
    $filas = [];
    for ($pagina = 0; $url !== '' && $pagina < 20; $pagina++) {
        if (isset($GLOBALS['WABOT_TEST_META_ADS']) && is_callable($GLOBALS['WABOT_TEST_META_ADS'])) {
            [$code, $res] = call_user_func($GLOBALS['WABOT_TEST_META_ADS'], $url);
        } elseif (!empty($GLOBALS['WABOT_TEST_SIN_RED'])) {
            return ['ok' => false, 'filas' => [], 'error' => 'sin red (test)'];
        } else {
            $ch = curl_init($url);
            curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20, CURLOPT_CONNECTTIMEOUT => 8]);
            $res = curl_exec($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($res === false) $res = json_encode(['error' => ['message' => 'sin conexión con Meta (' . curl_errno($ch) . ')']]);
            curl_close($ch);
        }
        $d = json_decode((string)$res, true);
        if ($code < 200 || $code >= 300 || !is_array($d) || !isset($d['data']) || !is_array($d['data'])) {
            $error = wabot_meta_ads_error_legible(is_array($d) ? ($d['error'] ?? []) : [], (int)$code);
            if (function_exists('wabot_log')) wabot_log('error', ['donde' => 'meta_gasto', 'http' => (int)$code, 'msg' => $error]);
            return ['ok' => false, 'filas' => [], 'error' => $error];
        }
        $filas = array_merge($filas, $d['data']);
        $url = (string)($d['paging']['next'] ?? '');
    }
    return ['ok' => true, 'filas' => $filas, 'error' => ''];
}

/** El error de Meta, dicho para Pablo: qué tocar para que vuelva a andar. */
function wabot_meta_ads_error_legible($err, $http) {
    $codigo = (int)($err['code'] ?? 0);
    $msg = mb_substr(trim((string)($err['message'] ?? '')), 0, 220);
    if ($codigo === 190) return 'El token venció o no es válido: generá uno nuevo y pegalo en Ajustes.';
    if (in_array($codigo, [10, 200, 270, 273, 294], true) || stripos($msg, 'ads_read') !== false || stripos($msg, 'permission') !== false) {
        return 'El token no tiene permiso para ver la cuenta publicitaria: tiene que tener ads_read y la cuenta asignada. (' . $msg . ')';
    }
    if (in_array($codigo, [4, 17, 32, 613, 80000, 80004], true)) return 'Meta frenó las consultas por un rato (límite de llamadas). Se reintenta solo.';
    if ($codigo === 100 && stripos($msg, 'act_') !== false) return 'Meta no encuentra esa cuenta publicitaria: revisá el número en Ajustes. (' . $msg . ')';
    return 'Meta contestó ' . ($http ?: 'sin respuesta') . ($msg !== '' ? ': ' . $msg : '');
}

function wabot_meta_gasto_leer_cache() {
    $d = json_decode((string)@file_get_contents(wabot_meta_gasto_archivo()), true);
    return is_array($d) ? $d : [];
}

/**
 * El gasto día por día de la cuenta, de data/meta-gasto.json, refrescado
 * contra Meta si tiene más de media hora (o si $forzar, con un minuto de
 * respiro para no martillar con el botón Recargar; 'ahora' = sin respiro, al
 * guardar un token nuevo en Ajustes).
 * Devuelve ['configurado', 'dias' => [Y-m-d => gasto], 'actualizado' => ts, 'error'].
 */
function wabot_meta_gasto($cfg, $forzar = false) {
    $cache = wabot_meta_gasto_leer_cache();
    $cuenta = wabot_meta_ads_cuenta($cfg);
    // Otra cuenta: lo guardado no sirve.
    if (($cache['cuenta'] ?? '') !== $cuenta) $cache = ['cuenta' => $cuenta, 'dias' => []];
    $dias = is_array($cache['dias'] ?? null) ? $cache['dias'] : [];
    $resultado = function ($error = '') use (&$cache, &$dias, $cfg) {
        ksort($dias);
        return ['configurado' => wabot_meta_ads_configurado($cfg), 'dias' => $dias,
                'actualizado' => (int)($cache['actualizado'] ?? 0), 'error' => $error];
    };
    if (!wabot_meta_ads_configurado($cfg)) return $resultado('');

    $ultimoIntento = max((int)($cache['actualizado'] ?? 0), (int)($cache['error_ts'] ?? 0));
    $espera = $forzar === 'ahora' ? 0 : ($forzar ? 60 : WABOT_META_GASTO_FRESCO);
    if ($ultimoIntento > 0 && time() - $ultimoIntento < $espera) return $resultado((string)($cache['error'] ?? ''));

    $hoy = date('Y-m-d');
    $desde = !empty($cache['actualizado']) ? date('Y-m-d', strtotime("-" . WABOT_META_GASTO_REPASO_DIAS . " days")) : WABOT_META_GASTO_DESDE;
    if ($desde < WABOT_META_GASTO_DESDE) $desde = WABOT_META_GASTO_DESDE;
    $r = wabot_meta_ads_get('act_' . $cuenta . '/insights', [
        'fields' => 'spend', 'level' => 'account', 'time_increment' => 1, 'limit' => 500,
        'time_range' => json_encode(['since' => $desde, 'until' => $hoy]),
    ], $cfg);
    if (!$r['ok']) {
        $cache['error'] = $r['error'];
        $cache['error_ts'] = time();
        wabot_json_guardar_atomico(wabot_meta_gasto_archivo(), json_encode($cache, JSON_UNESCAPED_UNICODE));
        return $resultado($r['error']);
    }
    // Meta no manda los días sin gasto: en el tramo pedido, lo que no vino es cero.
    foreach (array_keys($dias) as $dia) {
        if ($dia >= $desde && $dia <= $hoy) unset($dias[$dia]);
    }
    foreach ($r['filas'] as $f) {
        $dia = (string)($f['date_start'] ?? '');
        $gasto = round((float)($f['spend'] ?? 0), 2);
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dia) && $gasto > 0) $dias[$dia] = $gasto;
    }
    ksort($dias);
    $cache = ['cuenta' => $cuenta, 'dias' => $dias, 'actualizado' => time(), 'error' => '', 'error_ts' => 0];
    wabot_json_guardar_atomico(wabot_meta_gasto_archivo(), json_encode($cache, JSON_UNESCAPED_UNICODE));
    return $resultado('');
}

/** El domingo de la semana de un día (Y-m-d): el id de semana de Inversión. */
function wabot_meta_gasto_domingo($dia) {
    $d = new DateTime($dia . ' 12:00:00');
    $d->modify('-' . (int)$d->format('w') . ' days');
    return $d->format('Y-m-d');
}

/** [domingo => gasto de esa semana], sumando los días. */
function wabot_meta_gasto_semanas(array $dias) {
    $semanas = [];
    foreach ($dias as $dia => $gasto) {
        $dom = wabot_meta_gasto_domingo($dia);
        $semanas[$dom] = round(($semanas[$dom] ?? 0) + (float)$gasto, 2);
    }
    ksort($semanas);
    return $semanas;
}

/**
 * El gasto de cada anuncio entre dos fechas (Y-m-d), para Por anuncio. El id es
 * el mismo que manda WhatsApp con el clic (referral.source_id). Lo que no
 * aparece por anuncio (anuncios borrados o archivados, que Meta no lista) se
 * calcula contra el total de la cuenta en esas fechas.
 * Devuelve ['configurado', 'anuncios' => [id => ['nombre', 'gasto']], 'total', 'error'].
 */
function wabot_meta_gasto_anuncios($desde, $hasta, $cfg, $forzar = false) {
    $vacio = ['configurado' => wabot_meta_ads_configurado($cfg), 'anuncios' => [], 'total' => 0, 'error' => ''];
    if (!$vacio['configurado']) return $vacio;
    $cuenta = wabot_meta_ads_cuenta($cfg);
    $clave = $cuenta . '|' . $desde . '|' . $hasta;
    $cache = json_decode((string)@file_get_contents(wabot_meta_gasto_anuncios_archivo()), true);
    if (!is_array($cache)) $cache = [];
    $guardado = $cache[$clave] ?? null;
    $espera = $forzar ? 60 : WABOT_META_GASTO_FRESCO;
    if ($guardado && time() - (int)($guardado['ts'] ?? 0) < $espera) {
        return ['configurado' => true, 'anuncios' => $guardado['anuncios'], 'total' => $guardado['total'], 'error' => ''];
    }

    $r = wabot_meta_ads_get('act_' . $cuenta . '/insights', [
        'fields' => 'ad_id,ad_name,spend', 'level' => 'ad', 'limit' => 500,
        'time_range' => json_encode(['since' => $desde, 'until' => $hasta]),
    ], $cfg);
    if (!$r['ok']) {
        // Lo último que se leyó para esas fechas, si había, con el aviso.
        return $guardado ? ['configurado' => true, 'anuncios' => $guardado['anuncios'], 'total' => $guardado['total'], 'error' => $r['error']]
                         : array_merge($vacio, ['error' => $r['error']]);
    }
    $anuncios = [];
    foreach ($r['filas'] as $f) {
        $id = (string)($f['ad_id'] ?? '');
        $gasto = round((float)($f['spend'] ?? 0), 2);
        if ($id === '' || $gasto <= 0) continue;
        $anuncios[$id] = ['nombre' => (string)($f['ad_name'] ?? ''), 'gasto' => round(($anuncios[$id]['gasto'] ?? 0) + $gasto, 2)];
    }
    // El total de la cuenta en esas fechas sale del día por día.
    $total = 0;
    foreach (wabot_meta_gasto($cfg)['dias'] as $dia => $gasto) {
        if ($dia >= $desde && $dia <= $hasta) $total += (float)$gasto;
    }
    $total = round(max($total, array_sum(array_column($anuncios, 'gasto'))), 2);

    $cache[$clave] = ['ts' => time(), 'anuncios' => $anuncios, 'total' => $total];
    // Solo los últimos rangos pedidos: el archivo no crece sin fin.
    uasort($cache, function ($a, $b) { return (int)($b['ts'] ?? 0) <=> (int)($a['ts'] ?? 0); });
    $cache = array_slice($cache, 0, 12, true);
    wabot_json_guardar_atomico(wabot_meta_gasto_anuncios_archivo(), json_encode($cache, JSON_UNESCAPED_UNICODE));
    return ['configurado' => true, 'anuncios' => $anuncios, 'total' => $total, 'error' => ''];
}
