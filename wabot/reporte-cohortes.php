<?php
/**
 * wabot/reporte-cohortes.php — inversión en Meta vs. prospectos, por cohorte.
 *
 * La misma vista vive integrada en el panel (admin.php?tab=cohortes); esto es
 * para automatizar (cron, JSON) o mirarla sin loguearse en el panel. La
 * lógica de agrupar por cohorte vive una sola vez en wabot_cohortes_calcular()
 * (lib.php), acá solo se resuelve auth + parámetros + formato de salida.
 *
 * Uso:
 *   https://gokywebs.com/wabot/reporte-cohortes.php?clave=VERIFY_TOKEN
 *   https://gokywebs.com/wabot/reporte-cohortes.php?clave=VERIFY_TOKEN&desde=2026-09-20&formato=json
 *   php reporte-cohortes.php                               (CLI, sin clave)
 *
 * "desde" default: domingo 20-sep-2026, pedido por Pablo. Si se pasa otra
 * fecha que no caiga domingo, wabot_cohortes_calcular() retrocede al domingo
 * de esa semana: las cohortes siempre arrancan domingo.
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

$desdeParam = (string)($_GET['desde'] ?? '2026-09-20');
$desde = strtotime($desdeParam . ' 00:00:00') ?: strtotime('2026-09-20 00:00:00');
$hasta = strtotime((string)($_GET['hasta'] ?? 'now')) ?: time();
$formato = (string)($_GET['formato'] ?? (php_sapi_name() === 'cli' ? 'json' : 'html'));

$semanas = wabot_cohortes_calcular($desde, $hasta);

if ($formato === 'json') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_values($semanas), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
    exit;
}

/* ── HTML: una tabla resumen y, por semana, el desglose por anuncio + detalle ── */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Cohortes de prospectos — Gokywebs</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 24px; color: #1a1a1a; background: #fafafa; }
  h1 { font-size: 1.3rem; }
  p.nota { color: #555; max-width: 70ch; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0 28px; background: #fff; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: right; font-size: 0.9rem; }
  th { background: #f0f0f0; text-align: right; }
  th:first-child, td:first-child, th:nth-child(2), td:nth-child(2) { text-align: left; }
  .semana { margin-top: 36px; }
  .semana h2 { font-size: 1.05rem; margin-bottom: 4px; }
  .chico { font-size: 0.82rem; color: #666; }
  details summary { cursor: pointer; color: #555; margin: 6px 0; }
</style>
</head>
<body>
<h1>Inversión en Meta vs. prospectos — cohortes domingo a sábado</h1>
<p class="nota">
  Cada conversación se cuenta en la semana en que escribió por PRIMERA vez, no
  en la semana en que pagó. Compará la columna de gasto (la ves en Meta Ads
  Manager, filtrando por esas mismas fechas domingo-sábado) contra "prospectos"
  o "pagos" de esa fila — nunca contra el gasto del mismo día. Las últimas
  semanas todavía pueden sumar pagos que hoy no aparecen: un lead de hace 5
  días puede convertir en 10 más.
</p>

<table>
  <tr>
    <th>Semana</th><th>Contactos</th><th>De anuncio</th>
    <th>Prospectos</th><th>Prospectos de anuncio</th>
    <th>Pagos</th><th>Pagos de anuncio</th><th>Días prom. hasta pago</th>
  </tr>
  <?php foreach ($semanas as $s): ?>
  <tr>
    <td><?= htmlspecialchars($s['desde']) ?> a <?= htmlspecialchars($s['hasta']) ?></td>
    <td><?= $s['total_contactos'] ?></td>
    <td><?= $s['contactos_anuncio'] ?></td>
    <td><?= $s['prospectos'] ?></td>
    <td><?= $s['prospectos_anuncio'] ?></td>
    <td><?= $s['pagos'] ?></td>
    <td><?= $s['pagos_anuncio'] ?></td>
    <td><?= $s['promedio_dias_hasta_pago'] ?? '—' ?></td>
  </tr>
  <?php endforeach; ?>
</table>

<?php foreach ($semanas as $s): ?>
  <div class="semana">
    <h2><?= htmlspecialchars($s['desde']) ?> a <?= htmlspecialchars($s['hasta']) ?></h2>

    <?php if ($s['anuncios']): ?>
      <table>
        <tr><th>Anuncio</th><th>Contactos</th><th>Prospectos</th><th>Pagos</th></tr>
        <?php foreach ($s['anuncios'] as $titular => $a): ?>
        <tr>
          <td><?= htmlspecialchars($titular) ?></td>
          <td><?= $a['contactos'] ?></td>
          <td><?= $a['prospectos'] ?></td>
          <td><?= $a['pagos'] ?></td>
        </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p class="chico">Ningún contacto de esta semana trae ctwa_clid (ni un anuncio de click-to-WhatsApp).</p>
    <?php endif; ?>

    <details>
      <summary>Ver el detalle de cada contacto (<?= count($s['detalle']) ?>)</summary>
      <table>
        <tr>
          <th>Nombre</th><th>Canal</th><th>Contacto</th><th>Anuncio</th>
          <th>Prospecto</th><th>Pagó</th><th>Fecha pago</th><th>Días hasta pago</th><th>Modalidad</th>
        </tr>
        <?php foreach ($s['detalle'] as $d): ?>
        <tr>
          <td><?= htmlspecialchars($d['nombre'] ?: $d['tel']) ?></td>
          <td><?= htmlspecialchars($d['canal']) ?></td>
          <td><?= htmlspecialchars($d['fecha_contacto']) ?></td>
          <td><?= htmlspecialchars($d['anuncio']) ?></td>
          <td><?= $d['prospecto'] ? 'sí' : '' ?></td>
          <td><?= $d['pago'] ? 'sí' : '' ?></td>
          <td><?= htmlspecialchars($d['fecha_pago']) ?></td>
          <td><?= $d['dias_hasta_pago'] ?? '' ?></td>
          <td><?= htmlspecialchars($d['modalidad']) ?></td>
        </tr>
        <?php endforeach; ?>
      </table>
    </details>
  </div>
<?php endforeach; ?>

</body>
</html>
