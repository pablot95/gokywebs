<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$requested = filter_var($_GET['limit'] ?? null, FILTER_VALIDATE_INT);
$limit = max(1, min(100, $requested ?: 16));
$scope = (string) ($_GET['scope'] ?? 'catalogo');
if (!in_array($scope, ['catalogo', 'iphone', 'destacados', 'ids', 'admin'], true)) {
    $scope = 'catalogo';
}
$query = trim((string) ($_GET['q'] ?? ''));
$categoria = trim((string) ($_GET['categoria'] ?? ''));
$sub = trim((string) ($_GET['sub'] ?? ''));
$talle = trim((string) ($_GET['talle'] ?? ''));
$condicion = trim((string) ($_GET['condicion'] ?? ''));
$precioMax = filter_var($_GET['precio_max'] ?? null, FILTER_VALIDATE_INT);
$orden = (string) ($_GET['orden'] ?? 'nuevo');
if (!in_array($orden, ['nuevo', 'precio-asc', 'precio-desc'], true)) {
    $orden = 'nuevo';
}
$ids = array_slice(array_values(array_filter(array_map('trim', explode(',', (string) ($_GET['ids'] ?? ''))))), 0, 50);
$id = trim((string) ($_GET['id'] ?? ''));
if ($id !== '') {
    $ids[] = $id;
}
if ($scope === 'ids' && !$ids) {
    echo json_encode(['items' => [], 'nextCursor' => null, 'total' => 0, 'limit' => $limit]);
    exit;
}

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
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
        'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ñ' => 'n',
    ]));
};
$precioFinal = static function (array $item): int {
    $precio = (int) ($item['precio'] ?? 0);
    $descuento = (int) ($item['descuento'] ?? 0);
    return $descuento > 0 ? (int) round($precio * (1 - $descuento / 100)) : $precio;
};
$tokens = $query === '' ? [] : preg_split('/\s+/', $normalize($query));
$sinOrden = $orden === 'nuevo';
$items = [];
$coincidencias = [];
$total = 0;

while (($line = fgets($file)) !== false) {
    $item = json_decode($line, true);
    if (!is_array($item)) continue;
    $cat = (string) ($item['categoria'] ?? '');
    if ($scope !== 'admin' && empty($item['visible'])) continue;
    if ($scope === 'catalogo' && $cat === 'iPhone') continue;
    if ($scope === 'iphone' && $cat !== 'iPhone') continue;
    if ($scope === 'destacados' && empty($item['destacado'])) continue;
    if ($scope === 'ids' && !in_array((string) ($item['id'] ?? ''), $ids, true)) continue;
    if ($categoria !== '' && $cat !== $categoria) continue;
    if ($sub !== '' && ($item['subcategoria'] ?? '') !== $sub) continue;
    if ($condicion !== '' && ($item['condicion'] ?? '') !== $condicion) continue;
    if ($talle !== '' && !in_array($talle, $item['variantes']['opciones'] ?? [], true)) continue;
    if ($precioMax && $precioFinal($item) > $precioMax) continue;
    if ($tokens) {
        $text = $normalize(implode(' ', [
            $item['nombre'] ?? '', $item['categoria'] ?? '', $item['subcategoria'] ?? '',
            $item['descripcion'] ?? '', $item['etiquetas'] ?? '', $item['color'] ?? '', $item['condicion'] ?? '',
        ]));
        foreach ($tokens as $token) {
            if ($token !== '' && strpos($text, $token) === false) continue 2;
        }
    }
    if ($sinOrden) {
        if ($total >= $offset && count($items) < $limit) {
            $items[] = $item;
        }
        $total++;
    } else {
        $coincidencias[] = $item;
    }
}
fclose($file);

if (!$sinOrden) {
    usort($coincidencias, static function (array $a, array $b) use ($precioFinal, $orden): int {
        $cmp = $precioFinal($a) <=> $precioFinal($b);
        return $orden === 'precio-desc' ? -$cmp : $cmp;
    });
    $total = count($coincidencias);
    $items = array_slice($coincidencias, $offset, $limit);
}

$siguiente = $offset + count($items);
$nextCursor = ($siguiente < $total && count($items) === $limit)
    ? rtrim(strtr(base64_encode((string) $siguiente), '+/', '-_'), '=')
    : null;

echo json_encode(['items' => $items, 'nextCursor' => $nextCursor, 'total' => $total, 'limit' => $limit], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
