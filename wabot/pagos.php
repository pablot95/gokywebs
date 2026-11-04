<?php
/**
 * wabot/pagos.php — entró la plata: detectar el pago en Mercado Pago, atarlo al
 * chat y confirmarlo (Pablo, 1-nov-2026: "cuando un cliente paga, que el bot se
 * dé cuenta y siga él").
 *
 * Qué mira. El cron (seguimiento.php) consulta /v1/payments/search de los
 * últimos WABOT_PAGOS_DIAS días, aprobados y cobrados por la cuenta de Pablo,
 * SIN el filtro de suscripciones que usa la facturación automática
 * (config/arca/suscripciones.php, que sigue aparte y no se toca). Verificado
 * con el token real el 1-nov: ahí aparecen
 *   - las suscripciones: point_of_interaction.type SUBSCRIPTIONS, con el id de
 *     la suscripción y el número de cuota (1 = el alta, el resto renovaciones);
 *   - los pagos con link de Checkout Pro (pago/?monto=…): type CHECKOUT y el
 *     external_reference que arma pago/api/crear-preferencia.php;
 *   - las transferencias desde un banco al CVU: operation_type account_fund,
 *     payment_type_id bank_transfer, type PSP_TRANSFER. OJO: el "payer" es la
 *     propia cuenta de Pablo (MP lo modela como "cargar la cuenta"); no viene
 *     ni el nombre ni el CUIT del que mandó. Solo monto y hora;
 *   - las transferencias desde otra cuenta de Mercado Pago: operation_type
 *     money_transfer, type PSP_TRANSFER, con el email y el CUIT del que paga.
 * Lo que pagó Pablo (Facebook, compras) tiene otro collector y no entra; lo que
 * cargó él mismo con tarjeta (account_fund con tarjeta) se ignora.
 *
 * Cómo lo ata al chat, en este orden:
 *   (a) external_reference "GKY-<código>-…": el código corto de la charla, el
 *       mismo del link del formulario (?c= en las páginas de pago/);
 *   (b) el mismo monto que un link de pago (o los datos para transferir) que se
 *       mandó a ese chat en las últimas WABOT_PAGOS_LINK_HORAS horas, en UN solo
 *       chat, y el cliente avisó que pagó (pago_avisado_ts o "ya pagué" /
 *       comprobante en el chat) → se confirma solo;
 *   (c) lo demás (dos chats posibles, monto sin link, nadie avisó) queda en
 *       "pagos sin asignar" (pestaña Clientes del panel) con los chats sugeridos,
 *       y Pablo lo asigna con un toque. Los que quedan sin asignar se vuelven a
 *       cruzar en cada corrida mientras tengan menos de 72 h: el comprobante
 *       suele llegar un rato después de la plata.
 *
 * Al confirmar (wabot_pago_confirmar): la charla queda con pago_confirmado_ts,
 * pago_id, pago_monto y pago_modalidad; en Firestore el doc de `clientes` pasa
 * a cliente con lo mismo que escribe "pasar a Cliente" en admin/dashboard.js
 * (según la modalidad), con la cuenta de servicio; se le avisa a Meta la
 * compra (wabot_capi_compra); queda el log `pago_confirmado`; le llega el aviso
 * a Pablo; y el bot vuelve a tener el chat para pedirle al cliente lo que falta
 * (onboarding.php). La factura de cada cobro de suscripción la sigue haciendo
 * facturar-cobros.php: acá no se emite nada.
 *
 * Lo visto queda en data/pagos-mp.json (id del pago → qué pasó) para no repetir.
 * La primera corrida solo anota lo que ya estaba (estado "anterior"), sin confirmar
 * nada: esos pagos Pablo ya los atendió a mano.
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/push.php';
require_once __DIR__ . '/presentar.php';   // el token de Firestore con la cuenta de servicio
require_once __DIR__ . '/ab-precios.php';  // el grupo de la prueba de precios (seguimiento.php no lo carga)

const WABOT_PAGOS_DIAS = 3;            // cuántos días atrás se buscan pagos en MP en cada corrida
const WABOT_PAGOS_LINK_HORAS = 72;     // un link de pago mandado hace menos de esto cuenta para el cruce
const WABOT_PAGOS_RECORDAR_DIAS = 120; // cuánto se recuerda cada pago visto

/* ── El archivo de estado ──────────────────────────────────────────────── */

function wabot_pagos_archivo() {
    return (string)($GLOBALS['WABOT_TEST_PAGOS_ARCHIVO'] ?? (WABOT_DATA . '/pagos-mp.json'));
}

/** ['pagos' => [id => fila], 'corrida_ts' => int, 'yo' => id de la cuenta de MP]. */
function wabot_pagos_estado() {
    $j = json_decode((string)@file_get_contents(wabot_pagos_archivo()), true);
    if (!is_array($j)) $j = [];
    return [
        'pagos'      => array_filter((array)($j['pagos'] ?? []), 'is_array'),
        'corrida_ts' => (int)($j['corrida_ts'] ?? 0),
        'yo'         => (string)($j['yo'] ?? ''),
        'error'      => (string)($j['error'] ?? ''),
        'error_ts'   => (int)($j['error_ts'] ?? 0),
        // Mail del que paga → cliente del admin (3-nov): lo que entra de ese mail se asigna solo.
        'emails_cliente' => array_filter((array)($j['emails_cliente'] ?? []), 'is_array'),
    ];
}

function wabot_pagos_guardar(array $estado) {
    return wabot_json_guardar_atomico(wabot_pagos_archivo(), $estado);
}

/* ── Mercado Pago (solo lectura) ───────────────────────────────────────── */

/** El token de config/mp-config.php, o '' si no está (el poller no corre). */
function wabot_pagos_mp_token() {
    if (!defined('MP_ACCESS_TOKEN')) {
        $config = __DIR__ . '/../config/mp-config.php';
        if (!is_file($config)) return '';
        require_once $config;
    }
    return defined('MP_ACCESS_TOKEN') ? trim((string)MP_ACCESS_TOKEN) : '';
}

/** GET a la API de MP. Las funciones que lo usan lo reciben como callable: los tests le pasan datos fijos. */
function wabot_pagos_mp($ruta) {
    $token = wabot_pagos_mp_token();
    if ($token === '') throw new RuntimeException('Falta config/mp-config.php (el token de Mercado Pago).');
    $ch = curl_init('https://api.mercadopago.com' . $ruta);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token],
        CURLOPT_TIMEOUT => 25,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    $datos = is_string($res) ? json_decode($res, true) : null;
    if ($http !== 200 || !is_array($datos)) {
        throw new RuntimeException('Mercado Pago respondió HTTP ' . $http . ($err !== '' ? " ($err)" : '') . ' a ' . strtok($ruta, '?'));
    }
    return $datos;
}

/** El id de la cuenta de Mercado Pago del token: la que cobra. */
function wabot_pagos_mp_yo(callable $mp) {
    $yo = $mp('/users/me');
    if (empty($yo['id'])) throw new RuntimeException('Mercado Pago no devolvió el usuario de la cuenta.');
    return (string)$yo['id'];
}

/**
 * Los pagos aprobados que cobró la cuenta desde $desdeTs, normalizados (ver
 * wabot_pagos_normalizar), del más viejo al más nuevo.
 */
function wabot_pagos_buscar(callable $mp, $yo, $desdeTs) {
    $inicio = rawurlencode(gmdate('Y-m-d\TH:i:s.000\Z', (int)$desdeTs));
    $pagos = [];
    for ($offset = 0; $offset < 2000; $offset += 100) {
        $pagina = $mp('/v1/payments/search?range=date_approved&begin_date=' . $inicio . '&end_date=NOW'
            . '&status=approved&collector.id=' . rawurlencode((string)$yo)
            . '&sort=date_approved&criteria=asc&limit=100&offset=' . $offset);
        foreach ((array)($pagina['results'] ?? []) as $p) {
            $fila = is_array($p) ? wabot_pagos_normalizar($p, $yo) : null;
            if ($fila) $pagos[$fila['id']] = $fila;
        }
        if ($offset + 100 >= (int)($pagina['paging']['total'] ?? 0)) break;
    }
    usort($pagos, function ($a, $b) { return $a['ts'] <=> $b['ts']; });
    return $pagos;
}

/**
 * Un pago de la API, reducido a lo que importa; null si no es un cobro de la
 * cuenta (otro collector, no aprobado). `tipo`:
 *   suscripcion      cobro de una suscripción (cuota 1 = el alta)
 *   checkout         pago con link de Checkout Pro (puede traer la referencia GKY-)
 *   transferencia    transferencia bancaria al CVU (sin datos del que mandó)
 *   transferencia_mp transferencia desde otra cuenta de MP (con email y CUIT)
 *   propio           plata que cargó Pablo en su propia cuenta
 *   otro             cualquier otra cosa: se anota y no se cruza
 */
