<?php
/**
 * wabot/produccion.php — lo que la PC de Pablo necesita del server para armar
 * el pedido de producción de un cliente (tools/demo-auto/preparar-produccion.php,
 * 1-nov-2026): los archivos que mandó por el chat (logo y fotos del onboarding)
 * y la marca de que el pedido ya salió.
 *
 * Sin sesión del panel: la llamada va firmada igual que imagenes-bajar.php (un
 * HMAC con la private_key de la cuenta de servicio, que tienen el server y la
 * PC y no sale de ahí).
 *
 *   produccion.php?tel=<clave>&accion=archivos&firma=<hmac>   → .zip con logo-*.ext y foto-N.ext
 *   produccion.php?tel=<clave>&accion=marcar&firma=<hmac>&pedido=<ruta>  → {ok} y deja
 *       produccion.pedido_ts en la charla (la pestaña Clientes pasa a "en producción")
 */
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

function wabot_produccion_firma(string $clave, string $accion): string {
    $sa = wabot_push_cuenta();
    return $sa ? hash_hmac('sha256', 'produccion|' . $accion . '|' . $clave, (string)$sa['private_key']) : '';
}

/**
 * Los archivos del onboarding con un nombre legible: el logo (logo.ext, logo-2.ext…)
 * y las fotos (foto-1.ext…). [['nombre', 'ruta']] con lo que existe en disco.
 */
function wabot_produccion_archivos(array $conv): array {
    $clave = preg_replace('/[^0-9A-Za-z]/', '', (string)($conv['conversation_key'] ?? $conv['tel'] ?? ''));
    $carpeta = WABOT_DATA . '/media/' . $clave . '/';
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    $out = [];
    $agregar = function ($archivos, $prefijo) use (&$out, $carpeta) {
        $i = 0;
        foreach ((array)$archivos as $a) {
            $a = basename((string)$a);
            if ($a === '' || !is_file($carpeta . $a)) continue;
            $i++;
            $ext = strtolower(pathinfo($a, PATHINFO_EXTENSION)) ?: 'bin';
            $out[] = ['nombre' => $prefijo . ($prefijo === 'logo' && $i === 1 ? '' : '-' . $i) . '.' . $ext, 'ruta' => $carpeta . $a];
        }
    };
    $agregar($datos['logo']['valor']['archivos'] ?? [], 'logo');
    $agregar($datos['fotos']['valor']['archivos'] ?? [], 'foto');
    return $out;
}

/** El pedido de producción salió: la etapa pasa a "en producción". */
function wabot_produccion_marcar(array &$conv, int $ts, string $pedido = ''): void {
    $prod = (array)($conv['produccion'] ?? []);
    $prod['pedido_ts'] = $ts;
    if ($pedido !== '') $prod['pedido'] = mb_substr($pedido, 0, 200);
    $conv['produccion'] = $prod;
}

if (PHP_SAPI === 'cli') return;   // la PC y los tests solo usan las funciones

$clave = preg_replace('/[^0-9A-Za-z]/', '', (string)($_GET['tel'] ?? ''));
$accion = (string)($_GET['accion'] ?? '');
$firma = (string)($_GET['firma'] ?? '');
$esperada = ($clave !== '' && in_array($accion, ['archivos', 'marcar'], true)) ? wabot_produccion_firma($clave, $accion) : '';
if ($esperada === '' || !hash_equals($esperada, $firma)) {
    http_response_code(403);
    exit('firma invalida');
}
if (!wabot_conv_existe($clave)) {
    http_response_code(404);
    exit('conversacion invalida');
}

if ($accion === 'marcar') {
    header('Content-Type: application/json; charset=utf-8');
    $lock = wabot_lock_tomar($clave);
    if (!$lock) { http_response_code(409); echo json_encode(['ok' => false, 'error' => 'ocupado']); exit; }
    try {
        $conv = wabot_conv_load($clave);
        wabot_produccion_marcar($conv, time(), (string)($_GET['pedido'] ?? ''));
        wabot_conv_save($conv);
        wabot_log('produccion_pedido', ['clave' => $clave, 'pedido' => mb_substr((string)($_GET['pedido'] ?? ''), 0, 120)]);
    } finally {
        wabot_lock_soltar($lock);
    }
    echo json_encode(['ok' => true, 'clave' => $clave]);
    exit;
}

$entradas = wabot_produccion_archivos(wabot_conv_load($clave));
if (!$entradas) {
    http_response_code(404);
    exit('sin archivos');
}
$zip = wabot_zip_armar($entradas);
if ($zip === null) {
    http_response_code(404);
    exit('no se pudo leer ningun archivo');
}
header('Content-Type: application/zip');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . strlen($zip));
header('Cache-Control: private, max-age=0, no-store');
echo $zip;
