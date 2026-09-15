const WA = '5491150037606';
const IG = 'https://instagram.com/institutokline';

const CATEGORIAS = ['Formación', 'Adultos mayores', 'Autismo', 'Pareja y familia'];

const DOCENTES = [
  {
    id: 'd1',
    nombre: 'Mariana Sosa',
    rol: 'Formadora en Acompañamiento Terapéutico',
    bio: 'Acompaña y forma desde hace más de doce años. Trabaja el acompañamiento terapéutico y el abordaje del autismo desde una mirada respetuosa, centrada en la persona y su entorno.',
    foto: 'images/docente-1.webp',
    credencialesVerificadas: false,
  },
  {
    id: 'd2',
    nombre: 'Cecilia Ferrer',
    rol: 'Especialista en adultos mayores',
    bio: 'Coordina talleres de memoria y estimulación cognitiva. Cree en el envejecimiento activo y en cuidar la autonomía de las personas mayores el mayor tiempo posible.',
    foto: 'images/docente-2.webp',
    credencialesVerificadas: false,
  },
  {
    id: 'd3',
    nombre: 'Paula Giménez',
    rol: 'Coordinadora del área de vínculos',
    bio: 'Acompaña a parejas y familias en sus procesos. Su enfoque es práctico y humano: entender el vínculo para poder cuidarlo mejor.',
    foto: 'images/docente-3.webp',
    credencialesVerificadas: false,
  },
];

