<?php
/**
 * wabot/engine.php — máquina de estados del bot (flujo v8).
 * Recibe la conversación + el texto del cliente y devuelve las respuestas.
 * Los textos SIEMPRE salen de bot-config.json: Gemini solo etiqueta intenciones,
 * nunca redacta lo que ve el cliente.
 */

require_once __DIR__ . '/lib.php';

/**
 * Prepara una sesión antes de que cualquier modo toque ultimo_ts.
 *
 * La implementación canónica vive en lib.php porque también la usan el panel y
 * los procesos auxiliares. Este respaldo mantiene el motor autocontenido durante
 * despliegues donde engine.php llegue unos segundos antes que lib.php.
 */
function wabot_turno_preparar(&$conv, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();

    if (function_exists('wabot_conv_reset_si_vieja')) {
        wabot_conv_reset_si_vieja($conv, $cfg, $ahora);
    } else {
        $resetDias = (int)($cfg['reset_dias'] ?? 7);
        $vieja = (int)($conv['ultimo_ts'] ?? 0) > 0
              && ($ahora - (int)$conv['ultimo_ts']) > $resetDias * 86400
              && ($conv['fase'] ?? 'nuevo') !== 'nuevo';
        if ($vieja) {
            foreach (['tipo','descripcion','brief','colores','colores_hex','referencia','cierre',
                      'ultimo_bot','sistema_problema','sistema_actual','sistema_usuarios','productos_cantidad'] as $k) {
                $conv[$k] = null;
            }
            foreach (['referencia_preguntada','cta_muestra','seguimiento_enviado','espera_avisada',
                      'no_texto_avisado','lead_creado','handoff_pendiente','nombre_usado',
                      'aclaracion_pendiente','sistema_lead_creado','precio_dado',
                      'seguimiento_bloqueado'] as $k) {
                $conv[$k] = false;
            }
            $conv['aclaraciones_fallidas'] = 0;
            $conv['aclaracion_ultimo_hash'] = null;
            $conv['objecion_dicha'] = [];
            $conv['archivado'] = false;
            $conv['fase'] = 'nuevo';
            $conv['session_started_ts'] = $ahora;
            $conv['session_id'] = bin2hex(random_bytes(6));
        }
    }

    if (empty($conv['session_started_ts'])) $conv['session_started_ts'] = $ahora;
    if (empty($conv['session_id'])) $conv['session_id'] = bin2hex(random_bytes(6));
    // Compatibilidad con conversaciones iniciadas antes de que cta_muestra se
    // persistiera al cotizar: el transcript sigue siendo la fuente de verdad.
    if (empty($conv['cta_muestra']) && wabot_cta_muestra_ya_ofrecida($conv)) {
        $conv['cta_muestra'] = true;
    }
    $conv['ultimo_ts'] = $ahora;
}

/**
 * Emite cada hito comercial una sola vez por sesión. Durante una ejecución del
 * agente los eventos quedan en la copia transaccional y recién se escriben si
 * la respuesta completa se confirma.
 */
function wabot_evento_sesion(&$conv, $evento, $datos = []) {
    if (empty($conv['session_id'])) {
        $conv['session_id'] = function_exists('wabot_session_id_nuevo')
            ? wabot_session_id_nuevo(wabot_conversation_key($conv), time())
            : bin2hex(random_bytes(6));
    }
    if (empty($conv['session_started_ts'])) $conv['session_started_ts'] = time();

    $sesion = (string)$conv['session_id'];
    $emitidos = (array)($conv['eventos_emitidos_sesion'] ?? []);
    if (($emitidos[$evento] ?? null) === $sesion) return false;
    $conv['eventos_emitidos_sesion'][$evento] = $sesion;

    if (!empty($conv['_eventos_diferir'])) {
        $conv['_eventos_pendientes'][] = ['evento' => $evento, 'datos' => (array)$datos];
        return true;
    }
    return function_exists('wabot_evento') ? wabot_evento($conv, $evento, $datos) : false;
}

/** Confirma los eventos que una ejecución transaccional dejó en espera. */
function wabot_eventos_confirmar(&$conv) {
    $pendientes = (array)($conv['_eventos_pendientes'] ?? []);
    unset($conv['_eventos_diferir'], $conv['_eventos_pendientes']);
    if (!function_exists('wabot_evento')) return;
    foreach ($pendientes as $p) {
        wabot_evento($conv, (string)($p['evento'] ?? ''), (array)($p['datos'] ?? []));
    }
}

/** Último texto del cliente dentro del transcript persistido. */
function wabot_ultimo_texto_cliente($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $t) {
        if (($t['q'] ?? '') === 'cliente') return trim((string)($t['t'] ?? ''));
    }
    return '';
}

/**
 * Hechos textuales de la sesión actual. El historial corto del modelo sirve para
 * conversar, pero no puede ser la única memoria: al caer una llamada de IA el
 * fallback también necesita saber qué vende el cliente y qué objetivo describió.
 */
function wabot_contexto_cliente_sesion($conv, $max = 18) {
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $hechos = [];
    foreach ((array)($conv['transcript'] ?? []) as $t) {
        if (($t['q'] ?? '') !== 'cliente') continue;
        if ($inicio > 0 && (int)($t['ts'] ?? 0) < $inicio) continue;
        $texto = trim(preg_replace('/\s+/u', ' ', (string)($t['t'] ?? '')));
        if ($texto === '') continue;
        $hechos[] = mb_substr($texto, 0, 260);
    }
    return array_slice($hechos, -max(1, (int)$max));
}

function wabot_contexto_cliente_texto($conv, $max = 18) {
    return trim(implode(' ', wabot_contexto_cliente_sesion($conv, $max)));
}

/** Reconstruye el CTA usado en chats viejos mirando solo lo dicho por el bot. */
function wabot_cta_muestra_ya_ofrecida($conv) {
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $linea) {
        if (($linea['q'] ?? '') !== 'bot') continue;
        if ($inicio > 0 && (int)($linea['ts'] ?? 0) < $inicio) continue;
        $t = wabot_normalizar_frase((string)($linea['t'] ?? ''));
        if (!preg_match('/\b(demo|muestra|prediseno)\b/u', $t)) continue;
        if (preg_match('/\b(gratis|sin cargo|sin costo|sin compromiso|armamos|armarte|preparamos|prepararte|queres que)\b/u', $t)) {
            return true;
        }
    }
    return false;
}

/** Hay información comercial real; no corresponde volver a preguntar "qué vendés". */
function wabot_contexto_cliente_tiene_negocio($conv) {
    $t = wabot_normalizar_frase(wabot_contexto_cliente_texto($conv));
    if ($t === '') return false;
    if (wabot_fallback_rubro_local($t) !== null) return true;
    return (bool)preg_match('/\b(vendo|vendemos|hago|hacemos|ofrezco|ofrecemos|me dedico|nos dedicamos|tengo un|tengo una|negocio|empresa|emprendimiento|local|marca|servicio|productos?|rutinas?|entrenamiento|zapatillas?|cortinas?|toldos?)\b/u', $t);
}

/** Rubros que pueden ser portfolio, catálogo o venta online: requieren una pregunta. */
function wabot_contexto_es_hibrido($texto) {
    $t = wabot_normalizar_frase($texto);
    return $t !== '' && (bool)preg_match('/\b(cortinas?|toldos?|aberturas?|muebles? a medida|carpinteria|herrerias?|cerramientos?|amoblamientos?|mesadas?|mamparas?)\b/u', $t);
}

/**
 * Señales de salida comercial. Se separan de "lo voy a pensar": cuando alguien
 * dice que solo averiguaba, que será más adelante o que hoy no tiene presupuesto,
 * se cierra bien y se bloquea el seguimiento automático.
 */
function wabot_cierre_sin_presion_tipo($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return null;

    if (preg_match('/\b(no me escriban|no me escribas|dejen de escribir|dejenme de escribir|no quiero recibir mas|no me manden mas|borrame|borren mi numero|eliminame|eliminen mi|darme de baja|dar de baja|desuscribir|desuscribirme|bloquear|bloqueame|no me contacten|no me molesten mas)\b/u', $t)) {
        return 'baja';
    }

    if (preg_match('/\b(no me interesa vender|no me interesa cobrar|no me interesa el carrito|no me interesa la tienda)\b/u', $t)) {
        return null;
    }
    if (preg_match('/\b(no me interesa|no estoy interesado|no estoy interesada|dejalo ahi)\b/u', $t)
        || preg_match('/\bgracias pero no(?: gracias)?$/u', $t)) {
        return 'rechazo';
    }

    if (preg_match('/\b(quiero|quisiera|necesito|cotiza|cotizame|pasame|pasas|decime|mandame|cuanto (sale|cuesta|esta|vale)|que precio|me interesa)\b/u', $t)
        || preg_match('/\b(recibir consultas|reciban consultas|me consulten|solo mostrar|mostrar los|mostrar mis|catalogo|whatsapp)\b/u', $t)) {
        return null;
    }

    if (preg_match('/\b(estoy|estaba|ando|andaba|estamos)\b.{0,20}\b(averiguando|consultando|preguntando|viendo|mirando|chusmeando|cotizando)\b/u', $t)
        || preg_match('/\b(solo|solamente|unicamente|por ahora|por el momento)\b.{0,25}\b(averiguo|averiguando|consultando|preguntando|viendo|mirando)\b/u', $t)
        || preg_match('/\b(mas adelante|en otro momento|cuando pueda|cuando tenga)\b.{0,45}\b(escrib|contact|comunic|retom|veo|vemos|avanzo|avanzamos)\w*/u', $t)
        || preg_match('/\b(no tengo|no cuento con)\b.{0,20}\b(plata|dinero|fondos)\b/u', $t)
        || preg_match('/\bno tengo presupuesto\b(?!.{0,25}\b(pasame|mandame|todavia el|aun el)\b)/u', $t)
        || preg_match('/\bno puedo\b.{0,20}\b(pagar|afrontar)\b/u', $t)
        || preg_match('/\b(ahora|hoy|por ahora|por el momento)\b.{0,25}\b(no tengo|no cuento con|no puedo)\b.{0,25}\b(plata|dinero|presupuesto|fondos|pagar)\b/u', $t)
        || preg_match('/\b(no tengo|no cuento con|no puedo)\b.{0,25}\b(plata|dinero|presupuesto|fondos|pagar)\b.{0,25}\b(ahora|hoy|por ahora|por el momento)\b/u', $t)) {
        return 'consulta';
    }
    return null;
}

function wabot_es_regateo($texto) {
    $t = mb_strtolower(trim((string)$texto));
    $t = strtr($t, ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ü'=>'u', 'ñ'=>'n']);
    $t = trim(preg_replace('/\s+/u', ' ', preg_replace('/[^\p{L}\p{N}\s%]/u', ' ', $t)));
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(me lo dejas en|me lo dejarias en|dejamelo en|dejalo en|te doy|te pago|lo cierro en|cerramos en)\b.{0,15}\d/u', $t)
        || preg_match('/\b(descuento|rebaja|una rebajita|mitad de precio|precio especial|mejor precio|hacer precio|haces precio|me haces precio)\b/u', $t)
        || preg_match('/\d{1,2}\s?(%|por ciento|porciento)/u', $t)
        || preg_match('/\bno hay forma de que\b.{0,30}\b(baje|bajes|menos|barato|deje|dejes)\b/u', $t)
        || preg_match('/\b(ahi|asi)\s+si\s+baja\b|\bbaja(s)?\s+(el\s+precio|algo|un\s+poco)\b|\bme\s+baja(s)?\s+(el\s+precio|algo)\b|\bhace(n|s)?\s+bajar\b/u', $t)
    );
}

function wabot_regateo_responder($texto, &$conv, $cfg) {
    if (!wabot_es_regateo($texto)) return null;
    if (empty($conv['precio_dado'])) return null;
    $dichas = (array)($conv['objecion_dicha'] ?? []);
    if (empty($dichas['caro']) && !in_array('caro', $dichas, true)) {
        return [wabot_objecion_texto('caro', $cfg['caro'], $conv, $cfg)];
    }
    return wabot_derivar($conv, $cfg, 'pago_explicito');
}

function wabot_cerrar_sin_presion(&$conv, $cfg, $tipo = 'consulta') {
    $conv['seguimiento_bloqueado'] = true;
    $conv['seguimiento_estado'] = 'bloqueado';
    $conv['cta_muestra'] = true;
    $conv['cierre'] = $tipo === 'rechazo' ? 'sin_interes'
                    : ($tipo === 'baja' ? 'baja' : 'consulta_sin_presion');
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'consulta_cerrada', ['causa' => $tipo]);
    if ($tipo === 'baja') {
        $conv['bot_off'] = true;
        return [(string)($cfg['baja'] ?? 'Listo, no te escribimos más. Gracias por avisar.')];
    }
    $texto = $tipo === 'rechazo'
        ? (string)($cfg['no_interesa'] ?? 'Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.')
        : (string)($cfg['cierre_suave'] ?? 'Gracias por consultar. Cuando sea el momento, escribinos y retomamos desde acá.');
    return [$texto . wabot_cierre_con_memoria($conv, $cfg)];
}

/**
 * El que se va sabiendo que no tiene que explicar todo de nuevo vuelve más
 * fácil. Solo se agrega si de verdad hay algo guardado — decirlo sin tener el
 * tipo cotizado sería una promesa vacía.
 */
function wabot_cierre_con_memoria($conv, $cfg) {
    if (empty($conv['precio_dado']) || trim((string)($conv['tipo'] ?? '')) === '') return '';
    $label = wabot_tipo_label((string)$conv['tipo'], $cfg);
    if (trim($label) === '') return '';
    $plantilla = (string)($cfg['cierre_memoria'] ?? '');
    if (trim($plantilla) === '') return '';
    return ' ' . str_replace('{tipo}', mb_strtolower($label), $plantilla);
}

/**
 * ¿Es un acuse de recibo y nada más? "Ok", "gracias", "dale", "igualmente", 👍.
 *
 * Con la charla ya cerrada, esto NO merece respuesta: el cliente está cerrando
 * educadamente, no preguntando. Contestarle encadena dos y tres despedidas
 * seguidas —"te mandamos la demo" / "en cuanto esté lista" / "quedamos a la
 * espera"— que es exactamente lo que delata a un bot. Pasó con Refrigcar y con
 * Black Automotores el 22-ago.
 */
function wabot_es_acuse($texto) {
    // Misma trampa que en wabot_info_por_palabras: borrar la puntuación en vez
    // de cambiarla por espacio pega las palabras. "Bueno,.aguardo entonces"
    // quedaba como "buenoaguardo entonces" y no lo reconocía nadie.
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', (string)$texto));
    if ($t === '') return true;                  // solo un emoji o un sticker
    if (mb_strlen($t) > 40) return false;
    $acuses = ['ok', 'oka', 'okey', 'okay', 'okis', 'dale', 'listo', 'perfecto', 'perfe',
               'genial', 'buenisimo', 'barbaro', 'joya', 'excelente', 'gracias',
               'muchas gracias', 'mil gracias', 'gracias igualmente', 'igualmente',
               'igual mente', 'saludos', 'un saludo', 'abrazo', 'un abrazo', 'chau',
               'nos vemos', 'hasta luego', 'buen dia', 'buenas noches', 'buenas tardes',
               'de nada', 'no hay problema', 'sin problema', 'esta bien', 'ta bien',
               'copado', 'buenardo', 'de diez', 'va bien', 'me parece bien', 'entendido',
               'recibido', 'ya esta', 'bien', 'bueno',
               // "Bueno, aguardo entonces" no es una duda: es esperar. El bot lo
               // leía como consulta pendiente y contestaba el comodín de derivar.
               'aguardo', 'aguardo entonces', 'espero', 'espero entonces', 'ahi espero',
               'quedo atento', 'quedo atenta', 'quedo a la espera', 'quedamos en contacto',
               'quedo esperando', 'aguardo respuesta', 'espero respuesta', 'a la espera'];
    // Se sacan los conectores para que "ok gracias" o "dale, muchas gracias"
    // entren igual que sus partes sueltas.
    $limpio = trim(preg_replace('/\b(ok|dale|listo|y|pues|bueno|muy|todo|muchas|mil|un|una|te|le|les|lo|la|ah|ha|aja|ahh|oh)\b/u', ' ', $t));
    $limpio = trim(preg_replace('/\s+/u', ' ', $limpio));
    return in_array($t, $acuses, true) || ($limpio !== '' && in_array($limpio, $acuses, true)) || $limpio === '';
}

/**
 * ¿Pidió la demo explícitamente? El CTA del anuncio dice "Quiero mi demo
 * gratis": volver a preguntarle "¿querés que la preparemos?" a quien entró
 * diciendo eso es no haberlo escuchado (caso Antuz, 21-ago).
 */
function wabot_pidio_demo_explicita($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match(
        '/\b(quiero (mi|la|una) (demo|muestra)|(demo|muestra) gratis (para|de) mi|quiero ver (mi|la|una) (demo|muestra)'
        . '|me interesa (la|esa) (demo|muestra)|armame (la|una) (demo|muestra)|haganme (la|una) (demo|muestra)|quiero (la|esa) (demo|muestra))\b/u', $t);
}

/**
 * Qué texto usar para el desempate de turnos. A un complejo de cabañas no se
 * le pregunta por "sacar el turno eligiendo día y horario": el rubro habla de
 * reservas, fechas y disponibilidad (caso Recanto del Paraná, 21-ago).
 */
function wabot_clave_desempate_turnos($contexto, $cfg) {
    $t = wabot_normalizar_frase($contexto);
    $esAlojamiento = (bool)preg_match(
        '/\b(cabana\w*|hotel\w*|hosteria\w*|hostal\w*|hostel\w*|posada\w*|complejo\w*|glamping|camping'
        . '|alquiler\w* temporar\w*|apart\b|apart hotel|casa de campo|quinta\w*|estadia\w*|huespedes)\b/u', $t);
    return $esAlojamiento && trim((string)($cfg['desempate_turnos_alojamiento'] ?? '')) !== ''
        ? 'desempate_turnos_alojamiento'
        : 'desempate_turnos';
}

