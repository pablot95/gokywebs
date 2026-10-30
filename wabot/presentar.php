<?php
/**
 * wabot/presentar.php — el botón «Presentar» del admin (mandarle la demo al
 * cliente por el bot) y su versión automática.
 *
 * Presentación automática (Pablo, 18-oct; turnos del 30-oct en
 * wabot_presentar_turno: antes de las 11 → 14 h, de 11 a 15 → 18 h, desde las
 * 15 → 14 h del día siguiente). El boceto es la
 * propuesta que nace con el formulario, así que manda su createdAt: es la misma
 * hora con la que el bot le prometió «hoy a la tarde» o «mañana»
 * (wabot_form_confirmacion_texto, corte de las 15 h). Lo corre seguimiento.php
 * (cron :00 y :30). Si la demo todavía no está en demo/<slug>/, espera.
 *
 * La propuesta no se convierte acá: se le escribe `autoPresentada` (lo mismo
 * que devuelve el botón + el id del cliente) y el admin, al abrirse, la pasa a
 * Seguimiento con el mismo código del botón (dashboard.js,
 * finalizarAutoPresentadas). Así el plan y los precios no se copian a PHP.
 *
 * Hora elegida (Pablo, 29-oct: «quiero que envíes automáticamente cada boceto,
 * si está terminado, en cada horario seleccionado»): el formulario pregunta a
 * qué hora quiere la demo (wabot_demo_horas_ventana) y el boceto la trae en
 * `demoProgramadaAt`. Esos salen a esa hora aunque la presentación de las
 * 18/14 h siga apagada (`presentar_hora_elegida: false` los apaga). Si a la
 * hora la demo no está publicada, avisa a Pablo enseguida y sale apenas esté.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

// Las propuestas de antes de esto no se presentan solas (las presenta Pablo como siempre).
const WABOT_PRESENTAR_AUTO_DESDE = '2026-10-18T03:00:00Z';   // 18-oct, 00:00 en Argentina
const WABOT_PRESENTAR_AUTO_OAUTH = WABOT_DATA . '/firestore-oauth.json';
const WABOT_PRESENTAR_AUTO_ESPERA = WABOT_DATA . '/presentar-auto-espera.json';

/* ── El botón Presentar ─────────────────────────────────────────────────── */

/**
 * Le manda al cliente los dos mensajes de la demo (link + pedido de feedback)
 * desde el bot. $in: tel, negocio, nombre, tipo, cliente_id (lo que manda el
 * admin). Devuelve lo que el panel necesita para avisar o mostrar el texto a
 * mano. Lo usan admin.php (botón) y wabot_presentar_auto_correr().
 */
