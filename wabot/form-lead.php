<?php
require_once __DIR__ . '/redactor.php';

header('Access-Control-Allow-Origin: https://gokywebs.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 4000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'body_invalido']);
    exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'json_invalido']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$cfg = wabot_config_load();
$res = wabot_form_lead_procesar($payload, $cfg);

if (empty($res['ok']) && !empty($res['reintentar'])) {
    http_response_code(200);
    echo json_encode($res);
    exit;
}
if (empty($res['ok'])) {
    http_response_code(400);
    echo json_encode($res);
    exit;
}

http_response_code(200);
echo json_encode($res);
