<?php
/**
 * wabot/auditar-vinculos.php — ¿cada cliente mensual del admin está vinculado
 * con SU suscripción de Mercado Pago? (Pablo, 23-nov-2026: «cómo hacemos para
 * reverificarlas todas»).
 *
 * Por qué. El vínculo es el `preapprovalId` de la ficha (clientes/<id> o
 * mantenimiento/<id>), y muchos se cargaron a mano en Mantenimiento → Vincular
 * con MP. El 23-nov aparecieron cruzados (LRT Electricidad ↔ MR Construcciones;
 * y en ciclo Conciencia Vital, Adara y Lulu indumentaria): clientes que pagaron
 * el mismo monto con horas de diferencia. Con el vínculo cruzado, el aviso de
 * cobro atrasado sale a nombre de otro y se pausa la suscripción equivocada.
 *
 * Método (el que se validó a mano ese día). La suscripción es de la charla
 * donde se mandó el link de pago mensual de ese monto antes del alta y donde el
 * cliente mandó el comprobante en los minutos siguientes. Por cada suscripción
 * (alta = date_created, monto = auto_recurring.transaction_amount) se puntúa
 * cada charla:
 *   - link mensual del mismo monto hasta 72 h antes del alta: 2 (3 si fue en
 *     las 6 h previas). Sin ese link la charla no es candidata;
 *   - del cliente, entre 2 min antes y 60 min después del alta: una foto o un
 *     documento que habla de un pago, 3 (4 dentro de los 15 min); un «ya
 *     pagué» sin archivo, 2 (3); un archivo sin descripción, 1 (2);
 *   - el «Genial, recibido… otro numero (1125068578)» de Pablo hasta 12 h
 *     después del alta: 1 (2 en las primeras 3 h).
 * La evidencia es CLARA si la mejor charla llega a 5 y le saca 3 o más a la
 * segunda. Un comprobante prueba una sola suscripción: lo que ya explicó una
 * clara no cuenta para las demás (dos altas del mismo monto con minutos de
 * diferencia se resuelven por descarte). Las suscripciones canceladas el mismo
 * día sin cobrar son reintentos del que se suscribe y no cuentan.
 *
 * Resultado por vínculo (lo que el admin tiene hoy: wabot_cobro_rech_estado):
 *   ok          la charla clara es la de ese cliente (prueba = charla); o, sin
 *               charla, el titular de MP comparte el nombre con el cliente
 *               (nombre), o la ficha es de Mantenimiento, que nace del webhook
 *               de esa misma suscripción (webhook)
 *   mal         la charla clara es de otro: `sugerido` dice de quién, y `suya`
 *               cuál es la suscripción que la charla le da a este cliente
 *   sin_prueba  no hay charla, o hay dos que podrían ser
 *
 * SOLO LECTURA: lee las charlas (data/conv + data/historial), la lista que
 * sincroniza el admin y la API de Mercado Pago (GET). No escribe archivos, no
 * toca Firestore y no le manda nada a nadie. Los vínculos los corrige Pablo en
 * Mantenimiento → Vincular con MP.
 *
 *   php wabot/auditar-vinculos.php             el informe: los MAL, los sin prueba y el resumen
 *   php wabot/auditar-vinculos.php --detalle   además, la evidencia de cada OK y los candidatos
 *   php wabot/auditar-vinculos.php --json      el resultado entero en JSON
 *
 * El admin lo pide por wabot/admin.php?accion=auditar_vinculos_json y marca en
 * la pestaña cada fila que contradice la charla (admin/dashboard.js).
 */

require_once __DIR__ . '/lib.php';
require_once __DIR__ . '/pagos.php';              // wabot_pagos_mp, wabot_pagos_mp_yo, wabot_pagos_links_en
require_once __DIR__ . '/cobros-rechazados.php';  // wabot_cobro_rech_estado: lo que el admin tiene vinculado

const WABOT_AUDVINC_LINK_HORAS = 72;          // el link cuenta si se mandó hasta esto antes del alta
const WABOT_AUDVINC_LINK_CERCA_HORAS = 6;
const WABOT_AUDVINC_TOLERANCIA = 120;         // segundos: los relojes de MP y del server no son el mismo
const WABOT_AUDVINC_PRUEBA_CERCA = 15 * 60;
const WABOT_AUDVINC_PRUEBA_HASTA = 60 * 60;
const WABOT_AUDVINC_RECIBIDO_CERCA = 3 * 3600;
const WABOT_AUDVINC_RECIBIDO_HASTA = 12 * 3600;
const WABOT_AUDVINC_CLARA_MIN = 5;            // puntos de la mejor charla para que la evidencia sea clara…
const WABOT_AUDVINC_CLARA_MARGEN = 3;         // …y ventaja sobre la segunda
const WABOT_AUDVINC_OTRO_NUMERO = '1125068578';

/* ── Texto, nombres y teléfonos ────────────────────────────────────────── */

/** Minúsculas, sin tildes y con los espacios juntos. */
function wabot_audvinc_normal($s) {
    $s = mb_strtolower(trim((string)preg_replace('/\s+/u', ' ', (string)$s)), 'UTF-8');
    return strtr($s, ['á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'ã' => 'a', 'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
                      'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i', 'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'õ' => 'o',
                      'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u', 'ñ' => 'n', 'ç' => 'c']);
}

/** Las palabras de un nombre para compararlo (como _palabrasNombre del admin): de 3 letras o más, sin «del/las/los». */
function wabot_audvinc_palabras(...$textos) {
    $out = [];
    foreach ($textos as $t) {
        foreach (preg_split('/[^a-z]+/', wabot_audvinc_normal($t)) ?: [] as $p) {
            if (strlen($p) >= 3 && !in_array($p, ['del', 'las', 'los'], true)) $out[$p] = true;
        }
    }
    return array_keys($out);
}

/** Cuántas palabras de $nombre están entre $palabras; vale que una empiece con la otra si la corta tiene 4 letras o más (Yani / Yanina). */
function wabot_audvinc_en_comun(array $palabras, $nombre) {
    $n = 0;
    foreach (wabot_audvinc_palabras($nombre) as $b) {
        foreach ($palabras as $a) {
            [$corta, $larga] = strlen($a) <= strlen($b) ? [$a, $b] : [$b, $a];
            if ($a === $b || (strlen($corta) >= 4 && strpos($larga, $corta) === 0)) { $n++; break; }
        }
    }
    return $n;
}