/**
 * ¿Prometió avisar él? "Lo veo con mi socia y te aviso" es el cliente tomando
 * el control de los tiempos: perseguirlo ese mismo día quema la venta (casos
 * Oscar y "veo el enlace con mi socia", 21-ago).
 */
function wabot_dijo_te_aviso($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match(
        '/\b(y te aviso|te aviso y|yo te aviso|les aviso|y te digo|y les digo|y te cuento|y te confirmo'
        . '|lo consulto|lo consultamos|tengo que consultarlo|lo tengo que (hablar|consultar|charlar|ver)'
        . '|dejame hablarlo|dejame consultarlo|dejame verlo|dejame pensarlo'
        . '|lo (veo|hablo|charlo|converso|evaluo) con (mi|mis|la|el)'
        . '|con mi socc?ia?o?\b|con mis socios|con mi pareja|con mi marido|con mi mujer|con mi familia)/u',
        ' ' . $t . ' '
    );
}

/**
 * ¿Es solo una lista de colores? "Rosa, amarillo, beige" contestado a la
 * pregunta de la referencia sigue hablando de colores, no de una web que le
 * gustó (caso Julieta, 21-ago).
 */
function wabot_parece_lista_colores($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    $colores = ['rojo', 'roja', 'rosa', 'rosado', 'rosados', 'amarillo', 'amarilla', 'azul', 'azules', 'celeste',
                'verde', 'verdes', 'violeta', 'lila', 'morado', 'purpura', 'naranja', 'beige', 'beis', 'crema',
                'blanco', 'blanca', 'negro', 'negra', 'gris', 'grises', 'marron', 'bordo', 'dorado', 'dorados',
                'plateado', 'turquesa', 'fucsia', 'coral', 'ocre', 'mostaza', 'terracota', 'nude', 'cobre', 'salmon'];
    $conectores = ['y', 'o', 'con', 'el', 'la', 'los', 'las', 'un', 'una', 'algo', 'de', 'en',
                   'claro', 'clara', 'claros', 'oscuro', 'oscura', 'oscuros', 'tonos', 'tono',
                   'pasteles', 'pastel', 'calidos', 'calido', 'frios', 'suaves', 'colores', 'color'];
    // "Colores cálidos" o "tonos pasteles" también hablan de paleta aunque no
    // nombren ningún color concreto.
    $familias = ['pastel', 'pasteles', 'calidos', 'calidas', 'frios', 'frias', 'neutros', 'neutrales', 'vivos', 'tierra'];
    $hayColor = false;
    foreach (preg_split('/\s+/u', $t) as $palabra) {
        if (in_array($palabra, $colores, true) || in_array($palabra, $familias, true)) { $hayColor = true; continue; }
        if (!in_array($palabra, $conectores, true)) return false;
    }
    return $hayColor;
}

/** Un mensaje nuevo y explícitamente comprador vuelve a habilitar el seguimiento. */
function wabot_reabre_consulta($texto) {
    $t = wabot_normalizar_frase($texto);
    return $t !== '' && (bool)preg_match('/\b(ahora si|quiero retomar|quiero avanzar|quiero contratar|quiero arrancar|mandame el cbu|como te pago)\b/u', $t);
}

/**
 * Las únicas causas que habilitan un handoff inmediato. Se valida el texto real,
 * no el motivo inventado por el modelo ni una etiqueta aislada del clasificador.
 */
function wabot_handoff_causa_explicita($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return null;

    if (preg_match('/\b(quiero|queria|quisiera|necesito|puedo|podria|podrias|podes|quiero que me)\b.{0,35}\b(hablar|comunicar|atender|llamar|pasar)\b.{0,35}\b(persona|humano|asesor|alguien|pablo|vendedor)\b/u', $t)
        || preg_match('/\b(pasame|derivame|comunicate)\b.{0,25}\b(persona|humano|asesor|alguien|pablo)\b/u', $t)
        || preg_match('/\bme\s+(pasas|derivas|comunicas)\b.{0,25}\b(persona|humano|asesor|alguien|pablo)\b/u', $t)
        || preg_match('/\b(hablar|comunicarme|contactarme)\s+con\s+(una\s+)?(persona|humano|asesor|alguien|pablo|vendedor)\b/u', $t)
        || preg_match('/\bque\s+me\s+(atienda|llame|contacte|escriba)\s+(pablo|una persona|alguien|un asesor)\b/u', $t)) {
        return 'pide_humano';
    }

    if (preg_match('/\b(mandame|pasame|decime)\b.{0,35}\b(cbu|alias|datos de transferencia|datos para transferir)\b/u', $t)
        || preg_match('/\b(quiero|listo para|vamos a|deseo)\b.{0,25}\b(pagar|contratar|avanzar|arrancar|senar|sena)\b/u', $t)
        || preg_match('/\b(como|donde)\s+(?:(te|les)\s+)?(pago|transfiero|deposito)\b/u', $t)) {
        return 'pago_explicito';
    }

    $cursos = preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases online)\b/u', $t)
           || preg_match('/\b(doy|dicto|damos|dictamos|dando|dictando)\b.{0,15}\btaller(es)?\b/u', $t)
           || preg_match('/\btaller(es)?\s+(online|virtual(es)?|de capacitacion)\b/u', $t);
    $productos = preg_match('/\b(vendo|vendemos|productos|tienda|local|ropa|mates?|velas|articulos|mercaderia)\b/u', $t);
    if ($cursos && $productos) return 'productos_y_cursos';

    return null;
}

/**
 * Un turno = un mensaje del cliente. Dentro de un mismo turno el agente puede
 * llamar varias herramientas (dos derivar seguidos) y eso no cuenta como dos
 * respuestas del cliente; pero un mensaje nuevo, aunque diga LO MISMO que el
 * anterior, sí es otro turno. El contador de ambigüedad se apoya en esto.
 */
function wabot_turno_marcar(&$conv) {
    $conv['_turno_id'] = uniqid('t', true);
}

/** Una pregunta entendida vuelve a dejar en cero el contador de ambigüedad. */
function wabot_handoff_aclaracion_resuelta(&$conv) {
    $conv['aclaraciones_fallidas'] = 0;
    $conv['aclaracion_pendiente'] = false;
    $conv['aclaracion_ultimo_hash'] = null;
}

/**
 * Registra respuestas distintas a una aclaración pendiente. La primera llamada
 * abre la aclaración; hacen falta DOS respuestas posteriores todavía ambiguas
 * para permitir que Pablo tome la charla.
 */
function wabot_handoff_ambiguedad(&$conv, $texto) {
    $normal = wabot_normalizar_frase($texto);
    $hash = sha1($normal !== '' ? $normal : (string)$texto);

    $turno = (string)($conv['_turno_id'] ?? '');

    if (empty($conv['aclaracion_pendiente'])) {
        $conv['aclaracion_pendiente'] = true;
        $conv['aclaraciones_fallidas'] = 0;
        $conv['aclaracion_ultimo_hash'] = $hash;
        $conv['aclaracion_ultimo_turno'] = $turno;   // el turno que abrió la aclaración ya está contado
        return null;
    }

    // Repetir la misma respuesta cuenta igual que dar una distinta: si el
    // cliente escribe "Vender" tres veces, la tercera NO puede recibir la
    // misma pregunta otra vez. Con el hash como filtro, el contador se
    // clavaba en cero y el bot repreguntaba para siempre. Pasó en producción.
    // La única repetición que no cuenta es la del mismo turno (dos
    // functionCall en una vuelta), que se detecta por el marcador de turno.
    if (($conv['aclaracion_ultimo_turno'] ?? '') !== $turno || $turno === '') {
        $conv['aclaraciones_fallidas'] = (int)($conv['aclaraciones_fallidas'] ?? 0) + 1;
        $conv['aclaracion_ultimo_hash'] = $hash;
        $conv['aclaracion_ultimo_turno'] = $turno;
    }

    return (int)$conv['aclaraciones_fallidas'] >= 2 ? 'ambiguedad_agotada' : null;
}

/** Marca un handoff real, que el panel mantiene pendiente hasta que Pablo responda. */
function wabot_handoff_marcar(&$conv, $causa = 'derivacion') {
    $conv['fase'] = 'derivado';
    $conv['cierre'] = $causa === 'prediseno' ? 'prediseno'
                    : ($causa === 'sistema' ? 'sistema' : 'derivacion');
    $conv['espera_avisada'] = false;
    $conv['handoff_pendiente'] = true;
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'handoff_creado', ['causa' => $causa]);
    wabot_evento_sesion($conv, 'derivado', ['causa' => $causa]);
}

function wabot_ultimo_texto_bot($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $t) {
        if (($t['q'] ?? '') === 'bot') return trim((string)($t['t'] ?? ''));
    }
    return '';
}

/** Textos seguros cuando la dependencia de IA no está disponible. Nunca deriva. */
function wabot_fallback_ia($texto, &$conv, $cfg) {
    $cierre = wabot_cierre_sin_presion_tipo($texto);
    if ($cierre !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierre);

    $faseActual = $conv['fase'] ?? 'nuevo';
    if (!in_array($faseActual, ['nuevo', 'menu', 'algo_diferente'], true)) {
        $infoFase = wabot_info_por_palabras($texto, $faseActual);
        if ($infoFase !== null) {
            if ($infoFase === 'precio_actual') return [wabot_precio_resumen($conv, $cfg)];
            if ($infoFase === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
            if ($infoFase === 'pago') return [wabot_texto_pago($conv, $cfg)];
            if ($infoFase === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
            return [(string)($cfg['info'][$infoFase] ?? $cfg['info']['otra'])];
        }
    }

    switch ($conv['fase'] ?? 'nuevo') {
        case 'nuevo':
            $t = wabot_normalizar_frase($texto);
            if ($t === '' || preg_match('/^(hola+|buenas|buen dia|buenas tardes|buenas noches|como estas|hola como estas)$/u', $t)) {
                $conv['fase'] = 'menu';
                return [wabot_apertura($conv, $cfg)];
            }
            // El agente puede haber conversado sin mover la fase porque todavía
            // no llamó tools. Si luego cae, el contenido actual manda: no se
            // reinicia con otro saludo ni se pierde un "para mates".
            // Sin break: usa la misma detección local del menú.
        case 'menu':
        case 'algo_diferente':
            $t = wabot_normalizar_frase($texto);
            $contexto = wabot_contexto_cliente_texto($conv);
            if (wabot_contexto_es_hibrido($contexto)) {
                $objetivo = wabot_desempate_por_palabras('desempate_hibrido', $texto);
                if ($objetivo === 'hibrido_vender')   return wabot_precio('ecommerce', $conv, $cfg);
                if ($objetivo === 'hibrido_catalogo') return wabot_precio('catalogo', $conv, $cfg);
                if ($objetivo === 'hibrido_trabajos') return wabot_precio('landing', $conv, $cfg);
                $conv['fase'] = 'desempate_hibrido';
                wabot_handoff_aclaracion_resuelta($conv);
                return [(string)$cfg['desempate_hibrido']];
            }

            $rubroLocal = wabot_fallback_rubro_local($t);
            $rubroContexto = wabot_fallback_rubro_local($contexto);

            // Gabriela: "vendo zapatillas" quedó en el turno anterior y ahora
            // responde "catálogo y WhatsApp". Aunque Gemini caiga, se juntan
            // ambas piezas antes de decidir.
            if ($rubroContexto === 'comercio_pendiente') {
                $objetivo = wabot_desempate_por_palabras('desempate_comercio', $texto);
                if ($objetivo === 'comercio_vender')  return wabot_precio('ecommerce', $conv, $cfg);
                if ($objetivo === 'comercio_mostrar') return wabot_precio('catalogo', $conv, $cfg);
            }
            if ($rubroContexto === 'turnos_pendiente') {
                $objetivo = wabot_desempate_por_palabras('desempate_turnos', $texto);
                if ($objetivo === 'turnos_si') return wabot_precio('turnos', $conv, $cfg);
                if ($objetivo === 'turnos_no') return wabot_precio('landing', $conv, $cfg);
            }
            if ($rubroContexto === 'cursos') {
                $objetivo = wabot_desempate_por_palabras('desempate_cursos', $texto);
                if ($objetivo === 'cursos_vender')  return wabot_precio('elearning', $conv, $cfg);
                if ($objetivo === 'cursos_mostrar') return wabot_precio('landing', $conv, $cfg);
            }

            if ($rubroLocal === null) $rubroLocal = $rubroContexto;
            if ($rubroLocal === 'sistema_pendiente') {
                $conv['fase'] = 'sistema_problema';
                wabot_handoff_aclaracion_resuelta($conv);
                return [wabot_sistema_texto('problema', $cfg)];
            }
            $desempate = wabot_desempate_de($rubroLocal);
            if ($desempate !== null) {
                $conv['fase'] = $desempate[0];
                wabot_handoff_aclaracion_resuelta($conv);
                $claveTexto = $desempate[0] === 'desempate_turnos'
                    ? wabot_clave_desempate_turnos($texto, $cfg) : $desempate[1];
                return [$cfg[$claveTexto]];
            }
            if ($rubroLocal !== null) return wabot_precio($rubroLocal, $conv, $cfg);
            $infoLocal = wabot_info_por_palabras($texto, $conv['fase'] ?? 'menu');
            if ($infoLocal !== null && $infoLocal !== 'precio_actual') {
                if ($infoLocal === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
                if ($infoLocal === 'pago') return [wabot_texto_pago($conv, $cfg)];
                if ($infoLocal === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
                return [(string)($cfg['info'][$infoLocal] ?? $cfg['info']['otra'])];
            }
            $conv['fase'] = 'algo_diferente';
            return [wabot_contexto_cliente_tiene_negocio($conv)
                ? (string)$cfg['aclarar_objetivo']
                : (string)$cfg['contame']];
        case 'desempate_turnos':  return [$cfg['desempate_turnos']];
        case 'desempate_comercio': return [$cfg['desempate_comercio']];
        case 'desempate_hibrido':
            $objetivo = wabot_desempate_por_palabras('desempate_hibrido', $texto);
            if ($objetivo === 'hibrido_vender')   return wabot_precio('ecommerce', $conv, $cfg);
            if ($objetivo === 'hibrido_catalogo') return wabot_precio('catalogo', $conv, $cfg);
            if ($objetivo === 'hibrido_trabajos') return wabot_precio('landing', $conv, $cfg);
            return [$cfg['desempate_hibrido']];
        case 'catalogo_cantidad':
            $cantFallback = wabot_extraer_cantidad_productos($texto);
            if ($cantFallback !== null) return wabot_catalogo_cotizar($cantFallback, $conv, $cfg);
            return [$cfg['catalogo_cantidad']];
        case 'desempate_cursos': return [$cfg['desempate_cursos']];
        case 'sistema_problema':
            if (wabot_fallback_respuesta_vacia($texto)) return [wabot_sistema_texto('problema', $cfg)];
            $conv['sistema_problema'] = trim($texto);
            $conv['fase'] = 'sistema_usuarios';
            wabot_handoff_aclaracion_resuelta($conv);
            return [wabot_sistema_texto('usuarios', $cfg)];
        case 'sistema_usuarios':
            if (wabot_fallback_respuesta_vacia($texto)) return [wabot_sistema_texto('usuarios', $cfg)];
            $conv['sistema_usuarios'] = trim($texto);
            $conv['fase'] = 'sistema_actual';
            return [wabot_sistema_texto('actual', $cfg)];
        case 'sistema_actual':
            if (wabot_fallback_respuesta_vacia($texto, false)) return [wabot_sistema_texto('actual', $cfg)];
            $conv['sistema_actual'] = wabot_es_negativa($texto)
                ? 'No indicó cómo lo maneja hoy'
                : trim($texto);
            return wabot_sistema_completo($conv, $cfg);
        case 'sistema_listo':    return wabot_sistema_completo($conv, $cfg);
        case 'sistema_brief': // compatibilidad con el orden anterior: problema → método → usuarios
            if (empty($conv['sistema_problema'])) {
                if (wabot_fallback_respuesta_vacia($texto)) return [wabot_sistema_texto('problema', $cfg)];
                $conv['sistema_problema'] = trim($texto);
                $conv['fase'] = 'sistema_usuarios';
                return [wabot_sistema_texto('usuarios', $cfg)];
            }
            if (empty($conv['sistema_actual']) && empty($conv['sistema_usuarios'])) {
                if (wabot_fallback_respuesta_vacia($texto, false)) return [wabot_sistema_texto('actual', $cfg)];
                $conv['sistema_actual'] = wabot_es_negativa($texto) ? 'No indicó cómo lo maneja hoy' : trim($texto);
                $conv['fase'] = 'sistema_usuarios';
                return [wabot_sistema_texto('usuarios', $cfg)];
            }
            if (empty($conv['sistema_usuarios'])) {
                if (wabot_fallback_respuesta_vacia($texto)) return [wabot_sistema_texto('usuarios', $cfg)];
                $conv['sistema_usuarios'] = trim($texto);
                return wabot_sistema_completo($conv, $cfg);
            }
            if (empty($conv['sistema_actual'])) {
                if (wabot_fallback_respuesta_vacia($texto, false)) return [wabot_sistema_texto('actual', $cfg)];
                $conv['sistema_actual'] = wabot_es_negativa($texto) ? 'No indicó cómo lo maneja hoy' : trim($texto);
            }
            return wabot_sistema_completo($conv, $cfg);
        case 'sistema_wsp':
            $num = wabot_extraer_celular($texto);
            if ($num === null) return [wabot_sistema_whatsapp_texto($cfg, true)];
            $conv['telefono_wsp'] = $num;
            return wabot_sistema_completo($conv, $cfg);
        case 'pitch':
            if ($conv['tipo'] === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) <= 0) {
                $cantFallback = wabot_extraer_cantidad_productos($texto);
                if ($cantFallback !== null) $conv['productos_cantidad'] = $cantFallback;
            }
            return wabot_precio((string)$conv['tipo'], $conv, $cfg);
        case 'precio':
            if (!empty($conv['cta_muestra'])
                && (wabot_es_afirmativa($texto) || wabot_aporta_descripcion($texto))) {
                $conv['fase'] = 'prediseno';
                wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'fallback']);
                if (empty($conv['descripcion']) && wabot_aporta_descripcion($texto)) {
                    $conv['descripcion'] = trim($texto);
                }
                return [wabot_prediseno_texto($conv, $cfg)];
            }
            if (empty($conv['cta_muestra'])) {
                $conv['cta_muestra'] = true;
                wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'fallback_duda']);
                return [$cfg['cta_muestra'] ?? $cfg['msg_prediseno_oferta']];
            }
            return [$cfg['info']['otra']];
        case 'confirma_cambio':
            $tcf = wabot_normalizar_frase($texto);
            if (preg_match('/\b(mismo|misma|el mismo|la misma|ese mismo)\b/u', $tcf)) {
                $conv['fase'] = (string)($conv['fase_previa_cambio'] ?? 'precio');
                unset($conv['fase_previa_cambio']);
                return [(string)($cfg['confirma_cambio_mismo'] ?? 'Perfecto, seguimos con lo que veníamos viendo entonces. Querés que avancemos con la demo gratis?')];
            }
            if (preg_match('/\b(otra|otro|aparte|separada|separado|distinta|distinto|nueva)\b/u', $tcf)) {
                unset($conv['fase_previa_cambio']);
                return wabot_derivar($conv, $cfg, 'segunda_web');
            }
            return [wabot_texto_aclaracion($conv, $cfg)];
        case 'prediseno':
            $tp = trim($texto);
            if (empty($conv['descripcion']) && mb_strlen($tp) >= 15
                && strpos($tp, '?') === false && !wabot_fallback_respuesta_vacia($texto)) {
                $conv['descripcion'] = $tp;
            }
            if (empty($conv['colores']) && !empty($conv['descripcion']) && wabot_es_delegacion($texto)) {
                $conv['colores'] = 'A elección del diseñador';
            }
            if (!empty($conv['descripcion']) && !empty($conv['colores'])) {
                if (!empty($conv['referencia']) || !empty($conv['referencia_preguntada'])) {
                    return wabot_cerrar_o_pedir_whatsapp($conv, $cfg);
                }
                $conv['fase'] = 'prediseno_ref';
                $conv['referencia_preguntada'] = true;
                return [$cfg['prediseno_referencia']];
            }
            if (!empty($conv['descripcion']) && empty($conv['colores'])) $pedido = (string)$cfg['prediseno_falta_colores'];
            elseif (!empty($conv['colores']) && empty($conv['descripcion'])) $pedido = (string)$cfg['prediseno_falta_descripcion'];
            else $pedido = wabot_prediseno_texto($conv, $cfg);
            if (trim($pedido) !== '' && trim($pedido) === wabot_ultimo_texto_bot($conv)) {
                return [(string)($cfg['repregunta_suave'] ?? 'Perdoná si no fui claro. Contame qué duda te quedó y te la respondo, y seguimos con la demo cuando quieras.')];
            }
            return [$pedido];
        case 'postdemo':
            if (wabot_dice_que_pago($texto)) {
                $conv['presentado_confirmado'] = true;
                $conv['pago_avisado_ts'] = time();
                return array_merge([(string)$cfg['postdemo_pago_avisado']], wabot_derivar($conv, $cfg, 'pago_explicito'));
            }
            if (wabot_prefiere_tarjeta($texto)) {
                $link = wabot_postdemo_link_tarjeta($conv, $cfg);
                if ($link !== '') return [$link];
            }
            if (wabot_postdemo_quiere_avanzar($texto)) return [wabot_postdemo_transferencia($conv, $cfg)];
            if (wabot_postdemo_objecion_plata($texto) && empty($conv['cuotas_ofrecidas'])) {
                $conv['cuotas_ofrecidas'] = true;
                return [(string)$cfg['postdemo_cuotas_sin_interes']];
            }
            if (wabot_postdemo_la_va_a_mirar($texto)) return [(string)$cfg['postdemo_la_miro']];
            if (wabot_postdemo_duda($texto) && empty($conv['videollamada_ofrecida'])) {
                $conv['videollamada_ofrecida'] = true;
                return [(string)$cfg['postdemo_videollamada']];
            }
            return [(string)$cfg['postdemo_apertura']];
        case 'prediseno_ref':
            if (strpos($texto, '?') === false && trim($texto) !== '') {
                $conv['referencia'] = wabot_referencia_utilizable($texto) ? trim($texto) : '';
                return wabot_cerrar_o_pedir_whatsapp($conv, $cfg);
            }
            return [$cfg['prediseno_referencia']];
        case 'prediseno_wsp':
            $num = wabot_extraer_celular($texto);
            if ($num === null) return [$cfg['prediseno_whatsapp_invalido']];
            $conv['telefono_wsp'] = $num;
            return wabot_prediseno_completo($conv, $cfg);
    }
    return [$cfg['contame']];
}

