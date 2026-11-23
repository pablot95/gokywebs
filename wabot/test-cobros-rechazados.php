<?php
/**
 * Aviso de cobro rechazado de la suscripción (Pablo, 12-nov). Solo CLI, sin red
 * ni disco: Mercado Pago, la lista del admin y los envíos se simulan.
 *   php wabot/test-cobros-rechazados.php
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/cobros-rechazados.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
// Las listas de respaldo (webs.json, renovaciones.json) no se leen del disco en las pruebas.
$GLOBALS['WABOT_TEST_COBRO_LISTAS'] = [];
$cfg = wabot_config_load();
foreach (['cobro_rechazado', 'cobro_rechazado_ultimo', 'suscripcion_cancelada', 'pago_recibido'] as $k) {
    $cfg['plantillas'][$k] = array_merge((array)$cfg['plantillas'][$k], ['activa' => true, 'automatico' => true]);
}
// Los avisos a Pablo se prueban con las plantillas al cliente apagadas (23-nov: las del cliente, más abajo).
$cfgSin = $cfg;
foreach (['cobro_rechazado', 'cobro_rechazado_ultimo', 'suscripcion_cancelada', 'pago_recibido'] as $k) $cfgSin['plantillas'][$k]['activa'] = false;
$GLOBALS['WABOT_TEST_POR_FUERA'] = [];
// La auditoría de vínculos cruzados (23-nov) no corre en estas pruebas: se dice a mano cuáles lo están.
$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = [];

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
        if (strpos($ruta, '/v1/payments/search') === 0) return ['results' => []];
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

echo "\n=== El aviso a Pablo (16-nov: ya no sale nada al cliente) ===\n";
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
$avisos = [];
$okAvisar = true;
$avisar = function ($t, $l, $c) use (&$avisos, &$okAvisar) { $avisos[] = [$t, implode("\n", $l), $c]; return $okAvisar; };
$textos = function () use (&$avisos) { return implode("\n---\n", array_map(function ($a) { return $a[0] . "\n" . $a[1]; }, $avisos)); };

$dia1 = $ar('2026-11-11 10:30:00');
caso('la fila sin id o preapproval válido no entra', count($estadoBase($dia1)['lista']) === 2);

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$r = wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('un aviso por cada cobro rechazado (los dos)', $r['enviados'] === 2 && count($avisos) === 2, json_encode($r));
caso('con las plantillas al cliente apagadas, al cliente no le sale nada', empty($GLOBALS['WABOT_TEST_PLANTILLAS']));
$a1 = $avisos[0] ?? ['', '', ''];
caso('título de cobro atrasado', strpos($a1[0], 'Cobro atrasado') !== false, $a1[0]);
caso('cliente, WhatsApp, monto, fecha y motivo', strpos($a1[1], 'Cliente: Juan Pérez — Panadería Sol') !== false
    && strpos($a1[1], 'WhatsApp: +5491144445555') !== false && strpos($a1[1], '$30.000') !== false
    && strpos($a1[1], '10/11') !== false && strpos($a1[1], 'fondos insuficientes') !== false && strpos($a1[1], 'S1aaaaaa') !== false, $a1[1]);
caso('con la clave del chat para el botón', $a1[2] === '5491144445555', $a1[2]);
caso('queda anotado por cobro', ($r['estado']['enviados']['7033861876']['resultado'] ?? '') === 'pablo');

$avisos = [];
$otra = wabot_cobro_rech_correr($cfgSin, $ar('2026-11-12 16:00:00'), $r['estado'], $mpDatos(), null, $avisar);
caso('los reintentos del mismo cobro no vuelven a avisar', !$avisos && $otra['enviados'] === 0);

$avisos = [];
wabot_cobro_rech_correr($cfgSin, $ar('2026-11-11 09:30:00'), $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('antes de las 10 no sale', !$avisos);
wabot_cobro_rech_correr($cfgSin, $ar('2026-11-11 20:10:00'), $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('después de las 20 no sale', !$avisos);

$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1, [['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => true]]), $mpDatos('approved', 'processed'), null, $avisar);
caso('si MP ya lo cobró en el reintento, no sale el de S1', strpos($textos(), 'Panadería Sol') === false, $textos());

$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => false],
]), $mpDatos(), null, $avisar);
caso('vinculada solo por fecha: avisa igual y lo aclara', strpos($textos(), 'solo por la fecha') !== false && strpos($textos(), 'Panadería Sol') !== false, $textos());
caso('sin cliente en la lista: avisa con lo que sabe MP', strpos($textos(), 'no está vinculado') !== false && strpos($textos(), 'Vincular con MP') !== false, $textos());

$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '', 'persona' => 'Juan', 'negocio' => 'Panadería Sol', 'seguro' => true],
]), $mpDatos(), null, $avisar);
caso('sin teléfono: lo dice', strpos($textos(), 'sin teléfono cargado') !== false);

$avisos = []; $okAvisar = false;
$rf = wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('si el WhatsApp a Pablo no sale, no lo anota', $rf['fallidos'] === 2 && empty($rf['estado']['enviados']));
$okAvisar = true; $avisos = [];
$rf2 = wabot_cobro_rech_correr($cfgSin, $dia1 + 1800, $rf['estado'], $mpDatos(), null, $avisar);
caso('y la pasada siguiente lo reintenta', $rf2['enviados'] === 2);

echo "\n=== Suscripción cancelada o pausada ===\n";
$mpCancel = function ($estadoSub, $cuando) {
    return function ($ruta) use ($estadoSub, $cuando) {
        if ($ruta === '/users/me') return ['id' => 999];
        if (strpos($ruta, '/v1/payments/search') === 0) return ['results' => []];
        if (strpos($ruta, '/authorized_payments/search') === 0) return ['results' => [
            ['id' => 6000, 'status' => 'processed', 'debit_date' => '2026-11-03T10:00:00.000-04:00', 'payment' => ['status' => 'approved']],
            ['id' => 5000, 'status' => 'processed', 'debit_date' => '2026-10-03T10:00:00.000-04:00', 'payment' => ['status' => 'approved']]]];
        if (strpos($ruta, '/preapproval/search') === 0) return ['paging' => ['total' => 1], 'results' => [
            ['id' => 'S5eeeeee', 'collector_id' => 999, 'status' => $estadoSub, 'last_modified' => $cuando, 'date_created' => '2026-07-03T10:00:00.000-04:00',
             'payer_first_name' => 'Marta', 'payer_last_name' => 'Gil', 'reason' => 'Plan mensual', 'auto_recurring' => ['transaction_amount' => 20000]],
        ]];
        throw new RuntimeException('ruta no esperada ' . $ruta);
    };
};
$base = ['lista' => [], 'sync_ts' => $dia1 - 3600, 'enviados' => [], 'aviso_vieja_ts' => 0,
         'conocidos' => ['S5eeeeee' => wabot_cobro_rech_fila(['id' => 'clientes:EEE', 'pre' => 'S5eeeeee', 'tel' => '3514445555', 'persona' => 'Marta Gil', 'negocio' => 'Vivero', 'seguro' => true])]];
$avisos = [];
$rc = wabot_cobro_rech_correr($cfgSin, $dia1, $base, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), null, $avisar);
caso('cancelada ayer: avisa con el cliente que el admin mandó antes', $rc['canceladas'] === 1 && strpos($avisos[0][0] ?? '', 'cancelada') !== false
    && strpos($avisos[0][1] ?? '', 'Marta Gil — Vivero') !== false && strpos($avisos[0][1] ?? '', '03/07/2026') !== false && strpos($avisos[0][1] ?? '', '10/11 20:00') !== false, $textos());
$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1 + 1800, $rc['estado'], $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), null, $avisar);
caso('una sola vez', !$avisos);
wabot_cobro_rech_correr($cfgSin, $dia1, $base, $mpCancel('cancelled', '2026-10-01T19:00:00.000-04:00'), null, $avisar);
caso('una cancelación vieja no se avisa', !$avisos);
wabot_cobro_rech_correr($cfgSin, $dia1, $base, $mpCancel('paused', '2026-11-11T09:00:00.000-04:00'), null, $avisar);
caso('pausada: también avisa', count($avisos) === 1 && strpos($avisos[0][0], 'pausada') !== false);

echo "\n=== Candados ===\n";
$avisos = [];
$vieja = $estadoBase($dia1); $vieja['sync_ts'] = $dia1 - 40 * 86400;
$r = wabot_cobro_rech_correr($cfgSin, $dia1, $vieja, $mpDatos(), null, $avisar);
caso('lista de hace más de 35 días: lo dice una vez y avisa igual', count(array_filter($avisos, function ($a) { return $a[0] === 'Lista de suscriptores vieja'; })) === 1 && $r['enviados'] === 2);
$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1 + 1800, $r['estado'], $mpDatos(), null, $avisar);
caso('…sin repetirlo', !$avisos);

$r = wabot_cobro_rech_correr($cfgSin, $dia1, ['lista' => [], 'sync_ts' => 0, 'enviados' => [], 'aviso_vieja_ts' => 0], function () { throw new RuntimeException('no debería llamar'); }, null, $avisar);
caso('sin lista del admin no llama a MP', !empty($r['sin_lista']));

echo "\n=== Cancelada que ya no está en la lista del admin ===\n";
$listas = [
    ['id' => 'clientes:EEE', 'tel' => '3514445555', 'persona' => 'Marta Gil', 'negocio' => 'Vivero'],
    ['id' => 'clientes:FFF', 'tel' => '2614445555', 'persona' => 'Silvana Navarro', 'negocio' => 'Estética'],
];
$sinConocer = ['lista' => [['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan', 'negocio' => 'X', 'seguro' => true]],
               'sync_ts' => $dia1 - 3600, 'aviso_vieja_ts' => 0,
               'enviados' => ['7000' => ['ts' => $dia1 - 86400, 'id' => 'clientes:EEE', 'pre' => 'S5eeeeee', 'resultado' => 'ok']]];
$fr = wabot_cobro_rech_fila_respaldo('S5eeeeee', 'Otra Persona', $sinConocer, $listas);
caso('por el id que quedó en un aviso anterior', ($fr['negocio'] ?? '') === 'Vivero' && !empty($fr['seguro']), json_encode($fr, JSON_UNESCAPED_UNICODE));
$fr = wabot_cobro_rech_fila_respaldo('S7gggggg', 'Silvana  Navarro', $sinConocer, $listas);
caso('por el nombre del titular de MP (con espacios de más)', ($fr['negocio'] ?? '') === 'Estética' && ($fr['via'] ?? '') === 'nombre');
caso('sin nada que coincida: null', wabot_cobro_rech_fila_respaldo('S8hhhhhh', 'Nadie', $sinConocer, $listas) === null);
$GLOBALS['WABOT_TEST_COBRO_LISTAS'] = $listas;
$avisos = [];
wabot_cobro_rech_correr($cfgSin, $dia1, $sinConocer, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), null, $avisar);
caso('el aviso de la cancelada sale con el cliente', strpos($textos(), 'Marta Gil — Vivero') !== false && strpos($textos(), 'no está vinculado') === false, $textos());
caso('el «(20000)» de MP como nombre del plan no se muestra; «Plan mensual» sí', strpos($textos(), '(Plan mensual)') !== false
    && wabot_cobro_rech_plan_texto('30000') === '' && wabot_cobro_rech_plan_texto('Plan tienda') === 'Plan tienda');
$GLOBALS['WABOT_TEST_COBRO_LISTAS'] = [];

echo "\n=== 23-nov: plantillas al cliente ===\n";
$envios = [];
$enviar = function ($clave, $f, $valores, $plantilla) use (&$envios) { $envios[] = [$plantilla, $clave, $valores]; return true; };
$deEnvio = function ($p) use (&$envios) { return array_values(array_filter($envios, function ($e) use ($p) { return $e[0] === $p; })); };
$avisar = function ($t, $l, $c) use (&$avisos) { $avisos[] = [$t, implode("\n", $l), $c]; return true; };

/* MP para las plantillas: S1 (Juan) renovación rechazada (intento y último reintento a elección),
 * S2 (Ana) primer pago rebotado (no es renovación), pagos aprobados a elección. */
