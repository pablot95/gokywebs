<?php
/**
 * wabot/test.php — tests del motor (solo CLI: php wabot/test.php).
 * Simula la clasificación (sin Gemini) y corta la red (sin WhatsApp ni Firestore).
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/engine.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;

$cfg = wabot_config_load();
$fallas = 0;
$total  = 0;

function caso($nombre, $ok) {
    global $fallas, $total;
    $total++;
    if (!$ok) { $fallas++; echo "  ✗ $nombre\n"; }
    else      { echo "  ✓ $nombre\n"; }
}

function conv_nueva() {
    $c = wabot_conv_load('999TEST999');
    // siempre desde cero, sin tocar disco
    return [
        'tel' => '999TEST999', 'fase' => 'nuevo', 'tipo' => null,
        'descripcion' => null, 'colores' => null,
        'espera_avisada' => false, 'no_texto_avisado' => false,
        'bot_off' => false, 'pausado_hasta' => 0, 'lead_creado' => false,
        'msgs' => [], 'ultimo_ts' => 0, 'transcript' => [],
    ];
}

/* Clasificador simulado: se setea antes de cada llamada. */
function clasifica($acciones, $extra = []) {
    $GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () use ($acciones, $extra) {
        return array_merge([
            'acciones' => (array)$acciones, 'info_keys' => [],
            'descripcion' => null, 'colores' => null,
        ], $extra);
    };
}

echo "— Apertura y menú —\n";

$c = conv_nueva();
clasifica(['saludo']);
$r = wabot_engine('hola', $c, $cfg);
caso('saludo → manda el menú', $r === [$cfg['menu']] && $c['fase'] === 'menu');

$c = conv_nueva();
clasifica(['rubro_landing']);
$r = wabot_engine('soy abogado', $c, $cfg);
caso('rubro en el primer mensaje → precio directo sin menú',
    strpos($r[0], '$200.000') !== false && strpos($r[0], 'presupuestos/Landing') !== false
    && $c['fase'] === 'precio' && $c['tipo'] === 'landing');
caso('el precio llega en DOS mensajes: primero el precio, después la oferta',
    count($r) === 2 && $r[1] === $cfg['msg_prediseno_oferta']);
caso('el mensaje del precio ya no trae pegada la oferta del prediseño',
    stripos($r[0], 'predise') === false);

$c = conv_nueva();
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('se puede pagar en cuotas?', $c, $cfg);
caso('pregunta de info en el primer mensaje → responde y suma el menú',
    count($r) === 2 && $r[0] === $cfg['info']['pago_generico'] && $r[1] === $cfg['menu'] && $c['fase'] === 'menu');
caso('sin tipo cotizado, la seña sale genérica: menciona los 3 montos', strpos($r[0], '$60.000') !== false && strpos($r[0], '$90.000') !== false);

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['elige_ecommerce']);
$r = wabot_engine('ecommerce', $c, $cfg);
caso('elige ecommerce del menú → precio de ecommerce', strpos($r[0], '$320.000') !== false && strpos($r[0], 'presupuestos/Ecommerce') !== false && $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['pregunta_tipos']);
$r = wabot_engine('que es cada una?', $c, $cfg);
caso('pregunta qué es cada una → definiciones', $r === [$cfg['def_tipos']] && $c['fase'] === 'menu');

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['algo_diferente']);
$r = wabot_engine('algo diferente', $c, $cfg);
caso('algo diferente → contame', $r === [$cfg['contame']] && $c['fase'] === 'algo_diferente');

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['otro']);
$r = wabot_engine('mmm no se', $c, $cfg);
caso('no se entiende en el menú → contame', $r === [$cfg['contame']] && $c['fase'] === 'algo_diferente');

echo "— Algo diferente —\n";

$c = conv_nueva(); $c['fase'] = 'algo_diferente';
clasifica(['rubro_inmobiliaria']);
$r = wabot_engine('tengo una inmobiliaria', $c, $cfg);
caso('inmobiliaria desde algo diferente → precio propio', strpos($r[0], '$290.000') !== false && $c['tipo'] === 'inmobiliaria');

$c = conv_nueva(); $c['fase'] = 'algo_diferente';
clasifica(['otro']);
$r = wabot_engine('quiero una app para stock', $c, $cfg);
caso('si el clasificador no entiende, repregunta reformulado antes de derivar',
    $r === [$cfg['contame_2']] && $c['fase'] === 'algo_diferente' && empty($c['handoff_pendiente']));

echo "— Cursos —\n";

$c = conv_nueva();
clasifica(['rubro_cursos']);
$r = wabot_engine('doy cursos de maquillaje', $c, $cfg);
caso('cursos → pregunta de desempate', $r === [$cfg['desempate_cursos']] && $c['fase'] === 'desempate_cursos');

clasifica(['cursos_vender']);
$r = wabot_engine('venderlos desde la web', $c, $cfg);
caso('quiere venderlos → elearning', strpos($r[0], 'presupuestos/Elearning') !== false && $c['tipo'] === 'elearning');

$c = conv_nueva(); $c['fase'] = 'desempate_cursos';
clasifica(['cursos_mostrar']);
$r = wabot_engine('solo mostrarlos', $c, $cfg);
caso('solo mostrarlos → landing', strpos($r[0], 'presupuestos/Landing') !== false && $c['tipo'] === 'landing');

$c = conv_nueva();
clasifica(['productos_y_cursos']);
$r = wabot_engine('vendo velas y doy talleres', $c, $cfg);
caso('productos + cursos → deriva sin precio', $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

echo "— Después del precio —\n";

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['quiere_prediseno']);
$r = wabot_engine('me interesa el prediseño', $c, $cfg);
caso('pide el prediseño → lo explica y pide los 3 datos', $r === [wabot_prediseno_texto($c, $cfg)] && $c['fase'] === 'prediseno');

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['objecion_caro']);
$r = wabot_engine('uh que caro', $c, $cfg);
caso('objeción caro → respuesta fija, cuotas y muestra, sin bajar precio',
    $r === [$cfg['caro'], $cfg['cta_muestra']] && $c['fase'] === 'precio' && $c['cta_muestra'] === true);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['pregunta_info'], ['info_keys' => ['plazos', 'hosting']]);
$r = wabot_engine('en cuanto está y el hosting?', $c, $cfg);
caso('dos preguntas → una sola respuesta en bullets', count($r) === 1 && strpos($r[0], '- ') === 0 && strpos($r[0], '7 días') !== false && strpos($r[0], 'Hosting') !== false);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['cambia_tipo']);
$r = wabot_engine('ahora quiero vender online tambien', $c, $cfg);
caso('cambia de tipo tras el precio → confirma el proyecto, sin recotizar ni derivar',
    $r === [$cfg['confirma_cambio']] && $c['fase'] === 'confirma_cambio' && empty($c['handoff_pendiente']));

clasifica(['otro']);
$r = wabot_engine('es el mismo proyecto', $c, $cfg);
caso('"es el mismo" vuelve a la venta con un próximo paso',
    $r === [$cfg['confirma_cambio_mismo']] && $c['fase'] === 'precio' && empty($c['handoff_pendiente']));

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['rubro_ecommerce']);
$r = wabot_engine('tambien vendo productos', $c, $cfg);
caso('rubro distinto al tipo dado → aclara antes de tocar el presupuesto',
    $r === [$cfg['confirma_cambio']] && $c['fase'] === 'confirma_cambio' && empty($c['handoff_pendiente']));

clasifica(['otro']);
$r = wabot_engine('no, es otra web aparte para otro negocio', $c, $cfg);
caso('"es otra aparte" deriva a Pablo en vez de quedar en un callejón',
    $r === [$cfg['derivar']] && $c['fase'] === 'derivado' && !empty($c['handoff_pendiente']));

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['otro']);
$r = wabot_engine('y mi cuñado puede editarla?', $c, $cfg);
caso('pregunta rara tras el precio → escape y próximo paso hacia la muestra',
    $r === [$cfg['info']['otra'], $cfg['cta_muestra']] && $c['fase'] === 'precio');

echo "— Prediseño —\n";

$c = conv_nueva(); $c['fase'] = 'prediseno'; $c['tipo'] = 'landing';
clasifica(['datos_prediseno'], ['descripcion' => 'estudio jurídico en Quilmes']);
$r = wabot_engine('soy abogado en quilmes, hago sucesiones', $c, $cfg);
caso('pasa solo la descripción → pide los colores', $r === [$cfg['prediseno_falta_colores']] && $c['descripcion'] !== null && $c['colores'] === null);

clasifica(['datos_prediseno'], ['colores' => 'azul y blanco']);
$r = wabot_engine('azul y blanco', $c, $cfg);
caso('completa los colores → pregunta por la referencia, todavía no cierra',
    $r === [$cfg['prediseno_referencia']] && $c['fase'] === 'prediseno_ref' && $c['lead_creado'] === false);

$r = wabot_engine('me gusta como se ve estudiokahn.com', $c, $cfg);
caso('pasa la referencia → cierra, crea lead y deriva',
    $r === [$cfg['prediseno_completo']] && $c['fase'] === 'derivado' && $c['lead_creado'] === true
    && $c['referencia'] === 'me gusta como se ve estudiokahn.com');

echo "— Cerrada pero disponible para dudas —
";

// Un "gracias" con la charla cerrada NO se contesta: la despedida ya se dijo y
// encadenar dos o tres cierres es lo que delata al bot (Refrigcar y Black
// Automotores, 22-ago).
clasifica(['saludo']);
$r = wabot_engine('gracias!', $c, $cfg);
caso('un agradecimiento tras el cierre no recibe respuesta', $r === []);
clasifica(['saludo']);
caso('un "ok" tampoco', wabot_engine('ok', $c, $cfg) === []);
clasifica(['saludo']);
caso('ni un "igualmente, gracias"', wabot_engine('Igualmente. Gracias', $c, $cfg) === []);
clasifica(['saludo']);
caso('ni un pulgar arriba solo', wabot_engine('👍', $c, $cfg) === []);

// Acá está el pedido: la charla quedó cerrada pero el bot sigue contestando.
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('en cuanto tiempo estaria?', $c, $cfg);
caso('con la charla cerrada igual contesta una duda', $r === [$cfg['info']['plazos']]);

clasifica(['pregunta_info'], ['info_keys' => ['pago', 'hosting']]);
$r = wabot_engine('como se paga y el hosting?', $c, $cfg);
caso('contesta varias dudas juntas', count($r) === 1 && strpos($r[0], '- ') === 0);

clasifica(['objecion_caro']);
$r = wabot_engine('me parece caro igual', $c, $cfg);
caso('la objeción se contesta sin bajar el precio', $r === [$cfg['caro']]);

// Lo que NO puede hacer: volver a vender.
clasifica(['rubro_landing']);
$r = wabot_engine('ahora quiero una landing', $c, $cfg);
caso('nunca vuelve a cotizar con la charla cerrada',
    !$r || strpos($r[0], '$200.000') === false);
caso('y sigue derivada, no reabre la venta', $c['fase'] === 'derivado');

caso('si no entiende, escapa al equipo en vez de callarse', $r === [$cfg['info']['otra']]);

clasifica(['quiere_prediseno']);
$r = wabot_engine('me armas otra muestra?', $c, $cfg);
caso('tampoco reabre el prediseño', $r !== [$cfg['prediseno']]);
caso('y no repite el mismo escape dos veces seguidas', $r === []);

// Pero si contesta otra cosa en el medio, el escape vuelve a estar disponible.
clasifica(['pregunta_info'], ['info_keys' => ['hosting']]);
$r = wabot_engine('el hosting va aparte?', $c, $cfg);
caso('la duda del medio sí se contesta', $r === [wabot_texto_hosting($c, $cfg)]);
clasifica(['otro']);
$r = wabot_engine('mmm y otra cosa rara', $c, $cfg);
caso('y después el escape vuelve a salir', $r === [$cfg['info']['otra']]);

// Quiere cerrar: es el peor momento para quedarse callado.
clasifica(['quiere_avanzar']);
$r = wabot_engine('quiero arrancar ya', $c, $cfg);
caso('si quiere avanzar, se le repite quién lo toma', $r === [$cfg['espera_prediseno']]);
caso('pero no lo deriva de nuevo, ya estaba derivado', $c['fase'] === 'derivado');

// Un saludo no merece respuesta de relleno.
clasifica(['saludo']);
$r = wabot_engine('joya, gracias', $c, $cfg);
caso('un agradecimiento no dispara una muletilla', $r === []);

// Y si la charla se derivó a mano, la línea de siempre sigue estando bien.
$c2 = conv_nueva(); $c2['fase'] = 'precio'; $c2['tipo'] = 'landing';
clasifica(['pide_humano']);
$r = wabot_engine('me pasas con alguien?', $c2, $cfg);
caso('derivar a mano marca el cierre como derivación',
    $r === [$cfg['derivar']] && $c2['cierre'] === 'derivacion');
clasifica(['saludo']);
$r = wabot_engine('ahi va', $c2, $cfg);
caso('tras derivar a mano sí corresponde la línea del equipo', $r === [$cfg['espera']]);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'ecommerce';
clasifica(['quiere_prediseno', 'datos_prediseno'], ['descripcion' => 'venta de ropa deportiva', 'colores' => 'negro y violeta']);
$r = wabot_engine('dale! vendo ropa deportiva, colores negro y violeta', $c, $cfg);
caso('pasa interés + los 2 datos juntos → pregunta la referencia', $r === [$cfg['prediseno_referencia']] && $c['fase'] === 'prediseno_ref');

$r = wabot_engine('no tengo ninguna', $c, $cfg);
caso('dice que no tiene referencia → cierra igual, sin guardar basura',
    $r === [$cfg['prediseno_completo']] && $c['fase'] === 'derivado' && $c['referencia'] === '' && $c['lead_creado'] === true);

echo "— Detección de \"no tengo referencia\" —\n";
foreach (['no', 'No', 'ninguna', 'no tengo', 'nada', 'NO TENGO NINGUNA', 'la verdad que no', '  no.  '] as $n) {
    caso("\"$n\" se toma como sin referencia", wabot_es_negativa($n) === true);
}
foreach (['nike.com', 'me gusta el estilo de apple', 'algo minimalista en blanco y negro',
          'no se... capaz algo como mercadolibre pero mas simple'] as $s) {
    caso("\"" . mb_substr($s, 0, 32) . "\" se guarda como referencia", wabot_es_negativa($s) === false);
}

echo "— Derivación y cortes globales —\n";

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['pide_humano']);
$r = wabot_engine('quiero hablar con una persona', $c, $cfg);
caso('pide humano → deriva', $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

clasifica(['saludo']);
$r = wabot_engine('hola?', $c, $cfg);
caso('escribe tras derivar → una sola línea de espera', $r === [$cfg['espera']] && $c['espera_avisada'] === true);

clasifica(['saludo']);
$r = wabot_engine('holaaa', $c, $cfg);
caso('insiste → silencio', $r === []);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['quiere_avanzar']);
$r = wabot_engine('dale, como pago?', $c, $cfg);
caso('quiere avanzar/pagar → deriva', $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['no_interesa']);
$r = wabot_engine('no me interesa gracias', $c, $cfg);
caso('no le interesa → cierre cordial sin derivar', $r === [$cfg['no_interesa']] && $c['fase'] === 'precio');

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'ecommerce';
clasifica(['menciona_plataforma']);
$r = wabot_engine('y tienda nube no me conviene?', $c, $cfg);
caso('nombra Tienda Nube → compara y ofrece la demo',
    $r === [$cfg['plataformas'], $cfg['cta_muestra']] && $c['cta_muestra'] === true);

echo "— Fallback y reset —\n";

$c = conv_nueva();
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () { return null; };
$r = wabot_engine('hola', $c, $cfg);
caso('Gemini caído en el primer mensaje → menú igual', $r === [$cfg['menu']] && $c['fase'] === 'menu');

$r = wabot_engine('soy abogado', $c, $cfg);
caso('Gemini caído después → reconoce un rubro claro y vende sin derivar',
    count($r) === 2 && strpos($r[0], '$200.000') !== false
    && $c['fase'] === 'precio' && $c['tipo'] === 'landing' && empty($c['handoff_pendiente']));

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
$c['ultimo_ts'] = time() - 10 * 86400; // hace 10 días
clasifica(['saludo']);
$r = wabot_engine('hola de nuevo', $c, $cfg);
caso('charla de hace 10 días → arranca de cero con el menú', $r === [$cfg['menu']] && $c['fase'] === 'menu' && $c['tipo'] === null);

echo "— Brief del negocio armado con toda la charla —\n";

$GLOBALS['WABOT_TEST_RESUMEN'] = function () {
    return ['negocio' => 'Panadería en Tigre', 'ofrece' => 'Pan de masa madre', 'objetivo' => 'Vender online'];
};
$c = conv_nueva(); $c['tipo'] = 'ecommerce'; $c['descripcion'] = 'panaderia';
$r = wabot_resumen_negocio($c, $cfg);
caso('devuelve los campos que junta el admin, con la marca y la referencia vacías si no las nombró',
    $r === ['marca' => '', 'negocio' => 'Panadería en Tigre', 'ofrece' => 'Pan de masa madre',
            'objetivo' => 'Vender online', 'referencia' => '']);

$GLOBALS['WABOT_TEST_RESUMEN'] = function () { return ['negocio' => '¿Panadería?', 'ofrece' => '', 'objetivo' => '']; };
$r = wabot_resumen_negocio($c, $cfg);
caso('limpia los signos de apertura', $r['negocio'] === 'Panadería?');
caso('campos vacíos quedan vacíos, no null', $r['ofrece'] === '' && $r['objetivo'] === '');

$GLOBALS['WABOT_TEST_RESUMEN'] = function () { return ['negocio' => '', 'ofrece' => '', 'objetivo' => '']; };
caso('resumen totalmente vacío → null (se usa la descripción cruda)', wabot_resumen_negocio($c, $cfg) === null);

