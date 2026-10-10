<?php
/**
 * wabot/anuncios-stats.php — las estadísticas por anuncio (Pablo, 9-oct: "es
 * posible llevar cuenta de estadísticas de distintas publicidades? Que el
 * bot/admin diferencie de qué anuncio viene la persona y poder hacer
 * estadísticas separadas según el anuncio?").
 *
 * Meta manda el id del anuncio (source_id) con el primer mensaje después del
 * clic. Desde el 25-sep queda en la charla (anuncio_id, ctwa_clid_ts; desde
 * el 9-oct también el texto y la imagen, en anuncio_visto y en la primera
 * línea del transcript); del 24-ago al 25-sep quedó solo en el log, y de ahí
 * se recupera (wabot_anuncios_clics_del_log). Instagram no lo manda por este
 * camino: esas charlas cuentan como sin anuncio. Acá se agrupa por ese id —no por el título, como la
 * vista por semanas: dos anuncios con el mismo título son dos creatividades
 * distintas— y se arma el embudo de cada uno con lo que ya guarda la charla.
 * Cada charla cuenta en la fecha del clic. Solo lee.
 */

/** Las etapas del embudo, en orden; cada una incluye a las siguientes. */
function wabot_anuncios_etapas() {
    return [
        'contactos'   => 'Escribieron',
        'respondieron' => 'Contaron qué hacen',
        'precio'      => 'Recibieron el precio',
        'formulario'  => 'Aceptaron la demo',
        'completaron' => 'Completaron el formulario',
        'demo'        => 'Demo entregada',
        'clientes'    => 'Pagaron / clientes',
    ];
}

/**
 * Hasta dónde llegó una charla: [etapa => bool]. Si llegó a una etapa,
 * cuenta en todas las anteriores (un cliente que pagó también "respondió",
 * aunque esa parte de la charla haya quedado archivada).
 */
function wabot_anuncios_etapas_de($cv, $cfg = null) {
    $hablamos = false; $respondio = false;
    foreach ((array)($cv['transcript'] ?? []) as $l) {
        $q = (string)($l['q'] ?? '');
        if ($q === 'bot' || $q === 'humano') $hablamos = true;
        elseif ($q === 'cliente' && $hablamos) { $respondio = true; break; }
    }
    $f = is_array($cv['ficha'] ?? null) ? $cv['ficha'] : [];
    $e = [
        'contactos'   => true,
        'respondieron' => $respondio || trim((string)($f['rubro'] ?? '')) !== '' || trim((string)($f['que_vende'] ?? '')) !== '',
        // El precio que pasó Pablo a mano no deja marca: se lee en la charla, como lo lee el bot.
        'precio'      => !empty($cv['precio_dado']) || !empty($cv['comercial_cotizacion']) || trim((string)($cv['precio_cotizado'] ?? '')) !== ''
                         || (is_array($cfg) && function_exists('wabot_comercial_cotizacion') && wabot_comercial_cotizacion($cv, $cfg) !== null),
        'formulario'  => (int)($cv['form_link_mandado_ts'] ?? 0) > 0 || !empty($cv['link_form_enviado']) || !empty($cv['esProspecto']),
        'completaron' => (int)($cv['form_completado_ts'] ?? 0) > 0 || !empty($cv['lead_creado']),
        'demo'        => (int)($cv['presentado_ts'] ?? 0) > 0,
        'clientes'    => (int)($cv['pago_avisado_ts'] ?? 0) > 0 || trim((string)($cv['cliente_id'] ?? '')) !== '',
    ];
    $siguiente = false;
    foreach (array_reverse(array_keys($e)) as $k) {
        if ($siguiente) $e[$k] = true;
        if ($e[$k]) $siguiente = true;
    }
    return $e;
}

/**
 * De qué anuncio vino la charla, o null si no vino de uno: id, fecha del clic
 * y lo que se vio (título, texto, link, imagen guardada).
 */
