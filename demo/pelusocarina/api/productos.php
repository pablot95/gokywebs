<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$requested = filter_var($_GET['limit'] ?? null, FILTER_VALIDATE_INT);
$limit = max(1, min(100, $requested ?: 16));
$category = trim((string) ($_GET['categoria'] ?? ''));
$query = trim((string) ($_GET['q'] ?? ''));
$priceMax = filter_var($_GET['precio_max'] ?? null, FILTER_VALIDATE_INT);
$id = trim((string) ($_GET['id'] ?? ''));
$ids = array_slice(array_filter(explode(',', (string) ($_GET['ids'] ?? ''))), 0, 50);
$scope = (string) ($_GET['scope'] ?? 'catalogo');
$rawCursor = (string) ($_GET['cursor'] ?? '');
$offset = 0;
if ($rawCursor !== '') {
    $decoded = base64_decode(strtr($rawCursor, '-_', '+/'), true);
    if ($decoded === false || !ctype_digit($decoded) || strlen($decoded) > 10) {
        http_response_code(400);
        echo json_encode(['error' => 'Cursor inválido'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $offset = (int) $decoded;
}

$file = @fopen(dirname(__DIR__) . '/data/productos.jsonl', 'rb');
if (!$file) {
    http_response_code(503);
    echo json_encode(['error' => 'Catálogo no disponible'], JSON_UNESCAPED_UNICODE);
    exit;
}

$normalize = static function (string $value): string {
    return strtolower(strtr($value, [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n',
        'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ú'=>'u','Ü'=>'u','Ñ'=>'n'
    ]));
};
$tokens = $query === '' ? [] : preg_split('/\s+/', $normalize($query));
$items = [];
$nextCursor = null;
$lineNumber = 0;
while (($line = fgets($file)) !== false) {
    $lineNumber++;
    if ($lineNumber <= $offset) continue;
    $item = json_decode($line, true);
    if (!is_array($item)) continue;
    if ($scope !== 'admin' && empty($item['visible'])) continue;
    if ($scope === 'destacados' && empty($item['destacado'])) continue;
    if ($id !== '' && ($item['id'] ?? '') !== $id) continue;
    if ($ids && !in_array((string) ($item['id'] ?? ''), $ids, true)) continue;
    if ($category !== '' && ($item['categoria'] ?? '') !== $category) continue;
    if ($priceMax && (int) ($item['precio'] ?? 0) > $priceMax) continue;
    if ($tokens) {
        $text = $normalize(implode(' ', [
            $item['nombre'] ?? '', $item['categoria'] ?? '',
            $item['detalle'] ?? '', $item['etiquetas'] ?? ''
        ]));
        foreach ($tokens as $token) {
            if ($token !== '' && strpos($text, $token) === false) continue 2;
        }
    }
    if (count($items) === $limit) {
        $nextCursor = rtrim(strtr(base64_encode((string) ($lineNumber - 1)), '+/', '-_'), '=');
        break;
    }
    $items[] = $item;
}
fclose($file);
echo json_encode(['items' => $items, 'nextCursor' => $nextCursor, 'limit' => $limit], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
