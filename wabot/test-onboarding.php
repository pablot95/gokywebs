<?php
/**
 * wabot/test-onboarding.php — después del pago, el bot pide lo que falta para
 * la web, una cosa por vez (onboarding.php, 1-nov-2026): modelo (1, 2 o una
 * mezcla), email solo si la web tiene login, logo y fotos, cambios. Sin red.
 *
 *   php wabot/test-onboarding.php
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/pagos.php';
require_once __DIR__ . '/onboarding.php';

$tmp = sys_get_temp_dir() . '/wabot-test-onboarding-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_PAGOS_ARCHIVO'] = $tmp . '/pagos-mp.json';
$cfg = wabot_config_load();
$cfg['onboarding_activo'] = true;   // apagado de fábrica desde el 1-nov a la noche: estas suites prueban el flujo prendido
$ahora = gmmktime(15, 0, 0, 11, 2, 2026);   // 2-nov 12:00 Argentina
$T = $ahora;

/* El cliente escribe: el mensaje va al transcript (como el webhook) y el turno del onboarding contesta. */
function cliente(&$c, $texto, &$T, $media = null, $cfg = null) {
    $T += 60;
    wabot_conv_transcript($c, 'cliente', $texto, $media);
    $c['transcript'][count($c['transcript']) - 1]['ts'] = $T;
    $c['ultimo_cliente_ts'] = $T;
    $r = wabot_onboarding_turno($c, $texto, $cfg ?? (wabot_config_load() + ['onboarding_activo' => true]), $T);
    foreach ((array)$r as $m) { wabot_conv_transcript($c, 'bot', $m); $c['transcript'][count($c['transcript']) - 1]['ts'] = $T; }
    return (array)$r;
}
function dice($r, $clave, $cfg) { return (bool)array_filter((array)$r, fn($m) => strpos($m, mb_substr((string)$cfg['onboarding_' . $clave], 0, 40)) !== false); }

echo "Qué se pide y qué no\n";
caso('cuatro pasos: modelo, email, imágenes, cambios; nada de factura, dominios ni horarios', WABOT_ONBOARDING_PASOS === ['modelo', 'email', 'imagenes', 'cambios'] && !isset($cfg['onboarding_factura']) && !isset($cfg['onboarding_dominio']) && !isset($cfg['onboarding_datos']));
caso('de fábrica el onboarding está APAGADO (Pablo, 1-nov): al pagar, el bot manda el recibido y se calla', empty(wabot_config_load()['onboarding_activo']) && wabot_textos_default()['onboarding_activo'] === false);
caso('el email solo con login: tienda, cursos, inmobiliaria o la informativa con panel', wabot_onboarding_pide_email(['tipo' => 'ecommerce']) && wabot_onboarding_pide_email(['tipo' => 'elearning']) && wabot_onboarding_pide_email(['tipo' => 'inmobiliaria'])
    && !wabot_onboarding_pide_email(['tipo' => 'landing']) && wabot_onboarding_pide_email(['tipo' => 'landing', 'landing_con_panel' => true]));
caso('a un sitio profesional sin panel no se le pide email', wabot_onboarding_pasos(['tipo' => 'landing']) === ['modelo', 'imagenes', 'cambios']);

echo "Leer lo que contesta\n";
caso('el modelo: "el 1", "modelo 2", "me gustó el segundo"', wabot_onboarding_modelo_en('el 1') === '1' && wabot_onboarding_modelo_en('Modelo 2') === '2' && wabot_onboarding_modelo_en('me gustó el segundo') === '2' && wabot_onboarding_modelo_en('hola') === '');
caso('una mezcla de los dos: "los dos", "combinar", "el 1 con el menú del 2", "un poco de cada uno"', wabot_onboarding_modelo_en('me gustaron los dos') === 'ambos' && wabot_onboarding_modelo_en('se puede combinar?') === 'ambos'
    && wabot_onboarding_modelo_en('el 1 pero con el menú del 2') === 'ambos' && wabot_onboarding_modelo_en('un poco de cada uno') === 'ambos');