$GLOBALS['WABOT_TEST_RESUMEN'] = function () { return null; };
caso('Gemini falla → null', wabot_resumen_negocio($c, $cfg) === null);

$GLOBALS['WABOT_TEST_RESUMEN'] = function () { return ['negocio' => 123, 'ofrece' => ['x'], 'objetivo' => 'ok']; };
$r = wabot_resumen_negocio($c, $cfg);
caso('campos con tipos raros → se ignoran sin romper', $r['negocio'] === '' && $r['ofrece'] === '' && $r['objetivo'] === 'ok');

// Y que quede guardado en la conversación al cerrar el prediseño.
$GLOBALS['WABOT_TEST_RESUMEN'] = function () {
    return ['negocio' => 'Estudio contable', 'ofrece' => 'Balances', 'objetivo' => 'Captar clientes'];
};
$GLOBALS['WABOT_TEST_COLORES'] = function () { return null; };
$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'contador'; $c['colores'] = 'azul';
clasifica(['datos_prediseno']);
$r = wabot_engine('no tengo', $c, $cfg);
caso('al cerrar el prediseño el brief queda en la conversación',
    ($c['brief']['negocio'] ?? '') === 'Estudio contable' && ($c['brief']['objetivo'] ?? '') === 'Captar clientes');

unset($GLOBALS['WABOT_TEST_RESUMEN'], $GLOBALS['WABOT_TEST_COLORES']);

echo "— La referencia se rescata de toda la charla —\n";

function conv_con_charla($mensajes) {
    $c = conv_nueva();
    foreach ($mensajes as $m) $c['transcript'][] = ['q' => $m[0], 't' => $m[1], 'ts' => 0];
    return $c;
}

foreach (['ya te la pase', 'Ya te la pasé', 'ya te lo mande', 'la de arriba',
          'como te dije', 'la anterior', 'esa misma'] as $f) {
    caso("\"$f\" no se guarda como referencia", wabot_referencia_utilizable($f) === false);
}
caso('una referencia de verdad sí se guarda', wabot_referencia_utilizable('me gusta estudiokahn.com') === true);
caso('"no tengo" sigue siendo negativa', wabot_referencia_utilizable('no tengo') === false);

$c = conv_con_charla([['cliente', 'hola mira, algo como https://estudiokahn.com/inicio me gusta'],
                      ['bot', 'Tenés alguna página de referencia?'],
                      ['cliente', 'ya te la pase']]);
caso('rescata el link que había pasado antes',
    wabot_links_en_charla($c) === 'https://estudiokahn.com/inicio');

$c = conv_con_charla([['cliente', 'miralo en tiendaequis.com.ar'], ['cliente', 'mi mail es juan@gmail.com']]);
caso('agarra el dominio suelto y no confunde el mail',
    wabot_links_en_charla($c) === 'tiendaequis.com.ar');

$c = conv_con_charla([['cliente', 'segui a @lamarca.ok en insta']]);
caso('agarra el usuario de Instagram', wabot_links_en_charla($c) === '@lamarca.ok');

$c = conv_con_charla([['bot', 'Mirá gokywebs.com/presupuestos/Landing'],
                      ['cliente', 'ok gracias']]);
caso('no toma como referencia ni nuestro link ni lo que dice el bot',
    wabot_links_en_charla($c) === '');

$c = conv_con_charla([['cliente', 'algo como estudiokahn.com'], ['cliente', 'ya te la pase']]);
$c['referencia'] = '';
caso('la referencia final sale del link de la charla',
    wabot_referencia_final($c, null) === 'estudiokahn.com');

$c['referencia'] = 'me gusta lo minimalista';
caso('si además la describió, van el link y la descripción',
    wabot_referencia_final($c, null) === 'estudiokahn.com — me gusta lo minimalista');

$c = conv_con_charla([['cliente', 'no me acuerdo el nombre']]);
$c['referencia'] = '';
caso('sin link, usa lo que reconoció el resumen',
    wabot_referencia_final($c, ['referencia' => 'el estilo de Apple']) === 'el estilo de Apple');

echo "— La referencia entra en \"Sobre el negocio\" —\n";

$GLOBALS['WABOT_TEST_RESUMEN'] = function () {
    return ['negocio' => 'Estudio contable', 'ofrece' => 'Balances',
            'objetivo' => 'Captar clientes', 'referencia' => ''];
};
$GLOBALS['WABOT_TEST_COLORES'] = function () { return null; };
$c = conv_con_charla([['cliente', 'me gusta https://estudiokahn.com'], ['cliente', 'ya te la pase']]);
$c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'contador'; $c['colores'] = 'azul'; $c['tel'] = '999TEST999';
clasifica(['datos_prediseno']);
wabot_engine('ya te la pase', $c, $cfg);
caso('la conversación queda con el link rescatado, no con "ya te la pase"',
    $c['referencia'] === 'https://estudiokahn.com');

unset($GLOBALS['WABOT_TEST_RESUMEN'], $GLOBALS['WABOT_TEST_COLORES']);

echo "— Las pruebas no ensucian la pestaña Muestras —\n";

$antes = count(wabot_muestras_listar());
$c = conv_nueva(); $c['tipo'] = 'landing'; $c['descripcion'] = 'x'; $c['colores'] = 'azul';
$reg = wabot_muestra_guardar($c, $cfg, true);
caso('la muestra de un test queda marcada y no se escribe', $reg['test'] === true);
caso('el contador de Muestras no se mueve', count(wabot_muestras_listar()) === $antes);

echo "— Turnos: se pregunta antes de cotizar —\n";

$c = conv_nueva();
clasifica(['servicio_con_turnos']);
$r = wabot_engine('tengo una peluquería', $c, $cfg);
caso('un rubro con turnos NO se cotiza de una: primero pregunta',
    $r === [$cfg['desempate_turnos']] && $c['fase'] === 'desempate_turnos' && $c['tipo'] === null);

clasifica(['turnos_si']);
$r = wabot_engine('si, que saquen turno solos', $c, $cfg);
caso('quiere reserva online → $250.000 y link de Turnos',
    strpos($r[0], '$250.000') !== false && strpos($r[0], 'presupuestos/Turnos') !== false
    && $c['tipo'] === 'turnos');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['turnos_no']);
$r = wabot_engine('no, que me escriban nomas', $c, $cfg);
caso('alcanza con WhatsApp → vuelve a landing $200.000',
    strpos($r[0], '$200.000') !== false && $c['tipo'] === 'landing');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['otro']);
$r = wabot_engine('mmm no entiendo', $c, $cfg);
caso('si no contesta la pregunta de turnos, la REFORMULA (no la repite) antes de derivar',
    $r === [$cfg['desempate_turnos_2']] && $c['fase'] === 'desempate_turnos' && empty($c['handoff_pendiente']));

echo "— Comercios: primero se pregunta si quiere vender online —\n";

// El chat real: "Tengo una ferreteria" → cotizaba institucional $250.000.
$c = conv_nueva();
clasifica(['rubro_comercio']);
$r = wabot_engine('Tengo una ferreteria', $c, $cfg);
caso('una ferretería NO se cotiza de una: pregunta vender o mostrar',
    $r === [$cfg['desempate_comercio']] && $c['fase'] === 'desempate_comercio' && $c['tipo'] === null);
caso('y no le encajó el precio institucional', strpos(implode(' ', $r), '250.000') === false);

clasifica(['comercio_vender']);
$r = wabot_engine('quiero vender los productos online', $c, $cfg);
caso('quiere vender online → ecommerce $320.000',
    strpos($r[0], '$320.000') !== false && strpos($r[0], 'presupuestos/Ecommerce') !== false
    && $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
clasifica(['comercio_mostrar']);
$r = wabot_engine('no, que muestre el local nomas', $c, $cfg);
caso('solo mostrar el negocio → catálogo, y pregunta cuántos productos',
    $c['tipo'] === 'catalogo' && $c['fase'] === 'catalogo_cantidad' && $r === [$cfg['catalogo_cantidad']]);

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('cuanto tardan?', $c, $cfg);
caso('una duda en la pregunta del comercio se contesta y sigue en pie',
    $r === [$cfg['info']['plazos']] && $c['fase'] === 'desempate_comercio');

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
clasifica(['rubro_cursos']);
$r = wabot_engine('aparte doy cursos de herreria', $c, $cfg);
caso('nombra cursos en el desempate del comercio → cambia de pregunta',
    $r === [$cfg['desempate_cursos']] && $c['fase'] === 'desempate_cursos');

echo "— Empresa o institución: no es una landing —\n";

$c = conv_nueva();
clasifica(['rubro_institucional']);
$r = wabot_engine('somos una fábrica de aberturas', $c, $cfg);
caso('empresa → $250.000 institucional, sin preguntar nada',
    strpos($r[0], '$250.000') !== false && strpos($r[0], 'presupuestos/Institucional') !== false
    && $c['tipo'] === 'institucional' && $c['fase'] === 'precio');

$c = conv_nueva();
clasifica(['rubro_institucional']);
$r = wabot_engine('es para una fundacion', $c, $cfg);
caso('institución → el mismo tipo institucional', $c['tipo'] === 'institucional');

echo "— El precio con el link en su propio renglón —\n";

$c = conv_nueva();
clasifica(['rubro_landing']);
$r = wabot_engine('soy plomero', $c, $cfg);
caso('primero explica QUÉ es y recién después dice cuánto sale',
    strpos($r[0], 'para lo tuyo va una página a tu medida') !== false
    && strpos($r[0], 'Todo el desarrollo tendría un valor de $200.000') !== false
    && strpos($r[0], 'para lo tuyo va') < strpos($r[0], '$200.000'));
caso('el link arranca en un renglón nuevo', strpos($r[0], "\nEn este link podés ver detallado") !== false);
caso('es un solo salto de línea, no un párrafo suelto', substr_count($r[0], "\n") === 1);


echo "— Cada tipo cuenta lo suyo en el mensaje del precio —\n";

foreach ([
    'landing'       => 'contacto directo a tu WhatsApp',
    'turnos'        => 'eligen día y horario solos',
    'institucional' => 'web institucional completa',
    'inmobiliaria'  => 'catálogo de propiedades',
    'ecommerce'     => 'carrito y cobro online',
    'elearning'     => 'acceso propio para cada alumno',
] as $tipo => $sena) {
    $msg = wabot_msg_precio_texto($tipo, $cfg);
    caso("$tipo describe lo que incluye", stripos($msg, $sena) !== false
        && strpos($msg, $cfg['tipos'][$tipo]['precio']) !== false
        && substr_count($msg, "\n") === 1);
    caso("$tipo dice qué es ANTES de cuánto sale",
        strpos($msg, $sena) < strpos($msg, $cfg['tipos'][$tipo]['precio']));
}

// Y si a un tipo le borran la descripción, el mensaje no queda con un {desc} crudo.
$cfgSinDesc = $cfg;
$cfgSinDesc['tipos']['landing']['desc'] = '';
$msg = wabot_msg_precio_texto('landing', $cfgSinDesc);
caso('sin descripción cargada no queda ningún {desc} a la vista',
    strpos($msg, '{desc}') === false && strpos($msg, '$200.000') !== false);

echo "— Mantenimiento: el plan depende del tipo cotizado —\n";

$c = conv_nueva(); $c['tipo'] = 'landing'; $c['fase'] = 'precio';
clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
$r = wabot_engine('el mantenimiento cuanto sale?', $c, $cfg);
caso('landing → $10.000 y el link mensual',
    strpos($r[0], '$10.000') !== false && strpos($r[0], 'gokywebs.com/mantenimientomensual') !== false);
caso('y no se le cuela el precio del otro plan', strpos($r[0], '$15.000') === false);

foreach (['turnos', 'institucional', 'ecommerce', 'inmobiliaria', 'elearning'] as $t) {
    $c = conv_nueva(); $c['tipo'] = $t; $c['fase'] = 'precio';
    clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
    $r = wabot_engine('y el mantenimiento?', $c, $cfg);
    caso("$t → \$15.000 y el link completo",
        strpos($r[0], '$15.000') !== false && strpos($r[0], 'gokywebs.com/mantenimientoweb') !== false);
}

caso('el texto de mantenimiento aclara que es opcional',
    stripos($cfg['info']['mantenimiento'], 'opcional') !== false);

echo "— Cómo trabajamos: el paso a paso, sin decir la seña —\n";

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['pregunta_info'], ['info_keys' => ['proceso']]);
$r = wabot_engine('como se manejan ustedes?', $c, $cfg);
caso('explica el proceso completo', $r === [$cfg['info']['proceso']]);
caso('arranca por la demo gratis', stripos($r[0], 'demo gratis') !== false);
caso('nombra la seña para avanzar', stripos($r[0], 'seña') !== false);
caso('y aclara que el resto se paga con la web terminada y subida',
    stripos($r[0], 'terminada y subida') !== false);
caso('NO dice cuánto es la seña', strpos($r[0], '$') === false);

// La pregunta por la plata sigue siendo otra, y esa sí da números.
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('cuanto es la seña?', $c, $cfg);
caso('preguntar por la seña sí devuelve los montos', strpos($r[0], '$60.000') !== false);

// Y si pregunta las dos cosas, van las dos.
clasifica(['pregunta_info'], ['info_keys' => ['proceso', 'pago']]);
$r = wabot_engine('como trabajan y como se paga?', $c, $cfg);
caso('las dos preguntas juntas → las dos respuestas en bullets',
    count($r) === 1 && strpos($r[0], '- ') === 0
    && stripos($r[0], 'demo gratis') !== false && strpos($r[0], '$60.000') !== false);

// También se contesta con la charla ya cerrada.
$c2 = conv_nueva(); $c2['fase'] = 'derivado'; $c2['cierre'] = 'prediseno'; $c2['espera_avisada'] = true;
clasifica(['pregunta_info'], ['info_keys' => ['proceso']]);
$r = wabot_engine('me recordas como seguia?', $c2, $cfg);
caso('con la charla cerrada también explica el proceso', $r === [$cfg['info']['proceso']]);

echo "— La objeción de precio no promete cuotas sin interés que las páginas no respaldan —\n";

caso('el texto de "caro" ya no menciona cuotas sin interés', stripos($cfg['caro'], 'sin interés') === false);
caso('la respuesta de pago tampoco', stripos($cfg['info']['pago'], 'sin interés') === false);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'turnos';
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('como se paga?', $c, $cfg);
caso('preguntar cómo se paga no dispara la objeción de precio', $r[0] !== $cfg['caro']);

clasifica(['objecion_caro']);
$r = wabot_engine('uh, me parece caro', $c, $cfg);
caso('decir que es caro sí dispara la respuesta oficial', $r[0] === $cfg['caro']);

echo "— Un \"dale\" pelado acepta la muestra, no corta la venta —\n";

// El chat real: precio → pregunta de mantenimiento → "Ok dale" → derivaba.
$c = conv_nueva();
clasifica(['rubro_landing']);
wabot_engine('soy plomero', $c, $cfg);
clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
wabot_engine('Por mes cuanto tengo que pagar', $c, $cfg);
clasifica(['quiere_avanzar']);
$r = wabot_engine('Ok dale', $c, $cfg);
caso('"Ok dale" tras el precio → pide los datos del prediseño, NO deriva',
    $r === [wabot_prediseno_texto($c, $cfg)] && $c['fase'] === 'prediseno');
caso('y la charla sigue viva', $c['fase'] !== 'derivado');

foreach (['dale', 'ok', 'si', 'listo', 'de una', 'joya', 'me sirve', 'buenisimo', 'claro'] as $si) {
    $c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'turnos';
    clasifica(['quiere_avanzar']);
    $r = wabot_engine($si, $c, $cfg);
    caso("\"$si\" se toma como aceptar la muestra", $c['fase'] === 'prediseno');
}

// Pero querer avanzar DE VERDAD sigue derivando.
$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['quiere_avanzar']);
$r = wabot_engine('dale, mandame el CBU asi te transfiero la seña', $c, $cfg);
caso('un pedido con contenido propio sí deriva',
    $r === [$cfg['derivar']] && $c['fase'] === 'derivado');

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['pide_humano']);
$r = wabot_engine('queria hablar con una persona por favor', $c, $cfg);
caso('pedir humano con todas las letras sí deriva', $r === [$cfg['derivar']]);

// Y un "no" pelado no se convierte en un sí.
$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
clasifica(['no_interesa']);
$r = wabot_engine('no, gracias', $c, $cfg);
caso('un "no gracias" no se lee como aceptar', $r === [$cfg['no_interesa']] && $c['fase'] === 'precio');

// Fuera de la fase precio no aplica: ahí la pregunta abierta es otra.
$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['quiere_avanzar']);
$r = wabot_engine('dale', $c, $cfg);
caso('en el menú un "dale" no fuerza prediseño ni handoff',
    $r === [$cfg['contame']] && $c['fase'] === 'menu' && empty($c['handoff_pendiente']));

echo "— Vende productos pero NO quiere ecommerce: catálogo por cantidad —\n";

clasifica(['otro']);
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('solo mostrar y que me escriban', $c, $cfg);
caso('elegir "mostrar" NO cotiza todavía: primero pregunta cuántos productos',
    $c['fase'] === 'catalogo_cantidad' && $r === [$cfg['catalogo_cantidad']]);
caso('y el tipo ya quedó marcado como catálogo', $c['tipo'] === 'catalogo');

$r = wabot_engine('unos 40', $c, $cfg);
caso('con la cantidad, cotiza y pasa a precio', $c['fase'] === 'precio' && $c['productos_cantidad'] === 40);
caso('el total es $200.000 + $500 × 40 = $220.000', strpos($r[0], '$220.000') !== false);
caso('y muestra el desglose completo, no solo el total',
    strpos($r[0], '$200.000') !== false && strpos($r[0], '$500') !== false
    && strpos($r[0], '$20.000') !== false && strpos($r[0], '40 productos') !== false);
