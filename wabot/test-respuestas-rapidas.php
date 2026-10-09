<?php
/**
 * wabot/test-respuestas-rapidas.php — la migración de las respuestas rápidas
 * del panel a los dos planes (Pablo, 19-sep): plan anual con seña o plan
 * mensual, y el pago único solo para la web propia (solo CLI). Desde el 26-sep
 * a la noche son 3 modalidades (plan mensual, plan anual y pago único), con el
 * plan mensual a $25.000 / $35.000 y sin el plan con cambios (sección 7). Desde
 * el 3-oct el bloque vuelve a 2 modalidades (mensual $20.000 / $30.000 y anual):
 * el pago único queda solo para el que pide el código propio.
 *
 * Las respuestas viven en data/respuestas-rapidas.json del server y se editan
 * desde el panel; la migración corre al cargarlas. Tiene que cambiar las que
 * siguen de fábrica, sumar las nuevas una sola vez y no tocar lo que Pablo
 * escribió a mano (como sus datos para la seña). El archivo local se respalda
 * y se restituye al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/respuestas-rapidas.php';

wabot_ensure_dirs();   // en un checkout nuevo, data/ y data/migrated/ todavía no existen
$ruta = WABOT_DATA . '/respuestas-rapidas.json';
$respaldo = is_file($ruta) ? file_get_contents($ruta) : null;
/* El orden del 26-sep (las respuestas de los chats, las de antes ocultas)
 * corre una sola vez, con su marca en data/migrated/. Las secciones 1 a 4
 * prueban las migraciones de antes: con la marca puesta, ese orden no corre. */
$marca = WABOT_DATA . '/migrated/respuestas-rapidas-chats-26sep';
$marcaRespaldo = is_file($marca) ? file_get_contents($marca) : null;
file_put_contents($marca, 'test');

/** Los montos de hoy: desde el 26-sep las respuestas de precio los toman de textos.php. */
require_once __DIR__ . '/textos.php';
$T = wabot_textos_default()['tipos'];
/** Las dos líneas del bloque de hoy (3-oct: mensual y anual, sin el pago único), y lo que sigue debajo. */
$lineasHoy = static fn($tipo) => '1. Plan mensual: ' . $T[$tipo]['mensualidad'] . " por mes, incluye mantenimiento\n2. Plan anual: "
    . $T[$tipo]['precio'] . " por año, incluye mantenimiento\n\nLas 2 incluyen la web completa:";
/** Los links de Pagos para activar el plan mensual, con su monto y su página. */
$linkSitio = static fn($precio, $pagina) => 'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional (' . $precio
    . ' por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/' . $pagina;
$linkTienda = static fn($precio, $pagina) => 'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ('
    . $precio . ' por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/' . $pagina;
// Los de hoy (3-oct): los planes de Mercado Pago de $20.000 y $30.000.
$linkSitioHoy = $linkSitio('$20.000', 'mensual20000');
$linkTiendaHoy = $linkTienda('$30.000', 'mensual30000');

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
/* Desde el 26-sep a la noche, en el orden de la imagen del precio: 1 plan
 * mensual, 2 plan anual (y hasta el 3-oct, 3 pago único). */
caso('las cuatro de precio con las 2 modalidades y lo que incluyen (3-oct)',
    mb_strpos($planes[0], $lineasHoy('landing')) !== false && mb_strpos($planes[1], $lineasHoy('ecommerce')) !== false
    && mb_strpos($planes[2], $lineasHoy('inmobiliaria')) !== false && mb_strpos($planes[3], 'cursos') !== false
    && mb_strpos($planes[3], $lineasHoy('elearning')) !== false
    && mb_strpos($planes[0], 'Podés elegir una de estas 2 modalidades de pago:') !== false
    && mb_stripos($planes[0], 'pago único') === false
    && str_ends_with($planes[0], "Y también el mantenimiento:\n✓ Renovación de hosting y dominio\n✓ Actualizaciones de SDK y plugins\n✓ Arreglo de errores\n✓ Soporte técnico\n✓ Copia de seguridad\n✓ Un cambio por mes"), $planes[0]);
// 26-sep: con el test de precios, el anual y el mensual del panel se habían quedado en $120.000 / $20.000.
caso('los cuatro bloques son el que manda el bot para su tipo, con los montos de textos.php (26-sep)',
    count(array_filter(['landing', 'ecommerce', 'inmobiliaria', 'elearning'], fn($tipo, $i) =>
        str_ends_with($planes[$i], "\n\n" . wabot_respuestas_rapidas_planes_texto($tipo)), ARRAY_FILTER_USE_BOTH)) === 4, $planes[0]);
// 20-sep: el panel vuelve a estar incluido en los cuatro tipos, también en el sitio profesional.
caso('los cuatro tipos incluyen panel y el bloque separado de mantenimiento (20-sep)',
    count(array_filter(array_slice($planes, 0, 4), fn($t) => mb_strpos($t, '✓ Panel para autogestionar contenido') !== false)) === 4
    && mb_strpos($planes[1], "Y también el mantenimiento:\n✓ Renovación de hosting y dominio") !== false, $planes[0]);
