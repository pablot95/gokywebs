<?php
/**
 * Plazos de pago (Pablo, 23-nov): aviso de 48 h, «dar de baja» a Pablo y el aviso de baja al
 * cliente al anotarla en Bajas. Solo CLI, sin red ni disco.
 *   php wabot/test-plazos-pago.php
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/cobros-rechazados.php';
require_once __DIR__ . '/webs-bajas.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
$GLOBALS['WABOT_TEST_COBRO_LISTAS'] = [];
$GLOBALS['WABOT_TEST_POR_FUERA'] = [];
$GLOBALS['WABOT_TEST_BAJAS'] = [];
$GLOBALS['WABOT_TEST_VENCIDOS'] = [];
$GLOBALS['WABOT_TEST_PF_PAGADO'] = [];
$cfg = wabot_config_load();
foreach (['renovacion_por_fuera', 'cobro_rechazado', 'cobro_rechazado_ultimo', 'suscripcion_cancelada', 'pago_recibido', 'aviso_pago_48h', 'servicio_dado_de_baja'] as $k) {
    $cfg['plantillas'][$k] = array_merge((array)$cfg['plantillas'][$k], ['activa' => true, 'automatico' => true]);
}
$envios = [];
$enviar = function ($clave, $f, $valores, $plantilla) use (&$envios) { $envios[] = [$plantilla, $clave, $valores]; return true; };
$avisos = [];
$avisar = function ($t, $l, $c) use (&$avisos) { $avisos[] = [$t, implode("\n", $l), $c]; return true; };
$de = function ($p) use (&$envios) { return array_values(array_filter($envios, function ($e) use ($p) { return $e[0] === $p; })); };
$titulos = function () use (&$avisos) { return array_column($avisos, 0); };

echo "=== Las plantillas ===\n";
$p = wabot_config_load()['plantillas'];
caso('último intento: la de las 48 h con transferencia', ($p['cobro_rechazado_ultimo']['nombre'] ?? '') === 'cobro_rechazado_final_48h'
    && strpos($p['cobro_rechazado_ultimo']['texto'], '48 hs') !== false && strpos($p['cobro_rechazado_ultimo']['texto'], 'transferencia') !== false);
caso('aviso de 48 h: nombre, negocio, monto', ($p['aviso_pago_48h']['params'] ?? []) === ['nombre', 'negocio', 'monto'] && strpos($p['aviso_pago_48h']['texto'], 'se da de baja el servicio') !== false);
caso('servicio dado de baja: nombre y negocio', ($p['servicio_dado_de_baja']['params'] ?? []) === ['nombre', 'negocio']);

echo "\n=== Pagan por afuera: recordatorio → 7 días → 48 h → dar de baja ===\n";
$fila = function ($pagado = '') {
    return wabot_renovacion_fila(['id' => 'clientes:AAA', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol',
        'monto' => 20000, 'dia' => 25, 'desde' => '2026-10-25', 'pagado' => $pagado]);
};
$estado = function ($ts, $pagado = '') use ($fila) {
    return ['lista' => [$fila($pagado)], 'sync_ts' => $ts, 'enviados' => [], 'aviso_vieja_ts' => 0, 'pagos_visto' => [], 'pagos_cola' => [], 'pagos_init' => true, 'plazos' => []];
};
$d25 = $ar('2026-11-25 10:30:00');
$r = wabot_renovacion_correr($cfg, $d25, $estado($d25), $enviar, $avisar);
caso('el día del cobro: recordatorio y arranca el plazo', count($de('renovacion_por_fuera')) === 1 && ($r['estado']['plazos']['clientes:AAA']['cobro'] ?? '') === '2026-11-25');

$e = $r['estado'];
$envios = []; $avisos = [];
$e['sync_ts'] = $ar('2026-12-01 10:00:00');
$r = wabot_renovacion_correr($cfg, $ar('2026-12-01 11:00:00'), $e, $enviar, $avisar);
caso('a los 6 días todavía nada', !$envios && !$avisos);

$e = $r['estado']; $e['sync_ts'] = $ar('2026-12-02 10:00:00');
$r = wabot_renovacion_correr($cfg, $ar('2026-12-02 11:00:00'), $e, $enviar, $avisar);
$a48 = $de('aviso_pago_48h');
caso('a los 7 días sin pagar: aviso de 48 h al cliente', count($a48) === 1 && $a48[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$20.000'], json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('y a Pablo le avisa que salió', $titulos() === ['⏳ Aviso de 48 h para pagar'], json_encode($titulos(), JSON_UNESCAPED_UNICODE));

$e = $r['estado']; $envios = []; $avisos = [];
$e['sync_ts'] = $ar('2026-12-03 10:00:00');
$r = wabot_renovacion_correr($cfg, $ar('2026-12-03 18:00:00'), $e, $enviar, $avisar);
caso('a las 31 h no vence ni repite', !$envios && !$avisos);

$e = $r['estado']; $e['sync_ts'] = $ar('2026-12-04 10:00:00');
$r = wabot_renovacion_correr($cfg, $ar('2026-12-04 11:30:00'), $e, $enviar, $avisar);
caso('a las 48 h sin pagar: «dar de baja» a Pablo', $titulos() === ['⛔ Venció el plazo de 48 h: dar de baja'] && strpos($avisos[0][1], 'Panadería Sol') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));
caso('queda en vencidos para el aviso de la baja', isset($GLOBALS['WABOT_TEST_VENCIDOS']['clientes:AAA']));
$avisos = [];
$e = $r['estado']; $e['sync_ts'] = $ar('2026-12-05 10:00:00');
wabot_renovacion_correr($cfg, $ar('2026-12-05 11:30:00'), $e, $enviar, $avisar);
caso('una sola vez', !$avisos);

$envios = []; $avisos = [];
$e = wabot_renovacion_correr($cfg, $d25, $estado($d25), $enviar, $avisar)['estado'];
$e['lista'] = [$fila('2026-11-25')]; $e['sync_ts'] = $ar('2026-12-02 10:00:00'); $envios = []; $avisos = [];
$r = wabot_renovacion_correr($cfg, $ar('2026-12-02 11:00:00'), $e, $enviar, $avisar);
caso('si Pablo marcó «Pagó» ese cobro, el plazo se corta', !$de('aviso_pago_48h') && !isset($r['estado']['plazos']['clientes:AAA']));

$envios = [];
$sinChat = $estado($d25); $sinChat['lista'][0]['tel'] = '';
$r = wabot_renovacion_correr($cfg, $d25, $sinChat, $enviar, $avisar);
caso('si el recordatorio no le llegó, no arranca el plazo', !isset($r['estado']['plazos']['clientes:AAA']));

echo "\n=== Web en Bajas: no le llega nada de pagos ===\n";
$GLOBALS['WABOT_TEST_BAJAS'] = [['telefono' => '+54 9 11 4444-5555', 'reactivada' => '']];
caso('la plantilla no sale («baja»)', wabot_pagos_plantilla_cliente(['tel' => '1144445555'], 'renovacion_por_fuera', [], $cfg, '', $enviar) === 'baja');
$GLOBALS['WABOT_TEST_BAJAS'] = [['telefono' => '1144445555', 'reactivada' => '2026-11-30']];
caso('reactivada: vuelve a salir', wabot_pagos_plantilla_cliente(['tel' => '1144445555'], 'renovacion_por_fuera', [], $cfg, '', $enviar) === 'ok');
$GLOBALS['WABOT_TEST_BAJAS'] = [];

echo "\n=== Suscripción: último intento → 48 h → dar de baja ===\n";
$GLOBALS['WABOT_TEST_VENCIDOS'] = [];
$f1 = wabot_cobro_rech_fila(['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => true]);
$mp = function ($cobrado = false, $estadoSub = 'authorized', $extra = []) {
    return function ($ruta) use ($cobrado, $estadoSub, $extra) {
        if ($ruta === '/users/me') return ['id' => 999];
        if (strpos($ruta, '/v1/payments/search') === 0) return ['results' => []];
        if (strpos($ruta, '/preapproval/search') === 0) return ['paging' => ['total' => 1], 'results' => array_merge([
            ['id' => 'S1aaaaaa', 'collector_id' => 999, 'status' => $estadoSub, 'date_created' => '2026-09-10T16:00:00.000-04:00', 'summarized' => ['semaphore' => 'green']],
        ], $extra)];
        if (strpos($ruta, 'preapproval_id=S1aaaaaa') !== false) return ['results' => [
            ['id' => 7033861876, 'status' => $cobrado ? 'processed' : 'scheduled', 'debit_date' => '2026-11-10T16:00:00.000-04:00',
             'payment' => ['status' => $cobrado ? 'approved' : 'rejected']],
            ['id' => 7032750000, 'status' => 'processed', 'debit_date' => '2026-10-10T16:00:00.000-04:00', 'payment' => ['status' => 'approved']],
        ]];
        throw new RuntimeException('ruta no esperada ' . $ruta);
    };
};
$base = function ($ts) use ($f1) {
    return ['lista' => [$f1], 'sync_ts' => $ts, 'enviados' => [], 'aviso_vieja_ts' => 0, 'conocidos' => [], 'canceladas' => [],
        'clientes' => ['ultimo:7033861876' => ['ts' => $ar = $ts, 'res' => 'ok', 'pre' => 'S1aaaaaa', 'id' => 'clientes:AAA', 'desde' => '2026-11-10', 'monto' => 20000.0]]];
};
$t0 = $ar('2026-11-20 11:00:00');
$avisos = [];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-11-21 15:00:00'), $base($t0), $mp(), $enviar, $avisar);
caso('a las 28 h del último intento nada', !in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true));
$r = wabot_cobro_rech_correr($cfg, $ar('2026-11-22 12:00:00'), $base($t0), $mp(), $enviar, $avisar);
caso('a las 49 h sin pagar: «dar de baja» a Pablo', in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true)
    && !empty($r['estado']['clientes']['ultimo:7033861876']['vencido_ts']) && isset($GLOBALS['WABOT_TEST_VENCIDOS']['clientes:AAA']), json_encode($titulos(), JSON_UNESCAPED_UNICODE));
$avisos = [];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-11-22 12:00:00'), $base($t0), $mp(true), $enviar, $avisar);
caso('si MP lo terminó cobrando, se cierra sin aviso', !$avisos && !empty($r['estado']['clientes']['ultimo:7033861876']['cerrado']));
$GLOBALS['WABOT_TEST_PF_PAGADO'] = ['clientes:AAA' => '2026-11-10'];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-11-22 12:00:00'), $base($t0), $mp(false, 'cancelled'), $enviar, $avisar);
caso('si pasó a pagar por afuera y Pablo le marcó el pago, se cierra', !in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true)
    && !empty($r['estado']['clientes']['ultimo:7033861876']['cerrado']), json_encode($titulos(), JSON_UNESCAPED_UNICODE));
$GLOBALS['WABOT_TEST_PF_PAGADO'] = [];
$nueva = $base($t0);
$nueva['lista'][] = wabot_cobro_rech_fila(['id' => 'clientes:AAA', 'pre' => 'S2nuevaa', 'tel' => '1144445555', 'persona' => 'Juan', 'negocio' => 'Panadería Sol', 'seguro' => true]);
$avisos = [];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-11-22 12:00:00'), $nueva, $mp(false, 'cancelled', [['id' => 'S2nuevaa', 'collector_id' => 999, 'status' => 'authorized', 'date_created' => '2026-11-21T10:00:00.000-04:00']]), $enviar, $avisar);
caso('si se volvió a suscribir, se cierra', !in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true));

echo "\n=== Canceló la suscripción: llega la fecha → 48 h → dar de baja ===\n";
$GLOBALS['WABOT_TEST_VENCIDOS'] = [];
$baseB = function ($ts) use ($f1) {
    return ['lista' => [], 'sync_ts' => $ts, 'enviados' => [], 'aviso_vieja_ts' => 0, 'conocidos' => ['S1aaaaaa' => $f1], 'canceladas' => ['S1aaaaaa:cancelled' => $ts],
        'clientes' => ['baja:S1aaaaaa' => ['ts' => $ts, 'res' => 'ok', 'pre' => 'S1aaaaaa', 'id' => 'clientes:AAA', 'hasta' => '2026-12-10', 'monto' => 20000.0]]];
};
$tb = $ar('2026-11-20 11:00:00');
$envios = []; $avisos = [];
wabot_cobro_rech_correr($cfg, $ar('2026-12-09 11:00:00'), $baseB($tb), $mp(false, 'cancelled'), $enviar, $avisar);
caso('antes de la fecha, nada', !$de('aviso_pago_48h'));
$r = wabot_cobro_rech_correr($cfg, $ar('2026-12-10 11:00:00'), $baseB($tb), $mp(false, 'cancelled'), $enviar, $avisar);
$a = $de('aviso_pago_48h');
caso('el día que vence lo pago: aviso de 48 h con el monto', count($a) === 1 && $a[0][2]['monto'] === '$20.000' && in_array('⏳ Aviso de 48 h para pagar', $titulos(), true), json_encode($envios, JSON_UNESCAPED_UNICODE));
$e = $r['estado']; $envios = []; $avisos = [];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-12-11 15:00:00'), $e, $mp(false, 'cancelled'), $enviar, $avisar);
caso('a las 28 h nada', !$envios && !in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true));
$r = wabot_cobro_rech_correr($cfg, $ar('2026-12-12 11:30:00'), $r['estado'], $mp(false, 'cancelled'), $enviar, $avisar);
caso('a las 48 h sin pagar: «dar de baja»', in_array('⛔ Venció el plazo de 48 h: dar de baja', $titulos(), true) && isset($GLOBALS['WABOT_TEST_VENCIDOS']['clientes:AAA']));
$envios = [];
$GLOBALS['WABOT_TEST_PF_PAGADO'] = ['clientes:AAA' => '2026-12-10'];
$r = wabot_cobro_rech_correr($cfg, $ar('2026-12-10 11:00:00'), $baseB($tb), $mp(false, 'cancelled'), $enviar, $avisar);
caso('si pasó a pagar por afuera y le marcaron el pago, no hay aviso', !$de('aviso_pago_48h') && !empty($r['estado']['clientes']['baja:S1aaaaaa']['cerrado']));
$GLOBALS['WABOT_TEST_PF_PAGADO'] = [];

echo "\n=== Aviso de baja al cliente al anotar la web en Bajas ===\n";
$GLOBALS['WABOT_TEST_VENCIDOS'] = ['clientes:AAA' => ['id' => 'clientes:AAA', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'ts' => time(), 'avisado_baja' => 0]];
$GLOBALS['WABOT_TEST_WEBS'] = [['id' => 'clientes:AAA', 'dominio' => 'panaderiasol.com.ar']];
$envios = [];
$rb = wabot_bajas_avisar_cliente(['dominio' => 'panaderiasol.com.ar', 'telefono' => ''], $enviar);
$sb = $de('servicio_dado_de_baja');
caso('por el dominio: le llega el aviso de baja', $rb === 'ok' && count($sb) === 1 && $sb[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol'], json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('una sola vez', wabot_bajas_avisar_cliente(['dominio' => 'panaderiasol.com.ar', 'telefono' => ''], $enviar) === '' && count($de('servicio_dado_de_baja')) === 1);
$GLOBALS['WABOT_TEST_VENCIDOS']['clientes:AAA']['avisado_baja'] = 0; $envios = [];
caso('también por el teléfono', wabot_bajas_avisar_cliente(['dominio' => '', 'telefono' => '+54 9 11 4444-5555'], $enviar) === 'ok');
$envios = [];
caso('una baja por otro motivo (no venció ningún plazo) no le avisa nada', wabot_bajas_avisar_cliente(['dominio' => 'otra.com.ar', 'telefono' => '1199998888'], $enviar) === '' && !$envios);

todo_ok();
