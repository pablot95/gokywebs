<?php
/**
 * wabot/test-panel-envio.php — el mismo mensaje del panel no sale dos veces (7-oct-2026).
 *
 *   php wabot/test-panel-envio.php
 *
 * Pablo: "a veces se tilda y se manda dos veces el mismo mensaje". Prueba la
 * marca atómica de wabot_panel_envio_marcar() / _liberar(). Escribe en
 * wabot/data/panel-envios.json (archivo propio, no lo usa nadie más) y lo borra
 * al terminar.
 */
require_once __DIR__ . '/test-lib.php';

$archivo = WABOT_DATA . '/panel-envios.json';
$existia = file_exists($archivo);
$respaldo = $existia ? (string)file_get_contents($archivo) : '';
if ($existia) @unlink($archivo);

$ahora = 1_800_000_000;
$charla = '5491177770901TEST';
$texto = 'Buen día. Si recién estás arrancando con la venta de zapatillas, podemos armarte una tienda online';

echo "— Con envio_id (el panel nuevo) —\n";
caso('el primer envío es nuevo', wabot_panel_envio_marcar($charla, $texto, 'abc12345def', $ahora) === true);
caso('el mismo envio_id otra vez (se tildó y se reintentó) NO se manda', wabot_panel_envio_marcar($charla, $texto, 'abc12345def', $ahora + 4) === false);
caso('y tampoco un minuto después: el id vale una hora', wabot_panel_envio_marcar($charla, $texto, 'abc12345def', $ahora + 60) === false);
caso('otro envio_id con el MISMO texto es otro envío (Pablo lo quiso mandar de nuevo a propósito)',
    wabot_panel_envio_marcar($charla, $texto, 'zzz98765xyz', $ahora + 90) === true);
caso('el mismo envio_id en otra charla es otro envío', wabot_panel_envio_marcar('5491177770902TEST', $texto, 'abc12345def', $ahora + 5) === true);
caso('pasada la hora, el id vuelve a valer', wabot_panel_envio_marcar($charla, $texto, 'abc12345def', $ahora + 3601 + 5) === true);

echo "— Si el canal lo rechazó, se puede reintentar —\n";
caso('se marca', wabot_panel_envio_marcar($charla, 'hola', 'rechazado0001', $ahora) === true);
wabot_panel_envio_liberar($charla, 'hola', 'rechazado0001');
caso('liberado, el reintento con el mismo envio_id sale', wabot_panel_envio_marcar($charla, 'hola', 'rechazado0001', $ahora + 2) === true);

echo "— Sin envio_id (una pestaña vieja abierta) —\n";
caso('el primer envío es nuevo', wabot_panel_envio_marcar($charla, 'ok', '', $ahora) === true);
caso('el mismo texto a la misma charla a los pocos segundos NO sale', wabot_panel_envio_marcar($charla, 'ok', '', $ahora + 3) === false);
caso('aunque cambien los espacios de los bordes', wabot_panel_envio_marcar($charla, "  ok \n", '', $ahora + 4) === false);
caso('otro texto sí', wabot_panel_envio_marcar($charla, 'ok, dale', '', $ahora + 4) === true);
caso('el mismo texto a otra charla sí', wabot_panel_envio_marcar('5491177770903TEST', 'ok', '', $ahora + 4) === true);
caso('a los 16 segundos el mismo texto vuelve a poder mandarse', wabot_panel_envio_marcar($charla, 'ok', '', $ahora + 16) === true);

echo "— Un id mal formado no rompe nada —\n";
caso('caracteres raros se descartan y queda el id limpio', wabot_panel_envio_clave($charla, $texto, "a/../b\"c d") === 'i|' . $charla . '|abcd');
caso('sin id la clave es la del texto', strpos(wabot_panel_envio_clave($charla, $texto, ''), 't|' . $charla . '|') === 0);

$json = json_decode((string)file_get_contents($archivo), true);
caso('el archivo queda como un objeto de claves y fechas', is_array($json) && count($json) > 0 && count(array_filter($json, 'is_int')) === count($json));

@unlink($archivo);
if ($existia) file_put_contents($archivo, $respaldo);

/* 4-nov: las tildes de enviado / entregado / leído. Meta avisa por el webhook el
 * estado de cada wamid; se guarda aparte (data/estados/{clave}.json) y se le pega
 * al renglón al mostrarlo. Escribe con una clave TEST y la borra al terminar. */
echo "— Tildes de WhatsApp: el estado solo sube —\n";
$claveTildes = '5491177770904TEST';
@unlink(wabot_wa_estados_path($claveTildes));
caso('sent se anota', wabot_wa_estado_guardar($claveTildes, 'wamid.A', 'sent', $ahora) === true
    && wabot_wa_estados_leer($claveTildes)['wamid.A'] === ['sent', $ahora]);
