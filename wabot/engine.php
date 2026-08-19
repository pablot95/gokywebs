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

    if (preg_match('/\b(no me interesa|no estoy interesado|no estoy interesada|dejalo ahi)\b/u', $t)
        || preg_match('/\bgracias pero no(?: gracias)?$/u', $t)) {
        return 'rechazo';
    }
    if (preg_match('/\b(solo|solamente|unicamente|por ahora|por el momento)\b.{0,35}\b(averigu|consult|pregunt|viendo|cotiz)\w*/u', $t)
        || preg_match('/\b(mas adelante|en otro momento|cuando pueda|cuando tenga)\b.{0,45}\b(escrib|contact|comunic|retom|veo|vemos|avanzo|avanzamos)\w*/u', $t)
        || preg_match('/\b(no tengo|no cuento con)\b.{0,20}\b(plata|dinero|presupuesto|fondos)\b/u', $t)
        || preg_match('/\bno puedo\b.{0,20}\b(pagar|afrontar)\b/u', $t)
        || preg_match('/\b(ahora|hoy|por ahora|por el momento)\b.{0,25}\b(no tengo|no cuento con|no puedo)\b.{0,25}\b(plata|dinero|presupuesto|fondos|pagar)\b/u', $t)
        || preg_match('/\b(no tengo|no cuento con|no puedo)\b.{0,25}\b(plata|dinero|presupuesto|fondos|pagar)\b.{0,25}\b(ahora|hoy|por ahora|por el momento)\b/u', $t)) {
        return 'consulta';
    }
    return null;
}

function wabot_cerrar_sin_presion(&$conv, $cfg, $tipo = 'consulta') {
    $conv['seguimiento_bloqueado'] = true;
    $conv['seguimiento_estado'] = 'bloqueado';
    $conv['cta_muestra'] = true;
    $conv['cierre'] = $tipo === 'rechazo' ? 'sin_interes' : 'consulta_sin_presion';
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'consulta_cerrada', ['causa' => $tipo]);
    $texto = $tipo === 'rechazo'
        ? (string)($cfg['no_interesa'] ?? 'Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.')
        : (string)($cfg['cierre_suave'] ?? 'Gracias por consultar. Cuando sea el momento, escribinos y retomamos desde acá.');
    return [$texto];
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

    $cursos = preg_match('/\b(curso|cursos|taller|talleres|capacitacion|capacitaciones|clases online)\b/u', $t);
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

/** Textos seguros cuando la dependencia de IA no está disponible. Nunca deriva. */
function wabot_fallback_ia($texto, &$conv, $cfg) {
    $cierre = wabot_cierre_sin_presion_tipo($texto);
    if ($cierre !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierre);

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
            $infoLocal = wabot_info_por_palabras($texto);
            if ($infoLocal !== null) {
                if ($infoLocal === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
                if ($infoLocal === 'pago') return [wabot_texto_pago($conv, $cfg)];
                if ($infoLocal === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
                return [(string)($cfg['info'][$infoLocal] ?? $cfg['info']['otra'])];
            }

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
                return [$cfg[$desempate[1]]];
            }
            if ($rubroLocal !== null) return wabot_precio($rubroLocal, $conv, $cfg);
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
        case 'precio':
            if (empty($conv['cta_muestra'])) {
                $conv['cta_muestra'] = true;
                wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'fallback_duda']);
                return [$cfg['cta_muestra'] ?? $cfg['msg_prediseno_oferta']];
            }
            return [$cfg['info']['otra']];
        case 'prediseno':
            if (!empty($conv['descripcion']) && empty($conv['colores'])) return [$cfg['prediseno_falta_colores']];
            if (!empty($conv['colores']) && empty($conv['descripcion'])) return [$cfg['prediseno_falta_descripcion']];
            return [$cfg['prediseno']];
        case 'prediseno_ref': return [$cfg['prediseno_referencia']];
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
    if (preg_match('/\b(peluqueria|barberia|estetica|spa|masajes|unas|depilacion|tatuajes|consultorio|odontologia|psicologia|veterinaria|gimnasio|pilates|yoga|canchas|cabanas|hotel|taller mecanico)\b/u', $t)) {
        return 'turnos_pendiente';
    }
    if (preg_match('/\b(curso|cursos|capacitacion|capacitaciones|talleres|clases online)\b/u', $t)) return 'cursos';
    if (preg_match('/\b(mates?|velas|ropa|zapatillas?|calzados?|productos|mercaderia|muebles|articulos|ferreteria|kiosco|dietetica|bazar|vivero|panaderia|pet shop|repuestos|local|imprenta|grafica|cajas|packaging|envases|libreria|jugueteria|carniceria|verduleria|fabricamos|indumentaria|marroquineria|cosmetica|perfumeria)\b/u', $t)) {
        return 'comercio_pendiente';
    }
    if (preg_match('/\b(inmobiliaria|propiedades|bienes raices)\b/u', $t)) return 'inmobiliaria';
    if (preg_match('/\b(empresa|pyme|fabrica|distribuidora|fundacion|ong|colegio|escuela|universidad|municipio|sindicato|asociacion)\b/u', $t)) {
        return 'institucional';
    }
    if (preg_match('/\b(landing|abogado|contador|plomero|gasista|electricista|pintor|fletes|cerrajero|jardinero|fotografo|disenador)\b/u', $t)) {
        return 'landing';
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
    if (in_array($fase, ['precio', 'prediseno'], true) && !empty($conv['tipo'])) {
        return 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?';
    }
    if ($fase === 'algo_diferente') return $yaPregunto && !empty($cfg['contame_2']) ? $cfg['contame_2'] : $cfg['contame'];
    return $cfg['contame'];
}

