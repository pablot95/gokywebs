<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
header('X-Content-Type-Options: nosniff');

function fail(int $status, string $message): never {
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function fold(string $value): string {
    return strtr(mb_strtolower($value, 'UTF-8'), [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
    ]);
}

$view = (string)($_GET['view'] ?? 'catalog');
if (!in_array($view, ['home', 'catalog', 'admin'], true)) fail(400, 'Vista inválida');

$maximum = $view === 'home' ? 8 : 100;
$default = match ($view) { 'home' => 8, 'admin' => 10, default => 16 };
$requested = filter_var($_GET['limit'] ?? $default, FILTER_VALIDATE_INT);
$limit = $requested === false ? $default : max(1, min($maximum, $requested));

$sort = (string)($_GET['sort'] ?? 'destacados');
$files = [
    'destacados' => 'productos-data.php',
    'precio-asc' => 'productos-precio-asc-data.php',
    'precio-desc' => 'productos-precio-desc-data.php',
];
if (!isset($files[$sort])) fail(400, 'Orden inválido');

$category = (string)($_GET['cat'] ?? '');
$categoryTitles = ['velones' => 'Velones Fortaleza', 'velas' => 'Velas', 'rosarios' => 'Rosarios e incienso', 'imagenes' => 'Imágenes religiosas'];
if ($category !== '' && !isset($categoryTitles[$category])) fail(400, 'Categoría inválida');

$query = trim((string)($_GET['q'] ?? ''));
if (mb_strlen($query, 'UTF-8') > 80) fail(400, 'Búsqueda demasiado larga');
$query = fold($query);
$cursor = (string)($_GET['cursor'] ?? '');
if ($cursor !== '' && !preg_match('/^[a-z0-9-]{1,64}$/D', $cursor)) fail(400, 'Cursor inválido');

$id = (string)($_GET['id'] ?? '');
if ($id !== '' && !preg_match('/^[a-z0-9-]{1,64}$/D', $id)) fail(400, 'Producto inválido');

$handle = fopen(__DIR__ . '/../' . $files[$sort], 'rb');
if ($handle === false) fail(503, 'Catálogo no disponible');

$items = [];
$afterCursor = $cursor === '';
$more = false;
$found = null;
while (($line = fgets($handle)) !== false) {
    $product = json_decode($line, true);
    if (!is_array($product) || !isset($product['id'])) continue;
    if ($id !== '') {
        if ($product['id'] === $id && !empty($product['visible'])) {
            $found = $product;
            break;
        }
        continue;
    }
    if (!$afterCursor) {
        if ($product['id'] === $cursor) $afterCursor = true;
        continue;
    }
    if ($view !== 'admin' && empty($product['visible'])) continue;
    if ($category !== '' && $product['category'] !== $category) continue;
    if ($query !== '') {
        $haystack = fold(($product['name'] ?? '') . ' ' . ($product['description'] ?? '') . ' ' . ($categoryTitles[$product['category']] ?? ''));
        if (!str_contains($haystack, $query)) continue;
    }
    if (count($items) >= $limit) {
        $more = true;
        break;
    }
    $items[] = $product;
}
fclose($handle);

if ($id !== '') {
    if ($found === null) fail(404, 'Producto no encontrado');
    echo json_encode(['item' => $found], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode([
    'items' => $items,
    'nextCursor' => $more && $items ? $items[array_key_last($items)]['id'] : null,
    'hasMore' => $more,
    'limit' => $limit,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