function wabot_presentar_muestra(array $in, $cfg) {
    $negocio = trim((string)($in['negocio'] ?? ''));
    $slug = $negocio !== '' ? wabot_slug_demo($negocio) : '';
    if ($slug === '') return ['error' => 'No se pudo armar el link de la demo: falta el nombre del negocio.'];

    $clave = wabot_conv_resolver((string)($in['tel'] ?? ''), $motivo);
    if ($clave === null) {
        $tipo = trim((string)($in['tipo'] ?? ''));
        $textoConv = [
            'tipo' => array_key_exists($tipo, (array)($cfg['muestra_presentar_por_tipo'] ?? [])) ? $tipo : '',
            'nombre_negocio' => $negocio,
            'nombre' => trim((string)($in['nombre'] ?? '')),
        ];
        $textos = wabot_muestra_presentar_textos($slug, $cfg, $textoConv);
        wabot_log('presentar_muestra_sin_chat', ['tel' => (string)($in['tel'] ?? ''), 'motivo' => $motivo, 'slug' => $slug]);
        return ['ok' => true, 'enviado' => false, 'sin_chat' => true, 'slug' => $slug,
                'textos' => $textos, 'textos_enviados' => array_fill(0, count($textos), false)];
    }
    $conv = wabot_conv_load($clave);

    // Presentar manda la demo y cambia de etapa, pero el chat sigue en
    // manos de Pablo: nunca reactiva el bot por detrás.
    wabot_conv_preparar_postdemo($conv);
    $conv['presentado_ts'] = time();
    $conv['presentado_slug'] = $slug;
    $conv['presentado_confirmado'] = false;
    $conv['presentado_via_bot'] = false;
    $conv['presentado_recordatorio_enviado'] = false;
    $conv['presentado_recordatorio_ts'] = 0;
    $conv['confirmacion_demo_enviada'] = false;
    $conv['confirmacion_demo_ts'] = 0;
    $conv['confirmacion_demo_auto_intento_ts'] = 0;
    $conv['cliente_id'] = trim((string)($in['cliente_id'] ?? '')) ?: null;

    /* Se manda mensaje por mensaje y se mira CADA uno por separado.
     *
     * Antes era todo o nada: si el primero salía y el segundo no, se
     * reportaba fracaso total y el panel le decía a Pablo que la mandara a
     * mano — o sea, mandarle al cliente el link dos veces. Pasó de verdad:
     * "se envió bien el mensaje pero el aviso decía que no se pudo".
     *
     * El PRIMERO es el que lleva el link: ese es el que define si la demo
     * llegó. El seguimiento posterior queda disponible como botón manual. El
     * segundo (el pedido de feedback) es un extra; que falle no cambia que
     * el cliente ya tiene la demo.
     *
     * Ojo con leer un false como "no llegó": wabot_wa_send_text() corta a
     * los 20 s, así que un timeout con Meta lenta devuelve false igual con
     * el mensaje entregado. Por eso el panel avisa que hay que mirar el
     * chat antes de reenviar, en vez de mandar a reenviar de una. */
    /* Sin ventana de 24 h no se manda nada. El que llegó por el formulario
     * y nunca escribió por WhatsApp tiene el chat cerrado para Meta: el
     * envío se pierde sin aviso y en el panel queda como si hubiera salido.
     * Pasó el 21-sep con Pescadería Las Grutas, que cargó su número en el
     * formulario y nunca habló con el bot: la demo salió al vacío. El
     * estado igual avanza, porque el link lo manda Pablo a mano. */
    $textos = wabot_muestra_presentar_textos($slug, $cfg, $conv);
    $fueraVentana = wabot_ventana_restante($conv) <= 0;
    $enviados = 0;
    $textosEnviados = array_fill(0, count($textos), false);
    foreach ($fueraVentana ? [] : $textos as $i => $texto) {
        // Un respiro entre los dos: mandarlos pegados hace que Meta a veces
        // los entregue al revés, y el segundo no tiene sentido antes del link.
        if ($i > 0) sleep(1);
        if (!wabot_enviar($conv, $texto)) {
            // Sin el enlace confirmado, no enviar el pedido de feedback solo.
            if ($i === 0) break;
            continue;
        }
        wabot_conv_transcript($conv, 'bot', $texto);
        $textosEnviados[$i] = true;
        $enviados++;
        if ($i === 0) $conv['presentado_via_bot'] = true;
    }
    $total   = count($textos);
    $enviado = $enviados === $total;

    // Le llegó la demo: para Meta es un lead calificado ('Schedule' no existe en mensajería).
    wabot_capi_evento($conv, 'QualifiedLead', $cfg);
    wabot_conv_save($conv);
    wabot_log('presentar_muestra', ['tel' => $conv['tel'], 'slug' => $slug,
                                    'enviados' => $enviados, 'total' => $total,
                                    'fuera_ventana' => $fueraVentana,
                                    'auto' => !empty($in['auto'])]);

    return [
        'ok'       => true,
        'enviado'  => $enviado,
        'enviados' => $enviados,
        'total'    => $total,
        'fuera_ventana' => $fueraVentana,
        // Nunca escribió por WhatsApp: llegó por el formulario o por otro lado.
        'nunca_escribio' => (int)($conv['ultimo_cliente_ts'] ?? 0) === 0,
        'demo_ok'  => !empty($conv['presentado_via_bot']),   // el mensaje con el link
        'slug'     => $slug,
        'textos'   => $textos,
        'textos_enviados' => $textosEnviados,
        // Por dónde salió: el panel decía "por WhatsApp" siempre, y desde
        // que los leads de Instagram se resuelven también, eso puede ser
        // mentira (28-ago).
        'canal'    => wabot_canal($conv),
    ];
}

