<?php
/**
 * wabot/revision.php — la revisión periódica de las charlas del bot (Pablo,
 * 9-oct-2026, con el flujo comercial recién puesto en automático: "que
 * periódicamente (2 veces por hora) se manden las conversaciones en wabot para
 * analizar el comportamiento del wabot y verificar que no esté cometiendo
 * errores").
 *
 * Dos veces por hora (revisar.php, por cron) junta las charlas donde el bot
 * escribió algo desde la pasada anterior y le pasa cada una a GPT con lo mismo
 * que sabe el bot: sus reglas, la información comercial, los precios vigentes y
 * los textos fijos aprobados. GPT marca lo que Pablo corregiría (no contestó lo
 * que le preguntaron, un precio que no va, un paso salteado, algo inventado, un
 * aviso automático fuera de lugar…). Lo que encuentra queda en
 * data/revision/AAAA-MM-DD.jsonl, se ve en la pestaña Revisión del panel y, si
 * es grave, le suena el celular a Pablo. También junta los errores técnicos del
 * log de esa media hora (OpenAI caído, envíos rechazados).
 *
 * Solo lee: no escribe en las charlas ni le manda nada a ningún cliente. Lo que
 * el bot ya mandó no se corrige solo; el aviso es para que Pablo intervenga a
 * tiempo y para ajustar las reglas.
 *
 * Cada tramo se revisa una vez: data/revision/estado.json guarda hasta dónde se
 * revisó cada charla. Una charla con movimiento en los últimos 2 minutos (el
 * bot puede estar mandando la segunda parte del turno) queda para la pasada
 * siguiente, igual que lo que no entra por el tope de charlas por pasada o de
 * gasto por día (Ajustes → revision_tope_usd_dia).
 */

require_once __DIR__ . '/redactor.php';   // el motor y comercial.php (reglas, info, cotización)
require_once __DIR__ . '/push.php';

const WABOT_REVISION_QUIETA_SEG = 120;          // movimiento más reciente que esto: la próxima pasada
const WABOT_REVISION_MAX_CHARLAS = 15;          // por pasada; el resto queda pendiente
const WABOT_REVISION_PRIMERA_VEZ_SEG = 6 * 3600; // la primera pasada mira las últimas 6 horas
const WABOT_REVISION_MAX_ATRAS_SEG = 2 * 86400; // con el cron parado días, no revisa todo lo viejo
const WABOT_REVISION_TOPE_USD_DIA = 3.0;
const WABOT_REVISION_MAX_SEG = 20 * 60;         // una pasada no se pisa con la siguiente
const WABOT_REVISION_INTENTOS = 3;              // fallas de OpenAI con el mismo tramo antes de soltarlo

/* ─────────────────────────────── Ajustes y archivos ─────────────────────────────── */

function wabot_revision_dir() {
    return (string)($GLOBALS['WABOT_TEST_REVISION_DIR'] ?? (WABOT_DATA . '/revision'));
}

/** De fábrica, prendida: se apaga en Ajustes. */
function wabot_revision_activa($cfg) {
    return !is_array($cfg) || !array_key_exists('revision_activa', $cfg) || !empty($cfg['revision_activa']);
}

function wabot_revision_tope_usd($cfg) {
    $v = is_array($cfg) ? ($cfg['revision_tope_usd_dia'] ?? null) : null;
    return is_numeric($v) && (float)$v > 0 ? min(50.0, (float)$v) : WABOT_REVISION_TOPE_USD_DIA;
}

function wabot_revision_estado_leer() {
    $e = json_decode((string)@file_get_contents(wabot_revision_dir() . '/estado.json'), true);
    $e = is_array($e) ? $e : [];
    foreach (['convs', 'pendientes', 'corridas', 'gasto'] as $k) if (!is_array($e[$k] ?? null)) $e[$k] = [];
    $e['ultima_ts'] = (int)($e['ultima_ts'] ?? 0);
    return $e;
}

function wabot_revision_estado_guardar(array $e) {
    $dir = wabot_revision_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    // Lo revisado hace más de dos semanas ya no hace falta recordarlo.
    $e['convs'] = array_filter($e['convs'], function ($ts) { return (int)$ts > time() - 14 * 86400; });
    $e['corridas'] = array_slice($e['corridas'], -48);
    $e['gasto'] = array_slice($e['gasto'], -10, null, true);
    return wabot_json_guardar_atomico($dir . '/estado.json', $e);
}

