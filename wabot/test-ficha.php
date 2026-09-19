<?php
/**
 * wabot/test-ficha.php — la ficha del cliente y los casos del feedback del
 * 18-sep (solo CLI). Cada caso es una charla real resumida: lo que el bot
 * hacía mal y lo que tiene que hacer ahora. El clasificador va simulado; la
 * ficha que propone Gemini se valida contra lo que el cliente escribió.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['form_activo'] = true;

/** Un turno por el borde común con el clasificador simulado. */
function charla(array $mensajes, $clave, $cfg) {
    $c = conv_nueva($clave, ['fase' => 'menu']);
    $r = [];
    foreach ($mensajes as [$texto, $acciones, $extra]) {
        clasifica($acciones, $extra);
        $r = turno($texto, $c, $cfg);
    }
    return [$c, $r];
}

echo "— 1. Lo que la ficha lee sola —\n";

$f = wabot_ficha_funciones_de('Quiero turnos a WhatsApp, Instagram y calificaciones');
caso('turnos por WhatsApp, Instagram y calificaciones son tres funciones pedidas',
    $f === ['turnos_whatsapp', 'instagram', 'resenas'], json_encode($f));
caso('"vendo por Instagram" cuenta el negocio, no pide un botón',
    !in_array('instagram', wabot_ficha_funciones_de('Vendo ropa por Instagram hace dos años'), true));
caso('"doy clases de inglés" no pide la web en otro idioma',
    !in_array('idiomas', wabot_ficha_funciones_de('Doy clases de inglés para chicos'), true));
caso('"la web en inglés y en español" sí',
    in_array('idiomas', wabot_ficha_funciones_de('La necesito en inglés y en español'), true));
caso('Instagram con publicidad es publicidad, no el acceso a Instagram',
    wabot_ficha_funciones_de('quiero que me manejen la publicidad en Instagram') === []);

caso('"tener seguidores" es publicidad: no la hacemos',
    wabot_ficha_fuera_de('Vendo sahumerios y quiero tener seguidores, subir la venta y demás') === ['publicidad']);
caso('"manejo de publicidad en Instagram o Google" también',
    wabot_ficha_fuera_de('Necesito manejo de publicidad en Instagram o Google') === ['publicidad']);
caso('"me hacen el logo?" es el diseño del logo', wabot_ficha_fuera_de('Y me hacen el logo también?') === ['logo']);
caso('pero "quiero poner mi logo" no', wabot_ficha_fuera_de('quiero poner mi logo arriba') === []);

caso('Mercado Libre es una señal de proyecto especial', wabot_ficha_senales_de('Quiero que se conecte con mis publicaciones de Mercado Libre') === ['mercadolibre']);
caso('el sistema que ya usa también', wabot_ficha_senales_de('Uso Tango y quiero sincronizar el stock') === ['integracion']);
caso('integrar Mercado Pago NO es una integración especial', wabot_ficha_senales_de('Quiero cobrar con Mercado Pago') === []);
caso('la descarga automática del archivo también',
    wabot_ficha_senales_de('Que cuando paguen se descargue solo el pdf') === ['entrega_digital']);

caso('"3.500 productos" se lee como 3500', wabot_ficha_cantidad_de('Tengo una ferretería chica, son como 3.500 productos') === 3500);
caso('"tengo 45 años" no es una cantidad de productos', wabot_ficha_cantidad_de('Tengo 45 años y vendo ropa') === 0);

caso('"solo mostrar y que me consulten por WhatsApp" es catálogo',
    wabot_ficha_necesidad_de('Vendo ropa pero solo quiero mostrar los productos y que me consulten por WhatsApp') === 'catalogo');
caso('restaurante con hospedaje es hospedaje', wabot_ficha_necesidad_de('Tenemos un restaurant con hospedaje') === 'hospedaje');
caso('vender ebooks son productos digitales', wabot_ficha_necesidad_de('Vendo ebooks de recetas') === 'productos_digitales');
caso('vender ropa no dice nada de la necesidad: es tienda por defecto', wabot_ficha_necesidad_de('Vendo ropa') === '');

echo "— 2. La ficha no borra, y el clasificador solo propone —\n";

$c = conv_nueva('549110000FICHA1TEST');
wabot_conv_transcript($c, 'cliente', 'Tengo un local de indumentaria femenina en Salta');
wabot_ficha_actualizar($c, 'Tengo un local de indumentaria femenina en Salta',
    ['ficha' => ['rubro' => 'tu local de indumentaria femenina', 'que_vende' => 'ropa de mujer', 'necesidad' => 'tienda', 'interlocutor' => 'cliente']]);
