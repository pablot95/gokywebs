<?php
/**
 * Respuestas manuales del panel. Se guardan fuera del código para poder
 * administrarlas desde Wabot sin publicar archivos de nuevo.
 */

/**
 * El bloque de las tres opciones, el mismo que manda el bot (`dos_formas` de
 * textos.php), con los tres montos de lista de ese tipo. Hasta el 26-sep el
 * anual y el mensual iban escritos acá a mano: con el test de precios de ese
 * día el panel siguió mostrando $120.000 / $20.000 mientras el bot ya decía
 * $160.000 / $30.000. Ahora un cambio de precio se toca solo en textos.php.
 */
function wabot_respuestas_rapidas_planes_texto($tipo) {
    require_once __DIR__ . '/textos.php';
    $t = (array)(wabot_textos_default()['tipos'][$tipo] ?? []);
    return str_replace(['{precio}', '{mensualidad}', '{precio_unico}'],
        [(string)($t['precio'] ?? ''), (string)($t['mensualidad'] ?? ''), (string)($t['precio_unico'] ?? '')],
        wabot_servicio_texto_plantilla($tipo));
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
            "Para lo que me contás, te serviría un sitio profesional para mostrar tu negocio, tus servicios o trabajos y recibir consultas por WhatsApp.\n\n" . wabot_respuestas_rapidas_planes_texto('landing'),
            "Para lo que me contás, te serviría una tienda online para mostrar tus productos, recibir pedidos y cobrar con Mercado Pago. Desde tu panel administrás productos, precios y pedidos.\n\n" . wabot_respuestas_rapidas_planes_texto('ecommerce'),
            "Para lo que me contás, te serviría una web inmobiliaria para publicar propiedades con fotos y filtros. Desde tu panel las cargás, editás y das de baja.\n\n" . wabot_respuestas_rapidas_planes_texto('inmobiliaria'),
            "Para lo que me contás, te serviría una plataforma para vender cursos, organizar videos, dar acceso a alumnos y cobrar online. Desde tu panel administrás cursos y alumnos.\n\n" . wabot_respuestas_rapidas_planes_texto('elearning'),
            'Con el plan anual arrancás con una seña de $40.000 (sitio profesional) o $60.000 (tienda, cursos o inmobiliaria) y el resto se paga al entregar la web. Después se renueva una vez por año, contado desde la seña, sin suscripción.',
            'Con el pago único, la web queda abonada en su totalidad. Son $200.000 el sitio profesional, $300.000 la tienda, $290.000 los cursos y $260.000 la inmobiliaria. No incluye mantenimiento ni renovaciones.',
            'Los dos planes incluyen hosting, dominio, soporte técnico y mantenimiento de la web. No incluyen administrar tus productos o pedidos: eso lo manejás vos desde tu panel.',
            'Antes de arrancar dejamos definido el valor y qué incluye el desarrollo, así sabés desde el principio cuánto vas a pagar.',
        ]],
        ['ico' => '💳', 'titulo' => 'Pagos', 'items' => [
            "Te paso los datos para la seña. En cuanto se acredite arrancamos con el desarrollo:\n\nEDITAR DATOS DE PAGO",
            'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($30.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual30',
            'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($40.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual40',
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
        /* Desde el 26-sep "Presupuesto y planes" queda oculta y sin los bloques
         * (pasaron a "Precios"): sin ellos, el "$290.000" del pago único de los
         * cursos alcanzaba para confundirla con esta primera versión y le
         * volvían a entrar los bloques de fábrica. Esa versión nunca tuvo
         * categorías ocultas. */
        if (!empty($categoria['oculta'])) break;
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
        $cat = ['ico' => $ico, 'titulo' => $titulo, 'items' => $items];
        // Oculta (26-sep): queda en la pestaña Respuestas pero no en el chat.
        if (!empty($categoria['oculta'])) $cat['oculta'] = true;
        $salida[] = $cat;
    }
    return $salida;
}

/** Arranque del bloque de planes, el mismo que manda el bot. */
const WABOT_RR_BLOQUE_PLANES = 'Podés elegir una de estas 3 modalidades de pago:';
/* Los arranques que tuvo antes, para reconocer los bloques guardados y
   pasarlos al texto de hoy: "dos planes" hasta el 21-sep, "tres opciones"
   hasta el 24-sep. */
const WABOT_RR_BLOQUES_PLANES_ANTERIORES = ['Podés elegir entre tres opciones:', 'Podés elegir entre dos planes:'];

/** Las recomendaciones de fábrica anteriores, por tipo de web. */
function wabot_respuestas_rapidas_intros_viejas() {
    return [
        'landing' => ['Para lo que me contás, te serviría un sitio profesional donde puedas mostrar tus servicios, trabajos e información de contacto, pensado para transmitir confianza y recibir consultas.'],
        'ecommerce' => ['Para lo que me contás, te serviría una web para vender online, con catálogo, carrito, integración de cobros con Mercado Pago y un panel administrativo para cargar productos y gestionar pedidos.'],
        'inmobiliaria' => ['Para tu inmobiliaria te serviría una web para publicar propiedades con fotos y fichas completas, buscador por zona, tipo y precio, y un panel administrativo para cargar, editar y dar de baja propiedades.'],
        'elearning' => ['Para tus cursos te serviría una plataforma con los videos subidos, acceso propio para cada alumno y cobro online.'],
    ];
}

