<?php
/**
 * wabot/onboarding.php — después del pago, el bot le pide al cliente lo que
 * falta para terminar la web (Pablo, 1-nov-2026: "que el bot le pida por el
 * chat lo que falta; los datos se piden POR EL CHAT, no con un formulario").
 *
 * Hasta ahora eso lo hacía Pablo a mano desde su otro número (informe de chats
 * del 1-nov, §6): "¡Genial, ya me llegó el pago!…", los datos para la factura,
 * "pasame 2 o 3 nombres" de dominio, el logo, las fotos, los cambios. Acá lo
 * hace el bot, UNA cosa por vez y en este orden (WABOT_ONBOARDING_PASOS):
 *   modelo   cuál de los dos modelos de la demo (si no lo dijo antes)
 *   factura  nombre o razón social, CUIT/CUIL y condición frente al IVA
 *   dominio  2 o 3 nombres que le gustarían (Pablo los prueba y compra)
 *   email    el email para entrar al panel de la web
 *   logo     el archivo del logo (o "no tengo")
 *   fotos    5 o 6 fotos (se cuentan las imágenes que llegan al chat)
 *   cambios  textos o cosas de la demo que quiera cambiar
 *   datos    horarios, dirección y redes
 *
 * Las preguntas son textos fijos de textos.php (onboarding_*), con las palabras
 * de Pablo. OpenAI entra solo para leer respuestas libres (sacar el CUIT, la
 * razón social y la condición de IVA de "Soy Juan Pérez, 20-12345678-9,
 * monotributista"; los nombres de dominio), con tarea y clave de caché propias
 * y siempre con un plan B sin modelo. Todo queda en $conv['onboarding']
 * (dato por dato, con su hora) y se refleja en el doc de `clientes`
 * (campo `onboarding`) con la cuenta de servicio.
 *
 * El turno es del onboarding mientras haya pago confirmado y falte algo
 * (gancho al principio de wabot_comercial_turno, y en wabot_responder cuando
 * el flujo comercial no está en automático). Si Pablo escribe en el chat, el
 * bot se pausa como siempre (control_manual) y el onboarding espera; desde la
 * ficha se retoma con un botón. Si el cliente se corta, a las 22 h le llega un
 * recordatorio (cron, de 9 a 22 h, una vez por pregunta; a las 24 h la ventana
 * de WhatsApp ya está cerrada y no se puede escribir, por eso antes). Al completar:
 * onboarding.completo_ts, aviso a Pablo y la etapa pasa a "listo para
 * producción" en la pestaña Clientes.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

const WABOT_ONBOARDING_PASOS = ['modelo', 'factura', 'dominio', 'email', 'logo', 'fotos', 'cambios', 'datos'];
const WABOT_ONBOARDING_FOTOS_MIN = 5;

/* ── Estado ────────────────────────────────────────────────────────────── */

/** ¿Le toca al onboarding este chat? Pagó, arrancó y todavía falta algo. */
function wabot_onboarding_activo($conv, $cfg = null) {
    if (is_array($cfg) && array_key_exists('onboarding_activo', $cfg) && empty($cfg['onboarding_activo'])) return false;
    if (empty($conv['pago_confirmado_ts'])) return false;
    $ob = $conv['onboarding'] ?? null;
    if (!is_array($ob) || empty($ob['inicio_ts'])) return false;
    return empty($ob['completo_ts']) && empty($ob['cancelado_ts']);
}

/** El primer paso que falta, o '' si está todo. */
function wabot_onboarding_siguiente_paso($conv) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    foreach (WABOT_ONBOARDING_PASOS as $paso) {
        if (!isset($datos[$paso])) return $paso;
    }
    return '';
}

/** Cuántos pasos están resueltos (contestados u omitidos). */
function wabot_onboarding_avance($conv) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    return [count(array_intersect_key($datos, array_flip(WABOT_ONBOARDING_PASOS))), count(WABOT_ONBOARDING_PASOS)];
}

function wabot_onboarding_paso_label($paso) {
    return ['modelo' => 'el modelo', 'factura' => 'los datos para la factura', 'dominio' => 'los nombres de dominio', 'email' => 'el email del panel',
            'logo' => 'el logo', 'fotos' => 'las fotos', 'cambios' => 'los cambios a la demo', 'datos' => 'horarios, dirección y redes'][(string)$paso] ?? (string)$paso;
}

/** Lo que muestra la ficha: "Onboarding 3/8 · pidiendo la factura" o "Onboarding completo el d/m". */
function wabot_onboarding_resumen($conv) {
    $ob = $conv['onboarding'] ?? null;
    if (!is_array($ob) || empty($ob['inicio_ts'])) return '';
    [$hechos, $total] = wabot_onboarding_avance($conv);
    if (!empty($ob['completo_ts'])) return 'Datos para la web completos el ' . gmdate('j/n', (int)$ob['completo_ts'] - 3 * 3600);
    $paso = (string)($ob['paso'] ?? '') ?: wabot_onboarding_siguiente_paso($conv);
    return 'Datos para la web: ' . $hechos . ' de ' . $total . ($paso !== '' ? ' · pidiendo ' . wabot_onboarding_paso_label($paso) : '');
}

/* ── Textos ────────────────────────────────────────────────────────────── */

function wabot_onboarding_texto($clave, $cfg, $conv = null, array $vars = []) {
    $t = (string)($cfg['onboarding_' . $clave] ?? '');
    if ($t === '') return '';
    if ($vars) $t = strtr($t, $vars);
    if (strpos($t, '{saludo}') !== false) {
        $h = wabot_hora_local(time());
        $t = str_replace('{saludo}', $h < 13 ? 'Hola, buen día' : ($h < 20 ? 'Hola, buenas tardes' : 'Hola, buenas noches'), $t);
    }
    return trim(is_array($conv) && function_exists('wabot_personalizar') ? wabot_personalizar($t, $conv) : $t);
}

