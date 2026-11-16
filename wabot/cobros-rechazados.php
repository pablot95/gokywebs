<?php
/**
 * wabot/cobros-rechazados.php — el aviso al cliente cuando Mercado Pago no le
 * pudo cobrar la mensualidad de la suscripción (Pablo, 12-nov: "cuando un pago
 * de mercadopago una suscripción está atrasada, se le envíe por wabot al
 * cliente. Que al día siguiente del primer pago rechazado se envíe, no más que eso").
 *
 * Un solo mensaje por cobro: el día siguiente al primer intento rechazado, de
 * 10 a 20 h, y solo si en ese momento sigue sin cobrarse. Los reintentos de MP
 * (hasta 4 en 10 días) no mandan nada más. Si ese día no salió, no sale después.
 *
 * Quién es cada suscripción lo sabe el admin (el cruce de Mantenimiento con
 * Mercado Pago, _cruceMercadoPago en admin/dashboard.js): como la renovación,
 * el admin le pasa la lista al bot cada vez que cambia (accion
 * cobros_rechazados_sync de admin.php). Se guarda en data/cobros-rechazados.json:
 *   lista:    [{id, pre, tel, persona, negocio, seguro}]   id = "coleccion:docId", pre = preapprovalId
 *             seguro = vinculada por ID o por nombre (las elegidas solo por la fecha no se avisan)
 *   sync_ts:  cuándo la mandó el admin
 *   enviados: {cobroId: {ts, id, pre, dia, resultado, ok}}   uno por cobro de MP (authorized_payment)
 *
 * El rechazo sale de la API de MP: las suscripciones con el semáforo en
 * amarillo o rojo (el último cobro rebotó) y, de esas, el cobro del mes
 * (/authorized_payments/search): `debit_date` es el día del primer intento,
 * `payment.status` rejected mientras no se cobra.
 *
 * 16-nov (Pablo): ya no sale la plantilla al cliente. El aviso, con los datos
 * del cliente, le llega a Pablo por WhatsApp (wabot_aviso_cobro_pablo), y
 * también cuando una suscripción se cancela o se pausa.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/pagos.php';        // wabot_pagos_mp / wabot_pagos_mp_yo
require_once __DIR__ . '/renovacion.php';   // wabot_renovacion_clave / wabot_renovacion_nombre

const WABOT_COBRO_RECH_ARCHIVO = WABOT_DATA . '/cobros-rechazados.json';
const WABOT_COBRO_RECH_HORA_DESDE = 10;
const WABOT_COBRO_RECH_HORA_HASTA = 20;
// Una lista que el admin no actualiza hace más de esto puede tener bajas o cambios que el bot no sabe.
const WABOT_COBRO_RECH_LISTA_VIEJA = 35 * 86400;
const WABOT_COBRO_RECH_ENVIADOS_DIAS = 62;
// Una cancelación más vieja que esto ya no se avisa (la primera corrida no larga todo el historial).
const WABOT_COBRO_RECH_CANCELADA_DIAS = 3;

function wabot_cobro_rech_estado() {
    $j = json_decode((string)@file_get_contents(WABOT_COBRO_RECH_ARCHIVO), true);
    if (!is_array($j)) $j = [];
    return [
        'lista'    => array_values(array_filter((array)($j['lista'] ?? []), 'is_array')),
        'sync_ts'  => (int)($j['sync_ts'] ?? 0),
        'enviados' => (array)($j['enviados'] ?? []),
        'aviso_vieja_ts' => (int)($j['aviso_vieja_ts'] ?? 0),
        // Toda suscripción que el admin mandó alguna vez (16-nov): al cancelarse sale de la
        // lista del admin, y sin esto el aviso no sabría de quién era.
        'conocidos' => (array)($j['conocidos'] ?? []),
        'canceladas' => (array)($j['canceladas'] ?? []),
    ];
}

function wabot_cobro_rech_guardar(array $estado) {
    return wabot_json_guardar_atomico(WABOT_COBRO_RECH_ARCHIVO, $estado);
}

/** Limpia una fila que manda el admin; null si no sirve. */
function wabot_cobro_rech_fila($f) {
    if (!is_array($f)) return null;
    $id = trim((string)($f['id'] ?? ''));
    if (!preg_match('/^(mantenimiento|clientes):[A-Za-z0-9_-]{1,64}$/', $id)) return null;
    $pre = trim((string)($f['pre'] ?? ''));
    if (!preg_match('/^[A-Za-z0-9_-]{6,64}$/', $pre)) return null;
    $limpio = function ($s, $max) { return mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$s)), 0, $max); };
    return [
        'id'      => $id,
        'pre'     => $pre,
        'tel'     => preg_replace('/\D+/', '', (string)($f['tel'] ?? '')),
        'persona' => $limpio($f['persona'] ?? '', 60),
        'negocio' => $limpio($f['negocio'] ?? '', 80),
        'seguro'  => !empty($f['seguro']),
    ];
}

