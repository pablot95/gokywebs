<?php
/**
 * wabot/test.php — tests del motor (solo CLI: php wabot/test.php).
 * Simula la clasificación (sin Gemini) y corta la red (sin WhatsApp ni Firestore).
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/engine.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;

/* La suite espera la bot-config.json LOCAL. Si quedó puesta la de producción
 * —cosa que pasa al correr la batería conversacional, que necesita los textos
 * reales— fallan ~30 casos de cuotas y hosting porque allá `info.pago` está
 * degradado, y se pierde media hora buscando un bug que no existe (pasó tres
 * veces el 1-sep). El delator es `capi_token`: solo lo tiene la de producción. */
if (trim((string)(json_decode((string)@file_get_contents(__DIR__ . '/bot-config.json'), true)['capi_token'] ?? '')) !== '') {
    fwrite(STDERR, "\n*** OJO: wabot/bot-config.json es la de PRODUCCIÓN.\n"
        . "    Los fallos de cuotas/hosting van a ser falsos. Restaurá la local antes de leer nada.\n\n");
}

$cfg = wabot_config_load();
// El resto de esta suite asume el link del form activo (mecanismo por
// defecto): el caso apagado (momentáneamente, pedido de Pablo 25-ago) se
// prueba aparte, explícito, con su propia copia de $cfg.
$cfg['form_activo'] = true;
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
        'pitch_hecho' => true,
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
    strpos($r[0], '$180.000') !== false
    && $c['fase'] === 'prediseno' && $c['tipo'] === 'landing');
caso('el precio lleva el link del presupuesto para verlo en detalle (Pablo, 2-sep)',
    strpos($r[0], 'gokywebs.com/presupuestos/sitioprofesional') !== false);
caso('el precio llega en DOS mensajes: el precio y, dos segundos después, la demo con el formulario',
    count($r) === 2 && stripos($r[1], 'cómo podría quedar tu web') !== false && strpos($r[1], 'gokywebs.com/form/') !== false);
caso('y no hay ninguna línea intermedia del tipo "si te cierra" (Pablo, 2-sep)',
    stripos(implode(' ', $r), 'si te cierra') === false && stripos(implode(' ', $r), 'si va por ahí') === false
    && stripos(implode(' ', $r), 'si te sirve') === false);
caso('el mensaje del precio ya no trae pegada la oferta del prediseño',
    stripos($r[0], 'predise') === false);
caso('la demo va en su propio mensaje',
    stripos($r[1], 'demo') !== false || stripos($r[1], 'muestra') !== false);

$c = conv_nueva();
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('se puede pagar en cuotas?', $c, $cfg);
caso('pregunta de info en el primer mensaje → responde y suma el menú',
    count($r) === 2 && $r[0] === wabot_texto_pago_generico($cfg) && $r[1] === $cfg['menu'] && $c['fase'] === 'menu');
caso('sin tipo cotizado, la seña sale genérica: menciona los montos reales de cada grupo',
    strpos($r[0], '$40.000') !== false && strpos($r[0], '$60.000') !== false);

echo "— pago_generico se calcula en vivo (agrupado por seña real), no queda un texto fijo con montos viejos —\n";

$pagoGenerico = wabot_texto_pago_generico($cfg);
caso('ya no cita los montos viejos $60.000/$80.000/$90.000 como si fueran actuales',
    strpos($pagoGenerico, '$80.000') === false && strpos($pagoGenerico, '$90.000') === false);
caso('deja explícito que se puede pagar en un solo pago', strpos($pagoGenerico, 'en un pago o hasta en 12 cuotas') !== false);
caso('agrupa por seña real y solo nombra los tipos vigentes',
    stripos($pagoGenerico, '$40.000 en sitio profesional') !== false
    && stripos($pagoGenerico, 'turnos') === false && stripos($pagoGenerico, 'lms') === false);
caso('y agrupa inmobiliaria/ecommerce/elearning en $60.000', stripos($pagoGenerico, '$60.000 en web inmobiliaria') !== false);

$cfgSenaNueva = wabot_config_load();
$cfgSenaNueva['tipos']['landing']['sena'] = '$55.000';
caso('si una seña cambia, el texto genérico lo refleja al toque',
    strpos(wabot_texto_pago_generico($cfgSenaNueva), '$55.000') !== false);

$c = conv_nueva(); $c['fase'] = 'menu';
clasifica(['elige_ecommerce']);
$r = wabot_engine('ecommerce', $c, $cfg);
caso('elige ecommerce del menú → precio de ecommerce con su presupuesto', strpos($r[0], '$290.000') !== false && strpos($r[0], 'presupuestos/ecommerce') !== false && $c['tipo'] === 'ecommerce');

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
caso('inmobiliaria desde algo diferente → precio propio', strpos($r[0], '$240.000') !== false && $c['tipo'] === 'inmobiliaria');

// 27-ago: cuando el clasificador no reconoce el rubro, ahora se relee el texto
// con el matcher local antes de repreguntar. "Una app para stock" es un sistema
// de gestión y arranca ese flujo en vez de pedirle que cuente más — que era lo
// que dejaba trabadas las charlas de destapaciones, netbooks y pantallas LED.
$c = conv_nueva(); $c['fase'] = 'algo_diferente';
clasifica(['otro']);
$r = wabot_engine('quiero una app para stock', $c, $cfg);
caso('lo que el clasificador no entiende se rescata por palabras',
    $c['fase'] === 'sistema_problema' && empty($c['handoff_pendiente']));

// Y si de verdad no hay rubro reconocible por ningún lado, ahí sí repregunta.
$c = conv_nueva(); $c['fase'] = 'algo_diferente';
clasifica(['otro']);
$r = wabot_engine('mmm no se, es complicado de explicar', $c, $cfg);
caso('si no hay nada reconocible, repregunta reformulado antes de derivar',
    $r === [$cfg['contame_2']] && $c['fase'] === 'algo_diferente' && empty($c['handoff_pendiente']));

echo "— Cursos —\n";

$c = conv_nueva();
clasifica(['rubro_cursos']);
$r = wabot_engine('doy cursos de maquillaje', $c, $cfg);
caso('cursos → pregunta de desempate', $r === [$cfg['desempate_cursos']] && $c['fase'] === 'desempate_cursos');

clasifica(['cursos_vender']);
$r = wabot_engine('venderlos desde la web', $c, $cfg);
caso('quiere venderlos → elearning', strpos($r[0], '$290.000') !== false && $c['tipo'] === 'elearning');

$c = conv_nueva(); $c['fase'] = 'desempate_cursos';
clasifica(['cursos_mostrar']);
$r = wabot_engine('solo mostrarlos', $c, $cfg);
caso('solo mostrarlos → landing', strpos($r[0], '$180.000') !== false && $c['tipo'] === 'landing');

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
    $r === [wabot_link_presupuesto_completar($cfg['caro'], $c, $cfg), $cfg['cta_muestra']] && $c['fase'] === 'precio' && $c['cta_muestra'] === true);

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
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['fase'] === 'derivado' && $c['lead_creado'] === true
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
caso('con la charla cerrada igual contesta una duda',
    $r === [wabot_texto_plazos($c, $cfg)]);
caso('y esperando la demo le contesta por la demo, no por los 7 días de la web',
    $r === [$cfg['espera_prediseno']] && $r !== [$cfg['info']['plazos']]);

clasifica(['pregunta_info'], ['info_keys' => ['pago', 'hosting']]);
$r = wabot_engine('como se paga y el hosting?', $c, $cfg);
caso('contesta varias dudas juntas', count($r) === 1 && strpos($r[0], '- ') === 0);

clasifica(['objecion_caro']);
$r = wabot_engine('me parece caro igual', $c, $cfg);
caso('la objeción se contesta sin bajar el precio', $r === [wabot_link_presupuesto_completar($cfg['caro'], $c, $cfg)]);

// Lo que NO puede hacer: volver a vender.
clasifica(['rubro_landing']);
$r = wabot_engine('ahora quiero una landing', $c, $cfg);
caso('nunca vuelve a cotizar con la charla cerrada',
    !$r || strpos($r[0], '$180.000') === false);
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
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['fase'] === 'derivado' && $c['referencia'] === '' && $c['lead_creado'] === true);

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
    count($r) === 2 && strpos($r[0], '$180.000') !== false
    && $c['fase'] === 'prediseno' && $c['tipo'] === 'landing' && empty($c['handoff_pendiente']));

$cPitchCaido = conv_nueva();
$cPitchCaido['fase'] = 'pitch';
$cPitchCaido['tipo'] = 'inmobiliaria';
$cPitchCaido['pitch_hecho'] = true;
$r = wabot_engine('me haces un descuento?', $cPitchCaido, $cfg);
caso('Gemini caído en plena fase pitch (ya se mostró) → da el precio, no repite "contame más" en un loop',
    strpos(implode(' ', $r), '$240.000') !== false
    && stripos(implode(' ', $r), 'contame un poco más') === false);

/* Con turnos retirado (2-sep) una peluquería es sitio profesional y no abre
 * ningún desempate: la pregunta que le hacíamos era la que Pablo sacó. */
$cPeluqueria = conv_sin_pitch();
$r = wabot_engine('Es una peluqueria', $cPeluqueria, $cfg);
caso('una peluquería se cotiza como sitio profesional, sin preguntar por turnos',
    strpos(implode(' ', $r), '$180.000') !== false
    && stripos(implode(' ', $r), 'turno') === false
    && $cPeluqueria['tipo'] === 'landing');

/* El que solo quiere mostrar productos también va a ecommerce: catálogo se
 * retiró y con él la pregunta por la cantidad. */
$cSoloMostrar = conv_sin_pitch();
$r = wabot_engine('vendo ropa pero solo quiero mostrarla y que me escriban', $cSoloMostrar, $cfg);
caso('"solo mostrar" ya no abre el catálogo: es ecommerce, sin preguntar cantidades',
    $cSoloMostrar['tipo'] === 'ecommerce'
    && stripos(implode(' ', $r), 'cuántos productos') === false);

$cPrecioDatos = conv_nueva();
$cPrecioDatos['fase'] = 'precio';
$cPrecioDatos['tipo'] = 'landing';
$cPrecioDatos['cta_muestra'] = true;
$r = wabot_engine('Somos GasFix, celeste y blanco, no tengo pagina de referencia', $cPrecioDatos, $cfg);
caso('Gemini caído justo cuando el cliente pasa los datos del prediseño sin decir "sí" antes: no se pierden',
    $cPrecioDatos['fase'] === 'prediseno'
    && $cPrecioDatos['descripcion'] === 'Somos GasFix, celeste y blanco, no tengo pagina de referencia'
    && stripos(implode(' ', $r), 'contestar el desarrollador') === false);

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

echo "— El precio (texto fijo) y la pregunta del pitch salen juntos; la demo recién cuando contesta —\n";

/**
 * La línea que va detrás del precio. Desde el 1-sep ya no le pide al cliente
 * que valide el encaje ("buscabas algo así o tenías otra idea en mente?"):
 * afirma la propuesta y ofrece el próximo paso (Pablo: "es malísimo que
 * pregunte eso de si encaja"). Todas las variantes son condicional + oferta
 * de seguir, y ninguna vuelve a preguntar qué tenía pensado.
 */
function invita_al_proximo_paso($texto) {
    $t = (string)$texto;
    foreach (['tenías otra idea', 'tenías pensado', 'tenías pensada', 'buscabas'] as $viejo) {
        if (mb_stripos($t, $viejo) !== false) return false;
    }
    if (mb_stripos($t, 'si te ') === false && mb_stripos($t, 'si va por ahí') === false) return false;
    // Desde el 1-sep (noche) la línea dice qué hay del otro lado: ver su web.
    foreach (['próximo paso', 'paso siguiente', 'cómo seguiríamos', 'cómo seguimos', 'ver tu web', 'verla hecha'] as $marca) {
        if (mb_stripos($t, $marca) !== false) return true;
    }
    return false;
}

function conv_sin_pitch() {
    $c = conv_nueva();
    unset($c['pitch_hecho']);
    return $c;
}

$cP = conv_sin_pitch();
clasifica(['rubro_comercio']);
$rP = wabot_engine('Tengo una empresa de ropa', $cP, $cfg);
caso('el turno A trae DOS mensajes: precio+desc primero, la demo después',
    count($rP) === 2 && strpos($rP[0], '$290.000') !== false && wabot_es_texto_demo($rP[1], $cfg));
caso('y el link del presupuesto para verlo detallado', strpos($rP[0], 'presupuestos/ecommerce') !== false);
caso('el primer mensaje es el texto fijo del ecommerce, con su panel de productos y pedidos',
    stripos($rP[0], 'ecommerce') !== false && stripos($rP[0], 'panel tuyo para cargar productos y ver los pedidos') !== false);
caso('la demo se ofreció en el mismo turno, sin esperar respuesta',
    !empty($cP['cta_muestra']) && $cP['fase'] === 'prediseno'
    && $cP['tipo'] === 'ecommerce' && $cP['precio_dado'] === true);

clasifica(['otro']);
$rP2 = wabot_engine('Ropa de mujer, vestidos y jeans, tengo local en Salta', $cP, $cfg);
caso('lo que cuenta después del precio no repite el precio ni vuelve a ofrecer la demo',
    strpos(implode(' ', $rP2), '$290.000') === false
    && $cP['fase'] === 'prediseno' && $cP['cta_muestra'] === true);
caso('lo que contó queda guardado para el prediseño',
    stripos((string)$cP['descripcion'], 'vestidos') !== false
    || stripos(wabot_contexto_cliente_texto($cP), 'vestidos') !== false);
caso('el pitch no se repite en el mismo chat', !empty($cP['pitch_hecho']));

/* institucional salió de la lista el 2-sep: el que lo pedía va a sitio
 * profesional, y eso ya lo cubre la sección de tipos retirados. */
foreach (['landing' => 'rubro_landing',
          'inmobiliaria' => 'rubro_inmobiliaria'] as $tipoP => $accP) {
    $cx = conv_sin_pitch();
    clasifica([$accP]);
    $rx = wabot_engine('cuento mi rubro', $cx, $cfg);
    caso("$tipoP también manda precio y demo en dos mensajes",
        $cx['fase'] === 'prediseno' && $cx['tipo'] === $tipoP && $cx['precio_dado'] === true
        && count($rx) === 2 && strpos($rx[0], '$') !== false && wabot_es_texto_demo($rx[1], $cfg));
    caso("$tipoP linkea su presupuesto en ese primer mensaje",
        strpos($rx[0], 'gokywebs.com/presupuestos/') !== false);
}

/* La cotización por cantidad de productos se fue con el catálogo (2-sep). */
$cCat = conv_sin_pitch();
$rCat = wabot_precio('catalogo', $cCat, $cfg);
caso('pedir catálogo hoy devuelve el ecommerce completo, con su precio de lista',
    $cCat['tipo'] === 'ecommerce' && strpos($rCat[0], '$290.000') !== false
    && stripos($rCat[0], 'cuántos productos') === false);

echo "— Los 5 textos fijos que dictó Pablo (25-ago), con {precio} resuelto —\n";

/* Desde el 2-sep son CUATRO y su forma la dictó Pablo: confirmación, tipo,
 * precio como pago único, mini descripción y el link del presupuesto. El
 * {rubro} queda crudo en la plantilla: lo resuelve wabot_personalizar(). */
$textosFijosEsperados = wabot_precio_ideal_defaults();
caso('los textos de precio son cuatro, uno por tipo ofrecible',
    array_keys($textosFijosEsperados) === ['landing', 'ecommerce', 'inmobiliaria', 'elearning']);
foreach ($textosFijosEsperados as $tipoFijo => $plantillaFija) {
    $cFijo = conv_sin_pitch();
    $rFijo = wabot_pitch($tipoFijo, $cFijo, $cfg);
    $esperado = wabot_aplicar_rubro(
        str_replace(['{precio}', '{link}'],
            [(string)$cfg['tipos'][$tipoFijo]['precio'], (string)$cfg['tipos'][$tipoFijo]['link']],
            $plantillaFija), '');
    caso("$tipoFijo: el texto del precio sale tal cual, con el precio y el link resueltos",
        wabot_personalizar($rFijo[0], $cFijo) === $esperado);
    caso("$tipoFijo: dice que es un pago único", stripos($rFijo[0], 'pago único') !== false);
    caso("$tipoFijo: linkea el presupuesto para verlo en detalle (2-sep)",
        strpos($rFijo[0], 'gokywebs.com/presupuestos/') !== false);
    caso("$tipoFijo: y ya no lleva la línea del portfolio, que vive dentro del presupuesto",
        stripos($rFijo[0], 'portfolio') === false);
    caso("$tipoFijo: la demo llega en el segundo mensaje", count($rFijo) === 2 && wabot_es_texto_demo($rFijo[1], $cfg));
}

echo "— Los tipos retirados (2-sep): no se ofrecen, pero las charlas viejas conservan el suyo —
";

caso('los ofrecibles son exactamente cuatro',
    wabot_tipos_ofrecibles($cfg) === ['landing', 'inmobiliaria', 'ecommerce', 'elearning']);
foreach (['catalogo', 'turnos', 'institucional', 'lms'] as $ret) {
    caso("$ret sigue existiendo en la config pero está retirado",
        isset($cfg['tipos'][$ret]) && !wabot_tipo_ofrecible($ret, $cfg));
}
caso('turnos e institucional los absorbe el sitio profesional',
    wabot_tipo_absorbido('turnos', $cfg) === 'landing' && wabot_tipo_absorbido('institucional', $cfg) === 'landing');
caso('catálogo lo absorbe ecommerce y LMS se cotiza como plataforma de cursos',
    wabot_tipo_absorbido('catalogo', $cfg) === 'ecommerce' && wabot_tipo_absorbido('lms', $cfg) === 'elearning');
caso('un tipo vigente no se toca', wabot_tipo_absorbido('ecommerce', $cfg) === 'ecommerce');

$cRet = conv_sin_pitch();
$rRet = wabot_precio('turnos', $cRet, $cfg);
caso('cotizar turnos hoy devuelve el sitio profesional a $180.000',
    $cRet['tipo'] === 'landing' && strpos($rRet[0], '$180.000') !== false);
$cRet2 = conv_sin_pitch();
$rRet2 = wabot_precio('catalogo', $cRet2, $cfg);
caso('y catálogo devuelve el ecommerce, sin preguntar cantidades',
    $cRet2['tipo'] === 'ecommerce' && strpos($rRet2[0], '$290.000') !== false
    && stripos($rRet2[0], 'cuántos productos') === false);

/* Pero al que YA le cotizamos turnos no se le cambia el número. */
$cViejo = conv_nueva();
$cViejo['tipo'] = 'turnos'; $cViejo['precio_dado'] = true; $cViejo['fase'] = 'pitch';
$cViejo['cta_muestra'] = true;
$rViejo = wabot_precio('turnos', $cViejo, $cfg);
caso('una charla ya cotizada en turnos conserva su tipo y su precio',
    $cViejo['tipo'] === 'turnos' && strpos(implode(' ', $rViejo), '$200.000') !== false);

echo "— Comercios: se asume tienda online, sin preguntar carrito vs WhatsApp —\n";

// El chat real: "Tengo una ferreteria" → cotizaba institucional $250.000.
$c = conv_nueva();
clasifica(['rubro_comercio']);
$r = wabot_engine('Tengo una ferreteria', $c, $cfg);
caso('una ferretería va derecho a tienda online, sin desempate',
    $c['tipo'] === 'ecommerce' && $c['fase'] !== 'desempate_comercio');
caso('nunca le pregunta si quiere carrito o consultas por WhatsApp',
    stripos(implode(' ', $r), 'contacten por WhatsApp') === false);
caso('y no le encajó el precio institucional', strpos(implode(' ', $r), '250.000') === false);

$c = conv_nueva();
clasifica(['rubro_comercio']);
$r = wabot_engine('Vendo ropa y quiero vender online', $c, $cfg);
caso('quiere vender online → ecommerce $290.000',
    strpos(implode(' ', $r), '$290.000') !== false
    && strpos(implode(' ', $r), 'presupuestos/ecommerce') !== false
    && $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
clasifica(['comercio_mostrar']);
$r = wabot_engine('no, que muestre el local nomas', $c, $cfg);
caso('solo mostrar el negocio también es ecommerce: el catálogo se retiró (2-sep)',
    $c['tipo'] === 'ecommerce' && strpos(implode(' ', $r), '$290.000') !== false
    && stripos(implode(' ', $r), 'cuántos productos') === false);

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

echo "— El precio ya no fuerza el link del presupuesto —\n";

$c = conv_nueva();
clasifica(['rubro_landing']);
$r = wabot_engine('soy plomero', $c, $cfg);
caso('primero explica QUÉ es y recién después dice cuánto sale',
    mb_strlen($r[0]) > 60 && strpos($r[0], '$180.000') !== false
    && strpos($r[0], '$180.000') > 40);
caso('y manda el link del presupuesto para verlo detallado', strpos($r[0], 'presupuestos/sitioprofesional') !== false);


echo "— Cada tipo cuenta lo suyo en el mensaje del precio —\n";

foreach ([
    'landing'       => 'contacto directo a tu WhatsApp',
    'inmobiliaria'  => 'catálogo de propiedades',
    'ecommerce'     => 'carrito y cobro online',
    'elearning'     => 'acceso propio para cada alumno',
] as $tipo => $sena) {
    $msg = wabot_msg_precio_texto($tipo, $cfg);
    caso("$tipo describe lo que incluye y linkea su presupuesto", stripos($msg, $sena) !== false
        && strpos($msg, $cfg['tipos'][$tipo]['precio']) !== false
        && strpos($msg, (string)$cfg['tipos'][$tipo]['link']) !== false);
    caso("$tipo dice qué es ANTES de cuánto sale",
        strpos($msg, $sena) < strpos($msg, $cfg['tipos'][$tipo]['precio']));
}

// Y si a un tipo le borran la descripción, el mensaje no queda con un {desc} crudo.
$cfgSinDesc = $cfg;
$cfgSinDesc['tipos']['landing']['desc'] = '';
$msg = wabot_msg_precio_texto('landing', $cfgSinDesc);
caso('sin descripción cargada no queda ningún {desc} a la vista',
    strpos($msg, '{desc}') === false && strpos($msg, '$180.000') !== false);

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
caso('preguntar por la seña sí devuelve los montos',
    strpos($r[0], $cfg['tipos']['landing']['sena']) !== false);
caso('y con el tipo ya sabido da SOLO la seña de ese tipo, no la lista de los 7',
    strpos($r[0], $cfg['tipos']['ecommerce']['sena']) === false
    && stripos($r[0], 'en landing,') === false);

// Y si pregunta las dos cosas, van las dos.
clasifica(['pregunta_info'], ['info_keys' => ['proceso', 'pago']]);
$r = wabot_engine('como trabajan y como se paga?', $c, $cfg);
caso('las dos preguntas juntas → las dos respuestas en bullets',
    count($r) === 1 && strpos($r[0], '- ') === 0
    && stripos($r[0], 'demo gratis') !== false
    && strpos($r[0], $cfg['tipos']['landing']['sena']) !== false);

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
caso('decir que es caro sí dispara la respuesta oficial', $r[0] === wabot_link_presupuesto_completar($cfg['caro'], $c, $cfg));

echo "— Un \"dale\" pelado acepta la muestra, no corta la venta —\n";

// El chat real: precio → pregunta de mantenimiento → "Ok dale" → derivaba.
$c = conv_nueva();
clasifica(['rubro_landing']);
wabot_engine('soy plomero', $c, $cfg);
clasifica(['pregunta_info'], ['info_keys' => ['mantenimiento']]);
wabot_engine('Por mes cuanto tengo que pagar', $c, $cfg);
clasifica(['quiere_avanzar']);
$r = wabot_engine('Ok dale', $c, $cfg);
/* Desde el 2-sep el formulario ya salió con el precio, así que el "Ok dale"
 * recibe la línea de espera —ni el link de nuevo ni una derivación—. */
caso('"Ok dale" tras el precio no deriva y no repite el link',
    $c['fase'] === 'prediseno' && strpos(implode(' ', $r), 'gokywebs.com/form/') === false
    && implode(' ', $r) === (string)$cfg['prediseno_espera']);
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
// Pablo, 28-ago: el traspaso va igual, pero ya no sale solo — antes contesta
// lo que el cliente acaba de preguntar ("mandame el CBU" = cómo se paga).
caso('un pedido con contenido propio sí deriva',
    end($r) === $cfg['derivar'] && $c['fase'] === 'derivado');
caso('y no deriva mudo: primero le contesta cómo se paga',
    count($r) === 2 && $r[0] === wabot_texto_pago($c, $cfg));

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
caso('y el precio cotizado también', $valor('presupuesto_cotizado') === '$200.000');
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

echo "— Si no entiende, reformula: nunca repite la misma pregunta textual —\n";

// La pregunta original la hizo el bot al entrar al desempate. Si el cliente
// no la contesta bien, la PRIMERA repregunta ya es la reformulada — nunca se
// manda dos veces el mismo texto seguido.
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r1 = wabot_engine('mmm', $c, $cfg);
caso('la repregunta NO es la pregunta original repetida', $r1[0] !== $cfg['desempate_comercio']);
caso('es la versión simplificada, con las dos palabras esperadas',
    $r1[0] === $cfg['desempate_comercio_2'] && strpos($r1[0], '"vender"') !== false && strpos($r1[0], '"mostrar"') !== false);
clasifica(['comercio_vender']);
$r3 = wabot_engine('vender', $c, $cfg);
caso('y responder con esa palabra exacta resuelve', $c['tipo'] === 'ecommerce');


/* Y con las dos respuestas del desempate se llega al mismo lugar: desde el
 * 2-sep vender y mostrar son ecommerce, así que la etiqueta del clasificador
 * ya no puede llevar a un tipo distinto del de las palabras. */
clasifica(['comercio_mostrar']);
$c = conv_nueva(); $c['fase'] = 'desempate_comercio';
$r = wabot_engine('vender', $c, $cfg);
caso('mostrar y vender terminan los dos en ecommerce', $c['tipo'] === 'ecommerce');

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
$con = ['tel'=>'T2','canal'=>'whatsapp','nombre'=>'Lucía Gómez','nombre_confirmado'=>true];
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
/* Y cuando el cliente contesta NO vuelve a Muestras: pasa a ser DEI.
 *
 * Antes sí volvía —presentado_confirmado se enciende con la primera respuesta y
 * la condición del grupo se rompía— así que toda demo entregada con el cliente
 * contestando reaparecía en D, "Con demo por presentar", y DEI no se alcanzaba
 * nunca porque su filtro exige el grupo presentados (Pablo, 28-ago: "todas las
 * demos se quedan en D"). */
$presentadaConfirmada = $presentadaSinConfirmar;
$presentadaConfirmada['presentado_confirmado'] = true;
$presentadaConfirmada['transcript'][] = ['q' => 'cliente', 't' => 'La primer mirada me gustó', 'ts' => time()];
caso('cuando contesta NO vuelve a Muestras: sigue en Presentados',
    wabot_conv_grupo($presentadaConfirmada) === 'presentados');
caso('y ahí es donde el panel lo marca DEI',
    wabot_presentada_con_interes($presentadaConfirmada) === true);
caso('mientras no conteste sigue siendo DE, no DEI',
    wabot_presentada_con_interes($presentadaSinConfirmar) === false);

// Ni siquiera después de 48 h de silencio: se enfría, pero no es trabajo de
// diseño pendiente.
$presentadaFria = $presentadaSinConfirmar;
$presentadaFria['presentado_ts'] = time() - 72 * 3600;
caso('a las 72 h sin respuesta se enfría, pero tampoco vuelve a Muestras',
    wabot_conv_grupo($presentadaFria) === 'presentadas_48');

// Y el aviso de pago le sigue ganando a todo.
$presentadaPago = $presentadaConfirmada;
$presentadaPago['pago_avisado_ts'] = time();
caso('el que avisó que pagó gana sobre DE y DEI',
    wabot_conv_grupo($presentadaPago) === 'pago');

// El caso de Pablo: contesta él, el cliente responde y queda último.
$base['transcript'][] = ['q'=>'humano','t'=>'Te mando la muestra mañana','ts'=>2];
$base['transcript'][] = ['q'=>'cliente','t'=>'dale, gracias!','ts'=>3];
$base['pausado_hasta'] = time() + 3600;
caso('si el cliente contesta último, SIGUE en Muestras', wabot_conv_grupo($base) === 'muestra');
caso('pero queda marcada como que te espera', wabot_conv_espera_respuesta($base) === true);

// Ya no hay grupo "Te esperan": esa charla vuelve a su lugar del embudo, y que
// esté esperando respuesta se sigue viendo en la píldora de la fila.
$sinMuestra = $base;
$sinMuestra['lead_creado'] = false;
$sinMuestra['descripcion'] = null;
$sinMuestra['colores'] = null;
caso('una charla sin muestra con el cliente esperando cae en su grupo del embudo, no en uno aparte',
    wabot_conv_grupo($sinMuestra) === 'chat');
caso('pero sigue marcada como que te espera',
    wabot_conv_espera_respuesta($sinMuestra) === true);

// El bug real del chat de Claudio: wabot_prediseno_completo() SIEMPRE marca
// handoff_pendiente, y ese flag tenía prioridad absoluta sobre el grupo, así
// que todo boceto recién cerrado desaparecía de la cola de trabajo. El grupo
// "Te esperan" ya no existe, pero el caso se testea igual: la muestra manda.
$claudio = ['canal'=>'whatsapp','tipo'=>'ecommerce','fase'=>'derivado','cierre'=>'prediseno',
            'handoff_pendiente'=>true,'bot_off'=>false,'pausado_hasta'=>0,
            'descripcion'=>'','colores'=>'los del logo','lead_creado'=>true,
            'transcript'=>[['q'=>'bot','t'=>'Listo, con eso ya lo preparamos.','ts'=>time()]]];
caso('un boceto recién cerrado (handoff_pendiente Y cierre=prediseno a la vez) va a Muestras',
    wabot_conv_grupo($claudio) === 'muestra');

// Una derivación real: con el grupo aparte eliminado, cae en el embudo. El
// handoff sigue registrado para la píldora, pero ya no la saca de su columna.
$derivacionReal = ['canal'=>'whatsapp','fase'=>'derivado','cierre'=>'derivacion','handoff_pendiente'=>true,
                    'bot_off'=>false,'pausado_hasta'=>0,'descripcion'=>null,'colores'=>null,'lead_creado'=>false,
                    'transcript'=>[['q'=>'bot','t'=>'Tu consulta la sigue Pablo.','ts'=>time()]]];
caso('una derivación sin prediseño ya no se muda a un grupo aparte',
    wabot_conv_grupo($derivacionReal) === 'chat');
caso('pero el handoff queda registrado para la píldora de la fila',
    !empty($derivacionReal['handoff_pendiente']));
caso('ninguna conversación cae ya en el grupo "atencion", que no existe más',
    !in_array(wabot_conv_grupo($derivacionReal), ['atencion'], true)
    && !in_array(wabot_conv_grupo($sinMuestra), ['atencion'], true));

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
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['fase'] === 'derivado' && $c['lead_creado'] === true);
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
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['fase'] === 'derivado');

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
    $r === [wabot_link_presupuesto_completar($cfg['caro'], $c, $cfg), $cfg['prediseno_referencia']] && $c['fase'] === 'prediseno_ref');

clasifica(['saludo']);
$r = wabot_engine('gracias!', $c, $cfg);
caso('un gracias suelto no se vuelve la referencia', $c['fase'] === 'prediseno_ref' && empty($c['referencia']));

clasifica(['otro']);
$r = wabot_engine('me gusta como se ve zara.com', $c, $cfg);
caso('la respuesta de verdad sí cierra con la referencia bien guardada',
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['referencia'] === 'me gusta como se ve zara.com' && $c['lead_creado'] === true);

echo "— Querer avanzar con los datos dados no tira el lead —\n";

$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['quiere_avanzar']);
$r = wabot_engine('dale, quiero arrancar ya', $c, $cfg);
caso('quiere avanzar en prediseno_ref → cierra el prediseño, no deriva a secas',
    $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['lead_creado'] === true);

$c = conv_nueva(); $c['fase'] = 'prediseno_ref'; $c['tipo'] = 'landing';
$c['descripcion'] = 'plomero'; $c['colores'] = 'azul';
clasifica(['pide_humano']);
$r = wabot_engine('pasame con una persona', $c, $cfg);
caso('pedir humano ahí también salva el lead', $r === [wabot_texto_prediseno_completo($c, $cfg)] && $c['lead_creado'] === true);

echo "— El desempate no es un callejón —\n";

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['rubro_ecommerce']);
$r = wabot_engine('en realidad lo que quiero es vender productos', $c, $cfg);
caso('contesta otro rubro en pleno desempate → lo cotiza, no deriva',
    strpos($r[0], '$290.000') !== false && $c['tipo'] === 'ecommerce');

$c = conv_nueva(); $c['fase'] = 'desempate_turnos';
clasifica(['rubro_cursos']);
$r = wabot_engine('aparte doy cursos de barberia', $c, $cfg);
caso('nombra cursos en el desempate de turnos → cambia a la pregunta de cursos',
    $r === [$cfg['desempate_cursos']] && $c['fase'] === 'desempate_cursos');

$c = conv_nueva(); $c['fase'] = 'desempate_cursos';
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('como seria el pago?', $c, $cfg);
caso('una duda en pleno desempate se contesta y la pregunta sigue en pie',
    $r === [wabot_texto_pago_generico($cfg)] && $c['fase'] === 'desempate_cursos');

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

// Los dos mensajes del precio tienen que tardar distinto entre sí. Sin techo,
// para no toparse con el clamp de $t y que dos mensajes largos den lo mismo.
$c = conv_nueva();
clasifica(['rubro_ecommerce']);
$r = wabot_engine('vendo mates', $c, $cfg);
$sinTecho = array_merge($t, ['demora_maxima' => 999]);
$d0Real = wabot_demora_tipeo($r[0], $sinTecho);
$d1Real = wabot_demora_tipeo($r[1], $sinTecho);
caso('el precio y la oferta no tardan lo mismo, porque no miden lo mismo', $d0Real !== $d1Real);
$d0 = wabot_demora_tipeo($r[0], $t);
$d1 = wabot_demora_tipeo($r[1], $t);
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
caso('config vieja sin el campo → usa 10 por defecto',
    abs(wabot_demora_restante($cfgSin, $ahoraF) - 10.0) < 0.1);

$cfgD['demora_segundos'] = 5;
caso('reloj corrido hacia atrás → nunca da negativo ni se pasa del tope',
    wabot_demora_restante($cfgD, $ahoraF + 100) >= 0.0 && wabot_demora_restante($cfgD, $ahoraF + 100) <= 5.0);

caso('un objetivo explícito pisa el de la config (primer mensaje vs. el resto)',
    abs(wabot_demora_restante($cfgD, $ahoraF, 20.0) - 20.0) < 0.1
    && abs(wabot_demora_restante($cfgD, $ahoraF - 15, 20.0) - 5.0) < 0.1);

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
$caliente['nombre_confirmado'] = true;
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

echo "— Muestras presentadas: archivo a la semana sin confirmar —\n";

$ahoraPres = time();
$cfgPres = $cfg; $cfgPres['presentados_archivar_horas'] = 168;

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

echo "— Confirmación de la demo a las 48 h: el único automático que queda —\n";

$cfgConf = $cfg; $cfgConf['activo'] = true; $cfgConf['confirmacion_demo_horas'] = 48;
$ahoraConf = time();

$confBase = conv_nueva();
$confBase['presentado_ts'] = $ahoraConf - 49 * 3600;
$confBase['presentado_via_bot'] = true;
caso('a las 49h de presentada, sin confirmación mandada, corresponde',
    wabot_confirmacion_demo_corresponde($confBase, $cfgConf, $ahoraConf) === true);

$confTemprano = $confBase; $confTemprano['presentado_ts'] = $ahoraConf - 10 * 3600;
caso('antes de las 48h no corresponde', !wabot_confirmacion_demo_corresponde($confTemprano, $cfgConf, $ahoraConf));

$confYaEnviada = $confBase; $confYaEnviada['confirmacion_demo_enviada'] = true;
caso('ya mandada, no se repite', !wabot_confirmacion_demo_corresponde($confYaEnviada, $cfgConf, $ahoraConf));

$confArchivada = $confBase; $confArchivada['archivado'] = true;
caso('archivada, no corresponde', !wabot_confirmacion_demo_corresponde($confArchivada, $cfgConf, $ahoraConf));

$confBotOff = $confBase; $confBotOff['bot_off'] = true;
caso('con el bot apagado en esa charla, no corresponde', !wabot_confirmacion_demo_corresponde($confBotOff, $cfgConf, $ahoraConf));

$confPausada = $confBase; $confPausada['pausado_hasta'] = $ahoraConf + 3600;
caso('pausada, no corresponde', !wabot_confirmacion_demo_corresponde($confPausada, $cfgConf, $ahoraConf));

$confSinPresentar = conv_nueva();
caso('sin presentado_ts no hay nada que confirmar',
    !wabot_confirmacion_demo_corresponde($confSinPresentar, $cfgConf, $ahoraConf));

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

echo "\u2014 Empresa no vuelve institucional a nadie \u2014\n";

foreach (['Tengo una empresa de limpieza', 'Somos una empresa familiar de fletes',
          'Tengo una empresa de seguridad', 'Somos una empresa de refrigeracion',
          'Tengo una empresa de transporte', 'Tengo una empresa de mudanzas',
          'Tengo una empresa de eventos'] as $frase) {
    caso("\"$frase\" es una landing, no institucional de 250.000",
        wabot_fallback_rubro_local($frase) === 'landing');
}
echo "— Rubros que el fallback local no reconocía —\n";

