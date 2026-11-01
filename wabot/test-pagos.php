<?php
/**
 * wabot/test-pagos.php — el pago que entra en Mercado Pago, atado al chat y
 * confirmado (pagos.php, 1-nov-2026), sin red: MP y Firestore simulados.
 *
 *   php wabot/test-pagos.php
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/pagos.php';

$tmp = sys_get_temp_dir() . '/wabot-test-pagos-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_PAGOS_ARCHIVO'] = $tmp . '/pagos-mp.json';
$GLOBALS['WABOT_TEST_LOGS'] = false;
$cfg = wabot_config_load();
$YO = '221070899';
$ahora = gmmktime(15, 0, 0, 11, 2, 2026);   // 2-nov-2026 12:00 Argentina
$iso = function ($ts) { return gmdate('Y-m-d\TH:i:s.000\Z', $ts); };

/* ── Pagos como los devuelve /v1/payments/search (formas vistas con el token real el 1-nov) ── */
function mp_suscripcion($id, $monto, $ts, $cuota = 1, $sub = 'abc123', $yo = '221070899') {
    return ['id' => $id, 'status' => 'approved', 'collector_id' => $yo, 'transaction_amount' => $monto, 'date_approved' => gmdate('Y-m-d\TH:i:s.000\Z', $ts),
            'operation_type' => $cuota > 1 ? 'recurring_payment' : 'regular_payment', 'payment_type_id' => 'account_money', 'payment_method_id' => 'account_money',
            'point_of_interaction' => ['type' => 'SUBSCRIPTIONS', 'transaction_data' => ['subscription_id' => $sub, 'subscription_sequence' => ['number' => $cuota, 'total' => null]]],
            'payer' => ['id' => '86356704', 'email' => 'Cliente@Gmail.com', 'identification' => ['type' => 'CUIT', 'number' => '20-12345678-9']]];
}
function mp_transferencia($id, $monto, $ts, $yo = '221070899') {
    return ['id' => $id, 'status' => 'approved', 'collector_id' => $yo, 'transaction_amount' => $monto, 'date_approved' => gmdate('Y-m-d\TH:i:s.000\Z', $ts),
            'operation_type' => 'account_fund', 'payment_type_id' => 'bank_transfer', 'payment_method_id' => 'cvu', 'description' => 'Bank Transfer',
            'point_of_interaction' => ['type' => 'PSP_TRANSFER'],
            'payer' => ['id' => $yo, 'email' => 'pablo@gmail.com', 'identification' => ['type' => 'CUIT', 'number' => '20999999999']]];
}
function mp_transferencia_mp($id, $monto, $ts, $yo = '221070899') {
    return ['id' => $id, 'status' => 'approved', 'collector_id' => $yo, 'transaction_amount' => $monto, 'date_approved' => gmdate('Y-m-d\TH:i:s.000\Z', $ts),
            'operation_type' => 'money_transfer', 'payment_type_id' => 'account_money', 'payment_method_id' => 'account_money', 'description' => 'Varios',
            'point_of_interaction' => ['type' => 'PSP_TRANSFER'],
            'payer' => ['id' => '555', 'email' => 'juana@hotmail.com', 'identification' => ['type' => 'CUIL', 'number' => '27111111113']]];
}
function mp_checkout($id, $monto, $ts, $ref, $yo = '221070899') {
    return ['id' => $id, 'status' => 'approved', 'collector_id' => $yo, 'transaction_amount' => $monto, 'date_approved' => gmdate('Y-m-d\TH:i:s.000\Z', $ts),
            'operation_type' => 'regular_payment', 'payment_type_id' => 'credit_card', 'payment_method_id' => 'visa', 'external_reference' => $ref,
            'point_of_interaction' => ['type' => 'CHECKOUT'], 'payer' => ['id' => '777', 'email' => 'x@y.com']];
}

