<?php

require_once __DIR__ . '/qrcode.php';
require_once __DIR__ . '/pdf.php';

function comprobante_nombre_archivo($factura)
{
    return 'Factura C ' . str_pad($factura['puntoVenta'], 5, '0', STR_PAD_LEFT)
        . '-' . str_pad($factura['numero'], 8, '0', STR_PAD_LEFT) . '.pdf';
}

function comprobante_pdf($config, $factura)
{
    $emisor = $config['emisor'];
    $receptor = comprobante_receptor($factura);
    $pdf = new Pdf();

    $izq = 40;
    $der = Pdf::ANCHO - 40;
    $ancho = $der - $izq;
    $y = 42;

    if ($config['entorno'] !== 'produccion') {
        $pdf->rectangulo($izq, $y, $ancho, 20, 0.8, 0.93);
        $pdf->texto($izq + 8, $y + 14, 'COMPROBANTE DE PRUEBA - homologación, sin validez fiscal', 'F2', 9);
        $y += 30;
    }

    $medio = $izq + $ancho / 2;
    $faltante = '[completar]';
    $razon = $emisor['razonSocial'] !== '' ? $emisor['razonSocial'] : $faltante;
    $domicilio = $emisor['domicilio'] !== '' ? $emisor['domicilio'] : $faltante;
    $inicio = $emisor['inicioActividades'] !== '' ? $emisor['inicioActividades'] : $faltante;

    $xIzq = $izq + 12;
    $topeIzq = $medio - 32;
    $etiquetaDomicilio = 'Domicilio Comercial: ';
    $xDomicilio = $xIzq + Pdf::ancho($etiquetaDomicilio, 'F2', 8);
    $lineasDomicilio = Pdf::envolver($domicilio, 'F1', 8, $topeIzq - $xDomicilio);

    $contenidoCab = 51 + count($lineasDomicilio) * 11 + 2;
    $altoCab = max(96, $contenidoCab + 26);

    $pdf->rectangulo($izq, $y, $ancho, $altoCab, 1.2);
    $pdf->linea($medio - 26, $y, $medio - 26, $y + $altoCab, 1.2);
    $pdf->linea($medio + 26, $y, $medio + 26, $y + $altoCab, 1.2);
    $pdf->textoCentrado($medio, $y + 32, 'C', 'F2', 30);
    $pdf->textoCentrado($medio, $y + 46, 'COD. ' . str_pad($factura['tipoComprobante'], 2, '0', STR_PAD_LEFT), 'F1', 7.5);

    $yl = $y + 20;
    $pdf->texto($xIzq, $yl, Pdf::recortar($razon, 'F2', 13, $topeIzq - $xIzq), 'F2', 13);
    $yl += 18;
    $pdf->texto($xIzq, $yl, 'Razón Social: ', 'F2', 8)
        ->texto($xIzq + Pdf::ancho('Razón Social: ', 'F2', 8), $yl, Pdf::recortar($razon, 'F1', 8, $topeIzq - $xIzq - Pdf::ancho('Razón Social: ', 'F2', 8)), 'F1', 8);
    $yl += 13;

    $pdf->texto($xIzq, $yl, $etiquetaDomicilio, 'F2', 8);
    foreach ($lineasDomicilio as $i => $linea) {
        $pdf->texto($i === 0 ? $xDomicilio : $xIzq, $yl, $linea, 'F1', 8);
        $yl += 11;
    }
    $yl += 2;

    $pdf->texto($xIzq, $yl, 'Condición frente al IVA: ', 'F2', 8)
        ->texto($xIzq + Pdf::ancho('Condición frente al IVA: ', 'F2', 8), $yl, $emisor['condicionIva'], 'F1', 8);

    $xr = $medio + 38;
    $yr = $y + 20;
    $pdf->texto($xr, $yr, 'FACTURA', 'F2', 15);
    $yr += 18;
    $cuitLindo = preg_replace('/^(\d{2})(\d{8})(\d)$/', '$1-$2-$3', $config['cuit']);
    foreach ([
        ['Punto de Venta: ', str_pad($factura['puntoVenta'], 5, '0', STR_PAD_LEFT) . '     Comp. Nro: ' . str_pad($factura['numero'], 8, '0', STR_PAD_LEFT)],
        ['Fecha de Emisión: ', comprobante_fecha($factura['fecha'])],
        ['CUIT: ', $cuitLindo],
        ['Inicio de Actividades: ', $inicio],
    ] as $par) {
        $pdf->texto($xr, $yr, $par[0], 'F2', 8)->texto($xr + Pdf::ancho($par[0], 'F2', 8), $yr, $par[1], 'F1', 8);
        $yr += 13;
    }

    $y += $altoCab;
    $altoDatos = 58;
    $pdf->rectangulo($izq, $y, $ancho, $altoDatos, 1.2);
    $yd = $y + 16;
    $pdf->texto($izq + 12, $yd, $receptor['etiqueta'] . ': ', 'F2', 8)
        ->texto($izq + 12 + Pdf::ancho($receptor['etiqueta'] . ': ', 'F2', 8), $yd, $receptor['valor'] !== '' ? $receptor['valor'] : '-', 'F1', 8);
    $pdf->texto($medio + 10, $yd, 'Condición frente al IVA: ', 'F2', 8)
        ->texto($medio + 10 + Pdf::ancho('Condición frente al IVA: ', 'F2', 8), $yd, $receptor['condicion'], 'F1', 8);
    $yd += 15;
    $nombreReceptor = comprobante_nombre_receptor($factura);
    $xNombre = $izq + 12 + Pdf::ancho('Apellido y Nombre / Razón Social: ', 'F2', 8);
    $pdf->texto($izq + 12, $yd, 'Apellido y Nombre / Razón Social: ', 'F2', 8)
        ->texto($xNombre, $yd, Pdf::recortar($nombreReceptor, 'F1', 8, $der - 12 - $xNombre), 'F1', 8);
    $yd += 15;
    $pdf->texto($izq + 12, $yd, 'Condición de venta: ', 'F2', 8)
        ->texto($izq + 12 + Pdf::ancho('Condición de venta: ', 'F2', 8), $yd, 'Contado', 'F1', 8);

    $y += $altoDatos;
    if (!empty($factura['servicioDesde'])) {
        $pdf->rectangulo($izq, $y, $ancho, 20, 1.2);
        $texto = 'Período Facturado Desde: ' . comprobante_fecha($factura['servicioDesde'])
            . '     Hasta: ' . comprobante_fecha($factura['servicioHasta'])
            . '     Fecha de Vto. para el pago: ' . comprobante_fecha($factura['fecha']);
        $pdf->texto($izq + 12, $y + 14, $texto, 'F1', 8);
        $y += 20;
    }

    $y += 16;
    $colCant = $izq + 300;
    $colUnit = $izq + 380;
    $pdf->rectangulo($izq, $y, $ancho, 18, 0.8, 0.88);
    $pdf->texto($izq + 8, $y + 12.5, 'Descripción', 'F2', 8.5);
    $pdf->textoDerecha($colUnit - 10, $y + 12.5, 'Cantidad', 'F2', 8.5);
    $pdf->textoDerecha($der - 90, $y + 12.5, 'Precio Unit.', 'F2', 8.5);
    $pdf->textoDerecha($der - 8, $y + 12.5, 'Subtotal', 'F2', 8.5);
    $y += 18;

    $pdf->rectangulo($izq, $y, $ancho, 24, 0.8);
    $pdf->texto($izq + 8, $y + 16, comprobante_descripcion_item(), 'F1', 8.5);
    $pdf->textoDerecha($colUnit - 10, $y + 16, '1,00', 'F1', 8.5);
    $pdf->textoDerecha($der - 90, $y + 16, comprobante_pesos($factura['total']), 'F1', 8.5);
    $pdf->textoDerecha($der - 8, $y + 16, comprobante_pesos($factura['total']), 'F1', 8.5);
    $y += 24;

    $y += 18;
    $anchoTot = 220;
    $xTot = $der - $anchoTot;
    foreach ([['Subtotal', $factura['total']], ['Importe Otros Tributos', 0]] as $fila) {
        $pdf->rectangulo($xTot, $y, $anchoTot, 18, 0.8);
        $pdf->texto($xTot + 8, $y + 12.5, $fila[0], 'F1', 8.5);
        $pdf->textoDerecha($der - 8, $y + 12.5, comprobante_pesos($fila[1]), 'F1', 8.5);
        $y += 18;
    }
    $pdf->rectangulo($xTot, $y, $anchoTot, 22, 0.8, 0.88);
    $pdf->texto($xTot + 8, $y + 15, 'Importe Total', 'F2', 10);
    $pdf->textoDerecha($der - 8, $y + 15, comprobante_pesos($factura['total']), 'F2', 10);
    $y += 22;

    $y += 26;
    $pdf->linea($izq, $y, $der, $y, 1.2);
    $y += 14;
    $lado = 104;
    $pdf->matrizQr(QrCode::generarMatriz(comprobante_payload_qr($config['cuit'], $factura)), $izq, $y, $lado);

    $xt = $izq + $lado + 18;
    $pdf->texto($xt, $y + 14, 'CAE N.º: ' . $factura['cae'], 'F2', 11);
    $pdf->texto($xt, $y + 30, 'Fecha de Vto. de CAE: ' . comprobante_fecha($factura['caeVence']), 'F1', 9);
    $pdf->texto($xt, $y + 50, 'Comprobante Autorizado', 'F2', 9);
    $pdf->texto($xt, $y + 64, 'Esta Administración Federal no se responsabiliza por los datos', 'F1', 7, 0.35);
    $pdf->texto($xt, $y + 74, 'ingresados en el detalle de la operación.', 'F1', 7, 0.35);

    return $pdf->salida();
}