/** Lo revisado de un día, la más nueva primero (las que no se pudieron revisar también). */
function wabot_revision_leer($dias = 3, $limite = 400) {
    $filas = [];
    for ($i = 0; $i < max(1, (int)$dias); $i++) {
        $ruta = wabot_revision_dir() . '/' . date('Y-m-d', strtotime("-$i day")) . '.jsonl';
        foreach (@file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $linea) {
            $f = json_decode($linea, true);
            if (is_array($f)) $filas[] = $f;
        }
    }
    usort($filas, function ($a, $b) { return (int)($b['ts'] ?? 0) <=> (int)($a['ts'] ?? 0); });
    return array_slice($filas, 0, $limite);
}

function wabot_revision_anotar(array $fila) {
    $dir = wabot_revision_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/' . date('Y-m-d', (int)$fila['ts']) . '.jsonl', json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

/* ─────────────────────────────── Qué se revisa ─────────────────────────────── */

/**
 * Los tipos de problema, con el nombre que ve Pablo. Son los del revisor de
 * cada turno (comercial.php) más los que solo se ven con la charla entera:
 * precio_mal, debio_pasar, aviso_fuera_de_lugar y tecnico.
 */
function wabot_revision_tipos() {
    return [
        'no_contesta' => 'No contestó lo que preguntó',
        'contradice' => 'Contesta lo contrario',
        'incoherente' => 'Incoherente con la charla',
        'precio_mal' => 'Precio o plan equivocado',
        'se_saltea_paso' => 'Se salteó un paso',
        'decide_por_cliente' => 'Decidió por el cliente',
        'debio_pasar' => 'Era para Pablo',
        'inventa' => 'Inventó información',
        'promete' => 'Prometió resultados',
        'repite' => 'Repite',
        'aviso_fuera_de_lugar' => 'Aviso automático fuera de lugar',
        'tecnico' => 'Error técnico en el mensaje',
        'tono' => 'Tono',
        'otro' => 'Otro',
    ];
}

/** Las charlas de las pruebas no se revisan (salvo en el test, que elige las suyas). */
function wabot_revision_claves() {
    if (isset($GLOBALS['WABOT_TEST_REVISION_CLAVES'])) {
        $r = [];
        foreach ((array)$GLOBALS['WABOT_TEST_REVISION_CLAVES'] as $k) $r[$k] = (int)@filemtime(wabot_conv_path($k));
        return $r;
    }
    $r = [];
    foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
        $clave = basename($f, '.json');
        if (stripos($clave, 'TEST') !== false) continue;
        $r[$clave] = (int)@filemtime($f);
    }
    return $r;
}

/**
 * Lo nuevo del bot en una charla después de $desde: sus mensajes (q = bot).
 * Devuelve null si no hay nada, o ['desde', 'hasta' (el último mensaje nuevo),
 * 'mensajes', 'solo_bienvenida']. La bienvenida sola no se revisa: es el texto
 * fijo de Pablo y la reciben todos.
 */
function wabot_revision_tramo(array $lineas, $desde, $cfg) {
    $bienvenida = wabot_normalizar_frase((string)($cfg['bienvenida'] ?? ''));
    $n = 0; $hasta = 0; $soloBienvenida = true;
    foreach ($lineas as $l) {
        if (($l['q'] ?? '') !== 'bot') continue;
        $ts = (int)($l['ts'] ?? 0);
        if ($ts <= $desde) continue;
        $n++;
        $hasta = max($hasta, $ts);
        if (wabot_normalizar_frase((string)($l['t'] ?? '')) !== $bienvenida) $soloBienvenida = false;
    }
    return $n ? ['desde' => (int)$desde, 'hasta' => $hasta, 'mensajes' => $n, 'solo_bienvenida' => $soloBienvenida] : null;
}

function wabot_revision_nombre($cv) {
    foreach (['nombre_agenda', 'nombre_negocio', 'nombre'] as $campo) {
        $v = trim((string)($cv[$campo] ?? ''));
        if ($v !== '') return $v;
    }
    return (wabot_canal($cv) === 'instagram' ? 'Instagram · ' : '+') . (string)($cv['channel_user_id'] ?? $cv['tel'] ?? '');
}

/* ─────────────────────────────── Lo que lee GPT ─────────────────────────────── */

