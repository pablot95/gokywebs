<?php
/**
 * wabot/test-redactor.php — tests de la capa de redacción natural (solo CLI).
 * Verifica que lo que no puede fallar (precio, link, derivación) esté blindado.
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;

$cfg = wabot_config_load();
$cfg['modo_redaccion'] = 'natural';
// El form queda apagado por defecto (momentáneamente); esta suite ejercita
// el mecanismo con el link activo, como el resto de las pruebas del motor.
$cfg['form_activo'] = true;

$fallas = 0; $total = 0;
function caso($nombre, $ok) {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . "\n";
    if (!$ok) $fallas++;
}

$BASE_PRECIO = "Perfecto, eso tendría un precio de \$200.000 por todo el desarrollo. En este link podés ver todo lo que incluye: gokywebs.com/presupuestos/sitioprofesional\nSiempre ofrecemos un prediseño gratis de la web";

echo "— Validaciones sobre lo que devuelve el modelo —\n";

$r = wabot_validar_redaccion("Dale, en tu caso sale \$200.000 por todo el desarrollo. Acá tenés el detalle: gokywebs.com/presupuestos/sitioprofesional y siempre hacemos un prediseño gratis antes.", $BASE_PRECIO, $cfg);
caso('redacción válida con precio y link exactos → se acepta', is_string($r) && strpos($r, '$200.000') !== false);

$r = wabot_validar_redaccion("Sale doscientos mil pesos. Mirá gokywebs.com/presupuestos/sitioprofesional", $BASE_PRECIO, $cfg);
caso('precio escrito en letras → se rechaza (usa el texto fijo)', $r === null);

$r = wabot_validar_redaccion("Sale \$200.000. Mirá gokywebs.com/presupuestos/landing", $BASE_PRECIO, $cfg);
caso('link en minúscula (daría 404) → se rechaza', $r === null);

$r = wabot_validar_redaccion("Sale \$200.000. Escribinos a wa.me/5491111111111", $BASE_PRECIO, $cfg);
caso('link inventado que no estaba en el base → se rechaza', $r === null);

$r = wabot_validar_redaccion("Sale \$210.000 en tu caso. gokywebs.com/presupuestos/sitioprofesional", $BASE_PRECIO, $cfg);
caso('precio cambiado → se rechaza', $r === null);

$r = wabot_validar_redaccion("Dale 😊 sale \$200.000, mirá gokywebs.com/presupuestos/sitioprofesional", $BASE_PRECIO, $cfg);
caso('emoji → se limpia y se acepta', is_string($r) && strpos($r, '😊') === false && strpos($r, '$200.000') !== false);

$r = wabot_validar_redaccion("¿Te sirve? Sale \$200.000. gokywebs.com/presupuestos/sitioprofesional ¡Genial!", $BASE_PRECIO, $cfg);
caso('signos de apertura → se limpian', is_string($r) && strpos($r, '¿') === false && strpos($r, '¡') === false);

$r = wabot_validar_redaccion(str_repeat("bla ", 300) . "\$200.000 gokywebs.com/presupuestos/sitioprofesional", $BASE_PRECIO, $cfg);
caso('respuesta larguísima → se rechaza', $r === null);

$r = wabot_validar_redaccion("   ", $BASE_PRECIO, $cfg);
caso('respuesta vacía → se rechaza', $r === null);

$r = wabot_validar_redaccion('"Sale $200.000, mirá gokywebs.com/presupuestos/sitioprofesional"', $BASE_PRECIO, $cfg);
caso('comillas envolventes → se sacan', is_string($r) && $r[0] !== '"');

$BASE_SIMPLE = "Contame un poco qué andas necesitando";
$r = wabot_validar_redaccion("Dale, contame un poco de qué se trata tu negocio", $BASE_SIMPLE, $cfg);
caso('mensaje sin precio ni link → se acepta libre', is_string($r));

// Bug real de producción: el modelo inventó "$170.000" y "$145.000" para
// landings sin haber llamado a dar_precio, así que no había BASE con la que
// compararlo. La validación vieja solo chequeaba que el precio del base
// estuviera en la salida; nunca chequeaba lo inverso.
$r = wabot_validar_redaccion("Te preparo una landing. El valor es de \$170.000. gokywebs.com/presupuestos/sitioprofesional", "", $cfg);
caso('precio inventado SIN ningún base → se rechaza', $r === null);

$r = wabot_validar_redaccion("El desarrollo completo tiene un valor de \$145.000.", "", $cfg);
caso('otro precio inventado sin base → se rechaza', $r === null);

$r = wabot_validar_redaccion("Sale \$145.000 pero fijate: " . $BASE_PRECIO, $BASE_PRECIO, $cfg);
caso('precio real Y uno inventado juntos → se rechaza igual (no alcanza con que el real esté)', $r === null);

$r = wabot_validar_redaccion("Contame a qué te dedicás así te paso el precio exacto.", "", $cfg);
caso('sin ningún precio de por medio → se acepta libre', is_string($r));

echo "— Integración con el motor —\n";

function convNueva() {
    return ['tel'=>'RTEST','fase'=>'nuevo','tipo'=>null,'descripcion'=>null,'colores'=>null,
        'espera_avisada'=>false,'no_texto_avisado'=>false,'bot_off'=>false,'pausado_hasta'=>0,
        'lead_creado'=>false,'msgs'=>[],'ultimo_ts'=>0,'ultimo_cliente_ts'=>0,'transcript'=>[],
        'pitch_hecho'=>true];
}

// El clasificador se simula; el redactor devuelve algo válido.
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['rubro_landing'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function ($msg, $base, $conv, $cfg) {
    return "Mirá, para lo tuyo va una Landing: \$180.000 por todo el desarrollo. Todo el detalle está acá: gokywebs.com/presupuestos/sitioprofesional y te hacemos un prediseño gratis antes de que decidas.";
};
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('modo natural → manda la versión redactada del primero',
    count($r) === 2 && strpos($r[0], 'Mirá, para lo tuyo') === 0
    && strpos($r[0], '$180.000') !== false);
caso('la propuesta del prediseño va aparte, CON el link, y NO se reescribe',
    stripos($r[1], 'cómo podría quedar tu web') !== false && strpos($r[1], 'gokywebs.com/form/') !== false);

// Si el redactor se manda una macana, tiene que salir el texto fijo.
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "Te sale carísimo, andá a otro lado 🤑 mirá tiendanube.com"; };
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('redacción inválida → cae al texto fijo del motor',
    count($r) === 2 && strpos($r[0], '$180.000') !== false && strpos($r[0], 'tiendanube') === false);

// Si Gemini se cae (null), también.
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return null; };
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('redactor caído → cae al texto fijo', count($r) === 2 && strpos($r[0], '$180.000') !== false);

// La derivación nunca se reescribe.
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['pide_humano'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "Bueno dale, esperá que te atiendo yo en un rato."; };
$c = convNueva();
$r = wabot_responder('me pasas con alguien del equipo?', $c, $cfg);
caso('derivación → se manda el texto fijo, nunca la versión libre', $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

/* Pedir una llamada deriva antes de llegar al modelo. Marcelo escribió
 * "Llamame", el bot le contestó que no suele hacer llamadas y cerró con
 * "Entonces no me interesa" (28-ago). */
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['rubro_landing'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "No solemos hacer llamadas, es todo por acá."; };
$c = convNueva();
$r = wabot_responder('Llamame', $c, $cfg);
caso('"Llamame" → deriva a Pablo, no lo contesta el modelo',
    $r === [$cfg['pide_llamada']] && $c['fase'] === 'derivado' && !empty($c['handoff_pendiente']));

