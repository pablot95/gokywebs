<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$scope = (string) ($_GET['scope'] ?? 'catalog');
$max = match ($scope) {
    'home' => 8,
    'catalog' => 16,
    'admin' => 100,
    default => 0,
};
if ($max === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Vista inválida']);
    exit;
}
$limit = max(1, min($max, (int) ($_GET['limit'] ?? $max), 100));
$category = (string) ($_GET['cat'] ?? '');
if (!in_array($category, ['', 'reposteria', 'ceramica', 'porcelana'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Categoría inválida']);
    exit;
}
$term = mb_strtolower(trim((string) ($_GET['q'] ?? '')), 'UTF-8');
if (mb_strlen($term, 'UTF-8') > 80) $term = mb_substr($term, 0, 80, 'UTF-8');
$cursor = (string) ($_GET['cursor'] ?? '');
$offset = 0;
if ($cursor !== '') {
    $decoded = base64_decode(strtr($cursor, '-_', '+/'), true);
    if ($decoded === false || !ctype_digit($decoded)) {
        http_response_code(400);
        echo json_encode(['error' => 'Cursor inválido']);
        exit;
    }
    $offset = (int) $decoded;
}
$path = __DIR__ . '/products.ndjson';
$file = fopen($path, 'rb');
if (!$file) {
    http_response_code(500);
    echo json_encode(['error' => 'Catálogo no disponible']);
    exit;
}
$size = filesize($path);
if ($offset > $size) {
    fclose($file);
    http_response_code(400);
    echo json_encode(['error' => 'Cursor inválido']);
    exit;
}
fseek($file, $offset);
$items = [];
$hasMore = false;
$nextOffset = null;
while (($line = fgets($file)) !== false) {
    $product = json_decode($line, true);
    if (!is_array($product)) continue;
    if ($category !== '' && $product['category'] !== $category) continue;
    if ($scope === 'home' && empty($product['featured'])) continue;
    if ($term !== '' && mb_strpos(mb_strtolower($product['name'] . ' ' . $product['description'], 'UTF-8'), $term) === false) continue;
    if (count($items) === $limit) {
        $hasMore = true;
        break;
    }
    $items[] = $product;
    $nextOffset = ftell($file);
}
fclose($file);
$next = $hasMore && $nextOffset !== null ? rtrim(strtr(base64_encode((string) $nextOffset), '+/', '-_'), '=') : null;
echo json_encode(['items' => $items, 'nextCursor' => $next, 'hasMore' => $hasMore, 'limit' => $limit], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
