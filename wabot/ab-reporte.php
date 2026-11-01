<?php
/**
 * wabot/ab-reporte.php — cómo va la prueba A/B de precios (31-oct-2026, ab-precios.php).
 *
 * Por grupo (A: pago único o mensual; B: pago inicial + mensualidad) y por
 * plan (sitio profesional sin panel / con panel: tienda, cursos, inmobiliaria,
 * reservas), cuántas charlas recibieron el precio, a cuántas se les ofreció la
 * demo, cuántas recibieron el link del formulario y cuántas lo completaron.
 * El formulario se cuenta dentro de las 72 h del precio y solo sobre las
 * charlas que ya cumplieron esas 72 h, para no castigar a las más nuevas.
 * Los cobros se cruzan en el admin: Inversión → Precios A vs B (1-nov).
 *
 * Uso:
 *   https://gokywebs.com/wabot/ab-reporte.php?clave=VERIFY_TOKEN
 *   https://gokywebs.com/wabot/ab-reporte.php?clave=VERIFY_TOKEN&formato=json
 *   php ab-reporte.php                                        (CLI, JSON)
 */

require_once __DIR__ . '/lib.php';

if (php_sapi_name() !== 'cli') {
    $auth   = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    $bearer = preg_match('/^Bearer\s+(.+)$/i', $auth, $m) ? trim($m[1]) : '';
    $clave  = $bearer !== '' ? $bearer : (string)($_GET['clave'] ?? '');
    if ($clave === '' || !hash_equals(WABOT_VERIFY_TOKEN, $clave)) {
        http_response_code(404);
        exit;
    }
}
$formato = (string)($_GET['formato'] ?? (php_sapi_name() === 'cli' ? 'json' : 'html'));

// Las cuentas están en ab-precios.php: el admin las muestra en Inversión → Precios A vs B (1-nov).
require_once __DIR__ . '/ab-precios.php';

$filas = wabot_ab_reporte_calcular()['filas'];
if ($formato === 'json') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($filas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
    exit;
}
$e = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
$nombres = ['a' => 'A · pago único o mensual', 'b' => 'B · inicial + mensual'];
$planes = ['sitio' => 'Sitio profesional', 'con_panel' => 'Tienda y con panel'];
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Prueba de precios A/B — Gokywebs</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #1a1a1a; background: #fafafa; }
  h1 { font-size: 1.3rem; }
  p.nota { color: #555; max-width: 70ch; }
  .tabla { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; background: #fff; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: right; font-size: 0.9rem; white-space: nowrap; }
  th { background: #f0f0f0; }
  th:first-child, td:first-child, th:nth-child(2), td:nth-child(2) { text-align: left; }
</style>
</head>
<body>
<h1>Prueba de precios A/B</h1>
<p class="nota">Charlas que recibieron el precio desde que arrancó la prueba. La conversión es formulario completado dentro de las 72 h del precio, sobre las charlas que ya cumplieron 72 h. Los cobros, cruzados con los clientes, se ven en el admin: Inversión → Precios A vs B.</p>
<div class="tabla"><table>
<tr><th>Grupo</th><th>Plan</th><th>Precio</th><th>Demo ofrecida</th><th>Link del form</th><th>Form (total)</th><th>Con 72 h</th><th>Form en 72 h</th><th>Conversión 72 h</th><th>Pidió pago único</th></tr>
<?php foreach ($filas as $f): ?>
<tr><td><?= $e($nombres[$f['grupo']]) ?></td><td><?= $e($planes[$f['plan']]) ?></td><td><?= (int)$f['precio'] ?></td><td><?= (int)$f['demo_ofrecida'] ?></td>
<td><?= (int)$f['link_form'] ?></td><td><?= (int)$f['form'] ?></td><td><?= (int)$f['maduras_72h'] ?></td><td><?= (int)$f['form_72h'] ?></td>
<td><?= $f['conversion_72h'] === null ? '—' : $e(number_format($f['conversion_72h'], 1, ',', '.') . ' %') ?></td><td><?= (int)$f['eligio_pago_unico'] ?></td></tr>
<?php endforeach; ?>
<?php if (!$filas): ?><tr><td colspan="10" style="text-align:center">Todavía no hay charlas con precio de la prueba.</td></tr><?php endif; ?>
</table></div>
</body>
</html>
