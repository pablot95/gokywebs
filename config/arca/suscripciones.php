<?php

/**
 * Facturación automática de las suscripciones de Mercado Pago (26-sep-2026).
 *
 * Mercado Pago cobra cada suscripción el día de su renovación. Esto busca en la
 * API de MP los cobros aprobados de las suscripciones y emite la Factura C de
 * cada uno: se factura lo cobrado, no la fecha. Si una tarjeta rebota no hay
 * factura (que después habría que anular con una nota de crédito); cuando MP
 * reintenta y cobra, se factura ese día.
 *
 * No depende del webhook (mantenimiento/api/webhook-mp.php): consulta la API,
 * así que un aviso que no llega no deja un cobro sin facturar. Lo corre el cron
 * (mantenimiento/api/facturar-cobros.php, cada hora) y lo usa el admin
 * (admin/api/facturacion-automatica.php) para mostrar cómo está cada cobro,
 * cargar a quién se le factura cada suscripción y facturar un cobro puntual.
 *
 * Qué se factura: todo cobro aprobado de una suscripción que cobra esta cuenta,
 * desde que Pablo la activó en el admin (los anteriores quedan para facturarlos
 * a mano, desde el mismo admin), salvo las suscripciones que excluya.
 *
 * Archivos (en config/arca/, que no se sirve por HTTP; ninguno va al repo):
 *   $config['automatica']        lo que decide Pablo: si está activa y desde
 *                                cuándo, a quién se le factura cada
 *                                suscripción y cuáles no se facturan solas.
 *   $config['automaticaEstado']  lo que deja el proceso: intentos en curso,
 *                                errores y la última corrida.
 *   $config['registro']          el registro de facturas de siempre: cada cobro
 *                                queda con la clave mp-cobro-<id del pago>.
 */

require_once __DIR__ . '/arca.php';
require_once __DIR__ . '/receptor.php';
require_once __DIR__ . '/registro.php';
require_once __DIR__ . '/archivo.php';

// Lo que escribió Pablo en la primera mensualidad que facturó a mano (26-sep).
const SUS_DESCRIPCION = 'Suscripción mensual servicio web';
const SUS_CONDICION_VENTA = 'Mercado Pago';
// Hasta dónde se miran los cobros hacia atrás: alcanza para reintentar un cobro
// que falló varios días y para facturar a mano los del último mes.
const SUS_DIAS_ATRAS = 45;
// Freno por si algo se desbocara: en un día normal hay dos o tres cobros.
const SUS_MAX_POR_CORRIDA = 10;
const SUS_ZONA = 'America/Argentina/Buenos_Aires';

/* ── Mercado Pago ─────────────────────────────────────────────────────── */

/**
 * GET a la API de Mercado Pago con el token de config/mp-config.php. El resto
 * de las funciones reciben esto como callable, así los tests le pasan datos
 * fijos en lugar de la API.
 */
function sus_mp($ruta)
{
    if (!defined('MP_ACCESS_TOKEN')) {
        $configMp = __DIR__ . '/../mp-config.php';
        if (!is_file($configMp)) throw new RuntimeException('Falta config/mp-config.php (el token de Mercado Pago).');
        require_once $configMp;
    }

    $ch = curl_init('https://api.mercadopago.com' . $ruta);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . MP_ACCESS_TOKEN],
        CURLOPT_TIMEOUT => 25,
    ]);
    $respuesta = curl_exec($ch);
    $codigo = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    $datos = is_string($respuesta) ? json_decode($respuesta, true) : null;
    if ($codigo !== 200 || !is_array($datos)) {
        throw new RuntimeException(
            'Mercado Pago respondió HTTP ' . $codigo . ($error !== '' ? " ($error)" : '') . ' a ' . strtok($ruta, '?')
        );
    }
    return $datos;
}

// ID de la cuenta de Mercado Pago del token: el que cobra las suscripciones.
function sus_yo(callable $mp)
{
    $yo = $mp('/users/me');
    if (empty($yo['id'])) throw new RuntimeException('Mercado Pago no devolvió el usuario de la cuenta.');
    return (string) $yo['id'];
}

/**
 * Las suscripciones que cobra esta cuenta, en cualquier estado. La búsqueda
 * también trae aquellas en las que la cuenta es la que paga (una prueba de
 * otro sitio con la tarjeta de Pablo, por ejemplo): esas quedan afuera.
 */
