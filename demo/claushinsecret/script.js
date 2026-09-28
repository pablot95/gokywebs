const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));

const WSP = '5493487517529';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'coleccion-16x9.webp': [1672, 941],
  'secreto-9x16.webp': [941, 1672],
  'vitrina-1x1.webp': [1254, 1254],
  'obsidiana-1x1.webp': [1254, 1254],
  'oro-blanco-1x1.webp': [1254, 1254],
  'duo-1x1.webp': [1254, 1254],
};

const CATEGORIAS = [
  { id: 'ella', label: 'Para ella' },
  { id: 'el', label: 'Para él' },
  { id: 'compartido', label: 'Para los dos' },
  { id: 'regalos', label: 'Para regalar' },
];

const FAMILIAS = [
  { id: 'citrico', label: 'Cítrico', plural: 'cítricos', desde: 0 },
  { id: 'floral', label: 'Floral', plural: 'florales', desde: 25 },
  { id: 'amaderado', label: 'Amaderado', plural: 'amaderados', desde: 50 },
  { id: 'ambar', label: 'Ámbar', plural: 'ambarados', desde: 75 },
];

const CONC = {
  edt: { label: 'Eau de Toilette', corto: 'EDT' },
  edp: { label: 'Eau de Parfum', corto: 'EDP' },
  ext: { label: 'Extrait de Parfum', corto: 'Extrait' },
};