// Sin montos escritos a mano (26-sep a la noche): {sena} y {precio_unico} los completa cada charla.
caso('se suman la seña del plan anual y la explicación del pago único, con marcadores',
    count(array_filter($planes, fn($t) => $t === WABOT_RR_ANUAL_SENA)) === 1 && count(array_filter($planes, fn($t) => $t === WABOT_RR_PAGO_UNICO)) === 1
    && mb_strpos(WABOT_RR_ANUAL_SENA, 'seña de {sena}') !== false && mb_strpos(WABOT_RR_PAGO_UNICO, 'son {precio_unico}') !== false,
    implode("\n", array_slice($planes, 4)));
caso('lo que Pablo editó no se toca', in_array('Antes de arrancar dejamos todo por escrito.', $planes, true));
$pagos = rr_items($r, 'Pagos');
caso('sus datos para la seña quedan', $pagos[0] === 'Te paso los datos para la seña. Alias: gokywebs.mp');
/* El link único del 19-sep se separó en uno por plan (25-sep), el test de
 * precios del 26-sep los movió a $30.000 / $40.000 y a la noche quedaron en
 * $25.000 / $35.000, con los planes de Mercado Pago que ya existían; el 2-oct,
 * $19.000 / $29.000, y el 3-oct, $20.000 / $30.000. */
caso('los links de Mercado Pago son los del plan mensual de cada tipo, $20.000 (mensual20000) y $30.000 (mensual30000)',
    $pagos[1] === $linkSitioHoy && $pagos[2] === $linkTiendaHoy, $pagos[1] . "\n" . $pagos[2]);
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
caso('sin archivo salen las de fábrica, ya con las 2 modalidades (3-oct)',
    count(array_filter(array_merge(...array_column(wabot_respuestas_rapidas_load(), 'items')), fn($t) => mb_strpos($t, $lineasHoy('landing')) !== false)) === 1);
$primera = rr_archivo_viejo($preciosViejos);
foreach ($primera as &$cat) if ($cat['titulo'] === 'Presupuesto y planes') $cat['items'] = [$preciosViejos[1]];
unset($cat);
file_put_contents($ruta, json_encode($primera, JSON_UNESCAPED_UNICODE));
$rPrimera = wabot_respuestas_rapidas_load();
caso('la primera versión (un solo bloque de $290.000) queda con los precios nuevos',
    count(rr_items($rPrimera, 'Presupuesto y planes')) === 8
    && mb_strpos(json_encode($rPrimera, JSON_UNESCAPED_UNICODE), 'Son alternativas') === false
    && mb_strpos(rr_items($rPrimera, 'Presupuesto y planes')[0], $lineasHoy('landing')) !== false);

echo "— 4. El panel del 21-sep: precios viejos y mensajes del modelo anterior —\n";

/* Lo que tenía el server el 21-sep. Los cuatro bloques seguían siendo los del
 * 19-sep —con esos montos y las viñetas de entonces— porque la migración del
 * 20-sep los buscaba por el arranque del texto de fábrica y ese mismo día las
 * recomendaciones se habían acortado. Además quedaban respuestas escritas a
 * mano con la suscripción de $25.000 y el código a los dos años. */
$bloque19 = "\n\nPodés elegir entre dos planes:\n\n• Plan anual: {A} por año\n• Plan mensual: {M} por mes\n\nAmbos incluyen:\n✓ Desarrollo completo de la web, con diseño a medida\n✓ Adaptada a celulares, tablets y computadoras\n✓ Panel para que actualices tu contenido cuando quieras\n✓ Hosting y dominio .com.ar\n✓ Certificado de seguridad (SSL)\n✓ Preparada para que Google la encuentre\n✓ Mantenimiento y actualizaciones\n✓ Soporte técnico";
$con19 = static fn($intro, $a, $m) => $intro . str_replace(['{A}', '{M}'], [$a, $m], $bloque19);
$suyo = 'Para tu escuela de costura te armamos la plataforma con los cursos.';
$panel21 = [
    ['ico' => '💰', 'titulo' => 'Presupuesto y planes', 'items' => [
        $con19('Para lo que me contás, te serviría un sitio profesional donde puedas mostrar tus servicios, trabajos e información de contacto, pensado para transmitir confianza y recibir consultas.', '$120.000', '$20.000'),
        $con19('Para lo que me contás, te serviría una web para vender online, con catálogo, carrito, integración de cobros con Mercado Pago y un panel administrativo para cargar productos y gestionar pedidos.', '$230.000', '$30.000'),
        $con19('Para tu inmobiliaria te serviría una web para publicar propiedades con fotos y fichas completas, buscador por zona, tipo y precio, y un panel administrativo para cargar, editar y dar de baja propiedades.', '$190.000', '$30.000'),
        $con19($suyo, '$230.000', '$30.000'),   // escrita por Pablo, con el bloque viejo
        'En el sitio profesional los cambios los hacemos nosotros. Si querés cambiar vos los textos y las imágenes, le sumamos un panel de administración y el plan mensual pasa a $25.000.',
    ]],
    ['ico' => '💳', 'titulo' => 'Pagos', 'items' => [
        "Te paso los datos para la seña, en cuanto se acredite arrancamos: \nAlias: pablotravi\nCVU: 0000003100053462800156",
        'Luego de los 2 años, si deseas continuar con otra persona, te entregamos el código de la página',
        'La suscripción no tiene una duración fija. Es mensual y se mantiene activa mientras quieras seguir usando el servicio. Abonás $25.000 por mes e incluye la web, hosting, dominio, mantenimiento y soporte',
    ]],
    ['ico' => '✅', 'titulo' => 'Cliente confirmado', 'items' => [
        'Perfecto. Para arrancar primero decime cuál de las dos opciones preferís: pago único de $290.000 o suscripción de $25.000 por mes.',
    ]],
];
file_put_contents($ruta, json_encode($panel21, JSON_UNESCAPED_UNICODE));
$r21 = wabot_respuestas_rapidas_load();
$planes21 = rr_items($r21, 'Presupuesto y planes');
$pagos21 = rr_items($r21, 'Pagos');
caso('los cuatro bloques quedan con los precios de hoy',
    mb_strpos($planes21[0], $lineasHoy('landing')) !== false
    && mb_strpos($planes21[1], $lineasHoy('ecommerce')) !== false
    && mb_strpos($planes21[2], $lineasHoy('inmobiliaria')) !== false
    && mb_strpos($planes21[3], $lineasHoy('elearning')) !== false, $planes21[0]);