/** Qué tipo de web recomienda un bloque de precio, por lo que dice arriba. */
function wabot_respuestas_rapidas_tipo_de($intro, $bloque = '') {
    $t = mb_strtolower($intro);
    if (mb_strpos($t, 'inmobiliaria') !== false || mb_strpos($t, 'propiedades') !== false) return 'inmobiliaria';
    if (mb_strpos($t, 'curso') !== false || mb_strpos($t, 'alumno') !== false) return 'elearning';
    if (mb_strpos($t, 'tienda') !== false || mb_strpos($t, 'vender online') !== false
        || mb_strpos($t, 'carrito') !== false || mb_strpos($t, 'productos') !== false) return 'ecommerce';
    if (mb_strpos($t, 'sitio profesional') !== false) return 'landing';
    /* Sin pistas arriba, por los montos del bloque. Primero el plan anual de
     * hoy de cada tipo: desde el 26-sep el bloque se rearma con los montos de
     * textos.php, y con el test de precios el sitio pasó a $30.000 por mes,
     * la mensualidad que antes era de la tienda. Después, la de antes:
     * $20.000 por mes era el sitio. */
    require_once __DIR__ . '/textos.php';
    $tipos = (array)(wabot_textos_default()['tipos'] ?? []);
    foreach (['landing', 'inmobiliaria', 'elearning', 'ecommerce'] as $tipo) {
        $anual = trim((string)($tipos[$tipo]['precio'] ?? ''));
        if ($anual !== '' && preg_match('/Plan anual:\s*' . preg_quote($anual, '/') . '(?![\d.])/u', $bloque)) return $tipo;
    }
    return mb_strpos($bloque, '$20.000') !== false ? 'landing' : 'ecommerce';
}

/**
 * Los bloques de precio del panel se rearman en CADA carga con los montos y el
 * texto que manda hoy el bot (Pablo, 21-sep: "las respuestas rápidas tienen los
 * precios y mensajes viejos"). La migración del 20-sep no los alcanzó: buscaba
 * el arranque del texto de fábrica y ese mismo día se habían acortado las
 * recomendaciones, así que no coincidía ninguno y en el panel seguían los
 * $140.000 / $230.000 con las viñetas viejas.
 *
 * Solo se toca lo que genera el bot: el bloque de los planes, y únicamente si
 * conserva su forma ("Podés elegir entre dos planes:" con las dos viñetas). La
 * recomendación de arriba se respeta si Pablo la reescribió; si es una de
 * fábrica, pasa a la de ahora.
 */
function wabot_respuestas_rapidas_precios_al_dia($categorias) {
    $fabrica = [];
    foreach (wabot_respuestas_rapidas_default() as $predeterminada) {
        if ($predeterminada['titulo'] === 'Presupuesto y planes') $fabrica = array_slice($predeterminada['items'], 0, 4);
    }
    if (count($fabrica) !== 4) return $categorias;
    $porTipo = array_combine(['landing', 'ecommerce', 'inmobiliaria', 'elearning'], $fabrica);
    $viejas = wabot_respuestas_rapidas_intros_viejas();

    foreach ($categorias as &$categoria) {
        // "Precios" es donde quedaron los bloques al ordenar el panel el 26-sep.
        if (!in_array(mb_strtolower(trim((string)($categoria['titulo'] ?? ''))), ['presupuesto y planes', 'precios'], true)) continue;
        foreach ((array)($categoria['items'] ?? []) as $i => $texto) {
            $texto = (string)$texto;
            $corte = mb_strpos($texto, WABOT_RR_BLOQUE_PLANES);
            foreach (WABOT_RR_BLOQUES_PLANES_ANTERIORES as $anterior) {
                if ($corte === false) $corte = mb_strpos($texto, $anterior);
            }
            if ($corte === false) continue;
            $bloque = mb_substr($texto, $corte);
            // Las dos líneas del bloque, como las escribió el bot en cualquier
            // versión: con viñeta hasta el 21-sep y numeradas desde entonces.
            if (!preg_match('/(?:•|\d[.)])\s*Plan anual:/u', $bloque)
                || !preg_match('/(?:•|\d[.)])\s*Plan mensual:/u', $bloque)) continue;
            $intro = rtrim(mb_substr($texto, 0, $corte));
            $tipo = wabot_respuestas_rapidas_tipo_de($intro, $bloque);
            $nuevo = (string)($porTipo[$tipo] ?? '');
            $corteNuevo = $nuevo === '' ? false : mb_strpos($nuevo, WABOT_RR_BLOQUE_PLANES);
            if ($corteNuevo === false) continue;
            $categoria['items'][$i] = ($intro === '' || in_array($intro, $viejas[$tipo] ?? [], true))
                ? $nuevo
                : $intro . "\n\n" . mb_substr($nuevo, $corteNuevo);
        }
    }
    unset($categoria);
    return $categorias;
}

/**
 * Respuestas escritas a mano que quedaron con el modelo viejo: la suscripción
 * de $25.000, el pago único como una de las dos opciones y el código a los dos
 * años. Se cambian una sola vez y por texto exacto, así lo que Pablo reescriba
 * después no se vuelve a pisar.
 */
