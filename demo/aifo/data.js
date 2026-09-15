/* A.I.F.O — Academia Internacional de Formadores Online
   Datos demostrativos: cursos, formadores y comunidad hardcodeados.
   Nada de esto es un backend: el catálogo, el carrito, el aula y los paneles
   funcionan en el navegador con localStorage. */

const WHATSAPP = '5492235044680';
const INSTAGRAM = 'https://www.instagram.com/aifoformadoresonline';

/* Cada formador administra su propio espacio (cursos, ventas, alumnos).
   Perfiles demostrativos: los datos reales se cargan con la información de cada docente. */
const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Matías Rearte',
    rol: 'Desarrollador full-stack',
    disciplina: 'Programación',
    bio: 'Programa hace más de diez años y forma equipos de desarrollo. Sus clases arrancan escribiendo código desde la primera, sin teoría de más.',
    foto: 'images/formador-matias-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd2',
    nombre: 'Delfina Sosa',
    rol: 'Diseñadora de producto (UX/UI)',
    disciplina: 'Diseño',
    bio: 'Diseña productos digitales para equipos de tecnología. Enseña a pasar de una idea suelta a un prototipo que se puede probar con usuarios reales.',
    foto: 'images/formador-delfina-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd3',
    nombre: 'Ezequiel Bravo',
    rol: 'Especialista en marketing digital',
    disciplina: 'Marketing',
    bio: 'Acompaña a negocios que quieren vender online sin depender del boca en boca. Baja la estrategia a acciones concretas de cada semana.',
    foto: 'images/formador-ezequiel-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd4',
    nombre: 'Carla Nieto',
    rol: 'Educadora en finanzas personales',
    disciplina: 'Finanzas',
    bio: 'Explica la plata sin humo ni promesas mágicas. Sus cursos son educativos: te ordenan la economía diaria, no te dicen dónde invertir.',
    foto: 'images/formador-carla-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd5',
    nombre: 'Rodrigo Paz',
    rol: 'Fotógrafo profesional',
    disciplina: 'Fotografía',
    bio: 'Trabaja de la fotografía hace años y da talleres presenciales. Muestra que la buena foto empieza en la mirada, no en el equipo caro.',
    foto: 'images/formador-rodrigo-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd6',
    nombre: 'Valentina Ríos',
    rol: 'Profesora de inglés profesional',
    disciplina: 'Idiomas',
    bio: 'Prepara a profesionales para trabajar en inglés: reuniones, mails y entrevistas. Clases en vivo, con práctica de conversación desde el día uno.',
    foto: 'images/formador-valentina-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd7',
    nombre: 'Lucía Franco',
    rol: 'Instructora de bienestar y hábitos',
    disciplina: 'Bienestar',
    bio: 'Acompaña procesos de bienestar desde la práctica, no desde la promesa. Sus cursos son complementarios y no reemplazan tratamientos de salud.',
    foto: 'images/formador-lucia-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd8',
    nombre: 'Gastón Medina',
    rol: 'Analista de datos',
    disciplina: 'Data',
    bio: 'Convierte planillas caóticas en decisiones claras. Enseña Excel y Python para gente que nunca programó, con casos de trabajo reales.',
    foto: 'images/formador-gaston-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  }
];

/* Helper para armar 3 módulos × 3 clases sin repetir tanto texto.
   Cada curso termina con 9 clases; la primera es abierta (preview). */
function mod(id, titulo, clases) { return { id, titulo, clases }; }
function cl(id, titulo, duracion, tipo, preview) {
  return { id, titulo, duracion, tipo, preview: !!preview };
}

