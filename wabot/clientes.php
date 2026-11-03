<?php
/**
 * wabot/clientes.php — la pestaña Clientes del panel del bot (Pablo, 1-nov-2026:
 * "una sección Clientes que sean los chats de los clientes").
 *
 * Complementa la pestaña Clientes del admin principal: acá se ven LOS CHATS.
 *   - Nuevos: las charlas con el pago confirmado (pagos.php), con qué pagó, la
 *     modalidad y en qué etapa está la web: juntando datos (el bot le pide lo
 *     que falta, onboarding.php), listo para producción (ya mandó todo), en
 *     producción (el pedido para el agente ya salió) o entregada.
 *   - Mantenimiento: los clientes de Firestore (`clientes` en estado cliente y
 *     los suscriptores de `mantenimiento` que no tienen ficha), cruzados con
 *     las charlas por cliente_id, por la clave que guarda el boceto
 *     (propuestaSnapshot.conversationKey) o por teléfono.
 *   - Pagos sin asignar: lo que entró en Mercado Pago y no se pudo atar a un
 *     chat, para asignarlo con un toque.
 *
 * Firestore se lee con la cuenta de servicio y queda en caché 10 minutos
 * (data/clientes-cache.json): la pestaña se abre seguido y los clientes cambian
 * poco. Confirmar o asignar un pago borra la caché.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/pagos.php';

const WABOT_CLIENTES_CACHE_SEG = 600;

function wabot_clientes_cache_archivo() {
    return (string)($GLOBALS['WABOT_TEST_CLIENTES_CACHE'] ?? (WABOT_DATA . '/clientes-cache.json'));
}

function wabot_clientes_cache_borrar() {
    @unlink(wabot_clientes_cache_archivo());
}

/* ── Firestore ─────────────────────────────────────────────────────────── */

/** Una colección entera (o filtrada por un campo igual a un valor): [id => campos]. */
function wabot_clientes_fs_coleccion($coleccion, $campo = null, $valor = null) {
    $sa = wabot_push_cuenta();
    if (!$sa) throw new RuntimeException('Falta config/service-account.json.');
    $query = ['from' => [['collectionId' => (string)$coleccion]]];
    if ($campo !== null) {
        $query['where'] = ['fieldFilter' => ['field' => ['fieldPath' => (string)$campo], 'op' => 'EQUAL', 'value' => ['stringValue' => (string)$valor]]];
    }
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents:runQuery');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['structuredQuery' => $query]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_presentar_fs_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
    ]);
    $filas = json_decode((string)curl_exec($ch), true);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas)) throw new RuntimeException('No se pudo leer ' . $coleccion . ' (HTTP ' . $http . ').');
    $docs = [];
    foreach ($filas as $f) {
        if (empty($f['document']['name'])) continue;
        $docs[basename($f['document']['name'])] = array_map('wabot_presentar_fs_leer', (array)($f['document']['fields'] ?? []));
    }
    return $docs;
}

/** Los clientes (estadoCliente = cliente) y los suscriptores/avisos de mantenimiento. */
function wabot_clientes_fs_leer() {
    return [
        'clientes' => wabot_clientes_fs_coleccion('clientes', 'estadoCliente', 'cliente'),
        'mantenimiento' => wabot_clientes_fs_coleccion('mantenimiento'),
    ];
}

/* ── Las charlas ───────────────────────────────────────────────────────── */