const CURSOS = [
  {
    id: 'c1',
    slug: 'acompanamiento-terapeutico',
    titulo: 'Formación en Acompañamiento Terapéutico',
    categoria: 'Formación',
    nivel: 'Formación completa',
    modalidad: 'Grabado + encuentros en vivo',
    precio: 78000,
    descuento: 0,
    duracion: '16 semanas · 40 h de video',
    docenteId: 'd1',
    portada: 'images/curso-at.webp',
    destacado: true,
    nuevo: false,
    enVivo: true,
    resumen: 'Formate para acompañar a personas en su vida cotidiana, con herramientas concretas y un marco ético claro.',
    descripcion: 'Una formación completa en acompañamiento terapéutico: qué es el rol, cómo se trabaja en equipo con profesionales, cómo sostener un vínculo de cuidado sin perderte en él, y cómo intervenir en distintos contextos (domicilio, institución, salud mental).',
    resultados: [
      'Entender el rol del acompañante y sus límites',
      'Construir un vínculo de cuidado saludable',
      'Trabajar en equipo con el profesional a cargo',
      'Registrar y comunicar lo que observás',
    ],
    requisitos: ['Ser mayor de 18 años y tener ganas de acompañar. No hace falta experiencia previa.'],
    incluye: ['Más de 40 clases en video', '4 encuentros en vivo por Zoom', 'Material descargable y casos', 'Comunidad de estudiantes', 'Certificado de finalización'],
    modulos: [
      { id: 'm1', titulo: 'El rol del acompañante', clases: [
        { id: 'at-1-1', titulo: 'Qué es (y qué no es) acompañar', duracion: '11 min', tipo: 'video', preview: true },
        { id: 'at-1-2', titulo: 'El encuadre y los límites del rol', duracion: '14 min', tipo: 'video', preview: false },
        { id: 'at-1-3', titulo: 'Ética y confidencialidad', duracion: '12 min', tipo: 'lectura', preview: false },
      ]},
      { id: 'm2', titulo: 'El vínculo de cuidado', clases: [
        { id: 'at-2-1', titulo: 'Construir confianza sin invadir', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'at-2-2', titulo: 'Escucha y presencia', duracion: '10 min', tipo: 'video', preview: false },
        { id: 'at-2-3', titulo: 'Cuidarte para poder cuidar', duracion: '12 min', tipo: 'ejercicio', preview: false },
      ]},
      { id: 'm3', titulo: 'La práctica en distintos contextos', clases: [
        { id: 'at-3-1', titulo: 'Acompañar en el domicilio', duracion: '15 min', tipo: 'video', preview: false },
        { id: 'at-3-2', titulo: 'Trabajo en equipo con el profesional', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'at-3-3', titulo: 'Tu primer registro de acompañamiento', duracion: '18 min', tipo: 'ejercicio', preview: false },
      ]},
    ],
  },
  {
    id: 'c2',
    slug: 'estimulacion-cognitiva',
    titulo: 'Estimulación cognitiva y talleres de memoria',
    categoria: 'Adultos mayores',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 42000,
    descuento: 15,
    duracion: '6 semanas · 5 h de video',
    docenteId: 'd2',
    portada: 'images/curso-mayores.webp',
    destacado: true,
    nuevo: false,
    enVivo: false,
    resumen: 'Aprendé a coordinar talleres de memoria y estimulación cognitiva para acompañar el envejecimiento activo.',
    descripcion: 'Un curso práctico para armar y coordinar talleres con personas mayores: qué actividades funcionan, cómo adaptarlas a cada grupo y cómo sostener la motivación cuidando siempre la dignidad de la persona.',
    resultados: [
      'Diseñar actividades de estimulación cognitiva',
      'Coordinar un taller de memoria de principio a fin',
      'Adaptar las consignas a cada grupo',
      'Acompañar sin infantilizar',
    ],
    requisitos: ['Ganas de trabajar con adultos mayores. Ideal para acompañantes, cuidadores y familiares.'],
    incluye: ['18 clases en video', 'Banco de actividades imprimibles', 'Guía para coordinar el taller', 'Certificado de finalización'],
    modulos: [
      { id: 'm1', titulo: 'Envejecer, con otra mirada', clases: [
        { id: 'ec-1-1', titulo: 'Mitos y realidades del envejecimiento', duracion: '10 min', tipo: 'video', preview: true },
        { id: 'ec-1-2', titulo: 'Cómo funciona la memoria', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'ec-1-3', titulo: 'Observar sin etiquetar', duracion: '9 min', tipo: 'lectura', preview: false },
      ]},
      { id: 'm2', titulo: 'Actividades que estimulan', clases: [
        { id: 'ec-2-1', titulo: 'Ejercicios de memoria y atención', duracion: '15 min', tipo: 'video', preview: false },
        { id: 'ec-2-2', titulo: 'Juegos y recursos cotidianos', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'ec-2-3', titulo: 'Armá tu primera actividad', duracion: '14 min', tipo: 'ejercicio', preview: false },
      ]},
      { id: 'm3', titulo: 'Coordinar el taller', clases: [
        { id: 'ec-3-1', titulo: 'El encuadre grupal', duracion: '11 min', tipo: 'video', preview: false },
        { id: 'ec-3-2', titulo: 'Cuando aparece la frustración', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'ec-3-3', titulo: 'Tu plan de 4 encuentros', duracion: '16 min', tipo: 'ejercicio', preview: false },
      ]},
    ],
  },
  {
    id: 'c3',
    slug: 'acompanamiento-autismo',
    titulo: 'Acompañamiento en autismo (TEA)',
    categoria: 'Autismo',
    nivel: 'Intermedio',
    modalidad: 'Grabado + comunidad',
    precio: 52000,
    descuento: 0,
    duracion: '8 semanas · 6 h de video',
    docenteId: 'd1',
    portada: 'images/curso-autismo.webp',
    destacado: true,
    nuevo: false,
    enVivo: false,
    resumen: 'Herramientas para acompañar a personas dentro del espectro autista, respetando sus tiempos y su forma de estar en el mundo.',
    descripcion: 'Un curso pensado para acompañantes, docentes y familias. No busca "corregir": busca entender, comunicar mejor y construir entornos más amables. Trabajamos comunicación, regulación, apoyos y trabajo con la familia y la escuela.',
    resultados: [
      'Entender el autismo desde el respeto, no desde el déficit',
      'Favorecer la comunicación y la regulación',
      'Preparar entornos y apoyos accesibles',
      'Acompañar a la familia y a la escuela',
    ],
    requisitos: ['Recomendado tener contacto con la temática (laboral o familiar). Se puede cursar desde cero.'],
    incluye: ['24 clases en video', 'Recursos y pictogramas descargables', 'Comunidad de acompañantes', 'Certificado de finalización'],
    modulos: [
      { id: 'm1', titulo: 'Entender el espectro', clases: [
        { id: 'au-1-1', titulo: 'Qué es el autismo (y qué no)', duracion: '12 min', tipo: 'video', preview: true },
        { id: 'au-1-2', titulo: 'Cada persona es única', duracion: '11 min', tipo: 'video', preview: false },
        { id: 'au-1-3', titulo: 'Del déficit al respeto', duracion: '10 min', tipo: 'lectura', preview: false },
      ]},
      { id: 'm2', titulo: 'Comunicación y regulación', clases: [
        { id: 'au-2-1', titulo: 'Sistemas de comunicación y apoyos', duracion: '15 min', tipo: 'video', preview: false },
        { id: 'au-2-2', titulo: 'Regulación sensorial y emocional', duracion: '14 min', tipo: 'video', preview: false },
        { id: 'au-2-3', titulo: 'Preparar un entorno amable', duracion: '13 min', tipo: 'ejercicio', preview: false },
      ]},
      { id: 'm3', titulo: 'Familia y escuela', clases: [
        { id: 'au-3-1', titulo: 'Acompañar a la familia', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'au-3-2', titulo: 'Trabajar junto a la escuela', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'au-3-3', titulo: 'Tu plan de apoyos', duracion: '17 min', tipo: 'ejercicio', preview: false },
      ]},
    ],
  },
  {
    id: 'c4',
    slug: 'pareja-y-familia',
    titulo: 'Vínculos: pareja y familia',
    categoria: 'Pareja y familia',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 45000,
    descuento: 0,
    duracion: '6 semanas · 5 h de video',
    docenteId: 'd3',
    portada: 'images/curso-familia.webp',
    destacado: false,
    nuevo: false,
    enVivo: false,
    resumen: 'Entendé qué pasa en los vínculos de pareja y familia, y qué herramientas ayudan a cuidarlos.',
    descripcion: 'Un recorrido para comprender la dinámica de los vínculos cercanos: la comunicación, los conflictos que se repiten, los roles y cómo acompañar procesos de cambio en la familia. Orientado a quienes acompañan o trabajan con vínculos.',
    resultados: [
      'Leer la dinámica de un vínculo de pareja o familia',
      'Mejorar la comunicación en momentos difíciles',
      'Reconocer patrones que se repiten',
      'Acompañar sin tomar partido',
    ],
    requisitos: ['Abierto a todo público interesado en los vínculos. Sin requisitos previos.'],
    incluye: ['18 clases en video', 'Guías de conversación', 'Casos para analizar', 'Certificado de finalización'],
    modulos: [
      { id: 'm1', titulo: 'Cómo funciona un vínculo', clases: [
        { id: 'pf-1-1', titulo: 'El vínculo como sistema', duracion: '11 min', tipo: 'video', preview: true },
        { id: 'pf-1-2', titulo: 'Roles y lugares en la familia', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'pf-1-3', titulo: 'Los conflictos que se repiten', duracion: '10 min', tipo: 'lectura', preview: false },
      ]},
      { id: 'm2', titulo: 'Comunicación', clases: [
        { id: 'pf-2-1', titulo: 'Escuchar de verdad', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'pf-2-2', titulo: 'Pedir, poner límites, reparar', duracion: '14 min', tipo: 'video', preview: false },
        { id: 'pf-2-3', titulo: 'Un ejercicio para tu vínculo', duracion: '12 min', tipo: 'ejercicio', preview: false },
      ]},
      { id: 'm3', titulo: 'Acompañar el cambio', clases: [
        { id: 'pf-3-1', titulo: 'Etapas y crisis vitales', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'pf-3-2', titulo: 'Cuándo derivar a un profesional', duracion: '10 min', tipo: 'video', preview: false },
        { id: 'pf-3-3', titulo: 'Tu mapa del vínculo', duracion: '15 min', tipo: 'ejercicio', preview: false },
      ]},
    ],
  },
  {
    id: 'c5',
    slug: 'herramientas-salud-mental',
    titulo: 'Herramientas del acompañante en salud mental',
    categoria: 'Formación',
    nivel: 'Inicial',
    modalidad: 'Grabado',
    precio: 34000,
    descuento: 20,
    duracion: '4 semanas · 3 h de video',
    docenteId: 'd2',
    portada: 'images/curso-herramientas.webp',
    destacado: false,
    nuevo: true,
    enVivo: false,
    resumen: 'Recursos concretos para acompañar en salud mental con cuidado, límites claros y trabajo en red.',
    descripcion: 'Un curso corto y práctico: primeros recursos para acompañar situaciones de salud mental, cómo cuidarte del desgaste, cuándo y cómo derivar, y cómo trabajar en red con los profesionales a cargo.',
    resultados: [
      'Sostener una escucha cuidada',
      'Reconocer señales de alarma y cuándo derivar',
      'Cuidarte del desgaste (burnout)',
      'Trabajar en red con el equipo tratante',
    ],
    requisitos: ['Ideal como complemento de la formación en AT. Se puede cursar solo.'],
    incluye: ['12 clases en video', 'Checklist de derivación', 'Guía de autocuidado', 'Certificado de finalización'],
    modulos: [
      { id: 'm1', titulo: 'Acompañar con cuidado', clases: [
        { id: 'hs-1-1', titulo: 'El lugar del acompañante en salud mental', duracion: '10 min', tipo: 'video', preview: true },
        { id: 'hs-1-2', titulo: 'Escucha que no daña', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'hs-1-3', titulo: 'Señales de alarma', duracion: '11 min', tipo: 'lectura', preview: false },
      ]},
      { id: 'm2', titulo: 'Límites y red', clases: [
        { id: 'hs-2-1', titulo: 'Cuándo y cómo derivar', duracion: '13 min', tipo: 'video', preview: false },
        { id: 'hs-2-2', titulo: 'Trabajar con el equipo tratante', duracion: '11 min', tipo: 'video', preview: false },
        { id: 'hs-2-3', titulo: 'Tu red de derivación', duracion: '10 min', tipo: 'ejercicio', preview: false },
      ]},
      { id: 'm3', titulo: 'Cuidar al que cuida', clases: [
        { id: 'hs-3-1', titulo: 'El desgaste por empatía', duracion: '12 min', tipo: 'video', preview: false },
        { id: 'hs-3-2', titulo: 'Rutinas de autocuidado', duracion: '9 min', tipo: 'video', preview: false },
        { id: 'hs-3-3', titulo: 'Tu plan de autocuidado', duracion: '12 min', tipo: 'ejercicio', preview: false },
      ]},
    ],
  },
];