/** La pregunta de un paso, con lo que ya se sabe de la charla. */
function wabot_onboarding_pregunta($paso, $conv, $cfg) {
    if ($paso === 'fotos') {
        $n = count(wabot_onboarding_imagenes_desde($conv, (int)($conv['onboarding']['fotos_desde_ts'] ?? 0)));
        if ($n > 0 && $n < WABOT_ONBOARDING_FOTOS_MIN) return wabot_onboarding_texto('fotos_faltan', $cfg, $conv, ['{recibidas}' => wabot_onboarding_plural($n)]);
    }
    return wabot_onboarding_texto($paso, $cfg, $conv);
}

function wabot_onboarding_plural($n) {
    return $n === 1 ? '1 foto' : $n . ' fotos';
}

/* ── Arranque (desde la confirmación del pago) ─────────────────────────── */

/**
 * Deja el onboarding armado y manda la apertura con la primera pregunta.
 * Lo llama wabot_pago_confirmar. Devuelve los textos que salieron (o quedaron
 * pendientes si la ventana de 24 h está cerrada: salen al próximo mensaje).
 * $deps['enviar'] (tests) reemplaza wabot_enviar.
 */
function wabot_onboarding_iniciar(&$conv, $cfg, $ahora = null, array $deps = []) {
    $ahora = (int)($ahora ?? time());
    if (is_array($cfg) && array_key_exists('onboarding_activo', $cfg) && empty($cfg['onboarding_activo'])) return [];
    if (!empty($conv['onboarding']['inicio_ts'])) return [];
    $ob = ['inicio_ts' => $ahora, 'paso' => '', 'datos' => [], 'preguntado_ts' => 0, 'recordatorio_ts' => 0, 'completo_ts' => 0, 'fotos_desde_ts' => 0, 'pendiente_apertura' => true];
    // Lo que ya se sabe no se vuelve a pedir: el modelo que eligió al ver la demo.
    $modelo = wabot_onboarding_modelo_sabido($conv);
    if ($modelo > 0) $ob['datos']['modelo'] = ['valor' => $modelo, 'ts' => $ahora, 'origen' => 'charla'];
    $conv['onboarding'] = $ob;
    return wabot_onboarding_abrir($conv, $cfg, $ahora, $deps);
}

/** Manda la apertura y la primera pregunta, si la ventana de WhatsApp lo permite. */
function wabot_onboarding_abrir(&$conv, $cfg, $ahora, array $deps = []) {
    $textos = array_values(array_filter([wabot_onboarding_texto('apertura', $cfg, $conv)]));
    $paso = wabot_onboarding_siguiente_paso($conv);
    if ($paso === '') {
        return wabot_onboarding_completar($conv, $cfg, $ahora, $deps, $textos);
    }
    $textos[] = wabot_onboarding_pregunta($paso, $conv, $cfg);
    $enviar = $deps['enviar'] ?? function (&$c, $t) { return wabot_enviar($c, $t); };
    $ventana = isset($deps['ventana_abierta']) ? (bool)$deps['ventana_abierta'] : (wabot_ventana_restante($conv, $ahora) > 0);
    if (!$ventana) {
        // Sin ventana no se puede escribir: la apertura sale cuando el cliente vuelva a hablar.
        $conv['onboarding']['pendiente_apertura'] = true;
        wabot_log('onboarding_espera_ventana', ['clave' => $conv['conversation_key'] ?? '']);
        return [];
    }
    $salieron = [];
    foreach ($textos as $t) {
        if (!$enviar($conv, $t)) break;
        wabot_conv_transcript($conv, 'bot', $t);
        $salieron[] = $t;
    }
    if (count($salieron) === count($textos)) {
        wabot_onboarding_preguntar($conv, $paso, $ahora);
        $conv['onboarding']['pendiente_apertura'] = false;
    }
    return $salieron;
}

/** Anota qué se está preguntando y desde cuándo (para el recordatorio y para contar fotos). */
function wabot_onboarding_preguntar(&$conv, $paso, $ahora) {
    $conv['onboarding']['paso'] = $paso;
    $conv['onboarding']['preguntado_ts'] = (int)$ahora;
    if ($paso === 'fotos' && empty($conv['onboarding']['fotos_desde_ts'])) $conv['onboarding']['fotos_desde_ts'] = (int)$ahora;
    if ($paso === 'logo') $conv['onboarding']['logo_desde_ts'] = (int)$ahora;
}

/* ── El turno ──────────────────────────────────────────────────────────── */

/**
 * El mensaje del cliente mientras el bot junta los datos. Devuelve la lista de
 * mensajes a mandar (puede ser vacía: deja el mensaje para Pablo sin contestar).
 * El mensaje ya está en el transcript (como en todo turno del bot).
 */
