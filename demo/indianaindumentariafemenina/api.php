<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function norm(string $value): string {
    return strtr(mb_strtolower($value, 'UTF-8'), ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
}
foreach ($_GET as $value) if (!is_string($value)) respond(['error'=>'Parámetro inválido'], 400);
$scope = $_GET['scope'] ?? 'catalog';
$max = ['home'=>6, 'catalog'=>16, 'admin'=>100, 'lookup'=>100][$scope] ?? 0;
if (!$max) respond(['error'=>'Vista inválida'], 400);
$limit = max(1, min($max, (int) ($_GET['limit'] ?? $max), 100));
$cat = in_array($_GET['cat'] ?? '', ['prendas','accesorios'], true) ? $_GET['cat'] : '';
$sub = in_array($_GET['sub'] ?? '', ['superiores','inferiores','vestidos','bolsos'], true) ? $_GET['sub'] : '';
$size = in_array($_GET['talle'] ?? '', ['S','M','L','XL','U'], true) ? $_GET['talle'] : '';
$color = in_array($_GET['color'] ?? '', ['crudo','azul','negro','beige','rosa','blanco','suela','floral'], true) ? $_GET['color'] : '';
$order = in_array($_GET['orden'] ?? '', ['precio-asc','precio-desc','nombre'], true) ? $_GET['orden'] : 'nombre';
$q = norm(mb_substr(trim($_GET['q'] ?? ''), 0, 80));
$words = preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY);
$available = ($_GET['stock'] ?? '') === '1';
$budget = max(0, (int) ($_GET['precio'] ?? 0));
$ids = array_slice(array_values(array_filter(explode(',', $_GET['ids'] ?? ''))), 0, 100);
$slug = mb_substr($_GET['slug'] ?? '', 0, 100);
if ($scope === 'lookup' && !$ids && !$slug) respond(['items'=>[], 'nextCursor'=>null, 'total'=>0, 'limit'=>$limit]);
$fingerprint = hash('sha256', json_encode([$scope,$cat,$sub,$size,$color,$order,$q,$available,$budget,$ids,$slug]));
$after = null;
if (!empty($_GET['cursor'])) {
    if (strlen($_GET['cursor']) > 1024) respond(['error'=>'Cursor inválido'], 400);
    $decoded = base64_decode(strtr($_GET['cursor'], '-_', '+/'), true);
    $after = $decoded === false ? null : json_decode($decoded, true);
    if (!is_array($after) || ($after['query'] ?? '') !== $fingerprint || !is_string($after['id'] ?? null) || !isset($after['key']) || !is_scalar($after['key'])) respond(['error'=>'Cursor inválido para esta búsqueda'], 400);
}
$compare = static function(array $a, array $b) use ($order): int {
    $c = $a['_key'] <=> $b['_key'];
    if ($order === 'precio-desc') $c = -$c;
    return $c ?: strcmp($a['id'], $b['id']);
};
$handle = @fopen(__DIR__ . '/products.ndjson', 'rb');
if (!$handle) respond(['error'=>'No pudimos abrir el catálogo. Volvé a intentar.'], 503);
$items = [];
$total = 0;
$afterCount = 0;
while (($line = fgets($handle, 65536)) !== false) {
    $p = json_decode($line, true);
    if (!is_array($p) || !isset($p['id'], $p['nombre'], $p['precio'])) continue;
    if ($scope === 'home' && empty($p['destacado'])) continue;
    if ($scope === 'lookup' && !in_array($p['id'], $ids, true) && $p['slug'] !== $slug) continue;
    if ($cat && $p['categoria'] !== $cat) continue;
    if ($sub && $p['subcategoria'] !== $sub) continue;
    if ($size && !in_array($size, $p['variantes'], true)) continue;
    if ($color && $p['color'] !== $color) continue;
    if ($available && $p['stock'] <= 0) continue;
    $price = round($p['precio'] * (1 - $p['descuento'] / 100));
    if ($budget && $price > $budget) continue;
    $search = norm(implode(' ', [$p['nombre'],'Indiana',$p['categoria'],$p['subcategoria'],$p['color'],$p['descripcion'],implode(' ', $p['tags'])]));
    foreach ($words as $word) if (!str_contains($search, $word)) continue 2;
    $total++;
    $p['_key'] = $order === 'nombre' ? norm($p['nombre']) : $price;
    if ($after && $compare($p, ['_key'=>$after['key'], 'id'=>$after['id']]) <= 0) continue;
    $afterCount++;
    if (count($items) === $limit && $compare($p, $items[count($items)-1]) >= 0) continue;
    if (count($items) === $limit) array_pop($items);
    $items[] = $p;
    usort($items, $compare);
}
fclose($handle);
$hasMore = $afterCount > $limit;
$last = $items ? $items[count($items)-1] : null;
$cursor = $hasMore ? rtrim(strtr(base64_encode(json_encode(['key'=>$last['_key'],'id'=>$last['id'],'query'=>$fingerprint])), '+/', '-_'), '=') : null;
foreach ($items as &$p) unset($p['_key']);
unset($p);
respond(['items'=>$items,'nextCursor'=>$cursor,'total'=>$total,'limit'=>$limit]);