caso('con el link del presupuesto de Catálogo', strpos($r[0], 'presupuestos/Catalogo') !== false);
caso('respeta el salto de línea obligatorio antes del link', strpos($r[0], "\n") !== false);
caso('y ofrece la demo gratis igual que los demás tipos', count($r) === 2);

foreach ([[10, '$205.000'], [50, '$225.000'], [100, '$250.000'], [1, '$200.500']] as $par) {
    list($n, $esperado) = $par;
    $c2 = conv_nueva(); $c2['fase'] = 'catalogo_cantidad'; $c2['tipo'] = 'catalogo';
    $r2 = wabot_engine("tengo $n productos", $c2, $cfg);
    caso("$n productos → $esperado", strpos($r2[0], $esperado) !== false);
}

echo "— Leer la cantidad como la escribe un cliente real —\n";

foreach ([['40', 40], ['unos 40', 40], ['mas o menos 35', 35], ['tengo como 12 nomas', 12],
          ['entre 30 y 50', 50], ['mas de 100', 100], ['cuarenta', 40], ['tengo cien', 100],
          ['1.200', 1200], ['tengo 2 o 3', 3]] as $par) {
    caso("\"{$par[0]}\" → {$par[1]} productos", wabot_extraer_cantidad_productos($par[0]) === $par[1]);
}
foreach (['no se', 'muchos', 'varios', 'un monton', 'ni idea', '0', '$200.000'] as $m) {
    caso("\"$m\" no es una cantidad", wabot_extraer_cantidad_productos($m) === null);
}
caso('un rango toma el número mayor, para no sub-cotizar', wabot_extraer_cantidad_productos('entre 20 y 80') === 80);

echo "— Si no dice un número, reformula y no se cuelga —\n";

$c = conv_nueva(); $c['fase'] = 'catalogo_cantidad'; $c['tipo'] = 'catalogo';
$r1 = wabot_engine('uf, muchos', $c, $cfg);
caso('sin número, repregunta reformulado (no repite la misma frase)',
    $r1[0] === $cfg['catalogo_cantidad_2'] && $r1[0] !== $cfg['catalogo_cantidad']);
caso('y sigue esperando la cantidad', $c['fase'] === 'catalogo_cantidad');
$r2 = wabot_engine('a ojo unos 80', $c, $cfg);
caso('cuando finalmente lo dice, cotiza', $c['fase'] === 'precio' && strpos($r2[0], '$240.000') !== false);

$c = conv_nueva(); $c['fase'] = 'catalogo_cantidad'; $c['tipo'] = 'catalogo';
$vueltas = 0;
foreach (['ni idea', 'no se', 'no tengo idea'] as $m) {
    wabot_engine($m, $c, $cfg); $vueltas++;
    if ($c['fase'] === 'derivado') break;
}
caso('si nunca da un número, escala a Pablo en vez de insistir para siempre',
    $c['fase'] === 'derivado' && $vueltas <= 3);

echo "— Se puede cambiar de idea en plena pregunta de cantidad —\n";

clasifica(['comercio_vender']);
$c = conv_nueva(); $c['fase'] = 'catalogo_cantidad'; $c['tipo'] = 'catalogo';
$r = wabot_engine('pensandolo bien quiero cobrar online', $c, $cfg);
caso('si se arrepiente y quiere vender, cotiza ecommerce',
    $c['tipo'] === 'ecommerce' && strpos($r[0], '$320.000') !== false);

clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$c = conv_nueva(); $c['fase'] = 'catalogo_cantidad'; $c['tipo'] = 'catalogo';
$r = wabot_engine('cuanto tardan?', $c, $cfg);
caso('una duda en plena pregunta se contesta sin perder la cantidad pendiente',
    $c['fase'] === 'catalogo_cantidad' && strpos($r[0], $cfg['info']['plazos']) !== false);

echo "— El lead le dice a Pablo cuántos productos y por cuánto —\n";

$c = conv_nueva(); $c['tipo'] = 'catalogo'; $c['productos_cantidad'] = 40;
caso('el precio cotizado del catálogo se calcula, no es el de lista',
    wabot_lead_cotizado($c, $cfg) === '$220.000');
caso('para los demás tipos sigue siendo el precio de lista',
    wabot_lead_cotizado(['tipo' => 'landing'], $cfg) === '$200.000');

$obj = wabot_lead_objetivo('que la vean y le consulten', $c, $cfg);
caso('la cantidad entra en el bloque que Pablo lee al diseñar',
    strpos($obj, '40 productos') !== false && strpos($obj, '$220.000') !== false
    && strpos($obj, 'que la vean y le consulten') !== false);
caso('y no se duplica si el lead se arma dos veces',
    wabot_lead_objetivo($obj, $c, $cfg) === $obj);
caso('un tipo que no es catálogo no toca el objetivo',
    wabot_lead_objetivo('texto original', ['tipo' => 'landing'], $cfg) === 'texto original');
caso('sin cantidad tampoco lo toca',
    wabot_lead_objetivo('texto original', ['tipo' => 'catalogo'], $cfg) === 'texto original');

echo "— El documento que se manda a Bocetos se arma completo —\n";

// Este bloque vivía adentro de wabot_firestore_lead(), detrás del corte de modo
// test, así que era invisible para los tests: una edición lo insertó en la
// función equivocada y `productos_cantidad`/`presupuesto_cotizado` viajaron
// vacíos a Firestore (más un warning de variable indefinida en cada lead).
$cLead = conv_nueva();
$cLead['tel'] = '5491133334444';
$cLead['conversation_key'] = '5491133334444';
$cLead['channel_user_id'] = '5491133334444';
$cLead['canal'] = 'whatsapp';
$cLead['nombre'] = 'Ana Prueba';
$cLead['tipo'] = 'catalogo';
$cLead['productos_cantidad'] = 40;
$cLead['imagenes_recibidas'] = 3;
$cLead['descripcion'] = 'vende ropa';
$cLead['colores'] = 'negro y verde';
$cLead['colores_hex'] = ['principal' => '#000000', 'secundario' => '#00AA00', 'fondos' => '#FFFFFF'];
$cLead['brief'] = ['negocio' => 'Indumentaria', 'ofrece' => 'remeras', 'objetivo' => 'que la vean'];
$cLead['referencia'] = 'instagram.com/ejemplo';

$campos = wabot_lead_campos($cLead, $cfg, false);
$valor = function ($k) use ($campos) { $v = $campos[$k] ?? null; return $v ? reset($v) : null; };

caso('la cantidad de productos llega al boceto', $valor('productos_cantidad') === '40');
caso('la cantidad de imágenes que mandó también', $valor('imagenes_recibidas') === '3');
caso('y el precio cotizado también', $valor('presupuesto_cotizado') === '$220.000');
caso('el nombre del cliente no viaja vacío', $valor('nombre') === 'Ana Prueba');
caso('el rubro sale del brief', $valor('rubro') === 'Indumentaria');
caso('lo que ofrece también', $valor('productos_servicios') === 'remeras');
caso('el objetivo junta lo dicho + la referencia + la cotización del catálogo',
    strpos($valor('objetivo_web'), 'que la vean') !== false
    && strpos($valor('objetivo_web'), 'instagram.com/ejemplo') !== false
    && strpos($valor('objetivo_web'), '40 productos') !== false);
caso('los colores en hex van en sus tres campos',
    $valor('color_principal') === '#000000' && $valor('color_secundario') === '#00AA00' && $valor('color_fondos') === '#FFFFFF');
caso('el teléfono va formateado y legible', $valor('telefono') === '+54 9 11 3333-4444');
caso('la etiqueta del tipo es la de catálogo', $valor('tipoDetectadoLabel') === 'Web con catálogo');
caso('un boceto normal queda marcado como muestra confirmada, no como sistema',
    $valor('confirmoMuestra') === true && $valor('solicitoSistema') === false);

// Ningún campo puede quedar en null: eso sería una variable que no existe.
$nulos = [];
foreach ($campos as $k => $v) { if (reset($v) === null) $nulos[] = $k; }
caso('ningún campo del boceto queda en null (variable indefinida)', $nulos === []);

$campoSistema = wabot_lead_campos(array_merge($cLead, ['tipo' => 'sistema']), $cfg, true);
caso('un sistema de gestión se marca al revés',
    reset($campoSistema['solicitoSistema']) === true && reset($campoSistema['confirmoMuestra']) === false);

echo "— Marca/Negocio: nombre corto, no la descripción entera —\n";

caso('junta 2-3 palabras significativas en PascalCase', wabot_nombre_negocio_fallback('venta de indumentaria femenina') === 'VentaIndumentariaFemenina');
caso('saca las palabras cortas y de relleno (de, la, el...)', wabot_nombre_negocio_fallback('la venta de mi tienda') === 'VentaTienda');
caso('con texto vacío no rompe, devuelve vacío', wabot_nombre_negocio_fallback('') === '');
caso('con solo espacios, vacío también', wabot_nombre_negocio_fallback('   ') === '');
caso('saca tildes y ñ', wabot_nombre_negocio_fallback('atención y diseño') === 'AtencionDiseno');
caso('nunca se pasa de 40 caracteres', mb_strlen(wabot_nombre_negocio_fallback('palabralarguisima otrapalabraenorme unamastodavia')) <= 40);

$cMarca = conv_nueva();
$cMarca['tel'] = '5491144445555'; $cMarca['conversation_key'] = '5491144445555'; $cMarca['channel_user_id'] = '5491144445555';
$cMarca['canal'] = 'whatsapp'; $cMarca['nombre'] = 'Sergio';
$cMarca['brief'] = ['negocio' => 'Tienda de artículos eléctricos', 'ofrece' => 'pavas, tostadoras', 'objetivo' => ''];
$campoSinMarca = wabot_lead_campos($cMarca, $cfg, false);
caso('sin marca dicha por el cliente, se arma un nombre corto del rubro',
    reset($campoSinMarca['nombre_negocio']) === 'TiendaArticulosElectricos');
caso('el rubro completo sigue intacto para "Sobre el negocio"',
    reset($campoSinMarca['rubro']) === 'Tienda de artículos eléctricos');

$cMarca['brief']['marca'] = 'SILCA Servicios Industriales';
$campoConMarca = wabot_lead_campos($cMarca, $cfg, false);
caso('cuando el cliente SÍ dio un nombre, se usa tal cual — no se lo trocea en PascalCase',
    reset($campoConMarca['nombre_negocio']) === 'SILCA Servicios Industriales');

$cSistemaMarca = conv_nueva();
$cSistemaMarca['tel'] = '5491155556666'; $cSistemaMarca['conversation_key'] = '5491155556666'; $cSistemaMarca['channel_user_id'] = '5491155556666';
$cSistemaMarca['canal'] = 'whatsapp'; $cSistemaMarca['tipo'] = 'sistema';
$cSistemaMarca['brief'] = ['negocio' => 'Sistema de gestión a medida', 'ofrece' => 'necesito controlar el stock de mi deposito', 'objetivo' => ''];
$campoSistemaMarca = wabot_lead_campos($cSistemaMarca, $cfg, true);
caso('en sistemas, el nombre corto sale de lo que necesita resolver, no del texto genérico "Sistema de gestión a medida"',
    reset($campoSistemaMarca['nombre_negocio']) === 'NecesitoControlarStock');

echo "— La cantidad se borra al reiniciar la sesión —\n";

$c = conv_nueva();
$c['tipo'] = 'catalogo'; $c['productos_cantidad'] = 40; $c['fase'] = 'precio';
$c['ultimo_ts'] = time() - 30 * 86400;
wabot_conv_reset_si_vieja($c, $cfg);
caso('un cliente que vuelve no arrastra la cantidad vieja',
    empty($c['productos_cantidad']) && $c['tipo'] === null);

echo "— El desempate NO depende de que la IA acierte (chat real de los mates) —\n";

