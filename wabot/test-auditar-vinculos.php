<?php
/**
 * Auditoría de los vínculos cliente ↔ suscripción de Mercado Pago (Pablo, 23-nov:
 * «cómo hacemos para reverificarlas todas»). Solo CLI, sin red ni disco: Mercado
 * Pago, la lista del admin, la caché de clientes y las charlas son datos fijos.
 *   php wabot/test-auditar-vinculos.php
 *
 * El caso central reproduce lo del 23-nov: tres clientes del mismo monto que se
 * suscribieron con horas de diferencia y quedaron vinculados en ciclo.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/auditar-vinculos.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
// Mercado Pago da las fechas con -04:00.
$mpFecha = function ($s) use ($ar) { return gmdate('Y-m-d\TH:i:s', $ar($s) - 4 * 3600) . '.000-04:00'; };
$fila = function ($q, $cuando, $t, $media = null) use ($ar) {
    $f = ['q' => $q, 't' => $t, 'ts' => $ar($cuando)];
    if ($media) $f['media'] = ['clase' => $media, 'mime' => $media === 'imagen' ? 'image/jpeg' : 'application/pdf', 'archivo' => 'x'];
    return $f;
};
$LINK30 = 'Te dejo el link de Mercado Pago para activar el plan mensual: https://www.gokywebs.com/pago/mensual30000';
$LINK20 = 'Te dejo el link de Mercado Pago para activar el plan mensual: https://mpago.la/1pfejMG';
$RECIBIDO = 'Genial, recibido. Ahora te escribo desde otro numero ( 1125068578 ) , desde ahora seguimos el desarrollo por ese número';
$COMPROBANTE = '[foto] Mandó una captura de Mercado Pago: «Listo, te suscribiste» al plan mensual, pago aprobado de $30.000';
$sub = function ($id, $alta, $monto, $nombre, $extra = []) use ($mpFecha) {
    [$n, $a] = array_pad(explode(' ', $nombre, 2), 2, '');
    return $extra + ['id' => $id, 'collector_id' => 999, 'status' => 'authorized', 'payer_first_name' => $n, 'payer_last_name' => $a,
        'date_created' => $mpFecha($alta), 'last_modified' => $mpFecha($alta), 'auto_recurring' => ['transaction_amount' => $monto],
        'summarized' => ['charged_quantity' => 1, 'semaphore' => 'green']];
};
$mpCon = function (array $subs) {
    return function ($ruta) use ($subs) {
        if ($ruta === '/users/me') return ['id' => 999];
        if (strpos($ruta, '/preapproval/search') === 0) return ['paging' => ['total' => count($subs)], 'results' => $subs];
        throw new RuntimeException('ruta no esperada ' . $ruta);
    };
};

echo "=== Nombres, teléfonos y mensajes ===\n";
caso('el teléfono queda en característica + número', wabot_audvinc_tel('+54 9 11 6442-2702') === '1164422702' && wabot_audvinc_tel('5491164422702') === '1164422702'
    && wabot_audvinc_tel('011 15 6442-2702') === '1164422702' && wabot_audvinc_tel('1164422702') === '1164422702', wabot_audvinc_tel('011 15 6442-2702'));
caso('del interior, con el 15', wabot_audvinc_tel('0221 15 589-6090') === '2215896090' && wabot_audvinc_tel('5492215896090') === '2215896090', wabot_audvinc_tel('0221 15 589-6090'));
caso('sin teléfono no hay coincidencia', !wabot_audvinc_mismo_tel('', '') && !wabot_audvinc_mismo_tel('1164422702', ''));
caso('las palabras del nombre, sin tildes ni «del»', wabot_audvinc_palabras('Agustín del Valle', 'Yani~') === ['agustin', 'valle', 'yani']);
caso('Yani y Yanina comparten nombre; Ana y Anabella no (3 letras)', wabot_audvinc_en_comun(['yani', 'vazquez'], 'Yanina Vazquez') === 2 && wabot_audvinc_en_comun(['ana'], 'Anabella Ruiz') === 0);
caso('el «Genial, recibido… otro numero» de Pablo', wabot_audvinc_es_recibido($RECIBIDO) && wabot_audvinc_es_recibido('Recibido! te escribo del 11 2506-8578'));
caso('un «recibido» cualquiera no', !wabot_audvinc_es_recibido('Genial, recibido el logo') && !wabot_audvinc_es_recibido('te paso otro numero de la competencia'));
caso('foto que habla de un pago = comprobante', wabot_audvinc_clase_prueba($COMPROBANTE, ['clase' => 'imagen']) === 'comprobante');
caso('PDF de transferencia = comprobante', wabot_audvinc_clase_prueba('[documento] comprobante_transferencia.pdf', ['clase' => 'documento']) === 'comprobante');
caso('foto sin descripción = archivo', wabot_audvinc_clase_prueba('[foto]', ['clase' => 'imagen']) === 'archivo');
caso('foto del logo = archivo (no habla de pago)', wabot_audvinc_clase_prueba('[foto] Mandó el logo de la marca en tonos verdes', ['clase' => 'imagen']) === 'archivo');
caso('«ya pagué» sin archivo = dijo', wabot_audvinc_clase_prueba('Listo, ya pagué', null) === 'dijo' && wabot_audvinc_clase_prueba('ya me suscribí!', null) === 'dijo');
caso('un audio o un mensaje cualquiera no prueba nada', wabot_audvinc_clase_prueba('[audio]', ['clase' => 'audio']) === '' && wabot_audvinc_clase_prueba('dale, mañana lo veo', null) === '');

echo "\n=== Mercado Pago ===\n";
$subsMp = wabot_audvinc_suscripciones($mpCon([
    $sub('SUBOK001', '2026-10-19 12:17:00', 30000, 'Laura Bertoni'),
    $sub('SUBREIN1', '2026-10-19 12:10:00', 30000, 'Laura Bertoni', ['status' => 'cancelled', 'last_modified' => $mpFecha('2026-10-19 12:15:00'), 'summarized' => ['charged_quantity' => 0]]),
    $sub('SUBBAJA1', '2026-09-01 10:00:00', 20000, 'Pedro Sosa', ['status' => 'cancelled', 'last_modified' => $mpFecha('2026-11-05 10:00:00'), 'summarized' => ['charged_quantity' => 2, 'semaphore' => 'red']]),
    $sub('SUBPEND1', '2026-10-19 12:00:00', 30000, 'Nadie Nunca', ['status' => 'pending', 'summarized' => []]),
    $sub('SUBAJENA', '2026-10-19 12:00:00', 30000, 'Otra Cuenta', ['collector_id' => 111]),
    // Como vienen de verdad: el único intento de cobro rebotó (cuenta 1, semáforo amarillo) y se canceló a los minutos.
    $sub('SUBREIN3', '2026-10-19 12:05:00', 30000, 'Laura Bertoni', ['status' => 'cancelled', 'last_modified' => $mpFecha('2026-10-19 12:09:00'), 'summarized' => ['charged_quantity' => 1, 'semaphore' => 'yellow']]),
    // Cobró y la dio de baja el mismo día: esa sí fue una suscripción.
    $sub('SUBMISMO', '2026-10-16 20:25:00', 20000, 'Rosana Ledesma', ['status' => 'cancelled', 'last_modified' => $mpFecha('2026-10-16 21:00:00')]),
]));
caso('trae las de la cuenta, no las de otro collector', array_keys($subsMp) === ['SUBOK001', 'SUBREIN1', 'SUBBAJA1', 'SUBPEND1', 'SUBREIN3', 'SUBMISMO'], json_encode(array_keys($subsMp)));
caso('el alta en hora real, el monto y el titular', $subsMp['SUBOK001']['alta_ts'] === $ar('2026-10-19 12:17:00') && $subsMp['SUBOK001']['monto'] === 30000 && $subsMp['SUBOK001']['nombre_mp'] === 'Laura Bertoni');
caso('cancelada el mismo día sin cobrar = reintento, no cuenta', $subsMp['SUBREIN1']['descartada'] === true);
caso('con el único cobro rechazado también es un reintento', $subsMp['SUBREIN3']['descartada'] === true);
caso('la que nunca se autorizó tampoco', $subsMp['SUBPEND1']['descartada'] === true);
caso('la cancelada que llegó a cobrar sí cuenta, aunque haya sido el mismo día', $subsMp['SUBBAJA1']['descartada'] === false && $subsMp['SUBMISMO']['descartada'] === false && $subsMp['SUBOK001']['descartada'] === false);

echo "\n=== El puntaje de una charla ===\n";
$s30 = ['id' => 'S', 'monto' => 30000, 'alta_ts' => $ar('2026-10-20 14:31:00')];
$ch = function (array $filas, $clave = '5491100000001', array $extra = []) {
    return wabot_audvinc_charla($clave, $extra + ['transcript' => $filas]);
};
$completa = $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-10-20 14:39:00', $RECIBIDO)]);
$p = wabot_audvinc_puntuar($s30, $completa);
caso('link en las 6 h + comprobante en los 15 min + recibido = 9', ($p['puntos'] ?? 0) === 9, json_encode($p));
caso('guarda cuándo fue cada cosa', $p['link']['antes'] === 120 && $p['prueba']['despues'] === 180 && $p['prueba']['clase'] === 'comprobante' && $p['recibido']['despues'] === 480);
$p = wabot_audvinc_puntuar($s30, $ch([$fila('bot', '2026-10-18 10:00:00', $LINK30), $fila('cliente', '2026-10-20 15:10:00', $COMPROBANTE, 'imagen')]));
caso('link de hace dos días (2) + comprobante a los 39 min (3) = 5', ($p['puntos'] ?? 0) === 5, json_encode($p));
caso('sin el link de ese monto la charla no es candidata', wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 14:29:00', $LINK20), $fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen')])) === null);
caso('el link de más de 72 h antes no cuenta', wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-17 14:00:00', $LINK30), $fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen')])) === null);
caso('el link mandado después del alta tampoco', wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 15:00:00', $LINK30)])) === null);
$p = wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('cliente', '2026-10-20 15:40:00', $COMPROBANTE, 'imagen'), $fila('cliente', '2026-10-20 14:20:00', $COMPROBANTE, 'imagen')]));
caso('el comprobante a más de una hora, o de antes del alta, no suma', ($p['puntos'] ?? 0) === 3 && $p['prueba'] === null, json_encode($p));
$p = wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('cliente', '2026-10-20 14:33:00', 'listo, ya pagué')]));
caso('«ya pagué» a los 2 min: 3 + 3', ($p['puntos'] ?? 0) === 6 && $p['prueba']['clase'] === 'dijo', json_encode($p));
$p = wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('humano', '2026-10-21 01:00:00', $RECIBIDO)]));
caso('el «recibido» a las 10 h vale 1; al otro día, nada', ($p['puntos'] ?? 0) === 4
    && wabot_audvinc_puntuar($s30, $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('humano', '2026-10-21 09:00:00', $RECIBIDO)]))['puntos'] === 3, json_encode($p));
$vieja = wabot_audvinc_charla('5491100000001', ['transcript' => [$fila('humano', '2026-10-20 14:39:00', $RECIBIDO)]],
    [$fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-10-20 14:39:00', $RECIBIDO)]);
caso('lee también lo archivado en el historial, sin contar dos veces lo repetido', count($vieja['links']) === 1 && count($vieja['pruebas']) === 1 && count($vieja['recibidos']) === 1
    && wabot_audvinc_puntuar($s30, $vieja)['puntos'] === 9);
caso('la charla sin ningún link mensual no entra', wabot_audvinc_charla('5491100000009', ['transcript' => [$fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen')]]) === null);
caso('los teléfonos de la charla: la clave y el WhatsApp cargado', $ch([$fila('humano', '2026-10-20 14:29:00', $LINK30)], 'ig998877', ['telefono_wsp' => '11 5555-0001'])['tels'] === ['1155550001']);

/* ── El cruce de tres del mismo monto ──────────────────────────────────────
 * Tres clientas de $30.000:
 *   Tienda Lula    se suscribió el 19-oct 12:17  → SUBLULA1 (titular Laura Bertoni)
 *   Centro Vital   se suscribió el 20-oct 14:31  → SUBVITAL (titular Tamara Castillo)
 *   Dermo Clara    se suscribió el 20-oct 16:30  → SUBCLARA (titular Nadia Duarte)
 * y en el admin quedaron en ciclo: Vital tiene la de Lula, Clara la de Vital y Lula la de Clara.
 * Además: un vínculo bien hecho (Ferretería Sur, $20.000), dos charlas con el link y sin pago,
 * uno sin charla que coincide por el nombre, una ficha de Mantenimiento, uno sin ninguna prueba,
 * y uno con una suscripción que ya no está en Mercado Pago. */