function wabot_pagos_normalizar(array $pago, $yo) {
    if ((string)($pago['status'] ?? '') !== 'approved' || empty($pago['id'])) return null;
    $collector = (string)($pago['collector_id'] ?? ($pago['collector']['id'] ?? ''));
    if ($collector === '' || $collector !== (string)$yo) return null;

    $poi = (string)($pago['point_of_interaction']['type'] ?? '');
    $op = (string)($pago['operation_type'] ?? '');
    $ptype = (string)($pago['payment_type_id'] ?? '');
    $payer = (array)($pago['payer'] ?? []);
    $payerId = (string)($payer['id'] ?? '');
    $fila = [
        'id'          => (string)$pago['id'],
        'monto'       => (int)round((float)($pago['transaction_amount'] ?? 0)),
        'ts'          => (int)(strtotime((string)($pago['date_approved'] ?? '')) ?: 0),
        'tipo'        => 'otro',
        'cuota'       => 0,
        'suscripcion' => '',
        'referencia'  => trim((string)($pago['external_reference'] ?? '')),
        'email'       => '',
        'cuit'        => '',
        'medio'       => $ptype . '/' . (string)($pago['payment_method_id'] ?? ''),
        'devuelto'    => (float)($pago['transaction_amount_refunded'] ?? 0),
        'descripcion' => mb_substr(trim((string)($pago['description'] ?? '')), 0, 60),
    ];
    if ($poi === 'SUBSCRIPTIONS') {
        $fila['tipo'] = 'suscripcion';
        $fila['suscripcion'] = (string)($pago['point_of_interaction']['transaction_data']['subscription_id'] ?? '');
        $fila['cuota'] = (int)($pago['point_of_interaction']['transaction_data']['subscription_sequence']['number'] ?? 0);
    } elseif ($poi === 'CHECKOUT' || preg_match('/^GKY-/', $fila['referencia'])) {
        $fila['tipo'] = 'checkout';
    } elseif ($op === 'account_fund' && $ptype === 'bank_transfer') {
        $fila['tipo'] = 'transferencia';
    } elseif ($op === 'account_fund') {
        $fila['tipo'] = 'propio';
    } elseif ($op === 'money_transfer') {
        $fila['tipo'] = $payerId !== '' && $payerId === (string)$yo ? 'propio' : 'transferencia_mp';
    }
    // En la transferencia bancaria el "pagador" es la cuenta de Pablo: esos datos no son del cliente.
    if ($fila['tipo'] !== 'transferencia' && $fila['tipo'] !== 'propio' && $payerId !== (string)$yo) {
        $fila['email'] = mb_strtolower(trim((string)($payer['email'] ?? '')));
        $fila['cuit'] = preg_replace('/\D+/', '', (string)($payer['identification']['number'] ?? ''));
    }
    return $fila;
}

/* ── Qué link de pago se mandó a cada chat ─────────────────────────────── */

/** Los links cortos de Mercado Pago de las suscripciones y su mensualidad (también los usa links_pago_json del panel). */
function wabot_pagos_codigos_mp() {
    return ['2KGENxL' => 10000, '1pfejMG' => 20000, '2nEoNGN' => 22000, '28VK7Ev' => 25000, '2CQLnCv' => 32000, '1hYAiTM' => 35000, '2GhZD56' => 40000];
}

/** Los planes de suscripción (preapproval_plan_id) y su mensualidad. */
function wabot_pagos_planes_mp() {
    return ['17321dd1a34e4ea0979175293297d60f' => 15000, 'ea40c15059ec42a7ac5b6293d77ae148' => 20000, '8df0842d799e40b5a0e9ef0696b47e8b' => 22000,
            '56340e241c87402c81c02d43ce472fd7' => 25000, '36a67a7e42e7404989beb99703a0569b' => 30000, '4640949ef7694b5ab565d714326f04a2' => 32000, 'b7d653f4f61a445ba8859ae497e7ca66' => 35000];
}

/**
 * Lo que se cobra al arrancar según la página de pago/ que se mandó: la
 * mensualidad entera (mensualNNNNN), la seña del plan anual ($60.000, escrita
 * en las páginas anualNNN), la del pago único ($80.000 el sitio, $100.000 el
 * resto, desde el 26-oct: unico240/unico220 y unico330) o el pago inicial del
 * modelo B (inicialNN, 31-oct). [modalidad, monto] o null.
 */
function wabot_pagos_pagina_monto($pagina) {
    if (!preg_match('/^(mensual|anual|unico|inicial)(\d{2,6})$/i', (string)$pagina, $m)) return null;
    $tipo = strtolower($m[1]);
    $n = (int)$m[2];
    if ($tipo === 'mensual') return ['mensual', $n];
    if ($tipo === 'inicial') return ['inicial', $n * 1000];
    if ($tipo === 'anual') return ['anual', 60000];
    return ['unico', $n >= 300 ? 100000 : 80000];
}

/**
 * Qué datos de pago trae un mensaje nuestro (del bot o de Pablo): una lista de
 * ['monto' => int, 'modalidad' => mensual|anual|unico|inicial|'', 'via' => link|alias].
 * Con los datos para transferir (alias o CVU) no hay monto: cuenta como "le
 * pasó cómo pagar" y los montos esperados salen de lo cotizado en la charla.
 */
function wabot_pagos_links_en($texto) {
    $t = (string)$texto;
    if ($t === '') return [];
    $out = [];
    if (preg_match_all('~mpago\.la/([A-Za-z0-9]+)~', $t, $mm)) {
        foreach ($mm[1] as $c) if (isset(wabot_pagos_codigos_mp()[$c])) $out[] = ['monto' => wabot_pagos_codigos_mp()[$c], 'modalidad' => 'mensual', 'via' => 'link'];
    }
    if (preg_match_all('~preapproval_plan_id=([0-9a-f]{32})~i', $t, $mm)) {
        foreach ($mm[1] as $p) if (isset(wabot_pagos_planes_mp()[strtolower($p)])) $out[] = ['monto' => wabot_pagos_planes_mp()[strtolower($p)], 'modalidad' => 'mensual', 'via' => 'link'];
    }
    if (preg_match_all('~gokywebs\.com/pago/((?:mensual|anual|unico|inicial)\d{2,6})\b~i', $t, $mm)) {
        foreach ($mm[1] as $pagina) {
            $pm = wabot_pagos_pagina_monto($pagina);
            if ($pm) $out[] = ['monto' => $pm[1], 'modalidad' => $pm[0], 'via' => 'link'];
        }
    }
    if (preg_match_all('~gokywebs\.com/planmensual/(\d{4,6})\b~i', $t, $mm)) {
        foreach ($mm[1] as $n) $out[] = ['monto' => (int)$n, 'modalidad' => 'mensual', 'via' => 'link'];
    }
    if (preg_match_all('~gokywebs\.com/planmensual/(sitioprofesional|tienda)\b~i', $t, $mm)) {
        foreach ($mm[1] as $p) $out[] = ['monto' => strtolower($p) === 'tienda' ? 30000 : 20000, 'modalidad' => 'mensual', 'via' => 'link'];
    }
    // La página general con el importe puntual (la seña con tarjeta, una carga de productos…).
    if (preg_match_all('~gokywebs\.com/pago/?\?(?:[^\s]*?&)?monto=(\d{4,7})~i', $t, $mm)) {
        foreach ($mm[1] as $n) $out[] = ['monto' => (int)$n, 'modalidad' => (int)$n === 60000 ? 'anual' : '', 'via' => 'link'];
    }
    if (preg_match('/\bpablotravis?\b/i', $t) || strpos($t, '0000003100053462800156') !== false) {
        $out[] = ['monto' => 0, 'modalidad' => '', 'via' => 'alias'];
    }
    // Sin repetir el mismo monto y modalidad dos veces.
    $unicos = [];
    foreach ($out as $o) $unicos[$o['via'] . '|' . $o['monto'] . '|' . $o['modalidad']] = $o;
    return array_values($unicos);
}

/** Lo que se cobra al arrancar en esta charla, por modalidad, con los montos congelados de la cotización. */
function wabot_pagos_montos_esperados($conv, $cfg) {
    $tipo = (string)($conv['tipo'] ?? '');
    if ($tipo === '' || !is_array($cfg) || !isset($cfg['tipos'][$tipo]) || !function_exists('wabot_precio_vigente')) return [];
    $v = wabot_precio_vigente($conv, $cfg, $tipo);
    $n = function ($s) { return function_exists('wabot_monto_a_numero') ? (int)wabot_monto_a_numero($s) : (int)preg_replace('/\D/', '', (string)$s); };
    $out = [];
    if ($n($v['mensualidad'] ?? '') > 0) $out['mensual'] = $n($v['mensualidad']);
    if ($n($v['sena'] ?? '') > 0) $out['anual'] = $n($v['sena']);
    /* La seña del pago único y el pago inicial del modelo B valen lo mismo
     * ($80.000 / $100.000): con el alias y sin modalidad elegida, el grupo de
     * la prueba de precios dice cuál es (el B no tiene pago único de lista). */
    $grupo = function_exists('wabot_ab_grupo') ? wabot_ab_grupo($conv, $cfg) : '';
    $unico = $n($v['sena_unico'] ?? '') ?: ($tipo === 'landing' ? 80000 : 100000);
    if ($grupo === 'b' || wabot_pagos_modalidad_de_conv($conv) === 'inicial') {
        $inicial = function_exists('wabot_ab_inicial') ? $n(wabot_ab_inicial($conv, function_exists('wabot_ab_cfg') ? wabot_ab_cfg($cfg, $conv) : $cfg, $tipo)) : 0;
        $out['inicial'] = $inicial > 0 ? $inicial : $unico;
    } else {
        $out['unico'] = $unico;
    }
    return $out;
}

