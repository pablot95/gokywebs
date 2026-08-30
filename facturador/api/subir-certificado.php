<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    facturador_responder(['ok' => false, 'error' => 'Método no permitido'], 405);
}

$dir = facturador_dir_tenant($uid);
$keyPath = $dir . '/cert.key';
$certPath = $dir . '/cert.crt';

if (!is_readable($keyPath)) {
    facturador_responder(['ok' => false, 'error' => 'Primero generá el certificado desde el paso anterior.'], 400);
}

$archivo = $_FILES['certificado'] ?? null;
if (!$archivo || ($archivo['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
    facturador_responder(['ok' => false, 'error' => 'Elegí el archivo .crt que descargaste de ARCA.'], 400);
}
if ($archivo['error'] !== UPLOAD_ERR_OK) {
    facturador_responder(['ok' => false, 'error' => 'Falló la subida del archivo (código ' . $archivo['error'] . ').'], 400);
}
if ($archivo['size'] <= 0 || $archivo['size'] > 32 * 1024) {
    facturador_responder(['ok' => false, 'error' => 'El archivo no parece un certificado (tamaño inesperado).'], 400);
}

$contenido = file_get_contents($archivo['tmp_name']);
$x509 = openssl_x509_read($contenido);
if (!$x509 || !openssl_x509_parse($x509)) {
    facturador_responder(['ok' => false, 'error' => 'Ese archivo no es un certificado válido.'], 400);
}

$clave = file_get_contents($keyPath);
if (!openssl_x509_check_private_key($x509, $clave)) {
    facturador_responder([
        'ok' => false,
        'error' => 'Este certificado no corresponde a la clave que generaste acá. Volvé a generar el CSR (paso anterior) y repetí la carga en ARCA con ese archivo nuevo.',
    ], 400);
}

if (file_put_contents($certPath, $contenido, LOCK_EX) === false) {
    facturador_responder(['ok' => false, 'error' => 'No se pudo guardar el certificado.'], 500);
}
@chmod($certPath, 0600);

facturador_responder(['ok' => true, 'configurado' => true, 'certListo' => true]);