/* ── Cuándo sale sola ───────────────────────────────────────────────────── */

/**
 * El momento en que se presenta un boceto creado en $creadoTs (reloj argentino,
 * UTC-3 fijo, como wabot_dia_entrega). Pablo, 30-oct: «si lo llenó antes de las
 * 11, a las 14 h; entre las 11 y las 15, a las 18 h; desde las 15 hasta las 11
 * del día siguiente, a las 14 h»:
 *   00:00 a 10:59 → ese día a las 14:00
 *   11:00 a 14:59 → ese día a las 18:00
 *   15:00 a 23:59 → al día siguiente a las 14:00
 */
function wabot_presentar_turno($creadoTs) {
    $local = (int)$creadoTs - 3 * 3600;
    $hora = (int)gmdate('G', $local);
    [$a, $m, $d] = array_map('intval', explode('-', gmdate('Y-m-d', $local)));
    if ($hora < 11) return gmmktime(14 + 3, 0, 0, $m, $d, $a);
    if ($hora < 15) return gmmktime(18 + 3, 0, 0, $m, $d, $a);
    return gmmktime(14 + 3, 0, 0, $m, $d + 1, $a);
}

/** El tipo de web como lo espera wabot_muestra_presentar_textos (igual que enviarMuestraWhatsapp del admin). */
function wabot_presentar_auto_tipo(array $p) {
    $tipo = (string)($p['tipoDetectado'] ?? '') ?: (string)($p['tipo_web'] ?? '') ?: (string)($p['tipoDetectadoLabel'] ?? '');
    $t = wabot_normalizar_busqueda($tipo);
    if ($t === '' || preg_match('/noticia/', $t)) return '';
    if (preg_match('/inmobil|propiedad|bienes raices/', $t)) return 'inmobiliaria';
    if (preg_match('/e-?commerce|tienda|catalogo|shop|carrito/', $t)) return 'ecommerce';
    if (preg_match('/e-?learning|\blms\b|curso|academia/', $t)) return 'elearning';
    if (preg_match('/landing|sitio|profesional|institucional|turno|reserva|web.?completa|portfolio/', $t)) return 'landing';
    return '';
}

/** ¿Ya está publicada la demo? (la carpeta del sitio, al lado de wabot/). */
function wabot_presentar_hay_demo($slug) {
    return $slug !== '' && is_file(dirname(__DIR__) . '/demo/' . $slug . '/index.html');
}

/** Un id de documento como los de Firestore (20 letras y números). */
function wabot_presentar_id_nuevo() {
    $abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $id = '';
    for ($i = 0; $i < 20; $i++) $id .= $abc[random_int(0, 61)];
    return $id;
}

/* ── Firestore con la cuenta de servicio ──────────────────────────────── */

function wabot_presentar_fs_token() {
    $guardado = json_decode((string)@file_get_contents(WABOT_PRESENTAR_AUTO_OAUTH), true);
    if (is_array($guardado) && !empty($guardado['token']) && (int)($guardado['vence'] ?? 0) > time() + 60) {
        return (string)$guardado['token'];
    }
    $sa = wabot_push_cuenta();
    if (!$sa) throw new RuntimeException('Falta config/service-account.json.');
    $b64 = function ($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); };
    $ahora = time();
    $cuerpo = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])) . '.' . $b64(json_encode([
        'iss' => $sa['client_email'], 'scope' => 'https://www.googleapis.com/auth/datastore',
        'aud' => 'https://oauth2.googleapis.com/token', 'iat' => $ahora, 'exp' => $ahora + 3600,
    ]));
    if (!openssl_sign($cuerpo, $firma, $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('No se pudo firmar el token de Firestore.');
    }
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                                                'assertion' => $cuerpo . '.' . $b64($firma)]),
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    ]);
    $d = json_decode((string)curl_exec($ch), true);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || empty($d['access_token'])) throw new RuntimeException('Google no dio el token (HTTP ' . $http . ').');
    wabot_json_guardar_atomico(WABOT_PRESENTAR_AUTO_OAUTH, ['token' => $d['access_token'], 'vence' => $ahora + (int)($d['expires_in'] ?? 3600)]);
    return (string)$d['access_token'];
}