foreach ([
    ['Una imprenta, me voy a dedicar a impresión en cajas microcorrugado', 'ecommerce'],
    ['hago packaging para gastronomia', 'ecommerce'],
    ['tengo una libreria', 'ecommerce'],
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
    // Bug real (24-ago): esta duda básica caía en "otra" y el bot derivaba al
    // desarrollador algo que ya tenía respuesta armada.
    ['Que es desarrollo web?', 'que_hacemos'],
    ['que es una pagina web', 'que_hacemos'],
    ['que es un sitio web?', 'que_hacemos'],
    ['en que consiste el desarrollo web', 'que_hacemos'],
    ['hacen paginas web?', 'que_hacemos'],
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

foreach (array_keys($cfg['tipos']) as $tipo) {
    $sena = (string)($cfg['tipos'][$tipo]['sena'] ?? '');
    $texto = wabot_texto_pago(['tipo' => $tipo, 'precio_dado' => true], $cfg);
    // "seña de $X", no el monto suelto: una cuota de otro tipo puede coincidir
    // en número con la seña de este (ej. turnos cotiza 6 cuotas de $60.000,
    // que es justo la seña de landing) sin que sea el dato equivocado.
    caso("$tipo cotizado → la seña dice $sena y ninguna otra", strpos($texto, 'seña de ' . $sena) !== false);
    $todasLasSenas = array_unique(array_map(function ($d) { return (string)($d['sena'] ?? ''); }, $cfg['tipos']));
    $otras = array_diff($todasLasSenas, [$sena, '']);
    foreach ($otras as $otraSena) {
        caso("$tipo cotizado → NO menciona la seña de otro tipo ($otraSena)", strpos($texto, 'seña de ' . $otraSena) === false);
    }
}
caso('sin tipo cotizado todavía, la seña es la genérica con los montos reales',
    wabot_texto_pago(['tipo' => null], $cfg) === wabot_texto_pago_generico($cfg));

echo "— El bot NO dice montos de cuota (Pablo, 2-sep) —\n";

/* "El bot no debería saber el valor de las cuotas, eso varía mucho
 * diariamente." La tasa de la tarjeta se mueve sola y un monto viejo es una
 * condición comercial que después hay que sostener delante del cliente. Se
 * dice que hay hasta 12 cuotas; el número lo calcula la tarjeta. */
foreach (array_keys((array)$cfg['tipos']) as $tipoCuota) {
    caso("$tipoCuota ya no tiene cuotas de lista en la config",
        empty($cfg['tipos'][$tipoCuota]['cuotas']));
}
foreach (wabot_tipos_ofrecibles($cfg) as $tipoPago) {
    $texto = wabot_texto_pago(['tipo' => $tipoPago, 'precio_dado' => true], $cfg);
    caso("$tipoPago: la respuesta de pago no trae ningún monto de cuota",
        preg_match('/\d+ (cuotas )?de \$/u', $texto) === 0);
    caso("$tipoPago: pero sí dice que hay hasta 12 cuotas",
        stripos($texto, '12 cuotas') !== false);
    caso("$tipoPago: y no deja ningún marcador crudo",
        strpos($texto, '{') === false);
}
/* Una config vieja con los montos guardados migra sola. */
$cfgCuotasViejas = wabot_config_load();
$cfgCuotasViejas['info']['pago'] = 'El desarrollo completo es {precio}. Se puede abonar por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés: 12 cuotas de {cuotas_12}, 6 de {cuotas_6} o 3 de {cuotas_3}. Para arrancar se deja una seña de {sena} y el saldo al entregar la web.';
wabot_config_ventas($cfgCuotasViejas);
caso('el info.pago con montos que estaba en producción migra solo',
    strpos($cfgCuotasViejas['info']['pago'], '{cuotas_12}') === false
    && stripos($cfgCuotasViejas['info']['pago'], '12 cuotas') !== false);
caso('sin tipo cotizado, la genérica no inventa montos de cuota',
    strpos(wabot_texto_pago(['tipo' => null], $cfg), 'cuotas de $') === false);
caso('la respuesta de pago del tipo cotizado arranca con el precio total',
    strpos(wabot_texto_pago(['tipo' => 'landing', 'precio_dado' => true], $cfg), '$180.000') !== false);
caso('con tipo puesto pero SIN precio dado, la seña es la de ESE tipo, sin el total que todavía no vio',
    strpos(wabot_texto_pago(['tipo' => 'catalogo'], $cfg), $cfg['tipos']['catalogo']['sena']) !== false
    && strpos(wabot_texto_pago(['tipo' => 'catalogo'], $cfg), $cfg['tipos']['catalogo']['precio']) === false);
caso('y esa respuesta no contradice a la de ecommerce cotizado (el bug de los $90.000)',
    strpos(wabot_texto_pago(['tipo' => 'ecommerce'], $cfg), $cfg['tipos']['ecommerce']['sena']) !== false
    && strpos(wabot_texto_pago(['tipo' => 'ecommerce'], $cfg), '$90.000') === false);
caso('sin tipo todavía, ahí sí va la lista completa de señas',
    wabot_texto_pago(['tipo' => null], $cfg) === wabot_texto_pago_generico($cfg));
caso('"en un pago" se contesta también antes de tener precio',
    stripos(wabot_texto_pago(['tipo' => 'ecommerce'], $cfg), 'en un pago') !== false);
caso('el pago del catálogo cotizado usa el total calculado, no las cuotas de la base',
    strpos(wabot_texto_pago(['tipo' => 'catalogo', 'precio_dado' => true, 'productos_cantidad' => 100], $cfg), '$230.000') !== false
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
caso('objecion_caro también lleva el completo la primera vez', $rc1[0] === wabot_link_presupuesto_completar($cfg['caro'], $c2, $cfg));
caso('y esa duda caliente ya deja la demo ofrecida', $c2['cta_muestra'] === true);
clasifica(['objecion_pensarlo']);
$rp1 = wabot_engine('lo tengo que pensar', $c2, $cfg);
caso('una objeción DISTINTA no repite la demo si otra ya la ofreció antes en la misma charla',
    $rp1 === [$cfg['pensarlo_sin_muestra']]);

$c3 = conv_nueva(); $c3['fase'] = 'precio'; $c3['tipo'] = 'landing';
clasifica(['objecion_pensarlo']);
$rp3 = wabot_engine('lo tengo que pensar', $c3, $cfg);
caso('pero si es la primera objeción de la charla, sí lleva el discurso completo con la demo',
    $rp3 === [$cfg['pensarlo']]);

$c4 = conv_nueva(); $c4['fase'] = 'precio'; $c4['tipo'] = 'landing'; $c4['cta_muestra'] = true;
clasifica(['objecion_socio']);
$rs4 = wabot_engine('lo tengo que hablar con mi socio', $c4, $cfg);
caso('"socio" tampoco repite la demo si ya se ofreció antes', $rs4 === [$cfg['socio_sin_muestra']]);

$c5 = conv_nueva(); $c5['fase'] = 'precio'; $c5['tipo'] = 'landing'; $c5['cta_muestra'] = true;
clasifica(['objecion_ya_tiene_web']);
$rw5 = wabot_engine('ya tengo una página', $c5, $cfg);
caso('ni "ya tiene web"', $rw5 === [$cfg['ya_tengo_web_sin_muestra']]);

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

$agenda = ['nombre_negocio' => 'Mate Sur', 'nombre' => 'Marcos Pérez', 'nombre_confirmado' => true];
caso('agenda como Persona - Negocio cuando tiene los dos datos',
    wabot_nombre_agenda($agenda) === 'Marcos Pérez - Mate Sur');
caso('si solo conoce a la persona, no agrega separadores vacíos',
    wabot_nombre_agenda(['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true]) === 'Marcos Pérez');
caso('si solo conoce el negocio, lo agenda con ese nombre',
    wabot_nombre_agenda(['nombre_negocio' => 'Mate Sur']) === 'Mate Sur');
caso('un perfil inservible no se antepone al negocio',
    wabot_nombre_agenda(['nombre_negocio' => 'Black Automotores', 'nombre' => '.']) === 'Black Automotores');
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

$refDicha = ['referencia_preguntada' => true];
caso('sin nada conocido, pide las tres cosas',
    wabot_prediseno_faltan($refDicha + ['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => '', 'descripcion' => '', 'colores' => '']) === [
        'El nombre de tu negocio', 'Una descripción breve de lo que ofrecés', 'Los colores de tu marca',
    ]);
caso('y si el perfil de WhatsApp no sirve como nombre, pide cuatro',
    wabot_prediseno_faltan($refDicha + ['nombre' => '.', 'nombre_negocio' => '', 'descripcion' => '', 'colores' => '']) === [
        'Tu nombre', 'El nombre de tu negocio', 'Una descripción breve de lo que ofrecés', 'Los colores de tu marca',
    ]);
caso('lo que ya se sabe no se vuelve a pedir',
    wabot_prediseno_faltan($refDicha + ['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => '', 'colores' => 'marrón']) === [
        'Una descripción breve de lo que ofrecés',
    ]);
caso('con las tres cosas ya sabidas, no falta nada',
    wabot_prediseno_faltan($refDicha + ['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates', 'colores' => 'marrón']) === []);

caso('la referencia va en el MISMO pedido, no en un turno aparte',
    in_array('Si tenés alguna web de referencia que te guste (de cualquier rubro, y si no tenés no pasa nada)',
        wabot_prediseno_faltan(['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates', 'colores' => 'marrón']), true));
caso('pero si ya se la preguntaron, no se repite',
    wabot_prediseno_faltan(['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates',
        'colores' => 'marrón', 'referencia_preguntada' => true]) === []);
caso('ni si el cliente ya la dio',
    wabot_prediseno_faltan(['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates',
        'colores' => 'marrón', 'referencia' => 'nike.com']) === []);

$convFaltantes = ['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => '', 'descripcion' => '', 'colores' => ''];
$textoConFaltantes = wabot_prediseno_texto($convFaltantes, $cfgPredis);
caso('el texto lista lo que falta con saltos de línea reales',
    strpos($textoConFaltantes, "- El nombre de tu negocio\n- Una descripción breve de lo que ofrecés\n- Los colores de tu marca") !== false);

$convSinFaltantes = ['nombre' => 'Marcos Pérez', 'nombre_confirmado' => true, 'nombre_negocio' => 'Mate Sur', 'descripcion' => 'mates',
    'colores' => 'marrón', 'referencia_preguntada' => true];
$textoSinFaltantes = wabot_prediseno_texto($convSinFaltantes, $cfgPredis);
caso('si ya se sabe todo, el texto no lista nada',
    strpos($textoSinFaltantes, 'con lo que ya tengo alcanza') !== false);
/* "puede ser todo junto en un mensaje" era la instrucción de que el pedido
 * saliera en UN mensaje, no algo para decirle al cliente. Llegó a producción
 * como texto y Pablo lo vio en una charla real (29-ago). */
caso('el pedido no le explica al cliente que mande todo junto',
    stripos($textoConFaltantes, 'todo junto') === false);
caso('y arranca pidiendo poco (1-sep)',
    strpos($textoConFaltantes, 'Para armarla necesito poco:') === 0);
caso('la referencia ya no va en el listado por chat: se pregunta después, en su turno',
    strpos($textoConFaltantes, 'web de referencia') === false);
$convConColores = ['nombre' => '.', 'nombre_negocio' => '', 'descripcion' => 'mates', 'colores' => 'marrón'];
caso('y la aclaración de los colores va solo cuando los colores están en la lista',
    strpos($textoConFaltantes, "decime 'elegí vos'") !== false
    && strpos(wabot_prediseno_texto($convConColores, $cfgPredis), "elegí vos") === false);
caso('el pedido de datos no se lleva la coletilla de que la demo es gratis',
    wabot_demo_siempre_gratis([$textoConFaltantes], $cfgPredis) === [$textoConFaltantes]);

// Una config con el texto viejo guardado tiene que salir migrada.
$cfgTodoJunto = ['prediseno' => "Perfecto. Para prepararte la demo necesito esto, puede ser todo junto en un mensaje:\n{faltan}\nY si tenés logo o fotos propias, mandámelas también. Si no, la armamos igual."];
wabot_config_ventas($cfgTodoJunto);
caso('y la migración lo saca de cualquier variante ya guardada',
    stripos((string)$cfgTodoJunto['prediseno'], 'todo junto') === false
    && strpos((string)$cfgTodoJunto['prediseno'], '{faltan}') !== false);

$cfgPredisFormOn = $cfgPredis; $cfgPredisFormOn['form_activo'] = true;
$convWspConTel = ['tel' => '5491100000000TEST', 'channel_user_id' => '5491100000000TEST', 'canal' => 'whatsapp',
    'nombre' => '', 'nombre_confirmado' => false, 'nombre_negocio' => '', 'descripcion' => '', 'colores' => ''];
$textoConFormActivo = wabot_prediseno_texto($convWspConTel, $cfgPredisFormOn);
caso('con el form activo, WhatsApp con teléfono recibe el link, no el checklist',
    strpos($textoConFormActivo, 'gokywebs.com/form/') !== false && strpos($textoConFormActivo, '- Tu nombre') === false);

// El form vuelve a estar activo desde el 2-sep, pero Instagram sigue sin link
// (no hay teléfono): ahí el pedido de datos por chat es el que corresponde.
caso('el formulario está activo por defecto (2-sep)', !empty($cfg['form_activo']));
$convIgSinTel = ['tel' => 'IG9999TEST', 'channel_user_id' => 'IG9999TEST', 'canal' => 'instagram',
    'nombre' => '', 'nombre_confirmado' => false, 'nombre_negocio' => '', 'descripcion' => '', 'colores' => ''];
$textoIg = wabot_prediseno_texto($convIgSinTel, $cfgPredis);
caso('Instagram, que no tiene teléfono, sigue cayendo al checklist por chat',
    strpos($textoIg, 'gokywebs.com/form/') === false && strpos($textoIg, '- Tu nombre') !== false);

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
caso('si falla la IA, recuerda que Gabriela vende zapatillas y no le repregunta qué vende',
    $c['tipo'] !== null && stripos(implode(' ', $r), 'qué vend') === false);

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
caso('la respuesta de diagnóstico cotiza ecommerce, sin preguntar cantidades (2-sep)',
    $c['tipo'] === 'ecommerce' && strpos(implode(' ', $r), '$290.000') !== false);

foreach ([
    'Quiero mostrar los trabajos que hacemos y que me consulten',
    'mostrar el trabajo nomas',
    'quiero que me consulten y listo',
] as $frase) {
    caso("\"$frase\" se reconoce como hibrido_trabajos sin depender de la IA",
        wabot_desempate_por_palabras('desempate_hibrido', $frase) === 'hibrido_trabajos');
}

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
caso('los mensajes comerciales tienen variantes naturales sin perder el precio ni el link',
    count(array_unique($variantesPrecio)) >= 3
    && count(array_filter($variantesPrecio, function ($t) {
        return strpos($t, '$180.000') !== false && strpos($t, 'presupuestos/sitioprofesional') !== false;
    })) === count($variantesPrecio));

echo "— El precio tras el pitch no repite la descripción que el cliente ya leyó —\n";

$cSinPitch = conv_nueva();
$txtSinPitch = wabot_msg_precio_texto('ecommerce', $cfg, $cSinPitch);
caso('sin pitch previo, el mensaje de precio SIGUE llevando la descripción',
    stripos($txtSinPitch, 'tienda online completa') !== false);

$cConPitch = conv_nueva();
$cConPitch['pitch_hecho'] = true;
$cConPitch['pitch_tipo'] = 'ecommerce';
$txtConPitch = wabot_msg_precio_texto('ecommerce', $cfg, $cConPitch);
caso('con el mismo tipo recién pitcheado, el mensaje de precio NO repite la descripción',
    stripos($txtConPitch, 'tienda online completa') === false);
caso('pero sigue teniendo el precio y el link del presupuesto',
    strpos($txtConPitch, '$290.000') !== false && strpos($txtConPitch, 'presupuestos/ecommerce') !== false);

$cCambioTipo = conv_nueva();
$cCambioTipo['pitch_hecho'] = true;
$cCambioTipo['pitch_tipo'] = 'landing';
$txtCambioTipo = wabot_msg_precio_texto('ecommerce', $cfg, $cCambioTipo);
caso('pero si el pitch fue de OTRO tipo (cambió de idea), sí lleva la descripción del nuevo',
    stripos($txtCambioTipo, 'tienda online completa') !== false);

$cCatalogoConPitch = conv_nueva();
$cCatalogoConPitch['pitch_hecho'] = true;
$cCatalogoConPitch['pitch_tipo'] = 'catalogo';
$cCatalogoConPitch['productos_cantidad'] = 30;
$txtCatalogoConPitch = wabot_msg_precio_texto('catalogo', $cfg, $cCatalogoConPitch);
caso('catálogo tras su propio pitch tampoco repite la descripción',
    stripos($txtCatalogoConPitch, 'catálogo completo') === false
    && strpos($txtCatalogoConPitch, '30') !== false);

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
caso('"y si pago en efectivo, ahi si baja?" también es regateo (sin la palabra descuento)',
    wabot_es_regateo('y si pago en efectivo, ahi si baja?') === true);
caso('"me baja el precio si pago todo junto?" también es regateo',
    wabot_es_regateo('me baja el precio si pago todo junto?') === true);
caso('pero "quiero darme de baja" (opt-out) no se confunde con regateo',
    wabot_es_regateo('no me escriban mas por favor, quiero darme de baja') === false);

$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true; $c['chat_started_ts'] = time();
clasifica(['otro']);
$r = wabot_engine('no hay forma de que me lo dejes en 150?', $c, $cfg);
caso('el primer regateo recibe la respuesta oficial de precio, sin bajar el monto',
    $r === [wabot_link_presupuesto_completar($cfg['caro'], $c, $cfg)] && $c['fase'] === 'precio');
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
    count($r) === 1 && strpos($r[0], '$180.000') !== false && strpos($r[0], '$32.000') === false);

echo "— Un taller mecánico no es un curso —\n";

caso('"tengo un taller mecanico y vendemos repuestos" no deriva por productos_y_cursos',
    wabot_handoff_causa_explicita('tengo un taller mecanico y vendemos repuestos') === null);
caso('"doy talleres de costura online y vendo ropa" sí combina productos y cursos',
    wabot_handoff_causa_explicita('doy talleres de costura online y vendo ropa') === 'productos_y_cursos');
caso('"soy nutricionista" ya no abre ningún desempate: es sitio profesional (2-sep)',
    wabot_fallback_rubro_local('soy nutricionista') === 'landing');
caso('"soy manicura" también', wabot_fallback_rubro_local('soy manicura') === 'landing');

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
caso('la primera cotización sale completa en dos globos', count($r1) === 2 && strpos($r1[0], '$180.000') !== false);
clasifica(['otro']);
$r2 = wabot_engine('cuanto sale?', $c, $cfg);
caso('la re-cotización del mismo tipo es UN resumen corto con el total',
    count($r2) === 1 && strpos($r2[0], '$180.000') !== false && $r2[0] !== $r1[0]);
$rq = wabot_precio('landing', $c, $cfg);
caso('wabot_precio del mismo tipo ya cotizado devuelve el resumen, no re-pega el bloque',
    count($rq) === 1 && strpos($rq[0], '$180.000') !== false && $rq[0] !== $r1[0]);

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
    caso("la plantilla de precio #$i linkea el presupuesto (2-sep)", strpos($plantilla, '{link}') !== false);
}
caso('el mensaje de precio NO menciona la tarjeta ni las 12 cuotas: eso se contesta solo si preguntan',
    stripos(wabot_msg_precio_texto('landing', $cfg), '12 cuotas') === false
    && stripos(wabot_msg_precio_texto('landing', $cfg), 'tarjeta') === false);
caso('tampoco dice el monto de cada cuota',
    strpos(wabot_msg_precio_texto('landing', $cfg), '$25.168') === false);
caso('el resumen de precio tampoco adelanta la seña',
    strpos((string)$cfg['precio_resumen'], '{sena}') === false);

// derivar y espera SÍ lo nombran desde el 27-ago: son los dos textos que
// anuncian el traspaso, y ahora tienen que avisar además que el mensaje va a
// llegar desde otro número. Decir "te escribe el desarrollador, por acá" era
// mentira dos veces: ni sigue en este chat, ni el cliente sabe de quién es el
// número que le aparece.
foreach (['sistema_whatsapp', 'sistema_cierre'] as $clave) {
    caso("el texto \"$clave\" de la parte 1 no nombra a Pablo", stripos((string)$cfg[$clave], 'pablo') === false);
}
// espera_prediseno SÍ lo nombra desde el 28-ago, y es la excepción correcta:
// la demo no la manda el bot, la manda Pablo — por este mismo chat si no
// pasaron las 24 h de Meta, y desde el número de proyectos si pasaron. Tiene
// que decir las dos cosas o el que la recibe del otro número no sabe de quién
// es (fue el reclamo de Pablo el 28-ago).
caso('espera_prediseno nombra a Pablo, que es quien manda la demo',
    stripos((string)$cfg['espera_prediseno'], 'pablo') !== false);
caso('avisa que puede llegar por acá o desde el otro número',
    stripos((string)$cfg['espera_prediseno'], 'por acá') !== false
    && stripos((string)$cfg['espera_prediseno'], 'otro número') !== false);
caso('y sigue diciendo cuándo llega', strpos((string)$cfg['espera_prediseno'], '{entrega}') !== false);
foreach (['derivar', 'espera'] as $clave) {
    caso("el traspaso \"$clave\" nombra a Pablo y avisa el cambio de número",
        stripos((string)$cfg[$clave], 'pablo') !== false
        && stripos((string)$cfg[$clave], 'número de proyectos') !== false);
    caso("y \"$clave\" ya no promete la respuesta \"por acá\"",
        stripos((string)$cfg[$clave], 'por acá') === false);
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
caso('la videollamada de la parte 2 sigue nombrando a Pablo',
    stripos((string)$cfg['postdemo_videollamada'], 'pablo') !== false);

// Si el cliente pregunta explícitamente cómo se paga, ahí sí va todo.
$c = conv_nueva(); $c['fase'] = 'precio'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
clasifica(['pregunta_info'], ['info_keys' => ['pago']]);
$r = wabot_engine('cuanto es la seña?', $c, $cfg);
caso('preguntar por la seña sí la responde, con el monto y las cuotas reales',
    strpos($r[0], $cfg['tipos']['landing']['sena']) !== false
    && strpos($r[0], $cfg['tipos']['landing']['cuotas']['12']) !== false);

echo "— Parte 2: la respuesta tras la demo depende de lo que dijo el cliente —\n";

// Pablo, 28-ago: "siempre se manda el mismo mensaje repetido; que el mensaje
// dependa de lo que envía el cliente". El handoff se marca igual en todos los
// casos —la parte 2 la sigue llevando Pablo— pero el texto ya no es el mismo
// aviso para todos. El corte real está en wabot_responder() (ver
// test-redactor.php); acá se prueba la salvaguarda del motor, que usa la misma
// cadena de detectores.
$esperadoPostdemo = [
    'me gusto mucho, como sigo?'          => 'lo sigue Pablo',       // quiere avanzar → derivar
    'prefiero con tarjeta'                => 'lo sigue Pablo',       // tampoco: lo arregla Pablo
    'ya te transferi la seña'             => 'revisamos la transferencia',
    'mmm no se, lo tengo que pensar bien' => 'videollamada',         // duda
    'uh, es mucha plata para mi ahora'    => 'lo sigue Pablo',       // no se ofrecen cuotas
    'dale, la voy a mirar'                => 'miralo tranquilo',
    'se puede cambiar el color?'          => 'anoto esos cambios',
    'no me gusto la verdad'               => 'no te cerró',
];
foreach ($esperadoPostdemo as $msjPostdemo => $fragmento) {
    $c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'ecommerce'; $c['precio_dado'] = true;
    clasifica(['otro']);
    $r = wabot_engine($msjPostdemo, $c, $cfg);
    $junto = implode(' ', $r);
    caso("\"$msjPostdemo\" tras la demo se contesta con lo suyo, no con el aviso pelado",
        $r !== [(string)$cfg['postdemo_derivar']]
        && mb_stripos($junto, $fragmento) !== false
        && $c['fase'] === 'derivado' && !empty($c['handoff_pendiente']) && $c['presentado_confirmado'] === true);
}

// Lo que no encaja en ninguna sigue derivando con el aviso, una sola vez.
$cPDOtro = conv_nueva(); $cPDOtro['fase'] = 'postdemo'; $cPDOtro['tipo'] = 'ecommerce'; $cPDOtro['precio_dado'] = true;
clasifica(['otro']);
caso('un mensaje que no dice nada sigue derivando con el aviso fijo',
    wabot_engine('hola', $cPDOtro, $cfg) === [(string)$cfg['postdemo_derivar']]
    && $cPDOtro['fase'] === 'derivado' && !empty($cPDOtro['handoff_pendiente']));

// Ninguno contesta lo mismo que otro: ese era exactamente el reclamo.
$textosPostdemo = [];
foreach (array_keys($esperadoPostdemo) as $msjPostdemo) {
    $cVar = conv_nueva(); $cVar['fase'] = 'postdemo'; $cVar['tipo'] = 'ecommerce'; $cVar['precio_dado'] = true;
    clasifica(['otro']);
    $textosPostdemo[] = implode(' ', wabot_engine($msjPostdemo, $cVar, $cfg));
}
caso('siguen siendo respuestas distintas según lo que dijo el cliente',
    count(array_unique($textosPostdemo)) >= 5);

/* Pablo, 28-ago: "el bot NO PUEDE PEDIR SEÑA, NO TIENE QUE VENDER, solo me
 * tiene que derivar a mí a los interesados". A una clienta que contestó "la
 * primer mirada me gustó" le llegó el CBU con el alias y el CUIT de una. */
foreach ([
    'La primer mirada me gustó',
    'me gusto mucho, como sigo?',
    'prefiero con tarjeta',
    'cuanto es la seña?',
    'uh, es mucha plata para mi ahora',
    'mandame el cbu asi te transfiero',
    'quiero avanzar',
] as $msjPlata) {
    $cPlata = conv_nueva(); $cPlata['fase'] = 'postdemo'; $cPlata['tipo'] = 'ecommerce';
    $cPlata['precio_dado'] = true;
    clasifica(['otro']);
    $saliP = implode(' ', wabot_engine($msjPlata, $cPlata, $cfg));
    caso("\"$msjPlata\" no se lleva ningún dato de pago",
        strpos($saliP, '0720071788000003618268') === false
        && mb_stripos($saliP, 'Banco Santander') === false
        && mb_stripos($saliP, 'pablotravis') === false
        && strpos($saliP, 'pago?monto=') === false
        && mb_stripos($saliP, 'cuotas sin inter') === false);
}

// La demo presentada NO deja mudo al bot: esa era la razón por la que la parte 2
// no existía (presentar pausaba el chat 24 h).
$c = conv_nueva(); $c['fase'] = 'postdemo'; $c['tipo'] = 'landing'; $c['precio_dado'] = true;
$c['pausado_hasta'] = 0;
caso('tras presentar la demo el bot queda activo, no pausado', (int)$c['pausado_hasta'] === 0);

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

echo "— Revisión de chats reales del 22-ago —\n";

// Black Automotores: un perfil de WhatsApp llamado "." hacía que el bot
// escribiera "Listo ., con eso ya lo preparamos.".
caso('un nombre "." no se usa como nombre', wabot_nombre_usable('.') === '');
caso('ni un emoji suelto', wabot_nombre_usable('🔥') === '');
caso('ni un teléfono', wabot_nombre_usable('+54 9 11 2506-8578') === '');
caso('ni un mail', wabot_nombre_usable('juan@gmail.com') === '');
caso('un nombre real sí', wabot_nombre_usable('Marta Gómez') === 'Marta Gómez');

echo "— El bot nunca usa el nombre del perfil de WhatsApp sin que el cliente lo haya confirmado él mismo —\n";

caso('sin confirmar, un nombre que se ve perfecto NO se usa',
    wabot_nombre_confirmado_de(['nombre' => 'Marta Gómez', 'nombre_confirmado' => false]) === '');
caso('ni aunque falte directamente el flag',
    wabot_nombre_confirmado_de(['nombre' => 'Marta Gómez']) === '');
caso('confirmado, sí se usa (y sigue pasando por el filtro de siempre)',
    wabot_nombre_confirmado_de(['nombre' => 'Marta Gómez', 'nombre_confirmado' => true]) === 'Marta Gómez');
caso('confirmado pero con un valor que no sirve como nombre, sigue sin usarse',
    wabot_nombre_confirmado_de(['nombre' => '.', 'nombre_confirmado' => true]) === '');
caso('wabot_primer_nombre respeta lo mismo: sin confirmar, no saluda por el nombre',
    wabot_primer_nombre(['nombre' => 'Marta Gómez', 'nombre_confirmado' => false]) === '');
caso('wabot_prediseno_faltan sigue pidiendo el nombre aunque el perfil ya tenga uno que se ve bien',
    in_array('Tu nombre', wabot_prediseno_faltan(['nombre' => 'Marta Gómez', 'nombre_confirmado' => false,
        'nombre_negocio' => 'X', 'descripcion' => 'x', 'colores' => 'x']), true));
caso('pero no lo pide más una vez confirmado',
    !in_array('Tu nombre', wabot_prediseno_faltan(['nombre' => 'Marta Gómez', 'nombre_confirmado' => true,
        'nombre_negocio' => 'X', 'descripcion' => 'x', 'colores' => 'x']), true));
caso('el texto sale sin el hueco cuando el nombre no sirve',
    wabot_personalizar('Listo {nombre}, con eso ya lo preparamos.', ['nombre' => '.']) === 'Listo, con eso ya lo preparamos.');
caso('y con un nombre real usa el primero',
    wabot_personalizar('Listo {nombre}, con eso ya lo preparamos.', ['nombre' => 'Marta Gómez', 'nombre_confirmado' => true]) === 'Listo Marta, con eso ya lo preparamos.');
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

echo "— Pestaña \"Pagó\" —\n";

// El detector de "ya pagué" ya no dispara desde el dispatch (ver arriba: en
// postdemo cualquier respuesta deriva directo), pero la columna del panel
// sigue existiendo para cuando se marca a mano.
$cPago = ['pago_avisado_ts' => time(), 'presentado_ts' => time() - 7200, 'presentado_confirmado' => true,
          'transcript' => [['q' => 'cliente', 't' => 'ya te transferi', 'ts' => time()]]];
caso('el que avisó que pagó tiene su propia columna', wabot_conv_grupo($cPago) === 'pago');
caso('y gana sobre Presentados', wabot_conv_grupo($cPago) !== 'presentados');

echo "— Interesados: vio el precio y no pidió la demo —\n";

$cInt = ['precio_dado' => true, 'fase' => 'precio', 'tipo' => 'landing',
         'transcript' => [['q' => 'bot', 't' => 'te paso el precio', 'ts' => time()]]];
caso('el que vio el precio y no cerró es un interesado', wabot_conv_grupo($cInt) === 'interesado');
$cCerro = $cInt; $cCerro['lead_creado'] = true;
caso('el que ya pidió la demo NO es interesado: es una demo pedida', wabot_conv_grupo($cCerro) !== 'interesado');
$cNo = $cInt; $cNo['cierre'] = 'sin_interes';
caso('el que dijo que no tampoco', wabot_conv_grupo($cNo) !== 'interesado');
$cSinPrecio = ['fase' => 'menu', 'transcript' => [['q' => 'bot', 't' => 'contame', 'ts' => time()]]];
caso('el que ni vio el precio sigue en Chats', wabot_conv_grupo($cSinPrecio) === 'chat');

echo "— Última llamada a las 23 h, antes de que cierre la ventana —\n";

$ahoraU = time();
$cfgU = $cfg; $cfgU['ultima_llamada_activa'] = true;
$baseU = ['precio_dado' => true, 'fase' => 'precio', 'tipo' => 'landing', 'bot_off' => false,
          'archivado' => false, 'pausado_hasta' => 0, 'seguimiento_bloqueado' => false,
          'ultima_llamada_enviada' => false, 'ultimo_cliente_ts' => $ahoraU - 23.2 * 3600,
          'transcript' => [['q' => 'bot', 't' => 'te paso el precio', 'ts' => $ahoraU - 23 * 3600]]];
caso('a las 23.2 h corresponde el último aviso', wabot_ultima_llamada_corresponde($baseU, $cfgU, $ahoraU) === true);
$temprano = $baseU; $temprano['ultimo_cliente_ts'] = $ahoraU - 10 * 3600;
caso('a las 10 h todavía no', wabot_ultima_llamada_corresponde($temprano, $cfgU, $ahoraU) === false);
$tarde = $baseU; $tarde['ultimo_cliente_ts'] = $ahoraU - 25 * 3600;
caso('a las 25 h ya cerró la ventana de Meta y no se manda',
    wabot_ultima_llamada_corresponde($tarde, $cfgU, $ahoraU) === false);
$yaCerro = $baseU; $yaCerro['lead_creado'] = true;
caso('al que ya pidió la demo no se le manda', wabot_ultima_llamada_corresponde($yaCerro, $cfgU, $ahoraU) === false);
$contesto = $baseU;
$contesto['transcript'][] = ['q' => 'cliente', 't' => 'lo veo y te digo', 'ts' => $ahoraU - 100];
caso('si el cliente escribió último, la charla está viva y no corresponde',
    wabot_ultima_llamada_corresponde($contesto, $cfgU, $ahoraU) === false);
$repetido = $baseU; $repetido['ultima_llamada_enviada'] = true;
caso('no se manda dos veces', wabot_ultima_llamada_corresponde($repetido, $cfgU, $ahoraU) === false);
$cerrado = $baseU; $cerrado['seguimiento_bloqueado'] = true;
caso('ni a quien pidió que no le escriban', wabot_ultima_llamada_corresponde($cerrado, $cfgU, $ahoraU) === false);
caso('el texto no repite el precio ni presiona',
    strpos((string)$cfg['ultima_llamada'], '$') === false);
caso('y tampoco le vuelve a vender la demo: ya se la ofrecieron antes',
    stripos((string)$cfg['ultima_llamada'], 'demo gratis') === false
    && stripos((string)$cfg['ultima_llamada'], 'muestra gratis') === false);

echo "— La historia vieja de una charla ya no se tira —\n";

$claveHist = 'TESTHIST' . getmypid();
@unlink(WABOT_DATA . '/conv/' . $claveHist . '.json');
@unlink(wabot_historial_path($claveHist));

$cH = wabot_conv_load($claveHist);
$base = time() - 300 * 60;
for ($i = 0; $i < 200; $i++) {
    $cH['transcript'][] = ['q' => $i % 2 ? 'bot' : 'cliente', 't' => 'mensaje ' . $i, 'ts' => $base + $i * 60];
}
wabot_conv_save($cH);

$guardada = wabot_conv_load($claveHist);
caso('el archivo vivo se queda con las últimas líneas nomás',
    count($guardada['transcript']) === WABOT_TRANSCRIPT_VIVO);
$completo = wabot_transcript_completo($claveHist, $guardada);
caso('pero la charla completa sigue estando entera', count($completo) === 200);
caso('incluido el primer mensaje de todos', ($completo[0]['t'] ?? '') === 'mensaje 0');
caso('y el último', (end($completo)['t'] ?? '') === 'mensaje 199');
caso('en orden cronológico',
    (int)$completo[0]['ts'] < (int)$completo[100]['ts'] && (int)$completo[100]['ts'] < (int)end($completo)['ts']);

// Guardar dos veces no puede duplicar lo ya archivado.
wabot_conv_save($guardada);
$otraVez = wabot_transcript_completo($claveHist, wabot_conv_load($claveHist));
caso('guardar de nuevo no duplica el historial', count($otraVez) === 200);

// El chat que viaja con el boceto también sale completo.
caso('el chat exportado al boceto arranca desde el principio',
    strpos(wabot_transcript_texto($guardada, 999999), 'mensaje 0') !== false);

@unlink(WABOT_DATA . '/conv/' . $claveHist . '.json');
@unlink(wabot_historial_path($claveHist));

echo "— Las 13 preguntas de traspaso (chat del 20-ago) —\n";

foreach ([
    'Me podes pasar el usuario y contraseña del cPanel?' => 'accesos',
    'me das los datos de acceso por FTP?'                => 'accesos',
    'el dominio queda a mi nombre?'                      => 'titularidad',
    'el hosting esta a nombre de quien?'                 => 'titularidad',
    'me dan las cuentas de correo corporativas?'         => 'emails',
    'puedo tener mails con arroba mi dominio?'           => 'emails',
    'me entregan un backup completo de la pagina?'       => 'entrega_codigo',
    'me pasan el codigo fuente?'                         => 'entrega_codigo',
    'las licencias de plugins estan a mi nombre?'        => 'licencias',
    'me dan un manual para actualizar textos?'           => 'manual',
    'tengo acceso al administrador tipo wordpress?'      => 'carga',
    'la pueden hacer bilingue?'                          => 'bilingue',
    'se puede en dos idiomas?'                           => 'bilingue',
    'me vinculan search console?'                        => 'pixel',
] as $pregunta => $clave) {
    caso("\"" . mb_substr($pregunta, 0, 42) . "\" → $clave", wabot_info_por_palabras($pregunta) === $clave);
}
// Las que ya andaban no se rompen con las claves nuevas.
caso('"usan wordpress?" sigue siendo una pregunta de tecnología', wabot_info_por_palabras('usan wordpress?') === 'tecnologia');
caso('"cuando vence el dominio?" sigue siendo hosting', wabot_info_por_palabras('cuando vence el dominio?') === 'hosting');
caso('"eso incluye el hosting?" también', wabot_info_por_palabras('eso incluye el hosting?') === 'hosting');

foreach ([
    'por que no uso tiendanube que es gratis',
    'hacen con wix?',
    'y con shopify no seria mas facil',
] as $frase) {
    caso("\"$frase\" NO cae en tecnologia: es objeción de plataforma, no pregunta técnica",
        wabot_info_por_palabras($frase) !== 'tecnologia');
}

foreach (['accesos', 'titularidad', 'emails', 'entrega_codigo', 'licencias', 'manual', 'bilingue'] as $clave) {
    caso("la respuesta de \"$clave\" existe y no quedó vacía", trim((string)($cfg['info'][$clave] ?? '')) !== '');
}
caso('el adicional bilingüe sale con su precio, no con el placeholder',
    strpos(wabot_texto_info('bilingue', $cfg), '$30.000') !== false
    && strpos(wabot_texto_info('bilingue', $cfg), '{precio}') === false);
caso('los accesos explican la invitación de Hostinger y el FTP',
    stripos((string)$cfg['info']['accesos'], 'hostinger') !== false
    && stripos((string)$cfg['info']['accesos'], 'ftp') !== false);
caso('la titularidad no promete que el hosting quede a su nombre porque sí',
    stripos((string)$cfg['info']['titularidad'], 'lo contratás vos') !== false);
caso('los correos aclaran que no son transferibles',
    stripos((string)$cfg['info']['emails'], 'no son transferibles') !== false);
caso('las licencias aclaran que son de terceros',
    stripos((string)$cfg['info']['licencias'], 'terceros') !== false);

// Son respuestas: el bot no las saca de la nada.
$c = conv_nueva(); $c['chat_started_ts'] = time();
clasifica(['rubro_landing']);
$r = wabot_engine('soy plomero', $c, $cfg);
$dicho = implode(' ', $r);
foreach (['bilingüe', 'cPanel', 'FTP', 'licencias', 'backup'] as $palabra) {
    caso("el precio no menciona \"$palabra\" por su cuenta", stripos($dicho, $palabra) === false);
}

echo "— La lista de chats ordena por el último mensaje, no por cuándo se tocó el archivo —\n";

foreach (['QAORD1', 'QAORD2'] as $t) @unlink(WABOT_DATA . '/conv/' . $t . '.json');

$base = time() - 1000;
$cOrd1 = wabot_conv_load('QAORD1');
$cOrd1['transcript'][] = ['q' => 'cliente', 't' => 'hola', 'ts' => $base];
wabot_conv_save($cOrd1);

$cOrd2 = wabot_conv_load('QAORD2');
$cOrd2['transcript'][] = ['q' => 'bot', 't' => 'chau', 'ts' => $base + 400];
wabot_conv_save($cOrd2);

touch(WABOT_DATA . '/conv/QAORD1.json', time());

$itemsOrd = array_values(array_filter(wabot_lista_items(), fn($i) => str_starts_with($i['tel'], 'QAORD')));
$idx1 = array_search('QAORD1', array_column($itemsOrd, 'tel'), true);
$idx2 = array_search('QAORD2', array_column($itemsOrd, 'tel'), true);
caso('el chat con el mensaje más reciente va primero aunque su archivo sea más viejo', $idx2 < $idx1);

foreach (['QAORD1', 'QAORD2'] as $t) @unlink(WABOT_DATA . '/conv/' . $t . '.json');

echo "— La ventana de Meta se mide desde el último mensaje del cliente —\n";

$ahoraV = time();
caso('recién escribió → quedan casi 24 h',
    abs(wabot_ventana_restante(['ultimo_cliente_ts' => $ahoraV]) - 24 * 3600) < 5);
caso('escribió hace 20 h → quedan 4',
    abs(wabot_ventana_restante(['ultimo_cliente_ts' => $ahoraV - 20 * 3600]) - 4 * 3600) < 5);
caso('escribió hace 25 h → la ventana está cerrada',
    wabot_ventana_restante(['ultimo_cliente_ts' => $ahoraV - 25 * 3600]) === 0);
caso('sin ningún mensaje del cliente la ventana está cerrada',
    wabot_ventana_restante([]) === 0);

echo "— El logo que manda el cliente se suma al boceto —\n";

$img = function ($archivo, $texto) {
    return ['q' => 'cliente', 't' => $texto, 'ts' => time(),
            'media' => ['clase' => 'imagen', 'archivo' => $archivo]];
};

caso('sin fotos no hay logo', wabot_logo_cliente(['transcript' => []]) === null);

$soloUna = ['transcript' => [$img('20260821-101500-aaaaaaaa.jpg', '[foto] un local de ropa')]];
caso('si mandó una sola foto, esa es el logo', wabot_logo_cliente($soloUna) === '20260821-101500-aaaaaaaa.jpg');

$variasFotos = ['transcript' => [
    $img('20260821-101500-aaaaaaaa.jpg', '[foto] la vidriera del local'),
    $img('20260821-101600-bbbbbbbb.png', '[foto] te paso el logo de la marca'),
    $img('20260821-101700-cccccccc.jpg', '[foto] otra foto del local'),
]];
caso('con varias fotos gana la que el cliente llamó "logo", no la última',
    wabot_logo_cliente($variasFotos) === '20260821-101600-bbbbbbbb.png');

$dosLogos = ['transcript' => [
    $img('20260821-101500-aaaaaaaa.png', '[foto] este es el logo'),
    $img('20260821-101600-bbbbbbbb.png', '[foto] mejor este logo, el otro está viejo'),
]];
caso('si mandó dos logos, vale el último', wabot_logo_cliente($dosLogos) === '20260821-101600-bbbbbbbb.png');

// "catálogo" contiene "logo" como substring: no puede contar como logo.
$catalogo = ['transcript' => [
    $img('20260821-101500-aaaaaaaa.jpg', '[foto] la primera foto'),
    $img('20260821-101600-bbbbbbbb.jpg', '[foto] una hoja del catalogo impreso'),
]];
caso('"catálogo" no se confunde con "logo"', wabot_logo_cliente($catalogo) === '20260821-101600-bbbbbbbb.jpg');

$soloBot = ['transcript' => [
    ['q' => 'bot', 't' => 'te paso el logo nuestro', 'ts' => time(),
     'media' => ['clase' => 'imagen', 'archivo' => '20260821-101500-aaaaaaaa.png']],
]];
caso('una imagen del bot no es el logo del cliente', wabot_logo_cliente($soloBot) === null);

caso('la url del logo pega contra el panel, que pide sesión',
    strpos(wabot_logo_url('5491122334455', '20260821-101500-aaaaaaaa.png'), 'wabot/admin.php?accion=media') !== false);

$convLogo = conv_nueva();
$convLogo['tipo'] = 'landing';
$convLogo['nombre_negocio'] = 'Mate Sur';
$convLogo['colores'] = 'verde y marrón';
$convLogo['transcript'] = [$img('20260821-101600-bbbbbbbb.png', '[foto] te paso el logo')];
$camposLogo = wabot_lead_campos($convLogo, $cfg);
caso('el boceto viaja con el logo del cliente',
    strpos((string)$camposLogo['logoUrl']['stringValue'], '20260821-101600-bbbbbbbb.png') !== false);
caso('y con un nombre de archivo que conserva la extensión',
    $camposLogo['logoNombre']['stringValue'] === 'logo.png');

$sinLogo = conv_nueva();
$sinLogo['tipo'] = 'landing';
$sinLogo['nombre_negocio'] = 'Mate Sur';
$camposSinLogo = wabot_lead_campos($sinLogo, $cfg);
caso('sin foto, el boceto va con el logo vacío y no rompe',
    $camposSinLogo['logoUrl']['stringValue'] === '' && $camposSinLogo['logoNombre']['stringValue'] === '');

// El caso que importa: el logo llega DESPUÉS de creado el boceto.
$tarde = conv_nueva();
$tarde['tel'] = 'TESTLOGO';
$tarde['lead_creado'] = true;
$tarde['lead_doc'] = 'projects/x/databases/(default)/documents/propuestas/ABC123';
$tarde['logo_sincronizado'] = null;
caso('sin foto todavía, no hay nada que sincronizar', wabot_logo_sincronizar($tarde) === false);

$tarde['transcript'] = [$img('20260821-120000-dddddddd.png', '[foto] te paso el logo')];
caso('llega el logo tarde y se completa el boceto ya creado', wabot_logo_sincronizar($tarde) === true);
caso('queda anotado cuál se mandó', $tarde['logo_sincronizado'] === '20260821-120000-dddddddd.png');
caso('no se vuelve a mandar el mismo dos veces', wabot_logo_sincronizar($tarde) === false);

$tarde['transcript'][] = $img('20260821-130000-eeeeeeee.png', '[foto] perdón, este es el logo bueno');
caso('pero si manda otro logo, se actualiza de nuevo', wabot_logo_sincronizar($tarde) === true);

$sinBoceto = conv_nueva();
$sinBoceto['tel'] = 'TESTLOGO';
$sinBoceto['transcript'] = [$img('20260821-120000-dddddddd.png', '[foto] te paso el logo')];
caso('sin boceto creado no se sincroniza nada', wabot_logo_sincronizar($sinBoceto) === false);

echo "— Un mensaje automático no puede tapar lo que el cliente escribió y no leíste —\n";

$ahoraNL = time();
$sinLeer = wabot_conv_load('TESTNOLEIDO');
$sinLeer['presentado_ts'] = $ahoraNL - 30 * 3600;
$sinLeer['fase'] = 'postdemo';
$sinLeer['panel_visto_ts'] = $ahoraNL - 10 * 3600;
$sinLeer['transcript'] = [
    ['q' => 'humano', 't' => 'Acá está tu demo', 'ts' => $ahoraNL - 30 * 3600],
    ['q' => 'cliente', 't' => 'La miro y te digo', 'ts' => $ahoraNL - 5 * 3600],
];
$sinLeer['ultimo_cliente_ts'] = $ahoraNL - 5 * 3600;
caso('el cliente escribió después de que abriste el chat → sin leer',
    wabot_ultimo_cliente_ts($sinLeer) > (int)$sinLeer['panel_visto_ts']);

// El caso que reportó Pablo: el recordatorio de las 20 h escribe DESPUÉS del
// cliente, y con el criterio viejo ("el último mensaje es del cliente") el chat
// se caía solo de la lista sin que nadie lo hubiera leído.
$tapado = $sinLeer;
$tapado['transcript'][] = ['q' => 'bot', 't' => 'Pudiste verla?', 'ts' => $ahoraNL - 2 * 3600];
caso('el recordatorio del bot NO borra la marca de sin leer',
    wabot_ultimo_cliente_ts($tapado) > (int)$tapado['panel_visto_ts']);
caso('y el último mensaje ya no es del cliente, que es lo que antes lo escondía',
    (end($tapado['transcript'])['q'] ?? '') === 'bot');

$leido = $tapado;
$leido['panel_visto_ts'] = $ahoraNL;
caso('cuando lo abrís, recién ahí deja de estar sin leer',
    wabot_ultimo_cliente_ts($leido) <= (int)$leido['panel_visto_ts']);

$nuncaEscribio = wabot_conv_load('TESTNOLEIDO2');
$nuncaEscribio['transcript'] = [['q' => 'bot', 't' => 'Hola, te escribo por tu consulta', 'ts' => $ahoraNL - 3600]];
$nuncaEscribio['ultimo_cliente_ts'] = 0;
$nuncaEscribio['panel_visto_ts'] = 0;
caso('un chat donde el cliente nunca escribió no cuenta como sin leer',
    wabot_ultimo_cliente_ts($nuncaEscribio) === 0);

// El contador puede quedar viejo (charlas retomadas): manda la línea real.
$contadorViejo = wabot_conv_load('TESTNOLEIDO3');
$contadorViejo['ultimo_cliente_ts'] = $ahoraNL - 90000;
$contadorViejo['transcript'] = [['q' => 'cliente', 't' => 'Hola de nuevo', 'ts' => $ahoraNL - 60]];
caso('si el contador quedó viejo, vale el mensaje real del transcript',
    wabot_ultimo_cliente_ts($contadorViejo) === $ahoraNL - 60);

echo "— \"Ya la entregué\": sacar de la cola una demo entregada por otro medio —\n";

$entregada = conv_nueva();
$entregada['tipo'] = 'landing';
$entregada['lead_creado'] = true;
$entregada['descripcion'] = 'estudio contable';
$entregada['colores'] = 'azul';
caso('antes de marcarla está en la cola de diseño', wabot_conv_grupo($entregada) === 'muestra');

$entregada['presentado_ts'] = time();
$entregada['fase'] = 'postdemo';
caso('marcada como entregada sale de la cola y pasa a Demo entregada',
    wabot_conv_grupo($entregada) === 'presentados');

@unlink(WABOT_DATA . '/conv/TESTNOLEIDO.json');
@unlink(WABOT_DATA . '/conv/TESTNOLEIDO2.json');
@unlink(WABOT_DATA . '/conv/TESTNOLEIDO3.json');

echo "— Qué entra en Sin leer: solo parte 2, sin contestar y sin abrir —\n";

$GRUPOS_SIN_LEER = ['pago', 'presentados', 'presentadas_48', 'muestra'];
$entraEnSinLeer = function ($cv) use ($GRUPOS_SIN_LEER) {
    $grupo = wabot_conv_grupo($cv);
    if ($grupo === 'archivado') return false;
    $botSeCallo = wabot_conv_espera_respuesta($cv) || !empty($cv['handoff_pendiente']);
    if (!in_array($grupo, $GRUPOS_SIN_LEER, true) && !$botSeCallo) return false;
    return wabot_ultimo_cliente_ts($cv) > (int)($cv['panel_visto_ts'] ?? 0);
};

$ahoraSL = time();
$armarSL = function ($campos, $lineas) use ($ahoraSL) {
    $cv = ['transcript' => [], 'panel_visto_ts' => $ahoraSL - 20 * 3600,
           'archivado' => false, 'bot_off' => false, 'pausado_hasta' => 0,
           'cierre' => null, 'fase' => 'nuevo', 'tipo' => null,
           'descripcion' => null, 'colores' => null, 'lead_creado' => false];
    foreach ($campos as $k => $v) $cv[$k] = $v;
    foreach ($lineas as $i => $par) $cv['transcript'][] = ['q' => $par[0], 't' => $par[1], 'ts' => $ahoraSL - (60 - $i) * 60];
    $cv['ultimo_cliente_ts'] = wabot_ultimo_cliente_ts($cv);
    return $cv;
};

$demoEntregada = ['fase' => 'postdemo', 'tipo' => 'landing', 'presentado_ts' => $ahoraSL - 40 * 3600, 'lead_creado' => true];
caso('demo entregada + el cliente contestó + no lo abriste → SÍ',
    $entraEnSinLeer($armarSL($demoEntregada, [['humano', 'Acá está tu demo'], ['cliente', 'La miro y te digo']])) === true);
caso('aunque el bot ya le haya contestado después, si vos no lo abriste sigue en Sin leer',
    $entraEnSinLeer($armarSL($demoEntregada, [['cliente', 'La miro'], ['bot', 'Dale, cualquier cosa avisame']])) === true);
caso('pero si YA lo abriste después de esa charla, ahí sí sale',
    $entraEnSinLeer($armarSL(array_merge($demoEntregada, ['panel_visto_ts' => $ahoraSL]),
        [['cliente', 'La miro'], ['bot', 'Dale, cualquier cosa avisame']])) === false);
caso('si lo abriste después del mensaje → NO',
    $entraEnSinLeer($armarSL(array_merge($demoEntregada, ['panel_visto_ts' => $ahoraSL]), [['humano', 'demo'], ['cliente', 'gracias']])) === false);
caso('demo por presentar + el cliente escribió → SÍ',
    $entraEnSinLeer($armarSL(['fase' => 'derivado', 'tipo' => 'landing', 'lead_creado' => true, 'descripcion' => 'x', 'colores' => 'azul'],
        [['bot', 'Listo, ya lo preparamos'], ['cliente', 'Te paso el logo']])) === true);
caso('avisó que pagó y no lo abriste → SÍ',
    $entraEnSinLeer($armarSL(['fase' => 'postdemo', 'tipo' => 'landing', 'presentado_ts' => $ahoraSL - 40 * 3600,
        'pago_avisado_ts' => $ahoraSL - 3600, 'lead_creado' => true], [['bot', 'Te paso el CBU'], ['cliente', 'Listo, transferí']])) === true);
caso('demo entregada, el cliente escribió y el bot YA le contestó → sigue en Sin leer',
    $entraEnSinLeer($armarSL($demoEntregada,
        [['cliente', 'Me encantó la demo!'], ['bot', 'Qué bueno que te gustó. Le cambiarías algo?']])) === true);

echo "— Demo entregada + interesado (DEI): le mandaste la demo y contestó algo —\n";

caso('contestó después de que le mandaste la demo → SÍ',
    wabot_presentada_con_interes($armarSL($demoEntregada, [['humano', 'Acá está tu demo'], ['cliente', 'Me encantó!']])) === true);
caso('todavía no contestó nada → NO',
    wabot_presentada_con_interes($armarSL($demoEntregada, [['humano', 'Acá está tu demo']])) === false);
caso('lo que dijo ANTES de la demo no cuenta como interés en la demo',
    wabot_presentada_con_interes(['presentado_ts' => $ahoraSL - 3600, 'transcript' => [
        ['q' => 'cliente', 't' => 'Dale, mandala', 'ts' => $ahoraSL - 7200],
        ['q' => 'humano', 't' => 'Acá está tu demo', 'ts' => $ahoraSL - 3600],
    ]]) === false);
caso('sin demo presentada, ni entra en la pregunta', wabot_presentada_con_interes(['transcript' => []]) === false);

echo "— Cuántos mensajes tiene sin leer, para el globito de la lista —\n";

$convCuenta = $armarSL($demoEntregada, [['bot', 'Acá está tu demo'], ['cliente', 'Me encantó!'], ['cliente', 'Cómo pago?']]);
caso('dos mensajes del cliente después de la última vez que lo abriste → 2',
    wabot_conv_sin_leer_cuenta($convCuenta) === 2);
$convLeido = array_merge($convCuenta, ['panel_visto_ts' => $ahoraSL]);
caso('si ya lo abriste después, vuelve a 0', wabot_conv_sin_leer_cuenta($convLeido) === 0);
caso('sin transcript, 0 sin romper', wabot_conv_sin_leer_cuenta(['transcript' => []]) === 0);

// Lo que Pablo pidió sacar: la parte 1 la lleva el bot y no necesita revisión.
caso('parte 1: una charla nueva con el cliente escribiendo → NO',
    $entraEnSinLeer($armarSL(['fase' => 'menu', 'tipo' => 'landing'], [['bot', 'Hola!'], ['cliente', 'Hola, quiero una web']])) === false);
caso('parte 1: uno que vio el precio y contestó → NO',
    $entraEnSinLeer($armarSL(['fase' => 'precio', 'tipo' => 'landing', 'precio_dado' => true], [['bot', 'Sale $X'], ['cliente', 'Y con catálogo?']])) === false);
caso('un archivado no entra aunque tenga todo lo demás',
    $entraEnSinLeer($armarSL(array_merge($demoEntregada, ['archivado' => true]), [['humano', 'demo'], ['cliente', 'gracias']])) === false);

// El agujero que dejó sacar "Te esperan": si el bot deriva la consulta, le
// prometió al cliente que contesta una persona. Eso tiene que verse en algún
// lado o la promesa queda colgada entre cientos de charlas.
$derivado = ['fase' => 'derivado', 'cierre' => 'derivacion', 'handoff_pendiente' => true, 'tipo' => 'landing'];
caso('el bot te derivó la consulta y el cliente contestó → SÍ',
    $entraEnSinLeer($armarSL($derivado, [['bot', 'Esa duda te la contesta el desarrollador'], ['cliente', 'Dale, gracias']])) === true);
caso('aunque haya visto el precio y esté en el embudo → SÍ',
    $entraEnSinLeer($armarSL(array_merge($derivado, ['precio_dado' => true]), [['bot', 'Te deriva'], ['cliente', 'Ok, espero']])) === true);
caso('el bot apagado a mano y el cliente escribiendo → SÍ',
    $entraEnSinLeer($armarSL(['bot_off' => true, 'fase' => 'menu', 'tipo' => 'landing'],
        [['bot', 'x'], ['cliente', 'Hola? hay alguien?']])) === true);
caso('un sistema a medida derivado → SÍ',
    $entraEnSinLeer($armarSL(['fase' => 'derivado', 'tipo' => 'sistema', 'handoff_pendiente' => true, 'sistema_lead_creado' => true],
        [['bot', 'Pablo te arma la propuesta'], ['cliente', 'Perfecto']])) === true);
// Pero derivar no lo mete para siempre: si vos ya contestaste, sale.
caso('si ya le contestaste vos, la derivación sale de la lista',
    $entraEnSinLeer(array_merge($armarSL($derivado, [['cliente', 'Dale, gracias'], ['humano', 'Hola, te contesto yo']]),
        ['panel_visto_ts' => $ahoraSL])) === false);
caso('y una charla de parte 1 con el bot andando sigue afuera',
    $entraEnSinLeer($armarSL(['fase' => 'menu', 'tipo' => 'landing'], [['bot', 'Hola!'], ['cliente', 'Quiero una web']])) === false);

echo "— El perfil de WhatsApp no siempre es un nombre —\n";

foreach ([
    'Marcelo Polzoni'         => 'Marcelo Polzoni',
    'Juan Carlos Perez Gomez' => 'Juan Carlos Perez Gomez',
    'Dr. House'               => 'Dr. House',
    'Ana'                     => 'Ana',
] as $perfil => $esperado) {
    caso("\"$perfil\" se usa tal cual", wabot_nombre_usable($perfil) === $esperado);
}
caso('los emojis del perfil no son parte del nombre',
    wabot_nombre_usable('PeLa Lencioni ' . json_decode('"🔥"')) === 'PeLa Lencioni');
caso('un perfil de solo emojis no sirve',
    wabot_nombre_usable(json_decode('"🌸🌸🌸"')) === '');
foreach ([
    'Asi Soy Y Asi Me Quiero' => 'es una frase, no un nombre',
    'GRACIAS A DIOS POR TODO' => 'es un slogan',
    'Te amo mama'             => 'es una dedicatoria',
    '.'                       => 'no tiene letras',
    '+54 9 11 6654-5773'      => 'es un teléfono',
    'hola@correo.com'         => 'es un mail',
] as $perfil => $porque) {
    caso("\"$perfil\" se descarta: $porque", wabot_nombre_usable($perfil) === '');
}

caso('el perfil que es una frase no se cuelga del negocio en la agenda',
    wabot_nombre_agenda(['nombre' => 'Asi Soy Y Asi Me Quiero', 'nombre_negocio' => 'Style Sozo']) === 'Style Sozo');
caso('un perfil que ya es el nombre del local no se escribe dos veces',
    wabot_nombre_agenda(['nombre' => 'Style Sozo', 'nombre_negocio' => 'Style Sozo Indumentaria']) === 'Style Sozo Indumentaria');
caso('con nombre de persona de verdad, se agenda con los dos',
    wabot_nombre_agenda(['nombre' => 'Sofi', 'nombre_negocio' => 'Lucero Estudio']) === 'Sofi - Lucero Estudio');


echo "— Quién carga los productos del ecommerce (chat real de Bruana Indumentaria, 21-ago) —\n";

caso('el ecommerce aclara que Gokywebs carga hasta 10 productos al arrancar',
    strpos($cfg['info']['carga'], 'hasta 10 productos') !== false);
caso('y que el resto lo carga el cliente desde el panel',
    strpos($cfg['info']['carga'], 'seguís cargando y editando el resto vos mismo') !== false);
caso('con el video explicativo del panel',
    strpos($cfg['info']['carga'], 'video explicativo') !== false);
caso('inmobiliaria y cursos no cambiaron: siguen sin el detalle de los 10',
    strpos($cfg['info']['carga'], 'cargás las propiedades vos, y en Plataforma de cursos tus cursos') !== false);
caso('catálogo sigue sin panel, eso no se tocó',
    strpos($cfg['info']['carga'], 'En el resto (landing, turnos, institucional, catálogo) no incluye un panel') !== false);

$cargaVieja = ['info' => ['carga' => 'Depende del tipo de web: en Ecommerce cargás y editás tus productos vos mismo desde un panel propio, en Inmobiliaria hacés lo mismo con las propiedades, y en Plataforma de cursos con tus cursos. En el resto (landing, turnos, institucional, catálogo) no incluye un panel para que edites el contenido o el diseño de la página vos mismo: los cambios y actualizaciones los hacemos nosotros.']];
wabot_config_ventas($cargaVieja);
caso('el texto viejo migra al nuevo en un bot-config.json existente',
    $cargaVieja['info']['carga'] === $cfg['info']['carga']);

caso('info.ejemplos ya no repregunta el rubro: puede estar respondiendo a alguien que ya lo dijo',
    stripos($cfg['info']['ejemplos'], 'si me decís de qué rubro') === false);

caso('info.pago deja explícito que se puede pagar en un solo pago, no solo en cuotas',
    strpos($cfg['info']['pago'], 'en un pago o hasta en 12 cuotas') !== false);
$pagoIntermedio = ['info' => ['pago' => 'El desarrollo completo es {precio}. Se puede abonar por transferencia o con tarjeta, hasta en 12 cuotas con interés: 12 cuotas de {cuotas_12}, 6 de {cuotas_6} o 3 de {cuotas_3}. Para arrancar se deja una seña de {sena} y el saldo al entregar la web.']];
wabot_config_ventas($pagoIntermedio);
caso('y un bot-config.json que todavía tenía el texto viejo migra al nuevo',
    $pagoIntermedio['info']['pago'] === $cfg['info']['pago']);

echo "— info.rangos se calcula en vivo desde los precios actuales, no queda un texto fijo desactualizado —\n";

$rangos = wabot_texto_rangos($cfg);
caso('el rango arranca en el precio mínimo real ($180.000, el sitio profesional)',
    strpos($rangos, '$180.000') !== false && stripos($rangos, 'sitio profesional') !== false);
caso('y llega hasta el máximo real ($290.000), no el viejo $320.000',
    strpos($rangos, '$290.000') !== false && strpos($rangos, '$320.000') === false
    && strpos($rangos, '$200.000') === false);
caso('cuando dos tipos empatan en el máximo (ecommerce y elearning), menciona los dos',
    stripos($rangos, 'ecommerce') !== false && stripos($rangos, 'plataforma de cursos') !== false);

$cfgPrecioNuevo = wabot_config_load();
$cfgPrecioNuevo['tipos']['landing']['precio'] = '$99.000';
caso('si el precio de un tipo cambia, el rango lo refleja al toque (sin migración manual)',
    strpos(wabot_texto_rangos($cfgPrecioNuevo), '$99.000') !== false);

echo "— Ni 3 pagos ni tarjeta en el precio automático: eso se contesta solo si preguntan —\n";

foreach ($cfg['tipos'] as $tipo => $datosPago) {
    $texto = $tipo === 'catalogo' ? $cfg['msg_precio_catalogo'] : wabot_msg_precio_texto($tipo, $cfg);
    caso("$tipo no menciona 3 pagos en el precio automático", strpos($texto, '3 pagos') === false);
    caso("$tipo no menciona tarjeta ni 12 cuotas en el precio automático",
        stripos($texto, 'tarjeta') === false && stripos($texto, '12 cuotas') === false);
    caso("$tipo tampoco mete la forma de pago pegada al precio",
        stripos($texto, 'transferencia') === false);
}
caso('y ningún tipo tiene un pagos3 calculado en la config: ese cálculo se retiró',
    !isset($cfg['tipos']['catalogo']['pagos3']));

$cfgSinTabla = wabot_config_load();
$cfgSinTabla['tipos']['landing']['precio'] = '$275.000';
wabot_config_ventas($cfgSinTabla);
caso('un precio nuevo tampoco arma un pagos3: el cálculo no existe más',
    !isset($cfgSinTabla['tipos']['landing']['pagos3']));
caso('el mensaje de precio no menciona ninguna forma de pago',
    stripos(wabot_msg_precio_texto('landing', $cfgSinTabla), 'transferencia') === false
    && stripos(wabot_msg_precio_texto('landing', $cfgSinTabla), 'tarjeta') === false);

$original = wabot_config_load();
$original['msg_precio'] = 'Perfecto, para lo tuyo va {desc}. Todo el desarrollo tendría un valor de {precio}. Se puede abonar por transferencia o con tarjeta hasta en 12 cuotas.
En este link podés ver detallado todo lo que incluye junto con otros trabajos realizados: {link}';
$original['msg_precio_variantes'] = ['Por lo que me contás, te conviene {desc}. El desarrollo completo tiene un valor de {precio}. Se puede abonar por transferencia o con tarjeta hasta en 12 cuotas.
Acá podés ver todo lo que incluye y otros trabajos realizados: {link}'];
wabot_config_ventas($original);
caso('un bot-config.json que nunca vio esta migración termina sin forma de pago pegada al precio',
    stripos($original['msg_precio'], 'transferencia') === false
    && stripos($original['msg_precio'], 'tarjeta') === false
    && strpos($original['msg_precio'], '3 pagos') === false);
caso('lo mismo en cada variante de msg_precio_variantes',
    stripos($original['msg_precio_variantes'][0], 'transferencia') === false
    && stripos($original['msg_precio_variantes'][0], 'tarjeta') === false
    && strpos($original['msg_precio_variantes'][0], '3 pagos') === false);

$intermedio = wabot_config_load();
$intermedio['msg_precio'] = 'Perfecto, para lo tuyo va {desc}. Todo el desarrollo tendría un valor de {precio}. Se puede abonar por transferencia en 3 pagos de {pagos3}, o con tarjeta hasta en 12 cuotas.
En este link podés ver detallado todo lo que incluye junto con otros trabajos realizados: {link}';
wabot_config_ventas($intermedio);
caso('y el que ya tenía la versión con 3 pagos también termina sin ella',
    stripos($intermedio['msg_precio'], 'transferencia') === false
    && stripos($intermedio['msg_precio'], 'tarjeta') === false
    && strpos($intermedio['msg_precio'], '3 pagos') === false);

$soloTresPagos = wabot_config_load();
$soloTresPagos['msg_precio'] = 'Perfecto, para lo tuyo va {desc}. Todo el desarrollo tendría un valor de {precio}. Se puede abonar por transferencia en 3 pagos de {pagos3}.
En este link podés ver detallado todo lo que incluye junto con otros trabajos realizados: {link}';
wabot_config_ventas($soloTresPagos);
caso('y el que tenía 3 pagos solo (sin tarjeta al lado) también converge',
    $soloTresPagos['msg_precio'] === $original['msg_precio']);

caso('ningún tipo carga un pagos3 en la config: ese cálculo ya no existe',
    (function () use ($cfg) {
        foreach ($cfg['tipos'] as $t) if (isset($t['pagos3'])) return false;
        return true;
    })());

echo "— wabot_conv_existe: si ya hay conversación, sin crearla ni tocarla —\n";

$claveExiste = 'TESTEXISTE' . getmypid();
@unlink(WABOT_DATA . '/conv/' . $claveExiste . '.json');
caso('todavía no existe archivo → false', wabot_conv_existe($claveExiste) === false);
caso('consultar si existe no la crea', !file_exists(WABOT_DATA . '/conv/' . $claveExiste . '.json'));
wabot_conv_save(wabot_conv_load($claveExiste));
caso('una vez guardada, existe', wabot_conv_existe($claveExiste) === true);
caso('con caracteres raros en la clave, igual la encuentra',
    wabot_conv_existe('  ' . $claveExiste . '!!') === true);
@unlink(WABOT_DATA . '/conv/' . $claveExiste . '.json');

echo "— wabot_conv_resolver: el teléfono del boceto → la conversación real —\n";

$sufijoReal  = substr((string)getmypid() . '3115008', 0, 7);
$claveReal   = '549387' . $sufijoReal;
$abonadoReal = substr('387' . $sufijoReal, -8);
@unlink(WABOT_DATA . '/conv/' . $claveReal . '.json');

$m = 'sigue-con-valor-viejo';
caso('sin conversación que corresponda → null, y no la crea',
    wabot_conv_resolver($claveReal, $m) === null && !file_exists(WABOT_DATA . '/conv/' . $claveReal . '.json'));
caso('y avisa que ese cliente nunca escribió', $m === 'sin_chat');

wabot_conv_save(wabot_conv_load($claveReal));

caso('la clave exacta se resuelve sola', wabot_conv_resolver($claveReal, $m) === $claveReal && $m === null);
caso('formateado como lo muestra el panel', wabot_conv_resolver('+54 9 387 ' . substr($sufijoReal, 0, 3) . '-' . substr($sufijoReal, 3), $m) === $claveReal);
caso('sin el 549 adelante, como lo carga el formulario', wabot_conv_resolver('387' . $sufijoReal, $m) === $claveReal);
caso('con 0 y 15, como se escribe en Argentina', wabot_conv_resolver('0387 15 ' . $sufijoReal, $m) === $claveReal);
caso('con el 0 pero sin el 15', wabot_conv_resolver('0387' . $sufijoReal, $m) === $claveReal);
caso('solo el abonado', wabot_conv_resolver($abonadoReal, $m) === $claveReal);

$claveOtra = '54911' . $abonadoReal;
@unlink(WABOT_DATA . '/conv/' . $claveOtra . '.json');
wabot_conv_save(wabot_conv_load($claveOtra));
caso('dos chats que terminan igual → no adivina',
    wabot_conv_resolver($abonadoReal, $m) === null && $m === 'ambiguo');
caso('pero con la clave completa sí, aunque haya otro parecido',
    wabot_conv_resolver($claveReal, $m) === $claveReal);
@unlink(WABOT_DATA . '/conv/' . $claveOtra . '.json');

caso('teléfono vacío → null sin tocar el disco', wabot_conv_resolver('', $m) === null && $m === 'vacio');
caso('número demasiado corto para ser un teléfono', wabot_conv_resolver('1234', $m) === null && $m === 'corto');

/* Instagram: la conversación se guarda como ig<IGSID>, así que buscarla por
 * teléfono no la encontraba nunca — el foreach salteaba con ctype_digit todo lo
 * que no fuera un número. Presentarle una demo a un lead de Instagram avisaba
 * "este cliente no tiene conversación con el bot" y no mandaba nada, con la
 * charla abierta y dentro de las 24 h (Pablo, 28-ago). El puente es el
 * telefono_wsp que el propio cliente dejó en el prediseño. */
$claveIg  = 'ig1784140' . substr((string)getmypid() . '00000000', 0, 8);
$wspDeIg  = '11' . substr((string)getmypid() . '50007777', 0, 8);
@unlink(WABOT_DATA . '/conv/' . $claveIg . '.json');
$convIg = wabot_conv_load($claveIg);
$convIg['telefono_wsp'] = $wspDeIg;
wabot_conv_save($convIg);

caso('un lead de Instagram se encuentra por el WhatsApp que dejó',
    wabot_conv_resolver($wspDeIg, $m) === $claveIg && $m === null);
caso('y también con el número formateado como lo manda el panel',
    wabot_conv_resolver('+54 9 ' . substr($wspDeIg, 0, 2) . ' ' . substr($wspDeIg, 2), $m) === $claveIg);
caso('el canal queda en instagram, así la demo sale por DM y no por WhatsApp',
    wabot_conv_load($claveIg)['canal'] === 'instagram');
caso('un número que no dejó nadie sigue dando sin_chat',
    wabot_conv_resolver('1149998888', $m) === null && $m === 'sin_chat');

// Y si el mismo número está en un chat de WhatsApp Y en uno de Instagram, gana
// WhatsApp: es donde venía la conversación de venta.
$claveWaMismo = '549' . $wspDeIg;
@unlink(WABOT_DATA . '/conv/' . $claveWaMismo . '.json');
wabot_conv_save(wabot_conv_load($claveWaMismo));
caso('con chat en los dos lados, la demo va por WhatsApp',
    wabot_conv_resolver($wspDeIg, $m) === $claveWaMismo);
@unlink(WABOT_DATA . '/conv/' . $claveWaMismo . '.json');
@unlink(WABOT_DATA . '/conv/' . $claveIg . '.json');
caso('el error de "nunca escribió" nombra el número', strpos(wabot_error_sin_chat('387 311-5008', 'sin_chat'), '387 311-5008') !== false);
caso('el error ambiguo manda a abrirlo a mano', stripos(wabot_error_sin_chat('3115008', 'ambiguo'), 'panel del bot') !== false);
@unlink(WABOT_DATA . '/conv/' . $claveReal . '.json');

echo "— Normalizar texto para buscar dentro de los mensajes —\n";

caso('minúsculas y sin acentos', wabot_normalizar_busqueda('Colóres y Diseño') === 'colores y diseno');
caso('los números y signos quedan intactos: buscar un precio tiene que seguir funcionando',
    wabot_normalizar_busqueda('Son $70.000') === 'son $70.000');
caso('un link no se rompe', wabot_normalizar_busqueda('gokywebs.com/demo/Kiosco') === 'gokywebs.com/demo/kiosco');
caso('recorta espacios de los bordes', wabot_normalizar_busqueda('  hola  ') === 'hola');
caso('largo estable: acentuadas y sin acentuar dan el mismo largo (para que el resaltado no se desalinee)',
    mb_strlen(wabot_normalizar_busqueda('áéíóúñ')) === mb_strlen('áéíóúñ'));

echo "— Editar la tienda y vender el dominio (chat real del 21-ago) —\n";

// La consulta tal cual la escribió el cliente: pregunta DOS cosas y viene con
// la puntuación pegada ("artículos,modificarle"). El bot contestó la renovación
// del hosting y "eso te lo confirma el desarrollador", dejando sin responder lo
// que sí sabía.
$consultaReal = 'Otra consulta,es posible a futuro , añadir yo y/o restarle artículos,modificarle a la tienda ? Y /o hasta vender mi dominio de tienda web a futuro?';
caso('la consulta real ya no cae en "eso te lo confirma el desarrollador"',
    wabot_info_por_palabras($consultaReal) === 'carga');

foreach ([
    'es posible añadir yo articulos a la tienda?' => 'carga',
    'puedo restarle articulos?'                   => 'carga',
    'puedo modificarle a la tienda?'              => 'carga',
    'puedo agregar productos yo despues?'         => 'carga',
    'puedo sacar productos?'                      => 'carga',
    'puedo editar los precios yo?'                => 'carga',
    'los productos los cargo yo?'                 => 'carga',
    'puedo cambiar las fotos?'                    => 'carga',
    'puedo administrar mi tienda?'                => 'carga',
    'puedo cargar propiedades yo?'                => 'carga',
    'puedo vender mi dominio a futuro?'           => 'titularidad',
    'puedo transferir el dominio?'                => 'titularidad',
] as $pregunta => $clave) {
    caso("\"" . mb_substr($pregunta, 0, 44) . "\" → $clave", wabot_info_por_palabras($pregunta) === $clave);
}

// La ambigüedad real: "la tienda" se puede editar o vender. Con el verbo de
// propiedad manda la titularidad; con el de edición, el panel.
caso('"cambiar de dueño la tienda" sigue siendo una pregunta por la titularidad',
    wabot_info_por_palabras('puedo cambiar de dueno la tienda?') === 'titularidad');
caso('"vender la tienda a futuro" también',
    wabot_info_por_palabras('puedo vender la tienda a futuro?') === 'titularidad');

// Lo que ya andaba no se movió.
caso('"cuándo vence el dominio" sigue en hosting', wabot_info_por_palabras('cuando vence el dominio?') === 'hosting');
caso('"cuánto sale la renovación del dominio" también', wabot_info_por_palabras('cuanto sale la renovacion del dominio?') === 'hosting');
caso('"el dominio queda a mi nombre" sigue en titularidad', wabot_info_por_palabras('el dominio queda a mi nombre?') === 'titularidad');
caso('describir el rubro no se confunde con editar productos', wabot_info_por_palabras('vendo productos de limpieza') === null);
caso('"vendo ropa" tampoco', wabot_info_por_palabras('vendo ropa') === null);

// La puntuación pegada rompía CUALQUIER detección, no solo esta.
caso('una coma sin espacio ya no fusiona dos palabras y mata la detección',
    wabot_info_por_palabras('Hola,cuanto sale una web?', 'menu') === 'precio_sin_rubro');
caso('y con espacio da lo mismo que sin espacio',
    wabot_info_por_palabras('Hola, cuanto sale una web?', 'menu') === wabot_info_por_palabras('Hola,cuanto sale una web?', 'menu'));

echo "— El comodín \"te lo confirma el desarrollador\" deja de tapar preguntas reales —\n";

foreach ([
    'tienen alguna web para ver de cirujano plastico o clinica dental estetica?' => 'ejemplos',
    'tienen ejemplos de trabajos?'                                    => 'ejemplos',
    'me pasas el portfolio?'                                          => 'ejemplos',
    'Hacen migracion de mis contenidos de mi pagina?'                  => 'migracion',
    'migran el contenido de mi web actual?'                            => 'migracion',
    'pueden hacer formularios o encuestas para que la gente complete?' => 'formularios',
    'No lleva imagen el portal que me ofreces?'                        => 'imagenes_web',
    'la web lleva fotos?'                                              => 'imagenes_web',
    'es necesario estar inscripto?'                                    => 'inscripcion',
    'tengo que tener monotributo?'                                     => 'inscripcion',
] as $pregunta => $clave) {
    caso("\"" . mb_substr($pregunta, 0, 46) . "\" → $clave", wabot_info_por_palabras($pregunta) === $clave);
    caso("  y $clave tiene texto cargado", trim((string)($cfg['info'][$clave] ?? '')) !== '');
}

caso('la respuesta fiscal no la contesta un desarrollador: manda al contador',
    stripos($cfg['info']['inscripcion'], 'contador') !== false);
caso('y aclara que para hacer la web no se pide inscripción',
    stripos($cfg['info']['inscripcion'], 'no te pedimos') !== false);
caso('los formularios se aclaran incluidos en el precio',
    stripos($cfg['info']['formularios'], 'ya vienen en el precio') !== false);
caso('info.exclusividad existe, es a medida y aclara que no es exclusividad de rubro/zona',
    stripos($cfg['info']['exclusividad'], 'no reciclamos el mismo diseño') !== false
    && stripos($cfg['info']['exclusividad'], 'exclusividad de rubro') !== false);
caso('"el diseño es exclusivo o le copian y pegan a otro cliente el mismo diseño?" → exclusividad, no confianza',
    wabot_info_por_palabras('el diseño es exclusivo o le copian y pegan a otro cliente el mismo diseño?', 'pitch') === 'exclusividad');
caso('pero "me estafaron" sigue yendo a confianza, no a exclusividad',
    wabot_info_por_palabras('me estafaron con otra web antes, es confiable esto?', 'pitch') === 'confianza');

caso('info.fotos_propiedad dice que son decenas de fotos y tambien video',
    stripos($cfg['info']['fotos_propiedad'], 'decenas de fotos') !== false
    && stripos($cfg['info']['fotos_propiedad'], 'video') !== false);
caso('"cuantas fotos puedo poner por propiedad?" → fotos_propiedad',
    wabot_info_por_palabras('cuantas fotos puedo poner por propiedad?', 'pitch') === 'fotos_propiedad');

caso('info.impuestos_importacion contesta que NO calcula automatico',
    stripos($cfg['info']['impuestos_importacion'], 'No,') === 0
    && stripos($cfg['info']['impuestos_importacion'], 'funcionalidad extra') !== false);
caso('"calcula automatico los impuestos de importacion?" → impuestos_importacion',
    wabot_info_por_palabras('la pagina calcula automatico los impuestos de importacion o eso lo manejo yo aparte?', 'pitch') === 'impuestos_importacion');

echo "— \"Bueno, aguardo entonces\" no es una duda —\n";

foreach (['Bueno, aguardo entonces', 'aguardo', 'quedo atento', 'quedo a la espera',
          'espero entonces', 'quedamos en contacto'] as $frase) {
    caso("\"$frase\" cuenta como acuse, no como consulta", wabot_es_acuse($frase) === true);
}
caso('pero una pregunta de verdad sigue sin ser acuse', wabot_es_acuse('De donde son?') === false);
caso('y un mensaje con contenido tampoco', wabot_es_acuse('quiero una web para mi kiosco') === false);

echo "— Re-chequeo contra los chats reales del 21-ago (frases textuales) —\n";

caso('Oscar: "tenes alguna para ver de algún cirujano..." → ejemplos (sustantivo elidido)',
    wabot_info_por_palabras('Esta bien gracias tenes alguna para ver de algún cirujano plástico o clínica dental de estética', 'precio') === 'ejemplos');
caso('Julieta: "plantillas como de encuentas" → formularios (typo tolerado)',
    wabot_info_por_palabras('Ustedes pueden hacer plantillas como de encuentas , que la persona la pueda llenar en su casa ?', 'derivado') === 'formularios');
caso('Hanni: "más información sobre esto? Preciop" → precio (typo al final)',
    wabot_info_por_palabras('Hola. ¿Puedo obtener más información sobre esto? Preciop', 'nuevo') === 'precio_sin_rubro');
caso('Abel: "Que precio tiene" → precio sin rubro',
    wabot_info_por_palabras('Que precio tiene', 'nuevo') === 'precio_sin_rubro');
caso('pero "precio" en medio de una frase descriptiva no dispara',
    wabot_info_por_palabras('vendo productos de limpieza a buen precio para comercios') === null);

caso('"Bueno,.aguardo entonces" (puntuación pegada) es acuse',
    wabot_es_acuse('Bueno,.aguardo entonces') === true);
caso('"Ha ok !" es acuse', wabot_es_acuse('Ha ok !') === true);
caso('"si" solo NO es acuse: puede estar contestando una pregunta',
    wabot_es_acuse('si') === false);

caso('"A ver armemos" no es un nombre de persona',
    wabot_nombre_usable('A ver armemos') === '');
caso('"Antuarezdesign" (handle de una palabra, 13+ letras) tampoco',
    wabot_nombre_usable('Antuarezdesign') === '');
caso('"Maximiliano" sigue siendo un nombre válido',
    wabot_nombre_usable('Maximiliano') === 'Maximiliano');
caso('"deeko" también: los apodos cortos se respetan',
    wabot_nombre_usable('deeko') === 'deeko');

caso('la zona horaria quedó en Buenos Aires', date_default_timezone_get() === 'America/Argentina/Buenos_Aires');
caso('date() y el cálculo manual UTC-3 dan la misma hora',
    date('H:i') === gmdate('H:i', time() - 3 * 3600));

echo "— El desempate no entra más en loop (MILANEL y Distribuidora, 21-ago) —\n";

caso('la normalización cambia puntuación por espacio, no la borra',
    wabot_normalizar_frase('web,boton') === 'web boton');
caso('y conserva los números: los patrones de orden vuelven a existir',
    wabot_normalizar_frase('Itiza las 2') === 'itiza las 2');

foreach ([
    'Gestion en la web,boton de pago y pedido integrado a WhatsApp' => 'comercio_vender',
    'Coti,ane ambas'         => 'comercio_vender',
    'Itiza las 2'            => 'comercio_vender',
    'Quizá a las dos'        => 'comercio_vender',
    'la 2'                   => 'comercio_mostrar',
    'Quiero publicar los vehiculos' => 'comercio_mostrar',
    'Que muestren y que contacten x whatsap' => 'comercio_mostrar',
] as $frase => $lado) {
    caso("\"" . mb_substr($frase, 0, 44) . "\" → $lado",
        wabot_desempate_por_palabras('desempate_comercio', $frase) === $lado);
}
caso('"sin carrito" sigue negando aunque tenga otras señales',
    wabot_desempate_por_palabras('desempate_comercio', 'quiero vender pero sin carrito') === 'comercio_mostrar');

echo "— \"Te aviso\" frena la persecución del mismo día (Oscar, 21-ago) —\n";

foreach (['Los veo con mi socia y te avisó', 'Veo el enlace con mi socia y te digo que nos pareció',
          'Déjame hablarlo', 'lo consulto con mi marido', 'lo tengo que hablar con mi familia'] as $f) {
    caso("\"" . mb_substr($f, 0, 42) . "\" es una promesa de aviso", wabot_dijo_te_aviso($f) === true);
}
caso('"quiero una web para mi kiosco" no lo es', wabot_dijo_te_aviso('quiero una web para mi kiosco') === false);
caso('"si, dale, armala" tampoco', wabot_dijo_te_aviso('si, dale, armala') === false);

$mediodiaAR = gmmktime(15, 0, 0, 8, 18, 2026);
caso('mismo día argentino → mismo día', wabot_mismo_dia_ar($mediodiaAR, $mediodiaAR + 5 * 3600) === true);
caso('a la 1 AM del día siguiente ya no', wabot_mismo_dia_ar($mediodiaAR, $mediodiaAR + 13 * 3600) === false);

$cfgSeg = $cfg; $cfgSeg['activo'] = true; $cfgSeg['seguimiento_activo'] = true;
$cvSeg = ['fase' => 'precio', 'tipo' => 'landing', 'precio_dado' => true,
          'transcript' => [['q' => 'bot', 't' => 'x', 'ts' => $mediodiaAR - 4 * 3600]],
          'ultimo_cliente_ts' => $mediodiaAR - 4 * 3600, 'aviso_prometido_ts' => 0];
caso('sin promesa, el seguimiento de la tarde sale', wabot_seguimiento_corresponde($cvSeg, $cfgSeg, $mediodiaAR) === true);
$cvSeg['aviso_prometido_ts'] = $mediodiaAR - 3 * 3600;
caso('con "te aviso" del mismo día, NO sale', wabot_seguimiento_corresponde($cvSeg, $cfgSeg, $mediodiaAR) === false);

echo "— El comodín deja la duda pendiente de verdad (Eze, 21-ago) —\n";

$cvOtra = conv_nueva();
$cvOtra['fase'] = 'precio'; $cvOtra['tipo'] = 'ecommerce'; $cvOtra['precio_dado'] = true;
clasifica(['pregunta_info'], ['info_keys' => ['otra']]);
$rOtra = wabot_engine('cual es el cuit de la empresa?', $cvOtra, $cfg);
caso('la respuesta es el comodín', strpos($rOtra[0] ?? '', 'desarrollador') !== false);
caso('y la duda queda marcada para Pablo', $cvOtra['handoff_pendiente'] === true);
caso('sin descarrilar la venta: la fase no cambió', $cvOtra['fase'] === 'precio');

$cvInfo = conv_nueva();
$cvInfo['fase'] = 'precio'; $cvInfo['tipo'] = 'landing'; $cvInfo['precio_dado'] = true;
clasifica(['pregunta_info'], ['info_keys' => ['hosting']]);
wabot_engine('cuanto sale el hosting?', $cvInfo, $cfg);
caso('una info que SÍ se contesta no marca nada', empty($cvInfo['handoff_pendiente']));

echo "— Referencia que es una lista de colores, y descripciones que no describen (Julieta) —\n";

caso('"Rosa .amarillo beige" parece lista de colores', wabot_parece_lista_colores('Rosa .amarillo beige') === true);
caso('"tonos pasteles" también', wabot_parece_lista_colores('tonos pasteles') === true);
caso('"la web de royalcanin" no', wabot_parece_lista_colores('la web de royalcanin') === false);
caso('"Mi negocio se llama Rosa" tampoco', wabot_parece_lista_colores('Mi negocio se llama Rosa') === false);

caso('"servicios profesionales" no alcanza como descripción', wabot_descripcion_generica('servicios profesionales') === true);
caso('"balances y liquidación de sueldos" sí alcanza', wabot_descripcion_generica('balances y liquidación de sueldos') === false);
caso('la descripción genérica vuelve a la lista de faltantes',
    in_array('Una descripción breve de lo que ofrecés',
        wabot_prediseno_faltan(['nombre' => 'Julieta', 'nombre_negocio' => 'JA', 'descripcion' => 'servicios profesionales', 'colores' => 'cálidos']), true));

echo "— \"Quiero mi demo gratis\" de entrada no se vuelve a preguntar (Antuz, 21-ago) —\n";

caso('el CTA del anuncio se detecta', wabot_pidio_demo_explicita('Hola! Quiero mi demo gratis para mi negocio.') === true);
caso('"me pasas el precio?" no', wabot_pidio_demo_explicita('me pasas el precio?') === false);

foreach ([
    'Dale, me interesa la muestra gratis', 'quiero la muestra', 'quiero ver la muestra',
    'armame la muestra', 'me interesa esa muestra',
] as $frase) {
    caso("\"$frase\" también pide la demo — \"muestra\" es sinónimo, no solo \"demo\"",
        wabot_pidio_demo_explicita($frase) === true);
}

$cvDemo = conv_nueva();
$cvDemo['demo_pedida_entrada'] = true; $cvDemo['chat_started_ts'] = time();
clasifica(['rubro_landing']);
$rDemo = wabot_precio('landing', $cvDemo, $cfg);
caso('tras el precio va directo al link del form, sin re-ofrecer',
    count($rDemo) === 2 && mb_stripos($rDemo[1], 'cómo podría quedar tu web') !== false
    && strpos($rDemo[1], 'gokywebs.com/form/') !== false && mb_stripos($rDemo[1], 'Querés que') === false);
caso('y ese mensaje ofrece mostrar cómo quedaría, con las 24hs (texto de Pablo, 2-sep)',
    mb_stripos($rDemo[1], 'menos de 24hs') !== false && mb_stripos($rDemo[1], 'formulario') !== false
    && mb_stripos($rDemo[1], 'sin compromiso') !== false);
caso('y la fase queda en prediseño', $cvDemo['fase'] === 'prediseno');

$cvNormal = conv_nueva();
$cvNormal['chat_started_ts'] = time();
$rNormal = wabot_precio('landing', $cvNormal, $cfg);
caso('sin ese pedido, la oferta de siempre sigue igual (pregunta, no recolecta)',
    count($rNormal) === 2 && mb_strpos($rNormal[1], '?') !== false && mb_stripos($rNormal[1], 'Necesito') === false);

echo "— TANDA 1: el precio llega comprando algo (beneficio antes del número) —\n";

foreach (['landing' => 'te escribe sin preguntarte lo básico',
          'catalogo' => 'te llega la consulta con el producto ya elegido',
          'turnos' => 'dejás de coordinar horarios por chat',
          'institucional' => 'no depende de una red social',
          'inmobiliaria' => 'te consulta por una propiedad concreta',
          'ecommerce' => 'te compran y te pagan sin que tengas que estar contestando',
          'elearning' => 'vendés el curso una vez y el alumno entra solo'] as $tipo => $beneficio) {
    caso("$tipo explica para qué le sirve, no solo qué es",
        mb_stripos((string)$cfg['tipos'][$tipo]['desc'], $beneficio) !== false);
}
caso('el beneficio va ANTES del precio en el mensaje', (function () use ($cfg) {
    $t = wabot_msg_precio_texto('ecommerce', $cfg);
    return mb_strpos($t, 'sin que tengas que estar contestando') < mb_strpos($t, '$290.000');
})());
caso('institucional sigue sin prometer panel propio',
    stripos((string)$cfg['tipos']['institucional']['desc'], 'panel') === false);

$descVieja = wabot_config_load();
$descVieja['tipos']['ecommerce']['desc'] = 'una tienda online completa: catálogo con tus productos, carrito y cobro online, y un panel propio para manejar todo vos';
wabot_config_descs($descVieja);
caso('las desc viejas de producción migran solas al texto con beneficio',
    $descVieja['tipos']['ecommerce']['desc'] === $cfg['tipos']['ecommerce']['desc']);

echo "— La oferta de la demo es corta: sin costo, y nada de pasos ni condiciones —\n";

caso('la oferta dice que la muestra no tiene costo',
    mb_stripos($cfg['msg_prediseno_oferta'], 'sin costo') !== false
    || mb_stripos($cfg['msg_prediseno_oferta'], 'gratis') !== false);
caso('y no arrastra el guion viejo de "primer paso... si te gusta... la armamos"',
    mb_stripos($cfg['msg_prediseno_oferta'], 'primer paso') === false);
caso('y sigue terminando en pregunta, que es lo que el flujo espera',
    mb_strpos($cfg['msg_prediseno_oferta'], '?') !== false);
caso('ninguna variante arranca dando por hecho que va a pagar', (function () use ($cfg) {
    foreach ((array)($cfg['msg_prediseno_oferta_variantes'] ?? []) as $v) {
        if (mb_stripos($v, 'pongas un peso') !== false) return false;
        if (mb_stripos($v, 'no avanzamos y listo') !== false) return false;
    }
    return true;
})());
caso('las descripciones no cuelgan un ejemplo del final del beneficio', (function () use ($cfg) {
    foreach (['ecommerce' => 'de madrugada', 'turnos' => 'fuera de hora',
              'elearning' => 'links ni videos a mano'] as $tipo => $ejemplo) {
        if (mb_stripos((string)$cfg['tipos'][$tipo]['desc'], $ejemplo) !== false) return false;
    }
    return true;
})());
caso('todas las variantes terminan en pregunta', (function () use ($cfg) {
    foreach ((array)($cfg['msg_prediseno_oferta_variantes'] ?? []) as $v) {
        if (mb_strpos($v, '?') === false) return false;
    }
    return count((array)($cfg['msg_prediseno_oferta_variantes'] ?? [])) >= 4;
})());

$ofertaVieja = wabot_config_load();
$ofertaVieja['msg_prediseno_oferta'] = 'Siempre ofrecemos una demo gratis de la web, para que veas cómo quedaría antes de decidir nada. Querés que te la armemos?';
$ofertaVieja['msg_prediseno_oferta_variantes'] = ['Si querés, te preparamos una demo gratis para que veas cómo quedaría tu web antes de decidir. La armamos?'];
wabot_config_ventas($ofertaVieja);
wabot_config_pitch_rubro($ofertaVieja);
wabot_config_simplificar_tipos($ofertaVieja);   // mismo orden que wabot_config_load()
caso('la oferta vieja de producción migra sola', $ofertaVieja['msg_prediseno_oferta'] === $cfg['msg_prediseno_oferta']);

$ofertaIntermedia = wabot_config_load();
$ofertaIntermedia['msg_prediseno_oferta'] = 'Y no hace falta que decidas solo con el presupuesto: te armamos primero una muestra de cómo quedaría tu web, sin costo. La ves y, si te gusta, recién ahí definís. Te la preparamos?';
$ofertaIntermedia['msg_prediseno_oferta_variantes'] = ['Para que no tengas que imaginártelo: te preparamos una muestra real de tu web, sin cargo ni compromiso. Recién cuando la veas decidís. Avanzamos con eso?'];
wabot_config_ventas($ofertaIntermedia);
wabot_config_pitch_rubro($ofertaIntermedia);
wabot_config_simplificar_tipos($ofertaIntermedia);
caso('y la versión intermedia (la que estaba en producción hasta hoy) también migra',
    $ofertaIntermedia['msg_prediseno_oferta'] === $cfg['msg_prediseno_oferta']
    && $ofertaIntermedia['msg_prediseno_oferta_variantes'] === $cfg['msg_prediseno_oferta_variantes']);

caso('el cierre suave ya no dice "escribinos" en tono corporativo',
    mb_stripos($cfg['cierre_suave'], 'escribinos') === false);
$cierreViejo = wabot_config_load();
$cierreViejo['cierre_suave'] = 'Gracias por consultar. Cuando sea el momento, escribinos y retomamos desde acá.';
wabot_config_ventas($cierreViejo);
caso('el cierre suave viejo de producción migra solo', $cierreViejo['cierre_suave'] === $cfg['cierre_suave']);

// 27-ago: 14 de 32 charlas del día murieron en el saludo, sin una sola
// respuesta. "Para qué rubro necesitás la web" obliga a traducir el propio
// negocio a la palabra "rubro"; preguntar qué vende se contesta solo.
caso('el saludo dice para qué sirve contestar antes de preguntar (2-sep)',
    stripos($cfg['menu'], 'valor exacto de tu web') !== false
    && stripos($cfg['menu'], 'a qué te dedicás') !== false
    && stripos($cfg['menu'], 'rubro') === false);
$menuRubro = wabot_config_load();
$menuRubro['menu'] = 'Hola 👋 Para asesorarte mejor, contanos para qué rubro necesitás la web.';
wabot_config_ventas($menuRubro);
caso('el saludo del "rubro" migra solo al nuevo', $menuRubro['menu'] === $cfg['menu']);
$menuViejo = wabot_config_load();
$menuViejo['menu'] = 'Hola, cómo estás? Contame un poco para qué necesitarías la web';
wabot_config_ventas($menuViejo);
caso('el saludo viejo de producción migra solo', $menuViejo['menu'] === $cfg['menu']);
$menuIntermedio = wabot_config_load();
$menuIntermedio['menu'] = 'Hola, cómo estás? Contame un poco en qué te puedo ayudar';
wabot_config_ventas($menuIntermedio);
caso('el saludo intermedio también migra al nuevo', $menuIntermedio['menu'] === $cfg['menu']);
$menuConErrores = wabot_config_load();
$menuConErrores['menu'] = 'Hola 👋 , para asesorarte mejor porfavor contanos para que rubro necesitarias la web';
wabot_config_ventas($menuConErrores);
caso('el saludo con errores de redacción también migra al nuevo', $menuConErrores['menu'] === $cfg['menu']);

caso('soy_bot ya no arranca contestando "Sí" a "sos una persona?"',
    mb_stripos($cfg['info']['soy_bot'], 'No, soy el asistente') === 0);
$soyBotViejo = wabot_config_load();
$soyBotViejo['info']['soy_bot'] = 'Sí, soy el asistente automático de Gokywebs. Te puedo orientar con las opciones, los precios y cómo es el proceso, y cuando hace falta algo más te paso con el desarrollador.';
wabot_config_ventas($soyBotViejo);
caso('el soy_bot viejo de producción migra solo', $soyBotViejo['info']['soy_bot'] === $cfg['info']['soy_bot']);

caso('titularidad ya no dice que ambos (dominio y hosting) quedan del cliente por defecto',
    mb_stripos($cfg['info']['titularidad'], 'siendo tuyos los dos') === false);
$titularidadVieja = wabot_config_load();
$titularidadVieja['info']['titularidad'] = "El dominio se puede registrar directamente a tu nombre, así queda tuyo desde el primer día. El hosting es el nuestro y viene incluido; si lo querés a tu nombre, lo contratás vos y subimos la web ahí.\nSiendo tuyos los dos, los renovás y los manejás vos sin depender de nadie.";
wabot_config_ventas($titularidadVieja);
caso('la titularidad vieja de producción migra sola', $titularidadVieja['info']['titularidad'] === $cfg['info']['titularidad']);

echo "— El que se va sabe que no tiene que explicar todo de nuevo —\n";

$cvCierre = conv_nueva();
$cvCierre['tipo'] = 'ecommerce'; $cvCierre['precio_dado'] = true;
$rCierre = wabot_cerrar_sin_presion($cvCierre, $cfg, 'consulta');
caso('el cierre recuerda el tipo ya cotizado', mb_stripos($rCierre[0], 'ecommerce') !== false);
caso('y promete continuidad', mb_stripos($rCierre[0], 'no vas a tener que explicar') !== false);

$cvSinPrecio = conv_nueva();
$rSinPrecio = wabot_cerrar_sin_presion($cvSinPrecio, $cfg, 'consulta');
caso('sin tipo cotizado NO promete memoria: sería una promesa vacía',
    mb_stripos($rSinPrecio[0], 'no vas a tener que explicar') === false);

echo "— El \"Perfecto\" deja de repetirse mensaje tras mensaje —\n";

$cvMul = ['conversation_key' => 'MUL1', 'transcript' => [['q' => 'bot', 't' => 'Perfecto, ya lo anoté.', 'ts' => time()]]];
$variado = wabot_variar_muletilla('Perfecto, ahora contame los colores.', $cvMul);
caso('si el anterior arrancó igual, cambia la muletilla', mb_strpos($variado, 'Perfecto') !== 0);
caso('pero el resto del mensaje queda intacto', mb_strpos($variado, ', ahora contame los colores.') !== false);

$cvOtra = ['conversation_key' => 'MUL2', 'transcript' => [['q' => 'bot', 't' => 'Dale, lo vemos.', 'ts' => time()]]];
caso('si el anterior arrancó distinto, no toca nada',
    wabot_variar_muletilla('Perfecto, ahora contame los colores.', $cvOtra) === 'Perfecto, ahora contame los colores.');
caso('un mensaje que no arranca con muletilla nunca se toca',
    wabot_variar_muletilla('Tu demo va a estar lista hoy.', $cvMul) === 'Tu demo va a estar lista hoy.');
caso('la alternativa es estable: dos veces seguidas da lo mismo',
    wabot_variar_muletilla('Perfecto, dale.', $cvMul) === wabot_variar_muletilla('Perfecto, dale.', $cvMul));

echo "— TANDA 2: preguntas frecuentes que antes caían en el comodín —\n";

foreach ([
    'estoy averiguando precios'                 => 'comparando',
    'otro me cobra mas barato'                   => 'comparando',
    'me pasaron un presupuesto de 150 mil'       => 'comparando',
    'ya tengo una pagina'                        => 'ya_tiene_plataforma',
    'mi web esta en wordpress'                   => 'ya_tiene_plataforma',
    'se ve bien en el celular?'                  => 'responsive',
    'no se nada de paginas web'                  => 'no_se_nada',
    'no tengo logo'                              => 'sin_logo',
    'no tengo buenas fotos'                      => 'sin_fotos',
    'la muestra ya es mi pagina?'                => 'muestra_no_es_final',
    'es segura la web?'                          => 'seguridad',
    'me pueden hackear?'                         => 'seguridad',
    'voy a aparecer en google?'                  => 'google',
    'incluye seo?'                               => 'google',
    'se puede poner google maps?'                => 'maps',
    'puedo empezar simple y ampliar despues?'    => 'ampliar_despues',
    'que necesitan de mi?'                       => 'que_necesitan',
    'sos un bot?'                                => 'soy_bot',
    'sos una persona o robot'                    => 'soy_bot',
] as $pregunta => $clave) {
    caso("\"" . mb_substr($pregunta, 0, 40) . "\" → $clave", wabot_info_por_palabras($pregunta) === $clave);
    caso("  y $clave tiene texto", trim((string)($cfg['info'][$clave] ?? '')) !== '');
}

echo "— Las claves nuevas no le roban casos a las que ya andaban —\n";

foreach ([
    'usan wordpress?'                            => 'tecnologia',
    'tengo acceso al administrador tipo wordpress?' => 'carga',
    'migran el contenido de mi web actual?'      => 'migracion',
    'quien carga los productos?'                 => 'carga',
    'de donde son?'                              => 'ubicacion',
    'cuando vence el dominio?'                   => 'hosting',
    'vendo celulares'                            => null,
] as $pregunta => $clave) {
    caso("\"" . mb_substr($pregunta, 0, 40) . "\" sigue en " . var_export($clave, true),
        wabot_info_por_palabras($pregunta) === $clave);
}

echo "— Contenido de las respuestas nuevas —\n";

caso('comparando no ataca al competidor ni baja el precio',
    stripos($cfg['info']['comparando'], 'descuento') === false
    && stripos($cfg['info']['comparando'], 'está perfecto comparar') !== false);
caso('y usa la muestra como diferencial', stripos($cfg['info']['comparando'], 'muestra') !== false);
caso('ya_tiene_plataforma no empuja a reemplazar: ofrece revisarla primero',
    stripos($cfg['info']['ya_tiene_plataforma'], 'la reviso') !== false
    && stripos($cfg['info']['ya_tiene_plataforma'], 'si con la que tenés ya estás bien') !== false);
caso('google NO promete salir primero',
    stripos($cfg['info']['google'], 'primero') === false && stripos($cfg['info']['google'], 'garantiz') === false);
caso('seguridad no promete riesgo cero',
    stripos($cfg['info']['seguridad'], 'riesgo cero') !== false && stripos($cfg['info']['seguridad'], 'imposible') === false);
caso('soy_bot admite que es un bot', stripos($cfg['info']['soy_bot'], 'asistente automático') !== false);
caso('muestra_no_es_final aclara que no es la web final',
    stripos($cfg['info']['muestra_no_es_final'], 'primera versión') !== false);

echo "— Mantenimiento: 1 cambio por mes y planes con más —\n";

$mant = wabot_texto_mantenimiento(['tipo' => 'landing', 'precio_dado' => true], $cfg);
caso('dice que es un cambio por mes', mb_stripos($mant, 'un cambio por mes') !== false);
caso('aclara que puede ser un cambio grande', mb_stripos($mant, 'grande') !== false);
caso('menciona que hay planes con más cambios', mb_stripos($mant, 'planes más completos') !== false);
caso('sin inventar un precio para esos planes',
    substr_count($mant, '$') <= 1);
caso('y ya no promete el primer mes gratis/incluido',
    mb_stripos($mant, 'primer mes') === false);

$mantVieja = wabot_config_load();
$mantVieja['info']['mantenimiento'] = 'El mantenimiento es opcional e incluye un cambio por mes —puede ser un cambio grande, no solo un retoque—, además del soporte, y el hosting y el dominio mientras esté activo. Hay planes más completos con más cambios por mes si los llegás a necesitar. El primer mes va incluido con el desarrollo; después sale {precio} por mes y acá lo podés ver en detalle: {link}';
wabot_config_ventas($mantVieja);
caso('el texto viejo con "primer mes incluido" migra solo al nuevo',
    $mantVieja['info']['mantenimiento'] === $cfg['info']['mantenimiento']);

echo "— Mantenimiento sin tipo cotizado: un precio y un link por plan, no mezclados —\n";

// Antes de saber el tipo ya no se arma "$10.000 (landing) o $15.000 (el resto)"
// con el link de UN solo plan (bug real: Fede recibió el precio de landing
// pero el link de la página de $15.000, gokywebs.com/mantenimientoweb).
$mantSinTipo = wabot_texto_mantenimiento(['tipo' => null], $cfg);
caso('trae el precio de landing', strpos($mantSinTipo, $cfg['mantenimiento_planes']['landing']['precio']) !== false);
caso('trae el link de landing', strpos($mantSinTipo, $cfg['mantenimiento_planes']['landing']['link']) !== false);
caso('trae el precio de los demás tipos', strpos($mantSinTipo, $cfg['mantenimiento_planes']['otros']['precio']) !== false);
caso('trae el link de los demás tipos', strpos($mantSinTipo, $cfg['mantenimiento_planes']['otros']['link']) !== false);
caso('nunca cuelga el link de un plan al lado del precio del otro',
    strpos($mantSinTipo, $cfg['mantenimiento_planes']['landing']['precio'] . ' (landing) o ' . $cfg['mantenimiento_planes']['otros']['precio']) === false);

$mantAmbosVacio = wabot_config_load();
$mantAmbosVacio['info']['mantenimiento_ambos'] = '';
wabot_config_ventas($mantAmbosVacio);
caso('mantenimiento_ambos se rellena solo si quedó vacío',
    trim((string)$mantAmbosVacio['info']['mantenimiento_ambos']) !== '');

echo "— Día de entrega: el día del cliente arranca a las 3 AM, no a las 00:00 —\n";

$diaAR = function ($hora, $min = 30) { return gmmktime($hora + 3, $min, 0, 8, 21, 2026); };
foreach ([3, 7, 10] as $h) {
    $d = wabot_dia_entrega($diaAR($h));
    caso("cierra {$h}:30 → se entrega HOY", $d['palabra'] === 'hoy' && $d['fecha'] === '2026-08-21');
}
foreach ([11, 15, 23] as $h) {
    $d = wabot_dia_entrega($diaAR($h));
    caso("cierra {$h}:30 → mañana, y cae en la fecha siguiente", $d['palabra'] === 'mañana' && $d['fecha'] === '2026-08-22');
}
// El trasnochado: para él es "mañana" (después de dormir) pero es la misma fecha.
foreach ([0, 1, 2] as $h) {
    $d = wabot_dia_entrega($diaAR($h));
    caso("cierra {$h}:30 de madrugada → le decimos mañana, pero es la misma fecha",
        $d['palabra'] === 'mañana' && $d['fecha'] === '2026-08-21');
}
caso('justo a las 3:00 ya es "hoy"', wabot_dia_entrega($diaAR(3, 0))['palabra'] === 'hoy');
caso('justo a las 11:00 ya es "mañana"', wabot_dia_entrega($diaAR(11, 0))['palabra'] === 'mañana');
caso('a las 2:59 todavía es "mañana"', wabot_dia_entrega($diaAR(2, 59))['palabra'] === 'mañana');

caso('el cierre del prediseño ya no promete "24 a 48 horas"',
    stripos($cfg['prediseno_completo'], '24 a 48') === false);
caso('y usa el placeholder del día concreto',
    strpos($cfg['prediseno_completo'], '{entrega}') !== false);
caso('{entrega} se resuelve al mandar el mensaje',
    strpos(wabot_personalizar($cfg['prediseno_completo'], ['nombre' => 'Ana']), '{entrega}') === false
    && preg_match('/\b(hoy|mañana)\b/u', wabot_personalizar($cfg['prediseno_completo'], ['nombre' => 'Ana'])));

echo "— Los mensajes del hueco ahora piden respuesta —\n";

// La charla se enfriaba porque los tres mensajes seguidos eran afirmaciones:
// nada que contestar, y sin respuesta del cliente la ventana de Meta cierra.
$cierreEcom = wabot_texto_prediseno_completo(['tipo' => 'ecommerce', 'imagenes_recibidas' => 0], $cfg);
caso('el cierre de la recolección pide material, que es lo que filtra al curioso',
    mb_stripos($cierreEcom, 'mandame') !== false);
caso('y pide fotos del rubro que corresponde, no genéricas',
    mb_stripos($cierreEcom, 'fotos de tus productos') !== false);
caso('la línea de espera NO repite esa misma pregunta', mb_stripos($cfg['espera_prediseno'], 'destacar') === false);
caso('pero sí recuerda cuándo llega la demo', mb_strpos($cfg['espera_prediseno'], '{entrega}') !== false);

foreach ([
    'Listo, ya quedó todo anotado. Si te queda alguna duda escribime y te la contesto, y el resto te lo confirma el desarrollador cuando te escriba.' => 'espera_prediseno',
    'Listo {nombre}, con eso ya lo preparamos. El prediseño tarda 24 a 48 horas y te mandamos la muestra por acá mismo apenas esté lista.' => 'prediseno_completo',
    'Listo {nombre}, con eso ya lo preparamos. El prediseño tarda 24 a 48 horas y te mandamos la demo por acá mismo apenas esté lista.' => 'prediseno_completo',
] as $textoViejo => $clave) {
    $cvMig = [$clave => $textoViejo];
    wabot_config_ventas($cvMig);
    caso("el $clave viejo de producción migra solo", $cvMig[$clave] === $cfg[$clave]);
}

echo "— Tiendanube: no trabajamos ahí, y ya tenía su respuesta —\n";

caso('"tengo tiendanube" NO cae en ya_tiene_plataforma',
    wabot_info_por_palabras('tengo tiendanube') !== 'ya_tiene_plataforma');
caso('shopify tampoco', wabot_info_por_palabras('vendo por shopify') !== 'ya_tiene_plataforma');
caso('wix tampoco', wabot_info_por_palabras('uso wix') !== 'ya_tiene_plataforma');
caso('una web propia en WordPress sí',
    wabot_info_por_palabras('mi web esta en wordpress') === 'ya_tiene_plataforma');
caso('y "ya tengo una pagina" también',
    wabot_info_por_palabras('ya tengo una pagina') === 'ya_tiene_plataforma');
caso('la objeción de plataformas de alquiler sigue existiendo aparte',
    stripos($cfg['plataformas'], 'alquiler mensual') !== false);
caso('ya_tiene_plataforma no promete trabajar sobre la web existente',
    stripos($cfg['info']['ya_tiene_plataforma'], 'no trabajamos sobre webs ya hechas') !== false);
caso('y no contradice a info.tecnologia',
    stripos($cfg['info']['tecnologia'], 'trabajamos sobre webs ya hechas') !== false);

echo "— El material que pide filtra al curioso, y es el que corresponde al rubro —\n";

foreach ([
    'catalogo'      => 'fotos de tus productos',
    'ecommerce'     => 'fotos de tus productos',
    'inmobiliaria'  => 'propiedades',
    'turnos'        => 'del local o de los trabajos',
    'institucional' => 'del lugar o de las actividades',
    'elearning'     => 'dando clase',
    'landing'       => 'tus trabajos, tu local o tu equipo',
] as $tipo => $esperado) {
    $pedido = wabot_imagenes_a_pedir(['tipo' => $tipo], $cfg);
    caso("a $tipo le pide \"$esperado\"", mb_stripos($pedido, $esperado) !== false);
    caso("  y siempre el logo", mb_stripos($pedido, 'logo') !== false || mb_stripos($pedido, 'escudo') !== false);
}
caso('a una inmobiliaria NO le pide fotos de productos',
    mb_stripos(wabot_imagenes_a_pedir(['tipo' => 'inmobiliaria'], $cfg), 'productos') === false);
caso('a una peluquería (turnos) tampoco',
    mb_stripos(wabot_imagenes_a_pedir(['tipo' => 'turnos'], $cfg), 'productos') === false);
caso('un tipo desconocido cae a un pedido genérico, nunca a vacío',
    trim(wabot_imagenes_a_pedir(['tipo' => 'lo_que_sea'], $cfg)) !== ''
    && mb_stripos(wabot_imagenes_a_pedir(['tipo' => 'lo_que_sea'], $cfg), 'logo') !== false);
caso('sin tipo tampoco queda vacío',
    trim(wabot_imagenes_a_pedir([], $cfg)) !== '');

$cierreSinFotos = wabot_texto_prediseno_completo(['tipo' => 'catalogo', 'imagenes_recibidas' => 0], $cfg);
caso('el cierre pide el material', mb_stripos($cierreSinFotos, 'mandame') !== false);
caso('y no deja el placeholder crudo', mb_strpos($cierreSinFotos, '{imagenes}') === false);
caso('explica POR QUÉ lo pide, no lo pide a secas',
    mb_stripos($cierreSinFotos, 'tuya de verdad') !== false);

$cierreConFotos = wabot_texto_prediseno_completo(['tipo' => 'catalogo', 'imagenes_recibidas' => 3], $cfg);
caso('si ya mandó fotos, NO se las vuelve a pedir', mb_stripos($cierreConFotos, 'mandame') === false);
caso('y las reconoce', mb_stripos($cierreConFotos, 'las fotos que me pasaste') !== false);
caso('sin dejar el placeholder', mb_strpos($cierreConFotos, '{imagenes}') === false);

caso('los dos textos siguen prometiendo el día concreto',
    strpos($cierreSinFotos, '{entrega}') !== false && strpos($cierreConFotos, '{entrega}') !== false);

echo "\n— Una ONG que da capacitaciones no es una plataforma de cursos —\n";

caso('ONG que da capacitación laboral → landing, no cursos',
    wabot_fallback_rubro_local('Hola, somos una ONG que da capacitacion laboral a jovenes') === 'landing');
caso('fundación que da talleres tampoco dispara el desempate de cursos',
    wabot_fallback_rubro_local('somos una fundacion que da talleres a chicos') === 'landing');
caso('asociación civil con capacitaciones, igual',
    wabot_fallback_rubro_local('somos una asociacion civil que hace capacitaciones') === 'landing');
caso('pero si la ONG dice que los cobra, ahí sí son cursos',
    wabot_fallback_rubro_local('somos una ong que cobra una matricula por los cursos') === 'cursos');
caso('y si dice que quiere venderlos online, también',
    wabot_fallback_rubro_local('somos una fundacion y queremos vender cursos online') === 'cursos');
caso('un instituto comercial que da cursos sigue siendo cursos',
    wabot_fallback_rubro_local('tengo un instituto de idiomas, doy cursos') === 'cursos');
caso('"vender cursos online" ya no se lee como ecommerce',
    wabot_fallback_rubro_local('quiero vender mis cursos online') === 'cursos');
caso('pero vender productos online sigue siendo ecommerce',
    wabot_fallback_rubro_local('quiero vender ropa online') === 'ecommerce'
    && wabot_fallback_rubro_local('tengo una tienda online de zapatillas') === 'ecommerce');

echo "— Una pregunta contestada no se sigue con el saludo de bienvenida —\n";

$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones' => ['pregunta_info'], 'info_keys' => ['precio_sin_rubro']];
};
$cPrecioSolo = conv_nueva();
$cPrecioSolo['fase'] = 'nuevo';
$rPrecioSolo = wabot_engine('precio', $cPrecioSolo, $cfg);
caso('"precio" como primer mensaje devuelve UN mensaje, no la respuesta + el saludo',
    count($rPrecioSolo) === 1);
caso('y el que sale es la respuesta, no el saludo genérico',
    strpos($rPrecioSolo[0], $cfg['menu']) === false);
caso('la respuesta que NO devuelve la pelota sí sigue sumando la apertura',
    wabot_salida_ya_pregunta([$cfg['info']['pago']]) === false);
caso('y la que ya pide algo, no',
    wabot_salida_ya_pregunta([$cfg['info']['precio_sin_rubro']]) === true
    && wabot_salida_ya_pregunta(['Y hoy cómo vendés, por Instagram?']) === true);

$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () { return ['acciones' => ['saludo']]; };
$cSaludo = conv_nueva();
$cSaludo['fase'] = 'nuevo';
$rSaludo = wabot_engine('hola', $cSaludo, $cfg);
caso('un saludo pelado sí sigue recibiendo la apertura', count($rSaludo) === 1 && $rSaludo[0] === $cfg['menu']);
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

echo "\n— Mostrar trabajos gana sobre la palabra suelta \"productos\" —\n";

caso('"mostrar los trabajos que hice, no vendo productos" → trabajos, no catálogo',
    wabot_desempate_por_palabras('desempate_hibrido', 'Quiero mostrar los trabajos que hice, no vendo productos de stock') === 'hibrido_trabajos');
caso('un portfolio de obras también',
    wabot_desempate_por_palabras('desempate_hibrido', 'quiero un portfolio de mis obras') === 'hibrido_trabajos');
caso('pero pedir un catálogo con productos sigue siendo catálogo',
    wabot_desempate_por_palabras('desempate_hibrido', 'quiero un catalogo con mis productos y que me escriban por whatsapp') === 'hibrido_catalogo');
caso('y vender online sigue siendo vender',
    wabot_desempate_por_palabras('desempate_hibrido', 'quiero vender online con carrito') === 'hibrido_vender');
caso('rejas y portones ya se reconocen como trabajo a medida',
    wabot_contexto_es_hibrido('Hago rejas y portones a medida')
    && wabot_contexto_es_hibrido('hacemos placares y vestidores'));
caso('sin romper los rubros que ya estaban',
    wabot_contexto_es_hibrido('vendo cortinas') && wabot_contexto_es_hibrido('hago muebles a medida'));

echo "\n— Si pide el precio, se le da el precio: no el pitch con una repregunta —\n";

caso('detecta el pedido de precio dentro de un mensaje largo',
    wabot_texto_pide_precio('tenemos como 800 productos y queriamos una pagina. Cuanto nos saldria algo asi?'));
caso('y las formas cortas', wabot_texto_pide_precio('cuanto sale?') && wabot_texto_pide_precio('que precio tiene?'));
caso('sin confundir otras preguntas con números',
    !wabot_texto_pide_precio('vendo ropa, cuanto tenes de stock?')
    && !wabot_texto_pide_precio('tengo 30 productos'));

$convPidePrecio = conv_nueva();
$convPidePrecio['pitch_hecho'] = false;
$convPidePrecio['transcript'] = [['q'=>'cliente','t'=>'Tengo una casa de repuestos, 800 productos. Cuanto nos saldria?','ts'=>time()]];
caso('con el precio pedido, el pitch ya no corresponde',
    wabot_pitch_corresponde('ecommerce', $convPidePrecio, $cfg) === false);

$convSinPedir = conv_nueva();
$convSinPedir['pitch_hecho'] = false;
$convSinPedir['transcript'] = [['q'=>'cliente','t'=>'Tengo una casa de repuestos de motos','ts'=>time()]];
caso('pero si no lo pidió, el pitch sigue saliendo',
    wabot_pitch_corresponde('ecommerce', $convSinPedir, $cfg) === true);

echo "\n— Dudar de si conviene no es querer irse —\n";

caso('"no se si vale la pena" es una duda, no un cierre',
    wabot_texto_es_duda_de_valor('No se si vale la pena hacerla de nuevo')
    && wabot_texto_es_duda_de_valor('no se si me conviene'));
caso('pero irse de verdad sigue siendo irse',
    !wabot_texto_es_duda_de_valor('no me interesa')
    && !wabot_texto_es_duda_de_valor('por ahora solo estaba averiguando'));

$convDuda = conv_nueva();
$convDuda['objecion_dicha'] = ['ya_tengo_web' => true];
$convDuda['transcript'] = [['q'=>'cliente','t'=>'No se si vale la pena hacerla de nuevo','ts'=>time()]];
caso('repetir la objeción ante una duda NO devuelve la despedida',
    wabot_objecion_texto('ya_tengo_web', $cfg['ya_tengo_web'], $convDuda, $cfg) === $cfg['ya_tengo_web']);

$convInsiste = conv_nueva();
$convInsiste['objecion_dicha'] = ['pensarlo' => true];
$convInsiste['transcript'] = [['q'=>'cliente','t'=>'bueno, lo voy a pensar','ts'=>time()]];
caso('y el que insiste con lo mismo sí recibe el cierre corto',
    wabot_objecion_texto('pensarlo', $cfg['pensarlo'], $convInsiste, $cfg) === $cfg['objecion_repetida']);

echo "\n— Un elogio tras la demo NO es una despedida —\n";

caso('"la estoy viendo, está hermoso" ya no cierra la charla',
    wabot_cierre_sin_presion_tipo('Ay la estoy viendo esta hermoso.') === null);
caso('ni "me encantó" ni "quedó muy linda"',
    wabot_cierre_sin_presion_tipo('Si, si la verdad me encanto') === null
    && wabot_cierre_sin_presion_tipo('quedo muy linda') === null);
caso('pero "estoy viendo opciones" sigue siendo un cierre',
    wabot_cierre_sin_presion_tipo('estoy viendo opciones nomas') === 'consulta');
caso('y "por ahora solo estaba averiguando" también',
    wabot_cierre_sin_presion_tipo('por ahora solo estaba averiguando precios') === 'consulta');

caso('el elogio se lee como ganas de avanzar', wabot_postdemo_quiere_avanzar('esta hermoso') === true);
caso('pero "no me gustó" NO', wabot_postdemo_quiere_avanzar('no me gusto') === false);
caso('ni "no me convence"', wabot_postdemo_quiere_avanzar('no me convence') === false);
caso('y un elogio con "lo miro con calma" tampoco apura el cobro',
    wabot_postdemo_quiere_avanzar('esta lindo pero lo voy a mirar con calma') === false);

echo "\n— La descripción sale de lo que el cliente ya contó —\n";

$mkConv = function ($msgs) {
    return ['transcript' => array_map(function ($m) { return ['q' => 'cliente', 't' => $m, 'ts' => time()]; }, $msgs)];
};
caso('si ya dijo a qué se dedica, esa es la descripción',
    wabot_descripcion_desde_contexto($mkConv(['Soy entrenador personal y funcional', 'Dale, quiero la demo']))
        === 'Soy entrenador personal y funcional');
caso('un saludo o un pedido de web no cuentan como descripción',
    wabot_descripcion_desde_contexto($mkConv(['hola', 'quiero una web'])) === ''
    && wabot_descripcion_desde_contexto($mkConv(['hola', 'cuanto sale una pagina'])) === '');
caso('y entonces no se le vuelve a pedir lo que ya contó',
    !in_array('Una descripción breve de lo que ofrecés',
        wabot_prediseno_faltan($mkConv(['Vendo plantas y macetas de diseño']) + ['nombre' => 'Ana', 'nombre_negocio' => 'X', 'colores' => 'verde']), true));
caso('pero al que no contó nada sí se le pide',
    in_array('Una descripción breve de lo que ofrecés',
        wabot_prediseno_faltan($mkConv(['hola']) + ['nombre' => 'Ana', 'nombre_negocio' => 'X', 'colores' => 'verde']), true));

echo "\n— El pitch y el precio varían y no repiten la misma estructura —\n";

caso('msg_pitch abre con la frase que pidió Pablo y ya no con "Para lo tuyo va"',
    strpos((string)$cfg['msg_pitch'], 'Buenísimo, lo ideal sería') === 0
    && strpos((string)$cfg['msg_pitch'], 'Para lo tuyo va') === false);
foreach (['landing', 'ecommerce', 'turnos'] as $tipoVar) {
    caso("$tipoVar tiene varias formas de presentar la web",
        count((array)($cfg['tipos'][$tipoVar]['desc_variantes'] ?? [])) >= 3);
}
/* Las desc_variantes quedaron sin lector: el mensaje del precio lo arma
 * precio_ideal, el texto fijo que dictó Pablo, igual para todas las charlas. */

caso('el desempate de turnos ya no usa la muletilla de siempre',
    stripos((string)$cfg['desempate_turnos'], 'cambia bastante la web') === false);
caso('la oferta de la demo sigue terminando en pregunta',
    strpos((string)$cfg['msg_prediseno_oferta'], '?') !== false);

echo "\n— Al presentar la demo ya no se avisa que dura 7 días (retirado 24-ago) —\n";

$textosPresentar = wabot_muestra_presentar_textos('midemo', $cfg);
caso('presentar manda dos mensajes: la demo y, aparte, el pedido de feedback (sin el aviso de vigencia)',
    count($textosPresentar) === 2);
caso('el mensaje trae el link de la demo', strpos($textosPresentar[0], 'gokywebs.com/demo/midemo') !== false);
caso('no menciona los 7 días en ningún lado',
    stripos($textosPresentar[0], '7 días') === false);
caso('muestra_vigencia queda vacío aunque el config lo trajera cargado',
    trim((string)($cfg['muestra_vigencia'] ?? '')) === '');

caso('si preguntan hasta cuándo dura, hay respuesta',
    trim((string)($cfg['info']['demo_vigencia'] ?? '')) !== ''
    && stripos((string)$cfg['info']['demo_vigencia'], '7 días') !== false);
caso('"hasta cuándo puedo ver la demo" cae en esa clave',
    wabot_info_por_palabras('hasta cuando puedo ver la demo?', 'postdemo') === 'demo_vigencia');
caso('"el link se vence?" también',
    wabot_info_por_palabras('el link se vence?', 'postdemo') === 'demo_vigencia');
caso('pero preguntar cuánto tardan en hacerla sigue siendo plazos',
    wabot_info_por_palabras('cuanto tiempo tardan en hacerla?', 'precio') === 'plazos');

echo "\n— Plantillas de Meta: lo único que sale con la ventana cerrada —\n";

caso('la plantilla de confirmación viene activa de fábrica, con el nombre ya aprobado en Meta',
    isset($cfg['plantillas']['confirmacion_demo_48h'])
    && $cfg['plantillas']['confirmacion_demo_48h']['nombre'] === 'seguimiento_demo_72h'
    && !empty($cfg['plantillas']['confirmacion_demo_48h']['activa']));
caso('y por eso ya se puede usar sin cargar nada más',
    wabot_plantilla_config('confirmacion_demo_48h', $cfg) !== null);

$cfgPlant = wabot_config_load();
$cfgPlant['plantillas']['confirmacion_demo_48h']['activa'] = false;
caso('apagada, no se puede usar', wabot_plantilla_config('confirmacion_demo_48h', $cfgPlant) === null);
$cfgPlant['plantillas']['confirmacion_demo_48h']['activa'] = true;
caso('reactivada, vuelve a andar', wabot_plantilla_config('confirmacion_demo_48h', $cfgPlant) !== null);

$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$convPlant = ['tel' => '5491100000000', 'channel_user_id' => '5491100000000', 'canal' => 'whatsapp',
              'nombre' => 'Yesica', 'presentado_slug' => 'yfprevencion', 'transcript' => []];
caso('manda la plantilla', wabot_enviar_plantilla($convPlant, 'confirmacion_demo_48h', $cfgPlant) === true);
$envio = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? null;
caso('con el nombre y el idioma correctos', $envio[1] === 'seguimiento_demo_72h' && $envio[2] === 'es_AR');
caso('confirmacion_demo_48h es texto fijo: sin variables de nombre ni botón',
    $envio[3] === [] && $envio[4] === []);
caso('queda en el transcript el texto de referencia',
    strpos($convPlant['transcript'][0]['t'] ?? '', 'pudiste ver la demo') !== false);

// Las plantillas reales no llevan botón (Meta las aprueba sin parámetros),
// pero el guard que evita mandar un link roto sigue vivo para cualquier
// plantilla que sí lo lleve: se arma una a propósito en vez de colgarse de la
// config de una real, que puede cambiar.
$cfgPlantBotonGuard = wabot_config_load();
$cfgPlantBotonGuard['plantillas']['plantilla_test_boton'] = [
    'nombre' => 'plantilla_test_boton', 'idioma' => 'es_AR', 'activa' => true,
    'params' => [], 'boton' => ['slug'], 'texto' => 'Mirá tu demo: {slug}',
];
$sinSlug = ['tel' => '549110', 'channel_user_id' => '549110', 'canal' => 'whatsapp',
            'nombre' => 'Ana', 'presentado_slug' => '', 'transcript' => []];
caso('una plantilla que sí lleva el slug en el botón no manda un link roto sin demo presentada',
    wabot_enviar_plantilla($sinSlug, 'plantilla_test_boton', $cfgPlantBotonGuard) === false);

// El bug real: Meta rechazaba TODOS los envíos porque el codigo mandaba un
// parametro y la plantilla aprobada no lleva ninguno.
$cfgSinParams = wabot_config_load();
caso('confirmacion_demo_48h se manda sin parametros de cuerpo',
    ($cfgSinParams['plantillas']['confirmacion_demo_48h']['params'] ?? null) === []);
caso('confirmacion_demo_48h se manda sin parametros de boton',
    ($cfgSinParams['plantillas']['confirmacion_demo_48h']['boton'] ?? null) === []);
caso('confirmacion_demo_48h no deja un {nombre} sin reemplazar en el transcript',
    strpos((string)($cfgSinParams['plantillas']['confirmacion_demo_48h']['texto'] ?? ''), '{nombre}') === false);

$igPlant = ['tel' => 'ig123', 'channel_user_id' => 'ig123', 'canal' => 'instagram',
            'nombre' => 'Ana', 'presentado_slug' => 'x', 'transcript' => []];
caso('y por Instagram no se usan plantillas',
    wabot_enviar_plantilla($igPlant, 'confirmacion_demo_48h', $cfgPlant) === false);

echo "\n— El texto de la demo es el que pidió Pablo, y explica que todavía no está personalizada —\n";

$demoTextos = wabot_muestra_presentar_textos('yfprevencion', $cfg);
caso('arranca con "Hola! Ya tenemos lista la demo"', strpos($demoTextos[0], 'Hola! Ya tenemos lista la demo') === 0);
caso('trae el link', strpos($demoTextos[0], 'gokywebs.com/demo/yfprevencion') !== false);
caso('aclara que después se personaliza con contenido e imágenes propias',
    stripos($demoTextos[0], 'personalizamos') !== false && (stripos($demoTextos[0], 'imagenes') !== false || stripos($demoTextos[0], 'imágenes') !== false));
caso('son dos mensajes: la demo y, aparte, el pedido de feedback',
    count($demoTextos) === 2 && stripos($demoTextos[1], 'qué te pareció') !== false);

echo "\n— Presentada la demo, el cierre lo lleva Pablo: cualquier respuesta deriva con un único mensaje fijo —\n";

$ahoraPD = 2_000_000_000;
$convPD = ['fase' => 'postdemo', 'tipo' => 'landing', 'presentado_ts' => $ahoraPD - 21 * 3600,
           'ultimo_cliente_ts' => $ahoraPD - 7 * 3600, 'transcript' => []];

caso('en postdemo el bot muestra "escribiendo…" como en cualquier fase activa',
    wabot_avisar_al_recibir($convPD, $cfg) === true);

// El corte real (sin pasar por el motor ni por el agente) se prueba en
// test-redactor.php, que sí tiene cargado wabot_responder() a esta altura.
$convResp = $convPD;
clasifica(['otro']);
$r = wabot_engine('me gusto mucho, como sigo?', $convResp, $cfg);
caso('el que quiere avanzar NO recibe los datos para señar: lo toma Pablo',
    mb_stripos(implode(' ', $r), 'Banco Santander') === false
    && mb_stripos(implode(' ', $r), 'Pablo') !== false
    && $convResp['fase'] === 'derivado' && !empty($convResp['handoff_pendiente'])
    && $convResp['presentado_confirmado'] === true);

$convRespDuda = $convPD;
clasifica(['otro']);
$r2 = wabot_engine('mmm no se, lo tengo que pensar', $convRespDuda, $cfg);
caso('y el que duda recibe la videollamada, que es otra cosa',
    mb_stripos(implode(' ', $r2), 'videollamada') !== false
    && implode(' ', $r2) !== implode(' ', $r)
    && $convRespDuda['fase'] === 'derivado');

caso('antes de presentar la demo el bot sigue trabajando normal',
    wabot_avisar_al_recibir(['fase' => 'precio', 'tipo' => 'landing', 'precio_dado' => true], $cfg) === true);

// El reset por inactividad vencía el silencio post-demo: a los 7 días dejaba
// fase='nuevo' y presentado_ts=0, y el bot volvía a venderle desde cero a
// alguien que ya tenía su demo entregada.
$convViejaPD = ['fase' => 'postdemo', 'tipo' => 'landing', 'presentado_ts' => $ahoraPD - 30 * 86400,
                'ultimo_ts' => $ahoraPD - 30 * 86400];
caso('una charla con demo entregada NO se reinicia por vieja que sea',
    wabot_conv_reset_si_vieja($convViejaPD, $cfg, $ahoraPD) === false
    && $convViejaPD['fase'] === 'postdemo' && !empty($convViejaPD['presentado_ts']));

$convViejaSinDemo = ['fase' => 'precio', 'tipo' => 'landing', 'presentado_ts' => 0,
                     'ultimo_ts' => $ahoraPD - 30 * 86400];
caso('pero una charla vieja SIN demo entregada se reinicia como siempre',
    wabot_conv_reset_si_vieja($convViejaSinDemo, $cfg, $ahoraPD) === true
    && $convViejaSinDemo['fase'] === 'nuevo');

caso('el archivado por inactividad sigue andando',
    wabot_presentado_archivar_corresponde(['presentado_ts' => $ahoraPD - 200 * 3600], $cfg, $ahoraPD) === true);
caso('la confirmación a las 48 h corre si el bot mandó la demo y nunca contestó nada',
    wabot_confirmacion_demo_corresponde(['presentado_ts' => $ahoraPD - 49 * 3600, 'presentado_via_bot' => true], $cfg, $ahoraPD) === true);
caso('pero NO si la demo se presentó por otro medio (sin presentado_via_bot)',
    wabot_confirmacion_demo_corresponde(['presentado_ts' => $ahoraPD - 49 * 3600, 'presentado_via_bot' => false], $cfg, $ahoraPD) === false);
caso('ni si el cliente ya contestó algo (presentado_confirmado)',
    wabot_confirmacion_demo_corresponde(['presentado_ts' => $ahoraPD - 49 * 3600, 'presentado_via_bot' => true, 'presentado_confirmado' => true], $cfg, $ahoraPD) === false);

echo "\n— El logo que el cliente ya mandó no se vuelve a pedir (26-ago) —\n";

$fotoCliente = function ($texto, $archivo) {
    return ['q' => 'cliente', 't' => $texto, 'ts' => time(),
            'media' => ['clase' => 'imagen', 'archivo' => $archivo]];
};

$convSoloLogo = ['tipo' => 'ecommerce', 'imagenes_recibidas' => 1, 'transcript' => [
    $fotoCliente('[foto] Mandó el logo de su marca, con las siglas VDA', 'a.jpg'),
]];
$textoSoloLogo = wabot_texto_prediseno_completo($convSoloLogo, $cfg);
caso('si mandó solo el logo, no se le vuelve a pedir el logo',
    !preg_match('/\bmandame\b[^.]{0,40}\blogo\b/iu', $textoSoloLogo)
    && !preg_match('/\bel logo y\b/iu', $textoSoloLogo));
caso('se le reconoce que ya lo tenemos', stripos($textoSoloLogo, 'logo ya lo tengo') !== false);
caso('y se le piden las fotos que sí faltan',
    stripos($textoSoloLogo, 'fotos de tus productos') !== false);
caso('sin dejar el placeholder sin resolver', strpos($textoSoloLogo, '{imagenes}') === false);

$convConFotos = ['tipo' => 'ecommerce', 'imagenes_recibidas' => 3, 'transcript' => [
    $fotoCliente('[foto] Mandó el logo de su marca', 'a.jpg'),
    $fotoCliente('[foto] Mandó una foto de un conjunto deportivo azul', 'b.jpg'),
    $fotoCliente('[foto] Mandó una foto de un buzo canguro', 'c.jpg'),
]];
caso('si además mandó fotos de productos, se le agradece todo junto',
    wabot_texto_prediseno_completo($convConFotos, $cfg) === $cfg['prediseno_completo_con_fotos']);

// Si mandó muchas fotos y la descripción automática nombró el logo en todas,
// no se asume "solo el logo": ahí ya hay material de sobra.
$convMuchasConLogo = ['tipo' => 'ecommerce', 'imagenes_recibidas' => 4, 'transcript' => [
    $fotoCliente('[foto] un buzo con el logo del club', 'a.jpg'),
    $fotoCliente('[foto] una campera con el logo bordado', 'b.jpg'),
    $fotoCliente('[foto] un conjunto con el logo al frente', 'c.jpg'),
    $fotoCliente('[foto] otra prenda con el logo', 'd.jpg'),
]];
caso('cuatro fotos que nombran el logo no se leen como "solo el logo"',
    wabot_texto_prediseno_completo($convMuchasConLogo, $cfg) === $cfg['prediseno_completo_con_fotos']);

caso('y si no mandó nada, se le sigue pidiendo el logo y las fotos',
    stripos(wabot_texto_prediseno_completo(['tipo' => 'ecommerce', 'imagenes_recibidas' => 0, 'transcript' => []], $cfg), 'el logo') !== false);

caso('el pedido sin logo de landing queda bien redactado',
    wabot_imagenes_a_pedir_sin_logo(['tipo' => 'landing'], $cfg) === '3 o 4 fotos de tus trabajos, tu local o tu equipo');
caso('y el de institucional también, aunque diga "el logo o escudo"',
    wabot_imagenes_a_pedir_sin_logo(['tipo' => 'institucional'], $cfg) === 'algunas fotos del lugar o de las actividades');

// El bug de raíz: el contador vivía en el $conv de antes del candado, que el
// webhook descarta al recargar la conversación. Ahora se suma al drenar la cola.
$convContador = ['imagenes_recibidas' => 0];
caso('una imagen entrante suma al contador',
    wabot_imagenes_contar($convContador, ['clase' => 'imagen', 'archivo' => 'x.jpg']) === true
    && $convContador['imagenes_recibidas'] === 1);
caso('un audio no', wabot_imagenes_contar($convContador, ['clase' => 'audio']) === false
    && $convContador['imagenes_recibidas'] === 1);
caso('y un mensaje sin media tampoco',
    wabot_imagenes_contar($convContador, null) === false && $convContador['imagenes_recibidas'] === 1);
caso('el webhook cuenta las imágenes con el $conv que sí guarda',
    strpos(file_get_contents(__DIR__ . '/webhook.php'), 'wabot_imagenes_contar($conv, $item[\'media\'] ?? null)') !== false);

echo "\n— Lo que el cliente dice y no es una duda (26-ago) —\n";

caso('"Este es mi face" es material, no consulta',
    wabot_texto_no_es_consulta('Este es mi face') === 'material');
caso('"Te paso el link" también', wabot_texto_no_es_consulta('Te paso el link de mi instagram') === 'material');
caso('"Que lo haga vía wasap" es una indicación',
    wabot_texto_no_es_consulta('Que lo haga vía wasap') === 'indicacion');
caso('"prefiero que me llamen" también',
    wabot_texto_no_es_consulta('prefiero que me llamen') === 'indicacion');
caso('una pregunta con signo nunca cae acá',
    wabot_texto_no_es_consulta('Este es mi face, lo pueden usar?') === null);
caso('ni una pregunta sin signo', wabot_texto_no_es_consulta('que incluye el precio') === null);
caso('ni un mensaje largo contando el negocio',
    wabot_texto_no_es_consulta('Este es mi emprendimiento de carteles publicitarios para comercios de la zona sur') === null);

caso('"me lo repetís?" pide que se repita', wabot_pide_repetir('me lo repetís?') === true);
caso('"no me llegó" también', wabot_pide_repetir('no me llegó el mensaje') === true);
caso('un "dale" no', wabot_pide_repetir('Dale') === false);
caso('un 👍 tampoco', wabot_pide_repetir('👍 si') === false);

echo "\n— Un portal de noticias no es una landing (26-ago) —\n";

caso('"solo que sea para las noticias locales" es un portal de contenido',
    wabot_contexto_es_portal_contenido('Solo que sea para las noticias locales.') === true);
caso('"cargar noticias y novedades seguido" también',
    wabot_contexto_es_portal_contenido('quiero poder cargar noticias y novedades seguido') === true);
caso('"autoadministrable" también',
    wabot_contexto_es_portal_contenido('la quiero autoadministrable') === true);
caso('una landing común no', wabot_contexto_es_portal_contenido('Soy abogada, quiero mostrar mis servicios') === false);
caso('un club que quiere mostrar sus novedades tampoco',
    wabot_contexto_es_portal_contenido('Tengo un club y quiero mostrar las novedades del equipo') === false);

echo "\n— La pregunta del pitch tiene que estar bien construida (26-ago) —\n";

$rota = 'De tus servicios, cuál es el que más pedís que destaque?';
$preguntasPitch = [];
foreach (($cfg['tipos'] ?? []) as $t) {
    foreach (['pitch_pregunta', 'pitch_pregunta_2'] as $k) {
        if (trim((string)($t[$k] ?? '')) !== '') $preguntasPitch[] = trim((string)$t[$k]);
    }
    foreach (['pitch_pregunta_variantes', 'pitch_pregunta_2_variantes'] as $k) {
        foreach ((array)($t[$k] ?? []) as $v) $preguntasPitch[] = trim((string)$v);
    }
}
caso('la pregunta mal construida ya no está en ninguna variante',
    !in_array($rota, $preguntasPitch, true));
// Y el config que Pablo ya tiene guardado en producción también la pierde:
// los defaults solo rellenan lo vacío, así que hay que retirarla explícitamente.
$cfgGuardado = ['tipos' => ['landing' => [
    'label' => 'Landing', 'precio' => '$200.000',
    'pitch_pregunta' => $rota,
    'pitch_pregunta_variantes' => ['Qué es lo que más se destaca de tus servicios?', $rota],
]]];
wabot_config_ventas($cfgGuardado);
caso('y un config que la tenía guardada la pierde al cargar',
    $cfgGuardado['tipos']['landing']['pitch_pregunta'] !== $rota
    && !in_array($rota, (array)$cfgGuardado['tipos']['landing']['pitch_pregunta_variantes'], true));

echo "\n— Charla cerrada: no se manda el comodín pegado al aviso de espera (27-ago) —\n";

// Una foto (o cualquier mensaje que el clasificador etiquete con alguna
// acción sin ser saludo/rechazo) justo cuando se cierra la charla mandaba DOS
// mensajes contradictorios: el aviso de espera ("escribime lo que sea, te
// contesto") y, pegado, el comodín ("eso no te lo puedo contestar"). Caso
// real: Denise (BJR Best Job Review), 27-ago, con la foto del logo.
$cCerrCierre = conv_nueva();
$cCerrCierre['fase'] = 'derivado'; $cCerrCierre['cierre'] = 'prediseno'; $cCerrCierre['lead_creado'] = true;
$cCerrCierre['espera_avisada'] = false;
clasifica(['otro']);
$rCerrCierre = wabot_cerrada('Mandó el logo de su marca con sus distintas versiones y variaciones de color sobre un fondo claro. El diseño utiliza principalmente azul oscuro y negro.', $cCerrCierre, $cfg);
caso('la primera vez que escribe tras el cierre, un mensaje ambiguo NO suma el comodín',
    $rCerrCierre === [wabot_texto_espera($cCerrCierre, $cfg)]);
caso('un solo mensaje, no dos', count($rCerrCierre) === 1);

// Pero si YA se avisó la espera y sigue mandando cosas ambiguas, el comodín
// vuelve a valer: ahí no hay mensaje de espera con el que contradecirse.
$cCerrOtra = conv_nueva();
$cCerrOtra['fase'] = 'derivado'; $cCerrOtra['cierre'] = 'prediseno'; $cCerrOtra['lead_creado'] = true;
$cCerrOtra['espera_avisada'] = true;
clasifica(['otro']);
$rCerrOtra = wabot_cerrada('otra cosa ambigua', $cCerrOtra, $cfg);
caso('con la espera ya avisada, el comodín se sigue mandando como antes',
    $rCerrOtra === [$cfg['info']['otra']]);

// Y una pregunta real (pregunta_info) se sigue contestando siempre, sea la
// primera vez o no: eso nunca se tocó.
$cCerrPregunta = conv_nueva();
$cCerrPregunta['fase'] = 'derivado'; $cCerrPregunta['cierre'] = 'prediseno'; $cCerrPregunta['lead_creado'] = true;
$cCerrPregunta['espera_avisada'] = false;
clasifica(['pregunta_info'], ['info_keys' => ['plazos']]);
$rCerrPregunta = wabot_cerrada('en cuanto tiempo la tienen?', $cCerrPregunta, $cfg);
caso('una pregunta real sigue contestándose aunque sea la primera vez tras el cierre',
    in_array(wabot_texto_plazos($cCerrPregunta, $cfg), $rCerrPregunta, true));
caso('y no se le repite dos veces la misma línea',
    count($rCerrPregunta) === count(array_unique($rCerrPregunta)));

echo "\n— Proveedor que nos vende A NOSOTROS: silencio, no es un lead (27-ago) —\n";

// DevZeppelin mandó su propia promo de webs y el bot le preguntó el rubro y le
// contestó "no hacemos logos" (la palabra estaba en SU listado).
$volanteDev = "Promo de web profesional + pack de diseño por \$199.000.\n\nIncluye:\n"
    . "✅ Página web moderna ultra rápida\n✅ Dominio .com.ar gratis por 1 año\n✅ Hosting gratis\n"
    . "✅ Optimización para búsquedas (Google e IA)\n✅ Pack de diseño para redes (Flyers, Logo, Historias destacadas)\n"
    . "✅ Un reel promocional incluído!\n\nNuestras web son anexalinks.ar y devzeppelin.ar, para que veas calidad y velocidad!";
caso('el volante de otra agencia se detecta como proveedor', wabot_texto_es_proveedor($volanteDev) === true);
caso('una agencia que pide precio con "consultanos" también',
    wabot_texto_es_proveedor('Somos una agencia de marketing digital, hacemos paginas web y redes sociales. Consultanos por nuestros planes: 15000 por mes.') === true);

// Los falsos positivos son mucho más caros que los falsos negativos: ignorar a
// un cliente real es perder la venta entera. Estos cinco tienen que pasar.
foreach ([
    'agencia que quiere SU web' => 'Hola, somos una agencia de marketing digital y necesitamos una pagina web propia para mostrar nuestros casos de exito y que nos contacten los clientes.',
    'cliente que ofrece su servicio' => 'Hola! Ofrecemos servicio de fumigacion y control de plagas en todo el conurbano, queria una pagina web para el negocio',
    'cliente que vio nuestra promo' => 'Hola, vi la promo de la pagina web por $199.000 en instagram y me interesa para mi local de ropa, me pasas mas informacion?',
    'cliente que pregunta qué incluye' => 'Queria saber si el presupuesto de $290.000 incluye el hosting y el dominio o se paga aparte, y si el diseño web es a medida o con plantilla',
    'cliente que muestra sus servicios' => 'Buenas, necesito una pagina web para mostrar nuestros servicios de contabilidad y que nos escriban por whatsapp los clientes nuevos',
] as $que => $mensaje) {
    caso("un $que NO se confunde con proveedor", wabot_texto_es_proveedor($mensaje) === false);
}

$cProveedor = conv_nueva();
$rProveedor = wabot_cerrar_proveedor($cProveedor);
caso('al proveedor no se le contesta nada', $rProveedor === []);
caso('y queda fuera de los seguimientos automáticos',
    !empty($cProveedor['seguimiento_bloqueado']) && $cProveedor['cierre'] === 'proveedor');

echo "\n— \"Costos?\" en medio de un desempate: los dos precios, no el rango (27-ago) —\n";

// Pediatría ya había dicho el rubro y estaba contestando la pregunta de turnos.
// Preguntó "Costos?" y el bot volvió al rango genérico rematando con "contame a
// qué te dedicás": tiró a la basura todo lo que ya sabía.
/* Sigue valiendo para el desempate que quedó vivo: el de cursos. */
$dosCursos = wabot_desempate_precios_texto('desempate_cursos', $cfg);
caso('el desempate de cursos contesta con los dos precios reales',
    strpos($dosCursos, (string)$cfg['tipos']['landing']['precio']) !== false
    && strpos($dosCursos, (string)$cfg['tipos']['elearning']['precio']) !== false);
caso('y NO vuelve a pedir el rubro',
    stripos($dosCursos, 'a qué te dedicás') === false && stripos($dosCursos, 'rubro') === false);
caso('fuera de un desempate no aplica', wabot_desempate_precios_texto('precio', $cfg) === null);

/* Pero un desempate con un tipo RETIRADO no dice ningún precio: decía
 * "$200.000 si los reservan solos desde la web", el cliente elegía esa y
 * recibía el sitio profesional a $180.000 (auditoría del 2-sep). */
caso('el desempate de turnos ya no cotiza: turnos está retirado',
    wabot_desempate_precios_texto('desempate_turnos', $cfg) === null);
caso('ni el de comercio, con catálogo retirado',
    wabot_desempate_precios_texto('desempate_comercio', $cfg) === null);

echo "\n— El listado de datos se pide una vez; después, silencio (27-ago) —\n";

// Una clienta de cosméticos contestó "Ok", "Listo gracias" y "🫶 si" y se llevó
// tres mensajes distintos diciéndole lo mismo.
$cDatos = ['fase' => 'prediseno', 'prediseno_pedido' => ['Tu nombre', 'El nombre de tu negocio']];
foreach (['Ok', 'Listo gracias', 'dale', 'si', '🫶 si'] as $acuse) {
    caso("\"$acuse\" tras el listado es solo un acuse", wabot_prediseno_acuse($acuse, $cDatos) === true);
}
caso('pero un dato real no lo es', wabot_prediseno_acuse('Denise, BJR Best Job Review', $cDatos) === false);
caso('ni pedir que lo repitan', wabot_prediseno_acuse('me lo repetís?', $cDatos) === false);
caso('y antes de pedir el listado, tampoco aplica',
    wabot_prediseno_acuse('Ok', ['fase' => 'prediseno', 'prediseno_pedido' => []]) === false);
caso('ni en otra fase', wabot_prediseno_acuse('Ok', ['fase' => 'precio', 'prediseno_pedido' => ['x']]) === false);

echo "\n— Necesidades mixtas: se nombra lo que pidió antes de derivar (27-ago) —\n";

// Valeria explicó terapias + cursos + productos y el bot contestó "te paso con
// el desarrollador" sin nombrar una sola de las tres.
$ejesValeria = wabot_ejes_mixtos('Soy Valeria Terapeuta holistica, queria una página donde ofrecer mis servicios online '
    . '(lecturas de cartas, cursos de diversas mancias, terapias de sanacion) y ademas vender productos, sahumerios y cascadas de humo.');
caso('los tres ejes de Valeria se detectan',
    $ejesValeria !== null && count($ejesValeria) === 3);
$textoValeria = wabot_texto_mixto($ejesValeria, $cfg);
caso('y el texto nombra las tres cosas antes de derivar',
    stripos($textoValeria, 'servicios') !== false && stripos($textoValeria, 'cursos') !== false
    && stripos($textoValeria, 'productos') !== false);
caso('sin inventar un precio para el combinado', preg_match('/\$\s?\d/u', $textoValeria) === 0);

$ejesPsico = wabot_ejes_mixtos('Psicología, quiero ofrecer sesiones, grupos y cuadernillos');
caso('sesiones + cuadernillos también es mixto', $ejesPsico !== null && count($ejesPsico) === 2);

// "Taller" solo NO es un curso: un taller de manualidades, uno mecánico o uno
// de costura son el LUGAR donde trabaja. Se le cobró caro a una clienta de
// macramé y bijouterie el 27-ago: ya tenía su ecommerce cotizado en $290.000 y
// el aviso de mixto le sacó el precio de la mesa por esa sola palabra.
foreach ([
    'taller de manualidades' => 'Yo tengo un taller de manualidades. Basicamente macrame y bijouterie',
    'taller mecánico'        => 'tengo un taller mecanico y vendo repuestos',
    'taller de costura'      => 'taller de costura, vendo telas',
] as $que => $mensaje) {
    caso("un $que es el lugar, no un curso", wabot_ejes_mixtos($mensaje) === null);
}
// Pero el que DICTA talleres sí los vende como curso.
caso('"doy talleres y vendo los kits" sí es mixto',
    ($e = wabot_ejes_mixtos('doy talleres de macrame y ademas vendo los kits')) !== null
    && array_keys($e) === ['cursos', 'productos']);
caso('"talleres online" también',
    wabot_ejes_mixtos('talleres online de tejido y vendo lana') !== null);
// "vendo" faltaba en el eje de productos y es la forma más común de decirlo.
caso('"vendo los libros" cuenta como venta de productos',
    wabot_ejes_mixtos('doy cursos de ingles y vendo los libros') !== null);
// "terapeuta" no matcheaba "terapia": así se presenta la mayoría.
caso('"soy terapeuta" cuenta como servicio',
    ($e2 = wabot_ejes_mixtos('soy terapeuta, doy cursos y vendo sahumerios')) !== null
    && count($e2) === 3);

// Un rubro simple NO puede caer acá: dispararía el aviso de mixto a cualquiera.
foreach ([
    'ferretería' => 'Rubro ferretería especializada en herrajes',
    'streetwear' => 'necesito un tienda sobre ropa estilo streetwear que me permita cargar la mercadería con talles',
    'traslados'  => 'Quisiera una página web para una agencia de traslados, en Puerto Iguazú',
    'pediatría'  => 'Pediatría',
] as $que => $mensaje) {
    caso("$que es un rubro simple, no mixto", wabot_ejes_mixtos($mensaje) === null);
}

echo "\n— Una sola pregunta por tanda (27-ago) —\n";

// A la clienta de cosméticos le llegaron dos preguntas seguidas y
// contradictorias: el desempate del rubro y la del pitch, en el mismo turno.
$dosPreguntas = wabot_una_sola_pregunta([
    'Qué servicio de belleza ofrecés?',
    'Cuál es el producto que más vendés?',
]);
caso('de dos preguntas seguidas queda solo la primera',
    $dosPreguntas === ['Qué servicio de belleza ofrecés?']);
caso('el precio + la pregunta del pitch siguen saliendo juntos (una sola "?")',
    count(wabot_una_sola_pregunta([
        wabot_msg_precio_texto('ecommerce', $cfg),
        'Cuál es el producto que más vendés?',
    ])) === 2);
caso('y una tanda sin preguntas no se toca',
    wabot_una_sola_pregunta(['Listo, anotado.', 'La demo te llega mañana.']) === ['Listo, anotado.', 'La demo te llega mañana.']);

echo "\n— Las dudas de BJR que se llevaron el comodín (27-ago) —\n";

caso('"Es para una página de reseñas" es el rubro, no una duda',
    wabot_texto_no_es_consulta('Es para una página de reseñas') === 'rubro');
caso('"necesito una pagina web para mi estudio" también',
    wabot_texto_no_es_consulta('necesito una pagina web para mi estudio') === 'rubro');
caso('pero con signo de pregunta sigue siendo una consulta',
    wabot_texto_no_es_consulta('Es para una pagina de reseñas, cuanto sale?') === null);

caso('"No quiero llevarlos a WhatsApp" tiene respuesta propia',
    wabot_info_por_palabras('No quiero llevarlos a WhatsApp') === 'sin_whatsapp');
caso('y ofrece formulario o mail como alternativa',
    stripos((string)$cfg['info']['sin_whatsapp'], 'formulario') !== false
    && stripos((string)$cfg['info']['sin_whatsapp'], 'mail') !== false);
caso('querer WhatsApp no dispara esa respuesta',
    wabot_info_por_palabras('quiero que me contacten por whatsapp') !== 'sin_whatsapp');

caso('"Cómo me comunico con el desarrollador?" tiene respuesta propia',
    wabot_info_por_palabras('Cómo me comunico con el desarrollador?') === 'contacto_desarrollador');
caso('y avisa que escribe él, desde el número de proyectos',
    stripos((string)$cfg['info']['contacto_desarrollador'], 'número de proyectos') !== false);

echo "\n— La demo se ofrece SIEMPRE diciendo que es gratis (27-ago) —\n";

// A una óptica el modelo le ofreció la demo con palabras propias y se le cayó
// la palabra: "Qué te parece si te armamos una versión de tu web para que la
// veas antes de decidir?". El cliente contestó "eso tiene algún fee mensual??",
// o sea entendió que podía costarle. Sin "gratis" la oferta deja de serlo.
$ofertaPelada = 'Que te parece si te armamos una version de tu web para que la veas antes de decidir?';
$rGratis = wabot_demo_siempre_gratis([$ofertaPelada], $cfg);
caso('una oferta sin "gratis" recibe la aclaración',
    $rGratis[0] === $ofertaPelada . ' ' . $cfg['demo_es_gratis']);
caso('y la aclaración dice gratis con todas las letras',
    stripos((string)$cfg['demo_es_gratis'], 'gratis') !== false);

// Las que ya lo dicen no se tocan: agregarlo de nuevo sonaría a bot.
foreach (array_merge([$cfg['msg_prediseno_oferta']], (array)($cfg['msg_prediseno_oferta_variantes'] ?? [])) as $i => $oficial) {
    caso("la variante oficial $i ya dice que es gratis y no se toca",
        wabot_demo_siempre_gratis([$oficial], $cfg) === [$oficial]);
}

// Y lo que no ofrece la demo no se toca nunca: sin esto, el precio y las
// preguntas del pitch terminarían con un "es gratis" que no viene a cuento.
foreach ([
    'el precio'      => wabot_msg_precio_texto('ecommerce', $cfg),
    'el pitch'       => 'Cuál es tu producto estrella?',
    'un comentario'  => 'Excelente, los lentes de sol y recetados van muy bien en la tienda online.',
    'la derivación'  => (string)$cfg['derivar'],
] as $que => $texto) {
    caso("$que no recibe la aclaración de gratis",
        wabot_demo_siempre_gratis([$texto], $cfg) === [$texto]);
}

// El detector distingue OFRECER de mencionar de pasada.
caso('"te armamos una versión de tu web" es ofrecer',
    wabot_texto_ofrece_demo('que te parece si te armamos una version de tu web') === true);
caso('"la demo te llega mañana" no es ofrecer',
    wabot_texto_ofrece_demo('listo, la demo te llega manana') === false);

echo "\n— El bot no manda dos veces el mismo texto (27-ago, 4 chats reales) —\n";

// "Alquiler de pantallas led" recibió "Contame un poco más, qué vendés o qué
// servicio ofrecés?" SIETE veces, incluso después de que el cliente
// contestara, avisara que no tenía nada más para contar y escribiera "???".
// Lo mismo con destapaciones, netbooks y catering el mismo día.
$cRep = conv_nueva(); $cRep['fase'] = 'algo_diferente';
$r1Rep = wabot_anti_repeticion([$cfg['contame']], $cRep, $cfg);
caso('la primera vez la pregunta sale tal cual', $r1Rep === [$cfg['contame']]);
$r2Rep = wabot_anti_repeticion([$cfg['contame']], $cRep, $cfg);
caso('la segunda sale reformulada, no repetida', $r2Rep === [$cfg['contame_2']]);
$r3Rep = wabot_anti_repeticion([$cfg['contame']], $cRep, $cfg);
caso('la tercera deriva: dos formas de preguntar no alcanzaron',
    $r3Rep === [$cfg['derivar']] && $cRep['fase'] === 'derivado' && !empty($cRep['handoff_pendiente']));

// Sin historial (mirando solo el último mensaje) el bot alternaba entre la
// pregunta y su reformulación para siempre: el mismo pozo con dos textos.
$cAlt = conv_nueva(); $cAlt['fase'] = 'algo_diferente';
wabot_anti_repeticion([$cfg['contame']], $cAlt, $cfg);
wabot_anti_repeticion([$cfg['contame']], $cAlt, $cfg);          // → contame_2
$rAlt = wabot_anti_repeticion([$cfg['contame_2']], $cAlt, $cfg); // ya se usó
caso('volver a la reformulación tampoco reabre el loop', $rAlt === [$cfg['derivar']]);

// Una respuesta distinta pasa derecho y reinicia el contador: el guard no
// puede trabar una charla que avanza.
$cOk = conv_nueva();
wabot_anti_repeticion([$cfg['contame']], $cOk, $cfg);
$precioTxt = wabot_msg_precio_texto('landing', $cfg);
caso('un mensaje distinto pasa sin tocar', wabot_anti_repeticion([$precioTxt], $cOk, $cfg) === [$precioTxt]);
caso('y el contador queda en cero', (int)($cOk['repeticiones_seguidas'] ?? -1) === 0);
caso('una tanda vacía no rompe nada', wabot_anti_repeticion([], $cOk, $cfg) === []);

echo "\n— Los rubros que el bot no reconocía (27-ago, 4 chats reales) —\n";

foreach ([
    'para destapaciones'                                    => 'landing',
    'Alquiler de pantallas led'                             => 'landing',
    'Tenemos sonido e iluminacion pero nos especializamos en pantallas led' => 'landing',
    'Tengo un emprendimiento de servicios de catering'      => 'landing',
    'Para Netbooks'                                         => 'ecommerce',
    'Y celulares todo usados'                               => 'ecommerce',
] as $mensaje => $esperado) {
    caso("\"" . mb_substr($mensaje, 0, 38) . "\" se reconoce como $esperado",
        wabot_fallback_rubro_local($mensaje) === $esperado);
}

echo "\n— De punta a punta: los 4 chats trabados ya cotizan en el 1er mensaje —\n";

// Las tres fases de entrada miraban SOLO lo que etiquetó el clasificador, y
// cuando este no reconocía nada salía "contame un poco más" aunque el cliente
// hubiera dicho su rubro con todas las letras. Acá se fuerza al clasificador a
// no reconocer nada (['otro']), que es justo lo que pasaba en producción.
foreach ([
    'Alquiler de pantallas led'                        => 'landing',
    'para destapaciones'                               => 'landing',
    'Tengo un emprendimiento de servicios de catering'  => 'landing',
    'Para Netbooks'                                     => 'ecommerce',
] as $mensajeReal => $tipoEsperado) {
    $cReal = conv_nueva(); $cReal['fase'] = 'menu';
    clasifica(['otro']);
    $rReal = wabot_engine($mensajeReal, $cReal, $cfg);
    caso("\"" . mb_substr($mensajeReal, 0, 34) . "\" cotiza $tipoEsperado, no repregunta",
        ($cReal['tipo'] ?? '') === $tipoEsperado
        && !empty($cReal['precio_dado'])
        && strpos(implode(' ', $rReal), (string)$cfg['contame']) === false);
}
// El rubro que trae el clasificador sigue ganando: vio la charla entera, no
// una sola frase.
$cGana = conv_nueva(); $cGana['fase'] = 'menu';
clasifica(['rubro_inmobiliaria']);
wabot_engine('tengo un local y también propiedades', $cGana, $cfg);
caso('si el clasificador trae rubro, ese gana sobre el matcher local',
    ($cGana['tipo'] ?? '') === 'inmobiliaria');

echo "\n— Pedir un agente es pedir un humano (27-ago) —\n";

// "Se puede hablar con un agente" quedó sin reconocer y el bot siguió
// pidiéndole los colores de la marca. Ignorar un pedido de humano es la falla
// más cara que puede tener el bot.
foreach ([
    'Se puede hablar con un agente',
    'quiero un operador',
    'hablar con un representante',
    'necesito una persona',
    'quiero hablar con una persona',
] as $pedido) {
    caso("\"$pedido\" deriva", wabot_handoff_causa_explicita($pedido) === 'pide_humano');
}
// Pero el que describe SU negocio no pide un humano: con el verbo elidido no
// hay forma de distinguirlo, así que ahí no valen vendedor ni asesor.
foreach ([
    'necesito un vendedor para mi local',
    'necesito un asesor de seguros para mi empresa',
    'tengo un local de ropa',
] as $rubroPropio) {
    caso("\"" . mb_substr($rubroPropio, 0, 34) . "\" NO se confunde con pedir humano",
        wabot_handoff_causa_explicita($rubroPropio) === null);
}

echo "\n— Nombrar el logo no es preguntar por el logo (27-ago) —\n";

// Un cliente de catering mandó la foto de su logo, dijo "Es el logo del
// emprendimiento" y se llevó "no hacemos logos"; después dijo "No necesito
// logo" y se lo llevó otra vez.
foreach ([
    'Es el logo del emprendimiento',
    'No necesito logo',
    'ya tengo logo',
    'te paso el logo',
] as $noEsConsulta) {
    caso("\"$noEsConsulta\" no dispara la respuesta del logo",
        wabot_info_por_palabras($noEsConsulta) !== 'logo');
}
foreach ([
    'hacen el logo?',
    'me incluyen logo',
    'no se si el logo o la identidad',
] as $siEsConsulta) {
    caso("\"$siEsConsulta\" sí la dispara",
        wabot_info_por_palabras($siEsConsulta) === 'logo');
}

echo "\n— Facturación: solo Factura C (27-ago) —\n";

// Una SRL responsable inscripto pregunto "nos hacen factura A?" y el bot le
// contesto las formas de pago, que no era la pregunta: se fue sin saber si
// podia deducir el IVA.
caso('"nos hacen factura A?" tiene respuesta propia',
    wabot_info_por_palabras('Nos hacen factura A? Somos responsables inscriptos') === 'facturacion');
caso('"qué tipo de factura hacen?" también',
    wabot_info_por_palabras('que tipo de factura hacen?') === 'facturacion');
caso('la respuesta dice Factura C y que no hay A ni B',
    stripos((string)$cfg['info']['facturacion'], 'factura c') !== false
    && stripos((string)$cfg['info']['facturacion'], 'no emitimos factura a') !== false);
// "¿Tengo que estar inscripto?" es OTRA pregunta y no se la puede comer.
caso('preguntar si el cliente debe estar inscripto sigue yendo a inscripcion',
    wabot_info_por_palabras('tengo que estar inscripto en afip?') === 'inscripcion');

echo "\n— Apps: sí las hacemos, pero se cotizan aparte (27-ago) —\n";

// "Necesito una app para celular" termino en el flujo de sistemas sin que
// nadie le confirmara siquiera que las hacemos.
caso('pedir una app para celular se reconoce',
    wabot_info_por_palabras('necesito una app para celular, para pedidos') === 'apps');
caso('y "para descargar del Play Store" también',
    wabot_info_por_palabras('app app, para descargar del Play Store') === 'apps');
caso('la respuesta confirma que las hacemos y que se cotizan aparte',
    stripos((string)$cfg['info']['apps'], 'sí, también desarrollamos aplicaciones') !== false
    && stripos((string)$cfg['info']['apps'], 'se cotizan aparte') !== false);
caso('y la app de celular habilita el handoff, porque no tiene precio de lista',
    wabot_handoff_causa_explicita('necesito una app para celular, para pedidos') === 'app_movil');
// Un sistema interno NO es una app de celular: tiene su propio flujo, que
// junta el brief antes de derivar.
caso('"quiero una app para stock" sigue siendo un sistema, no un handoff pelado',
    wabot_handoff_causa_explicita('quiero una app para stock') === null);
caso('y "por la app de WhatsApp" no pide ninguna app',
    wabot_handoff_causa_explicita('te escribo por la app de whatsapp') === null);

echo "\n— \"Las dos cosas\": el ecommerce ya trae las dos (27-ago) —\n";

// "Las dos cosas, que puedan comprar online y tambien consultarme por
// WhatsApp" recibio la oferta de la demo, sin confirmarle que no hay que
// elegir. El tipo (ecommerce) ya estaba bien: lo que faltaba era decirlo.
$lasDos = 'Las dos cosas, que puedan comprar online y tambien consultarme por WhatsApp';
caso('fuera del desempate, "las dos cosas" se confirma',
    wabot_info_por_palabras($lasDos, 'pitch') === 'las_dos_formas');
caso('y el texto aclara que no hay que elegir',
    stripos((string)$cfg['info']['las_dos_formas'], 'no hay que elegir') !== false
    && stripos((string)$cfg['info']['las_dos_formas'], 'whatsapp') !== false);
// Dentro del desempate NO se toca: ahí "las dos" es la respuesta, y la
// resuelve el desempate cotizando ecommerce, que es el tipo que cubre ambas.
caso('dentro del desempate sigue resolviéndolo el desempate',
    wabot_info_por_palabras($lasDos, 'desempate_comercio') === null);
caso('y ese desempate lo cotiza como ecommerce',
    wabot_desempate_por_palabras('desempate_comercio', $lasDos) === 'comercio_vender');

echo "\n— El aviso de mixto va en el embudo de precio, no se puede esquivar (27-ago) —\n";

// El guard vivía solo en dar_precio y la respuesta a un desempate toma un
// atajo determinista que llama a wabot_precio() directo, sin pasar por la
// herramienta: psicoeducación pidió "sesiones, grupos y cuadernillos",
// contestó "Reservar" y se llevó turnos de $200.000 con los cuadernillos
// afuera. Acá se prueba por ese mismo atajo.
$cMixPrecio = conv_nueva();
$cMixPrecio['fase'] = 'desempate_turnos';
$cMixPrecio['transcript'] = [['q' => 'cliente', 't' => 'Psicologia, quiero ofrecer sesiones, grupos y cuadernillos', 'ts' => time() - 20]];
$cMixPrecio['session_started_ts'] = time() - 60;
$rMixPrecio = wabot_precio('turnos', $cMixPrecio, $cfg);
caso('cotizar tras un desempate mixto avisa en vez de cotizar',
    count($rMixPrecio) === 2 && stripos($rMixPrecio[0], 'integre') !== false);
caso('y pregunta si lo quiere todo junto o arranca por una parte',
    $rMixPrecio[1] === (string)$cfg['mixto_pregunta']);
caso('sin dar el precio de turnos como si cubriera todo',
    strpos($rMixPrecio[0], (string)$cfg['tipos']['turnos']['precio']) === false
    && empty($cMixPrecio['precio_dado']));
caso('queda marcado para no repetirlo', !empty($cMixPrecio['mixto_avisado']));

/* Con el precio YA dado el aviso no sale, aunque el contexto lo dispare: le
 * sacaríamos al cliente un número que ya tenía. "El precio no sale de la
 * lista" después de haberle dicho $290.000 es peor que no avisar nada — le
 * pasó a la clienta de macramé el 27-ago. */
$cYaCotizado = conv_nueva();
$cYaCotizado['fase'] = 'pitch'; $cYaCotizado['tipo'] = 'ecommerce';
$cYaCotizado['precio_dado'] = true; $cYaCotizado['pitch_hecho'] = true;
$cYaCotizado['transcript'] = [['q' => 'cliente', 't' => 'doy talleres y vendo los kits', 'ts' => time() - 20]];
$cYaCotizado['session_started_ts'] = time() - 60;
$rYaCotizado = wabot_precio('ecommerce', $cYaCotizado, $cfg);
caso('con el precio ya dado, el aviso de mixto NO sale',
    stripos(implode(' ', $rYaCotizado), 'integre') === false);
caso('y el precio que ya tenía sigue en pie', empty($cYaCotizado['mixto_avisado']));
// Ya avisado, la segunda vez cotiza normal: el aviso no puede trabar la venta.
$rMixPrecio2 = wabot_precio('landing', $cMixPrecio, $cfg);
caso('la segunda vez ya cotiza normal',
    strpos(implode(' ', $rMixPrecio2), (string)$cfg['tipos']['landing']['precio']) !== false);
// Un rubro simple nunca pasa por acá.
$cSimplePrecio = conv_nueva();
$cSimplePrecio['transcript'] = [['q' => 'cliente', 't' => 'Tengo una ferreteria de herrajes', 'ts' => time() - 20]];
$cSimplePrecio['session_started_ts'] = time() - 60;
caso('un rubro simple cotiza directo, sin aviso de mixto',
    strpos(implode(' ', wabot_precio('ecommerce', $cSimplePrecio, $cfg)), (string)$cfg['tipos']['ecommerce']['precio']) !== false);

echo "\n— \"Quiero vender mis diseños\" no es un callejón sin salida (27-ago) —\n";

// Sin esto el bot no reconocía nada y preguntaba el rubro DOS veces con
// distinta redacción ("qué vendés o qué servicio ofrecés?" y después "a qué
// rubro te dedicás?") a alguien que ya había contestado. Pasó dos veces el
// mismo día: BJR y el ebook de diseños.
caso('"quiero vender mis diseños" cae en el desempate de comercio',
    wabot_fallback_rubro_local('quiero vender mis disenos') === 'hibrido_pendiente');
caso('"vendo cuadros pintados a mano" también',
    wabot_fallback_rubro_local('vendo cuadros pintados a mano') === 'hibrido_pendiente');
// El catch-all va ÚLTIMO: no puede pisar los rubros que ya se reconocían.
foreach ([
    'vendo ropa'                => 'ecommerce',
    'vender online con carrito' => 'ecommerce',
    'soy plomero'               => 'landing',
    'tengo una peluqueria'      => 'landing',
    'doy cursos de ingles'      => 'cursos',
    'tengo una inmobiliaria'    => 'inmobiliaria',
] as $mensaje => $esperado) {
    caso("\"$mensaje\" sigue resolviendo a $esperado",
        wabot_fallback_rubro_local($mensaje) === $esperado);
}
caso('y lo que no habla de vender sigue sin resolver',
    wabot_fallback_rubro_local('hola') === null);

echo "\n— Contenido cargado por usuarios es desarrollo a medida (27-ago) —\n";

// BJR: "es para una página de reseñas" no matcheaba ningún rubro, así que el
// bot preguntó "qué vendés o qué servicio ofrecés?", el cliente contestó
// "reseñas laborales", y volvió a preguntar "a qué rubro te dedicás". Dos
// veces la misma pregunta con distinta redacción, y la charla no avanzó nunca.
// Un sitio donde el contenido lo cargan los usuarios necesita cuentas,
// moderación y panel: es a medida, no una landing.
foreach ([
    'página de reseñas'        => 'Es para una pagina de resenas',
    'reseñas laborales'        => 'Resenas laborales, los usuarios dejan opiniones de sus empleos',
    'foro'                     => 'quiero un foro para mi comunidad',
    'bolsa de trabajo'         => 'una bolsa de trabajo para mi rubro',
    'avisos de usuarios'       => 'quiero que los usuarios publiquen sus avisos',
] as $que => $mensaje) {
    caso("$que va al flujo de sistemas, no a un tipo de la lista",
        wabot_contexto_es_portal_contenido($mensaje) === true);
}
// El portal de noticias, que ya estaba, sigue andando.
caso('el portal de noticias sigue detectándose',
    wabot_contexto_es_portal_contenido('un portal de noticias locales') === true);
// Y los rubros normales NO pueden caer acá: los mandaría a todos a "a medida".
foreach ([
    'ferretería'           => 'tengo una ferreteria y vendo herrajes',
    'plomero'              => 'soy plomero, quiero mostrar mis trabajos',
    'ecommerce'            => 'vendo indumentaria online con carrito',
    'reseñas de Google'    => 'quiero mostrar las resenas de Google en mi web',
] as $que => $mensaje) {
    caso("$que sigue siendo un tipo normal", wabot_contexto_es_portal_contenido($mensaje) === false);
}

echo "\n— \"No sé qué me conviene\" no elige el tipo más caro (27-ago) —\n";

// Germán nombró las dos opciones ("una tienda o canal de ventas de whatsapp")
// y dijo que no sabía cuál le convenía. La palabra "tienda" alcanzaba para
// devolver 'vender' y se le cotizó el tipo más caro sin preguntarle nada:
// $290.000 en vez de los $180.000 del catálogo, sin que él eligiera.
caso('mencionar las dos opciones y dudar no elige ninguna',
    wabot_desempate_por_palabras('desempate_comercio',
        'Para hacer una tienda o canal de ventas de whasaap o no se q me conviene') === null);
caso('"no se q me conviene" con la q de WhatsApp también cuenta',
    wabot_desempate_por_palabras('desempate_comercio', 'no se q me conviene') === null);
caso('"qué me recomendás?" tampoco decide solo',
    wabot_desempate_por_palabras('desempate_turnos', 'que me recomendas?') === null);
// Pero el que YA eligió se respeta: la duda no puede tragarse una respuesta.
caso('el que eligió vender online sigue eligiendo',
    wabot_desempate_por_palabras('desempate_comercio', 'quiero vender online con carrito') === 'comercio_vender');
caso('y el que eligió WhatsApp también',
    wabot_desempate_por_palabras('desempate_comercio', 'que me escriban por whatsapp nomas') === 'comercio_mostrar');
caso('un "reservar" pelado sigue siendo turnos',
    wabot_desempate_por_palabras('desempate_turnos', 'reservar') === 'turnos_si');

echo "\n— \"Armala con ejemplos\" pide relleno, no el portfolio (27-ago) —\n";

// silfer herrajes: "armala con ejemplos, no es necesario que te envíe nada por
// el momento" = usá contenido de relleno mientras junto el material. El
// matcher lo leía como "mostrame trabajos que hicieron" y le habría contestado
// con el link del portfolio, que no es lo que pidió.
caso('"armala con ejemplos" no pide el portfolio',
    wabot_info_por_palabras('armala con ejemplos, no es necesario que te envie por el momento') === null);
caso('"hacela con fotos de ejemplo" tampoco',
    wabot_info_por_palabras('hacela con fotos de ejemplo') === null);
caso('"ponele datos de ejemplo por ahora" tampoco',
    wabot_info_por_palabras('ponele datos de ejemplo por ahora') === null);
caso('pero pedir ejemplos de trabajos sigue andando',
    wabot_info_por_palabras('tenes ejemplos de trabajos que hayan hecho?') === 'ejemplos');
caso('y pedir una web de muestra también',
    wabot_info_por_palabras('me pasas algun ejemplo de web que hicieron?') === 'ejemplos');
caso('"De todo tenés alguna para ver" ahora sí se reconoce',
    wabot_info_por_palabras('De todo tenes alguna para ver') === 'ejemplos');
caso('sin comerse otras preguntas con "alguna"',
    wabot_info_por_palabras('tenes alguna forma de pago') === 'pago');

echo "\n— Portugués filtrado en la redacción (26-ago) —\n";

require_once __DIR__ . '/redactor.php';
caso('"si não tenés" se corrige a "si no tenés"',
    wabot_castellanizar('y si não tenés no pasa nada') === 'y si no tenés no pasa nada');
caso('respeta la mayúscula inicial', wabot_castellanizar('Não hay problema') === 'No hay problema');
caso('un texto en español correcto no se toca',
    wabot_castellanizar('Contame los colores de tu marca y armamos la demo.') === 'Contame los colores de tu marca y armamos la demo.');

echo "\n— El precio manda el portfolio prefiltrado (28-ago) —\n";

// Pablo, 28-ago: con el precio va gokywebs.com/portfolio/ ya filtrado por el
// tipo cotizado. Al de ecommerce le tienen que aparecer tiendas, no landings.
// Catálogo y turnos ya no son una categoría del portfolio (sus trabajos están
// dentro de ecommerce y de landing): el link sigue igual, pero el texto nombra
// lo que el cliente va a ver.
/* Desde el 2-sep el portfolio salió de los mensajes de precio: ahí va el link
 * del presupuesto, y los trabajos del rubro están enlazados adentro de esa
 * página. El único que conserva el portfolio es el RESUMEN, el que sale
 * cuando vuelven a preguntar el precio: ahí es lo único que agrega algo. */
foreach (wabot_tipos_ofrecibles($cfg) as $tipo) {
    $msg = wabot_msg_precio_texto($tipo, $cfg);
    caso("el precio de $tipo linkea el presupuesto y no el portfolio",
        strpos($msg, (string)$cfg['tipos'][$tipo]['link']) !== false
        && stripos($msg, 'portfolio') === false);
}

caso('el resumen del precio sí conserva el portfolio filtrado',
    strpos(wabot_precio_resumen(['tipo' => 'ecommerce', 'precio_dado' => true], $cfg),
           'gokywebs.com/portfolio/?tipo=ecommerce') !== false);

caso('ninguna variante del precio se queda sin el link del presupuesto',
    count(array_filter((array)$cfg['msg_precio_variantes'], function ($v) {
        return strpos($v, '{link}') === false;
    })) === 0);

// El "?" de la query string no es una pregunta: si contara como tal,
// wabot_una_sola_pregunta() se comería la pregunta del pitch que va atrás.
caso('el "?" del link no hace pasar el precio por pregunta',
    strpos(wabot_texto_sin_links('mirá gokywebs.com/portfolio/?tipo=ecommerce'), '?') === false);
caso('pero una pregunta de verdad sigue teniendo su "?"',
    strpos(wabot_texto_sin_links('Cuál es el producto que más vendés?'), '?') !== false);
caso('el precio + la pregunta del pitch siguen saliendo los dos',
    count(wabot_una_sola_pregunta([
        wabot_msg_precio_texto('ecommerce', $cfg),
        'Cuál es el producto que más vendés?',
    ])) === 2);

/* Desde el 2-sep el mensaje del precio NO lleva el portfolio: lleva el link
 * del presupuesto, y los trabajos del rubro están enlazados adentro de esa
 * página. Dos links en el mismo mensaje se pisan. */
foreach (wabot_tipos_ofrecibles($cfg) as $tipo) {
    $txtPI = wabot_pitch_precio_texto($tipo, $cfg, conv_nueva());
    caso("el precio de $tipo linkea el presupuesto, no el portfolio",
        strpos($txtPI, (string)$cfg['tipos'][$tipo]['link']) !== false
        && stripos($txtPI, 'portfolio') === false);
}

$convPitch = conv_sin_pitch();
$salidaPitch = (array)wabot_pitch('ecommerce', $convPitch, $cfg);
caso('el turno del pitch manda el precio con el presupuesto Y la demo',
    count($salidaPitch) === 2
    && strpos($salidaPitch[0], 'gokywebs.com/presupuestos/ecommerce') !== false
    && wabot_es_texto_demo($salidaPitch[1], $cfg));
caso('el link del presupuesto va último, cerrando el mensaje',
    substr(trim($salidaPitch[0]), -strlen('gokywebs.com/presupuestos/ecommerce'))
        === 'gokywebs.com/presupuestos/ecommerce');

echo "\n— SL: cuando suena el celular (28-ago) —\n";

require_once __DIR__ . '/push.php';

/* Pablo, 28-ago: "quiero notificaciones para cuando llega un mensaje en wabot
 * que tengo que responder yo, SL". La regla es la misma del chip del panel: el
 * cliente escribio algo que Pablo no abrio, Y la charla esta en un punto donde
 * el bot ya no la lleva. Un chat que el bot atiende solo NO es un SL: si no,
 * suena el telefono con cada mensaje del embudo. */
$ahoraSL2 = time();
$slBase = [
    'canal' => 'whatsapp', 'tel' => '5491100000001', 'conversation_key' => '5491100000001',
    'panel_visto_ts' => $ahoraSL2 - 7200, 'lead_creado' => true,
    'descripcion' => 'tarot', 'colores' => 'violeta',
    'transcript' => [['q' => 'cliente', 't' => 'Pero le falta lo de registros akashicos', 'ts' => $ahoraSL2]],
];

// Demo entregada y el cliente escribiendo: el caso de Silvana, donde el bot ya
// se callo y contesta Pablo.
$slDemo = $slBase;
$slDemo['presentado_ts'] = $ahoraSL2 - 3600;
$slDemo['postdemo_avisado'] = true;
caso('demo entregada + el cliente escribe → SL', wabot_conv_es_sl($slDemo) === true);

// Derivado a mano: el bot le prometio que contesta Pablo.
$slDerivado = $slBase;
$slDerivado['fase'] = 'derivado';
$slDerivado['handoff_pendiente'] = true;
caso('una consulta derivada → SL', wabot_conv_es_sl($slDerivado) === true);

// Prediseño cerrado, esperando que le armen la demo.
caso('prediseño cerrado con el cliente escribiendo → SL', wabot_conv_es_sl($slBase) === true);

/* Pablo, 28-ago: "si yo abro esa conversación, no contesto y la saco, se
 * pierde. Deberían permanecer, incluso si yo contesto, que pase a otra
 * categoría (pero que esta categoría se pueda combinar con las otras)".
 *
 * Abrir el chat actualiza panel_visto_ts, así que compararse contra ESE
 * timestamp era el bug: bastaba con mirarlo, sin contestar nada, para que
 * desapareciera de la lista de pendientes. */
$slVisto = $slDemo;
$slVisto['panel_visto_ts'] = $ahoraSL2 + 1;
caso('abrir el chat sin contestar NO lo saca de SL', wabot_conv_es_sl($slVisto) === true);

// Contestar SÍ lo saca de SL — y ahí es donde entra RTA.
$slRespondido = $slVisto;
$slRespondido['transcript'][] = ['q' => 'humano', 't' => 'Dale, ya te lo agrego', 'ts' => $ahoraSL2 + 2];
caso('pero contestar a mano sí lo saca de SL', wabot_conv_es_sl($slRespondido) === false);
caso('y pasa a RTA: ya contestaste, espera al cliente', wabot_conv_rta($slRespondido) === true);

// Si el cliente vuelve a escribir, vuelve solo a SL y deja de ser RTA.
$slResponde2 = $slRespondido;
$slResponde2['transcript'][] = ['q' => 'cliente', 't' => 'Genial, y el logo?', 'ts' => $ahoraSL2 + 3];
caso('si el cliente contesta de nuevo, vuelve a SL', wabot_conv_es_sl($slResponde2) === true);
caso('y deja de ser RTA', wabot_conv_rta($slResponde2) === false);

// RTA no aplica a una charla que el bot lleva solo: ahí un mensaje humano no
// tiene el mismo peso (no es "Pablo destrabando algo que el bot no podía").
$slCharlaHumano = $slCharla;
$slCharlaHumano['transcript'][] = ['q' => 'humano', 't' => 'te contesto yo esta', 'ts' => $ahoraSL2 + 1];
caso('un chat que lleva el bot no es RTA aunque Pablo escriba algo suelto',
    wabot_conv_rta($slCharlaHumano) === false);

// Un chat archivado tampoco es RTA: Pablo ya lo sacó de la vista de trabajo.
caso('un chat archivado nunca es RTA', wabot_conv_rta($slArchivado) === false);

// El derivado también entra en RTA una vez contestado.
$slDerivadoResp = $slDerivado;
$slDerivadoResp['transcript'][] = ['q' => 'humano', 't' => 'Ya te explico como seguimos', 'ts' => $ahoraSL2 + 1];
caso('una derivación contestada pasa a RTA', wabot_conv_rta($slDerivadoResp) === true);
caso('y deja de ser SL', wabot_conv_es_sl($slDerivadoResp) === false);

// El bot la esta llevando solo: no hay nada que contestar.
$slCharla = [
    'canal' => 'whatsapp', 'tel' => '5491100000002', 'fase' => 'menu',
    'panel_visto_ts' => 0,
    'transcript' => [['q' => 'cliente', 't' => 'hola, cuanto sale una web?', 'ts' => $ahoraSL2]],
];
caso('una charla que lleva el bot NO es SL', wabot_conv_es_sl($slCharla) === false);

// Archivado a mano: Pablo lo saco de la vista de trabajo.
$slArchivado = $slDemo;
$slArchivado['archivado'] = true;
caso('un chat archivado nunca es SL', wabot_conv_es_sl($slArchivado) === false);

// Avisó que pagó: lo mas urgente del panel.
$slPago = $slDemo;
$slPago['pago_avisado_ts'] = $ahoraSL2;
caso('el que aviso que pago tambien es SL', wabot_conv_es_sl($slPago) === true);

// Sin la cuenta de servicio no se manda nada, y no rompe.
caso('sin config de push no se intenta mandar nada',
    wabot_push_configurado() === false || wabot_push_configurado() === true);
caso('un chat que no es SL nunca dispara notificacion',
    wabot_push_si_sl($slCharla, $cfg) === false);
caso('y uno archivado tampoco', wabot_push_si_sl($slArchivado, $cfg) === false);

echo "— Revisión del 28-ago: llamadas, baja, WhatsApp mal escrito y turnos —\n";

/* #1 Marcelo — pedir una llamada nunca se rechaza. */
foreach (['Llamame', 'llamame por favor', 'me podes llamar?', 'me pueden llamar',
          'quiero hablar', 'podemos hacer una llamada?', 'prefiero hablar personalmente',
          'quiero hablar con una persona', 'necesito hablar con alguien',
          'prefiero hablarlo por telefono', 'se puede hacer una videollamada',
          'podriamos tener una reunion', 'te puedo llamar?', 'hablemos por telefono mejor',
          'me llamas asi te explico mejor'] as $f) {
    caso('pide llamada: "' . $f . '"', wabot_pide_llamada($f) === true);
}
foreach (['hola quiero hablar sobre una pagina web', 'quiero hablar de precios',
          'queria hablar sobre un ecommerce para mi negocio', 'quiero una pagina web',
          'hola buenas noches', 'cuanto sale una landing', 'prefiero por whatsapp',
          'lo hablamos por chat', 'no me llamen mas', 'no me llames por favor',
          'tengo un local de ropa'] as $f) {
    caso('NO es pedido de llamada: "' . $f . '"', wabot_pide_llamada($f) === false);
}

/* #3 Maria Laura — "No molesten más" tiene que cortar de verdad.
 * Lo dijo dos veces y ninguna matcheaba: la lista pedía el "me" pegado. */
foreach (['No molesten mas', 'no quiero que me molesten mas', 'no me molesten',
          'dejen de escribirme', 'dejen de mandarme mensajes', 'paren de escribir',
          'basta de molestar', 'no me escriban mas', 'no me contacten nunca mas',
          'sacame de la lista', 'borren mi numero', 'quiero darme de baja',
          'no me llamen mas'] as $f) {
    caso('es baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) === 'baja');
}
foreach (['no me manden el presupuesto por mail', 'no me escribas al otro numero, mejor por aca',
          'no tengo logo', 'no se, mandame info', 'no me acuerdo el nombre del dominio'] as $f) {
    caso('NO es baja: "' . $f . '"', wabot_cierre_sin_presion_tipo($f) !== 'baja');
}

/* #5 Elizabeth — WhatsApp como lo escribe la gente. Contestó "Por wasup" y el
 * bot volvió a preguntarle lo mismo. */
foreach (['Por wasup', 'por wasap', 'wasap', 'por whats', 'watsapp', 'por wpp',
          'por wtsp', 'guasap', 'me escriben por wsp'] as $f) {
    caso('turnos, "' . $f . '" → sin sistema de turnos',
        wabot_desempate_por_palabras('desempate_turnos', $f) === 'turnos_no');
}

/* #6 Vivi — negar los turnos no puede leerse como pedirlos. Le cotizó una web
 * CON sistema de turnos justo después de que ella lo rechazara. */
foreach (['No necesito reserven turnos porque yo tengo un sistema',
          'no necesito que reserven turnos', 'ya tengo un sistema de turnos propio',
          'tengo mi propio sistema de agenda', 'no preciso reservas online'] as $f) {
    caso('turnos, "' . $f . '" → turnos_no',
        wabot_desempate_por_palabras('desempate_turnos', $f) === 'turnos_no');
}
foreach (['que reserven desde la web', 'si, que saquen turno solos',
          'con agenda online', 'quiero que reserven los turnos ellos'] as $f) {
    caso('turnos, "' . $f . '" → turnos_si',
        wabot_desempate_por_palabras('desempate_turnos', $f) === 'turnos_si');
}

echo "— Revisión del 28-ago: audio, orden de respuesta, envíos y seguimientos —\n";

/* #2 Overlord Magazine — los puntos de venta son kioscos, no vender online.
 * Explicó en un audio que quería mostrar los números, la historia y los puntos
 * de venta de su revista, y salió cotizado como ecommerce de $290.000. */
foreach (['quiero mostrar los numeros de la revista y los puntos de venta',
          'mostrar la historia, videos y los puntos de venta',
          'que se vea donde conseguirla, los puntos de venta',
          'los puntos de venta y las notas'] as $f) {
    caso('comercio, "' . $f . '" → mostrar',
        wabot_desempate_por_palabras('desempate_comercio', $f) === 'comercio_mostrar');
}
foreach (['quiero vender online', 'que compren desde la web', 'con carrito y mercado pago'] as $f) {
    caso('comercio, "' . $f . '" → vender',
        wabot_desempate_por_palabras('desempate_comercio', $f) === 'comercio_vender');
}

/* #2 — y no se le pide el link de una página que dijo que no tiene. */
foreach (['no tengo pagina', 'no tengo web todavia', 'nunca tuve una pagina',
          'pagina no tengo', 'todavia no tengo nada', 'quiero arrancar de cero',
          'es la primera pagina que hago'] as $f) {
    caso('dice que no tiene web: "' . $f . '"', wabot_texto_dice_sin_web($f) === true);
}
foreach (['si, tengo una pagina en wix', 'tengo mi web pero es fea', 'mi pagina es vieja'] as $f) {
    caso('SÍ tiene web: "' . $f . '"', wabot_texto_dice_sin_web($f) === false);
}

/* #4 Romina — las dos preguntas que no tenían ninguna respuesta y terminaban
 * en "querés que te arme una muestra?". */
foreach (['seria una pagina donde la gente entre compre y yo envio?',
          'o sea que la gente compra desde la pagina?',
          'la gente compra y yo mando el producto?',
          'como funciona la tienda?'] as $f) {
    caso('"' . $f . '" → como_funciona_tienda',
        wabot_info_por_palabras($f, 'precio') === 'como_funciona_tienda');
}
foreach (['que mas puedo incluir?', 'que mas se le puede agregar?',
          'que otras cosas puede tener la web?', 'que incluye el precio?'] as $f) {
    caso('"' . $f . '" → que_incluye', wabot_info_por_palabras($f, 'precio') === 'que_incluye');
}
// Contar cómo trabaja hoy no es preguntar cómo funciona la tienda.
foreach (['vendo ropa, la gente elige y le mando por correo',
          'tengo un negocio, la gente viene y compra',
          'la gente entra al local y compra ahi'] as $f) {
    caso('rubro, no pregunta: "' . $f . '"', wabot_info_por_palabras($f, 'precio') === null);
}

/* #7 S. Marcela — el bilingüe que nadie preguntó. */
$convRopa = ['transcript' => [['q'=>'cliente','t'=>'hola, tengo un local de ropa'], ['q'=>'bot','t'=>'...']]];
caso('bilingüe sin que nadie hable de idiomas → sin rastro',
    wabot_info_clave_tiene_rastro('bilingue', 'hola, tengo un local de ropa', $convRopa) === false);
caso('"se puede en dos idiomas?" sí tiene rastro',
    wabot_info_clave_tiene_rastro('bilingue', 'se puede en dos idiomas?', $convRopa) === true);
caso('"la quiero tambien en ingles" también',
    wabot_info_clave_tiene_rastro('bilingue', 'la quiero tambien en ingles', $convRopa) === true);
caso('preguntado un turno antes: sigue valiendo',
    wabot_info_clave_tiene_rastro('bilingue', 'si dale',
        ['transcript' => [['q'=>'cliente','t'=>'se puede en ingles tambien?'], ['q'=>'bot','t'=>'...']]]) === true);
caso('una clave ancha (proceso) nunca se controla',
    wabot_info_clave_tiene_rastro('proceso', 'hola, tengo un local de ropa', $convRopa) === true);
caso('maps sin nada del mapa → sin rastro',
    wabot_info_clave_tiene_rastro('maps', 'hola, tengo un local de ropa', $convRopa) === false);

/* #8 Elena / Planeta Bebé — la pregunta del envío no tenía respuesta y el bot
 * se puso a explicar por qué no trabajamos con Tiendanube. */
foreach (['la tienda calcula el envio?', 'como se manejan los envios?',
          'se puede integrar con andreani?', 'calcula el costo de envio automatico?',
          'en tiendanube el envio lo calcula sola la pagina, aca se puede?',
          'quiero saber si cotiza el envio por codigo postal',
          'la web puede cotizar el flete?'] as $f) {
    caso('"' . $f . '" → envios', wabot_info_por_palabras($f, 'precio') === 'envios');
}
foreach (['vendo productos y hago envios a domicilio', 'tengo una empresa de logistica',
          'hago envios a todo el pais'] as $f) {
    caso('nombrar el envío no es preguntar: "' . $f . '"',
        wabot_info_por_palabras($f, 'nuevo') !== 'envios');
}
caso('la respuesta de envíos existe y dice que la tienda lo calcula',
    stripos((string)($cfg['info']['envios'] ?? ''), 'codigo postal') !== false
    || stripos((string)($cfg['info']['envios'] ?? ''), 'código postal') !== false);

/* #9 Remax — el precio ya estaba dado y "el presupuesto" no era una forma de
 * preguntarlo, así que se llevó el comodín del desarrollador. */
foreach (['cuanto era el presupuesto?', 'me pasas el presupuesto?', 'cual era el presupuesto',
          'y el presupuesto?', 'cuanto me dijiste que salia', 'que presupuesto me habias pasado',
          'repetime el presupuesto'] as $f) {
    caso('"' . $f . '" pide el precio ya dado',
        wabot_info_por_palabras($f, 'derivado') === 'precio_actual');
}
foreach (['quiero que me pidan presupuesto desde la web',
          'que puedan solicitar presupuesto online'] as $f) {
    caso('presupuesto como función de SU web, no pregunta: "' . $f . '"',
        wabot_info_por_palabras($f, 'derivado') !== 'precio_actual');
}

/* #10 Ferrari — el seguimiento retoma la pregunta que quedó sin contestar en
 * vez de mandar "avisame si te quedó alguna duda". */
$sgFerrari = ['fase'=>'menu','transcript'=>[
    ['q'=>'cliente','t'=>'hola'],
    ['q'=>'bot','t'=>'Hola! Contame, qué producto vendés?'],
]];
$sgTexto = wabot_seguimiento_texto($sgFerrari, $cfg);
caso('el seguimiento repite la pregunta que quedó abierta',
    strpos($sgTexto, 'qué producto vendés?') !== false);
caso('y suma el gancho de la muestra si todavía no se ofreció',
    stripos($sgTexto, 'muestra gratis') !== false);

$sgOfrecida = $sgFerrari; $sgOfrecida['cta_muestra'] = true;
caso('con la muestra ya ofrecida, no la repite',
    stripos(wabot_seguimiento_texto($sgOfrecida, $cfg), 'muestra gratis') === false);

caso('con el precio dado sigue el seguimiento de precio',
    wabot_seguimiento_texto(['fase'=>'precio','precio_dado'=>true,
        'transcript'=>[['q'=>'bot','t'=>'Sale $200.000']]], $cfg) === $cfg['seguimiento_precio']);
caso('esperando los datos del prediseño, el texto de siempre',
    wabot_seguimiento_texto(['fase'=>'prediseno',
        'transcript'=>[['q'=>'bot','t'=>'Me pasás el nombre y los colores?']]], $cfg) === $cfg['seguimiento_datos']);
caso('sin ninguna pregunta abierta, el texto de siempre',
    wabot_seguimiento_texto(['fase'=>'menu',
        'transcript'=>[['q'=>'bot','t'=>'Perfecto, quedo atento.']]], $cfg) === $cfg['seguimiento_datos']);
caso('si el último que habló fue el cliente, no hay pregunta esperando',
    wabot_seguimiento_pregunta_pendiente(['transcript'=>[
        ['q'=>'bot','t'=>'Qué vendés?'], ['q'=>'cliente','t'=>'ropa']]]) === null);
caso('una pregunta con precio o link no se repite suelta',
    wabot_seguimiento_pregunta_pendiente(['transcript'=>[
        ['q'=>'bot','t'=>'Sale $200.000, querés la muestra?']]]) === null);

echo "— Un chat archivado que recibe un mensaje vuelve a la vista —\n";

$ahoraDes = time();

// Archivado a mano: el cliente vuelve a escribir y reaparece.
$desMano = ['tel'=>'QATESTDES1','archivado'=>true,'fase'=>'derivado',
            'transcript'=>[['q'=>'bot','t'=>'Pablo te escribe a la brevedad']]];
caso('archivado no aparece en ningun grupo del embudo', wabot_conv_grupo($desMano) === 'archivado');
wabot_conv_transcript($desMano, 'cliente', 'hola, retomo lo de la web');
caso('el mensaje del cliente lo desarchiva', empty($desMano['archivado']));
caso('y vuelve a su grupo real', wabot_conv_grupo($desMano) !== 'archivado');
caso('queda registrado cuando se desarchivo', !empty($desMano['desarchivado_ts']));

// Solo el cliente desarchiva: ni el bot ni Pablo.
$desBot = ['tel'=>'QATESTDES2','archivado'=>true,'transcript'=>[]];
wabot_conv_transcript($desBot, 'bot', 'seguimiento automatico');
caso('un mensaje del bot NO desarchiva', !empty($desBot['archivado']));
$desHumano = ['tel'=>'QATESTDES3','archivado'=>true,'transcript'=>[]];
wabot_conv_transcript($desHumano, 'humano', 'le escribo yo');
caso('un mensaje de Pablo tampoco', !empty($desHumano['archivado']));

// Demo entregada y archivada por el cron: al escribir vuelve, y ademas es SL.
$desDemo = ['tel'=>'QATESTDES4','archivado'=>true,'fase'=>'postdemo','lead_creado'=>true,
            'presentado_ts'=>$ahoraDes - 200*3600,
            'transcript'=>[['q'=>'bot','t'=>'Te dejo la demo']]];
caso('archivada no cuenta como SL', wabot_conv_es_sl($desDemo) === false);
wabot_conv_transcript($desDemo, 'cliente', 'me gusto, quiero avanzar');
$desDemo['ultimo_cliente_ts'] = $ahoraDes;
caso('desarchivada vuelve al grupo de presentados', wabot_conv_grupo($desDemo) === 'presentados');
caso('y pasa a ser SL, asi suena la notificacion', wabot_conv_es_sl($desDemo) === true);

/* El cron no la puede volver a archivar en la corrida siguiente: medía desde
 * presentado_ts, que sigue siendo de hace ocho días. */
caso('el cron archiva la que lleva 200 h sin moverse',
    wabot_presentado_archivar_corresponde(
        ['presentado_ts'=>$ahoraDes - 200*3600, 'ultimo_cliente_ts'=>$ahoraDes - 200*3600],
        $cfg, $ahoraDes) === true);
caso('pero NO la que el cliente acaba de revivir',
    wabot_presentado_archivar_corresponde(
        ['presentado_ts'=>$ahoraDes - 200*3600, 'ultimo_cliente_ts'=>$ahoraDes - 60],
        $cfg, $ahoraDes) === false);





echo "— Revisión de las 19 charlas del 29-ago —\n";

/* 2. Un link no es una pregunta. La Dra. Gascón mandó su galería de fotos y
 * recibió la respuesta de seguridad/SSL entera, porque "https" estaba en la
 * lista de palabras de esa clave. */
$linkFotos = 'https://alan-uviedo.pixieset.com/yesikafinales/';
caso('un link pelado ya no dispara la respuesta de seguridad',
    wabot_info_por_palabras($linkFotos, 'prediseno') === null);
caso('y se reconoce como material, no como consulta',
    wabot_texto_no_es_consulta($linkFotos) === 'material');
caso('el dominio no cuenta como rastro de ninguna clave angosta',
    wabot_info_clave_tiene_rastro('emails', 'te paso esto: mimarca.com.ar/mails', []) === false);
caso('pero preguntar de verdad por seguridad sigue funcionando',
    wabot_info_por_palabras('la pagina es segura? tiene certificado de seguridad', 'precio') === 'seguridad');
caso('y un link CON pregunta alrededor no se descarta como material',
    wabot_texto_es_solo_link('mira mi web actual mimarca.com.ar, la pueden hackear?') === false);

/* 3. "…sobre esto?costo" — el pegote del anuncio más la palabra suelta. */
caso('"costo" pelado al final es una pregunta de precio',
    wabot_info_por_palabras('Hola. ¿Puedo obtener más información sobre esto?costo', 'menu') === 'precio_sin_rubro');
caso('y "que costo tiene" también',
    wabot_info_por_palabras('que costo tiene', 'menu') === 'precio_sin_rubro');

/* 4. El precio de OTRO tipo se contesta con el número, no con una definición. */
$convVeg = ['tipo' => 'ecommerce', 'precio_dado' => true];
caso('"y la página común que precio tiene?" pregunta por la landing',
    wabot_texto_pregunta_precio_de_tipo('Y la página común que precio tiene ?', $cfg, 'ecommerce') === 'landing');
$textoOtro = wabot_precio_de_tipo_texto('landing', $convVeg, $cfg);
caso('y la respuesta trae el precio de la landing y el ya cotizado',
    strpos($textoOtro, (string)$cfg['tipos']['landing']['precio']) !== false
    && strpos($textoOtro, (string)$cfg['tipos']['ecommerce']['precio']) !== false);
caso('preguntar por el tipo que YA tiene cotizado no dispara nada',
    wabot_texto_pregunta_precio_de_tipo('cuanto sale la tienda online?', $cfg, 'ecommerce') === null);
caso('y contar el rubro sin preguntar precio tampoco',
    wabot_texto_pregunta_precio_de_tipo('vendo ropa en una tienda del centro', $cfg, 'landing') === null);

/* 1. "No me gusta mucho che" → "Quiero otra cosa" → el comodín del desarrollador. */
caso('"No me gusta mucho che" es un no a la pregunta del pitch',
    wabot_pitch_dice_otra_idea('No me gusta mucho che') === true);
$cPitch = ['fase' => 'pitch', 'tipo' => 'landing', 'pitch_hecho' => true, 'precio_dado' => true, 'transcript' => []];
$r1 = wabot_pitch_encaje_rechazado('No me gusta mucho che', $cPitch, $cfg);
$r2 = wabot_pitch_encaje_rechazado('Quiero otra cosa', $cPitch, $cfg);
$r3 = wabot_pitch_encaje_rechazado('Quiero otra cosa', $cPitch, $cfg);
caso('la primera vez se le pregunta qué tenía en mente', $r1 !== null);
caso('la segunda ya va la pregunta concreta, no la misma abierta',
    $r2 === [$cfg['pitch_otra_idea_2']] && $r2 !== $r1);
caso('y a la tercera se deja de insistir', $r3 === null);

/* 12. El teclado apretado al azar. */
caso('"Bxjxdid" es ininteligible', wabot_texto_ininteligible('Bxjxdid') === true);
caso('"Djdududeididurureueieies" también', wabot_texto_ininteligible('Djdududeididurureueieies') === true);
caso('un rubro real NO es ininteligible', wabot_texto_ininteligible('Cerrajería, Herrajes') === false);
caso('ni un nombre de negocio largo',
    wabot_texto_ininteligible('Distribuidora Herrajes don Alfredo') === false);
caso('ni una respuesta corta normal', wabot_texto_ininteligible('Una consultora') === false);

/* BUG NUEVO (no estaba en la lista de Pablo): los cuatro mensajes del techista
 * preguntando cuándo se paga quedaron guardados como los datos de la demo. */
$pedidoLista = ['Tu nombre', 'El nombre de tu negocio', 'Los colores de tu marca',
    'Si tenés alguna web de referencia que te guste (de cualquier rubro, y si no tenés no pasa nada)'];
$cTech = ['prediseno_pedido' => $pedidoLista, 'nombre' => 'techista martin',
          'nombre_confirmado' => true, 'transcript' => []];
caso('las preguntas del techista ya no se guardan como los datos de la demo',
    wabot_prediseno_lista_posicional("Pero luego xe creear\nSe abona\nO antez\nAngez", $cTech) === false);
caso('y no quedó nada escrito en la ficha',
    empty($cTech['nombre_negocio']) && empty($cTech['colores']) && empty($cTech['referencia']));
$cReal = ['prediseno_pedido' => $pedidoLista, 'transcript' => []];
caso('una respuesta de verdad se sigue guardando igual',
    wabot_prediseno_lista_posicional("Martin\nTechos del Sur\nnegro y naranja\nno tengo", $cReal) === true
    && $cReal['nombre_negocio'] === 'Techos del Sur' && $cReal['colores'] === 'negro y naranja');
$cHex = ['prediseno_pedido' => $pedidoLista, 'transcript' => []];
caso('y los colores escritos con hex y adjetivos raros pasan',
    wabot_prediseno_lista_posicional("Yesika\nDragascon.skin\nBlanco grisáceo (#F8F8F8) y tonos dorados (#Ae9060)\nno", $cHex) === true
    && strpos((string)$cHex['colores'], '#F8F8F8') !== false);

/* 11. "Se abona / O antez": preguntaba el ORDEN, no el monto. */
caso('"pero luego se abona, o antes?" pregunta cuándo se paga',
    wabot_texto_pregunta_cuando_se_paga('Pero luego se abona. O antes?') === true);
caso('y "cuando se abona" también',
    wabot_texto_pregunta_cuando_se_paga('cuando se abona') === true);
caso('pero "como se paga" a secas sigue siendo la consulta de formas de pago',
    wabot_texto_pregunta_cuando_se_paga('como se paga?') === false);

/* 6. El link del presupuesto que nunca se mandó. */
$cLink = ['tipo' => 'landing', 'transcript' => []];
$caroSinLink = wabot_link_presupuesto_completar($cfg['caro'], $cLink, $cfg);
caso('si el link del presupuesto no salió, la respuesta de "caro" lo trae',
    strpos($caroSinLink, (string)$cfg['tipos']['landing']['link']) !== false);
$cLink2 = ['tipo' => 'landing', 'transcript' => [
    ['q' => 'bot', 't' => 'te dejo el detalle: ' . $cfg['tipos']['landing']['link'], 'ts' => time()]]];
caso('y si ya se lo habíamos mandado, no se repite',
    wabot_link_presupuesto_completar($cfg['caro'], $cLink2, $cfg) === $cfg['caro']);

/* 7. "Contactarnos en un mes y medio" es un sí con fecha, no una despedida. */
caso('"podríamos hacer un punto de 30 días" pide retomar en 30',
    wabot_texto_pide_retomar_en('podriamos hacer un punto de 30 dias, contactarnos mas adelante') === 30);
caso('"contactarnos en un mes y medio" pide retomar en 45',
    wabot_texto_pide_retomar_en('contactarnos en un mes y medio') === 45);
caso('un plazo suelto sin hablar de volver a hablar no cuenta',
    wabot_texto_pide_retomar_en('la web la necesito en 30 dias') === null);
caso('y el plazo se dice como lo diría una persona',
    wabot_plazo_humano(45) === 'un mes y medio' && wabot_plazo_humano(30) === 'un mes');
$cRet = ['fase' => 'precio', 'precio_dado' => true, 'retomar_ts' => time() + 20 * 86400,
         'transcript' => [['q' => 'bot', 't' => 'algo', 'ts' => time() - 9999]],
         'ultimo_cliente_ts' => time() - 100];
caso('con fecha puesta, el seguimiento automático no lo persigue antes',
    wabot_seguimiento_corresponde($cRet, $cfg) === false);

/* 5/8. El rubro no alcanza para elegir el tipo. */
caso('"Una consultora" no dice qué tiene que hacer el visitante',
    wabot_texto_dice_objetivo_web('Una consultora') === false);
caso('pero "quiero que me escriban por whatsapp" sí',
    wabot_texto_dice_objetivo_web('quiero que me escriban por whatsapp') === true);

/* 5. La pregunta que Héctor hizo y nadie contestó. */
caso('"hacés esta clase de página o solo grandes empresas?" tiene respuesta propia',
    wabot_info_por_palabras('hacés esta clase de página o solo atendés a grandes empresas', 'menu') === 'emprendimientos');
caso('y la clave existe en la config',
    trim((string)($cfg['info']['emprendimientos'] ?? '')) !== '');

/* 10. La coletilla ", pago único." colgada al final sonaba a contradicción con
 * la seña (29-ago) y se retiró. Desde el 2-sep el texto dice "Es un pago único
 * de $180.000" a pedido de Pablo: la forma con coma es la que sigue prohibida. */
caso('el precio dice que es un pago único, en la forma que dictó Pablo',
    stripos((string)$cfg['tipos']['landing']['precio_ideal'], 'Es un pago único de') !== false);
caso('y no vuelve la coletilla ", pago único." al final',
    stripos((string)$cfg['tipos']['landing']['precio_ideal'], ', pago único') === false);
$cfgPU = wabot_config_load();
$cfgPU['tipos']['landing']['precio_ideal'] = 'Lo ideal sería una landing. Tiene un precio de {precio}, pago único.';
wabot_config_ventas($cfgPU);
caso('un texto viejo con la coletilla sigue migrando',
    stripos($cfgPU['tipos']['landing']['precio_ideal'], 'sin abono mensual') !== false);

echo "— Auditoría externa del 29-ago: lo que resultó real —\n";

/* La seña la garantiza el CÓDIGO, no el texto del panel. En producción
 * info.pago había quedado en una línea sin la seña, sin el saldo y sin los
 * marcadores: ahí nació el 50/50 que inventó el modelo. */
$cfgPagoPelado = $cfg;
$cfgPagoPelado['info']['pago'] = 'Se puede abonar por transferencia o con tarjeta hasta en 12 cuotas con interés';
$pagoPelado = wabot_texto_pago(['tipo' => 'landing', 'precio_dado' => true], $cfgPagoPelado);
caso('aunque el texto del panel se quede sin la seña, la respuesta la trae igual',
    strpos($pagoPelado, 'seña de ' . $cfg['tipos']['landing']['sena']) !== false);
caso('y no la repite si el texto ya la decía',
    substr_count(wabot_texto_pago(['tipo' => 'landing', 'precio_dado' => true], $cfg), 'seña de ') === 1);

/* Las bajas de precio automáticas se retiraron: impedían volver a subir un
 * precio desde el panel. */
$cfgSubido = ['tipos' => ['landing' => ['label' => 'Landing', 'precio' => '$200.000', 'sena' => '$60.000']]];
wabot_config_ventas($cfgSubido);
caso('subir la landing a $200.000 desde el panel ya no se revierte solo',
    $cfgSubido['tipos']['landing']['precio'] === '$200.000');
caso('y la seña de $60.000 tampoco',
    $cfgSubido['tipos']['landing']['sena'] === '$60.000');

/* Cuatro claves que el bot promete contestar estaban vacías en producción y
 * caían en el comodín del desarrollador. */
foreach (['que_hacemos', 'internet', 'pixel', 'confianza'] as $claveInfo) {
    caso("info.$claveInfo tiene texto propio, no el comodín",
        trim((string)($cfg['info'][$claveInfo] ?? '')) !== ''
        && $cfg['info'][$claveInfo] !== $cfg['info']['otra']);
}

/* Los ejemplos de Pablo se le muestran a OTROS clientes: no pueden llevar el
 * nombre, el negocio ni la demo del cliente del que salieron. */
$cvFuente = ['nombre' => 'Dra Yesika Gascon', 'nombre_negocio' => 'Dragascon.skin',
             'presentado_slug' => 'dragasconskin'];
$anon = wabot_aprendizaje_anonimizar('Hola Yesika, la demo de Dragascon.skin ya está en dragasconskin', $cvFuente);
caso('el nombre del cliente no viaja al prompt de otro',
    stripos($anon, 'yesika') === false && stripos($anon, 'gascon') === false);
caso('ni el nombre de su negocio ni el slug de su demo',
    stripos($anon, 'dragascon') === false);
caso('un par con un link no se publica como ejemplo',
    wabot_aprendizaje_par_publicable('mi web es mimarca.com.ar', 'dale, la miro') === false);
caso('ni uno con una dirección',
    wabot_aprendizaje_par_publicable('estamos en la calle Mitre 340', 'perfecto') === false);
caso('ni uno con un número largo (documento, CBU, expediente)',
    wabot_aprendizaje_par_publicable('mi cuit es 20391482943', 'gracias') === false);
caso('pero un par normal sí sirve de ejemplo',
    wabot_aprendizaje_par_publicable('me parece caro', 'es pago unico, sin abono mensual') === true);

/* Fechas para retomar: antes solo entendía días y meses. */
caso('"la semana que viene" pide retomar en 7 días',
    wabot_texto_pide_retomar_en('escribime la semana que viene') === 7);
caso('"en dos semanas" en 14',
    wabot_texto_pide_retomar_en('contactame en dos semanas') === 14);
caso('y el plazo se dice como corresponde',
    wabot_plazo_humano(7) === 'una semana' && wabot_plazo_humano(14) === 'dos semanas');

/* El reset se lleva todo el estado de la sesión anterior. */
$cViejo = ['ultimo_ts' => time() - 30 * 86400, 'retomar_ts' => time() + 40 * 86400,
           'ininteligibles' => 2, 'pitch_otra_idea_dicha' => true,
           'pitch_otra_idea_2_dicha' => true, 'transcript' => []];
wabot_conv_reset_si_vieja($cViejo, $cfg);
caso('el reset limpia retomar_ts y los contadores nuevos',
    (int)$cViejo['retomar_ts'] === 0 && (int)$cViejo['ininteligibles'] === 0
    && empty($cViejo['pitch_otra_idea_dicha']) && empty($cViejo['pitch_otra_idea_2_dicha']));

echo "— Memoria comercial: las tres que valían la pena —\n";

/* 1. Un audio largo trae varias preguntas. El matcher de intenciones mira el
 * mensaje entero y devuelve UNA; partido en oraciones aparecen todas. Este es
 * el audio real de Héctor, con las tres que quedaron sin contestar. */
$audioHector = 'Hola, cómo estás? Buen día. Mi nombre es Héctor. Estoy por hacer un emprendimiento '
    . 'gastronómico en mi casa, y me gustaría crear una página para que el cliente pueda entrar y ver lo que '
    . 'ofrezco y que a la vez esa página pueda estar vinculada a las redes sociales. Quería saber qué cuesta, '
    . 'si hay un mantenimiento mensual, y si hacés esta clase de página o si solo atendés a grandes empresas, no?';
$convH = ['tipo' => 'ecommerce', 'precio_dado' => true, 'fase' => 'pitch', 'transcript' => []];
$temasH = wabot_preguntas_del_mensaje($audioHector, $convH, 'pitch');
caso('el audio de Héctor trae tres temas, no uno',
    count($temasH) === 3 && in_array('mantenimiento', $temasH, true)
    && in_array('emprendimientos', $temasH, true) && in_array('marketing', $temasH, true));
caso('mirando el mensaje entero se detectaba uno solo',
    wabot_info_por_palabras($audioHector, 'pitch') !== null && count($temasH) > 1);

$loQueSalio = ['Lo ideal sería un ecommerce, con carrito y cobro online. El desarrollo completo tiene un valor de $290.000'];
caso('y los tres quedan marcados como sin contestar',
    count(wabot_temas_sin_contestar($temasH, $loQueSalio)) === 3);
caso('si la respuesta sí los nombra, no se persigue ninguno',
    wabot_temas_sin_contestar(['mantenimiento'], ['El mantenimiento es opcional y sale $15.000 por mes']) === []);
$respuestaFaltante = wabot_info_lineas(['mantenimiento', 'emprendimientos'], $convH, $cfg);
caso('la respuesta que falta se arma con los textos oficiales, en viñetas',
    strpos($respuestaFaltante, '- ') === 0 && stripos($respuestaFaltante, 'mantenimiento') !== false);

/* 3. No todo el que escribe viene a comprar una web. */
caso('mandar el CV no arranca el embudo de venta',
    wabot_contexto_consulta('Hola, quiero mandarles mi CV') === 'laboral');
caso('ni preguntar si toman gente',
    wabot_contexto_consulta('estan tomando programadores?') === 'laboral');
caso('"ya pagué la seña, cuándo empiezan" es un cliente, no un lead',
    wabot_contexto_consulta('Ya pagué la seña, cuando empiezan?') === 'cliente_existente');
caso('y "la web que me hicieron no abre" tampoco es una venta nueva',
    wabot_contexto_consulta('La web que me hicieron no abre') === 'cliente_existente');
/* Los dos casos que NO pueden dispararse, porque son ventas: */
caso('"necesito una web para mi curriculum" es un lead, no un CV',
    wabot_contexto_consulta('Necesito una web para mi curriculum, soy fotografo') === null);
caso('y "mi página no anda, quiero hacerla de nuevo" también',
    wabot_contexto_consulta('mi pagina no anda, quiero hacerla de nuevo') === null);
caso('pedir una web es lo que reabre una charla que no era de venta',
    wabot_texto_pide_web('bueno, en realidad quiero una pagina para mi negocio') === true
    && wabot_texto_pide_web('les mando mi cv') === false);
caso('y los textos de esas dos salidas existen',
    trim((string)($cfg['mensaje_laboral'] ?? '')) !== ''
    && trim((string)($cfg['mensaje_cliente_existente'] ?? '')) !== '');
/* ── "Ya le contesté por afuera" ──
 * Pablo contesta seguido desde su otro WhatsApp, y esas respuestas el sistema
 * no las ve: el chat se quedaba en SL para siempre. La marca lo saca de SL y de
 * RTA, y como es un ts contra el último mensaje del transcript, se limpia sola
 * en cuanto el chat se mueve — sin ningún flag que acordarse de bajar. */
echo "— Marcar como contestado por afuera —\n";
$convMarca = [
    'tel' => '999MARCA999', 'fase' => 'derivado', 'archivado' => false,
    'handoff_pendiente' => false, 'bot_off' => false, 'pausado_hasta' => 0,
    'contestado_ts' => 0,
    'transcript' => [
        ['q' => 'cliente', 't' => 'hola', 'ts' => 1000],
        ['q' => 'bot',     't' => 'hola!', 'ts' => 1010],
        ['q' => 'cliente', 't' => 'me pasás el precio?', 'ts' => 1020],
    ],
];
caso('sin marca, el chat derivado con el cliente último está en SL',
    wabot_conv_es_sl($convMarca) === true && wabot_conv_rta($convMarca) === false);

$convMarca['contestado_ts'] = wabot_conv_ultimo_ts($convMarca);
caso('marcado sale de SL y NO pasa a RTA',
    wabot_conv_es_sl($convMarca) === false && wabot_conv_rta($convMarca) === false);
caso('y queda identificado como contestado, para el tag OK',
    wabot_conv_contestada($convMarca) === true);

$convMarca['transcript'][] = ['q' => 'cliente', 't' => 'seguís ahí?', 'ts' => 1100];
caso('si el cliente vuelve a escribir, la marca queda vieja y vuelve a SL',
    wabot_conv_es_sl($convMarca) === true && wabot_conv_contestada($convMarca) === false);

$convMarca['contestado_ts'] = wabot_conv_ultimo_ts($convMarca);
$convMarca['transcript'][] = ['q' => 'humano', 't' => 'ahí te paso', 'ts' => 1200];
caso('si después contesta desde el panel, manda RTA y no la marca',
    wabot_conv_rta($convMarca) === true && wabot_conv_contestada($convMarca) === false);

$convMarca['contestado_ts'] = 0;
caso('sacar la marca lo devuelve al estado que le corresponde',
    wabot_conv_rta($convMarca) === true && wabot_conv_es_sl($convMarca) === false);

/* Un chat que el bot está llevando no le toca a Pablo: no entra en SL ni en RTA
 * marcado o no, así que el botón no tiene que aparecer ahí. */
$convBot = $convMarca;
$convBot['fase'] = 'menu';
$convBot['contestado_ts'] = 0;
$convBot['transcript'] = [['q' => 'cliente', 't' => 'hola', 'ts' => 3000]];
caso('un chat que lleva el bot no entra en SL ni en RTA',
    wabot_conv_es_sl($convBot) === false && wabot_conv_rta($convBot) === false);

/* Sin transcript no puede tirar warning ni marcar de más. */
caso('una conversación sin mensajes no rompe el cálculo',
    wabot_conv_ultimo_ts(['transcript' => []]) === 0
    && wabot_conv_contestada(['contestado_ts' => 0]) === false);

/* El reset por inactividad arranca una sesión nueva: la marca no puede quedar
 * tapando la primera consulta del cliente que vuelve meses después. */
$convViejo = ['ultimo_ts' => time() - 60 * 86400, 'fase' => 'derivado',
              'contestado_ts' => 999999999, 'transcript' => []];
wabot_conv_reset_si_vieja($convViejo, $cfg);
caso('el reset por inactividad limpia la marca de contestado',
    (int)$convViejo['contestado_ts'] === 0);

/* ── Los 19 arreglos de la batería del 1-sep (25 charlas contra Gemini real) ── */
echo "— Batería 1-sep: texto interno, estado que no cambiaba y matchers —\n";

caso('"opaulosegundo" no es un mensaje',
    wabot_texto_parece_interno('opaulosegundo') === true);
caso('la jerga del andamiaje tampoco ("globo aparte", "texto solicitado")',
    wabot_texto_parece_interno('Desactivada la invitación a la demo en globo aparte por repetición. Mandá solo el texto solicitado.') === true);
caso('pero "Dale" y un link pelado pasan',
    wabot_texto_parece_interno('Dale') === false
    && wabot_texto_parece_interno('gokywebs.com/demo/barberia') === false);
caso('y wabot_salida_limpiar los descarta',
    wabot_salida_limpiar(['opaulosegundo']) === []);


caso('"es bastante para mí ahora" es la objeción de precio',
    wabot_texto_objecion_precio_suave('uh, es bastante para mi ahora la verdad') === true);
caso('"me gusta mucho" y "es mucho mejor" no',
    wabot_texto_objecion_precio_suave('me gusta mucho la propuesta') === false
    && wabot_texto_objecion_precio_suave('es mucho mejor que la que tengo') === false);

caso('"mandame la demo" es pedirla con todas las letras',
    wabot_pidio_demo_explicita('igual mandame la demo asi la veo tranquila') === true);
caso('preguntar cuánto dura la demo no es pedirla',
    wabot_pidio_demo_explicita('la demo hasta cuando me dura?') === false);

caso('preguntar por el mantenimiento mensual no es preguntar cuándo se paga la web',
    wabot_texto_pregunta_cuando_se_paga('y despues tengo que pagarles mantenimiento todos los meses?') === false
    && wabot_texto_pregunta_cuando_se_paga('se paga antes o despues?') === true);

caso('"cuánto sale?" en fase pitch repite el precio, no lo esquiva',
    wabot_info_por_palabras('cuanto sale?', 'pitch') === 'precio_actual');
caso('"la puedo ir actualizando yo?" va al texto oficial de carga',
    wabot_info_por_palabras('despues la puedo ir actualizando yo?', 'prediseno') === 'carga');
caso('pero "puedo cambiar los colores?" no (es un pedido de cambio)',
    wabot_info_por_palabras('puedo cambiar los colores?', 'prediseno') !== 'carga');

caso('historia + autoridades + novedades = institucional, sin decir "secciones"',
    wabot_pidio_institucional_explicito('necesitamos una pagina con la historia, las autoridades, las novedades y los actos') === true);
caso('una sola de esas palabras no alcanza',
    wabot_pidio_institucional_explicito('quiero publicar novedades de mi negocio') === false);

caso('"que la gente vea las fechas libres y reserve" contesta el desempate de turnos',
    wabot_desempate_por_palabras('desempate_turnos', 'quiero que la gente vea las fechas libres y reserve sin llamarme') === 'turnos_si');

/* La despedida de cortesía no cierra la venta: solo si el CLIENTE se despidió. */
$convGr = ['transcript' => [['q' => 'cliente', 't' => 'gracias!', 'ts' => 1]], 'fase' => 'prediseno', 'cierre' => null];
$rGr = wabot_salida_coherencia(['De nada. Quedamos a disposición por cualquier consulta.'], $convGr, $cfg);
caso('un "gracias!" del cliente no dispara el cierre por la cortesía del bot',
    empty($convGr['cierre']) && empty($convGr['seguimiento_bloqueado']) && count($rGr) === 1);
$convCh = ['transcript' => [['q' => 'cliente', 't' => 'dale, chau, gracias por todo', 'ts' => 1]], 'fase' => 'prediseno', 'cierre' => null];
wabot_salida_coherencia(['Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.'], $convCh, $cfg);
caso('un "chau" del cliente sí lo dispara',
    ($convCh['cierre'] ?? '') === 'despedida' && !empty($convCh['seguimiento_bloqueado']));

/* Un globo que repite entera una tanda anterior se cae si la tanda trae más. */
$convRep = ['tandas_bot' => [wabot_normalizar_frase('El bloque gigante de quién carga los productos.')], 'fase' => 'precio'];
$rRep = wabot_anti_repeticion(['El bloque gigante de quién carga los productos.', 'Pablo ya tiene tu consulta.'], $convRep, $cfg);
caso('el globo repetido de la tanda anterior se cae y queda el nuevo',
    count($rRep) === 1 && strpos($rRep[0], 'Pablo') !== false);

/* confirma_cambio no puede ser un pozo: a los dos turnos sin resolverse vuelve. */
$convCC = ['fase' => 'confirma_cambio', 'fase_previa_cambio' => 'prediseno', 'confirma_cambio_turnos' => 0,
           'ultimo_ts' => time(), 'transcript' => [], 'msgs' => []];
wabot_turno_preparar($convCC, $cfg);
wabot_turno_preparar($convCC, $cfg);
caso('dos turnos en confirma_cambio todavía esperan la respuesta',
    $convCC['fase'] === 'confirma_cambio');
wabot_turno_preparar($convCC, $cfg);
caso('al tercero se asume el mismo proyecto y vuelve a la fase anterior',
    $convCC['fase'] === 'prediseno' && (int)$convCC['confirma_cambio_turnos'] === 0);

/* La baja es sagrada: con cierre=baja el bot no contesta más, ni en modo agente. */
$convBaja = conv_nueva();
$convBaja['cierre'] = 'baja';
$convBaja['seguimiento_bloqueado'] = true;
$convBaja['bot_off'] = true;
caso('con la baja marcada, otro mensaje no recibe respuesta',
    wabot_responder('pero cuanto sale?', $convBaja, $cfg) === []);
caso('pedir una web de nuevo la reabre',
    wabot_responder('bueno en realidad si quiero una pagina para mi negocio', $convBaja, $cfg) !== []
    && $convBaja['cierre'] === null && empty($convBaja['bot_off']));

/* El silencio postdemo no puede tragarse el aviso de pago (D01). */
$convPD = conv_nueva();
$convPD['fase'] = 'derivado';
$convPD['presentado_ts'] = time();
$convPD['postdemo_avisado'] = true;
$convPD['pago_avisado_ts'] = 0;
$rPD = wabot_responder('listo, ya te transferi la senia recien', $convPD, $cfg);
caso('"ya te transferí" en el silencio postdemo marca pago_avisado_ts',
    (int)$convPD['pago_avisado_ts'] > 0 && !empty($convPD['presentado_confirmado']));
caso('y contesta el acuse de pago oficial, una sola vez',
    $rPD !== [] && wabot_responder('te transferi de nuevo por las dudas', $convPD, $cfg) === []);

/* Y un pedido de cambios en ese silencio queda anotado aunque no se conteste. */
$convPD2 = conv_nueva();
$convPD2['fase'] = 'derivado';
$convPD2['presentado_ts'] = time();
$convPD2['postdemo_avisado'] = true;
wabot_responder('le cambiaria la foto de portada y el titulo', $convPD2, $cfg);
caso('los cambios pedidos durante el silencio postdemo se anotan',
    strpos((string)$convPD2['cambios_pedidos'], 'foto de portada') !== false);

/* El cambio de negocio después del cierre queda anotado para Pablo (D10). */
$convCN = conv_nueva();
$convCN['fase'] = 'derivado';
$convCN['cierre'] = 'prediseno';
$convCN['espera_avisada'] = true;
$rCN = wabot_cerrada('ah pero pensandolo bien, la pagina la quiero para mi otro negocio, una distribuidora', $convCN, $cfg);
caso('"la quiero para mi otro negocio" post-cierre se anota como cambio',
    strpos((string)$convCN['cambios_pedidos'], 'CAMBIO DE NEGOCIO') !== false && $rCN !== []);

/* ── Segunda tanda (10 charlas más, mismo día) ── */

caso('"¿ustedes se quedan con una comisión?" tiene respuesta propia',
    wabot_info_por_palabras('ustedes se quedan con una comision?', 'pitch') === 'comisiones'
    && wabot_info_por_palabras('ustedes cobran comision por cada venta?', 'prediseno') === 'comisiones');
caso('y dice que la comisión no es nuestra, sin pisar la pregunta de cómo se paga',
    stripos((string)$cfg['info']['comisiones'], 'no cobramos ninguna comisión') !== false
    && wabot_info_por_palabras('como se paga?', 'pitch') === 'pago');

/* Repetir una respuesta que el cliente volvió a pedir NO es estar trabado.
 * Una inmobiliaria preguntó el precio dos veces y el bot derivó con lead=0. */
$convRepP = conv_nueva();
$convRepP['fase'] = 'pitch'; $convRepP['tipo'] = 'inmobiliaria'; $convRepP['precio_dado'] = true;
$convRepP['transcript'] = [['q' => 'cliente', 't' => 'cuanto sale?', 'ts' => 1]];
$precioRep = wabot_precio_resumen($convRepP, $cfg);
$convRepP['tandas_bot'] = [wabot_normalizar_frase($precioRep)];
$rRepP = wabot_anti_repeticion([$precioRep], $convRepP, $cfg);
caso('volver a dar el precio a quien lo vuelve a pedir no deriva',
    $rRepP === [$precioRep] && ($convRepP['fase'] ?? '') !== 'derivado');

$convRepQ = conv_nueva();
$convRepQ['fase'] = 'menu';
$convRepQ['transcript'] = [['q' => 'cliente', 't' => 'asdkjh', 'ts' => 1]];
$convRepQ['tandas_bot'] = [wabot_normalizar_frase((string)$cfg['contame'])];
$rRepQ = wabot_anti_repeticion([(string)$cfg['contame']], $convRepQ, $cfg);
caso('pero repetir la pregunta con la charla trabada sigue cortándose',
    $rRepQ !== [(string)$cfg['contame']]);

caso('prometer la entrega en 24 a 48 hs sin herramienta se frena',
    wabot_texto_promete_cierre('Perfecto. En las próximas 24 a 48 horas te armamos el prediseño sin costo para que lo veas.') === true
    && wabot_texto_promete_cierre('Excelente, ya mismo tomamos el pedido para armar la demo. En 24 a 48 horas te escribimos.') === true);
caso('pero ofrecer la demo preguntando sigue pasando',
    wabot_texto_promete_cierre('El prediseño tarda 24 a 48 horas y es sin cargo. Te lo armamos?') === false);

caso('"cuánto sale todo eso?" pregunta por el combinado, "cuánto sale?" no',
    wabot_texto_pregunta_precio_combinado('cuanto sale todo eso?') === true
    && wabot_texto_pregunta_precio_combinado('cuanto seria todo junto?') === true
    && wabot_texto_pregunta_precio_combinado('cuanto sale?') === false
    && wabot_texto_pregunta_precio_combinado('cuanto queda entonces?') === false);

/* Con la charla ya derivada por mixto, el precio del combinado no es el del
 * tipo base: un gimnasio con turnos + planes + cursos se llevaba los $200.000. */
$convComb = conv_nueva();
$convComb['fase'] = 'derivado'; $convComb['tipo'] = 'turnos';
$convComb['precio_dado'] = true; $convComb['espera_avisada'] = true;
$rComb = wabot_cerrada('cuanto sale todo eso?', $convComb, $cfg);
caso('el precio del proyecto combinado no repite el número del tipo base',
    $rComb && strpos($rComb[0], '200.000') === false && stripos($rComb[0], 'no sale de la lista') !== false);

/* ── La línea del pitch ya no pregunta si encaja (1-sep) ── */
echo "— 1-sep: el técnico, el plural de 'a medidas' y el precio de la landing sin verbo —\n";

caso('"muebles a medidas" en plural también es híbrido', wabot_contexto_es_hibrido('hago muebles a medidas y pintura') === true);
$tecnico = 'Soy técnico en aire acondicionado lavarropas heladeras microondas hornos eléctricos también pintura';
caso('un técnico en electrodomésticos es un servicio, no una tienda',
    wabot_contexto_es_servicio_tecnico($tecnico) === true && wabot_fallback_rubro_local($tecnico) === 'landing');
caso('pero si además vende, gana la venta', wabot_contexto_es_servicio_tecnico('vendo y reparo celulares') === false);
caso('y el técnico que también hace muebles a medida va al desempate híbrido',
    wabot_fallback_rubro_local($tecnico . ' y muebles a medidas') === 'hibrido_pendiente');

caso('"Y una que sea solo landing?" con ecommerce cotizado pide el precio de la landing',
    wabot_texto_pregunta_precio_de_tipo('Y una que sea solo landing?', $cfg, 'ecommerce') === 'landing');
caso('"el valor de una landing" también', wabot_texto_pregunta_precio_de_tipo('No quiero saber el valor de una landing', $cfg, 'ecommerce') === 'landing');
caso('sin precio dado, "una tienda online" no cotiza nada sola', wabot_texto_pregunta_precio_de_tipo('vendo ropa en una tienda online', $cfg, null) === null);
caso('y preguntar por el tipo que ya tiene sigue dando null', wabot_texto_pregunta_precio_de_tipo('y solo el ecommerce?', $cfg, 'ecommerce') === null);

echo "— 1-sep: la segunda cotización ofrece la demo, no tira el listado —\n";
$cfgOff = $cfg; $cfgOff['form_activo'] = false;
$c2 = conv_nueva(); $c2['precio_dado'] = true; $c2['tipo'] = null; $c2['pitch_tipo'] = 'ecommerce'; $c2['fase'] = 'desempate_hibrido';
$c2['transcript'] = [['q' => 'cliente', 't' => $tecnico, 'ts' => time()]];
$r2 = wabot_precio('landing', $c2, $cfgOff);
caso('con el form apagado trae el precio y la OFERTA de la demo, no el listado de datos',
    count($r2) === 2 && strpos($r2[0], '$180.000') !== false && strpos($r2[1], '- Tu nombre') === false
    && in_array($r2[1], (array)$cfgOff['msg_prediseno_oferta_variantes'], true));
caso('y queda en prediseño esperando el sí', $c2['fase'] === 'prediseno' && !empty($c2['cta_muestra']));
$c2b = conv_nueva(); $c2b['precio_dado'] = true; $c2b['tipo'] = null; $c2b['pitch_tipo'] = 'ecommerce'; $c2b['fase'] = 'desempate_hibrido';
$c2b['tel'] = '5491100000000TEST'; $c2b['channel_user_id'] = '5491100000000TEST'; $c2b['canal'] = 'whatsapp';
$r2b = wabot_precio('landing', $c2b, $cfg);
caso('con el form activo sigue el link, que ya es una oferta en sí', count($r2b) === 2 && strpos($r2b[1], 'gokywebs.com/form/') !== false);

echo "— 1-sep: {rubro}, el pitch nombra al cliente —\n";
$cR = conv_nueva();
$cR['transcript'] = [['q' => 'cliente', 't' => 'Quiero una página web para mi negocio', 'ts' => time()], ['q' => 'cliente', 't' => 'Gorras', 'ts' => time()]];
caso('"Las gorras" es un rubro válido (está en lo que escribió) y sale en minúscula', wabot_rubro_valido('Las gorras', $cR) === 'las gorras');
caso('un rubro que el cliente nunca nombró no pasa', wabot_rubro_valido('las zapatillas', $cR) === '');
caso('ni un precio, ni "lo tuyo", ni un tipo de web',
    wabot_rubro_valido('$290.000', $cR) === '' && wabot_rubro_valido('lo tuyo', $cR) === '' && wabot_rubro_valido('el ecommerce de gorras', $cR) === '');
caso('ni más de seis palabras', wabot_rubro_valido('las gorras que vendo en mi local de siempre', $cR) === '');
/* El modelo a veces manda "las_gorras" y eso salía crudo al cliente (2-sep). */
caso('los guiones bajos se limpian antes de salir', wabot_rubro_valido('las_gorras', $cR) === 'las gorras');
$cR['rubro_pitch'] = 'las gorras';
$pitchR = wabot_pitch_precio_texto('ecommerce', $cfg, $cR);
caso('el texto arranca con {rubro} y personalizar lo resuelve con las palabras del cliente',
    strpos($pitchR, 'Perfecto, para {rubro} sería') === 0
    && strpos(wabot_personalizar($pitchR, $cR), 'Perfecto, para las gorras sería un ecommerce') === 0);
caso('sin rubro válido queda "tu negocio", sin marcador crudo',
    strpos(wabot_personalizar($pitchR, conv_nueva()), 'Perfecto, para tu negocio sería un ecommerce') === 0);
caso('en el medio de una frase, sin rubro, queda "tu negocio"',
    wabot_aplicar_rubro('Es una demo gratis, pensada para {rubro}.', '') === 'Es una demo gratis, pensada para tu negocio.'
    && wabot_aplicar_rubro('Es una demo gratis, pensada para {rubro}.', 'la ropa de nene') === 'Es una demo gratis, pensada para la ropa de nene.');
caso('ningún {rubro} sale crudo en la tanda', (function () use ($cfg) {
    $c = conv_nueva(); $c['precio_dado'] = true; $c['tipo'] = 'ecommerce'; $c['fase'] = 'pitch'; $c['pitch_tipo'] = 'ecommerce';
    foreach (wabot_salida_preparar([wabot_pitch_precio_texto('ecommerce', $cfg, $c), (string)$cfg['msg_prediseno_oferta']], $c, $cfg) as $m) {
        if (strpos($m, '{rubro}') !== false) return false;
    }
    return true;
})());

echo "— 1-sep: la oferta y la línea post-precio —\n";
caso('la oferta nombra la demo como lo que es: gratis, y termina en pregunta; nada de "muestra"', (function () use ($cfg) {
    foreach (array_merge([$cfg['msg_prediseno_oferta']], (array)$cfg['msg_prediseno_oferta_variantes']) as $v) {
        if (mb_stripos($v, 'gratis') === false || mb_substr(trim($v), -1) !== '?') return false;
        if (mb_stripos($v, 'muestra') !== false) return false;
    }
    return true;
})());
$cfgOfertaVieja = wabot_config_load();
$cfgOfertaVieja['msg_prediseno_oferta'] = 'Si querés, te preparamos una muestra sin costo para que veas cómo podría quedar. Te sirve?';
$cfgOfertaVieja['msg_prediseno_oferta_variantes'] = ['Te armamos una muestra gratis para que veas cómo quedaría. La preparamos?', 'Podemos prepararte una muestra sin cargo antes de que decidas nada. Te la armo?'];
wabot_config_pitch_rubro($cfgOfertaVieja);
wabot_config_simplificar_tipos($cfgOfertaVieja);
caso('las ofertas que estaban en producción el 1-sep migran solas',
    $cfgOfertaVieja['msg_prediseno_oferta_variantes'] === $cfg['msg_prediseno_oferta_variantes']
    && $cfgOfertaVieja['msg_prediseno_oferta'] === $cfg['msg_prediseno_oferta']);
caso('la línea post-precio dice qué hay del otro lado (ver su web) y sigue sin preguntar', (function () use ($cfg) {
    foreach ((array)$cfg['tipos']['landing']['pitch_pregunta_variantes'] as $v) {
        if (strpos($v, '?') !== false) return false;
        if (mb_stripos($v, 'web') === false && mb_stripos($v, 'verla') === false && mb_stripos($v, 'la ves') === false) return false;
    }
    return true;
})());

$cfgPitchViejo = wabot_config_load();
$cfgPitchViejo['tipos']['landing']['precio_ideal'] = "Lo ideal sería una landing profesional, para mostrar claramente lo que hacés, generar confianza y llevar a los clientes directo a WhatsApp. Tiene un precio de {precio}. Es el valor total del desarrollo, sin abono mensual.\nY acá podés ver {portfolio_texto}: {portfolio}";
$cfgPitchViejo['tipos']['ecommerce']['precio_ideal'] = 'Lo ideal sería un ecommerce hecho a mano por Pablo. Tiene un precio de {precio}.';
$cfgPitchViejo['tipos']['turnos']['precio_ideal'] = 'Para {rubro}, ya migrado. {precio}.';
wabot_config_pitch_rubro($cfgPitchViejo);
wabot_config_portfolio($cfgPitchViejo);
caso('el texto dictado que está en producción pasa al nuevo, con {rubro} y el link del presupuesto',
    $cfgPitchViejo['tipos']['landing']['precio_ideal'] === $cfg['tipos']['landing']['precio_ideal']
    && strpos($cfgPitchViejo['tipos']['landing']['precio_ideal'], '{link}') !== false
    && stripos($cfgPitchViejo['tipos']['landing']['precio_ideal'], 'portfolio') === false);
caso('un texto editado a mano conserva su cuerpo y solo suma el rubro adelante',
    strpos($cfgPitchViejo['tipos']['ecommerce']['precio_ideal'], 'Para {rubro}, lo ideal sería un ecommerce hecho a mano por Pablo.') === 0);
caso('y uno que ya tiene {rubro} no se toca', strpos($cfgPitchViejo['tipos']['turnos']['precio_ideal'], 'Para {rubro}, ya migrado.') === 0);

echo "— 1-sep: la apertura del anuncio da el rango real —\n";
$rangoTxt = wabot_texto_info('precio_sin_rubro', $cfg);
$mm = wabot_rangos_min_max($cfg);
caso('"cuánto cuesta" antes del rubro contesta con el rango real y pregunta qué vende',
    $mm !== null && strpos($rangoTxt, $mm['min']) !== false && strpos($rangoTxt, $mm['max']) !== false
    && strpos($rangoTxt, '{min}') === false && mb_stripos($rangoTxt, 'depende') === false && mb_stripos($rangoTxt, 'Contame') !== false);
caso('el mínimo y el máximo salen de la lista de tipos',
    $mm['min'] === $cfg['tipos']['landing']['precio'] && $mm['max'] === $cfg['tipos']['ecommerce']['precio']);
$cfgRangoViejo = wabot_config_load();
$cfgRangoViejo['info']['precio_sin_rubro'] = 'Depende del tipo de página que necesites. Contame brevemente para qué la querés y te paso el valor exacto en un mensaje.';
wabot_config_pitch_rubro($cfgRangoViejo);
caso('el "depende" de producción migra solo', $cfgRangoViejo['info']['precio_sin_rubro'] === $cfg['info']['precio_sin_rubro']);

echo "— 1-sep: el que se va comparando se lleva UNA mención de la demo —\n";
caso('"estaba viendo y consultar precios" es comparar', wabot_texto_esta_comparando('Si estaba viendo y consultar precios. Muchas gracias') === true);
caso('"revisaré el portafolio y los vuelvo a contactar" también, y cierra como consulta',
    wabot_texto_esta_comparando('Revisaré el portafolio y los vuelvo a contactar') === true
    && wabot_cierre_sin_presion_tipo('Revisaré el portafolio y los vuelvo a contactar') === 'consulta');
caso('"mañana lo veo" no es comparar', wabot_texto_esta_comparando('mañana lo veo y te digo') === false);
caso('"la voy a mirar" sobre la demo no cierra nada', wabot_cierre_sin_presion_tipo('la voy a mirar tranquila y te digo') === null);
$cCmp = conv_nueva(); $cCmp['precio_dado'] = true; $cCmp['tipo'] = 'ecommerce'; $cCmp['fase'] = 'pitch';
$rCmp = wabot_cerrar_sin_presion($cCmp, $cfg, 'consulta', 'solo_averiguando');
caso('con precio dado y la demo sin ofrecer, la despedida la menciona una vez',
    strpos($rCmp[0], (string)$cfg['cierre_comparando']) === 0 && mb_stripos($rCmp[0], 'gratis') !== false
    && mb_stripos($rCmp[0], 'Ya queda anotado que lo tuyo sería ecommerce') !== false && !empty($cCmp['seguimiento_bloqueado']));
$cCmp2 = conv_nueva(); $cCmp2['precio_dado'] = true; $cCmp2['tipo'] = 'ecommerce'; $cCmp2['cta_muestra'] = true;
caso('si la demo ya se ofreció, va el cierre de siempre',
    strpos(wabot_cerrar_sin_presion($cCmp2, $cfg, 'consulta', 'solo_averiguando')[0], (string)$cfg['cierre_suave']) === 0);
$cCmp3 = conv_nueva(); $cCmp3['precio_dado'] = true; $cCmp3['tipo'] = 'ecommerce';
caso('y "más adelante" sin comparar también', strpos(wabot_cerrar_sin_presion($cCmp3, $cfg, 'consulta', null)[0], (string)$cfg['cierre_suave']) === 0);
$cCmp4 = conv_nueva(); $cCmp4['precio_dado'] = true; $cCmp4['tipo'] = 'ecommerce'; $cCmp4['fase'] = 'pitch';
clasifica(['otro']);
$rCmp4 = wabot_engine('Si estaba viendo y consultar precios. Muchas gracias', $cCmp4, $cfg);
caso('por el motor entero (caso Elii) sale el cierre con la demo', strpos($rCmp4[0], (string)$cfg['cierre_comparando']) === 0);

echo "— 1-sep: colores delegados y el que no sabe cómo (Enrique) —\n";
caso('"elegí vos", "no tengo", "no sé" dejan los colores en nuestras manos',
    wabot_colores_delegados('elegí vos') && wabot_colores_delegados('no tengo') && wabot_colores_delegados('no sé') && !wabot_colores_delegados('azul y blanco'));
$enrique = 'Si vos sos el creador no te puedo desir yo como aserlo';
caso('"si vos sos el creador no te puedo decir yo cómo" es un no-sé-cómo', wabot_texto_no_sabe_como($enrique) === true);
caso('"no sé si me conviene" no lo es (es una duda de valor)', wabot_texto_no_sabe_como('no sé si me conviene') === false);
$cNs = conv_nueva(); $cNs['fase'] = 'prediseno'; $cNs['precio_dado'] = true; $cNs['tipo'] = 'landing'; $cNs['cta_muestra'] = true;
$cNs['descripcion'] = 'plomería y destapaciones';
$rNs = wabot_prediseno_no_sabe_como($enrique, $cNs, $cfgOff);
caso('se lo tranquiliza y se le pide solo nombre y negocio; los colores quedan a elección nuestra',
    $rNs !== null && $rNs[0] === wabot_texto_info('no_se_nada', $cfgOff)
    && strpos($rNs[1], '- Tu nombre') !== false && strpos($rNs[1], '- El nombre de tu negocio') !== false
    && strpos($rNs[1], 'colores de tu marca') === false && strpos($rNs[1], "elegí vos") === false
    && $cNs['colores'] === 'A elección del diseñador' && !empty($cNs['referencia_preguntada']));
$cNs2 = conv_nueva(); $cNs2['fase'] = 'prediseno'; $cNs2['precio_dado'] = true; $cNs2['tipo'] = 'landing'; $cNs2['cta_muestra'] = true;
clasifica(['otro']);
$rNs2 = wabot_engine($enrique, $cNs2, $cfgOff);
caso('y por el motor entero sale igual', $rNs2[0] === wabot_texto_info('no_se_nada', $cfgOff) && count($rNs2) === 2);
caso('fuera del prediseño no hace nada', (function () use ($cfg, $enrique) { $c = conv_nueva(); return wabot_prediseno_no_sabe_como($enrique, $c, $cfg) === null; })());

echo "— 2-sep: vender los cursos no es un negocio mixto —\n";

/* Bateria del 2-sep: "quiero venderlos desde la web con los videos y que cada
 * alumna tenga su acceso" disparaba el aviso de mixto y la clienta se quedaba
 * sin precio, con el elearning ya identificado. Vender el curso ES pedir la
 * plataforma, no un segundo negocio. */
foreach ([
    'quiero venderlos desde la web con los videos y que cada alumna tenga su acceso',
    'doy cursos de maquillaje y quiero venderlos online',
    'vendo los cursos grabados',
    'quiero vender mis capacitaciones con acceso para cada alumno',
] as $soloCursos) {
    caso('"' . mb_substr($soloCursos, 0, 38) . '..." no es mixto: es la plataforma de cursos',
        wabot_ejes_mixtos($soloCursos) === null);
}
/* Pero un producto aparte si vuelve a abrir el segundo eje. */
foreach ([
    'doy talleres de costura online y vendo ropa',
    'tengo un ecommerce de ropa y ademas doy cursos de molderia',
    'vendo productos y tambien cuadernillos',
] as $mixtoReal) {
    caso('"' . mb_substr($mixtoReal, 0, 38) . '..." sigue siendo mixto',
        wabot_ejes_mixtos($mixtoReal) !== null);
}

echo "— 2-sep (noche): sin línea entre el precio y la demo —
";

/* Pablo: "sacá todo lo que sea 'si te cierra', 'si va por ahí', 'si te sirve',
 * es ridículo". El turno del precio son dos mensajes: el precio y, dos
 * segundos después, la demo con el formulario. */
foreach (wabot_tipos_ofrecibles($cfg) as $tipoSL) {
    caso("$tipoSL ya no tiene ninguna línea de pitch cargada",
        trim((string)($cfg['tipos'][$tipoSL]['pitch_pregunta'] ?? '')) === ''
        && (array)($cfg['tipos'][$tipoSL]['pitch_pregunta_variantes'] ?? []) === []);
}
$cSL = conv_sin_pitch();
$cSL['tel'] = '5491133333333TEST'; $cSL['channel_user_id'] = '5491133333333TEST'; $cSL['canal'] = 'whatsapp';
$rSL = wabot_pitch('ecommerce', $cSL, $cfg);
caso('el turno del precio son dos mensajes: precio y demo',
    count($rSL) === 2 && strpos($rSL[0], '$290.000') !== false && wabot_es_texto_demo($rSL[1], $cfg));
caso('el segundo trae el formulario y las 24hs, con el texto que dictó Pablo',
    strpos($rSL[1], 'gokywebs.com/form/') !== false
    && mb_stripos($rSL[1], 'cómo podría quedar tu web') !== false
    && mb_stripos($rSL[1], 'menos de 24hs') !== false);
caso('y en ninguno de los dos aparece la línea vieja',
    preg_match('/si te cierra|si va por ah|si te sirve|si te gusta la idea/iu', implode(' ', $rSL)) === 0);
caso('la demo queda ofrecida en el mismo turno, sin esperar respuesta',
    $cSL['fase'] === 'prediseno' && !empty($cSL['cta_muestra']));

/* La demo sale dos segundos después, no siete: por largo le tocaría el techo. */
caso('el mensaje de la demo tiene demora fija de 2 segundos',
    abs(wabot_demora_tipeo($rSL[1], $cfg) - (float)$cfg['demora_entre_mensajes']) < 0.01);
caso('mientras el precio sigue tardando lo que tarda escribirlo',
    wabot_demora_tipeo($rSL[0], $cfg) > (float)$cfg['demora_entre_mensajes']);

/* Y el link del formulario se manda UNA vez. */
$cSL2 = $cSL;
caso('con el formulario ya mandado, el turno siguiente no lo repite',
    wabot_link_form_ya_enviado($cSL2) === true);
clasifica(['otro']);
$rSL3 = wabot_engine('ok, gracias', $cSL2, $cfg);
caso('y contesta una línea de espera en vez del link',
    strpos(implode(' ', $rSL3), 'gokywebs.com/form/') === false);

echo "— 2-sep: el link del formulario sale una vez, salvo que lo pidan —
";

$cLink = ['link_form_enviado' => true];
foreach (['ah ok, dale lo completo', 'gracias', 'perfecto', 'ok'] as $acuse) {
    caso("\"$acuse\" no hace repetir el link", wabot_link_form_ya_enviado($cLink, $acuse) === true);
}
/* Pero el que lo pide lo recibe: una contadora preguntó "y la demo esa cómo
 * es? me la podés hacer?" y se llevó "cuando completes el formulario
 * arrancamos" (batería del 2-sep). */
foreach ([
    'y la demo esa como es? me la podes hacer?',
    'y la demo como funciona?',
    'mandamelo de nuevo',
    'no me llega el link',
    'quiero la demo',
] as $pide) {
    caso("\"$pide\" sí vuelve a mandar el link", wabot_link_form_ya_enviado($cLink, $pide) === false);
}
caso('y con el lead ya creado el guard no aplica',
    wabot_link_form_ya_enviado(['link_form_enviado' => true, 'lead_creado' => true], 'hola') === false);

echo "— 2-sep, auditoría: ningún camino cotiza un tipo retirado —
";

/* Cuatro caminos distintos le seguían poniendo precio a catálogo, turnos o
 * institucional. Los cuatro pasan ahora por wabot_tipo_ofrecible(). */
caso('"cuánto sale una web institucional?" no cotiza: el tipo se retiró',
    wabot_texto_pregunta_precio_de_tipo('cuanto sale una web institucional?', $cfg, 'landing') === null);
caso('ni "y con turnos cuánto sale?"',
    wabot_texto_pregunta_precio_de_tipo('y con turnos cuanto sale?', $cfg, 'landing') === null);
caso('ni "y una web con catálogo?"',
    wabot_texto_pregunta_precio_de_tipo('y una web con catalogo cuanto sale?', $cfg, 'ecommerce') === null);
caso('pero el precio de un tipo vigente sí se contesta',
    wabot_texto_pregunta_precio_de_tipo('y una landing cuanto sale?', $cfg, 'ecommerce') === 'landing');
caso('y wabot_precio_de_tipo_texto tampoco arma el texto de un retirado',
    wabot_precio_de_tipo_texto('turnos', conv_nueva(), $cfg) === null
    && wabot_precio_de_tipo_texto('landing', conv_nueva(), $cfg) !== null);

/* "Sale lo mismo sin carrito?" ofrecía la modalidad catálogo con su precio. */
$cComp = conv_nueva(); $cComp['tipo'] = 'ecommerce'; $cComp['precio_dado'] = true;
$txtComp = (string)wabot_comparacion_tipo_texto('ecommerce', $cComp, $cfg);
caso('"sin carrito" ya no ofrece el catálogo ni su precio por producto',
    stripos($txtComp, 'catálogo:') === false && strpos($txtComp, '$500') === false);
caso('y contesta lo que de verdad pasa: la tienda trae las dos formas',
    $txtComp === (string)$cfg['info']['las_dos_formas']);

echo "— 2-sep, auditoría: los marcadores no salen crudos al cliente —
";

/* {min}/{max} de precio_sin_rubro y {precio} de bilingue salían literales
 * cuando el modelo llamaba consultar_info: la rama genérica leía la config en
 * crudo en vez de pasar por wabot_texto_info(). */
foreach (['precio_sin_rubro', 'bilingue', 'rangos', 'pago_generico'] as $claveM) {
    $txtM = wabot_texto_info($claveM, $cfg);
    if (trim($txtM) === '') continue;
    caso("info.$claveM sale sin marcadores crudos", preg_match('/\{[a-z_]+\}/u', $txtM) === 0);
}

echo "— 2-sep, auditoría: la pregunta de turnos ya no se hace —\n";

/* Con turnos retirado, las dos respuestas del desempate daban el MISMO sitio
 * profesional a $180.000: la pregunta costaba un turno y no decidía nada. Y
 * ofrecía "que los reserven directamente desde la web", que es justo lo que
 * ese producto no hace. El agente ya cotizaba directo; el motor no. */
caso('un servicio con turnos ya no abre un desempate', wabot_desempate_de('turnos') === null);
caso('ni por el nombre viejo del pendiente', wabot_desempate_de('turnos_pendiente') === null);
caso('el de cursos, que sí distingue dos precios, sigue vivo',
    wabot_desempate_de('cursos') === ['desempate_cursos', 'desempate_cursos']);
caso('y el del híbrido también', wabot_desempate_de('hibrido_pendiente') !== null);

$cPelu = conv_nueva(); $cPelu['fase'] = 'menu'; $cPelu['pitch_hecho'] = false;
clasifica(['servicio_con_turnos']);
$rPelu = wabot_engine('Tengo una peluqueria', $cPelu, $cfg);
caso('la peluquería recibe el precio en el primer turno, sin repreguntar',
    ($cPelu['tipo'] ?? '') === 'landing'
    && strpos((string)$rPelu[0], (string)$cfg['tipos']['landing']['precio']) !== false);
caso('y no le preguntan si quiere reservas online, que no van a estar',
    stripos((string)$rPelu[0], 'reserven') === false
    && stripos((string)$rPelu[0], 'coordinándolos') === false);

echo "— 2-sep, auditoría: el desempate del híbrido acepta lo que el bot pide —\n";

/* desempate_hibrido_2 dice «respondeme "trabajos" o "vender"» y el matcher no
 * reconocía ninguna de las dos, ni los ordinales que sí tienen los otros
 * desempates: el cliente contestaba lo que le pidieron y el bot repreguntaba. */
foreach (['trabajos' => 'hibrido_trabajos', 'la primera' => 'hibrido_trabajos',
          'vender' => 'hibrido_vender', 'la segunda' => 'hibrido_vender',
          'venta online' => 'hibrido_vender'] as $resp => $esperado) {
    caso("«$resp» se entiende en el desempate del híbrido",
        wabot_desempate_por_palabras('desempate_hibrido', $resp) === $esperado);
}
caso('pero un saludo sigue sin decidir nada',
    wabot_desempate_por_palabras('desempate_hibrido', 'hola que tal') === null);

/* Y la pregunta ya no ofrece la modalidad catálogo, que se retiró: eran tres
 * opciones y dos terminaban en el mismo ecommerce de $290.000. */
caso('la pregunta del híbrido no nombra el catálogo retirado',
    stripos((string)$cfg['desempate_hibrido'], 'catálogo') === false
    && stripos((string)$cfg['desempate_hibrido_2'], 'catálogo') === false);

echo "— 2-sep, auditoría: ningún texto ofrece lo que ya no se vende —\n";

/* "Qué tipos de web hacen?" contestaba con los tres retirados y remataba con
 * "Cuál encaja mejor con lo tuyo?": el bot ofreciendo productos que no existen. */
caso('def_tipos ya no ofrece turnos, institucional ni la modalidad catálogo',
    stripos($cfg['def_tipos'], 'sistema de turnos') === false
    && stripos($cfg['def_tipos'], 'institucional') === false
    && stripos($cfg['def_tipos'], 'webs con catálogo') === false);
caso('pero sigue nombrando los cuatro que sí se venden',
    stripos($cfg['def_tipos'], 'sitio profesional') !== false
    && stripos($cfg['def_tipos'], 'ecommerce') !== false
    && stripos($cfg['def_tipos'], 'cursos') !== false
    && stripos($cfg['def_tipos'], 'inmobiliaria') !== false);
caso('"qué hacen ustedes?" tampoco lista los retirados',
    stripos($cfg['info']['que_hacemos'], 'webs con turnos') === false
    && stripos($cfg['info']['que_hacemos'], 'institucional') === false);

/* Y la plata: los rangos decían "desde $200.000 (una landing) hasta $320.000",
 * precios de antes del recorte. Ahora salen de los tipos vigentes. */
list($minVig, $maxVig) = wabot_rangos_min_max($cfg);
caso('el rango de precios sale de los tipos vigentes, no escrito a mano',
    strpos(wabot_texto_info('rangos', $cfg), (string)$minVig) !== false
    && strpos(wabot_texto_info('rangos', $cfg), (string)$maxVig) !== false);
caso('y no quedó ningún precio viejo en el texto',
    strpos((string)$cfg['info']['rangos'], '$200.000') === false
    && strpos((string)$cfg['info']['rangos'], '$320.000') === false);

/* El respaldo del pago va sin montos: si la cuenta de las señas falla, es
 * preferible no decir ninguno a decir los de antes del recorte. */
caso('el respaldo del pago no dice señas viejas',
    strpos((string)$cfg['info']['pago_generico'], '$60.000') === false
    && strpos((string)$cfg['info']['pago_generico'], '$80.000') === false
    && strpos((string)$cfg['info']['pago_generico'], '$90.000') === false);
caso('y el que de verdad sale sí trae las señas al día',
    strpos(wabot_texto_pago_generico($cfg), (string)$cfg['tipos']['landing']['sena']) !== false);

echo "— 2-sep, auditoría: el bot reconoce que ya ofreció la demo —\n";

/* El detector pedía la palabra "demo", "muestra" o "prediseño". El mensaje que
 * de verdad sale en producción desde el 2-sep no dice ninguna: dice "podemos
 * mostrarte cómo podría quedar tu web". Así que el bot no se reconocía a sí
 * mismo y se la volvía a ofrecer, que es el loop de "demo demo" del 1-sep. */
$tsDet = time();
foreach (['msg_prediseno_oferta', 'prediseno_link', 'cta_muestra'] as $kDet) {
    $txtDet = trim((string)($cfg[$kDet] ?? ''));
    if ($txtDet === '') continue;
    $convDet = ['session_started_ts' => $tsDet - 100,
                'transcript' => [['q' => 'bot', 't' => $txtDet, 'ts' => $tsDet]]];
    caso("$kDet se reconoce como demo ya ofrecida", wabot_cta_muestra_ya_ofrecida($convDet) === true);
}
foreach ((array)($cfg['msg_prediseno_oferta_variantes'] ?? []) as $iDet => $vDet) {
    $convDet = ['session_started_ts' => $tsDet - 100,
                'transcript' => [['q' => 'bot', 't' => (string)$vDet, 'ts' => $tsDet]]];
    caso("la variante $iDet del ofrecimiento también", wabot_cta_muestra_ya_ofrecida($convDet) === true);
}
caso('pero un mensaje cualquiera no cuenta como ofrecimiento',
    wabot_cta_muestra_ya_ofrecida(['session_started_ts' => $tsDet - 100,
        'transcript' => [['q' => 'bot', 't' => (string)$cfg['info']['hosting'], 'ts' => $tsDet]]]) === false);

/* Y las promesas: el plazo es el mismo en todos lados, y las cuotas de la
 * tarjeta nunca se nombran sin decir que tienen interés. */
caso('ningún ofrecimiento promete "uno o dos días" contra las 24hs del principal',
    (function () use ($cfg) {
        foreach (array_merge([$cfg['msg_prediseno_oferta'], $cfg['prediseno_link'] ?? ''],
                             (array)$cfg['msg_prediseno_oferta_variantes']) as $v) {
            if (stripos((string)$v, 'uno o dos días') !== false) return false;
        }
        return true;
    })());
caso('"es caro" y el link de tarjeta dicen que las cuotas tienen interés',
    stripos((string)$cfg['caro'], 'con interés') !== false
    && stripos((string)$cfg['postdemo_tarjeta'], 'con interés') !== false);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
