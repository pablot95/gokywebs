<?php
/**
 * wabot/ab-precios.php — prueba A/B de precios (Pablo, 31-oct-2026).
 *
 * Dos modelos en paralelo, con los mismos anuncios y en el mismo período:
 *   A2: plan anual o plan mensual, con los textos de antes del 26-oct (Pablo,
 *      2-nov: era lo que convertía, 37 % en 700 charlas). El pago único, solo
 *      si lo pide, como entonces.
 *   B: un pago inicial que cubre todo el desarrollo (sin seña ni saldo) y, al
 *      mes de ese pago, la mensualidad. Tienda (y cursos, inmobiliaria,
 *      reservas, catálogo): $100.000 + $30.000/mes; sitio profesional:
 *      $80.000 + $20.000/mes. La titularidad del código se puede pedir al mes
 *      12. El pago único, solo si lo pide.
 *   A (del 31-oct al 2-nov, cerrado): pago único o plan mensual, sin el anual.
 *      Queda solo para las charlas que ya lo recibieron, con lo que se les dijo.
 *
 * El grupo sale del teléfono (último dígito par = A2, impar = B; Instagram por
 * el id) y es siempre el mismo para esa persona. Queda anotado en la charla
 * (`ab_grupo`) y en la cotización (`modelo`) al pasarle el precio. Una charla
 * que ya tenía precio antes de la prueba sigue con lo suyo (sin `modelo`).
 *
 * Cómo entra en el bot: wabot_ab_cfg() devuelve la config con los textos y
 * montos del grupo encima (`ab_precios.modelos.<grupo>` de textos.php). La usan
 * el flujo comercial (comercial.php), los marcadores de precio y el formulario.
 */

/** Los grupos que pueden quedar congelados en una charla, con cómo se los nombra en el panel y el reporte. */
function wabot_ab_grupos() {
    return ['a2' => 'anual o mensual', 'b' => 'pago inicial + mensual', 'a' => 'pago único o mensual'];
}

/** "Grupo A2 · anual o mensual". */
function wabot_ab_grupo_nombre($grupo) {
    $nombres = wabot_ab_grupos();
    return isset($nombres[$grupo]) ? 'Grupo ' . strtoupper($grupo) . ' · ' . $nombres[$grupo] : '';
}

/** ¿El grupo de esta charla no tiene plan anual (A y B)? En A2 el anual es una de las dos opciones. */
function wabot_ab_sin_anual($conv, $cfg) {
    return in_array(wabot_ab_grupo($conv, $cfg), ['a', 'b'], true);
}

/** ¿Está corriendo la prueba? Apagada, todos ven el modelo A2 (anual o mensual). */
function wabot_ab_activa($cfg) {
    return !empty($cfg['ab_precios']['activo']);
}

/** El grupo que le toca a esta persona por su teléfono o su id: 'a2' o 'b' (desde el 2-nov los pares ya no van al A). */
function wabot_ab_grupo_por_id($conv) {
    $id = (string)($conv['tel'] ?? '');
    if ($id === '' && function_exists('wabot_channel_user_id')) $id = (string)wabot_channel_user_id($conv);
    $digitos = preg_replace('/\D/', '', $id);
    if ($digitos !== '' && strpos($id, 'ig') !== 0) return ((int)substr($digitos, -1)) % 2 === 0 ? 'a2' : 'b';
    if ($id === '') return 'a2';
    return (crc32($id) % 2) === 0 ? 'a2' : 'b';
}

/**
 * El modelo de precios de esta charla: 'a2', 'b', 'a' (ya cotizada en el A) o
 * '' (cotizada antes de la prueba: sigue con sus textos de siempre). Manda lo
 * congelado: la cotización, después lo anotado en la charla y, si no hay
 * nada, el teléfono.
 */
