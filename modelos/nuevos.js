/* Rubros del portfolio y nuevas propuestas para la galería de modelos.
   A–K conservan sus ids; las nuevas letras se calculan en orden. */
const GW_MODELO_RUBROS = [
    ['comercios', 'Comercios y distribuidoras', '#2563eb', '#172554'],
    ['gastronomia', 'Gastronomía y eventos', '#ea580c', '#431407'],
    ['moda', 'Moda e indumentaria', '#be185d', '#500724'],
    ['hogar', 'Hogar y muebles', '#a16207', '#422006'],
    ['belleza', 'Belleza y estética', '#a21caf', '#3b0764'],
    ['salud', 'Salud y bienestar', '#0f766e', '#134e4a'],
    ['legales', 'Legales y contable', '#334155', '#0f172a'],
    ['finanzas', 'Seguros y finanzas', '#1d4ed8', '#1e3a8a'],
    ['inmobiliaria', 'Inmobiliaria', '#0e7490', '#164e63'],
    ['educacion', 'Educación y cursos', '#7c3aed', '#4c1d95'],
    ['tecnologia', 'Tecnología y electrónica', '#0891b2', '#083344'],
    ['industria', 'Industria y construcción', '#ca8a04', '#292524'],
    ['servicios', 'Servicios y oficios', '#4f46e5', '#312e81'],
    ['automotor', 'Automotor', '#dc2626', '#450a0a'],
    ['deportes', 'Deportes y fitness', '#65a30d', '#365314'],
    ['arte', 'Arte y espectáculos', '#9333ea', '#3b0764'],
    ['turismo', 'Turismo y hotelería', '#0284c7', '#0c4a6e']
].map(function (r) { return { id: r[0], label: r[1], acento: r[2], oscuro: r[3] }; });

const GW_RUBROS_EXISTENTES = {
    a: ['comercios', 'hogar', 'tecnologia'],
    b: ['comercios', 'moda', 'tecnologia', 'automotor'],
    c: ['moda', 'hogar', 'arte'],
    d: ['comercios', 'industria'],
    e: ['gastronomia'],
    f: ['legales', 'finanzas', 'servicios', 'industria'],
    g: ['salud', 'arte', 'turismo'],
    h: ['belleza', 'salud', 'deportes'],
    i: ['inmobiliaria'],
    j: ['inmobiliaria', 'turismo'],
    k: ['educacion', 'belleza', 'deportes']
};
GW_MODELOS.forEach(function (m) {
    m.rubros = GW_RUBROS_EXISTENTES[m.id] || [];
    var paleta = GW_MODELO_RUBROS.filter(function (r) { return r.id === m.rubros[0]; })[0];
    if (paleta) { m.acento = paleta.acento; m.oscuro = paleta.oscuro; }
});

/* Cada propuesta contiene su portada y una secuencia propia. Los bloques de
   reserva, agenda, planes y vehículos amplían las secciones originales. */