// Desde el 26-sep a la noche el bloque vuelve a decir "por año" y "por mes", pero numerado.
// 3-oct: $120.000 vuelve a ser el anual del sitio profesional: solo puede quedar en su bloque, el primero.
caso('no queda ningún monto viejo ni las viñetas del 19-sep',
    count(array_filter($planes21, fn($t) => mb_strpos($t, '$230.000') !== false
        || mb_strpos($t, '• Plan') !== false || mb_strpos($t, 'Hosting y dominio .com.ar') !== false)) === 0
    && count(array_filter(array_slice($planes21, 1), fn($t) => mb_strpos($t, '$120.000') !== false)) === 0, implode("\n", $planes21));
caso('las recomendaciones de fábrica viejas pasan a las cortas de ahora',
    mb_strpos($planes21[0], 'Para lo que me contás, te serviría un sitio profesional para mostrar tu negocio') === 0
    && mb_strpos($planes21[2], 'Para lo que me contás, te serviría una web inmobiliaria para publicar propiedades con fotos y filtros') === 0, $planes21[2]);
caso('la que escribió Pablo conserva su texto y solo se le actualiza el bloque',
    mb_strpos($planes21[3], $suyo) === 0 && str_ends_with($planes21[3], "\n\n" . wabot_respuestas_rapidas_planes_texto('elearning')), $planes21[3]);
// 26-sep a la noche: sin el plan con cambios, el mensual y el anual incluyen un cambio por mes.
caso('el panel aparte de $25.000 pasa al cambio por mes de los planes, sin el plan con cambios',
    count(array_filter($planes21, fn($t) => mb_strpos($t, 'le sumamos un panel de administración') !== false)) === 0
    && count(array_filter($planes21, fn($t) => $t === WABOT_RR_CAMBIOS_PLAN)) === 1
    && mb_stripos(WABOT_RR_CAMBIOS_PLAN, 'con cambios') === false && mb_strpos(WABOT_RR_CAMBIOS_PLAN, 'un cambio por mes') !== false, implode("\n", $planes21));
caso('el código "a los 2 años" pasa a los plazos de cada plan',
    count(array_filter($pagos21, fn($t) => mb_strpos($t, 'Luego de los 2 años') === 0)) === 0
    && count(array_filter($pagos21, fn($t) => mb_strpos($t, 'al pagar el segundo año') !== false && mb_strpos($t, 'a los 18 meses') !== false)) === 1, implode("\n", $pagos21));
caso('la suscripción de $25.000 pasa al plan mensual con sus dos montos',
    count(array_filter($pagos21, fn($t) => mb_strpos($t, 'Abonás $25.000 por mes') !== false)) === 0
    && count(array_filter($pagos21, fn($t) => mb_strpos($t, 'El plan mensual no tiene permanencia') === 0
        && mb_strpos($t, $T['landing']['mensualidad'] . ' por mes el sitio profesional y ' . $T['ecommerce']['mensualidad']) !== false)) === 1, implode("\n", $pagos21));
caso('las dos opciones del modelo viejo pasan a los dos planes',
    rr_items($r21, 'Cliente confirmado') === ['Perfecto. Para arrancar primero decime qué plan preferís: el anual o el mensual.']);
caso('sus datos para la seña no se tocan', mb_strpos($pagos21[0], 'CVU: 0000003100053462800156') !== false);
caso('la segunda carga no cambia nada', wabot_respuestas_rapidas_load() === $r21);

echo "— 24-sep: \"Podés elegir una de estas 3 modalidades de pago\" —\n";

/* Pablo, 24-sep: el arranque del bloque pasa de "Podés elegir entre tres
 * opciones:" a "Podés elegir una de estas 3 modalidades de pago:". Las
 * respuestas guardadas con el arranque anterior se ponen al día solas, sin
 * tocar la recomendación que escribió Pablo arriba. */
