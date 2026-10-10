<?php
/**
 * wabot/test-anuncios-stats.php — las estadísticas por anuncio (anuncios-stats.php, 9-oct-2026), sin red.
 *
 *   php wabot/test-anuncios-stats.php
 *
 * Agrupa por id (no por título), cuenta cada charla en la fecha del clic, el
 * embudo es acumulativo, los que escribieron sin anuncio van aparte y la
 * imagen del anuncio sale de la primera línea del transcript.
 * Escribe charlas *TEST* en wabot/data/conv y las borra al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/anuncios-stats.php';

$t0 = time() - 3 * 86400;
$claves = [];
function charla_ad($clave, array $extra, array $lineas = []) {
    global $claves, $t0;
    $claves[] = $clave;
    @unlink(wabot_conv_path($clave));
    $tr = $lineas ?: [['q' => 'cliente', 't' => 'Hola. ¿Puedo obtener más información sobre esto?', 'ts' => $t0]];
    wabot_conv_save(conv_nueva($clave, array_merge(['chat_started_ts' => $tr[0]['ts'], 'transcript' => $tr], $extra)));
}
$bienv = ['q' => 'bot', 't' => 'Hola cómo estás? contanos a qué te dedicás', 'ts' => $t0 + 5];

// Anuncio A (dos creatividades con el mismo título: A1 y A2), anuncio B, uno sin id y dos orgánicos.
charla_ad('5491100000301TEST', ['ctwa_clid' => 'c1', 'ctwa_clid_ts' => $t0, 'anuncio_id' => 'A1', 'anuncio_titular' => 'Tu negocio merece su propia web'],
    [['q' => 'cliente', 't' => 'Hola', 'ts' => $t0, 'anuncio' => ['id' => 'A1', 'imagen' => '20261009-204044-9255b220.jpg']], $bienv]);
charla_ad('5491100000302TEST', ['ctwa_clid' => 'c2', 'ctwa_clid_ts' => $t0 + 60, 'anuncio_id' => 'A1', 'anuncio_titular' => 'Tu negocio merece su propia web',
    'precio_dado' => true], [['q' => 'cliente', 't' => 'Hola', 'ts' => $t0 + 60], $bienv, ['q' => 'cliente', 't' => 'vendo velas', 'ts' => $t0 + 90]]);
charla_ad('5491100000303TEST', ['ctwa_clid' => 'c3', 'ctwa_clid_ts' => $t0 + 120, 'anuncio_id' => 'A2', 'anuncio_titular' => 'Tu negocio merece su propia web',
    'cliente_id' => 'xyz']);   // llegó a cliente: cuenta en todas las etapas
charla_ad('5491100000304TEST', ['ctwa_clid' => 'c4', 'ctwa_clid_ts' => $t0 + 180, 'anuncio_id' => 'B', 'anuncio_titular' => 'Tu tienda online',
    'anuncio_visto' => ['id' => 'B', 'cuerpo' => 'Vendé las 24 h', 'ts' => $t0 + 180], 'form_link_mandado_ts' => $t0 + 300, 'form_completado_ts' => $t0 + 900]);
charla_ad('5491100000305TEST', ['ctwa_clid' => 'c5', 'ctwa_clid_ts' => $t0 + 200]);   // Meta no mandó el id
charla_ad('5491100000306TEST', []);                                                   // orgánico
charla_ad('5491100000307TEST', ['presentado_ts' => $t0 + 4000]);                      // orgánico con demo
// Un clic fuera del rango (hace 40 días) y una charla orgánica vieja con el archivo tocado hoy.
charla_ad('5491100000308TEST', ['ctwa_clid' => 'c8', 'ctwa_clid_ts' => time() - 40 * 86400, 'anuncio_id' => 'A1'],
    [['q' => 'cliente', 't' => 'Hola', 'ts' => time() - 40 * 86400]]);
$GLOBALS['WABOT_TEST_ANUNCIOS_CLAVES'] = $claves;

echo "Etapas\n";
$e = wabot_anuncios_etapas_de(conv_nueva('X', ['transcript' => [['q' => 'cliente', 't' => 'hola', 'ts' => 1], $bienv]]));
caso('solo escribió: cuenta en la primera etapa y nada más', $e['contactos'] && !$e['respondieron'] && !$e['precio']);
$e = wabot_anuncios_etapas_de(conv_nueva('X', ['transcript' => [['q' => 'cliente', 't' => 'hola', 'ts' => 1], $bienv, ['q' => 'cliente', 't' => 'tengo un local', 'ts' => 9]]]));
caso('contestó después de nuestro primer mensaje: respondió', $e['respondieron'] && !$e['precio']);
$e = wabot_anuncios_etapas_de(conv_nueva('X', ['pago_avisado_ts' => 5]));
caso('el que pagó cuenta en todas las etapas anteriores', !in_array(false, $e, true));
$e = wabot_anuncios_etapas_de(conv_nueva('X', ['form_link_mandado_ts' => 5]));
caso('el link del formulario es "aceptó la demo", sin completar', $e['formulario'] && $e['precio'] && $e['respondieron'] && !$e['completaron'] && !$e['demo']);

$e = wabot_anuncios_etapas_de(conv_nueva('X', ['transcript' => [['q' => 'cliente', 't' => 'vendo ropa', 'ts' => 1],
    ['q' => 'humano', 't' => "Podés elegir entre dos planes:\n\n1) Plan anual: \$190.000\n2) Plan mensual: \$30.000", 'ts' => 5]]]), wabot_config_load());
caso('el precio que pasó Pablo a mano también cuenta (se lee en la charla)', $e['precio'] && !$e['formulario']);

echo "Por anuncio\n";
$r = wabot_anuncios_stats(time() - 30 * 86400, time());
$ids = array_keys($r['anuncios']);
caso('agrupa por id: dos anuncios con el mismo título son dos filas', isset($r['anuncios']['A1'], $r['anuncios']['A2'], $r['anuncios']['B']), implode(',', $ids));
caso('del que más contactos trajo al que menos', $ids[0] === 'A1', implode(',', $ids));
caso('A1: 2 escribieron, 1 respondió y recibió el precio (el clic de hace 40 días no entra)',
    $r['anuncios']['A1']['etapas']['contactos'] === 2 && $r['anuncios']['A1']['etapas']['respondieron'] === 1 && $r['anuncios']['A1']['etapas']['precio'] === 1
    && $r['anuncios']['A1']['etapas']['formulario'] === 0, json_encode($r['anuncios']['A1']['etapas']));
caso('A2: el cliente cuenta en todo el embudo', !in_array(0, $r['anuncios']['A2']['etapas'], true), json_encode($r['anuncios']['A2']['etapas']));
caso('B: completó el formulario, sin demo; trae el texto del anuncio',
    $r['anuncios']['B']['etapas']['completaron'] === 1 && $r['anuncios']['B']['etapas']['demo'] === 0 && $r['anuncios']['B']['cuerpo'] === 'Vendé las 24 h');
caso('la imagen del anuncio sale del primer mensaje', ($r['anuncios']['A1']['imagen']['archivo'] ?? '') === '20261009-204044-9255b220.jpg'
    && ($r['anuncios']['A1']['imagen']['clave'] ?? '') === '5491100000301TEST');
caso('el clic sin id de anuncio va en su propia fila', ($r['anuncios']['sin_id']['etapas']['contactos'] ?? 0) === 1);
caso('los que escribieron sin anuncio van aparte', $r['organico']['etapas']['contactos'] === 2 && $r['organico']['etapas']['demo'] === 1);
caso('el total suma todo', $r['total']['etapas']['contactos'] === 7 && $r['total']['etapas']['clientes'] === 1, json_encode($r['total']['etapas']));
$d = $r['anuncios']['A1']['contactos_detalle'];
caso('cada anuncio trae sus contactos, el más nuevo primero, con hasta dónde llegó',
    count($d) === 2 && $d[0]['clave'] === '5491100000302TEST' && $d[0]['llego'] === 'Recibieron el precio' && $d[1]['llego'] === 'Escribieron');

echo "Rango de fechas\n";
$r2 = wabot_anuncios_stats($t0 + 100, time());
caso('cuenta por la fecha del clic: lo de antes del rango no entra',
    !isset($r2['anuncios']['A1']) && isset($r2['anuncios']['A2'], $r2['anuncios']['B']), implode(',', array_keys($r2['anuncios'])));
$r3 = wabot_anuncios_stats(time() - 45 * 86400, time() - 35 * 86400);
caso('el clic de hace 40 días entra en su rango', ($r3['anuncios']['A1']['etapas']['contactos'] ?? 0) === 1 && !isset($r3['anuncios']['B']));

foreach ($claves as $k) @unlink(wabot_conv_path($k));
unset($GLOBALS['WABOT_TEST_ANUNCIOS_CLAVES']);
todo_ok();
