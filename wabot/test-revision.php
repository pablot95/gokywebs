<?php
/**
 * wabot/test-revision.php — la revisión de las charlas cada media hora (revision.php, 9-oct-2026), sin red.
 *
 *   php wabot/test-revision.php
 *
 * Qué charlas se revisan (solo lo nuevo del bot, nunca la bienvenida sola, las
 * que se mueven quedan para la próxima), qué ve GPT (★ en lo nuevo, reglas,
 * precios y textos fijos), que cada tramo se revisa una vez, las fallas de
 * OpenAI, el tope de gasto, apagada y el candado. GPT se simula.
 * Escribe charlas *TEST* en wabot/data/conv y las borra al terminar.
 */

require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/revision.php';

$tmp = sys_get_temp_dir() . '/wabot-test-revision-' . getmypid();
@mkdir($tmp, 0755, true);
$GLOBALS['WABOT_TEST_REVISION_DIR'] = $tmp . '/revision';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = $tmp . '/uso';
$GLOBALS['WABOT_TEST_OPENAI_KEY'] = 'sk-test-no-es-una-key-real';

$cfg = wabot_config_load();
$cfg['revision_activa'] = true;
$cfg['revision_tope_usd_dia'] = 3;
$bienvenida = (string)$cfg['bienvenida'];
// Las pasadas se simulan hasta 90 minutos después de $t0: todo queda en el pasado (y en el archivo de hoy o ayer).
$t0 = time() - 6000;

/** GPT simulado: $cola son las respuestas en orden (array = JSON de la revisión, int = código http de error). */
function oa_revision(array $cola) {
    $GLOBALS['OA_COLA'] = $cola;
    $GLOBALS['OA_PEDIDOS'] = [];
    $GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
        $GLOBALS['OA_PEDIDOS'][] = $payload;
        $sig = array_shift($GLOBALS['OA_COLA']);
        if ($sig === null) $sig = ['ok' => true, 'problemas' => [], 'resumen' => 'Todo bien.', 'intervenir' => false];
        if (is_int($sig)) return [$sig, '{"error":{"message":"caído"}}'];
        return [200, json_encode(['id' => 'resp_test', 'model' => 'gpt-6-sol', 'status' => 'completed',
            'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($sig, JSON_UNESCAPED_UNICODE)]]]],
            'usage' => ['input_tokens' => 16000, 'input_tokens_details' => ['cached_tokens' => 14000], 'output_tokens' => 600,
                        'output_tokens_details' => ['reasoning_tokens' => 300], 'total_tokens' => 16600]], JSON_UNESCAPED_UNICODE)];
    };
}
function pedidos_rev() { return (array)($GLOBALS['OA_PEDIDOS'] ?? []); }
function entrada_de($p) { return (string)($p['input'][0]['content'] ?? ''); }

/** Una charla de prueba guardada, con su transcript [q, t, segundos antes de $t0]. */
function charla($clave, array $lineas, array $extra = []) {
    global $t0;
    @unlink(wabot_conv_path($clave));
    @unlink(wabot_historial_path($clave));
    $tr = [];
    foreach ($lineas as [$q, $t, $hace]) $tr[] = ['q' => $q, 't' => $t, 'ts' => $t0 - $hace];
    wabot_conv_save(conv_nueva($clave, array_merge(['nombre' => 'Cliente ' . substr($clave, -6, 2), 'transcript' => $tr, 'session_started_ts' => $t0 - 86400], $extra)));
    // La fecha del archivo es la de su último mensaje, como en el server: de ahí sale qué cambió desde la pasada anterior.
    touch(wabot_conv_path($clave), max(array_column($tr, 'ts')));
    clearstatcache();
}
function agregar($clave, $q, $t, $ts) {
    $c = wabot_conv_load($clave);
    $c['transcript'][] = ['q' => $q, 't' => $t, 'ts' => $ts];
    wabot_conv_save($c);
    touch(wabot_conv_path($clave), $ts);
    clearstatcache();
}
/** Las líneas marcadas como nuevas en lo que lee GPT. */
function nuevas($ent) { return substr_count("\n" . $ent, "\n★ ["); }
function estado_rev() { return wabot_revision_estado_leer(); }