/** El teléfono reducido a característica + número (10 dígitos en Argentina); '' si no alcanza. */
function wabot_audvinc_tel($tel) {
    $d = ltrim((string)preg_replace('/\D+/', '', (string)$tel), '0');
    if (strpos($d, '54') === 0 && strlen($d) >= 12) $d = ltrim(substr($d, 2), '0');
    if (strlen($d) === 11 && $d[0] === '9') $d = substr($d, 1);
    if (strlen($d) === 12) {
        foreach ([2, 3, 4] as $area) {
            if (substr($d, $area, 2) === '15') { $d = substr($d, 0, $area) . substr($d, $area + 2); break; }
        }
    }
    if (strlen($d) >= 10) return substr($d, -10);
    return strlen($d) >= 8 ? $d : '';
}

function wabot_audvinc_mismo_tel($a, $b) {
    if ($a === '' || $b === '') return false;
    if (strlen($a) >= 10 && strlen($b) >= 10) return $a === $b;
    return substr($a, -8) === substr($b, -8);
}

/** "$30.000" */
function wabot_audvinc_plata($n) {
    return '$' . number_format((float)$n, 0, ',', '.');
}

/** "03/11 14:35" en hora argentina. */
function wabot_audvinc_fecha($ts) {
    return (int)$ts > 0 ? gmdate('d/m H:i', (int)$ts - 3 * 3600) : 'sin fecha';
}

/** 95 → "1 h 35 min"; 4 → "4 min"; 3000 → "2 días". */
function wabot_audvinc_lapso($segundos) {
    $min = (int)round(abs((int)$segundos) / 60);
    if ($min < 60) return $min . ' min';
    if ($min < 48 * 60) return intdiv($min, 60) . ' h' . ($min % 60 ? ' ' . ($min % 60) . ' min' : '');
    return (int)round($min / 1440) . ' días';
}

/* ── Mercado Pago ──────────────────────────────────────────────────────── */

/**
 * Todas las suscripciones de la cuenta: [id => {id, estado, monto, alta_ts,
 * baja_ts, nombre_mp, plan, cobros, descartada}]. `descartada` = reintento
 * (cancelada a menos de un día del alta sin haber cobrado: sin cobros, o con el
 * único cobro rechazado) o alta que nunca se autorizó. $mp(ruta) es la API; los
 * tests le pasan datos fijos.
 * El titular solo viene en /preapproval/search (no en /preapproval/<id>).
 */
function wabot_audvinc_suscripciones(callable $mp) {
    $yo = wabot_pagos_mp_yo($mp);
    $subs = [];
    for ($offset = 0; $offset < 3000; $offset += 100) {
        $pagina = $mp('/preapproval/search?limit=100&offset=' . $offset);
        foreach ((array)($pagina['results'] ?? []) as $s) {
            if (!is_array($s) || (string)($s['collector_id'] ?? '') !== $yo || empty($s['id'])) continue;
            $estado = (string)($s['status'] ?? '');
            $alta = (int)strtotime((string)($s['date_created'] ?? ''));
            $baja = $estado === 'cancelled' ? (int)strtotime((string)($s['last_modified'] ?? '')) : 0;
            /* ¿Llegó a cobrar? charged_quantity cuenta también el cobro que rebotó: en producción las
             * canceladas el mismo día del alta venían casi todas con 1 y el semáforo en amarillo (el
             * único intento, rechazado). Cobró = hay cobros y el último no rebotó. */
            $cobros = (int)($s['summarized']['charged_quantity'] ?? 0);
            $cobro = $cobros > 0 && (string)($s['summarized']['semaphore'] ?? '') === 'green';
            $subs[(string)$s['id']] = [
                'id'        => (string)$s['id'],
                'estado'    => $estado,
                'monto'     => (int)round((float)($s['auto_recurring']['transaction_amount'] ?? 0)),
                'alta_ts'   => $alta,
                'baja_ts'   => $baja,
                'nombre_mp' => trim((string)preg_replace('/\s+/u', ' ', ($s['payer_first_name'] ?? '') . ' ' . ($s['payer_last_name'] ?? ''))),
                'plan'      => trim((string)($s['reason'] ?? '')),
                'cobros'    => $cobros,
                'descartada' => $estado === 'pending' || ($estado === 'cancelled' && !$cobro && $baja > 0 && $baja - $alta < 86400),
            ];
        }
        if ($offset + 100 >= (int)($pagina['paging']['total'] ?? 0)) break;
    }
    return $subs;
}

/* ── Las charlas ───────────────────────────────────────────────────────── */

/** ¿El mensaje nuestro es el «Genial, recibido. Ahora te escribo desde otro numero (1125068578)»? */
function wabot_audvinc_es_recibido($texto) {
    $n = wabot_audvinc_normal($texto);
    if ($n === '') return false;
    $recibido = strpos($n, 'recibid') !== false;
    $otro = strpos($n, 'otro numero') !== false;
    $numero = strpos((string)preg_replace('/\D+/', '', $n), WABOT_AUDVINC_OTRO_NUMERO) !== false;
    return ($recibido && ($otro || $numero)) || ($otro && $numero);
}

/** ¿El cliente dice que pagó? (sobre el texto ya normalizado) */
function wabot_audvinc_dice_que_pago($n) {
    return (bool)(
        preg_match('/\b(ya )?(te |lo |la )?(pague|abone|transferi|deposite|suscribi|subscribi|adheri)\b/u', $n)
        || preg_match('/\b(hice|realice|mande|envie|hecho|hecha|realizado|realizada|listo|lista)\b.{0,30}\b(pago|transferencia|suscripcion|deposito)\b/u', $n)
        || preg_match('/\bya (esta|quedo) (pago|pagado|pagada|abonado|abonada|hecho|hecha|listo|lista)\b/u', $n)
        || preg_match('/\bcomprobante\b/u', $n)
    );
}

