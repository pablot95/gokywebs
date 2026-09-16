<?php
/**
 * wabot/redactor.php — el borde común por donde entra cada mensaje del cliente.
 *
 * Acá viven los cortes deterministas que valen en cualquier fase (la charla
 * dada de baja, el pedido de una persona, las dudas de pago con respuesta
 * fija, el post-demo, el formulario ya mandado…). Lo que no se resuelve acá
 * sigue al motor de reglas (wabot_engine), que clasifica el mensaje con Gemini
 * y contesta siempre con los textos fijos de textos.php. Todo lo que sale al
 * cliente pasa después por wabot_salida_preparar().
 */

require_once __DIR__ . '/engine.php';   // engine.php ya trae lib.php

function wabot_prospecto_acepta($texto, $conv) {
    if (empty($conv['precio_dado']) || !empty($conv['presentado_ts']) || !empty($conv['form_completado_ts'])) return false;
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 240) return false;
    if (preg_match('/\b(no|todavia no|lo voy a pensar|lo tengo que pensar|no me cierra|es caro|mas adelante)\b/u', $t)) return false;
    if (wabot_modalidad_elegida_en($texto) !== null && wabot_texto_rechaza_una_forma($texto) === null) return true;
    if (strpos((string)$texto, '?') !== false || strpos((string)$texto, '¿') !== false) return false;
    if (preg_match('/\b(me cierra|me sirve|estoy conforme|me parece bien|me interesa avanzar|quiero avanzar|queremos avanzar|quiero (hacerlo|arrancar|empezar)|quiero (la )?(demo|muestra)|quiero verla|armemos la (web|pagina|demo|muestra)|armala|armalo|hagamoslo|hagamosla|vamos a (hacerla|hacerlo|arrancar|empezar)|vamos adelante|arranquemos|empecemos|pasame el formulario|mandame el formulario|pasa el form)\b/u', $t)) return true;
    return !empty($conv['precio_cta_pendiente']) && (int)($conv['precio_turnos_desde'] ?? 0) === 1
        && (bool)preg_match('/^(si|si dale|dale|ok|okay|bueno|de una|perfecto|listo|vamos)$/u', $t);
}

function wabot_upgrade_aplicar(&$conv, $pendiente) {
    if (!is_array($pendiente) || empty($pendiente['tipo'])) return false;
    $conv['tipo'] = $pendiente['tipo'];
    $conv['precio_cotizado'] = $pendiente['precio'];
    $conv['sena_cotizada'] = $pendiente['sena'] ?? '';
    $conv['mensualidad_cotizada'] = $pendiente['mensualidad'];
    $conv['precio_modelo'] = $pendiente['modelo'];
    $conv['precio_cotizado_ts'] = time();
    $conv['pitch_tipo'] = $pendiente['tipo'];
    unset($conv['upgrade_pendiente'], $conv['pitch_para_que'], $conv['pitch_para_que_tipo']);
    wabot_evento_sesion($conv, 'upgrade_aceptado', ['tipo' => $conv['tipo']]);
    return true;
}