/** ¿Dijo que pagó o mandó el comprobante? El detector del motor si está cargado; si no, lo mínimo. */
function wabot_pagos_texto_avisa($texto) {
    if (function_exists('wabot_dice_que_pago')) return wabot_dice_que_pago($texto);
    $t = mb_strtolower((string)$texto);
    return (bool)preg_match('/comprobante|transfer|pagu[eé]|abon[eé]|deposit[eé]|suscrib/u', $t);
}

/**
 * Los chats a los que se les mandó cómo pagar en las últimas WABOT_PAGOS_LINK_HORAS
 * y todavía no tienen el pago confirmado: [clave => candidato]. Lee solo los
 * archivos tocados en ese lapso (un link mandado deja el archivo guardado).
 * $convs (tests) reemplaza el disco: [clave => conv].
 */
function wabot_pagos_candidatos($ahora, $convs = null, $cfg = null) {
    $desde = (int)$ahora - WABOT_PAGOS_LINK_HORAS * 3600;
    if ($convs === null) {
        $convs = [];
        foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
            $clave = basename($f, '.json');
            if (stripos($clave, 'TEST') !== false) continue;
            if ((int)@filemtime($f) < $desde - 86400) continue;
            try { $convs[$clave] = wabot_conv_load($clave); } catch (\Throwable $e) { continue; }
        }
    }
    $out = [];
    foreach ($convs as $clave => $cv) {
        $c = wabot_pagos_candidato($cv, $ahora, $cfg);
        if ($c) $out[(string)$clave] = $c;
    }
    return $out;
}

/** Un chat como candidato del cruce, o null si no se le pasó cómo pagar hace poco (o ya pagó). */
function wabot_pagos_candidato(array $cv, $ahora, $cfg = null) {
    if (!empty($cv['pago_confirmado_ts'])) return null;
    $desde = (int)$ahora - WABOT_PAGOS_LINK_HORAS * 3600;
    $montos = [];
    $aliasTs = 0;
    $primerLink = 0;
    foreach ((array)($cv['transcript'] ?? []) as $fila) {
        if (!is_array($fila) || !in_array($fila['q'] ?? '', ['bot', 'humano'], true) || !is_string($fila['t'] ?? null)) continue;
        $ts = (int)($fila['ts'] ?? 0);
        if ($ts < $desde) continue;
        foreach (wabot_pagos_links_en($fila['t']) as $l) {
            if ($primerLink === 0 || $ts < $primerLink) $primerLink = $ts;
            if ($l['via'] === 'alias') { $aliasTs = max($aliasTs, $ts); continue; }
            $montos[] = ['monto' => $l['monto'], 'modalidad' => $l['modalidad'], 'ts' => $ts];
        }
    }
    if (!$montos && $aliasTs === 0) return null;
    // Con los datos para transferir, lo esperado es lo cotizado: la modalidad que eligió o, si no, todas.
    if ($aliasTs > 0) {
        $esperados = wabot_pagos_montos_esperados($cv, $cfg);
        $elegida = wabot_pagos_modalidad_de_conv($cv);
        if ($elegida !== '' && isset($esperados[$elegida])) $esperados = [$elegida => $esperados[$elegida]];
        foreach ($esperados as $modalidad => $monto) $montos[] = ['monto' => $monto, 'modalidad' => $modalidad, 'ts' => $aliasTs];
    }
    $avisado = (int)($cv['pago_avisado_ts'] ?? 0) > 0;
    if (!$avisado) {
        foreach ((array)($cv['transcript'] ?? []) as $fila) {
            if (!is_array($fila) || ($fila['q'] ?? '') !== 'cliente' || (int)($fila['ts'] ?? 0) < $primerLink) continue;
            if (wabot_pagos_texto_avisa((string)($fila['t'] ?? ''))) { $avisado = true; break; }
        }
    }
    return [
        'clave'    => (string)($cv['conversation_key'] ?? $cv['tel'] ?? ''),
        'nombre'   => function_exists('wabot_nombre_agenda') ? wabot_nombre_agenda($cv) : trim((string)($cv['nombre'] ?? '')),
        'negocio'  => trim((string)($cv['nombre_negocio'] ?? '')),
        'codigo'   => (string)($cv['codigo'] ?? ''),
        'tipo'     => (string)($cv['tipo'] ?? ''),
        'montos'   => $montos,
        'avisado'  => $avisado,
        'alias_ts' => $aliasTs,
    ];
}

/** mensual | anual | unico | inicial según lo que eligió en la charla ('unico' del bot = plan anual; 'propia' = pago único). */
function wabot_pagos_modalidad_de_conv(array $cv) {
    $m = (string)($cv['modalidad_elegida'] ?? '');
    /* En el grupo B (pago inicial + mensual, prueba de precios) «el mensual» es esa
     * modalidad: lo primero que paga es el pago inicial (2-nov, BLIZZ eligió «Plan
     * mensual» en el formulario viejo y el panel le proponía $20.000). */
    $cot = is_array($cv['comercial_cotizacion'] ?? null) ? $cv['comercial_cotizacion'] : [];
    if ($m === 'mensual' && (($cot['modelo'] ?? '') === 'b' || trim((string)($cot['inicial'] ?? '')) !== '')) return 'inicial';
    return ['mensual' => 'mensual', 'unico' => 'anual', 'propia' => 'unico', 'inicial' => 'inicial'][$m] ?? '';
}

/* ── El cruce ──────────────────────────────────────────────────────────── */

/**
 * A qué chat corresponde este pago. Devuelve
 *   ['estado' => 'confirmar', 'clave', 'modo' => referencia|monto_avisado, 'modalidad']
 *   ['estado' => 'sin_asignar', 'motivo' => sin_candidatos|ambiguo|sin_aviso, 'sugeridos' => [clave => modalidad]]
 */
function wabot_pagos_cruzar(array $pago, array $candidatos, $ahora = null) {
    // (a) La referencia con el código corto de la charla (GKY-<código>-…; GKY-PAGO-… es el genérico de antes).
    if (preg_match('/^GKY-([A-Z0-9]{1,12})-/i', $pago['referencia'] ?? '', $m) && strtoupper($m[1]) !== 'PAGO') {
        $clave = wabot_codigo_buscar($m[1]);
        if ($clave !== '' && wabot_conv_existe($clave)) {
            // La modalidad, la del link con ese mismo monto (si no hay, la de la charla al confirmar).
            $modalidad = '';
            foreach ((array)($candidatos[$clave]['montos'] ?? []) as $mm) {
                if ((int)$mm['monto'] === (int)$pago['monto'] && (string)$mm['modalidad'] !== '') { $modalidad = (string)$mm['modalidad']; break; }
            }
            return ['estado' => 'confirmar', 'clave' => $clave, 'modo' => 'referencia', 'modalidad' => $modalidad];
        }
    }
    // (b) Mismo monto que un link (o lo cotizado si le pasó el alias) de las últimas 72 h.
    $conMonto = [];
    foreach ($candidatos as $clave => $c) {
        foreach ((array)($c['montos'] ?? []) as $m) {
            if ((int)$m['monto'] !== (int)$pago['monto']) continue;
            // El link tiene que ser anterior al pago (con una hora de tolerancia por los relojes) y de las últimas 72 h.
            if ((int)$m['ts'] > (int)$pago['ts'] + 3600 || (int)$m['ts'] < (int)$pago['ts'] - WABOT_PAGOS_LINK_HORAS * 3600) continue;
            if ($pago['tipo'] === 'suscripcion' && $m['modalidad'] !== 'mensual' && $m['modalidad'] !== '') continue;
            $conMonto[(string)$clave] = (string)$m['modalidad'];
            break;
        }
    }
    if (!$conMonto) return ['estado' => 'sin_asignar', 'motivo' => 'sin_candidatos', 'sugeridos' => []];
    if (count($conMonto) > 1) {
        // Entre varios con el mismo monto, si uno solo avisó que pagó, es ese.
        $avisaron = array_filter(array_keys($conMonto), function ($k) use ($candidatos) { return !empty($candidatos[$k]['avisado']); });
        if (count($avisaron) === 1) {
            $clave = (string)reset($avisaron);
            return ['estado' => 'confirmar', 'clave' => $clave, 'modo' => 'monto_avisado', 'modalidad' => $conMonto[$clave]];
        }
        return ['estado' => 'sin_asignar', 'motivo' => 'ambiguo', 'sugeridos' => $conMonto];
    }
    $clave = (string)array_key_first($conMonto);
    if (!empty($candidatos[$clave]['avisado'])) {
        return ['estado' => 'confirmar', 'clave' => $clave, 'modo' => 'monto_avisado', 'modalidad' => $conMonto[$clave]];
    }
    return ['estado' => 'sin_asignar', 'motivo' => 'sin_aviso', 'sugeridos' => $conMonto];
}

/** La modalidad definitiva del pago: la suscripción es mensual; si no, la del link, la de la charla o '' . */
function wabot_pagos_modalidad($pago, $sugerida, array $conv) {
    if (($pago['tipo'] ?? '') === 'suscripcion') return 'mensual';
    $s = (string)$sugerida;
    if (in_array($s, ['mensual', 'anual', 'unico', 'inicial'], true)) return $s;
    return wabot_pagos_modalidad_de_conv($conv);
}

/* ── Firestore: el doc de `clientes` como lo deja "pasar a Cliente" ─────── */

function wabot_pagos_plan_label($tipo) {
    return ['landing' => 'Sitio profesional', 'ecommerce' => 'Ecommerce', 'elearning' => 'Plataforma de cursos', 'inmobiliaria' => 'Inmobiliaria'][(string)$tipo] ?? '';
}

