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

    // El reset pertenece al borde común, antes de que el agente vea el estado y
    // antes de actualizar ultimo_ts. Así también funciona en modo agente, donde
    // el motor de reglas puede no ejecutarse nunca.
    wabot_turno_preparar($conv, $cfg, time());

    if (!empty($conv['demo_texto_pendiente'])) {
        $conv['demo_texto_pendiente'] = false;
        return wabot_muestra_presentar_textos((string)($conv['presentado_slug'] ?? ''), $cfg);
    }

    if (wabot_postdemo_lo_lleva_humano($conv, $cfg)) {
        wabot_evento_sesion($conv, 'postdemo_silencio_humano');
        return [];
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

    $url  = 'https://generativelanguage.googleapis.com/v1beta/models/' . WABOT_GEMINI_MODEL . ':generateContent?key=' . WABOT_GEMINI_KEY;
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
    $preciosBase = [];
    if (preg_match_all('/\$\s?\d(?:[\d.]*\d)?/u', $base, $m)) {
        $preciosBase = array_unique($m[0]);
        foreach ($preciosBase as $precio) {
            if (mb_strpos($s, $precio) === false) return null;
        }
    }

    if (preg_match_all('/\$\s?\d(?:[\d.]*\d)?/u', $s, $ms)) {
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
