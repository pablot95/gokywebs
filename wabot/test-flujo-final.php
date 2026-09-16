<?php
require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

echo "— Flujo comercial final: pregunta, cotiza y se detiene —\n";

$c = conv_nueva('549110000FINALTEST', ['fase' => 'menu']);
clasifica(['rubro_comercio']); // incluso si la IA se equivoca, la guarda manda.
$r = turno('Es para un negocio', $c, $cfg);
caso('"es para un negocio" no se clasifica como ecommerce',
    empty($c['tipo']) && ($c['fase'] ?? '') === 'algo_diferente');
caso('primero pregunta qué vende o qué servicio ofrece',
    count($r) === 1 && mb_stripos($r[0], 'qué vendés o qué servicio ofrecés') !== false,
    implode(' | ', $r));

clasifica(['rubro_comercio']);
$r = turno('Vendo ropa', $c, $cfg);
$visible = array_map(function ($m) use ($c) { return wabot_personalizar($m, $c); }, $r);
$todo = implode("\n", $visible);
caso('al conocer el rubro manda exactamente dos mensajes', count($visible) === 2, json_encode($visible, JSON_UNESCAPED_UNICODE));
caso('el ecommerce usa el texto fijo aprobado',
    str_starts_with($visible[0] ?? '', 'Lo mejor para tu negocio es una web para vender online, con catálogo, carrito, integración de cobros con Mercado Pago y un panel administrativo para cargar productos y gestionar pedidos.'),
    $visible[0] ?? '');
caso('las formas de contratación son breves y tienen los valores correctos',
    strpos($visible[0] ?? '', "1. Pago único de $290.000. Incluye mantenimiento el primer año.") !== false
    && strpos($visible[0] ?? '', "2. Suscripción mensual de $25.000, todo incluido mientras dure la suscripción.") !== false);
caso('ya no enumera el bloque Incluye', mb_stripos($todo, "Incluye:\n") === false);
caso('el segundo y último mensaje es solo el portfolio general',
    ($visible[1] ?? '') === 'Podés ver todos nuestros trabajos terminados y funcionando en: gokywebs.com/portfolio',
    $visible[1] ?? '');
caso('no ofrece modelos, demo, formulario ni pregunta si arrancamos',
    preg_match('/modelos|demo|formulario|arrancamos/iu', $todo) === 0);
caso('la charla queda apagada y pendiente para una persona',
    !empty($c['bot_off']) && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']) && ($c['cierre'] ?? '') === 'cotizacion_final');

clasifica(['otro']);
$despues = turno('Me gusta el pago único', $c, $cfg);
caso('después del portfolio el bot no manda ningún mensaje más', $despues === []);

$esperados = [
    'landing' => 'un sitio profesional para presentar tu negocio, mostrar tus servicios o trabajos y recibir consultas directas por WhatsApp',
    'inmobiliaria' => 'una web inmobiliaria para publicar propiedades con fotos y fichas completas, buscador por zona, tipo y precio, y un panel administrativo para cargar, editar y dar de baja propiedades',
    'elearning' => 'una plataforma para vender tus cursos, con los videos organizados, acceso para cada alumno, cobro online y un panel administrativo para gestionar cursos y alumnos',
];
foreach ($esperados as $tipo => $frase) {
    $ct = conv_nueva('549110000' . strtoupper($tipo) . 'TEST', ['fase' => 'menu']);
    $salida = wabot_pitch($tipo, $ct, $cfg);
    $primero = wabot_personalizar($salida[0] ?? '', $ct);
    caso("$tipo también usa su texto fijo y termina el bot",
        str_starts_with($primero, 'Lo mejor para tu negocio es ' . $frase . '.')
        && count($salida) === 2 && !empty($ct['bot_off']));
}

todo_ok();