/** Lo que manda el admin. Devuelve el estado guardado. */
function wabot_cobro_rech_sync(array $lista, $ahora = null) {
    $estado = wabot_cobro_rech_estado();
    $estado['lista'] = array_values(array_filter(array_map('wabot_cobro_rech_fila', $lista)));
    $estado['sync_ts'] = $ahora ?? time();
    $estado['aviso_vieja_ts'] = 0;
    foreach ($estado['lista'] as $f) $estado['conocidos'][$f['pre']] = $f + ['visto_ts' => $estado['sync_ts']];
    $limite = $estado['sync_ts'] - WABOT_COBRO_RECH_ENVIADOS_DIAS * 86400;
    $estado['enviados'] = array_filter($estado['enviados'], function ($e) use ($limite) {
        return is_array($e) && (int)($e['ts'] ?? 0) >= $limite;
    });
    wabot_cobro_rech_guardar($estado);
    return $estado;
}

/** "2026-11-10T16:09:50.000-04:00" → "2026-11-10" en hora argentina; '' si no se entiende. */
function wabot_cobro_rech_dia_local($iso) {
    $ts = strtotime((string)$iso);
    return $ts ? gmdate('Y-m-d', $ts - 3 * 3600) : '';
}

/**
 * Los cobros de suscripción que Mercado Pago intentó y rechazó y siguen sin
 * cobrarse: [{cobro, pre, nombre_mp, monto, primer_intento (Y-m-d), intento}].
 * $mp(ruta) es la API (los tests le pasan datos fijos).
 */
