<?php
/**
 * wabot/onboarding.php — después del pago, el bot le pide al cliente lo que
 * falta para terminar la web (Pablo, 1-nov-2026: "que el bot le pida por el
 * chat lo que falta; los datos se piden POR EL CHAT, no con un formulario").
 *
 * Qué pide, UNA cosa por vez y en este orden (Pablo, 1-nov a la noche: "nunca
 * tiene que pedir datos para facturar; tiene que saber qué modelo hacer, si
 * combina un poco de ambos, el email si es tienda o algo que requiera login,
 * imágenes y textos que quiera modificar"):
 *   modelo    cuál de los dos modelos de la demo, o una mezcla de los dos
 *             (si ya lo dijo al ver la demo, no se pregunta)
 *   email     SOLO si la web tiene panel con login (tienda, cursos,
 *             inmobiliaria, o la informativa con panel): el email del acceso
 *   imagenes  el logo y 5 o 6 fotos (se cuentan las que llegan al chat)
 *   cambios   textos o cosas de la demo que quiera cambiar
 * Nada de factura, dominios ni horarios: eso lo ve Pablo.
 *
 * Las preguntas son textos fijos de textos.php (onboarding_*). Las respuestas
 * se leen con reglas (números, "los dos", un email, cuántas imágenes
 * llegaron, "está bien así"); no hace falta OpenAI. Todo queda en
 * $conv['onboarding'] (dato por dato, con su hora) y se refleja en el doc de
 * `clientes` (campo `onboarding`) con la cuenta de servicio.
 *
 * El turno es del onboarding mientras haya pago confirmado y falte algo
 * (gancho al principio de wabot_comercial_turno, y en wabot_responder cuando
 * el flujo comercial no está en automático). Si Pablo escribe en el chat, el
 * bot se pausa como siempre (control_manual) y el onboarding espera; desde la
 * ficha se retoma con un botón. Si el cliente se corta, a las 22 h le llega un
 * recordatorio (cron, de 9 a 22 h, una vez por pregunta; a las 24 h la ventana
 * de WhatsApp ya está cerrada y no se puede escribir, por eso antes). Al
 * completar: onboarding.completo_ts, aviso a Pablo y la etapa pasa a "listo
 * para producción" en la pestaña Clientes.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';

const WABOT_ONBOARDING_PASOS = ['modelo', 'email', 'imagenes', 'cambios'];
const WABOT_ONBOARDING_FOTOS_MIN = 5;

/* ── Estado ────────────────────────────────────────────────────────────── */

/** ¿Le toca al onboarding este chat? Pagó, arrancó y todavía falta algo. */
function wabot_onboarding_activo($conv, $cfg = null) {
    if (is_array($cfg) && array_key_exists('onboarding_activo', $cfg) && empty($cfg['onboarding_activo'])) return false;
    if (empty($conv['pago_confirmado_ts'])) return false;
    $ob = $conv['onboarding'] ?? null;
    if (!is_array($ob) || empty($ob['inicio_ts'])) return false;
    if (wabot_onboarding_es_version_vieja($ob)) return false;
    return empty($ob['completo_ts']) && empty($ob['cancelado_ts']);
}

/**
 * Los onboarding que arrancaron con la primera versión (1-nov, 20:00: pedía la
 * factura) quedan cancelados: Pablo ya los había atendido a mano y los sigue
 * él. Se reconocen porque pedían o guardaron "factura" / "dominio" / "datos".
 */
function wabot_onboarding_es_version_vieja(array $ob) {
    if (!empty($ob['cancelado_ts'])) return true;
    $viejos = ['factura', 'dominio', 'datos', 'logo', 'fotos'];
    if (in_array((string)($ob['paso'] ?? ''), $viejos, true)) return true;
    foreach ($viejos as $p) if (isset($ob['datos'][$p]) || isset($ob['datos_parciales'][$p])) return true;
    return false;
}

