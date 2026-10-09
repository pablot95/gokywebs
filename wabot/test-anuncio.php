<?php
/**
 * El anuncio del que escribe el cliente (9-oct-2026). Pablo: "cuando escribe
 * alguien desde un anuncio, en WhatsApp se ve la imagen del anuncio, ¿por qué
 * en el wabot no?" y "¿el bot puede ver la imagen?". Sin red: la imagen y la
 * IA van por ganchos.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/respuestas-rapidas.php';
require_once __DIR__ . '/push.php';
$cfg = wabot_config_load();

echo "— 1. Lo que trae el referral —\n";
$msg = ['type' => 'text', 'referral' => [
    'source_url' => 'https://fb.me/abc123', 'source_id' => '120219999TEST', 'source_type' => 'ad',
    'headline' => 'Tu tienda online lista en 7 días', 'body' => 'Vendé con Mercado Pago desde tu web.',
    'media_type' => 'image', 'image_url' => 'https://scontent.xx.fbcdn.net/v/t45/ad.jpg', 'ctwa_clid' => 'ARAkLkTEST',
]];
$ref = wabot_wa_referral($msg);
caso('título, texto, link, tipo, imagen y el clic', $ref['anuncio_titular'] === 'Tu tienda online lista en 7 días'
    && $ref['anuncio_cuerpo'] === 'Vendé con Mercado Pago desde tu web.' && $ref['anuncio_link'] === 'https://fb.me/abc123'
    && $ref['anuncio_media_tipo'] === 'image' && $ref['anuncio_imagen_url'] === 'https://scontent.xx.fbcdn.net/v/t45/ad.jpg'
    && $ref['ctwa_clid'] === 'ARAkLkTEST');
$video = wabot_wa_referral(['referral' => ['media_type' => 'video', 'thumbnail_url' => 'https://x.fbcdn.net/t.jpg', 'headline' => 'Video']]);
caso('de un video, la miniatura; sin ctwa_clid igual se muestra', $video['anuncio_imagen_url'] === 'https://x.fbcdn.net/t.jpg' && $video['ctwa_clid'] === '');
caso('sin nada del anuncio no hay referral', wabot_wa_referral(['referral' => ['source_type' => 'ad']]) === null
    && wabot_wa_referral(['type' => 'text']) === null);

echo "— 2. La imagen solo se baja de Meta —\n";
$pedidas = [];
$GLOBALS['WABOT_TEST_ANUNCIO_IMAGEN'] = function ($url) use (&$pedidas) { $pedidas[] = $url; return [200, 'image/jpeg', 'JPEGBYTES']; };
foreach (['https://evil.example.com/x.jpg', 'http://scontent.fbcdn.net/x.jpg', 'https://fbcdn.net.evil.com/x.jpg', 'file:///etc/passwd'] as $malo) {
    caso("no la pide de $malo", wabot_anuncio_imagen_guardar('999ANUNCIOTEST', $malo) === null);
}
caso('ninguna de esas llegó a pedirse', $pedidas === []);
$GLOBALS['WABOT_TEST_ANUNCIO_IMAGEN'] = fn($url) => [200, 'text/html', '<html>'];
caso('lo que no es una imagen no se guarda', wabot_anuncio_imagen_guardar('999ANUNCIOTEST', 'https://scontent.fbcdn.net/x.jpg') === null);

echo "— 3. La IA la describe una vez por anuncio —\n";
@unlink(WABOT_DATA . '/anuncios.json');
$llamadas = 0;
$GLOBALS['WABOT_TEST_MEDIA'] = function ($b, $m, $t, $c) use (&$llamadas) {
    $llamadas++;
    return $t === 'anuncio' ? 'El anuncio ofrece una tienda online lista en 7 días.' : null;
};
$d1 = wabot_anuncio_descripcion('120219999TEST', 'JPEGBYTES', 'image/jpeg', 'Tu tienda');
$d2 = wabot_anuncio_descripcion('120219999TEST', 'JPEGBYTES', 'image/jpeg', 'Tu tienda');
caso('una sola llamada y después se reusa', $d1 === 'El anuncio ofrece una tienda online lista en 7 días.' && $d2 === $d1 && $llamadas === 1);
caso('sin la imagen, la de ese anuncio igual sale', wabot_anuncio_descripcion('120219999TEST') === $d1 && wabot_anuncio_descripcion('otroTEST') === '');

echo "— 4. Del webhook al panel y al bot —\n";
$src = (string)file_get_contents(__DIR__ . '/webhook.php');
$desde = strpos($src, 'function wabot_conv_identidad_entrante');
$hasta = strpos($src, '/* ── Instagram: otro formato');
eval(substr($src, $desde, $hasta - $desde));
$cfg['activo'] = true;
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;
$GLOBALS['WABOT_TEST_ANUNCIO_IMAGEN'] = fn($url) => [200, 'image/jpeg', 'JPEGBYTES'];
$tel = '5491100000077TEST';
@unlink(wabot_conv_path($tel)); @unlink(wabot_cola_path($tel)); @unlink(wabot_historial_path($tel));
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
wabot_procesar_entrante(['channel_user_id' => $tel, 'conversation_key' => $tel, 'id' => uniqid('wamid.anuncio'),
    'canal' => 'whatsapp', 'texto' => 'Hola, quiero más info', 'nombre' => 'Ana', 'media' => null,
    'referral' => $ref], $cfg);
$cv = wabot_conv_load($tel);
$fila = null;
foreach ($cv['transcript'] as $l) if (($l['q'] ?? '') === 'cliente') { $fila = $l; break; }
caso('el mensaje del cliente lleva su anuncio', ($fila['t'] ?? '') === 'Hola, quiero más info'
    && ($fila['anuncio']['titular'] ?? '') === 'Tu tienda online lista en 7 días' && ($fila['anuncio']['link'] ?? '') === 'https://fb.me/abc123',
    json_encode($fila, JSON_UNESCAPED_UNICODE));
$archivo = (string)($fila['anuncio']['imagen'] ?? '');
caso('con la imagen guardada entre sus adjuntos', $archivo !== '' && is_file(WABOT_DATA . '/media/' . $tel . '/' . $archivo));
caso('y lo que el bot ve en ella', ($fila['anuncio']['descripcion'] ?? '') === $d1);
caso('la atribución del anuncio sigue igual', ($cv['ctwa_clid'] ?? '') === 'ARAkLkTEST' && ($cv['anuncio_titular'] ?? '') === 'Tu tienda online lista en 7 días');
caso('la imagen del anuncio no va con las del cliente', !in_array($archivo, array_column(wabot_imagenes_cliente($cv), 'archivo'), true));
$ctx = wabot_anuncio_contexto_texto($cv);
caso('el bot sabe de qué anuncio vino', str_contains($ctx, '«Tu tienda online lista en 7 días»') && str_contains($ctx, 'imagen: El anuncio ofrece'), $ctx);
caso('la IA lo recibe en el estado de la charla', str_contains(wabot_ia_contexto('Hola, quiero más info', $cv, $cfg), 'Escribió desde un anuncio nuestro'));
$posterior = $cv; $posterior['session_started_ts'] = time() + 100;
caso('en una sesión posterior ya no se menciona', wabot_anuncio_contexto_texto($posterior) === '');

$tel2 = '5491100000078TEST';
@unlink(wabot_conv_path($tel2)); @unlink(wabot_cola_path($tel2)); @unlink(wabot_historial_path($tel2));
wabot_procesar_entrante(['channel_user_id' => $tel2, 'conversation_key' => $tel2, 'id' => uniqid('wamid.sin'),
    'canal' => 'whatsapp', 'texto' => 'Hola', 'nombre' => 'Beto', 'media' => null, 'referral' => null], $cfg);
$cv2 = wabot_conv_load($tel2);
caso('sin anuncio, el mensaje queda como siempre', empty($cv2['transcript'][0]['anuncio']) && wabot_anuncio_contexto_texto($cv2) === '');

foreach ([$tel, $tel2] as $t) {
    @unlink(wabot_conv_path($t)); @unlink(wabot_cola_path($t)); @unlink(wabot_historial_path($t));
    foreach (glob(WABOT_DATA . '/media/' . $t . '/*') ?: [] as $f) @unlink($f);
    @rmdir(WABOT_DATA . '/media/' . $t);
}
foreach (glob(WABOT_DATA . '/media/999ANUNCIOTEST/*') ?: [] as $f) @unlink($f);
@rmdir(WABOT_DATA . '/media/999ANUNCIOTEST');
@unlink(WABOT_DATA . '/anuncios.json');
unset($GLOBALS['WABOT_TEST_MEDIA'], $GLOBALS['WABOT_TEST_ANUNCIO_IMAGEN']);
todo_ok();
