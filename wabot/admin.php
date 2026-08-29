<?php
/**
 * wabot/admin.php — panel del bot de WhatsApp.
 * Pestañas: Conversaciones (la de entrada) · Embudo · Probar · Textos · Entrenamiento · Estado.
 * Auth: normalmente entra por el login de Firebase del admin (ver auth.php);
 * la clave de WABOT_ADMIN_PASS queda como respaldo para acceso directo.
 */

require_once __DIR__ . '/redactor.php';
require_once __DIR__ . '/push.php';

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', WABOT_DATA . '/log/php-errors.log');

// Sesión larga: el panel vive embebido en el admin, no queremos pedir la clave todo el tiempo.
session_set_cookie_params([
    'lifetime' => 30 * 24 * 3600,
    'path'     => '/',
    // Detrás del proxy de Hostinger $_SERVER['HTTPS'] puede venir vacío aunque
    // el cliente esté en HTTPS: sin esto la cookie de sesión perdía el flag
    // Secure y podía viajar en claro.
    'secure'   => !empty($_SERVER['HTTPS'])
                  || strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https',
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

// Modo embebido (dentro del iframe de admin/dashboard.html): sin encabezado propio.
// Se guarda en la sesión para no tener que arrastrar ?embed= en cada link interno.
if (isset($_GET['embed'])) $_SESSION['wabot_embed'] = !empty($_GET['embed']);
$embed = !empty($_SESSION['wabot_embed']);

/* ── Login ── */
if (isset($_GET['salir'])) { session_destroy(); header('Location: admin.php'); exit; }
if (!empty($_POST['clave'])) {
    if (hash_equals(WABOT_ADMIN_PASS, $_POST['clave'])) { $_SESSION['wabot'] = true; }
    else { $errorLogin = 'Clave incorrecta'; }
}
$logueado = !empty($_SESSION['wabot']);

$cfg = wabot_config_load();
$ACCIONES = ['rubro_landing','rubro_ecommerce','rubro_inmobiliaria','rubro_cursos','rubro_institucional','rubro_comercio','rubro_hibrido','rubro_sistema','servicio_con_turnos','turnos_si','turnos_no','comercio_vender','comercio_mostrar','hibrido_trabajos','hibrido_catalogo','hibrido_vender','elige_landing','elige_ecommerce','algo_diferente','cursos_vender','cursos_mostrar','pregunta_tipos','quiere_prediseno','datos_prediseno','pregunta_info','objecion_caro','objecion_pensarlo','objecion_socio','objecion_ya_tiene_web','menciona_plataforma','no_interesa','quiere_avanzar','pide_humano','productos_y_cursos','cambia_tipo','saludo','otro'];
// Si una versión futura del motor agrega una etiqueta, el panel tiene que
// conservarla aunque todavía no figure arriba: abrir y guardar Entrenamiento
// nunca puede convertir un ejemplo válido en la primera opción del select.
foreach (($cfg['ejemplos'] ?? []) as $ej) {
    $accionExistente = trim((string)($ej['accion'] ?? ''));
    if ($accionExistente !== '' && !in_array($accionExistente, $ACCIONES, true)) $ACCIONES[] = $accionExistente;
}

/**
 * Descarga de una foto o audio que mandó un cliente. GET porque es un link
 * navegable (<a href download>), no una acción; mismo gate $logueado que todo
 * lo demás. El nombre de archivo se valida contra el patrón exacto que genera
 * wabot_media_guardar(), así que no hay forma de pedir un path fuera de esa
 * carpeta aunque alguien manipule el query string.
 */
if ($logueado && $_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['accion'] ?? '') === 'media') {
    $clave   = preg_replace('/[^0-9A-Za-z]/', '', (string)($_GET['tel'] ?? ''));
    $archivo = (string)($_GET['archivo'] ?? '');
    /* El nombre en disco lo generamos nosotros (timestamp + hex + extensión),
     * así que alcanza con exigir ESE formato: no hay forma de salirse de la
     * carpeta ni de pedir otra cosa. La extensión se acepta abierta porque
     * desde el 28-ago se guarda la que traía el archivo del cliente —un .cdr o
     * un .dwg son válidos para descargar aunque el bot no sepa leerlos— y
     * wabot_media_guardar() ya bloquea lo ejecutable antes de escribir. */
    $patron = '/^\d{8}-\d{6}-[0-9a-f]{8}\.[a-z0-9]{1,5}$/';
    if ($clave === '' || !preg_match($patron, $archivo) || wabot_media_ext_prohibida(pathinfo($archivo, PATHINFO_EXTENSION))) {
        http_response_code(400);
        exit('archivo invalido');
    }
    $ruta = WABOT_DATA . '/media/' . $clave . '/' . $archivo;
    if (!is_file($ruta)) {
        http_response_code(404);
        exit('no encontrado');
    }
    $mimes = array_flip(wabot_media_extensiones());
    $ext = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
    // modo=ver: para <img>/<audio>/<video> y el clic de "ver completa" — se
    // muestra inline en vez de forzar la descarga. Sin ese parámetro, el link
    // de "Descargar" sigue bajando el archivo como siempre. Solo se abre
    // inline lo que el navegador sabe mostrar sin ejecutar nada: un .docx o un
    // .zip servido inline no aporta y abre superficie al pedo.
    $inlineOk = ['jpg','png','webp','gif','ogg','mp3','m4a','amr','wav','aac','mp4','3gp','mov','webm','pdf','txt'];
    $disposicion = (($_GET['modo'] ?? '') === 'ver' && in_array($ext, $inlineOk, true)) ? 'inline' : 'attachment';
    // El nombre real que le puso el cliente al archivo se guarda en el
    // transcript, no en disco: acá el archivo se llama por su timestamp.
    $nombreDescarga = trim((string)($_GET['nombre'] ?? ''));
    $nombreDescarga = preg_replace('/[^\w .\-()]+/u', '', $nombreDescarga);
    if ($nombreDescarga === '' || strlen($nombreDescarga) > 120) $nombreDescarga = $clave . '-' . $archivo;
    header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
    header('X-Content-Type-Options: nosniff');
    header('Content-Length: ' . filesize($ruta));
    header('Content-Disposition: ' . $disposicion . '; filename="' . $nombreDescarga . '"');
    header('Cache-Control: private, max-age=0, no-store');
    readfile($ruta);
    exit;
}

/**
 * Exporta las conversaciones activas en los últimos N días como un .txt
 * legible, para pasarlas afuera del panel y revisar errores de a muchas.
 * Se incluye la charla ENTERA de cualquier conversación con al menos un
 * mensaje en la ventana, no solo los mensajes de esos días — media conversación
 * de un día antes sin el arranque no sirve para diagnosticar nada.
 */
if ($logueado && $_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['accion'] ?? '') === 'export_chats') {
    $dias = max(1, min(60, (int)($_GET['dias'] ?? 7)));
    $desde = time() - $dias * 86400;

    $archivos = glob(WABOT_DATA . '/conv/*.json') ?: [];
    usort($archivos, function ($a, $b) { return filemtime($b) - filemtime($a); });

    $bloques = [];
    foreach ($archivos as $f) {
        $clave = basename($f, '.json');
        if ($clave === 'TEST') continue;
        $cv = wabot_conv_load($clave);
        $t  = (array)($cv['transcript'] ?? []);
        if (!$t) continue;
        $ultimo = end($t);
        if ((int)($ultimo['ts'] ?? 0) < $desde) continue;

        $nombre = trim((string)($cv['nombre'] ?? '')) ?: 'Sin nombre';
        $tel    = wabot_canal($cv) === 'instagram' ? ('IG:' . wabot_channel_user_id($cv)) : wabot_formatear_tel($cv['tel'] ?? $clave);
        $tipo   = wabot_tipo_label($cv['tipo'] ?? '', $cfg) ?: ($cv['tipo'] ?? '-');

        $lineas = [];
        $lineas[] = str_repeat('=', 60);
        $lineas[] = "Nombre: $nombre | Tel: $tel | Canal: " . wabot_canal($cv)
                  . " | Fase: " . ($cv['fase'] ?? '-') . " | Tipo: $tipo"
                  . (!empty($cv['handoff_pendiente']) ? ' | PABLO PENDIENTE' : '')
                  . (!empty($cv['archivado']) ? ' | archivado' : '');
        $lineas[] = str_repeat('=', 60);
        foreach ($t as $linea) {
            $ts = (int)($linea['ts'] ?? 0);
            $fecha = $ts ? date('d/m H:i', $ts) : '--/-- --:--';
            $quien = ['cliente' => 'Cliente', 'bot' => 'Bot', 'humano' => 'Vos (Pablo)'][$linea['q'] ?? ''] ?? ($linea['q'] ?? '?');
            $texto = trim((string)($linea['t'] ?? ''));
            if (!empty($linea['media']['clase'])) {
                $texto .= ($texto !== '' ? ' ' : '') . '[adjunto: ' . $linea['media']['clase'] . ']';
            }
            $lineas[] = "[$fecha] $quien: $texto";
        }
        $bloques[] = implode("\n", $lineas);
    }

    $salida = $bloques
        ? "Chats activos en los últimos $dias días — " . count($bloques) . " conversaciones\n\n" . implode("\n\n", $bloques) . "\n"
        : "No hubo conversaciones activas en los últimos $dias días.\n";

    header('Content-Type: text/plain; charset=utf-8');
    header('Content-Disposition: attachment; filename="wabot-chats-' . date('Y-m-d') . '.txt"');
    header('Cache-Control: private, max-age=0, no-store');
    echo $salida;
    exit;
}

/**
 * Descarga en .txt todos los chats que ARRANCARON un día puntual (no los
 * activos ese día: el primer mensaje del cliente cayó ese día). Mismo
 * formato que export_chats, pero agrupado por día de inicio en vez de
 * por actividad reciente.
 */
if ($logueado && $_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['accion'] ?? '') === 'imprimir_chats') {
    $fecha = (string)($_GET['fecha'] ?? '');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) { http_response_code(400); exit('fecha inválida'); }
    [$anio, $mes, $dia] = array_map('intval', explode('-', $fecha));
    // Argentina no tiene horario de verano: UTC-3 fijo. 00:00 hora AR = 03:00 UTC.
    $inicioDia = gmmktime(3, 0, 0, $mes, $dia, $anio);
    $finDia    = $inicioDia + 86400;

    $archivos = glob(WABOT_DATA . '/conv/*.json') ?: [];
    $chats = [];
    foreach ($archivos as $f) {
        $clave = basename($f, '.json');
        if (stripos($clave, 'TEST') !== false) continue;
        $cv = wabot_conv_load($clave);
        $inicio = (int)($cv['chat_started_ts'] ?? 0);
        if ($inicio < $inicioDia || $inicio >= $finDia) continue;
        $chats[] = $cv;
    }
    usort($chats, function ($a, $b) { return (int)$a['chat_started_ts'] - (int)$b['chat_started_ts']; });

    $bloques = [];
    foreach ($chats as $cv) {
        $nombre = wabot_nombre_agenda($cv) ?: 'Sin nombre';
        $tel    = wabot_canal($cv) === 'instagram' ? ('IG:' . wabot_channel_user_id($cv)) : wabot_formatear_tel($cv['tel'] ?? '');
        $tipo   = wabot_tipo_label($cv['tipo'] ?? '', $cfg) ?: ($cv['tipo'] ?? '-');

        $lineas = [];
        $lineas[] = str_repeat('=', 60);
        $lineas[] = "Nombre: $nombre | Tel: $tel | Canal: " . wabot_canal($cv)
                  . " | Fase: " . ($cv['fase'] ?? '-') . " | Tipo: $tipo"
                  . (!empty($cv['handoff_pendiente']) ? ' | PABLO PENDIENTE' : '')
                  . (!empty($cv['archivado']) ? ' | archivado' : '');
        $lineas[] = str_repeat('=', 60);
        foreach ((array)($cv['transcript'] ?? []) as $linea) {
            $ts = (int)($linea['ts'] ?? 0);
            $horaLinea = $ts ? date('d/m H:i', $ts) : '--/-- --:--';
            $quien = ['cliente' => 'Cliente', 'bot' => 'Bot', 'humano' => 'Vos (Pablo)'][$linea['q'] ?? ''] ?? ($linea['q'] ?? '?');
            $texto = trim((string)($linea['t'] ?? ''));
            if (!empty($linea['media']['clase'])) {
                $texto .= ($texto !== '' ? ' ' : '') . '[adjunto: ' . $linea['media']['clase'] . ']';
            }
            $lineas[] = "[$horaLinea] $quien: $texto";
        }
        $bloques[] = implode("\n", $lineas);
    }

    $salida = $bloques
        ? "Chats iniciados el $fecha — " . count($bloques) . ' ' . (count($bloques) === 1 ? 'conversación' : 'conversaciones') . "\n\n" . implode("\n\n", $bloques) . "\n"
        : "No hubo conversaciones que hayan arrancado el $fecha.\n";

    header('Content-Type: text/plain; charset=utf-8');
    header('Content-Disposition: attachment; filename="wabot-chats-' . $fecha . '.txt"');
    header('Cache-Control: private, max-age=0, no-store');
    echo $salida;
    exit;
}

/* ── Acciones POST (solo logueado) ──
 *
 * Contra CSRF la defensa principal ya es la cookie SameSite=Lax de arriba: un
 * POST desde otro sitio no lleva la sesión. Esto es la segunda capa, y no pide
 * ningún cambio en los formularios: si el navegador manda Origin (lo hace en
 * todo POST moderno) tiene que ser el nuestro. Un pedido armado a mano puede
 * omitir el header, pero ése ya no tiene la cookie. */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $origen = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
    if ($origen !== '') {
        $hostOrigen = parse_url($origen, PHP_URL_HOST);
        $hostPropio = preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? ''));
        if ($hostOrigen === null || strcasecmp((string)$hostOrigen, $hostPropio) !== 0) {
            wabot_log('csrf_origen', ['origen' => mb_substr($origen, 0, 120), 'accion' => (string)($_POST['accion'] ?? '')]);
            http_response_code(403);
            echo 'Origen no permitido.';
            exit;
        }
    }
}