$A = '5491100000201TEST';   // el bot contestó hace 10 min: se revisa
$B = '5491100000202TEST';   // solo la bienvenida: no se revisa
$C = '5491100000203TEST';   // el bot contestó hace 30 s: queda para la próxima
$D = '5491100000204TEST';   // solo escribió el cliente
$E = '5491100000205TEST';   // lo del bot es de hace 8 horas: antes de la primera ventana
$todas = [$A, $B, $C, $D, $E];
$GLOBALS['WABOT_TEST_REVISION_CLAVES'] = $todas;

charla($A, [
    ['cliente', 'hola', 1300], ['bot', $bienvenida, 1290],
    ['cliente', 'vendo velas artesanales, cuánto sale una tienda?', 700],
    ['bot', 'Buenísimo. Podemos armarte una tienda online para tus velas', 650],
    ['bot', "Podés elegir entre dos planes:\n\n1) Plan anual: \$190.000\n2) Plan mensual: \$30.000", 645],
]);
charla($B, [['cliente', 'hola info', 900], ['bot', $bienvenida, 880]]);
charla($C, [['cliente', 'tengo una peluquería', 60], ['bot', 'Buenísimo. Te consulto: querés que la gente reserve turnos desde la página?', 30]]);
charla($D, [['cliente', 'hola', 600]]);
charla($E, [['cliente', 'hola', 8 * 3600 + 60], ['bot', 'Buenísimo, te cuento los planes', 8 * 3600]]);

echo "Tramos\n";
$tr = wabot_revision_tramo(wabot_conv_load($B)['transcript'], 0, $cfg);
caso('la bienvenida sola es un tramo de "solo bienvenida"', $tr !== null && $tr['solo_bienvenida'] === true && $tr['mensajes'] === 1);
$tr = wabot_revision_tramo(wabot_conv_load($A)['transcript'], 0, $cfg);
caso('la bienvenida con más mensajes del bot sí se revisa', $tr !== null && $tr['solo_bienvenida'] === false && $tr['mensajes'] === 3 && $tr['hasta'] === $t0 - 645);
caso('después del último mensaje del bot no hay tramo', wabot_revision_tramo(wabot_conv_load($A)['transcript'], $t0 - 645, $cfg) === null);
caso('sin mensajes del bot no hay tramo', wabot_revision_tramo(wabot_conv_load($D)['transcript'], 0, $cfg) === null);

echo "Lo que lee GPT\n";
$ins = wabot_revision_instrucciones($cfg);
$panel = wabot_comercial_montos_lista('panel', $cfg);
caso('las instrucciones traen los precios vigentes del plan con panel',
    strpos($ins, 'PRECIOS VIGENTES') !== false && strpos($ins, "anual {$panel['anual']}, mensual {$panel['mensual']}") !== false);
caso('… los textos fijos aprobados (oferta de la demo, formulario)',
    strpos($ins, (string)$cfg['comercial']['oferta_demo']) !== false && strpos($ins, 'Formulario de la demo') !== false);
caso('… y las reglas del bot y la información comercial, tal cual',
    strpos($ins, wabot_comercial_instrucciones_comportamiento()) !== false && strpos($ins, 'INFORMACIÓN COMERCIAL DE GOKYWEBS') !== false);
caso('… los avisos automáticos con su regla, y que salen aunque la charla la atienda Pablo',
    strpos($ins, 'AVISOS AUTOMÁTICOS') !== false && strpos($ins, 'marcó como favoritas') !== false
    && strpos($ins, (string)$cfg['plantillas']['seguimiento_interesado']['texto']) !== false
    && strpos($ins, 'Que un aviso automático o una plantilla salga en una charla que atiende Pablo') !== false);
$cvCliente = conv_nueva('5491100000299TEST', ['cliente_id' => 'abc', 'favorito' => true, 'control_manual' => true]);
$ctx = wabot_revision_contexto($cvCliente, [['q' => 'bot', 't' => 'Era para consultarte si querías continuar', 'ts' => $t0]], ['desde' => $t0 - 1, 'hasta' => $t0], $cfg);
caso('el estado distingue al que ya es cliente, la favorita y el control manual (con los avisos permitidos)',
    strpos($ctx, 'Ya es cliente de Gokywebs') !== false && strpos($ctx, 'Avisó que pagó') === false
    && strpos($ctx, 'marcó como favorita') !== false && strpos($ctx, 'siguen saliendo (está bien)') !== false, $ctx);
caso('el esquema ofrece los mismos tipos que muestra el panel',
    wabot_revision_esquema()['schema']['properties']['problemas']['items']['properties']['tipo']['enum'] === array_keys(wabot_revision_tipos()));