function wabot_revision_instrucciones_auditor() {
    return <<<'EOT'
Sos el auditor de calidad del WhatsApp comercial de Gokywebs, una agencia argentina que hace páginas web a medida. Un bot atiende los chats solo. Cada media hora leés las charlas donde el bot escribió algo nuevo y le avisás a Pablo, el dueño, si el bot se equivocó. Lo que el bot ya mandó no se puede cambiar: tu informe es para que Pablo intervenga a tiempo y para corregir al bot.

Recibís la charla (del más viejo al más nuevo, con día y hora). "Bot" es el bot; "Pablo (a mano)" es Pablo escribiendo él; "Sistema" son notas internas que el cliente no ve. Los mensajes del bot marcados con ★ son los NUEVOS: revisá solo esos. Lo anterior es contexto y ya se revisó. Después va el estado que guardó el sistema (lo que entendió del negocio, el precio que se le pasó, si se le ofreció la demo o se le mandó el formulario, si lo pasó a Pablo y por qué).

Marcá un problema solo si es claro y Pablo lo corregiría:
- no_contesta: el cliente preguntó algo y el mensaje nuevo del bot no lo contesta (ni con una respuesta oficial), o le contesta otra cosa.
- contradice: le dice lo contrario de lo que corresponde o de lo que ya se le dijo en la charla.
- incoherente: no tiene sentido con la charla (responde a algo que no se dijo, se confunde de negocio, de nombre o de lo que pidió).
- precio_mal: montos que no son los vigentes para su plan; el plan equivocado para su negocio (la informativa a quien vende productos, el plan con panel a quien solo quiere mostrar sus servicios y no pidió manejarla él); o el precio cuando todavía no se sabía a qué se dedica.
- se_saltea_paso: faltó el paso que correspondía (eligió plan y no se le ofreció la demo; aceptó la demo y no se le mandó el formulario; cotizó sin la propuesta breve).
- decide_por_cliente: da por elegido algo que el cliente no eligió.
- debio_pasar: era un caso para Pablo (CRM o sistema a medida, una función que no está aprobada, avisa que pagó o manda un comprobante, reclama, pide hablar con una persona, ya es cliente, dos webs distintas, no puede abrir el formulario) y el bot igual le contestó como si nada.
- inventa: afirma funciones, plazos, condiciones, medios de pago o datos que no están en la información comercial.
- promete: promete clientes, ventas, consultas o alcance.
- repite: repite lo que ya se dijo (los planes otra vez sin que los pida, la bienvenida dos veces, el mismo mensaje dos veces seguidas, la misma pregunta que ya contestó).
- aviso_fuera_de_lugar: un aviso automático (recordatorio del formulario, última llamada, seguimiento) que no correspondía con lo que pasaba en la charla: ya había contestado, ya completó el formulario, ya pagó, dijo que no le interesa o Pablo lo estaba atendiendo.
- tecnico: un mensaje cortado, vacío, con {marcadores} sin completar, con etiquetas o texto interno, en otro idioma, o el mismo mensaje mandado dos veces.
- tono: suena a robot o a frase de manual, es seco o cortante, o asume el género del cliente.
- otro: cualquier otra cosa que Pablo no mandaría.

No marques:
- Lo que cumple LAS REGLAS DEL BOT (van más abajo): son decisiones de Pablo, aunque vos lo harías distinto. Por ejemplo: a quien vende productos se le cotiza una tienda sin preguntarle si quiere vender online o solo mostrar; los cursos van siempre con el plan con panel; el precio sale en tres mensajes (propuesta breve, planes y oferta de la demo); los dos precios (sin reservas y con reservas) van sin la oferta de la demo, que sale cuando elige.
- La redacción de los TEXTOS FIJOS APROBADOS ni de las respuestas oficiales: son de Pablo y van tal cual. Sí marcalos si no correspondían en ese momento o contestan otra pregunta.
- Que el bot se quede callado o lo pase a Pablo sin contestar: eso Pablo ya lo ve en el panel. Solo si antes le dijo algo equivocado.
- Lo que escribió Pablo a mano, ni lo que el cliente todavía no tuvo tiempo de contestar.
- Devolver el saludo al cliente que saluda (la bienvenida automática del principio no cuenta como saludo).
- Detalles menores de estilo, signos de puntuación o la falta de punto final. Ante la duda, no es un problema.

Gravedad de cada problema:
- grave: el cliente recibió algo equivocado o quedó sin la respuesta que pidió (precio_mal, contradice, no_contesta, inventa, promete, se_saltea_paso, decide_por_cliente, debio_pasar, aviso_fuera_de_lugar, tecnico, y lo incoherente que lo confunde).
- leve: se entiende y no le cambia nada al cliente (repite, tono, un detalle).

Devolvé:
- ok: true si en los mensajes ★ no hay ningún problema.
- problemas: cada uno con tipo, gravedad, mensaje (el pedazo del mensaje ★ con el problema, citado textual y corto, hasta 160 caracteres), detalle (qué está mal, en una o dos frases para Pablo) y sugerencia (qué tendría que haber dicho o hecho el bot, en una frase). Vacío si ok.
- resumen: una frase con lo que pasó en este tramo (qué pidió el cliente y qué hizo el bot).
- intervenir: true si conviene que Pablo le escriba ya al cliente para arreglarlo (un error grave que el cliente está leyendo y que lo puede hacer desistir o confundir).
EOT;
}