function wabot_presentar_fs_leer(array $v) {
    foreach (['stringValue', 'timestampValue', 'referenceValue'] as $k) if (array_key_exists($k, $v)) return $v[$k];
    foreach (['integerValue', 'doubleValue'] as $k) if (array_key_exists($k, $v)) return (float)$v[$k];
    if (array_key_exists('booleanValue', $v)) return (bool)$v['booleanValue'];
    if (isset($v['arrayValue'])) return array_map('wabot_presentar_fs_leer', $v['arrayValue']['values'] ?? []);
    if (isset($v['mapValue'])) return array_map('wabot_presentar_fs_leer', $v['mapValue']['fields'] ?? []);
    return null;
}

function wabot_presentar_fs_valor($x) {
    if (is_bool($x)) return ['booleanValue' => $x];
    if (is_int($x)) return ['integerValue' => (string)$x];
    if (is_float($x)) return ['doubleValue' => $x];
    if ($x === null) return ['nullValue' => null];
    if (is_array($x)) {
        if ($x === [] || array_keys($x) === range(0, count($x) - 1)) {
            return ['arrayValue' => ['values' => array_map('wabot_presentar_fs_valor', $x)]];
        }
        return ['mapValue' => ['fields' => array_map('wabot_presentar_fs_valor', $x)]];
    }
    return ['stringValue' => (string)$x];
}

/** Las propuestas creadas desde $desdeTs: [id => campos]. */
function wabot_presentar_fs_propuestas($desdeTs) {
    $sa = wabot_push_cuenta();
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents:runQuery');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['structuredQuery' => [
            'from' => [['collectionId' => 'propuestas']],
            'where' => ['fieldFilter' => ['field' => ['fieldPath' => 'createdAt'], 'op' => 'GREATER_THAN_OR_EQUAL',
                                          'value' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z', $desdeTs)]]],
        ]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_presentar_fs_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
    ]);
    $filas = json_decode((string)curl_exec($ch), true);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas)) throw new RuntimeException('No se pudo leer propuestas (HTTP ' . $http . ').');
    $docs = [];
    foreach ($filas as $f) {
        if (empty($f['document']['name'])) continue;
        $docs[basename($f['document']['name'])] = array_map('wabot_presentar_fs_leer', $f['document']['fields'] ?? []);
    }
    return $docs;
}

/** Le escribe autoPresentada a la propuesta (solo si todavía existe: si Pablo ya la presentó, no la revive). */
function wabot_presentar_fs_marcar($id, array $marca) {
    $sa = wabot_push_cuenta();
    $url = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents/propuestas/'
         . rawurlencode($id) . '?updateMask.fieldPaths=autoPresentada&currentDocument.exists=true';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => ['autoPresentada' => wabot_presentar_fs_valor($marca)]], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_presentar_fs_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http < 200 || $http >= 300) {
        wabot_log('error', ['donde' => 'presentar_auto_marcar', 'id' => $id, 'http' => $http, 'res' => mb_substr((string)$res, 0, 200)]);
        return false;
    }
    return true;
}

/* ── La corrida ─────────────────────────────────────────────────────────── */

/**
 * Presenta los bocetos a los que les llegó el turno y ya tienen la demo
 * publicada. Solo de 9 a 22 h (una demo que se publica de noche sale a la
 * mañana). Cada propuesta se intenta una vez: el resultado queda en
 * `autoPresentada` y, si no salió, la manda Pablo desde Bocetos (le llega un
 * push). Si la demo no aparece a las 4 h del turno, también avisa (una vez).
 *
 * Para los tests: $propuestas, $presentar(datos), $marcar(id, marca),
 * $hayDemo(slug) y $avisar(titulo, cuerpo) reemplazan la red y el disco.
 */