function sus_suscripciones(callable $mp, $yo)
{
    $lista = [];
    for ($offset = 0; $offset < 1000; $offset += 100) {
        $pagina = $mp('/preapproval/search?limit=100&offset=' . $offset);
        foreach (($pagina['results'] ?? []) as $suscripcion) {
            if ((string) ($suscripcion['collector_id'] ?? '') === (string) $yo) $lista[] = $suscripcion;
        }
        if ($offset + 100 >= (int) ($pagina['paging']['total'] ?? 0)) break;
    }
    return $lista;
}

/**
 * Cobros aprobados de suscripciones de esta cuenta desde $desde, del más viejo
 * al más nuevo. La búsqueda de pagos trae de todo (transferencias, cobros con
 * link, compras): solo quedan los que vienen de una suscripción.
 */
function sus_cobros(callable $mp, $yo, DateTimeInterface $desde)
{
    $inicio = rawurlencode($desde->format('Y-m-d\TH:i:s.vP'));
    $cobros = [];
    for ($offset = 0; $offset < 2000; $offset += 100) {
        $pagina = $mp('/v1/payments/search?range=date_approved&begin_date=' . $inicio . '&end_date=NOW'
            . '&status=approved&collector.id=' . rawurlencode((string) $yo)
            . '&sort=date_approved&criteria=asc&limit=100&offset=' . $offset);
        foreach (($pagina['results'] ?? []) as $pago) {
            $cobro = sus_cobro_de_pago($pago, $yo);
            if ($cobro) $cobros[$cobro['id']] = $cobro;
        }
        if ($offset + 100 >= (int) ($pagina['paging']['total'] ?? 0)) break;
    }
    usort($cobros, function ($a, $b) { return strcmp($a['aprobado'], $b['aprobado']); });
    return $cobros;
}

/**
 * El cobro de una suscripción, con lo que hace falta para facturarlo; null si
 * el pago no es uno (MP lo marca con point_of_interaction SUBSCRIPTIONS y trae
 * el ID de la suscripción en transaction_data).
 */
function sus_cobro_de_pago(array $pago, $yo)
{
    $poi = $pago['point_of_interaction'] ?? [];
    $suscripcion = (string) ($poi['transaction_data']['subscription_id'] ?? '');
    if (($poi['type'] ?? '') !== 'SUBSCRIPTIONS' || $suscripcion === '') return null;
    if (($pago['status'] ?? '') !== 'approved') return null;
    if ((string) ($pago['collector_id'] ?? '') !== (string) $yo) return null;

    $monto = round((float) ($pago['transaction_amount'] ?? 0), 2);
    $aprobado = sus_fecha_local($pago['date_approved'] ?? '');
    if ($monto <= 0 || !$aprobado || empty($pago['id'])) return null;

    return [
        'id' => (string) $pago['id'],
        'suscripcion' => $suscripcion,
        'monto' => $monto,
        // Instante del cobro en UTC (para compararlo con la activación) y día en
        // hora argentina (para el período facturado).
        'aprobado' => $aprobado->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z'),
        'dia' => $aprobado->format('Y-m-d'),
        'cuota' => (int) ($poi['transaction_data']['subscription_sequence']['number'] ?? 0),
        'nombre' => trim(($pago['payer']['first_name'] ?? '') . ' ' . ($pago['payer']['last_name'] ?? '')),
        'email' => (string) ($pago['payer']['email'] ?? ''),
        'devuelto' => round((float) ($pago['transaction_amount_refunded'] ?? 0), 2),
    ];
}

/* ── Fechas ───────────────────────────────────────────────────────────── */

function sus_zona()
{
    return new DateTimeZone(SUS_ZONA);
}

function sus_ahora()
{
    return new DateTimeImmutable('now', sus_zona());
}

