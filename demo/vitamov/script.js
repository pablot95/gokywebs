const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491156347960';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  lock: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  play: svg('<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chev: svg('<path d="m6 9 6 6 6-6"/>'),
  video: svg('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  bolt: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
};

const ETAPAS = {
  kids: { nombre: 'Kids' },
  adultos: { nombre: 'Jóvenes y adultos' },
  mayores: { nombre: 'Adultos mayores' },
  stretching: { nombre: 'Stretching' },
};
const dot = etapa => `<i class="dot dot--${ETAPAS[etapa] ? etapa : 'otra'}"></i>`;

const INCLUYE = [
  'Evaluación inicial por videollamada',
  'Plan según tu edad y tu objetivo',
  'Acceso a las clases grabadas de tu etapa',
  'Seguimiento semanal por WhatsApp',
];

const PROGRAMAS = [
  {
    id: 'kids', tipo: 'programa', etapa: 'kids', titulo: 'Kids', nombre: 'Jugar para moverse mejor', edad: 'De 4 a 11 años',
    promesa: 'Juegos lúdicos para coordinación, equilibrio y atención.',
    descripcion: 'Clases cortas en formato de juego para que chicos y chicas desarrollen coordinación, equilibrio, fuerza y atención mientras se divierten. Se hacen en casa, con objetos que ya tenés.',
    intensidad: 'Lúdica', precio: 22000, descuento: 0, foto: 'kids',
    alt: 'Colchoneta azul con conos, aros, piedras de equilibrio y almohadones de colores para un circuito infantil',
    resultados: ['Más coordinación y equilibrio para jugar y hacer deporte', 'Fuerza y postura sin aparatos, jugando', 'Atención y memoria puestas en movimiento'],
    requisitos: ['Un espacio despejado de 2 × 2 metros', 'Un adulto cerca en las primeras clases', 'Objetos de casa: almohadones, una pelota, cinta de papel'],
    modulos: [
      { titulo: 'Equilibrio y coordinación', clases: [
        { id: 'k1', titulo: 'Islas y puentes', min: 15, foco: 'Equilibrio', muestra: true },
        { id: 'k2', titulo: 'El camino de los conos', min: 18, foco: 'Coordinación' },
        { id: 'k3', titulo: 'Estatuas en movimiento', min: 12, foco: 'Atención' },
      ] },
      { titulo: 'Fuerza jugando', clases: [
        { id: 'k4', titulo: 'Animales que caminan', min: 15, foco: 'Fuerza' },
        { id: 'k5', titulo: 'Cangrejos y carretillas', min: 14, foco: 'Fuerza' },
        { id: 'k6', titulo: 'Circuito del superhéroe', min: 20, foco: 'Resistencia' },
      ] },
      { titulo: 'Atención y ritmo', clases: [
        { id: 'k7', titulo: 'El semáforo', min: 12, foco: 'Atención' },
        { id: 'k8', titulo: 'Ecos de palmas', min: 10, foco: 'Coordinación' },
        { id: 'k9', titulo: 'Memoria en movimiento', min: 15, foco: 'Atención' },
      ] },
    ],
  },
  {
    id: 'adultos', tipo: 'programa', etapa: 'adultos', titulo: 'Jóvenes y adultos', nombre: 'Entrenamiento personal en casa', edad: 'Desde los 14 años',
    promesa: 'Técnica, fuerza y resistencia con bandas y mancuernas.',
    descripcion: 'Entrenamiento personal grabado para jóvenes y adultos: técnica, fuerza y resistencia con bandas y mancuernas. Natalia ajusta el plan a tu nivel, a tu objetivo y a los días que tenés.',
    intensidad: 'Moderada a intensa', precio: 28000, descuento: 0, foto: 'adultos-fuerza',
    alt: 'Mancuernas naranjas, bandas elásticas y una toalla sobre una alfombra de yute con luz de mañana',
    resultados: ['Técnica segura en los movimientos básicos', 'Más fuerza y resistencia con poco equipamiento', 'Un plan semanal que entra en tu agenda'],
    requisitos: ['Una colchoneta', 'Bandas elásticas y un par de mancuernas (o botellas con agua)', 'Calzado deportivo'],
    modulos: [
      { titulo: 'Bases y técnica', clases: [
        { id: 'a1', titulo: 'Sentadilla y bisagra de cadera', min: 25, foco: 'Fuerza', muestra: true },
        { id: 'a2', titulo: 'Empuje y tracción con banda', min: 25, foco: 'Fuerza' },
        { id: 'a3', titulo: 'Core y postura', min: 20, foco: 'Movilidad' },
      ] },
      { titulo: 'Fuerza con mancuernas', clases: [
        { id: 'a4', titulo: 'Tren inferior', min: 35, foco: 'Fuerza' },
        { id: 'a5', titulo: 'Tren superior', min: 35, foco: 'Fuerza' },
        { id: 'a6', titulo: 'Cuerpo completo', min: 40, foco: 'Fuerza' },
      ] },
      { titulo: 'Resistencia', clases: [
        { id: 'a7', titulo: 'Intervalos sin saltos', min: 25, foco: 'Resistencia' },
        { id: 'a8', titulo: 'Circuito funcional', min: 30, foco: 'Resistencia' },
        { id: 'a9', titulo: 'Caminata activa en el lugar', min: 25, foco: 'Resistencia' },
      ] },
    ],
  },
  {
    id: 'mayores', tipo: 'programa', etapa: 'mayores', titulo: 'Adultos mayores', nombre: 'Fuerza y equilibrio para la vida diaria', edad: 'Desde los 60 años',
    promesa: 'Fuerza, equilibrio y movilidad a tu ritmo, con silla.',
    descripcion: 'Clases a ritmo tranquilo para ganar fuerza, equilibrio y movilidad en lo de todos los días: levantarse, caminar, subir escalones. Arrancan sentados y avanzan con apoyo.',
    intensidad: 'Suave', precio: 24000, descuento: 0, foto: 'adultos-mayores',
    alt: 'Silla tapizada junto a una pelota azul y una banda elástica verde, lista para una clase con apoyo',
    resultados: ['Más seguridad al caminar, subir escalones y levantarse', 'Movilidad para las tareas de todos los días', 'Autonomía, a tu ritmo y con apoyo'],
    requisitos: ['Una silla firme, sin rueditas', 'Una banda elástica suave y una pelota liviana', 'Consultar con tu médico antes de empezar'],
    modulos: [
      { titulo: 'Movilidad en silla', clases: [
        { id: 'm1', titulo: 'Despertar articular', min: 20, foco: 'Movilidad', muestra: true },
        { id: 'm2', titulo: 'Hombros y espalda', min: 20, foco: 'Movilidad' },
        { id: 'm3', titulo: 'Respiración y postura', min: 15, foco: 'Respiración' },
      ] },
      { titulo: 'Equilibrio', clases: [
        { id: 'm4', titulo: 'De pie, con apoyo', min: 20, foco: 'Equilibrio' },
        { id: 'm5', titulo: 'Pasos seguros', min: 20, foco: 'Equilibrio' },
        { id: 'm6', titulo: 'Levantarse y sentarse', min: 18, foco: 'Fuerza' },
      ] },
      { titulo: 'Fuerza funcional', clases: [
        { id: 'm7', titulo: 'Piernas fuertes con silla', min: 25, foco: 'Fuerza' },
        { id: 'm8', titulo: 'Brazos con banda', min: 22, foco: 'Fuerza' },
        { id: 'm9', titulo: 'Circuito suave', min: 25, foco: 'Resistencia' },
      ] },
    ],
  },
  {
    id: 'stretching', tipo: 'programa', etapa: 'stretching', titulo: 'Stretching', nombre: 'Elongación y movilidad', edad: 'Para todas las edades',
    promesa: 'Elongación y movilidad para soltar tensiones.',
    descripcion: 'Elongación y movilidad para soltar tensiones, mejorar la postura y moverse con más amplitud. Sirve sola o como complemento de cualquier otro programa.',
    intensidad: 'Suave', precio: 18000, descuento: 0, foto: 'stretching',
    alt: 'Bloques de corcho, un rodillo de goma espuma y un cinturón de elongación sobre una colchoneta',
    resultados: ['Menos rigidez en espalda, cuello y cadera', 'Más rango de movimiento para entrenar y para el día a día', 'Un momento para bajar el ritmo y respirar'],
    requisitos: ['Una colchoneta', 'Un bloque o un libro grueso, y un cinturón o una toalla', 'Ropa cómoda'],
    modulos: [
      { titulo: 'Despertar el cuerpo', clases: [
        { id: 's1', titulo: 'Movilidad de la mañana', min: 15, foco: 'Movilidad', muestra: true },
        { id: 's2', titulo: 'Columna y cadera', min: 20, foco: 'Movilidad' },
        { id: 's3', titulo: 'Cuello y hombros', min: 15, foco: 'Movilidad' },
      ] },
      { titulo: 'Elongación profunda', clases: [
        { id: 's4', titulo: 'Cadena posterior', min: 25, foco: 'Movilidad' },
        { id: 's5', titulo: 'Cadera y piernas', min: 25, foco: 'Movilidad' },
        { id: 's6', titulo: 'Espalda y pecho', min: 20, foco: 'Movilidad' },
      ] },
      { titulo: 'Relajación', clases: [
        { id: 's7', titulo: 'Respiración guiada', min: 12, foco: 'Respiración' },
        { id: 's8', titulo: 'Elongación antes de dormir', min: 18, foco: 'Respiración' },
        { id: 's9', titulo: 'Liberación con rodillo', min: 20, foco: 'Movilidad' },
      ] },
    ],
  },
];