/** Un timestamp para Firestore, marcado para que el codificador lo distinga de un número. */
function wabot_pagos_fs_ts($unix) { return ['_ts' => (int)$unix]; }

function wabot_pagos_fs_valor($x) {
    if (is_array($x) && array_keys($x) === ['_ts']) return ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z', (int)$x['_ts'])];
    if (is_array($x)) {
        if ($x === [] || array_keys($x) === range(0, count($x) - 1)) return ['arrayValue' => ['values' => array_map('wabot_pagos_fs_valor', $x)]];
        return ['mapValue' => ['fields' => array_map('wabot_pagos_fs_valor', $x)]];
    }
    return wabot_presentar_fs_valor($x);
}

/**
 * Los campos que escribe "pasar a Cliente" (admin/dashboard.js, setStatus) según
 * la modalidad, más el rastro del pago. Puro: no toca la red.
 *   anual  → modalidad 'unico' del admin: valorTotal (el precio por año), abono (la seña), senaAt, cobros[+seña]
 *   unico  → modalidad 'propia': valorTotal (el pago único), abono, senaAt, cobros[+seña]
 *   mensual → montoMensual, estadoSuscripcion activa, suscripcionDesde hoy, preapprovalId, pagaPorFuera
 *   inicial → el modelo B (31-oct): mensual con primer pago; la mensualidad arranca al mes
 */
function wabot_pagos_firestore_campos(array $conv, array $pago, $modalidad, $cfg, $ahora = null) {
    $ahora = $ahora ?? time();
    $monto = (int)($pago['monto'] ?? 0);
    $tipo = (string)($conv['tipo'] ?? '');
    $v = ($tipo !== '' && is_array($cfg) && isset($cfg['tipos'][$tipo]) && function_exists('wabot_precio_vigente')) ? wabot_precio_vigente($conv, $cfg, $tipo) : [];
    $n = function ($s) { return function_exists('wabot_monto_a_numero') ? (int)wabot_monto_a_numero($s) : (int)preg_replace('/\D/', '', (string)$s); };
    $campos = [
        'estadoCliente'  => 'cliente',
        'clienteDesdeAt' => wabot_pagos_fs_ts($ahora),
        'updatedAt'      => wabot_pagos_fs_ts($ahora),
        'pagoBot'        => [
            'id' => (string)($pago['id'] ?? ''), 'monto' => $monto, 'tipo' => (string)($pago['tipo'] ?? ''),
            'modalidad' => (string)$modalidad, 'at' => wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora)),
            'modo' => (string)($pago['modo'] ?? ''),
        ],
    ];
    if (wabot_pagos_plan_label($tipo) !== '') $campos['planLabel'] = wabot_pagos_plan_label($tipo);
    $cobro = ['at' => wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora)), 'monto' => $monto, 'tipo' => 'sena'];
    if ($modalidad === 'anual' || $modalidad === 'unico') {
        $campos['modalidad'] = $modalidad === 'anual' ? 'unico' : 'propia';
        $precio = $modalidad === 'anual' ? $n($v['precio'] ?? '') : $n(function_exists('wabot_precio_unico_vigente') && $v ? wabot_precio_unico_vigente($v, $cfg) : ($v['precio_unico'] ?? ''));
        if ($precio > 0) $campos['valorTotal'] = $precio;
        $campos['abono'] = $monto;
        $campos['senaAt'] = wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora));
        $campos['cobros'] = [$cobro];   // se suma a los que ya tenga el doc (wabot_pagos_fs_cliente_escribir)
    } elseif ($modalidad === 'inicial') {
        $campos['modalidad'] = 'mensual';
        $campos['primerPago'] = $monto;
        $campos['primerPagoAt'] = wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora));
        $campos['valorTotal'] = $monto;
        $campos['abono'] = $monto;
        if ($n($v['mensualidad'] ?? '') > 0) $campos['montoMensual'] = $n($v['mensualidad']);
        $campos['estadoSuscripcion'] = 'pendiente';
        $campos['suscripcionDesde'] = wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora) + 30 * 86400);
        $campos['cobros'] = [['tipo' => 'inicial'] + $cobro];
    } else {
        $campos['modalidad'] = 'mensual';
        $campos['montoMensual'] = $n($v['mensualidad'] ?? '') > 0 ? $n($v['mensualidad']) : $monto;
        $campos['estadoSuscripcion'] = 'activa';
        $campos['suscripcionDesde'] = wabot_pagos_fs_ts((int)($pago['ts'] ?? $ahora));
        if (($pago['tipo'] ?? '') === 'suscripcion' && (string)($pago['suscripcion'] ?? '') !== '') {
            $campos['preapprovalId'] = (string)$pago['suscripcion'];
            $campos['pagaPorFuera'] = false;
        } else {
            // Pagó la mensualidad por transferencia: el admin lo sigue en "Pagan por afuera" (16-oct).
            $campos['pagaPorFuera'] = true;
            $campos['diaCobro'] = (int)gmdate('j', (int)($pago['ts'] ?? $ahora) - 3 * 3600);
        }
        if ((string)($pago['email'] ?? '') !== '') $campos['emailMp'] = (string)$pago['email'];
    }
    return $campos;
}

function wabot_pagos_fs_url($ruta, $query = '') {
    $sa = wabot_push_cuenta();
    if (!$sa) throw new RuntimeException('Falta config/service-account.json.');
    return 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents/' . $ruta . ($query !== '' ? '?' . $query : '');
}

/** Una llamada REST a Firestore con la cuenta de servicio: [http, json]. */
function wabot_pagos_fs_llamar($metodo, $url, $cuerpo = null) {
    $ch = curl_init($url);
    $opciones = [
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_presentar_fs_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 25,
    ];
    if ($cuerpo !== null) $opciones[CURLOPT_POSTFIELDS] = json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
    curl_setopt_array($ch, $opciones);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [(int)$http, json_decode((string)$res, true)];
}

/** Lee un doc: [http, campos ya decodificados] (404 → [404, null]). */
function wabot_pagos_fs_leer_doc($ruta) {
    [$http, $j] = wabot_pagos_fs_llamar('GET', wabot_pagos_fs_url($ruta));
    if ($http !== 200 || !is_array($j)) return [$http, null];
    return [200, array_map('wabot_presentar_fs_leer', (array)($j['fields'] ?? []))];
}

/**
 * Escribe el pago en `clientes`: si la charla ya tiene su doc (cliente_id, lo
 * deja presentar la demo) lo completa; si no existe pero sí el boceto
 * (lead_doc en `propuestas`), lo pasa a Clientes como hace el admin (copia
 * entera en propuestaSnapshot y se borra el boceto); si no hay nada, crea el
 * doc con lo que sabe la charla. Devuelve ['ok', 'id', 'creado', 'error'].
 * $leer / $escribir / $borrar (tests) reemplazan la red.
 */
