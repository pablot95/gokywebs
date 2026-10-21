<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function failRequest(string $message): never { http_response_code(400); echo json_encode(['error'=>$message]); exit; }
function normalized(string $value): string { $value=mb_strtolower($value,'UTF-8'); return strtr($value,['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']); }
$limit=min(100,max(1,(int)($_GET['limit']??16)));
$q=mb_substr(trim((string)($_GET['q']??'')),0,120);
$cat=(string)($_GET['cat']??'');
if (!in_array($cat,['','natural','decorativa','souvenirs','regalos'],true)) $cat='';
$order=(string)($_GET['orden']??'original');
if (!in_array($order,['original','menor','mayor'],true)) $order='original';
$id=isset($_GET['id'])?max(0,(int)$_GET['id']):0;
$signature=hash('sha256',$q.'|'.$cat.'|'.$order.'|'.$id);
$offset=15;
$cursor=(string)($_GET['cursor']??'');
if ($cursor!=='') {
 if(strlen($cursor)>250) failRequest('Cursor inválido');
 $decoded=json_decode(base64_decode($cursor,true)?:'',true);
 if(!is_array($decoded)||!isset($decoded['offset'],$decoded['scope'])||!is_int($decoded['offset'])||$decoded['offset']<15||!hash_equals($signature,(string)$decoded['scope'])) failRequest('Cursor inválido para esta consulta');
 $offset=$decoded['offset'];
}
$file=__DIR__.'/productos-'.$order.'.php';
$handle=fopen($file,'rb');
if(!$handle){http_response_code(503);echo json_encode(['error'=>'Catálogo no disponible']);exit;}
if($offset>filesize($file)){fclose($handle);failRequest('Cursor fuera de rango');}
fseek($handle,$offset);
$items=[];
while(count($items)<$limit && ($line=fgets($handle))!==false){
 $p=json_decode($line,true);
 if(!is_array($p))continue;
 if($id>0 && (int)$p['id']!==$id)continue;
 if($cat!=='' && $p['categoria']!==$cat)continue;
 $haystack=normalized($p['nombre'].' '.$p['categoria'].' '.$p['descripcion']);
 $words=preg_split('/\s+/u',normalized($q),-1,PREG_SPLIT_NO_EMPTY);
 $match=true;foreach($words as $word){if(!str_contains($haystack,$word)){$match=false;break;}}
 if(!$match)continue;
 $items[]=$p;
}
$nextOffset=ftell($handle);
$hasMore=$id===0 && $nextOffset<filesize($file);
fclose($handle);
$next=$hasMore?base64_encode(json_encode(['offset'=>$nextOffset,'scope'=>$signature])):null;
echo json_encode(['items'=>$items,'nextCursor'=>$next,'hasMore'=>$hasMore,'limit'=>$limit],JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);