function wabot_ab_grupo($conv, $cfg) {
    // Las pruebas de antes de la prueba de precios corren sin grupos (test-lib.php); test-ab-precios.php los prende.
    if (!empty($GLOBALS['WABOT_TEST_SIN_AB'])) return '';
    $grupos = array_keys(wabot_ab_grupos());
    $cot = is_array($conv['comercial_cotizacion'] ?? null) ? $conv['comercial_cotizacion'] : null;
    if ($cot && in_array(($cot['modelo'] ?? ''), $grupos, true)) return $cot['modelo'];
    if (in_array(($conv['ab_grupo'] ?? ''), $grupos, true)) return $conv['ab_grupo'];
    // Precio dado antes de la prueba (flujo nuevo, motor viejo o Pablo a mano): no se cambia.
    if ($cot || !empty($conv['precio_dado'])) return '';
    if (!wabot_ab_activa($cfg)) return 'a2';
    return wabot_ab_grupo_por_id($conv);
}

/** La config con los textos y montos del grupo de esta charla encima. */
function wabot_ab_cfg($cfg, $conv) {
    if (!is_array($cfg) || !empty($cfg['_ab_grupo_aplicado'])) return $cfg;
    $grupo = wabot_ab_grupo($conv, $cfg);
    $capa = $grupo !== '' ? ($cfg['ab_precios']['modelos'][$grupo] ?? null) : null;
    if (!is_array($capa)) return $cfg;
    $cfg = array_replace_recursive($cfg, $capa);
    $cfg['_ab_grupo_aplicado'] = $grupo;
    return $cfg;
}

/** El grupo que ya se aplicó a esta config ('a2', 'b', 'a' o ''). */
function wabot_ab_grupo_cfg($cfg) {
    return (string)($cfg['_ab_grupo_aplicado'] ?? '');
}

/** El pago inicial del modelo B para esta charla: el congelado o el de lista de su tipo. */
function wabot_ab_inicial($conv, $cfg, $tipo = null) {
    $cot = is_array($conv['comercial_cotizacion'] ?? null) ? $conv['comercial_cotizacion'] : null;
    if ($cot && trim((string)($cot['inicial'] ?? '')) !== '') return trim((string)$cot['inicial']);
    if (trim((string)($conv['inicial_cotizado'] ?? '')) !== '') return trim((string)$conv['inicial_cotizado']);
    $tipo = $tipo ?: (string)($conv['tipo'] ?? '');
    return trim((string)($cfg['tipos'][$tipo]['inicial'] ?? ''));
}

/**
 * Las respuestas rápidas del panel con el precio del grupo de esta charla:
 * ['titulo' => …, 'items' => [...]] o null si la charla no está en la prueba.
 * Con el tipo conocido, solo el suyo; si no, sitio profesional y tienda.
 */
function wabot_ab_rr_categoria($conv, $cfg) {
    $grupo = is_array($conv) ? wabot_ab_grupo($conv, $cfg) : '';
    if ($grupo === '') return null;
    $c = wabot_ab_cfg($cfg, $conv);
    $tipo = (string)($conv['tipo'] ?? '');
    $planes = [];
    if ($tipo === 'landing') $planes[] = empty($conv['landing_con_panel']) ? ['informativa', 'landing', 'sitio profesional'] : ['panel', 'ecommerce', 'sitio profesional'];
    elseif ($tipo !== '') $planes[] = ['panel', $tipo, ['ecommerce' => 'tienda online', 'elearning' => 'web de cursos', 'inmobiliaria' => 'web inmobiliaria'][$tipo] ?? 'web'];
    else $planes = [['informativa', 'landing', 'sitio profesional'], ['panel', 'ecommerce', 'tienda online']];
    $items = [];
    foreach ($planes as [$plan, $tipoMontos, $web]) {
        $t = (array)($c['tipos'][$tipoMontos] ?? []);
        $texto = (string)($c['comercial'][$plan === 'informativa' ? 'planes_informativa' : 'planes_panel'] ?? '');
        if ($texto === '') continue;
        $items[] = strtr($texto, ['{web}' => $web, '{inicial}' => (string)($t['inicial'] ?? ''), '{mensual}' => (string)($t['mensualidad'] ?? ''),
                                  '{unico}' => (string)($t['precio_unico'] ?? ''), '{anual}' => (string)($t['precio'] ?? '')]);
        if ($grupo === 'b') {
            $pagina = $plan === 'informativa' ? 'inicial80' : 'inicial100';
            $items[] = "Te paso el enlace donde están todos los detalles del servicio y los datos para el pago\n\nUna vez realizado el pago queda activo y avanzamos con las modificaciones y el desarrollo completo: https://gokywebs.com/pago/" . $pagina;
        }
    }
    // 4-nov: con la prueba apagada el A2 es el precio de todos: sin el «(grupo A2)» ni el tubo de ensayo.
    if ($grupo === 'a2' && !wabot_ab_activa($cfg)) return $items ? ['ico' => '💰', 'titulo' => 'Precio de esta charla', 'items' => $items] : null;
    return $items ? ['ico' => '🧪', 'titulo' => 'Precio de esta charla (grupo ' . strtoupper($grupo) . ')', 'items' => $items] : null;
}

