const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;

const DOCENTES = [
  { id: 1, nombre: 'Coordinación general', sigla: 'CG', rol: 'Dirección académica', bio: 'Define el recorrido de las cinco formaciones y coordina la supervisión de las prácticas.' },
  { id: 2, nombre: 'Equipo de Instituciones y Comunidad', sigla: 'IC', rol: 'Conflictos institucionales y abordaje comunitario', bio: 'Docentes con experiencia de campo en escuelas, hospitales, municipios y organizaciones sociales.' },
  { id: 3, nombre: 'Equipo de Salud Mental y Cuidados', sigla: 'SC', rol: 'Prevención, cuidados y vínculos', bio: 'Docentes que trabajan en dispositivos de salud mental, residencias y espacios de acompañamiento familiar.' },
];

const CURSOS = [
  {
    id: 1, slug: 'conflictos-instituciones',
    etiquetas: ['escuela','hospital','equipo de trabajo','clima laboral','mediacion','violencia institucional','reuniones'],
    titulo: 'Gestión de conflictos en instituciones',
    eje: 'Instituciones', nivel: 'Intermedio', modalidad: 'En vivo',
    precio: 62000, descuento: 0, semanas: 10, duracion: '10 semanas', cantidadClases: 20,
    docenteId: 2, portada: 'images/curso-conflictos.webp', badge: 'Más elegida',
    alt: 'Grupo de trabajo discutiendo con gestos en una reunión de equipo',
    descripcionCorta: 'Leer el conflicto como emergente del grupo y coordinar una salida posible dentro de escuelas, hospitales y organizaciones.',
    promesa: 'Cuando un conflicto estalla en una institución, casi nunca se trata solo de las dos personas que discuten. Esta formación enseña a leer qué está diciendo el grupo a través de ese conflicto y a coordinar una intervención que no dependa de imponer autoridad.',
    resultados: [
      'Distinguir el conflicto manifiesto del problema de fondo que lo sostiene',
      'Coordinar una reunión difícil sin quedar en el lugar de árbitro',
      'Escribir un registro del caso que sirva para intervenir y no solo para archivar',
      'Diseñar un dispositivo de trabajo sostenido con el equipo',
    ],
    requisitos: 'Trabajar o haber trabajado dentro de una institución. No requiere formación previa en psicología.',
    incluye: ['20 encuentros en vivo, todos grabados', 'Fichas de cátedra y guías de intervención en PDF', 'Supervisión grupal de casos propios', 'Certificado de asistencia'],
    modulos: [
      { id: 'm1', titulo: 'El conflicto como emergente', clases: [
        { titulo: 'Qué mira la psicología social en una institución', duracion: '55 min', tipo: 'video', preview: true },
        { titulo: 'Roles, portavoz y chivo emisario', duracion: '50 min', tipo: 'video' },
        { titulo: 'Ficha 1: leer un organigrama y leer un grupo', duracion: '20 min', tipo: 'lectura' },
      ] },
      { id: 'm2', titulo: 'Coordinar la conversación difícil', clases: [
        { titulo: 'Preparar una reunión de conflicto', duracion: '55 min', tipo: 'video' },
        { titulo: 'Intervenciones que abren y frases que cierran', duracion: '45 min', tipo: 'video' },
        { titulo: 'Guía de coordinación paso a paso', duracion: '25 min', tipo: 'pdf' },
        { titulo: 'Casos comentados por el equipo docente', duracion: '35 min', tipo: 'audio' },
      ] },
      { id: 'm3', titulo: 'Del episodio al dispositivo', clases: [
        { titulo: 'Cuando el conflicto se repite: qué sostiene la escena', duracion: '50 min', tipo: 'video' },
        { titulo: 'Diseñar un espacio de trabajo con el equipo', duracion: '50 min', tipo: 'video' },
        { titulo: 'Ficha 2: registro e informe institucional', duracion: '25 min', tipo: 'lectura' },
      ] },
      { id: 'm4', titulo: 'Práctica supervisada', clases: [
        { titulo: 'Presentación de casos propios', duracion: '90 min', tipo: 'video' },
        { titulo: 'Devolución del equipo y ajuste de la intervención', duracion: '90 min', tipo: 'video' },
        { titulo: 'Consigna del trabajo final', duracion: '15 min', tipo: 'pdf' },
      ] },
    ],
    faq: [
      { q: '¿Sirve si trabajo en una escuela y no en salud?', a: 'Sí. Los casos que se analizan vienen de escuelas, hospitales, municipios y organizaciones sociales por igual.' },
      { q: '¿Se puede cursar en equipo?', a: 'Sí, y suele funcionar mejor: dos o tres personas de la misma institución trabajando sobre las mismas escenas.' },
    ],
  },
  {
    id: 2, slug: 'prevencion-suicidio',
    etiquetas: ['suicidio','crisis','riesgo','autolesiones','primeros auxilios psicologicos','escucha activa','salud mental'],
    titulo: 'Prevención del suicidio: escucha y primera intervención',
    eje: 'Salud mental', nivel: 'Avanzado', modalidad: 'En vivo',
    precio: 68000, descuento: 10, semanas: 8, duracion: '8 semanas', cantidadClases: 16,
    docenteId: 3, portada: 'images/curso-escucha.webp', badge: 'Nueva',
    alt: 'Dos personas conversando sentadas frente a frente en un espacio tranquilo',
    descripcionCorta: 'Cómo preguntar, cómo sostener una conversación de riesgo y cómo articular con la red de salud, sin quedar solo con la situación.',
    promesa: 'Formación para equipos que reciben situaciones de riesgo en su trabajo cotidiano: escuelas, guardias, dispositivos comunitarios, líneas de atención. Se trabaja la escucha, la evaluación inicial del riesgo y la articulación con la red, siempre dentro del alcance de cada rol.',
    resultados: [
      'Preguntar de forma directa y cuidada, sin rodeos ni promesas imposibles',
      'Reconocer señales de riesgo y factores que protegen a la persona',
      'Sostener el primer contacto y acordar un paso concreto',
      'Armar el mapa de derivación de la propia zona antes de necesitarlo',
    ],
    requisitos: 'Estar en contacto con personas en el trabajo o el voluntariado. Recomendada experiencia previa en el campo.',
    incluye: ['16 encuentros en vivo, todos grabados', 'Protocolos de primera intervención comentados', 'Espacio de cuidado del propio equipo', 'Certificado de asistencia'],
    aviso: 'Esta formación es para quien acompaña a otras personas. No reemplaza la atención clínica ni un servicio de emergencia: ante una situación en curso, comunicate con el sistema de salud de tu localidad.',
    modulos: [
      { id: 'm1', titulo: 'Sacarle el silencio al tema', clases: [
        { titulo: 'Mitos que frenan la pregunta', duracion: '50 min', tipo: 'video', preview: true },
        { titulo: 'La conversación de riesgo: qué se dice y qué no', duracion: '55 min', tipo: 'video' },
        { titulo: 'Ficha 1: preguntas guía', duracion: '20 min', tipo: 'pdf' },
      ] },
      { id: 'm2', titulo: 'Evaluación inicial y primer contacto', clases: [
        { titulo: 'Señales, contexto y factores protectores', duracion: '55 min', tipo: 'video' },
        { titulo: 'Acordar un paso posible con la persona', duracion: '50 min', tipo: 'video' },
        { titulo: 'Escenas comentadas por el equipo docente', duracion: '40 min', tipo: 'audio' },
      ] },
      { id: 'm3', titulo: 'Red, derivación y seguimiento', clases: [
        { titulo: 'Mapear la red de la propia zona', duracion: '50 min', tipo: 'video' },
        { titulo: 'Derivar sin soltar: qué se informa y a quién', duracion: '50 min', tipo: 'video' },
        { titulo: 'Ficha 2: registro y seguimiento', duracion: '25 min', tipo: 'lectura' },
      ] },
      { id: 'm4', titulo: 'Cuidado de quien acompaña', clases: [
        { titulo: 'Impacto emocional del trabajo con crisis', duracion: '50 min', tipo: 'video' },
        { titulo: 'Dispositivos de cuidado del equipo', duracion: '50 min', tipo: 'video' },
        { titulo: 'Consigna del trabajo final', duracion: '15 min', tipo: 'pdf' },
      ] },
    ],
    faq: [
      { q: '¿Puedo cursar si no soy profesional de la salud?', a: 'Sí. La formación trabaja el alcance de cada rol: qué puede hacer una preceptora, un operador o un referente barrial, y en qué momento articula con salud.' },
      { q: '¿Se trabajan casos reales?', a: 'Sí, con escenas anonimizadas que traen los participantes y material preparado por el equipo docente.' },
    ],
  },
  {
    id: 3, slug: 'adultos-mayores',
    etiquetas: ['adultos mayores','vejez','tercera edad','cuidadores','residencia','geriatrico','acompanamiento'],
    titulo: 'Acompañamiento de adultos mayores',
    eje: 'Cuidados', nivel: 'Inicial', modalidad: 'Híbrido',
    precio: 54000, descuento: 0, semanas: 6, duracion: '6 semanas', cantidadClases: 12,
    docenteId: 3, portada: 'images/curso-mayores.webp', badge: 'De entrada',
    alt: 'Persona mayor conversando con alguien que la acompaña en su casa',
    descripcionCorta: 'Vínculo, autonomía y red: cómo acompañar sin infantilizar y cómo sostener el lugar de la persona en su propia vida.',
    promesa: 'Trabajamos el acompañamiento de personas mayores desde los vínculos: qué cambia cuando alguien pierde autonomía, qué lugar ocupa la familia, cómo se arma una red de cuidado que no descanse en una sola persona.',
    resultados: [
      'Sostener la autonomía posible en cada etapa, sin decidir por la persona',
      'Trabajar con la familia sin quedar en el medio de sus conflictos',
      'Detectar aislamiento y activar la red disponible',
      'Organizar la rutina de cuidado entre varias personas',
    ],
    requisitos: 'Abierta a cuidadores, familiares, acompañantes y equipos de residencias. No requiere formación previa.',
    incluye: ['12 encuentros (10 en vivo y 2 asincrónicos)', 'Guías de rutina y de trabajo con la familia', 'Foro de consultas durante la cursada', 'Certificado de asistencia'],
    modulos: [
      { id: 'm1', titulo: 'Envejecer en vínculo', clases: [
        { titulo: 'Qué se pierde y qué se sostiene', duracion: '50 min', tipo: 'video', preview: true },
        { titulo: 'Autonomía, dependencia y decisión', duracion: '45 min', tipo: 'video' },
        { titulo: 'Ficha 1: la escucha en el acompañamiento', duracion: '20 min', tipo: 'lectura' },
      ] },
      { id: 'm2', titulo: 'La familia alrededor', clases: [
        { titulo: 'Roles y sobrecarga en el grupo familiar', duracion: '50 min', tipo: 'video' },
        { titulo: 'Reuniones familiares de cuidado', duracion: '45 min', tipo: 'video' },
        { titulo: 'Guía para repartir tareas sin conflicto', duracion: '25 min', tipo: 'pdf' },
      ] },
      { id: 'm3', titulo: 'Red y vida cotidiana', clases: [
        { titulo: 'Aislamiento: cómo se ve y qué se hace', duracion: '50 min', tipo: 'video' },
        { titulo: 'Actividades con sentido, no entretenimiento', duracion: '45 min', tipo: 'video' },
        { titulo: 'Casos comentados', duracion: '35 min', tipo: 'audio' },
      ] },
    ],
    faq: [
      { q: '¿Sirve si cuido a un familiar y no trabajo de esto?', a: 'Sí. Buena parte de quienes cursan acompañan a alguien de su familia y buscan hacerlo con menos desgaste.' },
      { q: '¿Qué significa modalidad híbrida acá?', a: 'Diez encuentros son en vivo por videollamada y dos son de trabajo asincrónico con material y consigna.' },
    ],
  },
  {
    id: 4, slug: 'consumos-problematicos',
    etiquetas: ['adicciones','drogas','alcohol','consumo problematico','reduccion de danos','centro barrial'],
    titulo: 'Consumos problemáticos: abordaje comunitario',
    eje: 'Comunidad', nivel: 'Intermedio', modalidad: 'En vivo',
    precio: 66000, descuento: 0, semanas: 12, duracion: '12 semanas', cantidadClases: 24,
    docenteId: 2, portada: 'images/curso-consumos.webp', badge: '',
    alt: 'Ronda de sillas en un espacio grupal de encuentro',
    descripcionCorta: 'Del consumo como problema individual al lazo que lo rodea: dispositivos grupales, reducción de daños y trabajo con la comunidad.',
    promesa: 'Una formación larga para equipos que trabajan con consumos en dispositivos comunitarios, centros barriales y áreas municipales. El eje es el lazo social: qué sostiene el consumo, qué lo interrumpe y qué puede ofrecer un grupo.',
    resultados: [
      'Recibir una consulta sin moralizar ni exigir abstinencia como punto de partida',
      'Coordinar espacios grupales con asistencia irregular',
      'Trabajar con la familia y con la red del barrio',
      'Ubicar el propio dispositivo dentro del circuito de salud',
    ],
    requisitos: 'Dirigida a equipos e integrantes de organizaciones que ya trabajan en el campo.',
    incluye: ['24 encuentros en vivo, todos grabados', 'Bibliografía comentada por módulo', 'Dos supervisiones grupales de casos', 'Certificado de asistencia'],
    modulos: [
      { id: 'm1', titulo: 'Qué llamamos consumo problemático', clases: [
        { titulo: 'Del sujeto aislado a la trama que lo rodea', duracion: '55 min', tipo: 'video', preview: true },
        { titulo: 'Estigma: cómo opera en la puerta de entrada', duracion: '50 min', tipo: 'video' },
        { titulo: 'Ficha 1: marco de trabajo', duracion: '25 min', tipo: 'lectura' },
      ] },
      { id: 'm2', titulo: 'La primera entrevista', clases: [
        { titulo: 'Recibir sin condicionar', duracion: '55 min', tipo: 'video' },
        { titulo: 'Acuerdos posibles y reducción de daños', duracion: '50 min', tipo: 'video' },
        { titulo: 'Escenas comentadas', duracion: '40 min', tipo: 'audio' },
      ] },
      { id: 'm3', titulo: 'Dispositivos grupales', clases: [
        { titulo: 'Coordinar un grupo con asistencia irregular', duracion: '55 min', tipo: 'video' },
        { titulo: 'Actividad, tarea y sostén del encuadre', duracion: '50 min', tipo: 'video' },
        { titulo: 'Guía de coordinación grupal', duracion: '25 min', tipo: 'pdf' },
      ] },
      { id: 'm4', titulo: 'Familia, barrio y red', clases: [
        { titulo: 'Trabajo con familias', duracion: '55 min', tipo: 'video' },
        { titulo: 'Articulación con salud, educación y justicia', duracion: '50 min', tipo: 'video' },
        { titulo: 'Consigna del trabajo final', duracion: '15 min', tipo: 'pdf' },
      ] },
    ],
    faq: [
      { q: '¿Se trabaja desde la abstinencia?', a: 'No como punto de partida obligatorio. Se trabajan los distintos encuadres posibles, incluida la reducción de daños, y cuándo corresponde cada uno.' },
      { q: '¿Es una formación clínica?', a: 'No. Es una formación en abordaje comunitario y coordinación de dispositivos, no en tratamiento individual.' },
    ],
  },
  {
    id: 5, slug: 'grupos-familiares',
    etiquetas: ['familia','vinculos','crianza','convivencia','genograma','entrevista familiar'],
    titulo: 'Vínculos familiares: intervención con grupos familiares',
    eje: 'Familia', nivel: 'Inicial', modalidad: 'Grabado',
    precio: 48000, descuento: 15, semanas: 8, duracion: '8 semanas', cantidadClases: 16,
    docenteId: 1, portada: 'images/curso-familias.webp', badge: '',
    alt: 'Grupo familiar conversando sentado en el living de una casa',
    descripcionCorta: 'Cómo mira la psicología social a una familia: roles, historia y acuerdos, para mejorar los vínculos sin buscar culpables.',
    promesa: 'Una entrada al trabajo con grupos familiares. Cursada grabada, con foro y dos encuentros de consulta en vivo, pensada para quien coordina espacios con familias o quiere entender mejor la trama de la propia.',
    resultados: [
      'Mapear roles y alianzas dentro de un grupo familiar',
      'Coordinar una entrevista familiar sin tomar partido',
      'Trabajar acuerdos concretos y revisables',
      'Reconocer cuándo la situación excede el propio rol y hay que derivar',
    ],
    requisitos: 'Abierta. No requiere formación previa.',
    incluye: ['16 clases grabadas con acceso durante la cursada', 'Dos encuentros de consulta en vivo', 'Foro con el equipo docente', 'Certificado de asistencia'],
    modulos: [
      { id: 'm1', titulo: 'La familia como grupo', clases: [
        { titulo: 'Roles, mitos y historia familiar', duracion: '45 min', tipo: 'video', preview: true },
        { titulo: 'Lo que se repite entre generaciones', duracion: '45 min', tipo: 'video' },
        { titulo: 'Ficha 1: genograma simple', duracion: '20 min', tipo: 'pdf' },
      ] },
      { id: 'm2', titulo: 'La entrevista familiar', clases: [
        { titulo: 'Encuadre y primera reunión', duracion: '50 min', tipo: 'video' },
        { titulo: 'Cuando cada uno cuenta otra historia', duracion: '45 min', tipo: 'video' },
        { titulo: 'Escenas comentadas', duracion: '35 min', tipo: 'audio' },
      ] },
      { id: 'm3', titulo: 'Acuerdos y cambios', clases: [
        { titulo: 'De la queja al acuerdo posible', duracion: '45 min', tipo: 'video' },
        { titulo: 'Sostener el cambio en la vida cotidiana', duracion: '45 min', tipo: 'video' },
        { titulo: 'Ficha 2: seguimiento de acuerdos', duracion: '20 min', tipo: 'lectura' },
      ] },
    ],
    faq: [
      { q: '¿Cómo funciona la cursada grabada?', a: 'Se libera un módulo por semana, con foro abierto para consultas y dos encuentros en vivo de cierre.' },
      { q: '¿Habilita a atender familias?', a: 'No. Es una formación de entrada: aporta marco y herramientas de coordinación, no una habilitación clínica.' },
    ],
  },
];