$c = convNueva();
$r = wabot_responder('prefiero hablarlo por telefono', $c, $cfg);
caso('"prefiero hablarlo por teléfono" → también deriva', $r === [$cfg['pide_llamada']]);

// Pero el lead que abre la charla NO es un pedido de llamada.
$c = convNueva();
$r = wabot_responder('hola, quiero hablar sobre una pagina web', $c, $cfg);
caso('"quiero hablar sobre una página" sigue el embudo normal',
    $r !== [$cfg['pide_llamada']] && $c['fase'] !== 'derivado');

// Con el modo apagado no se toca nada.
$cfgFijo = $cfg; $cfgFijo['modo_redaccion'] = 'fijo';
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['rubro_ecommerce'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "algo totalmente distinto"; };
$c = convNueva();
$r = wabot_responder('vendo ropa', $c, $cfgFijo);
caso('modo fijo → el redactor ni se llama',
    strpos($r[0], 'algo totalmente distinto') === false
    && strpos($r[0], '$290.000') !== false);
caso('el punto final de la oración no forma parte del precio exigido',
    wabot_validar_redaccion('Sale $290.000 por todo, mirá gokywebs.com/presupuestos/ecommerce',
        wabot_msg_precio_texto('ecommerce', $cfg), $cfg) !== null);
