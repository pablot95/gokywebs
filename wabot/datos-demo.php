<?php
/**
 * wabot/datos-demo.php — los datos de la demo se piden por el chat (Pablo, 9-nov-2026).
 *
 * «No se envía más el link del formulario. El bot en lugar de dar form, pide los
 * datos … y el bot arma el prospecto, obvio.»
 *
 * Cómo encaja en lo que ya había:
 *  - El pedido reemplaza al link de /form/ en el mismo lugar: wabot_oferta_diseno_form_texto()
 *    (engine.php), que usan el flujo comercial (accion `formulario`), el borde viejo
 *    (redactor.php, postprecio.php) y el botón «form» del panel. El texto es el de Pablo
 *    (`datos_demo_pedido`) con la lista de lo que pedía el formulario (`datos_demo_lista`).
 *  - La charla queda en el mismo estado que con el link mandado (`link_form_enviado`,
 *    `form_link_mandado_ts`, estado `formulario`): el embudo («Aceptaron la demo»), la
 *    columna del panel y las reglas de después del link siguen iguales. La marca propia
 *    es `datos_pedidos_ts`, que pone wabot_conv_transcript() al anotar el mensaje (también
 *    si lo manda Pablo desde el panel).
 *  - Lo que el cliente contesta lo lee GPT con un JSON estricto (wabot_datos_demo_extraer):
 *    ¿son los datos o es otra cosa?, y cada campo del formulario por separado. Con los datos
 *    se completa la charla igual que wabot_form_lead_procesar() (nombre_negocio, descripcion,
 *    colores, instagram, referencia, incluir) y se crea la MISMA ficha de `propuestas` con
 *    wabot_firestore_lead(): Copiar 10, la demo automática y Presentar no cambian.
 *  - Después, lo mismo que el formulario completo: `form_completado_ts`, el bot se apaga
 *    en el chat (salvo «Bot después de la demo») y la ficha queda para Pablo. La
 *    confirmación sale en el mismo turno, no a los 5 minutos.
 *  - Lo que no son los datos (una duda, un «ok», «después te paso») sigue el camino de
 *    siempre: el flujo comercial contesta lo simple y lo demás lo ve Pablo.
 *  - `datos_por_chat` false (Ajustes → IA) vuelve al link del formulario. Las suites viejas
 *    corren con el link (WABOT_TEST_FORM_LINK en test-lib.php); test-datos-demo.php prueba esto.
 */

/** ¿Pedimos los datos por el chat en vez de mandar el link del formulario? */
function wabot_datos_por_chat($cfg) {
    if (!empty($GLOBALS['WABOT_TEST_FORM_LINK'])) return false;
    if (!is_array($cfg) || !array_key_exists('datos_por_chat', $cfg)) return true;
    return !empty($cfg['datos_por_chat']);
}

/** Minúsculas sin tildes ni puntuación, para comparar textos. */
function wabot_datos_demo_norm($texto) {
    $t = mb_strtolower(trim((string)$texto));
    $t = strtr($t, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n']);
    $t = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $t);
    return trim(preg_replace('/\s+/u', ' ', $t));
}

/**
 * Las líneas del pedido: lo mismo que pedía el formulario, en su orden. En
 * Instagram se suma el WhatsApp: del IGSID no sale ningún teléfono y sin él la
 * demo no tiene a dónde ir (lo mismo que exigía wabot_cerrar_o_pedir_whatsapp).
 */
function wabot_datos_demo_lista($conv, $cfg) {
    $lista = (array)($cfg['datos_demo_lista'] ?? []);
    if (wabot_canal($conv) === 'instagram') $lista = array_merge($lista, (array)($cfg['datos_demo_lista_instagram'] ?? []));
    $out = [];
    foreach ($lista as $l) {
        $l = trim(ltrim(trim((string)$l), "-–• "));
        if ($l !== '') $out[] = $l;
    }
    return $out;
}

/**
 * El mensaje que va en lugar del link del formulario. Vacío si ya tenemos los
 * datos (formulario completo o ficha creada: al que ya los dio nunca se le
 * vuelven a pedir) o si la charla no tiene canal.
 */
