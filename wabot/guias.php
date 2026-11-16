<?php
/**
 * wabot/guias.php — la guía de cada web (Perfil de Negocio de Google, Google Ads, QR) en PDF,
 * mandada por la plantilla de Utilidad `guias_web`, con el PDF como encabezado (Pablo, 16-nov:
 * «se podrían mandar por plantilla, en wabot?» → «PDF adjunto»).
 *
 * Solo por consola (ssh), nunca sola: la lista la arma Claude y la aprueba Pablo.
 *   php guias.php listar                 clientes activos de Mantenimiento (data/webs.json) y si ya la recibieron
 *   php guias.php probar <envio.json>    lo que mandaría, sin mandar nada
 *   php guias.php enviar <envio.json>    manda, de a uno, y anota en data/guias-enviadas.json
 *   php guias.php qr probar|enviar       el QR como imagen a los que ya la recibieron y tienen la ventana de 24 h abierta
 *
 * envio.json: [{"id": "clientes:abc", "pdf": "instructivos-x.pdf", "negocio": "X"}]
 *   id      la fila de data/webs.json (la que manda el admin: activos, sin bajas ni pausados)
 *   pdf     el archivo en /guias/ del sitio (https://gokywebs.com/guias/<pdf>)
 *   negocio cómo se nombra en el mensaje y en el nombre del archivo
 *   saludo  (opcional) el {{1}} del «Hola …»; si no está, el nombre de la ficha
 *
 * No se manda (Pablo, 16-nov: «no enviarle a los que tengan pago atrasado o hayan cancelado»):
 *   - si la fila ya no está en webs.json (baja o pausa en el admin),
 *   - si tiene un cobro de Mercado Pago rechazado en los últimos 40 días (data/cobros-rechazados.json),
 *   - si ya la recibió, o si el PDF no está publicado.
 * Los que pagan por afuera y están atrasados no los sabe el bot: esos se sacan de la lista antes.
 */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/webs.php';
require_once __DIR__ . '/cobros-rechazados.php';

const WABOT_GUIAS_URL = 'https://gokywebs.com/guias/';
const WABOT_GUIAS_DIR = __DIR__ . '/../guias';
const WABOT_GUIAS_ENVIADAS = WABOT_DATA . '/guias-enviadas.json';
const WABOT_GUIAS_COBRO_DIAS = 40;
const WABOT_GUIAS_PLANTILLA = [
    'nombre' => 'guias_web', 'idioma' => 'es_AR', 'activa' => true,
    'params' => ['nombre', 'negocio'],
    'texto'  => 'Hola {nombre}, te paso la guía de la web de {negocio}: cómo aparecer en Google Maps con el Perfil de Negocio, cómo hacer publicidad en Google y el código QR de tu web para imprimir. Cualquier duda, escribime por acá.',
];

function wabot_guias_enviadas() {
    $j = is_file(WABOT_GUIAS_ENVIADAS) ? json_decode((string)file_get_contents(WABOT_GUIAS_ENVIADAS), true) : null;
    return is_array($j) ? $j : [];
}

/** Ids con un cobro rechazado reciente. */
function wabot_guias_con_cobro_rechazado($ahora) {
    $ids = [];
    foreach ((array)(wabot_cobro_rech_estado()['enviados'] ?? []) as $e) {
        if (!empty($e['id']) && (int)($e['ts'] ?? 0) > $ahora - WABOT_GUIAS_COBRO_DIAS * 86400) $ids[$e['id']] = true;
    }
    return $ids;
}

