<?php
/**
 * wabot/renovacion.php — el aviso de renovación a los del plan mensual que
 * pagan por afuera de Mercado Pago (Pablo, 25-oct: "quiero que el bot envíe
 * esta plantilla cuando sea la fecha de renovar").
 *
 * Quiénes son y qué día pagan lo decide el admin (Mantenimiento → Pagan por
 * afuera: la marca `pagaPorFuera`, el `diaCobro` y, sin día, el del alta).
 * Esa cuenta vive en admin/dashboard.js (_mantPorFueraLista) y depende de
 * Mantenimiento, Clientes y los avisos de baja: en vez de rehacerla acá, el
 * admin le pasa la lista al bot cada vez que cambia (accion renovaciones_sync
 * de admin.php) y el cron la usa. Se guarda en data/renovaciones.json:
 *   lista:    [{id, tel, persona, negocio, monto, dia, desde}]   id = "coleccion:docId"
 *   sync_ts:  cuándo la mandó el admin
 *   enviados: {id: {mes: "YYYY-MM", ts, ok}}   un aviso por mes y por cliente
 *
 * Desde el 16-nov el día del cobro le llega a Pablo por WhatsApp el aviso con
 * los datos (wabot_renovacion_correr). Desde el 23-nov (Pablo: «quiero que el
 * wabot vuelva a mandar plantilla de pagos») también vuelve a salir la plantilla
 * al cliente ese día (solo del segundo pago en adelante y si no pagó por
 * adelantado) y, cuando Pablo marca «💵 Pagó» en el admin, la de pago recibido.
 *   pagado:      en cada fila, el último cobro marcado pagado (pagadoHasta del admin)
 *   pagos_visto: {id: pagado} lo último que se vio de cada uno
 *   pagos_cola:  {id: {pagado, ts}} pagos recién marcados, para mandar el «recibimos tu pago»
 * Antes: el cron (seguimiento.php) mandaba la plantilla `renovacion_por_fuera` el día
 * del cobro, desde las 10 h, una sola vez. Si ese día no salió (cron caído, sin
 * chat), no se manda tarde: el texto dice "hoy", y Pablo recibe el push.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

const WABOT_RENOVACION_ARCHIVO = WABOT_DATA . '/renovaciones.json';
// Desde esta hora de Argentina sale el aviso del día.
const WABOT_RENOVACION_HORA = 10;
// Una lista que el admin no actualiza hace más de esto puede tener bajas que el bot no sabe.
const WABOT_RENOVACION_LISTA_VIEJA = 35 * 86400;
// Cuánto se guarda cada aviso enviado (el del mes no se repite; los viejos se podan).
const WABOT_RENOVACION_ENVIADOS_DIAS = 62;

function wabot_renovacion_estado() {
    $j = json_decode((string)@file_get_contents(WABOT_RENOVACION_ARCHIVO), true);
    if (!is_array($j)) $j = [];
    return [
        'lista'    => array_values(array_filter((array)($j['lista'] ?? []), 'is_array')),
        'sync_ts'  => (int)($j['sync_ts'] ?? 0),
        'enviados' => (array)($j['enviados'] ?? []),
        'aviso_vieja_ts' => (int)($j['aviso_vieja_ts'] ?? 0),
        'pagos_visto' => (array)($j['pagos_visto'] ?? []),
        'pagos_cola' => (array)($j['pagos_cola'] ?? []),
        'pagos_init' => !empty($j['pagos_init']),
    ];
}

function wabot_renovacion_guardar(array $estado) {
    return wabot_json_guardar_atomico(WABOT_RENOVACION_ARCHIVO, $estado);
}

/** Limpia una fila que manda el admin; null si no sirve. */
function wabot_renovacion_fila($f) {
    if (!is_array($f)) return null;
    $id = trim((string)($f['id'] ?? ''));
    if (!preg_match('/^(mantenimiento|clientes):[A-Za-z0-9_-]{1,64}$/', $id)) return null;
    $dia = (int)($f['dia'] ?? 0);
    $desde = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($f['desde'] ?? '')) ? (string)$f['desde'] : '';
    if ($dia < 1 || $dia > 31) $dia = $desde !== '' ? (int)substr($desde, 8, 2) : 0;
    if ($dia < 1) return null;
    $limpio = function ($s, $max) { return mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$s)), 0, $max); };
    return [
        'id'      => $id,
        'tel'     => preg_replace('/\D+/', '', (string)($f['tel'] ?? '')),
        'persona' => $limpio($f['persona'] ?? '', 60),
        'negocio' => $limpio($f['negocio'] ?? '', 80),
        'monto'   => max(0, (int)round((float)($f['monto'] ?? 0))),
        'dia'     => $dia,
        'desde'   => $desde,
        'pagado'  => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)($f['pagado'] ?? '')) ? (string)$f['pagado'] : '',
    ];
}

