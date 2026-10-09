<?php
/**
 * wabot/sugerencias.php — el modo de sugerencias del flujo comercial (plan del 9-oct-2026).
 *
 * Con flujo_comercial = sugerencias, el bot no contesta la charla (salvo la
 * bienvenida): por cada tanda del cliente prepara, con comercial.php, la
 * respuesta que mandaría y la deja en data/sugerencias/<clave>.json para que
 * Pablo la vea en el panel y la mande, la edite o la descarte. Si corresponde
 * cotizar, la sugerencia trae los tres mensajes (propuesta, planes, oferta);
 * si corresponde una persona, trae el motivo y ningún mensaje.
 *
 * Nada de esto toca la charla ni manda nada: los efectos (precio congelado,
 * formulario enviado…) recién se aplican cuando Pablo manda, con lo que de
 * verdad salió. Mandar una sugerencia cuenta como intervención de Pablo (la
 * charla queda en control manual), pero las sugerencias siguen apareciendo
 * mientras dure la prueba. Una sugerencia vieja (el cliente volvió a escribir)
 * no se puede mandar: hay que recalcularla.
 *
 * Lo propuesto y lo que Pablo mandó de verdad quedan en
 * data/sugerencias-log/AAAA-MM.jsonl para revisarlos.
 */

require_once __DIR__ . '/comercial.php';

function wabot_sugerencias_dir() {
    return (string)($GLOBALS['WABOT_TEST_SUGERENCIAS_DIR'] ?? (WABOT_DATA . '/sugerencias'));
}

function wabot_sugerencia_path($clave) {
    return wabot_sugerencias_dir() . '/' . preg_replace('/[^0-9A-Za-z]/', '', (string)$clave) . '.json';
}

function wabot_sugerencia_leer($clave) {
    $s = json_decode((string)@file_get_contents(wabot_sugerencia_path($clave)), true);
    return is_array($s) && !empty($s['id']) ? $s : null;
}

function wabot_sugerencia_guardar($clave, array $s) {
    $dir = wabot_sugerencias_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $ok = wabot_json_guardar_atomico(wabot_sugerencia_path($clave), $s);
    /* La lista del panel se arma desde una caché por fecha del archivo de la
     * charla (9-oct): se le toca la fecha para que la marca 💡 aparezca enseguida. */
    if ($ok && empty($GLOBALS['WABOT_TEST_SIN_RED'])) {
        $ruta = wabot_conv_path($clave);
        if (is_file($ruta)) @touch($ruta);
    }
    return $ok;
}

/**
 * La huella de la charla sobre la que se pensó la sugerencia: cualquier línea
 * nueva (del cliente, de Pablo o del bot) o un cambio de estado la invalida.
 */
function wabot_sugerencia_huella($conv) {
    $t = (array)($conv['transcript'] ?? []);
    $ult = $t ? end($t) : [];
    return md5(implode('|', [count($t), (int)($ult['ts'] ?? 0), (string)($ult['id'] ?? ''), (string)($ult['q'] ?? ''),
        (int)!empty($conv['link_form_enviado']), (int)($conv['form_link_mandado_ts'] ?? 0), (int)($conv['form_completado_ts'] ?? 0),
        (int)($conv['presentado_ts'] ?? 0), (string)($conv['comercial_pausa'] ?? ''), (int)!empty($conv['precio_dado'])]));
}

/** La tanda nueva: los mensajes seguidos del cliente al final de la charla, juntos. ['texto', 'ts']. */
function wabot_sugerencia_tanda($conv) {
    $partes = [];
    $ts = 0;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        $q = (string)($fila['q'] ?? '');
        if ($q === 'sistema') continue;
        if ($q !== 'cliente') break;
        $t = trim((string)($fila['t'] ?? ''));
        // Las marcas de adjunto sin texto no le dicen nada al modelo.
        if ($t !== '' && !preg_match('/^\[(audio|imagen|foto|video|documento|sticker|unsupported|sin texto)[^\]]*\]$/iu', $t)) array_unshift($partes, $t);
        $ts = max($ts, (int)($fila['ts'] ?? 0));
    }
    return ['texto' => implode("\n", $partes), 'ts' => $ts];
}