function wabot_datos_demo_texto($conv, $cfg) {
    if ((int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['lead_creado'])) return '';
    if (wabot_channel_user_id($conv) === '') return '';
    $intro = trim((string)($cfg['datos_demo_pedido'] ?? ''));
    if ($intro === '') return '';
    $lista = implode("\n", array_map(function ($l) { return '- ' . $l; }, wabot_datos_demo_lista($conv, $cfg)));
    $texto = strpos($intro, '{lista}') !== false ? str_replace('{lista}', $lista, $intro) : rtrim($intro) . "\n" . $lista;
    return trim(function_exists('wabot_personalizar') ? wabot_personalizar($texto, $conv) : $texto);
}

/**
 * ¿Este texto es el pedido de datos? Se reconoce por la primera línea del
 * texto configurado (y por la de fábrica, por si Pablo lo editó en Ajustes):
 * así el panel y el embudo lo cuentan igual si lo mandó el bot o Pablo a mano.
 */
function wabot_texto_pide_datos_demo($texto, $cfg = null) {
    $t = wabot_datos_demo_norm($texto);
    if ($t === '') return false;
    $candidatos = [];
    $fabrica = function_exists('wabot_textos_default') ? (string)(wabot_textos_default()['datos_demo_pedido'] ?? '') : '';
    foreach ([(string)($cfg['datos_demo_pedido'] ?? ''), $fabrica] as $intro) {
        $primera = trim((string)(explode("\n", str_replace('{lista}', '', $intro))[0] ?? ''));
        $n = wabot_datos_demo_norm($primera);
        // Con la mitad de la primera línea alcanza: una coma o un punto cambiados no lo esconden.
        if ($n !== '') $candidatos[] = mb_substr($n, 0, max(24, (int)floor(mb_strlen($n) * 0.6)));
    }
    foreach (array_unique($candidatos) as $c) {
        if ($c !== '' && mb_strpos($t, $c) !== false) return true;
    }
    return false;
}

/** ¿Le pedimos los datos y todavía no los mandó? */
function wabot_datos_demo_pendiente($conv) {
    return (int)($conv['datos_pedidos_ts'] ?? 0) > 0
        && (int)($conv['form_completado_ts'] ?? 0) <= 0
        && empty($conv['lead_creado']);
}

/**
 * Todo lo que escribió el cliente desde que se le pidieron los datos, en orden.
 * Lo que manda de a varios mensajes («Pelu Mari», «hago cortes y color», «negro
 * y dorado») se lee junto. La descripción automática de una foto no es un dato
 * suyo y se saltea; el epígrafe de la foto y la transcripción de un audio sí.
 */
function wabot_datos_demo_texto_cliente($conv) {
    $t = (array)($conv['transcript'] ?? []);
    $desde = (int)($conv['datos_pedidos_ts'] ?? 0);
    // Desde el renglón del pedido (por si varios mensajes comparten el segundo).
    $inicio = 0;
    foreach ($t as $i => $fila) {
        if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true) && wabot_texto_pide_datos_demo((string)($fila['t'] ?? ''))) { $inicio = $i + 1; break; }
    }
    $partes = [];
    foreach ($t as $i => $fila) {
        if (($fila['q'] ?? '') !== 'cliente') continue;
        if ($inicio > 0 ? $i < $inicio : (int)($fila['ts'] ?? 0) < $desde) continue;
        $texto = trim((string)($fila['t'] ?? ''));
        if ($texto === '') continue;
        if (preg_match('/^\[(foto|imagen|documento|video|sticker)\]\s*/iu', $texto)) {
            $texto = trim((string)preg_replace('/^\[(foto|imagen|documento|video|sticker)\]\s*/iu', '', $texto));
            // «epígrafe\n(descripción)»: queda el epígrafe. Sin epígrafe es solo la descripción: afuera.
            if (strpos($texto, "\n(") === false) continue;
            $texto = trim((string)substr($texto, 0, strpos($texto, "\n(")));
        } elseif (preg_match('/^\[[a-záéíóú]+\]$/iu', $texto)) {
            continue;   // «[audio]», «[documento]»: nada que leer
        } else {
            $texto = trim((string)preg_replace('/^\[audio\]\s*/iu', '', $texto));
        }
        if ($texto !== '') $partes[] = $texto;
    }
    return trim(implode("\n", $partes));
}

