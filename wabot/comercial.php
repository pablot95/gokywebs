<?php
/**
 * wabot/comercial.php — el flujo comercial unificado (plan de traspaso del 9-oct-2026).
 *
 * Un solo criterio desde el primer mensaje hasta que se manda el formulario de
 * la demo, antes y después del precio: GPT Sol interpreta la charla con contexto
 * (hechos confirmados, cotización previa, última oferta, citas), decide entre
 * responder, cotizar, mandar el formulario, dejarlo a Pablo o esperar, y redacta
 * una propuesta breve adaptada al negocio. Los precios, los planes, la oferta de
 * la demo y el formulario los arma el sistema con los bloques aprobados de
 * textos.php (`comercial`), y cada mensaje del modelo pasa por una red antes de
 * salir (ni montos, ni links, ni promesas).
 *
 * Está separado en tres pasos, para que lo mismo sirva en las pruebas, en el
 * modo de sugerencias (sugerencias.php) y, cuando Pablo lo decida, en automático:
 *   1. wabot_comercial_pensar()   — contexto + modelo + red → decisión;
 *   2. wabot_comercial_validar()  — reglas comerciales y de estado sobre la decisión;
 *   3. wabot_comercial_construir() — los mensajes que vería el cliente, cada uno
 *      con su efecto (propuesta, planes, oferta, formulario…), aplicados sobre
 *      una COPIA de la charla. Los efectos reales (congelar el precio, marcar
 *      el formulario como enviado) recién se aplican sobre la charla de verdad
 *      cuando los mensajes salen (wabot_comercial_efectos_aplicar).
 *
 * Modo (Ajustes → IA, `flujo_comercial`): off (nada de esto corre), sugerencias
 * (prepara la respuesta para que Pablo la mande), auto (contesta solo).
 */

require_once __DIR__ . '/comercial-instrucciones.php';
require_once __DIR__ . '/ab-precios.php';

/* ─────────────────────────────── Modo y catálogo ─────────────────────────────── */

/** off | sugerencias | auto. El panel manda; los tests lo fijan con WABOT_TEST_FLUJO_COMERCIAL. */
function wabot_flujo_comercial($cfg = null) {
    if (isset($GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'])) return (string)$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'];
    $m = trim((string)wabot_ia_ajuste($cfg, 'flujo_comercial'));
    return in_array($m, ['off', 'sugerencias', 'auto'], true) ? $m : 'off';
}

/**
 * Las soluciones que cotizamos (plan del 9-oct): a qué plan van (`informativa`
 * = los montos del sitio profesional; `panel` = los de tienda, cursos e
 * inmobiliaria, que cuestan lo mismo) y qué tipo del motor se guarda en la
 * charla para el boceto, la demo y el panel (`tipo`). El catálogo con pedidos
 * por WhatsApp va con el plan de tienda porque incluye panel; los cursos,
 * virtuales o mixtos con panel, presenciales informativos sin panel; las reservas de turnos
 * también.
 */
function wabot_comercial_soluciones() {
    return [
        'informativa'  => ['plan' => 'informativa', 'tipo' => 'landing',      'nombre' => 'web informativa'],
        // La informativa con panel para que el cliente cambie él mismo el contenido (Pablo, 9-oct a la noche: el plan de $20.000 no tiene panel).
        'informativa_panel' => ['plan' => 'panel',  'tipo' => 'landing',      'nombre' => 'web informativa con panel'],
        'tienda'       => ['plan' => 'panel',       'tipo' => 'ecommerce',    'nombre' => 'tienda online'],
        'catalogo'     => ['plan' => 'panel',       'tipo' => 'ecommerce',    'nombre' => 'catálogo con pedidos por WhatsApp'],
        'cursos'       => ['plan' => 'panel',       'tipo' => 'elearning',    'nombre' => 'web de cursos'],
        'inmobiliaria' => ['plan' => 'panel',       'tipo' => 'inmobiliaria', 'nombre' => 'web inmobiliaria'],
        'reservas'     => ['plan' => 'panel',       'tipo' => 'landing',      'nombre' => 'web con reservas de turnos'],
        'crm'          => ['plan' => null,          'tipo' => 'sistema',      'nombre' => 'sistema de gestión / CRM'],
        'sin_definir'  => ['plan' => null,          'tipo' => null,           'nombre' => ''],
    ];
}

/** Los montos de una cotización en una línea, para el modelo y la revisión: "pago único $330.000 y mensual $30.000". */
function wabot_comercial_cotizacion_resumen($cot) {
    $p = [];
    if (trim((string)($cot['inicial'] ?? '')) !== '') $p[] = 'pago inicial ' . $cot['inicial'] . ' (sin seña) y mensualidad ' . $cot['mensual'] . ' desde el mes siguiente';
    else {
        if (trim((string)($cot['anual'] ?? '')) !== '') $p[] = 'anual ' . $cot['anual'];
        elseif (trim((string)($cot['unico'] ?? '')) !== '') $p[] = 'pago único ' . $cot['unico'];
        $p[] = 'mensual ' . $cot['mensual'];
    }
    return implode(' y ', $p);
}

/** ¿Es una solución estándar, con plan y precio de lista? */
function wabot_comercial_solucion_estandar($solucion) {
    return !empty(wabot_comercial_soluciones()[(string)$solucion]['plan']);
}

/** El tipo de textos.php del que salen los montos de lista de un plan. */
function wabot_comercial_plan_tipo($plan) {
    return $plan === 'informativa' ? 'landing' : 'ecommerce';
}

/**
 * Los montos de lista de un plan: anual, mensual, pago único y seña. El plan
 * internacional (cobros en el exterior, 9-oct) tiene los suyos y no tiene pago
 * único de lista.
 */
function wabot_comercial_montos_lista($plan, $cfg) {
    $t = (array)($cfg['tipos'][wabot_comercial_plan_tipo($plan)] ?? []);
    $m = [
        'anual'   => trim((string)($t['precio'] ?? '')),
        'mensual' => trim((string)($t['mensualidad'] ?? '')),
        'unico'   => trim((string)($t['precio_unico'] ?? '')),
        'sena'    => trim((string)($t['sena'] ?? '')),
        // El pago inicial del modelo B de la prueba de precios (31-oct, ab-precios.php); '' fuera de ese grupo.
        'inicial' => trim((string)($t['inicial'] ?? '')),
    ];
    if ($plan === 'internacional') {
        $i = (array)($cfg['comercial']['internacional'] ?? []);
        $m['anual'] = trim((string)($i['anual'] ?? ''));
        $m['mensual'] = trim((string)($i['mensual'] ?? ''));
        $m['unico'] = '';
        $m['inicial'] = '';
    }
    return $m;
}

/**
 * Una cotización nueva de un plan con los montos de lista. En la prueba de
 * precios (31-oct) lleva el modelo del grupo: en A y B no hay plan anual; en B,
 * el pago inicial. En A2 (2-nov) queda como antes de la prueba: anual, mensual
 * y el pago único de lista por si lo pide.
 */
function wabot_comercial_cotizacion_nueva($plan, $cfg) {
    $l = wabot_comercial_montos_lista($plan, $cfg);
    $c = ['origen' => 'bot', 'plan' => $plan, 'anual' => $l['anual'], 'mensual' => $l['mensual'], 'unico' => $l['unico'], 'ts' => time()];
    $grupo = wabot_ab_grupo_cfg($cfg);
    if ($plan !== 'internacional' && $grupo !== '') {
        $c['modelo'] = $grupo;
        if ($grupo !== 'a2') $c['anual'] = '';
        if ($grupo === 'b') $c['inicial'] = $l['inicial'];
    }
    return $c;
}

/** ¿Tiene montos para mostrar? El mensual y al menos uno de anual, pago único o pago inicial. */
function wabot_comercial_cotizacion_valida($c) {
    if (!is_array($c) || trim((string)($c['mensual'] ?? '')) === '') return false;
    foreach (['anual', 'unico', 'inicial'] as $k) if (trim((string)($c[$k] ?? '')) !== '') return true;
    return false;
}

/** El primer pago de una cotización: el anual, el pago inicial (B) o el pago único (A). */
function wabot_comercial_cotizacion_primer_pago($c) {
    foreach (['anual', 'inicial', 'unico'] as $k) if (trim((string)($c[$k] ?? '')) !== '') return trim((string)$c[$k]);
    return '';
}

/**
 * De qué plan son unos montos (para leer una cotización que no es del flujo
 * nuevo): si coinciden con la lista de un tipo, ese; si no, por el mensual.
 */
function wabot_comercial_plan_por_montos($mensual, $anual, $cfg) {
    $intl = wabot_comercial_montos_lista('internacional', $cfg);
    if ($mensual !== '' && $mensual === $intl['mensual']) return 'internacional';
    foreach (['informativa', 'panel'] as $plan) {
        $l = wabot_comercial_montos_lista($plan, $cfg);
        if (($mensual !== '' && $mensual === $l['mensual']) || ($anual !== '' && $anual === $l['anual'])) return $plan;
    }
    $m = wabot_monto_a_numero($mensual);
    $a = wabot_monto_a_numero($anual);
    $li = wabot_comercial_montos_lista('informativa', $cfg);
    $lp = wabot_comercial_montos_lista('panel', $cfg);
    if ($m > 0) return $m <= (wabot_monto_a_numero($li['mensual']) + wabot_monto_a_numero($lp['mensual'])) / 2 ? 'informativa' : 'panel';
    if ($a > 0) return $a <= (wabot_monto_a_numero($li['anual']) + wabot_monto_a_numero($lp['anual'])) / 2 ? 'informativa' : 'panel';
    return 'panel';
}

/**
 * Pablo le pasó el precio a mano, desde el panel o el celular (2-nov, BLIZZ: el
 * bot había congelado $80.000 + $20.000 de sitio profesional y él cotizó
 * $100.000 + $30.000 con turnos; el link de pago y «Confirmar pago» seguían con
 * lo del bot). Si el mensaje trae un precio completo —la mensualidad y el pago
 * inicial, el anual o el pago único—, ese pasa a ser el congelado de la charla.
 * Con pago inicial es el modelo B. Devuelve si cambió algo.
 */
function wabot_comercial_cotizacion_de_pablo(array &$conv, $texto, $cfg = null) {
    $m = wabot_comercial_montos_de_texto((string)$texto);
    if ($m['mensual'] === '' || ($m['anual'] === '' && $m['unico'] === '' && $m['inicial'] === '')) return false;
    $cfg = is_array($cfg) ? $cfg : wabot_config_load();
    $previa = is_array($conv['comercial_cotizacion'] ?? null) ? $conv['comercial_cotizacion'] : [];
    $plan = wabot_comercial_plan_por_montos($m['mensual'], $m['anual'], $cfg);
    $lista = wabot_comercial_montos_lista($plan, $cfg);
    $cot = ['origen' => 'pablo', 'plan' => $plan, 'anual' => $m['anual'], 'mensual' => $m['mensual'],
            'unico' => $m['unico'] !== '' ? $m['unico'] : ($lista['unico'] ?? ''), 'ts' => time()];
    if ($m['inicial'] !== '') {
        $cot['inicial'] = $m['inicial'];
        $cot['anual'] = '';
        $cot['modelo'] = 'b';
    } elseif (($previa['modelo'] ?? '') !== '' && ($previa['modelo'] ?? '') !== 'b') {
        $cot['modelo'] = $previa['modelo'];
    }
    $mismo = true;
    foreach (['plan', 'anual', 'mensual', 'inicial', 'modelo'] as $k) $mismo = $mismo && (string)($previa[$k] ?? '') === (string)($cot[$k] ?? '');
    if ($mismo) return false;   // ya era ese precio
    $conv['comercial_cotizacion'] = $cot;
    $conv['precio_dado'] = true;
    $conv['precio_cotizado'] = wabot_comercial_cotizacion_primer_pago($cot);
    $conv['mensualidad_cotizada'] = $cot['mensual'];
    $conv['precio_unico_cotizado'] = $cot['unico'];
    $conv['inicial_cotizado'] = (string)($cot['inicial'] ?? '');
    $conv['precio_cotizado_ts'] = $cot['ts'];
    if (($conv['tipo'] ?? '') === 'landing') $conv['landing_con_panel'] = $plan !== 'informativa';
    if (!empty($cot['modelo'])) $conv['ab_grupo'] = $cot['modelo'];
    if (($cot['modelo'] ?? '') === 'b') {
        $conv['precio_modelo'] = 'inicial';
        $conv['sena_cotizada'] = $cot['inicial'];
    } elseif (($cot['anual'] ?? '') !== '') {
        $conv['precio_modelo'] = 'anual';
        $conv['sena_cotizada'] = $lista['sena'] ?? ($conv['sena_cotizada'] ?? '');
    }
    wabot_log('cotizacion_de_pablo', ['tel' => $conv['tel'] ?? '', 'plan' => $plan, 'mensual' => $cot['mensual'],
                                      'inicial' => $cot['inicial'] ?? '', 'anual' => $cot['anual'], 'modelo' => $cot['modelo'] ?? '']);
    return true;
}

/* ─────────────────────────────── Cotización de la charla ─────────────────────────────── */

/**
 * Los montos que dice un texto de planes ("Plan anual: $190.000", "$30.000 por
 * mes", "pago único de $330.000"), o '' donde no hay. Sirve para leer lo que
 * ya le mandó Pablo a mano y para comprobar lo que de verdad salió.
 */
function wabot_comercial_montos_de_texto($texto) {
    $t = (string)$texto;
    $num = function ($m) { return wabot_moneda(wabot_monto_a_numero($m)); };
    $r = ['anual' => '', 'mensual' => '', 'unico' => '', 'inicial' => ''];
    if (preg_match('/plan anual:?\s*\$\s*([\d.]{5,})/iu', $t, $m)
        || preg_match('/\$\s*([\d.]{5,})\s*(por|al|x)\s*a[ñn]o\b/iu', $t, $m)
        || preg_match('/\banual\s*(de|es|sale|son|:)\s*\$\s*([\d.]{5,})/iu', $t, $mm) && ($m = [1 => $mm[2]])) {
        $r['anual'] = $num($m[1]);
    }
    if (preg_match('/plan mensual:?\s*\$\s*([\d.]{5,})/iu', $t, $m)
        || preg_match('/\$\s*([\d.]{5,})\s*(por|al|x)\s*mes\b/iu', $t, $m)
        || preg_match('/\$\s*([\d.]{5,})\s*mensuales\b/iu', $t, $m)
        || preg_match('/\bmensual\s*(de|es|sale|son|:)\s*\$\s*([\d.]{5,})/iu', $t, $mm) && ($m = [1 => $mm[2]])) {
        $r['mensual'] = $num($m[1]);
    }
    if (preg_match('/pago [uú]nico\s*(de|es|sale|son|:)?\s*\$\s*([\d.]{5,})/iu', $t, $m)) $r['unico'] = $num($m[2]);
    // El modelo B de la prueba de precios (31-oct): "precio inicial de $100.000"; a mano, "$100.000 iniciales" (2-nov).
    if (preg_match('/(precio|pago) inicial\s*(de|es|:)?\s*\$\s*([\d.]{5,})/iu', $t, $m)) $r['inicial'] = $num($m[3]);
    elseif (preg_match('/\$\s*([\d.]{5,})\s*iniciales?\b/iu', $t, $m)) $r['inicial'] = $num($m[1]);
    return $r;
}

/**
 * La cotización que ya recibió ESTE cliente, o null. En orden: la del flujo
 * nuevo, la que congeló el motor de antes (precio_dado) y, si no hay ninguna,
 * lo que se le mandó en la charla (Pablo pegando los planes a mano, el bot de
 * antes). Una cotización dada se mantiene aunque la lista haya cambiado (plan
 * del 9-oct): por eso acá nunca se mira la lista.
 */
function wabot_comercial_cotizacion($conv, $cfg) {
    $c = $conv['comercial_cotizacion'] ?? null;
    if (wabot_comercial_cotizacion_valida($c)) return $c;
    if (!empty($conv['precio_dado']) && trim((string)($conv['precio_cotizado'] ?? '')) !== '') {
        $anual = trim((string)$conv['precio_cotizado']);
        $mensual = trim((string)($conv['mensualidad_cotizada'] ?? ''));
        $plan = wabot_comercial_plan_por_montos($mensual, $anual, $cfg);
        $lista = wabot_comercial_montos_lista($plan, $cfg);
        return ['origen' => 'bot', 'plan' => $plan, 'anual' => $anual, 'mensual' => $mensual !== '' ? $mensual : $lista['mensual'],
                'unico' => trim((string)($conv['precio_unico_cotizado'] ?? '')) ?: $lista['unico'], 'ts' => (int)($conv['precio_cotizado_ts'] ?? 0)];
    }
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (!in_array((string)($fila['q'] ?? ''), ['bot', 'humano'], true)) continue;
        $m = wabot_comercial_montos_de_texto((string)($fila['t'] ?? ''));
        if ($m['anual'] === '' && $m['mensual'] === '' && $m['inicial'] === '') continue;
        $plan = wabot_comercial_plan_por_montos($m['mensual'], $m['anual'], $cfg);
        $lista = wabot_comercial_montos_lista($plan, $cfg);
        return array_merge(['origen' => 'chat', 'plan' => $plan, 'anual' => $m['anual'] !== '' ? $m['anual'] : $lista['anual'],
                'mensual' => $m['mensual'] !== '' ? $m['mensual'] : $lista['mensual'], 'unico' => $m['unico'] !== '' ? $m['unico'] : $lista['unico'],
                'ts' => (int)($fila['ts'] ?? 0)],
            // Pablo le pegó el texto del modelo B a mano: pago inicial y mensualidad, sin anual.
            $m['inicial'] !== '' ? ['modelo' => 'b', 'inicial' => $m['inicial'], 'anual' => ''] : []);
    }
    return null;
}

/** ¿Este texto es la oferta de la demo (la de hoy o las de antes)? */
function wabot_comercial_texto_es_oferta($texto, $cfg = null) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    if (strpos($t, 'demo gratis') !== false && (strpos($t, 'antes de decidir') !== false || strpos($t, 'como quedaria') !== false)) return true;
    if (strpos($t, 'primer diseno') !== false && strpos($t, 'sin cargo') !== false && strpos($t, 'queres que lo armemos') !== false) return true;
    // La repregunta cuando un "ok" suelto no alcanzaba (22-oct, wabot_comercial_validar).
    if (strpos($t, 'queres que te armemos la demo') !== false) return true;
    $confirmar = is_array($cfg) ? trim((string)($cfg['comercial']['confirmar_demo'] ?? '')) : '';
    if ($confirmar !== '' && $t === wabot_normalizar_frase($confirmar)) return true;
    return function_exists('wabot_texto_es_oferta_entrega') && wabot_texto_es_oferta_entrega($texto);
}

/** ¿Ya le ofrecimos la demo (el bot nuevo, el de antes o Pablo en la charla)? */
function wabot_comercial_oferta_hecha($conv, $cfg = null) {
    if (!empty($conv['comercial_oferta_ts']) || !empty($conv['oferta_diseno_ts']) || !empty($conv['cta_muestra'])) return true;
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (!in_array((string)($fila['q'] ?? ''), ['bot', 'humano'], true)) continue;
        if ($inicio > 0 && (int)($fila['ts'] ?? 0) < $inicio) break;
        if (wabot_comercial_texto_es_oferta((string)($fila['t'] ?? ''), $cfg)) return true;
    }
    return false;
}

/** ¿Lo último que le mandamos le pregunta algo (que no sea la oferta de la demo)? */
function wabot_comercial_ultimo_pregunta($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        $q = (string)($fila['q'] ?? '');
        if ($q === 'cliente' || $q === 'sistema') continue;
        $t = (string)($fila['t'] ?? '');
        if (wabot_comercial_texto_es_oferta($t)) return false;
        return strpos(function_exists('wabot_texto_sin_links') ? wabot_texto_sin_links($t) : $t, '?') !== false;
    }
    return false;
}

/** ¿Lo último que le mandamos (sin contar al cliente) es la oferta de la demo? */
function wabot_comercial_ultimo_es_oferta($conv, $cfg = null) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        $q = (string)($fila['q'] ?? '');
        if ($q === 'cliente' || $q === 'sistema') continue;
        return wabot_comercial_texto_es_oferta((string)($fila['t'] ?? ''), $cfg);
    }
    return false;
}

/**
 * ¿La oferta de la demo sigue siendo lo último que le planteamos? No, si
 * después le preguntamos otra cosa (22-oct, Geo es acá: tras la oferta le
 * preguntamos "te referís a que el lugar todavía no está funcionando?", contó
 * que todavía no abre y un "Ok" a "Somos de Tigre…" salió como aceptación).
 */
function wabot_comercial_oferta_sigue_abierta($conv, $cfg = null) {
    if (!wabot_comercial_oferta_hecha($conv, $cfg)) return false;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (!in_array((string)($fila['q'] ?? ''), ['bot', 'humano'], true)) continue;
        $t = (string)($fila['t'] ?? '');
        if (wabot_comercial_texto_es_oferta($t, $cfg)) return true;
        if (strpos(function_exists('wabot_texto_sin_links') ? wabot_texto_sin_links($t) : $t, '?') !== false) return false;
    }
    return true;
}

/* ─────────────────────────────── Estado de la charla ─────────────────────────────── */

/**
 * En qué estado comercial está la charla:
 *   atencion   — se puede conversar y cotizar;
 *   formulario — el formulario ya salió (del bot o de Pablo): se callan las
 *                respuestas conversacionales; el recordatorio automático sigue;
 *   postdemo   — la demo ya se entregó (1-nov): la etapa post-demo, que atiende
 *                el flujo solo con «Bot después de la demo» prendido
 *                (wabot_comercial_postdemo_elegible);
 *   humano     — derivada por un caso especial: no responde ni se reactiva sola;
 *   rechazo    — el cliente dijo que no: sin recordatorios para avanzar.
 */
function wabot_comercial_estado($conv) {
    $p = (string)($conv['comercial_pausa'] ?? '');
    if ($p === 'rechazo') return $p;
    if ($p === 'humano') {
        /* La pausa vale para ESA pregunta (Pablo, 1-nov: "solo calla en esa"): si
         * el cliente volvió a escribir después, el flujo sigue; si Pablo le
         * contestó, su eco ya puso control_manual y no se llega acá. Antes
         * (27-oct) era para siempre, y una duda sin respuesta oficial dejaba
         * mudo el chat aunque el cliente dijera "dale, quiero la demo". Las
         * charlas pausadas antes de este cambio (sin comercial_pausa_n) siguen
         * en control manual por el tomar_control de entonces. */
        $n = (int)($conv['comercial_pausa_n'] ?? 0);
        $t = (array)($conv['transcript'] ?? []);
        $nuevo = false;
        /* Por la hora del último mensaje del cliente: el índice solo no alcanza,
         * porque el transcript se recorta a 80 renglones al guardar y en una
         * charla larga el mensaje nuevo nunca llegaba al renglón n. */
        $clienteTs = (int)($conv['comercial_pausa_cliente_ts'] ?? 0);
        for ($i = count($t) - 1; $i >= 0; $i--) {
            if (($t[$i]['q'] ?? '') !== 'cliente') continue;
            if ($clienteTs > 0 && (int)($t[$i]['ts'] ?? 0) > $clienteTs) $nuevo = true;
            break;
        }
        for ($i = count($t) - 1; !$nuevo && $i >= $n; $i--) {
            if (($t[$i]['q'] ?? '') === 'cliente') { $nuevo = true; break; }
        }
        if (!$nuevo) return 'humano';
    }
    if (!empty($conv['presentado_ts'])) return 'postdemo';
    if ($p === 'formulario' || !empty($conv['link_form_enviado']) || !empty($conv['form_link_mandado_ts'])
        || (int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['lead_creado'])) return 'formulario';
    return 'atencion';
}

/** ¿Le toca al flujo este turno? [sí/no, motivo visible en el panel]. En sugerencias el control manual no frena. */
function wabot_comercial_elegible($conv, $cfg, $modo = 'auto') {
    if ($modo === 'auto' && (!empty($conv['control_manual']) || !empty($conv['bot_off']))) return [false, 'Lo sigue Pablo (control manual)'];
    $estado = wabot_comercial_estado($conv);
    if ($estado === 'postdemo') return wabot_comercial_postdemo_elegible($conv, $cfg);
    if ($estado === 'formulario') return [false, 'Datos de la demo pedidos (o formulario enviado): lo sigue Pablo. Si manda los datos, el bot arma la ficha.'];
    if ($estado === 'humano') return [false, 'Pendiente para Pablo: ' . (string)($conv['comercial_motivo'] ?? 'caso especial')];
    if ($estado === 'rechazo') return [false, 'El cliente no quiso avanzar'];
    if (!empty($conv['pago_avisado_ts']) || !empty($conv['cliente_id'])) return [false, 'Pago avisado o cliente: lo sigue Pablo'];
    if (in_array((string)($conv['cierre'] ?? ''), ['baja', 'proveedor'], true)) return [false, 'Charla cerrada (' . $conv['cierre'] . ')'];
    if (!empty($conv['contexto_consulta'])) return [false, 'No es una consulta de venta (' . str_replace('_', ' ', (string)$conv['contexto_consulta']) . ')'];
    return [true, ''];
}

/**
 * La etapa post-demo (Pablo, 1-nov): ¿le toca al flujo con la demo ya
 * entregada? Solo con «Bot después de la demo» prendido. Termina cuando avisa
 * que pagó (lo verifica Pablo) o cuando el pago está confirmado
 * (`pago_confirmado_ts`: lo setea el onboarding al verificarlo en Mercado Pago,
 * y desde ahí la charla es suya). `cliente_id` acá no frena: Presentar lo
 * anota siempre (es la ficha del admin desde la que salió la demo), no un pago.
 */
function wabot_comercial_postdemo_elegible($conv, $cfg) {
    if (!wabot_postdemo_bot_activo($cfg)) return [false, 'Demo presentada: lo sigue Pablo'];
    if (!empty($conv['pago_confirmado_ts'])) return [false, 'Pago confirmado: ya es cliente'];
    if (!empty($conv['pago_avisado_ts'])) return [false, 'Avisó que pagó: lo verifica Pablo'];
    if (in_array((string)($conv['cierre'] ?? ''), ['baja', 'proveedor'], true)) return [false, 'Charla cerrada (' . $conv['cierre'] . ')'];
    if (!empty($conv['contexto_consulta'])) return [false, 'No es una consulta de venta (' . str_replace('_', ' ', (string)$conv['contexto_consulta']) . ')'];
    return [true, ''];
}

/**
 * ¿Puede contestar lo simple con el formulario ya mandado? (Pablo, 22-oct:
 * "¿tienen otros trabajos realizados?" quedaba sin respuesta.) Solo mientras
 * el link salió y no lo completó: completo, el bot se apagaba en el chat (10-oct);
 * desde el 11-nov (wabot_bot_hasta_demo_activo, o «Bot después de la demo») también
 * contesta lo simple entre los datos recibidos y la demo (y la confirmación de
 * los 5 minutos sigue igual). Ni con la charla en manos de Pablo, ni si él ya escribió
 * después del link, ni con la demo presentada, el pago avisado o un cliente.
 */
function wabot_comercial_post_form_permitido($conv, $cfg) {
    if (array_key_exists('post_formulario', (array)($cfg['comercial'] ?? [])) && empty($cfg['comercial']['post_formulario'])) return false;
    if (wabot_comercial_estado($conv) !== 'formulario' || (string)($conv['comercial_pausa'] ?? '') === 'humano') return false;
    if (!empty($conv['control_manual']) || !empty($conv['bot_off']) || !empty($conv['archivado'])) return false;
    if (!empty($conv['presentado_ts'])) return false;
    if (((int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['lead_creado'])) && !wabot_bot_hasta_demo_activo($cfg)) return false;
    if (!empty($conv['pago_avisado_ts']) || !empty($conv['cliente_id']) || !empty($conv['contexto_consulta'])) return false;
    if (in_array((string)($conv['cierre'] ?? ''), ['baja', 'proveedor', 'rechazo'], true)) return false;
    $desde = (int)($conv['comercial_pausa_ts'] ?? 0) ?: (int)($conv['form_link_mandado_ts'] ?? 0);
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') === 'humano' && (int)($fila['ts'] ?? 0) >= $desde) return false;
    }
    return true;
}

/**
 * ¿La charla está en manos del bot? (Pablo, 9-oct: "Conversaciones live" muestra
 * solo esas, "para poder yo vigilar bien que conteste bien"; "una vez que me pase
 * el chat a mí, sale de ahí"). Sí mientras el bot puede contestarle (sin control
 * manual, sin pasarla a Pablo, sin formulario mandado, sin rechazo, sin pausa ni
 * archivo) y hay algo que mirar: el bot ya le contestó algo más que la
 * bienvenida, hay una sugerencia esperando, o el cliente le escribió después de
 * nuestro primer mensaje. Las que solo tienen la bienvenida no se vigilan.
 */
function wabot_comercial_bot_tiene($conv, $cfg = null) {
    if (!empty($conv['archivado'])) return false;
    if ((int)($conv['pausado_hasta'] ?? 0) > time() || ($conv['fase'] ?? '') === 'derivado') return false;
    if (!wabot_comercial_elegible($conv, $cfg, 'auto')[0]) return false;
    if (function_exists('wabot_sugerencia_pendiente') && wabot_sugerencia_pendiente($conv)) return true;
    if (function_exists('wabot_conv_bot_conversa_ts') && wabot_conv_bot_conversa_ts($conv) > 0) return true;
    $hablamos = false;
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        $q = (string)($fila['q'] ?? '');
        if ($q === 'bot' || $q === 'humano') $hablamos = true;
        elseif ($q === 'cliente' && $hablamos) return true;
    }
    return false;
}

/**
 * Cuándo y por qué la charla salió de las manos del bot, o null si sigue en
 * ellas (o nunca lo estuvo): para avisar en "Conversaciones live" qué salió.
 */
function wabot_comercial_bot_salio($conv) {
    $p = (string)($conv['comercial_pausa'] ?? '');
    $ts = (int)($conv['comercial_pausa_ts'] ?? 0);
    if ($p === 'humano') return ['ts' => $ts, 'motivo' => 'Te la pasó: ' . trim((string)($conv['comercial_motivo'] ?? 'caso especial'))];
    if ($p === 'formulario') return ['ts' => $ts, 'motivo' => 'Le mandó el formulario: la seguís vos'];
    if ($p === 'rechazo') return ['ts' => $ts, 'motivo' => 'El cliente no quiso avanzar'];
    if (!empty($conv['control_manual'])) return ['ts' => (int)($conv['control_manual_ts'] ?? 0), 'motivo' => 'La tomaste vos'];
    return null;
}

/* ─────────────────────────────── Lo que ve el modelo ─────────────────────────────── */

/**
 * Respuestas oficiales que no viven en `info` pero este flujo necesita pedir
 * por clave: el descuento (plan del 9-oct) y "tengo que pagar algo antes?".
 */
function wabot_comercial_info_extra($cfg) {
    return array_filter([
        'descuento' => trim((string)($cfg['descuento'] ?? '')),
        'pago_antes_demo' => trim((string)($cfg['pago_antes_o_despues'] ?? '')),
    ], 'strlen');
}

/**
 * Las respuestas oficiales que escribió Pablo para la etapa post-demo (1-nov).
 * Hasta el 9-nov ninguna entraba al prompt antes de la demo, y las charlas de
 * octubre las preguntaban antes (si sale en Google, qué pasa si dejo de pagar,
 * si la demo se puede cambiar, la comisión de Mercado Pago, .com o .com.ar) y
 * el bot las derivaba por «no hay respuesta aprobada». Ahora se piden en las
 * dos etapas; solo quedan para después las dos que hablan de la demo entregada.
 */
