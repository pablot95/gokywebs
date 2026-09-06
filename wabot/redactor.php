<?php
/**
 * wabot/redactor.php — capa opcional que reescribe la respuesta del motor con
 * palabras propias, para que el bot no suene a plantilla.
 *
 * REGLA DE ORO: el motor sigue decidiendo QUÉ decir; el redactor solo cambia
 * CÓMO se dice. Todo lo que no puede fallar (precio, link, derivación) se
 * valida contra el texto base y, si no coincide, se manda el texto fijo.
 * El peor caso posible es el comportamiento que ya teníamos.
 */

require_once __DIR__ . '/engine.php';   // engine.php ya trae lib.php

/**
 * Devuelve la respuesta final para el cliente.
 * Si el modo natural está apagado o la redacción no pasa los controles,
 * devuelve el texto fijo del motor tal cual.
 */
function wabot_responder($texto, &$conv, $cfg) {
    $modo = $cfg['modo_redaccion'] ?? 'fijo';

    /* Lo primero de todo: si este cliente ya venía hablando por el otro canal,
     * se trae lo que dejó allá ANTES de que nadie lea el estado. Si no, el
     * mismo cliente arranca de cero acá —le preguntan lo que ya contó y le
     * ofrecen el formulario que ya completó— que es lo que le pasó a Natalia
     * el 3-sep. Ver wabot_conv_adoptar_hermana(). */
    wabot_conv_adoptar_hermana($conv, $cfg);

    // El reset pertenece al borde común, antes de que el agente vea el estado y
    // antes de actualizar ultimo_ts. Así también funciona en modo agente, donde
    // el motor de reglas puede no ejecutarse nunca.
    wabot_turno_preparar($conv, $cfg, time());

    if (!empty($conv['demo_texto_pendiente'])) {
        $conv['demo_texto_pendiente'] = false;
        return wabot_muestra_presentar_textos((string)($conv['presentado_slug'] ?? ''), $cfg);
    }

    /* Baja pedida: no se le escribe más, en ningún modo de redacción. El motor
     * ya lo respetaba, pero en modo agente el modelo agarraba el turno primero
     * y a un "sacame de la lista" le contestó una derivación con promesa de
     * contacto (D09, 1-sep) — lo contrario exacto de lo pedido. Pedir una web
     * de nuevo sí la reabre: la baja es del contacto comercial, no del cliente. */
    if (($conv['cierre'] ?? '') === 'baja') {
        if (wabot_reabre_consulta($texto) || wabot_texto_pide_web($texto)) {
            $conv['cierre'] = null;
            $conv['seguimiento_bloqueado'] = false;
            $conv['seguimiento_estado'] = null;
            $conv['bot_off'] = false;
        } else {
            return [];
        }
    }

    /* Parte 2 de la venta: la cierra el desarrollador, no el bot. El texto no
     * es fijo: wabot_postdemo_responder() contesta lo que el cliente dijo
     * —elogio, pedido de cambio, "no me cerró", que la va a mirar— (Pablo,
     * 28-ago: "que el mensaje dependa de lo que envía el cliente").
     *
     * Y desde el 5-sep el aviso de que sigue el desarrollador sale SOLO con
     * interés real. Mientras no lo haya, esto puede devolver null: ahí el
     * turno sigue de largo y lo contesta el agente con sus palabras, que es lo
     * que pidió Pablo ("que siga contestando dudas, no venda, más natural").
     * El agente en esta fase no tiene herramientas de cobro. */
    if (($conv['fase'] ?? '') === 'postdemo' && !empty($conv['presentado_ts'])) {
        $postdemo = wabot_postdemo_responder($texto, $conv, $cfg);
        if ($postdemo !== null) return $postdemo;
    }

    /* Ya avisado que sigue el desarrollador: el AVISO no se repite nunca más.
     *
     * La primera respuesta pasa la fase a 'derivado', y todo lo que el cliente
     * mandaba después caía en el agente o en wabot_cerrada() y volvía a recibir
     * alguna versión de "te escribe a la brevedad", una y otra vez. En la
     * charla de Silvana salió cinco veces seguidas (Pablo, 28-ago: "malísimo
     * que sea tan reiterativo, que lo diga una vez y ya deje de contestar").
     *
     * Lo que NO se repite es el aviso; una PREGUNTA sí se contesta (Pablo,
     * 5-sep: "la idea es que siga contestando dudas, no venda"). Por eso las
     * preguntas siguen de largo hasta el agente, que en fase derivado solo
     * tiene consultar_info —informa, no vende— y tiene prohibido reprometer el
     * contacto. Lo que no es pregunta (un "dale", "gracias", una foto) se
     * guarda en el transcript, le aparece al desarrollador en el panel y no se
     * contesta: ahí no hay nada que agregar. */
    if (!empty($conv['presentado_ts']) && !empty($conv['postdemo_avisado'])) {
        /* El silencio no puede tragarse el AVISO DE PAGO. "Ya te transferí la
         * seña" durante esta etapa quedaba sin marcar: pago_avisado_ts en 0, el
         * chat nunca entraba a la columna "Pagaron" —la más urgente del panel—
         * y sin push (D01, 1-sep). Acusar recibo de un pago no es vender: es lo
         * mismo que ya hace wabot_postdemo_responder() cuando la fase sigue en
         * postdemo. Una sola vez; si ya está marcado, silencio como siempre. */
        if (empty($conv['pago_avisado_ts']) && wabot_dice_que_pago($texto)) {
            $conv['pago_avisado_ts'] = time();
            $conv['presentado_confirmado'] = true;
            wabot_evento_sesion($conv, 'pago_avisado', ['origen' => 'postdemo_silencio']);
            return [(string)($cfg['postdemo_pago_avisado'] ?? '')];
        }
        /* Un pedido de cambios se ANOTA siempre: el desarrollador tiene que
         * verlo junto al boceto, no perdido en el transcript. */
        if (wabot_postdemo_pide_cambios($texto)) {
            $previos = trim((string)($conv['cambios_pedidos'] ?? ''));
            $nuevo = trim((string)$texto);
            if ($nuevo !== '' && mb_strpos($previos, $nuevo) === false) {
                $conv['cambios_pedidos'] = $previos === '' ? $nuevo : $previos . ' | ' . $nuevo;
                wabot_evento_sesion($conv, 'cambios_pedidos', ['origen' => 'postdemo_silencio']);
            }
            return [(string)($cfg['postdemo_cambios'] ?? '')];
        }
        /* Una PREGUNTA se contesta: sigue de largo hasta el agente, que en fase
         * derivado solo informa. Lo que no pregunta nada, silencio. */
        $preguntaAlgo = function_exists('wabot_mensaje_pregunta_algo')
            ? wabot_mensaje_pregunta_algo($texto)
            : (mb_strpos((string)$texto, '?') !== false);
        if (!$preguntaAlgo) return [];
    }

    /* El aviso que manda el propio formulario, con el formulario ya recibido.
     * No hay nada que preguntar: los datos están. Se acusa recibo con el texto
     * de siempre —que trae {entrega}, la única fecha de entrega del sistema— y
     * se sigue. Determinista porque acá el modelo hizo las dos cosas mal el
     * mismo día: a Natalia le arrancó el embudo de cero (le preguntó qué era su
     * negocio con el resumen ya escrito) y a Mayra le inventó "hoy a la tarde"
     * un minuto antes de que el texto oficial dijera "mañana".
     *
     * Va detrás de la adopción de la hermana, así que también cubre al que
     * completó el formulario desde Instagram y aparece por WhatsApp; y detrás
     * de los cortes de baja y postdemo, para no contestarle "la demo te llega
     * mañana" a alguien que ya la recibió o que pidió que no le escribamos. */
    if (wabot_texto_es_aviso_de_formulario($texto) && (int)($conv['form_completado_ts'] ?? 0) > 0) {
        if (empty($conv['form_aviso_respondido'])) {
            $conv['form_aviso_respondido'] = true;
            wabot_evento_sesion($conv, 'form_aviso_recibido');
            $espera = trim((string)($cfg['espera_prediseno'] ?? ''));
            if ($espera !== '') return [wabot_personalizar($espera, $conv)];
        }
        return [];
    }

    /* "Sale lo mismo con carrito?" / "si lo agendo yo cuál es la diferencia":
     * la respuesta son dos precios que el bot ya tiene, y se contesta sin
     * pasar por el modelo. En la batería del 27-ago el agente falló las dos
     * veces de formas distintas —en una contestó el detalle de cuotas, en la
     * otra ofreció la demo sin contestar nada— y las dos preguntas habían
     * costado, en producción, una hora y diez minutos de espera hasta que
     * Pablo las contestó a mano. Es determinista: no puede depender del
     * modelo. Vale en los tres modos de redacción. */
    if (!empty($conv['precio_dado'])) {
        $tipoAlterno = wabot_texto_pregunta_comparacion_tipo($texto);
        if ($tipoAlterno !== null && ($conv['tipo'] ?? '') === $tipoAlterno) {
            $comparacion = wabot_comparacion_tipo_texto($tipoAlterno, $conv, $cfg);
            if ($comparacion !== null) {
                wabot_evento_sesion($conv, 'comparacion_tipo_respondida', ['tipo' => $tipoAlterno]);
                return [$comparacion];
            }
        }
    }

    /* "Cuánto cuesta agregar venta y cobro online?" con una landing ya
     * cotizada: la respuesta son dos precios que el bot ya tiene. A Aberturas
     * le preguntó si era el mismo proyecto y le repitió el precio de la
     * landing (27-ago) — le contestó el producto anterior. Determinista, igual
     * que la comparación de arriba: no puede depender del modelo. */
    if (!empty($conv['precio_dado'])) {
        $destino = wabot_texto_pregunta_upgrade($texto, (string)($conv['tipo'] ?? ''));
        if ($destino !== null) {
            $upgrade = wabot_upgrade_texto($destino, $conv, $cfg);
            if ($upgrade !== null) {
                wabot_evento_sesion($conv, 'upgrade_consultado', ['de' => (string)$conv['tipo'], 'a' => $destino]);
                return [$upgrade];
            }
        }
    }

    /* "Mejor sin carrito, que me escriban por WhatsApp" después de cotizar
     * ecommerce: cambió de modalidad y hay que recotizar. El modelo le ofreció
     * la demo y al turno siguiente le preguntó si era para el mismo proyecto;
     * el precio nuevo nunca llegó (27-ago). Es una decisión explícita del
     * cliente, no una duda: la cotización nueva es determinista. */
    if (!empty($conv['precio_dado'])) {
        $tipoNuevo = wabot_texto_cambia_modalidad($texto, (string)($conv['tipo'] ?? ''));
        if ($tipoNuevo !== null && isset($cfg['tipos'][$tipoNuevo])) {
            wabot_evento_sesion($conv, 'cambio_modalidad', ['de' => (string)$conv['tipo'], 'a' => $tipoNuevo]);
            // Se limpian las marcas del tipo viejo para que wabot_precio()
            // cotice el nuevo de verdad en vez de devolver el resumen del que
            // ya estaba dado.
            $conv['precio_dado'] = false;
            $conv['cta_muestra'] = false;
            $conv['pitch_hecho'] = true;   // el pitch ya se hizo con el tipo viejo
            return wabot_precio($tipoNuevo, $conv, $cfg);
        }
    }

    // El listado de datos se pide UNA vez. Después, a un "ok" / "listo
    // gracias" / "si" se le contesta una sola línea corta y, si sigue
    // acusando recibo, silencio: repetirle tres veces "cuando los tengas me
    // avisás" es lo que hizo el bot con una clienta de cosméticos el 27-ago.
    if (wabot_prediseno_acuse($texto, $conv)) {
        if (!empty($conv['prediseno_acuse_respondido'])) return [];
        $conv['prediseno_acuse_respondido'] = true;
        return [(string)$cfg['prediseno_espera_datos']];
    }

    /* "Me pueden hacer una página en Wix?" — la objeción de plataforma no
     * puede depender de que el modelo la reconozca, sobre todo cuando viene
     * junto con el rubro en el mismo mensaje (ver wabot_texto_pide_armar_en_
     * plataforma). No corre en derivado/postdemo: esas fases ya tienen su
     * propio manejo cerrado y este atajo las pisaría. */
    if (!in_array(($conv['fase'] ?? ''), ['derivado', 'postdemo'], true)
        && wabot_texto_pide_armar_en_plataforma($texto)) {
        wabot_evento_sesion($conv, 'objecion_plataforma_forzada');
        return [wabot_objecion_texto('plataforma', (string)$cfg['plataformas'], $conv, $cfg)];
    }

    /* Pedir una llamada, o hablar con una persona, deriva a Pablo SIEMPRE.
     *
     * Va acá arriba, antes del agente y del motor, porque es lo único que no se
     * puede delegar: el bot que contesta "no solemos hacer llamadas" pierde la
     * venta en ese mismo mensaje (caso Marcelo, 28-ago). Post-demo no aplica —
     * ahí ya está derivado y el corte de arriba lo maneja. */
    if (!in_array(($conv['fase'] ?? ''), ['derivado', 'postdemo'], true)
        && wabot_pide_llamada($texto)) {
        wabot_evento_sesion($conv, 'pidio_llamada');
        return wabot_derivar_llamada($conv, $cfg);
    }

    // Otro proveedor mandando SU promo no es un lead: no se le contesta nada,
    // en ningún modo. Va antes de la apertura porque el volante suele llegar
    // como primer mensaje, justo donde el bot saludaba y preguntaba el rubro.
    if (wabot_texto_es_proveedor($texto)) {
        wabot_log('proveedor_ignorado', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr((string)$texto, 0, 90)]);
        return wabot_cerrar_proveedor($conv);
    }

    /* Ni todo el que escribe viene a comprar. Al que ya es cliente o al que
     * manda un CV, arrancarle el embudo con "contame qué vendés" le confirma
     * que no lo leyó nadie. Va acá, en el borde común de los tres modos y
     * antes de la apertura, por el mismo motivo que el volante del proveedor:
     * suele ser el primer mensaje. */
    if (!empty($conv['contexto_consulta'])) {
        // Ya se lo dijimos y lo tomó Pablo: no se le vende ni se le repite.
        // Salvo que ahora sí pida una web, y ahí la charla se reabre normal.
        if (!wabot_texto_pide_web($texto)) return [];
        $conv['contexto_consulta'] = null;
    }
    $contextoNoVenta = wabot_contexto_consulta($texto, $conv);
    if ($contextoNoVenta !== null) {
        $conv['contexto_consulta'] = $contextoNoVenta;
        $conv['handoff_pendiente'] = true;
        $conv['seguimiento_bloqueado'] = true;
        wabot_log('contexto_no_venta', ['tel' => $conv['tel'] ?? '', 'contexto' => $contextoNoVenta]);
        wabot_evento_sesion($conv, 'contexto_no_venta', ['contexto' => $contextoNoVenta]);
        $claveTexto = $contextoNoVenta === 'laboral' ? 'mensaje_laboral' : 'mensaje_cliente_existente';
        return [(string)($cfg[$claveTexto] ?? $cfg['espera'] ?? '')];
    }

    // El saludo de apertura es SIEMPRE el mismo texto fijo, en los tres modos.
    // Si el bot todavía no habló y el cliente no dijo nada de su negocio no hay
    // nada que razonar: dejarlo en manos de la IA solo hacía que cada cliente
    // recibiera una presentación distinta y más larga. Corta antes del motor
    // también, porque el clasificador manda algunos openers a "contame" y otros
    // al saludo — acá tienen que salir todos iguales. Y de paso ahorra la
    // llamada a Gemini, que en el primer mensaje no aporta nada.
    $apertura = wabot_apertura($conv, $cfg);
    if ($apertura !== $cfg['contame'] && wabot_apertura_generica($texto)
        && in_array(($conv['fase'] ?? 'nuevo'), ['nuevo', 'menu'], true)) {
        $conv['fase'] = 'menu';
        return [$apertura];
    }

    // "Lo veo con mi socia y te aviso": el cliente tomó el control de los
    // tiempos. Queda anotado para que el seguimiento automático no lo persiga
    // ese mismo día (casos Oscar y "veo el enlace con mi socia", 21-ago).
    if (wabot_dijo_te_aviso($texto)) {
        $conv['aviso_prometido_ts'] = time();
    }

    // "Quiero mi demo gratis" de entrada: cuando llegue el precio no se le
    // vuelve a ofrecer la demo — se pasa directo a pedirle los datos.
    if (wabot_pidio_demo_explicita($texto)) {
        $conv['demo_pedida_entrada'] = true;
    }

    // Charla cerrada + acuse de recibo ("ok", "gracias", "igualmente", 👍) =
    // silencio. Va acá, antes del agente, porque el que encadenaba tres
    // despedidas seguidas era el modelo, no el motor: una regla de prompt no
    // alcanzaba. Ver wabot_es_acuse().
    if (($conv['fase'] ?? '') === 'derivado' && wabot_es_acuse($texto)) {
        $conv['espera_avisada'] = true;
        return [];
    }

    // Lo mismo cuando la charla se cerró sin presión y el bot no dejó ninguna
    // pregunta abierta: un "👍 si" después de "quedo a disposición" es un
    // acuse, no un "sí, armala" — contestarlo con otra oferta de demo obligaba
    // al cliente a frenar al bot ("Déjame hablarlo", 21-ago).
    if (!empty($conv['cierre']) && (wabot_es_acuse($texto) || wabot_es_afirmativa($texto))) {
        $ultimaDelBot = '';
        foreach (array_reverse((array)($conv['transcript'] ?? [])) as $linea) {
            if (($linea['q'] ?? '') === 'bot') { $ultimaDelBot = (string)($linea['t'] ?? ''); break; }
        }
        if (strpos($ultimaDelBot, '?') === false) return [];
    }

    /* El listado de datos lo armó el bot, así que leer la respuesta que sigue
     * ese formato no puede depender del modelo (caso Whitesoul, 27-ago). Anota
     * y NO contesta: el flujo sigue igual, pero ya con la ficha completa. */
    wabot_prediseno_lista_posicional($texto, $conv);

    /* "No tengo ninguna referencia": una negativa también contesta la pregunta.
     * Va acá, en el borde común, por el mismo motivo que la lista posicional:
     * la pregunta la hizo el bot, así que leer la respuesta no puede depender
     * de que el modelo llame la herramienta con el argumento justo. */
    wabot_prediseno_referencia_negada($texto, $conv);

    /* "Está todo en lo que te mandé". El cliente sostiene que ya pasó los
     * datos y el bot se los sigue pidiendo por partes (Clínica de Mar,
     * 27-ago). Si después de releer lo que hay todavía faltan, el bot ya
     * demostró que no los puede sacar solo: insistir es la fricción que
     * costó esa charla. Lo toma Pablo con todo lo que el cliente escribió,
     * que es lo único que no pierde la venta. */
    if (in_array(($conv['fase'] ?? ''), ['prediseno', 'prediseno_ref'], true)
        && wabot_apunta_a_lo_ya_dicho($texto)
        && wabot_prediseno_faltan($conv, false)) {
        wabot_evento_sesion($conv, 'prediseno_datos_no_extraibles');
        return wabot_derivar($conv, $cfg, 'datos_ya_dados');
    }

    // Modo agente: Gemini lleva la charla con herramientas. Si falla por lo que
    // sea, seguimos abajo con el motor de reglas, que nunca deja al cliente sin
    // respuesta. Ojo: la conversación puede haber quedado ya derivada por una
    // herramienta, y en ese caso el motor responde el silencio que corresponde.
    // Con la charla cerrada el agente sigue trabajando, pero con las herramientas
    // de venta sacadas (ver wabot_agente_tools): puede resolver dudas y no puede
    // recotizar. Si falla, abajo contesta el motor, que tampoco reabre la venta.
    if ($modo === 'agente') {
        require_once __DIR__ . '/agente.php';
        $r = wabot_agente($texto, $conv, $cfg);
        if ($r !== null) return $r;
        wabot_log('agente_fallback', ['tel' => $conv['tel'] ?? '']);
        if (function_exists('wabot_evento_sesion')) {
            wabot_evento_sesion($conv, 'ia_fallback_seguro', ['origen' => 'agente']);
        }
    }

    $base = wabot_engine($texto, $conv, $cfg);
    if (!$base) return $base;

    if ($modo !== 'natural') return $base;

    // Estos momentos NO se reescriben: son el cierre de la venta y el corte.
    // Un precio parafraseado o una derivación ablandada cuestan plata.
    if ($conv['fase'] === 'derivado') return $base;

    // Solo se reescribe el primero. Los que van detrás son mensajes aparte
    // —el ofrecimiento del prediseño— y tienen que llegar como están, en su
    // propio globo: si se los juntara para reescribirlos, se pierde el corte.
    $libre = wabot_redactar($texto, $base[0], $conv, $cfg);
    if ($libre === null) return $base;
    $base[0] = $libre;
    return $base;
}

