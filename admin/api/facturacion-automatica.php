<?php
/**
 * Facturación automática de las suscripciones, desde el admin (Mantenimiento →
 * Facturación). La lógica está en config/arca/suscripciones.php; lo emite solo
 * el cron (mantenimiento/api/facturar-cobros.php).
 *
 *   GET  ?accion=estado      suscripciones, cobros de los últimos días y cómo está la factura de cada uno
 *   POST ?accion=activar     {activa}                   prende o pausa la facturación automática
 *   POST ?accion=receptor    {suscripcion, modo, …}     a quién se le facturan los cobros de esa suscripción
 *   POST ?accion=excluir     {suscripcion, excluida}    que esa suscripción no se facture sola
 *   POST ?accion=facturar    {pago}                     factura ya un cobro puntual (por ejemplo, uno anterior a la activación)
 */

require __DIR__ . '/auth-admin.php';
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
$accion = $_GET['accion'] ?? 'estado';
$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) $entrada = [];

// IDs de suscripción de Mercado Pago: 32 caracteres hexadecimales; se acepta un poco más por las dudas.
function suscripcion_de_entrada(array $entrada)
{
    $id = trim((string) ($entrada['suscripcion'] ?? ''));
    if (!preg_match('/^[A-Za-z0-9_-]{8,64}$/', $id)) throw new InvalidArgumentException('Falta la suscripción.');
    return $id;
}

try {
    if ($accion === 'estado') {
        responder(['ok' => true] + sus_panorama($config, 'sus_mp') + [
            'condicionesIva' => sus_condiciones_iva($config),
            'tiposDocumento' => receptor_tipos_documento(),
        ]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(['ok' => false, 'error' => 'Método no permitido'], 405);

    if ($accion === 'activar') {
        $activa = !empty($entrada['activa']);
        $ajustes = sus_ajustes_cambiar($config, function ($a) use ($activa) {
            $a['activa'] = $activa;
            // La primera vez queda la fecha de activación: los cobros de antes no se facturan solos.
            // Pausar y volver a activar no la mueve (lo cobrado en la pausa se factura al volver).
            if ($activa && $a['desde'] === '') $a['desde'] = gmdate('c');
            return $a;
        });
        responder(['ok' => true, 'activa' => $ajustes['activa'], 'desde' => $ajustes['desde']]);
    }

    if ($accion === 'receptor') {
        $suscripcion = suscripcion_de_entrada($entrada);
        $receptor = ($entrada['modo'] ?? '') === 'identificado'
            ? receptor_normalizar($entrada, array_column(sus_condiciones_iva($config), 'id'))
            : receptor_normalizar(['tipoDocumento' => 99]);
        // ARCA lo rechaza igual (10069), pero recién al emitir.
        if ($receptor['numeroDocumento'] === (string) $config['cuit']) {
            throw new InvalidArgumentException('Ese es tu CUIT: poné el del cliente.');
        }
        sus_ajustes_cambiar($config, function ($a) use ($suscripcion, $receptor) {
            $a['receptores'][$suscripcion] = $receptor;
            return $a;
        });
        responder(['ok' => true, 'receptor' => $receptor]);
    }

    if ($accion === 'excluir') {
        $suscripcion = suscripcion_de_entrada($entrada);
        $excluida = !empty($entrada['excluida']);
        sus_ajustes_cambiar($config, function ($a) use ($suscripcion, $excluida) {
            if ($excluida) $a['excluidas'][$suscripcion] = gmdate('c');
            else unset($a['excluidas'][$suscripcion]);
            return $a;
        });
        responder(['ok' => true, 'excluida' => $excluida]);
    }

    if ($accion === 'facturar') {
        $pagoId = trim((string) ($entrada['pago'] ?? ''));
        if (!preg_match('/^\d{4,20}$/', $pagoId)) throw new InvalidArgumentException('Falta el cobro.');

        $cobro = sus_cobro_de_pago(sus_mp('/v1/payments/' . $pagoId), sus_yo('sus_mp'));
        if (!$cobro) throw new InvalidArgumentException('Ese pago no es un cobro aprobado de una suscripción de esta cuenta.');
        if ($cobro['devuelto'] > 0) {
            throw new InvalidArgumentException('Ese cobro tiene una devolución en Mercado Pago: si corresponde, facturalo desde el 🧾 de la fila.');
        }

        $ajustes = sus_ajustes($config);
        $lock = registro_lock($config);
        try {
            $registro = registro_leer($config);
            $estado = sus_estado($config);
            $aMano = sus_factura_a_mano($registro, $cobro);
            if ($aMano !== null && !isset($registro[sus_clave($cobro['id'])])) {
                responder(['ok' => false, 'error' => 'Ese cobro ya tiene una factura hecha a mano desde su fila (C '
                    . str_pad((string) ($registro[$aMano]['numero'] ?? ''), 8, '0', STR_PAD_LEFT) . ').'], 409);
            }
            [$receptor] = sus_receptor($cobro['suscripcion'], $ajustes, $registro);
            $receptor = sus_receptor_revalidar($receptor, array_column(sus_condiciones_iva($config), 'id'));
            $hecho = sus_facturar_cobro(new Arca($config), $config, $cobro, $receptor, $registro, $estado, 'cobro');
            if (isset($estado['errores'][sus_clave($cobro['id'])])) {
                unset($estado['errores'][sus_clave($cobro['id'])]);
                sus_estado_guardar($config, $estado);
            }
        } finally {
            registro_soltar($lock);
        }
        responder(['ok' => true, 'resultado' => $hecho['resultado'], 'factura' => $hecho['factura']]);
    }

    responder(['ok' => false, 'error' => 'Acción desconocida'], 400);
} catch (InvalidArgumentException $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 400);
} catch (ArcaError $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 502);
} catch (Throwable $e) {
    responder(['ok' => false, 'error' => $e->getMessage()], 500);
}