function wabot_comercial_info_claves_postdemo() {
    return ['google_difusion', 'dominio_com_ar', 'dejo_de_pagar', 'cambios_demo', 'comisiones_mp', 'tiempo_entrega', 'material_web'];
}
/** Las que no tienen sentido antes de la demo: dan por entregada la demo o repiten plazos y que_necesitan. */
function wabot_comercial_info_claves_solo_postdemo() {
    return ['tiempo_entrega', 'material_web'];
}

/** Las claves de respuestas oficiales que puede pedir en este flujo ($postdemo: también las de después de la demo). */
function wabot_comercial_info_claves($cfg, $postdemo = false) {
    $claves = array_values(array_filter(array_keys((array)($cfg['info'] ?? [])), function ($k) use ($postdemo) {
        if (!$postdemo && in_array($k, wabot_comercial_info_claves_solo_postdemo(), true)) return false;
        // turnos dice "incluido, no se paga aparte", y las reservas online son del plan con panel (Pablo, 9-oct): la cubre la solución reservas.
        // carga_pocos la elige el sistema con la cantidad contada (ver wabot_comercial_info_textos).
        return !in_array($k, ['otra', 'rangos', 'turnos', 'carga_pocos'], true);
    }));
    return array_values(array_unique(array_merge($claves, array_keys(wabot_comercial_info_extra($cfg)))));
}

/** La parte B: soluciones, qué incluye cada plan, qué no hacemos y las respuestas oficiales. Igual en cada llamada de la misma etapa (caché). */
function wabot_comercial_info($cfg, $postdemo = false) {
    $l = ['INFORMACIÓN COMERCIAL DE GOKYWEBS (la única fuente válida de precios, plazos, condiciones y funciones)'];
    $l[] = "\nSOLUCIONES Y PLANES (los montos los pone el sistema; vos nunca los escribís):";
    $l[] = '- informativa → plan "informativa" (el más económico). Incluye el desarrollo completo de la web, adaptada para celular, preparada para Google, un cambio por mes (lo hacemos nosotros), hosting, dominio, actualizaciones y soporte técnico. NO tiene panel: el cliente no edita nada solo.';
    $l[] = '- informativa_panel → plan "con panel": la misma web informativa, pero con panel para que el cliente cambie él mismo textos, fotos y servicios. Corresponde si dice que quiere manejar o actualizar el contenido por su cuenta.';
    $l[] = '- tienda, catalogo, cursos, inmobiliaria y reservas → plan "con panel". Incluye lo de la informativa más el panel para autogestionar el contenido: agregar y sacar productos, cambiar precios, imágenes, stock, categorías, banners y ver los pedidos en la tienda; cursos, alumnos y ventas en cursos; propiedades en la inmobiliaria; turnos en reservas, con calendario, horarios y, si la quiere, la seña por Mercado Pago para confirmar el turno (en la propuesta, solo lo que el cliente pidió). Las reservas de turnos online, con o sin seña, son siempre del plan con panel: salen lo mismo que una tienda.';
    $l[] = '- Si la web tiene que cobrarle a clientes del exterior (PayPal u otra pasarela internacional, ventas o cursos para otros países), marcá internacional = true: ese precio no se cotiza, lo pasa una persona. Una web que solo se ve desde otros países sin cobrar no es internacional.';
    // En la prueba de precios (31-oct) cada grupo tiene sus modalidades (comercial.modalidades_gpt de ab-precios).
    $modalidades = trim((string)($cfg['comercial']['modalidades_gpt'] ?? ''));
    $l[] = '- ' . ($modalidades !== '' ? $modalidades
        : 'Las dos modalidades de cada plan son anual (seña y el resto al entregar, renovación al cumplir el año) y mensual (suscripción por Mercado Pago, sin permanencia, no son cuotas de la web). Son alternativas, no se suman. Pago único: solo si pidió comprar la web (pago_unico); el mantenimiento del pago único es opcional y aparte.');
    $l[] = '- La tienda: productos con fotos, precios, stock, variantes y categorías, carrito y compra directa, Mercado Pago, transferencia o efectivo, botón de WhatsApp, precios mayoristas y minoristas, productos a pedido con su demora, envíos con Correo Argentino o Andreani integrados (cálculo por código postal) o costo por provincia, franjas horarias de entrega para que el cliente elija, cupones, estadísticas, usuarios. Se pueden cargar miles de productos (si son muchos, que avisen antes). Cursos: programa, fechas, modalidad, inscripción y pago online, videos y material con acceso propio de cada alumno. Inmobiliaria: fichas con fotos, buscador por zona, tipo y precio, consultas por WhatsApp. Cualquier web: formulario de contacto, mapa, Instagram vinculado, reseñas, videos, hasta 3 idiomas, pixel de Meta y Analytics. Con panel, también espacios de publicidad (banners) que el cliente cambia solo.';
    $l[] = '- Dos webs distintas para el mismo cliente (dos negocios o dos sitios separados): se cotizan juntas con descuento sobre la suma de los dos planes. Marcá solucion (una) y segunda_solucion (la otra): el sistema arma el precio de las dos. Vos nunca escribís esos montos.';
    $l[] = '- Tecnología: desarrollo a medida (HTML, CSS y JavaScript), no WordPress, Tiendanube ni Wix. Se puede tomar una web de referencia visual.';
    $l[] = "\nLO QUE NO ES DE LISTA (accion humano, sin contestar): registro de marca; conexión con Mercado Libre, con el sistema o la API de un proveedor o con un sistema que ya usa; varios vendedores en una web; entrega automática de archivos al pagar; portales con fichas de profesionales o comercios (el de noticias sí es de lista: informativa_panel); apps; sistemas de gestión o CRM; cuotas sin interés; facturación electrónica.";
    $l[] = "LO QUE NO HACEMOS (no se deriva: va la respuesta oficial y seguís con la web): publicidad, redes sociales y marketing → marketing (eso es aparte: la web complementa las redes); diseño de logos → logo; flyers, videos, fotos o imágenes para redes, banners, podcasts o Spotify, recuperar cuentas de Facebook o Instagram, impresiones y tarjetas → no_hacemos.";
    $l[] = "\nRESPUESTAS OFICIALES (clave → texto que manda el sistema; los {marcadores} los completa el sistema con los montos de esta charla). Pedilas en info_claves; nunca las copies ni las parafrasees:";
    /* Sin los ejemplos de «lo preguntan así» (Pablo, 27-oct): eran 88 renglones,
     * 35.800 caracteres, la mitad del prompt, y se pagaban en cada llamada. La
     * clave y el texto de cada respuesta alcanzan para que el modelo la elija. */
    $claves = wabot_comercial_info_claves($cfg, $postdemo);
    foreach ((array)($cfg['info'] ?? []) + wabot_comercial_info_extra($cfg) as $k => $t) {
        if (!in_array($k, $claves, true)) continue;
        $l[] = "- $k: " . mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$t)), 0, 260);
    }
    return implode("\n", $l);
}

/** A (+ D después de la demo, 1-nov) + B. Cada etapa tiene su propia clave de caché (wabot_comercial_pensar). */
function wabot_comercial_instrucciones($cfg, $postdemo = false) {
    return wabot_comercial_instrucciones_comportamiento()
        . ($postdemo ? "\n" . wabot_comercial_instrucciones_postdemo() : '')
        . "\n\n" . wabot_comercial_info($cfg, $postdemo);
}

/**
 * La parte C: los hechos confirmados, el estado comercial (cotización previa,
 * oferta, formulario, Pablo), los mensajes recientes de los dos lados con sus
 * citas, un resumen de lo anterior que conserva lo nuestro y el mensaje nuevo.
 * Los últimos 20 mensajes enteros (27-oct, antes 30: cada uno se paga en cada
 * llamada), lo anterior resumido; el mensaje nuevo hasta 6000 caracteres: un
 * audio largo no pierde el final.
 */
/** Conserva toda la tanda sin respuesta, aunque el disparador traiga solo el último mensaje. */
function wabot_comercial_tanda_pendiente($texto, $conv) {
    $pendientes = [];
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if ($inicio > 0 && (int)($fila['ts'] ?? 0) < $inicio) break;
        $quien = $fila['q'] ?? '';
        if (in_array($quien, ['bot', 'humano'], true)) break;
        if ($quien === 'cliente' && trim((string)($fila['t'] ?? '')) !== '') array_unshift($pendientes, trim($fila['t']));
    }
    $tanda = implode("\n", $pendientes);
    $normalizar = function ($s) { return trim(preg_replace('/\s+/u', ' ', $s)); };
    $nuevo = $normalizar((string)$texto);
    $previo = $normalizar($tanda);
    if ($previo === '' || ($nuevo !== '' && strpos($nuevo, $previo) !== false)) return (string)$texto;
    if ($nuevo === '' || in_array($nuevo, array_map($normalizar, $pendientes), true)
        || $previo === $nuevo || str_starts_with($previo, $nuevo . ' ') || str_ends_with($previo, ' ' . $nuevo)) return $tanda;
    return $tanda . "\n" . $texto;
}

function wabot_comercial_contexto($texto, $conv, $cfg) {
    $texto = wabot_comercial_tanda_pendiente($texto, $conv);
    $f = wabot_ficha($conv);
    $dato = function ($v) { $v = is_array($v) ? implode(', ', array_filter(array_map('strval', $v))) : trim((string)$v); return $v === '' ? '(no lo dijo)' : $v; };
    $funciones = [];
    foreach ((array)$f['funciones'] as $k) $funciones[] = (string)($cfg['funciones_pedidas'][$k] ?? $k);
    $funciones = array_merge($funciones, (array)($f['pedidos_ia'] ?? []));

    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $sesion = array_values(array_filter((array)($conv['transcript'] ?? []), function ($t) use ($inicio) {
        return in_array(($t['q'] ?? ''), ['cliente', 'bot', 'humano'], true) && ($inicio <= 0 || (int)($t['ts'] ?? 0) >= $inicio);
    }));
    // La tanda nueva (los últimos mensajes del cliente) va aparte, entera.
    while ($sesion && ($sesion[count($sesion) - 1]['q'] ?? '') === 'cliente') array_pop($sesion);
    $yaHablo = false; $hablóPablo = false;
    foreach ($sesion as $t) {
        if (($t['q'] ?? '') === 'bot') $yaHablo = true;
        if (($t['q'] ?? '') === 'humano') { $yaHablo = true; $hablóPablo = true; }
    }
    $limite = max(6, min(80, (int)($cfg['comercial']['historial'] ?? 20)));
    $viejos = array_slice($sesion, 0, max(0, count($sesion) - $limite));
    $recientes = array_slice($sesion, -$limite);

    $c = ['LO QUE YA SABEMOS DEL CLIENTE (confirmado: no lo vuelvas a preguntar)'];
    $c[] = '- Nombre: ' . $dato(wabot_nombre_confirmado_de($conv) ?: '');
    $c[] = '- Negocio o marca: ' . $dato($conv['nombre_negocio'] ?? '');
    $c[] = '- Rubro: ' . $dato($f['rubro']);
    $c[] = '- Qué vende u ofrece: ' . $dato($f['que_vende']);
    $c[] = '- Qué quiere lograr con la web: ' . $dato($f['objetivo']);
    $c[] = '- Funciones que pidió: ' . $dato($funciones);
    $c[] = '- Pidió y no hacemos: ' . $dato($f['fuera']);
    if ((int)$f['cantidad_productos'] > 0) $c[] = '- Cantidad de productos: ' . (int)$f['cantidad_productos'];
    if (!empty($conv['quiere_web_propia'])) $c[] = '- Pidió comprar la web o tenerla a su nombre (pago único).';
    $c[] = '- Observaciones: ' . $dato($f['observaciones_ia'] ?? '');

    if (!empty($conv['comercial_pendientes'])) {
        $c[] = "\nDUDAS QUE QUEDARON PENDIENTES (contestalas junto con lo nuevo; si ya las respondió una persona en la charla, no las repitas):";
        foreach ((array)$conv['comercial_pendientes'] as $pendiente) $c[] = '- ' . (string)$pendiente;
    }
    $c[] = "\nESTADO DE LA CHARLA";
    $derivado = is_array($conv['comercial_derivado'] ?? null) ? $conv['comercial_derivado'] : null;
    if ($derivado && trim((string)$derivado['motivo']) !== '' && (int)($derivado['ts'] ?? 0) > time() - 48 * 3600) {
        $c[] = '- Una consulta anterior se la pasamos a una persona del equipo («' . trim((string)$derivado['motivo']) . '»): no la contestes ni la prometas; si la vuelve a preguntar, accion humano. Lo demás seguí contestándolo.';
    }
    $sol = (string)($conv['comercial_solucion'] ?? '');
    if ($sol !== '' && wabot_comercial_solucion_estandar($sol)) $c[] = '- Solución que ya se definió: ' . $sol . '.';
    $cot = wabot_comercial_cotizacion($conv, $cfg);
    if ($cot) {
        $c[] = '- YA LE PASAMOS EL PRECIO' . ($cot['origen'] === 'chat' ? ' (lo mandó una persona del equipo en la charla)' : '')
            . ': plan ' . ($cot['plan'] === 'informativa' ? 'informativa' : 'con panel') . ', ' . wabot_comercial_cotizacion_resumen($cot)
            . '. Esos montos se mantienen. No vuelvas a cotizar salvo que pida el precio otra vez (ahí accion cotizar y el sistema repite los mismos planes).';
    } else {
        $c[] = '- Todavía no le pasamos el precio.';
        // 11-nov (Pablo): un alojamiento va siempre con el plan con panel.
        if (wabot_comercial_es_alojamiento($conv, $texto)) {
            $c[] = '- Es un alojamiento (cabañas, hospedaje, alquiler temporario): el precio es siempre el del plan con panel, aunque coordine las reservas por WhatsApp (solucion informativa_panel; reservas si quiere que reserven desde la web). No le preguntes WhatsApp o reservas para darle el precio ni le pases dos precios.';
        }
    }
    $dosWebs = is_array($conv['comercial_dos_webs'] ?? null) ? $conv['comercial_dos_webs'] : null;
    if ($dosWebs) {
        $c[] = '- YA LE PASAMOS EL PRECIO DE LAS DOS WEBS (' . implode(' y ', (array)$dosWebs['soluciones']) . '): anual ' . $dosWebs['anual'] . ' y mensual '
            . $dosWebs['mensual'] . ' por las dos. Se mantiene: si lo vuelve a pedir, accion cotizar con las mismas solucion y segunda_solucion.';
    }
    if (wabot_comercial_estado($conv) === 'atencion') {
        $c[] = wabot_comercial_oferta_hecha($conv, $cfg)
            ? '- Ya le ofrecimos la demo gratis y todavía no la aceptó: si este mensaje la acepta (aunque sea con otras palabras), accion formulario.'
            : '- Todavía no le ofrecimos la demo: sale sola después de los planes cuando cotizás.';
    } elseif (wabot_comercial_estado($conv) === 'formulario') {
        $porChat = function_exists('wabot_datos_por_chat') && wabot_datos_por_chat($cfg);
        $c[] = ((int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['lead_creado']))
            ? '- Ya tenemos los datos de la demo' . ($porChat ? ' (los mandó por el chat)' : ' (completó el formulario)') . ': la demo se la mandamos nosotros por acá, ' . (function_exists('wabot_form_entrega_frase') ? wabot_form_entrega_frase($conv) : 'en menos de 24 hs')
                . '. Si pregunta cuándo llega, decile eso con tus palabras. No le pidas más datos ni le mandes nada más: lo simple se contesta como en DESPUÉS DE PEDIR LOS DATOS y lo demás es humano.'
                . ' Si manda más material o info para la demo (fotos, logo, horarios, textos, links, cambios a lo que ya pasó), accion responder con un acuse corto de una frase (por ejemplo «¡Recibido! Lo sumamos a la demo»), sin repetir lo que mandó ni prometer nada nuevo.'
            : ($porChat
                ? '- YA LE PEDIMOS LOS DATOS DE LA DEMO POR EL CHAT y todavía no los mandó: seguí lo de DESPUÉS DE PEDIR LOS DATOS. Si este mensaje trae los datos, el sistema ya los tomó antes de llegar a vos.'
                : '- YA LE MANDAMOS EL FORMULARIO DE LA DEMO y todavía no lo completó: seguí lo de DESPUÉS DE PEDIR LOS DATOS.');
    } elseif (wabot_comercial_estado($conv) === 'postdemo') {
        foreach (wabot_comercial_contexto_postdemo($conv, $cfg) as $linea) $c[] = $linea;
    }
    $c[] = '- ' . ($yaHablo ? 'Ya le escribimos antes en esta charla: no lo vuelvas a saludar.' : 'Todavía no le escribimos nada en esta charla.');
    if ($hablóPablo) $c[] = '- Una persona del equipo ya escribió en esta charla (figura como "Gokywebs (persona)"): lo que dijo vale como dicho por nosotros.';
    if (!empty($conv['rubro_preguntado']) && !$cot && wabot_negocio_conocido($conv) === false) {
        $c[] = '- Ya le preguntamos a qué se dedica y no lo dijo: no se lo preguntes dos veces más; si pide el precio o elige una solución, cotizá igual con lo que hay.';
    }
    $c[] = '- Canal: ' . (wabot_canal($conv) === 'instagram' ? 'Instagram' : 'WhatsApp');
    $anuncio = function_exists('wabot_anuncio_contexto_texto') ? wabot_anuncio_contexto_texto($conv) : '';
    if ($anuncio !== '') $c[] = '- Escribió desde un anuncio nuestro: ' . $anuncio . '. Si pide "info" o dice "me interesa", se refiere a lo que ofrece ese anuncio.';

    if ($viejos) {
        $antes = [];
        foreach ($viejos as $t) {
            $quien = ($t['q'] ?? '') === 'cliente' ? 'Cliente' : 'Gokywebs';
            $antes[] = $quien . ': ' . mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$t['t'])), 0, 200);
        }
        $c[] = "\nANTES EN LA CHARLA (resumen de lo más viejo, de los dos lados): " . implode(' | ', array_slice($antes, -20));
    }
    $c[] = "\nÚLTIMOS MENSAJES (del más viejo al más nuevo)";
    if (!$recientes) $c[] = '(ninguno: es el primer mensaje)';
    $porId = function_exists('wabot_lineas_por_id') ? wabot_lineas_por_id($conv, $recientes) : [];
    foreach ($recientes as $t) {
        $esCliente = ($t['q'] ?? '') === 'cliente';
        $quien = $esCliente ? 'Cliente' : (($t['q'] ?? '') === 'humano' ? 'Gokywebs (persona)' : 'Gokywebs');
        $cita = function_exists('wabot_cita_prefijo_ia') ? wabot_cita_prefijo_ia($t, $porId) : '';
        // Lo del cliente (un audio largo) entra casi entero; lo nuestro, más corto.
        $c[] = $quien . ': ' . $cita . mb_substr(trim((string)$t['t']), 0, $esCliente ? 2500 : 1200);
    }
    $citasTanda = function_exists('wabot_tanda_citas_texto') ? wabot_tanda_citas_texto($conv) : '';
    if ($citasTanda !== '') {
        $c[] = "\nEL MENSAJE NUEVO RESPONDE A OTRO MENSAJE (el cliente tocó \"Responder\" sobre él): " . $citasTanda
            . "\nInterpretalo en relación con ESE mensaje, aunque no sea el último de la charla.";
    }
    $c[] = "\nMENSAJE NUEVO DEL CLIENTE (puede venir en varias partes o ser un audio transcripto; leelo entero y respondé todo junto una sola vez)";
    $c[] = '"""' . "\n" . mb_substr(trim((string)$texto), 0, 6000) . "\n" . '"""';
    return implode("\n", $c);
}

/**
 * El estado de la etapa post-demo para el modelo (1-nov): la demo, el modelo y
 * la modalidad que eligió, lo que ya le mandamos (link de pago, datos de
 * transferencia, la pregunta del modelo) y los cambios que pidió.
 */
function wabot_comercial_contexto_postdemo($conv, $cfg) {
    $c = [];
    $slug = trim((string)($conv['presentado_slug'] ?? ''));
    $c[] = '- YA LE MANDAMOS LA DEMO' . ($slug !== '' ? ' (gokywebs.com/demo/' . $slug . ')' : '') . ' el ' . date('d/m H:i', (int)$conv['presentado_ts'])
        . ', con dos modelos (1 y 2): seguí lo de DESPUÉS DE LA DEMO. Nunca la vuelvas a ofrecer ni mandes el formulario.';
    $modelo = (string)($conv['modelo_elegido'] ?? '');
    if ($modelo !== '') $c[] = '- Modelo que eligió: ' . $modelo . '.';
    else $c[] = '- Todavía no dijo cuál de los dos modelos prefiere' . ((int)($conv['postdemo_pregunto_modelo_ts'] ?? 0) > 0 ? ' (ya se lo preguntamos: no se lo vuelvas a preguntar).' : '.');
    $modalidad = ['mensual' => 'plan mensual', 'unico' => 'plan anual', 'propia' => 'pago único', 'inicial' => 'pago inicial + mensualidad'][(string)($conv['modalidad_elegida'] ?? '')] ?? '';
    $c[] = $modalidad !== '' ? '- Modalidad que eligió: ' . $modalidad . '.'
        : '- Todavía no eligió modalidad de pago' . ((int)($conv['postdemo_pregunto_modalidad_ts'] ?? 0) > 0 ? ' (ya se la preguntamos: no se la vuelvas a preguntar).' : '.');
    if ((int)($conv['postdemo_link_pago_ts'] ?? 0) > 0) {
        $c[] = '- Ya le mandamos el link de pago (' . (string)($conv['postdemo_link_pago'] ?? '') . ') el ' . date('d/m H:i', (int)$conv['postdemo_link_pago_ts']) . '.';
    }
    if ((int)($conv['postdemo_transferencia_ts'] ?? 0) > 0) $c[] = '- Ya le pasamos los datos para la transferencia.';
    $cambios = trim((string)($conv['cambios_pedidos'] ?? ''));
    if ($cambios !== '') $c[] = '- Cambios que pidió a la demo (ya anotados): ' . mb_substr(preg_replace('/\s+/u', ' ', $cambios), 0, 300);
    return $c;
}

/** El formato de la decisión (Structured Outputs estricto). Después de la demo (1-nov), con los campos de esa etapa. */
function wabot_comercial_esquema($cfg, $postdemo = false) {
    $texto = function () { return ['type' => ['string', 'null']]; };
    $propiedadesPostdemo = $postdemo ? [
        'modelo_elegido' => ['type' => 'string', 'enum' => ['1', '2', 'ninguno']],
        'quiere_avanzar' => ['type' => 'boolean'],
        'pide_pago' => ['type' => 'boolean'],
        'pide_transferencia' => ['type' => 'boolean'],
        'pide_cambios' => ['type' => 'boolean'],
        'avisa_pago' => ['type' => 'boolean'],
    ] : [];
    return [
        'type' => 'json_schema',
        'name' => $postdemo ? 'turno_postdemo_v1' : 'turno_comercial_v3',
        'strict' => true,
        'schema' => [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => array_merge(['accion', 'solucion', 'segunda_solucion', 'modalidad_clases', 'intencion', 'pago_unico', 'internacional', 'mensajes', 'info_claves', 'motivo', 'ficha'], array_keys($propiedadesPostdemo)),
            'properties' => $propiedadesPostdemo + [
                'accion' => ['type' => 'string', 'enum' => ['responder', 'cotizar', 'formulario', 'humano', 'esperar']],
                'solucion' => ['type' => 'string', 'enum' => array_keys(wabot_comercial_soluciones())],
                'modalidad_clases' => ['type' => 'string', 'enum' => ['no_aplica', 'desconocida', 'presencial', 'virtual', 'mixta']],
                // La otra web, si pide dos distintas (Pablo, 10-oct): se cotizan juntas con descuento.
                'segunda_solucion' => ['type' => 'string', 'enum' => array_merge(array_keys(wabot_comercial_soluciones()), ['ninguna'])],
                'intencion' => ['type' => 'string', 'enum' => ['acepta', 'posterga', 'rechaza', 'condiciona', 'ninguna']],
                'pago_unico' => ['type' => 'boolean'],
                'internacional' => ['type' => 'boolean'],
                'mensajes' => ['type' => 'array', 'items' => ['type' => 'string']],
                'info_claves' => ['type' => 'array', 'items' => ['type' => 'string', 'enum' => wabot_comercial_info_claves($cfg, $postdemo)]],
                'motivo' => $texto(),
                'ficha' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'required' => ['nombre', 'negocio', 'rubro', 'que_vende', 'objetivo', 'necesidad', 'funciones', 'observaciones'],
                    'properties' => [
                        'nombre' => $texto(), 'negocio' => $texto(), 'rubro' => $texto(), 'que_vende' => $texto(), 'objetivo' => $texto(),
                        'necesidad' => ['type' => ['string', 'null'], 'enum' => array_merge(wabot_ficha_necesidades(), [null])],
                        'funciones' => ['type' => 'array', 'items' => ['type' => 'string']],
                        'observaciones' => $texto(),
                    ],
                ],
            ],
        ],
    ];
}

/** Deja la decisión en un formato seguro: enums válidos, textos limpios y topes. */
function wabot_comercial_normalizar($d, $cfg, $postdemo = false) {
    if (!is_array($d)) return null;
    $accion = in_array($d['accion'] ?? '', ['responder', 'cotizar', 'formulario', 'humano', 'esperar'], true) ? $d['accion'] : 'responder';
    $mensajes = [];
    foreach ((array)($d['mensajes'] ?? []) as $m) {
        if (!is_string($m)) continue;
        // El "Perfecto, te podemos armar…" es el arranque real de Pablo: acá no se saca.
        $m = trim(str_replace(["\r\n", "\r"], "\n", $m));
        // Sin punto final en cada renglón (Pablo, 9-oct: "no terminar cada párrafo con punto final"); los "..." quedan.
        $m = preg_replace('/(?<!\.)\.[ \t]*(?=\n|$)/u', '', $m);
        if ($m !== '') $mensajes[] = $m;
    }
    // La brevedad se pide en las instrucciones; nunca se borran respuestas para cumplir un tope.
    // Al cotizar, la propuesta sigue siendo un solo bloque, con todo lo que escribió el modelo.
    if ($accion === 'cotizar' && $mensajes) $mensajes = [implode("\n\n", $mensajes)];
    if (in_array($accion, ['humano', 'esperar'], true)) $mensajes = [];
    $info = array_values(array_intersect(array_unique(array_filter((array)($d['info_claves'] ?? []), 'is_string')), wabot_comercial_info_claves($cfg, $postdemo)));
    $ficha = is_array($d['ficha'] ?? null) ? $d['ficha'] : [];
    $limpiar = function ($v, $max) {
        if (!is_string($v)) return null;
        $v = trim(preg_replace('/\s+/u', ' ', $v));
        return ($v === '' || strtolower($v) === 'null') ? null : mb_substr($v, 0, $max);
    };
    $solucion = (string)($d['solucion'] ?? 'sin_definir');
    $segunda = (string)($d['segunda_solucion'] ?? 'ninguna');
    return [
        'accion' => $accion,
        'solucion' => array_key_exists($solucion, wabot_comercial_soluciones()) ? $solucion : 'sin_definir',
        'modalidad_clases' => in_array($d['modalidad_clases'] ?? '', ['no_aplica', 'desconocida', 'presencial', 'virtual', 'mixta'], true) ? $d['modalidad_clases'] : 'no_aplica',
        'segunda_solucion' => array_key_exists($segunda, wabot_comercial_soluciones()) && $segunda !== 'sin_definir' ? $segunda : null,
        'intencion' => in_array($d['intencion'] ?? '', ['acepta', 'posterga', 'rechaza', 'condiciona', 'ninguna'], true) ? $d['intencion'] : 'ninguna',
        'pago_unico' => !empty($d['pago_unico']),
        'internacional' => !empty($d['internacional']),
        'mensajes' => $mensajes,
        'info_claves' => $info,
        'motivo' => $limpiar($d['motivo'] ?? null, 200),
        // La etapa post-demo (1-nov): lo que marcó el modelo; antes de la demo quedan vacíos.
        'modelo_elegido' => in_array((string)($d['modelo_elegido'] ?? ''), ['1', '2'], true) ? (string)$d['modelo_elegido'] : null,
        'quiere_avanzar' => !empty($d['quiere_avanzar']),
        'pide_pago' => !empty($d['pide_pago']),
        'pide_transferencia' => !empty($d['pide_transferencia']),
        'pide_cambios' => !empty($d['pide_cambios']),
        'avisa_pago' => !empty($d['avisa_pago']),
        'ficha' => [
            'nombre' => $limpiar($ficha['nombre'] ?? null, 60), 'negocio' => $limpiar($ficha['negocio'] ?? null, 80),
            'rubro' => $limpiar($ficha['rubro'] ?? null, 60), 'que_vende' => $limpiar($ficha['que_vende'] ?? null, 120),
            'objetivo' => $limpiar($ficha['objetivo'] ?? null, 160),
            'necesidad' => in_array($ficha['necesidad'] ?? null, wabot_ficha_necesidades(), true) ? $ficha['necesidad'] : null,
            'funciones' => array_values(array_filter(array_map(function ($v) use ($limpiar) { return $limpiar($v, 80); }, array_slice((array)($ficha['funciones'] ?? []), 0, 8)))),
            'observaciones' => $limpiar($ficha['observaciones'] ?? null, 300),
        ],
    ];
}

/**
 * Por qué un mensaje del modelo no se puede mandar, o null. La red de ia.php
 * (montos, plazos, links, promesas, formato interno) más lo que en este flujo
 * nunca va en una propuesta: funciones fuera de lo aprobado.
 */
function wabot_comercial_mensaje_problema($m) {
    // Hablar de un dominio ".com" o ".com.ar" no es mandar un link (la red de ia.php lo tomaba por uno).
    $sinDominios = preg_replace('/(?<![\w\-])\.(com\.ar|com|ar)\b/u', ' ', (string)$m);
    $p = wabot_ia_mensaje_problema($sinDominios);
    if ($p !== null) return $p;
    $t = mb_strtolower((string)$m);
    if (preg_match('/\b(integra\w*|factura\w*|crm|app|aplicaci[oó]n|sistema de gesti[oó]n|cuotas?|sin inter[eé]s|internacional\w*|marketplace|suscripci[oó]n|hosting|dominio)\b/u', $t)) {
        return 'nombra una función o condición que no corresponde';
    }
    /* Nombrar Mercado Libre como el canal donde ya vende está bien ("una tienda
     * propia, además de Mercado Libre"); ofrecer conectarlos, no (10-oct, Charlie:
     * la propuesta lo nombraba, la red la frenó dos veces y el cliente quedó sin respuesta). */
    if (preg_match('/\b(conect\w*|sincroniz\w*|vincul\w*|enlaz\w*|import\w*|linke\w*|api)\b.{0,40}\bmercado ?libre\b|\bmercado ?libre\b.{0,40}\b(conect\w*|sincroniz\w*|vincul\w*|enlaz\w*|import\w*|linke\w*|api)\b/u', $t)) {
        return 'nombra una función o condición que no corresponde';
    }
    if (wabot_comercial_promete_resultados($t)) return 'promete resultados (clientes, ventas o alcance): la web es una herramienta';
    return null;
}

/**
 * ¿Promete que la web sola trae clientes, ventas o alcance? (Pablo, 9-oct: la
 * web es una herramienta; "sin prometer que la web sola trae clientes"). "Si
 * tenés más consultas…" o "si vendés más de un rubro…" no son promesas.
 * Negarlo tampoco ("la web sola no te garantiza más ventas"): con "¿esto
 * aumenta las ventas?" la red frenaba la respuesta honesta dos veces y el
 * cliente se quedaba sin nada (10-oct). "No solo vas a vender más" sí promete.
 */