function wabot_respuestas_rapidas_textos_21sep($categorias) {
    require_once __DIR__ . '/textos.php';
    $tipos = (array)(wabot_textos_default()['tipos'] ?? []);
    $monto = static fn($tipo, $clave) => (string)($tipos[$tipo][$clave] ?? '');
    $reemplazos = [
        'En el sitio profesional los cambios los hacemos nosotros. Si querés cambiar vos los textos y las imágenes, le sumamos un panel de administración y el plan mensual pasa a $25.000.'
            => 'Los dos planes incluyen un cambio por mes en la web. Si vas a necesitar cambios más seguido, está el plan mensual con cambios: '
                . $monto('landing', 'mensualidad_cambios') . ' el sitio profesional y ' . $monto('ecommerce', 'mensualidad_cambios') . ' la tienda, los cursos o la inmobiliaria.',
        'Luego de los 2 años, si deseas continuar con otra persona, te entregamos el código de la página'
            => 'El código de la web pasa a ser tuyo según el plan: con el pago único, cuando abonás el total; con el plan anual, al pagar el segundo año; con el plan mensual, a los 18 meses. Hasta ese momento el código es nuestro.',
        'La suscripción no tiene una duración fija. Es mensual y se mantiene activa mientras quieras seguir usando el servicio. Abonás $25.000 por mes e incluye la web, hosting, dominio, mantenimiento y soporte'
            => 'El plan mensual no tiene permanencia: se mantiene activo mientras quieras seguir usando el servicio. Son '
                . $monto('landing', 'mensualidad') . ' por mes el sitio profesional y ' . $monto('ecommerce', 'mensualidad')
                . ' la tienda, los cursos o la inmobiliaria, e incluye la web, hosting, dominio, mantenimiento y soporte.',
        "Si elegís el pago único, se abona una seña para comenzar y el resto cuando la web está lista para publicarse. Si elegís la suscripción, se abona la primera cuota mensual para iniciar.\nDespués te paso un formulario cortito donde cargás el nombre del negocio, todos los datos, productos y la información de la tienda, elegis el modelo de web que te gustaría y con eso empezamos a armarla."
            => "Si elegís el plan anual, se abona una seña para comenzar y el resto cuando la web está lista para publicarse. Si elegís el plan mensual, se abona la primera mensualidad para iniciar.\nDespués te paso un formulario cortito donde cargás el nombre del negocio, todos los datos, productos y la información de la tienda, elegís el modelo de web que te gustaría y con eso empezamos a armarla.",
        'Perfecto. Para arrancar primero decime cuál de las dos opciones preferís: pago único de $290.000 o suscripción de $25.000 por mes.'
            => 'Perfecto. Para arrancar primero decime qué plan preferís: el anual o el mensual.',
    ];
    foreach ($categorias as &$categoria) {
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $texto = (string)$texto;
            $items[] = $reemplazos[$texto] ?? $texto;
        }
        $categoria['items'] = array_values(array_unique($items));
    }
    unset($categoria);
    return $categorias;
}

/**
 * El botón único de Pagos ("Te mando el link... EDITAR LINK", Pablo lo
 * completaba a mano en cada conversación) se separa en dos, uno por cada
 * plan mensual base, ya con el link real de la página de suscripción
 * correspondiente. Solo reemplaza el texto exacto de fábrica (incluida la
 * variante "suscripción mensual" de antes del 19-sep, que ya llega
 * normalizada por wabot_respuestas_rapidas_planes_19sep); lo que Pablo haya
 * editado a mano no se toca.
 */
function wabot_respuestas_rapidas_links_mensuales_25sep($categorias) {
    $viejo = 'Te mando el link de Mercado Pago para activar el plan mensual. Una vez realizado el pago queda activo el servicio: EDITAR LINK';
    $nuevos = [
        'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($20.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual20',
        'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($30.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual30',
    ];
    foreach ($categorias as &$categoria) {
        if (mb_strtolower(trim((string)($categoria['titulo'] ?? ''))) !== 'pagos') continue;
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            if ((string)$texto === $viejo) {
                array_push($items, ...$nuevos);
            } else {
                $items[] = $texto;
            }
        }
        $categoria['items'] = array_values(array_unique($items));
    }
    unset($categoria);
    return $categorias;
}

/**
 * Test de precios (26-sep): tienda/cursos/inmobiliaria pasa de $30.000 a
 * $40.000 por mes, con una página de suscripción nueva. Reemplaza por texto
 * exacto, igual que wabot_respuestas_rapidas_links_mensuales_25sep; lo que
 * Pablo haya editado a mano no se toca.
 */
function wabot_respuestas_rapidas_plan_otros_40k_26sep($categorias) {
    $viejo = 'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($30.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual30';
    $nuevo = 'Te mando el link de Mercado Pago para activar el plan mensual de la tienda, los cursos o la inmobiliaria ($40.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual40';
    foreach ($categorias as &$categoria) {
        if (mb_strtolower(trim((string)($categoria['titulo'] ?? ''))) !== 'pagos') continue;
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $items[] = (string)$texto === $viejo ? $nuevo : $texto;
        }
        $categoria['items'] = array_values(array_unique($items));
    }
    unset($categoria);
    return $categorias;
}

/**
 * Test de precios (26-sep): el sitio profesional pasa de $20.000 a $30.000
 * por mes, reutilizando la página y el link de Mercado Pago que hasta ahora
 * eran de tienda/cursos/inmobiliaria (ese grupo se mudó a mensual40). Mismo
 * criterio que las otras migraciones de esta familia: texto exacto, lo que
 * Pablo haya editado a mano no se toca.
 */
function wabot_respuestas_rapidas_plan_landing_30k_26sep($categorias) {
    $viejo = 'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($20.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual20';
    $nuevo = 'Te mando el link de Mercado Pago para activar el plan mensual del sitio profesional ($30.000 por mes). Una vez realizado el pago queda activo el servicio: gokywebs.com/pago/mensual30';
    foreach ($categorias as &$categoria) {
        if (mb_strtolower(trim((string)($categoria['titulo'] ?? ''))) !== 'pagos') continue;
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $items[] = (string)$texto === $viejo ? $nuevo : $texto;
        }
        $categoria['items'] = array_values(array_unique($items));
    }
    unset($categoria);
    return $categorias;
}