const FAQ_GLOBAL = [
  { q: '¿Los cursos son online?', a: 'Sí. Son grabados y los hacés a tu ritmo, desde donde quieras. Algunos suman encuentros en vivo por Zoom, y siempre te lo aclaramos en la ficha del curso.' },
  { q: '¿Entregan certificado?', a: 'Sí. Al completar un curso recibís un certificado de finalización del Instituto Kline. Es un certificado propio de la institución; no es un título oficial ni una habilitación estatal.' },
  { q: '¿Necesito formación previa?', a: 'Depende del curso. Cada uno indica su nivel y sus requisitos; varios arrancan desde cero y avanzan paso a paso.' },
  { q: '¿Para quién son los cursos?', a: 'Para personas que quieren formarse como acompañantes, profesionales de la salud y la educación que buscan especializarse, y familiares que acompañan a un ser querido.' },
  { q: '¿Cuánto tiempo tengo acceso?', a: 'El acceso es por tiempo ilimitado. Comprás una vez y volvés a las clases y a sus actualizaciones cuando lo necesites.' },
  { q: '¿Y si no es lo que buscaba?', a: 'Tenés 7 días para probar el curso. Si sentís que no era para vos, te devolvemos lo que pagaste, sin vueltas.' },
];

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = (c) => (c && c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : (c ? c.precio : 0));
const normalize = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getCurso = (slug) => CURSOS.find((c) => c.slug === slug);
const getCursoById = (id) => CURSOS.find((c) => c.id === id);
const getDocente = (id) => DOCENTES.find((d) => d.id === id);
const todasLasClases = (c) => (c ? c.modulos.flatMap((m) => m.clases) : []);
const totalClases = (c) => todasLasClases(c).length;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const Cart = {
  KEY: 'kline_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().includes(id); },
  add(id) { const ids = this.get(); if (!ids.includes(id)) { ids.push(id); this.save(ids); } },
  remove(id) { this.save(this.get().filter((x) => x !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, id) => s + precioFinal(getCursoById(id)), 0); },
  ahorro() { return this.get().reduce((s, id) => { const c = getCursoById(id); return c ? s + (c.precio - precioFinal(c)) : s; }, 0); },
};

