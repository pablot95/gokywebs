const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491156690586';
const wa = t => `https://wa.me/${WSP}?text=${encodeURIComponent(t)}`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = (id, extra = '') => `<svg class="ic${extra}" aria-hidden="true"><use href="#${id}"/></svg>`;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const AREAS = {
  prevencion: 'Prevención del suicidio',
  crisis: 'Crisis y catástrofes',
  psicoeducacion: 'Psicoeducación',
  clinica: 'Formación clínica',
  instituciones: 'Universidades y organismos'
};
const MODO_IC = { 'Virtual en vivo': 'i-monitor', 'Presencial': 'i-users', 'Híbrida': 'i-mix' };
const TIPO_IC = { video: 'i-video', lectura: 'i-book', pdf: 'i-file', audio: 'i-audio' };
const TIPO_TXT = { video: 'Video', lectura: 'Lectura', pdf: 'PDF', audio: 'Audio' };
const mod = (titulo, clases) => ({ titulo, clases: clases.map(([t, d, tipo, preview]) => ({ titulo: t, duracion: d, tipo, preview: !!preview })) });

const CURSOS = [
  {
    id: 'c1', slug: 'prevencion-del-suicidio', titulo: 'Prevención del suicidio: detectar, abordar y derivar', categoria: 'prevencion', nivel: 'Intermedio', modalidad: 'Híbrida', precio: 180000, descuento: 0, duracion: '8 semanas',
    portada: 'aula.webp', alt: 'Aula de capacitación con mesas largas y cuadernos', destacado: true, badge: 'Presencial y en vivo',
    descripcionCorta: 'Herramientas para reconocer señales de riesgo, intervenir en una primera entrevista y derivar a tiempo.',
    descripcionCompleta: 'Una formación para profesionales de la salud, la educación y el trabajo social que necesitan actuar ante una persona en riesgo. Se trabaja sobre factores de riesgo y de protección, la conversación directa sobre ideación suicida, el plan de seguridad y la red de derivación.',
    resultados: ['Reconocer señales de alerta y factores de riesgo', 'Conducir una primera entrevista con preguntas directas y cuidadas', 'Armar un plan de seguridad y derivar a la red de atención'],
    requisitos: 'Profesionales y estudiantes avanzados de salud, educación o trabajo social.',
    incluye: ['Encuentros presenciales y en vivo por videollamada', 'Materiales de lectura en PDF', 'Casos para trabajar en grupo'],
    etiquetas: ['riesgo', 'entrevista', 'derivación', 'plan de seguridad'],
    modulos: [
      mod('Comprender el riesgo', [['Mitos y datos sobre el suicidio', 50, 'video', 1], ['Factores de riesgo y de protección', 45, 'video'], ['Guía de señales de alerta', 20, 'lectura']]),
      mod('La primera conversación', [['Preguntar directamente, sin miedo', 55, 'video'], ['Escucha y validación', 40, 'video'], ['Ejercicio con casos', 30, 'pdf']]),
      mod('Plan de seguridad y derivación', [['Cómo se arma un plan de seguridad', 50, 'video'], ['Mapear la red de derivación', 35, 'lectura'], ['Seguimiento después de la derivación', 40, 'video']])
    ]
  },
  {
    id: 'c2', slug: 'primeros-auxilios-psicologicos', titulo: 'Primeros auxilios psicológicos en catástrofes', categoria: 'crisis', nivel: 'Inicial', modalidad: 'Presencial', precio: 120000, descuento: 0, duracion: '3 jornadas',
    portada: 'taller.webp', alt: 'Mesa de taller con tarjetas de colores y marcadores', destacado: true, badge: 'Presencial',
    descripcionCorta: 'Cómo acompañar a personas afectadas en las primeras horas y días después de una emergencia.',
    descripcionCompleta: 'Taller práctico para voluntarios, equipos de rescate, docentes y profesionales que intervienen en emergencias y catástrofes naturales. Se aprende el modelo de primeros auxilios psicológicos: observar, escuchar y conectar con recursos, cuidando también al propio equipo.',
    resultados: ['Aplicar los pasos de los primeros auxilios psicológicos', 'Identificar a quienes necesitan atención especializada', 'Cuidar al equipo durante y después de la intervención'],
    requisitos: 'Voluntarios, equipos de emergencia y profesionales. No requiere formación previa en salud mental.',
    incluye: ['Tres jornadas presenciales con práctica en grupos', 'Cuadernillo de trabajo en PDF', 'Simulaciones de casos'],
    etiquetas: ['emergencias', 'desastres', 'voluntarios', 'PAP'],
    modulos: [
      mod('Qué pasa en una emergencia', [['Reacciones esperables ante una catástrofe', 40, 'video', 1], ['Grupos de mayor vulnerabilidad', 35, 'lectura'], ['El rol de quien acompaña', 30, 'video']]),
      mod('Observar, escuchar, conectar', [['Acercarse y presentarse', 45, 'video'], ['Escucha activa en contexto de crisis', 50, 'video'], ['Conectar con recursos y redes', 30, 'pdf']]),
      mod('Práctica y cuidado del equipo', [['Simulación de casos en grupo', 90, 'video'], ['Señales de desgaste en el equipo', 30, 'lectura'], ['Cierre y plan de autocuidado', 30, 'pdf']])
    ]
  },
  {
    id: 'c3', slug: 'psicoeducacion-escuelas-comunidades', titulo: 'Psicoeducación para escuelas y comunidades', categoria: 'psicoeducacion', nivel: 'Inicial', modalidad: 'Virtual en vivo', precio: 95000, descuento: 0, duracion: '6 semanas',
    portada: 'clase-virtual.webp', alt: 'Notebook con una videollamada grupal sobre un escritorio', destacado: true, badge: 'Nuevo',
    descripcionCorta: 'Cómo diseñar talleres y charlas de salud mental para estudiantes, familias y vecinos.',
    descripcionCompleta: 'Para docentes, equipos de orientación y referentes comunitarios que quieren hablar de salud mental con claridad y sin estigmas. Se diseña una propuesta de psicoeducación paso a paso, con materiales adaptados a cada edad y contexto.',
    resultados: ['Planificar un taller de psicoeducación de principio a fin', 'Adaptar el lenguaje a cada edad y comunidad', 'Detectar cuándo una situación necesita derivación'],
    requisitos: 'Docentes, equipos de orientación escolar, promotores de salud y referentes comunitarios.',
    incluye: ['Clases en vivo por videollamada', 'Grabación de cada encuentro', 'Plantillas de talleres en PDF'],
    etiquetas: ['escuela', 'docentes', 'familias', 'talleres'],
    modulos: [
      mod('Salud mental sin estigmas', [['Qué es la psicoeducación', 40, 'video', 1], ['Un lenguaje que cuida', 35, 'video'], ['Mitos frecuentes', 20, 'lectura']]),
      mod('Diseñar el taller', [['Objetivos y público', 45, 'video'], ['Dinámicas para grupos', 50, 'video'], ['Plantilla de planificación', 20, 'pdf']]),
      mod('En la escuela y en el barrio', [['Trabajo con familias', 40, 'video'], ['Cuándo y cómo derivar', 40, 'video'], ['Presentación del taller final', 60, 'video']])
    ]
  },
  {
    id: 'c4', slug: 'salud-mental-universidad', titulo: 'Salud mental en la universidad: programas de cuidado', categoria: 'instituciones', nivel: 'Intermedio', modalidad: 'Virtual en vivo', precio: 140000, descuento: 0, duracion: '5 semanas',
    portada: null,
    descripcionCorta: 'Bases para crear y sostener un programa de bienestar estudiantil en una casa de estudios.',
    descripcionCompleta: 'Pensado para equipos de gestión, bienestar estudiantil y docentes universitarios. Recorre cómo relevar necesidades, armar dispositivos de escucha y prevención, y coordinar con los servicios de salud de la zona.',
    resultados: ['Relevar las necesidades de salud mental de la comunidad universitaria', 'Diseñar un dispositivo de escucha y prevención', 'Coordinar la derivación con servicios de salud'],
    requisitos: 'Equipos de gestión, bienestar estudiantil, docentes y tutores universitarios.',
    incluye: ['Clases en vivo por videollamada', 'Modelos de protocolos en PDF', 'Consulta sobre el proyecto de cada institución'],
    etiquetas: ['universidad', 'estudiantes', 'bienestar', 'protocolo'],
    modulos: [
      mod('Diagnóstico institucional', [['La salud mental en la vida universitaria', 45, 'video', 1], ['Herramientas de relevamiento', 40, 'lectura'], ['Análisis de los datos propios', 35, 'pdf']]),
      mod('Dispositivos de cuidado', [['Espacios de escucha', 45, 'video'], ['Tutorías y acompañamiento entre pares', 40, 'video'], ['Protocolo ante situaciones de riesgo', 30, 'pdf']]),
      mod('Red y sostenimiento', [['Articulación con servicios de salud', 40, 'video'], ['Comunicación del programa', 35, 'video'], ['Plan de trabajo del primer año', 30, 'pdf']])
    ]
  },
  {
    id: 'c5', slug: 'posvencion', titulo: 'Posvención: acompañar después de una pérdida por suicidio', categoria: 'prevencion', nivel: 'Avanzado', modalidad: 'Híbrida', precio: 165000, descuento: 0, duracion: '6 semanas',
    portada: 'sala-escucha.webp', alt: 'Sala de escucha con dos sillones y una mesa baja', destacado: true, badge: 'Avanzado',
    descripcionCorta: 'Intervenciones para familias, escuelas y equipos de trabajo después de una muerte por suicidio.',
    descripcionCompleta: 'Una formación avanzada sobre el acompañamiento a sobrevivientes —familiares, amistades, compañeros— y a las instituciones afectadas. Incluye el duelo por suicidio, la intervención en escuelas y lugares de trabajo y la comunicación responsable.',
    resultados: ['Acompañar el duelo de familiares y allegados', 'Coordinar una intervención institucional después de una pérdida', 'Comunicar la noticia de forma cuidada y responsable'],
    requisitos: 'Profesionales de la salud mental con experiencia clínica o comunitaria.',
    incluye: ['Encuentros presenciales y en vivo por videollamada', 'Supervisión de casos en grupo', 'Bibliografía en PDF'],
    etiquetas: ['duelo', 'sobrevivientes', 'escuelas', 'posvención'],
    modulos: [
      mod('El duelo por suicidio', [['Particularidades del duelo', 50, 'video', 1], ['Culpa, estigma y silencio', 45, 'video'], ['Voces de sobrevivientes', 25, 'lectura']]),
      mod('Intervención en instituciones', [['Escuelas después de una pérdida', 50, 'video'], ['Lugares de trabajo', 40, 'video'], ['Protocolo de posvención', 30, 'pdf']]),
      mod('Comunicación y cuidado', [['Comunicar sin riesgo de imitación', 45, 'video'], ['Grupos de apoyo', 40, 'video'], ['Supervisión de casos', 60, 'video']]),
      mod('Acompañamiento a largo plazo', [['Fechas significativas', 35, 'video'], ['Red de apoyo y derivación', 35, 'lectura'], ['Cuidado del profesional', 40, 'video']])
    ]
  },
  {
    id: 'c6', slug: 'senales-de-alerta', titulo: 'Señales de alerta y cómo pedir ayuda', categoria: 'psicoeducacion', nivel: 'Abierto a la comunidad', modalidad: 'Virtual en vivo', precio: 0, descuento: 0, duracion: '3 encuentros',
    portada: null, badge: 'Gratuito',
    descripcionCorta: 'Curso breve y abierto para familias, jóvenes y cualquier persona que quiera saber cómo ayudar.',
    descripcionCompleta: 'Tres encuentros en vivo para aprender a reconocer cuándo alguien la está pasando mal, cómo acercarse a conversar y dónde pedir ayuda. Sin requisitos previos: está pensado para toda la comunidad.',
    resultados: ['Reconocer señales de que alguien necesita ayuda', 'Animarse a preguntar y a escuchar', 'Saber a qué servicios recurrir en tu país'],
    requisitos: 'Ninguno. Abierto a toda la comunidad.',
    incluye: ['Tres encuentros en vivo', 'Material de consulta en PDF', 'Listado de recursos por país'],
    etiquetas: ['gratis', 'familias', 'jóvenes', 'ayuda'],
    modulos: [
      mod('Reconocer', [['Cuándo preocuparse', 30, 'video', 1], ['Señales en adolescentes', 25, 'video'], ['Folleto de señales de alerta', 10, 'pdf']]),
      mod('Acercarse', [['Cómo empezar la conversación', 30, 'video'], ['Qué decir y qué evitar', 25, 'video'], ['Frases que ayudan', 10, 'lectura']]),
      mod('Pedir ayuda', [['Servicios y líneas de ayuda', 25, 'video'], ['Cuidarse a uno mismo', 20, 'audio'], ['Recursos por país', 10, 'pdf']])
    ]
  },
  {
    id: 'c7', slug: 'intervencion-en-crisis', titulo: 'Intervención en crisis: entrevista y plan de seguridad', categoria: 'clinica', nivel: 'Avanzado', modalidad: 'Presencial', precio: 150000, descuento: 10, duracion: '4 semanas',
    portada: null,
    descripcionCorta: 'Práctica clínica intensiva para la evaluación del riesgo y la intervención en crisis.',
    descripcionCompleta: 'Formación presencial para profesionales que atienden consultas en guardia, consultorio o dispositivos comunitarios. Se entrena la entrevista de evaluación, la intervención breve en crisis y el plan de seguridad, con práctica supervisada.',
    resultados: ['Evaluar el nivel de riesgo en una entrevista', 'Intervenir en una crisis con técnicas breves', 'Elaborar un plan de seguridad junto al consultante'],
    requisitos: 'Profesionales de psicología, psiquiatría, medicina, enfermería o trabajo social.',
    incluye: ['Cuatro encuentros presenciales', 'Role playing con supervisión', 'Instrumentos de evaluación en PDF'],
    etiquetas: ['guardia', 'clínica', 'evaluación', 'riesgo'],
    modulos: [
      mod('Evaluación del riesgo', [['La entrevista de evaluación', 60, 'video', 1], ['Instrumentos y escalas', 40, 'pdf'], ['Errores frecuentes', 30, 'lectura']]),
      mod('Intervención en crisis', [['Modelo de intervención breve', 55, 'video'], ['Contención emocional', 45, 'video'], ['Práctica en parejas', 60, 'video']]),
      mod('Plan de seguridad', [['Construir el plan con el consultante', 50, 'video'], ['Restricción de medios', 30, 'lectura'], ['Seguimiento y continuidad', 40, 'video']])
    ]
  },
  {
    id: 'c8', slug: 'cuidado-de-quienes-cuidan', titulo: 'Cuidado de quienes cuidan: prevenir el desgaste en equipos', categoria: 'clinica', nivel: 'Intermedio', modalidad: 'Virtual en vivo', precio: 85000, descuento: 0, duracion: '4 semanas',
    portada: null, badge: 'Nuevo',
    descripcionCorta: 'Herramientas para equipos de salud, emergencias y educación expuestos a situaciones de alto impacto.',
    descripcionCompleta: 'Un espacio para profesionales y equipos que acompañan situaciones difíciles todos los días. Se trabaja el desgaste por empatía, el agotamiento profesional y las prácticas de cuidado individuales y de equipo.',
    resultados: ['Reconocer señales de desgaste propias y del equipo', 'Incorporar prácticas de cuidado sostenibles', 'Proponer espacios de cuidado en la institución'],
    requisitos: 'Integrantes de equipos de salud, emergencias, educación y acción social.',
    incluye: ['Encuentros en vivo por videollamada', 'Ejercicios guiados en audio', 'Guía de cuidado de equipos en PDF'],
    etiquetas: ['burnout', 'equipos', 'autocuidado', 'desgaste'],
    modulos: [
      mod('El costo de cuidar', [['Desgaste por empatía', 40, 'video', 1], ['Agotamiento profesional', 40, 'video'], ['Autoevaluación', 15, 'pdf']]),
      mod('Prácticas de cuidado', [['Rutinas de cuidado personal', 35, 'video'], ['Respiración guiada', 15, 'audio'], ['Límites saludables', 35, 'video']]),
      mod('Cuidado en equipo', [['Reuniones de descarga', 40, 'video'], ['Liderazgo que cuida', 35, 'video'], ['Plan de cuidado del equipo', 20, 'pdf']])
    ]
  },
  {
    id: 'c9', slug: 'abordaje-psicosocial-desastres', titulo: 'Abordaje psicosocial de comunidades tras desastres naturales', categoria: 'crisis', nivel: 'Intermedio', modalidad: 'Híbrida', precio: 135000, descuento: 0, duracion: '6 semanas',
    portada: null,
    descripcionCorta: 'Cómo organizar la respuesta en salud mental de una comunidad afectada, de la emergencia a la recuperación.',
    descripcionCompleta: 'Para equipos de salud, protección civil y organizaciones sociales que trabajan con comunidades afectadas por inundaciones, terremotos, incendios u otros desastres. Se aborda la organización de la respuesta, el trabajo con grupos y la recuperación a mediano plazo.',
    resultados: ['Organizar la respuesta psicosocial por etapas', 'Coordinar el trabajo entre organizaciones', 'Acompañar la recuperación comunitaria'],
    requisitos: 'Equipos de salud, protección civil, organizaciones sociales y voluntariado.',
    incluye: ['Encuentros presenciales y en vivo', 'Casos de trabajo comunitario', 'Guías de intervención en PDF'],
    etiquetas: ['inundaciones', 'terremotos', 'comunidad', 'protección civil'],
    modulos: [
      mod('La emergencia', [['Etapas de un desastre', 40, 'video', 1], ['Necesidades psicosociales', 40, 'video'], ['Pautas de intervención', 30, 'lectura']]),
      mod('Organizar la respuesta', [['Mapa de actores', 35, 'video'], ['Coordinación entre equipos', 40, 'video'], ['Herramienta de relevamiento', 20, 'pdf']]),
      mod('Grupos y comunidad', [['Intervenciones grupales', 45, 'video'], ['Infancias en la emergencia', 40, 'video'], ['Casos para analizar', 30, 'pdf']]),
      mod('La recuperación', [['Del refugio a la vida cotidiana', 40, 'video'], ['Seguimiento de la comunidad', 35, 'video'], ['Evaluación de lo hecho', 25, 'lectura']])
    ]
  },
  {
    id: 'c10', slug: 'politicas-publicas-salud-mental', titulo: 'Políticas públicas en salud mental: diseño y evaluación', categoria: 'instituciones', nivel: 'Avanzado', modalidad: 'Virtual en vivo', precio: 190000, descuento: 0, duracion: '8 semanas',
    portada: null,
    descripcionCorta: 'Cómo se diseña, se implementa y se evalúa un programa público de salud mental y prevención.',
    descripcionCompleta: 'Para funcionarios, equipos técnicos de ministerios y municipios, y profesionales que asesoran organismos públicos. Recorre el diagnóstico de situación, el diseño de programas de prevención, la implementación territorial y la evaluación.',
    resultados: ['Elaborar un diagnóstico de situación', 'Diseñar un programa con objetivos e indicadores', 'Planificar la evaluación del programa'],
    requisitos: 'Equipos técnicos de organismos públicos, asesores y profesionales del área.',
    incluye: ['Clases en vivo por videollamada', 'Modelos de programas en PDF', 'Trabajo final aplicado a tu territorio'],
    etiquetas: ['gobierno', 'ministerios', 'municipios', 'programas'],
    modulos: [
      mod('Diagnóstico de situación', [['Datos y fuentes', 45, 'video', 1], ['Lectura del territorio', 40, 'video'], ['Matriz de diagnóstico', 20, 'pdf']]),
      mod('Diseño del programa', [['Objetivos e indicadores', 45, 'video'], ['Estrategias de prevención', 50, 'video'], ['Presupuesto y recursos', 30, 'lectura']]),
      mod('Implementación', [['Trabajo intersectorial', 45, 'video'], ['Capacitación de equipos', 40, 'video'], ['Comunicación pública', 30, 'video']]),
      mod('Evaluación', [['Evaluar procesos y resultados', 45, 'video'], ['Informe de evaluación', 25, 'pdf'], ['Presentación del trabajo final', 60, 'video']])
    ]
  },
  {
    id: 'c11', slug: 'autolesiones-en-adolescentes', titulo: 'Autolesiones en adolescentes: comprender y acompañar', categoria: 'clinica', nivel: 'Intermedio', modalidad: 'Virtual en vivo', precio: 110000, descuento: 0, duracion: '5 semanas',
    portada: null,
    descripcionCorta: 'Claves para entender las autolesiones y acompañar a adolescentes y familias sin juzgar.',
    descripcionCompleta: 'Para profesionales de la salud, equipos escolares y referentes que trabajan con adolescentes. Se aborda qué son las autolesiones, cómo conversar sobre ellas sin juzgar, cómo evaluar el riesgo y cómo trabajar con la familia y la escuela.',
    resultados: ['Distinguir autolesiones de conducta suicida y evaluar el riesgo', 'Conversar con adolescentes sin juzgar ni alarmar', 'Coordinar el acompañamiento con la familia y la escuela'],
    requisitos: 'Profesionales de la salud, equipos de orientación escolar y trabajo social.',
    incluye: ['Clases en vivo por videollamada', 'Grabación de cada encuentro', 'Material para familias en PDF'],
    etiquetas: ['adolescentes', 'autolesiones', 'familias', 'escuela'],
    modulos: [
      mod('Comprender las autolesiones', [['Qué son y qué función cumplen', 45, 'video', 1], ['Mitos y prejuicios', 30, 'lectura'], ['Relación con el riesgo suicida', 40, 'video']]),
      mod('La conversación', [['Preguntar sin juzgar', 40, 'video'], ['Escuchar a la familia', 35, 'video'], ['Guía de entrevista', 20, 'pdf']]),
      mod('Acompañar', [['Plan de cuidado con el adolescente', 45, 'video'], ['Trabajo con la escuela', 35, 'video'], ['Material para familias', 15, 'pdf']])
    ]
  },
  {
    id: 'c12', slug: 'facilitadores-comunitarios', titulo: 'Facilitadores comunitarios en prevención del suicidio', categoria: 'prevencion', nivel: 'Inicial', modalidad: 'Presencial', precio: 98000, descuento: 0, duracion: '4 jornadas',
    portada: null,
    descripcionCorta: 'Para referentes de barrios, clubes y organizaciones que quieren ser un primer contacto de ayuda.',
    descripcionCompleta: 'Una capacitación presencial para personas que, sin ser profesionales de la salud mental, son referentes en su comunidad. Se aprende a reconocer señales, a conversar con quien está en riesgo, a acompañar hasta la ayuda profesional y a organizar actividades de concientización.',
    resultados: ['Reconocer señales de riesgo en tu comunidad', 'Acompañar a una persona hasta la ayuda profesional', 'Organizar una actividad de concientización'],
    requisitos: 'Referentes comunitarios, voluntarios, docentes y líderes de organizaciones sociales.',
    incluye: ['Cuatro jornadas presenciales', 'Cuadernillo del facilitador en PDF', 'Práctica en grupos'],
    etiquetas: ['comunidad', 'voluntarios', 'referentes', 'organizaciones'],
    modulos: [
      mod('El rol del facilitador', [['Qué puede hacer la comunidad', 40, 'video', 1], ['Alcances y límites del rol', 30, 'lectura'], ['Cuidarse para cuidar', 30, 'video']]),
      mod('Detectar y conversar', [['Señales de riesgo', 45, 'video'], ['Preguntar, escuchar, acompañar', 50, 'video'], ['Práctica en parejas', 60, 'video']]),
      mod('Derivar y concientizar', [['Mapa de recursos de tu zona', 30, 'pdf'], ['Cómo acompañar la derivación', 40, 'video'], ['Planificar una actividad comunitaria', 45, 'pdf']])
    ]
  }
];
CURSOS.forEach((c, i) => {
  c.folio = String(i + 1).padStart(2, '0');
  c.cantidadClases = c.modulos.reduce((s, m) => s + m.clases.length, 0);
});
const ORDEN_CATALOGO = ['c4', 'c6', 'c7', 'c11', 'c8', 'c9', 'c12', 'c10', 'c1', 'c2', 'c3', 'c5'];
const getCurso = id => CURSOS.find(c => c.id === id);