echo "\n=== Tres clientes del mismo monto, vinculados en ciclo ===\n";
$mp = $mpCon([
    $sub('SUBLULA1', '2026-10-19 12:17:00', 30000, 'Laura Bertoni'),
    $sub('SUBVITAL', '2026-10-20 14:31:00', 30000, 'Tamara Castillo'),
    $sub('SUBCLARA', '2026-10-20 16:30:00', 30000, 'Nadia Duarte'),
    $sub('SUBFERRE', '2026-10-22 10:00:00', 20000, 'Hugo Paz'),
    $sub('SUBNOMBR', '2026-09-10 09:00:00', 25000, 'Marcela Quiroga'),
    $sub('SUBWEBHK', '2026-08-12 10:26:00', 10000, 'Agustin Alvarez'),
    $sub('SUBNADA1', '2026-09-28 19:47:00', 25000, 'Cecilia Rinaldi'),
    // Un reintento de Dermo Clara, cinco minutos antes: no se audita ni confunde.
    $sub('SUBREIN2', '2026-10-20 16:25:00', 30000, 'Nadia Duarte', ['status' => 'cancelled', 'last_modified' => $mpFecha('2026-10-20 16:26:00'), 'summarized' => ['charged_quantity' => 0]]),
    // Sin vincular en el admin, con su charla.
    $sub('SUBLIBRE', '2026-10-25 11:00:00', 20000, 'Marcos Rey', ['status' => 'paused']),
]);
$convs = [
    '5492340000001' => ['nombre' => 'Lu', 'nombre_negocio' => 'Tienda Lula', 'cliente_id' => 'LULA', 'transcript' => [
        $fila('humano', '2026-10-19 11:07:00', $LINK30), $fila('cliente', '2026-10-19 12:18:00', '[foto]', 'imagen'), $fila('humano', '2026-10-19 12:28:00', $RECIBIDO)]],
    '5492230000002' => ['nombre' => 'Tay', 'nombre_negocio' => 'Centro Vital', 'cliente_id' => 'VITAL', 'transcript' => [
        $fila('humano', '2026-10-20 14:29:00', $LINK30), $fila('cliente', '2026-10-20 14:34:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-10-20 14:39:00', $RECIBIDO)]],
    // Sin cliente_id: se la reconoce por el teléfono de la ficha.
    '5492910000003' => ['nombre' => 'Clara', 'nombre_negocio' => 'Dermo Clara', 'transcript' => [
        $fila('humano', '2026-10-20 16:21:00', $LINK30), $fila('cliente', '2026-10-20 16:32:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-10-20 18:05:00', $RECIBIDO)]],
    // Recibieron el mismo link esos días y no pagaron.
    '5491130000004' => ['nombre' => 'Dai', 'nombre_negocio' => 'Burger Dai', 'transcript' => [$fila('humano', '2026-10-20 14:32:00', $LINK30)]],
    '5493410000005' => ['nombre' => 'Jere', 'nombre_negocio' => 'Liam', 'transcript' => [$fila('bot', '2026-10-20 16:30:00', $LINK30)]],
    // Ferretería Sur: bien vinculada. La charla la conoce la caché de clientes del bot.
    '5491140000006' => ['nombre' => 'Hugo', 'nombre_negocio' => 'Ferretería Sur', 'transcript' => [
        $fila('humano', '2026-10-21 18:00:00', $LINK20), $fila('cliente', '2026-10-22 10:02:00', 'Listo, ya me suscribí'), $fila('bot', '2026-10-22 10:20:00', $RECIBIDO)]],
    // El de la suscripción sin vincular.
    '5491150000007' => ['nombre' => 'Marcos', 'nombre_negocio' => 'Rey Motos', 'cliente_id' => 'REYMOTOS', 'transcript' => [
        $fila('humano', '2026-10-25 10:40:00', $LINK20), $fila('cliente', '2026-10-25 11:01:00', $COMPROBANTE, 'imagen')]],
    'TEST999' => ['transcript' => [$fila('humano', '2026-10-20 14:29:00', $LINK30)]],
];
$lista = [
    ['id' => 'clientes:VITAL', 'pre' => 'SUBLULA1', 'tel' => '2230000002', 'persona' => 'Tay', 'negocio' => 'Centro Vital', 'seguro' => true],
    ['id' => 'clientes:CLARA', 'pre' => 'SUBVITAL', 'tel' => '+54 9 291 000-0003', 'persona' => 'Clara', 'negocio' => 'Dermo Clara', 'seguro' => true],
    ['id' => 'clientes:LULA', 'pre' => 'SUBCLARA', 'tel' => '', 'persona' => '😎', 'negocio' => 'Tienda Lula', 'seguro' => true],
    ['id' => 'clientes:FERRE', 'pre' => 'SUBFERRE', 'tel' => '', 'persona' => 'Hugo', 'negocio' => 'Ferretería Sur', 'seguro' => true],
    ['id' => 'clientes:NOMBRE', 'pre' => 'SUBNOMBR', 'tel' => '1160000008', 'persona' => 'Marce Quiroga', 'negocio' => 'Estudio MQ', 'seguro' => true],
    ['id' => 'mantenimiento:WEBHOOK', 'pre' => 'SUBWEBHK', 'tel' => '', 'persona' => '', 'negocio' => 'Distribuidora Norte', 'seguro' => true],
    ['id' => 'clientes:NADA', 'pre' => 'SUBNADA1', 'tel' => '1160000009', 'persona' => 'Ce', 'negocio' => 'Vicenza', 'seguro' => false],
    ['id' => 'clientes:FANTASMA', 'pre' => 'SUBNOESTA', 'tel' => '1160000010', 'persona' => 'Beto', 'negocio' => 'Taller Beto', 'seguro' => true],
];
$cache = ['mantenimiento' => [
    ['id' => 'FERRE', 'origen' => 'clientes', 'clave' => '5491140000006', 'nombre' => 'Hugo', 'negocio' => 'Ferretería Sur', 'telefono' => ''],
]];
$r = wabot_audvinc_auditar(['mp' => $mp, 'convs' => $convs, 'lista' => $lista, 'cache' => $cache, 'ahora' => $ar('2026-11-23 10:00:00')]);
$v = [];
foreach ($r['vinculos'] as $x) $v[$x['id']] = $x;