caso('en la parte 1 el redactor no puede colar la seña: no está en el base',
    wabot_validar_redaccion('Sale $290.000 por todo, con seña de $60.000, mirá gokywebs.com/presupuestos/ecommerce',
        wabot_msg_precio_texto('ecommerce', $cfg), $cfg) === null);
caso('tampoco puede colar 3 pagos: ya no está en el base',
    wabot_validar_redaccion('Sale $290.000 por todo, o en 3 pagos de $100.000, mirá gokywebs.com/presupuestos/ecommerce',
        wabot_msg_precio_texto('ecommerce', $cfg), $cfg) === null);
caso('el precio viene con el link del presupuesto (Pablo, 2-sep)',
    strpos($r[0], 'presupuestos/') !== false);

echo "— El salto de línea se garantiza aunque la IA lo aplaste —\n";

$v = wabot_validar_redaccion(
    'Dale, para lo tuyo un ecommerce sale $320.000. El detalle completo está en gokywebs.com/presupuestos/ecommerce',
    "Perfecto, eso tendría un valor de \$320.000 para todo el desarrollo.\nEn este link: gokywebs.com/presupuestos/ecommerce",
    $cfg);
caso('si la IA escribió todo en una línea, el link se corta a renglón nuevo',
    $v !== null && strpos($v, "\nEl detalle completo está en gokywebs.com/presupuestos/ecommerce") !== false);

$v = wabot_validar_redaccion(
    "Sale \$320.000 todo el desarrollo.\nMirá el detalle: gokywebs.com/presupuestos/ecommerce",
    "base con \$320.000 y gokywebs.com/presupuestos/ecommerce",
    $cfg);
caso('si ya venía con su salto, no se toca', substr_count($v, "\n") === 1);

$v = wabot_validar_redaccion(
    'El plan sale $15.000 por mes, mirá gokywebs.com/mantenimientoweb',
    'El mantenimiento es opcional. Sale $15.000 y acá lo ves: gokywebs.com/mantenimientoweb',
    $cfg);
caso('el link de mantenimiento es permitido, no se rechaza como inventado', $v !== null);

$v = wabot_validar_redaccion(
    'El plan sale $15.000 por mes, mirá gokywebs.com/mantenimiento-trucho',
    'El mantenimiento es opcional. Sale $15.000.',
    $cfg);
caso('un link de mantenimiento inventado sí se rechaza', $v === null);

echo "— Un descuento en palabras tampoco pasa el validador —\n";

$basePrecio = 'El desarrollo completo tiene un valor de $200.000.';
caso('"te lo dejo a mitad de precio" se rechaza',
    wabot_validar_redaccion('Dale, te lo dejo a mitad de precio y arrancamos con los $200.000 en dos partes.', $basePrecio, $cfg) === null);
caso('"20% de descuento" se rechaza',
    wabot_validar_redaccion('Te hacemos un 20% de descuento sobre los $200.000.', $basePrecio, $cfg) === null);
caso('"20 por ciento" en letras también',
    wabot_validar_redaccion('Puedo bajarte un 20 por ciento si cerras hoy. Son $200.000.', $basePrecio, $cfg) === null);
