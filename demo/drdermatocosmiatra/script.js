const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492804824641';
const IG = 'https://www.instagram.com/cosmetologa_trelew/';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waLink = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const svg = (inner, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
const ICON = {
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'ico ico-arrow'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  nivel: svg('<path d="M6 20v-4M12 20v-9M18 20V5"/>'),
  presencial: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  online: svg('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  calendario: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
  pin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  teoria: svg('<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>'),
  demo: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  practica: svg('<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>'),
  material: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>'
};
const TIPOS = { teoria: 'Teoría', demo: 'Demostración', practica: 'Práctica', material: 'Material' };

const CATEGORIAS = { faciales: 'Tratamientos faciales', tecnicas: 'Técnicas y protocolos', cosmetica: 'Cosmética aplicada' };
const DOCENTE = { nombre: 'Daiana Rojas', rol: 'Dermatocosmiatra · Técnica en microagujas · Actualizaciones en la UBA' };

const mod = (titulo, clases) => ({ titulo, clases: clases.map(([t, d, tipo]) => ({ titulo: t, duracion: d, tipo })) });

const CURSOS = [
  {
    id: 'limpieza-facial-profunda', titulo: 'Limpieza facial profunda profesional', categoria: 'faciales', nivel: 'Inicial', modalidad: 'Presencial',
    duracion: '1 jornada · 8 h', precio: 85000, badge: 'Para empezar', destacado: 1, portada: 'limpieza-facial',
    alt: 'Bandeja con bowls, pincel de cerdas suaves, toallas y frascos de limpieza facial',
    descripcionCorta: 'El protocolo base de gabinete: diagnóstico, higiene, extracción y cierre, hecho de punta a punta en camilla.',
    resultados: ['Leer el biotipo y completar la ficha antes de empezar', 'Hacer una extracción prolija y sin marcas', 'Elegir máscara y cierre según cada piel'],
    requisitos: 'Abierta a estudiantes de cosmetología y a quienes empiezan.',
    incluye: ['Práctica con modelo supervisada', 'Protocolo escrito paso a paso', 'Certificado de participación'],
    tags: 'higiene extraccion comedones mascara vapor',
    ediciones: [
      { id: 'lf1', fecha: '2026-11-14', horario: '9 a 18 h', lugar: 'Gabinete en Trelew' },
      { id: 'lf2', fecha: '2027-02-13', horario: '9 a 18 h', lugar: 'Gabinete en Trelew' }
    ],
    modulos: [
      mod('Piel y diagnóstico', [['Biotipos y fototipos', '40 min', 'teoria'], ['Ficha de cosmiatría', '30 min', 'material'], ['Contraindicaciones', '30 min', 'teoria']]),
      mod('Higiene y preparación', [['Doble limpieza y tonificación', '35 min', 'demo'], ['Exfoliación según la piel', '35 min', 'demo'], ['Vapor y emoliencia', '30 min', 'demo']]),
      mod('Extracción', [['Técnica de extracción manual', '45 min', 'demo'], ['Bioseguridad y descarte', '30 min', 'teoria'], ['Práctica con modelo', '2 h', 'practica']]),
      mod('Cierre del tratamiento', [['Máscaras por objetivo', '30 min', 'demo'], ['Fotoprotección y cuidados', '20 min', 'teoria'], ['Indicaciones para casa', '20 min', 'material']])
    ]
  },
  {
    id: 'microneedling', titulo: 'Microneedling: inducción de colágeno con microagujas', categoria: 'tecnicas', nivel: 'Avanzado', modalidad: 'Híbrida',
    duracion: '2 encuentros · 14 h', precio: 180000, badge: 'Especialidad', destacado: 2, portada: 'microneedling',
    alt: 'Cabeza de práctica con vincha, pinceles de cerdas y bowls con máscaras sobre una mesada de mármol',
    descripcionCorta: 'Dermapen y roller con criterio clínico: profundidades, activos y protocolos para textura, cicatrices de acné y luminosidad.',
    resultados: ['Elegir aguja y profundidad para cada zona del rostro', 'Combinar microagujas con activos de forma segura', 'Armar planes de sesiones y controles'],
    requisitos: 'Formación en cosmetología o cosmiatría. Se recomienda haber hecho Limpieza facial profunda.',
    incluye: ['Teoría online en vivo y práctica presencial', 'Práctica con modelo supervisada', 'Protocolos escritos por indicación', 'Certificado de participación'],
    tags: 'dermapen roller colageno cicatrices acne textura microagujas',
    ediciones: [
      { id: 'mn1', fecha: '2026-11-21', horario: 'Teoría online el jueves 19 a las 19 h · práctica de 9 a 18 h', lugar: 'Online + gabinete en Trelew' },
      { id: 'mn2', fecha: '2027-03-06', horario: 'Teoría online el jueves 4 a las 19 h · práctica de 9 a 18 h', lugar: 'Online + gabinete en Trelew' }
    ],
    modulos: [
      mod('Fundamentos', [['Fisiología del colágeno', '45 min', 'teoria'], ['Indicaciones y contraindicaciones', '40 min', 'teoria'], ['Consentimiento informado', '20 min', 'material']]),
      mod('Equipamiento', [['Dermapen y roller', '40 min', 'demo'], ['Profundidad por zona', '40 min', 'teoria'], ['Bioseguridad y descartables', '30 min', 'teoria']]),
      mod('Protocolos', [['Textura y poros', '45 min', 'demo'], ['Cicatrices de acné', '45 min', 'demo'], ['Luminosidad y manchas', '40 min', 'demo']]),
      mod('Práctica', [['Demostración completa', '1 h', 'demo'], ['Práctica con modelo', '3 h', 'practica'], ['Plan de sesiones y controles', '30 min', 'material']])
    ]
  },
  {
    id: 'cosmetica-activos', titulo: 'Cosmética aplicada: activos y armado de rutinas', categoria: 'cosmetica', nivel: 'Intermedio', modalidad: 'Online en vivo',
    duracion: '4 clases · 8 h', precio: 65000, badge: 'Online en vivo', destacado: 3, portada: 'cosmetica-activos',
    alt: 'Frascos gotero de sérum ámbar, transparente y celeste junto a una crema y placas de Petri',
    descripcionCorta: 'Qué hace cada activo, cómo se combinan y cómo armar rutinas de gabinete y de casa que la piel tolere.',
    resultados: ['Leer una fórmula y reconocer sus activos', 'Combinar ácidos, retinoides y vitamina C sin irritar', 'Armar rutinas por objetivo y por estación'],
    requisitos: 'Conocimientos básicos de piel. Ideal si ya trabajás en gabinete.',
    incluye: ['4 clases en vivo por videollamada', 'Material descargable de cada clase', 'Certificado de participación'],
    tags: 'serum acidos retinol vitamina c rutina inci formulas',
    ediciones: [
      { id: 'ca1', fecha: '2026-11-03', horario: 'Martes 3, 10, 17 y 24 de noviembre · 19 a 21 h', lugar: 'Online en vivo' },
      { id: 'ca2', fecha: '2027-03-02', horario: 'Martes 2, 9, 16 y 23 de marzo · 19 a 21 h', lugar: 'Online en vivo' }
    ],
    modulos: [
      mod('Lectura de fórmulas', [['La etiqueta INCI', '30 min', 'teoria'], ['Concentraciones', '30 min', 'teoria'], ['Vehículos y texturas', '30 min', 'teoria']]),
      mod('Activos clave', [['Ácidos AHA, BHA y PHA', '40 min', 'teoria'], ['Retinoides', '40 min', 'teoria'], ['Vitamina C y antioxidantes', '40 min', 'teoria']]),
      mod('Combinaciones', [['Qué se combina y qué no', '30 min', 'teoria'], ['Tolerancia y barrera', '30 min', 'teoria'], ['Fotoprotección', '30 min', 'material']]),
      mod('Rutinas', [['Por objetivo', '40 min', 'material'], ['Por estación', '30 min', 'material'], ['Gabinete y casa', '30 min', 'teoria']])
    ]
  },
  {
    id: 'dermaplaning', titulo: 'Dermaplaning paso a paso', categoria: 'tecnicas', nivel: 'Intermedio', modalidad: 'Presencial',
    duracion: '1 jornada · 6 h', precio: 95000, badge: '', destacado: 0, portada: 'dermaplaning',
    alt: 'Lámpara lupa con luz sobre una camilla con toalla blanca en un gabinete luminoso',
    descripcionCorta: 'Exfoliación mecánica con bisturí: ángulo, tensión de la piel y combinaciones para una piel lisa y sin vello.',
    resultados: ['Sostener el ángulo y la tensión correctos', 'Detectar cuándo no conviene hacerlo', 'Combinarlo con un peeling suave o una máscara'],
    requisitos: 'Formación en cosmetología o cosmiatría.',
    incluye: ['Práctica con modelo supervisada', 'Protocolo escrito', 'Certificado de participación'],
    tags: 'bisturi exfoliacion vello facial',
    ediciones: [{ id: 'dp1', fecha: '2026-11-28', horario: '10 a 17 h', lugar: 'Gabinete en Trelew' }],
    modulos: [
      mod('Fundamentos', [['Indicaciones', '30 min', 'teoria'], ['Contraindicaciones', '30 min', 'teoria'], ['Bioseguridad', '20 min', 'teoria']]),
      mod('Técnica', [['Ángulo y tensión', '40 min', 'demo'], ['Zonas del rostro', '30 min', 'demo'], ['Demostración completa', '45 min', 'demo']]),
      mod('Práctica y combinaciones', [['Práctica con modelo', '2 h', 'practica'], ['Combinaciones', '30 min', 'teoria'], ['Cuidados posteriores', '20 min', 'material']])
    ]
  },
  {
    id: 'peeling-quimico', titulo: 'Peeling químico: ácidos, indicaciones y protocolos', categoria: 'tecnicas', nivel: 'Avanzado', modalidad: 'Híbrida',
    duracion: '2 encuentros · 12 h', precio: 150000, badge: '', destacado: 0, portada: 'peeling-quimico',
    alt: 'Bowls con máscaras de arcilla y crema, espátulas de madera y pinceles sobre un carro de gabinete',
    descripcionCorta: 'Glicólico, mandélico, salicílico y combinados: cómo elegir el ácido, preparar la piel y acompañar la descamación.',
    resultados: ['Elegir el ácido según biotipo y objetivo', 'Preparar la piel antes del peeling', 'Manejar tiempos, neutralización y post peeling'],
    requisitos: 'Formación en cosmiatría. Se recomienda Cosmética aplicada.',
    incluye: ['Teoría online en vivo y práctica presencial', 'Práctica con modelo supervisada', 'Tabla de ácidos y tiempos', 'Certificado de participación'],
    tags: 'acido glicolico mandelico salicilico manchas descamacion',
    ediciones: [{ id: 'pq1', fecha: '2026-12-05', horario: 'Teoría online el jueves 3 a las 19 h · práctica de 9 a 17 h', lugar: 'Online + gabinete en Trelew' }],
    modulos: [
      mod('Química de la piel', [['pH y barrera', '40 min', 'teoria'], ['Familias de ácidos', '45 min', 'teoria'], ['Fototipos y riesgos', '30 min', 'teoria']]),
      mod('Preparación', [['Ficha y consentimiento', '20 min', 'material'], ['Pre peeling en casa', '30 min', 'teoria'], ['Prueba de tolerancia', '30 min', 'demo']]),
      mod('Aplicación', [['Capas y tiempos', '45 min', 'demo'], ['Neutralización', '30 min', 'demo'], ['Práctica con modelo', '2 h 30 min', 'practica']]),
      mod('Post peeling', [['Descamación esperada', '20 min', 'teoria'], ['Cuidados y fotoprotección', '20 min', 'material'], ['Seguimiento', '20 min', 'teoria']])
    ]
  },
  {
    id: 'diagnostico-facial', titulo: 'Diagnóstico facial y ficha de cosmiatría', categoria: 'cosmetica', nivel: 'Inicial', modalidad: 'Online en vivo',
    duracion: '3 clases · 6 h', precio: 45000, badge: '', destacado: 0, portada: 'diagnostico-ficha',
    alt: 'Mesa de mármol con tablet, cuaderno, lapicera e instrumental de acero en una bandeja',
    descripcionCorta: 'Cómo mirar una piel antes de tratarla: biotipo, fototipo, lesiones frecuentes y una ficha clara para cada paciente.',
    resultados: ['Reconocer biotipos, fototipos y lesiones frecuentes', 'Completar una ficha de cosmiatría útil', 'Saber cuándo derivar a un médico'],
    requisitos: 'Abierta a estudiantes y a quienes empiezan.',
    incluye: ['3 clases en vivo por videollamada', 'Modelo de ficha para descargar', 'Certificado de participación'],
    tags: 'ficha anamnesis biotipo fototipo acne manchas rosacea',
    ediciones: [
      { id: 'df1', fecha: '2026-11-09', horario: 'Lunes 9, 16 y 23 de noviembre · 19 a 21 h', lugar: 'Online en vivo' },
      { id: 'df2', fecha: '2027-02-01', horario: 'Lunes 1, 8 y 15 de febrero · 19 a 21 h', lugar: 'Online en vivo' }
    ],
    modulos: [
      mod('La piel', [['Capas y funciones', '40 min', 'teoria'], ['Biotipos', '40 min', 'teoria'], ['Fototipos', '30 min', 'teoria']]),
      mod('Lesiones frecuentes', [['Acné y comedones', '40 min', 'teoria'], ['Manchas', '40 min', 'teoria'], ['Rosácea y sensibilidad', '30 min', 'teoria']]),
      mod('La ficha', [['Anamnesis', '30 min', 'material'], ['Fotos de control', '30 min', 'teoria'], ['Cuándo derivar', '30 min', 'teoria']])
    ]
  },
  {
    id: 'aparatologia-facial', titulo: 'Aparatología facial: vapor, alta frecuencia y ultrasonido', categoria: 'faciales', nivel: 'Intermedio', modalidad: 'Presencial',
    duracion: '1 jornada · 7 h', precio: 90000, badge: '', destacado: 0, portada: 'aparatologia',
    alt: 'Vaporizador facial de pie junto a una camilla con toallas y un estante con toallas dobladas',
    descripcionCorta: 'Para qué sirve cada equipo, cómo programarlo y cómo sumarlo a tus tratamientos sin riesgos.',
    resultados: ['Usar vapor, alta frecuencia y ultrasonido con criterio', 'Elegir el equipo según el objetivo', 'Mantener y limpiar cada equipo'],
    requisitos: 'Haber hecho Limpieza facial profunda o tener experiencia equivalente.',
    incluye: ['Práctica con los equipos del gabinete', 'Protocolo escrito', 'Certificado de participación'],
    tags: 'vapor ozono alta frecuencia ultrasonido equipos hidratacion',
    ediciones: [{ id: 'ap1', fecha: '2026-12-12', horario: '9 a 17 h', lugar: 'Gabinete en Trelew' }],
    modulos: [
      mod('Equipos y seguridad', [['Vapor de ozono', '30 min', 'demo'], ['Alta frecuencia', '30 min', 'demo'], ['Ultrasonido', '30 min', 'demo']]),
      mod('Programación', [['Intensidad y tiempos', '40 min', 'teoria'], ['Contraindicaciones', '30 min', 'teoria'], ['Limpieza de los equipos', '20 min', 'material']]),
      mod('Protocolos', [['Hidratación profunda', '40 min', 'demo'], ['Pieles grasas', '40 min', 'demo'], ['Práctica con modelo', '2 h', 'practica']])
    ]
  },
  {
    id: 'bb-glow-bb-lips', titulo: 'BB Glow y BB Lips', categoria: 'tecnicas', nivel: 'Intermedio', modalidad: 'Presencial',
    duracion: '1 jornada · 7 h', precio: 120000, badge: '', destacado: 0, portada: 'bb-glow',
    alt: 'Gabinete con camilla preparada, lámpara lupa y carro de productos junto a la ventana',
    descripcionCorta: 'Pigmentación superficial con microagujas para un efecto de piel uniforme y labios con color.',
    resultados: ['Elegir el pigmento según el tono de piel', 'Trabajar la profundidad correcta', 'Dar indicaciones de cuidado y de retoque'],
    requisitos: 'Formación en cosmetología o cosmiatría. Se recomienda Microneedling.',
    incluye: ['Práctica con modelo supervisada', 'Protocolo escrito', 'Certificado de participación'],
    tags: 'bb glow bb lips labios pigmento microagujas',
    ediciones: [
      { id: 'bb1', fecha: '2026-11-07', horario: '9 a 17 h', lugar: 'Gabinete en Trelew' },
      { id: 'bb2', fecha: '2027-02-20', horario: '9 a 17 h', lugar: 'Gabinete en Trelew' }
    ],
    modulos: [
      mod('Fundamentos', [['Qué es y qué no es', '30 min', 'teoria'], ['Pigmentos y tonos', '40 min', 'teoria'], ['Contraindicaciones', '30 min', 'teoria']]),
      mod('BB Glow', [['Preparación de la piel', '30 min', 'demo'], ['Técnica y profundidad', '45 min', 'demo'], ['Práctica con modelo', '1 h 30 min', 'practica']]),
      mod('BB Lips', [['Diseño del color', '30 min', 'demo'], ['Técnica en labios', '40 min', 'demo'], ['Cuidados y retoque', '20 min', 'material']])
    ]
  }
];

const getCurso = id => CURSOS.find(c => c.id === id);
const HOY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const fechaDe = s => new Date(`${s}T12:00:00`);
const vigentes = c => (c?.ediciones || []).filter(e => fechaDe(e.fecha) >= HOY);
const proxima = c => vigentes(c)[0] || null;
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = s => { const d = fechaDe(s); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const fechaCorta = s => { const d = fechaDe(s); return `${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
const iconoModalidad = m => (m === 'Online en vivo' ? ICON.online : ICON.presencial);

const Cart = {
  KEY: 'drdermato_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { return; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso, ed) {
    const items = this.get();
    const existing = items.find(i => i.id === curso.id);
    if (existing) { if (ed) existing.ed = ed; }
    else items.push({ id: curso.id, ed: ed || proxima(curso)?.id || '', qty: 1 });
    this.save(items);
  },
  setEd(id, ed) { const items = this.get(); const it = items.find(i => i.id === id); if (!it) return; it.ed = ed; this.save(items); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().filter(i => getCurso(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + c.precio : s; }, 0); }
};

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
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
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

const metaHTML = c => `<ul class="meta"><li>${ICON.nivel}${esc(c.nivel)}</li><li>${iconoModalidad(c.modalidad)}${esc(c.modalidad)}</li><li>${ICON.reloj}${esc(c.duracion)}</li></ul>`;
const inscribirLabel = id => (Cart.has(id) ? `${ICON.check}En tu inscripción` : 'Inscribirme');

function destHTML(c, i) {
  return `<article class="dest-card${i === 0 ? ' dest-card--prima' : ''}" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button class="dest-media" type="button" data-ver="${c.id}" aria-label="Ver el programa de ${esc(c.titulo)}"><img src="images/${c.portada}.webp" srcset="images/${c.portada}-600.webp 600w, images/${c.portada}.webp 1000w" sizes="(max-width: 900px) 92vw, 36vw" width="1000" height="1000" alt="${esc(c.alt)}">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</button>
    <div class="dest-body">
      <p class="dest-cat">${esc(CATEGORIAS[c.categoria])}</p>
      <h3>${esc(c.titulo)}</h3>
      <p class="dest-desc">${esc(c.descripcionCorta)}</p>
      ${metaHTML(c)}
      <ol class="dest-modulos">${c.modulos.map(m => `<li>${esc(m.titulo)}</li>`).join('')}</ol>
      <div class="dest-foot"><span class="precio">${formatearPrecio(c.precio)}</span><button class="btn btn-primary btn-sm" type="button" data-ver="${c.id}">Ver programa ${ICON.arrow}</button></div>
    </div>
  </article>`;
}

function renderDestacados() {
  const cont = document.getElementById('dest-grid');
  if (!cont) return;
  const orden = document.body.classList.contains('m2') ? [2, 1, 3] : [1, 2, 3];
  const lista = CURSOS.filter(c => c.destacado).sort((a, b) => orden.indexOf(a.destacado) - orden.indexOf(b.destacado));
  cont.innerHTML = lista.map(destHTML).join('');
}

function curHTML(c, animar) {
  const prox = proxima(c);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : '';
  return `<article class="cur-card"${anim} data-id="${c.id}">
    <button class="cur-media" type="button" data-ver="${c.id}" aria-label="Ver el programa de ${esc(c.titulo)}"><img src="images/${c.portada}-600.webp" width="600" height="600" alt="${esc(c.alt)}">${c.badge ? `<span class="badge">${esc(c.badge)}</span>` : ''}</button>
    <div class="cur-body">
      <p class="cur-cat">${esc(CATEGORIAS[c.categoria])}${c.badge ? `<span class="cur-badge"> · ${esc(c.badge)}</span>` : ''}</p>
      <h3 class="cur-title">${esc(c.titulo)}</h3>
      ${metaHTML(c)}
      <p class="cur-fecha">${ICON.calendario}${prox ? `Próxima fecha: ${esc(fechaCorta(prox.fecha))}` : 'Fechas a confirmar'}</p>
    </div>
    <div class="cur-foot"><span class="cur-precio">${formatearPrecio(c.precio)}</span><div class="cur-actions"><button class="btn-link" type="button" data-ver="${c.id}">Ver programa</button><button class="btn btn-primary btn-sm${Cart.has(c.id) ? ' is-en' : ''}" type="button" data-inscribir="${c.id}">${inscribirLabel(c.id)}</button></div></div>
  </article>`;
}

const PAGINA = window.matchMedia('(max-width: 640px)').matches ? 4 : 12;
const Catalogo = { q: '', cat: '', nivel: '', modalidad: '', visibles: PAGINA, PAGE: PAGINA };

function filtrarCursos() {
  const q = norm(Catalogo.q).trim();
  const palabras = q ? q.split(/\s+/) : [];
  return CURSOS.filter(c => {
    if (Catalogo.cat && c.categoria !== Catalogo.cat) return false;
    if (Catalogo.nivel && c.nivel !== Catalogo.nivel) return false;
    if (Catalogo.modalidad && c.modalidad !== Catalogo.modalidad) return false;
    if (!palabras.length) return true;
    const texto = norm([c.titulo, CATEGORIAS[c.categoria], c.nivel, c.modalidad, DOCENTE.nombre, c.descripcionCorta, c.tags].join(' '));
    return palabras.every(p => texto.includes(p));
  });
}

function renderCatalogo(desde = 0) {
  const list = document.getElementById('cat-list');
  if (!list) return;
  const res = filtrarCursos();
  const vis = res.slice(0, Catalogo.visibles);
  list.innerHTML = vis.map((c, k) => curHTML(c, k >= desde)).join('');
  const count = document.getElementById('cat-count');
  if (count) count.textContent = res.length === 1 ? '1 capacitación' : `${res.length} capacitaciones`;
  const hayFiltro = Catalogo.q || Catalogo.cat || Catalogo.nivel || Catalogo.modalidad;
  const clear = document.getElementById('cat-clear');
  if (clear) clear.hidden = !hayFiltro;
  const vacio = document.getElementById('cat-empty');
  if (vacio) vacio.hidden = res.length > 0;
  const mas = document.getElementById('cat-more');
  if (mas) mas.hidden = res.length <= Catalogo.visibles;
  revelarNuevos(list);
}

function setCategoria(cat) {
  Catalogo.cat = cat;
  document.querySelectorAll('.cat-chips .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
}

function limpiarFiltros() {
  Catalogo.q = ''; Catalogo.nivel = ''; Catalogo.modalidad = '';
  setCategoria('');
  const q = document.getElementById('cat-q'); if (q) q.value = '';
  const n = document.getElementById('f-nivel'); if (n) n.value = '';
  const m = document.getElementById('f-modalidad'); if (m) m.value = '';
  Catalogo.visibles = Catalogo.PAGE;
  renderCatalogo();
}

function initCatalogo() {
  const list = document.getElementById('cat-list');
  if (!list) return;
  const q = document.getElementById('cat-q');
  const form = document.getElementById('cat-search');
  const nivel = document.getElementById('f-nivel');
  const modalidad = document.getElementById('f-modalidad');
  const reset = () => { Catalogo.visibles = Catalogo.PAGE; renderCatalogo(); };
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { Catalogo.q = q.value; reset(); }, 160); });
  form?.addEventListener('submit', e => { e.preventDefault(); Catalogo.q = q?.value || ''; reset(); });
  nivel?.addEventListener('change', () => { Catalogo.nivel = nivel.value; reset(); });
  modalidad?.addEventListener('change', () => { Catalogo.modalidad = modalidad.value; reset(); });
  document.querySelectorAll('.cat-chips .chip').forEach(b => b.addEventListener('click', () => { setCategoria(b.dataset.cat); reset(); }));
  document.getElementById('cat-clear')?.addEventListener('click', limpiarFiltros);
  document.querySelector('[data-clear]')?.addEventListener('click', limpiarFiltros);
  document.getElementById('cat-more')?.addEventListener('click', () => {
    const antes = Math.min(Catalogo.visibles, filtrarCursos().length);
    Catalogo.visibles += Catalogo.PAGE;
    renderCatalogo(antes);
  });
  const fbtn = document.getElementById('cat-filtros-btn');
  const fsel = document.getElementById('cat-selects');
  fbtn?.addEventListener('click', () => {
    const abierto = fsel.classList.toggle('open');
    fbtn.setAttribute('aria-expanded', String(abierto));
  });
  renderCatalogo();
}

function refrescarBotonesInscribir() {
  document.querySelectorAll('[data-inscribir]').forEach(b => {
    const en = Cart.has(b.dataset.inscribir);
    b.classList.toggle('is-en', en);
    b.innerHTML = inscribirLabel(b.dataset.inscribir);
  });
}

function initTrayecto() {
  const tabs = [...document.querySelectorAll('.trayecto [role="tab"]')];
  if (!tabs.length) return;
  document.querySelectorAll('.tray-list[data-nivel]').forEach(ul => {
    const lista = CURSOS.filter(c => c.nivel === ul.dataset.nivel);
    ul.innerHTML = lista.map(c => `<li><button class="tray-item" type="button" data-ver="${c.id}"><span class="tray-tit">${esc(c.titulo)}</span><span class="tray-meta">${esc(c.modalidad)} · ${esc(c.duracion)}</span>${ICON.arrow}</button></li>`).join('');
  });
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        activar(tabs[n], true);
      }
    });
  });
}

function edicionesAgenda() {
  return CURSOS.flatMap(c => vigentes(c).map(e => ({ ...e, curso: c }))).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function initAgenda() {
  const list = document.getElementById('agenda-list');
  const chips = document.getElementById('agenda-meses');
  if (!list || !chips) return;
  const eds = edicionesAgenda();
  if (!eds.length) {
    chips.hidden = true;
    list.innerHTML = '<li class="ag-vacio">Estamos armando las próximas fechas: consultanos por WhatsApp y te avisamos cuando se abran.</li>';
    return;
  }
  const meses = [...new Set(eds.map(e => e.fecha.slice(0, 7)))];
  const anioBase = meses[0].slice(0, 4);
  const etiqueta = m => { const [a, mm] = m.split('-'); const nombre = MESES[Number(mm) - 1]; return `${nombre[0].toUpperCase()}${nombre.slice(1)}${a !== anioBase ? ` ${a}` : ''}`; };
  chips.innerHTML = meses.map((m, i) => `<button class="chip" type="button" data-mes="${m}" aria-pressed="${i === 0}">${etiqueta(m)}</button>`).join('');
  const pintar = (mes, animar) => {
    const items = eds.filter(e => e.fecha.startsWith(mes));
    list.innerHTML = items.map(e => {
      const d = fechaDe(e.fecha);
      const c = e.curso;
      return `<li class="ag-item"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(28px)"' : ''}>
        <div class="ag-date"><span class="ag-dia">${d.getDate()}</span><span class="ag-mes">${MESES[d.getMonth()].slice(0, 3)}</span><span class="ag-sem">${DIAS[d.getDay()]}</span></div>
        <div class="ag-info"><p class="ag-cat">${esc(CATEGORIAS[c.categoria])} · ${esc(c.modalidad)}</p><h3 class="ag-tit">${esc(c.titulo)}</h3><p class="ag-det">${ICON.pin}<span>${esc(e.lugar)} · ${esc(e.horario)}</span></p></div>
        <div class="ag-actions"><button class="btn btn-primary btn-sm" type="button" data-reservar="${c.id}" data-ed="${e.id}">Reservar lugar</button></div>
      </li>`;
    }).join('');
  };
  chips.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
    chips.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(b.dataset.mes, true);
    revelarNuevos(list);
  }));
  pintar(meses[0], true);
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const nombre = document.getElementById('c-nombre');
  const curso = document.getElementById('c-curso');
  const fecha = document.getElementById('c-fecha');
  const preview = document.getElementById('c-preview');
  const error = document.getElementById('c-nombre-error');
  curso.innerHTML = CURSOS.map(c => `<option value="${c.id}">${esc(c.titulo)}</option>`).join('');
  const llenarFechas = () => {
    const c = getCurso(curso.value);
    const eds = vigentes(c);
    fecha.innerHTML = eds.map(e => `<option value="${e.id}">${esc(fechaLarga(e.fecha))}</option>`).join('') + '<option value="">La próxima que se abra</option>';
  };
  const mensaje = () => {
    const c = getCurso(curso.value);
    const e = vigentes(c).find(x => x.id === fecha.value);
    const quien = nombre.value.trim() ? `Hola, soy ${nombre.value.trim()}.` : 'Hola.';
    const cuando = e ? ` del ${fechaLarga(e.fecha)}` : ' (la próxima fecha que se abra)';
    return `${quien} Quiero consultar por la capacitación «${c?.titulo || ''}»${cuando}. ¿Me pasás el programa y cómo reservo mi lugar?`;
  };
  const actualizar = () => { preview.textContent = mensaje(); };
  curso.addEventListener('change', () => { llenarFechas(); actualizar(); });
  fecha.addEventListener('change', actualizar);
  nombre.addEventListener('input', () => {
    if (nombre.value.trim().length >= 2) { nombre.removeAttribute('aria-invalid'); error.hidden = true; }
    actualizar();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (nombre.value.trim().length < 2) {
      nombre.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      nombre.focus();
      return;
    }
    window.open(waLink(mensaje()), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu consulta lista para enviar.');
  });
  llenarFechas();
  actualizar();
}

function preseleccionarConsulta(id, ed) {
  const curso = document.getElementById('c-curso');
  if (!curso || !getCurso(id)) return;
  curso.value = id;
  curso.dispatchEvent(new window.Event('change'));
  const fecha = document.getElementById('c-fecha');
  if (ed && fecha) { fecha.value = ed; fecha.dispatchEvent(new window.Event('change')); }
}

const Capa = {
  ultimoFoco: null,
  abrir(el, alAbrir) {
    this.ultimoFoco = document.activeElement;
    el.dataset.abierta = '1';
    el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (el.dataset.abierta !== '1') return;
      el.classList.add('open');
      el.querySelector('.drawer-bd')?.classList.add('open');
    }));
    alAbrir?.();
  },
  cerrar(el, devolverFoco = true) {
    if (el.hidden) return;
    el.dataset.abierta = '0';
    el.classList.remove('open');
    const fin = () => { if (el.dataset.abierta === '0') el.hidden = true; };
    if (reduceMotion) fin(); else setTimeout(fin, 380);
    if (!document.querySelector('.modal[data-abierta="1"], .drawer[data-abierta="1"]')) document.body.classList.remove('no-scroll');
    if (devolverFoco && this.ultimoFoco && document.contains(this.ultimoFoco)) this.ultimoFoco.focus({ preventScroll: true });
  }
};

function atraparFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function modalHTML(c) {
  const eds = vigentes(c);
  const prox = eds[0];
  const edsHTML = eds.length
    ? `<fieldset class="md-ed"><legend>Elegí la fecha</legend><div class="md-ed-ops">${eds.map((e, i) => `<label class="md-ed-op"><input type="radio" name="md-ed" value="${e.id}"${i === 0 ? ' checked' : ''}><span>${esc(fechaLarga(e.fecha))}</span></label>`).join('')}</div><p class="md-ed-det" id="md-ed-det">${esc(prox.lugar)} · ${esc(prox.horario)}</p></fieldset>`
    : '<p class="md-ed-det">Fechas a confirmar: consultanos y te avisamos cuando se abra la próxima.</p>';
  const mods = c.modulos.map((m, i) => `<details class="md-mod"${i === 0 ? ' open' : ''}><summary><span class="md-mod-n">${String(i + 1).padStart(2, '0')}</span><span class="md-mod-t">${esc(m.titulo)}</span><span class="md-mod-d">${m.clases.length} temas</span>${ICON.plus}</summary><ul class="md-clases">${m.clases.map(cl => `<li>${ICON[cl.tipo] || ICON.teoria}<span>${esc(cl.titulo)} <span class="md-tipo">${TIPOS[cl.tipo] || ''}</span></span><span class="md-dur">${esc(cl.duracion)}</span></li>`).join('')}</ul></details>`).join('');
  const consulta = `Hola, quiero consultar por la capacitación «${c.titulo}». ¿Me pasás el programa y las próximas fechas?`;
  return `<div class="md-grid">
      <figure class="md-media"><img src="images/${c.portada}.webp" width="1000" height="1000" alt="${esc(c.alt)}"></figure>
      <div class="md-main">
        <p class="md-cat">${esc(CATEGORIAS[c.categoria])}${c.badge ? ` · ${esc(c.badge)}` : ''}</p>
        <h2 class="md-title">${esc(c.titulo)}</h2>
        <p class="md-lead">${esc(c.descripcionCorta)}</p>
        <dl class="md-datos"><div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div><div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div><div><dt>Duración</dt><dd>${esc(c.duracion)}</dd></div><div><dt>Programa</dt><dd>${c.modulos.length} módulos</dd></div></dl>
        ${edsHTML}
        <div class="md-buy"><span class="md-precio">${formatearPrecio(c.precio)}</span><button class="btn btn-primary${Cart.has(c.id) ? ' is-en' : ''}" type="button" data-md-inscribir="${c.id}">${Cart.has(c.id) ? `${ICON.check}Ver mi inscripción` : 'Inscribirme'}</button><a class="btn btn-ghost" href="${waLink(consulta)}" target="_blank" rel="noopener">${ICON.wsp}Consultar</a></div>
      </div>
    </div>
    <div class="md-secs">
      <div class="md-sec"><h3>Qué vas a poder hacer</h3><ul class="md-check">${c.resultados.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      <div class="md-sec"><h3>Programa</h3><div class="md-mods">${mods}</div></div>
      <div class="md-sec md-two"><div><h3>Requisitos</h3><p>${esc(c.requisitos)}</p></div><div><h3>Incluye</h3><ul>${c.incluye.map(x => `<li>${ICON.check}<span>${esc(x)}</span></li>`).join('')}</ul></div></div>
      <div class="md-doc"><div class="sello"><span class="sello-dr">DR.</span><span class="sello-txt">Dermatocosmiatra</span></div><div><p class="md-doc-n">${esc(DOCENTE.nombre)}</p><p>${esc(DOCENTE.rol)}</p></div></div>
      <p class="md-nota">Programa, fechas y valor de ejemplo: se confirman con cada edición.</p>
    </div>`;
}

let modalCurso = null;
function abrirModal(id) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  if (!c || !modal) return;
  modalCurso = c;
  document.getElementById('modal-body').innerHTML = modalHTML(c);
  const panel = modal.querySelector('.modal-panel');
  panel.scrollTop = 0;
  Capa.abrir(modal, () => panel.focus({ preventScroll: true }));
  modal.querySelectorAll('input[name="md-ed"]').forEach(r => r.addEventListener('change', () => {
    const e = c.ediciones.find(x => x.id === r.value);
    const det = document.getElementById('md-ed-det');
    if (e && det) det.textContent = `${e.lugar} · ${e.horario}`;
  }));
}
function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (modal) Capa.cerrar(modal, devolverFoco);
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarModal(); }
    atraparFoco(e, modal.querySelector('.modal-panel'));
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-modal-close]')) { cerrarModal(); return; }
    const ins = e.target.closest('[data-md-inscribir]');
    if (ins && modalCurso) {
      const ed = modal.querySelector('input[name="md-ed"]:checked')?.value;
      const nuevo = !Cart.has(modalCurso.id);
      Cart.add(modalCurso, ed);
      cerrarModal(false);
      setTimeout(() => abrirDrawer(), reduceMotion ? 0 : 200);
      if (nuevo) showToast(`Sumaste «${modalCurso.titulo}» a tu inscripción.`);
    }
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirModal(id);
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get().filter(i => getCurso(i.id));
  if (!items.length) {
    body.innerHTML = `<div class="dr-empty"><div class="sello"><span class="sello-dr">DR.</span></div><p>Todavía no elegiste ninguna capacitación.</p><a class="btn btn-ghost" href="#capacitaciones" data-drawer-close>Ver capacitaciones</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = `<ul>${items.map(i => {
    const c = getCurso(i.id);
    const eds = vigentes(c);
    const ed = eds.find(e => e.id === i.ed) || eds[0];
    const fecha = eds.length > 1
      ? `<label class="dr-ed"><span>Fecha</span><select data-ed-sel="${c.id}">${eds.map(e => `<option value="${e.id}"${ed && e.id === ed.id ? ' selected' : ''}>${esc(fechaLarga(e.fecha))}</option>`).join('')}</select></label>`
      : `<p class="dr-meta">${ed ? esc(fechaLarga(ed.fecha)) : 'Fecha a confirmar'}</p>`;
    return `<li class="dr-item"><img src="images/${c.portada}-600.webp" width="600" height="600" alt=""><div class="dr-info"><p class="dr-tit">${esc(c.titulo)}</p><p class="dr-meta">${esc(c.modalidad)} · ${esc(c.duracion)}</p>${fecha}<button class="btn-link dr-quitar" type="button" data-quitar="${c.id}">Quitar</button></div><span class="dr-precio">${formatearPrecio(c.precio)}</span></li>`;
  }).join('')}</ul>`;
  if (foot) foot.hidden = false;
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer) return;
  renderDrawer();
  bd.hidden = false;
  Capa.abrir(drawer, () => drawer.querySelector('[data-drawer-close]')?.focus({ preventScroll: true }));
  requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
}
function cerrarDrawer(devolverFoco = true) {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-bd');
  if (!drawer || drawer.hidden) return;
  bd.classList.remove('open');
  setTimeout(() => { if (drawer.dataset.abierta === '0') bd.hidden = true; }, reduceMotion ? 0 : 380);
  Capa.cerrar(drawer, devolverFoco);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('drawer-bd')?.addEventListener('click', () => cerrarDrawer());
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarDrawer(); }
    atraparFoco(e, drawer);
  });
  drawer.addEventListener('change', e => {
    const sel = e.target.closest('[data-ed-sel]');
    if (sel) Cart.setEd(sel.dataset.edSel, sel.value);
  });
  drawer.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); renderDrawer(); drawer.querySelector('[data-drawer-close]')?.focus(); return; }
    if (e.target.closest('[data-drawer-close]')) {
      const link = e.target.closest('a[href^="#"]');
      cerrarDrawer(!link);
    }
  });
  document.getElementById('drawer-fin')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
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