if ($logueado && $_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['accion'])) {
    $a = $_POST['accion'];

    if ($a === 'probar') {
        header('Content-Type: application/json; charset=utf-8');
        $texto = trim((string)($_POST['texto'] ?? ''));
        if ($texto === '') { echo json_encode(['error' => 'vacío']); exit; }
        $conv = wabot_conv_load('TEST');
        wabot_conv_transcript($conv, 'cliente', $texto);
        $resp = wabot_responder($texto, $conv, $cfg) ?: [];
        $resp = array_map(function ($m) use ($conv) { return wabot_personalizar($m, $conv); }, $resp);
        foreach ($resp as $m) wabot_conv_transcript($conv, 'bot', $m);
        wabot_conv_save($conv);
        $demoras = [];
        foreach ($resp as $m) $demoras[] = round(wabot_demora_tipeo($m, $cfg), 2);
        echo json_encode([
            'mensajes' => array_values($resp),
            'demoras'  => $demoras,
            'fase'     => $conv['fase'],
            'tipo'     => $conv['tipo'],
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($a === 'probar_reset') {
        @unlink(wabot_conv_path('TEST'));
        header('Location: admin.php?tab=probar'); exit;
    }
    if ($a === 'toggle_activo') {
        $cfg['activo'] = empty($cfg['activo']);
        wabot_config_save($cfg);
        header('Location: admin.php'); exit;
    }
    /* Alta del dispositivo para las notificaciones push. El token lo genera el
     * navegador de Pablo (Firebase) y hay que guardarlo para poder mandarle
     * algo cuando el panel está cerrado. Se refresca en cada carga: Firebase
     * los rota, y uno viejo deja de recibir. */
    if ($a === 'push_token' && !empty($_POST['token'])) {
        header('Content-Type: application/json; charset=utf-8');
        $ok = wabot_push_token_guardar($_POST['token'], (string)($_SERVER['HTTP_USER_AGENT'] ?? ''));
        echo json_encode(['ok' => $ok, 'dispositivos' => count(wabot_push_tokens())]);
        exit;
    }
    /* El botón "Probar" de la pestaña Estado: manda una notificación de prueba
     * a todos los dispositivos registrados. */
    if ($a === 'push_probar') {
        header('Content-Type: application/json; charset=utf-8');
        if (!wabot_push_configurado()) {
            echo json_encode(['ok' => false, 'error' => 'Falta config/service-account.json en el server.']);
            exit;
        }
        $n = wabot_push_enviar('Gokywebs · prueba', 'Si ves esto, las notificaciones andan.',
                               ['tel' => 'prueba', 'link' => 'https://www.gokywebs.com/wabot/admin.php']);
        echo json_encode(['ok' => $n > 0, 'dispositivos' => $n]);
        exit;
    }
    if ($a === 'guardar_textos') {
        foreach (['menu','def_tipos','contame','aclarar_objetivo','desempate_cursos','desempate_turnos','desempate_comercio','desempate_hibrido','msg_precio','msg_precio_tras_pitch','msg_precio_catalogo_tras_pitch','msg_prediseno_oferta','prediseno','prediseno_falta_descripcion','prediseno_falta_colores','prediseno_completo','derivar','espera','espera_prediseno','pide_llamada','caro','pensarlo','socio','ya_tengo_web','cta_muestra','cierre_suave','plataformas','no_interesa','no_texto','media_recibida','seguimiento_precio','seguimiento_datos','seguimiento_pregunta','seguimiento_pregunta_gancho','sistema_pregunta','sistema_pregunta_usuarios','sistema_pregunta_actual','sistema_whatsapp','sistema_whatsapp_invalido','sistema_cierre','hosting_renovacion'] as $k) {
            if (isset($_POST[$k])) $cfg[$k] = str_replace("\r", '', trim((string)$_POST[$k]));
        }
        foreach (array_keys($cfg['info']) as $k) {
            if (isset($_POST['info_' . $k])) $cfg['info'][$k] = str_replace("\r", '', trim((string)$_POST['info_' . $k]));
        }
        foreach (array_keys($cfg['tipos']) as $t) {
            if (isset($_POST['precio_' . $t])) $cfg['tipos'][$t]['precio'] = trim((string)$_POST['precio_' . $t]);
            if (isset($_POST['link_' . $t]))   $cfg['tipos'][$t]['link']   = trim((string)$_POST['link_' . $t]);
            if (isset($_POST['desc_' . $t]))   $cfg['tipos'][$t]['desc']   = str_replace("\r", '', trim((string)$_POST['desc_' . $t]));
        }
        foreach (array_keys($cfg['mantenimiento_planes'] ?? []) as $mp) {
            if (isset($_POST['mant_precio_' . $mp])) $cfg['mantenimiento_planes'][$mp]['precio'] = trim((string)$_POST['mant_precio_' . $mp]);
            if (isset($_POST['mant_link_' . $mp]))   $cfg['mantenimiento_planes'][$mp]['link']   = trim((string)$_POST['mant_link_' . $mp]);
        }
        if (isset($_POST['demora_primer_mensaje'])) $cfg['demora_primer_mensaje'] = max(0, min(60, (int)$_POST['demora_primer_mensaje']));
        if (isset($_POST['demora_segundos']))    $cfg['demora_segundos']    = max(0, min(60, (int)$_POST['demora_segundos']));
        if (isset($_POST['demora_entre_mensajes'])) $cfg['demora_entre_mensajes'] = max(0, min(15, (int)$_POST['demora_entre_mensajes']));
        if (isset($_POST['tipeo_por_segundo']))     $cfg['tipeo_por_segundo']     = max(5, min(200, (int)$_POST['tipeo_por_segundo']));
        if (isset($_POST['demora_minima']))         $cfg['demora_minima']         = max(0, min(10, (float)$_POST['demora_minima']));
        if (isset($_POST['demora_maxima']))         $cfg['demora_maxima']         = max(1, min(30, (float)$_POST['demora_maxima']));
        $cfg['demora_por_longitud'] = !empty($_POST['demora_por_longitud']);
        // Los checkbox no viajan cuando están destildados: por eso se leen del form entero.
        $cfg['leer_imagenes']   = !empty($_POST['leer_imagenes']);
        $cfg['escuchar_audios'] = !empty($_POST['escuchar_audios']);
        $cfg['form_activo'] = !empty($_POST['form_activo']);
        if (isset($_POST['gemini_modelo']) && isset(wabot_gemini_modelos()[$_POST['gemini_modelo']])) {
            $cfg['gemini_modelo'] = (string)$_POST['gemini_modelo'];
        }
        if (isset($_POST['capi_dataset_id'])) $cfg['capi_dataset_id'] = preg_replace('/\D+/', '', (string)$_POST['capi_dataset_id']);
        // El token solo se pisa si escribieron uno nuevo: el campo se muestra
        // vacío a propósito para no dejar la credencial a la vista en el HTML.
        if (trim((string)($_POST['capi_token'] ?? '')) !== '') $cfg['capi_token'] = trim((string)$_POST['capi_token']);
        foreach (['confirmacion_demo_48h'] as $clavePlant) {
            if (!isset($cfg['plantillas'][$clavePlant])) $cfg['plantillas'][$clavePlant] = [];
            $cfg['plantillas'][$clavePlant]['nombre'] = trim((string)($_POST["plantilla_{$clavePlant}_nombre"] ?? ''));
            $cfg['plantillas'][$clavePlant]['idioma'] = trim((string)($_POST["plantilla_{$clavePlant}_idioma"] ?? '')) ?: 'es_AR';
            $cfg['plantillas'][$clavePlant]['activa'] = !empty($_POST["plantilla_{$clavePlant}_activa"]);
        }
        if (isset($_POST['pausa_horas_humano'])) $cfg['pausa_horas_humano'] = max(1, (int)$_POST['pausa_horas_humano']);
        if (isset($_POST['reset_dias']))         $cfg['reset_dias']         = max(1, (int)$_POST['reset_dias']);
        $cfg['seguimiento_activo'] = !empty($_POST['seguimiento_activo']);
        if (isset($_POST['seguimiento_horas'])) {
            $cfg['seguimiento_horas'] = max(0.5, min(22, (float)$_POST['seguimiento_horas']));
        }
        if (isset($_POST['seguimiento_hora_desde'])) {
            $cfg['seguimiento_hora_desde'] = max(0, min(23, (int)$_POST['seguimiento_hora_desde']));
        }
        if (isset($_POST['seguimiento_hora_hasta'])) {
            $cfg['seguimiento_hora_hasta'] = max(0, min(23, (int)$_POST['seguimiento_hora_hasta']));
        }
        if (isset($_POST['presentados_archivar_horas'])) {
            $cfg['presentados_archivar_horas'] = max(24, min(720, (float)$_POST['presentados_archivar_horas']));
        }
        wabot_config_save($cfg);
        header('Location: admin.php?tab=textos&ok=1'); exit;
    }
    if ($a === 'guardar_entrenamiento') {
        $cfg['indicaciones'] = str_replace("\r", '', trim((string)($_POST['indicaciones'] ?? '')));
        $modo = $_POST['modo_redaccion'] ?? 'fijo';
        $cfg['modo_redaccion'] = in_array($modo, ['fijo', 'natural', 'agente'], true) ? $modo : 'fijo';
        $cfg['indicaciones_estilo'] = str_replace("\r", '', trim((string)($_POST['indicaciones_estilo'] ?? '')));
        $ejemplos = [];
        $textos   = (array)($_POST['ej_texto'] ?? []);
        $acciones = (array)($_POST['ej_accion'] ?? []);
        $infos    = (array)($_POST['ej_info'] ?? []);
        foreach ($textos as $i => $t) {
            $t = trim((string)$t);
            $ac = (string)($acciones[$i] ?? '');
            if ($t === '' || !in_array($ac, $ACCIONES, true)) continue;
            $ej = ['texto' => $t, 'accion' => $ac];
            $ik = trim((string)($infos[$i] ?? ''));
            if ($ik !== '') $ej['info_keys'] = array_values(array_filter(array_map('trim', explode(',', $ik))));
            $ejemplos[] = $ej;
        }
        $cfg['ejemplos'] = $ejemplos;
        wabot_config_save($cfg);
        header('Location: admin.php?tab=entrenamiento&ok=1'); exit;
    }
    if ($a === 'responder' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');
        $texto = trim((string)($_POST['texto'] ?? ''));
        if ($texto === '') { echo json_encode(['error' => 'Escribí un mensaje.']); exit; }

        $conv = wabot_conv_load($_POST['tel']);
        if (wabot_ventana_restante($conv) <= 0) {
            echo json_encode(['error' => 'Pasaron más de 24 horas desde su último mensaje: WhatsApp no deja responder con texto libre hasta que el cliente vuelva a escribir.']);
            exit;
        }

        if (!wabot_enviar($conv, $texto)) {
            echo json_encode(['error' => (wabot_canal($conv) === 'instagram' ? 'Instagram' : 'WhatsApp') . ' rechazó el envío. Revisá el log en wabot/data/log/.']);
            exit;
        }

        // Contestar a mano pausa el bot en este chat, igual que si respondieras desde el celular.
        $horas = (int)($cfg['pausa_horas_humano'] ?? 24);
        $conv['pausado_hasta'] = time() + $horas * 3600;
        $conv['handoff_pendiente'] = false;
        wabot_conv_transcript($conv, 'humano', $texto);
        if (function_exists('wabot_evento')) wabot_evento($conv, 'humano_responde', ['via' => 'panel']);
        wabot_conv_save($conv);
        wabot_log('respuesta_panel', ['tel' => $conv['tel']]);

        echo json_encode(['ok' => true, 'pausado_hasta' => $conv['pausado_hasta']]);
        exit;
    }
    // Botón "Presentar" del admin: le manda al cliente los dos mensajes de la
    // demo (link + pedido de feedback) desde el bot.
    if ($a === 'presentar_muestra' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');
        $negocio = trim((string)($_POST['negocio'] ?? ''));
        $slug = $negocio !== '' ? wabot_slug_demo($negocio) : '';
        if ($slug === '') { echo json_encode(['error' => 'No se pudo armar el link de la demo: falta el nombre del negocio.']); exit; }

        $clave = wabot_conv_resolver($_POST['tel'], $motivo);
        if ($clave === null) {
            wabot_log('presentar_muestra_sin_chat', ['tel' => (string)$_POST['tel'], 'motivo' => $motivo, 'slug' => $slug]);
            echo json_encode(['ok' => true, 'enviado' => false, 'sin_chat' => true, 'slug' => $slug]);
            exit;
        }
        $conv = wabot_conv_load($clave);

        // NO se pausa el bot: presentar la demo abre la parte 2 de la venta, y
        // ahí el bot sigue trabajando (aclara dudas, pasa la seña, ofrece la
        // videollamada). Antes esto lo dejaba mudo 24 h y la venta se frenaba.
        $conv['pausado_hasta'] = 0;
        $conv['handoff_pendiente'] = false;
        $conv['fase'] = 'postdemo';
        $conv['cierre'] = null;
        $conv['espera_avisada'] = false;
        $conv['presentado_ts'] = time();
        $conv['presentado_slug'] = $slug;
        $conv['presentado_confirmado'] = false;
        $conv['presentado_via_bot'] = false;
        $conv['presentado_recordatorio_enviado'] = false;
        $conv['presentado_recordatorio_ts'] = 0;
        $conv['cliente_id'] = trim((string)($_POST['cliente_id'] ?? '')) ?: null;

        /* Se manda mensaje por mensaje y se mira CADA uno por separado.
         *
         * Antes era todo o nada: si el primero salía y el segundo no, se
         * reportaba fracaso total y el panel le decía a Pablo que la mandara a
         * mano — o sea, mandarle al cliente el link dos veces. Pasó de verdad:
         * "se envió bien el mensaje pero el aviso decía que no se pudo".
         *
         * El PRIMERO es el que lleva el link: ese es el que define si la demo
         * llegó, y por lo tanto si corresponde el recordatorio de 48 h. El
         * segundo (el pedido de feedback) es un extra; que falle no cambia que
         * el cliente ya tiene la demo.
         *
         * Ojo con leer un false como "no llegó": wabot_wa_send_text() corta a
         * los 20 s, así que un timeout con Meta lenta devuelve false igual con
         * el mensaje entregado. Por eso el panel avisa que hay que mirar el
         * chat antes de reenviar, en vez de mandar a reenviar de una. */
        $textos = wabot_muestra_presentar_textos($slug, $cfg);
        $enviados = 0;
        foreach ($textos as $i => $texto) {
            // Un respiro entre los dos: mandarlos pegados hace que Meta a veces
            // los entregue al revés, y el segundo no tiene sentido antes del link.
            if ($i > 0) sleep(1);
            if (!wabot_enviar($conv, $texto)) continue;
            wabot_conv_transcript($conv, 'bot', $texto);
            $enviados++;
            if ($i === 0) $conv['presentado_via_bot'] = true;
        }
        $total   = count($textos);
        $enviado = $enviados === $total;

        wabot_evento($conv, 'muestra_presentada');
        wabot_capi_evento($conv, 'Schedule', $cfg);
        wabot_conv_save($conv);
        wabot_log('presentar_muestra', ['tel' => $conv['tel'], 'slug' => $slug,
                                        'enviados' => $enviados, 'total' => $total]);

        echo json_encode([
            'ok'       => true,
            'enviado'  => $enviado,
            'enviados' => $enviados,
            'total'    => $total,
            'demo_ok'  => !empty($conv['presentado_via_bot']),   // el mensaje con el link
            'slug'     => $slug,
            // Por dónde salió: el panel decía "por WhatsApp" siempre, y desde
            // que los leads de Instagram se resuelven también, eso puede ser
            // mentira (28-ago).
            'canal'    => wabot_canal($conv),
        ]);
        exit;
    }
    // La entregaste por fuera del bot (a mano, por mail, en persona): se marca
    // igual que "Presentar" pero SIN mandarle nada al cliente, y sin escribir
    // nada en el transcript, que es espejo de lo que salió de verdad.
    if ($a === 'marcar_entregada' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        $negocio = trim((string)($conv['nombre_negocio'] ?? ''));
        $conv['pausado_hasta'] = 0;
        $conv['handoff_pendiente'] = false;
        $conv['fase'] = 'postdemo';
        $conv['cierre'] = null;
        $conv['espera_avisada'] = false;
        $conv['presentado_ts'] = time();
        $conv['presentado_slug'] = $negocio !== '' ? wabot_slug_demo($negocio) : '';
        $conv['presentado_confirmado'] = false;
        // Entregada por fuera del bot: nunca dispara el recordatorio de 48 h.
        $conv['presentado_via_bot'] = false;
        $conv['presentado_recordatorio_enviado'] = false;
        $conv['presentado_recordatorio_ts'] = 0;
        wabot_evento($conv, 'muestra_presentada');
        wabot_capi_evento($conv, 'Schedule', $cfg);
        wabot_conv_save($conv);
        wabot_log('marcar_entregada', ['tel' => $conv['tel'], 'slug' => $conv['presentado_slug']]);
        header('Location: admin.php?tab=conversaciones&ver=' . urlencode($_POST['tel'])); exit;
    }
    if ($a === 'presentado_confirmar' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        $conv['presentado_confirmado'] = empty($conv['presentado_confirmado']);
        wabot_conv_save($conv);
        header('Location: admin.php?tab=conversaciones&ver=' . urlencode($_POST['tel'])); exit;
    }
    if ($a === 'responder_audio' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');

        $subida = $_FILES['audio'] ?? null;
        if (!$subida || ($subida['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($subida['tmp_name'])) {
            echo json_encode(['error' => 'No llegó el audio. Probá grabarlo de nuevo.']);
            exit;
        }
        if ((int)$subida['size'] > WABOT_AUDIO_MAX_BYTES) {
            echo json_encode(['error' => 'El audio pesa más de 16 MB, que es el máximo que acepta WhatsApp. Grabá uno más corto.']);
            exit;
        }

        $conv = wabot_conv_load($_POST['tel']);
        if (wabot_canal($conv) === 'instagram') {
            echo json_encode(['error' => 'Por ahora las notas de voz solo salen por WhatsApp. En Instagram escribile por texto.']);
            exit;
        }
        if (wabot_ventana_restante($conv) <= 0) {
            echo json_encode(['error' => 'Pasaron más de 24 horas desde su último mensaje: WhatsApp no deja responder hasta que el cliente vuelva a escribir.']);
            exit;
        }

        /* El mime se valida ENTERO, con el codec: recortarlo en el ";" antes de
         * mirarlo era la otra mitad del bug de las notas de voz. Un
         * "audio/mp4;codecs=opus" quedaba en "audio/mp4", pasaba el guard y
         * fallaba recién en Meta. A Meta se le manda el mime base, que es lo
         * que espera en el upload. */
        $mimeCompleto = trim((string)($_POST['mime'] ?? $subida['type'] ?? ''));
        $mime = trim(explode(';', $mimeCompleto)[0]);
        if (!wabot_audio_mime_valido($mimeCompleto)) {
            echo json_encode(['error' => wabot_audio_mime_motivo($mimeCompleto) . ' Probá con Chrome o Safari actualizados.']);
            wabot_log('audio_formato_rechazado', ['tel' => $conv['tel'], 'mime' => $mimeCompleto]);
            exit;
        }

        $bytes = (string)@file_get_contents($subida['tmp_name']);
        if ($bytes === '') { echo json_encode(['error' => 'El audio llegó vacío.']); exit; }

        $mediaId = wabot_wa_media_subir($bytes, $mime, 'nota-de-voz.' . (wabot_audio_extension($mime) ?: 'ogg'));
        if (!$mediaId) {
            echo json_encode(['error' => 'WhatsApp no aceptó el audio al subirlo. Revisá el log en wabot/data/log/.']);
            exit;
        }
        if (!wabot_wa_send_audio(wabot_channel_user_id($conv), $mediaId)) {
            echo json_encode(['error' => 'El audio se subió pero WhatsApp rechazó el envío. Revisá el log en wabot/data/log/.']);
            exit;
        }

        $guardado = wabot_media_guardar(wabot_conversation_key($conv), $bytes, $mime, 'audio');
        $horas = (int)($cfg['pausa_horas_humano'] ?? 24);
        $conv['pausado_hasta'] = time() + $horas * 3600;
        $conv['handoff_pendiente'] = false;
        wabot_conv_transcript($conv, 'humano', '[nota de voz]', $guardado);
        if (function_exists('wabot_evento')) wabot_evento($conv, 'humano_responde', ['via' => 'panel_audio']);
        wabot_conv_save($conv);
        wabot_log('respuesta_panel_audio', ['tel' => $conv['tel'], 'mime' => $mime, 'bytes' => strlen($bytes)]);

        echo json_encode(['ok' => true, 'pausado_hasta' => $conv['pausado_hasta']]);
        exit;
    }
    if ($a === 'transcript' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');
        $conv = wabot_conv_load($_POST['tel']);
        // Abrir el chat es lo que lo marca "leído". Solo se llama para la
        // conversación abierta en el panel (cada 5s mientras siga abierta), así
        // que no hace falta un botón aparte ni un evento de "marcar leído".
        $ultimaFila = end($conv['transcript']);
        $ultimoTs = (int)($ultimaFila['ts'] ?? 0);
        if ($ultimoTs > (int)($conv['panel_visto_ts'] ?? 0)) {
            $conv['panel_visto_ts'] = time();
            wabot_conv_save($conv);
        }
        echo json_encode([
            'transcript' => wabot_transcript_completo($_POST['tel'], $conv),
            'fase'       => $conv['fase'],
            'ventana'    => wabot_ventana_restante($conv),
            'pausado'    => ((int)$conv['pausado_hasta'] > time()),
            'handoff_pendiente' => !empty($conv['handoff_pendiente']),
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    /**
     * Corrige el texto de una línea del transcript.
     *
     * OJO: WhatsApp y la API de Instagram NO permiten editar un mensaje ya
     * entregado, así que esto NO cambia lo que el cliente recibió: corrige el
     * REGISTRO del panel. Sirve sobre todo para arreglar la transcripción de un
     * audio mal entendido, que además es lo que el bot lee como contexto.
     *
     * La línea se ubica por índice y se confirma con su ts: el transcript se
     * recorta a las últimas 60 líneas, así que el índice solo no es estable.
     */
    if ($a === 'editar_mensaje' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');
        $idx   = (int)($_POST['idx'] ?? -1);
        $ts    = (int)($_POST['ts'] ?? 0);
        $nuevo = trim((string)($_POST['texto'] ?? ''));
        if ($nuevo === '') { echo json_encode(['error' => 'El mensaje no puede quedar vacío.']); exit; }
        if (mb_strlen($nuevo) > 4000) { echo json_encode(['error' => 'Ese texto es demasiado largo.']); exit; }

        $conv = wabot_conv_load($_POST['tel']);
        // Se ubica por timestamp y no por índice: el chat del panel muestra el
        // historial archivado junto al vivo, así que las posiciones no coinciden.
        $lineas = (array)($conv['transcript'] ?? []);
        $encontrado = null;
        foreach ($lineas as $i => $linea) {
            if ((int)($linea['ts'] ?? 0) === $ts) { $encontrado = $i; break; }
        }
        if ($encontrado === null) {
            echo json_encode(['error' => 'Ese mensaje es viejo y ya quedó archivado: solo se pueden corregir los del tramo reciente.']);
            exit;
        }
        $idx = $encontrado;
        $conv['transcript'][$idx]['t'] = $nuevo;
        $conv['transcript'][$idx]['editado'] = time();
        wabot_conv_save($conv);
        wabot_log('mensaje_editado', ['tel' => $conv['tel'], 'idx' => $idx, 'quien' => $lineas[$idx]['q'] ?? '']);
        echo json_encode(['ok' => true]);
        exit;
    }
    if ($a === 'lista') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['items' => wabot_lista_items()], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Busca DENTRO de los mensajes, no en los datos de contacto: recorre cada
    // conversación completa (lo vivo + lo archivado en historial/, ver
    // wabot_transcript_completo) y devuelve las que tienen al menos un mensaje
    // que coincide, con hasta 3 fragmentos de ejemplo por chat.
    if ($a === 'buscar_mensajes') {
        header('Content-Type: application/json; charset=utf-8');
        $q = trim((string)($_POST['q'] ?? ''));
        if (mb_strlen($q) < 2) { echo json_encode(['items' => []]); exit; }
        $qNorm = wabot_normalizar_busqueda($q);

        $resultados = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            $clave = basename($f, '.json');
            if (stripos($clave, 'TEST') !== false) continue;
            $cv = wabot_conv_load($clave);
            $completo = wabot_transcript_completo($clave, $cv);

            $coincidencias = [];
            $total = 0;
            foreach ($completo as $linea) {
                $texto = (string)($linea['t'] ?? '');
                if ($texto === '') continue;
                $pos = mb_strpos(wabot_normalizar_busqueda($texto), $qNorm);
                if ($pos === false) continue;
                $total++;
                if (count($coincidencias) < 3) {
                    // Recorte centrado en la coincidencia, no desde el principio del
                    // mensaje: si el match cae lejos del arranque en un mensaje largo,
                    // cortar desde 0 se lo perdía entero y el fragmento no mostraba
                    // nada resaltado.
                    $desde = max(0, $pos - 40);
                    $fragmento = mb_substr($texto, $desde, 220);
                    $hastaOriginal = $desde + mb_strlen($fragmento);
                    if ($desde > 0) $fragmento = '…' . $fragmento;
                    if ($hastaOriginal < mb_strlen($texto)) $fragmento .= '…';
                    $coincidencias[] = [
                        'quien' => (string)($linea['q'] ?? ''),
                        't'     => $fragmento,
                        'ts'    => (int)($linea['ts'] ?? 0),
                    ];
                }
            }
            if (!$total) continue;

            $resultados[] = [
                'tel'              => $clave,
                'conversation_key' => $clave,
                'canal'            => wabot_canal($cv),
                'nombre_agenda'    => wabot_nombre_agenda($cv),
                'nombre_negocio'   => (string)($cv['nombre_negocio'] ?? ''),
                'grupo'            => wabot_conv_grupo($cv),
                'total'            => $total,
                'coincidencias'    => $coincidencias,
            ];
        }
        usort($resultados, function ($x, $y) {
            $tsX = max(array_column($x['coincidencias'], 'ts'));
            $tsY = max(array_column($y['coincidencias'], 'ts'));
            return $tsY <=> $tsX;
        });
        echo json_encode(['items' => array_slice($resultados, 0, 60)], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Lo consulta el admin (Seguimiento) para reflejar en Firestore lo que ya
    // pasó acá: mover a "último mensaje" cuando salió el recordatorio, borrar
    // el seguimiento cuando el chat se archivó por inactividad.
    if ($a === 'presentados_estado') {
        header('Content-Type: application/json; charset=utf-8');
        $items = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            $clave = basename($f, '.json');
            if (stripos($clave, 'TEST') !== false) continue;
            $cv = wabot_conv_load($clave);
            if (empty($cv['presentado_ts']) || empty($cv['cliente_id'])) continue;
            $items[] = [
                'cliente_id'           => $cv['cliente_id'],
                'tel'                  => $cv['tel'],
                'presentado_ts'        => (int)$cv['presentado_ts'],
                'confirmado'           => !empty($cv['presentado_confirmado']),
                'recordatorio_enviado' => !empty($cv['presentado_recordatorio_enviado']),
                'archivado'            => !empty($cv['archivado']),
            ];
        }
        echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Lo consulta el admin (Bocetos) para el puntito rojo: si el cliente no
    // contestó el aviso de la mañana en 24h, o cuánto le falta para eso.
    if ($a === 'avisos_estado') {
        header('Content-Type: application/json; charset=utf-8');
        $items = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            $clave = basename($f, '.json');
            if (stripos($clave, 'TEST') !== false) continue;
            $cv = wabot_conv_load($clave);
            if (empty($cv['lead_creado']) || !empty($cv['presentado_ts']) || !empty($cv['archivado'])) continue;
            if (empty($cv['muestra_aviso_ts'])) continue;
            $items[] = [
                'tel'              => $cv['tel'],
                'muestra_aviso_ts' => (int)$cv['muestra_aviso_ts'],
                'ultimo_cliente_ts'=> (int)($cv['ultimo_cliente_ts'] ?? 0),
            ];
        }
        echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($a === 'conv_toggle' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        $conv['bot_off'] = empty($conv['bot_off']);
        wabot_conv_save($conv);
        header('Location: admin.php?tab=conversaciones'); exit;
    }
    if ($a === 'conv_reanudar' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        $conv['pausado_hasta'] = 0;
        wabot_conv_save($conv);
        header('Location: admin.php?tab=conversaciones'); exit;
    }
    if ($a === 'conv_reset' && !empty($_POST['tel'])) {
        @unlink(wabot_conv_path($_POST['tel']));
        header('Location: admin.php?tab=conversaciones'); exit;
    }
    if ($a === 'conv_archivar' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        $conv['archivado'] = empty($conv['archivado']);
        wabot_conv_save($conv);
        header('Location: admin.php?tab=conversaciones'); exit;
    }
    if ($a === 'conv_eliminar' && !empty($_POST['tel'])) {
        @unlink(wabot_conv_path($_POST['tel']));
        header('Location: admin.php?tab=conversaciones'); exit;
    }
    // Red manual para cuando el cierre automático no se disparó: crea el lead
    // con lo que ya se haya conversado, tal como lo haría el cierre del bot.
    // Con `forzar` rehace uno que ya existía — wabot_prediseno_completo() saltea
    // la creación si lead_creado está en true, así que hay que bajarlo antes.
    if ($a === 'conv_crear_boceto' && !empty($_POST['tel'])) {
        $conv = wabot_conv_load($_POST['tel']);
        if (!empty($_POST['forzar'])) $conv['lead_creado'] = false;
        wabot_prediseno_completo($conv, $cfg);
        wabot_conv_save($conv);
        $aviso = !empty($conv['lead_creado']) ? 'boceto_ok' : 'boceto_error';
        header('Location: admin.php?tab=conversaciones&ver=' . urlencode($_POST['tel']) . '&' . $aviso . '=1'); exit;
    }
}

// Conversaciones primero: es lo que se mira todos los días.
$tab = $_GET['tab'] ?? 'conversaciones';
$e = function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Bot WhatsApp — Gokywebs</title>
<style>
/* Grises neutros, no azul saturado: el color queda libre para significar algo
   (verde = plata, ámbar = te toca, rojo = se enfrió). Antes todo era azul y
   ningún acento se destacaba porque competía con el fondo. */
:root {
  --bg:#12141a; --card:#191c23; --card-2:#20242d; --line:#2b3039; --line-fuerte:#3a404c;
  /* --tenue llegaba a 3.81:1 contra el fondo y los títulos de bloque son de
     10.5px: abajo del 4.5:1 que pide AA para texto chico. */
  --tx:#e6e8ec; --dim:#9096a1; --tenue:#868d99;
  --ac:#25d366; --ac-tenue:#132d1e;
  --warn:#e0a33a; --warn-tenue:#2e2513;
  --bad:#e06a5f; --bad-tenue:#2e1a18;
  --info:#5b9cf0; --info-tenue:#16243d;
}
* { box-sizing:border-box; margin:0; }
body { background:var(--bg); color:var(--tx); font:15px/1.5 system-ui, sans-serif; min-height:100vh; }
a { color:var(--ac); text-decoration:none; }
.wrap { max-width:880px; margin:0 auto; padding:24px 16px 80px; }
/* Conversaciones necesita ancho: lista + chat lado a lado. */
.wrap--wide { max-width:1560px; }
h1 { font-size:20px; margin-bottom:4px; } h1 span { color:var(--ac); }
h2 { font-size:16px; margin:22px 0 10px; }
.sub { color:var(--dim); font-size:13px; margin-bottom:18px; }
.tabs { display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:20px; }
.tabs .pill { margin-left:auto; }
.tabs-aparte { color:var(--dim); font-size:12.5px; border:0; padding:0 2px; }
.tabs-aparte:hover { color:var(--tx); }
.tabs a { padding:7px 13px; border:1px solid transparent; border-radius:8px; color:var(--dim); font-size:13.5px; }
.tabs a:hover { background:var(--card); color:var(--tx); }
.tabs a.on { background:var(--card-2); color:var(--tx); border-color:var(--line-fuerte); font-weight:500; }
.card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:18px; margin-bottom:16px; }
label { display:block; font-size:13px; color:var(--dim); margin:12px 0 4px; }
input[type=text], input[type=password], input[type=number], textarea, select {
  width:100%; background:var(--bg); color:var(--tx); border:1px solid var(--line); border-radius:8px; padding:9px 11px; font:inherit; }
textarea { resize:vertical; min-height:64px; }
button { background:var(--ac); color:#08210f; border:0; border-radius:8px; padding:10px 18px; font:inherit; font-weight:700; cursor:pointer; }
button.sec { background:transparent; color:var(--dim); border:1px solid var(--line); font-weight:400; }
button.bad { background:transparent; color:var(--bad); border:1px solid var(--bad); font-weight:400; }
.fila { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.pill { display:inline-block; padding:2px 9px; border-radius:99px; font-size:11.5px; }
.pill.on { background:var(--ac-tenue); color:var(--ac); }
.pill.off { background:var(--bad-tenue); color:var(--bad); }
.pill.pausa { background:var(--warn-tenue); color:var(--warn); }
/* El tipo de web es contexto, no un estado: va sin fondo para no sumar otra
   mancha de color a una fila que ya tiene nombre, hora y último mensaje. */
.pill.tipo { background:transparent; border:1px solid var(--line-fuerte); color:var(--tenue); }
.ok { color:var(--ac); font-size:13px; margin-bottom:10px; }
table { width:100%; border-collapse:collapse; font-size:14px; }
td, th { padding:8px 6px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; }
th { color:var(--dim); font-weight:400; font-size:12px; }
code { background:var(--bg); padding:2px 7px; border-radius:6px; font-size:13px; word-break:break-all; }
.chat { display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto; padding:6px 2px; }
.burb { max-width:82%; padding:9px 13px; border-radius:12px; white-space:pre-wrap; font-size:14px; }
.burb.cliente { align-self:flex-start; background:var(--card-2); border-bottom-left-radius:4px; }
.burb.bot { align-self:flex-end; background:#1c4030; border-bottom-right-radius:4px; }
/* Lo que escribiste vos se distingue de lo que escribió el bot: mismo lado,
   distinto tono, más un borde que lo separa sin gritar. */
.burb.humano { align-self:flex-end; background:#2c2a1a; border:1px solid #4a4326; border-bottom-right-radius:4px; }
.burb.sistema { align-self:center; background:transparent; border:1px dashed var(--line-fuerte); color:var(--dim); font-size:12px; text-align:center; max-width:92%; }
.media-box { margin-top:6px; display:flex; flex-direction:column; align-items:flex-start; gap:4px; }
.burb.bot .media-box, .burb.humano .media-box { align-items:flex-end; }
.media-img { display:block; max-width:220px; max-height:220px; border-radius:8px; cursor:zoom-in; object-fit:cover; }
.media-audio { max-width:260px; height:36px; }
.media-video { display:block; max-width:260px; max-height:260px; border-radius:8px; }
.media-nombre { font-size:12.5px; color:var(--dim); word-break:break-all; }
.media-dl { display:block; font-size:12.5px; font-weight:600; color:var(--ac); text-decoration:underline; }
.grabando { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:9px; padding:9px 12px; background:var(--bad-tenue); border:1px solid var(--bad); border-radius:10px; }
/* Sin esto la caja de grabación se ve SIEMPRE: el atributo hidden del HTML se
   apoya en un `display:none` de la hoja del navegador, y cualquier display
   declarado por nosotros le gana. Pasó en producción: el panel rojo "Enviar
   nota de voz" quedaba puesto sin haber grabado nada. */
.grabando[hidden] { display:none; }
.grabando-punto { width:10px; height:10px; border-radius:50%; background:var(--bad); flex-shrink:0; animation:latido 1.1s ease-in-out infinite; }
.grabando #grabandoTiempo { font-variant-numeric:tabular-nums; font-weight:700; font-size:15px; }
.grabando button { padding:7px 14px; font-size:13px; }
@keyframes latido { 0%,100% { opacity:1 } 50% { opacity:.25 } }
@media (prefers-reduced-motion: reduce) { .grabando-punto { animation:none } }
.meta { font-size:11px; color:var(--dim); }
.meta-editado { color:var(--dim); font-style:italic; }
/* El lápiz aparece al pasar por encima de la burbuja: en el celular, donde no
   hay hover, queda siempre visible (ver el @media de abajo). */
.burb-editar { background:none; border:0; padding:0 0 0 8px; margin:0; font-size:11px; font-weight:600;
    color:var(--ac); cursor:pointer; text-decoration:underline; opacity:0; transition:opacity .15s; }
.burb:hover .burb-editar, .burb-editar:focus { opacity:1; }
.burb-edit-box { margin-top:8px; display:flex; flex-direction:column; gap:6px; }
.burb-edit-box textarea { width:100%; min-width:240px; font:inherit; font-size:13.5px; padding:7px 9px;
    border-radius:8px; border:1px solid var(--ac); background:var(--bg); color:var(--tx); resize:vertical; }
.burb-edit-acciones { display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
.burb-edit-acciones button { font-size:12px; padding:4px 10px; }
.burb-edit-aviso { font-size:10.5px; color:var(--dim); flex:1 1 140px; min-width:0; }
.ej-fila { display:grid; grid-template-columns: 1fr 220px 150px 34px; gap:8px; margin-bottom:8px; align-items:center; }
.campo-etiqueta { width:150px; flex-shrink:0; }
.campo-etiqueta--ancha { width:340px; }

/* ===== EMBUDO: números rápidos arriba, detalle compacto abajo ===== */
.embudo-kpis { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-bottom:16px; }
.embudo-kpi { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; min-width:0; }
.embudo-kpi strong { display:block; color:var(--tx); font-size:25px; line-height:1.15; }
.embudo-kpi span { display:block; color:var(--dim); font-size:11.5px; margin-top:4px; }
.embudo-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
.embudo-grid .card { margin-bottom:0; }
.embudo-fila { display:grid; grid-template-columns:minmax(125px,1fr) minmax(90px,2fr) 48px; gap:10px; align-items:center; padding:7px 0; border-bottom:1px solid var(--line); }
.embudo-fila:last-child { border-bottom:0; }
.embudo-etiqueta { color:var(--dim); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.embudo-barra { height:7px; overflow:hidden; border-radius:99px; background:var(--bg); }
.embudo-barra > span { display:block; height:100%; min-width:2px; border-radius:inherit; background:var(--ac); }
.embudo-numero { text-align:right; font-variant-numeric:tabular-nums; font-weight:700; }
.embudo-conversiones { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.embudo-conversiones .pill { background:var(--ac-tenue); color:var(--ac); padding:5px 10px; }

/* ===== CONVERSACIONES: tres listas a la izquierda, chat a la derecha ===== */
.conv-split { display:grid; grid-template-columns: minmax(0,420px) minmax(430px,1fr); gap:14px; align-items:stretch; }
.conv-nav { display:flex; flex-direction:column; gap:3px; min-width:0; overflow-y:auto; scrollbar-width:thin; }
/* Sin caja ni borde: nueve cajas apiladas eran nueve rectángulos compitiendo.
   La seleccionada se marca con fondo y una barra a la izquierda, como una
   lista de carpetas de mail. */
.conv-nav-btn { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%;
    background:transparent; border:0; border-left:2px solid transparent; border-radius:0 7px 7px 0;
    padding:8px 10px; color:var(--dim); font:inherit; font-size:13px; font-weight:500; text-align:left; cursor:pointer; }
.conv-nav-btn:hover { background:var(--card-2); color:var(--tx); }
.conv-nav-btn.on { background:var(--card-2); color:var(--tx); border-left-color:var(--ac); font-weight:600; }
.conv-nav-btn:focus-visible { outline:2px solid var(--info); outline-offset:-2px; }

/* Encabezado de cada bloque: son tres tareas distintas, no nueve items sueltos. */
.conv-nav-titulo { margin:12px 0 3px; padding:0 10px; font-size:10.5px; font-weight:600;
    letter-spacing:.06em; text-transform:uppercase; color:var(--tenue); }
.conv-nav-titulo:first-of-type { margin-top:8px; }

/* "Sin leer" es un filtro, no un estado: se separa del resto con una línea. */
.conv-nav-btn--filtro { margin-bottom:4px; padding-bottom:10px; border-bottom:1px solid var(--line); border-radius:0; }
.conv-nav-btn--filtro.on { border-left-color:var(--info); }

/* Un cero no es una tarea: se apaga para que lo lleno resalte solo. */
.conv-nav-btn .conv-cuenta { background:var(--card-2); color:var(--tenue); }
.conv-nav-btn:not(.tiene) { color:var(--tenue); }
.conv-nav-btn:not(.tiene) .conv-cuenta { background:transparent; color:var(--tenue); font-weight:400; }

/* Los tres que piden acción tienen color; el resto queda neutro a propósito. */
.conv-nav-btn[data-grupo="pago"].tiene { color:var(--ac); }
.conv-nav-btn[data-grupo="pago"].tiene .conv-cuenta { background:var(--ac-tenue); color:var(--ac); }
.conv-nav-btn[data-grupo="pago"].on { border-left-color:var(--ac); }
.conv-nav-btn[data-grupo="muestra"].tiene { color:var(--warn); }
.conv-nav-btn[data-grupo="muestra"].tiene .conv-cuenta { background:var(--warn-tenue); color:var(--warn); }
.conv-nav-btn[data-grupo="muestra"].on { border-left-color:var(--warn); }
.conv-nav-btn[data-grupo="presentadas_48"].tiene { color:var(--bad); }
.conv-nav-btn[data-grupo="presentadas_48"].tiene .conv-cuenta { background:var(--bad-tenue); color:var(--bad); }
.conv-nav-btn[data-grupo="presentadas_48"].on { border-left-color:var(--bad); }
.conv-nav-btn[data-grupo="no_leidos"].tiene { color:var(--info); }
.conv-nav-btn[data-grupo="no_leidos"].tiene .conv-cuenta { background:var(--info-tenue); color:var(--info); }

/* WhatsApp e Instagram comparten la misma lista: se distinguen con esta
   etiqueta chica al lado del nombre, no con una columna aparte. */
.conv-chips { display:flex; align-items:center; gap:6px; margin-top:7px; }
.conv-chip { flex:0 0 auto; display:inline-flex; align-items:center; gap:5px; height:30px; padding:0 11px;
    border:1px solid var(--line); border-radius:99px; background:var(--card-2); color:var(--dim);
    font:inherit; font-size:12px; font-weight:700; letter-spacing:.03em; cursor:pointer; }
.conv-chip:hover { border-color:var(--line-fuerte); color:var(--tx); }
.conv-chip.on { background:var(--info); border-color:var(--info); color:#0b1424; }
.conv-chip--sl.on, .conv-chip--rta.on { background:var(--info); border-color:var(--info); }
.conv-chip-n { min-width:17px; padding:0 5px; border-radius:99px; background:var(--info); color:#0b1424;
    font-size:10.5px; font-weight:800; text-align:center; }
.conv-chip.on .conv-chip-n { background:rgb(0 0 0 / .22); color:#0b1424; }
.conv-chip--sl:not(.tiene) .conv-chip-n, .conv-chip--rta:not(.tiene) .conv-chip-n { background:var(--card); color:var(--tenue); }
.conv-chips-mas { position:relative; margin-left:auto; }
.conv-chip--mas { padding:0 9px; font-size:11px; }
.conv-chips-panel { position:absolute; right:0; top:calc(100% + 5px); z-index:30; min-width:172px; padding:5px;
    background:var(--card-2); border:1px solid var(--line-fuerte); border-radius:10px;
    box-shadow:0 12px 28px rgb(0 0 0 / .45); display:flex; flex-direction:column; gap:2px; }
.conv-chips-panel[hidden] { display:none; }
.conv-chip-item { width:100%; text-align:left; padding:7px 9px; border:0; border-radius:7px;
    background:transparent; color:var(--dim); font:inherit; font-size:12.5px; cursor:pointer; }
.conv-chip-item:hover { background:var(--card); color:var(--tx); }
.conv-chip-item.on { background:var(--info); color:#0b1424; font-weight:600; }

.tabs-mini { display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-bottom:10px; }
.tabs-menu { position:relative; }
.tabs-menu-btn { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border:1px solid var(--line);
    border-radius:8px; background:var(--card); color:var(--dim); font:inherit; font-size:13px; cursor:pointer; }
.tabs-menu-btn:hover, .tabs-menu-btn[aria-expanded="true"] { border-color:var(--line-fuerte); color:var(--tx); }
.tabs-menu-panel { position:absolute; right:0; top:calc(100% + 5px); z-index:40; min-width:180px; padding:5px;
    background:var(--card-2); border:1px solid var(--line-fuerte); border-radius:10px;
    box-shadow:0 12px 28px rgb(0 0 0 / .45); display:flex; flex-direction:column; gap:2px; }
.tabs-menu-panel[hidden] { display:none; }
.tabs-menu-panel a { padding:8px 10px; border-radius:7px; color:var(--dim); font-size:13px; }
.tabs-menu-panel a:hover { background:var(--card); color:var(--tx); }
.tabs-menu-panel a.on { background:var(--card); color:var(--tx); font-weight:600; }

.estado-tag { display:inline-block; flex-shrink:0; padding:1px 6px; border-radius:5px; font-size:10px;
    font-weight:800; letter-spacing:.04em; vertical-align:middle; background:var(--card-2); color:var(--dim); }
.estado-tag--de { background:var(--info-tenue); color:var(--info); }
.estado-tag--d { background:var(--warn-tenue); color:var(--warn); }
.estado-tag--rta { background:var(--ac-tenue); color:var(--ac); }
.estado-tag--cod { background:rgba(255,255,255,.07); color:var(--dim); letter-spacing:.06em; }
.conv-item-globo { min-width:19px; height:19px; padding:0 6px; border-radius:99px; background:var(--info);
    color:#0b1424; font-size:11px; font-weight:800; display:inline-flex; align-items:center;
    justify-content:center; flex-shrink:0; }

.canal-tag { display:inline-block; flex-shrink:0; padding:1px 7px; border-radius:99px; font-size:10.5px; font-weight:700; letter-spacing:.02em; vertical-align:middle; }
.canal-tag--whatsapp { background:var(--ac-tenue); color:var(--ac); }
.canal-tag--instagram { background:#2c1f33; color:#c99ad8; }

/* La pestaña de conversaciones ocupa exactamente la ventana: el único scroll
   está adentro de la lista y del chat, nunca en la página. Así, embebida en el
   admin, no hay dos scrolls peleándose ni header que estorbe al bajar. */
/* dvh y no vh: en el celular la barra de direcciones del navegador se suma al
   100vh, así que el bloque de responder quedaba abajo del borde visible. dvh
   mide el viewport que se ve de verdad; el vh queda de respaldo para navegadores
   viejos que no lo soportan. */
body.conv-full { height:100vh; height:100dvh; overflow:hidden; display:flex; flex-direction:column; }
body.conv-full .wrap { flex:1; min-height:0; display:flex; flex-direction:column; padding-top:8px; padding-bottom:10px; }
/* Cuatro listas más el chat no entran en 1560: acá se usa todo el ancho real.
   El width:100% no sobra: .wrap tiene margin:0 auto, y en un contenedor flex
   los márgenes automáticos le ganan al stretch, así que sin ancho explícito la
   caja se encoge al contenido y sobra pantalla vacía a los costados. */
body.conv-full .wrap--wide { max-width:none; width:100%; }
body.conv-full .conv-split { flex:1; min-height:0; }

body.conv-full .tabs { margin-bottom:10px; }
body.conv-full .conv-main { padding:11px 14px; }
body.conv-full .conv-head { padding-bottom:8px; margin-bottom:8px; }
body.conv-full #responder { margin-top:8px; }
body.conv-full #respTexto { min-height:44px; }
body.conv-full #respEstado { margin-top:4px; }

.conv-list { background:var(--card); border:1px solid var(--line); border-radius:12px; display:flex; flex-direction:column; min-height:0; overflow:hidden; }
.conv-list-head { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:9px 12px; border-bottom:1px solid var(--line); font-size:12.5px; color:var(--dim); letter-spacing:.02em; flex-shrink:0; }
.conv-filtros { padding:9px; border-bottom:1px solid var(--line); flex-shrink:0; }
.conv-busqueda-fila { display:flex; align-items:center; gap:7px; }
.conv-busqueda { flex:1; min-width:0; width:100%; height:36px; margin:0; padding:7px 10px; border:1px solid var(--line); border-radius:8px; background:var(--bg); color:var(--tx); font:inherit; font-size:12.5px; }
.conv-busqueda::placeholder { color:var(--dim); }
.conv-busqueda:focus { border-color:var(--ac); outline:0; }
.conv-fecha-toggle { display:inline-flex; align-items:center; justify-content:center; gap:5px; flex:none; height:36px; padding:0 10px; border:1px solid var(--line); border-radius:8px; background:var(--card-2); color:var(--dim); font:inherit; font-size:12px; font-weight:700; cursor:pointer; }
.conv-fecha-toggle:hover, .conv-fecha-toggle.on { border-color:var(--ac); color:var(--tx); }
.conv-fecha-toggle.filtrando { background:var(--info); border-color:var(--info); color:#0b1424; }
.conv-fecha-cuenta { min-width:18px; padding:1px 5px; border-radius:99px; background:rgb(255 255 255 / .16); font-size:10px; text-align:center; }
.conv-fecha-panel { margin-top:8px; padding-top:8px; border-top:1px solid var(--line); }
.conv-fecha-panel[hidden] { display:none; }
.conv-fecha-chips { display:flex; flex-wrap:wrap; gap:6px; max-height:108px; overflow-y:auto; }
.conv-fecha-chip { padding:5px 8px; border:1px solid var(--line); border-radius:99px; background:var(--card-2); color:var(--dim); font:inherit; font-size:11px; cursor:pointer; }
.conv-fecha-chip:hover { border-color:var(--line-fuerte); color:var(--tx); }
.conv-fecha-chip.on { background:var(--info); border-color:var(--info); color:#0b1424; }
.conv-busqueda-fila--mensajes { margin-top:7px; }
.conv-busqueda-fila--mensajes .conv-busqueda { background:var(--card-2); }
.conv-item-mensaje-linea { font-size:12.5px; color:var(--dim); margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-item-mensaje-quien { color:var(--tenue); font-weight:600; }
mark.conv-resaltado { background:var(--ac-tenue); color:var(--ac); padding:0 1px; border-radius:3px; font-style:normal; }
.conv-fecha-chip span { margin-left:3px; opacity:.75; font-size:10px; }
.conv-fecha-vacio { margin:0; color:var(--dim); font-size:11px; }
.conv-cuenta { background:var(--card-2); color:var(--dim); border-radius:20px; padding:1px 8px; font-size:11.5px; font-weight:700; }
.conv-list[data-grupo="muestra"] .conv-list-head { color:var(--ac); }
.conv-item .pill.espera { background:#3a2f10; color:var(--warn); }
.conv-items { flex:1 1 0; min-height:0; overflow-y:auto; }
.conv-item { display:flex; align-items:flex-start; gap:9px; padding:11px 13px; border-bottom:1px solid var(--line); color:var(--tx); border-left:3px solid transparent; cursor:pointer; }
.conv-item:last-child { border-bottom:0; }
.conv-item:hover { background:var(--card-2); }
.conv-item.on { background:var(--card-2); border-left-color:var(--ac); }
.conv-item-foto { width:34px; height:34px; border-radius:50%; object-fit:cover; flex-shrink:0; border:1px solid var(--line); }
.conv-item-body { flex:1 1 0; min-width:0; }
.conv-item-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.conv-item-nombre { display:flex; align-items:center; gap:6px; min-width:0; overflow:hidden; }
.conv-item-tel { font-weight:700; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-item-hora { font-size:11px; color:var(--dim); flex-shrink:0; }
.conv-item-ult { font-size:12.5px; color:var(--dim); margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-item-pills { margin-top:5px; display:flex; gap:5px; flex-wrap:wrap; }
/* Sin abrir: alcanza con el texto en blanco y la barra azul. Antes el fondo
   entero cambiaba de color y media lista parecía estar en otro estado. */
.conv-item.sin-leer { border-left-color:var(--info); }
.conv-item.sin-leer .conv-item-tel { color:#fff; font-weight:700; }
.conv-item.sin-leer .conv-item-ult { color:var(--tx); }
.conv-item.sin-leer .conv-item-hora { color:var(--info); font-weight:600; }
.conv-item.sin-leer.on { border-left-color:var(--ac); }
.conv-item-punto { width:7px; height:7px; border-radius:50%; background:var(--info); flex-shrink:0; }
.conv-item-derecha { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.conv-sub-header { padding:11px 13px 5px; font-size:10.5px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--tenue); background:var(--card); position:sticky; top:0; z-index:1; }
.conv-list[data-grupo="pago"] .conv-list-head { color:var(--ac); }
.conv-item.pago-avisado { border-left-color:var(--ac); background:var(--ac-tenue); }
.conv-list[data-grupo="presentadas_48"] .conv-list-head { color:var(--bad); }
.conv-vacio { padding:16px; color:var(--dim); font-size:13px; }

.conv-main { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; min-width:0; min-height:0; }
.conv-main .chat { flex:1 1 0; min-height:0; max-height:none; overflow-y:auto; }
.conv-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; padding-bottom:10px; border-bottom:1px solid var(--line); margin-bottom:10px; }
.conv-head form { display:inline; }
.conv-acciones { gap:6px; flex-shrink:0; }
.conv-acciones button { padding:5px 10px; font-size:12px; font-weight:500; border-radius:6px; }
/* Resetear y Eliminar no se pueden deshacer, así que dejan de verse como los
   demás: quedan tenues y sin borde hasta que pasás por encima. En rojo fijo
   competían por la atención con Archivar, que es inofensivo. */
.conv-acciones button.bad { color:var(--tenue); border-color:transparent; }
.conv-acciones button.bad:hover, .conv-acciones button.bad:focus-visible { color:var(--bad); border-color:var(--bad); }
.conv-acciones-sep { width:1px; align-self:stretch; margin:2px 3px; background:var(--line); flex-shrink:0; }
/* En pantalla grande las acciones están siempre a la vista; el botón "⋯" solo
   existe para plegarlas en el celular, donde ocupaban 90px de alto y le comían
   el espacio al chat. Antes esto era un <details>, que en desktop se tragaba
   los botones: el navegador oculta su contenido con un mecanismo interno que
   NO se ve mirando el `display` del hijo. Un toggle explícito es predecible. */
.conv-acciones-toggle { display:none; }
.conv-acciones-wrap > .conv-acciones { display:flex; }
.tel-copiar { background:transparent; border:0; border-bottom:1px dashed var(--line); border-radius:0; color:var(--dim); font:inherit; font-weight:400; padding:0 1px; cursor:pointer; }
.tel-copiar:hover { color:var(--ac); border-bottom-color:var(--ac); }
.tel-copiar.copiado { color:var(--ac); border-bottom-color:transparent; }
.conv-nada { display:flex; align-items:center; justify-content:center; height:100%; color:var(--dim); font-size:14px; text-align:center; }
.conv-volver { display:none; }

/* Sin lugar para tres listas al lado: se apilan en una sola columna que
   scrollea, pero el chat sigue a la derecha. Nunca se va abajo del todo. */
/* Sin lugar para cuatro al lado, se acomodan en dos filas de dos. */
@media (max-width: 1650px) {
    .conv-split { grid-template-columns: minmax(0,380px) minmax(0,1fr); }
}

@media (max-width: 1150px) {
    .conv-split { grid-template-columns: minmax(0,320px) minmax(0,1fr); }
}

/* Sin hover no hay forma de descubrir el lápiz: en touch va siempre visible. */
@media (hover: none) {
    .burb-editar { opacity:.75; }
}
@media (max-width: 900px) {
    /* Una columna: o las listas, o el chat — como WhatsApp en el celular.
       Solo se ve uno de los dos por vez (el otro queda display:none más
       abajo), así que los dos comparten la MISMA fila en vez de una fila
       "auto" para la lista y otra 1fr para el chat: con "auto" la lista
       se achicaba al alto de la barra de búsqueda/chips y #listaItems (que
       adentro es flex:1) quedaba con 0px reales, aunque el HTML de los
       chats sí estuviera — se veían los filtros y nada más abajo. */
    .conv-split { grid-template-columns:1fr; grid-template-rows: minmax(0,1fr); }
    .conv-split > .conv-list, .conv-split > .conv-main { grid-row: 1; grid-column: 1; }
    /* En horizontal los títulos de bloque no funcionan: quedan como columnas de
       texto vertical entre los botones. Se ocultan y su lugar lo toma un
       separador fino, que agrupa igual sin ocupar ancho. Los botones pasan a
       ser fichas con borde: la barra lateral que marca el activo en desktop no
       se lee en una fila. */
    .conv-split.has-sel .conv-list { display:none; }
    .conv-split:not(.has-sel) .conv-main { display:none; }
    .conv-volver { display:inline-block; margin-bottom:8px; }
}

/* ── Mobile: el panel se usa desde el celular, así que todo tiene que entrar ── */
@media (max-width: 720px) {
    .wrap { padding: 14px 12px 60px; }
    .ej-fila { grid-template-columns: 1fr; }
    .tabs { overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none; padding-bottom: 2px; }
    .tabs::-webkit-scrollbar { display: none; }
    .tabs a { white-space: nowrap; padding: 8px 12px; }
    .card { padding: 14px; border-radius: 10px; }
    .chat { max-height: 52vh; }
    .burb { max-width: 90%; }
    /* Tabla de conversaciones: se apila en fichas, nada de scroll horizontal. */
    table, tbody, tr, td { display: block; width: 100%; }
    thead { display: none; }
    tr { border: 1px solid var(--line); border-radius: 10px; padding: 10px; margin-bottom: 10px; }
    td { border: 0; padding: 3px 0; }
    td:first-child { font-size: 16px; font-weight: 700; }
    /* 16px evita que iOS haga zoom al enfocar un campo. */
    button, input[type=text], input[type=password], input[type=number], textarea, select { min-height: 42px; font-size: 16px; }
    .fila > form { flex: 1 1 auto; }
    .fila > form button { width: 100%; }
    .embudo-kpis { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .embudo-grid { grid-template-columns:1fr; }
    /* flex-shrink:0 sin ancho hace que la fila de botones (Apagar/Crear boceto/
       Archivar/Resetear/Eliminar) nunca doble línea: se estira más allá de la
       pantalla y empuja TODA la página a scroll horizontal. Al celular esto se
       ve apenas se abre cualquier chat. */
    .conv-acciones { flex-shrink: 1; width: 100%; }
    .campo-etiqueta { width: 100%; }

    /* El chat es lo único que importa en el celular. Medido: la cabecera con
       las 5 acciones ocupaba 173px y el bloque de responder 215px, así que al
       chat le quedaban 12px de alto para 2958px de mensajes: ilegible. Acá las
       acciones se pliegan detrás de "⋯" y el responder va en una sola fila. */
    .conv-acciones-wrap { position: relative; flex-shrink: 0; }
    .conv-acciones-toggle {
        display: block; cursor: pointer; background: transparent;
        padding: 2px 12px; min-height: 34px; border: 1px solid var(--line); border-radius: 8px;
        color: var(--dim); font-size: 18px; line-height: 1; font-weight: 700;
    }
    .conv-acciones-wrap.abierto .conv-acciones-toggle { border-color: var(--ac); color: var(--ac); }
    .conv-acciones-wrap > .conv-acciones { display: none; }
    .conv-acciones-wrap.abierto > .conv-acciones {
        display: flex;
        position: absolute; right: 0; top: calc(100% + 6px); z-index: 20;
        width: max-content; max-width: 78vw; flex-direction: column; align-items: stretch;
        background: var(--card); border: 1px solid var(--line); border-radius: 10px;
        padding: 8px; box-shadow: 0 10px 26px rgba(0,0,0,.5);
    }
    .conv-acciones-wrap > .conv-acciones button { width: 100%; }

    .conv-head { align-items: center; gap: 8px; padding-bottom: 7px; margin-bottom: 7px; }
    .conv-head .meta { display: block; font-size: 11px; }
    .conv-main { padding: 10px 12px; }
    .conv-volver { margin-bottom: 5px; font-size: 13px; }

    /* Que el chat nunca quede aplastado: si algo de arriba o de abajo crece,
       el que cede es ese bloque, no el chat. */
    .conv-main .chat { flex: 1 1 auto; min-height: 42vh; }
    #responder { margin-top: 8px; }
    #responder .fila { flex-wrap: nowrap; gap: 7px; }
    #respTexto { flex: 1 1 auto; min-width: 0; min-height: 42px; }
    #respGrabar { flex: 0 0 auto; padding: 0 13px; }
    #respEnviar { flex: 0 0 auto; padding: 0 15px; }
    #respEstado { margin-top: 4px; font-size: 11px; }
    .grabando { margin-top: 7px; padding: 7px 10px; gap: 8px; }
    .grabando button { min-height: 36px; padding: 6px 11px; font-size: 12.5px; }
}
/* Embebido en el admin: sin aire de más arriba. */
body.embed .wrap { padding-top: 10px; }
/* Embebidos, el alto del body TIENE que salir del contenido y no de la ventana:
   con min-height:100vh el body mide lo que mide el iframe, el iframe mide lo que
   reporta el body, y cada vuelta sumaba unos píxeles hasta el infinito. */
body.embed { min-height: 0; }
</style>
</head>
<body class="<?= $embed ? 'embed ' : '' ?><?= $tab === 'conversaciones' ? 'conv-full' : '' ?>">
<div class="wrap <?= $tab === 'conversaciones' ? 'wrap--wide' : '' ?>">

<?php if (!$logueado): ?>
    <h1>Bot WhatsApp — <span>Gokywebs</span></h1>
    <p class="sub">Panel interno</p>
    <div class="card" style="max-width:360px">
        <?php if (!empty($errorLogin)) echo '<p style="color:var(--bad);margin-bottom:8px">' . $e($errorLogin) . '</p>'; ?>
        <form method="post">
            <label>Clave</label>
            <input type="password" name="clave" autofocus>
            <div style="margin-top:12px"><button>Entrar</button></div>
        </form>
    </div>
<?php else: ?>

    <?php if (!$embed): ?>
        <h1>Bot WhatsApp — <span>Gokywebs</span> <span class="pill <?= !empty($cfg['activo']) ? 'on' : 'off' ?>"><?= !empty($cfg['activo']) ? 'ACTIVO' : 'APAGADO' ?></span></h1>
        <p class="sub">Motor propio sobre la Cloud API · <a href="admin.php?salir=1">salir</a></p>
    <?php endif; ?>

    <?php
    $navTabs = [
        'conversaciones' => 'Conversaciones',
        'embudo'         => 'Embudo',
        'probar'         => 'Probar',
        'textos'         => 'Textos',
        'entrenamiento'  => 'Entrenamiento',
        'estado'         => 'Estado',
    ];
    ?>
    <div class="tabs-mini">
        <?php if ($embed): ?>
            <span class="pill <?= !empty($cfg['activo']) ? 'on' : 'off' ?>"><?= !empty($cfg['activo']) ? 'BOT ACTIVO' : 'BOT APAGADO' ?></span>
            <a href="admin.php?embed=0" target="_blank" rel="noopener" class="tabs-aparte">Abrir aparte ↗</a>
        <?php endif; ?>
        <div class="tabs-menu">
            <button type="button" class="tabs-menu-btn" id="tabsMenuBtn" aria-expanded="false" aria-controls="tabsMenuPanel">
                <?= $e($navTabs[$tab] ?? 'Menú') ?> <span aria-hidden="true">▾</span>
            </button>
            <nav class="tabs-menu-panel" id="tabsMenuPanel" hidden>
                <?php foreach ($navTabs as $k => $v): ?>
                    <a href="admin.php?tab=<?= $k ?>" class="<?= $tab === $k ? 'on' : '' ?>"><?= $v ?></a>
                <?php endforeach; ?>
            </nav>
        </div>
    </div>
    <script>
    (function () {
        var btn = document.getElementById('tabsMenuBtn'), panel = document.getElementById('tabsMenuPanel');
        if (!btn || !panel) return;
        btn.addEventListener('click', function () {
            var abrir = panel.hidden;
            panel.hidden = !abrir;
            btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        });
        document.addEventListener('click', function (ev) {
            if (panel.hidden || btn.contains(ev.target) || panel.contains(ev.target)) return;
            panel.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        });
    })();
    </script>

    <?php if (isset($_GET['ok'])) echo '<p class="ok">Guardado.</p>'; ?>
    <?php if (isset($_GET['boceto_ok'])) echo '<p class="ok">Boceto creado: ya aparece en la pestaña Bocetos.</p>'; ?>
    <?php if (isset($_GET['reenvio_ok'])) echo '<p class="ok">Listo: el cliente ya recibió el link de la demo.</p>'; ?>
    <?php if (isset($_GET['reenvio_ventana'])) echo '<p class="ok" style="color:var(--warn)">Pasaron más de 24 h desde su último mensaje, así que WhatsApp no deja mandarlo. Hay que esperar a que escriba, o mandárselo desde tu WhatsApp.</p>'; ?>
    <?php if (isset($_GET['reenvio_error'])) echo '<p class="ok" style="color:var(--bad)">WhatsApp rechazó el envío. Revisá el log en wabot/data/log/.</p>'; ?>
    <?php if (isset($_GET['reenvio_sin_slug'])) echo '<p class="ok" style="color:var(--bad)">Esta conversación no tiene guardado el link de la demo. Presentala de nuevo desde Bocetos.</p>'; ?>
    <?php if (isset($_GET['boceto_error'])) echo '<p class="ok" style="color:var(--bad)">No se pudo crear el boceto: Firestore rechazó el alta. Quedó guardado igual en Estado → "Prediseños que no llegaron a Bocetos". Revisá el log en wabot/data/log/.</p>'; ?>

    <?php if ($tab === 'embudo'): ?>
        <?php
        $embudo = function_exists('wabot_embudo_resumen') ? (array)wabot_embudo_resumen() : [];
        $numeros = function ($valores, $campoAlternativo = '') {
            $out = [];
            foreach ((array)$valores as $k => $v) {
                if (is_array($v)) {
                    $v = $v['total'] ?? $v['conversaciones'] ?? ($campoAlternativo !== '' ? ($v[$campoAlternativo] ?? 0) : 0);
                }
                if (is_numeric($v)) $out[(string)$k] = (int)$v;
            }
            return $out;
        };
        $canales = $numeros($embudo['canales'] ?? []);
        $fases   = $numeros($embudo['fases'] ?? []);
        $eventos = $numeros($embudo['eventos'] ?? []);
        $total   = (int)($embudo['total'] ?? $embudo['total_conversaciones'] ?? $eventos['lead_recibido'] ?? array_sum($canales));
        $precio  = (int)($eventos['precio_dado'] ?? 0);
        $muestra = (int)($eventos['muestra_aceptada'] ?? 0);
        $derivado = (int)($eventos['derivado'] ?? $eventos['handoff_creado'] ?? $eventos['handoff_solicitado'] ?? 0);

        $conversiones = (array)($embudo['conversiones'] ?? []);
        $precioAMuestra = isset($conversiones['precio_a_muestra']) && is_numeric($conversiones['precio_a_muestra'])
            ? (float)$conversiones['precio_a_muestra'] : ($precio > 0 ? $muestra * 100 / $precio : 0);
        $muestraADerivacionRaw = $conversiones['muestra_a_derivacion'] ?? $conversiones['muestra_a_handoff'] ?? null;
        $muestraADerivacion = is_numeric($muestraADerivacionRaw)
            ? (float)$muestraADerivacionRaw : ($muestra > 0 ? $derivado * 100 / $muestra : 0);

        $etiquetasCanal = ['whatsapp' => 'WhatsApp', 'instagram' => 'Instagram'];
        $etiquetasFase = [
            'nuevo' => 'Nuevos', 'menu' => 'Calificando', 'algo_diferente' => 'Por entender',
            'desempate_turnos' => 'Definiendo turnos', 'desempate_cursos' => 'Definiendo cursos',
            'desempate_comercio' => 'Definiendo comercio', 'desempate_hibrido' => 'Definiendo objetivo',
            'sistema_brief' => 'Brief de sistema',
            'precio' => 'Precio dado', 'prediseno' => 'Pidiendo datos', 'prediseno_ref' => 'Pidiendo referencia',
            'prediseno_wsp' => 'Pidiendo WhatsApp', 'derivado' => 'Derivados',
        ];
        $etiquetasEvento = [
            'precio_dado' => 'Precio dado', 'muestra_ofrecida' => 'Demo ofrecida',
            'muestra_aceptada' => 'Demo aceptada', 'seguimiento_enviado' => 'Seguimiento enviado',
            'seguimiento_respondido' => 'Seguimiento respondido', 'sistema_calificado' => 'Sistema calificado',
            'lead_recibido' => 'Lead recibido', 'handoff_solicitado' => 'Pablo solicitado',
            'handoff_creado' => 'Derivado a Pablo', 'handoff_rechazado' => 'Derivación evitada',
            'humano_responde' => 'Pablo respondió', 'ia_fallback_seguro' => 'Fallback de IA', 'derivado' => 'Derivado',
        ];
        $actualizado = (int)($embudo['actualizado_ts'] ?? 0);
        ?>

        <div class="fila" style="justify-content:space-between;margin-bottom:12px">
            <div>
                <strong>Embudo comercial</strong>
                <p class="meta">Conversaciones almacenadas; cada cliente cuenta una sola vez por hito.</p>
            </div>
            <?php if ($actualizado > 0): ?><span class="meta">Actualizado <?= date('d/m/Y H:i', $actualizado) ?></span><?php endif; ?>
        </div>

        <?php if (!function_exists('wabot_embudo_resumen')): ?>
            <div class="card" style="border-color:var(--warn)">
                <p class="meta" style="color:var(--warn)">La vista ya está lista, pero falta habilitar <code>wabot_embudo_resumen()</code> en el motor.</p>
            </div>
        <?php endif; ?>

        <div class="embudo-kpis">
            <div class="embudo-kpi"><strong><?= number_format($total, 0, ',', '.') ?></strong><span>Conversaciones</span></div>
            <div class="embudo-kpi"><strong><?= number_format($precio, 0, ',', '.') ?></strong><span>Llegaron al precio</span></div>
            <div class="embudo-kpi"><strong><?= number_format($muestra, 0, ',', '.') ?></strong><span>Aceptaron la demo</span></div>
            <div class="embudo-kpi"><strong><?= number_format($derivado, 0, ',', '.') ?></strong><span>Derivadas a Pablo</span></div>
        </div>

        <div class="embudo-grid">
            <div class="card">
                <h2 style="margin-top:0">Por canal</h2>
                <?php $maxCanal = max(1, $canales ? max($canales) : 0); ?>
                <?php if (!$canales): ?><p class="meta">Todavía no hay conversaciones para medir.</p><?php endif; ?>
                <?php foreach ($canales as $k => $n): $ancho = $n > 0 ? round($n * 100 / $maxCanal, 1) : 0; ?>
                    <div class="embudo-fila">
                        <span class="embudo-etiqueta"><?= $e($etiquetasCanal[$k] ?? ucfirst(str_replace('_', ' ', $k))) ?></span>
                        <span class="embudo-barra"><span style="width:<?= $ancho ?>%;<?= $n === 0 ? 'min-width:0' : '' ?>"></span></span>
                        <span class="embudo-numero"><?= number_format($n, 0, ',', '.') ?></span>
                    </div>
                <?php endforeach; ?>
                <div class="embudo-conversiones">
                    <span class="pill">Precio → demo: <?= number_format($precioAMuestra, 1, ',', '.') ?>%</span>
                    <span class="pill">Demo → Pablo: <?= number_format($muestraADerivacion, 1, ',', '.') ?>%</span>
                </div>
            </div>

            <div class="card">
                <h2 style="margin-top:0">Fase actual</h2>
                <?php $maxFase = max(1, $fases ? max($fases) : 0); ?>
                <?php if (!$fases): ?><p class="meta">Sin fases registradas.</p><?php endif; ?>
                <?php foreach ($fases as $k => $n): $ancho = $n > 0 ? round($n * 100 / $maxFase, 1) : 0; ?>
                    <div class="embudo-fila">
                        <span class="embudo-etiqueta" title="<?= $e($k) ?>"><?= $e($etiquetasFase[$k] ?? ucfirst(str_replace('_', ' ', $k))) ?></span>
                        <span class="embudo-barra"><span style="width:<?= $ancho ?>%;<?= $n === 0 ? 'min-width:0' : '' ?>"></span></span>
                        <span class="embudo-numero"><?= number_format($n, 0, ',', '.') ?></span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="card" style="grid-column:1 / -1">
                <h2 style="margin-top:0">Hitos de venta</h2>
                <?php $maxEvento = max(1, $eventos ? max($eventos) : 0); ?>
                <?php if (!$eventos): ?><p class="meta">Sin eventos registrados.</p><?php endif; ?>
                <?php foreach ($eventos as $k => $n): $ancho = $n > 0 ? round($n * 100 / $maxEvento, 1) : 0; ?>
                    <div class="embudo-fila">
                        <span class="embudo-etiqueta" title="<?= $e($k) ?>"><?= $e($etiquetasEvento[$k] ?? ucfirst(str_replace('_', ' ', $k))) ?></span>
                        <span class="embudo-barra"><span style="width:<?= $ancho ?>%;<?= $n === 0 ? 'min-width:0' : '' ?>"></span></span>
                        <span class="embudo-numero"><?= number_format($n, 0, ',', '.') ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

    <?php elseif ($tab === 'estado'): ?>
        <div class="card">
            <div class="fila" style="justify-content:space-between">
                <div>
                    <strong>Bot <?= !empty($cfg['activo']) ? 'activo' : 'apagado' ?></strong>
                    <p class="meta">Apagado: registra los mensajes pero no contesta nada.</p>
                </div>
                <form method="post"><input type="hidden" name="accion" value="toggle_activo">
                    <button class="<?= !empty($cfg['activo']) ? 'bad' : '' ?>"><?= !empty($cfg['activo']) ? 'Apagar' : 'Encender' ?></button>
                </form>
            </div>
        </div>
        <div class="card">
            <div class="fila" style="justify-content:space-between">
                <div>
                    <strong>Notificaciones</strong>
                    <p class="meta" id="pushEstado">Te avisan al celular y a la compu cuando entra un mensaje que tenés que contestar vos (los SL), aunque tengas el panel cerrado.</p>
                </div>
                <div class="fila" style="gap:.5rem">
                    <button type="button" class="sec" id="pushActivar">Activar acá</button>
                    <button type="button" class="sec" id="pushProbar">Probar</button>
                </div>
            </div>
            <?php if (!wabot_push_configurado()): ?>
                <p class="meta" style="color:#b45309">Falta subir <code>config/service-account.json</code> al server.</p>
            <?php elseif (wabot_push_vapid() === ''): ?>
                <p class="meta" style="color:#b45309">Falta <code>WABOT_FCM_VAPID</code> en <code>config/wabot-config.php</code>: Firebase → Configuración del proyecto → Cloud Messaging → Certificados push web.</p>
            <?php else: ?>
                <p class="meta"><?= count(wabot_push_tokens()) ?> dispositivo(s) registrado(s). Hay que activarlo una vez en cada uno.</p>
            <?php endif; ?>
        </div>
        <div class="card">
            <div class="fila" style="justify-content:space-between">
                <div>
                    <strong>Exportar chats</strong>
                    <p class="meta">Descarga un .txt con todas las conversaciones que tuvieron actividad en los últimos días, charla completa.</p>
                </div>
                <a href="admin.php?accion=export_chats&dias=7"><button type="button" class="sec">Últimos 7 días</button></a>
            </div>
        </div>
        <div class="card">
            <div class="fila" style="justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div>
                    <strong>Chats de un día en .txt</strong>
                    <p class="meta">Descarga los chats que ARRANCARON ese día, charla completa.</p>
                </div>
                <form method="get" action="admin.php" class="fila" style="gap:8px">
                    <input type="hidden" name="accion" value="imprimir_chats">
                    <input type="date" name="fecha" value="<?= date('Y-m-d') ?>" required style="width:auto;background:var(--bg);color:var(--tx);border:1px solid var(--line);border-radius:8px;padding:9px 11px;font:inherit">
                    <button type="submit" class="sec">Descargar</button>
                </form>
            </div>
        </div>
        <?php $fallados = array_values(array_filter(wabot_muestras_listar(), function ($m) { return empty($m['lead']); })); ?>
        <?php if ($fallados): ?>
        <div class="card" style="border-color:var(--bad)">
            <h2 style="margin-top:0;color:var(--bad)">Prediseños que no llegaron a Bocetos</h2>
            <p class="meta" style="margin-bottom:10px">El cliente pasó los datos pero Firestore rechazó el alta, así que el boceto no se creó. Están acá para que no se pierdan: cargalos a mano desde el chat.</p>
            <?php foreach ($fallados as $m): ?>
                <div style="border-top:1px solid var(--line);padding:9px 0">
                    <strong><?= $e($m['nombre'] ?? '') ?: 'Sin nombre' ?></strong>
                    <span class="meta"><?= $e(wabot_formatear_tel($m['tel'])) ?> · <?= date('d/m/Y H:i', (int)$m['ts']) ?></span>
                    <a href="admin.php?tab=conversaciones&ver=<?= $e($m['tel']) ?>">ver chat</a>
                    <p class="meta" style="margin:4px 0 0"><?= $e($m['descripcion']) ?> · Colores: <?= $e($m['colores']) ?></p>
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <div class="card">
            <h2 style="margin-top:0">Qué código está corriendo</h2>
            <label>Sello de versión</label>
            <code><?= $e(wabot_version()) ?></code>
            <p class="meta" style="margin-top:6px">
                Es un hash del contenido del motor. Cambia solo cada vez que se publica algo.
                Para saber si el servidor tiene lo último, comparalo con el de tu máquina:
                <code>php -r "require 'wabot/lib.php'; echo wabot_version();"</code>
                — si los dos números coinciden, producción está al día.
            </p>
            <p class="meta">También queda anotado en cada línea del log, así que se puede saber
            qué código atendió una conversación puntual sin tener que acordarse de qué se subió ese día.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Datos para configurar el webhook en Meta</h2>
            <label>Callback URL</label>
            <code>https://gokywebs.com/wabot/webhook.php</code>
            <label>Verify token</label>
            <code><?= $e(WABOT_VERIFY_TOKEN) ?></code>
            <label>Campos del webhook a suscribir</label>
            <code>messages</code> y <code>smb_message_echoes</code> en WhatsApp (el segundo hace que el bot se calle cuando contestás vos desde la app) · <code>messages</code> en Instagram
            <label>Estado de credenciales</label>
            <?php $secretos = count(wabot_app_secrets()); ?>
            <p class="meta">
                Token de Meta: <?= WABOT_META_TOKEN === 'COMPLETAR' ? '<span style="color:var(--bad)">falta</span>' : '<span style="color:var(--ac)">cargado</span>' ?> ·
                Phone Number ID: <?= WABOT_PHONE_NUMBER_ID === 'COMPLETAR' ? '<span style="color:var(--bad)">falta</span>' : '<span style="color:var(--ac)">cargado</span>' ?> ·
                Gemini: <?= WABOT_GEMINI_KEY === 'COMPLETAR' ? '<span style="color:var(--bad)">falta</span>' : '<span style="color:var(--ac)">cargado</span>' ?> ·
                Instagram: <?= wabot_ig_activo() ? '<span style="color:var(--ac)">cargado</span>' : '<span style="color:var(--dim)">apagado</span>' ?>
            </p>
            <?php if ($secretos === 0): ?>
                <p class="meta" style="color:var(--bad);margin-top:8px">
                    <strong>App secret: sin validar firma.</strong> Con la app publicada, cualquiera que
                    conozca esta URL puede mandarle mensajes inventados al bot y hacerle escribir a
                    números arbitrarios desde tu número. Cargá <code>WABOT_APP_SECRET</code>.
                </p>
            <?php elseif ($secretos === 1 && wabot_ig_activo()): ?>
                <p class="meta" style="color:var(--warn);margin-top:8px">
                    App secret: 1 clave cargada. Con Instagram encendido hacen falta <strong>las dos</strong>
                    (la de la app de Meta y la de la app de Instagram), separadas por coma: cada canal
                    firma con la suya y el que no coincida va a quedar rechazado.
                </p>
            <?php else: ?>
                <p class="meta" style="color:var(--ac);margin-top:8px">
                    App secret: <?= $secretos ?> clave<?= $secretos > 1 ? 's' : '' ?> cargada<?= $secretos > 1 ? 's' : '' ?>, la firma se valida.
                </p>
            <?php endif; ?>
        </div>

    <?php elseif ($tab === 'textos'): ?>
        <form method="post">
        <input type="hidden" name="accion" value="guardar_textos">
        <div class="card">
            <h2 style="margin-top:0">Apertura</h2>
            <label>Primer mensaje (menú)</label><textarea name="menu" rows="4"><?= $e($cfg['menu']) ?></textarea>
            <label>Qué es cada una (si pregunta)</label><textarea name="def_tipos" rows="3"><?= $e($cfg['def_tipos']) ?></textarea>
            <label>Algo diferente</label><textarea name="contame" rows="2"><?= $e($cfg['contame']) ?></textarea>
            <label>Ya contó qué ofrece, pero falta definir el objetivo</label><textarea name="aclarar_objetivo" rows="2"><?= $e($cfg['aclarar_objetivo'] ?? '') ?></textarea>
            <label>Pregunta de desempate para cursos</label><textarea name="desempate_cursos" rows="3"><?= $e($cfg['desempate_cursos']) ?></textarea>
            <label>Pregunta de desempate para turnos (peluquerías, consultorios, canchas…)</label><textarea name="desempate_turnos" rows="3"><?= $e($cfg['desempate_turnos'] ?? '') ?></textarea>
            <label>Pregunta de desempate para comercios (ferreterías, kioscos, locales…)</label><textarea name="desempate_comercio" rows="3"><?= $e($cfg['desempate_comercio'] ?? '') ?></textarea>
            <label>Pregunta para trabajos/productos a medida (cortinas, toldos, aberturas, muebles…)</label><textarea name="desempate_hibrido" rows="3"><?= $e($cfg['desempate_hibrido'] ?? '') ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Precio</h2>
            <label>Plantilla del mensaje de precio ({desc}, {precio} y {link} se reemplazan)</label>
            <textarea name="msg_precio" rows="3"><?= $e($cfg['msg_precio']) ?></textarea>
            <label>Mismo mensaje, pero cuando ya se presentó la web con el pitch (sin repetir {desc}, que el cliente ya leyó)</label>
            <textarea name="msg_precio_tras_pitch" rows="3"><?= $e($cfg['msg_precio_tras_pitch'] ?? '') ?></textarea>
            <label>Igual para catálogo: precio tras el pitch, sin repetir {desc}</label>
            <textarea name="msg_precio_catalogo_tras_pitch" rows="3"><?= $e($cfg['msg_precio_catalogo_tras_pitch'] ?? '') ?></textarea>
            <label>Segundo mensaje: el ofrecimiento del prediseño (llega aparte, unos segundos después)</label>
            <textarea name="msg_prediseno_oferta" rows="2"><?= $e($cfg['msg_prediseno_oferta'] ?? '') ?></textarea>
            <?php foreach ($cfg['tipos'] as $t => $d): ?>
                <div class="fila" style="margin-top:12px">
                    <strong class="campo-etiqueta"><?= $e($d['label']) ?></strong>
                    <input type="text" name="precio_<?= $t ?>" value="<?= $e($d['precio']) ?>" style="width:110px">
                    <input type="text" name="link_<?= $t ?>" value="<?= $e($d['link']) ?>" style="flex:1;min-width:220px">
                </div>
                <textarea name="desc_<?= $t ?>" rows="2" placeholder="Qué es (reemplaza {desc} en el mensaje del precio)" style="margin-top:4px"><?= $e($d['desc'] ?? '') ?></textarea>
            <?php endforeach; ?>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Prediseño</h2>
            <label>Ofrecimiento (usá {faltan}: se reemplaza por lo que falte — nombre, descripción, colores — uno por renglón)</label><textarea name="prediseno" rows="3"><?= $e($cfg['prediseno']) ?></textarea>
            <label>Falta la descripción</label><textarea name="prediseno_falta_descripcion" rows="2"><?= $e($cfg['prediseno_falta_descripcion']) ?></textarea>
            <label>Faltan los colores</label><textarea name="prediseno_falta_colores" rows="2"><?= $e($cfg['prediseno_falta_colores']) ?></textarea>
            <label>Datos completos (cierra y deriva)</label><textarea name="prediseno_completo" rows="2"><?= $e($cfg['prediseno_completo']) ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Derivación y objeciones</h2>
            <label>Handoff a Pablo</label><textarea name="derivar" rows="2"><?= $e($cfg['derivar']) ?></textarea>
            <label>Handoff cuando pide una llamada</label><textarea name="pide_llamada" rows="2"><?= $e($cfg['pide_llamada'] ?? '') ?></textarea>
            <p class="meta" style="margin-top:-6px">Pedir una llamada, o hablar con una persona, deriva siempre: el bot nunca rechaza una llamada.</p>
            <label>Si escribe de nuevo tras derivar</label><textarea name="espera" rows="2"><?= $e($cfg['espera']) ?></textarea>
            <label>Si escribe de nuevo tras cerrar el prediseño (ahí ya sabe que le escribís vos)</label><textarea name="espera_prediseno" rows="2"><?= $e($cfg['espera_prediseno'] ?? '') ?></textarea>
            <label>Dice que es caro</label><textarea name="caro" rows="2"><?= $e($cfg['caro']) ?></textarea>
            <label>Dice que lo va a pensar</label><textarea name="pensarlo" rows="2"><?= $e($cfg['pensarlo'] ?? '') ?></textarea>
            <label>Lo tiene que hablar con su socio/a</label><textarea name="socio" rows="2"><?= $e($cfg['socio'] ?? '') ?></textarea>
            <label>Ya tiene una web y quiere renovarla</label><textarea name="ya_tengo_web" rows="2"><?= $e($cfg['ya_tengo_web'] ?? '') ?></textarea>
            <label>Empujón suave después de contestar una duda</label><textarea name="cta_muestra" rows="2"><?= $e($cfg['cta_muestra'] ?? '') ?></textarea>
            <label>Cierre sin presión (solo averiguaba / más adelante / sin presupuesto)</label><textarea name="cierre_suave" rows="2"><?= $e($cfg['cierre_suave'] ?? '') ?></textarea>
            <label>Nombra Tienda Nube o similar</label><textarea name="plataformas" rows="2"><?= $e($cfg['plataformas']) ?></textarea>
            <label>No le interesa</label><textarea name="no_interesa" rows="2"><?= $e($cfg['no_interesa']) ?></textarea>
            <label>Mandó algo y no llegó nada (no se pudo bajar el archivo)</label><textarea name="no_texto" rows="2"><?= $e($cfg['no_texto']) ?></textarea>
            <label>Mandó un archivo que sí se guardó pero no se pudo leer</label><textarea name="media_recibida" rows="2"><?= $e($cfg['media_recibida']) ?></textarea>
            <p class="meta" style="margin-top:6px">El segundo es el que sale cuando el archivo quedó descargable en la conversación (un video, un .docx, o una foto con la IA caída): ahí no corresponde decirle que no se pudo abrir, porque lo tenés en el panel.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Sistemas de gestión</h2>
            <p class="meta" style="margin-bottom:8px">No llevan precio fijo: el bot califica la necesidad y Pablo recibe el brief para cotizarlo.</p>
            <label>1. Qué necesita resolver</label><textarea name="sistema_pregunta" rows="2"><?= $e($cfg['sistema_pregunta'] ?? '') ?></textarea>
            <label>2. Cuántas personas lo usarían</label><textarea name="sistema_pregunta_usuarios" rows="2"><?= $e($cfg['sistema_pregunta_usuarios'] ?? '') ?></textarea>
            <label>3. Cómo lo manejan hoy</label><textarea name="sistema_pregunta_actual" rows="2"><?= $e($cfg['sistema_pregunta_actual'] ?? '') ?></textarea>
            <label>Contacto de WhatsApp si el lead viene de Instagram</label><textarea name="sistema_whatsapp" rows="2"><?= $e($cfg['sistema_whatsapp'] ?? '') ?></textarea>
            <label>Número de WhatsApp inválido</label><textarea name="sistema_whatsapp_invalido" rows="2"><?= $e($cfg['sistema_whatsapp_invalido'] ?? '') ?></textarea>
            <label>Cierre cuando ya tiene el brief</label><textarea name="sistema_cierre" rows="2"><?= $e($cfg['sistema_cierre'] ?? '') ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Seguimiento comercial</h2>
            <div class="fila" style="gap:18px;align-items:flex-end">
                <label style="display:flex;align-items:center;gap:7px;margin:0;cursor:pointer">
                    <input type="checkbox" name="seguimiento_activo" value="1" <?= !empty($cfg['seguimiento_activo']) ? 'checked' : '' ?> style="width:auto">
                    Enviar un seguimiento si el cliente queda en silencio
                </label>
                <div>
                    <label>Horas de silencio</label>
                    <input type="number" name="seguimiento_horas" min="0.5" max="22" step="0.5" value="<?= $e((string)($cfg['seguimiento_horas'] ?? 3)) ?>" style="width:110px">
                </div>
                <div>
                    <label>Solo entre las (hora argentina)</label>
                    <input type="number" name="seguimiento_hora_desde" min="0" max="23" step="1" value="<?= $e((string)($cfg['seguimiento_hora_desde'] ?? 8)) ?>" style="width:70px">
                    <span class="meta">y las</span>
                    <input type="number" name="seguimiento_hora_hasta" min="0" max="23" step="1" value="<?= $e((string)($cfg['seguimiento_hora_hasta'] ?? 20)) ?>" style="width:70px">
                </div>
            </div>
            <p class="meta" style="margin-top:8px">Se manda una sola vez y dentro de la ventana permitida por Meta. <code>{nombre}</code> usa el primer nombre si está disponible. Requiere que Hostinger ejecute <code>wabot/seguimiento.php</code> por cron cada 30 minutos.</p>
            <p class="meta" style="margin-top:5px">Fuera de esa franja el seguimiento espera a la mañana siguiente. Única excepción: si esperar dejaría vencer las 24 h de Meta, sale igual — mejor a destiempo que perderlo.</p>
            <?php $cronSeg = function_exists('wabot_seguimiento_estado_cron') ? wabot_seguimiento_estado_cron() : ['ultimo_run_ts'=>0]; ?>
            <p class="meta" style="margin-top:5px">
                Estado del cron: <?= !empty($cronSeg['ultimo_run_ts'])
                    ? 'última ejecución ' . $e(date('d/m/Y H:i', (int)$cronSeg['ultimo_run_ts']))
                      . ' · enviados ' . (int)($cronSeg['enviados'] ?? 0)
                      . ' · fallidos ' . (int)($cronSeg['fallidos'] ?? 0)
                    : 'todavía no se registró ninguna ejecución' ?>
            </p>
            <label>Seguimiento después de dar el precio</label><textarea name="seguimiento_precio" rows="3"><?= $e($cfg['seguimiento_precio'] ?? '') ?></textarea>
            <label>Seguimiento cuando faltan datos</label><textarea name="seguimiento_datos" rows="2"><?= $e($cfg['seguimiento_datos'] ?? '') ?></textarea>
            <label>Seguimiento cuando quedó una pregunta sin contestar</label><textarea name="seguimiento_pregunta" rows="2"><?= $e($cfg['seguimiento_pregunta'] ?? '') ?></textarea>
            <p class="meta" style="margin-top:-6px">{pregunta} se reemplaza por la pregunta que el bot dejó abierta. Si no quedó ninguna, sale el texto de arriba.</p>
            <label>Gancho que se suma a ese seguimiento</label><textarea name="seguimiento_pregunta_gancho" rows="2"><?= $e($cfg['seguimiento_pregunta_gancho'] ?? '') ?></textarea>
            <p class="meta" style="margin-top:-6px">Solo se agrega si todavía no se ofreció la muestra ni se dio el precio.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Demos presentadas</h2>
            <p class="meta" style="margin-bottom:8px">Cuando se aprieta "Presentar" en un boceto del admin, el bot le manda al cliente el link de la demo y el pedido de feedback. Esto controla cuánto tiempo sin confirmar archiva la charla (ver también "Después de presentar la demo" y "Plantillas de WhatsApp" más abajo).</p>
            <div class="fila" style="gap:18px;align-items:flex-end">
                <div>
                    <label>Horas sin confirmar para archivar</label>
                    <input type="number" name="presentados_archivar_horas" min="24" max="720" step="1" value="<?= $e((string)($cfg['presentados_archivar_horas'] ?? 168)) ?>" style="width:110px">
                </div>
            </div>
            <p class="meta" style="margin-top:8px">Usa el mismo cron que el seguimiento (<code>wabot/seguimiento.php</code>).</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Info fija (respuestas a preguntas)</h2>
            <?php foreach ($cfg['info'] as $k => $v): ?>
                <label><?= $e($k) ?><?= $k === 'mantenimiento' ? ' — {precio} y {link} salen del plan de abajo, según el tipo cotizado'
                    : ($k === 'mantenimiento_ambos' ? ' — se usa SOLO si todavía no se cotizó ningún tipo; {precio_landing}/{link_landing}/{precio_otros}/{link_otros} salen del plan de abajo' : '') ?></label>
                <textarea name="info_<?= $e($k) ?>" rows="2"><?= $e($v) ?></textarea>
            <?php endforeach; ?>
            <label>Renovación después del primer año de hosting y dominio</label>
            <textarea name="hosting_renovacion" rows="3"><?= $e($cfg['hosting_renovacion'] ?? '') ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Planes de mantenimiento</h2>
            <p class="meta" style="margin-bottom:8px">Opcional para el cliente: actualizaciones, cambios mensuales y soporte. El bot elige el plan solo, según el tipo de web que haya cotizado.</p>
            <?php
            $etiquetasPlan = ['landing' => 'Landing', 'otros' => 'Todo el resto (turnos, institucional, inmobiliaria, ecommerce, cursos)'];
            foreach (($cfg['mantenimiento_planes'] ?? []) as $k => $plan): ?>
                <div class="fila" style="margin-top:8px">
                    <strong class="campo-etiqueta campo-etiqueta--ancha"><?= $e($etiquetasPlan[$k] ?? $k) ?></strong>
                    <input type="text" name="mant_precio_<?= $e($k) ?>" value="<?= $e($plan['precio']) ?>" style="width:110px">
                    <input type="text" name="mant_link_<?= $e($k) ?>" value="<?= $e($plan['link']) ?>" style="flex:1;min-width:200px">
                </div>
            <?php endforeach; ?>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Tiempos</h2>
            <div class="fila">
                <div><label>Segundos antes de contestar (primer mensaje del cliente)</label><input type="number" name="demora_primer_mensaje" min="0" max="60" value="<?= (int)($cfg['demora_primer_mensaje'] ?? 20) ?>" style="width:100px"></div>
                <div><label>Segundos antes de contestar (resto de la charla)</label><input type="number" name="demora_segundos" min="0" max="60" value="<?= (int)($cfg['demora_segundos'] ?? 10) ?>" style="width:100px"></div>
                <div><label>Segundos entre mensajes (si no va por longitud)</label><input type="number" name="demora_entre_mensajes" min="0" max="15" value="<?= (int)($cfg['demora_entre_mensajes'] ?? 2) ?>" style="width:100px"></div>
            </div>
            <div class="fila" style="margin-top:14px;gap:18px;align-items:flex-end">
                <label style="display:flex;align-items:center;gap:7px;margin:0">
                    <input type="checkbox" name="demora_por_longitud" <?= !empty($cfg['demora_por_longitud']) ? 'checked' : '' ?>>
                    Que cada mensaje tarde segun su largo
                </label>
                <div><label>Velocidad de tipeo (caracteres por segundo)</label><input type="number" name="tipeo_por_segundo" min="5" max="200" value="<?= (int)($cfg['tipeo_por_segundo'] ?? 16) ?>" style="width:100px"></div>
                <div><label>Nunca menos de (segundos)</label><input type="number" step="0.1" name="demora_minima" min="0" max="10" value="<?= $e((string)($cfg['demora_minima'] ?? 2)) ?>" style="width:100px"></div>
                <div><label>Nunca mas de (segundos)</label><input type="number" step="0.1" name="demora_maxima" min="1" max="30" value="<?= $e((string)($cfg['demora_maxima'] ?? 7)) ?>" style="width:100px"></div>
                <div><label>Horas de silencio cuando contestás vos</label><input type="number" name="pausa_horas_humano" value="<?= (int)$cfg['pausa_horas_humano'] ?>" style="width:100px"></div>
                <div><label>Días para resetear una charla vieja</label><input type="number" name="reset_dias" value="<?= (int)$cfg['reset_dias'] ?>" style="width:100px"></div>
            </div>
            <div class="fila" style="margin-top:14px;gap:18px">
                <label class="meta" style="display:flex;align-items:center;gap:7px;cursor:pointer;margin:0">
                    <input type="checkbox" name="leer_imagenes" value="1" <?= !empty($cfg['leer_imagenes']) ? 'checked' : '' ?> style="width:auto">
                    Mirar las fotos que mandan
                </label>
                <label class="meta" style="display:flex;align-items:center;gap:7px;cursor:pointer;margin:0">
                    <input type="checkbox" name="escuchar_audios" value="1" <?= !empty($cfg['escuchar_audios']) ? 'checked' : '' ?> style="width:auto">
                    Escuchar los audios
                </label>
            </div>
            <p class="meta" style="margin-top:6px">El audio se transcribe y el bot contesta como si lo hubieran escrito. La foto se describe (logo, captura de otra web, local, productos) y esa descripción entra a la charla. Si no se puede leer, pide que lo manden por texto.</p>
            <p class="meta" style="margin-top:8px">El "escribiendo…" ya no aparece al instante: se muestra recién cuando la respuesta está lista, así el silencio previo se siente real. El tiempo que tarda la IA en pensar se descuenta de la demora, así que si pensar llevó 3 segundos y pusiste 10, espera solo 7 más. En 0 contesta al toque.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Modelo de IA</h2>
            <p class="meta" style="margin-top:0">El que usa el bot para entender, clasificar y redactar. Los de más abajo entienden mejor los mensajes confusos y se equivocan menos al clasificar el rubro, pero cuestan más por mensaje.</p>
            <select name="gemini_modelo" style="margin-top:10px;max-width:420px">
                <?php $modeloActual = wabot_gemini_modelo($cfg); ?>
                <?php foreach (wabot_gemini_modelos() as $claveModelo => $labelModelo): ?>
                    <option value="<?= $e($claveModelo) ?>" <?= $claveModelo === $modeloActual ? 'selected' : '' ?>><?= $e($labelModelo) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Atribución de anuncios (API de conversiones)</h2>
            <p class="meta" style="margin-top:0">Le avisa a Meta cuándo un clic en un anuncio terminó en algo real: un boceto cerrado o una demo entregada. Sin esto Meta no sabe qué clic sirvió, optimiza hacia un evento que nunca ve y termina mostrando el anuncio a cualquiera — es lo que hacía que la campaña marcara 0 resultados con todo el presupuesto gastado.</p>
            <p class="meta">Los dos datos salen de <strong>Meta Events Manager → tu conjunto de datos → Configuración</strong>. Mientras estén vacíos, no se manda nada.</p>
            <div class="fila" style="margin-top:12px;gap:14px;flex-wrap:wrap">
                <label style="flex:1 1 220px">Identificador del conjunto de datos
                    <input type="text" name="capi_dataset_id" value="<?= $e($cfg['capi_dataset_id'] ?? '') ?>" placeholder="Solo números">
                </label>
                <label style="flex:1 1 260px">Token de acceso
                    <input type="password" name="capi_token" value="" placeholder="<?= trim((string)($cfg['capi_token'] ?? '')) !== '' ? 'Ya cargado — escribí uno nuevo para cambiarlo' : 'Pegá el token acá' ?>" autocomplete="off">
                </label>
            </div>
            <p class="meta" style="margin-top:8px">Estado: <strong><?= (trim((string)($cfg['capi_dataset_id'] ?? '')) !== '' && trim((string)($cfg['capi_token'] ?? '')) !== '') ? 'activo' : 'sin configurar (no se manda nada)' ?></strong></p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Formulario para pedir los datos del prediseño</h2>
            <label style="display:flex;align-items:center;gap:8px;margin:0">
                <input type="checkbox" name="form_activo" <?= !empty($cfg['form_activo']) ? 'checked' : '' ?>>
                Dar el link a /form/ en WhatsApp
            </label>
            <p class="meta" style="margin-top:8px">Apagado (por defecto, momentáneamente), el bot pide esos mismos datos por chat, en un solo mensaje con viñetas — el mecanismo que ya se usa siempre en Instagram, que nunca tiene link posible. Prendido, en WhatsApp el bot vuelve a mandar directo el link al formulario para cargar nombre, negocio, descripción y colores.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Después de presentar la demo</h2>
            <p class="meta" style="margin-top:0">Al presentar, el bot manda los dos mensajes de la demo (link + pedido de feedback). Cualquier respuesta del cliente después de eso —duda, pedido de cambios, que la va a mirar, lo que sea— dispara un único mensaje fijo avisando que el desarrollo lo sigue Pablo, y la charla queda con vos. Si nunca contesta nada, se manda la plantilla de WhatsApp de abajo a las 48 h (solo si la demo salió por acá: si la presentaste por otro medio, esa plantilla no se manda).</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Plantillas de WhatsApp</h2>
            <p class="meta" style="margin-top:0">Son lo único que se puede mandar con la ventana de 24 h cerrada: hace falta que Meta las apruebe primero. Cargá acá el nombre exacto con el que quedaron aprobadas (Business Manager → Plantillas) y el idioma; con eso quedan activas.</p>
            <?php $plantillasLabels = [
                'confirmacion_demo_48h' => 'Seguimiento a las 48 h de presentar la demo, si el cliente nunca contestó',
            ]; ?>
            <?php foreach ($plantillasLabels as $clavePlant => $labelPlant): $p = $cfg['plantillas'][$clavePlant] ?? []; ?>
                <div class="fila" style="margin-top:14px;gap:14px;align-items:flex-end;flex-wrap:wrap">
                    <div style="min-width:280px">
                        <label><?= $e($labelPlant) ?></label>
                        <input type="text" name="plantilla_<?= $e($clavePlant) ?>_nombre" placeholder="nombre_exacto_de_la_plantilla" value="<?= $e((string)($p['nombre'] ?? '')) ?>" style="width:100%">
                    </div>
                    <div><label>Idioma</label><input type="text" name="plantilla_<?= $e($clavePlant) ?>_idioma" value="<?= $e((string)($p['idioma'] ?? 'es_AR')) ?>" style="width:90px"></div>
                    <label style="display:flex;align-items:center;gap:7px;margin:0 0 8px">
                        <input type="checkbox" name="plantilla_<?= $e($clavePlant) ?>_activa" <?= !empty($p['activa']) ? 'checked' : '' ?>>
                        Activa
                    </label>
                </div>
            <?php endforeach; ?>
        </div>
        <button>Guardar textos</button>
        </form>

    <?php elseif ($tab === 'entrenamiento'): ?>
        <form method="post">
        <input type="hidden" name="accion" value="guardar_entrenamiento">
        <div class="card">
            <h2 style="margin-top:0">Cómo escribe el bot</h2>
            <?php $modo = $cfg['modo_redaccion'] ?? 'fijo'; ?>
            <label style="display:flex;gap:9px;align-items:flex-start;margin-top:6px;cursor:pointer">
                <input type="radio" name="modo_redaccion" value="fijo" <?= $modo === 'fijo' ? 'checked' : '' ?> style="width:auto;margin-top:3px">
                <span><strong>Textos fijos</strong><br><span class="meta">Manda exactamente lo que escribiste en la pestaña Textos. Predecible al 100%, pero se nota que es un bot cuando alguien vuelve a escribir.</span></span>
            </label>
            <label style="display:flex;gap:9px;align-items:flex-start;margin-top:12px;cursor:pointer">
                <input type="radio" name="modo_redaccion" value="natural" <?= $modo === 'natural' ? 'checked' : '' ?> style="width:auto;margin-top:3px">
                <span><strong>Redacción natural</strong><br><span class="meta">Las decisiones las toma el bot como siempre, pero escribe con sus palabras adaptándose al cliente. Los precios y links se verifican antes de enviar: si algo no coincide, sale el texto fijo.</span></span>
            </label>
            <label style="display:flex;gap:9px;align-items:flex-start;margin-top:12px;cursor:pointer">
                <input type="radio" name="modo_redaccion" value="agente" <?= $modo === 'agente' ? 'checked' : '' ?> style="width:auto;margin-top:3px">
                <span><strong>Conversación libre</strong><br><span class="meta">La IA lleva la charla: pregunta, indaga y vende sin guion. Los precios y los links no los sabe: los tiene que pedir, y se los damos exactos desde la pestaña Textos, así no puede inventarlos. Derivar y guardar el prediseño también son acciones reales, no frases. Si la IA falla, contesta el bot de siempre. Es el modo más natural y el que mejor entiende a clientes que se explican raro.</span></span>
            </label>
            <label>Cómo querés que suene (opcional)</label>
            <textarea name="indicaciones_estilo" rows="3" placeholder="Ej: tuteá menos, no arranques con 'Perfecto', andá al grano…"><?= $e($cfg['indicaciones_estilo'] ?? '') ?></textarea>
            <p class="meta" style="margin-top:6px">Solo aplica en modo natural. Probalo en la pestaña Probar antes de dejarlo en vivo.</p>
        </div>

        <div class="card">
            <h2 style="margin-top:0">Indicaciones para el clasificador</h2>
            <p class="meta" style="margin-bottom:8px">Acá le das órdenes al bot en tus palabras. No cambia los textos que manda (eso está en Textos): cambia cómo interpreta lo que escribe el cliente. Ejemplo: "si dice que tiene un kiosco o un almacén, tratalo como ecommerce".</p>
            <textarea name="indicaciones" rows="6" placeholder="Una indicación por línea…"><?= $e($cfg['indicaciones']) ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Ejemplos etiquetados</h2>
            <p class="meta" style="margin-bottom:8px">Frases reales de clientes con la acción correcta. Cuantos más cargues, mejor clasifica. La columna info solo aplica a pregunta_info (claves separadas por coma: proceso, pago, plazos, hosting, mantenimiento, carga, logo, marketing, reuniones, tecnologia, otra).</p>
            <div id="ejemplos">
            <?php foreach ($cfg['ejemplos'] as $ej): ?>
                <div class="ej-fila">
                    <input type="text" name="ej_texto[]" value="<?= $e($ej['texto']) ?>" placeholder="frase del cliente">
                    <select name="ej_accion[]">
                        <?php foreach ($ACCIONES as $ac): ?><option value="<?= $ac ?>" <?= $ej['accion'] === $ac ? 'selected' : '' ?>><?= $ac ?></option><?php endforeach; ?>
                    </select>
                    <input type="text" name="ej_info[]" value="<?= $e(implode(',', $ej['info_keys'] ?? [])) ?>" placeholder="info keys">
                    <button type="button" class="bad" onclick="this.parentNode.remove()">×</button>
                </div>
            <?php endforeach; ?>
            </div>
            <button type="button" class="sec" onclick="agregarEj()">+ Agregar ejemplo</button>
        </div>
        <button>Guardar entrenamiento</button>
        </form>

        <div class="card">
            <h2 style="margin-top:0">Lo que aprendió de vos</h2>
            <?php $aprendido = wabot_aprendizaje_humano(15); ?>
            <p class="meta" style="margin-bottom:10px">
                Cada vez que tomás una charla y contestás vos, el bot guarda esa respuesta y se la muestra a la IA
                como ejemplo de cómo vendés. No la copia literal: aprende el tono y el criterio.
                Los precios y los links siguen saliendo de la pestaña Textos, nunca de acá.
                <?php if ($aprendido): ?>Se usan las 10 más recientes.<?php endif; ?>
            </p>
            <?php if (!$aprendido): ?>
                <p class="meta">Todavía no contestaste ninguna charla a mano. Cuando lo hagas, tus respuestas van a aparecer acá.</p>
            <?php else: ?>
                <?php foreach ($aprendido as $i => $par): ?>
                    <div style="border-bottom:1px solid var(--line);padding:9px 0<?= $i >= 10 ? ';opacity:.45' : '' ?>">
                        <div class="meta">Cliente: <?= $e($par['cliente']) ?></div>
                        <div style="font-size:14px;margin-top:3px"><?= $e($par['pablo']) ?></div>
                    </div>
                <?php endforeach; ?>
                <?php if (count($aprendido) > 10): ?>
                    <p class="meta" style="margin-top:9px">Las atenuadas son más viejas y no entran en el prompt.</p>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        <template id="tpl-ej">
            <div class="ej-fila">
                <input type="text" name="ej_texto[]" placeholder="frase del cliente">
                <select name="ej_accion[]"><?php foreach ($ACCIONES as $ac): ?><option value="<?= $ac ?>"><?= $ac ?></option><?php endforeach; ?></select>
                <input type="text" name="ej_info[]" placeholder="info keys">
                <button type="button" class="bad" onclick="this.parentNode.remove()">×</button>
            </div>
        </template>
        <script>
        function agregarEj(){
            document.getElementById('ejemplos').appendChild(document.getElementById('tpl-ej').content.cloneNode(true));
        }
        </script>

    <?php elseif ($tab === 'conversaciones'): ?>
        <?php
        $ver   = $_GET['ver'] ?? '';
        // El link "Ver chat" de un boceto manda el teléfono tal como está en
        // Firestore (con o sin +54/9), que no siempre coincide con la clave real
        // del archivo (el wa_id que manda Meta). wabot_conv_resolver hace el
        // mismo match difuso que ya usa "Presentar": si no encuentra nada,
        // sigue cayendo en el $ver crudo como antes.
        $verMotivo = null;
        $verResuelto = $ver !== '' ? wabot_conv_resolver($ver, $verMotivo) : null;
        $conv     = $ver !== '' ? wabot_conv_load($verResuelto ?? $ver) : null;
        // Abrir el chat lo marca leído antes de armar la lista, para que el
        // contador de Demos/Presentados ya salga descontado en esta misma carga.
        if ($conv) {
            $ultimaFila = end($conv['transcript']);
            $ultimoTs = (int)($ultimaFila['ts'] ?? 0);
            if ($ultimoTs > (int)($conv['panel_visto_ts'] ?? 0)) {
                $conv['panel_visto_ts'] = time();
                wabot_conv_save($conv);
            }
        }
        // La lista la arma lib.php y se pinta por JS: el render inicial y el
        // refresco automático usan exactamente los mismos datos y el mismo código.
        $items = wabot_lista_items();

        $convClave = $conv ? (string)($conv['conversation_key'] ?? $ver) : '';
        $restante = $conv ? wabot_ventana_restante($conv) : 0;
        ?>
        <div class="conv-split <?= $ver !== '' ? 'has-sel' : '' ?>">

            <aside class="conv-list" id="convLista">
                <div class="conv-filtros">
                    <div class="conv-busqueda-fila">
                        <input type="search" class="conv-busqueda" id="convBuscar" placeholder="Buscar nombre, número, código o proyecto…" autocomplete="off" aria-label="Buscar en todos los chats por nombre, número, código o proyecto">
                        <button type="button" class="conv-fecha-toggle" id="convFechaToggle" aria-expanded="false" aria-controls="convFechaPanel">Fecha <span class="conv-fecha-cuenta" id="convFechaCuenta" hidden>0</span></button>
                    </div>
                    <div class="conv-fecha-panel" id="convFechaPanel" hidden>
                        <div class="conv-fecha-chips" id="convFechaChips"></div>
                    </div>
                    <div class="conv-busqueda-fila conv-busqueda-fila--mensajes">
                        <input type="search" class="conv-busqueda" id="convBuscarMensajes" placeholder="Buscar dentro de los mensajes…" autocomplete="off" aria-label="Buscar texto dentro de los mensajes de todas las conversaciones">
                    </div>
                    <div class="conv-chips" id="convChips">
                        <button type="button" class="conv-chip conv-chip--sl" data-grupo="no_leidos" title="Sin leer: el cliente escribió y todavía no abriste el chat.">SL <span class="conv-chip-n" id="cuentaNoLeidos">0</span></button>
                        <button type="button" class="conv-chip" data-grupo="presentados" title="Demo entregada: le mandaste la demo y todavía no contestó nada.">DE</button>
                        <button type="button" class="conv-chip" data-grupo="dei" title="Demo entregada + interesado: le entregaste la demo y contestó algo.">DEI</button>
                        <button type="button" class="conv-chip conv-chip--rta" data-grupo="rta" title="Ya le contestaste vos a mano: queda esperando al cliente.">RTA <span class="conv-chip-n" id="cuentaRta">0</span></button>
                        <button type="button" class="conv-chip" data-grupo="muestra" title="Demos: ya pasaron los datos y falta diseñarles la demo.">D</button>
                        <button type="button" class="conv-chip" data-grupo="interesado_chat" title="Vieron precio + todas las demás conversaciones: la charla que todavía no llegó a nada concreto.">VP · T</button>
                        <div class="conv-chips-mas">
                            <button type="button" class="conv-chip conv-chip--mas" id="convChipsMas" aria-expanded="false" aria-controls="convChipsPanel" title="Más filtros">▾</button>
                            <div class="conv-chips-panel" id="convChipsPanel" hidden>
                                <button type="button" class="conv-chip-item" data-grupo="pago">Pagaron</button>
                                <button type="button" class="conv-chip-item" data-grupo="presentadas_48">Se enfriaron</button>
                                <button type="button" class="conv-chip-item" data-grupo="archivado">Archivados</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="conv-items" id="listaItems"></div>
            </aside>

            <section class="conv-main">
            <?php if ($conv): ?>
                <a href="admin.php?tab=conversaciones" class="conv-volver">← Todas las conversaciones</a>
                <div class="conv-head">
                    <div>
                        <strong><?= $e(wabot_nombre_agenda($conv)) ?: 'Sin nombre' ?></strong>
                        <span class="canal-tag canal-tag--<?= wabot_canal($conv) === 'instagram' ? 'instagram' : 'whatsapp' ?>"><?= wabot_canal($conv) === 'instagram' ? 'IG' : 'WA' ?></span>
                        <span class="meta"><?php if (wabot_canal($conv) === 'instagram'): ?><?php if (!empty($conv['telefono_wsp'])): ?>WhatsApp: <button type="button" class="tel-copiar" data-tel="+<?= $e($conv['telefono_wsp']) ?>" title="Copiar número"><?= $e(wabot_formatear_tel($conv['telefono_wsp'])) ?></button><?php else: ?>sin WhatsApp todavía<?php endif; ?><?php else: ?><button type="button" class="tel-copiar" data-tel="+<?= $e($conv['tel']) ?>" title="Copiar número"><?= $e(wabot_formatear_tel($conv['tel'])) ?></button><?php endif; ?> · fase: <?= $e($conv['fase']) ?><?= $conv['tipo'] ? ' · tipo: ' . $e($conv['tipo']) : '' ?></span>
                        <?php if (!empty($conv['bot_off'])): ?><span class="pill off">bot apagado acá</span><?php endif; ?>
                        <?php if ((int)$conv['pausado_hasta'] > time()): ?><span class="pill pausa">pausado hasta <?= date('d/m H:i', (int)$conv['pausado_hasta']) ?></span><?php endif; ?>
                        <?php if (!empty($conv['handoff_pendiente'])): ?><span class="pill pausa" id="handoffPill">Pablo pendiente</span><?php endif; ?>
                    </div>
                    <div class="conv-acciones-wrap">
                        <button type="button" class="conv-acciones-toggle" aria-expanded="false" title="Acciones">⋯</button>
                    <div class="fila conv-acciones">
                        <form method="post"><input type="hidden" name="accion" value="conv_toggle"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="sec"><?= !empty($conv['bot_off']) ? 'Encender bot acá' : 'Apagar bot acá' ?></button></form>
                        <?php if ((int)$conv['pausado_hasta'] > time()): ?>
                        <form method="post"><input type="hidden" name="accion" value="conv_reanudar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="sec">Reanudar bot</button></form>
                        <?php endif; ?>
                        <?php
                        // El botón va SIEMPRE: un chat puede estar en Muestras y
                        // tener el boceto sin crear (si Firestore rechazó el alta),
                        // que es justo cuando más falta hace cargarlo a mano.
                        $bocetoHecho = !empty($conv['lead_creado']);
                        ?>
                        <form method="post" onsubmit="return confirm(<?= $bocetoHecho
                            ? "'Este chat YA tiene su boceto en Bocetos. Crear otro lo va a duplicar. Seguro?'"
                            : "'Crear el boceto con lo que ya se conversó?'" ?>)">
                            <input type="hidden" name="accion" value="conv_crear_boceto">
                            <input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <?php if ($bocetoHecho): ?><input type="hidden" name="forzar" value="1"><?php endif; ?>
                            <button class="sec"<?= $bocetoHecho ? '' : ' style="border-color:var(--ac);color:var(--ac)"' ?>><?= $bocetoHecho ? 'Rehacer boceto' : '+ Crear boceto' ?></button>
                        </form>
                        <?php
                        // La demo se entrega apretando "Presentar" en Bocetos, pero
                        // muchas salen por otro lado (a mano, por mail, en persona).
                        // Sin esto esas charlas se quedaban para siempre en "Demos
                        // por diseñar" y ensuciaban la cola de trabajo.
                        if (empty($conv['presentado_ts']) && wabot_conv_grupo($conv) === 'muestra'): ?>
                        <form method="post" onsubmit="return confirm('Marcar la demo como entregada?\n\nNo se le manda ningún mensaje al cliente: es para las que ya entregaste por otro medio. Sale de \'Demos por diseñar\' y pasa a \'Demo entregada\'.')">
                            <input type="hidden" name="accion" value="marcar_entregada"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="sec">Ya la entregué</button></form>
                        <?php endif; ?>
                        <?php if (!empty($conv['presentado_ts']) && empty($conv['presentado_confirmado'])): ?>
                        <form method="post"><input type="hidden" name="accion" value="presentado_confirmar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button>Confirmó la demo</button></form>
                        <?php endif; ?>
                        <form method="post"><input type="hidden" name="accion" value="conv_archivar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="sec"><?= !empty($conv['archivado']) ? 'Desarchivar' : 'Archivar' ?></button></form>
                        <span class="conv-acciones-sep" aria-hidden="true"></span>
                        <form method="post" onsubmit="return confirm('Resetear esta conversación?')"><input type="hidden" name="accion" value="conv_reset"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="bad">Resetear</button></form>
                        <form method="post" onsubmit="return confirm('Eliminar esta conversación para siempre? No se puede deshacer.')"><input type="hidden" name="accion" value="conv_eliminar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="bad">Eliminar</button></form>
                    </div>
                    </div>
                </div>

                <div class="chat" id="chat"></div>

                <div id="responder" style="margin-top:12px">
                    <div class="fila">
                        <textarea id="respTexto" rows="2" placeholder="Escribí tu respuesta…" style="flex:1;min-width:200px"></textarea>
                        <?php if (wabot_canal($conv) !== 'instagram'): ?>
                        <button id="respGrabar" class="sec" type="button" title="Grabar una nota de voz">🎤</button>
                        <?php endif; ?>
                        <button id="respEnviar">Enviar</button>
                    </div>
                    <div id="grabando" class="grabando" hidden>
                        <span class="grabando-punto"></span>
                        <span id="grabandoTiempo">0:00</span>
                        <button type="button" id="grabarEnviar">Enviar nota de voz</button>
                        <button type="button" id="grabarCancelar" class="bad">Descartar</button>
                    </div>
                    <p class="meta" id="respEstado" style="margin-top:6px"></p>
                </div>
            <?php else: ?>
                <div class="conv-nada">
                    <?= $items ? 'Elegí una conversación de la izquierda para leerla y responder.' : 'Todavía no hay conversaciones. Cuando alguien le escriba al bot, va a aparecer acá.' ?>
                </div>
            <?php endif; ?>
            </section>
        </div>

        <script>
        const SEL = <?= json_encode($ver) ?>;

        /* ── Lista de la izquierda ── */
        // "No leídos" no es un grupo excluyente como los demás: es una vista que
        // cruza todas las columnas. Entra un chat SOLO si el último mensaje es
        // del cliente — si el bot (o vos) ya contestó, no cuenta como pendiente,
        // aunque nunca hayas abierto esa respuesta.
        const GRUPOS_VALIDOS = new Set(['pago', 'muestra', 'presentadas_48', 'interesado', 'presentados', 'chat', 'archivado']);
        /* Sin leer es una lista de trabajo, no un inbox: solo los chats donde el
           bot dejó de contestar, el cliente respondió igual, y no lo abriste.
           Las tres condiciones juntas, y ninguna alcanza sola:
            - Solo la parte 2 y la cola de demos. Los de la parte 1 los está
              llevando el bot y no necesitan que mires nada.
            - Que el último mensaje sea del cliente: si el bot ya le contestó,
              está atendido.
            - Que no lo hayas abierto desde ese mensaje. */
        const GRUPOS_SIN_LEER = ['pago', 'presentados', 'presentadas_48', 'muestra'];
        function esNoLeido(it) {
            // La regla la resuelve el server (wabot_conv_es_sl): es la MISMA
            // que dispara la notificación push, y con dos copias terminaban
            // diciendo cosas distintas. El cálculo viejo queda de respaldo por
            // si llega un item de una versión anterior sin el campo.
            if (typeof it.sl === 'boolean') return it.sl;
            if (it.grupo === 'archivado') return false;
            if (!GRUPOS_SIN_LEER.includes(it.grupo) && !it.espera && !it.handoff_pendiente) return false;
            return !!it.no_leido;
        }
        const SUBGRUPOS_NO_LEIDOS = [
            { clave: 'derivado',    titulo: 'Te derivó la consulta' },
            { clave: 'pago',        titulo: 'Pagaron' },
            { clave: 'presentados', titulo: 'Con la demo entregada' },
            { clave: 'muestra',     titulo: 'Con demo por presentar' },
        ];
        function subGrupoNoLeido(it) {
            if (GRUPOS_SIN_LEER.includes(it.grupo)) {
                if (it.grupo === 'presentados' || it.grupo === 'presentadas_48') return 'presentados';
                if (it.grupo === 'pago') return 'pago';
                return 'muestra';
            }
            // Lo que entró por el otro camino: el bot dejó de contestar.
            return 'derivado';
        }
        const listaEl   = document.getElementById('listaItems');
        const listaCaja = document.getElementById('convLista');
        const navBtns   = document.querySelectorAll('[data-grupo]');
        const chipsMasEl = document.getElementById('convChipsMas');
        const chipsPanelEl = document.getElementById('convChipsPanel');
        const buscarChatsEl = document.getElementById('convBuscar');
        const buscarMensajesEl = document.getElementById('convBuscarMensajes');
        let buscarMensajesTimer = null;
        let buscarMensajesToken = 0;
        const fechaToggleEl = document.getElementById('convFechaToggle');
        const fechaPanelEl = document.getElementById('convFechaPanel');
        const fechaChipsEl = document.getElementById('convFechaChips');
        const fechaCuentaEl = document.getElementById('convFechaCuenta');

        const GRUPOS_POR_DEFECTO = ['muestra', 'presentados', 'presentadas_48'];
        let filtrosGuardados = [];
        try { filtrosGuardados = JSON.parse(localStorage.getItem('wabotFiltros') || '[]'); } catch (e) {}
        const filtrosActivos = new Set(Array.isArray(filtrosGuardados) ? filtrosGuardados : []);
        // SL y RTA son "combinables": no reemplazan un filtro de grupo (Demos,
        // Presentados…), se le suman. Elegir "Demos" + "RTA" muestra las demos
        // MÁS todo lo que ya respondiste, no la intersección de las dos cosas.
        const FILTROS_COMBINABLES = new Set(['no_leidos', 'rta']);
        let itemsCache = [];
        let sincronizado = false;
        let firmaLista = '';
        // Persistido: abrir un chat navega a admin.php?ver=… (recarga la página
        // entera), así que sin esto el filtro de fecha se perdía cada vez.
        let fechasGuardadas = [];
        try { fechasGuardadas = JSON.parse(localStorage.getItem('wabotFechas') || '[]'); } catch (e) {}
        const fechasChatsSeleccionadas = new Set(Array.isArray(fechasGuardadas) ? fechasGuardadas : []);
        function guardarFechasSeleccionadas() {
            try { localStorage.setItem('wabotFechas', JSON.stringify([...fechasChatsSeleccionadas])); } catch (e) {}
        }

        function pintarChips() {
            for (const b of navBtns) b.classList.toggle('on', filtrosActivos.has(b.dataset.grupo));
        }

        function alternarFiltro(grupo) {
            if (FILTROS_COMBINABLES.has(grupo)) {
                if (filtrosActivos.has(grupo)) filtrosActivos.delete(grupo);
                else filtrosActivos.add(grupo);
            } else if (filtrosActivos.has(grupo)) {
                filtrosActivos.delete(grupo);
            } else {
                for (const f of [...filtrosActivos]) if (!FILTROS_COMBINABLES.has(f)) filtrosActivos.delete(f);
                filtrosActivos.add(grupo);
            }
            try { localStorage.setItem('wabotFiltros', JSON.stringify([...filtrosActivos])); } catch (e) {}
            pintarChips();
            pintarLista(itemsCache);
        }

        for (const b of navBtns) {
            b.addEventListener('click', () => alternarFiltro(b.dataset.grupo));
        }
        if (chipsMasEl) {
            chipsMasEl.addEventListener('click', () => {
                const abierto = chipsPanelEl.hidden;
                chipsPanelEl.hidden = !abierto;
                chipsMasEl.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            });
            document.addEventListener('click', (ev) => {
                if (chipsPanelEl.hidden) return;
                if (chipsMasEl.contains(ev.target) || chipsPanelEl.contains(ev.target)) return;
                chipsPanelEl.hidden = true;
                chipsMasEl.setAttribute('aria-expanded', 'false');
            });
        }

        function hora(ts) {
            if (!ts) return '';
            const f = new Date(ts * 1000), hoy = new Date();
            const mismoDia = f.toDateString() === hoy.toDateString();
            const dosDig = n => String(n).padStart(2, '0');
            return mismoDia ? dosDig(f.getHours()) + ':' + dosDig(f.getMinutes())
                            : dosDig(f.getDate()) + '/' + dosDig(f.getMonth() + 1);
        }

        function normalizarBusqueda(valor) {
            return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        }

        function fechaInicioInfo(it) {
            const ts = Number(it.inicio_ts || 0);
            if (!ts) return { key: 'sin-fecha', label: 'Sin fecha', orden: -Infinity };
            const f = new Date(ts * 1000);
            const dos = n => String(n).padStart(2, '0');
            return {
                key: f.getFullYear() + '-' + dos(f.getMonth() + 1) + '-' + dos(f.getDate()),
                label: dos(f.getDate()) + '/' + dos(f.getMonth() + 1) + '/' + f.getFullYear(),
                orden: f.getTime(),
            };
        }

        function coincideBusquedaChat(it, termino) {
            const q = normalizarBusqueda(termino);
            if (!q) return true;
            const texto = normalizarBusqueda([
                it.nombre_agenda, it.nombre_negocio, it.nombre,
                it.tel, it.channel_user_id, it.telefono_wsp, it.codigo,
            ].join(' '));
            if (texto.includes(q)) return true;
            const digitos = String(termino).replace(/\D/g, '');
            if (!digitos) return false;
            return [it.tel, it.channel_user_id, it.telefono_wsp]
                .map(v => String(v || '').replace(/\D/g, ''))
                .some(v => v.includes(digitos));
        }

        function esDEI(it) {
            return (it.grupo === 'presentados' || it.grupo === 'presentadas_48') && !!it.con_interes;
        }

        // Resuelto en el server (wabot_conv_rta): mismo criterio en todos lados.
        function esRTA(it) {
            return !!it.rta;
        }

        function cumpleFiltro(it, filtro) {
            if (filtro === 'no_leidos') return esNoLeido(it);
            if (filtro === 'dei') return esDEI(it);
            if (filtro === 'presentados') return (it.grupo === 'presentados' || it.grupo === 'presentadas_48') && !it.con_interes;
            // VP (vieron precio) y T (el resto de las charlas) van juntas en un
            // solo chip: para Pablo son la misma categoría de trabajo, la charla
            // que todavía no llegó a nada concreto.
            if (filtro === 'interesado_chat') {
                const g = GRUPOS_VALIDOS.has(it.grupo) ? it.grupo : 'chat';
                return g === 'interesado' || g === 'chat';
            }
            if (filtro === 'rta') return esRTA(it);
            return (GRUPOS_VALIDOS.has(it.grupo) ? it.grupo : 'chat') === filtro;
        }

        function entraEnGrupoActivo(it) {
            const grupoFiltro = [...filtrosActivos].find(f => !FILTROS_COMBINABLES.has(f));
            const slActivo = filtrosActivos.has('no_leidos');
            const rtaActivo = filtrosActivos.has('rta');
            if (grupoFiltro) {
                return cumpleFiltro(it, grupoFiltro)
                    || (slActivo && esNoLeido(it))
                    || (rtaActivo && esRTA(it));
            }
            if (slActivo || rtaActivo) return (slActivo && esNoLeido(it)) || (rtaActivo && esRTA(it));
            return GRUPOS_POR_DEFECTO.includes(it.grupo);
        }

        function renderFechasChats() {
            const porFecha = new Map();
            for (const it of itemsCache) {
                if (!entraEnGrupoActivo(it)) continue;
                const info = fechaInicioInfo(it);
                const actual = porFecha.get(info.key);
                if (actual) actual.cuenta++;
                else porFecha.set(info.key, { ...info, cuenta: 1 });
            }
            for (const key of [...fechasChatsSeleccionadas]) {
                if (!porFecha.has(key)) fechasChatsSeleccionadas.delete(key);
            }

            fechaChipsEl.innerHTML = '';
            if (!porFecha.size) {
                const vacio = document.createElement('p');
                vacio.className = 'conv-fecha-vacio';
                vacio.textContent = 'No hay fechas en esta lista.';
                fechaChipsEl.appendChild(vacio);
            } else {
                const todas = document.createElement('button');
                todas.type = 'button';
                todas.className = 'conv-fecha-chip' + (!fechasChatsSeleccionadas.size ? ' on' : '');
                todas.dataset.fechaChat = '__todas';
                todas.textContent = 'Todas';
                fechaChipsEl.appendChild(todas);

                const fechas = [...porFecha.values()].sort((a, b) => b.orden - a.orden);
                for (const info of fechas) {
                    const boton = document.createElement('button');
                    boton.type = 'button';
                    boton.className = 'conv-fecha-chip' + (fechasChatsSeleccionadas.has(info.key) ? ' on' : '');
                    boton.dataset.fechaChat = info.key;
                    boton.append(document.createTextNode(info.label));
                    const cuenta = document.createElement('span');
                    cuenta.textContent = info.cuenta;
                    boton.appendChild(cuenta);
                    fechaChipsEl.appendChild(boton);
                }
            }

            const cantidad = fechasChatsSeleccionadas.size;
            fechaCuentaEl.hidden = cantidad === 0;
            fechaCuentaEl.textContent = cantidad;
            fechaToggleEl.classList.toggle('filtrando', cantidad > 0);
        }

        function modoMensajes() {
            return buscarMensajesEl.value.trim().length >= 2;
        }

        function pintarLista(items) {
            itemsCache = items;
            // Mientras se están mostrando resultados de "buscar en los mensajes",
            // el refresco automático de la lista (cada 8 s) no debe pisarlos: esos
            // resultados vienen de otro endpoint y tienen otra forma.
            if (modoMensajes()) return;

            if (!sincronizado) {
                sincronizado = true;
                pintarChips();
            }

            renderFechasChats();
            const termino = buscarChatsEl.value.trim();
            const buscandoGeneral = termino.length > 0;
            const firma = JSON.stringify(items) + '|' + [...filtrosActivos].sort().join(',') + '|' + termino + '|'
                + [...fechasChatsSeleccionadas].sort().join(',');
            if (firma === firmaLista) return;
            firmaLista = firma;

            listaEl.innerHTML = '';
            // Todos los números cuentan lo mismo: cuántas conversaciones hay en
            // ese grupo. Antes Demos y Presentados mostraban cuántas tenían algo
            // sin leer, así que "Demos 0" convivía con tres demos por diseñar y
            // no había forma de saber qué medía cada número.
            const cuentas = { no_leidos: 0, rta: 0, pago: 0, interesado: 0, chat: 0, muestra: 0, presentados: 0, presentadas_48: 0, archivado: 0 };
            let visibles = 0;
            const renderizados = [];   // {it, el} — se agrupan con encabezados solo en "No leídos"

            for (const it of items) {
                const grupo = GRUPOS_VALIDOS.has(it.grupo) ? it.grupo : 'chat';
                cuentas[grupo]++;
                if (esNoLeido(it)) cuentas.no_leidos++;
                if (esRTA(it)) cuentas.rta++;
                if (!buscandoGeneral && !entraEnGrupoActivo(it)) continue;
                if (!buscandoGeneral && fechasChatsSeleccionadas.size && !fechasChatsSeleccionadas.has(fechaInicioInfo(it).key)) continue;
                if (!coincideBusquedaChat(it, termino)) continue;
                visibles++;

                const a = document.createElement('a');
                a.className = 'conv-item' + (it.tel === SEL ? ' on' : '') + (it.no_leido ? ' sin-leer' : '') + (it.grupo === 'pago' ? ' pago-avisado' : '');
                a.href = 'admin.php?tab=conversaciones&ver=' + encodeURIComponent(it.tel);

                if (it.foto) {
                    const foto = document.createElement('img');
                    foto.className = 'conv-item-foto';
                    foto.src = 'admin.php?accion=media&tel=' + encodeURIComponent(it.tel) + '&archivo=' + encodeURIComponent(it.foto) + '&modo=ver';
                    foto.loading = 'lazy';
                    foto.alt = '';
                    a.appendChild(foto);
                }
                const body = document.createElement('div');
                body.className = 'conv-item-body';

                const top = document.createElement('div');
                top.className = 'conv-item-top';
                const nombreBox = document.createElement('span');
                nombreBox.className = 'conv-item-nombre';
                const tel = document.createElement('span');
                tel.className = 'conv-item-tel';
                const contacto = it.canal === 'instagram'
                    ? ('Instagram · ' + (it.channel_user_id || it.tel))
                    : ('+' + (it.channel_user_id || it.tel));
                tel.textContent = it.nombre_agenda || it.nombre || contacto;
                if (it.nombre_agenda || it.nombre) tel.title = contacto;
                nombreBox.appendChild(tel);
                const etiqueta = esDEI(it) ? { txt: 'DEI', cls: 'de', tit: 'Demo entregada · contestó' }
                    : (it.grupo === 'presentados' || it.grupo === 'presentadas_48')
                        ? { txt: 'DE', cls: 'de', tit: 'Demo entregada' }
                        : (it.grupo === 'muestra' ? { txt: 'D', cls: 'd', tit: 'Demo por armar' } : null);
                if (etiqueta) {
                    const tag = document.createElement('span');
                    tag.className = 'estado-tag estado-tag--' + etiqueta.cls;
                    tag.textContent = etiqueta.txt;
                    tag.title = etiqueta.tit;
                    nombreBox.appendChild(tag);
                }
                if (esRTA(it)) {
                    const tagRta = document.createElement('span');
                    tagRta.className = 'estado-tag estado-tag--rta';
                    tagRta.textContent = 'RTA';
                    tagRta.title = 'Ya le contestaste vos a mano: queda esperando al cliente.';
                    nombreBox.appendChild(tagRta);
                }
                if (it.codigo) {
                    const cod = document.createElement('span');
                    cod.className = 'estado-tag estado-tag--cod';
                    cod.textContent = it.codigo;
                    cod.title = 'Código del cliente: el que va en el link del formulario. Se puede buscar acá arriba.';
                    nombreBox.appendChild(cod);
                }
                const derecha = document.createElement('span');
                derecha.className = 'conv-item-derecha';
                const h = document.createElement('span');
                h.className = 'conv-item-hora';
                h.textContent = hora(it.ts);
                derecha.appendChild(h);
                if (it.no_leido) {
                    const globo = document.createElement('span');
                    globo.className = 'conv-item-globo';
                    globo.textContent = it.sin_leer_cuenta > 0 ? it.sin_leer_cuenta : 1;
                    globo.title = 'Mensajes sin leer';
                    derecha.appendChild(globo);
                }
                top.appendChild(nombreBox); top.appendChild(derecha);

                const ult = document.createElement('div');
                ult.className = 'conv-item-ult';
                ult.textContent = (it.quien === 'cliente' ? '' : (it.quien === 'humano' ? 'Vos: ' : 'Bot: ')) + (it.ult || '—');

                const pills = document.createElement('div');
                pills.className = 'conv-item-pills';
                // "bot" es el estado normal y estaba en TODAS las filas: una
                // etiqueta que nunca falta no distingue nada. Solo se muestra
                // cuando el bot NO está llevando la charla, que es la excepción.
                if (it.estado !== 'bot') {
                    const p1 = document.createElement('span');
                    p1.className = 'pill ' + (it.estado === 'apagado' ? 'off' : 'pausa');
                    p1.textContent = it.estado === 'apagado' ? 'bot apagado' : 'lo seguís vos';
                    pills.appendChild(p1);
                }
                if (it.handoff_pendiente || it.espera) {
                    const pe = document.createElement('span');
                    pe.className = 'pill espera';
                    pe.textContent = it.handoff_pendiente ? 'te toca a vos' : 'te espera';
                    pills.appendChild(pe);
                }
                if (it.tipo) {
                    const p2 = document.createElement('span');
                    p2.className = 'pill tipo';
                    p2.textContent = it.tipo;
                    pills.appendChild(p2);
                }

                body.appendChild(top); body.appendChild(ult); body.appendChild(pills);
                a.appendChild(body);
                renderizados.push({ it, el: a });
            }

            const soloSinLeer = filtrosActivos.size === 1 && filtrosActivos.has('no_leidos');
            if (soloSinLeer && !buscandoGeneral) {
                // Presentadas / Demos / Chats normales, en ese orden, cada una con
                // su encabezado — solo si tiene algo, para no listar títulos vacíos.
                for (const sub of SUBGRUPOS_NO_LEIDOS) {
                    const deEsteGrupo = renderizados.filter(r => subGrupoNoLeido(r.it) === sub.clave);
                    if (!deEsteGrupo.length) continue;
                    const encabezado = document.createElement('div');
                    encabezado.className = 'conv-sub-header';
                    encabezado.textContent = sub.titulo + ' (' + deEsteGrupo.length + ')';
                    listaEl.appendChild(encabezado);
                    for (const r of deEsteGrupo) listaEl.appendChild(r.el);
                }
            } else {
                for (const r of renderizados) listaEl.appendChild(r.el);
            }

            const elSinLeer = document.getElementById('cuentaNoLeidos');
            if (elSinLeer) elSinLeer.textContent = cuentas.no_leidos ?? 0;
            const elRta = document.getElementById('cuentaRta');
            if (elRta) elRta.textContent = cuentas.rta ?? 0;
            for (const b of navBtns) {
                if (b.dataset.grupo === 'no_leidos') b.classList.toggle('tiene', (cuentas.no_leidos ?? 0) > 0);
                if (b.dataset.grupo === 'rta') b.classList.toggle('tiene', (cuentas.rta ?? 0) > 0);
            }
            if (!visibles) {
                const filtrando = termino || fechasChatsSeleccionadas.size || filtrosActivos.size;
                listaEl.innerHTML = '<p class="conv-vacio">'
                    + (filtrando ? 'No hay chats que coincidan con los filtros.' : 'Ninguna demo ni charla con demo entregada.')
                    + '</p>';
            }
        }

        buscarChatsEl.addEventListener('input', () => {
            firmaLista = '';
            pintarLista(itemsCache);
        });

        // Resalta, dentro del fragmento que mandó el servidor, la parte que
        // coincide con lo buscado — mismo criterio (sin acentos, sin mayúsculas)
        // que arma el fragmento del lado de PHP.
        function resaltarCoincidencia(texto, termino) {
            const idx = normalizarBusqueda(texto).indexOf(normalizarBusqueda(termino));
            if (idx === -1) return document.createTextNode(texto);
            const frag = document.createDocumentFragment();
            if (idx > 0) frag.appendChild(document.createTextNode(texto.slice(0, idx)));
            const marca = document.createElement('mark');
            marca.className = 'conv-resaltado';
            marca.textContent = texto.slice(idx, idx + termino.length);
            frag.appendChild(marca);
            if (idx + termino.length < texto.length) frag.appendChild(document.createTextNode(texto.slice(idx + termino.length)));
            return frag;
        }

        function pintarResultadosMensajes(items, termino) {
            listaEl.innerHTML = '';
            if (!items.length) {
                const p = document.createElement('p');
                p.className = 'conv-vacio';
                p.textContent = 'Ningún mensaje contiene "' + termino + '".';
                listaEl.appendChild(p);
                return;
            }
            for (const it of items) {
                const a = document.createElement('a');
                a.className = 'conv-item conv-item-mensaje';
                a.href = 'admin.php?tab=conversaciones&ver=' + encodeURIComponent(it.tel);

                const body = document.createElement('div');
                body.className = 'conv-item-body';

                const top = document.createElement('div');
                top.className = 'conv-item-top';
                const nombreBox = document.createElement('span');
                nombreBox.className = 'conv-item-nombre';
                const tel = document.createElement('span');
                tel.className = 'conv-item-tel';
                tel.textContent = it.nombre_agenda || it.nombre_negocio || it.tel;
                const tag = document.createElement('span');
                tag.className = 'canal-tag canal-tag--' + (it.canal === 'instagram' ? 'instagram' : 'whatsapp');
                tag.textContent = it.canal === 'instagram' ? 'IG' : 'WA';
                nombreBox.appendChild(tel); nombreBox.appendChild(tag);
                const cuenta = document.createElement('span');
                cuenta.className = 'conv-item-hora';
                cuenta.textContent = it.total + (it.total === 1 ? ' coincidencia' : ' coincidencias');
                top.appendChild(nombreBox); top.appendChild(cuenta);
                body.appendChild(top);

                for (const c of it.coincidencias) {
                    const linea = document.createElement('div');
                    linea.className = 'conv-item-mensaje-linea';
                    const quien = document.createElement('span');
                    quien.className = 'conv-item-mensaje-quien';
                    quien.textContent = c.quien === 'cliente' ? 'Cliente: ' : (c.quien === 'humano' ? 'Vos: ' : 'Bot: ');
                    linea.appendChild(quien);
                    linea.appendChild(resaltarCoincidencia(c.t, termino));
                    body.appendChild(linea);
                }

                a.appendChild(body);
                listaEl.appendChild(a);
            }
        }

        async function ejecutarBusquedaMensajes() {
            const termino = buscarMensajesEl.value.trim();
            if (termino.length < 2) return;
            const miToken = ++buscarMensajesToken;
            const cargando = document.createElement('p');
            cargando.className = 'conv-vacio';
            cargando.textContent = 'Buscando…';
            listaEl.innerHTML = '';
            listaEl.appendChild(cargando);
            try {
                const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ accion: 'buscar_mensajes', q: termino }) });
                const j = await r.json();
                if (miToken !== buscarMensajesToken) return;   // se siguió escribiendo, esta respuesta ya quedó vieja
                pintarResultadosMensajes(j.items || [], termino);
            } catch (e) {
                if (miToken !== buscarMensajesToken) return;
                const err = document.createElement('p');
                err.className = 'conv-vacio';
                err.textContent = 'No se pudo buscar. Probá de nuevo.';
                listaEl.innerHTML = '';
                listaEl.appendChild(err);
            }
        }

        buscarMensajesEl.addEventListener('input', () => {
            clearTimeout(buscarMensajesTimer);
            if (!modoMensajes()) {
                buscarMensajesToken++;   // descarta cualquier búsqueda en vuelo
                firmaLista = '';
                pintarLista(itemsCache);
                return;
            }
            buscarMensajesTimer = setTimeout(ejecutarBusquedaMensajes, 350);
        });

        fechaToggleEl.addEventListener('click', () => {
            const abrir = fechaPanelEl.hidden;
            fechaPanelEl.hidden = !abrir;
            fechaToggleEl.classList.toggle('on', abrir);
            fechaToggleEl.setAttribute('aria-expanded', abrir ? 'true' : 'false');
            if (abrir) renderFechasChats();
        });
        fechaChipsEl.addEventListener('click', ev => {
            const boton = ev.target.closest('[data-fecha-chat]');
            if (!boton) return;
            const key = boton.dataset.fechaChat;
            if (key === '__todas') fechasChatsSeleccionadas.clear();
            else if (fechasChatsSeleccionadas.has(key)) fechasChatsSeleccionadas.delete(key);
            else fechasChatsSeleccionadas.add(key);
            guardarFechasSeleccionadas();
            firmaLista = '';
            pintarLista(itemsCache);
        });

        document.addEventListener('click', async (ev) => {
            const boton = ev.target.closest('.tel-copiar');
            if (!boton) return;
            const previo = boton.textContent;
            try {
                await navigator.clipboard.writeText(boton.dataset.tel);
            } catch (err) {
                const caja = document.createElement('textarea');
                caja.value = boton.dataset.tel;
                document.body.appendChild(caja);
                caja.select();
                document.execCommand('copy');
                caja.remove();
            }
            boton.textContent = 'copiado ✓';
            boton.classList.add('copiado');
            setTimeout(() => { boton.textContent = previo; boton.classList.remove('copiado'); }, 1200);
        });

        pintarLista(<?= json_encode($items, JSON_UNESCAPED_UNICODE) ?>);

        const scrollListaGuardado = sessionStorage.getItem('wabotListaScroll');
        if (scrollListaGuardado !== null) {
            listaEl.scrollTop = Number(scrollListaGuardado);
            sessionStorage.removeItem('wabotListaScroll');
        }
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('wabotListaScroll', String(listaEl.scrollTop));
        });

        async function refrescarLista() {
            try {
                const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ accion: 'lista' }) });
                const j = await r.json();
                if (j.items) pintarLista(j.items);
            } catch (e) {}
        }
        setInterval(refrescarLista, 8000);
        </script>

        <?php if ($conv): ?>
        <script>
        const TEL = <?= json_encode($convClave) ?>;
        let ventana = <?= (int)$restante ?>;
        const chat = document.getElementById('chat');
        const txt  = document.getElementById('respTexto');
        const btn  = document.getElementById('respEnviar');
        const est  = document.getElementById('respEstado');
        let ultimoRender = '';

        function pintar(lineas) {
            const firma = JSON.stringify(lineas);
            if (firma === ultimoRender) return;
            ultimoRender = firma;
            const abajo = chat.scrollHeight - chat.scrollTop - chat.clientHeight < 60;
            chat.innerHTML = '';
            lineas.forEach((t, i) => { t.__idx = i; });
            for (const t of lineas) {
                const d = document.createElement('div');
                d.className = 'burb ' + t.q;
                d.textContent = t.t;
                if (t.media && t.media.archivo) {
                    const base = 'admin.php?accion=media&tel=' + encodeURIComponent(TEL) + '&archivo=' + encodeURIComponent(t.media.archivo);
                    const caja = document.createElement('div');
                    caja.className = 'media-box';
                    if (t.media.clase === 'imagen') {
                        const img = document.createElement('img');
                        img.className = 'media-img';
                        img.src = base + '&modo=ver';
                        img.loading = 'lazy';
                        img.alt = 'Imagen del chat';
                        img.addEventListener('click', () => window.open(base + '&modo=ver', '_blank', 'noopener'));
                        caja.appendChild(img);
                    } else if (t.media.clase === 'audio') {
                        const audio = document.createElement('audio');
                        audio.className = 'media-audio';
                        audio.controls = true;
                        audio.preload = 'none';
                        audio.src = base + '&modo=ver';
                        caja.appendChild(audio);
                    } else if (t.media.clase === 'video') {
                        const video = document.createElement('video');
                        video.className = 'media-video';
                        video.controls = true;
                        video.preload = 'metadata';
                        video.src = base + '&modo=ver';
                        caja.appendChild(video);
                    } else if (t.media.nombre) {
                        const nom = document.createElement('span');
                        nom.className = 'media-nombre';
                        nom.textContent = t.media.nombre;
                        caja.appendChild(nom);
                    }
                    const a = document.createElement('a');
                    a.className = 'media-dl';
                    a.href = base + (t.media.nombre ? '&nombre=' + encodeURIComponent(t.media.nombre) : '');
                    a.textContent = 'Descargar' + (t.media.bytes ? ' (' + Math.max(1, Math.round(t.media.bytes / 1024)) + ' KB)' : '');
                    a.target = '_blank'; a.rel = 'noopener';
                    caja.appendChild(a);
                    d.appendChild(caja);
                }
                const m = document.createElement('div');
                m.className = 'meta';
                const f = new Date(t.ts * 1000);
                const dd = n => String(n).padStart(2, '0');
                m.textContent = (t.q === 'humano' ? 'vos · ' : '') +
                    dd(f.getDate()) + '/' + dd(f.getMonth() + 1) + ' ' + dd(f.getHours()) + ':' + dd(f.getMinutes());
                if (t.editado) {
                    const ed = document.createElement('span');
                    ed.className = 'meta-editado';
                    ed.textContent = ' · editado';
                    ed.title = 'Corregido en el panel. El cliente recibió el texto original.';
                    m.appendChild(ed);
                }
                const lapiz = document.createElement('button');
                lapiz.type = 'button';
                lapiz.className = 'burb-editar';
                lapiz.textContent = 'Editar';
                lapiz.title = 'Corrige el registro del panel (y el contexto que lee el bot). No cambia lo que ya recibió el cliente.';
                lapiz.addEventListener('click', ev => { ev.stopPropagation(); editarMensaje(t, d); });
                m.appendChild(lapiz);
                d.appendChild(m);
                chat.appendChild(d);
            }
            if (abajo) chat.scrollTop = chat.scrollHeight;
        }

        // Edición en el lugar: la burbuja se convierte en un textarea. Enter
        // guarda, Escape cancela, Shift/Ctrl+Enter hacen salto de línea.
        function editarMensaje(linea, burbuja) {
            if (burbuja.querySelector('.burb-edit-box')) return;
            const original = linea.t || '';
            const caja = document.createElement('div');
            caja.className = 'burb-edit-box';
            const ta = document.createElement('textarea');
            ta.value = original;
            ta.rows = Math.min(8, Math.max(2, original.split('\n').length + 1));
            const acciones = document.createElement('div');
            acciones.className = 'burb-edit-acciones';
            const guardar = document.createElement('button');
            guardar.type = 'button'; guardar.textContent = 'Guardar';
            const cancelar = document.createElement('button');
            cancelar.type = 'button'; cancelar.className = 'sec'; cancelar.textContent = 'Cancelar';
            const aviso = document.createElement('span');
            aviso.className = 'burb-edit-aviso';
            aviso.textContent = 'Solo corrige el registro; el cliente ya recibió el original.';
            acciones.appendChild(guardar); acciones.appendChild(cancelar); acciones.appendChild(aviso);
            caja.appendChild(ta); caja.appendChild(acciones);
            burbuja.appendChild(caja);
            ta.focus();
            ta.selectionStart = ta.selectionEnd = ta.value.length;

            const cerrar = () => caja.remove();
            cancelar.addEventListener('click', cerrar);
            guardar.addEventListener('click', async () => {
                const nuevo = ta.value.trim();
                if (nuevo === '' || nuevo === original) { cerrar(); return; }
                guardar.disabled = true; guardar.textContent = 'Guardando…';
                try {
                    const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ accion: 'editar_mensaje', tel: TEL, idx: linea.__idx, ts: linea.ts, texto: nuevo }) });
                    const j = await r.json();
                    if (j.ok) { cerrar(); ultimoRender = ''; await refrescar(); await refrescarLista(); }
                    else { aviso.textContent = j.error || 'No se pudo guardar.'; guardar.disabled = false; guardar.textContent = 'Guardar'; }
                } catch (e) {
                    aviso.textContent = 'Error de red: ' + e;
                    guardar.disabled = false; guardar.textContent = 'Guardar';
                }
            });
            ta.addEventListener('keydown', e => {
                if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); guardar.click(); }
            });
        }

        function estadoVentana() {
            if (ventana > 0) {
                const h = Math.floor(ventana / 3600), m = Math.floor((ventana % 3600) / 60);
                est.textContent = 'Podés responder por ' + (h > 0 ? h + ' h ' + m + ' min' : m + ' min') + ' más.';
                est.style.color = 'var(--dim)';
                btn.disabled = false;
            } else {
                est.textContent = 'Pasaron más de 24 horas desde su último mensaje: WhatsApp no deja responder hasta que el cliente escriba de nuevo.';
                est.style.color = 'var(--warn)';
                btn.disabled = true;
            }
        }

        async function refrescar() {
            try {
                const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ accion: 'transcript', tel: TEL }) });
                const j = await r.json();
                if (j.transcript) pintar(j.transcript);
                if (typeof j.ventana === 'number') { ventana = j.ventana; estadoVentana(); }
            } catch (e) {}
        }

        async function enviar() {
            const t = txt.value.trim(); if (!t) return;
            btn.disabled = true; est.textContent = 'Enviando…'; est.style.color = 'var(--dim)';
            try {
                const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ accion: 'responder', tel: TEL, texto: t }) });
                const j = await r.json();
                if (j.ok) {
                    txt.value = '';
                    document.getElementById('handoffPill')?.remove();
                    await refrescar(); await refrescarLista();
                    est.textContent = 'Enviado. El bot queda en silencio en este chat.';
                }
                else { est.textContent = j.error || 'No se pudo enviar.'; est.style.color = 'var(--bad)'; btn.disabled = false; }
            } catch (e) { est.textContent = 'Error de red: ' + e; est.style.color = 'var(--bad)'; btn.disabled = false; }
        }

        btn.onclick = enviar;
        // Enter manda. Shift+Enter y Ctrl+Enter hacen salto de línea: el textarea
        // ya inserta el salto solo con Shift, pero con Ctrl no, así que ahí se
        // escribe a mano en la posición del cursor.
        txt.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const ini = txt.selectionStart, fin = txt.selectionEnd;
                txt.value = txt.value.slice(0, ini) + '\n' + txt.value.slice(fin);
                txt.selectionStart = txt.selectionEnd = ini + 1;
                txt.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }
            if (!e.shiftKey) { e.preventDefault(); enviar(); }
        });

        // El menú "⋯" de acciones solo se usa en el celular; en pantalla grande
        // el botón está oculto por CSS y las acciones se ven siempre.
        const accionesWrap = document.querySelector('.conv-acciones-wrap');
        const accionesBtn  = document.querySelector('.conv-acciones-toggle');
        if (accionesWrap && accionesBtn) {
            accionesBtn.addEventListener('click', ev => {
                ev.stopPropagation();
                const abierto = accionesWrap.classList.toggle('abierto');
                accionesBtn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            });
            document.addEventListener('click', ev => {
                if (!accionesWrap.contains(ev.target)) {
                    accionesWrap.classList.remove('abierto');
                    accionesBtn.setAttribute('aria-expanded', 'false');
                }
            });
            document.addEventListener('keydown', ev => {
                if (ev.key === 'Escape') {
                    accionesWrap.classList.remove('abierto');
                    accionesBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        /* ── Notas de voz ──
           WhatsApp acepta el CONTENEDOR y el CODEC, no solo el contenedor:
           mp4 tiene que llevar AAC adentro, y ogg tiene que llevar Opus. No
           es lo mismo.

           Acá estaba el bug por el que las notas de voz no salían: se pedía
           "audio/mp4" a secas y Chrome devuelve "audio/mp4;codecs=opus", o sea
           Opus metido en un MP4. Eso no lo acepta WhatsApp, pero el mime
           recortado sigue diciendo "audio/mp4", así que pasaba la validación
           del servidor y recién fallaba en Meta, sin decir por qué.
           Verificado en Chrome 148: pedir 'audio/mp4' → rec.mimeType queda en
           'audio/mp4;codecs=opus'; pidiendo AAC explícito sale un MP4 real.

           Por eso el codec va SIEMPRE explícito. mp4a.40.2 es AAC-LC, que
           soportan Chrome y Safari; ogg/opus lo tiene Firefox. webm queda
           afuera a propósito: WhatsApp lo rechaza en cualquier codec. */
        const FORMATOS_WSP = [
            'audio/mp4;codecs=mp4a.40.2',   // AAC-LC en MP4 — Chrome y Safari
            'audio/ogg;codecs=opus',        // Firefox
            'audio/aac',
            'audio/mpeg',
        ];

        function formatoGrabable() {
            if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return null;
            for (const f of FORMATOS_WSP) if (MediaRecorder.isTypeSupported(f)) return f;
            return null;
        }

        const btnGrabar = document.getElementById('respGrabar');
        const cajaGrab  = document.getElementById('grabando');
        const tiempoEl  = document.getElementById('grabandoTiempo');
        const btnGrabEnviar = document.getElementById('grabarEnviar');
        const btnGrabCancel = document.getElementById('grabarCancelar');

        let rec = null, micStream = null, trozos = [], recMime = '', cronometro = null, arranqueRec = 0, enviando = false;

        function pintarTiempo() {
            const s = Math.floor((Date.now() - arranqueRec) / 1000);
            tiempoEl.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        }

        /* El stream vive en su propia variable y NO colgado del MediaRecorder:
           si la grabadora falla al construirse, el micrófono ya estaba abierto y
           colgarlo de `rec` dejaba el stream huérfano, con el indicador del
           celular prendido para siempre y sin nada que lo apagara. */
        function soltarMicrofono() {
            if (micStream) {
                micStream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} });
                micStream = null;
            }
        }

        function cerrarGrabacion() {
            clearInterval(cronometro); cronometro = null;
            if (rec && rec.state !== 'inactive') { try { rec.stop(); } catch (e) {} }
            soltarMicrofono();
            rec = null; trozos = [];
            cajaGrab.hidden = true;
            if (btnGrabar) btnGrabar.disabled = false;
        }

        // Salir de la pestaña, cerrarla o navegar a otro chat también apaga el
        // micrófono: nunca queda tomado por una página que ya no se está usando.
        window.addEventListener('pagehide', cerrarGrabacion);
        window.addEventListener('beforeunload', cerrarGrabacion);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && rec) cerrarGrabacion();
        });

        async function empezarGrabacion() {
            const mime = formatoGrabable();
            if (!mime) {
                est.textContent = 'Este navegador no puede grabar en un formato que WhatsApp acepte. Probá con Chrome o Safari actualizados.';
                est.style.color = 'var(--bad)';
                return;
            }
            soltarMicrofono();
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (e) {
                soltarMicrofono();
                est.textContent = e && e.name === 'NotAllowedError'
                    ? 'Falta permiso del micrófono: habilitalo para este sitio y probá de nuevo.'
                    : 'No se pudo abrir el micrófono: ' + (e && e.message ? e.message : e);
                est.style.color = 'var(--bad)';
                return;
            }

            recMime = mime;
            trozos = [];
            enviando = false;
            try {
                rec = new MediaRecorder(micStream, { mimeType: mime });
            } catch (e) {
                // Sin esto el micrófono quedaba abierto: el stream ya existía y
                // la grabadora que iba a "dueñarlo" nunca llegó a construirse.
                soltarMicrofono();
                rec = null;
                est.textContent = 'Este navegador no pudo iniciar la grabación: ' + (e && e.message ? e.message : e);
                est.style.color = 'var(--bad)';
                return;
            }
            // El mime REAL que terminó usando el navegador, no el que pedimos:
            // pueden diferir en el codec, y el codec es justo lo que decide si
            // WhatsApp lo acepta. Mandar el pedido escondía el problema.
            if (rec.mimeType) recMime = rec.mimeType;
            rec.ondataavailable = ev => { if (ev.data && ev.data.size) trozos.push(ev.data); };
            rec.onstop = () => {
                const partes = trozos.slice();
                const enviarlo = enviando;
                cerrarGrabacion();
                if (enviarlo && partes.length) subirAudio(new Blob(partes, { type: recMime }));
            };
            rec.onerror = () => { est.textContent = 'La grabación se cortó por un error del navegador.'; est.style.color = 'var(--bad)'; cerrarGrabacion(); };
            rec.start();

            arranqueRec = Date.now();
            pintarTiempo();
            cronometro = setInterval(pintarTiempo, 500);
            cajaGrab.hidden = false;
            if (btnGrabar) btnGrabar.disabled = true;
            est.textContent = 'Grabando… tocá "Enviar nota de voz" cuando termines.';
            est.style.color = 'var(--dim)';
        }

        async function subirAudio(blob) {
            est.textContent = 'Enviando la nota de voz…';
            est.style.color = 'var(--dim)';
            btn.disabled = true;
            try {
                const fd = new FormData();
                fd.append('accion', 'responder_audio');
                fd.append('tel', TEL);
                // Entero, CON el codec: el servidor necesita verlo para saber
                // si WhatsApp lo va a aceptar. Recortarlo acá era lo que hacía
                // que un mp4/opus pasara todos los controles y muriera en Meta.
                fd.append('mime', recMime || blob.type || '');
                fd.append('audio', blob, 'nota-de-voz');
                const r = await fetch('admin.php', { method: 'POST', body: fd });
                const j = await r.json();
                if (j.ok) {
                    document.getElementById('handoffPill')?.remove();
                    await refrescar(); await refrescarLista();
                    est.textContent = 'Nota de voz enviada. El bot queda en silencio en este chat.';
                    est.style.color = 'var(--dim)';
                } else {
                    est.textContent = j.error || 'No se pudo enviar la nota de voz.';
                    est.style.color = 'var(--bad)';
                }
            } catch (e) {
                est.textContent = 'Error de red al enviar el audio: ' + e;
                est.style.color = 'var(--bad)';
            }
            btn.disabled = ventana <= 0;
        }

        if (btnGrabar) {
            btnGrabar.onclick = empezarGrabacion;
            btnGrabEnviar.onclick = () => { if (rec && rec.state !== 'inactive') { enviando = true; rec.stop(); } };
            btnGrabCancel.onclick = () => {
                if (rec && rec.state !== 'inactive') { enviando = false; rec.stop(); }
                else cerrarGrabacion();
                est.textContent = 'Nota de voz descartada.';
                est.style.color = 'var(--dim)';
            };
            if (!formatoGrabable()) {
                btnGrabar.disabled = true;
                btnGrabar.title = 'Este navegador no puede grabar en un formato que WhatsApp acepte';
            }
        }
        pintar(<?= json_encode(array_values($conv['transcript']), JSON_UNESCAPED_UNICODE) ?>);
        chat.scrollTop = chat.scrollHeight;
        estadoVentana();
        setInterval(refrescar, 5000);
        </script>
        <?php endif; ?>

    <?php elseif ($tab === 'probar'): ?>
        <?php $convT = wabot_conv_load('TEST'); ?>
        <div class="card">
            <div class="fila" style="justify-content:space-between;margin-bottom:10px">
                <div><strong>Chat de prueba</strong> <span class="meta">— habla con el motor real (Gemini incluido), sin mandar nada por WhatsApp.</span></div>
                <form method="post"><input type="hidden" name="accion" value="probar_reset"><button class="sec">Reiniciar charla</button></form>
            </div>
            <?php if (WABOT_GEMINI_KEY === 'COMPLETAR'): ?>
                <p class="meta" style="color:var(--warn);margin-bottom:8px">Falta la API key de Gemini en config/wabot-config.php: el clasificador no va a funcionar y el bot cae al comportamiento de emergencia.</p>
            <?php endif; ?>
            <div class="chat" id="chat">
                <?php foreach ($convT['transcript'] as $t): ?>
                    <div class="burb <?= $e($t['q']) ?>"><?= $e($t['t']) ?></div>
                <?php endforeach; ?>
            </div>
            <div class="fila" style="margin-top:12px">
                <input type="text" id="msj" placeholder="Escribí como si fueras un cliente…" style="flex:1" autofocus>
                <button id="enviar">Enviar</button>
            </div>
            <p class="meta" style="margin-top:8px">fase: <span id="fase"><?= $e($convT['fase']) ?></span><span id="tipo"><?= $convT['tipo'] ? ' · tipo: ' . $e($convT['tipo']) : '' ?></span></p>
        </div>
        <script>
        const chat = document.getElementById('chat'), inp = document.getElementById('msj');
        function burb(q, t, demora) {
            const d = document.createElement('div');
            d.className = 'burb ' + q; d.textContent = t;
            if (demora) {
                const m = document.createElement('div');
                m.className = 'meta';
                m.textContent = t.length + ' caracteres · tarda ' + demora + ' s en escribirse';
                d.appendChild(m);
            }
            chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
        }
        async function enviar() {
            const t = inp.value.trim(); if (!t) return;
            inp.value = ''; burb('cliente', t);
            const esp = document.createElement('div'); esp.className = 'burb bot'; esp.textContent = '…';
            chat.appendChild(esp); chat.scrollTop = chat.scrollHeight;
            try {
                const r = await fetch('admin.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ accion: 'probar', texto: t }) });
                const j = await r.json();
                esp.remove();
                const msgs = j.mensajes || [];
                if (!msgs.length) burb('bot', '(el bot no contesta en esta fase)');
                // Se pintan con la misma pausa real, para ver cómo le llega al cliente.
                const dem = j.demoras || [];
                for (let i = 0; i < msgs.length; i++) {
                    if (i > 0) await new Promise(r => setTimeout(r, (dem[i] || 2) * 1000));
                    burb('bot', msgs[i], dem[i]);
                    chat.scrollTop = chat.scrollHeight;
                }
                document.getElementById('fase').textContent = j.fase || '?';
                document.getElementById('tipo').textContent = j.tipo ? ' · tipo: ' + j.tipo : '';
            } catch (e) { esp.textContent = 'Error: ' + e; }
        }
        document.getElementById('enviar').onclick = enviar;
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') enviar(); });
        chat.scrollTop = chat.scrollHeight;
        </script>
    <?php endif; ?>

<?php endif; ?>
</div>

<?php if ($embed): ?>
<script>
/* Embebido en el admin: le avisamos nuestro alto real para que el iframe crezca
   y no tenga scroll propio. Las pestañas largas (Textos, Entrenamiento) hacen
   scrollear la página del admin; Conversaciones avisa que va a pantalla fija
   (conv-full) y ahí el padre la ajusta a la ventana. Un solo scroll siempre. */
(function () {
    var ultimo = 0;
    var wrap = document.querySelector('.wrap');
    function avisar() {
        var full = document.body.classList.contains('conv-full');
        // Se mide el contenido, no el viewport: scrollHeight crece con el iframe
        // y realimentaba el lazo. El alto de .wrap no depende del alto del marco.
        var alto = full || !wrap ? 0 : Math.ceil(wrap.getBoundingClientRect().bottom + window.scrollY);
        if (!full && Math.abs(alto - ultimo) < 4) return;
        ultimo = alto;
        parent.postMessage({ wabot: true, full: full, alto: alto }, location.origin);
    }
    window.addEventListener('load', avisar);
    window.addEventListener('resize', avisar);
    if (window.ResizeObserver) new ResizeObserver(avisar).observe(document.body);
    document.addEventListener('click', function () { setTimeout(avisar, 60); });
    avisar();
})();
</script>
<script type="module">
/* Notificaciones push del panel.
 *
 * El navegador pide permiso una sola vez por dispositivo y devuelve un token
 * que hay que guardar en el server: es la dirección a la que FCM entrega. Los
 * tokens rotan, así que se refresca en cada carga del panel.
 *
 * Todo esto es opcional: si falta la clave VAPID o el usuario dice que no, el
 * panel sigue funcionando igual y no se rompe nada. */
const VAPID = <?= json_encode(wabot_push_vapid()) ?>;
const estado = document.getElementById('pushEstado');
const btnActivar = document.getElementById('pushActivar');
const btnProbar  = document.getElementById('pushProbar');
if (btnActivar) {

    const decir = (t) => { if (estado) estado.textContent = t; };

    async function registrar(pedirPermiso) {
        if (!VAPID) return decir('Falta la clave VAPID en la config del server.');
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
            return decir('Este navegador no soporta notificaciones.');
        }
        if (Notification.permission === 'denied') {
            return decir('Las notificaciones están bloqueadas para este sitio: habilitalas desde el candado de la barra de direcciones.');
        }
        if (Notification.permission !== 'granted') {
            if (!pedirPermiso) return;   // en la carga automática no se molesta
            if (await Notification.requestPermission() !== 'granted') {
                return decir('No se dio permiso, así que no te van a llegar.');
            }
        }
        try {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
            const { getMessaging, getToken } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');
            const app = initializeApp({
                apiKey: 'AIzaSyC1OLtFB2aqovDA-u07HFhK0cPY-y-ZBqQ',
                authDomain: 'gokywebs-967cd.firebaseapp.com',
                projectId: 'gokywebs-967cd',
                messagingSenderId: '50030976147',
                appId: '1:50030976147:web:9f07245b536a75833a4166'
            });
            // El service worker vive en la raíz: desde /wabot/ no podría abrir
            // el panel al tocar la notificación.
            const sw = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
            const token = await getToken(getMessaging(app), { vapidKey: VAPID, serviceWorkerRegistration: sw });
            if (!token) return decir('Firebase no devolvió un token. Probá recargar.');

            const r = await fetch('admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ accion: 'push_token', token }),
                credentials: 'same-origin'
            }).then(x => x.json());
            decir(r.ok ? 'Listo: este dispositivo va a recibir los avisos. (' + r.dispositivos + ' en total)'
                       : 'No se pudo guardar el dispositivo en el server.');
        } catch (e) {
            decir('No se pudo activar: ' + e.message);
        }
    }

    btnActivar.addEventListener('click', () => registrar(true));
    // Si ya dio permiso antes, se refresca solo el token, sin molestarlo.
    registrar(false);

    btnProbar?.addEventListener('click', async () => {
        decir('Mandando…');
        try {
            const r = await fetch('admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ accion: 'push_probar' }),
                credentials: 'same-origin'
            }).then(x => x.json());
            decir(r.ok ? 'Salió a ' + r.dispositivos + ' dispositivo(s). Fijate si te llegó.'
                       : (r.error || 'No hay ningún dispositivo registrado todavía.'));
        } catch (e) {
            decir('Falló la prueba: ' + e.message);
        }
    });
}
</script>
<?php endif; ?>
</body>
</html>