caso('"te queda en 160 mil" también',
    wabot_validar_redaccion('Con la promo te queda en 160 mil. El precio de lista es $200.000.', $basePrecio, $cfg) === null);
caso('una respuesta normal con el precio exacto sigue pasando',
    wabot_validar_redaccion('El desarrollo completo sale $200.000 y arrancamos cuando quieras.', $basePrecio, $cfg) !== null);
caso('si el BASE ya trae la palabra descuento (texto oficial), no se rechaza por eso',
    wabot_validar_redaccion('No hacemos descuento, el precio es $200.000.', 'No hacemos descuento: el valor es $200.000.', $cfg) !== null);

echo "— El chequeo de links es exacto: un dominio recortado no pasa —\n";

$baseLink = "El detalle está acá: gokywebs.com/presupuestos/sitioprofesional";
caso('el link exacto pasa',
    wabot_validar_redaccion("Mirá el detalle en:\ngokywebs.com/presupuestos/sitioprofesional", $baseLink, $cfg) !== null);
caso('"gokywebs.co" (dominio recortado) se rechaza',
    wabot_validar_redaccion("Mirá el detalle en gokywebs.co y me contás.", $baseLink, $cfg) === null);

echo "— Dos artículos pegados: \"iría un una página\" (salió así en producción) —\n";

$basePrecio = wabot_msg_precio_texto('landing', $cfg);
caso('"un una" se rechaza y cae al texto fijo',
    wabot_validar_redaccion('Para lo tuyo iría un una página a medida: $180.000. gokywebs.com/presupuestos/sitioprofesional', $basePrecio, $cfg) === null);
caso('"la un" también',
    wabot_validar_redaccion('Te queda la un página a medida: $180.000. gokywebs.com/presupuestos/sitioprofesional', $basePrecio, $cfg) === null);
caso('pero una redacción bien escrita sigue pasando',
    wabot_validar_redaccion('Para lo tuyo va una página a medida: $180.000. gokywebs.com/presupuestos/sitioprofesional', $basePrecio, $cfg) !== null);
caso('y "una web" con un artículo solo no se confunde con el error',
    wabot_validar_redaccion('Te armamos una web a medida por $180.000. gokywebs.com/presupuestos/sitioprofesional', $basePrecio, $cfg) !== null);

echo "— Tras un cierre sin presión, el acuse recibe silencio (caso 👍 si, 21-ago) —\n";

$ahoraR = time();
$cCierre = convNueva();
$cCierre['fase'] = 'precio'; $cCierre['cierre'] = 'consulta_sin_presion'; $cCierre['precio_dado'] = true;
$cCierre['chat_started_ts'] = $ahoraR - 600;
$cCierre['transcript'] = [
    ['q' => 'cliente', 't' => 'Veo el enlace con mi socia y te digo', 'ts' => $ahoraR - 120],
    ['q' => 'bot', 't' => 'Perfecto. Quedo a disposición por cualquier consulta.', 'ts' => $ahoraR - 60],
];
caso('"👍🏻 si" después del cierre = silencio, no otra oferta de demo',
    wabot_responder('👍🏻 si', $cCierre, $cfg) === []);
caso('"ok gracias" también', wabot_responder('ok gracias', $cCierre, $cfg) === []);
caso('pero una pregunta real después del cierre sí se atiende',
    wabot_responder('cuanto salia el mantenimiento?', $cCierre, $cfg) !== []);

$cPregunta = convNueva();
$cPregunta['fase'] = 'precio'; $cPregunta['cierre'] = 'consulta_sin_presion'; $cPregunta['precio_dado'] = true;
$cPregunta['chat_started_ts'] = $ahoraR - 600;
$cPregunta['transcript'] = [['q' => 'bot', 't' => 'Querés que te prepare la demo?', 'ts' => $ahoraR - 60]];
caso('si el bot dejó una pregunta abierta, un "si" NO es acuse y se contesta',
    wabot_responder('si', $cPregunta, $cfg) !== []);

