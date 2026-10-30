<?php
/**
 * wabot/test-presentar-auto.php — la presentación automática de la demo
 * (presentar.php, 18-oct-2026), sin red ni Firestore:
 *
 *   php wabot/test-presentar-auto.php
 *
 * Boceto de antes de las 15 h → 18 h ese día; de después → 14 h del siguiente;
 * de madrugada → 14 h de ese mismo día. Espera la demo publicada, marca la
 * propuesta una sola vez y avisa a Pablo si no salió.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/presentar.php';

$ar = function ($dia, $hora, $min = 0) { [$a, $m, $d] = array_map('intval', explode('-', $dia)); return gmmktime($hora + 3, $min, 0, $m, $d, $a); };
$iso = function ($ts) { return gmdate('Y-m-d\TH:i:s\Z', $ts); };

echo "Turno\n";
caso('creado a las 10 h → 14 h del mismo día', wabot_presentar_turno($ar('2026-10-20', 10)) === $ar('2026-10-20', 14));
caso('a las 10:59 todavía son las 14 h', wabot_presentar_turno($ar('2026-10-20', 10, 59)) === $ar('2026-10-20', 14));
caso('a las 11:00 ya son las 18 h', wabot_presentar_turno($ar('2026-10-20', 11)) === $ar('2026-10-20', 18));
caso('a las 14:59 todavía es el mismo día a las 18 h', wabot_presentar_turno($ar('2026-10-20', 14, 59)) === $ar('2026-10-20', 18));
caso('a las 15:00 ya es al día siguiente a las 14 h', wabot_presentar_turno($ar('2026-10-20', 15)) === $ar('2026-10-21', 14));
caso('a las 23 h → 14 h del día siguiente', wabot_presentar_turno($ar('2026-10-20', 23, 30)) === $ar('2026-10-21', 14));
caso('de madrugada (1 h) → 14 h de ese mismo día', wabot_presentar_turno($ar('2026-10-21', 1)) === $ar('2026-10-21', 14));
caso('a las 3 h → 14 h de ese día', wabot_presentar_turno($ar('2026-10-21', 3)) === $ar('2026-10-21', 14));
caso('fin de mes: el 31 a la noche pasa al 1', wabot_presentar_turno($ar('2026-10-31', 16)) === $ar('2026-11-01', 14));

echo "Tipo de web (como el admin)\n";
caso('ecommerce, cursos, inmobiliaria, sitio profesional',
    wabot_presentar_auto_tipo(['tipo_web' => 'Ecommerce']) === 'ecommerce' && wabot_presentar_auto_tipo(['tipo_web' => 'Plataforma de cursos']) === 'elearning'
    && wabot_presentar_auto_tipo(['tipoDetectadoLabel' => 'Web inmobiliaria']) === 'inmobiliaria' && wabot_presentar_auto_tipo(['tipo_web' => 'Sitio profesional']) === 'landing');
caso('noticias o vacío: sin tipo', wabot_presentar_auto_tipo(['tipo_web' => 'Web de noticias']) === '' && wabot_presentar_auto_tipo([]) === '');

echo "La corrida\n";
$espera = WABOT_DATA . '/presentar-auto-espera.json';
$esperaPrevia = @file_get_contents($espera);
@unlink($espera);
$props = [
    'A' => ['createdAt' => $iso($ar('2026-10-20', 12)), 'nombre_negocio' => 'Kiosco Ana', 'telefono' => '1150000001', 'tipo_web' => 'Ecommerce'],
    'B' => ['createdAt' => $iso($ar('2026-10-19', 16)), 'nombre_negocio' => 'Bar Beto', 'telefono' => '1150000002', 'nombre' => 'Beto'],
    'C' => ['createdAt' => $iso($ar('2026-10-20', 1)), 'nombre_negocio' => 'Café Caro', 'telefono' => '1150000003'],
    'D' => ['createdAt' => $iso($ar('2026-10-19', 10)), 'nombre_negocio' => 'Dulces Dani', 'telefono' => '1150000004'],
    'E' => ['createdAt' => $iso($ar('2026-10-19', 9)), 'nombre_negocio' => 'Ya presentada', 'telefono' => '1150000005', 'autoPresentada' => ['ts' => 'x']],
    'F' => ['createdAt' => '2026-10-17T15:00:00Z', 'nombre_negocio' => 'Vieja', 'telefono' => '1150000006'],
    'G' => ['createdAt' => $iso($ar('2026-10-20', 11)), 'nombre_negocio' => 'Sin teléfono'],
];
$enviadas = []; $marcas = []; $avisos = [];
$presentar = function ($d) use (&$enviadas) {
    $enviadas[] = $d;
    if ($d['negocio'] === 'Café Caro') return ['ok' => true, 'enviado' => false, 'fuera_ventana' => true, 'demo_ok' => false, 'slug' => 'cafecaro', 'textos' => ['link', 'feedback'], 'textos_enviados' => [false, false]];
    return ['ok' => true, 'enviado' => true, 'demo_ok' => true, 'slug' => wabot_slug_demo($d['negocio']), 'textos' => ['link', 'feedback'], 'textos_enviados' => [true, true], 'canal' => 'whatsapp'];
};
$marcar = function ($id, $m) use (&$marcas, &$props) { $marcas[$id] = $m; $props[$id]['autoPresentada'] = $m; return true; };
$hayDemo = function ($slug) { return $slug !== 'dulcesdani'; };
$avisar = function ($t, $c) use (&$avisos) { $avisos[] = $t . ': ' . $c; return 1; };
$cfg = ['presentar_auto' => true];

$r = wabot_presentar_auto_correr($cfg, $ar('2026-10-20', 14, 2), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 14 h salen los de ayer después de las 15 y los de la madrugada', isset($marcas['B'], $marcas['C']) && !isset($marcas['A']), implode(',', array_keys($marcas)));
caso('la de ayer a la tarde salió y queda marcada con su cliente', $marcas['B']['demo_ok'] === true && strlen($marcas['B']['clienteId']) === 20 && $marcas['B']['slug'] === 'barbeto');
caso('con los datos que manda el botón (tel, negocio, nombre, id del cliente)',
    $enviadas[0]['tel'] === '1150000002' && $enviadas[0]['nombre'] === 'Beto' && $enviadas[0]['cliente_id'] === $marcas['B']['clienteId'] && !empty($enviadas[0]['auto']));
caso('la que no pudo salir (ventana cerrada) queda marcada y le avisa a Pablo',
    $marcas['C']['demo_ok'] === false && $marcas['C']['fuera_ventana'] === true && $r['sin_enviar'] === 1
    && (bool)array_filter($avisos, fn($a) => strpos($a, 'Café Caro') !== false && strpos($a, 'ventana') !== false));
caso('sin la demo publicada espera, y a las 4 h del turno avisa una vez', !isset($marcas['D']) && $r['esperando_demo'] === 1
    && count(array_filter($avisos, fn($a) => strpos($a, 'Dulces Dani') !== false)) === 1);
caso('ni la ya presentada ni la de antes del arranque', !isset($marcas['E']) && !isset($marcas['F']));

$avisos = [];
$r2 = wabot_presentar_auto_correr($cfg, $ar('2026-10-20', 14, 32), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('la corrida siguiente no repite nada ni vuelve a avisar', $r2['presentadas'] === 0 && $r2['sin_enviar'] === 0 && !$avisos, json_encode($r2['detalle']));

$r3 = wabot_presentar_auto_correr($cfg, $ar('2026-10-20', 18, 1), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a las 18 h sale la del mediodía', ($marcas['A']['demo_ok'] ?? false) === true && $r3['presentadas'] === 1);
caso('sin teléfono no se manda nada: queda marcada con el motivo', ($marcas['G']['demo_ok'] ?? true) === false
    && strpos($marcas['G']['error'], 'Falta teléfono') !== false && count(array_filter($enviadas, fn($d) => $d['negocio'] === 'Sin teléfono')) === 0);

$antes = count($marcas);
$props['H'] = ['createdAt' => $iso($ar('2026-10-20', 9)), 'nombre_negocio' => 'Hora tarde', 'telefono' => '1150000008'];
wabot_presentar_auto_correr($cfg, $ar('2026-10-20', 22, 30), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('de noche (22 h en adelante) no sale nada', count($marcas) === $antes);
$r4 = wabot_presentar_auto_correr(['presentar_auto' => false, 'presentar_hora_elegida' => false], $ar('2026-10-21', 10), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('apagada en los ajustes, no hace nada', !empty($r4['apagado']) && count($marcas) === $antes);
wabot_presentar_auto_correr($cfg, $ar('2026-10-21', 9, 1), $props, $presentar, $marcar, $hayDemo, $avisar);
caso('a la mañana siguiente sale la que se pasó de hora', ($marcas['H']['demo_ok'] ?? false) === true);

echo "Quién la llama\n";
caso('el botón del admin usa la misma función', strpos((string)file_get_contents(__DIR__ . '/admin.php'), 'wabot_presentar_muestra([') !== false);
caso('y el cron de seguimiento corre la automática', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_presentar_auto_correr($cfg)') !== false);

if ($esperaPrevia !== false) file_put_contents($espera, $esperaPrevia); else @unlink($espera);
todo_ok();
