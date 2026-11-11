<?php
/**
 * wabot/test-guardado.php — guardar la charla sin pisar lo que guardó otro proceso,
 * el freno de intentos y la plantilla de seguimiento (auditoría del 10-nov-2026), sin red:
 *
 *   php wabot/test-guardado.php
 *
 * El panel, «Presentar» y varios avisos cargan la charla, tardan segundos y la guardan
 * entera sin el candado del webhook. Si en el medio guardaba otro proceso, el último
 * pisaba al primero. Ahora wabot_conv_save aplica solo los cambios propios sobre lo que
 * hay en disco. En un solo proceso el «otro» se simula olvidando que el guardado fue nuestro.
 */

require_once __DIR__ . '/test-lib.php';

$k = '5491100009990TEST';
$otroProceso = function () use ($k) { unset($GLOBALS['WABOT_CONV_PROPIAS'][$k]); };
$limpiar = function () use ($k) { @unlink(wabot_conv_path($k)); unset($GLOBALS['WABOT_CONV_PROPIAS'][$k]); $GLOBALS['WABOT_CONV_BASES'] = []; };
$textos = function ($c) { return array_map(function ($x) { return (string)$x['t']; }, (array)$c['transcript']); };
$limpiar();

echo "— 1. Sin cambios ajenos se guarda como siempre —\n";
$a = wabot_conv_load($k);
caso('una charla nueva no trae firma de carga', !isset($a['_cargada']));
$a['nombre'] = 'Ana';
wabot_conv_transcript($a, 'cliente', 'Hola');
wabot_conv_save($a);
$b = wabot_conv_load($k);
caso('al cargarla de disco queda la firma', ($b['_cargada'] ?? '') !== '' && ($b['nombre'] ?? '') === 'Ana' && count($b['transcript']) === 1);
caso('la firma no se guarda en el archivo', strpos((string)file_get_contents(wabot_conv_path($k)), '_cargada') === false);
$b['colores'] = 'azul';
wabot_conv_save($b);
$b2 = wabot_conv_load($k);
caso('guardar de nuevo no duplica nada', ($b2['colores'] ?? '') === 'azul' && count($b2['transcript']) === 1);

echo "\n— 2. Pablo contesta desde el panel mientras el webhook tiene la charla en memoria —\n";
$webhook = wabot_conv_load($k);
$panel = wabot_conv_load($k);
wabot_conv_transcript($panel, 'humano', 'Te contesto yo por acá');
wabot_conv_tomar_control($panel);
wabot_conv_save($panel);
$otroProceso();
wabot_conv_transcript($webhook, 'cliente', 'Otra consulta');
$webhook['ultimo_cliente_ts'] = 1794000000;
wabot_conv_save($webhook);
$f = wabot_conv_load($k);
caso('quedan los tres renglones: el de antes, el de Pablo y el nuevo del cliente', $textos($f) === ['Hola', 'Te contesto yo por acá', 'Otra consulta'], json_encode($textos($f), JSON_UNESCAPED_UNICODE));
caso('la charla sigue tomada por Pablo', !empty($f['control_manual']) && !empty($f['bot_off']));
caso('y lo que tocó el webhook también quedó', (int)$f['ultimo_cliente_ts'] === 1794000000);

echo "\n— 3. Sale la demo mientras entra un mensaje del cliente —\n";
$presentar = wabot_conv_load($k);
$entrante = wabot_conv_load($k);
wabot_conv_transcript($entrante, 'cliente', '¿Ya está la demo?');
wabot_conv_save($entrante);
$otroProceso();
$presentar['presentado_ts'] = 1794000500;
$presentar['presentado_slug'] = 'kioscoana';
wabot_conv_transcript($presentar, 'bot', 'Ya preparamos la demo para tu web');
wabot_conv_save($presentar);
$f = wabot_conv_load($k);
caso('no se pierde el mensaje del cliente ni la marca de demo presentada', in_array('¿Ya está la demo?', $textos($f), true) && in_array('Ya preparamos la demo para tu web', $textos($f), true)
    && (int)$f['presentado_ts'] === 1794000500 && ($f['presentado_slug'] ?? '') === 'kioscoana', json_encode($textos($f), JSON_UNESCAPED_UNICODE));

echo "\n— 4. Casos borde —\n";
$x = wabot_conv_load($k);
$y = wabot_conv_load($k);
$y['favorito'] = true;
wabot_conv_save($y);
$otroProceso();
unset($x['colores']);
$x['referencia'] = 'adidas.com';
wabot_conv_save($x);
$f = wabot_conv_load($k);
caso('una clave que borramos se borra, la nuestra se guarda y la ajena se respeta', empty($f['colores']) && ($f['referencia'] ?? '') === 'adidas.com' && !empty($f['favorito']));

