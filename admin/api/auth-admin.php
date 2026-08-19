<?php

define('FIREBASE_API_KEY', 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ');
define('ADMIN_EMAIL', 'pablo.travi95@gmail.com');

function verifyAdminToken()
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization']
        ?? $headers['authorization']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) return false;

    $ch = curl_init('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . FIREBASE_API_KEY);
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
    if ($code !== 200 || !$user) return false;

    return strtolower($user['email'] ?? '') === strtolower(ADMIN_EMAIL);
}
