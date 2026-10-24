<?php
/**
 * Ingresos de las suscripciones (Inversión → Ingresos por semana y Planificador,
 * 4-oct-2026). Solo lectura: los cobros aprobados de suscripciones de Mercado
 * Pago desde ?desde=AAAA-MM-DD y las suscripciones vigentes con su próximo
 * cobro. Los planes anuales y los pagos únicos salen de Firestore, en el admin.
 *
 *   GET ?desde=2026-08-01
 *   → {ok, cobros: [{id, suscripcion, monto, devuelto, dia, aprobado, nombre}],
 *      suscripciones: [{id, nombre, estado, monto, proximoCobro, alta, baja, semaforo, ultimoCobro}]}
 */

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/suscripciones.php';

header('Content-Type: application/json; charset=utf-8');

function ingresos_responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!verifyAdminToken()) ingresos_responder(['ok' => false, 'error' => 'No autorizado'], 401);

$desde = (string) ($_GET['desde'] ?? '');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde)) $desde = '2026-07-01';

try {
    $mp = 'sus_mp';
    $yo = sus_yo($mp);
    $cobros = sus_cobros($mp, $yo, new DateTimeImmutable($desde . ' 00:00:00', sus_zona()));

    $nombres = [];
    foreach ($cobros as $c) {
        if ($c['nombre'] !== '') $nombres[$c['suscripcion']] = $c['nombre'];
    }

    // Las canceladas también van (24-oct): un cliente vinculado a una que se dio de baja
    // tiene que verse como baja, no como "no aparece en Mercado Pago". `semaforo` es el
    // de MP: "green" al día, "yellow"/"red" cuando el último cobro rebotó y lo reintenta
    // (next_payment_date ya pasó al mes siguiente, así que el atrasado no se ve ahí).
    $suscripciones = [];
    foreach (sus_suscripciones($mp, $yo) as $s) {
        $estado = (string) ($s['status'] ?? '');
        if (!in_array($estado, ['authorized', 'paused', 'cancelled'], true)) continue;
        $id = (string) ($s['id'] ?? '');
        $nombre = trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''));
        $suscripciones[] = [
            'id' => $id,
            'nombre' => $nombre !== '' ? $nombre : ($nombres[$id] ?? ''),
            'estado' => $estado,
            'monto' => round((float) ($s['auto_recurring']['transaction_amount'] ?? 0), 2),
            'proximoCobro' => $estado === 'authorized' ? (string) ($s['next_payment_date'] ?? '') : '',
            'alta' => (string) ($s['date_created'] ?? ''),
            'baja' => $estado === 'cancelled' ? (string) ($s['last_modified'] ?? '') : '',
            'semaforo' => (string) ($s['summarized']['semaphore'] ?? ''),
            'ultimoCobro' => (string) ($s['summarized']['last_charged_date'] ?? ''),
        ];
    }

    ingresos_responder([
        'ok' => true,
        'desde' => $desde,
        'cobros' => array_map(function ($c) {
            return [
                'id' => $c['id'], 'suscripcion' => $c['suscripcion'], 'monto' => $c['monto'], 'devuelto' => $c['devuelto'],
                'dia' => $c['dia'], 'aprobado' => $c['aprobado'], 'nombre' => $c['nombre'],
            ];
        }, $cobros),
        'suscripciones' => $suscripciones,
    ]);
} catch (Throwable $e) {
    ingresos_responder(['ok' => false, 'error' => 'No se pudo consultar Mercado Pago: ' . $e->getMessage()], 502);
}
