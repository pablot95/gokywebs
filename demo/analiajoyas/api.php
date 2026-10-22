<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
session_start();
const MAX_PAGE = 100;
$dir = __DIR__ . '/data';
function respond(array $data, int $status = 200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function pagePath(string $dir, int $n): string { return $dir . '/page-' . str_pad((string)$n, 4, '0', STR_PAD_LEFT) . '.json'; }
function readPage(string $dir, int $n): array { $p = pagePath($dir, $n); if (!is_file($p)) return []; $rows = json_decode((string)file_get_contents($p), true); return is_array($rows) ? array_slice($rows, 0, MAX_PAGE) : []; }
function writePage(string $dir, int $n, array $rows): void { if (count($rows) > MAX_PAGE) respond(['error'=>'Página demasiado grande'], 500); $p=pagePath($dir,$n); $tmp=tempnam($dir,'page-'); if ($tmp===false) respond(['error'=>'No se pudo guardar'],500); file_put_contents($tmp,json_encode(array_values($rows),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES),LOCK_EX); rename($tmp,$p); }
function lastPage(string $dir): int { $n=1; while(is_file(pagePath($dir,$n+1))) $n++; return $n; }
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? 'products');
if ($method === 'GET' && $action === 'products') {
  $cursor=(string)($_GET['cursor'] ?? '1');
  if (!preg_match('/^([1-9][0-9]{0,3})(?::([0-9]{1,2}))?$/',$cursor,$parts)) respond(['error'=>'Cursor inválido'],400);
  $page=(int)$parts[1]; $offset=isset($parts[2])?(int)$parts[2]:0;
  $requested = filter_var($_GET['limit'] ?? MAX_PAGE, FILTER_VALIDATE_INT) ?: MAX_PAGE;
  $limit = min(MAX_PAGE, max(1, $requested));
  $rows = readPage($dir, $page); // Exactly one bounded server page; no full-collection read.
  if (($_GET['view'] ?? '') === 'featured') { $rows = array_values(array_filter($rows, fn($x) => !empty($x['destacado']))); $limit = min($limit, 8); }
  $items=array_slice($rows,$offset,$limit);
  $next=($offset+$limit<count($rows)) ? "$page:".($offset+$limit) : (is_file(pagePath($dir,$page+1)) ? (string)($page+1) : null);
  respond(['items'=>$items,'nextCursor'=>$next,'limit'=>$limit]);
}
if ($method === 'POST' && $action === 'login') {
  $secret=(string)(getenv('ANALIAJOYAS_ADMIN_KEY') ?: '');
  $body=json_decode((string)file_get_contents('php://input'),true) ?: [];
  if ($secret === '' || !hash_equals($secret,(string)($body['clave'] ?? ''))) respond(['error'=>'Acceso no configurado o clave incorrecta'],403);
  session_regenerate_id(true); $_SESSION['analia_admin']=true; respond(['ok'=>true]);
}
if ($method === 'GET' && $action === 'session') respond(['authenticated'=>!empty($_SESSION['analia_admin'])]);
if (empty($_SESSION['analia_admin'])) respond(['error'=>'Acceso no autorizado'],403);
if ($method === 'POST' && $action === 'logout') { session_destroy(); respond(['ok'=>true]); }
if ($method === 'POST' && $action === 'save') {
  $body=json_decode((string)file_get_contents('php://input'),true) ?: [];
  $item=$body['item'] ?? null; if (!is_array($item)) respond(['error'=>'Producto inválido'],400);
  $id=(string)($item['id'] ?? ''); $name=trim((string)($item['nombre'] ?? ''));
  if (!preg_match('/^[a-zA-Z0-9-]{1,48}$/',$id) || $name==='' || strlen($name)>150) respond(['error'=>'ID o nombre inválido'],400);
  $price=filter_var($item['precio'] ?? null,FILTER_VALIDATE_INT,['options'=>['min_range'=>0]]);
  $stock=filter_var($item['stock'] ?? null,FILTER_VALIDATE_INT,['options'=>['min_range'=>0]]);
  if ($price===false || $stock===false) respond(['error'=>'Precio o stock inválido'],400);
  $image=(string)($item['imagen'] ?? ''); if ($image!=='' && !preg_match('/^[a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg)$/',$image)) respond(['error'=>'Imagen inválida'],400);
  $safe=['id'=>$id,'nombre'=>$name,'categoria'=>substr(trim((string)($item['categoria'] ?? 'Joyas')),0,60),'imagen'=>$image,'precio'=>$price,'stock'=>$stock,'destacado'=>!empty($item['destacado']),'descripcion'=>substr(trim((string)($item['descripcion'] ?? '')),0,400)];
  $last=lastPage($dir);
  for($n=1;$n<=$last;$n++){ $rows=readPage($dir,$n); foreach($rows as $i=>$row){if(($row['id']??'')===$id){$rows[$i]=$safe;writePage($dir,$n,$rows);respond(['ok'=>true]);}} }
  $rows=readPage($dir,$last); if(count($rows)>=MAX_PAGE){$last++;$rows=[];} $rows[]=$safe;writePage($dir,$last,$rows);respond(['ok'=>true]);
}
if ($method === 'POST' && $action === 'delete') {
  $body=json_decode((string)file_get_contents('php://input'),true) ?: []; $id=(string)($body['id'] ?? '');
  for($n=1,$last=lastPage($dir);$n<=$last;$n++){ $rows=readPage($dir,$n); $kept=array_values(array_filter($rows,fn($r)=>($r['id']??'')!==$id)); if(count($kept)!==count($rows)){writePage($dir,$n,$kept);respond(['ok'=>true]);} }
  respond(['error'=>'No encontrado'],404);
}
respond(['error'=>'Ruta inválida'],404);
