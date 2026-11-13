<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function reply(array $body, int $status = 200): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') reply(['error'=>'Método no permitido'],405);
foreach ($_GET as $v) if (!is_string($v) || strlen($v)>4096) reply(['error'=>'Consulta inválida'],400);
try {
    $db = new PDO('sqlite:'.__DIR__.'/flowers.sqlite', null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA query_only=ON');
    if (isset($_GET['counts'])) {
        $counts = ['total'=>(int)$db->query('SELECT COUNT(*) FROM flowers')->fetchColumn()];
        foreach (['cat','color','band'] as $field) {
            $counts[$field] = $db->query("SELECT $field, COUNT(*) FROM flowers GROUP BY $field")->fetchAll(PDO::FETCH_KEY_PAIR);
        }
        $counts['ocasion'] = $db->query("SELECT value, COUNT(*) FROM flowers, json_each(flowers.occasions) GROUP BY value")->fetchAll(PDO::FETCH_KEY_PAIR);
        reply($counts);
    }
    $cap = ['home'=>8,'catalog'=>16,'detail'=>4,'lookup'=>100,'admin'=>100][$_GET['scope'] ?? 'catalog'] ?? 0;
    if (!$cap) reply(['error'=>'Vista inválida'],400);
    $limit = max(1,min($cap,(int)($_GET['limit'] ?? $cap)));
    $order = ['precio-asc'=>['price','ASC'],'precio-desc'=>['price','DESC'],'nombre'=>['name','ASC'],'destacados'=>['rank','ASC']][$_GET['order'] ?? 'destacados'] ?? ['rank','ASC'];
    [$key,$direction] = $order;
    $where=['1=1']; $args=[];
    foreach (['cat'=>'cat','color'=>'color','precio'=>'band','ocasion'=>'occasions','ids'=>'id','excluir'=>'id'] as $param=>$col) {
        if (empty($_GET[$param])) continue;
        $values=array_slice(explode(',',$_GET[$param]),0,100);
        $marks=implode(',',array_fill(0,count($values),'?'));
        $where[] = $param==='ocasion' ? "EXISTS (SELECT 1 FROM json_each(occasions) WHERE value IN ($marks))" : "$col ".($param==='excluir'?'NOT ':'')."IN ($marks)";
        array_push($args,...$values);
    }
    $query=mb_strtolower(trim($_GET['q'] ?? ''),'UTF-8');
    foreach (preg_split('/\s+/u',strtr($query,['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ñ'=>'n']),8,PREG_SPLIT_NO_EMPTY) as $word) {
        $where[]='instr(search,?)>0'; $args[]=$word;
    }
    $filters=implode(' AND ',$where);
    $st=$db->prepare("SELECT COUNT(*) FROM flowers WHERE $filters"); $st->execute($args); $total=(int)$st->fetchColumn();
    if (!empty($_GET['cursor'])) {
        $st=$db->prepare("SELECT $key FROM flowers WHERE id=?"); $st->execute([$_GET['cursor']]); $value=$st->fetchColumn();
        if ($value===false) reply(['error'=>'Cursor inválido'],400);
        $cmp=$direction==='ASC'?'>':'<';
        $filters.=" AND ($key $cmp ? OR ($key=? AND id>?))"; array_push($args,$value,$value,$_GET['cursor']);
    }
    $st=$db->prepare("SELECT payload FROM flowers WHERE $filters ORDER BY $key $direction,id LIMIT $limit");
    $st->execute($args);
    $items=array_map(fn($s)=>json_decode($s,true),$st->fetchAll(PDO::FETCH_COLUMN));
    $cursor=null;
    if (count($items)===$limit) {
        $last=end($items);
        $st=$db->prepare("SELECT $key FROM flowers WHERE id=?"); $st->execute([$last['id']]); $value=$st->fetchColumn();
        $cmp=$direction==='ASC'?'>':'<';
        $st=$db->prepare("SELECT 1 FROM flowers WHERE $filters AND ($key $cmp ? OR ($key=? AND id>?)) LIMIT 1");
        $st->execute([...$args,$value,$value,$last['id']]); if($st->fetchColumn()) $cursor=$last['id'];
    }
    reply(['items'=>$items,'cursor'=>$cursor,'total'=>$total]);
} catch (Throwable $e) {reply(['error'=>'No se pudo cargar el catálogo'],503);}