// Gemini devolvió 'otro' para "Vender" y "Carrito": el bot repreguntó 6 veces.
clasifica(['otro']);
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('Vender', $c, $cfg);
caso('"Vender" con el clasificador caído → cotiza ecommerce igual',
    $c['tipo'] === 'ecommerce' && strpos($r[0], '$320.000') !== false);

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('Carrito', $c, $cfg);
caso('"Carrito" también', $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('que me contacten por whatsapp nomas', $c, $cfg);
caso('"que me contacten por whatsapp" → catálogo', $c['tipo'] === 'catalogo');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
$r = wabot_engine('que saquen turno solos', $c, $cfg);
caso('turnos: "que saquen turno solos" → turnos', $c['tipo'] === 'turnos');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
$r = wabot_engine('con whatsapp alcanza', $c, $cfg);
caso('turnos: "con whatsapp alcanza" → landing', $c['tipo'] === 'landing');

$c = conv_nueva(); $c['fase'] = 'desempate_cursos';
$r = wabot_engine('venderlos con los videos', $c, $cfg);
caso('cursos: "venderlos con los videos" → elearning', $c['tipo'] === 'elearning');

// El chat real de la ropa: "Por la web" NO estaba en la lista y el bot repitió la pregunta.
foreach (['Por la web', 'por la pagina', 'desde la web', 'la primera', 'lo primero', 'que compren desde la pagina'] as $m) {
    $c = conv_nueva(); $c['fase'] = 'desempate_comercio';
    wabot_engine($m, $c, $cfg);
    caso("\"$m\" → ecommerce", $c['tipo'] === 'ecommerce');
}
foreach (['la segunda', 'que me escriban', 'la otra', 'sin carrito', 'no quiero vender online', 'solo mostrar'] as $m) {
    $c = conv_nueva(); $c['fase'] = 'desempate_comercio';
    wabot_engine($m, $c, $cfg);
    caso("\"$m\" → catálogo", $c['tipo'] === 'catalogo' && $c['fase'] === 'catalogo_cantidad');
}
caso('turnos: "la primera" → turnos', wabot_desempate_por_palabras('desempate_turnos', 'la primera') === 'turnos_si');
caso('turnos: "sin turnos" → landing (la negación gana)', wabot_desempate_por_palabras('desempate_turnos', 'sin turnos') === 'turnos_no');
caso('cursos: "la segunda" → mostrar', wabot_desempate_por_palabras('desempate_cursos', 'la segunda') === 'cursos_mostrar');

echo "— Si no entiende, reformula: nunca repite la misma pregunta textual —\n";

// La pregunta original la hizo el bot al entrar al desempate. Si el cliente
// no la contesta bien, la PRIMERA repregunta ya es la reformulada — nunca se
// manda dos veces el mismo texto seguido.
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r1 = wabot_engine('mmm', $c, $cfg);
caso('la repregunta NO es la pregunta original repetida', $r1[0] !== $cfg['desempate_comercio']);
caso('es la versión simplificada, con las dos palabras esperadas',
    $r1[0] === $cfg['desempate_comercio_2'] && strpos($r1[0], '"vender"') !== false && strpos($r1[0], '"mostrar"') !== false);
$r3 = wabot_engine('vender', $c, $cfg);
caso('y responder con esa palabra exacta resuelve', $c['tipo'] === 'ecommerce');

// Y si el clasificador SÍ acierta, gana la etiqueta (la red local no pisa).
clasifica(['comercio_mostrar']);
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('vender', $c, $cfg);
caso('si el clasificador etiquetó, manda la etiqueta y no las palabras', $c['tipo'] === 'catalogo');

echo "— Repetir la misma respuesta no puede loopear —\n";

clasifica(['otro']);
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$textos = [];
foreach (['zzz', 'zzz', 'zzz', 'zzz'] as $m) {
    $r = wabot_engine($m, $c, $cfg);
    $textos[] = $r[0] ?? '';
    if ($c['fase'] === 'derivado') break;
}
caso('repetir lo incomprensible escala a Pablo, no repregunta para siempre',
    $c['fase'] === 'derivado');
caso('y escala a la tercera, no más tarde', count($textos) === 3);
caso('las dos primeras fueron la reformulación (nunca la original repetida)',
    $textos[0] === $cfg['desempate_comercio_2'] && $textos[1] === $cfg['desempate_comercio_2']);

echo "— Ningún {nombre} sale crudo al cliente —\n";

$sin = ['tel'=>'T1','canal'=>'whatsapp','nombre'=>''];
$con = ['tel'=>'T2','canal'=>'whatsapp','nombre'=>'Lucía Gómez'];
foreach (['derivar', 'seguimiento_precio', 'seguimiento_datos', 'sistema_cierre', 'espera'] as $k) {
    if (!isset($cfg[$k])) continue;
    $a = wabot_personalizar($cfg[$k], $sin);
    $b = wabot_personalizar($cfg[$k], $con);
    caso("$k sin nombre → limpio, sin marcador ni coma colgada",
        strpos($a, '{') === false && !preg_match('/,\s*[.,]/', $a) && !preg_match('/\s[.,]/', $a));
    caso("$k con nombre → usa el primer nombre",
        strpos($b, '{') === false && (strpos($cfg[$k], '{nombre}') === false || strpos($b, 'Lucía') !== false));
}
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
wabot_enviar($sin, 'Hola, {nombre}. Prueba.');
caso('wabot_enviar es el último filtro: nunca sale un {nombre} crudo',
    strpos($GLOBALS['WABOT_TEST_ENVIADOS'][0][1], '{') === false);

echo "— Firma del webhook: dos claves, una por canal —\n";

$cuerpo = '{"object":"instagram","entry":[{"messaging":[]}]}';
$claveWa = 'secreto-de-la-app-de-meta';
$claveIg = 'secreto-de-la-app-de-instagram';

// Se simula la constante con un helper equivalente, para no depender del config real.
function firma_con($clave, $cuerpo) { return 'sha256=' . hash_hmac('sha256', $cuerpo, $clave); }
function valida_con($claves, $cuerpo, $firma) {
    if ($firma === '') return false;
    foreach ($claves as $c) {
        if (hash_equals('sha256=' . hash_hmac('sha256', $cuerpo, $c), $firma)) return true;
    }
    return false;
}

$dos = [$claveWa, $claveIg];
caso('firma de WhatsApp válida con las dos cargadas', valida_con($dos, $cuerpo, firma_con($claveWa, $cuerpo)));
caso('firma de Instagram válida con las dos cargadas', valida_con($dos, $cuerpo, firma_con($claveIg, $cuerpo)));
caso('una firma inventada se rechaza', !valida_con($dos, $cuerpo, 'sha256=' . str_repeat('a', 64)));
caso('sin firma se rechaza', !valida_con($dos, $cuerpo, ''));
caso('el cuerpo alterado invalida la firma', !valida_con($dos, $cuerpo . 'x', firma_con($claveWa, $cuerpo)));

// El caso que motivó el cambio: con UNA sola clave, el otro canal queda afuera.
caso('con solo la de WhatsApp, Instagram quedaría rechazado',
    !valida_con([$claveWa], $cuerpo, firma_con($claveIg, $cuerpo)));

// Y el parseo de la lista.
caso('la lista separa y limpia espacios',
    array_values(array_filter(array_map('trim', explode(',', ' uno , dos ,')))) === ['uno', 'dos']);
caso('vacío no deja ninguna clave',
    array_values(array_filter(array_map('trim', explode(',', '')))) === []);

echo "— El saludo de apertura no se repite —\n";

$c = conv_nueva();
caso('sin nada dicho, la apertura es el saludo', wabot_apertura($c, $cfg) === $cfg['menu']);

// El caso real: el agente llevó el primer turno y después se cayó.
$c['transcript'][] = ['q' => 'cliente', 't' => 'Hola como te va todo bien?', 'ts' => 1];
$c['transcript'][] = ['q' => 'bot', 't' => 'Hola, todo bien por acá. En qué te puedo ayudar hoy?', 'ts' => 2];
$c['session_started_ts'] = 1;
caso('si el bot YA habló, la apertura pasa a ser la repregunta',
    wabot_apertura($c, $cfg) === $cfg['contame']);

clasifica(['saludo']);
$r = wabot_engine('Bien bien', $c, $cfg);
caso('no vuelve a saludar a alguien con quien ya venía hablando', $r !== [$cfg['menu']]);
caso('y en su lugar repregunta para poder clasificar', $r === [$cfg['contame']]);

// Si contestó Pablo a mano, tampoco corresponde saludar de cero.
$c2 = conv_nueva();
$c2['transcript'][] = ['q' => 'humano', 't' => 'Hola, te escribo yo', 'ts' => 1];
caso('lo mismo si el que habló fue Pablo', wabot_apertura($c2, $cfg) === $cfg['contame']);

// Y una charla realmente nueva sí saluda.
$c3 = conv_nueva();
clasifica(['saludo']);
$r = wabot_engine('hola', $c3, $cfg);
caso('una charla que arranca de cero sí recibe el saludo', $r === [$cfg['menu']]);

echo "— Una vez en Muestras, no se sale de Muestras —\n";

$base = ['canal'=>'whatsapp','fase'=>'derivado','bot_off'=>false,'pausado_hasta'=>0,
         'descripcion'=>'mates','colores'=>'marron','lead_creado'=>true,
         'transcript'=>[['q'=>'bot','t'=>'Listo, con eso ya lo preparamos.','ts'=>1]]];
caso('una muestra recién cerrada está en Muestras', wabot_conv_grupo($base) === 'muestra');

// Una vez presentada, sale de Muestras y pasa a su propia columna.
$presentadaSinConfirmar = $base;
$presentadaSinConfirmar['presentado_ts'] = time();
caso('una muestra ya presentada sin confirmar va a Presentados, no a Muestras',
    wabot_conv_grupo($presentadaSinConfirmar) === 'presentados');
$presentadaConfirmada = $presentadaSinConfirmar;
$presentadaConfirmada['presentado_confirmado'] = true;
caso('una vez que confirmó, vuelve a Muestras (queda como cola de trabajo)',
    wabot_conv_grupo($presentadaConfirmada) === 'muestra');

// El caso de Pablo: contesta él, el cliente responde y queda último.
$base['transcript'][] = ['q'=>'humano','t'=>'Te mando la muestra mañana','ts'=>2];
$base['transcript'][] = ['q'=>'cliente','t'=>'dale, gracias!','ts'=>3];
$base['pausado_hasta'] = time() + 3600;
caso('si el cliente contesta último, SIGUE en Muestras', wabot_conv_grupo($base) === 'muestra');
caso('pero queda marcada como que te espera', wabot_conv_espera_respuesta($base) === true);

// Sin muestra, ese mismo caso sí va a Te esperan.
$sinMuestra = $base;
$sinMuestra['lead_creado'] = false;
$sinMuestra['descripcion'] = null;
$sinMuestra['colores'] = null;
caso('una charla sin muestra con el cliente esperando sí va a Te esperan',
    wabot_conv_grupo($sinMuestra) === 'atencion');

// El bug real del chat de Claudio: wabot_prediseno_completo() SIEMPRE marca
// handoff_pendiente (para que Pablo la vea como tarea), y ese flag tenía
// prioridad absoluta sobre el grupo. Todo boceto recién cerrado caía en
// "Te esperan" en vez de en "Muestras", y la cola de trabajo real quedaba
// invisible detrás de derivaciones genéricas.
$claudio = ['canal'=>'whatsapp','tipo'=>'ecommerce','fase'=>'derivado','cierre'=>'prediseno',
            'handoff_pendiente'=>true,'bot_off'=>false,'pausado_hasta'=>0,
            'descripcion'=>'','colores'=>'los del logo','lead_creado'=>true,
            'transcript'=>[['q'=>'bot','t'=>'Listo, con eso ya lo preparamos.','ts'=>time()]]];
caso('un boceto recién cerrado (handoff_pendiente Y cierre=prediseno a la vez) va a Muestras, no a Te esperan',
    wabot_conv_grupo($claudio) === 'muestra');

// Una derivación real (sin prediseño) sigue yendo a Te esperan como corresponde.
$derivacionReal = ['canal'=>'whatsapp','fase'=>'derivado','cierre'=>'derivacion','handoff_pendiente'=>true,
                    'bot_off'=>false,'pausado_hasta'=>0,'descripcion'=>null,'colores'=>null,'lead_creado'=>false,
                    'transcript'=>[['q'=>'bot','t'=>'Tu consulta la sigue Pablo.','ts'=>time()]]];
caso('una derivación sin prediseño sigue yendo a Te esperan', wabot_conv_grupo($derivacionReal) === 'atencion');

// El mismo caso pero de punta a punta por wabot_lista_items(), que es lo que
// arma el panel. admin.php tenía una segunda capa que releía handoff_pendiente
// y volvía a forzar "atencion" sin la excepción de muestra: revivía el bug de
// Claudio por otro lado, invisible para el test de wabot_conv_grupo() solo.
$claudioReal = wabot_conv_load('5491100CLAUDIOLISTA');
$claudioReal['tipo'] = 'ecommerce'; $claudioReal['fase'] = 'derivado'; $claudioReal['cierre'] = 'prediseno';
$claudioReal['handoff_pendiente'] = true; $claudioReal['lead_creado'] = true; $claudioReal['colores'] = 'los del logo';
$claudioReal['transcript'] = [['q'=>'bot','t'=>'Listo, con eso ya lo preparamos.','ts'=>time()]];
wabot_conv_save($claudioReal);
$encontrado = null;
foreach (wabot_lista_items() as $it) if ($it['tel'] === '5491100CLAUDIOLISTA') $encontrado = $it;
caso('de punta a punta (wabot_lista_items, lo que arma el panel real): el boceto va a Muestras',
    $encontrado !== null && $encontrado['grupo'] === 'muestra');
@unlink(wabot_conv_path('5491100CLAUDIOLISTA'));

$sistemaLegacy = $base;
$sistemaLegacy['tipo'] = 'sistema';
$sistemaLegacy['handoff_pendiente'] = false;
$sistemaLegacy['pausado_hasta'] = 0;
$sistemaLegacy['transcript'] = [['q'=>'bot','t'=>'Pablo prepara la propuesta','ts'=>time()]];
caso('un sistema legado con lead_creado no contamina la cola Muestras',
    wabot_conv_grupo($sistemaLegacy) === 'chat');

echo "— Instagram: se pide el WhatsApp antes de cerrar —\n";

function conv_ig() {
    $c = conv_nueva();
    $c['tel'] = '178414230999';   // IGSID, no un teléfono
    $c['canal'] = 'instagram';
    $c['telefono_wsp'] = null;
    return $c;
}

caso('una charla nueva es de WhatsApp por default', wabot_canal(conv_nueva()) === 'whatsapp');
caso('y la de Instagram se reconoce', wabot_canal(conv_ig()) === 'instagram');

$c = conv_ig(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['otro']);
$r = wabot_engine('no tengo ninguna', $c, $cfg);
caso('en Instagram NO cierra: primero pide el WhatsApp',
    $r === [$cfg['prediseno_whatsapp']] && $c['fase'] === 'prediseno_wsp' && $c['lead_creado'] === false);

$r = wabot_engine('11 2506-8578', $c, $cfg);
caso('con el número cierra y crea el lead',
    $r === [$cfg['prediseno_completo']] && $c['fase'] === 'derivado' && $c['lead_creado'] === true);
caso('el número queda guardado en formato internacional', $c['telefono_wsp'] === '5491125068578');

// Un número que no cierra se rechaza y se vuelve a pedir.
$c = conv_ig(); $c['fase'] = 'prediseno_wsp';
clasifica(['otro']);
$r = wabot_engine('no se, mandame un mail', $c, $cfg);
caso('un no-número se rechaza y sigue pidiendo',
    $r === [$cfg['prediseno_whatsapp_invalido']] && $c['fase'] === 'prediseno_wsp');

// Una pregunta ahí tampoco se toma como teléfono.
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('y cuanto tarda?', $c, $cfg);
caso('una pregunta en ese paso se contesta sin comerse el pedido',
    $r === [$cfg['info']['plazos'], $cfg['prediseno_whatsapp']] && $c['fase'] === 'prediseno_wsp');

// En WhatsApp el paso ni existe: ya tenemos el teléfono.
$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['otro']);
$r = wabot_engine('no tengo', $c, $cfg);
caso('en WhatsApp cierra directo, sin pedir nada más',
    $r === [$cfg['prediseno_completo']] && $c['fase'] === 'derivado');

// En Instagram, ni siquiera una intención de avanzar reemplaza el teléfono real.
$c = conv_ig(); $c['fase'] = 'prediseno_wsp'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['quiere_avanzar']);
$r = wabot_engine('mejor llamame', $c, $cfg);
caso('querer avanzar sin dar el número sigue pidiendo el WhatsApp y no inventa uno',
    $r === [$cfg['prediseno_whatsapp']] && $c['fase'] === 'prediseno_wsp' && $c['lead_creado'] === false);

echo "— Números de WhatsApp escritos como venga —\n";

foreach ([
    '11 2506-8578'      => '5491125068578',
    '1125068578'        => '5491125068578',
    '+54 9 11 2506-8578'=> '5491125068578',
    '5491125068578'     => '5491125068578',
    '011 15 2506-8578'  => '5491125068578',
    '011 15-2506-8578'  => '5491125068578',
    '0351 15 456-7890'  => '5493514567890',
    'es el 11 2506 8578'=> '5491125068578',
    '351 456-7890'      => '5493514567890',
] as $entrada => $esperado) {
    caso("\"$entrada\" → $esperado", wabot_extraer_celular($entrada) === $esperado);
}
foreach (['no tengo', 'mandame un mail', '123', 'hola que tal'] as $malo) {
    caso("\"$malo\" no es un número", wabot_extraer_celular($malo) === null);
}

echo "— Cada charla en su archivo, aunque el tel no sea numérico —\n";

caso('TEST tiene archivo propio', basename(wabot_conv_path('TEST')) === 'TEST.json');
caso('un tel real usa sus dígitos', basename(wabot_conv_path('+54 9 11 2506-8578')) === '5491125068578.json');
caso('dos no numéricos distintos no comparten archivo',
    wabot_conv_path('TEST') !== wabot_conv_path('OTRO'));
caso('un tel vacío no genera un archivo oculto',
    basename(wabot_conv_path('')) === 'sin-tel.json');

echo "— Una pregunta no es una referencia —\n";

$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'ecommerce';
$c['descripcion'] = 'mates'; $c['colores'] = 'marron';
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('cuanto tarda el prediseño?', $c, $cfg);
caso('pregunta en prediseno_ref → se contesta, re-pide la referencia y NO cierra',
    $r === [$cfg['info']['plazos'], $cfg['prediseno_referencia']] && $c['fase'] === 'prediseno_ref');
caso('y la pregunta NO queda guardada como referencia', empty($c['referencia']) && $c['lead_creado'] === false);

clasifica(['objecion_caro']);
$r = wabot_engine('igual me parece caro', $c, $cfg);
caso('objeción en prediseno_ref → tampoco cierra',
    $r === [$cfg['caro'], $cfg['prediseno_referencia']] && $c['fase'] === 'prediseno_ref');

clasifica(['saludo']);
$r = wabot_engine('gracias!', $c, $cfg);
caso('un gracias suelto no se vuelve la referencia', $c['fase'] === 'prediseno_ref' && empty($c['referencia']));

clasifica(['otro']);
$r = wabot_engine('me gusta como se ve zara.com', $c, $cfg);
caso('la respuesta de verdad sí cierra con la referencia bien guardada',
    $r === [$cfg['prediseno_completo']] && $c['referencia'] === 'me gusta como se ve zara.com' && $c['lead_creado'] === true);

echo "— Querer avanzar con los datos dados no tira el lead —\n";

$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['quiere_avanzar']);
$r = wabot_engine('dale, quiero arrancar ya', $c, $cfg);
caso('quiere avanzar en prediseno_ref → cierra el prediseño, no deriva a secas',
    $r === [$cfg['prediseno_completo']] && $c['lead_creado'] === true);

$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['pide_humano']);
$r = wabot_engine('pasame con una persona', $c, $cfg);
caso('pedir humano ahí también salva el lead', $r === [$cfg['prediseno_completo']] && $c['lead_creado'] === true);

echo "— El desempate no es un callejón —\n";

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['rubro_ecommerce']);
$r = wabot_engine('en realidad lo que quiero es vender productos', $c, $cfg);
caso('contesta otro rubro en pleno desempate → lo cotiza, no deriva',
    strpos($r[0], '$320.000') !== false && $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['rubro_cursos']);
$r = wabot_engine('aparte doy cursos de barberia', $c, $cfg);
caso('nombra cursos en el desempate de turnos → cambia a la pregunta de cursos',
    $r === [$cfg['desempate_cursos']] && $c['fase'] === 'desempate_cursos');

$c = conv_nueva(); $c['fase'] = 'desempate_cursos';
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('como seria el pago?', $c, $cfg);
caso('una duda en pleno desempate se contesta y la pregunta sigue en pie',
    $r === [$cfg['info']['pago_generico']] && $c['fase'] === 'desempate_cursos');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['otro']);
$r = wabot_engine('ni idea de que me hablas', $c, $cfg);
caso('sin nada que rescatar, primero reformula la pregunta y mantiene viva la charla',
    $r === [$cfg['desempate_turnos_2']] && $c['fase'] === 'desempate_turnos' && empty($c['handoff_pendiente']));

echo "— Mantenimiento sin tipo cotizado: los dos precios —\n";

$c = conv_nueva();
clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
$r = wabot_engine('tienen mantenimiento?', $c, $cfg);
caso('sin cotizar dice los dos precios, no promete $10.000 a secas',
    strpos($r[0], '$10.000') !== false && strpos($r[0], '$15.000') !== false);

echo "— Negativas nuevas de referencia —\n";

foreach (['no se', 'ni idea', 'creo que no', 'por ahora no', 'mmm no'] as $n) {
    caso("\"$n\" cuenta como sin referencia", wabot_es_negativa($n) === true);
}

echo "— La demora sale del largo del mensaje —\n";

$t = ['demora_por_longitud' => true, 'tipeo_por_segundo' => 28,
      'demora_minima' => 1.2, 'demora_maxima' => 7, 'demora_entre_mensajes' => 2];

$corto = 'Dale';
$medio = str_repeat('a', 84);    // 84 / 28 = 3 s
$largo = str_repeat('a', 500);

caso('un mensaje largo tarda más que uno corto',
    wabot_demora_tipeo($largo, $t) > wabot_demora_tipeo($corto, $t));
caso('84 caracteres a 28 por segundo → 3 segundos',
    abs(wabot_demora_tipeo($medio, $t) - 3.0) < 0.01);
caso('un "dale" no sale disparado: respeta el piso',
    abs(wabot_demora_tipeo($corto, $t) - 1.2) < 0.01);
caso('un mensaje enorme no deja esperando: respeta el techo',
    abs(wabot_demora_tipeo($largo, $t) - 7.0) < 0.01);
caso('no cuenta los espacios de los bordes',
    wabot_demora_tipeo("   $medio   ", $t) === wabot_demora_tipeo($medio, $t));

$fijo = array_merge($t, ['demora_por_longitud' => false]);
caso('con la opción apagada vuelve a la pausa fija',
    wabot_demora_tipeo($largo, $fijo) === 2.0 && wabot_demora_tipeo($corto, $fijo) === 2.0);

$roto = array_merge($t, ['tipeo_por_segundo' => 0]);
caso('velocidad en cero no divide por cero', wabot_demora_tipeo($medio, $roto) === 2.0);

