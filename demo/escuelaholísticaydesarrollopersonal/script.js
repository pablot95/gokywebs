'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const DOCENTES = [
  { id: 'mariana', nombre: 'Mariana Solari', rol: 'Fundadora · Terapeuta holística', foto: 'images/clases-virtuales-holisticas_2.8x1.webp', bio: 'Más de diez años acompañando procesos individuales y grupales. Diseñó el método de la escuela.' },
  { id: 'carla', nombre: 'Carla Guillén', rol: 'Facilitadora de círculos y ceremonias', foto: 'images/circulo-de-sanacion_5x3.webp', bio: 'Guía ceremonias del cacao y círculos de mujeres desde 2018. Enseña a sostener espacios grupales.' },
];

const CATEGORIAS = [
  { id: 'energetica', nombre: 'Terapias energéticas' },
  { id: 'ceremonias', nombre: 'Ceremonias' },
  { id: 'femenino', nombre: 'Camino femenino' },
  { id: 'interior', nombre: 'Desarrollo personal' },
];

const CURSOS = [
  {
    id: 'formacion-terapia-holistica', titulo: 'Formación en Terapia Holística Integral', cat: 'energetica',
    nivel: 'Profundización', modalidad: 'Híbrido', precio: 220000, descuento: 0, duracion: '4 meses', clases: 27,
    badge: 'Formación insignia', destacado: true, docenteId: 'mariana', portada: 'images/terapia-holistica-individual_9x16.webp',
    promesa: 'La formación madre de la escuela: herramientas energéticas, encuadre ético y práctica supervisada para acompañar procesos de bienestar.',
    desc: 'Un recorrido de cuatro meses que integra lectura energética, herramientas de acompañamiento y práctica real entre estudiantes. Incluye encuentros en vivo quincenales con supervisión.',
    resultados: ['Sostener sesiones individuales completas con encuadre claro', 'Elegir la herramienta adecuada para cada proceso', 'Cuidar tu propia energía mientras acompañás', 'Construir tu práctica con ética y límites sanos'],
    requisitos: ['Haber hecho al menos un curso inicial de la escuela o experiencia equivalente', 'Disponibilidad para los encuentros en vivo quincenales'],
    incluye: ['27 clases grabadas', 'Encuentros en vivo quincenales', 'Bitácora de práctica descargable', 'Certificado digital de la escuela'],
    modulos: [
      { titulo: 'Fundamentos y encuadre', clases: [{ t: 'Qué es acompañar (y qué no)', d: '38 min', tipo: 'video', preview: true }, { t: 'El encuadre de una sesión', d: '45 min', tipo: 'video' }, { t: 'Ética del acompañante', d: '32 min', tipo: 'lectura' }] },
      { titulo: 'Lectura energética', clases: [{ t: 'Los centros energéticos en sesión', d: '52 min', tipo: 'video' }, { t: 'Registro corporal guiado', d: '25 min', tipo: 'audio' }, { t: 'Protocolo de lectura completo', d: '18 págs', tipo: 'pdf' }] },
      { titulo: 'La práctica real', clases: [{ t: 'Estructura de una primera sesión', d: '48 min', tipo: 'video' }, { t: 'Casos: cuándo derivar', d: '40 min', tipo: 'video' }, { t: 'Tu bitácora de práctica', d: '12 págs', tipo: 'descargable' }] },
    ],
  },
  {
    id: 'ceremonia-cacao', titulo: 'Guía de Ceremonia del Cacao', cat: 'ceremonias',
    nivel: 'Intermedio', modalidad: 'Grabado', precio: 68000, descuento: 0, duracion: '5 semanas', clases: 12,
    badge: 'Nuevo', destacado: true, docenteId: 'carla', portada: 'images/ceremonia-del-cacao-y-altar_1x1.webp',
    promesa: 'Del grano a la ronda: aprendé a preparar y sostener una ceremonia del cacao con respeto por su origen.',
    desc: 'Historia, preparación y estructura ceremonial. Aprendés a armar el altar, guiar la intención y sostener el espacio de principio a fin, con recetario incluido.',
    resultados: ['Preparar el cacao ceremonial con técnica y respeto', 'Diseñar la estructura completa de una ceremonia', 'Guiar la ronda con presencia y palabra propia'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['12 clases grabadas', 'Recetario descargable', 'Guion ceremonial editable'],
    modulos: [
      { titulo: 'El cacao y su historia', clases: [{ t: 'Origen y linaje del cacao ceremonial', d: '30 min', tipo: 'video', preview: true }, { t: 'Elegir y conseguir buen cacao', d: '22 min', tipo: 'video' }, { t: 'Mitos y cuidados', d: '15 min', tipo: 'lectura' }] },
      { titulo: 'La preparación', clases: [{ t: 'La receta base y sus variantes', d: '35 min', tipo: 'video' }, { t: 'El altar y el espacio', d: '28 min', tipo: 'video' }, { t: 'Recetario completo', d: '10 págs', tipo: 'pdf' }] },
      { titulo: 'Sostener la ceremonia', clases: [{ t: 'Apertura, desarrollo y cierre', d: '42 min', tipo: 'video' }, { t: 'Meditación guiada de apertura', d: '18 min', tipo: 'audio' }, { t: 'Guion ceremonial editable', d: '6 págs', tipo: 'descargable' }] },
    ],
  },
  {
    id: 'sanacion-utero', titulo: 'Sanación del Útero: ciclo y raíz', cat: 'femenino',
    nivel: 'Intermedio', modalidad: 'Grabado', precio: 85000, descuento: 15, duracion: '6 semanas', clases: 14,
    destacado: true, docenteId: 'mariana', portada: 'images/sanacion-de-utero_4x5.webp',
    promesa: 'Un recorrido de reconexión con tu ciclo, tu historia y la sabiduría de tu cuerpo.',
    desc: 'Seis semanas de trabajo suave y profundo: registro del ciclo, ejercicios somáticos y rituales simples para habitar el cuerpo con más presencia y menos exigencia.',
    resultados: ['Leer las fases de tu ciclo y acompañarlas', 'Practicar ejercicios somáticos de conexión', 'Crear tus propios rituales de cuidado'],
    requisitos: ['Sin requisitos previos', 'Espacio tranquilo para las prácticas'],
    incluye: ['14 clases grabadas', 'Audios de práctica somática', 'Diario de ciclo imprimible'],
    modulos: [
      { titulo: 'El territorio del cuerpo', clases: [{ t: 'Anatomía sentida: conocer tu raíz', d: '34 min', tipo: 'video', preview: true }, { t: 'La historia que el cuerpo guarda', d: '38 min', tipo: 'video' }, { t: 'Registro inicial', d: '8 págs', tipo: 'pdf' }] },
      { titulo: 'El ciclo como mapa', clases: [{ t: 'Las cuatro fases y sus energías', d: '40 min', tipo: 'video' }, { t: 'Práctica somática de fase interior', d: '22 min', tipo: 'audio' }, { t: 'Diario de ciclo', d: '12 págs', tipo: 'descargable' }] },
      { titulo: 'Rituales de cuidado', clases: [{ t: 'Ritual de inicio de ciclo', d: '26 min', tipo: 'video' }, { t: 'Meditación del útero', d: '20 min', tipo: 'audio' }, { t: 'Cierre del recorrido', d: '30 min', tipo: 'video' }] },
    ],
  },
  {
    id: 'circulos-mujeres', titulo: 'Facilitación de Círculos de Mujeres', cat: 'femenino',
    nivel: 'Intermedio', modalidad: 'En vivo', precio: 92000, descuento: 0, duracion: '2 meses', clases: 9,
    destacado: true, docenteId: 'carla', portada: 'images/circulo-de-sanacion_5x3.webp',
    promesa: 'Estructura, palabra y presencia para sostener círculos donde todas puedan hablar — y ser escuchadas.',
    desc: 'Formación en vivo por cohortes: aprendés la arquitectura de un círculo, practicás la facilitación con tus compañeras y salís con tu primer círculo diseñado.',
    resultados: ['Diseñar la estructura completa de un círculo', 'Manejar la palabra, los silencios y los desbordes', 'Convocar y sostener tu primer círculo propio'],
    requisitos: ['Haber participado de al menos un círculo (o muchas ganas de empezar)'],
    incluye: ['8 encuentros en vivo', 'Grabaciones disponibles', 'Manual de facilitación'],
    modulos: [
      { titulo: 'La arquitectura del círculo', clases: [{ t: 'Por qué el círculo funciona', d: '45 min', tipo: 'video', preview: true }, { t: 'Apertura, palabra y cierre', d: '50 min', tipo: 'video' }, { t: 'Manual de facilitación', d: '24 págs', tipo: 'pdf' }] },
      { titulo: 'La práctica de facilitar', clases: [{ t: 'La escucha que sostiene', d: '48 min', tipo: 'video' }, { t: 'Cuando algo desborda', d: '42 min', tipo: 'video' }, { t: 'Práctica entre compañeras', d: '60 min', tipo: 'video' }] },
      { titulo: 'Tu círculo propio', clases: [{ t: 'Diseñar tu convocatoria', d: '35 min', tipo: 'video' }, { t: 'Checklist del primer círculo', d: '4 págs', tipo: 'descargable' }, { t: 'Supervisión final en vivo', d: '60 min', tipo: 'video' }] },
    ],
  },
  {
    id: 'chakras-intro', titulo: 'Chakras: el mapa energético inicial', cat: 'energetica',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 28000, descuento: 0, duracion: '3 semanas', clases: 9,
    badge: 'Puerta de entrada', docenteId: 'mariana', portada: 'images/curso-online-y-materiales_1x1.webp',
    promesa: 'El curso de entrada a la escuela: conocé los siete centros y aprendé a leerlos en tu vida cotidiana.',
    desc: 'Tres semanas para incorporar el mapa de los chakras sin tecnicismos: qué es cada centro, cómo se siente cuando está en equilibrio y prácticas simples para cada uno.',
    resultados: ['Reconocer los siete centros y su función', 'Detectar desequilibrios en lo cotidiano', 'Practicar un ejercicio simple por centro'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Guía ilustrada de los 7 centros', 'Audios de meditación por chakra'],
    modulos: [
      { titulo: 'El mapa completo', clases: [{ t: 'Qué son los chakras (sin humo)', d: '28 min', tipo: 'video', preview: true }, { t: 'Cómo usar este curso', d: '12 min', tipo: 'video' }, { t: 'Guía ilustrada', d: '14 págs', tipo: 'pdf' }] },
      { titulo: 'Los centros de raíz al corazón', clases: [{ t: 'Raíz, sacro y plexo', d: '38 min', tipo: 'video' }, { t: 'Meditación de enraizamiento', d: '15 min', tipo: 'audio' }, { t: 'El corazón como puente', d: '30 min', tipo: 'video' }] },
      { titulo: 'Los centros superiores', clases: [{ t: 'Garganta, entrecejo y corona', d: '36 min', tipo: 'video' }, { t: 'Meditación de integración', d: '18 min', tipo: 'audio' }, { t: 'Tu práctica semanal', d: '5 págs', tipo: 'descargable' }] },
    ],
  },
  {
    id: 'reiki-1', titulo: 'Reiki Nivel 1: manos que acompañan', cat: 'energetica',
    nivel: 'Inicial', modalidad: 'Híbrido', precio: 75000, descuento: 0, duracion: '4 semanas', clases: 11,
    docenteId: 'mariana', portada: 'images/terapia-holistica-individual_9x16.webp',
    promesa: 'Iniciación al Reiki tradicional para tu práctica personal y el cuidado de los tuyos.',
    desc: 'El primer nivel del sistema Usui: historia, posiciones de manos y práctica diaria, con un encuentro de sintonización en vivo y seguimiento del proceso de 21 días.',
    resultados: ['Practicar el autotratamiento completo', 'Acompañar a familiares con las posiciones básicas', 'Sostener la práctica de 21 días con guía'],
    requisitos: ['Sin requisitos previos', 'Compromiso con la práctica diaria del primer mes'],
    incluye: ['11 clases grabadas', 'Encuentro de sintonización en vivo', 'Guía de posiciones ilustrada'],
    modulos: [
      { titulo: 'El sistema y su historia', clases: [{ t: 'Qué es Reiki y qué no es', d: '32 min', tipo: 'video', preview: true }, { t: 'El linaje Usui', d: '24 min', tipo: 'video' }, { t: 'Los cinco principios', d: '10 min', tipo: 'lectura' }] },
      { titulo: 'Las manos y las posiciones', clases: [{ t: 'Autotratamiento paso a paso', d: '44 min', tipo: 'video' }, { t: 'Posiciones para otros', d: '40 min', tipo: 'video' }, { t: 'Guía ilustrada de posiciones', d: '16 págs', tipo: 'pdf' }] },
      { titulo: 'La práctica de 21 días', clases: [{ t: 'Cómo transitar el proceso', d: '26 min', tipo: 'video' }, { t: 'Meditación Gassho', d: '15 min', tipo: 'audio' }, { t: 'Registro de práctica', d: '6 págs', tipo: 'descargable' }] },
    ],
  },
  {
    id: 'meditacion-respiracion', titulo: 'Meditación y Respiración Consciente', cat: 'interior',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 52000, descuento: 10, duracion: '4 semanas', clases: 12,
    docenteId: 'mariana', portada: 'images/clases-virtuales-holisticas_2.8x1.webp',
    promesa: 'Prácticas breves y sostenibles para volver al cuerpo todos los días — aunque tengas cinco minutos.',
    desc: 'Un mes de práctica progresiva: de la respiración consciente de tres minutos a la meditación sentada de veinte. Sin dogma, sin postura imposible, con constancia amable.',
    resultados: ['Instalar una práctica diaria realista', 'Usar la respiración para regular la ansiedad del momento', 'Meditar 15-20 minutos con comodidad'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['12 clases grabadas', '8 audios de práctica guiada', 'Calendario de práctica imprimible'],
    modulos: [
      { titulo: 'Empezar por respirar', clases: [{ t: 'La respiración como ancla', d: '22 min', tipo: 'video', preview: true }, { t: 'Práctica de 3 minutos', d: '5 min', tipo: 'audio' }, { t: 'Cuándo y dónde practicar', d: '8 min', tipo: 'lectura' }] },
      { titulo: 'Sentarse sin pelear', clases: [{ t: 'La postura posible', d: '25 min', tipo: 'video' }, { t: 'Meditación guiada de 10 minutos', d: '12 min', tipo: 'audio' }, { t: 'Qué hacer con los pensamientos', d: '28 min', tipo: 'video' }] },
      { titulo: 'La práctica que se queda', clases: [{ t: 'De 10 a 20 minutos', d: '24 min', tipo: 'video' }, { t: 'Meditación de 20 minutos', d: '22 min', tipo: 'audio' }, { t: 'Calendario de práctica', d: '3 págs', tipo: 'descargable' }] },
    ],
  },
  {
    id: 'cristales', titulo: 'Cristales: compañeros de práctica', cat: 'interior',
    nivel: 'Inicial', modalidad: 'Grabado', precio: 58000, descuento: 0, duracion: '3 semanas', clases: 9,
    docenteId: 'carla', portada: 'images/ceremonia-del-cacao-y-altar_1x1.webp',
    promesa: 'Selección, limpieza y uso de minerales en tu práctica holística, sin catálogos infinitos ni promesas mágicas.',
    desc: 'Los diez minerales que de verdad vas a usar: cómo elegirlos, limpiarlos y sumarlos a tu meditación, tu espacio y tus sesiones, con criterio y sentido común.',
    resultados: ['Armar tu set inicial de diez minerales', 'Limpiar y cuidar cada pieza correctamente', 'Integrarlos a tu práctica y tu espacio'],
    requisitos: ['Sin requisitos previos'],
    incluye: ['9 clases grabadas', 'Fichas de los 10 minerales', 'Guía de compra consciente'],
    modulos: [
      { titulo: 'Empezar con criterio', clases: [{ t: 'Por qué diez y no cien', d: '20 min', tipo: 'video', preview: true }, { t: 'Comprar sin que te vendan vidrio', d: '26 min', tipo: 'video' }, { t: 'Guía de compra', d: '8 págs', tipo: 'pdf' }] },
      { titulo: 'El cuidado de las piezas', clases: [{ t: 'Limpieza y descarga', d: '24 min', tipo: 'video' }, { t: 'Dónde y cómo guardarlos', d: '18 min', tipo: 'video' }, { t: 'Fichas de minerales', d: '20 págs', tipo: 'pdf' }] },
      { titulo: 'La práctica con minerales', clases: [{ t: 'En tu meditación diaria', d: '28 min', tipo: 'video' }, { t: 'Meditación con cuarzo', d: '14 min', tipo: 'audio' }, { t: 'En tu espacio y tus sesiones', d: '30 min', tipo: 'video' }] },
    ],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmtPrecio = new Intl.NumberFormat('es-AR');
const formatearPrecio = n => '$' + fmtPrecio.format(Math.round(n));
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const getCurso = id => CURSOS.find(c => c.id === id);
const getDocente = id => DOCENTES.find(d => d.id === id);
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

const Cart = {
  KEY: 'escuelauriel_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); },
};

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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ---------- Cards ---------- */
const ICONO_TIPO = {
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="5" width="13" height="14" rx="2.5"/><path d="m16 10 5-3v10l-5-3" stroke-linejoin="round"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 10v4M8.5 6v12M13 9v6M17.5 4v16M21.5 10v4" stroke-linecap="round"/></svg>',
  lectura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 6c-2-1.8-5-2-8-1v13c3-1 6-.8 8 1 2-1.8 5-2 8-1V5c-3-1-6-.8-8 1zM12 6v13" stroke-linejoin="round"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v4h4" stroke-linejoin="round"/><path d="M9 13h6M9 16.5h6" stroke-linecap="round"/></svg>',
  descargable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function cardCursoHTML(c) {
  const final = precioFinal(c);
  const doc = getDocente(c.docenteId);
  const badge = c.descuento > 0
    ? `<span class="curso-badge es-desc">-${c.descuento}%</span>`
    : (c.badge ? `<span class="curso-badge">${esc(c.badge)}</span>` : '');
  return `
  <article class="curso-card" data-id="${esc(c.id)}">
    <div class="curso-media" data-open="${esc(c.id)}" role="button" tabindex="0" aria-label="Ver el curso ${esc(c.titulo)}">
      ${badge}
      <img src="${esc(c.portada)}" alt="${esc(c.titulo)}" loading="lazy" width="600" height="450">
    </div>
    <div class="curso-body">
      <span class="curso-cat">${esc(catNombre(c.cat))}</span>
      <h3 class="curso-titulo" data-open="${esc(c.id)}">${esc(c.titulo)}</h3>
      <p class="curso-doc">Guía: ${esc(doc?.nombre || 'Equipo URIEL')}</p>
      <p class="curso-meta">
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round"/></svg>${esc(c.duracion)}</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round"/></svg>${c.clases} clases</span>
        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5zM7 11v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5" stroke-linejoin="round"/></svg>${esc(c.nivel)}</span>
      </p>
      <p class="curso-precio">
        <b>${formatearPrecio(final)}</b>
        ${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}
      </p>
      <div class="curso-actions">
        <button type="button" class="btn-ver" data-open="${esc(c.id)}">Ver curso</button>
        <button type="button" class="btn-inscribir" data-add="${esc(c.id)}">${Cart.has(c.id) ? 'En tu carrito' : 'Inscribirme'}</button>
      </div>
    </div>
  </article>`;
}

function bindCardActions(root) {
  $$('[data-add]', root).forEach(btn => {
    const sync = () => {
      const en = Cart.has(btn.dataset.add);
      btn.textContent = en ? 'En tu carrito' : 'Inscribirme';
      btn.disabled = en;
    };
    sync();
    btn.addEventListener('click', () => {
      const c = getCurso(btn.dataset.add); if (!c) return;
      if (Cart.add(c)) showToast(`Sumaste “${c.titulo}” a tu inscripción.`);
    });
    document.addEventListener('cart:updated', sync);
  });
  $$('[data-open]', root).forEach(el => {
    el.addEventListener('click', () => openQuickView(el.dataset.open));
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQuickView(el.dataset.open); } });
    }
  });
}

/* ---------- Destacadas ---------- */
function initDestacadas() {
  const grid = $('#destGrid');
  if (!grid) return;
  const dest = CURSOS.filter(c => c.destacado).slice(0, 4);
  grid.innerHTML = dest.map(cardCursoHTML).join('');
  bindCardActions(grid);
  if (!reduceMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo($$('.curso-card', grid), { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: .85, stagger: .13, ease: 'expo.out', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: grid, start: 'top 82%' },
    });
  }
}

/* ---------- Catálogo ---------- */
const PAGE = 12;
const shopState = { query: '', cat: 'all', nivel: 'all', modalidad: 'all', orden: 'relevancia', page: 1 };

function filtrarCursos() {
  let list = [...CURSOS];
  if (shopState.cat !== 'all') list = list.filter(c => c.cat === shopState.cat);
  if (shopState.nivel !== 'all') list = list.filter(c => c.nivel === shopState.nivel);
  if (shopState.modalidad !== 'all') list = list.filter(c => c.modalidad === shopState.modalidad);
  const q = norm(shopState.query).trim();
  if (q) {
    const words = q.split(/\s+/);
    list = list.filter(c => {
      const doc = getDocente(c.docenteId);
      const hay = norm(`${c.titulo} ${catNombre(c.cat)} ${c.cat} ${c.nivel} ${c.modalidad} ${doc?.nombre || ''} ${c.promesa} ${c.desc}`);
      return words.every(w => hay.includes(w));
    });
  }
  switch (shopState.orden) {
    case 'precio-asc': list.sort((a, b) => precioFinal(a) - precioFinal(b)); break;
    case 'precio-desc': list.sort((a, b) => precioFinal(b) - precioFinal(a)); break;
    case 'az': list.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es')); break;
    default: list.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  }
  return list;
}

function renderShop() {
  const grid = $('#shopGrid'), empty = $('#shopEmpty'), more = $('#shopMore'), count = $('#shopCount');
  if (!grid) return;
  const list = filtrarCursos();
  const visible = list.slice(0, shopState.page * PAGE);
  grid.innerHTML = visible.map(cardCursoHTML).join('');
  bindCardActions(grid);
  empty.hidden = list.length > 0;
  grid.style.display = list.length ? '' : 'none';
  more.hidden = list.length <= visible.length;
  count.innerHTML = list.length
    ? `<b>${list.length}</b> ${list.length === 1 ? 'curso' : 'cursos'}${shopState.cat !== 'all' ? ` en <b>${esc(catNombre(shopState.cat))}</b>` : ''}${shopState.query ? ` para “${esc(shopState.query)}”` : ''}`
    : '';
  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo($$('.curso-card', grid), { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: .7, stagger: .07, ease: 'expo.out', clearProps: 'transform,opacity',
    });
  }
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initShop() {
  const search = $('#shopSearch');
  let t = null;
  search?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { shopState.query = search.value; shopState.page = 1; renderShop(); }, 220);
  });
  $('#catChips')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    shopState.cat = chip.dataset.cat; shopState.page = 1;
    $$('#catChips .chip').forEach(c => c.classList.toggle('is-active', c === chip));
    renderShop();
  });
  $('#selNivel')?.addEventListener('change', e => { shopState.nivel = e.target.value; shopState.page = 1; renderShop(); });
  $('#selModalidad')?.addEventListener('change', e => { shopState.modalidad = e.target.value; shopState.page = 1; renderShop(); });
  $('#selOrden')?.addEventListener('change', e => { shopState.orden = e.target.value; shopState.page = 1; renderShop(); });
  $('#shopMore')?.addEventListener('click', () => { shopState.page++; renderShop(); });
  $('#shopReset')?.addEventListener('click', () => {
    Object.assign(shopState, { query: '', cat: 'all', nivel: 'all', modalidad: 'all', page: 1 });
    if (search) search.value = '';
    $('#selNivel').value = 'all'; $('#selModalidad').value = 'all';
    $$('#catChips .chip').forEach(c => c.classList.toggle('is-active', c.dataset.cat === 'all'));
    renderShop();
  });
  renderShop();
}