/**
 * Qué prueba de pago es un mensaje del cliente: 'comprobante' (foto o documento
 * cuyo texto habla de un pago), 'dijo' (un «ya pagué» sin archivo), 'archivo'
 * (foto o documento sin nada que lo describa) o '' si no es ninguna.
 */
function wabot_audvinc_clase_prueba($texto, $media) {
    $n = wabot_audvinc_normal($texto);
    $archivo = (is_array($media) && in_array((string)($media['clase'] ?? ''), ['imagen', 'documento'], true))
        || preg_match('/^\[(foto|imagen|documento)\]/u', $n);
    if ($archivo) {
        $habla = preg_match('/comprobante|transferencia|\bpag(o|os|ue|aste|ado|ada)\b|suscrip|mercado ?pago|aprobad|acreditad|debit|recibo|importe/u', $n);
        return $habla ? 'comprobante' : 'archivo';
    }
    return wabot_audvinc_dice_que_pago($n) ? 'dijo' : '';
}

/**
 * Una charla reducida a lo que sirve de evidencia, o null si nunca se le mandó
 * un link de pago mensual: {clave, nombre, negocio, cliente_id, tels,
 * links [{ts, monto}], pruebas [{ts, clase}], recibidos [ts]}.
 * $viejas: las filas archivadas en data/historial (el archivo vivo guarda solo las últimas).
 */
function wabot_audvinc_charla($clave, array $cv, array $viejas = []) {
    $links = $pruebas = $recibidos = [];
    foreach (array_merge($viejas, (array)($cv['transcript'] ?? [])) as $fila) {
        if (!is_array($fila)) continue;
        $ts = (int)($fila['ts'] ?? 0);
        if ($ts <= 0) continue;
        $t = is_string($fila['t'] ?? null) ? $fila['t'] : '';
        $q = (string)($fila['q'] ?? '');
        if ($q === 'bot' || $q === 'humano') {
            foreach (wabot_pagos_links_en($t) as $l) {
                if ($l['modalidad'] === 'mensual' && (int)$l['monto'] > 0) $links[$ts . '|' . (int)$l['monto']] = ['ts' => $ts, 'monto' => (int)$l['monto']];
            }
            if (wabot_audvinc_es_recibido($t)) $recibidos[$ts] = $ts;
        } elseif ($q === 'cliente') {
            $clase = wabot_audvinc_clase_prueba($t, $fila['media'] ?? null);
            if ($clase !== '') $pruebas[$ts] = ['ts' => $ts, 'clase' => $clase];
        }
    }
    if (!$links) return null;
    $clave = (string)$clave;
    $tels = [];
    // La clave de una charla de Instagram no es un teléfono.
    foreach ([stripos($clave, 'ig') === 0 ? '' : $clave, $cv['telefono_wsp'] ?? '', stripos($clave, 'ig') === 0 ? '' : ($cv['tel'] ?? '')] as $tel) {
        $d = wabot_audvinc_tel($tel);
        if ($d !== '') $tels[$d] = true;
    }
    ksort($links); ksort($pruebas); ksort($recibidos);
    return [
        'clave'      => $clave,
        'nombre'     => trim((string)($cv['nombre'] ?? '')),
        'negocio'    => trim((string)($cv['nombre_negocio'] ?? '')),
        'cliente_id' => trim((string)($cv['cliente_id'] ?? '')),
        'tels'       => array_map('strval', array_keys($tels)),
        'links'      => array_values($links),
        'pruebas'    => array_values($pruebas),
        'recibidos'  => array_values($recibidos),
    ];
}

/** ¿El archivo crudo trae algún link de pago mensual? (para no decodificar las miles de charlas que no). */
function wabot_audvinc_crudo_con_link($crudo) {
    return $crudo !== '' && (strpos($crudo, 'mpago.la') !== false || strpos($crudo, 'preapproval_plan_id') !== false
        || strpos($crudo, 'planmensual') !== false || strpos($crudo, 'pago/mensual') !== false || strpos($crudo, 'pago\/mensual') !== false);
}

/**
 * Todas las charlas con link mensual: [clave => charla reducida]. Del disco
 * (data/conv + data/historial, leyendo el archivo crudo: no pasa por
 * wabot_conv_load ni guarda nada), o de $convs en los tests: [clave => conv].
 */
function wabot_audvinc_charlas($convs = null) {
    $out = [];
    if (is_array($convs)) {
        foreach ($convs as $clave => $cv) {
            if (stripos((string)$clave, 'TEST') !== false) continue;
            $ch = is_array($cv) ? wabot_audvinc_charla((string)$clave, $cv) : null;
            if ($ch) $out[(string)$clave] = $ch;
        }
        return $out;
    }
    foreach (glob(WABOT_DATA . '/conv/*.json') ?: [] as $f) {
        $clave = basename($f, '.json');
        if (stripos($clave, 'TEST') !== false) continue;
        $crudo = (string)@file_get_contents($f);
        $hist = WABOT_DATA . '/historial/' . $clave . '.jsonl';
        $crudoHist = is_file($hist) ? (string)@file_get_contents($hist) : '';
        if (!wabot_audvinc_crudo_con_link($crudo) && !wabot_audvinc_crudo_con_link($crudoHist)) continue;
        $cv = json_decode($crudo, true);
        if (!is_array($cv)) continue;
        $viejas = [];
        foreach (explode("\n", $crudoHist) as $linea) {
            $fila = $linea !== '' ? json_decode($linea, true) : null;
            if (is_array($fila) && isset($fila['q'])) $viejas[] = $fila;
        }
        $ch = wabot_audvinc_charla($clave, $cv, $viejas);
        if ($ch) $out[$clave] = $ch;
    }
    return $out;
}

/* ── El puntaje ────────────────────────────────────────────────────────── */

/**
 * Cuánto apunta una charla a una suscripción: null si no recibió el link de ese
 * monto en las 72 h previas al alta; si no, {clave, puntos, link {ts, antes},
 * prueba {ts, clase, despues} | null, recibido {ts, despues} | null}
 * (antes / despues en segundos respecto del alta).
 * $usadas: las pruebas y los «recibido» que ya explicaron otra suscripción.
 */
