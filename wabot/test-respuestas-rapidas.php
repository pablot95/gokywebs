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
caso('las cuatro de precio con las tres opciones y lo que incluyen los planes',
    mb_strpos($planes[0], '1. Plan anual: ' . $T['landing']['precio'] . ' incluye mantenimiento') !== false
    && mb_strpos($planes[1], '1. Plan anual: ' . $T['ecommerce']['precio'] . ' incluye mantenimiento') !== false
    && mb_strpos($planes[2], '1. Plan anual: ' . $T['inmobiliaria']['precio'] . ' incluye mantenimiento') !== false && mb_strpos($planes[3], 'cursos') !== false
    && mb_strpos($planes[0], '3. Pago único: ' . $T['landing']['precio_unico']) !== false
    && mb_strpos($planes[1], '3. Pago único: ' . $T['ecommerce']['precio_unico']) !== false
    && mb_strpos($planes[2], '3. Pago único: ' . $T['inmobiliaria']['precio_unico']) !== false
    && mb_strpos($planes[3], '3. Pago único: ' . $T['elearning']['precio_unico']) !== false
    && mb_strpos($planes[3], '2. Plan mensual: ' . $T['elearning']['mensualidad'] . ' incluye mantenimiento') !== false
    && mb_strpos($planes[0], 'Los 3 planes incluyen todo:') !== false
    && mb_strpos($planes[0], '3. Pago único: ' . $T['landing']['precio_unico'] . ' NO incluye mantenimiento*') !== false
    && str_ends_with($planes[0], '*El pago único se puede pagar en cuotas con intereses'), $planes[0]);
// 26-sep: con el test de precios, el anual y el mensual del panel se habían quedado en $120.000 / $20.000.
caso('el anual y el mensual de los cuatro bloques salen de textos.php, como el pago único (26-sep)',
    count(array_filter(['landing', 'ecommerce', 'inmobiliaria', 'elearning'], fn($tipo, $i) =>
        mb_strpos($planes[$i], '1. Plan anual: ' . $T[$tipo]['precio'] . " incluye mantenimiento\n2. Plan mensual: " . $T[$tipo]['mensualidad'] . ' incluye mantenimiento') !== false,
        ARRAY_FILTER_USE_BOTH)) === 4, $planes[0]);
// 20-sep: el panel vuelve a estar incluido en los cuatro tipos, también en el sitio profesional.
caso('los cuatro tipos incluyen panel y el bloque separado de mantenimiento (20-sep)',
    count(array_filter(array_slice($planes, 0, 4), fn($t) => mb_strpos($t, '✓ Panel para autogestionar contenido') !== false)) === 4
    && mb_strpos($planes[1], "El plan anual y mensual incluyen mantenimiento:\n✓ Renovación de hosting y dominio") !== false, $planes[0]);
caso('se suman la seña del plan anual y la explicación del pago único',
    count(array_filter($planes, fn($t) => mb_strpos($t, 'Con el plan anual arrancás con una seña de $40.000') === 0 && mb_strpos($t, 'contado desde la seña') !== false)) === 1
    && count(array_filter($planes, fn($t) => mb_strpos($t, 'Con el pago único, la web queda abonada en su totalidad.') === 0)) === 1);
caso('lo que Pablo editó no se toca', in_array('Antes de arrancar dejamos todo por escrito.', $planes, true));
$pagos = rr_items($r, 'Pagos');
caso('sus datos para la seña quedan', $pagos[0] === 'Te paso los datos para la seña. Alias: gokywebs.mp');
// El link único del 19-sep se separó en uno por plan (25-sep) y el test de precios del 26-sep los movió a $30.000 / $40.000.
caso('los links de Mercado Pago son los del plan mensual de cada tipo',
    $pagos[1] === 'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($30.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual30'
    && $pagos[2] === 'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($40.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual40',
    $pagos[1]);
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
    mb_strpos(json_encode(wabot_respuestas_rapidas_load(), JSON_UNESCAPED_UNICODE), '2. Plan mensual: ' . $T['landing']['mensualidad'] . ' incluye mantenimiento') !== false);