function wabot_sugerencia_log(array $fila) {
    $dir = (string)($GLOBALS['WABOT_TEST_SUGERENCIAS_LOG_DIR'] ?? (WABOT_DATA . '/sugerencias-log'));
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/' . date('Y-m') . '.jsonl', json_encode($fila + ['ts' => date('c')], JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

/**
 * Prepara la sugerencia para una charla y la guarda. Devuelve la sugerencia o
 * null si no había nada que sugerir (el último mensaje no es del cliente).
 * Si la charla no está en atención (formulario enviado, caso para Pablo…),
 * guarda una sugerencia de tipo `pausa` con el motivo, sin llamar al modelo.
 */
function wabot_sugerencia_generar($clave, $cfg, $forzar = false) {
    $conv = wabot_conv_load($clave);
    $tanda = wabot_sugerencia_tanda($conv);
    $t = (array)($conv['transcript'] ?? []);
    $ult = $t ? end($t) : [];
    if (!$forzar && (($ult['q'] ?? '') !== 'cliente')) return null;
    $base = [
        'id' => substr(md5($clave . '|' . microtime(true) . '|' . mt_rand()), 0, 12),
        'clave' => (string)wabot_conversation_key($conv),
        'ts' => time(),
        'base_ts' => (int)($ult['ts'] ?? 0),
        'huella' => wabot_sugerencia_huella($conv),
        'estado' => 'pendiente',
        'cliente' => mb_substr($tanda['texto'], 0, 3000),
        'accion' => '', 'solucion' => 'sin_definir', 'intencion' => 'ninguna', 'motivo' => '',
        'mensajes' => [], 'resumen' => null, 'modelo' => '', 'segundos' => null, 'costo_usd' => 0.0, 'ajustes' => [],
    ];
    [$ok, $motivo] = wabot_comercial_elegible($conv, $cfg, 'sugerencias');
    if (!$ok) {
        $s = $base + [];
        $s['accion'] = 'pausa';
        $s['motivo'] = $motivo;
        wabot_sugerencia_guardar_si_vigente($clave, $s);
        return $s;
    }
    if (trim($tanda['texto']) === '') {
        $s = $base;
        $s['accion'] = 'pausa';
        $s['motivo'] = 'El cliente mandó un archivo o un audio que no se pudo leer: miralo en el chat.';
        wabot_sugerencia_guardar_si_vigente($clave, $s);
        return $s;
    }
    $GLOBALS['WABOT_IA_CLAVE'] = $clave;
    $res = wabot_comercial_decidir($tanda['texto'], $conv, $cfg, 'sugerencia');
    $s = $base;
    if (!$res['ok']) {
        $s['accion'] = 'error';
        $s['motivo'] = 'No se pudo preparar la sugerencia (' . (string)$res['error'] . '). Probá "Recalcular" o contestá vos.';
        $s['costo_usd'] = (float)($res['gastado']['costo_usd'] ?? 0);
        wabot_log('sugerencia_error', ['tel' => $clave, 'error' => (string)$res['error']]);
        wabot_sugerencia_guardar_si_vigente($clave, $s);
        return $s;
    }
    $d = $res['decision'];
    $ajustes = $res['ajustes'];
    $b = $res['b'];
    $r = ['modelo' => $res['modelo'], 'segundos' => $res['segundos'], 'gastado' => $res['gastado']];
    // Lo que vio el revisor (corrigió algo, o le quedan dudas): la tarjeta se lo muestra a Pablo.
    $s['revision'] = $res['revision'];
    $s['accion'] = $b['accion'];
    $s['solucion'] = $b['solucion'];
    $s['intencion'] = $b['intencion'];
    $s['motivo'] = (string)($b['motivo'] ?? '');
    $s['mensajes'] = array_map(function ($m) {
        return ['t' => (string)$m['t'], 'efecto' => (string)$m['efecto'], 'etiqueta' => wabot_comercial_etiqueta($m['efecto'])];
    }, $b['mensajes']);
    $s['resumen'] = $b['resumen'];
    $s['decision'] = $d;
    $s['ajustes'] = $ajustes;
    $s['modelo'] = (string)($r['modelo'] ?? '');
    $s['segundos'] = $r['segundos'] ?? null;
    $s['costo_usd'] = round((float)($r['gastado']['costo_usd'] ?? 0), 6);
    if ($s['accion'] === 'esperar' && !$s['mensajes']) {
        $s['motivo'] = $s['intencion'] === 'rechaza' ? 'El cliente no quiere avanzar: no hace falta contestar.' : 'No hace falta contestar (acuse de recibo o mensaje incompleto).';
    }
    wabot_sugerencia_guardar_si_vigente($clave, $s);
    wabot_log('sugerencia', ['tel' => $clave, 'accion' => $s['accion'], 'solucion' => $s['solucion'], 'mensajes' => count($s['mensajes'])]);
    return $s;
}

/** Guarda, salvo que ya haya una sugerencia pensada sobre una charla más nueva (dos webhooks pensando a la vez). */
function wabot_sugerencia_guardar_si_vigente($clave, array $s) {
    $actual = wabot_sugerencia_leer($clave);
    if ($actual && ($actual['estado'] ?? '') === 'pendiente' && (int)($actual['base_ts'] ?? 0) > (int)($s['base_ts'] ?? 0)) return false;
    return wabot_sugerencia_guardar($clave, $s);
}

/** Lo llama el webhook al terminar un turno: si el cliente quedó sin respuesta, se piensa la sugerencia. */
function wabot_sugerencia_tras_turno($clave, $cfg) {
    if (wabot_flujo_comercial($cfg) !== 'sugerencias') return null;
    if (stripos((string)$clave, 'TEST') !== false && empty($GLOBALS['WABOT_TEST_SUGERENCIAS_DIR'])) return null;
    $conv = wabot_conv_load($clave);
    $t = (array)($conv['transcript'] ?? []);
    $ult = $t ? end($t) : [];
    if (($ult['q'] ?? '') !== 'cliente') return null;
    // Ya hay una sugerencia vigente para esta misma charla: no se piensa dos veces.
    $actual = wabot_sugerencia_leer($clave);
    if ($actual && ($actual['estado'] ?? '') === 'pendiente' && ($actual['huella'] ?? '') === wabot_sugerencia_huella($conv)) return $actual;
    return wabot_sugerencia_generar($clave, $cfg);
}

/** La sugerencia como la ve el panel, o null si no hay. `vigente` dice si la charla no cambió desde que se pensó. */
function wabot_sugerencia_para_panel($conv, $cfg = null) {
    $clave = (string)wabot_conversation_key($conv);
    $s = wabot_sugerencia_leer($clave);
    if (!$s) return null;
    if (($s['estado'] ?? '') !== 'pendiente') return null;
    return [
        'id' => (string)$s['id'], 'ts' => (int)$s['ts'], 'estado' => (string)$s['estado'],
        'vigente' => ($s['huella'] ?? '') === wabot_sugerencia_huella($conv),
        'accion' => (string)$s['accion'], 'solucion' => (string)$s['solucion'], 'intencion' => (string)($s['intencion'] ?? ''),
        'motivo' => (string)$s['motivo'],
        'mensajes' => array_values(array_map(function ($m) { return ['t' => (string)$m['t'], 'efecto' => (string)$m['efecto'], 'etiqueta' => (string)($m['etiqueta'] ?? '')]; }, (array)$s['mensajes'])),
        'segundos' => $s['segundos'] ?? null, 'costo_usd' => (float)($s['costo_usd'] ?? 0), 'modelo' => (string)($s['modelo'] ?? ''),
        'ajustes' => (array)($s['ajustes'] ?? []),
        'revision' => wabot_sugerencia_revision_panel($s['revision'] ?? null),
    ];
}

/**
 * Lo que la tarjeta dice del revisor, o null si no hay nada que avisar:
 * corregida (encontró un problema y el bot lo arregló) o dudosa (le sigue
 * viendo un problema: mirala antes de mandar).
 */
function wabot_sugerencia_revision_panel($rev) {
    if (!is_array($rev) || !in_array($rev['estado'] ?? '', ['corregida', 'dudosa', 'frenada'], true)) return null;
    $lista = function ($ps) {
        return array_values(array_map(function ($p) { return ['tipo' => (string)($p['tipo'] ?? 'otro'), 'detalle' => (string)($p['detalle'] ?? '')]; }, (array)$ps));
    };
    return ['estado' => (string)$rev['estado'], 'problemas' => $lista($rev['problemas'] ?? []), 'finales' => $lista($rev['problemas_finales'] ?? [])];
}

/** ¿Hay una sugerencia con mensajes para mandar, vigente, en esta charla? (para la lista del panel) */
function wabot_sugerencia_pendiente($conv) {
    $s = wabot_sugerencia_leer((string)wabot_conversation_key($conv));
    return $s && ($s['estado'] ?? '') === 'pendiente' && !empty($s['mensajes']) && ($s['huella'] ?? '') === wabot_sugerencia_huella($conv);
}

/**
 * Pablo manda la sugerencia (entera o editada). Comprueba que siga vigente,
 * manda cada mensaje por el mismo camino que el panel (con la marca que evita
 * duplicados), lo anota como suyo, toma el control de la charla y aplica los
 * efectos según lo que salió de verdad. $finales: lista de textos en el orden
 * de la sugerencia; '' = ese mensaje no se manda.
 * Devuelve ['ok' => bool, 'enviados' => n, 'error' => '', 'repetido' => bool].
 */
function wabot_sugerencia_enviar($clave, $id, array $finales, $envioId, $cfg) {
    $s = wabot_sugerencia_leer($clave);
    if (!$s || (string)$s['id'] !== (string)$id) return ['ok' => false, 'enviados' => 0, 'error' => 'Esa sugerencia ya no está: recargá el chat.'];
    if (($s['estado'] ?? '') !== 'pendiente') return ['ok' => false, 'enviados' => 0, 'error' => 'Esa sugerencia ya se ' . ($s['estado'] === 'enviada' ? 'mandó' : 'descartó') . '.'];
    $lock = wabot_lock_tomar_esperando($clave, 20, 100000);
    if (!$lock) return ['ok' => false, 'enviados' => 0, 'error' => 'La charla está ocupada (le está llegando un mensaje). Probá en unos segundos.'];
    try {
        $conv = wabot_conv_load($clave);
        if (($s['huella'] ?? '') !== wabot_sugerencia_huella($conv)) {
            return ['ok' => false, 'enviados' => 0, 'error' => 'La charla cambió después de pensar esta sugerencia (escribió el cliente o alguien contestó). Recalculala antes de mandar.', 'desactualizada' => true];
        }
        if (wabot_ventana_restante($conv) <= 0) {
            return ['ok' => false, 'enviados' => 0, 'error' => 'Pasaron más de 24 horas desde su último mensaje: WhatsApp no deja responder con texto libre hasta que el cliente vuelva a escribir.'];
        }
        $claveEnvio = wabot_conversation_key($conv);
        $envioId = preg_replace('/[^0-9A-Za-z_-]/', '', (string)$envioId);
        $enviados = [];
        $repetidos = 0;
        $editada = false;
        $idCliente = wabot_sugerencia_ultimo_id_cliente($conv);
        foreach ((array)$s['mensajes'] as $i => $m) {
            $texto = trim((string)($finales[$i] ?? ''));
            if ($texto === '') continue;
            /* Entre un mensaje y el siguiente, unos segundos con el "escribiendo…"
             * (Pablo, 9-oct: "que los 3 mensajes tengan un delay de 4 segundos
             * entre cada uno"), como los lee una persona. */
            if ($enviados) wabot_sugerencia_esperar($conv, $cfg, $idCliente);
            $efecto = (string)($m['efecto'] ?? 'texto');
            if ($texto !== trim((string)$m['t'])) $editada = true;
            // Si Pablo cambió el mensaje, el efecto vale solo si el contenido sigue ahí.
            if ($efecto === 'formulario' && !wabot_texto_tiene_link_form($texto)) $efecto = 'texto';
            if ($efecto === 'planes') { $v = wabot_comercial_montos_de_texto($texto); if ($v['anual'] === '' || $v['mensual'] === '') $efecto = 'texto'; }
            if ($efecto === 'oferta' && !wabot_comercial_texto_es_oferta($texto, $cfg)) $efecto = 'texto';
            $idEnvio = $envioId !== '' ? $envioId . '-' . $i : '';
            if (!wabot_panel_envio_marcar($claveEnvio, $texto, $idEnvio)) { $repetidos++; continue; }
            try {
                $salio = wabot_enviar($conv, $texto);
            } catch (Throwable $e) {
                wabot_panel_envio_liberar($claveEnvio, $texto, $idEnvio);
                throw $e;
            }
            if (!$salio) {
                wabot_panel_envio_liberar($claveEnvio, $texto, $idEnvio);
                if ($enviados) wabot_sugerencia_cerrar_envio($conv, $s, $enviados, $editada, $cfg, 'parcial');
                return ['ok' => false, 'enviados' => count($enviados), 'error' => (wabot_canal($conv) === 'instagram' ? 'Instagram' : 'WhatsApp')
                    . ' rechazó el envío' . ($enviados ? ' del mensaje ' . ($i + 1) . ' (los anteriores salieron)' : '') . '. Revisá el log en wabot/data/log/.'];
            }
            wabot_conv_transcript($conv, 'humano', $texto);
            $enviados[] = ['t' => $texto, 'efecto' => $efecto];
        }
        if (!$enviados) {
            if ($repetidos > 0) return ['ok' => true, 'enviados' => 0, 'repetido' => true];
            return ['ok' => false, 'enviados' => 0, 'error' => 'No quedó ningún mensaje para mandar.'];
        }
        wabot_sugerencia_cerrar_envio($conv, $s, $enviados, $editada, $cfg, 'enviada');
        return ['ok' => true, 'enviados' => count($enviados), 'repetido' => false];
    } finally {
        wabot_lock_soltar($lock);
    }
}

/** Los segundos entre un mensaje sugerido y el siguiente (comercial.demora_entre_sugeridos). */
function wabot_sugerencia_demora($cfg) {
    return (float)max(0, min(20, (float)($cfg['comercial']['demora_entre_sugeridos'] ?? 4)));
}

/** El id del último mensaje del cliente: el "escribiendo…" de WhatsApp se marca sobre él. */
function wabot_sugerencia_ultimo_id_cliente($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (($fila['q'] ?? '') === 'cliente') return trim((string)($fila['id'] ?? ''));
    }
    return '';
}