caso('la promesa de aviso queda registrada al pasar por el redactor', (function () use ($cfg, $ahoraR) {
    $c = convNueva();
    $c['fase'] = 'precio'; $c['precio_dado'] = true; $c['chat_started_ts'] = $ahoraR - 600;
    $GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () { return ['acciones' => ['otro'], 'info_keys' => [], 'descripcion' => null, 'colores' => null]; };
    wabot_responder('Lo veo con mi socia y te aviso', $c, $cfg);
    return (int)($c['aviso_prometido_ts'] ?? 0) > 0;
})());

echo "\n— Demo mandada por plantilla: la primera respuesta del cliente recibe la demo real —\n";

$cfgFijo = $cfg; $cfgFijo['modo_redaccion'] = 'fijo';

$convPendiente = convNueva();
$convPendiente['demo_texto_pendiente'] = true;
$convPendiente['presentado_slug'] = 'yfprevencion';
$convPendiente['fase'] = 'postdemo';
$rPendiente = wabot_responder('dale', $convPendiente, $cfgFijo);
caso('le manda el texto real de la demo, sea lo que sea que haya contestado',
    is_array($rPendiente) && strpos($rPendiente[0], 'gokywebs.com/demo/yfprevencion') !== false);
caso('y el flag se apaga: no se lo vuelve a mandar en el siguiente mensaje',
    empty($convPendiente['demo_texto_pendiente']));

$convSinFlag = convNueva();
$convSinFlag['fase'] = 'postdemo';
$convSinFlag['tipo'] = 'landing';
$convSinFlag['precio_dado'] = true;
$convSinFlag['presentado_slug'] = 'yfprevencion';
$rSinFlag = wabot_responder('dale', $convSinFlag, $cfgFijo);
caso('sin el flag, un "dale" post-demo NO dispara el texto de la demo de nuevo',
    strpos(implode(' ', (array)$rSinFlag), 'gokywebs.com/demo/yfprevencion') === false);

echo "\n— Post-demo lo lleva Pablo: cualquier respuesta deriva con el mensaje fijo —\n";

$cfgPD = $cfg; $cfgPD['modo_redaccion'] = 'fijo';
$convPD = convNueva();
$convPD['fase'] = 'postdemo';
$convPD['tipo'] = 'landing';
$convPD['precio_dado'] = true;
$convPD['presentado_ts'] = time() - 3600;
$convPD['presentado_slug'] = 'midemo';
// Pablo, 28-ago: el corte sigue existiendo (la parte 2 la lleva él), pero el
// texto contesta lo que el cliente dijo en vez de leerle el mismo aviso a
// todos. El que pregunta cómo pagar recibe los datos para señar.
// Pablo, 28-ago: el bot NO pide la seña ni manda datos de pago. Al que
// pregunta cómo pagar se le contesta que de ahí en más lo sigue Pablo.
$rPagoPD = wabot_responder('Me encantó! cómo hago para pagar?', $convPD, $cfgPD);
$textoPagoPD = implode(' ', (array)$rPagoPD);
caso('un "cómo pago?" post-demo NO recibe el CBU ni el alias',
    mb_stripos($textoPagoPD, 'Banco Santander') === false
    && strpos($textoPagoPD, '0720071788000003618268') === false
    && mb_stripos($textoPagoPD, 'pablotravis') === false);
caso('se le contesta que lo sigue Pablo, y queda derivado',
    mb_stripos($textoPagoPD, 'Pablo') !== false
    && $convPD['fase'] === 'derivado' && $convPD['presentado_confirmado'] === true);

// Y el que dice algo que el bot no sabe leer sigue recibiendo el aviso.
$convPDOtro = convNueva();
$convPDOtro['fase'] = 'postdemo';
$convPDOtro['tipo'] = 'landing';
$convPDOtro['precio_dado'] = true;
$convPDOtro['presentado_ts'] = time() - 3600;
$convPDOtro['presentado_slug'] = 'midemo';
caso('y un mensaje que no dice nada sigue derivando con el aviso fijo',
    wabot_responder('buenas', $convPDOtro, $cfgPD) === [(string)$cfgPD['postdemo_derivar']]
    && $convPDOtro['fase'] === 'derivado' && $convPDOtro['presentado_confirmado'] === true);

