<?php
/**
 * wabot/test-salida.php — el punto único de salida (solo CLI).
 *
 * Cubre las dos cosas que se agregaron después de los 16 errores del 27-ago:
 *   1. que los cuatro caminos hacia el cliente apliquen los MISMOS filtros;
 *   2. que cuando el texto promete algo (una derivación, una despedida) el
 *      estado de la conversación cambie de verdad.
 *
 * Los cinco chats reales que motivaron esto están abajo como casos con nombre
 * propio: Leoo, Whitesoul, Cien Colores, Papelería creativa e Icover Store.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
clasifica(['otro']);

/** Conversación mínima, con la fase que pida el caso. */
function conv_de($fase = 'menu', $extra = []) {
    $c = wabot_conv_load('TESTSALIDA');
    $c['fase'] = $fase;
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

echo "— Fuga de texto interno (Multiservice Ya) —\n";

caso('`waited` solo → el mensaje se descarta entero',
    wabot_salida_limpiar(['waited']) === []);

caso('`waited` en su propia línea antes de la respuesta → se saca solo esa línea',
    wabot_salida_limpiar(["waited\nHola, contame qué necesitás"]) === ['Hola, contame qué necesitás']);

caso('un token técnico pegado adentro de una oración NO se toca',
    wabot_salida_limpiar(['El sistema quedó en true y listo']) === ['El sistema quedó en true y listo']);

caso('texto normal pasa intacto',
    wabot_salida_limpiar(['Perfecto, te muestro las opciones']) === ['Perfecto, te muestro las opciones']);

echo "\n— Promesas que el bot no puede hacer (Cien Colores) —\n";

$r = wabot_salida_sin_promesas(['Entiendo. Nos ajustamos a tu presupuesto. Contame qué necesitás.'], $cfg);
caso('"nos ajustamos a tu presupuesto" → se saca la oración, el resto queda',
    count($r) === 1 && strpos($r[0], 'ajustamos') === false && strpos($r[0], 'Contame qué necesitás') !== false);

$r = wabot_salida_sin_promesas(['Nos ajustamos a tu presupuesto.'], $cfg);
caso('si era todo el mensaje → sale el texto oficial de la objeción de precio, con los montos resueltos',
    count($r) === 1
    && trim($r[0]) === trim(wabot_link_presupuesto_completar(wabot_precio_placeholders((string)$cfg['caro'], null, $cfg), [], $cfg))
    && strpos($r[0], '{') === false);

$r = wabot_salida_sin_promesas(['Te hacemos un precio especial por ser vos.'], $cfg);
caso('"un precio especial" también se bloquea',
    count($r) === 1 && strpos($r[0], 'precio especial') === false);

$r = wabot_salida_sin_promesas(['El desarrollo completo tiene un valor de $290.000.'], $cfg);
caso('un precio normal NO se toca',
    $r === ['El desarrollo completo tiene un valor de $290.000.']);

echo "\n— ¿El texto anuncia una derivación? —\n";

caso('"te comunico directamente con el desarrollador" (Leoo) → sí',
    wabot_texto_anuncia_handoff('Dale, te comunico directamente con el desarrollador.'));

caso('"Te paso con el desarrollador para que coordinen" (Whitesoul) → sí',
    wabot_texto_anuncia_handoff('Te paso con el desarrollador para que coordinen.'));

caso('"te paso directamente con él" (Cien Colores) → sí',
    wabot_texto_anuncia_handoff('Perfecto, te paso directamente con él.'));

caso('"Pablo te va a escribir" → sí',
    wabot_texto_anuncia_handoff('Listo, Pablo te va a escribir por acá.'));

caso('info.soy_bot ("cuando hace falta algo más te paso con el desarrollador") → NO es un anuncio',
    !wabot_texto_anuncia_handoff('Sí, soy el asistente automático de Gokywebs. Te puedo orientar con las opciones, los precios y cómo es el proceso, y cuando hace falta algo más te paso con el desarrollador.'));

caso('"si necesitás algo puntual te paso con el desarrollador" → condicional, NO es un anuncio',
    !wabot_texto_anuncia_handoff('Si necesitás algo puntual te paso con el desarrollador.'));

// wabot_normalizar_frase() deja "sí" y "si" idénticos: un guard que descartara
// cualquier "si" habría matado este caso, que es un anuncio de verdad.
caso('"Sí, te paso con el desarrollador" → sí (el "sí" afirmativo no es condicional)',
    wabot_texto_anuncia_handoff('Sí, te paso con el desarrollador.'));

caso('una respuesta común no dispara nada',
    !wabot_texto_anuncia_handoff('El desarrollo completo sale $290.000, en un único pago.'));

echo "\n— ¿El texto cierra la charla? —\n";

caso('"Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá." → sí',
    wabot_texto_se_despide('Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.'));

caso('"Éxitos con el emprendimiento" → sí',
    wabot_texto_se_despide('Éxitos con el emprendimiento.'));

caso('una despedida que además pregunta algo → NO cierra (la charla sigue viva)',
    !wabot_texto_se_despide('Gracias por escribirnos. Querés que te arme la demo igual?'));

caso('"cualquier duda escribime" al pie de una respuesta → NO cierra',
    !wabot_texto_se_despide('Se puede pagar por transferencia o con tarjeta. Cualquier duda escribime.'));

echo "\n— Coherencia: el texto promete, el estado cambia —\n";

// Leoo: el bot dijo que lo comunicaba y la charla quedó en `menu`.
$c = conv_de('menu');
$r = wabot_salida_coherencia(['Dale, te comunico directamente con el desarrollador.'], $c, $cfg);
caso('Leoo: anuncia la derivación → la fase pasa a derivado',
    ($c['fase'] ?? '') === 'derivado' && !empty($c['handoff_pendiente']));
caso('Leoo: el texto del modelo se respeta tal cual (solo faltaba el estado)',
    $r === ['Dale, te comunico directamente con el desarrollador.']);

// Whitesoul: "te paso con el desarrollador" y al turno siguiente retomaba él.
$c = conv_de('prediseno');
wabot_salida_coherencia(['Te paso con el desarrollador para que coordinen.'], $c, $cfg);
caso('Whitesoul: con la fase ya derivada no puede volver a tomar la gestión',
    ($c['fase'] ?? '') === 'derivado' && ($c['cierre'] ?? '') === 'derivacion');

// Cien Colores: "te paso directamente con él" y después volvía al formulario.
$c = conv_de('precio');
$r = wabot_salida_coherencia([
    'Perfecto, te paso directamente con él.',
    'Mientras tanto, mandame los colores y alguna web de referencia.',
], $c, $cfg);
caso('Cien Colores: nada va DESPUÉS de la derivación en el mismo turno',
    count($r) === 1 && strpos($r[0], 'te paso directamente') !== false);

// Papelería creativa: se despidió bien y disparó el precio en el mismo turno.
// El cliente había dicho que no ("gracias pero no"): ese contexto es el que
// habilita a la despedida del bot a marcar el cierre (gate del 1-sep, para que
// un "de nada" de cortesía a un "gracias!" no bloquee el seguimiento).
$c = conv_de('precio');
$c['transcript'][] = ['q' => 'cliente', 't' => 'gracias pero no', 'ts' => time()];
$r = wabot_salida_coherencia([
    'Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.',
    'El desarrollo sale $290.000. Mirá el detalle en gokywebs.com/presupuestos/Ecommerce',
], $c, $cfg);
caso('Papelería: el segundo globo con el precio no sale después del cierre',
    count($r) === 1 && strpos($r[0], '290.000') === false);
caso('Papelería: queda el cierre marcado y el seguimiento bloqueado',
    ($c['cierre'] ?? '') === 'despedida' && !empty($c['seguimiento_bloqueado']));

// Icover Store: se despidió tras el "no puedo pagarlo" y el "igualmente"
// siguiente se leyó como aceptación.
$c = conv_de('precio', ['precio_dado' => true]);
$c['transcript'][] = ['q' => 'cliente', 't' => 'no puedo pagarlo', 'ts' => time()];
wabot_salida_coherencia(['Entiendo perfectamente. Gracias por escribirnos y éxitos con el negocio.'], $c, $cfg);
caso('Icover: la despedida marca el cierre',
    !empty($c['cierre']));
wabot_conv_transcript($c, 'bot', 'Entiendo perfectamente. Gracias por escribirnos y éxitos con el negocio.');
$r = wabot_responder('Igualmente', $c, $cfg);
caso('Icover: con el cierre marcado, "igualmente" ya no dispara el formulario',
    $r === []);

// Un texto oficial de la config que HABLA de derivar no puede derivar.
$c = conv_de('menu');
wabot_salida_coherencia([(string)($cfg['info']['soy_bot'] ?? '')], $c, $cfg);
caso('info.soy_bot no deriva la charla',
    ($c['fase'] ?? '') === 'menu');

// Ya derivada: no se vuelve a tocar nada.
$c = conv_de('derivado', ['cierre' => 'derivacion']);
$r = wabot_salida_coherencia(['Te paso con el desarrollador.', 'Otra cosa más.'], $c, $cfg);
caso('con la charla ya derivada el guard no interviene',
    count($r) === 2);

echo "\n— El pipeline completo —\n";

$c = conv_de('menu');
$r = wabot_salida_preparar(["waited\nContame un poco en qué te puedo ayudar"], $c, $cfg);
caso('turno: limpia la fuga y deja el mensaje',
    $r === ['Contame un poco en qué te puedo ayudar']);

$c = conv_de('precio');
$r = wabot_salida_preparar(['Primera pregunta, cuál es tu rubro?', 'Segunda pregunta, qué vendés?'], $c, $cfg);
caso('turno: una sola pregunta por tanda',
    count($r) === 1);

// En modo emisor no corre el anti-repetición: el texto de un cron no es una
// repetición de la charla aunque se parezca a algo que ya se dijo.
$c = conv_de('precio', ['tandas_bot' => [wabot_normalizar_frase('Te quedó alguna duda?')]]);
$r = wabot_salida_preparar(['Te quedó alguna duda?'], $c, $cfg, 'emisor');
caso('emisor: no aplica anti-repetición',
    $r === ['Te quedó alguna duda?']);

$c = conv_de('precio');
caso('emisor: un texto con una promesa prohibida no sale así',
    strpos(wabot_salida_emisor_texto('Nos ajustamos a tu presupuesto, avisame.', $c, $cfg), 'ajustamos') === false);

$c = conv_de('menu');
caso('emisor: wabot_salida_emisor_texto devuelve string, no array',
    is_string(wabot_salida_emisor_texto('Te quedó alguna duda?', $c, $cfg)));

echo "\n— Ningún marcador sale crudo por ninguno de los cuatro caminos —\n";

$c = conv_de('derivado', ['nombre' => 'Leonardo', 'nombre_confirmado' => true]);
$r = wabot_salida_preparar(['Perfecto, {nombre}. A partir de acá sigue Pablo.'], $c, $cfg);
caso('turno: {nombre} se reemplaza antes de salir',
    count($r) === 1 && strpos($r[0], '{nombre}') === false && strpos($r[0], 'Leonardo') !== false);

$c = conv_de('precio', ['nombre' => 'Leonardo', 'nombre_confirmado' => true]);
caso('emisor: también',
    strpos(wabot_salida_emisor_texto('Hola {nombre}, te quedó alguna duda?', $c, $cfg), '{nombre}') === false);

$c = conv_de('menu');
$r = wabot_salida_preparar(['Perfecto, {nombre}. Contame más.'], $c, $cfg);
caso('sin nombre confirmado el marcador se saca limpio, no queda un hueco raro',
    count($r) === 1 && strpos($r[0], '{nombre}') === false && strpos($r[0], '  ') === false);

echo "\n— Preguntas de precio que el bot ya sabe contestar (Aberturas) —\n";

caso('"cuánto cuesta agregar venta y cobro online" con una landing cotizada → ecommerce',
    wabot_texto_pregunta_upgrade('Cuánto cuesta agregar venta y cobro online?', 'landing') === 'ecommerce');

caso('"si le sumo carrito cuánto sale" con un sitio profesional cotizado → ecommerce',
    wabot_texto_pregunta_upgrade('Y si le sumo carrito, cuánto sale?', 'landing') === 'ecommerce');

caso('un "cuánto sale" pelado NO recotiza por su cuenta',
    wabot_texto_pregunta_upgrade('Cuánto sale?', 'landing') === null);

caso('con un ecommerce ya cotizado la pregunta no aplica',
    wabot_texto_pregunta_upgrade('Puedo agregar cobro online?', 'ecommerce') === null);

$c = conv_de('precio', ['tipo' => 'landing', 'precio_dado' => true]);
$up = wabot_upgrade_texto('ecommerce', $c, $cfg);
caso('la respuesta trae el precio del ecommerce, no el de la landing',
    is_string($up)
    && strpos($up, (string)$cfg['tipos']['ecommerce']['precio']) !== false);
caso('y aclara que no es un adicional sobre lo ya cotizado',
    is_string($up) && strpos($up, 'No es un adicional') !== false);

// El camino entero, como lo ve el cliente.
// Cotizada con el modelo nuevo: el precio congelado es el de hoy (10-sep).
$c = conv_de('precio', ['tipo' => 'landing', 'precio_dado' => true, 'pitch_hecho' => true,
    'precio_cotizado' => '$40.000', 'mensualidad_cotizada' => '$20.000', 'precio_modelo' => 'mensual']);
$r = wabot_responder('Cuánto cuesta agregar venta y cobro online?', $c, $cfg);
caso('Aberturas: la consulta se contesta con el precio del ecommerce, sin repreguntar el proyecto',
    is_array($r) && count($r) === 1
    && strpos($r[0], (string)$cfg['tipos']['ecommerce']['precio']) !== false
    && strpos($r[0], (string)$cfg['tipos']['landing']['precio']) !== false);

echo "\n— El listado del prediseño contestado en orden (Whitesoul) —\n";

$pedido = ['Tu nombre', 'El nombre de tu negocio', 'Los colores de tu marca'];

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
$ok = wabot_prediseno_lista_posicional('Alejandra / Whitesoul.nordelta / Pasteles', $c);
caso('Whitesoul: los tres datos se leen en orden',
    $ok && $c['nombre'] === 'Alejandra' && $c['nombre_negocio'] === 'Whitesoul.nordelta'
        && $c['colores'] === 'Pasteles');
caso('Whitesoul: el nombre queda confirmado (lo dijo el cliente, no el perfil)',
    !empty($c['nombre_confirmado']));
// Ninguno de los tres que se le pidieron sigue pendiente, y la marca de
// "esto es lo que le pedí" queda limpia para que no se le repita el listado.
$faltanAhora = wabot_prediseno_faltan($c, false);
caso('Whitesoul: ninguno de los tres pedidos sigue faltando',
    !array_intersect($pedido, $faltanAhora) && ($c['prediseno_pedido'] ?? null) === []);

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
caso('con salto de línea en vez de barra también',
    wabot_prediseno_lista_posicional("Alejandra\nWhitesoul.nordelta\nPasteles", $c)
    && $c['colores'] === 'Pasteles');

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
caso('numerado ("1. …") también',
    wabot_prediseno_lista_posicional("1. Alejandra\n2. Whitesoul\n3. Pasteles", $c)
    && $c['nombre'] === 'Alejandra' && $c['colores'] === 'Pasteles');

// Los cortes que evitan escribir basura en el lead.
$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
caso('si mandó menos datos que los pedidos → no se mapea nada',
    !wabot_prediseno_lista_posicional('Alejandra / Whitesoul', $c) && empty($c['nombre']));

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
caso('un mensaje sin separadores no es una lista',
    !wabot_prediseno_lista_posicional('Alejandra', $c));

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido]);
caso('una pregunta nunca se lee como lista',
    !wabot_prediseno_lista_posicional('Alejandra / Whitesoul / qué colores me recomendás?', $c));

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido, 'nombre' => 'Ale', 'nombre_confirmado' => true]);
wabot_prediseno_lista_posicional('Alejandra / Whitesoul.nordelta / Pasteles', $c);
caso('nunca pisa un dato que ya estaba',
    $c['nombre'] === 'Ale' && $c['colores'] === 'Pasteles');