function wabot_pagos_fs_cliente_escribir(array $conv, array $campos, $leer = null, $escribir = null, $borrar = null) {
    $clave = (string)($conv['conversation_key'] ?? $conv['tel'] ?? '');
    if ($leer === null && (!empty($GLOBALS['WABOT_TEST_SIN_RED']) || stripos($clave, 'TEST') !== false)) {
        return ['ok' => false, 'id' => (string)($conv['cliente_id'] ?? ''), 'creado' => false, 'error' => 'sin_red'];
    }
    $leer = $leer ?? 'wabot_pagos_fs_leer_doc';
    $escribir = $escribir ?? function ($ruta, array $campos, $mascara, $crear) {
        $query = implode('&', array_map(function ($k) { return 'updateMask.fieldPaths=' . rawurlencode($k); }, $mascara))
               . ($crear ? '&currentDocument.exists=false' : '&currentDocument.exists=true');
        [$http] = wabot_pagos_fs_llamar('PATCH', wabot_pagos_fs_url($ruta, $query), ['fields' => array_map('wabot_pagos_fs_valor', $campos)]);
        return $http;
    };
    $borrar = $borrar ?? function ($ruta) { [$http] = wabot_pagos_fs_llamar('DELETE', wabot_pagos_fs_url($ruta)); return $http; };

    $id = trim((string)($conv['cliente_id'] ?? ''));
    if ($id !== '') {
        [$http, $doc] = $leer('clientes/' . rawurlencode($id));
        if ($http === 200 && is_array($doc)) {
            if (isset($campos['cobros'])) {
                $previos = array_values(array_filter((array)($doc['cobros'] ?? []), 'is_array'));
                $campos['cobros'] = array_merge(array_map('wabot_pagos_fs_cobro_previo', $previos), $campos['cobros']);
            }
            // Lo que el admin ya tiene no se pisa: el plan, y la seña si ya la registró.
            if (isset($campos['planLabel']) && trim((string)($doc['planLabel'] ?? '')) !== '') unset($campos['planLabel']);
            /* Pablo ya lo pasó a Cliente con su cobro: la plata no se vuelve a
             * escribir (el cobro quedaría dos veces en Calendario/Ingresos). */
            if (wabot_pagos_fs_doc_con_pago($doc)) {
                foreach (['clienteDesdeAt', 'modalidad', 'valorTotal', 'abono', 'senaAt', 'cobros', 'primerPago', 'primerPagoAt', 'montoMensual',
                          'estadoSuscripcion', 'suscripcionDesde', 'pagaPorFuera', 'diaCobro', 'estadoCliente'] as $k) unset($campos[$k]);
                if (trim((string)($doc['preapprovalId'] ?? '')) !== '') unset($campos['preapprovalId']);
            }
            $http = $escribir('clientes/' . rawurlencode($id), $campos, array_keys($campos), false);
            return ['ok' => $http >= 200 && $http < 300, 'id' => $id, 'creado' => false, 'error' => $http >= 200 && $http < 300 ? '' : 'http_' . $http];
        }
        if ($http !== 404) return ['ok' => false, 'id' => $id, 'creado' => false, 'error' => 'leer_http_' . $http];
    }

    // Sin doc de cliente: desde el boceto si existe, si no con lo de la charla.
    $base = wabot_pagos_fs_cliente_base($conv);
    $propuesta = null;
    $rutaPropuesta = '';
    $leadDoc = trim((string)($conv['lead_doc'] ?? ''));
    if ($leadDoc !== '' && preg_match('~propuestas/([A-Za-z0-9_-]+)$~', $leadDoc, $m)) {
        $rutaPropuesta = 'propuestas/' . $m[1];
        [$http, $propuesta] = $leer($rutaPropuesta);
        if ($http !== 200) $propuesta = null;
    }
    if (is_array($propuesta)) {
        unset($propuesta['autoPresentada']);
        $base['nombre'] = trim((string)($propuesta['nombre'] ?? $propuesta['contacto_nombre'] ?? $propuesta['nombre_negocio'] ?? '')) ?: $base['nombre'];
        $base['proyecto'] = trim((string)($propuesta['nombre_negocio'] ?? $propuesta['rubro'] ?? '')) ?: $base['proyecto'];
        $base['telefono'] = trim((string)($propuesta['telefono'] ?? $propuesta['contacto_cel'] ?? '')) ?: $base['telefono'];
        $base['email'] = (string)($propuesta['email'] ?? '');
        $base['propuestaSnapshot'] = $propuesta;
        $base['propuestaId'] = $m[1];
        $base['propuestaFecha'] = (string)($propuesta['fecha'] ?? '');
        $base['contactoNombre'] = (string)($propuesta['nombre'] ?? $propuesta['contacto_nombre'] ?? '');
        $base['tipoDetectado'] = (string)($propuesta['tipoDetectado'] ?? '');
        $base['tipoDetectadoLabel'] = (string)($propuesta['tipoDetectadoLabel'] ?? '');
        $base['rubro'] = (string)($propuesta['rubro'] ?? '');
        $base['instagram'] = (string)($propuesta['instagram'] ?? '');
        $base['logoUrl'] = (string)($propuesta['logoUrl'] ?? '');
        if (!isset($campos['planLabel']) && trim((string)($propuesta['tipo_web'] ?? '')) !== '') $base['planLabel'] = (string)$propuesta['tipo_web'];
    }
    if ($id === '') $id = wabot_presentar_id_nuevo();
    $doc = array_merge($base, $campos);
    $http = $escribir('clientes/' . rawurlencode($id), $doc, array_keys($doc), true);
    if ($http < 200 || $http >= 300) return ['ok' => false, 'id' => $id, 'creado' => false, 'error' => 'crear_http_' . $http];
    if (is_array($propuesta) && $rutaPropuesta !== '') {
        // Igual que el admin al pasar a Seguimiento: el boceto deja de estar en Bocetos.
        $hb = $borrar($rutaPropuesta);
        if ($hb < 200 || $hb >= 300) wabot_log('error', ['donde' => 'pagos_borrar_propuesta', 'ruta' => $rutaPropuesta, 'http' => $hb]);
    }
    return ['ok' => true, 'id' => $id, 'creado' => true, 'error' => ''];
}

/** ¿El doc de clientes ya tiene un pago cargado (lo pasó Pablo a Cliente a mano)? */
function wabot_pagos_fs_doc_con_pago(array $doc) {
    if ((string)($doc['estadoCliente'] ?? '') !== 'cliente') return false;
    return (float)($doc['abono'] ?? 0) > 0 || (float)($doc['primerPago'] ?? 0) > 0
        || (bool)array_filter((array)($doc['cobros'] ?? []), 'is_array');
}

/** Un cobro que ya estaba en el doc, vuelto a codificar (la fecha vino como string ISO). */
function wabot_pagos_fs_cobro_previo(array $c) {
    $at = $c['at'] ?? null;
    if (is_string($at) && strtotime($at)) $c['at'] = wabot_pagos_fs_ts(strtotime($at));
    return $c;
}

/** El doc de `clientes` mínimo con lo que sabe la charla (como el que arma el admin desde un boceto). */
function wabot_pagos_fs_cliente_base(array $conv) {
    $tel = (string)($conv['telefono_wsp'] ?? '') ?: (string)($conv['channel_user_id'] ?? $conv['tel'] ?? '');
    return [
        'nombre'            => trim((string)($conv['nombre'] ?? '')) ?: trim((string)($conv['nombre_negocio'] ?? '')),
        'proyecto'          => trim((string)($conv['nombre_negocio'] ?? '')) ?: (function_exists('wabot_tipo_label') ? '' : ''),
        'telefono'          => ctype_digit($tel) ? $tel : '',
        'estadoCliente'     => 'seguimiento1',
        'planLabel'         => wabot_pagos_plan_label((string)($conv['tipo'] ?? '')),
        'modalidad'         => '',
        'primerPago'        => 0,
        'primerPagoAt'      => null,
        'estadoSuscripcion' => 'pendiente',
        'suscripcionDesde'  => null,
        'preapprovalId'     => '',
        'valorTotal'        => 0,
        'abono'             => 0,
        'notas'             => '',
        'origenBot'         => 'pago-detectado',
        'conversationKey'   => (string)($conv['conversation_key'] ?? $conv['tel'] ?? ''),
        'createdAt'         => wabot_pagos_fs_ts(time()),
    ];
}

/* ── La confirmación ───────────────────────────────────────────────────── */

/** Texto corto de un monto: 30000 → "$30.000". */
function wabot_pagos_monto_texto($monto) {
    return '$' . number_format((int)$monto, 0, ',', '.');
}

function wabot_pagos_modalidad_label($m) {
    return ['mensual' => 'plan mensual', 'anual' => 'plan anual', 'unico' => 'pago único', 'inicial' => 'pago inicial + mensual'][(string)$m] ?? 'sin modalidad';
}

/**
 * Da por confirmado el pago en la charla y en todo lo demás. $pago trae id,
 * monto, ts, tipo (suscripcion|checkout|transferencia|transferencia_mp|manual),
 * modo (referencia|monto_avisado|manual|asignado) y, si se sabe, suscripcion.
 * $deps (tests): 'ahora', 'firestore' => fn($conv, $campos), 'avisar' =>
 * fn($titulo, $cuerpo), 'enviar' => fn(&$conv, $texto) para lo que el bot dice.
 */
