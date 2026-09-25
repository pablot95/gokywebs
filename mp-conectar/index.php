<?php
declare(strict_types=1);

/*
 * Puente único de "Conectar con Mercado Pago" para todas las tiendas Gokywebs.
 *
 * La aplicación de Mercado Pago de Gokywebs tiene registrada UNA sola URL de
 * redireccionamiento: https://gokywebs.com/mp-conectar/. Mercado Pago vuelve siempre
 * acá con ?code&state, y este puente reenvía a la tienda que inició la conexión
 * (https://<tienda>/api/mp-conectar.php), que canjea el código por sus claves.
 *
 * El state lo arma la tienda: base64url(host) . "." . nonce . "." . firma, donde la
 * firma es HMAC-SHA256 con el Client Secret. Solo las tiendas que tienen el secret
 * (vienen del template) pueden firmarlo, así que nadie puede usar la aplicación de
 * Gokywebs para mandarse a su propio sitio el código de la cuenta de otra persona.
 * Ver api/lib/mercadopago-oauth.php en Template-Ecommerce / Template-Cursos.
 */

header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex');

function fallar(string $mensaje): never {
    http_response_code(400);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conectar con Mercado Pago</title>'
        . '<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 16px;line-height:1.5">'
        . '<h1 style="font-size:1.3rem">No se pudo completar la conexión</h1><p>' . htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8') . '</p>'
        . '<p>Volvé al panel de tu tienda y tocá de nuevo «Conectar con Mercado Pago».</p></body>';
    exit;
}

$configFile = dirname(__DIR__) . '/config/mp-oauth-config.php';
if (is_file($configFile)) require $configFile;
$secret = defined('MP_OAUTH_CLIENT_SECRET') ? (string)MP_OAUTH_CLIENT_SECRET : '';
if ($secret === '' || str_contains($secret, 'CHANGE_ME')) fallar('La conexión con Mercado Pago todavía no está habilitada.');

$state = (string)($_GET['state'] ?? '');
$partes = explode('.', $state);
if (count($partes) !== 3) fallar('El enlace de vuelta de Mercado Pago está incompleto.');
[$hostB64, $nonce, $firma] = $partes;
$esperada = rtrim(strtr(base64_encode(hash_hmac('sha256', $hostB64 . '.' . $nonce, $secret, true)), '+/', '-_'), '=');
if (!hash_equals($esperada, $firma)) fallar('El enlace de vuelta de Mercado Pago no es válido.');

$host = strtolower((string)base64_decode(strtr($hostB64, '-_', '+/'), true));
if (!preg_match('/^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/', $host)) fallar('La tienda de destino no es válida.');

// Solo se reenvía lo que manda Mercado Pago; la tienda valida el state contra su cookie.
$query = array_filter([
    'code' => (string)($_GET['code'] ?? ''),
    'state' => $state,
    'error' => (string)($_GET['error'] ?? ''),
], static fn(string $value): bool => $value !== '');
header('Location: https://' . $host . '/api/mp-conectar.php?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986), true, 303);
exit;