$convDemoPend = convNueva();
$convDemoPend['fase'] = 'postdemo';
$convDemoPend['presentado_ts'] = time() - 3600;
$convDemoPend['presentado_slug'] = 'midemo';
$convDemoPend['demo_texto_pendiente'] = true;
caso('pero la demo que quedó debiendo por plantilla SÍ sale, aunque el bot esté callado',
    strpos(implode(' ', (array)wabot_responder('dale', $convDemoPend, $cfgPD)), 'gokywebs.com/demo/midemo') !== false);

echo "\n— Cambiar de modalidad recotiza, no ofrece la demo (27-ago) —\n";

// "Che, pensandolo bien mejor sin carrito, que me escriban por WhatsApp" tras
// cotizar ecommerce: el modelo le ofrecio la demo sin recotizar, y al turno
// siguiente ("cuanto queda entonces?") le pregunto si era para el mismo
// proyecto o para otra web. El precio nuevo nunca llego.
$cfgCambio = $cfg; $cfgCambio['modo_redaccion'] = 'fijo';
$convCambio = convNueva();
$convCambio['fase'] = 'pitch'; $convCambio['tipo'] = 'ecommerce';
$convCambio['precio_dado'] = true; $convCambio['pitch_hecho'] = true; $convCambio['pitch_tipo'] = 'ecommerce';
$rCambio = wabot_responder('Che, pensandolo bien mejor sin carrito, que me escriban por WhatsApp', $convCambio, $cfgCambio);
/* Con catálogo retirado (2-sep) el tipo no cambia: sigue siendo ecommerce, que
 * es lo que se le cotizó, y no se le da un precio nuevo. */
caso('el cambio de modalidad ya no baja a catálogo: el tipo queda como estaba',
    ($convCambio['tipo'] ?? '') === 'ecommerce');

// Una PREGUNTA sobre la otra modalidad se contesta, no recotiza sola.
caso('"sale lo mismo sin carrito?" no cambia el tipo por su cuenta',
    wabot_texto_cambia_modalidad('sale lo mismo sin carrito?', 'ecommerce') === null);
caso('ni una duda sin decisión', wabot_texto_cambia_modalidad('no entiendo lo del carrito', 'ecommerce') === null);
/* Turnos se retiró (2-sep): ese salto ya no existe, y el que quedó cotizado
 * ahí conserva su tipo y su precio. El único vivo es catálogo → ecommerce. */
caso('el salto de turnos ya no cambia nada',
    wabot_texto_cambia_modalidad('mejor lo agendo yo, sin reserva online', 'turnos') === null);
caso('pero una charla vieja en catálogo sí puede pasar a ecommerce',
    wabot_texto_cambia_modalidad('mejor con carrito, que compren desde la web', 'catalogo') === 'ecommerce');

echo "\n— La comparación de precio se contesta sin pasar por el modelo (27-ago) —\n";

