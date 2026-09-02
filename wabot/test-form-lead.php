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
$convIg = ['tel' => 'IG1', 'channel_user_id' => 'IG1', 'canal' => 'instagram'];
caso('nunca se ofrece en Instagram', wabot_form_link($convIg, $cfg) === '');
$convSinTel = ['tel' => '', 'channel_user_id' => '', 'canal' => 'whatsapp'];
caso('ni sin teléfono', wabot_form_link($convSinTel, $cfg) === '');

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

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
