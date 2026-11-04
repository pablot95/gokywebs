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
$convA['control_manual'] = false; $convA['bot_off'] = false; $convA['ctwa_clid'] = 'clid-123';
$cfgCapi = array_merge($cfg, ['capi_dataset_id' => '1', 'capi_token' => 't', 'capi_waba_id' => '123456789012345']);
$r = wabot_pago_confirmar($convA, $pago, 'mensual', $cfgCapi, $deps);
caso('queda en la charla: cuándo, cuánto, qué y cómo', $r['ok'] && $convA['pago_confirmado_ts'] === $ahora && $convA['pago_id'] === '10' && $convA['pago_monto'] === 30000
    && $convA['pago_modalidad'] === 'mensual' && $convA['pago_tipo'] === 'suscripcion' && $convA['pago_modo'] === 'monto_avisado' && count($convA['pagos']) === 1, json_encode($r));
caso('le manda el «Genial, recibido…» de Pablo (tal cual, con su número) y el bot se calla en ese chat: lo sigue Pablo', $r['mensajes'] === [$cfg['pago_recibido']] && strpos($cfg['pago_recibido'], '1125068578') !== false
    && !empty($convA['control_manual']) && !empty($convA['bot_off']) && end($convA['transcript'])['t'] === $cfg['pago_recibido'] && !empty($convA['pago_recibido_ts']) && empty($convA['onboarding']), json_encode($r['mensajes']));
caso('la modalidad elegida queda anotada', $convA['modalidad_elegida'] === 'mensual');
caso('el aviso a Pablo dice que el recibido salió y que sigue él', strpos(end($avisos), 'seguís vos desde tu número') !== false, end($avisos));
caso('en Firestore pasa a cliente como "pasar a Cliente" con el plan mensual: activa, desde hoy, con el id de la suscripción',
    $escrito['estadoCliente'] === 'cliente' && $escrito['modalidad'] === 'mensual' && $escrito['estadoSuscripcion'] === 'activa' && $escrito['preapprovalId'] === 'abc123'
    && $escrito['montoMensual'] === 30000 && $escrito['pagaPorFuera'] === false && $escrito['planLabel'] === 'Ecommerce' && $escrito['suscripcionDesde'] === ['_ts' => $hace(1)]
    && $escrito['pagoBot']['id'] === '10' && $escrito['emailMp'] === 'cliente@gmail.com', json_encode($escrito));
