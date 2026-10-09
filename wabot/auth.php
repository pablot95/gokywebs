<?php
/**
 * wabot/auth.php — abre la sesión del panel del bot usando el login de Firebase
 * que ya hizo Pablo en admin/dashboard.html, para no pedir una segunda clave.
 *
 * Mismo criterio que admin/download-logo.php: el ID token se verifica CONTRA
 * GOOGLE (accounts:lookup), nunca decodificándolo acá. Un JWT decodificado sin
 * chequear la firma lo puede fabricar cualquiera con los campos correctos.
 */

require_once __DIR__ . '/sesion.php';

define('WABOT_FIREBASE_ADMIN_EMAIL', 'pablo.travi95@gmail.com');

wabot_sesion_iniciar();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'metodo']);
    exit;
}

// El admin pide este handshake cada 30 s: si la sesión sigue abierta no se
// toca. Renovar el id acá borraba el viejo y tiraba los pedidos del iframe
// que estaban en vuelo (ver sesion.php).
if (!empty($_SESSION['wabot'])) {
    $_SESSION['wabot_embed'] = true;
    echo json_encode(['ok' => true]);
    exit;
}

$idToken = trim((string)($_POST['id_token'] ?? ''));
if ($idToken === '') {
    http_response_code(400);
    echo json_encode(['error' => 'sin token']);
    exit;
}

$ch = curl_init('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . WABOT_FIREBASE_API_KEY);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['idToken' => $idToken]),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 10,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$user = json_decode((string)$res, true)['users'][0] ?? null;

if ($code !== 200 || !$user || strtolower($user['email'] ?? '') !== strtolower(WABOT_FIREBASE_ADMIN_EMAIL)) {
    wabot_log('auth_rechazada', ['http' => $code, 'email' => $user['email'] ?? '']);
    http_response_code(401);
    echo json_encode(['error' => 'no autorizado']);
    exit;
}

// El id de sesión se renueva al entrar: si alguien logró fijar uno antes del
// login (un link con el id, una sesión vieja compartida), acá deja de servir.
session_regenerate_id(true);

$_SESSION['wabot']       = true;
$_SESSION['wabot_embed'] = true;

echo json_encode(['ok' => true]);