function wabot_cobro_rech_detectar(callable $mp, &$canceladas = null) {
    $yo = wabot_pagos_mp_yo($mp);
    $atrasadas = [];
    $canceladas = [];
    for ($offset = 0; $offset < 1000; $offset += 100) {
        $pagina = $mp('/preapproval/search?limit=100&offset=' . $offset);
        foreach ((array)($pagina['results'] ?? []) as $s) {
            if ((string)($s['collector_id'] ?? '') !== $yo) continue;
            // Canceladas o pausadas (16-nov): Pablo quiere el aviso con los datos del cliente.
            if (in_array((string)($s['status'] ?? ''), ['cancelled', 'paused'], true)) {
                $canceladas[] = [
                    'pre' => (string)($s['id'] ?? ''),
                    'estado' => (string)$s['status'],
                    'ts' => (int)strtotime((string)($s['last_modified'] ?? $s['date_created'] ?? '')),
                    'nombre_mp' => trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? '')),
                    'monto' => (float)($s['auto_recurring']['transaction_amount'] ?? 0),
                    'plan' => trim((string)($s['reason'] ?? '')),
                    'alta' => wabot_cobro_rech_dia_local($s['date_created'] ?? ''),
                ];
                continue;
            }
            if ((string)($s['status'] ?? '') !== 'authorized') continue;
            // Verde = al día. Amarillo/rojo = el último cobro rebotó y MP lo está reintentando.
            if (!in_array((string)($s['summarized']['semaphore'] ?? ''), ['yellow', 'red'], true)) continue;
            $atrasadas[(string)$s['id']] = $s;
        }
        if ($offset + 100 >= (int)($pagina['paging']['total'] ?? 0)) break;
    }

    $rechazados = [];
    foreach ($atrasadas as $pre => $s) {
        $cobros = $mp('/authorized_payments/search?preapproval_id=' . rawurlencode($pre) . '&limit=12');
        foreach ((array)($cobros['results'] ?? []) as $c) {
            // processed = cobrado; scheduled/recycling con el pago rechazado = reintentando.
            if (!in_array((string)($c['status'] ?? ''), ['scheduled', 'recycling'], true)) continue;
            if ((string)($c['payment']['status'] ?? '') !== 'rejected') continue;
            $dia = wabot_cobro_rech_dia_local($c['debit_date'] ?? $c['date_created'] ?? '');
            if ($dia === '' || empty($c['id'])) continue;
            $rechazados[] = [
                'cobro' => (string)$c['id'],
                'pre' => $pre,
                'nombre_mp' => trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? '')),
                'plan' => trim((string)($s['reason'] ?? '')),
                'monto' => (float)($c['transaction_amount'] ?? $s['auto_recurring']['transaction_amount'] ?? 0),
                'primer_intento' => $dia,
                'intento' => (int)($c['retry_attempt'] ?? 0),
                'motivo' => (string)($c['rejection_code'] ?? $c['payment']['status_detail'] ?? ''),
            ];
        }
    }
    return $rechazados;
}

/** "2026-11-10" → "10/11"; '' si no viene. */
function wabot_cobro_rech_fecha_corta($ymd) {
    return preg_match('/^\d{4}-(\d{2})-(\d{2})$/', (string)$ymd, $m) ? "$m[2]/$m[1]" : '';
}

/** Los motivos de rechazo de MP que más aparecen, en castellano. */
function wabot_cobro_rech_motivo_texto($m) {
    $t = [
        'insufficient_amount' => 'fondos insuficientes', 'cc_rejected_insufficient_amount' => 'fondos insuficientes',
        'cc_rejected_call_for_authorize' => 'la tarjeta pide autorizar el pago', 'cc_rejected_card_disabled' => 'tarjeta deshabilitada',
        'cc_rejected_bad_filled_date' => 'tarjeta vencida', 'expired_card' => 'tarjeta vencida',
        'cc_rejected_high_risk' => 'rechazado por seguridad de MP', 'cc_rejected_other_reason' => 'el banco lo rechazó',
        'cc_rejected_max_attempts' => 'demasiados intentos', 'cc_rejected_blacklist' => 'rechazado por MP',
    ];
    $m = trim((string)$m);
    return $m === '' ? '' : ($t[$m] ?? $m);
}

/** Renglones de cliente/WhatsApp y la clave del chat de una fila del admin (o lo que diga MP si no hay fila). */
function wabot_cobro_rech_cliente($f, $nombreMp) {
    if (!is_array($f)) {
        return [['Cliente: no está vinculado en el admin' . ($nombreMp !== '' ? ' (en MP figura «' . $nombreMp . '»)' : ''),
                 'Vinculalo en Mantenimiento → Vincular con MP.'], ''];
    }
    $persona = (string)($f['persona'] ?? '');
    $negocio = (string)($f['negocio'] ?? '');
    $tel = (string)($f['tel'] ?? '');
    $cliente = trim($persona . ($persona !== '' && $negocio !== '' ? ' — ' : '') . $negocio);
    $clave = $tel !== '' ? (wabot_renovacion_clave($tel, $motivo) ?? '') : '';
    $l = [
        'Cliente: ' . ($cliente !== '' ? $cliente : 'sin nombre en la ficha'),
        'WhatsApp: ' . ($clave !== '' ? '+' . $clave : ($tel !== '' ? $tel . ' (no parece un número de WhatsApp)' : 'sin teléfono cargado')),
    ];
    if ($nombreMp !== '' && mb_strtolower($nombreMp) !== mb_strtolower($persona)) $l[] = 'Titular en MP: ' . $nombreMp;
    if (empty($f['seguro'])) $l[] = '(vinculada solo por la fecha: confirmala en Mantenimiento → Vincular con MP)';
    return [$l, $clave];
}

