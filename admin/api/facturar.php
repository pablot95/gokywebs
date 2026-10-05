<?php

require __DIR__ . '/auth-admin.php';
require __DIR__ . '/../../config/arca/arca.php';
require __DIR__ . '/../../config/arca/receptor.php';
require __DIR__ . '/../../config/arca/registro.php';
require __DIR__ . '/../../config/arca/archivo.php';
require __DIR__ . '/../../config/arca/suscripciones.php';

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

/**
 * Intentos del modal que quedaron sin respuesta de ARCA (se cortó la conexión
 * justo después de que autorizó, o el proceso se cayó antes de guardar): el de
 * este mismo pedido y los de este cliente con otro requestId (se cerró el modal
 * y se volvió a abrir). Se verifican con sus_recuperar_intento(), el mismo
 * criterio que la facturación automática.
 */
function intentosModalPendientes(array $estado, $requestId, $clienteId)
{
    $pendientes = [];
    foreach ($estado['intentos'] as $clave => $intento) {
        if (strpos((string) $clave, 'modal:') !== 0 || !is_array($intento) || empty($intento['requestId'])) continue;
        if ($intento['requestId'] === $requestId || ($intento['clienteId'] ?? null) === $clienteId) $pendientes[$clave] = $intento;
    }
    return $pendientes;
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
        try {
            $registro = registro_leer($config);
        } catch (RuntimeException $e) {
            responder(['ok' => false, 'error' => $e->getMessage()], 500);
        }
        $masReciente = '';
        foreach ($registro as $emitida) {
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

// De acá hasta guardar, nadie más emite ni escribe el registro (tampoco la
// facturación automática de las suscripciones): ver config/arca/registro.php.
// El lock se suelta solo cuando termina el pedido.
try {
    $lock = registro_lock($config);
    $registro = registro_leer($config);
    // Los intentos en curso del modal van con los de la facturación automática
    // (mismo archivo, que también se escribe solo con este lock), con la clave
    // modal:<requestId>. En el registro no: lo leen la lista de facturas, el zip
    // y los comprobantes, que toman todo lo que hay ahí como emitido.
    $estado = sus_estado($config);
} catch (RuntimeException $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 500);
}

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
    // Un intento anterior de este pedido, o de este cliente, quedó sin
    // respuesta: antes de emitir se verifica en ARCA si ya había salido.
    foreach (intentosModalPendientes($estado, $requestId, $clienteId) as $claveIntento => $intento) {
        $idIntento = (string) $intento['requestId'];
        // Si ya está en el registro, se guardó y solo faltó borrar el intento.
        $recuperada = isset($registro[$idIntento])
            ? null
            : sus_recuperar_intento($arca, $config['puntoVenta'], $intento, $registro);
        unset($estado['intentos'][$claveIntento]);
        if (!$recuperada) {
            sus_estado_guardar($config, $estado);
            continue;
        }
        $factura = array_merge($intento['factura'], [
            'numero' => $recuperada['numero'],
            'cae' => $recuperada['cae'],
            'caeVence' => $recuperada['caeVence'],
            'observaciones' => '',
            'emitidaEl' => date('c'),
            'recuperada' => true,
        ]);
        $registro[$idIntento] = $factura;
        registro_guardar($config, $registro);
        sus_estado_guardar($config, $estado);
        archivo_guardar($config, $factura);
        responder(['ok' => true, 'yaEmitida' => true, 'recuperada' => true, 'factura' => $factura]);
    }

    $puntoVenta = (int) $config['puntoVenta'];
    $fecha = registro_fecha_hoy();
    $pedido = [
        'puntoVenta' => $puntoVenta,
        'fecha' => $fecha,
        'total' => $total,
        'concepto' => $comprobante['concepto'],
        'tipoDocumento' => $receptor['tipoDocumento'],
        'numeroDocumento' => $receptor['numeroDocumento'],
        'condicionIvaReceptor' => $receptor['condicionIvaId'],
        'servicioDesde' => $comprobante['servicioDesde'],
        'servicioHasta' => $comprobante['servicioHasta'],
        'vencimientoPago' => $comprobante['vencimientoPago'],
    ];

    $extras = [
        'entorno' => $config['entorno'],
        'cliente' => $receptor['nombre'] !== '' ? $receptor['nombre'] : trim((string) ($entrada['cliente'] ?? '')),
        'clienteId' => $clienteId,
        'receptor' => $receptor,
        'descripcion' => $comprobante['descripcion'],
        'condicionVenta' => $comprobante['condicionVenta'],
    ];
    // La suscripción de Mercado Pago de la fila, si se conoce: la facturación
    // automática toma de acá a quién facturarle y no vuelve a facturar ese cobro.
    $preapprovalId = trim((string) ($entrada['preapprovalId'] ?? ''));
    if ($preapprovalId !== '') $extras['preapprovalId'] = mb_substr($preapprovalId, 0, 64);

    // El intento queda anotado ANTES de pedir el CAE, con el último número
    // autorizado y la factura tal como la devolvería emitirFacturaC(): si la
    // respuesta no llega, el próximo intento la busca en ARCA en vez de duplicarla.
    $claveIntento = 'modal:' . $requestId;
    $llevaPeriodo = $comprobante['concepto'] !== 1;
    $estado['intentos'][$claveIntento] = [
        'anterior' => $arca->ultimoComprobante($puntoVenta, 11),
        'fecha' => $fecha,
        'total' => $total,
        'numeroDocumento' => (string) $receptor['numeroDocumento'],
        'receptor' => $receptor,
        'origen' => 'modal',
        'requestId' => $requestId,
        'clienteId' => $clienteId,
        'inicio' => gmdate('c'),
        'factura' => array_merge($pedido, [
            'tipoComprobante' => 11,
            'numeroDocumento' => (string) $receptor['numeroDocumento'],
            'servicioDesde' => $llevaPeriodo ? $pedido['servicioDesde'] : '',
            'servicioHasta' => $llevaPeriodo ? $pedido['servicioHasta'] : '',
            'vencimientoPago' => $llevaPeriodo ? $pedido['vencimientoPago'] : '',
        ], $extras),
    ];
    sus_estado_guardar($config, $estado);

    try {
        $factura = $arca->emitirFacturaC($pedido);
    } catch (ArcaError $e) {
        // ARCA contestó y lo rechazó: no se emitió y el intento se borra. Si ni
        // siquiera contestó, queda anotado para verificarlo al reintentar.
        $sinRespuesta = stripos($e->getMessage(), 'Fallo la conexion') === 0 || stripos($e->getMessage(), 'Respuesta no es XML') === 0;
        if (!$sinRespuesta) {
            unset($estado['intentos'][$claveIntento]);
            try {
                sus_estado_guardar($config, $estado);
            } catch (RuntimeException $e2) {
                // Queda el intento: el próximo lo verifica en ARCA y lo descarta.
            }
        }
        responder(['ok' => false, 'error' => $e->getMessage() . ($sinRespuesta
            ? ' — Puede que ARCA la haya autorizado igual: al volver a tocar Emitir se verifica antes de emitir otra.'
            : '')], 502);
    }
} catch (ArcaError $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Exception $e) {
    responder(['ok' => false, 'error' => 'Error inesperado: ' . $e->getMessage()], 500);
}

$factura = array_merge($factura, $extras, ['emitidaEl' => date('c')]);

$registro[$requestId] = $factura;
try {
    registro_guardar($config, $registro);
} catch (RuntimeException $e) {
    // Ya tiene CAE: se devuelve igual para que se pueda descargar. El intento
    // queda anotado, así que un reintento la encuentra en ARCA en vez de emitir otra.
    responder(['ok' => true, 'factura' => $factura, 'advertencia' => $e->getMessage()]);
}

unset($estado['intentos'][$claveIntento]);
try {
    sus_estado_guardar($config, $estado);
} catch (RuntimeException $e) {
    // Ya está en el registro: el intento que quedó se descarta solo la próxima vez.
}

// El PDF queda guardado tal cual salió (si falla, se arma la primera vez que se pida).
archivo_guardar($config, $factura);

responder(['ok' => true, 'factura' => $factura]);
