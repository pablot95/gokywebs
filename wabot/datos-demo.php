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
 *  - Con los datos leídos NO contesta (10-nov, Pablo: «seguro se toman un tiempo para buscar
 *    la info»): anota lo leído y espera a que el cliente lleve datos_demo_espera_min minutos sin
 *    escribir; recién ahí el cron arma la ficha o le pide lo esencial que falta
 *    (wabot_datos_demo_espera_correr, cada 5 min). Un «listo» o «eso es todo» la arma en el
 *    turno. Con 0 minutos se arma en el mismo turno, como el 9-nov.
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
function wabot_datos_demo_texto_cliente($conv, $desdeFila = null) {
    $t = (array)($conv['transcript'] ?? []);
    $desde = (int)($conv['datos_pedidos_ts'] ?? 0);
    // Desde el renglón del pedido (por si varios mensajes comparten el segundo).
    $inicio = 0;
    if ($desdeFila !== null) {
        $inicio = max(0, (int)$desdeFila);   // lo que mandó después de armada la ficha (wabot_datos_demo_tardios); 0 = todo lo que hay desde el pedido
    } else {
        foreach ($t as $i => $fila) {
            // El pedido de esta sesión: uno de una charla anterior (antes del reinicio de los 7 días) no cuenta.
            if ((int)($fila['ts'] ?? 0) < $desde - 5) continue;
            if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true) && wabot_texto_pide_datos_demo((string)($fila['t'] ?? ''))) { $inicio = $i + 1; break; }
        }
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

/**
 * Lo que se ve en las fotos y archivos que mandó desde el pedido (la descripción automática).
 * No es texto suyo, pero el nombre en su logo o los servicios escritos en su flyer son sus
 * datos: el 11-nov un carpintero mandó 7 fotos y una imagen con el logo y los servicios, sin
 * escribir el nombre, y la ficha no se armó.
 */
function wabot_datos_demo_fotos_texto($conv) {
    $t = (array)($conv['transcript'] ?? []);
    $desde = (int)($conv['datos_pedidos_ts'] ?? 0);
    $inicio = 0;
    foreach ($t as $i => $fila) {
        if ((int)($fila['ts'] ?? 0) < $desde - 5) continue;
        if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true) && wabot_texto_pide_datos_demo((string)($fila['t'] ?? ''))) { $inicio = $i + 1; break; }
    }
    $partes = [];
    foreach ($t as $i => $fila) {
        if (($fila['q'] ?? '') !== 'cliente') continue;
        if ($inicio > 0 ? $i < $inicio : (int)($fila['ts'] ?? 0) < $desde) continue;
        $texto = trim((string)($fila['t'] ?? ''));
        if (!preg_match('/^\[(foto|imagen|documento)\]\s*/iu', $texto)) continue;
        $texto = trim((string)preg_replace('/^\[(foto|imagen|documento)\]\s*/iu', '', $texto));
        // «epígrafe\n(descripción)»: el epígrafe ya lo lee wabot_datos_demo_texto_cliente; acá va la descripción.
        if (preg_match('/\n\((.*)\)\s*$/su', $texto, $m)) $texto = trim($m[1]);
        $texto = trim((string)preg_replace('/\s*\[adjunto:[^\]]*\]\s*$/u', '', $texto));
        if (mb_strlen($texto) < 12) continue;   // «Mandó» solo: nada que leer
        $partes[] = '- ' . $texto;
    }
    return mb_substr(implode("\n", $partes), 0, 3000);
}