/**
 * Respaldo local para rubros inequívocos. No reemplaza al clasificador: solo
 * evita que un 429 vuelva torpe al bot justo con un mensaje comercial claro.
 */
function wabot_fallback_rubro_local($t) {
    $t = wabot_normalizar_frase($t);
    if ($t === '') return null;

    if (preg_match('/\b(sistema|software|app|aplicacion|panel)\b/u', $t)
        && preg_match('/\b(stock|ventas|clientes|gestion|facturacion|turnos|control|interno|procesos|tareas)\b/u', $t)) {
        return 'sistema_pendiente';
    }
    if (preg_match('/\b(ecommerce|e commerce|tienda online|carrito|cobro online|cobrar online)\b/u', $t)
        || preg_match('/\bvender\b.{0,30}\b(online|por internet|desde la web|por la web)\b/u', $t)) {
        return 'ecommerce';
    }
    if (wabot_contexto_es_hibrido($t)) return 'hibrido_pendiente';
    if (preg_match('/\b(peluqueria|barberia|estetica|esteticista|spa|masajes|unas|manicura|depilacion|tatuajes|consultorio|odontologia|psicologia|nutricionista|kinesiologo|kinesiologa|kinesiologia|fonoaudiologia|fonoaudiologa|dermatologia|dermatologa|dermatologo|cosmiatra|podologia|podologa|veterinaria|gimnasio|pilates|yoga|canchas|cabanas|hotel|taller mecanico)\b/u', $t)) {
        return 'turnos_pendiente';
    }
    if (preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases online)\b/u', $t)
        || preg_match('/\b(doy|dicto|damos|dictamos)\b.{0,15}\btaller(es)?\b/u', $t)) return 'cursos';
    if (preg_match('/\b(mates?|velas|ropa|zapatillas?|calzados?|productos|mercaderia|muebles|articulos|ferreteria|kiosco|dietetica|bazar|vivero|panaderia|pet shop|repuestos|local|imprenta|grafica|cajas|packaging|envases|libreria|jugueteria|carniceria|verduleria|fabricamos|indumentaria|marroquineria|cosmetica|perfumeria)\b/u', $t)) {
        return 'ecommerce';
    }
    if (preg_match('/\b(inmobiliaria|propiedades|bienes raices)\b/u', $t)) return 'inmobiliaria';
    if (preg_match('/\b(landing|abogado|contador|estudio juridico|plomero|gasista|electricista|pintor|fletes|mudanzas|cerrajero|jardinero|fotografo|disenador|limpieza|seguridad|vigilancia|transporte|logistica|refrigeracion|climatizacion|aire acondicionado|eventos|catering|pintura|albanil|techista|durlock|sanitarios|desagotes|fumigacion|control de plagas|herreria|soldadura|grua|remis|traslados|nineras|cuidado de|masajista|entrenador|profesor particular|traductor|community manager|marketing digital|consultora|consultoria|asesoria|gestoria|seguros|contable|arquitecto|ingeniero|topografo|escribano|martillero)\b/u', $t)) {
        return 'landing';
    }
    if (preg_match('/\b(fundacion|ong|colegio|escuela|universidad|instituto|municipio|sindicato|asociacion|camara|cooperativa|mutual|club|parroquia|iglesia|hospital|centro de salud)\b/u', $t)) {
        return 'institucional';
    }
    return null;
}

/** Evita guardar saludos o vacío como si fueran una respuesta del brief. */
function wabot_fallback_respuesta_vacia($texto, $negativaTambien = true) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || preg_match('/^(hola+|buenas|buen dia|buenas tardes|buenas noches)$/u', $t)) return true;
    return $negativaTambien && wabot_es_negativa($texto);
}

/** Preguntas del brief estructurado de sistemas, con defaults compatibles. */
function wabot_sistema_texto($paso, $cfg) {
    $textos = [
        'problema' => $cfg['sistema_pregunta'] ?? 'Sí, también desarrollamos sistemas de gestión a medida. Qué necesitás que resuelva concretamente?',
        'usuarios' => $cfg['sistema_pregunta_usuarios'] ?? 'Cuántas personas usarían el sistema aproximadamente?',
        'actual'   => $cfg['sistema_pregunta_actual'] ?? 'Cómo lo manejan hoy: con papel, Excel, otro sistema o de otra manera?',
    ];
    return $textos[$paso] ?? $cfg['contame'];
}

/** Pedido de contacto para sistemas originados en Instagram. */
function wabot_sistema_whatsapp_texto($cfg, $invalido = false) {
    if ($invalido) {
        return $cfg['sistema_whatsapp_invalido']
            ?? $cfg['prediseno_whatsapp_invalido']
            ?? 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.';
    }
    return $cfg['sistema_whatsapp']
        ?? 'Última cosa: pasame tu número de WhatsApp así Pablo te envía por ahí la propuesta del sistema.';
}