function wabot_audvinc_puntuar(array $sub, array $ch, array $usadas = []) {
    $alta = (int)$sub['alta_ts'];
    if ($alta <= 0 || (int)$sub['monto'] <= 0) return null;
    $link = null;
    foreach ($ch['links'] as $l) {
        if ((int)$l['monto'] !== (int)$sub['monto']) continue;
        if ($l['ts'] > $alta + WABOT_AUDVINC_TOLERANCIA || $l['ts'] < $alta - WABOT_AUDVINC_LINK_HORAS * 3600) continue;
        if (!$link || $l['ts'] > $link['ts']) $link = $l;   // el último antes del alta
    }
    if (!$link) return null;
    $antes = max(0, $alta - $link['ts']);
    $puntos = $antes <= WABOT_AUDVINC_LINK_CERCA_HORAS * 3600 ? 3 : 2;
    $out = ['clave' => $ch['clave'], 'puntos' => 0, 'link' => ['ts' => $link['ts'], 'antes' => $antes], 'prueba' => null, 'recibido' => null];

    $mejor = null;
    foreach ($ch['pruebas'] as $p) {
        $despues = $p['ts'] - $alta;
        if ($despues < -WABOT_AUDVINC_TOLERANCIA || $despues > WABOT_AUDVINC_PRUEBA_HASTA) continue;
        if (isset($usadas['p|' . $ch['clave'] . '|' . $p['ts']])) continue;
        $base = ['comprobante' => 3, 'dijo' => 2, 'archivo' => 1][$p['clase']] ?? 0;
        $pts = $base + ($despues <= WABOT_AUDVINC_PRUEBA_CERCA ? 1 : 0);
        if (!$mejor || $pts > $mejor['pts'] || ($pts === $mejor['pts'] && abs($despues) < abs($mejor['despues']))) {
            $mejor = ['ts' => $p['ts'], 'clase' => $p['clase'], 'despues' => $despues, 'pts' => $pts];
        }
    }
    if ($mejor) {
        $puntos += $mejor['pts'];
        unset($mejor['pts']);
        $out['prueba'] = $mejor;
    }
    foreach ($ch['recibidos'] as $ts) {
        $despues = $ts - $alta;
        if ($despues < -WABOT_AUDVINC_TOLERANCIA || $despues > WABOT_AUDVINC_RECIBIDO_HASTA) continue;
        if (isset($usadas['r|' . $ch['clave'] . '|' . $ts])) continue;
        $puntos += $despues <= WABOT_AUDVINC_RECIBIDO_CERCA ? 2 : 1;
        $out['recibido'] = ['ts' => $ts, 'despues' => $despues];
        break;   // el primero después del alta
    }
    $out['puntos'] = $puntos;
    return $out;
}

/**
 * Las charlas candidatas de una suscripción, de la que más apunta a la que
 * menos: {clara, puntos, segundo, candidatos [...]}.
 */
function wabot_audvinc_evidencia(array $sub, array $charlas, array $usadas = []) {
    $cands = [];
    foreach ($charlas as $ch) {
        $c = wabot_audvinc_puntuar($sub, $ch, $usadas);
        if ($c) $cands[] = $c;
    }
    usort($cands, function ($a, $b) {
        if ($a['puntos'] !== $b['puntos']) return $b['puntos'] <=> $a['puntos'];
        $da = $a['prueba'] ? abs($a['prueba']['despues']) : PHP_INT_MAX;
        $db = $b['prueba'] ? abs($b['prueba']['despues']) : PHP_INT_MAX;
        if ($da !== $db) return $da <=> $db;
        return [$a['link']['antes'], $a['clave']] <=> [$b['link']['antes'], $b['clave']];
    });
    $puntos = $cands ? $cands[0]['puntos'] : 0;
    $segundo = isset($cands[1]) ? $cands[1]['puntos'] : 0;
    return [
        'clara' => $puntos >= WABOT_AUDVINC_CLARA_MIN && $puntos - $segundo >= WABOT_AUDVINC_CLARA_MARGEN,
        'puntos' => $puntos,
        'segundo' => $segundo,
        'candidatos' => array_slice($cands, 0, 4),
    ];
}

/**
 * La evidencia de cada suscripción: [id => evidencia]. En varias pasadas: lo
 * que explicó una suscripción clara (ese comprobante, ese «recibido») no cuenta
 * para las que quedaron en duda, y así se aclaran por descarte.
 */
function wabot_audvinc_evidencias(array $subs, array $charlas) {
    $porMonto = [];
    foreach ($charlas as $ch) {
        foreach (array_unique(array_column($ch['links'], 'monto')) as $monto) $porMonto[(int)$monto][] = $ch;
    }
    $ev = [];
    $usadas = [];
    for ($vuelta = 0; $vuelta < 5; $vuelta++) {
        $nuevas = [];
        foreach ($subs as $id => $s) {
            if (isset($ev[$id]) && $ev[$id]['clara']) continue;
            $ev[$id] = wabot_audvinc_evidencia($s, $porMonto[(int)$s['monto']] ?? [], $usadas);
            if ($ev[$id]['clara']) $nuevas[] = $ev[$id]['candidatos'][0];
        }
        if (!$nuevas) break;
        foreach ($nuevas as $c) {
            if ($c['prueba']) $usadas['p|' . $c['clave'] . '|' . $c['prueba']['ts']] = true;
            if ($c['recibido']) $usadas['r|' . $c['clave'] . '|' . $c['recibido']['ts']] = true;
        }
    }
    return $ev;
}

/** La evidencia de una charla en una línea: «link de $30.000 el 03/11 10:58 (22 min antes del alta) · comprobante a los 3 min · …». */
function wabot_audvinc_evidencia_texto(array $c, array $sub) {
    $cuando = function ($despues) {
        if (abs($despues) < 60) return 'en el mismo minuto';
        return wabot_audvinc_lapso($despues) . ($despues < 0 ? ' antes' : ' después');
    };
    $partes = ['link de ' . wabot_audvinc_plata($sub['monto']) . ' el ' . wabot_audvinc_fecha($c['link']['ts'])
        . ' (' . ($c['link']['antes'] < 60 ? 'justo antes del alta' : wabot_audvinc_lapso($c['link']['antes']) . ' antes del alta') . ')'];
    if ($c['prueba']) {
        $que = ['comprobante' => 'comprobante', 'dijo' => 'avisó que pagó', 'archivo' => 'mandó un archivo'][$c['prueba']['clase']] ?? 'prueba';
        $partes[] = $que . ' ' . $cuando($c['prueba']['despues']);
    }
    if ($c['recibido']) $partes[] = '«Genial, recibido» de Pablo ' . $cuando($c['recibido']['despues']);
    return implode(' · ', $partes);
}

