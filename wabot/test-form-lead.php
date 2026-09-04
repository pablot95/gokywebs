<?php
/**
 * wabot/test-form-lead.php — formulario web ↔ boceto, sin pegarle a Firestore
 * ni a WhatsApp real (solo CLI).
 */

if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';

$GLOBALS['WABOT_TEST_SIN_RED'] = true;

$fallas = 0; $total = 0;
function caso($nombre, $ok) {
    global $fallas, $total; $total++;
    echo ($ok ? "  ✓ " : "  ✗ ") . $nombre . "\n";
    if (!$ok) $fallas++;
}

$cfg = wabot_config_load();
// El form queda apagado por defecto (momentáneamente, pedido de Pablo
// 25-ago): estos tests ejercitan el mecanismo del link en sí, así que lo
// prenden a propósito. El caso apagado se prueba aparte, explícito, abajo.
$cfg['form_activo'] = true;

echo "— wabot_form_link() —\n";

$convWsp = ['tel' => '5491122334455TEST', 'channel_user_id' => '5491122334455TEST', 'canal' => 'whatsapp', 'nombre_negocio' => 'Panadería Sur'];
$link = wabot_form_link($convWsp, $cfg);
// El link va con el código corto: el teléfono adentro lo hacía larguísimo.
// Desde el 2-sep son DOS caracteres (Pablo: "más corto, menos sospechoso").
caso('arma la URL con el código corto en ?c=', (bool)preg_match('~^https://gokywebs\.com/form/\?c=[A-Z0-9]{2}$~', $link));
caso('y el teléfono NO viaja en el link', strpos($link, '5491122334455') === false);
caso('el código queda guardado en la conversación', ($convWsp['codigo'] ?? '') !== ''
    && strpos($link, $convWsp['codigo']) !== false);
caso('y es estable: pedirlo de nuevo devuelve el mismo', wabot_form_link($convWsp, $cfg) === $link);

$cfgFormOff = $cfg; $cfgFormOff['form_activo'] = false;
$convWspOff = ['tel' => '5491122334466TEST', 'channel_user_id' => '5491122334466TEST', 'canal' => 'whatsapp', 'nombre_negocio' => 'Panadería Sur'];
caso('con el form apagado, no da link ni en WhatsApp', wabot_form_link($convWspOff, $cfgFormOff) === '');

echo "— Código corto —
";

caso('normalizar saca lo que no es del alfabeto y pasa a mayúsculas',
    wabot_codigo_normalizar(' a-b c ') === 'ABC');
caso('los caracteres ambiguos NO se remapean a otro código válido',
    wabot_codigo_normalizar('0O1IL') === '');
caso('buscar con un código ilegible no devuelve ninguna conversación',
    wabot_codigo_buscar('0O1IL') === '' && wabot_codigo_buscar('') === '');
caso('dos conversaciones distintas no comparten código',
    (function () {
        $a = ['tel' => 'TESTCOD1', 'channel_user_id' => 'TESTCOD1', 'canal' => 'whatsapp'];
        $b = ['tel' => 'TESTCOD2', 'channel_user_id' => 'TESTCOD2', 'canal' => 'whatsapp'];
        return wabot_codigo_asignar($a) !== wabot_codigo_asignar($b);
    })());
caso('el link del form acepta el código y resuelve el teléfono del cliente',
    wabot_form_lead_validar(['c' => 'ZZZ', 'nombre' => 'A', 'nombre_negocio' => 'B',
        'resumen' => 'C', 'colores' => 'D']) === null);
/* Instagram va por el mismo camino que WhatsApp (Pablo, 2-sep: "si instagram
 * que sea igual que wsp"). El formulario identifica la charla por el código,
 * no por el teléfono, así que siempre pudo: faltaba dejarlo pasar. */
$convIg = ['tel' => 'IG1', 'channel_user_id' => 'IG1', 'canal' => 'instagram'];
$linkIg = wabot_form_link($convIg, $cfg);
caso('en Instagram también sale el link del formulario', strpos($linkIg, '/form/?c=') !== false);
caso('y avisa que ahí hay que pedir el WhatsApp, porque del IGSID no sale ninguno',
    strpos($linkIg, '&ig=1') !== false);
$convWsp = ['tel' => 'TESTWSP1', 'channel_user_id' => 'TESTWSP1', 'canal' => 'whatsapp'];
caso('en WhatsApp el link sigue sin esa marca: el número ya lo tenemos',
    strpos(wabot_form_link($convWsp, $cfg), '&ig=1') === false);
$convSinTel = ['tel' => '', 'channel_user_id' => '', 'canal' => 'whatsapp'];
caso('ni sin teléfono', wabot_form_link($convSinTel, $cfg) === '');

