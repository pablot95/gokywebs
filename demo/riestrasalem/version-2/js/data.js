/* Datos demostrativos — Riestra&Salem Grupo Legal Salud. Cursos, docentes y contenidos con fines de demostración. */
const DOCENTES = [
  { id: 'd1', nombre: 'Dra. Valentina Riestra', rol: 'Litigación en Salud', bio: 'Especialista en amparos y litigación de urgencia en el fuero de la salud. Perfil demostrativo.', foto: 'images/doc-1.jpg' },
  { id: 'd2', nombre: 'Dr. Nicolás Salem', rol: 'Seguridad Social y Prepagas', bio: 'Enfocado en reclamos a obras sociales, prepagas y cobertura de alto costo. Perfil demostrativo.', foto: 'images/doc-2.jpg' },
  { id: 'd3', nombre: 'Dra. Camila Duarte', rol: 'Salud Mental y Derechos', bio: 'Trabaja en salud mental, discapacidad y derechos del paciente. Perfil demostrativo.', foto: 'images/doc-3.jpg' }
];

const CATEGORIAS = [
  { id: 'litigacion', label: 'Litigación en Salud' },
  { id: 'segsocial', label: 'Seguridad Social' },
  { id: 'discapacidad', label: 'Discapacidad' },
  { id: 'saludmental', label: 'Salud Mental' },
  { id: 'derechos', label: 'Derechos y Bioética' }
];

const NIVELES = ['Inicial', 'Intermedio', 'Avanzado'];
const MODALIDADES = ['Grabado', 'En vivo'];

function mod(id, titulo, clases) { return { id, titulo, clases }; }
function cls(id, titulo, duracion, tipo, preview) { return { id, titulo, duracion, tipo, preview: !!preview }; }