/** El esquema estricto con el que GPT devuelve los datos: uno por campo del formulario. */
function wabot_datos_demo_esquema() {
    $s = function ($d) { return ['type' => 'string', 'description' => $d]; };
    return ['type' => 'json_schema', 'name' => 'datos_demo_v1', 'strict' => true, 'schema' => [
        'type' => 'object', 'additionalProperties' => false,
        'required' => ['es_datos', 'pide_ejemplo', 'nombre_negocio', 'resumen', 'instagram', 'colores', 'referencia', 'incluir', 'whatsapp'],
        'properties' => [
            'es_datos'       => ['type' => 'boolean', 'description' => 'true si el cliente está pasando al menos uno de los datos pedidos para la demo (nombre del negocio, qué ofrece, Instagram, colores, referencia, qué incluir, WhatsApp). false si es una pregunta, un acuse (ok, dale, gracias), una postergación (después te paso, mañana te mando) o cualquier otra cosa.'],
            'pide_ejemplo'   => ['type' => 'boolean', 'description' => 'true si pide que armemos la demo con contenido o datos de ejemplo en vez de los suyos ("armala con otros datos", "poné cualquier cosa, es para ver cómo queda", "todavía no tengo nombre, inventá uno"). Una postergación ("después te paso") es false.'],
            'nombre_negocio' => $s('El nombre del negocio o la marca, tal cual lo escribió o como se lee en su logo, flyer o cartel (sin "mi negocio se llama"). Vacío si no lo dijo.'),
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
        . "- Si dice que los colores los elijamos nosotros o que no tiene, colores vacío. Si dice que no tiene Instagram o referencia, vacío.\n"
        . "- LO QUE SE VE EN SUS FOTOS lo describimos nosotros: tomá de ahí el nombre del negocio solo si se lee en SU logo, flyer o cartel, y qué ofrece si está escrito en una imagen suya con sus servicios o productos. Una captura de otra web o de otra cuenta es una referencia, no su nombre. Si su logo o flyer trae el nombre o los servicios, es_datos es true.\n"
        . "- pide_ejemplo: true si pide que la demo se arme con contenido de ejemplo o inventado en vez de sus datos.";
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
function wabot_datos_demo_extraer($textoCliente, &$conv, $cfg) {
    if (!function_exists('wabot_openai_llamar')) return null;
    $entrada = "LO QUE YA SABEMOS\n" . wabot_datos_demo_contexto_conocido($conv)
        . "\n\nLO QUE ESCRIBIÓ DESDE QUE LE PEDIMOS LOS DATOS\n" . (trim((string)$textoCliente) !== '' ? mb_substr((string)$textoCliente, 0, 6000) : '(nada escrito)');
    $fotos = wabot_datos_demo_fotos_texto($conv);
    if ($fotos !== '') $entrada .= "\n\nLO QUE SE VE EN SUS FOTOS (descripción nuestra, no texto suyo)\n" . $fotos;
    $esfuerzo = function_exists('wabot_openai_esfuerzo') && wabot_openai_esfuerzo($cfg) === 'none' ? 'none' : 'low';
    $r = wabot_openai_llamar('datos_demo', wabot_datos_demo_instrucciones(), $entrada, wabot_datos_demo_esquema(), $cfg,
        ['usuario' => wabot_conversation_key($conv), 'max_tokens' => 900, 'esfuerzo' => $esfuerzo]);
    if (empty($r['ok']) || !is_array($r['datos'])) {
        wabot_log('datos_demo_extraer_fallo', ['tel' => $conv['tel'] ?? '', 'error' => (string)($r['error'] ?? ''), 'http' => (int)($r['http'] ?? 0)]);
        return null;
    }
    // Las fotos que entraron en esta lectura: el cron no vuelve a pagarla por las mismas (wabot_datos_demo_espera_atender).
    $conv['datos_demo_fotos_leidas'] = $fotos !== '' ? md5($fotos) : '';
    return wabot_datos_demo_normalizar($r['datos']);
}

/** El JSON con todos los campos, como strings recortados. */
function wabot_datos_demo_normalizar($d) {
    $out = ['es_datos' => !empty($d['es_datos']), 'pide_ejemplo' => !empty($d['pide_ejemplo'])];
    foreach (['nombre_negocio' => 80, 'resumen' => 2000, 'instagram' => 100, 'colores' => 200, 'referencia' => 300, 'incluir' => 2000, 'whatsapp' => 40] as $k => $max) {
        $v = is_scalar($d[$k] ?? null) ? trim((string)$d[$k]) : '';
        $v = trim((string)preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v));
        $out[$k] = mb_substr($v, 0, $max);
    }
    return $out;
}

/**
 * «Dale aguantame», «esperame un toque», «bancame que busco el logo»: está juntando
 * los datos, no terminó (10-nov, GREY: mandó el logo, escribió «Dale aguantame», el
 * «dale» se leyó como «listo» y la ficha se armó con el nombre solo; el brief
 * completo llegó a los 15 minutos y quedó afuera).
 */
function wabot_datos_demo_pide_tiempo($texto) {
    $t = wabot_datos_demo_norm($texto);
    /* Solo formas que piden tiempo sin duda. «Un toque», «espera» o «banca» sueltos quedaron
     * afuera: aparecen en los datos («negro con un toque de dorado», «La Espera Bar»,
     * «Banca Digital») y hacían que no se leyeran (revisión del 10-nov). */
    return preg_match('/\b(aguant\w*|esperame|esperen|esperate|bancame|bancate|(dame|deme|esperame|aguantame|bancame) (un|1) (toque|segundo|momento|momentito|ratito|rato|cachito|minuto)|ya vuelvo|ya te (paso|mando|envio)|ahora te (paso|mando|envio|busco)|ahi te (paso|mando|envio)|voy a buscar)\b/u', $t) === 1;
}

/** Un «ok», «dale», «gracias», «después te paso»: no son los datos. */
function wabot_datos_demo_es_acuse_o_posterga($texto) {
    /* Se mira mensaje por mensaje (lo escrito desde el pedido llega junto, un renglón por
     * mensaje): no hay datos si ninguno los trae. Antes se miraba todo junto, y un «te paso»
     * o un «mañana» en cualquier parte escondía los datos de los otros renglones. */
    $lineas = array_values(array_filter(array_map('trim', (array)preg_split('/\R/u', (string)$texto)), 'strlen'));
    if (count($lineas) > 6) return false;   // tantos renglones ya es una lista: se lee
    foreach ($lineas as $linea) {
        if (!wabot_datos_demo_linea_sin_datos($linea)) return false;
    }
    return true;
}

/** Un renglón que seguro no trae datos: un acuse, un pedido de tiempo, una postergación o una pregunta corta. */
function wabot_datos_demo_linea_sin_datos($linea) {
    $t = wabot_datos_demo_norm($linea);
    if ($t === '') return true;
    if (mb_strlen($t) <= 14 && preg_match('/^(ok|oka|okey|dale|si|sip|listo|genial|buenisimo|perfecto|gracias|muchas gracias|joya|bueno|va|ya|ahi va|ahora|ahi te paso|ya te paso)( ' . wabot_datos_demo_acuse_cola() . ')?$/u', $t)) return true;
    /* Con coma, dos puntos o arroba está pasando datos aunque diga «te paso» o «mañana»:
     * «Te paso los datos: Pelu Mari, cortes y color», «Kiosco El Sol, abierto de mañana y
     * tarde», «Pelu Mari, ahora te paso el logo» no se leían nunca (revisión del 10-nov).
     * «Ok, mañana te mando todo»: la coma después del «ok» no cuenta. */
    $sinAcuse = (string)preg_replace('/^\s*(ok|oka|okey|dale|si|sip|listo|genial|buen[ií]simo|perfecto|gracias|bueno|joya)\s*[,.!]+\s*/iu', '', trim((string)$linea));
    if (preg_match('/[,:@]/u', $sinAcuse)) return false;
    // Una pregunta corta la contesta el flujo: no gasta una lectura ni queda sin respuesta durante la espera.
    if (mb_strlen($t) <= 80 && (mb_strpos((string)$linea, '?') !== false || mb_strpos((string)$linea, '¿') !== false)) return true;
    if (mb_strlen($t) <= 40 && wabot_datos_demo_pide_tiempo($t)) return true;
    return preg_match('/\b(despues|mas tarde|manana|a la noche|a la tarde|en un rato|cuando pueda|cuando llegue|te paso|te mando|te envio|lo veo|lo hablo|lo consulto)\b/u', $t) === 1
        && mb_strlen($t) <= 90;
}

/**
 * La palabra que puede acompañar a un «dale» o un «ok» sin que deje de ser un acuse
 * («dale gracias», «ok perfecto», «listo amigo»). Antes valía cualquier palabra, y un
 * negocio que se llama «Joya Mística» o «Dale Gas» se leía como un «ok».
 */
function wabot_datos_demo_acuse_cola() {
    return '(gracias|genial|dale|listo|perfecto|si|ok|oka|okey|joya|bueno|claro|buenisimo|barbaro|entonces|igual|igualmente|ya|va|eso|todo|amigo|amiga|che|capo|crack|genio|pablo)';
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
    // Pidió la demo con contenido de ejemplo (11-nov, Mica: «podrías prepararla con otros datos»): sin su nombre se arma igual.
    if ($nombre === '' && empty($d['_ejemplo'])) $faltan[] = 'el nombre de tu negocio o marca';
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
    if (!empty($d['_ejemplo']) && trim((string)($conv['incluir'] ?? '')) === '') {
        $conv['incluir'] = 'Contenido de ejemplo: pidió ver la demo sin pasar sus datos';
    }
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
    if (!empty($d['_ejemplo'])) $partes[] = '(pidió la demo con contenido de ejemplo)';
    wabot_conv_transcript($conv, 'sistema', '[Datos de la demo por chat] ' . implode(' · ', $partes));

    $conv['form_completado_ts'] = $ahora;
    $conv['datos_recibidos_ts'] = $ahora;
    $conv['datos_demo_tarde_firma'] = wabot_datos_demo_ultima_firma_cliente($conv);   // lo que mande después: wabot_datos_demo_tardios
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
        /* Firestore no creó la ficha (cuota agotada del 4 al 7-nov, un 5xx, sin red). Antes igual
         * se le confirmaba «con eso armamos la demo», el bot se apagaba y nadie reintentaba: la demo
         * no arrancaba nunca. Ahora no se confirma nada: la charla sigue pendiente con lo leído y el
         * cron de la espera lo vuelve a intentar; a la sexta lo ve Pablo. */
        if (empty($conv['lead_creado'])) {
            $fallos = (int)($conv['datos_demo_ficha_fallos'] ?? 0) + 1;
            $conv['datos_demo_ficha_fallos'] = $fallos;
            $conv['form_completado_ts'] = 0;
            unset($conv['datos_recibidos_ts'], $conv['datos_demo_tarde_firma']);
            // La línea «[Datos de la demo por chat]» se vuelve a anotar cuando la ficha entre.
            $filas = (array)($conv['transcript'] ?? []);
            $ultima = end($filas);
            if (is_array($ultima) && ($ultima['q'] ?? '') === 'sistema' && strpos((string)($ultima['t'] ?? ''), '[Datos de la demo por chat]') === 0) {
                array_pop($filas);
                $conv['transcript'] = $filas;
            }
            $conv['handoff_pendiente'] = true;
            if ($fallos < 6) {
                $conv['datos_demo_parcial'] = $d;
                $conv['datos_demo_leido_filas'] = wabot_datos_demo_cliente_filas($conv);
                $conv['datos_demo_espera_ts'] = $ahora;
                wabot_datos_demo_espera_marcar($conv, $ahora);
            } else {
                unset($conv['datos_demo_parcial'], $conv['datos_demo_espera_ts'], $conv['datos_demo_leido_filas']);
                wabot_datos_demo_espera_quitar(wabot_conversation_key($conv));
            }
            wabot_datos_demo_anotar_turno($conv, 'humano', 'No se pudo crear la ficha de la demo (intento ' . $fallos . ')' . ($fallos < 6 ? ': se reintenta sola' : ': armala a mano'), 'datos_demo_ficha_fallo');
            wabot_log('datos_demo_ficha_fallo', ['tel' => $conv['tel'] ?? '', 'intento' => $fallos]);
            return '';
        }
        unset($conv['datos_demo_ficha_fallos']);
        if (function_exists('wabot_capi_evento')) wabot_capi_evento($conv, 'LeadSubmitted', $cfg);
    }
    if (function_exists('wabot_prospecto_sincronizar')) wabot_prospecto_sincronizar($conv);

    /* Con los datos recibidos el bot sigue en el chat hasta la demo (Pablo,
     * 11-nov): acusa lo que manda y contesta lo simple, y el chat no le queda a
     * Pablo como sin leer. Con «Seguir hasta la demo» apagado, como el 10-oct:
     * el bot se apaga y de ahí en adelante contesta él. */
    wabot_prediseno_cerrar($conv, $cfg, 'chat');
    // La confirmación sale ahora: la del cron de los 5 minutos ya no corresponde.
    $conv['form_recibido_confirmado'] = true;
    $conv['form_confirmacion_auto_ts'] = $ahora;
    $conv['comercial_pausa'] = 'formulario';
    $conv['comercial_pausa_ts'] = $ahora;
    unset($conv['datos_demo_faltan_n'], $conv['datos_demo_espera_wsp'], $conv['datos_demo_parcial'],
          $conv['datos_demo_espera_ts'], $conv['datos_demo_leido_filas']);
    wabot_datos_demo_espera_quitar(wabot_conversation_key($conv));
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

/* ──────────── La espera antes de armar la ficha (Pablo, 10-nov) ────────────
 *
 * «Seguro se toman un tiempo para buscar la info»: el que manda el nombre y se va a
 * buscar el Instagram y las fotos no tiene que quedar con la ficha armada con el
 * nombre solo. Con los datos leídos el bot no contesta: anota lo leído y espera a que
 * el cliente lleve datos_demo_espera_min minutos sin escribir. Recién ahí el cron
 * (cada 5 min con cron-prospectos-chatgpt.php; a las y media con seguimiento.php) arma
 * la ficha y le confirma, o le pide lo esencial que falta. Si en el medio escribe
 * «listo» o «eso es todo», se arma en ese turno. Con 0 minutos vuelve a armarse en el
 * mismo turno, como del 9-nov.
 */
/* 2 h desde el 11-nov (Pablo: «la gente sigue mandando info, el bot tiene que esperar 2 hs para
 * armar la ficha»): el 10 y 11-nov, 3 de 20 fichas armadas a los 5 min recibieron datos después. */
const WABOT_DATOS_DEMO_ESPERA_MIN_DEFAULT = 120;
/** Desde cuántos minutos la espera es «larga»: acuse de recibo y solo un cierre explícito arma antes. */
const WABOT_DATOS_DEMO_ESPERA_LARGA_MIN = 30;
/** Cuánto se espera al que pidió tiempo («aguantame», «ahora te paso») antes de armar con lo que haya. */
const WABOT_DATOS_DEMO_PIDE_TIEMPO_MIN = 30;

/** Minutos de silencio del cliente antes de armar la ficha (Ajustes → IA); 0 = en el mismo turno. */
function wabot_datos_demo_espera_min($cfg) {
    if (!is_array($cfg) || !array_key_exists('datos_demo_espera_min', $cfg)) return WABOT_DATOS_DEMO_ESPERA_MIN_DEFAULT;
    $m = (int)$cfg['datos_demo_espera_min'];
    return ($m >= 0 && $m <= 120) ? $m : WABOT_DATOS_DEMO_ESPERA_MIN_DEFAULT;
}

/** Las charlas que están mandando los datos ({clave: ts}), para que el cron no recorra todas. */
function wabot_datos_demo_espera_archivo() {
    return $GLOBALS['WABOT_TEST_DATOS_DEMO_ESPERA_ARCHIVO'] ?? (WABOT_DATA . '/datos-demo-espera.json');
}
function wabot_datos_demo_espera_indice() {
    $f = wabot_datos_demo_espera_archivo();
    $idx = is_file($f) ? json_decode((string)@file_get_contents($f), true) : null;
    return is_array($idx) ? $idx : [];
}
function wabot_datos_demo_espera_marcar($conv, $ts) {
    $idx = wabot_datos_demo_espera_indice();
    $idx[wabot_conversation_key($conv)] = (int)$ts;
    @file_put_contents(wabot_datos_demo_espera_archivo(), json_encode($idx), LOCK_EX);
}
function wabot_datos_demo_espera_quitar($clave) {
    $idx = wabot_datos_demo_espera_indice();
    if (!array_key_exists((string)$clave, $idx)) return;
    unset($idx[(string)$clave]);
    @file_put_contents(wabot_datos_demo_espera_archivo(), json_encode($idx), LOCK_EX);
}

/** El último mensaje del cliente: el silencio se cuenta desde ahí. */
function wabot_datos_demo_ultimo_cliente_ts($conv) {
    $ts = 0;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $f) {
        if (($f['q'] ?? '') === 'cliente') { $ts = (int)($f['ts'] ?? 0); break; }
    }
    return max($ts, (int)($conv['ultimo_cliente_ts'] ?? 0));
}

/** Lo último que escribió el cliente (sin la descripción de una foto ni el «[audio]»): para distinguir un «listo» de más datos. */
function wabot_datos_demo_ultimo_texto_cliente($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $f) {
        if (($f['q'] ?? '') !== 'cliente') continue;
        $t = trim((string)preg_replace('/\n\(.*$/su', '', trim((string)($f['t'] ?? ''))));
        return trim((string)preg_replace('/^\[(foto|imagen|documento|video|sticker|audio)\]\s*/iu', '', $t));
    }
    return '';
}

/** Cuántas cosas escribió el cliente en la charla: si crece, hay algo nuevo que leer. */
function wabot_datos_demo_cliente_filas($conv) {
    $n = 0;
    foreach ((array)($conv['transcript'] ?? []) as $f) if (($f['q'] ?? '') === 'cliente') $n++;
    return $n;
}

/** Cuántas fotos o archivos mandó desde que se le pidieron los datos. */
function wabot_datos_demo_material_recibido($conv) {
    $t = (array)($conv['transcript'] ?? []);
    $desde = (int)($conv['datos_pedidos_ts'] ?? 0);
    $inicio = 0;
    foreach ($t as $i => $fila) {
        if ((int)($fila['ts'] ?? 0) < $desde - 5) continue;
        if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true) && wabot_texto_pide_datos_demo((string)($fila['t'] ?? ''))) { $inicio = $i + 1; break; }
    }
    $n = 0;
    foreach ($t as $i => $fila) {
        if (($fila['q'] ?? '') !== 'cliente') continue;
        if ($inicio > 0 ? $i < $inicio : (int)($fila['ts'] ?? 0) < $desde) continue;
        if (in_array((string)($fila['media']['clase'] ?? ''), ['imagen', 'documento'], true)) $n++;
    }
    return $n;
}

