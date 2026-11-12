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

function wabot_cobro_rech_estado() {
    $j = json_decode((string)@file_get_contents(WABOT_COBRO_RECH_ARCHIVO), true);
    if (!is_array($j)) $j = [];
    return [
        'lista'    => array_values(array_filter((array)($j['lista'] ?? []), 'is_array')),
        'sync_ts'  => (int)($j['sync_ts'] ?? 0),
        'enviados' => (array)($j['enviados'] ?? []),
        'aviso_vieja_ts' => (int)($j['aviso_vieja_ts'] ?? 0),
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
function wabot_cobro_rech_detectar(callable $mp) {
    $yo = wabot_pagos_mp_yo($mp);
    $atrasadas = [];
    for ($offset = 0; $offset < 1000; $offset += 100) {
        $pagina = $mp('/preapproval/search?limit=100&offset=' . $offset);
        foreach ((array)($pagina['results'] ?? []) as $s) {
            if ((string)($s['collector_id'] ?? '') !== $yo) continue;
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
                'monto' => (float)($c['transaction_amount'] ?? $s['auto_recurring']['transaction_amount'] ?? 0),
                'primer_intento' => $dia,
                'intento' => (int)($c['retry_attempt'] ?? 0),
                'motivo' => (string)($c['rejection_code'] ?? $c['payment']['status_detail'] ?? ''),
            ];
        }
    }
    return $rechazados;
}

/**
 * Manda la plantilla a una fila. $enviar(clave, fila, valores) reemplaza la red en
 * los tests. Devuelve 'ok', 'ya', 'sin_chat', 'telefono', 'ambiguo', 'ocupado' o 'error'.
 */
function wabot_cobro_rech_enviar_fila(array $f, array $cobro, $cfg, $enviar = null) {
    $negocio = $f['negocio'] !== '' ? $f['negocio'] : $f['persona'];
    $nombre = wabot_renovacion_nombre($f['persona'], $f['negocio']) ?: ($negocio !== '' ? $negocio : 'cómo estás');
    $valores = ['nombre' => $nombre, 'negocio' => $negocio, 'monto' => wabot_moneda($cobro['monto'])];

    if ($f['tel'] === '') return 'sin_chat';
    $clave = wabot_renovacion_clave($f['tel'], $motivo);
    if ($clave === null) return $motivo === 'ambiguo' ? 'ambiguo' : 'telefono';
    if ($enviar) return $enviar($clave, $f, $valores) ? 'ok' : 'error';

    $lock = wabot_lock_tomar($clave);
    if (!$lock) return 'ocupado';
    try {
        $conv = wabot_conv_load($clave);
        // Segundo candado: si el registro se perdiera, el chat sabe que ya le avisamos de este cobro.
        if ((string)($conv['cobro_rechazado_id'] ?? '') === $cobro['cobro']) return 'ya';
        if (trim((string)($conv['nombre_negocio'] ?? '')) === '' && $f['negocio'] !== '') $conv['nombre_negocio'] = $f['negocio'];
        if (!wabot_enviar_plantilla($conv, 'cobro_rechazado', $cfg, $valores)) return 'error';
        $conv['cobro_rechazado_id'] = $cobro['cobro'];
        $conv['cobro_rechazado_ts'] = time();
        wabot_conv_save($conv);
        return 'ok';
    } finally {
        wabot_lock_soltar($lock);
    }
}

/**
 * La corrida del cron. Para los tests: $estado (sin disco), $mp (la API), $enviar
 * y $avisar (push a Pablo). Devuelve qué hizo.
 */
function wabot_cobro_rech_correr($cfg, $ahora = null, $estado = null, $mp = null, $enviar = null, $avisar = null) {
    $ahora = $ahora ?? time();
    $res = ['rechazados' => 0, 'enviados' => 0, 'fallidos' => 0, 'detalle' => []];
    $p = wabot_plantilla_config('cobro_rechazado', $cfg);
    if ($p === null) return $res + ['apagado' => true];
    if (array_key_exists('automatico', $p) && empty($p['automatico'])) return $res + ['apagado' => true];
    $hora = wabot_hora_local($ahora);
    if ($hora < WABOT_COBRO_RECH_HORA_DESDE || $hora >= WABOT_COBRO_RECH_HORA_HASTA) return $res;

    $enDisco = $estado === null;
    $estado = $estado ?? wabot_cobro_rech_estado();
    $mp = $mp ?? 'wabot_pagos_mp';
    $avisar = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };

    if (!$estado['lista']) return $res + ['sin_lista' => true];
    if ($ahora - (int)$estado['sync_ts'] > WABOT_COBRO_RECH_LISTA_VIEJA) {
        if (!$estado['aviso_vieja_ts']) {
            $avisar('Avisos de cobro rechazado frenados', 'La lista de suscriptores que el admin le pasa al bot tiene más de 35 días. Abrí el admin para actualizarla.');
            $estado['aviso_vieja_ts'] = $ahora;
            if ($enDisco) wabot_cobro_rech_guardar($estado);
        }
        return $res + ['lista_vieja' => true] + ($enDisco ? [] : ['estado' => $estado]);
    }

    $hoy = gmdate('Y-m-d', $ahora - 3 * 3600);
    $ayer = gmdate('Y-m-d', $ahora - 3 * 3600 - 86400);
    $porPre = [];
    foreach ($estado['lista'] as $f) $porPre[$f['pre']] = $f;

    foreach (wabot_cobro_rech_detectar($mp) as $cobro) {
        $res['rechazados']++;
        // Solo el día siguiente al primer intento rechazado: ni antes, ni con cada reintento.
        if ($cobro['primer_intento'] !== $ayer) continue;
        if (isset($estado['enviados'][$cobro['cobro']])) continue;

        $f = $porPre[$cobro['pre']] ?? null;
        $quien = $f ? ($f['negocio'] !== '' ? $f['negocio'] : ($f['persona'] !== '' ? $f['persona'] : $f['tel']))
                    : ($cobro['nombre_mp'] !== '' ? $cobro['nombre_mp'] : 'una suscripción');
        $monto = wabot_moneda($cobro['monto']);
        if (!$f) {
            $r = 'sin_cliente';
        } elseif (!$f['seguro']) {
            $r = 'sin_confirmar';
        } else {
            $r = wabot_cobro_rech_enviar_fila($f, $cobro, $cfg, $enviar);
            if ($r === 'ocupado') continue;   // otro proceso tiene el chat: la próxima pasada
        }
        $estado['enviados'][$cobro['cobro']] = ['ts' => $ahora, 'id' => $f['id'] ?? '', 'pre' => $cobro['pre'],
            'dia' => $hoy, 'resultado' => $r, 'ok' => in_array($r, ['ok', 'ya'], true)];
        // Guardado enseguida: si la corrida se corta, la siguiente no le manda otro.
        if ($enDisco) wabot_cobro_rech_guardar($estado);

        if ($r === 'ok') {
            $res['enviados']++;   // salió bien: no se avisa (Pablo, 2-nov: solo lo que pide algo de él)
        } elseif ($r !== 'ya') {
            $res['fallidos']++;
            $motivos = [
                'sin_cliente' => 'no sé de qué cliente es esa suscripción (vinculala en Mantenimiento → Vincular con MP)',
                'sin_confirmar' => 'la suscripción está vinculada solo por la fecha (confirmala en Mantenimiento → Vincular con MP)',
                'sin_chat' => 'no tiene teléfono cargado',
                'telefono' => 'el teléfono no parece de WhatsApp',
                'ambiguo' => 'hay dos chats con ese número',
                'error' => 'WhatsApp no lo aceptó',
            ];
            $avisar('Cobro rechazado sin avisar', 'Mercado Pago no pudo cobrarle ' . $monto . ' a ' . $quien . ' y no le pude mandar el aviso: '
                . ($motivos[$r] ?? $r) . '. Escribile a mano.');
        }
        $res['detalle'][] = ['cobro' => $cobro['cobro'], 'id' => $f['id'] ?? '', 'resultado' => $r];
        wabot_log('cobro_rechazado_aviso', ['cobro' => $cobro['cobro'], 'pre' => $cobro['pre'], 'id' => $f['id'] ?? '',
            'tel' => $f['tel'] ?? '', 'resultado' => $r, 'motivo' => $cobro['motivo']]);
    }
    return $res + ($enDisco ? [] : ['estado' => $estado]);
}
