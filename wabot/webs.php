<?php
/**
 * wabot/webs.php — lo que el mantenimiento hace sin que nadie lo vea, contado
 * por WhatsApp (Pablo, 29-oct: "hacer visible lo invisible, lo vamos a mandar
 * por wabot a través de plantilla así se automatiza").
 *
 * Dos plantillas de Utilidad (ver plantillas-meta.md):
 *   - `reporte_mensual_web`: a partir del día 1 (de 10 a 20 h), a cada cliente
 *     con mantenimiento, el resumen del mes anterior de su web: disponibilidad,
 *     visitas, errores y certificado de seguridad. Una vez por mes y por cliente.
 *   - `web_caida_resuelta`: cuando una web que estuvo caída vuelve a responder,
 *     el aviso de que pasó y ya está. Solo si estuvo caída un rato de verdad
 *     (WABOT_WEBS_CAIDA_MIN), en horario de contacto (si fue de noche, sale a la
 *     mañana) y como mucho una vez por día por web. Pablo recibe el push siempre,
 *     al caerse y al volver.
 *
 * Quiénes son y qué dominio tiene cada uno lo sabe el admin (Mantenimiento):
 * igual que con la renovación (renovacion.php), se lo pasa al bot cada vez que
 * cambia (accion webs_sync de admin.php) y acá queda en data/webs.json:
 *   lista:    [{id, tel, persona, negocio, dominio, plan, desde}]   id = "coleccion:docId"
 *   sync_ts:  cuándo la mandó el admin
 *   reportes: {id: {mes: "YYYY-MM", ts, ok, resultado}}   un reporte por mes y por cliente
 *
 * El monitoreo corre en cada pasada del cron (seguimiento.php, 0 y 30): pide la
 * portada de cada dominio por https (las que fallan se vuelven a pedir en la
 * misma pasada antes de darlas por caídas) y guarda data/webs-estado.json, por
 * dominio: {ok, desde_ts, ultimo_ts, http, motivo, ssl_hasta_ts,
 *           meses: {"YYYY-MM": {chequeos, fallidos, dias: {"DD": 1}}},
 *           caidas: [{desde, hasta, motivo}], aviso_pendiente: {desde, hasta}|null, aviso_ts}
 *
 * Las visitas y los errores del mes los suma err/log.php (misma máquina) en
 * err/data/visitas-YYYY-MM.json y err/data/errores-YYYY-MM.json; qué pasó con
 * cada error lo anota la rutina de Claude en err/data/estados.json.
 *
 * Fechas siempre en hora argentina (UTC-3 fijo), como el resto del bot.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/renovacion.php';   // wabot_renovacion_clave / _nombre: el chat para un teléfono del admin

const WABOT_WEBS_ARCHIVO = WABOT_DATA . '/webs.json';
const WABOT_WEBS_MONITOR = WABOT_DATA . '/webs-estado.json';
// Lo que escribe err/log.php: visitas-YYYY-MM.json, errores-YYYY-MM.json, estados.json.
const WABOT_WEBS_ERR_DATA = __DIR__ . '/../err/data';
// El reporte sale desde el día 1 de cada mes, de 10 a 20 h, y cuenta el mes anterior.
const WABOT_WEBS_REPORTE_DIA = 1;
const WABOT_WEBS_HORA_DESDE = 10;
const WABOT_WEBS_HORA_HASTA = 20;
// Sin al menos tantos días monitoreados no hay reporte de ese mes (el primero sale completo, no a medias).
const WABOT_WEBS_REPORTE_MIN_DIAS = 15;
// Una caída más corta que esto no se le cuenta al cliente (Pablo igual recibe el push).
const WABOT_WEBS_CAIDA_MIN = 20 * 60;
// Entre un aviso de caída y otro a la misma web, por lo menos un día.
const WABOT_WEBS_AVISO_CADA = 86400;
// Una lista que el admin no actualiza hace más de esto puede tener bajas que el bot no sabe.
const WABOT_WEBS_LISTA_VIEJA = 35 * 86400;
const WABOT_WEBS_UA = 'Mozilla/5.0 (compatible; GokywebsMonitor/1.0; +https://gokywebs.com)';

/* ─────────────────── Estado en disco ─────────────────── */

function wabot_webs_estado() {
    $j = json_decode((string)@file_get_contents(WABOT_WEBS_ARCHIVO), true);
    if (!is_array($j)) $j = [];
    return [
        'lista'    => array_values(array_filter((array)($j['lista'] ?? []), 'is_array')),
        'sync_ts'  => (int)($j['sync_ts'] ?? 0),
        'reportes' => (array)($j['reportes'] ?? []),
        'aviso_vieja_ts' => (int)($j['aviso_vieja_ts'] ?? 0),
    ];
}