const PRODUCTOS = [
  {
    id: 1, slug: 'azahar', num: '01', nombre: 'Azahar', cat: 'ella', familia: 'citrico', conc: 'edt', intensidad: 10, horas: 5, orden: 7,
    tamanos: [{ ml: 50, precio: 38900 }, { ml: 100, precio: 54900 }], stock: 14, descuento: 0,
    notas: { salida: 'Bergamota y limón', corazon: 'Flor de azahar y neroli', fondo: 'Almizcle blanco' },
    desc: 'Limpio y luminoso, como abrir la ventana a la mañana. Para el día, el trabajo o después de la ducha.',
    img: 'coleccion-16x9.webp', foco: [0.83, 0.49, 2.3], galeria: [['vitrina-1x1.webp', [0.87, 0.42, 3]]],
    alt: 'Frasco cuadrado de vidrio tallado con perfume dorado y tapa dorada',
  },
  {
    id: 2, slug: 'cristal', num: '02', nombre: 'Cristal', cat: 'compartido', familia: 'citrico', conc: 'edt', intensidad: 18, horas: 5, orden: 10,
    tamanos: [{ ml: 50, precio: 38900 }, { ml: 100, precio: 54900 }], stock: 12, descuento: 0,
    notas: { salida: 'Pomelo y té verde', corazon: 'Hojas de higuera', fondo: 'Cedro blanco' },
    desc: 'Verde y transparente: pomelo, té y madera clara. Para compartir el frasco.',
    img: 'vitrina-1x1.webp', foco: [0.505, 0.33, 2.3], galeria: [],
    alt: 'Frasco alto de cristal con tapa facetada transparente',
  },
  {
    id: 3, slug: 'obsidiana', num: '03', nombre: 'Obsidiana', cat: 'el', familia: 'citrico', conc: 'edt', intensidad: 26, horas: 5, orden: 8,
    tamanos: [{ ml: 50, precio: 41900 }, { ml: 100, precio: 58900 }], stock: 16, descuento: 0,
    notas: { salida: 'Pomelo y menta', corazon: 'Lavanda y salvia', fondo: 'Cedro y vetiver' },
    desc: 'La cara fresca de la línea negra: pomelo y lavanda sobre cedro. Para todos los días.',
    img: 'vitrina-1x1.webp', foco: [0.2, 0.37, 2.6], galeria: [['coleccion-16x9.webp', [0.18, 0.35, 2]]],
    alt: 'Frasco negro rectangular con tapa facetada negra y dorada',
  },
  {
    id: 4, slug: 'nacar', num: '04', nombre: 'Nácar', cat: 'ella', familia: 'floral', conc: 'edt', intensidad: 34, horas: 5, orden: 5,
    tamanos: [{ ml: 50, precio: 41900 }, { ml: 100, precio: 58900 }], stock: 11, descuento: 0,
    notas: { salida: 'Pera y lichi', corazon: 'Peonía y fresia', fondo: 'Almizcle y madera clara' },
    desc: 'Frutal y floral, suave sin ser tímido: peonía y pera sobre un fondo de almizcle.',
    img: 'coleccion-16x9.webp', foco: [0.42, 0.33, 1.85], galeria: [],
    alt: 'Frasco alto de cristal con perfume dorado claro y tapa transparente',
  },
  {
    id: 5, slug: 'oro-blanco', num: '05', nombre: 'Oro Blanco', cat: 'ella', familia: 'floral', conc: 'edp', intensidad: 46, horas: 7, orden: 2,
    tamanos: [{ ml: 50, precio: 51900 }, { ml: 100, precio: 72900 }], stock: 18, descuento: 0,
    notas: { salida: 'Mandarina y pimienta rosa', corazon: 'Jazmín y tuberosa', fondo: 'Sándalo y almizcle' },
    desc: 'Flores blancas sobre un fondo tibio de sándalo: se nota sin invadir.',
    img: 'oro-blanco-1x1.webp', foco: [0.5, 0.47, 1.55], galeria: [['duo-1x1.webp', [0.655, 0.53, 1.8]]],
    alt: 'Frasco redondo de vidrio con perfume dorado entre flores blancas',
  },
  {
    id: 6, slug: 'obsidiana-intenso', num: '06', nombre: 'Obsidiana Intenso', cat: 'el', familia: 'amaderado', conc: 'edp', intensidad: 58, horas: 7, orden: 3,
    tamanos: [{ ml: 50, precio: 53900 }, { ml: 100, precio: 76900 }], stock: 15, descuento: 0,
    notas: { salida: 'Pimienta negra y cardamomo', corazon: 'Iris y cuero', fondo: 'Vetiver y ámbar gris' },
    desc: 'Pimienta negra, iris y cuero sobre vetiver. Seco, elegante y de noche.',
    img: 'obsidiana-1x1.webp', foco: [0.49, 0.47, 1.45], galeria: [['duo-1x1.webp', [0.33, 0.47, 1.7]]],
    alt: 'Frasco negro rectangular sobre mármol blanco con vetas doradas',
  },
  {
    id: 7, slug: 'eclipse', num: '07', nombre: 'Eclipse', cat: 'el', familia: 'amaderado', conc: 'edp', intensidad: 68, horas: 7, orden: 6,
    tamanos: [{ ml: 50, precio: 55900 }, { ml: 100, precio: 78900 }], stock: 9, descuento: 0,
    notas: { salida: 'Cardamomo y bergamota', corazon: 'Cedro y cuero', fondo: 'Vetiver y pachulí' },
    desc: 'Maderas y cuero con un toque de cardamomo. Profundo, para los días fríos.',
    img: 'coleccion-16x9.webp', foco: [0.66, 0.41, 1.9], galeria: [['vitrina-1x1.webp', [0.675, 0.46, 2.2]]],
    alt: 'Frasco negro alto con cuello dorado',
  },
  {
    id: 8, slug: 'oro-noche', num: '08', nombre: 'Oro Noche', cat: 'ella', familia: 'ambar', conc: 'edp', intensidad: 78, horas: 8, orden: 9,
    tamanos: [{ ml: 50, precio: 55900 }, { ml: 100, precio: 78900 }], stock: 6, descuento: 0,
    notas: { salida: 'Ciruela y mandarina', corazon: 'Rosa y orquídea', fondo: 'Vainilla, ámbar y pachulí' },
    desc: 'Ciruela y rosa sobre vainilla y ámbar: la versión de noche de la línea dorada.',
    img: 'coleccion-16x9.webp', foco: [0.26, 0.55, 2.2], galeria: [['vitrina-1x1.webp', [0.33, 0.56, 2.6]]],
    alt: 'Frasco redondo dorado con tapa negra',
  },
  {
    id: 9, slug: 'secreto', num: '00', nombre: 'Secreto', cat: 'compartido', familia: 'ambar', conc: 'edp', intensidad: 84, horas: 8, orden: 1, firma: true,
    tamanos: [{ ml: 50, precio: 58900 }, { ml: 100, precio: 84900 }], stock: 20, descuento: 0,
    notas: { salida: 'Bergamota y pimienta rosa', corazon: 'Rosa y jazmín', fondo: 'Ámbar, vainilla y sándalo' },
    desc: 'Arranca fresco, se abre en flores y termina en ámbar y vainilla. La firma de la casa, para él y para ella.',
    img: 'secreto-9x16.webp', foco: [0.5, 0.52, 1.25], galeria: [],
    alt: 'Frasco de vidrio tallado dorado con tapa octogonal dorada',
  },
  {
    id: 10, slug: 'gema', num: '09', nombre: 'Gema', cat: 'el', familia: 'ambar', conc: 'ext', intensidad: 96, horas: 9, orden: 4,
    tamanos: [{ ml: 50, precio: 89900 }], stock: 3, descuento: 0,
    notas: { salida: 'Azafrán', corazon: 'Rosa y oud', fondo: 'Ámbar y pachulí' },
    desc: 'Azafrán, rosa y oud en concentración Extrait. Con pocas gotas alcanza.',
    img: 'coleccion-16x9.webp', foco: [0.535, 0.64, 2.3], galeria: [['vitrina-1x1.webp', [0.715, 0.69, 2.9]]],
    alt: 'Frasco negro facetado como una gema, con tapa negra y dorada',
  },
  {
    id: 11, slug: 'duo-el-y-ella', num: '', nombre: 'Dúo Él y Ella', cat: 'regalos', familia: null, conc: null, intensidad: null, orden: 11,
    presentacion: '2 × 50 ml', tamanos: [{ ml: 0, precio: 94900 }], stock: 7, descuento: 0, incluye: [{ id: 6, ml: 50 }, { id: 5, ml: 50 }],
    desc: 'Obsidiana Intenso y Oro Blanco en 50 ml, en su caja con cinta dorada. Para regalar de a dos.',
    img: 'duo-1x1.webp', foco: [0.5, 0.5, 1], galeria: [['duo-1x1.webp', [0.8, 0.42, 1.7]]],
    alt: 'Un frasco negro y uno dorado junto a una caja de regalo blanca con cinta dorada',
  },
  {
    id: 12, slug: 'set-descubrimiento', num: '', nombre: 'Set Descubrimiento', cat: 'regalos', familia: null, conc: null, intensidad: null, orden: 12,
    presentacion: '10 × 10 ml', tamanos: [{ ml: 0, precio: 46900 }], stock: 10, descuento: 0,
    desc: 'Las diez fragancias en frascos de 10 ml, para probarlas en tu piel antes de elegir tu frasco.',
    img: 'vitrina-1x1.webp', foco: [0.5, 0.5, 1], galeria: [],
    alt: 'Colección de frascos negros y dorados sobre escalones de mármol',
  },
];