$suyo24 = 'Para tu estudio te armamos una web con tus áreas de práctica.';
$viejo24 = $suyo24 . "\n\nPodés elegir entre tres opciones:\n\n1. Plan anual: \$120.000 incluye mantenimiento\n2. Plan mensual: \$20.000 incluye mantenimiento\n3. Pago único: \$200.000 NO incluye mantenimiento*";
$al24 = wabot_respuestas_rapidas_precios_al_dia([['ico' => '💰', 'titulo' => 'Presupuesto y planes', 'items' => [$viejo24]]]);
$item24 = (string)($al24[0]['items'][0] ?? '');
// 3-oct: el arranque de hoy es "Podés elegir una de estas 2 modalidades de pago:", sin el pago único.
caso('un bloque guardado con "tres opciones" pasa a las modalidades de hoy (2 desde el 3-oct)',
    mb_strpos($item24, 'Podés elegir una de estas 2 modalidades de pago:') !== false
    && mb_strpos($item24, 'Podés elegir entre tres opciones') === false && mb_stripos($item24, 'pago único') === false, $item24);
caso('y la recomendación de Pablo queda arriba, igual', mb_strpos($item24, $suyo24) === 0, $item24);
/* 3-oct: un bloque guardado con "3 modalidades" (mensual, anual y pago único,
 * del 24-sep al 3-oct) pasa a las 2 de hoy, sin tocar la recomendación. */
$suyo3oct = 'Para tu consultorio te armamos un sitio profesional con tus especialidades.';
$viejo3oct = $suyo3oct . "\n\nPodés elegir una de estas 3 modalidades de pago:\n\n1. Plan mensual: \$19.000 por mes, incluye mantenimiento\n"
    . "2. Plan anual: \$149.000 por año, incluye mantenimiento\n3. Pago único: \$190.000 una vez, NO incluye mantenimiento*";
$item3oct = (string)(wabot_respuestas_rapidas_precios_al_dia([['ico' => '💰', 'titulo' => 'Presupuesto y planes', 'items' => [$viejo3oct]]])[0]['items'][0] ?? '');
caso('un bloque guardado con las 3 modalidades pasa a las 2 de hoy, con los montos de la lista y sin el pago único (3-oct)',
    mb_strpos($item3oct, $suyo3oct) === 0 && mb_strpos($item3oct, $lineasHoy('landing')) !== false
    && mb_stripos($item3oct, 'pago único') === false && mb_strpos($item3oct, '3 modalidades') === false, $item3oct);

echo "— 5. 26-sep: las respuestas de los chats, y las de antes ocultas salvo los precios —\n";

/* Pablo, 26-sep: "agarrá todos esos mensajes (algunos son parecidos,
 * unificalos) a respuestas rápidas" y "las que están ahora escondelas,
 * excepto las de los precios". El panel del server de ese día, tal cual,
 * salvo los datos de pago, que en el fixture son de ejemplo. */
$server26 = json_decode((string)file_get_contents(__DIR__ . '/test-respuestas-rapidas-26sep.json'), true);
$senaServer = $server26[2]['items'][0];
@unlink($marca);
file_put_contents($ruta, json_encode($server26, JSON_UNESCAPED_UNICODE));
$r26 = wabot_respuestas_rapidas_load();
$titulosVisibles = array_column(array_filter($r26, fn($c) => empty($c['oculta'])), 'titulo');
caso('quedan visibles las categorías nuevas, en orden, con los precios en segundo lugar',
    $titulosVisibles === ['Muestra gratis', 'Precios', 'Dudas de planes', 'Arranque y pagos', 'Tienda y panel', 'Dominio y hosting', 'Redes y Google', 'Sin apuro', 'Otras consultas'],
    implode(' · ', $titulosVisibles));
caso('las nueve de antes quedan ocultas, no borradas',
    array_column(array_filter($r26, fn($c) => !empty($c['oculta'])), 'titulo') === array_column($server26, 'titulo'));
$precios26 = rr_items($r26, 'Precios');
caso('"Precios" tiene los cuatro bloques, con los montos de textos.php',
    count($precios26) === 4 && mb_strpos($precios26[0], $lineasHoy('landing')) !== false && mb_strpos($precios26[1], $lineasHoy('ecommerce')) !== false
    && mb_strpos($precios26[2], $lineasHoy('inmobiliaria')) !== false && mb_strpos($precios26[3], $lineasHoy('elearning')) !== false, $precios26[0] ?? '');
caso('entre las ocultas ya no queda ningún bloque de precio',
    count(array_filter(rr_items($r26, 'Presupuesto y planes'), 'wabot_respuestas_rapidas_es_bloque_precio')) === 0);
$arranque26 = rr_items($r26, 'Arranque y pagos');
caso('sus datos para la seña pasan tal cual a "Arranque y pagos", debajo de la seña del plan anual',
    ($arranque26[2] ?? '') === $senaServer && mb_strpos($arranque26[1], 'seña de {sena}') !== false
    && mb_strpos(json_encode(rr_items($r26, 'Pagos'), JSON_UNESCAPED_UNICODE), 'ejemplo.alias') === false, $arranque26[2] ?? '');
caso('lo que Pablo había escrito a mano sigue entre las ocultas',
    in_array('podemos integrar tanto paypal (u otra billetera que uses) como mercadolibre', rr_items($r26, 'Pagos'), true));
