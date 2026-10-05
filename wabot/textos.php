<?php
/**
 * wabot/textos.php — TODOS los textos que el bot le dice al cliente, y los
 * valores por defecto de los ajustes del panel.
 *
 * Se editan acá y se publican con el deploy. Los montos NUNCA van escritos en
 * un texto: {precio}, {precio_unico}, {sena}, {saldo}, {mensualidad}, {mantenimiento_mes},
 * {cambios_mes}, {tabla_precios} y {mensualidades} los resuelve
 * wabot_precio_placeholders() desde `tipos`.
 *
 * Condiciones vigentes (Pablo, 3-oct-2026): el bot ofrece DOS modalidades,
 * 1 mensual y 2 anual. El pago único existe solo para el que pide la
 * propiedad absoluta del código (info.web_propia, titularidad…); no se ofrece
 * en el precio. Hoy el bot está en "solo bienvenida" y el precio lo pasa Pablo.
 * - Mensual (3-oct, antes $19.000 / $29.000): $20.000 sitio profesional; $30.000 resto. Mercado Pago:
 *   mpago.la/1pfejMG (sitio) y el plan 36a67a7e… de MP (resto; 3-oct, planes nuevos). Sin pago inicial adicional.
 * - Anual (antes $149.000 / $190.000): $140.000 sitio profesional; $220.000 resto. Seña de $60.000,
 *   saldo al entregar y renovación anual desde la seña.
 * - Pago único (antes $190.000 / $290.000): $220.000 sitio profesional; $330.000 resto. Misma seña,
 *   saldo al entregar; hosting y dominio incluidos el primer año.
 * - Mensual/anual incluyen mantenimiento y un cambio al mes. El mantenimiento
 *   del pago único se contrata aparte por tipos[].mantenimiento.
 * - Las 3 incluyen la web completa: desarrollo, adaptada a celulares, panel
 *   para autogestionar contenido, SSL y preparada para Google.
 * - La propiedad del código SÍ se contesta (Pablo, 20-sep; el 19-sep el bot se
 *   callaba y era peor): pasa a ser del cliente cuando abona el total del pago
 *   único, al pagar el segundo año del plan anual o a los 18 meses del
 *   mensual. Antes de eso es de Gokywebs. Lo dicen info.titularidad,
 *   info.entrega_codigo, info.licencias y info.baja_del_plan.
 * - El turno del precio son dos mensajes: la propuesta con las 3 modalidades y
 *   su monto (`precio_modalidades`) y la oferta del primer diseño. Los links al
 *   detalle de cada una (`planes_links`: las páginas gokywebs.com/pago/…, solo si
 *   cobran los montos de la charla) iban en el medio del 29-sep al 2-oct; desde
 *   ahí salen solo si el cliente los pide (regla `detalle_modalidades` de
 *   postprecio.php) y están en las respuestas rápidas. La imagen ya no sale sola; `dos_formas`, la versión larga, queda para cuando
 *   el cliente vuelve a pedir el precio.
 * - Web propia: el que la quiere a su nombre recibe el pago único; si la
 *   quiere en su propio hosting desde el arranque, lo contrata él
 *   (info.web_propia).
 * - Los montos de cada charla se congelan al cotizar (wabot_precio_vigente) y
 *   se respetan, salvo que la lista haya bajado: ahí vale la lista. Las
 *   charlas cotizadas antes (precio_modelo 'doble': pago único con seña, del
 *   15 al 18-sep) conservan sus respuestas de seña y saldo.
 * - La recomendación es "Para lo que me contás, te podemos armar…" (o "Para
 *   {rubro}, te podemos armar…" si se sabe el rubro; Pablo, 27-sep: "no es te
 *   armamos, es te podemos armar"): {para_quien} lo resuelve
 *   wabot_personalizar(). El modelo clasifica, pero nunca redacta la propuesta.
 *   Desde el 27-sep la propuesta dice qué es, qué va a poder hacer el cliente
 *   con la web y qué maneja desde el panel ("una tienda online completa, para
 *   vender directo desde la web…"): ver wabot_propuesta_texto en engine.php.
 * - Después del precio se ofrece un "primer diseño" sin cargo (ya no "demo
 *   gratis"): el sí se lleva el formulario y todo lo demás —dudas, un "no", un
 *   "lo pienso"— lo contesta Pablo con las respuestas rápidas del panel (regla
 *   del 18-sep; el 20-sep se probó contestar las dudas y Pablo la revirtió, ver
 *   wabot_oferta_diseno_responder).
 * {nombre} lo pone wabot_personalizar(); {link}, {portfolio} y {portfolio_texto}
 * salen del tipo cotizado; {entrega} es el día de entrega de la demo.
 *
 * Las claves de wabot_ajustes_claves() (tiempos, modelo, CAPI, plantilla) son
 * las únicas que el panel puede pisar desde bot-config.json.
 */

