<?php
/** Respuestas manuales basadas en las charlas de Pablo desde el 14-sep. */
function wabot_rr_03oct_montos() {
    return [
        'landing' => ['anual' => '$160.000', 'mensual' => '$20.000', 'unico' => '$220.000'],
        'ecommerce' => ['anual' => '$240.000', 'mensual' => '$30.000', 'unico' => '$330.000'],
        'elearning' => ['anual' => '$240.000', 'mensual' => '$30.000', 'unico' => '$330.000'],
        'inmobiliaria' => ['anual' => '$240.000', 'mensual' => '$30.000', 'unico' => '$330.000'],
    ];
}

/** Los botones directos de pago se muestran cuando sus páginas cobran las tarifas nuevas. */
function wabot_rr_03oct_botones_pago_listos($cfg) {
    if (!function_exists('wabot_planes_paginas')) return false;
    $paginas = wabot_planes_paginas();
    foreach (wabot_rr_03oct_montos() as $tipo => $montos) {
        $config = (array)($cfg['tipos'][$tipo] ?? []);
        foreach (['anual' => 'precio', 'mensual' => 'mensualidad', 'unico' => 'precio_unico'] as $modalidad => $campo) {
            $pagina = (array)($paginas[$tipo][$modalidad] ?? []);
            if (($config[$campo] ?? '') !== $montos[$modalidad]
                || ($pagina['monto'] ?? '') !== $montos[$modalidad]
                || !is_file(__DIR__ . '/../pago/' . ($pagina['pagina'] ?? '') . '/index.html')) return false;
        }
    }
    return true;
}

function wabot_rr_03oct_precio($descripcion, $grupo) {
    return "Para lo que me contás, te podemos armar $descripcion.\n\n"
        . "Podés elegir entre dos planes:\n\n"
        . '• Plan anual: {' . $grupo . "_anual} por año\n"
        . '• Plan mensual: {' . $grupo . "_mensual} por mes\n\n"
        . "Ambos incluyen todo:\n"
        . "✓ Desarrollo completo de la web\n"
        . "✓ Adaptada a celulares\n"
        . "✓ Panel para autogestionar contenido\n"
        . "✓ Certificado de seguridad (SSL)\n"
        . "✓ Preparada para que Google la encuentre\n"
        . "✓ Un cambio por mes en la web\n\n"
        . "Mantenimiento:\n"
        . "✓ Renovación de hosting y dominio\n"
        . "✓ Actualizaciones\n"
        . "✓ Arreglo de errores\n"
        . "✓ Soporte técnico";
}

