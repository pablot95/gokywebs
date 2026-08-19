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

$fallas = 0; $total = 0;
function caso($nombre, $ok) {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . "\n";
    if (!$ok) $fallas++;
}

$BASE_PRECIO = "Perfecto, eso tendría un precio de \$200.000 por todo el desarrollo. En este link podés ver todo lo que incluye: gokywebs.com/presupuestos/Landing\nSiempre ofrecemos un prediseño gratis de la web";

echo "— Validaciones sobre lo que devuelve el modelo —\n";

$r = wabot_validar_redaccion("Dale, en tu caso sale \$200.000 por todo el desarrollo. Acá tenés el detalle: gokywebs.com/presupuestos/Landing y siempre hacemos un prediseño gratis antes.", $BASE_PRECIO, $cfg);
caso('redacción válida con precio y link exactos → se acepta', is_string($r) && strpos($r, '$200.000') !== false);

$r = wabot_validar_redaccion("Sale doscientos mil pesos. Mirá gokywebs.com/presupuestos/Landing", $BASE_PRECIO, $cfg);
caso('precio escrito en letras → se rechaza (usa el texto fijo)', $r === null);

$r = wabot_validar_redaccion("Sale \$200.000. Mirá gokywebs.com/presupuestos/landing", $BASE_PRECIO, $cfg);
caso('link en minúscula (daría 404) → se rechaza', $r === null);

$r = wabot_validar_redaccion("Sale \$200.000. Escribinos a wa.me/5491111111111", $BASE_PRECIO, $cfg);
caso('link inventado que no estaba en el base → se rechaza', $r === null);

$r = wabot_validar_redaccion("Sale \$210.000 en tu caso. gokywebs.com/presupuestos/Landing", $BASE_PRECIO, $cfg);
caso('precio cambiado → se rechaza', $r === null);

$r = wabot_validar_redaccion("Dale 😊 sale \$200.000, mirá gokywebs.com/presupuestos/Landing", $BASE_PRECIO, $cfg);
caso('emoji → se limpia y se acepta', is_string($r) && strpos($r, '😊') === false && strpos($r, '$200.000') !== false);

$r = wabot_validar_redaccion("¿Te sirve? Sale \$200.000. gokywebs.com/presupuestos/Landing ¡Genial!", $BASE_PRECIO, $cfg);
caso('signos de apertura → se limpian', is_string($r) && strpos($r, '¿') === false && strpos($r, '¡') === false);

$r = wabot_validar_redaccion(str_repeat("bla ", 300) . "\$200.000 gokywebs.com/presupuestos/Landing", $BASE_PRECIO, $cfg);
caso('respuesta larguísima → se rechaza', $r === null);

$r = wabot_validar_redaccion("   ", $BASE_PRECIO, $cfg);
caso('respuesta vacía → se rechaza', $r === null);

$r = wabot_validar_redaccion('"Sale $200.000, mirá gokywebs.com/presupuestos/Landing"', $BASE_PRECIO, $cfg);
caso('comillas envolventes → se sacan', is_string($r) && $r[0] !== '"');

$BASE_SIMPLE = "Contame un poco qué andas necesitando";
$r = wabot_validar_redaccion("Dale, contame un poco de qué se trata tu negocio", $BASE_SIMPLE, $cfg);
caso('mensaje sin precio ni link → se acepta libre', is_string($r));

// Bug real de producción: el modelo inventó "$170.000" y "$145.000" para
// landings sin haber llamado a dar_precio, así que no había BASE con la que
// compararlo. La validación vieja solo chequeaba que el precio del base
// estuviera en la salida; nunca chequeaba lo inverso.
$r = wabot_validar_redaccion("Te preparo una landing. El valor es de \$170.000. gokywebs.com/presupuestos/Landing", "", $cfg);
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
        'lead_creado'=>false,'msgs'=>[],'ultimo_ts'=>0,'ultimo_cliente_ts'=>0,'transcript'=>[]];
}

// El clasificador se simula; el redactor devuelve algo válido.
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['rubro_landing'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function ($msg, $base, $conv, $cfg) {
    return "Mirá, para lo tuyo va una Landing: \$200.000 por todo el desarrollo. Todo el detalle está acá: gokywebs.com/presupuestos/Landing y te hacemos un prediseño gratis antes de que decidas.";
};
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('modo natural → manda la versión redactada del primero',
    count($r) === 2 && strpos($r[0], 'Mirá, para lo tuyo') === 0 && strpos($r[0], '$200.000') !== false);
caso('la oferta del prediseño va aparte y NO se reescribe', $r[1] === $cfg['msg_prediseno_oferta']);

// Si el redactor se manda una macana, tiene que salir el texto fijo.
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "Te sale carísimo, andá a otro lado 🤑 mirá tiendanube.com"; };
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('redacción inválida → cae al texto fijo del motor',
    count($r) === 2 && strpos($r[0], 'gokywebs.com/presupuestos/Landing') !== false && strpos($r[0], 'tiendanube') === false);

// Si Gemini se cae (null), también.
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return null; };
$c = convNueva();
$r = wabot_responder('soy abogado', $c, $cfg);
caso('redactor caído → cae al texto fijo', count($r) === 2 && strpos($r[0], '$200.000') !== false);

// La derivación nunca se reescribe.
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['pide_humano'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "Bueno dale, esperá que te atiendo yo en un rato."; };
$c = convNueva();
$r = wabot_responder('quiero hablar con alguien', $c, $cfg);
caso('derivación → se manda el texto fijo, nunca la versión libre', $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

// Con el modo apagado no se toca nada.
$cfgFijo = $cfg; $cfgFijo['modo_redaccion'] = 'fijo';
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['rubro_ecommerce'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$GLOBALS['WABOT_TEST_REDACTOR'] = function () { return "algo totalmente distinto"; };
$c = convNueva();
$r = wabot_responder('vendo ropa', $c, $cfgFijo);
caso('modo fijo → el redactor ni se llama',
    strpos($r[0], 'Perfecto, para lo tuyo va una tienda online completa') === 0
    && strpos($r[0], '$320.000') !== false);
caso('el punto final de la oración no forma parte del precio exigido',
    wabot_validar_redaccion('Sale $320.000 por todo, mirá gokywebs.com/presupuestos/Ecommerce',
        wabot_msg_precio_texto('ecommerce', $cfg), $cfg) !== null);
caso('el link va en su propio renglón, no pegado a la frase del precio',
    substr_count($r[0], "\n") === 1 && strpos($r[0], "\nEn este link") !== false);

echo "— El salto de línea se garantiza aunque la IA lo aplaste —\n";

$v = wabot_validar_redaccion(
    'Dale, para lo tuyo un ecommerce sale $320.000. El detalle completo está en gokywebs.com/presupuestos/Ecommerce',
    "Perfecto, eso tendría un valor de \$320.000 para todo el desarrollo.\nEn este link: gokywebs.com/presupuestos/Ecommerce",
    $cfg);
caso('si la IA escribió todo en una línea, el link se corta a renglón nuevo',
    $v !== null && strpos($v, "\nEl detalle completo está en gokywebs.com/presupuestos/Ecommerce") !== false);

$v = wabot_validar_redaccion(
    "Sale \$320.000 todo el desarrollo.\nMirá el detalle: gokywebs.com/presupuestos/Ecommerce",
    "base con \$320.000 y gokywebs.com/presupuestos/Ecommerce",
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

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