/**
 * Pide a Gemini una versión más natural del mensaje base y la valida.
 * Devuelve null si algo no cierra (y entonces se usa el texto fijo).
 */
function wabot_redactar($mensajeCliente, $base, $conv, $cfg) {
    if (isset($GLOBALS['WABOT_TEST_REDACTOR'])) {
        $salida = call_user_func($GLOBALS['WABOT_TEST_REDACTOR'], $mensajeCliente, $base, $conv, $cfg);
    } else {
        if (WABOT_GEMINI_KEY === 'COMPLETAR') return null;
        $salida = wabot_redactar_gemini($mensajeCliente, $base, $conv, $cfg);
    }
    if (!is_string($salida)) return null;

    return wabot_validar_redaccion($salida, $base, $cfg);
}

/** Llama a Gemini con el mensaje base y el contexto de la charla. */
function wabot_redactar_gemini($mensajeCliente, $base, $conv, $cfg) {
    // Los tests no deben consumir cuota y, si Gemini acaba de devolver 429 o
    // falló por transporte, el redactor respeta el mismo backoff que el agente.
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED'])) return null;
    if (function_exists('wabot_ia_disponible') && !wabot_ia_disponible()) return null;

    // Últimos intercambios, para que no repita lo que ya dijo.
    $hist = '';
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $sesion = array_values(array_filter((array)($conv['transcript'] ?? []), function ($t) use ($inicio) {
        return $inicio <= 0 || (int)($t['ts'] ?? 0) >= $inicio;
    }));
    foreach (array_slice($sesion, -6) as $t) {
        $quien = $t['q'] === 'cliente' ? 'Cliente' : 'Vos';
        $hist .= "$quien: " . mb_substr($t['t'], 0, 200) . "\n";
    }

    $extra = trim((string)($cfg['indicaciones_estilo'] ?? ''));

    $prompt = <<<EOT
Sos el asistente comercial de Gokywebs, una agencia argentina de diseño y desarrollo web. Atendés por WhatsApp a dueños de negocios.

Tu tarea NO es inventar una respuesta: es reescribir el MENSAJE BASE con tus palabras, para que suene a persona y no a plantilla, manteniendo exactamente la misma información y la misma intención comercial.

REGLAS QUE NO PODÉS ROMPER:
- No agregues ni quites información. Nada de datos, precios, plazos ni funciones que no estén en el mensaje base.
- Si el mensaje base tiene un precio, escribilo idéntico, con el mismo formato.
- Si el mensaje base tiene un link, copialo idéntico, carácter por carácter, respetando mayúsculas. No inventes otros links.
- Si el mensaje base tiene el link en un renglón propio, mantené ese salto de línea: la frase que presenta el link arranca en un renglón nuevo.
- Voseo argentino, cordial y directo. Como habla un dueño de agencia, no un vendedor.
- Sin emojis y sin íconos.
- Nunca uses los signos de apertura de interrogación ni de exclamación. Solo el de cierre o ninguno.
- Escribí con las tildes correctas: "querés", "preferís", "ahí", "buenísimo". Que sea informal no significa escribir mal.
- Corto: 2 a 4 líneas como mucho. En WhatsApp nadie lee párrafos.
- Si el mensaje base termina con una pregunta, la tuya también tiene que terminar preguntando lo mismo.
- No saludes de nuevo si ya venían hablando.

EOT;

    if ($extra !== '') $prompt .= "INDICACIONES DE ESTILO DEL DUEÑO:\n$extra\n\n";
    if ($hist !== '')  $prompt .= "ÚLTIMOS MENSAJES DE LA CHARLA:\n$hist\n";

    $prompt .= "MENSAJE DEL CLIENTE AHORA:\n\"$mensajeCliente\"\n\n";
    $prompt .= "MENSAJE BASE A REESCRIBIR:\n\"\"\"\n$base\n\"\"\"\n\n";
    $prompt .= "Devolvé SOLO el mensaje reescrito, sin comillas ni explicaciones.";

    $url  = 'https://generativelanguage.googleapis.com/v1beta/models/' . wabot_gemini_modelo($cfg) . ':generateContent?key=' . WABOT_GEMINI_KEY;
    $body = json_encode([
        'contents' => [['parts' => [['text' => $prompt]]]],
        'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 400],
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code < 200 || $code >= 300 || !$res) {
        wabot_log('error', ['donde' => 'redactor', 'http' => $code]);
        if (function_exists('wabot_ia_reportar_error')) wabot_ia_reportar_error('redactor', $code);
        return null;
    }
    if (function_exists('wabot_ia_reportar_ok')) wabot_ia_reportar_ok();
    $j = json_decode($res, true);
    return $j['candidates'][0]['content']['parts'][0]['text'] ?? null;
}

/**
 * Palabras en portugués que se le escapan al modelo al reescribir en español.
 *
 * Un "si não tenés no pasa nada" llegó tal cual a una clienta el 26-ago: el
 * texto base decía "si no tenés", y el modelo lo retipeó con el "não" de al
 * lado. Se corrige en vez de rechazar la redacción entera: por una palabra no
 * vale la pena tirar abajo el mensaje y caer al motor de reglas.
 *
 * La lista es corta y solo tiene palabras que NO existen en español, para que
 * no pueda romper un texto correcto. Respeta mayúscula inicial.
 */
function wabot_castellanizar($texto) {
    // Nada de "com", "seu" o "para": existen o se parecen demasiado a palabras
    // españolas y un reemplazo a ciegas rompería un texto correcto.
    $mapa = [
        'não'      => 'no',
        'você'     => 'vos',
        'vocês'    => 'ustedes',
        'também'   => 'también',
        'então'    => 'entonces',
        'obrigado' => 'gracias',
        'obrigada' => 'gracias',
        'muito'    => 'muy',
        'agora'    => 'ahora',
        'preço'    => 'precio',
        'preços'   => 'precios',
        'são'      => 'son',
    ];

    foreach ($mapa as $pt => $es) {
        $texto = preg_replace_callback('/\b' . preg_quote($pt, '/') . '\b/ui', function ($m) use ($es) {
            $orig = $m[0];
            if (mb_strtoupper($orig) === $orig) return mb_strtoupper($es);
            if (mb_substr($orig, 0, 1) === mb_strtoupper(mb_substr($orig, 0, 1))) {
                return mb_strtoupper(mb_substr($es, 0, 1)) . mb_substr($es, 1);
            }
            return $es;
        }, $texto);
    }
    return $texto;
}

/**
 * Controles sobre lo que devolvió el modelo. Devuelve el texto limpio, o null
 * si falla algo importante (y entonces se usa el texto fijo del motor).
 */
function wabot_validar_redaccion($salida, $base, $cfg) {
    $s = trim($salida);
    if ($s === '') return null;

    // Comillas envolventes que a veces agrega el modelo.
    $s = trim($s, "\"“”");

    // Reglas de estilo duras: se limpian, no se rechazan.
    $s = preg_replace('/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2190}-\x{21FF}\x{2B00}-\x{2BFF}\x{FE0F}\x{2122}\x{2139}\x{3030}]/u', '', $s);
    $s = str_replace(['¿', '¡'], '', $s);
    $s = wabot_castellanizar($s);
    $s = preg_replace("/\n{3,}/", "\n\n", $s);
    $s = trim(preg_replace('/[ \t]+/', ' ', $s));
    if ($s === '') return null;

    // Largo razonable para WhatsApp: si se fue de mambo, mejor el texto fijo.
    if (mb_strlen($s) > 700) return null;

    // Dos artículos pegados: "iría un una página" salió así en producción. El
    // guard viejo solo miraba definido+indefinido y dejaba pasar un+una.
    if (preg_match('/\b(el|la|los|las|un|una|unos|unas) (un|una|unos|unas|el|la|los|las)\b/iu', $s)) return null;

    $regateo = '/\b(descuento|rebaja|bonificacion|bonificación|mitad de precio|precio especial|precio amigo|te lo dejo en|dejartelo en|dejártelo en|se lo dejo en|\d{1,2}\s?%\s?(de\s)?(desc|off|rebaja)|\d{1,2}\s?(por ciento|porciento)|\d{1,3}\s?(mil|lucas)\b)/iu';
    if (preg_match($regateo, $s) && !preg_match($regateo, $base)) return null;

    // El precio del mensaje base tiene que estar idéntico. La regex termina en
    // dígito a propósito: "un valor de $200.000." lleva el punto de la oración
    // pegado, y si se lo tragara exigiría un "$200.000." literal que el modelo
    // nunca escribe — toda redacción caería al texto fijo sin motivo.
    // El "$" es OPCIONAL a propósito: un monto parafraseado sin el signo
    // ("35.000 pesos" en vez de "$35.000") es la forma en que se coló un
    // precio corrompido del adicional bilingüe en producción (30.000 real
    // pasó a 35.000). Cualquier número con formato de miles (punto cada 3
    // dígitos) se valida igual, tenga o no el símbolo de pesos adelante.
    $preciosBase = [];
    if (preg_match_all('/\$?\s?\d{1,3}(?:\.\d{3})+(?!\d)/u', $base, $m)) {
        $preciosBase = array_unique($m[0]);
        foreach ($preciosBase as $precio) {
            if (mb_strpos($s, $precio) === false) return null;
        }
    }

    if (preg_match_all('/\$?\s?\d{1,3}(?:\.\d{3})+(?!\d)/u', $s, $ms)) {
        $normalizar = function ($p) { return preg_replace('/[^0-9]/', '', $p); };
        $base_norm = array_map($normalizar, $preciosBase);
        foreach (array_unique($ms[0]) as $enSalida) {
            if (!in_array($normalizar($enSalida), $base_norm, true)) return null;
        }
    }

    // Los links permitidos son SOLO los de la config.
    $permitidos = [];
    $linksPrecio = [];
    foreach (($cfg['tipos'] ?? []) as $t) {
        if (!empty($t['link'])) { $permitidos[] = $t['link']; $linksPrecio[] = $t['link']; }
    }
    foreach (($cfg['mantenimiento_planes'] ?? []) as $plan) {
        if (!empty($plan['link'])) $permitidos[] = $plan['link'];
    }

    // Si el base traía un link, tiene que estar igual (mayúsculas incluidas).
    foreach ($permitidos as $link) {
        if (mb_strpos($base, $link) !== false && mb_strpos($s, $link) === false) return null;
    }

    // Y no puede aparecer ningún link que el base no tuviera.
    if (preg_match_all('#\b[a-z0-9.-]+\.[a-z]{2,}(?:/[^\s]*)?#i', $s, $u)) {
        $normalizarLink = function ($l) {
            $l = preg_replace('#^https?://#i', '', trim($l));
            return rtrim($l, ".,;:!? \t");
        };
        foreach ($u[0] as $encontrado) {
            $enc = $normalizarLink($encontrado);
            $ok = false;
            foreach ($permitidos as $link) {
                if ($enc === $normalizarLink($link)) { $ok = true; break; }
            }
            if (!$ok && mb_strpos($base, $encontrado) === false) return null;   // link inventado
        }
    }

    // El link del presupuesto va en un renglón nuevo, siempre. Si el modelo lo
    // dejó todo en una línea, se corta en la oración que presenta el link: es
    // el formato del mensaje de precio y no depende de que la IA lo respete.
    foreach ($linksPrecio as $link) {
        $pos = mb_strpos($s, $link);
        if ($pos === false) continue;
        if (mb_strpos(mb_substr($s, 0, $pos), "\n") !== false) continue;
        $antes = mb_strrpos(mb_substr($s, 0, $pos), '. ');
        if ($antes !== false) {
            $s = mb_substr($s, 0, $antes + 1) . "\n" . ltrim(mb_substr($s, $antes + 2));
        }
    }

    return $s;
}