/* ── De quién es cada charla ───────────────────────────────────────────── */

/** La caché de clientes del bot (clientes.php), reducida: [{id "coleccion:docId", clave, persona, negocio, tel}]. */
function wabot_audvinc_cache($cache = null) {
    if ($cache === null) $cache = json_decode((string)@file_get_contents(WABOT_DATA . '/clientes-cache.json'), true);
    $out = [];
    foreach ((array)(is_array($cache) ? ($cache['mantenimiento'] ?? []) : []) as $x) {
        if (!is_array($x) || empty($x['id'])) continue;
        $out[] = ['id' => (string)($x['origen'] ?? 'clientes') . ':' . $x['id'], 'clave' => (string)($x['clave'] ?? ''),
                  'persona' => trim((string)($x['nombre'] ?? '')), 'negocio' => trim((string)($x['negocio'] ?? '')),
                  'tel' => (string)($x['clave'] ?? '') !== '' ? (string)$x['clave'] : (string)($x['telefono'] ?? '')];
    }
    return $out;
}

/** Por qué esta charla es de esa ficha: 'ficha' (su cliente_id), 'cache' (el bot la tiene como su chat), 'telefono', o '' si no lo es. */
function wabot_audvinc_charla_es_de(array $ch, array $ficha, array $cache) {
    $id = (string)($ficha['id'] ?? '');
    if ($id === '') return '';
    if ($ch['cliente_id'] !== '' && $id === 'clientes:' . $ch['cliente_id']) return 'ficha';
    foreach ($cache as $x) {
        if ($x['id'] === $id && $x['clave'] !== '' && $x['clave'] === $ch['clave']) return 'cache';
    }
    $tel = wabot_audvinc_tel($ficha['tel'] ?? '');
    foreach ($ch['tels'] as $t) {
        if (wabot_audvinc_mismo_tel($t, $tel)) return 'telefono';
    }
    return '';
}

/**
 * De quién es una charla: la fila de la lista del admin (con la suscripción que
 * tiene hoy), si no la ficha de la caché del bot, si no lo que diga la charla.
 * {id ('' si no se sabe), persona, negocio, pre, clave, conocido}.
 */
function wabot_audvinc_dueno(array $ch, array $lista, array $cache) {
    foreach ($lista as $f) {
        if (wabot_audvinc_charla_es_de($ch, $f, $cache) !== '') {
            return ['id' => (string)$f['id'], 'persona' => (string)($f['persona'] ?? ''), 'negocio' => (string)($f['negocio'] ?? ''),
                    'pre' => (string)($f['pre'] ?? ''), 'clave' => $ch['clave'], 'conocido' => true];
        }
    }
    foreach ($cache as $x) {
        if (wabot_audvinc_charla_es_de($ch, $x, $cache) !== '') {
            return ['id' => $x['id'], 'persona' => $x['persona'], 'negocio' => $x['negocio'], 'pre' => '', 'clave' => $ch['clave'], 'conocido' => true];
        }
    }
    return ['id' => $ch['cliente_id'] !== '' ? 'clientes:' . $ch['cliente_id'] : '', 'persona' => $ch['nombre'], 'negocio' => $ch['negocio'],
            'pre' => '', 'clave' => $ch['clave'], 'conocido' => false];
}

/** "Negocio (Persona)", o lo que haya. */
function wabot_audvinc_quien(array $x) {
    $n = trim((string)($x['negocio'] ?? ''));
    $p = trim((string)($x['persona'] ?? ''));
    if (!preg_match('/\p{L}/u', $p)) $p = '';   // «😎» no es el nombre de nadie
    if ($n !== '' && $p !== '' && wabot_audvinc_normal($n) !== wabot_audvinc_normal($p)) return $n . ' (' . $p . ')';
    return $n !== '' ? $n : ($p !== '' ? $p : 'sin nombre');
}

/* ── La auditoría ──────────────────────────────────────────────────────── */

/**
 * Audita los vínculos. $opc (todo opcional; los tests pasan datos fijos):
 *   mp     callable(ruta)          la API de Mercado Pago (wabot_pagos_mp)
 *   lista  [{id, pre, tel, persona, negocio, seguro}]   lo vinculado (wabot_cobro_rech_estado)
 *   convs  [clave => conv]         las charlas (el disco)
 *   cache  array                   la caché de clientes del bot (data/clientes-cache.json)
 *   ahora  int
 * Devuelve {ts, sync_ts, resumen, vinculos [...], sin_vincular [...], subs, charlas}.
 */
