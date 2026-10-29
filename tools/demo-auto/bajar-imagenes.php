<?php
/**
 * tools/demo-auto/bajar-imagenes.php — las imágenes que mandó cada prospecto
 * nuevo, bajadas solas (Pablo, 29-oct: «que esas imágenes se descarguen
 * automáticamente cuando se crean los prospectos, en la carpeta Descargas»).
 *
 *   php tools/demo-auto/bajar-imagenes.php
 *
 * Lo llama vigilar.ps1 en cada corrida. Mira los prospectos de los últimos 3
 * días que tienen imágenes (logoUrl trae la clave de la charla) y, por cada
 * uno nuevo —o que sumó imágenes desde la última vez—, baja el zip de
 * wabot/imagenes-bajar.php (firmado con la cuenta de servicio) a
 * data/imagenes/<negocio>.zip. Imprime un JSON por línea: {slug, nombre, zip}.
 * vigilar.ps1 lo descomprime en Descargas\imagenes-prospectos\<negocio>.
 *
 * La primera corrida solo anota «desde ahora»: no baja lo anterior.
 * Solo lee Firestore. Solo por consola.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../../wabot/cron-prospectos-chatgpt.php';
require_once __DIR__ . '/../../wabot/imagenes-bajar.php';

const BAJAR_IMAGENES_DIAS = 3;
const BAJAR_IMAGENES_URL = 'https://gokywebs.com/wabot/imagenes-bajar.php';

$datos = __DIR__ . '/data';
$carpetaZips = $datos . '/imagenes';
$archivoEstado = $datos . '/imagenes-estado.json';
if (!is_dir($carpetaZips)) mkdir($carpetaZips, 0755, true);

$estado = json_decode((string)@file_get_contents($archivoEstado), true);
if (!is_array($estado) || empty($estado['desde'])) {
    file_put_contents($archivoEstado, json_encode(['desde' => gmdate('Y-m-d\TH:i:s\Z'), 'hechos' => new stdClass()]));
    fwrite(STDERR, "Primera corrida: solo cuentan los prospectos desde ahora.\n");
    exit(0);
}
$hechos = (array)($estado['hechos'] ?? []);

try {
    $desde = max(strtotime($estado['desde']), time() - BAJAR_IMAGENES_DIAS * 86400);
    $docs = prospecto_chatgpt_nuevos(gmdate('Y-m-d\TH:i:s\Z', $desde));
} catch (Throwable $e) {
    fwrite(STDERR, 'Firestore: ' . $e->getMessage() . "\n");
    exit(1);
}

foreach ($docs as $id => $p) {
    $logoUrl = (string)($p['logoUrl'] ?? '');
    if ($logoUrl === '' || !preg_match('/[?&]tel=([0-9A-Za-z]+)/', $logoUrl, $m)) continue;
    $clave = $m[1];
    // Cambia si llega una imagen nueva (logoUrl o el contador).
    $marca = $logoUrl . '|' . (int)($p['imagenes_recibidas'] ?? 0);
    if (($hechos[$id] ?? '') === $marca) continue;

    [$nombre] = prospecto_chatgpt_negocio($p);
    $slug = prospecto_demo_slug($nombre) ?: strtolower($clave);

    $ch = curl_init(BAJAR_IMAGENES_URL . '?tel=' . rawurlencode($clave) . '&firma=' . imagenes_bajar_firma($clave));
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 120]);
    $cuerpo = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || substr((string)$cuerpo, 0, 2) !== 'PK') {
        fwrite(STDERR, "No se pudieron bajar las imágenes de $slug (HTTP $http).\n");
        continue;
    }
    $zip = $carpetaZips . '/' . $slug . '.zip';
    file_put_contents($zip, $cuerpo);
    $hechos[$id] = $marca;
    file_put_contents($archivoEstado, json_encode(['desde' => $estado['desde'], 'hechos' => $hechos]));
    echo json_encode(['slug' => $slug, 'nombre' => $nombre, 'zip' => realpath($zip)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
}
