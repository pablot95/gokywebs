<?php

/**
 * Facturación automática de lo que se cobra por afuera de las suscripciones
 * (Pablo, 12-nov-2026: «¿las webs de pago anual también se facturan solas?
 * ¡deberían! ¡todo!»).
 *
 * Las suscripciones de MP las factura suscripciones.php (la cuota 1 incluida).
 * Esto factura lo demás que se le cobra a un cliente, tal como queda anotado en
 * su doc de `clientes` (Firestore) desde el admin:
 *   cobros[]        {at, monto, tipo}: la seña al pasarlo a Cliente, el saldo
 *                   con «Pagó todo» o al cobrar la renovación, lo que cambió el
 *                   abono en la ficha. Los «ajuste» (negativos) no se facturan.
 *   renovaciones[]  {at, monto, vencia}: el cobro anual de los años siguientes.
 * Solo lo atado a un cliente: lo que entra a MP sin dueño (transferencias de
 * banco, que llegan sin nombre y se mezclan con plata de Pablo) no se toca
 * (decisión de Pablo, 12-nov). Los que pagan por afuera ya se facturan con su
 * botón «Pagó».
 *
 * Desde cuándo: desde la primera corrida con esto (ajuste 'desdePagos', se
 * anota solo). Lo de antes Pablo ya lo facturó a mano, o no, y no se toca.
 *
 * Para no duplicar ni facturar un error de tipeo:
 *  - un cobro se factura PC_ESPERA_HORAS después de anotado; si en ese día se
 *    anotó un «ajuste» (se corrigió el abono), no sale solo y queda a revisar;
 *  - el mismo monto anotado dos veces al mismo cliente en 24 h (el bot y Pablo
 *    anotaron la misma seña, Neuro Test 1-nov) sale una vez: el otro, a revisar;
 *  - si el cliente tiene una factura hecha a mano desde PC_VENTANA_ANTES días
 *    antes del cobro, se da por facturado (y se avisa);
 *  - el modal de factura avisa si el cliente ya tiene una automática reciente.
 * Cada cobro queda en el registro con la clave cliente-<id>-<instante>.
 */

require_once __DIR__ . '/suscripciones.php';

const PC_DESCRIPCION_ANUAL = 'Plan anual servicio web';
const PC_DESCRIPCION_UNICO = 'Diseño y desarrollo web';
const PC_CONDICION_VENTA = 'Transferencia';
const PC_VENTANA_ANTES = 45;
const PC_ESPERA_HORAS = 2;

/* ── Firestore (cuenta de servicio, solo lectura) ─────────────────────── */

function pc_fs_cuenta()
{
    foreach ([dirname(__DIR__) . '/service-account.json', dirname(__DIR__, 2) . '/service-account.json'] as $ruta) {
        $d = is_file($ruta) ? json_decode((string) @file_get_contents($ruta), true) : null;
        if (is_array($d) && !empty($d['client_email']) && !empty($d['private_key']) && !empty($d['project_id'])) return $d;
    }
    throw new RuntimeException('Falta config/service-account.json para leer los clientes.');
}

function pc_fs_token(array $sa)
{
    $b64 = function ($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); };
    $ahora = time();
    $cuerpo = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])) . '.' . $b64(json_encode([
        'iss' => $sa['client_email'], 'scope' => 'https://www.googleapis.com/auth/datastore',
        'aud' => 'https://oauth2.googleapis.com/token', 'iat' => $ahora, 'exp' => $ahora + 3600,
    ]));
    if (!openssl_sign($cuerpo, $firma, $sa['private_key'], OPENSSL_ALGO_SHA256)) throw new RuntimeException('No se pudo firmar el token de Firestore.');
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $cuerpo . '.' . $b64($firma)]),
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    ]);
    $d = json_decode((string) curl_exec($ch), true);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || empty($d['access_token'])) throw new RuntimeException('Google no dio el token de Firestore (HTTP ' . $http . ').');
    return (string) $d['access_token'];
}

