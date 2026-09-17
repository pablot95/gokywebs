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
caso('aclara que los planes son alternativos y tienen los valores correctos',
    strpos($visible[0] ?? '', 'Son alternativas, no se abonan las dos') !== false
    && strpos($visible[0] ?? '', "1. Pago único de $290.000: abonás el desarrollo una sola vez e incluye mantenimiento durante el primer año.") !== false
    && strpos($visible[0] ?? '', "2. Suscripción mensual de $25.000: en lugar del pago único, abonás mes a mes y tenés todo incluido mientras mantengas activa la suscripción.") !== false);
caso('ya no enumera el bloque Incluye', mb_stripos($todo, "Incluye:\n") === false);
caso('el segundo y último mensaje ofrece la demo con el formulario',
    ($visible[1] ?? '') === 'Antes de avanzar te armamos un demo gratis, solo tenés que llenar el formulario: gokywebs.com/form',
    $visible[1] ?? '');
caso('no agrega modelos, portfolio ni otra pregunta',
    preg_match('/modelos|portfolio|arrancamos/iu', $todo) === 0);
caso('la charla queda apagada y pendiente para una persona',
    !empty($c['bot_off']) && !empty($c['handoff_pendiente'])
    && !empty($c['seguimiento_bloqueado']) && ($c['cierre'] ?? '') === 'cotizacion_final');

clasifica(['otro']);
$despues = turno('Me gusta el pago único', $c, $cfg);
caso('después de ofrecer la demo el bot no manda ningún mensaje más', $despues === []);

$esperados = [
    'landing' => ['un sitio profesional para presentar tu negocio, mostrar tus servicios o trabajos y recibir consultas directas por WhatsApp', '$180.000', '$15.000'],
    'inmobiliaria' => ['una web inmobiliaria para publicar propiedades con fotos y fichas completas, buscador por zona, tipo y precio, y un panel administrativo para cargar, editar y dar de baja propiedades', '$240.000', '$25.000'],
    'elearning' => ['una plataforma para vender tus cursos, con los videos organizados, acceso para cada alumno, cobro online y un panel administrativo para gestionar cursos y alumnos', '$290.000', '$25.000'],
];
foreach ($esperados as $tipo => [$frase, $precio, $mensualidad]) {
    $ct = conv_nueva('549110000' . strtoupper($tipo) . 'TEST', ['fase' => 'menu']);
    $salida = wabot_pitch($tipo, $ct, $cfg);
    $primero = wabot_personalizar($salida[0] ?? '', $ct);
    caso("$tipo también usa su texto fijo y termina el bot",
        str_starts_with($primero, 'Lo mejor para tu negocio es ' . $frase . '.')
        && strpos($primero, "1. Pago único de $precio: abonás el desarrollo una sola vez") !== false
        && strpos($primero, "2. Suscripción mensual de $mensualidad: en lugar del pago único") !== false
        && strpos($primero, 'Son alternativas, no se abonan las dos') !== false
        && count($salida) === 2 && !empty($ct['bot_off']));
}

// Regresión 16-sep: al detectar "fábrica de máquinas", el borde común
// agregaba cinco trabajos y modelos después de la pregunta mostrar/vender.
$cf = conv_nueva('549110000FABRICATEST', ['fase' => 'desempate_hibrido']);
wabot_conv_transcript($cf, 'cliente', 'Fábrica de máquinas para emprendimientos');
$pregunta = (string)$cfg['desempate_hibrido'];
$salidaFabrica = wabot_salida_preparar([$pregunta], $cf, $cfg);
caso('una pregunta de aclaración sale sola, sin portfolio ni modelos',
    $salidaFabrica === [$pregunta]
    && mb_stripos(implode("\n", $salidaFabrica), 'cinco trabajos') === false
    && mb_stripos(implode("\n", $salidaFabrica), 'modelos') === false,
    implode(' | ', $salidaFabrica));

// Regresión 16-sep: si en el mismo mensaje pregunta el procedimiento y deja
// claro que necesita ecommerce, no se antepone info.proceso a la cotización.
$cc = conv_nueva('549110000COSMETICATEST', ['fase' => 'menu']);
clasifica(['pregunta_info', 'rubro_ecommerce'], ['info_keys' => ['proceso']]);
$salidaCosmeticos = turno('Consulto por precios y cómo sería el procedimiento. Quiero un catálogo de cosméticos con producto, stock y precio.', $cc, $cfg);
$textoCosmeticos = implode("\n", $salidaCosmeticos);
caso('procedimiento + rubro claro manda solamente cotización y demo',
    count($salidaCosmeticos) === 2
    && mb_stripos($textoCosmeticos, 'Primero mirás trabajos') === false
    && ($salidaCosmeticos[1] ?? '') === 'Antes de avanzar te armamos un demo gratis, solo tenés que llenar el formulario: gokywebs.com/form',
    implode(' | ', $salidaCosmeticos));

todo_ok();
