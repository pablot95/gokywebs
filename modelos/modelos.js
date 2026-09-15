/* ============================================================
   modelos/modelos.js — Catálogo de modelos de estructura.

   Un modelo NO es una web terminada: es el orden de las partes
   (primera pantalla, catálogo, servicios, contacto…) mostrado con
   fotos de ejemplo. El cliente elige la letra y los colores, las
   fotos y los textos finales van con su marca.

   Campos:
     id        letra en minúscula; es el deep-link (?m=c, #c)
     letra     como lo nombra el cliente ("me gusta el C")
     nombre    nombre corto del modelo
     tipo      ecommerce | landing | inmobiliaria | elearning
               (los mismos ids del portfolio, así el bot manda el
               link con el mismo ?tipo=)
     claves    lo que distingue a este modelo, en tres renglones
     secciones [clave de la sección, nombre de la parte, opciones]
               las dibuja modelos/wire.js

   Para sumar un modelo: agregá el objeto con la letra que sigue.
   ============================================================ */

const GW_MODELO_TIPOS = [
    { id: 'ecommerce',    label: 'Tienda online' },
    { id: 'landing',      label: 'Sitio profesional' },
    { id: 'inmobiliaria', label: 'Inmobiliaria' },
    { id: 'elearning',    label: 'Plataforma de cursos' }
];