function wabot_comercial_promete_resultados($texto) {
    $t = mb_strtolower((string)$texto);
    if (!preg_match_all('/\bm[aá]s (clientes|ventas|p[uú]blico|alcance|seguidores|visitas|compradores)\b'
        . '|\b(llegar|llegues|llegue|lleguen|llegás|alcanzar|alcances|alcance|alcancen) a m[aá]s (gente|personas|p[uú]blico|clientes)\b'
        . '|\bvend(er|és|es|e|as|a|an|en|erás|erías|ería|amos)? m[aá]s\b(?! (de|f[aá]cil|r[aá]pido|c[oó]modo|simple|ordenad\w*))'
        . '|\b(atraer|atraiga|atraigas|atrae|atraés|conseguir|consigas|consiga|traer|traiga|traigas|trae|traen|captar|captes|capte|capta) (m[aá]s |nuevos |muchos )?(clientes|ventas|consultas|compradores)\b'
        . '|\b(aument\w*|multiplic\w*|duplic\w*) (tus |las |sus )?(ventas|clientes|consultas)\b|\bgarantiz\w*/u', $t, $hallados, PREG_OFFSET_CAPTURE)) return false;
    foreach ($hallados[0] as [, $pos]) {
        // Las 6 palabras anteriores, sin pasar la coma o el punto: "No te preocupes, vas a vender más" promete.
        $antes = preg_split('/[.,;:!?\n]/u', substr($t, 0, $pos));
        $palabras = preg_split('/\s+/u', trim((string)end($antes)), -1, PREG_SPLIT_NO_EMPTY);
        $frase = implode(' ', array_slice($palabras, -6));
        if (!preg_match('/\b(no|ni|nunca)\b/u', $frase) || preg_match('/\bno s[oó]lo\b/u', $frase)) return true;
    }
    return false;
}

function wabot_comercial_problemas($d) {
    if (!in_array($d['accion'], ['responder', 'cotizar', 'formulario'], true)) return [];
    $problemas = [];
    foreach ($d['mensajes'] as $i => $m) {
        $p = wabot_comercial_mensaje_problema($m);
        if ($p !== null) $problemas[] = 'el mensaje ' . ($i + 1) . ' ' . $p;
    }
    return $problemas;
}

/**
 * Piensa el turno: A+B+C, llamada y red. Si un mensaje no se puede mandar, le
 * pide UNA corrección diciendo por qué; si tampoco sirve, falla (el sistema
 * nunca improvisa: en automático se calla y lo ve Pablo). $modo se anota en el
 * registro de costo: real, sugerencia o prueba.
 */
function wabot_comercial_pensar($texto, $conv, $cfg, $modo = 'real', $revision = null) {
    $clave = (string)wabot_conversation_key($conv);
    // Después de la demo (1-nov): sus instrucciones, su esquema y su propia clave de caché; antes, todo igual que siempre.
    $postdemo = wabot_comercial_estado($conv) === 'postdemo';
    $instrucciones = wabot_comercial_instrucciones($cfg, $postdemo);
    $entrada = [['role' => 'user', 'content' => wabot_comercial_contexto($texto, $conv, $cfg)]];
    // Segunda vuelta pedida por el revisor: su decisión anterior y por qué no se puede mandar.
    if (is_array($revision) && trim((string)($revision['crudo'] ?? '')) !== '') {
        $entrada[] = ['role' => 'assistant', 'content' => (string)$revision['crudo']];
        $entrada[] = ['role' => 'user', 'content' => wabot_comercial_revision_pedido($revision)];
    }
    $opciones = ['usuario' => $clave, 'modo' => $modo, 'max_tokens' => 1800];
    $gastado = ['llamadas' => 0, 'costo_usd' => 0.0];
    $inicio = microtime(true);
    for ($vuelta = 0; $vuelta < 2; $vuelta++) {
        $r = wabot_openai_llamar($postdemo ? 'comercial_postdemo' : 'comercial', $instrucciones, $entrada, wabot_comercial_esquema($cfg, $postdemo), $cfg, $opciones);
        if (!$r['ok']) return ['ok' => false, 'error' => $r['error'], 'gastado' => $gastado];
        $gastado['llamadas']++;
        $gastado['costo_usd'] += (float)($r['uso']['costo_usd'] ?? 0);
        $d = wabot_comercial_normalizar($r['datos'], $cfg, $postdemo);
        if ($d === null) return ['ok' => false, 'error' => 'decision_invalida', 'gastado' => $gastado];
        $problemas = wabot_comercial_problemas($d);
        // Las dudas sobre la decisión piden una sola corrección; si insiste, vale lo suyo.
        if (!$problemas && $vuelta === 0) $problemas = wabot_comercial_dudas($d, $texto, $conv);
        if (!$problemas) {
            return ['ok' => true, 'decision' => $d, 'modelo' => $r['modelo'], 'gastado' => $gastado, 'corregida' => $vuelta > 0,
                    'segundos' => round(microtime(true) - $inicio, 2), 'crudo' => (string)$r['texto']];
        }
        wabot_log('comercial_corrige', ['tel' => $clave, 'problemas' => implode('; ', $problemas)]);
        $entrada[] = ['role' => 'assistant', 'content' => $r['texto']];
        $entrada[] = ['role' => 'user', 'content' => 'Esa respuesta no se puede mandar: ' . implode('; ', $problemas)
            . '. Recordá: nada de montos, plazos, promociones, links, funciones no aprobadas ni promesas de contacto en tus mensajes; para eso están info_claves, cotizar o humano. Devolvé la respuesta corregida.'];
    }
    /* Dos veces el texto no se pudo mandar. Antes se tiraba el turno entero y el cliente quedaba
     * sin respuesta aunque preguntara el precio (21 y 27-oct: «Que precio tiene esto»). Ahora se
     * descarta solo el texto libre: la acción y las respuestas oficiales que eligió siguen, y las
     * reglas de después completan lo que falte (repetir los planes, pedir el rubro). */
    if (isset($d) && is_array($d)) {
        $d['mensajes'] = [];
        if (!wabot_comercial_problemas($d)) {
            $d['_sin_texto'] = true;
            wabot_log('comercial_sin_texto', ['tel' => $clave, 'accion' => (string)($d['accion'] ?? ''), 'info' => implode(',', (array)($d['info_claves'] ?? []))]);
            return ['ok' => true, 'decision' => $d, 'modelo' => $r['modelo'], 'gastado' => $gastado, 'corregida' => true,
                    'segundos' => round(microtime(true) - $inicio, 2), 'crudo' => (string)$r['texto']];
        }
    }
    return ['ok' => false, 'error' => 'mensajes_no_validos', 'gastado' => $gastado];
}

/* ─────────────────────────────── El revisor (Pablo, 9-oct a la noche) ─────────────────────────────── */

/** ¿Está prendido? De fábrica, sí (comercial.revisor). Los tests lo fuerzan con WABOT_TEST_REVISOR. */
function wabot_comercial_revisor_activo($cfg) {
    if (array_key_exists('WABOT_TEST_REVISOR', $GLOBALS)) return (bool)$GLOBALS['WABOT_TEST_REVISOR'];
    return (bool)($cfg['comercial']['revisor'] ?? true);
}

/** Los tipos de problema que marca el revisor, y los que no se mandan aunque la corrección tampoco los arregle. */
function wabot_comercial_revision_tipos() {
    return ['no_contesta', 'contradice', 'incoherente', 'se_desvia', 'repite', 'decide_por_cliente', 'se_saltea_paso', 'inventa', 'promete', 'tono', 'otro'];
}
function wabot_comercial_revision_graves() {
    return ['no_contesta', 'contradice', 'incoherente', 'decide_por_cliente', 'se_saltea_paso', 'inventa', 'promete'];
}
/**
 * Los que frenan la salida aunque el modelo haya corregido dos veces (9-nov).
 * De las 30 charlas frenadas del 12-oct al 7-nov, Pablo terminó mandando a
 * mano lo que el bot ya tenía escrito en 22: el revisor marcaba forma
 * («debería repetir los planes», «no contesta el precio»), no una mentira. Lo
 * que el revisor sigue viendo como inventado, prometido o contradictorio no
 * sale; el resto sale igual, anotado como dudosa y con las dudas pendientes.
 */
function wabot_comercial_revision_frenan() {
    return ['inventa', 'promete', 'contradice'];
}

function wabot_comercial_revision_esquema() {
    return [
        'type' => 'json_schema',
        'name' => 'revision_comercial_v1',
        'strict' => true,
        'schema' => [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['ok', 'problemas', 'falta_contestar'],
            'properties' => [
                'ok' => ['type' => 'boolean'],
                'problemas' => ['type' => 'array', 'items' => [
                    'type' => 'object', 'additionalProperties' => false, 'required' => ['tipo', 'detalle'],
                    'properties' => ['tipo' => ['type' => 'string', 'enum' => wabot_comercial_revision_tipos()], 'detalle' => ['type' => 'string']],
                ]],
                'falta_contestar' => ['type' => 'array', 'items' => ['type' => 'string']],
            ],
        ],
    ];
}

/** Lo que iba a recibir el cliente, como lo lee el revisor: en orden y con su tipo. */
function wabot_comercial_borrador_texto(array $mensajes) {
    if (!$mensajes) return '(sin mensajes: al cliente no se le contesta nada)';
    $l = [];
    foreach (array_values($mensajes) as $i => $m) $l[] = ($i + 1) . '. [' . wabot_comercial_etiqueta($m['efecto'] ?? 'texto') . '] ' . trim((string)($m['t'] ?? ''));
    return implode("\n\n", $l);
}

/**
 * ¿Hace falta revisar? Lo que escribió el modelo o una respuesta oficial, sí.
 * Pasarlo a Pablo, no. Solo bloques fijos o nada: solo si el cliente preguntó
 * algo (que no se saltee la respuesta).
 */
function wabot_comercial_hay_que_revisar(array $b, $texto) {
    if (($b['accion'] ?? '') === 'humano') return false;
    foreach ((array)($b['mensajes'] ?? []) as $m) {
        if (!in_array($m['efecto'] ?? 'texto', ['texto', 'propuesta', 'info'], true)) continue;
        // La repregunta de la demo es un texto fijo del sistema (22-oct): el revisor la frenaba pidiendo el formulario.
        if (($m['efecto'] ?? 'texto') === 'texto' && wabot_comercial_texto_es_oferta((string)($m['t'] ?? ''))) continue;
        return true;
    }
    return function_exists('wabot_mensaje_pregunta_algo') && wabot_mensaje_pregunta_algo($texto);
}

/**
 * Revisa la respuesta que está por salir. Devuelve ['ok' => true|false|null
 * (null: no se pudo revisar), 'problemas' => [[tipo, detalle]], 'falta' => [...],
 * 'gastado' => ...]. Un "no" sin nada concreto no frena.
 */
/**
 * Lo que lee el revisor: sus reglas, un RESUMEN de las del asistente (sin las de
 * Pablo marcaba como error lo que ellas mandan: preguntar "mostrar o vender" a
 * quien vende productos, rebajar cursos a informativa, los dos precios) y la
 * información comercial. Hasta el 27-oct recibía las reglas del asistente tal
 * cual (30.000 caracteres) y los ejemplos: 19k tokens por llamada para marcar
 * algo en el 8 % de los casos; ahora son ~4k.
 */
function wabot_comercial_instrucciones_revisor_completas($cfg, $postdemo = false) {
    return wabot_comercial_instrucciones_revisor()
        . "\n\n" . wabot_comercial_reglas_resumen()
        . ($postdemo ? "\n" . wabot_comercial_reglas_resumen_postdemo() : '')
        . "\n\n" . wabot_comercial_info($cfg, $postdemo);
}

function wabot_comercial_revisar($texto, $conv, $cfg, array $b, $modo = 'real') {
    $postdemo = wabot_comercial_estado($conv) === 'postdemo';
    $instrucciones = wabot_comercial_instrucciones_revisor_completas($cfg, $postdemo);
    $motivo = trim((string)($b['motivo'] ?? ''));
    $borrador = wabot_comercial_borrador_texto((array)($b['mensajes'] ?? []));
    $entrada = wabot_comercial_contexto($texto, $conv, $cfg)
        . "\n\nDECISIÓN DEL ASISTENTE: accion=" . (string)($b['accion'] ?? '') . ', solucion=' . (string)($b['solucion'] ?? '') . ($motivo !== '' ? ', motivo=' . $motivo : '')
        . "\n\nRESPUESTA PROPUESTA (lo que va a recibir el cliente, en orden):\n" . $borrador;
    $clave = (string)wabot_conversation_key($conv);
    $opciones = ['usuario' => $clave, 'max_tokens' => 1800, 'esfuerzo' => 'low'];
    $r = wabot_openai_llamar($postdemo ? 'comercial_revisor_postdemo' : 'comercial_revisor', $instrucciones, [['role' => 'user', 'content' => $entrada]], wabot_comercial_revision_esquema(), $cfg,
        $opciones + ['modo' => $modo, 'modelo' => wabot_comercial_revisor_modelo($cfg)]);
    $res = wabot_comercial_revision_leer($r);

    // La sombra revisa lo mismo con otro modelo, cuando el cliente ya tiene su respuesta.
    $sombra = wabot_comercial_revisor_sombra_modelo($cfg);
    if ($sombra !== '' && $modo !== 'prueba' && $res['ok'] !== null) {
        $datos = ['conv' => $clave, 'modo' => $modo, 'modelo' => (string)($r['modelo'] ?? ''), 'cliente' => (string)$texto, 'borrador' => $borrador];
        wabot_despues(function () use ($sombra, $instrucciones, $entrada, $cfg, $opciones, $res, $datos) {
            wabot_comercial_revisor_sombra_correr($sombra, $instrucciones, $entrada, $cfg, $opciones, $res, $datos);
        });
    }
    return $res;
}

/** Lo que contestó el revisor (o su sombra), ya validado: ok, problemas, falta, gastado. */
function wabot_comercial_revision_leer(array $r) {
    $gastado = ['llamadas' => $r['ok'] ? 1 : 0, 'costo_usd' => (float)($r['uso']['costo_usd'] ?? 0)];
    if (!$r['ok'] || !is_array($r['datos'])) {
        return ['ok' => null, 'problemas' => [], 'falta' => [], 'error' => (string)($r['error'] ?? 'sin_datos'), 'gastado' => $gastado];
    }
    $problemas = [];
    foreach ((array)($r['datos']['problemas'] ?? []) as $p) {
        if (!is_array($p)) continue;
        $detalle = trim((string)($p['detalle'] ?? ''));
        if ($detalle === '') continue;
        $tipo = in_array($p['tipo'] ?? '', wabot_comercial_revision_tipos(), true) ? $p['tipo'] : 'otro';
        $problemas[] = ['tipo' => $tipo, 'detalle' => mb_substr($detalle, 0, 300)];
    }
    $falta = array_values(array_filter(array_map(function ($x) { return mb_substr(trim((string)$x), 0, 200); }, (array)($r['datos']['falta_contestar'] ?? [])), 'strlen'));
    $ok = !empty($r['datos']['ok']) && !$falta && !$problemas;
    if ($falta && !in_array('no_contesta', array_column($problemas, 'tipo'), true)) $problemas[] = ['tipo' => 'no_contesta', 'detalle' => 'Queda sin contestar: ' . implode(' / ', $falta)];
    if (!$ok && !$problemas) $ok = true;
    return ['ok' => $ok, 'problemas' => $ok ? [] : $problemas, 'falta' => $ok ? [] : $falta, 'error' => null, 'gastado' => $gastado];
}

/* ─────────────────────────── El revisor en sombra (Pablo, 14-oct) ───────────────────────────
 * El revisor lee las mismas ~17k fichas de reglas que el asistente para contestar
 * casi siempre "ok", y era un 40% del gasto del flujo comercial. Antes de pasarlo a
 * un modelo más barato, ese modelo revisa en sombra: lee exactamente lo mismo que
 * el revisor de verdad, no decide nada, y se anota qué habría dicho en
 * data/revisor-sombra/ para comparar en la pestaña IA. */

/** El modelo del revisor: el de Ajustes para él o, vacío, el mismo del asistente. */
function wabot_comercial_revisor_modelo($cfg) {
    $m = trim((string)wabot_ia_ajuste($cfg, 'openai_modelo_revisor'));
    return wabot_openai_modelo_valido($m) ? $m : wabot_openai_modelo($cfg);
}

/**
 * El modelo que revisa en sombra, o '' si está apagada. De fábrica APAGADA
 * (27-oct: la comparación con gpt-6-luna ya se hizo —739 casos al 21-oct,
 * frenaba de más el 25% y dejaba pasar 30 de 120— y seguía corriendo en cada
 * turno, 722 llamadas en 8 días sin que nadie las mirara); un modelo en Ajustes
 * la prende. Los tests y las simulaciones (API simulada o sin red) no la corren
 * salvo que la pidan con WABOT_TEST_REVISOR_SOMBRA.
 */
function wabot_comercial_revisor_sombra_modelo($cfg) {
    if (array_key_exists('WABOT_TEST_REVISOR_SOMBRA', $GLOBALS)) {
        $m = (string)$GLOBALS['WABOT_TEST_REVISOR_SOMBRA'];
    } elseif (isset($GLOBALS['WABOT_TEST_OPENAI_HTTP']) || !empty($GLOBALS['WABOT_TEST_SIN_RED'])) {
        return '';
    } else {
        $m = (string)(wabot_ia_ajuste($cfg, 'openai_revisor_sombra') ?? '');
    }
    $m = trim($m);
    return wabot_openai_modelo_valido($m) && $m !== wabot_comercial_revisor_modelo($cfg) ? $m : '';
}

function wabot_comercial_sombra_dir() {
    return (string)($GLOBALS['WABOT_TEST_SOMBRA_DIR'] ?? (WABOT_DATA . '/revisor-sombra'));
}

/**
 * Revisa en sombra y anota la comparación. No cambia nada de la charla ni
 * frena al bot si OpenAI falla (sin_circuito).
 */
function wabot_comercial_revisor_sombra_correr($modelo, $instrucciones, $entrada, $cfg, array $opciones, array $real, array $datos) {
    $r = wabot_openai_llamar('comercial_revisor_sombra', $instrucciones, [['role' => 'user', 'content' => $entrada]], wabot_comercial_revision_esquema(), $cfg,
        $opciones + ['modo' => 'sombra', 'modelo' => $modelo, 'sin_circuito' => true]);
    $s = wabot_comercial_revision_leer($r);
    $resumir = function (array $v) {
        return ['ok' => $v['ok'], 'problemas' => (array)$v['problemas'], 'falta' => (array)$v['falta']];
    };
    $fila = ['ts' => time(), 'conv' => (string)$datos['conv'], 'modo' => (string)$datos['modo'],
             'modelo' => (string)$datos['modelo'], 'modelo_sombra' => (string)($r['modelo'] ?? $modelo),
             'cliente' => mb_substr((string)$datos['cliente'], 0, 600), 'borrador' => mb_substr((string)$datos['borrador'], 0, 1500),
             'real' => $resumir($real), 'sombra' => $resumir($s) + ['error' => $s['ok'] === null ? (string)($r['error'] ?? 'sin_datos') : null],
             'costo_real' => (float)($real['gastado']['costo_usd'] ?? 0), 'costo_sombra' => (float)($s['gastado']['costo_usd'] ?? 0)];
    $dir = wabot_comercial_sombra_dir();
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/' . date('Y-m') . '.jsonl', json_encode($fila, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    return $fila;
}

/**
 * Las comparaciones de los últimos $dias y cuánto coinciden. "De más": la sombra
 * frenaba lo que el revisor aprobó. "De menos": aprobaba lo que el revisor frenó.
 */
function wabot_comercial_sombra_resumen($dias = 7, $limite = 40) {
    $desde = time() - max(1, (int)$dias) * 86400;
    $r = ['comparadas' => 0, 'coinciden' => 0, 'de_mas' => [], 'de_menos' => [], 'fallas' => 0,
          'costo_real' => 0.0, 'costo_sombra' => 0.0, 'modelo_sombra' => ''];
    $meses = array_unique([date('Y-m', $desde), date('Y-m')]);
    foreach ($meses as $mes) {
        foreach (@file(wabot_comercial_sombra_dir() . '/' . $mes . '.jsonl', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $linea) {
            $f = json_decode($linea, true);
            if (!is_array($f) || (int)($f['ts'] ?? 0) < $desde) continue;
            $okReal = $f['real']['ok'] ?? null;
            $okSombra = $f['sombra']['ok'] ?? null;
            if ($okSombra === null) { $r['fallas']++; continue; }
            $r['comparadas']++;
            $r['costo_real'] += (float)($f['costo_real'] ?? 0);
            $r['costo_sombra'] += (float)($f['costo_sombra'] ?? 0);
            $r['modelo_sombra'] = (string)($f['modelo_sombra'] ?? '');
            if ($okReal === $okSombra) $r['coinciden']++;
            elseif ($okReal === true) $r['de_mas'][] = $f;
            else $r['de_menos'][] = $f;
        }
    }
    foreach (['de_mas', 'de_menos'] as $k) {
        usort($r[$k], function ($a, $b) { return (int)$b['ts'] <=> (int)$a['ts']; });
        $r['n_' . $k] = count($r[$k]);
        $r[$k] = array_slice($r[$k], 0, $limite);
    }
    return $r;
}

/** Conserva las dudas hasta que una revisión confirme que quedaron contestadas. */
function wabot_comercial_revision_pendientes(array $revision, array $anteriores = []) {
    $faltan = (array)($revision['falta'] ?? []);
    if (!$faltan) {
        foreach ((array)($revision['problemas'] ?? []) as $p) {
            if (($p['tipo'] ?? '') === 'no_contesta') $faltan[] = (string)$p['detalle'];
        }
    }
    return array_values(array_unique(array_filter(array_merge($anteriores, $faltan), 'strlen')));
}

/** El pedido de corrección para el modelo: qué vio el revisor en lo que iba a salir. */
function wabot_comercial_revision_pedido(array $revision) {
    $l = ['Antes de mandarla, un revisor leyó lo que iba a recibir el cliente y encontró esto:'];
    foreach ((array)($revision['problemas'] ?? []) as $p) $l[] = '- ' . (string)$p['tipo'] . ': ' . (string)$p['detalle'];
    if (!empty($revision['falta'])) $l[] = 'Le falta contestar: ' . implode(' / ', (array)$revision['falta']);
    $l[] = "Lo que iba a recibir:\n" . (string)($revision['borrador'] ?? '');
    $l[] = 'Devolvé la decisión corregida: que conteste lo que preguntó, sin desviarse, sin repetir y sin decidir por el cliente. Las reglas de siempre siguen valiendo (montos, planes, demo y formulario los pone el sistema).';
    if ((int)($revision['intento'] ?? 2) >= 3) {
        $l[] = 'Es la segunda corrección: resolvé exactamente lo señalado. Si pide el precio y ya sabés la solución, accion cotizar; si falta una respuesta oficial, pedila en info_claves; si algo no lo podés contestar con lo aprobado, contestá lo demás igual.';
    }
    return implode("\n", $l);
}

/**
 * Un turno completo: piensa, valida, construye y revisa (Pablo, 9-oct: "que
 * pueda autodarse cuenta de que está desviándose o respondiendo idioteces
 * incoherentes, o si se saltea respuestas"). Si el revisor ve un problema, el
 * modelo corrige con lo que dijo; si lo corregido sigue con un problema grave,
 * en automático corrige UNA vez más (9-nov) y, si el revisor sigue viendo que
 * inventa, promete o contradice, no sale y lo ve Pablo con el motivo; cualquier
 * otro problema sale igual, anotado como dudosa, con las dudas sin contestar
 * pendientes para el turno siguiente (hasta el 9-nov todo problema grave
 * frenaba: 30 charlas en 27 días, 22 contestadas a mano por Pablo con lo que el
 * bot tenía escrito). En sugerencias sale con el aviso para que Pablo decida.
 * Un fallo del revisor nunca borra dudas ya detectadas: quedan pendientes.
 * Devuelve ['ok', 'error', 'decision', 'ajustes', 'b', 'modelo', 'revision', 'gastado', 'segundos'].
 */
function wabot_comercial_decidir($texto, $conv, $cfg, $modo = 'real') {
    $texto = wabot_comercial_tanda_pendiente($texto, $conv);
    // Los textos y montos del grupo de la prueba de precios (31-oct) para todo el turno.
    $cfg = wabot_ab_cfg($cfg, $conv);
    $inicio = microtime(true);
    $gastado = ['llamadas' => 0, 'costo_usd' => 0.0];
    $sumar = function ($g) use (&$gastado) {
        $gastado['llamadas'] += (int)($g['llamadas'] ?? 0);
        $gastado['costo_usd'] += (float)($g['costo_usd'] ?? 0);
    };
    $r = wabot_comercial_pensar($texto, $conv, $cfg, $modo);
    $sumar($r['gastado'] ?? []);
    if (!$r['ok']) return ['ok' => false, 'error' => $r['error'], 'gastado' => $gastado, 'segundos' => round(microtime(true) - $inicio, 2)];
    [$d, $ajustes] = wabot_comercial_validar($r['decision'], $texto, $conv, $cfg);
    $b = wabot_comercial_construir($d, $texto, $conv, $cfg);
    $pendientes = array_values((array)($conv['comercial_pendientes'] ?? []));
    $revision = ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => []];

    if (wabot_comercial_revisor_activo($cfg) && (wabot_comercial_hay_que_revisar($b, $texto) || ($pendientes && $b['accion'] !== 'humano'))) {
        $rev = wabot_comercial_revisar($texto, $conv, $cfg, $b, $modo);
        $sumar($rev['gastado']);
        if ($rev['ok'] === true) {
            $revision['estado'] = 'ok';
            $pendientes = [];
        } elseif ($rev['ok'] === false) {
            $antes = array_map(function ($m) { return (string)$m['t']; }, $b['mensajes']);
            $revision = ['estado' => 'corregida', 'problemas' => $rev['problemas'], 'falta' => $rev['falta'], 'antes' => $antes];
            wabot_log('comercial_revision', ['tel' => (string)wabot_conversation_key($conv), 'modo' => $modo,
                'problemas' => implode(' | ', array_map(function ($p) { return $p['tipo'] . ': ' . $p['detalle']; }, $rev['problemas']))]);
            $r2 = wabot_comercial_pensar($texto, $conv, $cfg, $modo, ['crudo' => (string)($r['crudo'] ?? ''), 'problemas' => $rev['problemas'],
                'falta' => $rev['falta'], 'borrador' => wabot_comercial_borrador_texto($b['mensajes'])]);
            $sumar($r2['gastado'] ?? []);
            $finales = $rev['problemas'];
            $pendientes = wabot_comercial_revision_pendientes($rev, $pendientes);
            if ($r2['ok']) {
                [$d2, $aj2] = wabot_comercial_validar($r2['decision'], $texto, $conv, $cfg);
                $b2 = wabot_comercial_construir($d2, $texto, $conv, $cfg);
                $rev2 = (wabot_comercial_hay_que_revisar($b2, $texto) || ($pendientes && $b2['accion'] !== 'humano')) ? wabot_comercial_revisar($texto, $conv, $cfg, $b2, $modo)
                    : ['ok' => true, 'problemas' => [], 'falta' => [], 'gastado' => []];
                $sumar($rev2['gastado']);
                [$r, $d, $b] = [$r2, $d2, $b2];
                $ajustes = array_merge($aj2, ['revision_corrigio']);
                if ($b2['accion'] === 'humano') {
                    // Derivar resuelve quién sigue, pero no contesta las dudas del cliente.
                    $finales = [];
                } elseif ($rev2['ok'] === true) {
                    $finales = [];
                    $pendientes = [];
                } elseif ($rev2['ok'] === false) {
                    $finales = $rev2['problemas'];
                    $pendientes = wabot_comercial_revision_pendientes($rev2, $pendientes);
                } else {
                    // No sabemos si la corrección resolvió lo observado: conservarlo y pasarlo a Pablo.
                    $revision['error'] = (string)($rev2['error'] ?? 'sin_datos');
                }
            }
            $esGrave = function ($p) { return in_array($p['tipo'], wabot_comercial_revision_graves(), true); };
            if ($finales && array_filter($finales, $esGrave) && $modo !== 'sugerencia' && $r2['ok'] && ($rev2['ok'] ?? null) === false && $b['accion'] !== 'humano') {
                /* Tercer intento (9-nov): la corrección del revisor sobre lo corregido.
                 * Antes acá ya se frenaba, y en la mayoría Pablo mandaba a mano lo mismo. */
                $r3 = wabot_comercial_pensar($texto, $conv, $cfg, $modo, ['crudo' => (string)($r2['crudo'] ?? ''), 'problemas' => $rev2['problemas'],
                    'falta' => $rev2['falta'], 'borrador' => wabot_comercial_borrador_texto($b['mensajes']), 'intento' => 3]);
                $sumar($r3['gastado'] ?? []);
                if ($r3['ok']) {
                    [$d3, $aj3] = wabot_comercial_validar($r3['decision'], $texto, $conv, $cfg);
                    $b3 = wabot_comercial_construir($d3, $texto, $conv, $cfg);
                    $rev3 = (wabot_comercial_hay_que_revisar($b3, $texto) || ($pendientes && $b3['accion'] !== 'humano')) ? wabot_comercial_revisar($texto, $conv, $cfg, $b3, $modo)
                        : ['ok' => true, 'problemas' => [], 'falta' => [], 'gastado' => []];
                    $sumar($rev3['gastado']);
                    [$r, $d, $b] = [$r3, $d3, $b3];
                    $ajustes = array_merge($aj3, ['revision_corrigio', 'revision_tercer_intento']);
                    if ($b3['accion'] === 'humano') {
                        $finales = [];
                    } elseif ($rev3['ok'] === true) {
                        $finales = [];
                        $pendientes = [];
                    } elseif ($rev3['ok'] === false) {
                        $finales = $rev3['problemas'];
                        $pendientes = wabot_comercial_revision_pendientes($rev3, $pendientes);
                    } else {
                        $revision['error'] = (string)($rev3['error'] ?? 'sin_datos');
                    }
                }
            }
            if ($finales) {
                $revision['estado'] = 'dudosa';
                $revision['problemas_finales'] = $finales;
                $graves = array_values(array_filter($finales, $esGrave));
                $frenan = array_values(array_filter($graves, function ($p) {
                    return in_array($p['tipo'], wabot_comercial_revision_frenan(), true);
                }));
                if ($frenan && $modo !== 'sugerencia') {
                    // En automático no sale algo que el revisor sigue viendo inventado, prometido o contradictorio: lo contesta Pablo, con el motivo.
                    $d['accion'] = 'humano';
                    $d['mensajes'] = [];
                    $d['motivo'] = 'Revisión: ' . $frenan[0]['detalle']
                        . ($pendientes ? ' Pendiente: ' . implode(' / ', $pendientes) : '');
                    $b = wabot_comercial_construir($d, $texto, $conv, $cfg);
                    $revision['estado'] = 'frenada';
                    $ajustes[] = 'revision_frenada';
                } elseif ($graves && $modo !== 'sugerencia') {
                    // Sale igual (9-nov): lo que el revisor sigue viendo queda anotado, y lo sin contestar, pendiente.
                    $ajustes[] = 'revision_sale_igual';
                    wabot_log('comercial_revision_sale', ['tel' => (string)wabot_conversation_key($conv), 'modo' => $modo,
                        'problemas' => implode(' | ', array_map(function ($p) { return $p['tipo'] . ': ' . $p['detalle']; }, $graves))]);
                }
            }
        } else {
            $revision['estado'] = 'sin_revisar';
            $revision['error'] = (string)($rev['error'] ?? '');
        }
    }
    /* Si había dudas de otro turno, un fallo del revisor no las da por
     * respondidas: siguen pendientes. Hasta el 9-nov además se derivaba el
     * turno entero, y una duda vieja dejaba sin contestar la pregunta nueva
     * aunque fuera simple. */
    if ($pendientes && $revision['estado'] === 'sin_revisar' && $b['accion'] !== 'humano') {
        $revision['estado'] = 'dudosa';
        $revision['problemas_finales'] = [['tipo' => 'no_contesta', 'detalle' => 'No se pudo verificar la respuesta a: ' . implode(' / ', $pendientes)]];
    }
    if ($pendientes && $b['accion'] === 'humano' && strpos((string)$d['motivo'], 'Pendiente: ') === false) {
        $d['motivo'] = trim((string)$d['motivo'] . ' Pendiente: ' . implode(' / ', $pendientes));
        $b = wabot_comercial_construir($d, $texto, $conv, $cfg);
    }
    $revision['pendientes'] = $pendientes;
    // La copia sirve al turno automático; el resumen sirve al envío de sugerencias.
    $b['conv']['comercial_pendientes'] = $pendientes;
    $b['resumen']['pendientes'] = $pendientes;
    return ['ok' => true, 'error' => null, 'decision' => $d, 'ajustes' => $ajustes, 'b' => $b, 'modelo' => (string)($r['modelo'] ?? ''),
            'revision' => $revision, 'gastado' => $gastado, 'segundos' => round(microtime(true) - $inicio, 2)];
}