/** Lo que la pestaña necesita de una charla, o null si no es (ni puede ser) de un cliente. */
function wabot_clientes_chat_resumen(array $cv) {
    $clave = (string)($cv['conversation_key'] ?? $cv['tel'] ?? '');
    if ($clave === '' || stripos($clave, 'TEST') !== false && empty($GLOBALS['WABOT_TEST_CLIENTES_CON_TEST'])) return null;
    $pagado = (int)($cv['pago_confirmado_ts'] ?? 0);
    $clienteId = trim((string)($cv['cliente_id'] ?? ''));
    $tel = (string)($cv['telefono_wsp'] ?? '') ?: (string)($cv['channel_user_id'] ?? $cv['tel'] ?? '');
    if ($pagado <= 0 && $clienteId === '' && !ctype_digit($tel)) return null;
    $ob = (array)($cv['onboarding'] ?? []);
    $prod = (array)($cv['produccion'] ?? []);
    return [
        'clave'          => $clave,
        'nombre'         => function_exists('wabot_nombre_agenda') ? wabot_nombre_agenda($cv) : trim((string)($cv['nombre'] ?? '')),
        'negocio'        => trim((string)($cv['nombre_negocio'] ?? '')),
        'tel'            => ctype_digit($tel) ? $tel : '',
        'canal'          => function_exists('wabot_canal') ? wabot_canal($cv) : 'whatsapp',
        'cliente_id'     => $clienteId,
        'tipo'           => (string)($cv['tipo'] ?? ''),
        'slug'           => (string)($cv['presentado_slug'] ?? ''),
        'pago_ts'        => $pagado,
        'pago_monto'     => (int)($cv['pago_monto'] ?? 0),
        'pago_modalidad' => (string)($cv['pago_modalidad'] ?? ''),
        'pago_tipo'      => (string)($cv['pago_tipo'] ?? ''),
        'pago_cuando'    => (int)($cv['pago_ts'] ?? $pagado),
        'pago_avisado'   => (int)($cv['pago_avisado_ts'] ?? 0),
        'pago_firestore' => (string)($cv['pago_firestore'] ?? ''),
        'onboarding_inicio'   => (int)($ob['inicio_ts'] ?? 0),
        'onboarding_paso'     => (string)($ob['paso'] ?? ''),
        'onboarding_completo' => (int)($ob['completo_ts'] ?? 0),
        'onboarding_pausado'  => !empty($cv['control_manual']) || !empty($cv['bot_off']),
        'produccion_pedido'   => (int)($prod['pedido_ts'] ?? 0),
        'entregada_ts'        => (int)($prod['entregada_ts'] ?? 0),
        'ultimo_ts'      => (int)($cv['ultimo_ts'] ?? 0),
    ];
}

/** Todas las charlas que pueden ser de un cliente: [clave => resumen]. $convs (tests) reemplaza el disco. */
function wabot_clientes_chats($convs = null) {
    if ($convs === null) {
        $convs = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            $clave = basename($f, '.json');
            if (stripos($clave, 'TEST') !== false) continue;
            $cv = json_decode((string)@file_get_contents($f), true);
            if (is_array($cv)) $convs[$clave] = $cv;
        }
    }
    $out = [];
    foreach ($convs as $clave => $cv) {
        $r = is_array($cv) ? wabot_clientes_chat_resumen($cv) : null;
        if ($r) $out[(string)$clave] = $r;
    }
    return $out;
}

/** En qué etapa está la web de un cliente nuevo. Sin onboarding (lo de fábrica desde el 1-nov), la sigue Pablo. */
function wabot_clientes_etapa(array $r) {
    if (!empty($r['entregada_ts'])) return 'entregada';
    if (!empty($r['produccion_pedido'])) return 'en producción';
    if (!empty($r['onboarding_completo'])) return 'listo para producción';
    if (empty($r['onboarding_inicio'])) return 'la sigue Pablo';
    return 'juntando datos';
}

/** Los clientes nuevos: las charlas con el pago confirmado, la más nueva primero. */
function wabot_clientes_nuevos(array $chats) {
    $nuevos = array_values(array_filter($chats, function ($r) { return (int)$r['pago_ts'] > 0; }));
    foreach ($nuevos as &$r) $r['etapa'] = wabot_clientes_etapa($r);
    unset($r);
    usort($nuevos, function ($a, $b) { return $b['pago_ts'] <=> $a['pago_ts']; });
    return $nuevos;
}

/* ── El cruce con Firestore ────────────────────────────────────────────── */

