<?php
/**
 * Webs dadas de baja (Pablo, 16-nov-2026: «necesito llevar una lista de las webs que vamos dando de baja…
 * la marcás vos cada vez que pasamos una web a "Web en mantenimiento"»).
 *
 * La lista vive en wabot/data/webs-bajas.json (no es pública). La carga Claude por SSH cada vez que
 * reemplaza una web por la página de mantenimiento, y la saca (o la marca reactivada) si vuelve:
 *
 *   php wabot/webs-bajas.php agregar web="Xbrake" dominio=xbrake.ar cliente="…" telefono=… monto=30000 \
 *       fecha=2026-10-28 motivo="Dejó de pagar" como="bloque SITIO DESACTIVADO en .htaccess (503)" repo=pablot95/xbrake
 *   php wabot/webs-bajas.php reactivar dominio=xbrake.ar [fecha=2026-11-20]
 *   php wabot/webs-bajas.php quitar dominio=xbrake.ar       (si se cargó por error)
 *   php wabot/webs-bajas.php listar
 *
 * 23-nov: al agregar, si el cliente se había quedado sin pagar después del aviso de 48 h
 * (pagos-vencidos.json), le llega la plantilla servicio_dado_de_baja. avisar=no la evita.
 *
 * El admin la muestra en Mantenimiento → Bajas (wabot/admin.php accion=webs_bajas). webs.php no
 * monitorea los dominios dados de baja (si no, la página de mantenimiento cuenta como caída y al
 * reactivarla el cliente recibiría «tu web volvió a funcionar»).
 */

require_once __DIR__ . '/lib.php';

const WABOT_BAJAS_ARCHIVO = WABOT_DATA . '/webs-bajas.json';

function wabot_bajas_leer() {
    $j = is_file(WABOT_BAJAS_ARCHIVO) ? json_decode((string)file_get_contents(WABOT_BAJAS_ARCHIVO), true) : null;
    $lista = is_array($j['bajas'] ?? null) ? $j['bajas'] : [];
    return array_values(array_filter($lista, 'is_array'));
}