const Cart = {
  KEY: 'redmundialsalud_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getCurso(i.id)) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch {}
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  subtotal() { return this.get().reduce((s, i) => s + (getCurso(i.id)?.precio || 0), 0); },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); }
};

function precioHTML(c) {
  if (!c.precio) return '<span class="precio">Gratis</span>';
  if (c.descuento > 0) return `<span class="precio"><del>${formatearPrecio(c.precio)}</del>${formatearPrecio(precioFinal(c))}<span class="off">-${c.descuento}%</span></span>`;
  return `<span class="precio">${formatearPrecio(c.precio)}</span>`;
}
const textoAgregar = c => (c.precio ? 'Agregar' : 'Inscribirme gratis');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight && r.height + r.width > 0) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function destacadoHTML(c) {
  return `<article class="dest-card" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="dest-foto"><img src="images/${c.portada}" width="1024" height="1024" alt="${esc(c.alt)}"></div>
    ${c.badge ? `<span class="dest-badge">${esc(c.badge)}</span>` : ''}
    <div class="dest-info">
      <span class="area">${esc(AREAS[c.categoria])}</span>
      <h3>${esc(c.titulo)}</h3>
      <span class="meta">${esc(c.modalidad)} · ${esc(c.duracion)} · ${esc(c.nivel)}</span>
      <div class="dest-acciones">${precioHTML(c)}<button type="button" class="btn btn--light" data-ver="${c.id}">Ver curso</button></div>
    </div>
  </article>`;
}

