<?php
/**
 * Respuestas manuales del panel. Se guardan fuera del código para poder
 * administrarlas desde Wabot sin publicar archivos de nuevo.
 */

/** El bloque de los dos planes, el mismo que manda el bot (`dos_formas` de textos.php). */
function wabot_respuestas_rapidas_planes_texto($anual, $mensual, $tipo = '') {
    require_once __DIR__ . '/textos.php';
    return str_replace(['{precio}', '{mensualidad}'], [$anual, $mensual], wabot_servicio_texto_plantilla($tipo));
}

function wabot_respuestas_rapidas_default() {
    return [
        ['ico' => '🟢', 'titulo' => 'Primer contacto', 'items' => [
            'Hola, ¿cómo estás? Contame a qué te dedicás o para qué tipo de negocio sería la web, así te recomiendo la opción adecuada.',
            'Para orientarte bien, contame qué necesitás que pueda hacer la web. Por ejemplo: mostrar servicios, vender productos, recibir consultas, tomar turnos, ofrecer cursos o gestionar reservas.',
            'Podés ver todos nuestros trabajos terminados y funcionando en: gokywebs.com/portfolio',
            'También tenemos algunos modelos de estructura para que veas distintos estilos y formas de organizar una web: gokywebs.com/modelos/',
            '¿Te gustó alguno? Si querés arrancamos, decime y te paso el formulario.',
        ]],
        // Los dos planes del 19-sep (Pablo): el mismo bloque que manda el bot.
        ['ico' => '💰', 'titulo' => 'Presupuesto y planes', 'items' => [
            "Para lo que me contás, te serviría un sitio profesional para mostrar tu negocio, tus servicios o trabajos y recibir consultas por WhatsApp.\n\n" . wabot_respuestas_rapidas_planes_texto('$140.000', '$20.000', 'landing'),
            "Para lo que me contás, te serviría una tienda online para mostrar tus productos, recibir pedidos y cobrar con Mercado Pago. Desde tu panel administrás productos, precios y pedidos.\n\n" . wabot_respuestas_rapidas_planes_texto('$230.000', '$30.000'),
            "Para lo que me contás, te serviría una web inmobiliaria para publicar propiedades con fotos y filtros. Desde tu panel las cargás, editás y das de baja.\n\n" . wabot_respuestas_rapidas_planes_texto('$190.000', '$30.000'),
            "Para lo que me contás, te serviría una plataforma para vender cursos, organizar videos, dar acceso a alumnos y cobrar online. Desde tu panel administrás cursos y alumnos.\n\n" . wabot_respuestas_rapidas_planes_texto('$230.000', '$30.000'),
            'Con el plan anual arrancás con una seña de $40.000 (sitio profesional) o $60.000 (tienda, cursos o inmobiliaria) y el resto se paga al entregar la web. Después se renueva una vez por año, contado desde la seña, sin suscripción.',
            'Si la querés tuya, para tenerla en tu propio hosting, está el pago único: $180.000 el sitio profesional, $290.000 la tienda o los cursos y $240.000 la inmobiliaria. La web queda a tu nombre, pero no incluye hosting, dominio, mantenimiento, actualizaciones ni soporte.',
            'Los dos planes incluyen hosting, dominio, soporte técnico y mantenimiento de la web. No incluyen administrar tus productos o pedidos: eso lo manejás vos desde tu panel.',
            'Antes de arrancar dejamos definido el valor y qué incluye el desarrollo, así sabés desde el principio cuánto vas a pagar.',
        ]],
        ['ico' => '💳', 'titulo' => 'Pagos', 'items' => [
            "Te paso los datos para la seña. En cuanto se acredite arrancamos con el desarrollo:\n\nEDITAR DATOS DE PAGO",
            'Te mando el link de Mercado Pago para activar el plan mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK',
            'Sí, podés pagar con tarjeta. Te paso el link de Mercado Pago y ahí elegís las cuotas.',
            '¡Recibido! Ya arrancamos con tu web. En unos días te muestro los primeros avances.',
            'La web ya está lista para publicarse. Antes de subirla queda abonar el saldo restante de EDITAR IMPORTE. Una vez acreditado el pago la dejamos online y funcionando.',
            'Hola, ¿cómo estás? Te escribo porque quedó pendiente el pago de EDITAR IMPORTE. Cuando puedas avisame y continuamos.',
            "Hola, ¿cómo estás? Se cumple el año de tu web y toca renovar el plan anual: son EDITAR IMPORTE. Te paso los datos para el pago:\n\nEDITAR DATOS DE PAGO",
        ]],
        ['ico' => '✅', 'titulo' => 'Cliente confirmado', 'items' => [
            'Dale, te paso el formulario para arrancar: gokywebs.com/form/. Con esa información podemos empezar a preparar la web y después vamos ajustando juntos los detalles.',
            'Para arrancar necesito el logo si tenés, unas 5 o 6 fotos del negocio o productos, los textos que quieras incluir y, si tenés preferencia, colores o estilo visual.',
            'No hay problema si todavía no tenés logo. Podemos arrancar y sumarlo más adelante.',
            'Perfecto, ya tengo el formulario completo. Con esto podemos arrancar con tu web. Si necesito algún dato adicional te escribo por acá.',
            'Ahora preparo la primera versión con toda la información que me pasaste. Después te la envío para que la revises y vamos haciendo los ajustes necesarios.',
            'En unos días te muestro la primera versión. El tiempo final depende del material y de los ajustes que vayamos haciendo.',
        ]],
        ['ico' => '🎨', 'titulo' => 'Diseño y cambios', 'items' => [
            'Sí, se puede ajustar. Decime qué te gustaría cambiar —colores, textos, imágenes, orden o estructura— y lo vemos.',
            'No hay problema, lo podemos replantear. Contame qué fue lo que no te cerró y, si tenés alguna referencia de lo que buscás, mandámela así orientamos mejor el próximo diseño.',
            '¿Tenés alguna web que te guste como referencia de estilo? Me sirve para entender mejor qué estética buscás.',
            'El diseño principal se puede replantear hasta 2 veces. Una vez definido el estilo, tenés hasta 3 rondas de ajustes para terminar de pulir textos, imágenes, colores y detalles.',
            'Sí, se puede hacer. Si podés, marcame sobre una captura qué parte querés modificar o mandame un ejemplo de cómo te gustaría que quede.',
        ]],
        ['ico' => '🛡️', 'titulo' => 'Objeciones', 'items' => [
            'Obvio, no hay problema. Si te quedó alguna duda sobre el precio, cómo funciona la web o qué incluye el servicio, decime y te la aclaro.',
            'El mantenimiento no es por cargar productos ni administrar la página; eso lo hacés vos desde tu panel. Los dos planes cubren hosting, dominio, soporte técnico y el mantenimiento necesario para que la web siga funcionando correctamente.',
            'Tiendanube es una buena alternativa si preferís trabajar dentro de una plataforma y configurar vos mismo la tienda. Nosotros desarrollamos la web por vos y nos ocupamos de la parte técnica, el diseño, la configuración y el soporte.',
            'Entiendo. Tené en cuenta que no estás pagando solamente el diseño: incluye el desarrollo, la configuración, la adaptación a celulares y computadoras y la puesta en funcionamiento de la web.',
            'Puede ser, hay muchas formas de desarrollar una web y distintos servicios. Lo importante es comparar qué incluye cada propuesta, cómo se administra después y qué soporte vas a tener una vez publicada.',
            'Dale, ningún problema. La propuesta queda disponible y, cuando quieras retomarla, escribime por acá.',
            'Se puede trabajar sobre una web existente o hacer una nueva, dependiendo de cómo esté armada actualmente. Si me pasás el link la reviso y te digo qué opciones tenés.',
            'Sí. La idea es que lo cotidiano lo puedas manejar vos. Según el tipo de web, podés tener un panel para gestionar productos, precios, stock, pedidos, imágenes o contenido.',
        ]],
        ['ico' => '⚙️', 'titulo' => 'Funciones y web', 'items' => [
            'Sí. Tenés un panel administrativo para cargar y editar productos, precios, imágenes y demás contenido que necesites gestionar.',
            'Sí, podemos integrar Mercado Pago para que tus clientes paguen directamente desde la web.',
            'Sí. La web se adapta automáticamente a celulares, tablets y computadoras.',
            'Sí, la página puede funcionar con tu propio dominio, por ejemplo tunegocio.com.ar o tunegocio.com.',
            'La web queda preparada para ser indexada por Google. La posición en los resultados depende de distintos factores y se trabaja con el tiempo; no se puede garantizar una posición específica.',
            'Con el plan anual o el mensual, el hosting, el dominio, el soporte y el mantenimiento están incluidos mientras el plan esté activo.',
            'Con el pago único (la web propia, en tu hosting), el hosting, el dominio, el mantenimiento y el soporte corren por tu cuenta: no están incluidos.',
            'Sí, podemos conectar la web con WhatsApp, Instagram, Facebook y tus demás redes.',
            'Los productos los administrás vos desde el panel: podés agregar, modificar o sacar productos sin depender de nosotros.',
        ]],
        ['ico' => '🔄', 'titulo' => 'Seguimiento', 'items' => [
            'Hola, ¿cómo andás? ¿Pudiste revisar la propuesta? Si te quedó alguna duda decime y la vemos.',
            'Hola, ¿cómo estás? Retomo por la web que habíamos hablado. ¿Seguís con la idea de avanzar?',
            'Hola, ¿cómo andás? ¿Pudiste revisar el presupuesto que te pasé? Si tenés alguna duda sobre lo que incluye, decime y te explico.',
            'Hola, ¿cómo estás? Te escribo por la web que habíamos hablado. ¿Pudiste definir si querías avanzar?',
            'Hola, ¿cómo estás? Te escribo una última vez por la página que habíamos hablado. Si más adelante querés retomarla, escribime por acá y continuamos.',
        ]],
        ['ico' => '🧑‍💻', 'titulo' => 'Clientes y postventa', 'items' => [
            'La web ya está terminada y funcionando. Ahora podemos seguir puliendo detalles para que quede exactamente como querés.',
            'Ya está lista para publicarse. Una vez confirmado el saldo final la subimos al dominio y queda funcionando.',
            'Listo, la web ya está publicada y funcionando correctamente. Ya podés compartir el dominio con tus clientes.',
            'Dale. Pasame qué querés modificar y en qué parte de la web. Si podés acompañarlo con una captura, mejor.',
            'Pasame una captura o video del problema y decime desde qué dispositivo lo estás viendo, así puedo revisarlo.',
        ]],
    ];
}