$fc = wabot_ficha($c);
caso('el rubro validado queda en la ficha y en el rubro de la propuesta',
    $fc['rubro'] === 'tu local de indumentaria femenina' && ($c['rubro_pitch'] ?? '') === 'tu local de indumentaria femenina', json_encode($fc, JSON_UNESCAPED_UNICODE));
caso('"ropa de mujer" no está en lo que escribió: no entra como qué vende', $fc['que_vende'] === '');
caso('la necesidad y el interlocutor, de las listas cerradas', $fc['necesidad'] === 'tienda' && $fc['interlocutor'] === 'cliente');
wabot_ficha_actualizar($c, 'ok', ['ficha' => ['rubro' => null, 'necesidad' => 'cualquier cosa']]);
caso('un turno sin datos no borra nada', wabot_ficha($c)['rubro'] === 'tu local de indumentaria femenina' && wabot_ficha($c)['necesidad'] === 'tienda');
wabot_ficha_actualizar($c, 'ok', ['ficha' => ['rubro' => 'tu verdulería']]);
caso('un rubro que el cliente nunca nombró no pasa', wabot_ficha($c)['rubro'] === 'tu local de indumentaria femenina');

echo "— 3. La propuesta demuestra que escuchó —\n";

[$c, $r] = charla([['Tengo un local de indumentaria femenina', ['rubro_comercio'],
    ['ficha' => ['rubro' => 'tu local de indumentaria femenina', 'necesidad' => 'tienda']]]], '549110000INDUTEST', $cfg);
caso('indumentaria: "Para tu local de indumentaria femenina, te serviría una tienda online…"',
    str_starts_with($r[0] ?? '', 'Para tu local de indumentaria femenina, te serviría una tienda online donde muestres tus productos'), $r[0] ?? '');

[$c, $r] = charla([['Soy peluquera, quiero una web con turnos a WhatsApp, Instagram y calificaciones', ['rubro_landing'], []]], '549110000TURNOSTEST', $cfg);
caso('turnos por WhatsApp, Instagram y calificaciones se nombran en la propuesta',
    mb_stripos($r[0] ?? '', 'Y lleva lo que me pediste: un botón para pedir turnos por WhatsApp, el acceso a tu Instagram y una sección de reseñas de tus clientes.') !== false,
    $r[0] ?? '');
caso('y siguen el precio del sitio profesional y la oferta', strpos($r[0] ?? '', '$180.000') !== false && mb_stripos($r[1] ?? '', 'primer diseño') !== false);

[$c, $r] = charla([['Vendo sahumerios y quiero tener seguidores, subir la venta y demás', ['rubro_comercio'], []]], '549110000SAHUTEST', $cfg);
caso('sahumerios: primero que la publicidad no la hacemos, y cómo ayuda la tienda',
    str_starts_with($r[0] ?? '', 'La publicidad y el manejo de redes no los hacemos: nosotros nos encargamos de la web. Con la tienda, la gente que te sigue en redes te compra directo desde el link'),
    $r[0] ?? '');
caso('y después la propuesta con el precio de la tienda', mb_stripos($r[0] ?? '', 'te serviría una tienda online') !== false && strpos($r[0] ?? '', '$290.000') !== false);
caso('la aclaración sale una sola vez', ($c['fuera_avisado'] ?? []) === ['publicidad']);

[$c, $r] = charla([['Tenemos un restaurant con hospedaje en las sierras', ['rubro_landing'], []]], '549110000HOSPTEST', $cfg);
caso('restaurante con hospedaje: habitaciones, restaurante y reserva online, con precio de sitio profesional',
    mb_stripos($r[0] ?? '', 'muestres las habitaciones, el restaurante y los servicios, y tus huéspedes te pidan la reserva online') !== false
    && strpos($r[0] ?? '', '$180.000') !== false, $r[0] ?? '');

echo "— 4. Catálogo + WhatsApp: sitio profesional más la carga de productos (Pablo, 18-sep) —\n";