echo "Normalizar\n";
$n = wabot_pagos_normalizar(mp_suscripcion('1', 30000, $ahora), $YO);
caso('la suscripción: tipo, cuota, id de la suscripción, email en minúsculas y CUIT solo dígitos',
    $n['tipo'] === 'suscripcion' && $n['cuota'] === 1 && $n['suscripcion'] === 'abc123' && $n['email'] === 'cliente@gmail.com' && $n['cuit'] === '20123456789' && $n['monto'] === 30000, json_encode($n));
$n = wabot_pagos_normalizar(mp_transferencia('2', 60000, $ahora), $YO);
caso('la transferencia bancaria al CVU: sin datos del que mandó (el payer es la cuenta de Pablo)', $n['tipo'] === 'transferencia' && $n['email'] === '' && $n['cuit'] === '', json_encode($n));
$n = wabot_pagos_normalizar(mp_transferencia_mp('3', 20000, $ahora), $YO);
caso('la transferencia desde otra cuenta de MP trae email y CUIT', $n['tipo'] === 'transferencia_mp' && $n['email'] === 'juana@hotmail.com' && $n['cuit'] === '27111111113');
$n = wabot_pagos_normalizar(mp_checkout('4', 60000, $ahora, 'GKY-7K-1762000000'), $YO);
caso('el pago con link de Checkout Pro trae la referencia', $n['tipo'] === 'checkout' && $n['referencia'] === 'GKY-7K-1762000000');
caso('lo que pagó Pablo (otro collector) no es un cobro', wabot_pagos_normalizar(mp_checkout('5', 6918, $ahora, 'fb-1', '999') + ['collector_id' => '999'], $YO) === null);
$propio = mp_transferencia('6', 40000, $ahora); $propio['payment_type_id'] = 'credit_card'; $propio['payment_method_id'] = 'amex';
caso('la plata que cargó él con tarjeta es propia', wabot_pagos_normalizar($propio, $YO)['tipo'] === 'propio');
$pend = mp_suscripcion('7', 30000, $ahora); $pend['status'] = 'pending';
caso('un pago que no está aprobado no entra', wabot_pagos_normalizar($pend, $YO) === null);

echo "Qué datos de pago trae un mensaje\n";
$l = wabot_pagos_links_en('Te dejo el link de Mercado Pago para activar el plan mensual: gokywebs.com/pago/mensual30000');
caso('la página mensual30000 vale $30.000 mensual', $l === [['monto' => 30000, 'modalidad' => 'mensual', 'via' => 'link']], json_encode($l));
$l = wabot_pagos_links_en('Te paso el plan anual: https://gokywebs.com/pago/anual210/');
caso('la página del anual vale la seña de $60.000', $l[0]['monto'] === 60000 && $l[0]['modalidad'] === 'anual');
$l = wabot_pagos_links_en('gokywebs.com/pago/unico330 y gokywebs.com/pago/unico240');
caso('las del pago único valen su seña ($100.000 el resto, $80.000 el sitio)', $l[0]['monto'] === 100000 && $l[0]['modalidad'] === 'unico' && $l[1]['monto'] === 80000);
$l = wabot_pagos_links_en('gokywebs.com/pago/inicial80?c=7K');
caso('el pago inicial del modelo B', $l[0]['monto'] === 80000 && $l[0]['modalidad'] === 'inicial');
$l = wabot_pagos_links_en('https://mpago.la/1pfejMG avisame si te deja');
caso('el link corto de la suscripción de $20.000', $l[0]['monto'] === 20000 && $l[0]['modalidad'] === 'mensual');
$l = wabot_pagos_links_en("Te paso los datos:\nAlias: pablotravi\nCVU: 0000003100053462800156\nNombre: Pablo Travi");
caso('el alias cuenta como "le pasó cómo pagar", sin monto', $l === [['monto' => 0, 'modalidad' => '', 'via' => 'alias']], json_encode($l));
$l = wabot_pagos_links_en('Acá: gokywebs.com/pago/?monto=60000');
caso('la página general con ?monto= (la seña con tarjeta)', $l[0]['monto'] === 60000 && $l[0]['modalidad'] === 'anual');
caso('un mensaje sin nada de pago no trae nada', wabot_pagos_links_en('Hola, cómo estás? Te mando la demo: gokywebs.com/demo/kiosco/') === []);