function initAcciones() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver && !ver.closest('.modal')) { abrirModal(ver.dataset.ver); return; }
    const ins = e.target.closest('[data-inscribir]');
    if (ins) {
      const c = getCurso(ins.dataset.inscribir);
      if (!c) return;
      const nuevo = !Cart.has(c.id);
      Cart.add(c);
      abrirDrawer();
      if (nuevo) showToast(`Sumaste «${c.titulo}» a tu inscripción.`);
      return;
    }
    const res = e.target.closest('[data-reservar]');
    if (res) {
      const c = getCurso(res.dataset.reservar);
      if (!c) return;
      const nuevo = !Cart.has(c.id);
      Cart.add(c, res.dataset.ed);
      preseleccionarConsulta(c.id, res.dataset.ed);
      abrirDrawer();
      if (nuevo) showToast(`Reservaste tu lugar en «${c.titulo}».`);
      return;
    }
    if (e.target.closest('[data-cart-open]')) abrirDrawer();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); refrescarBotonesInscribir(); if (!document.getElementById('drawer')?.hidden) renderDrawer(); });
}

function initDatosEstructurados() {
  const modo = { 'Online en vivo': 'online', 'Híbrida': 'blended', 'Presencial': 'onsite' };
  const data = {
    '@context': 'https://schema.org',
    '@graph': CURSOS.map(c => ({
      '@type': 'Course',
      name: c.titulo,
      description: c.descripcionCorta,
      educationalLevel: c.nivel,
      provider: { '@type': 'EducationalOrganization', name: 'DR.DERMATOCOSMIATRA', sameAs: IG },
      offers: { '@type': 'Offer', price: c.precio, priceCurrency: 'ARS', category: 'Paid' },
      hasCourseInstance: vigentes(c).map(e => ({ '@type': 'CourseInstance', courseMode: modo[c.modalidad], startDate: e.fecha, location: e.lugar, instructor: { '@type': 'Person', name: DOCENTE.nombre } }))
    }))
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

renderDestacados();
initCatalogo();
initTrayecto();
initAgenda();
initConsulta();
initReveals();
initNav();
initModal();
initDrawer();
initAcciones();
initFloats();
updateCartBadge();
initModelBarScroll();
initDatosEstructurados();
abrirDesdeURL();
