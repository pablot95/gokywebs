<?php
/**
 * wabot/test-flujo-vivo-1nov.php — cinco charlas de punta a punta contra GPT
 * Sol REAL (Pablo, 1-nov-2026: "hacé 5 conversaciones reales con el bot usando
 * OpenAI para ver que el flujo funcione bien"), con el bot post-demo, los pagos
 * y el onboarding prendidos.
 *
 *   php wabot/test-flujo-vivo-1nov.php [--solo=1,3]
 *
 * El cliente está guionado con mensajes de las charlas reales del export; el
 * bot contesta con OpenAI de verdad por el mismo camino que el webhook
 * (wabot_responder). No manda WhatsApp, no crea leads ni toca Firestore ni
 * Mercado Pago: el formulario, la demo y el pago se simulan como en los tests
 * sin red. Las charlas quedan en wabot/data/conv/ de la PC y se borran al final.
 * CUESTA PLATA (unos centavos por charla): no va en los barridos de tests.
 *
 * 2-nov: corren con la prueba de precios prendida, como producción (pares en
 * A2, impares en B), y el formulario ya no trae la forma de pago: después de
 * la demo el bot la pregunta antes del link (la charla 6 la recorre entera).
 */
if (PHP_SAPI !== 'cli') exit;
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/pagos.php';
require_once __DIR__ . '/onboarding.php';

$opciones = getopt('', ['solo::']);
$solo = array_filter(array_map('intval', explode(',', (string)($opciones['solo'] ?? ''))));
if (wabot_openai_key() === '') { fwrite(STDERR, "Falta la key de OpenAI (config/wabot-config.php).\n"); exit(2); }

$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$GLOBALS['WABOT_TEST_BOT_POSTDEMO'] = true;
$GLOBALS['WABOT_TEST_SOLO_BIENVENIDA'] = false;
$GLOBALS['WABOT_TEST_SIN_AB'] = true;
$GLOBALS['WABOT_TEST_AVISO_ESTADO'] = [];
$tmp = sys_get_temp_dir() . '/wabot-flujo-vivo-' . getmypid();
@mkdir($tmp . '/uso', 0755, true);
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_PAGOS_ARCHIVO'] = $tmp . '/pagos-mp.json';
$GLOBALS['WABOT_TEST_ONBOARDING_FS'] = function ($id, $campos) { return true; };
$GLOBALS['WABOT_TEST_ONBOARDING_AVISAR'] = function ($t, $c) { echo '    (aviso a Pablo: ' . str_replace("\n", ' / ', mb_substr((string)$t, 0, 140)) . ")\n"; return 1; };

// OpenAI de verdad solo en esa llamada; todo lo demás sigue sin red.
$GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
    $hook = $GLOBALS['WABOT_TEST_OPENAI_HTTP'];
    unset($GLOBALS['WABOT_TEST_OPENAI_HTTP']);
    $GLOBALS['WABOT_TEST_SIN_RED'] = false;
    try { return wabot_openai_post($payload, 45); }
    finally { $GLOBALS['WABOT_TEST_SIN_RED'] = true; $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = $hook; }
};

$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
$cfg['plantillas'] = wabot_textos_default()['plantillas'];
foreach (['demora_primer_mensaje', 'demora_segundos', 'demora_entre_mensajes', 'demora_minima', 'demora_bienvenida'] as $k) $cfg[$k] = 0;
$cfg['demora_por_longitud'] = false;
$cfg['openai_modelo'] = 'gpt-6-sol';
$cfg['pagos_auto'] = true;
$cfg['onboarding_activo'] = true;