/**
 * Migra una sola vez la lista anterior a la organización por etapa comercial.
 * El mensaje de la seña puede contener datos bancarios reales editados desde
 * el panel, por eso se conserva literalmente en lugar de reemplazarlo.
 */
function wabot_respuestas_rapidas_migrar_legacy($categorias) {
    $titulos = array_map(static fn($cat) => mb_strtolower(trim((string)($cat['titulo'] ?? ''))), $categorias);
    $esLegacy = in_array('precio y pago', $titulos, true)
        || in_array('ya dijo que sí', $titulos, true)
        || in_array('preguntas técnicas', $titulos, true);
    if (!$esLegacy || in_array('presupuesto y planes', $titulos, true)) return $categorias;

    $mensajeSena = '';
    foreach ($categorias as $categoria) {
        if (mb_strtolower(trim((string)($categoria['titulo'] ?? ''))) !== 'precio y pago') continue;
        foreach ((array)($categoria['items'] ?? []) as $mensaje) {
            $texto = (string)$mensaje;
            if (mb_stripos($texto, 'seña') !== false
                && (mb_stripos($texto, 'alias') !== false || mb_stripos($texto, 'cbu') !== false)) {
                $mensajeSena = $texto;
                break 2;
            }
        }
    }

    $nuevas = wabot_respuestas_rapidas_default();
    if ($mensajeSena !== '') {
        foreach ($nuevas as &$categoria) {
            if ($categoria['titulo'] === 'Pagos') {
                $categoria['items'][0] = $mensajeSena;
                break;
            }
        }
        unset($categoria);
    }
    return $nuevas;
}

