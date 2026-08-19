<?php
// Verifica el ID token de Firebase Auth contra Google (accounts:lookup) y
// que el email sea el admin real. NUNCA decodificar el JWT localmente sin
// chequear la firma: cualquiera arma un payload con los mismos campos
// (aud/iss/exp) sin loguearse nunca, y el decode local lo aceptaría igual.
define('FIREBASE_API_KEY', 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ');
define('ADMIN_EMAIL', 'pablo.travi95@gmail.com');

function verifyAdminToken() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization']
         ?? $headers['authorization']
         ?? $_SERVER['HTTP_AUTHORIZATION']
         ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
         ?? '';
    if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) return false;
    $idToken = trim($m[1]);

    $ch = curl_init('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . FIREBASE_API_KEY);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['idToken' => $idToken]),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 8,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $user = json_decode($res, true)['users'][0] ?? null;
    if ($code !== 200 || !$user) return false;

    return strtolower($user['email'] ?? '') === strtolower(ADMIN_EMAIL);
}

if (!verifyAdminToken()) {
    http_response_code(401);
    exit('No autorizado');
}

$file = isset($_GET['file']) ? $_GET['file'] : '';
$nombre = isset($_GET['nombre']) ? $_GET['nombre'] : 'logo';

$file = ltrim($file, '/');
$file = str_replace(['..', '\\', "\0"], '', $file);

if (!preg_match('/^form\/logos\/[a-zA-Z0-9_\-\.]+$/', $file)) {
    http_response_code(400);
    exit('Archivo no válido');
}

$path = __DIR__ . '/../' . $file;

if (!file_exists($path) || !is_file($path)) {
    http_response_code(404);
    exit('Archivo no encontrado');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($path) ?: 'application/octet-stream';

$safeName = preg_replace('/[^a-zA-Z0-9._\-]/', '_', $nombre);

header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . $safeName . '"');
header('Content-Length: ' . filesize($path));
header('Cache-Control: no-cache');

readfile($path);
exit;