/** Los avisos de hace más de dos meses ya no frenan nada: se sacan para que el archivo no crezca. */
function wabot_renovacion_enviados_podar(array $enviados, $ahora) {
    $limite = (int)$ahora - WABOT_RENOVACION_ENVIADOS_DIAS * 86400;
    return array_filter($enviados, function ($e) use ($limite) {
        return is_array($e) && (int)($e['ts'] ?? 0) >= $limite;
    });
}

/** Lo que manda el admin. Devuelve el estado guardado. */
function wabot_renovacion_sync(array $lista, $ahora = null) {
    $estado = wabot_renovacion_estado();
    $estado['lista'] = array_values(array_filter(array_map('wabot_renovacion_fila', $lista)));
    $estado['sync_ts'] = $ahora ?? time();
    $estado['aviso_vieja_ts'] = 0;
    // Los avisos NO se atan a la lista (5-nov): una lista que llegaba incompleta los borraba todos,
    // la tabla dejaba de mostrarlos y el mismo día el cron podía mandar el aviso dos veces.
    $estado['enviados'] = wabot_renovacion_enviados_podar($estado['enviados'], $estado['sync_ts']);
    $estado = wabot_renovacion_pagos_detectar($estado);
    wabot_renovacion_guardar($estado);
    return $estado;
}

/**
 * Los pagos por afuera recién marcados (23-nov): una fila cuyo `pagado` avanzó
 * desde la última lista va a la cola del «recibimos tu pago». La primera lista
 * (pagos_init) y los clientes que aparecen por primera vez solo se anotan: no se
 * avisan pagos viejos. Si Pablo deshace el «Pagó», sale de la cola.
 */
function wabot_renovacion_pagos_detectar(array $estado) {
    $estado += ['pagos_visto' => [], 'pagos_cola' => [], 'pagos_init' => false];
    foreach ($estado['lista'] as $f) {
        $id = $f['id'];
        $nuevo = (string)($f['pagado'] ?? '');
        $visto = array_key_exists($id, $estado['pagos_visto']) ? (string)$estado['pagos_visto'][$id] : null;
        if ($estado['pagos_init'] && $visto !== null && $nuevo !== '' && $nuevo > $visto) {
            $estado['pagos_cola'][$id] = ['pagado' => $nuevo, 'ts' => (int)$estado['sync_ts']];
        } elseif (isset($estado['pagos_cola'][$id]) && ($nuevo === '' || $nuevo < (string)$estado['pagos_cola'][$id]['pagado'])) {
            unset($estado['pagos_cola'][$id]);
        }
        $estado['pagos_visto'][$id] = $nuevo;
    }
    $estado['pagos_init'] = true;
    return $estado;
}

/** "2026-11-19" + 1 mes = "2026-12-19" (el 31 en un mes de 30 es el 30). */
function wabot_renovacion_mas_un_mes($ymd) {
    if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', (string)$ymd, $m)) return '';
    $a = (int)$m[1];
    $mes = (int)$m[2] + 1;
    if ($mes > 12) { $mes = 1; $a++; }
    $ultimo = (int)gmdate('t', gmmktime(12, 0, 0, $mes, 1, $a));
    return sprintf('%04d-%02d-%02d', $a, $mes, min((int)$m[3], $ultimo));
}