[$c, $r] = charla([['Vendo ropa pero solo quiero mostrar los productos y que me consulten por WhatsApp', ['rubro_comercio'], []]], '549110000CATATEST', $cfg);
caso('se cotiza como sitio profesional con catálogo',
    ($c['tipo'] ?? '') === 'landing' && !empty($c['catalogo'])
    && mb_stripos($r[0] ?? '', 'un sitio profesional con el catálogo de tus productos') !== false
    && strpos($r[0] ?? '', '$180.000') !== false && strpos($r[0] ?? '', '$15.000') !== false, $r[0] ?? '');
caso('con la carga de productos aparte, a $500 cada uno',
    strpos($r[0] ?? '', 'La carga de los productos va aparte: $500 por producto.') !== false);
$campos = wabot_lead_campos($c, $cfg);
caso('y el boceto lo dice: sitio profesional con catálogo y la carga aparte',
    (string)reset($campos['tipoDetectadoLabel']) === 'Sitio profesional con catálogo'
    && str_ends_with((string)reset($campos['presupuesto_cotizado']), '+ carga de productos $500 c/u'), json_encode($campos['presupuesto_cotizado']));
[$c, $r] = charla([['Vendo ropa de mujer', ['rubro_comercio'], []]], '549110000TIENDATEST', $cfg);
caso('sin decirlo, lo que vende productos sigue siendo tienda (29-ago)', ($c['tipo'] ?? '') === 'ecommerce' && empty($c['catalogo']));

echo "— 5. Lo que no es de lista lo toma el desarrollador —\n";

