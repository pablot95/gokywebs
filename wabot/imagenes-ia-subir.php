<?php
/**
 * wabot/imagenes-ia-subir.php — el .zip de imágenes que arma la tarea de
 * ChatGPT «Gokywebs Copiar 10», subido desde la PC de Pablo para que quede en
 * la ficha del prospecto en el admin (Pablo, 29-oct: «cada ZIP en la ficha de
 * su prospecto y también en Descargas»). Lo sube tools/chatgpt-zips/bajar.py.
 *
 *   POST imagenes-ia-subir.php?id=<id de la propuesta>&firma=<hmac>   (cuerpo: el zip)
 *
 * Sin sesión del panel: la llamada va firmada como imagenes-bajar.php (HMAC con
 * la private_key de la cuenta de servicio, que tienen el server y la PC), sobre
 * el id y el sha256 del cuerpo. El zip queda en data/imagenes-ia/<id>.zip y la
 * propuesta recibe `imagenesIa` {nombre, bytes, subidoAt}; el admin lo baja con
 * admin.php?accion=imagenes_ia&id=<id>.
 */
require_once __DIR__ . '/presentar.php';

const WABOT_IMAGENES_IA_DIR = WABOT_DATA . '/imagenes-ia';
const WABOT_IMAGENES_IA_MAX = 80 * 1024 * 1024;

function imagenes_ia_firma(string $id, string $shaCuerpo): string {
    $sa = wabot_push_cuenta();
    return $sa ? hash_hmac('sha256', 'imagenes-ia|' . $id . '|' . $shaCuerpo, (string)$sa['private_key']) : '';
}

/** El id de propuesta (20 letras y números, como los de Firestore) o ''. */
function imagenes_ia_id($id): string {
    $id = (string)$id;
    return preg_match('/^[A-Za-z0-9]{20}$/', $id) ? $id : '';
}

/** Le escribe `imagenesIa` a la propuesta (solo si existe). */
function imagenes_ia_marcar(string $id, array $marca): int {
    $sa = wabot_push_cuenta();
    $url = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents/propuestas/'
         . rawurlencode($id) . '?updateMask.fieldPaths=imagenesIa&currentDocument.exists=true';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => ['imagenesIa' => wabot_presentar_fs_valor($marca)]], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_presentar_fs_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
    ]);
    $res = curl_exec($ch);
    $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (($http < 200 || $http >= 300) && $http !== 404) {
        wabot_log('error', ['donde' => 'imagenes_ia_marcar', 'id' => $id, 'http' => $http, 'res' => mb_substr((string)$res, 0, 200)]);
    }
    return $http;
}

if (PHP_SAPI === 'cli') return;   // los tests solo usan las funciones

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'metodo']));
}
$id = imagenes_ia_id($_GET['id'] ?? '');
$cuerpo = (string)file_get_contents('php://input');
$esperada = $id !== '' ? imagenes_ia_firma($id, hash('sha256', $cuerpo)) : '';
if ($esperada === '' || !hash_equals($esperada, (string)($_GET['firma'] ?? ''))) {
    http_response_code(403);
    exit(json_encode(['ok' => false, 'error' => 'firma']));
}
if (substr($cuerpo, 0, 2) !== 'PK' || strlen($cuerpo) > WABOT_IMAGENES_IA_MAX) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'no es un zip']));
}
if (!is_dir(WABOT_IMAGENES_IA_DIR)) mkdir(WABOT_IMAGENES_IA_DIR, 0755, true);
if (file_put_contents(WABOT_IMAGENES_IA_DIR . '/' . $id . '.zip', $cuerpo, LOCK_EX) === false) {
    http_response_code(500);
    exit(json_encode(['ok' => false, 'error' => 'no se pudo guardar']));
}
$nombre = preg_replace('/[^\w.\-]+/u', '_', (string)($_GET['nombre'] ?? '')) ?: ($id . '.zip');
$http = imagenes_ia_marcar($id, ['nombre' => mb_substr($nombre, 0, 120), 'bytes' => strlen($cuerpo), 'subidoAt' => gmdate('Y-m-d\TH:i:s\Z')]);
wabot_log('imagenes_ia', ['id' => $id, 'bytes' => strlen($cuerpo), 'firestore' => $http]);
// 404 = la propuesta ya no está (pasó a cliente o se borró): el zip igual queda guardado.
echo json_encode(['ok' => true, 'propuesta' => $http >= 200 && $http < 300]);
