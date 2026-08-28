<?php

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/arca.php';
require __DIR__ . '/../../config/arca/receptor.php';

header('Content-Type: application/json; charset=utf-8');

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!verifyAdminToken()) {
    responder(['ok' => false, 'error' => 'No autorizado'], 401);
}

$config = require __DIR__ . '/../../config/arca/arca-config.php';

function leerRegistro($config)
{
    $registro = is_readable($config['registro'])
        ? json_decode(file_get_contents($config['registro']), true)
        : [];
    return is_array($registro) ? $registro : [];
}

function condicionesIvaCacheadas($config)
{
    $cache = $config['condicionesIva'];
    if (is_readable($cache)) {
        $guardadas = json_decode(file_get_contents($cache), true);
        if (is_array($guardadas) && $guardadas) return $guardadas;
    }
    return receptor_condiciones_respaldo();
}

// La tabla de condiciones frente al IVA la define ARCA. La pedimos una vez cada
// 30 dias y la cacheamos: si el servicio esta caido igual queremos que el modal abra.
function condicionesIvaDisponibles(Arca $arca, $config)
{
    $cache = $config['condicionesIva'];
    if (is_readable($cache) && time() - filemtime($cache) < 30 * 86400) {
        return condicionesIvaCacheadas($config);
    }

    try {
        $lista = [];
        foreach ($arca->condicionesIvaReceptor('C') as $condicion) {
            $lista[] = ['id' => $condicion['id'], 'descripcion' => $condicion['descripcion']];
        }
        if ($lista) {
            @file_put_contents($cache, json_encode($lista, JSON_UNESCAPED_UNICODE), LOCK_EX);
            return $lista;
        }
    } catch (Exception $e) {
        // Sin conexion con el padron: seguimos con la tabla de respaldo.
    }

    return receptor_condiciones_respaldo();
}

try {
    $arca = new Arca($config);
} catch (Exception $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

$accion = $_GET['accion'] ?? 'emitir';

if ($accion === 'proximo') {
    try {
        $proximo = $arca->ultimoComprobante($config['puntoVenta'], 11) + 1;
    } catch (Exception $e) {
        responder(['ok' => false, 'error' => $e->getMessage()], 502);
    }

    // Ultimo receptor facturado a este cliente, para no recargar los datos fiscales
    // cada vez que se le emite una factura.
    $ultimoReceptor = null;
    $clienteId = trim((string) ($_GET['clienteId'] ?? ''));
    if ($clienteId !== '') {
        $masReciente = '';
        foreach (leerRegistro($config) as $emitida) {
            if (($emitida['clienteId'] ?? null) !== $clienteId) continue;
            if (empty($emitida['receptor'])) continue;
            if (($emitida['emitidaEl'] ?? '') < $masReciente) continue;
            $masReciente = $emitida['emitidaEl'] ?? '';
            $ultimoReceptor = $emitida['receptor'];
        }
    }

    responder([
        'ok' => true,
        'entorno' => $config['entorno'],
        'puntoVenta' => $config['puntoVenta'],
        'proximoNumero' => $proximo,
        'condicionesIva' => condicionesIvaDisponibles($arca, $config),
        'tiposDocumento' => receptor_tipos_documento(),
        'condicionesVenta' => receptor_condiciones_venta(),
        'descripcionSugerida' => receptor_descripcion_por_defecto(),
        'ultimoReceptor' => $ultimoReceptor,
    ]);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(['ok' => false, 'error' => 'Cuerpo invalido'], 400);
}

$requestId = trim((string) ($entrada['requestId'] ?? ''));
$clienteId = trim((string) ($entrada['clienteId'] ?? ''));
$total = round((float) ($entrada['total'] ?? 0), 2);

if ($requestId === '') responder(['ok' => false, 'error' => 'Falta el identificador del pedido'], 400);
if ($clienteId === '') responder(['ok' => false, 'error' => 'Falta el identificador del cliente'], 400);
if ($total <= 0) responder(['ok' => false, 'error' => 'El importe tiene que ser mayor a cero'], 400);

$registro = leerRegistro($config);

if (isset($registro[$requestId])) {
    responder(['ok' => true, 'yaEmitida' => true, 'factura' => $registro[$requestId]]);
}

try {
    $receptor = receptor_normalizar($entrada, array_column(condicionesIvaCacheadas($config), 'id'));
    $comprobante = receptor_normalizar_comprobante($entrada);
} catch (InvalidArgumentException $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 400);
}

try {
    $factura = $arca->emitirFacturaC([
        'puntoVenta' => $config['puntoVenta'],
        'total' => $total,
        'concepto' => $comprobante['concepto'],
        'tipoDocumento' => $receptor['tipoDocumento'],
        'numeroDocumento' => $receptor['numeroDocumento'],
        'condicionIvaReceptor' => $receptor['condicionIvaId'],
        'servicioDesde' => $comprobante['servicioDesde'],
        'servicioHasta' => $comprobante['servicioHasta'],
        'vencimientoPago' => $comprobante['vencimientoPago'],
    ]);
} catch (ArcaError $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Exception $e) {
    responder(['ok' => false, 'error' => 'Error inesperado: ' . $e->getMessage()], 500);
}

$factura['entorno'] = $config['entorno'];
$factura['cliente'] = $receptor['nombre'] !== ''
    ? $receptor['nombre']
    : trim((string) ($entrada['cliente'] ?? ''));
$factura['clienteId'] = $clienteId;
$factura['receptor'] = $receptor;
$factura['descripcion'] = $comprobante['descripcion'];
$factura['condicionVenta'] = $comprobante['condicionVenta'];
$factura['emitidaEl'] = date('c');

$registro[$requestId] = $factura;
file_put_contents($config['registro'], json_encode($registro, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

responder(['ok' => true, 'factura' => $factura]);
