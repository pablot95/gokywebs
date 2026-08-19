<?php
$payload = file_get_contents('php://input');
$data    = json_decode($payload, true);

$logDir  = __DIR__ . '/../logs';
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
$logFile = $logDir . '/webhook.log';

$entry = date('Y-m-d H:i:s') . ' | type=' . ($data['type'] ?? '-') . ' | data=' . json_encode($data['data'] ?? []) . PHP_EOL;
file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);

http_response_code(200);
echo 'OK';
?>