function wabot_onboarding_turno(&$conv, $texto, $cfg, $ahora = null, array $deps = []) {
    $ahora = (int)($ahora ?? time());
    $texto = trim((string)$texto);
    $ob = &$conv['onboarding'];
    $conv['ultimo_ts'] = $ahora;

    // La apertura que no pudo salir (ventana cerrada) sale ahora que el cliente escribió.
    if (!empty($ob['pendiente_apertura']) || (string)($ob['paso'] ?? '') === '') {
        $paso = wabot_onboarding_siguiente_paso($conv);
        if ($paso === '') return wabot_onboarding_completar($conv, $cfg, $ahora, $deps);
        $textos = array_values(array_filter([wabot_onboarding_texto('apertura', $cfg, $conv), wabot_onboarding_pregunta($paso, $conv, $cfg)]));
        wabot_onboarding_preguntar($conv, $paso, $ahora);
        $ob['pendiente_apertura'] = false;
        unset($ob);
        return $textos;
    }

    $paso = (string)$ob['paso'];
    $r = wabot_onboarding_interpretar($paso, $texto, $conv, $cfg, $ahora);
    wabot_evento_sesion_si_existe($conv, 'onboarding_' . $paso, ['estado' => $r['estado']]);

    if ($r['estado'] === 'no_entendi') {
        /* No es la respuesta a lo que se pidió. Charla en vivo del 1-nov: se le
         * pedía el modelo, contestó los datos de la factura y el bot se calló.
         * Primero se mira si es la respuesta de OTRO paso que falta: se toma y
         * se vuelve a pedir lo de ahora. Si no, se repregunta UNA vez. Recién
         * la segunda seguida lo ve Pablo —le suena el aviso— y el bot no
         * insiste; el recordatorio vuelve a pedir lo que falta. */
        $otro = wabot_onboarding_paso_que_contesta($paso, $texto, $conv, $cfg, $ahora);
        if ($otro !== null) {
            [$pasoOtro, $rOtro] = $otro;
            $ob['datos'][$pasoOtro] = ['valor' => $rOtro['dato'], 'ts' => $ahora, 'omitido' => false] + (isset($rOtro['extra']) ? $rOtro['extra'] : []);
            unset($ob['datos_parciales'][$pasoOtro]);
            $ob['sin_entender'] = 0;
            unset($ob);
            wabot_onboarding_fs_sync($conv, $deps);
            $siguiente = wabot_onboarding_siguiente_paso($conv);
            if ($siguiente === '') return wabot_onboarding_completar($conv, $cfg, $ahora, $deps);
            wabot_onboarding_preguntar($conv, $siguiente, $ahora);
            $conv['onboarding']['recordatorio_ts'] = 0;
            return [trim(wabot_onboarding_texto('ok', $cfg, $conv) . ' ' . wabot_onboarding_pregunta($siguiente, $conv, $cfg))];
        }
        $ob['sin_entender'] = (int)($ob['sin_entender'] ?? 0) + 1;
        if ((int)$ob['sin_entender'] <= 1) {
            unset($ob);
            return [trim(wabot_onboarding_texto('no_entendi', $cfg, $conv) . ' ' . wabot_onboarding_pregunta($paso, $conv, $cfg))];
        }
        $conv['handoff_pendiente'] = true;
        unset($ob);
        return [];
    }
    $ob['sin_entender'] = 0;
    if ($r['estado'] === 'parcial') {
        $ob['datos_parciales'][$paso] = $r['dato'];
        $ob['preguntado_ts'] = $ahora;
        $ob['recordatorio_ts'] = 0;
        unset($ob);
        return array_values(array_filter([(string)($r['respuesta'] ?? '')]));
    }
    if ($r['estado'] === 'esperando') {
        // Fotos: llegaron algunas, faltan; sin repreguntar cada vez si no dijo nada.
        unset($ob);
        return array_values(array_filter([(string)($r['respuesta'] ?? '')]));
    }
    // ok u omitido: se guarda y se pasa al siguiente.
    $ob['datos'][$paso] = ['valor' => $r['dato'], 'ts' => $ahora, 'omitido' => $r['estado'] === 'omitido'] + (isset($r['extra']) ? $r['extra'] : []);
    unset($ob['datos_parciales'][$paso]);
    unset($ob);
    wabot_onboarding_fs_sync($conv, $deps);
    $siguiente = wabot_onboarding_siguiente_paso($conv);
    if ($siguiente === '') return wabot_onboarding_completar($conv, $cfg, $ahora, $deps);
    wabot_onboarding_preguntar($conv, $siguiente, $ahora);
    $conv['onboarding']['recordatorio_ts'] = 0;
    $ack = wabot_onboarding_texto('ok', $cfg, $conv);
    $pregunta = wabot_onboarding_pregunta($siguiente, $conv, $cfg);
    return [trim(($r['respuesta'] ?? $ack) . ' ' . $pregunta)];
}

/**
 * ¿Lo que escribió es la respuesta de otro paso que todavía falta? Devuelve
 * [paso, resultado] o null. Solo los pasos que se reconocen sin dudas: el
 * modelo, la factura completa, un email, un dominio con su terminación. Los
 * de texto libre (cambios, datos) y los de archivos no, porque se llevarían
 * cualquier cosa.
 */
function wabot_onboarding_paso_que_contesta($pasoActual, $texto, $conv, $cfg, $ahora) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    foreach (['modelo', 'factura', 'email', 'dominio'] as $paso) {
        if ($paso === $pasoActual || isset($datos[$paso])) continue;
        if ($paso === 'dominio' && !preg_match('/\.(com|ar|net|org)\b/iu', $texto)) continue;
        $r = wabot_onboarding_interpretar($paso, $texto, $conv, $cfg, $ahora);
        if (($r['estado'] ?? '') === 'ok') return [$paso, $r];
    }
    return null;
}

function wabot_evento_sesion_si_existe(&$conv, $evento, $datos = []) {
    if (function_exists('wabot_evento_sesion')) wabot_evento_sesion($conv, $evento, $datos);
}