$mpCli = function ($intento = 1, $primer = '2026-11-10T16:09:50.000-04:00', $ultimo = '2026-11-10T16:09:50.000-04:00', $pagos = []) {
    return function ($ruta) use ($intento, $primer, $ultimo, $pagos) {
        if ($ruta === '/users/me') return ['id' => 999];
        if (strpos($ruta, '/v1/payments/search') === 0) return ['results' => $pagos];
        if (strpos($ruta, '/preapproval/search') === 0) return ['paging' => ['total' => 3], 'results' => [
            ['id' => 'S1aaaaaa', 'collector_id' => 999, 'status' => 'authorized', 'date_created' => '2026-09-10T16:00:00.000-04:00',
             'summarized' => ['semaphore' => 'red'], 'auto_recurring' => ['transaction_amount' => 30000]],
            ['id' => 'S2bbbbbb', 'collector_id' => 999, 'status' => 'authorized', 'date_created' => '2026-11-08T18:00:00.000-04:00',
             'summarized' => ['semaphore' => 'yellow'], 'auto_recurring' => ['transaction_amount' => 20000]],
            ['id' => 'S6ffffff', 'collector_id' => 999, 'status' => 'authorized', 'date_created' => '2026-11-05T10:00:00.000-04:00',
             'summarized' => ['semaphore' => 'green'], 'auto_recurring' => ['transaction_amount' => 20000]],
        ]];
        if (strpos($ruta, 'preapproval_id=S1aaaaaa') !== false) return ['results' => [
            ['id' => 7033861876, 'status' => 'scheduled', 'debit_date' => $primer, 'last_retry_date' => $ultimo, 'transaction_amount' => 30000,
             'retry_attempt' => $intento, 'rejection_code' => 'insufficient_amount', 'payment' => ['status' => 'rejected']],
            ['id' => 7032750000, 'status' => 'processed', 'debit_date' => '2026-10-10T16:00:00.000-04:00', 'payment' => ['status' => 'approved']],
        ]];
        if (strpos($ruta, 'preapproval_id=S2bbbbbb') !== false) return ['results' => [
            ['id' => 7033783651, 'status' => 'scheduled', 'debit_date' => '2026-11-10T18:09:59.000-04:00', 'retry_attempt' => 1, 'payment' => ['status' => 'rejected']],
        ]];
        throw new RuntimeException('ruta no esperada ' . $ruta);
    };
};