caso('las charlas de prueba (TEST) no entran', !isset($r['charlas']['TEST999']) && count($r['charlas']) === 7, json_encode(array_keys($r['charlas'])));
caso('los tres del ciclo salen MAL', $v['clientes:VITAL']['estado'] === 'mal' && $v['clientes:CLARA']['estado'] === 'mal' && $v['clientes:LULA']['estado'] === 'mal',
    json_encode(array_map(function ($x) { return $x['estado']; }, $v)));
caso('la de Centro Vital es de Tienda Lula (archivo al minuto + recibido: 7 puntos contra 0)', $v['clientes:VITAL']['sugerido']['id'] === 'clientes:LULA'
    && $v['clientes:VITAL']['evidencia']['puntos'] === 7 && $v['clientes:VITAL']['evidencia']['segundo'] === 0, json_encode($v['clientes:VITAL']['evidencia']));
caso('la de Dermo Clara es de Centro Vital (9 puntos; la que solo recibió el link, 3)', $v['clientes:CLARA']['sugerido']['id'] === 'clientes:VITAL'
    && $v['clientes:CLARA']['evidencia']['puntos'] === 9 && $v['clientes:CLARA']['evidencia']['segundo'] === 3, json_encode($v['clientes:CLARA']['evidencia']));
caso('la de Tienda Lula es de Dermo Clara, reconocida por el teléfono', $v['clientes:LULA']['sugerido']['id'] === 'clientes:CLARA' && $v['clientes:LULA']['sugerido']['conocido'] === true);
caso('el sugerido trae la suscripción que tiene hoy', $v['clientes:VITAL']['sugerido']['pre'] === 'SUBCLARA' && $v['clientes:LULA']['sugerido']['pre'] === 'SUBVITAL');
caso('y a cada uno le dice cuál es la suya y quién la tiene', array_column($v['clientes:VITAL']['suya'], 'pre') === ['SUBVITAL']
    && $v['clientes:VITAL']['suya'][0]['vinculada_a']['id'] === 'clientes:CLARA'
    && array_column($v['clientes:CLARA']['suya'], 'pre') === ['SUBCLARA'] && array_column($v['clientes:LULA']['suya'], 'pre') === ['SUBLULA1'], json_encode($v['clientes:VITAL']['suya']));
