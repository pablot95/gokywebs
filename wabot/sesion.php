<?php
/**
 * wabot/sesion.php — abre la sesión PHP del panel del bot (admin.php y auth.php).
 *
 * El panel "se desconectaba" solo (9-oct) por dos cosas:
 *  - La cookie duraba 30 días, pero los archivos de sesión se borraban con el
 *    gc del servidor (session.gc_maxlifetime, 24 min por defecto y en una
 *    carpeta compartida con otros sitios del hosting).
 *  - auth.php renovaba el id en cada handshake (el admin lo pide cada 30 s) y
 *    borraba el viejo: los pedidos del iframe que iban en vuelo con el id viejo
 *    llegaban sin sesión y el panel caía al login o a "Sin conexión".
 * Acá se fija una vida larga en una carpeta propia; auth.php ya no renueva el
 * id si la sesión sigue abierta.
 */

require_once __DIR__ . '/lib.php';

define('WABOT_SESION_VIDA', 30 * 24 * 3600);

function wabot_sesion_iniciar(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;

    $dir = WABOT_DATA . '/sesiones';
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (is_dir($dir) && !is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    if (is_dir($dir) && is_writable($dir)) {
        session_save_path($dir);
        // Carpeta propia: el gc de otros sitios no la toca, y el nuestro usa esta vida.
        ini_set('session.gc_maxlifetime', (string)WABOT_SESION_VIDA);
        ini_set('session.gc_probability', '1');
        ini_set('session.gc_divisor', '1000');
    }

    session_set_cookie_params([
        'lifetime' => WABOT_SESION_VIDA,
        'path'     => '/',
        // Detrás del proxy de Hostinger $_SERVER['HTTPS'] puede venir vacío aunque
        // el cliente esté en HTTPS: sin esto la cookie de sesión perdía el flag
        // Secure y podía viajar en claro.
        'secure'   => !empty($_SERVER['HTTPS'])
                      || strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}