const VIVO = [
  { id: 'vivo-lun-10', tipo: 'vivo', etapa: 'mayores', dia: 'Lunes', hora: '10:00', min: 45, precio: 15000, descuento: 0 },
  { id: 'vivo-lun-18', tipo: 'vivo', etapa: 'kids', dia: 'Lunes', hora: '18:00', min: 40, precio: 15000, descuento: 0 },
  { id: 'vivo-lun-1930', tipo: 'vivo', etapa: 'adultos', dia: 'Lunes', hora: '19:30', min: 50, precio: 15000, descuento: 0 },
  { id: 'vivo-mar-9', tipo: 'vivo', etapa: 'stretching', dia: 'Martes', hora: '9:00', min: 45, precio: 15000, descuento: 0 },
  { id: 'vivo-mar-1730', tipo: 'vivo', etapa: 'kids', dia: 'Martes', hora: '17:30', min: 40, precio: 15000, descuento: 0 },
  { id: 'vivo-mar-1930', tipo: 'vivo', etapa: 'stretching', dia: 'Martes', hora: '19:30', min: 45, precio: 15000, descuento: 0 },
  { id: 'vivo-mie-10', tipo: 'vivo', etapa: 'mayores', dia: 'Miércoles', hora: '10:00', min: 45, precio: 15000, descuento: 0 },
  { id: 'vivo-mie-18', tipo: 'vivo', etapa: 'adultos', dia: 'Miércoles', hora: '18:00', min: 50, precio: 15000, descuento: 0 },
];
const UNO_A_UNO = { id: 'vivo-1a1', tipo: 'vivo', etapa: 'adultos', propuesta: 'Personal 1 a 1', dia: 'Lunes a miércoles', hora: 'A coordinar', min: 50, precio: 40000, descuento: 0 };
const DIAS = ['Lunes', 'Martes', 'Miércoles'];

