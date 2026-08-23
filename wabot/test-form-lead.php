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

echo "— wabot_form_link() —\n";

$convWsp = ['tel' => '5491122334455', 'channel_user_id' => '5491122334455', 'canal' => 'whatsapp', 'nombre_negocio' => 'Panadería Sur'];
$link = wabot_form_link($convWsp, $cfg);
caso('arma la URL con el teléfono en ?t=', strpos($link, 't=5491122334455') !== false);
caso('y el nombre del negocio en ?neg=', strpos($link, 'neg=') !== false);
caso('nunca se ofrece en Instagram', wabot_form_link(['tel' => 'IG1', 'channel_user_id' => 'IG1', 'canal' => 'instagram'], $cfg) === '');
caso('ni sin teléfono', wabot_form_link(['tel' => '', 'channel_user_id' => '', 'canal' => 'whatsapp'], $cfg) === '');

echo "— wabot_form_lead_procesar(): validación —\n";

caso('rechaza sin teléfono válido',
    wabot_form_lead_procesar(['t' => '123', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => 'X', 'colores' => 'X'], $cfg)['ok'] === false);
caso('rechaza con un campo vacío',
    wabot_form_lead_procesar(['t' => '5493810001001', 'nombre' => '', 'nombre_negocio' => 'X', 'resumen' => 'X', 'colores' => 'X'], $cfg)['ok'] === false);
caso('rechaza un resumen absurdamente largo',
    wabot_form_lead_procesar(['t' => '5493810001002', 'nombre' => 'X', 'nombre_negocio' => 'X', 'resumen' => str_repeat('a', 601), 'colores' => 'X'], $cfg)['ok'] === false);

echo "— wabot_form_lead_procesar(): sin chat previo, el brief refleja lo tipeado —\n";

@unlink(WABOT_DATA . '/conv/5493810002001.json');
$r = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
caso('el envío se acepta', $r['ok'] === true);
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

$r2 = wabot_form_lead_procesar(['t' => '5493810002001', 'nombre' => 'Carla', 'nombre_negocio' => 'Carla Deco',
    'resumen' => 'Vendo objetos de decoración hechos a mano', 'colores' => 'Beige y dorado'], $cfg);
$conv2 = wabot_conv_load('5493810002001');
caso('sigue aceptando el reenvío', $r2['ok'] === true);
caso('no duplica la línea del transcript', count($conv2['transcript']) === 1);
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

echo "— wabot_form_agradecimiento_corresponde() —\n";

function fijarActivo($cfg) { $cfg['activo'] = true; return $cfg; }
$cfgAct = fijarActivo($cfg);
$ahoraF = time();

$reciente = ['form_completado_ts' => $ahoraF - 5 * 60, 'ultimo_cliente_ts' => 0];
caso('recién completado (5 min) no corresponde todavía',
    wabot_form_agradecimiento_corresponde($reciente, $cfgAct, $ahoraF) === false);

$viejoSinRespuesta = ['form_completado_ts' => $ahoraF - 25 * 60, 'ultimo_cliente_ts' => 0];
caso('25 min sin que el cliente escriba nada → corresponde',
    wabot_form_agradecimiento_corresponde($viejoSinRespuesta, $cfgAct, $ahoraF) === true);

$viejoConRespuesta = ['form_completado_ts' => $ahoraF - 25 * 60, 'ultimo_cliente_ts' => $ahoraF - 10 * 60];
caso('pero si el cliente ya escribió algo después de completar el form, no corresponde',
    wabot_form_agradecimiento_corresponde($viejoConRespuesta, $cfgAct, $ahoraF) === false);

$yaEnviado = ['form_completado_ts' => $ahoraF - 25 * 60, 'ultimo_cliente_ts' => 0, 'form_agradecimiento_enviado' => true];
caso('si ya se mandó una vez, no se repite',
    wabot_form_agradecimiento_corresponde($yaEnviado, $cfgAct, $ahoraF) === false);

$pausado = ['form_completado_ts' => $ahoraF - 25 * 60, 'ultimo_cliente_ts' => 0, 'pausado_hasta' => $ahoraF + 3600];
caso('con el bot pausado para esa conversación, no corresponde',
    wabot_form_agradecimiento_corresponde($pausado, $cfgAct, $ahoraF) === false);

$archivado = ['form_completado_ts' => $ahoraF - 25 * 60, 'ultimo_cliente_ts' => 0, 'archivado' => true];
caso('archivada, tampoco',
    wabot_form_agradecimiento_corresponde($archivado, $cfgAct, $ahoraF) === false);

$sinCompletar = ['form_completado_ts' => 0, 'ultimo_cliente_ts' => 0];
caso('sin form_completado_ts no hay nada que agradecer',
    wabot_form_agradecimiento_corresponde($sinCompletar, $cfgAct, $ahoraF) === false);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