const ICONOS = {
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 10 4.5-2.6v9.2L16 14"/><rect x="3" y="6" width="13" height="12" rx="2"/></svg>',
  lectura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M8 7h8M8 11h6"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3v5h5"/><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M9 14h6M9 17h4"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16M8 8v8M4 11v2M16 7v10M20 10v4"/></svg>',
};
const NOMBRE_TIPO = { video: 'Clase en video', lectura: 'Lectura', pdf: 'Material PDF', audio: 'Audio' };

const getCurso = id => CURSOS.find(c => c.id === id);
const getDocente = id => DOCENTES.find(d => d.id === id);

const Cart = {
  KEY: 'tramavincular_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); },
  ahorro() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + (c.precio - precioFinal(c)) : s; }, 0); },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
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

let revealsListos = false;
let revealIO = null;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.07, 0.35)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  revealIO = io;
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.3)}s`;
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight + 120) requestAnimationFrame(() => el.classList.add('in'));
    else if (revealIO) revealIO.observe(el);
    else el.classList.add('in');
  });
}

function cardCurso(curso, indice) {
  const doc = getDocente(curso.docenteId);
  const final = precioFinal(curso);
  const enCarrito = Cart.has(curso.id);
  const folio = String(indice + 1).padStart(2, '0');
  return `
    <article class="curso-card" data-animate style="opacity:0;transform:translateY(18px)">
      <div class="curso-figura">
        <img src="${esc(curso.portada)}" width="1200" height="900" alt="${esc(curso.alt)}" decoding="async">
        <span class="curso-folio">${folio}</span>
        ${curso.badge ? `<span class="curso-badge">${esc(curso.badge)}</span>` : ''}
      </div>
      <div class="curso-body">
        <p class="curso-eje">${esc(curso.eje)}</p>
        <h3>${esc(curso.titulo)}</h3>
        <p class="curso-docente">${esc(doc?.nombre || 'Equipo docente')}</p>
        <div class="curso-meta">
          <span>${esc(curso.duracion)}</span>
          <span>${esc(curso.nivel)}</span>
          <span>${curso.cantidadClases} clases</span>
          <span>${esc(curso.modalidad)}</span>
        </div>
        <div class="curso-precio">
          <strong>${formatearPrecio(final)}</strong>
          ${curso.descuento > 0 ? `<s>${formatearPrecio(curso.precio)}</s><em>-${curso.descuento}%</em>` : ''}
        </div>
        <div class="curso-actions">
          <button type="button" class="btn btn-ghost curso-ver" data-ver="${curso.id}">Ver el programa</button>
          <button type="button" class="btn btn-primary curso-add" data-add="${curso.id}"${enCarrito ? ' disabled' : ''}>${enCarrito ? 'Ya está sumada' : 'Inscribirme'}</button>
        </div>
      </div>
    </article>`;
}

const estado = { texto: '', eje: '', nivel: '', modalidad: '', duracion: '' };

function cursosFiltrados() {
  const q = normalizar(estado.texto).split(/\s+/).filter(Boolean);
  return CURSOS.filter(c => {
    const doc = getDocente(c.docenteId);
    const bolsa = normalizar([c.titulo, c.eje, c.nivel, c.modalidad, c.descripcionCorta, c.promesa, doc?.nombre, doc?.rol, (c.etiquetas || []).join(' '), c.modulos.map(m => m.titulo).join(' ')].join(' '));
    if (q.length && !q.every(w => bolsa.includes(w))) return false;
    if (estado.eje && c.eje !== estado.eje) return false;
    if (estado.nivel && c.nivel !== estado.nivel) return false;
    if (estado.modalidad && c.modalidad !== estado.modalidad) return false;
    if (estado.duracion === 'corta' && c.semanas > 8) return false;
    if (estado.duracion === 'larga' && c.semanas <= 8) return false;
    return true;
  });
}

function renderCursos() {
  const grid = document.getElementById('cursos-grid');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;
  const lista = cursosFiltrados();
  grid.innerHTML = lista.map((c) => cardCurso(c, CURSOS.indexOf(c))).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (contador) contador.textContent = lista.length === 1 ? '1 formación' : `${lista.length} formaciones`;
  const hayFiltros = !!(estado.texto || estado.eje || estado.nivel || estado.modalidad || estado.duracion);
  if (limpiar) limpiar.hidden = !hayFiltros;
  revelarNuevos(grid);
}

function initFiltros() {
  const buscar = document.getElementById('buscar');
  const fEje = document.getElementById('f-eje');
  const fNivel = document.getElementById('f-nivel');
  const fModalidad = document.getElementById('f-modalidad');
  const fDuracion = document.getElementById('f-duracion');
  const limpiar = document.getElementById('limpiar');
  const reset = document.getElementById('vacio-reset');

  const llenar = (sel, valores) => {
    if (!sel) return;
    valores.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      sel.appendChild(opt);
    });
  };
  llenar(fEje, [...new Set(CURSOS.map(c => c.eje))]);
  llenar(fNivel, [...new Set(CURSOS.map(c => c.nivel))]);
  llenar(fModalidad, [...new Set(CURSOS.map(c => c.modalidad))]);

  buscar?.addEventListener('input', () => { estado.texto = buscar.value; renderCursos(); });
  fEje?.addEventListener('change', () => { estado.eje = fEje.value; renderCursos(); });
  fNivel?.addEventListener('change', () => { estado.nivel = fNivel.value; renderCursos(); });
  fModalidad?.addEventListener('change', () => { estado.modalidad = fModalidad.value; renderCursos(); });
  fDuracion?.addEventListener('change', () => { estado.duracion = fDuracion.value; renderCursos(); });

  const limpiarTodo = () => {
    estado.texto = ''; estado.eje = ''; estado.nivel = ''; estado.modalidad = ''; estado.duracion = '';
    if (buscar) buscar.value = '';
    [fEje, fNivel, fModalidad, fDuracion].forEach(s => { if (s) s.value = ''; });
    renderCursos();
  };
  limpiar?.addEventListener('click', limpiarTodo);
  reset?.addEventListener('click', limpiarTodo);

  document.getElementById('cursos-grid')?.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(Number(ver.dataset.ver)); return; }
    const add = e.target.closest('[data-add]');
    if (add) agregarCurso(Number(add.dataset.add));
  });

  renderCursos();
}

function agregarCurso(id) {
  const curso = getCurso(id);
  if (!curso) return;
  if (Cart.add(curso)) {
    showToast(`Sumamos «${curso.titulo}» a tu inscripción.`);
  } else {
    showToast('Esa formación ya está en tu inscripción.');
    abrirDrawer();
  }
  renderCursos();
  sincronizarModal(id);
}

let ultimoFoco = null;
let trapActivo = null;

function activarTrap(contenedor) {
  const sel = 'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  const handler = e => {
    if (e.key !== 'Tab') return;
    const focusables = [...contenedor.querySelectorAll(sel)].filter(el => el.offsetParent !== null || el === document.activeElement);
    if (!focusables.length) return;
    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };
  document.addEventListener('keydown', handler);
  trapActivo = handler;
}
function desactivarTrap() {
  if (trapActivo) document.removeEventListener('keydown', trapActivo);
  trapActivo = null;
}

function drawerItem(curso) {
  const final = precioFinal(curso);
  return `
    <div class="drawer-item">
      <img src="${esc(curso.portada)}" width="1200" height="900" alt="" decoding="async">
      <div>
        <h3>${esc(curso.titulo)}</h3>
        <p>${esc(curso.modalidad)} · ${esc(curso.duracion)} · ${esc(curso.nivel)}</p>
        <strong>${formatearPrecio(final)}</strong>
        ${curso.descuento > 0 ? `<p>Ahorro: ${formatearPrecio(curso.precio - final)}</p>` : ''}
      </div>
      <button type="button" class="drawer-quitar" data-quitar="${curso.id}">Quitar</button>
    </div>`;
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const total = document.getElementById('drawer-total');
  if (!body) return;
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = `
      <div class="drawer-vacio">
        <p>Todavía no elegiste ninguna formación.</p>
        <button type="button" class="btn btn-primary" data-cerrar-drawer>Ver las formaciones</button>
      </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(drawerItem).join('');
  const ahorro = Cart.ahorro();
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  const nota = document.querySelector('.drawer-nota');
  if (nota) {
    nota.textContent = ahorro > 0
      ? `Incluye ${formatearPrecio(ahorro)} de descuento. Las formaciones se abonan una sola vez.`
      : 'Las formaciones se abonan una sola vez. No incluye materiales impresos.';
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  renderDrawer();
  bd.hidden = false;
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('open'));
  document.body.classList.add('no-scroll');
  activarTrap(drawer);
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || !bd) return;
  drawer.classList.remove('open');
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  desactivarTrap();
  setTimeout(() => { drawer.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  document.getElementById('header-cart')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-body')?.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const id = Number(quitar.dataset.quitar);
      Cart.remove(id);
      renderDrawer();
      renderCursos();
      sincronizarModal(id);
      showToast('Sacamos la formación de tu inscripción.');
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('formaciones')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('drawer')?.classList.contains('open')) cerrarDrawer();
  });
  document.addEventListener('cart:updated', () => { renderDrawer(); updateCartBadge(); });
}