/**
 * Las respuestas que Pablo escribe a mano después del precio y la oferta de la
 * muestra gratis, sacadas de sus chats reales del 14 al 26-sep (122 charlas,
 * unos 360 mensajes suyos) y unificadas: las que decían lo mismo quedaron en
 * una sola, con su forma de decirlo y sin los errores de tipeo. Lo muy
 * puntual de una charla (nombres de dominio, el kiosco, un "dale") no entró.
 *
 * Los montos van como marcadores —{precio}, {mensualidad}, {sena}, {saldo},
 * {precio_unico}, {mantenimiento_mes}, {carga_producto}— y se completan al
 * abrir cada charla (wabot_respuestas_rapidas_montos). Los datos para la seña
 * no están acá: se mudan los que Pablo ya tenía cargados (con su alias y su
 * CVU), ver wabot_respuestas_rapidas_chats_26sep().
 */
function wabot_respuestas_rapidas_chats_26sep_categorias() {
    return [
        ['ico' => '🖼️', 'titulo' => 'Muestra gratis', 'items' => [
            'La muestra es sin cargo y sin compromiso: es para que veas cómo quedaría tu web antes de decidir. No tenés que abonar nada, solo completar el formulario.',
            'Una vez que completes el formulario, en menos de 24 hs tenés la muestra lista.',
            '¡Perfecto, ya me llegó! Hoy a la tarde te mando la muestra por acá.',
            '¡Perfecto, ya me llegó! Mañana te mando la muestra por acá.',
            'Mejor que un video: la muestra gratis es tu propia página, todavía sin terminar, para que veas cómo quedaría. Y si querés ver webs ya terminadas y funcionando, están en gokywebs.com/portfolio',
            'En la parte de arriba de la muestra podés cambiar entre el modelo 1 y el modelo 2, para que elijas el que más te guste.',
            '¡Buenísimo! Avisame cuál de los dos modelos te gustó más.',
            '¡Buenísimo, avanzamos con ese modelo! ¿Qué cambios te gustaría hacerle? Pasame todo lo que quieras modificar: textos, fotos, colores o secciones.',
            'Es una primera muestra: los textos, las fotos, los colores y las secciones se ajustan a tu negocio, y se le puede agregar lo que quieras. La idea es ir puliéndola juntos hasta que quede como te guste.',
            'Es una primera muestra del diseño, por eso todavía no tiene la compra funcionando. Cuando arrancamos hacemos el desarrollo completo: carrito, cobros con Mercado Pago, panel administrativo y la publicación en tu dominio.',
            'De tu rubro exacto todavía no tenemos una web publicada, pero te recomiendo mirar las de otros rubros en gokywebs.com/portfolio: lo importante es que veas el diseño, cómo se muestran los productos y la experiencia de compra. La muestra igual te la armamos adaptada a tu negocio y a tu marca.',
        ]],
        ['ico' => '💬', 'titulo' => 'Dudas de planes', 'items' => [
            'No, son alternativas: elegís una sola de las tres modalidades, no se suman. En el plan anual y en el mensual ya está incluido el mantenimiento. En el pago único la web queda abonada por completo, pero el mantenimiento y las renovaciones no están incluidos.',
            "La web es la misma en las tres modalidades: mismo diseño, mismas funciones y el mismo panel. Lo que cambia es la forma de pago y el mantenimiento:\n\n• Plan mensual: {mensualidad} por mes, con suscripción de Mercado Pago. Incluye el mantenimiento y no tiene permanencia.\n• Plan anual: {precio} por año, con el mantenimiento incluido.\n• Pago único: {precio_unico} una sola vez. La web queda paga en su totalidad, pero el mantenimiento no está incluido: después del primer año, el hosting y el dominio se renuevan aparte.",
            'Por lo que me contás, te recomendaría el plan anual: tenés la web completa con el mantenimiento incluido y, en el año, termina siendo más económico que pagar mes a mes. El mensual te conviene si preferís arrancar con una inversión más baja, y el pago único si querés pagar la web completa de una vez y después manejar el mantenimiento y las renovaciones aparte.',
            'Sí, las tres modalidades incluyen el armado completo de la web; lo único que cambia es cómo la pagás. Eso lo elegís vos.',
            'Correcto, no hay que abonar nada más: el plan incluye todo lo que figura en la lista. No solo armamos la web, también están incluidos el mantenimiento, el soporte y la renovación del hosting y el dominio.',
            'El mantenimiento es todo lo técnico para que la web siga funcionando bien: la renovación del hosting y el dominio, las actualizaciones de SDK y plugins, el arreglo de errores, el soporte técnico y las copias de seguridad. No es cargar productos ni administrar la página: eso lo manejás vos desde tu panel.',
            'Es en pesos. El plan mensual es de {mensualidad} por mes; el anual es de {precio} y se paga una vez por año, no por mes.',
            'El plan mensual no tiene permanencia ni una duración fija: es mes a mes y la web se mantiene activa mientras quieras seguir con el servicio. Incluye la web, el hosting, el dominio, el mantenimiento y el soporte.',
            'El valor del plan se actualiza una vez por año, según la inflación.',
            'El plan mensual no funciona como cuotas de la web sino como un servicio mes a mes, por eso los meses abonados no se descuentan del pago único. Si en algún momento preferís pasarte al pago único, podés hacerlo, y desde ahí dejás de pagar el plan mensual.',
            'Le decimos sitio profesional a una web para mostrar tus servicios o productos y recibir consultas por WhatsApp, sin venta online. Si querés que los clientes armen el carrito y paguen desde la web, lo que corresponde es la tienda online.',
            'Veo que te pasaron el valor de un sitio profesional. ¿Vos buscás vender a través de la web, que el cliente arme el carrito y pague ahí mismo? Si es así, te corresponde la tienda online y te paso ese valor.',
            'Te consulto, ¿qué modalidad preferís: el plan mensual, el anual o el pago único? Así te paso los datos para arrancar.',
        ]],
        ['ico' => '🚀', 'titulo' => 'Arranque y pagos', 'items' => [
            'Para el plan mensual nos manejamos con una suscripción de Mercado Pago, así ninguno de los dos tiene que estar pendiente del pago: el cobro se hace solo cada mes y la podés dar de baja cuando quieras desde el mismo Mercado Pago. Con el primer pago avanzamos con los cambios, definimos juntos el dominio y en menos de 7 días la web queda terminada.',
            '¡Buenísimo! Para avanzar con el plan anual trabajamos con una seña de {sena}: con ese pago empezamos con los cambios y el desarrollo de la web. Cuando esté terminada y lista para publicar, se abona el saldo de {saldo}.',
            // Acá entran los datos para la seña que Pablo ya tenía cargados.
            'Con el pago único también arrancamos con una seña de {sena}, para empezar a trabajar y dejar la web completamente terminada y funcionando. El resto se abona cuando la página está lista, con todos los cambios acordados hechos y antes de publicarla. En total son {precio_unico}, y se puede pagar en cuotas con intereses.',
            "Te cuento cómo se paga cada modalidad:\n\n• Plan mensual: con suscripción de Mercado Pago. Se abona al comenzar: con el primer pago arrancamos y en menos de 7 días la web queda funcionando.\n• Plan anual: arrancamos con una seña de {sena} y el saldo se abona cuando la web está terminada, antes de publicarla. Después se renueva una vez por año.\n• Pago único: también con una seña para arrancar y el resto al terminar la web. Se puede pagar en cuotas con intereses.\n\nEl plan anual y el pago único se pueden abonar por transferencia o con tarjeta de crédito.",
            'Perfecto, anoté todos los cambios que me pasaste 👍 Antes de avanzar con las modificaciones, confirmame qué modalidad elegiste: el plan mensual, el anual o el pago único. Así te paso los datos para continuar y empezamos con todos los ajustes.',
            'Perfecto, entendí los cambios, se pueden hacer sin problema. Como elegiste el plan mensual, para avanzar primero se abona el primer mes: una vez acreditado, hacemos todos los cambios y seguimos trabajando sobre la propuesta hasta dejarla terminada.',
            'Una vez que arrancamos, en menos de 7 días la web queda terminada y funcionando, y desde ahí ya podés usar tu panel para cargar y cambiar lo que quieras.',
            'No te preocupes: no hay ninguna suscripción activa ni se te va a hacer ningún cobro. El link de Mercado Pago te lo mandé solo para que lo tengas si querés avanzar; la suscripción recién se activa cuando entrás al link y hacés el primer pago.',
            'La suscripción la cancelás cuando quieras desde Mercado Pago, en la sección Suscripciones. No hay permanencia.',
            '¡Genial, ya me llegó el pago! Te escribo desde mi otro número, 1125068578, que es el que uso con los clientes: por ahí me pasás el logo, las imágenes y todo lo que quieras cambiar, y seguimos avanzando.',
            'Para hacerte la factura, ¿me pasás el nombre o la razón social, el CUIT o CUIL y la condición frente al IVA? Facturamos con Factura C.',
        ]],
        ['ico' => '🛒', 'titulo' => 'Tienda y panel', 'items' => [
            'Sí, nosotros nos encargamos de toda la parte técnica: que la web funcione bien, esté actualizada, segura y sin errores. La gestión del negocio (cargar o modificar productos, precios, fotos y stock) la manejás vos desde tu panel, cuando quieras y sin costo extra. Igual, si necesitás ayuda con algo, te damos soporte.',
            'El panel es el mismo en las tres modalidades: desde ahí manejás productos, precios, fotos, stock y pedidos. Es bastante intuitivo, y cuando la web esté terminada podemos hacer una videollamada para verlo juntos.',
            'Podés tener todos los productos que quieras, no hay límite de productos ni de fotos. Nosotros cargamos los primeros 10 para dejar la tienda configurada, probar que todo funcione y publicarla; el resto lo cargás vos desde el panel cuando quieras. Si preferís que carguemos el catálogo completo nosotros, son {carga_producto} por producto.',
            'Sí, tus clientes hacen toda la compra desde la página: eligen los productos, los agregan al carrito, completan sus datos y pagan online con Mercado Pago. Una vez hecho el pago, te queda registrado el pedido para que lo prepares y lo envíes.',
            'El stock se descuenta solo con cada compra. Cuando te entra mercadería nueva, lo actualizás desde el panel.',
            "La tienda online incluye:\n\n• Catálogo con precios y stock\n• Carrito de compras y compra directa\n• Cobros con Mercado Pago\n• Gestión de pedidos\n• Control de stock\n• Envíos y retiro en el local\n• Categorías, buscador y filtros\n• Promociones y productos destacados\n• WhatsApp, ubicación, horarios y mapa\n• Diseño adaptado a la identidad de tu negocio\n• Panel para administrar todo vos",
            'Los cobros de la web los integramos con Mercado Pago. Si usás otra billetera, por ejemplo PayPal para cobrar en dólares, también la podemos integrar.',
            'Sí, sumamos WhatsApp a la web: un botón de contacto general y también la opción de consultar por cada producto.',
            'Los envíos se pueden calcular de dos maneras: conectando tu cuenta de Correo Argentino o Andreani, que calcula el costo según el código postal de origen y de destino, el peso y las medidas del paquete; o fijando vos los precios por zona o provincia desde el panel. También se puede ofrecer retiro en el local. El despacho de los paquetes lo hacés vos.',
            'Para arrancar te recomiendo fijar un precio de envío por zona, por ejemplo uno para tu ciudad y otro para el resto del país. Antes de definirlos, fijate en Correo Argentino o Andreani cuánto sale en promedio un envío como los tuyos.',
            'Los envíos internacionales los gestionás vos con la empresa de correo o logística que elijas. En la web mostramos las opciones, los costos y las condiciones de envío, y si trabajás con una empresa que tenga integración (como DHL o FedEx), vemos de conectarla.',
        ]],
        ['ico' => '🌐', 'titulo' => 'Dominio y hosting', 'items' => [
            'El dominio es la dirección de tu web, por ejemplo www.tumarca.com.ar: es lo que compartís con tus clientes y lo que aparece en Google. Está incluido en el plan y el nombre lo elegís vos.',
            'El dominio lo definimos juntos: pasame 2 o 3 nombres que te gusten y me fijo cuáles están disponibles, porque son únicos y puede que alguno ya esté registrado.',
            'Revisé esas opciones y ya están registradas. Te paso alternativas que sí están disponibles:',
            '¡Perfecto, vamos con ese dominio! Para comenzar solo falta el primer pago (la seña o la primera mensualidad, según la modalidad que elegiste). Una vez acreditado, registramos el dominio y arrancamos con los cambios y el armado de la web. En menos de 7 días ya estaría terminada.',
            'Si ya tenés un dominio, usamos ese, no hay problema: lo conectamos a la web nueva.',
            'El plan incluye un dominio .com.ar. Si preferís un .com, tiene un adicional de $15.000 y se renueva cada año.',
            'Sí, el dominio puede quedar a tu nombre: lo podés registrar vos, o lo registramos nosotros y cuando la web esté terminada te pasamos la titularidad. Para transferir un .com.ar tenés que tener el alta en TAD (Trámites a Distancia) de ARCA, y la transferencia tiene un costo de $8.500.',
            'Con el pago único, el código y el dominio de la web quedan a tu nombre, y el primer año de hosting y dominio está incluido. Después se renuevan una vez por año (hoy ronda los $60.000 anuales), o contratás el mantenimiento por {mantenimiento_mes}, que ya incluye esa renovación. Si no contratás el mantenimiento y surge algún error o un cambio, se cotiza ese trabajo aparte.',
            'Si preferís el hosting a tu nombre, te mando una invitación por mail: te creás la cuenta en Hostinger, contratás el plan y yo quedo con acceso para subir la web. En ese caso, el total de la web se abona cuando esté lista, antes de subirla al servidor.',
            'Trabajamos con desarrollo propio (no WordPress ni WooCommerce) y hosting en Hostinger, con copias de seguridad automáticas. La web no depende de licencias ni de plugins pagos, así que no hay servicios con costo aparte.',
            'Sí, podemos pasar los textos y las imágenes de tu web actual a la nueva, que armamos de cero con un diseño más moderno, y mantener el mismo dominio. ¿Sabés dónde está subida hoy (qué hosting usan)?',
        ]],
        ['ico' => '📣', 'titulo' => 'Redes y Google', 'items' => [
            'Sí, la web queda vinculada con tu WhatsApp y tus redes (Instagram, Facebook, YouTube), y el link lo podés compartir en todas para que tus clientes entren directo. Lo que no está incluido es la publicidad: nosotros hacemos y mantenemos la web, y las campañas en Instagram, Facebook o Google se manejan aparte, con Meta Ads, Google Ads o la persona que maneje tu publicidad.',
            'Te comento que nosotros no manejamos redes sociales: hacemos la página web, para que tengas todo lo que ofrecés en un solo lugar, bien presentado, y los clientes puedan ver el detalle y escribirte por WhatsApp.',
            'Para vender más, lo que suma es la publicidad. La tienda online te ayuda a vender de forma automática: no tenés que pasarle el catálogo y los precios a cada cliente ni cobrarle a mano; arman el carrito, pagan, y vos te enterás cuando te entra la plata.',
            'Sí, la web aparece en Google: sale preparada con lo básico de SEO y la damos de alta en Google Search Console. Los primeros puestos no se pueden garantizar: se ganan con el tiempo, a medida que la web suma visitas, o pagando publicidad en Google.',
        ]],
        ['ico' => '⏳', 'titulo' => 'Sin apuro', 'items' => [
            'Claro, te entiendo. Igual te cuento que con el plan mensual son {mensualidad} por mes: no necesitás abonar el valor total de la web de una vez, y mientras mantengas el plan tenés la web activa con el mantenimiento y el soporte incluidos.',
            'Dale, no hay drama, lo dejamos para cuando puedas. Si te sirve, también podemos arrancar con el plan mensual.',
            'Dale, no hay apuro. Cualquier duda que te vaya surgiendo, escribime por acá, y avisame cuando estés para arrancar.',
            'Si todavía no tenés las fotos o los textos, no hay problema: podemos ir avanzando con la web mientras tanto y los sumás cuando los tengas.',
            'Hola, ¿cómo estás? ¿Pudiste ver la muestra al final? Contame cuál de los dos modelos te gustó más.',
            'Hola, ¿cómo estás? ¿Pudiste revisar el link para activar el plan mensual? Con el primer pago arrancamos con los cambios.',
            'Hola, ¿cómo estás? Te consulto si seguís con ganas de avanzar con el plan anual. Apenas se acredite la seña arrancamos con los cambios y el desarrollo de la web.',
        ]],
        ['ico' => '❓', 'titulo' => 'Otras consultas', 'items' => [
            'No usamos Tiendanube: hacemos la web a medida, de principio a fin, con carrito, cobros con Mercado Pago y tu propio panel para manejar todo. Las funciones son parecidas a las de Tiendanube, pero la web te la armamos nosotros.',
            'Podemos armar la web para que muestre tus productos de Mercado Libre, pero la compra se terminaría en Mercado Libre. Otra opción es que, en lugar de llevar a Mercado Libre, cada producto lleve a tu WhatsApp para que te consulten directo.',
            'Para una app o un sistema a medida el presupuesto es personalizado. Contame qué necesitás que haga (por ejemplo, reservar turnos, registrar clientes o llevar el stock) y lo vemos; si preferís, lo charlamos por videollamada.',
            'Dale, podemos hacer una videollamada por Meet o Zoom. Me queda cómodo al mediodía o después de las 18 hs. ¿Qué día y horario te sirve? Pasame tu mail así te mando la invitación.',
            'Este número no acepta llamadas. Te escribo desde el 1125068578 y coordinamos un horario.',
            'Somos de Tigre, Buenos Aires. Trabajamos todo online, así que no importa desde dónde estés.',
            'Perdón, hasta recién te contestaba el bot automático. Ahora te escribo yo, Pablo.',
        ]],
    ];
}