echo "Candidatos y cruce\n";
$hace = function ($h) use ($ahora) { return $ahora - (int)($h * 3600); };
$convA = conv_nueva('5491111TEST01', ['nombre' => 'Ana', 'nombre_negocio' => 'Kiosco Ana', 'tipo' => 'ecommerce', 'presentado_ts' => $hace(30), 'codigo' => '7K']);
$convA['transcript'] = [
    ['q' => 'cliente', 't' => 'me gustó el modelo 1', 'ts' => $hace(26)],
    ['q' => 'humano', 't' => 'Te dejo el link de Mercado Pago para activar el plan mensual de la web: gokywebs.com/pago/mensual30000', 'ts' => $hace(25)],
    ['q' => 'cliente', 't' => '[foto] Mandó un comprobante de pago de una suscripción por $30.000 a Gokywebs', 'ts' => $hace(2), 'media' => ['clase' => 'imagen', 'archivo' => 'a.jpg']],
];
$convB = conv_nueva('5491111TEST02', ['nombre' => 'Beto', 'nombre_negocio' => 'Bar Beto', 'tipo' => 'landing', 'presentado_ts' => $hace(40)]);
$convB['transcript'] = [
    ['q' => 'humano', 't' => "Te paso los datos para la seña:\nAlias: pablotravi\nCVU: 0000003100053462800156", 'ts' => $hace(20)],
];
$convC = conv_nueva('5491111TEST03', ['nombre' => 'Caro', 'nombre_negocio' => 'Café Caro', 'tipo' => 'ecommerce']);
$convC['transcript'] = [['q' => 'humano', 't' => 'gokywebs.com/pago/mensual30000', 'ts' => $hace(10)]];
$convD = conv_nueva('5491111TEST04', ['nombre' => 'Dani', 'tipo' => 'ecommerce', 'pago_confirmado_ts' => $hace(5)]);
$convD['transcript'] = [['q' => 'humano', 't' => 'gokywebs.com/pago/mensual30000', 'ts' => $hace(8)]];
$convE = conv_nueva('5491111TEST05', ['nombre' => 'Eva', 'tipo' => 'landing']);
$convE['transcript'] = [['q' => 'bot', 't' => 'gokywebs.com/pago/mensual20000', 'ts' => $hace(100)]];
$convs = ['5491111TEST01' => $convA, '5491111TEST02' => $convB, '5491111TEST03' => $convC, '5491111TEST04' => $convD, '5491111TEST05' => $convE];
$cand = wabot_pagos_candidatos($ahora, $convs, $cfg);
caso('son candidatos los que recibieron cómo pagar en las últimas 72 h y no pagaron', array_keys($cand) === ['5491111TEST01', '5491111TEST02', '5491111TEST03'], json_encode(array_keys($cand)));
caso('el comprobante en el chat cuenta como aviso de pago', $cand['5491111TEST01']['avisado'] === true && $cand['5491111TEST03']['avisado'] === false);
$montosB = array_column($cand['5491111TEST02']['montos'], 'monto', 'modalidad');
caso('con el alias, lo esperado sale de lo cotizado (sitio profesional: $20.000 mensual, seña $60.000, $80.000 único)',
    ($montosB['mensual'] ?? 0) === 20000 && ($montosB['anual'] ?? 0) === 60000 && ($montosB['unico'] ?? 0) === 80000, json_encode($montosB));