caso('delivered y read lo suben', wabot_wa_estado_guardar($claveTildes, 'wamid.A', 'delivered', $ahora + 2)
    && wabot_wa_estado_guardar($claveTildes, 'wamid.A', 'read', $ahora + 9)
    && wabot_wa_estados_leer($claveTildes)['wamid.A'] === ['read', $ahora + 9]);
caso('un delivered que llega tarde no baja un read', wabot_wa_estado_guardar($claveTildes, 'wamid.A', 'delivered', $ahora + 20) === false
    && wabot_wa_estados_leer($claveTildes)['wamid.A'][0] === 'read');
caso('el mismo estado repetido no reescribe', wabot_wa_estado_guardar($claveTildes, 'wamid.A', 'read', $ahora + 30) === false);
caso('failed, un estado desconocido, sin wamid o sin clave: nada', !wabot_wa_estado_guardar($claveTildes, 'wamid.B', 'failed')
    && !wabot_wa_estado_guardar($claveTildes, 'wamid.B', 'played') && !wabot_wa_estado_guardar($claveTildes, '', 'sent')
    && !wabot_wa_estado_guardar('', 'wamid.B', 'sent') && !isset(wabot_wa_estados_leer($claveTildes)['wamid.B']));

echo "— Tildes de WhatsApp: el panel —\n";
wabot_wa_estado_guardar($claveTildes, 'wamid.VIEJO', 'delivered', $ahora - 50);
wabot_wa_estado_guardar($claveTildes, 'wamid.NUEVO', 'delivered', $ahora + 40);
$cvTildes = conv_nueva($claveTildes);
$lineasTildes = [
    ['q' => 'bot', 't' => 'Hola, ¿en qué te ayudo?', 'ts' => $ahora - 60, 'id' => 'wamid.VIEJO'],
    ['q' => 'humano', 't' => 'Sin aviso de Meta todavía', 'ts' => $ahora - 30, 'id' => 'wamid.SIN'],
    ['q' => 'cliente', 't' => 'una tienda', 'ts' => $ahora - 10, 'id' => 'wamid.A'],
    ['q' => 'humano', 't' => 'Te paso los planes', 'ts' => $ahora, 'id' => 'wamid.A'],
    ['q' => 'bot', 't' => 'Y la demo', 'ts' => $ahora + 35, 'id' => 'wamid.NUEVO'],
];
$conTildes = wabot_transcript_estados($lineasTildes, $cvTildes);
caso('el renglón nuestro lleva el estado y su hora', ($conTildes[3]['estado'] ?? '') === 'read' && ($conTildes[3]['estado_ts'] ?? 0) === $ahora + 9);
caso('uno más nuevo entregado y no leído queda entregado', ($conTildes[4]['estado'] ?? '') === 'delivered');
caso('si uno más nuevo está leído, el anterior también (WhatsApp lee todo lo de arriba)', ($conTildes[0]['estado'] ?? '') === 'read');
caso('sin aviso de Meta no se inventa ninguna tilde', !isset($conTildes[1]['estado']));
caso('lo del cliente nunca lleva tilde, aunque coincida el id', !isset($conTildes[2]['estado']));
caso('Instagram no lleva tildes', !isset(wabot_transcript_estados($lineasTildes, conv_nueva('ig5491177770904TEST', ['canal' => 'instagram']))[3]['estado']));
caso('sin archivo de estados el transcript queda igual', wabot_transcript_estados($lineasTildes, conv_nueva('5491177770905TEST')) === $lineasTildes);
@unlink(wabot_wa_estados_path($claveTildes));

$webhookSrc = (string)file_get_contents(__DIR__ . '/webhook.php');
$adminSrc = (string)file_get_contents(__DIR__ . '/admin.php');
caso('el webhook anota sent/delivered/read y el failed sigue avisando en el chat',
    strpos($webhookSrc, 'if (wabot_wa_estado_nivel($estadoMeta) > 0) {') !== false
    && strpos($webhookSrc, "wabot_wa_estado_guardar(\$claveEstado, (string)(\$st['id'] ?? ''), \$estadoMeta") !== false
    && strpos($webhookSrc, "if (\$estadoMeta !== 'failed') continue;") !== false && strpos($webhookSrc, 'wabot_entrega_fallida_marcar($conv, $motivo);') !== false);
caso('el panel las pega al abrir el chat y en cada refresco', substr_count($adminSrc, 'wabot_transcript_estados(wabot_transcript_citas(') === 2
    && strpos($adminSrc, "TILDES_WSP[t.estado]") !== false);

todo_ok();
