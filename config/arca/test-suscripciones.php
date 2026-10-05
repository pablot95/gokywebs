<?php
/**
 * config/arca/test-suscripciones.php — la facturación automática de las
 * suscripciones (suscripciones.php), sin tocar Mercado Pago ni ARCA: los dos
 * se reemplazan por dobles con datos fijos. Solo CLI:
 *   php config/arca/test-suscripciones.php
 *
 * Lo que fija:
 *  1. El período de cada mensualidad y la fecha argentina del cobro.
 *  2. Qué pagos son cobros de una suscripción de esta cuenta.
 *  3. Pausada no emite; activa emite solo lo cobrado desde la activación.
 *  4. Correrlo de más no factura dos veces.
 *  5. A quién se le factura: lo cargado, la última factura de la suscripción o consumidor final.
 *  6. Las suscripciones excluidas y los cobros ya facturados a mano no se facturan.
 *  7. Si ARCA autoriza pero la respuesta no llega, la próxima vez se recupera sin emitir otra.
 *  8. Un registro ilegible frena todo; simular no escribe nada.
 *  9. Lo que muestra el admin de cada cobro.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/suscripciones.php';

$fallas = 0;
$casos = 0;
function caso($nombre, $ok, $detalle = '')
{
    global $fallas, $casos;
    $casos++;
    if ($ok) return;
    $fallas++;
    echo "FALLA: $nombre" . ($detalle !== '' ? "\n       " . (is_string($detalle) ? $detalle : json_encode($detalle, JSON_UNESCAPED_UNICODE)) : '') . "\n";
}

/* ── Dobles ───────────────────────────────────────────────────────────── */

const YO = '111';

function pago($id, $suscripcion, $monto, $aprobado, array $extra = [])
{
    return array_replace_recursive([
        'id' => $id,
        'status' => 'approved',
        'collector_id' => (int) YO,
        'transaction_amount' => $monto,
        'transaction_amount_refunded' => 0,
        'date_approved' => $aprobado,
        'payer' => ['first_name' => 'Ana', 'last_name' => 'Pérez ' . $suscripcion, 'email' => 'ana@example.com',
            'identification' => ['type' => 'CUIT', 'number' => '20111111112']],
        'point_of_interaction' => ['type' => 'SUBSCRIPTIONS', 'transaction_data' => [
            'subscription_id' => $suscripcion, 'subscription_sequence' => ['number' => 1], 'billing_date' => substr($aprobado, 0, 10),
        ]],
    ], $extra);
}

/**
 * Mercado Pago de mentira: devuelve los pagos aprobados desde begin_date (o
 * todos, con $ignorarFecha, para ver que la fecha de activación se respeta
 * aunque la API devuelva de más).
 */
function mp_doble(array &$pagos, array $suscripciones = [], $ignorarFecha = false)
{
    return function ($ruta) use (&$pagos, $suscripciones, $ignorarFecha) {
        if ($ruta === '/users/me') return ['id' => (int) YO];
        if (strpos($ruta, '/preapproval/search') === 0) {
            return ['results' => $suscripciones, 'paging' => ['total' => count($suscripciones)]];
        }
        if (strpos($ruta, '/v1/payments/search') === 0) {
            parse_str((string) parse_url($ruta, PHP_URL_QUERY), $q);
            $desde = $ignorarFecha ? 0 : strtotime($q['begin_date']);
            $lista = array_values(array_filter($pagos, function ($p) use ($desde) {
                return $p['status'] === 'approved' && strtotime($p['date_approved']) >= $desde;
            }));
            return ['results' => array_slice($lista, (int) $q['offset'], 100), 'paging' => ['total' => count($lista)]];
        }
        throw new RuntimeException("Ruta no esperada: $ruta");
    };
}

/** ARCA de mentira: numera, guarda lo autorizado y puede fallar a propósito. */
class ArcaDoble
{
    public $autorizados = [];
    public $ultimo = 500;
    public $modo = 'ok';   // 'ok' | 'sin_respuesta' (autoriza y tira) | 'rechazo' (tira sin autorizar)
    public $modos = [];    // si tiene algo, un modo por pedido, en orden (después vuelve a $modo)
    public $pedidos = 0;
    public $alPedir = null; // se llama al recibir cada pedido, antes de autorizarlo

