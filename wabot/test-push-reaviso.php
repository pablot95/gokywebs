<?php
/**
 * Re-aviso a Pablo de las charlas que le tocan y siguen sin respuesta (16-oct-2026).
 * Auditoría de chats del 27-sep al 16-oct: Ainara, Martín y Javier quedaron
 * PABLO PENDIENTE sin respuesta; Javier aceptó el anual y escribió "Si no me
 * contestan los descarto". Sin red: charlas en memoria y un envío falso.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/push.php';

// Hoy a las 15:00 de Argentina (18:00 UTC): dentro del horario del re-aviso.
$hoy = gmdate('Y-m-d', time() - 3 * 3600);
$ahora = strtotime($hoy . ' 18:00:00 UTC');

/** Una charla que el bot le pasó a Pablo; el cliente escribió $texto hace $horas. */
function pr_conv($clave, $texto, $horas, $extra = []) {
    global $ahora;
    $ts = $ahora - (int)($horas * 3600);
    $c = conv_nueva($clave, ['handoff_pendiente' => true, 'nombre' => 'Cliente ' . $clave, 'transcript' => [
        ['q' => 'bot', 't' => 'Podés elegir entre dos planes', 'ts' => $ts - 600],
        ['q' => 'cliente', 't' => $texto, 'ts' => $ts],
    ]]);
    foreach ($extra as $k => $v) $c[$k] = $v;
    return $c;
}

echo "Urgencia\n";
caso('"Si no me contestan los descarto" → se impacienta', wabot_push_urgencia(pr_conv('A1', 'Si no me contestan los descarto', 1)) === 'se impacienta');
caso('"vamos con el anual" → eligió un plan', wabot_push_urgencia(pr_conv('A2', 'Buenísimo, vamos con el anual', 1)) === 'eligió un plan');
caso('"pasame el alias" → quiere pagar', wabot_push_urgencia(pr_conv('A3', 'Dale, pasame el alias así te transfiero', 1)) === 'quiere pagar');
caso('motivo del bot "Quiere pagar ya" → quiere pagar', wabot_push_urgencia(pr_conv('A4', 'listo', 1, ['comercial_motivo' => 'Quiere pagar ya el plan anual'])) === 'quiere pagar');
caso('una consulta común (SEO) no es urgente', wabot_push_urgencia(pr_conv('A5', 'Cómo manejan el SEO?', 1)) === '');
caso('comparar landing con catálogo no es urgente', wabot_push_urgencia(pr_conv('A6', 'Qué diferencia hay entre una landing y un catálogo?', 1)) === '');

echo "Cuándo corresponde\n";
$e = [];
caso('derivada, sin respuesta hace 2,5 h → sí', wabot_push_reaviso_corresponde(pr_conv('B1', 'Cómo manejan el SEO?', 2.5), $e, $ahora));
caso('hace 1,5 h y no es urgente → todavía no', !wabot_push_reaviso_corresponde(pr_conv('B2', 'Cómo manejan el SEO?', 1.5), $e, $ahora));
caso('hace 1,5 h y se impacienta → sí (urgente: 1 h)', wabot_push_reaviso_corresponde(pr_conv('B3', 'Si no me contestan los descarto', 1.5), $e, $ahora));
caso('hace 4 días → no (ya vive en el panel)', !wabot_push_reaviso_corresponde(pr_conv('B4', 'hola?', 96), $e, $ahora));
caso('ya re-avisado por ese mensaje → no', !wabot_push_reaviso_corresponde(pr_conv('B5', 'hola?', 3), ['B5' => $ahora - 600], $ahora));
caso('re-avisado antes de un mensaje nuevo → sí', wabot_push_reaviso_corresponde(pr_conv('B6', 'hola?', 3), ['B6' => $ahora - 5 * 3600], $ahora));
$contestada = pr_conv('B7', 'Cómo manejan el SEO?', 3);
$contestada['transcript'][] = ['q' => 'humano', 't' => 'Sí, la dejamos preparada para Google', 'ts' => $ahora - 3600];
caso('Pablo ya contestó → no', !wabot_push_reaviso_corresponde($contestada, $e, $ahora));
caso('marcada "ya le contesté" → no', !wabot_push_reaviso_corresponde(pr_conv('B8', 'hola?', 3, ['contestado_ts' => $ahora]), $e, $ahora));
caso('archivada → no', !wabot_push_reaviso_corresponde(pr_conv('B9', 'hola?', 3, ['archivado' => true]), $e, $ahora));
caso('la sigue el bot (no derivada) → no', !wabot_push_reaviso_corresponde(pr_conv('B10', 'hola?', 3, ['handoff_pendiente' => false]), $e, $ahora));

