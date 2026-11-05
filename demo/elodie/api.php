<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
$scope = (string)($_GET['scope'] ?? 'catalog');
$max = match ($scope) { 'home' => 4, 'catalog' => 16, 'admin' => 100, default => 0 };
if ($max === 0) { http_response_code(400); exit(json_encode(['error' => 'Vista inválida'])); }
$limit = max(1, min($max, (int)($_GET['limit'] ?? $max), 100));
$category = (string)($_GET['cat'] ?? '');
if (!in_array($category, ['', 'conjuntos', 'soft', 'loungewear'], true)) { http_response_code(400); exit(json_encode(['error' => 'Categoría inválida'])); }
$term = mb_strtolower(trim((string)($_GET['q'] ?? '')), 'UTF-8');
if (mb_strlen($term, 'UTF-8') > 80) $term = mb_substr($term, 0, 80, 'UTF-8');
$cursor = (string)($_GET['cursor'] ?? '');
$offset = 0;
if ($cursor !== '') {
    $decoded = base64_decode(strtr($cursor, '-_', '+/'), true);
    if ($decoded === false || !ctype_digit($decoded)) { http_response_code(400); exit(json_encode(['error' => 'Cursor inválido'])); }
    $offset = (int)$decoded;
}
$path = __DIR__ . '/products.ndjson';
$file = fopen($path, 'rb');
if (!$file) { http_response_code(500); exit(json_encode(['error' => 'Catálogo no disponible'])); }
if ($offset > filesize($path)) { fclose($file); http_response_code(400); exit(json_encode(['error' => 'Cursor inválido'])); }
fseek($file, $offset);
$items = []; $nextOffset = null; $hasMore = false;
while (($line = fgets($file)) !== false) {
    $item = json_decode($line, true);
    if (!is_array($item)) continue;
    if ($category !== '' && $item['category'] !== $category) continue;
    if ($scope === 'home' && empty($item['featured'])) continue;
    if ($term !== '' && mb_strpos(mb_strtolower($item['name'] . ' ' . $item['description'], 'UTF-8'), $term) === false) continue;
    if (count($items) === $limit) { $hasMore = true; break; }
    $items[] = $item; $nextOffset = ftell($file);
}
fclose($file);
$nextCursor = $hasMore && $nextOffset !== null ? rtrim(strtr(base64_encode((string)$nextOffset), '+/', '-_'), '=') : null;
echo json_encode(['items' => $items, 'nextCursor' => $nextCursor, 'hasMore' => $hasMore, 'limit' => $limit], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