/* Y del otro lado: el formulario de una charla de Instagram NO cambia la clave
 * por el teléfono tipeado —eso perdería el hilo del DM—, lo guarda aparte. */
$claveIg = 'ig17841400000000000';
$idxPath = wabot_codigo_indice_path();
$idxPrevio = @file_get_contents($idxPath);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(), ['K7' => $claveIg])));
$datosIg = wabot_form_lead_validar(['c' => 'K7', 't' => '1123456789', 'nombre' => 'Ana',
    'nombre_negocio' => 'Estudio', 'resumen' => 'Diseño de interiores', 'colores' => 'verde']);
caso('la charla sigue siendo la de Instagram, no el teléfono',
    is_array($datosIg) && $datosIg['clave'] === $claveIg);
caso('y el WhatsApp tipeado queda como dato aparte',
    is_array($datosIg) && $datosIg['telWsp'] === '1123456789');
caso('sin WhatsApp no se acepta: el boceto llegaría sin destinatario',
    wabot_form_lead_validar(['c' => 'K7', 'nombre' => 'Ana', 'nombre_negocio' => 'Estudio',
        'resumen' => 'Diseño de interiores', 'colores' => 'verde']) === null);
if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);

/* Y en WhatsApp igual: el código manda sobre el teléfono tipeado. Cuidar+ y
 * Distribuidora Lionel se llevaron dos bocetos cada uno el 3-sep porque el
 * número que el cliente escribe ("1167134135") no es la clave con la que
 * WhatsApp guarda la charla ("5491167134135"): el formulario abría una segunda
 * conversación, fantasma, y el chat cerraba después la suya. */
$claveWsp = '5491167134135';
$idxPrevio = @file_get_contents($idxPath);
file_put_contents($idxPath, json_encode(array_merge(wabot_codigo_indice_leer(), ['K8' => $claveWsp])));
$mismoNumero = ['c' => 'K8', 't' => '1167134135', 'nombre' => 'Silvia', 'nombre_negocio' => 'Cuidar+',
    'resumen' => 'Cuidados a domicilio', 'colores' => 'crema y verde'];
$datosWsp = wabot_form_lead_validar($mismoNumero);
caso('el mismo número escrito sin el 549 no abre otra conversación',
    is_array($datosWsp) && $datosWsp['clave'] === $claveWsp);
caso('y no se guarda como WhatsApp aparte: es el número del chat, no una corrección',
    is_array($datosWsp) && $datosWsp['telWsp'] === '');
$corregido = array_merge($mismoNumero, ['t' => '3814002001']);
$datosCorr = wabot_form_lead_validar($corregido);
caso('un número de OTRO abonado sigue siendo una corrección, no una clave nueva',
    is_array($datosCorr) && $datosCorr['clave'] === $claveWsp && $datosCorr['telWsp'] === '3814002001');
if ($idxPrevio !== false) file_put_contents($idxPath, $idxPrevio); else @unlink($idxPath);

/* Sin código —el formulario abierto a mano— el número tipeado es lo único que
 * hay, pero si ya existe la charla de ese abonado el boceto va ahí. */
@unlink(WABOT_DATA . '/conv/5493810004001.json');
caso('sin código y sin charla previa, la clave es lo que tipeó',
    (wabot_form_lead_validar(['t' => '3810004001', 'nombre' => 'Ana', 'nombre_negocio' => 'B',
        'resumen' => 'C', 'colores' => 'D'])['clave'] ?? '') === '3810004001');
wabot_conv_save(wabot_conv_load('5493810004001'));
caso('sin código pero con la charla ya abierta, cae en la charla',
    (wabot_form_lead_validar(['t' => '3810004001', 'nombre' => 'Ana', 'nombre_negocio' => 'B',
        'resumen' => 'C', 'colores' => 'D'])['clave'] ?? '') === '5493810004001');
@unlink(WABOT_DATA . '/conv/5493810004001.json');

caso('mismo abonado escrito de las dos formas', wabot_mismo_abonado('1167134135', '5491167134135'));
caso('con el 15 del medio también', wabot_mismo_abonado('3814002001', '5493814002001'));
caso('dos números distintos no se confunden', !wabot_mismo_abonado('1167134135', '5493814002001'));

echo "— wabot_form_lead_procesar(): validación —\n";

caso('rechaza sin teléfono válido',
    wabot_form_lead_procesar(['t' => '123', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => 'X', 'colores' => 'X'], $cfg)['ok'] === false);
caso('rechaza con un campo vacío',
    wabot_form_lead_procesar(['t' => '5493810001001', 'nombre' => '', 'nombre_negocio' => 'X', 'resumen' => 'X', 'colores' => 'X'], $cfg)['ok'] === false);