/** Todo junto: el cierre, el aviso a Pablo, Firestore. Devuelve los mensajes. */
function wabot_onboarding_completar(&$conv, $cfg, $ahora, array $deps = [], array $antes = []) {
    $conv['onboarding']['completo_ts'] = (int)$ahora;
    $conv['onboarding']['paso'] = '';
    wabot_onboarding_fs_sync($conv, $deps);
    wabot_log('onboarding_completo', ['clave' => $conv['conversation_key'] ?? '', 'datos' => array_keys((array)($conv['onboarding']['datos'] ?? []))]);
    $quien = function_exists('wabot_nombre_agenda') ? wabot_nombre_agenda($conv) : (string)($conv['nombre'] ?? '');
    $clave = (string)($conv['conversation_key'] ?? $conv['tel'] ?? '');
    $avisar = $deps['avisar'] ?? ($GLOBALS['WABOT_TEST_ONBOARDING_AVISAR'] ?? function ($t, $c) use ($clave) {
        return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/wabot/admin.php?tab=clientes', 'tel' => $clave]);
    });
    try { $avisar('Listo para producción: ' . $quien, 'Ya mandó todo lo que faltaba para la web (' . wabot_onboarding_datos_texto($conv) . '). Queda listo para el pedido de producción.'); } catch (\Throwable $e) {}
    $cierre = wabot_onboarding_texto('completo', $cfg, $conv);
    // Si se está llamando desde la apertura (ya estaba todo), los textos salen por wabot_enviar.
    if ($antes !== null && !empty($deps['desde_apertura'])) return array_merge($antes, [$cierre]);
    return array_values(array_filter(array_merge($antes, [$cierre])));
}

/** "modelo 1, factura, 2 dominios, email, logo, 6 fotos, cambios, datos": lo que juntó, en una línea. */
function wabot_onboarding_datos_texto($conv) {
    $d = (array)($conv['onboarding']['datos'] ?? []);
    $partes = [];
    foreach (WABOT_ONBOARDING_PASOS as $paso) {
        if (!isset($d[$paso])) continue;
        if (!empty($d[$paso]['omitido'])) { $partes[] = $paso . ': no tiene'; continue; }
        $v = $d[$paso]['valor'];
        if ($paso === 'modelo') $partes[] = 'modelo ' . (int)$v;
        elseif ($paso === 'dominio') $partes[] = count((array)$v) . ' dominios';
        elseif ($paso === 'fotos') $partes[] = count((array)($v['archivos'] ?? [])) . ' fotos';
        else $partes[] = $paso;
    }
    return implode(', ', $partes);
}

/* ── Leer lo que contesta ──────────────────────────────────────────────── */

/** Minúsculas y sin tildes, para las reglas. */
function wabot_onboarding_norm($t) {
    $t = mb_strtolower(trim((string)$t));
    $t = strtr($t, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n']);
    return trim(preg_replace('/\s+/u', ' ', $t));
}

/** ¿Dijo que no tiene / que lo pasa después? */
function wabot_onboarding_omite($t) {
    $n = wabot_onboarding_norm($t);
    return (bool)preg_match('/\b(no tengo|no tenemos|no hay|no uso|no tiene|sin logo|sin fotos|todavia no|despues te|mas tarde|no se me ocurre|no, ?gracias|no se|ninguno|ninguna)\b/u', $n)
        || preg_match('/^(no|nop|no\.|no tengo\.?|nada)$/u', $n);
}

/** ¿Es una pregunta u otra cosa que no es la respuesta? */
function wabot_onboarding_parece_pregunta($t) {
    $n = wabot_onboarding_norm($t);
    return strpos($n, '?') !== false || (bool)preg_match('/^(que|como|cuando|cuanto|donde|por que|porque)\b/u', $n);
}

/** El modelo que dijo (1 o 2), o 0. */
function wabot_onboarding_modelo_en($texto) {
    $n = wabot_onboarding_norm($texto);
    if (preg_match('/\b(modelo|opcion|diseno|version|el|la)\s*(1|uno|primero|primera)\b/u', $n) || preg_match('/^(1|uno|el 1|el primero|la primera)$/u', $n)) return 1;
    if (preg_match('/\b(modelo|opcion|diseno|version|el|la)\s*(2|dos|segundo|segunda)\b/u', $n) || preg_match('/^(2|dos|el 2|el segundo|la segunda)$/u', $n)) return 2;
    return 0;
}

/** El modelo que ya eligió en la charla (campo del post-demo, o lo que dijo después de la demo). */
function wabot_onboarding_modelo_sabido($conv) {
    $m = (int)($conv['modelo_elegido'] ?? 0);
    if ($m === 1 || $m === 2) return $m;
    $desde = (int)($conv['presentado_ts'] ?? 0);
    $elegido = 0;
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') !== 'cliente' || (int)($fila['ts'] ?? 0) < $desde) continue;
        $x = wabot_onboarding_modelo_en((string)($fila['t'] ?? ''));
        if ($x > 0) $elegido = $x;
    }
    return $elegido;
}

/** Las imágenes que mandó el cliente desde $desdeTs: [['archivo', 'ts', 'texto']]. */
function wabot_onboarding_imagenes_desde($conv, $desdeTs, $clases = ['imagen']) {
    $out = [];
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') !== 'cliente' || (int)($fila['ts'] ?? 0) < (int)$desdeTs) continue;
        if (!in_array((string)($fila['media']['clase'] ?? ''), $clases, true)) continue;
        $out[] = ['archivo' => (string)($fila['media']['archivo'] ?? ''), 'ts' => (int)$fila['ts'], 'texto' => mb_substr((string)($fila['t'] ?? ''), 0, 160)];
    }
    return $out;
}