$c = conv_de('prediseno', ['prediseno_pedido' => [
    'Tu nombre', 'Los colores de tu marca',
    'Si tenés alguna web de referencia que te guste (de cualquier rubro, y si no tenés no pasa nada)']]);
wabot_prediseno_lista_posicional('Alejandra / Pasteles / no tengo', $c);
caso('"no tengo" en la referencia se guarda como vacío, no como texto',
    trim((string)$c['referencia']) === '' && !empty($c['referencia_preguntada']));

echo "\n— La charla no avanza aunque la pregunta cambie de palabras —\n";

// Caso del marketplace en la bateria en vivo: tres preguntas distintas sobre lo
// mismo, sin que nada del estado cambiara. wabot_anti_repeticion no lo ve
// porque compara el texto.
$c = conv_de('sistema_problema');
$r1 = wabot_salida_preparar(['Cuántos vendedores estimás que usarían la plataforma?'], $c, $cfg);
$primeraOk = count($r1) === 1 && ($c['fase'] ?? '') !== 'derivado';
$r2 = wabot_salida_preparar(['Aproximadamente cuántas personas usarían el sistema?'], $c, $cfg);
$segundaOk = count($r2) === 1 && ($c['fase'] ?? '') !== 'derivado';
$r3 = wabot_salida_preparar(['Me dirías cuántos vendedores o usuarios estimás?'], $c, $cfg);