/** Muestra "escribiendo…" y espera la demora antes del siguiente mensaje. Los tests la saltean. */
function wabot_sugerencia_esperar($conv, $cfg, $idCliente = '') {
    $segundos = wabot_sugerencia_demora($cfg);
    if ($segundos <= 0 || !empty($GLOBALS['WABOT_TEST_SIN_ESPERA'])) return;
    if ($idCliente !== '' || wabot_canal($conv) === 'instagram') {
        try { wabot_escribiendo($conv, $idCliente); } catch (Throwable $e) {}
    }
    usleep((int)($segundos * 1000000));
}

/** Después de mandar: efectos sobre la charla real, control manual, la sugerencia como enviada y el registro. */
function wabot_sugerencia_cerrar_envio(array &$conv, array $s, array $enviados, $editada, $cfg, $resultado) {
    $resumen = is_array($s['resumen'] ?? null) ? $s['resumen'] : ['accion' => 'responder', 'solucion' => $s['solucion'] ?? 'sin_definir'];
    // Lo que de verdad salió manda: una sugerencia "humano" no se manda; si se mandó algo, es una respuesta.
    if (($resumen['accion'] ?? '') === 'humano' || ($resumen['accion'] ?? '') === 'esperar') $resumen['accion'] = 'responder';
    wabot_comercial_efectos_aplicar($conv, $enviados, $resumen, $cfg);
    // Mandar cuenta como intervención de Pablo: las respuestas automáticas no vuelven solas.
    wabot_conv_tomar_control($conv);
    $conv['handoff_pendiente'] = false;
    $conv['comercial_sugerencia_enviada_ts'] = time();
    wabot_conv_save($conv);
    $s['estado'] = $resultado === 'parcial' ? 'enviada' : 'enviada';
    $s['enviada_ts'] = time();
    $s['finales'] = array_map(function ($m) { return $m['t']; }, $enviados);
    $s['editada'] = (bool)$editada;
    wabot_sugerencia_guardar((string)$s['clave'], $s);
    wabot_sugerencia_log([
        'clave' => (string)$s['clave'], 'id' => (string)$s['id'], 'resultado' => $resultado, 'editada' => (bool)$editada,
        'accion' => (string)$s['accion'], 'solucion' => (string)$s['solucion'], 'motivo' => (string)$s['motivo'],
        'cliente' => (string)($s['cliente'] ?? ''),
        'sugeridos' => array_map(function ($m) { return $m['t']; }, (array)$s['mensajes']),
        'finales' => $s['finales'],
    ]);
    wabot_log('sugerencia_enviada', ['tel' => (string)$s['clave'], 'id' => (string)$s['id'], 'mensajes' => count($enviados), 'editada' => (int)$editada]);
}