/** Los montos de lista de cada plan, para controlar los que mandó el bot. */
function wabot_revision_precios_texto($cfg) {
    $nombres = [
        'informativa' => 'Plan informativa (web informativa, sin panel)',
        'panel' => 'Plan con panel (tienda, catálogo, cursos, inmobiliaria, reservas de turnos, informativa con panel)',
        'internacional' => 'Plan internacional (la web le cobra a clientes del exterior)',
    ];
    $l = [];
    foreach ($nombres as $plan => $nombre) {
        $m = wabot_comercial_montos_lista($plan, $cfg);
        $l[] = "- $nombre: anual {$m['anual']}, mensual {$m['mensual']}"
            . ($m['unico'] !== '' ? ", pago único {$m['unico']} (solo si pidió comprar la web o no tener suscripción)" : '')
            . ($m['sena'] !== '' && $plan !== 'internacional' ? ", seña del anual {$m['sena']}" : '');
    }
    $l[] = '- Una charla cotizada antes de un cambio de precios conserva los montos que ya se le pasaron (el estado dice cuáles).';
    return implode("\n", $l);
}

/** Lo que el bot manda tal cual: la redacción no se revisa, el momento sí. */
function wabot_revision_textos_fijos($cfg) {
    $c = (array)($cfg['comercial'] ?? []);
    $fijos = [
        'Bienvenida (sale sola con el primer mensaje del cliente)' => $cfg['bienvenida'] ?? '',
        'Planes del plan informativa' => $c['planes_informativa'] ?? '',
        'Planes del plan con panel' => $c['planes_panel'] ?? '',
        'Planes del plan internacional' => $c['planes_internacional'] ?? '',
        'Pago único (debajo de los planes, solo si pidió comprar la web)' => $c['pago_unico'] ?? '',
        'Oferta de la demo (después de los planes)' => $c['oferta_demo'] ?? '',
        'Pregunta de los turnos (rubros con turnos que no dijeron cómo los quieren)' => $c['pregunta_turnos'] ?? '',
        'Los dos precios, sin y con reservas (si pide el precio sin contestar lo de los turnos)' => trim((string)($c['dos_planes_intro'] ?? '')) === '' ? ''
            : trim((string)$c['dos_planes_intro']) . ' / ' . trim((string)($c['sin_reservas'] ?? '')) . ' (y los planes del plan informativa) / ' . trim((string)($c['con_reservas'] ?? '')),
        'Formulario de la demo (cuando acepta la demo)' => $cfg['prediseno_link'] ?? '',
        'Recordatorio del formulario (aviso automático, horas después del link, si no lo completó)' => $cfg['form_recordatorio'] ?? '',
        'Última llamada (aviso automático cerca de las 24 h del último mensaje del cliente, si vio el precio y no pidió la demo)' => $cfg['ultima_llamada'] ?? '',
        'Seguimiento sin precio (aviso automático cerca de las 24 h, si escribió y no llegó al precio)' => $cfg['seguimiento_sin_precio'] ?? '',
        'Seguimiento de la oferta (aviso automático cerca de las 24 h, si lo último fue la oferta de la demo y no contestó)' => $cfg['oferta_entrega_seguimiento'] ?? '',
    ];
    $l = [];
    foreach ($fijos as $nombre => $t) {
        $t = trim(preg_replace('/\s+/u', ' ', (string)$t));
        if ($t !== '') $l[] = "- $nombre: «" . $t . '»';
    }
    $l[] = '- Los avisos automáticos salen en horario de contacto, una sola vez por charla, y nunca dos al mismo cliente con menos de 12 h. Los mensajes con los que Pablo presenta la demo desde el panel ("ya está lista la demo…") y las plantillas de WhatsApp también son fijos. {saludo}, {nombre} y {link} los completa el sistema.';
    return implode("\n", $l);
}

/** Igual en cada llamada: OpenAI la cachea y esa parte se cobra diez veces menos. */
function wabot_revision_instrucciones($cfg) {
    return wabot_revision_instrucciones_auditor()
        . "\n\nPRECIOS VIGENTES\n" . wabot_revision_precios_texto($cfg)
        . "\n\nTEXTOS FIJOS APROBADOS\n" . wabot_revision_textos_fijos($cfg)
        . "\n\nLAS REGLAS DEL BOT (lo que recibe el bot en cada turno, tal cual; son para él: vos las usás para saber qué está bien)\n<<<\n"
        . wabot_comercial_instrucciones_comportamiento() . "\n>>>\n\n" . wabot_comercial_info($cfg);
}

/**
 * La charla como la lee el auditor: la sesión actual hasta el último mensaje
 * nuevo del bot (lo de después todavía no se revisa), con los nuevos marcados
 * con ★ y las citas resueltas, y después el estado que guardó el sistema.
 */
