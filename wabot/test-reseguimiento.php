<?php
/**
 * Favoritos re-marcados (Pablo, 20-oct): volver a poner la estrella después del
 * seguimiento lo programa de nuevo. Si el cliente contestó aquella plantilla se
 * repite; si no, va la de la demo (si nunca le llegó) y si no, nada.
 * Solo CLI, sin red. Las fechas son fijas (octubre de 2026).
 */
require_once __DIR__ . '/test-lib.php';

$ar = function ($s) { return (int)strtotime($s . ' -03:00'); };
$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['plantillas'] = wabot_textos_default()['plantillas'];

$envio = $ar('2026-10-14 18:00:00');
$base = function ($extra = []) use ($ar, $envio) {
    return conv_nueva('TESTRESEG', array_merge([
        'favorito' => true, 'favorito_ts' => $ar('2026-10-15 11:40:00'),
        'presentado_ts' => $ar('2026-10-10 14:38:00'), 'presentado_slug' => 'amilu', 'presentado_via_bot' => true,
        'seguimiento_interesado_enviado' => true, 'seguimiento_interesado_ts' => $envio,
        'seguimiento_interesado_auto_intento_ts' => $envio, 'ultimo_cliente_ts' => $ar('2026-10-10 15:37:00'),
        'transcript' => [
            ['q' => 'cliente', 't' => 'Déjame hasta el martes', 'ts' => $ar('2026-10-10 15:37:00')],
            ['q' => 'bot', 't' => 'Hola! Era para consultarte si querías continuar', 'ts' => $envio],
        ],
    ], $extra));
};

echo "=== Quién vuelve a entrar ===\n";
$ignoro = $base();
caso('re-marcado sin contestar: le toca la de la demo, no repetir la que ignoró',
    wabot_seguimiento_interesado_plantilla($ignoro) === 'confirmacion_demo_48h');
caso('sale a los 4 días del último mensaje, a las 18 h',
    !wabot_seguimiento_interesado_corresponde($ignoro, $cfg, $ar('2026-10-18 17:59:00'))
    && wabot_seguimiento_interesado_corresponde($ignoro, $cfg, $ar('2026-10-18 18:00:00')));
$yaDemo = $base(['confirmacion_demo_enviada' => true, 'confirmacion_demo_ts' => $ar('2026-10-13 18:00:00')]);
caso('si ya recibió las dos y no contestó, no sale nada',
    wabot_seguimiento_interesado_plantilla($yaDemo) === ''
    && !wabot_seguimiento_interesado_corresponde($yaDemo, $cfg, $ar('2026-10-25 18:00:00')));
$sinDemo = $base(['presentado_ts' => 0]);
caso('sin demo y sin respuesta, tampoco', wabot_seguimiento_interesado_plantilla($sinDemo) === '');
$contesto = $base(['ultimo_cliente_ts' => $ar('2026-10-14 18:55:00')]);
$contesto['transcript'][] = ['q' => 'cliente', 't' => 'Claro que me interesa, junto el pago', 'ts' => $ar('2026-10-14 18:55:00')];
caso('si contestó aquella plantilla, se repite la misma',
    wabot_seguimiento_interesado_plantilla($contesto) === 'seguimiento_interesado'
    && wabot_seguimiento_interesado_corresponde($contesto, $cfg, $ar('2026-10-19 18:00:00')));
$sinRemarcar = $base(['favorito_ts' => $ar('2026-10-01 10:00:00')]);
caso('con la estrella puesta desde antes del envío, no se repite',
    !wabot_seguimiento_interesado_corresponde($sinRemarcar, $cfg, $ar('2026-10-25 18:00:00')));
$fallo = conv_nueva('TESTRESEG2', ['favorito' => true, 'favorito_ts' => $ar('2026-10-10 10:00:00'),
    'seguimiento_interesado_auto_intento_ts' => $envio, 'ultimo_cliente_ts' => $ar('2026-10-09 10:00:00'), 'transcript' => []]);
caso('un intento fallido sin re-marcar sigue sin reintentarse',
    !wabot_seguimiento_interesado_corresponde($fallo, $cfg, $ar('2026-10-25 18:00:00')));

echo "\n=== El envío ===\n";
$GLOBALS['WABOT_TEST_PLANTILLAS'] = [];
$c = $base();
caso('sale la de la demo', wabot_template_interesado_enviar($c, $cfg) === 'ok'
    && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1
    && $GLOBALS['WABOT_TEST_PLANTILLAS'][0][1] === $cfg['plantillas']['confirmacion_demo_48h']['nombre']);
caso('queda marcada la de la demo y sale de favoritos',
    !empty($c['confirmacion_demo_enviada']) && empty($c['favorito']) && (int)$c['seguimiento_interesado_ts'] > $envio);
caso('un segundo intento no repite', wabot_template_interesado_enviar($c, $cfg) === 'no_interesado'
    && wabot_template_interesado_enviar($c, $cfg, true) === 'ya' && count($GLOBALS['WABOT_TEST_PLANTILLAS']) === 1);
$c2 = $contesto;
caso('al que contestó le sale la de interesado otra vez', wabot_template_interesado_enviar($c2, $cfg) === 'ok'
    && $GLOBALS['WABOT_TEST_PLANTILLAS'][1][1] === $cfg['plantillas']['seguimiento_interesado']['nombre']);
$manual = $base(['favorito' => false]);
caso('desde Seguimientos, sin estrella, sigue siendo una sola vez',
    wabot_template_interesado_enviar($manual, $cfg, true) === 'ya');

todo_ok();
