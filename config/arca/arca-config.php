<?php

$entorno = 'produccion';

$porEntorno = [
    'homologacion' => [
        'cert' => __DIR__ . '/homo.crt',
        'key' => __DIR__ . '/homo.key',
        'ticket' => __DIR__ . '/ticket-homo.json',
        'puntoVenta' => 1,
    ],
    'produccion' => [
        'cert' => __DIR__ . '/prod.crt',
        'key' => __DIR__ . '/prod.key',
        'ticket' => __DIR__ . '/ticket-prod.json',
        'puntoVenta' => 10,
    ],
];

return array_merge($porEntorno[$entorno], [
    'entorno' => $entorno,
    'cuit' => '20391482943',
    'registro' => __DIR__ . '/emitidas-' . $entorno . '.json',
    'emisor' => [
        'razonSocial' => 'Pablo Travi',
        'domicilio' => 'Río Negro 787 1D, General Pacheco',
        'condicionIva' => 'Responsable Monotributo',
        'inicioActividades' => '12/2025',
    ],
]);