/** Los datos para la seña que Pablo cargó a mano (alias y CVU): van tal cual. */
function wabot_respuestas_rapidas_es_datos_sena($texto) {
    $t = mb_strtolower((string)$texto);
    if (mb_strpos($t, 'datos para la seña') !== false) return true;
    return mb_strpos($t, 'seña') !== false
        && (mb_strpos($t, 'alias') !== false || mb_strpos($t, 'cvu') !== false || mb_strpos($t, 'cbu') !== false);
}

/** Uno de los bloques de precio que genera el bot (con el arranque de hoy o uno anterior). */
function wabot_respuestas_rapidas_es_bloque_precio($texto) {
    foreach (array_merge([WABOT_RR_BLOQUE_PLANES], WABOT_RR_BLOQUES_PLANES_ANTERIORES) as $arranque) {
        if (mb_strpos((string)$texto, $arranque) !== false) return true;
    }
    return false;
}

/**
 * El panel ordenado con las respuestas de los chats (Pablo, 26-sep: "las
 * respuestas rápidas que están ahora escondelas, excepto las de los precios").
 * Una sola vez:
 * - las categorías de antes quedan ocultas, no borradas: siguen en la pestaña
 *   Respuestas y se vuelven a mostrar con un tilde;
 * - los bloques de precio pasan a "Precios", visible, donde precios_al_dia los
 *   sigue rearmando con los montos de textos.php;
 * - los datos para la seña (su alias y su CVU) se mudan tal cual a "Arranque
 *   y pagos";
 * - se suman las categorías nuevas, con los bloques de precio en segundo lugar.
 * Si el panel ya tiene alguna categoría oculta o alguna de las nuevas, se
 * considera ordenado y no se toca (además de la marca en data/migrated/ que
 * pone el load(): lo que Pablo borre o vuelva a mostrar después no se pisa).
 */