caso('el bien vinculado sale OK por la charla (la conoce la caché del bot)', $v['clientes:FERRE']['estado'] === 'ok' && $v['clientes:FERRE']['prueba'] === 'charla', json_encode($v['clientes:FERRE']['evidencia']));
caso('sin charla, el titular que comparte el nombre: OK por nombre', $v['clientes:NOMBRE']['estado'] === 'ok' && $v['clientes:NOMBRE']['prueba'] === 'nombre');
caso('la ficha de Mantenimiento sin charla: OK, nace del webhook', $v['mantenimiento:WEBHOOK']['estado'] === 'ok' && $v['mantenimiento:WEBHOOK']['prueba'] === 'webhook');
caso('sin charla y sin nombre en común: sin prueba', $v['clientes:NADA']['estado'] === 'sin_prueba' && $v['clientes:NADA']['motivo'] === 'sin_charla');
caso('la suscripción que no está en Mercado Pago: sin prueba', $v['clientes:FANTASMA']['estado'] === 'sin_prueba' && $v['clientes:FANTASMA']['motivo'] === 'no_en_mp');
caso('el resumen', $r['resumen'] === ['total' => 8, 'ok' => 3, 'mal' => 3, 'sin_prueba' => 2, 'ok_charla' => 1, 'ok_nombre' => 1, 'ok_webhook' => 1], json_encode($r['resumen']));
caso('primero los MAL, después los sin prueba y al final los OK', array_column($r['vinculos'], 'estado') === ['mal', 'mal', 'mal', 'sin_prueba', 'sin_prueba', 'ok', 'ok', 'ok']);
caso('el reintento no se puntúa', !isset($r['evidencias']['SUBREIN2']));
caso('la vigente sin vincular aparece con su dueño', count($r['sin_vincular']) === 1 && $r['sin_vincular'][0]['pre'] === 'SUBLIBRE' && $r['sin_vincular'][0]['dueno']['id'] === 'clientes:REYMOTOS'
    && $r['sin_vincular'][0]['dueno']['conocido'] === false, json_encode($r['sin_vincular'][0]['dueno'] ?? null));