const GW_NUEVOS = [
    ['comercios', [
        ['Vidriera de barrio', 'ecommerce', 'Promociones y categorías antes de comprar', 'Comercios con variedad', 'Todo lo que buscás, cerca tuyo', 'Ver ofertas', 'dividido', [
            ['categorias-circulos', 'Categorías'], ['productos-carrusel', 'Más vendidos', { titulo: 'Los más elegidos' }], ['beneficios', 'Envíos y pagos']]],
        ['Pedido para comercios', 'ecommerce', 'Lista de productos y pedido visible', 'Distribuidoras con compras recurrentes', 'Reponé tu negocio en minutos', 'Armar pedido', 'compacto', [
            ['lista-mayorista', 'Pedido mayorista'], ['pasos-rubro', 'Cómo comprar', { items: ['Elegí productos', 'Definí cantidades', 'Coordiná la entrega'] }]]]
    ]],
    ['gastronomia', [
        ['Menú directo', 'ecommerce', 'Carta por categorías y pedido fácil', 'Locales con delivery y retiro', 'Pedí algo rico para hoy', 'Ver el menú', 'dividido', [
            ['menu-comida', 'Carta y pedido'], ['beneficios', 'Entrega y medios de pago']]],
        ['Eventos con reserva', 'landing', 'Espacios, opciones y consulta de fecha', 'Salones, catering y experiencias', 'Momentos para recordar', 'Consultar fecha', 'inmersivo', [
            ['galeria', 'Espacios y eventos'], ['oferta-rubro', 'Opciones', { items: ['Celebraciones', 'Empresas', 'Catering'] }], ['reserva-rubro', 'Consulta de fecha', { titulo: 'Reservá tu fecha', campos: ['Tipo de evento', 'Fecha estimada', 'Invitados'] }]]]
    ]],
    ['moda', [
        ['Colección editorial', 'ecommerce', 'Colecciones y fotos grandes', 'Marcas de ropa y accesorios', 'Vestite con tu propio estilo', 'Ver colección', 'inmersivo', [
            ['categorias-tarjetas', 'Colecciones'], ['productos-mosaico', 'Destacados'], ['historia', 'Nuestra marca']]],
        ['Comprar por talle', 'ecommerce', 'Filtros útiles desde el primer scroll', 'Tiendas con muchos talles', 'Encontrá tu próximo favorito', 'Explorar prendas', 'compacto', [
            ['productos-filtros', 'Catálogo con filtros'], ['instagram', 'Looks reales']]]
    ]],
    ['hogar', [
        ['Ambientes inspiradores', 'ecommerce', 'Comprar por ambiente y estilo', 'Muebles y decoración', 'Hacé de tu casa tu lugar', 'Descubrir ambientes', 'inmersivo', [
            ['categorias-tarjetas', 'Ambientes'], ['productos-carrusel', 'Productos', { titulo: 'Para renovar tu espacio', estilo: 'foto' }], ['historia', 'La marca']]],
        ['Muebles a medida', 'landing', 'Proyectos, proceso y consulta de medidas', 'Carpinterías e interiorismo', 'Muebles pensados para tu espacio', 'Contanos tu idea', 'dividido', [
            ['galeria', 'Trabajos realizados'], ['pasos-rubro', 'Cómo trabajamos', { items: ['Contanos tu idea', 'Diseñamos una propuesta', 'Fabricamos e instalamos'] }], ['contacto', 'Presupuesto y contacto']]]
    ]],
    ['belleza', [
        ['Estudio con agenda', 'landing', 'Servicios, trabajos y turnos', 'Estéticas y peluquerías', 'Un momento para vos', 'Pedir turno', 'inmersivo', [
            ['servicios-pestanas', 'Servicios y precios'], ['galeria', 'Resultados'], ['turnos', 'Agenda']]],
        ['Cosmética con guía', 'ecommerce', 'Productos y ayuda para elegirlos', 'Cosmética y cuidado personal', 'Tu rutina empieza acá', 'Elegir productos', 'dividido', [
            ['productos-grilla', 'Productos', { titulo: 'Para tu rutina', cols: 4, filas: 2 }], ['oferta-rubro', 'Elegí por necesidad', { items: ['Piel', 'Cabello', 'Maquillaje'] }], ['faq', 'Preguntas comunes']]]
    ]],
    ['salud', [
        ['Consultorio claro', 'landing', 'Especialidades y equipo con turnos visibles', 'Consultorios y centros de salud', 'Atención cercana para sentirte mejor', 'Pedir turno', 'dividido', [
            ['servicios-tarjetas', 'Especialidades', { titulo: 'Cómo podemos ayudarte', items: ['Consultas', 'Estudios', 'Seguimiento'] }], ['equipo', 'Profesionales'], ['turnos', 'Turnos']]],
        ['Bienestar personal', 'landing', 'Método y contacto sin distracciones', 'Terapias y nutrición', 'Un espacio para empezar a cuidarte', 'Escribime', 'centrado', [
            ['zigzag', 'Método y acompañamiento'], ['testimonios', 'Experiencias'], ['faq', 'Preguntas frecuentes']]]
    ]],
    ['legales', [
        ['Estudio de confianza', 'landing', 'Áreas de práctica y credenciales', 'Estudios jurídicos y contables', 'Asesoramiento para decisiones importantes', 'Solicitar consulta', 'dividido', [
            ['servicios-tarjetas', 'Áreas de práctica', { titulo: 'Cómo podemos ayudarte', items: ['Familia', 'Empresas', 'Contabilidad'] }], ['equipo', 'Profesionales'], ['pasos-rubro', 'La consulta', { items: ['Contanos tu caso', 'Evaluamos opciones', 'Te acompañamos'] }]]],
        ['Consulta puntual', 'landing', 'Respuestas frecuentes y formulario claro', 'Profesionales independientes', 'Una respuesta clara para tu caso', 'Hacer una consulta', 'compacto', [
            ['oferta-rubro', 'Consultas frecuentes', { items: ['Contratos', 'Trámites', 'Impuestos'], fotos: true }], ['faq', 'Dudas habituales'], ['reserva-rubro', 'Solicitar consulta', { titulo: 'Contanos qué necesitás', campos: ['Tema', 'Nombre', 'Contacto'] }]]]
    ]],
    ['finanzas', [
        ['Planes comparables', 'landing', 'Comparar opciones antes de cotizar', 'Seguros y servicios financieros', 'Elegí la cobertura que va con vos', 'Cotizar ahora', 'dividido', [
            ['planes-rubro', 'Comparación de planes', { titulo: 'Encontrá tu plan', items: ['Esencial', 'Plus', 'Premium'] }], ['pasos-rubro', 'Cómo contratar', { items: ['Elegí una opción', 'Recibí cotización', 'Activá el plan'] }], ['faq', 'Preguntas frecuentes']]],
        ['Asesoría personal', 'landing', 'Problemas, soluciones y consulta inicial', 'Asesores y brokers', 'Ordená tus finanzas con un plan', 'Hablar con un asesor', 'centrado', [
            ['oferta-rubro', 'Áreas de asesoría', { items: ['Ahorro', 'Protección', 'Inversión'] }], ['testimonios', 'Clientes'], ['reserva-rubro', 'Consulta inicial', { titulo: 'Agendá una conversación', campos: ['Qué necesitás', 'Nombre', 'Contacto'] }]]]
    ]],
    ['inmobiliaria', [
        ['Propiedades por zona', 'inmobiliaria', 'Buscar y explorar inmuebles destacados', 'Inmobiliarias con venta y alquiler', 'Encontrá el lugar para tu próxima etapa', 'Ver propiedades', 'inmersivo', [
            ['propiedades', 'Propiedades destacadas'], ['pasos-rubro', 'Cómo te acompañamos', { items: ['Buscamos', 'Visitamos', 'Concretamos'] }]]],
        ['Tasaciones y captación', 'inmobiliaria', 'Valoración y consulta para propietarios', 'Martilleros y corredores', 'Vendé tu propiedad con acompañamiento', 'Pedir tasación', 'dividido', [
            ['numeros', 'Trayectoria'], ['pasos-rubro', 'Proceso de venta', { items: ['Tasamos', 'Publicamos', 'Negociamos'] }], ['contacto', 'Solicitar tasación']]]
    ]],
    ['educacion', [
        ['Escuela de cursos', 'elearning', 'Varias formaciones, docentes y alumnos', 'Academias con oferta variada', 'Aprendé algo nuevo a tu ritmo', 'Ver cursos', 'dividido', [
            ['cursos-grilla', 'Oferta de cursos'], ['equipo', 'Docentes'], ['testimonios', 'Alumnos']]],
        ['Curso estrella', 'elearning', 'Temario y propuesta antes de inscribirse', 'Una formación principal', 'Una habilidad nueva cambia todo', 'Ver el programa', 'centrado', [
            ['temario', 'Programa e inscripción'], ['pasos-rubro', 'Cómo se cursa', { items: ['Inscribite', 'Mirá las clases', 'Aplicá lo aprendido'] }], ['faq', 'Preguntas frecuentes']]]
    ]],
    ['tecnologia', [
        ['Repuestos buscables', 'ecommerce', 'Buscador y filtros útiles para técnicos', 'Repuestos y electrónica', 'Encontrá el repuesto correcto', 'Buscar productos', 'compacto', [
            ['productos-filtros', 'Catálogo filtrable'], ['beneficios', 'Garantía y entrega']]],
        ['Servicio técnico', 'landing', 'Diagnóstico, proceso y presupuesto', 'Talleres y soporte especializado', 'Tu equipo en buenas manos', 'Pedir diagnóstico', 'dividido', [
            ['oferta-rubro', 'Reparaciones', { items: ['Celulares', 'Computadoras', 'Consolas'] }], ['pasos-rubro', 'Cómo trabajamos', { items: ['Diagnosticamos', 'Presupuestamos', 'Reparamos'] }], ['testimonios', 'Clientes']]]
    ]],
    ['industria', [
        ['Catálogo industrial', 'ecommerce', 'Familias técnicas y pedido de cotización', 'Maquinaria y suministros', 'Insumos para seguir produciendo', 'Ver catálogo', 'compacto', [
            ['categorias-circulos', 'Familias de productos'], ['productos-filtros', 'Catálogo'], ['pasos-rubro', 'Cotización', { items: ['Elegí productos', 'Pedí cotización', 'Coordiná entrega'] }]]],
        ['Obras y proyectos', 'landing', 'Capacidades y proyectos realizados', 'Constructoras y fábricas', 'Construimos soluciones a escala', 'Cotizar proyecto', 'inmersivo', [
            ['oferta-rubro', 'Capacidades', { items: ['Diseño', 'Construcción', 'Mantenimiento'] }], ['galeria', 'Proyectos'], ['numeros', 'Experiencia']]]
    ]],
    ['servicios', [
        ['Presupuesto rápido', 'landing', 'Servicios y consulta desde la portada', 'Técnicos y profesionales', 'Resolvé lo que necesitás hoy', 'Pedir presupuesto', 'dividido', [
            ['servicios-tarjetas', 'Servicios', { titulo: 'Qué podemos hacer', items: ['Instalación', 'Reparación', 'Mantenimiento'] }], ['pasos-rubro', 'Cómo funciona', { items: ['Escribinos', 'Cotizamos', 'Resolvemos'] }], ['contacto', 'Contacto']]],
        ['Trabajos que hablan', 'landing', 'Galería y opiniones como prueba', 'Oficios con trabajos visuales', 'Resultados que se pueden ver', 'Ver trabajos', 'centrado', [
            ['galeria', 'Antes y después'], ['testimonios', 'Opiniones'], ['oferta-rubro', 'Servicios', { items: ['Trabajo 1', 'Trabajo 2', 'Trabajo 3'] }]]]
    ]],
    ['automotor', [
        ['Autos en venta', 'landing', 'Vehículos, financiación y contacto', 'Concesionarias y usados', 'Tu próximo auto te espera', 'Ver vehículos', 'inmersivo', [
            ['vehiculos-rubro', 'Vehículos disponibles'], ['planes-rubro', 'Opciones de compra', { titulo: 'Cómo comprar', items: ['Contado', 'Financiación', 'Permuta'] }], ['contacto', 'Contacto']]],
        ['Repuestos por vehículo', 'ecommerce', 'Compatibilidad antes de agregar al carrito', 'Autopartes y accesorios', 'El repuesto que va con tu auto', 'Buscar repuesto', 'compacto', [
            ['vehiculos-rubro', 'Selector de vehículo', { repuestos: true }], ['productos-grilla', 'Repuestos', { titulo: 'Productos populares', cols: 4, filas: 2 }], ['beneficios', 'Garantía y entrega']]]
    ]],
    ['deportes', [
        ['Clases y horarios', 'landing', 'Actividades y horarios para inscribirse', 'Gimnasios y estudios', 'Movete a tu manera', 'Probar una clase', 'inmersivo', [
            ['oferta-rubro', 'Actividades', { items: ['Entrenamiento', 'Clases grupales', 'Personalizado'] }], ['equipo', 'Profesores'], ['agenda-rubro', 'Horarios', { titulo: 'Encontrá tu horario', items: ['Lunes · Funcional', 'Miércoles · Yoga', 'Viernes · Fuerza'] }]]],
        ['Tienda fitness', 'ecommerce', 'Categorías y productos para entrenar', 'Equipos y suplementos', 'Todo para tu próximo desafío', 'Comprar ahora', 'dividido', [
            ['categorias-circulos', 'Categorías'], ['productos-grilla', 'Productos', { titulo: 'Para entrenar', cols: 4, filas: 2 }], ['beneficios', 'Envíos y pagos']]]
    ]],
    ['arte', [
        ['Portfolio de artista', 'landing', 'Obra destacada y proyectos visuales', 'Artistas y fotógrafos', 'Una mirada que cuenta historias', 'Ver proyectos', 'inmersivo', [
            ['galeria', 'Obras y proyectos'], ['historia', 'Sobre el artista'], ['testimonios', 'Colaboraciones']]],
        ['Agenda de espectáculos', 'landing', 'Fechas y entradas visibles', 'Productoras y salas', 'La próxima experiencia empieza acá', 'Ver entradas', 'centrado', [
            ['agenda-rubro', 'Próximas fechas', { titulo: 'Agenda', items: ['12 OCT · Teatro', '24 OCT · Festival', '08 NOV · Música en vivo'] }], ['galeria', 'Shows anteriores'], ['newsletter', 'Novedades']]]
    ]],
    ['turismo', [
        ['Hotel con reserva', 'landing', 'Habitaciones y búsqueda de disponibilidad', 'Hoteles y cabañas', 'Tu próxima escapada empieza acá', 'Consultar disponibilidad', 'inmersivo', [
            ['reserva-rubro', 'Buscar estadía', { titulo: 'Elegí tus fechas', campos: ['Entrada', 'Salida', 'Huéspedes'] }], ['oferta-rubro', 'Habitaciones', { items: ['Habitación doble', 'Suite', 'Cabaña familiar'], fotos: true }], ['galeria', 'El lugar']]],
        ['Experiencias y excursiones', 'landing', 'Excursiones, fechas y consulta por viaje', 'Agencias y guías turísticos', 'Viví el destino a tu manera', 'Explorar experiencias', 'dividido', [
            ['oferta-rubro', 'Experiencias', { items: ['Aventura', 'Gastronomía', 'Escapadas'], fotos: true }], ['agenda-rubro', 'Próximas salidas', { titulo: 'Próximas salidas', items: ['Octubre · Montaña', 'Noviembre · Costa', 'Diciembre · Ciudad'] }], ['reserva-rubro', 'Consultar viaje', { titulo: 'Armemos tu viaje', campos: ['Destino', 'Fecha', 'Viajeros'] }]]]
    ]]
];

