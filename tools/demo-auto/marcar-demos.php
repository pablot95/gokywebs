<?php
/**
 * tools/demo-auto/marcar-demos.php — marca en el admin las demos ya hechas y quién las hizo
 * (Pablo, 3-nov: «marcar todas las demos hechas en admin, asignarles si fue claude o gpt y
 * que a futuro se autoasignen»).
 *
 *   php tools/demo-auto/marcar-demos.php [--simular]
 *
 * Quién hizo cada demo sale del historial de git, con la misma regla que admin/demos-autor.mjs
 * (lo corre con SALIDA=data/demos-autor.json): el commit que creó demo/<slug>/ con firma de
 * Claude es de Claude, el resto de ChatGPT. Para cada boceto (`propuestas`) desde el 4-oct
 * cuya demo existe (demo/<slug>/index.html en disco y en git) prende `bocetoHecho` y, si nadie
 * lo eligió, pone `demoPor`. A los clientes que ya pasaron (la propuesta se borra) les pone
 * solo `demoPor`. Cada documento se toca una sola vez (data/demos-marcadas.json), para no
 * pisar lo que Pablo cambie a mano después.
 * Lo corre vigilar.ps1 -Modo imagenes (tarea de Windows cada 20 min).
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../../wabot/cron-prospectos-chatgpt.php';

const MARCAR_DEMOS_DESDE = '2026-10-04T03:00:00Z';
const MARCAR_DEMOS_ESTADO = __DIR__ . '/data/demos-marcadas.json';
const MARCAR_DEMOS_AUTORES = __DIR__ . '/data/demos-autor.json';

function marcar_demos_query(string $coleccion): array {
    $sa = wabot_push_cuenta();
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents:runQuery');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['structuredQuery' => [
            'from' => [['collectionId' => $coleccion]],
            'where' => ['fieldFilter' => ['field' => ['fieldPath' => 'createdAt'], 'op' => 'GREATER_THAN_OR_EQUAL',
                                          'value' => ['timestampValue' => MARCAR_DEMOS_DESDE]]],
        ]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas = json_decode((string)$res, true))) {
        throw new RuntimeException('No se pudo consultar ' . $coleccion . ' (HTTP ' . $http . ').');
    }
    $docs = [];
    foreach ($filas as $fila) {
        if (empty($fila['document']['name'])) continue;
        $docs[basename($fila['document']['name'])] = array_map('prospecto_chatgpt_firestore_valor', $fila['document']['fields'] ?? []);
    }
    return $docs;
}

/** PATCH solo de los campos dados; true si quedó escrito. */
function marcar_demos_patch(string $coleccion, string $id, array $campos): bool {
    $sa = wabot_push_cuenta();
    $mask = implode('&', array_map(fn($c) => 'updateMask.fieldPaths=' . rawurlencode($c), array_keys($campos)));
    $fields = [];
    foreach ($campos as $c => $v) $fields[$c] = is_bool($v) ? ['booleanValue' => $v] : ['stringValue' => (string)$v];
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id'])
        . '/databases/(default)/documents/' . $coleccion . '/' . rawurlencode($id) . '?' . $mask . '&currentDocument.exists=true');
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => $fields]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $http === 200;
}

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $simular = in_array('--simular', $argv, true);
    $repo = realpath(__DIR__ . '/../..');

    // Quién hizo cada demo, del historial de git.
    putenv('SALIDA=' . MARCAR_DEMOS_AUTORES);
    exec('node ' . escapeshellarg($repo . '/admin/demos-autor.mjs') . ' 2>&1', $salidaNode, $codigo);
    $autores = json_decode((string)@file_get_contents(MARCAR_DEMOS_AUTORES), true);
    if ($codigo !== 0 || !is_array($autores)) {
        fwrite(STDERR, "No se pudo leer el historial de git: " . implode(' ', $salidaNode) . "\n");
        exit(1);
    }
    $hecha = fn(string $slug) => $slug !== '' && isset($autores[$slug]) && is_file($repo . '/demo/' . $slug . '/index.html');

    $estado = json_decode((string)@file_get_contents(MARCAR_DEMOS_ESTADO), true);
    if (!is_array($estado)) $estado = [];
    $cambios = [];

    foreach (marcar_demos_query('propuestas') as $id => $p) {
        $clave = 'propuestas/' . $id;
        if (isset($estado[$clave])) continue;
        [$nombre] = prospecto_chatgpt_negocio($p);
        $slug = prospecto_demo_slug($nombre);
        if (!$hecha($slug)) continue;
        $campos = [];
        if (empty($p['bocetoHecho'])) $campos['bocetoHecho'] = true;
        if (!in_array($p['demoPor'] ?? '', ['claude', 'chatgpt'], true)) $campos['demoPor'] = $autores[$slug]['por'];
        $cambios[] = [$clave, $slug, $campos];
    }
    foreach (marcar_demos_query('clientes') as $id => $c) {
        $clave = 'clientes/' . $id;
        if (isset($estado[$clave])) continue;
        $snap = is_array($c['propuestaSnapshot'] ?? null) ? $c['propuestaSnapshot'] : [];
        [$nombreSnap] = prospecto_chatgpt_negocio($snap);
        $slug = '';
        foreach ([(string)($c['proyecto'] ?? ''), $nombreSnap] as $n) {
            if ($hecha(prospecto_demo_slug($n))) { $slug = prospecto_demo_slug($n); break; }
        }
        if ($slug === '') continue;
        $campos = [];
        if (!in_array($c['demoPor'] ?? '', ['claude', 'chatgpt'], true) && !in_array($snap['demoPor'] ?? '', ['claude', 'chatgpt'], true)) {
            $campos['demoPor'] = $autores[$slug]['por'];
        }
        $cambios[] = [$clave, $slug, $campos];
    }

    $n = ['bocetoHecho' => 0, 'claude' => 0, 'chatgpt' => 0];
    foreach ($cambios as [$clave, $slug, $campos]) {
        [$coleccion, $id] = explode('/', $clave, 2);
        if ($campos && !$simular && !marcar_demos_patch($coleccion, $id, $campos)) {
            echo "falló $clave ($slug)\n";
            continue;
        }
        if (!empty($campos['bocetoHecho'])) $n['bocetoHecho']++;
        if (isset($campos['demoPor'])) $n[$campos['demoPor']]++;
        if ($campos) echo ($simular ? '[simulado] ' : '') . "$clave $slug " . json_encode($campos) . "\n";
        if (!$simular) $estado[$clave] = $slug;
    }
    if (!$simular) wabot_json_guardar_atomico(MARCAR_DEMOS_ESTADO, $estado);
    echo json_encode(['ok' => true, 'revisados' => count($cambios), 'bocetoHecho' => $n['bocetoHecho'],
                      'claude' => $n['claude'], 'chatgpt' => $n['chatgpt']], JSON_UNESCAPED_UNICODE), "\n";
}