caso('el email', wabot_onboarding_email_en('Usá Juan.Perez@Gmail.com porfa') === 'juan.perez@gmail.com' && wabot_onboarding_email_en('no tengo') === '');
caso('"no tengo", "después te paso" omiten; una pregunta no es la respuesta', wabot_onboarding_omite('no tengo logo') && wabot_onboarding_omite('después te paso las fotos') && !wabot_onboarding_omite('sí, tengo') && wabot_onboarding_parece_pregunta('cuánto tarda?'));

echo "Arranque desde la confirmación del pago (tienda)\n";
$c = conv_nueva('5491111TEST01', ['nombre' => 'Ana', 'nombre_negocio' => 'Kiosco Ana', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'cliente_id' => 'CLI1', 'ultimo_cliente_ts' => $ahora - 600]);
$c['transcript'] = [['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => $ahora - 90000], ['q' => 'cliente', 't' => 'me gustó el modelo 2', 'ts' => $ahora - 80000], ['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
$enviados = []; $fsEscrito = []; $avisos = [];
$deps = ['ahora' => $ahora, 'enviar' => function (&$cv, $t) use (&$enviados) { $enviados[] = $t; return true; },
         'firestore' => function ($conv, $campos) { return ['ok' => true, 'id' => 'CLI1', 'creado' => false, 'error' => '']; },
         'fs_onboarding' => function ($id, $campos) use (&$fsEscrito) { $fsEscrito[] = [$id, $campos]; return true; },
         'avisar' => function ($t, $cu) use (&$avisos) { $avisos[] = $t; return 1; }];
$GLOBALS['WABOT_TEST_ONBOARDING_FS'] = $deps['fs_onboarding'];
$GLOBALS['WABOT_TEST_ONBOARDING_AVISAR'] = $deps['avisar'];
$r = wabot_pago_confirmar($c, ['id' => 'p1', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado', 'suscripcion' => 's1'], 'mensual', $cfg, $deps);
caso('al confirmar: la apertura (sin "otro número") y la PRIMERA pregunta que falta; el modelo ya lo había dicho, así que el email',
    count($enviados) === 2 && $enviados[0] === $cfg['onboarding_apertura'] && strpos($enviados[0], 'otro número') === false && $enviados[1] === $cfg['onboarding_email'], json_encode($enviados));
caso('el modelo quedó de la charla y la ficha lo resume', ($c['onboarding']['datos']['modelo']['valor'] ?? '') === '2' && wabot_onboarding_resumen($c) === 'Datos para la web: 1 de 4 · pidiendo el email del panel', wabot_onboarding_resumen($c));
caso('lo que salió quedó en el chat como mensajes del bot', end($c['transcript'])['q'] === 'bot' && end($c['transcript'])['t'] === $cfg['onboarding_email']);

echo "El turno, paso a paso\n";
$r = cliente($c, 'cuánto tarda la web?', $T, null, $cfg);
caso('una pregunta en el medio no se toma como respuesta: repregunta una vez (1-nov) y el paso sigue', count($r) === 1 && strpos($r[0], $cfg['onboarding_no_entendi']) === 0 && dice($r, 'email', $cfg) && empty($c['handoff_pendiente']) && $c['onboarding']['paso'] === 'email', json_encode($r));
$r = cliente($c, 'y el hosting lo pagan ustedes?', $T, null, $cfg);
caso('la segunda seguida sin respuesta: se calla y queda para Pablo (handoff), el paso sigue', $r === [] && !empty($c['handoff_pendiente']) && $c['onboarding']['paso'] === 'email');
$c['handoff_pendiente'] = false;
$r = cliente($c, 'ana@kioscoana.com', $T, null, $cfg);
caso('el email; pide el logo y las fotos en un solo mensaje', ($c['onboarding']['datos']['email']['valor'] ?? '') === 'ana@kioscoana.com' && $c['onboarding']['paso'] === 'imagenes' && count($r) === 1 && strpos($r[0], $cfg['onboarding_ok']) === 0 && dice($r, 'imagenes', $cfg), json_encode($r));
caso('cada dato se refleja en el doc de clientes (campo onboarding, con slug, clave y tipo)', count($fsEscrito) >= 1 && end($fsEscrito)[0] === 'CLI1' && (end($fsEscrito)[1]['onboarding']['datos']['email']['valor'] ?? '') === 'ana@kioscoana.com' && end($fsEscrito)[1]['onboarding']['tipo'] === 'ecommerce');
$r = cliente($c, '[documento] Mandó un PDF con el logo', $T, ['clase' => 'documento', 'archivo' => 'logo.pdf'], $cfg);
caso('con 1 archivo avisa cuántos van y espera', count($r) === 1 && strpos($r[0], 'Recibí 1 imagen') === 0 && $c['onboarding']['paso'] === 'imagenes', json_encode($r));
foreach (['f2.jpg', 'f3.jpg', 'f4.jpg'] as $f) { $T += 1; wabot_conv_transcript($c, 'cliente', '[foto]', ['clase' => 'imagen', 'archivo' => $f]); $c['transcript'][count($c['transcript']) - 1]['ts'] = $T; }
$r = cliente($c, '[foto] Mandó otra foto', $T, ['clase' => 'imagen', 'archivo' => 'f5.jpg'], $cfg);
caso('con 5 archivos ya está (el PDF del logo cuenta): pasa a los cambios', ($c['onboarding']['datos']['imagenes']['valor']['cantidad'] ?? 0) === 5 && ($c['onboarding']['datos']['imagenes']['valor']['archivos'][0] ?? '') === 'logo.pdf' && $c['onboarding']['paso'] === 'cambios' && dice($r, 'cambios', $cfg), json_encode([$c['onboarding']['datos']['imagenes'] ?? null, $r]));
$avisos = [];
$r = cliente($c, 'Cambiá el texto del hero por "Kiosco Ana, abierto 24 h" y sacá la sección de novedades', $T, null, $cfg);
caso('los cambios quedan tal cual los escribió y con eso termina: el cierre, completo_ts, aviso a Pablo y Firestore',
    strpos($c['onboarding']['datos']['cambios']['valor'] ?? '', 'Kiosco Ana, abierto 24 h') !== false && dice($r, 'completo', $cfg) && !empty($c['onboarding']['completo_ts']) && $c['onboarding']['paso'] === ''
    && (bool)array_filter($avisos, fn($a) => strpos($a, 'Listo para producción') !== false) && (end($fsEscrito)[1]['onboarding']['completoAt'] ?? '') !== '', json_encode([$r, $avisos]));
caso('ya no está activo: el turno vuelve al flujo normal', !wabot_onboarding_activo($c, $cfg) && wabot_onboarding_resumen($c) === 'Datos para la web completos el 2/11');
caso('el resumen de lo que juntó', wabot_onboarding_datos_texto($c) === 'modelo 2, email, 5 imágenes, cambios', wabot_onboarding_datos_texto($c));

echo "Sitio profesional sin panel: sin email; mezcla de modelos; omitir\n";
$c2 = conv_nueva('5491111TEST02', ['nombre' => 'Beto', 'tipo' => 'landing', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600]);
$c2['transcript'] = [['q' => 'cliente', 't' => 'ya transferí', 'ts' => $ahora - 600]];
$enviados = [];
wabot_pago_confirmar($c2, ['id' => 'p2', 'monto' => 60000, 'ts' => $ahora - 300, 'tipo' => 'transferencia', 'modo' => 'monto_avisado'], 'anual', $cfg, $deps);
caso('sin el modelo dicho, lo primero que pide es el modelo (y la pregunta ofrece combinar)', $c2['onboarding']['paso'] === 'modelo' && $enviados[1] === $cfg['onboarding_modelo'] && stripos($cfg['onboarding_modelo'], 'los dos') !== false);
$r = cliente($c2, 'Me gusta el 1 pero con el menú del 2', $T, null, $cfg);
caso('"el 1 pero con el menú del 2" = una mezcla, con lo que dijo anotado; sin panel pasa directo a las imágenes', ($c2['onboarding']['datos']['modelo']['valor'] ?? '') === 'ambos' && ($c2['onboarding']['datos']['modelo']['nota'] ?? '') === 'Me gusta el 1 pero con el menú del 2'
    && $c2['onboarding']['paso'] === 'imagenes' && dice($r, 'imagenes', $cfg), json_encode([$c2['onboarding']['datos']['modelo'] ?? null, $r]));
$r = cliente($c2, 'no tengo logo ni fotos todavía, después te paso', $T, null, $cfg);
caso('"no tengo… después te paso" sin ningún archivo omite las imágenes (quedan para Pablo) y pide los cambios', !empty($c2['onboarding']['datos']['imagenes']['omitido']) && $c2['onboarding']['paso'] === 'cambios');
$r = cliente($c2, 'está bien así', $T, null, $cfg);
caso('"está bien así" = sin cambios, y termina', !empty($c2['onboarding']['datos']['cambios']['omitido']) && !empty($c2['onboarding']['completo_ts']) && dice($r, 'completo', $cfg));
caso('el resumen dice lo que no tiene', wabot_onboarding_datos_texto($c2) === 'modelo ambos, imagenes: no tiene, cambios: ninguno', wabot_onboarding_datos_texto($c2));

echo "Con 2 fotos y \"listo\"; \"elegí vos\" el modelo\n";
$c3 = conv_nueva('5491111TEST03', ['nombre' => 'Caro', 'tipo' => 'inmobiliaria', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600]);
$c3['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
wabot_pago_confirmar($c3, ['id' => 'p3', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'referencia'], 'mensual', $cfg, $deps);
$r = cliente($c3, 'elegí vos, el que te parezca', $T, null, $cfg);
caso('"elegí vos" deja el modelo a elección del diseñador y sigue con el email (inmobiliaria tiene panel)', !empty($c3['onboarding']['datos']['modelo']['omitido']) && $c3['onboarding']['paso'] === 'email');
cliente($c3, 'caro@inmo.com', $T, null, $cfg);
cliente($c3, '[foto]', $T, ['clase' => 'imagen', 'archivo' => 'a.jpg'], $cfg);
cliente($c3, '[foto]', $T, ['clase' => 'imagen', 'archivo' => 'b.jpg'], $cfg);
$r = cliente($c3, 'listo, esas son', $T, null, $cfg);
caso('"listo" con 2 fotos alcanza: sigue con los cambios', ($c3['onboarding']['datos']['imagenes']['valor']['cantidad'] ?? 0) === 2 && $c3['onboarding']['paso'] === 'cambios');

echo "Una charla arrancada con la versión anterior (pedía la factura): cancelada, la sigue Pablo\n";
$c4 = conv_nueva('5491111TEST04', ['nombre' => 'Sofi', 'tipo' => 'landing', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'pago_confirmado_ts' => $ahora - 3000,
    'onboarding' => ['inicio_ts' => $ahora - 3000, 'paso' => 'factura', 'datos' => ['modelo' => ['valor' => 2, 'ts' => $ahora - 3000, 'origen' => 'charla']], 'preguntado_ts' => $ahora - 3000, 'recordatorio_ts' => 0, 'completo_ts' => 0, 'fotos_desde_ts' => 0, 'pendiente_apertura' => false]]);
caso('el onboarding de la versión vieja no está activo: el bot no le escribe más por esto', !wabot_onboarding_activo($c4, $cfg) && wabot_onboarding_es_version_vieja($c4['onboarding']));
$rec = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST04' => $c4], function (&$cv, $t) { return true; }, function ($cv) {});
caso('ni el recordatorio le insiste', $rec['enviados'] === 0 && $rec['revisadas'] === 0);
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'off';
$c4['control_manual'] = false;
$out = turno('Sofía Arce, 27-22333444-1, monotributista', $c4, $cfg);
caso('si contesta, el turno NO va al onboarding (sigue el flujo normal, que con la demo presentada se calla)', !isset($c4['onboarding']['datos']['factura']) && $c4['onboarding']['paso'] === 'factura' && !(bool)array_filter($out, fn($m) => strpos($m, 'logo') !== false), json_encode($out));

echo "Pausa y recordatorio\n";
$c5 = conv_nueva('5491111TEST06', ['nombre' => 'Dani', 'tipo' => 'landing', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => '2']);
$c5['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
wabot_pago_confirmar($c5, ['id' => 'p5', 'monto' => 20000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado'], 'mensual', $cfg, $deps);
caso('con modelo_elegido en la charla (lo anota el post-demo) y sin panel, arranca pidiendo las imágenes', $c5['onboarding']['paso'] === 'imagenes');
$preguntado = $c5['onboarding']['preguntado_ts'];
$mandados = [];
$enviarRec = function (&$cv, $t) use (&$mandados) { $mandados[] = [$cv['conversation_key'], $t]; return true; };
$guardar = function ($cv) {};
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 10 * 3600, ['5491111TEST06' => $c5], $enviarRec, $guardar);
caso('a las 10 h todavía no recuerda nada', $r['enviados'] === 0 && $mandados === []);
$c5['ultimo_cliente_ts'] = $preguntado - 1;
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST06' => $c5], $enviarRec, $guardar);
caso('a las 22 h sin respuesta (la ventana de 24 h sigue abierta): el recordatorio con la pregunta pendiente', $r['enviados'] === 1 && strpos($mandados[0][1], 'pudiste ver lo que te pedí') !== false && strpos($mandados[0][1], mb_substr($cfg['onboarding_imagenes'], 0, 30)) !== false, json_encode($r));
$c5Rec = $c5; $c5Rec['onboarding']['recordatorio_ts'] = $ahora + 22 * 3600; $mandados = [];
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 23 * 3600, ['5491111TEST06' => $c5Rec], $enviarRec, $guardar);
caso('no se le recuerda dos veces la misma pregunta', $r['enviados'] === 0);
$c5Pablo = $c5; $c5Pablo['control_manual'] = true;
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST06' => $c5Pablo], $enviarRec, $guardar);
caso('si Pablo tomó el chat, el bot no insiste', $r['enviados'] === 0);
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 36 * 3600, ['5491111TEST06' => $c5], $enviarRec, $guardar);   // 4-nov 00:00 (hora argentina)
caso('de noche no sale', !empty($r['fuera_de_hora']));
$c5Vieja = $c5; $c5Vieja['ultimo_cliente_ts'] = $ahora - 30 * 3600; $c5Vieja['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 30 * 3600]]; $mandados = [];
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST06' => $c5Vieja], $enviarRec, $guardar);
caso('con la ventana de 24 h cerrada no se puede escribir: queda anotado', $r['enviados'] === 0 && ($r['detalle'][0]['estado'] ?? '') === 'ventana_cerrada');
$enviados = [];
$c5Pablo['bot_off'] = true;
$r = wabot_onboarding_retomar($c5Pablo, $cfg, $ahora + 3600, ['enviar' => function (&$cv, $t) use (&$enviados) { $enviados[] = $t; return true; }]);
caso('"Que siga el bot" desde la ficha: le devuelve el chat al bot y repite la pregunta pendiente', $r['ok'] && empty($c5Pablo['control_manual']) && empty($c5Pablo['bot_off']) && $enviados === [$cfg['onboarding_imagenes']], json_encode($r));

echo "Ventana cerrada al confirmar\n";
$c6 = conv_nueva('5491111TEST07', ['nombre' => 'Eva', 'tipo' => 'landing', 'presentado_ts' => $ahora - 200000, 'ultimo_cliente_ts' => $ahora - 100000, 'modelo_elegido' => '1']);
$enviados = [];
wabot_pago_confirmar($c6, ['id' => 'p6', 'monto' => 20000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'asignado'], 'mensual', $cfg, $deps);
caso('con la ventana de WhatsApp cerrada no sale nada y queda la apertura pendiente', $enviados === [] && !empty($c6['onboarding']['pendiente_apertura']) && wabot_onboarding_activo($c6, $cfg));
$r = cliente($c6, 'hola, pagué ayer', $T, null, $cfg);
caso('cuando el cliente escribe, salen la apertura y la primera pregunta', count($r) === 2 && $r[0] === $cfg['onboarding_apertura'] && $r[1] === $cfg['onboarding_imagenes'] && $c6['onboarding']['paso'] === 'imagenes', json_encode($r));

echo "Apagado y ganchos\n";
$c7 = conv_nueva('5491111TEST08', ['tipo' => 'landing']);
$enviados = [];
wabot_pago_confirmar($c7, ['id' => 'p7', 'monto' => 20000, 'ts' => $ahora, 'tipo' => 'manual', 'modo' => 'manual'], 'mensual', array_merge($cfg, ['onboarding_activo' => false]), $deps);
caso('con onboarding_activo en false el pago se confirma pero el bot no pide nada', !empty($c7['pago_confirmado_ts']) && $enviados === [] && !wabot_onboarding_activo($c7, $cfg));
$comercial = (string)file_get_contents(__DIR__ . '/comercial.php');
caso('wabot_comercial_turno cede el turno al onboarding', strpos($comercial, 'wabot_onboarding_activo($conv, $cfg)') !== false && strpos($comercial, 'return wabot_onboarding_turno($conv, $texto, $cfg);') !== false);
$redactor = (string)file_get_contents(__DIR__ . '/redactor.php');
caso('y wabot_responder también cuando el flujo comercial no está en automático', strpos($redactor, "wabot_flujo_comercial(\$cfg) !== 'auto' && wabot_onboarding_activo(\$conv, \$cfg)") !== false);
caso('el cron manda el recordatorio', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_onboarding_recordatorio_correr($cfg)') !== false);
caso('ningún texto del bot pide CUIT, factura ni dominio', !preg_grep('/cuit|factura|dominio|horario/iu', array_filter($cfg, fn($v, $k) => strpos($k, 'onboarding_') === 0 && is_string($v), ARRAY_FILTER_USE_BOTH)));

// De punta a punta por el borde común: el flujo comercial en automático cede el turno.
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$c8 = conv_nueva('5491111TEST09', ['nombre' => 'Flor', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => '1', 'control_manual' => true]);
wabot_pago_confirmar($c8, ['id' => 'p8', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado'], 'mensual', $cfg, $deps);
$out = turno('flor@gmail.com', $c8, $cfg);
caso('por wabot_responder (flujo auto): el onboarding toma el turno y pasa a las imágenes', $c8['onboarding']['paso'] === 'imagenes' && count($out) === 1 && dice($out, 'imagenes', $cfg), json_encode($out));
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'off';
$out = turno('no tengo fotos todavía', $c8, $cfg);
caso('por wabot_responder (flujo off): también', $c8['onboarding']['paso'] === 'cambios' && dice($out, 'cambios', $cfg), json_encode($out));
$c8['control_manual'] = true;
$out = turno('sacá el banner', $c8, $cfg);
caso('si Pablo escribió (control manual), el bot se calla como siempre y el onboarding espera', $out === [] && $c8['onboarding']['paso'] === 'cambios');

echo "Contesta otro paso del que se le pidió (charla en vivo del 1-nov)\n";
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$c9 = conv_nueva('5491111TEST10', ['nombre' => 'Carlo', 'nombre_negocio' => 'Pizzería Don Carlo', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'cliente_id' => 'CLI9', 'ultimo_cliente_ts' => $ahora - 600]);
$c9['transcript'] = [['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => $ahora - 90000], ['q' => 'cliente', 't' => 'ya me suscribí al mensual', 'ts' => $ahora - 600]];
$enviados9 = [];
wabot_pago_confirmar($c9, ['id' => 'p9', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado', 'suscripcion' => 's9'], 'mensual', $cfg,
    ['ahora' => $ahora, 'enviar' => function (&$cv, $t) use (&$enviados9) { $enviados9[] = $t; return true; }, 'firestore' => fn($conv, $campos) => ['ok' => true, 'id' => 'CLI9', 'creado' => false, 'error' => ''], 'fs_onboarding' => fn($id, $campos) => true, 'avisar' => fn($t, $cu) => 1]);
caso('sin modelo elegido, arranca pidiendo el modelo', $c9['onboarding']['paso'] === 'modelo' && dice($enviados9, 'modelo', $cfg));
// Charla en vivo (2-nov): con paso=modelo mandó sus datos de factura y el «-1» del CUIT se anotó como el modelo 1.
$c9b = $c9;
$r = cliente($c9b, 'Carlo Bianchi, 20-98765432-1, responsable inscripto', $T, null, $cfg);
caso('los datos de factura con un CUIT no eligen el modelo: repregunta el modelo', !isset($c9b['onboarding']['datos']['modelo']) && $c9b['onboarding']['paso'] === 'modelo'
    && count($r) === 1 && strpos($r[0], $cfg['onboarding_no_entendi']) === 0 && dice($r, 'modelo', $cfg), json_encode($r, JSON_UNESCAPED_UNICODE));
caso('un CUIT, un DNI o un teléfono no son un modelo; "Modelo 1." y "el 2" sí', wabot_onboarding_modelo_en('Carlo Bianchi, 20 98765432 1') === '' && wabot_onboarding_modelo_en('DNI 32.456.781') === ''
    && wabot_onboarding_modelo_en('mi cel es 11 4068-8675') === '' && wabot_onboarding_modelo_en('Modelo 1.') === '1' && wabot_onboarding_modelo_en('el 2, mi cuit 20-98765432-1') === '2');
$r = cliente($c9, 'carlo@donCarlo.com', $T, null, $cfg);
caso('contesta el email cuando se le pedía el modelo: se toma igual y se vuelve a pedir el modelo, sin callarse', ($c9['onboarding']['datos']['email']['valor'] ?? '') === 'carlo@doncarlo.com' && $c9['onboarding']['paso'] === 'modelo'
    && count($r) === 1 && strpos($r[0], $cfg['onboarding_ok']) === 0 && dice($r, 'modelo', $cfg) && empty($c9['handoff_pendiente']), json_encode($r));
$r = cliente($c9, 'me gusta más el diseño claro', $T, null, $cfg);
caso('un texto que no dice el modelo ni otro dato: repregunta una vez', count($r) === 1 && strpos($r[0], $cfg['onboarding_no_entendi']) === 0 && dice($r, 'modelo', $cfg) && $c9['onboarding']['paso'] === 'modelo', json_encode($r));
$r = cliente($c9, 'el 2', $T, null, $cfg);
caso('con el modelo, salta el email (ya contestado) y pide las imágenes; el contador de "no entendí" se limpia', ($c9['onboarding']['datos']['modelo']['valor'] ?? '') === '2' && $c9['onboarding']['paso'] === 'imagenes' && dice($r, 'imagenes', $cfg) && ($c9['onboarding']['sin_entender'] ?? 0) === 0, json_encode($r));

array_map('unlink', glob($tmp . '/*') ?: []); @rmdir($tmp);
todo_ok();