const PRODUCTOS = [...PROGRAMAS, ...VIVO, UNO_A_UNO];
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreVivo = v => v.propuesta || ETAPAS[v.etapa].nombre;
const totalClases = p => p.modulos.reduce((s, m) => s + m.clases.length, 0);
const totalMin = p => p.modulos.reduce((s, m) => s + m.clases.reduce((t, c) => t + c.min, 0), 0);

const CLASES = (() => {
  const lista = [];
  const filas = Math.max(...PROGRAMAS.map(p => totalClases(p)));
  for (let i = 0; i < filas; i++) {
    PROGRAMAS.forEach(p => {
      const planas = p.modulos.flatMap((m, mi) => m.clases.map(c => ({ ...c, modulo: m.titulo, mi })));
      const c = planas[i];
      if (c) lista.push({ ...c, programa: p.id, etapa: p.etapa, n: lista.length + 1 });
    });
  }
  return lista;
})();

const Cart = {
  KEY: 'vitamov_cart',
  get() { try { return (JSON.parse(localStorage.getItem(this.KEY)) || []).filter(i => getProducto(i.id)); } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Tu navegador no deja guardar la inscripción'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto) {
    const items = this.get();
    if (items.some(i => i.id === producto.id)) return false;
    items.push({ id: producto.id, qty: 1 });
    this.save(items);
    return true;
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) : s; }, 0); },
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

function cardPrograma(p) {
  return `<article class="prog-card" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button class="prog-card__media" type="button" data-abrir="${p.id}" aria-label="Ver la propuesta ${esc(p.titulo)}">
      <img src="images/${p.foto}-600.webp" srcset="images/${p.foto}-600.webp 600w, images/${p.foto}.webp 1200w" sizes="(max-width: 640px) 46vw, (max-width: 1100px) 45vw, 280px" width="600" height="600" alt="${esc(p.alt)}">
      <span class="lock-badge">${ICON.lock}Con tu asesoría</span>
    </button>
    <div class="prog-card__body">
      <p class="prog-card__edad">${dot(p.etapa)}${esc(p.edad)}</p>
      <h3 class="prog-card__titulo">${esc(p.titulo)}</h3>
      <p class="prog-card__promesa">${esc(p.promesa)}</p>
      <p class="prog-card__meta">${totalClases(p)} clases grabadas · ${p.modulos.length} módulos</p>
      <div class="prog-card__pie">
        <p class="precio">${formatearPrecio(precioFinal(p))}<small>/mes</small></p>
        <button class="link-btn" type="button" data-abrir="${p.id}">Ver propuesta ${ICON.arrow}</button>
      </div>
      <button class="btn btn--sm btn--dark prog-card__inscribir" type="button" data-inscribir="${p.id}" data-label="Inscribirme">Inscribirme</button>
    </div>
  </article>`;
}