/** El esquema estricto con el que GPT devuelve los datos: uno por campo del formulario. */
function wabot_datos_demo_esquema() {
    $s = function ($d) { return ['type' => 'string', 'description' => $d]; };
    return ['type' => 'json_schema', 'name' => 'datos_demo_v1', 'strict' => true, 'schema' => [
        'type' => 'object', 'additionalProperties' => false,
        'required' => ['es_datos', 'nombre_negocio', 'resumen', 'instagram', 'colores', 'referencia', 'incluir', 'whatsapp'],
        'properties' => [
            'es_datos'       => ['type' => 'boolean', 'description' => 'true si el cliente está pasando al menos uno de los datos pedidos para la demo (nombre del negocio, qué ofrece, Instagram, colores, referencia, qué incluir, WhatsApp). false si es una pregunta, un acuse (ok, dale, gracias), una postergación (después te paso, mañana te mando) o cualquier otra cosa.'],
            'nombre_negocio' => $s('El nombre del negocio o la marca, tal cual lo escribió (sin "mi negocio se llama"). Vacío si no lo dijo.'),
            'resumen'        => $s('Qué ofrece: productos o servicios, rubro, zona, a quién le vende. Con sus palabras, corregidas solo en ortografía. Vacío si no lo dijo.'),
            'instagram'      => $s('El usuario de Instagram sin @ ni link (de "@pelumari" o "instagram.com/pelumari" queda "pelumari"). Vacío si no lo dio.'),
            'colores'        => $s('Los colores de la marca como los dijo ("negro y dorado", "#2563EB y blanco"). Vacío si no los dijo o dijo que los elijamos nosotros.'),
            'referencia'     => $s('La web o el estilo que le gusta como referencia (link o nombre). Vacío si no dio ninguna o dijo que no tiene.'),
            'incluir'        => $s('Lo que quiere sí o sí en la web (galería, mapa, horarios, turnos…). Vacío si no pidió nada.'),
            'whatsapp'       => $s('El número de WhatsApp que dio para que le mandemos la demo, con los dígitos tal cual. Vacío si no dio ninguno.'),
        ],
    ]];
}

/** Las instrucciones de la extracción. Fijas: con la misma clave de caché, OpenAI las cobra como caché. */
function wabot_datos_demo_instrucciones() {
    return "Sos el asistente de Gokywebs, una agencia argentina que hace páginas web. Le pedimos a un cliente por WhatsApp los datos para armarle la demo gratis de su web: nombre del negocio o marca, qué ofrece, Instagram, colores de la marca, una web de referencia, qué quiere incluir sí o sí, logo y fotos (y, si la charla es por Instagram, su número de WhatsApp).\n"
        . "Te paso lo que ya sabemos de la charla y lo que escribió desde que se lo pedimos. Devolvé el JSON del esquema:\n"
        . "- es_datos: true solo si está pasando al menos uno de esos datos. Una pregunta, un acuse (\"ok\", \"dale\", \"gracias\"), una postergación (\"después te paso\", \"mañana te mando los datos\") o un comentario que no aporta datos es false.\n"
        . "- Cada campo con lo que dijo, sin inventar ni completar con lo que ya sabíamos: lo que no dijo en estos mensajes va vacío. No deduzcas el nombre del negocio del rubro.\n"
        . "- resumen: lo que ofrece con sus palabras; podés juntar varios mensajes en un párrafo. Sin colores, Instagram, referencia ni pedidos de funciones: esos van en su campo.\n"
        . "- Si dice que los colores los elijamos nosotros o que no tiene, colores vacío. Si dice que no tiene Instagram o referencia, vacío.";
}