/** Se reemplaza una vez la lista vieja. Los datos de seña cargados a mano se conservan. */
function wabot_rr_03oct_catalogo($anteriores = []) {
    $datosSena = '';
    foreach ((array)$anteriores as $categoria) {
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            if (wabot_respuestas_rapidas_es_datos_sena($texto)) {
                $datosSena = (string)$texto;
                break 2;
            }
        }
    }
    if ($datosSena === '') $datosSena = "Te paso los datos para la seña:\n\nEDITAR DATOS DE PAGO";
    return [
        ['ico' => '👋', 'titulo' => 'Para conocer el proyecto', 'items' => [
            'Hola, ¿cómo estás? Para pasarte el valor exacto de tu web, contame brevemente a qué te dedicás o qué tipo de negocio tenés.',
            'Te consulto, ¿qué vendés o qué servicios ofrecés?',
            '¿Querés que la gente te consulte por WhatsApp o que pueda comprar y pagar directamente desde la web?',
            '¿Ya tenés una página o arrancamos de cero?',
            '¿Qué te gustaría que tenga la web? Contame lo principal y te digo qué opción te conviene.',
            '¿Tenés alguna web de referencia que te guste? Si me pasás el link, mejor.',
            'Dale, perfecto. Con eso ya me ubico y te paso la propuesta.',
        ]],
        ['ico' => '💰', 'titulo' => 'Precios', 'items' => [
            wabot_rr_03oct_precio('un sitio profesional para mostrar tu negocio y recibir consultas por WhatsApp', 'landing'),
            // Tienda, cursos e inmobiliaria cuestan lo mismo: un solo bloque (4-oct).
            wabot_rr_03oct_precio('una tienda online para vender tus productos y cobrar desde la web', 'ecommerce'),
            'Si te interesa, te preparamos una demo gratis para que veas cómo quedaría tu web antes de decidir. ¿Querés que la armemos?',
            'Si querés ver el detalle de los planes, decime si te interesa el mensual o el anual y te paso el link correspondiente.',
        ]],
        ['ico' => '🎨', 'titulo' => 'Demo y trabajos', 'items' => [
            'La demo es gratis. Es un primer diseño de tu propia página, todavía sin terminar, para que veas cómo quedaría.',
            'Dale, te paso el formulario: gokywebs.com/form/. Con eso te armamos la demo para tu negocio.',
            'Cuando puedas, completá el formulario y preparamos la demo gratis.',
            'Dale perfecto, mañana pueden llenar el formulario y preparamos la demo gratis.',
            'Buenas, todos nuestros trabajos terminados están en gokywebs.com/portfolio',
            'Si querés ver modelos para elegir un estilo, están en gokywebs.com/modelos/',
            '¿Cuál de los dos modelos te gustó más? Después ajustamos textos, fotos y colores.',
            'Pasame todos los cambios que quieras hacerle a la demo y los vamos viendo.',
            'Sí, es una muestra del diseño. Cuando arrancamos hacemos la web completa y la dejamos funcionando.',
        ]],
        ['ico' => '💬', 'titulo' => 'Dudas de los planes', 'items' => [
            'Son dos opciones para la misma web: mensual o anual. Elegís la que te quede más cómoda.',
            'Sí, los dos planes incluyen la web, el hosting, el dominio, el mantenimiento y el soporte.',
            'El mensual es una suscripción de Mercado Pago. No tiene permanencia y la podés dar de baja cuando quieras.',
            'El anual se paga una vez por año. Arrancamos con una seña y el resto se abona cuando la web está terminada.',
            'En el mensual empezamos con el primer pago. En el anual, con la seña. La web queda lista en menos de 7 días.',
            'El mantenimiento cubre hosting, dominio, actualizaciones, arreglos y soporte. Los productos y el contenido los manejás vos desde el panel.',
            'Si necesitás que compren y paguen online, te conviene la tienda. Si solo querés mostrar lo que hacés y recibir consultas, el sitio profesional.',
            'Dale, ¿te queda mejor el plan mensual o el anual? Así te paso cómo arrancamos.',
        ]],
        ['ico' => '🚀', 'titulo' => 'Arranque y pagos', 'items' => [
            'Para el plan mensual nos manejamos con una suscripción de Mercado Pago. Con la primera cuota empezamos la web y en menos de 7 días queda funcionando.',
            'Para el plan anual arrancamos con una seña de {sena}. Cuando la web esté terminada, en unos 7 días, se abona el resto.',
            $datosSena,
            'El plan anual se puede pagar por transferencia o con tarjeta de crédito.',
            'Dale, te paso el link del plan mensual. La suscripción empieza cuando hacés el primer pago.',
            'Dale, con el primer pago avanzamos con el desarrollo completo y todos los cambios que hablamos.',
            'Pasame el comprobante cuando hagas la seña, así arrancamos.',
            'Dale, ya vi el pago. Ahora seguimos con los cambios de la web.',
            'La web ya está lista. Queda abonar el saldo del plan anual y la publicamos.',
            'No hay ningún cobro activo hasta que entres al link y hagas el primer pago.',
            'Para la factura, pasame nombre o razón social, CUIT o CUIL y condición frente al IVA.',
        ]],
        ['ico' => '🛒', 'titulo' => 'Tienda y panel', 'items' => [
            'Sí, los clientes pueden armar el carrito y pagar desde la web con Mercado Pago.',
            'Desde tu panel manejás productos, precios, fotos, stock y pedidos cuando quieras.',
            'Nosotros cargamos los primeros 10 productos para dejar la tienda lista. Después podés sumar los que quieras desde el panel.',
            'Si preferís que carguemos más productos nosotros, te pasamos ese valor aparte.',
            'El stock se actualiza con cada compra. Cuando entra mercadería nueva, lo cambiás desde el panel.',
            'Podemos poner envío a domicilio y retiro en el local. Contame cómo trabajás hoy los envíos.',
            'Sí, sumamos WhatsApp para que también puedan consultarte directamente desde la web.',
        ]],
        ['ico' => '🌐', 'titulo' => 'Dominio y redes', 'items' => [
            'El dominio y el hosting están incluidos en el plan mensual y en el anual.',
            'Si ya tenés un dominio, usamos ese. Pasame cuál es y lo reviso.',
            'Pasame dos o tres nombres que te gusten para el dominio y me fijo cuáles están disponibles.',
            'Sí, podemos conectar la web con tu WhatsApp e Instagram.',
            'La web queda preparada para aparecer en Google. La posición mejora con el tiempo y no se puede garantizar un puesto.',
            'Nosotros hacemos la web. La publicidad y el manejo de redes se trabajan aparte.',
        ]],
        ['ico' => '⏳', 'titulo' => 'Seguimiento', 'items' => [
            'Dale, no hay problema. Cuando quieras retomamos por acá.',
            'Si ahora se te complica el anual, podemos arrancar con el mensual.',
            'No hay apuro. Si te queda alguna duda, escribime y la vemos.',
            'Buenas, ¿pudiste ver la demo? Contame qué te pareció.',
            'Buenas, ¿pudiste mirar la propuesta? Si querés avanzar, seguimos con el plan mensual o el anual.',
            'Si todavía no tenés todas las fotos o los textos, podemos ir avanzando y sumarlos después.',
        ]],
        ['ico' => '❓', 'titulo' => 'Otras consultas', 'items' => [
            'Dale, pasame el link de tu web actual y la reviso.',
            'Si me pasás las fotos y los textos vos, mejor. Así la dejamos bien parecida a lo que querés.',
            'Sí, podemos hacer una videollamada. Decime qué día y horario te queda cómodo.',
            'Somos de Tigre, Buenos Aires, y trabajamos todo online.',
            'Si necesitás una función especial, contame qué tiene que hacer y te preparo el presupuesto sobre el plan mensual o el anual.',
            'Perdón, antes te contestaba el bot. Ahora te escribo yo, Pablo.',
        ]],
        ['ico' => '🔐', 'titulo' => 'Propiedad absoluta del código', 'items' => [
            'Si necesitás la propiedad absoluta del código, podemos hacerlo con pago único. Para el sitio profesional son {landing_unico}; para tienda, cursos o inmobiliaria son {ecommerce_unico}. El código queda tuyo cuando abonás el total.',
            'Con el pago único, el hosting y el dominio van incluidos el primer año. Después los renovás vos o contratás el mantenimiento aparte.',
        ]],
    ];
}