/**
 * ¿Terminó de mandar? Un «listo», «ok», «eso es todo» con datos ya leídos (una postergación, no).
 * $estricto (la espera larga, 11-nov): solo un cierre explícito («eso es todo», «nada más», «ya te
 * mandé todo»). Un «ok» o un «gracias» al acuse del bot no cierra: la gente sigue mandando cosas.
 */
function wabot_datos_demo_es_acuse($texto, $estricto = false) {
    $t = wabot_datos_demo_norm($texto);
    if ($t === '' || mb_strlen($t) > 40) return false;
    if (preg_match('/\b(despues|mas tarde|manana|en un rato|cuando pueda|cuando llegue|te paso|te mando|te envio)\b/u', $t)) return false;
    if (wabot_datos_demo_pide_tiempo($t)) return false;   // «Dale aguantame» no es un «listo»
    if ($estricto) {
        if (preg_match('/\b(no|todavia|aun|falta\w*)\b/u', $t)) return false;
        return preg_match('/\b(eso es todo|es todo|seria todo|eso seria|nada mas|ya esta todo|ya (te )?(mande|pase|envie) todo|con eso (alcanza|basta|esta|estamos))\b/u', $t) === 1;
    }
    if (preg_match('/^(ok|oka|okey|dale|si|sip|listo|genial|buenisimo|perfecto|gracias|muchas gracias|joya|bueno|va|ya)( ' . wabot_datos_demo_acuse_cola() . ')?$/u', $t)) return true;
    // «Todavía no está listo el logo» no es un «listo».
    if (preg_match('/\b(no|todavia|aun|falta\w*)\b.{0,20}\blisto\b/u', $t)) return false;
    return preg_match('/\b(eso es todo|es todo|seria todo|ya esta|nada mas|con eso|listo)\b/u', $t) === 1;
}