function wabot_revision_contexto($cv, array $lineas, array $tramo, $cfg) {
    $inicio = (int)($cv['session_started_ts'] ?? 0);
    $sel = [];
    foreach (wabot_transcript_citas($lineas) as $l) {
        $ts = (int)($l['ts'] ?? 0);
        if ($ts > $tramo['hasta']) continue;
        if ($inicio > 0 && $ts < $inicio && $ts <= $tramo['desde']) continue;
        $sel[] = $l;
    }
    $sel = array_slice($sel, -60);
    $quienes = ['cliente' => 'Cliente', 'bot' => 'Bot', 'humano' => 'Pablo (a mano)', 'sistema' => 'Sistema (nota interna, el cliente no la ve)'];

    $c = ['CHARLA CON ' . wabot_revision_nombre($cv) . ' (' . (wabot_canal($cv) === 'instagram' ? 'Instagram' : 'WhatsApp') . ')'];
    $c[] = 'Los mensajes marcados con ★ son los nuevos del bot: revisá esos. Lo demás es contexto.';
    if (count($sel) >= 60) $c[] = '(la charla es más larga: se muestran los últimos 60 mensajes)';
    $c[] = '';
    foreach ($sel as $l) {
        $q = (string)($l['q'] ?? '');
        $ts = (int)($l['ts'] ?? 0);
        $quien = $quienes[$q] ?? $q;
        if ($q === 'bot' && !empty($l['plantilla'])) $quien = 'Bot (plantilla de WhatsApp)';
        $t = trim((string)($l['t'] ?? ''));
        if ($t === '' && !empty($l['media'])) $t = '[' . (string)($l['media']['clase'] ?? 'archivo') . ']';
        $t = mb_substr($t, 0, $q === 'cliente' ? 2000 : 1500);
        $cita = '';
        if (!empty($l['cita'])) {
            $de = ($l['cita_q'] ?? '') === 'cliente' ? 'un mensaje suyo' : (($l['cita_q'] ?? '') !== '' ? 'un mensaje nuestro' : 'un mensaje anterior');
            $citado = mb_substr(trim(preg_replace('/\s+/u', ' ', (string)($l['cita_t'] ?? ''))), 0, 160);
            $cita = '[respondiendo a ' . $de . ($citado !== '' ? ': «' . $citado . '»' : '') . '] ';
        }
        $nuevo = $q === 'bot' && $ts > $tramo['desde'];
        $c[] = ($nuevo ? '★ ' : '') . '[' . date('d/m H:i', $ts) . '] ' . $quien . ': ' . $cita . $t;
    }

    $c[] = '';
    $c[] = 'ESTADO QUE GUARDÓ EL SISTEMA (al momento de esta revisión)';
    $f = wabot_ficha($cv);
    $dato = function ($v) { $v = is_array($v) ? implode(', ', array_filter(array_map('strval', $v))) : trim((string)$v); return $v === '' ? '(no lo dijo)' : $v; };
    $c[] = '- Rubro: ' . $dato($f['rubro']) . ' · Qué vende u ofrece: ' . $dato($f['que_vende']);
    $sol = (string)($cv['comercial_solucion'] ?? '');
    if ($sol !== '') $c[] = '- Solución que definió el bot: ' . $sol;
    $cot = wabot_comercial_cotizacion($cv, $cfg);
    $c[] = $cot
        ? '- Precio que se le pasó: plan ' . ($cot['plan'] === 'informativa' ? 'informativa' : ($cot['plan'] === 'internacional' ? 'internacional' : 'con panel'))
          . ', anual ' . $cot['anual'] . ', mensual ' . $cot['mensual'] . (($cot['origen'] ?? '') === 'chat' ? ' (leído de la charla)' : '')
        : '- Todavía no se le pasó el precio.';
    $c[] = '- Oferta de la demo: ' . (wabot_comercial_oferta_hecha($cv, $cfg) ? 'ya se le hizo' : 'todavía no');
    if (!empty($cv['link_form_enviado']) || !empty($cv['form_link_mandado_ts'])) $c[] = '- Ya se le mandó el link del formulario.';
    if ((int)($cv['form_completado_ts'] ?? 0) > 0 || !empty($cv['lead_creado'])) $c[] = '- Ya completó el formulario.';
    if (!empty($cv['presentado_ts'])) $c[] = '- Ya se le presentó la demo.';
    if (!empty($cv['pago_avisado_ts']) || !empty($cv['cliente_id'])) $c[] = '- Avisó que pagó o ya es cliente.';
    $estado = wabot_comercial_estado($cv);
    if ($estado === 'humano') $c[] = '- El bot se lo pasó a Pablo. Motivo: ' . trim((string)($cv['comercial_motivo'] ?? 'caso especial'));
    if ($estado === 'rechazo') $c[] = '- El cliente no quiso avanzar.';
    if (!empty($cv['control_manual'])) $c[] = '- Pablo tomó la charla a mano (el bot ya no le contesta).';
    if (!empty($cv['contexto_consulta'])) $c[] = '- No es una consulta de venta: ' . str_replace('_', ' ', (string)$cv['contexto_consulta']);
    $u = (array)($cv['comercial_ultimo'] ?? []);
    if (!empty($u['accion'])) {
        $rev = (array)($u['revision'] ?? []);
        $c[] = '- Última decisión del bot: ' . (string)$u['accion'] . (!empty($u['motivo']) ? ' (' . mb_substr((string)$u['motivo'], 0, 200) . ')' : '')
            . (in_array($rev['estado'] ?? '', ['corregida', 'dudosa', 'frenada'], true) ? '. Su revisor interno la marcó: ' . $rev['estado'] : '');
    }
    return implode("\n", $c);
}