$envios = []; $avisos = [];
$r = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpCli(), $enviar, $avisar);
$pr = $deEnvio('cobro_rechazado');
caso('primer intento de una renovación: plantilla al cliente', count($pr) === 1 && $pr[0][1] === '5491144445555'
    && $pr[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$30.000'], json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('el primer pago rebotado de una suscripción nueva no (no es renovación)', count($envios) === 1);
caso('el aviso a Pablo dice que al cliente le salió', strpos($textos(), 'Plantilla al cliente: enviada') !== false, $textos());
$envios = [];
$r2 = wabot_cobro_rech_correr($cfg, $ar('2026-11-11 15:00:00'), $r['estado'], $mpCli(2), $enviar, $avisar);
caso('el reintento siguiente no lo repite', !$envios);

$envios = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-15 11:00:00'), $estadoBase($dia1), $mpCli(2), $enviar, $avisar);
caso('detectado 5 días después del primer intento: no se manda tarde', !$deEnvio('cobro_rechazado'));

$envios = [];
$ru = wabot_cobro_rech_correr($cfg, $ar('2026-11-15 11:00:00'), $r2['estado'], $mpCli(4, '2026-11-10T16:09:50.000-04:00', '2026-11-14T20:10:00.000-04:00'), $enviar, $avisar);
$ul = $deEnvio('cobro_rechazado_ultimo');
caso('último reintento (4.º) de ayer: la del último intento', count($ul) === 1 && $ul[0][2]['monto'] === '$30.000', json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('y no vuelve a mandar la del primer intento', !$deEnvio('cobro_rechazado'));
$envios = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-15 16:00:00'), $ru['estado'], $mpCli(4, '2026-11-10T16:09:50.000-04:00', '2026-11-14T20:10:00.000-04:00'), $enviar, $avisar);
caso('una sola vez', !$envios);
$envios = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-20 11:00:00'), $estadoBase($dia1), $mpCli(4, '2026-11-10T16:09:50.000-04:00', '2026-11-14T20:10:00.000-04:00'), $enviar, $avisar);
caso('último reintento de hace 6 días: no se manda tarde', !$envios);

$envios = [];
$GLOBALS['WABOT_TEST_POR_FUERA'] = ['clientes:AAA' => true];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpCli(), $enviar, $avisar);
caso('al que ahora paga por afuera no le llega nada de MP', !$envios);
$GLOBALS['WABOT_TEST_POR_FUERA'] = [];
$envios = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => false]]), $mpCli(), $enviar, $avisar);
caso('vinculada solo por la fecha: al cliente no (podría ser otro)', !$envios);
$envios = [];
$cfgApagada = $cfg; $cfgApagada['plantillas']['cobro_rechazado']['activa'] = false; $avisos = [];
wabot_cobro_rech_correr($cfgApagada, $dia1, $estadoBase($dia1), $mpCli(), $enviar, $avisar);
caso('con la plantilla apagada no sale y a Pablo se lo dice', !$envios && strpos($textos(), 'la plantilla está apagada') !== false, $textos());

