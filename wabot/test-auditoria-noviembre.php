<?php
/** Regresiones del historial 1–4 noviembre. Sin red ni mensajes reales. */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/pagos.php';
$cfg = wabot_config_load();
$ahora = time();

$c = conv_nueva('AUDITORIATEST', ['ultimo_cliente_ts' => $ahora - 200]);
$c['transcript'] = [
    ['q' => 'cliente', 't' => 'Quiero una web', 'ts' => $ahora - 200],
    ['q' => 'bot', 't' => 'Te escribo por última vez por lo de la web.', 'ts' => $ahora - 100],
];
caso('una última llamada del historial bloquea el seguimiento aunque falte la marca', wabot_seguimiento_finalizado($c)
    && !wabot_plantillas_auto_contacto_ok($c, $ahora) && wabot_template_interesado_enviar($c, $cfg, true) === 'ya');
$c['ultimo_cliente_ts'] = $ahora;
$c['transcript'][] = ['q' => 'cliente', 't' => 'Hola, retomamos', 'ts' => $ahora];
caso('el cliente puede retomar después de la última llamada', !wabot_seguimiento_finalizado($c));

$c['transcript'] = [['q' => 'cliente', 't' => 'Puedo dar clases en vivo?', 'ts' => $ahora], ['q' => 'cliente', 't' => 'Vuelvo a la tarde', 'ts' => $ahora]];
$tanda = "Puedo dar clases en vivo?\nVuelvo a la tarde";
caso('recupera la pregunta anterior al último mensaje', wabot_comercial_tanda_pendiente('Vuelvo a la tarde', $c) === $tanda);
caso('no duplica una tanda que ya llegó completa', wabot_comercial_tanda_pendiente($tanda, $c) === $tanda);
caso('si el disparador era el primero, incorpora el mensaje recién llegado sin duplicarlo', wabot_comercial_tanda_pendiente('Puedo dar clases en vivo?', $c) === $tanda);
$c['transcript'][] = ['q' => 'humano', 't' => 'Sí, por Zoom o Meet', 'ts' => $ahora];
caso('no vuelve a preguntar lo que ya respondió Pablo', wabot_comercial_tanda_pendiente('Gracias', $c) === 'Gracias');

$oficial = $cfg['plantillas']['presentar_demo']['texto'];
caso('recupera saltos de la plantilla oficial guardada como input', wabot_plantilla_restaurar_saltos(str_replace(["\r", "\n"], '', $oficial), $oficial) === $oficial);
caso('respeta una plantilla personalizada', wabot_plantilla_restaurar_saltos('Texto personalizado', $oficial) === 'Texto personalizado');
caso('las billeteras requieren API y los envíos de tienda están incluidos', str_contains($cfg['info']['medios_pago_tienda'], 'API') && str_contains($cfg['info']['envios'], 'ya vienen integrados'));

$c = conv_nueva('AUDITORIATEST', ['control_manual' => true, 'ultimo_cliente_ts' => $ahora, 'pago_ts' => $ahora]);
$enviados = [];
$deps = ['ventana_abierta' => true, 'enviar' => function (&$c, $texto) use (&$enviados) { $enviados[] = $texto; return true; }];
caso('si Pablo tiene el control, confirmar pago no agrega un mensaje', wabot_pago_recibido_enviar($c, $cfg, $ahora, $deps) === [] && $enviados === []);
$c = conv_nueva('AUDITORIATEST', ['ultimo_cliente_ts' => $ahora, 'pago_ts' => $ahora]);
wabot_pago_recibido_enviar($c, $cfg, $ahora, $deps);
caso('la confirmación automática se envía una sola vez', count($enviados) === 1 && wabot_pago_recibido_enviar($c, $cfg, $ahora, $deps) === [] && count($enviados) === 1);

// Archivos sintéticos exclusivos; no se reescribe ninguna conversación existente.
wabot_ensure_dirs();
$id = 'AUDITORIA' . getmypid() . 'TEST';
$igKey = 'ig' . $id;
$waKey = '999000' . str_pad((string)getmypid(), 8, '0', STR_PAD_LEFT);
$paths = [WABOT_DATA . '/conv/' . $igKey . '.json', WABOT_DATA . '/conv/' . $waKey . '.json', WABOT_DATA . '/ig-profile/' . $id . '.json'];
foreach ($paths as $p) { if (file_exists($p)) throw new RuntimeException('La ruta de prueba ya existe'); }
try {
    $ig = ['conversation_key' => $igKey, 'canal' => 'instagram', 'channel_user_id' => $id, 'telefono_wsp' => $waKey, 'form_link_mandado_ts' => $ahora - 100];
    file_put_contents($paths[0], json_encode($ig));
    file_put_contents($paths[1], json_encode(['form_completado_ts' => $ahora, 'instagram' => 'regresion.test']));
    caso('Instagram reconoce el formulario completado en WhatsApp por teléfono', wabot_form_completado_otro_canal($ig));
    unset($ig['telefono_wsp']);
    file_put_contents($paths[0], json_encode($ig));
    file_put_contents($paths[2], json_encode(['nombre' => 'Negocio', 'username' => 'regresion.test']));
    caso('sin teléfono, cruza el usuario exacto de Meta con el Instagram del formulario', wabot_form_completado_otro_canal($ig));
    file_put_contents($paths[1], json_encode(['form_completado_ts' => $ahora, 'nombre' => 'Negocio', 'instagram' => 'otro.negocio']));
    caso('no cruza personas por tener el mismo nombre visible', !wabot_form_completado_otro_canal($ig));
} finally {
    foreach ($paths as $p) unlink($p);
}
todo_ok();