function wabot_audvinc_auditar(array $opc = []) {
    $ahora = (int)($opc['ahora'] ?? time());
    $syncTs = 0;
    if (isset($opc['lista'])) {
        $lista = array_values(array_filter((array)$opc['lista'], 'is_array'));
    } else {
        $estado = wabot_cobro_rech_estado();
        $lista = $estado['lista'];
        $syncTs = (int)$estado['sync_ts'];
    }
    $subs = wabot_audvinc_suscripciones($opc['mp'] ?? 'wabot_pagos_mp');
    $charlas = wabot_audvinc_charlas($opc['convs'] ?? null);
    $cache = wabot_audvinc_cache($opc['cache'] ?? null);

    // Se puntúan las que cuentan (no los reintentos) y, por las dudas, cualquiera que esté vinculada.
    $vinculadas = [];
    foreach ($lista as $f) $vinculadas[(string)($f['pre'] ?? '')] = true;
    $aPuntuar = array_filter($subs, function ($s) use ($vinculadas) { return !$s['descartada'] || isset($vinculadas[$s['id']]); });
    $ev = wabot_audvinc_evidencias($aPuntuar, $charlas);

    // De quién es la charla de cada suscripción con evidencia clara (`fichas`: todas las filas de la
    // lista que son de esa charla; la misma persona puede tener dos fichas, una por web).
    $duenos = [];
    foreach ($ev as $pre => $e) {
        if (!$e['clara']) continue;
        $ch = $charlas[$e['candidatos'][0]['clave']];
        $duenos[$pre] = wabot_audvinc_dueno($ch, $lista, $cache);
        $duenos[$pre]['fichas'] = [];
        foreach ($lista as $f) {
            if (wabot_audvinc_charla_es_de($ch, $f, $cache) !== '') $duenos[$pre]['fichas'][] = (string)$f['id'];
        }
    }
    $filaDePre = [];
    foreach ($lista as $f) $filaDePre[(string)($f['pre'] ?? '')] = $f;

    $vinculos = [];
    foreach ($lista as $f) {
        $pre = (string)($f['pre'] ?? '');
        $sub = $subs[$pre] ?? null;
        $v = ['id' => (string)($f['id'] ?? ''), 'pre' => $pre, 'persona' => (string)($f['persona'] ?? ''), 'negocio' => (string)($f['negocio'] ?? ''),
              'tel' => (string)($f['tel'] ?? ''), 'seguro' => !empty($f['seguro']), 'sub' => $sub,
              'estado' => 'sin_prueba', 'prueba' => '', 'motivo' => '', 'sugerido' => null, 'suya' => [], 'evidencia' => null, 'nota' => ''];
        if (!$sub) {
            $v['motivo'] = 'no_en_mp';
            $vinculos[] = $v;
            continue;
        }
        $e = $ev[$pre] ?? ['clara' => false, 'puntos' => 0, 'segundo' => 0, 'candidatos' => []];
        $v['evidencia'] = $e;
        $palabras = wabot_audvinc_palabras($f['persona'] ?? '', $f['negocio'] ?? '');
        if ($e['clara']) {
            $ch = $charlas[$e['candidatos'][0]['clave']];
            $como = wabot_audvinc_charla_es_de($ch, $f, $cache);
            $d = $duenos[$pre];
            if ($como !== '') {
                $v['estado'] = 'ok'; $v['prueba'] = 'charla';
            } elseif (!$d['conocido'] && (wabot_audvinc_en_comun(wabot_audvinc_palabras($f['negocio'] ?? ''), $ch['negocio']) > 0
                    || wabot_audvinc_en_comun($palabras, $ch['nombre'] . ' ' . $ch['negocio']) >= 2)) {
                // La charla no está atada a ninguna ficha, pero es del mismo negocio (otro número del cliente).
                $v['estado'] = 'ok'; $v['prueba'] = 'charla';
                $v['nota'] = 'la charla (' . $ch['clave'] . ') no tiene la ficha atada; coincide por el nombre';
            } else {
                $v['estado'] = 'mal';
                $v['sugerido'] = $d;
            }
        } else {
            /* Sin charla clara vale el indicio: el titular de MP comparte el nombre con el cliente, o
             * la ficha es de Mantenimiento (nace del webhook de esa suscripción). Pero no si la charla
             * de OTRO llega al mínimo, salvo que la del propio cliente apunte más (Mundo con fronteras:
             * 9 puntos la suya, 7 la de uno que mandó otro comprobante a la hora). */
            $propia = $ajena = 0;
            foreach ($e['candidatos'] as $c) {
                if (wabot_audvinc_charla_es_de($charlas[$c['clave']], $f, $cache) !== '') $propia = max($propia, $c['puntos']);
                else $ajena = max($ajena, $c['puntos']);
            }
            $v['motivo'] = $e['candidatos'] ? 'ambigua' : 'sin_charla';
            $nombre = wabot_audvinc_en_comun($palabras, $sub['nombre_mp']) > 0;
            if ($nombre && ($ajena < WABOT_AUDVINC_CLARA_MIN || $propia > $ajena)) {
                $v['estado'] = 'ok'; $v['prueba'] = 'nombre'; $v['motivo'] = '';
            } elseif ($ajena < WABOT_AUDVINC_CLARA_MIN && strpos($v['id'], 'mantenimiento:') === 0) {
                $v['estado'] = 'ok'; $v['prueba'] = 'webhook'; $v['motivo'] = '';
            }
        }
        $vinculos[] = $v;
    }

    /* La suscripción que la charla le da a cada cliente, cuando no es la que tiene vinculada ni
     * la tiene otra ficha de la misma charla (dos webs de la misma persona). Si el vínculo no
     * tenía charla que lo probara, que su charla señale otra lo deja para mirar a mano. */
    foreach ($vinculos as &$v) {
        if ($v['estado'] === 'ok' && $v['prueba'] === 'charla') continue;
        foreach ($duenos as $pre => $d) {
            if ($pre === $v['pre'] || !in_array($v['id'], $d['fichas'], true)) continue;
            $otra = $filaDePre[$pre] ?? null;
            if ($otra && in_array((string)$otra['id'], $d['fichas'], true)) continue;
            $v['suya'][] = ['pre' => $pre, 'nombre_mp' => $subs[$pre]['nombre_mp'], 'monto' => $subs[$pre]['monto'], 'alta_ts' => $subs[$pre]['alta_ts'],
                            'estado' => $subs[$pre]['estado'], 'vinculada_a' => $otra ? ['id' => (string)$otra['id'], 'persona' => (string)($otra['persona'] ?? ''), 'negocio' => (string)($otra['negocio'] ?? '')] : null];
        }
        // Una cancelada no desmiente nada (Julieta Ledesma: se suscribió dos veces en el mismo minuto y dio de baja una).
        $vigentes = array_filter($v['suya'], function ($s) { return in_array($s['estado'], ['authorized', 'paused'], true); });
        if ($v['estado'] !== 'mal') {
            $v['suya'] = array_values($vigentes);
            if ($v['suya']) { $v['estado'] = 'sin_prueba'; $v['prueba'] = ''; $v['motivo'] = 'otra_suya'; }
        }
    }
    unset($v);

    // Las vigentes que nadie tiene vinculada y cuya charla dice de quién son.
    $sinVincular = [];
    foreach ($duenos as $pre => $d) {
        if (isset($vinculadas[$pre]) || !in_array($subs[$pre]['estado'], ['authorized', 'paused'], true)) continue;
        $sinVincular[] = ['pre' => $pre, 'sub' => $subs[$pre], 'dueno' => $d, 'evidencia' => $ev[$pre]];
    }

    $resumen = ['total' => count($vinculos), 'ok' => 0, 'mal' => 0, 'sin_prueba' => 0, 'ok_charla' => 0, 'ok_nombre' => 0, 'ok_webhook' => 0];
    foreach ($vinculos as $v) {
        $resumen[$v['estado']]++;
        if ($v['estado'] === 'ok') $resumen['ok_' . $v['prueba']]++;
    }
    $orden = ['mal' => 0, 'sin_prueba' => 1, 'ok' => 2];
    usort($vinculos, function ($a, $b) use ($orden) {
        return [$orden[$a['estado']], wabot_audvinc_normal(wabot_audvinc_quien($a))] <=> [$orden[$b['estado']], wabot_audvinc_normal(wabot_audvinc_quien($b))];
    });
    return ['ts' => $ahora, 'sync_ts' => $syncTs, 'resumen' => $resumen, 'vinculos' => $vinculos, 'sin_vincular' => $sinVincular,
            'subs' => $subs, 'evidencias' => $ev, 'duenos' => $duenos, 'charlas' => $charlas, 'lista' => $lista, 'cache' => $cache];
}

