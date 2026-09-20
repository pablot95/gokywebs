<?php
/**
 * wabot/test-respuestas-rapidas.php — la migración de las respuestas rápidas
 * del panel a los dos planes (Pablo, 19-sep): plan anual con seña o plan
 * mensual, y el pago único solo para la web propia (solo CLI).
 *
 * Las respuestas viven en data/respuestas-rapidas.json del server y se editan
 * desde el panel; la migración corre al cargarlas. Tiene que cambiar las que
 * siguen de fábrica, sumar las nuevas una sola vez y no tocar lo que Pablo
 * escribió a mano (como sus datos para la seña). El archivo local se respalda
 * y se restituye al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/respuestas-rapidas.php';

$ruta = WABOT_DATA . '/respuestas-rapidas.json';
$respaldo = is_file($ruta) ? file_get_contents($ruta) : null;

/** Las cuatro de precio del 15/16-sep, tal cual venían de fábrica. */
$preciosViejos = require __DIR__ . '/test-respuestas-rapidas-viejas.php';

/** El archivo del server antes del 19-sep: las de fábrica de entonces, con dos ediciones de Pablo. */
function rr_archivo_viejo($preciosViejos) {
    $cats = wabot_respuestas_rapidas_default();
    foreach ($cats as &$cat) {
        if ($cat['titulo'] === 'Presupuesto y planes') {
            $cat['items'] = array_merge($preciosViejos, [
                'El plan mensual incluye hosting, dominio, soporte técnico y mantenimiento de la web. No incluye administrar tus productos o pedidos: eso lo manejás vos desde tu panel.',
                'Antes de arrancar dejamos todo por escrito.',   // editada por Pablo
            ]);
        }
        if ($cat['titulo'] === 'Pagos') {
            array_pop($cat['items']);   // la renovación es del 19-sep
            $cat['items'][0] = 'Te paso los datos para la seña. Alias: gokywebs.mp';   // sus datos reales
            $cat['items'][1] = 'Te mando el link de Mercado Pago para activar la suscripción mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK';
        }
        if ($cat['titulo'] === 'Objeciones') {
            $cat['items'][1] = 'El mantenimiento no es por cargar productos ni administrar la página; eso lo hacés vos desde tu panel. El plan mensual cubre hosting, dominio, soporte técnico y el mantenimiento necesario para que la web siga funcionando correctamente.';
        }
        if ($cat['titulo'] === 'Funciones y web') {
            $cat['items'][5] = 'Con el pago único, el hosting, el dominio y el mantenimiento están incluidos durante el primer año.';
            $cat['items'][6] = 'Con la suscripción, el hosting, el dominio, el soporte y el mantenimiento están incluidos mientras el plan mensual esté activo.';
        }
    }
    unset($cat);
    return $cats;
}

function rr_items($cats, $titulo) {
    foreach ($cats as $cat) if ($cat['titulo'] === $titulo) return $cat['items'];
    return [];
}

echo "— 1. El archivo del 15/16-sep pasa a los dos planes —\n";

file_put_contents($ruta, json_encode(rr_archivo_viejo($preciosViejos), JSON_UNESCAPED_UNICODE));
$r = wabot_respuestas_rapidas_load();
$todo = json_encode($r, JSON_UNESCAPED_UNICODE);
$planes = rr_items($r, 'Presupuesto y planes');
caso('ya no quedan "Son alternativas", "Lo mejor para" ni el primer año del pago único',
    mb_strpos($todo, 'Son alternativas') === false && mb_strpos($todo, 'Lo mejor para') === false && mb_strpos($todo, 'durante el primer año') === false);
caso('las cuatro de precio con los dos planes y lo que incluyen',
    mb_strpos($planes[0], '• Plan anual: $140.000 por año') !== false && mb_strpos($planes[1], '• Plan anual: $230.000 por año') !== false
    && mb_strpos($planes[2], '• Plan anual: $190.000 por año') !== false && mb_strpos($planes[3], 'cursos') !== false
    && mb_strpos($planes[3], '• Plan mensual: $30.000 por mes') !== false && mb_strpos($planes[0], 'Ambos incluyen todo:') !== false, $planes[0]);