/** Repregunta contextual para una intención que todavía no habilita handoff. */
function wabot_texto_aclaracion($conv, $cfg) {
    $fase = $conv['fase'] ?? 'menu';
    // Si ya la preguntamos y no entendimos la respuesta, NO se repite la misma
    // pregunta textual: se reformula más simple, con las dos palabras exactas
    // que esperamos. Repetir lo mismo palabra por palabra es lo que el cliente
    // percibe como "el bot está tildado".
    $yaPregunto = !empty($conv['aclaracion_pendiente']);
    if ($fase === 'desempate_turnos')   return $yaPregunto && !empty($cfg['desempate_turnos_2'])   ? $cfg['desempate_turnos_2']   : $cfg['desempate_turnos'];
    if ($fase === 'desempate_comercio') return $yaPregunto && !empty($cfg['desempate_comercio_2']) ? $cfg['desempate_comercio_2'] : $cfg['desempate_comercio'];
    if ($fase === 'desempate_hibrido')  return $yaPregunto && !empty($cfg['desempate_hibrido_2'])  ? $cfg['desempate_hibrido_2']  : $cfg['desempate_hibrido'];
    if ($fase === 'desempate_cursos')   return $yaPregunto && !empty($cfg['desempate_cursos_2'])   ? $cfg['desempate_cursos_2']   : $cfg['desempate_cursos'];
    if ($fase === 'catalogo_cantidad')  return $yaPregunto && !empty($cfg['catalogo_cantidad_2'])  ? $cfg['catalogo_cantidad_2']  : $cfg['catalogo_cantidad'];
    if ($fase === 'sistema_problema') return wabot_sistema_texto('problema', $cfg);
    if ($fase === 'sistema_brief') {
        if (empty($conv['sistema_problema'])) return wabot_sistema_texto('problema', $cfg);
        if (empty($conv['sistema_usuarios'])) return wabot_sistema_texto('usuarios', $cfg);
        if (empty($conv['sistema_actual'])) return wabot_sistema_texto('actual', $cfg);
    }
    if ($fase === 'sistema_usuarios') return wabot_sistema_texto('usuarios', $cfg);
    if ($fase === 'sistema_actual') return wabot_sistema_texto('actual', $cfg);
    if ($fase === 'sistema_wsp') return wabot_sistema_whatsapp_texto($cfg);
    if ($fase === 'prediseno_wsp') return $cfg['prediseno_whatsapp'];
    if ($fase === 'prediseno_ref') return $cfg['prediseno_referencia'];
    if ($fase === 'confirma_cambio') {
        return $yaPregunto && !empty($cfg['confirma_cambio_2']) ? $cfg['confirma_cambio_2']
            : (string)($cfg['confirma_cambio'] ?? 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?');
    }
    if (in_array($fase, ['precio', 'prediseno'], true) && !empty($conv['tipo'])) {
        return (string)($cfg['confirma_cambio'] ?? 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?');
    }
    if ($fase === 'algo_diferente') return $yaPregunto && !empty($cfg['contame_2']) ? $cfg['contame_2'] : $cfg['contame'];
    return $cfg['contame'];
}

/** Resultado visible de un intento de handoff que pasó por la guarda. */
function wabot_handoff_intentar($texto, &$conv, $cfg, $causaSugerida = null, $porCambioTipo = false) {
    $causa = wabot_handoff_causa_explicita($texto);
    if ($causa === null && $causaSugerida === 'productos_y_cursos') {
        // La etiqueta sola no alcanza; la evidencia puede estar repartida entre
        // dos mensajes recientes, así que se relee la parte cliente de la sesión.
        $reciente = '';
        foreach (array_slice((array)($conv['transcript'] ?? []), -8) as $t) {
            if (($t['q'] ?? '') === 'cliente') $reciente .= ' ' . ($t['t'] ?? '');
        }
        $causa = wabot_handoff_causa_explicita(trim($reciente));
        if ($causa !== 'productos_y_cursos') $causa = null;
    }

    if ($causa === null) $causa = wabot_handoff_ambiguedad($conv, $texto);
    if ($causa === null) {
        wabot_evento_o_diferir($conv, 'handoff_rechazado', [
            'motivo' => 'sin evidencia',
            'aclaraciones_fallidas' => (int)($conv['aclaraciones_fallidas'] ?? 0),
        ]);
        if (($porCambioTipo || in_array($conv['fase'], ['precio', 'prediseno'], true)) && !empty($conv['tipo'])
            && in_array($conv['fase'], ['precio', 'prediseno', 'prediseno_ref', 'prediseno_wsp'], true)) {
            $conv['fase_previa_cambio'] = $conv['fase'];
            $conv['fase'] = 'confirma_cambio';
            return [(string)($cfg['confirma_cambio'] ?? 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?')];
        }
        return [wabot_texto_aclaracion($conv, $cfg)];
    }
    return wabot_derivar($conv, $cfg, $causa);
}

function wabot_evento_o_diferir(&$conv, $evento, $datos = []) {
    if (!empty($conv['_eventos_diferir'])) {
        $conv['_eventos_pendientes'][] = ['evento' => $evento, 'datos' => (array)$datos];
        return;
    }
    if (function_exists('wabot_evento')) wabot_evento($conv, $evento, $datos);
}

/**
 * Procesa un mensaje entrante. Muta $conv y devuelve array de textos a enviar
 * (0, 1 o varios; el que llama los une en UN solo mensaje de WhatsApp).
 */
function wabot_engine($texto, &$conv, $cfg) {
    $ahora = time();
    wabot_turno_preparar($conv, $cfg, $ahora);
    wabot_turno_marcar($conv);

    if (!empty($conv['seguimiento_bloqueado'])
        && (wabot_reabre_consulta($texto) || wabot_fallback_rubro_local($texto) !== null)) {
        $conv['seguimiento_bloqueado'] = false;
        $conv['seguimiento_estado'] = null;
        if (in_array(($conv['cierre'] ?? ''), ['sin_interes', 'consulta_sin_presion'], true)) $conv['cierre'] = null;
    }
    $cierreSinPresion = wabot_cierre_sin_presion_tipo($texto);
    if ($cierreSinPresion !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierreSinPresion);

    $regateo = wabot_regateo_responder($texto, $conv, $cfg);
    if ($regateo !== null) return $regateo;

    if (in_array(($conv['cierre'] ?? ''), ['sin_interes', 'consulta_sin_presion', 'baja'], true)
        && !empty($conv['seguimiento_bloqueado'])) {
        if (($conv['cierre'] ?? '') === 'baja') return [];
        $infoCerrado = wabot_info_por_palabras($texto);
        if ($infoCerrado !== null) {
            if ($infoCerrado === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
            if ($infoCerrado === 'pago') return [wabot_texto_pago($conv, $cfg)];
            if ($infoCerrado === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
            return [(string)($cfg['info'][$infoCerrado] ?? $cfg['info']['otra'])];
        }
        $tCerrado = wabot_normalizar_frase($texto);
        if (mb_strlen($tCerrado) <= 30
            && preg_match('/^(hola+|buenas|buen dia|buenas tardes|buenas noches|gracias|muchas gracias|ok|dale|listo|genial|perfecto|igualmente|saludos)\b/u', $tCerrado)) {
            return [];
        }
    }

    // Charla cerrada: el bot sigue disponible para sacarle dudas, pero NO vuelve
    // a vender. Nunca cotiza de nuevo, nunca reabre el prediseño y nunca deriva
    // otra vez: eso ya pasó. Solo contesta lo que sabe contestar.
    if ($conv['fase'] === 'derivado') {
        return wabot_cerrada($texto, $conv, $cfg);
    }

    // Si el agente abrió el circuito por 429/timeout, no hacemos otra llamada a
    // la misma dependencia para clasificar: vamos directo al respaldo local.
    if (!isset($GLOBALS['WABOT_TEST_CLASIFICADOR'])
        && function_exists('wabot_ia_disponible') && !wabot_ia_disponible()) {
        wabot_evento_sesion($conv, 'ia_fallback_seguro', ['origen' => 'circuito_abierto']);
        return wabot_fallback_ia($texto, $conv, $cfg);
    }

    $c = wabot_clasificar($texto, $conv, $cfg);

    // Fallback sin clasificador: no inventar, avanzar con lo seguro.
    if ($c === null) {
        wabot_evento_sesion($conv, 'ia_fallback_seguro', ['origen' => 'clasificador']);
        return wabot_fallback_ia($texto, $conv, $cfg);
    }

    $acc  = $c['acciones'];

    // Un "sí" pelado contesta la última pregunta del bot, no abre una nueva.
    // Después del precio la única pregunta abierta es el prediseño, así que
    // "Ok dale" es que lo acepta. El clasificador lo leía como "quiere
    // contratar" y la charla se derivaba justo cuando el cliente decía que sí
    // a la muestra gratis: la venta se cortaba sola en el mejor momento.
    if ($conv['fase'] === 'precio' && wabot_es_afirmativa($texto)
        && !in_array('no_interesa', $acc, true) && !in_array('datos_prediseno', $acc, true)) {
        $acc = array_values(array_diff($acc, ['quiere_avanzar', 'pide_humano', 'otro', 'saludo']));
        if (!in_array('quiere_prediseno', $acc, true)) $acc[] = 'quiere_prediseno';
    }

    $out  = [];
    $has  = function ($a) use ($acc) { return in_array($a, $acc, true); };

    /* ── Cortes globales (valen en cualquier fase) ── */
    if ($has('pide_humano') || $has('quiere_avanzar') || $has('productos_y_cursos')) {
        $causa = wabot_handoff_causa_explicita($texto);
        if ($causa === null && $has('productos_y_cursos')) $causa = 'productos_y_cursos';
        // Con la descripción y los colores ya juntados, derivar a secas tira el
        // lead a la basura: se cierra el prediseño (crea el lead y la muestra) y
        // la charla queda con Pablo, que es justo lo que el cliente pidió.
        if ($causa !== null && !$has('productos_y_cursos') && in_array($conv['fase'], ['prediseno_ref', 'prediseno_wsp'], true)) {
            // En Instagram una intención de pago no convierte mágicamente el
            // IGSID en teléfono: si falta el WhatsApp, se lo sigue pidiendo.
            return wabot_cerrar_o_pedir_whatsapp($conv, $cfg);
        }
        if ($causa !== null && !$has('productos_y_cursos') && $conv['fase'] === 'sistema_wsp') {
            return wabot_sistema_completo($conv, $cfg);
        }
        return wabot_handoff_intentar($texto, $conv, $cfg, $has('productos_y_cursos') ? 'productos_y_cursos' : null);
    }
    if ($has('no_interesa')) {
        return wabot_cerrar_sin_presion($conv, $cfg, 'rechazo');
    }

    /* ── Cambio de tipo después del precio: confirmar antes del handoff ── */
    if (in_array($conv['fase'], ['precio', 'prediseno', 'prediseno_ref', 'prediseno_wsp'], true)) {
        $rubroNuevo = wabot_rubro_de($acc);
        if ($rubroNuevo !== null && $rubroNuevo === $conv['tipo'] && $conv['fase'] === 'precio') {
            $acc = array_values(array_diff($acc, ['otro']));
            if (!in_array('quiere_prediseno', $acc, true)) $acc[] = 'quiere_prediseno';
            $has = function ($a) use ($acc) { return in_array($a, $acc, true); };
        } elseif ($has('cambia_tipo') || $has('rubro_sistema')
            || ($rubroNuevo !== null && $rubroNuevo !== $conv['tipo'] && wabot_desempate_de($rubroNuevo) === null)) {
            return wabot_handoff_intentar($texto, $conv, $cfg, null, true);
        }
    }

    /* ── Objeciones y preguntas de info (se responden en la fase que sea) ── */
    if ($has('objecion_caro'))      $out[] = wabot_objecion_texto('caro', $cfg['caro'], $conv, $cfg);
    if ($has('objecion_pensarlo'))  $out[] = wabot_objecion_texto('pensarlo', $cfg['pensarlo'], $conv, $cfg);
    if ($has('objecion_socio'))     $out[] = wabot_objecion_texto('socio', $cfg['socio'], $conv, $cfg);
    if ($has('objecion_ya_tiene_web')) $out[] = wabot_objecion_texto('ya_tiene_web', $cfg['ya_tengo_web'], $conv, $cfg);
    if ($has('menciona_plataforma')) $out[] = wabot_objecion_texto('plataforma', $cfg['plataformas'], $conv, $cfg);
    // Respaldo local SOLO cuando el clasificador no etiquetó nada útil: si ya
    // reconoció otra acción real (datos_prediseno, un rubro, una objeción), esa
    // gana siempre. Sin este freno, una foto del logo con "logo" en el texto se
    // leía como la pregunta "qué logo incluye" y pisaba el dato real.
    $sinNada = !$acc || $acc === ['otro'];
    $infoLocal = $sinNada ? wabot_info_por_palabras($texto, $conv['fase']) : null;
    if ($infoLocal !== null) { $acc[] = 'pregunta_info'; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
    if ($has('pregunta_info')) {
        $keys = $c['info_keys'] ?: [];
        if ($infoLocal !== null && !in_array($infoLocal, $keys, true)) array_unshift($keys, $infoLocal);
        if (!$keys) $keys = ['otra'];
        $lineas = [];
        foreach ($keys as $k) {
            if ($k === 'precio_actual') { $lineas[] = wabot_precio_resumen($conv, $cfg); continue; }
            if (!isset($cfg['info'][$k])) continue;
            $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
                : ($k === 'pago' ? wabot_texto_pago($conv, $cfg)
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg) : wabot_texto_info($k, $cfg)));
        }
        if (!$lineas) $lineas[] = $cfg['info']['otra'];
        // "Ese detalle te lo confirma Pablo" es una promesa: si sale, la duda
        // queda pendiente de verdad — Pablo la ve en el panel y ni el
        // seguimiento ni la última llamada persiguen una charla con una
        // pregunta sin contestar (caso Eze, 21-ago). Solo el flag, sin
        // wabot_handoff_marcar(): cambiar la fase a derivado por una pregunta
        // lateral descarrilaría la venta entera.
        if (in_array($cfg['info']['otra'], $lineas, true)) {
            $conv['handoff_pendiente'] = true;
            wabot_evento_sesion($conv, 'duda_sin_respuesta');
        }
        $out[] = count($lineas) > 1 ? "- " . implode("\n- ", $lineas) : $lineas[0];
    }

    /* ── Flujo por fase ── */
    switch ($conv['fase']) {

        case 'nuevo':
            $r = wabot_rubro_de($acc);
            $d = wabot_desempate_de($r);
            if ($d)                         { $conv['fase'] = $d[0]; wabot_handoff_aclaracion_resuelta($conv); $out[] = $d[0] === 'sistema_problema' ? wabot_sistema_texto('problema', $cfg) : $cfg[$d[1]]; }
            elseif ($r !== null)            { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); }
            elseif ($has('pregunta_tipos')) { $conv['fase'] = 'menu'; $out[] = $cfg['def_tipos']; }
            elseif ($has('algo_diferente')) { $conv['fase'] = 'algo_diferente'; wabot_handoff_ambiguedad($conv, $texto); $out[] = $cfg['contame']; }
            elseif ($has('quiere_prediseno')) { $conv['fase'] = 'menu'; $out[] = wabot_apertura($conv, $cfg); }
            else { $conv['fase'] = 'menu'; $out[] = wabot_apertura($conv, $cfg); } // saludo, otro o pregunta ya contestada
            break;

        case 'menu':
            $r = wabot_rubro_de($acc);
            $d = wabot_desempate_de($r);
            if ($d)                         { $conv['fase'] = $d[0]; wabot_handoff_aclaracion_resuelta($conv); $out[] = $d[0] === 'sistema_problema' ? wabot_sistema_texto('problema', $cfg) : $cfg[$d[1]]; }
            elseif ($r !== null)            { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); }
            elseif ($has('pregunta_tipos')) { $out[] = $cfg['def_tipos']; }
            elseif ($has('algo_diferente')) { $conv['fase'] = 'algo_diferente'; wabot_handoff_ambiguedad($conv, $texto); $out[] = $cfg['contame']; }
            elseif (!$out && $has('saludo')) { $out[] = wabot_apertura($conv, $cfg); }
            elseif (!$out)                  { $conv['fase'] = 'algo_diferente'; wabot_handoff_ambiguedad($conv, $texto); $out[] = $cfg['contame']; }
            break;

        case 'algo_diferente':
            $r = wabot_rubro_de($acc);
            $d = wabot_desempate_de($r);
            if ($d)                  { $conv['fase'] = $d[0]; wabot_handoff_aclaracion_resuelta($conv); $out[] = $d[0] === 'sistema_problema' ? wabot_sistema_texto('problema', $cfg) : $cfg[$d[1]]; }
            elseif ($r !== null)     { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); }
            elseif (!$out)           { return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg)); }
            break;

        case 'desempate_turnos':
            // Si el clasificador no la etiquetó, la respuesta se lee por palabras:
            // "vender", "carrito", "solos"... no pueden depender de que la IA acierte.
            if (!$has('turnos_si') && !$has('turnos_no')) {
                $local = wabot_desempate_por_palabras('desempate_turnos', $texto);
                if ($local !== null) { $acc[] = $local; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
            }
            if ($has('turnos_si'))          { $out = array_merge($out, wabot_precio('turnos', $conv, $cfg)); }
            elseif ($has('turnos_no'))      { $out = array_merge($out, wabot_precio('landing', $conv, $cfg)); }
            else                            { $out = wabot_desempate_desvio($acc, $out, $texto, $conv, $cfg); if ($conv['fase'] === 'derivado') return $out; }
            break;

        case 'desempate_comercio':
            // Si el clasificador no la etiquetó, la respuesta se lee por palabras:
            // "vender", "carrito", "solos"... no pueden depender de que la IA acierte.
            if (!$has('comercio_vender') && !$has('comercio_mostrar')) {
                $local = wabot_desempate_por_palabras('desempate_comercio', $texto);
                if ($local !== null) { $acc[] = $local; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
            }
            if ($has('comercio_vender'))    { $out = array_merge($out, wabot_precio('ecommerce', $conv, $cfg)); }
            elseif ($has('comercio_mostrar')) { $out = array_merge($out, wabot_precio('catalogo', $conv, $cfg)); }
            else                            { $out = wabot_desempate_desvio($acc, $out, $texto, $conv, $cfg); if ($conv['fase'] === 'derivado') return $out; }
            break;

        case 'desempate_hibrido':
            if (!$has('hibrido_vender') && !$has('hibrido_catalogo') && !$has('hibrido_trabajos')) {
                $local = wabot_desempate_por_palabras('desempate_hibrido', $texto);
                if ($local !== null) { $acc[] = $local; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
            }
            if ($has('hibrido_vender'))            { $out = array_merge($out, wabot_precio('ecommerce', $conv, $cfg)); }
            elseif ($has('hibrido_catalogo'))      { $out = array_merge($out, wabot_precio('catalogo', $conv, $cfg)); }
            elseif ($has('hibrido_trabajos'))      { $out = array_merge($out, wabot_precio('landing', $conv, $cfg)); }
            else                                   { $out = wabot_desempate_desvio($acc, $out, $texto, $conv, $cfg); if ($conv['fase'] === 'derivado') return $out; }
            break;

        case 'desempate_cursos':
            // Si el clasificador no la etiquetó, la respuesta se lee por palabras:
            // "vender", "carrito", "solos"... no pueden depender de que la IA acierte.
            if (!$has('cursos_vender') && !$has('cursos_mostrar')) {
                $local = wabot_desempate_por_palabras('desempate_cursos', $texto);
                if ($local !== null) { $acc[] = $local; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
            }
            if ($has('cursos_vender'))      { $out = array_merge($out, wabot_precio('elearning', $conv, $cfg)); }
            elseif ($has('cursos_mostrar')) { $out = array_merge($out, wabot_precio('landing', $conv, $cfg)); }
            else                            { $out = wabot_desempate_desvio($acc, $out, $texto, $conv, $cfg); if ($conv['fase'] === 'derivado') return $out; }
            break;

        case 'sistema_brief': // compatibilidad: el flujo anterior preguntaba método antes que usuarios
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            if (empty($conv['sistema_problema'])) {
                if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
                $conv['sistema_problema'] = trim($texto);
                $conv['fase'] = 'sistema_usuarios';
                $out[] = wabot_sistema_texto('usuarios', $cfg);
                break;
            }
            if (empty($conv['sistema_actual']) && empty($conv['sistema_usuarios'])) {
                $conv['sistema_actual'] = wabot_es_negativa($texto)
                    ? 'No indicó cómo lo maneja hoy'
                    : trim($texto);
                $conv['fase'] = 'sistema_usuarios';
                $out[] = wabot_sistema_texto('usuarios', $cfg);
                break;
            }
            if (empty($conv['sistema_usuarios'])) {
                if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
                $conv['sistema_usuarios'] = trim($texto);
                return array_merge($out, wabot_sistema_completo($conv, $cfg));
            }
            if (empty($conv['sistema_actual'])) {
                $conv['sistema_actual'] = wabot_es_negativa($texto)
                    ? 'No indicó cómo lo maneja hoy'
                    : trim($texto);
            }
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'sistema_problema':
            // Dudas y objeciones ya contestadas arriba: la pregunta sigue en pie.
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            // Si en realidad quería una web, se cotiza y listo.
            $r = wabot_rubro_de($acc);
            if ($r !== null && wabot_desempate_de($r) === null) { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); break; }
            if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
            $conv['sistema_problema'] = trim($texto);
            wabot_handoff_aclaracion_resuelta($conv);
            // Si ya explicó el sistema con detalle, no se lo interroga más: se
            // cierra con lo que dio. Preguntar tres cosas a quien ya contó todo
            // se siente como un formulario (caso Payaso Natalio, 22-ago).
            if (wabot_sistema_ya_explicado($conv)) {
                return array_merge($out, wabot_sistema_completo($conv, $cfg));
            }
            $conv['fase'] = 'sistema_usuarios';
            $out[] = wabot_sistema_texto('usuarios', $cfg);
            break;

        case 'sistema_usuarios':
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
            $conv['sistema_usuarios'] = trim($texto);
            // Dos preguntas es el techo: con el problema y los usuarios alcanza
            // para que Pablo cotice. El "cómo lo maneja hoy" quedó como opcional.
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'sistema_actual':
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            $conv['sistema_actual'] = trim($texto) !== '' ? trim($texto) : 'No indicó cómo lo maneja hoy';
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'sistema_listo':
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'postdemo':
            // Parte 2: se cierra la venta. No se recotiza ni se reabre nada.
            if (wabot_dice_que_pago($texto)) {
                $conv['presentado_confirmado'] = true;
                $conv['pago_avisado_ts'] = time();
                wabot_evento_sesion($conv, 'pago_avisado');
                $out[] = (string)$cfg['postdemo_pago_avisado'];
                return array_merge($out, wabot_derivar($conv, $cfg, 'pago_explicito'));
            }
            if (wabot_prefiere_tarjeta($texto)) {
                $link = wabot_postdemo_link_tarjeta($conv, $cfg);
                if ($link !== '') { $out[] = $link; break; }
            }
            if ($out || $has('saludo')) break;
            if (wabot_postdemo_quiere_avanzar($texto) || wabot_handoff_causa_explicita($texto) !== null) {
                $out[] = wabot_postdemo_transferencia($conv, $cfg);
                break;
            }
            // Objeción de plata: las 3 cuotas sin interés. No hay link para eso,
            // las arma Pablo, así que la charla queda con él.
            if (wabot_postdemo_objecion_plata($texto) && empty($conv['cuotas_ofrecidas'])) {
                $conv['cuotas_ofrecidas'] = true;
                wabot_evento_sesion($conv, 'cuotas_sin_interes_ofrecidas');
                $out[] = (string)$cfg['postdemo_cuotas_sin_interes'];
                break;
            }
            // "Dale, la voy a mirar": no se empuja. Se responde corto y se deja
            // el seguimiento automático para más tarde.
            if (wabot_postdemo_la_va_a_mirar($texto)) {
                $out[] = (string)$cfg['postdemo_la_miro'];
                break;
            }
            // La videollamada es la carta que destraba una venta frenada, y es el
            // único texto donde aparece el nombre de Pablo. Se juega una sola vez
            // y solo ante una duda real, no ante cualquier mensaje.
            if (wabot_postdemo_duda($texto) && empty($conv['videollamada_ofrecida'])) {
                $conv['videollamada_ofrecida'] = true;
                wabot_evento_sesion($conv, 'videollamada_ofrecida');
                $out[] = (string)$cfg['postdemo_videollamada'];
                break;
            }
            // Salvaguarda: en el cierre no se puede quedar dando vueltas. Pregunta
            // UNA vez y, si el segundo mensaje sigue sin entenderse, lo pasa a
            // Pablo — que es quien puede resolver un pedido raro a esta altura.
            // Contador propio y no wabot_handoff_ambiguedad() porque esa escala
            // recién al tercer mensaje, y acá eso ya es un bot dando vueltas.
            $conv['postdemo_sin_entender'] = (int)($conv['postdemo_sin_entender'] ?? 0) + 1;
            if ((int)$conv['postdemo_sin_entender'] >= 2) {
                $conv['postdemo_sin_entender'] = 0;
                return array_merge($out, wabot_derivar($conv, $cfg, 'ambiguedad'));
            }
            $out[] = (string)$cfg['postdemo_apertura'];
            break;

        case 'confirma_cambio':
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            $tc = wabot_normalizar_frase($texto);
            $rc = wabot_rubro_de($acc);
            if (preg_match('/\b(mismo|misma|el mismo|la misma|ese mismo|si es el mismo|para el mismo)\b/u', $tc)) {
                $conv['fase'] = (string)($conv['fase_previa_cambio'] ?? 'precio');
                unset($conv['fase_previa_cambio']);
                wabot_handoff_aclaracion_resuelta($conv);
                $out[] = (string)($cfg['confirma_cambio_mismo'] ?? 'Perfecto, seguimos con lo que veníamos viendo entonces. Querés que avancemos con la demo gratis?');
                break;
            }
            if (preg_match('/\b(otra|otro|aparte|separada|separado|distinta|distinto|nueva|nuevo proyecto|otra web|otro proyecto)\b/u', $tc)
                || ($rc !== null && $rc !== $conv['tipo'])) {
                unset($conv['fase_previa_cambio']);
                return array_merge($out, wabot_derivar($conv, $cfg, 'segunda_web'));
            }
            $agotada = wabot_handoff_ambiguedad($conv, $texto);
            if ($agotada === 'ambiguedad_agotada') {
                unset($conv['fase_previa_cambio']);
                return array_merge($out, wabot_derivar($conv, $cfg, 'ambiguedad'));
            }
            $out[] = wabot_texto_aclaracion($conv, $cfg);
            break;

        case 'precio':
            if ($has('quiere_prediseno') || $has('datos_prediseno')) {
                $conv['fase'] = 'prediseno';
                wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'motor']);
                // Si ya vino pasando datos junto con el interés, tomarlos.
                if ($c['descripcion'] !== null) $conv['descripcion'] = $c['descripcion'];
                if ($c['colores']     !== null) $conv['colores']     = $c['colores'];
                if ($conv['descripcion'] !== null && $conv['colores'] !== null) {
                    if (!empty($conv['referencia']) || !empty($conv['referencia_preguntada'])) {
                        return array_merge($out, wabot_cerrar_o_pedir_whatsapp($conv, $cfg));
                    }
                    // Ya mandó todo de una: falta solo la referencia visual.
                    $conv['fase'] = 'prediseno_ref';
                    $conv['referencia_preguntada'] = true;
                    $out[] = $cfg['prediseno_referencia'];
                    break;
                }
                $out[] = wabot_prediseno_texto($conv, $cfg);
            } elseif (!$out) {
                $out[] = $cfg['info']['otra'];
            }
            // Se respondió una duda y la charla quedaría en punto muerto: se
            // cierra con un empujón suave hacia la demo, una sola vez, y
            // nunca si la respuesta ya la menciona (las objeciones lo hacen).
            if ($out && $conv['fase'] === 'precio' && empty($conv['cta_muestra'])) {
                $dicho = mb_strtolower(implode(' ', $out));
                // \b y no strpos: "demo" es corto y aparece adentro de "podemos".
                if (!preg_match('/\bdemo\b/u', $dicho) && mb_strpos($dicho, 'predise') === false) {
                    $out[] = $cfg['cta_muestra'];
                }
                $conv['cta_muestra'] = true;
                wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'duda_caliente']);
            }
            break;

        case 'pitch':
            if ($c['descripcion'] !== null) $conv['descripcion'] = $c['descripcion'];
            if (($conv['descripcion'] ?? null) === null && wabot_aporta_descripcion($texto)) {
                $conv['descripcion'] = trim($texto);
            }
            if (($conv['tipo'] ?? '') === 'catalogo') {
                $cant = wabot_extraer_cantidad_productos($texto);
                if ($cant !== null) $conv['productos_cantidad'] = $cant;
            }
            $rNuevoPitch = wabot_rubro_de($acc);
            if ($rNuevoPitch !== null && wabot_desempate_de($rNuevoPitch) === null
                && $rNuevoPitch !== ($conv['tipo'] ?? '')) {
                $conv['tipo'] = $rNuevoPitch;
            }
            return array_merge($out, wabot_precio((string)$conv['tipo'], $conv, $cfg));

        case 'prediseno':
            if ($c['descripcion'] !== null) $conv['descripcion'] = $c['descripcion'];
            if ($c['colores']     !== null) $conv['colores']     = $c['colores'];
            if ($conv['colores'] === null && $conv['descripcion'] !== null && wabot_es_delegacion($texto)) {
                $conv['colores'] = 'A elección del diseñador';
            }

            if ($conv['descripcion'] !== null && $conv['colores'] !== null) {
                // Si el agente ya la anotó o ya se la preguntamos, no se repite:
                // volver a pedirla es el reclamo típico de "ya te la pasé".
                if (!empty($conv['referencia']) || !empty($conv['referencia_preguntada'])) {
                    return array_merge($out, wabot_cerrar_o_pedir_whatsapp($conv, $cfg));
                }
                // Antes de cerrar, la referencia visual: ayuda mucho al prediseño.
                $conv['fase'] = 'prediseno_ref';
                $conv['referencia_preguntada'] = true;
                $out[] = $cfg['prediseno_referencia'];
                break;
            }
            if ($conv['descripcion'] !== null)      { $pedido = $cfg['prediseno_falta_colores']; }
            elseif ($conv['colores'] !== null)      { $pedido = $cfg['prediseno_falta_descripcion']; }
            elseif (!$out)                          { $pedido = wabot_prediseno_texto($conv, $cfg); }
            else                                    { $pedido = null; }
            if ($pedido !== null) {
                if (trim($pedido) === wabot_ultimo_texto_bot($conv)) {
                    $agotada = wabot_handoff_ambiguedad($conv, $texto);
                    if ($agotada === 'ambiguedad_agotada') return array_merge($out, wabot_derivar($conv, $cfg, 'ambiguedad'));
                    $pedido = (string)($cfg['repregunta_suave'] ?? $pedido);
                }
                $out[] = $pedido;
            }
            break;

        case 'prediseno_ref':
            // Si el mensaje era una pregunta, una objeción o un simple gracias,
            // NO es la referencia: se contesta lo contestable y el pedido de
            // referencia sigue en pie. Sin esto, "cuánto tarda?" se guardaba
            // como referencia visual y encima cerraba la charla.
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            // Lo que conteste es la referencia, salvo que sea un "no tengo" o un
            // "ya te la pasé": ahí la referencia está más arriba en la charla y
            // la rescata wabot_links_en_charla() al armar el boceto.
            $conv['referencia'] = wabot_referencia_utilizable($texto) ? trim($texto) : '';
            return array_merge($out, wabot_cerrar_o_pedir_whatsapp($conv, $cfg));

        case 'prediseno_wsp':
            // Igual que arriba: una pregunta no es un teléfono.
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            $num = empty($conv['_texto_de_media']) ? wabot_extraer_celular($texto) : null;
            if ($num === null) { $out[] = $cfg['prediseno_whatsapp_invalido']; break; }
            $conv['telefono_wsp'] = $num;
            return array_merge($out, wabot_prediseno_completo($conv, $cfg));

        case 'sistema_wsp':
            // El IGSID identifica la cuenta de Instagram, no es un teléfono.
            // Solo se cierra el lead cuando el cliente escribe un número real.
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            $num = empty($conv['_texto_de_media']) ? wabot_extraer_celular($texto) : null;
            if ($num === null) { $out[] = wabot_sistema_whatsapp_texto($cfg, true); break; }
            $conv['telefono_wsp'] = $num;
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'catalogo_cantidad':
            if ($out || $has('saludo')) { if ($out) $out[] = wabot_texto_aclaracion($conv, $cfg); break; }
            $rNuevo = wabot_rubro_de($acc);
            if ($rNuevo !== null && $rNuevo !== 'comercio_pendiente' && wabot_desempate_de($rNuevo) === null) {
                return array_merge($out, wabot_precio($rNuevo, $conv, $cfg));
            }
            if ($has('comercio_vender')) return array_merge($out, wabot_precio('ecommerce', $conv, $cfg));
            $cant = wabot_extraer_cantidad_productos($texto);
            if ($cant === null) { $out = wabot_desempate_desvio($acc, $out, $texto, $conv, $cfg); if ($conv['fase'] === 'derivado') return $out; break; }
            return array_merge($out, wabot_catalogo_cotizar($cant, $conv, $cfg));
    }

    return $out;
}

