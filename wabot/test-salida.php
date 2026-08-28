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

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;

$cfg = wabot_config_load();

$fallas = 0; $total = 0;
function caso($nombre, $ok) {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . "\n";
    if (!$ok) $fallas++;
}

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
caso('si era todo el mensaje → sale el texto oficial de la objeción de precio',
    count($r) === 1 && trim($r[0]) === trim((string)$cfg['caro']));

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
$c = conv_de('precio');
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

echo "\n— Preguntas de precio que el bot ya sabe contestar (Aberturas) —\n";

caso('"cuánto cuesta agregar venta y cobro online" con una landing cotizada → ecommerce',
    wabot_texto_pregunta_upgrade('Cuánto cuesta agregar venta y cobro online?', 'landing') === 'ecommerce');

caso('"si le sumo carrito cuánto sale" con turnos cotizados → ecommerce',
    wabot_texto_pregunta_upgrade('Y si le sumo carrito, cuánto sale?', 'turnos') === 'ecommerce');

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
$c = conv_de('precio', ['tipo' => 'landing', 'precio_dado' => true, 'pitch_hecho' => true]);
$r = wabot_responder('Cuánto cuesta agregar venta y cobro online?', $c, $cfg);
caso('Aberturas: la consulta se contesta con el precio del ecommerce, sin repreguntar el proyecto',
    is_array($r) && count($r) === 1
    && strpos($r[0], (string)$cfg['tipos']['ecommerce']['precio']) !== false
    && strpos($r[0], (string)$cfg['tipos']['landing']['precio']) !== false);

echo "\n— La objeción de plataformas contesta antes de argumentar (Tiendanube) —\n";

caso('el texto abre diciendo que sobre esas plataformas no se trabaja',
    preg_match('/^Sobre Tiendanube[^.]*no trabajamos/u', (string)$cfg['plataformas']) === 1);

caso('y conserva el argumento de pago único',
    strpos((string)$cfg['plataformas'], 'pago único') !== false);

@unlink(WABOT_DATA . '/conv/TESTSALIDA.json');

echo "\n" . ($fallas === 0 ? "TODO OK — $total casos\n" : "FALLARON $fallas de $total\n");
exit($fallas === 0 ? 0 : 1);