caso('las dos primeras salen normales', $primeraOk && $segundaOk);
// La comparación va contra el texto YA personalizado: wabot_salida_preparar()
// reemplaza {nombre} antes de devolver, así que el crudo de la config no coincide.
caso('a la tercera lo toma Pablo, aunque las tres preguntas sean distintas',
    count($r3) === 1 && ($c['fase'] ?? '') === 'derivado'
    && strpos($r3[0], '{nombre}') === false
    && wabot_normalizar_frase($r3[0]) === wabot_normalizar_frase(wabot_personalizar((string)$cfg['derivar'], $c)));

// Y no puede dispararse cuando la charla SÍ avanza.
$c = conv_de('prediseno', ['nombre_negocio' => '']);
wabot_salida_preparar(['Cómo se llama tu negocio?'], $c, $cfg);
$c['nombre_negocio'] = 'Whitesoul';
wabot_salida_preparar(['Y los colores de tu marca?'], $c, $cfg);
$c['colores'] = 'Pasteles';
$r = wabot_salida_preparar(['Tenés alguna web de referencia?'], $c, $cfg);
caso('juntar los datos de a uno NO cuenta como estar trabado',
    $r === ['Tenés alguna web de referencia?'] && ($c['fase'] ?? '') !== 'derivado');

$c = conv_de('precio', ['tipo' => 'landing', 'precio_dado' => true]);
wabot_salida_preparar(['El desarrollo sale $160.000.'], $c, $cfg);
wabot_salida_preparar(['Se puede pagar por transferencia.'], $c, $cfg);
$r = wabot_salida_preparar(['El hosting va aparte.'], $c, $cfg);
caso('contestar sin preguntar nada tampoco cuenta',
    count($r) === 1 && ($c['fase'] ?? '') !== 'derivado');