function wabot_textos_default() {
    return [
    'aclarar_objetivo' => 'Para orientarte bien, confirmame qué parte querés resolver primero con la web: presentar tus servicios, recibir consultas o vender y cobrar online?',
    'activo' => true,
    'adicional_bilingue' => '$30.000',
    'baja' => 'Listo, no te escribimos más. Gracias por avisar.',
    'cambio_modalidad' => 'Arrancás con el plan que más te sirva hoy. Si más adelante querés pasarte de uno al otro, las condiciones de ese cambio las coordinás con el desarrollador.',
    'capi_dataset_id' => '',
    'capi_token' => '',
    'cambios_plan' => 'El plan mensual y el anual incluyen un cambio por mes en la web.',
    // Se suma a cambios_plan: los cuatro tipos incluyen panel (Pablo, 20-sep).
    'cambios_plan_panel' => 'Los textos y las imágenes los cambiás vos cuando quieras desde tu panel, sin costo.',
    'caro' => 'Si pagar el año entero se te hace mucho, está el plan mensual de {mensualidad}: arrancás con la primera mensualidad, y con eso armamos la web y la dejamos funcionando. En Tiendanube pagás parecido por mes y la web la armás vos; acá te la hacemos nosotros.',
    // Catálogo + WhatsApp, sin cobro online (Pablo, 18-sep): se cotiza como
    // sitio profesional y la carga de productos va aparte.
    'carga_producto' => '$500',
    // Texto de Pablo (28-sep): "va aparte" sonaba a que cargar productos siempre se paga.
    'catalogo_carga' => 'Los productos los podés cargar vos desde el panel. Si querés que hagamos nosotros la carga, tiene un costo de {carga_producto} por producto.',
    'cierre_comparando' => 'Dale. Antes de que decidas, podemos mostrarte cómo podría quedar tu web, gratis: así comparás con algo concreto y no solo con números. Cuando quieras, avisame.',
    /* Lo que no entra en el precio de lista: se nombra el motivo y lo toma el
     * desarrollador (18-sep). Nunca un precio estándar para un proyecto que no
     * es estándar. */
    'complejidad' => [
        'muchos_productos' => 'Con {cantidad} productos no es una tienda estándar: hay que ver cómo se importa el catálogo y cómo se mantiene el stock, y eso lo cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
        'mercadolibre' => 'Conectar la web con tus publicaciones de Mercado Libre no entra en el precio de lista: lo cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
        'integracion' => 'Conectar la web con el sistema que ya usás no entra en el precio de lista: lo cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
        'marketplace' => 'Una web donde vendan varios vendedores no entra en el precio de lista: la cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
        'entrega_digital' => 'La entrega automática de los archivos después del pago no entra en el precio de lista: la cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
        'portal' => 'Un portal de noticias no entra en el precio de lista: depende de las secciones y de cómo se publican las notas, y lo cotiza el desarrollador. Le paso tu consulta con todo lo que me contaste y te escribe desde nuestro número de proyectos.',
    ],
    'cierre_memoria' => 'Ya queda anotado que lo tuyo sería {tipo}, así que no vas a tener que explicar todo otra vez.',
    'cierre_suave' => 'Dale, ningún problema. Si más adelante querés retomarlo, escribime por acá.',
    'confirma_cambio' => 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?',
    'confirma_cambio_2' => 'Decime nomás: es para el mismo proyecto que veníamos viendo (respondé "mismo") o es otra web aparte (respondé "otra")?',
    'confirma_cambio_mismo' => 'Perfecto, seguimos con lo que veníamos viendo. En gokywebs.com/modelos/ podés elegir uno o dos modelos como referencia.',
    'confirmacion_demo_horas' => 72,
    'contame' => 'Contame un poco más, qué vendés o qué servicio ofrecés?',
    'contame_2' => 'Te lo pregunto de otra forma: a qué rubro te dedicás (por ejemplo indumentaria, gastronomía, construcción, salud) o qué es lo que ofrecés en una palabra?',
    'cta_muestra' => 'Podés mirar trabajos reales y elegir uno o dos modelos en gokywebs.com/modelos/.',
    'def_tipos' => "El sitio profesional es una página para presentar tu negocio o profesión, con toda tu info, tus trabajos y contacto directo a tu WhatsApp.\nEl ecommerce es una tienda online con catálogo, carrito y cobro online, con panel propio para cargar tus productos.\nTambién hacemos plataformas de cursos, con acceso propio para cada alumno, y webs para inmobiliarias.\nCuál encaja mejor con lo tuyo?",
    'demo_es_gratis' => 'Es gratis y sin compromiso.',
    'demora_entre_mensajes' => 8,
    'demora_maxima' => 15,
    'demora_minima' => 2,
    'demora_por_longitud' => true,
    'demora_primer_mensaje' => 10,
    'demora_segundos' => 15,
    'derivar' => 'Perfecto, {nombre}. A partir de acá sigue el desarrollador: te va a escribir desde nuestro número de proyectos para avanzar con la propuesta.',
    'descuento' => 'No manejamos descuentos: el valor es el mismo por transferencia o con tarjeta.',
    // La seña no se devuelve (Pablo, 15-sep): la del plan anual y la del pago
    // único. El turno queda marcado para el desarrollador.
    'devolucion' => 'La seña no se devuelve: por eso primero te armamos un primer diseño sin cargo, así lo ves antes de pagar nada. Y una vez que arrancamos, si el diseño no te convence lo rehacemos hasta dos veces; ya elegido, tenés tres rondas para ajustar el resto.',
    /* La versión larga de las 3 modalidades, con lo que incluye cada una. Desde
     * el 29-sep ya no sale en el turno del precio (ahí va `precio_modalidades`
     * y los links a cada página): sale cuando el cliente vuelve a pedir el
     * precio (`precio_resumen`) y en las respuestas rápidas del panel. */
    'dos_formas' => "Podés elegir una de estas 2 modalidades de pago:\n\n1. Plan mensual: {mensualidad} por mes, incluye mantenimiento\n2. Plan anual: {precio} por año, incluye mantenimiento\n\nLas 2 incluyen la web completa:\n✓ Desarrollo completo de la web\n✓ Adaptada a celulares\n✓ Panel para autogestionar contenido\n✓ Certificado de seguridad (SSL)\n✓ Preparada para que Google la encuentre\n\nY también el mantenimiento:\n✓ Renovación de hosting y dominio\n✓ Actualizaciones de SDK y plugins\n✓ Arreglo de errores\n✓ Soporte técnico\n✓ Copia de seguridad\n✓ Un cambio por mes",
    // Debajo de los planes, solo si el cliente pidió la web propia y el bloque no trae el pago único.
    'dos_formas_web_propia' => 'Y si la querés a tu nombre, está el pago único: {precio_unico}. El código queda tuyo cuando abonás el total, y si querés le sumás el mantenimiento por {mantenimiento_mes}.',
    /* El turno del precio (29-sep, Pablo): en el mismo mensaje que la propuesta,
     * las 3 modalidades con su monto —"Podés elegir 1 de estas 3 modalidades:
     * mensual, anual, pago único". Los links al detalle de cada una
     * (`planes_links`) salen solo si el cliente los pide (2-oct). La imagen del 25-sep quedó afuera ("puede ser confusa"). El "1",
     * "2" o "3" que contesta el cliente es el de esta lista. Los usan
     * wabot_servicio_texto() y wabot_planes_links_texto() en engine.php; las
     * páginas y sus montos, wabot_planes_paginas() en lib.php. */
    'precio_modalidades' => "Podés elegir 1 de estas 2 modalidades:\n\n1. Mensual: {mensualidad} por mes, incluye mantenimiento\n2. Anual: {precio} por año, incluye mantenimiento",
    'planes_links' => "Acá podés ver el detalle de cada modalidad:\n\nMensual: {link_mensual}\nAnual: {link_anual}",
    'ininteligible_primero' => 'Hola! No llegué a entender el mensaje. Contame a qué te dedicás o para qué sería la web y te ayudo.',
    'repregunta_suave' => 'Perdoná si no fui claro. Contame qué duda te quedó y te la respondo.',
    /* La pregunta de reconocimiento (Pablo, 21-sep): antes de cotizar una
     * TIENDA se pregunta una vez, porque con productos hay dos caminos
     * distintos —vender online o solo mostrarlos—. A los servicios no se les
     * pregunta ("si es abogado QUE va a vender por la web?"): se les cotiza el
     * sitio profesional derecho. Un tipo puede llevar su propia pregunta con
     * tipos[].reconocimiento_pregunta.
     * APAGADA desde el 24-sep (Pablo: "le damos mucha elección"): la pañalera
     * que contestó "vender, pero también como catálogo" se llevó el precio de
     * sitio profesional. Si el cliente VENDE algo, se cotiza tienda online sin
     * preguntar; si vende cursos, talleres o capacitaciones, plataforma de cursos. */
    /* Lo que copia el botón "Copiar form" del panel, para que Pablo se lo
     * mande él mismo (21-sep). El link con el código de la charla va abajo. */
    // El mensaje del botón "Copiar form" del panel, con el {link} en el medio (Pablo, 2-oct).
    'form_link_panel' => "Para hacer la primera entrega gratuita de la web, solo tendrías que llenar este formulario, toma 2 minutos: {link}\nLa entregamos en menos de 24 hs.",
    'reconocimiento_activo' => false,
    'reconocimiento' => 'Te consulto, buscás vender por la web o solo mostrar {lo_tuyo}?',
    'desempate_cursos' => 'Querés vender los cursos desde la web misma, con los videos subidos ahí y acceso propio para cada alumno, o preferís solo mostrarlos y que te contacten por WhatsApp?',
    'desempate_cursos_2' => 'Te lo simplifico: querés vender los cursos desde la web con los videos y acceso para cada alumno (respondé "vender"), o solo mostrarlos y que te escriban (respondé "mostrar")?',
    'desempate_hibrido' => 'Para cotizarte bien, confirmame una cosa: la web sería principalmente para mostrar tus trabajos y que te consulten por WhatsApp, o para vender tus productos y cobrar online?',
    'desempate_hibrido_2' => 'Te lo simplifico: respondeme "trabajos" o "vender", según cuál sea el objetivo principal de la web.',
    'escuchar_audios' => true,
    'espera' => 'El desarrollador ya tiene tu consulta: te escribe a la brevedad desde nuestro número de proyectos.',
    'espera_prediseno' => 'Listo, ya quedó todo anotado: la demo te llega {entrega}. Te la manda el desarrollador, por acá — y si te escribe desde otro número, es el nuestro de proyectos.',
    'form_activo' => true,
    /* Lo que pidió y no hacemos, dicho antes de la propuesta (18-sep: "nunca
     * ignorar una parte del mensaje"). Después, cómo lo ayuda igual la web. */
    'fuera_publicidad' => 'La publicidad y el manejo de redes no los hacemos: nosotros nos encargamos de la web.',
    'fuera_publicidad_tipo' => [
        'landing' => 'Con el sitio, el que te encuentra en redes llega a toda tu información y te escribe directo.',
        'ecommerce' => 'Con la tienda, la gente que te sigue en redes te compra directo desde el link, sin tener que escribirte.',
        'elearning' => 'Con la plataforma, el que te sigue en redes compra el curso directo desde el link.',
        'inmobiliaria' => 'Con la web, el que ve tus publicaciones en redes llega a todas tus propiedades y te consulta directo.',
    ],
    // Las funciones que el cliente pidió, nombradas en la propuesta (18-sep).
    'funciones_pedidas' => [
        'turnos_whatsapp' => 'un botón para pedir turnos por WhatsApp',
        'turnos_online' => 'turnos online, para que tus clientes elijan día y horario',
        'reservas' => 'reservas online',
        'instagram' => 'el acceso a tu Instagram',
        'resenas' => 'una sección de reseñas de tus clientes',
        'mapa' => 'el mapa con tu ubicación',
        'formulario' => 'un formulario de contacto',
        'carta' => 'la carta con tus platos',
        'idiomas' => 'la web en varios idiomas (hasta 3)',
        'envios' => 'el cálculo del envío al comprar',
        'cupones' => 'cupones de descuento',
    ],
    'funciones_pedidas_intro' => 'Y lleva lo que me pediste: {lista}.',
    'gemini_modelo' => 'gemini-3.5-flash-lite',
    'hosting_renovacion' => 'Con el plan mensual o el anual no hay renovación aparte: el hosting, el dominio, el mantenimiento y el soporte van incluidos mientras el plan esté activo.',
    'imagenes_pedido_generico' => 'el logo y 3 o 4 fotos de tu negocio',
    'info' => [
        'proceso' => 'Te pasamos el valor y, si te interesa, te armamos sin cargo un primer diseño de tu web. Si te gusta, arrancamos y en unos 7 días queda lista.',
        'pago' => 'Hay 2 modalidades: mensual de {mensualidad} por mes, por Mercado Pago y sin permanencia, o anual de {precio}, que arranca con una seña y el resto va al entregar.',
        'plazos' => "La web queda lista en unos 7 días desde que arrancamos con el plan y nos pasás el contenido.",
        'hosting' => 'Sí, el hosting y el dominio .com.ar van incluidos y nos ocupamos nosotros.',
        'mantenimiento' => 'El mantenimiento es lo que mantiene la web funcionando: actualizaciones, seguridad, arreglos, soporte y un cambio por mes. Va incluido en el plan mensual y en el anual.',
        'carga' => 'Sí, lo manejás vos desde tu panel, cuando quieras y sin costo extra. Los primeros productos los cargamos nosotros y, cuando esté lista, te mostramos cómo se usa.',
        'logo' => 'Logos no hacemos, pero no hace falta: si tenés uno lo usamos, y si no, armamos tu nombre con una tipografía que quede bien.',
        'marketing' => 'Publicidad y redes no hacemos, nos dedicamos a la web. Te la dejamos lista para compartir en tus redes y para conectar tus anuncios.',
        'reuniones' => 'Sí, claro. Las llamadas las coordinamos con el desarrollador cuando avanzamos con la web, en el horario que te quede cómodo.',
        'tecnologia' => 'Trabajamos con código propio, a medida, y hosting en Hostinger. No usamos WordPress ni plantillas.',
        // Marca interna de "no sé": desde el 19-sep NO se manda (Pablo: "cuando
        // el bot no entienda, no conteste nada"). wabot_salida_sin_comodin() la
        // saca de la salida y el chat le queda pendiente a Pablo.
        'otra' => 'Esa duda te la va a poder contestar el desarrollador cuando te escriba.',
        'pago_generico' => 'Hay 2 modalidades: mensual o anual. El valor depende del tipo de web: contame a qué te dedicás y te lo paso.',
        'precio_sin_rubro' => 'Con gusto te paso los valores. Te consulto, a qué te dedicás o qué vendés? Así te digo cuál te corresponde.',
        'ubicacion' => 'Somos de Tigre, Buenos Aires. No tenemos oficina: trabajamos de manera remota con clientes de todo el país, así que todo el proceso lo hacemos por acá.',
        /* La propiedad del código, con sus plazos (Pablo, 20-sep). El 19-sep
         * el bot se callaba con estas preguntas y era peor: cortaba la venta. */
        'accesos' => 'El hosting y el dominio los manejamos nosotros, en Hostinger: no tenés que configurar nada. Si necesitás un acceso puntual, lo vemos.',
        'titularidad' => 'El código pasa a ser tuyo con el pago único al abonar el total, con el anual al pagar el segundo año y con el mensual a los 18 meses. Hasta ahí es de Gokywebs.',
        'emails' => 'No incluye casillas de correo con tu dominio. Se pueden sumar aparte, contratadas a tu nombre.',
        'entrega_codigo' => 'Sí: con el pago único es tuyo al abonar el total, con el anual al pagar el segundo año y con el mensual a los 18 meses.',
        'licencias' => 'Las licencias de plugins y librerías son de terceros y no quedan a tu nombre. El código de tu web sí, cuando se cumple el plazo de tu plan.',
        'manual' => 'No hace falta manual: el panel es muy simple, y cuando la web esté lista te mostramos cómo se usa.',
        'bilingue' => 'Sí, está incluido: la web se puede traducir hasta a 3 idiomas, sin costo aparte.',
        'ejemplos' => 'Claro, en gokywebs.com/portfolio tenés webs que ya entregamos y están funcionando. Y si querés ver cómo quedaría la tuya, te armamos sin cargo un primer diseño.',
        'migracion' => 'Sí, pasamos nosotros los textos y las fotos de tu página actual a la nueva. Pasame el link y la reviso.',
        'formularios' => 'Sí, se pueden incluir formularios y ya vienen en el precio. Las respuestas te llegan por mail.',
        'imagenes_web' => 'Sí, la web lleva imágenes. Si tenés fotos propias las usamos, y si no, la armamos con imágenes acordes al rubro para que se vea completa desde el primer día.',
        'inscripcion' => 'Para hacerte la web no hace falta ninguna inscripción. Si tenés que estar inscripto para vender, eso conviene consultarlo con un contador.',
        'comparando' => 'Está perfecto comparar. Fijate qué incluye cada propuesta: si es a medida, si tenés tu panel y si van el hosting y el dominio.',
        'ya_tiene_plataforma' => 'Pasame el link y la reviso. No trabajamos sobre webs hechas: hacemos una nueva a medida, así que te digo si te conviene.',
        'no_se_nada' => 'No hace falta que sepas nada, de eso nos encargamos nosotros. Vos contanos de tu negocio.',
        'sin_logo' => 'No hace falta: armamos la web con el nombre de tu negocio y, si después tenés logo, se cambia.',
        'sin_fotos' => 'No hace falta: la muestra la armamos con imágenes del rubro y después las cambiamos por las tuyas.',
        'muestra_no_es_final' => 'No, la muestra es una primera versión para que veas el diseño. Si avanzamos, la terminamos con tu contenido y todas las funciones.',
        'responsive' => 'Sí, la web se adapta sola al celular, la tablet y la computadora. De hecho la diseñamos pensando primero en el celular, que es de donde entra la mayoría de la gente.',
        'seguridad' => 'Sí, la web va con certificado SSL (HTTPS) y los datos viajan cifrados.',
        'google' => 'La web queda preparada para que Google la encuentre. El puesto en que aparece depende del rubro y del tiempo, no se puede garantizar.',
        'maps' => 'Sí, si tenés local podemos sumar el mapa con tu ubicación y el acceso directo a Google Maps para que te lleguen con el GPS.',
        'ampliar_despues' => 'Sí, podés arrancar con lo que necesitás hoy y sumar funciones más adelante, sin rehacer la web.',
        'que_necesitan' => 'Muy poco: completás un formulario cortito (nombre, qué ofrecés, colores y contacto) y con eso armamos la muestra. Si tenés logo y fotos, mejor, pero no hacen falta.',
        'soy_bot' => 'No, soy el asistente automático de Gokywebs. Te puedo orientar con las opciones, los precios y cómo es el proceso, y cuando hace falta algo más te paso con el desarrollador.',
        /* "Su nombre?", "con quién hablo?" (26-sep): se contesta primero y
         * después sigue la pregunta comercial pendiente, en el mismo turno. */
        'quien_atiende' => 'Soy el asistente de Gokywebs. Te oriento con las opciones, los precios y cómo es el proceso, y cuando hace falta algo más te paso con el desarrollador.',
        'exclusividad' => 'Sí, es exclusivo: cada web se diseña a medida para tu negocio, así que no reciclamos el mismo diseño con otro cliente.',
        'fotos_propiedad' => 'Podés subir decenas de fotos por propiedad, y también video.',
        'impuestos_importacion' => 'No, la web no calcula impuestos de importación. Se podría sumar aparte, pero lo tiene que evaluar el desarrollador.',
        'pago_sin_precio' => 'Hay 2 modalidades: mensual por Mercado Pago, sin permanencia, o anual. Las dos incluyen hosting, dominio, mantenimiento y soporte.',
        'demo_vigencia' => 'La demo queda disponible 5 días, por una cuestión de espacio en el servidor. Dentro de ese plazo mirala con tranquilidad y contame qué te parece.',
        'facturacion' => 'Facturamos con Factura C. No emitimos Factura A ni B, así que no lleva IVA discriminado.',
        'apps' => 'Sí, también desarrollamos aplicaciones para celular. No entran en la lista de precios de las webs: se cotizan aparte según lo que necesite hacer la app.',
        'las_dos_formas' => 'Van las dos juntas: la tienda tiene carrito con pago online y también botón de WhatsApp.',
        'que_es_landing' => 'Es una web de una sola página que se recorre bajando, con las secciones que necesites: presentación, servicios, trabajos y contacto.',
        'contacto_desarrollador' => 'No tenés que hacer nada: te escribe él directamente por WhatsApp, desde nuestro número de proyectos. Si preferís escribirle vos primero, decímelo y le paso tu mensaje.',
        'sin_whatsapp' => 'No hay problema, el WhatsApp no es obligatorio: podemos poner un formulario de contacto o tu mail.',
        'comisiones' => 'No cobramos comisión por venta. Solo se descuenta la del medio de pago (Mercado Pago o la tarjeta).',
        'envios' => 'Sí, la tienda calcula el envío con el código postal, antes de pagar, y también podés ofrecer retiro o un costo fijo por zona. Los internacionales los coordinás vos con la empresa que elijas.',
        'como_funciona_tienda' => 'Sí, así: el cliente arma el carrito y paga desde la web, y el pedido te llega al panel.',
        'que_incluye' => 'Con el mensual o el anual está todo incluido: la web a medida, hosting, dominio, mantenimiento, soporte, un cambio por mes y tu panel para cargar los productos.',
        'emprendimientos' => 'Sí, trabajamos con emprendimientos y negocios chicos, no hay tamaño mínimo. Podés ver trabajos en gokywebs.com/portfolio',
        'que_hacemos' => 'Hacemos páginas web a medida: sitios profesionales, tiendas online, plataformas de cursos e inmobiliarias. Contame qué negocio tenés y te paso el precio.',
        'internet' => 'Sí, la web funciona online. Si se corta el wifi, la podés usar desde el celular con datos.',
        'pixel' => 'Sí, se puede conectar el pixel de Meta y Google Analytics.',
        'confianza' => 'Te entiendo. En gokywebs.com/portfolio podés ver webs que entregamos a negocios reales, y la muestra la ves antes de pagar nada.',
        'rangos' => 'Con gusto te paso los valores. Te consulto, a qué te dedicás o qué vendés? Así te digo cuál te corresponde.',
        'dominio_com' => 'Sí, se puede. El dominio que viene incluido es .com.ar; si preferís un .com, tiene una renovación adicional de $40.000 por año.',
        'que_incluye_sin_productos' => 'Con el mensual o el anual está todo incluido: la web a medida, hosting, dominio, mantenimiento, soporte, un cambio por mes y tu panel para editarla.',
        'cupones' => 'Sí, desde tu panel creás cupones de descuento, para toda la tienda o para productos puntuales.',
        'cobros_tienda' => 'Sí, tus clientes pueden pagar con Mercado Pago desde la tienda. El pedido te queda registrado en el panel para que lo prepares y lo despaches.',
        'turnos' => 'Sí, está incluido: la web puede tener turnos online, donde tus clientes eligen el día y el horario y la reserva te llega directo. No se paga aparte.',
        'usuarios' => 'Sí, está incluido: la web puede tener usuarios, así tus clientes se registran y entran con su cuenta. No se paga aparte.',
        'estadisticas' => 'Sí: la tienda y la plataforma de cursos traen estadísticas de visitas y ventas en el panel. En el sitio profesional y la inmobiliaria te conectamos Google Analytics.',
        'estadisticas_tienda' => 'Sí, tu panel trae estadísticas: cuánta gente entra por día, desde qué dispositivo y de dónde llega, qué se mira más y cuánto vendés.',
        'estadisticas_sitio' => 'Sí: te vinculamos Google Analytics, así ves cuánta gente entra a la web, de dónde llega y qué mira.',
        'baja_del_plan' => 'El mensual no tiene permanencia: lo das de baja cuando quieras desde Mercado Pago. La web funciona mientras el plan esté activo.',
        'cuenta_mercado_pago' => 'No hace falta tener cuenta de Mercado Pago: el plan mensual se paga por Mercado Pago, pero te podés suscribir con cualquier tarjeta, sin cuenta.',
        'plan_es_servicio' => 'Entonces te conviene el anual: lo pagás una vez por año{precio_un_solo_pago} e incluye lo mismo que el mensual.',
        'un_solo_pago' => 'Sí: con el plan anual pagás una vez por año{precio_un_solo_pago}, y sale menos que doce meses del plan mensual. Incluye lo mismo: hosting, dominio, mantenimiento y soporte.',
        'web_propia' => 'Con el pago único{precio_web_propia}, pagás la web una sola vez y el código queda tuyo al abonar el total. Incluye hosting y dominio el primer año; el mantenimiento es aparte, por {mantenimiento_mes}.',
        // Las que faltaban según las charlas del 11-sep al 2-oct (2-oct).
        'mensual' => 'Sí, el mensual se paga todos los meses por Mercado Pago y no tiene permanencia: la web queda activa mientras lo mantengas. El valor se actualiza una vez al año.',
        'cuotas' => 'Sí, se puede pagar con tarjeta: el mensual se paga por Mercado Pago con cualquier tarjeta.',
        'dominio_a_nombre' => 'Sí, el dominio puede quedar a tu nombre: lo registrás vos o te lo pasamos cuando la web esté lista (un .com.ar se transfiere por TAD y sale $8.500).',
        'que_es_dominio' => 'El dominio es la dirección de tu web, por ejemplo www.tunegocio.com.ar. Va incluido y el nombre lo elegís vos.',
        'demo_gratis' => 'No tiene costo ni compromiso: es un primer diseño para que veas cómo quedaría tu web antes de decidir.',
        'alternativas' => 'Son alternativas, elegís una sola: no se suman. Las dos incluyen el mantenimiento.',
        'plataformas' => 'No usamos Tiendanube, Shopify ni WordPress: te hacemos tu propia web a medida, con funciones parecidas (panel, carrito, Mercado Pago), y la armamos nosotros.',
        'recomendar_plan' => 'Si querés arrancar con poca inversión, el mensual; si preferís pagar una vez por año, el anual, que sale menos que doce meses.',
    ],
    'leer_imagenes' => true,
    /* Atención automática posterior al precio (postprecio.php, 1-oct). El 2-oct
     * a la mañana se apagó ("el bot no contesta muy bien las preguntas": las
     * respuestas eran largas) y a la tarde Pablo pidió que conteste las
     * preguntas más comunes antes y después del precio: vuelve prendida, con
     * las respuestas cortas de `info` y ejemplos reales de cada consulta
     * (consultas-ejemplos.php). Lo que no es común queda para Pablo y el sí a la
     * demo manda el formulario. Con false contesta wabot_oferta_diseno_responder()
     * (redactor.php): solo el sí a la demo. Se apaga desde Ajustes del panel. */
    'postprecio_activo' => true,
    /* Solo bienvenida (Pablo, 3-oct): en la charla el bot solo saluda al que
     * escribe por primera vez y el resto lo contesta Pablo. Formularios,
     * demos, plantillas y avisos automáticos siguen. Se apaga desde Ajustes
     * del panel y vuelve todo lo de antes. Ver wabot_solo_bienvenida_turno(). */
    'solo_bienvenida' => true,
    // Texto de Pablo del 4-oct; sale a los 30 s del primer mensaje (demora_bienvenida).
    'bienvenida' => 'Hola cómo estás? Para poder asesorarte y darte un precio adecuado, por favor contanos brevemente a qué te dedicás, o para qué necesitarías una web',
    'demora_bienvenida' => 30,
    'ia_proveedor' => 'openai',
    'openai_modelo' => 'gpt-6-sol',
    'mantenimiento_planes' => [
        'landing' => [
            'precio' => '$20.000',
            'link' => 'gokywebs.com/planmensual/sitioprofesional',
        ],
        'otros' => [
            'precio' => '$30.000',
            'link' => 'gokywebs.com/planmensual/tienda',
        ],
    ],
    'media_recibida' => 'Me llegó tu archivo y queda guardado en la conversación. Si querés, contame en un mensaje de qué se trata así lo tengo en cuenta.',
    'mensaje_cliente_existente' => 'Perfecto, eso lo sigue el desarrollador directamente: le paso tu mensaje ahora y te escribe por acá a la brevedad.',
    'mensaje_laboral' => 'Gracias por escribir. Las propuestas para sumarse al equipo las ve el desarrollador directamente: le paso tu mensaje y, si hay algo, te contesta por acá.',
    /* El conocido, el que trae a otro cliente, el referido (26-sep): Xavier
     * entró con "Pablo amigo, cómo va?" y "te acordás que le hicimos un sitio
     * web a Gabriela" y recibió los planes como un cliente nuevo. No se le
     * vende: se le avisa quién contesta y lo sigue Pablo (sin nombrarlo: ningún
     * texto del bot lleva nombre propio). */
    /* Nunca el precio ni el primer diseño sin saber QUÉ vende o A QUÉ se
     * dedica (Pablo, 28-sep: "ofrece la muestra gratis sin saber qué quiere el
     * cliente, eso es gravísimo"). Se pregunta una vez, según el tipo que ya
     * eligió; con la respuesta se cotiza. Ver wabot_negocio_conocido(). */
    'pide_negocio' => [
        // Sin preguntas secas (Pablo, 2-oct: "'Qué productos vendés?' es muy agresiva, tiene que ser 'Te consulto, qué productos vendés?'").
        'ecommerce'    => 'Te consulto, qué productos vendés?',
        'landing'      => 'Te consulto, a qué te dedicás o qué servicios ofrecés?',
        'elearning'    => 'Te consulto, de qué son tus cursos? Los das online o presenciales?',
        'inmobiliaria' => 'Te consulto, qué tipo de propiedades publicás?',
        'dos'          => 'Te consulto, a qué te dedicás y qué vendés? Así te paso el valor de las dos webs.',
    ],
    /* Dos webs (Pablo, 28-sep): "cuando un cliente pide 2 webs, ofrecemos 20%
     * de descuento en ambas". Se cotizan las dos juntas y cada una sola. */
    'dos_webs_descuento' => 20,
    'dos_webs' => [
        'intro'    => '{para_quien} te podemos armar las dos webs: {webs}.',
        // Las mismas palabras que el precio de una sola web (29-sep): "Podés elegir 1 de estas 2 modalidades": mensual y anual (3-oct: el pago único no se ofrece). Sin links: las páginas de pago/ cobran una sola web.
        'descuento' => "Si hacemos las dos, tenés un {descuento}% de descuento en ambas. Podés elegir 1 de estas 2 modalidades:\n\n1. Mensual: {mensual} por mes por las dos (en vez de {mensual_lista}), incluye mantenimiento\n2. Anual: {anual} por año por las dos (en vez de {anual_lista}), incluye mantenimiento",
        'una_sola' => 'Si preferís hacer una sola, {precios_una}.',
        'oferta'   => 'Si te interesa, te preparamos sin cargo un primer diseño de las dos webs, así ves cómo quedarían antes de decidir. Querés que lo armemos?',
    ],
    'mensaje_conocido' => 'Hola! Acá contesta el asistente automático de Gokywebs, que atiende las consultas nuevas. Le paso tu mensaje al desarrollador ahora y sigue él por acá.',
    /* La bienvenida va en dos mensajes (Pablo, 28-sep): el saludo y, aparte,
     * las tres opciones. Ver wabot_apertura_mensajes() y, para leer la
     * respuesta, wabot_menu_contestado(). */
    'menu' => "Hola! Gracias por contactarnos.\nEn Gokywebs hacemos páginas web adaptadas a cada negocio.",
    // Eligió "Algo diferente" sin contar qué: se le pregunta qué tiene en mente.
    'menu_algo_diferente' => 'Contame qué tenés en mente y a qué te dedicás, así te oriento.',
    'menu_opciones' => "Para orientarte mejor, contame qué tipo de web estás buscando:\n- Una web informativa para presentar tu negocio, empresa o servicios\n- Una tienda online para vender productos, cursos o servicios\n- Algo diferente",
    'menu_vuelve' => 'Hola de nuevo, {nombre}. Retomamos tu consulta: contame en qué quedaste pensando o si querés que arranquemos con la web que hablamos la vez pasada.',
    'mixto' => 'Por lo que me contás necesitarías una web que integre {lista} en un mismo lugar, con su panel para administrarlo todo. Eso se puede hacer, pero al combinar varias cosas el precio no sale de la lista: lo arma el desarrollador según lo que necesites.',
    'mixto_pregunta' => 'Lo querés todo integrado, o preferís arrancar por una sola de esas partes y sumar el resto más adelante?',
    'msg_precio' => "Para lo que me contás, te podemos armar {desc}.\n\n{dos_formas}",
    'msg_precio_tras_pitch' => '{dos_formas}',
    'msg_precio_variantes' => [
        "Para lo que me contás, te podemos armar {desc}.\n\n{dos_formas}",
        "En tu caso te podemos armar {desc}.\n\n{dos_formas}",
        "Por lo que me contás, te podemos armar {desc}.\n\n{dos_formas}",
    ],
    'msg_prediseno_oferta' => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
    'msg_prediseno_oferta_variantes' => [
        'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
    ],
    // El segundo globo del turno del precio: la oferta del primer diseño. Su
    // sí es lo único que el bot contesta después (con el formulario).
    'msg_tres_pasos' => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
    /* La oferta atada al tipo cotizado (devolución del 26-sep): menos "acción
     * automática", más el negocio del cliente. Mismo arranque ("sin cargo un
     * primer diseño"), mismo "cómo quedaría" y mismo cierre que msg_tres_pasos:
     * es lo que reconocen los detectores. 'catalogo' es el sitio profesional
     * con catálogo. Sin la del tipo, sale msg_tres_pasos. */
    'msg_tres_pasos_por_tipo' => [
        'landing'      => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web, así ves cómo quedaría y cómo se verían presentados tus servicios antes de decidir. Querés que lo armemos?',
        'catalogo'     => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web, así ves cómo quedaría y cómo se vería presentado tu catálogo antes de decidir. Querés que lo armemos?',
        'ecommerce'    => 'Si te interesa, te preparamos sin cargo un primer diseño de tu tienda online, así ves cómo quedaría y cómo se verían presentados tus productos antes de decidir. Querés que lo armemos?',
        'elearning'    => 'Si te interesa, te preparamos sin cargo un primer diseño de tu plataforma de cursos, así ves cómo quedaría y cómo se verían presentados tus cursos antes de decidir. Querés que lo armemos?',
        'inmobiliaria' => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web inmobiliaria, así ves cómo quedaría y cómo se verían publicadas tus propiedades antes de decidir. Querés que lo armemos?',
    ],
    'muestra_presentar_por_tipo' => [
        'landing' => "¡Ya está lista la primera propuesta para la web de {negocio}!\n\nPodés verla acá:\n{link}\n\nLa armamos para que puedas visualizar cómo presentar tu negocio, organizar tus servicios y facilitar que te contacten.\n\nMirá el estilo general y cómo está distribuida la información. Los textos e imágenes de ejemplo se reemplazan o ajustan con tu contenido real si avanzamos.",
        'ecommerce' => "¡Ya está lista la demo de la tienda de {negocio}! 🛍️\n\nPodés verla acá:\n{link}\n\nLos productos, fotos y precios que usamos para completar la muestra son de ejemplo; no representan tu catálogo real. Sirven para mostrarte cómo se verían los artículos y cómo estaría organizada la tienda.\n\nSi avanzamos, la adaptamos con tus productos, precios, imágenes y categorías.",
        'inmobiliaria' => "¡Ya está lista la demo de la web de {negocio}! 🏡\n\nPodés verla acá:\n{link}\n\nLas propiedades, fotos, ubicaciones y valores utilizados en la muestra son ficticios. Sirven para mostrar cómo se presentaría tu cartera de inmuebles.\n\nMirá la organización de las publicaciones y la información de cada propiedad. Si avanzamos, la adaptamos con tus inmuebles y datos reales.",
        'elearning' => "¡Ya está lista la demo de la academia de {negocio}! 🎓\n\nPodés verla acá:\n{link}\n\nLos cursos, programas, docentes y precios que aparecen son de ejemplo; no representan tu propuesta real. Sirven para mostrar cómo se presentarían tus cursos y cómo alguien elegiría uno.\n\nMirá cómo se muestra cada curso con su programa. Si avanzamos, la adaptamos con tus cursos, docentes y contenidos reales.",
        'sistema' => "¡Ya está lista la demo del sistema para {negocio}!\n\nPodés verla acá:\n{link}\n\nLos datos que aparecen cargados son de ejemplo, para que puedas ver cómo se vería la información y cómo se navega entre las pantallas.\n\nMirá el flujo general y cómo está organizada cada vista. Si avanzamos, lo adaptamos a tu operación real.",
        '_default' => "¡Ya está lista la primera propuesta para la web de {negocio}!\n\nPodés verla acá:\n{link}\n\nLos textos y las imágenes que usamos para completar la muestra son de ejemplo; no representan tu contenido real.\n\nMirá el estilo general y cómo está distribuida la información. Si avanzamos, la adaptamos con tu contenido.",
    ],
    'no_entiendo' => 'No estoy pudiendo entender el mensaje. Cuando puedas, mandame en una línea a qué te dedicás y seguimos por acá.',
    'no_interesa' => 'Perfecto, gracias por escribirnos. Cualquier cosa estamos por acá.',
    'no_texto' => 'No pude abrir eso que me mandaste. Contámelo por mensaje de texto así te ayudo mejor.',
    'objecion_repetida' => 'Dale, sin apuro. Cuando quieras avanzar, acá estoy.',
    'pago_antes_o_despues' => 'El primer diseño es sin cargo: lo ves antes de decidir. Si después querés avanzar, elegís el plan mensual o el anual y arrancamos.',
    'pausa_horas_humano' => 12,
    'pensarlo' => 'Perfecto, tomate el tiempo que necesites. Podés mirar trabajos reales y modelos para comparar con algo concreto.',
    'pensarlo_sin_muestra' => 'Perfecto, tomate el tiempo que necesites. Cualquier duda que te surja mientras tanto, escribime.',
    'pide_llamada' => 'Dale, eso lo hablás directo con el desarrollador: te escribe desde nuestro número de proyectos para coordinar la llamada.',
    'pitch_activo' => true,
    'pitch_otra_idea_2' => 'Te lo pregunto más concreto, así te paso la opción justa: qué querés que pueda hacer la persona que entra a tu web? Escribirte por WhatsApp, reservar un turno, comprar online, o solo ver tu información y tus trabajos?',
    'pitch_otra_idea_variantes' => [
        'Contame qué tenías en mente y lo vemos.',
        'Decime qué habías pensado y lo ajustamos.',
        'Contame qué idea tenías y vemos cómo encararlo.',
    ],
    // `texto` es el cuerpo aprobado en Meta, tal cual: es lo que queda escrito
    // en el chat del panel. Sin él, la plantilla le llegaba al cliente y en el
    // chat no se veía nada (Pablo, 26-sep).
    'plantillas' => [
        'confirmacion_demo_48h' => [
            'nombre' => 'seguimiento_demo_72h',
            'idioma' => 'es_AR',
            'activa' => true,
            'automatico' => true,
            'texto' => 'Hola! Te escribo para saber si pudiste ver la demo que te enviamos. Si hay algo que quieras cambiar, lo podemos ajustar. Cuando puedas, contame qué te pareció',
        ],
        'seguimiento_interesado' => [
            'nombre' => 'seguimiento_interesado',
            'idioma' => 'es_AR',
            'categoria' => 'MARKETING',
            'activa' => true,
            'automatico' => true,
            'texto' => 'Hola, cómo estás?',
        ],
    ],
    'plataformas' => "No la armamos sobre Tiendanube, Shopify o Wix: hacemos tu propia web, a medida. El plan, anual o mensual, funciona igual que allá: es lo que mantiene la web online.\nLa diferencia es que allá la armás vos, con una plantilla, y acá te la hacemos nosotros: te queda un panel para editar los textos y las imágenes (y en la tienda, cargar tus productos) cuando quieras, y nos ocupamos del hosting, el dominio, el soporte y el mantenimiento técnico.",
    'postdemo_apertura' => 'Contame qué te pareció, y si hay algo que quieras cambiar lo ajustamos.',
    'postdemo_cambios' => 'Perfecto, anoto esos cambios para aplicarlos cuando avancemos.',
    'postdemo_derivar' => 'Para seguir con el proyecto te va a escribir el desarrollador desde nuestro número de proyectos.',
    'postdemo_derivar_pago' => 'El desarrollador te va a escribir desde nuestro número de proyectos para coordinar el pago y los cambios.',
    'postdemo_elogio' => 'Me alegro de que te haya gustado. Le cambiarías algo?',
    'postdemo_la_miro' => 'Dale, miralo tranquilo. Cualquier duda que te surja escribime por acá.',
    'postdemo_no_gusto' => 'Gracias por la sinceridad, me sirve. Contame qué es lo que no te cerró y lo revisamos.',
    'postdemo_pago_avisado' => 'Perfecto, revisamos el pago y te confirmamos por acá.',
    'postdemo_videollamada' => 'Si querés, podemos coordinar una videollamada con el desarrollador. Te muestra la web en vivo y podés sacarte cualquier duda directamente con él. Querés que coordinen?',
    'precio_resumen' => "{dos_formas}\n\nY acá podés ver {portfolio_texto}: {portfolio}",
    'prediseno' => "Para armarla necesito poco:\n{faltan}\nSi no tenés colores definidos, decime 'elegí vos' y los defino yo. Si tenés logo o fotos, mandámelas; si no, arranco con imágenes del rubro y después las cambiamos.",
    'prediseno_completo' => 'Listo {nombre}, ya tenemos los datos para preparar la demo y te la mandamos por acá {entrega}. Si tenés {imagenes}, mandámelos para personalizarla; podemos empezar igual si todavía no los tenés.',
    'prediseno_completo_con_fotos' => 'Listo {nombre}, con eso ya lo preparamos. Con las fotos que me pasaste te la dejo lista {entrega} y te la mando por acá.',
    'prediseno_completo_solo_logo' => 'Listo {nombre}, el logo ya lo tengo y te mandamos la demo por acá {entrega}. Si tenés {imagenes}, mandámelas para personalizarla; podemos empezar igual sin ellas.',
    'prediseno_espera' => 'Perfecto, cuando completes el formulario arrancamos con tu propuesta. Cualquier duda, escribime por acá.',
    'prediseno_espera_datos' => 'Perfecto, quedo atento. Cuando tengas esos datos, mandámelos por acá y seguimos.',
    'prediseno_falta_colores' => 'Perfecto, anoté la descripción. Me faltan solo los colores de tu marca.',
    'prediseno_falta_descripcion' => 'Perfecto, anoté los colores. Me falta solo una descripción breve de lo que ofrecés.',
    'prediseno_link' => "Para hacer la primera entrega gratuita de la web, solo tendrías que llenar este formulario, toma 2 minutos: {link}\nLa entregamos en menos de 24 hs.",
    'prediseno_link_variantes' => [
        "Para hacer la primera entrega gratuita de la web, solo tendrías que llenar este formulario, toma 2 minutos: {link}\nLa entregamos en menos de 24 hs.",
    ],
    'prediseno_referencia' => 'Perfecto, con eso ya arrancamos. Una última cosa que ayuda mucho: tenés alguna página que te haya gustado como referencia, o algún estilo pensado? Puede ser la web de otro rubro, no importa. Si no tenés ninguna, decime que no y lo armamos igual.',
    'prediseno_whatsapp' => 'Última cosa y ya te lo preparamos: pasame tu número de WhatsApp, que por ahí te mandamos la demo cuando esté lista.',
    'prediseno_whatsapp_invalido' => 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.',
    'presentadas_sin_respuesta_horas' => 48,
    // Desde cuántos productos una tienda deja de ser de lista (18-sep).
    'productos_derivar_desde' => 500,
    'reset_dias' => 7,
    'respuesta_esta_incluido' => 'Está incluido en el plan, no se paga aparte.',
    'respuesta_plan_obligatorio' => 'No: el plan mensual es una de las 2 modalidades para contratar la web. Si preferís no pagar todos los meses, está el plan anual, que pagás una vez por año.',
    'seguimiento_hora_desde' => 8,
    'seguimiento_hora_hasta' => 20,
    'sistema_cierre' => 'Perfecto, {nombre}, ya tengo el panorama. Al ser un sistema a medida hay que cotizarlo según esas funciones, así que te preparamos la propuesta y te escribimos por acá con el presupuesto.',
    'sistema_pregunta' => 'Sí, también desarrollamos sistemas de gestión a medida. Contame qué necesitás que resuelva y qué problema querés ordenar.',
    'sistema_whatsapp' => 'Última cosa: pasame tu número de WhatsApp así el desarrollador te envía por ahí la propuesta del sistema.',
    'sistema_whatsapp_invalido' => 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.',
    'socio' => 'Perfecto, consultalo con tranquilidad. Pueden mirar los trabajos reales y elegir modelos para comparar opciones concretas.',
    'socio_sin_muestra' => 'Perfecto, consultalo con tranquilidad. Cualquier duda que les surja, escribime.',
    'tipeo_por_segundo' => 12,
    /* La lista de las imágenes del precio (Pablo, 26-sep a la noche): `precio`
     * es el plan anual, `precio_unico` el pago único, `mensualidad` el plan
     * mensual, `sena` la seña (la misma para el anual y el pago único) y
     * `mantenimiento` el mantenimiento aparte del pago único. Tienda, cursos e
     * inmobiliaria cuestan lo mismo y comparten imagen. Antes: el test de
     * precios del 26-sep (landing $160.000/$240.000/$30.000, el resto
     * $240.000/$390.000/$40.000, seña $40.000 / $60.000, plan con cambios
     * $25.000 / $35.000) y la lista del 19 al 25-sep (landing
     * $120.000/$200.000/$20.000; ecommerce $190.000/$300.000/$30.000;
     * elearning $190.000/$290.000/$30.000; inmobiliaria
     * $170.000/$260.000/$30.000). Si cambian los montos, cambian también las
     * imágenes y su lista en wabot_precio_imagenes() (lib.php). */
    'tipos' => [
        'landing' => [
            'label' => 'Sitio profesional',
            'precio' => '$140.000',
            'precio_unico' => '$220.000',
            'link' => 'gokywebs.com/presupuestos/sitioprofesional',
            'desc' => 'un sitio profesional completo',
            'reconocimiento_que' => 'tus servicios',
            'imagenes_pedido' => 'el logo y 3 o 4 fotos de tus trabajos, tu local o tu equipo',
            'precio_ideal' => '{para_quien} te podemos armar {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=sitioprofesional',
            'portfolio_texto' => 'otros sitios que ya entregamos',
            'mensualidad' => '$20.000',
            'mantenimiento' => '$10.000',
            'sena' => '$60.000',
        ],
        'ecommerce' => [
            'label' => 'Ecommerce',
            'precio' => '$220.000',
            'precio_unico' => '$330.000',
            'link' => 'gokywebs.com/presupuestos/ecommerce',
            'desc' => 'una tienda online completa',
            'reconocimiento_que' => 'tus productos',
            'imagenes_pedido' => 'el logo y fotos de tus productos, aunque sean 4 o 5 para arrancar',
            'precio_ideal' => '{para_quien} te podemos armar {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=ecommerce',
            'portfolio_texto' => 'otras tiendas online que ya entregamos',
            'mensualidad' => '$30.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
        'elearning' => [
            'label' => 'Plataforma de cursos',
            'precio' => '$220.000',
            'precio_unico' => '$330.000',
            'link' => 'gokywebs.com/presupuestos/elearning',
            'desc' => 'una plataforma de cursos completa',
            'reconocimiento_que' => 'tus cursos',
            'imagenes_pedido' => 'el logo y alguna foto tuya dando clase o del material de los cursos',
            'precio_ideal' => '{para_quien} te podemos armar {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=elearning',
            'portfolio_texto' => 'otras plataformas de cursos que ya entregamos',
            'mensualidad' => '$30.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
        'inmobiliaria' => [
            'label' => 'Web inmobiliaria',
            'precio' => '$220.000',
            'precio_unico' => '$330.000',
            'link' => 'gokywebs.com/presupuestos/inmobiliaria',
            'desc' => 'una web inmobiliaria completa',
            'reconocimiento_que' => 'tus propiedades',
            'imagenes_pedido' => 'el logo y fotos de un par de propiedades que tengas publicadas',
            'precio_ideal' => '{para_quien} te podemos armar {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=inmobiliaria',
            'portfolio_texto' => 'otras webs de inmobiliarias que ya entregamos',
            'mensualidad' => '$30.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
    ],
    'ultima_llamada' => 'Hola {nombre}, cómo estás? Te escribo por última vez por lo de la web. Si querés retomar o te quedó alguna duda, escribime por acá y seguimos.',
    /* Al que escribió y no llegó al precio, el mismo aviso antes de que cierre
     * la ventana de 24 h, con el texto de Pablo (2-oct). Sin el portfolio si ya
     * se lo pasamos en la charla. {saludo}: "Hola, buen día" / "Hola, buenas
     * tardes" según la hora. */
    'seguimiento_sin_precio' => '{saludo}, queríamos saber si seguías con interés de hacer la página web. Te compartimos el portfolio con páginas que realizamos y están en funcionamiento: gokywebs.com/portfolio, para que puedas ver un poco nuestros trabajos.',
    'seguimiento_sin_precio_sin_portfolio' => '{saludo}, queríamos saber si seguías con interés de hacer la página web.',
    'ultima_llamada_activa' => true,
    'ultima_llamada_horas' => 23,
    /* Recordatorio del formulario (Pablo, 4-oct): a las 12 h de mandarle el
     * link (el bot o Pablo, desde el panel o el celular), si todavía no lo
     * completó. {saludo} según la hora; {link} es el mismo link que se le pasó. */
    /* Seguimiento de la oferta de la primera entrega (Pablo, 4-oct): si lo
     * último que le mandamos fue la oferta ("Siempre antes de avanzar, armamos
     * una primera entrega de la web, sin costo…") y no contestó, a las 23 h
     * de su último mensaje. Texto de Pablo, tal cual. */
    'oferta_entrega_seguimiento_activo' => true,
    'oferta_entrega_seguimiento_horas' => 23,
    'oferta_entrega_seguimiento' => 'Buenas, avisame si te interesa la idea de que te armemos una primera entrega gratis',
    'form_recordatorio_activo' => true,
    'form_recordatorio_horas' => 12,
    'form_recordatorio' => '{saludo}, ¿pudiste completar el formulario? Si tuviste algún problema, avisame y te ayudo. Te lo dejo de nuevo por acá: {link}',
    'ya_tengo_web' => 'Perfecto, pasame el link de tu página actual así la reviso y te digo qué conviene mejorar. También podés comparar con los modelos de gokywebs.com/modelos/.',
    'ya_tengo_web_sin_muestra' => 'Perfecto, pasame el link de tu página actual así la reviso y te confirmo cómo la mejoraríamos.',
];
}