/** ¿Está esperando el silencio para armar? (datos leídos, sin estar pidiendo el WhatsApp) */
function wabot_datos_demo_espera_sigue($conv) {
    return wabot_datos_demo_pendiente($conv) && (int)($conv['datos_demo_espera_ts'] ?? 0) > 0
        && is_array($conv['datos_demo_parcial'] ?? null) && empty($conv['datos_demo_espera_wsp']);
}

/** ¿Ya pasó el silencio que esperábamos? */
function wabot_datos_demo_espera_vencida($conv, $cfg, $ahora) {
    if (!wabot_datos_demo_espera_sigue($conv)) return false;
    // Pidió tiempo («aguantame», «ahora te paso»): hasta esa hora no se arma nada.
    if ((int)($conv['datos_demo_espera_hasta_ts'] ?? 0) > $ahora) return false;
    $desde = max((int)$conv['datos_demo_espera_ts'], wabot_datos_demo_ultimo_cliente_ts($conv));
    return $ahora - $desde >= wabot_datos_demo_espera_min($cfg) * 60;
}

/**
 * Con los datos leídos, qué toca: pedir lo esencial que falta (una vez), pedir el
 * WhatsApp (Instagram) o armar la ficha y confirmar. Devuelve los mensajes para el
 * cliente; [] cuando lo ve Pablo en silencio.
 */