/* ─────────────────────────────── Validación comercial ─────────────────────────────── */

/** ¿Sabemos a qué se dedica? Lo que ya estaba en la ficha, lo que entendió el modelo ahora o lo que dice el texto. */
function wabot_comercial_negocio_conocido($conv, $d = null) {
    $f = wabot_ficha($conv);
    if (trim((string)$f['rubro']) !== '' || trim((string)$f['que_vende']) !== '') return true;
    if (is_array($d) && (($d['ficha']['rubro'] ?? null) !== null || ($d['ficha']['que_vende'] ?? null) !== null)) return true;
    return wabot_negocio_conocido($conv) === true;
}

/**
 * Lo que pidió y no es de lista, según las señales de la ficha, o ''. La
 * cantidad de productos ya no deriva (Pablo, 9-oct a la noche: "se pueden
 * cargar miles, que avisen antes"): se contesta con la respuesta oficial.
 */
function wabot_comercial_fuera_de_lista($conv, $cfg) {
    $f = wabot_ficha($conv);
    $nombres = ['mercadolibre' => 'conexión con Mercado Libre', 'integracion' => 'conexión con un sistema que ya usa', 'marketplace' => 'web con varios vendedores',
                'entrega_digital' => 'entrega automática de archivos al pagar'];   // el portal de noticias se cotiza con el plan con panel (Pablo, 10-nov)
    foreach ($nombres as $s => $n) if (in_array($s, (array)$f['senales'], true)) return $n;
    return '';
}

/**
 * Las reglas comerciales y de estado sobre la decisión del modelo (plan del
 * 9-oct). Solo corrigen la acción o suman una respuesta oficial; nunca
 * escriben un texto libre nuevo. Devuelve [decisión, ajustes aplicados].
 */
/**
 * ¿Es un sí corto e inequívoco a la oferta que acabamos de mandar? "Dale",
 * "Sí", "Si porfa", "armala", "me interesa", 👍. Nada más: lo que pregunta, lo
 * que posterga o lo que pide otra cosa ("quiero ver ejemplos") lo lee el modelo.
 */
function wabot_comercial_si_claro($texto) {
    $crudo = function_exists('wabot_oferta_diseno_limpiar') ? wabot_oferta_diseno_limpiar($texto) : trim((string)$texto);
    if ($crudo === '' || mb_strlen($crudo) > 40) return false;
    if (strpos($crudo, '?') !== false || strpos($crudo, '¿') !== false) return false;
    $t = wabot_normalizar_frase($crudo);
    if ($t === '') return function_exists('wabot_acepta_demo') && wabot_acepta_demo($crudo);   // un 👍 solo
    if (function_exists('wabot_oferta_diseno_frena') && wabot_oferta_diseno_frena($t)) return false;
    if (function_exists('wabot_oferta_diseno_si_corto') && wabot_oferta_diseno_si_corto($t)) return true;
    return (bool)preg_match('/^(si+|sip|dale|ok dale|si dale|dale si+|si+ dale|de una|obvio|si+ claro|si+ obvio|me interesa|si+ me interesa'
        . '|armala|armalo|armenla|armenlo|dale armala|dale armalo|si+ armala|si+ armalo|quiero|si+ quiero|me gustaria|si+ me gustaria|listo|vamos|si+ vamos)$/u', $t);
}

/**
 * ¿Pide tiempo? "Dejame que arme los textos y te contesto entre lunes y
 * martes", "lo analizamos con los otros profes y te confirmo", "sería cuando
 * me decida". Más angosto que wabot_oferta_diseno_frena: acá se lee un mensaje
 * anterior, no el sí de ahora, y un "no" o un "pero" sueltos no alcanzan.
 */
function wabot_comercial_texto_posterga($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    if (function_exists('wabot_fecha_prometida') && wabot_fecha_prometida($texto) !== '') return true;
    return (bool)preg_match('/\b(te|le|les) (contesto|aviso|confirmo|vuelvo a escribir)\b|\b(despues|luego|mas tarde) te (escribo|hablo|digo|cuento)\b'
        . '|\b(lo|la) (pienso|pensamos|analiz\w*|convers\w*|charl\w*|consulto|consultamos|hablo|hablamos)\b'
        . '|\b(dejame|dejeme|dejenme|dame|denme) (que|q|ver|pensar\w*|armar|preparar|analizar|consultar|unos dias|un tiempo)\b'
        . '|\bcuando (me decida|lo decida|lo tenga|lo tengamos|tenga|pueda|junte|cobre)\b|\b(mas adelante|otro dia|otro momento|la semana que viene|el mes que viene)\b'
        . '|\bme (comunico|contacto)\b|\bte vuelvo\b/u', $t);
}

/**
 * ¿Después de la última oferta de la demo el cliente pidió tiempo? (Marcela,
 * 1-nov: "te contesto entre lunes y martes" → "Armalo con calma" → "👍 si", y
 * el sí salió como aceptación y le llegó el formulario.) Los mensajes del
 * cliente que llegan ahora (los últimos, ya en el transcript) no cuentan.
 */
/**
 * ¿Posterga en una frase que no es una pregunta? «Y más adelante puedo agregar productos?» o
 * «cuando tenga las fotos se pueden cambiar?» preguntan, no postergan: antes contaban, y el
 * «Dale» que venía después a la oferta de la demo se leía como un acuse y quedaba en silencio
 * (revisión del 10-nov). «…te contesto entre lunes y martes. Te parece bien?» sí posterga: la
 * postergación está en la frase de antes de la pregunta (Marcela, 1-nov).
 */
function wabot_comercial_posterga_fuera_de_pregunta($texto) {
    $frases = preg_split('/(?<=[.!?…])\s+|\R+/u', trim((string)$texto)) ?: [];
    foreach ($frases as $f) {
        $f = trim((string)$f);
        if ($f === '' || mb_strpos($f, '?') !== false || mb_strpos($f, '¿') !== false) continue;
        if (wabot_comercial_texto_posterga($f)) return true;
    }
    return false;
}

function wabot_comercial_postergo_tras_oferta($conv, $cfg = null) {
    $filas = (array)($conv['transcript'] ?? []);
    $i = count($filas) - 1;
    while ($i >= 0 && in_array((string)($filas[$i]['q'] ?? ''), ['cliente', 'sistema'], true)) $i--;
    for (; $i >= 0; $i--) {
        $q = (string)($filas[$i]['q'] ?? '');
        $t = (string)($filas[$i]['t'] ?? '');
        if (in_array($q, ['bot', 'humano'], true) && wabot_comercial_texto_es_oferta($t, $cfg)) return false;
        if ($q === 'cliente' && wabot_comercial_posterga_fuera_de_pregunta($t)) return true;
    }
    return false;
}

/* ───────────── Charlas del 26/27-oct: plan elegido, link que no abre, aviso al derivar, repetidos, re-oferta ───────────── */

/**
 * ¿Elige una modalidad ("Hoy debería ser plan mensual", "me quedo con el
 * anual", "la 1")? Devuelve mensual / unico (= plan anual) / propia (pago
 * único) o null. Primero el detector de siempre (wabot_modalidad_elegida_en) y,
 * si no, una frase corta que nombra UN solo plan con un verbo de decisión y sin
 * pregunta, negación ni pedido de información.
 */
function wabot_comercial_elige_plan($texto, $conv) {
    /* Prueba de precios (31-oct): en A las opciones son 1) pago único y 2) plan
     * mensual, sin anual; en B hay una sola (pago inicial + mensualidad), así que
     * elegir "el mensual" es elegir esa ('inicial') y el pago único sigue valiendo.
     * A2 (2-nov) es 1) anual y 2) mensual, como antes: el detector de siempre. */
    $modelo = (string)($conv['comercial_cotizacion']['modelo'] ?? '');
    if ($modelo === 'a' || $modelo === 'b') {
        $num = preg_match('/^(el |la |opcion |la opcion |plan |el plan )?([12])\)?$/u', wabot_normalizar_frase(trim((string)$texto)), $mm) ? $mm[2] : '';
        if ($modelo === 'a' && $num !== '') return $num === '1' ? 'propia' : 'mensual';
        if ($modelo === 'b' && $num === '1') return 'inicial';
        $e = wabot_comercial_elige_plan_lista($texto, $conv);
        if ($e === 'unico') return $modelo === 'b' ? 'inicial' : null;
        if ($modelo === 'b' && $e === 'mensual') return 'inicial';
        if ($modelo === 'b' && $e === null && preg_match('/\b(pago inicial|el inicial|ese plan|esa opcion|esa modalidad)\b/u', wabot_normalizar_frase((string)$texto))
            && preg_match('/\b(quiero|queremos|vamos|voy|dale|listo|arranco|arrancamos|prefiero|me quedo|nos quedamos|elijo|hago|hacemos)\b/u', wabot_normalizar_frase((string)$texto))
            && strpos((string)$texto, '?') === false && !preg_match('/\b(no|ni|nunca)\b/u', wabot_normalizar_frase((string)$texto))) return 'inicial';
        return $e;
    }
    return wabot_comercial_elige_plan_lista($texto, $conv);
}

/** El detector de siempre, con las modalidades de antes de la prueba (mensual / unico = anual / propia). */
function wabot_comercial_elige_plan_lista($texto, $conv) {
    $crudo = trim((string)$texto);
    if ($crudo === '' || mb_strlen($crudo) > 200) return null;
    if (strpos($crudo, '?') !== false || strpos($crudo, '¿') !== false) return null;
    $t = wabot_normalizar_frase($crudo);
    if ($t === '' || preg_match('/\b(no|ni|tampoco|nunca|cuanto|cuanta|saber|consultar|preguntar|averiguar|entender|info|informacion|detalles?|diferencia|incluye|incluyen|incluido)\b/u', $t)) return null;
    if (function_exists('wabot_modalidad_elegida_en')) {
        $orden = function_exists('wabot_modalidades_unico_primero') && wabot_modalidades_unico_primero($conv) ? 'unico'
            : (function_exists('wabot_modalidades_anual_primero') && wabot_modalidades_anual_primero($conv));
        $e = wabot_modalidad_elegida_en($crudo, true, $orden);
        if ($e !== null) return $e;
    }
    $m = preg_match('/\b(plan mensual|el mensual|mensual)\b/u', $t);
    $a = preg_match('/\b(plan anual|el anual|anual)\b/u', $t);
    $p = preg_match('/\b(pago unico|el unico|unico pago|un solo pago)\b/u', $t);
    if ($m + $a + $p !== 1) return null;
    if (!preg_match('/\b(seria|serian|deberia|deberiamos|debe|va a ser|iria|ire|iriamos|conviene|convendria|sirve|interesa|quedo|quedamos|elijo|elegimos'
        . '|prefiero|preferimos|quiero|queremos|vamos|voy|arranco|arrancamos|empiezo|empezamos|opto|optamos|tomo|tomamos|hago|hacemos|contrato|contratamos'
        . '|hoy|entonces|dale|listo|ok|okey|perfecto|bueno|si)\b/u', $t)) return null;
    return $m ? 'mensual' : ($a ? 'unico' : 'propia');
}

/** "No puedo abrir el link", "el formulario no me carga": el link del formulario le falla. */
function wabot_comercial_link_no_abre($texto, $conv = null) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 220) return false;
    $cosa = '(link|linck|enlace|formulario|form|pagina)';
    $falla = '(abre|abrio|abrir|abrirlo|abrirla|carga|cargo|cargar|anda|funciona|funciono|entra|entrar|ingresar|deja|dejo|llega|llego|aparece|sirve|puedo|pude|pudimos|logro|logre|consigo)';
    if (preg_match('/\b(no|nunca|tampoco|sigue sin|sin poder)\b.{0,25}\b' . $falla . '\b.{0,35}\b' . $cosa . '\b/u', $t)
        || preg_match('/\b' . $cosa . '\b.{0,35}\b(no|nunca|tampoco|sigue sin)\b.{0,20}\b' . $falla . '\b/u', $t)
        || preg_match('/\b' . $cosa . '\b.{0,25}\b(roto|caido|caida|error|mal)\b|\b(error|roto|caido)\b.{0,25}\b' . $cosa . '\b/u', $t)) return true;
    /* "No puedo ingresar", sin decir qué (Miriam, 2-nov: citaba el mensaje del
     * formulario y quedó sin respuesta). Sin la palabra "link" vale solo si es
     * corto, cita ese mensaje o lo último nuestro es el link del formulario. */
    if (!is_array($conv) || mb_strlen($t) > 80 || preg_match('/\b(quiero|ahora|despues|mas tarde|manana|luego)\b/u', $t)) return false;
    if (!preg_match('/\b(no|nunca|tampoco)\b( \w+){0,3}? (abre|abrio|abrir|abrirlo|abrirla|carga|cargo|cargar|anda|funciona|funciono|entra|entro|entrar|ingresa|ingreso|ingresar|accedo|acceder|deja)\b/u', $t)) return false;
    $filas = (array)($conv['transcript'] ?? []);
    $cita = null;   // la del mensaje de ahora, el último del cliente
    $ultimoNuestro = '';
    for ($i = count($filas) - 1; $i >= 0; $i--) {
        $q = (string)($filas[$i]['q'] ?? '');
        if ($q === 'cliente' && $cita === null) $cita = (string)($filas[$i]['cita'] ?? '');
        if (in_array($q, ['bot', 'humano'], true)) { $ultimoNuestro = (string)($filas[$i]['t'] ?? ''); break; }
    }
    if ((string)$cita !== '') {
        foreach ($filas as $f) {
            if ((string)($f['id'] ?? '') === $cita) return strpos((string)($f['t'] ?? ''), 'gokywebs.com/form') !== false;
        }
    }
    return strpos($ultimoNuestro, 'gokywebs.com/form') !== false;
}

/** La repregunta de la demo (22-oct), también para volver a ofrecerla después de las dudas. */
/**
 * Lo que no salió no se da por enviado (auditoría del 10-nov). El turno aplica sus efectos
 * antes de mandar: si el precio, la oferta de la demo o el pedido de los datos no llegan a salir
 * (Meta rechaza el envío, o el cliente siguió escribiendo y el resto del turno se descartó), la
 * charla quedaba diciendo «precio dado» o «datos pedidos» y nadie se lo volvía a mandar: 23
 * charlas así entre el 10-oct y el 10-nov, 17 por el token de Instagram vencido.
 *
 * $antes es la charla como estaba antes del turno; de ahí se recuperan solo las marcas de lo que
 * no salió. No se vuelve atrás la charla entera: un turno puede haber creado la ficha o confirmado
 * un pago, y eso no se deshace. Cuando falló el envío queda pendiente para Pablo; cuando se
 * descartó porque el cliente siguió escribiendo, lo retoma el turno que viene.
 */
function wabot_comercial_deshacer_no_enviados(&$conv, array $antes, array $enviados, array $faltaron, $cfg, $motivo = 'fallo') {
    if (!$faltaron) return [];
    $restaurar = function (array $claves) use (&$conv, $antes) {
        foreach ($claves as $k) {
            if (array_key_exists($k, $antes)) $conv[$k] = $antes[$k]; else unset($conv[$k]);
        }
    };
    $salioPrecio = false;
    foreach ($enviados as $m) if (strpos((string)$m, '$') !== false) { $salioPrecio = true; break; }
    $deshecho = [];
    foreach ($faltaron as $t) {
        $t = (string)$t;
        $pideDatos = function_exists('wabot_texto_pide_datos_demo') && wabot_texto_pide_datos_demo($t, $cfg);
        if ($pideDatos || (function_exists('wabot_texto_tiene_link_form') && wabot_texto_tiene_link_form($t))) {
            $restaurar(['link_form_enviado', 'form_link_mandado_ts', 'form_link_ts', 'datos_pedidos_ts', 'esProspecto', 'comercial_pausa', 'comercial_pausa_ts', 'precio_cta_pendiente']);
            $deshecho['formulario'] = true;
        } elseif (wabot_comercial_texto_es_oferta($t, $cfg)) {
            $restaurar(['comercial_oferta_ts', 'comercial_reoferta_ts', 'oferta_diseno_ts', 'cta_muestra']);
            $deshecho['oferta'] = true;
        } elseif (strpos($t, '$') !== false && !$salioPrecio && empty($antes['precio_dado'])) {
            $restaurar(['precio_dado', 'precio_cotizado', 'sena_cotizada', 'mensualidad_cotizada', 'precio_unico_cotizado', 'precio_modelo', 'precio_cotizado_ts',
                        'precio_turnos_desde', 'precio_cta_pendiente', 'reconocimiento_hecho', 'comercial_cotizacion', 'comercial_dos_webs', 'comercial_dos_planes_ts',
                        'inicial_cotizado', 'ab_grupo', 'ab_grupo_ts', 'comercial_oferta_ts', 'cta_muestra']);
            $deshecho['precio'] = true;
        }
    }
    if ($deshecho) {
        // La etapa, según lo que de verdad le llegó.
        if (isset($deshecho['precio'])) $restaurar(['fase']);
        elseif (!empty($conv['precio_dado']) && empty($conv['comercial_oferta_ts']) && empty($conv['link_form_enviado'])) $conv['fase'] = 'precio';
        elseif (isset($deshecho['formulario']) && array_key_exists('fase', $antes) && !empty($conv['comercial_oferta_ts'])) $conv['fase'] = 'prediseno';
    }
    if ($motivo === 'fallo') {
        $conv['handoff_pendiente'] = true;
        $conv['envio_fallido_ts'] = time();
    }
    wabot_log('envio_incompleto', ['tel' => $conv['tel'] ?? '', 'motivo' => (string)$motivo, 'salieron' => count($enviados),
                                    'faltaron' => count($faltaron), 'deshecho' => implode(',', array_keys($deshecho))]);
    return array_keys($deshecho);
}

function wabot_comercial_texto_confirmar_demo($cfg) {
    return trim((string)($cfg['comercial']['confirmar_demo'] ?? '')) ?: 'Te consulto, querés que te armemos la demo así ves cómo quedaría?';
}

/** Los últimos $n textos nuestros (bot o Pablo), normalizados, para no repetir una respuesta oficial tal cual. */
function wabot_comercial_textos_recientes($conv, $n = 12) {
    $out = [];
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (!in_array((string)($fila['q'] ?? ''), ['bot', 'humano'], true)) continue;
        $out[] = wabot_normalizar_frase((string)($fila['t'] ?? ''));
        if (count($out) >= $n) break;
    }
    return $out;
}

/** ¿Pide que le repitamos algo ("pasame de nuevo lo del hosting")? Ahí la respuesta oficial va aunque ya haya salido. */
function wabot_comercial_pide_repetir($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    return $t !== '' && (bool)preg_match('/\b(de nuevo|otra vez|de vuelta|nuevamente|repet\w*|volv\w* a (pasar|mandar|decir|explicar)|pasame|mandame|me lo pasas|me lo mandas|lo que me dijiste)\b/u', $t);
}

/** Cuándo le ofrecimos la demo (el flujo nuevo, el motor de antes o el texto en la charla); 0 si nunca. */
function wabot_comercial_oferta_ts($conv, $cfg = null) {
    $ts = (int)($conv['comercial_oferta_ts'] ?? 0) ?: (int)($conv['oferta_diseno_ts'] ?? 0);
    if ($ts > 0) return $ts;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        if (!in_array((string)($fila['q'] ?? ''), ['bot', 'humano'], true)) continue;
        if (wabot_comercial_texto_es_oferta((string)($fila['t'] ?? ''), $cfg)) return (int)($fila['ts'] ?? 0);
    }
    return 0;
}

/**
 * Contestadas las dudas, con el precio pasado y la demo ofrecida pero sin que la
 * acepte ni la rechace, a la segunda tanda de preguntas se le vuelve a ofrecer
 * una sola vez (26-oct, Tomás: cuatro turnos de dudas sobre la academia y nunca
 * le llegó el formulario). No a un acuse, no si en este turno le preguntamos
 * otra cosa, no si ya se la volvimos a ofrecer.
 */
function wabot_comercial_reoferta_corresponde($d, $texto, $conv, $cfg, array $msgs) {
    if (!$msgs || !empty($conv['comercial_reoferta_ts'])) return false;
    // «Mañana te mando un audio y lo vemos»: avisó que vuelve, no se le insiste con la demo (10-nov, la agencia de viajes).
    if ((int)($conv['retomar_ts'] ?? 0) > time()) return false;
    if (($d['intencion'] ?? 'ninguna') !== 'ninguna') return false;
    if (wabot_comercial_estado($conv) !== 'atencion' || !wabot_comercial_oferta_hecha($conv, $cfg)) return false;
    if (wabot_comercial_cotizacion($conv, $cfg) === null) return false;
    if (function_exists('wabot_es_acuse') && wabot_es_acuse($texto)) return false;
    if (function_exists('wabot_mensaje_pregunta_algo') && !wabot_mensaje_pregunta_algo($texto)) return false;
    foreach ($msgs as $m) {
        $t = (string)($m['t'] ?? '');
        if (function_exists('wabot_texto_sin_links')) $t = wabot_texto_sin_links($t);
        if (strpos($t, '?') !== false) return false;
    }
    // Cuántas veces escribió después de la oferta: por posición en la charla (la
    // oferta y lo que sigue pueden caer en el mismo segundo), o por hora si el texto no está.
    $t = array_values((array)($conv['transcript'] ?? []));
    $idx = -1;
    for ($i = count($t) - 1; $i >= 0; $i--) {
        if (!in_array((string)($t[$i]['q'] ?? ''), ['bot', 'humano'], true)) continue;
        if (wabot_comercial_texto_es_oferta((string)($t[$i]['t'] ?? ''), $cfg)) { $idx = $i; break; }
    }
    $mensajes = 0;
    if ($idx >= 0) {
        for ($i = $idx + 1; $i < count($t); $i++) if (($t[$i]['q'] ?? '') === 'cliente') $mensajes++;
    } else {
        $desde = wabot_comercial_oferta_ts($conv, $cfg);
        if ($desde <= 0) return false;
        foreach ($t as $fila) if (($fila['q'] ?? '') === 'cliente' && (int)($fila['ts'] ?? 0) > $desde) $mensajes++;
    }
    return $mensajes >= 2;
}

/* ───────────── Preguntas pendientes, quién carga y catálogo (Pablo, 9-oct a la noche) ───────────── */

/** ¿Este mensaje nuestro le pregunta si quiere los turnos por WhatsApp o reservados desde la web? */
function wabot_comercial_es_pregunta_turnos($texto) {
    $crudo = function_exists('wabot_texto_sin_links') ? wabot_texto_sin_links((string)$texto) : (string)$texto;
    if (strpos($crudo, '?') === false) return false;
    $t = wabot_normalizar_frase($crudo);
    /* Un alojamiento no habla de turnos (10-nov, la cabaña de Bariloche: «preferís coordinar
     * las reservas por WhatsApp o que puedan reservar directamente desde la página?» no se
     * reconocía y a «Dame las 2 opciones» le llegó un solo precio). */
    return (bool)preg_match('/\breserv\w*/u', $t) && (bool)preg_match('/\b(turnos?|dia y horario|horarios?|agenda|desde la (pagina|web)|en la (pagina|web)|por la (pagina|web))\b/u', $t)
        && (bool)preg_match('/\b(whatsapp|wsp|wpp|consultas?|contact\w*|escrib\w*|mostrar)\b/u', $t);
}

/**
 * ¿Es un alojamiento? (cabañas, hospedaje, hotel, hostel, alquiler temporario o turístico,
 * Airbnb…) Por la ficha del modelo (necesidad hospedaje) o por lo que escribió el cliente.
 * «Alojamiento» suelto no alcanza: también es el hosting de la web.
 */
function wabot_comercial_es_alojamiento($conv, $texto = '', $d = null) {
    if ((string)($d['ficha']['necesidad'] ?? '') === 'hospedaje') return true;
    if (function_exists('wabot_ficha') && (string)(wabot_ficha($conv)['necesidad'] ?? '') === 'hospedaje') return true;
    $todo = (string)$texto;
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (($fila['q'] ?? '') === 'cliente') $todo .= "\n" . (string)($fila['t'] ?? '');
    }
    $t = wabot_normalizar_frase($todo);
    return (bool)preg_match('/\b(caba(n|ñ)as?|hospedajes?|hostel(es|s)?|hoteles|hotel|hosteria|posadas?|apart ?hotel(es)?|aparts?|bungalows?|glamping|airbnb|booking|'
        . 'alojamientos? (turistic\w*|temporari\w*|para turistas)|alquiler(es)? (turistic\w*|temporari\w*|temporal(es)?|vacacional(es)?|por (dia|noche|temporada))|'
        . 'complejo (turistico|de cabanas)|casas? de (veraneo|vacaciones))\b/u', $t);
}

/** ¿Lo último que le mandamos (sin contar al cliente) es la pregunta de los turnos? */
function wabot_comercial_ultimo_es_pregunta_turnos($conv) {
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        $q = (string)($fila['q'] ?? '');
        if ($q === 'cliente' || $q === 'sistema') continue;
        return wabot_comercial_es_pregunta_turnos((string)($fila['t'] ?? ''));
    }
    return false;
}

/** ¿Elige las dos opciones ("ambas opciones son buenas", "las dos")? Pedir solo WhatsApp o "sin reservas" no. */
function wabot_comercial_elige_las_dos($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    /* «Las dos cosas o solo por WhatsApp depende el costo quizás» (11-nov 17:41, un coach
     * ontológico): el «solo» de la otra alternativa («o solo…») lo descartaba y le llegó
     * solo el precio sin reservas. Un «solo» después de «o» es la otra opción, no un recorte. */
    return (bool)preg_match('/\b(ambas|ambos|las dos|los dos|las 2|los 2)\b/u', $t)
        && !preg_match('/\bsin reserv\w*|(?<!\bo )\b(solo|solamente|nada mas)\b/u', $t);
}

/** ¿El cliente contesta (o despeja) esa pregunta? Ante la duda, sí: lo decide el modelo. */
function wabot_comercial_contesta_turnos($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    // Un sí o un no corto contesta la pregunta de Pablo ("querés que también puedan reservar turnos?" → "Si").
    if (preg_match('/^(si+|sip|no|nop|dale|claro|obvio|exacto|tal cual|ok|okey|bueno|perfecto|joya)( (si+|no|dale|claro|gracias|porfa|por favor))?$/u', $t)) return true;
    /* Un sí corto con la palabra de la opción que elige ("Directamente si", 10-oct:
     * contestaba "…o que puedan reservarlos directamente desde la página?", no se
     * reconocía y el bot le repetía la pregunta hasta que el revisor la frenaba y
     * la charla quedaba sin el precio). Sin preguntar otra cosa ni el precio. */
    if (count(explode(' ', $t)) <= 5 && strpos((string)$texto, '?') === false && !wabot_comercial_pregunta_costo($texto)
        && preg_match('/^(si+|sip|claro|obvio|dale|exacto)\b|\b(si+|claro|obvio|dale)$/u', $t)) return true;
    /* «Por washapt los turnos» (4-nov, un enfermero): no se reconocía, el bot repitió la
     * pregunta, el revisor lo frenó y quedó sin el precio. Entran las formas en que se
     * escribe WhatsApp: wasap, washap, watsap, wasapp, wathsapp, whasapp, wp. */
    return (bool)preg_match('/\b(whats\w*|w+h?a+t*h?s+h?a+p+\w*|wsp|wpp|wapp|wp|guasap\w*|reserv\w*|online|on line|en linea|agenda\w*|calendario|turnero|sistema de turnos'
        . '|directamente|directo|ellos mismos|solos|solas|autom\w*|las 2|los 2|esa opcion'
        . '|desde la (web|pagina)|por la (web|pagina)|en la (web|pagina)|la primera|la segunda|lo primero|lo segundo|(primera|segunda) opcion'
        . '|las dos|los dos|ambas|ambos|cualquiera|da igual|da lo mismo|recomend\w*|no se|nose|como (vos|quieras|te parezca)|lo que (vos|sea|me)'
        . '|(decime|decidi|elegi) vos|personal\w*|coordin\w*|por mensaje|por telefono|llam\w*|contact\w*|escrib\w*|informacion|mostrar)\b/u', $t);
}

/**
 * Cuántas veces le hicimos la pregunta de los turnos sin que la contestara
 * (0: no hay ninguna pendiente). Mira para atrás hasta el precio: una vez
 * cotizado ya no queda nada pendiente. El mensaje nuevo ya está en la charla.
 */
function wabot_comercial_turnos_pendiente($conv, $cfg = null) {
    $clientes = [];
    $veces = 0;
    foreach (array_reverse((array)($conv['transcript'] ?? [])) as $fila) {
        $q = (string)($fila['q'] ?? '');
        $t = (string)($fila['t'] ?? '');
        if ($q === 'sistema') continue;
        if ($q === 'cliente') { $clientes[] = $t; continue; }
        if (strpos($t, '$') !== false || wabot_comercial_texto_es_oferta($t, $cfg)) break;
        if (wabot_comercial_es_pregunta_turnos($t)) {
            foreach ($clientes as $c) if (wabot_comercial_contesta_turnos($c)) return 0;
            $veces++;
        }
    }
    return $veces;
}

/**
 * ¿Pregunta cuánto sale o si tiene un costo? ("Cuánto sale?", "Si tiene un
 * costo", "precio?"). "Cuánto tardan?" es otra cosa: el plazo.
 */
function wabot_comercial_pregunta_costo($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    if (preg_match('/\b(costo|costos|cuesta|cuestan|sale|salen|saldria|precio|precios|valor|valores|cobran|cobras|tarifa|presupuesto)\b/u', $t)) return true;
    if (preg_match('/\bcuanto\b.{0,25}\b(tard\w*|demor\w*|dura\w*|tiempo|dias|semanas)\b/u', $t)) return false;
    return (bool)preg_match('/\bcuanto (es|seria|serian|son)\b|^(y )?cuanto$/u', $t);
}