/**
 * Una plantilla de pagos al cliente de una fila del admin (23-nov): renovación,
 * pago recibido, cobro rechazado, último intento, baja. $marca evita repetirla
 * en el mismo chat aunque se pierda el registro. Devuelve 'ok', 'ya', 'inactiva',
 * 'sin_chat', 'telefono', 'ambiguo', 'ocupado' o 'error'. $enviar(clave, fila,
 * valores, plantilla) reemplaza la red en los tests.
 */
function wabot_pagos_plantilla_cliente(array $f, $plantilla, array $valores, $cfg, $marca, $enviar = null) {
    if (wabot_plantilla_config($plantilla, $cfg) === null) return 'inactiva';
    $tel = (string)($f['tel'] ?? '');
    if ($tel === '') return 'sin_chat';
    $clave = wabot_renovacion_clave($tel, $motivo);
    if ($clave === null) return $motivo === 'ambiguo' ? 'ambiguo' : 'telefono';
    if ($enviar) return $enviar($clave, $f, $valores, $plantilla) ? 'ok' : 'error';

    $lock = wabot_lock_tomar($clave);
    if (!$lock) return 'ocupado';
    try {
        $conv = wabot_conv_load($clave);
        if ($marca !== '' && !empty($conv['avisos_pago'][$marca])) return 'ya';
        $negocio = (string)($f['negocio'] ?? '');
        if (trim((string)($conv['nombre_negocio'] ?? '')) === '' && $negocio !== '') $conv['nombre_negocio'] = $negocio;
        if (!wabot_enviar_plantilla($conv, $plantilla, $cfg, $valores)) return 'error';
        if ($marca !== '') {
            $conv['avisos_pago'] = array_slice((array)($conv['avisos_pago'] ?? []), -30, null, true);
            $conv['avisos_pago'][$marca] = time();
        }
        wabot_conv_save($conv);
        return 'ok';
    } finally {
        wabot_lock_soltar($lock);
    }
}

/** El saludo y el negocio de una fila: ['nombre' => 'Juan', 'negocio' => 'Panadería Sol']. */
function wabot_pagos_nombre_negocio(array $f) {
    $negocio = (string)($f['negocio'] ?? '');
    $persona = (string)($f['persona'] ?? '');
    $nombre = wabot_renovacion_nombre($persona, $negocio) ?: ($negocio !== '' ? $negocio : 'cómo estás');
    return ['nombre' => $nombre, 'negocio' => $negocio !== '' ? $negocio : 'tu web'];
}

/** Un resultado final (no se reintenta) de una plantilla al cliente. */
function wabot_pagos_resultado_final($r) {
    return !in_array($r, ['error', 'ocupado'], true);
}

/** El renglón para el aviso a Pablo con lo que pasó con la plantilla al cliente. */
function wabot_pagos_resultado_texto($r) {
    $t = ['ok' => 'enviada', 'ya' => 'ya la tenía', 'inactiva' => 'NO salió: la plantilla está apagada (Ajustes → Plantillas)',
          'sin_chat' => 'NO salió: sin teléfono en la ficha', 'telefono' => 'NO salió: el teléfono no parece de WhatsApp',
          'ambiguo' => 'NO salió: el número coincide con dos chats', 'ocupado' => 'se reintenta en la próxima pasada',
          'error' => 'falló el envío, se reintenta en la próxima pasada'];
    return 'Plantilla al cliente: ' . ($t[$r] ?? $r);
}

/** El día del cobro de este mes (Y-m-d, reloj argentino): el 31 en un mes de 30 es el 30. */
function wabot_renovacion_dia_del_mes($dia, $ahora) {
    $local = (int)$ahora - 3 * 3600;
    $a = (int)gmdate('Y', $local);
    $m = (int)gmdate('n', $local);
    $ultimo = (int)gmdate('t', gmmktime(12, 0, 0, $m, 1, $a));
    return sprintf('%04d-%02d-%02d', $a, $m, min((int)$dia, $ultimo));
}