function wabot_bajas_guardar(array $lista) {
    usort($lista, function ($a, $b) { return strcmp((string)($b['fecha'] ?? ''), (string)($a['fecha'] ?? '')); });
    $json = json_encode(['bajas' => array_values($lista)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $tmp = WABOT_BAJAS_ARCHIVO . '.tmp';
    file_put_contents($tmp, $json, LOCK_EX);
    rename($tmp, WABOT_BAJAS_ARCHIVO);
}

/** Dominio pelado (sin https://, www. ni ruta); acepta subdominios de vercel/netlify. */
function wabot_bajas_dominio($raw) {
    $d = mb_strtolower(trim((string)$raw));
    $d = preg_replace('#^[a-z]+://#', '', $d);
    $d = preg_replace('/^www\./', '', $d);
    $d = (string)preg_split('#[/?\#:\s]#', $d)[0];
    return preg_match('/^[\p{L}\p{N}][\p{L}\p{N}.-]*\.[\p{L}]{2,}$/u', $d) ? $d : '';
}

/** Los dominios dados de baja que siguen así (para que webs.php no los monitoree). */
function wabot_bajas_dominios_activos() {
    $out = [];
    foreach (wabot_bajas_leer() as $b) {
        if (empty($b['reactivada']) && !empty($b['dominio'])) $out[$b['dominio']] = true;
    }
    return $out;
}

function wabot_bajas_fecha($s) {
    $s = trim((string)$s);
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) ? $s : gmdate('Y-m-d', time() - 3 * 3600);
}

/** Agrega (o actualiza, si el dominio ya está) una baja. Devuelve la fila. */
function wabot_bajas_agregar(array $d) {
    $dominio = wabot_bajas_dominio($d['dominio'] ?? '');
    $web = trim((string)($d['web'] ?? ''));
    if ($dominio === '' && $web === '') throw new InvalidArgumentException('Falta web= o dominio=.');
    $limpio = function ($s, $max) { return mb_substr(trim(preg_replace('/\s+/u', ' ', (string)$s)), 0, $max); };
    $lista = wabot_bajas_leer();
    $i = null;
    foreach ($lista as $k => $b) {
        if (($dominio !== '' && ($b['dominio'] ?? '') === $dominio) || ($dominio === '' && mb_strtolower($b['web'] ?? '') === mb_strtolower($web))) { $i = $k; break; }
    }
    $previa = $i !== null ? $lista[$i] : [];
    $fila = [
        'web'        => $limpio($web !== '' ? $web : ($previa['web'] ?? $dominio), 80),
        'dominio'    => $dominio !== '' ? $dominio : ($previa['dominio'] ?? ''),
        'cliente'    => $limpio($d['cliente'] ?? ($previa['cliente'] ?? ''), 80),
        'telefono'   => $limpio($d['telefono'] ?? ($previa['telefono'] ?? ''), 30),
        'monto'      => (int)preg_replace('/\D+/', '', (string)($d['monto'] ?? ($previa['monto'] ?? 0))),
        'fecha'      => wabot_bajas_fecha($d['fecha'] ?? ($previa['fecha'] ?? '')),
        'motivo'     => $limpio($d['motivo'] ?? ($previa['motivo'] ?? ''), 200),
        'como'       => $limpio($d['como'] ?? ($previa['como'] ?? ''), 200),
        'repo'       => $limpio($d['repo'] ?? ($previa['repo'] ?? ''), 80),
        'reactivada' => '',
        'ts'         => time(),
    ];
    if ($i !== null) $lista[$i] = $fila; else $lista[] = $fila;
    wabot_bajas_guardar($lista);
    if (strtolower(trim((string)($d['avisar'] ?? ''))) !== 'no') $fila['aviso_cliente'] = wabot_bajas_avisar_cliente($fila);
    return $fila;
}

/**
 * El aviso de baja al cliente (23-nov, Pablo: «sí, un aviso de baja»): solo si el cliente está en
 * pagos-vencidos.json (se le venció el plazo de 48 h para pagar) y todavía no lo recibió. Se lo
 * busca por teléfono o por el dominio de la lista de webs. Devuelve el resultado o '' si no corresponde.
 */
function wabot_bajas_avisar_cliente(array $fila, $enviar = null) {
    require_once __DIR__ . '/renovacion.php';
    $vencidos = wabot_pagos_vencidos_leer();
    if (!$vencidos) return '';
    $idsDominio = [];
    if (($fila['dominio'] ?? '') !== '') {
        $webs = $GLOBALS['WABOT_TEST_WEBS'] ?? (array)(json_decode((string)@file_get_contents(WABOT_DATA . '/webs.json'), true)['lista'] ?? []);
        foreach ($webs as $w) {
            if (is_array($w) && wabot_bajas_dominio($w['dominio'] ?? '') === $fila['dominio']) $idsDominio[(string)($w['id'] ?? '')] = true;
        }
    }
    $t8 = wabot_pagos_tel8($fila['telefono'] ?? '');
    foreach ($vencidos as $id => $v) {
        if (!is_array($v) || !empty($v['avisado_baja'])) continue;
        $porTel = strlen($t8) === 8 && wabot_pagos_tel8($v['tel'] ?? '') === $t8;
        if (!$porTel && !isset($idsDominio[(string)$id])) continue;
        $r = wabot_pagos_plantilla_cliente($v, 'servicio_dado_de_baja', wabot_pagos_nombre_negocio($v), wabot_config_load(), 'servicio_baja:' . $id, $enviar);
        if (wabot_pagos_resultado_final($r)) {
            $vencidos[$id]['avisado_baja'] = time();
            $vencidos[$id]['avisado_res'] = $r;
            wabot_pagos_vencidos_guardar($vencidos);
        }
        wabot_log('servicio_baja_cliente', ['id' => $id, 'tel' => $v['tel'] ?? '', 'dominio' => $fila['dominio'] ?? '', 'resultado' => $r]);
        return $r;
    }
    return '';
}

/** Marca reactivada (queda en la lista como historia) o la quita. Devuelve si la encontró. */
function wabot_bajas_cerrar($dominioOWeb, $quitar = false, $fecha = '') {
    $q = wabot_bajas_dominio($dominioOWeb) ?: mb_strtolower(trim((string)$dominioOWeb));
    $lista = wabot_bajas_leer();
    $encontrada = false;
    foreach ($lista as $k => $b) {
        if (($b['dominio'] ?? '') !== $q && mb_strtolower($b['web'] ?? '') !== $q) continue;
        $encontrada = true;
        if ($quitar) unset($lista[$k]);
        else { $lista[$k]['reactivada'] = wabot_bajas_fecha($fecha); $lista[$k]['ts'] = time(); }
    }
    if ($encontrada) wabot_bajas_guardar($lista);
    return $encontrada;
}

/* ─────────────────── CLI ─────────────────── */
if (PHP_SAPI === 'cli' && realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    $accion = $argv[1] ?? 'listar';
    $args = [];
    foreach (array_slice($argv, 2) as $a) {
        if (strpos($a, '=') === false) continue;
        [$k, $v] = explode('=', $a, 2);
        $args[$k] = $v;
    }
    try {
        if ($accion === 'agregar') {
            echo json_encode(wabot_bajas_agregar($args), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";
        } elseif ($accion === 'reactivar' || $accion === 'quitar') {
            $ok = wabot_bajas_cerrar($args['dominio'] ?? ($args['web'] ?? ''), $accion === 'quitar', $args['fecha'] ?? '');
            echo $ok ? "OK\n" : "No está en la lista.\n";
            exit($ok ? 0 : 1);
        } else {
            foreach (wabot_bajas_leer() as $b) {
                echo $b['fecha'], '  ', $b['web'], $b['dominio'] ? " ({$b['dominio']})" : '', $b['cliente'] ? " · {$b['cliente']}" : '',
                    $b['reactivada'] ? "  [reactivada {$b['reactivada']}]" : '', "\n";
            }
        }
    } catch (Throwable $e) {
        fwrite(STDERR, $e->getMessage() . "\n");
        exit(1);
    }
}
