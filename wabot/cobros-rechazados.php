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
 * 16-nov (Pablo): el aviso, con los datos del cliente, le llega a Pablo por
 * WhatsApp (wabot_aviso_cobro_pablo), y también cuando una suscripción se
 * cancela o se pausa.
 *
 * 23-nov (Pablo: «quiero que el wabot vuelva a mandar plantilla de pagos»):
 * además, al cliente (solo renovaciones, no el primer pago de la suscripción):
 *   - cobro_rechazado:        el primer intento rechazado (si se detecta a 2 días o menos)
 *   - cobro_rechazado_ultimo: el último intento de MP (el 4.º)
 *   - suscripcion_cancelada:  se dio de baja: ¿seguir por otro medio o dar de baja?, activo hasta X
 *   - pago_recibido:          MP cobró la renovación
 * Solo a los vinculados seguro (por ID o por nombre) y que no pagan por afuera.
 * Registro en `clientes` del estado: {marca: {ts, res}}.
 *
 * 23-nov, vínculos cruzados (tres clientes del mismo monto tenían la suscripción
 * de otro): antes de escribirle al cliente se mira la auditoría contra las
 * charlas (auditar-vinculos.php). Si dice que esa suscripción es de otro, al
 * cliente no le sale nada (res 'cruzado', que no es final: corregido el vínculo
 * en el admin, sale), el aviso a Pablo lo dice y los plazos de 48 h no corren.
 * La auditoría se guarda en `cruzados` {firma, ts, mapa} y se rehace si cambia
 * la lista o pasan WABOT_COBRO_RECH_CRUZADOS_HORAS.
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
// Cada cuánto se rehace la auditoría de vínculos cruzados aunque la lista no haya cambiado.
const WABOT_COBRO_RECH_CRUZADOS_HORAS = 6;

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
        'clientes' => (array)($j['clientes'] ?? []),
        // La última auditoría de vínculos cruzados (23-nov): {firma, ts, mapa}.
        'cruzados' => (array)($j['cruzados'] ?? []),
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
function wabot_cobro_rech_detectar(callable $mp, &$canceladas = null, &$altas = null, &$estadosSub = null) {
    $yo = wabot_pagos_mp_yo($mp);
    $atrasadas = [];
    $canceladas = [];
    $altas = [];
    $estadosSub = [];
    for ($offset = 0; $offset < 1000; $offset += 100) {
        $pagina = $mp('/preapproval/search?limit=100&offset=' . $offset);
        foreach ((array)($pagina['results'] ?? []) as $s) {
            if ((string)($s['collector_id'] ?? '') !== $yo) continue;
            $altas[(string)($s['id'] ?? '')] = wabot_cobro_rech_dia_local($s['date_created'] ?? '');
            $estadosSub[(string)($s['id'] ?? '')] = (string)($s['status'] ?? '');
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
        // Renovación = la suscripción ya tuvo un cobro aprobado antes (23-nov): el primer pago que rebota no es una renovación.
        $cobrados = array_filter((array)($cobros['results'] ?? []), function ($c) {
            return (string)($c['status'] ?? '') === 'processed' && (string)($c['payment']['status'] ?? '') === 'approved';
        });
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
                'renovacion' => (bool)$cobrados,
                // El último reintento de MP (23-nov): con el 4.º, el «último intento» al cliente.
                'ultimo_dia' => wabot_cobro_rech_dia_local($c['last_retry_date'] ?? $c['last_modified'] ?? ''),
            ];
        }
    }
    return $rechazados;
}

/** Hasta cuándo está pago (Y-m-d): el último cobro aprobado de la suscripción + 1 mes; '' si nunca cobró. */
function wabot_cobro_rech_pagado_hasta(callable $mp, $pre) {
    $cobros = $mp('/authorized_payments/search?preapproval_id=' . rawurlencode((string)$pre) . '&limit=12');
    $ultimo = '';
    foreach ((array)($cobros['results'] ?? []) as $c) {
        if ((string)($c['status'] ?? '') !== 'processed' || (string)($c['payment']['status'] ?? '') !== 'approved') continue;
        $dia = wabot_cobro_rech_dia_local($c['debit_date'] ?? $c['date_created'] ?? '');
        if ($dia > $ultimo) $ultimo = $dia;
    }
    return $ultimo === '' ? '' : wabot_renovacion_mas_un_mes($ultimo);
}