/**
 * La clave del chat para ese teléfono: el chat que ya existe o, si nunca
 * escribió, una nueva con el número como lo espera WhatsApp (549 + área +
 * número, sin el 15). null si no se puede (vacío, raro o dos chats posibles).
 */
function wabot_renovacion_clave($tel, &$motivo = null) {
    $motivo = null;
    $clave = wabot_conv_resolver($tel, $motivo);
    if ($clave !== null) return $clave;
    if ($motivo === 'ambiguo') return null;

    $d = ltrim(preg_replace('/\D/', '', (string)$tel), '0');
    if (strpos($d, '54') === 0) $d = ltrim(substr($d, 2), '0');
    if (strpos($d, '9') === 0 && strlen($d) === 11) $d = substr($d, 1);
    if (strlen($d) === 12) {
        foreach ([2, 3, 4] as $area) {
            if (substr($d, $area, 2) === '15') { $d = substr($d, 0, $area) . substr($d, $area + 2); break; }
        }
    }
    if (strlen($d) !== 10) { $motivo = 'telefono'; return null; }
    $motivo = 'nuevo';
    return '549' . $d;
}

/** "Juan Pérez" → "Juan". */
function wabot_renovacion_nombre($persona, $negocio = '') {
    $p = trim((string)$persona);
    if ($p === '') return '';
    // Sin una sola letra («_», un emoji) no es el nombre de nadie: salió «Hola _,» (ARMONIA, 9-nov).
    if (!preg_match('/\p{L}/u', $p)) return '';
    // Si la ficha tiene el negocio en el lugar de la persona («Todo Pernil» / «Todo Pernil»),
    // cortar a la primera palabra da «Hola Todo,»: que el que llama use el negocio entero.
    if ($negocio !== '' && mb_strtolower($p, 'UTF-8') === mb_strtolower(trim((string)$negocio), 'UTF-8')) return '';
    return (string)preg_split('/\s+/u', $p)[0];
}

/**
 * Manda la plantilla a una fila. $enviar(clave, fila, valores) reemplaza la red
 * en los tests. Devuelve 'ok', 'ya' (el chat ya lo tuvo este mes), 'sin_chat', 'telefono', 'ambiguo', 'ocupado' o 'error'.
 */
function wabot_renovacion_enviar_fila(array $f, $cfg, $enviar = null) {
    $negocio = $f['negocio'] !== '' ? $f['negocio'] : 'tu web';
    $nombre = wabot_renovacion_nombre($f['persona'], $f['negocio']) ?: ($f['negocio'] !== '' ? $f['negocio'] : 'cómo estás');
    $valores = ['nombre' => $nombre, 'negocio' => $negocio, 'monto' => wabot_moneda($f['monto']) . ' por mes'];

    if ($f['tel'] === '') return 'sin_chat';
    $clave = wabot_renovacion_clave($f['tel'], $motivo);
    if ($clave === null) return $motivo === 'ambiguo' ? 'ambiguo' : 'telefono';
    if ($enviar) return $enviar($clave, $f, $valores) ? 'ok' : 'error';

    $lock = wabot_lock_tomar($clave);
    if (!$lock) return 'ocupado';
    try {
        $conv = wabot_conv_load($clave);
        // Segundo candado: si el chat ya recibió el aviso este mes, no se repite aunque el registro se haya perdido.
        $ya = (int)($conv['renovacion_aviso_ts'] ?? 0);
        if ($ya && gmdate('Y-m', $ya - 3 * 3600) === gmdate('Y-m', time() - 3 * 3600)) return 'ya';
        if (trim((string)($conv['nombre_negocio'] ?? '')) === '' && $f['negocio'] !== '') $conv['nombre_negocio'] = $f['negocio'];
        if (!wabot_enviar_plantilla($conv, 'renovacion_por_fuera', $cfg, $valores)) return 'error';
        $conv['renovacion_aviso_ts'] = time();
        wabot_conv_save($conv);
        return 'ok';
    } finally {
        wabot_lock_soltar($lock);
    }
}

