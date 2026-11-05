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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(['error'=>'Esta demo permite consultas.'], 405);
foreach ($_GET as $value) if (!is_string($value) || strlen($value) > 4096) respond(['error'=>'Parámetro inválido.'], 400);
$scope = $_GET['scope'] ?? 'catalog';
$cap = ['home'=>6, 'catalog'=>16, 'admin'=>100, 'lookup'=>100][$scope] ?? 0;
if (!$cap) respond(['error'=>'Vista inválida.'], 400);
$limit = max(1, min(100, $cap, (int) ($_GET['limit'] ?? $cap)));
$cat = in_array($_GET['cat'] ?? '', ['rodantes','food-trucks','motorhomes','modulos'], true) ? $_GET['cat'] : '';
$use = in_array($_GET['uso'] ?? '', ['viajar','emprender','habitar','trabajar'], true) ? $_GET['uso'] : '';
$order = ($_GET['orden'] ?? '') === 'nombre-desc' ? 'nombre-desc' : 'nombre';
$q = norm(mb_substr(trim($_GET['q'] ?? ''), 0, 80));
$ids = array_slice(array_values(array_filter(explode(',', $_GET['ids'] ?? ''))), 0, 100);
$slug = mb_substr($_GET['slug'] ?? '', 0, 100);
$fingerprint = hash('sha256', json_encode([$scope,$cat,$use,$order,$q,$ids,$slug]));
$after = null;
if (!empty($_GET['cursor'])) {
    if (strlen($_GET['cursor']) > 1024) respond(['error'=>'Cursor inválido.'], 400);
    $raw = base64_decode(strtr($_GET['cursor'], '-_', '+/'), true);
    $after = $raw === false ? null : json_decode($raw, true);
    if (!is_array($after) || ($after['query'] ?? '') !== $fingerprint || !is_string($after['id'] ?? null) || !is_string($after['key'] ?? null)) respond(['error'=>'Cursor inválido para esta búsqueda.'], 400);
}
try {
    $db = new PDO('sqlite:' . __DIR__ . '/products.sqlite', null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA query_only = ON');
    $where = ['1=1'];
    $params = [];
    if ($scope === 'home') $where[] = 'destacado = 1';
    if ($scope === 'lookup') {
        if (!$ids && !$slug) respond(['items'=>[], 'nextCursor'=>null, 'total'=>0, 'limit'=>$limit]);
        $terms = [];
        foreach ($ids as $i => $id) { $terms[] = ':id'.$i; $params[':id'.$i] = $id; }
        $lookup = $terms ? 'id IN ('.implode(',', $terms).')' : '0=1';
        if ($slug) { $lookup .= ' OR slug = :slug'; $params[':slug'] = $slug; }
        $where[] = '('.$lookup.')';
    }
    foreach (['categoria'=>$cat, 'uso'=>$use] as $key=>$value) if ($value !== '') { $where[] = "$key = :$key"; $params[":$key"] = $value; }
    foreach (preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY) as $i=>$word) {
        $where[] = "search LIKE :q$i ESCAPE '\\'";
        $params[":q$i"] = '%'.strtr($word, ['\\'=>'\\\\','%'=>'\\%','_'=>'\\_']).'%';
    }
    $filter = implode(' AND ', $where);
    $count = $db->prepare('SELECT count(*) FROM products WHERE '.$filter);
    $count->execute($params);
    $total = (int) $count->fetchColumn();
    $dir = $order === 'nombre-desc' ? 'DESC' : 'ASC';
    $op = $dir === 'DESC' ? '<' : '>';
    if ($after) {
        $where[] = "(sort_name $op :afterKey OR (sort_name = :sameKey AND id > :afterId))";
        $params[':afterKey'] = $after['key']; $params[':sameKey'] = $after['key']; $params[':afterId'] = $after['id'];
    }
    $stmt = $db->prepare('SELECT payload, sort_name, id FROM products WHERE '.implode(' AND ', $where)." ORDER BY sort_name $dir, id ASC LIMIT :limit");
    foreach ($params as $k=>$v) $stmt->bindValue($k, $v, PDO::PARAM_STR);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $items = []; $last = null;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) { $items[] = json_decode($row['payload'], true); $last = $row; }
    $cursor = null;
    if (count($items) === $limit && $last) {
        $exists = $db->prepare("SELECT 1 FROM products WHERE $filter AND (sort_name $op :lastKey OR (sort_name = :sameLast AND id > :lastId)) LIMIT 1");
        unset($params[':afterKey'], $params[':sameKey'], $params[':afterId']);
        $params[':lastKey'] = $last['sort_name']; $params[':sameLast'] = $last['sort_name']; $params[':lastId'] = $last['id'];
        $exists->execute($params);
        if ($exists->fetchColumn()) $cursor = rtrim(strtr(base64_encode(json_encode(['key'=>$last['sort_name'],'id'=>$last['id'],'query'=>$fingerprint])), '+/', '-_'), '=');
    }
    respond(['items'=>$items, 'nextCursor'=>$cursor, 'total'=>$total, 'limit'=>$limit]);
} catch (Throwable $error) {
    respond(['error'=>'El catálogo no está disponible. Volvé a intentar en un momento.'], 503);
}
