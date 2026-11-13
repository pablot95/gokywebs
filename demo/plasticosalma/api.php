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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(['error'=>'Esta demo permite consultas.'],405);
foreach ($_GET as $value) if (!is_string($value) || strlen($value)>8192) respond(['error'=>'Parámetro inválido.'],400);
$scope=$_GET['scope'] ?? 'catalog';
$cap=['home'=>6,'catalog'=>16,'admin'=>100,'lookup'=>100][$scope] ?? 0;
if (!$cap) respond(['error'=>'Vista inválida.'],400);
$limit=max(1,min($cap,100,(int)($_GET['limit'] ?? $cap)));
$cat=in_array($_GET['cat'] ?? '',['macetas', 'reposeras', 'sillones', 'tanques'],true) ? $_GET['cat'] : '';
$order=in_array($_GET['orden'] ?? '',['nombre','precio-asc','precio-desc'],true) ? $_GET['orden'] : 'nombre';
$price=in_array($_GET['precio'] ?? '',['60000','150000','300000'],true) ? (int)$_GET['precio'] : 0;
$size=in_array($_GET['diseno'] ?? '',['Rojo', 'Dorado', 'Negro', 'Celeste', 'Marfil', 'Blanco', 'Gris'],true) ? $_GET['diseno'] : '';
$stock=($_GET['stock'] ?? '')==='1';
$q=norm(mb_substr(trim($_GET['q'] ?? ''),0,80));
$ids=array_slice(array_values(array_filter(explode(',',$_GET['ids'] ?? ''))),0,100);
$slug=mb_substr($_GET['slug'] ?? '',0,100);
$fingerprint=hash('sha256',json_encode([$scope,$cat,$order,$price,$size,$stock,$q,$ids,$slug]));
$after=null;
if (!empty($_GET['cursor'])) {
    if (strlen($_GET['cursor'])>1024) respond(['error'=>'Cursor inválido.'],400);
    $raw=base64_decode(strtr($_GET['cursor'],'-_','+/'),true);
    $after=$raw===false ? null : json_decode($raw,true);
    if (!is_array($after) || ($after['query'] ?? '')!==$fingerprint || !is_string($after['id'] ?? null) || !isset($after['key']) || !is_scalar($after['key'])) respond(['error'=>'Cursor inválido para esta búsqueda.'],400);
}
try {
    $db=new PDO('sqlite:'.__DIR__.'/products.sqlite',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA query_only = ON');
    $where=['1=1']; $params=[];
    if ($scope==='home') $where[]='destacado = 1';
    if ($scope==='lookup') {
        if (!$ids && !$slug) respond(['items'=>[],'nextCursor'=>null,'total'=>0,'limit'=>$limit]);
        $terms=[];
        foreach ($ids as $i=>$id) { $terms[]=':id'.$i; $params[':id'.$i]=$id; }
        $lookup=$terms ? 'id IN ('.implode(',',$terms).')' : '0=1';
        if ($slug) { $lookup.=' OR slug = :slug'; $params[':slug']=$slug; }
        $where[]='('.$lookup.')';
    }
    if ($cat!=='') { $where[]='categoria = :cat'; $params[':cat']=$cat; }
    if ($price) { $where[]='precio <= :price'; $params[':price']=$price; }
    if ($stock) $where[]='stock > 0';
    if ($size!=='') { $where[]="EXISTS (SELECT 1 FROM json_each(json_extract(payload,'$.variantes')) WHERE value = :size)"; $params[':size']=$size; }
    foreach (preg_split('/\s+/',$q,-1,PREG_SPLIT_NO_EMPTY) as $i=>$word) {
        $where[]="search LIKE :q$i ESCAPE '\\'";
        $params[":q$i"]='%'.strtr($word,['\\'=>'\\\\','%'=>'\\%','_'=>'\\_']).'%';
    }
    $filter=implode(' AND ',$where);
    $bind=function(PDOStatement $stmt,array $values): void {
        foreach($values as $key=>$value) $stmt->bindValue($key,$value,is_int($value)?PDO::PARAM_INT:PDO::PARAM_STR);
    };
    $count=$db->prepare('SELECT count(*) FROM products WHERE '.$filter);
    $bind($count,$params); $count->execute(); $total=(int)$count->fetchColumn();
    $field=$order==='nombre' ? 'sort_name' : 'precio';
    $dir=$order==='precio-desc' ? 'DESC' : 'ASC';
    $op=$dir==='DESC' ? '<' : '>';
    $baseParams=$params;
    if ($after) {
        $where[]="($field $op :afterKey OR ($field = :sameKey AND id > :afterId))";
        $params[':afterKey']=$field==='precio' ? (int)$after['key'] : (string)$after['key'];
        $params[':sameKey']=$params[':afterKey']; $params[':afterId']=$after['id'];
    }
    $stmt=$db->prepare('SELECT payload, '.$field.' AS sort_key, id FROM products WHERE '.implode(' AND ',$where)." ORDER BY $field $dir, id ASC LIMIT :limit");
    $bind($stmt,$params); $stmt->bindValue(':limit',$limit,PDO::PARAM_INT); $stmt->execute();
    $items=[]; $last=null;
    while($row=$stmt->fetch(PDO::FETCH_ASSOC)) { $items[]=json_decode($row['payload'],true); $last=$row; }
    $cursor=null;
    if (count($items)===$limit && $last) {
        $exists=$db->prepare("SELECT 1 FROM products WHERE $filter AND ($field $op :lastKey OR ($field = :sameLast AND id > :lastId)) LIMIT 1");
        $baseParams[':lastKey']=$last['sort_key']; $baseParams[':sameLast']=$last['sort_key']; $baseParams[':lastId']=$last['id'];
        $bind($exists,$baseParams); $exists->execute();
        if ($exists->fetchColumn()) $cursor=rtrim(strtr(base64_encode(json_encode(['key'=>$last['sort_key'],'id'=>$last['id'],'query'=>$fingerprint])),'+/','-_'),'=');
    }
    respond(['items'=>$items,'nextCursor'=>$cursor,'total'=>$total,'limit'=>$limit]);
} catch (Throwable $error) {
    respond(['error'=>'No pudimos cargar los productos. Volvé a intentar.'],503);
}
