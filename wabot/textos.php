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
 * Condiciones vigentes (Pablo, 22-sep): TRES OPCIONES: plan anual, plan
 * mensual y pago único.
 * - Plan anual (`tipos[].precio`): sin suscripción. Arranca con una seña
 *   (`tipos[].sena`: $40.000 el sitio profesional, $60.000 el resto), el
 *   resto se paga al entregar la web y después se cobra una vez por año
 *   (Pablo, 19-sep). El monto de la seña se dice solo si lo preguntan.
 * - Plan mensual (`tipos[].mensualidad`): $20.000 el sitio profesional y
 *   $30.000 el resto (Pablo, 19-sep: "15.000 y 25.000 es re poco"; fueron
 *   así del 16 al 19-sep). Sin pago inicial aparte, sin permanencia. Plan
 *   con cambios (`tipos[].mensualidad_cambios`) para varios cambios al mes;
 *   los dos planes básicos ya incluyen UN cambio por mes (Pablo, 20-sep).
 * - La propiedad del código SÍ se contesta (Pablo, 20-sep; el 19-sep el bot se
 *   callaba y era peor): pasa a ser del cliente cuando abona el total del pago
 *   único, al pagar el segundo año del plan anual o a los 18 meses del
 *   mensual. Antes de eso es de Gokywebs. Lo dicen info.titularidad,
 *   info.entrega_codigo, info.licencias y info.baja_del_plan.
 * - El pago único (`tipos[].precio_unico`) es SOLO la página: sin hosting ni
 *   dominio. Se le puede sumar el mantenimiento por `tipos[].mantenimiento`
 *   ({mantenimiento_mes}: $10.000 el sitio profesional, $15.000 el resto).
 * - Los dos incluyen lo mismo: desarrollo completo, hosting, dominio,
 *   mantenimiento, actualizaciones, soporte y un cambio por mes.
 * - Las tres opciones se dicen siempre con el mismo bloque, `dos_formas`:
 *   plan anual, plan mensual y pago único. Solo los dos planes incluyen el
 *   mantenimiento y las renovaciones. Es el mismo formato para los cuatro tipos.
 * - El plan anual se cuenta desde la seña: se renueva cada año desde ahí.
 * - Web propia (19-sep): si el cliente la quiere a su nombre, en su propio
 *   hosting, se le pasa el pago único (`tipos[].precio_unico`, los montos
 *   del pago único de antes). Es solo la página: sin hosting ni dominio, con
 *   mantenimiento opcional. Lo dicen info.web_propia, el precio
 *   (`dos_formas_web_propia`, debajo de los planes) y la titularidad.
 * - Las charlas cotizadas antes (precio_modelo 'doble': pago único con seña)
 *   conservan sus montos y sus respuestas de seña y saldo.
 * - La recomendación es "Para lo que me contás, te armamos…" (o "Para {rubro},
 *   te armamos…" si se sabe el rubro): {para_quien} lo resuelve
 *   wabot_personalizar(). El modelo clasifica, pero nunca redacta la propuesta.
 *   Desde el 20-sep la propuesta es corta —"un sitio profesional completo",
 *   "una tienda online completa"— porque abajo, en el mismo mensaje, va la
 *   lista de todo lo que incluye (ver wabot_propuesta_texto en engine.php).
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
    'cambios_plan' => 'Los dos planes, el anual y el mensual, incluyen un cambio por mes en la web. Si vas a necesitar cambios más seguido, está el plan mensual con cambios, de {cambios_mes}, para varios cambios al mes.',
    // Se suma a cambios_plan: los cuatro tipos incluyen panel (Pablo, 20-sep).
    'cambios_plan_panel' => 'Los textos y las imágenes los cambiás vos cuando quieras desde tu panel, sin costo.',
    'caro' => 'Si pagar el año entero se te hace mucho, está el plan mensual de {mensualidad}: arrancás con la primera mensualidad, y con eso armamos la web y la dejamos funcionando. En Tiendanube pagás parecido por mes y la web la armás vos; acá te la hacemos nosotros.',
    // Catálogo + WhatsApp, sin cobro online (Pablo, 18-sep): se cotiza como
    // sitio profesional y la carga de productos va aparte.
    'carga_producto' => '$500',
    'catalogo_carga' => 'La carga de los productos va aparte: {carga_producto} por producto.',
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
    ],
    'cierre_memoria' => 'Ya queda anotado que lo tuyo sería {tipo}, así que no vas a tener que explicar todo otra vez.',
    'cierre_suave' => 'Dale, ningún problema. Si más adelante querés retomarlo, escribime por acá.',
    'confirma_cambio' => 'Antes de seguir, confirmame una cosa: esto es para el mismo proyecto que veníamos viendo, o es otra web aparte?',
    'confirma_cambio_2' => 'Decime nomás: es para el mismo proyecto que veníamos viendo (respondé "mismo") o es otra web aparte (respondé "otra")?',
    'confirma_cambio_mismo' => 'Perfecto, seguimos con lo que veníamos viendo. En gokywebs.com/modelos/ podés elegir uno o dos modelos como referencia.',
    'confirmacion_demo_horas' => 48,
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
    // La seña del plan anual no se devuelve (Pablo, 15-sep); el turno queda
    // marcado para el desarrollador.
    'devolucion' => 'La seña del plan anual no se devuelve: por eso primero te armamos un primer diseño sin cargo, así lo ves antes de pagar nada. Y una vez que arrancamos, si el diseño no te convence lo rehacemos hasta dos veces; ya elegido, tenés tres rondas para ajustar el resto.',
    'dos_formas' => "Podés elegir entre tres opciones:\n\n1. Plan anual: {precio} incluye mantenimiento\n2. Plan mensual: {mensualidad} incluye mantenimiento\n3. Pago único: {precio_unico} NO incluye mantenimiento*\n\nLos 3 planes incluyen todo:\n✓ Desarrollo completo de la web\n✓ Adaptada a celulares\n✓ Panel para autogestionar contenido\n✓ Certificado de seguridad (SSL)\n✓ Preparada para que Google la encuentre\n✓ Un cambio por mes en la web\n\nEl plan anual y mensual incluyen mantenimiento:\n✓ Renovación de hosting y dominio\n✓ Actualizaciones de SDK y plugins\n✓ Arreglo de errores\n✓ Soporte técnico\n\n*El pago único se puede pagar en cuotas con intereses",
    // Debajo de los planes, solo si el cliente pidió la web propia (19-sep).
    'dos_formas_web_propia' => 'Y si la querés en tu propio hosting, está el pago único: {precio_unico}. Ese es solo la página, sin hosting ni dominio, y el código queda tuyo cuando abonás el total; si querés, le sumás el mantenimiento por {mantenimiento_mes}.',
    'ininteligible_primero' => 'Hola! No llegué a entender el mensaje. Contame a qué te dedicás o para qué sería la web y te ayudo.',
    'repregunta_suave' => 'Perdoná si no fui claro. Contame qué duda te quedó y te la respondo.',
    /* La pregunta de reconocimiento (Pablo, 21-sep): antes de cotizar una
     * TIENDA se pregunta una vez, porque con productos hay dos caminos
     * distintos —vender online o solo mostrarlos—. A los servicios no se les
     * pregunta ("si es abogado QUE va a vender por la web?"): se les cotiza el
     * sitio profesional derecho. Un tipo puede llevar su propia pregunta con
     * tipos[].reconocimiento_pregunta. */
    /* Lo que copia el botón "Copiar form" del panel, para que Pablo se lo
     * mande él mismo (21-sep). El link con el código de la charla va abajo. */
    'form_link_panel' => 'Para armarte la primera muestra gratis, solo tenés que llenar el formulario:',
    'reconocimiento_activo' => true,
    'reconocimiento' => 'Buscás vender por la web, o solo mostrar {lo_tuyo}?',
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
    'hosting_renovacion' => 'No hay renovación aparte: con cualquiera de los dos planes, el hosting, el dominio, el mantenimiento y el soporte van incluidos mientras el plan esté activo. El plan anual se cobra una vez por año y el mensual, cada mes.',
    'imagenes_pedido_generico' => 'el logo y 3 o 4 fotos de tu negocio',
    'info' => [
        'proceso' => "Te paso el valor según lo que necesites y, si te interesa, te preparamos sin cargo un primer diseño de tu web: completás un formulario corto y elegís uno o dos modelos como referencia. Si te gusta, elegís el plan anual o el mensual y arrancamos. La web suele quedar lista en unos 7 días desde que arrancamos y nos pasás el contenido.\nEl valor depende del tipo de web: contame a qué te dedicás y te lo paso.",
        'pago' => "Hay dos planes: el anual, de {precio} por año, y el mensual, de {mensualidad} por mes. Los dos incluyen lo mismo: el desarrollo completo de la web, hosting, dominio, mantenimiento, actualizaciones y soporte.\nEl anual arranca con una seña, el resto se paga al entregar la web y después se renueva una vez por año, contado desde la seña, sin suscripción. El mensual se paga por Mercado Pago, con cualquier tarjeta y sin necesidad de tener cuenta, y no tiene permanencia.",
        'plazos' => "La web queda lista en unos 7 días desde que arrancamos con el plan y nos pasás el contenido.",
        'hosting' => "El hosting y el dominio .com.ar van incluidos en los dos planes, el anual y el mensual, mientras el plan esté activo.\nNo los contratás ni los configurás vos, se ocupa Gokywebs. Con el pago único de la web propia no van incluidos: ahí corren por tu cuenta.",
        'mantenimiento' => "El mantenimiento va incluido en los dos planes, el anual y el mensual, mientras el plan esté activo: hosting, dominio, actualizaciones, corrección de errores y soporte. El anual lo pagás una vez por año y el mensual, de {mensualidad}, no tiene permanencia.\nIncluye un cambio por mes en la web; si vas a necesitar más, está el plan mensual con cambios, de {cambios_mes}.",
        'carga' => "Sí, lo manejás vos. Todas nuestras webs traen un panel de administración donde editás los textos y las imágenes cuando quieras, sin costo extra.\nEn la tienda online cargás vos desde tu panel los productos, precios, stock, fotos y descripciones todas las veces que necesites, también sin costo extra, y el panel trae un video explicativo. Si preferís, los primeros 10 productos los cargamos nosotros para que arranques con la tienda lista, y de ahí en más son \$500 por producto si querés que los sigamos cargando nosotros. La inmobiliaria y la plataforma de cursos también cargan las propiedades o los cursos desde su panel.\nEl plan, anual o mensual, no es por cargar productos ni por hacer cambios: cubre el desarrollo, el hosting, el dominio, el soporte y el mantenimiento técnico.",
        'logo' => 'No hacemos logos; si tenés uno se usa, y si no, se trabaja tu nombre bien tipografiado.',
        'marketing' => 'No hacemos publicidad, marketing ni redes, y no recomendamos proveedores; solo diseño y desarrollo de webs y sistemas.',
        'reuniones' => 'Las reuniones se coordinan con el desarrollador al avanzar el proyecto.',
        'tecnologia' => 'Trabajamos con servidor Hostinger, base Firebase y código a medida en HTML, CSS, JS y PHP. No usamos WordPress ni trabajamos sobre webs ya hechas.',
        // Marca interna de "no sé": desde el 19-sep NO se manda (Pablo: "cuando
        // el bot no entienda, no conteste nada"). wabot_salida_sin_comodin() la
        // saca de la salida y el chat le queda pendiente a Pablo.
        'otra' => 'Esa duda te la va a poder contestar el desarrollador cuando te escriba.',
        'pago_generico' => 'Hay dos planes: uno anual, que arranca con una seña y después se renueva una vez por año, y uno mensual, por Mercado Pago y sin permanencia. Los dos incluyen el desarrollo completo de la web, hosting, dominio, mantenimiento y soporte. El valor depende del tipo de web: contame a qué te dedicás y te lo paso.',
        'precio_sin_rubro' => 'Te paso el valor exacto, pero primero contame a qué te dedicás o para qué sería la web: el precio depende de lo que necesites.',
        'ubicacion' => 'Somos de Tigre, Buenos Aires. No tenemos oficina: trabajamos de manera remota con clientes de todo el país, así que todo el proceso lo hacemos por acá.',
        /* La propiedad del código, con sus plazos (Pablo, 20-sep). El 19-sep
         * el bot se callaba con estas preguntas y era peor: cortaba la venta. */
        'accesos' => "El hosting y el dominio los manejamos nosotros mientras el plan esté activo: trabajamos con Hostinger, así que la web queda subida ahí y no tenés que contratar ni configurar nada.\nSi necesitás un acceso puntual, decímelo y lo vemos.",
        'titularidad' => "El código de tu web pasa a ser tuyo según el plan:\n• Pago único: cuando abonás el total.\n• Plan anual: al pagar el segundo año.\n• Plan mensual: a los 18 meses.\nHasta ese momento el código es de Gokywebs. El hosting, el dominio y el mantenimiento van incluidos en el plan anual y en el mensual, mientras el plan esté activo.",
        'emails' => 'Este plan no incluye casillas de correo corporativas. Se pueden sumar, pero no son transferibles: los accesos te los damos sin problema y si querés que queden a tu nombre las tenés que contratar vos. La configuración en Outlook, Gmail o el celular no la hacemos nosotros.',
        'entrega_codigo' => "Sí: el código pasa a ser tuyo según el plan. Con el pago único, cuando abonás el total; con el plan anual, al pagar el segundo año; con el plan mensual, a los 18 meses. Hasta ese momento es de Gokywebs.",
        'licencias' => 'Las licencias de plugins, librerías o SDK son siempre de terceros, así que no quedan a tu nombre. El código de tu web es otra cosa: pasa a ser tuyo cuando se cumple el plazo de tu plan.',
        'manual' => 'No entregamos un manual de uso. Todas las webs traen un panel para editar los textos y las imágenes, pensado para usarlo sin instructivo (en la tienda, la inmobiliaria y los cursos también cargás ahí lo tuyo), y para cambios más grandes está el plan mensual con cambios, con un cambio por mes.',
        'bilingue' => 'Sí, está incluido: la web se puede traducir hasta a 3 idiomas, sin costo aparte.',
        'ejemplos' => 'Sí, en gokywebs.com/portfolio podés ver los trabajos que ya entregamos, de rubros muy distintos. Cada web se diseña a medida del negocio, así que no vas a encontrar dos iguales.',
        'migracion' => 'Sí, los contenidos de tu página actual los pasamos nosotros a la web nueva: textos, fotos y secciones. Vos no tenés que volver a cargar nada. Pasame el link de la página que tenés y la reviso.',
        'formularios' => 'Sí, formularios y encuestas se pueden incluir, y ya vienen en el precio: la gente los completa desde la web y las respuestas te llegan por mail o quedan guardadas para que las veas cuando quieras.',
        'imagenes_web' => 'Sí, la web lleva imágenes. Si tenés fotos propias las usamos, y si no, la armamos con imágenes acordes al rubro para que se vea completa desde el primer día.',
        'inscripcion' => 'Para hacerte la web no te pedimos ninguna inscripción ni condición fiscal: la contratás y listo. Si tu duda es si vos necesitás estar inscripto para vender, eso depende de tu situación y lo mejor es que lo confirmes con un contador.',
        'comparando' => 'Está perfecto comparar, es lo que hay que hacer. Lo único que te diría es que mires también qué incluye cada propuesta, porque los precios cambian bastante según eso: si es a medida o una plantilla, si te queda panel propio, si el hosting y el dominio van incluidos. Y justamente por eso te armamos la muestra antes de que contrates: además del precio vas a poder comparar cómo queda realmente tu web.',
        'ya_tiene_plataforma' => 'Pasame el link y la reviso, y te digo con franqueza si te conviene una nueva o si con la que tenés ya estás bien. Aclaro una cosa para que no haya confusión: nosotros no trabajamos sobre webs ya hechas, hacemos una nueva a medida. Así que solo tendría sentido si la actual te está quedando corta.',
        'no_se_nada' => 'No hace falta que sepas nada de eso, para eso estamos nosotros. Vos contanos de tu negocio y del resto nos encargamos: te vamos pidiendo solo la información que hace falta, en criollo.',
        'sin_logo' => 'No es un problema, se puede avanzar igual: armamos la web con el nombre de tu negocio y una identidad visual acorde al rubro. Si más adelante conseguís un logo, se cambia sin rehacer nada.',
        'sin_fotos' => 'No hace falta que tengas fotos para empezar. La primera muestra la armamos con imágenes acordes al rubro para definir la estética, y después las cambiamos por las tuyas cuando las tengas.',
        'muestra_no_es_final' => 'No, la muestra es una primera versión para que veas el diseño y la idea general. Si te gusta y avanzamos, sobre esa base hacemos el desarrollo completo con tu contenido real y todas las funciones terminadas.',
        'responsive' => 'Sí, la web se adapta sola al celular, la tablet y la computadora. De hecho la diseñamos pensando primero en el celular, que es de donde entra la mayoría de la gente.',
        'seguridad' => 'La web va con certificado SSL, así que funciona con HTTPS y la información viaja cifrada. Ningún sistema conectado a internet puede prometer riesgo cero, pero se toman las medidas que corresponden y los datos sensibles quedan protegidos.',
        'google' => 'La web queda preparada técnicamente para que Google la encuentre e indexe, con la configuración SEO básica incluida. En qué puesto aparecés ya depende de la competencia de tu rubro, la antigüedad del sitio y el trabajo de posicionamiento sostenido, que es un servicio aparte.',
        'maps' => 'Sí, si tenés local podemos sumar el mapa con tu ubicación y el acceso directo a Google Maps para que te lleguen con el GPS.',
        'ampliar_despues' => 'Sí, y muchas veces es lo que recomendamos: arrancar con lo que necesitás hoy y sumar funciones cuando el negocio las pida. La web queda preparada para ampliarse sin tener que rehacerla de cero.',
        'que_necesitan' => 'Poco: el nombre del negocio, una descripción breve de lo que ofrecés, los colores que te gustan y tus datos de contacto. Si tenés logo y fotos los usamos, y si no, arrancamos igual.',
        'soy_bot' => 'No, soy el asistente automático de Gokywebs. Te puedo orientar con las opciones, los precios y cómo es el proceso, y cuando hace falta algo más te paso con el desarrollador.',
        'exclusividad' => 'Sí, es exclusivo: cada web se diseña a medida para tu negocio, así que no reciclamos el mismo diseño con otro cliente.',
        'fotos_propiedad' => 'Podés subir decenas de fotos por propiedad, y también video.',
        'impuestos_importacion' => 'No, la web no calcula impuestos de importación de forma automática: eso lo manejás vos aparte. Se puede sumar como funcionalidad extra, pero el precio de eso lo tiene que evaluar el desarrollador.',
        'pago_sin_precio' => 'Hay dos planes: uno anual, que pagás una vez por año, y uno mensual, por Mercado Pago y sin permanencia. Los dos incluyen el desarrollo completo de la web, hosting, dominio, mantenimiento y soporte.',
        'demo_vigencia' => 'La demo queda disponible 5 días, por una cuestión de espacio en el servidor. Dentro de ese plazo mirala con tranquilidad y contame qué te parece.',
        'facturacion' => 'Facturamos con Factura C. No emitimos Factura A ni B, así que no lleva IVA discriminado.',
        'apps' => 'Sí, también desarrollamos aplicaciones para celular. No entran en la lista de precios de las webs: se cotizan aparte según lo que necesite hacer la app.',
        'las_dos_formas' => 'Van las dos juntas, no hay que elegir: la tienda tiene el carrito con pago online y además el botón de WhatsApp, así el que prefiere consultarte antes de comprar te escribe directo.',
        'que_es_landing' => 'Es una web de una sola página, que se recorre bajando: arriba te presentás, después van tus servicios, tus trabajos, las preguntas frecuentes y el contacto. Tiene todas las secciones que haga falta, solo que en una página en vez de repartidas en varias.',
        'contacto_desarrollador' => 'No tenés que hacer nada: te escribe él directamente por WhatsApp, desde nuestro número de proyectos. Si preferís escribirle vos primero, decímelo y le paso tu mensaje.',
        'sin_whatsapp' => 'No hay problema, el WhatsApp no es obligatorio. En vez del botón podemos poner un formulario de contacto —las consultas te llegan por mail—, o dejar solo el mail y tus redes. Vos decidís por dónde querés que te escriban.',
        'comisiones' => 'No, nosotros no cobramos ninguna comisión por venta: lo que vendas es tuyo. Lo único que se descuenta es la comisión del medio de pago que uses (Mercado Pago, la tarjeta), que la cobran ellos y no nosotros.',
        'envios' => 'Sí, la tienda calcula el envío sola: el cliente pone el código postal en el checkout y le aparecen las opciones con el costo de cada una, antes de pagar. Se conecta con el correo con el que trabajes, y también podés ofrecer retiro en el local. Si preferís algo más simple, se puede dejar un costo fijo por zona.',
        'como_funciona_tienda' => 'Sí, exactamente así: el cliente entra, ve el catálogo, arma el carrito y paga desde la web. El pedido te llega al panel con los datos de envío para que lo despaches, y los productos, precios y stock los manejás vos desde ahí.',
        'que_incluye' => "Está todo incluido, con el plan anual o con el mensual: el desarrollo completo a medida, el hosting, el dominio, el mantenimiento, el soporte, un panel para editar vos mismo los textos y las imágenes y la carga de hasta 10 productos. Nos ocupamos del armado y de lo técnico.\nSi querés que carguemos más de 10 productos, son \$500 por cada producto extra; también podés cargarlos vos desde el panel. Incluye un cambio por mes en la web; si vas a necesitar más, está el plan mensual con cambios, de {cambios_mes}. Si tenés en mente algo puntual, preguntame y te digo si está incluido.",
        'emprendimientos' => 'Sí, trabajamos con emprendimientos que recién arrancan y con negocios chicos: no hay un tamaño mínimo. En gokywebs.com/portfolio están los trabajos entregados y vas a ver que la mayoría son negocios chicos como el tuyo.',
        'que_hacemos' => 'En Gokywebs diseñamos y desarrollamos páginas web a medida: sitios profesionales, tiendas online, plataformas de cursos e inmobiliarias, además de sistemas de gestión. Contame qué negocio tenés y te paso el precio exacto de una.',
        'internet' => 'La página funciona online, así que hace falta conexión a internet para usarla. Si en el local se corta el wifi, podés entrar igual desde el celular con datos móviles: la web y tu panel siguen funcionando normalmente.',
        'pixel' => 'Sí, la web queda lista para conectarle el pixel de Meta, Google Analytics o el código de seguimiento que uses en tus campañas. Google Analytics y Search Console te los podemos vincular nosotros.',
        'confianza' => 'Entiendo la desconfianza, pasa seguido en este rubro. En gokywebs.com/portfolio podés ver proyectos entregados a negocios reales y públicos; también podés escribirles por tu cuenta. En gokywebs.com/modelos/ elegís uno o dos modelos antes de avanzar.',
        'rangos' => 'Te paso el valor exacto, pero primero contame a qué te dedicás o para qué sería la web: el precio depende de lo que necesites.',
        'dominio_com' => 'Sí, se puede. El dominio que viene incluido es .com.ar; si preferís un .com, tiene una renovación adicional de $40.000 por año.',
        'que_incluye_sin_productos' => "Está todo incluido, con el plan anual o con el mensual: el desarrollo completo a medida, el hosting, el dominio, el mantenimiento, el soporte y un panel para editar vos mismo los textos y las imágenes. Nos ocupamos del armado y de lo técnico.\nIncluye un cambio por mes en la web; si vas a necesitar más, está el plan mensual con cambios, de {cambios_mes}. Si tenés en mente algo puntual, preguntame y te digo si está incluido.",
        'cupones' => 'Sí, en la tienda podés crear cupones de descuento desde tu panel. Tus clientes ingresan el código al comprar. Podés aplicarlos a toda la tienda, a una categoría o a productos puntuales, y elegir la fecha de inicio y fin.',
        'cobros_tienda' => 'Sí, tus clientes pueden pagar con Mercado Pago desde la tienda. El pedido te queda registrado en el panel para que lo prepares y lo despaches.',
        'turnos' => 'Sí, está incluido: la web puede tener turnos online, donde tus clientes eligen el día y el horario y la reserva te llega directo. No se paga aparte.',
        'usuarios' => 'Sí, está incluido: la web puede tener usuarios, así tus clientes se registran y entran con su cuenta. No se paga aparte.',
        'estadisticas' => "La tienda online y la plataforma de cursos traen estadísticas en tu panel: cuánta gente entra por día, desde qué dispositivo y de dónde llega, qué se mira más y cuánto vendés.\nEn el sitio profesional y en la web inmobiliaria te vinculamos Google Analytics, así ves las visitas igual.",
        'estadisticas_tienda' => 'Sí, tu panel trae estadísticas: cuánta gente entra por día, desde qué dispositivo y de dónde llega, qué se mira más y cuánto vendés.',
        'estadisticas_sitio' => 'Sí: te vinculamos Google Analytics, así ves cuánta gente entra a la web, de dónde llega y qué mira.',
        'baja_del_plan' => "El plan mensual no tiene permanencia: lo das de baja cuando quieras, desde Mercado Pago. Si te suscribiste sin cuenta de Mercado Pago (se puede, con cualquier tarjeta), la baja se hace llamando al banco de esa tarjeta. El anual se paga una vez por año.\nLo que sí te aclaro para que no haya sorpresas: la web funciona mientras el plan esté activo. Si se da de baja o dejás de pagarlo, se desactiva, porque el hosting, el dominio y el soporte salen de ahí, y el código todavía no pasó a tu nombre.",
        'cuenta_mercado_pago' => 'No hace falta tener cuenta de Mercado Pago: el plan mensual se paga por Mercado Pago, pero te podés suscribir con cualquier tarjeta, sin cuenta.',
        'plan_es_servicio' => 'Dale, entonces te conviene el plan anual: lo pagás una vez por año{precio_un_solo_pago} y no tenés que pagar todos los meses. Incluye lo mismo que el mensual: hosting, dominio, mantenimiento y soporte.',
        'un_solo_pago' => 'Sí: con el plan anual pagás una vez por año{precio_un_solo_pago}, y sale menos que doce meses del plan mensual. Incluye lo mismo: hosting, dominio, mantenimiento y soporte.',
        'web_propia' => "Si la querés en tu propio hosting, está el pago único{precio_web_propia}: es solo la página, y cuando abonás el total el código queda tuyo. No incluye hosting ni dominio, que corren por tu cuenta.\nSi querés, le sumás el mantenimiento por {mantenimiento_mes}: actualizaciones, corrección de errores y soporte.",
    ],
    'leer_imagenes' => true,
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
    'menu' => "Hola! Gracias por contactarnos.\nHacemos páginas web adaptadas a cada negocio.\nContame un poquito a qué te dedicás y te asesoro según lo que necesitás",
    'menu_vuelve' => 'Hola de nuevo, {nombre}. Retomamos tu consulta: contame en qué quedaste pensando o si querés que arranquemos con la web que hablamos la vez pasada.',
    'mixto' => 'Por lo que me contás necesitarías una web que integre {lista} en un mismo lugar, con su panel para administrarlo todo. Eso se puede hacer, pero al combinar varias cosas el precio no sale de la lista: lo arma el desarrollador según lo que necesites.',
    'mixto_pregunta' => 'Lo querés todo integrado, o preferís arrancar por una sola de esas partes y sumar el resto más adelante?',
    'msg_precio' => "Para lo que me contás, te armamos {desc}.\n\n{dos_formas}",
    'msg_precio_tras_pitch' => '{dos_formas}',
    'msg_precio_variantes' => [
        "Para lo que me contás, te armamos {desc}.\n\n{dos_formas}",
        "En tu caso te armamos {desc}.\n\n{dos_formas}",
        "Por lo que me contás, te armamos {desc}.\n\n{dos_formas}",
    ],
    'msg_prediseno_oferta' => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
    'msg_prediseno_oferta_variantes' => [
        'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
    ],
    // El segundo globo del turno del precio: la oferta del primer diseño. Su
    // sí es lo único que el bot contesta después (con el formulario).
    'msg_tres_pasos' => 'Si te interesa, te preparamos sin cargo un primer diseño de tu web para que veas cómo quedaría antes de decidir. Querés que lo armemos?',
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
    'pago_antes_o_despues' => 'El primer diseño es sin cargo: lo ves antes de decidir. Si después querés avanzar, elegís el plan anual o el mensual y arrancamos.',
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
    'plantillas' => [
        'confirmacion_demo_48h' => [
            'nombre' => 'seguimiento_demo_72h',
            'idioma' => 'es_AR',
            'activa' => true,
        ],
        'seguimiento_interesado' => [
            'nombre' => 'seguimiento_interesado',
            'idioma' => 'es_AR',
            'categoria' => 'MARKETING',
            'activa' => true,
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
    'prediseno_link' => "Dale. Para prepararte el primer diseño completá este formulario:\n{link}\nUna vez que lo completes, va a estar listo en menos de 24 hs.",
    'prediseno_link_variantes' => [
        "Dale. Para prepararte el primer diseño completá este formulario:\n{link}\nUna vez que lo completes, va a estar listo en menos de 24 hs.",
    ],
    'prediseno_referencia' => 'Perfecto, con eso ya arrancamos. Una última cosa que ayuda mucho: tenés alguna página que te haya gustado como referencia, o algún estilo pensado? Puede ser la web de otro rubro, no importa. Si no tenés ninguna, decime que no y lo armamos igual.',
    'prediseno_whatsapp' => 'Última cosa y ya te lo preparamos: pasame tu número de WhatsApp, que por ahí te mandamos la demo cuando esté lista.',
    'prediseno_whatsapp_invalido' => 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.',
    'presentadas_sin_respuesta_horas' => 48,
    // Desde cuántos productos una tienda deja de ser de lista (18-sep).
    'productos_derivar_desde' => 500,
    'reset_dias' => 7,
    'respuesta_esta_incluido' => 'Está incluido en el plan, no se paga aparte.',
    'respuesta_plan_obligatorio' => 'No: el plan mensual es una de las dos formas de contratar la web. Si preferís, está el plan anual: lo pagás una vez por año y no tenés que pagar todos los meses.',
    'seguimiento_hora_desde' => 8,
    'seguimiento_hora_hasta' => 20,
    'sistema_cierre' => 'Perfecto, {nombre}, ya tengo el panorama. Al ser un sistema a medida hay que cotizarlo según esas funciones, así que te preparamos la propuesta y te escribimos por acá con el presupuesto.',
    'sistema_pregunta' => 'Sí, también desarrollamos sistemas de gestión a medida. Contame qué necesitás que resuelva y qué problema querés ordenar.',
    'sistema_whatsapp' => 'Última cosa: pasame tu número de WhatsApp así el desarrollador te envía por ahí la propuesta del sistema.',
    'sistema_whatsapp_invalido' => 'Ese número no me cierra. Pasámelo con característica, por ejemplo 11 2506-8578.',
    'socio' => 'Perfecto, consultalo con tranquilidad. Pueden mirar los trabajos reales y elegir modelos para comparar opciones concretas.',
    'socio_sin_muestra' => 'Perfecto, consultalo con tranquilidad. Cualquier duda que les surja, escribime.',
    'tipeo_por_segundo' => 12,
    'tipos' => [
        'landing' => [
            'label' => 'Sitio profesional',
            'precio' => '$120.000',
            'precio_unico' => '$200.000',
            'link' => 'gokywebs.com/presupuestos/sitioprofesional',
            'desc' => 'un sitio profesional completo',
            'reconocimiento_que' => 'tus servicios',
            'imagenes_pedido' => 'el logo y 3 o 4 fotos de tus trabajos, tu local o tu equipo',
            'precio_ideal' => '{para_quien} te armamos {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=sitioprofesional',
            'portfolio_texto' => 'otros sitios que ya entregamos',
            'mensualidad' => '$20.000',
            'mensualidad_cambios' => '$25.000',
            'mantenimiento' => '$10.000',
            'sena' => '$40.000',
        ],
        'ecommerce' => [
            'label' => 'Ecommerce',
            'precio' => '$190.000',
            'precio_unico' => '$300.000',
            'link' => 'gokywebs.com/presupuestos/ecommerce',
            'desc' => 'una tienda online completa',
            'reconocimiento_que' => 'tus productos',
            'imagenes_pedido' => 'el logo y fotos de tus productos, aunque sean 4 o 5 para arrancar',
            'precio_ideal' => '{para_quien} te armamos {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=ecommerce',
            'portfolio_texto' => 'otras tiendas online que ya entregamos',
            'mensualidad' => '$30.000',
            'mensualidad_cambios' => '$35.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
        'elearning' => [
            'label' => 'Plataforma de cursos',
            'precio' => '$190.000',
            'precio_unico' => '$290.000',
            'link' => 'gokywebs.com/presupuestos/elearning',
            'desc' => 'una plataforma de cursos completa',
            'reconocimiento_que' => 'tus cursos',
            'imagenes_pedido' => 'el logo y alguna foto tuya dando clase o del material de los cursos',
            'precio_ideal' => '{para_quien} te armamos {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=elearning',
            'portfolio_texto' => 'otras plataformas de cursos que ya entregamos',
            'mensualidad' => '$30.000',
            'mensualidad_cambios' => '$35.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
        'inmobiliaria' => [
            'label' => 'Web inmobiliaria',
            'precio' => '$170.000',
            'precio_unico' => '$260.000',
            'link' => 'gokywebs.com/presupuestos/inmobiliaria',
            'desc' => 'una web inmobiliaria completa',
            'reconocimiento_que' => 'tus propiedades',
            'imagenes_pedido' => 'el logo y fotos de un par de propiedades que tengas publicadas',
            'precio_ideal' => '{para_quien} te armamos {propuesta}.',
            'portfolio' => 'gokywebs.com/portfolio/?tipo=inmobiliaria',
            'portfolio_texto' => 'otras webs de inmobiliarias que ya entregamos',
            'mensualidad' => '$30.000',
            'mensualidad_cambios' => '$35.000',
            'mantenimiento' => '$15.000',
            'sena' => '$60.000',
        ],
    ],
    'ultima_llamada' => 'Hola {nombre}, cómo estás? Te escribo por última vez por lo de la web. Si querés retomar o te quedó alguna duda, escribime por acá y seguimos.',
    'ultima_llamada_activa' => true,
    'ultima_llamada_horas' => 23,
    'ya_tengo_web' => 'Perfecto, pasame el link de tu página actual así la reviso y te digo qué conviene mejorar. También podés comparar con los modelos de gokywebs.com/modelos/.',
    'ya_tengo_web_sin_muestra' => 'Perfecto, pasame el link de tu página actual así la reviso y te confirmo cómo la mejoraríamos.',
];
}