function wabot_datos_demo_resolver(array $d, &$conv, $cfg, $ahora = null) {
    unset($conv['datos_demo_espera_ts'], $conv['datos_demo_leido_filas'], $conv['datos_demo_espera_hasta_ts']);
    wabot_datos_demo_espera_quitar(wabot_conversation_key($conv));

    $faltan = wabot_datos_demo_faltan($conv, $d);
    if ($faltan) {
        $n = (int)($conv['datos_demo_faltan_n'] ?? 0);
        $tieneAlgo = $d['nombre_negocio'] !== '' || $d['resumen'] !== '' || trim((string)($conv['nombre_negocio'] ?? '')) !== ''
            || trim((string)($conv['descripcion'] ?? '')) !== '';
        if ($n === 0 || !$tieneAlgo) {
            unset($conv['datos_demo_parcial']);
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
    $confirmacion = wabot_datos_demo_completar($conv, $d, $cfg, $ahora);
    return $confirmacion === '' ? [] : [$confirmacion];   // '' = la ficha no se pudo crear: no se confirma
}

/**
 * El turno con los datos pedidos y sin recibir. Devuelve los mensajes a mandar
 * ([] cuando lo tomó y no contesta: está esperando el silencio), o null cuando el
 * mensaje no son los datos (una duda, un acuse): ahí sigue el flujo de siempre.
 * $texto es la tanda del cliente (lo que no se contestó aún).
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
            $confirmacion = wabot_datos_demo_completar($conv, $d, $cfg);
            return $confirmacion === '' ? [] : [$confirmacion];
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

    $esperando = wabot_datos_demo_espera_sigue($conv);
    /* Mandó fotos o un flyer y ningún dato escrito (10-nov, Walter: el flyer de la cabaña,
     * «Usamos las fotos y la información del flyer para armar la demo» y la charla quedó
     * sin ficha y sin que nadie le pidiera el nombre). El material cuenta como haber
     * empezado a mandar: se anota la espera con los datos en blanco y, cuando deja de
     * escribir, se arma la ficha con lo que la charla ya sabe o se le pide lo esencial
     * que falta. En este turno no cambia nada: el flujo agradece el material como siempre. */
    /* Una vez por tanda de material: `datos_demo_material_n` recuerda cuántas fotos había al
     * anotarla. Sin eso, cada mensaje posterior (una pregunta, un «ok») volvía a armar la
     * espera y pagaba dos lecturas de GPT, la del turno y la del cron (revisión del 10-nov).
     * Lo escrito hasta acá lo lee este turno: el cron solo relee si después llega algo más. */
    $material = wabot_datos_demo_material_recibido($conv);
    if (!$esperando && $material > (int)($conv['datos_demo_material_n'] ?? 0)) {
        $ahoraM = time();
        $conv['datos_demo_material_n'] = $material;
        $conv['datos_demo_parcial'] = ['_material' => true] + wabot_datos_demo_normalizar(['es_datos' => true]);
        $conv['datos_demo_leido_filas'] = wabot_datos_demo_cliente_filas($conv);
        $conv['datos_demo_espera_ts'] = $ahoraM;
        wabot_datos_demo_espera_marcar($conv, $ahoraM);
        wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($conv), 'motivo' => 'material']);
    }
    /* «Dale aguantame» con algo ya anotado: no alcanza con no armar la ficha en este turno,
     * porque el cron la armaba igual a los 5 minutos de silencio (el brief de GREY llegó a
     * los 15). Se le da WABOT_DATOS_DEMO_PIDE_TIEMPO_MIN; si sigue mandando datos, vuelve a
     * contar el silencio de siempre, y un «listo» la arma en el momento. */
    if (wabot_datos_demo_espera_sigue($conv) && wabot_datos_demo_pide_tiempo(wabot_datos_demo_ultimo_texto_cliente($conv))) {
        $conv['datos_demo_espera_hasta_ts'] = time() + WABOT_DATOS_DEMO_PIDE_TIEMPO_MIN * 60;
    }

    // Solo fotos o un audio sin transcripción: no hay nada que leer (el flujo agradece el material).
    $todo = wabot_datos_demo_texto_cliente($conv);
    if ($todo === '') return null;

    /* $texto trae la tanda sin contestar (con los datos ya leídos, porque el turno que los
     * leyó no contestó): lo nuevo es lo último que escribió. */
    $ultimo = $esperando ? wabot_datos_demo_ultimo_texto_cliente($conv) : '';
    $min = wabot_datos_demo_espera_min($cfg);
    // Ya leímos datos y está esperando el silencio: «listo», «eso es todo» → se arma ya, sin otra lectura.
    // Con la espera larga, solo un cierre explícito: el «ok» o el «gracias» al acuse no cuentan.
    if ($esperando && wabot_datos_demo_es_acuse($ultimo, $min >= WABOT_DATOS_DEMO_ESPERA_LARGA_MIN)) {
        wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($conv), 'motivo' => 'acuse']);
        return wabot_datos_demo_resolver($conv['datos_demo_parcial'], $conv, $cfg);
    }
    // Lo obvio sin gastar una llamada: una pregunta corta o un «dale» no son los datos.
    if (wabot_datos_demo_es_acuse_o_posterga($esperando ? $ultimo : $todo)) return null;

    $d = wabot_datos_demo_extraer($todo, $conv, $cfg);
    if ($d === null) $d = wabot_datos_demo_extraer_reglas($todo, $conv);
    if (!empty($d['pide_ejemplo'])) $d['_ejemplo'] = true;
    /* «Podrías preparar la demo con otros datos, es para ver cómo sería» (11-nov, Mica): no va a
     * mandar nada más. Antes el flujo le decía que sí y la charla quedaba sin ficha. Con el rubro
     * sabido se arma ya, sin la espera; sin rubro se le pide qué ofrece. */
    if (empty($d['es_datos']) && !empty($d['_ejemplo'])) {
        wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($conv), 'motivo' => 'ejemplo']);
        return wabot_datos_demo_resolver($d, $conv, $cfg);
    }
    if (empty($d['es_datos'])) return null;

    if ($min <= 0) return wabot_datos_demo_resolver($d, $conv, $cfg);

    // Se anota lo leído y se espera a que termine de mandar: lo arma el cron (wabot_datos_demo_espera_correr).
    $ahora = time();
    $conv['datos_demo_parcial'] = $d;
    $conv['datos_demo_leido_filas'] = wabot_datos_demo_cliente_filas($conv);
    if (empty($conv['datos_demo_espera_ts'])) $conv['datos_demo_espera_ts'] = $ahora;
    // «GREY INOVACION» + «Dale aguantame» en la misma tanda: más tiempo; si mandó más datos, el silencio de siempre.
    if (wabot_datos_demo_pide_tiempo(wabot_datos_demo_ultimo_texto_cliente($conv))) {
        $conv['datos_demo_espera_hasta_ts'] = $ahora + WABOT_DATOS_DEMO_PIDE_TIEMPO_MIN * 60;
    } else {
        unset($conv['datos_demo_espera_hasta_ts']);
    }
    wabot_datos_demo_espera_marcar($conv, $ahora);
    wabot_datos_demo_anotar_turno($conv, 'esperar', 'Está mandando los datos de la demo: la ficha se arma a los ' . $min . ' min sin que escriba', 'datos_demo_espera');
    $conv['_comercial_salida'] = true;
    /* Con la espera larga (2 h, Pablo 11-nov: «la gente sigue mandando info») no puede quedar
     * callado todo ese rato: la primera vez se le acusa recibo y se lo invita a mandar el resto.
     * Lo que manda después se lee en silencio; la confirmación sale cuando se arma la ficha. */
    if ($min >= WABOT_DATOS_DEMO_ESPERA_LARGA_MIN && empty($conv['datos_demo_anotado_ts'])) {
        $conv['datos_demo_anotado_ts'] = $ahora;
        $texto = trim((string)($cfg['datos_demo_anotado'] ?? ''));
        if ($texto === '') $texto = '¡Anotado! Si tenés algo más para sumar (logo, fotos, colores), mandalo por acá. Te confirmo cuando arrancamos con la demo.';
        return [trim(wabot_personalizar($texto, $conv))];
    }
    return [];
}

