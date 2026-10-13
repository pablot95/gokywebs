<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$limit = filter_var($_GET['limit'] ?? null, FILTER_VALIDATE_INT);
$limit = max(1, min(100, $limit ?: 16));
$category = trim((string) ($_GET['cat'] ?? ''));
$query = trim((string) ($_GET['q'] ?? ''));
$id = trim((string) ($_GET['id'] ?? ''));
$featured = ($_GET['featured'] ?? '') === '1';
$cursor = (string) ($_GET['cursor'] ?? '');
$afterId = $cursor !== '' ? base64_decode(strtr($cursor, '-_', '+/'), true) : null;
if ($cursor !== '' && ($afterId === false || !preg_match('/^[a-z0-9-]{1,80}$/', $afterId))) {
    http_response_code(400);
    echo json_encode(['error' => 'Cursor inválido']);
    exit;
}

$products = json_decode((string) file_get_contents(__DIR__ . '/products.json'), true);
if (!is_array($products)) {
    http_response_code(500);
    echo json_encode(['error' => 'Catálogo no disponible']);
    exit;
}
$fold = static function (string $value): string {
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value;
    return strtolower($value);
};
$products = array_values(array_filter($products, static function (array $item) use ($category, $query, $id, $featured, $fold): bool {
    if ($id !== '' && ($item['id'] ?? '') !== $id) return false;
    if ($category !== '' && ($item['category'] ?? '') !== $category) return false;
    if ($featured && empty($item['featured'])) return false;
    if ($query === '') return true;
    $haystack = $fold(implode(' ', [$item['name'] ?? '', $item['category'] ?? '', $item['description'] ?? '']));
    foreach (preg_split('/\s+/', $fold($query)) as $term) {
        if ($term !== '' && !str_contains($haystack, $term)) return false;
    }
    return true;
}));
$ids = array_column($products, 'id');
$position = $afterId === null ? 0 : array_search($afterId, $ids, true);
if ($position === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Cursor vencido']);
    exit;
}
if ($afterId !== null) $position++;
$page = array_slice($products, $position, $limit);
$nextPosition = $position + count($page);
$next = $nextPosition < count($products) && $page ? rtrim(strtr(base64_encode((string) end($page)['id']), '+/', '-_'), '=') : null;
echo json_encode(['products' => $page, 'nextCursor' => $next, 'count' => count($products)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
