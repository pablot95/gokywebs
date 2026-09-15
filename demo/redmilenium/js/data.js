/* RED MILENIUM — datos de la demo. Cursos reales de la marca; programas, precios y docentes son demostrativos. */
/* eslint-disable no-unused-vars -- consumidos por core.js/app.js via scope global */
const AREAS = [
  {
    id: 'dp', n: '01', label: 'Desarrollo Personal', bajada: 'Educación para crecer',
    color: '#1740d8', colorInk: '#1740d8', colorLight: '#7ea3ff', onAccent: '#ffffff',
    claim: 'Hablar mejor, conducir equipos y decidir con criterio.',
    intro: 'Habilidades blandas para personas y para empresas. El área nació de los resultados concretos de la fundación en oratoria y coaching por valores: no partimos de cero.',
    dato: 'El mercado global de coaching crece cerca de un 9% anual y 6 de cada 10 empresas valoran hoy más las habilidades blandas que las técnicas.',
    individuos: 'Profesionales, emprendedores y personas en proceso de desarrollo personal.',
    organizaciones: 'Equipos comerciales, mandos medios, RR.HH. y alta dirección, con programas in-company.',
    portada: 'images/oratoria.webp'
  },
  {
    id: 'ia', n: '02', label: 'IA Aplicada', bajada: 'Inteligencia artificial en tu profesión',
    color: '#0c8fd9', colorInk: '#0a6d9e', colorLight: '#5fd0f5', onAccent: '#042435',
    claim: 'Que la IA te ahorre horas en el trabajo que ya hacés.',
    intro: 'No es un curso de teoría: cada formación toma una profesión concreta y arma sus flujos, sus prompts y sus agentes.',
    dato: 'El 42% de las pymes argentinas ya usa IA y el 90% de los empleadores espera más demanda de estas habilidades hacia 2030. Entre abogados, el uso diario ya llega al 79%.',
    individuos: 'Abogados, emprendedores, pymes y estudiantes.',
    organizaciones: 'Instituciones educativas y centros de salud que quieren automatizar la atención al público.',
    portada: 'images/diplomaia.webp'
  },
  {
    id: 'mkt', n: '03', label: 'Marketing y Tecnología', bajada: 'Las herramientas de todos los días',
    color: '#ff6a18', colorInk: '#b8480a', colorLight: '#ffab6d', onAccent: '#14213d',
    claim: 'Las herramientas digitales que te piden en cualquier puesto.',
    intro: 'Planilla, campañas, contenido y oficina en la nube. Lo transversal: sirve igual en una pyme, en un estudio o por tu cuenta.',
    dato: 'Son las competencias que más se repiten en las búsquedas laborales administrativas y comerciales.',
    individuos: 'Emprendedores, community managers y estudiantes.',
    organizaciones: 'Pymes que arman su equipo de marketing y áreas administrativas.',
    portada: 'images/marketingia.webp'
  },
  {
    id: 'ofe', n: '04', label: 'Oficios for Export', bajada: 'Un oficio que cruza la frontera',
    color: '#e2431c', colorInk: '#bf3413', colorLight: '#ff9179', onAccent: '#ffffff',
    claim: 'Un oficio que se pide en cualquier país al que llegues.',
    intro: 'Oficios de demanda internacional, enseñados con el vocabulario, las normas y la práctica que se piden afuera.',
    dato: 'Pensada para quienes planean emigrar, para argentinos que ya están afuera y para quienes buscan un segundo oficio.',
    individuos: 'Jóvenes de 18 a 35 que planean emigrar, argentinos en el exterior y latinoamericanos con movilidad laboral.',
    organizaciones: 'También para quienes buscan un segundo oficio o independencia económica.',
    portada: 'images/soldadura.webp'
  }
];

const DOCENTES = [
  { id: 'd1', nombre: 'Sergio Villalba', rol: 'Oratoria y coaching por valores', area: 'dp', bio: 'Facilitador de oratoria y programas de valores para equipos comerciales y mandos medios. Perfil demostrativo: los datos del equipo real se cargan al pasar a producción.', foto: 'images/doc-1.webp' },
  { id: 'd2', nombre: 'Carla Nieva', rol: 'IA aplicada a profesiones', area: 'ia', bio: 'Trabaja en automatización de atención al público y flujos de IA para estudios, comercios e instituciones. Perfil demostrativo.', foto: 'images/doc-2.webp' },
  { id: 'd3', nombre: 'Matías Rearte', rol: 'Marketing digital y herramientas', area: 'mkt', bio: 'Campañas de Meta y Google Ads, planillas y ofimática aplicada a la gestión diaria de pymes. Perfil demostrativo.', foto: 'images/doc-3.webp' },
  { id: 'd4', nombre: 'Paula Argañaraz', rol: 'Oficios y empleabilidad internacional', area: 'ofe', bio: 'Coordina las formaciones de oficios con foco en normas, vocabulario técnico y práctica exigida en el exterior. Perfil demostrativo.', foto: 'images/doc-4.webp' }
];

const NIVELES = ['Inicial', 'Intermedio', 'Avanzado'];
const MODALIDADES = ['Grabado', 'En vivo', 'Híbrido'];
const DURACIONES = [
  { id: 'corta', label: 'Hasta 8 horas' },
  { id: 'media', label: 'De 8 a 20 horas' },
  { id: 'larga', label: 'Más de 20 horas' }
];

function P(mods) {
  return mods.map((m, i) => ({
    id: 'm' + (i + 1),
    titulo: m[0],
    clases: m[1].map((c, j) => ({ id: 'c' + (i + 1) + '-' + (j + 1), titulo: c[0], duracion: c[1], tipo: c[2] || 'video', preview: !!c[3] }))
  }));
}