/** Un timestamp de Firestore (string ISO) o lo que sea → unix (0 si no hay). */
function wabot_clientes_ts($v) {
    if (is_array($v) && isset($v['_ts'])) return (int)$v['_ts'];
    if (is_int($v) || is_float($v)) return (int)$v;
    if (is_string($v) && $v !== '') return (int)(strtotime($v) ?: 0);
    return 0;
}

/** La charla de un cliente de Firestore: por cliente_id, por la clave del boceto o por teléfono. */
function wabot_clientes_chat_de(array $doc, $docId, array $chats) {
    foreach ($chats as $clave => $r) {
        if ($r['cliente_id'] !== '' && $r['cliente_id'] === (string)$docId) return (string)$clave;
    }
    $claveBoceto = (string)($doc['propuestaSnapshot']['conversationKey'] ?? $doc['conversationKey'] ?? '');
    if ($claveBoceto !== '' && isset($chats[$claveBoceto])) return $claveBoceto;
    $tel = (string)($doc['telefono'] ?? $doc['whatsapp'] ?? '');
    $abonados = function_exists('wabot_tel_abonados') ? wabot_tel_abonados($tel) : [];
    if ($abonados) {
        $coinciden = [];
        foreach ($chats as $clave => $r) {
            if ($r['tel'] !== '' && array_intersect($abonados, wabot_tel_abonados($r['tel']))) $coinciden[] = (string)$clave;
        }
        if (count($coinciden) === 1) return $coinciden[0];
    }
    return '';
}

/** 'unico' del admin = plan anual; 'propia' = pago único. */
function wabot_clientes_modalidad_label($m) {
    return ['mensual' => 'Mensual', 'unico' => 'Anual', 'propia' => 'Pago único'][(string)$m] ?? '';
}

/** Día del mes (hora argentina) de un timestamp, o 0. */
function wabot_clientes_dia($ts) {
    return $ts > 0 ? (int)gmdate('j', (int)$ts - 3 * 3600) : 0;
}

/**
 * Las filas de Mantenimiento: cada cliente de Firestore con su plan, dominio,
 * estado de la suscripción, día de cobro y el chat si lo hay; después, los
 * suscriptores de Mercado Pago que no tienen ficha de cliente.
 */