$x = wabot_conv_load($k);
$n = count($x['transcript']);
wabot_conv_transcript($x, 'bot', 'Uno');
wabot_conv_save($x);
wabot_conv_transcript($x, 'bot', 'Dos');
wabot_conv_save($x);
$f = wabot_conv_load($k);
caso('guardar varias veces la misma charla en un proceso no repite renglones', count($f['transcript']) === $n + 2);

$x = wabot_conv_load($k);
$n = count($x['transcript']);
wabot_conv_transcript($x, 'bot', 'Tres');
wabot_conv_save($x);
$y = wabot_conv_load($k);
wabot_conv_transcript($y, 'cliente', 'Del cliente');
wabot_conv_save($y);
$otroProceso();
wabot_conv_transcript($x, 'bot', 'Cuatro');
wabot_conv_save($x);
$f = wabot_conv_load($k);
$veces = array_count_values($textos($f));
caso('con un guardado ajeno entre dos propios: nada se repite ni se pierde', count($f['transcript']) === $n + 3 && ($veces['Tres'] ?? 0) === 1 && ($veces['Cuatro'] ?? 0) === 1 && ($veces['Del cliente'] ?? 0) === 1,
    json_encode($textos($f), JSON_UNESCAPED_UNICODE));

$x = wabot_conv_load($k);
$y = wabot_conv_load($k);
wabot_conv_transcript($y, 'cliente', 'Llega en el medio');
wabot_conv_save($y);
$otroProceso();
$x['transcript'][0]['t'] = 'Hola (editado)';
wabot_conv_save($x);
$f = wabot_conv_load($k);
caso('si reescribe renglones (editar un mensaje) vale su versión entera, como antes', ($f['transcript'][0]['t'] ?? '') === 'Hola (editado)' && !in_array('Llega en el medio', $textos($f), true));

$x = wabot_conv_load($k);
$y = wabot_conv_load($k);
$y['nombre'] = 'Otra';
wabot_conv_save($y);
$otroProceso();
$GLOBALS['WABOT_CONV_BASES'] = [];   // la carga quedó muy atrás (un cron que recorre miles de charlas)
$x['estilo'] = 'moderno';
wabot_conv_save($x);
$f = wabot_conv_load($k);
caso('sin el recuerdo de la carga se guarda como siempre (pisa)', ($f['estilo'] ?? '') === 'moderno' && ($f['nombre'] ?? '') === 'Ana');

echo "\n— 5. El freno de intentos: cada clave con su ventana —\n";
$t0 = time() - 3 * 3600;
$kr = 'prueba-' . getmypid();
$cinco = true;
for ($i = 0; $i < 5; $i++) $cinco = wabot_form_rate_ok("login:$kr", 5, 900, $t0 + $i) && $cinco;
caso('cinco intentos pasan y el sexto se frena', $cinco && !wabot_form_rate_ok("login:$kr", 5, 900, $t0 + 10));
caso('a los 15 minutos vuelve a dejar', wabot_form_rate_ok("login:$kr", 5, 900, $t0 + 920));
caso('el tope por hora cuenta dos envíos', wabot_form_rate_ok("hora:$kr", 2, 3600, $t0) && wabot_form_rate_ok("hora:$kr", 2, 3600, $t0 + 60));
wabot_form_rate_ok("form:$kr", 10, 600, $t0 + 1500);   // otra clave, con ventana de 10 minutos
caso('y un pedido con otra ventana no le borra la cuenta', !wabot_form_rate_ok("hora:$kr", 2, 3600, $t0 + 1600));
caso('pasada la hora deja de nuevo', wabot_form_rate_ok("hora:$kr", 2, 3600, $t0 + 3700));

echo "\n— 6. La plantilla de seguimiento no le sale a quien ya pagó —\n";
$cv = conv_nueva('5491100009991TEST', ['canal' => 'whatsapp']);
caso('sin pago, puede salir', wabot_plantillas_auto_contacto_ok($cv, time()) === true);
caso('con el pago confirmado, no', wabot_plantillas_auto_contacto_ok(['pago_confirmado_ts' => time() - 86400] + $cv, time()) === false);
caso('con el aviso de pago tampoco (como antes)', wabot_plantillas_auto_contacto_ok(['pago_avisado_ts' => time() - 86400] + $cv, time()) === false);