/**
 * La primera versión de la nueva organización tenía un único bloque de precio
 * ($290.000 / $25.000). Completa esa categoría sin tocar el resto de las
 * respuestas que ya se hayan editado desde el panel.
 */
function wabot_respuestas_rapidas_completar_precios($categorias) {
    foreach ($categorias as &$categoria) {
        if (mb_strtolower(trim((string)($categoria['titulo'] ?? ''))) !== 'presupuesto y planes') continue;
        $contenido = implode("\n", (array)($categoria['items'] ?? []));
        /* Solo esa primera versión: el bloque de $290.000 sin los montos de los
         * otros tipos (ni los del 15-sep ni los planes del 19-sep). Una
         * categoría que Pablo ya editó no se vuelve a pisar. */
        if (mb_strpos($contenido, '$290.000') === false) break;
        foreach (['$180.000', '$240.000', '$140.000', '$190.000', '$230.000'] as $otroMonto) {
            if (mb_strpos($contenido, $otroMonto) !== false) break 2;
        }
        foreach (wabot_respuestas_rapidas_default() as $predeterminada) {
            if ($predeterminada['titulo'] === 'Presupuesto y planes') {
                $categoria['items'] = $predeterminada['items'];
                break 2;
            }
        }
    }
    unset($categoria);
    return $categorias;
}