const RAIL = [9, 5, 6, 4, 10, 1];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const esFragancia = p => !!p?.familia;
const FRAGANCIAS = PRODUCTOS.filter(esFragancia);
const catDe = id => CATEGORIAS.find(c => c.id === id) || { id, label: id };
const familiaDe = id => FAMILIAS.find(f => f.id === id);
const mlDefault = p => p.tamanos[p.tamanos.length - 1].ml;
const tamanoDe = (p, ml) => p.tamanos.find(t => t.ml === Number(ml));
const conDescuento = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100)) : precio);
const precioDe = (p, ml = mlDefault(p)) => conDescuento(p, (tamanoDe(p, ml) || p.tamanos[p.tamanos.length - 1]).precio);
const precioDesde = p => Math.min(...p.tamanos.map(t => conDescuento(p, t.precio)));
const tamanoLabel = (p, ml) => (Number(ml) ? `${ml} ml` : p.presentacion);
const numLabel = p => (p.num ? `Nº ${p.num}` : 'Estuche');
const ahorroDe = p => (p.incluye ? p.incluye.reduce((s, i) => s + precioDe(getProducto(i.id), i.ml), 0) - precioDe(p) : 0);
const metaCorta = p => (esFragancia(p) ? `${familiaDe(p.familia).label} · ${CONC[p.conc].corto}` : 'Estuche · Para regalar');
const metaLarga = p => (esFragancia(p) ? `${familiaDe(p.familia).label} · ${CONC[p.conc].label} · ${catDe(p.cat).label}` : `Estuche de ${p.presentacion} · ${catDe(p.cat).label}`);
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const Cart = {
  KEY: 'claushinsecret_cart',
  enMemoria: null,
  leer() {
    if (this.enMemoria) return this.enMemoria.map(i => ({ ...i }));
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  get() {
    const crudo = this.leer();
    if (!Array.isArray(crudo)) return [];
    return crudo.reduce((lista, i) => {
      const p = getProducto(i?.id);
      const qty = Math.floor(Number(i?.qty));
      if (!p || !tamanoDe(p, i.ml) || !(qty > 0) || p.stock <= 0) return lista;
      lista.push({ id: p.id, ml: Number(i.ml), qty: Math.min(qty, p.stock) });
      return lista;
    }, []);
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); this.enMemoria = null; } catch { this.enMemoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, ml = mlDefault(producto)) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.ml === Number(ml));
    const antes = existing ? existing.qty : 0;
    const despues = Math.min(antes + qty, producto.stock ?? 99);
    if (despues <= antes) return 0;
    if (existing) existing.qty = despues;
    else items.push({ id: producto.id, ml: Number(ml), qty: despues });
    this.save(items);
    return despues - antes;
  },
  setQty(id, ml, qty) {
    const items = this.get();
    const it = items.find(i => i.id === Number(id) && i.ml === Number(ml));
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, ml) { this.save(this.get().filter(i => !(i.id === Number(id) && i.ml === Number(ml)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && tamanoDe(p, i.ml) ? s + precioDe(p, i.ml) * i.qty : s; }, 0); },
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1000px)');
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

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  revealsListos = true;
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

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => el.classList.add('in'), 500);
  });
}

let ultimoFoco = null;
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

const scrollSuave = el => el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initRecortesEstaticos() {
  document.querySelectorAll('[data-recorte]').forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    const r = el.getBoundingClientRect();
    const ar = r.width && r.height ? r.width / r.height : 1;
    el.setAttribute('style', recorte(img, [Number(cx), Number(cy), Number(z)], ar));
  });
}

function initCuentas() {
  const frag = c => FRAGANCIAS.filter(p => p.cat === c);
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const id = el.dataset.cuentaCat;
    const n = PRODUCTOS.filter(p => p.cat === id).length;
    el.textContent = id === 'regalos' ? cuantos(n, 'estuche', 'estuches') : cuantos(n, 'perfume', 'perfumes');
  });
  document.querySelectorAll('[data-cuenta-link]').forEach(el => {
    const id = el.dataset.cuentaLink;
    const n = PRODUCTOS.filter(p => p.cat === id).length;
    el.textContent = id === 'regalos' ? `Ver ${n === 1 ? 'el estuche' : `los ${n} estuches`}` : `Ver ${n === 1 ? 'el perfume' : `los ${n} perfumes`}`;
  });
  document.querySelectorAll('[data-puerta-dato]').forEach(el => {
    const lista = frag(el.dataset.puertaDato);
    if (!lista.length) return;
    el.textContent = `${catDe(el.dataset.puertaDato).label} · ${cuantos(lista.length, 'perfume', 'perfumes')} · desde ${formatearPrecio(Math.min(...lista.map(precioDesde)))}`;
  });
  document.querySelectorAll('[data-total-fragancias]').forEach(el => { el.textContent = FRAGANCIAS.length; });
  document.querySelectorAll('[data-total-estuches]').forEach(el => { el.textContent = PRODUCTOS.length - FRAGANCIAS.length; });
}

function notasHTML(p) {
  if (!esFragancia(p)) {
    const inc = p.incluye ? p.incluye.map(i => `${getProducto(i.id).nombre} ${i.ml} ml`).join(' y ') : `Las ${FRAGANCIAS.length} fragancias en 10 ml`;
    return `<span class="notas-hover" aria-hidden="true"><span><b>Incluye</b>${esc(inc)}</span></span>`;
  }
  return `<span class="notas-hover" aria-hidden="true"><span><b>Salida</b>${esc(p.notas.salida)}</span><span><b>Corazón</b>${esc(p.notas.corazon)}</span><span><b>Fondo</b>${esc(p.notas.fondo)}</span></span>`;
}

function badgeHTML(p) {
  if (p.stock <= 0) return '<span class="prod-badge">Sin stock</span>';
  if (p.firma) return '<span class="prod-badge firma">La firma</span>';
  if (p.stock > 0 && p.stock <= 3) return '<span class="prod-badge">Últimas unidades</span>';
  const ahorro = ahorroDe(p);
  if (ahorro > 0) return `<span class="prod-badge">Ahorrás ${formatearPrecio(ahorro)}</span>`;
  if (p.descuento > 0) return `<span class="prod-badge">-${p.descuento}%</span>`;
  return '';
}

function precioHTML(p, ml = mlDefault(p)) {
  const t = tamanoDe(p, ml);
  return `${p.descuento > 0 ? `<s>${formatearPrecio(t.precio)}</s>` : ''}<span>${formatearPrecio(precioDe(p, ml))}</span><small>${esc(tamanoLabel(p, ml))}</small>`;
}

