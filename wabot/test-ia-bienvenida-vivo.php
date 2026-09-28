<?php
/**
 * wabot/test-ia-bienvenida-vivo.php — las tres opciones de la bienvenida contra
 * la API REAL de OpenAI (28-sep-2026). Solo CLI; no manda nada a nadie ni guarda
 * charlas: solo le pregunta al modelo qué haría y lo compara con lo esperado.
 *
 *   OPENAI_API_KEY=sk-... php wabot/test-ia-bienvenida-vivo.php [modelo]
 *
 * (o con WABOT_OPENAI_KEY en config/wabot-config.php). Son ~16 llamadas: unos
 * centavos de dólar. La suite simulada es test-ia.php; esta es la prueba de que
 * el modelo de verdad entiende las opciones sin la red de wabot_ia_turno().
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/redactor.php';

// El costo va a un temporal: no ensucia el consumo del panel.
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-ia-vivo-' . getmypid();

$cfg = wabot_config_load();
if (!empty($argv[1])) $cfg['openai_modelo'] = $argv[1];
if (wabot_openai_key() === '') { fwrite(STDERR, "Falta la key: OPENAI_API_KEY o WABOT_OPENAI_KEY en config/wabot-config.php\n"); exit(2); }
echo 'Modelo: ' . wabot_openai_modelo($cfg) . "\n\n";

/** Lo que se espera: [accion, tipo_web] o solo accion. */
$casos = [
    ['Una web informativa', 'cotizar', ['sitio_profesional', 'catalogo_sin_venta']],
    ['1', 'cotizar', ['sitio_profesional', 'catalogo_sin_venta']],
    ['la primera', 'cotizar', ['sitio_profesional', 'catalogo_sin_venta']],
    ['algo para presentar mi estudio contable', 'cotizar', ['sitio_profesional']],
    ['Una tienda online', 'cotizar', ['tienda_online']],
    ['la 2', 'cotizar', ['tienda_online']],
    ['la de vender, tengo un local de ropa', 'cotizar', ['tienda_online']],
    ['la tienda, para vender mis cursos de maquillaje', 'cotizar', ['plataforma_cursos', 'tienda_con_cursos']],
    ['Algo diferente', 'responder', null],
    ['3', 'responder', null],
    ['otra cosa', 'responder', null],
    ['la última', 'responder', null],
    ['algo diferente, soy martillero y quiero publicar mis propiedades', 'cotizar', ['inmobiliaria']],
];

$ok = 0; $costo = 0.0;
foreach ($casos as $i => [$dice, $accion, $tipos]) {
    $conv = [
        'tel' => '549110009' . str_pad((string)$i, 4, '0', STR_PAD_LEFT) . 'TEST', 'canal' => 'whatsapp', 'fase' => 'menu',
        'nombre' => 'Marta', 'transcript' => [],
    ];
    $conv['conversation_key'] = $conv['tel'];
    $ts = time() - 60;
    $conv['transcript'][] = ['q' => 'cliente', 't' => 'hola', 'ts' => $ts];
    $conv['transcript'][] = ['q' => 'bot', 't' => $cfg['menu'], 'ts' => $ts + 20];
    $conv['transcript'][] = ['q' => 'bot', 't' => $cfg['menu_opciones'], 'ts' => $ts + 22];
    $conv['transcript'][] = ['q' => 'cliente', 't' => $dice, 'ts' => time()];

    $r = wabot_ia_pensar($dice, $conv, $cfg, 'real');
    $costo += (float)($r['gastado']['costo_usd'] ?? 0);
    if (!$r['ok']) { echo "  ✗ \"$dice\" → error: {$r['error']}\n"; continue; }
    $d = $r['decision'];
    $bien = $d['accion'] === $accion && ($tipos === null || in_array($d['tipo_web'], $tipos, true));
    // La opción 3 tiene que preguntar algo, no quedarse callada.
    if ($accion === 'responder' && $bien) $bien = (bool)array_filter($d['mensajes'], function ($m) { return mb_strpos($m, '?') !== false || preg_match('/\bcontame\b/iu', $m); });
    if ($bien) $ok++;
    echo ($bien ? '  ✓ ' : '  ✗ ') . "\"$dice\" → {$d['accion']}" . ($d['accion'] === 'cotizar' ? " {$d['tipo_web']}" : '')
        . ($d['mensajes'] ? ' | ' . implode(' / ', $d['mensajes']) : '') . "\n";
}

foreach (glob($GLOBALS['WABOT_TEST_IA_USO_DIR'] . '/*') ?: [] as $f) @unlink($f);
@rmdir($GLOBALS['WABOT_TEST_IA_USO_DIR']);
printf("\n%d de %d bien — costo aprox. US$ %.4f\n", $ok, count($casos), $costo);
exit($ok === count($casos) ? 0 : 1);
