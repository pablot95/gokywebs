<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
header('X-Content-Type-Options: nosniff');

function fail(int $code, string $message): never {
    http_response_code($code);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$singleId = (string)($_GET['id'] ?? '');
if ($singleId !== '') {
    if (!preg_match('/^[a-z0-9-]{1,64}$/D', $singleId)) fail(400, 'Producto inválido');
    $file = fopen(__DIR__ . '/../productos.jsonl', 'rb');
    if ($file === false) fail(503, 'Catálogo no disponible');
    $item = null;
    while (($line = fgets($file)) !== false) {
        $candidate = json_decode($line, true);
        if (is_array($candidate) && ($candidate['id'] ?? '') === $singleId && ($candidate['visible'] ?? false) === true) {
            $item = $candidate;
            break;
        }
    }
    fclose($file);
    if ($item === null) fail(404, 'Producto no disponible');
    echo json_encode(['item' => $item], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$view = (string)($_GET['view'] ?? 'catalog');
if (!in_array($view, ['home', 'catalog', 'admin'], true)) fail(400, 'Vista inválida');

$max = $view === 'home' ? 8 : 100;
$default = $view === 'home' ? 8 : ($view === 'admin' ? 4 : 16);
$requested = filter_var($_GET['limit'] ?? $default, FILTER_VALIDATE_INT);
$limit = $requested === false ? $default : max(1, min($max, $requested));

$category = (string)($_GET['cat'] ?? '');
if ($category !== '' && !in_array($category, ['paragolpes', 'electronica', 'accesorios'], true)) fail(400, 'Categoría inválida');

$sort = (string)($_GET['orden'] ?? 'destacados');
$files = [
    'destacados' => 'productos.jsonl',
    'precio-asc' => 'productos-precio-asc.jsonl',
    'precio-desc' => 'productos-precio-desc.jsonl',
];
if (!isset($files[$sort])) fail(400, 'Orden inválido');
if ($view !== 'catalog') $sort = 'destacados';

$cursor = (string)($_GET['cursor'] ?? '0');
if (!preg_match('/^(0|[1-9][0-9]{0,8})$/D', $cursor)) fail(400, 'Cursor inválido');
$offset = (int)$cursor;
$path = __DIR__ . '/../' . $files[$sort];
$size = filesize($path);
if ($size === false) fail(503, 'Catálogo no disponible');
if ($offset > $size) fail(400, 'Cursor fuera de rango');
$file = fopen($path, 'rb');
if ($file === false) fail(503, 'Catálogo no disponible');
if ($offset > 0) {
    fseek($file, $offset - 1);
    if (fgetc($file) !== "\n") {
        fclose($file);
        fail(400, 'Cursor inválido');
    }
}
fseek($file, $offset);

$items = [];
$scanned = 0;
$scanLimit = max(100, $limit * 5);
while (count($items) < $limit && $scanned < $scanLimit && ($line = fgets($file)) !== false) {
    $scanned++;
    $product = json_decode($line, true);
    if (!is_array($product) || !isset($product['id'])) continue;
    if ($view !== 'admin' && ($product['visible'] ?? false) !== true) continue;
    if ($category !== '' && ($product['category'] ?? '') !== $category) continue;
    $items[] = $product;
}
$nextOffset = ftell($file);
$hasMore = $nextOffset < $size;
fclose($file);

echo json_encode([
    'items' => $items,
    'nextCursor' => $hasMore ? (string)$nextOffset : null,
    'hasMore' => $hasMore,
    'limit' => $limit,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