echo "\n=== Con los vínculos corregidos ===\n";
$bien = $lista;
$bien[0]['pre'] = 'SUBVITAL'; $bien[1]['pre'] = 'SUBCLARA'; $bien[2]['pre'] = 'SUBLULA1';
$r2 = wabot_audvinc_auditar(['mp' => $mp, 'convs' => $convs, 'lista' => $bien, 'cache' => $cache]);
caso('ya no hay ninguno MAL', $r2['resumen']['mal'] === 0 && $r2['resumen']['ok_charla'] === 4, json_encode($r2['resumen']));
$v2 = [];
foreach ($r2['vinculos'] as $x) $v2[$x['id']] = $x;
caso('Tienda Lula, sin teléfono en la ficha, se reconoce por el cliente_id de la charla', $v2['clientes:LULA']['estado'] === 'ok' && $v2['clientes:LULA']['prueba'] === 'charla');
caso('al que está bien no se le sugiere otra', $v2['clientes:VITAL']['suya'] === [] && $v2['clientes:VITAL']['sugerido'] === null);

echo "\n=== Casos finos ===\n";
// Dos altas de $20.000 con ocho minutos de diferencia: la primera sola no se define, y se aclara por descarte.
$mpDos = $mpCon([$sub('SUBGAMA1', '2026-11-03 10:00:00', 20000, 'Gabriel Ruiz'), $sub('SUBHUGO1', '2026-11-03 10:08:00', 20000, 'Hernan Sosa')]);
$convsDos = [
    '5491160000011' => ['nombre' => 'Gabi', 'nombre_negocio' => 'Gama', 'cliente_id' => 'GAMA', 'transcript' => [
        $fila('humano', '2026-11-03 09:50:00', $LINK20), $fila('cliente', '2026-11-03 10:03:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-11-03 10:05:00', $RECIBIDO)]],
    '5491160000012' => ['nombre' => 'Hernán', 'nombre_negocio' => 'Hache', 'cliente_id' => 'HACHE', 'transcript' => [
        $fila('humano', '2026-11-03 09:55:00', $LINK20), $fila('cliente', '2026-11-03 10:10:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-11-03 10:12:00', $RECIBIDO)]],
];
$subsDos = wabot_audvinc_suscripciones($mpDos);
$charlasDos = wabot_audvinc_charlas($convsDos);
$sola = wabot_audvinc_evidencia($subsDos['SUBGAMA1'], $charlasDos);
caso('mirada sola, la primera tiene dos charlas con 9 puntos: no es clara', $sola['clara'] === false && $sola['puntos'] === 9 && $sola['segundo'] === 9, json_encode([$sola['puntos'], $sola['segundo']]));
$evDos = wabot_audvinc_evidencias($subsDos, $charlasDos);
caso('la segunda es clara (el comprobante de la otra charla es de antes del alta)', $evDos['SUBHUGO1']['clara'] && $evDos['SUBHUGO1']['candidatos'][0]['clave'] === '5491160000012');
caso('y por descarte se aclara la primera', $evDos['SUBGAMA1']['clara'] && $evDos['SUBGAMA1']['candidatos'][0]['clave'] === '5491160000011', json_encode([$evDos['SUBGAMA1']['puntos'], $evDos['SUBGAMA1']['segundo']]));
$rDos = wabot_audvinc_auditar(['mp' => $mpDos, 'convs' => $convsDos, 'cache' => [], 'lista' => [
    ['id' => 'clientes:GAMA', 'pre' => 'SUBHUGO1', 'tel' => '', 'persona' => 'Gabi', 'negocio' => 'Gama', 'seguro' => true],
    ['id' => 'clientes:HACHE', 'pre' => 'SUBGAMA1', 'tel' => '', 'persona' => 'Hernán', 'negocio' => 'Hache', 'seguro' => true]]]);