function wabot_clientes_mantenimiento(array $fs, array $chats) {
    $clientes = (array)($fs['clientes'] ?? []);
    $mant = (array)($fs['mantenimiento'] ?? []);
    // Avisos de baja/pausa por suscripción, y los suscriptores (sin tipoEvento).
    $avisos = [];
    $suscriptores = [];
    foreach ($mant as $id => $m) {
        if (!is_array($m)) continue;
        $pre = (string)($m['preapprovalId'] ?? '');
        if (!empty($m['tipoEvento'])) { if ($pre !== '') $avisos[$pre] = $m; continue; }
        $suscriptores[$id] = $m;
    }
    $filas = [];
    $usados = [];
    foreach ($clientes as $id => $c) {
        if (!is_array($c)) continue;
        $modalidad = (string)($c['modalidad'] ?? '');
        $pre = (string)($c['preapprovalId'] ?? '');
        $estado = '';
        $dia = 0;
        if ($modalidad === 'mensual' || $modalidad === '') {
            $estado = (string)($c['estadoSuscripcion'] ?? 'pendiente');
            if ($pre !== '' && isset($avisos[$pre])) $estado = ($avisos[$pre]['tipoEvento'] === 'pausa' ? 'pausada' : 'baja') . ' en MP';
            if (!empty($c['pagaPorFuera'])) $estado .= ' · paga por afuera';
            $dia = (int)($c['diaCobro'] ?? 0) ?: wabot_clientes_dia(wabot_clientes_ts($c['suscripcionDesde'] ?? null));
            foreach ($suscriptores as $sid => $s) {
                if ($pre !== '' && (string)($s['preapprovalId'] ?? '') === $pre) $usados[$sid] = true;
            }
        } elseif ($modalidad === 'unico') {
            $renueva = wabot_clientes_ts($c['renovacionAt'] ?? null) ?: (wabot_clientes_ts($c['senaAt'] ?? null) ? wabot_clientes_ts($c['senaAt']) + 365 * 86400 : 0);
            $saldo = max(0, (int)($c['valorTotal'] ?? 0) - (int)($c['abono'] ?? 0));
            $estado = ($saldo > 0 ? 'seña cobrada, saldo ' . wabot_pagos_monto_texto($saldo) : 'pagado') . ($renueva ? ' · renueva ' . gmdate('j/n/Y', $renueva - 3 * 3600) : '');
            $dia = wabot_clientes_dia($renueva);
        } elseif ($modalidad === 'propia') {
            $saldo = max(0, (int)($c['valorTotal'] ?? 0) - (int)($c['abono'] ?? 0));
            $estado = $saldo > 0 ? 'seña cobrada, saldo ' . wabot_pagos_monto_texto($saldo) : 'pagado';
        }
        $clave = wabot_clientes_chat_de($c, $id, $chats);
        $filas[] = [
            'id'        => (string)$id,
            'nombre'    => trim((string)($c['nombre'] ?? '')),
            'negocio'   => trim((string)($c['proyecto'] ?? '')),
            'plan'      => trim(((string)($c['planLabel'] ?? '')) . ' ' . wabot_clientes_modalidad_label($modalidad)),
            'monto'     => $modalidad === 'mensual' ? (int)($c['montoMensual'] ?? 0) : (int)($c['valorTotal'] ?? 0),
            'dominio'   => trim((string)($c['dominio'] ?? '')),
            'estado'    => $estado,
            'dia'       => $dia,
            'clave'     => $clave,
            'telefono'  => (string)($c['telefono'] ?? ''),
            'email'     => trim((string)($c['email'] ?? '')),
            'entregada' => wabot_clientes_ts($c['entregadoAt'] ?? null) > 0,
            'desde'     => wabot_clientes_ts($c['clienteDesdeAt'] ?? $c['createdAt'] ?? null),
            'origen'    => 'clientes',
        ];
    }
    usort($filas, function ($a, $b) { return $b['desde'] <=> $a['desde']; });
    // Los suscriptores de MP sin ficha de cliente.
    foreach ($suscriptores as $sid => $s) {
        if (isset($usados[$sid])) continue;
        $pre = (string)($s['preapprovalId'] ?? '');
        $estado = (string)($s['estado'] ?? '');
        if ($pre !== '' && isset($avisos[$pre])) $estado = ($avisos[$pre]['tipoEvento'] === 'pausa' ? 'pausada' : 'baja') . ' en MP';
        $filas[] = [
            'id'        => (string)$sid,
            'nombre'    => trim((string)($s['nombre'] ?? '')) ?: (string)($s['email'] ?? ''),
            'negocio'   => '',
            'plan'      => trim((string)($s['planLabel'] ?? '')),
            'monto'     => (int)($s['monto'] ?? 0),
            'dominio'   => trim((string)($s['dominio'] ?? '')),
            'estado'    => $estado . ' · solo en MP',
            'dia'       => wabot_clientes_dia(wabot_clientes_ts($s['fechaAlta'] ?? $s['createdAt'] ?? null)),
            'clave'     => wabot_clientes_chat_de($s, $sid, $chats),
            'telefono'  => (string)($s['whatsapp'] ?? ''),
            'email'     => trim((string)($s['email'] ?? '')),
            'entregada' => false,
            'desde'     => wabot_clientes_ts($s['createdAt'] ?? null),
            'origen'    => 'mantenimiento',
        ];
    }
    return $filas;
}

/* ── Todo junto para la pestaña ────────────────────────────────────────── */

/**
 * Lo que pinta la pestaña: nuevos, mantenimiento y los pagos sin asignar (estos
 * siempre frescos). Firestore y el barrido de charlas quedan en caché 10 min.
 */
