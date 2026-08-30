<?php

// Solo lectura del registro de facturas emitidas (facturador/data/{uid}/emitidas.json).
// Devuelve la lista cruda: el agrupamiento por mes/cliente lo hace el frontend,
// asi no hace falta un endpoint nuevo por cada corte que se le ocurra agregar despues.

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

$dir = facturador_dir_tenant($uid);
$registroPath = $dir . '/emitidas.json';
$registro = is_readable($registroPath) ? json_decode(file_get_contents($registroPath), true) : [];
if (!is_array($registro)) $registro = [];

$facturas = [];
foreach ($registro as $f) {
    if (!is_array($f) || empty($f['cae'])) continue; // por las dudas, solo lo efectivamente emitido
    $facturas[] = [
        'numero' => (int) ($f['numero'] ?? 0),
        'puntoVenta' => (int) ($f['puntoVenta'] ?? 0),
        'tipoComprobante' => (int) ($f['tipoComprobante'] ?? 11),
        'fecha' => (string) ($f['fecha'] ?? ''),
        'total' => (float) ($f['total'] ?? 0),
        'neto' => isset($f['neto']) ? (float) $f['neto'] : null,
        'iva' => isset($f['iva']) ? (float) $f['iva'] : null,
        'cliente' => (string) ($f['cliente'] ?? ''),
        'clienteId' => (string) ($f['clienteId'] ?? ''),
    ];
}

usort($facturas, function ($a, $b) { return strcmp($b['fecha'], $a['fecha']); });

facturador_responder(['ok' => true, 'facturas' => $facturas]);