// Fecha ISO de Mercado Pago ("2026-09-26T13:28:53.000-04:00") en hora argentina; null si no se entiende.
function sus_fecha_local($iso)
{
    if (!is_string($iso) || trim($iso) === '') return null;
    try {
        return (new DateTimeImmutable($iso))->setTimezone(sus_zona());
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Período que paga una mensualidad cobrada el día $dia ("AAAA-MM-DD"): de ese
 * día al anterior del mismo día del mes siguiente, con el mismo criterio que el
 * ciclo de Mantenimiento (un 31 sigue el 30 o el 28 en los meses más cortos).
 * Devuelve [desde, hasta] como AAAAMMDD, el formato de ARCA.
 */
function sus_periodo($dia)
{
    $desde = DateTimeImmutable::createFromFormat('!Y-m-d', (string) $dia, sus_zona());
    if (!$desde) throw new InvalidArgumentException("Fecha de cobro inválida: $dia");

    $mesSiguiente = $desde->modify('first day of next month');
    $proximo = $mesSiguiente->setDate(
        (int) $mesSiguiente->format('Y'),
        (int) $mesSiguiente->format('n'),
        min((int) $desde->format('j'), (int) $mesSiguiente->format('t'))
    );
    return [$desde->format('Ymd'), $proximo->modify('-1 day')->format('Ymd')];
}

/* ── Lo que decide Pablo y lo que deja el proceso ─────────────────────── */

/**
 * @throws RuntimeException si el archivo existe y no se puede leer: sin saber a
 * quién se le factura cada suscripción, mejor no emitir.
 */
function sus_ajustes(array $config)
{
    $datos = sus_json_leer($config['automatica'], 'la configuración de la facturación automática');
    return [
        'activa' => !empty($datos['activa']),
        // Instante (UTC) en que se activó: los cobros de antes no se facturan solos.
        'desde' => is_string($datos['desde'] ?? null) ? $datos['desde'] : '',
        'receptores' => is_array($datos['receptores'] ?? null) ? $datos['receptores'] : [],
        'excluidas' => is_array($datos['excluidas'] ?? null) ? $datos['excluidas'] : [],
        'actualizado' => (string) ($datos['actualizado'] ?? ''),
    ];
}

// Lee, cambia y guarda los ajustes con un lock propio (no el del registro: no hace falta esperar a ARCA).
function sus_ajustes_cambiar(array $config, callable $cambio)
{
    $lock = fopen($config['automatica'] . '.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) throw new RuntimeException('No se pudo bloquear la configuración.');
    try {
        $ajustes = $cambio(sus_ajustes($config));
        $ajustes['actualizado'] = gmdate('c');
        json_guardar_atomico($config['automatica'], $ajustes, 'la configuración de la facturación automática');
        return $ajustes;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

// El estado lo escriben solo quienes tienen el lock del registro (el cron y el admin al facturar).
function sus_estado(array $config)
{
    $datos = sus_json_leer($config['automaticaEstado'], 'el estado de la facturación automática');
    foreach (['intentos', 'errores'] as $clave) {
        if (!is_array($datos[$clave] ?? null)) $datos[$clave] = [];
    }
    return $datos;
}

function sus_estado_guardar(array $config, array $estado)
{
    json_guardar_atomico($config['automaticaEstado'], $estado, 'el estado de la facturación automática');
}

function sus_json_leer($ruta, $que)
{
    if (!file_exists($ruta)) return [];
    $texto = @file_get_contents($ruta);
    $datos = $texto === false ? null : json_decode($texto, true);
    if (!is_array($datos)) throw new RuntimeException("No se puede leer $que (" . basename($ruta) . ').');
    return $datos;
}

function sus_clave($pagoId)
{
    return 'mp-cobro-' . $pagoId;
}

/* ── A quién se le factura ────────────────────────────────────────────── */

/**
 * A quién se le factura una suscripción: lo que Pablo cargó para ella en el
 * admin; si no, los datos de la última factura de esa suscripción (la
 * automática anterior, o una hecha a mano desde su fila en Mantenimiento); si
 * no, consumidor final, como la mayoría. Devuelve [receptor, origen].
 *
 * El CUIT del que paga en Mercado Pago no sirve: la primera mensualidad que
 * Pablo facturó a mano (26-sep) fue a otro CUIT que el de la tarjeta.
 */
function sus_receptor($suscripcion, array $ajustes, array $registro)
{
    if (!empty($ajustes['receptores'][$suscripcion]) && is_array($ajustes['receptores'][$suscripcion])) {
        return [$ajustes['receptores'][$suscripcion], 'cargado'];
    }
    $ultima = sus_ultima_factura($suscripcion, $registro);
    if ($ultima && !empty($ultima['receptor']) && is_array($ultima['receptor'])) {
        return [$ultima['receptor'], 'ultima'];
    }
    return [receptor_normalizar(['tipoDocumento' => 99]), 'final'];
}

// Se vuelve a validar al emitir: el archivo pudo quedar con datos viejos o tocados a mano.
function sus_receptor_revalidar(array $receptor, array $condicionesIds)
{
    return receptor_normalizar([
        'tipoDocumento' => (int) ($receptor['tipoDocumento'] ?? 99),
        'documento' => (int) ($receptor['tipoDocumento'] ?? 99) === 99 ? '' : (string) ($receptor['numeroDocumento'] ?? ''),
        'condicionIva' => (int) ($receptor['condicionIvaId'] ?? 0),
        'nombre' => (string) ($receptor['nombre'] ?? ''),
    ], $condicionesIds);
}

// Las condiciones frente al IVA que acepta ARCA: la tabla cacheada por facturar.php, o la de respaldo.
function sus_condiciones_iva(array $config)
{
    $cache = $config['condicionesIva'] ?? '';
    if ($cache !== '' && is_readable($cache)) {
        $guardadas = json_decode((string) file_get_contents($cache), true);
        if (is_array($guardadas) && $guardadas) return $guardadas;
    }
    return receptor_condiciones_respaldo();
}

function sus_ultima_factura($suscripcion, array $registro)
{
    $ultima = null;
    foreach ($registro as $factura) {
        if (($factura['preapprovalId'] ?? '') !== $suscripcion) continue;
        if ($ultima && ($factura['emitidaEl'] ?? '') <= ($ultima['emitidaEl'] ?? '')) continue;
        $ultima = $factura;
    }
    return $ultima;
}

/**
 * ¿Pablo ya facturó este cobro a mano? Una factura del modal (sin mpPagoId) de
 * la misma suscripción y el mismo importe, hecha entre unos días antes del
 * cobro y unas semanas después. Con esto el proceso no emite otra encima.
 * $usadas: facturas que ya cubrieron otro cobro en esta misma pasada.
 */
function sus_factura_a_mano(array $registro, array $cobro, array $usadas = [])
{
    $aprobado = strtotime($cobro['aprobado']);
    foreach ($registro as $clave => $factura) {
        if (isset($usadas[$clave]) || !empty($factura['mpPagoId'])) continue;
        if (($factura['preapprovalId'] ?? '') !== $cobro['suscripcion']) continue;
        if (abs((float) ($factura['total'] ?? 0) - $cobro['monto']) > 0.005) continue;
        $emitida = strtotime((string) ($factura['emitidaEl'] ?? ''));
        if (!$emitida || $emitida < $aprobado - 5 * 86400 || $emitida > $aprobado + 25 * 86400) continue;
        return $clave;
    }
    return null;
}

/**
 * Solo una pista para el admin, en los cobros anteriores a la activación: las
 * facturas a mano de entonces no tienen la suscripción, así que se busca una del
 * mismo importe hecha el día del cobro o la semana siguiente. No frena nada.
 * Cada factura se sugiere para un solo cobro, el más cercano: dos mensualidades
 * iguales con días de diferencia no se quedan con la misma.
 * Devuelve [id del cobro => factura].
 */
function sus_pistas_a_mano(array $registro, array $cobros)
{
    $pares = [];
    foreach ($cobros as $cobro) {
        $aprobado = strtotime($cobro['aprobado']);
        foreach ($registro as $clave => $factura) {
            if (!empty($factura['mpPagoId'])) continue;
            if (abs((float) ($factura['total'] ?? 0) - $cobro['monto']) > 0.005) continue;
            $emitida = strtotime((string) ($factura['emitidaEl'] ?? ''));
            if (!$emitida || $emitida < $aprobado - 86400 || $emitida > $aprobado + 8 * 86400) continue;
            $pares[] = [abs($emitida - $aprobado), $cobro['id'], $clave];
        }
    }
    sort($pares);
    $pistas = [];
    $usadas = [];
    foreach ($pares as [, $cobroId, $clave]) {
        if (isset($pistas[$cobroId]) || isset($usadas[$clave])) continue;
        $pistas[$cobroId] = $registro[$clave];
        $usadas[$clave] = true;
    }
    return $pistas;
}

/* ── Emitir ───────────────────────────────────────────────────────────── */

/**
 * Emite la factura de un cobro. Se llama con el registro bloqueado
 * (registro_lock) y con $registro y $estado recién leídos; los dos se
 * actualizan acá. Devuelve ['resultado' => 'emitida'|'recuperada'|'ya', 'factura' => …].
 *
 * Emitir no tiene vuelta atrás, así que nunca se reintenta a ciegas: antes de
 * pedir el CAE se anota el intento con el último número autorizado. Si la
 * respuesta no llega (se corta la conexión con ARCA, se cae el proceso), la
 * próxima vez se busca en ARCA si ese comprobante se emitió igual.
 *
 * @throws Exception si no se pudo emitir.
 */
function sus_facturar_cobro($arca, array $config, array $cobro, array $receptor, array &$registro, array &$estado, $origen)
{
    $clave = sus_clave($cobro['id']);
    if (isset($registro[$clave])) return ['resultado' => 'ya', 'factura' => $registro[$clave]];

    $puntoVenta = (int) $config['puntoVenta'];

    if (isset($estado['intentos'][$clave])) {
        $intento = $estado['intentos'][$clave];
        $recuperada = sus_recuperar_intento($arca, $puntoVenta, $intento, $registro);
        if ($recuperada) {
            $registro[$clave] = sus_factura_del_cobro($recuperada, $cobro, $intento['receptor'] ?? $receptor, $config, $intento['origen'] ?? $origen);
            registro_guardar($config, $registro);
            archivo_guardar($config, $registro[$clave]);
            unset($estado['intentos'][$clave]);
            sus_estado_guardar($config, $estado);
            return ['resultado' => 'recuperada', 'factura' => $registro[$clave]];
        }
        // ARCA no lo tiene: el intento anterior no llegó a emitirse y se puede volver a pedir.
        unset($estado['intentos'][$clave]);
    }

    [$servicioDesde, $servicioHasta] = sus_periodo($cobro['dia']);
    // ARCA rechaza un comprobante con fecha anterior a la del último del punto de
    // venta, y este punto de venta lo comparten el modal y el proceso: los dos
    // fechan con el mismo reloj, el del server web, que está en UTC.
    $fecha = registro_fecha_hoy();

    $estado['intentos'][$clave] = [
        'anterior' => $arca->ultimoComprobante($puntoVenta, 11),
        'fecha' => $fecha,
        'total' => $cobro['monto'],
        'numeroDocumento' => (string) $receptor['numeroDocumento'],
        'receptor' => $receptor,
        'origen' => $origen,
        'inicio' => gmdate('c'),
    ];
    sus_estado_guardar($config, $estado);

    $emitida = $arca->emitirFacturaC([
        'puntoVenta' => $puntoVenta,
        'total' => $cobro['monto'],
        'fecha' => $fecha,
        'concepto' => 2,
        'tipoDocumento' => $receptor['tipoDocumento'],
        'numeroDocumento' => $receptor['numeroDocumento'],
        'condicionIvaReceptor' => $receptor['condicionIvaId'],
        'servicioDesde' => $servicioDesde,
        'servicioHasta' => $servicioHasta,
        // Ya está cobrada: vence el mismo día (ARCA no acepta un vencimiento anterior a la fecha).
        'vencimientoPago' => $fecha,
    ]);

    $registro[$clave] = sus_factura_del_cobro($emitida, $cobro, $receptor, $config, $origen);
    registro_guardar($config, $registro);
    archivo_guardar($config, $registro[$clave]);
    unset($estado['intentos'][$clave]);
    sus_estado_guardar($config, $estado);
    return ['resultado' => 'emitida', 'factura' => $registro[$clave]];
}

/**
 * ¿ARCA autorizó un intento que quedó sin respuesta? Se revisan los
 * comprobantes posteriores al último que había antes del intento, salvo los
 * que ya están en el registro, y se busca uno de la misma fecha, importe y
 * documento. Devuelve la factura armada o null si no se emitió.
 */
function sus_recuperar_intento($arca, $puntoVenta, array $intento, array $registro)
{
    $anterior = (int) ($intento['anterior'] ?? 0);
    $ultimo = $arca->ultimoComprobante($puntoVenta, 11);
    if ($ultimo <= $anterior) return null;
    if ($ultimo - $anterior > 20) {
        throw new RuntimeException(
            'Un intento anterior quedó sin respuesta de ARCA y desde entonces se emitieron demasiados comprobantes para '
            . 'verificarlo solo: revisar en ARCA si la factura de ' . $intento['fecha'] . ' por $' . $intento['total'] . ' existe.'
        );
    }

    $conocidos = [];
    foreach ($registro as $factura) {
        if ((int) ($factura['puntoVenta'] ?? 0) === (int) $puntoVenta) $conocidos[(int) ($factura['numero'] ?? 0)] = true;
    }

    for ($numero = $anterior + 1; $numero <= $ultimo; $numero++) {
        if (isset($conocidos[$numero])) continue;
        $comprobante = $arca->consultarComprobante($puntoVenta, 11, $numero);
        if (!$comprobante) continue;
        if ((string) $comprobante['fecha'] !== (string) $intento['fecha']) continue;
        if (abs((float) $comprobante['total'] - (float) $intento['total']) > 0.005) continue;
        if ((int) $comprobante['documento'] !== (int) $intento['numeroDocumento']) continue;

        $receptor = $intento['receptor'] ?? [];
        return [
            'puntoVenta' => (int) $puntoVenta,
            'tipoComprobante' => 11,
            'numero' => $numero,
            'fecha' => (string) $comprobante['fecha'],
            'total' => (float) $comprobante['total'],
            'concepto' => 2,
            'tipoDocumento' => (int) ($receptor['tipoDocumento'] ?? 99),
            'numeroDocumento' => (string) $intento['numeroDocumento'],
            'condicionIvaReceptor' => (int) ($receptor['condicionIvaId'] ?? 5),
            'cae' => (string) $comprobante['cae'],
            'caeVence' => (string) $comprobante['caeVence'],
            'observaciones' => '',
        ];
    }
    return null;
}

// Lo que se guarda en el registro: lo que devuelve ARCA más lo mismo que agrega facturar.php.
function sus_factura_del_cobro(array $emitida, array $cobro, array $receptor, array $config, $origen)
{
    [$servicioDesde, $servicioHasta] = sus_periodo($cobro['dia']);
    return array_merge($emitida, [
        'servicioDesde' => $emitida['servicioDesde'] ?? $servicioDesde,
        'servicioHasta' => $emitida['servicioHasta'] ?? $servicioHasta,
        'vencimientoPago' => $emitida['vencimientoPago'] ?? $emitida['fecha'],
        'entorno' => $config['entorno'],
        'cliente' => ($receptor['nombre'] ?? '') !== '' ? $receptor['nombre'] : ($cobro['nombre'] !== '' ? $cobro['nombre'] : 'Suscriptor de Mercado Pago'),
        // La misma clave que usa el modal para una suscripción de Mantenimiento sin cliente.
        'clienteId' => 'mantenimiento:' . $cobro['suscripcion'],
        'receptor' => $receptor,
        'descripcion' => SUS_DESCRIPCION,
        'condicionVenta' => SUS_CONDICION_VENTA,
        'emitidaEl' => gmdate('c'),
        'origen' => $origen,
        'preapprovalId' => $cobro['suscripcion'],
        'mpPagoId' => $cobro['id'],
        'mpCobradoEl' => $cobro['aprobado'],
    ]);
}

/* ── La corrida del cron ──────────────────────────────────────────────── */

/**
 * Factura los cobros aprobados desde la activación que todavía no tienen
 * factura. Con 'simular' no emite ni escribe nada: solo dice qué haría (y
 * 'desde' hace de cuenta que se activó ese día, "AAAA-MM-DD").
 * $arca puede ser null al simular.
 */
function sus_correr(array $config, $arca, callable $mp, array $opciones = [])
{
    $simular = !empty($opciones['simular']);
    $resumen = [
        'inicio' => gmdate('c'),
        'simulada' => $simular,
        'emitidas' => [],
        'errores' => [],
        'aManoDetectadas' => [],
        'quedan' => 0,
        'aviso' => '',
    ];

    $ajustes = sus_ajustes($config);
    $desde = $ajustes['desde'];
    if (!empty($opciones['desde'])) {
        $desde = (new DateTimeImmutable($opciones['desde'] . ' 00:00:00', sus_zona()))
            ->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z');
    }
    if (!$simular && !$ajustes['activa']) {
        $resumen['aviso'] = $ajustes['desde'] === ''
            ? 'La facturación automática todavía no se activó: no se emitió nada.'
            : 'La facturación automática está pausada: no se emitió nada.';
        return $resumen;
    }
    if ($desde === '' || strtotime($desde) === false) {
        $resumen['aviso'] = 'No hay fecha de activación: no se emitió nada.';
        return $resumen;
    }

    $inicioVentana = max(strtotime($desde), strtotime('-' . SUS_DIAS_ATRAS . ' days'));
    $yo = sus_yo($mp);
    $cobros = sus_cobros($mp, $yo, (new DateTimeImmutable('@' . $inicioVentana))->setTimezone(sus_zona()));
    // Hay cobros que Mercado Pago devuelve sin el nombre del que paga: se toma el de la suscripción.
    if (array_filter($cobros, function ($c) { return $c['nombre'] === ''; })) {
        $nombres = [];
        foreach (sus_suscripciones($mp, $yo) as $s) {
            $nombres[(string) ($s['id'] ?? '')] = trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''));
        }
        foreach ($cobros as &$cobro) {
            if ($cobro['nombre'] === '') $cobro['nombre'] = $nombres[$cobro['suscripcion']] ?? '';
        }
        unset($cobro);
    }

    $lock = $simular ? null : registro_lock($config);
    try {
        $registro = registro_leer($config);
        $estado = sus_estado($config);
        $condicionesIds = array_column(sus_condiciones_iva($config), 'id');

        $pendientes = [];
        $usadas = [];
        foreach ($cobros as $cobro) {
            $clave = sus_clave($cobro['id']);
            if (strtotime($cobro['aprobado']) < strtotime($desde) || isset($registro[$clave])) continue;
            if (isset($ajustes['excluidas'][$cobro['suscripcion']])) continue;
            $aMano = sus_factura_a_mano($registro, $cobro, $usadas);
            if ($aMano !== null) {
                $usadas[$aMano] = true;
                $resumen['aManoDetectadas'][] = ['cobro' => $cobro['id'], 'factura' => $aMano];
                continue;
            }
            $pendientes[] = $cobro;
        }
        $resumen['quedan'] = max(0, count($pendientes) - SUS_MAX_POR_CORRIDA);

        foreach (array_slice($pendientes, 0, SUS_MAX_POR_CORRIDA) as $cobro) {
            $clave = sus_clave($cobro['id']);
            try {
                if ($cobro['devuelto'] > 0) {
                    throw new RuntimeException('El cobro tiene una devolución en Mercado Pago: si corresponde, facturarlo a mano.');
                }
                [$receptor] = sus_receptor($cobro['suscripcion'], $ajustes, $registro);
                $receptor = sus_receptor_revalidar($receptor, $condicionesIds);

                if ($simular) {
                    $resumen['emitidas'][] = sus_resumen_cobro($cobro, $receptor, null);
                    continue;
                }
                $hecho = sus_facturar_cobro($arca, $config, $cobro, $receptor, $registro, $estado, 'automatica');
                if (isset($estado['errores'][$clave])) {
                    unset($estado['errores'][$clave]);
                    sus_estado_guardar($config, $estado);
                }
                $resumen['emitidas'][] = sus_resumen_cobro($cobro, $receptor, $hecho['factura']) + ['resultado' => $hecho['resultado']];
            } catch (Throwable $e) {
                $previo = $estado['errores'][$clave] ?? null;
                $error = [
                    'mensaje' => $e->getMessage(),
                    'primera' => $previo['primera'] ?? gmdate('c'),
                    'ultima' => gmdate('c'),
                    'veces' => (int) ($previo['veces'] ?? 0) + 1,
                    'suscripcion' => $cobro['suscripcion'],
                    'monto' => $cobro['monto'],
                    'nombre' => $cobro['nombre'],
                ];
                $resumen['errores'][] = $error + ['cobro' => $cobro['id'], 'nuevo' => $previo === null];
                if (!$simular) {
                    $estado['errores'][$clave] = $error;
                    sus_estado_guardar($config, $estado);
                }
            }
        }
    } finally {
        registro_soltar($lock);
    }
    return $resumen;
}

function sus_resumen_cobro(array $cobro, array $receptor, $factura)
{
    return [
        'cobro' => $cobro['id'],
        'suscripcion' => $cobro['suscripcion'],
        'dia' => $cobro['dia'],
        'monto' => $cobro['monto'],
        'nombre' => $cobro['nombre'],
        'receptor' => ($receptor['tipoDocumento'] ?? 99) == 99
            ? 'consumidor final'
            : ($receptor['etiquetaDocumento'] ?? 'Doc') . ' ' . ($receptor['numeroDocumento'] ?? '') . ' · ' . ($receptor['nombre'] ?? ''),
        'numero' => $factura['numero'] ?? null,
        'puntoVenta' => $factura['puntoVenta'] ?? null,
    ];
}

// La última corrida queda en el estado para que el admin la muestre. Con el lock del registro, como toda escritura del estado.
function sus_anotar_corrida(array $config, array $resumen)
{
    $lock = registro_lock($config);
    try {
        $estado = sus_estado($config);
        $estado['ultimaCorrida'] = [
            'inicio' => $resumen['inicio'],
            'fin' => gmdate('c'),
            'emitidas' => count($resumen['emitidas']),
            'errores' => count($resumen['errores']),
            'aviso' => $resumen['aviso'],
            'falla' => $resumen['falla'] ?? '',
        ];
        sus_estado_guardar($config, $estado);
    } finally {
        registro_soltar($lock);
    }
}

/* ── Lo que muestra el admin ──────────────────────────────────────────── */

/**
 * Las suscripciones de la cuenta y los cobros de los últimos SUS_DIAS_ATRAS
 * días, cada uno con cómo está su factura. No emite ni escribe nada.
 */
function sus_panorama(array $config, callable $mp)
{
    $ajustes = sus_ajustes($config);
    $estado = sus_estado($config);
    $registro = registro_leer($config);
    $yo = sus_yo($mp);
    $desde = $ajustes['desde'] !== '' ? strtotime($ajustes['desde']) : null;

    $cobros = [];
    $nombres = [];
    $usadas = [];
    foreach (sus_cobros($mp, $yo, sus_ahora()->modify('-' . SUS_DIAS_ATRAS . ' days')) as $cobro) {
        $clave = sus_clave($cobro['id']);
        $fila = $cobro + ['estado' => '', 'factura' => null, 'error' => '', 'pista' => null];
        if ($cobro['nombre'] !== '') $nombres[$cobro['suscripcion']] = $cobro['nombre'];

        $aMano = isset($registro[$clave]) ? null : sus_factura_a_mano($registro, $cobro, $usadas);
        if (isset($registro[$clave])) {
            $fila['estado'] = 'facturada';
            $fila['factura'] = $registro[$clave];
        } elseif ($aMano !== null) {
            $usadas[$aMano] = true;
            $fila['estado'] = 'a_mano';
            $fila['factura'] = $registro[$aMano];
        } elseif (isset($estado['errores'][$clave])) {
            $fila['estado'] = 'error';
            $fila['error'] = (string) $estado['errores'][$clave]['mensaje'];
        } elseif (isset($estado['intentos'][$clave])) {
            // Se cortó a mitad de camino sin error anotado: la próxima vez se verifica en ARCA.
            $fila['estado'] = 'verificando';
        } elseif (isset($ajustes['excluidas'][$cobro['suscripcion']])) {
            $fila['estado'] = 'excluida';
        } elseif ($desde !== null && strtotime($cobro['aprobado']) >= $desde) {
            $fila['estado'] = $ajustes['activa'] ? 'pendiente' : 'pausada';
        } else {
            $fila['estado'] = 'anterior';
        }
        $cobros[] = $fila;
    }
    $anteriores = array_filter($cobros, function ($c) { return $c['estado'] === 'anterior'; });
    $pistas = sus_pistas_a_mano($registro, $anteriores);
    foreach ($cobros as &$fila) {
        if (isset($pistas[$fila['id']])) $fila['pista'] = $pistas[$fila['id']];
    }
    unset($fila);

    $suscripciones = [];
    foreach (sus_suscripciones($mp, $yo) as $s) {
        $id = (string) ($s['id'] ?? '');
        $estadoMp = (string) ($s['status'] ?? '');
        $tieneCobros = (bool) array_filter($cobros, function ($c) use ($id) { return $c['suscripcion'] === $id; });
        // Las canceladas o sin activar solo si cobraron algo en la ventana.
        if (!in_array($estadoMp, ['authorized', 'paused'], true) && !$tieneCobros) continue;

        [$receptor, $origen] = sus_receptor($id, $ajustes, $registro);
        $nombre = trim(($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''));
        $suscripciones[] = [
            'id' => $id,
            'nombre' => $nombre !== '' ? $nombre : ($nombres[$id] ?? ''),
            'estado' => $estadoMp,
            'monto' => round((float) ($s['auto_recurring']['transaction_amount'] ?? 0), 2),
            'alta' => (string) ($s['date_created'] ?? ''),
            'proximoCobro' => $estadoMp === 'authorized' ? (string) ($s['next_payment_date'] ?? '') : '',
            'receptor' => $receptor,
            'receptorOrigen' => $origen,
            'excluida' => isset($ajustes['excluidas'][$id]),
            'ultimaFactura' => sus_ultima_factura($id, $registro),
        ];
    }
    usort($suscripciones, function ($a, $b) { return strcmp($b['alta'], $a['alta']); });

    return [
        'entorno' => $config['entorno'],
        'activa' => $ajustes['activa'],
        'desde' => $ajustes['desde'],
        'ultimaCorrida' => $estado['ultimaCorrida'] ?? null,
        'diasAtras' => SUS_DIAS_ATRAS,
        'suscripciones' => $suscripciones,
        'cobros' => array_reverse($cobros),
    ];
}