echo "Primera pasada\n";
oa_revision([['ok' => false, 'resumen' => 'Pidió precio de una tienda de velas y se lo pasó.', 'intervenir' => true,
    'problemas' => [['tipo' => 'se_saltea_paso', 'gravedad' => 'grave', 'mensaje' => 'Podés elegir entre dos planes', 'detalle' => 'Faltó la oferta de la demo después de los planes.', 'sugerencia' => 'Mandar la oferta de la demo.'],
                    ['tipo' => 'inventado_por_gpt', 'gravedad' => 'rarísima', 'mensaje' => '', 'detalle' => 'Un detalle menor.', 'sugerencia' => ''],
                    ['tipo' => 'tono', 'gravedad' => 'leve', 'mensaje' => '', 'detalle' => '   ', 'sugerencia' => '']]]]);
$r1 = wabot_revision_correr($cfg, ['ahora' => $t0]);
$p = pedidos_rev();
caso('revisa solo la charla con algo nuevo del bot (una llamada)', count($p) === 1 && ($r1['revisadas'] ?? -1) === 1, json_encode($r1));
$ent = entrada_de($p[0] ?? []);
caso('la llamada es la tarea revision, con razonamiento medio y las instrucciones de siempre (caché)',
    ($p[0]['prompt_cache_key'] ?? '') === 'gokywebs-wabot-revision' && ($p[0]['reasoning']['effort'] ?? '') === 'medium' && ($p[0]['instructions'] ?? '') === $ins);
caso('GPT ve los mensajes nuevos del bot con ★ (la bienvenida vieja también es nueva en la primera pasada)',
    nuevas($ent) === 3 && strpos($ent, '★ [' . date('d/m H:i', $t0 - 650) . '] Bot: Buenísimo. Podemos armarte una tienda online para tus velas') !== false, $ent);
caso('… lo del cliente sin ★, y el estado que guardó el sistema',
    strpos($ent, '] Cliente: vendo velas artesanales') !== false && strpos($ent, '★ [' . date('d/m H:i', $t0 - 700) . '] Cliente') === false
    && strpos($ent, 'ESTADO QUE GUARDÓ EL SISTEMA') !== false && strpos($ent, 'CHARLA CON Cliente') !== false);
caso('la que se está moviendo queda para la próxima, sin llamar', ($r1['en_movimiento'] ?? 0) === 1 && isset(estado_rev()['pendientes'][$C]));
caso('la de hace 8 horas no entra en la primera pasada', !isset(estado_rev()['convs'][$E]));
$filas = wabot_revision_leer(2);
$fa = $filas[0] ?? [];
caso('queda anotada con sus problemas: el tipo desconocido pasa a otro, la gravedad rara a leve, sin detalle no cuenta',
    count($filas) === 1 && ($fa['clave'] ?? '') === $A && ($fa['ok'] ?? null) === false && count($fa['problemas'] ?? []) === 2
    && $fa['problemas'][0]['tipo'] === 'se_saltea_paso' && $fa['problemas'][0]['gravedad'] === 'grave'
    && $fa['problemas'][1]['tipo'] === 'otro' && $fa['problemas'][1]['gravedad'] === 'leve' && !empty($fa['intervenir']), json_encode($fa, JSON_UNESCAPED_UNICODE));
caso('el resumen de la pasada cuenta la charla grave y el costo', ($r1['graves'] ?? 0) === 1 && ($r1['con_problemas'] ?? 0) === 1 && ($r1['costo_usd'] ?? 0) > 0);
caso('el puntero de la charla queda en su último mensaje revisado', (int)(estado_rev()['convs'][$A] ?? 0) === $t0 - 645);
caso('la bienvenida sola avanza el puntero sin gastar', (int)(estado_rev()['convs'][$B] ?? 0) === $t0 - 880);
caso('sin red no suena el celular', ($r1['avisados'] ?? -1) === 0);

echo "Segunda pasada (10 minutos después)\n";
oa_revision([]);
$r2 = wabot_revision_correr($cfg, ['ahora' => $t0 + 600]);
$p = pedidos_rev();
caso('no vuelve a revisar lo ya revisado; la que se movía ahora sí', count($p) === 1 && strpos(entrada_de($p[0]), 'peluquería') !== false && ($r2['revisadas'] ?? 0) === 1, json_encode($r2));
caso('… con su mensaje del bot marcado como nuevo', strpos(entrada_de($p[0] ?? []), '★ [' . date('d/m H:i', $t0 - 30) . '] Bot:') !== false);
caso('sin problemas queda anotada como bien', (wabot_revision_leer(2)[0]['ok'] ?? null) === true && empty(estado_rev()['pendientes']));