$alReves = array_merge($t, ['demora_minima' => 5, 'demora_maxima' => 2]);
caso('piso mayor que el techo no rompe', wabot_demora_tipeo($corto, $alReves) === 5.0);

// Los dos mensajes del precio tienen que tardar distinto entre sí.
$c = conv_nueva();
clasifica(['rubro_ecommerce']);
$r = wabot_engine('vendo mates', $c, $cfg);
$d0 = wabot_demora_tipeo($r[0], $t);
$d1 = wabot_demora_tipeo($r[1], $t);
caso('el precio y la oferta no tardan lo mismo, porque no miden lo mismo', $d0 !== $d1);
caso('las dos demoras caen entre el piso y el techo',
    $d0 >= 1.2 && $d0 <= 7 && $d1 >= 1.2 && $d1 <= 7);

echo "— Teléfono legible para el boceto —\n";

caso('celular de CABA con el 9', wabot_formatear_tel('5491140688675') === '+54 9 11 4068-8675');
caso('el mismo con símbolos y espacios', wabot_formatear_tel('+54 9 11 4068-8675') === '+54 9 11 4068-8675');
caso('fijo de CABA sin el 9', wabot_formatear_tel('541147260749') === '+54 11 4726-0749');
caso('área de 3 dígitos (Córdoba)', wabot_formatear_tel('5493514567890') === '+54 9 351 456-7890');
caso('número extranjero → se deja con el +', wabot_formatear_tel('34911223344') === '+34911223344');
caso('vacío → vacío', wabot_formatear_tel('') === '');
caso('basura sin dígitos → vacío', wabot_formatear_tel('hola') === '');

echo "— Colores a hex para la ficha del boceto —\n";

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) {
    return ['principal' => '#5FC9C0', 'secundario' => '#FFFFFF', 'fondos' => '#F7FAFA'];
};
$h = wabot_colores_a_hex('verde agua y blanco');
caso('respuesta válida → devuelve los tres en mayúsculas',
    $h === ['principal' => '#5FC9C0', 'secundario' => '#FFFFFF', 'fondos' => '#F7FAFA']);

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) { return ['principal' => 'verde', 'secundario' => '#FFFFFF', 'fondos' => '#F7FAFA']; };
caso('un color no es hex → descarta los tres, no guarda a medias', wabot_colores_a_hex('lo que sea') === null);

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) { return ['principal' => '#5FC9C0']; };
caso('faltan campos → null', wabot_colores_a_hex('lo que sea') === null);

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) { return ['principal' => '#5fc9c0', 'secundario' => '#ffffff', 'fondos' => '#f7fafa']; };
$h = wabot_colores_a_hex('x');
caso('hex en minúscula → se normaliza a mayúscula', $h['principal'] === '#5FC9C0');

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) { return ['principal' => '#GGGGGG', 'secundario' => '#FFFFFF', 'fondos' => '#F7FAFA']; };
caso('hex con letras inválidas → null', wabot_colores_a_hex('x') === null);

$GLOBALS['WABOT_TEST_COLORES'] = function ($t) { return null; };
caso('el modelo no contesta → null, el texto original se guarda igual', wabot_colores_a_hex('rojo') === null);

caso('sin colores dichos → ni intenta', wabot_colores_a_hex('   ') === null);

// Y que el flujo completo los deje en la conversación.
$GLOBALS['WABOT_TEST_COLORES'] = function ($t) {
    return ['principal' => '#111111', 'secundario' => '#222222', 'fondos' => '#FEFEFE'];
};
$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'Estudio contable'; $c['colores'] = 'azul y gris';
clasifica(['datos_prediseno']);
$r = wabot_engine('no tengo referencia', $c, $cfg);
caso('al cerrar el prediseño quedan los hex en la conversación',
    $c['colores_hex'] === ['principal' => '#111111', 'secundario' => '#222222', 'fondos' => '#FEFEFE']
    && $c['colores'] === 'azul y gris');

unset($GLOBALS['WABOT_TEST_COLORES']);

echo "— Demora antes de contestar —\n";

$cfgD = $cfg; $cfgD['demora_segundos'] = 5;
$ahoraF = microtime(true);
caso('sin tiempo gastado → espera los 5 segundos completos',
    abs(wabot_demora_restante($cfgD, $ahoraF) - 5.0) < 0.1);
caso('la IA tardó 3 s → espera solo los 2 que faltan',
    abs(wabot_demora_restante($cfgD, $ahoraF - 3) - 2.0) < 0.1);
caso('la IA tardó más que la demora → no espera nada',
    wabot_demora_restante($cfgD, $ahoraF - 9) === 0.0);

$cfgD['demora_segundos'] = 0;
caso('demora en 0 → contesta al toque', wabot_demora_restante($cfgD, $ahoraF - 1) === 0.0);

$cfgSin = $cfg; unset($cfgSin['demora_segundos']);
caso('config vieja sin el campo → usa 5 por defecto',
    abs(wabot_demora_restante($cfgSin, $ahoraF) - 5.0) < 0.1);

$cfgD['demora_segundos'] = 5;
caso('reloj corrido hacia atrás → nunca da negativo ni se pasa del tope',
    wabot_demora_restante($cfgD, $ahoraF + 100) >= 0.0 && wabot_demora_restante($cfgD, $ahoraF + 100) <= 5.0);

echo "— Persistencia de Instagram, seguimiento y sesiones —\n";

// Regresión del bug original: Instagram leía `ig{ID}` pero guardaba `{ID}`.
$igsidPrueba = '999' . getmypid() . substr((string)time(), -6);
$claveIgPrueba = 'ig' . $igsidPrueba;
$pathIgPrueba = wabot_conv_path($claveIgPrueba);
$pathCrudoPrueba = wabot_conv_path($igsidPrueba);
@unlink($pathIgPrueba);
$c = wabot_conv_load($claveIgPrueba);
$c['canal'] = 'instagram';
$c['channel_user_id'] = $igsidPrueba;
$c['tel'] = $igsidPrueba;
$c['fase'] = 'precio';
$c['tipo'] = 'landing';
$c['transcript'] = [['q'=>'cliente','t'=>'Hola','ts'=>time()], ['q'=>'bot','t'=>'Hola, contame','ts'=>time()]];
$guardadaIg = wabot_conv_save($c);
$recargadaIg = wabot_conv_load($claveIgPrueba);
caso('Instagram guarda por conversation_key prefijada, no por el IGSID crudo',
    $guardadaIg && file_exists($pathIgPrueba) && !file_exists($pathCrudoPrueba));
caso('el segundo DM recupera fase, tipo e historial anteriores',
    $recargadaIg['fase'] === 'precio' && $recargadaIg['tipo'] === 'landing'
    && count($recargadaIg['transcript']) === 2
    && $recargadaIg['channel_user_id'] === $igsidPrueba);
@unlink($pathIgPrueba);

// Fijado a las 14:00 hora argentina: el seguimiento ahora respeta una franja
// horaria, así que con time() crudo estos casos pasarían o fallarían según la
// hora a la que se corran los tests.
$ahoraSeg = (int)(floor((time() - 3 * 3600) / 86400) * 86400) + 14 * 3600 + 3 * 3600;
$cfgSeg = $cfg; $cfgSeg['seguimiento_activo'] = true; $cfgSeg['seguimiento_horas'] = 3;
$caliente = conv_nueva();
$caliente['fase'] = 'precio';
$caliente['nombre'] = 'Marcos Pérez';
$caliente['ultimo_cliente_ts'] = $ahoraSeg - 4 * 3600;
$caliente['transcript'] = [['q'=>'cliente','t'=>'Dale, lo veo','ts'=>$ahoraSeg - 4 * 3600],
                           ['q'=>'bot','t'=>'Te paso el presupuesto','ts'=>$ahoraSeg - 3.5 * 3600]];
caso('un lead caliente en silencio califica para un único seguimiento',
    wabot_seguimiento_corresponde($caliente, $cfgSeg, $ahoraSeg) === true);
caso('el seguimiento usa el primer nombre sin dejar el placeholder',
    strpos(wabot_personalizar(wabot_seguimiento_texto($caliente, $cfgSeg), $caliente), 'Marcos') !== false
    && strpos(wabot_personalizar(wabot_seguimiento_texto($caliente, $cfgSeg), $caliente), '{nombre}') === false);
$fria = $caliente; $fria['fase'] = 'menu';
caso('una charla fría nunca recibe seguimiento', !wabot_seguimiento_corresponde($fria, $cfgSeg, $ahoraSeg));
$derivada = $caliente; $derivada['handoff_pendiente'] = true;
caso('si Pablo ya quedó pendiente, el cron no pisa el handoff', !wabot_seguimiento_corresponde($derivada, $cfgSeg, $ahoraSeg));
$fueraVentana = $caliente; $fueraVentana['ultimo_cliente_ts'] = $ahoraSeg - 23 * 3600;
caso('fuera de la ventana de Meta no intenta texto libre', !wabot_seguimiento_corresponde($fueraVentana, $cfgSeg, $ahoraSeg));
$yaEnviado = $caliente; $yaEnviado['seguimiento_enviado'] = true;
caso('un seguimiento exitoso no se repite', !wabot_seguimiento_corresponde($yaEnviado, $cfgSeg, $ahoraSeg));

echo "— Franja horaria del seguimiento (el bug de las 20:30 del 20-ago) —\n";
$hLocal = function ($h) { return (int)(floor((time() - 3 * 3600) / 86400) * 86400) + $h * 3600 + 3 * 3600; };
caso('las 14:00 son hora hábil', wabot_hora_local($hLocal(14)) === 14);
caso('las 03:00 también se calculan bien', wabot_hora_local($hLocal(3)) === 3);

// El caso real: el bot le escribió a leny a las 03:10 y el cron mandó el
// seguimiento a las 20:30. Con la franja 8-20 eso ya no sale a esa hora.
$leny = $caliente;
$leny['ultimo_cliente_ts'] = $hLocal(3);
$leny['transcript'] = [['q'=>'cliente','t'=>'Es una fundación','ts'=>$hLocal(3)],
                       ['q'=>'bot','t'=>'Te paso el presupuesto','ts'=>$hLocal(3) + 600]];
caso('a las 20:30 ya no se manda un seguimiento', !wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(20) + 1800));
caso('a las 23:00 tampoco', !wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(23)));
caso('a las 06:00 tampoco: todavía es de madrugada', !wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(6)));
caso('a las 09:00 sí sale', wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(9)) === true);

// Un empujón comercial a destiempo molesta más de lo que vende: si la ventana
// se cierra de madrugada, se pierde el seguimiento y no se manda igual (a
// diferencia del aviso de muestra, donde sí se prioriza no perder la entrega).
$porVencer = $caliente;
$porVencer['ultimo_cliente_ts'] = $hLocal(2);
$porVencer['transcript'] = [['q'=>'cliente','t'=>'Dale','ts'=>$hLocal(2)],
                            ['q'=>'bot','t'=>'Te paso el presupuesto','ts'=>$hLocal(2) + 600]];
caso('aunque la ventana esté por vencer, de madrugada no se manda',
    !wabot_seguimiento_corresponde($porVencer, $cfgSeg, $hLocal(5)));

caso('las 19:59 son el último minuto hábil',
    wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(19) + 3540) === true);
caso('las 20:00 en punto ya quedan afuera',
    !wabot_seguimiento_corresponde($leny, $cfgSeg, $hLocal(20)));

$cfgAmplio = $cfgSeg; $cfgAmplio['seguimiento_hora_desde'] = 0; $cfgAmplio['seguimiento_hora_hasta'] = 24;
caso('la franja es configurable: con 0-24 vuelve el comportamiento viejo',
    wabot_seguimiento_corresponde($leny, $cfgAmplio, $hLocal(20) + 1800) === true);

$vieja = $caliente;
$vieja['fase'] = 'derivado';
$vieja['ultimo_ts'] = $ahoraSeg - 8 * 86400;
$vieja['cta_muestra'] = true;
$vieja['seguimiento_enviado'] = true;
$vieja['handoff_pendiente'] = true;
$vieja['sistema_lead_creado'] = true;
$vieja['nombre_usado'] = true;
$sesionAnterior = $vieja['session_id'] ?? '';
$reiniciada = wabot_conv_reset_si_vieja($vieja, $cfg, $ahoraSeg);
caso('una sesión vieja vuelve a vender sin arrastrar CTA, seguimiento ni handoff',
    $reiniciada && $vieja['fase'] === 'nuevo' && !$vieja['cta_muestra']
    && !$vieja['seguimiento_enviado'] && !$vieja['handoff_pendiente']
    && !$vieja['sistema_lead_creado'] && !$vieja['nombre_usado']
    && ($vieja['session_id'] ?? '') !== $sesionAnterior);

$nuevaPeroVieja = conv_nueva();
$nuevaPeroVieja['fase'] = 'nuevo';
$nuevaPeroVieja['ultimo_ts'] = $ahoraSeg - 8 * 86400;
$nuevaPeroVieja['lead_recibido_evento'] = true;
$nuevaPeroVieja['session_id'] = 'sesion-vieja-sin-tools';
caso('también reinicia una charla vieja que el agente dejó en fase nuevo',
    wabot_conv_reset_si_vieja($nuevaPeroVieja, $cfg, $ahoraSeg)
    && !$nuevaPeroVieja['lead_recibido_evento']
    && $nuevaPeroVieja['session_id'] !== 'sesion-vieja-sin-tools');

echo "— Muestras presentadas: recordatorio a las 48h, archivo a la semana —\n";

$ahoraPres = time();
$cfgPres = $cfg; $cfgPres['presentados_recordatorio_horas'] = 48; $cfgPres['presentados_archivar_horas'] = 168;
$cfgPres['presentados_recordatorio'] = 'Hola {nombre}, viste la demo? {demo}';

$presEspera = conv_nueva();
$presEspera['nombre'] = 'Marcos';
$presEspera['presentado_ts'] = $ahoraPres - 49 * 3600;
$presEspera['presentado_slug'] = 'negociodemarcos';
$presEspera['ultimo_cliente_ts'] = $ahoraPres - 1 * 3600;
caso('a las 49h sin confirmar, con el cliente activo hace poco, corresponde el recordatorio',
    wabot_presentado_recordatorio_corresponde($presEspera, $cfgPres, $ahoraPres) === true);
caso('el recordatorio lleva el link de la muestra y el nombre',
    strpos(wabot_personalizar(wabot_presentado_recordatorio_texto($presEspera, $cfgPres), $presEspera), 'gokywebs.com/demo/negociodemarcos') !== false
    && strpos(wabot_personalizar(wabot_presentado_recordatorio_texto($presEspera, $cfgPres), $presEspera), 'Marcos') !== false);

$presTemprano = $presEspera; $presTemprano['presentado_ts'] = $ahoraPres - 10 * 3600;
caso('antes de las 48h no corresponde', !wabot_presentado_recordatorio_corresponde($presTemprano, $cfgPres, $ahoraPres));

$presConfirmado = $presEspera; $presConfirmado['presentado_confirmado'] = true;
caso('si Pablo ya marcó que confirmó, no se le insiste', !wabot_presentado_recordatorio_corresponde($presConfirmado, $cfgPres, $ahoraPres));

$presYaEnviado = $presEspera; $presYaEnviado['presentado_recordatorio_enviado'] = true;
caso('el recordatorio se manda una sola vez', !wabot_presentado_recordatorio_corresponde($presYaEnviado, $cfgPres, $ahoraPres));

$presSilencioLargo = $presEspera; $presSilencioLargo['ultimo_cliente_ts'] = $ahoraPres - 30 * 3600;
caso('si el cliente lleva más de 22h sin escribir, no manda texto libre fuera de ventana',
    !wabot_presentado_recordatorio_corresponde($presSilencioLargo, $cfgPres, $ahoraPres));

$presArchivar = conv_nueva();
$presArchivar['presentado_ts'] = $ahoraPres - 169 * 3600;
caso('pasada una semana sin confirmar, corresponde archivar',
    wabot_presentado_archivar_corresponde($presArchivar, $cfgPres, $ahoraPres) === true);
$presArchivarTemprano = $presArchivar; $presArchivarTemprano['presentado_ts'] = $ahoraPres - 100 * 3600;
caso('a mitad de semana todavía no corresponde archivar',
    !wabot_presentado_archivar_corresponde($presArchivarTemprano, $cfgPres, $ahoraPres));
$presArchivarConfirmado = $presArchivar; $presArchivarConfirmado['presentado_confirmado'] = true;
caso('si ya confirmó, nunca se archiva solo por inactividad',
    !wabot_presentado_archivar_corresponde($presArchivarConfirmado, $cfgPres, $ahoraPres));

echo "— Aviso antes de que cierre la ventana de la muestra —\n";

$cfgAviso = $cfg; $cfgAviso['muestra_aviso_activo'] = true; $cfgAviso['muestra_aviso'] = 'Hola {nombre}, tu muestra va a estar lista hoy.';

$clienteManana = gmmktime(11, 0, 0, 8, 19, 2026); // 8:00 hora AR
$limiteManana = $clienteManana + 24 * 3600;
$candManana = wabot_muestra_aviso_hora_candidata($clienteManana, $limiteManana);
caso('si escribió a las 8 de la mañana, el aviso cae justo antes de que cierre la ventana (no a las 8am del día siguiente)',
    $candManana === $limiteManana - 30 * 60);

$clienteTarde = gmmktime(18, 0, 0, 8, 19, 2026); // 15:00 hora AR
$limiteTarde = $clienteTarde + 24 * 3600;
$candTarde = wabot_muestra_aviso_hora_candidata($clienteTarde, $limiteTarde);
caso('si escribió a la tarde, el aviso cae a las 8am del día siguiente (con margen de sobra antes del cierre)',
    $candTarde === $limiteTarde - 7 * 3600 && $candTarde < $limiteTarde - 30 * 60);

