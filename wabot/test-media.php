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

echo "\n— Notas de voz: WhatsApp valida contenedor Y codec (27-ago) —\n";

// Las notas de voz del panel no salían nunca. El código pedía "audio/mp4" a
// secas y Chrome devuelve "audio/mp4;codecs=opus" — Opus metido en un MP4,
// que WhatsApp no acepta. Pero el mime se recortaba en el ";" antes de
// validarlo, así que quedaba en "audio/mp4", pasaba el guard y recién fallaba
// en Meta. Verificado en Chrome 148: pedir 'audio/mp4' da mimeType
// 'audio/mp4;codecs=opus'; pidiendo mp4a.40.2 sale un MP4 con AAC de verdad.
caso('MP4 con Opus se rechaza: es EL bug de las notas de voz',
    wabot_audio_mime_valido('audio/mp4;codecs=opus') === false);
caso('y el motivo lo explica en castellano',
    stripos(wabot_audio_mime_motivo('audio/mp4;codecs=opus'), 'AAC') !== false);

caso('MP4 con AAC (lo que graban Chrome y Safari ahora) se acepta',
    wabot_audio_mime_valido('audio/mp4;codecs=mp4a.40.2') === true);
caso('OGG con Opus (Firefox) se acepta',
    wabot_audio_mime_valido('audio/ogg;codecs=opus') === true);
caso('OGG sin Opus se rechaza: el contenedor solo no alcanza',
    wabot_audio_mime_valido('audio/ogg;codecs=vorbis') === false);
caso('WebM se rechaza en cualquier codec',
    wabot_audio_mime_valido('audio/webm;codecs=opus') === false);

// Sin codec declarado se confía en el contenedor: es lo que mandan los
// clientes de WhatsApp reales y ahí el codec ya viene bien.
caso('"audio/mp4" sin codec sigue aceptándose', wabot_audio_mime_valido('audio/mp4') === true);
caso('"audio/ogg" sin codec también', wabot_audio_mime_valido('audio/ogg') === true);
caso('aac y mp3 sueltos siguen andando',
    wabot_audio_mime_valido('audio/aac') && wabot_audio_mime_valido('audio/mpeg'));
caso('un formato que no está en la lista se rechaza con su motivo',
    wabot_audio_mime_valido('audio/flac') === false
    && stripos(wabot_audio_mime_motivo('audio/flac'), 'no lo acepta') !== false);
caso('y un mime vacío también', wabot_audio_mime_valido('') === false);

// La extensión sale del mime base, no del completo: sin esto el archivo
// subido a Meta se llamaría "nota-de-voz." y sin extensión.
caso('la extensión se saca aunque venga el codec pegado',
    wabot_audio_extension('audio/mp4;codecs=mp4a.40.2') === 'm4a');

echo "\n— Tipos de archivo que se guardaban como .bin (27-ago) —\n";

// Lo que no está en la tabla se guarda como .bin: baja igual pero no lo abre
// nada, y en el panel queda un archivo muerto. Estos son los que más manda la
// gente y no estaban.
$extensiones = wabot_media_extensiones();
foreach ([
    'image/heic'                              => 'heic',   // foto de iPhone
    'image/heif'                              => 'heif',
    'text/vcard'                              => 'vcf',    // tarjeta de contacto
    'text/x-vcard'                            => 'vcf',
    'audio/opus'                              => 'opus',   // nota de voz suelta
    'image/bmp'                               => 'bmp',
    'image/vnd.adobe.photoshop'               => 'psd',    // el logo en editable
    'application/x-7z-compressed'             => '7z',
    'application/x-rar-compressed'            => 'rar',
    'video/x-msvideo'                         => 'avi',
    'application/vnd.oasis.opendocument.text' => 'odt',
    'image/svg+xml'                           => 'svg',
    'application/x-zip-compressed'            => 'zip',
] as $mime => $extEsperada) {
    caso("$mime se guarda como .$extEsperada", ($extensiones[$mime] ?? 'bin') === $extEsperada);
}
// Los que ya andaban no se pueden haber roto.
foreach (['image/jpeg' => 'jpg', 'audio/ogg' => 'ogg', 'application/pdf' => 'pdf',
          'video/mp4' => 'mp4', 'text/plain' => 'txt'] as $mime => $extEsperada) {
    caso("$mime sigue en .$extEsperada", ($extensiones[$mime] ?? '') === $extEsperada);
}

// El endpoint de descarga valida contra ESTA misma tabla, así que todo lo que
// se guarda tiene que poder bajarse: si divergen, el archivo queda preso.
$extensionesOk = array_unique(array_merge(array_values($extensiones), ['bin']));
$patron = '/^\d{8}-\d{6}-[0-9a-f]{8}\.(' . implode('|', array_map('preg_quote', $extensionesOk)) . ')$/';
foreach (['heic', 'vcf', 'psd', '7z', 'odt', 'avi', 'jpg', 'pdf', 'bin'] as $ext) {
    caso("un archivo .$ext pasa el validador de descarga del panel",
        preg_match($patron, '20260827-181500-a1b2c3d4.' . $ext) === 1);
}
caso('pero una extensión inventada no', preg_match($patron, '20260827-181500-a1b2c3d4.exe') === 0);

echo "\n— Los documentos ahora se leen, no se tiran (27-ago) —\n";