caso('rechaza un resumen absurdamente largo',
    wabot_form_lead_procesar(['t' => '5493810001002', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => str_repeat('a', 601), 'colores' => 'X'], $cfg)['ok'] === false);

echo "— wabot_form_lead_procesar(): sin chat previo, el brief refleja lo tipeado —\n";

@unlink(WABOT_DATA . '/conv/5493810002001.json');
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
caso('el envío se acepta', $r['ok'] === true);
caso('avisa a Pablo por WhatsApp con el nombre y el negocio del lead',
    (function () {
        foreach ($GLOBALS['WABOT_TEST_ENVIADOS'] ?? [] as $env) {
            if (($env[0] ?? '') === '5491125068578'
                && strpos($env[1] ?? '', 'Carla') !== false && strpos($env[1] ?? '', 'Carla Deco') !== false) return true;
        }
        return false;
    })());
$conv = wabot_conv_load('5493810002001');
caso('el nombre de la persona queda confirmado', $conv['nombre'] === 'Carla' && !empty($conv['nombre_confirmado']));
caso('el nombre del negocio queda anotado', $conv['nombre_negocio'] === 'Carla Deco');
caso('la descripción y los colores quedan anotados',
    $conv['descripcion'] === 'Vendo objetos de decoración hechos a mano' && $conv['colores'] === 'Beige y dorado');
caso('queda marcado el origen', $conv['origen_prediseno'] === 'form');
caso('el boceto se cierra igual que por chat', $conv['fase'] === 'derivado' && !empty($conv['lead_creado']));
caso('el brief NO queda vacío (sin esto, wabot_firestore_lead mandaba nombre_negocio vacío)',
    !empty($conv['brief']) && $conv['brief']['marca'] === 'Carla Deco');
caso('queda una sola línea de transcript, no rompe el chat_completo del admin', count($conv['transcript']) === 1);
caso('esa línea es de sistema, no de cliente (no debe contar como que "el cliente respondió")',
    $conv['transcript'][0]['q'] === 'sistema');

echo "— Reenviar el mismo form no duplica nada —\n";

$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$r2 = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
$conv2 = wabot_conv_load('5493810002001');
caso('sigue aceptando el reenvío', $r2['ok'] === true);
caso('no duplica la línea del transcript', count($conv2['transcript']) === 1);
caso('el reenvío no vuelve a avisarle a Pablo', ($GLOBALS['WABOT_TEST_ENVIADOS'] ?? []) === []);
@unlink(WABOT_DATA . '/conv/5493810002001.json');

echo "— Con chat real previo, el brief no se pisa —\n";

@unlink(WABOT_DATA . '/conv/5493810002002.json');
$convPrevio = wabot_conv_load('5493810002002');
$convPrevio['transcript'] = [['q' => 'cliente', 't' => 'Hola, tengo una florería', 'ts' => time() - 100]];
$convPrevio['ultimo_cliente_ts'] = time() - 100;
wabot_conv_save($convPrevio);
wabot_form_lead_procesar(['t' => '5493810002002', 'nombre' => 'Marta', 'nombre_negocio' => 'Flores Marta',
    'resumen' => 'Florería de barrio', 'colores' => 'Verde y blanco'], $cfg);
$convDespues = wabot_conv_load('5493810002002');
caso('el brief queda vacío para que corra wabot_resumen_negocio() como siempre', empty($convDespues['brief']));
@unlink(WABOT_DATA . '/conv/5493810002002.json');

/* ─────────────────────────────────────────────────────────────────────────
 * 3-sep: Instagram → formulario → WhatsApp es UN cliente, no tres.
 *
 * Natalia (Secretos Compartidos) entró por DM, completó el formulario desde
 * ahí —así que el boceto y sus datos quedaron en la charla de Instagram— y el
 * propio formulario la mandó a WhatsApp con su mensaje de aviso. Esa
 * conversación arrancaba vacía: le preguntó "contame un poco qué es o qué
 * ofrecés", la hizo repetir todo, le ofreció el formulario de nuevo y ella lo
 * completó dos veces en quince minutos. Dos leads del mismo negocio.
 * ───────────────────────────────────────────────────────────────────────── */
echo "— Instagram → formulario → WhatsApp: un solo lead —\n";

$igNat = wabot_conv_load('igQATESTNATALIA1');
$igNat['canal'] = 'instagram';
$igNat['telefono_wsp'] = '2494691266';          // como lo tipeó ella en el form
$igNat['nombre'] = 'Natalia'; $igNat['nombre_confirmado'] = true;
$igNat['nombre_negocio'] = 'Secretos Compartidos';
$igNat['descripcion'] = 'Ofrecemos prendas femeninas de calidad para diferentes edades y estilos';
$igNat['colores'] = 'Color principal: #ffffff'; $igNat['tipo'] = 'ecommerce';
$igNat['precio_dado'] = true; $igNat['pitch_hecho'] = true; $igNat['cta_muestra'] = true;
$igNat['lead_creado'] = true; $igNat['form_completado_ts'] = time(); $igNat['fase'] = 'prediseno';
wabot_conv_save($igNat);