/** ¿El bot no tiene que escribirle a este cliente? (Pablo tomó la charla, bot apagado en el chat o apagado del todo) */
function wabot_datos_demo_bot_callado($conv, $cfg) {
    return !empty($conv['control_manual']) || !empty($conv['bot_off'])
        || (is_array($cfg) && array_key_exists('activo', $cfg) && empty($cfg['activo']));
}

/**
 * El pedido de los datos lo mandó Pablo desde el panel (o tomó la charla después de pedirlos):
 * el bot queda apagado en ese chat y lo que el cliente contesta ya no pasa por el turno, así que
 * nadie armaba la ficha (con el link del formulario se armaba sola). Acá se lee lo que mandó, sin
 * contestarle nada: queda anotado con la misma espera, y cuando deja de escribir el cron arma la
 * ficha en silencio (wabot_datos_demo_espera_atender). Se llama en cada mensaje entrante.
 * Devuelve true si leyó datos.
 */
function wabot_datos_demo_en_silencio(&$conv, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    if (!wabot_datos_por_chat($cfg) || !wabot_datos_demo_pendiente($conv)) return false;
    if (empty($conv['control_manual']) && empty($conv['bot_off'])) return false;   // con el bot atendiendo lo hace el turno
    if (!empty($conv['datos_demo_espera_wsp'])) return false;
    // Nada nuevo desde la última lectura.
    $firma = wabot_datos_demo_ultima_firma_cliente($conv);
    if ($firma === '' || $firma === (string)($conv['datos_demo_silencio_firma'] ?? '')) return false;
    $todo = wabot_datos_demo_texto_cliente($conv);
    if ($todo === '' || mb_strlen(wabot_datos_demo_norm($todo)) < 8 || wabot_datos_demo_es_acuse_o_posterga($todo)) return false;
    $conv['datos_demo_silencio_firma'] = $firma;
    $d = wabot_datos_demo_extraer($todo, $conv, $cfg);
    if ($d === null || empty($d['es_datos'])) return false;
    $conv['datos_demo_parcial'] = $d;
    $conv['datos_demo_leido_filas'] = wabot_datos_demo_cliente_filas($conv);
    if (empty($conv['datos_demo_espera_ts'])) $conv['datos_demo_espera_ts'] = $ahora;
    if (wabot_datos_demo_pide_tiempo(wabot_datos_demo_ultimo_texto_cliente($conv))) {
        $conv['datos_demo_espera_hasta_ts'] = $ahora + WABOT_DATOS_DEMO_PIDE_TIEMPO_MIN * 60;
    } else {
        unset($conv['datos_demo_espera_hasta_ts']);
    }
    wabot_datos_demo_espera_marcar($conv, $ahora);
    wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($conv), 'motivo' => 'en_silencio']);
    return true;
}

/**
 * Lo que hace el cron con una charla cuya espera venció: si escribió algo después de
 * la última lectura relee todo, resuelve (ficha / lo que falta / WhatsApp) y manda.
 * Devuelve los mensajes que salieron.
 */
function wabot_datos_demo_espera_atender(&$cv, $cfg, $ahora) {
    $d = $cv['datos_demo_parcial'];
    $releido = false;
    // Solo si falta lo esencial: con el nombre y el rubro ya sabidos, leer las fotos no suma nada.
    $fotos = !empty($d['_material']) && wabot_datos_demo_faltan($cv, $d) ? wabot_datos_demo_fotos_texto($cv) : '';
    if ($fotos !== '' && md5($fotos) === (string)($cv['datos_demo_fotos_leidas'] ?? '')) $fotos = '';   // ya leídas
    if (wabot_datos_demo_cliente_filas($cv) > (int)($cv['datos_demo_leido_filas'] ?? 0) || $fotos !== '') {
        $todo = wabot_datos_demo_texto_cliente($cv);
        // Con solo material anotado, un «ok» o una pregunta suelta no gastan una lectura.
        if (!empty($d['_material']) && (wabot_datos_demo_es_acuse_o_posterga($todo) || mb_strlen(wabot_datos_demo_norm($todo)) < 12)) $todo = '';
        /* Solo material, pero lo que se ve en las fotos puede traer el nombre o los servicios (un
         * logo, un flyer): se lee una vez antes de pedirle lo que falta. */
        if ($todo !== '' || $fotos !== '') {
            $nuevo = wabot_datos_demo_extraer($todo, $cv, $cfg) ?? wabot_datos_demo_extraer_reglas($todo, $cv);
            if (!empty($nuevo['es_datos'])) { $d = $nuevo; $releido = true; }
        }
    }
    $desde = (int)($cv['datos_demo_espera_ts'] ?? 0);
    /* La charla la tomó Pablo (o el bot está apagado en ese chat): la ficha se arma igual, pero al
     * cliente no se le escribe nada. Antes salía «Para arrancar me falta…» o «Perfecto, con eso
     * armamos la demo» encima de lo que Pablo estaba contestando a mano (revisión del 10-nov). */
    $callado = wabot_datos_demo_bot_callado($cv, $cfg);
    $msgs = wabot_datos_demo_resolver($d, $cv, $cfg, $ahora);
    if ($callado) {
        if ($msgs && empty($cv['lead_creado']) && empty($cv['control_manual'])) $cv['handoff_pendiente'] = true;
        wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($cv), 'motivo' => 'callado', 'ficha' => !empty($cv['lead_creado']), 'sin_mandar' => count($msgs)]);
        $msgs = [];
    }
    foreach ($msgs as $m) {
        $m = trim((string)$m);
        if ($m === '') continue;
        if (wabot_enviar($cv, $m)) {
            $cv['auto_ultimo_ts'] = $ahora;
            wabot_conv_transcript($cv, 'bot', $m);
        }
    }
    wabot_log('datos_demo_espera', ['clave' => wabot_conversation_key($cv), 'minutos' => $desde > 0 ? round(($ahora - $desde) / 60) : null,
                                    'releido' => $releido, 'mensajes' => count($msgs), 'ficha' => !empty($cv['lead_creado'])]);
    return $msgs;
}

/**
 * El cron: a las charlas anotadas (wabot_datos_demo_espera_marcar) cuyo cliente lleva
 * datos_demo_espera_min minutos sin escribir, les arma la ficha o les pide lo que
 * falta. Con $convs (pruebas) trabaja sobre esas charlas en memoria, sin lock ni disco.
 */
