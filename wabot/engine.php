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

    /* confirma_cambio no puede ser un pozo. La pregunta espera "mismo" u
     * "otra", pero el cliente sigue preguntando otras cosas —el empujón se las
     * contesta— y la fase no salía nunca: C07 quedó SEIS turnos ahí y la
     * pregunta original jamás se contestó (1-sep). A los dos turnos sin
     * resolverse se asume el mismo proyecto y se vuelve a la fase anterior,
     * que es la lectura más probable y la que no pierde la venta. */
    if (($conv['fase'] ?? '') === 'confirma_cambio') {
        $conv['confirma_cambio_turnos'] = (int)($conv['confirma_cambio_turnos'] ?? 0) + 1;
        if ($conv['confirma_cambio_turnos'] > 2) {
            $conv['fase'] = (string)($conv['fase_previa_cambio'] ?? 'precio');
            unset($conv['fase_previa_cambio']);
            $conv['confirma_cambio_turnos'] = 0;
            wabot_evento_sesion($conv, 'confirma_cambio_vencido');
        }
    } elseif (!empty($conv['confirma_cambio_turnos'])) {
        $conv['confirma_cambio_turnos'] = 0;
    }

    if (function_exists('wabot_conv_reset_si_vieja')) {
        wabot_conv_reset_si_vieja($conv, $cfg, $ahora);
        /* La charla cotizada antes del 10-sep no tiene el precio congelado: se
         * le siembra el que el bot le dijo, para que siga viendo el suyo. */
        wabot_precio_sembrar($conv, $cfg);
    } else {
        $resetDias = (int)($cfg['reset_dias'] ?? 7);
        $vieja = (int)($conv['ultimo_ts'] ?? 0) > 0
              && ($ahora - (int)$conv['ultimo_ts']) > $resetDias * 86400
              && ($conv['fase'] ?? 'nuevo') !== 'nuevo';
        if ($vieja) {
            foreach (['tipo','descripcion','brief','colores','colores_hex','referencia','cierre',
                      'ultimo_bot','sistema_problema','sistema_actual','sistema_usuarios','productos_cantidad',
                      'estilo','incluir'] as $k) {
                $conv[$k] = null;
            }
            foreach (['referencia_preguntada','cta_muestra','seguimiento_enviado','espera_avisada',
                      'no_texto_avisado','lead_creado','handoff_pendiente','nombre_usado',
                      'aclaracion_pendiente','sistema_lead_creado','precio_dado',
                      'seguimiento_bloqueado'] as $k) {
                $conv[$k] = false;
            }
            $conv['aclaraciones_fallidas'] = 0;
            $conv['contestado_ts'] = 0;
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

/**
 * ¿El cliente nombró DOS O MÁS cosas distintas que vender/ofrecer?
 *
 * Valeria (27-ago) explicó en un solo mensaje que quería ofrecer terapias y
 * lecturas, vender cursos de mancias Y vender sahumerios. El bot contestó "te
 * paso con el desarrollador" sin nombrar una sola de las tres: parece que no
 * la leyó. Una consulta de psicoeducación dijo "sesiones, grupos y
 * cuadernillos" y el bot la encajó en turnos, dejando los cuadernillos
 * afuera; recién apareció el problema después de cotizar.
 *
 * Devuelve las etiquetas de los ejes detectados (al menos dos) o null. Es
 * deliberadamente cortita: cada eje pide palabras del propio cliente, no
 * inferencias, porque de acá sale un texto que se lo va a repetir.
 */
function wabot_ejes_mixtos($texto) {
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', (string)$texto));
    if ($t === '') return null;

    $ejes = [];
    // terap\w*, no terapia\w*: así entra también "terapeuta", que es como se
    // presenta la mayoría ("soy terapeuta y además vendo...").
    if (preg_match('/\b(sesion\w*|terap\w*|consulta\w*|tratamiento\w*|atencion|turno\w*|lectura\w*|sanacion\w*'
        . '|masaje\w*|clase\w* particular\w*|asesoria\w*|acompanamiento\w*)\b/u', $t)) $ejes['servicios'] = 'tus servicios';
    /* "Taller" solo NO es un curso: un taller de manualidades, uno mecánico o
     * uno de costura son el LUGAR donde trabaja, no algo que enseñe. Se le
     * cobró caro a una clienta de macramé y bijouterie el 27-ago: ya tenía su
     * ecommerce cotizado en $290.000 y el aviso de mixto le sacó el precio de
     * la mesa por la palabra "taller". Hace falta el verbo de dictar o la
     * marca de que el taller ES la clase — el mismo criterio que ya usa
     * wabot_fallback_rubro_local(). */
    $dictaTalleres = preg_match('/\b(doy|dicto|damos|dictamos|dando|dictando|enseno|ensenamos)\b.{0,15}\btaller(es)?\b/u', $t)
        || preg_match('/\btaller(es)?\s+(online|virtual\w*|grabad\w*|de capacitacion|para aprender)\b/u', $t);
    /* "Clases" a secas tampoco alcanza —una clase de spinning es el servicio
     * del gimnasio, no algo que venda— pero SÍ cuando aparece enumerada como
     * una función más: "cerámica, venta y clases" se cotizó como ecommerce a
     * secas y las clases quedaron afuera sin que nadie las nombrara (Pablo,
     * 3-sep). Se exige la conjunción o el verbo de dictar delante, que es lo
     * que distingue "y clases" (otra cosa que ofrece) de "para clases de
     * spinning" (el destino del producto que vende). */
    $enumeraClases = preg_match('/\b(y|e|tambien|ademas|mas|damos|doy|dicto|dictamos|hacemos|brindamos|ofrecemos|dictar|dar)\s+(clases|talleres|cursos)\b/u', $t)
        || preg_match('/\b(clases|talleres)\s+(y|e)\s/u', $t);
    if (preg_match('/\b(curso\w*|capacitacion\w*|formacion\w*|diplomatura\w*|seminario\w*|alumno\w*'
            . '|cuadernillo\w*|ebook\w*|e book|clases grabadas|material descargable)\b/u', $t)
        || $dictaTalleres || $enumeraClases) $ejes['cursos'] = 'los cursos o materiales';
    /* "Vender los cursos" NO es un segundo eje: es la forma normal de pedir
     * una plataforma de cursos. Sin este freno, "quiero venderlos desde la web
     * con los videos y el acceso de cada alumna" disparaba el aviso de mixto y
     * la clienta se iba sin precio, con el elearning ya identificado (batería
     * del 2-sep). El verbo de venta cuenta solo si NO viene pegado al curso. */
    $ventaEsDelCurso = preg_match('/\b(vend\w+|venta\w*)\b\s*(los?|las?|mis?|el|la)?\s*'
        . '(curso\w*|clase\w*|taller\w*|capacitacion\w*|seminario\w*|ebook\w*|cuadernillo\w*)\b/u', $t)
        || preg_match('/\b(venderlos|venderlas|venderlo|venderla)\b/u', $t);
    /* Pero si además nombra un producto aparte, el eje vuelve: "doy talleres
     * de costura online y vendo ropa" son dos negocios, no uno. */
    if ($ventaEsDelCurso
        && preg_match('/\b(producto\w*|mercaderia|articulo\w*|stock|indumentaria|ropa|accesorio\w*|sahumerio\w*|tienda)\b/u', $t)) {
        $ventaEsDelCurso = false;
    }
    // "vendo" / "vendemos" faltaban y son la forma más común de decirlo:
    // "vendo los kits", "vendo lana" no caían en ningún eje.
    if (!$ventaEsDelCurso
        && preg_match('/\b(producto\w*|vend[oe]|vendemos|vender\w*|venta\w*|tienda|mercaderia|articulo\w*|stock'
        . '|sahumerio\w*|indumentaria|ropa|accesorio\w*)\b/u', $t)) $ejes['productos'] = 'la venta de productos';
    if (preg_match('/\b(propiedad\w*|inmueble\w*|alquiler\w*|departamento\w*|casas? en venta)\b/u', $t)) $ejes['propiedades'] = 'las propiedades';

    return count($ejes) >= 2 ? $ejes : null;
}

/**
 * La frase que demuestra que se entendió antes de derivar. Sin esto, el
 * traspaso a Pablo llega como una puerta cerrada; con esto, el cliente ve que
 * lo escuchamos y que lo que pide se puede hacer, solo que hay que cotizarlo.
 */
function wabot_texto_mixto($ejes, $cfg) {
    $ejes = array_values((array)$ejes);
    if (count($ejes) < 2) return null;
    $ultimo = array_pop($ejes);
    $lista = implode(', ', $ejes) . ' y ' . $ultimo;
    $plantilla = trim((string)($cfg['mixto'] ?? ''));
    if ($plantilla === '') return null;
    return str_replace('{lista}', $lista, $plantilla);
}

/** Reconstruye el CTA usado en chats viejos mirando solo lo dicho por el bot. */
function wabot_cta_muestra_ya_ofrecida($conv) {
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $linea) {
        if (($linea['q'] ?? '') !== 'bot') continue;
        if ($inicio > 0 && (int)($linea['ts'] ?? 0) < $inicio) continue;
        $t = wabot_normalizar_frase((string)($linea['t'] ?? ''));
        /* "como podria quedar tu web" es el encuadre que fijó Pablo el 2-sep y
         * no dice la palabra demo: sin esta alternativa el ofrecimiento que sí
         * sale en producción no se reconocía y se repetía. */
        if (!preg_match('/\b(demo|muestra|prediseno)\b|como (podria|podriamos) quedar|como quedaria/u', $t)) continue;
        // "preparar" y "formulario": el texto del formulario del 11-sep
        // ("Para preparar la demo completá este formulario") no dice gratis.
        if (preg_match('/\b(gratis|sin cargo|sin costo|sin compromiso|armamos|armarte|armar|preparamos|prepararte|preparar|queres que|formulario)\b/u', $t)) {
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
    // "muebles a medidaS": el plural no entraba y el técnico de heladeras que
    // además hace muebles se cotizó tienda online (1-sep).
    return $t !== '' && (bool)preg_match('/\b(cortinas?|toldos?|aberturas?|muebles? a medidas?|carpinteria|herrerias?|cerramientos?|amoblamientos?|mesadas?|mamparas?'
        . '|rejas?|portones?|placares?|vestidores?|pergolas?|decks?|barandas?|mosquiteros?|escaleras? a medidas?)\b/u', $t);
}

/**
 * Un TÉCNICO no vende lo que arregla. "Técnico en aire acondicionado,
 * lavarropas, heladeras, hornos eléctricos" caía en la lista de productos de
 * wabot_fallback_rubro_local() y salía cotizado como tienda online de
 * $290.000 (1-sep). Si además dice que vende, gana la venta: acá solo entra
 * el que repara, instala o hace service y no nombra ninguna venta.
 */


function wabot_contexto_es_servicio_tecnico($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    if (preg_match('/\b(vendo|vendemos|venta|ventas|vender|revendo|comercializo|tienda|local de)\b/u', $t)) return false;
    return (bool)preg_match('/\b(tecnic[oa] en|tecnic[oa] de|reparacion(es)?|reparo|reparamos|arreglo de|arreglos de|arreglamos|service de|servicio tecnico|instalacion(es)? de|instalador\w*|mantenimiento de)\b/u', $t);
}

/**
 * Señales de salida comercial. Se separan de "lo voy a pensar": cuando alguien
 * dice que solo averiguaba, que será más adelante o que hoy no tiene presupuesto,
 * se cierra bien y se bloquea el seguimiento automático.
 */
function wabot_texto_es_elogio($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    if (preg_match('/\bno\b.{0,12}\b(me gusto|me gusta|me encanto|me convence|me convencio|termina de cerrar|esta bueno|es lo que)\b/u', $t)) return false;
    if (preg_match('/\bno\b.{0,8}\b(quedo|esta|estan)\b.{0,12}\b(lind[oa]|buen[oa]|hermos[oa])\b/u', $t)) return false;
    return (bool)preg_match(
        '/\b(hermos[oa]s?|precios[oa]s?|divin[oa]s?|lind[oa]s?|buenisim[oa]s?|genial|espectacular|increible'
        . '|excelente|impecable|barbar[oa]|joya|zarp[oa]d[oa]|tremend[oa]|perfect[oa])\b/u', $t)
        || (bool)preg_match('/\bme (encant[oa]|encantan|gust[oa]|gustan|fascin[oa])\b/u', $t)
        || (bool)preg_match('/\b(quedo|esta|estan|quedaron)\b.{0,12}\b(muy )?(lind[oa]s?|buen[oa]s?|hermos[oa]s?|piola|copad[oa])\b/u', $t);
}

function wabot_texto_mira_la_demo($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match(
        '/\b(la|lo|las|los)\s+(estoy|estamos|est[aá]bamos)\s+(viendo|mirando|revisando)\b/u', $t)
        || (bool)preg_match(
        '/\b(viendo|mirando|revisando)\b.{0,15}\b(la demo|la muestra|la pagina|la web|el link|la propuesta)\b/u', $t);
}

function wabot_cierre_sin_presion_tipo($texto) {
    $crudo = (string)$texto;
    $t = wabot_normalizar_frase($crudo);
    if ($t === '') return null;
    // wabot_normalizar_frase() borra el signo: se mira el crudo.
    $pregunta = mb_strpos($crudo, '?') !== false || mb_strpos($crudo, '¿') !== false;

    /* Pedir que no lo contacten más. Maria Laura lo dijo dos veces —"No molesten
     * más" y "no quiero que me molesten más"— y ninguna de las dos matcheaba:
     * la lista exigía el "me" pegado ("no me molesten mas"). El bot le contestó
     * pidiéndole que avisara si quería cerrar el contacto, que era exactamente
     * lo que estaba haciendo (28-ago).
     *
     * Se arma con dos piezas —el verbo de rechazo y el "más"/"ya" opcional— en
     * vez de una lista de frases exactas, que es lo que dejaba pasar cualquier
     * variante de orden de palabras. */
    /* Cuatro formas de pedir lo mismo, separadas a propósito: marcar la baja
     * apaga el bot para esa conversación, así que un falso positivo mata el
     * lead. "No me manden el presupuesto por mail" NO puede leerse como baja.
     *
     * Auditoría 9-sep: los verbos tienen que estar DIRIGIDOS AL BOT y en
     * presente o imperativo. "No quiero molestar, cuánto sale?" es cortesía;
     * "no me mandaron nada todavía" y "no me escribieron más" son RECLAMOS
     * por falta de respuesta (el cliente que espera la demo). Los tres daban
     * de baja al cliente con "Listo, no te escribimos más", y con bot_off el
     * webhook ya no llama al motor: silencio para siempre. */
    $bajaMolestar = '(molesten|molestes|molestenme|molestame|molestarme|molestarnos|molestando|molestandome|jodan|jodas|jodanme|jodiendo)';
    $bajaEscribir = '(me escriban|me escribas|escribirme|escribiendome|me contacten|me contactes|contactarme|contactandome'
                  . '|me manden|me mandes|mandarme|mandandome|me llamen|me llames|llamarme|llamandome|insistan|insistas|insistir|insistiendo)';
    $cortesia = preg_match('/\b(no (te |los |las |le |les )?(quiero|quisiera|queria|quise) molestar|perdon (que|por) (te |los )?molest'
                         . '|disculp\w* (la |las )?molestia|no molesto mas|sin molestar|si no (es molestia|molesto|los molesto|te molesto))/u', $t);
    // "No me manden nada todavía, primero quiero ver la demo" ordena el
    // momento, no pide la baja.
    $ordenaMomento = preg_match('/\b(todavia|por ahora|hasta que|primero|antes de|por el momento|de momento)\b/u', $t);
    if (!$cortesia && (
        // "dejen de escribirme", "paren de mandar mensajes": el verbo ya es final.
        preg_match('/\b(dejen de|dejenme de|dejate de|deja de|dejar de|paren de|parar de|basta de|corten con)\b.{0,20}\b(escrib\w*|contact\w*|mand\w*|llam\w*|insist\w*|molest\w*|jod\w*)\b/u', $t)
        // Molestar dirigido al bot no admite otra lectura, con "no" adelante alcanza.
        || preg_match('/\b(no|paren de|basta de)\b.{0,26}\b' . $bajaMolestar . '\b/u', $t)
        // Escribir/contactar/mandar sí: hace falta el "más", el "nunca" o el "nada".
        || (!$ordenaMomento && preg_match('/\bno\b.{0,26}\b' . $bajaEscribir . '\b.{0,18}\b(mas|nunca|nada|jamas)\b/u', $t))
        || (!$ordenaMomento && preg_match('/\bno\b.{0,12}\b(mas|nunca|jamas)\b.{0,18}\b' . $bajaEscribir . '\b/u', $t))
        // Y el pedido explícito de baja, que no necesita contexto.
        || preg_match('/\b(borrame|borren mi numero|eliminame|eliminen mi|sacame de la lista|sacarme de la lista|darme de baja|dar de baja|desuscribir|desuscribirme|bloquear|bloqueame|no quiero recibir mas)\b/u', $t)
    )) {
        return 'baja';
    }

    if (preg_match('/\b(no me interesa vender|no me interesa cobrar|no me interesa el carrito|no me interesa la tienda)\b/u', $t)) {
        return null;
    }
    /* "No me interesa el mantenimiento", "no me interesa la videollamada,
     * prefiero por acá": es una condición sobre UNA parte, no un rechazo del
     * proyecto. Rechazo es el "no me interesa" pelado o con el proyecto
     * entero como objeto (auditoría 9-sep). */
    if (preg_match('/\bno (me |nos )?(interesa|interesan)\b\s*(.*)$/u', $t, $mI)
        || preg_match('/\bno estoy interesad[oa]\b\s*(.*)$/u', $t, $mI)) {
        $restoRechazo = trim((string)($mI[count($mI) - 1] ?? ''));
        $parteDelServicio = '/^(en |por |lo de |lo del |eso de |eso del |el tema del |el tema de |el |la |lo |los |las |ese |esa |este |esta |un |una )*'
            . '(mantenimiento|videollamada|video llamada|llamada|reunion|hosting|dominio|logo|redes|marketing|publicidad|carrito|tienda online'
            . '|cobro|cobrar|pagos? online|formulario|mapa|blog|seo|posicionamiento|google|pixel|bilingue|ingles|idioma|catalogo|panel|app'
            . '|demo|muestra|predise\w*|cuotas|tarjeta|transferencia|abono|plan|sena|senia|ecommerce|e commerce|plataforma|curso|cursos'
            . '|turnos|reservas|chat|bot|vender|cobrar|comprar)\b/u';
        if ($restoRechazo === '' || !preg_match($parteDelServicio, $restoRechazo)) return 'rechazo';
    }
    if (preg_match('/\bdejalo ahi\b/u', $t) || preg_match('/\bgracias pero no(?: gracias)?$/u', $t)) {
        return 'rechazo';
    }

    if (preg_match('/\b(quiero|quisiera|necesito|cotiza|cotizame|pasame|pasas|decime|mandame|cuanto (sale|cuesta|esta|vale)|que precio|me interesa)\b/u', $t)
        || preg_match('/\b(recibir consultas|reciban consultas|me consulten|solo mostrar|mostrar los|mostrar mis|catalogo|whatsapp)\b/u', $t)) {
        return null;
    }
    if (wabot_texto_es_elogio($t) || wabot_texto_mira_la_demo($t)) return null;
    /* Una pregunta nunca es una despedida: "no puedo pagar todo junto, se
     * puede en cuotas?" es una objeción de precio, y "estoy averiguando,
     * cuánto sale?" pide el precio (auditoría 9-sep). */
    if ($pregunta) return null;
    /* "Estoy viendo de hacer una web", "estaba consultando por el precio",
     * "estamos viendo la posibilidad de armar una tienda": explora una
     * compra, no se va. Lo que cierra es "estoy viendo opciones nomás" o
     * "por ahora solo estaba averiguando precios". */
    if (preg_match('/\b(viendo|mirando|averiguando|consultando|buscando|analizando|evaluando)\s+(de|como|que|si|para|donde|con quien|la posibilidad|la opcion|opciones de|la forma|la manera|cuanto|cual|cuales)\b/u', $t)
        || preg_match('/\b(consultando|averiguando|preguntando)\s+(por|sobre)\b/u', $t)) {
        return null;
    }
    // "No puedo pagar todo junto, en cuotas?" es una objeción de precio.
    $objecionPago = preg_match('/\b(cuotas?|en partes|financia\w*|todo junto|de una sola vez|en un solo pago|todo de una|el total de una)\b/u', $t);

    /* "Revisaré el portafolio y los vuelvo a contactar" (Lucas, 1-sep): se va
     * a comparar. Antes no matcheaba nada y el turno lo tomaba el modelo, que
     * improvisó "quedamos a disposición". Solo el portfolio/los trabajos: "la
     * voy a ver" sobre la demo lo resuelve wabot_texto_mira_la_demo() arriba. */
    if (preg_match('/\b(voy a|vamos a|dejame|dejenme|primero|despues de)\b.{0,12}\b(ver|revisar|mirar|chequear)\b.{0,12}\b(portfolio|portafolio|trabajos|ejemplos)\b/u', $t)
        || preg_match('/\b(revisare|mirare|vere|chequeare|reviso|miro|veo)\b.{0,6}\b(el|los|su|sus|tu|tus)\b.{0,4}\b(portfolio|portafolio|trabajos|ejemplos)\b/u', $t)) {
        return 'consulta';
    }

    if (preg_match('/\b(estoy|estaba|ando|andaba|estamos)\b.{0,20}\b(averiguando|consultando|preguntando|viendo|mirando|chusmeando|cotizando)\b/u', $t)
        || preg_match('/\b(solo|solamente|unicamente|por ahora|por el momento)\b.{0,25}\b(averiguo|averiguando|consultando|preguntando|viendo|mirando)\b/u', $t)
        /* "Cuando pueda/tenga te escribo" NO cierra: es el cliente prometiendo
         * los datos o la respuesta, y eso ya lo maneja wabot_dijo_te_aviso()
         * frenando el seguimiento del día. Cerrarle la charla al que va a
         * mandar las fotos era lo que pasaba (auditoría 9-sep). */
        || preg_match('/\b(mas adelante|en otro momento|el mes que viene|el ano que viene)\b.{0,45}\b(escrib|contact|comunic|retom|veo|vemos|avanzo|avanzamos)\w*/u', $t)
        || preg_match('/\b(no tengo|no cuento con)\b.{0,20}\b(plata|dinero|fondos)\b/u', $t)
        || preg_match('/\bno tengo presupuesto\b(?!.{0,25}\b(pasame|mandame|todavia el|aun el)\b)/u', $t)
        || (!$objecionPago && preg_match('/\bno puedo\b.{0,20}\b(pagar|afrontar)\b/u', $t))
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
    /* Los descuentos de SU tienda no son un regateo: "la tienda puede tener
     * cupones de descuento?" recibía la objeción de precio y, a la segunda,
     * una derivación por pago (auditoría 9-sep). Lo mismo "100% algodón" o
     * "vendo con 10% de descuento los lunes". Un regateo nos pide algo a
     * NOSOTROS: "me hacés", "me dejás", "baja el precio". */
    $pideANosotros = preg_match('/\b(me (haces|hacen|das|dan|dejas|dejan|bajas|bajan)|nos (hacen|dejan)|hay forma|no hay forma|cierro|te pago|te doy|precio (especial|amigo)|mejor precio|hacer precio|haces precio|baja(s|n)? (el precio|algo|un poco)|ahi si baja)\b/u', $t);
    if (!$pideANosotros
        && preg_match('/\b(cupon\w*|codigos? de descuento|promo\w*|ofertas?|liquidacion|rebajas de|mis (clientes|productos)|los clientes|la tienda|la web|el sitio|en mi (tienda|local|negocio)|temporada|algodon|cuero|natural|puro|garantia|calidad|efectivo|efectividad|los (lunes|martes|miercoles|jueves|viernes|sabados|domingos))\b/u', $t)) {
        return false;
    }
    return (bool)(
        preg_match('/\b(me lo dejas en|me lo dejarias en|dejamelo en|dejalo en|te doy|te pago|lo cierro en|cerramos en)\b.{0,15}\d/u', $t)
        || preg_match('/\b(descuento|rebaja|una rebajita|mitad de precio|precio especial|mejor precio|hacer precio|haces precio|me haces precio)\b/u', $t)
        // (?<!\d): "100%" no es un porcentaje de descuento.
        || preg_match('/(?<!\d)\d{1,2}\s?(%|por ciento|porciento)/u', $t)
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

function wabot_cerrar_sin_presion(&$conv, $cfg, $tipo = 'consulta', $motivo = null) {
    /* El que se va COMPARANDO precios y ya tiene el nuestro se lleva una única
     * mención de la demo, que es justo lo que le sirve para comparar. Elii
     * ("estaba viendo y consultar precios") y Lucas ("revisaré el portafolio")
     * se fueron el 1-sep con una despedida que no la nombraba. Una sola vez:
     * si la demo ya se ofreció antes, va el cierre de siempre. */
    $demoAlCierre = $tipo === 'consulta' && $motivo === 'solo_averiguando'
        && !empty($conv['precio_dado']) && empty($conv['cta_muestra'])
        && trim((string)($cfg['cierre_comparando'] ?? '')) !== '';
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
    if ($tipo === 'rechazo') {
        $texto = (string)($cfg['no_interesa'] ?? 'Gracias por escribirnos. Si más adelante lo necesitás, estamos por acá.');
    } elseif ($demoAlCierre) {
        wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'cierre_comparando']);
        $texto = (string)$cfg['cierre_comparando'];
    } else {
        $texto = (string)($cfg['cierre_suave'] ?? 'Gracias por consultar. Cuando sea el momento, escribinos y retomamos desde acá.');
    }
    return [$texto . wabot_cierre_con_memoria($conv, $cfg)];
}

/**
 * ¿Se va porque está COMPARANDO (precios, presupuestos, el portfolio)?
 * Es el motivo de cierre en el que la demo gratis sí tiene sentido: le da
 * algo concreto con qué comparar. "Mañana lo veo" no es esto.
 */
function wabot_texto_esta_comparando($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    if (wabot_texto_pospone($t)) return false;
    return (bool)(
        preg_match('/\b(averiguando|consultando|comparando|comparar|cotizando|presupuestando)\b/u', $t)
        || preg_match('/\b(consultar|ver|viendo|mirando|averiguar|comparar)\b.{0,12}\b(precios?|presupuestos?|costos?|valores|opciones|cotizaciones)\b/u', $t)
        || preg_match('/\b(otras? (opciones|propuestas|presupuestos|cotizaciones)|varios presupuestos|un par de presupuestos)\b/u', $t)
        || preg_match('/\b(ver|revisar|mirar|chequear)\w*\b.{0,10}\b(el|los|su|sus|tu|tus)?\s*(portfolio|portafolio|trabajos|ejemplos)\b/u', $t)
    );
}

/** "Mañana lo veo", "más adelante", "la semana que viene": posterga, no compara. */
function wabot_texto_pospone($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    return (bool)preg_match('/\b(manana|mas adelante|en otro momento|mas tarde|la semana que viene|el mes que viene|cuando pueda|cuando tenga|lo pienso|lo veo despues|lo reviso despues|despues te (digo|aviso|escribo))\b/u', $t);
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
 * ¿Esto es otro proveedor ofreciéndonos SU servicio, no un cliente?
 *
 * DevZeppelin nos mandó su propia promo de páginas web con precios y dominios
 * (27-ago) y el bot le contestó "para qué rubro necesitás la web" y encima "no
 * hacemos logos", porque la palabra apareció en el listado del competidor. Es
 * un lead que nunca va a comprar y una respuesta que nos deja mal parados.
 *
 * Se pide la conjunción de dos señales, no una sola: que ofrezca (no que pida)
 * Y que hable de lo mismo que vendemos nosotros. Un cliente que dice "quiero
 * una web" no ofrece nada, y uno que ofrece empanadas no nombra desarrollo
 * web: hacen falta las dos para confundirse, y eso ya es un competidor.
 */
function wabot_texto_es_proveedor($texto) {
    $crudo = (string)$texto;
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $crudo));
    if ($t === '') return false;
    // Un mensaje corto no es un volante: los volantes vienen con la lista de
    // lo que incluyen. Este piso evita comerse un "hago paginas web" de
    // alguien que en realidad quiere una para su estudio de diseño.
    if (mb_strlen($t) < 90) return false;
    /* Y si en el mismo mensaje PIDE una web, es un cliente: una agencia de
     * marketing que pega su presentación y cierra con "quiero una página web
     * para mostrar nuestros servicios" se quedaba sin respuesta (9-sep). */
    if (wabot_texto_pide_web($crudo)) return false;

    // Nuestro propio rubro. Sin esto no hay confusión posible: el que ofrece
    // empanadas es un cliente raro, no un competidor.
    $mismoRubro = preg_match('/\b(pagina web|paginas web|sitio web|sitios web|desarrollo web|diseno web|landing|ecommerce|e commerce'
        . '|tienda online|hosting|dominio|posicionamiento|seo|community manager|marketing digital|redes sociales)\b/u', $t);
    if (!$mismoRubro) return false;

    /* Solo frases que un cliente prácticamente NUNCA escribe. Se descartaron a
     * propósito varias que parecían servir y no sirven, porque el costo de
     * equivocarse es ignorar a un cliente de verdad:
     *   "ofrecemos"          → "Ofrecemos fumigación... quería una página web".
     *   "nuestros servicios" → "quiero una web para mostrar nuestros servicios".
     *   "promo"              → "vi la promo de la página web, me interesa".
     *   "incluye"            → "el presupuesto incluye hosting y dominio?".
     *   "somos una agencia"  → una agencia que quiere SU propia web.
     * Lo que queda o nos interpela como comprador, o exhibe la cartera propia. */
    return (bool)preg_match(
        '/\b(consultanos|contactanos|escribinos'
        . '|te ofrezco|les ofrezco|te ofrecemos|les ofrecemos'
        . '|nuestras? (webs?|paginas?|sitios?) (son|serian)'
        . '|(conoce|mira|visita) nuestr[oa]s?'
        . '|nuestros? (planes?|precios?) (son|arrancan|empiezan|van) )\b/u', $t);
}

/**
 * Ya se le pidió el listado de datos para la demo y contesta un "ok".
 *
 * A esta altura "ok", "listo gracias", "dale" o un "si" pelado no aportan
 * nada: está confirmando que los va a mandar, no pidiendo otra cosa. El
 * 27-ago una clienta de cosméticos contestó "Ok", "Listo gracias" y "🫶 si", y
 * se llevó tres mensajes distintos diciéndole lo mismo ("cuando los tengas me
 * avisás"). Eso es un bot insistiendo, y encima sin avanzar.
 *
 * Un "si" pelado se acepta acá —y no en wabot_es_acuse(), que es general—
 * porque en esta fase la pregunta ya fue contestada: el listado salió, no hay
 * ninguna pregunta abierta que un "si" pueda estar respondiendo.
 */
function wabot_prediseno_acuse($texto, $conv) {
    if (!in_array(($conv['fase'] ?? ''), ['prediseno', 'prediseno_ref', 'prediseno_wsp'], true)) return false;
    if (!(array)($conv['prediseno_pedido'] ?? [])) return false;   // todavía no se pidió nada
    if (wabot_pide_repetir($texto)) return false;                  // "me lo repetís?" sí se contesta
    if (wabot_es_acuse($texto)) return true;
    // "si", "dale si", "👍 si": afirmativas peladas, nada más.
    return wabot_es_afirmativa($texto) && mb_strlen(wabot_normalizar_frase((string)$texto)) <= 12;
}

/**
 * La demo se ofrece SIEMPRE diciendo que es gratis.
 *
 * Los cinco textos de config lo dicen. El problema es que el modelo la ofrece
 * con palabras propias y se le cae la palabra: "Qué te parece si te armamos
 * una versión de tu web para que la veas antes de decidir?" (27-ago, óptica).
 * El cliente contestó "eso tiene algún fee mensual??" — o sea, entendió que
 * podía costar. Es lo único que hace que acepte: si no se dice, la oferta
 * deja de ser una oferta.
 *
 * Se agrega la aclaración al final del mensaje que ofrece, sin tocar el resto:
 * reemplazarlo entero perdería lo que el modelo haya sumado del contexto.
 */
function wabot_demo_siempre_gratis($mensajes, $cfg) {
    $mensajes = array_values((array)$mensajes);
    $gratis = '/\b(gratis|gratuit[ao]|sin costo|sin cargo|sin pagar|no te cuesta|no tiene costo|sin compromiso)\b/iu';
    foreach ($mensajes as $i => $m) {
        $t = wabot_normalizar_frase((string)$m);
        if ($t === '' || !wabot_texto_ofrece_demo($t)) continue;
        if (wabot_texto_pide_datos_prediseno($m, $cfg)) continue;
        if (wabot_texto_demo_ya_aceptada($m)) continue;
        if (preg_match($gratis, (string)$m)) continue;
        $aclaracion = trim((string)($cfg['demo_es_gratis'] ?? ''));
        if ($aclaracion === '') continue;
        $mensajes[$i] = rtrim((string)$m) . ' ' . $aclaracion;
    }
    return $mensajes;
}

/**
 * ¿Es el pedido de datos del prediseño y no un ofrecimiento?
 *
 * "Para prepararte la demo necesito esto:" matchea igual que un ofrecimiento,
 * pero acá el cliente ya dijo que sí: no hay nada que ofrecerle y la coletilla
 * de que es gratis solo alarga un mensaje cuyo texto Pablo fijó al pie de la
 * letra (29-ago). Se reconoce por el arranque del template de config, así que
 * sigue funcionando si el texto se edita desde el panel.
 */
function wabot_texto_pide_datos_prediseno($m, $cfg) {
    $base = trim((string)($cfg['prediseno'] ?? ''));
    if ($base === '' || strpos($base, '{faltan}') === false) return false;
    $arranque = trim((string)strstr($base, '{faltan}', true));
    if ($arranque === '') return false;
    return mb_stripos((string)$m, $arranque) !== false;
}

/**
 * ¿El cliente ya dijo que sí? El formulario (lleva el link) y el cierre del
 * prediseño ("con eso ya lo preparamos… te la dejo lista mañana") hablan de
 * armar la demo, pero ya no la ofrecen: la coletilla "Es gratis y sin
 * compromiso." les quedaba colgando al final (batería del 10-sep, 11-sep).
 */
function wabot_texto_demo_ya_aceptada($m) {
    $m = (string)$m;
    if (preg_match('~https?://|gokywebs\.com/form|\{link\}~iu', $m)) return true;
    $t = wabot_normalizar_frase($m);
    return (bool)preg_match('/\b(te la (dejo|dejamos|mando|mandamos|paso|pasamos) lista|(ya )?(lo|la) (preparamos|armamos|arrancamos)\b.{0,40}\b(manana|hoy|en menos de|lista)|con eso (ya )?(lo|la) (preparamos|armamos|arrancamos)|ya (tengo|tenemos) (todo|lo que)|la tenes lista)\b/u', $t);
}

/** ¿El mensaje está OFRECIENDO armar la demo? (no hablando de ella de pasada) */
function wabot_texto_ofrece_demo($t) {
    $t = wabot_normalizar_frase((string)$t);
    if ($t === '') return false;
    // Tiene que haber una propuesta de ARMARLA, no una mención cualquiera.
    return (bool)(preg_match('/\b(armamos|armarte|armo|preparamos|prepararte|preparo|mostramos|hacemos)\b'
            . '.{0,40}\b(demo|muestra|prediseno|version de tu (web|pagina)|version de la (web|pagina))\b/u', $t)
        || preg_match('/\b(demo|muestra|prediseno)\b.{0,30}\b(te la armo|te la armamos|te la preparo|la armamos|la preparamos)\b/u', $t));
}

/**
 * El bot NUNCA manda dos veces seguidas el mismo texto.
 *
 * El 27-ago cuatro clientes reales recibieron la misma pregunta una y otra
 * vez. El peor: "Alquiler de pantallas led" → "Contame un poco más, qué
 * vendés o qué servicio ofrecés?" SIETE veces, incluso después de que el
 * cliente contestara ("tenemos sonido e iluminación pero nos especializamos
 * en pantallas led"), de que avisara que no tenía nada más para contar, y de
 * que escribiera "???". Lo mismo con destapaciones, netbooks y catering.
 *
 * La causa de fondo es que el rubro no se reconoce, y eso se arregla aparte
 * ampliando el vocabulario — pero el vocabulario nunca va a estar completo.
 * Esto es la red que garantiza que, se reconozca o no, la charla avance:
 *
 *   1ª repetición → la misma pregunta REFORMULADA (contame_2 y sus pares).
 *   2ª repetición → se deriva. Si dos formas distintas de preguntar no
 *                   alcanzaron, seguir preguntando no lo va a arreglar.
 *
 * Se compara la tanda entera normalizada: dos tandas iguales son la misma
 * respuesta, aunque el modelo haya cambiado una tilde.
 */
function wabot_anti_repeticion($mensajes, &$conv, $cfg) {
    $mensajes = array_values(array_filter((array)$mensajes, function ($m) { return trim((string)$m) !== ''; }));
    if (!$mensajes) return $mensajes;

    /* Un globo que repite ENTERA una tanda anterior se cae, si la tanda trae
     * algo más. La comparación de abajo mira la tanda completa, así que el
     * mismo bloque de 539 caracteres salió dos turnos seguidos con solo
     * agregarle otro globo atrás (C08, 1-sep). Solo con tandas de 2+: si el
     * globo repetido es lo único que hay, decide la lógica de abajo, que sabe
     * reformular o derivar en vez de dejar al cliente sin respuesta. */
    if (count($mensajes) > 1) {
        $previas = (array)($conv['tandas_bot'] ?? []);
        $mensajes = array_values(array_filter($mensajes, function ($m) use ($previas) {
            $h = wabot_normalizar_frase((string)$m);
            return $h === '' || !in_array($h, $previas, true);
        }));
        if (!$mensajes) return $mensajes;
    }

    /* Historial corto, no solo el último mensaje: mirando uno solo, el bot
     * alternaba entre la pregunta y su reformulación para siempre (contame,
     * contame_2, contame, contame_2...), que es el mismo pozo con dos textos. */
    $huella = wabot_normalizar_frase(implode(' ', $mensajes));
    $historial = array_values((array)($conv['tandas_bot'] ?? []));
    if ($huella === '' || !in_array($huella, $historial, true)) {
        $historial[] = $huella;
        $conv['tandas_bot'] = array_slice($historial, -4);
        $conv['repeticiones_seguidas'] = 0;
        return $mensajes;
    }

    /* REPETIR UNA RESPUESTA QUE VOLVIERON A PEDIR NO ES ESTAR TRABADO.
     *
     * Una inmobiliaria preguntó el precio, se lo dieron, volvió a preguntar
     * "cuánto sale?" — lo más común del mundo— y como la tanda era idéntica el
     * anti-repetición la leyó como bot tildado y derivó, con lead=0 (E10,
     * 1-sep). El pozo que este guard existe para cortar es el bot repitiendo su
     * propia PREGUNTA sin que la charla avance; contestar dos veces lo mismo a
     * quien pregunta dos veces lo mismo es lo correcto.
     *
     * Se exige que el cliente esté pidiendo información reconocible y que la
     * tanda no traiga pregunta: así el "eso te lo confirma el equipo" cinco
     * veces seguidas —el caso que motivó el guard— sigue cortándose. */
    $ultimoCliente = wabot_ultimo_texto_cliente($conv);
    $pideInfo = $ultimoCliente !== '' && wabot_info_por_palabras($ultimoCliente, $conv['fase'] ?? null) !== null;
    if ($pideInfo && !wabot_salida_ya_pregunta($mensajes)) {
        wabot_evento_sesion($conv, 'repeticion_legitima');
        $conv['repeticiones_seguidas'] = 0;
        return $mensajes;
    }

    /* DESPUÉS DE LA DEMO NO SE DERIVA POR REPETICIÓN.
     *
     * Ahí los textos fijos se repiten por diseño: dos elogios seguidos ("me
     * encanta", "quedó hermosa") daban dos veces "Le cambiarías algo?", y dos
     * "la miro y te digo" dos veces "miralo tranquilo". Este guard lo leía
     * como bot trabado y mandaba la derivación GENÉRICA —"a partir de acá
     * sigue el desarrollador"— sin marcar postdemo_avisado: la charla se
     * cortaba justo cuando el cliente festejaba (auditoría 9-sep). El aviso
     * de handoff en postdemo lo decide wabot_postdemo_responder() con interés
     * real, y nadie más. Un pedido de cambio repetido se vuelve a acusar (cada
     * uno se anota); lo demás, ya dicho una vez, se calla. */
    if (($conv['fase'] ?? '') === 'postdemo') {
        $conv['repeticiones_seguidas'] = 0;
        $cambiosN = wabot_normalizar_frase((string)($cfg['postdemo_cambios'] ?? ''));
        if ($cambiosN !== '' && $huella === $cambiosN) return $mensajes;
        wabot_evento_sesion($conv, 'repeticion_postdemo_silenciada');
        return [];
    }

    /* "Cuando completes el formulario arrancamos" dos veces tampoco es un bot
     * trabado: el cliente sigue escribiendo cosas por chat con el link ya
     * mandado. Repetirlo insiste, derivarlo corta la venta; se calla y Pablo
     * lo ve en el panel (9-sep). */
    foreach (['prediseno_espera', 'prediseno_espera_datos'] as $kEspera) {
        $esperaN = wabot_normalizar_frase((string)($cfg[$kEspera] ?? ''));
        if ($esperaN !== '' && $huella === $esperaN) {
            $conv['repeticiones_seguidas'] = 0;
            wabot_evento_sesion($conv, 'repeticion_espera_silenciada');
            return [];
        }
    }

    /* Lo mismo con el link del formulario ya mandado, o con la demo ofrecida y
     * esperando el sí: el cliente sigue escribiendo por chat y el próximo paso
     * ya lo tiene. "Sí, quiero la muestra gratis" (V08, 10-sep) volvió a generar
     * el texto del formulario, esto lo leyó como bot trabado y derivó, y la
     * charla se cortó justo cuando la clienta mandaba sus datos. Se calla. */
    if ((!empty($conv['link_form_enviado']) && empty($conv['lead_creado'])
            && in_array(($conv['fase'] ?? ''), ['prediseno', 'prediseno_ref'], true))
        || wabot_espera_si_a_la_demo($conv, $cfg)) {
        $conv['repeticiones_seguidas'] = 0;
        wabot_evento_sesion($conv, 'repeticion_form_silenciada');
        return [];
    }

    $veces = (int)($conv['repeticiones_seguidas'] ?? 0) + 1;
    $conv['repeticiones_seguidas'] = $veces;
    wabot_evento_sesion($conv, 'repeticion_evitada', ['veces' => $veces]);

    if ($veces === 1) {
        $reformulado = wabot_texto_reformulado($mensajes, $cfg);
        $huellaRef = $reformulado !== null ? wabot_normalizar_frase($reformulado) : '';
        if ($reformulado !== null && !in_array($huellaRef, $historial, true)) {
            $historial[] = $huellaRef;
            $conv['tandas_bot'] = array_slice($historial, -4);
            return [$reformulado];
        }
    }

    // Segunda vuelta, o ya se probó la reformulación: lo toma Pablo. Si dos
    // formas distintas de preguntar no alcanzaron, una tercera tampoco.
    wabot_handoff_marcar($conv, 'repeticion');
    $conv['repeticiones_seguidas'] = 0;
    $conv['tandas_bot'] = [wabot_normalizar_frase((string)$cfg['derivar'])];
    return [(string)$cfg['derivar']];
}

/**
 * La versión "de otra forma" de un texto que ya se mandó. Solo hay para las
 * preguntas abiertas, que son las que se traban: para un precio o una
 * respuesta de info no existe reformulación, y ahí conviene derivar directo.
 */
function wabot_texto_reformulado($mensajes, $cfg) {
    if (count($mensajes) !== 1) return null;
    $uno = wabot_normalizar_frase((string)$mensajes[0]);
    $pares = [
        'contame'           => 'contame_2',
        'desempate_turnos'  => 'desempate_turnos_2',
        'desempate_comercio' => 'desempate_comercio_2',
        'desempate_cursos'  => 'desempate_cursos_2',
    ];
    foreach ($pares as $original => $alterno) {
        if (trim((string)($cfg[$original] ?? '')) === '' || trim((string)($cfg[$alterno] ?? '')) === '') continue;
        if (wabot_normalizar_frase((string)$cfg[$original]) === $uno) return (string)$cfg[$alterno];
    }
    return null;
}

/* ===================================================================
 * PUNTO ÚNICO DE SALIDA
 * ===================================================================
 *
 * Antes de esto había CUATRO caminos distintos hacia el cliente y cada uno
 * aplicaba un subconjunto distinto de filtros:
 *
 *   webhook principal  → gratis + sin_repetidos + una_pregunta + anti_repeticion
 *   webhook reintento  → sin_repetidos y nada más
 *   crons              → nada
 *   batería de QA      → nada (llamaba wabot_responder() pelado)
 *
 * O sea: cada filtro nuevo nacía cubriendo un camino de cuatro, que es el
 * mismo error que ya se cometió con el empujón del logo y con el guard del
 * pitch —"enganchado en un solo camino"— y además la batería medía algo que
 * no era lo que recibía el cliente, así que un bug podía pasar los tests y
 * salir igual por WhatsApp.
 *
 * Ahora todos pasan por acá. El modo distingue los dos usos reales:
 *
 *   'turno'  → el bot está contestando un mensaje. Pipeline completo.
 *   'emisor' → un cron manda un texto fijo suyo (seguimiento, última llamada,
 *              confirmación). No corresponde el anti-repetición —su texto no
 *              es una repetición de la charla— pero sí la limpieza y la
 *              coherencia de estado.
 */
function wabot_salida_preparar($mensajes, &$conv, $cfg, $modo = 'turno') {
    $mensajes = array_values(array_filter((array)$mensajes, function ($m) {
        return trim((string)$m) !== '';
    }));
    if (!$mensajes) return $mensajes;

    $mensajes = wabot_salida_limpiar($mensajes);
    $mensajes = wabot_salida_sin_promesas($mensajes, $cfg);

    if ($modo === 'turno') {
        $mensajes = wabot_demo_siempre_gratis($mensajes, $cfg);
        $mensajes = wabot_sin_repetidos_consecutivos($mensajes);
        $mensajes = wabot_una_sola_pregunta($mensajes);
    }

    // Va después de los filtros de texto (para leer el mensaje final) y antes
    // del anti-repetición (que puede reemplazar la tanda por la derivación).
    $mensajes = wabot_salida_coherencia($mensajes, $conv, $cfg);

    if ($modo === 'turno') {
        $mensajes = wabot_anti_repeticion($mensajes, $conv, $cfg);
        $mensajes = wabot_salida_sin_avance($mensajes, $conv, $cfg);
    }

    /* La personalización vivía SOLO en wabot_enviar(), que la batería no llama:
     * por eso un "Perfecto, {nombre}." se veía crudo al revisar los escenarios
     * y no había forma de saber si era un bug real o del arnés. Acá la ve
     * cualquiera que mire la salida. Sigue además en wabot_enviar() como última
     * red —ahí es donde tiene que estar, para lo que se mande desde donde sea—
     * y aplicarla dos veces no cambia nada: sin marcadores no hay qué
     * reemplazar, y la muletilla no se vuelve a rotar porque ya dejó de
     * coincidir con la anterior. */
    foreach ($mensajes as $i => $m) {
        $mensajes[$i] = wabot_variar_muletilla(wabot_personalizar((string)$m, $conv), $conv);
    }

    return array_values($mensajes);
}

/**
 * LA CHARLA NO AVANZA.
 *
 * wabot_anti_repeticion() compara el TEXTO, así que solo caza al bot que manda
 * dos veces la misma frase. En modo agente el modelo reformula, y entonces el
 * pozo es invisible: en la batería del 27-ago un marketplace recibió tres
 * veces la misma pregunta con tres redacciones distintas —"cuántos vendedores
 * estimás", "cuántas personas usarían el sistema", "cuántos vendedores o
 * usuarios estimás"— y hasta un "prefiero hablarlo con alguien técnico" en el
 * medio no lo sacó del loop.
 *
 * Por eso este mira el ESTADO y no las palabras: si el bot vuelve a preguntar
 * y nada de lo que hace progresar la venta cambió desde el turno anterior, la
 * charla está trabada por más que la pregunta suene distinta. A la tercera la
 * toma Pablo, la misma convención que ya usaban los desempates.
 *
 * El sello incluye los datos que se van juntando (descripción, colores, nombre
 * del negocio, cantidad de productos), no solo la fase: si no, pedir los datos
 * del prediseño de a partes contaría como estar trabado.
 */
function wabot_salida_sin_avance($mensajes, &$conv, $cfg) {
    if (!$mensajes) return $mensajes;
    // Postdemo tiene su propia lógica de derivación (interés real): acá no.
    if (in_array(($conv['fase'] ?? ''), ['derivado', 'postdemo'], true)) return $mensajes;

    $hayPregunta = false;
    foreach ($mensajes as $m) {
        if (mb_strpos(wabot_texto_sin_links($m), '?') !== false) { $hayPregunta = true; break; }
    }

    $campos = ['fase', 'tipo', 'cierre', 'nombre_negocio', 'descripcion', 'colores',
               'referencia', 'productos_cantidad', 'sistema_problema', 'sistema_usuarios'];
    $partes = [];
    foreach ($campos as $c) $partes[] = trim((string)($conv[$c] ?? ''));
    foreach (['precio_dado', 'lead_creado', 'pitch_hecho', 'nombre_confirmado'] as $f) {
        $partes[] = (int)!empty($conv[$f]);
    }
    $sello = md5(implode('|', $partes));

    /* El que PREGUNTA no está trabado: está averiguando. Después del precio,
     * "se pueden sacar turnos online?" y "puede estar en inglés?" se contestan
     * y el bot vuelve a ofrecer la demo con una pregunta, sin que cambie nada
     * del estado: a la segunda duda la charla se derivaba (batería del 11-sep).
     * Esto es para el bot que repregunta lo mismo mientras el cliente no le da
     * lo que falta, no para el cliente que saca sus dudas. */
    $clientePregunta = wabot_mensaje_pregunta_algo(wabot_ultimo_texto_cliente($conv));

    if (!$hayPregunta || $clientePregunta || $sello !== (string)($conv['avance_sello'] ?? '')) {
        $conv['avance_sello'] = $sello;
        $conv['turnos_sin_avance'] = 0;
        return $mensajes;
    }

    $veces = (int)($conv['turnos_sin_avance'] ?? 0) + 1;
    $conv['turnos_sin_avance'] = $veces;
    if ($veces < 2) return $mensajes;

    wabot_evento_sesion($conv, 'sin_avance_derivado', ['turnos' => $veces]);
    wabot_handoff_marcar($conv, 'sin_avance');
    $conv['turnos_sin_avance'] = 0;
    return [(string)$cfg['derivar']];
}

/**
 * La versión de un solo texto, para los crons.
 *
 * Devuelve el texto listo para enviar, o cadena vacía si no corresponde
 * mandarlo. Los emisores automáticos llaman a esto antes de wabot_enviar():
 * un seguimiento no puede salir con una promesa que el bot no puede hacer, ni
 * dejar la conversación anunciando una derivación que nunca ocurre.
 */
function wabot_salida_emisor_texto($texto, &$conv, $cfg) {
    $r = wabot_salida_preparar([$texto], $conv, $cfg, 'emisor');
    return $r ? trim((string)$r[0]) : '';
}

/**
 * Texto interno que se escapa al cliente.
 *
 * A Multiservice Ya le llegó literalmente `waited` antes de la respuesta
 * (27-ago). No sale de ningún texto nuestro: es andamiaje del modelo que se
 * cuela como si fuera parte del mensaje.
 *
 * La lista es corta y solo tiene tokens que NUNCA son un mensaje válido en
 * castellano, por el mismo criterio que wabot_castellanizar(): un detector
 * amplio de "esto parece técnico" se comería texto legítimo.
 */
function wabot_salida_limpiar($mensajes) {
    $basura = ['waited', 'null', 'undefined', 'nan', 'true', 'false',
               '[object object]', 'functionresponse', 'functioncall',
               'tool_code', 'tool_outputs', 'tool_call', 'assistant', 'model'];
    $out = [];
    foreach ((array)$mensajes as $m) {
        $lineas = preg_split('/\R/u', (string)$m);
        $limpias = [];
        foreach ($lineas as $l) {
            $n = mb_strtolower(trim($l, " \t.:;-*`\"'"));
            if ($n !== '' && in_array($n, $basura, true)) continue;
            $limpias[] = $l;
        }
        $t = trim(implode("\n", $limpias));
        // El prompt del agente prohíbe emojis y el modelo, al reproducir el
        // saludo del menú, deja "Hola Contame..." pegado sin puntuación.
        $t = preg_replace('/^Hola\s+Contame\b/u', 'Hola, contame', $t);
        if ($t === '') continue;
        if (wabot_texto_parece_interno($t)) continue;
        $out[] = $t;
    }
    return $out;
}

/**
 * MENSAJE QUE NO ES UN MENSAJE.
 *
 * Dos casos reales del 1-sep que ningún filtro frenó:
 *   - "opaulosegundo" — una sola palabra sin sentido, al que preguntó si
 *     entregan el código.
 *   - "Desactivada la invitación a la demo en globo aparte por repetición.
 *     Mandá solo el texto solicitado." — el modelo copiando el vocabulario de
 *     sus propias instrucciones, a la clienta que dijo "dale, me interesa".
 *
 * Dos detectores angostos, por el mismo criterio que wabot_salida_limpiar():
 * uno amplio de "parece raro" se comería texto legítimo.
 *
 *   1. Una sola palabra que no es un acuse ("Dale", "Perfecto", "Listo").
 *      Ninguna respuesta real del bot es una palabra suelta fuera de esas.
 *   2. Jerga del andamiaje que jamás aparece en un mensaje comercial: "globo
 *      aparte", "texto solicitado", nombres de herramientas con guion bajo.
 */
function wabot_texto_parece_interno($texto) {
    $crudo = trim((string)$texto);
    if ($crudo === '') return false;

    if (!preg_match('/\s/u', $crudo)) {
        // Un link solo NO es basura: el globo de la demo puede ser la URL pelada.
        if (preg_match('#^(https?://|www\.)#iu', $crudo)
            || preg_match('#^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(/\S*)?$#iu', $crudo)) return false;
        $solo = wabot_normalizar_frase($crudo);
        $acusesValidos = ['ok', 'oka', 'okey', 'dale', 'listo', 'perfecto', 'genial', 'buenisimo',
                          'barbaro', 'joya', 'excelente', 'gracias', 'hola', 'buenas', 'si', 'no',
                          'de nada', 'entendido', 'anotado', 'hecho', 'igualmente'];
        if (!in_array($solo, $acusesValidos, true)) return true;
    }

    $t = wabot_normalizar_frase($crudo);
    if (preg_match('/\b(globo aparte|tanda de mensajes|texto solicitado|segun las instrucciones'
        . '|el prompt|del prompt|como modelo de lenguaje|herramienta terminal'
        . '|consultar_info|dar_precio|pedir_prediseno|guardar_prediseno|anotar_cambios'
        . '|confirmar_pago|cambiar_tipo|anotar_datos|functiondeclaration)\b/u', $t)) return true;
    if (preg_match('/\bdesactivad[ao]\b.{0,30}\b(invitacion|oferta|cta|repeticion)\b/u', $t)) return true;

    return false;
}

/**
 * Promesas comerciales que el bot no tiene autoridad para hacer.
 *
 * A Cien Colores le dijo "nos ajustamos a tu presupuesto" sin que la clienta
 * hubiera dicho cuál era su presupuesto y sin que existiera un precio acordado
 * para lo que pedía (27-ago). El guard de regateo que ya había vive en
 * wabot_validar_redaccion() y busca montos y porcentajes, así que una promesa
 * sin ningún número al lado le pasaba por al lado.
 *
 * Se saca la oración, no el mensaje entero: el resto suele estar bien. Si al
 * sacarla no queda nada, contesta el texto oficial de la objeción de precio.
 */
function wabot_salida_sin_promesas($mensajes, $cfg) {
    $prohibido = '/\b(nos ajustamos|me ajusto|lo ajustamos|nos acomodamos|me acomodo|nos adaptamos|me adapto)\b'
               . '[^.!?\n]{0,40}\b(presupuesto|bolsillo|posibilidades|lo que puedas)\b'
               . '|\b(hacemos|hago|vemos|arreglamos|conseguimos) un (precio|arreglo|descuento) (especial|mejor|aparte)\b'
               . '|\b(algo|todo) se puede (arreglar|acomodar|negociar) con el (precio|valor|monto)\b/iu';

    $out = [];
    foreach ((array)$mensajes as $m) {
        $texto = (string)$m;
        if (!preg_match($prohibido, $texto)) { $out[] = $texto; continue; }

        // Se parte en oraciones conservando el signo final de cada una.
        $partes = preg_split('/(?<=[.!?\n])\s*/u', $texto, -1, PREG_SPLIT_NO_EMPTY);
        $quedan = [];
        foreach ($partes as $parte) {
            if (preg_match($prohibido, $parte)) continue;
            $quedan[] = trim($parte);
        }
        $limpio = trim(implode(' ', $quedan));
        if ($limpio !== '') { $out[] = $limpio; continue; }

        /* Sin la charla a mano: los montos de 'caro' se dicen en general
         * (10-sep), y la frase del link del presupuesto se va si no hay tipo. */
        $oficial = trim(wabot_link_presupuesto_completar(
            wabot_precio_placeholders((string)($cfg['caro'] ?? ''), null, $cfg), [], $cfg));
        if ($oficial !== '') $out[] = $oficial;
    }
    return $out;
}

/**
 * EL TEXTO PROMETE, EL ESTADO TIENE QUE CAMBIAR.
 *
 * Es la falla que más se repite en modo agente y la causa común de cinco de
 * los errores del 27-ago: el modelo ESCRIBE la derivación o la despedida pero
 * no llama la herramienta, así que el mensaje sale por WhatsApp y la
 * conversación queda en la fase de antes, viva y vendiendo.
 *
 *   Leoo      → "te comunico directamente con el desarrollador", fase `menu`.
 *   Whitesoul → "te paso con el desarrollador" y al turno siguiente vuelve a
 *               tomar la gestión él mismo: "te la dejo lista mañana".
 *   Cien Col. → "te paso directamente con él", el cliente dice "Okok" y el bot
 *               vuelve al formulario de la demo.
 *   Papelería → se despide bien y en el MISMO turno dispara otro globo con el
 *               precio y el link.
 *   Icover    → se despide tras el "no puedo pagarlo", pero sin cierre marcado
 *               el "igualmente" se lee como aceptación y sale el formulario.
 *
 * Ya existía el guard equivalente para el precio (wabot_texto_pide_prediseno,
 * "anunció y no llamó la herramienta"); para la derivación y el cierre la
 * regla estaba solo en el prompt, que es justo lo que este proyecto ya
 * aprendió que no alcanza.
 *
 * No se reescribe el mensaje: el texto del modelo ya dice lo correcto, lo que
 * falta es el estado. Y nada va DESPUÉS de una despedida o una derivación en
 * el mismo turno — ese fue exactamente el segundo globo de Papelería.
 */
function wabot_salida_coherencia($mensajes, &$conv, $cfg) {
    if (!$mensajes) return $mensajes;
    if (($conv['fase'] ?? '') === 'derivado') return $mensajes;

    foreach ($mensajes as $i => $m) {
        $texto = (string)$m;

        // Los textos oficiales que HABLAN de la derivación sin prometerla acá
        // y ahora (info.soy_bot dice "cuando hace falta algo más te paso con
        // el desarrollador") no son un anuncio: son una descripción.
        if (wabot_salida_es_texto_de_config($texto, $cfg)) continue;

        if (wabot_texto_anuncia_handoff($texto)) {
            wabot_handoff_marcar($conv, 'anuncio_sin_transicion');
            wabot_evento_sesion($conv, 'handoff_por_anuncio');
            return array_slice($mensajes, 0, $i + 1);
        }

        if (wabot_texto_se_despide($texto)) {
            /* Solo cuenta como cierre si el CLIENTE se estaba despidiendo o
             * rechazando. Un "gracias!" con la venta viva se contesta con una
             * cortesía ("de nada, quedamos a disposición") que suena a
             * despedida, y marcar cierre ahí bloqueaba el seguimiento del lead
             * más recuperable: la peluquera que lo iba a hablar con la socia
             * quedó sin follow-up por agradecer (N02, 1-sep). */
            if (empty($conv['cierre']) && wabot_cliente_se_despidio($conv)) {
                $conv['cierre'] = 'despedida';
                $conv['seguimiento_bloqueado'] = true;
                $conv['seguimiento_estado'] = 'bloqueado';
                $conv['cta_muestra'] = true;
                wabot_evento_sesion($conv, 'cierre_por_despedida');
                return array_slice($mensajes, 0, $i + 1);
            }
            if (!empty($conv['cierre'])) return array_slice($mensajes, 0, $i + 1);
        }
    }
    return $mensajes;
}

/** ¿El texto es, tal cual, uno de los textos oficiales de la config? */
function wabot_salida_es_texto_de_config($texto, $cfg) {
    $n = wabot_normalizar_frase((string)$texto);
    if ($n === '') return false;
    foreach ((array)($cfg['info'] ?? []) as $oficial) {
        if (!is_string($oficial) || trim($oficial) === '') continue;
        $o = wabot_normalizar_frase($oficial);
        if ($o === '') continue;
        /* Igualdad, no contención: con "contiene" alcanzaba con arrancar el
         * globo con un texto oficial para colar cualquier promesa atrás. Pasó
         * dos veces el 1-sep: "Sí, también desarrollamos aplicaciones [texto
         * de apps]... te paso directamente con el desarrollador. Te escribe en
         * unos minutos" — y la coherencia lo salteaba entero, así que el
         * anuncio salió sin cambiar la fase. El margen de 40 caracteres deja
         * pasar la personalización (el nombre, un "Perfecto," adelante), no
         * una oración nueva. */
        if ($o === $n) return true;
        if (mb_strpos($n, $o) !== false && (mb_strlen($n) - mb_strlen($o)) <= 40) return true;
    }
    return false;
}

/**
 * ¿El mensaje anuncia que la charla pasa a una persona, acá y ahora?
 *
 * Tiene que ser un compromiso del turno, no una descripción general de cómo
 * trabajamos ("si hace falta algo más te paso con el desarrollador"), por eso
 * se descarta cuando viene detrás de un condicional.
 */
function wabot_texto_anuncia_handoff($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;

    /* Lista corta y explícita, NO la palabra "si" a secas: wabot_normalizar_frase
     * deja "sí" y "si" idénticos, así que un "Sí, te paso con el desarrollador"
     * —que es un anuncio de verdad— se habría descartado como condicional. */
    $condicional = '/\b(cuando|si|por si) (hace falta|hiciera falta|necesitas|necesitaras|queres)\b.{0,50}$/u';
    /* El "con" tiene que ser CON UNA PERSONA. "Te paso el detalle con lo que
     * incluye", "te paso el link con los trabajos", "la conecto con el pixel"
     * dejaban la charla en fase derivado sin que nadie la derivara: el texto
     * salía igual pero el estado cambiaba (auditoría 9-sep). */
    $conPersona = '(con (el desarrollador|pablo|una persona|un asesor|alguien|el equipo|quien corresponde|el responsable|el encargado|un humano)'
                . '|directamente con|con el(?=\s+(para|asi|que|y|ahora|directamente|desde|en un|en unos|apenas|cuando)\b|\s*$))';
    $patrones = [
        '/\b(te|lo|la) (paso|comunico|derivo|conecto|pongo en contacto)\b.{0,30}\b' . $conPersona . '/u',
        '/\bte (va a escribir|escribe|contacta|va a contactar)\b.{0,30}\b(el desarrollador|pablo)\b/u',
        '/\b(el desarrollador|pablo)\b.{0,30}\b(te (va a escribir|escribe|contacta)|sigue|toma|continua)\b/u',
        '/\b(paso|derivo|pasamos) (tu|el) (consulta|caso|tema|pedido)\b/u',
        '/\bhablas directamente con\b/u',
    ];

    foreach ($patrones as $p) {
        if (!preg_match($p, $t, $m, PREG_OFFSET_CAPTURE)) continue;
        // PREG_OFFSET_CAPTURE devuelve el offset en BYTES, y el arranque de un
        // match siempre cae en borde de carácter: substr() da el prefijo válido.
        $antes = substr($t, 0, $m[0][1]);
        if (preg_match($condicional, $antes)) continue;   // "cuando hace falta…"
        return true;
    }
    return false;
}

/**
 * ¿El mensaje cierra la charla?
 *
 * Deliberadamente ANGOSTO. Marcar un cierre que no existe deja al bot mudo
 * ante los acuses y frena todos los seguimientos, que es peor que el bug que
 * arregla: por eso hace falta una fórmula de despedida completa Y que no haya
 * ninguna pregunta abierta en el mensaje. Un "cualquier duda escribime" al pie
 * de una respuesta normal no cierra nada.
 */
/**
 * ¿El último mensaje del cliente fue un adiós o un rechazo? Distingue la
 * despedida real ("chau, gracias por todo") del simple agradecimiento
 * ("gracias!") que deja la charla abierta. Un acuse no alcanza: tiene que
 * haber un adiós con todas las letras o un "no me interesa".
 */
function wabot_cliente_se_despidio($conv) {
    $t = wabot_normalizar_frase(wabot_ultimo_texto_cliente($conv));
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(chau|adios|hasta (luego|pronto|otro momento)|nos vemos|que (estes|les vaya) bien|suerte|exitos)\b/u', $t)
        || preg_match('/\b(no me interesa|no estoy interesad|no gracias|dejalo ahi|lo dejamos (aca|ahi)|no va a poder ser|no lo vamos a hacer)\b/u', $t)
        // Rechazo por plata (caso Icover: "no puedo pagarlo"): también habilita
        // a la despedida del bot a cerrar de verdad.
        || preg_match('/\bno (lo )?(puedo|podemos|voy a poder) pagar\w*\b/u', $t)
        || preg_match('/\bgracias pero no\b/u', $t)
    );
}

function wabot_texto_se_despide($texto) {
    $crudo = (string)$texto;
    if (mb_strpos($crudo, '?') !== false) return false;

    $t = wabot_normalizar_frase($crudo);
    if ($t === '') return false;

    $despedidas = [
        '/\bgracias por (escribirnos|consultar|tu consulta|contactarnos)\b/u',
        '/\bsi mas adelante lo necesitas\b/u',
        '/\bcuando sea el momento\b[^.]{0,40}\bescribinos\b/u',
        '/\b(exitos|mucha suerte|que te vaya (muy )?bien)\b/u',
        '/\bno te escribimos mas\b/u',
        '/\bquedamos a disposicion\b/u',
    ];
    foreach ($despedidas as $p) {
        if (preg_match($p, $t)) return true;
    }
    return false;
}

/**
 * Un proveedor no recibe respuesta: contestarle es darle conversación a quien
 * nos está vendiendo a nosotros. Queda anotado para que Pablo lo vea en el
 * panel y no entra a ningún seguimiento automático.
 */
function wabot_cerrar_proveedor(&$conv) {
    $conv['seguimiento_bloqueado'] = true;
    $conv['seguimiento_estado'] = 'bloqueado';
    $conv['cierre'] = 'proveedor';
    $conv['espera_avisada'] = true;
    wabot_evento_sesion($conv, 'proveedor_detectado');
    return [];
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
 * ¿Está pidiendo que le repitan lo último? Es la única razón para volver a
 * mandar un texto que ya se mandó: sin esto, el guard que impide repetir el
 * listado del prediseño dejaría colgado al que de verdad lo perdió.
 */
function wabot_pide_repetir($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(repet[ií]\w*|repetime|de nuevo|otra vez|nuevamente)\b/u', $t)
        || preg_match('/\bno me (lleg\w+|aparec\w+|carg\w+)\b/u', $t)
        || preg_match('/\b(que|cuales|cual)\b.{0,15}\b(eran|era|es|son)\b.{0,20}\b(datos|cosas|informacion)\b/u', $t)
        || preg_match('/\bme (lo|los|la|las) (pas[aá]s|mand[aá]s|reenvi[aá]s|volv[eé]s a (pasar|mandar))\b/u', $t)
        || preg_match('/\bvolv[eé]me? a (pasar|mandar|decir)\b/u', $t)
    );
}

/**
 * ¿El mensaje NO es una duda, aunque tampoco sea un acuse de recibo?
 *
 * "Este es mi face" (está pasando material) y "Que lo haga vía wasap" (está
 * indicando cómo quiere que lo contacten) no preguntan nada, y sin embargo los
 * dos se llevaron el comodín "esa duda te la va a poder contestar el
 * desarrollador" (caso Jorge, 26-ago). Ese texto es la respuesta a una duda:
 * sin duda no corresponde.
 *
 * Devuelve el TIPO de mensaje ('material' | 'indicacion') o null si no está
 * seguro. A propósito reconoce poco: solo dos formas muy marcadas. Un
 * detector amplio de "esto no es pregunta" se comería preguntas reales
 * escritas sin signo, que son la mayoría en WhatsApp.
 */
/**
 * El texto sin los links que traiga.
 *
 * Un link es MATERIAL, no una pregunta, y sus palabras no significan lo que
 * parecen: la Dra. Gascón mandó `https://alan-uviedo.pixieset.com/yesikafinales/`
 * para pasar sus fotos y el bot le contestó sobre el certificado SSL, el
 * cifrado y si la pueden hackear — porque "https" estaba en la lista de
 * palabras de la clave `seguridad` y el dominio se lo comió el matcher
 * (29-ago). Ella tuvo que aclararle "Fotos".
 *
 * Cualquier matcher de INTENCIÓN tiene que mirar lo que el cliente escribió
 * alrededor del link, no el link. La detección de links en sí (referencias,
 * "ya tengo web") no usa esto: ahí la URL es el dato.
 */
function wabot_texto_sin_urls($texto) {
    $t = preg_replace('#\b(?:https?://|www\.)\S+#iu', ' ', (string)$texto);
    $t = preg_replace('#\b[a-z0-9][a-z0-9\-]*\.(?:com|net|org|ar|io|app|co|es|shop|store|online|me|info|biz|tv|link|site|web)(?:\.[a-z]{2,3})?(?:/\S*)?#iu', ' ', $t);
    return trim(preg_replace('/\s+/u', ' ', $t));
}

/**
 * ¿Esta palabra puede ser castellano? Conservador a propósito: solo dice que sí
 * es implausible cuando hay una marca dura (sin vocales, cuatro consonantes
 * seguidas, larguísima, o una sílaba repetida en bucle).
 */
function wabot_token_implausible($tok) {
    $l = mb_strlen($tok);
    if ($l < 3) return false;                                  // "ok", "si", "no"
    if (!preg_match('/[aeiou]/u', $tok)) return true;           // "zzz", "hmm"
    /* Cinco consonantes seguidas, no cuatro: "construcción" e "instructor"
     * traen "nstr". Y el techo de 11 letras se fue: Electricista, Veterinaria,
     * Inmobiliaria, Nutricionista, Restaurante, Distribuidora, Indumentaria,
     * Marroquinería, Gastronomía y Emprendimiento tienen 11 o más, y cada uno
     * contestando "a qué te dedicás" se llevaba "no estoy pudiendo entender el
     * mensaje" (auditoría 9-sep). Lo que delata al teclado apretado al azar es
     * la falta de vocales, no el largo. */
    if (preg_match('/[^aeiou]{5,}/u', $tok)) return true;       // "bxjxd"
    if (preg_match_all('/[aeiou]/u', $tok) / $l < 0.2) return true;   // "bxjxdid": una vocal en siete
    if ($l >= 18) return true;                                  // ningún rubro real es tan largo
    if (preg_match('/(..)\1{2,}/u', $tok)) return true;         // "dududu"
    return false;
}

/**
 * El mensaje no es texto: es el teclado apretado al azar.
 *
 * "Bxjxdid", "Djdududeididurureueieies". El bot les contestó tres veces la
 * misma pregunta con otras palabras, y una de ellas fue "Parece que se te
 * tiroteó el teclado" —que la escribió el modelo, no está en ninguna config—
 * (29-ago). Con esto el turno no llega al modelo: la escalera de respuestas es
 * fija y se corta sola.
 */
function wabot_texto_ininteligible($texto) {
    $t = wabot_normalizar_frase(wabot_texto_sin_urls((string)$texto));
    if ($t === '') return false;
    if (preg_match('/\d/u', $t)) return false;                  // un número siempre puede significar algo
    $tokens = array_values(array_filter(explode(' ', $t)));
    if (!$tokens || count($tokens) > 4) return false;           // una frase larga se interpreta, no se descarta
    foreach ($tokens as $tok) {
        if (!wabot_token_implausible($tok)) return false;       // alcanza UNA palabra real
    }
    return true;
}

/**
 * El mensaje no destraba nada: no dice el rubro, no pregunta y no aporta datos.
 * Solo se usa para seguir contando después de un mensaje ininteligible, nunca
 * para cortarle el turno a alguien que está hablando normal.
 */
function wabot_mensaje_no_destraba($texto) {
    if (strpos((string)$texto, '?') !== false) return false;
    if (wabot_aporta_descripcion($texto)) return false;
    if (wabot_info_por_palabras($texto) !== null) return false;
    if (wabot_fallback_rubro_local($texto) !== null) return false;
    return true;
}

/** ¿El mensaje es solo un link (con o sin un par de palabras sueltas)? */
function wabot_texto_es_solo_link($texto) {
    $crudo = trim((string)$texto);
    if ($crudo === '') return false;
    $sin = wabot_texto_sin_urls($crudo);
    if ($sin === $crudo) return false;                       // no traía ningún link
    $resto = wabot_normalizar_frase($sin);
    return $resto === '' || count(array_filter(explode(' ', $resto))) <= 2;
}

function wabot_texto_no_es_consulta($texto) {
    $crudo = (string)$texto;
    // Un link pelado es material aunque venga con un signo de pregunta detrás.
    if (wabot_texto_es_solo_link($crudo)) return 'material';
    if (strpos($crudo, '?') !== false) return null;
    $t = wabot_normalizar_frase($crudo);
    if ($t === '') return null;
    if (count(explode(' ', $t)) > 12) return null;

    // "Este es mi face", "te paso el link", "ahí va mi instagram".
    if (preg_match('/^(este|esta|ese|esa|aca|ahi|aqui)\s+(es|va|te|esta)\b/u', $t)
        || preg_match('/^(te|les|le)\s+(paso|mando|envio|dejo|comparto|adjunto)\b/u', $t)
        || preg_match('/^ahi\s+(te|le|les)\s+(paso|mando|envio|dejo|comparto)\b/u', $t)) {
        return 'material';
    }
    // "Que lo haga vía wasap", "que me escriba por acá", "que me llame".
    if (preg_match('/^que\s+(me|nos|lo|la|le|les|te)\s+\p{L}+/u', $t)
        || preg_match('/\b(prefiero|preferiria|mejor)\s+que\s+(me|nos)\s+\p{L}+/u', $t)) {
        return 'indicacion';
    }
    // "Es para una página de reseñas": está diciendo PARA QUÉ es la web, o sea
    // el rubro — la respuesta a la primera pregunta del bot. Se llevó el
    // comodín del desarrollador sin haber preguntado nada (Denise, 27-ago).
    if (preg_match('/^(es|seria|va a ser|sera)\s+(para|un|una|de)\b/u', $t)
        || preg_match('/^(necesito|quiero|busco|queria|estoy buscando)\s+(una?\s+)?(pagina|web|sitio|landing|tienda)\b/u', $t)) {
        return 'rubro';
    }
    return null;
}

/**
 * ¿Pidió la demo explícitamente? El CTA del anuncio dice "Quiero mi demo
 * gratis": volver a preguntarle "¿querés que la preparemos?" a quien entró
 * diciendo eso es no haberlo escuchado (caso Antuz, 21-ago).
 */
/**
 * Pidió hablar por teléfono, o hablar con una persona.
 *
 * Marcelo escribió "Llamame", el bot le contestó que no suele hacer llamadas y
 * el cliente cerró con "Entonces no me interesa" (28-ago). Ese mismo día otro
 * cliente pidió hablar personalmente y el bot derivó bien — porque ahí el
 * clasificador lo etiquetó pide_humano. El comportamiento correcto no puede
 * depender de que el modelo acierte: acá se resuelve con reglas.
 *
 * Una llamada NUNCA se rechaza. Se deriva a Pablo y él la coordina.
 */
/**
 * El cliente dijo que NO tiene página. Sirve para no pedirle el link de una
 * web que acaba de decir que no existe: Overlord Magazine explicó en un audio
 * que quería armar la primera y el bot le contestó "pasame el link de tu
 * página actual" (28-ago).
 */
/**
 * ¿El cliente habló alguna vez del tema de esta clave de info?
 *
 * S. Marcela recibió "Sí, la podemos hacer bilingüe. Tiene un adicional de
 * $30.000" sin haber preguntado nada de idiomas (28-ago). Una respuesta a una
 * pregunta que no existe hace pensar que el bot se confundió de conversación.
 *
 * Solo se controlan las claves ANGOSTAS: las que contestan una función muy
 * puntual, donde la respuesta suelta no tiene ninguna lectura razonable. Las
 * anchas (proceso, pago, plazos, precio, confianza) quedan afuera a propósito:
 * ahí una respuesta de más no descoloca a nadie, y el falso rechazo costaría
 * más que el falso positivo.
 *
 * Se mira el mensaje de ahora y los últimos del cliente, porque puede haber
 * preguntado en un turno y el bot contestarle en el siguiente.
 */
function wabot_info_clave_tiene_rastro($clave, $texto, $conv = null) {
    static $rastros = [
        'bilingue'      => '(bilingue|biling|idioma|idiomas|ingles|english|portugues|italiano|traduc|dos lenguas|otro idioma)',
        'emails'        => '(mail|mails|email|correo|correos|casilla|casillas|arroba|outlook|gmail)',
        'accesos'       => '(acceso|accesos|ftp|cpanel|credencial|credenciales|panel del hosting|entrar al hosting)',
        'licencias'     => '(licencia|licencias|plugin|plugins|sdk|libreria|librerias)',
        'entrega_codigo'=> '(codigo|backup|respaldo|codigo fuente|repositorio|github|los archivos)',
        'pixel'         => '(pixel|analytics|tag manager|codigo de seguimiento|conversion|conversiones|remarketing)',
        'maps'          => '(maps|mapa|mapita|google maps|ubicacion en el mapa|como llegar)',
        'facturacion'   => '(factura|facturas|facturacion|afip|arca|comprobante|comprobantes|iva|recibo|remito)',
        'migracion'     => '(migra|migrar|migracion|traspas|mudar|pasar el contenido|pasar los textos|la web que tengo|mi pagina actual|mi web actual)',
        'formularios'   => '(formulario|formularios|encuesta|encuestas|form)',
        'inscripcion'   => '(inscripto|inscripta|inscripcion|monotributo|afip|arca|habilitacion|cuit|responsable inscripto)',
        'fotos_propiedad'=> '(foto|fotos|imagen|imagenes|video|videos|galeria)',
        'exclusividad'  => '(exclusiv|unico|unica|repetid|igual a otra|misma web|otro cliente del rubro|competencia)',
        'internet'      => '(internet|conexion|offline|sin señal|sin senal|wifi|se corta)',
    ];
    if (!isset($rastros[$clave])) return true;   // clave ancha: no se controla

    $re = '/\b' . $rastros[$clave] . '\w*/u';
    // Sin los links: el dominio de una URL no es un rastro de nada. Ver
    // wabot_texto_sin_urls().
    if (preg_match($re, wabot_normalizar_frase(wabot_texto_sin_urls((string)$texto)))) return true;

    // Puede haberlo preguntado un turno antes.
    $vistos = 0;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (($fila['q'] ?? '') !== 'cliente') continue;
        if (preg_match($re, wabot_normalizar_frase(wabot_texto_sin_urls((string)($fila['t'] ?? ''))))) return true;
        if (++$vistos >= 3) break;
    }
    return false;
}

function wabot_texto_dice_sin_web($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    $web = '(web|pagina|paginas|sitio|pag|página)';
    return (bool)(
        preg_match('/\b(no|nunca)\b.{0,18}\b(tengo|tenemos|tuve|tuvimos|hay|existe|arme|armamos|hice|hicimos)\b.{0,18}\b' . $web . '\b/u', $t)
        || preg_match('/\b' . $web . '\b.{0,14}\bno\b.{0,10}\b(tengo|tenemos|hay|tiene)\b/u', $t)
        || preg_match('/\b(todavia|aun|aun no|por ahora)\b.{0,20}\bno\b.{0,18}\b(tengo|tenemos|hay)\b/u', $t)
        || preg_match('/\b(desde cero|de cero|arrancar de cero|empezar de cero|es la primera|la primera ' . $web . '|nunca tuve nada|no tengo nada)\b/u', $t)
    );
}

function wabot_pide_llamada($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;

    // "no me llames", "no me llamen mas" es lo contrario: eso es una baja.
    if (preg_match('/\bno\b.{0,14}\b(me llames|me llamen|llamar|llamen|llames)\b/u', $t)) return false;

    /* El que ATIENDE, da clases o trabaja por llamada está contando SU
     * servicio: "soy psicóloga, atiendo por videollamada", "doy clases de
     * inglés por videollamada", "tengo un call center". Los tres se derivaban
     * sin precio como si hubieran pedido hablar por teléfono (auditoría 9-sep). */
    if (preg_match('/\b(atiendo|atendemos|doy|damos|dicto|dictamos|trabajo|trabajamos|ofrezco|ofrecemos|brindo|brindamos'
        . '|clases|sesiones|consultas|turnos|asesorias|asesoramiento|terapias?|atencion|mis (clientes|pacientes|alumnos))\b.{0,40}\b(por |via |mediante |de |en |con )?(llamada|llamadas|videollamada|videollamadas|video llamada|meet|zoom)\b/u', $t)) return false;
    if (preg_match('/\b(call ?center|centro de llamadas|central de llamadas|telemarketing)\b/u', $t)) return false;

    $deseo = '(quiero|querria|queria|quisiera|me gustaria|preferiria|prefiero|necesito|podemos|podriamos|podrias|se puede|puedo|podes)';

    return (bool)(
        // Teléfono y llamada: no admiten otra lectura.
        preg_match('/\b(llamame|llamenme|llamada|llamadas|telefonicamente|por telefono|me llamas|me llaman|me podes llamar|me pueden llamar|podes llamarme|pueden llamarme|te puedo llamar|puedo llamar|hacemos una llamada|tener una llamada)\b/u', $t)
        // La videollamada solo cuenta pedida: "hacemos una videollamada?", "mejor por videollamada".
        || preg_match('/\b(hacemos|hagamos|tener|tengamos|coordinamos|coordinar|armamos|agendamos|podemos hacer|se puede hacer|me haces|me hacen|prefiero|preferiria|mejor|por)\b.{0,16}\b(una |la )?(videollamada|video llamada|google meet|zoom|whatsapp call)\b/u', $t)
        || preg_match('/\b(videollamada|video llamada)\b.{0,12}\b(mejor|puede ser|si|por favor|se puede|podemos|cuando)\b/u', $t)
        || preg_match('/\b' . $deseo . '\b.{0,24}\b(llamar|llamada|videollamada|reunirnos|reunion|juntarnos)\b/u', $t)
        // "Hablar" con el canal o la persona dichos: ahí sí pide salir del chat.
        || preg_match('/\b(hablar|hablarlo|charlar|charlarlo|hablemos|charlemos|conversar)\b.{0,20}\b(personalmente|en persona|por telefono|telefonicamente|cara a cara|con alguien|con una persona|con un humano|con el desarrollador|con pablo|con vos|con usted|directamente)\b/u', $t)
        /* "Hablar" a secas también, pero solo si no arrastra un tema ni un
         * canal: "quiero hablar" pide una charla, "quiero hablar SOBRE una
         * página web" es un lead abriendo la conversación, y "podemos hablar
         * por acá?" / "podemos hablar mañana?" quieren seguir por chat.
         * Derivarlos mata el embudo en el primer mensaje (9-sep). */
        || preg_match('/\b' . $deseo . '\s+(hablar|charlar|conversar)\b(?=\s*$|\s+(un rato|un momento|un minuto|directamente|personalmente|en persona|por telefono|telefonicamente|con (vos|alguien|una persona|un humano|el desarrollador|pablo|usted|el responsable|el encargado))\b)/u', $t)
    );
}

function wabot_pidio_demo_explicita($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match(
        '/\b(quiero (mi|la|una) (demo|muestra)|(demo|muestra) gratis (para|de) mi|quiero ver (mi|la|una) (demo|muestra)'
        . '|me interesa (la|esa) (demo|muestra)|armame (la|una) (demo|muestra)|haganme (la|una) (demo|muestra)|quiero (la|esa) (demo|muestra)'
        . '|(mandame|mandamela|mandenme|mandenos|enviame|envienme|pasame|pasamela|preparame|preparenme) ?(la|una|esa)? ?(demo|muestra))\b/u', $t);
}

/**
 * "¿Cuánto sale todo eso?" cuando lo pedido combina varias cosas. El precio de
 * un proyecto combinado NO sale de la lista: lo arma el desarrollador. Repetir
 * el del tipo base es cotizar de menos — un gimnasio con turnos + cobro de
 * planes + cursos grabados se llevó los $200.000 de turnos a secas (E01/W2,
 * 1-sep), y encima ya estaba derivado justamente por ser mixto.
 */
function wabot_texto_pregunta_precio_combinado($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    if (!preg_match('/\b(cuanto|que precio|que valor|cual es el precio|cuanto sale|cuanto seria|cuanto queda)\b/u', $t)) return false;
    return (bool)preg_match('/\b(todo eso|todo junto|todo completo|todo en total|las dos cosas|las tres cosas|el combo|ambas cosas|todo el paquete)\b/u', $t);
}



/**
 * Objeción de precio dicha sin la palabra "caro": "es bastante para mí ahora",
 * "no me alcanza". El clasificador la dejaba pasar y el modelo contestaba
 * "tomate el tiempo que necesites" sin el argumento del pago único (N04, 1-sep).
 * Lista corta y literal: un falso positivo acá mete la objeción de precio en
 * una charla que no la tuvo.
 */
function wabot_texto_objecion_precio_suave($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\bes (bastante|mucho|un monton|una banda) para mi\b/u', $t)
        || preg_match('/\bno me alcanza\b/u', $t)
        || preg_match('/\bfuera de (mi|nuestro) presupuesto\b/u', $t)
        || preg_match('/\bno (puedo|podemos) gastar (tanto|eso)\b/u', $t)
        || preg_match('/\bse me va de (precio|presupuesto)\b/u', $t)
        || preg_match('/\b(medio|un poco|algo) car[oa]\b/u', $t)
    );
}

/**
 * Un medio, un portal o cualquier web cuyo contenido cambia todo el tiempo
 * (noticias, novedades, entrevistas) NO es una landing: necesita panel propio
 * para publicar, y eso se cotiza como sistema a medida. El prompt del agente ya
 * lo decía con todas las letras y el modelo igual le vendió una landing a quien
 * acababa de decir "solo que sea para las noticias locales" (caso Jorge,
 * 26-ago) — otra vez, una regla que tiene que estar garantizada necesita red de
 * código, no solo prompt.
 */
function wabot_contexto_es_portal_contenido($contexto) {
    $t = wabot_normalizar_frase($contexto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\b(portal|sitio|pagina|web|revista|agencia|blog)\s+de\s+noticias\b/u', $t)
        || preg_match('/\b(diario|periodico|noticiero)\s+(digital|online|local|de la (zona|ciudad|localidad))\b/u', $t)
        || preg_match('/\b(medio de (prensa|comunicacion)|periodistic\w+|revista (digital|online))\b/u', $t)
        || preg_match('/\b(publicar|subir|cargar|actualizar|redactar|escribir|difundir)\b.{0,40}\b(noticias?|notas?|articulos?|novedades|entrevistas?|cronicas?)\b/u', $t)
        || preg_match('/\b(noticias?|novedades|entrevistas?)\b.{0,30}\b(locales|del? la (zona|localidad|ciudad|region)|del (pueblo|barrio|departamento|municipio))\b/u', $t)
        || preg_match('/\bautoadministrable\b/u', $t)
        /* Contenido que cargan los USUARIOS, no el dueño: reseñas, opiniones,
         * foros, clasificados, directorios. Necesita cuentas, moderación y
         * panel, o sea un desarrollo a medida — nunca una landing. Sin esto,
         * "es para una página de reseñas" no matcheaba ningún rubro y el bot
         * se quedaba preguntando "a qué rubro te dedicás" una y otra vez
         * (caso BJR Best Job Review, 27-ago: se lo preguntó dos veces
         * seguidas con distinta redacción y la charla no avanzó nunca). */
        || preg_match('/\b(pagina|sitio|web|portal|plataforma|app)\b.{0,15}\bde\b.{0,10}\b(resenas?|reviews?|opiniones|calificaciones|valoraciones|puntajes)\b/u', $t)
        || preg_match('/\b(resenas?|reviews?|opiniones|comentarios|calificaciones)\b.{0,25}\b(laborales|de empresas|de usuarios|de clientes|de empleos|de trabajos)\b/u', $t)
        || preg_match('/\b(los )?(usuarios|la gente|las personas)\b.{0,30}\b(publiquen|suban|carguen|dejen|escriban|opinen|comenten|califiquen|puntuen)\b/u', $t)
        || preg_match('/\b(foro|clasificados|directorio de (empresas|profesionales|comercios)|red social|marketplace|bolsa de (trabajo|empleo))\b/u', $t)
    );
}

function wabot_pidio_institucional_explicito($contexto) {
    $t = wabot_normalizar_frase($contexto);
    return (bool)(
        preg_match('/\b(varias paginas|multiples paginas|mas paginas|varias secciones|multiples secciones)\b/u', $t)
        || preg_match('/\bsecciones? para\b.{0,30}\b(historia|autoridades|equipo|novedades)\b/u', $t)
        || preg_match('/\balgo mas completo\b.{0,30}\bpaginas?\b/u', $t)
        || preg_match('/\b(con|con las|con la)\b.{0,20}\bsecciones\b.{0,40}\b(historia|autoridades|carreras|novedades|equipo)\b/u', $t)
        /* "una pagina con la historia, las autoridades, las novedades y los
         * actos" no dice "secciones" pero pide dos o mas: eso ES la web
         * institucional (D08, 1-sep — una escuela quedo cotizada como landing). */
        || preg_match_all('/\b(historia|autoridades|novedades|actos|equipo docente|carreras|circulares)\b/u', $t) >= 2
    );
}

function wabot_salida_ya_pregunta($out) {
    foreach ((array)$out as $texto) {
        if (strpos(wabot_texto_sin_links($texto), '?') !== false) return true;
        if (preg_match('/\b(contame|contanos|decime|decinos|pasame|pasanos|mandame|mandanos|escribime|avisame)\b/u',
                       wabot_normalizar_frase((string)$texto))) {
            return true;
        }
    }
    return false;
}

function wabot_texto_es_duda_de_valor($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    if (wabot_cierre_sin_presion_tipo($texto) !== null) return false;
    return (bool)(
        preg_match('/\bno se si\b/u', $t)
        || preg_match('/\bno estoy segur[oa]\b/u', $t)
        || preg_match('/\bvale la pena\b/u', $t)
        || preg_match('/\b(me|nos|le|les) conviene\b/u', $t)
        || preg_match('/\bsirve (de verdad|realmente)\b/u', $t)
    );
}

function wabot_texto_pide_precio($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\bcuanto\b.{0,20}\b(sale|saldria|cuesta|costaria|vale|valdria|es|seria)\b/u', $t)
        || preg_match('/\bque (precio|valor|costo)\b/u', $t)
        || preg_match('/\b(cual es|decime|pasame|necesito saber|queria saber|me pasas)\b.{0,25}\b(precio|valor|presupuesto|costo)\b/u', $t)
        || preg_match('/\b(precio|presupuesto)\b.{0,15}\b(de esto|de eso|de una web|de una pagina)\b/u', $t)
    );
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
    )
    /* "Gracias, cualquier cosa te contacto". Es la misma cosa dicha al revés:
     * el cliente se queda él con el próximo paso. Marita lo dijo a las 00:39 y
     * a las 11:00 del mismo día el seguimiento automático le escribió "nos
     * habían quedado pendiente los datos", que es exactamente lo que ella
     * acababa de decir que iba a traer cuando quisiera (Pablo, 3-sep).
     *
     * Va acá y no en wabot_cierre_sin_presion_tipo() a propósito: eso marcaría
     * un cierre y devolvería un texto fijo, y la respuesta que el bot le dio
     * ("quedo a disposición cuando quieras avanzar") ya estaba bien. Lo único
     * que sobraba era el seguimiento. Esto solo mueve aviso_prometido_ts, que
     * lo frena ese día. */
    || (bool)preg_match(
        '/\b(cualquier cosa|si me decido|si decido|ante cualquier|ni bien pueda|cuando pueda|cuando me decida)\b'
        . '.{0,20}\b(te|los|les)\b.{0,4}\b(contacto|contactamos|escribo|escribimos|aviso|avisamos|hablo|busco|consulto)\b/u',
        ' ' . $t . ' '
    )
    || (bool)preg_match(
        '/\b(yo|despues|luego|mas adelante)\b.{0,12}\b(te|los|les)\b.{0,4}\b(contacto|escribo|aviso|busco)\b/u',
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

/**
 * NO TODO EL QUE ESCRIBE VIENE A COMPRAR UNA WEB.
 *
 * El bot asume que cada mensaje entrante es una venta nueva y arranca el
 * embudo preguntando a qué se dedica. A quien escribe "ya pagué la seña,
 * ¿cuándo empiezan?", "la web que me hicieron no abre" o "les mando mi CV",
 * esa pregunta le confirma que del otro lado no lo leyó nadie.
 *
 * Devuelve 'cliente_existente', 'laboral' o null. Deliberadamente exigente:
 * ante la duda devuelve null y sigue el flujo normal de venta, que es el caso
 * que da plata. "Mi página no anda" SIN decir que la hicimos nosotros es un
 * lead (lo cubre ya_tengo_web), no un reclamo.
 */
/** ¿Está pidiendo una web? Es lo que reabre una charla que no era de venta. */
function wabot_texto_pide_web($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    return (bool)preg_match('/\b(quiero|quisiera|necesito|busco|buscaba|queria|me interesa|hacen|haces|cuanto sale|cuanto cuesta)\b'
        . '.{0,30}\b(pagina|paginas|web|sitio|landing|tienda|ecommerce|catalogo)\b/u', $t);
}

function wabot_contexto_consulta($texto, $conv = null) {
    $t = wabot_normalizar_frase(wabot_texto_sin_urls((string)$texto));
    if ($t === '') return null;

    /* Si en el mismo mensaje está pidiendo una web, es una venta y gana la
     * venta. Sin esto, "necesito una web para mi curriculum, soy fotógrafo"
     * —un lead de manual— se leía como que mandaba un CV. */
    if (wabot_texto_pide_web($t)) return null;

    // Trabajo: hay que estar MANDANDO el CV o pidiendo entrar, no solo
    // nombrar la palabra.
    if (preg_match('/\b(mando|mandar|mandarles|envio|enviar|enviarles|adjunto|paso|dejo|dejarles)\b.{0,24}\b(mi cv|el cv|curriculum|curriculo|hoja de vida|mi portfolio)\b/u', $t)
        || preg_match('/\b(mi cv|curriculum|curriculo|hoja de vida)\b.{0,26}\b(para|vacante|puesto|busqueda|postul\w+)\b/u', $t)
        /* "Necesito más trabajo para mi taller" pide clientes, no empleo (9-sep). */
        || (preg_match('/\b(busco|buscando|necesito)\s+(un\s+)?(trabajo|empleo|laburo)\b/u', $t)
            && !preg_match('/\b(mas (trabajo|laburo|clientes)|(trabajo|laburo) para (mi|el|la|nuestro|nuestra)|conseguir (mas )?(trabajo|clientes)|trabajos)\b/u', $t))
        || preg_match('/\b(quiero|quisiera|me gustaria)\b.{0,30}\b(trabajar (con|en|para) (ustedes|uds|vos)|sumarme al equipo|formar parte del equipo)\b/u', $t)
        || preg_match('/\b(toman|estan tomando|buscan)\b.{0,20}\b(gente|personal|programador\w*|disenador\w*|empleados?)\b/u', $t)) {
        return 'laboral';
    }

    // Cliente que ya compró: tiene que decir que la web es NUESTRA, o que pagó.
    $nuestra = '\b(me la (hicieron|hiciste|hicimos)|que me (hicieron|hiciste)|ustedes me (la )?(hicieron|armaron)|la que me armaron|la web que me entregaron)\b';
    if (preg_match('/' . $nuestra . '/u', $t)) return 'cliente_existente';
    // "Ya pagué OTRA web y fue un desastre" le pagó a otro: es un lead (9-sep).
    if (preg_match('/\b(ya (pague|abone|deposite|transferi)|hice la transferencia|ya te (pague|transferi)|mande el pago)\b/u', $t)
        && !preg_match('/\b(otra (web|pagina)|otro (programador|disenador|proveedor|desarrollador|lugar|lado|chico|tipo)|a otro|con otro|anterior|anteriormente|antes|un desastre|me estafaron|me cagaron|nunca me (la )?(hicieron|entregaron))\b/u', $t)) {
        return 'cliente_existente';
    }
    return null;
}

/**
 * UN AUDIO LARGO TRAE VARIAS PREGUNTAS Y SE CONTESTA UNA.
 *
 * Héctor mandó un audio donde preguntó tres cosas —cuánto cuesta, si hay
 * mantenimiento mensual, y si trabajamos con emprendimientos que recién
 * arrancan o solo con grandes empresas— más el pedido de vincular la web a sus
 * redes. Recibió el precio del ecommerce y nada más: de las otras tres nunca
 * supo nada y la venta se cayó ahí (29-ago).
 *
 * El matcher de intenciones mira el mensaje ENTERO y devuelve UNA clave: sobre
 * ese audio devuelve 'mantenimiento' y se come las otras dos. Partido en
 * oraciones aparecen las tres.
 *
 * La lista es corta a propósito: solo los temas donde se puede comprobar
 * después si la respuesta los mencionó o no (ver wabot_temas_sin_contestar).
 * Preferimos no perseguir un tema antes que duplicar una respuesta.
 */
function wabot_temas_perseguibles() {
    return [
        'mantenimiento'   => '\b(mantenimiento|abono mensual|mensualidad|cuota mensual)\w*',
        'plazos'          => '\b(plazo|plazos|tarda|demora|entrega|dias habiles|semanas)\w*',
        'hosting'         => '\b(hosting|dominio|alojamiento|renovacion)\w*',
        'emprendimientos' => '\b(emprendimiento|emprendedor|negocio chico|negocios chicos|grandes empresas|recien (arranc|empie|est))\w*',
        'carga'           => '\b(cargar|carga|subir|actualizar)\w*',
        'marketing'       => '\b(redes|red social|instagram|facebook|publicidad|marketing|pauta)\w*',
        'google'          => '\b(google|seo|posicionamiento|buscador)\w*',
        'responsive'      => '\b(celular|celulares|movil|responsive|se adapta|adaptable)\w*',
        'envios'          => '\b(envio|envios|correo|andreani|despacho|flete)\w*',
        'formularios'     => '\b(formulario|formularios|encuesta)\w*',
        'maps'            => '\b(mapa|maps|ubicacion)\w*',
    ];
}

/**
 * ¿El cliente preguntó algo?
 *
 * No se puede resolver con wabot_normalizar_frase(): borra el signo de
 * pregunta. Así que se mira el texto CRUDO —el "?" y los interrogativos— y
 * recién después se normaliza para las formas sin signo, que en WhatsApp son
 * la mayoría ("me queda de por vida una vez pagada").
 *
 * Vive acá y no en agente.php porque la usa el corte de postdemo, que corre
 * en los tres caminos (motor, agente, crons): en el motor agente.php no está
 * cargado y la función no existía.
 */
function wabot_mensaje_pregunta_algo($mensaje) {
    $crudo = trim((string)$mensaje);
    if ($crudo === '') return false;
    if (mb_strpos($crudo, '?') !== false || mb_strpos($crudo, '¿') !== false) return true;
    $t = wabot_normalizar_frase($crudo);
    if ($t === '') return false;
    return (bool)(
        /* Los interrogativos inequívocos. "Que" a secas queda AFUERA: "Que lo
         * haga vía wasap" es una instrucción, no una pregunta, y era uno de
         * los mensajes que se llevaban el comodín. Entra solo pegado a lo que
         * se pregunta ("que precio", "que incluye"). */
        preg_match('/\b(como|cuanto|cuanta|cuantos|cuando|donde|cual|cuales|quien|por que|porque)\b/u', $t)
        || preg_match('/\bque\s+(precio|valor|costo|tal|incluye|incluyen|necesito|necesitas|hacen|hace|es|son|tipo|pasa|onda|opciones|formas|medios)\b/u', $t)
        || preg_match('/\b(se puede|se pueden|puedo|podes|podria|podrian|hay forma|hay que|es posible|me decis|me podes decir'
            . '|tienen|tenes|tiene|incluye|incluyen|sirve|conviene|hace falta|necesito saber|queria saber|quisiera saber'
            . '|de por vida|para siempre|o no|si o no)\b/u', $t)
    );
}

/** Las preguntas que trae un mensaje, no la primera nomás. */
function wabot_preguntas_del_mensaje($texto, $conv, $fase = null) {
    $crudo = trim(wabot_texto_sin_urls((string)$texto));
    if ($crudo === '') return [];

    $perseguibles = wabot_temas_perseguibles();
    // Se corta por oración y también por los conectores con los que la gente
    // encadena preguntas en un audio ("y si...", "también quería saber...").
    $partes = preg_split('/[?.;!\n]+|,| y | o | si | tambien | también | ademas | además /iu', $crudo);

    $claves = [];
    foreach ((array)$partes as $parte) {
        $parte = trim((string)$parte);
        if ($parte === '' || mb_strlen($parte) < 6) continue;
        $k = wabot_info_por_palabras($parte, $fase);
        if ($k === null || !isset($perseguibles[$k])) continue;
        if (!wabot_info_clave_tiene_rastro($k, $parte, $conv)) continue;
        if (!in_array($k, $claves, true)) $claves[] = $k;
        if (count($claves) >= 4) break;
    }
    return $claves;
}

/** De esos temas, ¿cuáles NO menciona lo que el bot está por mandar? */
function wabot_temas_sin_contestar($claves, $mensajes) {
    $dicho = wabot_normalizar_frase(implode(' ', (array)$mensajes));
    $perseguibles = wabot_temas_perseguibles();
    $faltan = [];
    foreach ((array)$claves as $k) {
        if (!isset($perseguibles[$k])) continue;
        if (preg_match('/' . $perseguibles[$k] . '/u', $dicho)) continue;   // ya lo nombró
        $faltan[] = $k;
    }
    return $faltan;
}

/**
 * Arma la respuesta a varias claves de info: una sola por línea, en viñetas si
 * hay más de una. Extraído de wabot_engine() para que el agente pueda usar la
 * misma composición en vez de tener la suya.
 */
function wabot_info_lineas($keys, $conv, $cfg) {
    $lineas = [];
    foreach ((array)$keys as $k) {
        if ($k === 'precio_actual') { $lineas[] = wabot_precio_resumen($conv, $cfg); continue; }
        if (!isset($cfg['info'][$k])) continue;
        $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
            : ($k === 'pago' ? wabot_texto_pago($conv, $cfg)
            : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg)
            : ($k === 'rangos' ? wabot_texto_rangos($cfg)
            : ($k === 'plazos' ? wabot_texto_plazos($conv, $cfg) : wabot_texto_info($k, $cfg, $conv)))));
    }
    $lineas = array_values(array_filter($lineas, function ($l) { return trim((string)$l) !== ''; }));
    if (!$lineas) return '';
    return count($lineas) > 1 ? "- " . implode("\n- ", $lineas) : $lineas[0];
}

/**
 * "Podríamos hacer un punto de 30 días, contactarnos en un mes y medio."
 *
 * Héctor no se estaba yendo: estaba pidiendo que lo busquemos más adelante,
 * que es lo más parecido a un sí que da alguien sin plata hoy. El bot le
 * contestó "cuando estés listo, escribime" y le devolvió toda la
 * responsabilidad al cliente (29-ago). Devuelve los días, o null.
 */
function wabot_texto_pide_retomar_en($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;
    // Tiene que hablar de VOLVER a hablar: un plazo suelto puede ser cualquier cosa.
    if (!preg_match('/\b(contact\w+|escrib\w+|hablamos|hablemos|retom\w+|charlamos|me avisas|avisame|lo vemos|punto de|volver a)\b/u', $t)) return null;

    if (preg_match('/\b(\d{1,3})\s*dias?\b/u', $t, $m)) {
        $d = (int)$m[1];
        if ($d >= 7 && $d <= 365) return $d;
    }
    if (preg_match('/\b(un mes y medio|mes y medio)\b/u', $t))            return 45;
    /* "La semana" pelada NO es un plazo: "les escribí la semana pasada y no
     * me contestaron" agendaba un retomar en siete días y contestaba "te
     * escribo en una semana" a un reclamo (auditoría 9-sep). */
    if (preg_match('/\b(una|1)\s*semana\b/u', $t)
        || preg_match('/\b(la )?(proxima|siguiente|entrante)\s+semana\b/u', $t)
        || preg_match('/\bla semana (proxima|siguiente|entrante)\b/u', $t)
        || preg_match('/\bsemana\s*que viene\b/u', $t))                   return 7;
    if (preg_match('/\b(dos|2)\s*semanas\b/u', $t))                       return 14;
    if (preg_match('/\b(quince dias|15 dias|una quincena)\b/u', $t))      return 15;
    if (preg_match('/\b(tres|3)\s*semanas\b/u', $t))                      return 21;
    if (preg_match('/\b(un|1)\s*mes\b/u', $t))                            return 30;
    if (preg_match('/\b(dos|2)\s*meses\b/u', $t))                         return 60;
    if (preg_match('/\b(tres|3)\s*meses\b/u', $t))                        return 90;
    if (preg_match('/\b(seis|6)\s*meses\b/u', $t))                        return 180;
    return null;
}

/**
 * Fecha de CALENDARIO para retomar, en las palabras del cliente.
 *
 * wabot_texto_pide_retomar_en() entiende plazos ("en 30 días", "en un mes") y
 * nada más: "escribime el lunes", "hablamos mañana" y "vuelvo a principios de
 * octubre y te escribo" pasaban de largo y la fecha se perdía (auditoría
 * 7-sep, punto C). Acá van las formas de calendario. Devuelve
 * ['ts' => int, 'humano' => string] o null. El ts cae a las 10:00 de
 * Argentina de ese día, que es cuando el cron puede escribir.
 */
function wabot_texto_retomar_fecha($texto, $ahora = null) {
    $ahora = $ahora ?? time();
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;
    // Tiene que hablar de VOLVER a hablar: una fecha suelta puede ser cualquier cosa.
    if (!preg_match('/\b(contact\w+|escrib\w+|hablamos|hablemos|retom\w+|charlamos|me avisas|avisame|lo vemos|volver a|vuelvo|te aviso|te digo|te confirmo|te contesto|te respondo|seguimos|lo seguimos|lo cerramos|llamame|me llamas|buscame)\b/u', $t)) return null;

    $local = $ahora - 3 * 3600;   // reloj argentino, UTC-3 fijo
    $hoyY = (int)gmdate('Y', $local); $hoyM = (int)gmdate('n', $local); $hoyD = (int)gmdate('j', $local);
    $hoyW = (int)gmdate('N', $local);   // 1 = lunes
    $meses = ['enero' => 1, 'febrero' => 2, 'marzo' => 3, 'abril' => 4, 'mayo' => 5, 'junio' => 6, 'julio' => 7,
              'agosto' => 8, 'septiembre' => 9, 'setiembre' => 9, 'octubre' => 10, 'noviembre' => 11, 'diciembre' => 12];
    $nombreMes = [1 => 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    $diasSemana = ['lunes' => 1, 'martes' => 2, 'miercoles' => 3, 'jueves' => 4, 'viernes' => 5, 'sabado' => 6, 'domingo' => 7];
    $reMes = '(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)';

    // 10:00 AR de un día dado (13:00 UTC).
    $diaTs = function ($y, $m, $d) { return gmmktime(13, 0, 0, $m, $d, $y); };
    $hoyTs = $diaTs($hoyY, $hoyM, $hoyD);
    // Un día de un mes, en el año en que todavía no pasó.
    $enMes = function ($mes, $dia) use ($hoyY, $hoyM, $hoyD, $diaTs) {
        $y = $hoyY;
        if ($mes < $hoyM || ($mes === $hoyM && $dia <= $hoyD)) $y++;
        $tope = (int)gmdate('t', gmmktime(0, 0, 0, $mes, 1, $y));
        return $diaTs($y, $mes, min($dia, $tope));
    };

    if (preg_match('/\bpasado manana\b/u', $t)) {
        return ['ts' => $hoyTs + 2 * 86400, 'humano' => 'pasado mañana'];
    }
    // "a la mañana" es un momento del día, no una fecha.
    if (preg_match('/\bmanana\b/u', $t) && !preg_match('/\b(a|por|en|de|esta) la manana\b/u', $t)) {
        return ['ts' => $hoyTs + 86400, 'humano' => 'mañana'];
    }
    if (preg_match('/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/u', $t, $m)) {
        $delta = ($diasSemana[$m[1]] - $hoyW + 7) % 7;
        if ($delta === 0) $delta = 7;   // "el lunes" dicho un lunes es el que viene
        $ts = $hoyTs + $delta * 86400;
        $nombre = $m[1] === 'miercoles' ? 'miércoles' : ($m[1] === 'sabado' ? 'sábado' : $m[1]);
        return ['ts' => $ts, 'humano' => 'el ' . $nombre . ' ' . (int)gmdate('j', $ts - 3 * 3600)];
    }
    if (preg_match('/\b(\d{1,2}) de ' . $reMes . '\b/u', $t, $m)) {
        $d = (int)$m[1]; $mes = $meses[$m[2]];
        if ($d >= 1 && $d <= 31) return ['ts' => $enMes($mes, $d), 'humano' => 'el ' . $d . ' de ' . $nombreMes[$mes]];
    }
    if (preg_match('/\b(principios|comienzos|inicios|arranque|primeros dias|mediados|mitad|fines|finales|fin|ultimos dias) de ' . $reMes . '\b/u', $t, $m)) {
        $mes = $meses[$m[2]];
        if (in_array($m[1], ['mediados', 'mitad'], true)) return ['ts' => $enMes($mes, 15), 'humano' => 'a mediados de ' . $nombreMes[$mes]];
        if (in_array($m[1], ['fines', 'finales', 'fin', 'ultimos dias'], true)) return ['ts' => $enMes($mes, 27), 'humano' => 'a fines de ' . $nombreMes[$mes]];
        return ['ts' => $enMes($mes, 3), 'humano' => 'a principios de ' . $nombreMes[$mes]];
    }
    if (preg_match('/\b(en|para|hasta|desde|recien en) ' . $reMes . '\b/u', $t, $m)) {
        $mes = $meses[$m[2]];
        return ['ts' => $enMes($mes, 3), 'humano' => 'a principios de ' . $nombreMes[$mes]];
    }
    if (preg_match('/\bdespues de (las fiestas|fin de ano|ano nuevo|navidad|las vacaciones)\b/u', $t)) {
        return ['ts' => $enMes(1, 6), 'humano' => 'después de las fiestas'];
    }
    // "el 15" a secas: ese día del mes, el que todavía no pasó. Nunca "el 15 de
    // septiembre" (ya cubierto) ni "en 15 días" (eso es un plazo).
    if (preg_match('/\b(el|para el|hasta el) (\d{1,2})\b(?!\s*(de|dias?|hs|h|horas|meses|semanas|min))/u', $t, $m)) {
        $d = (int)$m[2];
        if ($d >= 1 && $d <= 31) {
            // Este mes si todavía no pasó; si no, el que viene (no el año que viene).
            $mes = $d > $hoyD ? $hoyM : ($hoyM % 12) + 1;
            $ts = $enMes($mes, $d);
            return ['ts' => $ts, 'humano' => 'el ' . $d . ' de ' . $nombreMes[(int)gmdate('n', $ts - 3 * 3600)]];
        }
    }
    return null;
}

/**
 * ¿Quién tiene el próximo paso? "Escribime el lunes" es nuestro; "el lunes te
 * escribo" es del cliente. La diferencia importa: en el primero el bot (o el
 * desarrollador) tiene que escribir ese día; en el segundo hay que esperar y,
 * si no escribió, recién ahí retomarlo.
 */
function wabot_texto_retomar_quien($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return 'bot';
    if (preg_match('/\b(escribime|escribanme|contactame|contactenme|contactarme|avisame|avisenme|llamame|llamenme|buscame|mandame|hablame'
        . '|me escribis|me escriben|me contactas|me contactan|me avisas|me avisan|me llamas|me llaman'
        . '|podrias escribirme|podes escribirme|pueden escribirme|podrian escribirme|escribirme|contactarnos|contactenos)\b/u', $t)) return 'bot';
    if (wabot_dijo_te_aviso($texto)) return 'cliente';
    if (preg_match('/\b(yo )?(te|les) (escribo|aviso|contacto|hablo|confirmo|digo|cuento|respondo|contesto|llamo|busco)\b'
        . '|\b(vuelvo|te busco|los busco|les escribo|me comunico|retomo yo|lo retomo yo|yo retomo|me pongo en contacto)\b/u', $t)) return 'cliente';
    return 'bot';
}

/**
 * Detecta un compromiso con fecha: primero calendario, después plazo.
 * Devuelve ['ts', 'humano', 'quien', ('dias')] o null. `humano` ya trae la
 * preposición: "mañana", "el lunes 14", "a principios de octubre", "en un mes".
 */
function wabot_retomar_detectar($texto, $ahora = null) {
    $ahora = $ahora ?? time();
    /* Lo que ya pasó no se agenda: "hablamos la semana pasada", "les escribí
     * ayer" son un reclamo o un recordatorio, no un compromiso a futuro. */
    $tn = wabot_normalizar_frase((string)$texto);
    if (preg_match('/\b(pasad[ao]s?|anterior|ayer|anteayer|antes de ayer|la otra vez|el otro dia|hace (un|unos|una|unas|dos|tres|varios|varias|mucho|bastante) (dia|dias|semana|semanas|mes|meses|rato|tiempo))\b/u', $tn)
        && !preg_match('/\b(escribime|contactame|avisame|llamame|buscame|te escribo|te aviso|te confirmo|vuelvo)\b/u', $tn)) {
        return null;
    }
    $f = wabot_texto_retomar_fecha($texto, $ahora);
    if ($f === null) {
        $dias = wabot_texto_pide_retomar_en($texto);
        if ($dias === null) return null;
        $f = ['ts' => $ahora + $dias * 86400, 'humano' => 'en ' . wabot_plazo_humano($dias), 'dias' => $dias];
    }
    $f['quien'] = wabot_texto_retomar_quien($texto);
    return $f;
}

/**
 * Deja el compromiso anotado en la conversación como una TAREA: fecha, quién
 * tiene el próximo paso, estado y las palabras del cliente. El cron
 * (wabot_retomar_correr) la ejecuta o la vence; el panel la muestra.
 */
function wabot_retomar_agendar(&$conv, $det, $texto = '') {
    $conv['retomar_ts'] = (int)$det['ts'];
    $conv['retomar_quien'] = ($det['quien'] ?? 'bot') === 'cliente' ? 'cliente' : 'bot';
    $conv['retomar_estado'] = 'pendiente';
    $conv['retomar_humano'] = (string)($det['humano'] ?? '');
    $conv['retomar_motivo'] = mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$texto)), 0, 160);
    $conv['retomar_creado_ts'] = time();
    $conv['retomar_vencido_ts'] = 0;
    $conv['retomar_avisado_ts'] = 0;
    // El seguimiento automático no lo persigue hasta la fecha; la marca dice
    // que el bloqueo es de esta tarea, para levantarlo cuando se cumpla.
    $conv['seguimiento_bloqueado'] = true;
    $conv['retomar_bloqueo'] = true;
    wabot_evento_sesion($conv, 'retomar_agendado', [
        'quien' => $conv['retomar_quien'],
        'dias'  => isset($det['dias']) ? (int)$det['dias'] : (int)round(((int)$det['ts'] - time()) / 86400),
        'fecha' => gmdate('Y-m-d', (int)$det['ts'] - 3 * 3600),
    ]);
}

/**
 * "Contactame en 30 días" / "hablamos el lunes" / "vuelvo en octubre y te
 * escribo": se anota la tarea y se contesta según quién tiene el próximo paso
 * y en qué etapa está la charla. Corre en el borde común (wabot_responder),
 * así vale igual en modo agente, en el motor y con la charla ya derivada.
 * Devuelve la respuesta o null si el mensaje no trae un compromiso con fecha.
 */
function wabot_retomar_responder($texto, &$conv, $cfg) {
    $det = wabot_retomar_detectar($texto);
    if ($det === null) return null;
    wabot_retomar_agendar($conv, $det, $texto);

    $cerrada = ($conv['fase'] ?? '') === 'derivado'
        || (!empty($conv['presentado_ts']) && !empty($conv['postdemo_avisado']));
    if ($det['quien'] === 'cliente') {
        $tpl = (string)($cfg['retomar_cliente_avisa'] ?? '');
        if (trim($tpl) === '') $tpl = 'Dale {nombre}, quedo atento. Cuando puedas escribime por acá y lo retomamos; y si antes te surge alguna duda, acá estoy.';
    } elseif ($cerrada) {
        $tpl = (string)($cfg['retomar_derivado'] ?? '');
        if (trim($tpl) === '') $tpl = 'Dale {nombre}, queda anotado: el desarrollador te escribe {fecha} para retomarlo.';
    } elseif (isset($det['dias'])) {
        $tpl = (string)($cfg['retomar_confirmado'] ?? '');
        if (trim($tpl) === '') $tpl = 'Dale {nombre}, me lo anoto: te escribo en {plazo} para retomarlo.';
    } else {
        $tpl = (string)($cfg['retomar_confirmado_fecha'] ?? '');
        if (trim($tpl) === '') $tpl = 'Dale {nombre}, me lo anoto: te escribo {fecha} para retomarlo. Y si antes te surge cualquier duda o querés ver la demo gratis mientras tanto, escribime cuando quieras.';
    }
    $plazo = isset($det['dias']) ? wabot_plazo_humano($det['dias']) : $det['humano'];
    $out = str_replace(['{fecha}', '{plazo}'], [$det['humano'], $plazo], $tpl);
    return [wabot_personalizar($out, $conv)];
}

/**
 * El cliente escribió: si la tarea era esperarlo a él, o ya estaba vencida
 * esperando al desarrollador, el contacto se dio solo y la tarea se cumple.
 */
function wabot_retomar_cliente_escribio(&$conv) {
    $estado = (string)($conv['retomar_estado'] ?? '');
    if ($estado === 'vencido' || ($estado === 'pendiente' && ($conv['retomar_quien'] ?? '') === 'cliente')) {
        wabot_retomar_marcar_hecho($conv, 'cliente_escribio');
    }
}

/** "30 días" dicho como lo diría una persona. */
function wabot_plazo_humano($dias) {
    $dias = (int)$dias;
    if ($dias === 7)  return 'una semana';
    if ($dias === 14) return 'dos semanas';
    if ($dias === 21) return 'tres semanas';
    if ($dias === 30) return 'un mes';
    if ($dias === 45) return 'un mes y medio';
    if ($dias === 60) return 'dos meses';
    if ($dias === 90) return 'tres meses';
    if ($dias === 180) return 'seis meses';
    return $dias . ' días';
}

/**
 * "Pero luego xe creear / Se abona / O antez / Angez".
 *
 * El techista estaba preguntando una sola cosa: si paga antes o después de la
 * muestra gratis. Recibió el detalle de la seña y las cuotas, que no era la
 * duda, y encima con condiciones inventadas (29-ago). La respuesta correcta
 * empieza por lo único que le importaba: la demo no se paga.
 *
 * Solo cuenta como esta pregunta si nombra el ANTES/DESPUÉS o el orden. Un
 * "cómo se paga" pelado sigue siendo consultar_info('pago'), que ya funciona.
 */
/**
 * "¿Cuánto es la seña?" / "¿cuánto hay que dejar para arrancar?"
 *
 * Pregunta por el MONTO del anticipo, no por el orden del pago ni por los
 * medios. Desde el 3-sep ese número no sale antes de la demo, así que la
 * pregunta necesita su propia respuesta: sin ella el cliente se lleva los
 * medios de pago, que no es lo que preguntó.
 *
 * Igual que el resto de los matchers, exige forma de PREGUNTA además del tema:
 * "ya te hice la seña" es un aviso de pago y lo toma otro camino
 * ([[tecnica_wabot_matcher_rubro_vs_pregunta]]).
 */
function wabot_texto_pregunta_cuanto_anticipo($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 180) return false;
    // Avisar que ya pagó no es preguntar cuánto.
    if (preg_match('/\b(ya |te )?(hice|realice|mande|envie|deposite|pague|abone|transferi)\b/u', $t)) return false;
    if (preg_match('/\b(mantenimiento|mensual\w*|por mes|todos los meses|cada mes|abono)\b/u', $t)) return false;
    $monto = '\b(cuanto|cuanta|que monto|de cuanto|cual es)\b';
    $cosa  = '\b(sena|senia|anticipo|adelanto|deposito|entrega inicial|primer pago|pago inicial|para arrancar|para empezar|por adelantado)\b';
    if (!preg_match('/' . $cosa . '/u', $t)) return false;
    return (bool)(preg_match('/' . $monto . '/u', $t)
        || preg_match('/\b(hay que|tengo que|debo|se deja|se necesita)\b.{0,25}\b(dejar|poner|adelantar|depositar|pagar)\b/u', $t));
}

function wabot_texto_pregunta_cuando_se_paga($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    /* "tengo que pagarles mantenimiento todos los meses?" pregunta por un costo
     * recurrente, no por el orden del pago: contestar la sena ahi es contestar
     * otra cosa (C02, 1-sep). "despues" + "pagar" solos no alcanzan. */
    if (preg_match('/\b(mantenimiento|mensual\w*|por mes|todos los meses|cada mes|abono)\b/u', $t)) return false;
    // "Hago pagos con mercado pago en mi local, primero..." cuenta su negocio (9-sep).
    if (preg_match('/\b(acepto|aceptamos|cobro|cobramos|hago pagos|hacemos pagos|recibo pagos|recibimos pagos|mis clientes|los clientes me|en mi (local|negocio|tienda))\b/u', $t)) return false;
    $pago = '\b(se abona|se paga|abono|pago|pagar|abonar|sena)\w*\b';
    if (!preg_match('/' . $pago . '/u', $t)) return false;
    return (bool)(
        preg_match('/\b(antes|antez|despues|luego|primero|después)\b/u', $t)
        || preg_match('/\bcuando\b.{0,20}' . $pago . '/u', $t)
        || preg_match('/' . $pago . '.{0,20}\bcuando\b/u', $t)
        || preg_match('/\b(ya mismo|de una|en que momento)\b/u', $t)
    );
}

/**
 * ¿El texto nombra algún color? Más flojo que wabot_parece_lista_colores():
 * alcanza con que aparezca UNO, o un código hex. Sirve de control de cordura
 * donde lo que importa es descartar que el valor no tenga nada que ver —
 * "Blanco grisáceo (#F8F8F8) y tonos dorados" tiene que pasar igual.
 */
function wabot_menciona_color($texto) {
    if (preg_match('/#[0-9a-f]{3,8}\b/i', (string)$texto)) return true;
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    return (bool)preg_match('/\b(rojo|roja|rosa|rosado|amarillo|amarilla|azul|azules|celeste|verde|verdes|violeta'
        . '|lila|morado|purpura|naranja|beige|beis|crema|blanco|blanca|negro|negra|gris|grises|marron|bordo'
        . '|dorado|dorada|plateado|plateada|turquesa|fucsia|coral|ocre|mostaza|terracota|nude|cobre|salmon'
        . '|pastel|pasteles|calidos|calidas|frios|frias|neutros|neutrales|vivos|tierra|colores?)\w*\b/u', $t);
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

    /* "agente", "operador", "representante" y "encargado" son las palabras que
     * usa el que quiere dejar de hablar con el bot, tanto como "persona".
     * Faltaban: "Se puede hablar con un agente" quedó sin reconocer y el bot
     * siguió pidiéndole los colores de la marca (27-ago). Ignorar un pedido de
     * humano es la falla más cara que puede tener el bot. */
    $humano = '(persona|humano|asesor|alguien|pablo|vendedor|agente|operador|representante|encargado|responsable|desarrollador)';
    /* "prefiero" y el pronombre pegado al verbo ("hablarLO con alguien") son de
     * la batería del 27-ago: "Es algo complejo, prefiero hablarlo con alguien
     * técnico" no matcheaba ninguna de estas y el bot siguió preguntando el
     * rubro. Ni "prefiero" estaba entre los verbos de intención, ni "hablarlo"
     * entra en un \bhablar\b. */
    if (preg_match('/\b(quiero|queria|quisiera|necesito|prefiero|preferiria|puedo|podria|podrias|podes|se puede|quiero que me)\b.{0,35}\b(hablar|hablarlo|hablarla|comunicar|atender|llamar|pasar)\b.{0,35}\b' . $humano . '\b/u', $t)
        || preg_match('/\b(pasame|derivame|comunicate)\b.{0,25}\b' . $humano . '\b/u', $t)
        || preg_match('/\bme\s+(pasas|derivas|comunicas)\b.{0,25}\b' . $humano . '\b/u', $t)
        || preg_match('/\b(hablar|hablarlo|hablarla|comunicarme|contactarme|charlar)\s+con\s+(un[ao]?\s+)?' . $humano . '\b/u', $t)
        || preg_match('/\bque\s+me\s+(atienda|llame|contacte|escriba)\s+(pablo|una persona|alguien|un asesor|un agente)\b/u', $t)
        /* "Quiero un operador", "necesito una persona": el verbo de hablar se
         * elide porque se da por obvio. Acá NO valen "vendedor", "asesor" ni
         * "desarrollador": el cliente puede estar contando que necesita uno
         * para SU negocio ("necesito un vendedor para mi local"), y con el
         * verbo elidido no hay forma de distinguirlo. Se pide además que el
         * mensaje sea corto: el que pide humano lo pide y punto, no lo mete
         * adentro de un párrafo sobre su empresa. */
        || (mb_strlen($t) <= 42
            && preg_match('/\b(quiero|necesito|dame|paseme|pasame)\s+(un|una|con un|con una)\s+(persona|humano|agente|operador|representante|encargado)\b/u', $t))) {
        return 'pide_humano';
    }

    /* "Quiero avanzar con la demo" o "quiero arrancar con una web" no son
     * intención de pago: son el cliente entrando al embudo, y derivarlos ahí
     * lo cortaba sin precio ni boceto (auditoría 9-sep). */
    $avanzaConLaWeb = preg_match('/\b(avanzar|arrancar|seguir|empezar|comenzar)\b.{0,10}\b(con|en)\b.{0,12}\b(la |una |el |mi |esa |esta |lo de la |lo de |el tema de la )?(demo|muestra|predise\w*|web|pagina|sitio|tienda|formulario|proyecto|propuesta|boceto)\b/u', $t);
    if (preg_match('/\b(mandame|pasame|decime)\b.{0,35}\b(cbu|alias|datos de transferencia|datos para transferir)\b/u', $t)
        || (!$avanzaConLaWeb && preg_match('/\b(quiero|listo para|vamos a|deseo)\b.{0,25}\b(pagar|contratar|avanzar|arrancar|senar|sena)\b/u', $t))
        || preg_match('/\b(como|donde)\s+(?:(te|les)\s+)?(pago|transfiero|deposito)\b/u', $t)) {
        return 'pago_explicito';
    }

    $cursos = preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases online)\b/u', $t)
           || preg_match('/\b(doy|dicto|damos|dictamos|dando|dictando)\b.{0,15}\btaller(es)?\b/u', $t)
           || preg_match('/\btaller(es)?\s+(online|virtual(es)?|de capacitacion)\b/u', $t);
    $productos = preg_match('/\b(vendo|vendemos|productos|tienda|local|ropa|mates?|velas|articulos|mercaderia)\b/u', $t);
    if ($cursos && $productos) return 'productos_y_cursos';

    /* Una app de celular sí la hacemos, pero se cotiza aparte: no hay precio
     * de lista que darle, así que la charla tiene que llegar a Pablo. Sin esta
     * causa el handoff quedaba sin autorizar y el pedido terminaba en el flujo
     * de sistemas, sin que nadie le confirmara siquiera que las hacemos
     * (27-ago).
     *
     * Se exige la marca de que es para el CELULAR, o la pregunta directa de si
     * las hacemos. Un "quiero una app para stock" queda afuera a propósito:
     * eso es un sistema de gestión interno y tiene su propio flujo, que junta
     * el problema y los usuarios antes de derivar — mucho más útil para Pablo
     * que un handoff pelado. Y "por la app de WhatsApp" no pide ninguna. */
    if (preg_match('/\b(app|aplicacion|aplicaciones|apk)\b.{0,30}\b(celular|movil|telefono|android|ios|play store|app store|descargar)\b/u', $t)
        || preg_match('/\b(hacen|desarrollan|arman|programan)\b.{0,20}\b(apps?|aplicaciones?)\b/u', $t)) {
        return 'app_movil';
    }

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
    if ($cierre !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierre, wabot_texto_esta_comparando($texto) ? 'solo_averiguando' : null);

    $faseActual = $conv['fase'] ?? 'nuevo';
    if (!in_array($faseActual, ['nuevo', 'menu', 'algo_diferente'], true)) {
        $infoFase = wabot_info_por_palabras($texto, $faseActual);
        if ($infoFase !== null) {
            if ($infoFase === 'precio_actual') return [wabot_precio_resumen($conv, $cfg)];
            if ($infoFase === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
            if ($infoFase === 'pago') return [wabot_texto_pago($conv, $cfg)];
            if ($infoFase === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
            if ($infoFase === 'rangos') return [wabot_texto_rangos($cfg)];
            if ($infoFase === 'plazos') return [wabot_texto_plazos($conv, $cfg)];
            return [(string)(wabot_texto_info($infoFase, $cfg, $conv) ?: $cfg['info']['otra'])];
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

            /* Gabriela: "vendo zapatillas" quedó en el turno anterior y ahora
             * responde "los vendo desde la web". Aunque Gemini caiga, se juntan
             * ambas piezas antes de decidir.
             *
             * Solo queda el de cursos: wabot_fallback_rubro_local() devuelve
             * 'cursos', 'ecommerce', 'hibrido_pendiente', 'inmobiliaria',
             * 'institucional', 'landing' o 'sistema_pendiente', y nada más. Las
             * ramas de 'comercio_pendiente' y 'turnos_pendiente' que vivían acá
             * no se alcanzaban nunca, y sus dos desempates ya no se preguntan. */
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
                $claveTexto = $desempate[1];
                return [$cfg[$claveTexto]];
            }
            if ($rubroLocal !== null) return wabot_precio($rubroLocal, $conv, $cfg);
            $infoLocal = wabot_info_por_palabras($texto, $conv['fase'] ?? 'menu');
            if ($infoLocal !== null && $infoLocal !== 'precio_actual') {
                if ($infoLocal === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
                if ($infoLocal === 'pago') return [wabot_texto_pago($conv, $cfg)];
                if ($infoLocal === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
                if ($infoLocal === 'rangos') return [wabot_texto_rangos($cfg)];
            if ($infoLocal === 'plazos') return [wabot_texto_plazos($conv, $cfg)];
                return [(string)(wabot_texto_info($infoLocal, $cfg, $conv) ?: $cfg['info']['otra'])];
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
            if (in_array(($conv['tipo'] ?? ''), ['catalogo', 'ecommerce'], true) && (int)($conv['productos_cantidad'] ?? 0) <= 0) {
                $cantFallback = wabot_extraer_cantidad_productos($texto);
                if ($cantFallback !== null) $conv['productos_cantidad'] = $cantFallback;
            }
            $rNuevoFallback = wabot_fallback_rubro_local($texto);
            if ($rNuevoFallback !== null && $rNuevoFallback !== $conv['tipo']) {
                $desempateFallback = wabot_desempate_de($rNuevoFallback);
                if ($desempateFallback !== null) {
                    $conv['tipo'] = null;
                    $conv['fase'] = $desempateFallback[0];
                    wabot_handoff_aclaracion_resuelta($conv);
                    $claveTextoFallback = $desempateFallback[1];
                    return [$cfg[$claveTextoFallback]];
                }
                $conv['tipo'] = $rNuevoFallback;
            }
            $otraIdeaFallback = wabot_pitch_encaje_rechazado($texto, $conv, $cfg);
            if ($otraIdeaFallback !== null) return $otraIdeaFallback;
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
            $noSabeComo = wabot_prediseno_no_sabe_como($texto, $conv, $cfg);
            if ($noSabeComo !== null) return $noSabeComo;
            $tp = trim($texto);
            if (empty($conv['descripcion']) && mb_strlen($tp) >= 15
                && strpos($tp, '?') === false && !wabot_fallback_respuesta_vacia($texto)
                && !wabot_texto_no_es_descripcion($texto)) {
                $conv['descripcion'] = $tp;
            }
            if (empty($conv['colores']) && !empty($conv['descripcion']) && wabot_colores_delegados($texto)) {
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
            /* Con el formulario ya mandado no se vuelve a mandar: el cliente lo
             * vio. Repetir el mismo link cada vez que escribe es insistir. */
            if (wabot_link_form_ya_enviado($conv, $texto)) {
                return [(string)($cfg['prediseno_espera'] ?? 'Perfecto, quedo atento a que lo completes y arrancamos.')];
            }
            if (!empty($conv['descripcion']) && empty($conv['colores'])) $pedido = (string)$cfg['prediseno_falta_colores'];
            elseif (!empty($conv['colores']) && empty($conv['descripcion'])) $pedido = (string)$cfg['prediseno_falta_descripcion'];
            else $pedido = wabot_prediseno_texto($conv, $cfg);
            if (trim($pedido) !== '' && trim($pedido) === wabot_ultimo_texto_bot($conv)) {
                return [(string)($cfg['repregunta_suave'] ?? 'Perdoná si no fui claro. Contame qué duda te quedó y te la respondo, y seguimos con la demo cuando quieras.')];
            }
            return [$pedido];
        case 'postdemo':
            // Una sola cadena de detectores para los tres caminos (motor,
            // agente y el corte de redactor.php): si divergen, el cliente
            // recibe cosas distintas segun por donde entro su mensaje.
            // Null = sin interes y sin texto fijo: en el motor no hay quien
            // improvise, asi que se reabre la conversacion con el pedido de
            // feedback en vez de dejarlo sin respuesta.
            $rPost = wabot_postdemo_responder($texto, $conv, $cfg);
            if ($rPost !== null) return $rPost;
            /* Null con texto fijo pendiente = había una pregunta que solo el
             * agente podía contestar y el agente no está (o falló). El peor
             * caso es el de siempre: sale el texto fijo y la pregunta queda
             * para el desarrollador, que la ve en el panel como pendiente. */
            $prefijo = trim((string)($conv['_postdemo_prefijo'] ?? ''));
            unset($conv['_postdemo_prefijo']);
            if ($prefijo !== '') {
                wabot_evento_sesion($conv, 'postdemo_pregunta_sin_contestar');
                return [$prefijo];
            }
            return [(string)($cfg['postdemo_apertura'] ?? '')];
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
    if (wabot_pidio_institucional_explicito($t)) return 'institucional';
    $mencionaCursos = (bool)preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases|taller|talleres)\b/u', $t);
    if (!$mencionaCursos
        && (preg_match('/\b(ecommerce|e commerce|tienda online|carrito|cobro online|cobrar online)\b/u', $t)
            || preg_match('/\bvender\b.{0,30}\b(online|por internet|desde la web|por la web)\b/u', $t))) {
        return 'ecommerce';
    }
    if (wabot_contexto_es_hibrido($t)) return 'hibrido_pendiente';
    /* Los rubros que trabajan con turno ya no abren ningún desempate: turnos
     * se retiró el 2-sep y todos van a sitio profesional. En una semana la
     * pregunta tocó a doce clientes, solo tres terminaron cotizados como
     * turnos y ninguno cerró por ahí. */
    if (preg_match('/\b(peluqueria|barberia|estetica|esteticista|spa|masajes|unas|manicura|depilacion|tatuajes|consultorio|odontologia|psicologia|nutricionista|kinesiologo|kinesiologa|kinesiologia|fonoaudiologia|fonoaudiologa|dermatologia|dermatologa|dermatologo|cosmiatra|podologia|podologa|veterinaria|gimnasio|pilates|yoga|canchas|cabanas|hotel|taller mecanico)\b/u', $t)) {
        return 'landing';
    }
    if (preg_match('/\b(ong|fundacion|asociacion civil|sin fines de lucro)\b/u', $t)
        && !preg_match('/\b(vender|vendemos|vendo|cobrar|cobramos|arancel|aranceles|matricula|pagas?|pagos)\b/u', $t)) {
        return 'landing';
    }
    if (preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases online)\b/u', $t)
        || preg_match('/\b(doy|dicto|damos|dictamos)\b.{0,15}\btaller(es)?\b/u', $t)) return 'cursos';
    // El que repara o instala es un servicio, aunque nombre electrodomésticos:
    // va antes de la lista de productos, que lo leía como comercio (1-sep).
    if (wabot_contexto_es_servicio_tecnico($t)) return 'landing';
    /* La PROFESIÓN dicha por la persona: la lista de arriba tenía la
     * disciplina ("psicologia") pero no "soy psicóloga", que caía al final
     * sin rubro y se llevaba lo que fuera ("atiendo por videollamada" → la
     * info de reuniones, 9-sep). Sin venta en el mismo mensaje: "vendo
     * insumos médicos" es comercio. */
    if (preg_match('/\b(psicolog\w*|psicopedagog\w*|odontolog\w*|dentista\w*|dermatolog\w*|kinesiolog\w*|fonoaudiolog\w*|nutricionista\w*|podolog\w*|cosmetolog\w*|cosmiatra\w*|esteticista\w*'
        . '|pediatra\w*|traumatolog\w*|cardiolog\w*|ginecolog\w*|obstetr\w*|enfermer[oa]s?|terapeuta\w*|masajista\w*|coach|entrenador\w*|instructor\w*|profesor\w*'
        . '|arquitect[oa]s?|contador\w*|abogad[oa]s?|escriban[oa]s?|gestor\w*|traductor\w*|fotograf[oa]s?|veterinari[oa]s?|electricista\w*|plomer[oa]s?|gasista\w*|cerrajer[oa]s?|pintor\w*|jardiner[oa]s?|albanil\w*|techista\w*)\b/u', $t)
        && !preg_match('/\b(vendo|vendemos|venta|ventas|vender|tienda|productos|insumos|articulos|mercaderia)\b/u', $t)) {
        return 'landing';
    }
    /* Gastronomía con mesas: sitio profesional, como dice el playbook del
     * agente (restaurante, bar → sitio profesional salvo que pida pedidos).
     * Va ANTES de la lista de productos y sin la palabra "local": "tengo un
     * local de comidas y hago delivery" salía cotizado tienda online de
     * $290.000 —pisando al modelo, que había elegido sitio profesional— por
     * la sola palabra "local" (auditoría 9-sep). Pizzería, rotisería y
     * delivery quedan afuera a propósito: ahí el pedido online es plausible y
     * lo decide el modelo. */
    if (preg_match('/\b(restaurantes?|restoran|restaurant|resto ?bar|bar|bares|cafeterias?|cervecerias?|parrillas?|bodegon(es)?|salon de te|confiterias?)\b/u', $t)
        && !preg_match('/\b(vendo|vendemos|venta|ventas|vender|pedidos online|carrito|tienda online)\b/u', $t)) {
        return 'landing';
    }
    // netbooks, notebooks, celulares y consolas salieron el 27-ago ("Para
    // Netbooks", "Y celulares todo usados") y ninguna estaba en la lista: el
    // cliente contestó dos veces y recibió la misma pregunta las dos.
    // Sin "local" ni "fabricamos": un local es un LUGAR (de comidas, de
    // uñas, de una agencia de viajes) y fabricar no dice qué, ni si lo vende.
    if (preg_match('/\b(mates?|velas|ropa|zapatillas?|calzados?|productos|mercaderia|muebles|articulos|ferreteria|kiosco|dietetica|bazar|vivero|panaderia|pet shop|repuestos|imprenta|grafica|cajas|packaging|envases|libreria|jugueteria|carniceria|verduleria|indumentaria|marroquineria|cosmetica|perfumeria'
        . '|netbooks?|notebooks?|celulares?|computadoras?|compu|tablets?|consolas?|electrodomesticos?|electronica|informatica|tecnologia usada|usados)\b/u', $t)) {
        return 'ecommerce';
    }
    if (preg_match('/\b(inmobiliaria|propiedades|bienes raices)\b/u', $t)) return 'inmobiliaria';
    // destapaciones, sonido, iluminación y alquiler de equipos salieron el
    // 27-ago y ninguno estaba: "para destapaciones" y "alquiler de pantallas
    // led" se llevaron la misma repregunta una y otra vez.
    if (preg_match('/\b(landing|abogado|contador|estudio juridico|plomero|gasista|electricista|pintor|fletes|mudanzas|cerrajero|jardinero|fotografo|disenador|limpieza|seguridad|vigilancia|transporte|logistica|refrigeracion|climatizacion|aire acondicionado|eventos|catering|pintura|albanil|techista|durlock|sanitarios|desagotes|fumigacion|control de plagas|herreria|soldadura|grua|remis|traslados|nineras|cuidado de|masajista|entrenador|profesor particular|traductor|community manager|marketing digital|consultora|consultoria|asesoria|gestoria|seguros|contable|arquitecto|ingeniero|topografo|escribano|martillero'
        . '|destapacion\w*|destapo\w*|desagote\w*|cloacas?|sonido|iluminacion|pantallas? led|djs?|animacion|salon de fiestas|carpas?|gazebos?'
        . '|alquiler de (equipos?|maquinas?|herramientas?|sonido|pantallas?|autos?|vehiculos?)|alquilamos)\b/u', $t)) {
        return 'landing';
    }
    if (preg_match('/\b(fundacion|ong|colegio|escuela|universidad|instituto|municipio|sindicato|asociacion|camara|cooperativa|mutual|club|parroquia|iglesia|hospital|centro de salud)\b/u', $t)) {
        return 'landing';
    }
    /* Último recurso: dice que VENDE algo pero ese algo no está en ninguna
     * lista de arriba ("quiero vender mis diseños", "vendo cuadros", "vendo
     * plantines"). Vender es comercio, y ahí la única duda real es si cobra
     * online o le consultan por WhatsApp: eso es el desempate, no un callejón
     * sin salida. Sin esto el bot no reconocía nada y preguntaba el rubro dos
     * veces con distinta redacción —"qué vendés o qué servicio ofrecés?" y
     * después "a qué rubro te dedicás?"— a alguien que YA había contestado.
     * Pasó dos veces el mismo día (BJR y el ebook de diseños, 27-ago). */
    if (preg_match('/\b(vendo|vender|venderia|venta de|comercializo|comercializar|revendo|revender)\b/u', $t)) {
        return 'hibrido_pendiente';
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
    return wabot_derivar_contestando($texto, $conv, $cfg, $causa);
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
    if ($cierreSinPresion !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierreSinPresion, wabot_texto_esta_comparando($texto) ? 'solo_averiguando' : null);

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
            if ($infoCerrado === 'rangos') return [wabot_texto_rangos($cfg)];
            if ($infoCerrado === 'plazos') return [wabot_texto_plazos($conv, $cfg)];
            return [(string)(wabot_texto_info($infoCerrado, $cfg, $conv) ?: $cfg['info']['otra'])];
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
    // Vale también en fase 'prediseno': el precio y el link de la muestra
    // salen juntos en el mismo turno (ver wabot_precio()), así que la fase ya
    // es 'prediseno' desde el mensaje del precio, no recién cuando confirma.
    if (in_array($conv['fase'], ['precio', 'prediseno'], true) && wabot_es_afirmativa($texto)
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
    // pensarlo/socio/ya_tiene_web traen la oferta de demo pegada adentro del
    // texto: si ya se ofreció antes por otra objeción en la misma charla, se
    // usa la variante sin esa oferta para no repetirla (mismo criterio que
    // manejar_objecion en agente.php).
    if ($has('objecion_pensarlo')) {
        $txt = (!empty($conv['cta_muestra']) && !empty($cfg['pensarlo_sin_muestra'])) ? $cfg['pensarlo_sin_muestra'] : $cfg['pensarlo'];
        $out[] = wabot_objecion_texto('pensarlo', $txt, $conv, $cfg);
        $conv['cta_muestra'] = true;
    }
    if ($has('objecion_socio')) {
        $txt = (!empty($conv['cta_muestra']) && !empty($cfg['socio_sin_muestra'])) ? $cfg['socio_sin_muestra'] : $cfg['socio'];
        $out[] = wabot_objecion_texto('socio', $txt, $conv, $cfg);
        $conv['cta_muestra'] = true;
    }
    // Pero no si acaba de decir que no tiene ninguna: el texto arranca
    // pidiéndole el link de esa página (caso Overlord, 28-ago).
    if ($has('objecion_ya_tiene_web') && wabot_texto_dice_sin_web($texto)) {
        $acc = array_values(array_diff($acc, ['objecion_ya_tiene_web']));
        $has = function ($a) use ($acc) { return in_array($a, $acc, true); };
    }
    if ($has('objecion_ya_tiene_web')) {
        $txt = (!empty($conv['cta_muestra']) && !empty($cfg['ya_tengo_web_sin_muestra'])) ? $cfg['ya_tengo_web_sin_muestra'] : $cfg['ya_tengo_web'];
        $out[] = wabot_objecion_texto('ya_tiene_web', $txt, $conv, $cfg);
        $conv['cta_muestra'] = true;
    }
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
        // Una clave angosta que el cliente nunca mencionó es contexto
        // contaminado, no una respuesta (caso S. Marcela y el bilingüe que
        // nadie preguntó, 28-ago).
        $keys = array_values(array_filter($keys, function ($k) use ($texto, $conv) {
            return wabot_info_clave_tiene_rastro($k, $texto, $conv);
        }));
        if (!$keys) $keys = ['otra'];
        // En un desempate el precio ya está acotado a dos opciones: se dicen las
        // dos en vez del rango genérico, que además remata pidiendo el rubro
        // que el cliente acaba de decir (caso pediatría, 27-ago).
        $preciosDesempate = (in_array('rangos', $keys, true) || in_array('precio_sin_rubro', $keys, true))
            ? wabot_desempate_precios_texto($conv['fase'], $cfg) : null;

        $lineas = [];
        foreach ($keys as $k) {
            if ($preciosDesempate !== null && in_array($k, ['rangos', 'precio_sin_rubro'], true)) {
                $lineas[] = $preciosDesempate;
                continue;
            }
            // Una por una para respetar el orden y el caso del desempate; la
            // resolución de cada clave la hace wabot_info_lineas().
            $una = wabot_info_lineas([$k], $conv, $cfg);
            if ($una !== '') $lineas[] = $una;
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

    /* Respaldo determinista del rubro, igual que ya se hace en los desempates.
     *
     * Las tres fases de abajo solo miraban lo que etiquetó el clasificador, y
     * cuando este no reconocía nada el cliente se llevaba "contame un poco
     * más" — aunque hubiera dicho su rubro con todas las letras. El 27-ago
     * pasó con "para destapaciones", "Para Netbooks", "Alquiler de pantallas
     * led" y "servicios de catering": cuatro charlas distintas trabadas en la
     * misma repregunta. El matcher local no depende de que la IA acierte.
     *
     * Solo se usa cuando el clasificador NO trajo rubro: si trajo uno, gana él,
     * que vio la charla entera y no una sola frase. */
    if (in_array($conv['fase'], ['nuevo', 'menu', 'algo_diferente'], true)
        && wabot_rubro_de($acc) === null) {
        $rubroLocal = wabot_fallback_rubro_local($texto);
        if ($rubroLocal !== null) {
            $etiquetas = [
                'cursos' => 'rubro_cursos',
                'hibrido_pendiente' => 'rubro_hibrido', 'sistema_pendiente' => 'rubro_sistema',
                'institucional' => 'rubro_institucional', 'landing' => 'rubro_landing',
                'ecommerce' => 'rubro_ecommerce', 'inmobiliaria' => 'rubro_inmobiliaria',
            ];
            if (isset($etiquetas[$rubroLocal])) {
                wabot_log('rubro_rescatado', ['de' => 'clasificador', 'a' => $rubroLocal, 'msg' => mb_substr((string)$texto, 0, 90)]);
                $acc[] = $etiquetas[$rubroLocal];
                $acc = array_values(array_diff($acc, ['algo_diferente', 'otro']));
                $has = function ($a) use ($acc) { return in_array($a, $acc, true); };
            }
        }
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
            elseif ($has('quiere_prediseno')) { $conv['fase'] = 'menu'; if (!wabot_salida_ya_pregunta($out)) $out[] = wabot_apertura($conv, $cfg); }
            else { $conv['fase'] = 'menu'; if (!wabot_salida_ya_pregunta($out)) $out[] = wabot_apertura($conv, $cfg); } // saludo, otro o pregunta ya contestada
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
            elseif ($has('comercio_mostrar')) { $out = array_merge($out, wabot_precio('ecommerce', $conv, $cfg)); }
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
            // Salvaguarda: en el uso normal esta fase nunca llega hasta acá,
            // wabot_responder() (redactor.php) corta antes. Si por lo que sea
            // llega, se comporta igual —misma cadena de detectores— ignorando
            // lo que se haya acumulado en $out más arriba (por ejemplo, una
            // respuesta de precio ante una palabra suelta de pago).
            $rPost2 = wabot_postdemo_responder($texto, $conv, $cfg);
            if ($rPost2 !== null) return $rPost2;
            return $out ?: [(string)($cfg['postdemo_apertura'] ?? '')];

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
            if (in_array(($conv['tipo'] ?? ''), ['catalogo', 'ecommerce'], true)) {
                $cant = wabot_extraer_cantidad_productos($texto);
                if ($cant !== null) $conv['productos_cantidad'] = $cant;
            }
            $rNuevoPitch = wabot_rubro_de($acc);
            if ($rNuevoPitch !== null && $rNuevoPitch !== ($conv['tipo'] ?? '')) {
                $desempateNuevo = wabot_desempate_de($rNuevoPitch);
                if ($desempateNuevo !== null) {
                    $conv['tipo'] = null;
                    $conv['fase'] = $desempateNuevo[0];
                    wabot_handoff_aclaracion_resuelta($conv);
                    $claveTexto = $desempateNuevo[1];
                    return array_merge($out, [$cfg[$claveTexto]]);
                }
                $conv['tipo'] = $rNuevoPitch;
            }
            $otraIdea = wabot_pitch_encaje_rechazado($texto, $conv, $cfg);
            if ($otraIdea !== null) return array_merge($out, $otraIdea);
            return array_merge($out, wabot_precio((string)$conv['tipo'], $conv, $cfg));

        case 'prediseno':
            $noSabeComo = wabot_prediseno_no_sabe_como($texto, $conv, $cfg);
            if ($noSabeComo !== null) return array_merge($out, $noSabeComo);
            if ($c['descripcion'] !== null) $conv['descripcion'] = $c['descripcion'];
            /* Lo que cuenta de su negocio en esta fase es la descripción del
             * boceto, aunque el clasificador no la haya etiquetado: desde el
             * 2-sep el turno del precio ya deja la charla acá, así que es el
             * lugar donde llega "vendo ropa de mujer, tengo local en Salta". */
            $tpLibre = trim($texto);
            if (empty($conv['descripcion']) && mb_strlen($tpLibre) >= 15 && strpos($tpLibre, '?') === false
                && !wabot_fallback_respuesta_vacia($texto) && !$has('pregunta_info')
                && !wabot_texto_no_es_descripcion($texto)) {
                $conv['descripcion'] = $tpLibre;
            }
            if ($c['colores']     !== null) $conv['colores']     = $c['colores'];
            if ($conv['colores'] === null && $conv['descripcion'] !== null && wabot_colores_delegados($texto)) {
                $conv['colores'] = 'A elección del diseñador';
            }

            /* DESPUÉS DE LOS TRES PASOS, EL FORMULARIO SALE CON EL SÍ (11-sep).
             * Los tres pasos terminan preguntando si quiere la demo, así que lo
             * que viene es un sí o no lo es. "Reservas online" (V05) contaba más
             * del negocio y se llevó "me faltan solo los colores de tu marca",
             * el pedido por chat de antes del formulario; con cualquier otra
             * cosa, el motor mandaba el link sin que nadie lo pidiera. Con el
             * formulario activo y el link todavía sin mandar: el sí se lleva el
             * link, el no se cierra sin presión y lo demás se toma y se vuelve
             * a preguntar. Lo que contó ya quedó anotado arriba. */
            if (!$out && trim((string)$texto) !== '' && wabot_espera_si_a_la_demo($conv, $cfg)) {
                if (wabot_acepta_demo($texto)) {
                    wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'motor_tres_pasos']);
                    $out[] = wabot_prediseno_texto($conv, $cfg);
                    break;
                }
                if (wabot_es_negativa($texto)) {
                    return wabot_cerrar_sin_presion($conv, $cfg, 'consulta');
                }
                if (mb_strpos($texto, '?') === false) {
                    /* Una vez se vuelve a preguntar; la segunda se deja la puerta
                     * abierta sin preguntar de nuevo, y de ahí en más silencio (lo
                     * ve el desarrollador en el panel). Repetir la misma pregunta
                     * es lo que el anti-repetición convierte en derivación. */
                    $vez = (int)($conv['tres_pasos_repreguntas'] ?? 0);
                    $conv['tres_pasos_repreguntas'] = $vez + 1;
                    if ($vez === 0) $out[] = wabot_tres_pasos_repregunta_texto();
                    elseif ($vez === 1) $out[] = 'Buenísimo. Cuando quieras que te armemos la demo, avisame y te paso el formulario.';
                    break;
                }
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
            /* Se pregunta ANTES de armar el pedido: wabot_prediseno_texto()
             * marca link_form_enviado apenas devuelve el link, así que
             * preguntado después, el primer "sí" a los tres pasos se llevaba
             * la línea de espera en vez del formulario. Lo tapaba que hasta el
             * 10-sep el link salía con el precio. */
            $linkYaEnviado = wabot_link_form_ya_enviado($conv, $texto);
            if ($conv['descripcion'] !== null)      { $pedido = $cfg['prediseno_falta_colores']; }
            elseif ($conv['colores'] !== null)      { $pedido = $cfg['prediseno_falta_descripcion']; }
            elseif (!$out)                          { $pedido = $linkYaEnviado ? '' : wabot_prediseno_texto($conv, $cfg); }
            else                                    { $pedido = null; }
            if ($pedido !== null && $linkYaEnviado) {
                $pedido = $out ? null : (string)($cfg['prediseno_espera'] ?? 'Perfecto, quedo atento a que lo completes y arrancamos.');
            }
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
    /* La peluquería NO abre un desempate: con turnos retirado (2-sep) las dos
     * respuestas daban el mismo sitio profesional a $180.000, así que la
     * pregunta costaba un turno y no decidía nada. Peor: ofrecía "que los
     * reserven directamente desde la web", que es justo lo que el sitio
     * profesional no hace, y el que contestaba que sí se llevaba otra cosa.
     * El agente ya cotizaba directo; el motor era el único que preguntaba.
     * 'turnos' está retirado: wabot_precio() lo absorbe a landing. */
    if (in_array('servicio_con_turnos', $acc, true))                                 return 'turnos';
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
    // Los links se sacan ANTES de todo: sus palabras no son intención del
    // cliente, son un dominio. Ver wabot_texto_sin_urls().
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', wabot_texto_sin_urls((string)$texto)));
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

    /* Quien CUENTA su negocio no está preguntando: "vendo abonos mensuales de
     * gimnasio" no es una duda sobre el mantenimiento, ni "quiero que mis
     * clientes paguen por mercado pago" una sobre cómo pagarnos (9-sep). Es la
     * regla de [[tecnica_wabot_matcher_rubro_vs_pregunta]]: tema + forma de
     * pregunta. "tengo que" no cuenta como contar el negocio. */
    $cuentaSuNegocio = preg_match('/\b(vendo|vendemos|tengo(?! que)|tenemos(?! que)|hago|hacemos|ofrezco|ofrecemos|soy|somos|manejo|manejamos|me dedico|nos dedicamos|trabajo (de|en)|fabrico|fabricamos|acepto|aceptamos|cobro|cobramos)\b/u', $t);
    $tienePregunta = strpos((string)$texto, '?') !== false || strpos((string)$texto, '¿') !== false;
    /* Cómo se da de baja el plan y si hace falta cuenta de Mercado Pago (Pablo,
     * 11-sep). Antes que el plan mensual, que agarraría "dar de baja el plan
     * mensual". La baja tiene que ser del plan o la suscripción: "dar de baja
     * una propiedad" es del panel de la inmobiliaria. */
    if (preg_match('/\b(permanencia|desuscrib\w*|dejar de pagar|dejo de pagar|deja de pagar)\b/u', $t)
        || (preg_match('/\b(de baja|la baja|cancel\w*|anular)\b/u', $t)
            && preg_match('/\b(plan|suscripcion|mensualidad|abono|servicio|debito|mercado ?pago|cuota)\w*/u', $t)
            && !preg_match('/\b(propiedad\w*|producto\w*|curso\w*|publicacion\w*|alumno\w*)\b/u', $t))
        || preg_match('/\b(cuenta (de|en) mercado ?pago|no tengo mercado ?pago|sin mercado ?pago|tener mercado ?pago)\b/u', $t)) {
        return 'baja_del_plan';
    }
    if (preg_match('/\bmantenimiento\b/u', $t)) return 'mantenimiento';
    if (preg_match('/\b(por mes|mensual\w*|al mes|cada mes|abono\w*|cuota mensual|mensualidad|costo fijo|pago mensual)/u', $t)
        && !($cuentaSuNegocio && !$tienePregunta)) return 'mantenimiento';
    if (preg_match('/\b(hasta cuando|por cuanto tiempo|cuanto tiempo|cuantos dias|se vence|vence|caduca|se cae|se borra|sigue disponible|va a estar disponible|expira)\b.{0,30}\b(demo|muestra|link|pagina de prueba)\b/u', $t)
        || preg_match('/\b(demo|muestra|link)\b.{0,30}\b(hasta cuando|por cuanto tiempo|cuantos dias|se vence|vence|caduca|se borra|expira|sigue disponible|va a estar disponible)\b/u', $t)) return 'demo_vigencia';
    // "Cuánto tiempo llevan?" pregunta por la trayectoria, no por el plazo de
    // entrega: los trabajos entregados son la respuesta (9-sep).
    if (preg_match('/\bcuanto (tiempo|hace)\b.{0,12}\b(llevan|llevas|lleva|que estan|que existen|que trabajan|haciendo (esto|paginas|webs)|en el rubro|en esto|en el mercado)\b/u', $t)) return 'ejemplos';
    // "en q horario más o menos va a estar listo?" no matcheaba ninguna de
    // estas y se iba sin respuesta (caso Lara, 28-ago): preguntar por la HORA
    // es preguntar por el plazo igual que preguntar cuánto tarda.
    if (preg_match('/\b(cuanto tarda\w*|cuanto demora\w*|cuanto tiempo|plazo\w*|cuando esta|cuando la tienen|cuando la entregan|tiempo de entrega|para cuando|en cuanto la|cuando estaria)/u', $t)
        || preg_match('/\b(que|q|cual) horario\b/u', $t)
        || preg_match('/\ba que hora\b|\bpara que hora\b|\ben que momento\b/u', $t)
        || preg_match('/\b(va a estar|estara|va a quedar|queda|la tengo|la tenes|lo tenes)\b.{0,14}\b(list[oa]|pronta|terminad[oa])\b/u', $t)
        || preg_match('/\b(cuando|cuándo)\b.{0,18}\b(list[oa]|lista|me la mandas|me la manda|la mandan|la tenes)\b/u', $t)) {
        return 'plazos';
    }
    // Cómo van a pagarle SUS clientes no es cómo se nos paga a nosotros.
    if (preg_match('/\b(como se paga\w*|formas? de pago|medios? de pago|se puede pagar|transferencia\w*|mercado pago|en cuotas|senia|sena)\b/u', $t)
        && !preg_match('/\b(mis clientes|los clientes|la gente|que (me )?paguen|cobrar|cobro|cobrarles|acepto|aceptamos|en mi (local|tienda|negocio))\b/u', $t)) return 'pago';
    // Estas van ANTES de hosting a proposito: la palabra 'dominio' aparece en
    // varias de ellas y, si no, todas caian en la respuesta de hosting.
    /* Lo incluido que se contesta SOLO si lo pregunta (Pablo, 11-sep): el
     * dominio .com, los idiomas, los turnos online, los usuarios y las
     * estadísticas. El .com se mira en el texto crudo: normalizado, ".com"
     * queda "com" y ".com.ar" queda "com ar". */
    $crudo = mb_strtolower(wabot_texto_sin_urls((string)$texto));
    if (preg_match('/(^|[\s(¿])\.com\b(?!\s*\.?\s*ar\b)|\bpunto com\b(?!\s*(punto\s*)?ar\b)|\bpuntocom\b/u', $crudo)) return 'dominio_com';
    // "Doy clases de idiomas" es el rubro: los idiomas sueltos no alcanzan.
    if (preg_match('/\b(bilingue|trilingue|dos idiomas|tres idiomas|(varios|otros|distintos|mas de un|otro) idiomas?|cuantos idiomas|que idiomas'
        . '|en ingles|en portugues|en frances|version en ingles|multi ?idioma|traducida|traducirla|traducirse|traducir (la|mi|el) (web|pagina|sitio)'
        . '|se puede traducir|traduccion de la (web|pagina)|traduccion a)\b/u', $t)) return 'bilingue';
    $formaDePregunta = $tienePregunta
        || preg_match('/^(se puede|se pueden|puedo|pueden|podes|podria|podrian|incluye|incluyen|tiene|tienen|trae|hay|es posible)\b/u', $t)
        || preg_match('/\b(se puede|se pueden|incluye|incluyen|viene con|trae|es posible|seria posible|esta incluid\w*|sale aparte|se paga aparte|tiene costo|es un adicional|es extra)\b/u', $t);
    if ($formaDePregunta
        && preg_match('/\b(turnos? online|turnos? por la (web|pagina)|turnero|sistema de (turnos|reservas)|sacar (un )?turno|pedir (un )?turno|reservar (un )?turno'
            . '|reservas? online|reservar (desde|por|en) la (web|pagina)|reservas? desde la (web|pagina)|que (me )?reserven|agenda online|agendar'
            . '|(tiene|tienen|incluye|hay) (sistema de )?(turnos|reservas))\b/u', $t)) return 'turnos';
    if ($formaDePregunta
        && preg_match('/\b(usuarios?|registrarse|registrar(se)? (a )?(los|mis|tus) clientes|se (pueden|puede) registrar|crear (una |su )?cuenta|cuentas? de (clientes|usuarios|socios|alumnos)'
            . '|area (de|para) (socios|clientes|miembros|alumnos|usuarios)|zona de (socios|clientes|miembros)|login|iniciar sesion|inicio de sesion|con (su|un) usuario)\b/u', $t)
        && !preg_match('/\b(usuario y contrasena|credenciales|cpanel|ftp|hosting|admin|administrador|administrar|panel)\b/u', $t)) return 'usuarios';
    if (preg_match('/\b(estadisticas?|metricas?|analiticas?|cuanta gente (entra|visita|ve|me visita|mira|la ve)|cuantas visitas|cuantos (entran|visitan|me visitan)'
            . '|cantidad de visitas|visitas (de|a|en) (la|mi) (web|pagina|tienda)|trafico de la (web|pagina))\b/u', $t)
        && !($cuentaSuNegocio && !$tienePregunta)) return 'estadisticas';
    // Está comparando o le pasaron otro precio: no se contesta con el precio de
    // nuevo, se contesta corriendo la comparación a qué incluye cada uno.
    if (preg_match('/\b(estoy (viendo|mirando|averiguando|comparando)|ando (viendo|mirando|averiguando)|comparando (precios?|presupuestos?)|pidiendo (otros )?presupuestos?|me pasaron (otro|un)|otro me (cobra|paso|hace)|mas barato en otro|vi otro (mas barato|presupuesto))\b/u', $t)) return 'comparando';
    if (preg_match('/\b(responsive|es adaptable|se adapta al (celular|telefono|movil))\b/u', $t)
        || (preg_match('/\b(celular|celulares|telefono|movil|mobile|tablet)\b/u', $t)
            && preg_match('/\b(se ve|se abre|se adapta|funciona|anda|entra|entran|sirve|queda|visualiza)\b/u', $t))) return 'responsive';
    if (preg_match('/\b(no se nada de|no entiendo nada de|no manejo|no soy de|soy (un )?desastre con)\b.{0,24}\b(paginas?|web|compu|tecnologia|sistemas|internet)\b/u', $t)) return 'no_se_nada';
    /* "¿Hacés esta clase de página o solo atendés a grandes empresas?" — la
     * pregunta del que recién arranca y no se anima a preguntar el precio. */
    if (preg_match('/\b(solo|unicamente|nada mas)\b.{0,20}\b(grandes|empresas grandes|empresas|marcas grandes)\b/u', $t)
        || preg_match('/\b(emprendimiento|emprendimientos|emprendedor|emprendedora|negocio chico|negocios chicos|recien empiezo|recien arranco|recien estoy empezando|chiquito|pequeno negocio|micro ?emprendimiento)\b.{0,40}\b(hacen|hacés|haces|trabajan|sirve|atienden|es para|tambien|también)\b/u', $t)
        || preg_match('/\b(hacen|hacés|haces|trabajan|atienden)\b.{0,30}\b(emprendimiento|emprendimientos|emprendedores|negocios chicos|negocio chico|proyectos chicos)\b/u', $t)) {
        return 'emprendimientos';
    }
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
    /* "Las dos cosas, que puedan comprar online y también consultarme por
     * WhatsApp": no hay que elegir, el ecommerce trae las dos. El bot le
     * ofreció la demo sin confirmarlo y el cliente quedó sin saberlo (27-ago).
     *
     * Solo fuera de un desempate: ahí adentro "las dos cosas" es la RESPUESTA
     * a la pregunta y la resuelve wabot_desempate_por_palabras() cotizando
     * ecommerce, que es el tipo que cubre ambas. */
    if (!in_array((string)$fase, ['desempate_comercio', 'desempate_turnos', 'desempate_cursos', 'desempate_hibrido'], true)
        && preg_match('/\b(las dos|ambas|los dos|las dos cosas|de las dos formas|ambos)\b/u', $t)
        && preg_match('/\b(comprar|compren|carrito|online|pagar|paguen|vender)\b/u', $t)
        && preg_match('/\bwh?ats?app\b|\bconsultar\w*\b|\bconsulten\b|\bescriban\b/u', $t)) return 'las_dos_formas';

    // "No quiero llevarlos a WhatsApp" va ANTES de formularios: la alternativa
    // que hay que ofrecerle incluye el formulario, pero la pregunta no es por
    // el formulario — es por sacar el WhatsApp, que es lo que él pidió.
    if (preg_match('/\b(no quiero|no me sirve|sin|prefiero no|no me gusta|evitar|no uso)\b.{0,30}\bwh?ats?app\b/u', $t)
        || preg_match('/\bwh?ats?app\b.{0,25}\bno (quiero|me sirve|uso|va)\b/u', $t)) return 'sin_whatsapp';
    if (preg_match('/\b(como (me )?(comunico|contacto|hablo|escribo)|como (lo|le) (contacto|ubico|encuentro)|tiene (otro )?numero'
        . '|me pasas (su|el) (numero|contacto)|cuando me escribe)\b.{0,25}\b(desarrollador|programador|pablo|el)\b/u', $t)
        || preg_match('/\b(desarrollador|programador)\b.{0,25}\b(como (me )?(comunico|contacto)|que numero|me escribe)\b/u', $t)) return 'contacto_desarrollador';
    // "Ahí te mandé el formulario" avisa que lo completó; no pregunta si la web puede tener uno.
    if (preg_match('/\b(formulari\w*|formulaio\w*|encuesta\w*|encuenta\w*|encusta\w*|cuestionario\w*|planillas? para (llenar|completar))\b/u', $t)
        && !preg_match('/\b(te (mande|envie|pase)|ya (lo |te )?(complete|llene|mande|envie)|(recien|ya) lo (complete|llene)|lo complete|lo llene|ahi (va|te)|el formulario que (me )?(mandaste|pasaste|enviaste)|no me (abre|carga|anda|funciona)|no puedo (completar|abrir|entrar))\b/u', $t)) return 'formularios';
    if (preg_match('/\b(migracion|migrar|migran|pasar (mis|los) (contenidos?|textos?|datos)|traspasar (el )?contenido|mudar (la|mi) (web|pagina))\b/u', $t)) return 'migracion';
    // Qué factura emitimos (solo C) va ANTES de 'inscripcion', que contesta si
    // el CLIENTE tiene que estar inscripto: son dos preguntas distintas y la
    // palabra "factura" aparece en las dos.
    if (preg_match('/\b(hacen|emiten|dan|manejan|trabajan con|me hacen|nos hacen|puedo tener|dan de)\b.{0,20}\bfactura\b/u', $t)
        || preg_match('/\bfactura\s*[abc]\b/u', $t)
        || preg_match('/\b(que tipo de factura|iva discriminado|responsable inscripto)\b/u', $t)) return 'facturacion';
    if (preg_match('/\b(inscripto|inscripcion|monotributo|monotributista|afip|arca|factura\w*|cuit|habilitacion municipal)\b/u', $t)) return 'inscripcion';
    // Sí hacemos apps, pero se cotizan aparte: no se contesta con una web.
    if (preg_match('/\b(app|aplicacion|aplicaciones|apk)\b.{0,30}\b(celular|movil|telefono|android|ios|play store|app store|descargar)\b/u', $t)
        || preg_match('/\b(play store|app store)\b/u', $t)
        || preg_match('/\b(hacen|desarrollan|arman|programan)\b.{0,15}\b(apps?|aplicaciones?)\b/u', $t)) return 'apps';
    if (preg_match('/\b(exclusiv\w*|diseno unico|copian y pegan|copian el diseno|mismo diseno|le copian|reciclan el diseno|plantilla repetida)\b/u', $t)) return 'exclusividad';
    if (preg_match('/\b(cuantas?|cuantos)\b.{0,15}\b(fotos?|imagenes?|videos?)\b.{0,20}\bpropiedad/u', $t)
        || preg_match('/\bpropiedad\w*\b.{0,20}\b(cuantas?|cuantos)\b.{0,15}\b(fotos?|imagenes?|videos?)\b/u', $t)) return 'fotos_propiedad';
    if (preg_match('/\bimpuestos? de importacion|aranceles? de importacion|impuestos? aduaner\w*|calcula\w* (los )?impuestos\b/u', $t)) return 'impuestos_importacion';
    /* "Armala con ejemplos, no es necesario que te envíe nada por el momento"
     * NO pide el portfolio: pide que la demo se arme con contenido de relleno
     * mientras él junta el material (caso silfer herrajes, 27-ago). Contestarle
     * con el link de trabajos hechos es no haberlo leído. Se excluye antes de
     * la clave 'ejemplos' porque ahí "ejemplos" a secas alcanza para matchear. */
    if (preg_match('/\b(con|de|sin)\s+(datos|fotos|imagenes|productos|contenido|textos|informacion)?\s*ejemplos?\b/u', $t)
        && !preg_match('/\b(tenes|tienen|tienes|hay|puedo ver|me (pasas|mandas|mostras)|mostrarme|ver algun)\b/u', $t)) {
        return null;
    }
    // "¿Tienen alguna web para ver de dentista?" pide ejemplos, no el portfolio
    // general de que_hacemos: exige el verbo de mostrar junto al sustantivo.
    if (preg_match('/\b(ejemplos?|muestras? de trabajo|portfolio|porfolio|trabajos (que |ya )?(hicieron|realizados|hechos)|casos? de exito)\b/u', $t)
        || preg_match('/\b(tienen|tenes|tienes|hay|puedo ver|me (pasas|mandas)|mostrarme|ver alguna)\b.{0,30}\b(web|pagina|sitio|demo)\b.{0,40}\b(para ver|de otro|de algun|parecida|similar|del rubro|hecha)\b/u', $t)
        // "¿Tenés alguna para ver de algún cirujano?" — el sustantivo se elide
        // porque la web ES el tema de toda la charla: alcanza con pedir ver
        // alguna "de" un rubro (caso Oscar, 21-ago).
        || preg_match('/\b(tenes|tienes|tienen|hay|me mostras|puedo ver)\b.{0,12}\b(alguna|alguno|algunas?)\b.{0,15}\b(para ver|ver)\b.{0,15}\bde\b/u', $t)
        // "De todo tenés alguna para ver" (inmobiliaria, 27-ago): el "de" va
        // adelante, no detrás, así que la variante de arriba no lo tomaba.
        || preg_match('/\b(tenes|tienes|tienen)\b.{0,15}\b(alguna|alguno|algo)\b.{0,12}\bpara ver\b/u', $t)) return 'ejemplos';
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
    // "Qué es desarrollo web?" no pregunta si Gokywebs lo hace, pregunta qué
    // significa el término: es la misma respuesta (explica qué es y de paso
    // qué hacemos), pero sin esto caía en "otra" y derivaba una duda básica al
    // desarrollador (caso real, 24-ago).
    // "Landing" es jerga nuestra: el que la pregunta quiere la definición, no
    // el portfolio. Va ANTES de que_hacemos, que matchea "que es una web".
    if (preg_match('/\b(que es|que seria|que significa|a que le dicen|me explicas que es)\b.{0,12}\b(una |la |el |un )?landing\b/u', $t)
        || preg_match('/\blanding\b.{0,10}\bque es\b/u', $t)) return 'que_es_landing';
    if (preg_match('/\b(hacen paginas?|crean paginas?|hacen webs?|hacen sitios|disenan paginas?|hacen las paginas|que es (el )?desarrollo web|que es una pagina web|que es un sitio web|que es (una )?web|en que consiste (el )?desarrollo web|que significa desarrollo web)\b/u', $t)) return 'que_hacemos';
    if (preg_match('/\b(sin internet|se corta (el )?internet|sin conexion|funciona offline|no tengo internet|sin senal|sin wifi)\b/u', $t)) return 'internet';
    if (preg_match('/\b(estafa\w*|es seguro esto|son confiables|es confiable|quiero referencias|garantia de que)\b|desconfi/u', $t)) return 'confianza';
    if (preg_match('/\b(pixel|google analytics|analytics|codigo de seguimiento|conversiones de meta)\b/u', $t)) return 'pixel';
    if (preg_match('/\b(precios? de cada|todos los precios|lista de precios|precios? de los servicios|desde el basico|precios? de todos)\b/u', $t)) return 'rangos';
    /* "Sería una página donde la gente entre, compre y yo envío?" es una
     * pregunta de confirmación sobre cómo funciona la tienda, y se contesta
     * que sí explicando el circuito. Romina la hizo y se llevó un "querés que
     * te arme una muestra?" (28-ago).
     *
     * El freno de la primera persona es lo que distingue la pregunta del
     * rubro: "vendo ropa, la gente elige y le mando por correo" cuenta cómo
     * trabaja hoy, no pregunta nada. */
    // $cuentaSuNegocio se calcula arriba, junto al freno de mantenimiento.
    if (!$cuentaSuNegocio
        && preg_match('/\b(la gente|el cliente|los clientes|la persona|uno)\b.{0,26}\b(entra|entren|compra|compre|compren|elige|elijan)\b/u', $t)
        && preg_match('/\b(pagina|web|tienda|online|carrito|desde ahi|yo envio|yo mando|le mando|me llega|paga|pagan|paguen)\b/u', $t)) return 'como_funciona_tienda';
    if (preg_match('/\bcomo funciona\b.{0,14}\b(la tienda|el carrito|el ecommerce|la venta online|la compra)\b/u', $t)) return 'como_funciona_tienda';

    // "Qué más puedo incluir?" tampoco tenía respuesta, misma charla.
    if (preg_match('/\bque (mas|otras cosas|otra cosa)\b.{0,26}\b(incluir|incluye|agregar|sumar|poner|tener|llevar|se puede)\b/u', $t)
        || preg_match('/\bque\b.{0,10}\b(incluye|trae)\b.{0,14}\b(la web|la pagina|el precio|la tienda)\b/u', $t)) return 'que_incluye';

    // "Preciop" al final del mensaje es "precio" con el dedo resbalado: la
    // palabra suelta pidiendo el valor (con hasta dos letras de yapa) cuenta.
    /* "Presupuesto" es como pide el precio media Argentina y no estaba en
     * ninguna de estas formas. Remax ya tenía la landing cotizada en $160.000,
     * volvió a preguntar "el presupuesto" y el bot le contestó que se lo iba a
     * responder el desarrollador; un mensaje después le dio los $160.000
     * igual (28-ago).
     *
     * La palabra sola no alcanza: "quiero que me pidan presupuesto desde la
     * web" describe SU negocio, no pregunta el nuestro. Van las formas en que
     * se pregunta, no el sustantivo suelto. */
    $pidePresupuesto = preg_match('/\b(cuanto|cual|que)\b.{0,14}\b(es|era|seria|sale|fue)?\b.{0,6}\bel presupuesto\b/u', $t)
        || preg_match('/\b(me pasas|pasame|mandame|me mandas|me decis|decime|repetime|me repetis)\b.{0,14}\bel presupuesto\b/u', $t)
        || preg_match('/\bque presupuesto\b.{0,20}\b(me|habias|pasaste|diste|dijiste)\b/u', $t)
        || preg_match('/^\s*(y\s+)?el presupuesto\s*\??\s*$/u', $t)
        || preg_match('/\bcuanto me\b.{0,14}\b(dijiste|habias dicho|pasaste|cotizaste)\b/u', $t);

    /* "costo" pelado al final del mensaje entraba por ningún lado: el anuncio
     * mete "Hola. ¿Puedo obtener más información sobre esto?" y el cliente le
     * pegó "costo" atrás. Nadie lo reconoció como pregunta de precio y se
     * llevó "esa duda te la va a poder contestar el desarrollador" en el
     * primer mensaje de la charla (29-ago). */
    if (preg_match('/\b(cuanto (sale|cuesta|esta|vale|saldria|seria)|que (precio|valor|costo)|cual (es|era) el (precio|costo)|precio total|el precio final|(precio|valor|costo) tiene)\b/u', $t)
        // Solo si es la palabra suelta o va pegada detrás de una pregunta
        // ("…sobre esto? Preciop"): "mi negocio se llama Buen Valor" no pide nada (9-sep).
        || ((count(explode(' ', $t)) <= 4 || preg_match('/[?\n¿]\s*\p{L}+\s*$/u', trim((string)$texto)))
            && preg_match('/\b(precio|costo|valor)\w{0,2}\s*$/u', $t))
        || $pidePresupuesto) {
        // 'prediseno'/'prediseno_ref'/'prediseno_wsp' entran acá también: el
        // precio y la propuesta del prediseño salen juntos en el mismo turno
        // (wabot_precio()), así que la fase ya pasó a prediseno desde el
        // mensaje del precio, no recién cuando el cliente confirma.
        if (in_array($fase, ['pitch', 'precio', 'prediseno', 'prediseno_ref', 'prediseno_wsp', 'confirma_cambio', 'derivado', 'postdemo'], true)) return 'precio_actual';
        // Sin saber qué tipo de web necesita no hay precio exacto: se le pregunta
        // en vez de escaparse con "eso te lo confirma el equipo" (caso Abel).
        if (in_array($fase, ['nuevo', 'menu', 'algo_diferente'], true)) return 'precio_sin_rubro';
    }
    /* El envío: cómo se cobra, si lo calcula la web, si se integra con el
     * correo. Va antes que 'carga' y que la objeción de plataforma porque el
     * cliente suele preguntarlo comparando con Tiendanube, y ahí el bot se
     * enganchaba a defender la comparación en vez de contestar (caso Elena /
     * Planeta Bebé, 28-ago). */
    $temaEnvio = '\b(envio|envios|el flete|los fletes|despacho|logistica|andreani|oca|correo argentino|codigo postal)\b';
    /* Nombrar el tema no alcanza: "vendo productos y hago envios a domicilio"
     * es el RUBRO del cliente, no una duda. Tiene que preguntar algo. */
    $preguntaEnvio = '\b(calcul\w+|cotiz\w+|integra\w*|conecta\w*|automatic\w+|se puede|puede|pueden|podes|podria|hay|tienen|incluye|sirve|funciona|es posible|se maneja|se manejan|como (se|lo|los)|que pasa con)\b';
    if (preg_match('/' . $temaEnvio . '/u', $t) && preg_match('/' . $preguntaEnvio . '/u', $t)) return 'envios';
    if (preg_match('/\b(la web|la pagina|la tienda|el sistema)\b.{0,20}\bcalcul\w+\b.{0,14}\b(envio|envios|flete)\b/u', $t)) return 'envios';

    /* La comisión por venta: la pregunta que decide la compra frente a
     * Tiendanube. Va ANTES de 'pago' y de 'carga' porque el mensaje trae
     * "cobran"/"venta" y se lo llevaban ellos (D05 y E07, 1-sep). */
    if (preg_match('/\b(comision|comisiones|porcentaje)\b/u', $t)
        && preg_match('/\b(cobran|cobras|se quedan|se llevan|hay|tienen|ustedes|por venta|por cada venta|sobre las ventas|de las ventas)\b/u', $t)) return 'comisiones';
    if (preg_match('/\b(quien carga|cargan ustedes|carga de productos|subir los productos|cargar el contenido|los textos los)\b/u', $t)) return 'carga';
    /* "despues la puedo ir actualizando yo?" — quien mantiene el contenido.
     * Exige el pronombre (yo/nosotros/solo) para no pisar "puedo cambiar los
     * colores?", que es un pedido de cambio del prediseno, no esta duda. */
    if (preg_match('/\b(puedo|podemos|podre|voy a poder|se puede)\b.{0,30}\b(ir )?(actualiz|modific|edit|administr|carg)\w+\b.{0,18}\b(yo|nosotros|nosotras|solo|sola|mismo|misma)\b/u', $t)) return 'carga';

    // Ya tiene una web propia (la hizo otro, está en WordPress): se ofrece
    // revisarla en vez de empujar el reemplazo. Tiendanube, Shopify y Wix NO
    // entran acá a propósito: no trabajamos sobre esas plataformas y ya tienen
    // su respuesta en la objeción de alquiler mensual (menciona_plataforma).
    if (preg_match('/\b(wordpress|woocommerce)\b/u', $t)
        && !preg_match('/\b(que tecnologia|con que (lo|la) hacen|usan|trabajan con)\b/u', $t)) return 'ya_tiene_plataforma';
    if (preg_match('/\b(ya tengo (una |mi )?(pagina|web|sitio)|tengo (una |mi )?(pagina|web|sitio) (hecha|armada|actual|vieja)|mi (pagina|web) actual)\b/u', $t)) return 'ya_tiene_plataforma';
    /* Nombrar el logo no es preguntar por el logo. Dos mensajes seguidos de un
     * cliente de catering (27-ago) se llevaron "no hacemos logos": primero
     * "Es el logo del emprendimiento" —estaba diciendo qué era la foto que
     * acababa de mandar— y después "No necesito logo", que es exactamente lo
     * contrario de una consulta. Contestar eso dos veces al que ya lo tiene
     * hace parecer que el bot no lee. */
    if (preg_match('/^(es|este es|ese es|ahi va|aca va|te (paso|mando|envio|dejo)|adjunto)\b.{0,20}\blogo\b/u', $t)
        || preg_match('/\bno (necesito|quiero|hace falta|preciso)\b.{0,15}\blogo\b/u', $t)
        || preg_match('/\b(ya )?(tengo|tenemos)\b.{0,12}\b(el |mi |un )?logo\b/u', $t)) {
        return null;
    }
    // Palabras completas: "catálogo" contiene "logo" como substring y no es
    // una consulta sobre identidad visual.
    if (preg_match('/(?:^|\s)(?:logo|isotipo|identidad|marca grafica)(?:\s|$)/u', $t)) return 'logo';
    if (preg_match('/\b(publicidad|marketing|pauta|anuncios|posteos|redes sociales|(hacen|manejan|llevan) (las )?redes|community)\b/u', $t)) return 'marketing';
    if (preg_match('/\b(de donde son|donde estan|donde quedan|en que (ciudad|provincia|zona|localidad)|son de (aca|argentina)|tienen (oficina|local|sucursal)|puedo ir|nos podemos ver|donde los ubico|de que (ciudad|provincia|pais))\b/u', $t)) return 'ubicacion';
    // "Atiendo por videollamada" cuenta el servicio; "podemos hacer una reunión?" pregunta (9-sep).
    if (preg_match('/\b(reunion|reuniones|videollamada|llamada|nos juntamos|zoom|meet)\b/u', $t)
        && ($tienePregunta || preg_match('/\b(hacemos|hagamos|podemos|podriamos|se puede|puedo|quiero|quisiera|me gustaria|hay|tienen|coordinar|coordinamos|prefiero)\b/u', $t))
        && !preg_match('/\b(atiendo|atendemos|doy|damos|dicto|trabajo|trabajamos|ofrezco|ofrecemos|clases|sesiones|consultas|turnos|mis (clientes|pacientes|alumnos)|no me interesa|no quiero)\b/u', $t)) return 'reuniones';
    if (preg_match('/\b(wordpress|con que lo hacen|que tecnologia|codigo)\b/u', $t)) return 'tecnologia';
    if (preg_match('/\b(como (se )?manejan|como trabajan|como es el proceso|como sigue|como funciona el trabajo)\b/u', $t)) return 'proceso';

    return null;
}

function wabot_desempate_por_palabras($fase, $texto) {
    $t = ' ' . wabot_normalizar_frase($texto) . ' ';
    if (trim($t) === '') return null;

    /* Los puntos de venta son los kioscos donde se consigue el producto, no
     * una intención de vender online — pero contienen la palabra "venta", que
     * está en la lista de comercio_vender y se evalúa primero. Overlord
     * Magazine explicó en un audio que quería mostrar los números, la historia
     * y los puntos de venta de su revista, y terminó cotizado como ecommerce
     * de $290.000 (28-ago). Se neutraliza antes de mirar nada. */
    $t = preg_replace('/\b(puntos?|bocas?) de (venta|ventas|expendio)\b/u', ' donde se consigue ', $t);
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

    /* "Para hacer una tienda o canal de ventas de whatsapp o no sé qué me
     * conviene" (Germán, 27-ago): nombró las DOS opciones y dijo explícitamente
     * que no sabe. La palabra "tienda" alcanzaba para devolver 'vender' y el
     * bot le cotizó el tipo MÁS CARO ($290.000) sin preguntar nada. Pedir que
     * elija no es burocracia: es la diferencia entre $180.000 y $290.000.
     *
     * Solo cuenta si además NO se decidió por ninguna: quien dice "no sé si
     * conviene, pero quiero vender online" ya eligió y se respeta. */
    // "q"/"k"/"qe" son la forma en que se escribe "qué" en WhatsApp: el texto
    // real decía "no se q me conviene" y sin esto no matcheaba nada.
    $que = '(que|q|k|qe|cual|cuales)';
    $dudaExplicita = (bool)preg_match(
        '/\bno se\b.{0,20}\b' . $que . '\b.{0,15}\b(me conviene|conviene|es mejor|elegir|va mejor)\b'
        . '|\b' . $que . '\b.{0,12}\b(me conviene|me recomendas|me recomendes|me sugeris|conviene mas|es mejor para mi)\b'
        . '|\bno se\b.{0,10}\b(bien|cual|que hacer|que necesito)\b'
        . '|\bvos que\b.{0,10}\b(decis|opinas|recomendas)\b/u', $t);
    if ($dudaExplicita) return null;

    // Las negaciones ganan: "sin carrito" no es "carrito", "no quiero vender" no es "vender".
    $niega = $tiene(['sin carrito', 'sin cobro', 'sin tienda', 'sin venta', 'sin turnos', 'sin plataforma',
                     'no quiero vender', 'no vender', 'no cobrar', 'no me interesa vender', 'no hace falta vender',
                     'nada de carrito', 'nada de cobro', 'no quiero cobrar', 'no vendo online']);
    if ($niega) {
        if ($fase === 'desempate_comercio') return 'comercio_mostrar';
        if ($fase === 'desempate_turnos')   return 'turnos_no';
        if ($fase === 'desempate_cursos')   return 'cursos_mostrar';
    }
    /* La negación explícita de los turnos.
     *
     * Vivi (medicina laboral) dijo "No necesito reserven turnos porque yo tengo
     * un sistema" y el bot le cotizó una web CON sistema de turnos por $200.000:
     * justo la función que acababa de rechazar. La lista de verbos tenía
     * "quiero" y "hace falta" pero no "necesito", así que la frase caía en el
     * matcher de abajo, que ve "reserven turnos" y devuelve turnos_si (28-ago).
     *
     * El "ya tengo mi sistema" va aparte: no es una negación gramatical, pero
     * dice lo mismo y es como lo dice medio mundo. */
    $verbosNeg = '(quiero|queremos|quiere|queres|quieren|necesito|necesitamos|necesita|necesitas|necesitan|preciso|precisamos|precisa|hace falta|hacen falta|me sirve|nos sirve)';
    if ($fase === 'desempate_turnos' && (bool)(
        preg_match('/\bno\b\s+' . $verbosNeg . '\b.{0,15}\bque\b.{0,20}\b(reserven|reserve|reserva|reservas|saquen|elijan|elijas)\b/u', $t)
        || preg_match('/\bno\b\s+' . $verbosNeg . '\b.{0,20}\b(reserven|reserva|reservas|reservar|turnos|solos|online)\b/u', $t)
        || preg_match('/\bya\b.{0,10}\b(tengo|tenemos|manejo|manejamos|uso|usamos)\b.{0,24}\b(sistema|agenda|software|programa|plataforma)\b/u', $t)
        || preg_match('/\b(tengo|tenemos|manejo|manejamos|uso|usamos)\b.{0,12}\b(mi|nuestro|otro|un)\b.{0,10}\b(propio\s+)?(sistema|agenda|software|programa|plataforma)\b/u', $t)
    )) {
        return 'turnos_no';
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
                'mostrar', 'muestre', 'mostrarlos', 'mostrarlas', 'catalogo', 'catálogo',
                'presentacion', 'presentar', 'contacten', 'contacto',
                'whatsapp', 'whatsap', 'whatsapp.', 'wasap', 'wasapp', 'wasup', 'wassap',
                'watsapp', 'watsap', 'wtsp', 'wsp', 'wspp', 'wpp', 'wp', 'whats', 'guasap', 'guasapp',
                'informativa', 'solo mostrar', 'que me escriban', 'me escriban',
                'escriban', 'que me hablen', 'me contacten', 'la simple', 'la basica', 'sin carrito',
                'sin cobro', 'nomas', 'solamente mostrar', 'que muestre',
                // "Quiero publicar los vehículos" es una respuesta clarísima que
                // el bot repreguntaba (caso Black Automotores, 22-ago): publicar,
                // exhibir o listar es mostrar, no cobrar online.
                'publicar', 'publicarlos', 'publicarlas', 'publico', 'publicamos',
                'exhibir', 'exhibirlos', 'listar', 'subir los productos', 'subirlos',
                'que se vean', 'para que vean', 'ver los modelos', 'los vehiculos',
                'las propiedades', 'los productos', 'mi stock', 'el stock',
                // Dónde conseguir el producto es justo lo contrario de venderlo
                // por la web: manda al cliente a un local físico.
                'donde se consigue', 'donde conseguirla', 'donde conseguirlo',
                'donde conseguir', 'donde comprarla', 'donde comprarlo',
                'distribuidores', 'kioscos', 'locales', 'sucursales',
            ]))) return 'comercio_mostrar';
            return null;
        case 'desempate_hibrido':
            /* Las palabras que el propio bot pide no matcheaban. desempate_hibrido_2
             * dice «respondeme "trabajos" o "vender"» y ninguna de las dos estaba
             * en la lista, ni los ordinales que sí tienen los otros desempates:
             * el cliente contestaba exactamente lo que le pidieron y el bot le
             * volvía a preguntar lo mismo (auditoría del 2-sep). */
            if ($tiene(array_merge($segunda, [
                'vender online', 'vender por la web', 'vender desde la web', 'tienda online', 'ecommerce',
                'e commerce', 'carrito', 'cobro online', 'cobrar online', 'que compren', 'que paguen',
                'vender', 'venderlos', 'venderlas', 'venta', 'venta online', 'ventas', 'cobrar',
            ]))) return 'hibrido_vender';
            if ($tiene(array_merge($primera, [
                'mostrar trabajos', 'mostrar los trabajos', 'mostrar el trabajo', 'mostrar nuestros trabajos',
                'mostrar mis trabajos', 'trabajos realizados', 'trabajos que hice', 'trabajos hechos',
                'portfolio', 'portafolio', 'obras', 'mostrar lo que hacemos',
                'trabajos', 'los trabajos', 'mis trabajos', 'nuestros trabajos',
            ]))) return 'hibrido_trabajos';
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
                // "que la gente vea las fechas libres y reserve sin llamarme":
                // el subjuntivo singular no estaba y unas cabañas se derivaron
                // sin cotizar justo al contestar el desempate (D04, 1-sep).
                'reserven', 'reservar', 'reserva', 'reservas', 'reserve', 'saquen', 'sacar turno', 'saquen turno', 'agenda', 'calendario',
                'sistema de turnos', 'con turnos', 'que elijan', 'elijan', 'automatico', 'la completa',
                'fechas libres', 'vean las fechas', 'la disponibilidad', 'ver disponibilidad',
            ]))) return 'turnos_si';
            if ($tiene(array_merge($segunda, [
                'whatsapp', 'whatsap', 'whatsapp.', 'wasap', 'wasapp', 'wasup', 'wassap', 'watsapp', 'watsap', 'wtsp', 'wsp', 'wspp', 'wpp', 'wp', 'whats', 'guasap', 'guasapp',
                'escriban', 'me escriban', 'que me escriban', 'agendo yo', 'los agendo',
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

/**
 * "Costos?" en medio de un desempate.
 *
 * El bot contestaba el rango genérico y remataba con "contame a qué te
 * dedicás" — a alguien que ya había dicho "Pediatría" y estaba contestando la
 * pregunta de turnos (27-ago). Tira a la basura todo lo que ya sabe y obliga
 * al cliente a repetirse: la charla murió ahí.
 *
 * Acá las dos opciones del desempate YA definen dos precios exactos, así que
 * se dicen los dos y la pregunta se responde sola. Los montos salen de
 * $cfg['tipos'], nunca escritos a mano, para que no se desfasen.
 */
function wabot_desempate_precios_texto($fase, $cfg) {
    $opciones = [
        'desempate_turnos'   => ['landing'   => 'si te escriben por WhatsApp y los agendás vos',
                                 'turnos'    => 'si preferís que los reserven solos desde la web, eligiendo día y horario'],
        'desempate_comercio' => ['catalogo'  => 'si mostrás los productos y te consultan por WhatsApp',
                                 'ecommerce' => 'si querés carrito y cobro online desde la web'],
        'desempate_cursos'   => ['landing'   => 'si solo mostrás los cursos y te contactan por WhatsApp',
                                 'elearning' => 'si querés venderlos desde la web, con acceso propio para cada alumno'],
    ];
    if (!isset($opciones[$fase])) return null;

    $lineas = [];
    foreach ($opciones[$fase] as $tipo => $condicion) {
        /* Un tipo retirado no se cotiza ni de refilón: el desempate de turnos
         * decía "$200.000 si reservan solos", el cliente elegía esa y recibía
         * el sitio profesional a $180.000 (auditoría del 2-sep). Sin los dos
         * precios vigentes no se dice ninguno. */
        if (!wabot_tipo_ofrecible($tipo, $cfg)) return null;
        $frase = wabot_precio_frase(wabot_precio_vigente(null, $cfg, $tipo));
        if ($frase === '') return null;   // sin los dos precios no se dice ninguno
        $lineas[] = ucfirst($condicion) . ', ' . $frase . '.';
    }
    return implode("\n", $lineas) . "\n\nCuál de las dos te sirve más?";
}

/**
 * ¿Pregunta si el precio cambia sin el carrito (ecommerce) o sin la reserva
 * automática (turnos)? Devuelve el tipo YA COTIZADO al que se refiere
 * ('ecommerce' | 'turnos'), o null. A propósito exige las dos partes —la
 * palabra del tipo Y una palabra de precio/comparación— para no confundirse
 * con un "tiene carrito?" suelto, que va por otro lado.
 */
function wabot_texto_pregunta_comparacion_tipo($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;
    $comparaPrecio = '/\b(lo mismo|igual|mismo precio|diferencia|mas barato|menos|sale|cuesta|vale|precio)\b/u';
    if (preg_match('/\bcarrito\b/u', $t) && preg_match($comparaPrecio, $t)) return 'ecommerce';
    if (preg_match('/\b(agend[oa]\w* yo|coordin[oa]\w* yo|lo hago yo|sin reserva|sin que reserven|sin agendar)\b/u', $t)
        && preg_match($comparaPrecio, $t)) return 'turnos';
    return null;
}

/**
 * No pregunta el precio de la otra modalidad: DICE que quiere la otra.
 *
 * "Che, pensándolo bien mejor sin carrito, que me escriban por WhatsApp" tras
 * cotizar ecommerce. El modelo le ofreció la demo sin recotizar, y al turno
 * siguiente ("cuánto queda entonces?") preguntó si era para el mismo proyecto
 * o para otra web: el cliente nunca recibió el precio nuevo (27-ago).
 *
 * Devuelve el tipo AL QUE HAY QUE PASAR, o null. Exige una marca de decisión
 * ("mejor", "prefiero", "pensándolo bien", "en realidad") además de la
 * negación: sin eso, "no entiendo lo del carrito" recotizaría solo.
 */
function wabot_texto_cambia_modalidad($texto, $tipoActual) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;
    if (strpos($t, '?') !== false) return null;   // una pregunta se contesta, no se recotiza
    $decide = '/\b(mejor|prefiero|preferiria|pensandolo bien|en realidad|finalmente|al final|mas que nada|me quedo con)\b/u';
    if (!preg_match($decide, $t)) return null;

    /* Los saltos que quedaban (ecommerce→catálogo, turnos→sitio profesional)
     * murieron con esos tipos el 2-sep: hoy "mejor sin carrito" no cambia
     * nada, sigue siendo el ecommerce que se le cotizó y el precio no se
     * toca. Solo sobrevive el salto HACIA un tipo vigente, para la charla
     * vieja que quedó cotizada en catálogo. */
    if ($tipoActual === 'catalogo'
        && preg_match('/\b(con carrito|cobro online|pagos online|vender online|que compren)\b/u', $t)) {
        return 'ecommerce';
    }
    return null;
}

/** El texto de la comparación real: la modalidad sin la función y la que ya tiene cotizada. */
function wabot_comparacion_tipo_texto($alterno, $conv, $cfg) {
    /* "Sale lo mismo sin carrito?" ya NO abre la modalidad catálogo: se retiró
     * el 2-sep y el bot le seguía cotizando a un cliente nuevo un producto que
     * no se vende ($180.000 + $500 por producto). Lo que pregunta se contesta
     * mejor con la verdad: la tienda ya trae las dos formas. */
    if ($alterno === 'ecommerce' && !wabot_tipo_ofrecible('catalogo', $cfg)) {
        $dosFormas = trim((string)($cfg['info']['las_dos_formas'] ?? ''));
        return $dosFormas !== '' ? $dosFormas : null;
    }
    if ($alterno === 'ecommerce' && isset($cfg['tipos']['catalogo']) && isset($cfg['tipos']['ecommerce'])) {
        $c = wabot_catalogo_config($cfg);
        return 'Sin carrito sería la modalidad catálogo: ' . wabot_moneda($c['base'])
            . ' de desarrollo más ' . wabot_moneda($c['por_producto'])
            . ' por cada producto que cargues, y el cliente cierra la compra por WhatsApp en vez de pagar en la web.'
            . "\n\nCon carrito y pagos online es lo que ya tenés cotizado: " . (string)($cfg['tipos']['ecommerce']['precio'] ?? '');
    }
    if ($alterno === 'turnos' && isset($cfg['tipos']['landing']) && isset($cfg['tipos']['turnos'])) {
        /* Solo llega acá una charla vieja cotizada en turnos (tipo retirado):
         * se compara con el precio de pago único que tenía la landing entonces,
         * no con el primer pago del modelo nuevo, que es otra cosa. */
        return 'Sin reserva automática sería una landing común, donde te escriben por WhatsApp y coordinás vos: '
            . wabot_precio_anterior_de('landing', $cfg)
            . '.' . "\n\nCon reserva automática es lo que ya tenés cotizado: " . wabot_precio_vigente($conv, $cfg)['precio'];
    }
    return null;
}

/**
 * "Y la página común qué precio tiene?" — el precio de OTRO tipo de web.
 *
 * El emprendimiento de comida vegana tenía cotizado el ecommerce en $290.000 y
 * preguntó esto textual. El bot le explicó QUÉ es una landing y no le dijo
 * cuánto sale, teniendo el número a mano: $160.000 (29-ago). Es la pregunta de
 * compra más directa que existe y se fue sin respuesta.
 *
 * wabot_texto_pregunta_comparacion_tipo() no lo cubría: esa mira dos pares
 * fijos (carrito sí/no, reserva sí/no) y acá el salto es ecommerce → landing.
 *
 * Devuelve la clave del tipo preguntado, o null. Exige las dos cosas —que
 * nombre el tipo y que pregunte el precio— para que "vendo ropa en una tienda"
 * no cotice nada solo.
 */
function wabot_texto_pregunta_precio_de_tipo($texto, $cfg, $tipoActual = null) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;

    $preguntaPrecio = '/\b(cuanto (sale|cuesta|esta|vale|saldria|seria|es)|que (precio|valor|costo)|precio tiene|valor tiene|costo tiene|sale la|sale el|cuesta la|cuesta el|(el|del) (precio|valor|costo) de)\b/u';
    /* "Y una que sea solo landing?" / "y la landing?" con el ecommerce ya
     * cotizado: pide el precio del otro tipo sin ningún verbo de precio. Nacho
     * lo preguntó tres veces (1-sep) y nunca recibió los $160.000 que están en
     * la config. Solo con un precio ya dado, para que "vendo ropa en una
     * tienda" no cotice nada por su cuenta. */
    $pideAlternativa = $tipoActual !== null
        && preg_match('/\b(que sea|solo|sola|solamente|nomas|nada mas|en vez de|en lugar de|y (una|la|el|uno))\b/u', $t);
    if (!preg_match($preguntaPrecio, $t) && !wabot_texto_pide_precio($t) && !$pideAlternativa) return null;

    // De más específico a más general: "tienda online" antes que "tienda", y
    // "plataforma de cursos" antes que "cursos".
    $sinonimos = [
        'elearning'     => '(plataforma de cursos|campus virtual|aula virtual|vender los cursos)',
        'inmobiliaria'  => '(inmobiliaria|web de propiedades)',
        'institucional' => '(institucional|web institucional)',
        'ecommerce'     => '(ecommerce|e commerce|tienda online|tienda virtual|con carrito|carrito y pagos|vender online)',
        'catalogo'      => '(catalogo|web con catalogo|sin carrito)',
        'turnos'        => '(con turnos|de turnos|reserva de turnos|con reservas|agenda online)',
        'landing'       => '(landing|pagina comun|web comun|pagina simple|web simple|pagina basica|web basica|pagina normal|web normal|la comun|la simple|la basica|la sencilla|pagina sola|solo la pagina)',
    ];
    foreach ($sinonimos as $tipo => $re) {
        if (!isset($cfg['tipos'][$tipo])) continue;
        /* Y no se cotiza lo que ya no se vende: "cuánto sale una web
         * institucional?" devolvía "$200.000" con descripción y todo. */
        if (!wabot_tipo_ofrecible($tipo, $cfg)) continue;
        if (!preg_match('/\b' . $re . '\b/u', $t)) continue;
        if ((string)$tipo === (string)$tipoActual) return null;   // pregunta por el que ya tiene
        return $tipo;
    }
    return null;
}

/** El precio de un tipo puntual, y qué es, sin tocar el tipo ya cotizado. */
function wabot_precio_de_tipo_texto($tipo, $conv, $cfg) {
    $d = $cfg['tipos'][$tipo] ?? null;
    if (!$d) return null;
    if (!wabot_tipo_ofrecible($tipo, $cfg)) return null;   // no se cotiza lo retirado
    $frase = wabot_precio_frase(wabot_precio_vigente(null, $cfg, $tipo));
    if ($frase === '') return null;

    $label = trim((string)($d['label'] ?? $tipo));
    $desc  = trim((string)($d['desc'] ?? ''));
    $txt = $label . ': ' . $frase . '.';
    if ($desc !== '') $txt .= ' Es ' . $desc . '.';

    // Y se recuerda lo ya cotizado, para que la comparación quede completa y
    // el cliente no tenga que revolver la charla para atrás. Con SU precio,
    // el congelado, aunque la lista haya cambiado.
    $actual = (string)($conv['tipo'] ?? '');
    if ($actual !== '' && $actual !== $tipo && !empty($conv['precio_dado'])) {
        $fraseActual = wabot_precio_frase(wabot_precio_vigente($conv, $cfg));
        $labelActual = trim((string)($cfg['tipos'][$actual]['label'] ?? $actual));
        if ($fraseActual !== '') {
            $txt .= "\n\nLo que te coticé antes, " . $labelActual . ', queda en ' . $fraseActual . '.';
        }
    }
    return $txt;
}

/**
 * "Cuánto cuesta agregarle venta y cobro online?"
 *
 * El caso Aberturas (27-ago): tenía una landing cotizada en $160.000, preguntó
 * el precio de sumar venta online, y el bot preguntó si era el mismo proyecto y
 * le volvió a cotizar la landing. Le contestó el producto anterior a una
 * consulta sobre otro.
 *
 * No lo cubría wabot_texto_cambia_modalidad() por dos motivos, los dos de
 * fondo: descarta las preguntas (ahí es una decisión, acá es una consulta de
 * precio) y no contemplaba el salto landing → ecommerce, solo los desempates
 * de a pares que ya existían.
 *
 * Devuelve el tipo destino, o null.
 */
function wabot_texto_pregunta_upgrade($texto, $tipoActual) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return null;

    // Solo tiene sentido desde un tipo que todavía NO cobra online.
    if (!in_array((string)$tipoActual, ['landing', 'turnos', 'institucional', 'inmobiliaria'], true)) return null;

    /* Hace falta el verbo de sumar algo: un "cuánto sale" pelado ya tiene su
     * propio camino y no puede terminar recotizando otro tipo por su cuenta.
     *
     * Las formas van escritas una por una en vez de con comodines: un `met\w+`
     * se comía "método de pago online" y convertía una pregunta sobre formas de
     * pago en una recotización. */
    $suma = '/\b(agregar|agregarle|agrego|agregas|agregamos|agregara|'
          . 'sumar|sumarle|sumo|sumas|sumamos|sumara|'
          . 'incluir|incluirle|incluyo|incluye|incluyendo|'
          . 'incorporar|incorporo|'
          . 'poner|ponerle|pongo|ponemos|'
          . 'anadir|anadirle|anado|'
          . 'habilitar|habilito|activar|activo|'
          . 'tener|tuviera|tuviese|llevar)\b/u';
    if (!preg_match($suma, $t)) return null;

    $vender = '/\b(venta|ventas|vender|carrito|cobro|cobrar|cobros|pago online|pagos online|pagar online|comprar online|tienda online|ecommerce|e commerce)\b/u';
    if (!preg_match($vender, $t)) return null;

    return 'ecommerce';
}

/**
 * La respuesta: el precio del tipo que SÍ vende online, dicho como lo que es
 * —la web completa— y no como un adicional sobre lo ya cotizado, que sería
 * inventar una condición comercial que no existe.
 */
function wabot_upgrade_texto($destino, $conv, $cfg) {
    $actual = (string)($conv['tipo'] ?? '');
    if ($actual === '' || !isset($cfg['tipos'][$destino]) || !isset($cfg['tipos'][$actual])) return null;

    $precioNuevo = wabot_precio_frase(wabot_precio_vigente(null, $cfg, $destino));
    $precioViejo = wabot_precio_frase(wabot_precio_vigente($conv, $cfg));
    if ($precioNuevo === '') return null;

    $texto = 'Con venta y cobro online ya sería una tienda online: ' . $precioNuevo . '.';
    if ($precioViejo !== '') {
        /* Sin nombrar el tipo viejo con artículo: "en vez de la sitio
         * profesional" salía así desde que landing pasó a llamarse sitio
         * profesional (10-sep). */
        $texto .= ' No es un adicional sobre lo que te coticé (' . $precioViejo . '): te queda la web completa,'
                . ' con el carrito y los pagos integrados.';
    }
    return $texto;
}

/**
 * "Me pueden hacer una página en Wix/Tiendanube/Shopify?" — el pedido de
 * ARMAR la web sobre otra plataforma, no de comparar precios con ella.
 *
 * Encontrado el 28-ago corriendo una batería de verificación en vivo, tres
 * repeticiones del mismo mensaje ("una página en Wix para mi negocio de
 * tortas"): 1 de 3 veces el agente saltó directo al pitch de ecommerce sin
 * mencionar Wix para nada — cuando el pedido de plataforma viene junto con
 * info del rubro en el mismo mensaje, el modelo prioriza el rubro y se olvida
 * de contestar la plataforma. La objeción de plataforma (wabot_objecion_texto
 * más abajo) ya tenía su texto migrado (ver Tiendanube, 27-ago) pero eso no
 * garantiza que se DISPARE — un guard sobre el TEXTO no sirve si el problema
 * es que la HERRAMIENTA no se llama. Mismo patrón que el resto de esta lista:
 * lo que tiene que estar garantizado no puede depender del modelo.
 *
 * Se excluye a propósito la plataforma que el cliente YA tiene ("tengo mi
 * tienda en Wix"): eso es ya_tiene_plataforma (se ofrece revisarla), un texto
 * distinto — acá es específicamente el pedido de que se la armemos ahí. Y se
 * excluye la negación ("no quiero nada con Tiendanube"): mandarle la objeción
 * a alguien que ya está de acuerdo suena a que el bot no lee.
 */
function wabot_texto_pide_armar_en_plataforma($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;

    if (preg_match('/\b(tengo|tenia|ya tengo|ya tenia)\b/u', $t)) return false;
    if (preg_match('/\bno\s+(quiero|necesito|busco)\b/u', $t)) return false;

    $plataforma = '(tiendanube|tienda nube|wix|shopify|jimdo|mercado shops|mercadoshops|weebly)';
    $verbo = '(arman|armar|arma|hacen|hacer|hace|crean|crear|crea|monten|montar|monta'
            . '|desarrollan|desarrollar|desarrolla|construyen|construir|construye'
            . '|quiero|necesito|busco|querria|podrian|pueden)';

    return (bool)preg_match(
        '/\b' . $verbo . '\b.{0,45}\b(en|con)\b\s*(la plataforma\s*)?' . $plataforma . '\b/u', $t);
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
 * completo. Si todavía no cotizamos nada, se dicen los dos —prometer $10.000
 * y cotizarle después una web que paga $15.000 es regalar un reclamo— pero
 * con un precio Y un link por plan: antes se armaba la frase metiendo los dos
 * precios adentro del texto de UN plan y siempre mandaba el link de 'otros',
 * así que a un cliente de landing (tipo aún sin cotizar) le llegaba el precio
 * de landing pero el link de la página de $15.000. 'mantenimiento_ambos' es
 * un texto propio con cuatro placeholders para eso, sale de mantenimiento_planes
 * igual que el otro: no hay dos fuentes, solo dos textos según se sepa el tipo.
 */
function wabot_texto_mantenimiento($conv, $cfg) {
    /* Desde el 10-sep el "mantenimiento" ES el plan mensual obligatorio del
     * modelo nuevo: su monto sale de tipos[].mensualidad (vía
     * wabot_precio_placeholders), no de mantenimiento_planes, que hoy solo
     * aporta el link de la landing de cada plan. */
    $planes = $cfg['mantenimiento_planes'] ?? [];
    $base   = (string)($cfg['info']['mantenimiento'] ?? '');
    $tipo   = (string)($conv['tipo'] ?? '');
    $v      = wabot_precio_vigente($conv, $cfg);

    /* La charla cotizada con el modelo viejo (pago único) tiene el
     * mantenimiento opcional que se le prometió, al precio de entonces. */
    if ($tipo !== '' && $v['modelo'] === 'unico') {
        $clave = $tipo === 'landing' ? 'landing' : 'otros';
        $plan  = $planes[$clave] ?? $planes['otros'] ?? [];
        $precioViejo = trim((string)($plan['precio_anterior'] ?? $plan['precio'] ?? ''));
        $texto = wabot_modelo_unico_textos()['mantenimiento'];
        return trim(str_replace(['{precio}', '{link}'], [$precioViejo, (string)($plan['link'] ?? '')], $texto));
    }

    if ($tipo === '' || $v['mensualidad'] === '') {
        $l = $planes['landing'] ?? null;
        $o = $planes['otros'] ?? null;
        $ambos = trim((string)($cfg['info']['mantenimiento_ambos'] ?? ''));
        if ($ambos !== '') {
            $ambos = str_replace(
                ['{precio_landing}', '{link_landing}', '{precio_otros}', '{link_otros}'],
                [(string)($l['precio'] ?? ''), (string)($l['link'] ?? ''), (string)($o['precio'] ?? ''), (string)($o['link'] ?? '')],
                $ambos
            );
            return wabot_precio_placeholders($ambos, $conv, $cfg);
        }
        return wabot_precio_placeholders(str_replace('{link}', '', $base), $conv, $cfg);
    }

    $clave = $tipo === 'landing' ? 'landing' : 'otros';
    $plan  = $planes[$clave] ?? $planes['otros'] ?? [];
    $texto = str_replace('{link}', (string)($plan['link'] ?? ''), $base);
    return trim(wabot_precio_placeholders($texto, $conv, $cfg));
}

/** Un texto de info con sus placeholders resueltos. */
function wabot_texto_info($clave, $cfg, $conv = null) {
    $texto = (string)($cfg['info'][$clave] ?? '');
    /* Con el tipo cotizado, la versión que le toca (11-sep): al sitio
     * profesional no le corresponde la carga de productos ni el panel de
     * estadísticas de la tienda. */
    $variante = is_array($conv) ? wabot_info_variante_por_tipo($clave, (string)($conv['tipo'] ?? '')) : null;
    if ($variante !== null && trim((string)($cfg['info'][$variante] ?? '')) !== '') $texto = (string)$cfg['info'][$variante];
    if ($clave === 'bilingue') {
        return str_replace('{precio}', (string)($cfg['adicional_bilingue'] ?? ''), $texto);
    }
    // {min}/{max}: el rango real de la lista de precios, puesto por el código.
    // "Depende del tipo de página" era la respuesta a "¿cuánto cuesta?" del
    // anuncio y 3 de 10 no volvieron a escribir (1-sep).
    if (strpos($texto, '{min}') !== false || strpos($texto, '{max}') !== false) {
        /* Los rangos de pago único murieron el 10-sep: un texto que todavía
         * los pida recibe la tabla del modelo nuevo entera. */
        $texto = wabot_tabla_precios_texto($cfg) !== ''
            ? wabot_texto_rangos($cfg)
            : 'Contame qué vendés o qué servicio das y te paso el valor exacto.';
    }
    // {tabla_precios} y {mensualidades} los arma el código desde la lista de
    // tipos, así el texto del panel nunca queda con montos viejos adentro.
    if (strpos($texto, '{tabla_precios}') !== false || strpos($texto, '{mensualidades}') !== false) {
        $texto = str_replace(['{tabla_precios}', '{mensualidades}'],
            [wabot_tabla_precios_texto($cfg), wabot_mensualidades_texto($cfg)], $texto);
    }
    /* Último de la cadena: ningún texto de info habla del modelo viejo (seña,
     * saldo, pago único). Va acá porque es el embudo único de todo lo que sale
     * de `info.*`, que es justo lo que Pablo edita desde el panel: así también
     * queda cubierta la redacción que escriba mañana. */
    return wabot_texto_sin_modelo_viejo($texto);
}

/** El precio más bajo y el más alto de la lista de tipos, como "$160.000". */
function wabot_rangos_min_max($cfg) {
    $montos = [];
    foreach ((array)($cfg['tipos'] ?? []) as $d) {
        if (!empty($d['retirado'])) continue;
        if (!preg_match('/\$[\d.]+/u', (string)($d['precio'] ?? ''), $m)) continue;
        $n = wabot_monto_a_numero($m[0]);
        if ($n > 0) $montos[$n] = $m[0];
    }
    if (!$montos) return null;
    ksort($montos);
    return ['min' => reset($montos), 'max' => end($montos)];
}

/**
 * "Pasame los precios de todos los servicios" / "cuánto sale?" sin rubro.
 *
 * Desde el 10-sep no hay un rango de pago único: hay dos pares (primer pago +
 * plan mensual) según el tipo de web, y se dicen los dos completos. El texto
 * sale de info.rangos, que lleva {tabla_precios} para que los montos los ponga
 * el código desde la lista de tipos; si el panel lo dejó sin el marcador, sale
 * la redacción de respaldo, también armada desde la lista.
 */
function wabot_texto_rangos($cfg) {
    $tabla = wabot_tabla_precios_texto($cfg);
    if ($tabla === '') return trim((string)($cfg['info']['rangos'] ?? $cfg['info']['otra'] ?? ''));
    $texto = trim((string)($cfg['info']['rangos'] ?? ''));
    if ($texto !== '' && strpos($texto, '{tabla_precios}') !== false) {
        return wabot_texto_sin_modelo_viejo(str_replace(['{tabla_precios}', '{mensualidades}'],
            [$tabla, wabot_mensualidades_texto($cfg)], $texto));
    }
    // Sin "depende" adelante: era la respuesta que Pablo retiró el 1-sep.
    return $tabla
        . "\nEn todos los casos el plan mensual arranca a los 30 días del primer pago. Contame a qué te dedicás y te confirmo cuál sería el tuyo.";
}

/**
 * Cómo se paga, cuando todavía no hay tipo cotizado: los dos pares completos
 * y las dos formas de cobro. Antes del 10-sep escondía el anticipo hasta la
 * demo; con el modelo nuevo el primer pago es un número público y se dice.
 */
function wabot_texto_pago_generico($cfg) {
    $tabla = wabot_tabla_precios_texto($cfg);
    if ($tabla === '') return wabot_texto_sin_modelo_viejo(trim((string)($cfg['info']['pago_generico'] ?? '')));
    return $tabla
        . "\nEl primer pago se puede hacer por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés, y el plan mensual arranca a los 30 días por suscripción automática de Mercado Pago. Contame a qué te dedicás y te confirmo cuál sería el tuyo.";
}

/** Hosting y dominio van incluidos mientras dure el plan: no hay renovación aparte. */
function wabot_texto_hosting($conv, $cfg) {
    // La charla cotizada con el pago único conserva lo que se le prometió.
    if (!empty($conv['tipo']) && !empty($conv['precio_dado'])
        && wabot_precio_vigente($conv, $cfg)['modelo'] === 'unico') {
        return wabot_modelo_unico_textos()['hosting'];
    }
    $base = trim(wabot_texto_sin_modelo_viejo((string)($cfg['info']['hosting'] ?? '')));
    $renovacion = trim((string)($cfg['hosting_renovacion'] ?? ''));
    if ($renovacion === '') return $base;
    // Una renovación anual pagada por el cliente es del modelo viejo: no se pega.
    if (preg_match('/renuev|renovaci|\$\s?\d/iu', $renovacion)) return $base;
    if (mb_stripos($base, $renovacion) !== false) return $base;
    return trim($base . "\n" . $renovacion);
}

/**
 * Antes de la demo el bot NO nombra la seña. Ni la palabra, ni el monto.
 *
 * Pablo, 3-sep-2026, viendo lo que salía: "no, no tiene que mencionar la seña!".
 * La seña es del momento de cobrar —después de que vio la demo y quiere
 * avanzar— y ahí la piden `postdemo_transferencia` y `postdemo_tarjeta`, que no
 * pasan por acá. Antes de eso se dice lo mismo sin nombrarla: se abona una
 * parte para arrancar y el saldo al entregar la web.
 *
 * Acá vivía `wabot_pago_asegurar_sena()`, que hacía lo CONTRARIO: le pegaba el
 * monto a cualquier texto que no lo tuviera. Se escribió el 29-ago porque
 * `info.pago` había quedado sin ningún monto y el modelo lo completó inventando
 * "una seña del 50% y el 50% restante al terminar". Pero ese texto sin monto
 * era la edición deliberada de Pablo, y la función se la pisaba en cada
 * respuesta. Contra la invención sigue estando `wabot_texto_inventa_pago()`
 * (agente.php), que corta los porcentajes y las condiciones dichas de memoria
 * — que es el guard que de verdad corresponde a ese problema.
 *
 * Limpia por CONTENIDO y no por lista de textos viejos: `info.*` lo edita Pablo
 * desde el panel, así que producción siempre tiene una redacción que no está en
 * ninguna lista (misma razón que `wabot_frase_retirada()`). Y SUSTITUYE en vez
 * de borrar: la condición comercial —una parte al arrancar, el resto al
 * entregar— se sigue diciendo; lo que desaparece es la palabra y el número.
 */
function wabot_texto_sin_sena($texto) {
    $t = (string)$texto;
    if ($t === '' || !preg_match('/se[ñn]a|senia/iu', $t)) return $t;

    // "en unos 7 días desde la seña y la entrega del contenido" → "desde que arrancamos"
    $t = preg_replace('/\bdesde\s+(la|una)\s+se[ñn]a\b/iu', 'desde que arrancamos', $t);
    // "la seña es de $40.000" / "la seña de {sena}" (con monto, entre paréntesis o no)
    $t = preg_replace('/\b(una|la)\s+se[ñn]a\s+(es\s+)?de\s+(\{sena\}|\$\s?[\d.,]+)/iu', 'una parte', $t);
    $t = preg_replace('/\b(una|la)\s+se[ñn]a\s*\([^)]*\)/iu', 'una parte', $t);
    // Y la mención pelada, sin monto: "se abona una seña", "se deja la seña".
    $t = preg_replace('/\b(una|la)\s+se[ñn]a\b/iu', 'una parte', $t);
    $t = preg_replace('/\bse[ñn]a\b/iu', 'parte', $t);

    /* "se deja una parte de" queda colgando si el monto venía con otra forma
     * que las de arriba; y "una parte para arrancar y el saldo" es redundante
     * cuando la oración ya arranca con "Para arrancar". */
    $t = preg_replace('/\buna parte\s+de\s*(?=[.,;]|$)/iu', 'una parte', $t);
    $t = preg_replace('/\bPara arrancar\b(.{0,30}?)\buna parte para arrancar\b/iu', 'Para arrancar$1una parte', $t);
    return trim(preg_replace('/\s{2,}/u', ' ', $t));
}

/**
 * Ningún texto sale hablando del modelo viejo (10-sep-2026).
 *
 * Pablo cambió el modelo comercial: ya no hay pago único, ni seña, ni saldo al
 * entregar. Hay un primer pago y un plan mensual. Los textos de `info.*` los
 * edita él desde el panel, así que producción siempre tiene alguna redacción
 * que ninguna migración por texto exacto conoce: acá se corrige por CONTENIDO,
 * como wabot_frase_retirada(). Sustituye en vez de borrar —"se abona una seña"
 * pasa a "se abona el primer pago"— y tira las oraciones que hablan del saldo,
 * que no tienen reemplazo. Es la red final; la redacción buena la ponen las
 * migraciones de wabot_config_modelo_mensual().
 */
function wabot_texto_sin_modelo_viejo($texto) {
    $t = (string)$texto;
    if ($t === '') return $t;
    // "mantenimiento es opcional" y no "es opcional" suelto: el texto nuevo
    // dice "no es opcional", y eso no se toca.
    if (!preg_match('/se[ñn]a|senia|\bsaldo\b|pago [úu]nico|[úu]nico pago|abono mensual|costos? mensual|queda a tu nombre|mantenimiento es opcional/iu', $t)) return $t;

    /* Las oraciones del saldo se van enteras: no hay saldo en el modelo nuevo.
     * Renglón por renglón, para no juntar en uno los párrafos del texto. */
    $saldo = '/\bsaldo\b|\bel resto (lo|se) (pag|abon)/iu';
    if (preg_match($saldo, $t)) {
        $renglones = [];
        foreach (preg_split('/\R/u', $t) as $renglon) {
            $oraciones = array_filter(preg_split('/(?<=[.!?])\s+/u', $renglon), function ($o) use ($saldo) {
                return !preg_match($saldo, $o);
            });
            $renglon = trim(implode(' ', $oraciones));
            if ($renglon !== '') $renglones[] = $renglon;
        }
        $t = implode("\n", $renglones);
    }

    $t = preg_replace('/\bdesde\s+(la|una)\s+se[ñn]a\b/iu', 'desde el primer pago', $t);
    $t = preg_replace('/\b(una|la)\s+se[ñn]a\s+(es\s+)?de\s+/iu', 'el primer pago de ', $t);
    $t = preg_replace('/\b(una|la)\s+se[ñn]a\b/iu', 'el primer pago', $t);
    $t = preg_replace('/\bse[ñn]a\b|\bsenia\b/iu', 'primer pago', $t);
    $t = preg_replace('/\bEs pago [úu]nico\b/u', 'Es un primer pago', $t);
    $t = preg_replace('/,?\s*(pago [úu]nico|en un [úu]nico pago)\b/iu', '', $t);
    $t = preg_replace('/,?\s*sin (abono|costos?|cuotas?) mensual(es)?( de plataforma)?/iu', '', $t);
    $t = preg_replace('/\bla web queda a tu nombre y es a medida\b/iu', 'la web es a medida', $t);
    $t = preg_replace('/\bEl mantenimiento es opcional\b/u', 'El plan mensual es parte del servicio', $t);
    $t = preg_replace('/\s*:\s*\./u', '.', $t);
    return trim(preg_replace('/[ \t]{2,}/u', ' ', $t));
}

/**
 * Cómo se paga lo cotizado (10-sep): el primer pago del tipo y su plan mensual,
 * los dos con el monto que se le dijo a ESTE cliente (wabot_precio_vigente).
 * Sin tipo cotizado, la tabla completa. Una charla cotizada antes del 10-sep
 * conserva las condiciones del pago único que se le prometieron.
 */
function wabot_texto_pago($conv, $cfg) {
    $tipo = (string)($conv['tipo'] ?? '');
    if ($tipo === '' || !isset($cfg['tipos'][$tipo]) || empty($conv['precio_dado'])) {
        $generico = wabot_texto_pago_generico($cfg);
        if ($generico !== '') return $generico;
        return 'El primer pago se puede hacer por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés, y el plan mensual arranca a los 30 días por suscripción automática de Mercado Pago.';
    }
    $v = wabot_precio_vigente($conv, $cfg);
    if ($v['modelo'] === 'unico') {
        $legacy = wabot_modelo_unico_textos();
        if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) > 0) {
            $d = wabot_catalogo_total((int)$conv['productos_cantidad'], $cfg);
            return str_replace('{precio}', wabot_moneda($d['total']), $legacy['pago_catalogo']);
        }
        return str_replace('{precio}', $v['precio'], $legacy['pago']);
    }
    /* Los marcadores de cuota se resuelven vacíos: el bot no dice montos de
     * cuota (Pablo, 2-sep). Si quedó alguno en un texto editado a mano, sale
     * la frase sin el número en vez de un {cuotas_12} crudo. */
    $texto = str_replace(['{sena}', '{cuotas_12}', '{cuotas_6}', '{cuotas_3}'], '', (string)($cfg['info']['pago'] ?? ''));
    $texto = preg_replace('/:?\s*12 cuotas de\s*,?\s*6 de\s*,?\s*(o\s*)?3 de\s*/u', '', $texto);
    $texto = wabot_precio_placeholders($texto, $conv, $cfg);
    $texto = trim(preg_replace('/[ \t]{2,}/u', ' ', $texto));
    return wabot_texto_sin_modelo_viejo($texto);
}

/** Elige una variante estable por conversación; precios y links siguen exactos. */
function wabot_plantilla_variante($clave, $claveVariantes, $conv, $cfg) {
    $base = (string)($cfg[$clave] ?? '');
    $variantes = array_values(array_filter((array)($cfg[$claveVariantes] ?? []), function ($v) {
        return is_string($v) && trim($v) !== '';
    }));
    if (!$variantes) return $base;
    $semilla = wabot_conversation_key($conv) . '|' . (string)($conv['session_id'] ?? '') . '|' . $clave;
    $indice = hexdec(substr(hash('sha256', $semilla), 0, 8)) % count($variantes);
    return $variantes[$indice];
}

/**
 * Arma el mensaje de precio del tipo y fija la fase. Según en qué punto de la
 * charla esté, devuelve UN mensaje (el precio+pregunta del pitch, o solo la
 * oferta de la demo si el precio ya salió antes) o DOS —precio y demo
 * juntos— cuando el pitch nunca corrió para este tipo. Ver wabot_pitch() para
 * el detalle de cada camino.
 */
/* ───────────────────── Parte 2: después de la demo ─────────────────────
 *
 * Presentada la demo, el bot deja de "estar cerrado" y pasa a cerrar la venta:
 * aclara dudas, pasa la seña y los datos de transferencia, arma el link de
 * tarjeta y —si el cliente duda— ofrece la videollamada con Pablo. Todo esto
 * NO existe antes de la demo: es lo que separa la parte 1 de la parte 2.
 */

/** El primer pago que corresponde a lo cotizado, ya formateado (antes: la seña). */
function wabot_sena_de($conv, $cfg) {
    return wabot_precio_vigente($conv, $cfg)['precio'];
}

/* ───────── El precio de ESTA charla: primer pago + plan mensual (10-sep-2026) ─────────
 *
 * Pablo cambió el modelo comercial el 10-sep: se terminó el pago único. Ahora
 * cada tipo tiene un PRIMER PAGO (tipos[].precio) y un PLAN MENSUAL obligatorio
 * (tipos[].mensualidad) que arranca a los 30 días. Dos cosas que el código
 * tiene que garantizar:
 *
 *  1) Un cliente ya cotizado sigue viendo SU precio aunque la lista cambie.
 *     Por eso el precio se CONGELA en la conversación al cotizar
 *     (wabot_precio_congelar) y todo lo que repite un monto lo lee de ahí
 *     (wabot_precio_vigente). Las charlas cotizadas antes del cambio no tienen
 *     el snapshot: se les siembra desde el transcript, con el modelo viejo
 *     (wabot_precio_sembrar), y conservan las condiciones del pago único.
 *  2) Los montos nunca se escriben a mano en un texto: {precio} y
 *     {mensualidad} los resuelve wabot_precio_placeholders() para el tipo de la
 *     charla, y {tabla_precios} / {mensualidades} arman la lista completa
 *     desde los tipos ofrecibles.
 */

/** Los textos del modelo viejo, para las charlas cotizadas antes del 10-sep. */
function wabot_modelo_unico_textos() {
    return [
        'msg_precio'     => "Perfecto, para lo tuyo va {desc}. Todo el desarrollo tendría un valor de {precio}. Se puede abonar por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés.\nEn este enlace podés verlo bien detallado: {link}",
        'msg_precio_tras_pitch' => "El desarrollo completo tiene un valor de {precio}.\nEn este enlace podés verlo bien detallado: {link}",
        'precio_resumen' => "El total es {precio} por todo el desarrollo, y el detalle completo está acá: {link}\nY acá podés ver {portfolio_texto}: {portfolio}",
        'pago'           => 'El desarrollo completo es {precio}. Se puede abonar por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés: el valor de cada cuota lo calcula la tarjeta sobre el total. Para arrancar se deja una parte y el saldo al entregar la web.',
        'pago_catalogo'  => 'El total cotizado es {precio}. Se abona por transferencia, con una parte para arrancar y el saldo al entregar la web, o con tarjeta hasta en 12 cuotas con interés: el valor de cada cuota lo calcula la tarjeta sobre el total.',
        'caro'           => 'Es pago único, sin costos mensuales de plataforma: la web queda a tu nombre y es a medida. Se puede abonar por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés. En el link del presupuesto tenés el detalle de todo lo que incluye.',
        'mantenimiento'  => 'El mantenimiento es opcional e incluye un cambio por mes —puede ser un cambio grande, no solo un retoque—, además del soporte, y el hosting y el dominio mientras esté activo. Hay planes más completos con más cambios por mes si los llegás a necesitar. Sale {precio} por mes y acá lo podés ver en detalle: {link}',
        'hosting'        => 'Hosting y dominio están incluidos en el precio, con el primer año cubierto. Después se renuevan una vez al año, y antes del vencimiento te confirmamos el importe actualizado. Si tenés el plan de mantenimiento activo, no la pagás: el hosting y el dominio ya están incluidos.',
        'obligatorio'    => 'Es opcional. La web es tuya igual: lo contratás solo si lo querés, y lo podés dar de baja cuando quieras.',
    ];
}

/**
 * La respuesta a "es caro", con el precio de ESTA charla resuelto (10-sep).
 * Es el mismo armado que hace wabot_objecion_texto(), para los caminos que no
 * pasan por ahí (el derivado y el limpiador de objeciones).
 */
function wabot_texto_caro($conv, $cfg) {
    $t = (string)($cfg['caro'] ?? '');
    if (!empty($conv['tipo']) && !empty($conv['precio_dado'])
        && wabot_precio_vigente($conv, $cfg)['modelo'] === 'unico') {
        $t = wabot_modelo_unico_textos()['caro'];
    }
    return wabot_link_presupuesto_completar(wabot_precio_placeholders($t, $conv, $cfg), $conv, $cfg);
}

/** Congela en la charla el precio con el que se está cotizando este tipo. */
function wabot_precio_congelar(&$conv, $tipo, $cfg) {
    $t = $cfg['tipos'][$tipo] ?? [];
    $conv['precio_cotizado']      = trim((string)($t['precio'] ?? ''));
    $conv['mensualidad_cotizada'] = trim((string)($t['mensualidad'] ?? ''));
    $conv['precio_modelo']        = $conv['mensualidad_cotizada'] !== '' ? 'mensual' : 'unico';
    $conv['precio_cotizado_ts']   = time();
}

/**
 * La charla cotizada ANTES del snapshot (o sea, con el modelo viejo): se le
 * siembra el precio que el bot le dijo, leído del transcript. Solo si hay un
 * monto de desarrollo dicho por el bot; si no, no se inventa nada y el precio
 * sale de la lista vigente.
 */
function wabot_precio_sembrar(&$conv, $cfg) {
    if (empty($conv['precio_dado']) || !empty($conv['precio_cotizado'])) return;
    $tipo = (string)($conv['tipo'] ?? '');
    if ($tipo === '') return;
    $dicho = '';
    foreach ((array)($conv['transcript'] ?? []) as $l) {
        if (($l['q'] ?? '') !== 'bot') continue;
        if (!preg_match_all('/\$\d{1,3}(?:\.\d{3})+/u', (string)($l['t'] ?? ''), $m)) continue;
        foreach ($m[0] as $monto) {
            if (wabot_monto_a_numero($monto) >= 100000) $dicho = $monto;
        }
    }
    if ($dicho === '') return;
    $conv['precio_cotizado']      = $dicho;
    $conv['mensualidad_cotizada'] = '';
    $conv['precio_modelo']        = 'unico';
    $conv['precio_cotizado_ts']   = (int)($conv['ultimo_ts'] ?? 0) ?: time();
    wabot_evento_sesion($conv, 'precio_congelado_modelo_unico', ['precio' => $dicho]);
}

/**
 * El precio que vale para esta charla y este tipo: el congelado si lo hay, la
 * lista si no. Devuelve precio (primer pago), mensualidad y modelo
 * ('mensual' | 'unico').
 */
function wabot_precio_vigente($conv, $cfg, $tipo = null) {
    $tipo = (string)($tipo ?? (is_array($conv) ? ($conv['tipo'] ?? '') : ''));
    $t = $cfg['tipos'][$tipo] ?? [];
    $v = [
        'tipo'        => $tipo,
        'precio'      => trim((string)($t['precio'] ?? '')),
        'mensualidad' => trim((string)($t['mensualidad'] ?? '')),
        'modelo'      => 'mensual',
    ];
    if (is_array($conv) && (string)($conv['tipo'] ?? '') === $tipo && $tipo !== '') {
        if (!empty($conv['precio_cotizado'])) {
            $v['precio']      = trim((string)$conv['precio_cotizado']);
            $v['mensualidad'] = trim((string)($conv['mensualidad_cotizada'] ?? ''));
            $v['modelo']      = (string)($conv['precio_modelo'] ?? '');
        } elseif (!empty($conv['precio_dado'])) {
            /* Cotizada y SIN precio congelado: eso solo pasa con las charlas
             * cotizadas antes del 10-sep, porque desde ese día toda
             * cotización congela el suyo (wabot_precio_congelar). Se le
             * respeta el pago único de entonces. wabot_precio_sembrar() lo
             * afina con el monto exacto del transcript cuando lo encuentra. */
            $v['precio']      = wabot_precio_anterior_de($tipo, $cfg);
            $v['mensualidad'] = '';
            $v['modelo']      = 'unico';
        }
    }
    if ($v['modelo'] !== 'unico' && $v['mensualidad'] === '') $v['modelo'] = 'unico';
    if ($v['modelo'] !== 'unico') $v['modelo'] = 'mensual';
    return $v;
}

/** "$90.000 de primer pago y $30.000 por mes", o el pago único si es una charla vieja. */
function wabot_precio_frase($v) {
    if ($v['precio'] === '') return '';
    if (($v['modelo'] ?? '') === 'unico' || $v['mensualidad'] === '') return $v['precio'];
    return $v['precio'] . ' de primer pago y ' . $v['mensualidad'] . ' por mes';
}

/** El nombre de cada tipo como se dice en la tabla de precios. */
function wabot_tipo_nombre_precio($tipo, $d) {
    $mapa = ['landing' => 'sitio profesional', 'ecommerce' => 'tienda online',
             'elearning' => 'plataforma de cursos', 'inmobiliaria' => 'inmobiliaria'];
    return $mapa[$tipo] ?? mb_strtolower(trim((string)($d['label'] ?? $tipo)), 'UTF-8');
}

/** Los tipos ofrecibles agrupados por par (primer pago, mensualidad), de menor a mayor. */
function wabot_precio_grupos($cfg) {
    $grupos = [];
    foreach ((array)($cfg['tipos'] ?? []) as $tipo => $d) {
        if (!empty($d['retirado'])) continue;
        $p = trim((string)($d['precio'] ?? ''));
        $m = trim((string)($d['mensualidad'] ?? ''));
        if ($p === '' || wabot_monto_a_numero($p) <= 0) continue;
        $k = $p . '|' . $m;
        if (!isset($grupos[$k])) {
            $grupos[$k] = ['precio' => $p, 'mensualidad' => $m, 'monto' => wabot_monto_a_numero($p), 'nombres' => []];
        }
        $grupos[$k]['nombres'][] = wabot_tipo_nombre_precio((string)$tipo, $d);
    }
    usort($grupos, function ($a, $b) { return $a['monto'] <=> $b['monto']; });
    // Dentro de cada grupo, siempre en el mismo orden (el de la config es
    // arbitrario y salía "inmobiliaria, tienda online o plataforma de cursos").
    $orden = ['sitio profesional', 'tienda online', 'plataforma de cursos', 'inmobiliaria'];
    foreach ($grupos as &$g) {
        usort($g['nombres'], function ($a, $b) use ($orden) {
            $ia = array_search($a, $orden, true); $ib = array_search($b, $orden, true);
            return ($ia === false ? 99 : $ia) <=> ($ib === false ? 99 : $ib);
        });
    }
    unset($g);
    return array_values($grupos);
}

function wabot_lista_o($nombres) {
    $nombres = array_values(array_unique(array_filter(array_map('trim', (array)$nombres))));
    if (!$nombres) return '';
    if (count($nombres) === 1) return $nombres[0];
    $ultimo = array_pop($nombres);
    return implode(', ', $nombres) . ' o ' . $ultimo;
}

/**
 * "Sitio profesional: primer pago de $60.000 y después $20.000 por mes.
 *  Tienda online, plataforma de cursos o inmobiliaria: primer pago de $90.000
 *  y después $30.000 por mes."
 */
function wabot_tabla_precios_texto($cfg) {
    $lineas = [];
    foreach (wabot_precio_grupos($cfg) as $g) {
        $nombres = wabot_lista_o($g['nombres']);
        $linea = mb_strtoupper(mb_substr($nombres, 0, 1, 'UTF-8'), 'UTF-8') . mb_substr($nombres, 1, null, 'UTF-8')
               . ': primer pago de ' . $g['precio'];
        if ($g['mensualidad'] !== '') $linea .= ' y después ' . $g['mensualidad'] . ' por mes';
        $lineas[] = $linea . '.';
    }
    return implode(' ', $lineas);
}

/** "$20.000 por mes en sitio profesional y $30.000 en tienda online, plataforma de cursos o inmobiliaria". */
function wabot_mensualidades_texto($cfg) {
    $partes = [];
    foreach (wabot_precio_grupos($cfg) as $i => $g) {
        if ($g['mensualidad'] === '') continue;
        $partes[] = $g['mensualidad'] . ($i === 0 ? ' por mes' : '') . ' en ' . wabot_lista_o($g['nombres']);
    }
    if (!$partes) return '';
    if (count($partes) === 1) return $partes[0];
    $ultimo = array_pop($partes);
    return implode(', ', $partes) . ' y ' . $ultimo;
}

/**
 * Resuelve los marcadores de precio de un texto para ESTA charla: {precio},
 * {mensualidad}, {link}, {portfolio}, {portfolio_texto}, {tabla_precios} y
 * {mensualidades}. Sin tipo, {precio} y {mensualidad} se dicen en general.
 */
function wabot_precio_placeholders($texto, $conv, $cfg, $tipo = null) {
    $t = (string)$texto;
    if ($t === '' || strpos($t, '{') === false) return $t;
    $v = wabot_precio_vigente($conv, $cfg, $tipo);
    $d = $cfg['tipos'][$v['tipo']] ?? [];
    $mensualidades = wabot_mensualidades_texto($cfg);
    return str_replace(
        ['{precio}', '{mensualidad}', '{link}', '{portfolio}', '{portfolio_texto}', '{tabla_precios}', '{mensualidades}'],
        [$v['precio'] !== '' ? $v['precio'] : 'el primer pago',
         $v['mensualidad'] !== '' ? $v['mensualidad'] : ($mensualidades !== '' ? $mensualidades : 'la mensualidad'),
         (string)($d['link'] ?? ''), (string)($d['portfolio'] ?? ''), (string)($d['portfolio_texto'] ?? ''),
         wabot_tabla_precios_texto($cfg), $mensualidades],
        $t
    );
}

/**
 * El segundo mensaje del turno del precio: los tres pasos (Pablo, 10-sep) y,
 * desde el 11-sep, la pregunta de si quiere la demo. Terminaban en "comienza el
 * plan mensual", que informa pero no dice qué contestar, y el "Vestidos y
 * conjuntos" que venía después se tomaba como un sí. Con la pregunta, el sí
 * siguiente significa una sola cosa. Sin la pregunta cuando el formulario sale
 * en el mismo turno (el que pidió la demo al entrar): preguntarle si la quiere y
 * mandarle el link en el globo de al lado se contradice.
 */
function wabot_tres_pasos_texto($conv, $cfg, $conPregunta = true) {
    $t = trim((string)($cfg['msg_tres_pasos'] ?? ''));
    if ($t === '' && function_exists('wabot_tres_pasos_default')) $t = wabot_tres_pasos_default();
    if ($conPregunta && $t !== '') $t .= "\n" . wabot_tres_pasos_pregunta();
    return $t;
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
    if (preg_match('/\bno\b.{0,12}\b(me gusto|me gusta|me encanto|me convence|me convencio|termina de cerrar)\b/u', $t)) return false;
    if (wabot_es_afirmativa($texto)) return true;
    return (bool)(
        preg_match('/\bcomo\b.{0,12}\b(sigo|seguimos|sigue|hago|hacemos|arranco|arrancamos|procedo|avanzo|avanzamos|continuo)\b/u', $t)
        || preg_match('/\b(que|cual)\b.{0,15}\b(paso|pasos|siguiente|sigue ahora)\b/u', $t)
        || preg_match('/\b(quiero|queremos|vamos a|listo para)\b.{0,20}\b(avanzar|arrancar|empezar|contratar|seguir|hacerla|comprarla)\b/u', $t)
        || preg_match('/\b(me gusto|me encanto|me gusta|quedo (muy )?(bien|linda|buena|barbara)|esta (muy )?(buena|linda|barbara)|buenisima|espectacular|hermosa)\b/u', $t)
        || preg_match('/\b(dale|listo)\b.{0,20}\b(avanzamos|arrancamos|seguimos|vamos)\b/u', $t)
        || (wabot_texto_es_elogio($texto) && !wabot_postdemo_la_va_a_mirar($texto))
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
        preg_match('/\b(es caro|esta caro|muy caro|carisimo|medio caro|un poco caro|me parece caro|es mucha plata|es mucho|se me va de presupuesto|no me da el presupuesto)\b/u', $t)
        || preg_match('/\b(no tengo|no cuento con)\b.{0,20}\b(plata|dinero|presupuesto|fondos)\b/u', $t)
        || preg_match('/\bno puedo\b.{0,20}\b(pagar|afrontar|de una)\b/u', $t)
        || preg_match('/\b(junto|reuno|consigo)\b.{0,15}\b(la plata|el dinero)\b/u', $t)
    );
}

/** Celebra la demo: "me encanta", "quedó bárbara". Es la señal de interés. */
function wabot_postdemo_elogio($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    // "no me gusta" tiene las mismas palabras que "me gusta": el no manda.
    if (preg_match('/\bno\b.{0,15}\b(me gusta|me gusto|me convence|me convencio|me cierra)\b/u', $t)) return false;
    return (bool)(
        preg_match('/\b(me encanta|me encanto|me gusta|me gusto|me fascina|me copa|me re gusta)\b/u', $t)
        || preg_match('/\b(quedo|quedaron|esta|estan|es)\b.{0,18}\b(genial|barbara|barbaro|hermosa|hermoso|divina|divino|espectacular|increible|impecable|buenisima|buenisimo|excelente|perfecta|perfecto|preciosa|lindisima|zarpada)\b/u', $t)
        || preg_match('/\b(muy linda|muy lindo|re linda|re lindo|muy buena|muy bueno|quedo muy bien|quedo re bien|quedo joya)\b/u', $t)
        || preg_match('/^(genial|excelente|hermosa|hermoso|barbaro|barbara|increible|wow|guau|joya|tremenda)\b/u', $t)
    );
}

/** Pide tocar algo concreto de la demo: un color, una foto, un texto. */
function wabot_postdemo_pide_cambios($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    // "Puedo cambiar los precios yo?" pregunta por el panel (info.carga), no pide un cambio.
    if (preg_match('/\b(yo|nosotros|nosotras|yo mismo|yo misma|solo|sola|desde el panel)\b/u', $t)
        && preg_match('/\b(puedo|podemos|podre|se puede|voy a poder)\b/u', $t)) return false;
    return (bool)(
        preg_match('/\b(cambiar|cambiarle|cambiaria|cambiarias|modificar|modificarle|ajustar|corregir|sacarle|agregarle|sumarle|reemplazar)\b/u', $t)
        /* "Puedo agregar más fotos a la demo?" es un pedido de cambio; se
         * llevaba el texto de quién carga los productos (auditoría 9-sep). */
        || preg_match('/\b(puedo|podria|podriamos|quiero|quisiera|me gustaria|necesito|hay que|habria que)\s+(agregar|agregarle|sumar|sumarle|poner|ponerle|sacar|sacarle|quitar|cambiar|cambiarle|modificar|mover|reemplazar|corregir)\b/u', $t)
        || preg_match('/\b(se puede|se podria|podrias|podrian|habria forma de|hay forma de)\b.{0,30}\b(cambiar|poner|sacar|agregar|modificar|mover)\b/u', $t)
        || preg_match('/\b(me gustaria que|preferiria que|estaria bueno que|faltaria|le falta|le faltaria)\b/u', $t)
    );
}

/** No le gustó y no dice qué: hay que preguntarle qué falló, no insistir. */
function wabot_postdemo_no_gusto($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\bno\b.{0,15}\b(me gusta|me gusto|me convence|me convencio|me cierra|me cerro|me representa)\b/u', $t)
        || preg_match('/\bno\b.{0,25}\b(es lo que|era lo que|esperaba|imaginaba|tenia en mente)\b/u', $t)
        || preg_match('/\b(no tiene nada que ver|esta feo|esta fea|quedo feo|quedo fea)\b/u', $t)
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
        return wabot_texto_rangos($cfg);
    }
    $t = $cfg['tipos'][$tipo];
    $v = wabot_precio_vigente($conv, $cfg);
    $precio = $v['precio'];
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) > 0) {
        $d = wabot_catalogo_total((int)$conv['productos_cantidad'], $cfg);
        $precio = wabot_moneda($d['total']);
    }
    // La charla cotizada con el modelo viejo repite SU precio y SUS condiciones.
    if ($v['modelo'] === 'unico') {
        return str_replace(['{precio}', '{sena}', '{link}', '{portfolio}', '{portfolio_texto}'],
            [$precio, '', (string)($t['link'] ?? ''), (string)($t['portfolio'] ?? ''), (string)($t['portfolio_texto'] ?? '')],
            wabot_modelo_unico_textos()['precio_resumen']);
    }
    $plantilla = trim((string)($cfg['precio_resumen'] ?? ''));
    if ($plantilla === '' || strpos($plantilla, '{mensualidad}') === false) {
        $plantilla = "El primer pago es de {precio} y el plan mensual, que arranca a los 30 días, es de {mensualidad}.\nEl detalle completo está acá: {link}\nY acá podés ver {portfolio_texto}: {portfolio}";
    }
    return wabot_precio_placeholders(str_replace(['{sena}', '{precio}'], ['', $precio], $plantilla), $conv, $cfg);
}

function wabot_aporta_descripcion($texto) {
    $t = trim((string)$texto);
    if (mb_strlen($t) < 12) return false;
    if (wabot_es_acuse($t) || wabot_es_negativa($t)) return false;
    if (wabot_texto_no_es_descripcion($t)) return false;
    return preg_match_all('/\p{L}/u', $t) >= 8;
}

/**
 * Lo que NUNCA es la descripción del negocio, por más largo que sea: un
 * acuse, una afirmativa ("dale, hagamos la demo" quedó guardado como
 * descripción y el bot contestó "anoté la descripción, me faltan los
 * colores", 9-sep) o una frase corta que habla de la demo, el formulario o
 * el precio en vez del negocio.
 */
function wabot_texto_no_es_descripcion($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return true;
    if (wabot_es_acuse($texto) || wabot_es_afirmativa($texto) || wabot_es_negativa($texto)) return true;
    if (preg_match('/^(dale|ok|oka|okey|si|sii|listo|bueno|perfecto|genial|joya|barbaro|buenisimo|gracias|de una)\b/u', $t)) return true;
    if (count(explode(' ', $t)) <= 8
        && preg_match('/\b(demo|muestra|predise\w*|formulario|link|precio|presupuesto|cuanto|costo|cotizacion|seguimos|arrancamos|avancemos|avanzamos|hagamos|armala|armalo|armamos|preparala)\b/u', $t)) return true;
    return false;
}

function wabot_frase_tiene_contenido_especifico($texto) {
    $relleno = ['tengo', 'tenemos', 'es', 'soy', 'somos', 'un', 'una', 'unos', 'unas',
        'mi', 'mis', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'de', 'del', 'la', 'el', 'lo',
        'negocio', 'negocios', 'empresa', 'empresas', 'emprendimiento', 'emprendimientos',
        'local', 'locales', 'marca', 'marcas', 'servicio', 'servicios', 'producto', 'productos',
        'comercio', 'comercios', 'cosa', 'cosas', 'algo', 'actividad', 'rubro', 'tipo', 'familiar',
        'vendo', 'vendemos', 'venden', 'ofrezco', 'ofrecemos', 'ofrecen', 'hago', 'hacemos', 'hacen',
        'dedico', 'dedicamos', 'trabajo', 'trabajamos', 'vender', 'ofrecer', 'hacer', 'por', 'cuenta', 'propia'];
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    $palabras = array_filter(explode(' ', $t), function ($p) use ($relleno) {
        return mb_strlen($p) >= 3 && !in_array($p, $relleno, true);
    });
    return count($palabras) > 0;
}

/** Solo la pregunta diferenciadora del pitch (variante según contexto/tipo). */
/**
 * El rubro con las palabras del cliente, para que el precio arranque
 * nombrándolo ("Para las gorras, lo ideal sería un ecommerce…"). Lo escribe
 * el modelo como argumento de dar_precio; acá se valida contra lo que el
 * cliente escribió de verdad: 1 a 6 palabras, sin números ni "$", y al menos
 * una palabra de cuatro letras o más que aparezca en sus mensajes. Si no pasa,
 * devuelve '' y el texto sale como hasta ahora, sin la cláusula. Los 10
 * pitches del 1-sep fueron idénticos, sin una palabra del negocio: ese es el
 * momento exacto en que se nota el bot.
 */
function wabot_rubro_valido($rubro, $conv) {
    // El modelo a veces manda "las_gorras" (guiones bajos por espacios), y eso
    // sale crudo al cliente. Visto en la batería del 2-sep.
    $r = str_replace(['_', '-'], ' ', (string)$rubro);
    $r = trim(preg_replace('/\s+/u', ' ', $r));
    $r = trim($r, " \t\n\r.,;:!?\"'«»()");
    if ($r === '' || mb_strlen($r) > 60) return '';
    if (preg_match('/[\d$%{}]|https?:|www\.|\.com\b/iu', $r)) return '';
    $norm = wabot_normalizar_frase($r);
    $palabras = array_values(array_filter(explode(' ', $norm)));
    // Siete y no seis desde el 11-sep: el "tu" o "tus" de adelante también cuenta.
    if (count($palabras) < 1 || count($palabras) > 7) return '';
    // Ni terminar en una preposición o un artículo: "productos de limpieza a".
    if (preg_match('/^(a|al|de|del|la|las|el|los|en|para|con|y|o|e|u|un|una|por|sin)$/u', end($palabras))) return '';
    /* "alquilamos sonido e iluminación para eventos" es lo que HACE dicho con
     * su verbo, no el rubro: detrás de "Para" quedaba "Para alquilamos sonido…"
     * (batería del 11-sep). Sin rubro, el precio arranca "Podemos hacer…". */
    if (preg_match('/^(\p{L}{3,}(amos|emos|imos)|somos|damos|vendo|hago|tengo|soy|alquilo|fabrico|ofrezco|doy|dicto|brindo|organizo'
        . '|realizo|atiendo|reparo|instalo|produzco|preparo|cocino|importo|distribuyo|elaboro|necesito|quiero|busco)$/u', $palabras[0])) return '';
    // Ni un tipo de web ni un relleno: eso no es el rubro del cliente. El
    // relleno tiene que ser TODO el rubro: "tu negocio de tortas" sí dice cuál
    // es (batería del 11-sep, se caía entero por contener "tu negocio").
    if (preg_match('/^((lo|tu|mi|su) (tuyo|negocio|caso|rubro|emprendimiento|empresa|local|marca|proyecto))$/u', $norm)) return '';
    if (preg_match('/\b(landing|ecommerce|tienda online|pagina web|sitio web|web)\b/u', $norm)) return '';
    $ctx = ' ' . wabot_normalizar_frase(wabot_contexto_cliente_texto($conv)) . ' ';
    $enContexto = false;
    /* La raíz es de cinco letras como mucho: desde el 11-sep el modelo manda
     * el rubro con sus palabras y en segunda persona ("tu estudio contable"
     * para "soy contadora"), y con la raíz larga de antes ("contab") no pasaba
     * y el precio arrancaba "Para contadora podemos…". */
    foreach ($palabras as $p) {
        if (mb_strlen($p) < 4) continue;
        $raiz = mb_substr($p, 0, max(4, min(mb_strlen($p) - 2, 5)));   // gorras→gorr, contable→conta
        if (mb_strpos($ctx, $raiz) !== false) { $enContexto = true; break; }
    }
    if (!$enContexto) return '';
    // "Las gorras" → "las gorras"; un nombre propio adentro ("taller Norte") se respeta.
    $crudas = explode(' ', $r);
    $hayPropio = false;
    foreach (array_slice($crudas, 1) as $w) {
        if (preg_match('/^\p{Lu}/u', $w)) { $hayPropio = true; break; }
    }
    /* Desde el 11-sep el precio arranca "Para tu centro de estética podemos
     * hacer…": el rubro va en segunda persona. wabot_rubro_desde_contexto()
     * lo toma como lo escribió el cliente ("mi centro de estética"). */
    $r = preg_replace('/^(mi|nuestro|nuestra)\s+/iu', 'tu ', $r);
    $r = preg_replace('/^(mis|nuestros|nuestras)\s+/iu', 'tus ', $r);
    if (!$hayPropio) $r = mb_strtolower(mb_substr($r, 0, 1)) . mb_substr($r, 1);
    return $r;
}

/**
 * El rubro sacado de lo que el cliente escribió, cuando el modelo no lo mandó.
 *
 * "Perfecto, para tu negocio sería un sitio profesional" les llegó a Henry
 * (que había escrito tres renglones sobre enfermería domiciliaria), a Mundo
 * Queen y a la clienta de cerámica, todos el 3-sep. El argumento `rubro` de
 * dar_precio era opcional y el modelo lo omitía: ahora es obligatorio, y esto
 * es la red por si igual llega vacío.
 *
 * Deliberadamente angosta. Solo toma lo que viene detrás de una fórmula de
 * presentación explícita ("soy...", "tengo un...", "vendo...", "hago..."), que
 * es donde el rubro está dicho con todas las letras, y lo pasa por
 * wabot_rubro_valido() como si lo hubiera mandado el modelo. Si no encuentra
 * nada con esa forma devuelve '' y sale "tu negocio", como hasta ahora:
 * inventarle un rubro equivocado es peor que no nombrarlo.
 */
function wabot_rubro_desde_contexto($conv) {
    $ctx = trim((string)wabot_contexto_cliente_texto($conv));
    if ($ctx === '') return '';

    /* Se recorre por oración y se prefiere la PRIMERA presentación, que es
     * donde la gente dice a qué se dedica antes de entrar en detalles. */
    $verbos = 'soy|somos|tengo|tenemos|vendo|vendemos|hago|hacemos|ofrezco|ofrecemos'
            . '|me dedico a|nos dedicamos a|fabrico|fabricamos|trabajo (?:con|de)|doy|damos|dicto|dictamos'
            . '|interesad[oa] en|necesito|necesitaria|quiero|queria';
    $articulos = '(?:un|una|unos|unas|el|la|los|las|mi|mis)\s+';

    /* Palabras que no dicen nada del rubro. "Tenemos un local donde hacemos
     * uñas" daba "un local", que en el pitch se lee igual de genérico que "tu
     * negocio" y encima suena raro ("para un local sería un ecommerce"). */
    $vacias = '/^(un |una |el |la |los |las |mi |mis )?(local|negocio|negocios|emprendimiento|empresa|comercio'
            . '|marca|tienda|proyecto|rubro|servicio|servicios|producto|productos|pagina|paginas|web|sitio'
            . '|cliente|clientes|persona|gente|cosas|todo|algo'
            // Saludos y muletillas: son el primer segmento de casi todo mensaje.
            . '|hola|holaa+|buenas|buen dia|buenas tardes|buenas noches|gracias|consulta|consultas'
            . '|informacion|información|info|precio|precios|presupuesto|presupuestos|ayuda|idea)$/iu';

    $tomar = function ($candidato, $articulo) use ($conv, $vacias) {
        $candidato = trim((string)$candidato);
        if ($candidato === '' || preg_match($vacias, $candidato)) return '';
        /* El rubro es un sustantivo, no una acción. "Quería consultar por una
         * página" daba "consultar por una pagina" y el pitch salía "para
         * consultar por una pagina sería un ecommerce". */
        if (preg_match('/^(consultar|preguntar|saber|ver|hacer|armar|tener|conseguir|averiguar|cotizar|presupuestar|comprar|contratar|hablar|charlar)\b/iu', $candidato)) return '';
        // Una sola palabra que además es la primera del mensaje y termina en
        // -ar/-er/-ir tiene todas las chances de ser otro infinitivo suelto.
        if (preg_match('/^\p{L}+(ar|er|ir)$/u', $candidato)) return '';
        $articulo = trim((string)$articulo);
        if ($articulo !== '') {
            $valido = wabot_rubro_valido($articulo . ' ' . $candidato, $conv);
            if ($valido !== '') return $valido;
        }
        return wabot_rubro_valido($candidato, $conv);
    };

    /* preg_match_all y no preg_match: en una oración larga la primera fórmula
     * puede no servir y la segunda sí. "Con mi esposa tenemos un local donde
     * hace uñas... y también hacemos ventas de insumos" arranca con "tenemos un
     * local" —que no es un rubro— y recién la segunda ("hacemos ventas de
     * insumos") dice algo. Con una sola pasada se caía a "tu negocio". */
    $candidatos = [];
    foreach (preg_split('/[.;\n]+/u', $ctx) as $oracion) {
        $o = trim((string)$oracion);
        if ($o === '') continue;
        if (!preg_match_all('/\b(' . $verbos . ')\s+(' . $articulos . ')?([\p{L}][\p{L}\s]{2,45})/ui', $o, $ms, PREG_SET_ORDER)) continue;
        foreach ($ms as $m) $candidatos[] = $m;
    }
    foreach ($candidatos as $m) {
        $cola = trim((string)$m[3]);
        if ($cola === '') continue;
        // Se corta en el primer conector: lo que sigue ya es otra cosa.
        $cola = preg_split('/\b(y|o|que|para|con|en|por|sobre|desde|hasta|donde|pero|porque|ademas|además)\b/ui', $cola)[0] ?? '';
        $cola = trim((string)$cola);
        if ($cola === '') continue;
        /* "Interesado en una DE enfermería domiciliaria": el partitivo no es
         * parte del rubro, y arrastrarlo daba "para una de enfermería
         * domiciliaria sería...". Si estaba, el artículo tampoco va. */
        $articulo = (string)($m[2] ?? '');
        if (preg_match('/^(de|del|a|al)\s+/ui', $cola)) {
            $cola = trim(preg_replace('/^(de|del|a|al)\s+/ui', '', $cola));
            $articulo = '';
        }
        if ($cola === '') continue;
        $palabras = preg_split('/\s+/u', $cola);
        if (count($palabras) > 4) $palabras = array_slice($palabras, 0, 4);
        /* Cortar en cuatro puede dejar una preposición colgando: "productos de
         * limpieza a granel" quedaba "productos de limpieza a", y el precio
         * arrancaba "Para productos de limpieza a podemos…" (batería 11-sep). */
        while (count($palabras) > 1 && preg_match('/^(a|al|de|del|la|las|el|los|en|para|con|y|o|e|u|un|una|por|sin)$/iu', end($palabras))) {
            array_pop($palabras);
        }
        $valido = $tomar(implode(' ', $palabras), $articulo);
        if ($valido !== '') return $valido;
    }

    /* Sin fórmula de presentación y con el rubro dicho a secas: "ceramica,
     * venta y clases" son cuatro palabras y ninguna es un verbo. Solo cuando
     * TODO lo que escribió es corto: en un texto largo, el primer segmento
     * puede ser cualquier cosa menos el rubro. */
    $palabrasCtx = preg_split('/\s+/u', trim(preg_replace('/\s+/u', ' ', $ctx)));
    if (count($palabrasCtx) <= 8) {
        // Se recorren los segmentos y no solo el primero: casi todo mensaje
        // arranca con un saludo, que $tomar() descarta.
        foreach (preg_split('/[,;\n]+/u', $ctx) as $segmento) {
            $segmento = trim((string)$segmento);
            /* Si el segmento trae un verbo de presentación, su turno ya pasó
             * arriba y no salió nada: agarrarlo entero acá deja frases como
             * "queria consultar por una pagina" de rubro. */
            if ($segmento === '' || preg_match('/\b(' . $verbos . ')\b/ui', $segmento)) continue;
            $valido = $tomar($segmento, '');
            if ($valido !== '') return $valido;
        }
    }
    return '';
}

/**
 * "No tengo ninguna referencia": la respuesta NEGATIVA también es una respuesta.
 *
 * La clienta de Estética Integral contestó el listado con "No tengo ninguna
 * referencia me gustan los colores pasteles" y el bot le repreguntó, en el
 * turno siguiente, si tenía alguna página de referencia — cerrando encima con
 * "si no tenés ninguna, decime que no", que es lo que ella acababa de decir
 * (3-sep). De todos los errores es el que más suena a respuesta automática.
 *
 * Pasaba porque la referencia solo se daba por contestada si el modelo llamaba
 * anotar_prediseno con el argumento `referencia` (wabot_agente_anotar), y con
 * una negativa el modelo simplemente no lo manda. wabot_prediseno_faltan() la
 * seguía pidiendo y wabot_agente_repite_pregunta_contestada() —que sí tiene el
 * patrón de esa pregunta— no la frenaba, porque exige referencia_preguntada.
 *
 * ANOTA Y NO CONTESTA, igual que wabot_prediseno_lista_posicional(): marca el
 * dato y deja seguir el flujo, que con la ficha completa hace lo que va.
 */
function wabot_prediseno_referencia_negada($texto, &$conv) {
    if (trim((string)($conv['referencia'] ?? '')) !== '' || !empty($conv['referencia_preguntada'])) return false;
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;

    $sustantivo = '(referencia\w*|ejemplo\w*|pagina\w*|paginas|web\w*|sitio\w*|modelo\w*|inspiracion)';
    $negacionExplicita = preg_match('/\b(no tengo|no tenemos|no cuento con|no manejo|no se me ocurre|no tengo ninguna|ninguna en particular)\b.{0,25}\b' . $sustantivo . '\b/u', $t)
        || preg_match('/\b' . $sustantivo . '\b.{0,20}\b(no tengo|no tenemos|ninguna|ninguno|no)\b/u', $t)
        || preg_match('/\b(no vi|no mire|no busque)\b.{0,20}\b' . $sustantivo . '\b/u', $t);

    if (!$negacionExplicita) {
        /* "No. Ninguna" a secas: solo cuenta si lo último que preguntó el bot
         * fue justamente la referencia. Sin ese anclaje, un "no" suelto puede
         * estar contestando cualquier otra cosa. */
        /* "No. Ninguna" normaliza a "no ninguna": la negativa corta llega
         * encadenada tanto o más seguido que sola. Se acepta cualquier
         * combinación corta de palabras negativas y nada más. */
        if (!preg_match('/^(no|ninguna|ninguno|nada|tengo|por|ahora|todavia|aun|todavía|ni|una|conozco|se)(\s+(no|ninguna|ninguno|nada|tengo|por|ahora|todavia|aun|todavía|ni|una|conozco|se)){0,3}$/u', $t)) return false;
        if (!preg_match('/\b(no|ninguna|ninguno|nada|ni)\b/u', $t)) return false;
        $ultimaDelBot = '';
        foreach (array_reverse((array)($conv['transcript'] ?? [])) as $linea) {
            if (($linea['q'] ?? '') === 'bot') { $ultimaDelBot = wabot_normalizar_frase((string)($linea['t'] ?? '')); break; }
        }
        if ($ultimaDelBot === '' || !preg_match('/\breferencia\w*\b|\bpagina que te (haya )?gust\w+\b|\bweb que te guste\b/u', $ultimaDelBot)) return false;
    }

    $conv['referencia'] = '';
    $conv['referencia_preguntada'] = true;
    return true;
}

/** Deshace un pitch que salió este turno pero no llegó al cliente. */
function wabot_pitch_deshacer(&$conv) {
    $conv['tipo'] = null;
    $conv['fase'] = 'menu';
    $conv['precio_dado'] = false;
    $conv['pitch_hecho'] = false;
    $conv['pitch_tipo'] = null;
    $conv['cta_muestra'] = false;
    $conv['rubro_pitch'] = '';
    unset($conv['pitch_para_que'], $conv['pitch_para_que_tipo']);
}

/**
 * ¿Deja los colores en nuestras manos? "Elegí vos", pero también "no tengo",
 * "no sé", "ninguno": para los colores todo eso es lo mismo, y pedírselos de
 * nuevo es lo que espantó a Enrique (1-sep).
 */
function wabot_colores_delegados($texto) {
    if (wabot_es_delegacion($texto)) return true;
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 60) return false;
    return (bool)preg_match('/^(no|no tengo|no tengo colores|no tengo definidos?|no tengo ninguno|no se|no sabria|ninguno|ninguna|ninguno en particular|todavia no|aun no|no tengo idea|no hay|los que (vos )?quieras?|lo dejo (en tus manos|a tu criterio))$/u', $t);
}

/**
 * "Si vos sos el creador no te puedo decir yo cómo hacerlo" (Enrique, plomero,
 * 1-sep): no sabe qué contestar al pedido de datos. La respuesta correcta ya
 * existía (info.no_se_nada, "para eso estamos nosotros") y no tenía detector:
 * se le volvieron a pedir los colores y la referencia, y no escribió más.
 */
function wabot_texto_no_sabe_como($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 220) return false;
    return (bool)(
        // "no sé si me conviene" es una duda de valor, no un "no sé cómo".
        preg_match('/\b(no (se|sabria|sabria decirte|te sabria decir|te puedo decir|te podria decir|tengo idea|entiendo de eso|se de eso|se nada de eso|manejo eso))\b(?!\s+(si|cuanto|cuando|donde)\b)/u', $t)
        || preg_match('/\b(vos sos|ustedes son|usted es) (el|la|los|las) (creador\w*|que sabe\w*|profesional\w*|expert\w*|disenador\w*|especialista\w*)\b/u', $t)
        || preg_match('/\b(como (vos|ustedes|usted) (veas?|vean|quieras?|quieran|digas?|digan|creas?|crean)|a tu criterio|a criterio (tuyo|de ustedes)|lo que (vos|ustedes) (digas?|digan|vean|decidan))\b/u', $t)
        || preg_match('/\b(eso lo (sabes|saben|sabras|sabran|ves|ven) (vos|ustedes)|de eso (sabes|saben) (vos|ustedes))\b/u', $t)
    );
}

/**
 * El turno del "no sé cómo" en el prediseño: se lo tranquiliza con
 * info.no_se_nada, los colores quedan a elección nuestra y se le pide SOLO lo
 * que sigue faltando (nombre, negocio); si ya no falta nada, se cierra.
 * Compartido por el motor y el agente. Devuelve null si no aplica.
 */
function wabot_prediseno_no_sabe_como($texto, &$conv, $cfg) {
    if (!in_array((string)($conv['fase'] ?? ''), ['prediseno', 'prediseno_ref'], true)) return null;
    if (!empty($conv['lead_creado'])) return null;
    if (!wabot_texto_no_sabe_como($texto)) return null;
    if (trim((string)($conv['colores'] ?? '')) === '') $conv['colores'] = 'A elección del diseñador';
    if (($conv['fase'] ?? '') === 'prediseno_ref' || empty($conv['referencia_preguntada'])) {
        if (trim((string)($conv['referencia'] ?? '')) === '') $conv['referencia'] = '';
        $conv['referencia_preguntada'] = true;
    }
    $conv['fase'] = 'prediseno';
    wabot_evento_sesion($conv, 'prediseno_no_sabe_como');
    $out = [];
    $tranquilo = trim(wabot_texto_info('no_se_nada', $cfg));
    if ($tranquilo !== '') $out[] = $tranquilo;
    if (wabot_prediseno_faltan($conv, false)) {
        $out[] = wabot_prediseno_texto($conv, $cfg);
        return $out;
    }
    return array_merge($out, wabot_cerrar_o_pedir_whatsapp($conv, $cfg));
}

/**
 * El precio+desc del turno del pitch. Si el tipo tiene un texto fijo dictado
 * por Pablo (precio_ideal), es ese con {precio} resuelto; si no —institucional,
 * que no tiene copy fijo— es la plantilla dinámica de siempre. Se llama ANTES
 * de fijar pitch_tipo, a propósito: necesita el {desc} completo (msg_precio),
 * no la variante sin desc que usa msg_precio_tras_pitch para cuando el pitch
 * ya se dio en un turno ANTERIOR.
 */
function wabot_pitch_precio_texto($tipo, $cfg, $conv) {
    $fijo = trim((string)($cfg['tipos'][$tipo]['precio_ideal'] ?? ''));
    // La charla cotizada con el pago único conserva su redacción: el formato
    // del 11-sep habla de primer pago y plan, que para ella no existen.
    if ($fijo !== '' && wabot_precio_vigente($conv, $cfg, $tipo)['modelo'] !== 'unico') {
        // {link} desde el 2-sep: el mensaje del precio termina en el link del
        // presupuesto, que es donde el cliente ve el detalle y los trabajos.
        // {precio} y {mensualidad} salen del precio vigente de la charla.
        $fijo = str_replace('{propuesta}', wabot_propuesta_texto($tipo, $conv), $fijo);
        return wabot_precio_placeholders($fijo, $conv, $cfg, $tipo);
    }
    return wabot_msg_precio_texto($tipo, $cfg, $conv);
}

/**
 * Qué le podemos hacer, la primera oración del precio (Pablo, 11-sep): "Para
 * tu centro de estética podemos hacer una web donde muestres los tratamientos y
 * tus clientas reserven turno online."
 *
 * Lo que va a poder hacer con la web lo escribe el modelo con las palabras del
 * cliente (argumento para_que de dar_precio, ya validado por
 * wabot_para_que_valido y guardado con el tipo para el que lo escribió). Si no
 * llegó, no pasó el filtro o el código terminó cotizando otro tipo, va la
 * frase fija del tipo. La del sitio profesional es la que dictó Pablo el 3-sep
 * ("presenta tu negocio, explica tus servicios…"): sirve igual para una
 * contadora, un abogado o un colegio, que no tienen trabajos que mostrar.
 */
function wabot_propuesta_texto($tipo, $conv) {
    $paraQue = is_array($conv) && (string)($conv['pitch_para_que_tipo'] ?? '') === (string)$tipo
        ? trim((string)($conv['pitch_para_que'] ?? '')) : '';
    if ($paraQue !== '') return 'una web donde ' . $paraQue;
    $fijas = [
        'landing'      => 'una web a tu medida, que presente tu negocio, explique tus servicios y haga que los clientes te escriban directo por WhatsApp',
        'ecommerce'    => 'una web para vender online, con tu catálogo, carrito y cobro con tarjeta o Mercado Pago, y un panel tuyo para cargar productos y ver los pedidos',
        'inmobiliaria' => 'una web para publicar tus propiedades con fotos y fichas completas, con buscador por zona y tipo, y un panel tuyo para cargarlas y darlas de baja',
        'elearning'    => 'una plataforma para vender tus cursos, con los videos subidos, un usuario para cada alumno con su progreso y el cobro de la inscripción online',
    ];
    return $fijas[$tipo] ?? 'una web a tu medida';
}

/**
 * La clave de info que le corresponde a un tipo de web, o null si es la
 * general. Solo dos respuestas cambian con el tipo: qué incluye (la carga de
 * productos es de la tienda) y las estadísticas (panel en la tienda y en los
 * cursos, Google Analytics en el resto).
 */
function wabot_info_variante_por_tipo($clave, $tipo) {
    if ($tipo === '') return null;
    if ($clave === 'que_incluye') {
        return in_array($tipo, ['ecommerce', 'catalogo'], true) ? null : 'que_incluye_sin_productos';
    }
    if ($clave === 'estadisticas') {
        return in_array($tipo, ['ecommerce', 'catalogo', 'elearning', 'lms'], true) ? 'estadisticas_tienda' : 'estadisticas_sitio';
    }
    return null;
}

/** ¿Es el precio que arranca con la propuesta? ("Para {rubro} podemos hacer una web…") */
function wabot_texto_arranca_con_propuesta($texto) {
    return (bool)preg_match('/^\s*(Para [^\n]{1,90}? )?[Pp]odemos hacer (una|un) /u', (string)$texto);
}

/**
 * El para_que que mandó el modelo, si sirve para ir después de "podemos hacer
 * una web donde". Devuelve '' si no.
 *
 * Es una promesa dicha por nosotros, así que el filtro es más duro que el del
 * rubro: ni montos, ni plazos, ni la demo (eso lo dicen los textos oficiales),
 * ni lo que no se vende a ese precio —apps, integraciones, facturación, Google,
 * redes—, ni carrito o cobro online en un sitio profesional. Lo que el modelo
 * infiera del rubro sí vale: Pablo mismo le prometió turnos online al centro de
 * estética, y están incluidos en todos los planes.
 */
function wabot_para_que_valido($texto, $tipo = '') {
    $p = trim(preg_replace('/\s+/u', ' ', str_replace('_', ' ', (string)$texto)));
    // Lo que ya pone el código: "podemos hacer una web donde".
    $p = preg_replace('/^(podemos (hacer|armar)|te (hacemos|armamos)|hacer|armar)\s+/iu', '', $p);
    $p = preg_replace('/^(una|un|tu)\s+(web|p[áa]gina|sitio|tienda|plataforma|landing)\b[^,.;]{0,30}?\s+(?=(donde|en donde|en (la|el) que|para que|que)\b)/iu', '', $p);
    $p = preg_replace('/^(donde|en donde|en (la|el) que|para que|que)\s+/iu', '', $p);
    $p = trim($p, " \t\n\r.,;:!¡¿?\"'«»()");
    if (mb_strlen($p) < 8 || mb_strlen($p) > 170) return '';
    if (preg_match('/[?¿$%{}@\d]|https?:|www\./u', $p)) return '';
    // Sigue arrancando como una web: el modelo mandó otra forma ("una web para
    // mostrar…") y pegada detrás de "una web donde" quedaría dos veces.
    if (preg_match('/^(una|un|la|el|tu)\s+(web|p[áa]gina|sitio|tienda|plataforma|landing)\b/iu', $p)) return '';
    $n = wabot_normalizar_frase($p);
    $palabras = array_values(array_filter(explode(' ', $n)));
    if (count($palabras) < 3 || count($palabras) > 28) return '';

    // Plata nuestra, plazos y la demo: eso lo dice el resto del mensaje. Los
    // precios y el presupuesto del CLIENTE sí pueden ir ("te pidan presupuesto
    // por WhatsApp", "vean los precios de cada producto").
    if (preg_match('/\b(valor|cuesta|costo|costos|sena|cuota|cuotas|pago|pagos|abono|abonos|abonar|descuento|descuentos'
        . '|gratis|plazo|plazos|demo|predise\w*|link|mensualidad|mensual|hoy|manana|enseguida|breve|brevedad)\b/u', $n)) return '';
    if (preg_match('/\b(en|dentro de)\s+(un|una|dos|tres|cuatro|cinco|pocos|pocas|unos|unas)\s+(dia|dias|semana|semanas|mes|meses|hora|horas)\b/u', $n)) return '';
    // Nada de nosotros: ni derivaciones ni anotaciones.
    if (preg_match('/\b(desarrollador|pablo|equipo|te paso|te comunico|te derivo|te aviso|contame|decime|pasame|mandame|anote|anotado|anotada|tome nota)\b/u', $n)) return '';
    // Lo que no se vende a este precio.
    if (preg_match('/\b(app|apps|aplicacion|aplicaciones|factur\w*|afip|arca|integraci\w*|integrad\w*|integre\w*|integren|sincroniz\w*|api|chatbot|bot'
        . '|inteligencia artificial|ia|cripto\w*|mercado ?libre|tiendanube|tienda nube|shopify|wix|wordpress|google|seo|posicionamiento'
        . '|publicidad|anuncios|marketing|redes|instagram|facebook|tiktok|seguidores|seguimiento|rastre\w*|tracking)\b/u', $n)) return '';
    // Carrito y cobro online son de la tienda (y de la plataforma de cursos).
    // En la inmobiliaria "compra" es la operación, no un carrito.
    $soloTienda = 'carrito|cobres|cobrar|cobren|cobro|paguen|pagar|checkout|stock|tienda online';
    if ((string)$tipo === 'landing' && preg_match('/\b(' . $soloTienda . '|compren|comprar|compra|compras)\b/u', $n)) return '';
    if ((string)$tipo === 'inmobiliaria' && preg_match('/\b(' . $soloTienda . ')\b/u', $n)) return '';
    if (wabot_texto_promete_cierre($p) || wabot_texto_promete_info_sin_entregar($p)) return '';
    if (wabot_texto_comodin_desarrollador($p)) return '';
    if (function_exists('wabot_texto_parece_interno') && wabot_texto_parece_interno($p)) return '';
    if (function_exists('wabot_frase_retirada') && wabot_frase_retirada($p)) return '';

    $p = trim(preg_replace('/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]/u', '', $p));
    // Va en el medio de la oración: minúscula, salvo que arranque con una sigla.
    if (!preg_match('/^\p{Lu}{2}/u', $p)) $p = mb_strtolower(mb_substr($p, 0, 1)) . mb_substr($p, 1);
    return $p;
}

/**
 * La respuesta a "¿buscabas algo así o tenías otra idea en mente?" dice que NO.
 *
 * Un "no" pelado a esa pregunta significa que el tipo cotizado no encaja, así
 * que no hay que ofrecerle la demo: primero hay que saber qué tenía en mente.
 */
function wabot_pitch_dice_otra_idea($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    if (preg_match('/\b(otra idea|otra cosa|algo distinto|algo diferente|otra opcion|no era eso|no es eso)\b/u', $t)) return true;
    if (preg_match('/\bno\b.{0,20}\b(es lo que|era lo que|buscaba|buscando|tenia pensado|tenia en mente|me sirve|me servia)\b/u', $t)) return true;
    /* "No me gusta mucho che" es un no a la pregunta del pitch, y wabot_es_negativa()
     * no lo veía: pedía un "no" más pelado. Bloc Consultora arrancó por acá
     * (29-ago). Vale solo en fase pitch, que es la única que llama a esto. */
    if (preg_match('/\bno me\b.{0,12}\b(gusta|gustan|convence|convencen|cierra|cierran|copa|copan|termina de|va)\b/u', $t)) return true;
    if (preg_match('/\b(tenia|tengo|pensaba en|buscaba)\b.{0,12}\b(otra|otro)\b/u', $t)) return true;
    return wabot_es_negativa($t);
}

/**
 * El turno siguiente al pitch: si el cliente dice que no era eso, la demo no
 * se ofrece. Se le pregunta qué tenía en mente y la fase queda en 'pitch',
 * así el clasificador puede recotizar con lo que conteste.
 *
 * Devuelve null cuando la respuesta no es un "no" y el turno sigue su curso
 * normal (ahí sí entra la oferta de la demo, como siempre).
 */
function wabot_pitch_encaje_rechazado($texto, &$conv, $cfg) {
    if (!wabot_pitch_dice_otra_idea($texto)) return null;
    $conv['fase'] = 'pitch';

    /* Segunda vez que dice que no sin decir qué quiere ("No me gusta mucho
     * che" y después "Quiero otra cosa"): la pregunta abierta ya falló, así
     * que va la concreta. Antes esto devolvía null y el turno se lo quedaba el
     * modelo, que contestó "esa duda te la va a poder contestar el
     * desarrollador" a alguien que estaba eligiendo qué comprar (29-ago). */
    if (!empty($conv['pitch_otra_idea_dicha'])) {
        if (!empty($conv['pitch_otra_idea_2_dicha'])) return null;
        $conv['pitch_otra_idea_2_dicha'] = true;
        wabot_evento_sesion($conv, 'pitch_otra_idea_2', ['tipo' => (string)($conv['tipo'] ?? '')]);
        return [(string)($cfg['pitch_otra_idea_2'] ?? 'Contame qué tenías en mente y lo vemos.')];
    }

    $conv['pitch_otra_idea_dicha'] = true;
    wabot_evento_sesion($conv, 'pitch_otra_idea', ['tipo' => (string)($conv['tipo'] ?? '')]);
    return [wabot_plantilla_variante('pitch_otra_idea', 'pitch_otra_idea_variantes', $conv, $cfg)];
}

function wabot_pitch_corresponde($tipo, $conv, $cfg) {
    if (empty($cfg['pitch_activo'])) return false;
    if (!empty($conv['pitch_hecho']) || !empty($conv['precio_dado'])) return false;
    if (!empty($conv['demo_pedida_entrada'])) return false;
    if (!empty($conv['pidio_precio'])) return false;
    if (wabot_texto_pide_precio(wabot_ultimo_texto_cliente($conv))) return false;
    /* Ya no depende de que haya una línea de pitch cargada: esa línea se
     * eliminó el 2-sep y el turno es precio + demo. Catálogo queda afuera
     * porque su "pitch" era la pregunta por la cantidad, que también se fue. */
    return $tipo !== 'catalogo' && isset($cfg['tipos'][$tipo]);
}

/**
 * El turno del precio: cada tipo tiene un precio fijo que no depende de nada,
 * así que sale acá mismo —dos mensajes separados, el segundo llega aparte unos
 * segundos después (ver 'aparte' en agente.php)— en vez de esperar a que el
 * cliente conteste una pregunta para recién ahí cotizar.
 */
function wabot_pitch($tipo, &$conv, $cfg) {
    $conv['tipo'] = $tipo;
    wabot_handoff_aclaracion_resuelta($conv);

    // Se congela ANTES de armar el texto: el mensaje sale del precio congelado.
    wabot_precio_congelar($conv, $tipo, $cfg);
    $precioTexto = wabot_pitch_precio_texto($tipo, $cfg, $conv);
    $conv['pitch_hecho'] = true;
    $conv['pitch_tipo'] = $tipo;
    $conv['precio_dado'] = true;
    wabot_evento_sesion($conv, 'pitch_dado', ['tipo' => $tipo]);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);

    /* EL TURNO DEL PRECIO SON DOS MENSAJES: el precio y, atrás, LOS TRES PASOS
     * (demo gratis, primer pago, plan mensual a los 30 días), dictados por
     * Pablo el 10-sep. Sin nada en el medio (Pablo, 2-sep: "sacá todo lo que
     * sea 'si te cierra', 'si va por ahí'"). El link del formulario ya NO va
     * pegado acá: sale recién cuando el cliente contesta que sí (case
     * 'prediseno' del motor, o consultar_info('prediseno') del agente). Es el
     * mismo texto haya link o no, así Instagram y el que ya completó el form
     * reciben el mismo segundo mensaje. */
    $conv['fase'] = 'prediseno';
    $conv['cta_muestra'] = true;
    wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'precio']);
    return [$precioTexto, wabot_tres_pasos_texto($conv, $cfg)];
}

/**
 * A qué tipo vigente va a parar uno retirado. Es el embudo de compatibilidad
 * del 2-sep: catálogo lo absorbe ecommerce, turnos e institucional el sitio
 * profesional, y LMS se cotiza como plataforma de cursos salvo que Pablo diga
 * otra cosa. Devuelve el mismo tipo si ya es ofrecible.
 */
function wabot_tipo_absorbido($tipo, $cfg) {
    $tipo = (string)$tipo;
    if (wabot_tipo_ofrecible($tipo, $cfg)) return $tipo;
    $mapa = ['catalogo' => 'ecommerce', 'turnos' => 'landing',
             'institucional' => 'landing', 'lms' => 'elearning'];
    $destino = $mapa[$tipo] ?? 'landing';
    return isset($cfg['tipos'][$destino]) ? $destino : $tipo;
}

function wabot_precio($tipo, &$conv, $cfg) {
    /* Los tipos retirados no se cotizan más (Pablo, 2-sep). Este es el embudo
     * único por donde pasan TODAS las cotizaciones —motor, atajo y agente—,
     * así que es el único lugar donde el mapeo no se puede esquivar.
     *
     * Excepción: una charla que YA fue cotizada con ese tipo se queda con el
     * suyo. Cambiarle el tipo a quien ya tiene un precio dado le cambiaría el
     * número, que es exactamente lo que nunca hay que hacer. */
    if (!wabot_tipo_ofrecible($tipo, $cfg)) {
        $yaCotizado = !empty($conv['precio_dado']) && ($conv['tipo'] ?? '') === $tipo;
        if (!$yaCotizado) {
            $absorbido = wabot_tipo_absorbido($tipo, $cfg);
            if ($absorbido !== $tipo) {
                wabot_evento_sesion($conv, 'tipo_retirado', ['pedido' => $tipo, 'cotizado' => $absorbido]);
                $tipo = $absorbido;
            }
        }
    }
    /* Nadie cotiza UN tipo a quien pidió DOS cosas distintas sin avisarle.
     *
     * El guard vivía en dar_precio (agente.php) y no alcanzaba: la respuesta a
     * un desempate toma un atajo determinista que llama acá directamente, sin
     * pasar por la herramienta. Una consulta de psicoeducación pidió "sesiones,
     * grupos y cuadernillos", contestó "Reservar" y se llevó una web de turnos
     * de $200.000 con los cuadernillos afuera (27-ago). Este es el embudo
     * único por donde pasan todas las cotizaciones — engine, atajo y agente —
     * así que es el único lugar donde el guard no se puede esquivar.
     *
     * Sale UNA vez: si después el cliente elige quedarse con una sola parte,
     * se cotiza normal. institucional queda afuera porque ya es la que junta
     * varias secciones. */
    /* Y solo ANTES de cotizar. Con el precio ya dado, el contexto acumulado
     * hace que cualquier mención vieja dispare el aviso tarde, y entonces le
     * sacamos al cliente un número que ya tenía: "el precio no sale de la
     * lista" después de haberle dicho $290.000 es peor que no avisar nada.
     * Le pasó a la clienta de macramé el 27-ago. Si de verdad pide algo nuevo
     * que cambie el tipo, eso ya tiene su propio camino (cambia_tipo).
     *
     * institucional salía excluido, por ser la que junta varias secciones. La
     * condición ya no puede darse: sin precio_dado el tipo retirado se absorbe
     * a landing más arriba, y con precio_dado este guard no corre. */
    if (empty($conv['mixto_avisado']) && empty($conv['precio_dado'])) {
        $ejes = wabot_ejes_mixtos(wabot_contexto_cliente_texto($conv));
        $textoMixto = $ejes !== null ? wabot_texto_mixto($ejes, $cfg) : null;
        if ($textoMixto !== null) {
            $conv['mixto_avisado'] = true;
            wabot_evento_sesion($conv, 'necesidad_mixta', ['ejes' => implode('+', array_keys($ejes))]);
            return [$textoMixto, (string)$cfg['mixto_pregunta']];
        }
    }
    if (wabot_pitch_corresponde($tipo, $conv, $cfg)) {
        return wabot_pitch($tipo, $conv, $cfg);
    }
    if ($tipo === 'catalogo' && (int)($conv['productos_cantidad'] ?? 0) <= 0) {
        return wabot_catalogo_preguntar($conv, $cfg);
    }
    if (!empty($conv['precio_dado']) && ($conv['tipo'] ?? '') === $tipo && !empty($conv['cta_muestra'])) {
        return [wabot_precio_resumen($conv, $cfg)];
    }
    // El precio ya salió en el turno del pitch (wabot_pitch(), arriba), en su
    // propio mensaje: acá solo falta OFRECER la demo, sin repetir el precio y
    // sin pedir los datos todavía (Pablo, 25-ago: primero se ofrece, y solo si
    // confirma se le pide el listado — antes se saltaba directo al pedido de
    // datos, dando por hecho un sí que nunca se preguntó). Si contesta que sí
    // (o cualquier cosa que no sea otra cosa clasificable), case 'prediseno'
    // ya sabe mandar wabot_prediseno_texto() en el turno siguiente.
    if (!empty($conv['precio_dado']) && ($conv['tipo'] ?? '') === $tipo && empty($conv['cta_muestra'])) {
        $conv['fase'] = 'prediseno';
        $conv['cta_muestra'] = true;
        wabot_handoff_aclaracion_resuelta($conv);
        $origenEvento = !empty($conv['demo_pedida_entrada']) ? 'pedida_de_entrada' : 'precio';
        wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => $origenEvento]);
        /* Pablo, 10-sep: el mensaje que sigue al precio son los tres pasos, y
         * la demo gratis es el paso 1. El link del formulario sale recién
         * cuando el cliente contesta que sí. Mismo texto con o sin link. */
        return [wabot_tres_pasos_texto($conv, $cfg)];
    }

    $conv['tipo'] = $tipo;
    $conv['fase'] = 'precio';
    $conv['precio_dado'] = true;
    wabot_precio_congelar($conv, $tipo, $cfg);
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);

    // Esto solo se llega a pisar cuando el pitch nunca corrió para este tipo
    // (pidió el precio directo, o pitch_activo está apagado): ahí el precio y
    // la propuesta de la demo van juntos en el mismo turno, como siempre.
    // El precio sale con el mismo texto que en el pitch (el formato de Pablo
    // del 11-sep): el que preguntó "cuánto sale" antes de contar su rubro
    // recibía otra redacción, la de msg_precio.
    $out = [wabot_pitch_precio_texto($tipo, $cfg, $conv)];
    $conv['fase'] = 'prediseno';
    $conv['cta_muestra'] = true;
    // "Ofrecida", no "aceptada": todavía no sabemos si el cliente la quiere,
    // recién se la estamos por mandar. "Aceptada" se sigue marcando aparte,
    // cuando de verdad hay una señal de que la quiere (completa el form,
    // contesta con sus datos, dice que sí).
    $origenEvento = !empty($conv['demo_pedida_entrada']) ? 'pedida_de_entrada' : 'precio';
    wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => $origenEvento]);
    /* Detrás del precio van los tres pasos (Pablo, 10-sep), con o sin link:
     * el formulario o el listado de datos salen recién con el sí del cliente,
     * igual que en el camino del pitch. Salvo que ya haya pedido la demo al
     * entrar ("quiero la demo gratis"): ese sí ya está dicho, así que el
     * formulario va en el mismo turno, y los tres pasos sin la pregunta. */
    $pedidoDemo = !empty($conv['demo_pedida_entrada']) ? trim((string)wabot_prediseno_texto($conv, $cfg)) : '';
    $out[] = wabot_tres_pasos_texto($conv, $cfg, $pedidoDemo === '');
    if ($pedidoDemo !== '') $out[] = $pedidoDemo;
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
    $trasPitch = is_array($conv) && (($conv['pitch_tipo'] ?? '') === $tipo);

    if ($tipo === 'catalogo') {
        $cantidad = (int)(is_array($conv) ? ($conv['productos_cantidad'] ?? 0) : 0);
        if ($cantidad > 0) {
            $d = wabot_catalogo_total($cantidad, $cfg);
            $plantilla = $trasPitch && trim((string)($cfg['msg_precio_catalogo_tras_pitch'] ?? '')) !== ''
                ? (string)$cfg['msg_precio_catalogo_tras_pitch']
                : (is_array($conv)
                    ? wabot_plantilla_variante('msg_precio_catalogo', 'msg_precio_catalogo_variantes', $conv, $cfg)
                    : (string)$cfg['msg_precio_catalogo']);
            return str_replace(
                ['{desc}', '{cantidad}', '{total}', '{base}', '{unitario}', '{productos}', '{link}', '{sena}',
                  '{portfolio}', '{portfolio_texto}'],
                [$desc, $d['cantidad'], wabot_moneda($d['total']), wabot_moneda($d['base']),
                  wabot_moneda($d['unitario']), wabot_moneda($d['productos']), $t['link'], (string)($t['sena'] ?? ''),
                  (string)($t['portfolio'] ?? ''), (string)($t['portfolio_texto'] ?? '')],
                $plantilla
            );
        }
    }

    $v = wabot_precio_vigente($conv, $cfg, $tipo);
    // La charla cotizada con el modelo viejo repite SU precio con SU redacción.
    if ($v['modelo'] === 'unico') {
        $legacy = wabot_modelo_unico_textos();
        $plantilla = $trasPitch ? $legacy['msg_precio_tras_pitch'] : $legacy['msg_precio'];
        return str_replace(['{desc}', '{precio}', '{link}', '{sena}'],
            [$desc, $v['precio'], (string)($t['link'] ?? ''), ''], $plantilla);
    }
    $plantilla = $trasPitch && trim((string)($cfg['msg_precio_tras_pitch'] ?? '')) !== ''
        ? (is_array($conv)
            ? wabot_plantilla_variante('msg_precio_tras_pitch', 'msg_precio_tras_pitch_variantes', $conv, $cfg)
            : (string)$cfg['msg_precio_tras_pitch'])
        : (is_array($conv)
            ? wabot_plantilla_variante('msg_precio', 'msg_precio_variantes', $conv, $cfg)
            : (string)$cfg['msg_precio']);
    return wabot_precio_placeholders(str_replace(['{desc}', '{sena}'], [$desc, ''], $plantilla), $conv, $cfg, $tipo);
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
/**
 * Deriva porque pidió hablar por teléfono. Texto propio: el genérico de
 * derivación no dice nada de la llamada, y el cliente quedaría sin saber si
 * alguien lo va a llamar o no.
 */
function wabot_derivar_llamada(&$conv, $cfg) {
    wabot_handoff_marcar($conv, 'pide_humano');
    return [(string)($cfg['pide_llamada'] ?? 'Dale, eso lo hablás directo con Pablo, el desarrollador: te escribe desde nuestro número de proyectos para coordinar.')];
}

function wabot_derivar(&$conv, $cfg, $causa = 'derivacion') {
    wabot_handoff_marcar($conv, $causa);
    return [$cfg['derivar']];
}

/**
 * Derivar sin quedarse mudo.
 *
 * Pablo, 28-ago: el traspaso a él va SIEMPRE —eso no se discute— pero el aviso
 * solo, sin contestar lo que el cliente acababa de preguntar, se lee como que
 * el bot lo esquivó. Si la pregunta es de las que el bot sabe contestar
 * (precio, plazos, pago, hosting, mantenimiento), la respuesta va primero y el
 * aviso atrás. Si no tiene nada que decir, sale el aviso solo, como antes.
 */
function wabot_derivar_contestando($texto, &$conv, $cfg, $causa = 'derivacion') {
    $previa = wabot_respuesta_antes_de_derivar($texto, $conv, $cfg);
    $aviso  = wabot_derivar($conv, $cfg, $causa);
    return $previa === '' ? $aviso : array_merge([$previa], $aviso);
}

/** Lo que el bot puede contestar de un tirón antes de pasarle la charla a Pablo. */
function wabot_respuesta_antes_de_derivar($texto, $conv, $cfg) {
    $clave = wabot_info_por_palabras($texto, 'derivado');
    if ($clave === null) return '';
    if ($clave === 'precio_actual')  return wabot_precio_resumen($conv, $cfg);
    if ($clave === 'mantenimiento')  return wabot_texto_mantenimiento($conv, $cfg);
    if ($clave === 'pago')           return wabot_texto_pago($conv, $cfg);
    if ($clave === 'hosting')        return wabot_texto_hosting($conv, $cfg);
    if ($clave === 'rangos')         return wabot_texto_rangos($cfg);
    return wabot_texto_info($clave, $cfg, $conv);
}

/**
 * El cliente mostró INTERÉS REAL en avanzar con el proyecto, no solo una
 * reacción a la demo.
 *
 * Pablo, 5-sep: "que identifique si de verdad el cliente mostró interés". El
 * aviso de que sigue el desarrollador es lo último que dice el bot en la
 * charla, así que gastarlo con un "dale, la miro" o un "qué linda" quema el
 * único momento en que ese aviso sirve — y deja al cliente hablándole a un bot
 * mudo cuando todavía estaba mirando.
 *
 * Interés real es COMPROMISO, no entusiasmo: pregunta cómo sigue, quiere
 * contratar, discute el precio, pide pagar, acepta la videollamada, o confirma
 * que no le cambiaría nada cuando se le preguntó. Un elogio suelto NO alcanza:
 * se le contesta y se le pregunta por los cambios, y si ahí confirma, ahí sí.
 */
function wabot_postdemo_interes_real($texto, $conv) {
    if (wabot_dice_que_pago($texto))              return true;   // ya transfirió
    if (wabot_postdemo_avance_explicito($texto))  return true;   // "cómo sigo"
    if (wabot_prefiere_tarjeta($texto))           return true;   // pide el link
    if (wabot_postdemo_objecion_plata($texto))    return true;   // regatea = compra
    if (wabot_postdemo_pregunta_como_pagar($texto)) return true;

    /* Aceptar la videollamada es pedir hablar con una persona: es el handoff
     * mismo. Solo cuenta si el bot la ofreció en el turno anterior. */
    if (!empty($conv['videollamada_ofrecida']) && wabot_es_afirmativa($texto)) return true;

    /* "No, así está perfecta": la respuesta a "le cambiarías algo?". El elogio
     * del turno anterior no alcanzaba solo; con la confirmación, sí. */
    if (!empty($conv['postdemo_pregunto_cambios'])
        && (wabot_es_afirmativa($texto) || wabot_postdemo_sin_cambios($texto))) return true;

    return false;
}

/**
 * "Cómo te pago?", "cuánto hay que dejar para arrancar?" — pagarNOS a nosotros.
 *
 * ⚠️ No confundir con la pregunta por los medios de pago de SU web, que en esta
 * etapa es de las más comunes: Silvana preguntó "las formas de pago para
 * exterior del país y para el país" —qué va a poder cobrar ella— y recibió las
 * condiciones comerciales de Gokywebs. Tomarla como intención de compra sería
 * el mismo error, con el agravante de gastar ahí el aviso de handoff.
 */
function wabot_postdemo_pregunta_como_pagar($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    // Habla de la web del cliente, no de esta compra.
    if (preg_match('/\b(mi|mis|su|sus)\b.{0,14}\b(web|pagina|sitio|tienda|negocio|clientes|compradores)\b/u', $t)) return false;
    if (preg_match('/\b(cobrar|cobro|cobren|cobra|exterior|del pais|extranjero|dolares|paypal)\b/u', $t)) return false;
    return (bool)(
        preg_match('/\b(como|donde|cuando|de que forma)\b.{0,22}\b(te pago|les pago|te abono|hago para pagar|hago el pago|se paga|se abona|te transfiero|te deposito|deposito)\b/u', $t)
        || preg_match('/\b(cuanto|que)\b.{0,20}\b(hay que|tengo que|debo|se)\b.{0,14}\b(dejar|pagar|abonar|adelantar)\b/u', $t)
        || preg_match('/\b(sena|seña|anticipo|adelanto)\b/u', $t)
        || preg_match('/\b(formas?|medios?|metodos?)\b.{0,12}\b(de pago)\b/u', $t)
    );
}

/** "No, así está bien" / "no le cambiaría nada": queda como está. */
function wabot_postdemo_sin_cambios($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 90) return false;
    return (bool)(
        preg_match('/\bno\b.{0,20}\b(le )?(cambiaria|cambiaría|cambiar|tocaria|sacaria)\b/u', $t)
        || preg_match('/\b(asi|as[ií])\b.{0,12}\b(esta|queda|va)\b.{0,12}\b(bien|perfecta|perfecto|barbara|joya|ok)\b/u', $t)
        || preg_match('/^(no|nada|ninguno|ninguna|nada que cambiar|esta perfecta|esta perfecto|dejala asi)\b/u', $t)
    );
}

/**
 * El cliente escribió con la demo ya entregada.
 *
 * `presentado_confirmado` significa exactamente eso —contestó algo, lo que
 * sea— y de ahí cuelgan tres automatismos: el recordatorio por plantilla a
 * las 48 h (wabot_confirmacion_demo_corresponde), el archivado a los 7 días
 * (wabot_presentado_archivar_corresponde) y la columna "presentadas sin
 * respuesta" del panel.
 *
 * Vive en el BORDE COMÚN de wabot_responder() y no adentro del corte de
 * postdemo, que es donde estaba: cualquier corte anterior que conteste y
 * termine el turno —el de retomar, agregado el 8-sep— dejaba el flag apagado
 * y el cliente que había contestado "dale, la miro y te escribo el lunes"
 * recibía igual la plantilla de las 48 h. Marcarlo donde entra el mensaje y
 * no donde se decide la respuesta es lo único que no se rompe con el próximo
 * corte que se agregue arriba.
 */
function wabot_presentado_marcar_respuesta(&$conv) {
    if (empty($conv['presentado_ts'])) return false;
    if (!empty($conv['presentado_confirmado'])) return false;
    $conv['presentado_confirmado'] = true;
    return true;
}

/**
 * Qué contesta el bot cuando el cliente responde a la demo ya presentada.
 *
 * Pablo, 28-ago: "siempre se manda el mismo mensaje repetido; que el mensaje
 * dependa de lo que envía el cliente". Al que escribía "me encanta", al que
 * pedía un cambio de color y al que decía que no le cerró les llegaba el
 * mismo aviso de derivación, palabra por palabra.
 *
 * Pablo, 5-sep: y el aviso de que sigue el desarrollador sale SOLO si el
 * cliente mostró interés real (ver wabot_postdemo_interes_real). Mientras no
 * lo muestre, el bot le contesta lo que dijo y SIGUE DISPONIBLE: la charla no
 * se deriva, no se marca handoff y no se calla. Devolver null significa "no
 * tengo nada fijo que decir": el turno sigue al agente, que contesta la duda
 * con sus propias palabras sin vender.
 */
function wabot_postdemo_responder($texto, &$conv, $cfg) {
    wabot_presentado_marcar_respuesta($conv);

    /* El cliente avisa que ya pagó. No es vender: es acusar recibo de algo que
     * ya pasó, y quedarse callado ahí sería peor. */
    if (wabot_dice_que_pago($texto)) {
        $conv['pago_avisado_ts'] = time();
        $conv['postdemo_avisado'] = true;
        return array_merge([(string)$cfg['postdemo_pago_avisado']],
                           wabot_derivar($conv, $cfg, 'pago_explicito'));
    }

    /* "No me interesa, no quiero avanzar" es un rechazo, no una charla viva.
     * Antes esto caía en null: en modo agente lo cerraba wabot_agente_intento()
     * y en el motor salía "contame qué te pareció" a quien acababa de decir
     * que no. Y el panel lo contaba como "demo entregada con interés" porque
     * mira si escribió algo después de la demo (auditoría 7-sep, punto E).
     * Acá se cierra igual en los tres caminos; wabot_cierre_sin_presion_tipo()
     * ya descarta "no me interesa vender/cobrar", que es otra cosa. */
    $cierre = wabot_cierre_sin_presion_tipo($texto);
    if ($cierre === 'rechazo' || $cierre === 'baja') {
        return wabot_cerrar_sin_presion($conv, $cfg, $cierre);
    }

    $interes = wabot_postdemo_interes_real($texto, $conv);

    /* De lo más concreto a lo más vago. El orden importa: "no me gusta el color,
     * se puede cambiar?" es un pedido de cambio, no un rechazo. */
    $especifico = '';

    if (wabot_postdemo_pide_cambios($texto)) {
        /* Se ANOTA acá, no solo se dice. Antes esta rama contestaba "tomo nota
         * de esos cambios" con cambios_pedidos vacío, y recién la rama de
         * fase derivado (redactor.php) escribía el campo: el mismo pedido
         * quedaba guardado o no según la etapa (auditoría 7-sep, punto B). */
        wabot_cambios_anotar($conv, $texto, 'postdemo');
        $especifico = (string)($cfg['postdemo_cambios'] ?? '');
    } elseif (wabot_postdemo_no_gusto($texto)) {
        $especifico = (string)($cfg['postdemo_no_gusto'] ?? '');
    } elseif (wabot_postdemo_la_va_a_mirar($texto)) {
        $especifico = (string)($cfg['postdemo_la_miro'] ?? '');
    } elseif (wabot_postdemo_elogio($texto)) {
        /* Un elogio se contesta preguntando por los cambios, que es lo único
         * que el bot puede tomar. Si contesta que no le cambia nada, ESE turno
         * ya es interés real: ahí sale el aviso y la pregunta no se repite
         * ("está perfecta" es a la vez la respuesta y otro elogio). */
        if (!$interes) {
            $especifico = (string)($cfg['postdemo_elogio'] ?? '');
            $conv['postdemo_pregunto_cambios'] = true;
        }
    } elseif (wabot_postdemo_duda($texto) && empty($conv['videollamada_ofrecida'])) {
        /* La videollamada no es vender: es pasárselo al desarrollador en
         * persona. Se ofrece y se espera la respuesta: recién si acepta hay
         * handoff. */
        $conv['videollamada_ofrecida'] = true;
        return [(string)($cfg['postdemo_videollamada'] ?? '')];
    }

    /* Lo que preguntó ADEMÁS de lo que el texto fijo contesta. "Me gustó, pero
     * cuánto sale y tiene mantenimiento?" se llevaba solo "le cambiarías
     * algo?" y las dos preguntas quedaban sin responder: el texto fijo
     * terminaba el turno antes de que nadie las leyera (auditoría 7-sep,
     * punto A). Lo que tiene respuesta oficial se contesta acá mismo; lo que
     * no, se le deja al agente con el texto fijo adelante. */
    $extra = wabot_postdemo_preguntas_extra($texto, $conv, $cfg);
    $info  = $extra['info'];

    if (!$interes) {
        if ($extra['hay'] && $info === '') {
            /* Hay una pregunta y el bot no tiene texto oficial para ella: la
             * contesta el agente. El texto fijo no se pierde: viaja en una
             * clave transitoria y el agente lo pone adelante (o el motor lo
             * manda solo si el agente falla). */
            if (trim($especifico) !== '') $conv['_postdemo_prefijo'] = $especifico;
            return null;
        }
        // Sigue mirando: el bot queda disponible para la próxima.
        return wabot_postdemo_componer($especifico, $info);
    }

    /* Interés real: se avisa UNA vez que sigue el desarrollador y la charla
     * queda con él. El aviso no se repite nunca más (postdemo_avisado). */
    $conv['postdemo_avisado'] = true;
    wabot_handoff_marcar($conv, 'postdemo_respuesta');
    $aviso = (string)($cfg['postdemo_derivar'] ?? '');
    if (trim($aviso) === '') return wabot_postdemo_componer($especifico, $info);
    // Si la respuesta deja una pregunta abierta, el aviso la contradice.
    if (strpos($especifico, '?') !== false) return wabot_postdemo_componer($especifico, $info);
    $out = wabot_postdemo_componer($especifico, $info) ?? [];
    $out[] = $aviso;
    return $out;
}

/**
 * Arma la tanda de postdemo: el texto fijo y la info que contesta lo que
 * preguntó. Si el texto fijo termina preguntando ("le cambiarías algo?") va
 * último, para que la charla quede abierta en la pregunta y no en un dato.
 * Devuelve null si no hay nada que decir.
 */
function wabot_postdemo_componer($especifico, $info) {
    $especifico = trim((string)$especifico);
    $info = trim((string)$info);
    if ($especifico === '' && $info === '') return null;
    if ($especifico === '') return [$info];
    if ($info === '') return [$especifico];
    return strpos($especifico, '?') !== false ? [$info, $especifico] : [$especifico, $info];
}

/**
 * Las preguntas de un mensaje de postdemo que el texto fijo NO contesta.
 *
 * Devuelve ['hay' => bool, 'info' => string]: `hay` dice si quedó alguna
 * pregunta afuera del texto fijo; `info` es la respuesta oficial a las que
 * la tienen (mantenimiento, plazos, hosting... y el precio ya cotizado, que
 * en esta fase se repite sin recotizar). Si `hay` y `info` está vacía, la
 * pregunta existe pero solo la puede contestar el agente.
 *
 * Se corta por las mismas junturas que wabot_preguntas_del_mensaje(): en
 * "quiero cambiar el color y saber cuánto cuesta el mantenimiento", la
 * primera parte ES el pedido de cambio (la contesta el texto fijo) y la
 * segunda es la pregunta que se quedaba sin respuesta.
 */
function wabot_postdemo_preguntas_extra($texto, &$conv, $cfg) {
    $crudo = trim(wabot_texto_sin_urls((string)$texto));
    $vacio = ['hay' => false, 'info' => ''];
    if ($crudo === '') return $vacio;

    $partes = preg_split('/[?.;!\n]+|,| y | o | pero | si | tambien | también | ademas | además /iu', $crudo);
    $hay = false; $pidePrecio = false;
    foreach ((array)$partes as $parte) {
        $parte = trim((string)$parte);
        if ($parte === '' || mb_strlen($parte) < 6) continue;
        if (!wabot_mensaje_pregunta_algo($parte)) continue;
        // La pregunta ES el cambio ("se puede cambiar el color?"): el texto
        // fijo de cambios ya la contesta.
        if (wabot_postdemo_pide_cambios($parte)) continue;
        $hay = true;
        $p = wabot_normalizar_frase($parte);
        if (preg_match('/\b(cuanto (sale|cuesta|vale|es|seria|saldria|costaria|me sale)|que precio|el precio|el valor|el costo|cuanto (era|es) el total)\b/u', $p)
            && !preg_match('/\b(por mes|mensual\w*|al mes|mantenimiento|abono\w*|hosting|dominio)\b/u', $p)) {
            $pidePrecio = true;
        }
    }
    if (!$hay) return $vacio;

    $claves = wabot_preguntas_del_mensaje($texto, $conv, 'postdemo');
    if ($pidePrecio && !empty($conv['precio_dado'])) array_unshift($claves, 'precio_actual');
    $yaDichas = (array)($conv['temas_contestados'] ?? []);
    $claves = array_values(array_diff($claves, $yaDichas));
    $info = $claves ? wabot_info_lineas($claves, $conv, $cfg) : '';
    if (trim($info) !== '') {
        $conv['temas_contestados'] = array_values(array_unique(array_merge($yaDichas, $claves)));
        wabot_evento_sesion($conv, 'postdemo_pregunta_contestada', ['temas' => implode(',', $claves)]);
    }
    return ['hay' => true, 'info' => trim($info)];
}

/**
 * Guarda un pedido de cambios sobre la demo en la ficha, una sola vez y con
 * las palabras del cliente. La ÚNICA forma de anotar: la usan el corte de
 * postdemo, el silencio de fase derivado y la herramienta del agente, así
 * "tomo nota de esos cambios" nunca más sale con el campo vacío.
 */
function wabot_cambios_anotar(&$conv, $texto, $origen = 'postdemo') {
    $nuevo = trim((string)$texto);
    if ($nuevo === '') return false;
    $previos = trim((string)($conv['cambios_pedidos'] ?? ''));
    if ($previos !== '' && mb_strpos($previos, $nuevo) !== false) return false;
    $conv['cambios_pedidos'] = $previos === '' ? $nuevo : $previos . ' | ' . $nuevo;
    wabot_evento_sesion($conv, 'cambios_pedidos', ['origen' => $origen]);
    return true;
}

/**
 * Pide avanzar con todas las letras: "cómo sigo", "quiero contratar".
 *
 * wabot_postdemo_quiere_avanzar() también da true con un elogio suelto —es una
 * decisión vieja, con test propio— y eso servía cuando el bot cerraba la venta.
 * Ahora que no la cierra, un "me gustó" merece que le contesten algo mejor que
 * "te paso con Pablo", así que el avance explícito se detecta aparte.
 */
function wabot_postdemo_avance_explicito($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)(
        preg_match('/\bcomo\b.{0,12}\b(sigo|seguimos|sigue|hago|hacemos|arranco|arrancamos|procedo|avanzo|avanzamos|continuo)\b/u', $t)
        || preg_match('/\b(que|cual)\b.{0,15}\b(paso|pasos|siguiente|sigue ahora)\b/u', $t)
        || preg_match('/\b(quiero|queremos|vamos a|listo para)\b.{0,20}\b(avanzar|arrancar|empezar|contratar|seguir|hacerla|comprarla)\b/u', $t)
        || preg_match('/\b(dale|listo|ok|perfecto)\b.{0,20}\b(avanzamos|arrancamos|seguimos|vamos|avancemos)\b/u', $t)
        || preg_match('/\b(como|donde|cuando)\b.{0,15}\b(pago|abono|deposito|transfiero|se paga)\b/u', $t)
        || preg_match('/\b(cuanto|cual)\b.{0,12}\b(senia|sena|deposito|anticipo)\b/u', $t)
        || preg_match('/\b(mandame|pasame|necesito)\b.{0,15}\b(el cbu|los datos|el alias|el link de pago)\b/u', $t)
    );
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

    /* El precio del proyecto combinado no es el del tipo base: si ya derivamos
     * por eso, repetir el número de la lista lo cotiza de menos (W2, 1-sep). */
    if (wabot_texto_pregunta_precio_combinado($texto)) {
        $mixto = trim((string)($cfg['mixto'] ?? ''));
        if ($mixto !== '') {
            $conv['espera_avisada'] = true;
            return [str_replace('{lista}', 'lo que venís pidiendo', $mixto)];
        }
    }

    /* "Pensándolo bien, la quiero para mi otro negocio": con el prediseño ya
     * cerrado eso cambia TODO el boceto, y el bot lo ignoró dos veces seguidas
     * (D10, 1-sep — la demo salió para la cerrajería cuando el cliente pidió
     * la distribuidora). No se rearma acá: se anota donde Pablo lo ve junto al
     * boceto y se le confirma al cliente que quedó tomado. */
    if (preg_match('/\b(en realidad|pensandolo bien|mejor|me confundi|cambio de idea)\b.{0,50}\b(otro negocio|otra empresa|otro emprendimiento|otro rubro|mi otro)\b/u', wabot_normalizar_frase($texto))
        || preg_match('/\b(la|lo) (quiero|necesito) para (mi )?otro (negocio|emprendimiento|rubro|local)\b/u', wabot_normalizar_frase($texto))) {
        $previos = trim((string)($conv['cambios_pedidos'] ?? ''));
        $nuevo = 'CAMBIO DE NEGOCIO: ' . trim((string)$texto);
        if (mb_strpos($previos, $nuevo) === false) {
            $conv['cambios_pedidos'] = $previos === '' ? $nuevo : $previos . ' | ' . $nuevo;
        }
        $conv['handoff_pendiente'] = true;
        wabot_evento_sesion($conv, 'cambio_negocio_post_cierre');
        return [(string)($cfg['postdemo_cambios'] ?? 'Perfecto, tomo nota de esos cambios.')];
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
            elseif ($infoOffline === 'rangos') $out[] = wabot_texto_rangos($cfg);
            elseif ($infoOffline === 'plazos') {
                $out[] = wabot_texto_plazos($conv, $cfg);
                if (wabot_esperando_demo($conv)) $conv['espera_avisada'] = true;
            }
            else $out[] = (string)(wabot_texto_info($infoOffline, $cfg, $conv) ?: $cfg['info']['otra']);
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
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg)
                : ($k === 'rangos' ? wabot_texto_rangos($cfg)
                : ($k === 'plazos' ? wabot_texto_plazos($conv, $cfg) : wabot_texto_info($k, $cfg, $conv)))));
            }
            if (!$lineas) $lineas[] = $cfg['info']['otra'];
            // Si ya se le contestó por el plazo de la demo, ese texto ES el
            // aviso de espera: volver a pegarlo abajo lo repite palabra por
            // palabra en el mismo turno.
            if (in_array('plazos', $keysCerrada, true) && wabot_esperando_demo($conv)) {
                $conv['espera_avisada'] = true;
            }
            $out[] = count($lineas) > 1 ? "- " . implode("\n- ", $lineas) : $lineas[0];
        } elseif ($has('quiere_avanzar') || $has('pide_humano')) {
            // Quiere cerrar. No se deriva de nuevo —ya está derivado— pero es el
            // peor momento para quedarse callado: se le repite quién lo toma.
            $out[] = wabot_texto_espera($conv, $cfg);
        } elseif ($has('objecion_caro')) {
            $out[] = wabot_texto_caro($conv, $cfg);
        } elseif ($has('menciona_plataforma')) {
            $out[] = $cfg['plataformas'];
        } elseif ($acc && !$has('saludo') && !$has('no_interesa') && $conv['espera_avisada']) {
            // Cualquier otra cosa —incluso "y si mejor hago una landing?"— se
            // contesta con el escape al equipo. Callarse ahí parece un cuelgue;
            // el único silencio válido es ante un saludo o un agradecimiento.
            // OJO: la PRIMERA vez que escribe tras el cierre no entra acá —le
            // llega el aviso de espera de más abajo, y mandar los dos juntos es
            // contradictorio: uno dice "escribime lo que sea, te contesto" y el
            // otro "eso no te lo puedo contestar". Pasó con una foto del logo
            // que el clasificador etiquetó como acción sin ser pregunta (caso
            // Denise, 27-ago): el cliente recibió ambos mensajes seguidos.
            $out[] = $cfg['info']['otra'];
        }
    }

    /* La primera vez que vuelve a escribir, se le aclara cómo sigue. Salvo
     * después de la demo: ahí el aviso ya salió y este texto lo repite con
     * otras palabras, que es exactamente de lo que se quejó Pablo (28-ago).
     * A esa altura la duda se contesta y punto. */
    if (!$conv['espera_avisada'] && empty($conv['postdemo_avisado'])) {
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
/**
 * Cuánto falta. Si el prediseño ya está cerrado y la demo todavía no salió, lo
 * que el cliente está esperando es LA DEMO: contestarle los 7 días de la web
 * es contestarle otra cosa (caso Lara, 28-ago: preguntó a qué hora estaría
 * lista y ni siquiera eso, se llevó el aviso de derivación pelado).
 */
function wabot_esperando_demo($conv) {
    return ((($conv['cierre'] ?? '') === 'prediseno') || !empty($conv['lead_creado']))
           && empty($conv['presentado_ts']);
}

function wabot_texto_plazos($conv, $cfg) {
    return wabot_esperando_demo($conv) ? wabot_texto_espera($conv, $cfg) : wabot_texto_info('plazos', $cfg);
}

function wabot_texto_espera($conv, $cfg) {
    // El texto del prediseño promete la demo ("te llega hoy"): solo vale
    // mientras la demo NO haya salido. Después promete algo que ya pasó.
    if (wabot_esperando_demo($conv)) {
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
                'en el chat', 'al principio', 'ya esta arriba',
                // Clínica de Mar (27-ago): "Está todo en lo que te mandé" no
                // matcheaba ninguna de las de arriba —tienen el pronombre
                // pegado al verbo ("te LO mandé")— y el bot siguió pidiendo
                // los datos por partes.
                'esta todo en lo que te mande', 'en lo que te mande',
                'esta todo ahi', 'esta todo arriba', 'ya esta todo',
                'te pase todo', 'ya te pase todo', 'te mande todo', 'ya te mande todo'];
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
                    'excelente', 'ideal', 'si obvio', 'seria buenisimo', 'me gustaria',
                    /* La línea del pitch ahora ofrece contar el próximo paso
                     * ("te cuento cuál sería el próximo paso"), así que la
                     * aceptación más natural pasó a ser "contame" / "te
                     * escucho" — ninguna estaba y la venta se trababa. */
                    'contame', 'contame mas', 'decime', 'te escucho', 'quiero saber',
                    'me sirve si', 'sirve', 'buenisima', 'buena'];
    if (in_array($t, $afirmativas, true)) return true;

    /* Dos afirmativas pegadas: "dale, me sirve" —la respuesta más común a la
     * línea nueva del pitch— normalizaba a "dale me sirve", que no estaba en
     * la lista, y el turno se lo quedaba el modelo, que repitió el precio y
     * dejó la venta sin cerrar (verificado con Gemini el 1-sep). Se prueban
     * los cortes en dos: ambas mitades tienen que ser afirmativas conocidas,
     * así "dale pero no" o "si pero caro" siguen sin entrar. */
    $palabras = explode(' ', $t);
    for ($i = 1; $i < count($palabras); $i++) {
        $izq = implode(' ', array_slice($palabras, 0, $i));
        $der = implode(' ', array_slice($palabras, $i));
        if (in_array($izq, $afirmativas, true) && in_array($der, $afirmativas, true)) return true;
    }
    return false;
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

/**
 * ¿Aceptó la demo? Es la respuesta a la pregunta con la que terminan los tres
 * pasos ("Querés que preparemos la demo para tu negocio?") y lo único que manda
 * el formulario (Pablo, 11-sep).
 *
 * wabot_es_afirmativa() es a propósito una lista cerrada de síes pelados:
 * "Si dale, armenla" no entraba, y el formulario salió igual porque lo mandó el
 * modelo — que con "Vestidos y conjuntos" y "Consultas y vacunación" también lo
 * mandó (V07, V08 y V09 de la batería del 10-sep). Acá entran los síes con un
 * pedido de armarla atrás; NO entra lo que cuenta más del negocio, lo que
 * posterga ni lo que pone un pero.
 *
 * "Si" sin tilde puede ser condicional ("si tengo 50 productos..."): cuenta
 * solo pegado a una coma o seguido de otra aceptación. $permitirPregunta es
 * para el guard de la herramienta: "Sí, cuánto tarda?" acepta Y pregunta.
 */
function wabot_acepta_demo($texto, $permitirPregunta = false) {
    $crudo = trim((string)$texto);
    if ($crudo === '') return false;
    $pregunta = mb_strpos($crudo, '?') !== false;
    if ($pregunta && !$permitirPregunta) return false;
    if (wabot_pidio_demo_explicita($crudo)) return true;
    if (!$pregunta && wabot_es_afirmativa($crudo)) return true;
    if (preg_match('/^(👍|👌|✅|🙌)+$/u', preg_replace('/[\s\x{FE0F}\x{1F3FB}-\x{1F3FF}]+/u', '', $crudo))) return true;

    $t = wabot_normalizar_frase($crudo);
    if ($t === '' || mb_strlen($t) > 80) return false;
    // Lo que posterga o pone un pero no es un sí, venga con "dale" o sin él.
    if (preg_match('/\b(no|nop|todavia|aun no|mas adelante|pensar\w*|pienso|consult\w*|charl\w*|hablarlo|despues|luego|te aviso|te escribo|te confirmo|a ver|lo veo|caro|no puedo|no me alcanza|pero)\b/u', $t)) return false;

    $pedirla = 'arm(a|e)(la|nla|mela|nmela)|haganla|haganmela|hac(e|a)(la|mela)|prepar(a|e)(la|nla|mela|nmela)'
             . '|mand(a|e)(la|nla|mela|melo|me|nme)|pasa(la|mela|melo|me)|el formulario|el link|el enlace|la demo|la muestra'
             . '|avancemos|arranquemos|empecemos|adelante|vamos|quiero verla|me interesa|me encanta|me encantaria|me gustaria|me sirve';
    $siguen = 'dale|ok|oka|okey|okay|bueno|perfecto|genial|de una|obvio|claro|buenisimo|buenisima|joya|barbaro|excelente|listo';

    // "Sí, ..." con coma o punto: como respuesta a la pregunta de la demo, es un sí.
    if (preg_match('/^\s*s[ií]+\s*[,.!]/iu', $crudo)) return true;
    // "si dale armenla", "si porfa", "si quiero": el sí seguido de otra aceptación.
    if (preg_match('/^si+ (' . $siguen . '|porfa|por favor|gracias|' . $pedirla . ')\b/u', $t)) return true;
    if (preg_match('/^(si+ )?quiero( verla| la demo| la muestra| el formulario| el link)?$/u', $t)) return true;
    // "dale armenla", "ok mandame el formulario", "bueno prepárenla".
    if (preg_match('/^(' . $siguen . ')\b/u', $t)) return true;
    // "armenla", "pasame el link", "avancemos".
    return (bool)preg_match('/^(' . $pedirla . ')\b/u', $t);
}

/**
 * ¿Dice que ya completó el formulario? "Ya está todo arriba, fijate" (V07,
 * batería del 10-sep) se llevaba la derivación de wabot_apunta_a_lo_ya_dicho,
 * que es la regla del chat SIN formulario: ahí "está todo en lo que te mandé"
 * significa que los datos están más arriba. Con el link mandado significa otra
 * cosa —que lo llenó— y se contesta mirando si llegó de verdad.
 */
function wabot_dice_que_completo_form($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '' || mb_strlen($t) > 90) return false;
    foreach (['esta todo arriba', 'ya esta todo', 'esta todo ahi', 'ya esta arriba', 'fijate arriba',
              'te pase todo', 'te mande todo', 'en lo que te mande', 'ya esta completo', 'ya esta hecho'] as $f) {
        if (strpos($t, $f) !== false) return true;
    }
    if (preg_match('/\b(ya|recien|listo|ahi)\b.{0,25}\b(complete|llene|cargue|envie|mande|termine|rellene)\b/u', $t)) return true;
    return (bool)preg_match('/\b(formulario|form|link|datos)\b.{0,20}\b(completo|completado|completados|enviado|enviados|mandado|mandados|cargado|cargados|listo)\b/u', $t);
}

/**
 * ¿Está la charla esperando el sí a la demo? Es el turno que sigue a los tres
 * pasos: precio dado, demo ofrecida, formulario activo y el link todavía sin
 * mandar. Sin formulario (form_activo apagado) sigue el flujo de antes, con los
 * datos por chat.
 */
function wabot_espera_si_a_la_demo($conv, $cfg) {
    return !empty($cfg['form_activo']) && ($conv['fase'] ?? '') === 'prediseno'
        && !empty($conv['precio_dado']) && !empty($conv['cta_muestra'])
        && empty($conv['link_form_enviado']) && empty($conv['lead_creado'])
        && empty($conv['form_completado_ts']) && empty($conv['presentado_ts'])
        && !(array)($conv['prediseno_pedido'] ?? []);
}

/** Lo que cuenta de su negocio sin contestar si quiere la demo: se toma y se vuelve a preguntar. */
function wabot_tres_pasos_repregunta_texto() {
    return 'Dale, lo tenemos en cuenta para tu web. Querés que te preparemos la demo gratis?';
}

/** "Sí, quiero la demo" con el link ya mandado: se le recuerda dónde está, sin repetir el mismo texto. */
function wabot_form_recordatorio_texto() {
    return "Dale, la demo sale del formulario que te pasé:\n{link}\n"
         . 'Si algo no te anda, mandame por acá el nombre del negocio y los colores que te gustan y la armamos igual.';
}

function wabot_form_no_llego_texto() {
    return "Todavía no me llegó el formulario. Fijate que al final hayas tocado Enviar:\n{link}\n"
         . 'Si te trabó, mandame por acá el nombre del negocio y los colores que te gustan y la armamos igual.';
}

function wabot_form_ya_recibido_texto() {
    return 'Sí, ya lo tengo: la demo te llega {entrega}.';
}

/**
 * Lo que el cliente escribe con el link del formulario ya mandado y el
 * formulario todavía sin llegar, más el "ya lo completé" con el formulario ya
 * recibido. Determinista y en el borde común, antes del agente y del motor,
 * porque en la batería del 10-sep los tres casos salieron mal por caminos
 * distintos (Pablo, 11-sep: "corregir cuándo manda el formulario y cuándo
 * deriva"):
 *  - "Sí, quiero la muestra gratis" (V08) volvía a generar el MISMO texto del
 *    formulario, el anti-repetición lo leía como bot trabado y derivaba.
 *  - "Malena - IndumentariaMale - negro y dorado" (V08): la lista posicional
 *    lo leyó bien, pero la charla ya estaba derivada y el lead nunca se creó.
 *  - "Ya está todo arriba, fijate" (V07) derivaba por "está todo en lo que te
 *    mandé", sin mirar si el formulario había llegado.
 * Devuelve null cuando no le toca: una pregunta o cualquier otra cosa sigue
 * al agente o al motor como siempre.
 */
function wabot_form_enviado_responder($texto, &$conv, $cfg) {
    // El formulario ya llegó: "ya lo completé, fijate" se confirma una vez.
    if ((int)($conv['form_completado_ts'] ?? 0) > 0) {
        if (!wabot_dice_que_completo_form($texto) || mb_strpos((string)$texto, '?') !== false) return null;
        if (!empty($conv['form_recibido_confirmado'])) return [];
        $conv['form_recibido_confirmado'] = true;
        return [wabot_personalizar(wabot_form_ya_recibido_texto(), $conv)];
    }
    if (empty($conv['link_form_enviado']) || !empty($conv['lead_creado'])) return null;
    if (($conv['fase'] ?? '') !== 'prediseno') return null;

    /* Mandó los datos por chat en vez de llenar el formulario (pasa seguido y
     * no está mal): con el negocio y los colores alcanza, la descripción sale
     * de lo que ya contó. La referencia no se pide: el formulario tampoco la
     * exige. Mismo cierre que el prediseño por chat de siempre, con su lead. */
    $negocio = trim((string)($conv['nombre_negocio'] ?? ''));
    $colores = trim((string)($conv['colores'] ?? ''));
    $pregunta = mb_strpos((string)$texto, '?') !== false;
    // Una pregunta se contesta primero: cerrar encima la dejaría sin respuesta.
    if ($negocio !== '' && $colores !== '' && !$pregunta) {
        if (wabot_descripcion_generica((string)($conv['descripcion'] ?? ''))) {
            $desdeCharla = wabot_descripcion_desde_contexto($conv);
            if ($desdeCharla !== '') $conv['descripcion'] = $desdeCharla;
        }
        $conv['origen_prediseno'] = ($conv['origen_prediseno'] ?? '') ?: 'chat';
        $conv['referencia_preguntada'] = true;
        wabot_evento_sesion($conv, 'prediseno_datos_por_chat', ['con_link' => true]);
        return wabot_cerrar_o_pedir_whatsapp($conv, $cfg);
    }

    // Dice que ya lo llenó: se mira si llegó. La segunda vez algo anda mal con
    // el formulario, y eso lo tiene que ver una persona.
    if (wabot_dice_que_completo_form($texto) && mb_strpos((string)$texto, '?') === false) {
        $avisos = (int)($conv['form_no_llego_avisos'] ?? 0);
        $conv['form_no_llego_avisos'] = $avisos + 1;
        if ($avisos >= 1) {
            wabot_evento_sesion($conv, 'form_no_llega');
            return wabot_derivar($conv, $cfg, 'form_no_llega');
        }
        $link = wabot_form_link($conv, $cfg);
        if ($link === '') return null;
        wabot_evento_sesion($conv, 'form_no_llego_avisado');
        return [str_replace('{link}', $link, wabot_form_no_llego_texto())];
    }

    // Vuelve a decir que sí, o pide el link de nuevo: dónde está, una vez.
    if (wabot_acepta_demo($texto) || (function_exists('wabot_pide_repetir') && wabot_pide_repetir($texto))) {
        if (!empty($conv['form_recordatorio_enviado'])) return [];
        $link = wabot_form_link($conv, $cfg);
        if ($link === '') return null;
        $conv['form_recordatorio_enviado'] = true;
        wabot_evento_sesion($conv, 'form_recordado');
        return [str_replace('{link}', $link, wabot_form_recordatorio_texto())];
    }
    return null;
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
