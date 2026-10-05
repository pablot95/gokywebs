<?php
/**
 * Ingresos de las suscripciones (Inversión → Ingresos por semana y Planificador,
 * 4-oct-2026). Solo lectura: los cobros aprobados de suscripciones de Mercado
 * Pago desde ?desde=AAAA-MM-DD y las suscripciones vigentes con su próximo
 * cobro. Los planes anuales y los pagos únicos salen de Firestore, en el admin.
 *
 *   GET ?desde=2026-08-01
 *   → {ok, cobros: [{id, suscripcion, monto, devuelto, dia, aprobado, nombre}],
 *      suscripciones: [{id, nombre, estado, monto, proximoCobro, alta}]}
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

    $suscripciones = [];
    foreach (sus_suscripciones($mp, $yo) as $s) {
        $estado = (string) ($s['status'] ?? '');
        if (!in_array($estado, ['authorized', 'paused'], true)) continue;
        $id = (string) ($s['id'] ?? '');
        $nombre = trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''));
        $suscripciones[] = [
            'id' => $id,
            'nombre' => $nombre !== '' ? $nombre : ($nombres[$id] ?? ''),
            'estado' => $estado,
            'monto' => round((float) ($s['auto_recurring']['transaction_amount'] ?? 0), 2),
            'proximoCobro' => $estado === 'authorized' ? (string) ($s['next_payment_date'] ?? '') : '',
            'alta' => (string) ($s['date_created'] ?? ''),
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