    public function ultimoComprobante($pv, $tipo)
    {
        return $this->ultimo;
    }

    public function consultarComprobante($pv, $tipo, $numero)
    {
        $c = $this->autorizados[$numero] ?? null;
        return $c ? ['numero' => $numero, 'fecha' => $c['fecha'], 'total' => $c['total'], 'documento' => $c['numeroDocumento'],
            'cae' => $c['cae'], 'caeVence' => $c['caeVence'], 'resultado' => 'A', 'emitido' => $c['fecha']] : null;
    }

    public function emitirFacturaC(array $f)
    {
        $this->pedidos++;
        if ($this->alPedir) ($this->alPedir)($f);
        $modo = $this->modos ? array_shift($this->modos) : $this->modo;
        if ($modo === 'rechazo') throw new ArcaError('10015: rechazado a propósito');
        $numero = ++$this->ultimo;
        $emitida = [
            'puntoVenta' => $f['puntoVenta'], 'tipoComprobante' => 11, 'numero' => $numero, 'fecha' => $f['fecha'],
            'total' => round((float) $f['total'], 2), 'concepto' => $f['concepto'], 'tipoDocumento' => $f['tipoDocumento'],
            'numeroDocumento' => (string) $f['numeroDocumento'], 'condicionIvaReceptor' => $f['condicionIvaReceptor'],
            'servicioDesde' => $f['servicioDesde'], 'servicioHasta' => $f['servicioHasta'], 'vencimientoPago' => $f['vencimientoPago'],
            'cae' => '7' . str_pad((string) $numero, 13, '0', STR_PAD_LEFT), 'caeVence' => '20991231', 'observaciones' => '',
        ];
        $this->autorizados[$numero] = $emitida;
        if ($modo === 'sin_respuesta') throw new ArcaError('Fallo la conexion con ARCA: timeout');
        return $emitida;
    }
}

function config_prueba()
{
    $dir = sys_get_temp_dir() . '/test-suscripciones-' . getmypid() . '-' . mt_rand();
    mkdir($dir);
    return [
        'entorno' => 'homologacion',
        'puntoVenta' => 10,
        'registro' => "$dir/emitidas.json",
        'condicionesIva' => "$dir/no-existe.json",
        'automatica' => "$dir/automatica.json",
        'automaticaEstado' => "$dir/estado.json",
        '_dir' => $dir,
    ];
}

function activar(array $config, $desde, array $extra = [])
{
    json_guardar_atomico($config['automatica'], $extra + ['activa' => true, 'desde' => $desde], 'ajustes de prueba');
}

function limpiar(array $config)
{
    foreach (glob($config['_dir'] . '/*') as $f) @unlink($f);
    @rmdir($config['_dir']);
}

$S1 = 'aaaa1111aaaa1111aaaa1111aaaa1111';
$S2 = 'bbbb2222bbbb2222bbbb2222bbbb2222';

/* ── 1. Período y fecha del cobro ─────────────────────────────────────── */

caso('mensualidad del 26-sep: hasta el 25-oct', sus_periodo('2026-09-26') === ['20260926', '20261025']);
caso('31 de enero: hasta el 27 de febrero (el mes siguiente cobra el 28)', sus_periodo('2027-01-31') === ['20270131', '20270227']);
caso('diciembre pasa de año', sus_periodo('2026-12-15') === ['20261215', '20270114']);
$c = sus_cobro_de_pago(pago('9', $S1, 25000, '2026-09-26T23:30:00.000-04:00'), YO);
caso('un cobro a las 23:30 de MP (-04:00) es del día siguiente en Argentina', $c && $c['dia'] === '2026-09-27', $c);
caso('el instante del cobro queda en UTC', $c && $c['aprobado'] === '2026-09-27T03:30:00Z', $c);

/* ── 2. Qué pagos son cobros de suscripción ───────────────────────────── */

caso('una transferencia no es un cobro de suscripción',
    sus_cobro_de_pago(pago('1', $S1, 100, '2026-09-26T10:00:00.000-04:00', ['point_of_interaction' => ['type' => 'PSP_TRANSFER']]), YO) === null);
