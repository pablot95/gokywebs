<?php
/**
 * Las imágenes que el cliente sube en el formulario (2-nov, Pablo: «que puedan
 * agregar imágenes, muchas de una, máximo 20»).
 *
 * El formulario las sube de a una DESPUÉS de que form-lead.php aceptó el envío:
 * así una foto pesada nunca frena el boceto. form-lead.php devuelve `subida`, un
 * permiso firmado para esa charla que vence en 2 horas; sin él no entra nada
 * (cualquiera que sepa un teléfono no puede meterle fotos a otro chat). La firma
 * es un HMAC con la private_key de la cuenta de servicio, como imagenes-bajar.php.
 *
 *   POST multipart: subida, imagen (archivo), n, total
 */
require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

const FORM_IMAGENES_MAX = 20;
const FORM_IMAGENES_BYTES = 15 * 1024 * 1024;
const FORM_IMAGENES_VIGENCIA = 2 * 3600;

function form_imagenes_firma(string $clave, int $vence): string {
    $sa = wabot_push_cuenta();
    return $sa ? hash_hmac('sha256', 'form-imagenes|' . $clave . '|' . $vence, (string)$sa['private_key']) : '';
}

/** El permiso que form-lead.php le devuelve al formulario: "clave.vence.firma", o '' sin cuenta de servicio. */
function form_imagenes_permiso(string $clave, ?int $ahora = null): string {
    $clave = preg_replace('/[^0-9A-Za-z]/', '', $clave);
    $vence = ($ahora ?? time()) + FORM_IMAGENES_VIGENCIA;
    $firma = $clave !== '' ? form_imagenes_firma($clave, $vence) : '';
    return $firma !== '' ? $clave . '.' . $vence . '.' . $firma : '';
}

/** La clave de la charla si el permiso es válido y no venció; null si no. */
function form_imagenes_permiso_clave(string $permiso, ?int $ahora = null): ?string {
    $partes = explode('.', $permiso);
    if (count($partes) !== 3) return null;
    [$clave, $vence, $firma] = $partes;
    if (!preg_match('/^[0-9A-Za-z]{1,60}$/', $clave) || !ctype_digit($vence) || (int)$vence < ($ahora ?? time())) return null;
    $esperada = form_imagenes_firma($clave, (int)$vence);
    return $esperada !== '' && hash_equals($esperada, $firma) ? $clave : null;
}

/** Solo fotos: lo que dice el contenido, no lo que declara el navegador. */
function form_imagenes_mime_ok(string $mime): bool {
    return in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'], true);
}

// form-lead.php y los tests solo usan las funciones de arriba.
if (PHP_SAPI === 'cli' || realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) !== __FILE__) return;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://gokywebs.com');
header('Access-Control-Allow-Methods: POST');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false, 'error' => 'method_not_allowed']); exit; }

$responder = function (int $http, array $cuerpo) { http_response_code($http); echo json_encode($cuerpo); exit; };

$clave = form_imagenes_permiso_clave((string)($_POST['subida'] ?? ''));
if ($clave === null || !wabot_conv_existe($clave)) $responder(403, ['ok' => false, 'error' => 'permiso']);

$archivo = $_FILES['imagen'] ?? null;
if (!$archivo || ($archivo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($archivo['tmp_name'])) {
    $responder(400, ['ok' => false, 'error' => 'archivo']);
}
if ((int)$archivo['size'] > FORM_IMAGENES_BYTES) $responder(400, ['ok' => false, 'error' => 'pesada']);
// Sin la extensión fileinfo, la firma de los bytes (la misma que usa wabot_media_guardar).
$mime = class_exists('finfo') ? (string)(new finfo(FILEINFO_MIME_TYPE))->file($archivo['tmp_name'])
    : (['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif', 'heic' => 'image/heic', 'heif' => 'image/heif']
       [wabot_media_ext_por_contenido((string)file_get_contents($archivo['tmp_name'], false, null, 0, 64))] ?? '');
if (!form_imagenes_mime_ok($mime)) $responder(400, ['ok' => false, 'error' => 'tipo']);

$lock = null;
for ($intento = 0; $intento < 6 && $lock === null; $intento++) {
    $lock = wabot_lock_tomar($clave);
    if ($lock === null) usleep(500000);
}
if ($lock === null) $responder(200, ['ok' => false, 'error' => 'ocupado', 'reintentar' => true]);

// exit() no corre el finally: se arma la respuesta adentro y se contesta después de soltar el candado.
$respuesta = [200, ['ok' => true]];
try {
    $conv = wabot_conv_load($clave);
    // El tope es por permiso (un envío del formulario), no de por vida.
    $vence = (int)explode('.', (string)$_POST['subida'])[1];
    if ((int)($conv['form_imagenes_permiso'] ?? 0) !== $vence) {
        $conv['form_imagenes_permiso'] = $vence;
        $conv['form_imagenes_subidas'] = 0;
    }
    $total = max(0, min(FORM_IMAGENES_MAX, (int)($_POST['total'] ?? 0)));
    $n = max(0, min($total, (int)($_POST['n'] ?? 0)));
    if ((int)$conv['form_imagenes_subidas'] >= FORM_IMAGENES_MAX) {
        $respuesta = [400, ['ok' => false, 'error' => 'tope']];
    } elseif (wabot_form_imagen_guardar($conv, (string)file_get_contents($archivo['tmp_name']), $mime,
                  mb_substr(basename((string)($archivo['name'] ?? '')), 0, 120), $n, $total) === null) {
        $respuesta = [500, ['ok' => false, 'error' => 'guardar']];
    } else {
        $conv['form_imagenes_subidas'] = (int)$conv['form_imagenes_subidas'] + 1;
        wabot_logo_sincronizar($conv);
        wabot_conv_save($conv);
        wabot_log('form_imagen', ['tel' => $clave, 'n' => $n, 'total' => $total, 'bytes' => (int)$archivo['size']]);
    }
} finally {
    wabot_lock_soltar($lock);
}
$responder(...$respuesta);