$primera = rr_archivo_viejo($preciosViejos);
foreach ($primera as &$cat) if ($cat['titulo'] === 'Presupuesto y planes') $cat['items'] = [$preciosViejos[1]];
unset($cat);
file_put_contents($ruta, json_encode($primera, JSON_UNESCAPED_UNICODE));
$rPrimera = wabot_respuestas_rapidas_load();
caso('la primera versión (un solo bloque de $290.000) queda con los precios nuevos',
    count(rr_items($rPrimera, 'Presupuesto y planes')) === 8
    && mb_strpos(json_encode($rPrimera, JSON_UNESCAPED_UNICODE), 'Son alternativas') === false
    && mb_strpos(json_encode($rPrimera, JSON_UNESCAPED_UNICODE), '1. Plan anual: ' . $T['landing']['precio']) !== false);

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
        $con19('Para lo que me contás, te serviría un sitio profesional donde puedas mostrar tus servicios, trabajos e información de contacto, pensado para transmitir confianza y recibir consultas.', '$140.000', '$20.000'),
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
$lineasHoy = static fn($tipo) => '1. Plan anual: ' . $T[$tipo]['precio'] . " incluye mantenimiento\n2. Plan mensual: " . $T[$tipo]['mensualidad'] . " incluye mantenimiento\n";
caso('los cuatro bloques quedan con los precios de hoy',
    mb_strpos($planes21[0], $lineasHoy('landing')) !== false
    && mb_strpos($planes21[1], $lineasHoy('ecommerce')) !== false
    && mb_strpos($planes21[2], $lineasHoy('inmobiliaria')) !== false
    && mb_strpos($planes21[3], $lineasHoy('elearning')) !== false, $planes21[0]);
caso('no queda ningún monto viejo ni las viñetas del 19-sep',
    count(array_filter($planes21, fn($t) => mb_strpos($t, '$140.000') !== false || mb_strpos($t, '$230.000') !== false
        || mb_strpos($t, ' por año') !== false || mb_strpos($t, 'Hosting y dominio .com.ar') !== false)) === 0, implode("\n", $planes21));
caso('las recomendaciones de fábrica viejas pasan a las cortas de ahora',
    mb_strpos($planes21[0], 'Para lo que me contás, te serviría un sitio profesional para mostrar tu negocio') === 0
    && mb_strpos($planes21[2], 'Para lo que me contás, te serviría una web inmobiliaria para publicar propiedades con fotos y filtros') === 0, $planes21[2]);
caso('la que escribió Pablo conserva su texto y solo se le actualiza el bloque',
    mb_strpos($planes21[3], $suyo) === 0 && mb_strpos($planes21[3], 'Los 3 planes incluyen todo:') !== false, $planes21[3]);
caso('el panel aparte de $25.000 pasa al cambio por mes de los dos planes',
    count(array_filter($planes21, fn($t) => mb_strpos($t, 'le sumamos un panel de administración') !== false)) === 0
    && count(array_filter($planes21, fn($t) => mb_strpos($t, 'Los dos planes incluyen un cambio por mes') === 0
        && mb_strpos($t, $T['landing']['mensualidad_cambios'] . ' el sitio profesional y ' . $T['ecommerce']['mensualidad_cambios']) !== false)) === 1, implode("\n", $planes21));
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
caso('un bloque guardado con "tres opciones" pasa a las 3 modalidades de pago',
    mb_strpos($item24, 'Podés elegir una de estas 3 modalidades de pago:') !== false
    && mb_strpos($item24, 'Podés elegir entre tres opciones') === false, $item24);
caso('y la recomendación de Pablo queda arriba, igual', mb_strpos($item24, $suyo24) === 0, $item24);

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

if ($respaldo === null) @unlink($ruta); else file_put_contents($ruta, $respaldo);
if ($marcaRespaldo === null) @unlink($marca); else file_put_contents($marca, $marcaRespaldo);
todo_ok();