/** Qué pasaría con cada fila de envio.json: [fila, item, motivo] con motivo '' si sale. */
function wabot_guias_plan(array $envio, $ahora) {
    $porId = [];
    foreach (wabot_webs_estado()['lista'] as $f) $porId[$f['id']] = $f;
    $enviadas = wabot_guias_enviadas();
    $cobro = wabot_guias_con_cobro_rechazado($ahora);
    $plan = [];
    foreach ($envio as $it) {
        $id = (string)($it['id'] ?? '');
        $pdf = basename((string)($it['pdf'] ?? ''));
        $f = $porId[$id] ?? null;
        $motivo = '';
        if (!$f) $motivo = 'no_activo';
        elseif (!empty($enviadas[$id]['ok'])) $motivo = 'ya_enviada';
        elseif (isset($cobro[$id])) $motivo = 'cobro_rechazado';
        elseif ($f['tel'] === '') $motivo = 'sin_tel';
        elseif ($pdf === '' || !preg_match('/\.pdf$/i', $pdf) || !is_file(WABOT_GUIAS_DIR . '/' . $pdf)) $motivo = 'sin_pdf';
        $plan[] = [$f, $it + ['pdf' => $pdf], $motivo];
    }
    return $plan;
}

$modo = $argv[1] ?? '';
$ahora = time();

if ($modo === 'listar') {
    $enviadas = wabot_guias_enviadas();
    $cobro = wabot_guias_con_cobro_rechazado($ahora);
    foreach (wabot_webs_estado()['lista'] as $f) {
        echo implode(' | ', [$f['id'], $f['negocio'], $f['persona'], $f['dominio'], $f['tel'],
            !empty($enviadas[$f['id']]['ok']) ? 'YA' : '-', isset($cobro[$f['id']]) ? 'COBRO_RECHAZADO' : '-']), "\n";
    }
    exit(0);
}

/* El QR como imagen (Pablo, 16-nov: «todos me piden el qr ... que se envíe ahora que la gente contestó y
 * hay ventana abierta»). Texto libre: solo a los que ya recibieron la guía y escribieron en las últimas
 * 24 h, por WhatsApp. php guias.php qr probar|enviar. El PNG es /guias/qr-<lo mismo que el PDF>.png. */