/* Ese panel tenía los links y los textos del test de precios: a la noche
 * quedan con los planes mensuales de hoy y sin el plan con cambios, también
 * entre las ocultas (wabot_respuestas_rapidas_precios_26sep_noche). */
$pagos26 = rr_items($r26, 'Pagos');
caso('sus links del plan mensual pasan a los de hoy, mensual20000 y mensual30000 (26-sep a la noche; 3-oct)',
    in_array($linkSitioHoy, $pagos26, true) && in_array($linkTiendaHoy, $pagos26, true)
    && !preg_match('/pago\/mensual(20|30|40)\b/u', implode("\n", $pagos26)), implode("\n", $pagos26));
caso('su plan mensual sin permanencia queda con los montos de hoy',
    count(array_filter($pagos26, fn($t) => mb_strpos($t, 'El plan mensual no tiene permanencia') === 0
        && mb_strpos($t, 'Son ' . $T['landing']['mensualidad'] . ' por mes el sitio profesional y ' . $T['ecommerce']['mensualidad'] . ' la tienda') !== false)) === 1,
    implode("\n", $pagos26));
$planesOcultos26 = rr_items($r26, 'Presupuesto y planes');
caso('y la seña del anual y el plan con cambios quedan con marcadores y sin el plan con cambios',
    in_array(WABOT_RR_ANUAL_SENA, $planesOcultos26, true) && in_array(WABOT_RR_CAMBIOS_PLAN, $planesOcultos26, true)
    && mb_strpos(implode("\n", $planesOcultos26), 'plan mensual con cambios') === false, implode("\n", $planesOcultos26));
caso('queda la marca y queda escrito en el archivo', is_file($marca) && json_decode((string)file_get_contents($ruta), true) === $r26);
caso('la segunda carga no cambia nada', wabot_respuestas_rapidas_load() === $r26);

// Lo que Pablo cambie después desde la pestaña Respuestas no se pisa.
$editado = array_values(array_filter($r26, fn($c) => $c['titulo'] !== 'Sin apuro'));
foreach ($editado as &$cat) if ($cat['titulo'] === 'Objeciones') unset($cat['oculta']);
unset($cat);
wabot_respuestas_rapidas_save($editado);
$rEditado = wabot_respuestas_rapidas_load();
caso('una categoría nueva que borró no vuelve, y una vieja que volvió a mostrar sigue visible',
    rr_items($rEditado, 'Sin apuro') === [] && count(array_filter($rEditado, fn($c) => $c['titulo'] === 'Objeciones' && empty($c['oculta']))) === 1);
@unlink($marca);
caso('aun sin la marca, un panel ya ordenado no se vuelve a ordenar', wabot_respuestas_rapidas_load() === $rEditado);

@unlink($ruta);
$fabrica26 = wabot_respuestas_rapidas_load();
caso('sin archivo, el de fábrica ya sale ordenado, con el lugar para los datos de la seña',
    (array_column(array_filter($fabrica26, fn($c) => empty($c['oculta'])), 'titulo')[1] ?? '') === 'Precios'
    && mb_strpos(rr_items($fabrica26, 'Arranque y pagos')[2] ?? '', 'EDITAR DATOS DE PAGO') !== false);
/* Encontrado probando el panel en local: el de fábrica guardado, ordenado y
 * cargado otra vez. La oculta "Presupuesto y planes" se queda sin bloques y
 * el "$290.000" de los cursos la hacía pasar por la primera versión del
 * 15-sep: completar_precios le volvía a meter los bloques de fábrica. */
file_put_contents($ruta, json_encode(wabot_respuestas_rapidas_default(), JSON_UNESCAPED_UNICODE));
@unlink($marca);
wabot_respuestas_rapidas_load();
$fabricaDosCargas = wabot_respuestas_rapidas_load();
$bloquesDonde = [];
foreach ($fabricaDosCargas as $cat) foreach ($cat['items'] as $texto) if (wabot_respuestas_rapidas_es_bloque_precio($texto)) $bloquesDonde[] = $cat['titulo'];
caso('guardado y cargado dos veces, los bloques de precio siguen solo en "Precios"',
    $bloquesDonde === ['Precios', 'Precios', 'Precios', 'Precios'], implode(', ', $bloquesDonde));
caso('normalizar conserva la marca de oculta y no inventa una',
    wabot_respuestas_rapidas_normalizar($r26) === $r26
    && !array_key_exists('oculta', wabot_respuestas_rapidas_normalizar([['titulo' => 'x', 'items' => ['y'], 'oculta' => false]])[0]));

echo "— 6. 26-sep: los montos se completan con los de cada charla —\n";

$cfg26 = wabot_config_load();
$visible = static fn($conv, $titulo) => rr_items(wabot_respuestas_rapidas_visibles($r26, $conv, $cfg26), $titulo);
$todas = static fn($conv) => json_encode(wabot_respuestas_rapidas_visibles($r26, $conv, $cfg26), JSON_UNESCAPED_UNICODE);
caso('al chat van solo las visibles', array_column(wabot_respuestas_rapidas_visibles($r26, ['tipo' => 'landing'], $cfg26), 'titulo') === $titulosVisibles);
$sitio = $visible(['tipo' => 'landing'], 'Arranque y pagos')[1];
caso('sitio profesional: la seña y el saldo del plan anual de lista',
    mb_strpos($sitio, 'seña de ' . $T['landing']['sena'] . ':') !== false
    && mb_strpos($sitio, 'saldo de ' . wabot_moneda(wabot_monto_a_numero($T['landing']['precio']) - wabot_monto_a_numero($T['landing']['sena'])) . '.') !== false, $sitio);