function comprobante_qr_svg($texto, $lado = 150)
{
    $m = QrCode::generarMatriz($texto);
    $n = count($m);
    $borde = 4;
    $total = $n + $borde * 2;

    $rects = '';
    for ($y = 0; $y < $n; $y++) {
        $x = 0;
        while ($x < $n) {
            if (!$m[$y][$x]) { $x++; continue; }
            $ancho = 0;
            while ($x + $ancho < $n && $m[$y][$x + $ancho]) $ancho++;
            $rects .= 'M' . ($x + $borde) . ',' . ($y + $borde) . 'h' . $ancho . 'v1h-' . $ancho . 'z';
            $x += $ancho;
        }
    }

    return '<svg class="qr" width="' . $lado . '" height="' . $lado . '" viewBox="0 0 ' . $total . ' ' . $total
        . '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
        . '<rect width="' . $total . '" height="' . $total . '" fill="#fff"/>'
        . '<path d="' . $rects . '" fill="#000"/></svg>';
}

function comprobante_payload_qr($cuit, $factura)
{
    $payload = [
        'ver' => 1,
        'fecha' => substr($factura['fecha'], 0, 4) . '-' . substr($factura['fecha'], 4, 2) . '-' . substr($factura['fecha'], 6, 2),
        'cuit' => (int) $cuit,
        'ptoVta' => (int) $factura['puntoVenta'],
        'tipoCmp' => (int) $factura['tipoComprobante'],
        'nroCmp' => (int) $factura['numero'],
        'importe' => (float) $factura['total'],
        'moneda' => 'PES',
        'ctz' => 1,
        'tipoDocRec' => (int) ($factura['tipoDocumento'] ?? 99),
        'nroDocRec' => (int) ($factura['numeroDocumento'] ?? 0),
        'tipoCodAut' => 'E',
        'codAut' => (int) $factura['cae'],
    ];
    return 'https://www.afip.gob.ar/fe/qr/?p=' . base64_encode(json_encode($payload));
}