echo "\n— Pedir una persona con el pronombre pegado al verbo —\n";

caso('"prefiero hablarlo con alguien técnico" es pedir un humano',
    wabot_handoff_causa_explicita('Es algo complejo, prefiero hablarlo con alguien técnico') === 'pide_humano');
caso('"quiero hablar con una persona" sigue funcionando',
    wabot_handoff_causa_explicita('quiero hablar con una persona') === 'pide_humano');
caso('"prefiero hablarlo con mi socio" NO deriva (es su socio, no el nuestro)',
    wabot_handoff_causa_explicita('prefiero hablarlo con mi socio') !== 'pide_humano');

echo "\n— El cliente insiste en que ya mandó los datos (Clínica de Mar) —\n";

caso('"Está todo en lo que te mandé" se reconoce',
    wabot_apunta_a_lo_ya_dicho('Está todo en lo que te mandé'));
caso('"ya te pasé todo" también',
    wabot_apunta_a_lo_ya_dicho('ya te pasé todo'));
caso('un mensaje con datos de verdad NO se confunde con un reclamo',
    !wabot_apunta_a_lo_ya_dicho('Alejandra, la marca es Whitesoul'));

$c = conv_de('prediseno', ['prediseno_pedido' => ['Tu nombre', 'Los colores de tu marca']]);
$r = wabot_responder('Está todo en lo que te mandé', $c, $cfg);
caso('Clínica de Mar: en vez de volver a pedirlos, lo toma Pablo',
    $r === [$cfg['derivar']] && ($c['fase'] ?? '') === 'derivado');