function wabot_presentar_auto_correr($cfg, $ahora = null, $propuestas = null, $presentar = null, $marcar = null, $hayDemo = null, $avisar = null) {
    $ahora = $ahora ?? time();
    $res = ['revisadas' => 0, 'presentadas' => 0, 'sin_enviar' => 0, 'esperando_demo' => 0, 'detalle' => []];
    // La del turno (sin hora elegida): apagada el 20-oct y prendida otra vez el 30-oct (Pablo:
    // «prendela»); corre salvo `presentar_auto: false`.
    // La de la hora que eligió el cliente (29-oct) corre salvo `presentar_hora_elegida: false`.
    $porTurno = (((array)$cfg)['presentar_auto'] ?? true) !== false;
    $porHora = (((array)$cfg)['presentar_hora_elegida'] ?? true) !== false;
    if (!$porTurno && !$porHora) return $res + ['apagado' => true];
    $hora = wabot_hora_local($ahora);
    $horaDecente = $hora >= 9 && $hora < 22;

    $presentar = $presentar ?? function ($datos) use ($cfg) { return wabot_presentar_muestra($datos, $cfg); };
    $marcar = $marcar ?? 'wabot_presentar_fs_marcar';
    $hayDemo = $hayDemo ?? 'wabot_presentar_hay_demo';
    $avisar = $avisar ?? function ($t, $c) { return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/admin/dashboard.html']); };
    $desde = max(strtotime(WABOT_PRESENTAR_AUTO_DESDE), $ahora - 7 * 86400);
    try {
        $propuestas = $propuestas ?? wabot_presentar_fs_propuestas($desde);
    } catch (Throwable $e) {
        wabot_log('error', ['donde' => 'presentar_auto', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        return $res + ['error' => $e->getMessage()];
    }
    $espera = json_decode((string)@file_get_contents(WABOT_PRESENTAR_AUTO_ESPERA), true);
    if (!is_array($espera)) $espera = [];
    $esperaCambio = false;

    foreach ($propuestas as $id => $p) {
        if (!empty($p['autoPresentada'])) continue;
        $creado = strtotime((string)($p['createdAt'] ?? ''));
        if (!$creado || $creado < $desde) continue;
        // La hora que eligió en el formulario manda; sin ella, el turno de las 18/14 h.
        $programada = (int)strtotime((string)($p['demoProgramadaAt'] ?? ''));
        if ($programada > 0 ? !$porHora : !$porTurno) continue;
        $res['revisadas']++;
        $turno = $programada > 0 ? $programada : wabot_presentar_turno($creado);
        if ($ahora < $turno) {
            // Falta una hora para la que eligió y la demo no está: aviso a Pablo (una vez).
            if ($programada > 0 && $turno - $ahora <= 3600 && empty($espera['antes:' . $id])) {
                $negocio = trim((string)($p['nombre_negocio'] ?? '')) ?: trim((string)($p['rubro'] ?? ''));
                $slug = wabot_slug_demo($negocio);
                if ($slug !== '' && !$hayDemo($slug)) {
                    $avisar('Demo para las ' . sprintf('%02d:00', wabot_hora_local($turno)), $negocio . ' pidió la demo a esa hora y todavía no está demo/' . $slug . '/. Sale sola apenas la publiques.');
                    $espera['antes:' . $id] = $ahora;
                    $esperaCambio = true;
                }
            }
            continue;
        }
        /* Fuera de 9 a 22 h no sale nada... salvo en las 2 horas que siguen a la
         * hora que eligió él (puede elegir hasta la 1 de la mañana). Una demo
         * que se publica tarde sale a la mañana. */
        if (!$horaDecente && !($programada > 0 && $ahora < $turno + 2 * 3600)) continue;

        $negocio = trim((string)($p['nombre_negocio'] ?? '')) ?: trim((string)($p['rubro'] ?? ''));
        $tel = trim((string)($p['telefono'] ?? '')) ?: trim((string)($p['contacto_cel'] ?? ''));
        $slug = wabot_slug_demo($negocio);
        if ($slug !== '' && !$hayDemo($slug)) {
            $res['esperando_demo']++;
            $res['detalle'][] = ['id' => $id, 'slug' => $slug, 'estado' => 'esperando_demo'];
            // A la hora que eligió él, el aviso es enseguida: ya se le prometió.
            if ($ahora - $turno >= ($programada > 0 ? 0 : 4 * 3600) && empty($espera[$id])) {
                $avisar('Demo sin publicar', $programada > 0
                    ? 'A ' . $negocio . ' le prometimos la demo a las ' . sprintf('%02d:00', wabot_hora_local($turno)) . ' y no está demo/' . $slug . '/. Sale sola apenas la publiques.'
                    : 'Le tocaba presentarse a ' . $negocio . ' y no está demo/' . $slug . '/. Presentala a mano cuando esté.');
                $espera[$id] = $ahora;
                $esperaCambio = true;
            }
            continue;
        }

        $clienteId = wabot_presentar_id_nuevo();
        $envio = ($negocio === '' || $tel === '')
            ? ['error' => 'Falta teléfono o nombre del negocio: avisale la muestra a mano.']
            : $presentar(['tel' => $tel, 'negocio' => $negocio, 'nombre' => trim((string)($p['nombre'] ?? '')) ?: (string)($p['contacto_nombre'] ?? ''),
                          'tipo' => wabot_presentar_auto_tipo($p), 'cliente_id' => $clienteId, 'auto' => true]);
        $marca = [
            'ts' => gmdate('Y-m-d\TH:i:s\Z', $ahora),
            'turno' => gmdate('Y-m-d\TH:i:s\Z', $turno),
            'hora_elegida' => $programada > 0,
            'clienteId' => $clienteId,
            'slug' => (string)($envio['slug'] ?? $slug),
            'demo_ok' => !empty($envio['demo_ok']),
            'enviado' => !empty($envio['enviado']),
            'fuera_ventana' => !empty($envio['fuera_ventana']),
            'nunca_escribio' => !empty($envio['nunca_escribio']),
            'sin_chat' => !empty($envio['sin_chat']),
            'canal' => (string)($envio['canal'] ?? ''),
            'error' => (string)($envio['error'] ?? ''),
            'textos' => array_values(array_map('strval', (array)($envio['textos'] ?? []))),
            'textos_enviados' => array_values(array_map('boolval', (array)($envio['textos_enviados'] ?? []))),
        ];
        $marcar($id, $marca);
        if ($marca['demo_ok']) {
            $res['presentadas']++;
            $avisar('Demo presentada sola', 'Le mandé la demo a ' . $negocio . ' (' . $marca['slug'] . ').');
        } else {
            $res['sin_enviar']++;
            $motivo = $marca['error'] !== '' ? $marca['error']
                : ($marca['fuera_ventana'] ? 'la ventana de 24 h de WhatsApp está cerrada' : ($marca['sin_chat'] ? 'no hay chat con el bot' : 'el bot no pudo confirmar el envío'));
            $avisar('Demo sin enviar', 'No pude mandarle sola la demo a ' . $negocio . ': ' . $motivo . '. Mandala a mano desde Bocetos.');
        }
        $res['detalle'][] = ['id' => $id, 'slug' => $marca['slug'], 'estado' => $marca['demo_ok'] ? 'presentada' : 'sin_enviar'];
    }
    if ($esperaCambio) wabot_json_guardar_atomico(WABOT_PRESENTAR_AUTO_ESPERA, $espera);
    if ($res['presentadas'] || $res['sin_enviar']) wabot_log('presentar_auto', ['presentadas' => $res['presentadas'], 'sin_enviar' => $res['sin_enviar']]);
    return $res;
}
