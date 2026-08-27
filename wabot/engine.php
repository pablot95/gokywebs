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
    if (preg_match('/\b(sesion\w*|terapia\w*|consulta\w*|tratamiento\w*|atencion|turno\w*|lectura\w*|sanacion\w*'
        . '|masaje\w*|clase\w* particular\w*|asesoria\w*|acompanamiento\w*)\b/u', $t)) $ejes['servicios'] = 'tus servicios';
    if (preg_match('/\b(curso\w*|taller\w*|capacitacion\w*|formacion\w*|diplomatura\w*|seminario\w*|alumno\w*'
        . '|cuadernillo\w*|ebook\w*|e book|clases grabadas|material descargable)\b/u', $t)) $ejes['cursos'] = 'los cursos o materiales';
    if (preg_match('/\b(producto\w*|vender\w*|venta\w*|tienda|mercaderia|articulo\w*|stock'
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
    return $t !== '' && (bool)preg_match('/\b(cortinas?|toldos?|aberturas?|muebles? a medida|carpinteria|herrerias?|cerramientos?|amoblamientos?|mesadas?|mamparas?'
        . '|rejas?|portones?|placares?|vestidores?|pergolas?|decks?|barandas?|mosquiteros?|escaleras? a medida)\b/u', $t);
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
    if (wabot_texto_es_elogio($t) || wabot_texto_mira_la_demo($t)) return null;

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
        if (preg_match($gratis, (string)$m)) continue;
        $aclaracion = trim((string)($cfg['demo_es_gratis'] ?? ''));
        if ($aclaracion === '') continue;
        $mensajes[$i] = rtrim((string)$m) . ' ' . $aclaracion;
    }
    return $mensajes;
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
function wabot_texto_no_es_consulta($texto) {
    $crudo = (string)$texto;
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
function wabot_pidio_demo_explicita($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;
    return (bool)preg_match(
        '/\b(quiero (mi|la|una) (demo|muestra)|(demo|muestra) gratis (para|de) mi|quiero ver (mi|la|una) (demo|muestra)'
        . '|me interesa (la|esa) (demo|muestra)|armame (la|una) (demo|muestra)|haganme (la|una) (demo|muestra)|quiero (la|esa) (demo|muestra))\b/u', $t);
}

function wabot_contexto_es_mayorista($contexto) {
    $t = wabot_normalizar_frase($contexto);
    return (bool)preg_match(
        '/\bmayorista\w*\b|\bal por mayor\b|\bb2b\b'
        . '|\bvend\w*\b.{0,25}\b(solo|solamente|unicamente)\b.{0,25}\b(comercios?|negocios?|kioscos?|almacenes|revendedores?|locales)\b'
        . '|\bno\b.{0,20}\bal publico\b/u', $t);
}

function wabot_contexto_es_salud($contexto) {
    $t = wabot_normalizar_frase($contexto);
    return (bool)preg_match(
        '/\b(psicolog\w*|psiquiatr\w*|nutricionista|nutricion\w*|kinesiolog\w*|fonoaudiolog\w*|dermatolog\w*'
        . '|odontolog\w*|dentista|terapeuta|terapia\w*|consultorio\w*|medic[ao]|medicina|paciente\w*|fisioterap\w*'
        . '|psicopedagog\w*)\b/u', $t);
}

function wabot_contexto_es_alojamiento($contexto) {
    $t = wabot_normalizar_frase($contexto);
    return (bool)preg_match(
        '/\b(cabana\w*|hotel\w*|hosteria\w*|hostal\w*|hostel\w*|posada\w*|complejo\w*|glamping|camping'
        . '|alquiler\w* temporar\w*|apart\b|apart hotel|casa de campo|quinta\w*|estadia\w*|huespedes'
        . '|airbnb|booking|departamentos?\s+(en\s+)?alquiler|alquilo?\s+departamentos?)\b/u', $t);
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
    );
}

function wabot_salida_ya_pregunta($out) {
    foreach ((array)$out as $texto) {
        if (strpos((string)$texto, '?') !== false) return true;
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

function wabot_contexto_tiene_cantidad_unidades($contexto) {
    $t = wabot_normalizar_frase($contexto);
    return (bool)preg_match(
        '/\b\d+\s*(habitacion\w*|cabana\w*|unidad\w*|departamento\w*|dormis|camas?|suites?|bungalow\w*'
        . '|casas?|cuartos?|plazas?)\b/u', $t);
}

/**
 * Qué texto usar para el desempate de turnos. A un complejo de cabañas no se
 * le pregunta por "sacar el turno eligiendo día y horario": el rubro habla de
 * reservas, fechas y disponibilidad (caso Recanto del Paraná, 21-ago).
 */
function wabot_clave_desempate_turnos($contexto, $cfg) {
    $esAlojamiento = wabot_contexto_es_alojamiento($contexto);
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

    /* "agente", "operador", "representante" y "encargado" son las palabras que
     * usa el que quiere dejar de hablar con el bot, tanto como "persona".
     * Faltaban: "Se puede hablar con un agente" quedó sin reconocer y el bot
     * siguió pidiéndole los colores de la marca (27-ago). Ignorar un pedido de
     * humano es la falla más cara que puede tener el bot. */
    $humano = '(persona|humano|asesor|alguien|pablo|vendedor|agente|operador|representante|encargado|responsable|desarrollador)';
    if (preg_match('/\b(quiero|queria|quisiera|necesito|puedo|podria|podrias|podes|se puede|quiero que me)\b.{0,35}\b(hablar|comunicar|atender|llamar|pasar)\b.{0,35}\b' . $humano . '\b/u', $t)
        || preg_match('/\b(pasame|derivame|comunicate)\b.{0,25}\b' . $humano . '\b/u', $t)
        || preg_match('/\bme\s+(pasas|derivas|comunicas)\b.{0,25}\b' . $humano . '\b/u', $t)
        || preg_match('/\b(hablar|comunicarme|contactarme)\s+con\s+(un[ao]?\s+)?' . $humano . '\b/u', $t)
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
    if ($cierre !== null) return wabot_cerrar_sin_presion($conv, $cfg, $cierre);

    $faseActual = $conv['fase'] ?? 'nuevo';
    if (!in_array($faseActual, ['nuevo', 'menu', 'algo_diferente'], true)) {
        $infoFase = wabot_info_por_palabras($texto, $faseActual);
        if ($infoFase !== null) {
            if ($infoFase === 'precio_actual') return [wabot_precio_resumen($conv, $cfg)];
            if ($infoFase === 'mantenimiento') return [wabot_texto_mantenimiento($conv, $cfg)];
            if ($infoFase === 'pago') return [wabot_texto_pago($conv, $cfg)];
            if ($infoFase === 'hosting') return [wabot_texto_hosting($conv, $cfg)];
            if ($infoFase === 'rangos') return [wabot_texto_rangos($cfg)];
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
                if ($infoLocal === 'rangos') return [wabot_texto_rangos($cfg)];
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
            $rNuevoFallback = wabot_fallback_rubro_local($texto);
            if ($rNuevoFallback !== null && $rNuevoFallback !== $conv['tipo']) {
                $desempateFallback = wabot_desempate_de($rNuevoFallback);
                if ($desempateFallback !== null) {
                    $conv['tipo'] = null;
                    $conv['fase'] = $desempateFallback[0];
                    wabot_handoff_aclaracion_resuelta($conv);
                    $claveTextoFallback = $desempateFallback[0] === 'desempate_turnos'
                        ? wabot_clave_desempate_turnos($texto, $cfg) : $desempateFallback[1];
                    return [$cfg[$claveTextoFallback]];
                }
                $conv['tipo'] = $rNuevoFallback;
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
    if (wabot_pidio_institucional_explicito($t)) return 'institucional';
    $mencionaCursos = (bool)preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases|taller|talleres)\b/u', $t);
    if (!$mencionaCursos
        && (preg_match('/\b(ecommerce|e commerce|tienda online|carrito|cobro online|cobrar online)\b/u', $t)
            || preg_match('/\bvender\b.{0,30}\b(online|por internet|desde la web|por la web)\b/u', $t))) {
        return 'ecommerce';
    }
    if (wabot_contexto_es_hibrido($t)) return 'hibrido_pendiente';
    if (preg_match('/\b(peluqueria|barberia|estetica|esteticista|spa|masajes|unas|manicura|depilacion|tatuajes|consultorio|odontologia|psicologia|nutricionista|kinesiologo|kinesiologa|kinesiologia|fonoaudiologia|fonoaudiologa|dermatologia|dermatologa|dermatologo|cosmiatra|podologia|podologa|veterinaria|gimnasio|pilates|yoga|canchas|cabanas|hotel|taller mecanico)\b/u', $t)) {
        return 'turnos_pendiente';
    }
    if (preg_match('/\b(ong|fundacion|asociacion civil|sin fines de lucro)\b/u', $t)
        && !preg_match('/\b(vender|vendemos|vendo|cobrar|cobramos|arancel|aranceles|matricula|pagas?|pagos)\b/u', $t)) {
        return 'landing';
    }
    if (preg_match('/\b(curso|cursos|capacitacion|capacitaciones|clases online)\b/u', $t)
        || preg_match('/\b(doy|dicto|damos|dictamos)\b.{0,15}\btaller(es)?\b/u', $t)) return 'cursos';
    // netbooks, notebooks, celulares y consolas salieron el 27-ago ("Para
    // Netbooks", "Y celulares todo usados") y ninguna estaba en la lista: el
    // cliente contestó dos veces y recibió la misma pregunta las dos.
    if (preg_match('/\b(mates?|velas|ropa|zapatillas?|calzados?|productos|mercaderia|muebles|articulos|ferreteria|kiosco|dietetica|bazar|vivero|panaderia|pet shop|repuestos|local|imprenta|grafica|cajas|packaging|envases|libreria|jugueteria|carniceria|verduleria|fabricamos|indumentaria|marroquineria|cosmetica|perfumeria'
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
            if ($infoCerrado === 'rangos') return [wabot_texto_rangos($cfg)];
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
        if (!$keys) $keys = ['otra'];
        // En un desempate el precio ya está acotado a dos opciones: se dicen las
        // dos en vez del rango genérico, que además remata pidiendo el rubro
        // que el cliente acaba de decir (caso pediatría, 27-ago).
        $preciosDesempate = (in_array('rangos', $keys, true) || in_array('precio_sin_rubro', $keys, true))
            ? wabot_desempate_precios_texto($conv['fase'], $cfg) : null;

        $lineas = [];
        foreach ($keys as $k) {
            if ($k === 'precio_actual') { $lineas[] = wabot_precio_resumen($conv, $cfg); continue; }
            if ($preciosDesempate !== null && in_array($k, ['rangos', 'precio_sin_rubro'], true)) {
                $lineas[] = $preciosDesempate;
                continue;
            }
            if (!isset($cfg['info'][$k])) continue;
            $lineas[] = $k === 'mantenimiento' ? wabot_texto_mantenimiento($conv, $cfg)
                : ($k === 'pago' ? wabot_texto_pago($conv, $cfg)
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg)
                : ($k === 'rangos' ? wabot_texto_rangos($cfg) : wabot_texto_info($k, $cfg))));
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
                'cursos' => 'rubro_cursos', 'turnos_pendiente' => 'servicio_con_turnos',
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
            // Salvaguarda: en el uso normal esta fase nunca llega hasta acá,
            // wabot_responder() (redactor.php) corta antes con el mensaje fijo
            // de derivación. Si por lo que sea llega, se comporta igual: UN
            // solo mensaje, ignorando lo que se haya acumulado en $out más
            // arriba (por ejemplo, una respuesta de precio ante una palabra
            // suelta de pago).
            $conv['presentado_confirmado'] = true;
            return wabot_derivar_postdemo($conv, $cfg);

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
            if ($rNuevoPitch !== null && $rNuevoPitch !== ($conv['tipo'] ?? '')) {
                $desempateNuevo = wabot_desempate_de($rNuevoPitch);
                if ($desempateNuevo !== null) {
                    $conv['tipo'] = null;
                    $conv['fase'] = $desempateNuevo[0];
                    wabot_handoff_aclaracion_resuelta($conv);
                    $claveTexto = $desempateNuevo[0] === 'desempate_turnos'
                        ? wabot_clave_desempate_turnos($texto, $cfg) : $desempateNuevo[1];
                    return array_merge($out, [$cfg[$claveTexto]]);
                }
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
    if (preg_match('/\b(hasta cuando|por cuanto tiempo|cuanto tiempo|cuantos dias|se vence|vence|caduca|se cae|se borra|sigue disponible|va a estar disponible|expira)\b.{0,30}\b(demo|muestra|link|pagina de prueba)\b/u', $t)
        || preg_match('/\b(demo|muestra|link)\b.{0,30}\b(hasta cuando|por cuanto tiempo|cuantos dias|se vence|vence|caduca|se borra|expira|sigue disponible|va a estar disponible)\b/u', $t)) return 'demo_vigencia';
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
    if (preg_match('/\b(formulari\w*|formulaio\w*|encuesta\w*|encuenta\w*|encusta\w*|cuestionario\w*|planillas? para (llenar|completar))\b/u', $t)) return 'formularios';
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
    // "Preciop" al final del mensaje es "precio" con el dedo resbalado: la
    // palabra suelta pidiendo el valor (con hasta dos letras de yapa) cuenta.
    if (preg_match('/\b(cuanto (sale|cuesta|esta|vale|saldria|seria)|que precio|que valor|cual (es|era) el precio|precio total|el precio final|precio tiene|valor tiene)\b/u', $t)
        || preg_match('/\bprecio\w{0,2}\s*$/u', $t)) {
        // 'prediseno'/'prediseno_ref'/'prediseno_wsp' entran acá también: el
        // precio y la propuesta del prediseño salen juntos en el mismo turno
        // (wabot_precio()), así que la fase ya pasó a prediseno desde el
        // mensaje del precio, no recién cuando el cliente confirma.
        if (in_array($fase, ['precio', 'prediseno', 'prediseno_ref', 'prediseno_wsp', 'confirma_cambio', 'derivado', 'postdemo'], true)) return 'precio_actual';
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
    if ($fase === 'desempate_turnos' && (bool)(
        preg_match('/\bno\b\s+(quiero|queremos|quiere|queres|quieren|hace falta)\b.{0,15}\bque\b.{0,20}\b(reserven|reserve|reserva|reservas|saquen|elijan|elijas)\b/u', $t)
        || preg_match('/\bno\b\s+(quiero|queremos|quiere|queres|quieren)\b.{0,20}\b(reserven|reserva|reservas|reservar|solos|online)\b/u', $t)
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
                'mostrar trabajos', 'mostrar los trabajos', 'mostrar el trabajo', 'mostrar nuestros trabajos',
                'mostrar mis trabajos', 'trabajos realizados', 'trabajos que hice', 'trabajos hechos',
                'portfolio', 'portafolio', 'obras', 'mostrar lo que hacemos',
            ])) return 'hibrido_trabajos';
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
                'reserven', 'reservar', 'reserva', 'reservas', 'saquen', 'sacar turno', 'saquen turno', 'agenda', 'calendario',
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
        $precio = trim((string)($cfg['tipos'][$tipo]['precio'] ?? ''));
        if ($precio === '') return null;   // sin los dos precios no se dice ninguno
        $lineas[] = ucfirst($condicion) . ', ' . $precio . '.';
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

    if ($tipoActual === 'ecommerce'
        && preg_match('/\b(sin carrito|sin cobro online|sin pagos online|sin vender online|nada de carrito)\b/u', $t)) {
        return 'catalogo';
    }
    if ($tipoActual === 'catalogo'
        && preg_match('/\b(con carrito|cobro online|pagos online|vender online|que compren)\b/u', $t)) {
        return 'ecommerce';
    }
    if ($tipoActual === 'turnos'
        && preg_match('/\b(sin reserva|sin turnos online|lo agendo yo|los agendo yo|coordino yo|sin que reserven)\b/u', $t)) {
        return 'landing';
    }
    return null;
}

/** El texto de la comparación real: la modalidad sin la función y la que ya tiene cotizada. */
function wabot_comparacion_tipo_texto($alterno, $conv, $cfg) {
    if ($alterno === 'ecommerce' && isset($cfg['tipos']['catalogo']) && isset($cfg['tipos']['ecommerce'])) {
        $c = wabot_catalogo_config($cfg);
        return 'Sin carrito sería la modalidad catálogo: ' . wabot_moneda($c['base'])
            . ' de desarrollo más ' . wabot_moneda($c['por_producto'])
            . ' por cada producto que cargues, y el cliente cierra la compra por WhatsApp en vez de pagar en la web.'
            . "\n\nCon carrito y pagos online es lo que ya tenés cotizado: " . (string)($cfg['tipos']['ecommerce']['precio'] ?? '');
    }
    if ($alterno === 'turnos' && isset($cfg['tipos']['landing']) && isset($cfg['tipos']['turnos'])) {
        return 'Sin reserva automática sería una landing común, donde te escriben por WhatsApp y coordinás vos: '
            . (string)($cfg['tipos']['landing']['precio'] ?? '')
            . '.' . "\n\nCon reserva automática es lo que ya tenés cotizado: " . (string)($cfg['tipos']['turnos']['precio'] ?? '');
    }
    return null;
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
    $planes = $cfg['mantenimiento_planes'] ?? [];
    $base   = (string)($cfg['info']['mantenimiento'] ?? '');

    if (empty($conv['tipo'])) {
        $l = $planes['landing'] ?? null;
        $o = $planes['otros'] ?? null;
        $ambos = trim((string)($cfg['info']['mantenimiento_ambos'] ?? ''));
        if ($l && $o && $ambos !== '') {
            return str_replace(
                ['{precio_landing}', '{link_landing}', '{precio_otros}', '{link_otros}'],
                [$l['precio'], $l['link'], $o['precio'], $o['link']],
                $ambos
            );
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

function wabot_texto_rangos($cfg) {
    $precios = [];
    foreach ((array)($cfg['tipos'] ?? []) as $tipo => $d) {
        if (!preg_match('/\$[\d.]+/u', (string)($d['precio'] ?? ''), $m)) continue;
        $monto = wabot_monto_a_numero($m[0]);
        if ($monto <= 0) continue;
        $precios[] = ['monto' => $monto, 'texto' => $m[0], 'label' => mb_strtolower((string)($d['label'] ?? $tipo))];
    }
    if (!$precios) return trim((string)($cfg['info']['rangos'] ?? $cfg['info']['otra'] ?? ''));
    usort($precios, function ($a, $b) { return $a['monto'] <=> $b['monto']; });
    $min = $precios[0];
    $max = end($precios);
    $labelsMax = array_unique(array_map(function ($p) { return $p['label']; },
        array_filter($precios, function ($p) use ($max) { return $p['monto'] === $max['monto']; })));
    return "Los desarrollos van desde {$min['texto']} ({$min['label']}) hasta {$max['texto']} ("
        . implode(' o ', $labelsMax) . "), según lo que necesites. Contame a qué te dedicás y te confirmo el precio exacto en un mensaje.";
}

function wabot_texto_pago_generico($cfg) {
    $grupos = [];
    foreach ((array)($cfg['tipos'] ?? []) as $tipo => $d) {
        $sena = trim((string)($d['sena'] ?? ''));
        if ($sena === '') continue;
        $grupos[$sena][] = mb_strtolower((string)($d['label'] ?? $tipo));
    }
    if (!$grupos) return trim((string)($cfg['info']['pago_generico'] ?? ''));
    uksort($grupos, function ($a, $b) { return wabot_monto_a_numero($a) <=> wabot_monto_a_numero($b); });
    $partes = [];
    foreach ($grupos as $sena => $labels) {
        $lista = count($labels) > 1
            ? implode(', ', array_slice($labels, 0, -1)) . ' y ' . end($labels)
            : $labels[0];
        $partes[] = "$sena en $lista";
    }
    return 'Se puede abonar por transferencia o con tarjeta, en un pago o hasta en 12 cuotas con interés. Para arrancar se deja una seña ('
        . implode(', ', $partes) . ') y el saldo al entregar la web.';
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
    if ($sena === '') {
        $generico = wabot_texto_pago_generico($cfg);
        if ($generico !== '') return $generico;
        return 'Se puede abonar por transferencia o con tarjeta hasta en 12 cuotas con interés. Para arrancar se deja una seña y el saldo al entregar la web.';
    }
    if (empty($conv['precio_dado'])) {
        $sinPrecio = trim((string)($cfg['info']['pago_sin_precio'] ?? ''));
        if ($sinPrecio === '') return wabot_texto_pago_generico($cfg);
        return str_replace('{sena}', $sena, $sinPrecio);
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
    $variantes = array_values(array_filter((array)($cfg[$claveVariantes] ?? []), function ($v) {
        return is_string($v) && trim($v) !== '';
    }));
    if (!$variantes) return $base;
    $semilla = wabot_conversation_key($conv) . '|' . (string)($conv['session_id'] ?? '') . '|' . $clave;
    $indice = hexdec(substr(hash('sha256', $semilla), 0, 8)) % count($variantes);
    return $variantes[$indice];
}

function wabot_tipo_variante($tipo, $campo, $conv, $cfg) {
    $t = $cfg['tipos'][$tipo] ?? [];
    $base = trim((string)($t[$campo] ?? ''));
    $variantes = array_values(array_filter((array)($t[$campo . '_variantes'] ?? []), function ($v) {
        return is_string($v) && trim($v) !== '';
    }));
    if (!$variantes) return $base;
    $semilla = wabot_conversation_key($conv) . '|' . (string)($conv['session_id'] ?? '') . '|' . $tipo . '|' . $campo;
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

/** La seña que corresponde al tipo cotizado, ya formateada. */
function wabot_sena_de($conv, $cfg) {
    $tipo = (string)($conv['tipo'] ?? '');
    return trim((string)($cfg['tipos'][$tipo]['sena'] ?? ''));
}

function wabot_postdemo_transferencia($conv, $cfg) {
    $sena = wabot_sena_de($conv, $cfg);
    if ($sena === '') return wabot_texto_pago_generico($cfg);
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
        return wabot_texto_rangos($cfg);
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
function wabot_pitch_pregunta_texto($tipo, $conv, $cfg) {
    $contexto = wabot_contexto_cliente_texto($conv);
    $variante = null;
    if ($tipo === 'turnos' && wabot_contexto_es_alojamiento($contexto)) $variante = 'alojamiento';
    elseif ($tipo === 'turnos' && wabot_contexto_es_salud($contexto)) $variante = 'salud';
    if ($tipo === 'ecommerce' && wabot_contexto_es_mayorista($contexto)) $variante = 'mayorista';

    $ultimoMsg = trim((string)wabot_ultimo_texto_cliente($conv));
    $respuestaEspecifica = !wabot_es_acuse($ultimoMsg) && !wabot_es_negativa($ultimoMsg)
        && wabot_frase_tiene_contenido_especifico($ultimoMsg);
    $yaConto = (mb_strlen(trim((string)($conv['descripcion'] ?? ''))) >= 25
               && !wabot_descripcion_generica((string)($conv['descripcion'] ?? '')))
               || $respuestaEspecifica;
    $sufijo = $yaConto ? '_2' : '';

    $campoPregunta = null;
    if ($variante === 'alojamiento') {
        $campoPregunta = wabot_contexto_tiene_cantidad_unidades($contexto)
            ? 'pitch_pregunta_2_alojamiento'
            : 'pitch_pregunta_alojamiento';
    } elseif ($variante !== null) {
        $campoPregunta = 'pitch_pregunta' . $sufijo . '_' . $variante;
    }
    $pregunta = $campoPregunta !== null ? wabot_tipo_variante($tipo, $campoPregunta, $conv, $cfg) : '';
    if ($pregunta === '') $pregunta = wabot_tipo_variante($tipo, 'pitch_pregunta' . $sufijo, $conv, $cfg);
    if ($pregunta === '') $pregunta = wabot_tipo_variante($tipo, 'pitch_pregunta', $conv, $cfg);
    return trim($pregunta);
}

/**
 * El desc + la pregunta juntos en un solo texto, vía {desc}/{pregunta} de
 * msg_pitch. Solo lo sigue usando catálogo: ahí la "pregunta del pitch" ES la
 * cantidad de productos, y sin ese dato no hay precio que dar todavía, así
 * que no puede separarse en precio+pregunta como el resto de los tipos.
 */
function wabot_pitch_texto($tipo, $conv, $cfg) {
    $contexto = wabot_contexto_cliente_texto($conv);
    $variante = null;
    if ($tipo === 'turnos' && wabot_contexto_es_alojamiento($contexto)) $variante = 'alojamiento';
    elseif ($tipo === 'turnos' && wabot_contexto_es_salud($contexto)) $variante = 'salud';
    if ($tipo === 'ecommerce' && wabot_contexto_es_mayorista($contexto)) $variante = 'mayorista';

    $campoDesc = $variante !== null ? 'desc_' . $variante : 'desc';
    $desc = wabot_tipo_variante($tipo, $campoDesc, $conv, $cfg);
    if ($desc === '' && $variante !== null) $desc = wabot_tipo_variante($tipo, 'desc', $conv, $cfg);
    if ($desc === '') $desc = 'tu web a medida, diseñada para tu negocio';

    $pregunta = wabot_pitch_pregunta_texto($tipo, $conv, $cfg);

    $base = wabot_plantilla_variante('msg_pitch', 'msg_pitch_variantes', $conv, $cfg);
    return trim(str_replace(['{desc}', '{pregunta}'], [$desc, $pregunta], $base));
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
    if ($fijo !== '') {
        return str_replace('{precio}', (string)($cfg['tipos'][$tipo]['precio'] ?? ''), $fijo);
    }
    return wabot_msg_precio_texto($tipo, $cfg, $conv);
}

function wabot_pitch_corresponde($tipo, $conv, $cfg) {
    if (empty($cfg['pitch_activo'])) return false;
    if (!empty($conv['pitch_hecho']) || !empty($conv['precio_dado'])) return false;
    if (!empty($conv['demo_pedida_entrada'])) return false;
    if (!empty($conv['pidio_precio'])) return false;
    if (wabot_texto_pide_precio(wabot_ultimo_texto_cliente($conv))) return false;
    return trim((string)($cfg['tipos'][$tipo]['pitch_pregunta'] ?? '')) !== '';
}

/**
 * Catálogo sigue con la pregunta sola (sin precio: depende de la cantidad).
 * El resto de los tipos ya tiene un precio fijo que no depende de nada, así
 * que sale en este mismo turno junto con la pregunta del pitch —dos mensajes
 * separados, el segundo llega aparte unos segundos después (ver 'aparte' en
 * agente.php)— en vez de esperar a que conteste para recién ahí cotizar.
 */
function wabot_pitch($tipo, &$conv, $cfg) {
    $conv['tipo'] = $tipo;
    wabot_handoff_aclaracion_resuelta($conv);

    if ($tipo === 'catalogo') {
        $conv['fase'] = 'pitch';
        $conv['pitch_hecho'] = true;
        $conv['pitch_tipo'] = $tipo;
        wabot_evento_sesion($conv, 'pitch_dado', ['tipo' => $tipo]);
        return [wabot_pitch_texto($tipo, $conv, $cfg)];
    }

    $precioTexto = wabot_pitch_precio_texto($tipo, $cfg, $conv);
    $conv['pitch_hecho'] = true;
    $conv['pitch_tipo'] = $tipo;
    $conv['precio_dado'] = true;
    // Fase 'pitch', no 'precio': lo que falta es la respuesta a la pregunta
    // del pitch, y esa respuesta la termina de procesar el case 'pitch' del
    // switch de wabot_engine() (llama a wabot_precio() de nuevo, que ya sabe
    // que acá solo falta ofrecer la demo). 'precio' es una fase distinta, con
    // su propio manejo de objeciones/dudas — no la de esperar el pitch.
    $conv['fase'] = 'pitch';
    wabot_evento_sesion($conv, 'pitch_dado', ['tipo' => $tipo]);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);
    $pregunta = wabot_pitch_pregunta_texto($tipo, $conv, $cfg);
    return [$precioTexto, $pregunta];
}

function wabot_precio($tipo, &$conv, $cfg) {
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
    if (empty($conv['mixto_avisado']) && $tipo !== 'institucional') {
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
        return [wabot_plantilla_variante('msg_prediseno_oferta', 'msg_prediseno_oferta_variantes', $conv, $cfg)];
    }

    $conv['tipo'] = $tipo;
    $conv['fase'] = 'precio';
    $conv['precio_dado'] = true;
    wabot_handoff_aclaracion_resuelta($conv);
    wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);

    // Esto solo se llega a pisar cuando el pitch nunca corrió para este tipo
    // (pidió el precio directo, o pitch_activo está apagado): ahí el precio y
    // la propuesta de la demo van juntos en el mismo turno, como siempre.
    $out = [wabot_msg_precio_texto($tipo, $cfg, $conv)];
    $conv['fase'] = 'prediseno';
    $conv['cta_muestra'] = true;
    // "Ofrecida", no "aceptada": todavía no sabemos si el cliente la quiere,
    // recién se la estamos por mandar. "Aceptada" se sigue marcando aparte,
    // cuando de verdad hay una señal de que la quiere (completa el form,
    // contesta con sus datos, dice que sí).
    $origenEvento = !empty($conv['demo_pedida_entrada']) ? 'pedida_de_entrada' : 'precio';
    wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => $origenEvento]);
    $out[] = wabot_prediseno_texto($conv, $cfg);
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
                ['{desc}', '{cantidad}', '{total}', '{base}', '{unitario}', '{productos}', '{link}', '{sena}'],
                [$desc, $d['cantidad'], wabot_moneda($d['total']), wabot_moneda($d['base']),
                  wabot_moneda($d['unitario']), wabot_moneda($d['productos']), $t['link'], (string)($t['sena'] ?? '')],
                $plantilla
            );
        }
    }

    $plantilla = $trasPitch && trim((string)($cfg['msg_precio_tras_pitch'] ?? '')) !== ''
        ? (is_array($conv)
            ? wabot_plantilla_variante('msg_precio_tras_pitch', 'msg_precio_tras_pitch_variantes', $conv, $cfg)
            : (string)$cfg['msg_precio_tras_pitch'])
        : (is_array($conv)
            ? wabot_plantilla_variante('msg_precio', 'msg_precio_variantes', $conv, $cfg)
            : (string)$cfg['msg_precio']);
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

/* Igual que wabot_derivar(), pero con el mensaje fijo de la parte 2 (después
 * de presentar la demo): "el desarrollo lo sigue Pablo", no el genérico. */
function wabot_derivar_postdemo(&$conv, $cfg) {
    wabot_handoff_marcar($conv, 'postdemo_respuesta');
    return [(string)$cfg['postdemo_derivar']];
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
            elseif ($infoOffline === 'rangos') $out[] = wabot_texto_rangos($cfg);
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
                : ($k === 'hosting' ? wabot_texto_hosting($conv, $cfg)
                : ($k === 'rangos' ? wabot_texto_rangos($cfg) : $cfg['info'][$k])));
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