$clienteMadrugada = gmmktime(5, 0, 0, 8, 19, 2026); // 2:00 hora AR
$limiteMadrugada = $clienteMadrugada + 24 * 3600;
$candMadrugada = wabot_muestra_aviso_hora_candidata($clienteMadrugada, $limiteMadrugada);
caso('si escribió de madrugada, nunca manda el aviso después de que cierra la ventana',
    $candMadrugada < $limiteMadrugada);

$ahoraAv = $limiteManana - 20 * 60; // 20 min antes del cierre: ya pasó el candidato (30 min antes)
$avEnVentana = conv_nueva();
$avEnVentana['fase'] = 'derivado';
$avEnVentana['lead_creado'] = true;
$avEnVentana['ultimo_cliente_ts'] = $clienteManana;
caso('con la ventana por cerrarse y todavía sin avisar, corresponde mandar el aviso',
    wabot_muestra_aviso_corresponde($avEnVentana, $cfgAviso, $ahoraAv) === true);

$avTemprano = $avEnVentana;
caso('mucho antes del horario elegido, todavía no corresponde',
    !wabot_muestra_aviso_corresponde($avTemprano, $cfgAviso, $clienteManana + 3600));

$avYaEnviado = $avEnVentana; $avYaEnviado['muestra_aviso_enviado'] = true;
caso('el aviso se manda una sola vez', !wabot_muestra_aviso_corresponde($avYaEnviado, $cfgAviso, $ahoraAv));

$avYaPresentada = $avEnVentana; $avYaPresentada['presentado_ts'] = $ahoraAv;
caso('si ya se presentó la muestra, no hace falta el aviso previo',
    !wabot_muestra_aviso_corresponde($avYaPresentada, $cfgAviso, $ahoraAv));

$avSinLead = $avEnVentana; $avSinLead['lead_creado'] = false;
caso('sin lead creado (no pidió muestra todavía) no corresponde',
    !wabot_muestra_aviso_corresponde($avSinLead, $cfgAviso, $ahoraAv));

$avOtraFase = $avEnVentana; $avOtraFase['fase'] = 'precio';
caso('fuera de la fase derivado no corresponde', !wabot_muestra_aviso_corresponde($avOtraFase, $cfgAviso, $ahoraAv));

$avVentanaCerrada = $avEnVentana;
caso('con la ventana ya cerrada, no tiene sentido mandarlo',
    !wabot_muestra_aviso_corresponde($avVentanaCerrada, $cfgAviso, $limiteManana + 3600));

echo "— Emojis y reacciones dicen algo, no se pierden —\n";

caso('un pulgar arriba solo → "si"', wabot_emoji_a_texto('👍') === 'si');
caso('un corazón → "si"', wabot_emoji_a_texto('❤️') === 'si');
caso('un pulgar abajo → "no"', wabot_emoji_a_texto('👎') === 'no');
caso('una carita pensativa → "no se"', wabot_emoji_a_texto('🤔') === 'no se');
caso('un emoji sin mapeo no rompe, da vacío', wabot_emoji_a_texto('🦆') === '');
caso('texto real con un emoji suelto no se confunde con "solo emoji"',
    wabot_texto_util('Gracias 🫂') === 'Gracias 🫂');
caso('un mensaje que es SOLO el emoji se traduce', wabot_texto_util('👍') === 'si');
caso('texto normal sin emojis pasa igual', wabot_texto_util('cuanto sale?') === 'cuanto sale?');
caso('vacío sigue vacío', wabot_texto_util('') === '');

echo "— Cursos: \"autogestionable\" es una respuesta clara, no una duda —\n";

// Bug real: el cliente dijo "algo autogestionable" y el bot no lo entendió,
// repitió la pregunta textual una vez más (visible como "tildado").
foreach (['autogestionable', 'autogestion', 'algo autogestionable', 'que se inscriban solos'] as $m) {
    caso("\"$m\" → vender (con videos y acceso propio)",
        wabot_desempate_por_palabras('desempate_cursos', $m) === 'cursos_vender');
}

echo "— Rubros que el fallback local no reconocía —\n";

foreach ([
    ['Una imprenta, me voy a dedicar a impresión en cajas microcorrugado', 'comercio_pendiente'],
    ['hago packaging para gastronomia', 'comercio_pendiente'],
    ['tengo una libreria', 'comercio_pendiente'],
] as $par) {
    caso("\"{$par[0]}\" → {$par[1]}", wabot_fallback_rubro_local($par[0]) === $par[1]);
}

echo "— Dudas frecuentes que el clasificador a veces no etiqueta —\n";

// Bug real: "Y por mes cuanto pago" no se reconoció como pregunta de
// mantenimiento y el bot saltó a otra cosa, ignorando la pregunta.
foreach ([
    ['Y por mes cuanto pago', 'mantenimiento'],
    ['decime cuanto pago por mes', 'mantenimiento'],
    ['cuanto tardan?', 'plazos'],
    ['como se paga?', 'pago'],
    ['el dominio lo incluyen?', 'hosting'],
    ['como se manejan ustedes?', 'proceso'],
] as $par) {
    caso("\"{$par[0]}\" → info: {$par[1]}", wabot_info_por_palabras($par[0]) === $par[1]);
}
caso('un saludo común no dispara ninguna info', wabot_info_por_palabras('hola, como estas') === null);

clasifica(['otro']);
$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing';
$r = wabot_engine('Y por mes cuanto pago', $c, $cfg);
caso('de punta a punta: la pregunta de mantenimiento se contesta aunque el clasificador diga "otro"',
    strpos($r[0], $cfg['info']['mantenimiento']) !== false || strpos($r[0], 'mantenimiento') !== false);

// El respaldo NUNCA pisa una acción que el clasificador sí reconoció. Bug real:
// la foto de un logo describía "Mandó el logo…" y esa palabra "logo" activaba
// el respaldo de info y pisaba el dato real (datos_prediseno).
clasifica(['datos_prediseno'], ['descripcion' => 'Panadería', 'colores' => 'marrón']);
$c = conv_nueva(); $c['fase'] = 'prediseno'; $c['tipo'] = 'ecommerce';
$r = wabot_engine('Mandó el logo de su panadería, en marrón y crema', $c, $cfg);
caso('una acción real reconocida por el clasificador nunca es pisada por el respaldo de info',
    $c['descripcion'] === 'Panadería' && $c['colores'] === 'marrón');

echo "— Guarda a disco lo que manda el cliente, para poder descargarlo —\n";

$g = wabot_media_guardar('5491100000000TEST', str_repeat('x', 300), 'image/jpeg', 'imagen');
caso('una foto se guarda y devuelve archivo/mime/bytes', $g !== null && $g['clase'] === 'imagen' && $g['bytes'] === 300);
caso('el archivo generado respeta el patrón que valida el endpoint de descarga',
    preg_match('/^\d{8}-\d{6}-[0-9a-f]{8}\.jpg$/', $g['archivo']) === 1);
$ruta = WABOT_DATA . '/media/5491100000000TEST/' . $g['archivo'];
caso('y existe de verdad en disco', is_file($ruta));
@unlink($ruta); @rmdir(WABOT_DATA . '/media/5491100000000TEST');

$audio = wabot_media_guardar('5491100000001TEST', 'abc', 'audio/ogg; codecs=opus', 'audio');
caso('un audio con parámetros en el mime igual mapea la extensión correcta',
    $audio !== null && substr($audio['archivo'], -4) === '.ogg');
@unlink(WABOT_DATA . '/media/5491100000001TEST/' . $audio['archivo']);
@rmdir(WABOT_DATA . '/media/5491100000001TEST');

caso('sin bytes no guarda nada', wabot_media_guardar('X', '', 'image/jpeg', 'imagen') === null);

echo "— Notas de voz: solo formatos que WhatsApp acepta —\n";

// La lista sale de la doc de Meta. webm queda afuera a propósito: es el default
// de Chrome viejo y WhatsApp lo rechaza, así que mandarlo sería prometer un
// envío que falla del lado del cliente.
foreach (['audio/mp4', 'audio/ogg', 'audio/ogg; codecs=opus', 'audio/mpeg', 'audio/aac', 'audio/amr'] as $m) {
    caso("\"$m\" se acepta", wabot_audio_mime_valido($m) === true);
}
foreach (['audio/webm', 'audio/webm;codecs=opus', 'video/mp4', 'application/octet-stream', ''] as $m) {
    caso('"' . ($m ?: '(vacío)') . '" se rechaza', wabot_audio_mime_valido($m) === false);
}
caso('la extensión sale del mime, sin el sufijo de codecs', wabot_audio_extension('audio/ogg; codecs=opus') === 'ogg');
caso('mp4 → m4a', wabot_audio_extension('audio/mp4') === 'm4a');
caso('un mime que no se manda no tiene extensión', wabot_audio_extension('audio/webm') === '');

$GLOBALS['WABOT_TEST_MEDIA_SUBIDA'] = [];
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$mediaId = wabot_wa_media_subir('bytes-de-audio', 'audio/mp4', 'nota.m4a');
caso('subir el audio devuelve un media_id', $mediaId !== null && $mediaId !== '');
caso('y registra el mime y el peso reales',
    ($GLOBALS['WABOT_TEST_MEDIA_SUBIDA'][0]['mime'] ?? '') === 'audio/mp4'
    && ($GLOBALS['WABOT_TEST_MEDIA_SUBIDA'][0]['bytes'] ?? 0) === strlen('bytes-de-audio'));
caso('mandar el audio con ese id sale bien', wabot_wa_send_audio('5491111111111', $mediaId) === true);
caso('el tope de 16 MB es el que documenta WhatsApp', WABOT_AUDIO_MAX_BYTES === 16 * 1024 * 1024);

echo "— La seña que se dice es la del tipo ya cotizado, no las 6 juntas —\n";

foreach ([
    ['landing', '$60.000'], ['catalogo', '$60.000'], ['turnos', '$80.000'],
    ['institucional', '$80.000'], ['inmobiliaria', '$80.000'],
    ['ecommerce', '$90.000'], ['elearning', '$90.000'],
] as $par) {
    list($tipo, $sena) = $par;
    $texto = wabot_texto_pago(['tipo' => $tipo, 'precio_dado' => true], $cfg);
    // "seña de $X", no el monto suelto: una cuota de otro tipo puede coincidir
    // en número con la seña de este (ej. turnos cotiza 6 cuotas de $60.000,
    // que es justo la seña de landing) sin que sea el dato equivocado.
    caso("$tipo cotizado → la seña dice $sena y ninguna otra", strpos($texto, 'seña de ' . $sena) !== false);
    $otras = array_diff(['$60.000', '$80.000', '$90.000'], [$sena]);
    foreach ($otras as $otraSena) {
        caso("$tipo cotizado → NO menciona la seña de otro tipo ($otraSena)", strpos($texto, 'seña de ' . $otraSena) === false);
    }
}
caso('sin tipo cotizado todavía, la seña es la genérica con los 3 montos',
    wabot_texto_pago(['tipo' => null], $cfg) === $cfg['info']['pago_generico']);

echo "— Las cuotas que se dicen son las del tipo ya cotizado —\n";

// Recalculadas el 22-ago con el CFT real de Mercado Pago (125%): el checkout
// devolvió $320.000 → 12x $40.269,33, y las viejas estaban ~25% por encima.
// El catálogo ya no tiene cuotas de lista: su total depende de los productos.
$cuotasPorTipo = [
    'landing'       => ['12' => '$25.168', '6' => '$41.947', '3' => '$76.197'],
    'turnos'        => ['12' => '$31.460', '6' => '$52.434', '3' => '$95.246'],
    'institucional' => ['12' => '$31.460', '6' => '$52.434', '3' => '$95.246'],
    'inmobiliaria'  => ['12' => '$36.494', '6' => '$60.823', '3' => '$110.485'],
    'ecommerce'     => ['12' => '$40.269', '6' => '$67.115', '3' => '$121.915'],
    'elearning'     => ['12' => '$40.269', '6' => '$67.115', '3' => '$121.915'],
];
caso('la cuota de 12 de ecommerce es la que devuelve el checkout real de Mercado Pago',
    ($cfg['tipos']['ecommerce']['cuotas']['12'] ?? '') === '$40.269');
foreach ($cuotasPorTipo as $tipo => $cuotas) {
    $texto = wabot_texto_pago(['tipo' => $tipo, 'precio_dado' => true], $cfg);
    caso("$tipo cotizado → 12 cuotas de {$cuotas['12']}", strpos($texto, '12 cuotas de ' . $cuotas['12']) !== false);
    caso("$tipo cotizado → 6 de {$cuotas['6']}", strpos($texto, '6 de ' . $cuotas['6']) !== false);
    caso("$tipo cotizado → 3 de {$cuotas['3']}", strpos($texto, '3 de ' . $cuotas['3']) !== false);
}
caso('landing NO lleva las cuotas de ecommerce (montos de otro tipo)',
    strpos(wabot_texto_pago(['tipo' => 'landing', 'precio_dado' => true], $cfg), '$50.000') === false);
caso('sin tipo cotizado, la genérica no inventa montos de cuota',
    strpos(wabot_texto_pago(['tipo' => null], $cfg), 'cuotas de $') === false);
caso('la respuesta de pago del tipo cotizado arranca con el precio total',
    strpos(wabot_texto_pago(['tipo' => 'landing', 'precio_dado' => true], $cfg), '$200.000') !== false);
caso('con tipo puesto pero SIN precio dado (catálogo preguntando cantidad), la seña es la genérica',
    wabot_texto_pago(['tipo' => 'catalogo'], $cfg) === $cfg['info']['pago_generico']);
caso('el pago del catálogo cotizado usa el total calculado, no las cuotas de la base',
    strpos(wabot_texto_pago(['tipo' => 'catalogo', 'precio_dado' => true, 'productos_cantidad' => 100], $cfg), '$250.000') !== false
    && strpos(wabot_texto_pago(['tipo' => 'catalogo', 'precio_dado' => true, 'productos_cantidad' => 100], $cfg), '$32.000') === false);
caso('institucional ya no promete panel propio: eso es solo de ecommerce, elearning e inmobiliaria',
    stripos($cfg['tipos']['institucional']['desc'], 'panel') === false);
caso('la respuesta sobre quién carga el contenido nombra las 3 excepciones con panel',
    stripos($cfg['info']['carga'], 'ecommerce') !== false && stripos($cfg['info']['carga'], 'inmobiliaria') !== false
    && stripos($cfg['info']['carga'], 'cursos') !== false);
caso('y aclara que el resto no incluye editar el contenido o el diseño',
    stripos($cfg['info']['carga'], 'no incluye') !== false);

echo "— Una objeción no repite el discurso completo la segunda vez —\n";

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'ecommerce';
clasifica(['objecion_pensarlo']);
$r1 = wabot_engine('lo tengo que pensar', $c, $cfg);
caso('la primera vez, el discurso completo (explica + ofrece la demo)', $r1 === [$cfg['pensarlo']]);
$r2 = wabot_engine('igual necesito pensarlo un poco más', $c, $cfg);
caso('la segunda vez, un reconocimiento corto — no el mismo discurso de nuevo',
    $r2 === [$cfg['objecion_repetida']] && $r2 !== $r1);
$r3 = wabot_engine('perdon, insisto, lo pienso', $c, $cfg);
caso('la tercera vez también corto, no vuelve a repetir el completo', $r3 === [$cfg['objecion_repetida']]);

$c2 = conv_nueva(); $c2['fase'] = 'precio'; $c2['tipo'] = 'landing';
clasifica(['objecion_caro']);
$rc1 = wabot_engine('me parece caro', $c2, $cfg);
caso('objecion_caro también lleva el completo la primera vez', $rc1[0] === $cfg['caro']);
clasifica(['objecion_pensarlo']);
$rp1 = wabot_engine('lo tengo que pensar', $c2, $cfg);
caso('una objeción DISTINTA en la misma charla no se ve afectada por el guard de la otra',
    $rp1 === [$cfg['pensarlo']]);

echo "— Nunca se cierra un prediseño sin haber dado un precio antes —\n";

$cSinPrecio = conv_nueva();
caso('una conversación nueva arranca sin precio dado', empty($cSinPrecio['precio_dado']));
$cSinPrecio['tipo'] = 'ecommerce';
caso('poner el tipo a mano no marca que se dio el precio', empty($cSinPrecio['precio_dado']));
wabot_precio('ecommerce', $cSinPrecio, $cfg);
caso('recién wabot_precio() lo marca', $cSinPrecio['precio_dado'] === true);

$cCatalogo = conv_nueva();
wabot_catalogo_preguntar($cCatalogo, $cfg);
caso('preguntar cuántos productos (catálogo) todavía NO cuenta como precio dado',
    $cCatalogo['tipo'] === 'catalogo' && empty($cCatalogo['precio_dado']));
wabot_catalogo_cotizar(20, $cCatalogo, $cfg);
caso('recién al cotizar con la cantidad queda marcado', $cCatalogo['precio_dado'] === true);

$cReset = conv_nueva();
$cReset['precio_dado'] = true; $cReset['ultimo_ts'] = time() - 30 * 86400; $cReset['tipo'] = 'landing';
wabot_conv_reset_si_vieja($cReset, $cfg);
caso('una charla vieja que se reinicia también borra que ya se había dado el precio',
    empty($cReset['precio_dado']));

echo "— La pregunta genérica \"contame qué vendés\" tampoco se repite —\n";

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['otro']);
$r1 = wabot_engine('algo raro que no entiende', $c, $cfg);
caso('primera vez sin entender → la pregunta original', $r1 === [$cfg['contame']]);
$r2 = wabot_engine('sigo sin decir nada claro', $c, $cfg);
caso('segunda vez → reformulada, no la misma de antes', $r2 === [$cfg['contame_2']] && $r2 !== $r1);
$r3 = wabot_engine('tercera vez que no entiende', $c, $cfg);
caso('tercera vez → escala, no una tercera repregunta', $c['fase'] === 'derivado');

