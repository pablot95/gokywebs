<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respondError(string $message): never {
    http_response_code(400);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
function foldText(string $text): string {
    return strtr(mb_strtolower($text, 'UTF-8'), ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
}

$mode = (string)($_GET['mode'] ?? 'catalog');
if (!in_array($mode, ['home', 'home-preview', 'catalog', 'admin'], true)) respondError('Vista inválida');
$limit = min(100, max(1, (int)($_GET['limit'] ?? ($mode === 'admin' ? 20 : 16))));
$query = mb_substr(trim((string)($_GET['q'] ?? '')), 0, 100);
$category = (string)($_GET['cat'] ?? '');
$order = (string)($_GET['order'] ?? 'original');
if (!in_array($order, ['original', 'menor', 'mayor'], true)) $order = 'original';
$categories = ['', 'cereales', 'frutos-secos', 'semillas', 'snacks', 'almacen'];
if (!in_array($category, $categories, true)) $category = '';
$scope = hash('sha256', $mode . '|' . $query . '|' . $category . '|' . $order);
$offset = 0;
$cursor = (string)($_GET['cursor'] ?? '');
if ($cursor !== '') {
    if (strlen($cursor) > 256) respondError('Cursor inválido');
    $decoded = json_decode(base64_decode($cursor, true) ?: '', true);
    if (!is_array($decoded) || !isset($decoded['offset'], $decoded['scope']) || !is_int($decoded['offset']) || $decoded['offset'] < 0 || !hash_equals($scope, (string)$decoded['scope'])) respondError('Cursor inválido para esta búsqueda');
    $offset = $decoded['offset'];
}
$path = __DIR__ . '/products' . ($order === 'original' ? '' : '-' . $order) . '.jsonl';
$size = filesize($path);
if ($size === false || $offset > $size) respondError('Cursor fuera de rango');
$file = fopen($path, 'rb');
if ($file === false) { http_response_code(503); echo json_encode(['error'=>'Catálogo no disponible']); exit; }
fseek($file, $offset);
$items = [];
$read = 0;
$maxRead = 100;
$words = preg_split('/\s+/u', foldText($query), -1, PREG_SPLIT_NO_EMPTY) ?: [];
while ($read < $maxRead && count($items) < $limit && ($line = fgets($file)) !== false) {
    $read++;
    $item = json_decode($line, true);
    if (!is_array($item)) continue;
    if (empty($item['visible'])) continue;
    if ($mode === 'home' && empty($item['featured'])) continue;
    if ($mode === 'home-preview' && !empty($item['featured'])) continue;
    if ($category !== '' && ($item['category'] ?? '') !== $category) continue;
    $haystack = foldText(($item['name'] ?? '') . ' ' . ($item['category'] ?? '') . ' ' . ($item['description'] ?? ''));
    foreach ($words as $word) if (!str_contains($haystack, $word)) continue 2;
    $items[] = $item;
}
$nextOffset = ftell($file);
fclose($file);
$hasMore = $nextOffset < $size;
$next = $hasMore ? base64_encode(json_encode(['offset'=>$nextOffset,'scope'=>$scope])) : null;
echo json_encode(['items'=>$items,'nextCursor'=>$next,'hasMore'=>$hasMore,'limit'=>$limit,'read'=>$read], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