/** Un CUIT/CUIL de 11 dígitos escrito como sea, o ''. */
function wabot_onboarding_cuit_en($texto) {
    if (preg_match('/\b(2[0-7]|3[0-4])\s*[-.]?\s*(\d{8})\s*[-.]?\s*(\d)\b/u', (string)$texto, $m)) return $m[1] . $m[2] . $m[3];
    $soloDigitos = preg_replace('/\D+/', '', (string)$texto);
    return strlen($soloDigitos) === 11 && preg_match('/^(2[0-7]|3[0-4])/', $soloDigitos) ? $soloDigitos : '';
}

/** La condición frente al IVA que nombró, o ''. */
function wabot_onboarding_iva_en($texto) {
    $n = wabot_onboarding_norm($texto);
    if (preg_match('/monotribut/u', $n)) return 'Monotributista';
    if (preg_match('/responsable inscri/u', $n) || preg_match('/\b(ri|resp\.? insc)\b/u', $n)) return 'Responsable inscripto';
    if (preg_match('/exent/u', $n)) return 'Exento';
    if (preg_match('/consumidor final|cons\.? final/u', $n)) return 'Consumidor final';
    return '';
}

/** Un email, o ''. */
function wabot_onboarding_email_en($texto) {
    return preg_match('/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/u', (string)$texto, $m) ? mb_strtolower($m[0]) : '';
}