caso('un cobro que cobra otra cuenta no es de Pablo',
    sus_cobro_de_pago(pago('2', $S1, 100, '2026-09-26T10:00:00.000-04:00', ['collector_id' => 999]), YO) === null);
caso('un cobro rechazado no se factura',
    sus_cobro_de_pago(pago('3', $S1, 100, '2026-09-26T10:00:00.000-04:00', ['status' => 'rejected']), YO) === null);

/* ── 3 y 4. Pausada, activa, desde cuándo, idempotencia ───────────────── */

$config = config_prueba();
$hace3 = gmdate('Y-m-d\TH:i:s', strtotime('-3 days')) . '.000-04:00';
$hace1 = gmdate('Y-m-d\TH:i:s', strtotime('-1 days')) . '.000-04:00';
$pagos = [pago('101', $S1, 25000, $hace3), pago('102', $S2, 20000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();

$r = sus_correr($config, $arca, $mp);
caso('sin activar no emite nada', !$r['emitidas'] && $arca->pedidos === 0 && $r['aviso'] !== '', $r);

activar($config, gmdate('c', strtotime('-2 days')));
$r = sus_correr($config, $arca, $mp);
$registro = registro_leer($config);
caso('activa desde hace 2 días: factura solo el cobro de ayer', count($r['emitidas']) === 1 && isset($registro['mp-cobro-102']) && !isset($registro['mp-cobro-101']), $r);
$f = $registro['mp-cobro-102'] ?? [];
caso('la factura lleva la suscripción, el pago y el origen', ($f['preapprovalId'] ?? '') === $S2 && ($f['mpPagoId'] ?? '') === '102' && ($f['origen'] ?? '') === 'automatica', $f);
caso('sin datos cargados sale a consumidor final', ($f['receptor']['tipoDocumento'] ?? 0) === 99 && ($f['tipoDocumento'] ?? 0) === 99, $f);
caso('descripción, condición de venta y período de la mensualidad',
    ($f['descripcion'] ?? '') === SUS_DESCRIPCION && ($f['condicionVenta'] ?? '') === 'Mercado Pago'
    && ($f['servicioDesde'] ?? '') === sus_periodo(substr(sus_fecha_local($hace1)->format('Y-m-d'), 0, 10))[0], $f);
caso('vence el mismo día de la factura', ($f['vencimientoPago'] ?? '') === ($f['fecha'] ?? 'x'), $f);
caso('la clave del cliente es la de la suscripción en Mantenimiento', ($f['clienteId'] ?? '') === 'mantenimiento:' . $S2, $f);

$r = sus_correr($config, $arca, $mp);
caso('correrlo de nuevo no factura otra vez', !$r['emitidas'] && $arca->pedidos === 1, $r);

$arcaDeMas = new ArcaDoble();
$r = sus_correr($config, $arcaDeMas, mp_doble($pagos, [], true));
caso('aunque Mercado Pago devuelva cobros de antes de la activación, no se facturan',
    !$r['emitidas'] && $arcaDeMas->pedidos === 0 && !isset(registro_leer($config)['mp-cobro-101']), $r);

json_guardar_atomico($config['automatica'], ['activa' => false, 'desde' => gmdate('c', strtotime('-2 days'))], 'x');
$pagos[] = pago('103', $S1, 25000, gmdate('Y-m-d\TH:i:s') . '.000-00:00');
$r = sus_correr($config, $arca, $mp);
caso('pausada no emite aunque haya cobros nuevos', !$r['emitidas'] && $arca->pedidos === 1, $r);
limpiar($config);

/* ── 5. A quién se le factura ─────────────────────────────────────────── */

$config = config_prueba();
$pagos = [pago('201', $S1, 25000, $hace1), pago('202', $S2, 30000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
$exento = receptor_normalizar(['tipoDocumento' => 80, 'documento' => '20-39148294-3', 'condicionIva' => 4, 'nombre' => 'Estudio Uno SRL']);
activar($config, gmdate('c', strtotime('-2 days')), ['receptores' => [$S1 => $exento]]);
// Una factura a mano de la otra suscripción, hecha desde su fila (con el preapprovalId), a un CUIT.
registro_guardar($config, ['manual-1' => [
    'puntoVenta' => 10, 'numero' => 480, 'total' => 1000, 'emitidaEl' => gmdate('c', strtotime('-20 days')), 'preapprovalId' => $S2,
    'receptor' => receptor_normalizar(['tipoDocumento' => 96, 'documento' => '30111222', 'condicionIva' => 5, 'nombre' => 'Juan Gómez']),
]]);
$r = sus_correr($config, $arca, $mp);
$registro = registro_leer($config);
caso('lo cargado en el admin manda (CUIT exento)',
    ($registro['mp-cobro-201']['numeroDocumento'] ?? '') === '20391482943' && ($registro['mp-cobro-201']['condicionIvaReceptor'] ?? 0) === 4, $registro['mp-cobro-201'] ?? $r);
caso('sin nada cargado, repite los datos de la última factura de esa suscripción (DNI)',
    ($registro['mp-cobro-202']['tipoDocumento'] ?? 0) === 96 && ($registro['mp-cobro-202']['receptor']['nombre'] ?? '') === 'Juan Gómez', $registro['mp-cobro-202'] ?? $r);
caso('el nombre del receptor queda como cliente', ($registro['mp-cobro-201']['cliente'] ?? '') === 'Estudio Uno SRL');
limpiar($config);

$config = config_prueba();
$pagos = [pago('251', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')), ['receptores' => [$S1 => ['tipoDocumento' => 80, 'numeroDocumento' => '20391482944', 'condicionIvaId' => 4, 'nombre' => 'X']]]);
$r = sus_correr($config, $arca, $mp);
caso('un CUIT cargado con el dígito verificador mal no se emite: queda el error', !$r['emitidas'] && $arca->pedidos === 0 && count($r['errores']) === 1, $r);
$estado = sus_estado($config);
caso('el error queda anotado para el admin', isset($estado['errores']['mp-cobro-251']), $estado);
limpiar($config);

$config = config_prueba();
$pagos = [pago('261', $S1, 25000, $hace1, ['payer' => ['first_name' => '', 'last_name' => '']])];
$mp = mp_doble($pagos, [['id' => $S1, 'status' => 'authorized', 'collector_id' => (int) YO, 'payer_first_name' => 'Laura', 'payer_last_name' => 'Díaz']]);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$r = sus_correr($config, $arca, $mp);
caso('si Mercado Pago no trae el nombre del que paga, se usa el de la suscripción',
    ($r['emitidas'][0]['nombre'] ?? '') === 'Laura Díaz' && (registro_leer($config)['mp-cobro-261']['cliente'] ?? '') === 'Laura Díaz', $r);
limpiar($config);

/* ── 6. Excluidas y facturadas a mano ─────────────────────────────────── */

$config = config_prueba();
$pagos = [pago('301', $S1, 25000, $hace1), pago('302', $S2, 20000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')), ['excluidas' => [$S1 => gmdate('c')]]);
registro_guardar($config, ['manual-2' => [
    'puntoVenta' => 10, 'numero' => 499, 'total' => 20000, 'emitidaEl' => gmdate('c'), 'preapprovalId' => $S2,
    'receptor' => receptor_normalizar(['tipoDocumento' => 99]),
]]);
$r = sus_correr($config, $arca, $mp);
caso('la suscripción excluida no se factura sola', !isset(registro_leer($config)['mp-cobro-301']), $r);
caso('el cobro que Pablo ya facturó a mano desde la fila no se vuelve a facturar',
    !isset(registro_leer($config)['mp-cobro-302']) && count($r['aManoDetectadas']) === 1 && $arca->pedidos === 0, $r);
limpiar($config);

/* ── 7. ARCA sin respuesta y rechazos ─────────────────────────────────── */

$config = config_prueba();
$pagos = [pago('401', $S1, 25000, $hace1), pago('402', $S2, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$arca->modo = 'sin_respuesta';
$r = sus_correr($config, $arca, $mp);
caso('si ARCA no contesta, queda el error y el intento anotado', count($r['errores']) === 2 && count(sus_estado($config)['intentos']) === 2, $r);
caso('...aunque ARCA sí las autorizó', count($arca->autorizados) === 2);
$arca->modo = 'ok';
$r = sus_correr($config, $arca, $mp);
$registro = registro_leer($config);
caso('la corrida siguiente las recupera de ARCA sin emitir otras',
    count($arca->autorizados) === 2 && $arca->pedidos === 2 && count($r['emitidas']) === 2
    && array_column($r['emitidas'], 'resultado') === ['recuperada', 'recuperada'], $r);
caso('cada cobro se queda con su número (mismo importe, mismo día, consumidor final)',
    ($registro['mp-cobro-401']['numero'] ?? 0) === 501 && ($registro['mp-cobro-402']['numero'] ?? 0) === 502, $registro);
caso('se limpian los intentos y los errores', !sus_estado($config)['intentos'] && !sus_estado($config)['errores']);
limpiar($config);

$config = config_prueba();
$pagos = [pago('451', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$arca->modo = 'rechazo';
sus_correr($config, $arca, $mp);
$arca->modo = 'ok';
$r = sus_correr($config, $arca, $mp);
caso('un rechazo de ARCA se reintenta en la corrida siguiente y sale una sola',
    count($arca->autorizados) === 1 && ($r['emitidas'][0]['resultado'] ?? '') === 'emitida', $r);
limpiar($config);

// A no llegó a ARCA y B, del mismo importe y también a consumidor final, salió
// en la misma corrida con el número siguiente: al verificar A, la factura de B
// coincide en todo, pero ya es de B.
$config = config_prueba();
$pagos = [pago('471', $S1, 25000, $hace1), pago('472', $S2, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$arca->modos = ['rechazo', 'ok'];
sus_correr($config, $arca, $mp);
$r = sus_correr($config, $arca, $mp);
$registro = registro_leer($config);
caso('al verificar un intento no se toma una factura que ya es de otro cobro',
    ($registro['mp-cobro-472']['numero'] ?? 0) === 501 && ($registro['mp-cobro-471']['numero'] ?? 0) === 502 && count($arca->autorizados) === 2, $registro);
limpiar($config);

// Entre el intento y la verificación alguien emitió por fuera del admin: una del
// mismo importe a otro receptor, otra a consumidor final por otro importe y otra
// igual en todo pero con otra fecha.
$config = config_prueba();
$pagos = [pago('481', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$arca->modo = 'rechazo';
sus_correr($config, $arca, $mp);
$arca->modo = 'ok';
$porFuera = ['puntoVenta' => 10, 'fecha' => registro_fecha_hoy(), 'concepto' => 2, 'condicionIvaReceptor' => 5,
    'servicioDesde' => '', 'servicioHasta' => '', 'vencimientoPago' => ''];
$arca->emitirFacturaC($porFuera + ['total' => 25000, 'tipoDocumento' => 96, 'numeroDocumento' => '30111222']);
$arca->emitirFacturaC($porFuera + ['total' => 18000, 'tipoDocumento' => 99, 'numeroDocumento' => '0']);
$arca->emitirFacturaC(['fecha' => gmdate('Ymd', strtotime('-1 day')), 'total' => 25000, 'tipoDocumento' => 99, 'numeroDocumento' => '0'] + $porFuera);
$r = sus_correr($config, $arca, $mp);
caso('al verificar un intento no se toma una factura de otro receptor, importe o fecha',
    (registro_leer($config)['mp-cobro-481']['numero'] ?? 0) === 504, registro_leer($config)['mp-cobro-481'] ?? $r);
limpiar($config);

$config = config_prueba();
$pagos = [pago('491', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$enDisco = null;
$arca->alPedir = function () use ($config, &$enDisco) {
    $enDisco = json_decode((string) @file_get_contents($config['automaticaEstado']), true)['intentos']['mp-cobro-491'] ?? null;
};
sus_correr($config, $arca, $mp);
caso('el intento queda guardado en disco antes de pedir el CAE (por si el proceso se corta ahí)',
    is_array($enDisco) && ($enDisco['anterior'] ?? null) === 500, $enDisco);
limpiar($config);

// Un intento que se verifica mucho después (el modal, semanas más tarde): entre
// medio salieron 25 facturas que ya están en el registro; esas no se consultan.
$arca = new ArcaDoble();
$cf = ['puntoVenta' => 10, 'fecha' => registro_fecha_hoy(), 'concepto' => 2, 'tipoDocumento' => 99, 'numeroDocumento' => '0',
    'condicionIvaReceptor' => 5, 'servicioDesde' => '', 'servicioHasta' => '', 'vencimientoPago' => ''];
$intento = ['anterior' => 500, 'fecha' => registro_fecha_hoy(), 'total' => 20000, 'numeroDocumento' => '0', 'receptor' => receptor_normalizar(['tipoDocumento' => 99])];
$arca->modo = 'sin_respuesta';
try { $arca->emitirFacturaC($cf + ['total' => 20000]); } catch (ArcaError $e) {}
$arca->modo = 'ok';
$registro = [];
for ($i = 1; $i <= 25; $i++) $registro["m$i"] = $arca->emitirFacturaC($cf + ['total' => 1000 + $i]);
$r = sus_recuperar_intento($arca, 10, $intento, $registro);
caso('verificar un intento viejo: las facturas del registro no cuentan para el tope de 20', ($r['numero'] ?? 0) === 501, $r);
for ($i = 1; $i <= 20; $i++) unset($registro["m$i"]);
$tiro = false;
try { sus_recuperar_intento($arca, 10, $intento, $registro); } catch (RuntimeException $e) { $tiro = true; }
caso('...pero con más de 20 desconocidas para consultar, pide revisarlo en ARCA', $tiro);

$config = config_prueba();
$pagos = [pago('461', $S1, 25000, $hace1, ['transaction_amount_refunded' => 25000])];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$r = sus_correr($config, $arca, $mp);
caso('un cobro con devolución no se factura solo', $arca->pedidos === 0 && count($r['errores']) === 1, $r);
limpiar($config);

$config = config_prueba();
$pagos = [];
for ($i = 1; $i <= 12; $i++) $pagos[] = pago((string) (600 + $i), $S1, 1000 + $i, $hace1);
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
$r = sus_correr($config, $arca, $mp);
caso('no más de ' . SUS_MAX_POR_CORRIDA . ' por corrida; el resto queda para la próxima',
    count($r['emitidas']) === SUS_MAX_POR_CORRIDA && $r['quedan'] === 2, $r['quedan']);
limpiar($config);

/* ── 8. Registro ilegible y simulación ────────────────────────────────── */

$config = config_prueba();
$pagos = [pago('701', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$arca = new ArcaDoble();
activar($config, gmdate('c', strtotime('-2 days')));
file_put_contents($config['registro'], '{"mp-cobro-1": {"numero": 1');
$tiro = false;
try {
    sus_correr($config, $arca, $mp);
} catch (RuntimeException $e) {
    $tiro = true;
}
caso('un registro ilegible frena todo en vez de tomarse como vacío', $tiro && $arca->pedidos === 0);
limpiar($config);

$config = config_prueba();
$pagos = [pago('801', $S1, 25000, $hace1)];
$mp = mp_doble($pagos);
$r = sus_correr($config, null, $mp, ['simular' => true, 'desde' => gmdate('Y-m-d', strtotime('-5 days'))]);
caso('simular dice qué facturaría', count($r['emitidas']) === 1 && $r['emitidas'][0]['numero'] === null, $r);
caso('...y no escribe nada', !file_exists($config['registro']) && !file_exists($config['automaticaEstado']));
limpiar($config);

/* ── 9. Lo que ve el admin ────────────────────────────────────────────── */

$config = config_prueba();
$hace10 = gmdate('Y-m-d\TH:i:s', strtotime('-10 days')) . '.000-04:00';
$pagos = [pago('901', $S1, 25000, $hace10), pago('902', $S2, 20000, $hace1), pago('903', $S1, 25000, $hace1)];
$suscripciones = [
    ['id' => $S1, 'status' => 'authorized', 'collector_id' => (int) YO, 'payer_first_name' => 'Ana', 'payer_last_name' => 'Pérez',
        'auto_recurring' => ['transaction_amount' => 25000], 'date_created' => '2026-08-01T10:00:00.000-04:00', 'next_payment_date' => '2026-10-26T10:00:00.000-04:00'],
    ['id' => 'cccc', 'status' => 'authorized', 'collector_id' => 999, 'auto_recurring' => ['transaction_amount' => 16]],
];
$mp = mp_doble($pagos, $suscripciones);
activar($config, gmdate('c', strtotime('-2 days')), ['activa' => false]);
registro_guardar($config, ['manual-3' => ['puntoVenta' => 10, 'numero' => 490, 'total' => 25000, 'emitidaEl' => gmdate('c', strtotime('-9 days'))]]);
$p = sus_panorama($config, $mp);
$porId = array_column($p['cobros'], null, 'id');
caso('cobro anterior a la activación: "anterior", con la pista de la factura a mano del mismo importe',
    ($porId['901']['estado'] ?? '') === 'anterior' && ($porId['901']['pista']['numero'] ?? 0) === 490, $porId['901'] ?? $p);
caso('cobro posterior con la facturación pausada: "pausada"', ($porId['902']['estado'] ?? '') === 'pausada', $porId['902'] ?? $p);
caso('solo las suscripciones que cobra esta cuenta', count($p['suscripciones']) === 1 && $p['suscripciones'][0]['id'] === $S1, $p['suscripciones']);
caso('cada suscripción dice a quién se factura y de dónde sale', ($p['suscripciones'][0]['receptorOrigen'] ?? '') === 'final');
caso('los cobros, del más nuevo al más viejo', ($p['cobros'][0]['id'] ?? '') !== '901');
limpiar($config);

// Dos mensualidades iguales con tres días de diferencia y una sola factura a mano, hecha al rato del segundo cobro.
$config = config_prueba();
$hace4 = gmdate('Y-m-d\TH:i:s', strtotime('-4 days')) . '.000-00:00';
$recien = gmdate('Y-m-d\TH:i:s', strtotime('-1 days')) . '.000-00:00';
$pagos = [pago('951', $S1, 25000, $hace4), pago('952', $S2, 25000, $recien)];
$mp = mp_doble($pagos);
registro_guardar($config, ['manual-4' => ['puntoVenta' => 10, 'numero' => 495, 'total' => 25000, 'emitidaEl' => gmdate('c', strtotime('-1 days') + 900)]]);
$porId = array_column(sus_panorama($config, $mp)['cobros'], null, 'id');
caso('una factura a mano se sugiere solo para el cobro más cercano',
    ($porId['952']['pista']['numero'] ?? 0) === 495 && ($porId['951']['pista'] ?? null) === null, $porId);
limpiar($config);

// Facturar a mano un cobro desde la lista: qué facturas hay que confirmar antes.
$cobro = sus_cobro_de_pago(pago('961', $S1, 20000, $hace10), YO);
$cerca = gmdate('c', strtotime('-3 days'));
$parecidas = sus_facturas_parecidas([
    'a-mano' => ['numero' => 1, 'total' => 20000, 'cae' => 'x', 'emitidaEl' => $cerca],
    'de-la-misma' => ['numero' => 2, 'total' => 20000, 'cae' => 'x', 'emitidaEl' => $cerca, 'preapprovalId' => $S1],
    'de-otra' => ['numero' => 3, 'total' => 20000, 'cae' => 'x', 'emitidaEl' => $cerca, 'preapprovalId' => $S2],
    'automatica' => ['numero' => 4, 'total' => 20000, 'cae' => 'x', 'emitidaEl' => $cerca, 'mpPagoId' => '777'],
    'vieja' => ['numero' => 5, 'total' => 20000, 'cae' => 'x', 'emitidaEl' => gmdate('c', strtotime('-40 days'))],
    'otro-importe' => ['numero' => 6, 'total' => 25000, 'cae' => 'x', 'emitidaEl' => $cerca],
], $cobro);
caso('parecidas: del modal, mismo importe, cerca del cobro, sin otra suscripción',
    array_keys($parecidas) === ['a-mano', 'de-la-misma'], array_keys($parecidas));

echo $fallas ? "\n$fallas de $casos casos fallaron.\n" : "OK: $casos casos.\n";
exit($fallas ? 1 : 0);