function wabot_clientes_datos($forzar = false, $ahora = null) {
    $ahora = $ahora ?? time();
    $cache = json_decode((string)@file_get_contents(wabot_clientes_cache_archivo()), true);
    if (!$forzar && is_array($cache) && (int)($cache['ts'] ?? 0) > $ahora - WABOT_CLIENTES_CACHE_SEG && isset($cache['nuevos'], $cache['mantenimiento'])) {
        $datos = $cache;
    } else {
        $chats = wabot_clientes_chats();
        $datos = ['ts' => $ahora, 'nuevos' => wabot_clientes_nuevos($chats), 'mantenimiento' => [], 'error' => ''];
        try {
            $datos['mantenimiento'] = wabot_clientes_mantenimiento(wabot_clientes_fs_leer(), $chats);
        } catch (\Throwable $e) {
            $datos['error'] = $e->getMessage();
            wabot_log('error', ['donde' => 'clientes_firestore', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        }
        wabot_json_guardar_atomico(wabot_clientes_cache_archivo(), $datos);
    }
    $datos['sin_asignar'] = wabot_pagos_sin_asignar();
    // Los nombres de los chats sugeridos para cada pago sin asignar.
    $porClave = [];
    foreach ((array)$datos['nuevos'] as $r) $porClave[$r['clave']] = $r;
    // El cliente del admin con el mismo mail que el que pagó (3-nov): viene elegido en «Es de un cliente».
    $porMail = [];
    foreach ((array)$datos['mantenimiento'] as $r) {
        $m = wabot_pagos_email_clave($r['email'] ?? '');
        if ($m !== '' && !isset($porMail[$m])) $porMail[$m] = (string)$r['id'];
    }
    foreach ($datos['sin_asignar'] as &$p) {
        $p['cliente_sugerido'] = $porMail[wabot_pagos_email_clave($p['email'] ?? '')] ?? '';
        $p['sugeridos_info'] = [];
        foreach ((array)($p['sugeridos'] ?? []) as $clave => $modalidad) {
            $p['sugeridos_info'][] = ['clave' => (string)$clave, 'modalidad' => (string)$modalidad, 'nombre' => wabot_clientes_nombre_de((string)$clave)];
        }
    }
    unset($p);
    return $datos;
}

/**
 * La vista Clientes de Conversaciones (Pablo, 2-nov: «que sea solo una
 * pestaña, al lado de Todos, con los chats de los que ya son clientes»): marca
 * `cliente` en las filas de la lista que pagaron (pago_confirmado) o que son el
 * chat de un cliente del admin. Esos salen de la caché de esta pestaña, sin ir
 * a Firestore: la lista se pide cada pocos segundos (el cron la mantiene al día).
 */
function wabot_clientes_marcar_lista(array $items) {
    $cache = json_decode((string)@file_get_contents(wabot_clientes_cache_archivo()), true);
    $claves = [];
    foreach (['nuevos', 'mantenimiento'] as $k) {
        foreach ((array)($cache[$k] ?? []) as $r) {
            if (is_array($r) && (string)($r['clave'] ?? '') !== '') $claves[(string)$r['clave']] = true;
        }
    }
    foreach ($items as &$it) $it['cliente'] = !empty($it['pago_confirmado']) || isset($claves[(string)($it['tel'] ?? '')]);
    unset($it);
    return $items;
}

/** El nombre de una charla por su clave, sin cargarla entera si está en la lista del panel. */
function wabot_clientes_nombre_de($clave) {
    if (!wabot_conv_existe($clave)) return $clave;
    try {
        $cv = wabot_conv_load($clave);
        $n = function_exists('wabot_nombre_agenda') ? wabot_nombre_agenda($cv) : trim((string)($cv['nombre'] ?? ''));
        $neg = trim((string)($cv['nombre_negocio'] ?? ''));
        // La agenda ya suele traer el negocio ("Beto - Bar Beto"): no repetirlo.
        return trim($n . ($neg !== '' && mb_stripos($n, $neg) === false ? ' · ' . $neg : '')) ?: $clave;
    } catch (\Throwable $e) {
        return $clave;
    }
}