caso('cruzados entre sí con minutos de diferencia: los dos MAL', $rDos['resumen']['mal'] === 2 && $rDos['vinculos'][0]['sugerido']['id'] === 'clientes:HACHE' && $rDos['vinculos'][1]['sugerido']['id'] === 'clientes:GAMA',
    json_encode($rDos['resumen']));

// Dos charlas que podrían ser (9 la del cliente, 7 la de otro): decide el nombre del titular.
$mpAmb = $mpCon([$sub('SUBMUNDO', '2026-10-29 18:01:00', 20000, 'Fabiana Jost')]);
$convsAmb = [
    '5493750000021' => ['nombre' => 'Fabiana', 'nombre_negocio' => 'Mundo', 'cliente_id' => 'MUNDO', 'transcript' => [
        $fila('humano', '2026-10-29 16:25:00', $LINK20), $fila('cliente', '2026-10-29 18:02:00', $COMPROBANTE, 'imagen'), $fila('humano', '2026-10-29 18:03:00', $RECIBIDO)]],
    '5491130000022' => ['nombre' => 'Sosa', 'nombre_negocio' => 'Sosa Hnos', 'cliente_id' => 'SOSA', 'transcript' => [
        $fila('humano', '2026-10-28 19:44:00', $LINK20), $fila('cliente', '2026-10-29 18:59:00', '[foto] Mandó un comprobante de transferencia por $20.000', 'imagen'), $fila('humano', '2026-10-29 19:09:00', $RECIBIDO)]],
];
$amb = function ($id, $persona) use ($mpAmb, $convsAmb) {
    return wabot_audvinc_auditar(['mp' => $mpAmb, 'convs' => $convsAmb, 'cache' => [], 'lista' => [['id' => $id, 'pre' => 'SUBMUNDO', 'tel' => '', 'persona' => $persona, 'negocio' => '', 'seguro' => true]]])['vinculos'][0];
};
$x = $amb('clientes:MUNDO', 'Fabiana');
caso('su charla apunta más que la del otro y el titular se llama como él: OK por nombre', $x['estado'] === 'ok' && $x['prueba'] === 'nombre' && $x['evidencia']['clara'] === false, json_encode([$x['estado'], $x['motivo']]));
$x = $amb('clientes:SOSA', 'Fabiana Sosa');
caso('si la que apunta más es la de otro, el nombre no alcanza: sin prueba', $x['estado'] === 'sin_prueba' && $x['motivo'] === 'ambigua', json_encode([$x['estado'], $x['prueba']]));

// La charla del pago es de otro número del mismo negocio, sin ficha atada: no es un cruce.
$mpOtro = $mpCon([$sub('SUBPANAD', '2026-11-10 12:00:00', 30000, 'Roberto Diaz')]);
$convsOtro = ['5491170000031' => ['nombre' => 'Ana', 'nombre_negocio' => 'Panadería Sol', 'transcript' => [
    $fila('humano', '2026-11-10 11:50:00', $LINK30), $fila('cliente', '2026-11-10 12:02:00', $COMPROBANTE, 'imagen')]]];
$otro = function ($negocio) use ($mpOtro, $convsOtro) {
    return wabot_audvinc_auditar(['mp' => $mpOtro, 'convs' => $convsOtro, 'cache' => [], 'lista' => [['id' => 'clientes:SOL', 'pre' => 'SUBPANAD', 'tel' => '1199990000', 'persona' => 'Juan', 'negocio' => $negocio, 'seguro' => true]]])['vinculos'][0];
};
$x = $otro('Panadería Sol');
caso('charla sin ficha del mismo negocio: OK, con la nota', $x['estado'] === 'ok' && $x['prueba'] === 'charla' && strpos($x['nota'], '5491170000031') !== false, json_encode([$x['estado'], $x['nota']]));
$x = $otro('Gomería Ruta 3');
caso('charla sin ficha de otro negocio: MAL, y dice que no tiene ficha', $x['estado'] === 'mal' && $x['sugerido']['conocido'] === false && $x['sugerido']['clave'] === '5491170000031'
    && strpos(wabot_audvinc_explicacion($x), 'sin ficha identificada') !== false, wabot_audvinc_explicacion($x));

// Dos webs de la misma persona (dos fichas con el mismo teléfono, dos suscripciones en la misma charla).
$mpWebs = $mpCon([$sub('SUBWEB01', '2026-10-05 10:00:00', 20000, 'Moni Gramajo'), $sub('SUBWEB02', '2026-11-08 17:00:00', 30000, 'Moni Gramajo')]);
$convsWebs = ['5493810000041' => ['nombre' => 'Moni', 'nombre_negocio' => 'Revo', 'cliente_id' => 'WEB1', 'transcript' => [
    $fila('humano', '2026-10-05 09:30:00', $LINK20), $fila('cliente', '2026-10-05 10:02:00', $COMPROBANTE, 'imagen'),
    $fila('humano', '2026-11-08 16:40:00', $LINK30), $fila('cliente', '2026-11-08 17:03:00', $COMPROBANTE, 'imagen')]]];