function cursoHTML(c, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : '';
  return `<article class="curso"${anim}>
    <div class="curso-tapa tapa--${c.categoria}"><span class="folio" aria-hidden="true">${c.folio}</span><span class="modo">${ic(MODO_IC[c.modalidad])}<span>${esc(c.modalidad)}</span></span></div>
    <div class="curso-cuerpo">
      <span class="area">${esc(AREAS[c.categoria])}</span>
      <h3>${esc(c.titulo)}</h3>
      <div class="meta"><span>${esc(c.duracion)}</span><span>${c.cantidadClases} clases</span><span>${esc(c.nivel)}</span></div>
      <div class="curso-pie">${precioHTML(c)}<div class="acciones"><button type="button" class="btn btn--ghost btn--sm" data-ver="${c.id}">Ver curso</button><button type="button" class="btn btn--primary btn--sm" data-add="${c.id}">${textoAgregar(c)}</button></div></div>
    </div>
  </article>`;
}

function syncBotones() {
  $$('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const en = Cart.has(c.id);
    b.classList.toggle('is-added', en);
    b.classList.toggle('btn--primary', !en);
    b.innerHTML = en ? `${ic('i-check')}En el carrito` : (b.dataset.largo ? (c.precio ? 'Agregar al carrito' : 'Inscribirme gratis') : textoAgregar(c));
    b.setAttribute('aria-label', en ? `${c.titulo}: ya está en el carrito, abrir el carrito` : `${c.precio ? 'Agregar al carrito' : 'Inscribirme gratis en'}: ${c.titulo}`);
  });
}

