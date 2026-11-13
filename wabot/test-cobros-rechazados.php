<?php
/**
 * Aviso de cobro rechazado de la suscripción (Pablo, 12-nov). Solo CLI, sin red
 * ni disco: Mercado Pago, la lista del admin y los envíos se simulan.
 *   php wabot/test-cobros-rechazados.php
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/cobros-rechazados.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
$cfg = wabot_config_load();
$cfg['plantillas']['cobro_rechazado'] = array_merge((array)$cfg['plantillas']['cobro_rechazado'], ['activa' => true, 'automatico' => true]);

echo "=== La plantilla ===\n";
$p = (array)wabot_config_load()['plantillas']['cobro_rechazado'];
caso('existe con el nombre de Meta', ($p['nombre'] ?? '') === 'cobro_rechazado_cuota_mensual');
caso('ofrece pagar por transferencia al alias', strpos($p['texto'], 'transferencia al alias gokywebs') !== false);
caso('tres variables: nombre, negocio, monto', ($p['params'] ?? []) === ['nombre', 'negocio', 'monto']);
caso('el texto usa las tres', strpos($p['texto'], '{nombre}') !== false && strpos($p['texto'], '{negocio}') !== false && strpos($p['texto'], '{monto}') !== false);

/* Mercado Pago falso: 3 suscripciones, como las del 12-nov.
 *  S1 (Juan): rechazada el 10-nov 16:09, reintentando.
 *  S2 (Ana):  rechazada el 8-nov, reintento 2 (ya se avisó o ya pasó el día).
 *  S3 (Leo):  al día (verde).
 *  S4 (otro collector): no es de la cuenta. */
$mpDatos = function ($pagoS1 = 'rejected', $estadoS1 = 'scheduled') {
    return function ($ruta) use ($pagoS1, $estadoS1) {
        if ($ruta === '/users/me') return ['id' => 999];
        if (strpos($ruta, '/preapproval/search') === 0) {
            return ['paging' => ['total' => 4], 'results' => [
                ['id' => 'S1aaaaaa', 'collector_id' => 999, 'status' => 'authorized', 'payer_first_name' => 'Juan', 'payer_last_name' => 'Pérez',
                 'summarized' => ['semaphore' => $pagoS1 === 'rejected' ? 'yellow' : 'green'], 'auto_recurring' => ['transaction_amount' => 30000]],
                ['id' => 'S2bbbbbb', 'collector_id' => 999, 'status' => 'authorized', 'summarized' => ['semaphore' => 'yellow'], 'auto_recurring' => ['transaction_amount' => 20000]],
                ['id' => 'S3cccccc', 'collector_id' => 999, 'status' => 'authorized', 'summarized' => ['semaphore' => 'green']],
                ['id' => 'S4dddddd', 'collector_id' => 111, 'status' => 'authorized', 'summarized' => ['semaphore' => 'red']],
            ]];
        }
        if (strpos($ruta, 'preapproval_id=S1aaaaaa') !== false) {
            return ['results' => [
                ['id' => 7033861876, 'status' => $estadoS1, 'debit_date' => '2026-11-10T16:09:50.000-04:00', 'transaction_amount' => 30000,
                 'retry_attempt' => 1, 'rejection_code' => 'insufficient_amount', 'payment' => ['status' => $pagoS1, 'status_detail' => 'insufficient_amount']],
                ['id' => 7032750000, 'status' => 'processed', 'debit_date' => '2026-10-10T16:00:00.000-04:00', 'transaction_amount' => 30000,
                 'payment' => ['status' => 'approved']],
            ]];
        }
        if (strpos($ruta, 'preapproval_id=S2bbbbbb') !== false) {
            return ['results' => [
                ['id' => 7033783651, 'status' => 'scheduled', 'debit_date' => '2026-11-08T18:09:59.000-04:00', 'transaction_amount' => 20000,
                 'retry_attempt' => 2, 'payment' => ['status' => 'rejected']],
            ]];
        }
        throw new RuntimeException('ruta no esperada ' . $ruta);
    };
};