function wabot_webs_guardar(array $estado) {
    return wabot_json_guardar_atomico(WABOT_WEBS_ARCHIVO, $estado);
}

function wabot_webs_monitor() {
    $j = json_decode((string)@file_get_contents(WABOT_WEBS_MONITOR), true);
    return is_array($j) ? $j : [];
}

function wabot_webs_monitor_guardar(array $monitor) {
    return wabot_json_guardar_atomico(WABOT_WEBS_MONITOR, $monitor);
}

/** "https://www.Panadería.com.ar/inicio" → "panadería.com.ar"; '' si no parece un dominio. */
function wabot_webs_dominio($raw) {
    $d = mb_strtolower(trim((string)$raw));
    $d = preg_replace('#^[a-z]+://#', '', $d);
    $d = preg_replace('/^www\./', '', $d);
    $d = (string)preg_split('#[/?\#:\s]#', $d)[0];
    if ($d === '' || strlen($d) > 80 || !preg_match('/^[\p{L}\p{N}]([\p{L}\p{N}.-]*[\p{L}\p{N}])?\.[\p{L}]{2,}$/u', $d)) return '';
    if (preg_match('/\.(test|local|localhost|internal)$/', $d)) return '';
    return $d;
}

/** Limpia una fila que manda el admin; null si no sirve. */
function wabot_webs_fila($f) {
    if (!is_array($f)) return null;
    $id = trim((string)($f['id'] ?? ''));
    if (!preg_match('/^(mantenimiento|clientes):[A-Za-z0-9_-]{1,64}$/', $id)) return null;
    $limpio = function ($s, $max) { return mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$s)), 0, $max); };
    $desde = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($f['desde'] ?? '')) ? (string)$f['desde'] : '';
    return [
        'id'      => $id,
        'tel'     => preg_replace('/\D+/', '', (string)($f['tel'] ?? '')),
        'persona' => $limpio($f['persona'] ?? '', 60),
        'negocio' => $limpio($f['negocio'] ?? '', 80),
        'dominio' => wabot_webs_dominio($f['dominio'] ?? ''),
        'plan'    => ($f['plan'] ?? '') === 'anual' ? 'anual' : 'mensual',
        'desde'   => $desde,
    ];
}

/** Lo que manda el admin. Devuelve el estado guardado. */
function wabot_webs_sync(array $lista, $ahora = null) {
    $estado = wabot_webs_estado();
    $estado['lista'] = array_values(array_filter(array_map('wabot_webs_fila', $lista)));
    $estado['sync_ts'] = $ahora ?? time();
    $estado['aviso_vieja_ts'] = 0;
    // Los reportes de los que ya no están en la lista no hacen falta.
    $ids = array_column($estado['lista'], 'id');
    $estado['reportes'] = array_intersect_key($estado['reportes'], array_flip($ids));
    wabot_webs_guardar($estado);
    return $estado;
}

/* ─────────────────── Fechas (hora argentina) ─────────────────── */

function wabot_webs_local($ts) { return (int)$ts - 3 * 3600; }
function wabot_webs_dia($ts)   { return gmdate('Y-m-d', wabot_webs_local($ts)); }
function wabot_webs_mes($ts)   { return gmdate('Y-m', wabot_webs_local($ts)); }

/** "2026-10" → "2026-09". */
function wabot_webs_mes_anterior($mes) {
    [$a, $m] = array_map('intval', explode('-', $mes));
    return sprintf('%04d-%02d', $m === 1 ? $a - 1 : $a, $m === 1 ? 12 : $m - 1);
}