/** Por qué un vínculo quedó como quedó, en una frase (para el informe y para el admin). */
function wabot_audvinc_explicacion(array $v) {
    $sub = $v['sub'];
    if (!$sub) return 'La suscripción vinculada no aparece en Mercado Pago.';
    $e = $v['evidencia'];
    $top = $e['candidatos'][0] ?? null;
    if ($v['motivo'] === 'otra_suya') return 'Ninguna charla prueba este vínculo, y la charla del cliente señala otra suscripción.';
    if ($v['estado'] === 'mal') {
        return 'La charla dice que esta suscripción es de ' . wabot_audvinc_quien($v['sugerido'])
            . ($v['sugerido']['conocido'] ? '' : ' (charla ' . $v['sugerido']['clave'] . ', sin ficha identificada)')
            . ': ' . wabot_audvinc_evidencia_texto($top, $sub) . '.';
    }
    if ($v['estado'] === 'ok') {
        if ($v['prueba'] === 'charla') return 'Lo confirma su charla: ' . wabot_audvinc_evidencia_texto($top, $sub) . '.';
        $sinCharla = $top ? 'Las charlas solas no lo definen' : 'Sin charla que lo pruebe';
        if ($v['prueba'] === 'nombre') return $sinCharla . '; el titular de MP («' . $sub['nombre_mp'] . '») comparte el nombre con el cliente.';
        return $sinCharla . '; la ficha de Mantenimiento nace del webhook de esta misma suscripción.';
    }
    if (!$top) return 'Ninguna charla recibió un link mensual de ' . wabot_audvinc_plata($sub['monto']) . ' en las 72 h previas al alta.';
    $n = count($e['candidatos']);
    return ($n === 1 ? 'Una charla recibió el link, pero no alcanza' : 'Hay ' . $n . ' charlas que podrían ser y ninguna se despega')
        . ' (mejor: ' . $e['puntos'] . ' puntos' . ($n > 1 ? '; segunda: ' . $e['segundo'] : '') . ').';
}

/**
 * Lo que le sirve al admin (wabot/admin.php?accion=auditar_vinculos_json), sin
 * las charlas enteras:
 *   vinculos [{id, pre, estado, prueba, motivo, texto, sugerido {id, quien, pre}, suya [{pre, texto}]}]
 *   subs     {pre: {puntos, texto, clave, tel, cliente_id, nombre, negocio, ids [...]}}  solo las de evidencia clara
 */
function wabot_audvinc_para_admin(array $r) {
    $vinculos = [];
    foreach ($r['vinculos'] as $v) {
        $suya = [];
        foreach ($v['suya'] as $s) {
            $suya[] = ['pre' => $s['pre'], 'texto' => ($s['nombre_mp'] !== '' ? $s['nombre_mp'] : 'Sin nombre') . ' · ' . wabot_audvinc_plata($s['monto']) . ' · alta ' . substr(wabot_audvinc_fecha($s['alta_ts']), 0, 5)
                . ($s['vinculada_a'] ? ' (hoy vinculada a ' . wabot_audvinc_quien($s['vinculada_a']) . ')' : '')];
        }
        $vinculos[] = [
            'id' => $v['id'], 'pre' => $v['pre'], 'estado' => $v['estado'], 'prueba' => $v['prueba'], 'motivo' => $v['motivo'],
            'texto' => wabot_audvinc_explicacion($v),
            'sugerido' => $v['sugerido'] ? ['id' => $v['sugerido']['id'], 'quien' => wabot_audvinc_quien($v['sugerido']), 'pre' => $v['sugerido']['pre'], 'clave' => $v['sugerido']['clave']] : null,
            'suya' => $suya,
        ];
    }
    $subs = [];
    foreach ($r['duenos'] as $pre => $d) {
        $top = $r['evidencias'][$pre]['candidatos'][0];
        $ch = $r['charlas'][$top['clave']];
        $subs[$pre] = [
            'puntos' => $top['puntos'], 'texto' => wabot_audvinc_evidencia_texto($top, $r['subs'][$pre]),
            'clave' => $ch['clave'], 'tels' => $ch['tels'], 'cliente_id' => $ch['cliente_id'], 'nombre' => $ch['nombre'], 'negocio' => $ch['negocio'],
            'dueno' => $d['id'], 'fichas' => $d['fichas'], 'quien' => wabot_audvinc_quien($d),
        ];
    }
    return ['ok' => true, 'ts' => $r['ts'], 'sync_ts' => $r['sync_ts'], 'resumen' => $r['resumen'], 'vinculos' => $vinculos, 'subs' => (object)$subs];
}

/* ── El informe del CLI ────────────────────────────────────────────────── */

function wabot_audvinc_sub_texto(array $s) {
    $estado = ['authorized' => '', 'paused' => ' · pausada', 'cancelled' => ' · cancelada', 'pending' => ' · sin autorizar'][$s['estado']] ?? ' · ' . $s['estado'];
    return substr($s['id'], 0, 8) . '… · ' . ($s['nombre_mp'] !== '' ? $s['nombre_mp'] : 'sin titular') . ' · ' . wabot_audvinc_plata($s['monto'])
        . ' · alta ' . wabot_audvinc_fecha($s['alta_ts']) . $estado;
}