function wabot_revision_esquema() {
    $texto = ['type' => 'string'];
    return [
        'type' => 'json_schema',
        'name' => 'revision_charla_v1',
        'strict' => true,
        'schema' => [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['ok', 'problemas', 'resumen', 'intervenir'],
            'properties' => [
                'ok' => ['type' => 'boolean'],
                'problemas' => ['type' => 'array', 'items' => [
                    'type' => 'object', 'additionalProperties' => false,
                    'required' => ['tipo', 'gravedad', 'mensaje', 'detalle', 'sugerencia'],
                    'properties' => [
                        'tipo' => ['type' => 'string', 'enum' => array_keys(wabot_revision_tipos())],
                        'gravedad' => ['type' => 'string', 'enum' => ['grave', 'leve']],
                        'mensaje' => $texto, 'detalle' => $texto, 'sugerencia' => $texto,
                    ],
                ]],
                'resumen' => $texto,
                'intervenir' => ['type' => 'boolean'],
            ],
        ],
    ];
}

/**
 * Revisa un tramo de una charla. Devuelve ['llamada_ok', 'error', 'problemas',
 * 'resumen', 'intervenir', 'costo_usd', 'modelo'].
 */
function wabot_revision_charla($cv, array $lineas, array $tramo, $cfg) {
    $cfgLlamada = $cfg;
    $cfgLlamada['openai_timeout'] = 60;   // nadie espera esta respuesta: que piense tranquilo
    $r = wabot_openai_llamar('revision', wabot_revision_instrucciones($cfg),
        [['role' => 'user', 'content' => wabot_revision_contexto($cv, $lineas, $tramo, $cfg)]],
        wabot_revision_esquema(), $cfgLlamada, ['modo' => 'revision', 'max_tokens' => 3000, 'esfuerzo' => 'medium', 'sin_circuito' => true]);
    $costo = (float)($r['uso']['costo_usd'] ?? 0);
    if (!$r['ok'] || !is_array($r['datos'])) {
        return ['llamada_ok' => false, 'error' => (string)($r['error'] ?? 'sin_datos'), 'costo_usd' => $costo];
    }
    $tipos = wabot_revision_tipos();
    $corto = function ($v, $n) { return mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$v)), 0, $n); };
    $problemas = [];
    foreach ((array)($r['datos']['problemas'] ?? []) as $p) {
        if (!is_array($p) || $corto($p['detalle'] ?? '', 600) === '') continue;
        $problemas[] = [
            'tipo' => isset($tipos[$p['tipo'] ?? '']) ? $p['tipo'] : 'otro',
            'gravedad' => ($p['gravedad'] ?? '') === 'grave' ? 'grave' : 'leve',
            'mensaje' => $corto($p['mensaje'] ?? '', 300),
            'detalle' => $corto($p['detalle'], 600),
            'sugerencia' => $corto($p['sugerencia'] ?? '', 400),
        ];
    }
    $graves = array_filter($problemas, function ($p) { return $p['gravedad'] === 'grave'; });
    return ['llamada_ok' => true, 'error' => null, 'problemas' => $problemas, 'resumen' => $corto($r['datos']['resumen'] ?? '', 400),
            'intervenir' => !empty($r['datos']['intervenir']) && $graves, 'costo_usd' => $costo, 'modelo' => (string)($r['modelo'] ?? '')];
}

/* ─────────────────────────────── Errores técnicos del log ─────────────────────────────── */

/** Por qué el flujo comercial se quedó sin respuesta (comercial_respaldo), en palabras de Pablo. */
function wabot_revision_motivo_respaldo($error) {
    $error = (string)$error;
    if ($error === 'mensajes_no_validos') return 'lo que escribió GPT no pasó la red de seguridad dos veces';
    if ($error === 'no_disponible') return 'OpenAI estaba en pausa por errores anteriores';
    if (preg_match('/^(http_|sin_respuesta|incompleta|json_invalido|rechazo|vacia)/', $error)) return 'OpenAI no respondió bien';
    return $error !== '' ? $error : 'sin detalle';
}

