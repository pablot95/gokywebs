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

todo_ok();