/** "Perfecto, entonces": la propuesta corta que va pegada al bloque que sigue, como escribe Pablo. */
function wabot_comercial_es_confirmacion_corta($m) {
    $t = wabot_normalizar_frase((string)$m);
    return $t !== '' && mb_strlen($t) <= 30 && (bool)preg_match('/^(perfecto|dale|buenisimo|genial|joya|barbaro|listo|bien|ok)( entonces)?$/u', $t);
}

/** "Perfecto, entonces" + "Podés elegir entre dos planes…" → "Perfecto, entonces podés elegir entre dos planes…". */
function wabot_comercial_pegar_confirmacion($confirmacion, $texto) {
    $texto = (string)$texto;
    return rtrim(trim((string)$confirmacion), " ,.!") . ' ' . mb_strtolower(mb_substr($texto, 0, 1)) . mb_substr($texto, 1);
}

/** ¿Pregunta si los productos los cargamos NOSOTROS? ("se pueden cargar todos ustedes?", "los ponés vos?") */
function wabot_comercial_pide_que_carguemos($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    // "cargo" queda afuera: "lo cargo yo?" es la otra pregunta y "sin cargo" no es cargar.
    $cargar = 'carg(a|an|ar|as|ues|uen|uemos|arian|arias|arlos|arlas|ando|ados?|adas?)';
    if (preg_match('/\b(ustedes|uds|vos)\b.{0,30}\b' . $cargar . '\b|\b' . $cargar . '\b.{0,30}\b(ustedes|uds|vos)\b'
        . '|\b(vienen|viene|vendrian) (ya )?cargad\w*|\b(me|nos) (los |las )?' . $cargar . '\b/u', $t)) return true;
    // Subir, poner o llenar, solo si habla de productos ("ustedes ponen el dominio?" es otra cosa).
    $verbo = '(suben|subis|subir|subirlos|ponen|pones|poner|ponerlos|llenan|llenas|llenar)';
    return (bool)preg_match('/\b(productos?|articulos?|precios?|fotos?|catalogo|stock|items?)\b/u', $t)
        && (bool)preg_match('/\b(ustedes|uds|vos)\b.{0,30}\b' . $verbo . '\b|\b' . $verbo . '\b.{0,30}\b(ustedes|uds|vos)\b|\b(me|nos) (los |las )?' . $verbo . '\b/u', $t);
}

/** ¿Dijo expresamente que no quiere cobrar por la web (solo mostrar, pedido por WhatsApp)? */
function wabot_comercial_dijo_sin_cobro($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    return (bool)preg_match('/\b(whats\w*|wsp|wpp|wapp|guasap|no (quiero |necesito |voy a )?(cobrar|vender|venta|pagos?|carrito)'
        . '|sin (cobrar|cobro|pagos?|carrito|venta online|vender)|solo (mostrar|exhibir|vidriera|para mostrar|como vidriera)|vidriera'
        . '|que me (pidan|escriban|consulten|contacten|hagan el pedido|manden el pedido)|pedidos? por (mensaje|telefono|instagram|ig|dm|privado)|por privado|por mensaje)\b/u', $t);
}

/**
 * Dudas sobre la decisión, no sobre el texto: se le pide UNA corrección
 * diciendo por qué y, si insiste, vale lo que decida (nunca se calla por esto).
 * Catálogo sin que haya dicho que no quiere cobrar online (Pablo, 9-oct: "cuando
 * venden productos hay que asumir venta online, salvo que expresamente digan
 * que quieren solo catálogo/WhatsApp").
 */
function wabot_comercial_dudas($d, $texto, $conv) {
    $dudas = [];
    $cliente = [(string)$texto];
    foreach ((array)($conv['transcript'] ?? []) as $fila) if (($fila['q'] ?? '') === 'cliente') $cliente[] = (string)($fila['t'] ?? '');
    $cliente = implode("\n", $cliente);
    if ($d['accion'] === 'cotizar' && $d['solucion'] === 'catalogo') {
        if (!wabot_comercial_dijo_sin_cobro($cliente)) {
            $dudas[] = 'elegiste catalogo, pero el cliente no dijo que no quiere cobrar por la web: si vende productos, asumí venta online (solucion tienda) y escribí la propuesta para una tienda';
        }
    }
    /* Pedir publicidad o difusión no se deriva (22-oct): a Patri ("necesito
     * difusión") se le contestó y siguió; a nicolas (poda en altura, "quiero
     * marketing, publicidad") se lo pasó a Pablo y quedó sin respuesta. */
    if ($d['accion'] === 'humano' && $d['solucion'] !== 'crm'
        && preg_match('/\b(marketing|publicidad|difusi[oó]n|redes|anuncios?|pauta|community)\b/iu', (string)$d['motivo'])) {
        $dudas[] = 'pedir publicidad, marketing, redes o difusión no es motivo para pasarlo a una persona: pedí la respuesta oficial marketing y seguí con la web (si ya sabés a qué se dedica, cotizá; si no, preguntáselo)';
    }
    if (in_array($d['accion'], ['responder', 'cotizar'], true) && $d['solucion'] === 'cursos') {
        $agregadas = wabot_comercial_cursos_funciones_de_mas(implode("\n", $d['mensajes']), $cliente, $d['modalidad_clases'] ?? 'no_aplica');
        if ($agregadas) {
            $dudas[] = 'la propuesta nombra ' . implode(', ', $agregadas) . ', pero el cliente no lo pidió: describí solo lo que contó (sus capacitaciones o cursos, la información de cada uno y el contacto) y el panel para cargarlos y actualizarlos, sin preguntarle por esas funciones';
        }
    }
    return $dudas;
}

/**
 * Funciones de cursos que la propuesta agrega sin que el cliente las haya
 * nombrado (Pablo, 16-oct: Roque dijo "doy capacitaciones" y la propuesta le
 * ofreció un sistema para gestionar alumnos; Marcelo quería "algo simple").
 * El plan con panel se mantiene: lo que se frena es describir de más.
 */
function wabot_comercial_cursos_funciones_de_mas($propuesta, $cliente, $modalidad = 'no_aplica') {
    $p = mb_strtolower((string)$propuesta);
    $c = mb_strtolower((string)$cliente);
    // Si vende o cobra los cursos por la web, alumnos, inscripción y acceso vienen con eso.
    $vende = '\b(pag\w*|cobr\w*|vend\w*|mercado ?pago)\b';
    $funciones = [
        'alumnos'              => ['/\b(alumn\w*|estudiantes?)\b/u', "/\\b(alumn\\w*|estudiantes?)\\b|$vende/u"],
        'inscripción'          => ['/\binscri\w*/u', "/\\b(inscri\\w*|anot\\w*|matricul\\w*)|$vende/u"],
        'pago online'          => ['/\b(pag\w*|cobr\w*)\b.{0,30}\b(online|en l[ií]nea|desde la (web|p[aá]gina))\b|\bmercado ?pago\b/u', "/$vende/u"],
        'acceso a una plataforma' => ['/\b(acceso|campus|aula virtual|plataforma)\b/u', "/\\b(acceso|campus|aula|plataforma|virtual\\w*|videos?|grabad\\w*)\\b|$vende/u"],
        'un sistema de gestión'   => ['/\bsistema\b/u', '/\bsistema\b|\bgestion\w*\b/u'],
    ];
    $de_mas = [];
    foreach ($funciones as $nombre => [$enPropuesta, $loDijo]) {
        if (in_array($modalidad, ['virtual', 'mixta'], true) && in_array($nombre, ['alumnos', 'inscripción', 'acceso a una plataforma'], true)) continue;
        if (preg_match($enPropuesta, $p) && !preg_match($loDijo, $c)) $de_mas[] = $nombre;
    }
    return $de_mas;
}

function wabot_comercial_validar($d, $texto, $conv, $cfg) {
    $ajustes = [];
    $t = wabot_normalizar_frase((string)$texto);
    $sol = $d['solucion'];
    // Con una cotización ya dada, el negocio está claro aunque la ficha no lo tenga (una charla vieja o de Pablo).
    $negocio = wabot_comercial_negocio_conocido($conv, $d) || wabot_comercial_cotizacion($conv, $cfg) !== null;

    // La modalidad cambia el plan. El modelo debe extraerla de toda la charla.
    if (($d['modalidad_clases'] ?? '') === 'desconocida' && $d['accion'] === 'cotizar'
        && in_array($sol, ['cursos', 'informativa', 'informativa_panel', 'sin_definir'], true)
        && wabot_comercial_cotizacion($conv, $cfg) === null) {
        $d['accion'] = 'responder';
        $d['mensajes'] = ['Te consulto, las clases son presenciales o virtuales?'];
        $ajustes[] = 'preguntar_modalidad_clases';
    }

    /* Respuestas oficiales angostas que el cliente nunca nombró (26/27-oct:
     * "Publicidad y redes no hacemos" a una abogada por "los clientes no llegan",
     * "el mensual se paga todos los meses" a "los costos son fijos?"). El mismo
     * rastro que el motor y que ia.php: la clave se descarta y queda lo que
     * escribió el modelo. */
    if ($d['info_claves'] && function_exists('wabot_info_clave_tiene_rastro')) {
        $conRastro = array_values(array_filter($d['info_claves'], function ($k) use ($texto, $conv) {
            return wabot_info_clave_tiene_rastro($k, $texto, $conv);
        }));
        if (count($conRastro) !== count($d['info_claves'])) {
            $d['info_claves'] = $conRastro;
            $ajustes[] = 'sin_rastro';
        }
    }

    // Un sistema de gestión o un CRM no se cotiza: lo ve Pablo, en silencio.
    if ($sol === 'crm' && $d['accion'] !== 'humano' && $d['accion'] !== 'esperar') {
        $d['accion'] = 'humano';
        $d['motivo'] = $d['motivo'] ?: 'Pide un sistema de gestión / CRM';
        $ajustes[] = 'crm_humano';
    }
    /* Dos webs (10-oct) se cotizan juntas con descuento, salvo que la otra sea un
     * sistema de gestión o que cobre en el exterior: eso lo ve Pablo. */
    $seg = (string)($d['segunda_solucion'] ?? '');
    if ($seg !== '' && in_array($d['accion'], ['cotizar', 'formulario'], true)) {
        if ($seg === 'crm' || !empty($d['internacional'])) {
            $d['accion'] = 'humano';
            $d['motivo'] = $seg === 'crm' ? 'Pide una web y además un sistema de gestión' : 'Pide dos webs con cobros internacionales';
            $ajustes[] = 'dos_webs_humano';
        } elseif (!wabot_comercial_solucion_estandar($seg)) {
            $d['segunda_solucion'] = null;
        } elseif (wabot_ab_grupo_cfg($cfg) !== '' && (wabot_ab_activa($cfg) || wabot_ab_grupo_cfg($cfg) !== 'a2') && empty($conv['comercial_dos_webs'])) {
            /* Durante la prueba de precios (31-oct) las dos webs las cotiza Pablo: en A y B el descuento no está definido y en A2 (2-nov) se dejó igual.
             * 10-nov: la prueba terminó el 3-nov y todas las charlas nuevas quedan en A2 (anual o mensual), que es
             * justo para lo que está cargado el descuento de las dos webs; con la prueba apagada las cotiza el bot,
             * como dicen sus instrucciones. Para volver atrás, sacar la condición del medio. */
            $d['accion'] = 'humano';
            $d['motivo'] = 'Pide dos webs: durante la prueba de precios las cotiza Pablo';
            $ajustes[] = 'dos_webs_prueba_precios';
        }
    }
    // Lo que la ficha ya marcó como fuera de lista (Mercado Libre, 500 productos…) frena la cotización y el formulario.
    $fuera = wabot_comercial_fuera_de_lista($conv, $cfg);
    if ($fuera !== '' && in_array($d['accion'], ['cotizar', 'formulario'], true)) {
        $d['accion'] = 'humano';
        $d['motivo'] = 'Pide algo fuera del precio de lista: ' . $fuera;
        $ajustes[] = 'fuera_de_lista';
    }
    /* Un sí corto e inequívoco con la oferta de la demo abierta, que el modelo
     * leyó como otra cosa: justo después de la oferta, o después de que
     * contestamos una duda sin preguntarle nada ("Dale buenísimo" tras la
     * explicación de los planes). Si lo último nuestro es una pregunta, el
     * "dale" puede contestar eso y lo decide el modelo. */
    $yaCotizado = wabot_comercial_cotizacion($conv, $cfg) !== null;
    if (!empty($d['_sin_texto'])) $ajustes[] = 'sin_texto';   // el texto del modelo se descartó (wabot_comercial_pensar)
    if ((in_array($d['accion'], ['responder', 'esperar'], true) || ($d['accion'] === 'cotizar' && $yaCotizado && !wabot_comercial_pide_precio_otra_vez($texto)))
        && wabot_comercial_estado($conv) === 'atencion' && wabot_comercial_si_claro($texto)
        && (wabot_comercial_ultimo_es_oferta($conv, $cfg) || wabot_comercial_oferta_sigue_abierta($conv, $cfg))
        && !wabot_comercial_postergo_tras_oferta($conv, $cfg)) {
        $d['accion'] = 'formulario';
        $d['intencion'] = 'acepta';
        $d['mensajes'] = [];
        $ajustes[] = 'si_claro_formulario';
    }
    /* Eligió un plan después de los precios ("Hoy debería ser plan mensual",
     * 26-oct): con la demo ofrecida y sin formulario, es aceptarla. El modelo lo
     * leía como "no acepta la demo" y encima la desalentaba ("No hace falta que
     * decidas una inversión ahora"); el formulario lo mandó Pablo a la mañana.
     * También cuando el modelo ya eligió el formulario (27-oct, "Prefiero el
     * mensual" en vivo): así se anota el plan y sale el acuse. */
    $planElegido = null;
    if ($yaCotizado && wabot_comercial_estado($conv) === 'atencion' && wabot_comercial_oferta_hecha($conv, $cfg)
        && !in_array($d['intencion'], ['rechaza', 'posterga', 'condiciona'], true)
        && (in_array($d['accion'], ['responder', 'esperar', 'formulario'], true) || ($d['accion'] === 'cotizar' && !wabot_comercial_pide_precio_otra_vez($texto)))) {
        $planElegido = wabot_comercial_elige_plan($texto, $conv);
    }
    if ($planElegido !== null) {
        $d['accion'] = 'formulario';
        $d['intencion'] = 'acepta';
        $d['mensajes'] = [];
        $d['plan_elegido'] = $planElegido;
        $ajustes[] = 'plan_elegido_formulario';
    }
    /* Pidió tiempo después de la oferta y lo de ahora es un acuse ("👍 si" al
     * "Armalo con calma y cuando lo tengas me escribís", Marcela, 1-nov): no
     * acepta la demo, contesta el acuerdo. Se espera a que vuelva. */
    if ($d['accion'] === 'formulario' && $planElegido === null && wabot_comercial_estado($conv) === 'atencion'
        && (wabot_comercial_si_claro($texto) || (function_exists('wabot_es_acuse') && wabot_es_acuse($texto)))
        && wabot_comercial_postergo_tras_oferta($conv, $cfg)) {
        $d['accion'] = 'esperar';
        $d['intencion'] = 'ninguna';
        $d['mensajes'] = [];
        $d['info_claves'] = [];
        $ajustes[] = 'acuse_tras_postergar';
    }
    // El formulario solo después de la oferta: si todavía no hay precio, se cotiza (la oferta sale con él); si no, se responde.
    if ($d['accion'] === 'formulario' && !wabot_comercial_oferta_hecha($conv, $cfg)) {
        $d['accion'] = (wabot_comercial_solucion_estandar($sol) && $negocio) ? 'cotizar' : 'responder';
        $ajustes[] = 'formulario_sin_oferta';
    }
    /* Un "ok" suelto cuando después de la oferta la charla fue por otro lado (le
     * preguntamos otra cosa) no acepta la demo: se le pregunta si la quiere
     * (22-oct, Geo es acá: no abrió todavía y el "Ok" era a "Somos de Tigre…"). */
    $acuseSuelto = wabot_comercial_si_claro($texto) || (function_exists('wabot_es_acuse') && wabot_es_acuse($texto));
    if ($d['accion'] === 'formulario' && wabot_comercial_estado($conv) === 'atencion' && $acuseSuelto
        && !wabot_comercial_ultimo_es_oferta($conv, $cfg) && !wabot_comercial_oferta_sigue_abierta($conv, $cfg)) {
        $d['accion'] = 'responder';
        $d['intencion'] = 'ninguna';
        $d['mensajes'] = [wabot_comercial_texto_confirmar_demo($cfg)];
        $ajustes[] = 'formulario_confirmar_demo';
    }
    /* Con el formulario ya mandado (22-oct) se contestan dudas y se agradece el
     * material, pero no se vuelve a cotizar ni a mandar el link: el precio solo
     * si lo pide otra vez. Después de la demo (1-nov), lo mismo. */
    if (in_array(wabot_comercial_estado($conv), ['formulario', 'postdemo'], true)) {
        if ($d['accion'] === 'formulario' || ($d['accion'] === 'cotizar' && !wabot_comercial_pide_precio_otra_vez($texto))) {
            $d['accion'] = ($d['mensajes'] || $d['info_claves']) ? 'responder' : 'esperar';
            $ajustes[] = 'post_form_sin_repetir';
        }
    }
    /* Ya tiene el precio, lo vuelve a pedir y el modelo no devolvió nada para mandar (3-nov:
     * eligió «responder» sin mensajes, esperando que el sistema repitiera los planes, y el
     * cliente quedó sin respuesta). Se repiten los planes de su cotización. */
    if ($yaCotizado && in_array($d['accion'], ['responder', 'esperar'], true) && !$d['mensajes'] && !$d['info_claves']
        && in_array(wabot_comercial_estado($conv), ['atencion', 'formulario'], true) && wabot_comercial_pide_precio_otra_vez($texto)) {
        $solCot = (string)($conv['comercial_solucion'] ?? '');
        if (wabot_comercial_solucion_estandar($solCot)) {
            $d['accion'] = 'cotizar';
            $d['solucion'] = $sol = $solCot;
            $ajustes[] = 'repite_planes';
        }
    }
    // La etapa post-demo (1-nov): lo que detectan las reglas (modelo, plan, pago, transferencia, cambios) manda sobre lo que marcó el modelo.
    if (wabot_comercial_estado($conv) === 'postdemo') [$d, $ajustes] = wabot_comercial_validar_postdemo($d, $texto, $conv, $cfg, $ajustes);
    // Cotizar exige una solución estándar y saber a qué se dedica.
    if ($d['accion'] === 'cotizar' && !wabot_comercial_solucion_estandar($sol)) {
        $d['accion'] = 'responder';
        $ajustes[] = 'cotizar_sin_solucion';
    }
    if ($d['accion'] === 'cotizar' && !$negocio) {
        // Se pregunta a qué se dedica (una vez): lo que el modelo quería decir no era una pregunta.
        $d['accion'] = 'responder';
        $hayPregunta = (bool)array_filter($d['mensajes'], function ($m) { return strpos($m, '?') !== false; });
        if (!$hayPregunta) $d['mensajes'] = empty($conv['rubro_preguntado']) ? [trim((string)($cfg['comercial']['pregunta_negocio'] ?? 'Te consulto, a qué te dedicás o qué vendés?'))] : [];
        $ajustes[] = 'cotizar_sin_negocio';
    }
    /* Pide el precio sin haber contado a qué se dedica y no quedó nada para mandarle («Q sale»,
     * 28-oct: el rubro ya se le había preguntado el día anterior y el turno salió vacío). Va la
     * respuesta oficial, que le vuelve a pedir el rubro para pasarle el valor. */
    if (!$yaCotizado && !$negocio && in_array($d['accion'], ['responder', 'esperar'], true) && !$d['mensajes'] && !$d['info_claves']
        && wabot_comercial_estado($conv) === 'atencion' && wabot_comercial_pregunta_costo($texto)
        && trim((string)($cfg['info']['precio_sin_rubro'] ?? '')) !== '') {
        $d['accion'] = 'responder';
        $d['info_claves'] = ['precio_sin_rubro'];
        $ajustes[] = 'precio_sin_rubro_respaldo';
    }
    /* La pregunta de los turnos (WhatsApp o reservas) queda pendiente hasta que
     * la conteste (Pablo, 9-oct: "debería conservar la pregunta pendiente o
     * responder solo el plazo"): si preguntó otra cosa, se contesta eso y se le
     * recuerda la pregunta, sin elegir por el cliente ni cotizar. Una sola vez:
     * si ya se la recordamos y sigue sin contestar, decide el modelo. */
    $turnosPendiente = (!$yaCotizado && in_array($d['accion'], ['responder', 'cotizar'], true)) ? wabot_comercial_turnos_pendiente($conv, $cfg) : 0;
    $alojamiento = !$yaCotizado && wabot_comercial_es_alojamiento($conv, $texto, $d);
    $sinMontosTurnos = ['precio_sin_rubro', 'pago', 'pago_generico', 'pago_sin_precio', 'que_incluye', 'que_incluye_sitio', 'proceso', 'rangos'];
    if ($turnosPendiente > 0 && wabot_comercial_pregunta_costo($texto)) {
        /* Pregunta el precio sin contestar: los dos precios y que elija, como
         * Pablo el 9-oct ("Es otro plan si incluye reservas" / "Sin reservas
         * podés elegir…" / "Con reservas quedaría en:"). */
        $d['accion'] = 'cotizar';
        $d['solucion'] = $sol = 'informativa';
        $d['dos_planes'] = true;
        $d['mensajes'] = [];
        $d['info_claves'] = array_values(array_diff($d['info_claves'], $sinMontosTurnos));
        $ajustes[] = 'turnos_dos_planes';
    } elseif ($turnosPendiente === 1 && !$alojamiento && $d['accion'] === 'cotizar' && in_array($sol, ['informativa', 'informativa_panel', 'reservas'], true)) {
        $d['accion'] = 'responder';
        $pregunta = trim((string)($cfg['comercial']['pregunta_turnos'] ?? ''));
        $d['mensajes'] = $pregunta !== '' ? [$pregunta] : [];
        $d['info_claves'] = array_values(array_diff($d['info_claves'], $sinMontosTurnos));
        $ajustes[] = 'turnos_pendiente';
    }
    /* "Ambas opciones son buenas" a "por WhatsApp o reservar desde la página?"
     * (19-oct, una masajista): el modelo lo leyó como "le da lo mismo" y le pasó
     * solo la informativa, y el precio con reservas (el de la tienda) se lo tuvo
     * que pasar Pablo. Con "las dos" van los dos precios y elige. */
    if (!$yaCotizado && $d['accion'] === 'cotizar' && empty($d['dos_planes']) && in_array($sol, ['informativa', 'reservas'], true)
        && wabot_comercial_elige_las_dos($texto) && wabot_comercial_ultimo_es_pregunta_turnos($conv)) {
        $d['solucion'] = $sol = 'informativa';
        $d['dos_planes'] = true;
        $d['mensajes'] = [];
        $d['info_claves'] = array_values(array_diff($d['info_claves'], $sinMontosTurnos));
        $ajustes[] = 'turnos_las_dos';
    }
    /* Después de los dos precios (sin reservas / con reservas), lo que elige se
     * cotiza: así sale la oferta de la demo, y si eligió reservas, el plan con
     * panel (simulaciones 21 y 24: contestaba "Perfecto, entonces…" y la charla
     * quedaba sin la oferta). */
    if (!empty($conv['comercial_dos_planes_ts']) && !wabot_comercial_oferta_hecha($conv, $cfg)
        && in_array($d['accion'], ['responder', 'esperar'], true) && wabot_comercial_contesta_turnos($texto)) {
        if (!in_array($sol, ['informativa', 'informativa_panel', 'reservas'], true)) {
            $sol = (preg_match('/\breserv/u', $t) && !preg_match('/\bsin reserv/u', $t)) ? 'reservas' : 'informativa';
            $d['solucion'] = $sol;
        }
        $d['accion'] = 'cotizar';
        $ajustes[] = 'dos_planes_eligio';
    }
    /* Un alojamiento (cabañas, hospedaje, alquiler temporario) va siempre con el plan con
     * panel, $190.000 / $30.000, aunque coordine las reservas por WhatsApp (Pablo, 11-nov:
     * «Sí, siempre $190.000», por la cabaña de Bariloche que se llevó el sitio de $140.000).
     * Sin los dos precios: con reservas desde la web es reservas; si no, la informativa con panel. */
    if ($alojamiento && $d['accion'] === 'cotizar' && in_array($sol, ['informativa', 'informativa_panel', 'reservas'], true)) {
        if ($sol === 'informativa') $d['solucion'] = $sol = 'informativa_panel';
        if (!empty($d['dos_planes'])) {
            $d['dos_planes'] = false;
            // Los dos precios no salen: el «Perfecto, entonces» de siempre antes de los planes.
            if (!$d['mensajes']) $d['mensajes'] = ['Perfecto, entonces'];
        }
        $ajustes[] = 'alojamiento_panel';
    }
    /* Quién carga los productos (Pablo, 9-oct): "Se pueden cargar todos
     * ustedes?" se contesta con carga_nosotros, nunca con "lo manejás vos". En
     * la informativa sin panel los cambios los hacemos nosotros (carga_sitio). */
    if (in_array($d['accion'], ['responder', 'cotizar', 'formulario'], true) && wabot_comercial_pide_que_carguemos($texto)) {
        $planCot = (string)(wabot_comercial_cotizacion($conv, $cfg)['plan'] ?? '');
        $clave = ($sol === 'informativa' || ($sol === 'sin_definir' && $planCot === 'informativa')) ? 'carga_sitio' : 'carga_nosotros';
        $otras = array_diff($d['info_claves'], ['carga', 'carga_sitio', 'carga_nosotros', 'manual', 'manual_sitio']);
        $d['info_claves'] = array_values(array_unique(array_merge([$clave], $otras)));
        // Lo que el modelo haya dicho sobre la carga sobra (la propuesta de la cotización queda).
        if ($d['accion'] !== 'cotizar') $d['mensajes'] = array_values(array_filter($d['mensajes'], function ($m) { return !preg_match('/\bcarg/iu', $m); }));
        $ajustes[] = 'carga_nosotros';
    }
    // Sin negocio contado se pide el rubro, conservando las otras dudas respondibles sin montos.
    if ($d['accion'] === 'responder' && !$negocio && !wabot_comercial_cotizacion($conv, $cfg)
        && function_exists('wabot_texto_pide_precio') && wabot_texto_pide_precio($texto)) {
        $d['info_claves'] = array_values(array_unique(array_merge(['precio_sin_rubro'], $d['info_claves'])));
        $d['mensajes'] = [];
        $ajustes[] = 'precio_sin_rubro';
    }
    /* Hosting y dominio del pago único (Pablo, 9-oct a la noche): incluidos el
     * primer año; a nombre del cliente, aparte. La respuesta general ("van
     * incluidos y nos ocupamos nosotros") no alcanza: va la específica. */
    if (in_array($d['accion'], ['responder', 'formulario'], true) && (!empty($conv['quiere_web_propia']) || $d['pago_unico'])
        && preg_match('/\b(hosting|dominio|servidor|alojamiento|renovacion|renovar)\b/u', $t)) {
        $d['info_claves'] = array_values(array_unique(array_merge(['hosting_pago_unico'], array_diff($d['info_claves'], ['hosting', 'accesos', 'hosting_renovacion', 'dominio_a_nombre']))));
        $d['mensajes'] = array_values(array_filter($d['mensajes'], function ($m) { return !preg_match('/\b(hosting|dominio)\b/iu', $m); }));
        $ajustes[] = 'hosting_pago_unico';
    }
    // El plan internacional no tiene pago único de lista: si lo pide, lo ve Pablo.
    if ($d['internacional'] && $d['pago_unico'] && in_array($d['accion'], ['cotizar', 'responder', 'formulario'], true)) {
        $d['accion'] = 'humano';
        $d['motivo'] = 'Proyecto con cobros internacionales que pide pago único (sin precio de lista)';
        $ajustes[] = 'internacional_pago_unico';
    }
    /* Pablo, 26-oct: "internacional lo sacamos de opción, eso lo doy yo dado el
     * caso". Una web que cobra en el exterior sin precio dado no se cotiza. */
    if ($d['internacional'] && $d['accion'] === 'cotizar' && !wabot_comercial_cotizacion($conv, $cfg)) {
        $d['accion'] = 'humano';
        $d['motivo'] = 'Proyecto con cobros internacionales: el precio lo pasa Pablo';
        $ajustes[] = 'internacional_humano';
    }
    // Muchos productos: se pueden cargar miles, avisando antes (9-oct). Si lo menciona, va la respuesta oficial.
    if (in_array($d['accion'], ['responder', 'cotizar', 'formulario'], true) && (int)wabot_ficha($conv)['cantidad_productos'] >= 300
        && !in_array('muchos_productos', $d['info_claves'], true) && empty($conv['comercial_muchos_avisado'])) {
        array_unshift($d['info_claves'], 'muchos_productos');
        $ajustes[] = 'muchos_productos';
    }
    // Un pedido de descuento se contesta con el texto aprobado y se sigue atendiendo.
    if (in_array($d['accion'], ['responder', 'cotizar', 'formulario'], true) && preg_match('/\bdescuento\b/u', $t)
        && !in_array('descuento', $d['info_claves'], true) && !preg_match('/\bcup[oó]n\w*\b/u', $t)) {
        array_unshift($d['info_claves'], 'descuento');
        $ajustes[] = 'descuento';
    }
    // En responder sin nada que decir y sin negocio, la pregunta fija (una sola vez por charla).
    if ($d['accion'] === 'responder' && !$negocio && !$d['mensajes'] && !$d['info_claves'] && empty($conv['rubro_preguntado'])) {
        $d['mensajes'] = [trim((string)($cfg['comercial']['pregunta_negocio'] ?? 'Te consulto, a qué te dedicás o qué vendés?'))];
        $ajustes[] = 'pregunta_negocio_fija';
    }
    return [$d, $ajustes];
}

/* ───────────── La etapa post-demo (Pablo, 1-nov): lo que detectan las reglas ───────────── */

/**
 * ¿Dice cuál de los dos modelos de la demo eligió? "El modelo 2", "la primera
 * opción", "me quedo con el 1", "Opción 2". Devuelve '1', '2' o null (no lo
 * dice, nombra los dos, o pregunta sin elegir).
 */