[$c, $r] = charla([['Tengo una ferretería chica, son como 3.500 productos', ['rubro_comercio'], []]], '549110000FERRETEST', $cfg);
caso('3.500 productos: nombra el motivo y deriva, sin precio de lista',
    count($r) === 1 && mb_stripos($r[0], 'Con 3.500 productos no es una tienda estándar') === 0 && strpos($r[0], '$') === false
    && ($c['fase'] ?? '') === 'derivado' && !empty($c['handoff_pendiente']) && empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
[$c, $r] = charla([['Vendo repuestos y quiero que la web tome mis publicaciones de Mercado Libre', ['rubro_comercio'], []]], '549110000MELITEST', $cfg);
caso('Mercado Libre: lo cotiza el desarrollador',
    mb_stripos($r[0] ?? '', 'Mercado Libre no entra en el precio de lista') !== false && empty($c['precio_dado']), $r[0] ?? '');
[$c, $r] = charla([['Tengo un vivero con 120 plantas distintas', ['rubro_comercio'], []]], '549110000POCOSTEST', $cfg);
caso('120 productos sí es de lista', !empty($c['precio_dado']) && strpos($r[0] ?? '', '$290.000') !== false);

echo "— 6. Lo que el bot entendía mal —\n";

[$c, $r] = charla([['Tengo una regalería: souvenirs, figuras de yeso, velas, sahumerios, impresiones y cuadernillos para colorear', ['rubro_comercio'], []]], '549110000REGATEST', $cfg);
caso('la regalería se cotiza tienda: nadie habló de cursos',
    !empty($c['precio_dado']) && mb_stripos(implode(' ', $r), 'cursos') === false && empty($c['mixto_avisado']), implode(' | ', $r));
[$c, $r] = charla([['Hola, quería hacer una consulta. Vendo ropa de mujer', ['rubro_comercio'], []]], '549110000CONSULTATEST', $cfg);
caso('"hacer una consulta" no convierte la tienda en una necesidad mixta',
    !empty($c['precio_dado']) && empty($c['mixto_avisado']), implode(' | ', $r));

[$c, $r] = charla([['Somos una distribuidora de cosméticos, insumos de manicura y herramientas para peluquerías', ['otro'], []]], '549110000COSMETEST', $cfg);
caso('la distribuidora de cosméticos recibe la tienda, no "qué vendés"',
    ($c['tipo'] ?? '') === 'ecommerce' && mb_stripos(implode(' ', $r), 'qué vendés') === false, implode(' | ', $r));

[$c, $r] = charla([['Hacemos piletas de fibra y quinchos', ['otro'], ['ficha' => ['que_vende' => 'piletas de fibra y quinchos']]]], '549110000PILETATEST', $cfg);
caso('si ya dijo qué hace, no se le vuelve a preguntar qué vende: se pregunta qué necesita que haga la web',
    $r === [(string)$cfg['aclarar_objetivo']], json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
$r = turno('no sé, algo lindo', $c, $cfg);
caso('y si tampoco con eso hay propuesta, lo toma Pablo en vez de preguntar otra vez',
    ($c['fase'] ?? '') === 'derivado' && mb_stripos(implode(' ', $r), 'qué vendés') === false, json_encode($r, JSON_UNESCAPED_UNICODE));

[$c, $r] = charla([['Trabajo en feria', ['rubro_comercio'], []]], '549110000FERIATEST', $cfg);
caso('"trabajo en feria" no se cotiza: primero qué vende',
    empty($c['precio_dado']) && $r === [(string)$cfg['contame']], json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 7. No todos los que escriben son clientes —\n";

[$c, $r] = charla([['Hola, soy desarrollador web y quería saber si están buscando gente para trabajar con ustedes', ['objecion_ya_tiene_web'], []]], '549110000DEVTEST', $cfg);
caso('el desarrollador que pide trabajo recibe el texto laboral, no una venta',
    $r === [(string)$cfg['mensaje_laboral']] && ($c['contexto_consulta'] ?? '') === 'laboral', json_encode($r, JSON_UNESCAPED_UNICODE));
[$c, $r] = charla([['Hola, les escribo por una propuesta laboral, tengo experiencia en React', ['otro'], ['ficha' => ['interlocutor' => 'empleo']]]], '549110000DEV2TEST', $cfg);
caso('lo que las palabras no ven lo ve el clasificador, si el mensaje lo respalda',
    $r === [(string)$cfg['mensaje_laboral']], json_encode($r, JSON_UNESCAPED_UNICODE));
[$c, $r] = charla([['Soy diseñadora y quiero una web para mostrar mis trabajos', ['rubro_landing'], ['ficha' => ['interlocutor' => 'empleo']]]], '549110000DISETEST', $cfg);
caso('pero la diseñadora que pide una web es una clienta, diga lo que diga el clasificador',
    !empty($c['precio_dado']) && empty($c['contexto_consulta']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 8. Ninguna parte del mensaje queda sin contestar —\n";

[$c, $r] = charla([['Ya tengo web, trabajan con Tiendanube? Y necesito que me manejen la publicidad en Instagram y Google', ['objecion_ya_tiene_web', 'menciona_plataforma'], []]], '549110000WEBTEST', $cfg);
$todo = implode("\n", $r);
caso('el que ya tiene web y pide publicidad escucha que la publicidad no la hacemos',
    mb_stripos($todo, 'La publicidad y el manejo de redes no los hacemos') !== false, $todo);
caso('y queda con el desarrollador', ($c['fase'] ?? '') === 'derivado' && mb_stripos($todo, 'sigue el desarrollador') !== false, $todo);
/* Con Gemini caído el turno lo contesta el respaldo, que no pasa por la
 * derivación: la aclaración de la publicidad igual tiene que salir. */
$c = conv_nueva('549110000WEB2TEST', ['fase' => 'menu']);
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);
$r = turno('Ya tengo una web, trabajan con Tiendanube? Y necesito que me manejen la publicidad en Instagram y Google', $c, $cfg);
caso('sin IA también se aclara que la publicidad no la hacemos, una sola vez',
    mb_substr_count(implode("\n", $r), 'La publicidad y el manejo de redes no los hacemos') === 1, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_nueva('549110000PASTETEST', ['fase' => 'menu']);
$r = turno('tengo una pasteleria', $c, $cfg);
caso('sin IA, la pastelería se cotiza como tienda', ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 9. La ficha en el panel y en el boceto —\n";

[$c, $r] = charla([['Soy peluquera, quiero una web con turnos a WhatsApp, Instagram y calificaciones', ['rubro_landing'],
    ['ficha' => ['rubro' => 'tu peluquería', 'que_vende' => 'peluquería']]]], '549110000PANELTEST', $cfg);
$res = wabot_ficha_resumen($c, $cfg);
caso('el resumen dice qué ofrece y qué pidió', mb_stripos($res, 'Pidió: un botón para pedir turnos por WhatsApp') !== false, $res);
$campos = wabot_lead_campos($c, $cfg);
caso('y el boceto lo lleva en el bloque que se lee al diseñar',
    mb_stripos((string)reset($campos['objetivo_web']), 'Del chat:') !== false, (string)reset($campos['objetivo_web']));
$cR = $c; $cR['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($cR, $cfg, time());
caso('una sesión vieja arranca con la ficha vacía', empty($cR['ficha']) && empty($cR['catalogo']) && empty($cR['fuera_avisado']));

todo_ok();