caso('el id del doc queda como cliente_id de la charla', $convA['cliente_id'] === 'CLI1234567890abcdefg');
caso('a Meta le avisa la compra con lo que pagó', $r['capi'] === 'ok' && count($GLOBALS['WABOT_TEST_CAPI']) === $capiAntes + 1 && end($GLOBALS['WABOT_TEST_CAPI'])[2]['custom_data']['value'] === 30000, $r['capi']);
caso('a Pablo le llega el aviso con el nombre, el monto y la modalidad', count($avisos) === 1 && strpos($avisos[0], 'Kiosco Ana') !== false && strpos($avisos[0], '$30.000') !== false && strpos($avisos[0], 'plan mensual') !== false, json_encode($avisos));
$r2 = wabot_pago_confirmar($convA, $pago, 'mensual', $cfg, $deps);
caso('no se confirma dos veces', $r2['ok'] === false && $r2['motivo'] === 'ya_confirmado' && count($convA['pagos']) === 1);
$convA2 = conv_nueva('5491111TEST11', ['nombre' => 'Vieja', 'tipo' => 'landing', 'ultimo_cliente_ts' => $ahora - 100000]);
$avisos2 = [];
$r2v = wabot_pago_confirmar($convA2, $pago, 'mensual', $cfg, ['ahora' => $ahora, 'firestore' => $deps['firestore'], 'avisar' => function ($t, $c) use (&$avisos2) { $avisos2[] = $c; return 1; }]);
caso('con la ventana de WhatsApp cerrada no manda nada, igual se calla, y el aviso le dice a Pablo que le escriba él', $r2v['mensajes'] === [] && !empty($convA2['control_manual']) && strpos($avisos2[0], 'escribile vos') !== false, json_encode($avisos2));
$convA3 = conv_nueva('5491111TEST12', ['nombre' => 'Con onboarding', 'tipo' => 'ecommerce', 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => '1']);
require_once __DIR__ . '/onboarding.php';
$r3 = wabot_pago_confirmar($convA3, $pago, 'mensual', array_merge($cfg, ['onboarding_activo' => true]), $deps + ['enviar' => function (&$c, $t) { return true; }]);
caso('con el onboarding prendido en Ajustes, en vez de callarse pide lo que falta', count($r3['mensajes']) === 2 && empty($convA3['control_manual']) && !empty($convA3['onboarding']['inicio_ts']), json_encode($r3['mensajes']));

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
// La primera corrida (sin estado) no confirma nada: anota lo que ya estaba y desde ahí solo lo nuevo.
$viejos = [mp_suscripcion('90', 30000, $hace(5)), mp_transferencia('91', 60000, $hace(4))];
$mpViejo = function ($ruta) use ($viejos, $YO) { return strpos($ruta, '/users/me') === 0 ? ['id' => $YO] : ['results' => $viejos, 'paging' => ['total' => 2]]; };
$r0 = wabot_pagos_correr($cfg, $ahora - 3600, ['mp' => $mpViejo, 'candidatos' => [], 'cargar' => fn($k) => [], 'guardar' => fn($c) => true]);
caso('la primera corrida solo anota lo que ya estaba, sin confirmar ni dejar sin asignar', !empty($r0['primera_corrida']) && $r0['anteriores'] === 2 && $r0['confirmados'] === 0 && $r0['sin_asignar'] === 0
    && wabot_pagos_estado()['pagos']['90']['estado'] === 'anterior' && wabot_pagos_sin_asignar() === [], json_encode($r0));
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

echo "Revisión del 1-nov (noche)\n";
// La primera corrida que falla sigue siendo la primera.
@unlink($GLOBALS['WABOT_TEST_PAGOS_ARCHIVO']);
wabot_pagos_correr($cfg, $ahora, ['mp' => function () { throw new RuntimeException('MP caído'); }]);
$r = wabot_pagos_correr($cfg, $ahora + 600, ['mp' => $mpViejo, 'candidatos' => [], 'cargar' => fn($k) => [], 'guardar' => fn($c) => true]);
caso('si la primera corrida falla, la siguiente sigue siendo "la primera" (solo anota lo que ya estaba)', !empty($r['primera_corrida']), json_encode($r));
// Dos chats con el mismo link, uno solo avisó: el segundo pago del mismo monto no se lo queda el primero.
@unlink($GLOBALS['WABOT_TEST_PAGOS_ARCHIVO']);
wabot_pagos_guardar(['pagos' => ['viejo' => ['id' => 'viejo', 'ts' => $ahora - 86400, 'estado' => 'anterior']], 'corrida_ts' => $ahora - 3600, 'yo' => $YO, 'error' => '']);
$cvX = conv_nueva('5491111TEST21', ['nombre' => 'Xime', 'tipo' => 'ecommerce']);
$cvX['transcript'] = [['q' => 'humano', 't' => 'gokywebs.com/pago/mensual30000', 'ts' => $hace(10)], ['q' => 'cliente', 't' => 'listo, ya pagué', 'ts' => $hace(2)]];
$cvY = conv_nueva('5491111TEST22', ['nombre' => 'Yami', 'tipo' => 'ecommerce']);
$cvY['transcript'] = [['q' => 'humano', 't' => 'gokywebs.com/pago/mensual30000', 'ts' => $hace(9)]];
$disco = ['5491111TEST21' => $cvX, '5491111TEST22' => $cvY];
$colaXY = [mp_suscripcion('201', 30000, $hace(1.5), 1, 's1'), mp_suscripcion('202', 30000, $hace(1), 1, 's2')];
$r = wabot_pagos_correr($cfg, $ahora, $deps + [
    'mp' => function ($ruta) use ($colaXY, $YO) { return strpos($ruta, '/users/me') === 0 ? ['id' => $YO] : ['results' => $colaXY, 'paging' => ['total' => 2]]; },
    'candidatos' => wabot_pagos_candidatos($ahora, $disco, $cfg),
    'cargar' => function ($k) use (&$disco) { return $disco[$k]; },
    'guardar' => function ($c) use (&$disco) { $disco[$c['conversation_key']] = $c; return true; },
]);
$est = wabot_pagos_estado()['pagos'];
caso('el segundo pago con el mismo monto no queda como "extra" del que ya se confirmó: queda sin asignar',
    $r['confirmados'] === 1 && $est['201']['estado'] === 'confirmado' && $est['202']['estado'] === 'sin_asignar' && count((array)$disco['5491111TEST21']['pagos']) === 1, json_encode($est));
