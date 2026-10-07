<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$max = 100;
$requested = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT);
$limit = max(1, min($max, $requested ?: 16));
$scope = (string) ($_GET['scope'] ?? 'catalogo');
$category = trim((string) ($_GET['categoria'] ?? ''));
$query = trim((string) ($_GET['q'] ?? ''));
$ids = array_slice(array_filter(explode(',', (string) ($_GET['ids'] ?? ''))), 0, 100);
$cursor = (string) ($_GET['cursor'] ?? '');
$offset = 0;
if ($cursor !== '') {
    $decoded = base64_decode(strtr($cursor, '-_', '+/'), true);
    if ($decoded === false || !ctype_digit($decoded) || strlen($decoded) > 10) {
        http_response_code(400);
        echo json_encode(['error' => 'Cursor inválido'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $offset = (int) $decoded;
}

$source = dirname(__DIR__) . '/data/productos.jsonl';
$file = @fopen($source, 'rb');
if (!$file) {
    http_response_code(503);
    echo json_encode(['error' => 'Catálogo no disponible'], JSON_UNESCAPED_UNICODE);
    exit;
}

$items = [];
$lineNumber = 0;
$next = null;
$normalize = static function (string $value): string {
    $value = strtr($value, ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n',
        'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ú'=>'u','Ü'=>'u','Ñ'=>'n']);
    return strtolower($value);
};
$needle = $normalize($query);
$tokens = $needle === '' ? [] : preg_split('/\s+/', $needle);

while (($line = fgets($file)) !== false) {
    $lineNumber++;
    if ($lineNumber <= $offset) continue;
    $item = json_decode($line, true);
    if (!is_array($item) || empty($item['visible'])) continue;
    if ($ids && !in_array((string) ($item['id'] ?? ''), $ids, true)) continue;
    if ($scope === 'destacados' && empty($item['destacado'])) continue;
    if ($category !== '' && ($item['categoria'] ?? '') !== $category) continue;
    if ($tokens) {
        $haystack = $normalize(implode(' ', [
            $item['nombre'] ?? '', $item['categoria'] ?? '',
            $item['equipo'] ?? '', $item['detalle'] ?? ''
        ]));
        foreach ($tokens as $token) {
            if (strpos($haystack, $token) === false) continue 2;
        }
    }
    if (count($items) === $limit) {
        $next = rtrim(strtr(base64_encode((string) ($lineNumber - 1)), '+/', '-_'), '=');
        break;
    }
    $items[] = $item;
}
fclose($file);

echo json_encode(['items' => $items, 'nextCursor' => $next, 'limit' => $limit], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