const WABOT_GUIAS_PDF_TEXTO = 'Te reenvío la guía: en algunos celulares el texto no se veía. Esta versión ya se ve bien.';
const WABOT_GUIAS_QR_TEXTO = 'Te paso también el código QR de tu web, en alta calidad para imprimir: tarjetas, el local, el vehículo, bolsas o flyers. Dejale siempre el margen blanco alrededor para que se lea bien.';
if ($modo === 'qr') {
    $enviar = ($argv[2] ?? '') === 'enviar';
    $negocios = [];
    foreach ((array)json_decode((string)@file_get_contents(WABOT_DATA . '/guias-envio.json'), true) as $it) $negocios[$it['id'] ?? ''] = $it['negocio'] ?? '';
    $enviadas = wabot_guias_enviadas();
    $cuenta = [];
    foreach ($enviadas as $id => $e) {
        if (empty($e['ok']) || !empty($e['qr_ok'])) continue;
        $png = WABOT_GUIAS_DIR . '/' . preg_replace('/^instructivos-(.*)\.pdf$/', 'qr-$1.png', (string)$e['pdf']);
        $clave = wabot_renovacion_clave((string)$e['tel'], $motivo);
        $r = 'ok';
        if (!is_file($png)) $r = 'sin_png';
        elseif ($clave === null || !wabot_conv_existe($clave)) $r = 'sin_chat';
        else {
            $conv = wabot_conv_load($clave);
            if (wabot_canal($conv) === 'instagram') $r = 'instagram';
            elseif (wabot_ventana_restante($conv) <= 0) $r = 'ventana_cerrada';
        }
        if ($r === 'ok' && $enviar) {
            $lock = wabot_lock_tomar($clave);
            if (!$lock) $r = 'ocupado';
            else try {
                $conv = wabot_conv_load($clave);
                // Primero la guía de nuevo (16-nov: la primera salió con fuentes Type3 que los visores de
                // Android no dibujan, se veía en blanco); después el QR.
                $pdf = WABOT_GUIAS_DIR . '/' . basename((string)$e['pdf']);
                $nombrePdf = 'Guía ' . ($negocios[$id] ?? basename($pdf, '.pdf'));
                $pdfBytes = empty($e['pdf2_ok']) ? (string)@file_get_contents($pdf) : '';
                $pdfId = $pdfBytes !== '' ? wabot_wa_media_subir($pdfBytes, 'application/pdf', basename($pdf)) : null;
                if ($pdfId && wabot_wa_send_document(wabot_channel_user_id($conv), $pdfId, $nombrePdf, WABOT_GUIAS_PDF_TEXTO)) {
                    wabot_conv_transcript($conv, 'bot', '[documento] ' . wabot_documento_nombre($nombrePdf) . "
" . WABOT_GUIAS_PDF_TEXTO);
                    $enviadas[$id]['pdf2_ok'] = true;
                }
                $bytes = (string)file_get_contents($png);
                $mediaId = wabot_wa_media_subir($bytes, 'image/png', basename($png));
                if (!$mediaId || !wabot_wa_send_image(wabot_channel_user_id($conv), $mediaId, WABOT_GUIAS_QR_TEXTO)) { $r = 'error'; wabot_conv_save($conv); }
                else {
                    $guardado = wabot_media_guardar(wabot_conversation_key($conv), $bytes, 'image/png', 'imagen');
                    wabot_conv_transcript($conv, 'bot', WABOT_GUIAS_QR_TEXTO, $guardado);
                    wabot_conv_save($conv);
                    wabot_log('guia_qr_enviado', ['tel' => $conv['tel'] ?? '', 'png' => basename($png)]);
                    $enviadas[$id]['qr_ok'] = true; $enviadas[$id]['qr_ts'] = time();
                    file_put_contents(WABOT_GUIAS_ENVIADAS, json_encode($enviadas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
                }
            } finally { wabot_lock_soltar($lock); }
            sleep(1);
        }
        $cuenta[$r] = ($cuenta[$r] ?? 0) + 1;
        echo strtoupper($r) . ": $id | {$e['tel']} | " . basename($png) . "\n";
    }
    echo json_encode($cuenta), "\n";
    exit(0);
}

/* QR por plantilla a los que tienen la ventana cerrada (Pablo, 16-nov: «Sí, armala»): `guia_qr_web` (QR de
 * encabezado, botón «Ver la guía» a /guias/<pdf>, que ya es la versión que se ve en Android).
 * php guias.php qrplantilla probar|enviar. Saltea Instagram y a los que ya tienen el QR. */
const WABOT_GUIAS_QR_PLANTILLA = [
    'nombre' => 'guia_qr_web', 'idioma' => 'es_AR', 'activa' => true,
    'params' => ['nombre', 'negocio'], 'boton' => ['guia_pdf'],
    'texto'  => 'Hola {nombre}, te paso el código QR de la web de {negocio} en alta calidad para imprimir (tarjetas, el local, el vehículo o flyers). También te reenvío la guía, porque en algunos celulares el texto no se veía: la abrís con el botón de abajo.',
];
if ($modo === 'qrplantilla') {
    $enviar = ($argv[2] ?? '') === 'enviar';
    $cfg = wabot_config_load();
    $cfg['plantillas']['guia_qr'] = WABOT_GUIAS_QR_PLANTILLA;
    $envio = [];
    foreach ((array)json_decode((string)@file_get_contents(WABOT_DATA . '/guias-envio.json'), true) as $it) $envio[$it['id'] ?? ''] = $it;
    $porId = [];
    foreach (wabot_webs_estado()['lista'] as $f) $porId[$f['id']] = $f;
    $enviadas = wabot_guias_enviadas();
    $cuenta = [];
    foreach ($enviadas as $id => $e) {
        if (empty($e['ok']) || !empty($e['qr_ok'])) continue;
        $png = WABOT_GUIAS_DIR . '/' . preg_replace('/^instructivos-(.*)\.pdf$/', 'qr-$1.png', (string)$e['pdf']);
        $f = $porId[$id] ?? null;
        $clave = wabot_renovacion_clave((string)$e['tel'], $motivo);
        $r = 'ok';
        if (!$f) $r = 'no_activo';
        elseif (!is_file($png)) $r = 'sin_png';
        elseif ($clave === null || !wabot_conv_existe($clave)) $r = 'sin_chat';
        elseif (wabot_canal(wabot_conv_load($clave)) === 'instagram') $r = 'instagram';
        if ($r === 'ok' && $enviar) {
            $imgId = wabot_wa_media_subir((string)file_get_contents($png), 'image/png', basename($png));
            $it = $envio[$id] ?? [];
            $lock = $imgId ? wabot_lock_tomar($clave) : null;
            if (!$imgId) $r = 'error_subida';
            elseif (!$lock) $r = 'ocupado';
            else try {
                $conv = wabot_conv_load($clave);
                $conv['guia_pdf'] = basename((string)$e['pdf']);   // el {{1}} del botón
                $valores = ['negocio' => $it['negocio'] ?? $f['negocio'], '_documento' => ['imagen_id' => $imgId]];
                if (!empty($it['saludo'])) $valores['nombre'] = $it['saludo'];
                if (!wabot_enviar_plantilla($conv, 'guia_qr', $cfg, $valores)) $r = 'error';
                else {
                    wabot_conv_save($conv);
                    $enviadas[$id]['qr_ok'] = true; $enviadas[$id]['qr_ts'] = time(); $enviadas[$id]['qr_plantilla'] = true;
                    file_put_contents(WABOT_GUIAS_ENVIADAS, json_encode($enviadas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
                }
            } finally { wabot_lock_soltar($lock); }
            sleep(2);
        }
        $cuenta[$r] = ($cuenta[$r] ?? 0) + 1;
        echo strtoupper($r) . ": $id | {$e['tel']} | " . basename($png) . "\n";
    }
    echo json_encode($cuenta), "\n";
    exit(0);
}

if ($modo !== 'probar' && $modo !== 'enviar') {
    fwrite(STDERR, "uso: php guias.php listar | probar <envio.json> | enviar <envio.json>\n");
    exit(2);
}
$envio = json_decode((string)@file_get_contents($argv[2] ?? ''), true);
if (!is_array($envio)) { fwrite(STDERR, "envio.json ilegible\n"); exit(2); }

$cfg = wabot_config_load();
$cfg['plantillas']['guia_web'] = WABOT_GUIAS_PLANTILLA;
$enviadas = wabot_guias_enviadas();
$cuenta = ['ok' => 0, 'salteado' => 0, 'error' => 0];

foreach (wabot_guias_plan($envio, $ahora) as [$f, $it, $motivo]) {
    $negocio = trim((string)($it['negocio'] ?? '')) ?: ($f['negocio'] ?? '');
    $linea = ($it['id'] ?? '?') . ' | ' . $negocio . ' | ' . ($f['tel'] ?? '') . ' | ' . $it['pdf'];
    if ($motivo !== '') { echo "SALTEADO ($motivo): $linea\n"; $cuenta['salteado']++; continue; }
    $valores = [
        // «saludo» en envio.json pisa el nombre de la ficha (emojis, apodos, el negocio en lugar de la persona).
        'nombre'  => array_key_exists('saludo', $it) && trim((string)$it['saludo']) !== '' ? trim((string)$it['saludo']) : wabot_webs_nombre($f),
        'negocio' => $negocio,
        '_documento' => ['link' => WABOT_GUIAS_URL . rawurlencode($it['pdf']), 'filename' => 'Guía ' . $negocio],
    ];
    if ($modo === 'probar') { echo "SALDRÍA: $linea | Hola {$valores['nombre']}\n"; continue; }

    $r = wabot_webs_enviar($f, 'guia_web', $valores, $cfg);
    $enviadas[$f['id']] = ['ts' => time(), 'ok' => $r === 'ok', 'resultado' => $r, 'pdf' => $it['pdf'], 'tel' => $f['tel']];
    file_put_contents(WABOT_GUIAS_ENVIADAS, json_encode($enviadas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    echo strtoupper($r) . ": $linea\n";
    $cuenta[$r === 'ok' ? 'ok' : 'error']++;
    sleep(2);
}
echo json_encode($cuenta), "\n";
