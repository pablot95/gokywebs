<?php

// Verificación de sesión del facturador — igual patrón que admin/api/auth-admin.php,
// pero sin lista de emails: cualquier usuario válido del proyecto Firebase del
// facturador pasa, y lo que se devuelve es su uid (no se compara contra nadie).

define('FACTURADOR_FIREBASE_API_KEY', 'AIzaSyBGJYsAnlTPkwXAUdgFwaT8v_iHM5d24YI');

/**
 * @return string|null El uid del usuario si el token es válido, null si no.
 */
function facturador_verificar_usuario()
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization']
        ?? $headers['authorization']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) return null;

    $ch = curl_init('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . FACTURADOR_FIREBASE_API_KEY);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['idToken' => trim($m[1])]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 8,
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $user = json_decode($res, true)['users'][0] ?? null;
    if ($code !== 200 || !$user || empty($user['localId'])) return null;

    return $user['localId'];
}