/** Lo que ya sabemos, para que el extractor no lo pida de nuevo ni lo invente. */
function wabot_datos_demo_contexto_conocido($conv) {
    $f = function_exists('wabot_ficha') ? wabot_ficha($conv) : [];
    $lineas = [];
    $negocio = trim((string)($conv['nombre_negocio'] ?? ''));
    if ($negocio !== '') $lineas[] = 'Nombre del negocio que ya dijo: ' . $negocio;
    $rubro = trim((string)($f['que_vende'] ?? '')) ?: trim((string)($f['rubro'] ?? ''));
    if ($rubro !== '') $lineas[] = 'A qué se dedica, según la charla: ' . $rubro;
    $canal = wabot_canal($conv) === 'instagram' ? 'Instagram (hace falta su WhatsApp)' : 'WhatsApp (el número ya lo tenemos)';
    $lineas[] = 'Canal: ' . $canal;
    return implode("\n", $lineas);
}

/**
 * GPT lee lo que mandó. Devuelve el JSON del esquema o null si la API no
 * contestó (ahí decide wabot_datos_demo_extraer_reglas).
 */
function wabot_datos_demo_extraer($textoCliente, $conv, $cfg) {
    if (!function_exists('wabot_openai_llamar')) return null;
    $entrada = "LO QUE YA SABEMOS\n" . wabot_datos_demo_contexto_conocido($conv)
        . "\n\nLO QUE ESCRIBIÓ DESDE QUE LE PEDIMOS LOS DATOS\n" . mb_substr((string)$textoCliente, 0, 6000);
    $esfuerzo = function_exists('wabot_openai_esfuerzo') && wabot_openai_esfuerzo($cfg) === 'none' ? 'none' : 'low';
    $r = wabot_openai_llamar('datos_demo', wabot_datos_demo_instrucciones(), $entrada, wabot_datos_demo_esquema(), $cfg,
        ['usuario' => wabot_conversation_key($conv), 'max_tokens' => 900, 'esfuerzo' => $esfuerzo]);
    if (empty($r['ok']) || !is_array($r['datos'])) {
        wabot_log('datos_demo_extraer_fallo', ['tel' => $conv['tel'] ?? '', 'error' => (string)($r['error'] ?? ''), 'http' => (int)($r['http'] ?? 0)]);
        return null;
    }
    return wabot_datos_demo_normalizar($r['datos']);
}

/** El JSON con todos los campos, como strings recortados. */
function wabot_datos_demo_normalizar($d) {
    $out = ['es_datos' => !empty($d['es_datos'])];
    foreach (['nombre_negocio' => 80, 'resumen' => 2000, 'instagram' => 100, 'colores' => 200, 'referencia' => 300, 'incluir' => 2000, 'whatsapp' => 40] as $k => $max) {
        $v = is_scalar($d[$k] ?? null) ? trim((string)$d[$k]) : '';
        $v = trim((string)preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v));
        $out[$k] = mb_substr($v, 0, $max);
    }
    return $out;
}

/** Un «ok», «dale», «gracias», «después te paso»: no son los datos. */
function wabot_datos_demo_es_acuse_o_posterga($texto) {
    $t = wabot_datos_demo_norm($texto);
    if ($t === '') return true;
    if (mb_strlen($t) <= 14 && preg_match('/^(ok|oka|okey|dale|si|sip|listo|genial|buenisimo|perfecto|gracias|muchas gracias|joya|bueno|va|ya|ahi va|ahora|ahi te paso|ya te paso)( \p{L}+)?$/u', $t)) return true;
    return preg_match('/\b(despues|mas tarde|manana|a la noche|a la tarde|en un rato|cuando pueda|cuando llegue|te paso|te mando|te envio|lo veo|lo hablo|lo consulto)\b/u', $t) === 1
        && mb_strlen($t) <= 90;
}

/**
 * Sin OpenAI (caída, sin key, proveedor Gemini): reglas. Un texto con cuerpo y sin
 * pregunta se toma como los datos, todo en el resumen; el nombre, si la charla
 * ya lo tenía. Lo demás no se toca y sigue el camino de siempre.
 */
