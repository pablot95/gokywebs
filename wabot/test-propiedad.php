<?php
/**
 * wabot/test-propiedad.php — la propiedad del código se contesta (Pablo,
 * 20-sep), con sus plazos: pago único al abonar el total, plan anual al pagar
 * el segundo año y plan mensual a los 18 meses. Antes de eso el código es de
 * Gokywebs (solo CLI).
 *
 * El 19-sep el bot se callaba con estas preguntas y era peor: cortaba la
 * venta. Esta suite existe para que no vuelva a pasar: ante cada una de esas
 * preguntas tiene que salir una respuesta, no un silencio.
 */

require_once __DIR__ . '/test-lib.php';

$cfg = wabot_config_load();

echo "— Las preguntas de propiedad tienen respuesta —\n";
foreach (['La página queda a mi nombre?' => 'titularidad',
          'La web es mía?' => 'titularidad',
          'Soy dueño de la página?' => 'titularidad',
          'El código me pertenece?' => 'titularidad',
          'Me entregan el código fuente?' => 'entrega_codigo',
          'me pasan el codigo fuente?' => 'entrega_codigo',
          'las licencias de plugins estan a mi nombre?' => 'licencias',
          'que pasa si dejo de pagar?' => 'baja_del_plan',
          'hay permanencia?' => 'baja_del_plan',
          'me pasan el usuario y contraseña del cpanel?' => 'accesos'] as $pregunta => $clave) {
    $k = wabot_info_por_palabras($pregunta, 'prediseno');
    caso("\"$pregunta\" → $clave", $k === $clave, (string)$k);
    caso("y tiene texto para contestar", trim((string)wabot_texto_info($clave, $cfg)) !== '');
}

echo "— Los tres plazos del código (Pablo, 20-sep) —\n";
$tit = (string)$cfg['info']['titularidad'];
caso('el pago único: el código es suyo al abonar el total', mb_stripos($tit, 'Pago único: cuando abonás el total') !== false, $tit);
caso('el plan anual: al pagar el segundo año', mb_stripos($tit, 'Plan anual: al pagar el segundo año') !== false);
caso('el plan mensual: a los 18 meses', mb_stripos($tit, 'Plan mensual: a los 18 meses') !== false);
caso('y hasta entonces es de Gokywebs', mb_stripos($tit, 'Hasta ese momento el código es de Gokywebs') !== false);
caso('con el hosting, el dominio y el mantenimiento incluidos mientras el plan esté activo',
    mb_stripos($tit, 'mientras el plan esté activo') !== false);
$cod = (string)$cfg['info']['entrega_codigo'];
caso('la entrega del código dice los mismos tres plazos',
    mb_stripos($cod, 'cuando abonás el total') !== false && mb_stripos($cod, 'al pagar el segundo año') !== false
    && mb_stripos($cod, 'a los 18 meses') !== false, $cod);
caso('las licencias son de terceros, y el código va por el plazo del plan',
    mb_stripos((string)$cfg['info']['licencias'], 'de terceros') !== false
    && mb_stripos((string)$cfg['info']['licencias'], 'plazo de tu plan') !== false);

echo "— El pago único es solo la página, con mantenimiento opcional —\n";
foreach (['landing' => '$10.000', 'ecommerce' => '$15.000', 'elearning' => '$15.000', 'inmobiliaria' => '$15.000'] as $tipo => $mant) {
    $c = conv_nueva('549110000PROP' . strtoupper($tipo), ['tipo' => $tipo, 'precio_dado' => true, 'quiere_web_propia' => true]);
    wabot_precio_congelar($c, $tipo, $cfg);
    $wp = wabot_texto_info('web_propia', $cfg, $c);
    caso("$tipo: solo la página, sin hosting ni dominio",
        mb_stripos($wp, 'es solo la página') !== false && mb_stripos($wp, 'No incluye hosting ni dominio') !== false, $wp);
    caso("$tipo: el código queda suyo al abonar el total", mb_stripos($wp, 'el código queda tuyo') !== false);
    caso("$tipo: el mantenimiento opcional sale $mant por mes", strpos($wp, $mant . ' por mes') !== false, $wp);
    $linea = wabot_web_propia_precio_texto($c, $cfg, wabot_precio_vigente($c, $cfg));
    caso("$tipo: el renglón debajo de los planes dice lo mismo y sin marcadores",
        mb_stripos($linea, 'solo la página') !== false && strpos($linea, $mant) !== false && strpos($linea, '{') === false, $linea);
}

echo "— En la charla: contesta y sigue, no se apaga —\n";
$c = conv_nueva('549110000PROPCHAT', ['fase' => 'menu']);
clasifica(['rubro_landing']);
$r = turno('Soy contador y necesito una web para mostrar mis servicios', $c, $cfg);
caso('(se cotiza el sitio profesional)', !empty($c['precio_dado']) && count($r) === 3);
clasifica(['pregunta_info'], ['info_keys' => ['titularidad']]);
$rT = turno('La página queda a mi nombre?', $c, $cfg);
/* Después del precio el bot ya no contesta (regla del 18-sep: espera un sí y
 * lo demás lo sigue Pablo), así que la propiedad se prueba antes de cotizar. */
caso('después del precio sigue valiendo la regla del 18-sep: lo contesta Pablo', $rT === [], json_encode($rT, JSON_UNESCAPED_UNICODE));

$c = conv_nueva('549110000PROPANTES', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['titularidad']]);
$r = turno('Antes de avanzar: la web queda a mi nombre?', $c, $cfg);
caso('antes del precio la contesta, con los plazos',
    count($r) >= 1 && mb_stripos(implode("\n", $r), 'a los 18 meses') !== false, json_encode($r, JSON_UNESCAPED_UNICODE));
caso('y el bot sigue prendido, sin apagarse', empty($c['bot_off']) && ($c['cierre'] ?? '') !== 'propiedad');

$c = conv_nueva('549110000PROPCODIGO', ['fase' => 'menu']);
clasifica(['pregunta_info'], ['info_keys' => ['entrega_codigo']]);
$r = turno('Me entregan el código fuente?', $c, $cfg);
caso('lo mismo con el código fuente',
    count($r) >= 1 && mb_stripos(implode("\n", $r), 'segundo año') !== false && empty($c['bot_off']),
    json_encode($r, JSON_UNESCAPED_UNICODE));

echo "— Lo que se arregló en el camino sigue arreglado —\n";
caso('"quiero vender por la web" no es una pregunta por la titularidad',
    wabot_info_por_palabras('Tengo una distribuidora de bebidas y quiero vender por la web') !== 'titularidad');
caso('pero "¿puedo vender mi dominio a futuro?" sí lo es',
    wabot_info_por_palabras('puedo vender mi dominio a futuro?') === 'titularidad');
caso('"¿tiene panel de control?" es la carga, no los accesos',
    wabot_info_por_palabras('tiene panel de control?') === 'carga');
caso('"¿necesito cuenta de Mercado Pago?" no es la baja del plan',
    wabot_info_por_palabras('necesito cuenta de mercado pago?') === 'cuenta_mercado_pago');

todo_ok();
