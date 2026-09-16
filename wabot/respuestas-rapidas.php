<?php
/**
 * Respuestas manuales del panel. Se guardan fuera del código para poder
 * administrarlas desde Wabot sin publicar archivos de nuevo.
 */

function wabot_respuestas_rapidas_default() {
    return [
        ['ico' => '🧭', 'titulo' => 'Arrancar la charla', 'items' => [
            'Hola, ¿cómo estás? Contame a qué te dedicás o para qué tipo de negocio sería la web, así te paso el valor.',
            'Perdón, no llegué a entender bien de qué se trata tu negocio — ¿vendés productos, ofrecés un servicio, es inmobiliaria, o son cursos?',
            'Che, disculpá la demora. Contame de nuevo con tus palabras a qué te dedicás y seguimos por acá.',
            'Te dejo cinco trabajos reales de tu rubro: [LINKS]. Y podés ver todo el portfolio en gokywebs.com/portfolio/',
            'Ahí tenés algunos modelos de estructura para elegir uno como punto de partida: gokywebs.com/modelos/',
            '¿Te gustó alguno? Si querés arrancamos, decime y te paso el formulario.',
        ]],
        ['ico' => '💰', 'titulo' => 'Precio y pago', 'items' => [
            'Te paso los datos para la seña: [ALIAS o CBU]. En cuanto la veas acreditada, arrancamos.',
            'Te mando el link de Mercado Pago para la suscripción, así arrancamos con la primera mensualidad: [LINK]',
            '¡Recibido! Ya arrancamos con tu web, en unos días te muestro los primeros avances.',
            'Sí, podés pagar con tarjeta. Te paso el link de Mercado Pago y ahí elegís las cuotas.',
            'No manejamos descuentos, pero tenés las dos formas: pago único o mensual sin pago inicial, para que elijas la que te convenga.',
            'Sí, se puede cambiar de una forma a la otra cuando quieras. Avisame y te cuento cómo seguimos.',
        ]],
        ['ico' => '🙅', 'titulo' => 'Objeciones', 'items' => [
            'Entiendo. Si el pago único te queda grande, tenés el mensual: arrancás sin poner nada de entrada.',
            'Dale, sin problema. Cualquier duda que te vaya surgiendo, quedo por acá.',
            'Totalmente válido. Nosotros nos diferenciamos en que no solo te la armamos: seguimos con el soporte y el mantenimiento después. La propuesta queda en pie para cuando quieras.',
            'Ahí armás vos la página con una plantilla y pagás por mes igual. Acá te la hacemos nosotros a medida y nos ocupamos de todo lo técnico.',
            'Ningún problema, no hay apuro ni vencimiento. Cuando quieras arrancar, escribime.',
            'Se puede mejorar o rehacer sin drama. Contame qué te gustaría cambiar y vemos qué te conviene.',
        ]],
        ['ico' => '📋', 'titulo' => 'Ya dijo que sí', 'items' => [
            'Dale! Te paso el formulario para arrancar: [LINK]. Ahí me contás el nombre de tu negocio, una descripción corta, los colores que te gustan y si tenés logo o fotos, los subís ahí.',
            'Perfecto! Para arrancar necesito: el logo (si tenés), 5-6 fotos de tu negocio o productos, los textos que quieras que aparezcan y los colores que te gustan.',
            'No hay problema si no tenés logo todavía, arrancamos igual y lo sumamos después.',
            '¿Ya tenés pensado el nombre para tu dominio? Por ejemplo tumarca.com.ar.',
            'En unos días te muestro los primeros avances. La web completa suele estar lista en una semana.',
            'Buenísimo, bienvenido/a a Gokywebs! Vamos a armar algo que te represente.',
            'Perfecto, ya con el formulario completo arrancamos con tu web. Cualquier cosa que necesites mientras tanto, quedate tranquilo y escribime por acá.',
        ]],
        ['ico' => '⏰', 'titulo' => 'Seguimiento', 'items' => [
            'Hola! ¿Seguís con ganas de avanzar con tu web? Quedo atento.',
            'Che, ¿pudiste ver la propuesta que te pasé? Cualquier duda, la resolvemos.',
            'Hola! Te paso de nuevo los datos para la seña, por si se te traspapeló: [DATOS]',
            'Quedo disponible para cuando quieras retomar, no hay drama.',
        ]],
        ['ico' => '🎨', 'titulo' => 'Diseño', 'items' => [
            'Sí, se puede ajustar. Contame qué te gustaría cambiar (colores, orden, textos) y lo vemos.',
            'El diseño principal se puede rehacer hasta 2 veces. Una vez que lo elegís, tenés 3 devoluciones para ajustar el resto.',
            'Tranquilo/a, lo volvemos a armar. Contame qué NO te cerró para ir por otro lado.',
            '¿Tenés alguna web que te guste como referencia de estilo? Me ayuda mucho para afinar el diseño.',
        ]],
        ['ico' => '❓', 'titulo' => 'Preguntas técnicas', 'items' => [
            'El hosting y el dominio están incluidos mientras tengas la suscripción (con el pago único, el primer año va incluido el mantenimiento).',
            'Sí, se integra Mercado Pago para que tus clientes paguen directo desde la web.',
            'Tenés un panel para vos, para cargar y editar productos, textos e imágenes cuando quieras.',
            'La web queda preparada técnicamente para Google. La posición en el buscador depende de otros factores, no te puedo prometer un puesto.',
        ]],
        ['ico' => '👋', 'titulo' => 'Cierre y trato', 'items' => [
            'Gracias a vos por la confianza! Cualquier cosa que necesites, estoy por acá.',
            'Buenísimo, cualquier duda me escribís. Que tengas buen día!',
            'Ya está publicada tu web! Fijate y contame qué te parece.',
        ]],
    ];
}

function wabot_respuestas_rapidas_normalizar($valor) {
    if (!is_array($valor)) return null;
    $salida = [];
    foreach (array_slice($valor, 0, 30) as $categoria) {
        if (!is_array($categoria)) continue;
        $titulo = trim(mb_substr((string)($categoria['titulo'] ?? ''), 0, 80));
        if ($titulo === '') $titulo = 'Sin nombre';
        $ico = trim(mb_substr((string)($categoria['ico'] ?? ''), 0, 8));
        if ($ico === '') $ico = '💬';
        $items = [];
        foreach (array_slice((array)($categoria['items'] ?? []), 0, 80) as $texto) {
            $texto = trim(mb_substr((string)$texto, 0, 2000));
            if ($texto !== '') $items[] = $texto;
        }
        $salida[] = ['ico' => $ico, 'titulo' => $titulo, 'items' => $items];
    }
    return $salida;
}

function wabot_respuestas_rapidas_load() {
    wabot_ensure_dirs();
    $ruta = WABOT_DATA . '/respuestas-rapidas.json';
    if (!is_file($ruta)) return wabot_respuestas_rapidas_default();
    $leido = json_decode((string)@file_get_contents($ruta), true);
    $normalizado = wabot_respuestas_rapidas_normalizar($leido);
    return $normalizado !== null ? $normalizado : wabot_respuestas_rapidas_default();
}

function wabot_respuestas_rapidas_save($valor) {
    $normalizado = wabot_respuestas_rapidas_normalizar($valor);
    if ($normalizado === null) return false;
    $json = json_encode($normalizado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return is_string($json) && wabot_json_guardar_atomico(WABOT_DATA . '/respuestas-rapidas.json', $json);
}