function wabot_datos_demo_extraer_reglas($textoCliente, $conv) {
    $texto = trim((string)$textoCliente);
    $vacio = wabot_datos_demo_normalizar(['es_datos' => false]);
    if ($texto === '' || mb_strpos($texto, '?') !== false || mb_strpos($texto, '¿') !== false) return $vacio;
    if (wabot_datos_demo_es_acuse_o_posterga($texto)) return $vacio;
    if (mb_strlen(wabot_datos_demo_norm($texto)) < 25 && substr_count($texto, "\n") < 1) return $vacio;
    $d = $vacio;
    $d['es_datos'] = true;
    $d['resumen'] = $texto;
    if (preg_match('~(?:instagram\.com/|@)([A-Za-z0-9._]{2,30})~u', $texto, $m)) $d['instagram'] = $m[1];
    $d['_reglas'] = true;
    return $d;
}

/** El usuario de Instagram de lo que haya escrito: «@pelumari», «instagram.com/pelumari», «pelumari». */
function wabot_datos_demo_instagram_usuario($texto) {
    $t = trim((string)$texto);
    if (preg_match('~instagram\.com/([A-Za-z0-9._]{1,30})~i', $t, $m)) $t = $m[1];
    $t = ltrim($t, '@ ');
    $t = trim((string)preg_replace('/[\s,.;]+$/u', '', $t));
    return preg_match('/^[A-Za-z0-9._]{1,30}$/', $t) && !in_array(strtolower($t), ['p', 'reel', 'reels', 'stories', 'explore', 'no', 'no tengo'], true) ? $t : '';
}

/** Lo que falta para arrancar: el nombre y qué ofrece (lo mismo que exigía el formulario). */
function wabot_datos_demo_faltan($conv, array $d) {
    // Leído por reglas (sin IA) el texto entero ya quedó como resumen: pedirle «el nombre» que acaba de escribir sería absurdo; lo ve Pablo en la ficha.
    if (!empty($d['_reglas'])) return [];
    $faltan = [];
    $nombre = $d['nombre_negocio'] !== '' ? $d['nombre_negocio'] : trim((string)($conv['nombre_negocio'] ?? ''));
    if ($nombre === '' && !empty($conv['brief']['marca'])) $nombre = trim((string)$conv['brief']['marca']);
    if ($nombre === '') $faltan[] = 'el nombre de tu negocio o marca';
    $f = function_exists('wabot_ficha') ? wabot_ficha($conv) : [];
    $descripcion = trim((string)($conv['descripcion'] ?? ''));
    $sabeRubro = $d['resumen'] !== ''
        || ($descripcion !== '' && !(function_exists('wabot_descripcion_generica') && wabot_descripcion_generica($descripcion)))
        || trim((string)($f['que_vende'] ?? '')) !== '' || trim((string)($f['rubro'] ?? '')) !== '';
    if (!$sabeRubro) $faltan[] = 'un resumen de lo que ofrecés';
    return $faltan;
}

/**
 * Los datos ya están: se completa la charla como lo hacía el formulario y se
 * crea la ficha. Devuelve el texto de confirmación.
 */