echo "— Nunca dos mensajes seguidos con el texto idéntico —\n";

caso('dedup: dos líneas iguales seguidas → queda una sola',
    wabot_sin_repetidos_consecutivos(['hola', 'hola']) === ['hola']);
caso('dedup: tres iguales seguidas → una sola',
    wabot_sin_repetidos_consecutivos(['x', 'x', 'x']) === ['x']);
caso('dedup: iguales pero NO consecutivas se conservan las dos',
    wabot_sin_repetidos_consecutivos(['a', 'b', 'a']) === ['a', 'b', 'a']);
caso('dedup: sin repetidos, no toca nada',
    wabot_sin_repetidos_consecutivos(['uno', 'dos', 'tres']) === ['uno', 'dos', 'tres']);
caso('dedup: lista vacía no rompe', wabot_sin_repetidos_consecutivos([]) === []);
caso('dedup: un solo elemento se mantiene', wabot_sin_repetidos_consecutivos(['solo']) === ['solo']);

echo "— Agenda, nombre comercial y fecha de inicio —\n";

caso('detecta una marca presentada explícitamente',
    wabot_nombre_negocio_detectar('Mi marca se llama Glow Nails y quiero una tienda online') === 'Glow Nails');
caso('detecta el nombre en una presentación corta',
    wabot_nombre_negocio_detectar('Somos Mate Sur') === 'Mate Sur');
caso('no inventa una marca a partir del rubro',
    wabot_nombre_negocio_detectar('Tengo una panadería y vendo facturas') === '');
caso('no toma una descripción genérica como nombre comercial',
    wabot_nombre_negocio_detectar('Somos una empresa de limpieza') === '');

$agenda = ['nombre_negocio' => 'Mate Sur', 'nombre' => 'Marcos Pérez'];
caso('agenda como Negocio - Persona cuando tiene los dos datos',
    wabot_nombre_agenda($agenda) === 'Mate Sur - Marcos Pérez');
caso('si solo conoce a la persona, no agrega separadores vacíos',
    wabot_nombre_agenda(['nombre' => 'Marcos Pérez']) === 'Marcos Pérez');
caso('si negocio y perfil tienen el mismo nombre, no lo duplica',
    wabot_nombre_agenda(['nombre_negocio' => 'Glow Nails', 'nombre' => 'Glow Nails']) === 'Glow Nails');

$inicioChat = ['chat_started_ts' => 0, 'transcript' => []];
wabot_conv_transcript($inicioChat, 'cliente', 'Hola');
$primerInicio = $inicioChat['chat_started_ts'];
wabot_conv_transcript($inicioChat, 'bot', 'Hola, cómo estás?');
caso('el primer mensaje del cliente fija la fecha de inicio del chat',
    $primerInicio > 0 && $inicioChat['chat_started_ts'] === $primerInicio);
$inicioChat['chat_started_ts'] = 123456;
wabot_conv_transcript($inicioChat, 'cliente', 'Volví');
caso('la fecha de inicio no cambia con mensajes posteriores', $inicioChat['chat_started_ts'] === 123456);

echo "— Qué falta pedir para el prediseño —\n";

$cfgPredis = wabot_config_load();

caso('sin nada conocido, pide las tres cosas',
    wabot_prediseno_faltan(['nombre_negocio' => '', 'descripcion' => '', 'colores' => '']) === [
        'El nombre de tu negocio', 'Una descripción breve de lo que ofrecés', 'Los colores de tu marca',
    ]);
caso('lo que ya se sabe no se vuelve a pedir',
    wabot_prediseno_faltan(['nombre_negocio' => 'Mate Sur', 'descripcion' => '', 'colores' => 'marrón']) === [
        'Una descripción breve de lo que ofrecés',
    ]);
caso('con las tres cosas ya sabidas, no falta nada',
    wabot_prediseno_faltan(['nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates', 'colores' => 'marrón']) === []);

$textoConFaltantes = wabot_prediseno_texto(['nombre_negocio' => '', 'descripcion' => '', 'colores' => ''], $cfgPredis);
caso('el texto lista lo que falta con saltos de línea reales',
    strpos($textoConFaltantes, "- El nombre de tu negocio\n- Una descripción breve de lo que ofrecés\n- Los colores de tu marca") !== false);

$textoSinFaltantes = wabot_prediseno_texto(['nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates', 'colores' => 'marrón'], $cfgPredis);
caso('si ya se sabe todo, el texto no lista nada',
    strpos($textoSinFaltantes, 'con lo que ya tengo alcanza') !== false);

echo "— Regresiones comerciales reales —\n";

$c = conv_nueva();
$c['session_started_ts'] = time() - 30;
$c['transcript'] = [
    ['q'=>'cliente','t'=>'Vendo zapatillas','ts'=>time()-20],
    ['q'=>'bot','t'=>'Querés vender online o mostrar el catálogo y que te escriban?','ts'=>time()-15],
    ['q'=>'cliente','t'=>'Catálogo y WhatsApp','ts'=>time()-5],
];
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () { return null; };
$r = wabot_engine('Catálogo y WhatsApp', $c, $cfg);
caso('si falla la IA, recuerda que Gabriela vende zapatillas y avanza al catálogo',
    $c['fase'] === 'catalogo_cantidad'
    && $r === [$cfg['catalogo_cantidad']]
    && stripos($r[0], 'qué vend') === false);

$c = conv_nueva();
$c['session_started_ts'] = time() - 20;
$c['transcript'] = [[
    'q'=>'cliente',
    't'=>'Tengo un negocio de entrenamiento. Quiero WhatsApp y compra online de rutinas personalizadas; más adelante, suplementos.',
    'ts'=>time()-5,
]];
$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () { return null; };
$r = wabot_engine($c['transcript'][0]['t'], $c, $cfg);
caso('si Lucas ya explicó el negocio, pide definir el objetivo y no vuelve a preguntar qué vende',
    $r === [$cfg['aclarar_objetivo']] && stripos($r[0], 'qué vend') === false);

$c = conv_nueva();
clasifica(['rubro_hibrido']);
$r = wabot_engine('Es de cortinas y toldos', $c, $cfg);
caso('cortinas y toldos abre una sola pregunta de diagnóstico antes de cotizar',
    $r === [$cfg['desempate_hibrido']]
    && $c['fase'] === 'desempate_hibrido'
    && empty($c['precio_dado']));
clasifica(['hibrido_catalogo']);
$r = wabot_engine('Quiero mostrar modelos en catálogo y recibir consultas por WhatsApp', $c, $cfg);
caso('la respuesta de diagnóstico recién entonces clasifica como catálogo',
    $r === [$cfg['catalogo_cantidad']] && $c['fase'] === 'catalogo_cantidad');

$c = conv_nueva();
$c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['cta_muestra'] = true;
clasifica(['pensarlo']);
$r = wabot_engine('Por el momento estaba preguntando, más adelante me comunico', $c, $cfg);
caso('una señal explícita de “solo averiguo” cierra sin insistir con la muestra',
    count($r) === 1
    && stripos($r[0], 'muestra') === false
    && !empty($c['seguimiento_bloqueado'])
    && ($c['seguimiento_estado'] ?? '') === 'bloqueado');
caso('el cierre suave también impide el seguimiento automático',
    !wabot_seguimiento_corresponde($c, $cfg, time() + 86400));

$c = conv_nueva();
$c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['cta_muestra'] = false;
$c['session_started_ts'] = time() - 30;
$c['transcript'] = [[
    'q'=>'bot',
    't'=>'Siempre ofrecemos un prediseño gratis de la web, para que veas cómo quedaría antes de decidir nada. Querés que te armemos uno?',
    'ts'=>time()-20,
]];
clasifica(['pregunta_info'], ['info_keys'=>['hosting']]);
$r = wabot_engine('Después de un año de hosting y dominio gratis, cuánto se paga y cada cuánto?', $c, $cfg);
caso('hosting explica la renovación anual y evita repetir la oferta de demo',
    count($r) === 1
    && stripos($r[0], 'una vez al año') !== false
    && stripos($r[0], 'antes del vencimiento') !== false
    && stripos($r[0], 'demo') === false
    && !empty($c['cta_muestra']));

$variantesPrecio = [];
for ($i = 1; $i <= 15; $i++) {
    $cv = conv_nueva();
    $cv['conversation_key'] = 'VARIANTE-' . $i;
    $cv['session_id'] = 'SESION-' . $i;
    $cv['chat_started_ts'] = 1000 + $i;
    $variantesPrecio[] = wabot_msg_precio_texto('landing', $cfg, $cv);
}
caso('los mensajes comerciales tienen variantes naturales sin perder precio ni enlace',
    count(array_unique($variantesPrecio)) >= 3
    && count(array_filter($variantesPrecio, function ($t) {
        return strpos($t, '$200.000') !== false && strpos($t, 'presupuestos/Landing') !== false;
    })) === count($variantesPrecio));

echo "— El cierre sin presión ya no despide a un cliente que está comprando —\n";

caso('"no quiero vender, solo recibir consultas" contesta un desempate, no es una despedida',
    wabot_cierre_sin_presion_tipo('no quiero vender, solo recibir consultas') === null);
caso('"solo vendo por instagram, queria consultar por una web" tampoco cierra',
    wabot_cierre_sin_presion_tipo('solo vendo por instagram, queria consultar por una web') === null);
caso('"por ahora solo estoy consultando precios, me pasas el de una landing?" pide una cotización',
    wabot_cierre_sin_presion_tipo('por ahora solo estoy consultando precios, me pasas el de una landing?') === null);
caso('"hola, no tengo presupuesto todavia, me pasas uno?" pide la cotización, no dice que no tiene plata',
    wabot_cierre_sin_presion_tipo('hola, no tengo presupuesto todavia, me pasas uno?') === null);
caso('"estoy averiguando nomas" sí es un cierre suave',
    wabot_cierre_sin_presion_tipo('estoy averiguando nomas') === 'consulta');
caso('"la verdad no tengo plata ahora" sigue cerrando',
    wabot_cierre_sin_presion_tipo('no tengo plata ahora') === 'consulta');
caso('"no me interesa" sigue siendo rechazo', wabot_cierre_sin_presion_tipo('no me interesa') === 'rechazo');
caso('"no me interesa vender online" NO es rechazo: elige la otra opción del desempate',
    wabot_cierre_sin_presion_tipo('no me interesa vender online') === null);
caso('"borrame, no quiero recibir mas mensajes" es un pedido de baja',
    wabot_cierre_sin_presion_tipo('borrame, no quiero recibir mas mensajes') === 'baja');

$c = conv_nueva();
clasifica(['otro']);
$r = wabot_engine('no me escriban mas por favor, quiero darme de baja', $c, $cfg);
caso('la baja contesta una línea, apaga el bot y bloquea el seguimiento',
    $r === [$cfg['baja']] && $c['bot_off'] === true && $c['seguimiento_bloqueado'] === true && $c['cierre'] === 'baja');

echo "— El regateo es un comprador, no una despedida —\n";

caso('"no hay forma de que me lo dejes en 150?" es regateo', wabot_es_regateo('no hay forma de que me lo dejes en 150?') === true);
caso('"dale, si me haces 10 por ciento de descuento cierro ya" es regateo',
    wabot_es_regateo('dale, si me haces 10 por ciento de descuento cierro ya') === true);
caso('"me parece caro" solo, no es regateo', wabot_es_regateo('me parece caro') === false);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['chat_started_ts'] = time();
clasifica(['otro']);
$r = wabot_engine('no hay forma de que me lo dejes en 150?', $c, $cfg);
caso('el primer regateo recibe la respuesta oficial de precio, sin bajar el monto',
    $r === [$cfg['caro']] && $c['fase'] === 'precio');
$r = wabot_engine('dale, si me haces 10 por ciento de descuento cierro ya mismo', $c, $cfg);
caso('el regateo insistente va a Pablo, nunca a la despedida',
    $r === [$cfg['derivar']] && $c['fase'] === 'derivado' && !empty($c['handoff_pendiente']));

echo "— Un precio adentro de la respuesta no es una cantidad de productos —\n";

caso('"son 30 productos de \$2000" cotiza 30', wabot_extraer_cantidad_productos('son 30 productos de $2000') === 30);
caso('"tengo 20 productos, cada uno sale 500 pesos" cotiza 20',
    wabot_extraer_cantidad_productos('tengo 20 productos, cada uno sale 500 pesos') === 20);
caso('"unos 40" sigue andando', wabot_extraer_cantidad_productos('unos 40') === 40);
caso('"40 articulos mas o menos" también', wabot_extraer_cantidad_productos('40 articulos mas o menos') === 40);

echo "— Las palabras de info ya no matchean adentro de otras palabras —\n";

caso('"soy disenadora de indumentaria" no es una pregunta de pago',
    wabot_info_por_palabras('soy diseñadora de indumentaria') === null);
caso('"doy clases de ensenanza de ingles" tampoco',
    wabot_info_por_palabras('doy clases de enseñanza de inglés') === null);
caso('"quiero el ecommerce completo" no es una pregunta de hosting',
    wabot_info_por_palabras('quiero el ecommerce completo') === null);
caso('"hago redes de proteccion para balcones" no es marketing',
    wabot_info_por_palabras('hago redes de proteccion para balcones') === null);
caso('"cuanto sale?" en fase precio pide el precio ya cotizado',
    wabot_info_por_palabras('cuanto sale?', 'precio') === 'precio_actual');
caso('"cual era el precio total?" en fase precio también',
    wabot_info_por_palabras('cual era el precio total?', 'precio') === 'precio_actual');
caso('"cuanto sale una pagina?" al arrancar pregunta el tipo, no se escapa',
    wabot_info_por_palabras('cuanto sale una pagina?', 'nuevo') === 'precio_sin_rubro');
caso('"Que precio tiene" también (caso Abel)',
    wabot_info_por_palabras('Que precio tiene', 'nuevo') === 'precio_sin_rubro');
caso('y ese texto le pregunta para qué la necesita',
    stripos((string)$cfg['info']['precio_sin_rubro'], 'para qué la querés') !== false
    || stripos((string)$cfg['info']['precio_sin_rubro'], 'contame') !== false);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['cta_muestra'] = true;
clasifica(['otro']);
$r = wabot_engine('perdon, cual era el precio total?', $c, $cfg);
caso('"cual era el precio total" repite el TOTAL, no las cuotas solas',
    count($r) === 1 && strpos($r[0], '$200.000') !== false && strpos($r[0], '$32.000') === false);

echo "— Un taller mecánico no es un curso —\n";

caso('"tengo un taller mecanico y vendemos repuestos" no deriva por productos_y_cursos',
    wabot_handoff_causa_explicita('tengo un taller mecanico y vendemos repuestos') === null);
caso('"doy talleres de costura online y vendo ropa" sí combina productos y cursos',
    wabot_handoff_causa_explicita('doy talleres de costura online y vendo ropa') === 'productos_y_cursos');
caso('"soy nutricionista" ahora dispara el desempate de turnos en el respaldo local',
    wabot_fallback_rubro_local('soy nutricionista') === 'turnos_pendiente');
caso('"soy manicura" también', wabot_fallback_rubro_local('soy manicura') === 'turnos_pendiente');

echo "— Negativas y referencias con muletillas reales —\n";

caso('"nop no tengo" cuenta como sin referencia', wabot_es_negativa('nop no tengo') === true);
caso('"la vdd no" también', wabot_es_negativa('la vdd no') === true);
caso('"me gusta la de nike" NO es negativa', wabot_es_negativa('me gusta la de nike') === false);
caso('"ya te la mande recien, fijate mas arriba en el chat" apunta a lo ya dicho',
    wabot_apunta_a_lo_ya_dicho('ya te la mande recien, fijate mas arriba en el chat') === true);
caso('"elegi vos los colores" es delegar, no ambigüedad', wabot_es_delegacion('elegi vos los colores') === true);

$c = conv_nueva(); $c['fase'] = 'prediseno'; $c['tipo'] = 'landing'; $c['descripcion'] = 'plomero';
clasifica(['otro']);
$r = wabot_engine('elegi vos los colores, cualquiera me da igual', $c, $cfg);
caso('delegar los colores avanza a la referencia en vez de loopear',
    $c['colores'] === 'A elección del diseñador' && $c['fase'] === 'prediseno_ref' && $r === [$cfg['prediseno_referencia']]);

echo "— Volver a preguntar el precio no re-pega el bloque completo —\n";

$c = conv_nueva(); $c['chat_started_ts'] = time();
clasifica(['rubro_landing']);
$r1 = wabot_engine('soy gasista', $c, $cfg);
caso('la primera cotización sale completa en dos globos', count($r1) === 2 && strpos($r1[0], '$200.000') !== false);
clasifica(['otro']);
$r2 = wabot_engine('cuanto sale?', $c, $cfg);
caso('la re-cotización del mismo tipo es UN resumen corto con el total',
    count($r2) === 1 && strpos($r2[0], '$200.000') !== false && $r2[0] !== $r1[0]);
$rq = wabot_precio('landing', $c, $cfg);
caso('wabot_precio del mismo tipo ya cotizado devuelve el resumen, no re-pega el bloque',
    count($rq) === 1 && strpos($rq[0], '$200.000') !== false && $rq[0] !== $r1[0]);

echo "— Después de un cierre, un gracias no reabre el pitch —\n";

