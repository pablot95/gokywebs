<?php
/**
 * Enviar imágenes desde el panel (Pablo, 13-oct-2026). Sin red: el cuerpo del mensaje de WhatsApp,
 * el tipo de imagen según los bytes y que el envío con epígrafe pase por el camino de prueba.
 */
require_once __DIR__ . '/test-lib.php';

echo "Tipo de imagen por los bytes\n";
caso('un JPEG', wabot_imagen_mime("\xFF\xD8\xFF\xE0" . str_repeat("\0", 20)) === 'image/jpeg');
caso('un PNG', wabot_imagen_mime("\x89PNG\r\n\x1A\n" . str_repeat("\0", 20)) === 'image/png');
caso('un WebP no (WhatsApp no lo acepta como imagen)', wabot_imagen_mime('RIFF....WEBPVP8 ') === '');
caso('un GIF no', wabot_imagen_mime('GIF89a......') === '');
caso('un texto cualquiera no', wabot_imagen_mime('hola') === '');
caso('vacío no', wabot_imagen_mime('') === '');

echo "Cuerpo del mensaje\n";
$sin = wabot_wa_image_body('5491112345678', 'MEDIA1');
caso('sin texto: solo el id', $sin['type'] === 'image' && $sin['image'] === ['id' => 'MEDIA1'] && !isset($sin['image']['caption']));
$con = wabot_wa_image_body('5491112345678', 'MEDIA1', "  Mirá cómo quedó  ");
caso('con texto: va como epígrafe, sin espacios sobrantes', ($con['image']['caption'] ?? '') === 'Mirá cómo quedó');
$largo = wabot_wa_image_body('5491112345678', 'MEDIA1', str_repeat('á', 1500));
caso('el epígrafe se corta a 1024 caracteres', mb_strlen($largo['image']['caption']) === 1024);
$solo = wabot_wa_image_body('5491112345678', 'MEDIA1', '   ');
caso('un epígrafe de puros espacios no se manda', !isset($solo['image']['caption']));

echo "Envío (sin red)\n";
$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$GLOBALS['WABOT_TEST_ENVIADOS'] = [];
$id = wabot_wa_media_subir("\xFF\xD8\xFF\xE0datos", 'image/jpeg', 'imagen.jpg');
caso('sube la imagen como media y devuelve un id', $id === 'TESTMEDIAID');
caso('manda la imagen con su texto', wabot_wa_send_image('5491112345678', $id, 'Hola') === true
    && end($GLOBALS['WABOT_TEST_ENVIADOS']) === ['5491112345678', '[imagen] Hola']);
caso('el envío de la imagen del precio (sin texto) sigue igual',
    wabot_wa_send_image('5491112345678', $id) === true && end($GLOBALS['WABOT_TEST_ENVIADOS']) === ['5491112345678', '[imagen]']);

echo "El panel\n";
$admin = (string)file_get_contents(__DIR__ . '/admin.php');
caso('tiene la acción y el botón para adjuntar',
    strpos($admin, "\$a === 'responder_imagen'") !== false && strpos($admin, 'id="respAdjuntar"') !== false
    && strpos($admin, "fd.append('accion', 'responder_imagen')") !== false);
caso('Instagram no lleva el botón (no hay envío de imágenes por ahí)',
    preg_match("/canal\(\\\$conv\) !== 'instagram'\): \?>\s*<button id=\"respAdjuntar\"/", $admin) === 1);

todo_ok();