echo "\n— Una necesidad nombrada no puede quedar sin respuesta (Marcco Cueros) —\n";

caso('"bilingüe" y "en dos idiomas" van a la respuesta del idioma',
    wabot_info_por_palabras('La web tiene que ser bilingüe', 'pitch') === 'bilingue'
    && wabot_info_por_palabras('se puede en dos idiomas?', 'pitch') === 'bilingue');
$idioma = wabot_texto_info('bilingue', $cfg);
caso('y no le pone un precio inventado: está incluido, hasta 3 idiomas',
    strpos($idioma, '$') === false && strpos($idioma, '{') === false && mb_stripos($idioma, 'incluido') !== false
    && mb_stripos($idioma, '3 idiomas') !== false);
/* Con el precio ya dado, desde el 18-sep la pregunta la contesta Pablo; si
 * vuelve a prender el bot (charla derivada), el motor la contesta así. */
$c = conv_de('derivado', ['tipo' => 'ecommerce', 'precio_dado' => true, 'cta_muestra' => true, 'bot_off' => false]);
$r = wabot_responder('Necesito ecommerce internacional, se puede en dos idiomas?', $c, $cfg);
caso('Marcco: la pregunta por el idioma se contesta con el texto oficial, por el motor',
    is_array($r) && mb_stripos(implode(' ', $r), '3 idiomas') !== false && strpos(implode(' ', $r), '$') === false, json_encode($r, JSON_UNESCAPED_UNICODE));
