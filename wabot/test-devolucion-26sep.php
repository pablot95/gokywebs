<?php
/**
 * wabot/test-devolucion-26sep.php — los seis errores de la devolución del
 * 26-sep sobre los chats del 17 al 26-sep, más la oferta del primer diseño
 * atada al tipo de web (solo CLI). Cada bloque reproduce la charla real con
 * el clasificador simulado y comprueba lo que el bot tiene que hacer ahora.
 *
 *   1. "Algo simple y económico para mostrar nuestro catálogo" (Francisco)
 *      se llevó la tienda completa: la contradicción explícita a "si vende
 *      algo es tienda" cotiza el sitio profesional con catálogo.
 *   2. La pañalera pidió "vender por la web, pero también como catálogo" y
 *      se llevó el sitio profesional: la venta dicha gana.
 *   3. "Vender mis productos" recibió "confirmame qué parte querés resolver":
 *      lo que ya contestó no se vuelve a preguntar.
 *   4. SHOWTIME preguntó "Su nombre?" dos veces y recibió el rubro las dos:
 *      una pregunta directa se contesta primero y después sigue la pendiente.
 *   5. Xavier ("Pablo amigo, cómo va?", "te acordás que le hicimos un sitio
 *      web a Gabriela", "pego comisión por la indicación") recibió los
 *      planes: un conocido no es un lead, lo sigue Pablo.
 *   6. "Compartimos vacantes laborales de Chaco y Corrientes" se tomó como
 *      alguien pidiendo trabajo: una palabra suelta no deriva.
 *  12. La oferta del primer diseño nombra la tienda y los productos, no
 *      "tu web" a secas.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['form_activo'] = true;

/** Una charla por el borde común, con el clasificador simulado por turno. */
function charla26(array $pasos, $clave, $cfg, array $extra = []) {
    $c = conv_nueva($clave, array_merge(['fase' => 'menu'], $extra));
    $r = [];
    foreach ($pasos as $paso) {
        clasifica($paso[1], $paso[2] ?? []);
        $r = turno($paso[0], $c, $cfg);
    }
    @unlink(WABOT_DATA . '/conv/' . $clave . '.json');
    return [$r, $c];
}

echo "— 1. El que dice que solo quiere mostrar un catálogo no se lleva la tienda completa —\n";

[$r, $c] = charla26([['Necesitamos algo simple y económico para mostrar nuestro catálogo de suplementos', ['rubro_comercio'],
    ['ficha' => ['rubro' => 'tu negocio de suplementos', 'que_vende' => 'suplementos']]]], '999DEV26A', $cfg);