echo "\n--- Baja ---\n";
$envios = []; $avisos = [];
$rb = wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), $enviar, $avisar);
$bj = $deEnvio('suscripcion_cancelada');
caso('cancelada: ¿seguir por otro medio?, activo hasta el último cobro + 1 mes', count($bj) === 1 && $bj[0][1] === '5493514445555'
    && $bj[0][2] === ['nombre' => 'Marta', 'negocio' => 'Vivero', 'fecha' => '03/12/2026'], json_encode($envios, JSON_UNESCAPED_UNICODE));
$envios = [];
wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rb['estado'], $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), $enviar, $avisar);
caso('la baja, una sola vez', !$envios);
wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('paused', '2026-11-11T09:00:00.000-04:00'), $enviar, $avisar);
caso('pausada: al cliente no', !$envios);
$conUltimo = $base + ['clientes' => ['ultimo:9999' => ['ts' => $dia1 - 2 * 86400, 'res' => 'ok', 'pre' => 'S5eeeeee']]];
wabot_cobro_rech_correr($cfg, $dia1, $conUltimo, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), $enviar, $avisar);
caso('cancelada por MP después del último intento: no se manda la de la baja', !$envios);
wabot_cobro_rech_correr($cfg, $ar('2026-12-05 11:00:00'), array_merge($base, ['sync_ts' => $ar('2026-12-05 10:00:00')]), $mpCancel('cancelled', '2026-12-04T19:00:00.000-04:00'), $enviar, $avisar);
caso('si ya no le queda servicio pago (venció el 03/12), no se le ofrece', !$envios);