function wabot_respuestas_rapidas_chats_26sep($categorias) {
    $nuevas = wabot_respuestas_rapidas_chats_26sep_categorias();
    $titulosNuevos = array_merge(['precios'], array_map(static fn($cat) => mb_strtolower($cat['titulo']), $nuevas));
    foreach ($categorias as $categoria) {
        if (!empty($categoria['oculta'])
            || in_array(mb_strtolower(trim((string)($categoria['titulo'] ?? ''))), $titulosNuevos, true)) return $categorias;
    }

    $bloques = [];
    $sena = '';
    $ocultas = [];
    foreach ($categorias as $categoria) {
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $texto = (string)$texto;
            if (wabot_respuestas_rapidas_es_bloque_precio($texto)) { $bloques[] = $texto; continue; }
            if ($sena === '' && wabot_respuestas_rapidas_es_datos_sena($texto)) { $sena = $texto; continue; }
            $items[] = $texto;
        }
        if (!$items) continue;
        $categoria['items'] = $items;
        $categoria['oculta'] = true;
        $ocultas[] = $categoria;
    }
    if ($sena === '') $sena = "Te paso los datos para la seña, en cuanto se acredite arrancamos:\n\nEDITAR DATOS DE PAGO";

    $visibles = [];
    foreach ($nuevas as $categoria) {
        // Los datos para la seña, justo debajo de la explicación del plan anual.
        if ($categoria['titulo'] === 'Arranque y pagos') array_splice($categoria['items'], 2, 0, [$sena]);
        $visibles[] = $categoria;
        if ($categoria['titulo'] === 'Muestra gratis' && $bloques) {
            $visibles[] = ['ico' => '💰', 'titulo' => 'Precios', 'items' => array_values(array_unique($bloques))];
        }
    }
    return array_merge($visibles, $ocultas);
}