// El mismo abonado escribiendo por WhatsApp: Meta lo manda con 549 adelante.
$wspNat = wabot_conv_load('5492494691266TEST');
$wspNat['tel'] = '5492494691266'; $wspNat['channel_user_id'] = '5492494691266';
caso('la conversación de WhatsApp encuentra a su hermana de Instagram por el telefono_wsp',
    wabot_conv_hermana('5492494691266') === 'igQATESTNATALIA1');

$wspNat2 = wabot_conv_load('5492494691266');
caso('y adopta lo que ella ya había dejado allá', wabot_conv_adoptar_hermana($wspNat2, $cfg) === true);
caso('trae la descripción, así no se la vuelve a pedir',
    mb_stripos((string)$wspNat2['descripcion'], 'prendas femeninas') !== false);
caso('trae el tipo y el precio ya dados', ($wspNat2['tipo'] ?? '') === 'ecommerce' && !empty($wspNat2['precio_dado']));
caso('trae lead_creado, que es lo que evita el SEGUNDO lead en Firestore', !empty($wspNat2['lead_creado']));
caso('y trae form_completado_ts', (int)($wspNat2['form_completado_ts'] ?? 0) > 0);
caso('con eso, el formulario ya no se le vuelve a ofrecer', wabot_form_link($wspNat2, $cfg) === '');
caso('la adopción ocurre una sola vez', wabot_conv_adoptar_hermana($wspNat2, $cfg) === false);

/* Y el turno entero, COMO LO HACE EL WEBHOOK: el mensaje entrante ya está en
 * el transcript y ultimo_cliente_ts ya está puesto cuando corre wabot_responder().
 * Sin reproducir ese orden el test miente — la primera versión de la adopción
 * se guardaba por wabot_ultimo_cliente_ts() y pasaba estos tests en verde
 * mientras en producción no se habría disparado nunca. */
$wspTurno = wabot_conv_load('5492494691266');
$msgForm = "Hola! Acabo de completar el formulario de la demo gratis.\n\n\u{FFFD} Nombre: Natalia\n\u{FFFD} Negocio: Secretos Compartidos\n\nQuedo atento/a!";
wabot_conv_transcript($wspTurno, 'cliente', $msgForm);   // webhook.php:243
$wspTurno['ultimo_cliente_ts'] = time();                 // webhook.php:251
$GLOBALS['WABOT_TEST_AGENTE'] = function ($m, &$c, $cf) { return ['EL MODELO NO DEBERIA TOMAR ESTE TURNO']; };
$rTurno = wabot_responder($msgForm, $wspTurno, $cfg);
unset($GLOBALS['WABOT_TEST_AGENTE']);
caso('la adopción corre igual con el mensaje ya escrito por el webhook',
    !empty($wspTurno['hermana_adoptada']));
caso('el aviso del formulario lo contesta el texto oficial, no el modelo',
    is_array($rTurno) && count($rTurno) === 1 && mb_stripos($rTurno[0], 'NO DEBERIA') === false
    && mb_stripos($rTurno[0], 'ya quedó todo anotado') !== false);
caso('y no vuelve a preguntar de qué se trata el negocio',
    mb_stripos($rTurno[0], 'contame') === false && mb_stripos($rTurno[0], 'qué ofrecés') === false);
caso('ni manda otro formulario', mb_stripos($rTurno[0], 'gokywebs.com/form') === false);

@unlink(WABOT_DATA . '/conv/igQATESTNATALIA1.json');
@unlink(WABOT_DATA . '/conv/5492494691266TEST.json');
@unlink(WABOT_DATA . '/conv/5492494691266.json');

/* Dos charlas vacías no se tocan: la adopción es para traer datos, no para
 * fusionar cualquier par de conversaciones del mismo número. */
$vacia1 = wabot_conv_load('5491199887766');
wabot_conv_save($vacia1);
$vacia2 = wabot_conv_load('igQATESTVACIA1');
$vacia2['canal'] = 'instagram'; $vacia2['telefono_wsp'] = '1199887766';
wabot_conv_save($vacia2);
$vacia1b = wabot_conv_load('5491199887766');
caso('sin formulario ni boceto del otro lado, no se adopta nada',
    wabot_conv_adoptar_hermana($vacia1b, $cfg) === false);
@unlink(WABOT_DATA . '/conv/5491199887766.json');
@unlink(WABOT_DATA . '/conv/igQATESTVACIA1.json');

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