/**
 * Los dos planes (Pablo, 19-sep): plan anual (seña, el resto al entregar y el
 * cobro cada año) o plan mensual; el pago único queda para la web propia.
 * Corre mientras las respuestas guardadas conserven el modelo anterior (pago
 * único con mantenimiento el primer año o suscripción mensual): cambia las que
 * siguen tal cual venían de fábrica —las de precio se reconocen también por
 * "Son alternativas"— y suma las nuevas. Lo que Pablo reescribió a mano no se
 * toca, y una vez migradas ya no vuelve a correr.
 */
function wabot_respuestas_rapidas_planes_19sep($categorias) {
    $reemplazos = [
        'El plan mensual incluye hosting, dominio, soporte técnico y mantenimiento de la web. No incluye administrar tus productos o pedidos: eso lo manejás vos desde tu panel.'
            => 'Los dos planes incluyen hosting, dominio, soporte técnico y mantenimiento de la web. No incluyen administrar tus productos o pedidos: eso lo manejás vos desde tu panel.',
        'Te mando el link de Mercado Pago para activar la suscripción mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK'
            => 'Te mando el link de Mercado Pago para activar el plan mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK',
        'El mantenimiento no es por cargar productos ni administrar la página; eso lo hacés vos desde tu panel. El plan mensual cubre hosting, dominio, soporte técnico y el mantenimiento necesario para que la web siga funcionando correctamente.'
            => 'El mantenimiento no es por cargar productos ni administrar la página; eso lo hacés vos desde tu panel. Los dos planes cubren hosting, dominio, soporte técnico y el mantenimiento necesario para que la web siga funcionando correctamente.',
        'Con el pago único, el hosting, el dominio y el mantenimiento están incluidos durante el primer año.'
            => 'Con el plan anual o el mensual, el hosting, el dominio, el soporte y el mantenimiento están incluidos mientras el plan esté activo.',
        'Con la suscripción, el hosting, el dominio, el soporte y el mantenimiento están incluidos mientras el plan mensual esté activo.'
            => 'Con el pago único (la web propia, en tu hosting), el hosting, el dominio, el mantenimiento y el soporte corren por tu cuenta: no están incluidos.',
    ];
    $precioViejo = 'Son alternativas, no se abonan las dos';
    $hayViejas = false;
    foreach ($categorias as $categoria) {
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            if (isset($reemplazos[$texto]) || mb_strpos((string)$texto, $precioViejo) !== false) { $hayViejas = true; break 2; }
        }
    }
    if (!$hayViejas) return $categorias;

    // Las nuevas salen de fábrica: los cuatro precios, la seña del anual, la web propia, el panel del sitio y la renovación.
    $fabrica = [];
    foreach (wabot_respuestas_rapidas_default() as $predeterminada) $fabrica[$predeterminada['titulo']] = $predeterminada['items'];
    $precios = array_slice($fabrica['Presupuesto y planes'], 0, 4);   // sitio, tienda, inmobiliaria, cursos
    $sumarPlanes = array_slice($fabrica['Presupuesto y planes'], 4, 3);
    $renovacion = end($fabrica['Pagos']);

    foreach ($categorias as &$categoria) {
        $titulo = mb_strtolower(trim((string)($categoria['titulo'] ?? '')));
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $texto = (string)$texto;
            if (isset($reemplazos[$texto])) {
                $texto = $reemplazos[$texto];
            } elseif (mb_strpos($texto, $precioViejo) !== false) {
                // El bloque de precio viejo, por el monto del pago único que nombra.
                if (mb_strpos($texto, '$180.000') !== false) $texto = $precios[0];
                elseif (mb_strpos($texto, '$240.000') !== false) $texto = $precios[2];
                elseif (mb_stripos($texto, 'curso') !== false) $texto = $precios[3];
                else $texto = $precios[1];
            }
            $items[] = $texto;
        }
        if ($titulo === 'presupuesto y planes') $items = array_merge($items, $sumarPlanes);
        if ($titulo === 'pagos') $items[] = $renovacion;
        $categoria['items'] = array_values(array_unique($items));
    }
    unset($categoria);
    return $categorias;
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
    if ($normalizado === null) return wabot_respuestas_rapidas_default();
    $migrado = wabot_respuestas_rapidas_planes_19sep(wabot_respuestas_rapidas_completar_precios(
        wabot_respuestas_rapidas_migrar_legacy($normalizado)
    ));
    if ($migrado !== $normalizado) {
        $json = json_encode($migrado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if (is_string($json)) wabot_json_guardar_atomico($ruta, $json);
    }
    return $migrado;
}

function wabot_respuestas_rapidas_save($valor) {
    $normalizado = wabot_respuestas_rapidas_normalizar($valor);
    if ($normalizado === null) return false;
    $json = json_encode($normalizado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return is_string($json) && wabot_json_guardar_atomico(WABOT_DATA . '/respuestas-rapidas.json', $json);
}