/* ---------- Vista rápida ---------- */
let qvLastFocus = null;
function openQuickView(id) {
  const c = getCurso(id); if (!c) return;
  const modal = $('#quickView'), backdrop = $('#qvBackdrop'), content = $('#qvContent');
  if (!modal || !content) return;
  const final = precioFinal(c);
  const doc = getDocente(c.docenteId);
  const badge = c.descuento > 0
    ? `<span class="curso-badge es-desc">-${c.descuento}%</span>`
    : (c.badge ? `<span class="curso-badge">${esc(c.badge)}</span>` : '');
  content.innerHTML = `
    <div class="qv-media">${badge}<img src="${esc(c.portada)}" alt="${esc(c.titulo)}" width="900" height="350"></div>
    <div class="qv-info">
      <span class="curso-cat">${esc(catNombre(c.cat))}</span>
      <h2>${esc(c.titulo)}</h2>
      <p class="qv-promesa">${esc(c.promesa)}</p>
      <div class="qv-meta">
        <span>${esc(c.duracion)}</span><span>${c.clases} clases</span><span>${esc(c.nivel)}</span><span>${esc(c.modalidad)}</span>
      </div>
      <div class="qv-compra">
        <p class="curso-precio"><b>${formatearPrecio(final)}</b>${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}</p>
        <div class="qv-compra-btns">
          <button type="button" class="btn btn-cta" id="qvBuy">Inscribirme ahora</button>
          <button type="button" class="btn btn-line" id="qvAdd">${Cart.has(c.id) ? 'En tu carrito' : 'Sumar al carrito'}</button>
        </div>
      </div>
      <div class="qv-sec">
        <h3>Qué te llevás</h3>
        <ul class="qv-resultados">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>
      <div class="qv-sec">
        <h3>El programa</h3>
        <div class="qv-programa">
          ${c.modulos.map((m, i) => `
          <details class="qv-modulo" ${i === 0 ? 'open' : ''}>
            <summary><span class="qv-mod-n">${['I', 'II', 'III', 'IV'][i] || i + 1}</span>${esc(m.titulo)}</summary>
            <div class="qv-clases">
              ${m.clases.map(cl => `
              <p class="qv-clase">${ICONO_TIPO[cl.tipo] || ICONO_TIPO.video}<span>${esc(cl.t)}</span>${cl.preview ? '<span class="badge-preview">Clase abierta</span>' : ''}<span class="dur">${esc(cl.d)}</span></p>`).join('')}
            </div>
          </details>`).join('')}
        </div>
      </div>
      <div class="qv-dos-col">
        <div class="qv-sec"><h3>Incluye</h3><ul class="qv-lista">${c.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="qv-sec"><h3>Requisitos</h3><ul class="qv-lista">${c.requisitos.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>
      ${doc ? `
      <div class="qv-docente">
        <img src="${esc(doc.foto)}" alt="${esc(doc.nombre)}" loading="lazy" width="128" height="128">
        <div><h4>${esc(doc.nombre)}</h4><p>${esc(doc.rol)} — ${esc(doc.bio)}</p></div>
      </div>` : ''}
      <p class="qv-nota">Este curso acompaña procesos de bienestar y autoconocimiento; no reemplaza tratamientos médicos ni psicológicos.</p>
    </div>`;
  $('#qvAdd', content).addEventListener('click', e => {
    if (Cart.add(c)) { showToast(`Sumaste “${c.titulo}” a tu inscripción.`); e.target.textContent = 'En tu carrito'; }
  });
  $('#qvBuy', content).addEventListener('click', () => {
    Cart.add(c);
    closeQuickView();
    openCartDrawer();
  });
  qvLastFocus = document.activeElement;
  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'drawer-open');
  modal.scrollTop = 0;
  $('#qvClose')?.focus();
}
function closeQuickView() {
  const modal = $('#quickView'), backdrop = $('#qvBackdrop');
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  if (!$('#cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll', 'drawer-open');
  qvLastFocus?.focus?.();
}

/* ---------- Drawer ---------- */
let cartLastFocus = null;
function renderCart() {
  const body = $('#cartItems'), total = $('#cartTotal'), drawer = $('#cartDrawer');
  if (!body) return;
  const items = Cart.get();
  drawer.classList.toggle('is-empty', items.length === 0);
  body.innerHTML = items.map(i => {
    const c = getCurso(i.id); if (!c) return '';
    return `
    <div class="cart-item" data-id="${esc(c.id)}">
      <span class="cart-item-media"><img src="${esc(c.portada)}" alt="${esc(c.titulo)}" width="152" height="152"></span>
      <div class="cart-item-info">
        <h3>${esc(c.titulo)}</h3>
        <span class="u">${esc(c.modalidad)} · ${esc(c.duracion)}</span>
      </div>
      <div class="cart-item-side">
        <b>${formatearPrecio(precioFinal(c))}</b>
        ${c.descuento > 0 ? `<s style="font-size:.75rem;color:var(--color-text-muted)">${formatearPrecio(c.precio)}</s>` : ''}
        <button type="button" class="cart-remove" data-cremove>Quitar</button>
      </div>
    </div>`;
  }).join('');
  total.textContent = formatearPrecio(Cart.total());
  $$('.cart-item', body).forEach(row => {
    $('[data-cremove]', row)?.addEventListener('click', () => { Cart.remove(row.dataset.id); showToast('Curso quitado de tu inscripción.'); });
  });
}
function openCartDrawer() {
  const drawer = $('#cartDrawer'), backdrop = $('#drawerBackdrop');
  renderCart();
  cartLastFocus = document.activeElement;
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'drawer-open');
  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo($$('.cart-item', drawer), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .06, ease: 'power2.out', clearProps: 'all' });
  }
  $('#cartClose')?.focus();
}
function closeCartDrawer() {
  const drawer = $('#cartDrawer'), backdrop = $('#drawerBackdrop');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  if (!$('#quickView')?.classList.contains('open')) document.body.classList.remove('no-scroll', 'drawer-open');
  cartLastFocus?.focus?.();
}
function initCartUI() {
  $('#cartOpen')?.addEventListener('click', openCartDrawer);
  $('#cartClose')?.addEventListener('click', closeCartDrawer);
  $('#drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  $('#cartGoShop')?.addEventListener('click', () => { closeCartDrawer(); document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); });
  $('#cartClear')?.addEventListener('click', () => { Cart.clear(); showToast('Inscripción vacía: el camino espera.'); });
  $('#cartCheckout')?.addEventListener('click', () => { showToast('¡Hermoso! El pago y la creación de tu cuenta se activan al pasar la escuela a producción.'); });
  $('#qvClose')?.addEventListener('click', closeQuickView);
  $('#qvBackdrop')?.addEventListener('click', closeQuickView);
  $$('[data-open-curso]').forEach(b => b.addEventListener('click', () => openQuickView(b.dataset.openCurso)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($('#quickView')?.classList.contains('open')) closeQuickView();
      else if ($('#cartDrawer')?.classList.contains('open')) closeCartDrawer();
    }
    if (e.key === 'Tab') {
      const overlay = $('#quickView')?.classList.contains('open') ? $('#quickView')
        : ($('#cartDrawer')?.classList.contains('open') ? $('#cartDrawer') : null);
      if (!overlay) return;
      const focusables = $$('button, [href], input, select, summary', overlay).filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if ($('#cartDrawer')?.classList.contains('open')) renderCart();
  });
  updateCartBadge();
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- Flotantes ---------- */
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

/* ---------- Nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(min-width: 861px)');
  const syncDesktop = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener?.('change', syncDesktop);
  syncDesktop();
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!mq.matches) nav.setAttribute('inert', '');
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
}

/* ---------- Reveals ---------- */
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

/* ---------- Capítulo: el sello se completa ---------- */
function initCamino() {
  const seccion = $('.camino');
  const stage = document.getElementById('caminoStage');
  const pin = document.getElementById('caminoPin');
  const pasos = $$('.paso');
  const anillos = [0, 1, 2, 3].map(i => document.getElementById(`anillo${i}`)).filter(Boolean);
  const palabra = document.getElementById('selloPalabra');
  if (!seccion || !stage || !pin || !pasos.length) return;

  const circulos = [];
  anillos.forEach((g, gi) => {
    $$('circle', g).forEach(circ => {
      const len = 2 * Math.PI * parseFloat(circ.getAttribute('r'));
      circ.style.strokeDasharray = String(len);
      circ.style.strokeDashoffset = String(len);
      circulos.push({ circ, len, grupo: gi });
    });
  });

  const setStep = idx => {
    pasos.forEach(p => p.classList.toggle('is-on', +p.dataset.idx === idx));
  };

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    seccion.classList.add('is-static');
    pasos.forEach(p => p.classList.add('is-on'));
    palabra?.classList.add('is-on');
    return;
  }

  const fondos = ['#f2ebe2', '#e4d3c0', '#7a3040', '#38121b'];
  gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress;
        setStep(Math.min(3, Math.floor(p * 4)));
        circulos.forEach(({ circ, len, grupo }) => {
          const ini = grupo * 0.23;
          const t = Math.min(1, Math.max(0, (p - ini) / 0.2));
          circ.style.strokeDashoffset = String(len * (1 - t));
        });
        palabra?.classList.toggle('is-on', p > 0.9);
        const tramo = Math.min(2.999, p * 3);
        const i = Math.floor(tramo);
        pin.style.background = gsap.utils.interpolate(fondos[i], fondos[i + 1], tramo - i);
        pin.classList.toggle('is-noche', p > 0.52);
      },
    },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Motion general ---------- */