/** Devuelve la respuesta final para el cliente (lista de mensajes). */
function wabot_responder($texto, &$conv, $cfg) {
    /* Lo primero de todo: si este cliente ya venía hablando por el otro canal,
     * se trae lo que dejó allá ANTES de que nadie lea el estado. Si no, el
     * mismo cliente arranca de cero acá —le preguntan lo que ya contó y le
     * ofrecen el formulario que ya completó— que es lo que le pasó a Natalia
     * el 3-sep. Ver wabot_conv_adoptar_hermana(). */
    wabot_conv_adoptar_hermana($conv, $cfg);

    // El reset pertenece al borde común, antes de actualizar ultimo_ts.
    wabot_turno_preparar($conv, $cfg, time());

    // La cotización cerrada es el último mensaje automático. Desde acá sigue
    // una persona; también se respeta en llamadas directas fuera del webhook.
    if (!empty($conv['bot_off']) && ($conv['cierre'] ?? '') === 'cotizacion_final') return [];
    // Conversaciones que ya habían recibido el precio con la versión anterior
    // también se detienen acá: no continúan hacia modelos, formulario o demo.
    if (!empty($conv['precio_dado']) && !empty($conv['cta_muestra'])
        && empty($conv['lead_creado']) && empty($conv['form_completado_ts'])
        && empty($conv['presentado_ts'])
        && in_array(($conv['fase'] ?? ''), ['precio', 'prediseno', 'confirma_cambio'], true)) {
        wabot_cotizacion_finalizar($conv);
        return [];
    }

    // Transitoria de UN turno (ver wabot_postdemo_responder): si un corte de
    // más abajo terminó el turno anterior sin consumirla, no puede aparecer
    // adelante de la respuesta de hoy.
    unset($conv['_postdemo_prefijo']);

    /* Con la demo ya entregada, ESTE mensaje es la respuesta del cliente: se
     * marca acá, antes de cualquier corte, porque de ese flag dependen la
     * plantilla de las 48 h, el archivado y la columna del panel. Va después
     * del reset de sesión (si la charla era vieja, presentado_ts ya quedó en
     * cero y no hay nada que marcar). Ver wabot_presentado_marcar_respuesta(). */
    wabot_presentado_marcar_respuesta($conv);

    if (!empty($conv['esProspecto']) && !empty($conv['link_form_enviado'])) return [];

    if (!empty($conv['demo_texto_pendiente'])) {
        $conv['demo_texto_pendiente'] = false;
        return wabot_muestra_presentar_textos((string)($conv['presentado_slug'] ?? ''), $cfg, $conv);
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

    // El pedido de una persona precede a cualquier aceptación de demo:
    // "me gustaría hablar por acá con un asesor" no autoriza el formulario.
    if (!in_array(($conv['fase'] ?? ''), ['derivado', 'postdemo'], true)
        && wabot_handoff_causa_explicita($texto) === 'pide_humano'
        && !wabot_pide_llamada($texto)) {
        return wabot_derivar($conv, $cfg, 'pide_humano');
    }

    // AUD11A05: preguntar cuánto pagar PARA VER la demo no debe recibir el
    // primer pago del desarrollo. Vale en todos los modos, antes del modelo.
    if (empty($conv['presentado_ts']) && wabot_texto_pregunta_pago_demo($texto)) {
        wabot_evento_sesion($conv, 'pago_demo_aclarado');
        return [(string)$cfg['pago_antes_o_despues']];
    }

    /* Dudas de pago con respuesta fija (batería del 15-sep), en todos los modos
     * y antes del modelo: montos confundidos, lo que queda para pagar después,
     * la devolución de la seña, pasarse de una forma a la otra y cuál de las
     * dos conviene. Cada una se llevaba otra respuesta. Ver engine.php. */
    // Con una alternativa recién cotizada, primero se resuelve a qué precio
    // apunta la pregunta. Usar acá el tipo anterior mezclaba las modalidades.
    if (empty($conv['upgrade_pendiente'])) {
        $pagoFijo = wabot_respuesta_pago_fija($texto, $conv, $cfg);
        if ($pagoFijo !== null) {
            if (!empty($conv['precio_dado'])) {
                $conv['precio_turnos_desde'] = (int)($conv['precio_turnos_desde'] ?? 0) + 1;
                $conv['precio_cta_pendiente'] = false;
            }
            return $pagoFijo;
        }
    }

    /* Primero se contestan las dudas de pago; después se evalúa si eligió.
     * Así "si elijo el pago único, ¿cuánto pongo?" no se toma como cierre. */
    wabot_modalidad_anotar($texto, $conv, $cfg);
    if (!empty($conv['precio_dado'])) {
        $conv['precio_turnos_desde'] = (int)($conv['precio_turnos_desde'] ?? 0) + 1;
        if (wabot_prospecto_acepta($texto, $conv)) {
            if (is_array($conv['upgrade_pendiente'] ?? null)) wabot_upgrade_aplicar($conv, $conv['upgrade_pendiente']);
            $conv['esProspecto'] = true;
            $conv['link_form_enviado'] = true;
            $conv['precio_cta_pendiente'] = false;
            $conv['seguimiento_bloqueado'] = true;
            wabot_handoff_marcar($conv, 'prospecto');
            wabot_prospecto_sincronizar($conv);
            $conv['bot_off'] = true;
            wabot_evento_sesion($conv, 'prospecto_form_enviado');
            return ['gokywebs.com/form'];
        }
        if ((int)$conv['precio_turnos_desde'] >= 1) $conv['precio_cta_pendiente'] = false;
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
            wabot_cambios_anotar($conv, $texto, 'postdemo_silencio');
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

    /* La consulta no cambia el tipo contratado. Conservamos la alternativa
     * cotizada y la aplicamos recién cuando acepta, antes de mandar el form. */
    $pendiente = $conv['upgrade_pendiente'] ?? null;
    if (is_array($pendiente) && !empty($conv['precio_dado']) && empty($conv['presentado_ts'])
        && empty($conv['lead_creado']) && isset($cfg['tipos'][$pendiente['tipo'] ?? ''])) {
        $normal = wabot_normalizar_frase($texto);
        if (preg_match('/\b(prefiero|me quedo con|quiero|mejor)\b.{0,20}\b(sitio profesional|sin tienda|solo servicios|web anterior)\b/u', $normal)) {
            unset($conv['upgrade_pendiente']);
        } elseif (!wabot_mensaje_pregunta_algo($texto) && wabot_acepta_demo($texto)
            && !preg_match('/\b(inmobiliaria|sistema de gestion)\b/u', $normal)
            && (!preg_match('/\bcursos\b/u', $normal) || $pendiente['tipo'] === 'elearning')) {
            wabot_upgrade_aplicar($conv, $pendiente);
            return [wabot_prediseno_texto($conv, $cfg)];
        } elseif (wabot_mensaje_pregunta_algo($texto)
            && preg_match('/\b(sena|senia|anticipo|adelanto|para arrancar|pago inicial|como (se )?(paga|abona)|formas? de pago|cuotas?)\b/u', $normal)
            && (preg_match('/\b(entonces|seria|serian|la tienda|con (la )?tienda|con (el )?carrito|asi)\b/u', $normal)
                || wabot_ultimo_bot_es_upgrade($conv))) {
            /* "Y la seña cuánto sería entonces?" después de la tienda (Q01,
             * 15-sep): se llevaba otra vez el texto del upgrade. Se contesta
             * con los montos de la tienda, no con los del sitio cotizado. */
            return [wabot_upgrade_pago_texto($pendiente, $conv, $cfg)];
        } elseif (wabot_mensaje_pregunta_algo($texto)
            && preg_match('/\b(entonces|total|dos planes|juntos|serian|suman|sumar|adicional|mas)\b/u', $normal)
            && preg_match('/\b(pago|planes|por mes|precio|cuanto|mil)\b|\$/u', $normal)) {
            // "No es un adicional" contesta justo esto: si se suman los dos.
            return [wabot_upgrade_texto($pendiente['tipo'], $conv, $cfg)];
        } elseif (wabot_texto_pide_precio($texto)) {
            return [wabot_upgrade_texto($pendiente['tipo'], $conv, $cfg)];
        }
        // Las dudas de pago posteriores corresponden a la última alternativa,
        // sin confirmar el cambio ni sobrescribir la cotización anterior.
        if (isset($conv['upgrade_pendiente'])
            && !preg_match('/\b(sitio profesional|precio anterior|sin tienda|sin cursos)\b/u', $normal)) {
            $consulta = $conv;
            $consulta['tipo'] = $pendiente['tipo'];
            foreach (['precio' => 'precio_cotizado', 'sena' => 'sena_cotizada',
                      'mensualidad' => 'mensualidad_cotizada', 'modelo' => 'precio_modelo'] as $origen => $campo) {
                $consulta[$campo] = $pendiente[$origen] ?? '';
            }
            $pagoAlternativa = wabot_respuesta_pago_fija($texto, $consulta, $cfg);
            if ($pagoAlternativa !== null) {
                if (!empty($consulta['handoff_pendiente'])) $conv['handoff_pendiente'] = true;
                return $pagoAlternativa;
            }
        }
    }

    if (!empty($pendiente)) {
        $pagoFijo = wabot_respuesta_pago_fija($texto, $conv, $cfg);
        if ($pagoFijo !== null) return $pagoFijo;
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
                /* La misma consulta otra vez ("y si agrego una tienda para
                 * vender libros?", O08, 15-sep): el texto idéntico lo callaba
                 * el anti-repetición y el cliente se quedaba sin respuesta. */
                $yaConsultado = is_array($conv['upgrade_pendiente'] ?? null)
                    && ($conv['upgrade_pendiente']['tipo'] ?? '') === $destino;
                if (empty($conv['presentado_ts']) && empty($conv['lead_creado'])
                    && ($conv['upgrade_pendiente']['tipo'] ?? '') !== $destino) {
                    $conv['upgrade_pendiente'] = wabot_precio_vigente(null, $cfg, $destino);
                }
                wabot_evento_sesion($conv, 'upgrade_consultado', ['de' => (string)$conv['tipo'], 'a' => $destino]);
                return [$yaConsultado ? wabot_upgrade_confirmacion_texto($conv['upgrade_pendiente'], $conv, $cfg) : $upgrade];
            }
        }
    }

    // El listado de datos se pide UNA vez. Después, a un "ok" / "listo
    // gracias" / "si" se le contesta una sola línea corta y, si sigue
    // acusando recibo, silencio: repetirle tres veces "cuando los tengas me
    // avisás" es lo que hizo el bot con una clienta de cosméticos el 27-ago.
    if (wabot_prediseno_acuse($texto, $conv)) {
        if (!empty($conv['prediseno_acuse_respondido'])) return [];
        $conv['prediseno_acuse_respondido'] = true;
        // Con el link del formulario ya mandado, "cuando los tengas mandámelos
        // por acá" contradice al link: el acuse remite al formulario.
        if (!empty($conv['link_form_enviado']) && trim((string)($cfg['prediseno_espera'] ?? '')) !== '') {
            return [(string)$cfg['prediseno_espera']];
        }
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
        $plataforma = wabot_objecion_texto('plataforma', (string)$cfg['plataformas'], $conv, $cfg);
        /* "¿Me pueden hacer una página en Wix para mi negocio de tortas?"
         * recibía el "no trabajamos en Wix" y nada más: la charla quedaba sin
         * próximo paso (V06, batería del 10-sep). Sin precio dado, se le
         * pregunta el rubro en el mismo turno. */
        if (!empty($conv['precio_dado'])) return [$plataforma];
        return [$plataforma, (string)$cfg['contame']];
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

    /* Con el link del formulario ya mandado: el "sí" repetido, los datos por
     * chat y el "ya lo completé" se contestan acá, sin modelo (V07 y V08 de la
     * batería del 10-sep). Va después de la lista posicional, que es la que
     * anota "Malena - IndumentariaMale - negro y dorado". */
    $conFormulario = wabot_form_enviado_responder($texto, $conv, $cfg);
    if ($conFormulario !== null) return $conFormulario;

    /* "Está todo en lo que te mandé". El cliente sostiene que ya pasó los
     * datos y el bot se los sigue pidiendo por partes (Clínica de Mar,
     * 27-ago). Si después de releer lo que hay todavía faltan, el bot ya
     * demostró que no los puede sacar solo: insistir es la fricción que
     * costó esa charla. Lo toma Pablo con todo lo que el cliente escribió,
     * que es lo único que no pierde la venta. Solo en el chat sin link: con
     * el formulario mandado, "ya está todo arriba" quiere decir que lo llenó
     * y lo contesta wabot_form_enviado_responder() mirando si llegó. */
    if (in_array(($conv['fase'] ?? ''), ['prediseno', 'prediseno_ref'], true)
        && empty($conv['link_form_enviado'])
        && wabot_apunta_a_lo_ya_dicho($texto)
        && wabot_prediseno_faltan($conv, false)) {
        wabot_evento_sesion($conv, 'prediseno_datos_no_extraibles');
        return wabot_derivar($conv, $cfg, 'datos_ya_dados');
    }

    return wabot_engine($texto, $conv, $cfg);
}