function wabot_datos_demo_espera_correr($cfg = null, $ahora = null, &$convs = null) {
    $cfg = $cfg ?? wabot_config_load();
    $ahora = $ahora ?? time();
    $res = ['revisadas' => 0, 'atendidas' => 0, 'detalle' => []];
    if (!wabot_datos_por_chat($cfg)) return $res + ['motivo' => 'apagado'];

    if ($convs !== null) {
        foreach ($convs as &$cv) {
            if (!wabot_datos_demo_espera_vencida($cv, $cfg, $ahora)) continue;
            $res['revisadas']++;
            $res['detalle'][wabot_conversation_key($cv)] = wabot_datos_demo_espera_atender($cv, $cfg, $ahora);
            $res['atendidas']++;
        }
        unset($cv);
        return $res;
    }

    foreach (wabot_datos_demo_espera_indice() as $clave => $ts) {
        $clave = (string)$clave;
        if (stripos($clave, 'TEST') !== false && empty($GLOBALS['WABOT_TEST_SIN_RED'])) { wabot_datos_demo_espera_quitar($clave); continue; }
        $cv = wabot_conv_load($clave);
        if (!wabot_datos_demo_espera_sigue($cv)) { wabot_datos_demo_espera_quitar($clave); continue; }
        if (!wabot_datos_demo_espera_vencida($cv, $cfg, $ahora)) continue;
        $res['revisadas']++;

        $lock = wabot_lock_tomar($clave);
        if (!$lock) continue;
        try {
            $cv = wabot_conv_load($clave);
            if (!wabot_datos_demo_espera_vencida($cv, $cfg, $ahora)) continue;
            $res['detalle'][$clave] = wabot_datos_demo_espera_atender($cv, $cfg, $ahora);
            wabot_conv_save($cv);
            $res['atendidas']++;
        } finally {
            wabot_lock_soltar($lock);
        }
    }
    return $res;
}

/* ──────────── Lo que manda después de armada la ficha (10-nov) ────────────
 *
 * GREY mandó el logo y la ficha se armó; a los 15 minutos llegó el brief entero (qué
 * ofrece de verdad, los colores, lo que quiere sí o sí) y quedó solo en el chat: la
 * demo iba a salir con «mis miniapp, mis libros» y «Colores: no eligió». Hasta que la
 * demo se entrega (y por WABOT_DATOS_DEMO_TARDE_HORAS), un mensaje con cuerpo que llega
 * después de la ficha se lee igual que los datos: lo que trae pisa lo anterior en la
 * charla, se anota «[Datos de la demo por chat: actualización]» y se completa la ficha
 * de `propuestas`. El bot no contesta (después de la ficha contesta Pablo): queda
 * pendiente para él. Un «ok», una pregunta corta o una foto no gastan una lectura.
 */
const WABOT_DATOS_DEMO_TARDE_HORAS = 72;

/**
 * Qué renglón del cliente es: su id de WhatsApp/Instagram o, si no lo trae, la hora y el
 * texto. No se cuentan renglones: el archivo de la charla guarda solo los últimos
 * WABOT_TRANSCRIPT_VIVO y, al recortarse, un contador dejaba de ver los mensajes nuevos.
 */
function wabot_datos_demo_fila_firma($fila) {
    $id = trim((string)($fila['id'] ?? ''));
    return $id !== '' ? 'id:' . $id : 'h:' . md5((int)($fila['ts'] ?? 0) . '|' . (string)($fila['t'] ?? ''));
}

/** La firma de lo último que escribió el cliente ('' si no escribió nada). */
function wabot_datos_demo_ultima_firma_cliente($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (($fila['q'] ?? '') === 'cliente') return wabot_datos_demo_fila_firma($fila);
    }
    return '';
}

/** Fila del transcript desde la que hay que leer lo tardío: después de lo ya leído. */
function wabot_datos_demo_tarde_desde($conv) {
    $t = array_values((array)($conv['transcript'] ?? []));
    $firma = (string)($conv['datos_demo_tarde_firma'] ?? '');
    if ($firma !== '') {
        for ($i = count($t) - 1; $i >= 0; $i--) {
            if (($t[$i]['q'] ?? '') === 'cliente' && wabot_datos_demo_fila_firma($t[$i]) === $firma) return $i + 1;
        }
    }
    // Sin firma (fichas de antes) o con ese renglón ya fuera del archivo: desde la línea que anotó la ficha.
    $ultima = -1;
    foreach ($t as $i => $fila) {
        if (($fila['q'] ?? '') === 'sistema' && strpos((string)($fila['t'] ?? ''), '[Datos de la demo por chat') === 0) $ultima = $i;
    }
    // Si tampoco está, todo lo que queda en el archivo es posterior.
    return $ultima >= 0 ? $ultima + 1 : 0;
}

/**
 * ¿El nombre de la ficha ya no se puede cambiar? De ese nombre sale la carpeta de la demo
 * (wabot_slug_demo) y la presentación automática la busca por ahí: si la demo ya está publicada
 * y el cliente después escribe su marca de otra forma («GREY INOVACION» → «GREY INNOVACIÓN»), el
 * cambio dejaba a la presentación buscando una carpeta que no existe. Un nombre nuevo que da la
 * misma carpeta sí se acepta.
 */
function wabot_datos_demo_nombre_fijo($conv, $nuevo) {
    $actual = trim((string)($conv['nombre_negocio'] ?? ''));
    if ($actual === '' || !function_exists('wabot_slug_demo')) return false;
    $slug = (string)wabot_slug_demo($actual);
    if ($slug === '' || $slug === (string)wabot_slug_demo((string)$nuevo)) return false;
    if (isset($GLOBALS['WABOT_TEST_DEMO_PUBLICADA'])) return in_array($slug, (array)$GLOBALS['WABOT_TEST_DEMO_PUBLICADA'], true);
    return is_file(dirname(__DIR__) . '/demo/' . $slug . '/index.html');
}

/**
 * Lee lo que mandó después de la ficha y, si son datos, actualiza la charla y la
 * ficha. Devuelve true si cambió algo. Se llama en cada mensaje entrante (webhook),
 * con el bot prendido o apagado.
 */