function wabot_webs_mes_nombre($mes) {
    $nombres = [1 => 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return $nombres[(int)substr($mes, 5, 2)] ?? $mes;
}

function wabot_webs_hora_texto($ts) {
    $l = wabot_webs_local($ts);
    return (int)gmdate('G', $l) . ':' . gmdate('i', $l);
}

/** "hoy a las 15:00", "ayer a las 23:30", "el 3/11 a las 23:30". */
function wabot_webs_cuando_texto($ts, $ahora) {
    $dia = wabot_webs_dia($ts);
    $hoy = wabot_webs_dia($ahora);
    $ayer = wabot_webs_dia($ahora - 86400);
    $hora = wabot_webs_hora_texto($ts);
    if ($dia === $hoy) return "hoy a las $hora";
    if ($dia === $ayer) return "ayer a las $hora";
    return 'el ' . (int)substr($dia, 8, 2) . '/' . (int)substr($dia, 5, 2) . " a las $hora";
}

/** 1800 → "30 minutos"; 9000 → "2 horas y 30 minutos"; 97200 → "1 día y 3 horas". */
function wabot_webs_duracion_texto($seg) {
    $min = max(1, (int)round($seg / 60));
    $plural = function ($n, $uno, $varios) { return $n . ' ' . ($n === 1 ? $uno : $varios); };
    if ($min < 60) return $plural($min, 'minuto', 'minutos');
    $h = intdiv($min, 60); $m = $min % 60;
    if ($h < 24) return $plural($h, 'hora', 'horas') . ($m ? ' y ' . $plural($m, 'minuto', 'minutos') : '');
    $d = intdiv($h, 24); $h = $h % 24;
    return $plural($d, 'día', 'días') . ($h ? ' y ' . $plural($h, 'hora', 'horas') : '');
}

function wabot_webs_numero($n) {
    return number_format((int)$n, 0, ',', '.');
}

/* ─────────────────── Monitoreo ─────────────────── */

/**
 * Pide la portada de cada dominio por https, todas a la vez. Devuelve, por
 * dominio: ['ok' => bool, 'http' => int, 'motivo' => '', 'ssl_hasta' => ts|0].
 * Una web "ok" responde 2xx/3xx con el certificado válido y no es la página de
 * cuenta suspendida de Hostinger.
 */
function wabot_webs_pedir(array $dominios) {
    $out = [];
    if (!$dominios) return $out;
    $mh = curl_multi_init();
    $chs = [];
    foreach ($dominios as $d) {
        $ch = curl_init('https://' . $d . '/');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 5,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 25,
            CURLOPT_USERAGENT      => WABOT_WEBS_UA,
            CURLOPT_ENCODING       => '',
            CURLOPT_CERTINFO       => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER     => ['Accept: text/html,*/*;q=0.8', 'Accept-Language: es-AR,es;q=0.9'],
        ]);
        curl_multi_add_handle($mh, $ch);
        $chs[$d] = $ch;
    }
    do {
        $st = curl_multi_exec($mh, $activos);
        if ($activos) curl_multi_select($mh, 1.0);
    } while ($activos && $st === CURLM_OK);
    // En multi, curl_errno() no sirve: el código de cada pedido llega por curl_multi_info_read().
    $codigos = [];
    while ($info = curl_multi_info_read($mh)) {
        $codigos[spl_object_id($info['handle'])] = (int)$info['result'];
    }

    foreach ($chs as $d => $ch) {
        $errno = $codigos[spl_object_id($ch)] ?? curl_errno($ch);
        $http  = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $body  = (string)curl_multi_getcontent($ch);
        $sslHasta = 0;
        $certs = curl_getinfo($ch, CURLINFO_CERTINFO);
        if (is_array($certs) && isset($certs[0]['Expire date'])) {
            $t = strtotime((string)$certs[0]['Expire date']);
            if ($t) $sslHasta = $t;
        }
        $out[$d] = wabot_webs_resultado($errno, curl_error($ch), $http, $body, $sslHasta);
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);
    return $out;
}

/** Interpreta una respuesta; separado de curl para probarlo sin red. */
function wabot_webs_resultado($errno, $error, $http, $body, $sslHasta = 0) {
    $r = ['ok' => false, 'http' => (int)$http, 'motivo' => '', 'ssl_hasta' => (int)$sslHasta];
    if ($errno !== 0) {
        // Códigos de libcurl: 6 DNS, 7 conectar, 28 tiempo, 35/51/58/60 SSL.
        if ($errno === 6) $r['motivo'] = 'el dominio no resuelve (DNS)';
        elseif ($errno === 7) $r['motivo'] = 'no se pudo conectar';
        elseif ($errno === 28) $r['motivo'] = 'no responde (tiempo de espera agotado)';
        elseif (in_array($errno, [35, 51, 58, 60], true)) $r['motivo'] = 'certificado de seguridad inválido';
        else $r['motivo'] = 'error de conexión' . ($error !== '' ? ' (' . mb_substr((string)$error, 0, 60) . ')' : '');
        return $r;
    }
    if ($http >= 500) { $r['motivo'] = "error $http del servidor"; return $r; }
    if ($http >= 400) { $r['motivo'] = "error $http"; return $r; }
    if ($http < 200)  { $r['motivo'] = 'sin respuesta'; return $r; }
    // La página de Hostinger cuando la cuenta está suspendida responde 200.
    if (preg_match('/(website|site|account|sitio|cuenta)\s+(is|has been|está|fue)\s+suspend/iu', $body)) {
        $r['motivo'] = 'cuenta suspendida en el hosting';
        return $r;
    }
    $r['ok'] = true;
    return $r;
}