/** ¿La web de esta charla tiene panel con login? Tienda, cursos, inmobiliaria o la informativa con panel. */
function wabot_onboarding_pide_email($conv) {
    $tipo = (string)($conv['tipo'] ?? '');
    if (in_array($tipo, ['ecommerce', 'elearning', 'inmobiliaria'], true)) return true;
    return $tipo === 'landing' && !empty($conv['landing_con_panel']);
}

/** Los pasos que aplican a esta charla (el email solo con login). */
function wabot_onboarding_pasos($conv) {
    return array_values(array_filter(WABOT_ONBOARDING_PASOS, function ($p) use ($conv) {
        return $p !== 'email' || wabot_onboarding_pide_email($conv);
    }));
}

/** El primer paso que falta, o '' si está todo. */
function wabot_onboarding_siguiente_paso($conv) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    foreach (wabot_onboarding_pasos($conv) as $paso) {
        if (!isset($datos[$paso])) return $paso;
    }
    return '';
}

/** Cuántos pasos están resueltos (contestados u omitidos) y cuántos aplican. */
function wabot_onboarding_avance($conv) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    $pasos = wabot_onboarding_pasos($conv);
    return [count(array_intersect_key($datos, array_flip($pasos))), count($pasos)];
}

function wabot_onboarding_paso_label($paso) {
    return ['modelo' => 'el modelo', 'email' => 'el email del panel', 'imagenes' => 'el logo y las fotos', 'cambios' => 'los cambios a la demo'][(string)$paso] ?? (string)$paso;
}

/** Lo que muestra la ficha: "Datos para la web: 2 de 4 · pidiendo el logo y las fotos" o "… completos el d/m". */
function wabot_onboarding_resumen($conv) {
    $ob = $conv['onboarding'] ?? null;
    if (!is_array($ob) || empty($ob['inicio_ts'])) return '';
    [$hechos, $total] = wabot_onboarding_avance($conv);
    if (!empty($ob['completo_ts'])) return 'Datos para la web completos el ' . gmdate('j/n', (int)$ob['completo_ts'] - 3 * 3600);
    $paso = (string)($ob['paso'] ?? '');
    if (!in_array($paso, wabot_onboarding_pasos($conv), true)) $paso = wabot_onboarding_siguiente_paso($conv);
    return 'Datos para la web: ' . $hechos . ' de ' . $total . ($paso !== '' ? ' · pidiendo ' . wabot_onboarding_paso_label($paso) : '');
}

/* ── Textos ────────────────────────────────────────────────────────────── */

function wabot_onboarding_texto($clave, $cfg, $conv = null, array $vars = []) {
    $t = (string)($cfg['onboarding_' . $clave] ?? '');
    if ($t === '') return '';
    if ($vars) $t = strtr($t, $vars);
    if (strpos($t, '{saludo}') !== false) {
        $t = str_replace('{saludo}', wabot_saludo_hora(time()), $t);
    }
    return trim(is_array($conv) && function_exists('wabot_personalizar') ? wabot_personalizar($t, $conv) : $t);
}

/** La pregunta de un paso, con lo que ya se sabe de la charla. */
function wabot_onboarding_pregunta($paso, $conv, $cfg) {
    if ($paso === 'imagenes') {
        $n = count(wabot_onboarding_imagenes_desde($conv, (int)($conv['onboarding']['imagenes_desde_ts'] ?? 0)));
        if ($n > 0 && $n < WABOT_ONBOARDING_FOTOS_MIN) return wabot_onboarding_texto('imagenes_faltan', $cfg, $conv, ['{recibidas}' => wabot_onboarding_plural($n)]);
    }
    return wabot_onboarding_texto($paso, $cfg, $conv);
}