$congelada = ['tipo' => 'ecommerce', 'precio_cotizado' => '$190.000', 'sena_cotizada' => '$60.000', 'mensualidad_cotizada' => '$30.000', 'precio_modelo' => 'anual'];
$sinApuro = $visible($congelada, 'Sin apuro')[0];
caso('tienda cotizada antes del test de precios: le sale su mensualidad y su plan anual',
    mb_strpos($sinApuro, 'con el plan mensual son $30.000 por mes') !== false
    && mb_strpos($visible($congelada, 'Dudas de planes')[6], 'el anual es de $190.000') !== false, $sinApuro);
$doble = ['tipo' => 'ecommerce', 'precio_cotizado' => '$290.000', 'sena_cotizada' => '$60.000', 'mensualidad_cotizada' => '$25.000', 'precio_modelo' => 'doble'];
caso('cotizada con el pago único del 15 al 18-sep: el plan anual sale de lista, no de aquel pago único',
    mb_strpos($visible($doble, 'Dudas de planes')[6], 'el anual es de ' . $T['ecommerce']['precio']) !== false, $visible($doble, 'Dudas de planes')[6]);
$sinTipo = $visible(['tipo' => ''], 'Sin apuro')[0];
caso('sin tipo: el monto de cada grupo',
    mb_strpos($sinTipo, $T['landing']['mensualidad'] . ' (sitio profesional) o ' . $T['ecommerce']['mensualidad'] . ' (tienda, cursos o inmobiliaria) por mes') !== false, $sinTipo);
caso('ningún marcador llega crudo al chat, con tipo o sin tipo',
    !preg_match('/\{[a-z_]+\}/', $todas(['tipo' => 'landing']) . $todas($congelada) . $todas($doble) . $todas(['tipo' => '']) . $todas(['tipo' => 'inmobiliaria'])));
caso('la carga de productos, a $500 cada uno', mb_strpos($visible(['tipo' => 'ecommerce'], 'Tienda y panel')[2], 'son $500 por producto') !== false);
caso('una respuesta sin montos no cambia', wabot_respuestas_rapidas_montos('Dale, no hay apuro.', ['tipo' => 'landing'], $cfg26) === 'Dale, no hay apuro.');

/* Desde el 26-sep el bloque se rearma con los montos de textos.php, y el
 * sitio pasó a $30.000 por mes, lo que antes cobraba la tienda: un bloque con
 * una recomendación de Pablo sin pistas del tipo se reconoce por el plan
 * anual de hoy y no pasa a ser de tienda en la carga siguiente. */
$bloqueSitio = "Para vos te armo esto.\n\n" . wabot_respuestas_rapidas_planes_texto('landing');
$dosCargas = wabot_respuestas_rapidas_precios_al_dia(wabot_respuestas_rapidas_precios_al_dia([['ico' => '💰', 'titulo' => 'Precios', 'items' => [$bloqueSitio]]]));
caso('un bloque de sitio profesional sin pistas sigue siendo del sitio en cada carga',
    $dosCargas[0]['items'][0] === $bloqueSitio, $dosCargas[0]['items'][0]);

echo "— 7. 26-sep a la noche: el plan mensual de \$25.000 / \$35.000 y sin el plan con cambios —\n";

/* La migración de esa noche, sola: por texto exacto, como las otras de la
 * familia. Lo que Pablo reescribió no se toca. */
$sinPermanencia = static fn($sitio, $tienda) => 'El plan mensual no tiene permanencia: se mantiene activo mientras quieras seguir usando el servicio. Son '
    . $sitio . ' por mes el sitio profesional y ' . $tienda . ' la tienda, los cursos o la inmobiliaria, e incluye la web, hosting, dominio, mantenimiento y soporte.';
$linkEditado = 'Te mando el link del plan mensual del sitio ($30.000 por mes): mpago.la/mio';
$antesNoche = [
    ['ico' => '💳', 'titulo' => 'Pagos', 'items' => [
        $linkSitio('$30.000', 'mensual30'), $linkTienda('$40.000', 'mensual40'), $linkEditado,
        $sinPermanencia('$20.000', '$30.000'), $sinPermanencia('$30.000', '$40.000'),
    ]],
    ['ico' => '💰', 'titulo' => 'Presupuesto y planes', 'oculta' => true, 'items' => [
        'Los dos planes incluyen un cambio por mes en la web. Si vas a necesitar cambios más seguido, está el plan mensual con cambios: $25.000 el sitio profesional y $35.000 la tienda, los cursos o la inmobiliaria.',
        'Con el plan anual arrancás con una seña de $40.000 (sitio profesional) o $60.000 (tienda, cursos o inmobiliaria) y el resto se paga al entregar la web. Después se renueva una vez por año, contado desde la seña, sin suscripción.',
        'Con el pago único, la web queda abonada en su totalidad. Son $200.000 el sitio profesional, $300.000 la tienda, $290.000 los cursos y $260.000 la inmobiliaria. No incluye mantenimiento ni renovaciones.',
        'Los cambios los vemos cuando la web esté lista.',
    ]],
];
$noche = wabot_respuestas_rapidas_precios_26sep_noche($antesNoche);
$pagosNoche = rr_items(wabot_respuestas_rapidas_precios_1oct($noche), 'Pagos');
caso('los links del test de precios pasan a los de hoy (mensual20000 y mensual30000), con sus montos',
    ($pagosNoche[0] ?? '') === $linkSitioHoy && ($pagosNoche[1] ?? '') === $linkTiendaHoy, implode("\n", $pagosNoche));