function wabot_webs_estado_dominio_nuevo() {
    return ['ok' => null, 'desde_ts' => 0, 'ultimo_ts' => 0, 'http' => 0, 'motivo' => '', 'ssl_hasta_ts' => 0,
            'meses' => [], 'caidas' => [], 'aviso_pendiente' => null, 'aviso_ts' => 0];
}

/** El negocio (o la persona) de un dominio, para los avisos a Pablo. */
function wabot_webs_quien(array $lista, $dominio) {
    foreach ($lista as $f) {
        if ($f['dominio'] !== $dominio) continue;
        if ($f['negocio'] !== '') return $f['negocio'];
        if ($f['persona'] !== '') return $f['persona'];
    }
    return $dominio;
}

/**
 * Una pasada de monitoreo. $pedir(dominios) reemplaza la red en los tests;
 * $avisar(titulo, cuerpo) es el push a Pablo. Devuelve el monitor actualizado
 * y qué pasó. El aviso al cliente lo manda wabot_webs_avisos_correr().
 */
function wabot_webs_chequear(array $lista, $ahora, array $monitor, $pedir = null, $avisar = null) {
    $pedir  = $pedir ?? 'wabot_webs_pedir';
    $avisar = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };
    $res = ['chequeadas' => 0, 'caidas' => [], 'volvieron' => [], 'siguen_caidas' => []];

    $dominios = array_values(array_unique(array_filter(array_column($lista, 'dominio'))));
    if (!$dominios) return ['monitor' => $monitor] + $res;

    $r = $pedir($dominios);
    // Un corte de un segundo no es una caída: lo que falló se vuelve a pedir antes de darlo por caído.
    $fallidos = array_keys(array_filter($r, function ($x) { return empty($x['ok']); }));
    if ($fallidos) {
        if (empty($GLOBALS['WABOT_TEST_SIN_RED'])) sleep(5);
        foreach ($pedir($fallidos) as $d => $x) $r[$d] = $x;
    }

    $mes = wabot_webs_mes($ahora);
    $dia = substr(wabot_webs_dia($ahora), 8, 2);
    foreach ($dominios as $d) {
        $x = $r[$d] ?? null;
        if (!is_array($x)) continue;
        $res['chequeadas']++;
        $e = is_array($monitor[$d] ?? null) ? $monitor[$d] + wabot_webs_estado_dominio_nuevo() : wabot_webs_estado_dominio_nuevo();
        $m = (array)($e['meses'][$mes] ?? ['chequeos' => 0, 'fallidos' => 0, 'dias' => []]);
        $m['chequeos'] = (int)$m['chequeos'] + 1;
        if (!$x['ok']) $m['fallidos'] = (int)$m['fallidos'] + 1;
        $m['dias'][$dia] = 1;
        $e['meses'][$mes] = $m;
        // Solo el mes actual y el anterior: el reporte no mira más atrás.
        $e['meses'] = array_intersect_key($e['meses'], array_flip([$mes, wabot_webs_mes_anterior($mes)]));
        $e['http'] = $x['http'];
        $e['motivo'] = $x['motivo'];
        if ($x['ssl_hasta'] > 0) $e['ssl_hasta_ts'] = $x['ssl_hasta'];
        $quien = wabot_webs_quien($lista, $d);

        if ($x['ok'] && $e['ok'] === false) {
            // Volvió.
            $desde = (int)$e['desde_ts'];
            $duro = $ahora - $desde;
            $e['caidas'][] = ['desde' => $desde, 'hasta' => $ahora, 'motivo' => (string)($e['motivo_caida'] ?? '')];
            $e['caidas'] = array_slice($e['caidas'], -30);
            if ($duro >= WABOT_WEBS_CAIDA_MIN) $e['aviso_pendiente'] = ['desde' => $desde, 'hasta' => $ahora];
            $avisar('Volvió la web de ' . $quien, $d . ' responde otra vez. Estuvo caída ' . wabot_webs_duracion_texto($duro) . ' (desde ' . wabot_webs_cuando_texto($desde, $ahora) . ').');
            $res['volvieron'][] = $d;
            unset($e['motivo_caida']);
        } elseif (!$x['ok'] && $e['ok'] !== false) {
            // Se cayó (o nunca respondió).
            $e['motivo_caida'] = $x['motivo'];
            $avisar('Se cayó la web de ' . $quien, $d . ': ' . $x['motivo'] . '. Te aviso cuando vuelva.');
            $res['caidas'][] = $d;
        } elseif (!$x['ok']) {
            $res['siguen_caidas'][] = $d;
        }
        // Solo lo que falla o cambia queda en el log: 36 webs cada media hora serían 1.700 líneas por día.
        if (!$x['ok'] || $x['ok'] !== $e['ok']) wabot_log('web_chequeo', ['dominio' => $d, 'ok' => $x['ok'], 'http' => $x['http'], 'motivo' => $x['motivo']]);
        if ($x['ok'] !== $e['ok']) $e['desde_ts'] = $ahora;
        $e['ok'] = $x['ok'];
        $e['ultimo_ts'] = $ahora;
        $monitor[$d] = $e;
    }
    // Lo que ya no está en la lista se olvida.
    $monitor = array_intersect_key($monitor, array_flip($dominios));
    return ['monitor' => $monitor] + $res;
}

