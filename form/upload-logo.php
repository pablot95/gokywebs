<?php
/*
 * GokyWebs – upload-logo.php
 * Recibe el logo del formulario de propuesta, lo guarda en /propuesta/logos/
 * y devuelve la URL pública como JSON.
 *
 * POST: campo "logo" (archivo)
 * Respuesta: { "url": "https://gokywebs.com/propuesta/logos/xxx.ext" }
 *            { "error": "mensaje" }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://gokywebs.com');
header('Access-Control-Allow-Methods: POST');

/* ── Sólo POST ── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

/* ── Verificar que llegó el archivo ── */
if (empty($_FILES['logo']) || $_FILES['logo']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibió ningún archivo']);
    exit;
}

$file  = $_FILES['logo'];
$error = $file['error'];

if ($error !== UPLOAD_ERR_OK) {
    $msgs = [
        UPLOAD_ERR_INI_SIZE   => 'El archivo supera el límite del servidor',
        UPLOAD_ERR_FORM_SIZE  => 'El archivo supera el límite del formulario',
        UPLOAD_ERR_PARTIAL    => 'El archivo se subió parcialmente',
        UPLOAD_ERR_NO_TMP_DIR => 'No hay directorio temporal',
        UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir en disco',
    ];
    http_response_code(500);
    echo json_encode(['error' => $msgs[$error] ?? 'Error de carga desconocido']);
    exit;
}

/* ── Validar tamaño (máx. 10 MB) ── */
$maxBytes = 10 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    http_response_code(400);
    echo json_encode(['error' => 'El archivo supera los 10 MB']);
    exit;
}

/* ── Validar tipo MIME ── */
$allowedMime = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'image/webp', 'image/svg+xml',
    'application/pdf',
    'application/postscript',                        // .ai / .eps
    'application/illustrator',
    'image/x-eps', 'application/eps',
];
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, $allowedMime, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de archivo no permitido: ' . $mimeType]);
    exit;
}

/* ── Directorio destino ── */
$uploadDir = __DIR__ . '/logos/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

/* ── Nombre de archivo seguro y único ── */
$originalName = basename($file['name']);
$safeName     = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
$safeName     = ltrim($safeName, '.');           // evitar nombres ocultos
$uniqueName   = time() . '_' . $safeName;
$destPath     = $uploadDir . $uniqueName;

/* ── Mover archivo ── */
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar el archivo en el servidor']);
    exit;
}

/* ── Construir URL pública ── */
$baseUrl = 'https://gokywebs.com/form/logos/';
$url     = $baseUrl . $uniqueName;

echo json_encode(['url' => $url, 'nombre' => $originalName]);
