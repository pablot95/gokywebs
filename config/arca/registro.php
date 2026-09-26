<?php

/**
 * El registro de facturas emitidas (emitidas-<entorno>.json) lo escriben dos
 * procesos: el modal del admin (admin/api/facturar.php) y la facturación
 * automática de las suscripciones (config/arca/suscripciones.php). Los dos
 * emiten con el mismo punto de venta y el registro es lo único que evita
 * facturar dos veces lo mismo, así que:
 *   - leer, emitir y guardar va entero adentro de un lock exclusivo: dos
 *     emisiones a la vez pedirían el mismo número a ARCA o se pisarían al
 *     guardar, y la que se pierde del registro se vuelve a facturar;
 *   - un registro que existe pero no se puede leer frena la emisión en vez de
 *     tomarse como vacío (vacío = "no se facturó nada" = facturar todo de nuevo);
 *   - se guarda en un temporal que después se renombra, así nadie lee un JSON
 *     a medio escribir.
 */

function registro_lock(array $config)
{
    $lock = fopen($config['registro'] . '.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('No se pudo bloquear el registro de facturas.');
    }
    return $lock;
}

function registro_soltar($lock)
{
    if (is_resource($lock)) {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

/**
 * @throws RuntimeException si el archivo existe y no es un JSON válido.
 */
function registro_leer(array $config)
{
    $ruta = $config['registro'];
    if (!file_exists($ruta)) return [];

    $texto = @file_get_contents($ruta);
    $registro = $texto === false ? null : json_decode($texto, true);
    if (!is_array($registro)) {
        throw new RuntimeException(
            'El registro de facturas (' . basename($ruta) . ') no se puede leer: no se emite nada hasta revisarlo.'
        );
    }
    return $registro;
}

/**
 * Fecha de los comprobantes. ARCA rechaza uno con fecha anterior a la del último
 * del punto de venta, así que todos los que emiten tienen que usar el mismo
 * reloj: el que ya venía usando el modal, el del server web, que está en UTC
 * (el cron corre con otro php.ini y no tiene por qué tener la misma zona).
 */
function registro_fecha_hoy()
{
    return gmdate('Ymd');
}

function registro_guardar(array $config, array $registro)
{
    json_guardar_atomico($config['registro'], $registro, 'el registro de facturas');
}

function json_guardar_atomico($ruta, array $datos, $que)
{
    $json = json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $temporal = $ruta . '.tmp';
    if ($json === false || file_put_contents($temporal, $json, LOCK_EX) === false || !rename($temporal, $ruta)) {
        throw new RuntimeException("No se pudo guardar $que.");
    }
}