echo "\n=== Detección en Mercado Pago ===\n";
$det = wabot_cobro_rech_detectar($mpDatos());
caso('encuentra los dos rechazados de la cuenta (no el verde ni el de otro collector)', array_column($det, 'pre') === ['S1aaaaaa', 'S2bbbbbb'], json_encode(array_column($det, 'pre')));
caso('el primer intento en hora argentina', ($det[0]['primer_intento'] ?? '') === '2026-11-10');
caso('el monto del cobro', ($det[0]['monto'] ?? 0) == 30000);
caso('el cobrado del mes anterior no cuenta', !in_array('7032750000', array_column($det, 'cobro'), true));
caso('el día local de un cobro a las 23:30 de Argentina', wabot_cobro_rech_dia_local('2026-11-10T22:30:00.000-04:00') === '2026-11-10');

echo "\n=== El aviso ===\n";
$estadoBase = function ($ahora, $filas = null) {
    return [
        'lista' => array_values(array_filter(array_map('wabot_cobro_rech_fila', $filas ?? [
            ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '11 4444-5555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => true],
            ['id' => 'mantenimiento:BBB', 'pre' => 'S2bbbbbb', 'tel' => '1155556666', 'persona' => 'Ana', 'negocio' => '', 'seguro' => true],
            ['id' => 'malo', 'pre' => 'S9', 'tel' => '1'],
        ]))),
        'sync_ts' => $ahora - 3600, 'enviados' => [], 'aviso_vieja_ts' => 0,
    ];
};
$mandados = [];
$enviar = function ($clave, $f, $valores) use (&$mandados) { $mandados[] = [$clave, $f['id'], $valores]; return true; };
$avisos = [];
$avisar = function ($t, $c) use (&$avisos) { $avisos[] = [$t, $c]; };

$dia1 = $ar('2026-11-11 10:30:00');
caso('la fila sin id o preapproval válido no entra', count($estadoBase($dia1)['lista']) === 2);

$r = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('el día siguiente al rechazo sale el aviso, solo a ese', array_column($mandados, 1) === ['clientes:AAA'], json_encode($r));
caso('al número sin chat le arma el 549', ($mandados[0][0] ?? '') === '5491144445555', $mandados[0][0] ?? '');
caso('nombre, negocio y monto', ($mandados[0][2] ?? []) === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$30.000'], json_encode($mandados[0][2] ?? [], JSON_UNESCAPED_UNICODE));
caso('el rechazado hace 3 días no recibe nada (su día ya pasó)', !in_array('mantenimiento:BBB', array_column($mandados, 1), true));
caso('salió bien: a Pablo no le llega nada', $avisos === [], json_encode($avisos, JSON_UNESCAPED_UNICODE));
caso('queda anotado por cobro', ($r['estado']['enviados']['7033861876']['resultado'] ?? '') === 'ok');

$mandados = [];
$otra = wabot_cobro_rech_correr($cfg, $ar('2026-11-11 16:00:00'), $r['estado'], $mpDatos(), $enviar, $avisar);
caso('otra pasada el mismo día no lo repite', !$mandados && $otra['enviados'] === 0);

$mandados = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-10 18:00:00'), $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('el mismo día del rechazo no sale', !$mandados);

$mandados = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-12 11:00:00'), $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('dos días después tampoco (no más que eso)', !$mandados);

$mandados = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-11 09:30:00'), $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('antes de las 10 no sale', !$mandados);
wabot_cobro_rech_correr($cfg, $ar('2026-11-11 20:10:00'), $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('después de las 20 no sale', !$mandados);

$mandados = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpDatos('approved', 'processed'), $enviar, $avisar);
caso('si MP ya lo cobró en el reintento, no sale', !$mandados);

echo "\n=== Lo que no se le manda al cliente ===\n";
$avisos = []; $mandados = [];
$r = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan', 'negocio' => 'Panadería Sol', 'seguro' => false],
]), $mpDatos(), $enviar, $avisar);
caso('vinculada solo por fecha: no sale', !$mandados);
caso('…y a Pablo le llega el aviso', count($avisos) === 1 && strpos($avisos[0][1], 'solo por la fecha') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));
caso('…una sola vez', (function () use ($cfg, $dia1, $r, $mpDatos, $enviar, $avisar, &$avisos) {
    wabot_cobro_rech_correr($cfg, $dia1 + 1800, $r['estado'], $mpDatos(), $enviar, $avisar);
    return count($avisos) === 1;
})());