const CURSOS = [
  {
    id: 1, slug: 'oratoria-y-coaching-por-valores', titulo: 'Oratoria y Coaching por Valores',
    area: 'dp', nivel: 'Inicial', modalidad: 'Híbrido', precio: 46900, descuento: 15, duracion: '9 h', rango: 'media',
    docenteId: 'd1', portada: 'images/oratoria.webp', destacado: true, nuevo: false,
    descripcionCorta: 'Perdé el miedo a hablar en público y sostené lo que decís con tus valores.',
    descripcionCompleta: 'El programa insignia del área. Trabajás la voz, el cuerpo y la estructura de tu mensaje, y al mismo tiempo ordenás los valores desde los que hablás: qué defendés, qué no negociás y cómo eso se nota cuando presentás.',
    resultados: ['Armar y sostener una exposición de 10 minutos sin leer', 'Manejar los nervios con técnicas de respiración y ritmo', 'Definir tus valores rectores y llevarlos a tu discurso'],
    requisitos: ['No necesitás experiencia previa', 'Poder grabarte con el celular para las devoluciones'],
    incluye: ['Clases grabadas + 2 encuentros en vivo', 'Guía de estructura de discursos (PDF)', 'Devolución sobre tu presentación final', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['La voz y el cuerpo', [['Cómo suena tu voz y cómo trabajarla', '22 min', 'video', true], ['Respiración, pausas y ritmo', '18 min'], ['Postura, manos y mirada', '20 min']]],
      ['El mensaje', [['La idea fuerza: una sola por charla', '17 min'], ['Estructura de apertura, nudo y cierre', '24 min'], ['Contar una historia que sostenga tu punto', '21 min']]],
      ['Coaching por valores', [['Detectar tus valores rectores', '19 min', 'lectura'], ['Del valor a la conducta observable', '23 min'], ['Presentación final y devolución', '26 min']]]
    ])
  },
  {
    id: 2, slug: 'coaching-empresarial', titulo: 'Coaching Empresarial',
    area: 'dp', nivel: 'Avanzado', modalidad: 'En vivo', precio: null, descuento: 0, duracion: 'A medida', rango: 'media',
    docenteId: 'd1', portada: 'images/coachingemp.webp', destacado: false, nuevo: false, incompany: true,
    descripcionCorta: 'Programa in-company para alta dirección y mandos medios, armado sobre tus objetivos.',
    descripcionCompleta: 'Se diseña con la empresa: diagnóstico, objetivos del período y encuentros en vivo con dirección y mandos medios. La carga horaria y el precio se definen según la cantidad de participantes y el alcance.',
    resultados: ['Ordenar prioridades y objetivos del equipo directivo', 'Mejorar las conversaciones difíciles dentro de la empresa', 'Dejar acuerdos de trabajo escritos y medibles'],
    requisitos: ['Programa para organizaciones, no para inscripción individual', 'Reunión previa de diagnóstico'],
    incluye: ['Diagnóstico inicial', 'Encuentros en vivo con la dirección', 'Material de trabajo para cada participante', 'Informe de cierre'],
    modulos: P([
      ['Diagnóstico', [['Relevamiento con dirección', '60 min', 'lectura', true], ['Mapa de objetivos del período', '45 min', 'lectura'], ['Acuerdo de trabajo', '30 min', 'lectura']]],
      ['Intervención', [['Conversaciones difíciles', '90 min'], ['Delegación y seguimiento', '90 min'], ['Reuniones que sirven para algo', '60 min']]],
      ['Cierre', [['Indicadores del programa', '45 min', 'lectura'], ['Plan de sostenimiento', '45 min', 'lectura'], ['Informe final a dirección', '30 min', 'pdf']]]
    ])
  },
  {
    id: 3, slug: 'coaching-para-equipos', titulo: 'Coaching para Equipos',
    area: 'dp', nivel: 'Intermedio', modalidad: 'En vivo', precio: null, descuento: 0, duracion: 'A medida', rango: 'media',
    docenteId: 'd1', portada: 'images/coachingeq.webp', destacado: false, nuevo: false, incompany: true,
    descripcionCorta: 'Talleres in-company para equipos comerciales, RR.HH. y áreas que trabajan juntas.',
    descripcionCompleta: 'Formato taller: el equipo trabaja sobre sus propios casos. Se arma según el tamaño del grupo y el momento del área, y termina con acuerdos concretos de funcionamiento.',
    resultados: ['Acordar cómo se comunica y decide el equipo', 'Bajar la fricción entre áreas', 'Salir con compromisos escritos y con fecha'],
    requisitos: ['Programa para organizaciones', 'Grupo de 6 a 20 personas'],
    incluye: ['Taller en vivo por videollamada o presencial', 'Casos reales del equipo', 'Acta de acuerdos', 'Encuentro de seguimiento'],
    modulos: P([
      ['Cómo estamos', [['Termómetro del equipo', '60 min', 'lectura', true], ['Roles y expectativas', '60 min'], ['Qué nos frena hoy', '45 min']]],
      ['Cómo trabajamos', [['Comunicación entre áreas', '90 min'], ['Feedback que no lastima', '60 min'], ['Decidir sin trabarse', '60 min']]],
      ['Acuerdos', [['Reglas de funcionamiento', '45 min', 'lectura'], ['Compromisos con fecha', '30 min', 'lectura'], ['Encuentro de seguimiento', '60 min']]]
    ])
  },
  {
    id: 4, slug: 'diplomatura-en-desarrollo-personal', titulo: 'Diplomatura en Desarrollo Personal',
    area: 'dp', nivel: 'Intermedio', modalidad: 'Híbrido', precio: 139000, descuento: 10, duracion: '26 h', rango: 'larga',
    docenteId: 'd1', portada: 'images/diplomadp.webp', destacado: true, nuevo: true,
    descripcionCorta: 'El recorrido completo del área: oratoria, valores, liderazgo y conducción de equipos.',
    descripcionCompleta: 'Reúne los contenidos del área en un recorrido largo, con trabajo práctico entre módulos y un proyecto final aplicado a tu ámbito: tu emprendimiento, tu equipo o tu carrera.',
    resultados: ['Sostener presentaciones y reuniones con seguridad', 'Conducir un equipo chico con acuerdos claros', 'Cerrar con un plan de desarrollo propio a 12 meses'],
    requisitos: ['Recomendable tener experiencia laboral o un emprendimiento', 'Dedicación estimada de 3 horas semanales'],
    incluye: ['5 módulos con clases grabadas', '4 encuentros en vivo', 'Proyecto final con devolución', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Autoconocimiento', [['Punto de partida: dónde estás hoy', '24 min', 'video', true], ['Valores, límites y decisiones', '26 min'], ['Hábitos que sostienen procesos', '22 min']]],
      ['Comunicación', [['Escucha activa aplicada', '25 min'], ['Oratoria para reuniones', '28 min'], ['Conversaciones difíciles', '24 min']]],
      ['Liderazgo', [['Liderar sin cargo', '27 min'], ['Delegar y hacer seguimiento', '25 min'], ['Reconocimiento y errores', '21 min']]],
      ['Equipos', [['Roles y dinámica grupal', '26 min'], ['Conflictos: del choque al acuerdo', '29 min'], ['Reuniones útiles', '20 min']]],
      ['Proyecto final', [['Diseño de tu plan a 12 meses', '30 min', 'lectura'], ['Presentación del proyecto', '35 min'], ['Devolución y cierre', '25 min']]]
    ])
  },
  {
    id: 5, slug: 'ia-para-abogados', titulo: 'IA para Abogados',
    area: 'ia', nivel: 'Intermedio', modalidad: 'Grabado', precio: 54900, descuento: 0, duracion: '7 h', rango: 'corta',
    docenteId: 'd2', portada: 'images/iaabogados.webp', destacado: true, nuevo: true,
    descripcionCorta: 'Redacción, análisis de expedientes y búsqueda: la IA aplicada al ejercicio profesional.',
    descripcionCompleta: 'Un curso pensado para el estudio jurídico real: cómo redactar borradores, resumir expedientes largos, comparar versiones de un contrato y armar tus propias plantillas de prompts, con el cuidado que exige la información de tus clientes.',
    resultados: ['Redactar borradores de escritos y contratos en menos tiempo', 'Resumir y comparar documentos extensos', 'Armar tu biblioteca de prompts del estudio'],
    requisitos: ['Ejercicio profesional o estudios avanzados en Derecho', 'Computadora con navegador actualizado'],
    incluye: ['9 clases grabadas', 'Biblioteca de prompts jurídicos (PDF)', 'Checklist de confidencialidad', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Punto de partida', [['Qué hace y qué no hace un modelo de lenguaje', '20 min', 'video', true], ['Confidencialidad y datos del cliente', '18 min', 'lectura'], ['Cómo se escribe un buen prompt jurídico', '24 min']]],
      ['Documentos', [['Resumir expedientes largos', '26 min'], ['Comparar versiones de un contrato', '23 min'], ['Borradores de escritos con tu estilo', '28 min']]],
      ['Tu estudio', [['Plantillas y biblioteca de prompts', '25 min'], ['Control de calidad: revisar siempre', '19 min', 'lectura'], ['Flujo completo de un caso', '27 min']]]
    ])
  },
  {
    id: 6, slug: 'agentes-de-ia-para-atencion-al-publico', titulo: 'Agentes de IA para Atención al Público',
    area: 'ia', nivel: 'Intermedio', modalidad: 'Grabado', precio: 59900, descuento: 20, duracion: '8 h', rango: 'corta',
    docenteId: 'd2', portada: 'images/agentesatencion.webp', destacado: true, nuevo: false,
    descripcionCorta: 'Armá un asistente que responda consultas, tome pedidos y derive cuando hace falta.',
    descripcionCompleta: 'De la consulta repetida al agente que la resuelve. Vas a diseñar el guion, cargar la información del negocio, definir cuándo deriva a una persona y medir si está funcionando.',
    resultados: ['Diseñar el guion y los límites de un agente', 'Cargar la base de conocimiento del negocio', 'Definir la derivación a una persona y medir resultados'],
    requisitos: ['Manejo básico de herramientas web', 'Un negocio o área real para practicar'],
    incluye: ['9 clases grabadas', 'Plantilla de guion de atención', 'Checklist de puesta en marcha', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Diseño', [['Qué consultas conviene automatizar', '21 min', 'video', true], ['El guion: tono, límites y respuestas', '25 min'], ['Base de conocimiento del negocio', '23 min']]],
      ['Armado', [['Configurar el agente paso a paso', '30 min'], ['Preguntas frecuentes y casos borde', '24 min'], ['Cuándo derivar a una persona', '18 min', 'lectura']]],
      ['Puesta en marcha', [['Pruebas con casos reales', '26 min'], ['Métricas: qué mirar cada semana', '20 min'], ['Mantenimiento y actualización', '22 min']]]
    ])
  },
  {
    id: 7, slug: 'ia-para-emprendedores-negocios-y-estudiantes', titulo: 'IA para Emprendedores, Negocios y Estudiantes',
    area: 'ia', nivel: 'Inicial', modalidad: 'Grabado', precio: 39900, descuento: 0, duracion: '6 h', rango: 'corta',
    docenteId: 'd2', portada: 'images/iaemprendedores.webp', destacado: false, nuevo: false,
    descripcionCorta: 'El curso de entrada: usar IA todos los días sin ser técnico.',
    descripcionCompleta: 'Para el que arranca. Textos, ideas, imágenes, planillas y organización del día a día, con ejemplos de un emprendimiento chico y de la vida académica.',
    resultados: ['Escribir prompts que devuelvan algo usable', 'Resolver textos, ideas y planillas más rápido', 'Armar tu rutina de trabajo con IA'],
    requisitos: ['No necesitás conocimientos técnicos', 'Computadora o celular con internet'],
    incluye: ['9 clases grabadas', 'Recetario de prompts (PDF)', 'Ejercicios por rubro', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Primeros pasos', [['Qué le podés pedir y qué no', '18 min', 'video', true], ['Anatomía de un buen prompt', '22 min'], ['Errores típicos del principiante', '16 min', 'lectura']]],
      ['En tu negocio', [['Textos de venta y respuestas a clientes', '24 min'], ['Ideas de contenido y planificación', '21 min'], ['Planillas, listas y presupuestos', '23 min']]],
      ['En tu estudio', [['Resumir y estudiar material largo', '20 min'], ['Preparar trabajos y presentaciones', '22 min'], ['Tu rutina semanal con IA', '19 min']]]
    ])
  },
  {
    id: 8, slug: 'agentes-para-instituciones-y-centros-de-salud', titulo: 'Agentes de IA para Instituciones Educativas y Centros de Salud',
    area: 'ia', nivel: 'Avanzado', modalidad: 'En vivo', precio: null, descuento: 0, duracion: 'A medida', rango: 'media',
    docenteId: 'd2', portada: 'images/agentessalud.webp', destacado: false, nuevo: true, incompany: true,
    descripcionCorta: 'Implementación acompañada para escuelas, institutos y centros de salud.',
    descripcionCompleta: 'Programa para instituciones: relevamiento de las consultas que hoy saturan la mesa de entrada, diseño del agente, capacitación del personal y puesta en marcha acompañada, con criterios claros sobre datos sensibles.',
    resultados: ['Descomprimir turnos, consultas y trámites repetidos', 'Capacitar al personal que va a usar el agente', 'Dejar reglas claras sobre datos sensibles'],
    requisitos: ['Programa para instituciones, no para inscripción individual', 'Referente interno del proyecto'],
    incluye: ['Relevamiento inicial', 'Diseño e implementación acompañada', 'Capacitación al personal', 'Protocolo de datos sensibles'],
    modulos: P([
      ['Relevamiento', [['Mapa de consultas frecuentes', '60 min', 'lectura', true], ['Circuito actual y cuellos de botella', '45 min', 'lectura'], ['Criterios sobre datos sensibles', '45 min', 'lectura']]],
      ['Implementación', [['Diseño del agente institucional', '90 min'], ['Integración con el circuito existente', '60 min'], ['Pruebas con casos reales', '60 min']]],
      ['Personal', [['Capacitación al equipo de atención', '90 min'], ['Manual interno de uso', '45 min', 'pdf'], ['Seguimiento a 30 días', '45 min']]]
    ])
  },
  {
    id: 9, slug: 'diplomatura-en-ia-aplicada', titulo: 'Diplomatura en IA Aplicada',
    area: 'ia', nivel: 'Avanzado', modalidad: 'Híbrido', precio: 149000, descuento: 12, duracion: '28 h', rango: 'larga',
    docenteId: 'd2', portada: 'images/diplomaia.webp', destacado: true, nuevo: false,
    descripcionCorta: 'El recorrido completo: prompts, agentes, automatizaciones y un proyecto de tu profesión.',
    descripcionCompleta: 'Integra todo el área en un programa largo. Cada módulo cierra con una entrega aplicada a tu profesión, y el proyecto final es un flujo de trabajo funcionando en tu contexto real.',
    resultados: ['Diseñar flujos de trabajo con IA para tu profesión', 'Construir y mantener un agente propio', 'Presentar un proyecto final funcionando'],
    requisitos: ['Manejo fluido de computadora', 'Tener un ámbito real donde aplicar el proyecto'],
    incluye: ['5 módulos con clases grabadas', '4 encuentros en vivo', 'Proyecto final con devolución', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Fundamentos', [['Cómo razona un modelo de lenguaje', '26 min', 'video', true], ['Prompts avanzados y contexto', '30 min'], ['Límites, errores y verificación', '22 min', 'lectura']]],
      ['Documentos y datos', [['Trabajar con documentos largos', '28 min'], ['Datos y planillas asistidas', '25 min'], ['Informes automáticos', '24 min']]],
      ['Agentes', [['Anatomía de un agente', '27 min'], ['Base de conocimiento y memoria', '29 min'], ['Derivación y control humano', '23 min']]],
      ['Automatización', [['Conectar herramientas del día a día', '30 min'], ['Flujos que corren solos', '26 min'], ['Costos y mantenimiento', '20 min', 'lectura']]],
      ['Proyecto final', [['Definición del caso', '25 min', 'lectura'], ['Construcción acompañada', '35 min'], ['Presentación y devolución', '30 min']]]
    ])
  },
  {
    id: 10, slug: 'excel-medio-y-avanzado', titulo: 'Excel Medio y Avanzado',
    area: 'mkt', nivel: 'Intermedio', modalidad: 'Grabado', precio: 42900, descuento: 15, duracion: '10 h', rango: 'media',
    docenteId: 'd3', portada: 'images/excel.webp', destacado: true, nuevo: false,
    descripcionCorta: 'De las fórmulas que ya usás a tablas dinámicas, BUSCARX y tableros.',
    descripcionCompleta: 'El curso que más piden las áreas administrativas. Arranca donde termina el nivel básico: funciones combinadas, tablas dinámicas, validaciones y un tablero final que se actualiza solo.',
    resultados: ['Combinar funciones para resolver casos reales', 'Armar tablas dinámicas y segmentaciones', 'Entregar un tablero que se actualiza con datos nuevos'],
    requisitos: ['Manejo básico de planillas', 'Excel de escritorio o Google Sheets'],
    incluye: ['12 clases grabadas', 'Planillas de práctica descargables', 'Casos resueltos paso a paso', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Funciones que resuelven', [['Referencias absolutas y relativas', '20 min', 'video', true], ['SI, Y, O y anidados sin marearse', '26 min'], ['BUSCARX y búsquedas modernas', '28 min']]],
      ['Datos ordenados', [['Formato de tabla y datos limpios', '22 min'], ['Validación de datos y listas', '24 min'], ['Quitar duplicados y errores', '19 min']]],
      ['Análisis', [['Tablas dinámicas desde cero', '30 min'], ['Segmentaciones y agrupaciones', '25 min'], ['Gráficos que se entienden', '23 min']]],
      ['Tablero final', [['Diseño del tablero', '27 min'], ['Automatizar la actualización', '26 min'], ['Entrega y presentación', '20 min', 'lectura']]]
    ])
  },
  {
    id: 11, slug: 'marketing-digital-mas-ia', titulo: 'Marketing Digital + IA',
    area: 'mkt', nivel: 'Intermedio', modalidad: 'Grabado', precio: 52900, descuento: 0, duracion: '9 h', rango: 'media',
    docenteId: 'd3', portada: 'images/marketingia.webp', destacado: true, nuevo: true,
    descripcionCorta: 'Estrategia, contenidos y campañas, con IA metida en cada paso del proceso.',
    descripcionCompleta: 'Un plan de marketing que se puede ejecutar con un equipo chico: definición de público, calendario, contenidos y campañas, usando IA para producir más rápido sin perder la voz de la marca.',
    resultados: ['Escribir un plan de marketing en una página', 'Producir un mes de contenidos en una tarde', 'Leer los números y corregir el rumbo'],
    requisitos: ['Manejo de redes a nivel usuario', 'Una marca o proyecto para aplicar'],
    incluye: ['9 clases grabadas', 'Plantilla de plan y calendario', 'Prompts de marca', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Estrategia', [['A quién le hablás realmente', '22 min', 'video', true], ['Propuesta de valor en una línea', '24 min'], ['Plan en una página', '26 min']]],
      ['Contenidos', [['Calendario que se puede sostener', '23 min'], ['Producción asistida con IA', '28 min'], ['Voz de marca: que no suene a robot', '21 min']]],
      ['Campañas', [['Del contenido a la campaña', '25 min'], ['Presupuesto chico bien usado', '22 min'], ['Métricas y decisiones', '24 min']]]
    ])
  },
  {
    id: 12, slug: 'creacion-de-contenidos-con-ia', titulo: 'Creación de Contenidos con IA',
    area: 'mkt', nivel: 'Inicial', modalidad: 'Grabado', precio: 37900, descuento: 0, duracion: '6 h', rango: 'corta',
    docenteId: 'd3', portada: 'images/contenidos.webp', destacado: false, nuevo: true,
    descripcionCorta: 'Guiones, piezas y edición: producí contenido propio sin equipo de producción.',
    descripcionCompleta: 'Del guion al video publicado. Ideas, textos, imágenes y edición asistida por IA, con un flujo que podés repetir todas las semanas vos solo.',
    resultados: ['Escribir guiones cortos que retienen', 'Generar piezas visuales coherentes con tu marca', 'Editar y publicar con un flujo repetible'],
    requisitos: ['Celular con cámara', 'No necesitás experiencia en edición'],
    incluye: ['9 clases grabadas', 'Guionero de formatos', 'Preset de estilo visual', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['La idea', [['Formatos que funcionan hoy', '19 min', 'video', true], ['Guiones de 30 segundos', '23 min'], ['Ganchos: los primeros 3 segundos', '18 min']]],
      ['La producción', [['Grabar bien con el celular', '24 min'], ['Imágenes generadas con criterio', '26 min'], ['Coherencia visual de la marca', '21 min']]],
      ['La publicación', [['Edición asistida paso a paso', '27 min'], ['Textos, títulos y descripciones', '20 min'], ['Tu flujo semanal', '18 min', 'lectura']]]
    ])
  },
  {
    id: 13, slug: 'meta-ads', titulo: 'Meta Ads',
    area: 'mkt', nivel: 'Intermedio', modalidad: 'Grabado', precio: 44900, descuento: 10, duracion: '7 h', rango: 'corta',
    docenteId: 'd3', portada: 'images/metaads.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Campañas en Instagram y Facebook: estructura, públicos, creativos y lectura de resultados.',
    descripcionCompleta: 'Publicidad en el ecosistema Meta con presupuestos reales de pyme. Cómo se estructura una campaña, cómo se arman los públicos, qué creativo conviene y cómo saber si está rindiendo antes de gastar de más.',
    resultados: ['Estructurar campañas, conjuntos y anuncios', 'Armar públicos y retargeting', 'Leer las métricas y optimizar sobre la marcha'],
    requisitos: ['Cuenta de Instagram o Facebook del negocio', 'Presupuesto de prueba para practicar'],
    incluye: ['9 clases grabadas', 'Checklist de lanzamiento', 'Plantilla de reporte', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Cimientos', [['Cómo se ordena una cuenta publicitaria', '21 min', 'video', true], ['Objetivos: elegir el correcto', '23 min'], ['Presupuesto y puja sin misterio', '22 min']]],
      ['Públicos y creativos', [['Públicos fríos, tibios y calientes', '26 min'], ['Retargeting bien hecho', '24 min'], ['Creativos que frenan el scroll', '25 min']]],
      ['Resultados', [['Métricas que importan de verdad', '23 min'], ['Optimizar sin romper la campaña', '21 min'], ['Reporte para el cliente o el jefe', '19 min', 'pdf']]]
    ])
  },
  {
    id: 14, slug: 'google-ads', titulo: 'Google Ads',
    area: 'mkt', nivel: 'Intermedio', modalidad: 'Grabado', precio: 44900, descuento: 0, duracion: '7 h', rango: 'corta',
    docenteId: 'd3', portada: 'images/googleads.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Captar a quien ya está buscando lo que vendés: búsqueda, palabras clave y conversiones.',
    descripcionCompleta: 'El curso de intención de compra. Palabras clave, concordancias, anuncios y medición de conversiones, con foco en campañas de búsqueda para servicios y comercios.',
    resultados: ['Elegir palabras clave con intención de compra', 'Escribir anuncios que ganen el clic correcto', 'Medir conversiones y bajar el costo por consulta'],
    requisitos: ['Un sitio, catálogo o WhatsApp de destino', 'Manejo básico de planillas'],
    incluye: ['9 clases grabadas', 'Planilla de palabras clave', 'Checklist de conversiones', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Búsqueda', [['Intención de búsqueda y embudo', '22 min', 'video', true], ['Palabras clave y concordancias', '27 min'], ['Negativas: dónde se va la plata', '20 min']]],
      ['Anuncios', [['Títulos y descripciones que rinden', '24 min'], ['Extensiones y calidad del anuncio', '22 min'], ['Página de destino: el otro 50%', '23 min']]],
      ['Medición', [['Configurar conversiones', '26 min'], ['Optimización semanal', '21 min'], ['Reporte y decisiones', '18 min', 'pdf']]]
    ])
  },
  {
    id: 15, slug: 'google-workspace', titulo: 'Google Workspace',
    area: 'mkt', nivel: 'Inicial', modalidad: 'Grabado', precio: 32900, descuento: 0, duracion: '6 h', rango: 'corta',
    docenteId: 'd3', portada: 'images/workspace.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Documentos, planillas, formularios y drive: la oficina en la nube, ordenada.',
    descripcionCompleta: 'Para equipos que trabajan con archivos dando vueltas por WhatsApp. Estructura de carpetas, permisos, documentos colaborativos, formularios que alimentan planillas y calendarios compartidos.',
    resultados: ['Ordenar el drive del equipo con permisos claros', 'Trabajar en documentos y planillas en simultáneo', 'Armar formularios que cargan datos solos'],
    requisitos: ['Cuenta de Google', 'No necesitás experiencia previa'],
    incluye: ['9 clases grabadas', 'Estructura de carpetas modelo', 'Formularios de ejemplo', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Orden', [['Estructura de carpetas del equipo', '20 min', 'video', true], ['Permisos y accesos sin sustos', '22 min'], ['Buscar y encontrar rápido', '16 min']]],
      ['Trabajo colaborativo', [['Documentos a varias manos', '23 min'], ['Planillas compartidas y protegidas', '25 min'], ['Comentarios y control de versiones', '18 min']]],
      ['Automatismos simples', [['Formularios que alimentan planillas', '26 min'], ['Calendarios y reservas del equipo', '21 min'], ['Rutina de trabajo semanal', '17 min', 'lectura']]]
    ])
  },
  {
    id: 16, slug: 'gastronomia', titulo: 'Gastronomía',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Grabado', precio: 56900, descuento: 15, duracion: '22 h', rango: 'larga',
    docenteId: 'd4', portada: 'images/gastronomia.webp', destacado: true, nuevo: false,
    descripcionCorta: 'Cocina profesional de base: técnicas, higiene y ritmo de servicio.',
    descripcionCompleta: 'El oficio con más salida afuera. Cortes, cocciones, mise en place, control de temperaturas y organización de una cocina en servicio, con el vocabulario técnico que se usa en cocinas internacionales.',
    resultados: ['Dominar cortes, fondos y cocciones básicas', 'Trabajar con normas de higiene y control de temperaturas', 'Sostener el ritmo de un servicio con mise en place'],
    requisitos: ['No necesitás experiencia previa', 'Cocina en casa para practicar'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Recetario técnico (PDF)', 'Guía de higiene y seguridad alimentaria', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['La cocina', [['Vocabulario técnico y roles de la brigada', '22 min', 'video', true], ['Cuchillos, cortes y afilado', '28 min'], ['Higiene y seguridad alimentaria', '25 min', 'lectura']]],
      ['Técnicas', [['Fondos, caldos y salsas madre', '30 min'], ['Cocciones: calor seco y húmedo', '29 min'], ['Punto de carnes y pescados', '27 min']]],
      ['Producción', [['Mise en place y organización', '24 min'], ['Control de temperaturas y conservación', '23 min'], ['Emplatado y estándar del plato', '26 min']]],
      ['Servicio', [['Ritmo de servicio y comandas', '25 min'], ['Costos del plato y desperdicio', '22 min', 'lectura'], ['Cómo se trabaja en cocinas del exterior', '24 min']]]
    ])
  },
  {
    id: 17, slug: 'cuidado-de-adultos-mayores', titulo: 'Cuidado de Adultos Mayores',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Híbrido', precio: 49900, descuento: 0, duracion: '20 h', rango: 'media',
    docenteId: 'd4', portada: 'images/cuidado.webp', destacado: true, nuevo: true,
    descripcionCorta: 'Acompañamiento domiciliario con criterio: movilidad, higiene, medicación y trato.',
    descripcionCompleta: 'Una de las demandas más firmes en Europa y Estados Unidos. Trabajás movilización segura, higiene y confort, control de medicación indicada, alimentación, señales de alarma y, sobre todo, el trato con la persona y su familia.',
    resultados: ['Asistir en movilidad e higiene sin lastimar ni lastimarte', 'Organizar rutinas, medicación indicada y alimentación', 'Reconocer señales de alarma y a quién avisar'],
    requisitos: ['Mayor de 18 años', 'No necesitás formación previa en salud'],
    incluye: ['12 clases grabadas + 2 encuentros en vivo', 'Manual de rutinas y registro diario', 'Guía de comunicación con la familia', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['El rol', [['Qué hace y qué no hace un cuidador', '20 min', 'video', true], ['Trato, dignidad y autonomía', '24 min'], ['Comunicación con la familia', '22 min']]],
      ['Cuidado diario', [['Movilización segura y prevención de caídas', '28 min'], ['Higiene, confort y descanso', '26 min'], ['Alimentación e hidratación', '23 min']]],
      ['Salud', [['Medicación indicada: registro y horarios', '25 min', 'lectura'], ['Señales de alarma y a quién avisar', '27 min'], ['Deterioro cognitivo: cómo acompañar', '26 min']]],
      ['Trabajo', [['Registro diario y entrega de turno', '19 min', 'pdf'], ['Cuidar al que cuida', '21 min'], ['Cómo se contrata el oficio afuera', '23 min', 'lectura']]]
    ])
  },
  {
    id: 18, slug: 'auxiliar-en-farmacia', titulo: 'Auxiliar en Farmacia',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Grabado', precio: 47900, descuento: 10, duracion: '18 h', rango: 'media',
    docenteId: 'd4', portada: 'images/farmacia.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Mostrador, stock y trazabilidad: el trabajo diario del auxiliar.',
    descripcionCompleta: 'Formación para el puesto de auxiliar: atención en mostrador, lectura de recetas, conservación y control de stock, cadena de frío y el vocabulario técnico que se maneja en el rubro.',
    resultados: ['Atender el mostrador con criterio y derivar al farmacéutico', 'Controlar stock, vencimientos y cadena de frío', 'Manejar el vocabulario técnico del rubro'],
    requisitos: ['Secundario completo recomendado', 'No requiere experiencia previa'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Glosario técnico (PDF)', 'Planilla de control de stock', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['El rubro', [['Roles dentro de la farmacia', '19 min', 'video', true], ['Qué puede y qué no puede hacer un auxiliar', '22 min', 'lectura'], ['Vocabulario técnico esencial', '24 min']]],
      ['Mostrador', [['Atención y derivación al farmacéutico', '26 min'], ['Lectura de recetas y obras sociales', '25 min'], ['Venta de accesorios y perfumería', '20 min']]],
      ['Depósito', [['Recepción de mercadería y control', '23 min'], ['Vencimientos y rotación', '21 min'], ['Cadena de frío y conservación', '24 min']]],
      ['Sistemas', [['Carga en el sistema y trazabilidad', '25 min'], ['Inventario y faltantes', '20 min', 'pdf'], ['Cierre de caja y turnos', '18 min']]]
    ])
  },
  {
    id: 19, slug: 'panaderia-y-pasteleria', titulo: 'Panadería y Pastelería',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Grabado', precio: 52900, descuento: 0, duracion: '20 h', rango: 'media',
    docenteId: 'd4', portada: 'images/panaderia.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Masas, fermentos y horno: producción de panadería con estándar profesional.',
    descripcionCompleta: 'Del amasado al horneado, con las cuentas del obrador: porcentaje panadero, fermentaciones, laminados y las piezas clásicas de pastelería que sostienen una vidriera.',
    resultados: ['Manejar masas y fermentaciones con porcentaje panadero', 'Producir facturas y panes con estándar constante', 'Calcular costos y rendimiento de cada pieza'],
    requisitos: ['No necesitás experiencia previa', 'Horno doméstico y balanza para practicar'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Recetario con porcentaje panadero', 'Planilla de costos por pieza', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Fundamentos', [['Harinas, agua, sal y levadura', '22 min', 'video', true], ['Porcentaje panadero sin miedo', '26 min'], ['Amasado y punto de masa', '28 min']]],
      ['Panes', [['Fermentaciones: tiempo y temperatura', '27 min'], ['Formado y greñado', '25 min'], ['Horneado y vapor', '24 min']]],
      ['Facturas y laminados', [['Masa laminada paso a paso', '30 min'], ['Rellenos y terminaciones', '23 min'], ['Producción del turno mañana', '22 min']]],
      ['Pastelería y obrador', [['Bizcochuelos, cremas y tortas base', '28 min'], ['Vidriera: qué se vende y cuándo', '20 min', 'lectura'], ['Costos y rendimiento por pieza', '24 min', 'pdf']]]
    ])
  },
  {
    id: 20, slug: 'barberia-y-peluqueria', titulo: 'Barbería y Peluquería',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Grabado', precio: 54900, descuento: 20, duracion: '19 h', rango: 'media',
    docenteId: 'd4', portada: 'images/barberia.webp', destacado: true, nuevo: false,
    descripcionCorta: 'Cortes, degradados y barba: el oficio que se cobra en cualquier ciudad.',
    descripcionCompleta: 'Técnica de corte con máquina y tijera, degradados prolijos, arreglo y perfilado de barba, higiene del puesto y atención del cliente. Terminás con un porfolio de trabajos propios.',
    resultados: ['Ejecutar degradados y cortes clásicos con prolijidad', 'Perfilar y arreglar barba con navaja', 'Armar tu porfolio y tu agenda de clientes'],
    requisitos: ['Kit básico de máquina, tijera y peine', 'Modelos para practicar'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Guía de kit y mantenimiento', 'Plantilla de porfolio', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['El puesto', [['Herramientas, filos y mantenimiento', '21 min', 'video', true], ['Higiene y desinfección', '19 min', 'lectura'], ['Diagnóstico capilar y consulta inicial', '23 min']]],
      ['Corte', [['Máquina: números, guías y presión', '27 min'], ['Degradado paso a paso', '30 min'], ['Tijera sobre peine y texturizado', '28 min']]],
      ['Barba', [['Perfilado y diseño de líneas', '25 min'], ['Navaja y toalla caliente', '24 min'], ['Productos y cuidado posterior', '18 min']]],
      ['El negocio', [['Fotos y porfolio de trabajos', '20 min'], ['Agenda, precios y clientes que vuelven', '22 min'], ['Trabajar en una barbería del exterior', '21 min', 'lectura']]]
    ])
  },
  {
    id: 21, slug: 'electricidad', titulo: 'Electricidad',
    area: 'ofe', nivel: 'Intermedio', modalidad: 'Grabado', precio: 57900, descuento: 0, duracion: '24 h', rango: 'larga',
    docenteId: 'd4', portada: 'images/electricidad.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Instalaciones domiciliarias seguras: tablero, circuitos, protecciones y medición.',
    descripcionCompleta: 'Formación de electricista domiciliario con foco en seguridad: cálculo de circuitos, armado de tablero, protecciones diferenciales y termomagnéticas, puesta a tierra y diagnóstico de fallas con instrumento.',
    resultados: ['Armar un tablero con protecciones correctas', 'Calcular secciones y circuitos de una vivienda', 'Diagnosticar fallas con multímetro y pinza'],
    requisitos: ['Mayor de 18 años', 'Herramienta básica y multímetro'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Planos y esquemas unifilares', 'Guía de seguridad eléctrica', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Seguridad primero', [['Riesgo eléctrico y trabajo seguro', '24 min', 'video', true], ['Herramienta y elementos de protección', '20 min'], ['Magnitudes: tensión, corriente y potencia', '26 min']]],
      ['Circuitos', [['Cálculo de secciones y consumo', '28 min'], ['Circuitos de una vivienda', '27 min'], ['Canalizaciones y cableado prolijo', '25 min']]],
      ['Tablero', [['Termomagnéticas y diferencial', '29 min'], ['Armado del tablero paso a paso', '30 min'], ['Puesta a tierra', '26 min']]],
      ['Diagnóstico', [['Medición con multímetro y pinza', '27 min'], ['Fallas típicas y cómo aislarlas', '25 min'], ['Normas y prácticas del exterior', '22 min', 'lectura']]]
    ])
  },
  {
    id: 22, slug: 'plomeria', titulo: 'Plomería',
    area: 'ofe', nivel: 'Inicial', modalidad: 'Grabado', precio: 53900, descuento: 0, duracion: '20 h', rango: 'media',
    docenteId: 'd4', portada: 'images/plomeria.webp', destacado: false, nuevo: false,
    descripcionCorta: 'Agua fría y caliente, desagües y reparaciones que se pagan bien.',
    descripcionCompleta: 'Materiales y uniones actuales, instalación de agua y desagües, artefactos, detección de pérdidas y las reparaciones que más se piden en el mantenimiento domiciliario.',
    resultados: ['Instalar y reparar cañerías de agua fría y caliente', 'Resolver desagües, sifones y destapaciones', 'Detectar pérdidas y presupuestar el trabajo'],
    requisitos: ['No necesitás experiencia previa', 'Herramienta básica'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Guía de materiales y uniones', 'Planilla de presupuesto', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Materiales', [['Caños, uniones y herramientas', '22 min', 'video', true], ['Termofusión y roscado', '27 min'], ['Lectura de una instalación', '23 min']]],
      ['Agua', [['Distribución de agua fría y caliente', '26 min'], ['Presión, bombas y tanques', '25 min'], ['Instalación de artefactos', '28 min']]],
      ['Desagües', [['Pendientes, sifones y ventilación', '26 min'], ['Destapaciones sin romper', '24 min'], ['Pluviales y rejillas', '20 min']]],
      ['Oficio', [['Detección de pérdidas', '25 min'], ['Presupuestar y cobrar', '21 min', 'pdf'], ['Normas y hábitos del exterior', '20 min', 'lectura']]]
    ])
  },
  {
    id: 23, slug: 'soldadura', titulo: 'Soldadura',
    area: 'ofe', nivel: 'Intermedio', modalidad: 'Grabado', precio: 59900, descuento: 10, duracion: '22 h', rango: 'larga',
    docenteId: 'd4', portada: 'images/soldadura.webp', destacado: true, nuevo: false,
    descripcionCorta: 'Electrodo, MIG y TIG: el oficio industrial más buscado afuera.',
    descripcionCompleta: 'Procesos de soldadura desde la seguridad y la preparación de la junta hasta el cordón terminado. Práctica progresiva en las posiciones que se evalúan en las pruebas de ingreso del exterior.',
    resultados: ['Soldar con electrodo revestido, MIG y TIG en posiciones básicas', 'Preparar juntas y elegir el material de aporte', 'Detectar y corregir defectos del cordón'],
    requisitos: ['Mayor de 18 años', 'Acceso a un taller para las prácticas'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Tabla de parámetros por proceso', 'Guía de defectos y correcciones', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Seguridad y equipos', [['Riesgos, EPP y ventilación', '23 min', 'video', true], ['Máquinas y regulación de parámetros', '27 min'], ['Preparación de juntas', '25 min']]],
      ['Electrodo', [['Encendido, arco y avance', '28 min'], ['Posición plana y horizontal', '30 min'], ['Defectos típicos del cordón', '24 min']]],
      ['MIG y TIG', [['MIG: gas, alambre y velocidad', '29 min'], ['TIG: precisión en chapa fina', '30 min'], ['Aluminio e inoxidable', '26 min']]],
      ['Oficio', [['Lectura de planos y símbolos', '25 min', 'lectura'], ['Control de calidad del cordón', '24 min'], ['Cómo son las pruebas de ingreso afuera', '22 min', 'lectura']]]
    ])
  },
  {
    id: 24, slug: 'refrigeracion', titulo: 'Refrigeración',
    area: 'ofe', nivel: 'Intermedio', modalidad: 'Grabado', precio: 56900, descuento: 0, duracion: '21 h', rango: 'larga',
    docenteId: 'd4', portada: 'images/refrigeracion.webp', destacado: false, nuevo: true,
    descripcionCorta: 'Aire acondicionado y frío comercial: instalación, carga y diagnóstico.',
    descripcionCompleta: 'Ciclo de refrigeración explicado para trabajar: instalación de equipos split, vacío y carga de gas, medición de presiones y diagnóstico de las fallas más frecuentes en frío hogareño y comercial.',
    resultados: ['Instalar y poner en marcha un equipo split', 'Hacer vacío, carga y medición de presiones', 'Diagnosticar fallas frecuentes con instrumento'],
    requisitos: ['Herramienta básica y manómetros', 'Conocimientos eléctricos básicos recomendados'],
    incluye: ['12 clases grabadas + prácticas guiadas', 'Tabla de presiones por refrigerante', 'Checklist de instalación', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['El ciclo', [['Cómo enfría un equipo', '24 min', 'video', true], ['Componentes: compresor, condensador, evaporador', '27 min'], ['Refrigerantes y buenas prácticas', '22 min', 'lectura']]],
      ['Instalación', [['Elección del lugar y soportes', '23 min'], ['Cañerías, abocardado y conexiones', '28 min'], ['Vacío, carga y puesta en marcha', '30 min']]],
      ['Diagnóstico', [['Medición de presiones y temperaturas', '27 min'], ['Fallas eléctricas del equipo', '26 min'], ['Fugas: detección y reparación', '25 min']]],
      ['Servicio', [['Mantenimiento preventivo', '21 min'], ['Frío comercial: cámaras y exhibidoras', '26 min'], ['Presupuesto y garantía del trabajo', '19 min', 'pdf']]]
    ])
  },
  {
    id: 25, slug: 'paneles-solares', titulo: 'Paneles Solares',
    area: 'ofe', nivel: 'Avanzado', modalidad: 'Híbrido', precio: 62900, descuento: 15, duracion: '18 h', rango: 'media',
    docenteId: 'd4', portada: 'images/solares.webp', destacado: true, nuevo: true,
    descripcionCorta: 'Energía solar fotovoltaica: dimensionado, montaje y puesta en marcha.',
    descripcionCompleta: 'El oficio que más crece. Dimensionás una instalación según consumo, elegís paneles e inversor, montás la estructura con seguridad en altura y dejás el sistema funcionando y medido.',
    resultados: ['Dimensionar una instalación según el consumo real', 'Montar estructura y paneles con seguridad en altura', 'Configurar el inversor y verificar la generación'],
    requisitos: ['Conocimientos eléctricos básicos', 'Aptitud para trabajo en altura'],
    incluye: ['12 clases grabadas + 1 encuentro en vivo', 'Planilla de dimensionado', 'Checklist de puesta en marcha', 'Certificado de RED MILENIUM'],
    modulos: P([
      ['Fundamentos', [['Cómo genera un panel fotovoltaico', '23 min', 'video', true], ['Tipos de sistema: aislado, on-grid e híbrido', '26 min'], ['Radiación, orientación e inclinación', '24 min']]],
      ['Dimensionado', [['Consumo real de la vivienda', '27 min'], ['Cálculo de paneles, inversor y baterías', '30 min'], ['Presupuesto y retorno de la inversión', '22 min', 'pdf']]],
      ['Montaje', [['Seguridad en altura', '21 min', 'lectura'], ['Estructura y fijaciones', '28 min'], ['Cableado, protecciones y puesta a tierra', '29 min']]],
      ['Puesta en marcha', [['Configuración del inversor', '26 min'], ['Medición y monitoreo de generación', '24 min'], ['Mantenimiento y limpieza', '18 min']]]
    ])
  }
];