caso('el sitio profesional sin el panel de administración; la tienda con su panel (19-sep)',
    mb_stripos($planes[0], 'panel') === false && mb_strpos($planes[1], '✓ Panel para que actualices tu contenido cuando quieras') !== false, $planes[0]);
caso('se suman la seña del plan anual (desde la seña), la web propia y el panel del sitio a $25.000',
    count(array_filter($planes, fn($t) => mb_strpos($t, 'Con el plan anual arrancás con una seña de $40.000') === 0 && mb_strpos($t, 'contado desde la seña') !== false)) === 1
    && count(array_filter($planes, fn($t) => mb_strpos($t, 'Si la querés tuya') === 0)) === 1
    && count(array_filter($planes, fn($t) => mb_strpos($t, 'el plan mensual pasa a $25.000') !== false)) === 1);
caso('lo que Pablo editó no se toca', in_array('Antes de arrancar dejamos todo por escrito.', $planes, true));
$pagos = rr_items($r, 'Pagos');
caso('sus datos para la seña quedan', $pagos[0] === 'Te paso los datos para la seña. Alias: gokywebs.mp');
caso('el link de Mercado Pago es del plan mensual', $pagos[1] === 'Te mando el link de Mercado Pago para activar el plan mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK');
caso('se suma el aviso de la renovación del plan anual', mb_strpos(end($pagos), 'toca renovar el plan anual') !== false);
caso('funciones: incluido con los dos planes, y la web propia sin hosting ni mantenimiento',
    in_array('Con el plan anual o el mensual, el hosting, el dominio, el soporte y el mantenimiento están incluidos mientras el plan esté activo.', rr_items($r, 'Funciones y web'), true)
    && in_array('Con el pago único (la web propia, en tu hosting), el hosting, el dominio, el mantenimiento y el soporte corren por tu cuenta: no están incluidos.', rr_items($r, 'Funciones y web'), true));
caso('queda escrito en el archivo', json_decode((string)file_get_contents($ruta), true) === $r);
caso('la segunda carga no cambia nada ni duplica', wabot_respuestas_rapidas_load() === $r);

echo "— 2. Lo que Pablo borra o reescribe después no vuelve —\n";

$sinPropia = $r;
foreach ($sinPropia as &$cat) {
    if ($cat['titulo'] === 'Presupuesto y planes') $cat['items'] = array_values(array_filter($cat['items'], fn($t) => mb_strpos($t, 'Si la querés tuya') !== 0));
}
unset($cat);
wabot_respuestas_rapidas_save($sinPropia);
caso('la de la web propia, borrada, no reaparece', mb_strpos(json_encode(wabot_respuestas_rapidas_load(), JSON_UNESCAPED_UNICODE), 'Si la querés tuya') === false);
$propias = $r;
foreach ($propias as &$cat) if ($cat['titulo'] === 'Presupuesto y planes') $cat['items'] = ['Mi propio texto de precios.'];
unset($cat);
wabot_respuestas_rapidas_save($propias);
caso('una categoría de precios reescrita a mano no se vuelve a completar',
    rr_items(wabot_respuestas_rapidas_load(), 'Presupuesto y planes') === ['Mi propio texto de precios.']);

echo "— 3. Sin archivo, y la primera versión de la organización —\n";

@unlink($ruta);
caso('sin archivo salen las de fábrica, ya con los dos planes',
    mb_strpos(json_encode(wabot_respuestas_rapidas_load(), JSON_UNESCAPED_UNICODE), '• Plan mensual: $20.000 por mes') !== false);
$primera = rr_archivo_viejo($preciosViejos);
foreach ($primera as &$cat) if ($cat['titulo'] === 'Presupuesto y planes') $cat['items'] = [$preciosViejos[1]];
unset($cat);
file_put_contents($ruta, json_encode($primera, JSON_UNESCAPED_UNICODE));
$rPrimera = wabot_respuestas_rapidas_load();
caso('la primera versión (un solo bloque de $290.000) queda con los precios nuevos',
    count(rr_items($rPrimera, 'Presupuesto y planes')) === 9 && mb_strpos(json_encode($rPrimera, JSON_UNESCAPED_UNICODE), 'Son alternativas') === false);

if ($respaldo === null) @unlink($ruta); else file_put_contents($ruta, $respaldo);
todo_ok();