function wabot_datos_demo_tardios(&$conv, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    if (!wabot_datos_por_chat($cfg)) return false;
    $recibido = (int)($conv['datos_recibidos_ts'] ?? 0);
    if ($recibido <= 0 || ($conv['origen_prediseno'] ?? '') !== 'chat' || empty($conv['lead_creado'])) return false;
    if ((int)($conv['presentado_ts'] ?? 0) > 0 || $ahora - $recibido > WABOT_DATOS_DEMO_TARDE_HORAS * 3600) return false;
    // Nada nuevo desde la última lectura (se compara el último renglón del cliente, no una cuenta).
    $firma = wabot_datos_demo_ultima_firma_cliente($conv);
    if ($firma === '' || $firma === (string)($conv['datos_demo_tarde_firma'] ?? '')) return false;

    $nuevo = wabot_datos_demo_texto_cliente($conv, wabot_datos_demo_tarde_desde($conv));
    // Sin cuerpo no hay datos que leer: se sigue juntando hasta que lo haya.
    if (mb_strlen(wabot_datos_demo_norm($nuevo)) < 40 && substr_count($nuevo, "\n") < 2) return false;
    $conv['datos_demo_tarde_firma'] = $firma;
    if (wabot_datos_demo_es_acuse_o_posterga($nuevo)) return false;

    $d = wabot_datos_demo_extraer($nuevo, $conv, $cfg);
    if ($d === null || empty($d['es_datos'])) return false;

    $cambios = [];
    $negocio = $d['nombre_negocio'] !== '' && function_exists('wabot_nombre_negocio_limpiar') ? wabot_nombre_negocio_limpiar($d['nombre_negocio']) : $d['nombre_negocio'];
    if ($negocio !== '' && $negocio !== trim((string)($conv['nombre_negocio'] ?? ''))) {
        if (wabot_datos_demo_nombre_fijo($conv, $negocio)) {
            $cambios[] = 'Nombre que escribió después: ' . $negocio . ' (la ficha conserva el anterior: su demo ya está publicada con ese nombre)';
        } else {
            $conv['nombre_negocio'] = $negocio;
            $cambios[] = 'Negocio: ' . $negocio;
        }
    }
    if ($d['resumen'] !== '' && $d['resumen'] !== trim((string)($conv['descripcion'] ?? ''))) { $conv['descripcion'] = $d['resumen']; $cambios[] = 'Resumen: ' . $d['resumen']; }
    if ($d['colores'] !== '' && $d['colores'] !== trim((string)($conv['colores'] ?? ''))) {
        $conv['colores'] = $d['colores'];
        $conv['colores_hex'] = function_exists('wabot_colores_a_hex') ? wabot_colores_a_hex($d['colores']) : null;
        $cambios[] = 'Colores: ' . $d['colores'];
    }
    $ig = wabot_datos_demo_instagram_usuario($d['instagram']);
    if ($ig !== '' && $ig !== trim((string)($conv['instagram'] ?? ''))) { $conv['instagram'] = $ig; $cambios[] = 'Instagram: instagram.com/' . $ig; }
    if ($d['referencia'] !== '' && $d['referencia'] !== trim((string)($conv['referencia'] ?? ''))
        && (!function_exists('wabot_referencia_utilizable') || wabot_referencia_utilizable($d['referencia']))) {
        $conv['referencia'] = $d['referencia']; $cambios[] = 'Referencia: ' . $d['referencia'];
    }
    if ($d['incluir'] !== '' && $d['incluir'] !== trim((string)($conv['incluir'] ?? ''))) { $conv['incluir'] = $d['incluir']; $cambios[] = 'Incluir sí o sí: ' . $d['incluir']; }
    if (!$cambios) return false;

    wabot_conv_transcript($conv, 'sistema', '[Datos de la demo por chat: actualización] ' . implode(' · ', $cambios));
    $conv['datos_demo_tarde_ts'] = $ahora;
    // El brief era de la charla de antes: se rearma con todo (si la IA no contesta, queda el anterior).
    if (function_exists('wabot_resumen_negocio')) {
        $brief = wabot_resumen_negocio($conv, $cfg);
        if (is_array($brief) && $brief) $conv['brief'] = $brief;
    }
    $ok = wabot_datos_demo_ficha_actualizar($conv, $cfg, $d);
    /* Con el bot siguiendo hasta la demo (11-nov) lo acusa el bot y la ficha ya quedó
     * al día: no es algo que Pablo tenga que contestar. Con el bot apagado, lo ve él. */
    if (empty($conv['control_manual']) && !empty($conv['bot_off'])) $conv['handoff_pendiente'] = true;
    wabot_log('datos_demo_tarde', ['clave' => wabot_conversation_key($conv), 'campos' => count($cambios), 'ficha' => $ok]);
    return true;
}

/**
 * Completa la ficha que ya existe con lo que llegó después. Sin login, las reglas de
 * `propuestas` solo dejan tocar algunos campos: el nombre, el rubro, los colores, el
 * Instagram y `objetivos` («Objetivos de la web»), que es donde va lo que no tiene
 * campo editable (qué ofrece, qué quiere incluir, la referencia). Con
 * currentDocument.exists: una ficha que Pablo ya procesó no se resucita.
 */
function wabot_datos_demo_ficha_actualizar(&$conv, $cfg, array $d) {
    $doc = trim((string)($conv['lead_doc'] ?? ''));
    if ($doc === '' || $doc === (string)($conv['lead_doc_borrado'] ?? '')) return false;
    $brief = is_array($conv['brief'] ?? null) ? $conv['brief'] : [];
    $rubro = trim((string)($brief['negocio'] ?? '')) ?: trim((string)($conv['descripcion'] ?? ''));
    $nota = ['Actualizó los datos por el chat después de armada la ficha.'];
    $ofrece = $d['resumen'] !== '' ? $d['resumen'] : trim((string)($brief['ofrece'] ?? ''));
    if ($ofrece !== '') $nota[] = 'Qué ofrece: ' . $ofrece;
    if (trim((string)($conv['incluir'] ?? '')) !== '') $nota[] = 'Incluir sí o sí: ' . trim((string)$conv['incluir']);
    if ($d['referencia'] !== '') $nota[] = 'Referencia: ' . $d['referencia'];
    $campos = [
        'nombre_negocio'   => ['stringValue' => (string)($conv['nombre_negocio'] ?? '')],
        'rubro'            => ['stringValue' => $rubro],
        'negocio_rubro'    => ['stringValue' => $rubro],
        'colores'          => ['stringValue' => (string)($conv['colores'] ?? '')],
        'color_principal'  => ['stringValue' => (string)($conv['colores_hex']['principal'] ?? '')],
        'color_secundario' => ['stringValue' => (string)($conv['colores_hex']['secundario'] ?? '')],
        'color_fondos'     => ['stringValue' => (string)($conv['colores_hex']['fondos'] ?? '')],
        'instagram'        => ['stringValue' => (string)($conv['instagram'] ?? '')],
        'objetivos'        => ['stringValue' => mb_substr(implode("\n", $nota), 0, 4000)],
        'updatedAt'        => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
    ];
    $clave = wabot_conversation_key($conv);
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED']) || stripos($clave, 'TEST') !== false) {
        $GLOBALS['WABOT_TEST_DATOS_TARDE_PATCH'] = $campos;
        return true;
    }
    $mask = '';
    foreach (array_keys($campos) as $k) $mask .= '&updateMask.fieldPaths=' . $k;
    $ch = curl_init('https://firestore.googleapis.com/v1/' . $doc . '?key=' . WABOT_FIREBASE_API_KEY . $mask . '&currentDocument.exists=true');
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => $campos], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 200 && $code < 300) return true;
    wabot_log('error', ['donde' => 'firestore_datos_tarde', 'clave' => $clave, 'doc' => $doc, 'http' => $code, 'res' => substr((string)$res, 0, 300)]);
    return false;
}