$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_suscripcion('10', 30000, $hace(1)), $YO), $cand, $ahora);
caso('dos chats con el mismo link, uno solo avisó: es ese', $x['estado'] === 'confirmar' && $x['clave'] === '5491111TEST01' && $x['modo'] === 'monto_avisado' && $x['modalidad'] === 'mensual', json_encode($x));
$cand2 = $cand; $cand2['5491111TEST01']['avisado'] = false;
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_suscripcion('11', 30000, $hace(1)), $YO), $cand2, $ahora);
caso('dos chats con el mismo link y nadie avisó: sin asignar, con los dos sugeridos', $x['estado'] === 'sin_asignar' && $x['motivo'] === 'ambiguo' && array_keys($x['sugeridos']) === ['5491111TEST01', '5491111TEST03'], json_encode($x));
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_transferencia('12', 60000, $hace(1)), $YO), $cand, $ahora);
caso('la seña de $60.000 por transferencia coincide con el del alias, pero no avisó: sin asignar con él sugerido', $x['estado'] === 'sin_asignar' && $x['motivo'] === 'sin_aviso' && $x['sugeridos'] === ['5491111TEST02' => 'anual'], json_encode($x));
$convB2 = $convB; $convB2['transcript'][] = ['q' => 'cliente', 't' => 'Listo, ya te hice la transferencia', 'ts' => $hace(0.5)];
$cand3 = wabot_pagos_candidatos($ahora, ['5491111TEST02' => $convB2], $cfg);
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_transferencia('12', 60000, $hace(1)), $YO), $cand3, $ahora);
caso('… y cuando dice "ya te hice la transferencia", se confirma como plan anual', $x['estado'] === 'confirmar' && $x['clave'] === '5491111TEST02' && $x['modalidad'] === 'anual', json_encode($x));
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_transferencia('13', 150000, $hace(1)), $YO), $cand, $ahora);
caso('un monto que no coincide con ningún link: sin asignar, sin sugeridos', $x['estado'] === 'sin_asignar' && $x['motivo'] === 'sin_candidatos' && $x['sugeridos'] === []);
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_suscripcion('14', 30000, $hace(80)), $YO), $cand, $ahora);
caso('un pago de hace más de 72 h que el link no cuenta', $x['estado'] === 'sin_asignar');

// (a) La referencia GKY-<código>: el código corto de la charla. En los tests el índice no se escribe, así que se simula.
$GLOBALS['WABOT_TEST_CODIGO_INDICE'] = null;
$x = wabot_pagos_cruzar(wabot_pagos_normalizar(mp_checkout('15', 60000, $hace(1), 'GKY-7K-1762000000'), $YO), $cand, $ahora);
caso('la referencia con un código que no está en el índice cae al cruce por monto', $x['estado'] !== 'confirmar' || $x['modo'] !== 'referencia');
caso('la referencia genérica GKY-PAGO-… no se toma como código', wabot_pagos_cruzar(wabot_pagos_normalizar(mp_checkout('16', 60000, $hace(1), 'GKY-PAGO-1762000000-AB12'), $YO), [], $ahora)['estado'] === 'sin_asignar');

echo "Confirmar\n";
$escrito = null; $avisos = []; $capiAntes = count($GLOBALS['WABOT_TEST_CAPI'] ?? []);
$deps = [
    'ahora' => $ahora,
    'firestore' => function ($conv, $campos) use (&$escrito) { $escrito = $campos; return ['ok' => true, 'id' => 'CLI1234567890abcdefg', 'creado' => true, 'error' => '']; },
    'avisar' => function ($t, $c) use (&$avisos) { $avisos[] = $t . ' | ' . $c; return 1; },
];
$pago = wabot_pagos_normalizar(mp_suscripcion('10', 30000, $hace(1)), $YO) + ['modo' => 'monto_avisado'];
$convA['control_manual'] = true; $convA['bot_off'] = true; $convA['ctwa_clid'] = 'clid-123';
$cfgCapi = array_merge($cfg, ['capi_dataset_id' => '1', 'capi_token' => 't']);
$r = wabot_pago_confirmar($convA, $pago, 'mensual', $cfgCapi, $deps);
caso('queda en la charla: cuándo, cuánto, qué y cómo', $r['ok'] && $convA['pago_confirmado_ts'] === $ahora && $convA['pago_id'] === '10' && $convA['pago_monto'] === 30000
    && $convA['pago_modalidad'] === 'mensual' && $convA['pago_tipo'] === 'suscripcion' && $convA['pago_modo'] === 'monto_avisado' && count($convA['pagos']) === 1, json_encode($r));