function wabot_comercial_postdemo_modelo($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 400) return null;
    if (preg_match('/\b(los dos|las dos|ambos|ambas|cualquiera|los 2|las 2|me da igual|da lo mismo)\b/u', $t)) return null;
    // "El 1 no me gusta", "el 2 está muy cargado": opina sobre uno, no lo elige.
    if (preg_match('/\b(el|la|modelo|opcion|diseno)\s+(1|2|uno|dos|primer[oa]?|segund[oa])\s+(no|nada|es (muy|medio|un poco|demasiado)|esta (muy|medio|un poco)|tiene (mucho|muchos|muchas|demasiad\w*)|demasiado|me parece (muy|medio|un poco)|queda (muy|medio|raro))\b/u', $t)) return null;
    // Fechas y horas: "pago el 1", "el 1 o el 2 de diciembre", "la 1 de la tarde", "a las 2".
    $meses = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre';
    $t = preg_replace(['/\b(pago|pagamos|cobro|cobramos|cobran|me pagan|abono|transfiero|deposito|hasta|desde|antes del|despues del|dia|vence|vencimiento)\s+(el|la)\s+\d+\b/u',
                       '/\b(el|la)\s+\d+\s+(o|y|al)\s+(el|la)?\s*\d+\s+de\s+(' . $meses . ')\b/u',
                       '/\b(el|la)\s+\d+\s+de\s+la\s+(manana|tarde|noche)\b/u', '/\b(a la|a las)\s+\d+\b/u', '/\b(el|la)\s+\d+\s+(hs|horas)\b/u'], ' ', $t);
    /* Con "el/la" solo cuenta si no sigue una fecha o un verbo: "el 1 de
     * diciembre", "el 2 te aviso", "la primera vez", "el primer pago" (revisión
     * del 1-nov). Con "modelo/opción/diseño…" cuenta siempre. */
    $noSigue = '(?!\s*(de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|este mes|cada mes|\d+)|del (mes|\d+)|vez|pago|pagos|mes|dia|dias|semana|cuota|cuotas|quincena|hora|horas|te aviso|les aviso|te digo|te confirmo|te escribo|te contesto)\b)(?!\s*\/)';
    $uno = preg_match('/\b(modelo|opcion|diseno|version|propuesta|numero|nro|n)\s+(1|uno|primera?|primero)\b|\b(el|la)\s+(1|uno|primera?|primero)\b' . $noSigue . '|^(el |la |opcion |modelo )?(1|uno)$/u', $t);
    $dos = preg_match('/\b(modelo|opcion|diseno|version|propuesta|numero|nro|n)\s+(2|dos|segund[ao])\b|\b(el|la)\s+(2|dos|segund[ao])\b' . $noSigue . '|^(el |la |opcion |modelo )?(2|dos)$/u', $t);
    if (($uno && $dos) || (!$uno && !$dos)) return null;
    // "El 1 tiene carrito?" pregunta por un modelo, no lo elige.
    if (strpos((string)$texto, '?') !== false && !preg_match('/\b(me gust\w*|me encant\w*|elijo|elegimos|prefiero|preferimos|me quedo|nos quedamos|vamos con|voy con|tomamos|quiero|queremos|avanzamos|avanzo)\b/u', $t)) return null;
    return $uno ? '1' : '2';
}

/**
 * Un acuse después de la demo: lo de siempre (wabot_es_acuse) más el "Perfecto,
 * muchas gracias por la info" que Pablo no contesta (12 % de los turnos post-demo).
 */
function wabot_comercial_postdemo_es_acuse($texto) {
    if (wabot_es_acuse($texto)) return true;
    $t = wabot_normalizar_frase(preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', (string)$texto));
    return $t !== '' && mb_strlen($t) <= 70
        && (bool)preg_match('/^((hola|buen dia|buenas( tardes| noches)?|perfecto|dale|ok|okey|listo|genial|buenisimo|barbaro|joya|excelente|bueno|si)\s*)*(muchas |mil )?gracias( (por|x) (la |toda la )?(info|informacion|data|respuesta|atencion|ayuda|explicacion|todo))?( (pablo|igualmente|saludos|buen dia|buenas tardes|buenas noches|un abrazo))?$/u', $t);
}

/**
 * ¿Avisa que ya pagó? Lo de siempre (wabot_dice_que_pago) más lo que apareció
 * en los chats del 4-oct al 1-nov: "Pago realizado te dejo el número de
 * operación", "Listo ya estoy suscripto", y la foto del comprobante (la
 * descripción de la imagen dice "comprobante" o "transferencia").
 */
function wabot_comercial_postdemo_avisa_pago($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '') return false;
    /* Sin tildes "pague" es también el subjuntivo, y "comprobante" puede ser un
     * pedido (revisión del 1-nov): "cómo hago para que te pague", "cuando te
     * pague arrancamos?", "me das comprobante?" no avisan un pago hecho. */
    if (preg_match('/\b(para que|cuando|apenas|antes de que|en cuanto|hasta que|ni bien|puedo|podria|quiero|queria)\s+(yo )?(te |les |le )?(pague|abone|transfiera|deposite|pagues)\b/u', $t)
        || preg_match('/\b(me|nos)\s+(das|dan|mandas|mandan|pasas|pasan|envias|envian|haces|hacen|podes dar|podes mandar)\b.{0,14}\b(comprobante|factura|recibo)\b/u', $t)
        || preg_match('/\b(necesito|necesitaria|quiero|me hace falta|me piden)\b.{0,10}\b(el |un |una |la )?(comprobante|factura|recibo)\b/u', $t)
        // "No pagué todavía", "aún no hice el pago", "no me llegó el comprobante".
        || preg_match('/\b(no|todavia no|aun no|sin)\b\s+(te |les |le |me |lo |la )?(lo |la )?(pague|abone|transferi|deposite|hice|realice|mande|envie|suscribi|adheri|subscribi|pude)\b|\bno me llego\b/u', $t)
        || preg_match('/\b(pague|abone|transferi)\b\s+(el |la |a |un |una )?(dominio|hosting|hostinger|otro|otra|wix|tiendanube|wordpress)\b/u', $t)
        // "El comprobante te lo mando mañana": todavía no.
        || (preg_match('/\b(manana|despues|luego|mas tarde|en un rato|el lunes|el martes|el miercoles|el jueves|el viernes|el sabado|la semana que viene)\b/u', $t)
            && !preg_match('/\b(ya|listo|recien|hice|realice|pague|transferi|deposite|abone|pase|mande|envie)\b/u', $t))) {
        return false;
    }
    // Lo inequívoco vale aunque siga una pregunta ("Pago realizado, ¿cuándo arrancan?", "Me suscribí, ¿qué sigue?").
    if (preg_match('/\b(pago realizado|pago (hecho|efectuado|aprobado|acreditado)|transferencia (realizada|hecha|enviada|exitosa|aprobada)|ya (esta|quedo) (pago|pagado|abonado|transferido)'
        . '|(estoy|quede|ya estoy|ya quede) (suscripto|suscripta|suscrito|suscrita|adherido|adherida)|(ya )?(me )?(suscribi|adheri|subscribi)|numero de operacion|n(ro|umero)? de (operacion|comprobante|transaccion)'
        . '|(te|les) (dejo|mando|paso|envio|adjunto|comparto|deje|mande|pase|envie) (el |la |un |una )?(comprobante|transferencia)'
        . '|(listo |ya )?(transferido|depositado|abonado)|te (llego|entro) (la|el) (transferencia|pago|deposito|plata)'
        . '|te (hice|mande|envie|deje) (el|la|un|una) (pago|transferencia|deposito|sena)|ahi (te )?(transferi|pague|deposite|hice la transferencia)|realice (el|la) (pago|transferencia))\b/u', $t)) {
        return true;
    }
    // Lo demás ("pagué", "comprobante" sueltos), solo si no es una pregunta sin nada de pasado.
    if (strpos((string)$texto, '?') !== false && !preg_match('/\b(ya|listo|recien|ahi|hecho|realice|hice|mande|envie|pase|transferi|deposite|pague|abone)\b/u', $t)) return false;
    if (function_exists('wabot_dice_que_pago') && wabot_dice_que_pago($texto)) return true;
    return (bool)preg_match('/\bcomprobante\b/u', $t);
}

/**
 * ¿Pide pagar o el link? "Pasame el link", "cómo te pago", "cuánto hay que
 * dejar para arrancar", "quiero avanzar", "cómo seguimos". Hablar de cómo le
 * pagan SUS clientes en SU web no cuenta; preguntar por una modalidad tampoco
 * (eso es una duda: pago, medios_pago).
 */
function wabot_comercial_postdemo_pide_pago($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 400) return false;
    if (preg_match('/\b(mi|mis|su|sus)\b.{0,14}\b(web|pagina|sitio|tienda|negocio|clientes|compradores)\b|\b(cobrar|cobro|cobren|cobra|cobrarles|exterior|dolares|paypal)\b/u', $t)) return false;
    // "Cuando cobre te pago", "la semana que viene te transfiero": posterga, no pide pagar ahora.
    if (preg_match('/\b(cuando (cobre|pueda|tenga|me paguen|junte)|la semana que viene|el mes que viene|mas adelante|en unos dias|los primeros dias|a fin de mes|despues te|luego te|(pagar|pago|transferir|transfiero|abonar|abono) (el )?(lunes|martes|miercoles|jueves|viernes|sabado|domingo|manana))\b/u', $t)) return false;
    // "Ya pagué la seña": avisa, no pide (lo toma wabot_comercial_postdemo_avisa_pago). "Después de la seña cuánto queda?": el saldo.
    if (wabot_comercial_postdemo_avisa_pago($texto) || preg_match('/\b(despues de la sena|el resto|el saldo|cuanto queda)\b/u', $t)) return false;
    // "No tengo para la seña ahora", "todavía no puedo pagar": no lo pide.
    if (preg_match('/\b(no (tengo|puedo|llego|me alcanza|me da)|todavia no|aun no|ahora no)\b/u', $t)) return false;
    // Otra cosa que se paga ("¿dónde pago el dominio?", "¿cómo se paga el mantenimiento?") o el link para volver a ver la demo.
    if (preg_match('/\b(pago|pagar|paga|pagan|abono|abonar)\b.{0,12}\b(dominio|hosting|mantenimiento|mensualidad|renovacion)\b/u', $t) && strpos((string)$texto, '?') !== false) return false;
    if (preg_match('/\b(link|enlace)\b.{0,12}\b(para )?(ver|mirar|entrar|abrir|volver a ver)\b.{0,12}\b(web|pagina|demo|diseno|modelo|sitio)\b/u', $t)) return false;
    // "Quiero arrancar con los cambios": avanzar con el diseño, no pagar.
    if (preg_match('/\b(arrancar|avanzar|empezar|seguir)\s+con\s+(los|las|el|la|unos|unas)\s+(cambio|ajuste|modific|logo|foto|texto|color)\w*/u', $t)) return false;
    if (function_exists('wabot_postdemo_avance_explicito') && wabot_postdemo_avance_explicito($texto)) return true;
    return (bool)(preg_match('/\b(como|donde|de que forma)\b.{0,22}\b(te pago|les pago|te abono|hago para pagar|hago el pago|te transfiero|te deposito|pago|abono)\b/u', $t)
        || preg_match('/\b(cuanto|que)\b.{0,20}\b(hay que|tengo que|debo|se)\b.{0,14}\b(dejar|pagar|abonar|adelantar)\b/u', $t)
        // "¿El pago inicial incluye el dominio?" o "te adelanto que…" son dudas, no pedir pagar.
        || ((strpos((string)$texto, '?') === false
                || preg_match('/\b(pagar|pago|pagarte|abonar|abono|dejar|dejo|transferir|transfiero|mandar|mando|hacer|hago|deposito|cuanto|cual)\b.{0,20}\b(la |el )?(sena|anticipo|adelanto|primer pago|pago inicial)\b/u', $t)
                || preg_match('/^(y )?(la |el )?(sena|anticipo|adelanto|primer pago|pago inicial)( (cuanto|cuanto es|cuanto seria|de cuanto))?$/u', $t)
                || preg_match('/\b(sena|anticipo|adelanto|primer pago|pago inicial)\b.{0,12}\b(cuanto|de cuanto)\b/u', $t))
            && preg_match('/\b(sena|anticipo|adelanto|primer pago|pago inicial)\b/u', $t) && !preg_match('/\b(te|les|le) adelanto\b(?! (la|el) (sena|pago|anticipo))/u', $t))
        || preg_match('/\b(link|enlace)\b.{0,12}\b(pago|pagar|mercado ?pago|suscri\w*)|\b(pasame|mandame|enviame|dame) (el|un) link\b|\b(quiero|queremos|vamos a|voy a) (pagar|abonar|contratar|arrancar|avanzar)\b(?! con (los|las|el|la|unos|unas) (cambio|ajuste|modific|logo|foto|texto|color))/u', $t));
}

/**
 * ¿No quiere Mercado Pago o pide transferir? "No tengo Mercado Pago",
 * "puedo hacer transferencia?", "pasame el alias / CBU". Lo que habla de cómo
 * cobra él en su web no cuenta (medios_pago_tienda).
 */
function wabot_comercial_postdemo_pide_transferencia($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if ($t === '' || mb_strlen($t) > 400) return false;
    if (preg_match('/\b(mi|mis|su|sus)\b.{0,14}\b(web|pagina|sitio|tienda|negocio|clientes|compradores)\b|\b(cobrar|cobro|cobren|cobra|cobrarles)\b/u', $t)) return false;
    return (bool)(preg_match('/\b(transferencia|transferir|transfiero|transferirte|transferencia bancaria|cbu|cvu|alias)\b/u', $t)
        || preg_match('/\b(no (tengo|uso|quiero|puedo con|manejo|me gusta)|sin|nada de)\b.{0,10}\b(mercado ?pago|mp|suscripcion)\b/u', $t)
        || preg_match('/\bpagar(te|les)? (por|con) (transferencia|deposito|efectivo|banco|home ?banking)\b/u', $t));
}

/**
 * La modalidad que elige después de la demo: la de siempre
 * (wabot_comercial_elige_plan) o, como acá ya vio los planes, una frase corta
 * que nombra UNA sola sin preguntar ni negar ("Hola, elegiría plan mensual",
 * "Mensual", "plan anual"). mensual / unico (= anual) / propia (pago único) /
 * inicial, o null.
 */
function wabot_comercial_postdemo_plan($texto, $conv) {
    $t = wabot_normalizar_frase((string)$texto);
    // Después de la demo "el 1" o "la 2" es un MODELO, no una modalidad: sin una palabra de plan no hay plan.
    if ($t === '' || !preg_match('/\b(mensual|anual|unico|inicial|suscripcion|por mes|mes a mes|por ano|un solo pago|una sola vez)\b/u', $t)) return null;
    /* Una frase que cuenta o pregunta algo del plan ("y si el pago mensual es
     * indefinidamente o una cantidad de meses") no lo elige, aunque el detector
     * de siempre lea el "si" como un sí. */
    if (preg_match('/\b(no|ni|tampoco|nunca|cuanto|cuanta|saber|consultar|preguntar|averiguar|entender|info|informacion|detalles?|diferencia|incluye|incluyen|incluido|dejo|dejar|cancel'
        . '|es|y si|si el|si la|indefinid|cantidad|meses|despues|luego|tambien|como|seria|serian|cuando|pasa)\b/u', $t)) return null;
    $e = wabot_comercial_elige_plan($texto, $conv);
    if ($e !== null) return $e;
    $crudo = trim((string)$texto);
    if (mb_strlen($crudo) > 120 || strpos($crudo, '?') !== false || strpos($crudo, '¿') !== false) return null;
    $m = preg_match('/\bmensual\b/u', $t);
    $a = preg_match('/\banual\b/u', $t);
    $p = preg_match('/\b(pago unico|unico pago|un solo pago)\b/u', $t);
    $i = preg_match('/\b(pago inicial|el inicial)\b/u', $t);
    if ($m + $a + $p + $i !== 1) return null;
    $modelo = (string)($conv['comercial_cotizacion']['modelo'] ?? '');
    if ($modelo === 'b') return $p ? 'propia' : 'inicial';
    if ($a && $modelo === 'a') return null;   // en el grupo A no hay plan anual: lo ve Pablo
    return $m ? 'mensual' : ($a ? 'unico' : ($p ? 'propia' : 'inicial'));
}

/**
 * La respuesta a la pregunta de la modalidad (2-nov): recién preguntada y sin
 * modalidad todavía, una respuesta corta que nombra UNA sola, sin preguntar ni
 * negar, la elige aunque diga "sería" o "es" ("Sería el mensual", "anual"),
 * que el detector general deja pasar. mensual / unico (= anual) / propia, o null.
 */
function wabot_comercial_postdemo_respuesta_modalidad($texto, $conv) {
    if ((int)($conv['postdemo_pregunto_modalidad_ts'] ?? 0) <= 0 || (string)($conv['modalidad_elegida'] ?? '') !== '') return null;
    $crudo = trim((string)$texto);
    if ($crudo === '' || mb_strlen($crudo) > 80 || strpos($crudo, '?') !== false || strpos($crudo, '¿') !== false) return null;
    $t = wabot_normalizar_frase($crudo);
    if (preg_match('/\b(no|ni|tampoco|nunca)\b/u', $t)) return null;
    $m = preg_match('/\b(mensual|por mes|mes a mes)\b/u', $t);
    $a = preg_match('/\b(anual|por ano)\b/u', $t);
    $p = preg_match('/\b(pago unico|el unico|unico pago|un solo pago|una sola vez)\b/u', $t);
    if ($m + $a + $p !== 1) return null;
    // En A y B no hay plan anual (prueba de precios).
    if ($a && in_array((string)($conv['comercial_cotizacion']['modelo'] ?? ''), ['a', 'b'], true)) return null;
    return $m ? 'mensual' : ($a ? 'unico' : 'propia');
}

/**
 * Las reglas de la etapa post-demo sobre la decisión del modelo (1-nov). Lo
 * que detectan las reglas se suma a lo que marcó el modelo; lo que pide pagar o
 * avanzar ya no es un caso para Pablo (antes de la demo sí lo era); "lo veo y
 * te aviso" nunca se lleva el link. Nunca escribe un texto libre nuevo: los
 * bloques fijos los monta wabot_comercial_construir_postdemo().
 */
function wabot_comercial_validar_postdemo($d, $texto, $conv, $cfg, array $ajustes) {
    $modelo = wabot_comercial_postdemo_modelo($texto);
    if ($modelo !== null) {
        $d['modelo_elegido'] = $modelo;
        if ($modelo !== (string)($conv['modelo_elegido'] ?? '')) $ajustes[] = 'postdemo_modelo';
    }
    if (function_exists('wabot_postdemo_pide_cambios') && wabot_postdemo_pide_cambios($texto) && empty($d['pide_cambios'])) {
        $d['pide_cambios'] = true;
        $ajustes[] = 'postdemo_cambios';
    }
    if (wabot_comercial_postdemo_pide_transferencia($texto) && empty($d['pide_transferencia'])) {
        $d['pide_transferencia'] = true;
        $ajustes[] = 'postdemo_transferencia';
    }
    $pidePago = wabot_comercial_postdemo_pide_pago($texto);
    if ($pidePago && empty($d['pide_pago'])) {
        $d['pide_pago'] = true;
        $ajustes[] = 'postdemo_pide_pago';
    }
    $plan = in_array($d['intencion'], ['rechaza', 'posterga'], true) ? null
        : (wabot_comercial_postdemo_plan($texto, $conv) ?? wabot_comercial_postdemo_respuesta_modalidad($texto, $conv));
    if ($plan !== null) {
        $d['plan_elegido'] = $plan;
        $d['pide_pago'] = true;
        $ajustes[] = 'postdemo_plan';
    }
    /* Le gustó o quiere avanzar (y no dijo que lo va a mirar): el sistema
     * pregunta el modelo o manda el link. "Lo veo y te aviso" nunca se lleva el
     * link, aunque el modelo lo haya marcado, salvo que lo pida con todas las letras. */
    $laMira = (function_exists('wabot_postdemo_la_va_a_mirar') && wabot_postdemo_la_va_a_mirar($texto)) || $d['intencion'] === 'posterga';
    if (!$laMira && empty($d['quiere_avanzar']) && $d['intencion'] !== 'rechaza'
        && ((function_exists('wabot_postdemo_elogio') && wabot_postdemo_elogio($texto)) || (function_exists('wabot_postdemo_avance_explicito') && wabot_postdemo_avance_explicito($texto)))) {
        $d['quiere_avanzar'] = true;
        $ajustes[] = 'postdemo_avanza';
    }
    $pideLink = (bool)preg_match('/\b(link|enlace|alias|cbu|cvu|los datos)\b/u', wabot_normalizar_frase((string)$texto));
    if ($laMira && !$pideLink && $plan === null && (!empty($d['quiere_avanzar']) || !empty($d['pide_pago']))) {
        $d['quiere_avanzar'] = false;
        $d['pide_pago'] = false;
        $ajustes[] = 'postdemo_posterga';
    }
    // Con un modelo elegido, el acuse "tomamos el modelo N" sale igual; el link, no (wabot_comercial_construir_postdemo).
    $d['sin_link_por_mirar'] = $laMira && !$pideLink && $plan === null;
    $hayBloque = ($d['modelo_elegido'] ?? null) !== null || !empty($d['pide_cambios']) || !empty($d['pide_transferencia']) || !empty($d['pide_pago']) || !empty($d['quiere_avanzar']) || !empty($d['avisa_pago']);
    if ($hayBloque && $d['accion'] === 'esperar') {
        $d['accion'] = 'responder';
        $ajustes[] = 'postdemo_responder';
    }
    // Quiere pagar, pide el link o eligió plan o modelo: antes de la demo iba a Pablo; acá lo cierra el sistema.
    /* Pero no si es de Pablo aunque hable de pagar (revisión del 1-nov): "me
     * podés llamar para coordinar el pago?", cuotas, descuento, factura, otro
     * nombre o un reclamo. "pag\w*" agarraba también "página". */
    $deriva = '/\b(llam\w*|telefon\w*|persona|hablar con|cuota\w*|descuento\w*|factura\w*|reclam\w*|queja\w*|excepci\w*|precio especial|a nombre de|otro nombre|devoluci\w*|reembols\w*)\b/iu';
    if ($d['accion'] === 'humano' && (!empty($d['pide_pago']) || !empty($d['pide_transferencia']) || $plan !== null || $modelo !== null || !empty($d['avisa_pago']))
        && !preg_match($deriva, (string)$d['motivo'])
        && !preg_match('/\b(llamame|llamarme|llamarte|llamada|llamar|llamas|hablar con|cuotas|descuento|factura|reclamo|queja|reembolso|devolucion)\b/u', wabot_normalizar_frase((string)$texto))
        && preg_match('/\b(pagar|pago|pagos|pague|pagarlo|pagarte|pagado|pagada|pagaste|link|transfer\w*|alias|cbu|cvu|avanzar|arrancar|modelo|plan|suscri\w*|comprobante)\b/u', wabot_normalizar_frase((string)$d['motivo']))) {
        $d['accion'] = 'responder';
        $d['motivo'] = null;
        $ajustes[] = 'postdemo_no_humano';
    }
    if (!empty($d['pide_cambios']) && $d['accion'] === 'responder' && !in_array('cambios_demo', $d['info_claves'], true)) {
        array_unshift($d['info_claves'], 'cambios_demo');
    }
    return [$d, $ajustes];
}

/**
 * El link de pago de ESTA charla (1-nov), como lo manda Pablo: la página de
 * pago/ que cobra exactamente los montos de su cotización congelada (mensual20000,
 * anual210, unico330, inicial100…). Sin modalidad elegida, la mensual (o el
 * pago inicial en el modelo B), como hace él. Si la modalidad que eligió no
 * está en su cotización o no hay página que cobre ese monto, null: el link lo
 * manda Pablo. {sena} y {saldo} del anual y del pago único salen de la
 * cotización y de la seña de su tipo (sena / sena_unico de textos.php).
 */
function wabot_comercial_postdemo_pago($conv, $cfg, $modalidad = null) {
    $cfg = wabot_ab_cfg($cfg, $conv);
    $pd = (array)($cfg['comercial']['postdemo'] ?? []);
    $cot = wabot_comercial_cotizacion($conv, $cfg);
    if (!$cot) return null;
    $tipo = (string)($conv['tipo'] ?? '');
    if ($tipo === '' || $tipo === 'sistema') $tipo = (string)(wabot_comercial_soluciones()[(string)($conv['comercial_solucion'] ?? '')]['tipo'] ?? '');
    if ($tipo === '' || $tipo === 'sistema') $tipo = wabot_comercial_plan_tipo((string)($cot['plan'] ?? 'panel'));
    $m = (string)($modalidad ?: ($conv['modalidad_elegida'] ?? ''));
    if ($m === '') $m = trim((string)($cot['inicial'] ?? '')) !== '' ? 'inicial' : 'mensual';
    // En el modelo B lo primero que se paga es siempre el pago inicial; la mensualidad arranca al mes.
    if ($m === 'mensual' && trim((string)($cot['inicial'] ?? '')) !== '') $m = 'inicial';
    $campo = ['mensual' => 'mensual', 'unico' => 'anual', 'propia' => 'unico', 'inicial' => 'inicial'][$m] ?? null;
    if ($campo === null) return null;
    $n = wabot_monto_a_numero(trim((string)($cot[$campo] ?? '')));
    if ($n <= 0 || $n % 1000 !== 0) return null;
    $pagina = $campo === 'mensual' ? 'mensual' . $n : $campo . intdiv($n, 1000);
    if (!is_file(__DIR__ . '/../pago/' . $pagina . '/index.html')) return null;
    $plantilla = trim((string)($pd['link_' . $campo] ?? ''));
    if ($plantilla === '' || strpos($plantilla, '{link}') === false) return null;
    $sena = '';
    $saldo = '';
    if (strpos($plantilla, '{sena}') !== false) {
        if ($campo === 'anual') $sena = trim((string)(wabot_precio_vigente($conv, $cfg, $tipo)['sena'] ?? '')) ?: trim((string)($cfg['tipos'][$tipo]['sena'] ?? ''));
        if ($campo === 'unico') $sena = trim((string)($cfg['tipos'][$tipo]['sena_unico'] ?? ''));
        $s = wabot_monto_a_numero($sena);
        if ($s <= 0 || $s >= $n) return null;
        $saldo = wabot_moneda($n - $s);
    }
    // Con el código corto de la charla, la página manda a MP la referencia GKY-<código> y pagos.php ata el pago al chat solo (como las respuestas rápidas).
    $sufijo = preg_match('/^[A-Z0-9]{1,12}$/', (string)($conv['codigo'] ?? '')) ? '?c=' . $conv['codigo'] : '';
    return ['t' => strtr($plantilla, ['{link}' => 'gokywebs.com/pago/' . $pagina . $sufijo, '{sena}' => $sena, '{saldo}' => $saldo]), 'modalidad' => $m, 'pagina' => $pagina];
}

/**
 * Los mensajes de un turno post-demo (accion responder): las respuestas
 * oficiales y lo que escribió el modelo, con los bloques fijos de Pablo
 * alrededor según lo que marcó la decisión: "Perfecto, tomamos el modelo N"
 * adelante; atrás, los datos de transferencia, el link de pago o la pregunta
 * del modelo. El link va UNA vez por charla (otra vez solo si lo pide de
 * nuevo o elige un plan), y la pregunta del modelo también. Si pide el link y no
 * hay página que cobre sus montos, lo manda Pablo (accion humano).
 */
function wabot_comercial_construir_postdemo($d, $texto, $c, $cfg, array &$resumen) {
    $msgs = [];
    $pd = (array)($cfg['comercial']['postdemo'] ?? []);
    if (!empty($d['avisa_pago'])) {
        // El modelo lo vio y las reglas no: el mismo acuse, y lo verifica Pablo (wabot_comercial_turno avisa).
        $t = trim((string)($cfg['postdemo_pago_avisado'] ?? ''));
        $resumen['pago_avisado'] = true;
        return $t !== '' ? [['t' => $t, 'efecto' => 'pago_avisado']] : [];
    }
    $modeloGuardado = (string)($c['modelo_elegido'] ?? '');
    $modeloNuevo = ($d['modelo_elegido'] ?? null) !== null && (string)$d['modelo_elegido'] !== $modeloGuardado ? (string)$d['modelo_elegido'] : '';
    if ($modeloNuevo !== '') {
        $ack = trim((string)($pd['modelo_elegido'] ?? ''));
        if ($ack !== '') $msgs[] = ['t' => strtr($ack, ['{modelo}' => $modeloNuevo]), 'efecto' => 'modelo'];
        $resumen['modelo_elegido'] = $modeloNuevo;
    }
    $modeloConocido = $modeloNuevo !== '' || $modeloGuardado !== '';
    if (!empty($d['pide_cambios'])) $resumen['cambios'] = true;

    $propios = array_values(array_filter($d['mensajes'], function ($m) { return !wabot_comercial_es_solo_saludo($m); }));
    foreach (wabot_comercial_info_textos($d['info_claves'], $c, $cfg, false, $texto, (bool)$propios) as $t) $msgs[] = ['t' => $t, 'efecto' => 'info'];
    foreach ($propios as $m) $msgs[] = ['t' => $m, 'efecto' => 'texto'];

    $plan = $d['plan_elegido'] ?? null;
    if ($plan !== null) $resumen['plan_elegido'] = $plan;
    $yaLink = (int)($c['postdemo_link_pago_ts'] ?? 0) > 0;
    $pregunto = (int)($c['postdemo_pregunto_modelo_ts'] ?? 0) > 0;
    $repite = wabot_comercial_pide_repetir($texto);
    $pregunta = trim((string)($pd['pregunta_modelo'] ?? ''));
    $pedirModelo = function () use (&$msgs, $pregunta) {
        if ($pregunta !== '') $msgs[] = ['t' => $pregunta, 'efecto' => 'pregunta_modelo'];
    };
    $mandarLink = function ($modalidad) use (&$msgs, &$resumen, $c, $cfg) {
        $pago = wabot_comercial_postdemo_pago($c, $cfg, $modalidad);
        if ($pago === null) { $resumen['sin_link_pago'] = true; return false; }
        $msgs[] = ['t' => $pago['t'], 'efecto' => 'pago'];
        $resumen['link_pago'] = $pago['modalidad'];
        return true;
    };
    /* El formulario ya no pregunta la forma de pago (Pablo, 2-nov): si todavía no
     * la eligió, antes del link va la pregunta de la modalidad de su grupo, una
     * vez. Si ya se la hicimos y vuelve a pedir el pago sin decirla, va el link de
     * siempre (el mensual). Con pago inicial (B) hay una sola: el link, directo. */
    $preguntaModalidad = trim((string)($pd['pregunta_modalidad'] ?? ''));
    $unaSola = trim((string)($c['comercial_cotizacion']['inicial'] ?? '')) !== '';
    $linkOPregunta = function ($modalidad) use (&$msgs, $mandarLink, $c, $preguntaModalidad, $unaSola) {
        if ($modalidad === null && !$unaSola && (string)($c['modalidad_elegida'] ?? '') === '' && $preguntaModalidad !== ''
            && (int)($c['postdemo_pregunto_modalidad_ts'] ?? 0) <= 0) {
            $msgs[] = ['t' => $preguntaModalidad, 'efecto' => 'pregunta_modalidad'];
            return true;
        }
        return $mandarLink($modalidad);
    };
    if (!empty($d['pide_transferencia'])) {
        $datos = trim((string)($pd['transferencia_cbu'] ?? ''));
        if ($datos !== '' && ((int)($c['postdemo_transferencia_ts'] ?? 0) <= 0 || $repite)) $msgs[] = ['t' => $datos, 'efecto' => 'transferencia'];
        if (!$modeloConocido && !$pregunto) $pedirModelo();
    } elseif (!empty($d['pide_pago']) || $plan !== null) {
        if (!$modeloConocido && !$pregunto) $pedirModelo();
        if (!$yaLink || $repite || $plan !== null) $linkOPregunta($plan);
    } elseif (!empty($d['quiere_avanzar']) || ($modeloNuevo !== '' && empty($d['sin_link_por_mirar']))) {
        if ($modeloConocido) {
            if (!$yaLink) $linkOPregunta(null);
        } elseif (!$pregunto) {
            $pedirModelo();
        } elseif (!$yaLink) {
            $linkOPregunta(null);
        }
    }
    if (!empty($resumen['sin_link_pago'])) {
        if (!empty($d['pide_pago']) || $plan !== null) {
            // Pidió el link (o eligió un plan) y no hay página que cobre sus montos: lo manda Pablo, en silencio.
            $resumen['accion'] = 'humano';
            $resumen['motivo'] = 'Pide el link de pago y no hay página en pago/ que cobre los montos de su cotización';
            return [];
        }
        // Le gustó y no hay link para mandarle: lo que escribió el modelo sale, y Pablo lo ve pendiente.
        $resumen['pendiente_pablo'] = 'Le gustó la demo y no hay página en pago/ que cobre los montos de su cotización';
    }
    return $msgs;
}

