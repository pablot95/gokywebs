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
$r = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('un aviso por cada cobro rechazado (los dos)', $r['enviados'] === 2 && count($avisos) === 2, json_encode($r));
caso('al cliente no le sale ninguna plantilla', empty($GLOBALS['WABOT_TEST_PLANTILLAS']));
$a1 = $avisos[0] ?? ['', '', ''];
caso('título de cobro atrasado', strpos($a1[0], 'Cobro atrasado') !== false, $a1[0]);
caso('cliente, WhatsApp, monto, fecha y motivo', strpos($a1[1], 'Cliente: Juan Pérez — Panadería Sol') !== false
    && strpos($a1[1], 'WhatsApp: +5491144445555') !== false && strpos($a1[1], '$30.000') !== false
    && strpos($a1[1], '10/11') !== false && strpos($a1[1], 'fondos insuficientes') !== false && strpos($a1[1], 'S1aaaaaa') !== false, $a1[1]);
caso('con la clave del chat para el botón', $a1[2] === '5491144445555', $a1[2]);
caso('queda anotado por cobro', ($r['estado']['enviados']['7033861876']['resultado'] ?? '') === 'pablo');

$avisos = [];
$otra = wabot_cobro_rech_correr($cfg, $ar('2026-11-12 16:00:00'), $r['estado'], $mpDatos(), null, $avisar);
caso('los reintentos del mismo cobro no vuelven a avisar', !$avisos && $otra['enviados'] === 0);

$avisos = [];
wabot_cobro_rech_correr($cfg, $ar('2026-11-11 09:30:00'), $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('antes de las 10 no sale', !$avisos);
wabot_cobro_rech_correr($cfg, $ar('2026-11-11 20:10:00'), $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('después de las 20 no sale', !$avisos);

$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => true]]), $mpDatos('approved', 'processed'), null, $avisar);
caso('si MP ya lo cobró en el reintento, no sale el de S1', strpos($textos(), 'Panadería Sol') === false, $textos());

$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '1144445555', 'persona' => 'Juan Pérez', 'negocio' => 'Panadería Sol', 'seguro' => false],
]), $mpDatos(), null, $avisar);
caso('vinculada solo por fecha: avisa igual y lo aclara', strpos($textos(), 'solo por la fecha') !== false && strpos($textos(), 'Panadería Sol') !== false, $textos());
caso('sin cliente en la lista: avisa con lo que sabe MP', strpos($textos(), 'no está vinculado') !== false && strpos($textos(), 'Vincular con MP') !== false, $textos());

$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1, [
    ['id' => 'clientes:AAA', 'pre' => 'S1aaaaaa', 'tel' => '', 'persona' => 'Juan', 'negocio' => 'Panadería Sol', 'seguro' => true],
]), $mpDatos(), null, $avisar);
caso('sin teléfono: lo dice', strpos($textos(), 'sin teléfono cargado') !== false);

$avisos = []; $okAvisar = false;
$rf = wabot_cobro_rech_correr($cfg, $dia1, $estadoBase($dia1), $mpDatos(), null, $avisar);
caso('si el WhatsApp a Pablo no sale, no lo anota', $rf['fallidos'] === 2 && empty($rf['estado']['enviados']));
$okAvisar = true; $avisos = [];
$rf2 = wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rf['estado'], $mpDatos(), null, $avisar);
caso('y la pasada siguiente lo reintenta', $rf2['enviados'] === 2);

echo "\n=== Suscripción cancelada o pausada ===\n";
$mpCancel = function ($estadoSub, $cuando) {
    return function ($ruta) use ($estadoSub, $cuando) {
        if ($ruta === '/users/me') return ['id' => 999];
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
$rc = wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), null, $avisar);
caso('cancelada ayer: avisa con el cliente que el admin mandó antes', $rc['canceladas'] === 1 && strpos($avisos[0][0] ?? '', 'cancelada') !== false
    && strpos($avisos[0][1] ?? '', 'Marta Gil — Vivero') !== false && strpos($avisos[0][1] ?? '', '03/07/2026') !== false && strpos($avisos[0][1] ?? '', '10/11 20:00') !== false, $textos());
$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1 + 1800, $rc['estado'], $mpCancel('cancelled', '2026-11-10T19:00:00.000-04:00'), null, $avisar);
caso('una sola vez', !$avisos);
wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('cancelled', '2026-10-01T19:00:00.000-04:00'), null, $avisar);
caso('una cancelación vieja no se avisa', !$avisos);
wabot_cobro_rech_correr($cfg, $dia1, $base, $mpCancel('paused', '2026-11-11T09:00:00.000-04:00'), null, $avisar);
caso('pausada: también avisa', count($avisos) === 1 && strpos($avisos[0][0], 'pausada') !== false);

echo "\n=== Candados ===\n";
$avisos = [];
$vieja = $estadoBase($dia1); $vieja['sync_ts'] = $dia1 - 40 * 86400;
$r = wabot_cobro_rech_correr($cfg, $dia1, $vieja, $mpDatos(), null, $avisar);
caso('lista de hace más de 35 días: lo dice una vez y avisa igual', count(array_filter($avisos, function ($a) { return $a[0] === 'Lista de suscriptores vieja'; })) === 1 && $r['enviados'] === 2);
$avisos = [];
wabot_cobro_rech_correr($cfg, $dia1 + 1800, $r['estado'], $mpDatos(), null, $avisar);
caso('…sin repetirlo', !$avisos);

$r = wabot_cobro_rech_correr($cfg, $dia1, ['lista' => [], 'sync_ts' => 0, 'enviados' => [], 'aviso_vieja_ts' => 0], function () { throw new RuntimeException('no debería llamar'); }, null, $avisar);
caso('sin lista del admin no llama a MP', !empty($r['sin_lista']));

todo_ok();