/** El aviso de un cobro rechazado: [titulo, renglones, clave]. */
function wabot_cobro_rech_aviso_atrasado($f, array $cobro) {
    [$l, $clave] = wabot_cobro_rech_cliente($f, (string)$cobro['nombre_mp']);
    $plan = (string)($cobro['plan'] ?? '');
    $l[] = 'Monto: ' . wabot_moneda($cobro['monto']) . ($plan !== '' ? ' (' . $plan . ')' : '');
    $l[] = 'Primer intento rechazado: ' . wabot_cobro_rech_fecha_corta($cobro['primer_intento'])
         . ((int)$cobro['intento'] > 0 ? ' · reintento ' . (int)$cobro['intento'] . ' de 4' : '');
    $motivo = wabot_cobro_rech_motivo_texto($cobro['motivo'] ?? '');
    if ($motivo !== '') $l[] = 'Motivo: ' . $motivo;
    $l[] = 'MP lo reintenta unos 10 días; si no entra, cancela la suscripción.';
    $l[] = 'Suscripción MP: ' . $cobro['pre'];
    return ['⚠️ Cobro atrasado (suscripción de Mercado Pago)', $l, $clave];
}

/** El aviso de una suscripción cancelada o pausada: [titulo, renglones, clave]. */
function wabot_cobro_rech_aviso_cancelada($f, array $c) {
    [$l, $clave] = wabot_cobro_rech_cliente($f, (string)$c['nombre_mp']);
    if ($c['monto'] > 0) $l[] = 'Monto: ' . wabot_moneda($c['monto']) . ' por mes' . ($c['plan'] !== '' ? ' (' . $c['plan'] . ')' : '');
    if ($c['alta'] !== '') $l[] = 'Suscripta desde: ' . wabot_renovacion_fecha_texto($c['alta']);
    $l[] = ($c['estado'] === 'paused' ? 'Pausada' : 'Cancelada') . ' el ' . gmdate('d/m H:i', $c['ts'] - 3 * 3600);
    $l[] = 'Suscripción MP: ' . $c['pre'];
    return [($c['estado'] === 'paused' ? '⏸️ Suscripción pausada' : '❌ Suscripción cancelada') . ' (Mercado Pago)', $l, $clave];
}

/**
 * La corrida del cron. Desde el 16-nov NO le escribe al cliente: a Pablo, por
 * WhatsApp, cada cobro rechazado (una vez por cobro, el día que se detecta) y
 * cada suscripción que se cancela o se pausa (una vez, si pasó en los últimos
 * WABOT_COBRO_RECH_CANCELADA_DIAS días). Para los tests: $estado (sin disco),
 * $mp (la API) y $avisar(titulo, renglones, clave). $enviar ya no se usa.
 */