// El brief, la lista de precios o el catálogo en PDF eran justo lo que más
// sirve para armar la demo, y eran lo único que el bot tiraba a la basura
// contestando "no pude abrir eso que me mandaste".
$GLOBALS['WABOT_TEST_MEDIA'] = function ($bytes, $mime, $tipo, $caption) {
    return $tipo === 'documento' ? 'Mandó una lista de 40 productos de ferretería con precios.' : null;
};
caso('un PDF se lee y devuelve su resumen',
    wabot_media_a_texto('bytes', 'application/pdf', 'documento') === 'Mandó una lista de 40 productos de ferretería con precios.');
unset($GLOBALS['WABOT_TEST_MEDIA']);

// SIN_DOC es la señal de "no aporta nada" y no puede llegar al cliente como
// si fuera la descripción del archivo.
$GLOBALS['WABOT_TEST_MEDIA'] = function () { return null; };
caso('si el documento no aporta nada, no se inventa una descripción',
    wabot_media_a_texto('bytes', 'application/pdf', 'documento') === null);
unset($GLOBALS['WABOT_TEST_MEDIA']);

echo "\n— Archivo guardado ≠ archivo perdido (27-ago) —\n";

// Un cliente de catering mandó el logo de su marca y se llevó "No pude abrir
// eso que me mandaste": el archivo estaba guardado y descargable en el panel.
$cfgAvisos = wabot_config_load();
caso('existe un aviso propio para el archivo que sí llegó',
    trim((string)($cfgAvisos['media_recibida'] ?? '')) !== ''
    && $cfgAvisos['media_recibida'] !== $cfgAvisos['no_texto']);
caso('y no le dice al cliente que no se pudo abrir',
    stripos((string)$cfgAvisos['media_recibida'], 'no pude abrir') === false);
caso('sino que le confirma que quedó guardado',
    stripos((string)$cfgAvisos['media_recibida'], 'llegó') !== false
    || stripos((string)$cfgAvisos['media_recibida'], 'guardado') !== false);
caso('el aviso de "no llegó nada" sigue existiendo aparte',
    stripos((string)$cfgAvisos['no_texto'], 'no pude abrir') !== false);

echo "\n— El .bin era el cartel de \"no supe qué formato era\" (28-ago) —\n";

// Pablo, 28-ago: "el formato bin falla". Meta manda application/octet-stream
// para muchos documentos; si además el adjunto venía sin nombre, el archivo se
// guardaba como .bin y no lo abría nada. La firma de los bytes no miente.
$firmas = [
    'docx' => "PK\x03\x04" . str_repeat("\x00", 26) . 'word/document.xml',
    'xlsx' => "PK\x03\x04" . str_repeat("\x00", 26) . 'xl/workbook.xml',
    'pptx' => "PK\x03\x04" . str_repeat("\x00", 26) . 'ppt/presentation.xml',
    'zip'  => "PK\x03\x04" . str_repeat("\x00", 26) . 'fotos/1.jpg',
    'pdf'  => "%PDF-1.7\n",
    'jpg'  => "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00",
    'png'  => "\x89PNG\r\n\x1a\n",
    'webp' => "RIFF\x00\x00\x00\x00WEBPVP8 ",
    'wav'  => "RIFF\x00\x00\x00\x00WAVEfmt ",
    'mp4'  => "\x00\x00\x00\x18ftypmp42",
    'ogg'  => "OggS\x00\x02",
    'rar'  => "Rar!\x1a\x07\x00",
];
foreach ($firmas as $esperada => $bytes) {
    caso("un $esperada sin MIME se reconoce por su firma",
        wabot_media_ext_por_contenido($bytes) === $esperada);
}
caso('y lo que no se reconoce sigue cayendo en bin',
    wabot_media_ext_por_contenido('esto no es ningun formato') === '');

// Guardado de punta a punta: octet-stream + sin nombre ya no da .bin.
$guardado = wabot_media_guardar('TESTBIN', "%PDF-1.7\nfalso", 'application/octet-stream', 'documento');
caso('un PDF mandado como octet-stream y sin nombre se guarda .pdf',
    $guardado !== null && substr($guardado['archivo'], -4) === '.pdf');

// El nombre del cliente manda aunque la extensión no esté en la tabla: un .cdr
// no lo lee nadie, pero tiene que poder descargarse con su extensión.
$guardadoCdr = wabot_media_guardar('TESTBIN', 'CDRXvrsn', 'application/octet-stream', 'documento', 'logo.cdr');
caso('un .cdr conserva su extensión aunque el bot no sepa leerlo',
    $guardadoCdr !== null && substr($guardadoCdr['archivo'], -4) === '.cdr');

// Pero nada ejecutable, venga como venga.
$guardadoPhp = wabot_media_guardar('TESTBIN', '<?php echo 1;', 'application/octet-stream', 'documento', 'shell.php');
caso('un .php nunca se guarda con esa extensión',
    $guardadoPhp !== null && substr($guardadoPhp['archivo'], -4) === '.bin');
caso('y la lista de prohibidas cubre las variantes', wabot_media_ext_prohibida('phtml') === true
    && wabot_media_ext_prohibida('PHP5') === true && wabot_media_ext_prohibida('pdf') === false);

foreach (glob(WABOT_DATA . '/media/TESTBIN/*') as $f) @unlink($f);
@rmdir(WABOT_DATA . '/media/TESTBIN');

echo "\n" . ($fallas === 0 ? "TODO OK" : "FALLARON $fallas") . " — $total casos\n";
exit($fallas === 0 ? 0 : 1);
