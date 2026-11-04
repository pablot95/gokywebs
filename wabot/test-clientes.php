<?php
/**
 * wabot/test-clientes.php — la pestaña Clientes del panel (clientes.php, 1-nov-2026):
 * los chats de los clientes nuevos con su etapa, y los de mantenimiento cruzados
 * con Firestore. Sin red: Firestore simulado.
 *
 *   php wabot/test-clientes.php
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/clientes.php';

$GLOBALS['WABOT_TEST_CLIENTES_CON_TEST'] = true;
$ahora = gmmktime(15, 0, 0, 11, 2, 2026);
$hace = function ($h) use ($ahora) { return $ahora - (int)($h * 3600); };

echo "Resumen de una charla\n";
$pagada = conv_nueva('5491111TEST01', ['nombre' => 'Ana', 'nombre_negocio' => 'Kiosco Ana', 'tipo' => 'ecommerce', 'presentado_slug' => 'kioscoana',
    'pago_confirmado_ts' => $hace(2), 'pago_ts' => $hace(3), 'pago_monto' => 30000, 'pago_modalidad' => 'mensual', 'pago_tipo' => 'suscripcion', 'cliente_id' => 'CLI1', 'pago_firestore' => 'ok',
    'onboarding' => ['inicio_ts' => $hace(2), 'paso' => 'imagenes']]);
$r = wabot_clientes_chat_resumen($pagada);
caso('trae nombre (el de la agenda), negocio, pago y onboarding', $r['nombre'] === wabot_nombre_agenda($pagada) && $r['negocio'] === 'Kiosco Ana' && $r['pago_monto'] === 30000 && $r['pago_modalidad'] === 'mensual' && $r['onboarding_paso'] === 'imagenes' && $r['onboarding_inicio'] > 0 && $r['cliente_id'] === 'CLI1' && $r['slug'] === 'kioscoana', json_encode($r));
caso('una charla sin pago, sin cliente ni teléfono no es de un cliente', wabot_clientes_chat_resumen(conv_nueva('igTEST99', ['nombre' => 'X'])) === null);
caso('una de WhatsApp sin pago sí puede serlo (por el teléfono)', wabot_clientes_chat_resumen(conv_nueva('5491150000002'))['tel'] === '5491150000002');

echo "Etapas\n";
caso('juntando datos (con el onboarding arrancado)', wabot_clientes_etapa($r + ['onboarding_inicio' => 1]) === 'juntando datos' || wabot_clientes_etapa(array_merge($r, ['onboarding_inicio' => 1])) === 'juntando datos');
caso('sin onboarding (lo de fábrica): la sigue Pablo', wabot_clientes_etapa(array_merge($r, ['onboarding_inicio' => 0])) === 'la sigue Pablo');
caso('listo para producción', wabot_clientes_etapa(array_merge($r, ['onboarding_completo' => 1])) === 'listo para producción');
caso('en producción', wabot_clientes_etapa(array_merge($r, ['onboarding_completo' => 1, 'produccion_pedido' => 2])) === 'en producción');
caso('entregada', wabot_clientes_etapa(array_merge($r, ['onboarding_completo' => 1, 'produccion_pedido' => 2, 'entregada_ts' => 3])) === 'entregada');

echo "Nuevos\n";
$vieja = conv_nueva('5491111TEST02', ['nombre' => 'Beto', 'tipo' => 'landing', 'pago_confirmado_ts' => $hace(50), 'pago_monto' => 60000, 'pago_modalidad' => 'anual', 'onboarding' => ['completo_ts' => $hace(40)]]);
$sinPago = conv_nueva('5491150000003', ['nombre' => 'Caro', 'cliente_id' => 'CLI3']);
$chats = wabot_clientes_chats(['5491111TEST01' => $pagada, '5491111TEST02' => $vieja, '5491150000003' => $sinPago]);
$nuevos = wabot_clientes_nuevos($chats);
caso('solo los pagados, el más nuevo primero, con su etapa', count($nuevos) === 2 && $nuevos[0]['clave'] === '5491111TEST01' && $nuevos[1]['etapa'] === 'listo para producción', json_encode(array_column($nuevos, 'clave')));

echo "Mantenimiento\n";
$fs = [
    'clientes' => [
        'CLI1' => ['nombre' => 'Ana', 'proyecto' => 'Kiosco Ana', 'planLabel' => 'Ecommerce', 'modalidad' => 'mensual', 'montoMensual' => 30000, 'estadoSuscripcion' => 'activa', 'preapprovalId' => 'sub-ana', 'suscripcionDesde' => '2026-10-15T15:00:00Z', 'dominio' => 'kioscoana.com.ar', 'clienteDesdeAt' => '2026-11-02T14:00:00Z', 'telefono' => '1150000001'],
        'CLI3' => ['nombre' => 'Caro', 'proyecto' => 'Café Caro', 'planLabel' => 'Sitio profesional', 'modalidad' => 'unico', 'valorTotal' => 140000, 'abono' => 60000, 'senaAt' => '2026-10-01T15:00:00Z', 'clienteDesdeAt' => '2026-10-01T15:00:00Z', 'propuestaSnapshot' => ['conversationKey' => '5491150000003'], 'entregadoAt' => '2026-10-10T15:00:00Z'],
        'CLI4' => ['nombre' => 'Dani', 'proyecto' => 'Dulces Dani', 'planLabel' => 'Ecommerce', 'modalidad' => 'mensual', 'montoMensual' => 30000, 'estadoSuscripcion' => 'activa', 'preapprovalId' => 'sub-dani', 'pagaPorFuera' => true, 'diaCobro' => 7, 'telefono' => '+54 9 11 5000-0004', 'clienteDesdeAt' => '2026-09-01T15:00:00Z'],
        'CLI5' => ['nombre' => 'Eva', 'proyecto' => 'Eva Uñas', 'planLabel' => 'Sitio profesional', 'modalidad' => 'propia', 'valorTotal' => 240000, 'abono' => 240000, 'telefono' => '', 'clienteDesdeAt' => '2026-08-01T15:00:00Z'],
    ],
    'mantenimiento' => [
        'sub1' => ['preapprovalId' => 'sub-ana', 'email' => 'ana@x.com', 'estado' => 'authorized', 'planLabel' => 'Plan $30.000', 'monto' => 30000, 'createdAt' => '2026-10-15T15:00:00Z'],
        'baja_sub-dani' => ['preapprovalId' => 'sub-dani', 'tipoEvento' => 'baja', 'estado' => 'cancelled'],
        'sub2' => ['preapprovalId' => 'sub-otro', 'email' => 'otro@x.com', 'estado' => 'authorized', 'planLabel' => 'Plan $20.000', 'monto' => 20000, 'whatsapp' => '5491150000004', 'createdAt' => '2026-10-20T15:00:00Z', 'fechaAlta' => '2026-10-20T15:00:00Z'],
    ],
];
$chats2 = wabot_clientes_chats(['5491111TEST01' => $pagada, '5491150000003' => $sinPago, '5491150000004' => conv_nueva('5491150000004', ['nombre' => 'Dani'])]);
$filas = wabot_clientes_mantenimiento($fs, $chats2);
$por = array_column($filas, null, 'id');
caso('cada cliente de Firestore es una fila, los más nuevos primero, y al final el suscriptor de MP sin ficha',
    array_column($filas, 'id') === ['CLI1', 'CLI3', 'CLI4', 'CLI5', 'sub2'], json_encode(array_column($filas, 'id')));
caso('el mensual: plan, mensualidad, dominio, suscripción activa y el día de cobro del alta (15)', $por['CLI1']['plan'] === 'Ecommerce Mensual' && $por['CLI1']['monto'] === 30000 && $por['CLI1']['dominio'] === 'kioscoana.com.ar' && $por['CLI1']['estado'] === 'activa' && $por['CLI1']['dia'] === 15);
caso('su chat se encuentra por cliente_id', $por['CLI1']['clave'] === '5491111TEST01');
caso('el anual: la seña cobrada, el saldo y cuándo renueva; el chat por la clave del boceto; entregada', $por['CLI3']['plan'] === 'Sitio profesional Anual' && strpos($por['CLI3']['estado'], 'saldo $80.000') !== false && strpos($por['CLI3']['estado'], 'renueva 1/10/2027') !== false && $por['CLI3']['clave'] === '5491150000003' && $por['CLI3']['entregada'] === true, $por['CLI3']['estado']);
caso('la baja avisada por MP se ve, y "paga por afuera" con su día; el chat por teléfono', $por['CLI4']['estado'] === 'baja en MP · paga por afuera' && $por['CLI4']['dia'] === 7 && $por['CLI4']['clave'] === '5491150000004', json_encode($por['CLI4']));
caso('el pago único pagado del todo, sin chat', $por['CLI5']['plan'] === 'Sitio profesional Pago único' && $por['CLI5']['estado'] === 'pagado' && $por['CLI5']['clave'] === '');
caso('el suscriptor de MP sin ficha: email como nombre, plan, "solo en MP", día del alta (20) y el chat por su WhatsApp',
    $por['sub2']['nombre'] === 'otro@x.com' && $por['sub2']['estado'] === 'authorized · solo en MP' && $por['sub2']['dia'] === 20 && $por['sub2']['clave'] === '5491150000004' && $por['sub2']['origen'] === 'mantenimiento', json_encode($por['sub2']));
caso('el suscriptor de MP que ya está en un cliente no se repite', !isset($por['sub1']));

echo "Quién la pinta\n";
$admin = (string)file_get_contents(__DIR__ . '/admin.php');
caso('la pestaña existe y usa los datos de clientes.php', strpos($admin, "'clientes'       => 'Clientes'") !== false && strpos($admin, "\$tab === 'clientes'") !== false && strpos($admin, 'wabot_clientes_datos(') !== false);
caso('la ficha muestra el pago y tiene el botón Confirmar pago', strpos($admin, 'wabot_pago_resumen_ficha($conv)') !== false && strpos($admin, "value=\"pago_confirmar_manual\"") !== false);
caso('los pagos sin asignar se asignan e ignoran desde la pestaña', strpos($admin, "\$a === 'pago_asignar'") !== false && strpos($admin, "\$a === 'pago_ignorar'") !== false);

echo "— Vista Clientes de Conversaciones (2-nov) —\n";
// Pablo: «Clientes, quiero que sea solo una pestaña, al lado de Todos, que me muestre los chats de los que ya son clientes».
$cacheVista = sys_get_temp_dir() . '/wabot-clientes-vista-' . getmypid() . '.json';
$GLOBALS['WABOT_TEST_CLIENTES_CACHE'] = $cacheVista;
file_put_contents($cacheVista, json_encode(['ts' => $ahora, 'nuevos' => [['clave' => '5491100007001TEST']],
    'mantenimiento' => [['clave' => '5491100007002TEST'], ['clave' => '']]]));
$marcados = wabot_clientes_marcar_lista([['tel' => '5491100007001TEST'], ['tel' => '5491100007002TEST'], ['tel' => '5491100007003TEST', 'pago_confirmado' => true], ['tel' => '5491100007004TEST']]);
caso('marca como cliente al que pagó y al chat de un cliente del admin; al resto no', array_column($marcados, 'cliente') === [true, true, true, false], json_encode($marcados));
@unlink($cacheVista);
caso('sin la caché (todavía no corrió el cron) vale solo el pago confirmado', array_column(wabot_clientes_marcar_lista([['tel' => '5491100007002TEST'], ['tel' => 'x', 'pago_confirmado' => true]]), 'cliente') === [false, true]);
unset($GLOBALS['WABOT_TEST_CLIENTES_CACHE']);
$cvPago = conv_nueva('5491100007005TEST');
$cvPago['pago_confirmado_ts'] = $ahora - 3600;
wabot_conv_save($cvPago);
caso('la fila de la lista dice si ya pagó', !empty(wabot_lista_item('5491100007005TEST')['pago_confirmado']) && empty(wabot_lista_item('5491100007001TEST')['pago_confirmado']));
@unlink(wabot_conv_path('5491100007005TEST'));
$chips = substr($admin, (int)strpos($admin, 'id="convChips"'), 3000);
// 4-nov: a la vista quedan Sin leer · Nuevos · Con form · Demos · Clientes · Todos (Clientes sigue al lado de Todos, ahora antes).
caso('el filtro Clientes está al lado de Todos', (bool)preg_match('/data-grupo="clientes"[^\n]*>Clientes<\/button>\s*<button[^>]*data-grupo="todos_humano"[^>]*>Todos<\/button>/', $chips));
caso('a la vista quedan solo las seis vistas, en ese orden (4-nov)',
    preg_match_all('/<button type="button" class="conv-chip[^"]*" data-grupo="([a-z_]+)"/', substr($chips, 0, (int)strpos($chips, 'conv-chips-mas')), $mVistas) === 6
    && $mVistas[1] === ['no_leidos', 'nuevos', 'con_form', 'demos_presentadas', 'clientes', 'todos_humano'], json_encode($mVistas[1] ?? null));
$panelMas = substr($admin, (int)strpos($admin, 'id="convChipsPanel"'), 6000);
caso('los demás filtros siguen en «Más» y el canal se suma a la vista (4-nov)',
    strpos($panelMas, 'data-grupo="bot"') !== false && strpos($panelMas, 'data-grupo="archivado"') !== false
    && strpos($panelMas, 'data-canal="whatsapp"') !== false && strpos($panelMas, 'data-canal="instagram"') !== false
    && strpos($admin, 'return visibleEn(it, vistaActiva) && cumpleCanal(it);') !== false);
caso('el aviso de pagos de MP sin asignar ya no depende del filtro Clientes (4-nov)',
    strpos($admin, "avisoPagosEl.hidden = !filtrosActivos.has('clientes')") === false && strpos($admin, "'pagos_sin_asignar' => function_exists('wabot_pagos_sin_asignar')") !== false);
caso('filtra por la marca cliente, sin el vencimiento de 24 h', strpos($admin, "if (filtro === 'clientes') return !!it.cliente;") !== false
    && !preg_match("/VISTAS_CON_VENCIMIENTO = new Set\(\[[^\]]*'clientes'/", $admin));
caso('la lista del panel sale marcada', strpos($admin, "wabot_clientes_marcar_lista(wabot_lista_items())") !== false);
caso('Clientes ya no está en el menú de la derecha (la página queda para asignar pagos)', strpos($admin, "if (\$k === 'clientes' && \$tab !== 'clientes') continue;") !== false);
caso('el cron mantiene al día la caché de clientes', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_clientes_datos()') !== false);

todo_ok();