/** "2026-03-14" → "14/03/2026"; '' si no viene. */
function wabot_renovacion_fecha_texto($ymd) {
    return preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', (string)$ymd, $m) ? "$m[3]/$m[2]/$m[1]" : '';
}

/** El aviso a Pablo (16-nov) para una fila: [titulo, renglones, clave del chat o '']. */
function wabot_renovacion_aviso_texto(array $f) {
    $clave = $f['tel'] !== '' ? (wabot_renovacion_clave($f['tel'], $motivo) ?? '') : '';
    $cliente = trim($f['persona'] . ($f['persona'] !== '' && $f['negocio'] !== '' ? ' — ' : '') . $f['negocio']);
    $desde = wabot_renovacion_fecha_texto($f['desde']);
    return ['💵 Pago por afuera: hoy le toca pagar', [
        'Cliente: ' . ($cliente !== '' ? $cliente : 'sin nombre en la ficha'),
        'WhatsApp: ' . ($clave !== '' ? '+' . $clave : ($f['tel'] !== '' ? $f['tel'] . ' (no parece un número de WhatsApp)' : 'sin teléfono cargado')),
        'Monto: ' . ($f['monto'] > 0 ? wabot_moneda($f['monto']) . ' por mes' : 'sin monto en la ficha'),
        'Día de cobro: el ' . $f['dia'] . ' de cada mes',
        $desde !== '' ? 'Cliente desde: ' . $desde : '',
        'Pagan por afuera (transferencia), no por Mercado Pago.',
    ], $clave];
}

/**
 * La corrida del cron. El día del cobro le avisa a Pablo por WhatsApp con los
 * datos del cliente (16-nov) y, desde el 23-nov, le manda al cliente la plantilla
 * de renovación; también el «recibimos tu pago» de los recién marcados «Pagó».
 * Para los tests: $estado (sin disco), $enviar(clave, fila, valores, plantilla)
 * y $avisar(titulo, renglones, clave).
 */
