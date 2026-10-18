<?php
/**
 * tools/demo-auto/preparar.php — de un zip de imágenes de ChatGPT a un pedido de
 * demo (Pablo, 18-oct: «cuando llega el zip con las imágenes, que crees la
 * carpeta en demo y crees el demo, obteniendo la info de cada prospecto»).
 *
 *   php tools/demo-auto/preparar.php "C:\Users\pablo\Downloads\Algo.zip"
 *
 * Busca el prospecto en `propuestas` y, si ya pasó a Clientes, en el
 * propuestaSnapshot de `clientes` (Firestore, cuenta de servicio): primero
 * por el id dentro del nombre del zip (el asunto del mail de ChatGPT es
 * «Gokywebs Copiar 10 | <id>»), después por el nombre del negocio. Escribe el
 * pedido (el mismo texto del botón «Copiar» del admin) en data/pedidos/ y
 * devuelve un JSON: {ok, id, nombre, slug, carpeta, pedido} o {ok:false, error}.
 * Solo lee Firestore. Lo llama vigilar.ps1; solo por consola.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../../wabot/cron-prospectos-chatgpt.php';

const DEMO_AUTO_DIAS = 21;   // los prospectos de las últimas 3 semanas

/** El nombre del zip comparable con el slug de un negocio: «Suan_Baby_6_imágenes.zip» → «suanbaby6imagenes». */
function demo_auto_normalizar(string $texto): string {
    return prospecto_demo_slug(preg_replace('/\.zip$/i', '', $texto));
}

/**
 * El prospecto del zip entre los candidatos [id => campos]. Gana el id escrito
 * en el nombre; si no, el negocio cuyo slug aparece en el nombre (el más largo
 * y, si empatan, el más nuevo). Devuelve [id, campos] o un string con el error.
 */
function demo_auto_elegir(string $nombreZip, array $docs) {
    foreach ($docs as $id => $p) {
        if (strlen($id) >= 15 && strpos($nombreZip, $id) !== false) return [$id, $p];
    }
    $norm = demo_auto_normalizar($nombreZip);
    $candidatos = [];
    foreach ($docs as $id => $p) {
        [$nombre] = prospecto_chatgpt_negocio($p);
        $slug = prospecto_demo_slug($nombre);
        if (strlen($slug) >= 3 && strpos($norm, $slug) !== false) $candidatos[] = [$id, $p, $slug];
    }
    if (!$candidatos) return 'Ningún prospecto de las últimas ' . (DEMO_AUTO_DIAS / 7) . ' semanas coincide con «' . $nombreZip . '».';
    usort($candidatos, function ($a, $b) {
        return strlen($b[2]) <=> strlen($a[2]) ?: strcmp((string)($b[1]['createdAt'] ?? ''), (string)($a[1]['createdAt'] ?? ''));
    });
    // Dos negocios distintos con el mismo slug: no se adivina.
    if (count($candidatos) > 1 && $candidatos[0][2] === $candidatos[1][2] && $candidatos[0][0] !== $candidatos[1][0]) {
        return 'Hay más de un prospecto «' . $candidatos[0][2] . '»: ' . $candidatos[0][0] . ' y ' . $candidatos[1][0] . '.';
    }
    return [$candidatos[0][0], $candidatos[0][1]];
}

/**
 * Los prospectos de las últimas semanas: los de `propuestas` y, por si Pablo ya
 * lo pasó a Clientes antes de que llegara el zip (la propuesta se borra al
 * convertirla), los de `clientes` con los datos del form en propuestaSnapshot.
 */
function demo_auto_candidatos(): array {
    $desde = gmdate('Y-m-d\TH:i:s\Z', time() - DEMO_AUTO_DIAS * 86400);
    $docs = prospecto_chatgpt_nuevos($desde);
    $sa = wabot_push_cuenta();
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents:runQuery');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['structuredQuery' => [
            'from' => [['collectionId' => 'clientes']],
            'where' => ['fieldFilter' => ['field' => ['fieldPath' => 'createdAt'], 'op' => 'GREATER_THAN_OR_EQUAL',
                                          'value' => ['timestampValue' => $desde]]],
        ]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas = json_decode((string)$res, true))) {
        throw new RuntimeException('No se pudo consultar clientes (HTTP ' . $http . ').');
    }
    foreach ($filas as $fila) {
        if (empty($fila['document']['name'])) continue;
        $c = array_map('prospecto_chatgpt_firestore_valor', $fila['document']['fields'] ?? []);
        $snap = is_array($c['propuestaSnapshot'] ?? null) ? $c['propuestaSnapshot'] : [];
        $id = (string)($c['propuestaId'] ?? '') ?: 'clientes/' . basename($fila['document']['name']);
        // La misma persona puede estar en las dos colecciones: vale la propuesta.
        if (!isset($docs[$id]) && $snap) $docs[$id] = $snap + ['createdAt' => $c['createdAt'] ?? ''];
    }
    return $docs;
}

function demo_auto_salir(array $r): void {
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
    exit(!empty($r['ok']) ? 0 : 1);
}

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $zip = (string)($argv[1] ?? '');
    if ($zip === '' || !is_file($zip)) demo_auto_salir(['ok' => false, 'error' => 'No existe el zip: ' . $zip]);
    try {
        $docs = demo_auto_candidatos();
    } catch (Throwable $e) {
        demo_auto_salir(['ok' => false, 'error' => 'Firestore: ' . $e->getMessage()]);
    }
    $elegido = demo_auto_elegir(basename($zip), $docs);
    if (is_string($elegido)) demo_auto_salir(['ok' => false, 'error' => $elegido]);
    [$id, $p] = $elegido;
    [$nombre] = prospecto_chatgpt_negocio($p);
    $slug = prospecto_demo_slug($nombre);
    if ($slug === '') demo_auto_salir(['ok' => false, 'error' => 'El prospecto ' . $id . ' no tiene nombre de negocio.']);

    $raiz = realpath(__DIR__ . '/../..');
    $carpeta = $raiz . DIRECTORY_SEPARATOR . 'demo' . DIRECTORY_SEPARATOR . $slug;
    if (is_file($carpeta . DIRECTORY_SEPARATOR . 'index.html')) {
        demo_auto_salir(['ok' => false, 'id' => $id, 'slug' => $slug,
            'error' => 'Ya existe demo/' . $slug . '/index.html: puede ser otro negocio con el mismo nombre. Decidilo a mano.']);
    }
    $dirPedidos = __DIR__ . '/data/pedidos';
    if (!is_dir($dirPedidos)) mkdir($dirPedidos, 0755, true);
    $pedido = $dirPedidos . '/' . date('Ymd-His') . '-' . $slug . '.txt';
    file_put_contents($pedido, prospecto_demo_pedido($p));
    demo_auto_salir(['ok' => true, 'id' => $id, 'nombre' => $nombre, 'slug' => $slug,
                     'carpeta' => $carpeta, 'pedido' => realpath($pedido)]);
}