caso('el bot recupera el chat (sin control manual ni apagado) y la modalidad elegida queda anotada', empty($convA['control_manual']) && empty($convA['bot_off']) && $convA['modalidad_elegida'] === 'mensual');
caso('en Firestore pasa a cliente como "pasar a Cliente" con el plan mensual: activa, desde hoy, con el id de la suscripción',
    $escrito['estadoCliente'] === 'cliente' && $escrito['modalidad'] === 'mensual' && $escrito['estadoSuscripcion'] === 'activa' && $escrito['preapprovalId'] === 'abc123'
    && $escrito['montoMensual'] === 30000 && $escrito['pagaPorFuera'] === false && $escrito['planLabel'] === 'Ecommerce' && $escrito['suscripcionDesde'] === ['_ts' => $hace(1)]
    && $escrito['pagoBot']['id'] === '10' && $escrito['emailMp'] === 'cliente@gmail.com', json_encode($escrito));
caso('el id del doc queda como cliente_id de la charla', $convA['cliente_id'] === 'CLI1234567890abcdefg');
caso('a Meta le avisa la compra con lo que pagó', $r['capi'] === 'ok' && count($GLOBALS['WABOT_TEST_CAPI']) === $capiAntes + 1 && end($GLOBALS['WABOT_TEST_CAPI'])[2]['custom_data']['value'] === 30000, $r['capi']);
caso('a Pablo le llega el aviso con el nombre, el monto y la modalidad', count($avisos) === 1 && strpos($avisos[0], 'Kiosco Ana') !== false && strpos($avisos[0], '$30.000') !== false && strpos($avisos[0], 'plan mensual') !== false, json_encode($avisos));
$r2 = wabot_pago_confirmar($convA, $pago, 'mensual', $cfg, $deps);
caso('no se confirma dos veces', $r2['ok'] === false && $r2['motivo'] === 'ya_confirmado' && count($convA['pagos']) === 1);

$escrito = null;
$pagoT = wabot_pagos_normalizar(mp_transferencia('12', 60000, $hace(1)), $YO) + ['modo' => 'monto_avisado'];
$r = wabot_pago_confirmar($convB, $pagoT, 'anual', $cfg, $deps);
caso('la seña del plan anual: modalidad "unico" del admin, el precio por año, la seña cobrada con fecha y en cobros',
    $escrito['modalidad'] === 'unico' && $escrito['valorTotal'] === 140000 && $escrito['abono'] === 60000 && $escrito['senaAt'] === ['_ts' => $hace(1)]
    && $escrito['cobros'] === [['at' => ['_ts' => $hace(1)], 'monto' => 60000, 'tipo' => 'sena']] && $escrito['planLabel'] === 'Sitio profesional', json_encode($escrito));
caso('la charla queda con la elección del plan anual', $convB['modalidad_elegida'] === 'unico' && $convB['pago_modalidad'] === 'anual');

$escrito = null;
$convF = conv_nueva('5491111TEST06', ['nombre' => 'Fede', 'tipo' => 'ecommerce']);
wabot_pago_confirmar_manual($convF, 100000, 'unico', $cfg, $deps);
caso('el pago único (a mano, desde la ficha): modalidad "propia", el total de $330.000 y la seña de $100.000',
    $escrito['modalidad'] === 'propia' && $escrito['valorTotal'] === 330000 && $escrito['abono'] === 100000 && $convF['pago_tipo'] === 'manual' && $convF['pago_modo'] === 'manual', json_encode($escrito));