/**
 * "$30.000 (sitio profesional) o $40.000 (tienda, cursos o inmobiliaria)": el
 * monto de lista de cada grupo de tipos, para una charla que todavía no tiene
 * tipo. $campo es un campo de `tipos` (precio, mensualidad, sena…) o 'saldo'.
 */
function wabot_respuestas_rapidas_monto_por_tipo($cfg, $campo) {
    $nombres = ['landing' => 'sitio profesional', 'ecommerce' => 'tienda', 'elearning' => 'cursos', 'inmobiliaria' => 'inmobiliaria'];
    $porMonto = [];
    foreach ($nombres as $tipo => $nombre) {
        $t = (array)($cfg['tipos'][$tipo] ?? []);
        if ($campo === 'saldo') {
            $precio = wabot_monto_a_numero($t['precio'] ?? '');
            $sena = wabot_monto_a_numero($t['sena'] ?? '');
            $monto = ($precio > 0 && $sena > 0) ? wabot_moneda(max(0, $precio - $sena)) : '';
        } else {
            $monto = trim((string)($t[$campo] ?? ''));
        }
        if ($monto === '' || wabot_monto_a_numero($monto) <= 0) continue;
        $porMonto[$monto][] = $nombre;
    }
    if (count($porMonto) <= 1) return (string)(array_key_first($porMonto) ?? '');
    uksort($porMonto, static fn($a, $b) => wabot_monto_a_numero($a) <=> wabot_monto_a_numero($b));
    $partes = [];
    foreach ($porMonto as $monto => $grupo) $partes[] = $monto . ' (' . wabot_lista_o($grupo) . ')';
    return wabot_lista_o($partes);
}