function linea($q, $t) {
    $pref = ['cliente' => ' >> CLIENTE: ', 'bot' => ' << BOT: ', 'sistema' => '    [sistema] '][$q] ?? "    [$q] ";
    echo $pref . str_replace("\n", "\n" . str_repeat(' ', mb_strlen($pref)), (string)$t) . "\n";
}
function estado($c) {
    $e = 'fase=' . ($c['fase'] ?? '-') . ' estado=' . (function_exists('wabot_comercial_estado') ? wabot_comercial_estado($c) : '-');
    if (!empty($c['control_manual'])) $e .= ' · CONTROL PABLO';
    if (!empty($c['bot_off'])) $e .= ' · bot_off';
    if (!empty($c['handoff_pendiente'])) $e .= ' · PABLO PENDIENTE';
    if (!empty($c['comercial_motivo'])) $e .= ' · motivo «' . $c['comercial_motivo'] . '»';
    if (!empty($c['modelo_elegido'])) $e .= ' · modelo ' . $c['modelo_elegido'];
    if (!empty($c['retomar_ts'])) $e .= ' · retomar ' . date('d/m', (int)$c['retomar_ts']);
    if (!empty($c['pago_avisado_ts'])) $e .= ' · avisó que pagó';
    if (!empty($c['pago_confirmado_ts'])) $e .= ' · PAGÓ';
    if (!empty($c['onboarding']['paso'])) $e .= ' · onboarding=' . $c['onboarding']['paso'];
    return $e;
}
/** Una línea del cliente por el mismo camino que el webhook: al chat, y el bot responde. */
function cliente(&$c, $texto, $cfg, $media = null) {
    linea('cliente', $texto !== '' ? $texto : '[' . ($media['clase'] ?? 'adjunto') . ']');
    wabot_conv_transcript($c, 'cliente', $texto, $media);
    $c['ultimo_cliente_ts'] = time();
    $t0 = microtime(true);
    $r = (array)wabot_responder($texto, $c, $cfg);
    $seg = round(microtime(true) - $t0, 1);
    $textos = [];
    foreach ($r as $m) {
        $t = is_array($m) ? (string)($m['t'] ?? '') : (string)$m;
        if ($t === '') continue;
        wabot_conv_transcript($c, 'bot', $t);
        linea('bot', $t);
        $textos[] = $t;
    }
    if (!$textos) echo "    (silencio)\n";
    echo '    · ' . estado($c) . " · {$seg}s\n";
    wabot_conv_save($c);
    return $textos;
}
function form(&$c, $cfg, array $datos) {
    wabot_conv_save($c);
    $r = wabot_form_lead_procesar(array_merge(['t' => $c['tel']], $datos), $cfg);
    $c = wabot_conv_load($c['tel']);
    linea('sistema', 'formulario completado → ' . json_encode($r, JSON_UNESCAPED_UNICODE));
    echo '    · ' . estado($c) . "\n";
}
function demo(&$c, $cfg, $slug) {
    wabot_conv_preparar_postdemo($c, $cfg);
    $c['presentado_ts'] = time();
    $c['presentado_slug'] = $slug;
    $c['presentado_confirmado'] = false;
    $c['presentado_via_bot'] = true;
    $c['cliente_id'] = 'ficha-vivo';
    linea('sistema', 'demo presentada (como presentar.php)');
    foreach ((array)wabot_muestra_presentar_textos($slug, $cfg, $c) as $m) {
        $t = is_array($m) ? (string)($m['t'] ?? '') : (string)$m;
        if ($t === '') continue;
        wabot_conv_transcript($c, 'bot', $t);
        linea('bot', $t);
    }
    echo '    · ' . estado($c) . "\n";
    wabot_conv_save($c);
}
function pago(&$c, $cfg, $monto, $modalidad) {
    $deps = ['enviar' => function (&$cv, $t) { linea('bot', $t); return true; },
             'firestore' => function ($conv, $campos) { return ['ok' => true, 'id' => 'ficha-vivo', 'creado' => false, 'error' => '']; },
             'fs_onboarding' => $GLOBALS['WABOT_TEST_ONBOARDING_FS'],
             'avisar' => $GLOBALS['WABOT_TEST_ONBOARDING_AVISAR']];
    linea('sistema', "pago confirmado por el poller: \$$monto ($modalidad)");
    $r = wabot_pago_confirmar_manual($c, (int)$monto, $modalidad, $cfg, $deps);
    if (empty($r['ok'])) linea('sistema', 'no se confirmó: ' . json_encode($r, JSON_UNESCAPED_UNICODE));
    echo '    · ' . estado($c) . "\n";
    wabot_conv_save($c);
}
function tiene(array $r, $frase) { foreach ($r as $m) if (mb_stripos($m, $frase) !== false) return true; return false; }
function foto($n) { return ['clase' => 'imagen', 'id' => 'foto-vivo-' . $n, 'mime' => 'image/jpeg']; }