$escrito = null;
$convG = conv_nueva('5491111TEST07', ['nombre' => 'Gabi', 'tipo' => 'landing']);
wabot_pago_confirmar_manual($convG, 80000, 'inicial', $cfg, $deps);
caso('el pago inicial del modelo B: mensual con primer pago, la suscripción pendiente desde el mes que viene',
    $escrito['modalidad'] === 'mensual' && $escrito['primerPago'] === 80000 && $escrito['estadoSuscripcion'] === 'pendiente' && $escrito['montoMensual'] === 20000
    && $escrito['suscripcionDesde'] === ['_ts' => $ahora + 30 * 86400], json_encode($escrito));
$escrito = null;
$convH = conv_nueva('5491111TEST08', ['nombre' => 'Hugo', 'tipo' => 'ecommerce']);
wabot_pago_confirmar_manual($convH, 30000, 'mensual', $cfg, $deps);
caso('la mensualidad pagada por transferencia queda como "paga por afuera" con su día de cobro',
    $escrito['pagaPorFuera'] === true && $escrito['diaCobro'] === 2 && $escrito['estadoSuscripcion'] === 'activa' && !isset($escrito['preapprovalId']), json_encode($escrito));

echo "Firestore: dónde escribe\n";
$ops = [];
$leer = function ($ruta) use (&$ops) {
    $ops[] = ['GET', $ruta];
    if ($ruta === 'clientes/EXISTE12345678901234') return [200, ['planLabel' => 'Ecommerce', 'cobros' => [['at' => '2026-10-01T15:00:00Z', 'monto' => 10000, 'tipo' => 'sena']]]];
    if ($ruta === 'propuestas/PROP1') return [200, ['nombre_negocio' => 'Bar Beto', 'nombre' => 'Beto', 'telefono' => '1150000002', 'tipo_web' => 'Sitio profesional', 'email' => 'beto@x.com', 'autoPresentada' => ['ts' => 'x']]];
    return [404, null];
};
$escribir = function ($ruta, $campos, $mascara, $crear) use (&$ops) { $ops[] = ['PATCH', $ruta, $campos, $crear]; return 200; };
$borrar = function ($ruta) use (&$ops) { $ops[] = ['DELETE', $ruta]; return 200; };
$campos = wabot_pagos_firestore_campos($convB, $pagoT, 'anual', $cfg, $ahora);
$r = wabot_pagos_fs_cliente_escribir(['conversation_key' => 'X', 'cliente_id' => 'EXISTE12345678901234', 'tipo' => 'ecommerce'], $campos, $leer, $escribir, $borrar);
$patch = end($ops);
caso('con el doc del cliente ya creado (la demo presentada) lo completa: los cobros se suman a los que tenía y el plan no se pisa',
    $r['ok'] && !$r['creado'] && $patch[0] === 'PATCH' && $patch[1] === 'clientes/EXISTE12345678901234' && $patch[3] === false
    && count($patch[2]['cobros']) === 2 && $patch[2]['cobros'][0]['at'] === ['_ts' => strtotime('2026-10-01T15:00:00Z')] && !isset($patch[2]['planLabel']), json_encode($patch));
$ops = [];
$r = wabot_pagos_fs_cliente_escribir(['conversation_key' => 'Y', 'tel' => '5491150000002', 'cliente_id' => '', 'lead_doc' => 'projects/p/databases/(default)/documents/propuestas/PROP1', 'tipo' => 'landing', 'nombre' => 'Beto'], $campos, $leer, $escribir, $borrar);
$creado = $ops[1]; $borrado = end($ops);
caso('sin doc pero con el boceto: lo pasa a Clientes como el admin (copia en propuestaSnapshot) y borra el boceto',
    $r['ok'] && $r['creado'] && strlen($r['id']) === 20 && $creado[0] === 'PATCH' && $creado[3] === true && $creado[2]['propuestaSnapshot']['nombre_negocio'] === 'Bar Beto'
    && !isset($creado[2]['propuestaSnapshot']['autoPresentada']) && $creado[2]['propuestaId'] === 'PROP1' && $creado[2]['estadoCliente'] === 'cliente' && $creado[2]['telefono'] === '1150000002'
    && $borrado === ['DELETE', 'propuestas/PROP1'], json_encode($ops));