function gwIdLetra(n) {
    var letras = '';
    do { letras = String.fromCharCode(97 + n % 26) + letras; n = Math.floor(n / 26) - 1; }
    while (n >= 0);
    return letras;
}

GW_NUEVOS.forEach(function (grupo) {
    var rubro = GW_MODELO_RUBROS.filter(function (r) { return r.id === grupo[0]; })[0];
    grupo[1].forEach(function (p) {
        var id = gwIdLetra(GW_MODELOS.length);
        var header = p[1] === 'ecommerce' ? 'header-tienda' : p[1] === 'inmobiliaria' ? 'header-inmo' : p[1] === 'elearning' ? 'header-cursos' : 'header-simple';
        GW_MODELOS.push({
            id: id, letra: id.toUpperCase(), nombre: p[0], tipo: p[1], rubros: [rubro.id],
            acento: rubro.acento, oscuro: rubro.oscuro,
            claves: [['Primera mirada', p[2]], ['Lo importante', p[3]], ['Ideal para', rubro.label]],
            secciones: [[header, 'Encabezado', { boton: p[5] }],
                ['hero-rubro', 'Primera pantalla', { eyebrow: rubro.label, titulo: p[4], boton: p[5], modo: p[6] }]]
                .concat(p[7], [['footer-simple', 'Pie de página']])
        });
    });
});
