/* LOGRAR — Entidad Formadora
   Formación profesional. Datos demostrativos: cursos, docentes y contenido
   hardcodeados. El catálogo, carrito, aula y progreso funcionan con localStorage. */

const WHATSAPP = '5493813240796';
const INSTAGRAM = 'https://www.instagram.com/lograr.oficial';

/* Docentes: perfiles demostrativos. Los datos reales se cargan con la info de cada docente. */
const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Gabriela Ontivero',
    rol: 'Contadora Pública',
    area: 'Administración',
    bio: 'Trabaja en administración y contabilidad de pymes desde hace más de una década. Sus clases bajan la teoría contable a la tarea diaria de una oficina real.',
    foto: 'images/docente-gabriela-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd2',
    nombre: 'Hernán Rivas',
    rol: 'Lic. en Comercialización',
    area: 'Ventas y Marketing',
    bio: 'Formó equipos comerciales en empresas y comercios. Enseña a vender y a comunicar con método, sin fórmulas mágicas ni presión al cliente.',
    foto: 'images/docente-hernan-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd3',
    nombre: 'Paola Sánchez',
    rol: 'Lic. en Recursos Humanos',
    area: 'Recursos Humanos',
    bio: 'Se dedica a selección y administración de personal. Explica los procesos de RR.HH. y la liquidación de sueldos con casos reales y la normativa vigente.',
    foto: 'images/docente-paola-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd4',
    nombre: 'Diego Ferreyra',
    rol: 'Técnico en Seguridad e Higiene',
    area: 'Seguridad e Higiene',
    bio: 'Asesora a empresas en prevención de riesgos laborales. Sus clases se enfocan en aplicar la normativa y armar un plan de seguridad que se cumpla de verdad.',
    foto: 'images/docente-diego-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd5',
    nombre: 'Luciana Gómez',
    rol: 'Analista de sistemas',
    area: 'Informática',
    bio: 'Capacita a equipos administrativos en herramientas digitales. Hace fácil lo que parece difícil: planillas, gestión y organización del trabajo.',
    foto: 'images/docente-luciana-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd6',
    nombre: 'Sergio Ledesma',
    rol: 'Coach profesional',
    area: 'Habilidades',
    bio: 'Acompaña a mandos medios y equipos de trabajo. Trabaja las habilidades que no se enseñan en un manual: comunicación, liderazgo y trabajo en equipo.',
    foto: 'images/docente-sergio-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  },
  {
    id: 'd7',
    nombre: 'Andrea Villalba',
    rol: 'Profesora de Inglés',
    area: 'Idiomas',
    bio: 'Prepara a profesionales y trabajadores para desenvolverse en inglés. Clases en vivo, prácticas y enfocadas en el uso real del idioma en el trabajo.',
    foto: 'images/docente-andrea-800x800.jpg',
    redes: INSTAGRAM,
    credencialesVerificadas: false
  }
];

function mod(id, titulo, clases) { return { id, titulo, clases }; }
function cl(id, titulo, duracion, tipo, preview) { return { id, titulo, duracion, tipo, preview: !!preview }; }