function renderProgramas() {
  const cont = document.querySelector('[data-programas]');
  if (!cont) return;
  cont.innerHTML = PROGRAMAS.map(cardPrograma).join('');
}

function panelEtapa(p) {
  const m = p.modulos[0];
  const enVivo = VIVO.filter(v => v.etapa === p.etapa);
  return `<figure class="etapa-panel__foto"><img src="images/${p.foto}.webp" srcset="images/${p.foto}-600.webp 600w, images/${p.foto}.webp 1200w" sizes="(max-width: 820px) 100vw, 40vw" width="1200" height="1200" alt="${esc(p.alt)}"></figure>
    <div class="etapa-panel__info">
      <p class="prog-card__edad">${dot(p.etapa)}${esc(p.edad)}</p>
      <h3>${esc(p.titulo)} · ${esc(p.nombre)}</h3>
      <p class="etapa-panel__promesa">${esc(p.descripcion)}</p>
      <div class="chips"><span class="chip">${ICON.video}${totalClases(p)} clases grabadas</span><span class="chip">${ICON.clock}${totalMin(p)} min en total</span><span class="chip">${ICON.bolt}Intensidad ${esc(p.intensidad.toLowerCase())}</span></div>
      <div class="mini-modulo">
        <p class="mini-modulo__t">Módulo 1 · ${esc(m.titulo)}</p>
        <ul>${m.clases.map(c => `<li>${ICON.play}<span>${esc(c.titulo)}</span>${c.muestra ? '<span class="tag-muestra">Muestra</span>' : ''}<span class="min">${c.min} min</span></li>`).join('')}</ul>
      </div>
      ${enVivo.length ? `<p class="etapa-panel__vivo">En vivo: ${enVivo.map(v => `${v.dia} ${v.hora} h`).join(' · ')} · <a href="#en-vivo">ver horarios</a></p>` : ''}
      <div class="etapa-panel__pie">
        <p class="precio">${formatearPrecio(precioFinal(p))}<small>/mes</small></p>
        <button class="btn btn--dark" type="button" data-inscribir="${p.id}" data-label="Inscribirme">Inscribirme</button>
        <button class="link-btn" type="button" data-abrir="${p.id}">Ver programa completo ${ICON.arrow}</button>
      </div>
    </div>`;
}

function renderEtapas() {
  const wrap = document.querySelector('[data-etapas]');
  if (!wrap) return;
  wrap.innerHTML = `<div class="etapas__tabs" role="tablist" aria-label="Etapas" data-animate="izq" style="opacity:0;transform:translateX(-36px)">
      ${PROGRAMAS.map((p, i) => `<button class="etapa-tab" type="button" role="tab" id="tab-${p.id}" aria-controls="etapa-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-etapa-tab="${p.id}">
        <span class="etapa-tab__num">${String(i + 1).padStart(2, '0')}</span><span class="etapa-tab__nombre">${esc(p.titulo)}</span><span class="etapa-tab__edad">${esc(p.edad)}</span></button>`).join('')}
    </div>
    <div class="etapa-panel" id="etapa-panel" role="tabpanel" aria-labelledby="tab-${PROGRAMAS[0].id}" data-animate="der" style="opacity:0;transform:translateX(36px)">${panelEtapa(PROGRAMAS[0])}</div>`;
  const tabs = [...wrap.querySelectorAll('[role="tab"]')];
  const panel = wrap.querySelector('.etapa-panel');
  const activar = (id, foco) => {
    const p = PROGRAMAS.find(x => x.id === id);
    const tab = tabs.find(t => t.dataset.etapaTab === id);
    if (!p || !tab) return;
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.innerHTML = panelEtapa(p);
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    syncBotones();
    if (foco) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.dataset.etapaTab));
    t.addEventListener('keydown', e => {
      const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      activar(tabs[(i + dir + tabs.length) % tabs.length].dataset.etapaTab, true);
    });
  });
  document.querySelectorAll('[data-etapa-link]').forEach(a => a.addEventListener('click', () => activar(a.dataset.etapaLink)));
}