echo "\n--- Pago recibido ---\n";
$pago = function ($id, $pre, $cuando) { return ['id' => $id, 'status' => 'approved', 'transaction_amount' => 30000, 'date_approved' => $cuando, 'metadata' => ['preapproval_id' => $pre]]; };
$envios = [];
$rp = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => true],
    ['id' => 'clientes:GGG', 'pre' => 'S6ffffff', 'tel' => '1177778888', 'persona' => 'Leo', 'negocio' => 'Gomería', 'seguro' => true],
]), $mpCli(1, '2026-11-10T16:09:50.000-04:00', '2026-11-10T16:09:50.000-04:00', [
    $pago(111, 'S1aaaaaa', '2026-11-11T08:00:00.000-04:00'), $pago(222, 'S6ffffff', '2026-11-11T08:30:00.000-04:00'),
]), $enviar, $avisar);
$pg = $deEnvio('pago_recibido');
caso('MP cobró la renovación: «recibimos tu pago», al día hasta dentro de un mes', count($pg) === 1 && $pg[0][1] === '5491144445555'
    && $pg[0][2] === ['nombre' => 'Juan', 'negocio' => 'Panadería Sol', 'monto' => '$30.000', 'fecha' => '11/12/2026'], json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('el cobro de una suscripción de hace 6 días (el primer pago) no', count($pg) === 1);
$envios = [];
wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rp['estado'], $mpCli(1, '2026-11-10T16:09:50.000-04:00', '2026-11-10T16:09:50.000-04:00', [$pago(111, 'S1aaaaaa', '2026-11-11T08:00:00.000-04:00')]), $enviar, $avisar);
caso('el mismo pago no se repite', !$deEnvio('pago_recibido'));
caso('pagos de hace más de 30 h no se piden', wabot_cobro_rech_pagos_aprobados(function () { return ['results' => [
    ['id' => 1, 'status' => 'approved', 'date_approved' => '2026-11-09T08:00:00.000-04:00', 'metadata' => ['preapproval_id' => 'S1']]]]; }, $dia1) === []);