function pc_fs_valor(array $v)
{
    foreach (['stringValue', 'timestampValue'] as $k) if (array_key_exists($k, $v)) return $v[$k];
    foreach (['integerValue', 'doubleValue'] as $k) if (array_key_exists($k, $v)) return (float) $v[$k];
    if (array_key_exists('booleanValue', $v)) return (bool) $v['booleanValue'];
    if (isset($v['arrayValue'])) return array_map('pc_fs_valor', $v['arrayValue']['values'] ?? []);
    if (isset($v['mapValue'])) return array_map('pc_fs_valor', $v['mapValue']['fields'] ?? []);
    return null;
}

/** Todos los docs de `clientes` con lo que hace falta acá: [id => campos]. */
function pc_clientes_firestore()
{
    $sa = pc_fs_cuenta();
    $token = pc_fs_token($sa);
    $base = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents/clientes';
    $mascara = implode('&', array_map(function ($c) { return 'mask.fieldPaths=' . $c; }, ['nombre', 'proyecto', 'modalidad', 'cobros', 'renovaciones']));
    $clientes = [];
    $pagina = '';
    for ($i = 0; $i < 50; $i++) {
        $ch = curl_init($base . '?pageSize=300&' . $mascara . ($pagina !== '' ? '&pageToken=' . rawurlencode($pagina) : ''));
        curl_setopt_array($ch, [CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
        $d = json_decode((string) curl_exec($ch), true);
        $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($http !== 200 || !is_array($d)) throw new RuntimeException('No se pudieron leer los clientes de Firestore (HTTP ' . $http . ').');
        foreach (($d['documents'] ?? []) as $doc) {
            $id = substr((string) $doc['name'], strrpos((string) $doc['name'], '/') + 1);
            $clientes[$id] = array_map('pc_fs_valor', $doc['fields'] ?? []);
        }
        $pagina = (string) ($d['nextPageToken'] ?? '');
        if ($pagina === '') break;
    }
    return $clientes;
}

/* ── Qué hay para facturar ────────────────────────────────────────────── */

/**
 * Los cobros anotados en los clientes desde $desde (UTC ISO), anotados hace más
 * de PC_ESPERA_HORAS, como cobros que entiende sus_facturar_cobro(). Devuelve
 * [cobros, aRevisar]: aRevisar son los que tienen un ajuste cerca (no salen solos).
 */
function pc_cobros(array $clientes, $desde, $ahora = null)
{
    $ahora = (int) ($ahora ?? time());
    $desdeTs = strtotime($desde);
    $cobros = [];
    $aRevisar = [];
    foreach ($clientes as $clienteId => $c) {
        $nombre = implode(' · ', array_filter([trim((string) ($c['nombre'] ?? '')), trim((string) ($c['proyecto'] ?? ''))], 'strlen'));
        $modalidad = (string) ($c['modalidad'] ?? '');
        $ajustes = [];
        foreach ((array) ($c['cobros'] ?? []) as $r) {
            if (is_array($r) && (float) ($r['monto'] ?? 0) < 0) $ajustes[] = (int) strtotime((string) ($r['at'] ?? ''));
        }
        $lista = [];
        foreach ((array) ($c['cobros'] ?? []) as $r) {
            if (!is_array($r) || ($r['tipo'] ?? '') === 'ajuste') continue;
            $lista[] = $r + ['_desc' => $modalidad === 'propia' ? PC_DESCRIPCION_UNICO : PC_DESCRIPCION_ANUAL];
        }
        foreach ((array) ($c['renovaciones'] ?? []) as $r) {
            if (is_array($r)) $lista[] = $r + ['tipo' => 'renovacion', '_desc' => PC_DESCRIPCION_ANUAL];
        }
        usort($lista, function ($a, $b) { return strtotime((string) ($a['at'] ?? '')) <=> strtotime((string) ($b['at'] ?? '')); });
        $vistos = [];
        foreach ($lista as $r) {
            $ts = (int) strtotime((string) ($r['at'] ?? ''));
            $repetido = false;
            foreach ($vistos as [$t, $m]) {
                if (abs($m - (float) ($r['monto'] ?? 0)) < 0.005 && $ts - $t <= 86400) $repetido = true;
            }
            $vistos[] = [$ts, (float) ($r['monto'] ?? 0)];
            $monto = round((float) ($r['monto'] ?? 0), 2);
            if ($ts <= 0 || $monto <= 0 || $ts < $desdeTs || $ts > $ahora - PC_ESPERA_HORAS * 3600) continue;
            $aprobado = new DateTimeImmutable('@' . $ts);
            $cobro = [
                'id' => 'cliente-' . $clienteId . '-' . $ts,
                'suscripcion' => '',
                'monto' => $monto,
                'aprobado' => $aprobado->format('Y-m-d\TH:i:s\Z'),
                'dia' => $aprobado->setTimezone(sus_zona())->format('Y-m-d'),
                'cuota' => 0,
                'nombre' => $nombre,
                'email' => '',
                'devuelto' => 0,
                'clienteId' => (string) $clienteId,
                'tipoCobro' => (string) ($r['tipo'] ?? 'cobro'),
                'descripcion' => $r['_desc'],
                'condicionVenta' => PC_CONDICION_VENTA,
            ];
            $ajusteCerca = array_filter($ajustes, function ($t) use ($ts) { return $t >= $ts - 3600 && $t <= $ts + 86400; });
            if ($ajusteCerca || $repetido) $aRevisar[] = $cobro + ['motivo' => $repetido ? 'anotado dos veces' : 'se corrigió lo cobrado'];
            else $cobros[] = $cobro;
        }
    }
    usort($cobros, function ($a, $b) { return strcmp($a['aprobado'], $b['aprobado']); });
    return [$cobros, $aRevisar];
}

/**
 * ¿Ya está facturado a mano? Una factura del modal (no automática) del mismo
 * cliente hecha desde PC_VENTANA_ANTES días antes del cobro. Devuelve su clave o null.
 */
function pc_factura_a_mano(array $registro, array $cobro)
{
    $aprobado = strtotime($cobro['aprobado']);
    foreach ($registro as $clave => $factura) {
        if (!empty($factura['mpPagoId']) || ($factura['clienteId'] ?? '') !== $cobro['clienteId']) continue;
        $emitida = strtotime((string) ($factura['emitidaEl'] ?? ''));
        if ($emitida && $emitida >= $aprobado - PC_VENTANA_ANTES * 86400) return $clave;
    }
    return null;
}

/** A quién: el receptor de la última factura de ese cliente (como el modal); si no, consumidor final. */
function pc_receptor(array $cobro, array $registro)
{
    $ultima = null;
    foreach ($registro as $factura) {
        if (($factura['clienteId'] ?? '') !== $cobro['clienteId'] || empty($factura['receptor'])) continue;
        if ($ultima && ($factura['emitidaEl'] ?? '') <= ($ultima['emitidaEl'] ?? '')) continue;
        $ultima = $factura;
    }
    return $ultima ? $ultima['receptor'] : receptor_normalizar(['tipoDocumento' => 99]);
}

/** Facturas automáticas de cobros de $clienteId emitidas en los últimos $dias (para el aviso del modal). */
function pc_automaticas_recientes(array $registro, $clienteId, $dias = 60)
{
    $lista = [];
    if ($clienteId === '') return $lista;
    foreach ($registro as $factura) {
        if (($factura['origen'] ?? '') !== 'pago-cliente' || ($factura['clienteId'] ?? '') !== $clienteId) continue;
        if (strtotime((string) ($factura['emitidaEl'] ?? '')) < time() - $dias * 86400) continue;
        $lista[] = [
            'puntoVenta' => $factura['puntoVenta'] ?? null,
            'numero' => $factura['numero'] ?? null,
            'fecha' => $factura['fecha'] ?? '',
            'total' => $factura['total'] ?? 0,
            'descripcion' => $factura['descripcion'] ?? '',
        ];
    }
    return $lista;
}
