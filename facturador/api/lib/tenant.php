<?php

// Todo lo que necesita cada endpoint para trabajar con la carpeta de datos de UN
// usuario (facturador/data/{uid}/) sin repetir la validacion de path en cada archivo.

// Estos endpoints solo devuelven JSON o un archivo binario: un warning de PHP
// mostrado inline (ej. openssl_x509_read con un archivo invalido) corrompe esa
// respuesta con HTML antes del JSON. Se sigue registrando en el log del server.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

function facturador_responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function facturador_uid_valido($uid)
{
    return is_string($uid) && preg_match('/^[A-Za-z0-9]{1,64}$/', $uid);
}

// Valida el uid contra su charset ANTES de tocar el filesystem y crea la carpeta
// del tenant si es la primera vez que este usuario usa el facturador.
function facturador_dir_tenant($uid)
{
    if (!facturador_uid_valido($uid)) {
        facturador_responder(['ok' => false, 'error' => 'Sesión inválida'], 400);
    }
    $dir = __DIR__ . '/../../data/' . $uid;
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        facturador_responder(['ok' => false, 'error' => 'No se pudo preparar tu carpeta de datos'], 500);
    }
    return $dir;
}

function facturador_config_path($uid) { return facturador_dir_tenant($uid) . '/config.json'; }
function facturador_cert_path($uid) { return facturador_dir_tenant($uid) . '/cert.crt'; }
function facturador_key_path($uid) { return facturador_dir_tenant($uid) . '/cert.key'; }
function facturador_ticket_path($uid) { return facturador_dir_tenant($uid) . '/ticket.json'; }
function facturador_registro_path($uid) { return facturador_dir_tenant($uid) . '/emitidas.json'; }

function facturador_leer_config_tenant($uid)
{
    $path = facturador_config_path($uid);
    if (!is_readable($path)) return null;
    $config = json_decode(file_get_contents($path), true);
    return is_array($config) ? $config : null;
}

function facturador_certificado_listo($uid)
{
    return is_readable(facturador_cert_path($uid)) && is_readable(facturador_key_path($uid));
}

/**
 * Config lista para `new Arca($config)` / `comprobante_pdf($config, $factura)`.
 * Devuelve null si falta terminar de configurar ARCA: sin config.json guardado,
 * o (cuando $requiereCertificado) sin certificado+clave subidos todavia.
 */
function facturador_arca_config($uid, $requiereCertificado = true)
{
    $datos = facturador_leer_config_tenant($uid);
    if (!$datos) return null;
    if ($requiereCertificado && !facturador_certificado_listo($uid)) return null;

    return array_merge($datos, [
        'entorno' => 'produccion',
        'cert' => facturador_cert_path($uid),
        'key' => facturador_key_path($uid),
        'ticket' => facturador_ticket_path($uid),
        'registro' => facturador_registro_path($uid),
    ]);
}
