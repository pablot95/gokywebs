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
 * Los cobros se miran en el admin (el boceto lleva `grupoPrecios`).
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

/** Las cuentas de la prueba, leyendo las charlas guardadas. */
function wabot_ab_reporte_calcular($ahora = null) {
    $ahora = $ahora ?? time();
    $ventana = 72 * 3600;
    $filas = [];
    foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $archivo) {
        $cv = json_decode((string)@file_get_contents($archivo), true);
        if (!is_array($cv)) continue;
        $cot = is_array($cv['comercial_cotizacion'] ?? null) ? $cv['comercial_cotizacion'] : [];
        $grupo = (string)($cot['modelo'] ?? '');
        if (!in_array($grupo, ['a', 'b'], true)) continue;
        $plan = ($cot['plan'] ?? '') === 'informativa' ? 'sitio' : 'con_panel';
        $desde = (int)($cv['ab_grupo_ts'] ?? ($cot['ts'] ?? 0));
        $clave = $grupo . '|' . $plan;
        $f = $filas[$clave] ?? ['grupo' => $grupo, 'plan' => $plan, 'precio' => 0, 'demo_ofrecida' => 0, 'link_form' => 0,
                                'form' => 0, 'maduras_72h' => 0, 'form_72h' => 0, 'eligio_pago_unico' => 0];
        $f['precio']++;
        if (!empty($cv['comercial_oferta_ts']) || !empty($cv['oferta_diseno_ts'])) $f['demo_ofrecida']++;
        if (!empty($cv['form_link_mandado_ts'])) $f['link_form']++;
        $formTs = (int)($cv['form_completado_ts'] ?? 0);
        if ($formTs > 0) $f['form']++;
        if (($cv['modalidad_elegida'] ?? '') === 'propia') $f['eligio_pago_unico']++;
        if ($desde > 0 && $ahora - $desde >= $ventana) {
            $f['maduras_72h']++;
            if ($formTs > 0 && $formTs - $desde <= $ventana) $f['form_72h']++;
        }
        $filas[$clave] = $f;
    }
    ksort($filas);
    foreach ($filas as &$f) $f['conversion_72h'] = $f['maduras_72h'] > 0 ? round(100 * $f['form_72h'] / $f['maduras_72h'], 1) : null;
    unset($f);
    return array_values($filas);
}

$filas = wabot_ab_reporte_calcular();
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
<p class="nota">Charlas que recibieron el precio desde que arrancó la prueba. La conversión es formulario completado dentro de las 72 h del precio, sobre las charlas que ya cumplieron 72 h. Los cobros se ven en el admin: el boceto lleva el grupo.</p>
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