/** Resultado visible de un intento de handoff que pasó por la guarda. */
function wabot_handoff_intentar($texto, &$conv, $cfg, $causaSugerida = null) {
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
        if (function_exists('wabot_evento')) {
            wabot_evento($conv, 'handoff_rechazado', [
                'motivo' => 'sin evidencia',
                'aclaraciones_fallidas' => (int)($conv['aclaraciones_fallidas'] ?? 0),
            ]);
        }
        return [wabot_texto_aclaracion($conv, $cfg)];
    }
    return wabot_derivar($conv, $cfg, $causa);
}

/**
 * Procesa un mensaje entrante. Muta $conv y devuelve array de textos a enviar
 * (0, 1 o varios; el que llama los une en UN solo mensaje de WhatsApp).
 */
function wabot_engine($texto, &$conv, $cfg) {
    $ahora = time();
    wabot_turno_preparar($conv, $cfg, $ahora);
    wabot_turno_marcar($conv);

    if (!empty($conv['seguimiento_bloqueado']) && wabot_reabre_consulta($texto)) {
        $conv['seguimiento_bloqueado'] = false;
        $conv['seguimiento_estado'] = null;
        if (in_array(($conv['cierre'] ?? ''), ['sin_interes', 'consulta_sin_presion'], true)) $conv['cierre'] = null;
    }
    $cierreSinPresion = wabot_cierre_sin_presion_tipo($texto);
    if ($cierreSinPresion !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierreSinPresion);

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
        return wabot_handoff_intentar($texto, $conv, $cfg, $has('productos_y_cursos') ? 'productos_y_cursos' : null);
    }
    if ($has('no_interesa')) {
        return wabot_cerrar_sin_presion($conv, $cfg, 'rechazo');
    }

    /* ── Cambio de tipo después del precio: confirmar antes del handoff ── */
    if (in_array($conv['fase'], ['precio', 'prediseno'], true)) {
        $rubroNuevo = wabot_rubro_de($acc);
        if ($has('cambia_tipo') || $has('rubro_sistema')
            || ($rubroNuevo !== null && $rubroNuevo !== $conv['tipo'] && wabot_desempate_de($rubroNuevo) === null)) {
            return wabot_handoff_intentar($texto, $conv, $cfg);
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
    $infoLocal = $sinNada ? wabot_info_por_palabras($texto) : null;
    if ($infoLocal !== null) { $acc[] = 'pregunta_info'; $has = function ($a) use ($acc) { return in_array($a, $acc, true); }; }
    if ($has('pregunta_info')) {
        $keys = $c['info_keys'] ?: [];
        if ($infoLocal !== null && !in_array($infoLocal, $keys, true)) array_unshift($keys, $infoLocal);
        if (!$keys) $keys = ['otra'];
        $lineas = [];
        foreach ($keys as $k) {
            if (!isset($cfg['info'][$k])) continue;
            $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
                : ($k === 'pago' ? wabot_texto_pago($conv, $cfg)
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg) : $cfg['info'][$k]));
        }
        if (!$lineas) $lineas[] = $cfg['info']['otra'];
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
            if ($out || $has('saludo')) break;
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
            if ($out || $has('saludo')) break;
            // Si en realidad quería una web, se cotiza y listo.
            $r = wabot_rubro_de($acc);
            if ($r !== null && wabot_desempate_de($r) === null) { $out = array_merge($out, wabot_precio($r, $conv, $cfg)); break; }
            if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
            $conv['sistema_problema'] = trim($texto);
            $conv['fase'] = 'sistema_usuarios';
            wabot_handoff_aclaracion_resuelta($conv);
            $out[] = wabot_sistema_texto('usuarios', $cfg);
            break;

        case 'sistema_usuarios':
            if ($out || $has('saludo')) break;
            if (wabot_es_negativa($texto)) return array_merge($out, wabot_handoff_intentar($texto, $conv, $cfg));
            $conv['sistema_usuarios'] = trim($texto);
            $conv['fase'] = 'sistema_actual';
            $out[] = wabot_sistema_texto('actual', $cfg);
            break;

        case 'sistema_actual':
            if ($out || $has('saludo')) break;
            $conv['sistema_actual'] = trim($texto) !== '' ? trim($texto) : 'No indicó cómo lo maneja hoy';
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'sistema_listo':
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

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
                $out[] = $cfg['prediseno'];
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

        case 'prediseno':
            if ($c['descripcion'] !== null) $conv['descripcion'] = $c['descripcion'];
            if ($c['colores']     !== null) $conv['colores']     = $c['colores'];

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
            if ($conv['descripcion'] !== null)      { $out[] = $cfg['prediseno_falta_colores']; }
            elseif ($conv['colores'] !== null)      { $out[] = $cfg['prediseno_falta_descripcion']; }
            elseif (!$out)                          { $out[] = $cfg['prediseno']; }
            break;

        case 'prediseno_ref':
            // Si el mensaje era una pregunta, una objeción o un simple gracias,
            // NO es la referencia: se contesta lo contestable y el pedido de
            // referencia sigue en pie. Sin esto, "cuánto tarda?" se guardaba
            // como referencia visual y encima cerraba la charla.
            if ($out || $has('saludo')) break;
            // Lo que conteste es la referencia, salvo que sea un "no tengo" o un
            // "ya te la pasé": ahí la referencia está más arriba en la charla y
            // la rescata wabot_links_en_charla() al armar el boceto.
            $conv['referencia'] = wabot_referencia_utilizable($texto) ? trim($texto) : '';
            return array_merge($out, wabot_cerrar_o_pedir_whatsapp($conv, $cfg));

        case 'prediseno_wsp':
            // Igual que arriba: una pregunta no es un teléfono.
            if ($out || $has('saludo')) break;
            $num = wabot_extraer_celular($texto);
            if ($num === null) { $out[] = $cfg['prediseno_whatsapp_invalido']; break; }
            $conv['telefono_wsp'] = $num;
            return array_merge($out, wabot_prediseno_completo($conv, $cfg));

        case 'sistema_wsp':
            // El IGSID identifica la cuenta de Instagram, no es un teléfono.
            // Solo se cierra el lead cuando el cliente escribe un número real.
            if ($out || $has('saludo')) break;
            $num = wabot_extraer_celular($texto);
            if ($num === null) { $out[] = wabot_sistema_whatsapp_texto($cfg, true); break; }
            $conv['telefono_wsp'] = $num;
            return array_merge($out, wabot_sistema_completo($conv, $cfg));

        case 'catalogo_cantidad':
            if ($out || $has('saludo')) break;
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
    if (in_array('rubro_comercio', $acc, true))                                      return 'comercio_pendiente';
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
    if ($r === 'comercio_pendiente') return ['desempate_comercio', 'desempate_comercio'];
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
function wabot_info_por_palabras($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return null;

    if (preg_match('/(por mes|mensual|al mes|cada mes|mantenimiento|abono|cuota mensual|mensualidad|costo fijo|pago mensual)/u', $t)) return 'mantenimiento';
    if (preg_match('/(cuanto tarda|cuanto demora|plazo|cuando esta|cuando la tienen|tiempo de entrega|para cuando)/u', $t)) return 'plazos';
    if (preg_match('/(como se paga|formas de pago|medios de pago|se puede pagar|transferencia|mercado pago|en cuotas|senia|sena)/u', $t)) return 'pago';
    if (preg_match('/(hosting|dominio|servidor|el .com|la direccion web)/u', $t)) return 'hosting';
    if (preg_match('/(quien carga|cargan ustedes|carga de productos|subir los productos|cargar el contenido|los textos los)/u', $t)) return 'carga';
    // Palabras completas: "catálogo" contiene "logo" como substring y no es
    // una consulta sobre identidad visual.
    if (preg_match('/(?:^|\s)(?:logo|isotipo|identidad|marca grafica)(?:\s|$)/u', $t)) return 'logo';
    if (preg_match('/(publicidad|marketing|redes|instagram|pauta|anuncios|posteos)/u', $t)) return 'marketing';
    if (preg_match('/(reunion|videollamada|llamada|nos juntamos|zoom|meet)/u', $t)) return 'reuniones';
    if (preg_match('/(wordpress|wix|tiendanube|shopify|con que lo hacen|que tecnologia|codigo)/u', $t)) return 'tecnologia';
    if (preg_match('/(como (se )?manejan|como trabajan|como es el proceso|como sigue|como funciona el trabajo)/u', $t)) return 'proceso';

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
        return $fase === 'desempate_comercio' ? 'comercio_mostrar'
             : ($fase === 'desempate_turnos' ? 'turnos_no' : 'cursos_mostrar');
    }

    switch ($fase) {
        case 'desempate_comercio':
            if ($tiene(array_merge($primera, [
                'vender', 'venderlos', 'venderlas', 'venta', 'ventas', 'carrito', 'tienda', 'online',
                'ecommerce', 'e commerce', 'cobrar', 'cobro', 'comprar', 'compren', 'compras',
                'por la web', 'por la pagina', 'desde la web', 'desde la pagina', 'en la web', 'en la pagina',
                'por internet', 'por la pag', 'la web', 'la pagina', 'que compren', 'pagar', 'paguen',
                'mercado pago', 'con pago', 'todo online', 'la completa', 'la tienda',
            ]))) return 'comercio_vender';
            if ($tiene(array_merge($segunda, [
                'mostrar', 'muestre', 'mostrarlos', 'mostrarlas', 'catalogo', 'catálogo', 'presentacion', 'presentar', 'contacten', 'contacto',
                'whatsapp', 'wsp', 'wp', 'informativa', 'solo mostrar', 'que me escriban', 'me escriban',
                'escriban', 'que me hablen', 'me contacten', 'la simple', 'la basica', 'sin carrito',
                'sin cobro', 'nomas', 'solamente mostrar', 'que muestre',
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
            ])) return 'hibrido_catalogo';
            if ($tiene([
                'mostrar trabajos', 'trabajos realizados', 'portfolio', 'portafolio', 'obras', 'proyectos',
                'recibir consultas', 'pedir presupuesto', 'cotizacion', 'cotizaciones', 'que me contacten',
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
    $sena = $cfg['tipos'][$tipo]['sena'] ?? '';
    if ($sena === '') return (string)($cfg['info']['pago_generico'] ?? $cfg['info']['pago'] ?? '');
    return str_replace('{sena}', $sena, (string)($cfg['info']['pago'] ?? ''));
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
function wabot_precio($tipo, &$conv, $cfg) {
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) <= 0) {
        return wabot_catalogo_preguntar($conv, $cfg);
    }

    $conv['tipo'] = $tipo;
    $conv['fase'] = 'precio';
    $conv['precio_dado'] = true;
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);

    $out = [wabot_msg_precio_texto($tipo, $cfg, $conv)];
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
                ['{desc}', '{cantidad}', '{total}', '{base}', '{unitario}', '{productos}', '{link}'],
                [$desc, $d['cantidad'], wabot_moneda($d['total']), wabot_moneda($d['base']),
                  wabot_moneda($d['unitario']), wabot_moneda($d['productos']), $t['link']],
                $plantilla
            );
        }
    }

    $plantilla = is_array($conv)
        ? wabot_plantilla_variante('msg_precio', 'msg_precio_variantes', $conv, $cfg)
        : (string)$cfg['msg_precio'];
    return str_replace(['{desc}', '{precio}', '{link}'], [$desc, $t['precio'], $t['link']], $plantilla);
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
    $out = [];
    $c = (!isset($GLOBALS['WABOT_TEST_CLASIFICADOR'])
          && function_exists('wabot_ia_disponible') && !wabot_ia_disponible())
       ? null
       : wabot_clasificar($texto, $conv, $cfg);

    if ($c !== null) {
        $acc = $c['acciones'];
        $has = function ($a) use ($acc) { return in_array($a, $acc, true); };

        if ($has('pregunta_info') || $has('pregunta_tipos')) {
            $lineas = [];
            foreach (($c['info_keys'] ?: []) as $k) {
                if (!isset($cfg['info'][$k])) continue;
                $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
                : ($k === 'pago' ? wabot_texto_pago($conv, $cfg) : $cfg['info'][$k]);
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
    if ($t === '' || mb_strlen($t) > 40) return false;
    $apuntes = ['ya te la pase', 'ya te lo pase', 'ya te la mande', 'ya te lo mande',
                'ya te la envie', 'ya te lo envie', 'te la pase', 'te lo pase',
                'te la mande', 'te lo mande', 'la que te pase', 'la que te mande',
                'el que te pase', 'el que te mande', 'ya te dije', 'como te dije',
                'la de arriba', 'el de arriba', 'la anterior', 'el anterior',
                'ya la mande', 'ya lo mande', 'ya la pase', 'ya lo pase',
                'esa misma', 'la misma', 'la que dije'];
    foreach ($apuntes as $f) {
        if (strpos($t, $f) !== false) return true;
    }
    return false;
}

function wabot_normalizar_frase($texto) {
    $t = mb_strtolower(trim($texto));
    $t = strtr($t, ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ü'=>'u', 'ñ'=>'n']);
    $t = preg_replace('/[^\p{L}\s]/u', '', $t);
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
                  'nada por ahora', 'todavia nada', 'mmm no', 'la verdad no', 'que no'];
    return in_array($t, $negativas, true);
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
    return [$cfg['prediseno_completo']];
}