/** ¿Hora decente para escribirle a un cliente? */
function wabot_webs_en_horario($ahora) {
    $h = wabot_hora_local($ahora);
    return $h >= WABOT_WEBS_HORA_DESDE && $h < WABOT_WEBS_HORA_HASTA;
}

/**
 * Manda la plantilla $clave a una fila del admin con los valores ya armados.
 * $enviar(clave, fila, valores) reemplaza la red en los tests. Devuelve 'ok',
 * 'sin_chat', 'telefono', 'ambiguo', 'ocupado' o 'error'.
 */
function wabot_webs_enviar(array $f, $plantilla, array $valores, $cfg, $enviar = null) {
    if ($f['tel'] === '') return 'sin_chat';
    $clave = wabot_renovacion_clave($f['tel'], $motivo);
    if ($clave === null) return $motivo === 'ambiguo' ? 'ambiguo' : 'telefono';
    if ($enviar) return $enviar($clave, $f, $valores, $plantilla) ? 'ok' : 'error';

    $lock = wabot_lock_tomar($clave);
    if (!$lock) return 'ocupado';
    try {
        $conv = wabot_conv_load($clave);
        if (trim((string)($conv['nombre_negocio'] ?? '')) === '' && $f['negocio'] !== '') $conv['nombre_negocio'] = $f['negocio'];
        if (!wabot_enviar_plantilla($conv, $plantilla, $cfg, $valores)) return 'error';
        $conv[$plantilla . '_ts'] = time();
        wabot_conv_save($conv);
        return 'ok';
    } finally {
        wabot_lock_soltar($lock);
    }
}

/** "Juan" / el negocio / "cómo estás" para el {{1}} de la plantilla, como en la renovación. */
function wabot_webs_nombre(array $f) {
    return wabot_renovacion_nombre($f['persona']) ?: ($f['negocio'] !== '' ? $f['negocio'] : 'cómo estás');
}

/**
 * Los avisos de caída resuelta que quedaron pendientes: salen en horario, una
 * vez por día por web, a cada cliente de ese dominio.
 */
function wabot_webs_avisos_correr(array $lista, $ahora, array $monitor, $cfg, $enviar = null, $avisar = null) {
    $res = ['enviados' => 0, 'fallidos' => 0, 'detalle' => []];
    $p = wabot_plantilla_config('web_caida_resuelta', $cfg);
    $activa = $p !== null && (!array_key_exists('automatico', $p) || !empty($p['automatico']));
    foreach ($monitor as $d => $e) {
        if (!is_array($e) || empty($e['aviso_pendiente'])) continue;
        if (!$activa) { $monitor[$d]['aviso_pendiente'] = null; continue; }
        if (!wabot_webs_en_horario($ahora)) continue;
        $av = $e['aviso_pendiente'];
        $monitor[$d]['aviso_pendiente'] = null;
        // Una web que se cae seguido no bombardea al cliente: un aviso por día.
        if ($ahora - (int)($e['aviso_ts'] ?? 0) < WABOT_WEBS_AVISO_CADA) continue;
        $monitor[$d]['aviso_ts'] = $ahora;
        foreach ($lista as $f) {
            if ($f['dominio'] !== $d) continue;
            $valores = [
                'nombre'  => wabot_webs_nombre($f),
                'negocio' => $f['negocio'] !== '' ? $f['negocio'] : 'tu negocio',
                'desde'   => wabot_webs_cuando_texto((int)$av['desde'], $ahora),
                'hasta'   => wabot_webs_cuando_texto((int)$av['hasta'], $ahora),
            ];
            $r = wabot_webs_enviar($f, 'web_caida_resuelta', $valores, $cfg, $enviar);
            $res['detalle'][] = ['id' => $f['id'], 'dominio' => $d, 'resultado' => $r];
            if ($r === 'ok') $res['enviados']++; else $res['fallidos']++;
            wabot_log('web_caida_aviso', ['id' => $f['id'], 'dominio' => $d, 'resultado' => $r]);
        }
    }
    return ['monitor' => $monitor] + $res;
}