caso('el id de la suscripción también puede venir en subscription_id', (wabot_cobro_rech_pagos_aprobados(function () { return ['results' => [
    ['id' => 2, 'status' => 'approved', 'date_approved' => '2026-11-11T08:00:00.000-04:00', 'point_of_interaction' => ['transaction_data' => ['subscription_id' => 'S9']]]]]; }, $dia1)[0]['pre'] ?? '') === 'S9');

echo "\n=== 23-nov: vínculo cruzado (la charla dice que la suscripción es de otro) ===\n";
$cruzadoAAA = ['clientes:AAA|S1aaaaaa' => ['quien' => 'Kiosco Beto (Beto)']];
$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = $cruzadoAAA;
$envios = []; $avisos = [];
$rx = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpCli(), $enviar, $avisar);
caso('al cliente de un vínculo cruzado no le sale la plantilla del cobro rechazado', !$envios, json_encode($envios, JSON_UNESCAPED_UNICODE));
caso('queda anotado como cruzado, que no es un resultado final', ($rx['estado']['clientes']['primero:7033861876']['res'] ?? '') === 'cruzado'
    && !wabot_pagos_resultado_final('cruzado') && wabot_pagos_resultado_final('ok'));
caso('el aviso a Pablo dice de quién es según la charla y que al cliente no se le escribe', strpos($textos(), 'vínculo cruzado: según la charla, esta suscripción es de Kiosco Beto (Beto)') !== false
    && strpos($textos(), 'Al cliente no se le escribe. Corregilo en Mantenimiento → Vincular con MP.') !== false && strpos($textos(), 'Plantilla al cliente') === false, $textos());