const GW_MODELOS = [
    {
        id: 'a', letra: 'A', nombre: 'Categorías primero', tipo: 'ecommerce',
        claves: [
            ['Primera pantalla', 'Banner ancho con promociones que van pasando'],
            ['Catálogo', 'Categorías en círculos, carrusel de más vendidos y grilla de 4'],
            ['Ideal para', 'Tiendas con muchas categorías: bazar, regalos, dietética, tecnología']
        ],
        secciones: [
            ['aviso', 'Barra de aviso', { texto: 'Envío gratis desde $00.000 · Hasta 6 cuotas' }],
            ['header-tienda', 'Encabezado'],
            ['hero-banner', 'Primera pantalla'],
            ['categorias-circulos', 'Categorías'],
            ['productos-carrusel', 'Carrusel de productos', { titulo: 'Más vendidos' }],
            ['banners-doble', 'Promociones'],
            ['productos-grilla', 'Grilla de productos', { titulo: 'Novedades', cols: 4, filas: 2 }],
            ['beneficios', 'Beneficios'],
            ['pasos-rubro', 'Cómo comprar', { items: ['Elegí tus productos', 'Pagá de forma segura', 'Recibí tu pedido'] }],
            ['newsletter', 'Suscripción'],
            ['footer-completo', 'Pie de página']
        ]
    },
    {
        id: 'b', letra: 'B', nombre: 'Catálogo con filtros', tipo: 'ecommerce',
        claves: [
            ['Primera pantalla', 'Buscador grande arriba y directo al catálogo, sin banner'],
            ['Catálogo', 'Filtros al costado (categoría, precio, talle) y orden por precio'],
            ['Ideal para', 'Mucha variedad: calzado, repuestos, cosmética, herramientas']
        ],
        secciones: [
            ['header-buscador', 'Encabezado con buscador'],
            ['hero-corto', 'Título del catálogo'],
            ['productos-filtros', 'Catálogo con filtros'],
            ['productos-carrusel', 'Productos recomendados', { titulo: 'También te puede interesar' }],
            ['beneficios', 'Beneficios'],
            ['footer-completo', 'Pie de página']
        ]
    },
    {
        id: 'c', letra: 'C', nombre: 'Vidriera de fotos', tipo: 'ecommerce',
        claves: [
            ['Primera pantalla', 'Una foto a pantalla completa con el título encima'],
            ['Catálogo', 'Colecciones en tarjetas grandes y productos en mosaico'],
            ['Ideal para', 'Marcas de ropa, accesorios y deco, donde manda la foto']
        ],
        secciones: [
            ['aviso', 'Barra de aviso', { texto: 'Nueva colección · Envíos a todo el país' }],
            ['header-centrado', 'Encabezado con logo al centro'],
            ['hero-pantalla', 'Primera pantalla'],
            ['categorias-tarjetas', 'Colecciones'],
            ['productos-mosaico', 'Productos en mosaico'],
            ['productos-carrusel', 'Carrusel de productos', { titulo: 'Lo nuevo', estilo: 'foto' }],
            ['historia', 'Historia de la marca', { eyebrow: 'Nuestra marca', titulo: 'La historia detrás de cada prenda' }],
            ['beneficios', 'Envíos y medios de pago'],
            ['instagram', 'Instagram'],
            ['footer-simple', 'Pie de página']
        ]
    },
    {
        id: 'd', letra: 'D', nombre: 'Lista mayorista', tipo: 'ecommerce',
        claves: [
            ['Primera pantalla', 'Buscador y categorías en pestañas, sin fotos grandes'],
            ['Catálogo', 'Lista de productos en filas con cantidad y el pedido siempre a la vista'],
            ['Ideal para', 'Distribuidoras y venta por mayor: limpieza, alimentos, librería']
        ],
        secciones: [
            ['aviso', 'Barra de aviso', { texto: 'Compra mínima $00.000 · Precios por bulto' }],
            ['header-buscador', 'Encabezado con buscador'],
            ['lista-mayorista', 'Lista de productos y pedido'],
            ['pasos-rubro', 'Cómo hacer el pedido', { items: ['Buscá productos', 'Indicá cantidades', 'Coordiná el reparto'] }],
            ['beneficios', 'Beneficios', { items: [
                ['camion', 'Reparto a comercios'], ['tarjeta', 'Cuenta corriente'],
                ['reloj', 'Pedido en el día'], ['wsp', 'Atención por WhatsApp']
            ] }],
            ['footer-completo', 'Pie de página']
        ]
    },
    {
        id: 'e', letra: 'E', nombre: 'Pedidos de comida', tipo: 'ecommerce',
        claves: [
            ['Primera pantalla', 'Portada del local con horario, delivery y pedido mínimo'],
            ['Catálogo', 'Menú por categorías, cada plato con su botón para sumar'],
            ['Ideal para', 'Pizzerías, rotiserías, pollerías, viandas y delivery']
        ],
        secciones: [
            ['header-comida', 'Encabezado'],
            ['hero-comida', 'Portada del local'],
            ['menu-comida', 'Menú y pedido'],
            ['beneficios', 'Delivery, retiro y pagos'],
            ['footer-simple', 'Pie de página']
        ]
    },
    {
        id: 'f', letra: 'F', nombre: 'Clásico dividido', tipo: 'landing',
        claves: [
            ['Primera pantalla', 'Texto a la izquierda y foto a la derecha, con dos botones'],
            ['Contenido', 'Servicios en tarjetas, quiénes somos, opiniones, preguntas y contacto'],
            ['Ideal para', 'Profesionales y oficios: contadores, abogados, técnicos, empresas']
        ],
        secciones: [
            ['header-simple', 'Encabezado', { boton: 'Contactanos' }],
            ['hero-dividido', 'Primera pantalla'],
            ['servicios-tarjetas', 'Servicios', { titulo: 'Qué hacemos' }],
            ['historia', 'Quiénes somos', { eyebrow: 'Quiénes somos', titulo: 'Años resolviendo lo que necesitás', invertir: true }],
            ['pasos-rubro', 'Cómo trabajamos', { items: ['Nos contás tu necesidad', 'Preparamos una propuesta', 'La llevamos adelante'] }],
            ['testimonios', 'Opiniones'],
            ['faq', 'Preguntas frecuentes'],
            ['contacto', 'Contacto'],
            ['footer-completo', 'Pie de página']
        ]
    },
    {
        id: 'g', letra: 'G', nombre: 'Una sola columna', tipo: 'landing',
        claves: [
            ['Primera pantalla', 'Título grande centrado, sin distracciones, y una foto ancha abajo'],
            ['Contenido', 'Bloques de foto y texto alternados que se leen como una historia'],
            ['Ideal para', 'Marca personal: terapeutas, coaches, artistas, fotógrafos']
        ],
        secciones: [
            ['header-simple', 'Encabezado', { boton: 'WhatsApp' }],
            ['hero-centrado', 'Primera pantalla'],
            ['zigzag', 'Foto y texto alternados'],
            ['oferta-rubro', 'Formas de trabajar', { items: ['Sesiones', 'Proyectos', 'Colaboraciones'] }],
            ['numeros', 'Números'],
            ['testimonios', 'Opiniones'],
            ['cta-banda', 'Llamado a la acción', { titulo: '¿Empezamos?', boton: 'Escribime por WhatsApp' }],
            ['footer-simple', 'Pie de página']
        ]
    },
    {
        id: 'h', letra: 'H', nombre: 'Servicios y turnos', tipo: 'landing',
        claves: [
            ['Primera pantalla', 'Foto de fondo con el botón “Pedir turno” bien visible'],
            ['Contenido', 'Servicios en pestañas con precio, galería de trabajos, equipo y agenda'],
            ['Ideal para', 'Estética, peluquerías, consultorios, uñas y pestañas, gimnasios']
        ],
        secciones: [
            ['header-simple', 'Encabezado', { boton: 'Pedir turno' }],
            ['hero-fondo', 'Primera pantalla'],
            ['servicios-pestanas', 'Servicios con precio'],
            ['galeria', 'Galería de trabajos'],
            ['equipo', 'Equipo'],
            ['turnos', 'Agenda de turnos'],
            ['faq', 'Dudas antes de reservar'],
            ['contacto', 'Contacto y ubicación'],
            ['footer-simple', 'Pie de página']
        ]
    },
    {
        id: 'i', letra: 'I', nombre: 'Buscador de propiedades', tipo: 'inmobiliaria',
        claves: [
            ['Primera pantalla', 'Foto con el buscador encima: operación, tipo y zona'],
            ['Catálogo', 'Propiedades destacadas en tarjetas con precio, ambientes y metros'],
            ['Ideal para', 'Inmobiliarias de barrio y martilleros con venta y alquiler']
        ],
        secciones: [
            ['header-inmo', 'Encabezado'],
            ['hero-inmo', 'Primera pantalla con buscador'],
            ['propiedades', 'Propiedades destacadas'],
            ['servicios-tarjetas', 'Servicios', { titulo: 'Cómo te ayudamos', items: ['Comprar', 'Vender', 'Alquilar'] }],
            ['pasos-rubro', 'Cómo seguimos', { items: ['Buscá', 'Visitá', 'Decidí'] }],
            ['cta-banda', 'Tasaciones', { titulo: '¿Querés vender o alquilar tu propiedad?', boton: 'Pedir tasación' }],
            ['contacto', 'Contacto'],
            ['footer-completo', 'Pie de página']
        ]
    },
    {
        id: 'j', letra: 'J', nombre: 'Mapa y listado', tipo: 'inmobiliaria',
        claves: [
            ['Primera pantalla', 'Directo al listado, con filtros arriba'],
            ['Catálogo', 'Lista de propiedades a la izquierda y mapa con precios a la derecha'],
            ['Ideal para', 'Muchas propiedades en varias zonas, o alquileres temporarios']
        ],
        secciones: [
            ['header-inmo', 'Encabezado'],
            ['mapa-lista', 'Listado y mapa'],
            ['cta-banda', 'Tasaciones', { titulo: '¿Querés publicar tu propiedad con nosotros?', boton: 'Pedir tasación' }],
            ['contacto', 'Consulta y contacto'],
            ['footer-simple', 'Pie de página']
        ]
    },
    {
        id: 'k', letra: 'K', nombre: 'Academia de cursos', tipo: 'elearning',
        claves: [
            ['Primera pantalla', 'Video de presentación al lado del título y los números de la academia'],
            ['Contenido', 'Cursos en tarjetas, temario por módulos, docente y opiniones'],
            ['Ideal para', 'Cursos online, formaciones, talleres y terapias con clases']
        ],
        secciones: [
            ['header-cursos', 'Encabezado'],
            ['hero-video', 'Primera pantalla con video'],
            ['cursos-grilla', 'Cursos'],
            ['temario', 'Temario e inscripción'],
            ['pasos-rubro', 'Cómo se aprende', { items: ['Inscribite', 'Mirá las clases', 'Ponelo en práctica'] }],
            ['historia', 'Docente', { eyebrow: 'Quién enseña', titulo: 'Tu docente', circulo: true }],
            ['testimonios', 'Opiniones de alumnos'],
            ['faq', 'Preguntas frecuentes'],
            ['footer-completo', 'Pie de página']
        ]
    }
];