function renderDestacados() {
  const grid = $('#destacadosGrid');
  if (!grid) return;
  grid.innerHTML = CURSOS.filter(c => c.destacado).slice(0, 4).map(destacadoHTML).join('');
}

function pageSize() {
  const grid = $('#catalogoGrid');
  if (!grid) return 8;
  if (window.innerWidth <= 600) return 4;
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 4;
  return cols * 2;
}
const estado = { q: '', area: '', modalidad: '', nivel: '', visibles: 8 };
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function filtrarCursos() {
  const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
  return ORDEN_CATALOGO.map(getCurso).filter(c => {
    if (!c) return false;
    if (estado.area && c.categoria !== estado.area) return false;
    if (estado.modalidad && c.modalidad !== estado.modalidad) return false;
    if (estado.nivel && c.nivel !== estado.nivel) return false;
    if (!palabras.length) return true;
    const texto = norm([c.titulo, AREAS[c.categoria], c.nivel, c.modalidad, c.descripcionCorta, c.descripcionCompleta, 'equipo docente de la red', ...(c.etiquetas || []), ...c.modulos.map(m => m.titulo)].join(' '));
    return palabras.every(p => texto.includes(p));
  });
}
function renderCatalogo(yaVistos = 0) {
  const grid = $('#catalogoGrid');
  if (!grid) return;
  const lista = filtrarCursos();
  const visibles = lista.slice(0, estado.visibles);
  grid.innerHTML = visibles.map((c, k) => cursoHTML(c, k >= yaVistos)).join('');
  const n = lista.length;
  $('#catContador').textContent = n === 1 ? '1 curso' : `${n} cursos`;
  $('#catVacio').hidden = n > 0;
  $('#catMas').hidden = n <= estado.visibles;
  $('#catLimpiar').hidden = !(estado.q || estado.area || estado.modalidad || estado.nivel);
  syncBotones();
  revelarNuevos(grid);
}
function initCatalogo() {
  const grid = $('#catalogoGrid');
  if (!grid) return;
  const buscar = $('#catBuscar');
  const chips = $$('.filtros .chip');
  let t = 0;
  const reiniciar = () => { estado.visibles = pageSize(); renderCatalogo(); };
  buscar?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscar.value.trim(); reiniciar(); }, 160); });
  $('#catModalidad')?.addEventListener('change', e => { estado.modalidad = e.target.value; reiniciar(); });
  $('#catNivel')?.addEventListener('change', e => { estado.nivel = e.target.value; reiniciar(); });
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === ch)));
    estado.area = ch.dataset.area || '';
    reiniciar();
  }));
  $('#catLimpiar')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', area: '', modalidad: '', nivel: '' });
    if (buscar) buscar.value = '';
    $('#catModalidad').value = '';
    $('#catNivel').value = '';
    chips.forEach(x => x.setAttribute('aria-pressed', String(!x.dataset.area)));
    reiniciar();
    buscar?.focus();
  });
  estado.visibles = pageSize();
  $('#catMas')?.addEventListener('click', () => {
    const ya = Math.min(estado.visibles, filtrarCursos().length);
    estado.visibles += pageSize();
    renderCatalogo(ya);
  });
  renderCatalogo();
}