caso('el otro cobro rechazado (vínculo sano) se avisa como siempre', $rx['enviados'] === 2 && substr_count($textos(), 'vínculo cruzado') === 1);
$envios = []; $avisos = [];
$rx2 = wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rx['estado'], $mpCli(), $enviar, $avisar);
caso('mientras siga cruzado no sale, ni se repite el aviso a Pablo', !$envios && !$avisos);
$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = [];
$rx3 = wabot_cobro_rech_correr($cfg, $dia1 + 3600, $rx2['estado'], $mpCli(), $enviar, $avisar);
caso('corregido el vínculo, la plantilla sale en la pasada siguiente', count($deEnvio('cobro_rechazado')) === 1 && ($rx3['estado']['clientes']['primero:7033861876']['res'] ?? '') === 'ok', json_encode($envios, JSON_UNESCAPED_UNICODE));

$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = $cruzadoAAA;
$envios = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-15 11:00:00'), $estadoBase($dia1), $mpCli(4, '2026-11-10T16:09:50.000-04:00', '2026-11-14T20:10:00.000-04:00'), $enviar, $avisar);
caso('tampoco la del último intento', !$envios);
$envios = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpCli(1, '2026-11-10T16:09:50.000-04:00', '2026-11-10T16:09:50.000-04:00', [$pago(111, 'S1aaaaaa', '2026-11-11T08:00:00.000-04:00')]), $enviar, $avisar);
caso('ni el «recibimos tu pago»', !$deEnvio('pago_recibido'));

$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = ['clientes:EEE|S5eeeeee' => ['quien' => 'Florería Luz']];
$envios = []; $avisos = [];
wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), $enviar, $avisar);
caso('cancelada con el vínculo cruzado: al cliente no, y el aviso a Pablo lo dice', !$envios && count($avisos) === 1 && strpos($textos(), 'esta suscripción es de Florería Luz') !== false, $textos());

// Ya le había salido el «último intento» (el vínculo se supo cruzado después): el plazo de 48 h no corre.
$conPlazo = $base + ['clientes' => ['ultimo:9999' => ['ts' => $dia1 - 3 * 86400, 'res' => 'ok', 'pre' => 'S5eeeeee', 'id' => 'clientes:EEE', 'desde' => '2026-11-03', 'monto' => 20000]]];
$envios = []; $avisos = [];
$rp1 = wabot_cobro_rech_correr($cfg, $dia1, $conPlazo, $mpCancel('authorized', '2026-11-03T10:00:00.000-04:00'), $enviar, $avisar);
caso('plazo vencido de un vínculo cruzado: no pide dar de baja, avisa que quedó frenado', count($avisos) === 1 && strpos($avisos[0][0], 'plazo de pago frenado') !== false
    && strpos($textos(), 'Florería Luz') !== false && empty($rp1['estado']['clientes']['ultimo:9999']['vencido_ts']), $textos());
$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rp1['estado'], $mpCancel('authorized', '2026-11-03T10:00:00.000-04:00'), $enviar, $avisar);
caso('…una sola vez', !$avisos);
$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = [];

// La auditoría de verdad (con charlas fijas) dentro de la pasada: usa las suscripciones que la detección ya trajo.
unset($GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS']);
$GLOBALS['WABOT_TEST_AUDVINC'] = ['convs' => [], 'cache' => []];
$pedidosMp = [];
$mpContado = function ($ruta) use (&$pedidosMp, $mpCli) { $pedidosMp[] = strtok($ruta, '?'); $f = $mpCli(); return $f($ruta); };
$envios = []; $avisos = [];
$ra = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpContado, $enviar, $avisar);
$veces = array_count_values($pedidosMp);
caso('la auditoría corre dentro de la pasada sin pedirle de nuevo a MP la cuenta ni las suscripciones', ($veces['/users/me'] ?? 0) === 1 && ($veces['/preapproval/search'] ?? 0) === 1
    && isset($ra['estado']['cruzados']['firma']) && $ra['estado']['cruzados']['mapa'] === [], json_encode($veces));
