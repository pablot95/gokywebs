<?php
/** Plantilla con el PDF como encabezado (guías, 16-nov). Solo CLI, sin red. */
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['plantillas']['guia_web'] = ['nombre' => 'guias_web', 'idioma' => 'es_AR', 'activa' => true,
    'params' => ['nombre', 'negocio'], 'texto' => 'Hola {nombre}, la guía de {negocio}.'];
$clave = 'TESTGUIAS' . bin2hex(random_bytes(6));
$c = conv_nueva($clave, []);
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$doc = ['link' => 'https://gokywebs.com/guias/instructivos-x.pdf', 'filename' => 'Guía Panadería Sol'];
caso('sale la plantilla con documento',
    wabot_enviar_plantilla($c, 'guia_web', $cfg, ['nombre' => 'Ana', 'negocio' => 'Panadería Sol', '_documento' => $doc]));
$env = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('el cuerpo lleva solo nombre y negocio', ($env[3] ?? null) === ['Ana', 'Panadería Sol']);
caso('el documento llega al envío', ($env[5] ?? null) === $doc);
caso('el chat muestra el PDF y el texto',
    strpos(end($c['transcript'])['t'], '[documento] Guía Panadería Sol.pdf') === 0
    && strpos(end($c['transcript'])['t'], 'Hola Ana, la guía de Panadería Sol.') !== false);
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$c2 = conv_nueva($clave . 'B', []);
wabot_enviar_plantilla($c2, 'guia_web', $cfg, ['nombre' => 'Ana', 'negocio' => 'X']);
caso('sin documento, el envío queda como antes (5 datos)', count($GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? []) === 5);
todo_ok();
