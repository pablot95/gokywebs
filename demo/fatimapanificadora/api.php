<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function norm(string $text): string {
    return strtr(mb_strtolower($text, 'UTF-8'), ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(['error'=>'Solo se permiten consultas.'], 405);
foreach ($_GET as $value) if (!is_string($value) || strlen($value) > 4096) respond(['error'=>'Parámetro inválido.'], 400);
$scope = $_GET['scope'] ?? 'catalog';
$maximum = ['home'=>6, 'catalog'=>16, 'admin'=>100, 'lookup'=>100][$scope] ?? 0;
if (!$maximum) respond(['error'=>'Vista inválida.'], 400);
$limit = max(1, min(100, $maximum, (int) ($_GET['limit'] ?? $maximum)));
$cat = in_array($_GET['cat'] ?? '', ['sandwiches','miga','confiteria','catering'], true) ? $_GET['cat'] : '';
$order = in_array($_GET['orden'] ?? '', ['precio-asc','precio-desc','nombre'], true) ? $_GET['orden'] : 'nombre';
$q = norm(mb_substr(trim($_GET['q'] ?? ''), 0, 80));
$words = preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY);
$budget = max(0, min(1000000, (int) ($_GET['precio'] ?? 0)));
$ids = array_slice(array_values(array_filter(explode(',', $_GET['ids'] ?? ''))), 0, 100);
$slug = mb_substr($_GET['slug'] ?? '', 0, 100);
if ($scope === 'lookup' && !$ids && !$slug) respond(['items'=>[], 'nextCursor'=>null, 'total'=>0, 'limit'=>$limit]);
$fingerprint = hash('sha256', json_encode([$scope,$cat,$order,$q,$budget,$ids,$slug]));
$after = null;
if (!empty($_GET['cursor'])) {
    if (strlen($_GET['cursor']) > 1024) respond(['error'=>'Cursor inválido.'], 400);
    $raw = base64_decode(strtr($_GET['cursor'], '-_', '+/'), true);
    $after = $raw === false ? null : json_decode($raw, true);
    if (!is_array($after) || ($after['query'] ?? '') !== $fingerprint || !is_string($after['id'] ?? null) || !isset($after['key']) || !is_scalar($after['key'])) respond(['error'=>'Cursor inválido para esta búsqueda.'], 400);
}
$compare = static function(array $a, array $b) use ($order): int {
    $c = $a['_key'] <=> $b['_key'];
    return ($order === 'precio-desc' ? -$c : $c) ?: strcmp($a['id'], $b['id']);
};
$handle = @fopen(__DIR__ . '/products.ndjson', 'rb');
if (!$handle) respond(['error'=>'No pudimos abrir el catálogo. Volvé a intentar.'], 503);
$items = [];
$total = 0;
$remaining = 0;
while (($line = fgets($handle, 65536)) !== false) {
    $p = json_decode($line, true);
    if (!is_array($p) || !isset($p['id'],$p['nombre'],$p['precio'])) continue;
    if ($scope === 'home' && empty($p['destacado'])) continue;
    if ($scope === 'lookup' && !in_array($p['id'], $ids, true) && $p['slug'] !== $slug) continue;
    if ($cat && $p['categoria'] !== $cat) continue;
    $price = round($p['precio'] * (1 - ($p['descuento'] ?? 0) / 100));
    if ($budget && $price > $budget) continue;
    $search = norm(implode(' ', [$p['nombre'],'Fatima Panificadora',$p['categoria'],$p['subcategoria'],$p['descripcion'],implode(' ', $p['tags'])]));
    foreach ($words as $word) if (!str_contains($search, $word)) continue 2;
    $total++;
    $p['_key'] = $order === 'nombre' ? norm($p['nombre']) : $price;
    if ($after && $compare($p, ['_key'=>$after['key'], 'id'=>$after['id']]) <= 0) continue;
    $remaining++;
    if (count($items) === $limit && $compare($p, $items[count($items)-1]) >= 0) continue;
    if (count($items) === $limit) array_pop($items);
    $items[] = $p;
    usort($items, $compare);
}
fclose($handle);
$last = $items ? $items[count($items)-1] : null;
$cursor = $remaining > $limit ? rtrim(strtr(base64_encode(json_encode(['key'=>$last['_key'],'id'=>$last['id'],'query'=>$fingerprint])), '+/', '-_'), '=') : null;
foreach ($items as &$p) unset($p['_key']);
unset($p);
respond(['items'=>$items, 'nextCursor'=>$cursor, 'total'=>$total, 'limit'=>$limit]);