/** Pablo descartó la sugerencia: queda registrada y no se vuelve a mostrar. */
function wabot_sugerencia_descartar($clave, $id, $motivo = '') {
    $s = wabot_sugerencia_leer($clave);
    if (!$s || (string)$s['id'] !== (string)$id) return false;
    if (($s['estado'] ?? '') !== 'pendiente') return true;
    $s['estado'] = 'descartada';
    $s['descartada_ts'] = time();
    wabot_sugerencia_guardar($clave, $s);
    wabot_sugerencia_log([
        'clave' => (string)$s['clave'], 'id' => (string)$s['id'], 'resultado' => 'descartada', 'editada' => false,
        'accion' => (string)$s['accion'], 'solucion' => (string)$s['solucion'], 'motivo' => (string)$s['motivo'],
        'cliente' => (string)($s['cliente'] ?? ''),
        'sugeridos' => array_map(function ($m) { return $m['t']; }, (array)$s['mensajes']),
        'finales' => [], 'descarte' => mb_substr((string)$motivo, 0, 200),
    ]);
    return true;
}

/** Las últimas filas del registro (de la más nueva a la más vieja), para revisar en el panel o a mano. */
function wabot_sugerencias_log_leer($meses = 2, $max = 200) {
    $dir = (string)($GLOBALS['WABOT_TEST_SUGERENCIAS_LOG_DIR'] ?? (WABOT_DATA . '/sugerencias-log'));
    $filas = [];
    for ($i = 0; $i < max(1, (int)$meses) && count($filas) < $max; $i++) {
        $archivo = $dir . '/' . date('Y-m', strtotime("first day of -$i month")) . '.jsonl';
        $lineas = @file($archivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach (array_reverse($lineas) as $l) {
            $f = json_decode($l, true);
            if (is_array($f)) $filas[] = $f;
            if (count($filas) >= $max) break;
        }
    }
    return $filas;
}