function wabot_datos_demo_completar(&$conv, array $d, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    $negocio = $d['nombre_negocio'] !== '' && function_exists('wabot_nombre_negocio_limpiar') ? wabot_nombre_negocio_limpiar($d['nombre_negocio']) : $d['nombre_negocio'];
    if ($negocio !== '') $conv['nombre_negocio'] = $negocio;
    if ($d['resumen'] !== '') {
        $conv['descripcion'] = $d['resumen'];
    } elseif (trim((string)($conv['descripcion'] ?? '')) === '') {
        // No contó qué ofrece en estos mensajes, pero la charla ya lo sabe (la ficha del precio).
        $f = function_exists('wabot_ficha') ? wabot_ficha($conv) : [];
        $desde = trim((string)($f['que_vende'] ?? '')) ?: trim((string)($f['rubro'] ?? ''));
        if ($desde !== '') $conv['descripcion'] = $desde;
    }
    if ($d['colores'] !== '') {
        $conv['colores'] = $d['colores'];
    } elseif (trim((string)($conv['colores'] ?? '')) === '') {
        $conv['colores'] = 'A elección del diseñador';   // igual que el formulario sin colores (2-oct)
    }
    $ig = wabot_datos_demo_instagram_usuario($d['instagram']);
    if ($ig !== '') $conv['instagram'] = $ig;
    if ($d['referencia'] !== '' && (!function_exists('wabot_referencia_utilizable') || wabot_referencia_utilizable($d['referencia']))) {
        $conv['referencia'] = $d['referencia'];
    }
    $conv['referencia_preguntada'] = true;   // ya se la pedimos en la lista: el chat no la vuelve a pedir
    if ($d['incluir'] !== '') $conv['incluir'] = $d['incluir'];
    if ($d['whatsapp'] !== '' && function_exists('wabot_extraer_celular')) {
        $num = wabot_extraer_celular($d['whatsapp']);
        if ($num !== null) $conv['telefono_wsp'] = $num;
    }
    $conv['esProspecto'] = true;
    $conv['precio_cta_pendiente'] = false;

    // Lo que se anota en el transcript, como la línea «[Formulario web] …»: lo lee Pablo y el brief.
    $partes = ['Negocio: ' . (trim((string)($conv['nombre_negocio'] ?? '')) ?: '(no lo dijo)'),
               'Resumen: ' . (trim((string)($conv['descripcion'] ?? '')) ?: '(no lo dijo)'),
               'Colores: ' . ($d['colores'] !== '' ? $d['colores'] : 'no eligió')];
    if ($ig !== '') $partes[] = 'Instagram: instagram.com/' . $ig;
    if (($conv['referencia'] ?? '') !== '' && $d['referencia'] !== '') $partes[] = 'Referencia: ' . $conv['referencia'];
    if ($d['incluir'] !== '') $partes[] = 'Incluir sí o sí: ' . $d['incluir'];
    if (!empty($conv['telefono_wsp']) && $d['whatsapp'] !== '') $partes[] = 'WhatsApp: ' . $conv['telefono_wsp'];
    if (!empty($d['_reglas'])) $partes[] = '(leído sin IA: el texto entero quedó como resumen)';
    wabot_conv_transcript($conv, 'sistema', '[Datos de la demo por chat] ' . implode(' · ', $partes));

    $conv['form_completado_ts'] = $ahora;
    $conv['datos_recibidos_ts'] = $ahora;
    $conv['origen_prediseno'] = ($conv['origen_prediseno'] ?? '') ?: 'chat';

    /* La ficha, igual que en wabot_form_lead_procesar(): si la charla dice tener
     * una que Pablo ya borró (la pasó a Seguimiento), se crea de nuevo. El brief
     * lo arma la IA con toda la charla al crear la ficha (wabot_firestore_lead). */
    $fichaPerdida = !empty($conv['lead_creado']) && function_exists('wabot_lead_doc_existe') && !wabot_lead_doc_existe($conv);
    if ($fichaPerdida) $conv['brief'] = null;
    if (empty($conv['lead_creado']) || $fichaPerdida) {
        if ($fichaPerdida) {
            $conv['lead_recreado_ts'] = $ahora;
            wabot_log('lead_recreado', ['clave' => wabot_conversation_key($conv), 'doc_anterior' => (string)($conv['lead_doc'] ?? '')]);
        }
        $conv['lead_creado'] = wabot_firestore_lead($conv, $cfg);
        if (function_exists('wabot_capi_evento')) wabot_capi_evento($conv, 'LeadSubmitted', $cfg);
    }
    if (function_exists('wabot_prospecto_sincronizar')) wabot_prospecto_sincronizar($conv);

    if (!empty($conv['postprecio_auto']) && empty($conv['control_manual']) && empty($conv['bot_off'])
        && function_exists('wabot_postprecio_encendido') && wabot_postprecio_encendido($cfg)) {
        $conv['fase'] = 'prediseno';
        $conv['seguimiento_bloqueado'] = true;
    } elseif (function_exists('wabot_handoff_marcar')) {
        wabot_handoff_marcar($conv, 'prediseno');
    }
    /* Con los datos recibidos el bot se apaga en ese chat, como con el formulario
     * completo (Pablo, 10-oct): de ahí en adelante contesta él. Con «Bot después
     * de la demo» prendido sigue contestando lo simple hasta la demo. */
    if (!function_exists('wabot_postdemo_bot_activo') || !wabot_postdemo_bot_activo($cfg)) {
        $conv['bot_off'] = true;
        wabot_log('bot_off_datos_chat', ['tel' => $conv['tel'] ?? '']);
    }
    // La confirmación sale ahora: la del cron de los 5 minutos ya no corresponde.
    $conv['form_recibido_confirmado'] = true;
    $conv['form_confirmacion_auto_ts'] = $ahora;
    $conv['comercial_pausa'] = 'formulario';
    $conv['comercial_pausa_ts'] = $ahora;
    unset($conv['datos_demo_faltan_n'], $conv['datos_demo_espera_wsp']);
    if (function_exists('wabot_evento_sesion')) {
        wabot_evento_sesion($conv, 'datos_demo_recibidos', [
            'campos' => array_keys(array_filter($d, function ($v, $k) { return $k !== 'es_datos' && substr((string)$k, 0, 1) !== '_' && $v !== '' && $v !== false; }, ARRAY_FILTER_USE_BOTH)),
            'reglas' => !empty($d['_reglas']),
        ]);
    }
    wabot_log('datos_demo_completo', ['tel' => $conv['tel'] ?? '', 'negocio' => (string)($conv['nombre_negocio'] ?? ''), 'reglas' => !empty($d['_reglas'])]);
    return wabot_datos_demo_confirmacion_texto($conv, $cfg, $ahora);
}