$c = conv_nueva(); $c['fase'] = 'prediseno'; $c['tipo'] = 'landing';
clasifica(['no_interesa']);
$r = wabot_engine('sabes que no, no me interesa', $c, $cfg);
caso('el rechazo cierra cordial', $r === [$cfg['no_interesa']] && $c['cierre'] === 'sin_interes');
clasifica(['saludo']);
$r = wabot_engine('gracias igual', $c, $cfg);
caso('el gracias posterior queda en silencio, no re-manda el pitch', $r === []);
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$r = wabot_engine('cuanto tardan en general?', $c, $cfg);
caso('pero una duda concreta sí se contesta', $r === [$cfg['info']['plazos']]);
clasifica(['rubro_comercio']);
$r = wabot_engine('che al final tengo una ferreteria y quiero la web', $c, $cfg);
caso('un rubro nuevo reabre la venta', $r !== [] && $c['seguimiento_bloqueado'] === false);

echo "— El reset de sesión limpia el archivado —\n";

$c = conv_nueva(); $c['archivado'] = true; $c['ultimo_ts'] = time() - 10 * 86400; $c['fase'] = 'derivado';
wabot_conv_reset_si_vieja($c, $cfg, time());
caso('una charla archivada que vuelve a los 10 días reaparece en el panel', $c['archivado'] === false);

echo "— Parte 1: sin seña, sin montos de cuota y sin el nombre de Pablo —\n";

foreach (array_merge([$cfg['msg_precio']], $cfg['msg_precio_variantes'],
                     [$cfg['msg_precio_catalogo']], $cfg['msg_precio_catalogo_variantes']) as $i => $plantilla) {
    caso("la plantilla de precio #$i no menciona la seña", strpos($plantilla, '{sena}') === false);
    caso("la plantilla de precio #$i deja el link en su propio renglón", strpos($plantilla, "\n") !== false);
}
caso('el mensaje de precio sí menciona que hay hasta 12 cuotas',
    stripos(wabot_msg_precio_texto('landing', $cfg), '12 cuotas') !== false);
caso('pero NO dice el monto de cada cuota',
    strpos(wabot_msg_precio_texto('landing', $cfg), '$25.168') === false);
caso('el resumen de precio tampoco adelanta la seña',
    strpos((string)$cfg['precio_resumen'], '{sena}') === false);

foreach (['derivar', 'espera', 'espera_prediseno', 'sistema_whatsapp', 'sistema_cierre'] as $clave) {
    caso("el texto \"$clave\" de la parte 1 no nombra a Pablo", stripos((string)$cfg[$clave], 'pablo') === false);
}
foreach (['otra', 'reuniones'] as $clave) {
    caso("info.$clave no nombra a Pablo", stripos((string)$cfg['info'][$clave], 'pablo') === false);
}
// Tampoco "el equipo": es una sola persona y suena a call center. Se lo nombra
// por el rol hasta que aparece el nombre propio en la videollamada.
foreach (['derivar', 'espera', 'espera_prediseno', 'sistema_whatsapp'] as $clave) {
    caso("el texto \"$clave\" ya no dice \"el equipo\"", stripos((string)$cfg[$clave], 'el equipo') === false);
}
foreach (['otra', 'reuniones'] as $clave) {
    caso("info.$clave tampoco dice \"el equipo\"", stripos((string)$cfg['info'][$clave], 'el equipo') === false);
}
caso('la respuesta de último recurso ahora manda la duda al desarrollador',
    stripos((string)$cfg['info']['otra'], 'el desarrollador') !== false);
caso('y la derivación también', stripos((string)$cfg['derivar'], 'el desarrollador') !== false);
caso('el único texto que nombra a Pablo es la videollamada de la parte 2',
    stripos((string)$cfg['postdemo_videollamada'], 'pablo') !== false);

// Si el cliente pregunta explícitamente cómo se paga, ahí sí va todo.
$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('cuanto es la seña?', $c, $cfg);
caso('preguntar por la seña sí la responde, con el monto y las cuotas reales',
    strpos($r[0], '$60.000') !== false && strpos($r[0], '$25.168') !== false);

echo "— Parte 2: la demo presentada reactiva el bot para cerrar —\n";

$cPost = conv_nueva();
$cPost['fase'] = 'postdemo'; $cPost['tipo'] = 'ecommerce'; $cPost['precio_dado'] = true;
$cPost['presentado_ts'] = time(); $cPost['presentado_slug'] = 'tiendaana';

caso('los datos de transferencia traen seña, alias y titular',
    strpos(wabot_postdemo_transferencia($cPost, $cfg), '$90.000') !== false
    && strpos(wabot_postdemo_transferencia($cPost, $cfg), 'pablotravis') !== false
    && stripos(wabot_postdemo_transferencia($cPost, $cfg), 'PABLO TRAVI') !== false);
caso('y siempre ofrecen la tarjeta como alternativa',
    stripos(wabot_postdemo_transferencia($cPost, $cfg), 'tarjeta') !== false);
caso('el link de tarjeta se arma con el monto de la seña, no con el total',
    strpos(wabot_postdemo_link_tarjeta($cPost, $cfg), 'gokywebs.com/pago?monto=90000') !== false
    && strpos(wabot_postdemo_link_tarjeta($cPost, $cfg), '320000') === false);

$cLanding = conv_nueva(); $cLanding['tipo'] = 'landing';
caso('cada tipo arma su propio link', strpos(wabot_postdemo_link_tarjeta($cLanding, $cfg), 'monto=60000') !== false);

caso('"ya te transferí" se detecta', wabot_dice_que_pago('listo, ya te transferi') === true);
caso('"te mando el comprobante" también', wabot_dice_que_pago('te mando el comprobante') === true);
caso('"cuando transfiero?" NO es un aviso de pago', wabot_dice_que_pago('cuando tengo que transferir?') === false);
caso('"prefiero con tarjeta" se detecta', wabot_prefiere_tarjeta('prefiero pagar con tarjeta') === true);
caso('"pasame el link" también', wabot_prefiere_tarjeta('pasame el link de pago') === true);

$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'ecommerce'; $c['precio_dado'] = true;
clasifica(['otro']);
$r = wabot_engine('me gusto mucho, como sigo?', $c, $cfg);
caso('querer avanzar tras la demo devuelve los datos para transferir',
    strpos($r[0], 'pablotravis') !== false && $c['fase'] === 'postdemo');

clasifica(['otro']);
$r = wabot_engine('prefiero con tarjeta', $c, $cfg);
caso('pedir tarjeta devuelve el link armado', strpos($r[0], 'pago?monto=90000') !== false);

clasifica(['otro']);
$r = wabot_engine('ya te transferi la seña', $c, $cfg);
caso('avisar el pago cierra y deriva para verificar',
    $c['fase'] === 'derivado' && !empty($c['handoff_pendiente']) && $c['presentado_confirmado'] === true);

$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['otro']);
$r = wabot_engine('mmm no se, lo tengo que pensar bien', $c, $cfg);
caso('ante la duda ofrece la videollamada con Pablo',
    stripos($r[0], 'pablo') !== false && stripos($r[0], 'videollamada') !== false
    && $c['videollamada_ofrecida'] === true);

clasifica(['otro']);
$r = wabot_engine('mmm sigo sin estar seguro', $c, $cfg);
caso('no repite la videollamada dos veces', stripos(implode(' ', $r), 'videollamada') === false);

caso('"como sigo?" tras la demo es querer avanzar', wabot_postdemo_quiere_avanzar('me gusto mucho, como sigo?') === true);
caso('"quiero avanzar" también', wabot_postdemo_quiere_avanzar('listo, quiero avanzar') === true);
caso('"lo tengo que pensar" NO es querer avanzar', wabot_postdemo_quiere_avanzar('lo tengo que pensar') === false);
caso('"lo tengo que pensar" sí es duda', wabot_postdemo_duda('lo tengo que pensar') === true);
caso('"y si no me gusta como queda?" es duda', wabot_postdemo_duda('y si no me gusta como queda?') === true);
caso('"me encanto" no es duda', wabot_postdemo_duda('me encanto la demo') === false);

// Un mensaje neutro no dispara la videollamada: solo pregunta qué le pareció.
$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['saludo']);
$r = wabot_engine('hola', $c, $cfg);
caso('un saludo tras la demo no quema la videollamada', empty($c['videollamada_ofrecida']));

// La demo presentada NO deja mudo al bot: esa era la razón por la que la parte 2
// no existía (presentar pausaba el chat 24 h).
$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
$c['pausado_hasta'] = 0;
caso('tras presentar la demo el bot queda activo, no pausado', (int)$c['pausado_hasta'] === 0);

echo "— Parte 2: datos bancarios completos, cuotas sin interés y \"la voy a mirar\" —\n";

$cPost = conv_nueva(); $cPost['fase'] = 'postdemo'; $cPost['tipo'] = 'ecommerce'; $cPost['precio_dado'] = true;
$transfer = wabot_postdemo_transferencia($cPost, $cfg);
foreach (['0720071788000003618268' => 'el CBU', 'pablotravis' => 'el alias',
          'PABLO TRAVI' => 'el titular', '20-39148294-3' => 'el CUIT',
          'Santander' => 'el banco', '$90.000' => 'la seña'] as $dato => $que) {
    caso("los datos de transferencia traen $que", strpos($transfer, $dato) !== false);
}

// El bot ofrece la videollamada, pero el horario lo arregla Pablo: no pregunta
// día ni hora, porque después no tiene con qué confirmarlos.
caso('la videollamada no le pide al cliente un día ni un horario',
    !preg_match('/(qué|que) (día|dia|horario|hora)|cuándo te|decime .{0,20}(día|dia|horario)|te queda cómodo/iu',
        (string)$cfg['postdemo_videollamada']));
caso('y deja claro que el horario lo arregla Pablo',
    stripos((string)$cfg['postdemo_videollamada'], 'arreglan el horario') !== false);

caso('"es muy caro" tras la demo es objeción de plata', wabot_postdemo_objecion_plata('uh es muy caro para mi') === true);
caso('"no tengo la plata ahora" también', wabot_postdemo_objecion_plata('no tengo la plata ahora') === true);
caso('"me encanto" no lo es', wabot_postdemo_objecion_plata('me encanto') === false);

$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['otro']);
$r = wabot_engine('uh, es mucha plata para mi ahora', $c, $cfg);
caso('la objeción de plata ofrece las 3 cuotas sin interés',
    stripos($r[0], '3 cuotas sin interés') !== false && $c['cuotas_ofrecidas'] === true);
caso('y aclara que no hay link, que lo arma Pablo', stripos($r[0], 'pablo') !== false);
clasifica(['otro']);
$r = wabot_engine('igual sigue siendo caro', $c, $cfg);
caso('las 3 cuotas no se repiten', stripos(implode(' ', $r), '3 cuotas sin interés') === false);

caso('"dale, la voy a mirar" se detecta', wabot_postdemo_la_va_a_mirar('dale, la voy a mirar') === true);
caso('"ahora la miro y te digo" también', wabot_postdemo_la_va_a_mirar('ahora la miro y te digo') === true);
caso('"dejame que la vea tranquilo" también', wabot_postdemo_la_va_a_mirar('dejame que la vea tranquilo') === true);
caso('"ya la mire, me gusto" NO es eso', wabot_postdemo_la_va_a_mirar('ya la mire, me gusto') === false);

$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['otro']);
$r = wabot_engine('dale, la voy a mirar', $c, $cfg);
caso('"la voy a mirar" recibe UNA línea sin presión, sin pedir plata',
    count($r) === 1 && strpos($r[0], 'pablotravis') === false && stripos($r[0], 'tranquilidad') !== false);
caso('y no quema la videollamada ni las cuotas',
    empty($c['videollamada_ofrecida']) && empty($c['cuotas_ofrecidas']));

echo "— Presentadas 48hs: las que se enfriaron salen de la cola normal —\n";

$ahoraP = time();
$fria = ['presentado_ts' => $ahoraP - 49 * 3600, 'presentado_confirmado' => false,
         'transcript' => [['q' => 'humano', 't' => 'te mando la demo', 'ts' => $ahoraP - 49 * 3600]]];
caso('49 h sin que conteste una sola vez → Presentadas 48hs', wabot_conv_grupo($fria) === 'presentadas_48');
$contesto = $fria;
$contesto['transcript'][] = ['q' => 'cliente', 't' => 'dale la miro', 'ts' => $ahoraP - 40 * 3600];
caso('si contestó algo después de la demo, sigue en Presentados', wabot_conv_grupo($contesto) === 'presentados');
$reciente = $fria; $reciente['presentado_ts'] = $ahoraP - 10 * 3600;
$reciente['transcript'][0]['ts'] = $ahoraP - 10 * 3600;
caso('a las 10 h todavía no se enfría', wabot_conv_grupo($reciente) === 'presentados');
$confirmada = $fria; $confirmada['presentado_confirmado'] = true;
caso('una demo ya confirmada nunca cae ahí', wabot_conv_grupo($confirmada) !== 'presentadas_48');

echo "— El recordatorio entra en la ventana de 24 h de Meta —\n";

caso('el recordatorio se manda a las 20 h, no a las 48', (float)$cfg['presentados_recordatorio_horas'] <= 22);
$cfgViejo = $cfg; $cfgViejo['presentados_recordatorio_horas'] = 48;
$cvRec = ['presentado_ts' => $ahoraP - 21 * 3600, 'presentado_confirmado' => false,
          'presentado_recordatorio_enviado' => false, 'ultimo_cliente_ts' => $ahoraP - 21 * 3600,
          'bot_off' => false, 'archivado' => false, 'pausado_hasta' => 0,
          'transcript' => [['q' => 'cliente', 't' => 'dale', 'ts' => $ahoraP - 21 * 3600]]];
caso('con 20 h el recordatorio SÍ sale dentro de la ventana',
    wabot_presentado_recordatorio_corresponde($cvRec, $cfg, $ahoraP) === true);
caso('con las 48 h viejas caía fuera de la ventana y no salía nunca',
    wabot_presentado_recordatorio_corresponde($cvRec, $cfgViejo, $ahoraP) === false);

echo "— Revisión de chats reales del 22-ago —\n";

// Black Automotores: un perfil de WhatsApp llamado "." hacía que el bot
// escribiera "Listo ., con eso ya lo preparamos.".
caso('un nombre "." no se usa como nombre', wabot_nombre_usable('.') === '');
caso('ni un emoji suelto', wabot_nombre_usable('🔥') === '');
caso('ni un teléfono', wabot_nombre_usable('+54 9 11 2506-8578') === '');
caso('ni un mail', wabot_nombre_usable('juan@gmail.com') === '');
caso('un nombre real sí', wabot_nombre_usable('Marta Gómez') === 'Marta Gómez');
caso('el texto sale sin el hueco cuando el nombre no sirve',
    wabot_personalizar('Listo {nombre}, con eso ya lo preparamos.', ['nombre' => '.']) === 'Listo, con eso ya lo preparamos.');
caso('y con un nombre real usa el primero',
    wabot_personalizar('Listo {nombre}, con eso ya lo preparamos.', ['nombre' => 'Marta Gómez']) === 'Listo Marta, con eso ya lo preparamos.');
caso('la agenda no cuelga un "." del nombre del negocio',
    wabot_nombre_agenda(['nombre_negocio' => 'Black Automotores', 'nombre' => '.']) === 'Black Automotores');

// "Quiero publicar los vehículos" es una respuesta clara al desempate y el bot
// la repreguntaba.
caso('"quiero publicar los vehiculos" resuelve el desempate del comercio',
    wabot_desempate_por_palabras('desempate_comercio', 'Quiero publicar los vehiculos') === 'comercio_mostrar');
caso('"solo exhibir los modelos" también',
    wabot_desempate_por_palabras('desempate_comercio', 'solo exhibir los modelos') === 'comercio_mostrar');
caso('y "quiero cobrar online" sigue siendo vender',
    wabot_desempate_por_palabras('desempate_comercio', 'quiero cobrar online') === 'comercio_vender');

// Una asociación civil no es una empresa.
caso('el texto de institucional ya no habla de "la empresa"',
    stripos((string)$cfg['tipos']['institucional']['desc'], 'de la empresa') === false);

// De dónde somos / si hay oficina.
caso('"de donde son?" se reconoce', wabot_info_por_palabras('de donde son?') === 'ubicacion');
caso('"tienen oficina?" también', wabot_info_por_palabras('tienen oficina para ir?') === 'ubicacion');
caso('la respuesta dice Tigre y que es remoto',
    stripos((string)$cfg['info']['ubicacion'], 'Tigre') !== false
    && stripos((string)$cfg['info']['ubicacion'], 'remota') !== false);

// Una descripción larga no se confunde con una pregunta de pago.
caso('"que paguen la suscripcion por mercado pago" dentro de una descripción NO es la pregunta de pago',
    wabot_info_por_palabras('necesito registro de socios, que paguen la suscripcion por mercado pago, un panel para ver los estados de cada uno y avisos automaticos por email') === null);
caso('pero "como se paga?" sigue andando', wabot_info_por_palabras('como se paga?') === 'pago');

// El chat completo viaja con el boceto.
$cChat = conv_nueva();
$cChat['transcript'] = [
    ['q' => 'cliente', 't' => 'hola, tengo una veterinaria', 'ts' => time() - 300],
    ['q' => 'bot',     't' => 'Perfecto, contame', 'ts' => time() - 290],
];
$txtChat = wabot_transcript_texto($cChat);
caso('el chat exportado trae quién dijo qué', strpos($txtChat, 'Cliente: hola, tengo una veterinaria') !== false
    && strpos($txtChat, 'Bot: Perfecto, contame') !== false);
$cLargo = conv_nueva();
$cLargo['transcript'] = [];
for ($i = 0; $i < 400; $i++) $cLargo['transcript'][] = ['q' => 'cliente', 't' => str_repeat('x', 60), 'ts' => time()];
caso('un chat larguísimo se recorta y conserva el final',
    mb_strlen(wabot_transcript_texto($cLargo)) <= 12100
    && strpos(wabot_transcript_texto($cLargo), 'charla recortada') !== false);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