function botonReservar(v, label = 'Reservar') {
  return `<button class="btn btn--sm btn--line" type="button" data-reservar="${v.id}" data-label="${label}">${label}</button>`;
}

function renderHorarios() {
  document.querySelectorAll('[data-horarios]').forEach(cont => {
    if (cont.dataset.horarios === 'semana') {
      cont.innerHTML = `<div class="semana">${DIAS.map(d => {
        const slots = VIVO.filter(v => v.dia === d);
        return `<div class="dia" data-animate="subir" style="opacity:0;transform:translateY(36px)">
          <p class="dia__nombre">${d}<small>${slots.length} clases</small></p>
          <ul class="dia__slots">${slots.map(v => `<li class="dia-slot"><span class="dia-slot__hora">${v.hora}</span><span class="dia-slot__prop">${dot(v.etapa)}${esc(nombreVivo(v))}</span><span class="dia-slot__dur">${v.min} min</span>${botonReservar(v)}</li>`).join('')}</ul>
        </div>`;
      }).join('')}</div>
      <div class="uno-a-uno" data-animate="subir" style="opacity:0;transform:translateY(28px)">
        <div><h3>Personal 1 a 1 en vivo</h3><p>${UNO_A_UNO.dia}, en el horario que coordines con Natalia · ${UNO_A_UNO.min} min · ${formatearPrecio(UNO_A_UNO.precio)}/mes</p></div>
        ${botonReservar(UNO_A_UNO)}
      </div>`;
    } else {
      const filas = [...VIVO, UNO_A_UNO];
      cont.innerHTML = `<div class="tabla-vivo">
        <div class="tabla-vivo__head" aria-hidden="true"><span>Propuesta</span><span>Día</span><span>Horario</span><span>Duración</span><span></span></div>
        <ul>${filas.map(v => `<li class="slot" data-animate="subir" style="opacity:0;transform:translateY(24px)">
          <span class="slot__prop">${dot(v.etapa)}${esc(nombreVivo(v))}</span>
          <span class="slot__cuando"><span class="slot__dia">${v.id === UNO_A_UNO.id ? 'Lun a mié' : v.dia}</span><span class="slot__hora">${v.hora}${/\d/.test(v.hora) ? ' h' : ''}</span><span class="slot__dur">${v.min} min</span></span>
          ${botonReservar(v)}
        </li>`).join('')}</ul>
      </div>`;
    }
  });
}