/* ─────────────────── Reporte mensual ─────────────────── */

function wabot_webs_err_leer($nombre) {
    $f = WABOT_WEBS_ERR_DATA . '/' . $nombre;
    if (!is_file($f)) return [];
    $j = json_decode((string)@file_get_contents($f), true);
    return is_array($j) ? $j : [];
}

/** Lo que err/log.php y la rutina de Claude dejaron del mes: visitas, errores y estados. */
function wabot_webs_err_datos($mes) {
    return [
        'visitas' => wabot_webs_err_leer("visitas-$mes.json"),
        'errores' => wabot_webs_err_leer("errores-$mes.json"),
        'estados' => wabot_webs_err_leer('estados.json'),
    ];
}

/**
 * Los cuatro renglones del reporte de un dominio para un mes, con los textos
 * listos para la plantilla, o null si ese mes no se monitoreó.
 */
function wabot_webs_reporte_datos($dominio, $mes, array $monitor, array $err) {
    $e = is_array($monitor[$dominio] ?? null) ? $monitor[$dominio] : null;
    $m = is_array($e['meses'][$mes] ?? null) ? $e['meses'][$mes] : null;
    $chequeos = (int)($m['chequeos'] ?? 0);
    if (!$e || $chequeos === 0) return null;
    $fallidos = (int)($m['fallidos'] ?? 0);
    $dias = count((array)($m['dias'] ?? []));

    $pct = 100 * ($chequeos - $fallidos) / $chequeos;
    $caidas = array_values(array_filter((array)($e['caidas'] ?? []), function ($c) use ($mes) {
        return is_array($c) && wabot_webs_mes((int)($c['desde'] ?? 0)) === $mes;
    }));
    if ($fallidos === 0) {
        $disponibilidad = '100 % (online todo el mes)';
    } else {
        $pctTxt = number_format($pct, $pct >= 99.95 ? 0 : 1, ',', '.') . ' %';
        $n = count($caidas);
        if ($n === 1) {
            $duro = wabot_webs_duracion_texto((int)$caidas[0]['hasta'] - (int)$caidas[0]['desde']);
            $disponibilidad = "$pctTxt (una caída de $duro, ya resuelta)";
        } elseif ($n > 1) {
            $disponibilidad = "$pctTxt ($n caídas cortas, ya resueltas)";
        } else {
            $disponibilidad = "$pctTxt (hubo momentos sin respuesta, ya resueltos)";
        }
    }

    $visitas = (int)($err['visitas'][$dominio]['total'] ?? 0);
    $visitasTxt = $visitas === 0 ? 'sin visitas registradas'
        : wabot_webs_numero($visitas) . ($visitas === 1 ? ' visita' : ' visitas');

    $grupos = array_keys((array)($err['errores'][$dominio]['grupos'] ?? []));
    $n = count($grupos);
    if ($n === 0) {
        $erroresTxt = 'ninguno detectado';
    } else {
        $corregidos = 0; $revisados = 0;
        foreach ($grupos as $h) {
            $estado = (string)($err['estados'][$h]['estado'] ?? '');
            if (in_array($estado, ['pr', 'rama'], true)) $corregidos++;
            elseif (in_array($estado, ['descartado', 'no_reproduce', 'sin_repo'], true)) $revisados++;
        }
        $pendientes = $n - $corregidos - $revisados;
        $partes = [];
        if ($corregidos) $partes[] = $corregidos === $n ? ($n === 1 ? 'ya corregido' : "los $n ya corregidos") : "$corregidos " . ($corregidos === 1 ? 'corregido' : 'corregidos');
        if ($revisados)  $partes[] = $revisados === $n ? ($n === 1 ? 'revisado, sin impacto para los visitantes' : 'revisados, sin impacto para los visitantes') : "$revisados " . ($revisados === 1 ? 'revisado sin impacto' : 'revisados sin impacto');
        if ($pendientes) $partes[] = $pendientes === $n ? 'en revisión' : "$pendientes en revisión";
        $erroresTxt = $n . ($n === 1 ? ' detectado' : ' detectados') . ', ' . implode(', ', $partes);
    }

    $ssl = (int)($e['ssl_hasta_ts'] ?? 0);
    $sslTxt = $ssl > 0 ? 'vigente hasta el ' . gmdate('d/m/Y', wabot_webs_local($ssl)) : ($e['ok'] ? 'vigente' : 'sin datos');

    return [
        'disponibilidad' => $disponibilidad, 'visitas' => $visitasTxt, 'errores' => $erroresTxt, 'ssl' => $sslTxt,
        'dias' => $dias, 'pct' => round($pct, 2), 'visitas_n' => $visitas, 'errores_n' => $n, 'caidas_n' => count($caidas),
    ];
}