function wabot_pago_confirmar(&$conv, array $pago, $modalidad, $cfg, array $deps = []) {
    $ahora = (int)($deps['ahora'] ?? time());
    if (!empty($conv['pago_confirmado_ts']) && empty($deps['forzar'])) {
        return ['ok' => false, 'motivo' => 'ya_confirmado'];
    }
    $modalidad = wabot_pagos_modalidad($pago, $modalidad, $conv);
    $conv['pago_confirmado_ts'] = $ahora;
    $conv['pago_id'] = (string)($pago['id'] ?? '');
    $conv['pago_monto'] = (int)($pago['monto'] ?? 0);
    $conv['pago_modalidad'] = $modalidad;
    $conv['pago_tipo'] = (string)($pago['tipo'] ?? '');
    $conv['pago_modo'] = (string)($pago['modo'] ?? '');
    $conv['pago_ts'] = (int)($pago['ts'] ?? $ahora);
    $conv['pagos'] = array_merge((array)($conv['pagos'] ?? []), [[
        'id' => $conv['pago_id'], 'monto' => $conv['pago_monto'], 'ts' => $conv['pago_ts'], 'tipo' => $conv['pago_tipo'],
        'modalidad' => $modalidad, 'modo' => $conv['pago_modo'], 'confirmado_ts' => $ahora,
    ]]);
    if ((string)($conv['modalidad_elegida'] ?? '') === '' && $modalidad !== '') {
        $conv['modalidad_elegida'] = ['mensual' => 'mensual', 'anual' => 'unico', 'unico' => 'propia', 'inicial' => 'inicial'][$modalidad];
    }
    /* Qué hace el bot después (Pablo, 1-nov a la noche: "que deje de contestar
     * cuando reciba el pago, que mande el mensaje de genial recibido, ahora
     * sigue la conversación Pablo desde [número]"): de fábrica manda ESE
     * mensaje y se calla en el chat (control_manual, como cuando escribe Pablo).
     * Solo si en Ajustes está prendido "Pedir por el chat los datos para la
     * web" (onboarding_activo), en vez de callarse arranca el onboarding. Los
     * seguimientos de venta ya no van. */
    $onboarding = function_exists('wabot_onboarding_iniciar') && is_array($cfg) && !empty($cfg['onboarding_activo']);
    /* Si Pablo ya le escribió después del pago ("Genial, recibido, te escribo
     * desde otro número", Neuro Test, 1-nov), ese chat ya lo derivó él: el
     * onboarding tampoco arranca, aunque esté prendido. Queda como de fábrica. */
    if ($onboarding && (!empty($conv['control_manual']) || wabot_pagos_pablo_escribio_despues($conv))) {
        $onboarding = false;
        wabot_log('onboarding_omitido', ['clave' => $conv['conversation_key'] ?? '', 'motivo' => 'pablo_escribio']);
    }
    if ($onboarding) {
        $conv['control_manual'] = false;
        $conv['bot_off'] = false;
        $conv['pausado_hasta'] = 0;
    }
    $conv['handoff_pendiente'] = false;
    $conv['seguimiento_bloqueado'] = true;
    if (function_exists('wabot_evento_sesion')) wabot_evento_sesion($conv, 'pago_confirmado', ['monto' => $conv['pago_monto'], 'modalidad' => $modalidad, 'modo' => $conv['pago_modo']]);

    $resultado = ['ok' => true, 'modalidad' => $modalidad, 'firestore' => null, 'capi' => '', 'mensajes' => []];

    // Firestore: el doc de clientes como lo deja "pasar a Cliente".
    $campos = wabot_pagos_firestore_campos($conv, $pago + ['modo' => $conv['pago_modo']], $modalidad, $cfg, $ahora);
    $fs = $deps['firestore'] ?? 'wabot_pagos_fs_cliente_escribir';
    try {
        $r = $fs($conv, $campos);
        $resultado['firestore'] = $r;
        if (!empty($r['ok']) && !empty($r['id'])) $conv['cliente_id'] = (string)$r['id'];
        $conv['pago_firestore'] = !empty($r['ok']) ? 'ok' : (string)($r['error'] ?? 'error');
    } catch (\Throwable $e) {
        $conv['pago_firestore'] = 'error';
        $resultado['firestore'] = ['ok' => false, 'error' => $e->getMessage()];
        wabot_log('error', ['donde' => 'pago_firestore', 'clave' => $conv['conversation_key'] ?? '', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
    }

    // Meta: la compra, si el chat vino de un anuncio.
    $resultado['capi'] = function_exists('wabot_capi_compra') ? wabot_capi_compra($conv, $conv['pago_monto'], $cfg) : 'sin_funcion';

    if ($onboarding) {
        // Con el onboarding prendido en Ajustes: el bot pide lo que falta (onboarding.php).
        $resultado['mensajes'] = (array)wabot_onboarding_iniciar($conv, $cfg, $ahora, $deps);
    } else {
        $resultado['mensajes'] = wabot_pago_recibido_enviar($conv, $cfg, $ahora, $deps);
    }

    wabot_log('pago_confirmado', ['clave' => $conv['conversation_key'] ?? '', 'pago_id' => $conv['pago_id'], 'monto' => $conv['pago_monto'],
        'modalidad' => $modalidad, 'tipo' => $conv['pago_tipo'], 'modo' => $conv['pago_modo'],
        'firestore' => $conv['pago_firestore'], 'capi' => $resultado['capi'], 'cliente_id' => (string)($conv['cliente_id'] ?? '')]);

    $quien = function_exists('wabot_nombre_agenda') ? wabot_nombre_agenda($conv) : trim((string)($conv['nombre'] ?? ''));
    if ($quien === '') $quien = (string)($conv['nombre_negocio'] ?? '') ?: (string)($conv['tel'] ?? '');
    $clave = (string)($conv['conversation_key'] ?? $conv['tel'] ?? '');
    $avisar = $deps['avisar'] ?? function ($t, $c) use ($clave) {
        return wabot_push_enviar($t, $c, ['link' => 'https://www.gokywebs.com/wabot/admin.php?tab=conversaciones&ver=' . rawurlencode($clave), 'tel' => $clave]);
    };
    $como = ['suscripcion' => 'suscripción de MP', 'checkout' => 'link de MP', 'transferencia' => 'transferencia', 'transferencia_mp' => 'transferencia desde MP', 'manual' => 'confirmado a mano'][$conv['pago_tipo']] ?? $conv['pago_tipo'];
    $cuerpo = 'Pagó ' . wabot_pagos_monto_texto($conv['pago_monto']) . ' (' . wabot_pagos_modalidad_label($modalidad) . ', ' . $como . ').'
        . ($conv['pago_firestore'] === 'ok' ? ' Ya figura como cliente en el admin.' : ' OJO: no se pudo pasar a Cliente en el admin; hacelo a mano.')
        . ($onboarding
            ? ($resultado['mensajes'] ? ' El bot ya le pidió lo que falta.' : '')
            : ($resultado['mensajes'] ? ' Le mandé el «Genial, recibido» y el bot se calló: seguís vos desde tu número.'
                : (($conv['pago_recibido_omitido'] ?? '') === 'pablo_escribio' ? ' No le mandé el «Genial, recibido» porque ya le escribiste vos. El bot ya no contesta en ese chat.' : ' No le pude mandar el «Genial, recibido» (ventana de WhatsApp cerrada): escribile vos. El bot ya no contesta en ese chat.')));
    /* Confirmado a mano desde el panel y todo salió bien: Pablo ya lo sabe, no se le avisa
     * (2-nov: solo lo que pide algo de él). Lo que entra solo por MP, o lo que falló, sí. */
    $sabido = ($conv['pago_tipo'] ?? '') === 'manual' && $conv['pago_firestore'] === 'ok';
    if (!$sabido) {
        try { $avisar('Pago confirmado: ' . $quien, $cuerpo); } catch (\Throwable $e) { /* un aviso que falla no frena la confirmación */ }
    }
    return $resultado;
}

/**
 * ¿Pablo le escribió a este chat después del pago (pago_ts)? Entonces ya lo atendió él.
 * Con «Confirmar pago» a mano el pago tiene la hora del clic, así que vale también lo
 * que escribió en las 2 h anteriores; y su «Genial, recibido… otro número» de las
 * últimas 24 h, siempre (2-nov, Todovinilosmr: lo mandó él a las 13:21, confirmó a
 * las 13:23 y el bot lo repitió).
 */
function wabot_pagos_pablo_escribio_despues($conv) {
    $pagoTs = (int)($conv['pago_ts'] ?? 0);
    if ($pagoTs <= 0) return false;
    $desde = ($conv['pago_tipo'] ?? '') === 'manual' ? $pagoTs - 2 * 3600 : $pagoTs;
    foreach ((array)($conv['transcript'] ?? []) as $fila) {
        if (!is_array($fila) || ($fila['q'] ?? '') !== 'humano') continue;
        $ts = (int)($fila['ts'] ?? 0);
        if ($ts >= $desde) return true;
        $t = function_exists('wabot_normalizar_frase') ? wabot_normalizar_frase((string)($fila['t'] ?? '')) : mb_strtolower((string)($fila['t'] ?? ''));
        if ($ts >= $pagoTs - 24 * 3600 && preg_match('/\b(otro numero|1125068578)\b|^genial,? recibido/u', $t)) return true;
    }
    return false;
}

/**
 * El mensaje de Pablo al recibir el pago («Genial, recibido. Ahora te escribo
 * desde otro número…», textos.php `pago_recibido`), y el bot se calla en ese
 * chat: lo sigue Pablo desde su otro número. Devuelve lo que salió ([] si la
 * ventana de 24 h de WhatsApp está cerrada o el envío falló).
 */
function wabot_pago_recibido_enviar(&$conv, $cfg, $ahora, array $deps = []) {
    $yaAtendido = !empty($conv['control_manual']) || !empty($conv['pago_recibido_ts']) || wabot_pagos_pablo_escribio_despues($conv);
    // Como cuando escribe Pablo: el bot no contesta más en este chat.
    if (function_exists('wabot_conv_tomar_control')) wabot_conv_tomar_control($conv);
    else { $conv['control_manual'] = true; $conv['bot_off'] = true; }
    $texto = trim((string)(is_array($cfg) ? ($cfg['pago_recibido'] ?? '') : ''));
    if ($texto === '') return [];
    /* Pablo ya le escribió después del pago (1-nov, Neuro Test: el bot mandó la
     * apertura justo después de su «te escribo desde otro número»): ya lo
     * atendió él, el mensaje sobra. */
    if ($yaAtendido) {
        $conv['pago_recibido_omitido'] = 'pablo_escribio';
        wabot_log('pago_recibido_omitido', ['clave' => $conv['conversation_key'] ?? '', 'motivo' => 'pablo_escribio']);
        return [];
    }
    if (function_exists('wabot_personalizar')) $texto = wabot_personalizar($texto, $conv);
    $ventana = isset($deps['ventana_abierta']) ? (bool)$deps['ventana_abierta'] : (wabot_ventana_restante($conv, $ahora) > 0);
    if (!$ventana) {
        wabot_log('pago_recibido_sin_ventana', ['clave' => $conv['conversation_key'] ?? '']);
        return [];
    }
    $enviar = $deps['enviar'] ?? function (&$c, $t) { return wabot_enviar($c, $t); };
    if (!$enviar($conv, $texto)) return [];
    wabot_conv_transcript($conv, 'bot', $texto);
    $conv['pago_recibido_ts'] = (int)$ahora;
    return [$texto];
}

/* ── La corrida del cron ───────────────────────────────────────────────── */

/**
 * Busca los pagos nuevos en Mercado Pago, cruza cada uno con los chats y
 * confirma los que se pueden; lo demás queda en "sin asignar". Vuelve a
 * intentar los sin asignar de las últimas 72 h (el comprobante llega después).
 * $deps (tests): 'mp' => callable, 'candidatos' => array, 'cargar' => fn($clave),
 * 'guardar' => fn($conv), más los de wabot_pago_confirmar.
 */
function wabot_pagos_correr($cfg, $ahora = null, array $deps = []) {
    $ahora = (int)($ahora ?? time());
    $res = ['nuevos' => 0, 'confirmados' => 0, 'sin_asignar' => 0, 'ignorados' => 0, 'renovaciones' => 0, 'reintentados' => 0, 'detalle' => []];
    if (is_array($cfg) && array_key_exists('pagos_auto', $cfg) && empty($cfg['pagos_auto'])) return $res + ['apagado' => true];
    $mp = $deps['mp'] ?? null;
    if ($mp === null) {
        if (wabot_pagos_mp_token() === '') return $res + ['apagado' => 'sin_token'];
        $mp = 'wabot_pagos_mp';
    }
    // Una corrida por vez, y el panel (asignar/ignorar) espera a que termine: todos reescriben pagos-mp.json.
    $lockCorrida = isset($deps['mp']) ? true : wabot_lock_tomar('pagosmp');
    if (!$lockCorrida) return $res + ['ocupado' => true];
    try {
        return wabot_pagos_correr_bloqueado($cfg, $ahora, $deps, $mp, $res);
    } finally {
        if ($lockCorrida !== true) wabot_lock_soltar($lockCorrida);
    }
}

function wabot_pagos_correr_bloqueado($cfg, $ahora, array $deps, $mp, array $res) {
    $estado = wabot_pagos_estado();
    try {
        if ($estado['yo'] === '') $estado['yo'] = wabot_pagos_mp_yo($mp);
        $pagos = wabot_pagos_buscar($mp, $estado['yo'], $ahora - WABOT_PAGOS_DIAS * 86400);
    } catch (\Throwable $e) {
        wabot_log('error', ['donde' => 'pagos_mp', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        $estado['error'] = mb_substr($e->getMessage(), 0, 200);
        /* corrida_ts no se toca: si la primera corrida falla, la siguiente
         * tiene que seguir siendo "la primera" (solo anota lo que ya estaba). */
        $estado['error_ts'] = $ahora;
        wabot_pagos_guardar($estado);
        return $res + ['error' => $e->getMessage()];
    }
    $estado['error'] = '';

    /* La primera corrida (sin estado) solo anota lo que ya estaba: esos pagos de
     * los últimos días Pablo ya los atendió a mano, y confirmarlos ahora le
     * escribiría "¡Genial, ya me llegó el pago!" a gente que ya recibió eso
     * desde su otro número. Desde acá, solo lo nuevo. */
    if (!$estado['pagos'] && $estado['corrida_ts'] === 0) {
        foreach ($pagos as $p) $estado['pagos'][$p['id']] = $p + ['visto_ts' => $ahora, 'estado' => 'anterior'];
        $estado['corrida_ts'] = $ahora;
        wabot_pagos_guardar($estado);
        wabot_log('pagos_primera_corrida', ['anteriores' => count($pagos)]);
        return $res + ['primera_corrida' => true, 'anteriores' => count($pagos)];
    }

    $candidatos = null;
    $buscarCandidatos = function () use (&$candidatos, $deps, $ahora, $cfg) {
        if ($candidatos === null) $candidatos = $deps['candidatos'] ?? wabot_pagos_candidatos($ahora, null, $cfg);
        return $candidatos;
    };
    $cargar = $deps['cargar'] ?? 'wabot_conv_load';
    $guardar = $deps['guardar'] ?? 'wabot_conv_save';

    $procesar = function (array $fila) use (&$res, &$candidatos, $buscarCandidatos, $cargar, $guardar, $cfg, $deps, $ahora) {
        $cruce = wabot_pagos_cruzar($fila, $buscarCandidatos(), $ahora);
        if ($cruce['estado'] !== 'confirmar') {
            $fila['estado'] = 'sin_asignar';
            $fila['motivo'] = $cruce['motivo'];
            $fila['sugeridos'] = $cruce['sugeridos'];
            return $fila;
        }
        $clave = $cruce['clave'];
        $lock = isset($deps['cargar']) ? true : wabot_lock_tomar($clave);
        if (!$lock) { $fila['estado'] = 'sin_asignar'; $fila['motivo'] = 'ocupado'; $fila['sugeridos'] = [$clave => $cruce['modalidad']]; return $fila; }
        try {
            $conv = $cargar($clave);
            if (!empty($conv['pago_confirmado_ts'])) {
                unset($candidatos[$clave]);
                /* Cruzado solo por el monto, puede ser de otro chat que recibió el
                 * mismo link: lo decide Pablo desde la pestaña Clientes. */
                if ($cruce['modo'] !== 'referencia') {
                    $fila['estado'] = 'sin_asignar';
                    $fila['motivo'] = 'ya_pago';
                    $fila['sugeridos'] = [];
                    return $fila;
                }
                // Ya pagó antes (otro pago del mismo cliente, con su referencia): se anota como cobro extra, sin volver a confirmar.
                $fila['estado'] = 'extra';
                $fila['clave'] = $clave;
                $conv['pagos'] = array_merge((array)($conv['pagos'] ?? []), [['id' => $fila['id'], 'monto' => $fila['monto'], 'ts' => $fila['ts'], 'tipo' => $fila['tipo'], 'modo' => $cruce['modo'], 'confirmado_ts' => $ahora]]);
                $guardar($conv);
                return $fila;
            }
            $r = wabot_pago_confirmar($conv, $fila + ['modo' => $cruce['modo']], $cruce['modalidad'], $cfg, $deps);
            $guardar($conv);
            // Ya no es candidato: el próximo pago con el mismo monto no puede caer acá.
            unset($candidatos[$clave]);
            $fila['estado'] = 'confirmado';
            $fila['clave'] = $clave;
            $fila['modo'] = $cruce['modo'];
            $fila['modalidad'] = (string)($r['modalidad'] ?? '');
            $fila['confirmado_ts'] = $ahora;
            $res['confirmados']++;
        } finally {
            if ($lock !== true) wabot_lock_soltar($lock);
        }
        return $fila;
    };

    foreach ($pagos as $p) {
        if (isset($estado['pagos'][$p['id']])) continue;
        $res['nuevos']++;
        $fila = $p + ['visto_ts' => $ahora];
        $deCliente = $estado['emails_cliente'][wabot_pagos_email_clave($p['email'] ?? '')] ?? null;
        if ($p['tipo'] === 'propio' || $p['tipo'] === 'otro') {
            $fila['estado'] = 'ignorado';
            $res['ignorados']++;
        } elseif ($deCliente) {
            // De un cliente que Pablo ya asignó antes desde este mail: no es una venta nueva.
            $fila = wabot_pagos_marcar_cliente($fila, $deCliente, $ahora, 'auto');
            $res['de_clientes'] = ($res['de_clientes'] ?? 0) + 1;
        } elseif ($p['tipo'] === 'suscripcion' && $p['cuota'] > 1) {
            // Una renovación: la factura la hace facturar-cobros.php; el admin ya lo tiene como cliente.
            $fila['estado'] = 'renovacion';
            $res['renovaciones']++;
        } else {
            $fila = wabot_pagos_procesar_seguro($procesar, $fila);
            if ($fila['estado'] === 'sin_asignar') $res['sin_asignar']++;
        }
        $estado['pagos'][$p['id']] = $fila;
        // Guardado pago por pago: si algo se cae después, lo confirmado ya no vuelve como "sin asignar".
        if (in_array($fila['estado'], ['confirmado', 'extra', 'error'], true)) wabot_pagos_guardar($estado);
        $res['detalle'][] = ['id' => $p['id'], 'monto' => $p['monto'], 'tipo' => $p['tipo'], 'estado' => $fila['estado'], 'clave' => $fila['clave'] ?? ''];
    }
    // Los que quedaron sin asignar hace poco: quizás ahora el cliente ya avisó.
    foreach ($estado['pagos'] as $id => $fila) {
        if (($fila['estado'] ?? '') !== 'sin_asignar' || ($fila['motivo'] ?? '') === 'ignorado_por_pablo') continue;
        if ((int)($fila['ts'] ?? 0) < $ahora - WABOT_PAGOS_LINK_HORAS * 3600 || (int)($fila['visto_ts'] ?? 0) === $ahora) continue;
        $nueva = wabot_pagos_procesar_seguro($procesar, $fila);
        $res['reintentados']++;
        if ($nueva['estado'] !== 'sin_asignar') $res['detalle'][] = ['id' => $id, 'monto' => $fila['monto'], 'tipo' => $fila['tipo'], 'estado' => $nueva['estado'], 'clave' => $nueva['clave'] ?? ''];
        $estado['pagos'][$id] = $nueva;
        if (in_array($nueva['estado'], ['confirmado', 'extra', 'error'], true)) wabot_pagos_guardar($estado);
    }
    // Lo viejo se olvida.
    foreach ($estado['pagos'] as $id => $fila) {
        if ((int)($fila['ts'] ?? 0) < $ahora - WABOT_PAGOS_RECORDAR_DIAS * 86400) unset($estado['pagos'][$id]);
    }
    $estado['corrida_ts'] = $ahora;
    wabot_pagos_guardar($estado);
    if ($res['confirmados'] || $res['sin_asignar']) wabot_log('pagos_corrida', ['confirmados' => $res['confirmados'], 'sin_asignar' => $res['sin_asignar'], 'nuevos' => $res['nuevos']]);
    return $res;
}

/**
 * Un pago que tira una excepción a mitad de la confirmación no corta la
 * corrida ni vuelve a intentarse solo (el mensaje al cliente pudo haber
 * salido): queda en "error" en la pestaña Clientes y se le avisa a Pablo.
 */
function wabot_pagos_procesar_seguro(callable $procesar, array $fila) {
    try {
        return $procesar($fila);
    } catch (\Throwable $e) {
        wabot_log('error', ['donde' => 'pagos_confirmar', 'pago_id' => $fila['id'] ?? '', 'msg' => mb_substr($e->getMessage(), 0, 200)]);
        $fila['estado'] = 'error';
        $fila['motivo'] = mb_substr($e->getMessage(), 0, 120);
        if (function_exists('wabot_push_enviar')) {
            try { wabot_push_enviar('Pago con error', 'Un pago de ' . wabot_pagos_monto_texto((int)($fila['monto'] ?? 0)) . ' falló al confirmarse; revisalo en la pestaña Clientes.', ['link' => 'https://www.gokywebs.com/wabot/admin.php?tab=clientes']); } catch (\Throwable $e2) {}
        }
        return $fila;
    }
}

/* ── Desde el panel ────────────────────────────────────────────────────── */

/** Los pagos que esperan que Pablo diga de quién son, el más nuevo primero. */
function wabot_pagos_sin_asignar() {
    // Los que fallaron al confirmarse también: el aviso a Pablo lo manda a revisarlos acá.
    $lista = array_filter(wabot_pagos_estado()['pagos'], function ($f) { return in_array(($f['estado'] ?? ''), ['sin_asignar', 'error'], true); });
    usort($lista, function ($a, $b) { return ($b['ts'] ?? 0) <=> ($a['ts'] ?? 0); });
    return array_values($lista);
}

/** El mail como clave del recuerdo: minúsculas y sin espacios; '' si no es un mail. */
function wabot_pagos_email_clave($email) {
    $email = mb_strtolower(trim((string)$email));
    return strpos($email, '@') !== false ? $email : '';
}

function wabot_pagos_marcar_cliente(array $fila, array $cliente, $ahora, $modo) {
    $fila['estado'] = 'cliente';
    $fila['cliente_id'] = (string)($cliente['id'] ?? '');
    $fila['cliente_nombre'] = (string)($cliente['nombre'] ?? '');
    $fila['modo'] = $modo;
    $fila['confirmado_ts'] = $ahora;
    unset($fila['sugeridos']);
    return $fila;
}

/**
 * Pablo, 3-nov: «hay muchos que ya son clientes de acá, pero no tengo cómo
 * asignarlos». El pago es de un cliente del admin (una cuota, el saldo, una
 * transferencia de los que pagan por afuera): sale de la lista sin tocar
 * ningún chat ni escribirle a nadie. Los otros sin asignar del mismo mail
 * corren la misma suerte, y lo que entre después de ese mail también (el cron).
 */
function wabot_pagos_de_cliente($pagoId, $clienteId, $clienteNombre, $ahora = null) {
    $ahora = (int)($ahora ?? time());
    $lockPagos = wabot_lock_tomar_esperando('pagosmp', 100, 100000);
    if (!$lockPagos) return ['ok' => false, 'motivo' => 'ocupado'];
    try {
        $estado = wabot_pagos_estado();
        $fila = $estado['pagos'][(string)$pagoId] ?? null;
        if (!$fila) return ['ok' => false, 'motivo' => 'no_existe'];
        if (!in_array(($fila['estado'] ?? ''), ['sin_asignar', 'error'], true)) return ['ok' => false, 'motivo' => 'ya_asignado'];
        $cliente = ['id' => (string)$clienteId, 'nombre' => (string)$clienteNombre];
        $estado['pagos'][(string)$pagoId] = wabot_pagos_marcar_cliente($fila, $cliente, $ahora, 'pablo');
        $n = 1;
        $mail = wabot_pagos_email_clave($fila['email'] ?? '');
        if ($mail !== '') {
            $estado['emails_cliente'][$mail] = $cliente;
            foreach ($estado['pagos'] as $id => $otra) {
                if ((string)$id === (string)$pagoId || !in_array(($otra['estado'] ?? ''), ['sin_asignar', 'error'], true)) continue;
                if (wabot_pagos_email_clave($otra['email'] ?? '') !== $mail) continue;
                $estado['pagos'][$id] = wabot_pagos_marcar_cliente($otra, $cliente, $ahora, 'mismo_mail');
                $n++;
            }
        }
        wabot_pagos_guardar($estado);
        wabot_log('pago_de_cliente', ['pago' => (string)$pagoId, 'cliente' => $cliente['id'], 'pagos' => $n]);
        return ['ok' => true, 'pagos' => $n];
    } finally {
        wabot_lock_soltar($lockPagos);
    }
}

/** Pablo lo asignó a un chat desde la pestaña Clientes. Devuelve lo de wabot_pago_confirmar o ['ok' => false, 'motivo']. */
function wabot_pagos_asignar($pagoId, $clave, $modalidad, $cfg, array $deps = []) {
    $lockPagos = wabot_lock_tomar_esperando('pagosmp', 100, 100000);
    if (!$lockPagos) return ['ok' => false, 'motivo' => 'ocupado'];
    try {
        return wabot_pagos_asignar_bloqueado($pagoId, $clave, $modalidad, $cfg, $deps);
    } finally {
        wabot_lock_soltar($lockPagos);
    }
}

function wabot_pagos_asignar_bloqueado($pagoId, $clave, $modalidad, $cfg, array $deps) {
    $estado = wabot_pagos_estado();
    $fila = $estado['pagos'][(string)$pagoId] ?? null;
    if (!$fila) return ['ok' => false, 'motivo' => 'no_existe'];
    // Desde una lista vieja: el cron (u otra pestaña) ya lo confirmó o lo ignoró.
    if (!in_array(($fila['estado'] ?? ''), ['sin_asignar', 'error'], true)) return ['ok' => false, 'motivo' => 'ya_asignado'];
    $clave = preg_replace('/[^0-9A-Za-z]/', '', (string)$clave);
    $motivo = null;
    $resuelta = wabot_conv_resolver($clave, $motivo);
    if ($resuelta === null) return ['ok' => false, 'motivo' => $motivo === 'ambiguo' ? 'ambiguo' : 'sin_chat'];
    $lock = wabot_lock_tomar($resuelta);
    if (!$lock) return ['ok' => false, 'motivo' => 'ocupado'];
    try {
        $conv = wabot_conv_load($resuelta);
        $r = wabot_pago_confirmar($conv, $fila + ['modo' => 'asignado'], $modalidad, $cfg, $deps);
        if (!empty($r['ok'])) {
            wabot_conv_save($conv);
            $fila['estado'] = 'confirmado';
            $fila['clave'] = $resuelta;
            $fila['modo'] = 'asignado';
            $fila['modalidad'] = $r['modalidad'];
            $fila['confirmado_ts'] = time();
            $estado['pagos'][(string)$pagoId] = $fila;
            wabot_pagos_guardar($estado);
        }
        return $r + ['clave' => $resuelta];
    } finally {
        wabot_lock_soltar($lock);
    }
}

/** No es de ningún cliente (o Pablo lo quiere afuera): deja de aparecer. */
function wabot_pagos_ignorar($pagoId) {
    $lockPagos = wabot_lock_tomar_esperando('pagosmp', 100, 100000);
    if (!$lockPagos) return false;
    try {
        $estado = wabot_pagos_estado();
        if (!isset($estado['pagos'][(string)$pagoId])) return false;
        $estado['pagos'][(string)$pagoId]['estado'] = 'ignorado';
        $estado['pagos'][(string)$pagoId]['motivo'] = 'ignorado_por_pablo';
        return wabot_pagos_guardar($estado);
    } finally {
        wabot_lock_soltar($lockPagos);
    }
}

/**
 * El botón "Confirmar pago" de la ficha: la transferencia que no apareció en
 * MP, o el comprobante que Pablo ya vio. Mismo camino que la automática.
 */
function wabot_pago_confirmar_manual(&$conv, $monto, $modalidad, $cfg, array $deps = []) {
    $ahora = (int)($deps['ahora'] ?? time());
    $pago = ['id' => 'manual-' . $ahora, 'monto' => (int)$monto, 'ts' => $ahora, 'tipo' => 'manual', 'modo' => 'manual', 'suscripcion' => ''];
    return wabot_pago_confirmar($conv, $pago, $modalidad, $cfg, $deps);
}

/** Lo que muestra la ficha: "Pagó $30.000 el 1/11 (plan mensual)" o ''. */
function wabot_pago_resumen_ficha(array $conv) {
    if (empty($conv['pago_confirmado_ts'])) return '';
    $ts = (int)($conv['pago_ts'] ?? $conv['pago_confirmado_ts']);
    $local = $ts - 3 * 3600;
    return 'Pagó ' . wabot_pagos_monto_texto((int)($conv['pago_monto'] ?? 0)) . ' el ' . gmdate('j/n', $local)
         . ' (' . wabot_pagos_modalidad_label((string)($conv['pago_modalidad'] ?? '')) . ')';
}