$ops = [];
$r = wabot_pagos_fs_cliente_escribir(['conversation_key' => 'Z', 'tel' => '5491150000003', 'nombre' => 'Zoe', 'nombre_negocio' => 'Zapatería Zoe', 'tipo' => 'ecommerce'], $campos, $leer, $escribir, $borrar);
caso('sin doc ni boceto: crea uno con lo de la charla', $r['ok'] && $r['creado'] && $ops[0][0] === 'PATCH' && $ops[0][2]['nombre'] === 'Zoe' && $ops[0][2]['proyecto'] === 'Zapatería Zoe' && $ops[0][2]['telefono'] === '5491150000003' && count($ops) === 1, json_encode($ops));
caso('sin red (tests) no escribe nada', wabot_pagos_fs_cliente_escribir(['conversation_key' => '999TEST999'], $campos)['error'] === 'sin_red');
$v = wabot_pagos_fs_valor(['a' => wabot_pagos_fs_ts(1762000000), 'b' => [1, 2], 'c' => true, 'd' => 'x', 'e' => null]);
caso('la codificación de Firestore: fechas, listas, booleanos, textos y nulos',
    $v['mapValue']['fields']['a'] === ['timestampValue' => '2025-11-01T12:26:40Z'] && isset($v['mapValue']['fields']['b']['arrayValue']) && $v['mapValue']['fields']['c'] === ['booleanValue' => true]
    && $v['mapValue']['fields']['d'] === ['stringValue' => 'x'] && $v['mapValue']['fields']['e'] === ['nullValue' => null], json_encode($v));

echo "La corrida\n";
@unlink($GLOBALS['WABOT_TEST_PAGOS_ARCHIVO']);
$convsDisco = ['5491111TEST01' => $convs['5491111TEST01'], '5491111TEST02' => $convs['5491111TEST02'], '5491111TEST03' => $convs['5491111TEST03']];
$cola = [
    mp_suscripcion('100', 30000, $hace(1)),                 // Kiosco Ana avisó → se confirma
    mp_transferencia('101', 60000, $hace(1)),               // Bar Beto no avisó → sin asignar
    mp_suscripcion('102', 25000, $hace(3), 4, 'otra'),      // renovación de otro cliente
    mp_checkout('103', 6918, $hace(2), 'fb-1', '999'),      // lo que pagó Pablo
    mp_transferencia('104', 15000, $hace(2)),               // nada que ver
    mp_transferencia('105', 40000, $hace(2)),               // Pablo cargando su cuenta con la tarjeta
];
$cola[3]['collector_id'] = '999';
$cola[5]['payment_type_id'] = 'credit_card'; $cola[5]['payment_method_id'] = 'amex';
$mp = function ($ruta) use (&$cola, $YO) {
    if (strpos($ruta, '/users/me') === 0) return ['id' => $YO];
    return ['results' => $cola, 'paging' => ['total' => count($cola)]];
};
$guardados = [];
$deps2 = $deps + [
    'mp' => $mp,
    'cargar' => function ($clave) use (&$convsDisco) { return $convsDisco[$clave]; },
    'guardar' => function ($conv) use (&$convsDisco, &$guardados) { $convsDisco[$conv['conversation_key']] = $conv; $guardados[] = $conv['conversation_key']; return true; },
];
$deps2['candidatos'] = wabot_pagos_candidatos($ahora, $convsDisco, $cfg);
$avisos = [];
$r = wabot_pagos_correr($cfg, $ahora, $deps2);
caso('5 pagos nuevos (lo que pagó Pablo ni cuenta): 1 confirmado, 2 sin asignar, 1 renovación y 1 ignorado',
    $r['nuevos'] === 5 && $r['confirmados'] === 1 && $r['sin_asignar'] === 2 && $r['renovaciones'] === 1 && $r['ignorados'] === 1, json_encode($r));