function wabot_anuncios_de_charla($clave, $cv) {
    $visto = is_array($cv['anuncio_visto'] ?? null) ? $cv['anuncio_visto'] : [];
    $id = trim((string)($cv['anuncio_id'] ?? ''));
    if ($id === '') $id = trim((string)($visto['id'] ?? ''));
    $clid = trim((string)($cv['ctwa_clid'] ?? ''));
    if ($id === '' && $clid === '' && !$visto) return null;
    $ts = (int)($cv['ctwa_clid_ts'] ?? 0);
    if ($ts <= 0) $ts = (int)($visto['ts'] ?? 0);
    if ($ts <= 0) $ts = (int)($cv['chat_started_ts'] ?? 0);
    $imagen = '';
    foreach ((array)($cv['transcript'] ?? []) as $l) {
        if (!empty($l['anuncio']['imagen'])) { $imagen = (string)$l['anuncio']['imagen']; break; }
    }
    return [
        'id' => $id !== '' ? $id : 'sin_id',
        'ts' => $ts,
        'titular' => trim((string)($cv['anuncio_titular'] ?? '')) ?: trim((string)($visto['titular'] ?? '')),
        'cuerpo' => trim((string)($visto['cuerpo'] ?? '')),
        'link' => trim((string)($visto['link'] ?? '')),
        'imagen' => $imagen !== '' ? ['clave' => (string)$clave, 'archivo' => $imagen] : null,
    ];
}

/**
 * Los clics de anuncio que quedaron solo en el log: del 24-ago (b81e928) al
 * 25-sep (b708fe5) el webhook anotaba `anuncio_referral` (tel + id del
 * anuncio) pero el dato se perdía antes de guardar la charla. Con esto esas
 * charlas también se atribuyen, sin título ni imagen (Meta no los mandaba
 * al log). Devuelve [clave => ['id', 'ts']]; si hizo clic dos veces, vale el
 * último, como en la charla.
 */
function wabot_anuncios_clics_del_log($desde, $hasta) {
    $hasta = min($hasta, strtotime('2026-09-26 00:00:00'));
    $desde = max($desde, strtotime('2026-08-24 00:00:00'));
    $dir = (string)($GLOBALS['WABOT_TEST_ANUNCIOS_LOG_DIR'] ?? (WABOT_DATA . '/log'));
    $r = [];
    for ($dia = strtotime(date('Y-m-d', $desde)); $dia !== false && $dia <= $hasta; $dia = strtotime('+1 day', $dia)) {
        $h = @fopen($dir . '/' . date('Y-m-d', $dia) . '.jsonl', 'r');
        if (!$h) continue;
        while (($linea = fgets($h)) !== false) {
            if (strpos($linea, '"tipo":"anuncio_referral"') === false) continue;
            $f = json_decode($linea, true);
            $ts = is_array($f) ? (int)strtotime((string)($f['ts'] ?? '')) : 0;
            $tel = is_array($f) ? preg_replace('/[^0-9A-Za-z]/', '', (string)($f['tel'] ?? '')) : '';
            if ($tel === '' || $ts < $desde || $ts > $hasta) continue;
            $r[$tel] = ['id' => trim((string)($f['anuncio'] ?? '')) ?: 'sin_id', 'ts' => $ts];
        }
        fclose($h);
    }
    return $r;
}

/** Las charlas a mirar; el test elige las suyas. */
function wabot_anuncios_archivos() {
    if (isset($GLOBALS['WABOT_TEST_ANUNCIOS_CLAVES'])) {
        return array_map('wabot_conv_path', (array)$GLOBALS['WABOT_TEST_ANUNCIOS_CLAVES']);
    }
    return glob(WABOT_DATA . '/conv/*.json') ?: [];
}

/**
 * El embudo de cada anuncio entre $desde y $hasta (fecha del clic), más el de
 * los que escribieron sin anuncio (por la fecha de su primer mensaje).
 * Devuelve ['anuncios' => [id => fila], 'organico' => fila, 'total' => fila],
 * con los anuncios del que más contactos trajo al que menos. Cada fila:
 * id, titular, cuerpo, descripcion, link, imagen, etapas [etapa => n],
 * contactos_detalle [[clave, nombre, ts, canal, llego]].
 */