$avisos = []; $mandados = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:ZZZ', 'pre' => 'S3cccccc', 'tel' => '1144445555', 'persona' => 'Leo', 'seguro' => true],
]), $mpDatos(), $enviar, $avisar);
caso('suscripción sin cliente en la lista: aviso a Pablo con el nombre de MP', !$mandados && count($avisos) === 1
    && strpos($avisos[0][1], 'Juan Pérez') !== false && strpos($avisos[0][1], 'Vincular con MP') !== false, json_encode($avisos, JSON_UNESCAPED_UNICODE));

$avisos = []; $mandados = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '', 'persona' => 'Juan', 'negocio' => 'Panadería Sol', 'seguro' => true],
]), $mpDatos(), $enviar, $avisar);
caso('sin teléfono: aviso a Pablo', !$mandados && count($avisos) === 1 && strpos($avisos[0][1], 'teléfono') !== false);

$avisos = []; $mandados = [];
$sinNegocio = $estadoBase($dia1, [['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => '', 'seguro' => true]]);
wabot_cobro_rech_correr($cfg, $dia1, $sinNegocio, $mpDatos(), $enviar, $avisar);
caso('sin negocio, «la web de» lleva el nombre completo', ($mandados[0][2]['negocio'] ?? '') === 'Juan Pérez' && ($mandados[0][2]['nombre'] ?? '') === 'Juan');

echo "\n=== Candados ===\n";
$mandados = [];
$apagada = $cfg; $apagada['plantillas']['cobro_rechazado']['activa'] = false;
$r = wabot_cobro_rech_correr($apagada, $dia1, $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('plantilla apagada: no sale nada (ni llama a MP)', !$mandados && !empty($r['apagado']));
$manual = $cfg; $manual['plantillas']['cobro_rechazado']['automatico'] = false;
$r = wabot_cobro_rech_correr($manual, $dia1, $estadoBase($dia1), $mpDatos(), $enviar, $avisar);
caso('sin «automático»: no sale', !$mandados && !empty($r['apagado']));

$avisos = [];
$vieja = $estadoBase($dia1); $vieja['sync_ts'] = $dia1 - 40 * 86400;
$r = wabot_cobro_rech_correr($cfg, $dia1, $vieja, $mpDatos(), $enviar, $avisar);
caso('lista de hace más de 35 días: frena y avisa a Pablo una vez', !$mandados && !empty($r['lista_vieja']) && count($avisos) === 1);
$r2 = wabot_cobro_rech_correr($cfg, $dia1 + 1800, $r['estado'], $mpDatos(), $enviar, $avisar);
caso('…sin repetir el aviso', count($avisos) === 1);

$r = wabot_cobro_rech_correr($cfg, $dia1, ['lista' => [], 'sync_ts' => 0, 'enviados' => [], 'aviso_vieja_ts' => 0], function () { throw new RuntimeException('no debería llamar'); }, $enviar, $avisar);
caso('sin lista del admin no llama a MP', !empty($r['sin_lista']));

echo "\n=== Envío real (WhatsApp simulado) ===\n";
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$clave = '549' . '1199990001';
@unlink(WABOT_DATA . '/conv/' . $clave . '.json');
$fila = wabot_cobro_rech_fila(['id' => 'clientes:TST', 'pre' => 'S1aaaaaa', 'tel' => '1199990001', 'persona' => 'Test Prueba', 'negocio' => 'QATEST Negocio', 'seguro' => true]);
$cobro = ['cobro' => '123456', 'monto' => 30000];
$r1 = wabot_cobro_rech_enviar_fila($fila, $cobro, $cfg);
$enviada = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('sale la plantilla de Meta con los 3 valores', $r1 === 'ok' && ($enviada[1] ?? '') === 'cobro_rechazado_cuota_mensual'
    && ($enviada[3] ?? []) === ['Test', 'QATEST Negocio', '$30.000'], json_encode($enviada, JSON_UNESCAPED_UNICODE));
$conv = wabot_conv_load($clave);
$ultimo = end($conv['transcript']);
caso('queda escrita en el chat del panel', strpos((string)($ultimo['t'] ?? ''), 'no pudo cobrar la cuota mensual de la web de QATEST Negocio ($30.000)') !== false, $ultimo['t'] ?? '');
caso('el chat anota el cobro', ($conv['cobro_rechazado_id'] ?? '') === '123456');
$r2 = wabot_cobro_rech_enviar_fila($fila, $cobro, $cfg);
caso('el mismo cobro no sale dos veces aunque se pierda el registro', $r2 === 'ya' && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1);
@unlink(WABOT_DATA . '/conv/' . $clave . '.json');

todo_ok();