$c = conv_de('prediseno', ['tipo' => 'ecommerce', 'precio_dado' => true, 'cta_muestra' => true]);
$r = wabot_responder('Necesito ecommerce internacional, español/inglés, con ventas al extranjero', $c, $cfg);
caso('y nombrada sin preguntar, no se inventa un adicional ni un precio',
    is_array($r) && strpos(implode(' ', $r), '$') === false && mb_stripos(implode(' ', $r), 'adicional') === false);

echo "\n— El listado con guiones se lee igual que con barras (verificación 28-ago) —\n";

$pedido3 = ['Tu nombre', 'El nombre de tu negocio', 'Los colores de tu marca'];
$c = conv_de('prediseno', ['prediseno_pedido' => $pedido3]);
$ok = wabot_prediseno_lista_posicional('Malena - IndumentariaMale - negro y dorado', $c);
caso('los tres datos con guion se leen en orden',
    $ok && $c['nombre'] === 'Malena' && $c['nombre_negocio'] === 'IndumentariaMale'
        && $c['colores'] === 'negro y dorado');

$c = conv_de('prediseno', ['prediseno_pedido' => $pedido3]);
caso('un guion pegado a la palabra (sin espacios) NO separa nada',
    !wabot_prediseno_lista_posicional('e-commerce de indumentaria', $c));

echo "\n— El pedido de armar la web en otra plataforma no puede depender del modelo (verificación 28-ago) —\n";

caso('"me pueden hacer una página en Wix" se reconoce',
    wabot_texto_pide_armar_en_plataforma('Hola, me pueden hacer una pagina en Wix para mi negocio de tortas?'));
caso('"me pueden armar la página en Wix" también',
    wabot_texto_pide_armar_en_plataforma('Me pueden armar la pagina en Wix?'));
caso('"necesito una tienda en Tiendanube" también',
    wabot_texto_pide_armar_en_plataforma('Necesito una tienda en Tiendanube'));
caso('"ya tengo mi tienda en Wix" NO es esto (es ya_tiene_plataforma, otro texto)',
    !wabot_texto_pide_armar_en_plataforma('Ya tengo mi tienda en Wix, la pueden revisar?'));
caso('"no quiero nada con Tiendanube" NO dispara la objeción (ya está de acuerdo)',
    !wabot_texto_pide_armar_en_plataforma('No quiero nada con Tiendanube, prefiero algo propio'));
caso('un mensaje sin ninguna plataforma no dispara nada',
    !wabot_texto_pide_armar_en_plataforma('Hola, tengo una veterinaria'));

