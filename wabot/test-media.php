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

echo "— Adjuntos que no son foto ni audio (documentos, videos, stickers) —\n";

// El bug: estos tipos caían en el return genérico con ref vacío, y como
// wabot_bajar_media() corta si no hay ref, el archivo NUNCA se bajaba ni se
// guardaba: en el panel quedaba un "[document]" sin nada que descargar.
$doc = wabot_wa_adjunto(['document' => ['id' => 'MEDIA_DOC_1', 'filename' => 'logo-final.pdf',
    'caption' => 'te paso el logo']], 'document');
caso('un documento trae su media id (antes venía vacío)', ($doc['ref'] ?? '') === 'MEDIA_DOC_1');
caso('y se clasifica en español, no como "document"', ($doc['clase'] ?? '') === 'documento');
caso('y conserva el nombre real del archivo', ($doc['nombre'] ?? '') === 'logo-final.pdf');
caso('y el caption del documento', ($doc['caption'] ?? '') === 'te paso el logo');

$vid = wabot_wa_adjunto(['video' => ['id' => 'MEDIA_VID_1', 'caption' => '']], 'video');
caso('un video también trae su media id', ($vid['ref'] ?? '') === 'MEDIA_VID_1' && $vid['clase'] === 'video');

$stk = wabot_wa_adjunto(['sticker' => ['id' => 'MEDIA_STK_1']], 'sticker');
caso('un sticker también', ($stk['ref'] ?? '') === 'MEDIA_STK_1' && $stk['clase'] === 'sticker');

$voz = wabot_wa_adjunto(['voice' => ['id' => 'MEDIA_VOZ_1']], 'voice');
caso('una nota de voz entra como audio, igual que un audio comun',
    ($voz['ref'] ?? '') === 'MEDIA_VOZ_1' && $voz['clase'] === 'audio');

caso('una reacción sigue sin media id, es solo el emoji',
    wabot_wa_adjunto(['reaction' => ['emoji' => '👍']], 'reaction')['ref'] === '');
caso('un mensaje de texto no es adjunto', wabot_wa_adjunto(['text' => ['body' => 'hola']], 'text') === null);

$igFile = wabot_ig_adjunto([['type' => 'file', 'payload' => ['url' => 'https://cdn/x.pdf']]]);
caso('en Instagram un archivo también conserva su URL',
    ($igFile['ref'] ?? '') === 'https://cdn/x.pdf' && $igFile['clase'] === 'documento');
$igVid = wabot_ig_adjunto([['type' => 'video', 'payload' => ['url' => 'https://cdn/x.mp4']]]);
caso('y un video de Instagram también', ($igVid['ref'] ?? '') === 'https://cdn/x.mp4');

echo "— Extensión con la que se guarda cada archivo —\n";

$exts = wabot_media_extensiones();
caso('un PDF se guarda como .pdf, no como .bin', ($exts['application/pdf'] ?? '') === 'pdf');
caso('un mp4 como .mp4', ($exts['video/mp4'] ?? '') === 'mp4');
caso('un docx como .docx',
    ($exts['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] ?? '') === 'docx');

$guardado = wabot_media_guardar('MEDIATEST', 'contenido', 'application/pdf', 'documento', 'presupuesto.pdf');
caso('se guarda con extensión real y conserva el nombre original',
    $guardado !== null && substr($guardado['archivo'], -4) === '.pdf' && $guardado['nombre'] === 'presupuesto.pdf');

// Meta manda octet-stream para muchos documentos: la extensión sale del nombre.
$porNombre = wabot_media_guardar('MEDIATEST', 'contenido', 'application/octet-stream', 'documento', 'planilla.xlsx');
caso('si el mime no dice nada, la extensión sale del nombre del archivo',
    $porNombre !== null && substr($porNombre['archivo'], -5) === '.xlsx');

$desconocido = wabot_media_guardar('MEDIATEST', 'contenido', 'application/x-loquesea', 'documento', 'cosa.raruno');
caso('y si no se reconoce ni por mime ni por nombre, cae en .bin sin romper',
    $desconocido !== null && substr($desconocido['archivo'], -4) === '.bin');

foreach (glob(WABOT_DATA . '/media/MEDIATEST/*') ?: [] as $f) @unlink($f);
@rmdir(WABOT_DATA . '/media/MEDIATEST');

echo "— Atribucion de anuncios: referral y API de conversiones —\n";

// Sin esto el ctwa_clid se perdia en cada mensaje que venia de un anuncio, y
// Meta nunca se enteraba de que el clic habia servido.
$refOk = wabot_wa_referral(['referral' => [
    'ctwa_clid' => 'ARAbc123', 'source_id' => '52543764396818',
    'source_type' => 'ad', 'headline' => 'Hacemos las mejores web',
]]);
caso('se captura el ctwa_clid del anuncio', ($refOk['ctwa_clid'] ?? '') === 'ARAbc123');
caso('y el id del anuncio', ($refOk['anuncio_id'] ?? '') === '52543764396818');
caso('un mensaje sin referral no inventa atribucion', wabot_wa_referral(['text' => ['body' => 'hola']]) === null);
caso('un referral sin ctwa_clid tampoco sirve para atribuir',
    wabot_wa_referral(['referral' => ['source_id' => '123']]) === null);

$cfgCapi = wabot_config_load();
$cfgCapi['capi_dataset_id'] = '1234567890';
$cfgCapi['capi_token'] = 'TOKEN';

$GLOBALS['WABOT_TEST_CAPI'] = [];
$convCapi = ['tel' => 'TESTCAPI1', 'conversation_key' => 'TESTCAPI1', 'canal' => 'whatsapp',
             'ctwa_clid' => 'ARAbc123', 'capi_eventos' => []];
caso('con clic de anuncio y config cargada, se manda el evento',
    wabot_capi_evento($convCapi, 'Lead', $cfgCapi) === true);
caso('y queda anotado para no repetirlo', in_array('Lead', $convCapi['capi_eventos'], true));
caso('el mismo evento NO se manda dos veces (inflaria las conversiones de Meta)',
    wabot_capi_evento($convCapi, 'Lead', $cfgCapi) === false);
caso('pero otro evento distinto si',
    wabot_capi_evento($convCapi, 'Schedule', $cfgCapi) === true);

$convSinClid = ['tel' => 'TESTCAPI2', 'conversation_key' => 'TESTCAPI2', 'canal' => 'whatsapp',
                'ctwa_clid' => '', 'capi_eventos' => []];
caso('quien NO vino de un anuncio no genera evento', wabot_capi_evento($convSinClid, 'Lead', $cfgCapi) === false);

$cfgVacio = wabot_config_load();
$cfgVacio['capi_dataset_id'] = ''; $cfgVacio['capi_token'] = '';
$convInerte = ['tel' => 'TESTCAPI3', 'conversation_key' => 'TESTCAPI3', 'canal' => 'whatsapp',
               'ctwa_clid' => 'ARAbc123', 'capi_eventos' => []];
caso('sin configurar el dataset y el token, queda inerte',
    wabot_capi_evento($convInerte, 'Lead', $cfgVacio) === false);

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