const Learning = {
  KEY: 'kline_learning_state',
  SESSION: 'kline_demo_session',
  get() {
    try { return Object.assign({ enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {} }, JSON.parse(localStorage.getItem(this.KEY)) || {}); }
    catch { return { enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {} }; }
  },
  save(state) { localStorage.setItem(this.KEY, JSON.stringify(state)); document.dispatchEvent(new CustomEvent('learning:updated')); },
  isEnrolled(id) { return this.get().enrolledCourseIds.includes(id); },
  enroll(ids) {
    const st = this.get();
    ids.forEach((id) => { if (!st.enrolledCourseIds.includes(id)) st.enrolledCourseIds.push(id); });
    this.save(st);
  },
  isLessonDone(lessonId) { return this.get().completedLessonIds.includes(lessonId); },
  toggleLesson(lessonId, done) {
    const st = this.get();
    const set = new Set(st.completedLessonIds);
    if (done) set.add(lessonId); else set.delete(lessonId);
    st.completedLessonIds = [...set];
    this.save(st);
  },
  setLastLesson(courseId, lessonId) { const st = this.get(); st.lastLessonByCourse[courseId] = lessonId; this.save(st); },
  getNote(lessonId) { return this.get().notesByLesson[lessonId] || ''; },
  setNote(lessonId, text) { const st = this.get(); if (text) st.notesByLesson[lessonId] = text; else delete st.notesByLesson[lessonId]; this.save(st); },
  progress(courseId) {
    const c = getCursoById(courseId);
    const clases = todasLasClases(c);
    if (!clases.length) return 0;
    const done = this.get().completedLessonIds;
    const hechas = clases.filter((cl) => done.includes(cl.id)).length;
    return Math.round((hechas / clases.length) * 100);
  },
  isSessionActive() { return localStorage.getItem(this.SESSION) === '1'; },
  startSession() {
    localStorage.setItem(this.SESSION, '1');
    if (!this.get().enrolledCourseIds.length) this.enroll(['c1', 'c2']);
    document.dispatchEvent(new CustomEvent('learning:updated'));
  },
  reset() {
    [this.KEY, this.SESSION, Cart.KEY].forEach((k) => localStorage.removeItem(k));
    document.dispatchEvent(new CustomEvent('learning:updated'));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
};