/** ¿Una respuesta rápida guardada habla del plan anual? En las charlas de A y B no se muestra. */
function wabot_ab_rr_menciona_anual($texto) {
    return (bool)preg_match('/\banual\b|_anual\}|link_anual|\/anual\d/iu', (string)$texto);
}

/** Cómo se llama la web en el texto del modelo B ("Para tu tienda online, …"). */
function wabot_ab_nombre_web($solucion) {
    $nombres = ['informativa' => 'sitio profesional', 'informativa_panel' => 'sitio profesional', 'tienda' => 'tienda online',
                'catalogo' => 'catálogo online', 'cursos' => 'web de cursos', 'inmobiliaria' => 'web inmobiliaria',
                'reservas' => 'web con reservas de turnos'];
    return $nombres[(string)$solucion] ?? 'web';
}

/**
 * Las cuentas de la prueba, leyendo las charlas guardadas (ab-reporte.php y
 * admin.php?accion=ab_json). `charlas` va una por una, para que el admin
 * cruce cada teléfono con su cliente y sume los cobros por grupo.
 */
function wabot_ab_reporte_calcular($ahora = null) {
    $ahora = $ahora ?? time();
    $ventana = 72 * 3600;
    $filas = [];
    $charlas = [];
    foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $archivo) {
        $cv = json_decode((string)@file_get_contents($archivo), true);
        // Las charlas de las pruebas locales (…TEST) no cuentan.
        if (!is_array($cv) || str_ends_with(basename($archivo, '.json'), 'TEST')) continue;
        $cot = is_array($cv['comercial_cotizacion'] ?? null) ? $cv['comercial_cotizacion'] : [];
        $grupo = (string)($cot['modelo'] ?? '');
        if (!isset(wabot_ab_grupos()[$grupo])) continue;
        $plan = ($cot['plan'] ?? '') === 'informativa' ? 'sitio' : 'con_panel';
        $desde = (int)($cv['ab_grupo_ts'] ?? ($cot['ts'] ?? 0));
        $clave = $grupo . '|' . $plan;
        $f = $filas[$clave] ?? ['grupo' => $grupo, 'plan' => $plan, 'precio' => 0, 'demo_ofrecida' => 0, 'link_form' => 0,
                                'form' => 0, 'maduras_72h' => 0, 'form_72h' => 0, 'eligio_pago_unico' => 0];
        $f['precio']++;
        if (!empty($cv['comercial_oferta_ts']) || !empty($cv['oferta_diseno_ts'])) $f['demo_ofrecida']++;
        if (!empty($cv['form_link_mandado_ts'])) $f['link_form']++;
        $formTs = (int)($cv['form_completado_ts'] ?? 0);
        if ($formTs > 0) $f['form']++;
        if (($cv['modalidad_elegida'] ?? '') === 'propia') $f['eligio_pago_unico']++;
        if ($desde > 0 && $ahora - $desde >= $ventana) {
            $f['maduras_72h']++;
            if ($formTs > 0 && $formTs - $desde <= $ventana) $f['form_72h']++;
        }
        $filas[$clave] = $f;
        $charlas[] = ['tel' => (string)($cv['tel'] ?? basename($archivo, '.json')), 'grupo' => $grupo, 'plan' => $plan,
                      'precio_ts' => $desde, 'form_ts' => $formTs];
    }
    ksort($filas);
    foreach ($filas as &$f) $f['conversion_72h'] = $f['maduras_72h'] > 0 ? round(100 * $f['form_72h'] / $f['maduras_72h'], 1) : null;
    unset($f);
    return ['filas' => array_values($filas), 'charlas' => $charlas];
}