/**
 * La corrida del reporte. Para los tests: $estado y $monitor (sin disco), $err
 * (lo de err/data), $enviar y $avisar. Devuelve qué hizo y el estado nuevo.
 */
function wabot_webs_reporte_correr($cfg, $ahora, array $estado, array $monitor, $err = null, $enviar = null, $avisar = null) {
    $res = ['revisados' => 0, 'enviados' => 0, 'fallidos' => 0, 'sin_datos' => 0, 'detalle' => []];
    $p = wabot_plantilla_config('reporte_mensual_web', $cfg);
    if ($p === null || (array_key_exists('automatico', $p) && empty($p['automatico']))) return $res + ['apagado' => true, 'estado' => $estado];
    if ((int)substr(wabot_webs_dia($ahora), 8, 2) < WABOT_WEBS_REPORTE_DIA || !wabot_webs_en_horario($ahora)) return $res + ['estado' => $estado];
    if (!$estado['lista']) return $res + ['estado' => $estado];
    $avisar = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };

    $mes = wabot_webs_mes_anterior(wabot_webs_mes($ahora));
    $err = $err ?? wabot_webs_err_datos($mes);
    $mesNombre = wabot_webs_mes_nombre($mes);
    $fallas = [];
    foreach ($estado['lista'] as $f) {
        if ((string)($estado['reportes'][$f['id']]['mes'] ?? '') === $mes) continue;
        $res['revisados']++;
        if ($f['dominio'] === '') {
            $estado['reportes'][$f['id']] = ['mes' => $mes, 'ts' => $ahora, 'ok' => false, 'resultado' => 'sin_dominio'];
            $res['sin_datos']++;
            continue;
        }
        $e = $monitor[$f['dominio']] ?? null;
        // Caída en este momento: el reporte espera a que vuelva (la próxima pasada).
        if (is_array($e) && $e['ok'] === false) continue;
        $datos = wabot_webs_reporte_datos($f['dominio'], $mes, $monitor, $err);
        if ($datos === null || $datos['dias'] < WABOT_WEBS_REPORTE_MIN_DIAS) {
            $estado['reportes'][$f['id']] = ['mes' => $mes, 'ts' => $ahora, 'ok' => false, 'resultado' => $datos === null ? 'sin_datos' : 'pocos_datos'];
            $res['sin_datos']++;
            continue;
        }
        $valores = [
            'nombre'         => wabot_webs_nombre($f),
            'mes'            => $mesNombre,
            'negocio'        => $f['negocio'] !== '' ? $f['negocio'] : 'tu negocio',
            'disponibilidad' => $datos['disponibilidad'],
            'visitas'        => $datos['visitas'],
            'errores'        => $datos['errores'],
            'ssl'            => $datos['ssl'],
        ];
        $r = wabot_webs_enviar($f, 'reporte_mensual_web', $valores, $cfg, $enviar);
        if ($r === 'ocupado') continue;   // otro proceso tiene el chat: la próxima pasada
        $estado['reportes'][$f['id']] = ['mes' => $mes, 'ts' => $ahora, 'ok' => $r === 'ok', 'resultado' => $r];
        $res['detalle'][] = ['id' => $f['id'], 'dominio' => $f['dominio'], 'resultado' => $r];
        wabot_log('web_reporte', ['id' => $f['id'], 'dominio' => $f['dominio'], 'resultado' => $r, 'mes' => $mes]);
        if ($r === 'ok') {
            $res['enviados']++;
        } else {
            $res['fallidos']++;
            $motivos = ['sin_chat' => 'sin teléfono', 'telefono' => 'teléfono raro', 'ambiguo' => 'dos chats con ese número', 'error' => 'WhatsApp no lo aceptó'];
            $fallas[] = ($f['negocio'] !== '' ? $f['negocio'] : ($f['persona'] !== '' ? $f['persona'] : $f['dominio'])) . ' (' . ($motivos[$r] ?? $r) . ')';
        }
    }
    if ($res['enviados'] || $res['fallidos']) {
        $cuerpo = 'Salió el resumen de ' . $mesNombre . ' a ' . $res['enviados'] . ($res['enviados'] === 1 ? ' cliente' : ' clientes') . '.';
        if ($fallas) $cuerpo .= ' Sin enviar: ' . implode(', ', $fallas) . '. Escribiles a mano.';
        $avisar('Reporte mensual de las webs', $cuerpo);
    }
    return $res + ['estado' => $estado];
}

