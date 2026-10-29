<?php
/**
 * Las imágenes que mandó un cliente, en un .zip, para que la PC de Pablo las
 * baje sola cuando entra un prospecto (29-oct, tools/demo-auto/bajar-imagenes.php).
 *
 * No hay sesión del panel: la llamada va firmada. La firma es un HMAC de la
 * clave de la charla con la private_key de la cuenta de servicio, que ya
 * tienen el server y la PC (config/service-account.json) y no sale de ahí, así
 * que no hay un secreto nuevo que guardar. Misma lista y mismos nombres que el
 * botón «Imágenes» del admin (wabot_imagenes_cliente / wabot_imagenes_nombres):
 * "logo" solo si el cliente lo dijo.
 *
 *   imagenes-bajar.php?tel=<clave>&firma=<hmac>
 */
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

function imagenes_bajar_firma(string $clave): string {
    $sa = wabot_push_cuenta();
    return $sa ? hash_hmac('sha256', 'imagenes-bajar|' . $clave, (string)$sa['private_key']) : '';
}

if (PHP_SAPI === 'cli') return;   // los tests y la PC solo usan imagenes_bajar_firma()

$clave = preg_replace('/[^0-9A-Za-z]/', '', (string)($_GET['tel'] ?? ''));
$firma = (string)($_GET['firma'] ?? '');
$esperada = $clave !== '' ? imagenes_bajar_firma($clave) : '';
if ($esperada === '' || !hash_equals($esperada, $firma)) {
    http_response_code(403);
    exit('firma invalida');
}
if (!wabot_conv_existe($clave)) {
    http_response_code(404);
    exit('conversacion invalida');
}
$imagenes = wabot_imagenes_cliente(wabot_conv_load($clave));
if (!$imagenes) {
    http_response_code(404);
    exit('sin imagenes');
}
$nombres = wabot_imagenes_nombres($imagenes);
$entradas = [];
foreach ($imagenes as $i => $img) {
    $entradas[] = ['nombre' => $nombres[$i], 'ruta' => WABOT_DATA . '/media/' . $clave . '/' . $img['archivo']];
}
$zip = wabot_zip_armar($entradas);
if ($zip === null) {
    http_response_code(404);
    exit('no se pudo leer ninguna imagen');
}
header('Content-Type: application/zip');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . strlen($zip));
header('Cache-Control: private, max-age=0, no-store');
echo $zip;