/**
 * "Ya pagué" / el comprobante después de la demo (1-nov): se le confirma que lo
 * revisamos, queda marcado (pago_avisado_ts: la columna Pago del panel y el fin
 * de la etapa post-demo) y se le avisa a Pablo. Sin pasar por el modelo.
 */
function wabot_comercial_postdemo_pago_avisado(&$conv, $cfg, $texto) {
    $ahora = time();
    $conv['pago_avisado_ts'] = $ahora;
    $conv['handoff_pendiente'] = true;
    $conv['comercial_ultimo'] = ['ts' => $ahora, 'accion' => 'responder', 'motivo' => 'Avisó que pagó: se le confirmó que lo revisamos y lo verifica Pablo',
                                 'ajustes' => ['pago_avisado'], 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
    wabot_evento_sesion($conv, 'pago_avisado');
    wabot_log('comercial_pago_avisado', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr((string)$texto, 0, 160)]);
    wabot_comercial_postdemo_avisar_pablo($conv);
    $conv['_comercial_salida'] = true;
    $t = trim((string)($cfg['postdemo_pago_avisado'] ?? ''));
    return $t !== '' ? [$t] : [];
}

/**
 * El aviso a Pablo de que avisó que pagó: el de siempre (push.php, marcado
 * «avisó que pagó» porque la charla ya está en la columna Pago). Se manda
 * acá, antes de que nuestro acuse quede en el transcript: el webhook solo
 * avisa al final del turno si el último mensaje es del cliente, y acá el
 * último va a ser el nuestro.
 */
