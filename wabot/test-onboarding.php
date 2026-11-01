<?php
/**
 * wabot/test-onboarding.php — después del pago, el bot pide lo que falta para
 * la web, una cosa por vez (onboarding.php, 1-nov-2026). Sin red: OpenAI
 * simulado con WABOT_TEST_OPENAI_HTTP, Firestore con un callable.
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
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$cfg = wabot_config_load();
$ahora = gmmktime(15, 0, 0, 11, 2, 2026);   // 2-nov 12:00 Argentina
$T = $ahora;

/* El cliente escribe: el mensaje va al transcript (como el webhook) y el turno del onboarding contesta. */
function cliente(&$c, $texto, &$T, $media = null, $cfg = null) {
    $T += 60;
    wabot_conv_transcript($c, 'cliente', $texto, $media);
    $c['transcript'][count($c['transcript']) - 1]['ts'] = $T;
    $c['ultimo_cliente_ts'] = $T;
    $r = wabot_onboarding_turno($c, $texto, $cfg ?? wabot_config_load(), $T);
    foreach ((array)$r as $m) { wabot_conv_transcript($c, 'bot', $m); $c['transcript'][count($c['transcript']) - 1]['ts'] = $T; }
    return (array)$r;
}
function dice($r, $clave, $cfg) { return (bool)array_filter((array)$r, fn($m) => strpos($m, mb_substr((string)$cfg['onboarding_' . $clave], 0, 40)) !== false); }

echo "Leer lo que contesta\n";
caso('el modelo: "el 1", "modelo 2", "me gustó el segundo"', wabot_onboarding_modelo_en('el 1') === 1 && wabot_onboarding_modelo_en('Modelo 2') === 2 && wabot_onboarding_modelo_en('me gustó el segundo') === 2 && wabot_onboarding_modelo_en('me gustaron los dos') === 0);
caso('el CUIT escrito como sea', wabot_onboarding_cuit_en('20-12345678-9') === '20123456789' && wabot_onboarding_cuit_en('cuit 27 11111111 3') === '27111111113' && wabot_onboarding_cuit_en('mi dni es 12345678') === '');
caso('la condición frente al IVA', wabot_onboarding_iva_en('soy monotributista') === 'Monotributista' && wabot_onboarding_iva_en('Responsable Inscripto') === 'Responsable inscripto' && wabot_onboarding_iva_en('exenta') === 'Exento' && wabot_onboarding_iva_en('juan') === '');
caso('el email', wabot_onboarding_email_en('Usá Juan.Perez@Gmail.com porfa') === 'juan.perez@gmail.com' && wabot_onboarding_email_en('no tengo') === '');
$d = wabot_onboarding_dominios_en("zapasmoda.com.ar, zapas moda o ZapasModaOk");
caso('los dominios: con terminación o sin (.com.ar), sin espacios ni mayúsculas', $d === ['zapasmoda.com.ar', 'zapasmoda.com.ar', 'zapasmodaok.com.ar'] || $d === ['zapasmoda.com.ar', 'zapasmodaok.com.ar'], json_encode($d));
caso('una lista numerada', wabot_onboarding_dominios_en("1. kioscoana.com\n2. kiosco-ana.com.ar") === ['kioscoana.com', 'kiosco-ana.com.ar'], json_encode(wabot_onboarding_dominios_en("1. kioscoana.com\n2. kiosco-ana.com.ar")));
caso('"no tengo", "después te paso" omiten; una pregunta no es la respuesta', wabot_onboarding_omite('no tengo logo') && wabot_onboarding_omite('después te paso las fotos') && !wabot_onboarding_omite('sí, tengo') && wabot_onboarding_parece_pregunta('cuánto tarda?'));