/**
 * El saludo de apertura SOLO se manda si el bot todavía no habló.
 *
 * En modo agente la IA puede llevar varios intercambios sin mover la fase (no
 * llamó ninguna herramienta). Si después se cae, el motor tomaba el control
 * creyendo que la charla recién arranca y saludaba de nuevo: el cliente veía
 * "Hola, cómo estás?" cuando ya venían hablando hacía rato.
 */
function wabot_apertura($conv, $cfg) {
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $hubo_antes = false;
    foreach (($conv['transcript'] ?? []) as $t) {
        $q = $t['q'] ?? '';
        if ($inicio > 0 && (int)($t['ts'] ?? 0) < $inicio) {
            if ($q === 'bot' || $q === 'humano') $hubo_antes = true;
            continue;
        }
        if ($q === 'bot' || $q === 'humano') return $cfg['contame'];
    }
    // Ya hablamos con esta persona en otra ocasión: no se la saluda como a un
    // desconocido. Se retoma. La memoria de qué dijo la tiene el agente; el
    // motor al menos reconoce que volvió.
    if ($hubo_antes && trim((string)($cfg['menu_vuelve'] ?? '')) !== '') return $cfg['menu_vuelve'];
    return $cfg['menu'];
}

/* Devuelve el tipo si alguna acción lo determina, 'cursos' si hay que desempatar, null si no. */
function wabot_rubro_de($acc) {
    // 'cursos' y 'turnos_pendiente' no son tipos cotizables: son preguntas que
    // faltan hacer. El resto sí sale directo al precio.
    if (in_array('rubro_cursos', $acc, true))                                        return 'cursos';
    if (in_array('servicio_con_turnos', $acc, true))                                 return 'turnos_pendiente';
    if (in_array('rubro_hibrido', $acc, true))                                       return 'hibrido_pendiente';
    if (in_array('rubro_comercio', $acc, true))                                      return 'ecommerce';
    if (in_array('rubro_sistema', $acc, true))                                       return 'sistema_pendiente';
    if (in_array('rubro_institucional', $acc, true))                                 return 'institucional';
    if (in_array('elige_landing', $acc, true) || in_array('rubro_landing', $acc, true))       return 'landing';
    if (in_array('elige_ecommerce', $acc, true) || in_array('rubro_ecommerce', $acc, true))   return 'ecommerce';
    if (in_array('rubro_inmobiliaria', $acc, true))                                  return 'inmobiliaria';
    return null;
}

/**
 * Rubros que todavía NO se pueden cotizar porque falta una pregunta.
 * Devuelve [fase a la que va, clave del texto a mandar], o null si se cotiza ya.
 */
function wabot_desempate_de($r) {
    if ($r === 'cursos')           return ['desempate_cursos', 'desempate_cursos'];
    if ($r === 'turnos_pendiente') return ['desempate_turnos', 'desempate_turnos'];
    if ($r === 'hibrido_pendiente')  return ['desempate_hibrido', 'desempate_hibrido'];
    if ($r === 'sistema_pendiente')  return ['sistema_problema', 'sistema_pregunta'];
    return null;
}

/**
 * En medio de una pregunta de desempate el cliente contestó otra cosa. Si esa
 * otra cosa es un rubro cotizable ("en realidad vendo productos"), se cotiza;
 * si es el OTRO desempate ("aparte doy cursos"), se cambia de pregunta; si ya
 * se contestó algo (una duda, una objeción), la pregunta sigue en pie; y solo
 * si no hay nada de nada, se deriva.
 */
/**
 * Red local para las preguntas de desempate: si el clasificador no etiquetó
 * la respuesta, se lee acá con palabras clave. Pasó en producción — el cliente
 * contestó "Vender", después "Carrito", y Gemini devolvió "otro" cada vez, así
 * que el bot repitió la misma pregunta seis veces. Una respuesta de una sola
 * palabra a una pregunta cerrada NO puede depender de que la IA acierte.
 * Devuelve la acción resuelta o null.
 */
