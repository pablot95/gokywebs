<?php

/**
 * Pruebas del archivo de facturas (archivo.php): guardar el PDF al emitir,
 * listar por mes y armar el .zip. Sin ARCA ni red; todo en una carpeta temporal.
 *
 *   php config/arca/test-archivo.php [carpeta-para-dejar-el-zip]
 */

require_once __DIR__ . '/registro.php';
require_once __DIR__ . '/archivo.php';

$fallas = 0;
function caso($nombre, $ok, $detalle = null)
{
    global $fallas;
    echo ($ok ? 'OK   ' : 'FALLA') . " $nombre\n";
    if (!$ok) {
        $fallas++;
        if ($detalle !== null) echo '      ' . json_encode($detalle, JSON_UNESCAPED_UNICODE) . "\n";
    }
}

$dir = sys_get_temp_dir() . '/test-archivo-' . getmypid() . '-' . mt_rand();
mkdir($dir);
$real = require __DIR__ . '/arca-config.php';
$config = [
    'entorno' => 'homologacion',
    'cuit' => $real['cuit'],
    'emisor' => $real['emisor'],
    'registro' => "$dir/emitidas.json",
];

function factura_prueba($numero, $fecha, $total, $cliente)
{
    return [
        'puntoVenta' => 10, 'tipoComprobante' => 11, 'numero' => $numero, 'fecha' => $fecha,
        'total' => $total, 'concepto' => 2, 'tipoDocumento' => 99, 'numeroDocumento' => '0',
        'condicionIvaReceptor' => 5, 'cae' => '76123456789012', 'caeVence' => '20261013',
        'servicioDesde' => $fecha, 'servicioHasta' => $fecha, 'vencimientoPago' => $fecha,
        'cliente' => $cliente, 'receptor' => ['tipoDocumento' => 99, 'numeroDocumento' => '0'],
        'descripcion' => 'Suscripción mensual servicio web', 'condicionVenta' => 'Mercado Pago',
    ];
}

$registro = [
    'manual-1' => factura_prueba(120, '20260926', 25000, 'Estudio Peña / Asociados'),
    'mp-cobro-1' => factura_prueba(121, '20261001', 20000, 'Leonor Díaz'),
    'mp-cobro-2' => factura_prueba(122, '20261003', 30000, ''),
    'roto' => ['numero' => 5, 'cliente' => 'sin CAE'],
];
registro_guardar($config, $registro);

// 1. Guardar al emitir.
$ok = archivo_guardar($config, $registro['mp-cobro-1']);
$ruta = archivo_ruta($config, $registro['mp-cobro-1']);
caso('guardar deja el PDF en facturas-<entorno>/ con el nombre de siempre',
    $ok && is_file($ruta) && basename($ruta) === 'Factura C 00010-00000121.pdf' && basename(dirname($ruta)) === 'facturas-homologacion', $ruta);
caso('el archivo es un PDF', strpos((string) file_get_contents($ruta), '%PDF') === 0);

// 2. Lo guardado no se vuelve a armar.
file_put_contents($ruta, '%PDF-guardado');
caso('si ya está guardado devuelve ese, no uno nuevo', archivo_pdf($config, $registro['mp-cobro-1']) === '%PDF-guardado');

// 3. Una factura sin datos no rompe nada.
caso('guardar una factura incompleta devuelve false sin excepción', archivo_guardar($config, $registro['roto']) === false);
caso('guardar con config sin emisor devuelve false sin excepción',
    archivo_guardar(['entorno' => 'x', 'registro' => "$dir/emitidas.json"], $registro['mp-cobro-2']) === false);

// 4. Lista y filtro por mes.
$todas = archivo_facturas($registro);
caso('lista: solo las que tienen CAE, la más nueva primero', array_keys($todas) === ['mp-cobro-2', 'mp-cobro-1', 'manual-1'], array_keys($todas));
caso('filtro por mes', array_keys(archivo_facturas($registro, '2026-09')) === ['manual-1']);
caso('mes sin facturas', archivo_facturas($registro, '2025-01') === []);

// 5. Nombres dentro del zip.
caso('nombre con cliente, sin caracteres prohibidos',
    archivo_nombre_en_zip($registro['manual-1']) === 'Factura C 00010-00000120 - Estudio Peña Asociados.pdf', archivo_nombre_en_zip($registro['manual-1']));
caso('nombre sin cliente', archivo_nombre_en_zip($registro['mp-cobro-2']) === 'Factura C 00010-00000122.pdf');

// 6. El zip (las que faltaban se arman y quedan guardadas).
$archivos = [];
foreach (array_reverse($todas, true) as $f) $archivos[archivo_nombre_en_zip($f)] = archivo_pdf($config, $f);
caso('al pedirlas, las que faltaban quedan guardadas', count(glob(archivo_dir($config) . '/*.pdf')) === 3);
$zip = archivo_zip($archivos);
caso('el zip empieza y termina como un zip', substr($zip, 0, 4) === "PK\x03\x04" && strpos($zip, "PK\x05\x06") === strlen($zip) - 22);

$destino = $argv[1] ?? '';
if ($destino !== '') {
    file_put_contents(rtrim($destino, '/\\') . '/prueba-facturas.zip', $zip);
    file_put_contents(rtrim($destino, '/\\') . '/prueba-facturas.json', json_encode(array_map('strlen', $archivos), JSON_UNESCAPED_UNICODE));
}

foreach (glob(archivo_dir($config) . '/*') as $f) @unlink($f);
@rmdir(archivo_dir($config));
foreach (glob("$dir/*") as $f) @unlink($f);
@rmdir($dir);

echo $fallas ? "\n$fallas FALLAS\n" : "\nTodo OK\n";
exit($fallas ? 1 : 0);