caso('un link que Pablo reescribió no se toca', in_array($linkEditado, $pagosNoche, true));
caso('el mensual sin permanencia, con los montos del 19-sep o del test de precios, queda una sola vez con los de hoy',
    count(array_filter($pagosNoche, fn($t) => mb_strpos($t, 'El plan mensual no tiene permanencia') === 0)) === 1
    && in_array($sinPermanencia($T['landing']['mensualidad'], $T['ecommerce']['mensualidad']), $pagosNoche, true), implode("\n", $pagosNoche));
$planesNoche = rr_items($noche, 'Presupuesto y planes');
caso('el plan con cambios pasa al cambio por mes que incluyen los planes',
    ($planesNoche[0] ?? '') === WABOT_RR_CAMBIOS_PLAN, $planesNoche[0] ?? '');
caso('la seña del anual y el pago único con montos escritos pasan a marcadores',
    ($planesNoche[1] ?? '') === WABOT_RR_ANUAL_SENA && ($planesNoche[2] ?? '') === WABOT_RR_PAGO_UNICO, implode("\n", $planesNoche));
caso('lo que escribió Pablo sigue igual, y la categoría sigue oculta',
    ($planesNoche[3] ?? '') === 'Los cambios los vemos cuando la web esté lista.' && !empty($noche[1]['oculta']));
caso('correrla de nuevo no cambia nada', wabot_respuestas_rapidas_precios_26sep_noche($noche) === $noche);
caso('no queda el plan con cambios ni un link de antes',
    !preg_match('/con cambios|pago\/mensual(20|30|40)\b/u', json_encode($noche, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)));

// Los de fábrica ya traen lo de esa noche, y los links llevan a páginas que existen, con su monto.
$fabricaNoche = wabot_respuestas_rapidas_default();
caso('los de fábrica traen los links de $20.000 y $30.000 y los textos con marcadores',
    in_array($linkSitioHoy, rr_items($fabricaNoche, 'Pagos'), true) && in_array($linkTiendaHoy, rr_items($fabricaNoche, 'Pagos'), true)
    && in_array(WABOT_RR_ANUAL_SENA, rr_items($fabricaNoche, 'Presupuesto y planes'), true)
    && in_array(WABOT_RR_PAGO_UNICO, rr_items($fabricaNoche, 'Presupuesto y planes'), true)
    && wabot_respuestas_rapidas_precios_26sep_noche($fabricaNoche) === $fabricaNoche);
foreach (['mensual20000' => $T['landing']['mensualidad'], 'mensual30000' => $T['ecommerce']['mensualidad']] as $pagina => $monto) {
    $html = (string)@file_get_contents(__DIR__ . '/../pago/' . $pagina . '/index.html');
    caso("la página gokywebs.com/pago/$pagina existe y cobra $monto por mes, lo mismo que la lista",
        $html !== '' && mb_strpos($html, $monto . ' por mes') !== false);
}
caso('ninguna respuesta de fábrica ni de los chats nombra el plan con cambios',
    !preg_match('/con cambios/u', json_encode([$fabricaNoche, wabot_respuestas_rapidas_chats_26sep_categorias()], JSON_UNESCAPED_UNICODE))
    && mb_stripos((string)file_get_contents(__DIR__ . '/respuestas-rapidas.js'), 'con cambios') === false);

/* Los marcadores de esos textos se completan con los montos de cada charla:
 * la seña de lista, y el pago único congelado aunque la lista suba después. */
$cfgNoche = wabot_config_load();
caso('la seña del plan anual del sitio profesional sale de la lista',
    wabot_respuestas_rapidas_montos(WABOT_RR_ANUAL_SENA, ['tipo' => 'landing'], $cfgNoche) === str_replace('{sena}', $T['landing']['sena'], WABOT_RR_ANUAL_SENA));
caso('el pago único de la tienda, el de la lista',
    wabot_respuestas_rapidas_montos(WABOT_RR_PAGO_UNICO, ['tipo' => 'ecommerce'], $cfgNoche) === str_replace('{precio_unico}', $T['ecommerce']['precio_unico'], WABOT_RR_PAGO_UNICO));