function claseHTML(clase) {
  const icono = ICONOS[clase.tipo] || ICONOS.video;
  return `
    <div class="clase">
      ${icono}
      <span class="clase-nombre">${esc(clase.titulo)}</span>
      ${clase.preview ? '<span class="clase-preview">Clase abierta</span>' : ''}
      <span class="clase-dur">${esc(clase.duracion)}</span>
      <span class="sr-only">${esc(NOMBRE_TIPO[clase.tipo] || 'Clase')}</span>
    </div>`;
}

function contenidoModal(curso) {
  const doc = getDocente(curso.docenteId);
  const final = precioFinal(curso);
  const enCarrito = Cart.has(curso.id);
  return `
    <figure class="modal-figura">
      <img src="${esc(curso.portada)}" width="1200" height="900" alt="${esc(curso.alt)}" decoding="async">
    </figure>
    <div class="modal-body">
      <div class="modal-head">
        <p class="eyebrow">${esc(curso.eje)}</p>
        <h2>${esc(curso.titulo)}</h2>
        <p class="modal-promesa">${esc(curso.promesa)}</p>
        ${curso.aviso ? `<p class="modal-promesa"><strong>${esc(curso.aviso)}</strong></p>` : ''}
      </div>

      <div class="modal-compra">
        <div class="modal-precio">
          <strong>${formatearPrecio(final)}</strong>
          ${curso.descuento > 0 ? `<s>${formatearPrecio(curso.precio)}</s>` : ''}
        </div>
        <button type="button" class="btn btn-primary" data-add-modal="${curso.id}"${enCarrito ? ' disabled' : ''}>${enCarrito ? 'Ya está sumada' : 'Sumar a mi inscripción'}</button>
      </div>

      <dl class="modal-meta">
        <div><dt>Duración</dt><dd>${esc(curso.duracion)}</dd></div>
        <div><dt>Clases</dt><dd>${curso.cantidadClases}</dd></div>
        <div><dt>Nivel</dt><dd>${esc(curso.nivel)}</dd></div>
        <div><dt>Modalidad</dt><dd>${esc(curso.modalidad)}</dd></div>
        <div><dt>Acceso</dt><dd>Durante toda la cursada</dd></div>
      </dl>

      <div class="modal-bloque">
        <h3>Qué vas a poder hacer</h3>
        <ul class="modal-lista">${curso.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>

      <div class="modal-bloque">
        <h3>Programa</h3>
        ${curso.modulos.map((m, i) => `
          <details class="modulo"${i === 0 ? ' open' : ''}>
            <summary><span class="folio">${String(i + 1).padStart(2, '0')}</span> ${esc(m.titulo)}</summary>
            <div class="clases">${m.clases.map(claseHTML).join('')}</div>
          </details>`).join('')}
      </div>

      <div class="modal-bloque">
        <h3>Requisitos</h3>
        <p class="modal-promesa">${esc(curso.requisitos)}</p>
      </div>

      <div class="modal-bloque">
        <h3>Qué incluye</h3>
        <ul class="modal-lista">${curso.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>

      <div class="modal-docente">
        <span class="perfil-sigla" aria-hidden="true">${esc(doc?.sigla || 'TV')}</span>
        <div>
          <h4>${esc(doc?.nombre || 'Equipo docente')}</h4>
          <p>${esc(doc?.rol || '')}. ${esc(doc?.bio || '')}</p>
          <p class="perfil-nota">Perfil demostrativo</p>
        </div>
      </div>

      <div class="modal-bloque">
        <h3>Preguntas sobre esta formación</h3>
        ${curso.faq.map(f => `
          <details class="modulo">
            <summary>${esc(f.q)}</summary>
            <div class="clases"><p class="modal-promesa">${esc(f.a)}</p></div>
          </details>`).join('')}
      </div>
    </div>`;
}