caso('Francisco: "algo simple y económico para mostrar nuestro catálogo" cotiza el sitio profesional con catálogo',
    ($c['tipo'] ?? '') === 'landing' && !empty($c['catalogo']) && !empty($c['precio_dado']), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('la propuesta nombra el catálogo y la imagen es la del sitio profesional',
    mb_stripos($r[0] ?? '', 'con el catálogo de tus productos') !== false
    && ($r[1] ?? '') === wabot_precio_imagen_marcador('landing'), $r[0] ?? '');
caso('avisa que la carga de productos va aparte', mb_stripos($r[0] ?? '', 'carga de los productos va aparte') !== false, $r[0] ?? '');
caso('la oferta del primer diseño habla del catálogo', mb_stripos($r[2] ?? '', 'tu catálogo') !== false, $r[2] ?? '');
caso('la ficha lo anota como catálogo dicho por el cliente',
    wabot_ficha($c)['necesidad'] === 'catalogo' && !empty(wabot_ficha($c)['catalogo_explicito']));

foreach (['Solo quiero mostrar los productos, no vender por la web',
          'Quiero algo tipo catálogo para que me consulten por WhatsApp',
          'Una web sencilla para exhibir mi catálogo, sin carrito',
          'No quiero vender online, solo mostrar lo que hago',
          'vendo ropa pero solo quiero mostrarla y que me escriban',
          'Vendo ropa pero solo quiero mostrar los productos y que me consulten por WhatsApp'] as $f) {
    caso("catálogo dicho: \"$f\"", wabot_texto_pide_catalogo_sin_cobro($f) && wabot_ficha_necesidad_de($f) === 'catalogo',
        wabot_ficha_necesidad_de($f));
}
foreach (['Vendo ropa', 'Quiero un catálogo de cosméticos con producto, stock y precio', 'Vendo cosmética por catálogo',
          'Quiero vender por la web, con catálogo y carrito', 'Necesito algo simple para vender mis productos',
          'Tengo un local de ropa y quiero que me compren online'] as $f) {
    caso("NO es catálogo sin cobro: \"$f\"", !wabot_texto_pide_catalogo_sin_cobro($f) && wabot_ficha_necesidad_de($f) !== 'catalogo',
        wabot_ficha_necesidad_de($f));
}
caso('"no quiero vender online" ya no se lee como que quiere vender', wabot_intencion_web_dicha('no quiero vender online, solo mostrar') === 'mostrar');

/* Lo último que dijo manda: primero "solo mostrar", después "que puedan comprar". */
$cF = conv_nueva('999DEV26A2');
wabot_conv_transcript($cF, 'cliente', 'Vendo velas, pero solo quiero mostrarlas y que me escriban');
wabot_ficha_actualizar($cF, 'Vendo velas, pero solo quiero mostrarlas y que me escriban');
$catalogoAntes = !empty(wabot_ficha($cF)['catalogo_explicito']);
wabot_conv_transcript($cF, 'cliente', 'Pensándolo mejor quiero que puedan comprar y pagar online');
wabot_ficha_actualizar($cF, 'Pensándolo mejor quiero que puedan comprar y pagar online');
caso('si después dice que quiere que le compren online, la ficha vuelve a tienda',
    $catalogoAntes && empty(wabot_ficha($cF)['catalogo_explicito']) && wabot_ficha($cF)['necesidad'] === 'tienda',
    json_encode(wabot_ficha($cF), JSON_UNESCAPED_UNICODE));

echo "— 2. La pañalera: vende por la web, aunque diga catálogo → tienda online —\n";

[$r, $c] = charla26([
    ['Hola.. Tengo una pañalera y juguetería. Estoy averiguando para hacer una página web para el local. Quería consultar qué tipos de páginas realizan, qué opciones ofrecen y aproximadamente qué valores manejan. Gracias',
     ['rubro_comercio', 'pregunta_info'], ['info_keys' => ['rangos'], 'ficha' => ['rubro' => 'tu pañalera y juguetería']]],
], '999DEV26B', $cfg);
caso('la pañalera cotiza la tienda sin preguntar "vender o mostrar"',
    ($c['tipo'] ?? '') === 'ecommerce' && empty($c['catalogo']) && mb_stripos(implode(' ', $r), 'Buscás vender') === false,
    json_encode($r, JSON_UNESCAPED_UNICODE));
$panalera = 'Me gustaría que permita vender por la web, pero también que funcione como catálogo para mostrar productos, precios y stock. La idea es que sea autoadministrable y que después yo pueda actualizar todo fácilmente.';
caso('"vender por la web, pero también como catálogo" es tienda: la venta dicha gana',
    wabot_ficha_necesidad_de($panalera) === 'tienda' && !wabot_texto_pide_catalogo_sin_cobro($panalera));
[$r, $c] = charla26([[$panalera, ['rubro_comercio'], ['ficha' => ['necesidad' => 'catalogo']]]], '999DEV26B2', $cfg);
caso('aunque el clasificador diga catálogo, se lleva la tienda online',
    ($c['tipo'] ?? '') === 'ecommerce' && empty($c['catalogo']) && ($r[1] ?? '') === wabot_precio_imagen_marcador('ecommerce'),
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 3. No preguntar lo que ya contestó —\n";

[$r, $c] = charla26([
    ['Quiero que me compren desde la página', ['otro'], ['ficha' => ['objetivo' => 'que le compren desde la página']]],
    ['Suplementos deportivos', ['otro'], ['ficha' => ['rubro' => 'tu negocio de suplementos deportivos', 'que_vende' => 'suplementos deportivos']]],
], '999DEV26C', $cfg);
caso('"quiero que me compren desde la página" + el rubro: cotiza la tienda sin preguntar qué parte quiere resolver',
    ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado'])
    && mb_stripos(implode(' ', $r), 'querés resolver primero') === false, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('999DEV26D', ['fase' => 'algo_diferente', 'objetivo_preguntado' => true]);
wabot_conv_transcript($c, 'cliente', 'Hola buen día tengo una tienda holística');
wabot_conv_transcript($c, 'bot', (string)$cfg['aclarar_objetivo']);
clasifica(['otro']);
$r = turno('La última vender y cobrar', $c, $cfg);
caso('"La última vender y cobrar" es la tienda, sin volver a preguntar',
    ($c['tipo'] ?? '') === 'ecommerce' && !empty($c['precio_dado'])
    && mb_stripos(implode(' ', $r), 'Buscás vender') === false && mb_stripos(implode(' ', $r), 'querés resolver') === false,
    json_encode($r, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26D.json');

$c = conv_nueva('999DEV26D2', ['fase' => 'algo_diferente', 'objetivo_preguntado' => true]);
wabot_conv_transcript($c, 'cliente', 'Vendo plata 925, aros y pulseras');
wabot_conv_transcript($c, 'bot', (string)$cfg['aclarar_objetivo']);
clasifica(['otro']);
$r = turno('La última', $c, $cfg);
caso('"La última" sola también: la tercera opción es vender y cobrar online', ($c['tipo'] ?? '') === 'ecommerce', json_encode($r, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26D2.json');

$c = conv_nueva('999DEV26D3', ['fase' => 'algo_diferente', 'objetivo_preguntado' => true]);
wabot_conv_transcript($c, 'cliente', 'Soy plomero');
wabot_conv_transcript($c, 'bot', (string)$cfg['aclarar_objetivo']);
clasifica(['otro']);
$r = turno('La primera', $c, $cfg);
caso('"La primera" para un servicio es el sitio profesional', ($c['tipo'] ?? '') === 'landing', json_encode($r, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26D3.json');

echo "— 4. Una pregunta directa se contesta primero, y después sigue la pendiente —\n";

foreach (['Su nombre?', 'Hola, su nombre?', 'Con quién hablo?', 'quien sos?', 'Cómo te llamás?', 'De qué empresa son?', 'Quiénes son ustedes?',
          'Me decís tu nombre?'] as $f) {
    caso("pregunta quién atiende: \"$f\"", wabot_texto_pregunta_quien_atiende($f) && wabot_info_por_palabras($f) === 'quien_atiende',
        (string)wabot_info_por_palabras($f));
}
foreach (['El nombre de mi negocio es Soberana', 'La web queda a mi nombre?', 'Quiero que la web tenga mi nombre y mi logo',
          'A nombre de quién queda el dominio?', 'Sos un bot?'] as $f) {
    caso("NO pregunta quién atiende: \"$f\"", !wabot_texto_pregunta_quien_atiende($f), (string)wabot_info_por_palabras($f));
}

$c = conv_nueva('999DEV26E', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['precio_sin_rubro']]);
$r1 = turno('Hola! Quiero pedir presupuesto para mi web.', $c, $cfg);
clasifica(['otro']);
$r2 = turno('Su nombre?', $c, $cfg);
caso('SHOWTIME: "Su nombre?" recibe quién le escribe y, en el mismo turno, la pregunta comercial pendiente',
    count($r2) === 2 && mb_stripos($r2[0], 'asistente de Gokywebs') !== false && trim($r2[1]) === trim((string)$cfg['contame']),
    json_encode($r2, JSON_UNESCAPED_UNICODE));
clasifica(['saludo']);
$r3 = turno('Su nombre?', $c, $cfg);
caso('la segunda vez, aunque el clasificador diga "saludo", contesta igual y reformula la pregunta pendiente',
    count($r3) === 2 && mb_stripos($r3[0], 'asistente de Gokywebs') !== false && trim($r3[1]) === trim((string)$cfg['contame_2']),
    json_encode($r3, JSON_UNESCAPED_UNICODE));
clasifica(['saludo']);
$r4 = turno('Chau', $c, $cfg);
caso('"Chau" se despide: no recibe "a partir de acá sigue el desarrollador"',
    count($r4) === 1 && mb_stripos($r4[0], 'sigue el desarrollador') === false && ($c['cierre'] ?? '') === 'sin_interes',
    json_encode($r4, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26E.json');

$c = conv_nueva('999DEV26E2', ['fase' => 'nuevo']);
clasifica(['otro']);
$r = turno('quien sos?', $c, $cfg);
caso('como primer mensaje, contesta y pregunta el rubro una sola vez (sin la apertura entera encima)',
    count($r) === 2 && mb_stripos($r[0], 'asistente de Gokywebs') !== false && trim($r[1]) === trim((string)$cfg['contame'])
    && mb_stripos(implode(' ', $r), 'Gracias por contactarnos') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26E2.json');

/* Con el negocio ya contado, la pregunta pendiente es la del objetivo. */
$c = conv_nueva('999DEV26E3', ['fase' => 'algo_diferente']);
wabot_conv_transcript($c, 'cliente', 'Tengo un estudio de yoga y meditación');
wabot_conv_transcript($c, 'bot', (string)$cfg['contame']);
$c['ficha'] = ['rubro' => 'tu estudio de yoga y meditación'];
clasifica(['otro']);
$r = turno('Con quién estoy hablando?', $c, $cfg);
caso('con el rubro ya contado, retoma con la pregunta del objetivo',
    count($r) === 2 && mb_stripos($r[0], 'asistente de Gokywebs') !== false && trim($r[1]) === trim((string)$cfg['aclarar_objetivo']),
    json_encode($r, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26E3.json');

/* Sin IA, lo mismo. */
$c = conv_nueva('999DEV26E4', ['fase' => 'menu']);
$r = wabot_fallback_ia('Su nombre?', $c, $cfg);
caso('sin IA también contesta y sigue con la pregunta pendiente',
    count($r) === 2 && mb_stripos($r[0], 'asistente de Gokywebs') !== false && trim($r[1]) === trim((string)$cfg['contame']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 5. Un conocido no recibe los planes —\n";

foreach (['Pablo amigo, cómo va?', 'Xavier aqui, te acordas que le hicimos un sítio web a Gabriela',
          'Tengo una chica pidiéndome un sitio web también! Hacemos el mismo trabajo? La guió con la logística un poco y le pasó tu contacto así te envía todo el material para hacerlo y pego comisión por la indicación',
          'Ya trabajamos juntos el año pasado', 'Te paso un cliente', 'Tengo un referido para vos', 'Vengo de parte de Gabriela',
          'Le pasé tu contacto a una amiga', 'Hola Pablo, tanto tiempo!'] as $f) {
    caso("conocido: \"$f\"", wabot_texto_es_conocido($f) && wabot_contexto_consulta($f) === 'conocido', (string)wabot_contexto_consulta($f));
}
foreach (['Hola, quiero una web para mi negocio', 'Hola Pablo, cuánto sale una tienda online?', 'Hay comisión por venta?',
          'Cobran comisión por cada venta?', 'Somos una inmobiliaria y cobramos comisión por venta', 'Necesito una página para mi comisión de fomento',
          'Quiero mostrar mis trabajos y que me contacten', 'Tengo una tienda de ropa', 'Hola Pablo, necesito una página para mi estudio'] as $f) {
    caso("NO es conocido: \"$f\"", wabot_contexto_consulta($f) !== 'conocido', (string)wabot_contexto_consulta($f));
}

$c = conv_nueva('999DEV26F', ['fase' => 'menu']);
clasifica(['saludo']);
$r = turno('Pablo amigo, cómo va?', $c, $cfg);
caso('Xavier: "Pablo amigo, cómo va?" no arranca el embudo: avisa que contesta el asistente y lo pasa a Pablo',
    $r === [(string)$cfg['mensaje_conocido']] && ($c['contexto_consulta'] ?? '') === 'conocido' && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']), json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);
$r2 = turno('Xavier aqui, te acordas que le hicimos un sítio web a Gabriela', $c, $cfg);
caso('lo que sigue queda para Pablo, sin vender', $r2 === [] && empty($c['precio_dado']), json_encode($r2, JSON_UNESCAPED_UNICODE));
clasifica(['rubro_landing']);
$r3 = turno('Tengo una chica pidiéndome un sitio web también! Hacemos el mismo trabajo? La guió con la logística un poco y le pasó tu contacto así te envía todo el material para hacerlo y pego comisión por la indicación', $c, $cfg);
caso('ni con el pedido de la referida se cotiza nada', $r3 === [] && empty($c['precio_dado']) && empty($c['tipo']), json_encode($r3, JSON_UNESCAPED_UNICODE));
@unlink(WABOT_DATA . '/conv/999DEV26F.json');

echo "— 6. Una palabra suelta no deriva a laboral —\n";

[$r, $c] = charla26([['Compartimos vacantes laborales de Chaco y corrientes', ['otro'], ['ficha' => ['interlocutor' => 'empleo']]]], '999DEV26G', $cfg);
caso('"Compartimos vacantes laborales" no es alguien pidiendo trabajo: se cotiza el sitio profesional',
    $r !== [(string)$cfg['mensaje_laboral']] && empty($c['contexto_consulta']) && ($c['tipo'] ?? '') === 'landing' && !empty($c['precio_dado']),
    json_encode($r, JSON_UNESCAPED_UNICODE));
foreach (['Hola, quiero mandarles mi CV', 'estan tomando programadores?', 'Les escribo por una propuesta laboral, tengo experiencia en React',
          'tienen vacantes?', 'busco trabajo, soy plomero', 'Soy desarrollador y me gustaría sumarme al equipo'] as $f) {
    caso("sigue siendo laboral: \"$f\"", wabot_texto_pide_trabajo($f));
}
foreach (['Compartimos vacantes laborales de Chaco y corrientes', 'Somos una consultora de recursos humanos', 'necesito más trabajo para mi taller',
          'Tengo una empresa de trabajo en altura', 'Publicamos ofertas laborales de la zona', 'Quiero una web para mi bolsa de trabajo'] as $f) {
    caso("NO es laboral: \"$f\"", !wabot_texto_pide_trabajo($f));
}
caso('la bolsa de empleo es un servicio para el respaldo sin IA', wabot_fallback_rubro_local('Compartimos vacantes laborales de Chaco y corrientes') === 'landing');
[$r, $c] = charla26([['Hola, les escribo por una propuesta laboral, tengo experiencia en React', ['otro'], ['ficha' => ['interlocutor' => 'empleo']]]], '999DEV26G2', $cfg);
caso('el que pide trabajo de verdad sigue recibiendo el texto laboral', $r === [(string)$cfg['mensaje_laboral']], json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— 12. La oferta del primer diseño, atada al tipo —\n";

foreach (['landing' => ['rubro_landing', 'soy abogado', 'tus servicios', 'tu web'],
          'ecommerce' => ['rubro_comercio', 'vendo ropa', 'tus productos', 'tu tienda online'],
          'elearning' => ['rubro_cursos', 'doy cursos de pastelería', 'tus cursos', 'tu plataforma de cursos'],
          'inmobiliaria' => ['rubro_inmobiliaria', 'tengo una inmobiliaria', 'tus propiedades', 'tu web inmobiliaria']] as $tipo => [$accion, $dice, $que, $de]) {
    $c = conv_nueva('999DEV26H' . $tipo);
    clasifica([$accion]);
    $r = wabot_engine($dice, $c, $cfg);
    $oferta = (string)($r[2] ?? '');
    caso("$tipo: la oferta nombra $de y $que",
        mb_stripos($oferta, $que) !== false && mb_stripos($oferta, $de) !== false
        && str_starts_with($oferta, 'Si te interesa, te preparamos sin cargo un primer diseño') && str_ends_with($oferta, 'Querés que lo armemos?')
        && mb_stripos($oferta, 'cómo quedaría') !== false, $oferta);
    caso("$tipo: se reconoce como el mensaje del primer diseño, sale 2 segundos después y ofrece la muestra",
        wabot_es_texto_demo($oferta, $cfg) && wabot_demora_tipeo($oferta, $cfg) === 2.0 && wabot_texto_ofrece_demo($oferta));
    $cOf = ['transcript' => [['q' => 'bot', 't' => $oferta, 'ts' => time()]]];
    caso("$tipo: cuenta como muestra ya ofrecida", wabot_cta_muestra_ya_ofrecida($cOf));
}
caso('el genérico sigue para lo que no tiene tipo', wabot_tres_pasos_texto(['tipo' => ''], $cfg) === (string)$cfg['msg_tres_pasos']);

todo_ok();