/** «Perfecto, con eso armamos la demo. Estará lista para {entrega}…», con la entrega como la confirmación del formulario. */
function wabot_datos_demo_confirmacion_texto($conv, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    $plantilla = (string)($cfg['datos_demo_recibidos'] ?? (function_exists('wabot_textos_default') ? wabot_textos_default()['datos_demo_recibidos'] ?? '' : ''));
    if (trim($plantilla) === '') $plantilla = 'Perfecto, con eso armamos la demo. Estará lista para {entrega}. Si querés sumar fotos, el logo o algún dato más, mandámelo por acá.';
    $entrega = function_exists('wabot_form_entrega_frase') ? wabot_form_entrega_frase($conv, $ahora) : 'en menos de 24 hs';
    $texto = strtr($plantilla, ['{entrega}' => $entrega, '{saludo}' => function_exists('wabot_saludo_hora') ? wabot_saludo_hora($ahora) : 'Hola']);
    return trim(function_exists('wabot_personalizar') ? wabot_personalizar($texto, $conv) : $texto);
}

/** Anota en comercial_ultimo lo que hizo este turno, para el panel. */
function wabot_datos_demo_anotar_turno(&$conv, $accion, $motivo, $ajuste) {
    $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => $accion, 'motivo' => $motivo, 'ajustes' => [$ajuste],
                                 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
}

/**
 * El turno con los datos pedidos y sin recibir. Devuelve los mensajes a mandar,
 * o null cuando el mensaje no son los datos (una duda, un acuse): ahí sigue el
 * flujo de siempre. $texto es la tanda del cliente (lo que no se contestó aún).
 */