const overlays = [];
const FOCO = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
function abrirOverlay(root, panel, alCerrar) {
  if (!root || overlays.some(o => o.root === root)) return;
  const previo = document.activeElement;
  root.hidden = false;
  document.body.classList.add('no-scroll');
  void root.offsetWidth;
  root.classList.add('open');
  overlays.push({ root, panel, previo, alCerrar });
  setTimeout(() => panel.focus({ preventScroll: true }), 30);
}
function cerrarOverlay(root, devolverFoco = true) {
  const i = overlays.findIndex(o => o.root === root);
  if (i < 0) return;
  const [o] = overlays.splice(i, 1);
  root.classList.remove('open');
  setTimeout(() => { if (!root.classList.contains('open')) root.hidden = true; }, reduceMotion ? 0 : 380);
  if (!overlays.length && !$('#mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  if (o.alCerrar) o.alCerrar();
  if (devolverFoco && o.previo && document.contains(o.previo)) o.previo.focus({ preventScroll: true });
}
document.addEventListener('keydown', e => {
  const o = overlays[overlays.length - 1];
  if (!o) return;
  if (e.key === 'Escape') { e.preventDefault(); cerrarOverlay(o.root); return; }
  if (e.key === 'Tab') {
    const f = [...o.panel.querySelectorAll(FOCO)].filter(el => el.getClientRects().length);
    if (!f.length) { e.preventDefault(); return; }
    const primero = f[0];
    const ultimo = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === o.panel)) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }
});