caso('la charla de Kiosco Ana quedó confirmada y guardada', $guardados === ['5491111TEST01'] && $convsDisco['5491111TEST01']['pago_id'] === '100');
$estado = wabot_pagos_estado();
caso('todo queda anotado por id con su estado', $estado['pagos']['100']['estado'] === 'confirmado' && $estado['pagos']['101']['estado'] === 'sin_asignar' && $estado['pagos']['101']['sugeridos'] === ['5491111TEST02' => 'anual']
    && $estado['pagos']['102']['estado'] === 'renovacion' && $estado['pagos']['104']['estado'] === 'sin_asignar' && $estado['pagos']['104']['motivo'] === 'sin_candidatos' && $estado['yo'] === $YO, json_encode($estado['pagos']));
caso('el que pagó Pablo ni figura (otro collector)', !isset($estado['pagos']['103']));
caso('un solo aviso a Pablo (el pago confirmado)', count($avisos) === 1);
$guardados = []; $avisos = [];
$r = wabot_pagos_correr($cfg, $ahora + 600, $deps2);
caso('la corrida siguiente no repite nada', $r['nuevos'] === 0 && $r['confirmados'] === 0 && $guardados === [] && $avisos === [], json_encode($r));
// Bar Beto manda el comprobante: el pago sin asignar se vuelve a cruzar solo.
$convsDisco['5491111TEST02']['transcript'][] = ['q' => 'cliente', 't' => '[foto] Mandó un comprobante de transferencia por $60.000', 'ts' => $ahora + 900, 'media' => ['clase' => 'imagen']];
$deps2['candidatos'] = wabot_pagos_candidatos($ahora + 1200, $convsDisco, $cfg);
$r = wabot_pagos_correr($cfg, $ahora + 1200, $deps2);
caso('cuando llega el comprobante, el pago que esperaba se confirma solo', $r['reintentados'] >= 1 && $guardados === ['5491111TEST02'] && $convsDisco['5491111TEST02']['pago_modalidad'] === 'anual' && count($avisos) === 1, json_encode($r));
caso('y deja de estar sin asignar', wabot_pagos_estado()['pagos']['101']['estado'] === 'confirmado' && count(wabot_pagos_sin_asignar()) === 1);
caso('ignorarlo desde el panel lo saca de la lista', wabot_pagos_ignorar('104') && wabot_pagos_sin_asignar() === []);
$r = wabot_pagos_correr(['pagos_auto' => false], $ahora, $deps2);
caso('apagado en los ajustes, no hace nada', !empty($r['apagado']));
$sinToken = wabot_pagos_correr($cfg, $ahora, ['mp' => function () { throw new RuntimeException('MP caído'); }]);
caso('si MP no contesta, queda el error anotado y la corrida sigue mansa', !empty($sinToken['error']) && wabot_pagos_estado()['error'] !== '');

echo "La ficha\n";
caso('el resumen de la ficha', wabot_pago_resumen_ficha($convsDisco['5491111TEST01']) === 'Pagó $30.000 el 2/11 (plan mensual)', wabot_pago_resumen_ficha($convsDisco['5491111TEST01']));
caso('sin pago, nada', wabot_pago_resumen_ficha(conv_nueva()) === '');

echo "Quién lo llama\n";
caso('el cron de seguimiento corre el poller', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_pagos_correr($cfg)') !== false);
caso('la facturación automática sigue filtrando solo suscripciones (no se tocó)', strpos((string)file_get_contents(__DIR__ . '/../config/arca/suscripciones.php'), "!== 'SUBSCRIPTIONS'") !== false);
caso('las páginas de pago pasan ?c= como referencia GKY-<código>', strpos((string)file_get_contents(__DIR__ . '/../pago/script.js'), "'GKY-' + codigo") !== false
    && preg_match('/GKY-\[A-Z0-9\]/', (string)file_get_contents(__DIR__ . '/../pago/api/crear-preferencia.php')) === 1);

array_map('unlink', glob($tmp . '/*') ?: []);
@rmdir($tmp);
todo_ok();
