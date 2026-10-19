<?php
/**
 * tools/demo-auto/marcar-boceto.php — deja prendido «Boceto hecho» en el prospecto cuando la
 * demo automática salió bien (Pablo, 18-oct: «boceto hecho no está marcado»).
 *
 *   php tools/demo-auto/marcar-boceto.php <id de la propuesta>
 *
 * Escribe solo `bocetoHecho: true` en `propuestas/<id>` (el mismo campo del botón del admin,
 * que es solo visual) con la cuenta de servicio. Si el prospecto ya pasó a Clientes (la
 * propuesta se borra al convertirla) no hay botón que marcar y sale sin tocar nada.
 * Lo llama vigilar.ps1; devuelve un JSON {ok, ...}.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../../wabot/cron-prospectos-chatgpt.php';

function boceto_salir(array $r): void {
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
    exit(!empty($r['ok']) ? 0 : 1);
}

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $id = (string)($argv[1] ?? '');
    if ($id === '' || strpos($id, '/') !== false) boceto_salir(['ok' => false, 'error' => 'Sin propuesta que marcar (id: «' . $id . '»).']);

    $sa = wabot_push_cuenta();
    $url = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id'])
         . '/databases/(default)/documents/propuestas/' . rawurlencode($id)
         . '?updateMask.fieldPaths=bocetoHecho&currentDocument.exists=true';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => ['bocetoHecho' => ['booleanValue' => true]]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http === 404 || $http === 400) boceto_salir(['ok' => false, 'error' => 'No hay propuesta ' . $id . ' (¿ya pasó a Clientes?).']);
    if ($http !== 200) boceto_salir(['ok' => false, 'error' => 'Firestore HTTP ' . $http . ': ' . substr((string)$res, 0, 200)]);
    boceto_salir(['ok' => true, 'id' => $id]);
}