$rWebs = wabot_audvinc_auditar(['mp' => $mpWebs, 'convs' => $convsWebs, 'cache' => [], 'lista' => [
    ['id' => 'clientes:WEB1', 'pre' => 'SUBWEB01', 'tel' => '3810000041', 'persona' => 'Moni', 'negocio' => 'Revo', 'seguro' => true],
    ['id' => 'clientes:WEB2', 'pre' => 'SUBWEB02', 'tel' => '381 000-0041', 'persona' => 'Moni', 'negocio' => 'Revo Cursos', 'seguro' => true]]]);
caso('dos webs de la misma persona, cada una con la suya: las dos OK y sin sugerencias', $rWebs['resumen']['ok_charla'] === 2 && $rWebs['vinculos'][0]['suya'] === [] && $rWebs['vinculos'][1]['suya'] === [], json_encode($rWebs['resumen']));

// Vinculado por el nombre a una suscripción sin charla, pero su charla señala otra vigente: a mirar.
$mpSuya = $mpCon([$sub('SUBVIEJA', '2026-09-01 10:00:00', 20000, 'Carla Mendez'), $sub('SUBNUEVA', '2026-11-12 15:00:00', 20000, 'Carla Mendez')]);
$convsSuya = ['5491180000051' => ['nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco', 'cliente_id' => 'CARLA', 'transcript' => [
    $fila('humano', '2026-11-12 14:50:00', $LINK20), $fila('cliente', '2026-11-12 15:02:00', $COMPROBANTE, 'imagen')]]];
$x = wabot_audvinc_auditar(['mp' => $mpSuya, 'convs' => $convsSuya, 'cache' => [], 'lista' => [
    ['id' => 'clientes:CARLA', 'pre' => 'SUBVIEJA', 'tel' => '', 'persona' => 'Carla Mendez', 'negocio' => 'Carla Deco', 'seguro' => true]]])['vinculos'][0];
caso('su charla señala otra suscripción vigente: sin prueba, con la sugerencia', $x['estado'] === 'sin_prueba' && $x['motivo'] === 'otra_suya' && array_column($x['suya'], 'pre') === ['SUBNUEVA'], json_encode([$x['estado'], $x['motivo']]));

echo "\n=== Lo que recibe el admin y el informe ===\n";
$adm = wabot_audvinc_para_admin($r);
$va = [];
foreach ($adm['vinculos'] as $x) $va[$x['id']] = $x;
caso('el JSON entra en json_encode y trae el resumen', is_string(json_encode($adm)) && $adm['ok'] === true && $adm['resumen']['mal'] === 3);
caso('la fila MAL dice de quién es y cuál es la suya', $va['clientes:VITAL']['estado'] === 'mal' && $va['clientes:VITAL']['sugerido']['quien'] === 'Tienda Lula'
    && $va['clientes:VITAL']['sugerido']['id'] === 'clientes:LULA' && $va['clientes:VITAL']['suya'][0]['pre'] === 'SUBVITAL'
    && strpos($va['clientes:VITAL']['suya'][0]['texto'], 'hoy vinculada a Dermo Clara') !== false, json_encode($va['clientes:VITAL'], JSON_UNESCAPED_UNICODE));
caso('el texto cuenta la evidencia con sus horas', strpos($va['clientes:CLARA']['texto'], 'es de Centro Vital (Tay)') !== false && strpos($va['clientes:CLARA']['texto'], 'link de $30.000 el 20/10 14:29') !== false
    && strpos($va['clientes:CLARA']['texto'], 'comprobante 3 min después') !== false, $va['clientes:CLARA']['texto']);
$subsAdm = (array)$adm['subs'];
caso('por suscripción: la charla que la prueba y sus fichas', ($subsAdm['SUBVITAL']['fichas'] ?? null) === ['clientes:VITAL'] && $subsAdm['SUBVITAL']['cliente_id'] === 'VITAL'
    && $subsAdm['SUBCLARA']['tels'] === ['2910000003'] && $subsAdm['SUBLIBRE']['cliente_id'] === 'REYMOTOS' && !isset($subsAdm['SUBNADA1']), json_encode(array_keys($subsAdm)));
caso('no manda las charlas ni los teléfonos de la lista', !isset($adm['charlas']) && !isset($adm['lista']) && strpos(json_encode($adm), '1160000009') === false);
$informe = wabot_audvinc_informe($r);
caso('el informe arranca con el resultado', strpos($informe, 'Resultado: 3 MAL · 2 sin prueba · 3 OK (1 por la charla, 1 por el nombre del titular, 1 ficha del webhook)') !== false, strtok($informe, "\n"));
caso('nombra cada cruce y la suscripción que le toca a cada uno', strpos($informe, 'La charla dice que esta suscripción es de Tienda Lula') !== false
    && strpos($informe, 'la suya, según su charla: SUBVITAL') !== false && strpos($informe, 'hoy vinculada a Dermo Clara') !== false, $informe);
