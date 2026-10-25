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
 * El cron (seguimiento.php) manda la plantilla `renovacion_por_fuera` el día
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

function wabot_renovacion_estado() {
    $j = json_decode((string)@file_get_contents(WABOT_RENOVACION_ARCHIVO), true);
    if (!is_array($j)) $j = [];
    return [
        'lista'    => array_values(array_filter((array)($j['lista'] ?? []), 'is_array')),
        'sync_ts'  => (int)($j['sync_ts'] ?? 0),
        'enviados' => (array)($j['enviados'] ?? []),
        'aviso_vieja_ts' => (int)($j['aviso_vieja_ts'] ?? 0),
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
    ];
}

/** Lo que manda el admin. Devuelve el estado guardado. */
function wabot_renovacion_sync(array $lista, $ahora = null) {
    $estado = wabot_renovacion_estado();
    $estado['lista'] = array_values(array_filter(array_map('wabot_renovacion_fila', $lista)));
    $estado['sync_ts'] = $ahora ?? time();
    $estado['aviso_vieja_ts'] = 0;
    // Los avisos de los que ya no están en la lista no hacen falta.
    $ids = array_column($estado['lista'], 'id');
    $estado['enviados'] = array_intersect_key($estado['enviados'], array_flip($ids));
    wabot_renovacion_guardar($estado);
    return $estado;
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
function wabot_renovacion_nombre($persona) {
    $p = trim((string)$persona);
    if ($p === '') return '';
    return (string)preg_split('/\s+/u', $p)[0];
}

/**
 * Manda la plantilla a una fila. $enviar(clave, fila, valores) reemplaza la red
 * en los tests. Devuelve 'ok', 'sin_chat', 'telefono', 'ambiguo', 'ocupado' o 'error'.
 */
function wabot_renovacion_enviar_fila(array $f, $cfg, $enviar = null) {
    $negocio = $f['negocio'] !== '' ? $f['negocio'] : 'tu web';
    $nombre = wabot_renovacion_nombre($f['persona']) ?: ($f['negocio'] !== '' ? $f['negocio'] : 'cómo estás');
    $valores = ['nombre' => $nombre, 'negocio' => $negocio, 'monto' => wabot_moneda($f['monto']) . ' por mes'];

    if ($f['tel'] === '') return 'sin_chat';
    $clave = wabot_renovacion_clave($f['tel'], $motivo);
    if ($clave === null) return $motivo === 'ambiguo' ? 'ambiguo' : 'telefono';
    if ($enviar) return $enviar($clave, $f, $valores) ? 'ok' : 'error';

    $lock = wabot_lock_tomar($clave);
    if (!$lock) return 'ocupado';
    try {
        $conv = wabot_conv_load($clave);
        if (trim((string)($conv['nombre_negocio'] ?? '')) === '' && $f['negocio'] !== '') $conv['nombre_negocio'] = $f['negocio'];
        if (!wabot_enviar_plantilla($conv, 'renovacion_por_fuera', $cfg, $valores)) return 'error';
        $conv['renovacion_aviso_ts'] = time();
        wabot_conv_save($conv);
        return 'ok';
    } finally {
        wabot_lock_soltar($lock);
    }
}

/**
 * La corrida del cron. Para los tests: $estado (sin disco), $enviar y $avisar
 * (push a Pablo). Devuelve qué hizo.
 */
function wabot_renovacion_correr($cfg, $ahora = null, $estado = null, $enviar = null, $avisar = null) {
    $ahora = $ahora ?? time();
    $res = ['revisados' => 0, 'enviados' => 0, 'fallidos' => 0, 'detalle' => []];
    $p = wabot_plantilla_config('renovacion_por_fuera', $cfg);
    if ($p === null) return $res + ['apagado' => true];
    if (array_key_exists('automatico', $p) && empty($p['automatico'])) return $res + ['apagado' => true];
    if (wabot_hora_local($ahora) < WABOT_RENOVACION_HORA || wabot_hora_local($ahora) >= 20) return $res;

    $enDisco = $estado === null;
    $estado = $estado ?? wabot_renovacion_estado();
    $avisar = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };

    if (!$estado['lista']) return $res;
    if ($ahora - (int)$estado['sync_ts'] > WABOT_RENOVACION_LISTA_VIEJA) {
        // Sin abrir el admin hace más de un mes: puede haber bajas que el bot no sabe.
        if (!$estado['aviso_vieja_ts']) {
            $avisar('Avisos de renovación frenados', 'La lista de los que pagan por afuera tiene más de 35 días. Abrí el admin para actualizarla.');
            $estado['aviso_vieja_ts'] = $ahora;
            if ($enDisco) wabot_renovacion_guardar($estado);
        }
        return $res + ['lista_vieja' => true];
    }

    $hoy = gmdate('Y-m-d', $ahora - 3 * 3600);
    $mes = substr($hoy, 0, 7);
    foreach ($estado['lista'] as $f) {
        $res['revisados']++;
        if (wabot_renovacion_dia_del_mes($f['dia'], $ahora) !== $hoy) continue;
        // El día del alta ya pagó el primer mes.
        if ($f['desde'] !== '' && $f['desde'] >= $hoy) continue;
        if ((string)($estado['enviados'][$f['id']]['mes'] ?? '') === $mes) continue;

        $r = wabot_renovacion_enviar_fila($f, $cfg, $enviar);
        if ($r === 'ocupado') continue;   // otro proceso tiene el chat: la próxima pasada
        $estado['enviados'][$f['id']] = ['mes' => $mes, 'ts' => $ahora, 'ok' => $r === 'ok', 'resultado' => $r];
        // Guardado enseguida: si la corrida se corta, la siguiente no le manda otro.
        if ($enDisco) wabot_renovacion_guardar($estado);
        $quien = $f['negocio'] !== '' ? $f['negocio'] : ($f['persona'] !== '' ? $f['persona'] : $f['tel']);
        if ($r === 'ok') {
            $res['enviados']++;
            $avisar('Aviso de renovación enviado', 'Le mandé a ' . $quien . ' el aviso del plan mensual (' . wabot_moneda($f['monto']) . ').');
        } else {
            $res['fallidos']++;
            $motivos = ['sin_chat' => 'no tiene teléfono cargado', 'telefono' => 'el teléfono no parece de WhatsApp',
                        'ambiguo' => 'hay dos chats con ese número', 'error' => 'WhatsApp no lo aceptó'];
            $avisar('Aviso de renovación sin enviar', 'Hoy le tocaba pagar a ' . $quien . ' y no le pude mandar el aviso: ' . ($motivos[$r] ?? $r) . '. Escribile a mano.');
        }
        $res['detalle'][] = ['id' => $f['id'], 'resultado' => $r];
        wabot_log('renovacion_aviso', ['id' => $f['id'], 'tel' => $f['tel'], 'resultado' => $r]);
    }
    return $res + ($enDisco ? [] : ['estado' => $estado]);
}