function modalHTML(c) {
  const tapa = c.portada
    ? `<div class="mc-tapa"><img src="images/${c.portada}" width="1024" height="1024" alt="${esc(c.alt)}"></div>`
    : `<div class="mc-tapa curso-tapa tapa--${c.categoria}"><span class="folio" aria-hidden="true">${c.folio}</span><span class="modo">${ic(MODO_IC[c.modalidad])}<span>${esc(c.modalidad)}</span></span></div>`;
  const programa = c.modulos.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span>Módulo ${i + 1}. ${esc(m.titulo)}</span><small>${m.clases.length} clases</small>${ic('i-chev')}</summary><ol>${m.clases.map(cl => `<li>${ic(TIPO_IC[cl.tipo])}<span>${esc(cl.titulo)}${cl.preview ? '<span class="preview">Clase abierta</span>' : ''}<span class="sr-only"> (${TIPO_TXT[cl.tipo]})</span></span><small>${cl.duracion} min</small></li>`).join('')}</ol></details>`).join('');
  return `<div class="mc-top">${tapa}
    <div class="mc-head">
      <span class="area">${esc(AREAS[c.categoria])}</span>
      <h2>${esc(c.titulo)}</h2>
      <p>${esc(c.descripcionCorta)}</p>
      <div class="mc-compra">${precioHTML(c)}<button type="button" class="btn btn--primary" data-add="${c.id}" data-largo="1">${c.precio ? 'Agregar al carrito' : 'Inscribirme gratis'}</button></div>
    </div>
  </div>
  <dl class="mc-datos"><div><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div><div><dt>Clases</dt><dd>${c.cantidadClases}</dd></div><div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div><div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div></dl>
  <div class="mc-cuerpo">
    <div>
      <h3>Sobre el curso</h3><p>${esc(c.descripcionCompleta)}</p>
      <h3>Al terminar vas a poder</h3><ul class="mc-lista">${c.resultados.map(r => `<li>${ic('i-check')}<span>${esc(r)}</span></li>`).join('')}</ul>
      <h3>Para quién es</h3><p>${esc(c.requisitos)}</p>
      <h3>Qué incluye</h3><ul class="mc-lista">${c.incluye.map(r => `<li>${ic('i-check')}<span>${esc(r)}</span></li>`).join('')}</ul>
    </div>
    <div>
      <h3>Programa</h3>
      <div class="programa">${programa}</div>
      <div class="mc-docente"><strong>Equipo docente de la Red</strong><p>Profesionales de la salud mental de los capítulos, coordinados por la dirección académica.</p></div>
    </div>
  </div>`;
}

function abrirCurso(id) {
  const c = getCurso(id);
  const modal = $('#cursoModal');
  if (!c || !modal) return;
  if (overlays.some(o => o.root === modal)) cerrarOverlay(modal, false);
  $('#cursoModalBody').innerHTML = modalHTML(c);
  const panel = $('.modal-panel', modal);
  panel.setAttribute('aria-label', `Detalle del curso: ${c.titulo}`);
  panel.scrollTop = 0;
  syncBotones();
  abrirOverlay(modal, panel, () => {
    const u = new URL(location.href);
    if (u.searchParams.has('curso')) { u.searchParams.delete('curso'); history.replaceState(null, '', u.pathname + u.search + u.hash); }
  });
  try {
    const u = new URL(location.href);
    u.searchParams.set('curso', c.slug);
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  } catch {}
}

function renderCart() {
  const body = $('#cartBody');
  if (!body) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  body.innerHTML = items.length
    ? items.map(c => `<div class="cart-item"><div class="ci-tapa tapa--${c.categoria}">${c.portada ? `<img src="images/${c.portada}" width="1024" height="1024" alt="">` : c.folio}</div><div><h3>${esc(c.titulo)}</h3><small>${esc(c.modalidad)} · ${esc(c.duracion)}</small>${precioHTML(c)}</div><button type="button" class="ci-quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)}">${ic('i-trash')}</button></div>`).join('')
    : `<div class="cart-vacio"><strong>Todavía no elegiste cursos</strong>Explorá el catálogo y sumá los que te interesen.<br><a class="btn btn--ghost" href="#catalogo" data-cerrar-cart>Ver los cursos</a></div>`;
  $('#cartFoot').hidden = !items.length;
  const sub = Cart.subtotal();
  const tot = Cart.total();
  $('#cartSubtotal').textContent = formatearPrecio(sub);
  $('#cartTotal').textContent = formatearPrecio(tot);
  $('#cartAhorro').textContent = '-' + formatearPrecio(sub - tot);
  $('#cartAhorroFila').hidden = sub - tot <= 0;
}
function abrirCarrito() {
  const d = $('#cartDrawer');
  if (!d) return;
  const modal = $('#cursoModal');
  if (modal && overlays.some(o => o.root === modal)) cerrarOverlay(modal, false);
  renderCart();
  abrirOverlay(d, $('.drawer-panel', d));
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirCurso(ver.dataset.ver); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const c = getCurso(add.dataset.add);
      if (!c) return;
      if (Cart.has(c.id)) { abrirCarrito(); return; }
      Cart.add(c);
      showToast(c.precio ? `Sumaste «${c.titulo}» a tu inscripción` : `Te anotaste en «${c.titulo}»: confirmalo en el carrito`);
      return;
    }
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const c = getCurso(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      renderCart();
      $('#cartDrawer .drawer-panel')?.focus({ preventScroll: true });
      if (c) showToast(`Quitaste «${c.titulo}»`);
      return;
    }
    if (e.target.closest('[data-cerrar-cart]')) { cerrarOverlay($('#cartDrawer')); return; }
    if (e.target.closest('[data-cerrar-modal]')) { cerrarOverlay($('#cursoModal')); return; }
  });
  $('#cartFinalizar')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotones(); if (!$('#cartDrawer')?.hidden) renderCart(); });
  window.addEventListener('storage', e => { if (e.key === Cart.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });
  updateCartBadge();
  const slug = new URLSearchParams(location.search).get('curso');
  const c = slug && CURSOS.find(x => x.slug === slug);
  if (c) abrirCurso(c.id);
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initGaleria() {
  const lb = $('#lightbox');
  const figs = $$('.gal-item');
  if (!lb || !figs.length) return;
  const fotos = figs.map(f => {
    const img = $('img', f);
    return { src: img.getAttribute('src'), alt: img.alt, w: img.getAttribute('width'), h: img.getAttribute('height'), cap: $('figcaption', f)?.textContent || '' };
  });
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  let actual = 0;
  const mostrar = i => {
    actual = (i + fotos.length) % fotos.length;
    const f = fotos[actual];
    lbImg.src = f.src; lbImg.alt = f.alt; lbImg.width = +f.w; lbImg.height = +f.h;
    lbCap.textContent = `${f.cap} · ${actual + 1} de ${fotos.length}`;
  };
  figs.forEach((f, i) => $('button', f)?.addEventListener('click', () => { mostrar(i); abrirOverlay(lb, $('.lightbox-panel', lb)); }));
  $('#lbPrev')?.addEventListener('click', () => mostrar(actual - 1));
  $('#lbNext')?.addEventListener('click', () => mostrar(actual + 1));
  lb.addEventListener('click', e => { if (e.target.closest('[data-cerrar-lb]')) cerrarOverlay(lb); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
  });
}

function initForm() {
  const form = $('#consultaForm');
  if (!form) return;
  const reglas = [
    ['fNombre', v => v.trim().length >= 2, 'Contanos tu nombre para saber a quién respondemos.'],
    ['fEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), 'Revisá el email: así te podemos contestar.'],
    ['fMensaje', v => v.trim().length >= 10, 'Escribinos un poco más sobre tu consulta.']
  ];
  const validar = (id, ok, msg) => {
    const el = $('#' + id);
    const err = $('#' + id + 'Err');
    const bien = ok(el.value);
    el.setAttribute('aria-invalid', String(!bien));
    if (bien) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', id + 'Err');
    err.textContent = bien ? '' : msg;
    return bien;
  };
  reglas.forEach(([id, ok, msg]) => $('#' + id)?.addEventListener('blur', () => { if ($('#' + id).value) validar(id, ok, msg); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const res = reglas.map(r => validar(...r));
    if (res.includes(false)) { $('#' + reglas[res.indexOf(false)][0]).focus(); return; }
    const btn = $('button[type="submit"]', form);
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header, .masthead') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!overlays.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initSchema() {
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': CURSOS.map(c => ({
      '@type': 'Course',
      name: c.titulo,
      description: c.descripcionCorta,
      provider: { '@type': 'EducationalOrganization', name: 'Red Mundial de Salud Mental y Suicidio' },
      offers: { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', category: c.precio ? 'Paid' : 'Free' },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: c.modalidad === 'Presencial' ? 'onsite' : c.modalidad === 'Híbrida' ? 'blended' : 'online', courseWorkload: c.duracion }
    }))
  });
  document.head.appendChild(s);
}

renderDestacados();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initCarrito();
initFloats();
initGaleria();
initForm();
initSchema();