caso('desde una lista vieja no se asigna un pago ya confirmado', wabot_pagos_asignar('201', '5491111TEST22', 'mensual', $cfg)['motivo'] === 'ya_asignado');
// Si Pablo ya le escribió después del pago, el «Genial, recibido» no sale.
$cvP = conv_nueva('5491111TEST23', ['nombre' => 'Pía', 'tipo' => 'ecommerce']);
$cvP['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $hace(1)], ['q' => 'humano', 't' => 'Genial, recibido, te escribo desde otro número', 'ts' => $hace(0.5)]];
$env = 0;
$rP = wabot_pago_confirmar($cvP, ['id' => '300', 'monto' => 30000, 'ts' => $hace(1), 'tipo' => 'suscripcion', 'suscripcion' => 's3'], 'mensual', $cfg,
    ['ahora' => $ahora, 'firestore' => $deps['firestore'], 'avisar' => function ($t, $c) use (&$avisoP) { $avisoP = $c; return 1; }, 'ventana_abierta' => true,
     'enviar' => function (&$c, $t) use (&$env) { $env++; return true; }]);
caso('si Pablo ya le escribió después del pago, no le manda el «Genial, recibido» y el aviso lo dice',
    $rP['ok'] && $rP['mensajes'] === [] && $env === 0 && strpos((string)$avisoP, 'ya le escribiste vos') !== false, (string)$avisoP);
// Neuro Test (1-nov): Pablo le dijo «te escribo desde otro número» y después el bot le pidió la factura y el dominio. Con el onboarding prendido, tampoco.
require_once __DIR__ . '/onboarding.php';
$cvN = conv_nueva('5491111TEST24', ['nombre' => 'Sofii', 'tipo' => 'landing', 'ultimo_cliente_ts' => $ahora - 600, 'control_manual' => true, 'bot_off' => true]);
$cvN['transcript'] = [['q' => 'cliente', 't' => '[foto] comprobante', 'ts' => $hace(1)],
                      ['q' => 'humano', 't' => 'Genial, recibido. Ahora te escribo desde otro numero ( 1125068578 )', 'ts' => $hace(0.9)]];
$envN = 0;
$rN = wabot_pago_confirmar($cvN, ['id' => '301', 'monto' => 60000, 'ts' => $hace(1), 'tipo' => 'transferencia'], 'anual', array_merge($cfg, ['onboarding_activo' => true]),
    ['ahora' => $ahora, 'firestore' => $deps['firestore'], 'avisar' => function ($t, $c) { return 1; }, 'ventana_abierta' => true,
     'enviar' => function (&$c, $t) use (&$envN) { $envN++; return true; }]);
caso('con el onboarding prendido, si Pablo ya le escribió después del pago no arranca: nada sale y el chat sigue callado',
    $rN['ok'] && $rN['mensajes'] === [] && $envN === 0 && empty($cvN['onboarding']) && !empty($cvN['control_manual']) && !wabot_onboarding_activo($cvN, array_merge($cfg, ['onboarding_activo' => true])),
    json_encode([$rN['mensajes'], $cvN['onboarding'] ?? null, $cvN['control_manual'] ?? null], JSON_UNESCAPED_UNICODE));
// Un doc que Pablo ya pasó a Cliente con su cobro: la plata no se vuelve a escribir.
$opsC = [];
$leerC = function ($ruta) { return [200, ['estadoCliente' => 'cliente', 'planLabel' => 'Ecommerce', 'abono' => 100000.0, 'cobros' => [['at' => '2026-11-01T15:00:00Z', 'monto' => 100000, 'tipo' => 'sena']]]]; };
$escribirC = function ($ruta, $campos, $mascara, $crear) use (&$opsC) { $opsC[] = $campos; return 200; };
wabot_pagos_fs_cliente_escribir(['conversation_key' => 'W', 'cliente_id' => 'YAESCLIENTE123456789', 'tipo' => 'ecommerce'],
    wabot_pagos_firestore_campos($convB, $pagoT, 'unico', $cfg, $ahora), $leerC, $escribirC, fn($r) => 200);
caso('con el cliente ya pasado a mano y su cobro cargado, no se duplica el cobro ni se pisan los montos',
    count($opsC) === 1 && !isset($opsC[0]['cobros']) && !isset($opsC[0]['abono']) && !isset($opsC[0]['valorTotal']) && isset($opsC[0]['pagoBot']), json_encode($opsC));
// El cobro inicial del modelo B queda como 'inicial'.
$ci = wabot_pagos_firestore_campos($convB, $pagoT, 'inicial', $cfg, $ahora);
caso('el cobro del pago inicial queda con tipo "inicial" (no "sena")', ($ci['cobros'][0]['tipo'] ?? '') === 'inicial', json_encode($ci['cobros']));
// Con el alias y el grupo B de la prueba de precios: lo esperado es el pago inicial, no la seña del único.
$sinAb = $GLOBALS['WABOT_TEST_SIN_AB'] ?? null; unset($GLOBALS['WABOT_TEST_SIN_AB']);
$esp = wabot_pagos_montos_esperados(['tipo' => 'ecommerce', 'ab_grupo' => 'b'] + conv_nueva('5491111TEST25'), $cfg);
$espA = wabot_pagos_montos_esperados(['tipo' => 'ecommerce', 'ab_grupo' => 'a'] + conv_nueva('5491111TEST26'), $cfg);
caso('grupo B: el alias espera el pago inicial (sin pago único); grupo A: la seña del único (sin inicial)',
    isset($esp['inicial']) && !isset($esp['unico']) && isset($espA['unico']) && !isset($espA['inicial']), json_encode([$esp, $espA]));
if ($sinAb !== null) $GLOBALS['WABOT_TEST_SIN_AB'] = $sinAb;
caso('el poller carga la prueba de precios por su cuenta (seguimiento.php no la carga)', strpos((string)file_get_contents(__DIR__ . '/pagos.php'), "require_once __DIR__ . '/ab-precios.php'") !== false);
$errF = wabot_pagos_estado(); $errF['pagos']['err1'] = ['id' => 'err1', 'monto' => 5000, 'ts' => $ahora, 'estado' => 'error', 'motivo' => 'x']; wabot_pagos_guardar($errF);
caso('un pago que falló al confirmarse aparece en la pestaña Clientes', in_array('err1', array_column(wabot_pagos_sin_asignar(), 'id'), true));

echo "Quién lo llama\n";
caso('el cron de seguimiento corre el poller', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_pagos_correr($cfg)') !== false);
caso('la facturación automática sigue filtrando solo suscripciones (no se tocó)', strpos((string)file_get_contents(__DIR__ . '/../config/arca/suscripciones.php'), "!== 'SUBSCRIPTIONS'") !== false);
caso('las páginas de pago pasan ?c= como referencia GKY-<código>', strpos((string)file_get_contents(__DIR__ . '/../pago/script.js'), "'GKY-' + codigo") !== false
    && preg_match('/GKY-\[A-Z0-9\]/', (string)file_get_contents(__DIR__ . '/../pago/api/crear-preferencia.php')) === 1);

// 2-nov (Todovinilosmr): Pablo mandó su «Genial, recibido» a las 13:21, confirmó a mano a las 13:23 y el bot lo repitió.
$t0 = 1793632000;
$genial = ['q' => 'humano', 't' => 'Genial, recibido! Ahora te escribo desde otro numero ( 1125068578 ) , desde ahora seguimos el desarrollo por ese número', 'ts' => $t0 - 120];
caso('confirmado a mano: lo que escribió Pablo minutos antes cuenta como que ya lo atendió',
    wabot_pagos_pablo_escribio_despues(['pago_ts' => $t0, 'pago_tipo' => 'manual', 'transcript' => [['q' => 'humano', 't' => 'Tu nombre es mirian ?', 'ts' => $t0 - 60]]]));
caso('su «Genial, recibido… otro número» de horas antes cuenta aunque el pago lo haya detectado MP',
    wabot_pagos_pablo_escribio_despues(['pago_ts' => $t0, 'pago_tipo' => 'transferencia', 'transcript' => [array_merge($genial, ['ts' => $t0 - 3 * 3600])]]));
caso('un mensaje cualquiera de Pablo antes del pago de MP no cuenta (el bot manda el aviso)',
    !wabot_pagos_pablo_escribio_despues(['pago_ts' => $t0, 'pago_tipo' => 'transferencia', 'transcript' => [['q' => 'humano', 't' => 'Te paso el link', 'ts' => $t0 - 3 * 3600]]]));
$cvDup = ['tel' => '5491100008888TEST', 'conversation_key' => '5491100008888TEST', 'transcript' => [$genial], 'pago_ts' => $t0, 'pago_tipo' => 'manual'];
$enviadosDup = [];
$rDup = wabot_pago_recibido_enviar($cvDup, ['pago_recibido' => 'Genial, recibido. Ahora te escribo desde otro número (1125068578), desde ahora seguimos el desarrollo por ese número.'], $t0,
    ['ventana_abierta' => true, 'enviar' => function (&$c, $t) use (&$enviadosDup) { $enviadosDup[] = $t; return true; }]);
caso('…y entonces el bot no lo repite', $rDup === [] && $enviadosDup === [] && ($cvDup['pago_recibido_omitido'] ?? '') === 'pablo_escribio');

// 2-nov (BLIZZ): grupo B que eligió «Plan mensual» en el formulario viejo → se cobra el pago inicial.
caso('grupo B con «mensual» elegido: la modalidad que se cobra es el pago inicial',
    wabot_pagos_modalidad_de_conv(['modalidad_elegida' => 'mensual', 'comercial_cotizacion' => ['modelo' => 'b', 'mensual' => '$20.000', 'inicial' => '$80.000']]) === 'inicial'
    && wabot_pagos_modalidad_de_conv(['modalidad_elegida' => 'mensual', 'comercial_cotizacion' => ['modelo' => 'a2', 'anual' => '$140.000', 'mensual' => '$20.000']]) === 'mensual'
    && wabot_pagos_modalidad_de_conv(['modalidad_elegida' => 'propia', 'comercial_cotizacion' => ['modelo' => 'b', 'inicial' => '$80.000']]) === 'unico');

echo "Es de un cliente (3-nov)\n";
// «Hay muchos que ya son clientes de acá, pero no tengo cómo asignarlos a un cliente.»
@unlink($GLOBALS['WABOT_TEST_PAGOS_ARCHIVO']);
wabot_pagos_guardar(['pagos' => [
    'j1' => ['id' => 'j1', 'monto' => 15000, 'ts' => $hace(30), 'tipo' => 'suscripcion', 'email' => 'jorge@hotmail.com', 'estado' => 'sin_asignar', 'motivo' => 'sin_candidatos', 'sugeridos' => []],
    'j2' => ['id' => 'j2', 'monto' => 180000, 'ts' => $hace(70), 'tipo' => 'transferencia_mp', 'email' => 'Jorge@Hotmail.com ', 'estado' => 'sin_asignar', 'motivo' => 'sin_candidatos', 'sugeridos' => []],
    't1' => ['id' => 't1', 'monto' => 60000, 'ts' => $hace(5), 'tipo' => 'transferencia', 'email' => '', 'estado' => 'sin_asignar', 'motivo' => 'sin_candidatos', 'sugeridos' => []],
], 'corrida_ts' => $ahora - 3600, 'yo' => $YO, 'error' => '']);
$rc = wabot_pagos_de_cliente('j1', 'cli-9', 'Jorge Guzmán · Vitamov', $ahora);
$estC = wabot_pagos_estado();
caso('asignado a un cliente sale de la lista, junto con el otro pago del mismo mail', !empty($rc['ok']) && $rc['pagos'] === 2
    && array_column(wabot_pagos_sin_asignar(), 'id') === ['t1'], json_encode($rc));
caso('queda anotado de qué cliente es', $estC['pagos']['j1']['estado'] === 'cliente' && $estC['pagos']['j1']['cliente_id'] === 'cli-9'
    && $estC['pagos']['j2']['cliente_nombre'] === 'Jorge Guzmán · Vitamov' && $estC['pagos']['j2']['modo'] === 'mismo_mail');
caso('el mail queda recordado', ($estC['emails_cliente']['jorge@hotmail.com']['id'] ?? '') === 'cli-9');
caso('una lista vieja no lo pisa', (wabot_pagos_de_cliente('j1', 'cli-1', 'Otro', $ahora)['motivo'] ?? '') === 'ya_asignado');
caso('una transferencia bancaria (sin mail) no deja nada recordado', !empty(wabot_pagos_de_cliente('t1', 'cli-2', 'Ana', $ahora)['ok']) && count(wabot_pagos_estado()['emails_cliente']) === 1);
// La cuota siguiente del mismo mail entra sola como de ese cliente, sin buscar chat ni escribirle a nadie.
$colaJ = [mp_suscripcion('j3', 15000, $hace(1))];
$colaJ[0]['payer'] = ['id' => '777', 'email' => 'JORGE@hotmail.com'];
$cargados = [];
$rj = wabot_pagos_correr($cfg, $ahora, $deps + [
    'mp' => function ($ruta) use ($colaJ, $YO) { return strpos($ruta, '/users/me') === 0 ? ['id' => $YO] : ['results' => $colaJ, 'paging' => ['total' => 1]]; },
    'candidatos' => [], 'cargar' => function ($k) use (&$cargados) { $cargados[] = $k; return []; }, 'guardar' => fn($c) => true,
]);
$j3 = wabot_pagos_estado()['pagos']['j3'] ?? [];
caso('lo que entra después de ese mail se asigna solo al cliente', ($j3['estado'] ?? '') === 'cliente' && ($j3['cliente_id'] ?? '') === 'cli-9' && ($j3['modo'] ?? '') === 'auto'
    && $rj['sin_asignar'] === 0 && $cargados === [] && wabot_pagos_sin_asignar() === [], json_encode([$rj, $j3]));

array_map('unlink', glob($tmp . '/*') ?: []);
@rmdir($tmp);

// 4-nov: confirmar el pago no reactiva una conversación tomada por Pablo.
$cvManual = conv_nueva('AUDITORIAPAGOTEST', ['control_manual' => true, 'bot_off' => true, 'ultimo_cliente_ts' => $ahora, 'tipo' => 'ecommerce']);
$rManual = wabot_pago_confirmar($cvManual, $pago, 'mensual', array_merge($cfg, ['onboarding_activo' => true]), $deps);
caso('con control manual no inicia onboarding ni confirma otra vez al cliente', $rManual['ok'] && $rManual['mensajes'] === [] && empty($cvManual['onboarding']) && !empty($cvManual['control_manual']) && !empty($cvManual['bot_off']));

todo_ok();