function wabot_info_por_palabras($texto, $fase = null) {
    // La puntuación se cambia por un espacio ANTES de normalizar. Si se borra
    // sin más —que es lo que hace wabot_normalizar_frase()— quien escribe
    // "artículos,modificarle" sin espacio termina con "articulosmodificarle",
    // una sola palabra que ninguna clave reconoce. Pasó en producción: esa
    // consulta se fue entera a "eso te lo confirma el desarrollador".
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', (string)$texto));
    if ($t === '') return null;

    // Este matcher es el respaldo local para PREGUNTAS cortas. Un párrafo largo
    // sin signo de pregunta casi siempre es el cliente describiendo su negocio o
    // su sistema, y ahí una palabra suelta manda a la clave equivocada: "que
    // paguen la suscripción por mercado pago" es una FUNCIÓN del sistema que
    // pide, no una pregunta sobre cómo pagarnos a nosotros.
    if (mb_strlen($t) > 120
        && strpos((string)$texto, '?') === false
        && !preg_match('/^(que|cual|cuales|cuanto|cuanta|como|cuando|donde|quien|se puede|puedo|hacen|tienen|incluye|aceptan)\b/u', $t)) {
        return null;
    }

    if (preg_match('/\b(por mes|mensual\w*|al mes|cada mes|mantenimiento|abono\w*|cuota mensual|mensualidad|costo fijo|pago mensual)/u', $t)) return 'mantenimiento';
    if (preg_match('/\b(cuanto tarda\w*|cuanto demora\w*|cuanto tiempo|plazo\w*|cuando esta|cuando la tienen|cuando la entregan|tiempo de entrega|para cuando|en cuanto la|cuando estaria)/u', $t)) return 'plazos';
    if (preg_match('/\b(como se paga\w*|formas? de pago|medios? de pago|se puede pagar|transferencia\w*|mercado pago|en cuotas|senia|sena)\b/u', $t)) return 'pago';
    // Estas van ANTES de hosting a proposito: la palabra 'dominio' aparece en
    // varias de ellas y, si no, todas caian en la respuesta de hosting.
    if (preg_match('/\b(bilingue|dos idiomas|en ingles|version en ingles|multi ?idioma|traducida|traduccion de la web)\b/u', $t)) return 'bilingue';
    // Está comparando o le pasaron otro precio: no se contesta con el precio de
    // nuevo, se contesta corriendo la comparación a qué incluye cada uno.
    if (preg_match('/\b(estoy (viendo|mirando|averiguando|comparando)|ando (viendo|mirando|averiguando)|comparando (precios?|presupuestos?)|pidiendo (otros )?presupuestos?|me pasaron (otro|un)|otro me (cobra|paso|hace)|mas barato en otro|vi otro (mas barato|presupuesto))\b/u', $t)) return 'comparando';
    if (preg_match('/\b(responsive|es adaptable|se adapta al (celular|telefono|movil))\b/u', $t)
        || (preg_match('/\b(celular|celulares|telefono|movil|mobile|tablet)\b/u', $t)
            && preg_match('/\b(se ve|se abre|se adapta|funciona|anda|entra|entran|sirve|queda|visualiza)\b/u', $t))) return 'responsive';
    if (preg_match('/\b(no se nada de|no entiendo nada de|no manejo|no soy de|soy (un )?desastre con)\b.{0,24}\b(paginas?|web|compu|tecnologia|sistemas|internet)\b/u', $t)) return 'no_se_nada';
    if (preg_match('/\b(no tengo logo|sin logo|no cuento con logo|todavia no tengo logo|logo no tengo)\b/u', $t)) return 'sin_logo';
    if (preg_match('/\b(no tengo (buenas )?fotos|sin fotos|fotos no tengo|no tengo imagenes|no cuento con fotos|malas fotos)\b/u', $t)) return 'sin_fotos';
    if (preg_match('/\b(la muestra (ya )?es mi (pagina|web)|la demo (ya )?es (mi|la) (pagina|web)|esa (ya )?seria mi (pagina|web)|la muestra queda(ria)? (como|de) (mi|la) (pagina|web))\b/u', $t)) return 'muestra_no_es_final';
    if (preg_match('/\b(es segura|es seguro|ssl|https|certificado de seguridad|me pueden hackear|la pueden hackear|seguridad de la (web|pagina))\b/u', $t)) return 'seguridad';
    if (preg_match('/\b(salgo en google|aparecer en google|aparezco en google|posicionamiento|seo|google me encuentra|salir primero en google)\b/u', $t)) return 'google';
    if (preg_match('/\b(google maps|el mapa|poner (el|un) mapa|ubicacion en el mapa|maps)\b/u', $t)) return 'maps';
    if (preg_match('/\b(empezar (simple|basico|de a poco)|arrancar (simple|con lo basico)|despues (le )?(agrego|sumo|amplio)|ampliar (mas )?adelante|sumar (despues|mas adelante)|escalar (despues|mas adelante))\b/u', $t)) return 'ampliar_despues';
    if (preg_match('/\b(que (necesitan|necesitas|precisan) de mi|que (te|les) tengo que (mandar|pasar|dar)|que datos (necesitan|precisan|hacen falta)|que me (van a )?pedir)\b/u', $t)) return 'que_necesitan';
    if (preg_match('/\b(sos (un |una )?(bot|robot|ia|inteligencia artificial|maquina)|eres (un |una )?(bot|robot|ia)|hablo con (un )?(bot|robot|una maquina)|esto es (un )?(bot|automatico)|sos (una )?persona)\b/u', $t)) return 'soy_bot';
    // "encuentas" y "formulaios" son typos reales de producción: se toleran las
    // variantes con una letra cambiada de las dos palabras clave.
    if (preg_match('/\b(formulari\w*|formulaio\w*|encuesta\w*|encuenta\w*|encusta\w*|cuestionario\w*|planillas? para (llenar|completar))\b/u', $t)) return 'formularios';
    if (preg_match('/\b(migracion|migrar|migran|pasar (mis|los) (contenidos?|textos?|datos)|traspasar (el )?contenido|mudar (la|mi) (web|pagina))\b/u', $t)) return 'migracion';
    if (preg_match('/\b(inscripto|inscripcion|monotributo|monotributista|afip|arca|factura\w*|cuit|habilitacion municipal)\b/u', $t)) return 'inscripcion';
    if (preg_match('/\b(exclusiv\w*|diseno unico|copian y pegan|copian el diseno|mismo diseno|le copian|reciclan el diseno|plantilla repetida)\b/u', $t)) return 'exclusividad';
    // "¿Tienen alguna web para ver de dentista?" pide ejemplos, no el portfolio
    // general de que_hacemos: exige el verbo de mostrar junto al sustantivo.
    if (preg_match('/\b(ejemplos?|muestras? de trabajo|portfolio|porfolio|trabajos (que |ya )?(hicieron|realizados|hechos)|casos? de exito)\b/u', $t)
        || preg_match('/\b(tienen|tenes|tienes|hay|puedo ver|me (pasas|mandas)|mostrarme|ver alguna)\b.{0,30}\b(web|pagina|sitio|demo)\b.{0,40}\b(para ver|de otro|de algun|parecida|similar|del rubro|hecha)\b/u', $t)
        // "¿Tenés alguna para ver de algún cirujano?" — el sustantivo se elide
        // porque la web ES el tema de toda la charla: alcanza con pedir ver
        // alguna "de" un rubro (caso Oscar, 21-ago).
        || preg_match('/\b(tenes|tienes|tienen|hay|me mostras|puedo ver)\b.{0,12}\b(alguna|alguno|algunas?)\b.{0,15}\b(para ver|ver)\b.{0,15}\bde\b/u', $t)) return 'ejemplos';
    if (preg_match('/\b(lleva|llevan|tiene|tienen|incluye|incluyen|van)\b.{0,20}\b(imagen|imagenes|foto|fotos)\b/u', $t)) return 'imagenes_web';
    if (preg_match('/\b(correos? corporativos?|casillas? de correo|mail corporativo|mails? corporativos?|cuentas? de (correo|mail)|arroba mi dominio|outlook|configurar el mail)\b/u', $t)) return 'emails';
    if (preg_match('/\b(licencias?|plugins?|sdk|plantillas? compradas?|temas? comprados?)\b/u', $t)) return 'licencias';
    if (preg_match('/\b(manual|instructivo|tutorial|capacitacion para usar|como la actualizo|actualizar (los )?textos|me ensenan a)\b/u', $t)) return 'manual';
    if (preg_match('/\b(backup|respaldo|copia de seguridad|me entregan el codigo|entregan el codigo|codigo fuente|base de datos|acceso a la base)\b/u', $t)) return 'entrega_codigo';
    // Editar productos va ANTES que titularidad porque el objeto no deja lugar a
    // dudas: "añadir artículos" es el panel, no de quién es el dominio. Importa
    // en las preguntas que traen las dos cosas juntas ("¿puedo añadir artículos
    // y a futuro vender mi dominio?"), donde lo que el bot dejó sin contestar
    // fue justamente la parte de los productos.
    if (preg_match('/\b(agregar|agregarle|añadir|anadir|sumar|cargar|cargarle|subir|subirle|sacar|sacarle|quitar|quitarle|restar|restarle|borrar|eliminar|modificar|modificarle|editar|actualizar|cambiar|administrar|manejar)\b.{0,30}\b(producto|productos|articulo|articulos|item|items|precio|precios|foto|fotos|contenido|publicacion|publicaciones|propiedad|propiedades|curso|cursos|catalogo)\b/u', $t)
        || preg_match('/\b(producto|productos|articulo|articulos|precio|precios|catalogo)\b.{0,30}\b(los cargo|las cargo|lo cargo|los subo|los edito|las edito|los modifico|los administro|los manejo|puedo cargar|puedo subir|puedo editar|puedo modificar|puedo agregar|puedo sacar)\b/u', $t)) return 'carga';
    // "¿Puedo vender mi dominio a futuro?" es una pregunta por la titularidad,
    // no por la renovación: sin esto caía en hosting y le contestaban el precio
    // anual (caso real del 21-ago).
    if (preg_match('/\b(a mi nombre|a nombre de quien|de quien queda|quien es el titular|titularidad|dueno del dominio|el dominio es mio|queda a mi nombre)\b/u', $t)
        || preg_match('/\b(vender|venderlo|venderla|transferir|traspasar|ceder|pasarlo a otro|cambiar de dueno)\b.{0,25}\b(dominio|la web|la tienda|el sitio|la pagina)\b/u', $t)
        || preg_match('/\b(dominio|la web|la tienda|el sitio|la pagina)\b.{0,25}\b(a mi nombre|es mio|me pertenece|puedo venderl|lo puedo vender|la puedo vender)/u', $t)) return 'titularidad';
    if (preg_match('/\b(cpanel|c panel|ftp|sftp|panel del hosting|panel de control|acceso al hosting|accesos? al servidor|credenciales|usuario y contrasena)\b/u', $t)) return 'accesos';
    if (preg_match('/\b(search console|google search)\b/u', $t)) return 'pixel';
    // "¿Usan WordPress?" es una pregunta por la tecnología; "¿tengo acceso al
    // administrador tipo WordPress?" es por el panel. Solo la segunda va a carga.
    if (preg_match('/\b(gestor de contenidos|administrador de la web|panel de administracion|panel administrador|back ?office)\b/u', $t)
        || preg_match('/\b(acceso al|entran al|tengo|hay un|tiene)\b.{0,20}\b(wordpress|joomla|administrador)\b/u', $t)) return 'carga';
    // "Modificarle a la tienda" es ambiguo —puede ser editarla o venderla— así
    // que va DESPUÉS de titularidad: "cambiar de dueño la tienda" tiene que
    // seguir contestando de quién es, no cómo se edita.
    if (preg_match('/\b(agregarle|añadir|anadir|cargar|cargarle|subir|subirle|sacarle|quitarle|restarle|modificar|modificarle|editar|actualizar|administrar|manejar|retocar)\b.{0,25}\b(la tienda|mi tienda|la pagina|mi pagina|el sitio|mi sitio|la web|mi web)\b/u', $t)) return 'carga';
    if (preg_match('/\bhostin|\b(dominio\w*|servidor\w*|el punto com|puntocom|la direccion web)\b/u', $t)) return 'hosting';
    if (preg_match('/\b(hacen paginas?|crean paginas?|hacen webs?|hacen sitios|disenan paginas?|hacen las paginas)\b/u', $t)) return 'que_hacemos';
    if (preg_match('/\b(sin internet|se corta (el )?internet|sin conexion|funciona offline|no tengo internet|sin senal|sin wifi)\b/u', $t)) return 'internet';
    if (preg_match('/\b(estafa\w*|es seguro esto|son confiables|es confiable|quiero referencias|garantia de que)\b|desconfi/u', $t)) return 'confianza';
    if (preg_match('/\b(pixel|google analytics|analytics|codigo de seguimiento|conversiones de meta)\b/u', $t)) return 'pixel';
    if (preg_match('/\b(precios? de cada|todos los precios|lista de precios|precios? de los servicios|desde el basico|precios? de todos)\b/u', $t)) return 'rangos';
    // "Preciop" al final del mensaje es "precio" con el dedo resbalado: la
    // palabra suelta pidiendo el valor (con hasta dos letras de yapa) cuenta.
    if (preg_match('/\b(cuanto (sale|cuesta|esta|vale|saldria|seria)|que precio|que valor|cual (es|era) el precio|precio total|el precio final|precio tiene|valor tiene)\b/u', $t)
        || preg_match('/\bprecio\w{0,2}\s*$/u', $t)) {
        if (in_array($fase, ['precio', 'confirma_cambio', 'derivado', 'postdemo'], true)) return 'precio_actual';
        // Sin saber qué tipo de web necesita no hay precio exacto: se le pregunta
        // en vez de escaparse con "eso te lo confirma el equipo" (caso Abel).
        if (in_array($fase, ['nuevo', 'menu', 'algo_diferente'], true)) return 'precio_sin_rubro';
    }
    if (preg_match('/\b(quien carga|cargan ustedes|carga de productos|subir los productos|cargar el contenido|los textos los)\b/u', $t)) return 'carga';

    // Ya tiene una web propia (la hizo otro, está en WordPress): se ofrece
    // revisarla en vez de empujar el reemplazo. Tiendanube, Shopify y Wix NO
    // entran acá a propósito: no trabajamos sobre esas plataformas y ya tienen
    // su respuesta en la objeción de alquiler mensual (menciona_plataforma).
    if (preg_match('/\b(wordpress|woocommerce)\b/u', $t)
        && !preg_match('/\b(que tecnologia|con que (lo|la) hacen|usan|trabajan con)\b/u', $t)) return 'ya_tiene_plataforma';
    if (preg_match('/\b(ya tengo (una |mi )?(pagina|web|sitio)|tengo (una |mi )?(pagina|web|sitio) (hecha|armada|actual|vieja)|mi (pagina|web) actual)\b/u', $t)) return 'ya_tiene_plataforma';
    // Palabras completas: "catálogo" contiene "logo" como substring y no es
    // una consulta sobre identidad visual.
    if (preg_match('/(?:^|\s)(?:logo|isotipo|identidad|marca grafica)(?:\s|$)/u', $t)) return 'logo';
    if (preg_match('/\b(publicidad|marketing|pauta|anuncios|posteos|redes sociales|(hacen|manejan|llevan) (las )?redes|community)\b/u', $t)) return 'marketing';
    if (preg_match('/\b(de donde son|donde estan|donde quedan|en que (ciudad|provincia|zona|localidad)|son de (aca|argentina)|tienen (oficina|local|sucursal)|puedo ir|nos podemos ver|donde los ubico|de que (ciudad|provincia|pais))\b/u', $t)) return 'ubicacion';
    if (preg_match('/\b(reunion|videollamada|llamada|nos juntamos|zoom|meet)\b/u', $t)) return 'reuniones';
    if (preg_match('/\b(wordpress|con que lo hacen|que tecnologia|codigo)\b/u', $t)) return 'tecnologia';
    if (preg_match('/\b(como (se )?manejan|como trabajan|como es el proceso|como sigue|como funciona el trabajo)\b/u', $t)) return 'proceso';

    return null;
}

function wabot_desempate_por_palabras($fase, $texto) {
    $t = ' ' . wabot_normalizar_frase($texto) . ' ';
    if (trim($t) === '') return null;
    // Frase suelta o palabra entera. Se busca cada patrón rodeado de espacios,
    // así "web" no matchea "webcam" pero "por la web" sí.
    $tiene = function ($patrones) use ($t) {
        foreach ($patrones as $p) if (mb_strpos($t, ' ' . $p . ' ') !== false) return true;
        return false;
    };
    // Las respuestas de "orden" ("la primera", "la segunda", "lo primero") se
    // resuelven por la posición en que la pregunta ofrece las opciones: en las
    // tres preguntas, la PRIMERA opción es la web completa y la SEGUNDA la simple.
    $primera = ['la primera', 'la primer', 'lo primero', 'la 1', 'opcion 1', 'la primera opcion', 'el primero', 'la uno', 'la a'];
    $segunda = ['la segunda', 'lo segundo', 'la 2', 'opcion 2', 'la segunda opcion', 'el segundo', 'la dos', 'la b', 'la otra'];

    // Las negaciones ganan: "sin carrito" no es "carrito", "no quiero vender" no es "vender".
    $niega = $tiene(['sin carrito', 'sin cobro', 'sin tienda', 'sin venta', 'sin turnos', 'sin plataforma',
                     'no quiero vender', 'no vender', 'no cobrar', 'no me interesa vender', 'no hace falta vender',
                     'nada de carrito', 'nada de cobro', 'no quiero cobrar', 'no vendo online']);
    if ($niega) {
        if ($fase === 'desempate_comercio') return 'comercio_mostrar';
        if ($fase === 'desempate_turnos')   return 'turnos_no';
        if ($fase === 'desempate_cursos')   return 'cursos_mostrar';
    }

    switch ($fase) {
        case 'desempate_comercio':
            if ($tiene(array_merge($primera, [
                'vender', 'venderlos', 'venderlas', 'venta', 'ventas', 'carrito', 'tienda', 'online',
                'ecommerce', 'e commerce', 'cobrar', 'cobro', 'comprar', 'compren', 'compras',
                'por la web', 'por la pagina', 'desde la web', 'desde la pagina', 'en la web', 'en la pagina',
                'por internet', 'por la pag', 'la web', 'la pagina', 'que compren', 'pagar', 'paguen',
                'mercado pago', 'con pago', 'todo online', 'la completa', 'la tienda',
                // "Botón de pago y pedido integrado a WhatsApp" es ecommerce
                // dicho con otras palabras (caso MILANEL): el "whatsapp" del
                // final lo mandaba a catálogo porque estas señales no estaban.
                'boton de pago', 'con boton', 'pedido integrado', 'pedidos integrados',
                'gestionar las ventas', 'gestionar ventas', 'gestion de ventas', 'checkout',
                // "Cotizame ambas": quiere las dos → se cotiza la completa, que
                // incluye a la otra (caso Distribuidora, que la pidió 3 veces).
                'ambas', 'ambos', 'las dos', 'los dos', 'las 2', 'los 2', 'las dos opciones',
            ]))) return 'comercio_vender';
            if ($tiene(array_merge($segunda, [
                'mostrar', 'muestre', 'mostrarlos', 'mostrarlas', 'catalogo', 'catálogo', 'presentacion', 'presentar', 'contacten', 'contacto',
                'whatsapp', 'wsp', 'wp', 'informativa', 'solo mostrar', 'que me escriban', 'me escriban',
                'escriban', 'que me hablen', 'me contacten', 'la simple', 'la basica', 'sin carrito',
                'sin cobro', 'nomas', 'solamente mostrar', 'que muestre',
                // "Quiero publicar los vehículos" es una respuesta clarísima que
                // el bot repreguntaba (caso Black Automotores, 22-ago): publicar,
                // exhibir o listar es mostrar, no cobrar online.
                'publicar', 'publicarlos', 'publicarlas', 'publico', 'publicamos',
                'exhibir', 'exhibirlos', 'listar', 'subir los productos', 'subirlos',
                'que se vean', 'para que vean', 'ver los modelos', 'los vehiculos',
                'las propiedades', 'los productos', 'mi stock', 'el stock',
            ]))) return 'comercio_mostrar';
            return null;
        case 'desempate_hibrido':
            if ($tiene([
                'vender online', 'vender por la web', 'vender desde la web', 'tienda online', 'ecommerce',
                'e commerce', 'carrito', 'cobro online', 'cobrar online', 'que compren', 'que paguen',
            ])) return 'hibrido_vender';
            if ($tiene([
                'catalogo', 'catálogo', 'modelos', 'productos', 'exhibir modelos', 'mostrar modelos',
                'catalogo por whatsapp', 'catalogo con whatsapp', 'lista de productos',
                'publicar', 'publicarlos', 'exhibir', 'listar', 'que se vean',
            ])) return 'hibrido_catalogo';
            if ($tiene([
                'mostrar trabajos', 'mostrar los trabajos', 'mostrar el trabajo', 'mostrar nuestros trabajos',
                'trabajos realizados', 'portfolio', 'portafolio', 'obras', 'proyectos',
                'recibir consultas', 'pedir presupuesto', 'cotizacion', 'cotizaciones', 'que me contacten',
                'que me consulten', 'me consulten', 'que consulten', 'que pregunten',
                'que me escriban', 'presentar la empresa', 'mostrar lo que hacemos',
            ])) return 'hibrido_trabajos';
            return null;
        case 'desempate_turnos':
            if ($tiene(array_merge($primera, [
                'solos', 'online', 'desde la web', 'desde la pagina', 'por la web', 'por la pagina', 'en la web',
                'reserven', 'reservar', 'reserva', 'saquen', 'sacar turno', 'saquen turno', 'agenda', 'calendario',
                'sistema de turnos', 'con turnos', 'que elijan', 'elijan', 'automatico', 'la completa',
            ]))) return 'turnos_si';
            if ($tiene(array_merge($segunda, [
                'whatsapp', 'wsp', 'wp', 'escriban', 'me escriban', 'que me escriban', 'agendo yo', 'los agendo',
                'lo agendo', 'no hace falta', 'sin turnos', 'alcanza', 'me hablen', 'me contacten', 'la simple',
                'yo los agendo', 'a mano', 'por mensaje',
            ]))) return 'turnos_no';
            return null;
        case 'desempate_cursos':
            if ($tiene(array_merge($primera, [
                'vender', 'venderlos', 'venta', 'plataforma', 'videos', 'video', 'acceso', 'alumnos', 'online', 'desde la web', 'por la web', 'en la web', 'cobrar', 'cobro', 'que compren', 'la completa', 'campus', 'autogestionable', 'autogestion', 'auto gestionable', 'gestionable', 'subir los videos', 'subir videos', 'con acceso', 'usuarios', 'que se inscriban', 'inscribirse', 'que se manejen solos']))) return 'cursos_vender';
            if ($tiene(array_merge($segunda, [
                'mostrar', 'mostrarlos', 'contacten', 'me contacten', 'whatsapp', 'wsp', 'presentar', 'informativa',
                'que me escriban', 'me escriban', 'solo mostrar', 'la simple',
            ]))) return 'cursos_mostrar';
            return null;
    }
    return null;
}

define('WABOT_PRODUCTOS_MIN', 1);
define('WABOT_PRODUCTOS_MAX', 5000);

function wabot_numero_escrito($palabra) {
    $mapa = [
        'dos' => 2, 'tres' => 3, 'cuatro' => 4, 'cinco' => 5,
        'seis' => 6, 'siete' => 7, 'ocho' => 8, 'nueve' => 9, 'diez' => 10, 'once' => 11,
        'doce' => 12, 'quince' => 15, 'veinte' => 20, 'veinticinco' => 25, 'treinta' => 30,
        'cuarenta' => 40, 'cincuenta' => 50, 'sesenta' => 60, 'setenta' => 70, 'ochenta' => 80,
        'noventa' => 90, 'cien' => 100, 'ciento' => 100, 'doscientos' => 200, 'trescientos' => 300,
        'quinientos' => 500, 'mil' => 1000,
    ];
    return $mapa[$palabra] ?? null;
}

function wabot_extraer_cantidad_productos($texto) {
    $crudo = (string)$texto;
    if (trim($crudo) === '') return null;

    $crudo = preg_replace('/(\d)[.\s](\d{3})\b/', '$1$2', $crudo);
    $crudo = preg_replace('/\$\s*\d+/', ' ', $crudo);
    $crudo = preg_replace('/\b\d+\s*(pesos?|mil|lucas|k|usd|dolares?)\b/iu', ' ', $crudo);

    if (preg_match('/(\d{1,5})\s*(productos?|articulos?|modelos?|items?|prendas?|especies?|referencias?)\b/iu', $crudo, $mAd)) {
        $n = (int)$mAd[1];
        if ($n >= WABOT_PRODUCTOS_MIN && $n <= WABOT_PRODUCTOS_MAX) return $n;
    }
    if (preg_match('/\b(productos?|articulos?|modelos?|items?|prendas?)\b[^0-9]{0,20}(\d{1,5})/iu', $crudo, $mAd2)) {
        $n = (int)$mAd2[2];
        if ($n >= WABOT_PRODUCTOS_MIN && $n <= WABOT_PRODUCTOS_MAX) return $n;
    }

    $numeros = [];
    if (preg_match_all('/\d{1,5}/', $crudo, $m)) {
        foreach ($m[0] as $n) $numeros[] = (int)$n;
    }
    if (!$numeros) {
        foreach (preg_split('/\s+/', wabot_normalizar_frase($crudo)) as $palabra) {
            $n = wabot_numero_escrito($palabra);
            if ($n !== null) $numeros[] = $n;
        }
    }

    $plausibles = array_values(array_filter($numeros, function ($n) {
        return $n >= WABOT_PRODUCTOS_MIN && $n <= WABOT_PRODUCTOS_MAX;
    }));
    if (!$plausibles) return null;

    return max($plausibles);
}