/**
 * Lo que falló en el bot entre $desde y $hasta según data/log/: errores (por
 * dónde) y los turnos que el flujo comercial no pudo contestar (el cliente
 * quedó sin respuesta y la charla le quedó a Pablo).
 */
function wabot_revision_errores_log($desde, $hasta) {
    $r = ['total' => 0, 'por_tipo' => [], 'ejemplos' => []];
    $dias = array_unique([date('Y-m-d', $desde), date('Y-m-d', $hasta)]);
    foreach ($dias as $dia) {
        $h = @fopen(WABOT_DATA . '/log/' . $dia . '.jsonl', 'r');
        if (!$h) continue;
        while (($linea = fgets($h)) !== false) {
            if (strpos($linea, '"tipo":"error"') === false && strpos($linea, '"tipo":"comercial_respaldo"') === false) continue;
            $f = json_decode($linea, true);
            if (!is_array($f)) continue;
            $ts = (int)strtotime((string)($f['ts'] ?? ''));
            if ($ts <= $desde || $ts > $hasta) continue;
            $tipo = ($f['tipo'] ?? '') === 'comercial_respaldo'
                ? 'El bot no le contestó al cliente: ' . wabot_revision_motivo_respaldo($f['error'] ?? '')
                : 'Error en ' . (string)($f['donde'] ?? '?');
            $r['total']++;
            $r['por_tipo'][$tipo] = ($r['por_tipo'][$tipo] ?? 0) + 1;
            if (count($r['ejemplos']) < 8) {
                $r['ejemplos'][] = ['ts' => $ts, 'tipo' => $tipo, 'tel' => (string)($f['tel'] ?? $f['clave'] ?? ''),
                                    'msg' => mb_substr((string)($f['msg'] ?? $f['error'] ?? $f['res'] ?? ''), 0, 160)];
            }
        }
        fclose($h);
    }
    arsort($r['por_tipo']);
    return $r;
}

/* ─────────────────────────────── La pasada ─────────────────────────────── */

/** Un aviso por pasada con las charlas que tienen algo grave. */
function wabot_revision_avisar(array $graves) {
    if (!$graves || !wabot_push_configurado()) return 0;
    $n = count($graves);
    $titulo = '🔎 Revisión del bot: ' . ($n === 1 ? '1 charla con un error' : "$n charlas con errores");
    $l = [];
    foreach (array_slice($graves, 0, 4) as $g) $l[] = ($g['intervenir'] ? '⚠ ' : '') . $g['nombre'] . ': ' . mb_substr($g['detalle'], 0, 150);
    if ($n > 4) $l[] = 'y ' . ($n - 4) . ' más';
    return wabot_push_enviar($titulo, implode("\n", $l), ['tel' => 'revision', 'link' => 'https://www.gokywebs.com/wabot/admin.php?tab=revision']);
}

/**
 * Una pasada completa. Devuelve el resumen que imprime el cron y que queda en
 * estado.json (`corridas`): revisadas, con problemas, graves, pendientes,
 * salteadas, costo y errores técnicos.
 */