function wabot_onboarding_plural($n) {
    return $n === 1 ? '1 imagen' : $n . ' imágenes';
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
    $ob = ['inicio_ts' => $ahora, 'paso' => '', 'datos' => [], 'preguntado_ts' => 0, 'recordatorio_ts' => 0, 'completo_ts' => 0, 'imagenes_desde_ts' => 0, 'pendiente_apertura' => true];
    // Lo que ya se sabe no se vuelve a pedir: el modelo que eligió al ver la demo.
    $modelo = wabot_onboarding_modelo_sabido($conv);
    if ($modelo !== '') $ob['datos']['modelo'] = ['valor' => $modelo, 'ts' => $ahora, 'origen' => 'charla'];
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

/** Anota qué se está preguntando y desde cuándo (para el recordatorio y para contar imágenes). */
function wabot_onboarding_preguntar(&$conv, $paso, $ahora) {
    $conv['onboarding']['paso'] = $paso;
    $conv['onboarding']['preguntado_ts'] = (int)$ahora;
    if ($paso === 'imagenes' && empty($conv['onboarding']['imagenes_desde_ts'])) $conv['onboarding']['imagenes_desde_ts'] = (int)$ahora;
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

    // Un paso que ya no existe (una charla arrancada con la versión anterior, que pedía la factura): se sigue con lo que sí se pide.
    if ((string)($ob['paso'] ?? '') !== '' && !in_array((string)$ob['paso'], wabot_onboarding_pasos($conv), true)) {
        $paso = wabot_onboarding_siguiente_paso($conv);
        if ($paso === '') { unset($ob); return wabot_onboarding_completar($conv, $cfg, $ahora, $deps); }
        wabot_onboarding_preguntar($conv, $paso, $ahora);
        unset($ob);
        return [wabot_onboarding_pregunta($paso, $conv, $cfg)];
    }

    // La apertura que no pudo salir (ventana cerrada) sale ahora que el cliente escribió.
    if (!empty($ob['pendiente_apertura']) || (string)($ob['paso'] ?? '') === '') {
        $paso = wabot_onboarding_siguiente_paso($conv);
        if ($paso === '') { unset($ob); return wabot_onboarding_completar($conv, $cfg, $ahora, $deps); }
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
         * pedía el modelo, contestó otra cosa y el bot se calló. Primero se mira
         * si es la respuesta de OTRO paso que falta (el modelo, el email): se
         * toma y se vuelve a pedir lo de ahora. Si no, se repregunta UNA vez.
         * Recién la segunda seguida lo ve Pablo —le suena el aviso— y el bot no
         * insiste; a las 22 h el recordatorio vuelve a pedir lo que falta. */
        $otro = wabot_onboarding_paso_que_contesta($paso, $texto, $conv, $cfg, $ahora);
        if ($otro !== null) {
            [$pasoOtro, $rOtro] = $otro;
            $ob['datos'][$pasoOtro] = ['valor' => $rOtro['dato'], 'ts' => $ahora, 'omitido' => false] + (isset($rOtro['extra']) ? $rOtro['extra'] : []);
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
    if ($r['estado'] === 'esperando') {
        // Imágenes: llegaron algunas, faltan; se avisa cuántas van (una vez por tanda) o nada.
        unset($ob);
        return array_values(array_filter([(string)($r['respuesta'] ?? '')]));
    }
    // ok u omitido: se guarda y se pasa al siguiente.
    $ob['datos'][$paso] = ['valor' => $r['dato'], 'ts' => $ahora, 'omitido' => $r['estado'] === 'omitido'] + (isset($r['extra']) ? $r['extra'] : []);
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
 * [paso, resultado] o null. Solo los que se reconocen sin dudas (el modelo, un
 * email); los de texto libre y los de archivos no, porque se llevarían cualquier cosa.
 */
function wabot_onboarding_paso_que_contesta($pasoActual, $texto, $conv, $cfg, $ahora) {
    $datos = (array)($conv['onboarding']['datos'] ?? []);
    foreach (['modelo', 'email'] as $paso) {
        if ($paso === $pasoActual || isset($datos[$paso]) || !in_array($paso, wabot_onboarding_pasos($conv), true)) continue;
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
    return array_values(array_filter(array_merge($antes, [$cierre])));
}

/** "modelo 2, email, 6 imágenes, cambios": lo que juntó, en una línea. */
function wabot_onboarding_datos_texto($conv) {
    $d = (array)($conv['onboarding']['datos'] ?? []);
    $partes = [];
    foreach (WABOT_ONBOARDING_PASOS as $paso) {
        if (!isset($d[$paso])) continue;
        if (!empty($d[$paso]['omitido'])) { $partes[] = $paso . ': ' . ($paso === 'cambios' ? 'ninguno' : 'no tiene'); continue; }
        $v = $d[$paso]['valor'];
        if ($paso === 'modelo') $partes[] = 'modelo ' . (string)$v;
        elseif ($paso === 'imagenes') $partes[] = count((array)($v['archivos'] ?? [])) . ' imágenes';
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

/** El modelo que dijo: '1', '2' o 'ambos' (una mezcla de los dos); '' si no se entiende. */
function wabot_onboarding_modelo_en($texto) {
    $n = wabot_onboarding_norm($texto);
    /* Un CUIT, un DNI o un teléfono no eligen modelo: "Carlo Bianchi,
     * 20-98765432-1, responsable inscripto" se leía como el modelo 1 (charla
     * en vivo, 2-nov). Los números largos, con o sin guiones, se sacan antes. */
    $n = trim(preg_replace('/\d[\d\s.\-\/]{5,}\d/u', ' ', $n));
    if ($n === '') return '';
    // "Los dos", "combinar", "el 1 con el menú del 2": una mezcla. Si no, el número (o "primero"/"segundo") que nombra.
    if (preg_match('/\b(los dos|las dos|ambos|ambas|combinar|combinacion|mezcla|mezclar|un poco de cada|de cada uno|de los dos|cosas de los dos|mitad y mitad)\b/u', $n)) return 'ambos';
    $uno = preg_match('/\b(1|uno|primero|primera)\b/u', $n);
    $dos = preg_match('/\b(2|dos|segundo|segunda)\b/u', $n);
    if ($uno && $dos) return 'ambos';
    if ($uno) return '1';
    if ($dos) return '2';
    return '';
}

/** El modelo que ya eligió en la charla (campo del post-demo, o lo que dijo después de la demo). */
function wabot_onboarding_modelo_sabido($conv) {
    $m = (string)($conv['modelo_elegido'] ?? '');
    if (in_array($m, ['1', '2', 'ambos'], true)) return $m;
    $desde = (int)($conv['presentado_ts'] ?? 0);
    $elegido = '';
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') !== 'cliente' || (int)($fila['ts'] ?? 0) < $desde) continue;
        $x = wabot_onboarding_modelo_en((string)($fila['t'] ?? ''));
        if ($x !== '') $elegido = $x;
    }
    return $elegido;
}

/** Las imágenes (y archivos) que mandó el cliente desde $desdeTs: [['archivo', 'ts', 'texto']]. */
function wabot_onboarding_imagenes_desde($conv, $desdeTs, $clases = ['imagen', 'documento']) {
    $out = [];
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') !== 'cliente' || (int)($fila['ts'] ?? 0) < (int)$desdeTs) continue;
        if (!in_array((string)($fila['media']['clase'] ?? ''), $clases, true)) continue;
        $out[] = ['archivo' => (string)($fila['media']['archivo'] ?? ''), 'ts' => (int)$fila['ts'], 'texto' => mb_substr((string)($fila['t'] ?? ''), 0, 160)];
    }
    return $out;
}

/** Un email, o ''. */
function wabot_onboarding_email_en($texto) {
    return preg_match('/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/u', (string)$texto, $m) ? mb_strtolower($m[0]) : '';
}

/**
 * Lo que dijo, leído para el paso que se está pidiendo:
 *   ['estado' => ok|omitido|esperando|no_entendi, 'dato' => …, 'respuesta' => texto opcional, 'extra' => campos]
 */
function wabot_onboarding_interpretar($paso, $texto, $conv, $cfg, $ahora) {
    $ob = (array)($conv['onboarding'] ?? []);
    $preguntadoTs = (int)($ob['preguntado_ts'] ?? 0);
    $soloMedia = $texto === '' || preg_match('/^\[(foto|audio|documento|video|sticker|contacto)\]/u', $texto);

    if ($paso === 'imagenes') {
        $desde = (int)($ob['imagenes_desde_ts'] ?? $preguntadoTs);
        $archivos = wabot_onboarding_imagenes_desde($conv, $desde);
        $n = count($archivos);
        $dato = ['archivos' => array_column($archivos, 'archivo'), 'cantidad' => $n];
        if ($n >= WABOT_ONBOARDING_FOTOS_MIN) return ['estado' => 'ok', 'dato' => $dato];
        $nrm = wabot_onboarding_norm($texto);
        if ($n > 0 && preg_match('/\b(listo|ya esta|ya estan|esas son|esas|son esas|con esas|nada mas|solo esas|por ahora esas|eso|es todo|eso es todo)\b/u', $nrm)) return ['estado' => 'ok', 'dato' => $dato];
        if ($n === 0 && wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => $dato, 'extra' => ['nota' => $texto]];
        if ($n > 0 && $soloMedia) {
            // Llegó una tanda: se avisa cuántas van (si mandó varias juntas, el webhook las junta en un turno).
            return ['estado' => 'esperando', 'dato' => $dato, 'respuesta' => wabot_onboarding_texto('imagenes_faltan', $cfg, $conv, ['{recibidas}' => wabot_onboarding_plural($n)])];
        }
        if ($soloMedia) return ['estado' => 'esperando', 'dato' => $dato];
        if (wabot_onboarding_parece_pregunta($texto)) return ['estado' => 'no_entendi', 'dato' => $dato];
        // "Ahí van" / "te mando ahora": se espera sin repreguntar.
        return ['estado' => 'esperando', 'dato' => $dato];
    }
    if ($soloMedia) {
        // Una foto o un audio sin texto en un paso de texto: se espera la respuesta (las imágenes se cuentan después igual).
        return ['estado' => 'esperando', 'dato' => null];
    }
    if ($paso === 'modelo') {
        $m = wabot_onboarding_modelo_en($texto);
        if ($m !== '') return ['estado' => 'ok', 'dato' => $m, 'extra' => ['nota' => $m === 'ambos' ? $texto : '']];
        if (preg_match('/\b(cualquiera|el que vos digas|elegi vos|decidi vos|me da igual|a eleccion|como quieras)\b/u', wabot_onboarding_norm($texto))) return ['estado' => 'omitido', 'dato' => null, 'extra' => ['nota' => $texto]];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'email') {
        $e = wabot_onboarding_email_en($texto);
        if ($e !== '') return ['estado' => 'ok', 'dato' => $e];
        if (wabot_onboarding_parece_pregunta($texto)) return ['estado' => 'no_entendi', 'dato' => null];
        if (wabot_onboarding_omite($texto)) return ['estado' => 'omitido', 'dato' => null, 'extra' => ['nota' => $texto]];
        return ['estado' => 'no_entendi', 'dato' => null];
    }
    if ($paso === 'cambios') {
        if (wabot_onboarding_parece_pregunta($texto) && mb_strlen($texto) < 80) return ['estado' => 'no_entendi', 'dato' => null];
        $n = wabot_onboarding_norm($texto);
        if (preg_match('/^(esta bien asi|asi esta bien|esta bien|asi|no|nada|ninguno|ningun cambio|dejalo asi|perfecto asi|todo bien|me gusta asi|esta perfecto|perfecto)\.?!?$/u', $n)) {
            return ['estado' => 'omitido', 'dato' => '', 'extra' => ['nota' => 'sin cambios']];
        }
        return ['estado' => 'ok', 'dato' => $texto];
    }
    return ['estado' => 'no_entendi', 'dato' => null];
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
        $out['datos'][(string)$paso] = ['valor' => $d['valor'] ?? null, 'at' => $iso($d['ts'] ?? 0), 'omitido' => !empty($d['omitido'])] + (isset($d['nota']) && $d['nota'] !== '' ? ['nota' => (string)$d['nota']] : []);
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
        if (!in_array($paso, wabot_onboarding_pasos($cv), true)) continue;                      // un paso de la versión anterior: lo arregla el próximo turno
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