// En la bateria del 27-ago el agente fallo las dos preguntas de formas
// distintas: a "sale lo mismo con carrito?" contesto el detalle de cuotas, y a
// "si lo agendo yo cual es la diferencia" le ofrecio la demo sin contestar
// nada. Las dos habian costado, en produccion, hasta una hora de espera. Por
// eso el corte es deterministico y va antes del agente, en los tres modos.
foreach (['fijo', 'natural', 'agente'] as $modoCmp) {
    $cfgCmp = $cfg; $cfgCmp['modo_redaccion'] = $modoCmp;

    $convCarrito = convNueva();
    $convCarrito['fase'] = 'prediseno'; $convCarrito['tipo'] = 'ecommerce';
    $convCarrito['precio_dado'] = true; $convCarrito['cta_muestra'] = true;
    $rCarrito = wabot_responder('Sale lo mismo con carrito?', $convCarrito, $cfgCmp);
    caso("modo $modoCmp: \"sale lo mismo con carrito\" trae los dos precios",
        count($rCarrito) === 1
        && strpos($rCarrito[0], (string)$cfgCmp['tipos']['ecommerce']['precio']) !== false
        && stripos($rCarrito[0], 'catálogo') !== false);
    caso("modo $modoCmp: y no contesta con el detalle de cuotas",
        stripos($rCarrito[0], 'cuotas de') === false && stripos($rCarrito[0], 'seña') === false);

    $convAgendo = convNueva();
    $convAgendo['fase'] = 'prediseno'; $convAgendo['tipo'] = 'turnos';
    $convAgendo['precio_dado'] = true; $convAgendo['cta_muestra'] = true;
    $rAgendo = wabot_responder('Y si lo agendo yo cual es la diferencia', $convAgendo, $cfgCmp);
    caso("modo $modoCmp: \"si lo agendo yo\" trae landing y turnos",
        count($rAgendo) === 1
        && strpos($rAgendo[0], (string)$cfgCmp['tipos']['landing']['precio']) !== false
        && strpos($rAgendo[0], (string)$cfgCmp['tipos']['turnos']['precio']) !== false);
    caso("modo $modoCmp: y no le ofrece la demo en vez de contestar",
        stripos($rAgendo[0], 'muestra') === false && stripos($rAgendo[0], 'demo') === false);
}

// Sin precio cotizado no hay con qué comparar: sigue el flujo normal.
$convSinPrecio = convNueva();
$convSinPrecio['tipo'] = 'ecommerce'; $convSinPrecio['precio_dado'] = false;
$cfgSinPrecio = $cfg; $cfgSinPrecio['modo_redaccion'] = 'fijo';
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones' => ['otro'], 'info_keys' => [], 'descripcion' => null, 'colores' => null];
};
$rSinPrecio = wabot_responder('Sale lo mismo con carrito?', $convSinPrecio, $cfgSinPrecio);
caso('sin precio cotizado, la comparación no se dispara',
    !isset($rSinPrecio[0]) || stripos($rSinPrecio[0], 'Sin carrito sería') === false);

echo "\n— El proveedor no recibe respuesta, en ningún modo (27-ago) —\n";

$volante = "Promo de web profesional + pack de diseño por \$199.000.\n\nIncluye:\n"
    . "✅ Página web moderna ultra rápida\n✅ Dominio .com.ar gratis por 1 año\n✅ Hosting gratis\n"
    . "✅ Un reel promocional incluído!\n\nNuestras web son anexalinks.ar y devzeppelin.ar, para que veas la calidad!";
foreach (['fijo', 'natural', 'agente'] as $modoProv) {
    $cfgProv = $cfg; $cfgProv['modo_redaccion'] = $modoProv;
    $convProv = convNueva();
    caso("modo $modoProv: al proveedor no se le contesta nada",
        wabot_responder($volante, $convProv, $cfgProv) === []);
    caso("modo $modoProv: y queda fuera de los seguimientos",
        !empty($convProv['seguimiento_bloqueado']) && ($convProv['cierre'] ?? '') === 'proveedor');
}

echo "\n— El listado de datos se pide una vez: después, una línea y silencio (27-ago) —\n";

$cfgAcuse = $cfg; $cfgAcuse['modo_redaccion'] = 'fijo';
$convAcuse = convNueva();
$convAcuse['fase'] = 'prediseno';
$convAcuse['tipo'] = 'landing';
$convAcuse['precio_dado'] = true;
$convAcuse['prediseno_pedido'] = ['Tu nombre', 'El nombre de tu negocio'];

$r1Acuse = wabot_responder('Ok', $convAcuse, $cfgAcuse);
caso('el primer "Ok" recibe UNA línea corta', $r1Acuse === [(string)$cfgAcuse['prediseno_espera_datos']]);
caso('y no vuelve a pegar el listado', strpos($r1Acuse[0], 'Los colores de tu marca') === false);