function wabot_renovacion_correr($cfg, $ahora = null, $estado = null, $enviar = null, $avisar = null) {
    $ahora = $ahora ?? time();
    $res = ['revisados' => 0, 'enviados' => 0, 'fallidos' => 0, 'detalle' => []];
    if (wabot_hora_local($ahora) < WABOT_RENOVACION_HORA || wabot_hora_local($ahora) >= 20) return $res;

    $enDisco = $estado === null;
    $estado = $estado ?? wabot_renovacion_estado();
    $avisar = $avisar ?? 'wabot_aviso_cobro_pablo';

    if (!$estado['lista']) return $res;
    if ($ahora - (int)$estado['sync_ts'] > WABOT_RENOVACION_LISTA_VIEJA) {
        // Sin abrir el admin hace más de un mes: puede haber bajas que el bot no sabe.
        if (!$estado['aviso_vieja_ts']) {
            $avisar('Avisos de pago por afuera frenados', ['La lista de los que pagan por afuera tiene más de 35 días. Abrí el admin (Mantenimiento) para actualizarla.'], '');
            $estado['aviso_vieja_ts'] = $ahora;
            if ($enDisco) wabot_renovacion_guardar($estado);
        }
        return $res + ['lista_vieja' => true];
    }

    $hoy = gmdate('Y-m-d', $ahora - 3 * 3600);
    $mes = substr($hoy, 0, 7);
    $res += ['clientes' => 0, 'pagos' => 0];
    $estado += ['pagos_cola' => []];
    foreach ($estado['lista'] as $f) {
        $res['revisados']++;
        if (wabot_renovacion_dia_del_mes($f['dia'], $ahora) !== $hoy) continue;
        // El día del alta ya pagó el primer mes: el aviso es del segundo pago en adelante.
        if ($f['desde'] !== '' && $f['desde'] >= $hoy) continue;
        $env = (array)($estado['enviados'][$f['id']] ?? []);

        // La plantilla al cliente (23-nov), salvo que ya haya pagado este cobro por adelantado.
        $cliente = (string)($env['cliente_mes'] ?? '') === $mes ? (string)($env['cliente'] ?? '') : null;
        if ($cliente === null) {
            $cliente = (string)($f['pagado'] ?? '') >= $hoy ? 'pagado'
                : wabot_pagos_plantilla_cliente($f, 'renovacion_por_fuera',
                    wabot_pagos_nombre_negocio($f) + ['monto' => wabot_moneda($f['monto']) . ' por mes'], $cfg, 'renovacion:' . $mes, $enviar);
            if (wabot_pagos_resultado_final($cliente)) {
                $env['cliente_mes'] = $mes;
                $env['cliente'] = $cliente;
                if ($cliente === 'ok') $res['clientes']++;
                wabot_log('renovacion_cliente', ['id' => $f['id'], 'tel' => $f['tel'], 'resultado' => $cliente]);
                $estado['enviados'][$f['id']] = $env + ['ts' => $ahora];
                if ($enDisco) wabot_renovacion_guardar($estado);
            }
        }

        if ((string)($env['mes'] ?? '') === $mes) continue;
        [$titulo, $lineas, $clave] = wabot_renovacion_aviso_texto($f);
        $lineas[] = $cliente === 'pagado' ? 'Ya lo marcaste pagado: al cliente no se le mandó el recordatorio.' : wabot_pagos_resultado_texto($cliente);
        $ok = (bool)$avisar($titulo, $lineas, $clave);
        if (!$ok) { $res['fallidos']++; continue; }   // no salió: la próxima pasada lo reintenta (hasta las 20 h)
        $estado['enviados'][$f['id']] = array_merge((array)($estado['enviados'][$f['id']] ?? []), ['mes' => $mes, 'ts' => $ahora, 'ok' => true, 'resultado' => 'pablo']);
        if ($enDisco) wabot_renovacion_guardar($estado);
        $res['enviados']++;
        $res['detalle'][] = ['id' => $f['id'], 'resultado' => 'pablo', 'cliente' => $cliente];
        wabot_log('renovacion_aviso', ['id' => $f['id'], 'tel' => $f['tel'], 'resultado' => 'pablo']);
    }

    // «Recibimos tu pago» de los que Pablo marcó con «💵 Pagó» en el admin (23-nov).
    $porId = [];
    foreach ($estado['lista'] as $f) $porId[$f['id']] = $f;
    foreach ((array)$estado['pagos_cola'] as $id => $p) {
        $f = $porId[$id] ?? null;
        // Ya no está en la lista (baja, dejó de pagar por afuera) o la marca tiene más de 3 días: no se manda tarde.
        if (!$f || $ahora - (int)($p['ts'] ?? 0) > 3 * 86400) { unset($estado['pagos_cola'][$id]); continue; }
        $hasta = wabot_renovacion_mas_un_mes((string)$p['pagado']);
        $r = wabot_pagos_plantilla_cliente($f, 'pago_recibido',
            wabot_pagos_nombre_negocio($f) + ['monto' => wabot_moneda($f['monto']), 'fecha' => wabot_renovacion_fecha_texto($hasta)],
            $cfg, 'pago:' . $id . ':' . $p['pagado'], $enviar);
        if (!wabot_pagos_resultado_final($r)) continue;
        unset($estado['pagos_cola'][$id]);
        if ($r === 'ok') $res['pagos']++;
        $res['detalle'][] = ['id' => $id, 'pago_recibido' => $r];
        wabot_log('pago_recibido_cliente', ['id' => $id, 'tel' => $f['tel'], 'pagado' => $p['pagado'], 'resultado' => $r, 'via' => 'por_fuera']);
    }
    if ($enDisco) wabot_renovacion_guardar($estado);
    return $res + ($enDisco ? [] : ['estado' => $estado]);
}