/* ─────────────────── La pasada del cron y lo que ve el admin ─────────────────── */

/**
 * Lo que corre seguimiento.php: el chequeo de todas las webs, los avisos de
 * caída que quedaron pendientes y, cuando toca, el reporte mensual. Para los
 * tests, $deps trae estado, monitor, pedir, enviar, avisar y err; con eso no
 * toca el disco y devuelve el estado nuevo.
 */
function wabot_webs_correr($cfg, $ahora = null, array $deps = []) {
    $ahora = $ahora ?? time();
    $enDisco = !array_key_exists('estado', $deps);
    $estado  = $deps['estado'] ?? wabot_webs_estado();
    $monitor = $deps['monitor'] ?? wabot_webs_monitor();
    $avisar  = $deps['avisar'] ?? null;
    if (!$estado['lista']) return ['sin_lista' => true];

    $res = [];
    if ($ahora - (int)$estado['sync_ts'] > WABOT_WEBS_LISTA_VIEJA && !$estado['aviso_vieja_ts']) {
        // Sin abrir el admin hace más de un mes: puede haber bajas que el bot no sabe. Se monitorea igual, pero avisa.
        $av = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };
        $av('Lista de webs sin actualizar', 'El bot monitorea y reporta con una lista de hace más de 35 días. Abrí el admin para actualizarla.');
        $estado['aviso_vieja_ts'] = $ahora;
        if ($enDisco) wabot_webs_guardar($estado);
        $res['lista_vieja'] = true;
    }

    $chequeo = wabot_webs_chequear($estado['lista'], $ahora, $monitor, $deps['pedir'] ?? null, $avisar);
    $monitor = $chequeo['monitor'];
    unset($chequeo['monitor']);
    $avisos = wabot_webs_avisos_correr($estado['lista'], $ahora, $monitor, $cfg, $deps['enviar'] ?? null, $avisar);
    $monitor = $avisos['monitor'];
    unset($avisos['monitor']);
    if ($enDisco) wabot_webs_monitor_guardar($monitor);

    $reporte = wabot_webs_reporte_correr($cfg, $ahora, $estado, $monitor, $deps['err'] ?? null, $deps['enviar'] ?? null, $avisar);
    $estado = $reporte['estado'];
    unset($reporte['estado']);
    if ($enDisco) wabot_webs_guardar($estado);

    $res += ['chequeo' => $chequeo, 'avisos' => $avisos, 'reporte' => $reporte];
    if (!$enDisco) $res += ['estado' => $estado, 'monitor' => $monitor];
    return $res;
}

/**
 * Lo que muestra el admin debajo de cada dominio: cómo está la web ahora, los
 * números del mes en curso y qué reporte salió. Respuesta de webs_sync.
 */
function wabot_webs_resumen_admin(array $estado, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    $monitor = wabot_webs_monitor();
    $mes = wabot_webs_mes($ahora);
    $err = wabot_webs_err_datos($mes);
    $webs = [];
    foreach ($estado['lista'] as $f) {
        $d = $f['dominio'];
        if ($d === '' || isset($webs[$d]) || !is_array($monitor[$d] ?? null)) continue;
        $e = $monitor[$d];
        $datos = wabot_webs_reporte_datos($d, $mes, $monitor, $err);
        $webs[$d] = [
            'ok' => $e['ok'], 'desde_ts' => (int)$e['desde_ts'], 'ultimo_ts' => (int)$e['ultimo_ts'],
            'motivo' => (string)$e['motivo'], 'ssl_hasta_ts' => (int)($e['ssl_hasta_ts'] ?? 0),
            'mes' => $datos ? ['disponibilidad' => $datos['disponibilidad'], 'visitas' => $datos['visitas'], 'errores' => $datos['errores'],
                                'visitas_n' => $datos['visitas_n'], 'errores_n' => $datos['errores_n'], 'dias' => $datos['dias']] : null,
        ];
    }
    $pr = wabot_plantilla_config('reporte_mensual_web', $cfg);
    $pc = wabot_plantilla_config('web_caida_resuelta', $cfg);
    return [
        'cantidad'   => count($estado['lista']),
        'plantillas' => [
            'reporte' => $pr !== null && (!array_key_exists('automatico', $pr) || !empty($pr['automatico'])),
            'caida'   => $pc !== null && (!array_key_exists('automatico', $pc) || !empty($pc['automatico'])),
        ],
        'mes'      => $mes,
        'webs'     => $webs,
        'reportes' => $estado['reportes'],
    ];
}
