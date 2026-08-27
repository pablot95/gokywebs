<?php
/**
 * wabot/webhook.php — endpoint del webhook de la WhatsApp Cloud API.
 * GET: verificación de Meta (hub.challenge). POST: mensajes entrantes.
 * URL a configurar en developers.facebook.com: https://gokywebs.com/wabot/webhook.php
 */

require_once __DIR__ . '/redactor.php';

/* ── Verificación del webhook (la hace Meta una sola vez al configurarlo) ── */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $modo  = $_GET['hub_mode']         ?? ($_GET['hub.mode'] ?? '');
    $token = $_GET['hub_verify_token'] ?? ($_GET['hub.verify_token'] ?? '');
    $reto  = $_GET['hub_challenge']    ?? ($_GET['hub.challenge'] ?? '');
    if ($modo === 'subscribe' && hash_equals(WABOT_VERIFY_TOKEN, $token)) {
        echo $reto;
    } else {
        http_response_code(403);
        echo 'token invalido';
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input');

/* ── Firma: si hay app secret configurado, se valida siempre ──
 *
 * Se admite más de una clave separada por coma: la app de Meta y la de
 * Instagram tienen claves distintas y cada canal firma con la suya, así que con
 * una sola quedaría un canal siempre rechazado. Alcanza con que UNA valide.
 *
 * Sin esto cualquiera que conozca la URL puede mandarle mensajes inventados al
 * bot y hacerle escribir a números arbitrarios desde el WhatsApp del negocio.
 */
if (wabot_app_secrets()) {
    $firma = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    if (!wabot_firma_valida($raw, $firma)) {
        wabot_log('error', ['donde' => 'webhook', 'msg' => 'firma invalida', 'objeto' => (string)(json_decode($raw, true)['object'] ?? '?')]);
        http_response_code(403);
        exit;
    }
}

/* ── Responder 200 ya mismo y seguir procesando de fondo ── */
http_response_code(200);
echo 'OK';
if (function_exists('litespeed_finish_request'))    { litespeed_finish_request(); }
elseif (function_exists('fastcgi_finish_request')) { fastcgi_finish_request(); }
ignore_user_abort(true);
// Ya respondimos a Meta: acá abajo puede haber varias llamadas a Gemini más la
// demora antes de contestar, así que le damos aire al límite de ejecución.
@set_time_limit(180);

$payload = json_decode($raw, true);
if (!is_array($payload)) exit;

$cfg = wabot_config_load();

/**
 * Un mensaje entrante, venga de donde venga.
 *
 * Los dos canales mandan payloads con formas distintas, así que cada uno lo
 * normaliza a {canal, conversation_key, channel_user_id, id, texto, nombre,
 * media} y de acá en adelante el flujo es exactamente el mismo: dedup, cola,
 * candado, motor y envío. Toda la
 * lógica difícil —una respuesta por tanda, la demora por tipeo, el "escribiendo"
 * que no se promete sin respuesta— vive una sola vez.
 */
function wabot_conv_identidad_entrante(&$conv, $conversationKey, $channelUserId, $canal) {
    // La clave de persistencia y el destinatario son datos distintos. `tel` se
    // conserva por compatibilidad con los helpers de envío existentes, pero no
    // vuelve a decidir el archivo de la conversación.
    $conv['conversation_key'] = $conversationKey;
    $conv['channel_user_id']  = $channelUserId;
    $conv['canal']            = $canal;
    $conv['tel']              = $channelUserId;
}

function wabot_procesar_entrante($ev, $cfg) {
    $de    = (string)$ev['channel_user_id'];
    $clave = (string)$ev['conversation_key'];
    $id    = $ev['id'];
    $canal = $ev['canal'];
    $texto = $ev['texto'];

    // Dedup atómico: Meta reintenta el webhook si tarda.
    if (!wabot_msg_visto_marcar($id)) return;

    $conv = wabot_conv_load($clave);
    wabot_conv_identidad_entrante($conv, $clave, $de, $canal);
    $nombreEntrante = trim((string)($ev['nombre'] ?? ''));
    if ($nombreEntrante === '') $nombreEntrante = trim((string)($conv['nombre'] ?? ''));

    // De que anuncio vino. Solo llega en el PRIMER mensaje tras el clic, asi
    // que si no se guarda ahora se pierde para siempre y esa conversacion ya
    // no se puede atribuir.
    $ref = $ev['referral'] ?? null;
    if (is_array($ref) && !empty($ref['ctwa_clid'])) {
        $conv['ctwa_clid']       = $ref['ctwa_clid'];
        $conv['ctwa_clid_ts']    = time();
        $conv['anuncio_id']      = (string)($ref['anuncio_id'] ?? '');
        $conv['anuncio_titular'] = (string)($ref['anuncio_titular'] ?? '');
        wabot_log('anuncio_referral', ['tel' => $de, 'anuncio' => $conv['anuncio_id']]);
    }

    $arranque = microtime(true);
    $primerContacto = empty($conv['lead_recibido_evento']);
    $avisado = false;
    if ($nombreEntrante === '' && $canal === 'instagram') $nombreEntrante = wabot_ig_nombre($de);

    // Fotos y audios: se convierten a texto y entran al bot como si el cliente
    // lo hubiera escrito. Se hace aunque el bot esté en pausa, así Pablo lee la
    // transcripción en el panel en vez de un "[audio]" inútil.
    $marcaMedia = '';
    $mediaGuardada = null;
    $media = $ev['media'];
    if ($media && $media['clase'] === 'imagen') {
        $bin = wabot_bajar_media($canal, $media);
        if ($bin) {
            // OJO: acá NO se cuenta la imagen. Este $conv es el de antes del
            // candado y se descarta entero unas líneas más abajo
            // (wabot_conv_load() de nuevo, ya con el lock tomado), así que el
            // contador se perdía siempre y wabot_texto_prediseno_completo()
            // veía 0 imágenes aunque el cliente acabara de mandar el logo: el
            // bot le pedía el logo que tenía adelante (casos Jorge y Gabriel,
            // 26-ago). Se cuenta al drenar la cola, con el $conv que sí se
            // guarda.
            $mediaGuardada = wabot_media_guardar($clave, $bin['bytes'], $bin['mime'], 'imagen');
            if (!empty($cfg['leer_imagenes'])) {
                $desc = wabot_media_a_texto($bin['bytes'], $bin['mime'], 'imagen', $media['caption']);
                if ($desc !== null) {
                    $texto = $media['caption'] !== '' ? $media['caption'] . "\n($desc)" : $desc;
                    $marcaMedia = '[foto] ';
                }
            }
        }
    } elseif ($media && $media['clase'] === 'audio') {
        $bin = wabot_bajar_media($canal, $media);
        if ($bin) {
            $mediaGuardada = wabot_media_guardar($clave, $bin['bytes'], $bin['mime'], 'audio');
            if (!empty($cfg['escuchar_audios'])) {
                $trans = wabot_media_a_texto($bin['bytes'], $bin['mime'], 'audio');
                if ($trans !== null) { $texto = $trans; $marcaMedia = '[audio] '; }
            }
        }
    } elseif ($media && in_array($media['clase'], ['documento', 'video', 'sticker'], true)) {
        // No se leen con IA, pero se guardan igual: lo que el cliente manda
        // (un PDF con su logo, el video de su local) tiene que quedar
        // descargable en el panel, no como un "[documento]" muerto.
        $bin = wabot_bajar_media($canal, $media);
        if ($bin) {
            $mediaGuardada = wabot_media_guardar($clave, $bin['bytes'], $bin['mime'], $media['clase'],
                (string)($media['nombre'] ?? ''));
        }
        if ($media['caption'] !== '') $texto = $media['caption'];
    }

    // Una reacción o un mensaje de solo emojis igual dice algo: un pulgar arriba
    // después de "querés la muestra?" es un sí, y antes se perdía como si el
    // cliente no hubiera escrito nada.
    if ($texto === '' && $media && $media['clase'] === 'reaccion') {
        $leido = wabot_emoji_a_texto($media['caption']);
        if ($leido !== '') { $texto = $leido; $marcaMedia = $media['caption'] . ' '; }
    }
    if ($texto !== '') {
        $util = wabot_texto_util($texto);
        if ($util !== '' && $util !== $texto) { $marcaMedia = $texto . ' '; $texto = $util; }
        elseif ($util === '') { $texto = ''; }
    }

    // El nombre del archivo dice muchísimo más que "[documento]" a secas.
    $etiquetaMedia = (string)($media['clase'] ?? 'sin texto');
    if ($etiquetaMedia === 'documento' && !empty($mediaGuardada['nombre'])) {
        $etiquetaMedia = 'documento: ' . $mediaGuardada['nombre'];
    }
    $etiqueta = $texto !== '' ? $marcaMedia . $texto : '[' . $etiquetaMedia . ']';
    wabot_cola_encolar($clave, $etiqueta, $texto, $nombreEntrante, $mediaGuardada);

    // Un solo proceso contesta por conversación. Si el candado ya está tomado,
    // el que lo tiene se va a llevar este mensaje también.
    $lock = wabot_lock_tomar($clave);
    if (!$lock) {
        wabot_log('encolado', ['tel' => $de, 'canal' => $canal, 'msg' => mb_substr($texto, 0, 80)]);
        return;
    }

    try {
        do {
            $objetivoDemora = $primerContacto
                ? (float)($cfg['demora_primer_mensaje'] ?? 20)
                : (float)($cfg['demora_segundos'] ?? 10);
            $espera = wabot_demora_restante($cfg, $arranque, $objetivoDemora);
            if ($espera > 0) usleep((int)($espera * 1000000));

            $tanda = wabot_cola_drenar($clave);
            if (!$tanda) break;

            $conv = wabot_conv_load($clave);   // recién ahora, con el candado tomado
            wabot_conv_identidad_entrante($conv, $clave, $de, $canal);
            // El nuevo lead de una charla vieja se abre antes de medirlo y antes
            // de anexar su primer mensaje. El reset posterior del motor queda
            // como respaldo idempotente para otros puntos de entrada.
            wabot_conv_reset_si_vieja($conv, $cfg, time());

            $usables = [];
            $primerContacto = empty($conv['lead_recibido_evento']);
            foreach ($tanda as $item) {
                wabot_conv_transcript($conv, 'cliente', $item['t'], $item['media'] ?? null);
                wabot_imagenes_contar($conv, $item['media'] ?? null);
                if (trim((string)($item['u'] ?? '')) !== '') {
                    $usables[] = $item['u'];
                    wabot_nombre_negocio_actualizar($conv, $item['u']);
                }
                if (!empty($item['n']) && empty($conv['nombre_confirmado'])) $conv['nombre'] = $item['n'];
            }
            $conv['ultimo_cliente_ts'] = time();   // reabre la ventana de 24 h
            wabot_logo_sincronizar($conv);
            if ($primerContacto) {
                $conv['lead_recibido_evento'] = true;
                wabot_evento($conv, 'lead_recibido');
            }

            $activo = !empty($cfg['activo']) && empty($conv['bot_off']) && time() >= (int)$conv['pausado_hasta'];
            if (!$activo) {
                wabot_conv_save($conv);
                wabot_log('silencio', ['tel' => $de, 'canal' => $canal, 'motivo' => empty($cfg['activo']) ? 'global_off' : (!empty($conv['bot_off']) ? 'chat_off' : 'pausa_humano')]);
                break;
            }

            if (!$usables) {
                if (!$conv['no_texto_avisado'] && $conv['fase'] !== 'derivado') {
                    $conv['no_texto_avisado'] = true;
                    wabot_enviar($conv, $cfg['no_texto']);
                    wabot_conv_transcript($conv, 'bot', $cfg['no_texto']);
                }
                wabot_conv_save($conv);
                break;
            }
            $conv['no_texto_avisado'] = false;

            $vinoDeMedia = false;
            foreach ($tanda as $item) {
                if (!empty($item['media'])) $vinoDeMedia = true;
            }
            if ($vinoDeMedia) $conv['_texto_de_media'] = true;

            $entrada    = implode("\n", $usables);
            $respuestas = wabot_una_sola_pregunta(wabot_sin_repetidos_consecutivos(wabot_responder($entrada, $conv, $cfg)));
            unset($conv['_texto_de_media']);

            // Cada texto va como un mensaje aparte y tarda lo que tardaría en
            // escribirse. El primero descuenta lo que ya se fue esperando y
            // pensando, para no sumar espera sobre espera.
            foreach ($respuestas as $i => $mensaje) {
                // Los textos fijos también pueden usar {nombre}. Así el modo de
                // respaldo conserva la personalización sin obligar al motor a
                // repetirla en cada rama.
                $mensaje = wabot_personalizar($mensaje, $conv);
                if ($i > 0 || !$avisado) wabot_escribiendo($conv, $id);
                $avisado = false;

                $tipeo = wabot_demora_tipeo($mensaje, $cfg);
                $falta = $i === 0 ? $tipeo - (microtime(true) - $arranque) : $tipeo;
                if ($falta > 0) usleep((int)($falta * 1000000));

                if (wabot_enviar($conv, $mensaje)) wabot_conv_transcript($conv, 'bot', $mensaje);
            }

            wabot_conv_save($conv);
            wabot_log('msg', ['tel' => $de, 'canal' => $canal, 'fase' => $conv['fase'], 'juntados' => count($tanda),
                              'in' => mb_substr($entrada, 0, 200),
                              'out' => $respuestas ? mb_substr(implode(' | ', $respuestas), 0, 200) : '']);

            // Lo que llegó mientras respondíamos es un turno nuevo, no pegado.
            $arranque = microtime(true);
        } while (wabot_cola_tiene($clave));
    } finally {
        wabot_lock_soltar($lock);
    }

    if (wabot_cola_tiene($clave)) {
        $lock2 = wabot_lock_tomar($clave);
        if ($lock2) {
            try {
                if (wabot_cola_tiene($clave)) {
                    wabot_log('cola_rescatada', ['tel' => $de, 'canal' => $canal]);
                    wabot_procesar_entrante_reintento($clave, $de, $canal, $cfg, $id);
                }
            } finally {
                wabot_lock_soltar($lock2);
            }
        }
    }
}

function wabot_procesar_entrante_reintento($clave, $de, $canal, $cfg, $id) {
    $tanda = wabot_cola_drenar($clave);
    if (!$tanda) return;
    $conv = wabot_conv_load($clave);
    wabot_conv_identidad_entrante($conv, $clave, $de, $canal);
    $usables = [];
    foreach ($tanda as $item) {
        wabot_conv_transcript($conv, 'cliente', $item['t'], $item['media'] ?? null);
        wabot_imagenes_contar($conv, $item['media'] ?? null);
        if (trim((string)($item['u'] ?? '')) !== '') $usables[] = $item['u'];
        if (!empty($item['n']) && empty($conv['nombre_confirmado'])) $conv['nombre'] = $item['n'];
    }
    $conv['ultimo_cliente_ts'] = time();
    wabot_logo_sincronizar($conv);
    $activo = !empty($cfg['activo']) && empty($conv['bot_off']) && time() >= (int)$conv['pausado_hasta'];
    if (!$activo || !$usables) {
        wabot_conv_save($conv);
        return;
    }
    $respuestas = wabot_sin_repetidos_consecutivos(wabot_responder(implode("\n", $usables), $conv, $cfg));
    foreach ($respuestas as $mensaje) {
        $mensaje = wabot_personalizar($mensaje, $conv);
        wabot_escribiendo($conv, $id);
        if (wabot_enviar($conv, $mensaje)) wabot_conv_transcript($conv, 'bot', $mensaje);
    }
    wabot_conv_save($conv);
}

/** Baja la media por donde corresponda: WhatsApp en dos pasos, Instagram directo. */
function wabot_bajar_media($canal, $media) {
    if (empty($media['ref'])) return null;
    return $canal === 'instagram'
        ? wabot_ig_media_bajar($media['ref'])
        : wabot_wa_media_bajar($media['ref']);
}

/* ── Instagram: otro formato de payload, mismo bot ──
   WhatsApp manda entry[].changes[].value.messages; Instagram manda
   entry[].messaging[] con la forma de Messenger. Se normaliza acá y de ahí en
   adelante todo el flujo es idéntico: misma cola, mismo candado, mismo motor. */
if (($payload['object'] ?? '') === 'instagram') {
    foreach (($payload['entry'] ?? []) as $entry) {
        foreach (($entry['messaging'] ?? []) as $ev) {
            $de = (string)($ev['sender']['id'] ?? '');
            $id = (string)($ev['message']['mid'] ?? '');
            if (!$de || !$id) continue;

            // Un eco puede ser nuestro bot o Pablo respondiendo desde Instagram.
            // Los mensajes del bot se reconocen por el id registrado al enviarlos;
            // cualquier otro eco pausa el bot y queda como respuesta humana.
            if (!empty($ev['message']['is_echo'])) {
                if (wabot_salida_es_bot($id)) continue;
                $para = (string)($ev['recipient']['id'] ?? '');
                if ($para === '' || in_array($para, wabot_ig_ids_propios(), true)) continue;
                $clave = 'ig' . $para;
                $textoEco = trim((string)($ev['message']['text'] ?? '[mensaje]'));

                // Si todavía no existe conversación con esta persona, este eco no
                // puede ser Pablo respondiendo a mano desde la app: no hay nada
                // que responder todavía. Es la respuesta automática de Instagram
                // al comentario en una publicación ("respuesta a comentarios"),
                // que manda el mensaje ANTES de que el cliente escriba. Tratarla
                // como si fuera Pablo pausaba el bot 24 h desde el minuto cero, y
                // el primer mensaje real del cliente caía en un chat ya pausado
                // — el síntoma que reportó Pablo: todo Instagram nuevo cae en
                // "Te esperan" aunque sea el primer mensaje.
                if (!wabot_conv_existe($clave)) continue;

                // El candado es el mismo que toma el envío: sin esto el eco podía
                // pisar la conversación mientras el bot todavía estaba mandando
                // la tanda de respuestas.
                $lockEco = wabot_lock_tomar($clave);
                if (!$lockEco) continue;   // está contestando el bot: el eco es suyo
                try {
                    $conv = wabot_conv_load($clave);
                    // Segundo filtro: si el texto es uno que el bot acaba de mandar,
                    // el eco es propio aunque el mid no coincida con el id enviado.
                    if (wabot_eco_es_propio($conv, $textoEco)) {
                        wabot_salida_bot_marcar($id);
                        continue;
                    }
                    wabot_conv_identidad_entrante($conv, $clave, $para, 'instagram');
                    $conv['pausado_hasta'] = time() + (int)($cfg['pausa_horas_humano'] ?? 24) * 3600;
                    $conv['handoff_pendiente'] = false;
                    wabot_conv_transcript($conv, 'humano', $textoEco);
                    wabot_evento($conv, 'humano_responde');
                    wabot_conv_save($conv);
                    wabot_log('pausa_humano', ['tel' => $para, 'canal' => 'instagram']);
                } finally {
                    wabot_lock_soltar($lockEco);
                }
                continue;
            }
            // Nuestra propia cuenta como emisor: mismo caso.
            if (in_array($de, wabot_ig_ids_propios(), true)) continue;

            wabot_procesar_entrante([
                'canal'            => 'instagram',
                'conversation_key' => 'ig' . $de,
                'channel_user_id'  => $de,
                'id'               => $id,
                'texto'            => trim((string)($ev['message']['text'] ?? '')),
                'nombre'           => '',
                'media'            => wabot_ig_adjunto($ev['message']['attachments'] ?? []),
            ], $cfg);
        }
    }
    exit;
}

foreach (($payload['entry'] ?? []) as $entry) {
    foreach (($entry['changes'] ?? []) as $cambio) {
        $campo = $cambio['field'] ?? '';
        $valor = $cambio['value'] ?? [];

        /* ── Coexistencia: Pablo contestó desde la app → pausar el bot en ese chat ── */
        if ($campo === 'smb_message_echoes') {
            foreach (($valor['message_echoes'] ?? []) as $eco) {
                $para = $eco['to'] ?? '';
                if (!$para) continue;
                $clave = preg_replace('/[^0-9]/', '', (string)$para);
                if ($clave === '') continue;
                $textoEco = (string)($eco['text']['body'] ?? '[mensaje]');

                // Mismo guard que en Instagram: el eco de un mensaje que mandó el
                // bot no puede pausar al bot. Ver wabot_eco_es_propio().
                $lockEco = wabot_lock_tomar($clave);
                if (!$lockEco) continue;
                try {
                    $conv = wabot_conv_load($clave);
                    if (wabot_eco_es_propio($conv, $textoEco)) continue;
                    wabot_conv_identidad_entrante($conv, $clave, (string)$para, 'whatsapp');
                    $horas = (int)($cfg['pausa_horas_humano'] ?? 24);
                    $conv['pausado_hasta'] = time() + $horas * 3600;
                    $conv['handoff_pendiente'] = false;
                    wabot_conv_transcript($conv, 'humano', $textoEco);
                    wabot_evento($conv, 'humano_responde');
                    wabot_conv_save($conv);
                    wabot_log('pausa_humano', ['tel' => $para, 'horas' => $horas]);
                } finally {
                    wabot_lock_soltar($lockEco);
                }
            }
            continue;
        }

        if ($campo !== 'messages') continue;
        if (!empty($valor['statuses'])) {
            // Meta acepta el envío en el momento (200 + message id) y recién acá,
            // asíncrono, avisa si en verdad nunca llegó — por ejemplo, la ventana
            // de 24hs se cerró un segundo después de nuestro chequeo. Antes esto
            // se descartaba entero y el fallo quedaba invisible para Pablo.
            foreach ($valor['statuses'] as $st) {
                if (($st['status'] ?? '') !== 'failed') continue;
                $clave = preg_replace('/[^0-9]/', '', (string)($st['recipient_id'] ?? ''));
                if ($clave === '') continue;
                $err = $st['errors'][0] ?? [];
                $motivo = trim((string)($err['title'] ?? '')) ?: (trim((string)($err['message'] ?? '')) ?: 'motivo desconocido');
                wabot_log('error', ['donde' => 'whatsapp_status_failed', 'tel' => $clave,
                    'wamid' => $st['id'] ?? '', 'codigo' => $err['code'] ?? null, 'motivo' => $motivo]);
                $conv = wabot_conv_load($clave);
                wabot_conv_transcript($conv, 'sistema', 'WhatsApp no pudo entregar el último mensaje (' . $motivo . '). Probá reenviarlo.');
                wabot_conv_save($conv);
            }
            continue;
        }

        // Meta manda el nombre del perfil de WhatsApp junto a los mensajes:
        // es el único nombre del cliente que tenemos, y va al boceto.
        $nombresPerfil = [];
        foreach (($valor['contacts'] ?? []) as $ct) {
            $wa = preg_replace('/[^0-9]/', '', (string)($ct['wa_id'] ?? ''));
            $nm = trim((string)($ct['profile']['name'] ?? ''));
            if ($wa !== '' && $nm !== '') $nombresPerfil[$wa] = $nm;
        }

        foreach (($valor['messages'] ?? []) as $msg) {
            $de = (string)($msg['from'] ?? '');
            $id = (string)($msg['id'] ?? '');
            if (!$de || !$id) continue;

            $clave = preg_replace('/[^0-9]/', '', $de);
            $tipo  = $msg['type'] ?? '';

            wabot_procesar_entrante([
                'canal'            => 'whatsapp',
                'conversation_key' => $clave,
                'channel_user_id'  => $de,
                'id'               => $id,
                'texto'            => $tipo === 'text' ? trim((string)($msg['text']['body'] ?? '')) : '',
                'nombre'           => $nombresPerfil[$clave] ?? '',
                'media'            => wabot_wa_adjunto($msg, $tipo),
                'referral'         => wabot_wa_referral($msg),
            ], $cfg);
        }
    }
}