function cardHTML(p) {
  const ml = mlDefault(p);
  return `<article class="prod" data-animate style="opacity:0;transform:translateY(28px)">
    <button type="button" class="prod-media recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, 1)}" aria-label="Ver ${esc(p.nombre)}">
      <span class="etiqueta">${esc(numLabel(p))}</span>
      ${badgeHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="600">
      ${notasHTML(p)}
    </button>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${esc(metaCorta(p))}</p>
      <p class="precio">${precioHTML(p, ml)}</p>
      <div class="prod-actions">
        ${p.stock > 0 ? `<button type="button" class="btn btn-ghost prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} ${esc(tamanoLabel(p, ml))} al carrito"><span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span></button>` : '<button type="button" class="btn btn-ghost prod-add" disabled>Sin stock</button>'}
      </div>
    </div>
  </article>`;
}

function railCardHTML(p) {
  const ml = mlDefault(p);
  return `<article class="rail-card">
    <button type="button" class="rail-media recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, 0.8)}" aria-label="Ver ${esc(p.nombre)}">
      <span class="etiqueta">${esc(numLabel(p))}</span>
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="480" height="600">
      ${notasHTML(p)}
    </button>
    <div class="rail-body">
      <h3 class="rail-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${esc(metaLarga(p))}</p>
      <div class="rail-fila">
        <p class="precio">${precioHTML(p, ml)}</p>
        <button type="button" class="btn btn-ghost btn-mini" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} ${esc(tamanoLabel(p, ml))} al carrito">Agregar</button>
      </div>
    </div>
  </article>`;
}