echo "Lo nuevo de una charla ya revisada\n";
agregar($A, 'cliente', 'y cuánto tarda?', $t0 + 700);
agregar($A, 'bot', 'La entregamos en menos de 24 hs', $t0 + 710);
oa_revision([]);
$r3 = wabot_revision_correr($cfg, ['ahora' => $t0 + 1200]);
$ent = entrada_de(pedidos_rev()[0] ?? []);
caso('se revisa solo el tramo nuevo: un ★, lo anterior como contexto',
    count(pedidos_rev()) === 1 && nuevas($ent) === 1 && strpos($ent, '★ [' . date('d/m H:i', $t0 + 710) . '] Bot: La entregamos') !== false
    && strpos($ent, '] Bot: Buenísimo. Podemos armarte') !== false, $ent);
oa_revision([]);
$r4 = wabot_revision_correr($cfg, ['ahora' => $t0 + 1800]);
caso('una pasada sin nada nuevo no llama a GPT', count(pedidos_rev()) === 0 && ($r4['revisadas'] ?? -1) === 0);

echo "Fallas de OpenAI\n";
$F = '5491100000206TEST';
$GLOBALS['WABOT_TEST_REVISION_CLAVES'][] = $F;
charla($F, [['cliente', 'hago cursos de cerámica', -1900], ['bot', 'Buenísimo, te paso los planes', -1910]]);
oa_revision([500, 500, 500]);
$r5 = wabot_revision_correr($cfg, ['ahora' => $t0 + 2400]);
caso('si OpenAI falla, queda pendiente con un intento y desde el mismo punto',
    ($r5['fallidas'] ?? 0) === 1 && (int)(estado_rev()['pendientes'][$F] ?? 0) === 1 && (int)(estado_rev()['convs'][$F] ?? -1) === $t0 + 1800, json_encode($r5));
caso('la revisión no abre el circuito de OpenAI del bot', wabot_openai_disponible());
oa_revision([500, 500, 500]);
wabot_revision_correr($cfg, ['ahora' => $t0 + 3000]);
oa_revision([500, 500, 500]);
$r7 = wabot_revision_correr($cfg, ['ahora' => $t0 + 3600]);
$ff = array_values(array_filter(wabot_revision_leer(2), function ($f) use ($F) { return $f['clave'] === $F; }));
caso('a la tercera falla se suelta: queda anotada como no revisada y sale de pendientes',
    count($ff) === 1 && $ff[0]['ok'] === null && strpos((string)$ff[0]['error'], 'http_500') === 0 && !isset(estado_rev()['pendientes'][$F])
    && (int)(estado_rev()['convs'][$F] ?? 0) === $t0 + 1910);

echo "Tope de gasto\n";
$G = '5491100000207TEST'; $H = '5491100000208TEST';
$GLOBALS['WABOT_TEST_REVISION_CLAVES'] = [$G, $H];
charla($G, [['cliente', 'tengo una inmobiliaria', -3700], ['bot', 'Buenísimo, te armamos la web inmobiliaria', -3710]]);
charla($H, [['cliente', 'soy psicóloga', -3720], ['bot', 'Buenísimo, querés que reserven turnos?', -3730]]);
// El tope justo por encima de lo gastado hoy: entra una charla y la otra no.
$cfgTope = $cfg;
$cfgTope['revision_tope_usd_dia'] = (float)(estado_rev()['gasto'][date('Y-m-d', $t0 + 4200)] ?? 0) + 0.000001;
oa_revision([]);
$r8 = wabot_revision_correr($cfgTope, ['ahora' => $t0 + 4200]);
caso('al llegar al gasto del día deja el resto pendiente', count(pedidos_rev()) === 1 && ($r8['tope'] ?? false) === true && ($r8['pendientes'] ?? 0) === 1, json_encode($r8));
oa_revision([]);
$r9 = wabot_revision_correr($cfg, ['ahora' => $t0 + 4800]);
caso('con margen, la pendiente se revisa en la pasada siguiente', count(pedidos_rev()) === 1 && ($r9['revisadas'] ?? 0) === 1 && empty(estado_rev()['pendientes']));