const CURSOS = [
  {
    id: 'c1',
    slug: 'desarrollo-web-javascript',
    titulo: 'Desarrollo web desde cero con JavaScript',
    categoria: 'Programación',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 46900,
    descuento: 15,
    duracion: '10 horas',
    cantidadClases: 9,
    descripcionCorta: 'Creá tus primeras páginas interactivas escribiendo HTML, CSS y JavaScript desde la primera clase.',
    descripcionCompleta: 'Un recorrido pensado para quien nunca programó. Armás páginas reales paso a paso: estructura con HTML, estilos con CSS y lógica con JavaScript. Cada módulo cierra con un proyecto chico que sumás a tu portfolio.',
    resultados: [
      'Maquetar una página responsive con HTML y CSS',
      'Agregar interactividad real con JavaScript del navegador',
      'Publicar tu primer proyecto online para mostrarlo'
    ],
    requisitos: ['No necesitás experiencia previa', 'Una computadora con navegador y editor de texto gratuito'],
    incluye: ['9 clases grabadas', 'Proyectos descargables', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['html', 'css', 'javascript', 'frontend', 'programar'],
    docenteId: 'd1',
    portada: 'images/curso-webjs-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      mod('c1m1', 'La base de la web', [
        cl('c1m1l1', 'Cómo funciona una página por dentro', '13 min', 'video', true),
        cl('c1m1l2', 'Tu primer HTML: estructura y contenido', '18 min', 'video', false),
        cl('c1m1l3', 'Práctica: maquetá tu tarjeta de presentación', '12 min', 'lectura', false)
      ]),
      mod('c1m2', 'Estilo con CSS', [
        cl('c1m2l1', 'Colores, tipografías y espaciados', '16 min', 'video', false),
        cl('c1m2l2', 'Layout responsive con flexbox', '20 min', 'video', false),
        cl('c1m2l3', 'Checklist: que se vea bien en el celu', '8 min', 'pdf', false)
      ]),
      mod('c1m3', 'Interactividad con JavaScript', [
        cl('c1m3l1', 'Variables, eventos y el DOM sin miedo', '19 min', 'video', false),
        cl('c1m3l2', 'Tu primera funcionalidad interactiva', '17 min', 'video', false),
        cl('c1m3l3', 'Cierre: publicá tu proyecto online', '11 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c2',
    slug: 'react-profesional',
    titulo: 'React profesional: de componentes a producción',
    categoria: 'Programación',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 58900,
    descuento: 0,
    duracion: '12 horas',
    cantidadClases: 9,
    descripcionCorta: 'Dejá de pelearte con React: componentes, estado y buenas prácticas para llevar una app a producción.',
    descripcionCompleta: 'Para quien ya sabe JavaScript y quiere trabajar con React de verdad. Ordenás el pensamiento en componentes, manejás estado sin enredos y armás una app completa lista para desplegar, con los criterios que se usan en equipos reales.',
    resultados: [
      'Pensar una interfaz en componentes reutilizables',
      'Manejar estado y datos sin librerías innecesarias',
      'Desplegar una app React a producción'
    ],
    requisitos: ['Saber lo básico de JavaScript (variables, funciones, arrays)', 'Ganas de armar un proyecto de punta a punta'],
    incluye: ['9 clases grabadas', 'Repositorio del proyecto', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['react', 'javascript', 'frontend', 'componentes', 'programar'],
    docenteId: 'd1',
    portada: 'images/curso-react-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: true,
    modulos: [
      mod('c2m1', 'Pensar en componentes', [
        cl('c2m1l1', 'Qué resuelve React (y qué no)', '14 min', 'video', true),
        cl('c2m1l2', 'Props, composición y reutilización', '19 min', 'video', false),
        cl('c2m1l3', 'Ejercicio: descomponé una pantalla', '10 min', 'lectura', false)
      ]),
      mod('c2m2', 'Estado y datos', [
        cl('c2m2l1', 'useState y useEffect sin sustos', '21 min', 'video', false),
        cl('c2m2l2', 'Consumir una API y mostrar resultados', '18 min', 'video', false),
        cl('c2m2l3', 'Plantilla: estructura de carpetas', '7 min', 'pdf', false)
      ]),
      mod('c2m3', 'Camino a producción', [
        cl('c2m3l1', 'Formularios y validación', '17 min', 'video', false),
        cl('c2m3l2', 'Build y despliegue paso a paso', '16 min', 'video', false),
        cl('c2m3l3', 'Cierre: checklist antes de publicar', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c3',
    slug: 'diseno-ux-ui',
    titulo: 'Diseño UX/UI: de la idea al prototipo',
    categoria: 'Diseño',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 44900,
    descuento: 10,
    duracion: '9 horas',
    cantidadClases: 9,
    descripcionCorta: 'Aprendé a diseñar productos digitales que se entienden solos, desde la investigación hasta el prototipo.',
    descripcionCompleta: 'El diseño no es decorar pantallas: es que la gente logre lo que vino a hacer. Recorrés el proceso completo — entender al usuario, ordenar la información y prototipar — con criterios que podés aplicar a cualquier app o sitio.',
    resultados: [
      'Investigar y entender a quién le diseñás',
      'Ordenar flujos y pantallas con sentido',
      'Armar un prototipo navegable para testear'
    ],
    requisitos: ['No necesitás experiencia previa', 'Una cuenta gratuita de Figma'],
    incluye: ['9 clases grabadas', 'Kit de plantillas', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['ux', 'ui', 'diseño', 'figma', 'producto', 'prototipo'],
    docenteId: 'd2',
    portada: 'images/curso-uxui-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      mod('c3m1', 'Entender antes de diseñar', [
        cl('c3m1l1', 'Qué es UX y por qué importa', '12 min', 'video', true),
        cl('c3m1l2', 'Investigación rápida y realista', '17 min', 'video', false),
        cl('c3m1l3', 'Ejercicio: tu usuario en una ficha', '9 min', 'lectura', false)
      ]),
      mod('c3m2', 'Ordenar la información', [
        cl('c3m2l1', 'Flujos, jerarquía y estructura', '18 min', 'video', false),
        cl('c3m2l2', 'Wireframes: baja fidelidad, alta claridad', '16 min', 'video', false),
        cl('c3m2l3', 'Guía: principios de interfaz', '8 min', 'pdf', false)
      ]),
      mod('c3m3', 'Prototipar y testear', [
        cl('c3m3l1', 'De wireframe a diseño visual', '19 min', 'video', false),
        cl('c3m3l2', 'Prototipo navegable en Figma', '15 min', 'video', false),
        cl('c3m3l3', 'Cierre: test con 3 usuarios', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c4',
    slug: 'figma-equipos-producto',
    titulo: 'Figma para equipos de producto',
    categoria: 'Diseño',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 39900,
    descuento: 0,
    duracion: '7 horas',
    cantidadClases: 9,
    descripcionCorta: 'Trabajá en Figma como en un equipo real: componentes, variables y librerías que escalan.',
    descripcionCompleta: 'Figma es fácil de abrir y difícil de ordenar. Este curso te da el sistema: componentes reutilizables, estilos, variables y una librería compartida para que el diseño no se rompa cuando el proyecto crece.',
    resultados: [
      'Armar componentes y variantes reutilizables',
      'Crear un sistema de estilos y variables',
      'Colaborar en una librería compartida sin romper nada'
    ],
    requisitos: ['Haber usado Figma alguna vez', 'Un proyecto propio para ordenar'],
    incluye: ['9 clases grabadas', 'Archivo base de sistema', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['figma', 'diseño', 'design system', 'ui', 'componentes'],
    docenteId: 'd2',
    portada: 'images/curso-figma-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c4m1', 'Componentes que escalan', [
        cl('c4m1l1', 'Del copiar y pegar a los componentes', '13 min', 'video', true),
        cl('c4m1l2', 'Variantes y propiedades', '18 min', 'video', false),
        cl('c4m1l3', 'Ejercicio: tu botón en 6 estados', '9 min', 'lectura', false)
      ]),
      mod('c4m2', 'Estilos y variables', [
        cl('c4m2l1', 'Color, tipografía y espaciado como sistema', '16 min', 'video', false),
        cl('c4m2l2', 'Variables para temas y tamaños', '17 min', 'video', false),
        cl('c4m2l3', 'Plantilla: tokens base', '7 min', 'pdf', false)
      ]),
      mod('c4m3', 'Trabajo en equipo', [
        cl('c4m3l1', 'Librerías compartidas', '15 min', 'video', false),
        cl('c4m3l2', 'Entregar diseño al equipo de desarrollo', '16 min', 'video', false),
        cl('c4m3l3', 'Cierre: tu mini design system', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c5',
    slug: 'ilustracion-digital-procreate',
    titulo: 'Ilustración digital con Procreate',
    categoria: 'Diseño',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 34900,
    descuento: 20,
    duracion: '8 horas',
    cantidadClases: 9,
    descripcionCorta: 'Dibujá en tu tablet desde cero: trazo, color y composición para crear ilustraciones con estilo propio.',
    descripcionCompleta: 'Ideal para quien siempre quiso dibujar en digital. Empezás por dominar los pinceles y las capas, sumás color y luz, y terminás con ilustraciones completas que reflejan tu estilo, sin necesidad de saber dibujar "bien" al empezar.',
    resultados: [
      'Manejar pinceles, capas y máscaras con soltura',
      'Aplicar color, luz y sombra con intención',
      'Terminar ilustraciones completas con estilo propio'
    ],
    requisitos: ['Una tablet con Procreate (o app similar)', 'Ganas de experimentar sin buscar la perfección'],
    incluye: ['9 clases grabadas', 'Set de pinceles', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['ilustración', 'procreate', 'dibujo', 'arte digital', 'diseño'],
    docenteId: 'd2',
    portada: 'images/curso-ilustracion-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: true,
    modulos: [
      mod('c5m1', 'Domesticar la herramienta', [
        cl('c5m1l1', 'Pinceles, capas y gestos', '14 min', 'video', true),
        cl('c5m1l2', 'Bocetar sin miedo', '16 min', 'video', false),
        cl('c5m1l3', 'Ejercicio: 10 bocetos en 10 minutos', '8 min', 'lectura', false)
      ]),
      mod('c5m2', 'Color y luz', [
        cl('c5m2l1', 'Paletas que funcionan', '17 min', 'video', false),
        cl('c5m2l2', 'Luz, sombra y volumen', '19 min', 'video', false),
        cl('c5m2l3', 'Guía: teoría del color express', '7 min', 'pdf', false)
      ]),
      mod('c5m3', 'Tu estilo', [
        cl('c5m3l1', 'Composición y foco', '15 min', 'video', false),
        cl('c5m3l2', 'Ilustración final paso a paso', '20 min', 'video', false),
        cl('c5m3l3', 'Cierre: armá tu mini serie', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c6',
    slug: 'marketing-digital-negocios',
    titulo: 'Marketing digital para negocios que arrancan',
    categoria: 'Marketing',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 42900,
    descuento: 0,
    duracion: '8 horas',
    cantidadClases: 9,
    descripcionCorta: 'Armá una estrategia digital simple para conseguir clientes, sin perderte entre mil herramientas.',
    descripcionCompleta: 'Para dueños de negocio y emprendedores que quieren vender online. Ordenás tu propuesta, elegís los canales que sí te sirven y armás un plan de contenidos realista que podés sostener sin un equipo detrás.',
    resultados: [
      'Definir tu propuesta y a quién le hablás',
      'Elegir los canales que rinden para tu negocio',
      'Armar un plan de contenidos sostenible'
    ],
    requisitos: ['Tener (o estar por lanzar) un negocio o proyecto', 'No hace falta experiencia en marketing'],
    incluye: ['9 clases grabadas', 'Plantilla de plan mensual', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['marketing', 'redes', 'contenido', 'negocios', 'emprender'],
    docenteId: 'd3',
    portada: 'images/curso-marketing-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      mod('c6m1', 'La base estratégica', [
        cl('c6m1l1', 'Marketing sin humo: qué es y qué no', '13 min', 'video', true),
        cl('c6m1l2', 'Propuesta de valor y público', '18 min', 'video', false),
        cl('c6m1l3', 'Ejercicio: tu mensaje en una frase', '9 min', 'lectura', false)
      ]),
      mod('c6m2', 'Canales y contenido', [
        cl('c6m2l1', 'Qué canal para qué negocio', '16 min', 'video', false),
        cl('c6m2l2', 'Contenido que atrae y no cansa', '17 min', 'video', false),
        cl('c6m2l3', 'Plantilla: calendario de contenidos', '7 min', 'pdf', false)
      ]),
      mod('c6m3', 'Medir y sostener', [
        cl('c6m3l1', 'Métricas que importan de verdad', '15 min', 'video', false),
        cl('c6m3l2', 'Rutina semanal de marketing', '14 min', 'video', false),
        cl('c6m3l3', 'Cierre: tu plan de 90 días', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c7',
    slug: 'meta-instagram-ads',
    titulo: 'Publicidad en Meta e Instagram Ads',
    categoria: 'Marketing',
    nivel: 'Intermedio',
    modalidad: 'En vivo',
    precio: 52900,
    descuento: 0,
    duracion: '6 semanas',
    cantidadClases: 9,
    descripcionCorta: 'Cohorte en vivo para crear, medir y optimizar campañas en Instagram y Facebook sin quemar presupuesto.',
    descripcionCompleta: 'Un programa en vivo por cohortes para aprender a pautar con criterio. Configurás el administrador de anuncios, armás campañas por objetivo, leés las métricas y optimizás. La próxima cohorte y los cupos se coordinan por WhatsApp.',
    resultados: [
      'Configurar campañas por objetivo desde el administrador',
      'Segmentar y crear anuncios que convierten',
      'Leer métricas y optimizar sin desperdiciar presupuesto'
    ],
    requisitos: ['Manejar redes a nivel usuario', 'Una cuenta comercial (o ganas de crearla)'],
    incluye: ['Encuentros en vivo por cohorte', 'Grabaciones de cada clase', 'Certificado de finalización propio', 'Espacio de consultas'],
    etiquetas: ['ads', 'publicidad', 'meta', 'instagram', 'marketing', 'en vivo', 'cohorte'],
    docenteId: 'd3',
    portada: 'images/curso-ads-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c7m1', 'Cimientos de la pauta', [
        cl('c7m1l1', 'Cómo funciona el sistema de anuncios', '15 min', 'video', true),
        cl('c7m1l2', 'Administrador de anuncios sin perderte', '19 min', 'video', false),
        cl('c7m1l3', 'Ejercicio: definí tu objetivo', '9 min', 'lectura', false)
      ]),
      mod('c7m2', 'Campañas y creatividades', [
        cl('c7m2l1', 'Estructura de campaña por objetivo', '18 min', 'video', false),
        cl('c7m2l2', 'Segmentación y públicos', '17 min', 'video', false),
        cl('c7m2l3', 'Guía: anatomía de un buen anuncio', '8 min', 'pdf', false)
      ]),
      mod('c7m3', 'Medir y escalar', [
        cl('c7m3l1', 'Métricas y lectura de resultados', '16 min', 'video', false),
        cl('c7m3l2', 'Optimización y escalado', '18 min', 'video', false),
        cl('c7m3l3', 'Cierre: plan de pauta mensual', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c8',
    slug: 'finanzas-personales',
    titulo: 'Finanzas personales: ordená tu plata',
    categoria: 'Finanzas',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 33900,
    descuento: 0,
    duracion: '5 horas',
    cantidadClases: 9,
    descripcionCorta: 'Un método claro para saber en qué se te va la plata, armar un presupuesto real y empezar a ahorrar.',
    descripcionCompleta: 'Curso educativo de finanzas personales. Ordenás tus ingresos y gastos, armás un presupuesto que puedas sostener y creás un fondo de emergencia. No es asesoramiento de inversión: es poner tu economía diaria en orden.',
    resultados: [
      'Saber exactamente en qué se te va la plata',
      'Armar un presupuesto mensual realista',
      'Empezar tu fondo de emergencia'
    ],
    requisitos: ['No necesitás conocimientos previos', 'Tus movimientos reales del último mes'],
    incluye: ['9 clases grabadas', 'Planilla de presupuesto', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['finanzas', 'presupuesto', 'ahorro', 'plata', 'educación financiera'],
    docenteId: 'd4',
    portada: 'images/curso-finanzas-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c8m1', 'Diagnóstico', [
        cl('c8m1l1', 'La foto real de tu economía', '12 min', 'video', true),
        cl('c8m1l2', 'Registrar gastos sin volverte loco', '15 min', 'video', false),
        cl('c8m1l3', 'Ejercicio: tu mapa de gastos', '9 min', 'lectura', false)
      ]),
      mod('c8m2', 'El presupuesto', [
        cl('c8m2l1', 'Un presupuesto que puedas sostener', '16 min', 'video', false),
        cl('c8m2l2', 'Ordenar deudas con cabeza', '17 min', 'video', false),
        cl('c8m2l3', 'Planilla: presupuesto mensual', '7 min', 'pdf', false)
      ]),
      mod('c8m3', 'Colchón y hábitos', [
        cl('c8m3l1', 'Fondo de emergencia paso a paso', '14 min', 'video', false),
        cl('c8m3l2', 'Automatizar el ahorro', '13 min', 'video', false),
        cl('c8m3l3', 'Cierre: tu plan de 6 meses', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c9',
    slug: 'introduccion-inversion',
    titulo: 'Introducción a la inversión (educativa)',
    categoria: 'Finanzas',
    nivel: 'Intermedio',
    modalidad: 'Híbrido',
    precio: 47900,
    descuento: 10,
    duracion: '7 horas',
    cantidadClases: 9,
    descripcionCorta: 'Entendé los conceptos básicos de inversión para tomar decisiones informadas. Contenido educativo, sin recomendaciones.',
    descripcionCompleta: 'Un curso para entender el vocabulario y los conceptos de la inversión: riesgo, diversificación, plazos y tipos de instrumentos. Es material educativo y general: no constituye asesoramiento financiero ni recomienda dónde poner tu dinero.',
    resultados: [
      'Entender riesgo, rendimiento y diversificación',
      'Diferenciar tipos de instrumentos y plazos',
      'Hacer las preguntas correctas antes de decidir'
    ],
    requisitos: ['Tener tus finanzas personales ordenadas', 'Criterio para distinguir educación de promesas'],
    incluye: ['9 clases (grabadas + un encuentro en vivo)', 'Glosario descargable', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['inversión', 'finanzas', 'riesgo', 'educación financiera', 'economía'],
    docenteId: 'd4',
    portada: 'images/curso-inversion-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c9m1', 'El mapa', [
        cl('c9m1l1', 'Antes de invertir: la letra chica', '13 min', 'video', true),
        cl('c9m1l2', 'Riesgo y rendimiento van juntos', '17 min', 'video', false),
        cl('c9m1l3', 'Ejercicio: tu perfil y tus plazos', '9 min', 'lectura', false)
      ]),
      mod('c9m2', 'Instrumentos', [
        cl('c9m2l1', 'Tipos de instrumentos, en criollo', '18 min', 'video', false),
        cl('c9m2l2', 'Diversificación: no poner todo junto', '16 min', 'video', false),
        cl('c9m2l3', 'Glosario: términos clave', '8 min', 'pdf', false)
      ]),
      mod('c9m3', 'Decidir con criterio', [
        cl('c9m3l1', 'Costos, comisiones y letra chica', '15 min', 'video', false),
        cl('c9m3l2', 'Detectar promesas demasiado buenas', '14 min', 'video', false),
        cl('c9m3l3', 'Cierre: tu checklist de decisión', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c10',
    slug: 'fotografia-con-celular',
    titulo: 'Fotografía con celular: fotos que se notan',
    categoria: 'Fotografía',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 29900,
    descuento: 0,
    duracion: '5 horas',
    cantidadClases: 9,
    descripcionCorta: 'Sacá mejores fotos con el celular que ya tenés: luz, composición y edición sin equipo caro.',
    descripcionCompleta: 'La mejor cámara es la que tenés en el bolsillo. Aprendés a mirar la luz, componer con intención y editar con apps gratuitas para que tus fotos —de producto, viajes o el día a día— den un salto real.',
    resultados: [
      'Usar la luz natural a tu favor',
      'Componer fotos con intención',
      'Editar en el celu sin arruinar la imagen'
    ],
    requisitos: ['Un celular con cámara', 'Ganas de salir a practicar'],
    incluye: ['9 clases grabadas', 'Presets de edición', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['fotografía', 'celular', 'edición', 'composición', 'luz'],
    docenteId: 'd5',
    portada: 'images/curso-fotocel-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      mod('c10m1', 'La mirada', [
        cl('c10m1l1', 'Ver la luz antes que la escena', '12 min', 'video', true),
        cl('c10m1l2', 'Composición: reglas y cuándo romperlas', '16 min', 'video', false),
        cl('c10m1l3', 'Salida de práctica: 15 fotos', '9 min', 'lectura', false)
      ]),
      mod('c10m2', 'Dominar el celu', [
        cl('c10m2l1', 'Ajustes manuales del celular', '15 min', 'video', false),
        cl('c10m2l2', 'Retrato, producto y paisaje', '17 min', 'video', false),
        cl('c10m2l3', 'Guía: setup rápido por situación', '7 min', 'pdf', false)
      ]),
      mod('c10m3', 'Edición', [
        cl('c10m3l1', 'Editar sin exagerar', '14 min', 'video', false),
        cl('c10m3l2', 'Presets y flujo rápido', '13 min', 'video', false),
        cl('c10m3l3', 'Cierre: armá tu porfolio de 10', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c11',
    slug: 'edicion-color-lightroom',
    titulo: 'Edición y color en Lightroom',
    categoria: 'Fotografía',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 38900,
    descuento: 0,
    duracion: '6 horas',
    cantidadClases: 9,
    descripcionCorta: 'Llevá tus fotos a otro nivel con un flujo de edición profesional y color coherente en Lightroom.',
    descripcionCompleta: 'Para quien ya saca fotos y quiere una edición con identidad. Ordenás tu catálogo, dominás los reveladores clave y creás tu propio estilo de color con presets reutilizables, para editar rápido y parejo.',
    resultados: [
      'Ordenar y catalogar tus fotos',
      'Dominar exposición, color y detalle',
      'Crear presets con tu estilo propio'
    ],
    requisitos: ['Sacar fotos con cierta frecuencia', 'Lightroom (versión de prueba sirve)'],
    incluye: ['9 clases grabadas', 'Fotos RAW de práctica', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['lightroom', 'edición', 'color', 'fotografía', 'presets'],
    docenteId: 'd5',
    portada: 'images/curso-lightroom-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c11m1', 'Orden y base', [
        cl('c11m1l1', 'Catálogo y flujo de trabajo', '13 min', 'video', true),
        cl('c11m1l2', 'Exposición y tono base', '17 min', 'video', false),
        cl('c11m1l3', 'Ejercicio: revelá tu primera RAW', '9 min', 'lectura', false)
      ]),
      mod('c11m2', 'Color con identidad', [
        cl('c11m2l1', 'Balance de blancos y temperatura', '16 min', 'video', false),
        cl('c11m2l2', 'Mezcla de color y HSL', '18 min', 'video', false),
        cl('c11m2l3', 'Guía: rueda de color', '7 min', 'pdf', false)
      ]),
      mod('c11m3', 'Tu estilo repetible', [
        cl('c11m3l1', 'Curvas y contraste con intención', '15 min', 'video', false),
        cl('c11m3l2', 'Crear y aplicar presets', '14 min', 'video', false),
        cl('c11m3l3', 'Cierre: editá una serie pareja', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c12',
    slug: 'ingles-para-el-trabajo',
    titulo: 'Inglés para el trabajo: reuniones y mails',
    categoria: 'Idiomas',
    nivel: 'Inicial',
    modalidad: 'En vivo',
    precio: 49900,
    descuento: 0,
    duracion: '8 semanas',
    cantidadClases: 9,
    descripcionCorta: 'Cohorte en vivo para desenvolverte en inglés en el trabajo: reuniones, mails y presentaciones.',
    descripcionCompleta: 'Programa en vivo con práctica de conversación desde el primer encuentro. Trabajás las situaciones reales del trabajo: participar en reuniones, escribir mails claros y hacer una presentación. Cupos y próxima cohorte se coordinan por WhatsApp.',
    resultados: [
      'Participar en una reunión sin trabarte',
      'Escribir mails de trabajo claros y correctos',
      'Presentar una idea en inglés con seguridad'
    ],
    requisitos: ['Nivel básico de inglés (entendés lo esencial)', 'Disponibilidad para los encuentros en vivo'],
    incluye: ['Encuentros en vivo por cohorte', 'Material de práctica', 'Certificado de finalización propio', 'Correcciones personalizadas'],
    etiquetas: ['inglés', 'idiomas', 'trabajo', 'conversación', 'en vivo', 'cohorte'],
    docenteId: 'd6',
    portada: 'images/curso-ingles-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: true,
    modulos: [
      mod('c12m1', 'Romper el hielo', [
        cl('c12m1l1', 'Presentarte y sostener una charla', '14 min', 'video', true),
        cl('c12m1l2', 'Frases que te salvan en la reunión', '17 min', 'video', false),
        cl('c12m1l3', 'Práctica: tu presentación de 60 segundos', '9 min', 'lectura', false)
      ]),
      mod('c12m2', 'Comunicación escrita', [
        cl('c12m2l1', 'Mails claros y correctos', '16 min', 'video', false),
        cl('c12m2l2', 'Pedir, responder y acordar', '15 min', 'video', false),
        cl('c12m2l3', 'Plantillas: mails frecuentes', '7 min', 'pdf', false)
      ]),
      mod('c12m3', 'Hablar en público', [
        cl('c12m3l1', 'Estructurar una presentación', '16 min', 'video', false),
        cl('c12m3l2', 'Responder preguntas en vivo', '14 min', 'video', false),
        cl('c12m3l3', 'Cierre: presentá tu proyecto', '11 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c13',
    slug: 'mindfulness-dia-a-dia',
    titulo: 'Mindfulness para el día a día',
    categoria: 'Bienestar',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 27900,
    descuento: 0,
    duracion: '4 horas',
    cantidadClases: 9,
    descripcionCorta: 'Prácticas cortas de atención plena para bajar el ruido mental y estar más presente, sin misticismo.',
    descripcionCompleta: 'Un curso práctico y laico de mindfulness. Aprendés ejercicios breves para sostener la atención, registrar el estrés y volver al presente. Es un complemento para tu bienestar y no reemplaza tratamientos ni terapias de salud.',
    resultados: [
      'Incorporar pausas de atención en tu día',
      'Registrar el estrés antes de que te desborde',
      'Sostener una práctica breve y realista'
    ],
    requisitos: ['No necesitás experiencia previa', 'Un lugar tranquilo, aunque sean 5 minutos'],
    incluye: ['9 clases grabadas', 'Audios de práctica guiada', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['mindfulness', 'bienestar', 'atención plena', 'estrés', 'meditación'],
    docenteId: 'd7',
    portada: 'images/curso-mindfulness-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c13m1', 'Primeros pasos', [
        cl('c13m1l1', 'Qué es (y qué no es) el mindfulness', '11 min', 'video', true),
        cl('c13m1l2', 'La respiración como ancla', '13 min', 'audio', false),
        cl('c13m1l3', 'Ejercicio: 3 pausas en tu día', '8 min', 'lectura', false)
      ]),
      mod('c13m2', 'Atención en movimiento', [
        cl('c13m2l1', 'Comer, caminar y escuchar con atención', '14 min', 'audio', false),
        cl('c13m2l2', 'Registrar el estrés a tiempo', '15 min', 'video', false),
        cl('c13m2l3', 'Guía: práctica de 5 minutos', '7 min', 'pdf', false)
      ]),
      mod('c13m3', 'Sostenerlo', [
        cl('c13m3l1', 'Cuando la mente se dispersa', '13 min', 'video', false),
        cl('c13m3l2', 'Armar tu rutina realista', '12 min', 'audio', false),
        cl('c13m3l3', 'Cierre: tu plan de 21 días', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c14',
    slug: 'habitos-y-descanso',
    titulo: 'Hábitos y descanso: energía sostenible',
    categoria: 'Bienestar',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 26900,
    descuento: 15,
    duracion: '4 horas',
    cantidadClases: 9,
    descripcionCorta: 'Construí hábitos que se sostienen y mejorá tu descanso para tener energía pareja toda la semana.',
    descripcionCompleta: 'Curso práctico para ordenar tu energía. Entendés cómo se forman los hábitos, diseñás rutinas chicas que sí se sostienen y mejorás tu descanso. Es contenido educativo de bienestar, no un tratamiento médico.',
    resultados: [
      'Diseñar hábitos que se sostienen en el tiempo',
      'Mejorar la calidad de tu descanso',
      'Recuperar energía pareja durante la semana'
    ],
    requisitos: ['No necesitás experiencia previa', 'Ganas de probar cambios chicos'],
    incluye: ['9 clases grabadas', 'Tracker de hábitos', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['hábitos', 'descanso', 'sueño', 'energía', 'bienestar'],
    docenteId: 'd7',
    portada: 'images/curso-habitos-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c14m1', 'Cómo se forman los hábitos', [
        cl('c14m1l1', 'El circuito del hábito, sin mitos', '12 min', 'video', true),
        cl('c14m1l2', 'Empezar chico para sostener', '15 min', 'video', false),
        cl('c14m1l3', 'Ejercicio: elegí tu primer hábito', '9 min', 'lectura', false)
      ]),
      mod('c14m2', 'Descanso', [
        cl('c14m2l1', 'Higiene del sueño en serio', '16 min', 'video', false),
        cl('c14m2l2', 'Pantallas, cafeína y rutinas', '14 min', 'video', false),
        cl('c14m2l3', 'Guía: tu ritual de descanso', '7 min', 'pdf', false)
      ]),
      mod('c14m3', 'Energía pareja', [
        cl('c14m3l1', 'Movimiento y pausas activas', '13 min', 'video', false),
        cl('c14m3l2', 'Cuando el hábito se cae', '12 min', 'video', false),
        cl('c14m3l3', 'Cierre: tu semana tipo', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c15',
    slug: 'excel-de-cero-a-analista',
    titulo: 'Excel de cero a analista',
    categoria: 'Data',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 35900,
    descuento: 0,
    duracion: '9 horas',
    cantidadClases: 9,
    descripcionCorta: 'Pasá de mirar planillas a entenderlas: fórmulas, tablas dinámicas y gráficos que comunican.',
    descripcionCompleta: 'Excel es la herramienta más pedida y la más subestimada. Arrancás desde cero y terminás resolviendo casos reales: fórmulas útiles, tablas dinámicas y gráficos claros para transformar datos en decisiones.',
    resultados: [
      'Dominar las fórmulas que más se usan',
      'Resumir datos con tablas dinámicas',
      'Comunicar con gráficos claros'
    ],
    requisitos: ['No necesitás experiencia previa', 'Excel o Google Sheets'],
    incluye: ['9 clases grabadas', 'Planillas de práctica', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['excel', 'planillas', 'datos', 'tablas dinámicas', 'analista'],
    docenteId: 'd8',
    portada: 'images/curso-excel-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      mod('c15m1', 'Fundamentos útiles', [
        cl('c15m1l1', 'Ordená una planilla como la gente', '13 min', 'video', true),
        cl('c15m1l2', 'Fórmulas que resuelven el 80%', '19 min', 'video', false),
        cl('c15m1l3', 'Ejercicio: limpiá un dataset', '9 min', 'lectura', false)
      ]),
      mod('c15m2', 'Análisis', [
        cl('c15m2l1', 'Tablas dinámicas sin miedo', '18 min', 'video', false),
        cl('c15m2l2', 'Buscar y cruzar datos', '17 min', 'video', false),
        cl('c15m2l3', 'Guía: funciones esenciales', '8 min', 'pdf', false)
      ]),
      mod('c15m3', 'Comunicar', [
        cl('c15m3l1', 'Gráficos que se entienden', '15 min', 'video', false),
        cl('c15m3l2', 'Un mini tablero de indicadores', '16 min', 'video', false),
        cl('c15m3l3', 'Cierre: presentá tus datos', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c16',
    slug: 'analisis-datos-python',
    titulo: 'Análisis de datos con Python',
    categoria: 'Data',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 56900,
    descuento: 10,
    duracion: '12 horas',
    cantidadClases: 9,
    descripcionCorta: 'Analizá datos reales con Python y pandas: de la planilla al insight, con gráficos que cuentan una historia.',
    descripcionCompleta: 'Para quien ya se anima a Excel y quiere dar el salto. Aprendés Python enfocado en datos: cargar, limpiar y analizar con pandas, y visualizar resultados. Trabajás con datasets reales de principio a fin.',
    resultados: [
      'Cargar y limpiar datos con pandas',
      'Analizar y responder preguntas con código',
      'Visualizar resultados que se entienden'
    ],
    requisitos: ['Manejar Excel a nivel intermedio', 'No hace falta saber programar'],
    incluye: ['9 clases grabadas', 'Notebooks y datasets', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['python', 'datos', 'pandas', 'análisis', 'data'],
    docenteId: 'd8',
    portada: 'images/curso-python-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      mod('c16m1', 'Python para datos', [
        cl('c16m1l1', 'Por qué Python para análisis', '14 min', 'video', true),
        cl('c16m1l2', 'Lo justo de Python para arrancar', '20 min', 'video', false),
        cl('c16m1l3', 'Ejercicio: tu primer script', '10 min', 'lectura', false)
      ]),
      mod('c16m2', 'Manejar datos con pandas', [
        cl('c16m2l1', 'Cargar, limpiar y transformar', '21 min', 'video', false),
        cl('c16m2l2', 'Agrupar y responder preguntas', '18 min', 'video', false),
        cl('c16m2l3', 'Notebook: dataset guiado', '8 min', 'pdf', false)
      ]),
      mod('c16m3', 'Contar la historia', [
        cl('c16m3l1', 'Visualización con intención', '17 min', 'video', false),
        cl('c16m3l2', 'Un análisis completo de punta a punta', '19 min', 'video', false),
        cl('c16m3l3', 'Cierre: presentá tus hallazgos', '11 min', 'lectura', false)
      ])
    ]
  }
];

/* Banners promocionales: vacío = no se renderiza nada.
   Para activar, sumar objetos { imagen, alt, destino, vigencia } con ratio ~2.8:1. */
const BANNERS = [];