$charlas = [
    1 => ['nombre' => 'Estudio contable: landing, camino feliz hasta «lo veo»', 'tel' => '5491100009310', 'pasos' => [
        ['c', 'Hola'],
        ['c', 'Soy contador, tengo un estudio contable y quiero una web para mostrar los servicios y que me contacten'],
        ['c', 'Cuánto tarda la demo? La prueba tiene costo?'],
        ['c', 'Dale, quiero ver la demo'],
        ['form', ['nombre' => 'Marcelo', 'nombre_negocio' => 'Estudio Contable Ríos', 'resumen' => 'Estudio contable: liquidación de sueldos, monotributo, balances', 'colores' => 'azul']],
        ['c', 'Listo, ya completé el formulario'],
        ['c', 'Cuánto tardan en tenerla?'],
        ['demo', 'estudiorios'],
        ['c', 'Me gustó el modelo 2'],
        ['c', 'Sería el mensual'],
        ['c', 'Cómo se paga? Se puede en cuotas con tarjeta?'],
        ['c', 'Ok, lo veo y te aviso la semana que viene'],
    ]],
    2 => ['nombre' => 'Tienda de ropa: objeciones, transferencia, pago y onboarding completo', 'tel' => '5491100009320', 'pasos' => [
        ['c', 'Hola, tengo una tienda de ropa femenina y quiero vender online'],
        ['c', 'Los productos los cargo yo? Y los envíos cómo se manejan?'],
        ['c', 'Trabajan con tienda nube?'],
        ['c', 'dale, armemos la demo'],
        ['form', ['nombre' => 'Luna', 'nombre_negocio' => 'Ropa Luna', 'resumen' => 'Indumentaria femenina, vestidos, jeans, remeras; envíos a todo el país', 'colores' => 'rosa y negro']],
        ['demo', 'ropaluna'],
        ['c', 'Buenísimo, me encantó!'],
        ['c', 'El 1'],
        ['c', 'No quiero vincular mercado pago, pasame un alias para transferir'],
        ['c', 'Listo, ya te transferí. Te mando el comprobante'],
        ['pago', 30000, 'mensual'],
        ['c', 'Soy Juan Pérez, cuit 20-12345678-9, monotributista'],
        ['c', 'ropaluna.com.ar o ropa luna, el que esté libre'],
        ['c', 'juan.perez@gmail.com'],
        ['c', 'No tengo logo'],
        ['foto', 1], ['foto', 2], ['foto', 3], ['foto', 4], ['foto', 5],
        ['c', 'Me gustaría que el fondo sea verde y sacar la parte de testimonios'],
        ['c', 'Lunes a viernes de 9 a 18, Av. Rivadavia 1234, instagram @ropaluna'],
    ]],
    3 => ['nombre' => 'Limpieza por mayor: cambios, descuento, dejo de pagar, Google y llamada', 'tel' => '5491100009330', 'pasos' => [
        ['c', 'Hola, vendo productos de limpieza al por mayor y quiero una tienda online para que me hagan pedidos'],
        ['c', 'dale, hacé la demo'],
        ['form', ['nombre' => 'Darío', 'nombre_negocio' => 'Limpiamax', 'resumen' => 'Productos de limpieza por mayor para comercios', 'colores' => 'celeste']],
        ['demo', 'limpiamax'],
        ['c', 'Me gustó pero quiero cambiar las fotos y que el fondo sea negro'],
        ['c', 'Me podés hacer un descuento?'],
        ['c', 'Qué pasa si un mes no puedo pagar? Pierdo la web?'],
        ['c', 'Aparezco en google con esto?'],
        ['c', 'Prefiero hablar por teléfono, cuál es tu número?'],
    ]],
    4 => ['nombre' => 'Nutricionista con turnos, grupo B (pago inicial + mensual)', 'tel' => '5491100009341', 'ab' => true, 'pasos' => [
        ['c', 'Hola, soy nutricionista y quiero una web para que mis pacientes saquen turno'],
        ['c', 'Y si pago todo junto me hacés precio?'],
        ['c', 'dale, quiero la demo'],
        ['form', ['nombre' => 'Carla', 'nombre_negocio' => 'Nutrición Carla Soto', 'resumen' => 'Consultorio de nutrición, turnos online, planes de alimentación', 'colores' => 'verde']],
        ['demo', 'nutricioncarla'],
        ['c', 'Me gustó el 2, quiero avanzar'],
        ['c', 'Pasame el link de pago'],
        ['c', 'Listo, ya pagué el inicial'],
    ]],
    5 => ['nombre' => 'Pizzería: «lo veo», link que no abre, pedidos por WhatsApp, cambio de nombre, suscripción y onboarding', 'tel' => '5491100009350', 'pasos' => [
        ['c', 'Hola, tengo una pizzería y quiero una web para que hagan los pedidos'],
        ['c', 'Lo veo y te aviso'],
        ['c', 'Dale, quiero la demo'],
        ['c', 'No me abre el link'],
        ['form', ['nombre' => 'Carlo', 'nombre_negocio' => 'Pizzería Don Carlo', 'resumen' => 'Pizzería con delivery, pizzas a la piedra, empanadas', 'colores' => 'rojo']],
        ['c', 'Ya está, listo'],
        ['c', 'Me pueden poner un botón para pedir por whatsapp?'],
        ['c', 'Cuánto tarda?'],
        ['demo', 'pizzeriadoncarlo'],
        ['c', 'La vi, está buena, pero el nombre está mal escrito, es Don Carlo con C'],
        ['c', 'Ya me suscribí al mensual'],
        ['pago', 30000, 'mensual'],
        ['c', 'Carlo Bianchi, 20-98765432-1, responsable inscripto'],
        ['c', 'pizzeriadoncarlo.com'],
    ]],
    6 => ['nombre' => 'Dietética (A2): modelo y pago juntos, la pregunta de la modalidad y el anual', 'tel' => '5491100009362', 'pasos' => [
        ['c', 'Hola, tengo una dietética y quiero vender online'],
        ['c', 'Dale, haceme la demo'],
        ['form', ['nombre' => 'Sole', 'nombre_negocio' => 'Dietética Sole', 'resumen' => 'Dietética: frutos secos, harinas, productos sin TACC', 'colores' => 'verde']],
        ['demo', 'dieteticasole'],
        ['c', 'Me encantó el 1! Cómo te pago?'],
        ['c', 'Prefiero el anual'],
        ['c', 'Y el resto cuándo lo pago?'],
    ]],
];