function initMotion() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (reduceMotion) return;

  const laptop = document.getElementById('heroLaptop');
  if (laptop) {
    gsap.fromTo(laptop, { y: 70, x: -30, opacity: 0, rotate: -4 }, { y: 0, x: 0, opacity: 1, rotate: 0, duration: 1.3, ease: 'expo.out', delay: .5 });
  }
  const mandala = $('.hero-mandala');
  if (mandala) {
    gsap.fromTo(mandala, { rotate: -14, opacity: 0 }, { rotate: 0, opacity: .16, duration: 2, ease: 'expo.out' });
  }

  if (typeof ScrollTrigger === 'undefined') return;

  if (mandala) {
    gsap.to(mandala, { rotate: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }
  if (laptop) {
    gsap.to(laptop, { y: -34, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
  const cuenco = document.getElementById('seamCuenco');
  if (cuenco) {
    gsap.fromTo(cuenco, { y: 40, rotate: -3 }, {
      y: -26, rotate: 3, ease: 'none',
      scrollTrigger: { trigger: '.catalogo', start: 'bottom 95%', end: 'bottom 25%', scrub: .7 },
    });
  }
  const sello = document.getElementById('cierreSello');
  if (sello) {
    gsap.to(sello, { rotate: 360, ease: 'none', scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: 2 } });
  }
  const maniMandala = $('.mani-mandala');
  if (maniMandala) {
    gsap.fromTo(maniMandala, { rotate: -18 }, { rotate: 14, ease: 'none', scrollTrigger: { trigger: '.manifiesto', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initNav();
initDestacadas();
initShop();
initCartUI();
initFloats();
initReveals();
initCamino();
initMotion();
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
