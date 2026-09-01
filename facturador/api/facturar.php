<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';
require __DIR__ . '/../../config/arca/arca.php';
require __DIR__ . '/../../config/arca/receptor.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

// Responsable Inscripto emitiendo Factura A: el receptor tiene que estar
// identificado con CUIT y ser Responsable Inscripto o Responsable Monotributo
// (ids 1 y 6 en el catalogo de respaldo de receptor.php) — ARCA rechaza
// cualquier otra combinacion para clase A.
const FACTURADOR_TIPO_DOC_CUIT = 80;
const FACTURADOR_CONDICION_IVA_RI = 1;
const FACTURADOR_CONDICION_IVA_MONOTRIBUTO = 6;

function claseComprobante($tipoComprobante)
{
    $clases = [1 => 'A', 6 => 'B', 11 => 'C'];
    return $clases[(int) $tipoComprobante] ?? 'C';
}

// El catalogo de condiciones frente al IVA lo define ARCA para toda la red, no
// varia por CUIT: se cachea una sola vez por clase de comprobante, compartido
// entre todos los usuarios del facturador (no por tenant).
function rutaCacheCondiciones($claseCmp)
{
    return __DIR__ . '/../data/condiciones-' . $claseCmp . '.json';
}

function condicionesIvaCacheadas($claseCmp)
{
    $cache = rutaCacheCondiciones($claseCmp);
    if (is_readable($cache)) {
        $guardadas = json_decode(file_get_contents($cache), true);
        if (is_array($guardadas) && $guardadas) return $guardadas;
    }
    return receptor_condiciones_respaldo();
}