$tiendaCongelada = ['tipo' => 'ecommerce', 'precio_dado' => true];
wabot_precio_congelar($tiendaCongelada, 'ecommerce', $cfgNoche);
$cfgSubeUnico = $cfgNoche;
$cfgSubeUnico['tipos']['ecommerce']['precio_unico'] = '$420.000';
caso('si la lista del pago único sube, a la tienda ya cotizada le sale el suyo',
    ($tiendaCongelada['precio_unico_cotizado'] ?? '') === $T['ecommerce']['precio_unico']
    && wabot_respuestas_rapidas_montos(WABOT_RR_PAGO_UNICO, $tiendaCongelada, $cfgSubeUnico) === str_replace('{precio_unico}', $T['ecommerce']['precio_unico'], WABOT_RR_PAGO_UNICO)
    && mb_strpos($visible($tiendaCongelada, 'Dudas de planes')[1] ?? '', 'Pago único: ' . $T['ecommerce']['precio_unico'] . ' una sola vez') !== false,
    wabot_respuestas_rapidas_montos(WABOT_RR_PAGO_UNICO, $tiendaCongelada, $cfgSubeUnico));

/* 2-oct (Pablo): el detalle de cada modalidad sale si el cliente pregunta y
 * queda en las respuestas rápidas, con las páginas del tipo de la charla.
 * Desde el 3-oct, solo el mensual y el anual. */
$detalleDe = static fn($m, $a) => "Acá podés ver el detalle de cada modalidad:\n\nMensual: gokywebs.com/pago/$m\nAnual: gokywebs.com/pago/$a";
caso('detalle de las modalidades: el sitio profesional, con sus 2 páginas (3-oct)',
    wabot_respuestas_rapidas_montos(WABOT_RR_DETALLE_MODALIDADES, ['tipo' => 'landing'], $cfgNoche) === $detalleDe('mensual20000', 'anual160'));
caso('detalle de las modalidades: la inmobiliaria, con las de la tienda',
    wabot_respuestas_rapidas_montos(WABOT_RR_DETALLE_MODALIDADES, ['tipo' => 'inmobiliaria'], $cfgNoche) === $detalleDe('mensual30000', 'anual240'));
$sinTipo = wabot_respuestas_rapidas_montos(WABOT_RR_DETALLE_MODALIDADES, null, $cfgNoche);
caso('detalle de las modalidades sin tipo: una página por grupo, sin el pago único',
    str_contains($sinTipo, 'gokywebs.com/pago/mensual20000 (sitio profesional) o gokywebs.com/pago/mensual30000 (tienda, cursos o inmobiliaria)')
    && str_contains($sinTipo, 'gokywebs.com/pago/anual160 (sitio profesional) o gokywebs.com/pago/anual240 (tienda, cursos o inmobiliaria)')
    && !str_contains($sinTipo, '{link_') && !str_contains($sinTipo, 'Pago único'), $sinTipo);
// 3-oct: el detalle guardado con las 3 (con el pago único) pasa al de 2.
$detalleViejo = "Acá podés ver el detalle de cada modalidad:\n\nMensual: {link_mensual}\nAnual: {link_anual}\nPago único: {link_unico}";
caso('el detalle guardado con el pago único pasa al de 2 modalidades (3-oct)',
    rr_items(wabot_respuestas_rapidas_precios_1oct([['titulo' => 'Precios', 'items' => ['b', $detalleViejo]]]), 'Precios') === ['b', WABOT_RR_DETALLE_MODALIDADES]);
$conPrecios = [['titulo' => 'Muestra gratis', 'items' => ['a']], ['titulo' => 'Precios', 'items' => ['b']]];
$sumado = wabot_respuestas_rapidas_detalle_2oct($conPrecios);
caso('el detalle se suma al final de Precios, una sola vez',
    $sumado[1]['items'] === ['b', WABOT_RR_DETALLE_MODALIDADES] && wabot_respuestas_rapidas_detalle_2oct($sumado) === $sumado);
caso('sin categoría Precios no se inventa una', wabot_respuestas_rapidas_detalle_2oct([['titulo' => 'Otra', 'items' => ['a']]]) === [['titulo' => 'Otra', 'items' => ['a']]]);
$marcaDetalle = WABOT_DATA . '/migrated/respuestas-rapidas-detalle-2oct';
$marcaDetalleRespaldo = is_file($marcaDetalle) ? file_get_contents($marcaDetalle) : null;
@unlink($marcaDetalle);
file_put_contents($ruta, json_encode([['ico' => '💰', 'titulo' => 'Precios', 'items' => ['Un bloque']]], JSON_UNESCAPED_UNICODE));
$cargado = wabot_respuestas_rapidas_load();
caso('al cargar el panel guardado, el detalle aparece en Precios y queda la marca',
    in_array(WABOT_RR_DETALLE_MODALIDADES, $cargado[0]['items'], true) && is_file($marcaDetalle));
file_put_contents($ruta, json_encode([['ico' => '💰', 'titulo' => 'Precios', 'items' => ['Un bloque']]], JSON_UNESCAPED_UNICODE));
caso('si Pablo lo borra, no vuelve', !in_array(WABOT_RR_DETALLE_MODALIDADES, wabot_respuestas_rapidas_load()[0]['items'], true));
if ($marcaDetalleRespaldo === null) @unlink($marcaDetalle); else file_put_contents($marcaDetalle, $marcaDetalleRespaldo);

if ($respaldo === null) @unlink($ruta); else file_put_contents($ruta, $respaldo);
if ($marcaRespaldo === null) @unlink($marca); else file_put_contents($marca, $marcaRespaldo);
todo_ok();