function wabot_audvinc_informe(array $r, $detalle = false) {
    $res = $r['resumen'];
    $subs = $r['subs'];
    $l = [];
    $l[] = 'Vínculos cliente ↔ suscripción de Mercado Pago — ' . wabot_audvinc_fecha($r['ts']) . ' (solo lectura)';
    $descartadas = count(array_filter($subs, function ($s) { return $s['descartada']; }));
    $l[] = $res['total'] . ' vínculos en el admin' . ($r['sync_ts'] ? ' (lista del ' . wabot_audvinc_fecha($r['sync_ts']) . ')' : '')
        . ' · ' . count($subs) . ' suscripciones en MP (' . $descartadas . ' reintentos que no cuentan) · ' . count($r['charlas']) . ' charlas con link mensual';
    $l[] = 'Resultado: ' . $res['mal'] . ' MAL · ' . $res['sin_prueba'] . ' sin prueba · ' . $res['ok'] . ' OK ('
        . $res['ok_charla'] . ' por la charla, ' . $res['ok_nombre'] . ' por el nombre del titular, ' . $res['ok_webhook'] . ' ficha del webhook)';

    $candidatos = function (array $v) use ($r) {
        $out = [];
        foreach ($v['evidencia']['candidatos'] ?? [] as $c) {
            $d = wabot_audvinc_dueno($r['charlas'][$c['clave']], $r['lista'], $r['cache']);
            $out[] = '      ' . $c['puntos'] . ' puntos · ' . wabot_audvinc_quien($d) . ' (' . $c['clave'] . '): ' . wabot_audvinc_evidencia_texto($c, $v['sub']);
        }
        return $out;
    };
    $grupos = ['mal' => '✗ MAL: la charla dice que la suscripción es de otro', 'sin_prueba' => '? SIN PRUEBA: para mirar a mano', 'ok' => '✓ OK'];
    foreach ($grupos as $estado => $titulo) {
        $filas = array_values(array_filter($r['vinculos'], function ($v) use ($estado) { return $v['estado'] === $estado; }));
        if (!$filas) continue;
        $l[] = '';
        $l[] = $titulo . ' (' . count($filas) . ')';
        foreach ($filas as $v) {
            if ($estado === 'ok' && !$detalle) continue;
            $l[] = '  ' . wabot_audvinc_quien($v) . '  [' . $v['id'] . ']' . ($v['seguro'] ? '' : '  (sugerida por fecha en el admin, sin confirmar)');
            $l[] = '    tiene: ' . ($v['sub'] ? wabot_audvinc_sub_texto($v['sub']) : $v['pre'] . ' (no está en Mercado Pago)');
            $l[] = '    ' . wabot_audvinc_explicacion($v) . ($v['nota'] !== '' ? ' (' . $v['nota'] . ')' : '');
            if (($detalle || $estado === 'sin_prueba') && $v['sub'] && $estado !== 'ok') $l = array_merge($l, $candidatos($v));
            if ($estado === 'mal' && $v['sugerido']['pre'] !== '' && isset($subs[$v['sugerido']['pre']])) {
                $l[] = '    ' . wabot_audvinc_quien($v['sugerido']) . ' hoy tiene: ' . wabot_audvinc_sub_texto($subs[$v['sugerido']['pre']]);
            }
            foreach ($v['suya'] as $s) {
                $l[] = '    la suya, según su charla: ' . wabot_audvinc_sub_texto($subs[$s['pre']])
                    . ($s['vinculada_a'] ? '  (hoy vinculada a ' . wabot_audvinc_quien($s['vinculada_a']) . ')' : '  (hoy sin vincular)');
            }
            if ($estado === 'mal' && !$v['suya']) $l[] = '    la suya: ninguna charla la señala con claridad';
        }
        if ($estado === 'ok' && !$detalle) $l[] = '  (con --detalle, la evidencia de cada uno)';
    }
    if ($r['sin_vincular']) {
        $l[] = '';
        $l[] = '• Suscripciones vigentes sin vincular en el admin, con charla clara (' . count($r['sin_vincular']) . ')';
        foreach ($r['sin_vincular'] as $x) {
            $l[] = '  ' . wabot_audvinc_sub_texto($x['sub']);
            $l[] = '    es de ' . wabot_audvinc_quien($x['dueno']) . ' (charla ' . $x['dueno']['clave'] . ($x['dueno']['id'] !== '' ? ', ' . $x['dueno']['id'] : ', sin ficha identificada') . '): '
                . wabot_audvinc_evidencia_texto($x['evidencia']['candidatos'][0], $x['sub']);
        }
    }
    $l[] = '';
    $l[] = 'No se cambió nada. Los vínculos se corrigen en el admin: Mantenimiento → Vincular con MP.';
    return implode("\n", $l) . "\n";
}

function wabot_audvinc_cli(array $args) {
    $json = in_array('--json', $args, true);
    $detalle = in_array('--detalle', $args, true);
    foreach ($args as $a) {
        if (!in_array($a, ['--json', '--detalle'], true)) {
            fwrite(STDERR, "Uso: php wabot/auditar-vinculos.php [--detalle] [--json]\n");
            return 2;
        }
    }
    try {
        $r = wabot_audvinc_auditar();
    } catch (\Throwable $e) {
        fwrite(STDERR, 'No se pudo auditar: ' . $e->getMessage() . "\n");
        return 2;
    }
    if (!$r['vinculos']) fwrite(STDERR, "La lista de vínculos está vacía: abrí el admin (Mantenimiento) para que se la pase al bot.\n");
    if ($json) {
        unset($r['charlas'], $r['lista'], $r['cache']);
        echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
    } else {
        echo wabot_audvinc_informe($r, $detalle);
    }
    return 0;
}

if (PHP_SAPI === 'cli' && isset($argv[0]) && ($wabotAudvincYo = realpath($argv[0])) !== false && $wabotAudvincYo === realpath(__FILE__)) {
    exit(wabot_audvinc_cli(array_slice($argv, 1)));
}