function wabot_comercial_postdemo_avisar_pablo($conv) {
    if (!function_exists('wabot_push_avisar_si_corresponde')) return false;
    try {
        return (bool)wabot_push_avisar_si_corresponde($conv);
    } catch (Throwable $e) {
        wabot_log('error', ['donde' => 'push_pago_avisado', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        return false;
    }
}

/* ─────────────────────────────── Construcción de los mensajes ─────────────────────────────── */

/**
 * El bloque de planes de la solución con los montos de ESTA cotización. Desde
 * el 26-oct (Pablo) el pago único va primero, para todos; una cotización sin
 * pago único (congelada antes, o la internacional) sale con el bloque de antes
 * (anual primero) y el pago único abajo solo si lo pidió.
 */
function wabot_comercial_planes_texto($solucion, $cotizacion, $cfg, $conPagoUnico = false) {
    $plan = (string)($cotizacion['plan'] ?? (wabot_comercial_soluciones()[$solucion]['plan'] ?? 'panel'));
    $bloque = ['informativa' => 'planes_informativa', 'internacional' => 'planes_internacional'][$plan] ?? 'planes_panel';
    $unico = trim((string)($cotizacion['unico'] ?? ''));
    // Prueba de precios (31-oct): el bloque del grupo trae {inicial} (B) o el pago único sin el anual (A).
    if ($unico === '' && isset($cfg['comercial'][$bloque . '_sin_unico'])) $bloque .= '_sin_unico';
    $plantilla = trim((string)($cfg['comercial'][$bloque] ?? ''));
    $anual = trim((string)($cotizacion['anual'] ?? ''));
    $inicial = trim((string)($cotizacion['inicial'] ?? ''));
    if ($plantilla === '' || trim((string)($cotizacion['mensual'] ?? '')) === '') return '';
    if ((strpos($plantilla, '{anual}') !== false && $anual === '') || (strpos($plantilla, '{inicial}') !== false && $inicial === '')
        || (strpos($plantilla, '{unico}') !== false && $unico === '')) return '';
    $marcas = ['{anual}' => $anual, '{mensual}' => $cotizacion['mensual'], '{inicial}' => $inicial, '{web}' => wabot_ab_nombre_web($solucion)];
    if (strpos($plantilla, '{unico}') !== false) return strtr($plantilla, $marcas + ['{unico}' => $unico]);
    $texto = strtr($plantilla, $marcas);
    if ($conPagoUnico && $unico !== '') {
        $unico = trim((string)($cfg['comercial']['pago_unico'] ?? ''));
        if ($unico !== '') $texto .= "\n\n" . str_replace('{unico}', $cotizacion['unico'], $unico);
    }
    return $texto;
}

/**
 * El precio de dos webs juntas (Pablo, 10-oct): la suma de los montos de lista
 * de cada una menos el descuento de comercial.dos_webs_descuento. Devuelve
 * [anual, mensual, anual_lista, mensual_lista] como "$330.000", o null si falta
 * algún monto o alguna no es una solución que cotizamos.
 */
function wabot_comercial_dos_webs_montos($solA, $solB, $cfg) {
    $sols = wabot_comercial_soluciones();
    if (empty($sols[$solA]['plan']) || empty($sols[$solB]['plan'])) return null;
    $num = function ($m) { return (int)preg_replace('/\D/', '', (string)$m); };
    $fmt = function ($n) { return '$' . number_format($n, 0, ',', '.'); };
    $a = wabot_comercial_montos_lista($sols[$solA]['plan'], $cfg);
    $b = wabot_comercial_montos_lista($sols[$solB]['plan'], $cfg);
    $mensual = $num($a['mensual']) + $num($b['mensual']);
    $anual = $num($a['anual']) + $num($b['anual']);
    if ($num($a['mensual']) <= 0 || $num($b['mensual']) <= 0 || $num($a['anual']) <= 0 || $num($b['anual']) <= 0) return null;
    $desc = (array)($cfg['comercial']['dos_webs_descuento'] ?? []);
    return ['anual' => $fmt(max(0, $anual - (int)($desc['anual'] ?? 0))), 'mensual' => $fmt(max(0, $mensual - (int)($desc['mensual'] ?? 0))),
            'anual_lista' => $fmt($anual), 'mensual_lista' => $fmt($mensual)];
}

/**
 * Las dos webs de esta decisión, o null: la primera es la solución del turno o,
 * si no la repitió, la que ya se había definido en la charla. Devuelve
 * ['texto' => el bloque, 'resumen' => lo que queda en comercial_dos_webs].
 */
function wabot_comercial_dos_webs_armar(array $d, $sol, $conv, $cfg) {
    $seg = (string)($d['segunda_solucion'] ?? '');
    if ($seg === '' || !wabot_comercial_solucion_estandar($seg)) return null;
    $primera = wabot_comercial_solucion_estandar($sol) ? $sol : (string)($conv['comercial_solucion'] ?? '');
    if (!wabot_comercial_solucion_estandar($primera)) return null;
    $montos = wabot_comercial_dos_webs_montos($primera, $seg, $cfg);
    $texto = $montos ? wabot_comercial_dos_webs_texto($primera, $seg, $montos, $cfg) : '';
    if ($texto === '') return null;
    return ['texto' => $texto, 'resumen' => ['soluciones' => [$primera, $seg], 'ts' => time()] + $montos];
}

/** El bloque con el precio de las dos webs, o '' si no se puede armar. */
function wabot_comercial_dos_webs_texto($solA, $solB, array $montos, $cfg) {
    $plantilla = trim((string)($cfg['comercial']['dos_webs_planes'] ?? ''));
    if ($plantilla === '') return '';
    $sols = wabot_comercial_soluciones();
    $webs = $solA === $solB ? 'las dos son ' . $sols[$solA]['nombre'] : $sols[$solA]['nombre'] . ' y ' . $sols[$solB]['nombre'];
    return strtr($plantilla, ['{webs}' => $webs, '{anual}' => $montos['anual'], '{mensual}' => $montos['mensual'],
                              '{anual_lista}' => $montos['anual_lista'], '{mensual_lista}' => $montos['mensual_lista']]);
}

/** ¿Vuelve a pedir el precio o los planes? ("cuánto era?", "pasame los precios de nuevo") */
function wabot_comercial_pide_precio_otra_vez($texto) {
    $t = wabot_normalizar_frase((string)$texto);
    if (preg_match('/\bcuanto\b/u', $t)) return true;
    if (preg_match('/\b(pasame|pasar|decime|repetime|me pasas|me decis|mandame|cual es|cual era|cuales son|cuales eran)\b.{0,25}\b(precios?|valor\w*|planes|montos?|costo)\b/u', $t)) return true;
    /* «Pero quería tener una idea de lo que sale una página» (3-nov): no entraba por largo
     * y, con el precio ya dado, no salía nada. */
    if (preg_match('/\b(lo que|que|a cuanto|q) (me )?(sale|salen|saldria|cuesta|cuestan|costaria|vale|valen)\b/u', $t)) return true;
    if (preg_match('/\b(que|cual) (precio|valor|costo) (tiene|tienen|es|seria|sale|manejan|manejas)\b/u', $t)) return true;
    if (preg_match('/\b(una idea|saber|conocer)\b.{0,30}\b(precios?|valor|valores|costos?|presupuesto)\b/u', $t)) return true;
    // "Precios?", "y el valor?": la pregunta corta, sin más.
    return mb_strlen($t) <= 25 && (bool)preg_match('/\b(precios?|valor\w*|costo|planes)\b/u', $t);
}

/** "Hola! 👋", "Buenas tardes!": un mensaje que no dice nada más que el saludo. */
function wabot_comercial_es_solo_saludo($m) {
    $t = wabot_normalizar_frase(function_exists('wabot_sin_emojis') ? wabot_sin_emojis((string)$m) : (string)$m);
    return $t !== '' && (bool)preg_match('/^(hola+|holis|buenas|buen dia|buenos dias|buenas tardes|buenas noches|que tal|como estas|todo bien|bien|muy bien|gracias|bien gracias|muy bien gracias)( (y )?(vos|a vos|usted|ustedes))?[ ,.!]*$/u', $t);
}

/** "Buenas! Te podemos armar…" → "Te podemos armar…"; también "Hola, buenas tardes! …" (los dos saludos juntos). */
function wabot_comercial_sin_saludo_inicial($m) {
    $limpio = preg_replace('/^\s*[¡!]?\s*((buenas( tardes| noches)?|buen d[ií]a|buenos d[ií]as|hola+)\b[^\p{L}]*){1,2}/iu', '', (string)$m, 1);
    $limpio = trim((string)$limpio);
    return $limpio === '' ? trim((string)$m) : mb_strtoupper(mb_substr($limpio, 0, 1)) . mb_substr($limpio, 1);
}

/** La propuesta fija de una solución, si la del modelo no sirvió. */
function wabot_comercial_propuesta_fija($solucion, $cfg) {
    return trim((string)($cfg['comercial']['propuesta_fija'][$solucion] ?? ''));
}

/** Las respuestas oficiales pedidas, resueltas para esta charla. Antes del precio, ninguna que traiga un monto. */
function wabot_comercial_info_textos(array $claves, $conv, $cfg, $sinMontos, $texto = '', $hayOtro = false) {
    $out = [];
    $tipo = (string)($conv['tipo'] ?? '');
    $extra = wabot_comercial_info_extra($cfg);
    foreach ($claves as $k) {
        $una = isset($extra[$k]) ? (string)$extra[$k] : wabot_info_lineas([$k], $conv, $cfg);
        if ($una === '') continue;
        /* Hasta 30 productos los cargamos todos nosotros (Pablo, 1-nov): si ya
         * dijo cuántos son, la respuesta con su cantidad. */
        $cant = (int)(wabot_ficha($conv)['cantidad_productos'] ?? 0);
        if ($k === 'carga_nosotros' && $cant > 0 && $cant <= 30 && trim((string)($cfg['info']['carga_pocos'] ?? '')) !== '') {
            $una = str_replace('{cantidad}', (string)$cant, (string)$cfg['info']['carga_pocos']);
        }
        /* "Te pasamos el valor y, si te interesa…" con el valor ya pasado (22-oct,
         * Maxi: "Cómo se comenzaría?"): la misma respuesta, desde el diseño. */
        if ($k === 'proceso' && empty($conv['_cotiza_este_turno']) && wabot_comercial_cotizacion($conv, $cfg) !== null) {
            $alt = trim((string)($cfg['info']['proceso_cotizado'] ?? ''));
            if ($alt === '') {
                $alt = trim((string)preg_replace('/^Te pasamos el valor y,?\s*/u', '', $una));
                $alt = mb_strtoupper(mb_substr($alt, 0, 1)) . mb_substr($alt, 1);
            }
            if ($alt !== '') $una = $alt;
        }
        $una = wabot_precio_placeholders($una, $conv, $cfg, $tipo !== '' ? $tipo : null);
        if ($sinMontos && strpos($una, '$') !== false) continue;
        $out[] = $una;
    }
    /* Una respuesta oficial que ya le mandamos hace poco no se repite tal cual
     * (26-oct, Tomás: el texto del pago único dos veces en tres minutos), salvo
     * que pida que se la repitamos o que sea lo único que hay para decirle. */
    if ($out && !wabot_comercial_pide_repetir($texto)) {
        $recientes = wabot_comercial_textos_recientes($conv, 12);
        $nuevas = array_values(array_filter($out, function ($t) use ($recientes) {
            return !in_array(wabot_normalizar_frase($t), $recientes, true);
        }));
        if ($nuevas || $hayOtro) $out = $nuevas;
    }
    return $out;
}

/**
 * Construye lo que vería el cliente a partir de la decisión ya validada, sobre
 * una COPIA de la charla (nada se guarda ni se manda acá). Devuelve:
 *   mensajes — [['t' => texto, 'efecto' => texto|info|propuesta|planes|oferta|formulario]]
 *   conv     — la copia con los efectos aplicados (para el modo automático)
 *   resumen  — accion, solucion, intencion, motivo, pago_unico, cotizacion, ficha, texto
 */
function wabot_comercial_construir($d, $texto, $conv, $cfg) {
    $c = $conv;
    $sol = $d['solucion'];
    $cot = wabot_comercial_cotizacion($c, $cfg);
    $resumen = ['accion' => $d['accion'], 'solucion' => $sol, 'intencion' => $d['intencion'], 'motivo' => $d['motivo'],
                'pago_unico' => $d['pago_unico'], 'internacional' => !empty($d['internacional']), 'cotizacion' => null, 'ficha' => $d['ficha'], 'texto' => (string)$texto, 'info_claves' => $d['info_claves']];
    $msgs = [];
    $tipoFuturo = wabot_comercial_soluciones()[$sol]['tipo'] ?? null;

    switch ($d['accion']) {
        case 'humano':
        case 'esperar':
            break;

        case 'responder':
            // Después de la demo (1-nov): los bloques fijos de Pablo alrededor de las respuestas.
            if (wabot_comercial_estado($c) === 'postdemo') {
                $msgs = wabot_comercial_construir_postdemo($d, $texto, $c, $cfg, $resumen);
                break;
            }
            $sinMontos = $cot === null;
            $propios = array_values(array_filter($d['mensajes'], function ($m) { return !wabot_comercial_es_solo_saludo($m); }));
            foreach (wabot_comercial_info_textos($d['info_claves'], $c, $cfg, $sinMontos, $texto, (bool)$propios) as $t) $msgs[] = ['t' => $t, 'efecto' => 'info'];
            // Un mensaje que es solo un saludo sobra: el saludo se devuelve al principio del primero (abajo).
            foreach ($propios as $m) $msgs[] = ['t' => $m, 'efecto' => 'texto'];
            // Contestadas las dudas y la demo sigue sin aceptarse: se la volvemos a ofrecer una vez (26-oct).
            if (wabot_comercial_reoferta_corresponde($d, $texto, $c, $cfg, $msgs)) {
                $msgs[] = ['t' => wabot_comercial_texto_confirmar_demo($cfg), 'efecto' => 'reoferta'];
            }
            break;

        case 'cotizar':
            /* Preguntó el precio sin decir si quiere reservas: los dos precios
             * (Pablo, 9-oct). Se congela el de sin reservas; la oferta de la demo
             * sale cuando elige. */
            if (!empty($d['dos_planes']) && !$cot) {
                $info = wabot_comercial_montos_lista('informativa', $cfg);
                $panel = wabot_comercial_montos_lista('panel', $cfg);
                $nueva = wabot_comercial_cotizacion_nueva('informativa', $cfg);
                $planes = wabot_comercial_planes_texto('informativa', $nueva, $cfg);
                $con = trim((string)($cfg['comercial']['con_reservas'] ?? ''));
                $cotPanel = wabot_comercial_cotizacion_nueva('panel', $cfg);
                if ($planes !== '' && $con !== '' && wabot_comercial_cotizacion_valida($cotPanel)) {
                    $resumen['cotizacion'] = $nueva;
                    $intro = trim((string)($cfg['comercial']['dos_planes_intro'] ?? ''));
                    if ($intro !== '') $msgs[] = ['t' => $intro, 'efecto' => 'texto'];
                    $sin = trim((string)($cfg['comercial']['sin_reservas'] ?? ''));
                    if ($sin !== '' && preg_match('/^(Podés elegir|Tenemos (distintas|dos))/u', $planes)) $planes = wabot_comercial_pegar_confirmacion($sin, $planes);
                    $msgs[] = ['t' => $planes, 'efecto' => 'planes'];
                    $msgs[] = ['t' => strtr($con, ['{unico}' => $cotPanel['unico'], '{anual}' => $cotPanel['anual'], '{mensual}' => $cotPanel['mensual'], '{inicial}' => (string)($cotPanel['inicial'] ?? '')]), 'efecto' => 'alternativa'];
                    break;
                }
            }
            /* Dos webs distintas (Pablo, 10-oct): las dos juntas con el descuento. Si la
             * primera todavía no estaba cotizada, se congela su plan (panel, boceto,
             * respuestas rápidas) sin mandar su bloque: el precio que ve es el de las dos. */
            if ($dos = wabot_comercial_dos_webs_armar($d, $sol, $c, $cfg)) {
                if ($cot) {
                    $resumen['cotizacion'] = $cot;
                } else {
                    $plan1 = wabot_comercial_soluciones()[$sol]['plan'];
                    $lista1 = wabot_comercial_montos_lista($plan1, $cfg);
                    $resumen['cotizacion'] = wabot_comercial_cotizacion_nueva($plan1, $cfg);
                    $resumen['congelar_sin_planes'] = true;
                }
                $resumen['dos_webs'] = $dos['resumen'];
                $propuesta = trim((string)preg_replace('/[\s,]*(pod[eé]s|podr[ií]as) elegir entre (los |estos )?dos planes\s*:?\s*$/iu', '', trim((string)($d['mensajes'][0] ?? ''))));
                if ($propuesta !== '' && !wabot_comercial_es_solo_saludo($propuesta) && wabot_comercial_mensaje_problema($propuesta) === null) {
                    $msgs[] = ['t' => $propuesta, 'efecto' => $cot ? 'texto' : 'propuesta'];
                }
                $msgs[] = ['t' => $dos['texto'], 'efecto' => 'dos_webs'];
                if (!wabot_comercial_oferta_hecha($c, $cfg)) {
                    $oferta = trim((string)($cfg['comercial']['oferta_demo'] ?? ''));
                    if ($oferta !== '') $msgs[] = ['t' => $oferta, 'efecto' => 'oferta'];
                }
                break;
            }
            $plan = wabot_comercial_soluciones()[$sol]['plan'];
            /* Cobros a clientes del exterior: plan internacional (9-oct, noche). Desde el 26-oct
             * no se cotiza de cero (pasa a Pablo, arriba): solo se repite el que ya se le dio. */
            if ($d['internacional'] && $cot && ($cot['plan'] ?? '') === 'internacional') $plan = 'internacional';
            if ($cot && $cot['plan'] === $plan && !wabot_comercial_pide_precio_otra_vez($texto)) {
                /* Ya cotizado con el mismo plan y no pidió el precio de nuevo (aclaró
                 * la solución: "solo quiero mostrarlos"): los planes no se repiten,
                 * sale solo lo que escribió el modelo. */
                $resumen['cotizacion'] = $cot;
                $resumen['accion'] = 'responder';
                $confirma = '';
                foreach ($d['mensajes'] as $m) {
                    if (wabot_comercial_es_solo_saludo($m) || wabot_comercial_mensaje_problema($m) !== null) continue;
                    // Un "Perfecto, entonces" solo (eligió entre los dos precios) va pegado a la oferta.
                    if (count($d['mensajes']) === 1 && wabot_comercial_es_confirmacion_corta($m)) { $confirma = $m; continue; }
                    $msgs[] = ['t' => $m, 'efecto' => 'texto'];
                }
                // Con el precio ya dado y sin la oferta de la demo todavía, sale la oferta.
                if (!wabot_comercial_oferta_hecha($c, $cfg)) {
                    $oferta = trim((string)($cfg['comercial']['oferta_demo'] ?? ''));
                    if ($oferta !== '') {
                        $msgs[] = ['t' => $confirma !== '' ? wabot_comercial_pegar_confirmacion($confirma, $oferta) : $oferta, 'efecto' => 'oferta'];
                        $resumen['accion'] = 'cotizar';
                        $confirma = '';
                    }
                }
                if ($confirma !== '') $msgs[] = ['t' => $confirma, 'efecto' => 'texto'];
                break;
            }
            /* Eligió "con reservas" después de los dos precios: esos montos ya los vio
             * ("Con reservas quedaría en…"). Pablo, 10-oct: "dio dos veces el precio".
             * Se congela el plan con panel sin repetir el bloque y sale la oferta,
             * igual que cuando elige sin reservas. */
            if ($cot && $plan === 'panel' && ($cot['plan'] ?? '') === 'informativa' && !empty($c['comercial_dos_planes_ts'])
                && !wabot_comercial_oferta_hecha($c, $cfg) && !wabot_comercial_pide_precio_otra_vez($texto)) {
                $panel = wabot_comercial_montos_lista('panel', $cfg);
                $cotPanel = wabot_comercial_cotizacion_nueva('panel', $cfg);
                if (wabot_comercial_cotizacion_valida($cotPanel)) {
                    $resumen['cotizacion'] = $cotPanel;
                    $resumen['congelar_sin_planes'] = true;
                    $confirma = '';
                    foreach ($d['mensajes'] as $m) {
                        if (wabot_comercial_es_solo_saludo($m) || wabot_comercial_mensaje_problema($m) !== null) continue;
                        if (count($d['mensajes']) === 1 && wabot_comercial_es_confirmacion_corta($m)) { $confirma = $m; continue; }
                        $m = trim((string)preg_replace('/[\s,]*(pod[eé]s|podr[ií]as) elegir entre (los |estos )?dos planes\s*:?\s*$/iu', '', $m));
                        if ($m !== '') $msgs[] = ['t' => $m, 'efecto' => 'texto'];
                    }
                    $oferta = trim((string)($cfg['comercial']['oferta_demo'] ?? ''));
                    if ($oferta !== '') $msgs[] = ['t' => $confirma !== '' ? wabot_comercial_pegar_confirmacion($confirma, $oferta) : $oferta, 'efecto' => 'oferta'];
                    break;
                }
            }
            if ($cot && $cot['plan'] === $plan) {
                // Ya cotizado: se repiten los mismos planes (los montos de antes), sin propuesta ni oferta de nuevo.
                $resumen['cotizacion'] = $cot;
                $planes = wabot_comercial_planes_texto($sol, $cot, $cfg, $d['pago_unico'] || !empty($c['quiere_web_propia']));
                if ($planes !== '') $msgs[] = ['t' => $planes, 'efecto' => 'planes'];
                if (!wabot_comercial_oferta_hecha($c, $cfg)) {
                    $oferta = trim((string)($cfg['comercial']['oferta_demo'] ?? ''));
                    if ($oferta !== '') $msgs[] = ['t' => $oferta, 'efecto' => 'oferta'];
                }
                break;
            }
            $lista = wabot_comercial_montos_lista($plan, $cfg);
            $nueva = wabot_comercial_cotizacion_nueva($plan, $cfg);
            $resumen['cotizacion'] = $nueva;
            $propuesta = trim((string)($d['mensajes'][0] ?? ''));
            // El saludo lo devuelve el sistema al principio del primer mensaje: si la propuesta no va primera, sin su propio saludo.
            if ($msgs) $propuesta = wabot_comercial_sin_saludo_inicial($propuesta);
            // "Perfecto, entonces podés elegir entre dos planes:" escrito por el modelo: el "podés elegir…" ya lo trae el bloque (simulación 32).
            $propuesta = trim((string)preg_replace('/[\s,]*(pod[eé]s|podr[ií]as) elegir entre (los |estos )?dos planes\s*:?\s*$/iu', '', $propuesta));
            if ($propuesta === '' || wabot_comercial_mensaje_problema($propuesta) !== null) $propuesta = wabot_comercial_propuesta_fija($sol, $cfg);
            $planes = wabot_comercial_planes_texto($sol, $nueva, $cfg, $d['pago_unico'] || !empty($c['quiere_web_propia']));
            /* La web ya se la describimos (al preguntarle por los turnos) y la
             * propuesta es "Perfecto, entonces": va pegada a los planes, como
             * Pablo ("Perfecto, entonces podés elegir entre dos planes:"). Al pasar
             * de la informativa a reservas, "En ese caso" (Pablo, 19-oct). */
            if ($propuesta !== '' && $planes !== '' && (wabot_comercial_es_confirmacion_corta($propuesta)
                    || ($cot && preg_match('/^en ese caso$/u', wabot_normalizar_frase($propuesta))))) {
                $planes = wabot_comercial_pegar_confirmacion($propuesta, $planes);
            } elseif ($propuesta !== '') {
                $msgs[] = ['t' => $propuesta, 'efecto' => 'propuesta'];
            }
            if ($planes !== '') $msgs[] = ['t' => $planes, 'efecto' => 'planes'];
            /* Cambió de solución con la demo ya ofrecida (de la informativa a
             * reservas, 19-oct): los planes nuevos sin volver a ofrecerla, como
             * Pablo; el revisor lo frenaba por repetido y la charla se callaba. */
            $oferta = trim((string)($cfg['comercial']['oferta_demo'] ?? ''));
            if ($oferta !== '' && $planes !== '' && !($cot && wabot_comercial_oferta_hecha($c, $cfg))) $msgs[] = ['t' => $oferta, 'efecto' => 'oferta'];
            break;

        case 'formulario':
            // Eligió un plan ("Hoy debería ser plan mensual"): se le confirma y va el formulario (26-oct).
            if (!empty($d['plan_elegido'])) {
                $ack = trim((string)($cfg['comercial']['plan_elegido'] ?? ''));
                $nombre = ['mensual' => 'plan mensual', 'unico' => 'plan anual', 'propia' => 'pago único', 'inicial' => 'plan'][$d['plan_elegido']] ?? '';
                if ($ack !== '' && $nombre !== '') $msgs[] = ['t' => strtr($ack, ['{plan}' => $nombre]), 'efecto' => 'texto'];
                $resumen['plan_elegido'] = $d['plan_elegido'];
            }
            foreach (wabot_comercial_info_textos($d['info_claves'], $c, $cfg, $cot === null, $texto, true) as $t) $msgs[] = ['t' => $t, 'efecto' => 'info'];
            foreach ($d['mensajes'] as $m) $msgs[] = ['t' => $m, 'efecto' => 'texto'];
            // Acepta la demo y pide otra web en el mismo mensaje (Pablo, 10-oct): el precio de las dos y el formulario.
            if ($dos = wabot_comercial_dos_webs_armar($d, $sol, $c, $cfg)) {
                $resumen['dos_webs'] = $dos['resumen'];
                $msgs[] = ['t' => $dos['texto'], 'efecto' => 'dos_webs'];
            }
            $copiaLink = $c;
            if ($tipoFuturo !== null && $tipoFuturo !== 'sistema' && empty($copiaLink['tipo'])) $copiaLink['tipo'] = $tipoFuturo;
            $form = wabot_oferta_diseno_form_texto($copiaLink, $cfg);
            if (!empty($copiaLink['codigo'])) $c['codigo'] = $copiaLink['codigo'];
            if ($form !== '') {
                $msgs[] = ['t' => $form, 'efecto' => 'formulario'];
            } else {
                // Sin formulario (apagado o ya completado): lo que había para decir sale igual y el resto lo ve Pablo.
                $resumen['accion'] = $msgs ? 'responder' : 'humano';
                if (!$msgs) $resumen['motivo'] = 'Aceptó la demo pero no hay formulario para mandarle';
            }
            break;
    }

    // Las dudas acompañan TODAS las variantes: precio nuevo, repetido, cambio de plan y dos webs.
    // Se resuelven con la cotización de este turno, sin cambiar todavía la charla real.
    if ($d['accion'] === 'cotizar') {
        $paraInfo = $c;
        $cotInfo = $resumen['cotizacion'] ?? $cot;
        if ($tipoFuturo !== null && $tipoFuturo !== 'sistema') $paraInfo['tipo'] = $tipoFuturo;
        if (is_array($cotInfo)) {
            $paraInfo['precio_dado'] = true;
            $paraInfo['comercial_cotizacion'] = $cotInfo;
            $paraInfo['precio_cotizado'] = wabot_comercial_cotizacion_primer_pago($cotInfo);
            $paraInfo['inicial_cotizado'] = (string)($cotInfo['inicial'] ?? '');
            $paraInfo['mensualidad_cotizada'] = $cotInfo['mensual'];
            $paraInfo['precio_unico_cotizado'] = $cotInfo['unico'] ?? '';
            $paraInfo['sena_cotizada'] = wabot_comercial_montos_lista($cotInfo['plan'], $cfg)['sena'];
            $paraInfo['landing_con_panel'] = $tipoFuturo === 'landing' && $cotInfo['plan'] !== 'informativa';
        }
        if ($d['pago_unico']) $paraInfo['quiere_web_propia'] = true;
        // El valor sale en este mismo turno: "Te pasamos el valor y…" sigue valiendo.
        if ($cot === null) $paraInfo['_cotiza_este_turno'] = true;
        $claves = array_values(array_diff($d['info_claves'], ['precio_sin_rubro']));
        /* "Qué trae el paquete?" con los planes en este mismo turno (Mary, 1-nov):
         * el bloque de planes ya dice qué incluye, y la respuesta oficial salía
         * antes, hablando del "plan mensual" sin haberlo presentado. */
        if (array_filter($msgs, function ($m) { return $m['efecto'] === 'planes'; })) {
            $claves = array_values(array_diff($claves, ['que_incluye', 'que_incluye_sin_productos', 'que_incluye_sitio']));
        }
        $infos = [];
        foreach (wabot_comercial_info_textos($claves, $paraInfo, $cfg, $cotInfo === null, $texto, true) as $t) {
            $infos[] = ['t' => $t, 'efecto' => 'info'];
        }
        if ($infos) {
            foreach ($msgs as &$m) if ($m['efecto'] === 'propuesta') $m['t'] = wabot_comercial_sin_saludo_inicial($m['t']);
            unset($m);
            $msgs = array_merge($infos, $msgs);
        }
    }

    // Con la demo entregada (1-nov) no se la vuelve a ofrecer ni se manda el formulario, salga por donde salga.
    if (wabot_comercial_estado($c) === 'postdemo') {
        $msgs = array_values(array_filter($msgs, function ($m) { return !in_array($m['efecto'], ['oferta', 'reoferta', 'formulario'], true); }));
    }

    /* Todas las dudas se contestan (10-oct), pero cuatro o más respuestas oficiales
     * salen juntas en un solo mensaje (22-oct, Maxi: "esos puntos de los planes
     * a qué hacen referencia" recibió cinco mensajes uno atrás del otro). Lo
     * mismo si el turno entero pasaría de tres mensajes con dos o más oficiales
     * (26-oct, Tomás: tres oficiales y dos del modelo, cinco seguidos). Y tres
     * oficiales en un turno de cinco mensajes o más, contando propuesta, precio
     * y oferta (1-nov, Eliana: al cotizar salían seis mensajes seguidos). Con
     * dos también (Mary, 1-nov: envíos y qué incluye + propuesta, precio y
     * oferta, cinco seguidos). */
    $infos = count(array_filter($msgs, function ($m) { return $m['efecto'] === 'info'; }));
    $propios = count(array_filter($msgs, function ($m) { return $m['efecto'] === 'texto'; }));
    if ($infos > 3 || ($infos >= 2 && $infos + $propios >= 4) || ($infos >= 2 && count($msgs) >= 5)) {
        $juntos = [];
        foreach ($msgs as $m) {
            $i = count($juntos) - 1;
            if ($m['efecto'] === 'info' && $i >= 0 && $juntos[$i]['efecto'] === 'info') $juntos[$i]['t'] .= "\n\n" . $m['t'];
            else $juntos[] = $m;
        }
        $msgs = $juntos;
    }

    /* Ya lo saludamos en la charla y el modelo vuelve a arrancar con "Hola, buenas
     * tardes!": ese saludo sobra (26-oct: el revisor lo marcaba "repite" y hacía
     * corregir, una llamada de más cada vez). */
    if (!empty($c['saludo_devuelto'])) {
        foreach ($msgs as $i => $m) {
            if (!in_array($m['efecto'], ['texto', 'propuesta'], true)) continue;
            $sin = wabot_comercial_sin_saludo_inicial($m['t']);
            if ($sin !== trim((string)$m['t'])) $msgs[$i]['t'] = $sin;
            break;
        }
    }
    // El saludo se devuelve una vez por charla, al principio del primer mensaje nuestro; nunca pegado a un bloque aprobado (planes, oferta, formulario).
    if ($msgs && in_array($msgs[0]['efecto'], ['texto', 'info', 'propuesta'], true) && function_exists('wabot_saludo_devolver')) {
        $textos = array_map(function ($m) { return $m['t']; }, $msgs);
        $textos = wabot_saludo_devolver($texto, $textos, $c);
        foreach ($textos as $i => $t) $msgs[$i]['t'] = $t;
    }
    wabot_comercial_efectos_aplicar($c, $msgs, $resumen, $cfg);
    return ['mensajes' => array_values($msgs), 'conv' => $c, 'resumen' => $resumen, 'accion' => $resumen['accion'],
            'solucion' => $sol, 'motivo' => $resumen['motivo'], 'intencion' => $d['intencion']];
}

/**
 * Los efectos de un turno sobre la charla, a partir de los mensajes que de
 * verdad salen: la ficha, la solución, el precio congelado (si salieron los
 * planes), la oferta abierta (si salió la oferta), el formulario mandado (si
 * salió el link) y las pausas (humano, rechazo). Lo llama construir() sobre la
 * copia y sugerencias.php sobre la charla real cuando Pablo manda.
 */
function wabot_comercial_efectos_aplicar(&$conv, array $mensajes, array $resumen, $cfg) {
    $ahora = time();
    $texto = (string)($resumen['texto'] ?? '');
    $f = is_array($resumen['ficha'] ?? null) ? $resumen['ficha'] : [];
    wabot_ficha_actualizar($conv, $texto, ['ficha' => array_filter([
        'rubro' => $f['rubro'] ?? null, 'que_vende' => $f['que_vende'] ?? null, 'objetivo' => $f['objetivo'] ?? null, 'necesidad' => $f['necesidad'] ?? null,
    ], function ($v) { return $v !== null; })]);
    $ficha = wabot_ficha($conv);
    if (!empty($f['funciones'])) $ficha['pedidos_ia'] = array_values(array_unique(array_merge((array)($ficha['pedidos_ia'] ?? []), (array)$f['funciones'])));
    if (($f['observaciones'] ?? null) !== null) $ficha['observaciones_ia'] = $f['observaciones'];
    $conv['ficha'] = $ficha;
    if (($f['nombre'] ?? null) !== null && empty($conv['nombre_confirmado']) && function_exists('wabot_nombre_usable') && wabot_nombre_usable($f['nombre']) !== ''
        && mb_stripos(wabot_contexto_cliente_texto($conv) . ' ' . $texto, (string)$f['nombre']) !== false) {
        $conv['nombre'] = wabot_nombre_usable($f['nombre']);
        $conv['nombre_confirmado'] = true;
    }
    if (($f['negocio'] ?? null) !== null && trim((string)($conv['nombre_negocio'] ?? '')) === '' && function_exists('wabot_nombre_negocio_limpiar')) {
        $n = wabot_nombre_negocio_limpiar($f['negocio']);
        if ($n !== '' && mb_stripos(wabot_contexto_cliente_texto($conv) . ' ' . $texto, $n) !== false) $conv['nombre_negocio'] = $n;
    }
    if (!empty($resumen['pago_unico'])) $conv['quiere_web_propia'] = true;
    if (!empty($resumen['internacional'])) $conv['comercial_internacional'] = true;
    // El plan que eligió queda anotado como siempre (panel, ficha, boceto).
    if (!empty($resumen['plan_elegido']) && in_array($resumen['plan_elegido'], ['mensual', 'unico', 'propia', 'inicial'], true)) {
        $conv['modalidad_elegida'] = (string)$resumen['plan_elegido'];
        if ($resumen['plan_elegido'] === 'propia') $conv['quiere_web_propia'] = true;
        if (function_exists('wabot_modalidad_sincronizar')) wabot_modalidad_sincronizar($conv);
    }
    if (in_array('muchos_productos', (array)($resumen['info_claves'] ?? []), true)) {
        foreach ($mensajes as $m) if (($m['efecto'] ?? '') === 'info') { $conv['comercial_muchos_avisado'] = true; break; }
    }
    // La etapa post-demo (1-nov): el modelo que eligió y los cambios que pidió.
    if (in_array((string)($resumen['modelo_elegido'] ?? ''), ['1', '2'], true)) {
        $conv['modelo_elegido'] = (string)$resumen['modelo_elegido'];
        wabot_evento_sesion($conv, 'postdemo_modelo_elegido', ['modelo' => $conv['modelo_elegido']]);
    }
    if (!empty($resumen['cambios']) && function_exists('wabot_cambios_anotar')) wabot_cambios_anotar($conv, $texto, 'postdemo');
    // El modelo vio que avisó que pagó: la columna Pago del panel y el fin de la etapa post-demo (lo verifica Pablo).
    if (!empty($resumen['pago_avisado'])) {
        $conv['pago_avisado_ts'] = $ahora;
        wabot_evento_sesion($conv, 'pago_avisado');
    }
    $sol = (string)($resumen['solucion'] ?? 'sin_definir');
    if (wabot_comercial_solucion_estandar($sol)) $conv['comercial_solucion'] = $sol;
    if (array_key_exists('pendientes', $resumen)) $conv['comercial_pendientes'] = (array)$resumen['pendientes'];
    $conv['comercial_ultimo'] = ['ts' => $ahora, 'accion' => (string)($resumen['accion'] ?? ''), 'motivo' => (string)($resumen['motivo'] ?? '')];
    if (($conv['fase'] ?? 'nuevo') === 'nuevo') $conv['fase'] = 'menu';

    /* Congela el precio que vio el cliente: con el bloque de planes o, si eligió
     * "con reservas" después de los dos precios, sin repetirlo (congelar_sin_planes). */
    $congelar = function (array $cot) use (&$conv, $sol, $cfg, $ahora) {
        if (!wabot_comercial_cotizacion_valida($cot)) return;
        // Ya congelada con los mismos montos (no cuenta lo leído de la charla: puede ser este mismo mensaje recién anotado).
        $previa = is_array($conv['comercial_cotizacion'] ?? null) ? $conv['comercial_cotizacion'] : null;
        if ($previa && ($previa['plan'] ?? '') === ($cot['plan'] ?? '') && ($previa['mensual'] ?? '') === $cot['mensual']
            && ($previa['anual'] ?? '') === ($cot['anual'] ?? '') && ($previa['inicial'] ?? '') === ($cot['inicial'] ?? '') && ($previa['modelo'] ?? '') === ($cot['modelo'] ?? '')) return;
        $cot['origen'] = (string)($cot['origen'] ?? 'bot');
        $cot['ts'] = $ahora;
        $cot['plan'] = (string)($cot['plan'] ?? 'panel');
        $conv['comercial_cotizacion'] = $cot;
        // Los campos de siempre, para el panel, las respuestas rápidas y el boceto.
        $tipo = wabot_comercial_soluciones()[$sol]['tipo'] ?? wabot_comercial_plan_tipo($cot['plan']);
        if ($tipo === null || $tipo === 'sistema') $tipo = wabot_comercial_plan_tipo($cot['plan']);
        $lista = wabot_comercial_montos_lista($cot['plan'], $cfg);
        $conv['tipo'] = $tipo;
        // Una informativa cotizada con el plan con panel (reservas, informativa con panel) sí tiene panel (9-oct).
        $conv['landing_con_panel'] = $tipo === 'landing' && $cot['plan'] !== 'informativa';
        $conv['precio_cotizado'] = wabot_comercial_cotizacion_primer_pago($cot);
        $conv['mensualidad_cotizada'] = $cot['mensual'];
        $conv['precio_unico_cotizado'] = (string)($cot['unico'] ?? $lista['unico']);
        $conv['sena_cotizada'] = $lista['sena'];
        $conv['precio_modelo'] = 'anual';
        /* Prueba de precios (31-oct): el grupo y el modelo quedan anotados para el
         * panel, el formulario y la medición. En B no hay seña: el pago inicial.
         * A2 (2-nov) sigue con el modelo 'anual' de siempre. */
        $modelo = (string)($cot['modelo'] ?? '');
        if ($modelo !== '') {
            $conv['ab_grupo'] = $modelo;
            if ($modelo !== 'a2') $conv['precio_modelo'] = $modelo === 'b' ? 'inicial' : 'unico_mensual';
            $conv['inicial_cotizado'] = (string)($cot['inicial'] ?? '');
            if ($modelo === 'b') $conv['sena_cotizada'] = (string)($cot['inicial'] ?? '');
            if (empty($conv['ab_grupo_ts'])) $conv['ab_grupo_ts'] = $ahora;
        }
        $conv['precio_cotizado_ts'] = $ahora;
        $conv['precio_dado'] = true;
        $conv['precio_turnos_desde'] = 0;
        $conv['precio_cta_pendiente'] = false;
        $conv['reconocimiento_hecho'] = true;
        if (empty($conv['comercial_oferta_ts'])) $conv['fase'] = 'precio';
        wabot_evento_sesion($conv, 'precio_dado', ['tipo' => $tipo]);
        wabot_evento_sesion($conv, 'comercial_cotizado', ['solucion' => $sol]);
    };
    if (!empty($resumen['congelar_sin_planes']) && is_array($resumen['cotizacion'] ?? null)) $congelar($resumen['cotizacion']);

    foreach ($mensajes as $m) {
        $efecto = (string)($m['efecto'] ?? 'texto');
        $t = (string)($m['t'] ?? '');
        // Si le preguntamos a qué se dedica, queda anotado: no se le pregunta dos veces.
        if (($efecto === 'texto' || $efecto === 'info') && empty($conv['rubro_preguntado']) && !wabot_comercial_negocio_conocido($conv)
            && function_exists('wabot_ia_pregunta_negocio') && wabot_ia_pregunta_negocio($t)) {
            $conv['rubro_preguntado'] = true;
        }
        if ($efecto === 'planes') {
            $cot = is_array($resumen['cotizacion'] ?? null) ? $resumen['cotizacion'] : null;
            // Lo que de verdad vio el cliente manda: si el texto trae otros montos (Pablo lo editó), valen esos.
            $visto = wabot_comercial_montos_de_texto($t);
            if ($cot === null) $cot = ['plan' => wabot_comercial_soluciones()[$sol]['plan'] ?? 'panel'];
            foreach (['anual', 'mensual', 'unico', 'inicial'] as $k) if ($visto[$k] !== '') $cot[$k] = $visto[$k];
            $congelar($cot);
        } elseif ($efecto === 'alternativa') {
            // Le pasamos los dos precios (sin reservas / con reservas): falta que elija.
            $conv['comercial_dos_planes_ts'] = $ahora;
        } elseif ($efecto === 'dos_webs' && is_array($resumen['dos_webs'] ?? null)) {
            // El precio de las dos webs juntas (10-oct): lo ven el modelo, el panel y la revisión.
            $conv['comercial_dos_webs'] = $resumen['dos_webs'];
            $conv['precio_dado'] = true;
            wabot_evento_sesion($conv, 'comercial_dos_webs', ['soluciones' => implode('+', (array)$resumen['dos_webs']['soluciones'])]);
        } elseif ($efecto === 'oferta') {
            $conv['comercial_oferta_ts'] = $ahora;
            $conv['fase'] = 'prediseno';
            $conv['cta_muestra'] = true;
            wabot_evento_sesion($conv, 'comercial_demo_ofrecida');
        } elseif ($efecto === 'reoferta') {
            // Se la volvimos a ofrecer después de las dudas: una sola vez por charla.
            $conv['comercial_reoferta_ts'] = $ahora;
        } elseif ($efecto === 'pregunta_modelo') {
            // Le preguntamos cuál de los dos modelos prefiere (1-nov): una vez por charla.
            $conv['postdemo_pregunto_modelo_ts'] = $ahora;
        } elseif ($efecto === 'pregunta_modalidad') {
            // Le preguntamos la modalidad antes del link de pago (2-nov): una vez por charla.
            $conv['postdemo_pregunto_modalidad_ts'] = $ahora;
        } elseif ($efecto === 'pago') {
            // Le mandamos el link de pago (1-nov): el panel y el modelo lo saben.
            $conv['postdemo_link_pago_ts'] = $ahora;
            $conv['postdemo_link_pago'] = (string)($resumen['link_pago'] ?? '');
            wabot_evento_sesion($conv, 'postdemo_link_pago', ['modalidad' => $conv['postdemo_link_pago']]);
        } elseif ($efecto === 'transferencia') {
            $conv['postdemo_transferencia_ts'] = $ahora;
        } elseif ($efecto === 'formulario') {
            // El link del formulario o, desde el 9-nov, el pedido de los datos por el chat (datos-demo.php).
            $pideDatos = function_exists('wabot_texto_pide_datos_demo') && wabot_texto_pide_datos_demo($t, $cfg);
            if (!wabot_texto_tiene_link_form($t) && !$pideDatos) continue;
            if ($pideDatos && empty($conv['datos_pedidos_ts'])) $conv['datos_pedidos_ts'] = $ahora;
            $conv['link_form_enviado'] = true;
            $conv['esProspecto'] = true;
            $conv['precio_cta_pendiente'] = false;
            $conv['comercial_pausa'] = 'formulario';
            $conv['comercial_pausa_ts'] = $ahora;
            $conv['handoff_pendiente'] = false;
            if (($conv['fase'] ?? '') !== 'prediseno') $conv['fase'] = 'prediseno';
            wabot_evento_sesion($conv, 'comercial_form_enviado');
        }
    }

    $accion = (string)($resumen['accion'] ?? '');
    if ($accion === 'humano') {
        $conv['comercial_pausa'] = 'humano';
        $conv['comercial_pausa_ts'] = $ahora;
        // Desde qué renglón del chat vale la pausa: un mensaje del cliente posterior la levanta (1-nov).
        $conv['comercial_pausa_n'] = count((array)($conv['transcript'] ?? []));
        $clienteTs = 0;
        foreach ((array)($conv['transcript'] ?? []) as $fila) {
            if (is_array($fila) && ($fila['q'] ?? '') === 'cliente') $clienteTs = max($clienteTs, (int)($fila['ts'] ?? 0));
        }
        $conv['comercial_pausa_cliente_ts'] = $clienteTs;
        $conv['comercial_motivo'] = (string)($resumen['motivo'] ?? 'Caso especial');
        $conv['handoff_pendiente'] = true;
        $conv['seguimiento_bloqueado'] = true;
        wabot_evento_sesion($conv, 'comercial_para_pablo', ['motivo' => $conv['comercial_motivo']]);
    } elseif ($accion === 'esperar' && ($resumen['intencion'] ?? '') === 'rechaza') {
        $conv['comercial_pausa'] = 'rechazo';
        $conv['comercial_pausa_ts'] = $ahora;
        $conv['cierre'] = 'rechazo';
        $conv['seguimiento_bloqueado'] = true;
        $conv['handoff_pendiente'] = false;
        wabot_evento_sesion($conv, 'comercial_rechazo');
    } elseif ($accion === 'esperar' && !$mensajes) {
        // Un acuse no deja nada pendiente; otra cosa sin respuesta, sí.
        $conv['handoff_pendiente'] = !(function_exists('wabot_es_acuse') && wabot_es_acuse($texto));
    } elseif ($mensajes) {
        $conv['handoff_pendiente'] = false;
    } else {
        // Había que contestar y no quedó nada para mandar: que lo vea Pablo.
        $conv['handoff_pendiente'] = true;
    }
    // Después de la demo (1-nov): se le contestó, pero algo quedó para Pablo (avisó que pagó; le gustó y no hay link de pago para sus montos).
    if (!empty($resumen['pago_avisado'])) $conv['handoff_pendiente'] = true;
    if (!empty($resumen['pendiente_pablo'])) {
        $conv['handoff_pendiente'] = true;
        $conv['comercial_ultimo']['motivo'] = (string)$resumen['pendiente_pablo'];
    }
}

/* ─────────────────────────────── El turno automático ─────────────────────────────── */

/** Qué etiqueta le ponemos a cada mensaje en el panel. */
function wabot_comercial_etiqueta($efecto) {
    return ['propuesta' => 'Propuesta', 'planes' => 'Planes', 'oferta' => 'Oferta de demo', 'reoferta' => 'Oferta de demo', 'formulario' => 'Formulario',
            'info' => 'Respuesta oficial', 'texto' => 'Mensaje', 'alternativa' => 'Planes con reservas', 'dos_webs' => 'Planes de las dos webs',
            // La etapa post-demo (1-nov).
            'modelo' => 'Modelo elegido', 'pregunta_modelo' => 'Pregunta del modelo', 'pregunta_modalidad' => 'Pregunta de la modalidad', 'pago' => 'Link de pago', 'transferencia' => 'Datos de transferencia',
            'pago_avisado' => 'Pago avisado'][(string)$efecto] ?? 'Mensaje';
}

/**
 * El turno en modo automático (flujo_comercial = auto), desde wabot_responder().
 * Mantiene los cortes que no dependen del modelo (proveedor, conocido/laboral/
 * cliente, bienvenida fija al primer mensaje que no cuenta el rubro) y nunca
 * improvisa: si el modelo no pudo, se calla y el chat le queda a Pablo.
 */
function wabot_comercial_turno($texto, &$conv, $cfg) {
    wabot_turno_preparar($conv, $cfg, time());
    $textoSolo = (string)$texto;
    $texto = wabot_comercial_tanda_pendiente((string)$texto, $conv);
    if (trim($texto) !== '') {
        wabot_ficha_actualizar($conv, $texto);
        if (function_exists('wabot_web_propia_anotar')) wabot_web_propia_anotar($conv, $texto, $cfg);
    }
    $conv['ultimo_ts'] = time();
    // Con la demo entregada, este mensaje es su respuesta (la columna del panel y el archivado dependen de la marca).
    if (!empty($conv['presentado_ts']) && function_exists('wabot_presentado_marcar_respuesta')) wabot_presentado_marcar_respuesta($conv);
    // Pagó: el turno es del onboarding (onboarding.php, 1-nov) hasta que junte lo que falta para la web.
    if (function_exists('wabot_onboarding_activo') && wabot_onboarding_activo($conv, $cfg)) {
        return wabot_onboarding_turno($conv, $texto, $cfg);
    }
    // La pausa por «humano» valía para la pregunta anterior; con este mensaje nuevo se levanta (1-nov).
    if ((string)($conv['comercial_pausa'] ?? '') === 'humano' && wabot_comercial_estado($conv) !== 'humano') {
        $conv['comercial_pausa'] = '';
        $conv['comercial_pausa_ts'] = 0;
        $conv['seguimiento_bloqueado'] = false;
        // Lo que se le pasó a Pablo sigue siendo de él: el modelo lo sabe por el contexto (wabot_comercial_contexto).
        $conv['comercial_derivado'] = ['motivo' => mb_substr((string)($conv['comercial_motivo'] ?? ''), 0, 200), 'ts' => time()];
        wabot_log('comercial_pausa_levantada', ['tel' => $conv['tel'] ?? '', 'motivo' => mb_substr((string)($conv['comercial_motivo'] ?? ''), 0, 120)]);
    }
    [$ok, $motivo] = wabot_comercial_elegible($conv, $cfg, 'auto');
    // Con el link del formulario mandado y sin completar, contesta lo simple (22-oct).
    $postForm = !$ok && wabot_comercial_post_form_permitido($conv, $cfg);
    if (!$ok && !$postForm) {
        // Lo que escriba con la charla pausada lo ve Pablo (salvo la que él ya tomó).
        if (empty($conv['control_manual'])) $conv['handoff_pendiente'] = true;
        return [];
    }
    // La etapa post-demo (1-nov): la demo ya se entregó y «Bot después de la demo» está prendido.
    $postdemo = $ok && wabot_comercial_estado($conv) === 'postdemo';
    /* Con los datos de la demo pedidos y sin ficha, lo que manda son los datos: «Nuestras redes
     * sociales… botón Contactanos» se cerraba como proveedor y «ya pagué el dominio» como cliente
     * existente, antes de llegar a leerlos (revisión del 10-nov). */
    $datosPendientes = function_exists('wabot_datos_demo_pendiente') && function_exists('wabot_datos_por_chat')
        && wabot_datos_por_chat($cfg) && wabot_datos_demo_pendiente($conv);
    if (trim($texto) !== '' && !$datosPendientes && wabot_texto_es_proveedor($texto)) {
        wabot_log('proveedor_ignorado', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr($texto, 0, 90)]);
        return wabot_cerrar_proveedor($conv);
    }
    /* "Ya pagué", "ya me suscribí", el comprobante: se le confirma que lo
     * revisamos y lo verifica Pablo, sin gastar un turno del modelo (y antes
     * de que "ya pagué" se lea como un cliente existente). */
    if ($postdemo && trim($texto) !== '' && wabot_comercial_postdemo_avisa_pago($texto)) {
        return wabot_comercial_postdemo_pago_avisado($conv, $cfg, $texto);
    }
    $contexto = (trim($texto) !== '' && !$datosPendientes) ? wabot_contexto_consulta($texto, $conv) : null;
    if ($contexto !== null) {
        $conv['contexto_consulta'] = $contexto;
        $conv['handoff_pendiente'] = true;
        $conv['seguimiento_bloqueado'] = true;
        wabot_evento_sesion($conv, 'contexto_no_venta', ['contexto' => $contexto]);
        return [wabot_texto_contexto_no_venta($contexto, $cfg)];
    }
    // La bienvenida fija al primer mensaje que no cuenta a qué se dedica (Instagram ya la pregunta sola).
    $hablamos = false;
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true)) { $hablamos = true; break; }
    }
    if (!$hablamos && empty($conv['bienvenida_ts']) && wabot_canal($conv) !== 'instagram') {
        $dice = trim($texto) === '' ? false : wabot_bienvenida_ya_dice_rubro($texto, $conv, $cfg);
        if ($dice !== true) {
            $conv['bienvenida_ts'] = time();
            $conv['fase'] = 'menu';
            wabot_evento_sesion($conv, 'bienvenida');
            return [trim((string)$cfg['bienvenida'])];
        }
    }
    /* El que vuelve días después con el texto del anuncio ("Hola. Puedo
     * obtener más información?") sin haber contado nunca a qué se dedica
     * recibe otra vez la bienvenida que se lo pregunta. Dejado al modelo,
     * contestaba con info.proceso ("Te pasamos el valor y…") y la charla
     * quedaba sin pregunta (Adriana, 3-nov 12:36). */
    if ($hablamos && wabot_canal($conv) !== 'instagram' && in_array(($conv['fase'] ?? 'nuevo'), ['nuevo', 'menu'], true)
        && empty($conv['precio_dado']) && trim((string)($conv['tipo'] ?? '')) === ''
        && trim($texto) !== '' && wabot_apertura_generica($texto)) {
        $ultimoBot = 0;
        foreach ((array)($conv['transcript'] ?? []) as $fila) {
            if (in_array(($fila['q'] ?? ''), ['bot', 'humano'], true)) $ultimoBot = max($ultimoBot, (int)($fila['ts'] ?? 0));
        }
        if ($ultimoBot > 0 && time() - $ultimoBot > 12 * 3600) {
            $conv['bienvenida_ts'] = time();
            $conv['fase'] = 'menu';
            wabot_evento_sesion($conv, 'bienvenida');
            return [trim((string)$cfg['bienvenida'])];
        }
    }
    /* Con los datos de la demo ya recibidos y la demo sin entregar (11-nov): una
     * foto, un archivo o un sticker sin texto es material para la demo (el logo
     * se suma solo a la ficha), no algo que Pablo tenga que contestar. */
    $fichaLista = $postForm && ((int)($conv['form_completado_ts'] ?? 0) > 0 || !empty($conv['lead_creado']));
    if (trim($textoSolo) === '' && $fichaLista) {
        // Si antes quedó algo para Pablo, sigue quedando: la foto no lo resuelve.
        $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => 'esperar', 'motivo' => 'Mandó material sin texto con los datos de la demo ya recibidos',
                                     'ajustes' => ['prediseno_material'], 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
        return [];
    }
    if (trim($texto) === '') { $conv['handoff_pendiente'] = true; return []; }

    /* Un "ok", un "gracias" o un pulgar después de la demo no gasta un turno
     * del modelo: se espera, como hace Pablo (1-nov). Lo mismo esperando la demo
     * con los datos ya recibidos (11-nov). */
    if (($postdemo || $fichaLista) && wabot_comercial_postdemo_es_acuse($texto)) {
        if ($postdemo) $conv['handoff_pendiente'] = false;
        $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => 'esperar', 'motivo' => $postdemo ? 'Un acuse después de la demo' : 'Un acuse esperando la demo',
                                     'ajustes' => [$postdemo ? 'postdemo_acuse' : 'prediseno_acuse'], 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
        return [];
    }

    /* Los datos de la demo por el chat (Pablo, 9-nov): con el pedido mandado, lo
     * que escribe se lee primero como posible respuesta a ese pedido
     * (datos-demo.php). Si son los datos, se arma la ficha y se le confirma; si
     * es otra cosa (una duda, un «dale»), sigue lo de siempre. */
    if ($postForm && function_exists('wabot_datos_demo_turno')) {
        $datos = wabot_datos_demo_turno($texto, $conv, $cfg);
        if ($datos !== null) return $datos;
    }

    /* "No puedo abrir el link" con el formulario mandado (Sabrina, Instagram,
     * 26-oct: quedó para Pablo en silencio y a la mañana le salió igual el
     * recordatorio): se le reenvía el mismo link, sin gastar un turno del modelo.
     * Queda pendiente para Pablo por si el link de verdad falla. */
    if ($postForm && wabot_comercial_link_no_abre($texto, $conv)) {
        // Ya se lo reenviamos y sigue sin entrar: otro link igual no lo arregla, lo ve Pablo.
        if ((int)($conv['link_no_abre_ts'] ?? 0) > 0 && (int)$conv['link_no_abre_ts'] >= (int)($conv['form_link_mandado_ts'] ?? 0)) {
            $conv['handoff_pendiente'] = true;
            $conv['form_duda_pablo_ts'] = time();
            $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => 'humano', 'motivo' => 'Sigue sin poder abrir el link del formulario',
                                         'ajustes' => ['link_no_abre_otra_vez'], 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
            wabot_log('comercial_link_no_abre', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr($texto, 0, 120), 'otra_vez' => true]);
            return [];
        }
        $plantilla = trim((string)($cfg['comercial']['link_no_abre'] ?? ''));
        $link = function_exists('wabot_form_recordatorio_link') ? (string)wabot_form_recordatorio_link($conv, $cfg) : '';
        if ($plantilla !== '' && $link !== '' && strpos($plantilla, '{link}') !== false) {
            $conv['handoff_pendiente'] = true;
            $conv['form_duda_pablo_ts'] = time();
            $conv['link_no_abre_ts'] = time();
            $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => 'responder', 'motivo' => 'No le abre el link del formulario: se lo reenviamos',
                                         'ajustes' => ['link_no_abre'], 'revision' => ['estado' => 'sin_revisar', 'problemas' => [], 'falta' => [], 'pendientes' => []]];
            wabot_log('comercial_link_no_abre', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr($texto, 0, 120)]);
            $conv['_comercial_salida'] = true;
            return [strtr($plantilla, ['{link}' => $link])];
        }
    }

    $res = wabot_comercial_decidir($texto, $conv, $cfg, 'real');
    if (!$res['ok']) {
        wabot_log('comercial_respaldo', ['tel' => $conv['tel'] ?? '', 'error' => (string)$res['error']]);
        wabot_evento_sesion($conv, 'comercial_fallo', ['error' => (string)$res['error']]);
        $conv['handoff_pendiente'] = true;
        return [];
    }
    $b = $res['b'];
    if ($postForm && $b['accion'] === 'humano') {
        /* Lo que no es simple (no le abre el link, pide una llamada, quiere pagar)
         * queda como antes: en silencio para Pablo, sin tomar el control ni
         * bloquear el recordatorio del formulario. */
        $conv['handoff_pendiente'] = true;
        // Hasta que Pablo le conteste, el recordatorio del formulario no corresponde (26-oct).
        $conv['form_duda_pablo_ts'] = time();
        $conv['comercial_ultimo'] = ['ts' => time(), 'accion' => 'humano', 'motivo' => (string)$b['motivo'],
                                     'ajustes' => $res['ajustes'], 'revision' => $res['revision']];
        wabot_log('comercial_post_form_pablo', ['tel' => $conv['tel'] ?? '', 'motivo' => mb_substr((string)$b['motivo'], 0, 160)]);
        return [];
    }
    $conv = $b['conv'];
    $conv['comercial_ultimo']['ajustes'] = $res['ajustes'];
    $conv['comercial_ultimo']['revision'] = $res['revision'];
    // El texto del modelo se descartó y no quedó nada para mandar: lo ve Pablo, como antes.
    if (!$b['mensajes'] && in_array('sin_texto', (array)$res['ajustes'], true) && !in_array($b['accion'], ['humano', 'esperar'], true)) {
        $conv['handoff_pendiente'] = true;
        wabot_log('comercial_respaldo', ['tel' => $conv['tel'] ?? '', 'error' => 'sin_texto_y_sin_respuesta']);
    }
    /* Al derivar, en silencio (27-oct: "que se siga callando"), pero solo en ESA
     * pregunta (1-nov: "solo calla en esa"): le suena el aviso a Pablo y, si el
     * cliente vuelve a escribir sin que Pablo haya contestado, el flujo sigue.
     * Ya no toma el control: eso lo hace el eco de Pablo cuando contesta. */
    if ($b['accion'] === 'humano') {
        $conv['handoff_pendiente'] = true;
    }
    // El modelo vio que avisó que pagó (1-nov): la marca ya la puso construir(); acá, el aviso a Pablo.
    if ($postdemo && !empty($b['resumen']['pago_avisado'])) {
        wabot_log('comercial_pago_avisado', ['tel' => $conv['tel'] ?? '', 'msg' => mb_substr($texto, 0, 160), 'por' => 'modelo']);
        wabot_comercial_postdemo_avisar_pablo($conv);
    }
    // Si llega otro mensaje antes de mandar esto, el webhook lo descarta y vuelve a pensar con todo.
    $conv['_ia_recalculable'] = true;
    $conv['_comercial_salida'] = true;
    return array_map(function ($m) { return $m['t']; }, $b['mensajes']);
}
