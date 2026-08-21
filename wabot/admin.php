<?php
/**
 * wabot/admin.php — panel del bot de WhatsApp.
 * Pestañas: Conversaciones (la de entrada) · Embudo · Probar · Textos · Entrenamiento · Estado.
 * Auth: normalmente entra por el login de Firebase del admin (ver auth.php);
 * la clave de WABOT_ADMIN_PASS queda como respaldo para acceso directo.
 */

require_once __DIR__ . '/redactor.php';

// Sesión larga: el panel vive embebido en el admin, no queremos pedir la clave todo el tiempo.
session_set_cookie_params([
    'lifetime' => 30 * 24 * 3600,
    'path'     => '/',
    'secure'   => !empty($_SERVER['HTTPS']),
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
    if ($clave === '' || !preg_match('/^\d{8}-\d{6}-[0-9a-f]{8}\.(jpg|png|webp|gif|ogg|mp3|m4a|amr|bin)$/', $archivo)) {
        http_response_code(400);
        exit('archivo invalido');
    }
    $ruta = WABOT_DATA . '/media/' . $clave . '/' . $archivo;
    if (!is_file($ruta)) {
        http_response_code(404);
        exit('no encontrado');
    }
    $mimes = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif',
              'ogg' => 'audio/ogg', 'mp3' => 'audio/mpeg', 'm4a' => 'audio/mp4', 'amr' => 'audio/amr', 'bin' => 'application/octet-stream'];
    $ext = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
    // modo=ver: para <img>/<audio> y el clic de "ver completa" — se muestra
    // inline en vez de forzar la descarga. Sin ese parámetro, el link de
    // "Descargar" sigue bajando el archivo como siempre.
    $disposicion = ($_GET['modo'] ?? '') === 'ver' ? 'inline' : 'attachment';
    header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
    header('Content-Length: ' . filesize($ruta));
    header('Content-Disposition: ' . $disposicion . '; filename="' . $clave . '-' . $archivo . '"');
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

/* ── Acciones POST (solo logueado) ── */
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
    if ($a === 'guardar_textos') {
        foreach (['menu','def_tipos','contame','aclarar_objetivo','desempate_cursos','desempate_turnos','desempate_comercio','desempate_hibrido','msg_precio','msg_prediseno_oferta','prediseno','prediseno_falta_descripcion','prediseno_falta_colores','prediseno_completo','derivar','espera','espera_prediseno','caro','pensarlo','socio','ya_tengo_web','cta_muestra','cierre_suave','plataformas','no_interesa','no_texto','seguimiento_precio','seguimiento_datos','sistema_pregunta','sistema_pregunta_usuarios','sistema_pregunta_actual','sistema_whatsapp','sistema_whatsapp_invalido','sistema_cierre','hosting_renovacion','presentados_recordatorio','muestra_aviso'] as $k) {
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
        if (isset($_POST['demora_segundos']))    $cfg['demora_segundos']    = max(0, min(20, (int)$_POST['demora_segundos']));
        if (isset($_POST['demora_entre_mensajes'])) $cfg['demora_entre_mensajes'] = max(0, min(15, (int)$_POST['demora_entre_mensajes']));
        if (isset($_POST['tipeo_por_segundo']))     $cfg['tipeo_por_segundo']     = max(5, min(200, (int)$_POST['tipeo_por_segundo']));
        if (isset($_POST['demora_minima']))         $cfg['demora_minima']         = max(0, min(10, (float)$_POST['demora_minima']));
        if (isset($_POST['demora_maxima']))         $cfg['demora_maxima']         = max(1, min(30, (float)$_POST['demora_maxima']));
        $cfg['demora_por_longitud'] = !empty($_POST['demora_por_longitud']);
        // Los checkbox no viajan cuando están destildados: por eso se leen del form entero.
        $cfg['leer_imagenes']   = !empty($_POST['leer_imagenes']);
        $cfg['escuchar_audios'] = !empty($_POST['escuchar_audios']);
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
        $cfg['muestra_aviso_activo'] = !empty($_POST['muestra_aviso_activo']);
        if (isset($_POST['presentados_recordatorio_horas'])) {
            $cfg['presentados_recordatorio_horas'] = max(1, min(168, (float)$_POST['presentados_recordatorio_horas']));
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
    // Botón "Presentar" del admin: le manda al cliente el link de la muestra
    // por el mismo número del bot, apenas el boceto pasa a Seguimiento.
    if ($a === 'presentar_muestra' && !empty($_POST['tel'])) {
        header('Content-Type: application/json; charset=utf-8');
        $negocio = trim((string)($_POST['negocio'] ?? ''));
        $slug = $negocio !== '' ? wabot_slug_demo($negocio) : '';
        if ($slug === '') { echo json_encode(['error' => 'No se pudo armar el link de la demo: falta el nombre del negocio.']); exit; }

        $conv = wabot_conv_load($_POST['tel']);
        if (wabot_ventana_restante($conv) <= 0) {
            echo json_encode(['error' => 'Pasaron más de 24 horas desde su último mensaje: WhatsApp no deja mandarle texto libre hasta que el cliente vuelva a escribir. Avisale a mano.']);
            exit;
        }

        $texto = "Ya preparamos la demo para tu web (considerá que las imágenes también son de prueba).\n\n"
               . "Se encuentra en este link: gokywebs.com/demo/$slug\n\n"
               . "Mirala y después contame qué te parece o si hay algo que te gustaría cambiar.";

        if (!wabot_enviar($conv, $texto)) {
            echo json_encode(['error' => (wabot_canal($conv) === 'instagram' ? 'Instagram' : 'WhatsApp') . ' rechazó el envío. Revisá el log en wabot/data/log/.']);
            exit;
        }

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
        $conv['presentado_recordatorio_enviado'] = false;
        $conv['presentado_recordatorio_ts'] = 0;
        $conv['cliente_id'] = trim((string)($_POST['cliente_id'] ?? '')) ?: null;
        wabot_conv_transcript($conv, 'humano', $texto);
        if (function_exists('wabot_evento')) wabot_evento($conv, 'humano_responde', ['via' => 'panel_presentar']);
        wabot_evento($conv, 'muestra_presentada');
        wabot_conv_save($conv);
        wabot_log('presentar_muestra', ['tel' => $conv['tel'], 'slug' => $slug]);

        echo json_encode(['ok' => true]);
        exit;
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

        $mime = trim(explode(';', (string)($_POST['mime'] ?? $subida['type'] ?? ''))[0]);
        if (!wabot_audio_mime_valido($mime)) {
            echo json_encode(['error' => 'Ese formato de audio (' . ($mime ?: 'desconocido') . ') no lo acepta WhatsApp. Probá desde otro navegador.']);
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
:root { --bg:#0f1220; --card:#181c30; --line:#2a2f4a; --tx:#e8eaf6; --dim:#9aa0c3; --ac:#25d366; --warn:#f0a020; --bad:#e05555; }
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
.tabs a { padding:8px 14px; border:1px solid var(--line); border-radius:8px; color:var(--dim); font-size:14px; }
.tabs a.on { background:var(--card); color:var(--tx); border-color:var(--ac); }
.card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:18px; margin-bottom:16px; }
label { display:block; font-size:13px; color:var(--dim); margin:12px 0 4px; }
input[type=text], input[type=password], input[type=number], textarea, select {
  width:100%; background:#10131f; color:var(--tx); border:1px solid var(--line); border-radius:8px; padding:9px 11px; font:inherit; }
textarea { resize:vertical; min-height:64px; }
button { background:var(--ac); color:#08210f; border:0; border-radius:8px; padding:10px 18px; font:inherit; font-weight:700; cursor:pointer; }
button.sec { background:transparent; color:var(--dim); border:1px solid var(--line); font-weight:400; }
button.bad { background:transparent; color:var(--bad); border:1px solid var(--bad); font-weight:400; }
.fila { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.pill { display:inline-block; padding:2px 10px; border-radius:99px; font-size:12px; }
.pill.on { background:#12331d; color:var(--ac); } .pill.off { background:#3a1a1a; color:var(--bad); } .pill.pausa { background:#3a2f10; color:var(--warn); }
.ok { color:var(--ac); font-size:13px; margin-bottom:10px; }
table { width:100%; border-collapse:collapse; font-size:14px; }
td, th { padding:8px 6px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; }
th { color:var(--dim); font-weight:400; font-size:12px; }
code { background:#10131f; padding:2px 7px; border-radius:6px; font-size:13px; word-break:break-all; }
.chat { display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto; padding:6px 2px; }
.burb { max-width:82%; padding:9px 13px; border-radius:12px; white-space:pre-wrap; font-size:14px; }
.burb.cliente { align-self:flex-start; background:#232842; border-bottom-left-radius:4px; }
.burb.bot { align-self:flex-end; background:#1f4d33; border-bottom-right-radius:4px; }
.burb.humano { align-self:flex-end; background:#40350f; border-bottom-right-radius:4px; }
.burb.sistema { align-self:center; background:#3a1a1a; color:#f3a6a6; font-size:12.5px; text-align:center; max-width:92%; }
.media-box { margin-top:6px; display:flex; flex-direction:column; align-items:flex-start; gap:4px; }
.burb.bot .media-box, .burb.humano .media-box { align-items:flex-end; }
.media-img { display:block; max-width:220px; max-height:220px; border-radius:8px; cursor:zoom-in; object-fit:cover; }
.media-audio { max-width:260px; height:36px; }
.media-dl { display:block; font-size:12.5px; font-weight:600; color:var(--ac); text-decoration:underline; }
.grabando { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:9px; padding:9px 12px; background:#2a1a1a; border:1px solid var(--bad); border-radius:10px; }
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
.meta-editado { color:#8fa4c8; font-style:italic; }
/* El lápiz aparece al pasar por encima de la burbuja: en el celular, donde no
   hay hover, queda siempre visible (ver el @media de abajo). */
.burb-editar { background:none; border:0; padding:0 0 0 8px; margin:0; font-size:11px; font-weight:600;
    color:var(--ac); cursor:pointer; text-decoration:underline; opacity:0; transition:opacity .15s; }
.burb:hover .burb-editar, .burb-editar:focus { opacity:1; }
.burb-edit-box { margin-top:8px; display:flex; flex-direction:column; gap:6px; }
.burb-edit-box textarea { width:100%; min-width:240px; font:inherit; font-size:13.5px; padding:7px 9px;
    border-radius:8px; border:1px solid var(--ac); background:#151a2c; color:var(--tx); resize:vertical; }
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
.embudo-barra { height:7px; overflow:hidden; border-radius:99px; background:#10131f; }
.embudo-barra > span { display:block; height:100%; min-width:2px; border-radius:inherit; background:var(--ac); }
.embudo-numero { text-align:right; font-variant-numeric:tabular-nums; font-weight:700; }
.embudo-conversiones { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
.embudo-conversiones .pill { background:#12331d; color:var(--ac); padding:5px 10px; }

/* ===== CONVERSACIONES: tres listas a la izquierda, chat a la derecha ===== */
.conv-split { display:grid; grid-template-columns: 168px minmax(0,340px) minmax(430px,1fr); gap:14px; align-items:stretch; }
.conv-nav { display:flex; flex-direction:column; gap:6px; min-width:0; }
.conv-nav-btn { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:11px 12px; color:var(--dim); font:inherit; font-size:13.5px; font-weight:600; text-align:left; cursor:pointer; }
.conv-nav-btn:hover { background:#1e2338; color:var(--tx); }
.conv-nav-btn.on { background:#232842; color:var(--tx); border-color:var(--ac); }
.conv-nav-btn[data-grupo="muestra"] .conv-cuenta { background:#12331d; color:var(--ac); }
.conv-nav-btn[data-grupo="atencion"] .conv-cuenta { background:#3a2f10; color:var(--warn); }
.conv-nav-btn[data-grupo="atencion"].tiene { border-color:var(--warn); color:var(--warn); }
.conv-nav-btn[data-grupo="muestra"].on { border-color:var(--ac); }
.conv-nav-btn[data-grupo="atencion"].on { border-color:var(--warn); color:var(--warn); }

/* WhatsApp e Instagram comparten la misma lista: se distinguen con esta
   etiqueta chica al lado del nombre, no con una columna aparte. */
.canal-tag { display:inline-block; flex-shrink:0; padding:1px 7px; border-radius:99px; font-size:10.5px; font-weight:700; letter-spacing:.02em; vertical-align:middle; }
.canal-tag--whatsapp { background:#12331d; color:var(--ac); }
.canal-tag--instagram { background:#2e1b38; color:#d98ae8; }

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
.conv-busqueda { flex:1; min-width:0; width:100%; height:36px; margin:0; padding:7px 10px; border:1px solid var(--line); border-radius:8px; background:#111526; color:var(--tx); font:inherit; font-size:12.5px; }
.conv-busqueda::placeholder { color:var(--dim); }
.conv-busqueda:focus { border-color:var(--ac); outline:0; }
.conv-fecha-toggle { display:inline-flex; align-items:center; justify-content:center; gap:5px; flex:none; height:36px; padding:0 10px; border:1px solid var(--line); border-radius:8px; background:#1a1f33; color:var(--dim); font:inherit; font-size:12px; font-weight:700; cursor:pointer; }
.conv-fecha-toggle:hover, .conv-fecha-toggle.on { border-color:var(--ac); color:var(--tx); }
.conv-fecha-toggle.filtrando { background:#1d4ed8; border-color:#1d4ed8; color:#fff; }
.conv-fecha-cuenta { min-width:18px; padding:1px 5px; border-radius:99px; background:rgb(255 255 255 / .16); font-size:10px; text-align:center; }
.conv-fecha-panel { margin-top:8px; padding-top:8px; border-top:1px solid var(--line); }
.conv-fecha-panel[hidden] { display:none; }
.conv-fecha-chips { display:flex; flex-wrap:wrap; gap:6px; max-height:108px; overflow-y:auto; }
.conv-fecha-chip { padding:5px 8px; border:1px solid #1e2c49; border-radius:99px; background:#111d35; color:#8a9bb8; font:inherit; font-size:11px; cursor:pointer; }
.conv-fecha-chip:hover { border-color:#31456e; color:var(--tx); }
.conv-fecha-chip.on { background:#1d4ed8; border-color:#1d4ed8; color:#fff; }
.conv-fecha-chip span { margin-left:3px; opacity:.75; font-size:10px; }
.conv-fecha-vacio { margin:0; color:var(--dim); font-size:11px; }
.conv-cuenta { background:#1b2540; color:#9ab4e8; border-radius:20px; padding:1px 8px; font-size:11.5px; font-weight:700; }
.conv-list[data-grupo="muestra"] .conv-list-head { color:var(--ac); }
.conv-list[data-grupo="atencion"] .conv-list-head { color:var(--warn); }
.conv-list[data-grupo="atencion"] { border-color:var(--warn); }
.conv-item .pill.espera { background:#3a2f10; color:var(--warn); }
.conv-items { flex:1 1 0; min-height:0; overflow-y:auto; }
.conv-item { display:flex; align-items:flex-start; gap:9px; padding:11px 13px; border-bottom:1px solid var(--line); color:var(--tx); border-left:3px solid transparent; cursor:pointer; }
.conv-item:last-child { border-bottom:0; }
.conv-item:hover { background:#1e2338; }
.conv-item.on { background:#232842; border-left-color:var(--ac); }
.conv-item-foto { width:34px; height:34px; border-radius:50%; object-fit:cover; flex-shrink:0; border:1px solid var(--line); }
.conv-item-body { flex:1 1 0; min-width:0; }
.conv-item-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.conv-item-nombre { display:flex; align-items:center; gap:6px; min-width:0; overflow:hidden; }
.conv-item-tel { font-weight:700; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-item-hora { font-size:11px; color:var(--dim); flex-shrink:0; }
.conv-item-ult { font-size:12.5px; color:var(--dim); margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-item-pills { margin-top:5px; display:flex; gap:5px; flex-wrap:wrap; }
/* Sin abrir: el chat entero se destaca, no solo un puntito perdido. */
.conv-item.sin-leer { background:#1b2745; border-left-color:#4f8cff; }
.conv-item.sin-leer:hover { background:#202d50; }
.conv-item.sin-leer.on { background:#232842; border-left-color:var(--ac); }
.conv-item.sin-leer .conv-item-tel { color:#eaf1ff; }
.conv-item.sin-leer .conv-item-ult { color:#b9c8e8; font-weight:600; }
.conv-item.sin-leer .conv-item-hora { color:#7fa7f0; font-weight:700; }
.conv-item-punto { width:8px; height:8px; border-radius:50%; background:#4f8cff; flex-shrink:0; box-shadow:0 0 0 3px rgba(79,140,255,.18); }
.conv-sub-header { padding:9px 13px 5px; font-size:11px; font-weight:800; letter-spacing:.03em; text-transform:uppercase; color:var(--dim); background:var(--bg); position:sticky; top:0; z-index:1; }
/* Los que se enfriaron: la ventana de Meta ya cerró y hay que ir a buscarlos. */
.conv-nav-btn[data-grupo="pago"] .conv-cuenta { background:#0f3320; color:var(--ac); }
.conv-nav-btn[data-grupo="pago"].tiene { border-color:var(--ac); color:var(--ac); }
.conv-nav-btn[data-grupo="pago"].on { border-color:var(--ac); color:#8ff0b5; }
.conv-list[data-grupo="pago"] .conv-list-head { color:var(--ac); }
.conv-item.pago-avisado { border-left-color:var(--ac); background:#132a1e; }
.conv-nav-btn[data-grupo="presentadas_48"] .conv-cuenta { background:#3a1f10; color:#f0a020; }
.conv-nav-btn[data-grupo="presentadas_48"].tiene { border-color:var(--warn); color:var(--warn); }
.conv-nav-btn[data-grupo="presentadas_48"].on { border-color:var(--warn); color:#ffcd7a; }
.conv-list[data-grupo="presentadas_48"] .conv-list-head { color:var(--warn); }
.conv-nav-btn[data-grupo="no_leidos"] .conv-cuenta { background:#16294d; color:#7fa7f0; }
.conv-nav-btn[data-grupo="no_leidos"].tiene { border-color:#4f8cff; color:#9dc0ff; }
.conv-nav-btn[data-grupo="no_leidos"].on { border-color:#4f8cff; color:#cfe0ff; }
.conv-vacio { padding:16px; color:var(--dim); font-size:13px; }

.conv-main { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; min-width:0; min-height:0; }
.conv-main .chat { flex:1 1 0; min-height:0; max-height:none; overflow-y:auto; }
.conv-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; padding-bottom:10px; border-bottom:1px solid var(--line); margin-bottom:10px; }
.conv-head form { display:inline; }
.conv-acciones { gap:6px; flex-shrink:0; }
.conv-acciones button { padding:5px 10px; font-size:12px; font-weight:600; border-radius:6px; }
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
    .conv-split { grid-template-columns: 158px minmax(0,320px) minmax(0,1fr); }
}

@media (max-width: 1150px) {
    .conv-split { grid-template-columns: 138px minmax(0,260px) minmax(0,1fr); }
    .conv-nav-btn { padding:9px 10px; font-size:12.5px; }
}

/* Sin hover no hay forma de descubrir el lápiz: en touch va siempre visible. */
@media (hover: none) {
    .burb-editar { opacity:.75; }
}
@media (max-width: 900px) {
    /* Una columna: o las listas, o el chat — como WhatsApp en el celular. */
    .conv-split { grid-template-columns:1fr; grid-template-rows:auto minmax(0,1fr); }
    .conv-nav { flex-direction:row; overflow-x:auto; scrollbar-width:none; }
    .conv-nav::-webkit-scrollbar { display:none; }
    .conv-nav-btn { width:auto; flex:0 0 auto; white-space:nowrap; }
    .conv-split.has-sel .conv-nav, .conv-split.has-sel .conv-list { display:none; }
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

    <div class="tabs">
        <?php
        $navTabs = [
            'conversaciones' => 'Conversaciones',
            'embudo'         => 'Embudo',
            'probar'         => 'Probar',
            'textos'         => 'Textos',
            'entrenamiento'  => 'Entrenamiento',
            'estado'         => 'Estado',
        ];
        foreach ($navTabs as $k => $v): ?>
            <a href="admin.php?tab=<?= $k ?>" class="<?= $tab === $k ? 'on' : '' ?>"><?= $v ?></a>
        <?php endforeach; ?>
        <?php if ($embed): ?>
            <span class="pill <?= !empty($cfg['activo']) ? 'on' : 'off' ?>"><?= !empty($cfg['activo']) ? 'BOT ACTIVO' : 'BOT APAGADO' ?></span>
            <a href="admin.php?embed=0" target="_blank" rel="noopener" class="tabs-aparte">Abrir aparte ↗</a>
        <?php endif; ?>
    </div>

    <?php if (isset($_GET['ok'])) echo '<p class="ok">Guardado.</p>'; ?>
    <?php if (isset($_GET['boceto_ok'])) echo '<p class="ok">Boceto creado: ya aparece en la pestaña Bocetos.</p>'; ?>
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
                    <input type="date" name="fecha" value="<?= date('Y-m-d') ?>" required style="width:auto;background:#10131f;color:var(--tx);border:1px solid var(--line);border-radius:8px;padding:9px 11px;font:inherit">
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
            <label>Mandó audio/imagen</label><textarea name="no_texto" rows="2"><?= $e($cfg['no_texto']) ?></textarea>
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
        </div>
        <div class="card">
            <h2 style="margin-top:0">Aviso antes de la demo</h2>
            <p class="meta" style="margin-bottom:8px">El prediseño tarda 24 a 48 h y Meta solo deja mandar texto libre dentro de las 24 h desde el último mensaje del cliente. Esto manda un aviso corto antes de que esa ventana se cierre (a las 8:00 del día siguiente, o un rato antes de que cierre si eso ya es tarde) para que el cliente conteste algo y quede lugar para mandarle la demo real ese mismo día.</p>
            <label style="display:flex;align-items:center;gap:7px;margin:0;cursor:pointer">
                <input type="checkbox" name="muestra_aviso_activo" value="1" <?= !empty($cfg['muestra_aviso_activo']) ? 'checked' : '' ?> style="width:auto">
                Mandar el aviso previo
            </label>
            <p class="meta" style="margin-top:8px">Usa el mismo cron que el seguimiento y las demos presentadas (<code>wabot/seguimiento.php</code>).</p>
            <label>Mensaje del aviso</label><textarea name="muestra_aviso" rows="2"><?= $e($cfg['muestra_aviso'] ?? '') ?></textarea>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Demos presentadas</h2>
            <p class="meta" style="margin-bottom:8px">Cuando se aprieta "Presentar" en un boceto del admin, el bot le manda al cliente el link de la demo. Si no confirma nada, esto pasa después.</p>
            <div class="fila" style="gap:18px;align-items:flex-end">
                <div>
                    <label>Horas sin confirmar para reinsistir</label>
                    <input type="number" name="presentados_recordatorio_horas" min="1" max="168" step="1" value="<?= $e((string)($cfg['presentados_recordatorio_horas'] ?? 48)) ?>" style="width:110px">
                </div>
                <div>
                    <label>Horas sin confirmar para archivar</label>
                    <input type="number" name="presentados_archivar_horas" min="24" max="720" step="1" value="<?= $e((string)($cfg['presentados_archivar_horas'] ?? 168)) ?>" style="width:110px">
                </div>
            </div>
            <p class="meta" style="margin-top:8px">El recordatorio se manda una sola vez y solo dentro de la ventana de 24 h que permite Meta. Usa el mismo cron que el seguimiento (<code>wabot/seguimiento.php</code>).</p>
            <label>Mensaje de recordatorio</label><textarea name="presentados_recordatorio" rows="3"><?= $e($cfg['presentados_recordatorio'] ?? '') ?></textarea>
            <p class="meta" style="margin-top:4px"><code>{demo}</code> se reemplaza por el link de la demo ya presentada.</p>
        </div>
        <div class="card">
            <h2 style="margin-top:0">Info fija (respuestas a preguntas)</h2>
            <?php foreach ($cfg['info'] as $k => $v): ?>
                <label><?= $e($k) ?><?= $k === 'mantenimiento' ? ' — {precio} y {link} salen del plan de abajo, según el tipo cotizado' : '' ?></label>
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
                <div><label>Segundos antes de contestar</label><input type="number" name="demora_segundos" min="0" max="20" value="<?= (int)($cfg['demora_segundos'] ?? 5) ?>" style="width:100px"></div>
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
            <p class="meta" style="margin-top:8px">Mientras espera, al cliente le aparece "escribiendo…". El tiempo que tarda la IA en pensar se descuenta de la demora, así que si pensar llevó 3 segundos y pusiste 5, espera solo 2 más. En 0 contesta al toque.</p>
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
        $conv     = $ver !== '' ? wabot_conv_load($ver) : null;
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

            <nav class="conv-nav">
                <button type="button" class="conv-nav-btn" data-grupo="no_leidos">No leídos <span class="conv-cuenta" id="cuentaNoLeidos">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="pago">Pagó <span class="conv-cuenta" id="cuentaPago">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="interesado">Interesados <span class="conv-cuenta" id="cuentaInteresado">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="chat">Chats <span class="conv-cuenta" id="cuentaChat">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="muestra">Demos <span class="conv-cuenta" id="cuentaMuestra">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="presentados">Presentados <span class="conv-cuenta" id="cuentaPresentados">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="presentadas_48">Presentadas 48hs <span class="conv-cuenta" id="cuentaPresentadas48">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="atencion">Te esperan <span class="conv-cuenta" id="cuentaAtencion">0</span></button>
                <button type="button" class="conv-nav-btn" data-grupo="archivado">Archivados <span class="conv-cuenta" id="cuentaArchivado">0</span></button>
            </nav>

            <aside class="conv-list" id="convLista">
                <header class="conv-list-head" id="convListaTitulo">Chats</header>
                <div class="conv-filtros">
                    <div class="conv-busqueda-fila">
                        <input type="search" class="conv-busqueda" id="convBuscar" placeholder="Buscar nombre o número…" autocomplete="off" aria-label="Buscar chats por nombre o número">
                        <button type="button" class="conv-fecha-toggle" id="convFechaToggle" aria-expanded="false" aria-controls="convFechaPanel">Fecha <span class="conv-fecha-cuenta" id="convFechaCuenta" hidden>0</span></button>
                    </div>
                    <div class="conv-fecha-panel" id="convFechaPanel" hidden>
                        <div class="conv-fecha-chips" id="convFechaChips"></div>
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
                        <?php if (!empty($conv['presentado_ts']) && empty($conv['presentado_confirmado'])): ?>
                        <form method="post"><input type="hidden" name="accion" value="presentado_confirmar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button>Confirmó la demo</button></form>
                        <?php endif; ?>
                        <form method="post"><input type="hidden" name="accion" value="conv_archivar"><input type="hidden" name="tel" value="<?= $e($convClave) ?>">
                            <button class="sec"><?= !empty($conv['archivado']) ? 'Desarchivar' : 'Archivar' ?></button></form>
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
        const GRUPOS = {
            no_leidos:  { titulo: 'No leídos',   cuenta: document.getElementById('cuentaNoLeidos'),   vacio: 'Nada sin leer.', vista: true },
            pago:       { titulo: 'Pagó',        cuenta: document.getElementById('cuentaPago'),        vacio: 'Nadie avisó todavía que pagó.' },
            interesado: { titulo: 'Interesados', cuenta: document.getElementById('cuentaInteresado'),  vacio: 'Nadie con precio dado esperando decidir.' },
            chat:       { titulo: 'Chats',       cuenta: document.getElementById('cuentaChat'),       vacio: 'Ninguna charla abierta.' },
            muestra:    { titulo: 'Demos',       cuenta: document.getElementById('cuentaMuestra'),    vacio: 'Ninguna demo pedida.' },
            presentados:{ titulo: 'Presentados', cuenta: document.getElementById('cuentaPresentados'),vacio: 'Ninguna demo presentada esperando confirmación.' },
            presentadas_48:{ titulo: 'Presentadas 48hs', cuenta: document.getElementById('cuentaPresentadas48'), vacio: 'Ninguna demo sin respuesta hace más de 48 horas.' },
            atencion:   { titulo: 'Te esperan',  cuenta: document.getElementById('cuentaAtencion'),   vacio: 'Nadie esperando.' },
            archivado:  { titulo: 'Archivados',  cuenta: document.getElementById('cuentaArchivado'),  vacio: 'Nada archivado.' },
        };
        // Dos condiciones, y hacen falta las dos: que el último mensaje sea del
        // cliente (nadie le contestó) Y que no lo hayas abierto desde entonces.
        // Sin la segunda, abrir el chat no lo sacaba de la lista, porque el
        // último mensaje seguía siendo del cliente igual.
        function esNoLeido(it) {
            const grupo = GRUPOS[it.grupo] ? it.grupo : 'chat';
            if (grupo === 'archivado') return false;
            return it.quien === 'cliente' && !!it.no_leido;
        }
        // Subdivisión de "No leídos": Presentadas y Demos son las columnas que ya
        // existen; todo lo demás (chat normal o "te espera") cae en Chats normales.
        const SUBGRUPOS_NO_LEIDOS = [
            { clave: 'pago',        titulo: 'Pagaron' },
            { clave: 'presentados', titulo: 'Presentadas' },
            { clave: 'muestra',     titulo: 'Demos' },
            { clave: 'chat',        titulo: 'Chats normales' },
        ];
        function subGrupoNoLeido(it) {
            const grupo = GRUPOS[it.grupo] ? it.grupo : 'chat';
            if (grupo === 'presentados' || grupo === 'presentadas_48') return 'presentados';
            if (grupo === 'muestra') return 'muestra';
            if (grupo === 'pago') return 'pago';
            return 'chat';
        }
        const listaEl   = document.getElementById('listaItems');
        const listaCaja = document.getElementById('convLista');
        const listaTit  = document.getElementById('convListaTitulo');
        const navBtns   = document.querySelectorAll('.conv-nav-btn');
        const buscarChatsEl = document.getElementById('convBuscar');
        const fechaToggleEl = document.getElementById('convFechaToggle');
        const fechaPanelEl = document.getElementById('convFechaPanel');
        const fechaChipsEl = document.getElementById('convFechaChips');
        const fechaCuentaEl = document.getElementById('convFechaCuenta');

        let grupoActivo = localStorage.getItem('wabotGrupo');
        if (!GRUPOS[grupoActivo]) grupoActivo = 'chat';
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

        function activarGrupo(grupo, recordar) {
            if (!GRUPOS[grupo]) return;
            grupoActivo = grupo;
            if (recordar) localStorage.setItem('wabotGrupo', grupo);
            for (const b of navBtns) b.classList.toggle('on', b.dataset.grupo === grupo);
            listaCaja.dataset.grupo = grupo;
            listaTit.textContent = GRUPOS[grupo].titulo;
            pintarLista(itemsCache);
        }

        for (const b of navBtns) {
            b.addEventListener('click', () => activarGrupo(b.dataset.grupo, true));
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
                it.tel, it.channel_user_id, it.telefono_wsp,
            ].join(' '));
            if (texto.includes(q)) return true;
            const digitos = String(termino).replace(/\D/g, '');
            if (!digitos) return false;
            return [it.tel, it.channel_user_id, it.telefono_wsp]
                .map(v => String(v || '').replace(/\D/g, ''))
                .some(v => v.includes(digitos));
        }

        // Un ítem entra en la lista que se está mirando: por grupo excluyente, o
        // por la vista cruzada de No leídos.
        function entraEnGrupoActivo(it) {
            if (grupoActivo === 'no_leidos') return esNoLeido(it);
            return (GRUPOS[it.grupo] ? it.grupo : 'chat') === grupoActivo;
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

        function pintarLista(items) {
            itemsCache = items;

            if (!sincronizado) {
                sincronizado = true;
                const elegida = SEL ? items.find(x => x.tel === SEL) : null;
                if (elegida && GRUPOS[elegida.grupo] && elegida.grupo !== grupoActivo) {
                    activarGrupo(elegida.grupo, false);
                    return;
                }
                activarGrupo(grupoActivo, false);
                return;
            }

            renderFechasChats();
            const termino = buscarChatsEl.value.trim();
            const firma = JSON.stringify(items) + '|' + grupoActivo + '|' + termino + '|'
                + [...fechasChatsSeleccionadas].sort().join(',');
            if (firma === firmaLista) return;
            firmaLista = firma;

            listaEl.innerHTML = '';
            const cuentas = { no_leidos: 0, pago: 0, interesado: 0, chat: 0, muestra: 0, presentados: 0, presentadas_48: 0, atencion: 0, archivado: 0 };
            // Demos y Presentados muestran cuántos chats tienen algo sin leer,
            // no el total de la cola — para eso ya está la lista abierta.
            const cuentasNoLeidos = { muestra: 0, presentados: 0 };
            let visibles = 0;
            const renderizados = [];   // {it, el} — se agrupan con encabezados solo en "No leídos"

            for (const it of items) {
                const grupo = GRUPOS[it.grupo] ? it.grupo : 'chat';
                cuentas[grupo]++;
                if (esNoLeido(it)) cuentas.no_leidos++;
                if (it.no_leido && grupo in cuentasNoLeidos) cuentasNoLeidos[grupo]++;
                if (!entraEnGrupoActivo(it)) continue;
                if (fechasChatsSeleccionadas.size && !fechasChatsSeleccionadas.has(fechaInicioInfo(it).key)) continue;
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
                const tag = document.createElement('span');
                tag.className = 'canal-tag canal-tag--' + (it.canal === 'instagram' ? 'instagram' : 'whatsapp');
                tag.textContent = it.canal === 'instagram' ? 'IG' : 'WA';
                nombreBox.appendChild(tel); nombreBox.appendChild(tag);
                if (it.no_leido) {
                    const punto = document.createElement('span');
                    punto.className = 'conv-item-punto';
                    punto.title = 'Sin abrir';
                    nombreBox.appendChild(punto);
                }
                const h = document.createElement('span');
                h.className = 'conv-item-hora';
                h.textContent = hora(it.ts);
                top.appendChild(nombreBox); top.appendChild(h);

                const ult = document.createElement('div');
                ult.className = 'conv-item-ult';
                ult.textContent = (it.quien === 'cliente' ? '' : (it.quien === 'humano' ? 'Vos: ' : 'Bot: ')) + (it.ult || '—');

                const pills = document.createElement('div');
                pills.className = 'conv-item-pills';
                const p1 = document.createElement('span');
                p1.className = 'pill ' + (it.estado === 'apagado' ? 'off' : (it.estado === 'pausado' ? 'pausa' : 'on'));
                p1.textContent = it.estado === 'apagado' ? 'bot apagado' : (it.estado === 'pausado' ? 'lo seguís vos' : 'bot');
                pills.appendChild(p1);
                if (it.handoff_pendiente || it.espera) {
                    const pe = document.createElement('span');
                    pe.className = 'pill espera';
                    pe.textContent = it.handoff_pendiente ? 'Pablo pendiente' : 'te espera';
                    pills.appendChild(pe);
                }
                if (it.tipo) {
                    const p2 = document.createElement('span');
                    p2.className = 'pill';
                    p2.style.background = '#1b2540'; p2.style.color = '#9ab4e8';
                    p2.textContent = it.tipo;
                    pills.appendChild(p2);
                }

                body.appendChild(top); body.appendChild(ult); body.appendChild(pills);
                a.appendChild(body);
                renderizados.push({ it, el: a });
            }

            if (grupoActivo === 'no_leidos') {
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

            const cuentasMostradas = { ...cuentas, ...cuentasNoLeidos };
            for (const g of Object.keys(GRUPOS)) {
                if (GRUPOS[g].cuenta) GRUPOS[g].cuenta.textContent = cuentasMostradas[g] ?? 0;
            }
            for (const b of navBtns) b.classList.toggle('tiene', (cuentasMostradas[b.dataset.grupo] ?? 0) > 0);
            if (!visibles) {
                const filtrando = termino || fechasChatsSeleccionadas.size;
                listaEl.innerHTML = '<p class="conv-vacio">' + (filtrando ? 'No hay chats que coincidan con los filtros.' : GRUPOS[grupoActivo].vacio) + '</p>';
            }
        }

        buscarChatsEl.addEventListener('input', () => {
            firmaLista = '';
            pintarLista(itemsCache);
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
                    }
                    const a = document.createElement('a');
                    a.className = 'media-dl';
                    a.href = base;
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
           WhatsApp solo acepta ogg/opus, mp4, mpeg, aac y amr. El navegador
           graba en lo que quiere, así que se le pide explícitamente el primer
           formato de esta lista que soporte: mp4 lo tienen Safari y el Chrome
           moderno, ogg lo tiene Firefox. webm (el default de Chrome) queda
           afuera a propósito: WhatsApp lo rechaza, y mandarlo sería prometer
           un envío que falla. */
        const FORMATOS_WSP = ['audio/mp4', 'audio/ogg;codecs=opus', 'audio/aac', 'audio/mpeg'];

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
                fd.append('mime', (recMime || blob.type || '').split(';')[0]);
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
<?php endif; ?>
</body>
</html>
