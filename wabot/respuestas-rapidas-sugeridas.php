<?php
/**
 * Respuestas rápidas sugeridas (4-oct-2026).
 *
 * Pablo: "que según el último mensaje del usuario, se me recomiende 1 o 2
 * respuestas". Cuando lo último de la charla es del cliente, OpenAI lee el
 * final de la charla y elige de la lista de respuestas rápidas la o las que
 * Pablo podría mandar. Solo elige ids de la lista (el esquema no deja otra
 * cosa): no redacta nada, y en el panel la sugerencia se copia al editor como
 * cualquier respuesta rápida, nunca se envía sola.
 *
 * Sin key de OpenAI o con el circuito abierto, no se sugiere nada y el panel
 * sigue igual. La elección queda guardada por charla en data/rr-sugeridas/
 * hasta que el cliente escriba otra cosa o cambie la lista.
 */

/**
 * La lista tal como la ve el panel en esta charla (mismo orden y mismos
 * filtros que wabot_respuestas_rapidas_visibles), con los textos SIN completar
 * los montos: así las instrucciones son iguales para todas las charlas y
 * OpenAI las cobra de caché. Ids "categoría.ítem", base 0.
 */
function wabot_rr_sugeridas_catalogo($categorias, $conv) {
    $lista = [];
    $c = 0;
    foreach ((array)$categorias as $categoria) {
        if (!empty($categoria['oculta'])) continue;
        if (($categoria['titulo'] ?? '') === 'Propiedad absoluta del código'
            && !wabot_rr_03oct_pidio_codigo($conv)) continue;
        $items = array_values((array)($categoria['items'] ?? []));
        if (!$items) continue;
        foreach ($items as $i => $texto) {
            $lista[] = ['id' => $c . '.' . $i, 'categoria' => (string)($categoria['titulo'] ?? ''), 'texto' => (string)$texto];
        }
        $c++;
    }
    return $lista;
}

/**
 * Los mensajes del cliente que todavía no tienen respuesta (los últimos, desde
 * lo último que dijo el bot o Pablo). Vacío si lo último no es del cliente.
 */
function wabot_rr_sugeridas_pendientes($conv) {
    $pendientes = [];
    $filas = (array)($conv['transcript'] ?? []);
    for ($i = count($filas) - 1; $i >= 0; $i--) {
        $q = (string)($filas[$i]['q'] ?? '');
        if ($q === 'sistema') continue;
        if ($q !== 'cliente') break;
        $texto = trim((string)($filas[$i]['t'] ?? ''));
        if ($texto !== '') array_unshift($pendientes, ['ts' => (int)($filas[$i]['ts'] ?? 0), 't' => $texto]);
    }
    return $pendientes;
}

function wabot_rr_sugeridas_instrucciones($catalogo) {
    $lineas = [];
    foreach ($catalogo as $r) {
        // Los bloques de precio son largos y se distinguen por la primera frase.
        $texto = preg_replace('/\s+/u', ' ', $r['texto']);
        if (mb_strlen($texto) > 260) $texto = mb_substr($texto, 0, 257) . '…';
        $lineas[] = '[' . $r['id'] . '] (' . $r['categoria'] . ') ' . $texto;
    }
    return "Ayudás a Pablo, que contesta a mano los WhatsApp de Gokywebs (hacemos páginas web: sitio profesional, tienda online, plataforma de cursos y web inmobiliaria). "
        . "Te paso el final de una charla. Elegí de la lista de abajo la o las respuestas rápidas que Pablo podría mandar AHORA para contestar lo último que escribió el cliente.\n\n"
        . "Reglas:\n"
        . "- Solo ids de la lista. No redactes nada.\n"
        . "- Una sola si alcanza. Dos solo si el cliente preguntó dos cosas, o si hay dos opciones razonables (por ejemplo, no está claro si le conviene el sitio profesional o la tienda).\n"
        . "- Si ninguna contesta bien lo que escribió el cliente, devolvé la lista vacía. Mejor vacía que una que no corresponde.\n"
        . "- Tené en cuenta lo que ya pasó: no repitas lo que ya se le dijo (el precio, el formulario, los links) salvo que lo vuelva a pedir, y no saludes si ya se saludó.\n"
        . "- Para el precio, elegí el bloque del tipo de web que corresponde a lo que contó el cliente.\n"
        . "- Lo que está entre llaves ({sena}, {landing_unico}…) son montos que el panel completa solo.\n\n"
        . "LISTA DE RESPUESTAS RÁPIDAS\n" . implode("\n", $lineas);
}