function condicionesIvaDisponibles(Arca $arca, $claseCmp)
{
    $cache = rutaCacheCondiciones($claseCmp);
    if (is_readable($cache) && time() - filemtime($cache) < 30 * 86400) {
        return condicionesIvaCacheadas($claseCmp);
    }
    try {
        $lista = [];
        foreach ($arca->condicionesIvaReceptor($claseCmp) as $condicion) {
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

function leerRegistro($config)
{
    $registro = is_readable($config['registro'])
        ? json_decode(file_get_contents($config['registro']), true)
        : [];
    return is_array($registro) ? $registro : [];
}

$config = facturador_arca_config($uid);
if (!$config) {
    facturador_responder(['ok' => false, 'necesitaConfiguracion' => true, 'error' => 'Todavía no terminaste de configurar ARCA.']);
}

try {
    $arca = new Arca($config);
} catch (Exception $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

$accion = $_GET['accion'] ?? 'emitir';

if ($accion === 'proximo') {
    $tipoComprobante = (int) ($_GET['tipoComprobante'] ?? 11);
    $claseCmp = claseComprobante($tipoComprobante);

    try {
        $proximo = $arca->ultimoComprobante($config['puntoVenta'], $tipoComprobante) + 1;
    } catch (Exception $e) {
        facturador_responder(['ok' => false, 'error' => $e->getMessage()], 502);
    }

    // Ultimo receptor facturado a este cliente, para no recargar los datos
    // fiscales cada vez que se le emite una factura mensual.
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

    facturador_responder([
        'ok' => true,
        'puntoVenta' => $config['puntoVenta'],
        'tipoComprobante' => $tipoComprobante,
        'proximoNumero' => $proximo,
        'condicionesIva' => condicionesIvaDisponibles($arca, $claseCmp),
        'tiposDocumento' => receptor_tipos_documento(),
        'condicionesVenta' => receptor_condiciones_venta(),
        'ultimoReceptor' => $ultimoReceptor,
    ]);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    facturador_responder(['ok' => false, 'error' => 'Cuerpo inválido'], 400);
}

$requestId = trim((string) ($entrada['requestId'] ?? ''));
$clienteId = trim((string) ($entrada['clienteId'] ?? ''));
$total = round((float) ($entrada['total'] ?? 0), 2);
$tipoComprobante = (int) ($entrada['tipoComprobante'] ?? 11);

if (!in_array($tipoComprobante, [1, 6, 11], true)) facturador_responder(['ok' => false, 'error' => 'Tipo de comprobante inválido'], 400);
if ($requestId === '') facturador_responder(['ok' => false, 'error' => 'Falta el identificador del pedido'], 400);
if ($clienteId === '') facturador_responder(['ok' => false, 'error' => 'Falta el identificador del cliente'], 400);
if ($total <= 0) facturador_responder(['ok' => false, 'error' => 'El importe tiene que ser mayor a cero'], 400);

$registro = leerRegistro($config);
if (isset($registro[$requestId])) {
    facturador_responder(['ok' => true, 'yaEmitida' => true, 'factura' => $registro[$requestId]]);
}

$claseCmp = claseComprobante($tipoComprobante);

try {
    $receptor = receptor_normalizar($entrada, array_column(condicionesIvaCacheadas($claseCmp), 'id'));
    $comprobante = receptor_normalizar_comprobante($entrada);
} catch (InvalidArgumentException $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 400);
}

// Factura A: receptor identificado con CUIT, y Responsable Inscripto o
// Responsable Monotributo (este ultimo valido segun el manual de WSFEv1 --
// validacion 10063/10217 -- para el procedimiento de transicion al Regimen
// General; ARCA lo acepta con una observacion, que ya se le muestra al
// usuario mas abajo via $factura['observaciones']). receptor_normalizar() no
// sabe nada de esto (es generico para cualquier clase), asi que la regla
// extra se valida aca, no adentro de receptor.php.
if ($tipoComprobante === 1) {
    $condicionesValidas = [FACTURADOR_CONDICION_IVA_RI, FACTURADOR_CONDICION_IVA_MONOTRIBUTO];
    if ($receptor['tipoDocumento'] !== FACTURADOR_TIPO_DOC_CUIT || !in_array($receptor['condicionIvaId'], $condicionesValidas, true)) {
        facturador_responder(['ok' => false, 'error' => 'La Factura A solo se le puede emitir a un cliente con CUIT de Responsable Inscripto o Responsable Monotributo.'], 400);
    }
}

// Desglose de IVA: obligatorio para A/B, ausente para C (Monotributo/Exento).
$ivaDetalle = [];
if ($tipoComprobante !== 11) {
    $itemsEntrada = is_array($entrada['ivaDetalle'] ?? null) ? $entrada['ivaDetalle'] : [];
    if (!$itemsEntrada) {
        facturador_responder(['ok' => false, 'error' => 'Falta el desglose de IVA.'], 400);
    }
    $sumaBase = 0.0;
    $sumaIva = 0.0;
    foreach ($itemsEntrada as $item) {
        $base = round((float) ($item['baseImponible'] ?? 0), 2);
        $iva = round((float) ($item['importe'] ?? 0), 2);
        $id = (int) ($item['alicuotaId'] ?? 0);
        if ($id <= 0 || $base < 0 || $iva < 0) {
            facturador_responder(['ok' => false, 'error' => 'El desglose de IVA tiene datos inválidos.'], 400);
        }
        $ivaDetalle[] = ['alicuotaId' => $id, 'baseImponible' => $base, 'importe' => $iva];
        $sumaBase += $base;
        $sumaIva += $iva;
    }
    if (abs(($sumaBase + $sumaIva) - $total) > 0.02) {
        facturador_responder(['ok' => false, 'error' => 'El neto más el IVA no coincide con el importe total.'], 400);
    }
}

try {
    $datosFactura = [
        'puntoVenta' => $config['puntoVenta'],
        'tipoComprobante' => $tipoComprobante,
        'total' => $total,
        'concepto' => $comprobante['concepto'],
        'tipoDocumento' => $receptor['tipoDocumento'],
        'numeroDocumento' => $receptor['numeroDocumento'],
        'condicionIvaReceptor' => $receptor['condicionIvaId'],
        'servicioDesde' => $comprobante['servicioDesde'],
        'servicioHasta' => $comprobante['servicioHasta'],
        'vencimientoPago' => $comprobante['vencimientoPago'],
    ];
    $factura = $tipoComprobante === 11
        ? $arca->emitirFacturaC($datosFactura)
        : $arca->emitirFactura($datosFactura + ['iva' => $ivaDetalle]);
} catch (ArcaError $e) {
    facturador_responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Exception $e) {
    facturador_responder(['ok' => false, 'error' => 'Error inesperado: ' . $e->getMessage()], 500);
}

$factura['entorno'] = 'produccion';
$factura['cliente'] = $receptor['nombre'] !== '' ? $receptor['nombre'] : trim((string) ($entrada['cliente'] ?? ''));
$factura['clienteId'] = $clienteId;
$factura['receptor'] = $receptor;
$factura['descripcion'] = $comprobante['descripcion'];
$factura['condicionVenta'] = $comprobante['condicionVenta'];
$factura['emitidaEl'] = date('c');

$registro[$requestId] = $factura;
file_put_contents($config['registro'], json_encode($registro, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

facturador_responder(['ok' => true, 'factura' => $factura]);