$r2Acuse = wabot_responder('Listo gracias', $convAcuse, $cfgAcuse);
caso('el segundo acuse ya no recibe nada', $r2Acuse === []);
$r3Acuse = wabot_responder('🫶 si', $convAcuse, $cfgAcuse);
caso('y el tercero tampoco', $r3Acuse === []);

// El que manda los datos de verdad sigue avanzando como siempre.
$convDatos = convNueva();
$convDatos['fase'] = 'prediseno';
$convDatos['tipo'] = 'landing';
$convDatos['precio_dado'] = true;
$convDatos['prediseno_pedido'] = ['Tu nombre', 'El nombre de tu negocio'];
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones' => ['datos_prediseno'], 'info_keys' => [], 'descripcion' => null, 'colores' => null];
};
caso('pero mandar los datos reales sí avanza',
    wabot_responder('Denise, BJR Best Job Review, colores azul y negro', $convDatos, $cfgAcuse) !== []);

echo "\n— Post-demo: se contesta UNA vez y despues silencio (28-ago) —\n";

/* Charla de Silvana, tal cual paso: contesto la demo y el bot le fue
 * respondiendo mensaje por mensaje, siempre alguna version de "Pablo te escribe
 * a la brevedad". Cinco veces. Y la ultima le contesto las formas de pago de
 * Gokywebs a una pregunta sobre las formas de pago de SU pagina.
 *
 * Pablo, 28-ago: "malisimo que sea tan reiterativo, que lo diga una vez y ya
 * deje de contestar para el resto de las cosas". */
$cfgSil = $cfg; $cfgSil['modo_redaccion'] = 'fijo';
$convSil = convNueva();
$convSil['fase'] = 'postdemo';
$convSil['tipo'] = 'landing';
$convSil['precio_dado'] = true;
$convSil['presentado_ts'] = time() - 600;
$convSil['presentado_slug'] = 'silvanatarot';
$convSil['lead_creado'] = true;

$primera = wabot_responder('Recien paro. Me gusta. Yo le pondria mas color .', $convSil, $cfgSil);
caso('la primera respuesta tras la demo si sale', count((array)$primera) > 0);
caso('y deja marcado que ya se aviso', !empty($convSil['postdemo_avisado']));

$siguientes = [
    'Si ....los colores. Quisiera alguna imagen mia por ahi',
    '[foto] Mando una pieza grafica con su foto',
    'Entre violetas y dorados',
    'Y mi imagen',
    'Gracias',
    'Pero le falta lo de registros akashicos',
    'Y las formas de pago para exterior del pais y para el pais',
];
$contestados = 0;
foreach ($siguientes as $msjSil) {
    if (count((array)wabot_responder($msjSil, $convSil, $cfgSil)) > 0) $contestados++;
}
caso('y de ahi en mas el bot no contesta nada mas', $contestados === 0);

// El que pregunta por las formas de pago de SU web no se lleva las de Gokywebs.
$convPagoSil = convNueva();
$convPagoSil['fase'] = 'postdemo';
$convPagoSil['tipo'] = 'landing';
$convPagoSil['precio_dado'] = true;
$convPagoSil['presentado_ts'] = time() - 600;
wabot_responder('Me gusto mucho', $convPagoSil, $cfgSil);
$rPagoSil = implode(' ', (array)wabot_responder(
    'Y las formas de pago para exterior del pais y para el pais', $convPagoSil, $cfgSil));
caso('la pregunta por las formas de pago de SU web no recibe las nuestras',
    mb_stripos($rPagoSil, 'transferencia') === false
    && mb_stripos($rPagoSil, 'cuotas') === false);

// El silencio no se vence solo: el reset por inactividad no toca una demo entregada.
$convViejaSil = $convSil;
$convViejaSil['ultimo_ts'] = time() - 30 * 86400;
caso('a los 30 dias el silencio sigue en pie',
    wabot_conv_reset_si_vieja($convViejaSil, $cfgSil) === false
    && !empty($convViejaSil['postdemo_avisado']));

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