/** El final de la charla, con quién dijo qué. Los mensajes sin respuesta van marcados. */
function wabot_rr_sugeridas_entrada($conv, $pendientes) {
    $quien = ['cliente' => 'Cliente', 'bot' => 'Bot', 'humano' => 'Pablo'];
    $filas = array_values(array_filter((array)($conv['transcript'] ?? []), function ($t) use ($quien) {
        return isset($quien[$t['q'] ?? '']) && trim((string)($t['t'] ?? '')) !== '';
    }));
    $filas = array_slice($filas, -(14 + count($pendientes)));
    $sinRespuesta = count($pendientes);
    $texto = [];
    foreach ($filas as $n => $t) {
        $msg = preg_replace('/\s+/u', ' ', trim((string)$t['t']));
        if (mb_strlen($msg) > 500) $msg = mb_substr($msg, 0, 497) . '…';
        $marca = $n >= count($filas) - $sinRespuesta ? ' [SIN RESPUESTA]' : '';
        $texto[] = $quien[$t['q']] . $marca . ': ' . $msg;
    }
    return "FINAL DE LA CHARLA (lo de abajo es lo más reciente)\n" . implode("\n", $texto);
}

function wabot_rr_sugeridas_archivo($conv) {
    $clave = preg_replace('/[^0-9A-Za-z]/', '', (string)wabot_conversation_key($conv));
    $dir = (string)($GLOBALS['WABOT_TEST_RR_SUGERIDAS_DIR'] ?? (WABOT_DATA . '/rr-sugeridas'));
    return $dir . '/' . ($clave !== '' ? $clave : 'sin-clave') . '.json';
}

/**
 * Las 0, 1 o 2 sugerencias para la charla: ['ids' => ['2.0'], 'estado' => …].
 * Estados: 'listo' (con o sin ids), 'sin_pendiente' (lo último no es del
 * cliente), 'no_disponible' (sin key o circuito abierto), 'error'.
 */
function wabot_rr_sugeridas($conv, $categorias, $cfg) {
    $pendientes = wabot_rr_sugeridas_pendientes($conv);
    if (!$pendientes) return ['ids' => [], 'estado' => 'sin_pendiente'];

    $catalogo = wabot_rr_sugeridas_catalogo($categorias, $conv);
    if (!$catalogo) return ['ids' => [], 'estado' => 'listo'];
    $ids = array_column($catalogo, 'id');
    $firma = sha1(json_encode([$pendientes, $catalogo, wabot_openai_modelo($cfg)], JSON_UNESCAPED_UNICODE));

    $archivo = wabot_rr_sugeridas_archivo($conv);
    $guardado = json_decode((string)@file_get_contents($archivo), true);
    if (is_array($guardado) && ($guardado['firma'] ?? '') === $firma) {
        return ['ids' => array_values(array_intersect((array)($guardado['ids'] ?? []), $ids)), 'estado' => 'listo'];
    }
    if (!wabot_openai_disponible()) return ['ids' => [], 'estado' => 'no_disponible'];

    $schema = [
        'type' => 'object',
        'properties' => ['ids' => ['type' => 'array', 'items' => ['type' => 'string', 'enum' => $ids]]],
        'required' => ['ids'],
        'additionalProperties' => false,
    ];
    $r = wabot_openai_llamar('sugerir_respuestas', wabot_rr_sugeridas_instrucciones($catalogo),
        [['role' => 'user', 'content' => wabot_rr_sugeridas_entrada($conv, $pendientes)]],
        ['type' => 'json_schema', 'name' => 'wabot_respuestas_sugeridas', 'strict' => true, 'schema' => $schema], $cfg,
        ['usuario' => wabot_conversation_key($conv), 'max_tokens' => 900, 'esfuerzo' => 'low']);
    if (!$r['ok'] || !is_array($r['datos'])) return ['ids' => [], 'estado' => 'error'];

    $elegidas = array_slice(array_values(array_unique(array_intersect((array)($r['datos']['ids'] ?? []), $ids))), 0, 2);
    wabot_json_guardar_atomico($archivo, ['firma' => $firma, 'ids' => $elegidas, 'ts' => time()]);
    return ['ids' => $elegidas, 'estado' => 'listo'];
}