function wabot_cobro_rech_correr($cfg, $ahora = null, $estado = null, $mp = null, $enviar = null, $avisar = null) {
    $ahora = $ahora ?? time();
    $res = ['rechazados' => 0, 'enviados' => 0, 'fallidos' => 0, 'canceladas' => 0, 'detalle' => []];
    $hora = wabot_hora_local($ahora);
    if ($hora < WABOT_COBRO_RECH_HORA_DESDE || $hora >= WABOT_COBRO_RECH_HORA_HASTA) return $res;

    $enDisco = $estado === null;
    $estado = $estado ?? wabot_cobro_rech_estado();
    $estado += ['conocidos' => [], 'canceladas' => [], 'enviados' => [], 'aviso_vieja_ts' => 0, 'sync_ts' => 0, 'lista' => []];
    $mp = $mp ?? 'wabot_pagos_mp';
    $avisar = $avisar ?? 'wabot_aviso_cobro_pablo';

    if (!$estado['lista'] && !$estado['conocidos']) return $res + ['sin_lista' => true];
    if ($ahora - (int)$estado['sync_ts'] > WABOT_COBRO_RECH_LISTA_VIEJA && !$estado['aviso_vieja_ts']) {
        // Igual avisa con lo que sepa de MP, pero le pide una vez abrir el admin.
        $avisar('Lista de suscriptores vieja', ['La lista de suscriptores que el admin le pasa al bot tiene más de 35 días: algún aviso puede salir sin el cliente. Abrí el admin (Mantenimiento) para actualizarla.'], '');
        $estado['aviso_vieja_ts'] = $ahora;
        if ($enDisco) wabot_cobro_rech_guardar($estado);
    }

    $hoy = gmdate('Y-m-d', $ahora - 3 * 3600);
    $porPre = $estado['conocidos'];
    foreach ($estado['lista'] as $f) $porPre[$f['pre']] = $f;

    $canceladas = [];
    foreach (wabot_cobro_rech_detectar($mp, $canceladas) as $cobro) {
        $res['rechazados']++;
        // Uno por cobro: los reintentos de MP del mismo cobro no vuelven a avisar.
        if (isset($estado['enviados'][$cobro['cobro']])) continue;
        $f = $porPre[$cobro['pre']] ?? null;
        [$titulo, $lineas, $clave] = wabot_cobro_rech_aviso_atrasado($f, $cobro);
        if (!$avisar($titulo, $lineas, $clave)) { $res['fallidos']++; continue; }   // la próxima pasada lo reintenta
        $estado['enviados'][$cobro['cobro']] = ['ts' => $ahora, 'id' => $f['id'] ?? '', 'pre' => $cobro['pre'],
            'dia' => $hoy, 'resultado' => 'pablo', 'ok' => true];
        if ($enDisco) wabot_cobro_rech_guardar($estado);
        $res['enviados']++;
        $res['detalle'][] = ['cobro' => $cobro['cobro'], 'id' => $f['id'] ?? '', 'resultado' => 'pablo'];
        wabot_log('cobro_rechazado_aviso', ['cobro' => $cobro['cobro'], 'pre' => $cobro['pre'], 'id' => $f['id'] ?? '',
            'tel' => $f['tel'] ?? '', 'resultado' => 'pablo', 'motivo' => $cobro['motivo']]);
    }

    foreach ($canceladas as $c) {
        if ($c['pre'] === '' || $c['ts'] <= 0) continue;
        if ($ahora - $c['ts'] > WABOT_COBRO_RECH_CANCELADA_DIAS * 86400) continue;
        $marca = $c['pre'] . ':' . $c['estado'];
        if (isset($estado['canceladas'][$marca])) continue;
        $f = $porPre[$c['pre']] ?? null;
        [$titulo, $lineas, $clave] = wabot_cobro_rech_aviso_cancelada($f, $c);
        if (!$avisar($titulo, $lineas, $clave)) { $res['fallidos']++; continue; }
        $estado['canceladas'][$marca] = $ahora;
        if ($enDisco) wabot_cobro_rech_guardar($estado);
        $res['canceladas']++;
        $res['detalle'][] = ['pre' => $c['pre'], 'id' => $f['id'] ?? '', 'resultado' => $c['estado']];
        wabot_log('suscripcion_cancelada_aviso', ['pre' => $c['pre'], 'estado' => $c['estado'], 'id' => $f['id'] ?? '']);
    }
    // Las marcas de canceladas de hace más de 2 meses ya no frenan nada.
    $estado['canceladas'] = array_filter($estado['canceladas'], function ($ts) use ($ahora) { return (int)$ts >= $ahora - 62 * 86400; });
    if ($enDisco) wabot_cobro_rech_guardar($estado);
    return $res + ($enDisco ? [] : ['estado' => $estado]);
}