/**
 * Los cobros de suscripción aprobados en las últimas $horas (23-nov, para el
 * «recibimos tu pago»): [{pago, pre, monto, dia, ts}].
 */
function wabot_cobro_rech_pagos_aprobados(callable $mp, $ahora, $horas = 30) {
    $desde = gmdate('Y-m-d\TH:i:s.000\Z', (int)$ahora - $horas * 3600);
    $r = $mp('/v1/payments/search?sort=date_approved&criteria=desc&limit=100&status=approved&operation_type=recurring_payment'
        . '&range=date_approved&begin_date=' . rawurlencode($desde) . '&end_date=NOW');
    $out = [];
    foreach ((array)($r['results'] ?? []) as $p) {
        if ((string)($p['status'] ?? '') !== 'approved') continue;
        $pre = (string)($p['metadata']['preapproval_id'] ?? $p['point_of_interaction']['transaction_data']['subscription_id'] ?? '');
        $ts = (int)strtotime((string)($p['date_approved'] ?? $p['date_created'] ?? ''));
        if ($pre === '' || empty($p['id']) || $ts < (int)$ahora - $horas * 3600) continue;
        $out[] = ['pago' => (string)$p['id'], 'pre' => $pre, 'monto' => (float)($p['transaction_amount'] ?? 0),
                  'dia' => wabot_cobro_rech_dia_local($p['date_approved'] ?? $p['date_created'] ?? ''), 'ts' => $ts];
    }
    return $out;
}

/** ¿Se le mandó el «último intento» de esa suscripción en los últimos 15 días? Entonces la baja es de MP, no del cliente. */
function wabot_cobro_rech_ultimo_reciente(array $estado, $pre, $ahora) {
    foreach ((array)($estado['clientes'] ?? []) as $marca => $e) {
        if (strpos((string)$marca, 'ultimo:') !== 0 || !is_array($e) || ($e['pre'] ?? '') !== $pre) continue;
        if ((int)($e['ts'] ?? 0) >= (int)$ahora - 15 * 86400) return true;
    }
    return false;
}

/** Los ids ("coleccion:docId") de los que pagan por afuera, de la lista de renovaciones: a esos no se les manda nada de MP. */
function wabot_cobro_rech_ids_por_fuera() {
    if (isset($GLOBALS['WABOT_TEST_POR_FUERA'])) return (array)$GLOBALS['WABOT_TEST_POR_FUERA'];
    $ids = [];
    foreach ((array)(wabot_renovacion_estado()['lista'] ?? []) as $f) $ids[(string)($f['id'] ?? '')] = true;
    return $ids;
}

/**
 * Los vínculos que la auditoría contra las charlas da por cruzados (23-nov,
 * auditar-vinculos.php): ["id|pre" => ['quien' => de quién dice la charla que
 * es la suscripción]]. Audita todo lo que el admin mandó alguna vez (la lista
 * y los `conocidos`). Tarda ~1,5 s y pide las suscripciones a MP, así que se
 * hace solo cuando hace falta (hay algo para escribirle a un cliente o un
 * aviso nuevo para Pablo) y queda en $estado['cruzados'] hasta que cambie la
 * lista o pasen WABOT_COBRO_RECH_CRUZADOS_HORAS. Si la auditoría falla, vale
 * lo último que se supo. Los tests la reemplazan con WABOT_TEST_VINCULOS_CRUZADOS.
 */