caso('sin cruce (ninguna charla lo contradice) todo sale como siempre', count($deEnvio('cobro_rechazado')) === 1 && $ra['enviados'] === 2);
unset($GLOBALS['WABOT_TEST_AUDVINC']);
$GLOBALS['WABOT_TEST_VINCULOS_CRUZADOS'] = [];

/* 23-nov: Mercado Pago corta con 429. Lo que no deja mirar en una pasada queda para la siguiente,
 * sin llevarse puesto lo demás. */
echo "\n=== Mercado Pago no deja mirar una parte ===\n";
$mpCorta = function (callable $base, $patron) {
    return function ($ruta) use ($base, $patron) {
        if (strpos($ruta, $patron) !== false) throw new RuntimeException('Mercado Pago respondió HTTP 429 a ' . strtok($ruta, '?'));
        return $base($ruta);
    };
};
$sinMirar = null; $c0 = null; $a0 = null; $e0 = null;
$det = wabot_cobro_rech_detectar($mpCorta($mpDatos(), 'preapproval_id=S1aaaaaa'), $c0, $a0, $e0, $sinMirar);
caso('la suscripción que no se pudo mirar queda anotada y las demás se detectan igual', array_column($det, 'pre') === ['S2bbbbbb'] && array_keys($sinMirar) === ['S1aaaaaa']
    && strpos($sinMirar['S1aaaaaa'], 'HTTP 429') !== false, json_encode([$det, $sinMirar]));
$avisos = []; $envios = [];
$rk = wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1), $mpCorta($mpDatos(), 'preapproval_id=S1aaaaaa'), null, $avisar);
caso('la pasada sigue: avisa el cobro que sí pudo mirar y dice qué quedó pendiente', $rk['enviados'] === 1 && ($rk['mp_fallos'] ?? []) === ['suscripcion'] && strpos($textos(), 'Ana') !== false, json_encode($rk['mp_fallos'] ?? null));
$avisos = [];
$rk2 = wabot_cobro_rech_correr($cfgSin, $dia1 + 1800, $rk['estado'], $mpDatos(), null, $avisar);
caso('y en la pasada siguiente sale el que faltaba, sin repetir el otro', $rk2['enviados'] === 1 && count($avisos) === 1 && strpos($textos(), 'Juan Pérez') !== false && empty($rk2['mp_fallos']), $textos());
$avisos = [];
$rk3 = wabot_cobro_rech_correr($cfgSin, $dia1, $estadoBase($dia1), $mpCorta($mpDatos(), '/v1/payments/search'), null, $avisar);
caso('si falla la búsqueda de pagos aprobados, los avisos de cobros rechazados salen igual', $rk3['enviados'] === 2 && ($rk3['mp_fallos'] ?? []) === ['pagos']);
$avisos = []; $envios = [];
$rk4 = wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCorta($mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), '/authorized_payments/search'), $enviar, $avisar);
caso('cancelada y no se puede saber hasta cuándo pagó: ni plantilla ni aviso todavía', !$envios && !$avisos && ($rk4['mp_fallos'] ?? []) === ['baja'] && empty($rk4['estado']['canceladas']), json_encode($rk4['mp_fallos'] ?? null));
$rk5 = wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rk4['estado'], $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), $enviar, $avisar);
caso('…y salen los dos en la pasada siguiente', count($deEnvio('suscripcion_cancelada')) === 1 && count($avisos) === 1 && $rk5['canceladas'] === 1);

caso('una fila sin id o sin suscripción no se da por cruzada', wabot_cobro_rech_cruzado($conPlazo, ['id' => '', 'pre' => 'S5eeeeee'], null, $dia1) === null
    && wabot_cobro_rech_cruzado($conPlazo, null, null, $dia1) === null && wabot_cobro_rech_cruzado_lineas($conPlazo, ['id' => 'clientes:EEE', 'pre' => 'S5eeeeee'], null, $dia1) === []);
caso('el estado guarda la auditoría entre pasadas', array_key_exists('cruzados', wabot_cobro_rech_estado()));

todo_ok();