const CURSOS = [
  {
    id: 'c1', slug: 'auxiliar-administrativo-contable',
    titulo: 'Auxiliar Administrativo Contable',
    categoria: 'Administración', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 42900, descuento: 15, duracion: '30 horas', cantidadClases: 9,
    descripcionCorta: 'Sumá un oficio administrativo con salida laboral: caja, facturación, registros y trato con proveedores.',
    descripcionCompleta: 'Una formación práctica para trabajar en la administración de cualquier empresa o comercio. Aprendés las tareas del día a día de una oficina: facturación, caja, registros contables básicos, archivo y organización, con ejercicios sobre casos reales.',
    resultados: ['Manejar la facturación y la caja diaria', 'Llevar registros contables básicos ordenados', 'Organizar el circuito administrativo de una oficina'],
    requisitos: ['No necesitás experiencia previa', 'Ganas de incorporar un oficio con salida laboral'],
    incluye: ['9 clases grabadas', 'Plantillas administrativas', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['administración', 'contable', 'facturación', 'oficina', 'salida laboral'],
    docenteId: 'd1', portada: 'images/curso-administrativo-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c1m1', 'La oficina por dentro', [
        cl('c1m1l1', 'Qué hace un auxiliar administrativo', '14 min', 'video', true),
        cl('c1m1l2', 'Documentos comerciales: factura, remito, recibo', '19 min', 'video', false),
        cl('c1m1l3', 'Práctica: ordená un circuito de compra', '10 min', 'lectura', false)
      ]),
      mod('c1m2', 'Caja y facturación', [
        cl('c1m2l1', 'Manejo de caja diaria y arqueo', '17 min', 'video', false),
        cl('c1m2l2', 'Facturación paso a paso', '18 min', 'video', false),
        cl('c1m2l3', 'Plantilla: libro de caja', '8 min', 'pdf', false)
      ]),
      mod('c1m3', 'Registros y orden', [
        cl('c1m3l1', 'Registros contables básicos', '16 min', 'video', false),
        cl('c1m3l2', 'Archivo, agenda y proveedores', '15 min', 'video', false),
        cl('c1m3l3', 'Cierre: tu circuito administrativo', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c2', slug: 'liquidacion-de-sueldos',
    titulo: 'Liquidación de Sueldos y Jornales',
    categoria: 'Recursos Humanos', nivel: 'Intermedio', modalidad: 'Grabado',
    precio: 48900, descuento: 0, duracion: '28 horas', cantidadClases: 9,
    descripcionCorta: 'Aprendé a liquidar sueldos con la normativa vigente: recibos, cargas sociales y conceptos de un haber.',
    descripcionCompleta: 'Un curso para dominar la liquidación de haberes. Recorrés el recibo de sueldo concepto por concepto, calculás cargas sociales, aguinaldo y vacaciones, y entendés el marco normativo. Ideal para quienes trabajan (o quieren trabajar) en RR.HH. o administración.',
    resultados: ['Confeccionar un recibo de sueldo completo', 'Calcular cargas sociales, aguinaldo y vacaciones', 'Aplicar la normativa laboral vigente'],
    requisitos: ['Conocimientos básicos de administración', 'Interés en el área de RR.HH.'],
    incluye: ['9 clases grabadas', 'Planilla de liquidación', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['sueldos', 'liquidación', 'rrhh', 'nómina', 'laboral'],
    docenteId: 'd3', portada: 'images/curso-sueldos-1600x1200.jpg', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c2m1', 'El recibo de sueldo', [
        cl('c2m1l1', 'Anatomía de un recibo', '15 min', 'video', true),
        cl('c2m1l2', 'Remunerativo y no remunerativo', '18 min', 'video', false),
        cl('c2m1l3', 'Ejercicio: identificá los conceptos', '9 min', 'lectura', false)
      ]),
      mod('c2m2', 'Cálculos clave', [
        cl('c2m2l1', 'Cargas sociales y aportes', '19 min', 'video', false),
        cl('c2m2l2', 'Aguinaldo y vacaciones', '17 min', 'video', false),
        cl('c2m2l3', 'Planilla: liquidación mensual', '8 min', 'pdf', false)
      ]),
      mod('c2m3', 'Marco normativo', [
        cl('c2m3l1', 'Convenios y normativa vigente', '16 min', 'video', false),
        cl('c2m3l2', 'Casos frecuentes y errores comunes', '15 min', 'video', false),
        cl('c2m3l3', 'Cierre: liquidá un caso completo', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c3', slug: 'ventas-y-atencion-al-cliente',
    titulo: 'Ventas Efectivas y Atención al Cliente',
    categoria: 'Ventas y Marketing', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 36900, descuento: 10, duracion: '20 horas', cantidadClases: 9,
    descripcionCorta: 'Vendé más y mejor: técnicas de venta, atención al cliente y manejo de objeciones sin presionar.',
    descripcionCompleta: 'Vender no es insistir: es entender y acompañar. Este curso te da un método para atender, presentar un producto, manejar objeciones y cerrar ventas, cuidando siempre la relación con el cliente. Sirve para comercios, empresas o tu propio emprendimiento.',
    resultados: ['Atender clientes con un método claro', 'Manejar objeciones sin discutir', 'Cerrar ventas cuidando el vínculo'],
    requisitos: ['No necesitás experiencia previa', 'Ganas de mejorar tu forma de vender'],
    incluye: ['9 clases grabadas', 'Guía de objeciones', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['ventas', 'atención al cliente', 'comercio', 'objeciones', 'negociación'],
    docenteId: 'd2', portada: 'images/curso-ventas-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c3m1', 'Atender bien', [
        cl('c3m1l1', 'La primera impresión vende', '13 min', 'video', true),
        cl('c3m1l2', 'Escuchar para entender la necesidad', '16 min', 'video', false),
        cl('c3m1l3', 'Ejercicio: tu guion de atención', '9 min', 'lectura', false)
      ]),
      mod('c3m2', 'Presentar y persuadir', [
        cl('c3m2l1', 'Mostrar el valor, no el precio', '17 min', 'video', false),
        cl('c3m2l2', 'Manejo de objeciones', '18 min', 'video', false),
        cl('c3m2l3', 'Guía: respuestas a objeciones típicas', '8 min', 'pdf', false)
      ]),
      mod('c3m3', 'Cerrar y fidelizar', [
        cl('c3m3l1', 'Técnicas de cierre sin presión', '15 min', 'video', false),
        cl('c3m3l2', 'Posventa y clientes que vuelven', '14 min', 'video', false),
        cl('c3m3l3', 'Cierre: tu plan de atención', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c4', slug: 'marketing-digital-pymes',
    titulo: 'Marketing Digital para Pymes',
    categoria: 'Ventas y Marketing', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 39900, descuento: 0, duracion: '22 horas', cantidadClases: 9,
    descripcionCorta: 'Conseguí clientes online: redes, contenido y publicidad para tu negocio, sin depender de una agencia.',
    descripcionCompleta: 'Para dueños de negocio, emprendedores y equipos comerciales. Armás una estrategia digital simple: qué redes te convienen, cómo crear contenido que atraiga y cómo hacer publicidad básica sin desperdiciar presupuesto.',
    resultados: ['Elegir las redes que rinden para tu negocio', 'Crear contenido que atrae clientes', 'Hacer publicidad básica con criterio'],
    requisitos: ['Tener o estar por lanzar un negocio', 'No hace falta experiencia en marketing'],
    incluye: ['9 clases grabadas', 'Calendario de contenidos', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['marketing', 'redes', 'publicidad', 'pymes', 'contenido'],
    docenteId: 'd2', portada: 'images/curso-marketing-1600x1200.jpg', trailer: null, destacado: false, nuevo: true,
    modulos: [
      mod('c4m1', 'Estrategia simple', [
        cl('c4m1l1', 'Marketing digital sin humo', '13 min', 'video', true),
        cl('c4m1l2', 'A quién le hablás y qué le ofrecés', '17 min', 'video', false),
        cl('c4m1l3', 'Ejercicio: tu propuesta en una frase', '9 min', 'lectura', false)
      ]),
      mod('c4m2', 'Contenido y redes', [
        cl('c4m2l1', 'Qué red para qué negocio', '16 min', 'video', false),
        cl('c4m2l2', 'Contenido que atrae y no cansa', '18 min', 'video', false),
        cl('c4m2l3', 'Plantilla: calendario de contenidos', '7 min', 'pdf', false)
      ]),
      mod('c4m3', 'Publicidad y medición', [
        cl('c4m3l1', 'Primeros pasos en publicidad paga', '17 min', 'video', false),
        cl('c4m3l2', 'Métricas que importan', '14 min', 'video', false),
        cl('c4m3l3', 'Cierre: tu plan de 90 días', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c5', slug: 'seguridad-e-higiene',
    titulo: 'Seguridad e Higiene en el Trabajo',
    categoria: 'Seguridad e Higiene', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 44900, descuento: 0, duracion: '26 horas', cantidadClases: 9,
    descripcionCorta: 'Prevení riesgos laborales: normativa, uso de EPP y armado de un plan de seguridad que se cumpla.',
    descripcionCompleta: 'Una formación para cuidar a las personas en el trabajo. Conocés la normativa de seguridad e higiene, los riesgos más comunes por sector, el uso correcto de elementos de protección y cómo armar y sostener un plan de prevención.',
    resultados: ['Identificar riesgos por puesto de trabajo', 'Aplicar la normativa de seguridad e higiene', 'Armar un plan de prevención'],
    requisitos: ['No necesitás experiencia previa', 'Ideal si trabajás en industria, obra o comercio'],
    incluye: ['9 clases grabadas', 'Checklist de prevención', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['seguridad', 'higiene', 'prevención', 'riesgos', 'trabajo'],
    docenteId: 'd4', portada: 'images/curso-seguridad-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c5m1', 'Fundamentos', [
        cl('c5m1l1', 'Por qué la prevención salva', '14 min', 'video', true),
        cl('c5m1l2', 'Normativa de seguridad e higiene', '18 min', 'video', false),
        cl('c5m1l3', 'Ejercicio: mapa de riesgos', '9 min', 'lectura', false)
      ]),
      mod('c5m2', 'Riesgos y protección', [
        cl('c5m2l1', 'Riesgos por sector y puesto', '17 min', 'video', false),
        cl('c5m2l2', 'Elementos de protección personal', '15 min', 'video', false),
        cl('c5m2l3', 'Checklist: EPP por tarea', '8 min', 'pdf', false)
      ]),
      mod('c5m3', 'Plan de prevención', [
        cl('c5m3l1', 'Cómo armar un plan que se cumpla', '16 min', 'video', false),
        cl('c5m3l2', 'Capacitar y señalizar', '14 min', 'video', false),
        cl('c5m3l3', 'Cierre: tu plan de seguridad', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c6', slug: 'excel-para-el-trabajo',
    titulo: 'Excel para el Trabajo',
    categoria: 'Informática', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 32900, descuento: 20, duracion: '18 horas', cantidadClases: 9,
    descripcionCorta: 'Dominá la herramienta más pedida en cualquier oficina: fórmulas, tablas y gráficos para el día a día.',
    descripcionCompleta: 'Excel aparece en casi todos los avisos de trabajo. Este curso te lleva de cero a manejar las funciones que más se usan: fórmulas, tablas dinámicas y gráficos claros, con ejercicios sobre planillas reales de trabajo.',
    resultados: ['Usar las fórmulas más pedidas', 'Resumir datos con tablas dinámicas', 'Presentar información con gráficos claros'],
    requisitos: ['No necesitás experiencia previa', 'Excel o Google Sheets instalado'],
    incluye: ['9 clases grabadas', 'Planillas de práctica', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['excel', 'planillas', 'informática', 'oficina', 'tablas dinámicas'],
    docenteId: 'd5', portada: 'images/curso-excel-1600x1200.jpg', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c6m1', 'Fundamentos', [
        cl('c6m1l1', 'Ordená una planilla como corresponde', '13 min', 'video', true),
        cl('c6m1l2', 'Fórmulas que resuelven el 80%', '19 min', 'video', false),
        cl('c6m1l3', 'Ejercicio: tu primera planilla', '9 min', 'lectura', false)
      ]),
      mod('c6m2', 'Análisis', [
        cl('c6m2l1', 'Tablas dinámicas sin miedo', '18 min', 'video', false),
        cl('c6m2l2', 'Buscar y cruzar datos', '17 min', 'video', false),
        cl('c6m2l3', 'Guía: funciones esenciales', '8 min', 'pdf', false)
      ]),
      mod('c6m3', 'Comunicar', [
        cl('c6m3l1', 'Gráficos que se entienden', '15 min', 'video', false),
        cl('c6m3l2', 'Un informe prolijo en minutos', '14 min', 'video', false),
        cl('c6m3l3', 'Cierre: presentá tus datos', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c7', slug: 'seleccion-y-gestion-de-personal',
    titulo: 'Selección y Gestión de Personal',
    categoria: 'Recursos Humanos', nivel: 'Intermedio', modalidad: 'Grabado',
    precio: 45900, descuento: 0, duracion: '24 horas', cantidadClases: 9,
    descripcionCorta: 'Reclutá, entrevistá e integrá personas al equipo con procesos claros y una mirada humana.',
    descripcionCompleta: 'El área de RR.HH. empieza por elegir bien. Aprendés a definir un perfil, publicar una búsqueda, entrevistar con criterio y acompañar el ingreso de una persona al equipo, con herramientas que podés aplicar en cualquier organización.',
    resultados: ['Definir perfiles y publicar búsquedas', 'Entrevistar con un método claro', 'Integrar nuevas personas al equipo'],
    requisitos: ['Interés o experiencia en RR.HH.', 'Ganas de profesionalizar tus procesos'],
    incluye: ['9 clases grabadas', 'Modelos de entrevista', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['rrhh', 'selección', 'reclutamiento', 'entrevistas', 'personal'],
    docenteId: 'd3', portada: 'images/curso-rrhh-1600x1200.jpg', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c7m1', 'Definir la búsqueda', [
        cl('c7m1l1', 'El perfil: qué buscás de verdad', '14 min', 'video', true),
        cl('c7m1l2', 'Publicar y atraer candidatos', '17 min', 'video', false),
        cl('c7m1l3', 'Ejercicio: armá un perfil', '9 min', 'lectura', false)
      ]),
      mod('c7m2', 'Entrevistar', [
        cl('c7m2l1', 'Tipos de entrevista y cuándo usarlas', '18 min', 'video', false),
        cl('c7m2l2', 'Preguntas que revelan lo importante', '16 min', 'video', false),
        cl('c7m2l3', 'Modelo: guía de entrevista', '8 min', 'pdf', false)
      ]),
      mod('c7m3', 'Integrar', [
        cl('c7m3l1', 'La inducción de los primeros días', '15 min', 'video', false),
        cl('c7m3l2', 'Seguimiento y período de prueba', '14 min', 'video', false),
        cl('c7m3l3', 'Cierre: tu proceso de selección', '10 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c8', slug: 'liderazgo-y-trabajo-en-equipo',
    titulo: 'Liderazgo y Trabajo en Equipo',
    categoria: 'Habilidades', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 34900, descuento: 0, duracion: '16 horas', cantidadClases: 9,
    descripcionCorta: 'Conducí equipos sin autoritarismo: comunicación, delegación y feedback que suma.',
    descripcionCompleta: 'Las habilidades blandas son las que sostienen a un equipo. Este curso trabaja la comunicación, la delegación, el feedback y la resolución de conflictos, con ejercicios para aplicar desde la próxima reunión.',
    resultados: ['Comunicar con claridad y escucha', 'Delegar y dar feedback que suma', 'Sostener acuerdos en el equipo'],
    requisitos: ['Coordinar personas o estar por hacerlo', 'Ganas de revisar tu estilo'],
    incluye: ['9 clases grabadas', 'Plantillas de feedback', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['liderazgo', 'equipo', 'habilidades blandas', 'comunicación', 'feedback'],
    docenteId: 'd6', portada: 'images/curso-liderazgo-1600x1200.jpg', trailer: null, destacado: true, nuevo: false,
    modulos: [
      mod('c8m1', 'El rol de conducir', [
        cl('c8m1l1', 'De compañero a referente', '13 min', 'video', true),
        cl('c8m1l2', 'Comunicación y escucha activa', '16 min', 'video', false),
        cl('c8m1l3', 'Autodiagnóstico: tu estilo', '9 min', 'lectura', false)
      ]),
      mod('c8m2', 'Delegar y acompañar', [
        cl('c8m2l1', 'Delegar sin perder el control', '17 min', 'video', false),
        cl('c8m2l2', 'Feedback que la gente puede escuchar', '15 min', 'video', false),
        cl('c8m2l3', 'Plantilla: reunión 1 a 1', '7 min', 'pdf', false)
      ]),
      mod('c8m3', 'Equipo y conflicto', [
        cl('c8m3l1', 'Resolver conflictos sin romper vínculos', '16 min', 'video', false),
        cl('c8m3l2', 'Acuerdos que se sostienen', '14 min', 'video', false),
        cl('c8m3l3', 'Cierre: tu plan como líder', '9 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c9', slug: 'ingles-laboral',
    titulo: 'Inglés Laboral',
    categoria: 'Idiomas', nivel: 'Inicial', modalidad: 'En vivo',
    precio: 46900, descuento: 0, duracion: '8 semanas', cantidadClases: 9,
    descripcionCorta: 'Cohorte en vivo para desenvolverte en inglés en el trabajo: mails, llamadas y reuniones.',
    descripcionCompleta: 'Programa en vivo con práctica de conversación desde el primer encuentro. Trabajás el inglés que se usa en el trabajo: escribir mails, atender una llamada, participar en una reunión y presentarte. La próxima cohorte y los cupos se coordinan por WhatsApp.',
    resultados: ['Escribir mails de trabajo claros', 'Atender una llamada o reunión en inglés', 'Presentarte con seguridad'],
    requisitos: ['Nivel básico de inglés', 'Disponibilidad para los encuentros en vivo'],
    incluye: ['Encuentros en vivo por cohorte', 'Grabaciones de cada clase', 'Certificado de finalización de LOGRAR', 'Correcciones personalizadas'],
    etiquetas: ['inglés', 'idiomas', 'laboral', 'conversación', 'en vivo', 'cohorte'],
    docenteId: 'd7', portada: 'images/curso-ingles-1600x1200.jpg', trailer: null, destacado: false, nuevo: true,
    modulos: [
      mod('c9m1', 'Presentarte', [
        cl('c9m1l1', 'Romper el hielo en inglés', '14 min', 'video', true),
        cl('c9m1l2', 'Frases que te salvan en el trabajo', '17 min', 'video', false),
        cl('c9m1l3', 'Práctica: tu presentación de 60 segundos', '9 min', 'lectura', false)
      ]),
      mod('c9m2', 'Comunicación escrita', [
        cl('c9m2l1', 'Mails claros y correctos', '16 min', 'video', false),
        cl('c9m2l2', 'Pedir, responder y acordar', '15 min', 'video', false),
        cl('c9m2l3', 'Plantillas: mails frecuentes', '7 min', 'pdf', false)
      ]),
      mod('c9m3', 'Hablar en el trabajo', [
        cl('c9m3l1', 'Atender una llamada', '16 min', 'video', false),
        cl('c9m3l2', 'Participar en una reunión', '14 min', 'video', false),
        cl('c9m3l3', 'Cierre: presentá tu área', '11 min', 'lectura', false)
      ])
    ]
  },
  {
    id: 'c10', slug: 'community-manager',
    titulo: 'Community Manager Profesional',
    categoria: 'Ventas y Marketing', nivel: 'Intermedio', modalidad: 'Grabado',
    precio: 41900, descuento: 10, duracion: '24 horas', cantidadClases: 9,
    descripcionCorta: 'Gestioná redes como profesional: planificación, contenido, comunidad y reportes para clientes.',
    descripcionCompleta: 'Convertí el manejo de redes en un servicio profesional. Aprendés a planificar contenido, gestionar una comunidad, responder con criterio y armar reportes que muestren resultados, para trabajar en relación de dependencia o de forma independiente.',
    resultados: ['Planificar contenido para una marca', 'Gestionar una comunidad y responder bien', 'Armar reportes de resultados'],
    requisitos: ['Manejar redes a nivel usuario', 'Ganas de profesionalizarte'],
    incluye: ['9 clases grabadas', 'Plantilla de reporte', 'Certificado de finalización de LOGRAR', 'Acceso sin vencimiento'],
    etiquetas: ['community manager', 'redes', 'marketing', 'contenido', 'social media'],
    docenteId: 'd2', portada: 'images/curso-community-1600x1200.jpg', trailer: null, destacado: false, nuevo: false,
    modulos: [
      mod('c10m1', 'Planificar', [
        cl('c10m1l1', 'Qué hace un community manager', '13 min', 'video', true),
        cl('c10m1l2', 'Estrategia y calendario de contenido', '18 min', 'video', false),
        cl('c10m1l3', 'Ejercicio: tu grilla de la semana', '9 min', 'lectura', false)
      ]),
      mod('c10m2', 'Crear y gestionar', [
        cl('c10m2l1', 'Contenido para cada red', '17 min', 'video', false),
        cl('c10m2l2', 'Gestión de comunidad y respuestas', '16 min', 'video', false),
        cl('c10m2l3', 'Guía: tono y respuestas difíciles', '8 min', 'pdf', false)
      ]),
      mod('c10m3', 'Medir y reportar', [
        cl('c10m3l1', 'Métricas que le importan al cliente', '15 min', 'video', false),
        cl('c10m3l2', 'Armar un reporte claro', '14 min', 'video', false),
        cl('c10m3l3', 'Cierre: tu reporte modelo', '10 min', 'lectura', false)
      ])
    ]
  }
];

/* Banners promocionales: vacío = no se renderiza nada. */
const BANNERS = [];