function wabot_desempate_desvio($acc, $out, $texto, &$conv, $cfg) {
    $r = wabot_rubro_de($acc);
    $d = wabot_desempate_de($r);
    if ($d && $d[0] !== $conv['fase']) {
        $conv['fase'] = $d[0];
        wabot_handoff_aclaracion_resuelta($conv);
        $out[] = $d[0] === 'sistema_problema' ? wabot_sistema_texto('problema', $cfg) : $cfg[$d[1]];
    }
    elseif ($r !== null && $d === null) { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); }
    elseif (!$out)                      { return wabot_handoff_intentar($texto, $conv, $cfg); }
    return $out;
}

/**
 * El plan de mantenimiento que le corresponde según el tipo cotizado.
 * Landing tiene su propio precio y su propio link; todo lo demás va al plan
 * completo. Si todavía no cotizamos nada, se dicen los dos: prometer $10.000
 * y cotizarle después una web que paga $15.000 es regalar un reclamo.
 */
function wabot_texto_mantenimiento($conv, $cfg) {
    $planes = $cfg['mantenimiento_planes'] ?? [];
    $base   = (string)($cfg['info']['mantenimiento'] ?? '');

    if (empty($conv['tipo'])) {
        $l = $planes['landing'] ?? null;
        $o = $planes['otros'] ?? null;
        if ($l && $o) {
            return str_replace(['{precio}', '{link}'],
                [$l['precio'] . ' (landing) o ' . $o['precio'] . ' (el resto de las webs)', $o['link']], $base);
        }
    }

    $clave = ($conv['tipo'] ?? '') === 'landing' ? 'landing' : 'otros';
    $plan  = $planes[$clave] ?? $planes['otros'] ?? null;
    if (!$plan) return $base;
    return str_replace(['{precio}', '{link}'], [$plan['precio'], $plan['link']], $base);
}

/** Un texto de info con sus placeholders resueltos. */
function wabot_texto_info($clave, $cfg) {
    $texto = (string)($cfg['info'][$clave] ?? '');
    if ($clave === 'bilingue') {
        return str_replace('{precio}', (string)($cfg['adicional_bilingue'] ?? ''), $texto);
    }
    return $texto;
}

/** Hosting: responde también qué pasa al terminar el primer año incluido. */
function wabot_texto_hosting($conv, $cfg) {
    $base = trim((string)($cfg['info']['hosting'] ?? ''));
    $renovacion = trim((string)($cfg['hosting_renovacion'] ?? ''));
    if ($renovacion === '') return $base;
    if (mb_stripos($base, $renovacion) !== false) return $base;
    return trim($base . "\n" . $renovacion);
}

function wabot_texto_pago($conv, $cfg) {
    $tipo = $conv['tipo'] ?? '';
    $datosTipo = $cfg['tipos'][$tipo] ?? [];
    $sena = $datosTipo['sena'] ?? '';
    if ($sena === '' || empty($conv['precio_dado'])) {
        $generico = trim((string)($cfg['info']['pago_generico'] ?? ''));
        if ($generico !== '') return $generico;
        return 'Se puede abonar por transferencia o con tarjeta hasta en 12 cuotas con interés. Para arrancar se deja una seña y el saldo al entregar la web.';
    }
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) > 0) {
        $d = wabot_catalogo_total((int)$conv['productos_cantidad'], $cfg);
        $plantillaCat = (string)($cfg['info']['pago_catalogo']
            ?? "El total cotizado es {precio}. Se abona por transferencia, con una seña de {sena} para arrancar y el saldo al entregar la web, o con tarjeta hasta en 12 cuotas con interés: el valor de cada cuota lo calcula la tarjeta sobre el total.");
        return str_replace(['{precio}', '{sena}'], [wabot_moneda($d['total']), $sena], $plantillaCat);
    }
    $cuotas = $datosTipo['cuotas'] ?? [];
    return str_replace(
        ['{precio}', '{sena}', '{cuotas_12}', '{cuotas_6}', '{cuotas_3}'],
        [(string)($datosTipo['precio'] ?? ''), $sena, $cuotas['12'] ?? '', $cuotas['6'] ?? '', $cuotas['3'] ?? ''],
        (string)($cfg['info']['pago'] ?? '')
    );
}

/** Elige una variante estable por conversación; precios y links siguen exactos. */
function wabot_plantilla_variante($clave, $claveVariantes, $conv, $cfg) {
    $base = (string)($cfg[$clave] ?? '');
    // Los tests y llamadas internas sin conversación real conservan la plantilla
    // editable principal. En producción, chat_started_ts existe desde el ingreso.
    if ((int)($conv['chat_started_ts'] ?? 0) <= 0) return $base;
    $variantes = array_values(array_filter((array)($cfg[$claveVariantes] ?? []), function ($v) {
        return is_string($v) && trim($v) !== '';
    }));
    if (!$variantes) return $base;
    $semilla = wabot_conversation_key($conv) . '|' . (string)($conv['session_id'] ?? '') . '|' . $clave;
    $indice = hexdec(substr(hash('sha256', $semilla), 0, 8)) % count($variantes);
    return $variantes[$indice];
}

/* Arma el mensaje de precio del tipo y fija la fase. */
/**
 * Devuelve DOS mensajes: el precio con el link, y el ofrecimiento del
 * prediseño. Van separados a propósito, con una pausa en el medio, porque el
 * precio necesita su momento antes de que llegue la oferta.
 */
/* ───────────────────── Parte 2: después de la demo ─────────────────────
 *
 * Presentada la demo, el bot deja de "estar cerrado" y pasa a cerrar la venta:
 * aclara dudas, pasa la seña y los datos de transferencia, arma el link de
 * tarjeta y —si el cliente duda— ofrece la videollamada con Pablo. Todo esto
 * NO existe antes de la demo: es lo que separa la parte 1 de la parte 2.
 */

/** La seña que corresponde al tipo cotizado, ya formateada. */
function wabot_sena_de($conv, $cfg) {
    $tipo = (string)($conv['tipo'] ?? '');
    return trim((string)($cfg['tipos'][$tipo]['sena'] ?? ''));
}

function wabot_postdemo_transferencia($conv, $cfg) {
    $sena = wabot_sena_de($conv, $cfg);
    if ($sena === '') return (string)($cfg['info']['pago_generico'] ?? '');
    return str_replace(
        ['{sena}', '{cbu}', '{alias}', '{titular}', '{documento}'],
        [$sena, (string)($cfg['pago_cbu'] ?? ''), (string)($cfg['pago_alias'] ?? ''),
         (string)($cfg['pago_titular'] ?? ''), (string)($cfg['pago_documento'] ?? '')],
        (string)($cfg['postdemo_transferencia'] ?? '')
    );
}

/** Link de checkout por el monto de la seña: gokywebs.com/pago?monto=60000 */
function wabot_postdemo_link_tarjeta($conv, $cfg) {
    $sena = wabot_sena_de($conv, $cfg);
    $monto = (int)preg_replace('/\D/', '', $sena);
    if ($monto <= 0) return '';
    return str_replace(
        ['{sena}', '{link}'],
        [$sena, (string)($cfg['pago_link_base'] ?? 'gokywebs.com/pago?monto=') . $monto],
        (string)($cfg['postdemo_tarjeta'] ?? '')
    );
}

/** ¿Está avisando que ya pagó? Se valida con el texto, no con una etiqueta. */
function wabot_dice_que_pago($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(ya )?(te )?(hice|realice|mande|envie|deposite|pague|abone|transferi)\b.{0,25}\b(transferencia|deposito|pago|seña|sena|plata)\b/u', $t)
        || preg_match('/\b(ya )?(te )?(transferi|deposite|pague|abone)\b/u', $t)
        || preg_match('/\b(listo|hecho|ya esta)\b.{0,20}\b(transferencia|transferi|pague|deposito|deposite)\b/u', $t)
        || preg_match('/\bcomprobante\b/u', $t)
    );
}

/** Después de ver la demo, quiere avanzar: pide el próximo paso o le gustó. */
function wabot_postdemo_quiere_avanzar($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    if (wabot_es_afirmativa($texto)) return true;
    return (bool)(
        preg_match('/\bcomo\b.{0,12}\b(sigo|seguimos|sigue|hago|hacemos|arranco|arrancamos|procedo|avanzo|avanzamos|continuo)\b/u', $t)
        || preg_match('/\b(que|cual)\b.{0,15}\b(paso|pasos|siguiente|sigue ahora)\b/u', $t)
        || preg_match('/\b(quiero|queremos|vamos a|listo para)\b.{0,20}\b(avanzar|arrancar|empezar|contratar|seguir|hacerla|comprarla)\b/u', $t)
        || preg_match('/\b(me gusto|me encanto|me gusta|quedo (muy )?(bien|linda|buena|barbara)|esta (muy )?(buena|linda|barbara)|buenisima|espectacular|hermosa)\b/u', $t)
        || preg_match('/\b(dale|listo)\b.{0,20}\b(avanzamos|arrancamos|seguimos|vamos)\b/u', $t)
    );
}

/**
 * "Dale, la voy a mirar" — la respuesta más común después de mandar la demo, y
 * la que más ventas se lleva puestas. No es un no, pero tampoco es un sí: no se
 * presiona, se deja la puerta abierta y se vuelve más tarde (dentro de la
 * ventana de 24 h de Meta, que es lo único que permite escribir sin plantilla).
 */
function wabot_postdemo_la_va_a_mirar($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 90) return false;
    return (bool)(
        preg_match('/\b(la|lo|los|las)\b.{0,12}\b(voy a|vamos a)\b.{0,8}\b(mirar|ver|revisar|chequear|leer)\b/u', $t)
        || preg_match('/\b(ahora|despues|luego|mas tarde|en un rato|cuando pueda)\b.{0,20}\b(la|lo)\b.{0,8}\b(miro|veo|reviso|chequeo)\b/u', $t)
        || preg_match('/\b(la|lo)\b.{0,8}\b(miro|veo|reviso|chequeo)\b.{0,20}\b(despues|luego|mas tarde|en un rato|tranquilo|con calma|y te digo|y te aviso|y te cuento)\b/u', $t)
        || preg_match('/\b(dejame|deja que)\b.{0,10}\b(la|lo)\b.{0,8}\b(mire|vea|revise)\b/u', $t)
        || preg_match('/\b(le doy una mirada|le echo un vistazo|la reviso bien)\b/u', $t)
    );
}

/** Objeción de plata en la parte 2: es donde entran las 3 cuotas sin interés. */
function wabot_postdemo_objecion_plata($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(es caro|muy caro|carisimo|es mucha plata|es mucho|se me va de presupuesto|no me da el presupuesto)\b/u', $t)
        || preg_match('/\b(no tengo|no cuento con)\b.{0,20}\b(plata|dinero|presupuesto|fondos)\b/u', $t)
        || preg_match('/\bno puedo\b.{0,20}\b(pagar|afrontar|de una)\b/u', $t)
        || preg_match('/\b(junto|reuno|consigo)\b.{0,15}\b(la plata|el dinero)\b/u', $t)
    );
}

/** Duda, lo tiene que pensar o desconfía: es cuando entra la videollamada. */
function wabot_postdemo_duda($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(lo tengo que pensar|lo pienso|tengo que pensarlo|dejame pensarlo|lo voy a pensar|lo consulto|lo hablo con)\b/u', $t)
        || preg_match('/\b(no se|no estoy segur|tengo dudas|me da cosa|desconfi|no me convence|dudo)\b/u', $t)
        || preg_match('/\b(y si|que pasa si)\b.{0,30}\b(no me gusta|sale mal|no funciona|no cumplen)\b/u', $t)
    );
}

/** Pidió pagar con tarjeta en vez de transferencia. */
function wabot_prefiere_tarjeta($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match('/\b(tarjeta|credito|debito|cuotas|link de pago|mercado ?pago|pasame el link)\b/u', $t);
}

function wabot_precio_resumen($conv, $cfg) {
    $tipo = (string)($conv['tipo'] ?? '');
    if ($tipo === '' || empty($conv['precio_dado']) || !isset($cfg['tipos'][$tipo])) {
        return (string)($cfg['info']['rangos'] ?? $cfg['info']['otra']);
    }
    $t = $cfg['tipos'][$tipo];
    $precio = (string)($t['precio'] ?? '');
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) > 0) {
        $d = wabot_catalogo_total((int)$conv['productos_cantidad'], $cfg);
        $precio = wabot_moneda($d['total']);
    }
    $plantilla = (string)($cfg['precio_resumen']
        ?? "El total es {precio} por todo el desarrollo, con una seña de {sena} para arrancar y el saldo al entregar la web.\nEl detalle completo está acá: {link}");
    return str_replace(['{precio}', '{sena}', '{link}'],
        [$precio, (string)($t['sena'] ?? ''), (string)($t['link'] ?? '')], $plantilla);
}

function wabot_aporta_descripcion($texto) {
    $t = trim((string)$texto);
    if (mb_strlen($t) < 12) return false;
    if (wabot_es_acuse($t) || wabot_es_negativa($t)) return false;
    return preg_match_all('/\p{L}/u', $t) >= 8;
}

function wabot_pitch_texto($tipo, $conv, $cfg) {
    $t = $cfg['tipos'][$tipo] ?? [];
    $desc = trim((string)($t['desc'] ?? ''));
    if ($desc === '') $desc = 'tu web a medida, diseñada para tu negocio';

    $yaConto = mb_strlen(trim((string)($conv['descripcion'] ?? ''))) >= 25
               && !wabot_descripcion_generica((string)($conv['descripcion'] ?? ''));
    $clave = $yaConto ? 'pitch_pregunta_2' : 'pitch_pregunta';
    $pregunta = trim((string)($t[$clave] ?? $t['pitch_pregunta'] ?? ''));

    $base = (string)($cfg['msg_pitch'] ?? '');
    return trim(str_replace(['{desc}', '{pregunta}'], [$desc, $pregunta], $base));
}

function wabot_pitch_corresponde($tipo, $conv, $cfg) {
    if (empty($cfg['pitch_activo'])) return false;
    if (!empty($conv['pitch_hecho']) || !empty($conv['precio_dado'])) return false;
    if (!empty($conv['demo_pedida_entrada'])) return false;
    if (!empty($conv['pidio_precio'])) return false;
    return trim((string)($cfg['tipos'][$tipo]['pitch_pregunta'] ?? '')) !== '';
}

function wabot_pitch($tipo, &$conv, $cfg) {
    $conv['tipo'] = $tipo;
    $conv['fase'] = 'pitch';
    $conv['pitch_hecho'] = true;
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'pitch_dado', ['tipo' => $tipo]);
    return [wabot_pitch_texto($tipo, $conv, $cfg)];
}

function wabot_precio($tipo, &$conv, $cfg) {
    if (wabot_pitch_corresponde($tipo, $conv, $cfg)) {
        return wabot_pitch($tipo, $conv, $cfg);
    }
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) <= 0) {
        return wabot_catalogo_preguntar($conv, $cfg);
    }
    if (!empty($conv['precio_dado']) && ($conv['tipo'] ?? '') === $tipo && !empty($conv['cta_muestra'])) {
        return [wabot_precio_resumen($conv, $cfg)];
    }

    $conv['tipo'] = $tipo;
    $conv['fase'] = 'precio';
    $conv['precio_dado'] = true;
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);

    $out = [wabot_msg_precio_texto($tipo, $cfg, $conv)];
    // El que entró diciendo "quiero mi demo gratis" ya contestó que sí:
    // preguntarle de nuevo es no haberlo escuchado. Directo a los datos.
    if (!empty($conv['demo_pedida_entrada'])) {
        $conv['fase'] = 'prediseno';
        $conv['cta_muestra'] = true;
        wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'pedida_de_entrada']);
        $out[] = wabot_prediseno_texto($conv, $cfg);
        return $out;
    }
    $oferta = trim(wabot_plantilla_variante('msg_prediseno_oferta', 'msg_prediseno_oferta_variantes', $conv, $cfg));
    if ($oferta !== '') {
        $out[] = $oferta;
        $conv['cta_muestra'] = true;
        wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'precio']);
    }
    return $out;
}

/**
 * El texto del precio, armado igual para el motor y para el modo agente.
 * {desc} nombra QUÉ es lo que se está cotizando —"una tienda online completa:
 * catálogo, carrito y cobro online…"— porque un precio sin producto no explica
 * nada. Cada tipo tiene su descripción en la config, editable desde Textos.
 */
function wabot_msg_precio_texto($tipo, $cfg, $conv = null) {
    $t = $cfg['tipos'][$tipo];
    $desc = trim((string)($t['desc'] ?? ''));
    if ($desc === '') $desc = 'tu web a medida, diseñada para tu negocio';

    if ($tipo === 'catalogo') {
        $cantidad = (int)(is_array($conv) ? ($conv['productos_cantidad'] ?? 0) : 0);
        if ($cantidad > 0) {
            $d = wabot_catalogo_total($cantidad, $cfg);
            $plantilla = is_array($conv)
                ? wabot_plantilla_variante('msg_precio_catalogo', 'msg_precio_catalogo_variantes', $conv, $cfg)
                : (string)$cfg['msg_precio_catalogo'];
            return str_replace(
                ['{desc}', '{cantidad}', '{total}', '{base}', '{unitario}', '{productos}', '{link}', '{sena}'],
                [$desc, $d['cantidad'], wabot_moneda($d['total']), wabot_moneda($d['base']),
                  wabot_moneda($d['unitario']), wabot_moneda($d['productos']), $t['link'], (string)($t['sena'] ?? '')],
                $plantilla
            );
        }
    }

    $plantilla = is_array($conv)
        ? wabot_plantilla_variante('msg_precio', 'msg_precio_variantes', $conv, $cfg)
        : (string)$cfg['msg_precio'];
    return str_replace(
        ['{desc}', '{precio}', '{link}', '{sena}'],
        [$desc, $t['precio'], $t['link'], (string)($t['sena'] ?? '')],
        $plantilla
    );
}