let cursoAbierto = null;

function abrirModal(id) {
  const curso = getCurso(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  const content = document.getElementById('modal-content');
  if (!curso || !modal || !bd || !content) return;
  ultimoFoco = document.activeElement;
  cursoAbierto = curso.id;
  content.innerHTML = contenidoModal(curso);
  modal.setAttribute('aria-label', `Programa de ${curso.titulo}`);
  bd.hidden = false;
  modal.hidden = false;
  modal.scrollTop = 0;
  document.body.classList.add('no-scroll');
  activarTrap(modal);
  document.getElementById('modal-close')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  if (!modal || !bd) return;
  modal.hidden = true;
  bd.hidden = true;
  cursoAbierto = null;
  document.body.classList.remove('no-scroll');
  desactivarTrap();
  ultimoFoco?.focus();
}

function sincronizarModal(id) {
  if (cursoAbierto !== id) return;
  const btn = document.querySelector('[data-add-modal]');
  if (!btn) return;
  const enCarrito = Cart.has(id);
  btn.disabled = enCarrito;
  btn.textContent = enCarrito ? 'Ya está sumada' : 'Sumar a mi inscripción';
}

function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-content')?.addEventListener('click', e => {
    const add = e.target.closest('[data-add-modal]');
    if (add) agregarCurso(Number(add.dataset.addModal));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal')?.hidden) cerrarModal();
  });
  const slug = new URLSearchParams(location.search).get('curso');
  if (slug) {
    const curso = CURSOS.find(c => c.slug === slug);
    if (curso) abrirModal(curso.id);
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initAnio() {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

initFiltros();
initReveals();
initNav();
initDrawer();
initModal();
initFloats();
initAnio();
updateCartBadge();