/**
 * Completa los montos de una respuesta rápida para ESTA charla. Con tipo, los
 * de esa charla: el precio congelado si ya se le cotizó (wabot_precio_vigente:
 * a quien se le dijo $30.000 por mes antes del test de precios, le sigue
 * saliendo $30.000), la lista si no. Sin tipo, un monto por grupo de tipos.
 * Lo que no se puede completar queda como EDITAR IMPORTE, igual que en las
 * respuestas que se completan a mano.
 */
function wabot_respuestas_rapidas_montos($texto, $conv, $cfg) {
    $texto = (string)$texto;
    if (strpos($texto, '{') === false) return $texto;
    $tipos = (array)($cfg['tipos'] ?? []);
    $tipo = is_array($conv) ? (string)($conv['tipo'] ?? '') : '';
    $porMes = static fn($monto) => $monto !== '' ? $monto . ' por mes' : '';
    if ($tipo !== '' && isset($tipos[$tipo])) {
        $v = wabot_precio_vigente($conv, $cfg, $tipo);
        if (($v['modelo'] ?? '') === 'doble') {
            // Cotizada del 15 al 18-sep: su "precio" es el pago único de entonces, no un plan anual.
            $v['precio'] = trim((string)($tipos[$tipo]['precio'] ?? ''));
            $v['saldo'] = ($v['precio'] !== '' && $v['sena'] !== '')
                ? wabot_moneda(max(0, wabot_monto_a_numero($v['precio']) - wabot_monto_a_numero($v['sena']))) : '';
        }
        $montos = [
            '{precio}' => (string)$v['precio'], '{mensualidad}' => (string)$v['mensualidad'],
            '{sena}' => (string)$v['sena'], '{saldo}' => (string)$v['saldo'],
            '{precio_unico}' => trim((string)($tipos[$tipo]['precio_unico'] ?? '')),
            '{mantenimiento_mes}' => $porMes(trim((string)($v['mantenimiento'] ?? ''))),
        ];
    } else {
        $montos = [];
        foreach (['precio', 'mensualidad', 'sena', 'saldo', 'precio_unico'] as $campo) {
            $montos['{' . $campo . '}'] = wabot_respuestas_rapidas_monto_por_tipo($cfg, $campo);
        }
        $montos['{mantenimiento_mes}'] = $porMes(wabot_respuestas_rapidas_monto_por_tipo($cfg, 'mantenimiento'));
    }
    $montos['{carga_producto}'] = trim((string)($cfg['carga_producto'] ?? '')) ?: '$500';
    foreach ($montos as $marcador => $monto) {
        if ($monto === '') $montos[$marcador] = 'EDITAR IMPORTE';
    }
    return strtr($texto, $montos);
}

/** Lo que va al costado del chat y al buscador /: sin las ocultas y con los montos de esa charla. */
function wabot_respuestas_rapidas_visibles($categorias, $conv, $cfg) {
    $salida = [];
    foreach ((array)$categorias as $categoria) {
        if (!empty($categoria['oculta'])) continue;
        $items = [];
        foreach ((array)($categoria['items'] ?? []) as $texto) {
            $items[] = wabot_respuestas_rapidas_montos($texto, $conv, $cfg);
        }
        if (!$items) continue;
        $salida[] = ['ico' => (string)($categoria['ico'] ?? '💬'), 'titulo' => (string)($categoria['titulo'] ?? ''), 'items' => $items];
    }
    return $salida;
}

function wabot_respuestas_rapidas_load() {
    wabot_ensure_dirs();
    $ruta = WABOT_DATA . '/respuestas-rapidas.json';
    // El orden del 26-sep corre una sola vez: después, lo que Pablo borre o
    // vuelva a mostrar desde la pestaña Respuestas queda como lo dejó.
    $marca = WABOT_DATA . '/migrated/respuestas-rapidas-chats-26sep';
    if (!is_file($ruta)) return wabot_respuestas_rapidas_chats_26sep(wabot_respuestas_rapidas_default());
    $leido = json_decode((string)@file_get_contents($ruta), true);
    $normalizado = wabot_respuestas_rapidas_normalizar($leido);
    if ($normalizado === null) return wabot_respuestas_rapidas_chats_26sep(wabot_respuestas_rapidas_default());
    $migrado = wabot_respuestas_rapidas_plan_landing_30k_26sep(wabot_respuestas_rapidas_plan_otros_40k_26sep(wabot_respuestas_rapidas_links_mensuales_25sep(wabot_respuestas_rapidas_precios_al_dia(wabot_respuestas_rapidas_textos_21sep(
        wabot_respuestas_rapidas_planes_19sep(
            wabot_respuestas_rapidas_completar_precios(wabot_respuestas_rapidas_migrar_legacy($normalizado))
        )
    )))));
    $ordenar = !is_file($marca);
    if ($ordenar) $migrado = wabot_respuestas_rapidas_chats_26sep($migrado);
    $guardado = true;
    if ($migrado !== $normalizado) {
        $json = json_encode($migrado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        $guardado = is_string($json) && wabot_json_guardar_atomico($ruta, $json);
    }
    if ($ordenar && $guardado) @file_put_contents($marca, date('c') . "\n");
    return $migrado;
}

function wabot_respuestas_rapidas_save($valor) {
    $normalizado = wabot_respuestas_rapidas_normalizar($valor);
    if ($normalizado === null) return false;
    $json = json_encode($normalizado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return is_string($json) && wabot_json_guardar_atomico(WABOT_DATA . '/respuestas-rapidas.json', $json);
}
