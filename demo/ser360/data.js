const WHATSAPP = '5491158376130';
const INSTAGRAM = 'https://www.instagram.com/institutoser360';

const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Carolina Méndez',
    rol: 'Formadora en comunicación',
    bio: 'Acompaña a profesionales que necesitan presentar ideas con claridad: reuniones, pitches y equipos. Diseña las prácticas de oratoria y escucha del instituto.',
    foto: 'images/docente-carolina-1000x1000.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd2',
    nombre: 'Martín Aguirre',
    rol: 'Coach de equipos y productividad',
    bio: 'Trabaja con líderes primerizos y equipos chicos que crecen rápido. Sus clases bajan la teoría a rutinas concretas de semana laboral.',
    foto: 'images/docente-martin-1000x1000.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd3',
    nombre: 'Lucía Ferrer',
    rol: 'Consultora de carrera',
    bio: 'Ayuda a ordenar el recorrido profesional: qué mostrar, dónde y cómo. Coordina el curso de marca personal y las revisiones de perfil.',
    foto: 'images/docente-lucia-1000x1000.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  }
];

const CURSOS = [
  {
    id: 'c1',
    slug: 'comunicacion-efectiva',
    titulo: 'Comunicación efectiva: hablá para que te escuchen',
    categoria: 'Comunicación',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 38500,
    descuento: 0,
    duracion: '6 horas',
    cantidadClases: 9,
    descripcionCorta: 'Presentá ideas con claridad en reuniones, entrevistas y equipos, sin depender de la improvisación.',
    descripcionCompleta: 'Un recorrido práctico para dejar de dar vueltas al hablar: estructura de mensajes, manejo de nervios y escucha activa. Cada módulo termina con una práctica corta que podés aplicar al día siguiente en tu trabajo.',
    resultados: [
      'Armar un mensaje claro en menos de 5 minutos de preparación',
      'Sostener una presentación de 10 minutos sin leer diapositivas',
      'Responder preguntas difíciles sin perder el eje'
    ],
    requisitos: ['No necesitás experiencia previa', 'Una situación real donde quieras comunicar mejor'],
    incluye: ['9 clases grabadas', 'Guías de práctica descargables', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['oratoria', 'presentaciones', 'escucha'],
    docenteId: 'd1',
    portada: 'images/curso-oratoria-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      {
        id: 'c1m1',
        titulo: 'El mensaje antes que los nervios',
        clases: [
          { id: 'c1m1l1', titulo: 'Por qué no te escuchan (y qué cambiar primero)', duracion: '12 min', tipo: 'video', preview: true },
          { id: 'c1m1l2', titulo: 'La estructura de 3 pasos para cualquier mensaje', duracion: '18 min', tipo: 'video', preview: false },
          { id: 'c1m1l3', titulo: 'Práctica: tu mensaje en una servilleta', duracion: '10 min', tipo: 'lectura', preview: false }
        ]
      },
      {
        id: 'c1m2',
        titulo: 'Presencia y voz',
        clases: [
          { id: 'c1m2l1', titulo: 'Nervios: qué hacer con las manos y la respiración', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c1m2l2', titulo: 'Ritmo, pausas y énfasis', duracion: '14 min', tipo: 'video', preview: false },
          { id: 'c1m2l3', titulo: 'Checklist para antes de presentar', duracion: '8 min', tipo: 'pdf', preview: false }
        ]
      },
      {
        id: 'c1m3',
        titulo: 'Conversaciones que importan',
        clases: [
          { id: 'c1m3l1', titulo: 'Escucha activa sin caras de póker', duracion: '13 min', tipo: 'video', preview: false },
          { id: 'c1m3l2', titulo: 'Cómo responder preguntas incómodas', duracion: '16 min', tipo: 'video', preview: false },
          { id: 'c1m3l3', titulo: 'Cierre: tu plan de práctica de 30 días', duracion: '9 min', tipo: 'lectura', preview: false }
        ]
      }
    ]
  },
  {
    id: 'c2',
    slug: 'liderazgo-de-equipos',
    titulo: 'Liderazgo de equipos: del control a la confianza',
    categoria: 'Liderazgo',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 45900,
    descuento: 15,
    duracion: '8 horas',
    cantidadClases: 9,
    descripcionCorta: 'Para quienes pasaron de hacer a coordinar: delegar, dar feedback y sostener acuerdos sin microgestionar.',
    descripcionCompleta: 'El salto de colaborador a líder no viene con manual. Este curso ordena las tres conversaciones que definen a un equipo — expectativas, feedback y correcciones — y te da herramientas para delegar sin perder calidad ni control.',
    resultados: [
      'Delegar tareas con acuerdos claros y seguimiento liviano',
      'Dar feedback específico sin que la conversación se vuelva personal',
      'Preparar y conducir reuniones 1 a 1 que la gente no quiera cancelar'
    ],
    requisitos: ['Estar coordinando personas o por asumir ese rol', 'Ganas de revisar tu propio estilo'],
    incluye: ['9 clases grabadas', 'Plantillas de 1 a 1 y feedback', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['equipos', 'feedback', 'delegar'],
    docenteId: 'd2',
    portada: 'images/curso-liderazgo-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      {
        id: 'c2m1',
        titulo: 'El rol que nadie te explicó',
        clases: [
          { id: 'c2m1l1', titulo: 'De hacer a lograr que se haga', duracion: '14 min', tipo: 'video', preview: true },
          { id: 'c2m1l2', titulo: 'Expectativas explícitas: el acuerdo base', duracion: '17 min', tipo: 'video', preview: false },
          { id: 'c2m1l3', titulo: 'Autodiagnóstico: tu estilo hoy', duracion: '10 min', tipo: 'lectura', preview: false }
        ]
      },
      {
        id: 'c2m2',
        titulo: 'Delegar de verdad',
        clases: [
          { id: 'c2m2l1', titulo: 'Qué delegar, a quién y con qué margen', duracion: '16 min', tipo: 'video', preview: false },
          { id: 'c2m2l2', titulo: 'Seguimiento sin microgestión', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c2m2l3', titulo: 'Plantilla: acuerdo de delegación', duracion: '7 min', tipo: 'pdf', preview: false }
        ]
      },
      {
        id: 'c2m3',
        titulo: 'Conversaciones de equipo',
        clases: [
          { id: 'c2m3l1', titulo: 'Feedback que se puede escuchar', duracion: '18 min', tipo: 'video', preview: false },
          { id: 'c2m3l2', titulo: 'La reunión 1 a 1 que funciona', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c2m3l3', titulo: 'Cierre: tu tablero de equipo', duracion: '11 min', tipo: 'lectura', preview: false }
        ]
      }
    ]
  },
  {
    id: 'c3',
    slug: 'gestion-del-tiempo',
    titulo: 'Gestión del tiempo: semanas que rinden',
    categoria: 'Productividad',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 32900,
    descuento: 0,
    duracion: '5 horas',
    cantidadClases: 9,
    descripcionCorta: 'Un sistema simple para planificar la semana, cortar con la urgencia permanente y terminar lo importante.',
    descripcionCompleta: 'No es una app ni una lista más larga: es un método de planificación semanal que distingue lo urgente de lo importante y protege bloques de trabajo profundo. Salís con tu propia semana tipo armada.',
    resultados: [
      'Planificar la semana en 20 minutos cada lunes',
      'Proteger al menos 2 bloques de trabajo profundo por semana',
      'Decir que no (o que después) sin culpa ni conflicto'
    ],
    requisitos: ['No necesitás experiencia previa', 'Tu calendario real de las últimas 2 semanas'],
    incluye: ['9 clases grabadas', 'Plantilla de semana tipo', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['organización', 'foco', 'planificación'],
    docenteId: 'd2',
    portada: 'images/curso-productividad-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: false,
    modulos: [
      {
        id: 'c3m1',
        titulo: 'Diagnóstico de tu semana',
        clases: [
          { id: 'c3m1l1', titulo: 'A dónde se va tu tiempo (auditoría express)', duracion: '11 min', tipo: 'video', preview: true },
          { id: 'c3m1l2', titulo: 'Urgente vs. importante en la práctica', duracion: '14 min', tipo: 'video', preview: false },
          { id: 'c3m1l3', titulo: 'Ejercicio: tu mapa de fugas', duracion: '9 min', tipo: 'lectura', preview: false }
        ]
      },
      {
        id: 'c3m2',
        titulo: 'El sistema semanal',
        clases: [
          { id: 'c3m2l1', titulo: 'La revisión de los lunes en 20 minutos', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c3m2l2', titulo: 'Bloques de foco: cómo defenderlos', duracion: '13 min', tipo: 'video', preview: false },
          { id: 'c3m2l3', titulo: 'Plantilla: tu semana tipo', duracion: '6 min', tipo: 'pdf', preview: false }
        ]
      },
      {
        id: 'c3m3',
        titulo: 'Sostenerlo en el tiempo',
        clases: [
          { id: 'c3m3l1', titulo: 'Interrupciones, chat y reuniones', duracion: '14 min', tipo: 'video', preview: false },
          { id: 'c3m3l2', titulo: 'Qué hacer cuando la semana explota', duracion: '12 min', tipo: 'video', preview: false },
          { id: 'c3m3l3', titulo: 'Cierre: tu acuerdo con vos', duracion: '8 min', tipo: 'lectura', preview: false }
        ]
      }
    ]
  },
  {
    id: 'c4',
    slug: 'inteligencia-emocional',
    titulo: 'Inteligencia emocional para el trabajo',
    categoria: 'Desarrollo personal',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 36400,
    descuento: 0,
    duracion: '6 horas',
    cantidadClases: 9,
    descripcionCorta: 'Reconocé lo que te pasa antes de reaccionar: emociones, límites y conversaciones difíciles sin desborde.',
    descripcionCompleta: 'Las habilidades técnicas te consiguen el puesto; las emocionales lo sostienen. Este curso entrena tres músculos: registrar lo que sentís, regular la reacción y responder con criterio — en el trabajo y fuera de él.',
    resultados: [
      'Identificar tus disparadores antes de que te manejen',
      'Poner límites claros sin escalar el conflicto',
      'Atravesar conversaciones difíciles con un guion propio'
    ],
    requisitos: ['No necesitás experiencia previa', 'Disposición para observarte con honestidad'],
    incluye: ['9 clases grabadas', 'Diario de registro emocional', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['emociones', 'límites', 'autoconocimiento'],
    docenteId: 'd1',
    portada: 'images/curso-emocional-1600x1200.jpg',
    trailer: null,
    destacado: true,
    nuevo: false,
    modulos: [
      {
        id: 'c4m1',
        titulo: 'Registrar antes de reaccionar',
        clases: [
          { id: 'c4m1l1', titulo: 'Qué es (y qué no es) la inteligencia emocional', duracion: '12 min', tipo: 'video', preview: true },
          { id: 'c4m1l2', titulo: 'Tus disparadores en el trabajo', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c4m1l3', titulo: 'Ejercicio: el diario de 7 días', duracion: '8 min', tipo: 'lectura', preview: false }
        ]
      },
      {
        id: 'c4m2',
        titulo: 'Regular sin reprimir',
        clases: [
          { id: 'c4m2l1', titulo: 'La pausa de 90 segundos', duracion: '13 min', tipo: 'video', preview: false },
          { id: 'c4m2l2', titulo: 'Límites: decirlo a tiempo y sin vueltas', duracion: '16 min', tipo: 'video', preview: false },
          { id: 'c4m2l3', titulo: 'Guía: frases para poner límites', duracion: '7 min', tipo: 'pdf', preview: false }
        ]
      },
      {
        id: 'c4m3',
        titulo: 'Conversaciones difíciles',
        clases: [
          { id: 'c4m3l1', titulo: 'Preparar la conversación que venís evitando', duracion: '17 min', tipo: 'video', preview: false },
          { id: 'c4m3l2', titulo: 'Sostener el desacuerdo sin romper el vínculo', duracion: '14 min', tipo: 'video', preview: false },
          { id: 'c4m3l3', titulo: 'Cierre: tu protocolo personal', duracion: '9 min', tipo: 'lectura', preview: false }
        ]
      }
    ]
  },
  {
    id: 'c5',
    slug: 'marca-personal',
    titulo: 'Marca personal: que tu trabajo hable de vos',
    categoria: 'Carrera',
    nivel: 'Intermedio',
    modalidad: 'Grabado',
    precio: 41800,
    descuento: 10,
    duracion: '7 horas',
    cantidadClases: 9,
    descripcionCorta: 'Ordená tu perfil, tu portfolio y tu red para que las oportunidades te encuentren trabajando.',
    descripcionCompleta: 'Marca personal no es hacerse influencer: es que quien te busca encuentre una historia clara y consistente. Revisás tu perfil, definís tu posicionamiento y armás un plan de visibilidad realista para tu semana.',
    resultados: [
      'Reescribir tu perfil profesional con un posicionamiento claro',
      'Armar un portfolio o caso que muestre cómo trabajás',
      'Definir un plan de visibilidad de 1 hora semanal'
    ],
    requisitos: ['Experiencia laboral o proyectos propios para mostrar', 'Un perfil de LinkedIn creado (aunque esté abandonado)'],
    incluye: ['9 clases grabadas', 'Checklist de perfil profesional', 'Certificado de finalización propio', 'Acceso sin vencimiento'],
    etiquetas: ['empleabilidad', 'linkedin', 'portfolio'],
    docenteId: 'd3',
    portada: 'images/curso-marca-1600x1200.jpg',
    trailer: null,
    destacado: false,
    nuevo: true,
    modulos: [
      {
        id: 'c5m1',
        titulo: 'Tu posicionamiento',
        clases: [
          { id: 'c5m1l1', titulo: 'Qué es marca personal (sin humo)', duracion: '13 min', tipo: 'video', preview: true },
          { id: 'c5m1l2', titulo: 'El cruce: lo que sabés, lo que te piden, lo que querés', duracion: '16 min', tipo: 'video', preview: false },
          { id: 'c5m1l3', titulo: 'Ejercicio: tu frase de posicionamiento', duracion: '9 min', tipo: 'lectura', preview: false }
        ]
      },
      {
        id: 'c5m2',
        titulo: 'Perfil y portfolio',
        clases: [
          { id: 'c5m2l1', titulo: 'LinkedIn: titular, acerca de y experiencia', duracion: '18 min', tipo: 'video', preview: false },
          { id: 'c5m2l2', titulo: 'El caso de trabajo: mostrar cómo pensás', duracion: '15 min', tipo: 'video', preview: false },
          { id: 'c5m2l3', titulo: 'Checklist: perfil completo', duracion: '6 min', tipo: 'pdf', preview: false }
        ]
      },
      {
        id: 'c5m3',
        titulo: 'Visibilidad sostenible',
        clases: [
          { id: 'c5m3l1', titulo: 'Qué publicar cuando no sabés qué publicar', duracion: '14 min', tipo: 'video', preview: false },
          { id: 'c5m3l2', titulo: 'Red de contactos sin spam', duracion: '13 min', tipo: 'video', preview: false },
          { id: 'c5m3l3', titulo: 'Cierre: tu plan de 1 hora semanal', duracion: '8 min', tipo: 'lectura', preview: false }
        ]
      }
    ]
  }
];

const BANNERS = [];
