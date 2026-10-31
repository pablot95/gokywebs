<?php
/**
 * wabot/ab-precios.php — prueba A/B de precios (Pablo, 31-oct-2026).
 *
 * Dos modelos en paralelo, con los mismos anuncios y en el mismo período:
 *   A: pago único o plan mensual (el plan anual ya no se ofrece).
 *   B: un pago inicial que cubre todo el desarrollo (sin seña ni saldo) y, al
 *      mes de ese pago, la mensualidad. Tienda (y cursos, inmobiliaria,
 *      reservas, catálogo): $100.000 + $30.000/mes; sitio profesional:
 *      $80.000 + $20.000/mes. La titularidad del código se puede pedir al mes
 *      12. El pago único, solo si lo pide.
 *
 * El grupo sale del teléfono (último dígito par = A, impar = B; Instagram por
 * el id) y es siempre el mismo para esa persona. Queda anotado en la charla
 * (`ab_grupo`) y en la cotización (`modelo`) al pasarle el precio. Una charla
 * que ya tenía precio antes de la prueba sigue con lo suyo (sin `modelo`).
 *
 * Cómo entra en el bot: wabot_ab_cfg() devuelve la config con los textos y
 * montos del grupo encima (`ab_precios.modelos.<grupo>` de textos.php). La usan
 * el flujo comercial (comercial.php), los marcadores de precio y el formulario.
 */

/** ¿Está corriendo la prueba? Apagada, todos ven el modelo A. */
function wabot_ab_activa($cfg) {
    return !empty($cfg['ab_precios']['activo']);
}

/** El grupo que le toca a esta persona por su teléfono o su id: 'a' o 'b'. */
function wabot_ab_grupo_por_id($conv) {
    $id = (string)($conv['tel'] ?? '');
    if ($id === '' && function_exists('wabot_channel_user_id')) $id = (string)wabot_channel_user_id($conv);
    $digitos = preg_replace('/\D/', '', $id);
    if ($digitos !== '' && strpos($id, 'ig') !== 0) return ((int)substr($digitos, -1)) % 2 === 0 ? 'a' : 'b';
    if ($id === '') return 'a';
    return (crc32($id) % 2) === 0 ? 'a' : 'b';
}

/**
 * El modelo de precios de esta charla: 'a', 'b' o '' (cotizada antes de la
 * prueba: sigue con sus textos de siempre). Manda lo congelado: la cotización,
 * después lo anotado en la charla y, si no hay nada, el teléfono.
 */
function wabot_ab_grupo($conv, $cfg) {
    // Las pruebas de antes de la prueba de precios corren sin grupos (test-lib.php); test-ab-precios.php los prende.
    if (!empty($GLOBALS['WABOT_TEST_SIN_AB'])) return '';
    $cot = is_array($conv['comercial_cotizacion'] ?? null) ? $conv['comercial_cotizacion'] : null;
    if ($cot && in_array(($cot['modelo'] ?? ''), ['a', 'b'], true)) return $cot['modelo'];
    if (in_array(($conv['ab_grupo'] ?? ''), ['a', 'b'], true)) return $conv['ab_grupo'];
    // Precio dado antes de la prueba (flujo nuevo, motor viejo o Pablo a mano): no se cambia.
    if ($cot || !empty($conv['precio_dado'])) return '';
    if (!wabot_ab_activa($cfg)) return 'a';
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

/** El grupo que ya se aplicó a esta config ('a', 'b' o ''). */
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
            $items[] = 'Te paso el detalle con todas las condiciones y los datos para la transferencia del pago inicial: https://gokywebs.com/pago/' . $pagina;
        }
    }
    return $items ? ['ico' => '🧪', 'titulo' => 'Precio de esta charla (grupo ' . strtoupper($grupo) . ')', 'items' => $items] : null;
}

/** ¿Una respuesta rápida guardada habla del plan anual? En las charlas de la prueba no se muestra. */
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
