<?php

require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/tenant.php';
require __DIR__ . '/../../config/arca/receptor.php';

$uid = facturador_verificar_usuario();
if (!$uid) facturador_responder(['ok' => false, 'error' => 'No autorizado'], 401);

$dir = facturador_dir_tenant($uid);

// Condiciones frente al IVA que puede declarar el emisor: de esto depende que
// tipos de comprobante le ofrece despues el panel (Monotributo/Exento -> C,
// Responsable Inscripto -> A/B).
const FACTURADOR_CONDICIONES_EMISOR = ['Responsable Monotributo', 'Responsable Inscripto', 'IVA Exento'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $config = facturador_leer_config_tenant($uid);
    if (!$config) {
        facturador_responder(['ok' => true, 'configurado' => false]);
    }
    facturador_responder([
        'ok' => true,
        'configurado' => true,
        'certListo' => facturador_certificado_listo($uid),
        'claveGenerada' => is_readable(facturador_key_path($uid)),
        'config' => [
            'cuit' => $config['cuit'],
            'puntoVenta' => $config['puntoVenta'],
            'alias' => $config['alias'],
            'emisor' => $config['emisor'],
        ],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    facturador_responder(['ok' => false, 'error' => 'Método no permitido'], 405);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) facturador_responder(['ok' => false, 'error' => 'Cuerpo inválido'], 400);

$cuit = preg_replace('/\D/', '', (string) ($entrada['cuit'] ?? ''));
if (!receptor_cuit_valido($cuit)) {
    facturador_responder(['ok' => false, 'error' => 'El CUIT no es válido: revisá los 11 números.'], 400);
}

$puntoVenta = (int) ($entrada['puntoVenta'] ?? 0);
if ($puntoVenta <= 0) {
    facturador_responder(['ok' => false, 'error' => 'El punto de venta tiene que ser un número mayor a cero.'], 400);
}

$alias = trim((string) ($entrada['alias'] ?? ''));
if ($alias === '' || !preg_match('/^[A-Za-z0-9_-]{3,40}$/', $alias)) {
    facturador_responder(['ok' => false, 'error' => 'El alias tiene que tener entre 3 y 40 caracteres (letras, números, guiones).'], 400);
}

$condicionIva = trim((string) ($entrada['condicionIva'] ?? ''));
if (!in_array($condicionIva, FACTURADOR_CONDICIONES_EMISOR, true)) {
    facturador_responder(['ok' => false, 'error' => 'Elegí tu condición frente al IVA.'], 400);
}

$razonSocial = trim((string) ($entrada['razonSocial'] ?? ''));
if ($razonSocial === '') {
    facturador_responder(['ok' => false, 'error' => 'Falta la razón social.'], 400);
}

$domicilio = trim((string) ($entrada['domicilio'] ?? ''));
if ($domicilio === '') {
    facturador_responder(['ok' => false, 'error' => 'Falta el domicilio fiscal.'], 400);
}

$inicioActividades = trim((string) ($entrada['inicioActividades'] ?? ''));
$ingresosBrutos = trim((string) ($entrada['ingresosBrutos'] ?? ''));

// El certificado/clave ya generados quedan intactos: cambiar estos datos no los toca.
$config = [
    'cuit' => $cuit,
    'puntoVenta' => $puntoVenta,
    'alias' => $alias,
    'emisor' => [
        'razonSocial' => mb_substr($razonSocial, 0, 120),
        'domicilio' => mb_substr($domicilio, 0, 120),
        'condicionIva' => $condicionIva,
        'inicioActividades' => mb_substr($inicioActividades, 0, 20),
        'ingresosBrutos' => mb_substr($ingresosBrutos, 0, 20),
    ],
];

if (file_put_contents($dir . '/config.json', json_encode($config, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) === false) {
    facturador_responder(['ok' => false, 'error' => 'No se pudo guardar la configuración.'], 500);
}

facturador_responder(['ok' => true, 'configurado' => true, 'certListo' => facturador_certificado_listo($uid)]);
