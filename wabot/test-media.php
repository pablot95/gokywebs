<?php
/**
 * wabot/test-media.php — tests de fotos y audios (solo CLI).
 * Simula lo que devuelve Gemini y verifica que el texto resultante entre bien
 * al motor, sin llamar a la red.
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
function convNueva() {
    return ['tel'=>'MEDIA','fase'=>'nuevo','tipo'=>null,'descripcion'=>null,'colores'=>null,
        'colores_hex'=>null,'referencia'=>null,'espera_avisada'=>false,'no_texto_avisado'=>false,
        'bot_off'=>false,'pausado_hasta'=>0,'lead_creado'=>false,'msgs'=>[],'ultimo_ts'=>0,
        'ultimo_cliente_ts'=>0,'transcript'=>[],'pitch_hecho'=>true];
}

echo "— Conversión de media a texto —\n";

$GLOBALS['WABOT_TEST_MEDIA'] = function ($b, $m, $t, $c = '') {
    return $t === 'audio' ? 'Hola, tengo una panadería y quiero vender online' : 'Mandó el logo de su panadería, en marrón y crema';
};

caso('audio → devuelve la transcripción',
    wabot_media_a_texto('x', 'audio/ogg; codecs=opus', 'audio') === 'Hola, tengo una panadería y quiero vender online');
caso('imagen → devuelve la descripción',
    strpos(wabot_media_a_texto('x', 'image/jpeg', 'imagen'), 'Mandó el logo') === 0);

$GLOBALS['WABOT_TEST_MEDIA'] = function () { return null; };
caso('Gemini no entiende el archivo → null (el bot pide texto)',
    wabot_media_a_texto('x', 'audio/ogg', 'audio') === null);

caso('sin bytes → ni intenta', wabot_media_a_texto('', 'audio/ogg', 'audio') === null);

echo "— El texto del audio entra al motor como un mensaje normal —\n";

$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function ($texto) {
    // El clasificador ve la transcripción, no un marcador de audio.
    if (strpos($texto, 'vender online') !== false) {
        return ['acciones'=>['rubro_ecommerce'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
    }
    return ['acciones'=>['otro'],'info_keys'=>[],'descripcion'=>null,'colores'=>null];
};
$c = convNueva();
$r = wabot_engine('Hola, tengo una panadería y quiero vender online', $c, $cfg);
caso('transcripción de un audio → clasifica y cotiza Ecommerce',
    strpos($r[0], '$290.000') !== false && $c['tipo'] === 'ecommerce');

echo "— Descripción de una foto en el momento del prediseño —\n";

$GLOBALS['WABOT_TEST_CLASIFICADOR'] = function () {
    return ['acciones'=>['datos_prediseno'],'info_keys'=>[],
            'descripcion'=>'Panadería artesanal','colores'=>'marrón y crema'];
};
$c = convNueva(); $c['fase'] = 'prediseno'; $c['tipo'] = 'ecommerce';
$r = wabot_engine('Mandó el logo de su panadería, en marrón y crema', $c, $cfg);
caso('la foto del logo aporta descripción y colores → pide la referencia',
    $r === [$cfg['prediseno_referencia']] && $c['colores'] === 'marrón y crema');

echo "— Interruptores —\n";

caso('leer_imagenes viene prendido por defecto', !empty($cfg['leer_imagenes']));
caso('escuchar_audios viene prendido por defecto', !empty($cfg['escuchar_audios']));

$cfgOff = $cfg; $cfgOff['leer_imagenes'] = false; $cfgOff['escuchar_audios'] = false;
caso('apagados → el webhook ni descarga el archivo',
    empty($cfgOff['leer_imagenes']) && empty($cfgOff['escuchar_audios']));

echo "— Última foto del cliente, para la miniatura de la lista —\n";

$sinFotos = convNueva();
$sinFotos['transcript'] = [
    ['q' => 'cliente', 't' => 'hola'],
    ['q' => 'bot', 't' => 'hola! contame que necesitas'],
];
caso('sin imágenes en el transcript → null', wabot_ultima_foto_cliente($sinFotos) === null);

$conFoto = convNueva();
$conFoto['transcript'] = [
    ['q' => 'cliente', 't' => '[imagen]', 'media' => ['clase' => 'imagen', 'archivo' => '20260101-120000-aaaaaaaa.jpg']],
    ['q' => 'bot', 't' => 'lindo local!'],
    ['q' => 'cliente', 't' => 'gracias'],
];
caso('toma la última imagen que mandó el cliente, no cualquier mensaje',
    wabot_ultima_foto_cliente($conFoto) === '20260101-120000-aaaaaaaa.jpg');

$dosFotos = convNueva();
$dosFotos['transcript'] = [
    ['q' => 'cliente', 't' => '[imagen]', 'media' => ['clase' => 'imagen', 'archivo' => 'vieja.jpg']],
    ['q' => 'cliente', 't' => '[imagen]', 'media' => ['clase' => 'imagen', 'archivo' => 'nueva.jpg']],
];
caso('con varias, es la más reciente', wabot_ultima_foto_cliente($dosFotos) === 'nueva.jpg');

$soloAudio = convNueva();
$soloAudio['transcript'] = [
    ['q' => 'cliente', 't' => '[audio]', 'media' => ['clase' => 'audio', 'archivo' => 'nota.ogg']],
];
caso('un audio del cliente no cuenta como foto', wabot_ultima_foto_cliente($soloAudio) === null);

$fotoDelBot = convNueva();
$fotoDelBot['transcript'] = [
    ['q' => 'bot', 't' => '[imagen]', 'media' => ['clase' => 'imagen', 'archivo' => 'nuestra.jpg']],
];
caso('una imagen que mandó el bot no cuenta como foto del cliente', wabot_ultima_foto_cliente($fotoDelBot) === null);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