function agregar(p, qty = 1, ml = mlDefault(p)) {
  if (!p) return 0;
  const nombre = `${p.nombre}${Number(ml) ? ` ${ml} ml` : ''}`;
  if (p.stock <= 0) { showToast(`${p.nombre} está sin stock por ahora`); return 0; }
  const n = Cart.add(p, qty, ml);
  showToast(n ? `Sumaste ${n > 1 ? `${n} × ` : ''}${nombre} al carrito` : `Ya tenés en el carrito todas las unidades de ${nombre}`);
  return n;
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  track.innerHTML = RAIL.map(getProducto).filter(Boolean).map(railCardHTML).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = null; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { if (pointerId !== null) vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (moved) {
      requestAnimationFrame(() => vp.classList.remove('dragging'));
      setTimeout(() => { moved = false; }, 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => {
    const card = track.querySelector('.rail-card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 24;
    return card ? card.getBoundingClientRect().width + gap : 300;
  };
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 4;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 4;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

const Filtro = { cats: new Set(), familias: new Set(), concs: new Set(), precioMax: null, q: '', orden: 'destacados' };
const PAGINA = 16;
let visibles = PAGINA;
const Catalogo = {};

function textoCorto(p) {
  const partes = [p.nombre, numLabel(p), catDe(p.cat).label];
  if (esFragancia(p)) partes.push(familiaDe(p.familia).label, CONC[p.conc].corto);
  return normalizar(partes.join(' '));
}

function textoBusqueda(p) {
  const partes = [textoCorto(p), p.desc, p.presentacion];
  if (esFragancia(p)) partes.push(familiaDe(p.familia).plural, CONC[p.conc].label, p.notas.salida, p.notas.corazon, p.notas.fondo);
  else partes.push('regalo estuche set caja');
  return normalizar(partes.filter(Boolean).join(' '));
}

function coincide(p, w) {
  if (w.length > 2) return textoBusqueda(p).includes(w);
  return textoCorto(p).split(/[^a-z0-9]+/).includes(w);
}

function filtrar() {
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (Filtro.cats.size && !Filtro.cats.has(p.cat)) return false;
    if (Filtro.familias.size && !Filtro.familias.has(p.familia)) return false;
    if (Filtro.concs.size && !Filtro.concs.has(p.conc)) return false;
    if (Filtro.precioMax && precioDe(p) > Filtro.precioMax) return false;
    if (palabras.length && !palabras.every(w => coincide(p, w))) return false;
    return true;
  });
  if (Filtro.orden === 'precio-asc') lista = [...lista].sort((a, b) => precioDe(a) - precioDe(b));
  else if (Filtro.orden === 'precio-desc') lista = [...lista].sort((a, b) => precioDe(b) - precioDe(a));
  else if (Filtro.orden === 'intensidad') lista = [...lista].sort((a, b) => (a.intensidad ?? 999) - (b.intensidad ?? 999));
  else lista = [...lista].sort((a, b) => a.orden - b.orden);
  return lista;
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const filtros = root.querySelector('.filtros');
  const resultados = root.querySelector('[data-resultados]');
  const buscador = root.querySelector('[data-buscador]');
  const orden = root.querySelector('[data-orden]');
  const vermas = root.querySelector('[data-vermas]');
  const inicio = root.querySelector('[data-catalogo-inicio]');
  const precio = root.querySelector('[data-precio]');
  const precioValor = root.querySelector('[data-precio-valor]');
  const verResultados = root.querySelector('[data-ver-resultados]');

  const opcion = (grupo, id, label, n) => `<label class="filtro-opcion"><input type="checkbox" data-f="${grupo}" value="${id}"> ${esc(label)}<em>${n}</em></label>`;
  root.querySelector('[data-grupo="cat"]').innerHTML = CATEGORIAS.map(c => opcion('cat', c.id, c.label, PRODUCTOS.filter(p => p.cat === c.id).length)).join('');
  root.querySelector('[data-grupo="familia"]').innerHTML = FAMILIAS.map(f => opcion('familia', f.id, f.label, FRAGANCIAS.filter(p => p.familia === f.id).length)).join('');
  root.querySelector('[data-grupo="conc"]').innerHTML = Object.entries(CONC).map(([id, c]) => opcion('conc', id, c.label, FRAGANCIAS.filter(p => p.conc === id).length)).join('');

  const precios = PRODUCTOS.map(p => precioDe(p));
  const pMin = Math.ceil(Math.min(...precios) / 1000) * 1000;
  const pMax = Math.ceil(Math.max(...precios) / 1000) * 1000;
  precio.min = pMin; precio.max = pMax; precio.step = 1000; precio.value = pMax;
  const pintarPrecio = () => {
    precioValor.textContent = `Hasta ${formatearPrecio(Number(precio.value))}`;
    precio.style.setProperty('--pct', `${((Number(precio.value) - pMin) / (pMax - pMin)) * 100}%`);
  };
  pintarPrecio();

  const sets = { cat: 'cats', familia: 'familias', conc: 'concs' };
  const leer = () => {
    Object.entries(sets).forEach(([g, k]) => { Filtro[k] = new Set([...root.querySelectorAll(`input[data-f="${g}"]:checked`)].map(i => i.value)); });
    Filtro.precioMax = Number(precio.value) < pMax ? Number(precio.value) : null;
  };
  const escribir = () => {
    Object.entries(sets).forEach(([g, k]) => { root.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = Filtro[k].has(i.value); }); });
    precio.value = Filtro.precioMax || pMax;
    pintarPrecio();
    if (buscador) buscador.value = Filtro.q;
    if (orden) orden.value = Filtro.orden;
  };

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    const lista = filtrar();
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;
    if (verResultados) verResultados.textContent = `Ver ${cuantos(lista.length, 'producto', 'productos')}`;
    if (!lista.length) {
      grid.innerHTML = '<div class="catalogo-vacio"><b>No encontramos esa fragancia</b><span>Probá con otra nota o limpiá los filtros.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver todas</button></div>';
      vermas.hidden = true;
      refrescarTriggers();
      return;
    }
    grid.innerHTML = lista.slice(0, visibles).map(cardHTML).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más fragancias (${lista.length - Math.min(visibles, lista.length)})`;
    revelarNuevos(grid);
    refrescarTriggers();
  };

  const limpiar = () => {
    Filtro.cats.clear(); Filtro.familias.clear(); Filtro.concs.clear(); Filtro.precioMax = null; Filtro.q = ''; Filtro.orden = 'destacados';
    escribir(); render(true);
  };

  root.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leer(); render(true); } });
  precio.addEventListener('input', () => { pintarPrecio(); leer(); render(true); });
  root.querySelector('.filtros-limpiar')?.addEventListener('click', limpiar);
  grid.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) limpiar(); });
  buscador?.addEventListener('input', () => { Filtro.q = buscador.value; render(true); });
  buscador?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = buscador.value; render(true); });
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });

  const toggle = root.querySelector('.filtros-toggle');
  const cerrar = root.querySelector('.filtros-cerrar');
  let fondo = null;
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); fondo?.remove(); fondo = null; document.body.classList.remove('no-scroll');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  const abrirFiltros = () => {
    filtros.classList.add('open'); document.body.classList.add('no-scroll'); toggle?.setAttribute('aria-expanded', 'true');
    fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; fondo.addEventListener('click', cerrarFiltros); document.body.appendChild(fondo);
    trapFocus(filtros); cerrar?.focus();
  };
  toggle?.addEventListener('click', abrirFiltros);
  cerrar?.addEventListener('click', () => { cerrarFiltros(); toggle?.focus(); });
  verResultados?.addEventListener('click', () => { cerrarFiltros(); scrollSuave(inicio); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) { cerrarFiltros(); toggle?.focus(); } });

  Catalogo.render = render;
  Catalogo.irA = () => scrollSuave(inicio);
  Catalogo.aplicar = ({ cats = [], familias = [] } = {}) => {
    Filtro.cats = new Set(cats); Filtro.familias = new Set(familias); Filtro.concs.clear(); Filtro.precioMax = null; Filtro.q = '';
    escribir(); render(true); scrollSuave(inicio);
  };
  Catalogo.categoria = id => Catalogo.aplicar({ cats: [id] });
  Catalogo.buscar = () => { scrollSuave(inicio); setTimeout(() => buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 500); };

  render(true);
}

const ZONAS_CATS = { ella: ['ella', 'compartido'], el: ['el', 'compartido'], todos: ['ella', 'el', 'compartido'] };
const familiaDeValor = v => [...FAMILIAS].reverse().find(f => v >= f.desde) || FAMILIAS[0];

function recomendar(para, valor) {
  const cats = ZONAS_CATS[para] || ZONAS_CATS.todos;
  const candidatos = FRAGANCIAS.filter(p => cats.includes(p.cat) && p.stock > 0);
  const zona = familiaDeValor(valor);
  const deZona = candidatos.filter(p => p.familia === zona.id);
  const castigo = p => (para !== 'todos' && p.cat === 'compartido' ? 6 : 0);
  const prod = [...(deZona.length ? deZona : candidatos)].sort((a, b) => {
    const da = Math.abs(a.intensidad - valor) + castigo(a);
    const db = Math.abs(b.intensidad - valor) + castigo(b);
    return da - db || b.intensidad - a.intensidad;
  })[0];
  return { prod, candidatos, cats, sinZona: !deZona.length };
}

function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const rango = g.querySelector('[data-guia-rango]');
  const salida = g.querySelector('[data-guia-familia]');
  const res = g.querySelector('[data-guia-resultado]');
  const escala = [...g.querySelectorAll('.guia-escala span')];
  let actual = null;
  const para = () => g.querySelector('input[name="guia-para"]:checked')?.value || 'todos';
  const pintar = () => {
    const v = Number(rango.value);
    rango.style.setProperty('--pct', `${v}%`);
    const zona = familiaDeValor(v);
    salida.textContent = zona.label;
    escala.forEach((s, i) => s.classList.toggle('activa', FAMILIAS[i] === zona));
    const { prod, candidatos, cats, sinZona } = recomendar(para(), v);
    if (!prod) return;
    const fam = familiaDe(prod.familia);
    const parecidos = candidatos.filter(p => p.familia === prod.familia).length;
    actual = { prod, cats, familia: prod.familia };
    const ml = mlDefault(prod);
    const aviso = sinZona ? `<p class="guia-res-aviso">${esc(para() === 'todos' ? 'No hay' : `${catDe(para()).label} no hay`)} ${esc(zona.plural)} por ahora: este es el más cercano.</p>` : '';
    const msg = `Hola! La guía me recomendó ${prod.nombre} (${fam.label}, ${CONC[prod.conc].label}). ¿Me contás más?`;
    res.innerHTML = `<p class="kicker">Te recomendamos</p>
      <div class="guia-res-top">
        <button type="button" class="guia-res-media recorte" data-open-quickview="${prod.id}" style="${recorte(prod.img, prod.foco, 1)}" aria-label="Ver ${esc(prod.nombre)}"><img src="images/${prod.img}" alt="${esc(prod.alt)}" width="240" height="240"></button>
        <div class="guia-res-info">
          <span class="etiqueta">${esc(numLabel(prod))}</span>
          <p class="guia-res-nombre">${esc(prod.nombre)}</p>
          <p class="meta">${esc(metaLarga(prod))}</p>
        </div>
      </div>
      ${aviso}
      <ul class="guia-res-notas"><li><b>Salida</b>${esc(prod.notas.salida)}</li><li><b>Corazón</b>${esc(prod.notas.corazon)}</li><li><b>Fondo</b>${esc(prod.notas.fondo)}</li></ul>
      <p class="meta">Dura unas ${prod.horas} h en la piel (estimado)</p>
      <div class="guia-res-acciones">
        <p class="precio">${precioHTML(prod, ml)}</p>
        <button type="button" class="btn btn-cta" data-add="${prod.id}" aria-label="Agregar ${esc(prod.nombre)} ${ml} ml al carrito">Agregar al carrito</button>
      </div>
      <div class="guia-res-links">
        <button type="button" class="link" data-guia-ver>${parecidos > 1 ? `Ver los ${parecidos} ${esc(fam.plural)}` : 'Verlo en el catálogo'}</button>
        <a class="link" href="${wspHref(msg)}" target="_blank" rel="noopener">¿Dudas? Te asesoramos</a>
      </div>`;
  };
  rango.addEventListener('input', pintar);
  g.addEventListener('change', e => { if (e.target.name === 'guia-para') pintar(); });
  res.addEventListener('click', e => {
    if (e.target.closest('[data-guia-ver]') && actual && Catalogo.aplicar) Catalogo.aplicar({ cats: actual.cats, familias: [actual.familia] });
  });
  pintar();
}

function initBanner() {
  const b = document.querySelector('[data-banner]');
  if (!b) return;
  const msgs = [...b.querySelectorAll('[data-msg]')];
  const n = b.querySelector('[data-banner-n]');
  if (msgs.length < 2) return;
  let i = 0;
  let pausado = false;
  const ir = k => {
    i = (k + msgs.length) % msgs.length;
    msgs.forEach((m, j) => {
      const on = j === i;
      m.classList.toggle('is-active', on);
      m.toggleAttribute('inert', !on);
      if (on) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true');
    });
    b.dataset.msgActivo = String(i);
    if (n) n.textContent = String(i + 1).padStart(2, '0');
  };
  b.querySelector('[data-banner-prev]')?.addEventListener('click', () => ir(i - 1));
  b.querySelector('[data-banner-next]')?.addEventListener('click', () => ir(i + 1));
  b.addEventListener('mouseenter', () => { pausado = true; });
  b.addEventListener('mouseleave', () => { pausado = false; });
  b.addEventListener('focusin', () => { pausado = true; });
  b.addEventListener('focusout', () => { pausado = false; });
  if (!reduceMotion) window.setInterval(() => { if (!pausado && !document.hidden && b.getBoundingClientRect().bottom > 0) ir(i + 1); }, 6500);
}

const TRAMOS = [[0, 0], [0.2, 15], [0.6, 180], [1, 480]];
function minutosDe(t) {
  for (let k = 1; k < TRAMOS.length; k++) {
    const [t1, m1] = TRAMOS[k];
    const [t0, m0] = TRAMOS[k - 1];
    if (t <= t1) return m0 + (m1 - m0) * ((t - t0) / (t1 - t0));
  }
  return 480;
}
function tiempoTxt(m) {
  const r = Math.round(m);
  if (r < 60) return `${r} min`;
  const h = Math.floor(r / 60);
  const mm = Math.round((r - h * 60) / 5) * 5;
  return mm && mm < 60 ? `${h} h ${String(mm).padStart(2, '0')} min` : `${mm >= 60 ? h + 1 : h} h`;
}
const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function initSecreto() {
  const sec = document.querySelector('[data-secreto]');
  if (!sec) return;
  const copy = sec.querySelector('[data-secreto-copy]');
  const reloj = sec.querySelector('[data-reloj]');
  const capas = [...sec.querySelectorAll('[data-capa]')];
  const puertas = [...sec.querySelectorAll('[data-puerta]')];
  const p = getProducto(9);
  const precio = sec.querySelector('[data-secreto-precio]');
  if (p && precio) precio.textContent = formatearPrecio(precioDe(p, 100));
  const marcarCapa = m => {
    const k = m < 15 ? 0 : m < 180 ? 1 : 2;
    capas.forEach((li, j) => li.classList.toggle('activa', j === k));
  };
  if (reduceMotion) {
    sec.classList.add('is-static');
    reloj.textContent = tiempoTxt(480);
    marcarCapa(480);
    return;
  }
  const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const pintar = pr => {
    const o = suave(clamp01((pr - 0.03) / 0.37));
    sec.style.setProperty('--o', o.toFixed(4));
    sec.style.setProperty('--pc', clamp01(1 - o * 1.6).toFixed(3));
    const c = clamp01((pr - 0.16) / 0.2);
    sec.style.setProperty('--c', c.toFixed(3));
    copy.style.pointerEvents = c < 0.6 ? 'none' : '';
    copy.toggleAttribute('inert', c < 0.6);
    puertas.forEach(d => {
      d.style.pointerEvents = o > 0.12 ? 'none' : '';
      d.style.visibility = o > 0.995 ? 'hidden' : '';
    });
    const m = minutosDe(clamp01((pr - 0.3) / 0.58));
    reloj.textContent = tiempoTxt(m);
    marcarCapa(m);
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = sec.getBoundingClientRect();
    const total = r.height - (window.innerHeight - OFF);
    pintar(total > 0 ? clamp01((OFF - r.top) / total) : 0);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', update);
  update();
}

function openQuickview(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  let ml = mlDefault(p);
  let cant = 1;
  const vistas = [[p.img, p.foco], ...(p.galeria || [])];
  const media = modal.querySelector('[data-qv-media]');
  const thumbs = modal.querySelector('[data-qv-thumbs]');
  const verVista = k => {
    const [img, foco] = vistas[k];
    media.setAttribute('style', recorte(img, foco, 1));
    media.innerHTML = `<img src="images/${img}" alt="${esc(p.alt)}" width="700" height="700">`;
    thumbs.querySelectorAll('[data-qv-vista]').forEach((t, j) => t.setAttribute('aria-current', String(j === k)));
  };
  thumbs.innerHTML = vistas.length > 1 ? vistas.map(([img, foco], k) => `<button type="button" class="qv-thumb recorte" data-qv-vista="${k}" style="${recorte(img, foco, 1)}" aria-label="Ver la foto ${k + 1} de ${vistas.length}"><img src="images/${img}" alt="" width="128" height="128"></button>`).join('') : '';
  thumbs.onclick = e => { const b = e.target.closest('[data-qv-vista]'); if (b) verVista(Number(b.dataset.qvVista)); };
  verVista(0);

  modal.querySelector('[data-qv-num]').textContent = numLabel(p);
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-meta]').textContent = metaLarga(p);
  modal.querySelector('[data-qv-desc]').textContent = p.desc;
  const notas = modal.querySelector('[data-qv-notas]');
  const dura = modal.querySelector('[data-qv-dura]');
  if (esFragancia(p)) {
    notas.hidden = false;
    notas.innerHTML = `<li><b>Salida</b>${esc(p.notas.salida)}</li><li><b>Corazón</b>${esc(p.notas.corazon)}</li><li><b>Fondo</b>${esc(p.notas.fondo)}</li>`;
    dura.textContent = `Dura unas ${p.horas} h en la piel (estimado: cambia con cada piel).`;
  } else {
    notas.hidden = !p.incluye;
    notas.innerHTML = p.incluye ? p.incluye.map(i => `<li><b>Incluye</b>${esc(getProducto(i.id).nombre)} · ${i.ml} ml</li>`).join('') : '';
    const ahorro = ahorroDe(p);
    dura.textContent = ahorro > 0 ? `Ahorrás ${formatearPrecio(ahorro)} frente a comprarlos por separado.` : `Trae ${FRAGANCIAS.length} frascos de 10 ml, uno por fragancia.`;
  }
  const tamanos = modal.querySelector('[data-qv-tamanos]');
  const precioEl = modal.querySelector('[data-qv-precio]');
  const cantEl = modal.querySelector('[data-qv-cant]');
  const pintarCompra = () => {
    tamanos.querySelectorAll('[data-qv-ml]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.qvMl) === ml)));
    precioEl.innerHTML = precioHTML(p, ml);
    cantEl.textContent = cant;
    modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por ${p.nombre} (${tamanoLabel(p, ml)}).`);
  };
  tamanos.hidden = p.tamanos.length < 2;
  tamanos.innerHTML = p.tamanos.map(t => `<button type="button" class="qv-tamano" data-qv-ml="${t.ml}" aria-pressed="false"><b>${esc(tamanoLabel(p, t.ml))}</b><span>${formatearPrecio(conDescuento(p, t.precio))}</span></button>`).join('');
  tamanos.onclick = e => { const b = e.target.closest('[data-qv-ml]'); if (b) { ml = Number(b.dataset.qvMl); pintarCompra(); } };
  modal.querySelectorAll('[data-qv-step]').forEach(b => { b.onclick = () => { cant = Math.max(1, Math.min(p.stock, cant + Number(b.dataset.qvStep))); pintarCompra(); }; });
  modal.querySelector('[data-qv-add]').onclick = () => { agregar(p, cant, ml); closeQuickview(); };
  modal.querySelector('[data-qv-comprar]').onclick = () => { Cart.add(p, cant, ml); closeQuickview(); openCartDrawer(); };
  pintarCompra();

  const rel = PRODUCTOS.filter(x => x.id !== p.id && (x.familia && x.familia === p.familia)).concat(PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat && x.familia !== p.familia)).filter((x, k, arr) => arr.indexOf(x) === k).slice(0, 3);
  modal.querySelector('[data-qv-rel]').innerHTML = rel.map(x => `<button type="button" class="qv-rel" data-open-quickview="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="200" height="200"></span><span>${esc(x.nombre)}</span><span class="meta">${formatearPrecio(precioDe(x))}</span></button>`).join('');
  modal.querySelector('.qv-relacionados').hidden = !rel.length;

  if (modal.hidden) {
    modal.hidden = false;
    trapFocus(modal);
    document.body.classList.add('no-scroll');
    modal.querySelector('.quickview-cerrar')?.focus();
  } else {
    modal.querySelector('.quickview-panel').scrollTop = 0;
  }
}

function closeQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });
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

function renderCart() {
  const itemsEl = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (!itemsEl) return;
  const items = Cart.get().filter(i => { const p = getProducto(i.id); return p && tamanoDe(p, i.ml); });
  if (!items.length) {
    itemsEl.innerHTML = '<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío.<br>Elegí tu perfume y sumalo acá.</p><a class="btn btn-ghost" href="#tienda" data-cart-cerrar-link>Ver la colección</a></div>';
    footer.hidden = true;
    return;
  }
  footer.hidden = false;
  itemsEl.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="cart-item">
      <div class="recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="152" height="152"></div>
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="meta">${esc(tamanoLabel(p, i.ml))}${esFragancia(p) ? ` · ${esc(CONC[p.conc].corto)}` : ''}</span>
        <div class="cart-item-fila">
          <div class="stepper" data-cart-linea="${p.id}|${i.ml}"><button type="button" data-cart-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button><span>${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button></div>
          <span class="cart-item-precio">${formatearPrecio(precioDe(p, i.ml) * i.qty)}</span>
        </div>
        <button type="button" class="cart-quitar" data-cart-quitar="${p.id}|${i.ml}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${tamanoLabel(p, i.ml)})`; });
    wsp.href = wspHref(`Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
  renderCart();
  drawer.classList.add('open');
  document.querySelector('.cart-backdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  trapFocus(drawer);
  drawer.querySelector('.cart-cerrar')?.focus();
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-cerrar')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  document.querySelector('[data-cart-items]')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const [id, ml] = step.closest('[data-cart-linea]').dataset.cartLinea.split('|');
      const it = Cart.get().find(i => i.id === Number(id) && i.ml === Number(ml));
      if (it) Cart.setQty(id, ml, it.qty + Number(step.dataset.cartStep));
      return;
    }
    const quitar = e.target.closest('[data-cart-quitar]');
    if (quitar) { const [id, ml] = quitar.dataset.cartQuitar.split('|'); Cart.remove(id, ml); return; }
    if (e.target.closest('[data-cart-cerrar-link]')) closeCartDrawer();
  });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initAtajos() {
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat-link]');
    if (cat && Catalogo.categoria) { e.preventDefault(); Catalogo.categoria(cat.dataset.catLink); return; }
    const bus = e.target.closest('[data-foco-buscador]');
    if (bus && Catalogo.buscar) { e.preventDefault(); Catalogo.buscar(); return; }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(getProducto(add.dataset.add)); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(Number(ver.dataset.openQuickview));
  });
}

function initNewsletter() {
  const f = document.querySelector('[data-newsletter]');
  if (!f) return;
  const input = f.querySelector('input');
  const err = document.querySelector('[data-newsletter-error]');
  const btn = f.querySelector('button');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', String(!ok));
    err.textContent = ok ? '' : 'Revisá el email: le falta algo.';
    if (!ok) { input.focus(); return; }
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Suscribirme';
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      f.reset();
    }, 800);
  });
}

function initConsulta() {
  const f = document.querySelector('[data-consulta]');
  if (!f) return;
  const campos = {
    tema: f.querySelector('[name="tema"]'),
    nombre: f.querySelector('[name="nombre"]'),
    consulta: f.querySelector('[name="consulta"]'),
  };
  const marcar = (campo, msg) => {
    const box = campo.closest('.campo');
    box.classList.toggle('error', !!msg);
    campo.setAttribute('aria-invalid', String(!!msg));
    const out = box.querySelector('.campo-error');
    if (out) out.textContent = msg || '';
  };
  Object.values(campos).forEach(c => c?.addEventListener('input', () => marcar(c, '')));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const eTema = campos.tema.value ? '' : 'Elegí un tema.';
    const eNombre = campos.nombre.value.trim().length >= 2 ? '' : 'Contanos tu nombre.';
    marcar(campos.tema, eTema);
    marcar(campos.nombre, eNombre);
    if (eTema || eNombre) { (eTema ? campos.tema : campos.nombre).focus(); return; }
    const extra = campos.consulta.value.trim();
    const msg = `Hola! Soy ${campos.nombre.value.trim()}. Quiero consultar por: ${campos.tema.value}.${extra ? ` ${extra}` : ''}`;
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu consulta lista.');
    f.reset();
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initSchema() {
  const base = new URL('./', location.href).href;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Perfumes Claushinsecret',
    itemListElement: PRODUCTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        description: p.desc,
        image: base + 'images/' + p.img,
        brand: { '@type': 'Brand', name: 'Claushinsecret' },
        offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDe(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
      },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initDeepLink() {
  const slug = new URLSearchParams(location.search).get('producto');
  const p = slug && PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuickview(p.id);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const banner = document.querySelector('.banner');
  if (banner) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const foto = banner.querySelector('.banner-media img');
    if (foto) foto.style.transition = 'none';
    tl.from(foto, { scale: 1.08, duration: 1.5, clearProps: 'transform,transition' })
      .from(banner.querySelectorAll('.banner-firma, .hero-h1, .banner-msgs, .banner-ctas'), { y: 26, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.15)
      .from(banner.querySelector('.banner-ctrl'), { y: 14, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.6);
  }
  const panel = document.querySelector('.panel-hero');
  if (panel) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(panel.querySelectorAll('.kicker, .hero-h1, .panel-hero-lado > *'), { y: 26, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' })
      .from(panel.querySelector('.panel-firma .wordmark'), { yPercent: 40, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.2);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCuentas();
  initRail();
  initCatalogo();
  initGuia();
  initBanner();
  initSecreto();
  initQuickview();
  initCartUI();
  initFloats();
  initAtajos();
  initNewsletter();
  initConsulta();
  initFaq();
  initSchema();
  updateCartBadge();
  initReveals();
  initHeroMotion();
  initDeepLink();
});