echo "\n— 7. Chats que lleva Pablo: sin demora y el bot cede —\n";
caso('con el bot apagado del todo no hay demora', wabot_conv_sin_bot($k, ['activo' => false]) === true);
$z = wabot_conv_load($k);
$z['control_manual'] = false; $z['bot_off'] = false; $z['pausado_hasta'] = 0;
wabot_conv_save($z);
caso('con el bot atendiendo, la demora de siempre', wabot_conv_sin_bot($k, ['activo' => true]) === false);
wabot_conv_tomar_control($z);
wabot_conv_save($z);
caso('tomada por Pablo: el mensaje entra enseguida', wabot_conv_sin_bot($k, ['activo' => true]) === true);
$z2 = wabot_conv_load($k);
$z2['control_manual'] = false; $z2['bot_off'] = true; $z2['cierre'] = 'baja';
wabot_conv_save($z2);
caso('la baja pedida por el cliente conserva la demora (el bot puede volver a contestar)', wabot_conv_sin_bot($k, ['activo' => true]) === false);

echo "\n— 8. Mensajes varados en la cola —\n";
$limpiar();
$base = wabot_conv_load($k);
wabot_conv_transcript($base, 'bot', 'Hola cómo estás?');
wabot_conv_save($base);
wabot_cola_drenar($k);
wabot_cola_encolar($k, 'Ah, y el logo es este', 'Ah, y el logo es este', 'Ana', null, 'wamid.PRUEBA1');
caso('un mensaje recién encolado no se toca (se lo lleva el webhook)', (wabot_cola_barrer(time(), 120)['mensajes'] ?? -1) === 0 || wabot_cola_tiene($k));
touch(wabot_cola_path($k), time() - 300);
$rb = wabot_cola_barrer();
$f = wabot_conv_load($k);
caso('a los minutos el barrido lo pasa a la charla', ($rb['rescatadas'] ?? 0) >= 1 && in_array('Ah, y el logo es este', $textos($f), true) && !wabot_cola_tiene($k), json_encode($rb));
caso('y queda pendiente para Pablo, con la hora en que escribió', !empty($f['handoff_pendiente']) && (int)$f['ultimo_cliente_ts'] > 0 && ($f['nombre'] ?? '') === 'Ana');
caso('una segunda pasada no lo repite', count(array_keys($textos(wabot_conv_load($k)), 'Ah, y el logo es este')) === 1 && (wabot_cola_barrer()['mensajes'] ?? 0) === 0);

echo "\n— 9. El reinicio a los 7 días limpia el flujo comercial y los datos por el chat —\n";
$cfgR = wabot_config_load();
$v = conv_nueva('5491100009992TEST', ['ultimo_ts' => time() - 9 * 86400, 'precio_dado' => true, 'datos_pedidos_ts' => time() - 9 * 86400,
    'datos_demo_parcial' => ['es_datos' => true], 'datos_demo_espera_ts' => time() - 9 * 86400, 'comercial_pausa' => 'formulario',
    'comercial_cotizacion' => ['plan' => 'panel', 'anual' => '$190.000', 'mensual' => '$30.000'], 'comercial_oferta_ts' => time() - 9 * 86400,
    'comercial_solucion' => 'tienda', 'link_form_enviado' => true, 'esProspecto' => true]);
$reinicio = wabot_conv_reset_si_vieja($v, $cfgR, time());
caso('la charla vieja se reinicia', $reinicio === true && ($v['fase'] ?? '') === 'nuevo' && empty($v['precio_dado']));
caso('sin datos pedidos ni espera de la charla anterior', empty($v['datos_pedidos_ts']) && !isset($v['datos_demo_parcial']) && !isset($v['datos_demo_espera_ts']) && !wabot_datos_demo_pendiente($v));
caso('sin cotización congelada, oferta ni pausa del flujo comercial', !isset($v['comercial_cotizacion']) && empty($v['comercial_oferta_ts']) && empty($v['comercial_pausa']) && empty($v['esProspecto']));
$v2 = conv_nueva('5491100009993TEST', ['datos_pedidos_ts' => time()]);
wabot_conv_transcript($v2, 'bot', wabot_datos_demo_texto(conv_nueva('5491100009993TEST'), $cfgR));
$v2['transcript'][0]['ts'] = time() - 20 * 86400;   // un pedido de la charla anterior
wabot_conv_transcript($v2, 'cliente', 'Dato viejo de la otra charla');
$v2['transcript'][1]['ts'] = time() - 20 * 86400;
$v2['datos_pedidos_ts'] = time();
wabot_conv_transcript($v2, 'bot', wabot_datos_demo_texto(conv_nueva('5491100009993TEST'), $cfgR));
wabot_conv_transcript($v2, 'cliente', 'Kiosco El Sol, golosinas y bebidas');
caso('los datos se leen desde el pedido de esta sesión, no desde uno viejo', wabot_datos_demo_texto_cliente($v2) === 'Kiosco El Sol, golosinas y bebidas', wabot_datos_demo_texto_cliente($v2));

$limpiar();
todo_ok();
