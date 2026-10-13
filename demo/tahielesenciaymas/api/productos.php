<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
header('X-Content-Type-Options: nosniff');

$singleId = (string)($_GET['id'] ?? '');
if ($singleId !== '') {
    if (!preg_match('/^[a-z0-9-]{1,64}$/D', $singleId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Producto inválido']);
        exit;
    }
    $singleFile = fopen(__DIR__ . '/../productos.jsonl', 'rb');
    if ($singleFile === false) {
        http_response_code(503);
        echo json_encode(['error' => 'Catálogo no disponible']);
        exit;
    }
    $found = null;
    while (($singleLine = fgets($singleFile)) !== false) {
        $candidate = json_decode($singleLine, true);
        if (is_array($candidate) && ($candidate['id'] ?? '') === $singleId) {
            $found = $candidate;
            break;
        }
    }
    fclose($singleFile);
    if ($found === null) http_response_code(404);
    echo json_encode(['item' => $found], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$view = (string)($_GET['view'] ?? 'catalog');
if (!in_array($view, ['home', 'catalog', 'admin'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Vista inválida']);
    exit;
}

$maximum = $view === 'home' ? 8 : 100;
$default = $view === 'home' ? 8 : ($view === 'admin' ? 10 : 16);
$requested = filter_var($_GET['limit'] ?? $default, FILTER_VALIDATE_INT);
$limit = $requested === false ? $default : max(1, min($maximum, $requested));
$cursor = (string)($_GET['cursor'] ?? '');
if ($cursor !== '' && !preg_match('/^[a-z0-9-]{1,64}$/D', $cursor)) {
    http_response_code(400);
    echo json_encode(['error' => 'Cursor inválido']);
    exit;
}

$file = fopen(__DIR__ . '/../productos.jsonl', 'rb');
if ($file === false) {
    http_response_code(503);
    echo json_encode(['error' => 'Catálogo no disponible']);
    exit;
}

$items = [];
$more = false;
$afterCursor = $cursor === '';
while (($line = fgets($file)) !== false) {
    $product = json_decode($line, true);
    if (!is_array($product) || !isset($product['id'])) continue;
    if (!$afterCursor) {
        if ($product['id'] === $cursor) $afterCursor = true;
        continue;
    }
    if (count($items) >= $limit) {
        $more = true;
        break;
    }
    $items[] = $product;
}
fclose($file);

echo json_encode([
    'items' => $items,
    'nextCursor' => $more && $items ? $items[array_key_last($items)]['id'] : null,
    'hasMore' => $more,
    'limit' => $limit,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