echo "Arranque desde la confirmación del pago\n";
$c = conv_nueva('5491111TEST01', ['nombre' => 'Ana', 'nombre_negocio' => 'Kiosco Ana', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'cliente_id' => 'CLI1', 'ultimo_cliente_ts' => $ahora - 600]);
$c['transcript'] = [['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => $ahora - 90000], ['q' => 'cliente', 't' => 'me gustó el modelo 2', 'ts' => $ahora - 80000], ['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
$enviados = []; $fsEscrito = []; $avisos = [];
$deps = ['ahora' => $ahora, 'enviar' => function (&$cv, $t) use (&$enviados) { $enviados[] = $t; return true; },
         'firestore' => function ($conv, $campos) { return ['ok' => true, 'id' => 'CLI1', 'creado' => false, 'error' => '']; },
         'fs_onboarding' => function ($id, $campos) use (&$fsEscrito) { $fsEscrito[] = [$id, $campos]; return true; },
         'avisar' => function ($t, $cu) use (&$avisos) { $avisos[] = $t; return 1; }];
// El turno llega del webhook sin dependencias: lo que manda afuera se intercepta con estos ganchos.
$GLOBALS['WABOT_TEST_ONBOARDING_FS'] = $deps['fs_onboarding'];
$GLOBALS['WABOT_TEST_ONBOARDING_AVISAR'] = $deps['avisar'];
$r = wabot_pago_confirmar($c, ['id' => 'p1', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado', 'suscripcion' => 's1'], 'mensual', $cfg, $deps);
caso('al confirmar el pago arranca el onboarding: la apertura de Pablo (sin "otro número") y la PRIMERA pregunta que falta',
    count($enviados) === 2 && $enviados[0] === $cfg['onboarding_apertura'] && strpos($enviados[0], 'otro número') === false && $enviados[1] === $cfg['onboarding_factura'], json_encode($enviados));
caso('el modelo ya lo había dicho al ver la demo: no se le vuelve a preguntar', ($c['onboarding']['datos']['modelo']['valor'] ?? 0) === 2 && $c['onboarding']['paso'] === 'factura');
caso('lo que salió quedó en el chat como mensajes del bot', end($c['transcript'])['q'] === 'bot' && end($c['transcript'])['t'] === $cfg['onboarding_factura']);
caso('el aviso a Pablo dice que el bot ya le pidió lo que falta', (bool)array_filter($avisos, fn($a) => strpos($a, 'Pago confirmado') !== false) && $r['mensajes'] === $enviados);
caso('el onboarding está activo y la ficha lo resume', wabot_onboarding_activo($c, $cfg) && wabot_onboarding_resumen($c) === 'Datos para la web: 1 de 8 · pidiendo los datos para la factura', wabot_onboarding_resumen($c));

echo "El turno, paso a paso (sin OpenAI: reglas)\n";
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';
$r = cliente($c, 'Juan Pérez, 20-12345678-9, monotributista', $T, null, $cfg);
$f = $c['onboarding']['datos']['factura']['valor'] ?? [];
caso('la factura completa en un mensaje: nombre, CUIT y condición; pasa a los dominios', ($f['razon_social'] ?? '') === 'Juan Pérez' && ($f['cuit'] ?? '') === '20123456789' && ($f['iva'] ?? '') === 'Monotributista'
    && $c['onboarding']['paso'] === 'dominio' && count($r) === 1 && strpos($r[0], $cfg['onboarding_ok']) === 0 && dice($r, 'dominio', $cfg), json_encode([$f, $r]));
caso('cada dato se refleja en el doc de clientes (campo onboarding)', count($fsEscrito) >= 1 && end($fsEscrito)[0] === 'CLI1' && (end($fsEscrito)[1]['onboarding']['datos']['factura']['valor']['cuit'] ?? '') === '20123456789');
$r = cliente($c, 'cuánto tarda la web?', $T, null, $cfg);
caso('una pregunta en el medio no se toma como respuesta: repregunta una vez (1-nov) y el paso sigue', count($r) === 1 && strpos($r[0], $cfg['onboarding_no_entendi']) === 0 && dice($r, 'dominio', $cfg) && empty($c['handoff_pendiente']) && $c['onboarding']['paso'] === 'dominio', json_encode($r));
$r = cliente($c, 'y el hosting lo pagan ustedes?', $T, null, $cfg);
caso('la segunda seguida sin respuesta: se calla y queda para Pablo (handoff), el paso sigue', $r === [] && !empty($c['handoff_pendiente']) && $c['onboarding']['paso'] === 'dominio');
$c['handoff_pendiente'] = false;
$r = cliente($c, 'kioscoana.com.ar o kiosco ana', $T, null, $cfg);
caso('los dominios: 2 nombres y sigue con el email', ($c['onboarding']['datos']['dominio']['valor'] ?? []) === ['kioscoana.com.ar'] || count($c['onboarding']['datos']['dominio']['valor']) === 2, json_encode($c['onboarding']['datos']['dominio'] ?? null));
caso('… y pregunta el email', $c['onboarding']['paso'] === 'email' && dice($r, 'email', $cfg));
$r = cliente($c, 'ana@kioscoana.com', $T, null, $cfg);
caso('el email; pide el logo', ($c['onboarding']['datos']['email']['valor'] ?? '') === 'ana@kioscoana.com' && $c['onboarding']['paso'] === 'logo' && dice($r, 'logo', $cfg));
$r = cliente($c, '[documento] Mandó un PDF con el logo', $T, ['clase' => 'documento', 'archivo' => 'logo.pdf'], $cfg);
caso('el logo llega como archivo (PDF o imagen): se guarda y pide las fotos', ($c['onboarding']['datos']['logo']['valor']['archivos'] ?? []) === ['logo.pdf'] && $c['onboarding']['paso'] === 'fotos' && dice($r, 'fotos', $cfg), json_encode($r));
$r = cliente($c, '[foto] Mandó una foto del local', $T, ['clase' => 'imagen', 'archivo' => 'f1.jpg'], $cfg);
caso('con 1 foto avisa cuántas van y espera', count($r) === 1 && strpos($r[0], 'Recibí 1 foto') === 0 && $c['onboarding']['paso'] === 'fotos', json_encode($r));
foreach (['f2.jpg', 'f3.jpg', 'f4.jpg'] as $f) { $T += 1; wabot_conv_transcript($c, 'cliente', '[foto]', ['clase' => 'imagen', 'archivo' => $f]); $c['transcript'][count($c['transcript']) - 1]['ts'] = $T; }
$r = cliente($c, '[foto] Mandó otra foto', $T, ['clase' => 'imagen', 'archivo' => 'f5.jpg'], $cfg);
caso('con 5 fotos ya está: las cuenta desde que las pidió y pasa a los cambios', ($c['onboarding']['datos']['fotos']['valor']['cantidad'] ?? 0) === 5 && $c['onboarding']['paso'] === 'cambios' && dice($r, 'cambios', $cfg), json_encode([$c['onboarding']['datos']['fotos'] ?? null, $r]));
$r = cliente($c, 'Cambiá el texto del hero por "Kiosco Ana, abierto 24 h" y sacá la sección de novedades', $T, null, $cfg);
caso('los cambios quedan tal cual los escribió; pide los datos', strpos($c['onboarding']['datos']['cambios']['valor'] ?? '', 'Kiosco Ana, abierto 24 h') !== false && $c['onboarding']['paso'] === 'datos' && dice($r, 'datos', $cfg));
$avisos = [];
$r = cliente($c, 'De lunes a sábado de 8 a 20. Av. Rivadavia 1234, Caballito. Instagram @kioscoana', $T, null, $cfg);
caso('con los datos termina: el cierre, completo_ts, aviso a Pablo y Firestore', dice($r, 'completo', $cfg) && !empty($c['onboarding']['completo_ts']) && $c['onboarding']['paso'] === ''
    && (bool)array_filter($avisos, fn($a) => strpos($a, 'Listo para producción') !== false) && (end($fsEscrito)[1]['onboarding']['completoAt'] ?? '') !== '', json_encode([$r, $avisos]));
caso('ya no está activo: el turno vuelve al flujo normal', !wabot_onboarding_activo($c, $cfg) && wabot_onboarding_resumen($c) === 'Datos para la web completos el 2/11');
caso('el resumen de lo que juntó', wabot_onboarding_datos_texto($c) === 'modelo 2, factura, 1 dominios, email, logo, 5 fotos, cambios, datos' || strpos(wabot_onboarding_datos_texto($c), 'modelo 2, factura') === 0, wabot_onboarding_datos_texto($c));

echo "Omitir y respuestas parciales\n";
$c2 = conv_nueva('5491111TEST02', ['nombre' => 'Beto', 'tipo' => 'landing', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600]);
$c2['transcript'] = [['q' => 'cliente', 't' => 'ya transferí', 'ts' => $ahora - 600]];
$enviados = [];
wabot_pago_confirmar($c2, ['id' => 'p2', 'monto' => 60000, 'ts' => $ahora - 300, 'tipo' => 'transferencia', 'modo' => 'monto_avisado'], 'anual', $cfg, $deps);
caso('sin el modelo dicho, lo primero que pide es el modelo', $c2['onboarding']['paso'] === 'modelo' && $enviados[1] === $cfg['onboarding_modelo']);
$r = cliente($c2, 'el primero', $T, null, $cfg);
caso('"el primero" = modelo 1', ($c2['onboarding']['datos']['modelo']['valor'] ?? 0) === 1 && $c2['onboarding']['paso'] === 'factura');
$r = cliente($c2, 'Beto Gómez, responsable inscripto', $T, null, $cfg);
caso('la factura a medias: pide lo que falta (el CUIT) y se queda en el paso', count($r) === 1 && $r[0] === 'Me falta el CUIT o CUIL para la factura. ¿Me lo pasás?' && $c2['onboarding']['paso'] === 'factura', json_encode($r));
$r = cliente($c2, '20-30111222-5', $T, null, $cfg);
$f2 = $c2['onboarding']['datos']['factura']['valor'] ?? [];
caso('con el CUIT se completa con lo anterior y sigue', ($f2['razon_social'] ?? '') === 'Beto Gómez' && ($f2['cuit'] ?? '') === '20301112225' && ($f2['iva'] ?? '') === 'Responsable inscripto' && $c2['onboarding']['paso'] === 'dominio', json_encode($f2));
$r = cliente($c2, 'no se me ocurre ninguno, elegí vos', $T, null, $cfg);
caso('"no se me ocurre" omite los dominios (quedan para Pablo) y sigue', !empty($c2['onboarding']['datos']['dominio']['omitido']) && $c2['onboarding']['paso'] === 'email');
cliente($c2, 'beto@gmail.com', $T, null, $cfg);
$r = cliente($c2, 'no tengo logo', $T, null, $cfg);
caso('"no tengo logo" omite el logo y pide las fotos', !empty($c2['onboarding']['datos']['logo']['omitido']) && $c2['onboarding']['paso'] === 'fotos' && dice($r, 'fotos', $cfg));
cliente($c2, '[foto]', $T, ['clase' => 'imagen', 'archivo' => 'a.jpg'], $cfg);
cliente($c2, '[foto]', $T, ['clase' => 'imagen', 'archivo' => 'b.jpg'], $cfg);
$r = cliente($c2, 'listo, esas son', $T, null, $cfg);
caso('"listo" con 2 fotos alcanza: sigue con los cambios', ($c2['onboarding']['datos']['fotos']['valor']['cantidad'] ?? 0) === 2 && $c2['onboarding']['paso'] === 'cambios');
$r = cliente($c2, 'está bien así', $T, null, $cfg);
caso('"está bien así" = sin cambios', !empty($c2['onboarding']['datos']['cambios']['omitido']) && $c2['onboarding']['paso'] === 'datos');

echo "Con OpenAI (simulado) para la respuesta libre\n";
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$pedidos = [];
$GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) use (&$pedidos) {
    $pedidos[] = $payload;
    $salida = strpos($payload['prompt_cache_key'], 'factura') !== false
        ? ['razon_social' => 'Panadería La Espiga SRL', 'cuit' => '30-71234567-8', 'iva' => 'responsable inscripto']
        : ['dominios' => ['laespiga.com.ar', 'panaderialaespiga.com']];
    return [200, json_encode(['status' => 'completed', 'model' => 'gpt-test', 'usage' => ['input_tokens' => 10, 'output_tokens' => 10],
        'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($salida)]]]]]), 0];
};
$c3 = conv_nueva('5491111TEST03', ['nombre' => 'Caro', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => 1]);
$c3['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
wabot_pago_confirmar($c3, ['id' => 'p3', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'referencia'], 'mensual', $cfg, $deps);
caso('con modelo_elegido en la charla (lo anota el post-demo) tampoco pregunta el modelo', $c3['onboarding']['paso'] === 'factura');
$r = cliente($c3, 'Facturame a la panadería, somos una SRL responsable inscripto, el cuit después te lo paso... ah no, acá está: 30712345678', $T, null, $cfg);
$f3 = $c3['onboarding']['datos']['factura']['valor'] ?? [];
caso('la razón social la saca el modelo (las reglas no pueden), el CUIT y el IVA ya los tenían las reglas', ($f3['razon_social'] ?? '') === 'Panadería La Espiga SRL' && ($f3['cuit'] ?? '') === '30712345678' && ($f3['iva'] ?? '') === 'Responsable inscripto', json_encode($f3));
caso('la llamada tiene tarea y clave de caché propias, sin razonamiento y sin circuito', count($pedidos) === 1 && $pedidos[0]['prompt_cache_key'] === 'gokywebs-wabot-onboarding-factura' && !isset($pedidos[0]['reasoning']) && ($pedidos[0]['text']['format']['name'] ?? '') === 'onboarding_factura', json_encode(array_keys($pedidos[0] ?? [])));
$r = cliente($c3, 'Me gustaría algo que tenga que ver con la espiga, como la espiga o panadería la espiga, lo que esté libre', $T, null, $cfg);
caso('una frase larga de dominios la lee el modelo', ($c3['onboarding']['datos']['dominio']['valor'] ?? []) === ['laespiga.com.ar', 'panaderialaespiga.com'] && count($pedidos) === 2, json_encode($c3['onboarding']['datos']['dominio'] ?? null));
unset($GLOBALS['WABOT_TEST_OPENAI_HTTP']);
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = '';

echo "Pausa y recordatorio\n";
$c4 = conv_nueva('5491111TEST04', ['nombre' => 'Dani', 'tipo' => 'landing', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => 2]);
$c4['transcript'] = [['q' => 'cliente', 't' => 'ya pagué', 'ts' => $ahora - 600]];
wabot_pago_confirmar($c4, ['id' => 'p4', 'monto' => 20000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado'], 'mensual', $cfg, $deps);
$preguntado = $c4['onboarding']['preguntado_ts'];
$mandados = [];
$enviarRec = function (&$cv, $t) use (&$mandados) { $mandados[] = [$cv['conversation_key'], $t]; return true; };
$guardar = function ($cv) {};
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 10 * 3600, ['5491111TEST04' => $c4], $enviarRec, $guardar);
caso('a las 10 h todavía no recuerda nada', $r['enviados'] === 0 && $mandados === []);
$c4['ultimo_cliente_ts'] = $preguntado - 1;
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST04' => $c4], $enviarRec, $guardar);
caso('a las 22 h sin respuesta (la ventana de 24 h sigue abierta): el recordatorio con la pregunta pendiente', $r['enviados'] === 1 && strpos($mandados[0][1], 'pudiste ver lo que te pedí') !== false && strpos($mandados[0][1], mb_substr($cfg['onboarding_factura'], 0, 30)) !== false, json_encode($r));
$c4Rec = $c4; $c4Rec['onboarding']['recordatorio_ts'] = $ahora + 22 * 3600; $mandados = [];
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 23 * 3600, ['5491111TEST04' => $c4Rec], $enviarRec, $guardar);
caso('no se le recuerda dos veces la misma pregunta', $r['enviados'] === 0);
$c4Pablo = $c4; $c4Pablo['control_manual'] = true;
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 22.5 * 3600, ['5491111TEST04' => $c4Pablo], $enviarRec, $guardar);
caso('si Pablo tomó el chat, el bot no insiste', $r['enviados'] === 0);
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 36 * 3600, ['5491111TEST04' => $c4], $enviarRec, $guardar);   // 2-nov 12:00 + 36 h = 4-nov 00:00
caso('de noche no sale', !empty($r['fuera_de_hora']));
$c4Vieja = $c4; $c4Vieja['ultimo_cliente_ts'] = $ahora - 30 * 3600; $mandados = [];
$r = wabot_onboarding_recordatorio_correr($cfg, $ahora + 25 * 3600, ['5491111TEST04' => $c4Vieja], $enviarRec, $guardar);
caso('con la ventana de 24 h cerrada no se puede escribir: queda anotado', $r['enviados'] === 0 && ($r['detalle'][0]['estado'] ?? '') === 'ventana_cerrada');

$enviados = [];
$c4Pablo['bot_off'] = true;
$r = wabot_onboarding_retomar($c4Pablo, $cfg, $ahora + 3600, ['enviar' => function (&$cv, $t) use (&$enviados) { $enviados[] = $t; return true; }]);
caso('"Que siga el bot" desde la ficha: le devuelve el chat al bot y repite la pregunta pendiente', $r['ok'] && empty($c4Pablo['control_manual']) && empty($c4Pablo['bot_off']) && $enviados === [$cfg['onboarding_factura']], json_encode($r));

echo "Ventana cerrada al confirmar\n";
$c5 = conv_nueva('5491111TEST05', ['nombre' => 'Eva', 'tipo' => 'landing', 'presentado_ts' => $ahora - 200000, 'ultimo_cliente_ts' => $ahora - 100000, 'modelo_elegido' => 1]);
$enviados = [];
wabot_pago_confirmar($c5, ['id' => 'p5', 'monto' => 20000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'asignado'], 'mensual', $cfg, $deps);
caso('con la ventana de WhatsApp cerrada no sale nada y queda la apertura pendiente', $enviados === [] && !empty($c5['onboarding']['pendiente_apertura']) && wabot_onboarding_activo($c5, $cfg));
$r = cliente($c5, 'hola, pagué ayer', $T, null, $cfg);
caso('cuando el cliente escribe, salen la apertura y la primera pregunta', count($r) === 2 && $r[0] === $cfg['onboarding_apertura'] && $r[1] === $cfg['onboarding_factura'] && $c5['onboarding']['paso'] === 'factura', json_encode($r));

echo "Apagado y ganchos\n";
$c6 = conv_nueva('5491111TEST06', ['tipo' => 'landing']);
$enviados = [];
wabot_pago_confirmar($c6, ['id' => 'p6', 'monto' => 20000, 'ts' => $ahora, 'tipo' => 'manual', 'modo' => 'manual'], 'mensual', array_merge($cfg, ['onboarding_activo' => false]), $deps);
caso('con onboarding_activo en false el pago se confirma pero el bot no pide nada', !empty($c6['pago_confirmado_ts']) && $enviados === [] && !wabot_onboarding_activo($c6, $cfg));
$comercial = (string)file_get_contents(__DIR__ . '/comercial.php');
caso('wabot_comercial_turno cede el turno al onboarding', strpos($comercial, 'wabot_onboarding_activo($conv, $cfg)') !== false && strpos($comercial, 'return wabot_onboarding_turno($conv, $texto, $cfg);') !== false);
$redactor = (string)file_get_contents(__DIR__ . '/redactor.php');
caso('y wabot_responder también cuando el flujo comercial no está en automático', strpos($redactor, "wabot_flujo_comercial(\$cfg) !== 'auto' && wabot_onboarding_activo(\$conv, \$cfg)") !== false);
caso('el cron manda el recordatorio', strpos((string)file_get_contents(__DIR__ . '/seguimiento.php'), 'wabot_onboarding_recordatorio_correr($cfg)') !== false);

// De punta a punta por el borde común: el flujo comercial en automático cede el turno.
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$c7 = conv_nueva('5491111TEST07', ['nombre' => 'Flor', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'ultimo_cliente_ts' => $ahora - 600, 'modelo_elegido' => 1, 'control_manual' => true]);
wabot_pago_confirmar($c7, ['id' => 'p7', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado'], 'mensual', $cfg, $deps);
$out = turno('Flor Díaz, 27-22333444-1, monotributo', $c7, $cfg);
caso('por wabot_responder (flujo auto): el onboarding toma el turno y pasa a los dominios', $c7['onboarding']['paso'] === 'dominio' && count($out) === 1 && dice($out, 'dominio', $cfg), json_encode($out));
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'off';
$out = turno('kioscoflor.com.ar y flordiaz.com', $c7, $cfg);
caso('por wabot_responder (flujo off): también', $c7['onboarding']['paso'] === 'email' && dice($out, 'email', $cfg), json_encode($out));
$c7['control_manual'] = true;
$out = turno('flor@gmail.com', $c7, $cfg);
caso('si Pablo escribió (control manual), el bot se calla como siempre y el onboarding espera', $out === [] && $c7['onboarding']['paso'] === 'email');

echo "Contesta otro paso del que se le pidió (charla en vivo del 1-nov: la factura cuando se pedía el modelo)\n";
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$c8 = conv_nueva('5491111TEST08', ['nombre' => 'Carlo', 'nombre_negocio' => 'Pizzería Don Carlo', 'tipo' => 'ecommerce', 'presentado_ts' => $ahora - 90000, 'cliente_id' => 'CLI8', 'ultimo_cliente_ts' => $ahora - 600]);
$c8['transcript'] = [['q' => 'bot', 't' => 'Acá está tu demo', 'ts' => $ahora - 90000], ['q' => 'cliente', 't' => 'ya me suscribí al mensual', 'ts' => $ahora - 600]];
$enviados8 = [];
wabot_pago_confirmar($c8, ['id' => 'p8', 'monto' => 30000, 'ts' => $ahora - 300, 'tipo' => 'suscripcion', 'modo' => 'monto_avisado', 'suscripcion' => 's8'], 'mensual', $cfg,
    ['ahora' => $ahora, 'enviar' => function (&$cv, $t) use (&$enviados8) { $enviados8[] = $t; return true; }, 'firestore' => fn($conv, $campos) => ['ok' => true, 'id' => 'CLI8', 'creado' => false, 'error' => ''], 'fs_onboarding' => fn($id, $campos) => true, 'avisar' => fn($t, $cu) => 1]);
caso('sin modelo elegido, arranca pidiendo el modelo', $c8['onboarding']['paso'] === 'modelo' && dice($enviados8, 'modelo', $cfg));
$r = cliente($c8, 'Carlo Bianchi, 20-98765432-1, responsable inscripto', $T, null, $cfg);
caso('la factura se toma igual y se vuelve a pedir el modelo, sin callarse', ($c8['onboarding']['datos']['factura']['valor']['cuit'] ?? '') === '20987654321' && $c8['onboarding']['paso'] === 'modelo'
    && count($r) === 1 && strpos($r[0], $cfg['onboarding_ok']) === 0 && dice($r, 'modelo', $cfg) && empty($c8['handoff_pendiente']), json_encode([$r, $c8['onboarding']['datos']['factura'] ?? null]));
$r = cliente($c8, 'pizzeriadoncarlo.com', $T, null, $cfg);
caso('un dominio con terminación también se toma, y sigue pidiendo el modelo', ($c8['onboarding']['datos']['dominio']['valor'] ?? []) === ['pizzeriadoncarlo.com'] && $c8['onboarding']['paso'] === 'modelo' && dice($r, 'modelo', $cfg), json_encode($r));
$r = cliente($c8, 'el 2', $T, null, $cfg);
caso('con el modelo, salta los pasos ya contestados: pide el email', ($c8['onboarding']['datos']['modelo']['valor'] ?? 0) === 2 && $c8['onboarding']['paso'] === 'email' && dice($r, 'email', $cfg), json_encode($r));
$r = cliente($c8, 'me gusta más el diseño claro', $T, null, $cfg);
caso('un texto que no es email ni otro dato: repregunta una vez', count($r) === 1 && strpos($r[0], $cfg['onboarding_no_entendi']) === 0 && dice($r, 'email', $cfg) && $c8['onboarding']['paso'] === 'email', json_encode($r));
$r = cliente($c8, 'carlo@donCarlo.com', $T, null, $cfg);
caso('y con la respuesta buena sigue (el contador de "no entendí" se limpia)', ($c8['onboarding']['datos']['email']['valor'] ?? '') === 'carlo@doncarlo.com' && ($c8['onboarding']['sin_entender'] ?? 0) === 0 && $c8['onboarding']['paso'] === 'logo');

array_map('unlink', glob($tmp . '/uso/*') ?: []); @rmdir($tmp . '/uso');
array_map('unlink', glob($tmp . '/*') ?: []); @rmdir($tmp);
todo_ok();