function wabot_anuncios_stats($desde, $hasta) {
    $catalogo = json_decode((string)@file_get_contents(WABOT_DATA . '/anuncios.json'), true);
    if (!is_array($catalogo)) $catalogo = [];
    $vacia = function ($id) use ($catalogo) {
        return ['id' => $id, 'titular' => trim((string)($catalogo[$id]['titular'] ?? '')), 'cuerpo' => '', 'link' => '', 'imagen' => null,
                'descripcion' => trim((string)($catalogo[$id]['descripcion'] ?? '')),
                'etapas' => array_fill_keys(array_keys(wabot_anuncios_etapas()), 0), 'contactos_detalle' => []];
    };
    $r = ['anuncios' => [], 'organico' => $vacia('organico'), 'total' => $vacia('total')];
    $etiquetas = wabot_anuncios_etapas();
    $cfg = wabot_config_load();
    $delLog = wabot_anuncios_clics_del_log($desde, $hasta);

    foreach (wabot_anuncios_archivos() as $f) {
        $clave = basename($f, '.json');
        if (!isset($GLOBALS['WABOT_TEST_ANUNCIOS_CLAVES']) && stripos($clave, 'TEST') !== false) continue;
        // Un clic dentro del rango escribe la charla: si el archivo es anterior, no hay nada que contar.
        if ((int)@filemtime($f) < $desde) continue;
        try {
            $cv = wabot_conv_load($clave);
            $a = wabot_anuncios_de_charla($clave, $cv);
            if (!$a && isset($delLog[$clave])) {
                $a = ['id' => $delLog[$clave]['id'], 'ts' => $delLog[$clave]['ts'], 'titular' => '', 'cuerpo' => '', 'link' => '', 'imagen' => null, 'del_log' => true];
            }
            if ($a) {
                $ts = $a['ts'];
            } else {
                $ts = (int)($cv['chat_started_ts'] ?? 0);
                if ($ts <= 0 && !empty($cv['transcript'])) { $p = reset($cv['transcript']); $ts = (int)($p['ts'] ?? 0); }
            }
            if ($ts < $desde || $ts > $hasta) continue;
            $etapas = wabot_anuncios_etapas_de($cv, $cfg);
        } catch (\Throwable $err) {
            wabot_log('error', ['donde' => 'anuncios_stats', 'tel' => $clave, 'msg' => mb_substr($err->getMessage(), 0, 200)]);
            continue;
        }

        if ($a) {
            if (!isset($r['anuncios'][$a['id']])) $r['anuncios'][$a['id']] = $vacia($a['id']);
            $fila = &$r['anuncios'][$a['id']];
            foreach (['titular', 'cuerpo', 'link'] as $k) if ($fila[$k] === '' && $a[$k] !== '') $fila[$k] = $a[$k];
            if (!$fila['imagen'] && $a['imagen']) $fila['imagen'] = $a['imagen'];
        } else {
            $fila = &$r['organico'];
        }
        $llego = 'contactos';
        foreach ($etapas as $k => $si) {
            if (!$si) continue;
            $fila['etapas'][$k]++;
            $r['total']['etapas'][$k]++;
            $llego = $k;
        }
        // Los teléfonos y la ficha, para que el admin principal los cruce con `clientes` (como Contactos y clientes).
        $telWsp = trim((string)($cv['telefono_wsp'] ?? ''));
        $fila['contactos_detalle'][] = ['clave' => $clave, 'nombre' => function_exists('wabot_nombre_agenda') ? (string)wabot_nombre_agenda($cv) : (string)($cv['nombre'] ?? ''),
                                        'ts' => $ts, 'canal' => wabot_canal($cv), 'llego' => $etiquetas[$llego],
                                        'tel' => (string)($cv['channel_user_id'] ?? $clave), 'tel_whatsapp' => $telWsp !== '' ? $telWsp : (string)($cv['channel_user_id'] ?? $clave),
                                        'cliente_id' => (string)($cv['cliente_id'] ?? '')];
        unset($fila);
    }
    uasort($r['anuncios'], function ($x, $y) { return $y['etapas']['contactos'] <=> $x['etapas']['contactos'] ?: strcmp($x['id'], $y['id']); });
    foreach ($r['anuncios'] as &$fila) usort($fila['contactos_detalle'], function ($x, $y) { return $y['ts'] <=> $x['ts']; });
    unset($fila);
    usort($r['organico']['contactos_detalle'], function ($x, $y) { return $y['ts'] <=> $x['ts']; });
    return $r;
}