$resumen = [];
$t0 = microtime(true);
foreach ($charlas as $n => $ch) {
    if ($solo && !in_array($n, $solo, true)) continue;
    // Como producción desde el 2-nov: la prueba de precios prendida para todas (pares A2, impares B).
    $GLOBALS['WABOT_TEST_SIN_AB'] = false;
    $tel = $ch['tel'];
    @unlink(wabot_conv_path($tel));
    $c = wabot_conv_load($tel);
    $c['nombre'] = '';
    echo "\n========== CHARLA $n — {$ch['nombre']} ({$tel}, grupo " . strtoupper(wabot_ab_grupo_por_id($c)) . ") ==========\n";
    $salidas = [];
    foreach ($ch['pasos'] as $i => $paso) {
        switch ($paso[0]) {
            case 'c':    $salidas[$i] = cliente($c, $paso[1], $cfg); break;
            case 'foto': $salidas[$i] = cliente($c, '', $cfg, foto($paso[1])); break;
            case 'form': form($c, $cfg, $paso[1]); break;
            case 'demo': demo($c, $cfg, $paso[1]); break;
            case 'pago': pago($c, $cfg, $paso[1], $paso[2]); break;
        }
    }
    $todo = array_merge(...array_map(fn($s) => (array)$s, array_values($salidas) ?: [[]]));
    // Lo que contestó el bot a ese mensaje del cliente.
    $turno = fn($texto) => (array)($salidas[array_search(['c', $texto], $ch['pasos'], true)] ?? []);
    $resumen[$n] = ['nombre' => $ch['nombre'], 'estado' => estado($c), 'mensajes_bot' => count($todo)];
    echo "\n--- Chequeos de la charla $n ---\n";
    switch ($n) {
        case 1:
            caso('cotizó (planes con montos)', tiene($todo, 'Plan mensual') || tiene($todo, 'mensual:'));
            caso('mandó el link del formulario', tiene($todo, 'gokywebs.com/form'));
            caso('después del modelo 2 preguntó la modalidad (A2: anual o mensual), sin link todavía', (int)($c['modelo_elegido'] ?? 0) === 2
                && tiene($turno('Me gustó el modelo 2'), 'preferís el plan anual o el plan mensual') && !tiene($turno('Me gustó el modelo 2'), 'gokywebs.com/pago/'),
                json_encode($turno('Me gustó el modelo 2'), JSON_UNESCAPED_UNICODE));
            caso('«Sería el mensual» → el link mensual20000', tiene($todo, 'gokywebs.com/pago/mensual20000') && ($c['modalidad_elegida'] ?? '') === 'mensual', (string)($c['modalidad_elegida'] ?? ''));
            caso('«lo veo y te aviso» dejó fecha de retomar', !empty($c['retomar_ts']));
            break;
        case 2:
            caso('«El 1» → tomamos el modelo 1 y la pregunta de la modalidad', tiene($turno('El 1'), 'tomamos el modelo 1') && tiene($turno('El 1'), 'preferís'), json_encode($turno('El 1'), JSON_UNESCAPED_UNICODE));
            caso('con «no quiero MP» dio el alias pablotravi y el CVU', tiene($todo, 'pablotravi') && tiene($todo, '0000003100053462800156'));
            caso('«ya te transferí» → acuse y pago avisado', tiene($todo, 'revisamos el pago') && !empty($c['pago_avisado_ts']));
            caso('el pago confirmado arrancó el onboarding', !empty($c['pago_confirmado_ts']) && !empty($c['onboarding']));
            caso('tomó factura, dominio, email y fotos; terminó o quedó en el último paso', in_array((string)($c['onboarding']['paso'] ?? ''), ['', 'completo', 'horarios', 'cambios'], true) || !empty($c['onboarding']['completo_ts']), json_encode($c['onboarding']['paso'] ?? null));
            break;
        case 3:
            caso('los cambios quedaron anotados y contestó como Pablo', tiene($todo, 'muestra') || tiene($todo, 'primer pago'));
            caso('la llamada va a Pablo en silencio', !empty($c['handoff_pendiente']) || !empty($c['control_manual']));
            break;
        case 4:
            caso('grupo B: cotizó con pago inicial', tiene($todo, 'inicial'));
            caso('mandó un link de pago del grupo B, sin preguntar la modalidad (hay una sola)', tiene($todo, 'gokywebs.com/pago/inicial') && !tiene($todo, 'preferís'));
            caso('«ya pagué el inicial» → acuse', tiene($todo, 'revisamos el pago'));
            break;
        case 5:
            caso('«no me abre el link» reenvió el link', count(array_filter($todo, fn($m) => mb_stripos($m, 'gokywebs.com/form') !== false)) >= 2);
            caso('los cambios al nombre quedaron anotados', tiene($todo, 'muestra') || tiene($todo, 'primer pago') || tiene($todo, 'anot'));
            // Desde el 1-nov (c41d85d) el onboarding no pide factura ni dominio: modelo, email si hay login, imágenes y cambios.
            caso('la suscripción confirmada arrancó el onboarding (modelo, email, imágenes o cambios)', !empty($c['pago_confirmado_ts'])
                && in_array((string)($c['onboarding']['paso'] ?? ''), ['modelo', 'email', 'imagenes', 'cambios'], true), json_encode($c['onboarding']['paso'] ?? null));
            break;
        case 6:
            $pide = $turno('Me encantó el 1! Cómo te pago?');
            caso('«me encantó el 1, cómo te pago» → tomamos el modelo 1 y la pregunta de la modalidad, sin link', tiene($pide, 'tomamos el modelo 1')
                && tiene($pide, 'preferís el plan anual o el plan mensual') && !tiene($pide, 'gokywebs.com/pago/'), json_encode($pide, JSON_UNESCAPED_UNICODE));
            caso('«Prefiero el anual» → el plan anual con la seña ($60.000) y el resto, pago/anual210', tiene($turno('Prefiero el anual'), 'gokywebs.com/pago/anual210')
                && tiene($turno('Prefiero el anual'), '$60.000') && ($c['modalidad_elegida'] ?? '') === 'unico', json_encode($turno('Prefiero el anual'), JSON_UNESCAPED_UNICODE));
            caso('no volvió a preguntar la modalidad', count(array_filter($todo, fn($m) => mb_stripos($m, 'preferís el plan anual') !== false)) === 1);
            break;
    }
    @unlink(wabot_conv_path($tel));
}

$costo = 0.0; $llamadas = 0;
foreach (glob($tmp . '/uso/*') ?: [] as $f) {
    foreach (file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
        $j = json_decode($l, true);
        if (is_array($j)) { $costo += (float)($j['costo_usd'] ?? 0); $llamadas += (int)($j['llamadas'] ?? 1); }
    }
}
echo "\n========== RESUMEN ==========\n";
foreach ($resumen as $n => $r) echo "$n. {$r['nombre']}: {$r['mensajes_bot']} mensajes del bot · {$r['estado']}\n";
printf("Total: %d min · ~%d llamadas a OpenAI · US\$ %.3f\n", (int)round((microtime(true) - $t0) / 60), $llamadas, $costo);
foreach (glob($tmp . '/uso/*') ?: [] as $f) @unlink($f);
todo_ok();