echo "La pasada del cron\n";
// El archivo de estado real del sandbox se respeta: se guarda y se repone al final.
$previo = is_file(WABOT_PUSH_REAVISO) ? file_get_contents(WABOT_PUSH_REAVISO) : null;
@unlink(WABOT_PUSH_REAVISO);
$enviados = [];
$falso = function ($t, $c, $d) use (&$enviados) { $enviados[] = [$t, $c, $d]; return 1; };

$javier = pr_conv('549JAVIER', 'Si no me contestan los descarto', 1.2, ['nombre' => 'Javier']);
$martin = pr_conv('549MARTIN', 'Cómo manejan el SEO?', 5, ['nombre' => 'Martín Méndez', 'comercial_motivo' => 'Pregunta por el SEO']);
$ainara = pr_conv('549AINARA', 'Qué diferencia hay entre una landing y un catálogo?', 30, ['nombre' => 'Ainara']);
$r = wabot_push_reaviso_correr($ahora, [$javier, $martin, $ainara], $falso);
caso('tres pendientes → UNA notificación', $r['enviado'] && count($enviados) === 1 && $r['candidatas'] === 3, json_encode($r, JSON_UNESCAPED_UNICODE));
[$titulo, $cuerpo] = $enviados[0] ?? ['', ''];
caso('el título cuenta las charlas y la urgente', $titulo === '⚠ 3 charlas te esperan (1 urgente)', $titulo);
caso('la urgente va primero, con lo que escribió', str_starts_with($cuerpo, '⚠ Javier (1 h): Si no me contestan los descarto'), $cuerpo);
caso('las demás, de la más vieja a la más nueva', strpos($cuerpo, 'Ainara (1 d)') < strpos($cuerpo, 'Martín Méndez (5 h)'), $cuerpo);

$r = wabot_push_reaviso_correr($ahora + 600, [$javier, $martin, $ainara], $falso);
caso('la pasada siguiente no repite', !$r['enviado'] && count($enviados) === 1, json_encode($r, JSON_UNESCAPED_UNICODE));

$javier['transcript'][] = ['q' => 'cliente', 't' => 'Hola???', 'ts' => $ahora + 700];
$r = wabot_push_reaviso_correr($ahora + 700 + 3700, [$javier, $martin, $ainara], $falso);
[$t2, $c2] = $enviados[1] ?? ['', ''];
caso('si vuelve a escribir, se avisa de nuevo solo esa', $r['enviado'] && $r['candidatas'] === 1 && str_starts_with($t2, '⚠ Javier · te espera hace 1 h'), $t2);
caso('una sola: dice la urgencia y los mensajes', strpos($c2, 'Se impacienta') === 0 && strpos($c2, 'Hola???') !== false, $c2);

$enviados = [];
$soloMartin = pr_conv('549MARTIN2', 'Cómo manejan el SEO?', 3, ['nombre' => 'Martín Méndez', 'comercial_motivo' => 'Pregunta por el SEO']);
wabot_push_reaviso_correr($ahora, [$soloMartin], $falso);
caso('una sola sin urgencia: ⏰ y el motivo con el que el bot la pasó',
    ($enviados[0][0] ?? '') === '⏰ Martín Méndez · te espera hace 3 h' && strpos($enviados[0][1] ?? '', 'El bot te lo pasó: Pregunta por el SEO') === 0, json_encode($enviados, JSON_UNESCAPED_UNICODE));

$enviados = [];
$noche = strtotime($hoy . ' 02:00:00 UTC'); // 23 h en Argentina
$r = wabot_push_reaviso_correr($noche, [pr_conv('549NOCHE', 'hola?', 3)], $falso);
caso('de noche no suena (de 9 a 22)', !$r['enviado'] && $enviados === [] && ($r['motivo'] ?? '') === 'fuera_de_horario', json_encode($r));

$sinDisp = function () { return 0; };
@unlink(WABOT_PUSH_REAVISO);
$r = wabot_push_reaviso_correr($ahora, [pr_conv('549SINDISP', 'hola?', 3)], $sinDisp);
caso('si no llegó a ningún celular, no la da por avisada', !$r['enviado'] && !is_file(WABOT_PUSH_REAVISO), json_encode($r));

echo "El push inmediato\n";
caso('sale marcado ⚠ cuando es urgente (el título lo arma avisar)', strpos(file_get_contents(__DIR__ . '/push.php'), "'⚠ ' . \$titulo . ' · ' . \$urgencia") !== false);

@unlink(WABOT_PUSH_REAVISO);
if ($previo !== null) file_put_contents(WABOT_PUSH_REAVISO, $previo);
todo_ok();