function initBiblioteca() {
  const lista = document.getElementById('biblio-lista');
  if (!lista) return;
  const cuenta = document.getElementById('biblio-cuenta');
  const limpiar = document.getElementById('biblio-limpiar');
  const vacio = document.getElementById('biblio-vacio');
  const mas = document.getElementById('biblio-mas');
  const fFoco = document.getElementById('f-foco');
  const fDur = document.getElementById('f-dur');
  const fQ = document.getElementById('f-q');
  const chips = [...document.querySelectorAll('[data-filtro-etapa]')];
  const POR_PAGINA = 12;
  const estado = { etapa: '', foco: '', dur: '', q: '', pagina: 1 };

  const focos = [...new Set(CLASES.map(c => c.foco))].sort((a, b) => a.localeCompare(b, 'es'));
  if (fFoco) fFoco.insertAdjacentHTML('beforeend', focos.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join(''));

  const fila = c => {
    const p = PROGRAMAS.find(x => x.id === c.programa);
    return `<li class="clase" data-animate="subir" style="opacity:0;transform:translateY(28px)">
      <button class="clase__btn" type="button" data-abrir="${c.programa}" data-clase="${c.id}" aria-label="${esc(c.titulo)}, ${esc(p.titulo)}, ${c.min} minutos">
        <span class="clase__num">${String(c.n).padStart(2, '0')}</span>
        <span class="clase__info"><span class="clase__titulo">${esc(c.titulo)}</span><span class="clase__meta"><span>${dot(c.etapa)}${esc(ETAPAS[c.etapa].nombre)}</span><span>${esc(c.foco)}</span><span class="min-m">${c.min} min</span></span></span>
        <span class="clase__dur">${ICON.clock}${c.min} min</span>
        <span class="clase__estado">${c.muestra ? `<span class="tag-muestra">${ICON.play}Clase de muestra</span>` : `<span class="tag-lock">${ICON.lock}<span>Con asesoría</span></span>`}</span>
      </button>
    </li>`;
  };

  const filtradas = () => {
    const q = normalizar(estado.q).trim();
    const palabras = q ? q.split(/\s+/) : [];
    return CLASES.filter(c => {
      if (estado.etapa && c.etapa !== estado.etapa) return false;
      if (estado.foco && c.foco !== estado.foco) return false;
      if (estado.dur === '15' && c.min > 15) return false;
      if (estado.dur === '25' && (c.min <= 15 || c.min > 25)) return false;
      if (estado.dur === '99' && c.min <= 25) return false;
      if (palabras.length) {
        const p = PROGRAMAS.find(x => x.id === c.programa);
        const texto = normalizar([c.titulo, c.foco, c.modulo, p.titulo, p.nombre, p.edad, ETAPAS[c.etapa].nombre, p.requisitos.join(' ')].join(' '));
        if (!palabras.every(w => texto.includes(w))) return false;
      }
      return true;
    });
  };

  const pintar = (agregar = false) => {
    const todas = filtradas();
    const hasta = estado.pagina * POR_PAGINA;
    const visibles = todas.slice(0, hasta);
    if (agregar) {
      const ya = lista.children.length;
      lista.insertAdjacentHTML('beforeend', visibles.slice(ya).map(fila).join(''));
    } else {
      lista.innerHTML = visibles.map(fila).join('');
    }
    const hayFiltro = estado.etapa || estado.foco || estado.dur || estado.q.trim();
    cuenta.textContent = todas.length
      ? `Mostrando ${visibles.length} de ${todas.length} ${todas.length === 1 ? 'clase' : 'clases'}${estado.etapa ? ` · ${ETAPAS[estado.etapa].nombre}` : ''}`
      : 'Sin resultados';
    limpiar.hidden = !hayFiltro;
    vacio.hidden = todas.length > 0;
    mas.hidden = visibles.length >= todas.length;
    revelarNuevos(lista);
  };

  const reiniciar = () => { estado.pagina = 1; pintar(); };
  chips.forEach(ch => ch.addEventListener('click', () => {
    estado.etapa = ch.dataset.filtroEtapa;
    chips.forEach(c => c.setAttribute('aria-pressed', c === ch));
    reiniciar();
  }));
  fFoco?.addEventListener('change', () => { estado.foco = fFoco.value; reiniciar(); });
  fDur?.addEventListener('change', () => { estado.dur = fDur.value; reiniciar(); });
  let t = 0;
  fQ?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = fQ.value; reiniciar(); }, 160); });
  const reset = () => {
    Object.assign(estado, { etapa: '', foco: '', dur: '', q: '', pagina: 1 });
    chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.filtroEtapa === ''));
    if (fFoco) fFoco.value = '';
    if (fDur) fDur.value = '';
    if (fQ) fQ.value = '';
    pintar();
  };
  limpiar?.addEventListener('click', reset);
  vacio?.querySelector('button')?.addEventListener('click', reset);
  mas?.addEventListener('click', () => { estado.pagina++; pintar(true); });
  pintar();
}