function wabot_datos_demo_turno($texto, &$conv, $cfg) {
    if (!wabot_datos_por_chat($cfg) || !wabot_datos_demo_pendiente($conv)) return null;
    $texto = trim((string)$texto);
    if ($texto === '') return null;

    // Instagram, con los datos ya tomados y a la espera del WhatsApp: solo el número.
    if (!empty($conv['datos_demo_espera_wsp'])) {
        $num = function_exists('wabot_extraer_celular') ? wabot_extraer_celular($texto) : null;
        if ($num !== null) {
            $conv['telefono_wsp'] = $num;
            $d = is_array($conv['datos_demo_parcial'] ?? null) ? $conv['datos_demo_parcial'] : wabot_datos_demo_normalizar([]);
            $d['whatsapp'] = $num;
            unset($conv['datos_demo_parcial']);
            wabot_datos_demo_anotar_turno($conv, 'responder', 'Datos de la demo recibidos por el chat (con el WhatsApp)', 'datos_demo_completo');
            $conv['_comercial_salida'] = true;
            return [wabot_datos_demo_completar($conv, $d, $cfg)];
        }
        if (mb_strpos($texto, '?') !== false || wabot_datos_demo_es_acuse_o_posterga($texto)) return null;
        if ((int)($conv['datos_demo_espera_wsp'] ?? 0) >= 2) {
            // Ya se lo pedimos dos veces y no llega un número: lo ve Pablo.
            $conv['handoff_pendiente'] = true;
            wabot_datos_demo_anotar_turno($conv, 'humano', 'No pasó un WhatsApp válido para mandarle la demo', 'datos_demo_wsp_invalido');
            return [];
        }
        $conv['datos_demo_espera_wsp'] = (int)$conv['datos_demo_espera_wsp'] + 1;
        $conv['_comercial_salida'] = true;
        return [(string)($cfg['prediseno_whatsapp_invalido'] ?? 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.')];
    }

    // Solo fotos o un audio sin transcripción: no hay nada que leer (el flujo agradece el material).
    $todo = wabot_datos_demo_texto_cliente($conv);
    if ($todo === '') return null;
    // Lo obvio sin gastar una llamada: una pregunta corta o un «dale» no son los datos.
    if (wabot_datos_demo_es_acuse_o_posterga($todo)) return null;

    $d = wabot_datos_demo_extraer($todo, $conv, $cfg);
    if ($d === null) $d = wabot_datos_demo_extraer_reglas($todo, $conv);
    if (empty($d['es_datos'])) return null;

    $faltan = wabot_datos_demo_faltan($conv, $d);
    if ($faltan) {
        $n = (int)($conv['datos_demo_faltan_n'] ?? 0);
        $tieneAlgo = $d['nombre_negocio'] !== '' || $d['resumen'] !== '' || trim((string)($conv['nombre_negocio'] ?? '')) !== ''
            || trim((string)($conv['descripcion'] ?? '')) !== '';
        if ($n === 0 || !$tieneAlgo) {
            if ($n >= 1) {
                // Dos veces sin lo esencial: lo ve Pablo, con todo lo que escribió.
                $conv['handoff_pendiente'] = true;
                wabot_datos_demo_anotar_turno($conv, 'humano', 'Mandó datos para la demo pero falta ' . implode(' y ', $faltan), 'datos_demo_incompletos');
                wabot_log('datos_demo_incompletos', ['tel' => $conv['tel'] ?? '', 'faltan' => $faltan]);
                return [];
            }
            $conv['datos_demo_faltan_n'] = $n + 1;
            $plantilla = trim((string)($cfg['datos_demo_faltan'] ?? ''));
            if ($plantilla === '') $plantilla = 'Dale, anotado. Para arrancar me falta {faltan}.';
            wabot_datos_demo_anotar_turno($conv, 'responder', 'Mandó parte de los datos: se le pide lo que falta', 'datos_demo_faltan');
            $conv['_comercial_salida'] = true;
            return [trim(wabot_personalizar(strtr($plantilla, ['{faltan}' => implode(' y ', $faltan)]), $conv))];
        }
        // Ya se lo pedimos una vez y mandó algo más: se arma con lo que hay (la ficha completa lo que falte).
    }

    // Instagram sin WhatsApp: se le pide el número antes de cerrar (sin él la demo no tiene a dónde ir).
    if (wabot_canal($conv) === 'instagram' && empty($conv['telefono_wsp'])
        && ($d['whatsapp'] === '' || !function_exists('wabot_extraer_celular') || wabot_extraer_celular($d['whatsapp']) === null)) {
        $conv['datos_demo_parcial'] = $d;
        $conv['datos_demo_espera_wsp'] = 1;
        wabot_datos_demo_anotar_turno($conv, 'responder', 'Datos de la demo recibidos por Instagram: falta el WhatsApp', 'datos_demo_pide_wsp');
        $conv['_comercial_salida'] = true;
        return [(string)($cfg['prediseno_whatsapp'] ?? 'Última cosa y ya te lo preparamos: pasame tu número de WhatsApp, que por ahí te mandamos la demo cuando esté lista.')];
    }

    wabot_datos_demo_anotar_turno($conv, 'responder', 'Datos de la demo recibidos por el chat', 'datos_demo_completo');
    $conv['_comercial_salida'] = true;
    return [wabot_datos_demo_completar($conv, $d, $cfg)];
}
