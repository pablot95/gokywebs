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
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$cfg['plantillas']['guia_qr'] = ['nombre' => 'guia_qr_web', 'idioma' => 'es_AR', 'activa' => true,
    'params' => ['nombre', 'negocio'], 'boton' => ['guia_pdf'], 'texto' => 'Hola {nombre}, el QR de {negocio}.'];
$c3 = conv_nueva($clave . 'C', ['guia_pdf' => 'instructivos-x.pdf']);
caso('sale la plantilla con imagen y botón',
    wabot_enviar_plantilla($c3, 'guia_qr', $cfg, ['nombre' => 'Ana', 'negocio' => 'X', '_documento' => ['imagen_id' => 'IMG1']]));
$env = $GLOBALS['WABOT_TEST_PLANTILLAS'][0] ?? [];
caso('el botón lleva el PDF', ($env[4] ?? null) === ['instructivos-x.pdf']);
caso('la imagen llega al envío', ($env[5]['imagen_id'] ?? '') === 'IMG1');
caso('el chat la muestra como imagen', strpos(end($c3['transcript'])['t'], '[imagen]') === 0);
todo_ok();
