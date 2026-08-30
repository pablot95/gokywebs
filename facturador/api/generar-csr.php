<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    facturador_responder(['ok' => false, 'error' => 'Método no permitido'], 405);
}

$dir = facturador_dir_tenant($uid);
$config = facturador_leer_config_tenant($uid);
if (!$config) {
    facturador_responder(['ok' => false, 'error' => 'Guardá primero los datos de tu empresa.'], 400);
}

$keyPath = $dir . '/cert.key';
$certPath = $dir . '/cert.crt';

$entrada = json_decode(file_get_contents('php://input'), true);
$confirmarRegenerar = is_array($entrada) && !empty($entrada['confirmarRegenerar']);

if (is_readable($keyPath) && !$confirmarRegenerar) {
    facturador_responder([
        'ok' => false,
        'yaExiste' => true,
        'error' => 'Ya generaste una clave. Si generás una nueva vas a tener que volver a subirla a ARCA y subir el certificado de nuevo acá.',
    ], 409);
}

$dn = [
    'countryName' => 'AR',
    'organizationName' => $config['emisor']['razonSocial'],
    'commonName' => $config['alias'],
    'serialNumber' => 'CUIT ' . $config['cuit'],
];

$opciones = [
    'private_key_bits' => 2048,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
    'digest_alg' => 'sha256',
    'config' => __DIR__ . '/lib/openssl.cnf',
];

$clave = openssl_pkey_new($opciones);
if (!$clave) {
    facturador_responder(['ok' => false, 'error' => 'No se pudo generar la clave: ' . openssl_error_string()], 500);
}

$csr = openssl_csr_new($dn, $clave, $opciones);
if (!$csr) {
    facturador_responder(['ok' => false, 'error' => 'No se pudo generar el certificado: ' . openssl_error_string()], 500);
}

openssl_pkey_export($clave, $claveExportada, null, $opciones);
openssl_csr_export($csr, $csrExportado);

if (file_put_contents($keyPath, $claveExportada, LOCK_EX) === false) {
    facturador_responder(['ok' => false, 'error' => 'No se pudo guardar la clave generada.'], 500);
}
@chmod($keyPath, 0600);

// La clave cambió: cualquier certificado ya subido para la clave anterior quedó
// invalido, así que hay que volver a subirlo (avisado en la respuesta 409 de arriba).
if ($confirmarRegenerar && is_readable($certPath)) {
    @unlink($certPath);
}

header('Content-Type: application/pkcs10');
header('Content-Disposition: attachment; filename="facturador-' . preg_replace('/[^A-Za-z0-9_-]/', '', $config['alias']) . '.csr"');
header('Content-Length: ' . strlen($csrExportado));
echo $csrExportado;
