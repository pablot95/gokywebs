<?php
/**
 * Intentos de cobro de las suscripciones (Calendario → Intentos de cobro, 24-oct-2026).
 * Solo lectura. Por cada suscripción de Mercado Pago, sus cobros mensuales
 * ("authorized_payments": uno por mes, con los reintentos adentro) en el estado
 * que estén: cobrado, rechazado y reintentando ("Intento 1 de 4" en MP), programado,
 * vencido o devuelto. La búsqueda de pagos no alcanza: un reintento rechazado no
 * siempre deja un pago (24-oct: Yanzón y Gianaria, rechazados el 23, no tenían ninguno).
 *
 *   GET → {ok, cobros: [{id, suscripcion, nombre, estadoSuscripcion, monto, estado,
 *          pagoEstado, pagoDetalle, motivo, intento, proximoReintento, vence, fecha,
 *          creado, modificado, medio, pagoId}]}
 */

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/suscripciones.php';

header('Content-Type: application/json; charset=utf-8');

function intentos_responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/* GET en paralelo a la API de Mercado Pago: [clave => ruta] → [clave => respuesta decodificada | null]. */
function intentos_mp_varios(array $rutas)
{
    $salida = [];
    foreach (array_chunk($rutas, 10, true) as $tanda) {
        $multi = curl_multi_init();
        $handles = [];
        foreach ($tanda as $clave => $ruta) {
            $ch = curl_init('https://api.mercadopago.com' . $ruta);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . MP_ACCESS_TOKEN],
                CURLOPT_TIMEOUT => 25,
            ]);
            curl_multi_add_handle($multi, $ch);
            $handles[$clave] = $ch;
        }
        do {
            $estado = curl_multi_exec($multi, $activos);
            if ($activos) curl_multi_select($multi, 1);
        } while ($activos && $estado === CURLM_OK);
        foreach ($handles as $clave => $ch) {
            $codigo = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $datos = json_decode((string) curl_multi_getcontent($ch), true);
            $salida[$clave] = $codigo === 200 && is_array($datos) ? $datos : null;
            curl_multi_remove_handle($multi, $ch);
            curl_close($ch);
        }
        curl_multi_close($multi);
    }
    return $salida;
}

if (!verifyAdminToken()) intentos_responder(['ok' => false, 'error' => 'No autorizado'], 401);

try {
    $mp = 'sus_mp';
    $yo = sus_yo($mp);   // de paso carga el token (config/mp-config.php)
    $suscripciones = [];
    foreach (sus_suscripciones($mp, $yo) as $s) {
        $id = (string) ($s['id'] ?? '');
        if ($id !== '') $suscripciones[$id] = $s;
    }

    // MP devuelve hasta 12 por página: alcanza para un año de una suscripción; si alguna tiene más, se sigue.
    $paginas = intentos_mp_varios(array_map(function ($id) {
        return '/authorized_payments/search?preapproval_id=' . rawurlencode($id) . '&limit=12';
    }, array_combine(array_keys($suscripciones), array_keys($suscripciones))));
    $faltan = 0;
    $facturas = [];
    foreach ($paginas as $id => $pagina) {
        if ($pagina === null) { $faltan++; continue; }
        $facturas[$id] = $pagina['results'] ?? [];
        for ($offset = 12; $offset < (int) ($pagina['paging']['total'] ?? 0) && $offset < 120; $offset += 12) {
            $mas = $mp('/authorized_payments/search?preapproval_id=' . rawurlencode($id) . '&limit=12&offset=' . $offset);
            $facturas[$id] = array_merge($facturas[$id], $mas['results'] ?? []);
        }
    }

    $cobros = [];
    foreach ($facturas as $id => $lista) {
        $s = $suscripciones[$id];
        $nombre = trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''));
        foreach ($lista as $f) {
            $cobros[] = [
                'id' => (string) ($f['id'] ?? ''),
                'suscripcion' => $id,
                'nombre' => $nombre,
                'estadoSuscripcion' => (string) ($s['status'] ?? ''),
                'monto' => round((float) ($f['transaction_amount'] ?? 0), 2),
                // scheduled (pendiente o reintentando), processed (cobrado), recycling, cancelled, expired…
                'estado' => (string) ($f['status'] ?? ''),
                'pagoEstado' => (string) ($f['payment']['status'] ?? ''),
                'pagoDetalle' => (string) ($f['payment']['status_detail'] ?? ''),
                'motivo' => (string) ($f['rejection_code'] ?? ''),
                'intento' => (int) ($f['retry_attempt'] ?? 0),
                'proximoReintento' => (string) ($f['next_retry_date'] ?? ''),
                'vence' => (string) ($f['expire_date'] ?? ''),
                'fecha' => (string) ($f['debit_date'] ?? $f['date_created'] ?? ''),
                'creado' => (string) ($f['date_created'] ?? ''),
                'modificado' => (string) ($f['last_modified'] ?? ''),
                'medio' => (string) ($f['payment_method_id'] ?? ''),
                'pagoId' => (string) ($f['payment']['id'] ?? ''),
            ];
        }
    }
    usort($cobros, function ($a, $b) { return strcmp($b['fecha'], $a['fecha']); });

    intentos_responder(['ok' => true, 'cobros' => $cobros, 'sinDatos' => $faltan]);
} catch (Throwable $e) {
    intentos_responder(['ok' => false, 'error' => 'No se pudo consultar Mercado Pago: ' . $e->getMessage()], 502);
}
