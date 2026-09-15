document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5491123922934';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';

if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);
if (!hasGSAP) {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (hasST) window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;

const ICONOS = {
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  clases: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v13a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 1 4 16Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v13a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 0 20 16Z"/></svg>',
  nivel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 19v-6M12 19V8M19 19V5"/></svg>',
  modo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 12 5-3v9l-5-3z"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg>',
  vivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M6.5 7.5a7 7 0 0 0 0 9M17.5 7.5a7 7 0 0 1 0 9"/></svg>',
  suma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  quitar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  circulo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>'
};

const CURSOS = [
  {
    id: 'biodecodificacion',
    titulo: 'Biodecodificación: el síntoma como mensaje',
    categoria: 'Biodecodificación',
    nivel: 'Inicial',
    modalidad: 'En vivo online',
    precio: 96000, descuento: 0,
    duracion: '8 encuentros · 2 meses',
    cantidadClases: 9,
    badge: 'Más elegido',
    portada: 'images/taller-de-biodecodificacion_1x1.webp',
    alt: 'Encuentro de taller de biodecodificación con lámina anatómica y grupo tomando notas',
    descripcionCorta: 'Aprendé a leer lo que el cuerpo repite: cuándo empezó, con qué se relaciona y qué preguntas abren el tema en vez de cerrarlo.',
    promesa: 'Salís sabiendo mirar un síntoma como información y no como enemigo, con un método para rastrear cuándo empezó y qué lo sostiene.',
    descripcion: 'Es el curso de entrada. Trabajamos sobre casos reales del grupo y sobre el tuyo: qué se repite en tu cuerpo, en qué momento apareció y qué estaba pasando alrededor. No se trata de encontrar culpables ni de reemplazar al médico, sino de sumar una lectura más a lo que ya sabés de vos.',
    resultados: ['Rastrear el momento de inicio de un síntoma y lo que lo rodeaba', 'Distinguir los cuatro grandes temas de conflicto y ubicarlos en tu historia', 'Formular preguntas que abren el tema sin dirigir la respuesta', 'Reconocer cuándo un caso se deriva a un profesional de la salud'],
    requisitos: ['Ninguno: arranca desde cero', 'Ganas de mirar la propia historia', 'Un cuaderno para los registros'],
    incluye: ['8 encuentros en vivo por videollamada', 'Grabación de cada encuentro durante toda la cursada', 'Cuadernillo por módulo con ejercicios', 'Grupo de consultas abierto', 'Certificado de asistencia'],
    faq: [
      { q: '¿Sirve si nunca hice terapia?', a: 'Sí. Muchas personas llegan sin haber hecho ningún proceso previo. El curso está armado para eso.' },
      { q: '¿Puedo usarlo para acompañar a otros?', a: 'Este curso es de nivel inicial y está pensado para tu propio proceso. Para acompañar hace falta seguir con los niveles de formación.' }
    ],
    modulos: [
      { titulo: 'El cuerpo habla', clases: [
        { titulo: 'Qué es y qué no es la biodecodificación', duracion: '18 min', tipo: 'video', preview: true },
        { titulo: 'El síntoma como señal, no como enemigo', duracion: '24 min', tipo: 'video' },
        { titulo: 'Tu primer registro corporal', duracion: '12 min', tipo: 'pdf' }
      ]},
      { titulo: 'El mapa del conflicto', clases: [
        { titulo: 'Conflicto, shock y momento de inicio', duracion: '26 min', tipo: 'video' },
        { titulo: 'Territorio, vínculo, protección y valor', duracion: '30 min', tipo: 'video' },
        { titulo: 'Rastrear la fecha del síntoma', duracion: '15 min', tipo: 'pdf' }
      ]},
      { titulo: 'Llevarlo a la vida', clases: [
        { titulo: 'Preguntas que abren y preguntas que cierran', duracion: '22 min', tipo: 'video' },
        { titulo: 'Cuándo derivar y a quién', duracion: '16 min', tipo: 'video' },
        { titulo: 'Cierre: tu bitácora de 21 días', duracion: '10 min', tipo: 'pdf' }
      ]}
    ]
  },
  {
    id: 'bioneuroemocion',
    titulo: 'Bioneuroemoción: la historia detrás del malestar',
    categoria: 'Bioneuroemoción',
    nivel: 'Intermedio',
    modalidad: 'En vivo online',
    precio: 128000, descuento: 15,
    duracion: '10 encuentros · 3 meses',
    cantidadClases: 9,
    badge: '',
    portada: 'images/curso-de-bioneuroemocion_1x1.webp',
    alt: 'Grupo sentado en círculo durante un encuentro de bioneuroemoción',
    descripcionCorta: 'La entrevista como herramienta: escuchar sin dirigir, ver el sistema completo y devolver lo que aparece sin interpretar de más.',
    promesa: 'Terminás con una estructura de entrevista propia y con criterio para sostener lo que aparece sin llenarlo de interpretaciones.',
    descripcion: 'Acá el foco está en la escucha. Practicamos la entrevista una y otra vez, en duplas y con supervisión, hasta que la pregunta deja de ser una técnica y pasa a ser una forma de estar. Es el curso que más cambia la manera de conversar, dentro y fuera de la consulta.',
    resultados: ['Conducir una entrevista sin inducir la respuesta', 'Leer a la persona dentro de su sistema familiar y no aislada', 'Detectar el conflicto que sostiene la escena que se repite', 'Devolver lo observado con cuidado y sin diagnosticar'],
    requisitos: ['Haber cursado Biodecodificación o tener formación previa equivalente', 'Disponibilidad para practicar en duplas entre encuentros'],
    incluye: ['10 encuentros en vivo por videollamada', 'Dos supervisiones grupales de casos', 'Guía de entrevista imprimible', 'Grabaciones y cuadernillos', 'Certificado de asistencia'],
    faq: [
      { q: '¿Hace falta el curso inicial?', a: 'Sí, o una formación equivalente. Si venís de otra escuela, escribime y lo vemos.' },
      { q: '¿Se practica con casos reales?', a: 'Se practica entre compañeros y con casos del grupo, siempre con acuerdo previo y confidencialidad.' }
    ],
    modulos: [
      { titulo: 'La escucha', clases: [
        { titulo: 'Qué observa la bioneuroemoción', duracion: '20 min', tipo: 'video', preview: true },
        { titulo: 'La entrevista: preguntar sin dirigir', duracion: '28 min', tipo: 'video' },
        { titulo: 'Práctica guiada de escucha', duracion: '35 min', tipo: 'vivo' }
      ]},
      { titulo: 'El sistema entero', clases: [
        { titulo: 'La familia como campo', duracion: '26 min', tipo: 'video' },
        { titulo: 'Roles, lugares y repeticiones', duracion: '24 min', tipo: 'video' },
        { titulo: 'Detectar el conflicto oculto', duracion: '18 min', tipo: 'video' }
      ]},
      { titulo: 'La devolución', clases: [
        { titulo: 'Cómo se devuelve lo que aparece', duracion: '22 min', tipo: 'video' },
        { titulo: 'Sostener sin interpretar de más', duracion: '20 min', tipo: 'video' },
        { titulo: 'Supervisión de casos del grupo', duracion: '45 min', tipo: 'vivo' }
      ]}
    ]
  },
  {
    id: 'transgeneracional',
    titulo: 'Terapia transgeneracional: el árbol que te trajo',
    categoria: 'Transgeneracional',
    nivel: 'Intermedio',
    modalidad: 'Presencial · Zona Sur',
    precio: 110000, descuento: 0,
    duracion: '6 encuentros · 6 semanas',
    cantidadClases: 9,
    badge: 'Nuevo',
    portada: 'images/curso-de-terapia-transgeneracional_1x1.webp',
    alt: 'Trabajo sobre el árbol genealógico con fotos familiares y anotaciones',
    descripcionCorta: 'Armás tu genograma de tres generaciones y aprendés a leer fechas, nombres y repeticiones que venían de antes de vos.',
    promesa: 'Te vas con tu árbol dibujado y con la capacidad de leer en él las repeticiones que hasta ahora sentías como mala suerte.',
    descripcion: 'Es el curso más movilizador y por eso es presencial. Trabajamos en grupo chico, con papel grande, fotos y fechas. Vas a necesitar preguntar en tu familia: eso también es parte del trabajo. Cerramos con un ritual de honra que cada quien arma a su medida.',
    resultados: ['Dibujar un genograma completo de tres generaciones', 'Identificar aniversarios, nombres repetidos y fechas que se cruzan', 'Reconocer lealtades invisibles y mandatos heredados', 'Cerrar con un ritual propio de devolución y honra'],
    requisitos: ['Haber hecho algún proceso terapéutico previo (propio o de formación)', 'Traer los datos familiares que puedas conseguir', 'Presencialidad en Zona Sur, GBA'],
    incluye: ['6 encuentros presenciales de 3 horas', 'Plantillas de genograma en tamaño grande', 'Material impreso por módulo', 'Encuentro final de puesta en común', 'Certificado de asistencia'],
    faq: [
      { q: '¿Y si no tengo datos de mi familia?', a: 'Se trabaja igual. Los huecos también dicen algo, y hay formas de reconstruir sin interrogar a nadie.' },
      { q: '¿Dónde es?', a: 'En Zona Sur del Gran Buenos Aires. La dirección exacta se pasa por WhatsApp al confirmar el cupo.' }
    ],
    modulos: [
      { titulo: 'Armar el árbol', clases: [
        { titulo: 'Cómo se dibuja un genograma', duracion: '24 min', tipo: 'video', preview: true },
        { titulo: 'Qué datos buscar y a quién preguntar', duracion: '18 min', tipo: 'video' },
        { titulo: 'Tu árbol de tres generaciones', duracion: 'Ejercicio', tipo: 'pdf' }
      ]},
      { titulo: 'Lo que se repite', clases: [
        { titulo: 'Fechas, nombres y aniversarios', duracion: '28 min', tipo: 'video' },
        { titulo: 'Lealtades invisibles y mandatos', duracion: '26 min', tipo: 'video' },
        { titulo: 'Los excluidos del sistema', duracion: '22 min', tipo: 'video' }
      ]},
      { titulo: 'Devolver con respeto', clases: [
        { titulo: 'Rituales de cierre y de honra', duracion: '24 min', tipo: 'video' },
        { titulo: 'Cartas que no se envían', duracion: '16 min', tipo: 'pdf' },
        { titulo: 'Puesta en común del grupo', duracion: '50 min', tipo: 'vivo' }
      ]}
    ]
  },
  {
    id: 'meditacion',
    titulo: 'Meditación y sanación: volver al cuerpo',
    categoria: 'Meditación',
    nivel: 'Inicial',
    modalidad: 'Grabado + encuentros',
    precio: 54000, descuento: 20,
    duracion: '12 prácticas · a tu ritmo',
    cantidadClases: 9,
    badge: '',
    portada: 'images/curso-de-meditacion-y-sanacion_1x1.webp',
    alt: 'Círculo de meditación con velas encendidas y almohadones',
    descripcionCorta: 'Prácticas cortas y guiadas para sostener la meditación en la vida real, incluso los días en que no tenés ganas.',
    promesa: 'Terminás con una rutina propia de práctica que podés sostener en semanas ocupadas, no solo en los días tranquilos.',
    descripcion: 'Todas las prácticas están grabadas y las hacés cuando podés. Una vez por mes hay un encuentro en vivo para ordenar dudas y compartir cómo viene la práctica. Está pensado para gente que ya intentó meditar y lo dejó: la mayoría de las prácticas dura menos de quince minutos.',
    resultados: ['Sostener una práctica corta y diaria sin depender del ánimo', 'Usar la respiración como herramienta concreta en momentos de ansiedad', 'Hacer un escaneo corporal completo por tu cuenta', 'Armar tu propia rutina según tus horarios'],
    requisitos: ['Ninguno', 'Un lugar donde sentarte sin que te interrumpan diez minutos'],
    incluye: ['12 prácticas guiadas en audio y video', 'Un encuentro en vivo por mes', 'Guía imprimible de rutinas', 'Acceso durante 12 meses', 'Certificado de asistencia'],
    faq: [
      { q: '¿Necesito experiencia?', a: 'No. Las primeras prácticas son de siete a doce minutos y están guiadas paso a paso.' },
      { q: '¿Por cuánto tiempo lo tengo?', a: 'El acceso a las prácticas dura 12 meses desde la inscripción.' }
    ],
    modulos: [
      { titulo: 'Empezar', clases: [
        { titulo: 'Sentarse sin pelearse con la cabeza', duracion: '12 min', tipo: 'video', preview: true },
        { titulo: 'Respiración consciente en 7 minutos', duracion: '9 min', tipo: 'audio' },
        { titulo: 'Escaneo corporal guiado', duracion: '14 min', tipo: 'audio' }
      ]},
      { titulo: 'Sostener la práctica', clases: [
        { titulo: 'Meditar cuando no tenés ganas', duracion: '11 min', tipo: 'video' },
        { titulo: 'Práctica para la ansiedad de la noche', duracion: '16 min', tipo: 'audio' },
        { titulo: 'Práctica corta para el día laboral', duracion: '7 min', tipo: 'audio' }
      ]},
      { titulo: 'Profundizar', clases: [
        { titulo: 'Meditación con vela y respiración', duracion: '18 min', tipo: 'audio' },
        { titulo: 'Gratitud y cierre del día', duracion: '12 min', tipo: 'audio' },
        { titulo: 'Armá tu propia rutina', duracion: '10 min', tipo: 'pdf' }
      ]}
    ]
  },
  {
    id: 'rituales',
    titulo: 'Rituales: herramientas para tu práctica',
    categoria: 'Herramientas',
    nivel: 'Formación',
    modalidad: 'Presencial · Zona Sur',
    precio: 68000, descuento: 0,
    duracion: '4 encuentros · 1 mes',
    cantidadClases: 9,
    badge: '',
    portada: 'images/ritual-de-cristales-y-velas_1x1.webp',
    alt: 'Elementos de ritual: cuaderno, cuarzos, velas, infusión de rosas y lavanda',
    descripcionCorta: 'Cómo se prepara, se sostiene y se cierra un espacio de trabajo, con los elementos que sirven de verdad y sin comprar de más.',
    promesa: 'Te vas con un espacio de trabajo armado, un botiquín básico propio y dos rituales que podés usar desde la semana siguiente.',
    descripcion: 'Es el curso más práctico y el más terrenal: qué necesitás para abrir y cerrar un espacio, cómo se sostiene el encuadre y qué de todo lo que se vende en el rubro sirve realmente. Sin promesas mágicas y sin listas de compras interminables.',
    resultados: ['Preparar y cerrar un espacio de trabajo con criterio', 'Elegir elementos por función y no por moda', 'Conducir un ritual de inicio y uno de cierre de proceso', 'Armar tu botiquín básico con lo mínimo necesario'],
    requisitos: ['Haber cursado alguno de los cursos iniciales', 'Presencialidad en Zona Sur, GBA'],
    incluye: ['4 encuentros presenciales', 'Kit básico de elementos para empezar', 'Guía impresa de rituales', 'Encuentro final abierto', 'Certificado de asistencia'],
    faq: [
      { q: '¿Tengo que comprar cristales caros?', a: 'No. Una de las clases es específicamente sobre qué hace falta de verdad y qué no.' },
      { q: '¿Es un curso religioso?', a: 'No pertenece a ninguna religión ni tradición cerrada. Es un encuadre de trabajo, no una creencia.' }
    ],
    modulos: [
      { titulo: 'El espacio', clases: [
        { titulo: 'Preparar un espacio de trabajo', duracion: '20 min', tipo: 'video', preview: true },
        { titulo: 'Limpieza y cierre del espacio', duracion: '18 min', tipo: 'video' },
        { titulo: 'Qué hace falta de verdad y qué no', duracion: '14 min', tipo: 'video' }
      ]},
      { titulo: 'Los elementos', clases: [
        { titulo: 'Velas, agua y sahumado: para qué sirve cada uno', duracion: '26 min', tipo: 'video' },
        { titulo: 'Cristales sin misticismo de vidriera', duracion: '22 min', tipo: 'video' },
        { titulo: 'Armá tu botiquín básico', duracion: 'Ejercicio', tipo: 'pdf' }
      ]},
      { titulo: 'Ritos de pasaje', clases: [
        { titulo: 'Ritual de inicio de proceso', duracion: '24 min', tipo: 'video' },
        { titulo: 'Ritual de cierre y agradecimiento', duracion: '20 min', tipo: 'video' },
        { titulo: 'Encuentro final presencial', duracion: '90 min', tipo: 'vivo' }
      ]}
    ]
  }
];

const getCurso = id => CURSOS.find(c => c.id === id);

const Cart = {
  KEY: 'viajealmico_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(id) { if (this.has(id)) return false; const items = this.get(); items.push({ id }); this.save(items); return true; },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `${ICONOS.check}<span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  const sync = () => { if (window.innerWidth > 768) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  sync();
  window.addEventListener('resize', sync, { passive: true });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (!hasGSAP || reduceMotion) {
    hero.querySelectorAll('.hero-kicker,.hero-panel,.hero-obj,.hero-arco,.hero-title .line-in').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-arco', { opacity: 0 }, { opacity: 1, duration: .9, ease: 'power2.out' }, 0)
    .fromTo('.hero-arco img', { scale: 1.16, yPercent: 5 }, { scale: 1, yPercent: 0, duration: 1.6, ease: 'expo.out' }, 0)
    .fromTo('.hero-kicker', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .3)
    .fromTo('.hero-title .line-in', { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: .09, ease: 'expo.out' }, .38)
    .fromTo('.hero-panel', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .85 }, .78)
    .fromTo('.hero-obj-diario', { y: 70, opacity: 0, rotate: -18 }, { y: 0, opacity: 1, rotate: -8, duration: 1.15, ease: 'expo.out' }, .55)
    .fromTo('.hero-obj-taza', { y: 40, opacity: 0, rotate: 16 }, { y: 0, opacity: 1, rotate: 6, duration: 1, ease: 'expo.out' }, .7);

  if (hasST && window.matchMedia('(min-width: 641px)').matches) {
    gsap.to('.hero-arco', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
    gsap.to('.hero-obj-taza', { y: -34, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
  }
}

/* ---------- catálogo ---------- */
function cardCurso(c, destacado) {
  const final = precioFinal(c);
  const enCarrito = Cart.has(c.id);
  return `
  <article class="curso${destacado ? ' destacado' : ''}" data-modalidad="${esc(c.modalidad)}" data-id="${esc(c.id)}" data-animate style="transform:translateY(30px);opacity:0">
    <div class="curso-media">
      <img src="${esc(c.portada)}" width="1254" height="1254" alt="${esc(c.alt)}" loading="lazy" decoding="async">
      ${c.badge ? `<span class="curso-badge">${esc(c.badge)}</span>` : ''}
    </div>
    <div class="curso-body">
      <p class="curso-cat">${esc(c.categoria)}</p>
      <h3>${esc(c.titulo)}</h3>
      <p class="curso-desc">${esc(c.descripcionCorta)}</p>
      <div class="curso-meta">
        <span>${ICONOS.reloj}${esc(c.duracion)}</span>
        <span>${ICONOS.nivel}${esc(c.nivel)}</span>
        <span>${ICONOS.modo}${esc(c.modalidad)}</span>
      </div>
      <div class="curso-pie">
        <p class="curso-precio">${formatearPrecio(final)}${c.descuento > 0 ? `<del>${formatearPrecio(c.precio)}</del>` : ''}</p>
        <div class="curso-acciones">
          <button type="button" class="btn btn-ghost btn-sm" data-ver="${esc(c.id)}">Ver el programa</button>
          <button type="button" class="btn-icono${enCarrito ? ' is-added' : ''}" data-sumar="${esc(c.id)}" aria-label="Sumar ${esc(c.titulo)} a mi inscripción">${enCarrito ? ICONOS.check : ICONOS.suma}</button>
        </div>
      </div>
    </div>
  </article>`;
}

let filtroActual = 'todos';
let primeraCarga = true;

function renderCursos() {
  const grid = document.getElementById('cursosGrid');
  const vacio = document.getElementById('sinResultados');
  if (!grid) return;
  const lista = filtroActual === 'todos' ? CURSOS : CURSOS.filter(c => c.modalidad === filtroActual);
  grid.classList.toggle('filtrado', filtroActual !== 'todos');
  grid.innerHTML = lista.map((c, i) => cardCurso(c, filtroActual === 'todos' && i === 0)).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  if (!primeraCarga) {
    grid.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.07, 0.35)}s`;
      requestAnimationFrame(() => el.classList.add('in'));
    });
  }
  primeraCarga = false;
  if (hasST) ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('cursosGrid');
  if (!grid) return;
  renderCursos();

  document.querySelectorAll('[data-filtro]').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroActual = btn.dataset.filtro;
      document.querySelectorAll('.chip').forEach(ch => ch.classList.toggle('is-on', ch.dataset.filtro === filtroActual));
      renderCursos();
    });
  });

  grid.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver, ver); return; }
    const sumar = e.target.closest('[data-sumar]');
    if (sumar) {
      const c = getCurso(sumar.dataset.sumar);
      if (!c) return;
      if (Cart.has(c.id)) { abrirDrawer(); return; }
      Cart.add(c.id);
      showToast(`Sumaste «${c.titulo.split(':')[0]}» a tu inscripción.`);
    }
  });

  const select = document.getElementById('f-curso');
  if (select) {
    CURSOS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.titulo; opt.textContent = c.titulo;
      select.appendChild(opt);
    });
  }
}

/* ---------- modal de curso ---------- */
let modalPrevio = null;

function abrirModal(id, origen) {
  const c = getCurso(id);
  const modal = document.getElementById('modalCurso');
  const body = document.getElementById('modalBody');
  if (!c || !modal || !body) return;
  modalPrevio = origen || null;
  const final = precioFinal(c);
  const clasesTotales = c.modulos.reduce((s, m) => s + m.clases.length, 0);

  body.innerHTML = `
  <div class="m-hero">
    <img src="${esc(c.portada)}" width="1254" height="1254" alt="${esc(c.alt)}" decoding="async">
    <div class="m-hero-txt">
      <p class="m-cat">${esc(c.categoria)} · ${esc(c.nivel)}</p>
      <h3 id="modalTitulo">${esc(c.titulo)}</h3>
    </div>
  </div>
  <div class="m-cuerpo">
    <div class="m-bloque"><p>${esc(c.promesa)}</p></div>
    <dl class="m-datos">
      <div class="m-dato"><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div>
      <div class="m-dato"><dt>Clases</dt><dd>${clasesTotales} en ${c.modulos.length} módulos</dd></div>
      <div class="m-dato"><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div>
      <div class="m-dato"><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
    </dl>
    <div class="m-bloque">
      <h4>De qué se trata</h4>
      <p>${esc(c.descripcion)}</p>
    </div>
    <div class="m-bloque">
      <h4>Qué te llevás</h4>
      <ul class="m-lista">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
    <div class="m-bloque">
      <h4>Programa</h4>
      <div class="m-modulos">
        ${c.modulos.map((m, i) => `
          <details class="m-modulo"${i === 0 ? ' open' : ''}>
            <summary><span class="m-mod-n">${i + 1}</span>${esc(m.titulo)}</summary>
            <div class="m-clases">
              ${m.clases.map(cl => `
                <div class="m-clase">
                  ${ICONOS[cl.tipo] || ICONOS.video}
                  <span>${esc(cl.titulo)}</span>
                  ${cl.preview ? '<span class="m-preview">Clase abierta</span>' : ''}
                  <span class="m-dur">${esc(cl.duracion)}</span>
                </div>`).join('')}
            </div>
          </details>`).join('')}
      </div>
    </div>
    <div class="m-bloque">
      <h4>Requisitos</h4>
      <ul class="m-lista">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
    <div class="m-bloque">
      <h4>Qué incluye</h4>
      <ul class="m-lista">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
    <div class="m-bloque">
      <h4>Quién te acompaña</h4>
      <p>Terapeuta holística especializada en biodecodificación, bioneuroemoción y terapia transgeneracional. Los cursos fueron desarrollados con acompañamiento profesional para su formación. El acompañamiento holístico no reemplaza el tratamiento médico ni psicológico.</p>
    </div>
    <div class="m-bloque">
      <h4>Preguntas de este curso</h4>
      <div class="m-modulos">
        ${c.faq.map(f => `<details class="m-modulo"><summary>${esc(f.q)}</summary><div class="m-clases"><p style="color:var(--color-text-muted);font-size:.9rem">${esc(f.a)}</p></div></details>`).join('')}
      </div>
    </div>
    <div class="m-cierre">
      <p class="m-precio">${formatearPrecio(final)}${c.descuento > 0 ? `<del>${formatearPrecio(c.precio)}</del>` : ''}</p>
      <button type="button" class="btn btn-primary" data-sumar-modal="${esc(c.id)}">${Cart.has(c.id) ? 'Ya está en tu inscripción' : 'Sumar a mi inscripción'}</button>
    </div>
  </div>`;

  modal.setAttribute('aria-labelledby', 'modalTitulo');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => modal.classList.add('open'));
  document.getElementById('modalClose')?.focus();

  body.querySelector('[data-sumar-modal]')?.addEventListener('click', ev => {
    const btn = ev.currentTarget;
    const curso = getCurso(btn.dataset.sumarModal);
    if (!curso) return;
    if (Cart.has(curso.id)) { cerrarModal(); abrirDrawer(); return; }
    Cart.add(curso.id);
    btn.textContent = 'Ya está en tu inscripción';
    showToast(`Sumaste «${curso.titulo.split(':')[0]}» a tu inscripción.`);
  });
}

function cerrarModal() {
  const modal = document.getElementById('modalCurso');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => {
    modal.hidden = true;
    if (!document.getElementById('drawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
    modalPrevio?.focus();
    modalPrevio = null;
  }, 320);
}

function trapFocus(e, panel) {
  if (e.key !== 'Tab') return;
  const foco = panel.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initModal() {
  const modal = document.getElementById('modalCurso');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modal.querySelector('[data-cerrar]')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    else trapFocus(e, modal.querySelector('.modal-panel'));
  });
}

/* ---------- drawer de inscripción ---------- */
let drawerPrevio = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const badge = document.getElementById('cartBadge');
  if (!body) return;
  const items = Cart.get();
  const count = items.length;

  if (badge) { badge.textContent = String(count); badge.hidden = count === 0; }
  document.querySelectorAll('[data-sumar]').forEach(btn => {
    const puesto = Cart.has(btn.dataset.sumar);
    btn.classList.toggle('is-added', puesto);
    btn.innerHTML = puesto ? ICONOS.check : ICONOS.suma;
  });

  if (!count) {
    body.innerHTML = `<div class="drawer-vacio">${ICONOS.circulo}<p>Todavía no elegiste ningún curso.</p><p style="font-size:.85rem;margin-top:.5rem">Podés sumar más de uno: se coordina todo en el mismo mensaje.</p></div>`;
    if (foot) foot.hidden = true;
    return;
  }

  body.innerHTML = items.map(i => {
    const c = getCurso(i.id);
    if (!c) return '';
    return `<div class="d-item">
      <img src="${esc(c.portada)}" width="64" height="64" alt="" aria-hidden="true" loading="lazy">
      <div>
        <h4>${esc(c.titulo)}</h4>
        <p>${esc(c.modalidad)} · ${esc(c.duracion)}</p>
        <strong>${formatearPrecio(precioFinal(c))}</strong>
      </div>
      <button type="button" class="d-quitar" data-quitar="${esc(c.id)}" aria-label="Quitar ${esc(c.titulo)}">${ICONOS.quitar}</button>
    </div>`;
  }).join('');

  const total = Cart.total();
  document.getElementById('drawerTotal').textContent = formatearPrecio(total);
  const cta = document.getElementById('drawerCta');
  if (cta) {
    const detalle = items.map(i => { const c = getCurso(i.id); return c ? `• ${c.titulo} (${c.modalidad}) — ${formatearPrecio(precioFinal(c))}` : ''; }).filter(Boolean).join('\n');
    const msg = `Hola, quiero inscribirme a estos cursos:\n\n${detalle}\n\nTotal: ${formatearPrecio(total)}\n\n¿Cómo seguimos?`;
    cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }
  if (foot) foot.hidden = false;
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  drawerPrevio = document.activeElement;
  drawer.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => drawer.classList.add('open'));
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  setTimeout(() => {
    drawer.hidden = true;
    if (document.getElementById('modalCurso')?.hidden !== false) document.body.classList.remove('no-scroll');
    if (drawerPrevio && document.contains(drawerPrevio)) drawerPrevio.focus();
    drawerPrevio = null;
  }, 340);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  drawer.querySelector('[data-cerrar-drawer]')?.addEventListener('click', cerrarDrawer);
  drawer.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) Cart.remove(quitar.dataset.quitar);
  });
  document.addEventListener('keydown', e => {
    if (drawer.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    else trapFocus(e, drawer.querySelector('.drawer-panel'));
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

/* ---------- la rueda del proceso ---------- */
function initRueda() {
  const sec = document.getElementById('proceso');
  if (!sec) return;
  const wheel = document.getElementById('wheel');
  const spin = document.getElementById('wheelSpin');
  const grid = sec.querySelector('.rueda-grid');
  const pasos = [...sec.querySelectorAll('.paso')];
  const estaciones = [...sec.querySelectorAll('.estacion')];
  const coreN = document.getElementById('coreN');
  const coreT = document.getElementById('coreT');
  const NOMBRES = ['Escuchar', 'Mirar el árbol', 'Nombrar', 'Elegir'];

  const marcar = idx => {
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
    estaciones.forEach((e, i) => e.classList.toggle('is-on', i === idx));
    if (coreN) coreN.textContent = String(idx + 1).padStart(2, '0');
    if (coreT) coreT.textContent = NOMBRES[idx];
  };

  if (!hasGSAP || !hasST || reduceMotion) {
    pasos.forEach(p => p.classList.add('is-on'));
    estaciones.forEach(e => e.classList.add('is-on'));
    return;
  }

  let activo = -1;
  const aplicar = p => {
    const pp = Math.max(0, Math.min(1, (p - .06) / .88));
    spin?.style.setProperty('--rot', `${-pp * 270}deg`);
    const idx = Math.max(0, Math.min(3, Math.round(pp * 3)));
    if (idx !== activo) { activo = idx; marcar(idx); }
  };

  const mm = gsap.matchMedia();
  let st = null;

  mm.add('(min-width: 1081px)', () => {
    st = ScrollTrigger.create({
      trigger: '.rueda-sec .pasos', start: 'top 62%', end: 'bottom 88%',
      scrub: true, invalidateOnRefresh: true, onUpdate: self => aplicar(self.progress)
    });
    return () => { st?.kill(); st = null; };
  });

  mm.add('(max-width: 1080px)', () => {
    sec.classList.add('is-sticky-mobile');
    st = ScrollTrigger.create({
      trigger: grid, start: 'top top', endTrigger: sec, end: 'bottom bottom',
      scrub: true, invalidateOnRefresh: true, onUpdate: self => aplicar(self.progress)
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st?.kill(); st = null; sec.classList.remove('is-sticky-mobile'); };
  });

  marcar(0);

  if (!wheel) return;
  let arrastrando = false, angIni = 0, scrollIni = 0, movido = false;
  const anguloDe = e => {
    const r = wheel.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  wheel.addEventListener('pointerdown', e => {
    if (!st || e.button !== 0) return;
    arrastrando = true; movido = false;
    angIni = anguloDe(e);
    scrollIni = window.scrollY;
    wheel.classList.add('dragging');
  });
  wheel.addEventListener('pointermove', e => {
    if (!arrastrando || !st) return;
    let d = anguloDe(e) - angIni;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    if (!movido && Math.abs(d) > 4) { movido = true; wheel.setPointerCapture(e.pointerId); }
    if (!movido) return;
    e.preventDefault();
    const rango = st.end - st.start;
    if (rango <= 0) return;
    window.scrollTo(0, Math.max(0, scrollIni - (d / 270) * rango * .88));
  });
  const soltar = () => { if (!arrastrando) return; arrastrando = false; movido = false; wheel.classList.remove('dragging'); };
  wheel.addEventListener('pointerup', soltar);
  wheel.addEventListener('pointercancel', soltar);
  wheel.addEventListener('pointerleave', soltar);
}

function initManifiesto() {
  const el = document.getElementById('manifiesto');
  if (!el) return;
  const Split = window.SplitText;
  if (!hasGSAP || !hasST || reduceMotion || !Split) { el.style.opacity = 1; return; }
  const split = new Split(el, { type: 'words', wordsClass: 'palabra' });
  gsap.to(split.words, {
    opacity: 1, ease: 'none', stagger: .06,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 60%', scrub: .5, invalidateOnRefresh: true }
  });
}

function initParallaxSobre() {
  if (!hasGSAP || !hasST || reduceMotion) return;
  if (!window.matchMedia('(min-width: 1081px)').matches) return;
  const media = document.querySelector('.sobre-media');
  if (!media) return;
  gsap.fromTo(media, { y: 38 }, {
    y: -38, ease: 'none',
    scrollTrigger: { trigger: '.sobre', start: 'top bottom', end: 'bottom top', scrub: .7, invalidateOnRefresh: true }
  });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const campos = [
    { input: form.querySelector('#f-nombre'), err: form.querySelector('#err-nombre'), test: v => v.trim().length >= 2, msg: 'Escribí tu nombre.' },
    { input: form.querySelector('#f-tel'), err: form.querySelector('#err-tel'), test: v => v.replace(/\D/g, '').length >= 8, msg: 'Dejame un WhatsApp para poder responderte.' },
    { input: form.querySelector('#f-msg'), err: form.querySelector('#err-msg'), test: v => v.trim().length >= 8, msg: 'Contame un poco qué te trae.' }
  ];
  const tel = form.querySelector('#f-tel');
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 10);
    tel.value = d.length > 6 ? `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `${d.slice(0, 2)} ${d.slice(2)}` : d;
  });
  campos.forEach(c => {
    c.input?.addEventListener('input', () => {
      const campo = c.input.closest('.field');
      if (campo.classList.contains('invalid') && c.test(c.input.value)) {
        campo.classList.remove('invalid');
        c.input.removeAttribute('aria-invalid');
        c.err.textContent = '';
      }
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true, primero = null;
    campos.forEach(c => {
      const valido = c.test(c.input.value);
      c.input.closest('.field').classList.toggle('invalid', !valido);
      c.err.textContent = valido ? '' : c.msg;
      if (valido) c.input.removeAttribute('aria-invalid'); else c.input.setAttribute('aria-invalid', 'true');
      if (!valido && !primero) primero = c.input;
      if (!valido) ok = false;
    });
    if (!ok) { primero?.focus(); return; }
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });
}

function initMandala() {
  const g = document.querySelector('.mandala-petals');
  if (!g) return;
  let d = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180;
    const x1 = 200 + Math.cos(a) * 68, y1 = 200 + Math.sin(a) * 68;
    const x2 = 200 + Math.cos(a) * 164, y2 = 200 + Math.sin(a) * 164;
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  g.innerHTML = `<path d="${d}" opacity=".55"/>`;
}

document.getElementById('anio')?.replaceChildren(String(new Date().getFullYear()));

initMandala();
initNav();
initCatalogo();
initModal();
initDrawer();
initReveals();
initWspFloat();
initHero();
initRueda();
initManifiesto();
initParallaxSobre();
initForm();