function wabot_cobro_rech_cruzados(array &$estado, $mp, $ahora) {
    if (isset($GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'])) return (array)$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'];
    // En las suites (sin red ni disco) la auditoría corre solo si la prueba le pasa las charlas (WABOT_TEST_AUDVINC).
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED']) && !isset($GLOBALS['WABOT_TEST_AUDVINC'])) return [];
    static $fallo = false;
    $porPre = array_filter((array)($estado['conocidos'] ?? []), 'is_array');
    foreach ((array)($estado['lista'] ?? []) as $f) {
        if (is_array($f)) $porPre[(string)($f['pre'] ?? '')] = $f;
    }
    $filas = array_values($porPre);
    if (!$filas) return [];
    $pares = array_map(function ($f) { return ($f['id'] ?? '') . '|' . ($f['pre'] ?? ''); }, $filas);
    sort($pares);
    $firma = md5(implode("\n", $pares));
    $c = (array)($estado['cruzados'] ?? []);
    $mapa = (array)($c['mapa'] ?? []);
    $ts = (int)($c['ts'] ?? 0);
    if (($c['firma'] ?? '') === $firma && $ts <= (int)$ahora && $ts > (int)$ahora - WABOT_COBRO_RECH_CRUZADOS_HORAS * 3600) return $mapa;
    if ($fallo) return $mapa;
    try {
        require_once __DIR__ . '/auditar-vinculos.php';
        $r = wabot_audvinc_auditar((array)($GLOBALS['WABOT_TEST_AUDVINC'] ?? []) + ['mp' => $mp ?? 'wabot_pagos_mp', 'lista' => $filas, 'ahora' => (int)$ahora]);
    } catch (\Throwable $e) {
        $fallo = true;   // en esta pasada no se vuelve a intentar
        wabot_log('error', ['donde' => 'vinculos_cruzados', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        return $mapa;
    }
    $mapa = [];
    foreach ($r['vinculos'] as $v) {
        if ($v['estado'] === 'mal') $mapa[$v['id'] . '|' . $v['pre']] = ['quien' => wabot_audvinc_quien($v['sugerido'])];
    }
    if ($mapa !== (array)($c['mapa'] ?? [])) wabot_log('vinculos_cruzados', ['cruzados' => array_keys($mapa)]);
    $estado['cruzados'] = ['firma' => $firma, 'ts' => (int)$ahora, 'mapa' => $mapa];
    return $mapa;
}

/** ¿El vínculo de esta fila (su `id` con su `pre`) está cruzado? ['quien' => …] o null. */
function wabot_cobro_rech_cruzado(array &$estado, $f, $mp, $ahora) {
    if (!is_array($f) || (string)($f['id'] ?? '') === '' || (string)($f['pre'] ?? '') === '') return null;
    $x = wabot_cobro_rech_cruzados($estado, $mp, $ahora)[$f['id'] . '|' . $f['pre']] ?? null;
    if (!$x) return null;
    return ['quien' => trim((string)(is_array($x) ? ($x['quien'] ?? '') : ''))];
}

/** Los renglones que avisan el cruce en el mensaje a Pablo ([] si el vínculo está bien). */
function wabot_cobro_rech_cruzado_lineas(array &$estado, $f, $mp, $ahora) {
    $x = wabot_cobro_rech_cruzado($estado, $f, $mp, $ahora);
    if (!$x) return [];
    return ['⚠ OJO, vínculo cruzado: según la charla, esta suscripción es de ' . ($x['quien'] !== '' ? $x['quien'] : 'otro cliente') . ', no de este cliente.',
            'Al cliente no se le escribe. Corregilo en Mantenimiento → Vincular con MP.'];
}

/**
 * Una plantilla al cliente de una suscripción (23-nov), una sola vez por $marca.
 * Devuelve el resultado o null si no corresponde (sin cliente seguro, paga por afuera, ya enviada).
 * 'cruzado' = no salió porque la charla dice que la suscripción es de otro (se reintenta: no es final).
 */
function wabot_cobro_rech_cliente_enviar(array &$estado, $f, $plantilla, array $valores, $marca, $cfg, $enviar, $ahora, array $porFuera, array $extra = [], $mp = null) {
    if (!is_array($f) || empty($f['seguro']) || isset($porFuera[(string)($f['id'] ?? '')])) return null;
    $prev = $estado['clientes'][$marca] ?? null;
    if (is_array($prev) && wabot_pagos_resultado_final((string)($prev['res'] ?? ''))) return null;
    if (wabot_cobro_rech_cruzado($estado, $f, $mp, $ahora)) {
        if (!is_array($prev) || ($prev['res'] ?? '') !== 'cruzado') {
            wabot_log('pago_plantilla_cliente', ['plantilla' => $plantilla, 'marca' => $marca, 'id' => $f['id'] ?? '', 'tel' => $f['tel'] ?? '', 'resultado' => 'cruzado']);
        }
        $estado['clientes'][$marca] = ['ts' => $ahora, 'res' => 'cruzado', 'pre' => (string)($f['pre'] ?? '')] + $extra;
        return 'cruzado';
    }
    $r = wabot_pagos_plantilla_cliente($f, $plantilla, wabot_pagos_nombre_negocio($f) + $valores, $cfg, $marca, $enviar);
    $estado['clientes'][$marca] = ['ts' => $ahora, 'res' => $r, 'pre' => (string)($f['pre'] ?? '')] + $extra;
    wabot_log('pago_plantilla_cliente', ['plantilla' => $plantilla, 'marca' => $marca, 'id' => $f['id'] ?? '', 'tel' => $f['tel'] ?? '', 'resultado' => $r]);
    return $r;
}

/** El último cobro marcado «Pagó» de ese cliente si ahora paga por afuera ('' si no). */
function wabot_cobro_rech_pf_pagado($id) {
    if (isset($GLOBALS['WABOT_TEST_PF_PAGADO'])) return (string)($GLOBALS['WABOT_TEST_PF_PAGADO'][$id] ?? '');
    foreach ((array)(wabot_renovacion_estado()['lista'] ?? []) as $f) {
        if ((string)($f['id'] ?? '') === (string)$id) return (string)($f['pagado'] ?? '');
    }
    return '';
}

/**
 * ¿Pagó desde $desde (Y-m-d)? MP cobró esa suscripción, se volvió a suscribir (otra suscripción
 * activa del mismo cliente en la lista del admin) o pasó a pagar por afuera y Pablo le marcó el pago.
 */
function wabot_cobro_rech_pago_desde(array $estado, array $e, $desde, array $estadosSub, callable $mp) {
    $id = (string)($e['id'] ?? '');
    if ($id !== '' && wabot_cobro_rech_pf_pagado($id) >= $desde && wabot_cobro_rech_pf_pagado($id) !== '') return true;
    foreach ((array)$estado['lista'] as $f) {
        if ($id !== '' && (string)$f['id'] === $id && (string)$f['pre'] !== (string)($e['pre'] ?? '') && ($estadosSub[$f['pre']] ?? '') === 'authorized') return true;
    }
    $pre = (string)($e['pre'] ?? '');
    if ($pre === '' || ($estadosSub[$pre] ?? '') !== 'authorized') return false;
    $cobros = $mp('/authorized_payments/search?preapproval_id=' . rawurlencode($pre) . '&limit=12');
    foreach ((array)($cobros['results'] ?? []) as $c) {
        if ((string)($c['status'] ?? '') === 'processed' && (string)($c['payment']['status'] ?? '') === 'approved'
            && wabot_cobro_rech_dia_local($c['debit_date'] ?? '') >= $desde) return true;
    }
    return false;
}

/**
 * Los plazos de 48 h de las suscripciones (Pablo, 23-nov): «si vencen todos los intentos, dar
 * opción de pagar con transferencia; si en 48 hs no paga, se da de baja el servicio. Si canceló,
 * y llegó la fecha de renovación, y todavía no paga, se da aviso de 48 hs».
 *  - ultimo:{cobro}: el aviso del último intento ya ofrece la transferencia y las 48 h; a las 48 h sin pago, vencido.
 *  - baja:{pre}: el día que se termina lo pago (`hasta`) sin pago, el aviso de 48 h; a las 48 h, vencido.
 * Vencido = «dar de baja» a Pablo + pagos-vencidos.json (el aviso de baja al cliente sale al anotarla en Bajas).
 */
function wabot_cobro_rech_plazos(array &$estado, array $porPre, array $estadosSub, $cfg, callable $mp, $enviar, callable $avisar, $ahora, $hoy, array $porFuera, array &$res) {
    foreach ((array)$estado['clientes'] as $marca => $e) {
        if (!is_array($e) || ($e['res'] ?? '') !== 'ok' || !empty($e['vencido_ts']) || !empty($e['cerrado'])) continue;
        $tipo = strtok((string)$marca, ':');
        if ($tipo !== 'ultimo' && $tipo !== 'baja') continue;
        $pre = (string)($e['pre'] ?? '');
        $f = $porPre[$pre] ?? ($estado['conocidos'][$pre] ?? null);
        if (!is_array($f)) continue;
        $f = $f + ['id' => (string)($e['id'] ?? '')];
        $monto = (float)($e['monto'] ?? 0);
        /* Vínculo cruzado (23-nov): la plantilla le había salido al cliente de otra suscripción.
         * El plazo no corre (ni el aviso de 48 h ni «dar de baja»); a Pablo se le dice una vez. */
        if (wabot_cobro_rech_cruzado($estado, $f, $mp, $ahora)) {
            if (empty($e['cruzado_ts'])) {
                [$l, $c] = wabot_cobro_rech_cliente($f, '');
                $l = array_merge($l, wabot_cobro_rech_cruzado_lineas($estado, $f, $mp, $ahora),
                    ['Ya le había salido una plantilla de pago por esta suscripción. El plazo de 48 h quedó frenado.', 'Suscripción MP: ' . $pre]);
                if (!$avisar('⚠️ Vínculo cruzado: plazo de pago frenado', $l, $c)) continue;
                $estado['clientes'][$marca]['cruzado_ts'] = $ahora;
                wabot_log('plazo_frenado_cruzado', ['marca' => $marca, 'id' => $f['id'], 'pre' => $pre]);
            }
            continue;
        }

        if ($tipo === 'ultimo') {
            if ($ahora < (int)$e['ts'] + 48 * 3600) continue;
            $desde = (string)($e['desde'] ?? '');
            $motivo = 'Mercado Pago no pudo cobrar la cuota' . ($desde !== '' ? ' del ' . wabot_renovacion_fecha_texto($desde) : '') . ' y no pagó por transferencia';
        } else {
            $desde = (string)($e['hasta'] ?? '');
            if ($desde === '' || $hoy < $desde) continue;
            $motivo = 'canceló la suscripción y no pagó la renovación del ' . wabot_renovacion_fecha_texto($desde);
        }
        if (wabot_cobro_rech_pago_desde($estado, $e, $desde, $estadosSub, $mp)) {
            $estado['clientes'][$marca]['cerrado'] = $ahora;
            $res['clientes'][] = ['marca' => $marca, 'pago' => true];
            continue;
        }

        if ($tipo === 'baja' && empty($e['a48_ts'])) {
            // Ahora paga por afuera: el plazo lo lleva la lista de renovaciones.
            if (isset($porFuera[(string)$f['id']])) { $estado['clientes'][$marca]['cerrado'] = $ahora; continue; }
            $r = wabot_pagos_plantilla_cliente($f, 'aviso_pago_48h', wabot_pagos_nombre_negocio($f) + ['monto' => wabot_moneda($monto)],
                $cfg, 'a48:' . $pre, $enviar);
            if (!wabot_pagos_resultado_final($r)) continue;
            $estado['clientes'][$marca]['a48_ts'] = $ahora;
            $estado['clientes'][$marca]['a48_res'] = $r;
            [$t, $l, $c] = wabot_pagos_aviso_48h($f, $motivo, $r);
            $avisar($t, $l, $c);
            $res['clientes'][] = ['marca' => $marca, 'aviso_48h' => $r];
            wabot_log('aviso_48h_cliente', ['id' => $f['id'], 'pre' => $pre, 'resultado' => $r, 'via' => 'baja_suscripcion']);
            continue;
        }
        if ($tipo === 'baja' && (($e['a48_res'] ?? '') !== 'ok' || $ahora < (int)$e['a48_ts'] + 48 * 3600)) continue;

        [$t, $l, $c] = wabot_pagos_aviso_vencido($f, $motivo);
        if (!$avisar($t, $l, $c)) continue;
        wabot_pagos_vencido_anotar($f, $motivo, $ahora);
        $estado['clientes'][$marca]['vencido_ts'] = $ahora;
        $res['clientes'][] = ['marca' => $marca, 'vencido' => true];
        wabot_log('pago_vencido', ['id' => $f['id'], 'pre' => $pre, 'via' => $tipo]);
    }
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
    $nombreMp = trim(preg_replace('/\s+/u', ' ', (string)$nombreMp));
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
    if (($f['via'] ?? '') === 'nombre') $l[] = '(encontrado por el nombre que figura en MP: confirmalo)';
    elseif (empty($f['seguro'])) $l[] = '(vinculada solo por la fecha: confirmala en Mantenimiento → Vincular con MP)';
    return [$l, $clave];
}

/** "Plan mensual web" queda; lo que MP pone como nombre cuando no hay ("30000") no. */
function wabot_cobro_rech_plan_texto($plan) {
    $plan = trim((string)$plan);
    return preg_match('/^[\d.,\s$]*$/', $plan) ? '' : $plan;
}

function wabot_cobro_rech_normal($s) {
    $s = mb_strtolower(trim(preg_replace('/\s+/u', ' ', (string)$s)), 'UTF-8');
    return strtr($s, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n']);
}

/**
 * Si la suscripción no está en la lista del admin (al cancelarse sale de ahí):
 * el id de cliente que quedó anotado en un aviso anterior de esa suscripción, con
 * los datos de la lista de webs en mantenimiento o la de pagan por afuera; si no,
 * el nombre del titular de MP igual al de una ficha. null si no aparece.
 * $listas solo la pasan los tests.
 */
function wabot_cobro_rech_fila_respaldo($pre, $nombreMp, array $estado, $listas = null) {
    if ($listas === null) {
        $listas = [];
        foreach ([WABOT_DATA . '/webs.json', WABOT_DATA . '/renovaciones.json'] as $arch) {
            $j = json_decode((string)@file_get_contents($arch), true);
            foreach ((array)($j['lista'] ?? []) as $f) if (is_array($f) && !empty($f['id'])) $listas[] = $f;
        }
        // La caché de clientes del bot (clientes.php): trae también a los que el admin ya sacó de esas listas.
        $j = json_decode((string)@file_get_contents(WABOT_DATA . '/clientes-cache.json'), true);
        foreach (['mantenimiento', 'nuevos'] as $grupo) {
            foreach ((array)($j[$grupo] ?? []) as $x) {
                if (!is_array($x) || empty($x['id'])) continue;
                $listas[] = ['id' => ($x['origen'] ?? 'clientes') . ':' . $x['id'], 'tel' => (string)($x['clave'] ?? '') ?: (string)($x['telefono'] ?? ''),
                             'persona' => (string)($x['nombre'] ?? ''), 'negocio' => (string)($x['negocio'] ?? '')];
            }
        }
    }
    $arma = function ($f, $via) use ($pre) {
        return ['id' => (string)$f['id'], 'pre' => $pre, 'tel' => preg_replace('/\D+/', '', (string)($f['tel'] ?? '')),
                'persona' => (string)($f['persona'] ?? ''), 'negocio' => (string)($f['negocio'] ?? ''), 'seguro' => $via === 'id', 'via' => $via];
    };
    $id = '';
    foreach ((array)$estado['enviados'] as $e) {
        if (is_array($e) && ($e['pre'] ?? '') === $pre && !empty($e['id'])) { $id = (string)$e['id']; break; }
    }
    if ($id !== '') {
        foreach ($listas as $f) if ((string)$f['id'] === $id) return $arma($f, 'id');
    }
    $nombre = wabot_cobro_rech_normal($nombreMp);
    if ($nombre === '') return null;
    $hallados = [];
    foreach ($listas as $f) {
        if (wabot_cobro_rech_normal($f['persona'] ?? '') !== $nombre) continue;
        // El mismo cliente puede estar en dos listas con ids distintos: se junta por teléfono.
        $tel = substr(preg_replace('/\D+/', '', (string)($f['tel'] ?? '')), -8);
        $hallados[$tel !== '' ? $tel : (string)$f['id']] = $f;
    }
    return count($hallados) === 1 ? $arma(reset($hallados), 'nombre') : null;
}

/** El aviso de un cobro rechazado: [titulo, renglones, clave]. */
function wabot_cobro_rech_aviso_atrasado($f, array $cobro) {
    [$l, $clave] = wabot_cobro_rech_cliente($f, (string)$cobro['nombre_mp']);
    $plan = wabot_cobro_rech_plan_texto($cobro['plan'] ?? '');
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
    $plan = wabot_cobro_rech_plan_texto($c['plan'] ?? '');
    if ($c['monto'] > 0) $l[] = 'Monto: ' . wabot_moneda($c['monto']) . ' por mes' . ($plan !== '' ? ' (' . $plan . ')' : '');
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
    $estado += ['conocidos' => [], 'canceladas' => [], 'enviados' => [], 'aviso_vieja_ts' => 0, 'sync_ts' => 0, 'lista' => [], 'clientes' => []];
    $res += ['clientes' => []];
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
    $altas = [];
    $porFuera = wabot_cobro_rech_ids_por_fuera();
    $dias = function ($desde, $hasta) { return ($desde === '' || $hasta === '') ? 999 : (int)round((strtotime($hasta . ' 12:00 UTC') - strtotime($desde . ' 12:00 UTC')) / 86400); };
    $ultimosAvisados = [];
    $estadosSub = [];
    foreach (wabot_cobro_rech_detectar($mp, $canceladas, $altas, $estadosSub) as $cobro) {
        $res['rechazados']++;
        $f = $porPre[$cobro['pre']] ?? wabot_cobro_rech_fila_respaldo($cobro['pre'], $cobro['nombre_mp'], $estado, $GLOBALS['WABOT_TEST_COBRO_LISTAS'] ?? null);

        // Al cliente (23-nov), solo en las renovaciones: el primer intento y el último.
        $clienteRes = null;
        if (!empty($cobro['renovacion'])) {
            $valores = ['monto' => wabot_moneda($cobro['monto'])];
            if ((int)$cobro['intento'] >= 4) {
                if ($dias($cobro['ultimo_dia'] ?? '', $hoy) <= 2) {
                    $clienteRes = wabot_cobro_rech_cliente_enviar($estado, $f, 'cobro_rechazado_ultimo', $valores, 'ultimo:' . $cobro['cobro'], $cfg, $enviar, $ahora, $porFuera,
                        ['id' => (string)($f['id'] ?? ''), 'desde' => $cobro['primer_intento'], 'monto' => (float)$cobro['monto']], $mp);
                }
                $ultimosAvisados[$cobro['pre']] = true;
            } elseif ($dias($cobro['primer_intento'], $hoy) <= 2) {
                $clienteRes = wabot_cobro_rech_cliente_enviar($estado, $f, 'cobro_rechazado', $valores, 'primero:' . $cobro['cobro'], $cfg, $enviar, $ahora, $porFuera, [], $mp);
            }
            if ($clienteRes !== null) {
                $res['clientes'][] = ['cobro' => $cobro['cobro'], 'intento' => (int)$cobro['intento'], 'resultado' => $clienteRes];
                if ($enDisco) wabot_cobro_rech_guardar($estado);
            }
        }

        // Uno por cobro: los reintentos de MP del mismo cobro no vuelven a avisar a Pablo.
        if (isset($estado['enviados'][$cobro['cobro']])) continue;
        [$titulo, $lineas, $clave] = wabot_cobro_rech_aviso_atrasado($f, $cobro);
        // Si la charla dice que la suscripción es de otro, el aviso lo dice: el cliente de arriba puede no ser.
        $lineas = array_merge($lineas, wabot_cobro_rech_cruzado_lineas($estado, $f, $mp, $ahora));
        if ($clienteRes !== null && $clienteRes !== 'cruzado') $lineas[] = wabot_pagos_resultado_texto($clienteRes);
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
        $f = $porPre[$c['pre']] ?? wabot_cobro_rech_fila_respaldo($c['pre'], $c['nombre_mp'], $estado, $GLOBALS['WABOT_TEST_COBRO_LISTAS'] ?? null);

        /* Al cliente que se dio de baja (23-nov): ¿seguir por otro medio o dar de baja el servicio?,
         * con hasta cuándo lo tiene activo. Solo canceladas (no pausadas), que ya habían cobrado y
         * siguen activas hoy; no si MP la canceló después del «último intento» (ya se le avisó). */
        $clienteRes = null;
        $bajaMarca = 'baja:' . $c['pre'];
        $yaBaja = is_array($estado['clientes'][$bajaMarca] ?? null) && wabot_pagos_resultado_final((string)($estado['clientes'][$bajaMarca]['res'] ?? ''));
        if ($c['estado'] === 'cancelled' && !$yaBaja && !isset($ultimosAvisados[$c['pre']]) && !wabot_cobro_rech_ultimo_reciente($estado, $c['pre'], $ahora)
            && is_array($f) && !empty($f['seguro']) && !isset($porFuera[(string)($f['id'] ?? '')])) {
            $hasta = wabot_cobro_rech_pagado_hasta($mp, $c['pre']);
            if ($hasta !== '' && $hasta >= $hoy) {
                $clienteRes = wabot_cobro_rech_cliente_enviar($estado, $f, 'suscripcion_cancelada', ['fecha' => wabot_renovacion_fecha_texto($hasta)],
                    $bajaMarca, $cfg, $enviar, $ahora, $porFuera, ['id' => (string)($f['id'] ?? ''), 'hasta' => $hasta, 'monto' => (float)$c['monto']], $mp);
                $res['clientes'][] = ['pre' => $c['pre'], 'baja' => true, 'resultado' => $clienteRes];
                if ($enDisco) wabot_cobro_rech_guardar($estado);
            }
        }

        if (isset($estado['canceladas'][$marca])) continue;
        [$titulo, $lineas, $clave] = wabot_cobro_rech_aviso_cancelada($f, $c);
        $lineas = array_merge($lineas, wabot_cobro_rech_cruzado_lineas($estado, $f, $mp, $ahora));
        if ($clienteRes !== null && $clienteRes !== 'cruzado') $lineas[] = wabot_pagos_resultado_texto($clienteRes);
        if (!$avisar($titulo, $lineas, $clave)) { $res['fallidos']++; continue; }
        $estado['canceladas'][$marca] = $ahora;
        if ($enDisco) wabot_cobro_rech_guardar($estado);
        $res['canceladas']++;
        $res['detalle'][] = ['pre' => $c['pre'], 'id' => $f['id'] ?? '', 'resultado' => $c['estado']];
        wabot_log('suscripcion_cancelada_aviso', ['pre' => $c['pre'], 'estado' => $c['estado'], 'id' => $f['id'] ?? '']);
    }
    // «Recibimos tu pago» cuando MP cobra la renovación (23-nov). El primer cobro de una suscripción
    // nueva (a menos de 20 días del alta) no: ese día arranca la web y lo atiende Pablo.
    foreach (wabot_cobro_rech_pagos_aprobados($mp, $ahora) as $p) {
        $alta = (string)($altas[$p['pre']] ?? '');
        if ($alta === '' || $dias($alta, $p['dia']) < 20) continue;
        $f = $porPre[$p['pre']] ?? wabot_cobro_rech_fila_respaldo($p['pre'], '', $estado, $GLOBALS['WABOT_TEST_COBRO_LISTAS'] ?? null);
        $r = wabot_cobro_rech_cliente_enviar($estado, $f, 'pago_recibido',
            ['monto' => wabot_moneda($p['monto']), 'fecha' => wabot_renovacion_fecha_texto(wabot_renovacion_mas_un_mes($p['dia']))],
            'pago:' . $p['pago'], $cfg, $enviar, $ahora, $porFuera, [], $mp);
        if ($r !== null) {
            $res['clientes'][] = ['pago' => $p['pago'], 'pre' => $p['pre'], 'resultado' => $r];
            if ($enDisco) wabot_cobro_rech_guardar($estado);
        }
    }

    wabot_cobro_rech_plazos($estado, $porPre, $estadosSub, $cfg, $mp, $enviar, $avisar, $ahora, $hoy, $porFuera, $res);
    if ($enDisco) wabot_cobro_rech_guardar($estado);

    // Las marcas de canceladas de hace más de 2 meses ya no frenan nada.
    $estado['canceladas'] = array_filter($estado['canceladas'], function ($ts) use ($ahora) { return (int)$ts >= $ahora - 62 * 86400; });
    $estado['clientes'] = array_filter((array)$estado['clientes'], function ($e) use ($ahora) { return is_array($e) && (int)($e['ts'] ?? 0) >= $ahora - 62 * 86400; });
    if ($enDisco) wabot_cobro_rech_guardar($estado);
    return $res + ($enDisco ? [] : ['estado' => $estado]);
}