function comprobante_fecha($aaaammdd)
{
    if (strlen((string) $aaaammdd) !== 8) return (string) $aaaammdd;
    return substr($aaaammdd, 6, 2) . '/' . substr($aaaammdd, 4, 2) . '/' . substr($aaaammdd, 0, 4);
}

function comprobante_pesos($n)
{
    return '$ ' . number_format((float) $n, 2, ',', '.');
}

function comprobante_receptor($factura)
{
    $tipo = (int) ($factura['tipoDocumento'] ?? 99);
    $nro = (string) ($factura['numeroDocumento'] ?? '0');
    if ($tipo === 80) return ['etiqueta' => 'CUIT', 'valor' => $nro, 'condicion' => 'Responsable Monotributo'];
    if ($tipo === 96) return ['etiqueta' => 'DNI', 'valor' => $nro, 'condicion' => 'Consumidor Final'];
    return ['etiqueta' => 'DNI', 'valor' => '', 'condicion' => 'Consumidor Final'];
}

function comprobante_nombre_receptor($factura)
{
    $tipo = (int) ($factura['tipoDocumento'] ?? 99);
    if ($tipo === 99) return '';
    return trim((string) ($factura['cliente'] ?? ''));
}

function comprobante_descripcion_item()
{
    return 'Diseño y desarrollo web';
}