let ultimoFoco = null;
function trapFoco(capa, e) {
  if (e.key !== 'Tab') return;
  const f = [...capa.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(capa) {
  if (!capa) return;
  if (!capa.classList.contains('open')) ultimoFoco = document.activeElement;
  capa.hidden = false;
  document.body.classList.add('no-scroll');
  void capa.offsetWidth;
  capa.classList.add('open');
  capa.querySelector('[tabindex="-1"]')?.focus({ preventScroll: true });
}
function cerrarCapa(capa, devolverFoco = true) {
  if (!capa || capa.hidden) return;
  capa.classList.remove('open');
  setTimeout(() => { if (!capa.classList.contains('open')) capa.hidden = true; }, reduceMotion ? 0 : 420);
  if (!document.querySelector('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll');
  if (devolverFoco) ultimoFoco?.focus?.({ preventScroll: true });
}

function abrirPrograma(id, claseId) {
  const p = PROGRAMAS.find(x => x.id === id);
  const modal = document.getElementById('modal-prog');
  const body = document.getElementById('modal-body');
  if (!p || !modal || !body) return;
  const msg = `Hola Natalia! Quiero consultar por ${p.titulo} (${p.edad}) de Vitamov.`;
  const conClase = claseId ? p.modulos.findIndex(m => m.clases.some(c => c.id === claseId)) : 0;
  body.innerHTML = `<div class="m-prog">
    <div class="m-prog__lado">
      <figure class="m-prog__foto"><img src="images/${p.foto}.webp" srcset="images/${p.foto}-600.webp 600w, images/${p.foto}.webp 1200w" sizes="(max-width: 820px) 100vw, 440px" width="1200" height="1200" alt="${esc(p.alt)}"></figure>
      <div class="m-prog__compra">
        <p class="precio">${formatearPrecio(precioFinal(p))}<small>/mes</small></p>
        <p>Asesoría personalizada + acceso a las ${totalClases(p)} clases grabadas de ${esc(p.titulo)}.</p>
        <button class="btn btn--dark" type="button" data-inscribir="${p.id}" data-label="Inscribirme">Inscribirme</button>
        <a class="btn btn--ghost" href="${waLink(msg)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>
    </div>
    <div class="m-prog__info">
      <p class="prog-card__edad">${dot(p.etapa)}${esc(p.edad)} · Intensidad ${esc(p.intensidad.toLowerCase())}</p>
      <h2>${esc(p.titulo)} · ${esc(p.nombre)}</h2>
      <p class="m-prog__desc">${esc(p.descripcion)}</p>
      <div class="chips"><span class="chip">${ICON.video}${totalClases(p)} clases grabadas</span><span class="chip">${ICON.clock}${totalMin(p)} min en total</span><span class="chip">${ICON.lock}Se habilitan con tu asesoría</span></div>
      <div class="m-bloque"><h3>Qué vas a lograr</h3><ul class="checks">${p.resultados.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      <div class="m-bloque"><h3>Programa</h3>
        <div class="modulos">${p.modulos.map((m, i) => `<details${i === Math.max(conClase, 0) ? ' open' : ''}>
          <summary><strong>Módulo ${i + 1} · ${esc(m.titulo)}</strong><small>${m.clases.length} clases · ${m.clases.reduce((s, c) => s + c.min, 0)} min</small>${ICON.chev}</summary>
          <ol>${m.clases.map(c => `<li data-clase-id="${c.id}"${c.id === claseId ? ' class="is-foco"' : ''}>${ICON.play}<span>${esc(c.titulo)}</span>${c.muestra ? '<span class="tag-muestra">Muestra gratis</span>' : `<span class="tag-lock" aria-label="Se habilita con tu asesoría">${ICON.lock}</span>`}<span class="min">${c.min} min</span></li>`).join('')}</ol>
        </details>`).join('')}</div>
      </div>
      <div class="m-bloque"><h3>Qué incluye la asesoría</h3><ul class="checks">${INCLUYE.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      <div class="m-bloque"><h3>Qué necesitás</h3><ul class="checks">${p.requisitos.map(r => `<li>${ICON.check}<span>${esc(r)}</span></li>`).join('')}</ul></div>
      <div class="m-bloque"><h3>Quién enseña</h3><div class="m-docente"><span class="m-docente__ini" aria-hidden="true">NC</span><p><strong>Natalia Cardozo</strong>Profesora de Educación Física y Personal Trainer. Trabaja con planificación, evaluación y acompañamiento constante.</p></div></div>
    </div>
  </div>`;
  syncBotones();
  abrirCapa(modal);
  const panel = modal.querySelector('.modal__panel');
  if (panel) panel.scrollTop = 0;
  if (claseId) {
    const li = body.querySelector(`[data-clase-id="${claseId}"]`);
    if (li && panel) panel.scrollTop = Math.max(0, li.getBoundingClientRect().top - panel.getBoundingClientRect().top - panel.clientHeight / 3);
  }
}

function itemDrawer(p) {
  const esPrograma = p.tipo === 'programa';
  const titulo = esPrograma ? `${p.titulo} · asesoría + clases grabadas` : `Clase en vivo · ${nombreVivo(p)}`;
  const sub = esPrograma ? `${totalClases(p)} clases grabadas · mensual` : `${p.id === UNO_A_UNO.id ? 'Lunes a miércoles, horario a coordinar' : `${p.dia} ${p.hora} h`} · 4 clases por mes`;
  const img = esPrograma ? `<img src="images/${p.foto}-600.webp" width="600" height="600" alt="">` : ICON.cal;
  return `<div class="d-item">
    <div class="d-item__img">${img}</div>
    <div><p class="d-item__t">${esc(titulo)}</p><p class="d-item__s">${esc(sub)}</p><p class="d-item__p">${formatearPrecio(precioFinal(p))}<small>/mes</small></p></div>
    <button class="d-item__quitar" type="button" data-quitar="${p.id}" aria-label="Quitar ${esc(titulo)}">${ICON.x}</button>
  </div>`;
}

function renderDrawer() {
  const cont = document.getElementById('drawer-items');
  const pie = document.getElementById('drawer-pie');
  const total = document.getElementById('drawer-total');
  if (!cont) return;
  const items = Cart.get().map(i => getProducto(i.id)).filter(Boolean);
  cont.innerHTML = items.length ? items.map(itemDrawer).join('') : `<div class="drawer__vacio"><strong>Todavía no elegiste nada</strong>Elegí el programa de tu etapa o reservá una clase en vivo.<br><a class="btn btn--dark" href="#edades" data-cerrar-drawer>Ver clases por edad</a></div>`;
  if (pie) pie.hidden = !items.length;
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer() { renderDrawer(); abrirCapa(document.getElementById('drawer')); }

function syncBotones() {
  document.querySelectorAll('[data-inscribir], [data-reservar]').forEach(b => {
    const id = b.dataset.inscribir || b.dataset.reservar;
    const en = Cart.has(id);
    const label = b.dataset.label || b.textContent.trim();
    b.dataset.label = label;
    b.classList.toggle('is-added', en);
    b.textContent = en ? (b.dataset.inscribir ? 'En tu inscripción ✓' : 'Reservado ✓') : label;
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { e.preventDefault(); abrirPrograma(abrir.dataset.abrir, abrir.dataset.clase); return; }
    const insc = e.target.closest('[data-inscribir]');
    if (insc) {
      const p = getProducto(insc.dataset.inscribir);
      if (!p) return;
      Cart.add(p);
      const modal = document.getElementById('modal-prog');
      const previo = ultimoFoco;
      const desdeModal = modal && !modal.hidden;
      if (desdeModal) cerrarCapa(modal, false);
      abrirDrawer();
      if (desdeModal) ultimoFoco = previo;
      return;
    }
    const res = e.target.closest('[data-reservar]');
    if (res) {
      const v = getProducto(res.dataset.reservar);
      if (!v) return;
      if (Cart.add(v)) showToast(`Reservaste ${nombreVivo(v)} · ${v.id === UNO_A_UNO.id ? 'horario a coordinar' : `${v.dia} ${v.hora} h`}`);
      else showToast('Ese horario ya está en tu inscripción');
      return;
    }
    if (e.target.closest('[data-abrir-carrito]')) { abrirDrawer(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); renderDrawer(); return; }
    if (e.target.closest('[data-cerrar]')) { cerrarCapa(document.getElementById('modal-prog')); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarCapa(document.getElementById('drawer')); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción'); return; }
    if (e.target.closest('[data-ingresar]')) { showToast('El ingreso de alumnos con usuario y contraseña se activa al llevar la plataforma a producción'); }
  });
  document.addEventListener('keydown', e => {
    const abierta = document.querySelector('.modal.open, .drawer.open');
    if (!abierta) return;
    if (e.key === 'Escape') { cerrarCapa(abierta); return; }
    trapFoco(abierta, e);
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotones(); renderDrawer(); });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
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
  nav.querySelectorAll('a, [data-ingresar]').forEach(a => a.addEventListener('click', close));
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
  sync();
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(t => {
    const tabs = [...t.querySelectorAll('[role="tab"]')];
    const panels = [...t.querySelectorAll('.tabs__panel')];
    if (t.dataset.modo === 'pasos') {
      t.querySelector('[role="tablist"]')?.setAttribute('hidden', '');
      panels.forEach(p => { p.hidden = false; p.removeAttribute('role'); p.removeAttribute('aria-labelledby'); p.removeAttribute('tabindex'); });
      return;
    }
    const activar = (tab, foco) => {
      tabs.forEach(x => { const on = x === tab; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      panels.forEach(p => {
        const on = p.id === tab.getAttribute('aria-controls');
        p.hidden = !on;
        if (on) p.classList.add('in');
      });
      if (foco) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activar(tab));
      tab.addEventListener('keydown', e => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        activar(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
  });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const para = form.querySelector('#c-para');
    const interes = form.querySelector('#c-interes');
    const nombre = form.querySelector('#c-nombre').value.trim();
    if (!para.value) { para.focus(); para.setAttribute('aria-invalid', 'true'); showToast('Contanos para quién es el entrenamiento'); return; }
    para.removeAttribute('aria-invalid');
    const msg = `Hola Natalia! ${nombre ? `Soy ${nombre}. ` : ''}Quiero consultar por Vitamov: ${para.value}, ${interes.value}. ¿Me contás cómo empezar?`;
    window.open(waLink(msg), '_blank', 'noopener');
    showToast('Te llevamos a WhatsApp con tu consulta lista');
  });
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('programa');
  if (id && PROGRAMAS.some(p => p.id === id)) abrirPrograma(id);
}

renderProgramas();
renderEtapas();
renderHorarios();
initBiblioteca();
initReveals();
initNav();
initModelBarScroll();
initAcciones();
initFloats();
initTabs();
initConsulta();
syncBotones();
updateCartBadge();
initDeepLink();