function wabot_revision_correr($cfg, $opciones = []) {
    $inicio = microtime(true);
    $ahora = (int)($opciones['ahora'] ?? time());
    if (!wabot_revision_activa($cfg)) return ['estado' => 'apagada'];
    if (!wabot_openai_disponible()) return ['estado' => 'sin_openai'];

    $dir = wabot_revision_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $lock = @fopen($dir . '/corriendo.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) return ['estado' => 'ya_corriendo'];

    try {
        $estado = wabot_revision_estado_leer();
        $base = $estado['ultima_ts'] > 0 ? $estado['ultima_ts'] : $ahora - WABOT_REVISION_PRIMERA_VEZ_SEG;
        $base = max($base, $ahora - WABOT_REVISION_MAX_ATRAS_SEG);
        $dia = date('Y-m-d', $ahora);
        $gastoHoy = (float)($estado['gasto'][$dia] ?? 0);
        $tope = wabot_revision_tope_usd($cfg);
        $pendientesAntes = $estado['pendientes'];
        $estado['pendientes'] = [];
        $res = ['ts' => $ahora, 'revisadas' => 0, 'con_problemas' => 0, 'graves' => 0, 'pendientes' => 0,
                'en_movimiento' => 0, 'fallidas' => 0, 'costo_usd' => 0.0, 'tope' => false];

        // Las candidatas: las que cambiaron desde la pasada anterior y las que quedaron pendientes.
        $porRevisar = [];
        foreach (wabot_revision_claves() as $clave => $mtime) {
            if (!isset($pendientesAntes[$clave]) && $mtime < $base - 300) continue;
            $cv = wabot_conv_load($clave);
            $lineas = wabot_transcript_completo($clave, $cv);
            $desde = (int)($estado['convs'][$clave] ?? $base);
            $tramo = wabot_revision_tramo($lineas, $desde, $cfg);
            if (!$tramo) continue;
            $ultima = 0;
            foreach ($lineas as $l) $ultima = max($ultima, (int)($l['ts'] ?? 0));
            if ($ultima > $ahora - WABOT_REVISION_QUIETA_SEG) {
                // El bot puede estar mandando la segunda parte del turno: la próxima pasada, desde el mismo punto.
                $estado['convs'][$clave] = $desde;
                $estado['pendientes'][$clave] = (int)($pendientesAntes[$clave] ?? 0);
                $res['en_movimiento']++;
                continue;
            }
            if ($tramo['solo_bienvenida']) { $estado['convs'][$clave] = $tramo['hasta']; continue; }
            $porRevisar[] = ['clave' => $clave, 'cv' => $cv, 'lineas' => $lineas, 'tramo' => $tramo];
        }
        usort($porRevisar, function ($a, $b) { return $a['tramo']['hasta'] <=> $b['tramo']['hasta']; });

        $graves = [];
        foreach ($porRevisar as $c) {
            $clave = $c['clave'];
            $tramo = $c['tramo'];
            if ($res['revisadas'] + $res['fallidas'] >= WABOT_REVISION_MAX_CHARLAS || $gastoHoy >= $tope || microtime(true) - $inicio > WABOT_REVISION_MAX_SEG) {
                if ($gastoHoy >= $tope) $res['tope'] = true;
                $estado['convs'][$clave] = $tramo['desde'];
                $estado['pendientes'][$clave] = (int)($pendientesAntes[$clave] ?? 0);
                continue;
            }
            $r = wabot_revision_charla($c['cv'], $c['lineas'], $tramo, $cfg);
            $gastoHoy += $r['costo_usd'];
            $res['costo_usd'] += $r['costo_usd'];
            $fila = ['ts' => $ahora, 'clave' => $clave, 'nombre' => wabot_revision_nombre($c['cv']), 'canal' => wabot_canal($c['cv']),
                     'desde' => $tramo['desde'], 'hasta' => $tramo['hasta'], 'mensajes' => $tramo['mensajes'], 'costo_usd' => round($r['costo_usd'], 6)];
            if (!$r['llamada_ok']) {
                $intentos = (int)($pendientesAntes[$clave] ?? 0) + 1;
                $res['fallidas']++;
                if ($intentos < WABOT_REVISION_INTENTOS) {
                    $estado['convs'][$clave] = $tramo['desde'];
                    $estado['pendientes'][$clave] = $intentos;
                    continue;
                }
                // Tres veces sin respuesta con el mismo tramo: se suelta y queda anotado.
                $estado['convs'][$clave] = $tramo['hasta'];
                wabot_revision_anotar($fila + ['ok' => null, 'error' => $r['error'], 'problemas' => [], 'resumen' => '', 'intervenir' => false]);
                continue;
            }
            $estado['convs'][$clave] = $tramo['hasta'];
            $res['revisadas']++;
            $fila += ['ok' => !$r['problemas'], 'problemas' => $r['problemas'], 'resumen' => $r['resumen'], 'intervenir' => (bool)$r['intervenir'], 'modelo' => $r['modelo']];
            wabot_revision_anotar($fila);
            if ($r['problemas']) $res['con_problemas']++;
            foreach ($r['problemas'] as $p) {
                if ($p['gravedad'] !== 'grave') continue;
                $res['graves']++;
                $graves[] = ['nombre' => $fila['nombre'], 'detalle' => $p['detalle'], 'intervenir' => (bool)$r['intervenir']];
                break;
            }
        }

        $res['pendientes'] = count($estado['pendientes']);
        $res['errores_log'] = wabot_revision_errores_log($base, $ahora);
        $res['avisados'] = empty($opciones['sin_aviso']) ? wabot_revision_avisar($graves) : 0;
        $res['costo_usd'] = round($res['costo_usd'], 4);
        $res['segundos'] = round(microtime(true) - $inicio, 1);
        $estado['gasto'][$dia] = round($gastoHoy, 6);
        $estado['ultima_ts'] = $ahora;
        $estado['corridas'][] = $res;
        wabot_revision_estado_guardar($estado);
        wabot_log('revision', ['revisadas' => $res['revisadas'], 'con_problemas' => $res['con_problemas'], 'graves' => $res['graves'],
                               'pendientes' => $res['pendientes'], 'costo_usd' => $res['costo_usd'], 'errores_log' => $res['errores_log']['total']]);
        return ['estado' => 'ok'] + $res;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}