/* V06 (10-sep): después del "no trabajamos en Wix" la venta tiene que seguir:
 * la objeción la contesta el código y, sin precio dado, se pregunta el rubro en
 * el mismo turno. */
$c = conv_de('menu');
$r = wabot_responder('Hola, me pueden hacer una pagina en Wix para mi negocio de tortas?', $c, $cfg);
caso('la objeción de plataforma y la pregunta del rubro, sin cortar la charla (V06)',
    is_array($r) && count($r) === 2 && mb_stripos($r[0], 'wix') !== false && strpos($r[0], '{') === false
    && $r[1] === (string)$cfg['contame']);
caso('y la fase no avanza a un tipo cotizado: el pedido de plataforma se contestó, no se ignoró',
    empty($c['tipo']));
caso('y la marca del turno no queda guardada en la charla', !isset($c['_plataforma_contestada']));

/* Con el precio ya dado, una objeción PREGUNTADA se contesta (Pablo, 20-sep:
 * "también resuelve dudas") y la oferta del primer diseño sigue abierta. */
$c = conv_de('menu', ['bot_off' => false, 'cierre' => null, 'precio_dado' => false, 'tipo' => null]);
wabot_pitch('ecommerce', $c, $cfg);
$r = wabot_responder('Me la pueden hacer en Tiendanube?', $c, $cfg);
caso('con el precio ya dado, "¿me la hacen en Tiendanube?" se contesta y el bot sigue prendido',
    $r !== [] && mb_stripos(implode("\n", $r), 'No la armamos sobre Tiendanube') !== false
    && empty($c['bot_off']) && !empty($c['oferta_diseno_ts']), json_encode($r, JSON_UNESCAPED_UNICODE));

echo "\n— La objeción de plataformas contesta antes de argumentar (Tiendanube) —\n";

caso('el texto abre contestando que no se arma sobre esas plataformas (14-sep)',
    preg_match('/^No la armamos sobre Tiendanube/u', (string)$cfg['plataformas']) === 1);

/* 10-sep: el argumento del pago único murió con el modelo viejo. El que queda
 * es quién arma la página: allá una plantilla que arma el cliente, acá una web
 * a medida hecha por nosotros. */
caso('y ya no usa el argumento del pago único: el diferenciador es quién arma la página',
    strpos((string)$cfg['plataformas'], 'pago único') === false
    && stripos((string)$cfg['plataformas'], 'plantilla') !== false
    && stripos((string)$cfg['plataformas'], 'a medida') !== false);

echo "\n— Lo que el bot no sabe contestar no se contesta (Pablo, 19-sep) —\n";

$comodin = (string)$cfg['info']['otra'];
$c = conv_de('menu');
caso('el comodín solo → el turno queda mudo y el chat le queda pendiente a Pablo',
    wabot_salida_preparar([$comodin], $c, $cfg) === [] && !empty($c['handoff_pendiente']));

$c = conv_de('menu');
$r = wabot_salida_preparar(["- El hosting y el dominio van incluidos.\n- $comodin"], $c, $cfg);
caso('en una lista se cae solo esa línea y la respuesta real queda, sin la viñeta suelta',
    count($r) === 1 && strpos($r[0], 'hosting') !== false && strpos($r[0], 'contestar el desarrollador') === false
    && strpos($r[0], '- ') !== 0, json_encode($r, JSON_UNESCAPED_UNICODE));

$c = conv_de('menu');
$r = wabot_salida_preparar(['Somos de Tigre, Buenos Aires.'], $c, $cfg);
caso('una respuesta normal pasa intacta y no marca nada',
    $r === ['Somos de Tigre, Buenos Aires.'] && empty($c['handoff_pendiente']));

$c = conv_nueva('549110000COMODIN', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['otra']]);
$r = turno('Ustedes facturan en dólares para el exterior?', $c, $cfg);
caso('por el borde común: el bot no contesta y queda pendiente',
    $r === [] && !empty($c['handoff_pendiente']), json_encode($r, JSON_UNESCAPED_UNICODE));
clasifica(['otro']);

@unlink(WABOT_DATA . '/conv/TESTSALIDA.json');
unset($GLOBALS['WABOT_TEST_CLASIFICADOR']);

todo_ok();