echo "Apagada y candado\n";
agregar($G, 'bot', 'Te paso los planes', $t0 + 5000);
$cfgOff = $cfg;
$cfgOff['revision_activa'] = false;
oa_revision([]);
caso('apagada en Ajustes no hace nada', (wabot_revision_correr($cfgOff, ['ahora' => $t0 + 5400])['estado'] ?? '') === 'apagada' && count(pedidos_rev()) === 0);
$lock = fopen(wabot_revision_dir() . '/corriendo.lock', 'c');
flock($lock, LOCK_EX);
caso('si otra pasada está corriendo, no arranca otra', (wabot_revision_correr($cfg, ['ahora' => $t0 + 5400])['estado'] ?? '') === 'ya_corriendo' && count(pedidos_rev()) === 0);
flock($lock, LOCK_UN);
fclose($lock);

echo "Cambio de criterio\n";
caso('cada revisión anota con qué criterio se hizo', (int)(wabot_revision_leer(2)[0]['v'] ?? 0) === WABOT_REVISION_V && (int)(estado_rev()['v'] ?? 0) === WABOT_REVISION_V);
$e = estado_rev();
$e['v'] = WABOT_REVISION_V - 1;
wabot_revision_estado_guardar($e);
$hoyRev = wabot_revision_dir() . '/' . date('Y-m-d', $t0 + 6000);
file_put_contents($hoyRev . '.jsonl', json_encode(['ts' => $t0 + 5900, 'clave' => 'VIEJA', 'ok' => false, 'problemas' => [['tipo' => 'otro']]]) . "\n", FILE_APPEND);
oa_revision([]);
$rv = wabot_revision_correr($cfg, ['ahora' => $t0 + 6000]);
$vieja = array_filter(wabot_revision_leer(1), function ($f) { return ($f['clave'] ?? '') === 'VIEJA'; });
caso('con instrucciones nuevas, lo de hoy queda aparte y las últimas 6 horas se revisan de nuevo',
    !$vieja && is_file($hoyRev . '.v' . (WABOT_REVISION_V - 1) . '.jsonl') && (int)(estado_rev()['v'] ?? 0) === WABOT_REVISION_V
    && count(pedidos_rev()) === 2 && ($rv['revisadas'] ?? 0) === 2, json_encode($rv));

echo "Errores técnicos del log\n";
$GLOBALS['WABOT_TEST_LOGS'] = true;
$antes = wabot_revision_errores_log(time() - 5, time() + 5)['total'];
wabot_log('comercial_respaldo', ['tel' => $G, 'error' => 'http_500']);
wabot_log('error', ['donde' => 'openai', 'tarea' => 'comercial', 'http' => 429, 'msg' => 'rate limit']);
$el = wabot_revision_errores_log(time() - 5, time() + 5);
unset($GLOBALS['WABOT_TEST_LOGS']);
caso('cuenta los turnos sin respuesta y los errores por dónde',
    $el['total'] - $antes === 2 && ($el['por_tipo']['El bot no le contestó al cliente: OpenAI no respondió bien'] ?? 0) >= 1 && ($el['por_tipo']['Error en openai'] ?? 0) >= 1, json_encode($el, JSON_UNESCAPED_UNICODE));
caso('el motivo del turno sin respuesta se explica',
    wabot_revision_motivo_respaldo('mensajes_no_validos') === 'lo que escribió GPT no pasó la red de seguridad dos veces'
    && wabot_revision_motivo_respaldo('no_disponible') === 'OpenAI estaba en pausa por errores anteriores');

echo "Ajustes\n";
caso('de fábrica está prendida y con tope de US$ 3', wabot_revision_activa([]) && wabot_revision_tope_usd([]) === 3.0);
caso('las dos claves se guardan desde el panel', in_array('revision_activa', wabot_ajustes_claves(), true) && in_array('revision_tope_usd_dia', wabot_ajustes_claves(), true));

foreach (array_merge($todas, [$F, $G, $H]) as $k) { @unlink(wabot_conv_path($k)); @unlink(wabot_historial_path($k)); }
foreach ([wabot_revision_dir(), $tmp . '/uso'] as $d) { foreach (glob($d . '/*') ?: [] as $f) @unlink($f); foreach (glob($d . '/.*') ?: [] as $f) if (is_file($f)) @unlink($f); @rmdir($d); }
@rmdir($tmp);
todo_ok();