function wabot_catalogo_preguntar(&$conv, $cfg) {
    $conv['tipo'] = 'catalogo';
    $conv['fase'] = 'catalogo_cantidad';
    wabot_handoff_aclaracion_resuelta($conv);
    return [$cfg['catalogo_cantidad']];
}

function wabot_catalogo_cotizar($cantidad, &$conv, $cfg) {
    $conv['productos_cantidad'] = (int)$cantidad;
    return wabot_precio('catalogo', $conv, $cfg);
}

/* Deriva: mensaje fijo + la conversación queda muda (salvo la línea de espera). */
function wabot_derivar(&$conv, $cfg, $causa = 'derivacion') {
    wabot_handoff_marcar($conv, $causa);
    return [$cfg['derivar']];
}

/**
 * Qué contesta el bot cuando la charla ya está cerrada.
 *
 * Queda activo para las dudas —que es lo que más pregunta el cliente después de
 * pedir la muestra— pero con la venta clausurada: no cotiza, no reabre el
 * prediseño y no deriva de nuevo. Si es una pregunta, la contesta; si es un
 * "gracias", le aclara cómo sigue una sola vez; y si no tiene nada que aportar,
 * se calla en vez de llenar el chat de muletillas.
 */
function wabot_cerrada($texto, &$conv, $cfg) {
    // Un "ok", un "gracias" o un pulgar arriba con la charla ya cerrada no
    // necesitan respuesta: la despedida ya se dijo. Antes que nada, y sin gastar
    // una llamada a la IA.
    if (wabot_es_acuse($texto)) {
        $conv['espera_avisada'] = true;
        return [];
    }

    $out = [];
    $c = (!isset($GLOBALS['WABOT_TEST_CLASIFICADOR'])
          && function_exists('wabot_ia_disponible') && !wabot_ia_disponible())
       ? null
       : wabot_clasificar($texto, $conv, $cfg);

    if ($c === null) {
        $infoOffline = wabot_info_por_palabras($texto, 'derivado');
        if ($infoOffline !== null) {
            if ($infoOffline === 'precio_actual') $out[] = wabot_precio_resumen($conv, $cfg);
            elseif ($infoOffline === 'mantenimiento') $out[] = wabot_texto_mantenimiento($conv, $cfg);
            elseif ($infoOffline === 'pago') $out[] = wabot_texto_pago($conv, $cfg);
            elseif ($infoOffline === 'hosting') $out[] = wabot_texto_hosting($conv, $cfg);
            else $out[] = (string)($cfg['info'][$infoOffline] ?? $cfg['info']['otra']);
        }
    }

    if ($c !== null) {
        $acc = $c['acciones'];
        $has = function ($a) use ($acc) { return in_array($a, $acc, true); };

        // El respaldo local también vale acá: si el clasificador no etiquetó
        // nada, una pregunta concreta ("en cuánto tiempo la tienen?") quedaba
        // sin respuesta y el cliente veía un cuelgue.
        $infoLocalCerrada = wabot_info_por_palabras($texto, 'derivado');
        if ($infoLocalCerrada !== null && !$has('pregunta_info') && !$has('pregunta_tipos')) {
            $acc[] = 'pregunta_info';
            $has = function ($a) use ($acc) { return in_array($a, $acc, true); };
        }

        if ($has('pregunta_info') || $has('pregunta_tipos')) {
            $lineas = [];
            $keysCerrada = $c['info_keys'] ?: [];
            if ($infoLocalCerrada === 'precio_actual') $keysCerrada = ['precio_actual'];
            elseif ($infoLocalCerrada !== null && !in_array($infoLocalCerrada, $keysCerrada, true)) {
                array_unshift($keysCerrada, $infoLocalCerrada);
            }
            foreach ($keysCerrada as $k) {
                if ($k === 'precio_actual') { $lineas[] = wabot_precio_resumen($conv, $cfg); continue; }
                if (!isset($cfg['info'][$k])) continue;
                $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
                : ($k === 'pago' ? wabot_texto_pago($conv, $cfg)
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg) : $cfg['info'][$k]));
            }
            if (!$lineas) $lineas[] = $cfg['info']['otra'];
            $out[] = count($lineas) > 1 ? "- " . implode("\n- ", $lineas) : $lineas[0];
        } elseif ($has('quiere_avanzar') || $has('pide_humano')) {
            // Quiere cerrar. No se deriva de nuevo —ya está derivado— pero es el
            // peor momento para quedarse callado: se le repite quién lo toma.
            $out[] = wabot_texto_espera($conv, $cfg);
        } elseif ($has('objecion_caro')) {
            $out[] = $cfg['caro'];
        } elseif ($has('menciona_plataforma')) {
            $out[] = $cfg['plataformas'];
        } elseif ($acc && !$has('saludo') && !$has('no_interesa')) {
            // Cualquier otra cosa —incluso "y si mejor hago una landing?"— se
            // contesta con el escape al equipo. Callarse ahí parece un cuelgue;
            // el único silencio válido es ante un saludo o un agradecimiento.
            $out[] = $cfg['info']['otra'];
        }
    }

    // La primera vez que vuelve a escribir, se le aclara cómo sigue.
    if (!$conv['espera_avisada']) {
        $conv['espera_avisada'] = true;
        $out[] = wabot_texto_espera($conv, $cfg);
    }

    // Sin repetir lo mismo dos veces seguidas: contestar "eso te lo confirma el
    // equipo" cinco mensajes al hilo es peor que no contestar.
    $ultimo = (string)($conv['ultimo_bot'] ?? '');
    $out = array_values(array_filter($out, function ($m) use ($ultimo) { return $m !== $ultimo; }));
    if ($out) $conv['ultimo_bot'] = end($out);

    return $out;
}

/**
 * La línea que se manda si el cliente sigue escribiendo con la charla cerrada.
 * Son dos situaciones distintas y no se dicen igual: si cerró el prediseño, ya
 * sabe que le escribe Pablo desde tal número; si lo derivamos a mano, no.
 */
function wabot_texto_espera($conv, $cfg) {
    if (($conv['cierre'] ?? '') === 'prediseno' || !empty($conv['lead_creado'])) {
        $t = trim((string)($cfg['espera_prediseno'] ?? ''));
        if ($t !== '') return $t;
    }
    return $cfg['espera'];
}

/* ¿Sirve lo que contestó como referencia, o hay que ir a buscarla a la charla? */
function wabot_referencia_utilizable($texto) {
    return !wabot_es_negativa($texto) && !wabot_apunta_a_lo_ya_dicho($texto);
}

/* "Ya te la pasé", "la de arriba": la referencia existe, pero está más atrás. */
function wabot_apunta_a_lo_ya_dicho($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 60) return false;
    $apuntes = ['ya te la pase', 'ya te lo pase', 'ya te la mande', 'ya te lo mande',
                'ya te la envie', 'ya te lo envie', 'te la pase', 'te lo pase',
                'te la mande', 'te lo mande', 'la que te pase', 'la que te mande',
                'el que te pase', 'el que te mande', 'ya te dije', 'como te dije',
                'la de arriba', 'el de arriba', 'la anterior', 'el anterior',
                'ya la mande', 'ya lo mande', 'ya la pase', 'ya lo pase',
                'esa misma', 'la misma', 'la que dije', 'mas arriba', 'fijate arriba',
                'en el chat', 'al principio', 'ya esta arriba'];
    foreach ($apuntes as $f) {
        if (strpos($t, $f) !== false) return true;
    }
    return false;
}

function wabot_normalizar_frase($texto) {
    $t = mb_strtolower(trim($texto));
    $t = strtr($t, ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ü'=>'u', 'ñ'=>'n']);
    // La puntuación se cambia por espacio, no se borra: "web,boton" pegado
    // quedaba "webboton" y ningún patrón lo encontraba (pasó en producción con
    // el desempate de MILANEL). Y los números se CONSERVAN: borrarlos dejaba
    // "itiza las 2" como "itiza las", así que los patrones de orden ("la 1",
    // "la 2", "opcion 1") no podían matchear nunca — estaban muertos.
    $t = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $t);
    return trim(preg_replace('/\s+/', ' ', $t));
}

/**
 * ¿Es un "sí" pelado? Un "dale" suelto no abre un tema nuevo: contesta la
 * última pregunta que hizo el bot. Lista cerrada y corta a propósito: "dale,
 * mandame el CBU" no entra acá, porque ahí sí quiere avanzar de verdad.
 */
function wabot_es_afirmativa($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 25) return false;
    $afirmativas = ['si', 'sii', 'siii', 'ok', 'oka', 'okey', 'okay', 'dale', 'ok dale',
                    'si dale', 'dale si', 'bueno', 'buenisimo', 'perfecto', 'listo',
                    'de una', 'obvio', 'obvio si', 'joya', 'barbaro', 'genial', 'va',
                    'vamos', 'sale', 'me sirve', 'me interesa', 'si por favor',
                    'si porfa', 'porfa', 'de acuerdo', 'esta bien', 'ta bien',
                    'si gracias', 'dale gracias', 'buenisimo gracias', 'ok gracias',
                    'si me sirve', 'si claro', 'claro', 'claro que si', 'copado',
                    'excelente', 'ideal', 'si obvio', 'seria buenisimo', 'me gustaria'];
    return in_array($t, $afirmativas, true);
}

/* ¿Contestó que no tiene ninguna referencia? */
function wabot_es_negativa($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return true;
    if (mb_strlen($t) > 40) return false;   // si se explayó, es una referencia
    $negativas = ['no', 'no tengo', 'ninguna', 'ninguno', 'no tengo ninguna', 'nada',
                  'no se me ocurre', 'no por ahora', 'todavia no', 'todavía no',
                  'no tengo nada', 'no la verdad', 'la verdad que no', 'no ninguna',
                  'no gracias', 'no tengo idea', 'no aun', 'no aún', 'nop', 'negativo',
                  'no se', 'ni idea', 'no sabria', 'creo que no', 'por ahora no',
                  'nada por ahora', 'todavia nada', 'mmm no', 'la verdad no', 'que no',
                  'nop no tengo', 'no no tengo', 'nel', 'na', 'nada aun', 'ninguna por ahora'];
    if (in_array($t, $negativas, true)) return true;
    $sinMuletillas = trim(preg_replace('/\b(la|vdd|verdad|que|mmm+|eh+|em+|posta|jaja+|jeje+|uh|ay|y|pues|este)\b/u', ' ', $t));
    $sinMuletillas = trim(preg_replace('/\s+/u', ' ', $sinMuletillas));
    return $sinMuletillas !== $t && in_array($sinMuletillas, $negativas, true);
}

function wabot_es_delegacion($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 60) return false;
    $frases = ['elegi vos', 'elegilos vos', 'elegila vos', 'a tu criterio', 'a tu eleccion',
               'a criterio tuyo', 'los que combinen', 'los que quieras', 'los que te parezcan',
               'el que quieras', 'la que quieras', 'como te parezca', 'como quieras',
               'lo dejo a tu criterio', 'a eleccion de ustedes', 'a eleccion del disenador',
               'sorprendeme', 'sorprendanme', 'vos sabes', 'ustedes saben', 'me da igual',
               'cualquiera me da igual', 'cualquiera esta bien', 'usa el que quieras',
               'pone el que quieras', 'pone los que quieras', 'usa los que quieras'];
    foreach ($frases as $f) {
        if (mb_strpos($t, $f) !== false) return true;
    }
    return $t === 'cualquiera' || $t === 'cualquier color' || $t === 'no tengo colores';
}

/**
 * ¿El primer mensaje no trae NADA del negocio? Son los openers que genera el
 * propio anuncio ("Hola. ¿Puedo obtener más información sobre esto?", "Quiero
 * una página web") o un saludo suelto. Ante uno de estos no hay nada que
 * razonar, así que la apertura sale fija y ni se llama a la IA: es lo que evita
 * que cada cliente reciba una presentación distinta e inflada de Gokywebs.
 *
 * Se resuelve sacando el relleno conocido en vez de listar frases enteras: así
 * cualquier combinación de saludo + pedido de info entra igual, y en cuanto
 * queda una palabra propia (el rubro, el negocio) deja de ser genérico y
 * contesta la IA como siempre.
 */
function wabot_apertura_generica($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return true;
    if (mb_strlen($t) > 90) return false;

    $relleno = [
        'puedo obtener mas informacion sobre esto', 'puedo obtener mas informacion',
        'quiero mi demo gratis para mi negocio', 'quiero mi demo gratis',
        'quisiera mas informacion', 'quiero mas informacion', 'mas informacion',
        'necesito informacion', 'quiero informacion', 'me pasas informacion',
        'quiero una pagina web', 'necesito una pagina web', 'quiero mi pagina web',
        'quiero hacer una pagina web', 'quiero una web', 'necesito una web',
        'quiero una pagina', 'pagina web', 'paginas web', 'sitio web', 'la web',
        'buenas noches', 'buenas tardes', 'buenos dias', 'buen dia',
        'hola como estas', 'hola que tal', 'como estas', 'que tal', 'buenas',
        'hola', 'holaa', 'holaaa', 'ola', 'saludos', 'gracias', 'por favor',
        'me interesa', 'info', 'informacion', 'consulta', 'web', 'demo',
        'quiero', 'necesito', 'quisiera', 'vi su anuncio', 'vi el anuncio',
        'y', 'e', 'o', 'de', 'la', 'el', 'un', 'una', 'sobre', 'esto', 'esta',
    ];
    usort($relleno, function ($a, $b) { return mb_strlen($b) - mb_strlen($a); });

    foreach ($relleno as $frase) {
        $t = trim(preg_replace('/\b' . preg_quote($frase, '/') . '\b/u', ' ', $t));
        $t = trim(preg_replace('/\s+/u', ' ', $t));
        if ($t === '') return true;
    }
    return $t === '';
}

/**
 * En WhatsApp ya tenemos el teléfono y se cierra. En Instagram no: el IGSID no
 * da forma de contactarlo, así que antes de cerrar se le pide el WhatsApp. Sin
 * ese número el boceto llega sin destinatario y la muestra no se puede entregar.
 */
function wabot_cerrar_o_pedir_whatsapp(&$conv, $cfg) {
    if (wabot_canal($conv) === 'instagram' && empty($conv['telefono_wsp'])) {
        $conv['fase'] = 'prediseno_wsp';
        return [$cfg['prediseno_whatsapp']];
    }
    return wabot_prediseno_completo($conv, $cfg);
}

/**
 * Cierre del brief de un sistema de gestión: no hay precio de lista, así que
 * el lead viaja a Firestore con la descripción y Pablo cotiza a medida.
 */
/**
 * ¿Ya contó bastante como para cotizar sin seguir preguntando?
 *
 * El que pide un sistema suele explicarlo largo y con funciones concretas
 * ("registro de socios, suscripción por Mercado Pago, panel de estados, avisos
 * por mail"). A ese cliente no se lo interroga: se le resume y se le dice que
 * lo cotizan. Preguntarle tres cosas más es lo que se siente como un formulario.
 */
function wabot_sistema_ya_explicado($conv) {
    $problema = trim((string)($conv['sistema_problema'] ?? ''));
    if ($problema === '') return false;
    if (mb_strlen($problema) >= 140) return true;
    // Varias funciones nombradas en la misma explicación.
    $t = wabot_normalizar_frase($problema . ' ' . wabot_contexto_cliente_texto($conv, 6));
    $senales = 0;
    foreach (['registro', 'socios', 'suscripcion', 'suscriptores', 'mercado pago', 'pagos', 'cobros',
              'panel', 'administracion', 'administrar', 'estados', 'avisos', 'notificaciones',
              'mail', 'email', 'stock', 'turnos', 'clientes', 'reportes', 'facturacion',
              'usuarios', 'roles', 'altas', 'bajas', 'vencimientos'] as $senal) {
        if (mb_strpos($t, $senal) !== false) $senales++;
    }
    return $senales >= 3;
}

function wabot_sistema_completo(&$conv, $cfg) {
    $conv['tipo'] = 'sistema';
    $problema = trim((string)($conv['sistema_problema'] ?? ''));
    $actual   = trim((string)($conv['sistema_actual'] ?? ''));
    $usuarios = trim((string)($conv['sistema_usuarios'] ?? ''));
    $partes = [];
    if ($problema !== '') $partes[] = 'Necesita resolver: ' . $problema;
    if ($usuarios !== '') $partes[] = 'Usuarios: ' . $usuarios;
    if ($actual !== '')   $partes[] = 'Hoy lo maneja con: ' . $actual;
    if ($partes) $conv['descripcion'] = implode('. ', $partes) . '.';

    // Instagram entrega un IGSID, no un celular. Sin pedirlo explícitamente la
    // propuesta queda creada con un contacto imposible de usar.
    if (wabot_canal($conv) === 'instagram' && empty($conv['telefono_wsp'])) {
        $conv['fase'] = 'sistema_wsp';
        return [wabot_sistema_whatsapp_texto($cfg)];
    }

    // Un sistema es un lead cotizable, no una muestra de web. Se guarda en una
    // bandera separada para que el panel no lo mezcle con la cola de bocetos.
    if (empty($conv['sistema_lead_creado'])) {
        $conv['sistema_lead_creado'] = wabot_firestore_lead($conv, $cfg);
    }
    wabot_evento_sesion($conv, 'sistema_calificado');
    wabot_handoff_marcar($conv, 'sistema');
    return [$cfg['sistema_cierre']];
}

/* Datos completos: crea el lead, registra la muestra y deriva. */
function wabot_prediseno_completo(&$conv, $cfg) {
    wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'cierre']);
    if (!$conv['lead_creado']) {
        $conv['lead_creado'] = wabot_firestore_lead($conv, $cfg);
        wabot_muestra_guardar($conv, $cfg, $conv['lead_creado']);
    }
    // Queda en espera no avisada a propósito: si el cliente sigue escribiendo,
    // se lleva una línea y recién después el bot se calla.
    wabot_handoff_marcar($conv, 'prediseno');
    return [wabot_texto_prediseno_completo($conv, $cfg)];
}