const CURSOS = [
  {
    id: 1, slug: 'amparos-de-salud-litigacion-de-urgencia', titulo: 'Amparos de Salud: Litigación de Urgencia',
    categoria: 'litigacion', nivel: 'Intermedio', modalidad: 'Grabado', precio: 89900, descuento: 0,
    duracion: '6 h', cantidadClases: 9, docenteId: 'd1', portada: 'images/c1-amparos.jpg', destacado: true, nuevo: false,
    descripcionCorta: 'Cómo preparar y sostener un amparo de salud cuando el tiempo apremia.',
    descripcionCompleta: 'Un recorrido práctico por la acción de amparo aplicada al derecho a la salud: legitimación, medidas cautelares, prueba y ejecución de sentencia. Pensado para intervenir con solvencia cuando la cobertura no puede esperar.',
    resultados: ['Redactar un amparo de salud sólido', 'Fundamentar y pedir una medida cautelar de urgencia', 'Anticipar las defensas de la demandada'],
    requisitos: ['Conocimientos básicos de derecho procesal', 'Interés en el fuero de la salud'],
    incluye: ['9 clases grabadas', 'Modelos de escritos editables', 'Certificado de participación (demo)'],
    modulos: [
      mod('m1', 'Fundamentos del amparo de salud', [cls('c1', 'El derecho a la salud en el bloque constitucional', '18 min', 'video', true), cls('c2', 'Vía del amparo: cuándo procede', '22 min', 'video', false), cls('c3', 'Legitimación activa y pasiva', '16 min', 'video', false)]),
      mod('m2', 'Medidas cautelares', [cls('c4', 'La cautelar de urgencia en salud', '24 min', 'video', false), cls('c5', 'Verosimilitud y peligro en la demora', '20 min', 'lectura', false), cls('c6', 'Contracautela y objeciones frecuentes', '19 min', 'video', false)]),
      mod('m3', 'Prueba y sentencia', [cls('c7', 'Prueba documental y pericial', '21 min', 'video', false), cls('c8', 'Estrategia en la audiencia', '17 min', 'video', false), cls('c9', 'Ejecución y seguimiento de la sentencia', '23 min', 'video', false)])
    ]
  },
  {
    id: 2, slug: 'responsabilidad-medica-y-mala-praxis', titulo: 'Responsabilidad Médica y Mala Praxis',
    categoria: 'litigacion', nivel: 'Avanzado', modalidad: 'En vivo', precio: 119900, descuento: 10,
    duracion: '8 h', cantidadClases: 9, docenteId: 'd1', portada: 'images/c2-malapraxis.jpg', destacado: true, nuevo: true,
    descripcionCorta: 'Del análisis del caso a la reparación: responsabilidad civil por daños en salud.',
    descripcionCompleta: 'Cohorte en vivo sobre responsabilidad médica: factores de atribución, carga de la prueba, pericia médica y cuantificación del daño. Con análisis de casos y espacio de consultas.',
    resultados: ['Evaluar la viabilidad de un caso de mala praxis', 'Trabajar con la pericia médica', 'Cuantificar el daño con criterio actual'],
    requisitos: ['Ejercicio profesional o formación avanzada', 'Nociones de responsabilidad civil'],
    incluye: ['Encuentros en vivo', 'Grabaciones disponibles', 'Casos de análisis', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'El caso y su atribución', [cls('c1', 'Obligaciones de medios y de resultado', '20 min', 'video', true), cls('c2', 'Factores de atribución', '25 min', 'video', false), cls('c3', 'Relación de causalidad', '18 min', 'video', false)]),
      mod('m2', 'La prueba del daño', [cls('c4', 'Historia clínica como prueba', '22 min', 'video', false), cls('c5', 'La pericia médica', '26 min', 'video', false), cls('c6', 'Consentimiento informado y su ausencia', '19 min', 'lectura', false)]),
      mod('m3', 'Reparación', [cls('c7', 'Cuantificación del daño', '24 min', 'video', false), cls('c8', 'Daño moral y pérdida de chance', '21 min', 'video', false), cls('c9', 'Estrategia transaccional', '17 min', 'video', false)])
    ]
  },
  {
    id: 3, slug: 'discapacidad-y-cud-derechos-y-tramites', titulo: 'Discapacidad y CUD: Derechos y Trámites',
    categoria: 'discapacidad', nivel: 'Inicial', modalidad: 'Grabado', precio: 69900, descuento: 0,
    duracion: '5 h', cantidadClases: 9, docenteId: 'd3', portada: 'images/c3-discapacidad.jpg', destacado: false, nuevo: false,
    descripcionCorta: 'El Certificado Único de Discapacidad y las prestaciones que habilita, paso a paso.',
    descripcionCompleta: 'Todo lo que un profesional necesita para acompañar un trámite de CUD y reclamar las prestaciones del sistema: marco normativo, gestión y reclamos por coberturas denegadas.',
    resultados: ['Orientar un trámite de CUD', 'Identificar las prestaciones obligatorias', 'Reclamar una cobertura denegada'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Checklist de trámites', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'Marco normativo', [cls('c1', 'Ley 22.431 y sistema de protección', '17 min', 'video', true), cls('c2', 'Convención sobre los Derechos de las Personas con Discapacidad', '20 min', 'video', false), cls('c3', 'Qué es y qué habilita el CUD', '15 min', 'video', false)]),
      mod('m2', 'El trámite', [cls('c4', 'Documentación y junta evaluadora', '19 min', 'video', false), cls('c5', 'Renovación y actualización', '14 min', 'lectura', false), cls('c6', 'Errores frecuentes', '16 min', 'video', false)]),
      mod('m3', 'Prestaciones y reclamos', [cls('c7', 'Prestaciones del sistema único', '21 min', 'video', false), cls('c8', 'Transporte y educación', '18 min', 'video', false), cls('c9', 'Reclamo por prestación denegada', '22 min', 'video', false)])
    ]
  },
  {
    id: 4, slug: 'reclamos-a-obras-sociales-y-prepagas', titulo: 'Reclamos a Obras Sociales y Prepagas',
    categoria: 'segsocial', nivel: 'Intermedio', modalidad: 'Grabado', precio: 84900, descuento: 0,
    duracion: '6 h', cantidadClases: 9, docenteId: 'd2', portada: 'images/c4-obrassociales.jpg', destacado: true, nuevo: false,
    descripcionCorta: 'Estrategias efectivas frente a coberturas denegadas por el sistema de salud.',
    descripcionCompleta: 'Cómo construir un reclamo eficaz ante obras sociales y prepagas: PMO, autorizaciones, vías administrativas y judiciales, y superintendencia.',
    resultados: ['Encuadrar un reclamo por cobertura', 'Elegir la vía más rápida', 'Usar la Superintendencia de Servicios de Salud'],
    requisitos: ['Nociones de derecho de la seguridad social'],
    incluye: ['9 clases grabadas', 'Modelos de cartas documento', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'El sistema y sus reglas', [cls('c1', 'PMO: qué cubre el programa médico obligatorio', '19 min', 'video', true), cls('c2', 'Obras sociales vs. prepagas', '16 min', 'video', false), cls('c3', 'Autorizaciones y plazos', '18 min', 'video', false)]),
      mod('m2', 'Vía administrativa', [cls('c4', 'Carta documento y reclamo interno', '20 min', 'video', false), cls('c5', 'Superintendencia de Servicios de Salud', '22 min', 'video', false), cls('c6', 'Defensa del consumidor de salud', '15 min', 'lectura', false)]),
      mod('m3', 'Vía judicial', [cls('c7', 'Cuándo ir al amparo', '21 min', 'video', false), cls('c8', 'Prueba de la denegatoria', '17 min', 'video', false), cls('c9', 'Costas y honorarios', '16 min', 'video', false)])
    ]
  },
  {
    id: 5, slug: 'salud-mental-y-ley-26657', titulo: 'Salud Mental y Ley 26.657',
    categoria: 'saludmental', nivel: 'Intermedio', modalidad: 'Grabado', precio: 74900, descuento: 0,
    duracion: '5 h', cantidadClases: 9, docenteId: 'd3', portada: 'images/c5-saludmental.jpg', destacado: false, nuevo: true,
    descripcionCorta: 'El marco legal de la salud mental y los derechos de las personas usuarias.',
    descripcionCompleta: 'La Ley Nacional de Salud Mental en la práctica: internaciones, consentimiento, capacidad jurídica y el rol del abogado en el resguardo de derechos.',
    resultados: ['Aplicar la Ley 26.657', 'Intervenir en una internación involuntaria', 'Resguardar la capacidad jurídica'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Guía de actuación', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'Principios de la ley', [cls('c1', 'El cambio de paradigma', '18 min', 'video', true), cls('c2', 'Derechos de las personas usuarias', '17 min', 'video', false), cls('c3', 'Interdisciplina y consentimiento', '16 min', 'video', false)]),
      mod('m2', 'Internaciones', [cls('c4', 'Voluntaria e involuntaria', '22 min', 'video', false), cls('c5', 'Control judicial de la internación', '20 min', 'video', false), cls('c6', 'El órgano de revisión', '15 min', 'lectura', false)]),
      mod('m3', 'Capacidad y apoyos', [cls('c7', 'Capacidad jurídica y CCyC', '21 min', 'video', false), cls('c8', 'Sistemas de apoyo', '18 min', 'video', false), cls('c9', 'Rol del abogado', '14 min', 'video', false)])
    ]
  },
  {
    id: 6, slug: 'derechos-del-paciente-y-consentimiento-informado', titulo: 'Derechos del Paciente y Consentimiento Informado',
    categoria: 'derechos', nivel: 'Inicial', modalidad: 'Grabado', precio: 59900, descuento: 0,
    duracion: '4 h', cantidadClases: 9, docenteId: 'd3', portada: 'images/c6-consentimiento.jpg', destacado: false, nuevo: false,
    descripcionCorta: 'La Ley 26.529 y el consentimiento informado como eje de la relación sanitaria.',
    descripcionCompleta: 'Los derechos del paciente en la práctica: información, autonomía, consentimiento informado, directivas anticipadas y su documentación.',
    resultados: ['Auditar un consentimiento informado', 'Asesorar sobre derechos del paciente', 'Redactar directivas anticipadas'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Modelos de consentimiento', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'Los derechos', [cls('c1', 'Ley 26.529 de derechos del paciente', '16 min', 'video', true), cls('c2', 'Autonomía e información', '15 min', 'video', false), cls('c3', 'Intimidad y confidencialidad', '14 min', 'video', false)]),
      mod('m2', 'El consentimiento', [cls('c4', 'Elementos del consentimiento informado', '19 min', 'video', false), cls('c5', 'Excepciones y urgencias', '17 min', 'lectura', false), cls('c6', 'Consentimiento en menores', '18 min', 'video', false)]),
      mod('m3', 'Voluntad anticipada', [cls('c7', 'Directivas anticipadas', '20 min', 'video', false), cls('c8', 'Documentación y prueba', '15 min', 'video', false), cls('c9', 'Casos límite', '16 min', 'video', false)])
    ]
  },
  {
    id: 7, slug: 'medicamentos-de-alto-costo-estrategia-legal', titulo: 'Medicamentos de Alto Costo: Estrategia Legal',
    categoria: 'segsocial', nivel: 'Avanzado', modalidad: 'Grabado', precio: 99900, descuento: 15,
    duracion: '7 h', cantidadClases: 9, docenteId: 'd2', portada: 'images/c7-medicamentos.jpg', destacado: true, nuevo: false,
    descripcionCorta: 'Cómo litigar la cobertura de tratamientos y medicamentos de alto costo.',
    descripcionCompleta: 'Estrategia integral para obtener la cobertura de medicamentos de alto costo: fundamento científico, encuadre legal, cautelares y ejecución.',
    resultados: ['Construir el fundamento de la cobertura', 'Litigar una cautelar por medicación', 'Sostener la cobertura en el tiempo'],
    requisitos: ['Experiencia en litigación en salud'],
    incluye: ['9 clases grabadas', 'Repositorio de jurisprudencia (demo)', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'El fundamento', [cls('c1', 'Medicamentos, PMO y vademécum', '20 min', 'video', true), cls('c2', 'Evidencia científica y off-label', '23 min', 'video', false), cls('c3', 'El informe médico como prueba', '18 min', 'video', false)]),
      mod('m2', 'La estrategia', [cls('c4', 'Encuadre del reclamo', '21 min', 'video', false), cls('c5', 'La cautelar de cobertura', '25 min', 'video', false), cls('c6', 'Defensas de la demandada', '17 min', 'lectura', false)]),
      mod('m3', 'Sostener la cobertura', [cls('c7', 'Continuidad del tratamiento', '19 min', 'video', false), cls('c8', 'Astreintes e incumplimiento', '20 min', 'video', false), cls('c9', 'Cierre del caso', '16 min', 'video', false)])
    ]
  },
  {
    id: 8, slug: 'historia-clinica-y-secreto-profesional', titulo: 'Historia Clínica y Secreto Profesional',
    categoria: 'derechos', nivel: 'Inicial', modalidad: 'Grabado', precio: 54900, descuento: 0,
    duracion: '4 h', cantidadClases: 9, docenteId: 'd2', portada: 'images/c8-historiaclinica.jpg', destacado: false, nuevo: false,
    descripcionCorta: 'La historia clínica como documento legal y los límites del secreto profesional.',
    descripcionCompleta: 'La historia clínica desde el derecho: acceso, titularidad, valor probatorio, conservación y las tensiones del secreto profesional.',
    resultados: ['Solicitar y auditar una historia clínica', 'Comprender su valor probatorio', 'Resolver conflictos de secreto profesional'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Modelo de pedido de historia clínica', 'Certificado (demo)'],
    modulos: [
      mod('m1', 'El documento', [cls('c1', 'Qué es y quién es su titular', '15 min', 'video', true), cls('c2', 'Acceso y entrega', '16 min', 'video', false), cls('c3', 'Historia clínica informatizada', '14 min', 'video', false)]),
      mod('m2', 'Valor probatorio', [cls('c4', 'La HC en juicio', '19 min', 'video', false), cls('c5', 'Adulteración y consecuencias', '17 min', 'lectura', false), cls('c6', 'Conservación y plazos', '13 min', 'video', false)]),
      mod('m3', 'Secreto profesional', [cls('c7', 'Alcance del secreto médico', '18 min', 'video', false), cls('c8', 'Excepciones legales', '16 min', 'video', false), cls('c9', 'Colisión de deberes', '15 min', 'video', false)])
    ]
  }
];