caso('sin --detalle no lista los OK; con --detalle sí', strpos($informe, 'Ferretería Sur') === false && strpos(wabot_audvinc_informe($r, true), 'Ferretería Sur') !== false);
caso('avisa la vigente sin vincular', strpos($informe, 'sin vincular en el admin, con charla clara (1)') !== false && strpos($informe, 'es de Rey Motos (Marcos)') !== false);
caso('termina diciendo que no cambió nada', strpos($informe, 'No se cambió nada.') !== false);

/* El bot no le escribe al cliente de un vínculo cruzado (cobros-rechazados.php): la lista de cruzados
 * sale de esta auditoría, se guarda en el estado y se rehace si cambia la lista o pasan 6 h. */
echo "\n=== El freno del bot: los cruzados para las plantillas de pago ===\n";
$GLOBALS['WABOT_TEST_AUDVINC'] = ['convs' => $convs, 'cache' => $cache];
$pedidos = 0;
$mpContado = function ($ruta) use ($mp, &$pedidos) { $pedidos++; return $mp($ruta); };
$t0 = $ar('2026-11-23 11:00:00');
$est = ['lista' => $lista, 'conocidos' => []];
$cz = wabot_cobro_rech_cruzados($est, $mpContado, $t0);
$clavesCz = array_keys($cz);
sort($clavesCz);
caso('los tres del ciclo, cada uno con de quién es', $clavesCz === ['clientes:CLARA|SUBVITAL', 'clientes:LULA|SUBCLARA', 'clientes:VITAL|SUBLULA1']
    && $cz['clientes:VITAL|SUBLULA1']['quien'] === 'Tienda Lula' && $cz['clientes:CLARA|SUBVITAL']['quien'] === 'Centro Vital (Tay)', json_encode($cz, JSON_UNESCAPED_UNICODE));
caso('por fila: el cruzado sí, el bien vinculado no', (wabot_cobro_rech_cruzado($est, $lista[0], $mpContado, $t0)['quien'] ?? '') === 'Tienda Lula'
    && wabot_cobro_rech_cruzado($est, $lista[3], $mpContado, $t0) === null);
$antes = $pedidos;
wabot_cobro_rech_cruzados($est, $mpContado, $t0 + 3600);
caso('queda guardada: una hora después no vuelve a pedirle nada a Mercado Pago', $pedidos === $antes && ($est['cruzados']['ts'] ?? 0) === $t0 && count($est['cruzados']['mapa']) === 3);
wabot_cobro_rech_cruzados($est, $mpContado, $t0 + 7 * 3600);
caso('a las 7 h se rehace', $pedidos > $antes && $est['cruzados']['ts'] === $t0 + 7 * 3600);
$antes = $pedidos;
$est['lista'] = $bien;
caso('Pablo corrige los vínculos (cambia la lista): se rehace y ya no hay cruzados', wabot_cobro_rech_cruzados($est, $mpContado, $t0 + 8 * 3600) === [] && $pedidos > $antes);
// Lo que el admin mandó alguna vez y ya no está en la lista (una cancelada) también se mira.
$est2 = ['lista' => [], 'conocidos' => ['SUBLULA1' => $lista[0] + ['visto_ts' => $t0]]];
caso('los «conocidos» fuera de la lista también se auditan', array_keys(wabot_cobro_rech_cruzados($est2, $mpContado, $t0)) === ['clientes:VITAL|SUBLULA1']);
$est3 = ['lista' => $lista, 'conocidos' => [], 'cruzados' => ['firma' => 'otra', 'ts' => $t0, 'mapa' => ['clientes:VITAL|SUBLULA1' => ['quien' => 'Tienda Lula']]]];
$czFalla = wabot_cobro_rech_cruzados($est3, function () { throw new RuntimeException('MP caído'); }, $t0 + 60);
caso('si la auditoría falla vale lo último que se supo', array_keys($czFalla) === ['clientes:VITAL|SUBLULA1'] && $est3['cruzados']['firma'] === 'otra');
unset($GLOBALS['WABOT_TEST_AUDVINC']);
caso('en las otras suites (sin red ni disco) no corre', wabot_cobro_rech_cruzados($est, function () { throw new RuntimeException('no debería llamar'); }, $t0 + 9 * 3600) === []);

echo "\n=== Solo lectura ===\n";
// El código sin los comentarios (que nombran lo que NO se usa).
$fuente = '';
foreach (token_get_all((string)file_get_contents(__DIR__ . '/auditar-vinculos.php')) as $tk) {
    $fuente .= is_array($tk) ? (in_array($tk[0], [T_COMMENT, T_DOC_COMMENT], true) ? '' : $tk[1]) : $tk;
}
caso('la librería no escribe archivos, ni charlas, ni manda mensajes', !preg_match('/file_put_contents|fopen\(|unlink\(|rename\(|mkdir\(|wabot_json_guardar|wabot_conv_save|wabot_conv_load|wabot_enviar|wabot_push_enviar|CURLOPT_POST|wabot_cobro_rech_guardar/', $fuente));
caso('lo único que sale por fwrite es a STDERR', preg_match_all('/fwrite\(/', $fuente) === preg_match_all('/fwrite\(STDERR/', $fuente));
$admin = (string)file_get_contents(__DIR__ . '/admin.php');
caso('el panel lo entrega por GET, solo con la sesión iniciada', (bool)preg_match('/\$logueado && \$_SERVER\[\'REQUEST_METHOD\'\] === \'GET\' && \(\$_GET\[\'accion\'\] \?\? \'\'\) === \'auditar_vinculos_json\'/', $admin));

todo_ok();
