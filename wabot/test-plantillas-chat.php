<?php
/** Regresión del historial de plantillas y del refresco del panel. Solo CLI, sin red. */
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();
$cfg['plantillas'] = wabot_textos_default()['plantillas'];
$clave = 'TESTPLANTILLASCHAT' . bin2hex(random_bytes(6));
$ahora = time();
$c = conv_nueva($clave, ['favorito' => true, 'transcript' => [
    ['q' => 'cliente', 't' => 'Consulta anterior', 'ts' => $ahora - 100],
]]);

try {
    caso('se guarda la conversación inicial', wabot_conv_save($c));
    $copiaDelPanel = wabot_conv_load($clave);
    $GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
    caso('Meta acepta el seguimiento simulado', wabot_template_interesado_enviar($c, $cfg) === 'ok');
    caso('el cuerpo aprobado queda identificado como plantilla',
        $c['transcript'][1]['t'] === 'Hola, cómo estás?'
        && $c['transcript'][1]['plantilla'] === 'seguimiento_interesado');
    caso('se persiste el envío', wabot_conv_save($c));

    // El panel había leído ANTES del envío y termina su petición DESPUÉS.
    // Guardar $copiaDelPanel, como hacía admin.php, borraba el seguimiento.
    $hasta = (int)end($copiaDelPanel['transcript'])['ts'];
    caso('el refresco marca leído usando la versión actual', wabot_conv_marcar_visto($clave, $hasta));
    $actual = wabot_conv_load($clave);
    caso('no se pierde ni el mensaje ni su marca de envío',
        count($actual['transcript']) === 2 && !empty($actual['seguimiento_interesado_enviado']));
    caso('no se marca leído el mensaje nuevo que el panel todavía no recibió',
        (int)$actual['panel_visto_ts'] === $hasta);
    caso('no se vuelve a enviar al refrescar', count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1);

    $lock = wabot_lock_tomar($clave);
    try {
        caso('si hay un envío en curso, el refresco no escribe', !wabot_conv_marcar_visto($clave, $ahora));
    } finally { wabot_lock_soltar($lock); }
    caso('el siguiente refresco sí marca el mensaje como visto', wabot_conv_marcar_visto($clave, $ahora));
    caso('una petición atrasada no retrocede la marca de lectura',
        wabot_conv_marcar_visto($clave, $hasta) && wabot_conv_load($clave)['panel_visto_ts'] === $ahora);

    $viejo = conv_nueva($clave, ['seguimiento_interesado_enviado' => true,
        'seguimiento_interesado_ts' => $ahora - 50, 'transcript' => [
            ['q' => 'cliente', 't' => 'Sí, gracias', 'ts' => $ahora - 10],
        ]]);
    $completo = wabot_transcript_completo($clave, $viejo);
    caso('un envío antiguo sin texto vuelve a ser visible antes de la respuesta',
        count($completo) === 2 && !empty($completo[0]['recuperado'])
        && $completo[0]['ts'] === $ahora - 50 && $completo[1]['q'] === 'cliente');
    caso('no inventa el cuerpo ni afirma entrega al destinatario',
        strpos($completo[0]['t'], 'El texto original no quedó guardado') !== false
        && strpos($completo[0]['t'], 'Hola, cómo estás?') === false);
    caso('recuperar no modifica ni reenvía la conversación',
        count($viejo['transcript']) === 1 && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1);
    caso('la recuperación es idempotente', wabot_transcript_plantillas_recuperar($completo, $viejo) === $completo);
    $intento = $viejo;
    unset($intento['seguimiento_interesado_enviado']);
    $intento['seguimiento_interesado_auto_intento_ts'] = $ahora - 50;
    caso('un intento del cron no se presenta como envío', count(wabot_transcript_completo($clave, $intento)) === 1);
    $sinFecha = $viejo;
    unset($sinFecha['seguimiento_interesado_ts']);
    caso('sin fecha no se fabrica una fecha de envío', count(wabot_transcript_completo($clave, $sinFecha)) === 1);
    $ig = $viejo; $ig['canal'] = 'instagram';
    caso('no reconstruye plantillas de WhatsApp en Instagram', count(wabot_transcript_completo($clave, $ig)) === 1);

    $existente = $viejo;
    array_unshift($existente['transcript'], ['q' => 'bot', 't' => 'Hola, cómo estás?', 'ts' => $ahora - 50]);
    caso('no duplica el cuerpo antiguo que sí estaba guardado', count(wabot_transcript_completo($clave, $existente)) === 2);
    caso('no duplica las plantillas nuevas identificadas', count(wabot_transcript_completo($clave, $actual)) === 2);
    wabot_historial_guardar($clave, [$existente['transcript'][0]]);
    caso('busca también en el historial archivado antes de recuperar',
        count(wabot_transcript_completo($clave, $viejo)) === 2
        && empty(wabot_transcript_completo($clave, $viejo)[0]['recuperado']));
    @unlink(wabot_historial_path($clave));

    $demo = conv_nueva($clave, ['confirmacion_demo_enviada' => true, 'confirmacion_demo_ts' => $ahora - 50]);
    caso('también recupera la constancia de seguimiento de demo',
        wabot_transcript_completo($clave, $demo)[0]['plantilla'] === 'confirmacion_demo_48h');
    $apagada = conv_nueva($clave, ['favorito' => true]);
    $cfg['plantillas']['seguimiento_interesado']['activa'] = false;
    caso('una plantilla rechazada no deja una burbuja de envío',
        wabot_template_interesado_enviar($apagada, $cfg) === 'error'
        && $apagada['transcript'] === [] && empty($apagada['seguimiento_interesado_enviado']));
} finally {
    @unlink(wabot_conv_path($clave));
    @unlink(wabot_historial_path($clave));
    @unlink(WABOT_DATA . '/lock/' . $clave . '.lock');
}

todo_ok();
