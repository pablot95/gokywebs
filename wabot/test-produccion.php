<?php
/**
 * wabot/test-produccion.php — el pedido de producción (tools/demo-auto/preparar-produccion.php
 * y wabot/produccion.php, 1-nov-2026), sin red ni Firestore.
 *
 *   php wabot/test-produccion.php
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/onboarding.php';
require_once __DIR__ . '/produccion.php';
require_once __DIR__ . '/../tools/demo-auto/preparar-produccion.php';

$ahora = gmmktime(15, 0, 0, 11, 2, 2026);

echo "Lo que viaja a Firestore desde el onboarding\n";
$conv = conv_nueva('5491111TEST01', ['nombre' => 'Ana', 'nombre_negocio' => 'Kiosco Ana', 'tipo' => 'ecommerce', 'presentado_slug' => 'kioscoana', 'cliente_id' => 'CLI1',
    'onboarding' => ['inicio_ts' => $ahora - 7200, 'completo_ts' => $ahora, 'paso' => '', 'datos' => [
        'modelo' => ['valor' => '2', 'ts' => $ahora - 7000],
        'email' => ['valor' => 'ana@kioscoana.com', 'ts' => $ahora - 4000],
        'imagenes' => ['valor' => ['archivos' => ['20261102-120000-aaaa.pdf', '20261102-120100-b1.jpg', '20261102-120101-b2.jpg', 'no-existe.jpg'], 'cantidad' => 4], 'ts' => $ahora - 2000],
        'cambios' => ['valor' => "Cambiá el hero por 'Kiosco Ana, abierto 24 h'\nSacá novedades", 'ts' => $ahora - 1000],
    ]]]);
$fs = wabot_onboarding_para_firestore($conv['onboarding'], $conv);
caso('el mapa trae slug, clave del chat, tipo, fechas ISO y dato por dato', $fs['slug'] === 'kioscoana' && $fs['conversationKey'] === '5491111TEST01' && $fs['tipo'] === 'ecommerce'
    && $fs['completoAt'] === gmdate('Y-m-d\TH:i:s\Z', $ahora) && $fs['datos']['email']['valor'] === 'ana@kioscoana.com' && $fs['datos']['modelo']['omitido'] === false, json_encode($fs));

echo "Los archivos del cliente\n";
$media = WABOT_DATA . '/media/5491111TEST01';
@mkdir($media, 0755, true);
file_put_contents($media . '/20261102-120000-aaaa.pdf', '%PDF-1.4 logo');
file_put_contents($media . '/20261102-120100-b1.jpg', 'JPG1');
file_put_contents($media . '/20261102-120101-b2.jpg', 'JPG2');
$archivos = wabot_produccion_archivos($conv);
caso('las imágenes con nombres legibles (el PDF como logo); lo que no está en disco no va', array_column($archivos, 'nombre') === ['logo.pdf', 'imagen-1.jpg', 'imagen-2.jpg'], json_encode(array_column($archivos, 'nombre')));
$zip = wabot_zip_armar($archivos);
$tmp = sys_get_temp_dir() . '/wabot-test-produccion-' . getmypid();
$sacados = produccion_unzip((string)$zip, $tmp);
caso('el zip del server se desarma en la PC sin la extensión zip', $sacados === ['logo.pdf', 'imagen-1.jpg', 'imagen-2.jpg'] && file_get_contents($tmp . '/imagen-2.jpg') === 'JPG2', json_encode($sacados));
caso('la firma depende de la clave y de la acción', wabot_produccion_firma('5491111TEST01', 'archivos') !== wabot_produccion_firma('5491111TEST01', 'marcar') || !wabot_push_cuenta());
$c2 = $conv;
wabot_produccion_marcar($c2, $ahora, 'tools/demo-auto/data/sesiones/x-produccion.md');
caso('marcar deja produccion.pedido_ts y el pedido en la charla', $c2['produccion']['pedido_ts'] === $ahora && $c2['produccion']['pedido'] === 'tools/demo-auto/data/sesiones/x-produccion.md');

echo "Candidatos\n";
$docs = [
    'CLI1' => ['proyecto' => 'Kiosco Ana', 'nombre' => 'Ana', 'telefono' => '1150000001', 'planLabel' => 'Ecommerce', 'estadoCliente' => 'cliente', 'onboarding' => $fs,
               'pagoBot' => ['monto' => 30000, 'modalidad' => 'mensual', 'at' => '2026-11-02T14:00:00Z'],
               'propuestaSnapshot' => ['nombre_negocio' => 'Kiosco Ana', 'rubro' => 'Kiosco', 'tipo_web' => 'Ecommerce', 'colores' => 'rojo y blanco', 'descripcion' => 'Kiosco 24 h en Caballito']],
    'CLI2' => ['proyecto' => 'Bar Beto', 'onboarding' => ['completoAt' => '2026-11-01T12:00:00Z', 'slug' => 'barbeto', 'conversationKey' => '5491111TEST02', 'datos' => []], 'produccion' => ['pedidoAt' => '2026-11-01T13:00:00Z']],
    'CLI3' => ['proyecto' => 'Café Caro', 'onboarding' => ['completoAt' => '', 'paso' => 'fotos']],
    'CLI4' => ['proyecto' => 'Dulces Dani', 'planLabel' => 'Sitio profesional', 'onboarding' => ['completoAt' => '2026-11-01T12:00:00Z', 'slug' => '', 'conversationKey' => '', 'datos' => ['modelo' => ['valor' => null, 'omitido' => true, 'nota' => 'elegí vos']]]],
    'CLI5' => ['proyecto' => 'Bar Beto', 'planLabel' => 'Sitio profesional', 'onboarding' => ['completoAt' => '2026-11-01T12:00:00Z', 'slug' => 'barbeto', 'conversationKey' => '5491111TEST02', 'datos' => ['modelo' => ['valor' => 'ambos', 'nota' => 'el 1 con el menú del 2']]]],
];
$cand = produccion_candidatos($docs);
caso('entran los que completaron el onboarding y todavía no tienen pedido', array_keys($cand) === ['CLI1', 'CLI4', 'CLI5'], json_encode(array_keys($cand)));
caso('--solo por slug o por clave', array_keys(produccion_candidatos($docs, 'kioscoana')) === ['CLI1'] && array_keys(produccion_candidatos($docs, '5491111TEST01')) === ['CLI1'] && produccion_candidatos($docs, 'nadie') === []);
caso('el tipo sale del onboarding, o del plan', produccion_tipo($docs['CLI1']) === 'ecommerce' && produccion_tipo($docs['CLI4']) === 'landing' && produccion_tipo(['planLabel' => 'Inmobiliaria']) === 'inmobiliaria' && produccion_tipo(['planLabel' => 'Plataforma de cursos']) === 'elearning');
caso('el slug: el de la demo presentada, o el del nombre del negocio', produccion_slug($docs['CLI1']) === 'kioscoana' && produccion_slug($docs['CLI4']) === 'dulcesdani');
caso('cada tipo tiene su prompt de producción', str_ends_with(produccion_prompt_de('ecommerce'), 'prompt_completar_ecommerce.md') && str_ends_with(produccion_prompt_de('elearning'), 'prompt_completar_cursos.md') && str_ends_with(produccion_prompt_de('landing'), 'prompt_completar_landing.md'));

echo "El pedido\n";
$p = produccion_pedido_texto($docs['CLI1'], 'CLI1', 'kioscoana', 'ecommerce', ['logo.pdf', 'imagen-1.jpg', 'imagen-2.jpg'], 'tools/demo-auto/data/produccion/kioscoana/', ['En este checkout no está demo/kioscoana/index.html: hacé git pull antes de arrancar, o buscá la demo por el nombre del negocio.']);
$tiene = fn($s) => strpos($p, $s) !== false;
caso('título con la carpeta de la demo, cliente, pago y tipo', $tiene('# Pedido de producción: Kiosco Ana (demo/kioscoana/)') && $tiene('WhatsApp 1150000001') && $tiene('Pagó: $30.000 el 2/11/2026 11:00 (plan mensual) · plan Ecommerce') && $tiene('Tipo de web: ecommerce'));
caso('el aviso de la demo que no está', $tiene('⚠️ En este checkout no está demo/kioscoana/index.html'));
caso('el modelo elegido (2 → modelo-2.html pasa a index)', $tiene('**modelo 2** (modelo-2.html pasa a ser index.html)'));
caso('el prompt que corresponde y el del panel', $tiene('prompt_completar_ecommerce.md') && $tiene('prompt_panel_editor_visual.md'));
caso('el dominio lo define Pablo: el bot no lo pide', $tiene('Dominio: lo define Pablo con el cliente (el bot no lo pide)'));
caso('el email del admin, el logo en PDF y las imágenes bajadas', $tiene('`ana@kioscoana.com` (ADMIN_EMAIL') && $tiene('`logo.pdf` en `tools/demo-auto/data/produccion/kioscoana/` (viene en PDF: extraerlo en alta)') && $tiene('2 en `tools/demo-auto/data/produccion/kioscoana/` (imagen-1.jpg, imagen-2.jpg)'));
caso('los cambios tal cual los escribió, como cita', $tiene("> Cambiá el hero por 'Kiosco Ana, abierto 24 h'\n  > Sacá novedades"));
caso('ni factura ni horarios se le piden al cliente: quedan para Pablo', $tiene('NO se le piden por el bot') && strpos($p, 'CUIT/CUIL 27') === false);
caso('el brief original del formulario (el texto del botón Copiar)', $tiene('## Brief original') && $tiene('Kiosco Ana') && $tiene('rojo y blanco'));
caso('la checklist de Pablo: Firebase, dominio y DNS, Hostinger, factura, entrega', $tiene('- [ ] Crear el proyecto de Firebase para Kiosco Ana') && $tiene('usuario ana@kioscoana.com') && $tiene('- [ ] Definir el dominio con el cliente y comprarlo') && $tiene('DNS a Hostinger') && $tiene('- [ ] Pedirle los datos para la Factura C y emitirla (el bot no los pide)') && $tiene('- [ ] Revisar la web terminada'));
$p4 = produccion_pedido_texto($docs['CLI4'], 'CLI4', 'dulcesdani', 'landing', [], 'tools/demo-auto/data/produccion/dulcesdani/');
caso('sin datos: queda claro qué falta y qué se asume', strpos($p4, 'no eligió (elegí vos): usar el modelo 1') !== false && strpos($p4, 'la informativa no tiene panel con login: no hace falta') !== false && strpos($p4, 'Logo: no mandó uno aparte') !== false && strpos($p4, 'Imágenes del cliente: no mandó') !== false, $p4);
$p5 = produccion_pedido_texto($docs['CLI5'], 'CLI5', 'barbeto', 'landing', [], 'tools/demo-auto/data/produccion/barbeto/');
caso('la mezcla de los dos modelos va con lo que dijo', strpos($p5, '**una mezcla de los dos**. Lo que dijo: «el 1 con el menú del 2»') !== false, $p5);
caso('las instrucciones de la sesión existen y terminan en la línea de guiones', str_contains((string)file_get_contents(__DIR__ . '/../tools/demo-auto/instrucciones-produccion.md'), 'PRODUCCION OK') && str_ends_with(rtrim((string)file_get_contents(__DIR__ . '/../tools/demo-auto/instrucciones-produccion.md')), str_repeat('-', 70)));

echo "La etapa en la pestaña Clientes\n";
require_once __DIR__ . '/clientes.php';
$GLOBALS['WABOT_TEST_CLIENTES_CON_TEST'] = true;
$r = wabot_clientes_chat_resumen(array_merge($conv, ['pago_confirmado_ts' => $ahora - 9000, 'produccion' => ['pedido_ts' => $ahora]]));
caso('con el pedido marcado la etapa es "en producción"', wabot_clientes_etapa($r) === 'en producción');

foreach (glob($tmp . '/*') ?: [] as $f) @unlink($f);
@rmdir($tmp);
foreach (glob($media . '/*') ?: [] as $f) @unlink($f);
@rmdir($media);
todo_ok();