/** Los nombres de dominio que propuso (hasta 5): "zapasmoda.com.ar, zapas moda o zapasmodaok". */
function wabot_onboarding_dominios_en($texto) {
    $t = trim((string)$texto);
    if ($t === '') return [];
    $partes = preg_split('/\s*(?:,|;|\n|\bo\b|\by\b|\/|\d+[.)-]\s*)\s*/u', $t);
    $out = [];
    foreach ($partes as $p) {
        $p = trim($p, " \t.-\"'«»");
        if ($p === '' || preg_match('/^(que|me|gusta|gustaria|puede|ser|tipo|algo|como|por|ejemplo|www)$/iu', $p)) continue;
        $p = preg_replace('/^(www\.|https?:\/\/)/iu', '', $p);
        $limpio = mb_strtolower(preg_replace('/\s+/u', '', strtr($p, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ñ' => 'n'])));
        $limpio = preg_replace('/[^a-z0-9.-]/u', '', $limpio);
        if ($limpio === '' || mb_strlen($limpio) < 3 || mb_strlen($limpio) > 60) continue;
        if (!preg_match('/\.[a-z]{2,}(\.[a-z]{2})?$/u', $limpio)) $limpio .= '.com.ar';
        $out[$limpio] = true;
        if (count($out) >= 5) break;
    }
    return array_keys($out);
}

/**
 * Lo que dijo, leído para el paso que se está pidiendo:
 *   ['estado' => ok|omitido|parcial|esperando|no_entendi, 'dato' => …, 'respuesta' => texto opcional]
 */
function wabot_onboarding_interpretar($paso, $texto, $conv, $cfg, $ahora) {
    $ob = (array)($conv['onboarding'] ?? []);
    $preguntadoTs = (int)($ob['preguntado_ts'] ?? 0);
    $soloMedia = $texto === '' || preg_match('/^\[(foto|audio|documento|video|sticker)\]/u', $texto);

    if ($paso === 'logo') {
        $archivos = wabot_onboarding_imagenes_desde($conv, (int)($ob['logo_desde_ts'] ?? $preguntadoTs), ['imagen', 'documento']);
        if ($archivos) return ['estado' => 'ok', 'dato' => ['archivos' => array_column($archivos, 'archivo')]];
        if (wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => null];
        if ($soloMedia) return ['estado' => 'esperando', 'dato' => null];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'fotos') {
        $desde = (int)($ob['fotos_desde_ts'] ?? $preguntadoTs);
        $fotos = wabot_onboarding_imagenes_desde($conv, $desde);
        $n = count($fotos);
        $dato = ['archivos' => array_column($fotos, 'archivo'), 'cantidad' => $n];
        if ($n >= WABOT_ONBOARDING_FOTOS_MIN) return ['estado' => 'ok', 'dato' => $dato];
        $nrm = wabot_onboarding_norm($texto);
        if ($n > 0 && preg_match('/\b(listo|ya esta|ya estan|esas son|esas|son esas|con esas|nada mas|solo esas|por ahora esas|eso)\b/u', $nrm)) return ['estado' => 'ok', 'dato' => $dato];
        if ($n === 0 && wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => $dato];
        if ($n > 0 && $soloMedia) {
            // Llegó una tanda: se avisa cuántas van una sola vez por tanda (si mandó varias juntas, el webhook las junta en un turno).
            return ['estado' => 'esperando', 'dato' => $dato, 'respuesta' => wabot_onboarding_texto('fotos_faltan', $cfg, $conv, ['{recibidas}' => wabot_onboarding_plural($n)])];
        }
        if ($soloMedia) return ['estado' => 'esperando', 'dato' => $dato];
        if (wabot_onboarding_parece_pregunta($texto)) return ['estado' => 'no_entendi', 'dato' => $dato];
        return ['estado' => 'esperando', 'dato' => $dato];
    }
    if ($soloMedia) {
        // Una foto o un audio sin texto en un paso de texto: se guarda y se espera la respuesta.
        return ['estado' => 'esperando', 'dato' => null];
    }
    if ($paso === 'modelo') {
        $m = wabot_onboarding_modelo_en($texto);
        if ($m > 0) return ['estado' => 'ok', 'dato' => $m];
        if (preg_match('/\b(cualquiera|el que vos digas|elegi vos|decidi vos|me da igual|los dos)\b/u', wabot_onboarding_norm($texto))) return ['estado' => 'omitido', 'dato' => null, 'extra' => ['nota' => $texto]];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'email') {
        $e = wabot_onboarding_email_en($texto);
        if ($e !== '') return ['estado' => 'ok', 'dato' => $e];
        if (wabot_onboarding_parece_pregunta($texto)) return ['estado' => 'no_entendi', 'dato' => null];
        if (wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => null];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'factura') {
        $parcial = (array)($ob['datos_parciales']['factura'] ?? []);
        $f = wabot_onboarding_factura_leer($texto, $conv, $cfg) + $parcial;
        foreach ($parcial as $k => $v) if (($f[$k] ?? '') === '' && $v !== '') $f[$k] = $v;
        $nada = ($f['razon_social'] ?? '') === '' && ($f['cuit'] ?? '') === '' && ($f['iva'] ?? '') === '';
        // "Después te lo paso" sin ningún dato adentro: queda para Pablo. Con un dato, se toma el dato.
        if ($nada && wabot_onboarding_omite($texto) && !$parcial) return ['estado' => 'omitido', 'dato' => null, 'extra' => ['nota' => $texto]];
        $falta = [];
        if (($f['razon_social'] ?? '') === '') $falta[] = 'el nombre o la razón social';
        if (($f['cuit'] ?? '') === '') $falta[] = 'el CUIT o CUIL';
        if (($f['iva'] ?? '') === '') $falta[] = 'la condición frente al IVA';
        if (!$falta) return ['estado' => 'ok', 'dato' => $f];
        if (count($falta) === 3) return ['estado' => 'no_entendi', 'dato' => null];
        return ['estado' => 'parcial', 'dato' => $f, 'respuesta' => wabot_onboarding_texto('factura_falta', $cfg, $conv, ['{falta}' => wabot_onboarding_lista_y($falta)])];
    }
    if ($paso === 'dominio') {
        if (wabot_onboarding_parece_pregunta($texto) && !preg_match('/\.(com|ar|net|org)\b/iu', $texto)) return ['estado' => 'no_entendi', 'dato' => null];
        if (wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => [], 'extra' => ['nota' => $texto]];
        $d = wabot_onboarding_dominios_leer($texto, $conv, $cfg);
        if ($d) return ['estado' => 'ok', 'dato' => $d];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'cambios' || $paso === 'datos') {
        if (wabot_onboarding_parece_pregunta($texto) && mb_strlen($texto) < 80) return ['estado' => 'no_entendi', 'dato' => null];
        $n = wabot_onboarding_norm($texto);
        if ($paso === 'cambios' && preg_match('/^(esta bien asi|asi esta bien|esta bien|asi|no|nada|ninguno|ningun cambio|dejalo asi|perfecto asi|todo bien|me gusta asi)\.?$/u', $n)) {
            return ['estado' => 'omitido', 'dato' => '', 'extra' => ['nota' => 'sin cambios']];
        }
        if ($paso === 'datos' && wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => '', 'extra' => ['nota' => $texto]];
        return ['estado' => 'ok', 'dato' => $texto];
    }
    return ['estado' => 'no_entendi', 'dato' => null];
}

/** "a, b y c". */
function wabot_onboarding_lista_y(array $partes) {
    if (count($partes) <= 1) return (string)reset($partes);
    $ultimo = array_pop($partes);
    return implode(', ', $partes) . ' y ' . $ultimo;
}

/* ── OpenAI, solo para leer respuestas libres ──────────────────────────── */

/** Los datos para la factura: reglas primero; si falta la razón social, el modelo. */
function wabot_onboarding_factura_leer($texto, $conv, $cfg) {
    $f = ['razon_social' => '', 'cuit' => wabot_onboarding_cuit_en($texto), 'iva' => wabot_onboarding_iva_en($texto)];
    // Sin el CUIT ni la condición, lo que queda es el nombre (si parece un nombre).
    $resto = trim(preg_replace('/\b(2[0-7]|3[0-4])\s*[-.]?\s*\d{8}\s*[-.]?\s*\d\b|monotribut\w*|responsable inscript\w*|exent\w*|consumidor final|cuit|cuil|iva|condicion|frente al|razon social|nombre|:|,|-/iu', ' ', $texto));
    $resto = trim(preg_replace('/\s+/u', ' ', $resto));
    $ia = wabot_onboarding_ia('factura', $texto, $conv, $cfg);
    if (is_array($ia)) {
        foreach (['razon_social', 'cuit', 'iva'] as $k) {
            $v = trim((string)($ia[$k] ?? ''));
            if ($k === 'cuit') $v = wabot_onboarding_cuit_en($v);
            if ($k === 'iva') $v = wabot_onboarding_iva_en($v);
            if ($v !== '' && $f[$k] === '') $f[$k] = $v;
        }
    }
    if ($f['razon_social'] === '' && $resto !== '' && mb_strlen($resto) >= 3 && mb_strlen($resto) <= 80 && !preg_match('/\?|\b(no tengo|no se|despues)\b/iu', $resto)) {
        $f['razon_social'] = $resto;
    }
    return $f;
}

/** Los dominios: reglas primero; el modelo si el texto es una frase y no una lista. */
function wabot_onboarding_dominios_leer($texto, $conv, $cfg) {
    $d = wabot_onboarding_dominios_en($texto);
    $esFrase = mb_strlen($texto) > 50 && str_word_count(preg_replace('/[^A-Za-z ]/', ' ', $texto)) > 8;
    if ($esFrase || !$d) {
        $ia = wabot_onboarding_ia('dominio', $texto, $conv, $cfg);
        if (is_array($ia) && !empty($ia['dominios'])) {
            $limpios = wabot_onboarding_dominios_en(implode(', ', array_map('strval', (array)$ia['dominios'])));
            if ($limpios) return $limpios;
        }
    }
    return $d;
}

/**
 * Una lectura con OpenAI de la respuesta libre del cliente, con tarea y clave
 * de caché propias ('onboarding-<paso>'). Devuelve el JSON o null (sin key, sin
 * red, circuito abierto: se sigue con las reglas). En los tests, WABOT_TEST_OPENAI_HTTP.
 */
function wabot_onboarding_ia($paso, $texto, $conv, $cfg) {
    if (!function_exists('wabot_openai_llamar') || !function_exists('wabot_openai_disponible') || !wabot_openai_disponible()) return null;
    if (trim((string)$texto) === '') return null;
    if ($paso === 'factura') {
        $instrucciones = 'Leés la respuesta de un cliente argentino al que le pidieron los datos para hacerle una Factura C: nombre o razón social, CUIT o CUIL y condición frente al IVA. '
            . 'Devolvé un JSON con razon_social (el nombre de la persona o de la empresa, tal como lo escribió, o ""), cuit (los 11 dígitos sin guiones, o ""), '
            . 'iva (una de: Monotributista, Responsable inscripto, Exento, Consumidor final, o ""). No inventes nada: lo que no está, va vacío.';
        $schema = ['type' => 'object', 'additionalProperties' => false, 'required' => ['razon_social', 'cuit', 'iva'],
            'properties' => ['razon_social' => ['type' => 'string'], 'cuit' => ['type' => 'string'], 'iva' => ['type' => 'string']]];
    } elseif ($paso === 'dominio') {
        $instrucciones = 'Leés la respuesta de un cliente al que le pidieron 2 o 3 nombres de dominio que le gustarían para su web. '
            . 'Devolvé un JSON con dominios: la lista de nombres que propuso, en minúsculas y sin espacios, con la terminación que dijo o .com.ar si no dijo ninguna (máximo 5). Si no propone ninguno, lista vacía.';
        $schema = ['type' => 'object', 'additionalProperties' => false, 'required' => ['dominios'],
            'properties' => ['dominios' => ['type' => 'array', 'items' => ['type' => 'string']]]];
    } else {
        return null;
    }
    $r = wabot_openai_llamar('onboarding-' . $paso, $instrucciones, (string)$texto,
        ['type' => 'json_schema', 'name' => 'onboarding_' . $paso, 'strict' => true, 'schema' => $schema], $cfg,
        ['max_tokens' => 300, 'esfuerzo' => 'none', 'usuario' => (string)($conv['conversation_key'] ?? ''), 'sin_circuito' => true]);
    return !empty($r['ok']) && is_array($r['datos']) ? $r['datos'] : null;
}

/* ── Firestore: el onboarding en el doc del cliente ────────────────────── */

/** PATCH de `onboarding` en clientes/<cliente_id>. Sin red en los tests. $deps['fs_onboarding'] lo reemplaza. */
function wabot_onboarding_fs_sync(array $conv, array $deps = []) {
    $id = trim((string)($conv['cliente_id'] ?? ''));
    $ob = (array)($conv['onboarding'] ?? []);
    if ($id === '' || !$ob) return false;
    $campos = ['onboarding' => wabot_onboarding_para_firestore($ob, $conv)];
    // El turno llega del webhook sin dependencias: en los tests, el gancho global.
    $gancho = $deps['fs_onboarding'] ?? ($GLOBALS['WABOT_TEST_ONBOARDING_FS'] ?? null);
    if ($gancho) return (bool)$gancho($id, $campos);
    $clave = (string)($conv['conversation_key'] ?? $conv['tel'] ?? '');
    if (!empty($GLOBALS['WABOT_TEST_SIN_RED']) || stripos($clave, 'TEST') !== false) return false;
    if (!function_exists('wabot_pagos_fs_llamar')) return false;
    try {
        [$http] = wabot_pagos_fs_llamar('PATCH', wabot_pagos_fs_url('clientes/' . rawurlencode($id), 'updateMask.fieldPaths=onboarding&updateMask.fieldPaths=updatedAt&currentDocument.exists=true'),
            ['fields' => ['onboarding' => wabot_pagos_fs_valor($campos['onboarding']), 'updatedAt' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')]]]);
        if ($http < 200 || $http >= 300) wabot_log('error', ['donde' => 'onboarding_fs', 'id' => $id, 'http' => $http]);
        return $http >= 200 && $http < 300;
    } catch (\Throwable $e) {
        wabot_log('error', ['donde' => 'onboarding_fs', 'id' => $id, 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        return false;
    }
}

/**
 * El onboarding como lo leen el admin y el pedido de producción
 * (tools/demo-auto/preparar-produccion.php): fechas legibles, dato por dato, y
 * de la charla lo que el pedido necesita (la carpeta de la demo, la clave del
 * chat para bajar los archivos, el tipo de web).
 */
function wabot_onboarding_para_firestore(array $ob, array $conv = []) {
    $iso = function ($ts) { return (int)$ts > 0 ? gmdate('Y-m-d\TH:i:s\Z', (int)$ts) : ''; };
    $out = ['inicioAt' => $iso($ob['inicio_ts'] ?? 0), 'completoAt' => $iso($ob['completo_ts'] ?? 0), 'paso' => (string)($ob['paso'] ?? ''),
            'slug' => (string)($conv['presentado_slug'] ?? ''), 'conversationKey' => (string)($conv['conversation_key'] ?? $conv['tel'] ?? ''),
            'tipo' => (string)($conv['tipo'] ?? ''), 'datos' => []];
    foreach ((array)($ob['datos'] ?? []) as $paso => $d) {
        $out['datos'][(string)$paso] = ['valor' => $d['valor'] ?? null, 'at' => $iso($d['ts'] ?? 0), 'omitido' => !empty($d['omitido'])] + (isset($d['nota']) ? ['nota' => (string)$d['nota']] : []);
    }
    return $out;
}

/* ── El recordatorio del cron ──────────────────────────────────────────── */

/**
 * A las 22 h (onboarding_recordatorio_horas) de una pregunta sin respuesta,
 * una vez por pregunta, de 9 a 22 h, con la ventana de WhatsApp abierta y sin
 * Pablo en el chat. $convs (tests): [clave => conv]; $enviar reemplaza wabot_enviar.
 */
function wabot_onboarding_recordatorio_correr($cfg, $ahora = null, $convs = null, $enviar = null, $guardar = null) {
    $ahora = (int)($ahora ?? time());
    $res = ['revisadas' => 0, 'enviados' => 0, 'detalle' => []];
    $horas = max(1, (int)($cfg['onboarding_recordatorio_horas'] ?? 22));
    $hora = wabot_hora_local($ahora);
    if ($hora < 9 || $hora >= 22) return $res + ['fuera_de_hora' => true];
    $enviar = $enviar ?? function (&$c, $t) { return wabot_enviar($c, $t); };
    $guardar = $guardar ?? 'wabot_conv_save';
    if ($convs === null) {
        $convs = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            if ((int)@filemtime($f) < $ahora - 45 * 86400) continue;
            $raw = (string)@file_get_contents($f);
            if (strpos($raw, '"pago_confirmado_ts"') === false || strpos($raw, '"onboarding"') === false) continue;
            $cv = json_decode($raw, true);
            if (is_array($cv)) $convs[basename($f, '.json')] = $cv;
        }
    }
    foreach ($convs as $clave => $cv) {
        if (!wabot_onboarding_activo($cv, $cfg)) continue;
        $ob = (array)$cv['onboarding'];
        $paso = (string)($ob['paso'] ?? '');
        $preguntado = (int)($ob['preguntado_ts'] ?? 0);
        if ($paso === '' || $preguntado <= 0) continue;
        $res['revisadas']++;
        if (!empty($cv['control_manual']) || !empty($cv['bot_off'])) continue;              // lo sigue Pablo
        if (function_exists('wabot_retomar_activo') && wabot_retomar_activo($cv, $ahora)) continue;
        if ((int)($cv['ultimo_cliente_ts'] ?? 0) >= $preguntado) continue;                   // contestó algo: no es un corte
        if ($ahora - $preguntado < $horas * 3600) continue;
        if ((int)($ob['recordatorio_ts'] ?? 0) >= $preguntado) continue;                     // ya se le recordó esta pregunta
        if (wabot_ventana_restante($cv, $ahora) <= 0) { $res['detalle'][] = ['clave' => $clave, 'estado' => 'ventana_cerrada']; continue; }
        $texto = trim(wabot_onboarding_texto('recordatorio', $cfg, $cv) . ' ' . wabot_onboarding_pregunta($paso, $cv, $cfg));
        if (!$enviar($cv, $texto)) { $res['detalle'][] = ['clave' => $clave, 'estado' => 'no_salio']; continue; }
        wabot_conv_transcript($cv, 'bot', $texto);
        $cv['onboarding']['recordatorio_ts'] = $ahora;
        $cv['auto_ultimo_ts'] = $ahora;
        $guardar($cv);
        $convs[$clave] = $cv;
        $res['enviados']++;
        $res['detalle'][] = ['clave' => $clave, 'estado' => 'enviado', 'paso' => $paso];
    }
    if ($res['enviados']) wabot_log('onboarding_recordatorio', ['enviados' => $res['enviados']]);
    return $res;
}

/** Desde la ficha: Pablo le devuelve el chat al bot y se repite la pregunta pendiente. */
function wabot_onboarding_retomar(&$conv, $cfg, $ahora = null, array $deps = []) {
    $ahora = (int)($ahora ?? time());
    if (empty($conv['pago_confirmado_ts']) || empty($conv['onboarding']['inicio_ts']) || !empty($conv['onboarding']['completo_ts'])) return ['ok' => false, 'motivo' => 'sin_onboarding'];
    $conv['control_manual'] = false;
    $conv['bot_off'] = false;
    $conv['pausado_hasta'] = 0;
    $conv['handoff_pendiente'] = false;
    $paso = wabot_onboarding_siguiente_paso($conv);
    if ($paso === '') return ['ok' => true, 'mensajes' => wabot_onboarding_completar($conv, $cfg, $ahora, $deps)];
    if (wabot_ventana_restante($conv, $ahora) <= 0 && !isset($deps['enviar'])) {
        wabot_onboarding_preguntar($conv, $paso, $ahora);
        return ['ok' => true, 'mensajes' => [], 'ventana_cerrada' => true];
    }
    $enviar = $deps['enviar'] ?? function (&$c, $t) { return wabot_enviar($c, $t); };
    $texto = wabot_onboarding_pregunta($paso, $conv, $cfg);
    if (!$enviar($conv, $texto)) return ['ok' => false, 'motivo' => 'no_salio'];
    wabot_conv_transcript($conv, 'bot', $texto);
    wabot_onboarding_preguntar($conv, $paso, $ahora);
    $conv['onboarding']['recordatorio_ts'] = 0;
    return ['ok' => true, 'mensajes' => [$texto]];
}