function comprobante_html($config, $factura)
{
    $e = function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
    $emisor = $config['emisor'];
    $receptor = comprobante_receptor($factura);
    $numero = str_pad($factura['puntoVenta'], 5, '0', STR_PAD_LEFT) . '-' . str_pad($factura['numero'], 8, '0', STR_PAD_LEFT);
    $qr = comprobante_qr_svg(comprobante_payload_qr($config['cuit'], $factura));
    $cuitLindo = preg_replace('/^(\d{2})(\d{8})(\d)$/', '$1-$2-$3', $config['cuit']);
    $prueba = $config['entorno'] !== 'produccion';

    $nombreReceptor = comprobante_nombre_receptor($factura);
    $detalle = comprobante_descripcion_item();

    ob_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Factura C <?= $e($numero) ?></title>
<style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font:13px/1.45 "Helvetica Neue",Arial,sans-serif;color:#000;background:#eee;padding:20px}
    .hoja{width:820px;margin:0 auto;background:#fff;padding:26px 30px 34px;border:1px solid #999}
    .aviso{background:#ffe9c7;border:1px solid #d79b2a;padding:8px 12px;margin-bottom:16px;font-weight:700;font-size:12px}
    .cab{display:grid;grid-template-columns:1fr 88px 1fr;border:1.5px solid #000;position:relative}
    .cab>div{padding:14px 16px}
    .cab-izq{border-right:0}
    .cab-der{border-left:0;text-align:left}
    .letra{border-left:1.5px solid #000;border-right:1.5px solid #000;text-align:center;padding:8px 0 4px!important;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
    .letra b{font-size:40px;line-height:1}
    .letra span{font-size:9.5px;letter-spacing:.02em}
    .emisor-nombre{font-size:19px;font-weight:700;margin-bottom:12px}
    .tipo-doc{font-size:21px;font-weight:700;margin-bottom:2px}
    .campo{margin-top:3px}
    .campo b{font-weight:700}
    .datos{border:1.5px solid #000;border-top:0;padding:10px 16px;display:grid;grid-template-columns:1fr 1fr;gap:2px 20px}
    .periodo{border:1.5px solid #000;border-top:0;padding:8px 16px;display:flex;gap:26px;font-size:12.5px}
    table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12.5px}
    th{background:#e4e4e4;border:1px solid #000;padding:7px 8px;text-align:left;font-weight:700}
    td{border:1px solid #000;padding:9px 8px;vertical-align:top}
    .num{text-align:right;white-space:nowrap}
    .totales{margin-top:14px;margin-left:auto;width:330px}
    .totales div{display:flex;justify-content:space-between;padding:6px 10px;border:1px solid #000;border-bottom:0}
    .totales div:last-child{border-bottom:1px solid #000;background:#e4e4e4;font-weight:700;font-size:15px}
    .pie{display:flex;gap:22px;align-items:flex-start;margin-top:22px;border-top:1.5px solid #000;padding-top:16px}
    .pie-txt{font-size:12px;line-height:1.7}
    .pie-txt .cae{font-size:15px;font-weight:700}
    .falta{background:#ffe9c7;padding:0 4px;font-style:italic;color:#8a5a00}
    @media print{
        body{background:#fff;padding:0}
        .hoja{width:auto;border:0;padding:0}
        .aviso{border:2px solid #000}
        @page{margin:12mm}
    }
</style>
</head>
<body>
<div class="hoja">
    <?php if ($prueba): ?><div class="aviso">COMPROBANTE DE PRUEBA — entorno de homologación, sin validez fiscal</div><?php endif; ?>

    <div class="cab">
        <div class="cab-izq">
            <div class="emisor-nombre"><?= $emisor['razonSocial'] !== '' ? $e($emisor['razonSocial']) : '<span class="falta">[completar razón social]</span>' ?></div>
            <div class="campo"><b>Razón Social:</b> <?= $emisor['razonSocial'] !== '' ? $e($emisor['razonSocial']) : '<span class="falta">[completar]</span>' ?></div>
            <div class="campo"><b>Domicilio Comercial:</b> <?= $emisor['domicilio'] !== '' ? $e($emisor['domicilio']) : '<span class="falta">[completar domicilio fiscal]</span>' ?></div>
            <div class="campo"><b>Condición frente al IVA:</b> <?= $e($emisor['condicionIva']) ?></div>
        </div>
        <div class="letra">
            <b>C</b>
            <span>COD. <?= str_pad($factura['tipoComprobante'], 2, '0', STR_PAD_LEFT) ?></span>
        </div>
        <div class="cab-der">
            <div class="tipo-doc">FACTURA</div>
            <div class="campo"><b>Punto de Venta:</b> <?= str_pad($factura['puntoVenta'], 5, '0', STR_PAD_LEFT) ?> &nbsp; <b>Comp. Nro:</b> <?= str_pad($factura['numero'], 8, '0', STR_PAD_LEFT) ?></div>
            <div class="campo"><b>Fecha de Emisión:</b> <?= $e(comprobante_fecha($factura['fecha'])) ?></div>
            <div class="campo"><b>CUIT:</b> <?= $e($cuitLindo) ?></div>
            <div class="campo"><b>Ingresos Brutos:</b> <?= $e($config['cuit']) ?></div>
            <div class="campo"><b>Inicio de Actividades:</b> <?= $emisor['inicioActividades'] !== '' ? $e($emisor['inicioActividades']) : '<span class="falta">[completar]</span>' ?></div>
        </div>
    </div>

    <div class="datos">
        <div><b><?= $e($receptor['etiqueta']) ?>:</b> <?= $receptor['valor'] !== '' ? $e($receptor['valor']) : '—' ?></div>
        <div><b>Condición frente al IVA:</b> <?= $e($receptor['condicion']) ?></div>
        <div><b>Apellido y Nombre / Razón Social:</b> <?= $nombreReceptor !== '' ? $e($nombreReceptor) : '—' ?></div>
        <div><b>Condición de venta:</b> Contado</div>
    </div>

    <?php if (!empty($factura['servicioDesde'])): ?>
    <div class="periodo">
        <span><b>Período Facturado Desde:</b> <?= $e(comprobante_fecha($factura['servicioDesde'])) ?></span>
        <span><b>Hasta:</b> <?= $e(comprobante_fecha($factura['servicioHasta'])) ?></span>
        <span><b>Fecha de Vto. para el pago:</b> <?= $e(comprobante_fecha($factura['fecha'])) ?></span>
    </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th style="width:52%">Descripción</th>
                <th class="num">Cantidad</th>
                <th class="num">Precio Unit.</th>
                <th class="num">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><?= $e($detalle) ?></td>
                <td class="num">1,00</td>
                <td class="num"><?= $e(comprobante_pesos($factura['total'])) ?></td>
                <td class="num"><?= $e(comprobante_pesos($factura['total'])) ?></td>
            </tr>
        </tbody>
    </table>

    <div class="totales">
        <div><span>Subtotal</span><span><?= $e(comprobante_pesos($factura['total'])) ?></span></div>
        <div><span>Importe Otros Tributos</span><span><?= $e(comprobante_pesos(0)) ?></span></div>
        <div><span>Importe Total</span><span><?= $e(comprobante_pesos($factura['total'])) ?></span></div>
    </div>

    <div class="pie">
        <?= $qr ?>
        <div class="pie-txt">
            <div class="cae">CAE N.º: <?= $e($factura['cae']) ?></div>
            <div>Fecha de Vto. de CAE: <?= $e(comprobante_fecha($factura['caeVence'])) ?></div>
            <div style="margin-top:8px">Comprobante Autorizado</div>
            <div style="font-size:10.5px;color:#444">Esta Administración Federal no se responsabiliza por los datos ingresados en el detalle de la operación.</div>
        </div>
    </div>
</div>
</body>
</html>
<?php
    return ob_get_clean();
}
