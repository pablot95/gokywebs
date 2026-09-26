/* Soberana importado mayorista — demo Gokywebs */
'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));

const WSP = '5493426419000';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'zapatilla-running-blanca-1x1.webp': [1254, 1254],
  'zapatilla-azul-marino-1x1.webp': [1254, 1254],
  'zapatilla-verde-militar-1x1.webp': [1254, 1254],
  'pared-zapatillas-1x1.webp': [1254, 1254],
  'remera-deportiva-azul-1x1.webp': [1254, 1254],
  'campera-rompeviento-1x1.webp': [1254, 1254],
  'short-deportivo-negro-1x1.webp': [1254, 1254],
  'ropa-deportiva-mesa-1x1.webp': [1254, 1254],
  'flatlay-ropa-deportiva-1x1.webp': [1254, 1254],
  'local-conjuntos-9x16.webp': [941, 1672],
};

/* Los bicolor llevan dos tonos: el punto se pinta partido en diagonal */
const COLORES = {
  'Blanco': '#FFFFFF', 'Negro': '#17191C', 'Gris': '#7D848D', 'Gris claro': '#CDD1D6', 'Gris melange': '#A3A8AF',
  'Azul': '#2B4A8B', 'Azul marino': '#1F2B4D', 'Verde militar': '#4D5B36',
  'Negro y gris': ['#17191C', '#6B727B'], 'Blanco y negro': ['#FFFFFF', '#17191C'],
  'Blanco y verde': ['#FFFFFF', '#3DBE3A'], 'Blanco y gris': ['#FFFFFF', '#9AA0A8'],
};

const LINEAS = { ropa: 'Ropa deportiva', zapatillas: 'Zapatillas' };
const CATEGORIAS = [
  { id: 'remeras', label: 'Remeras', linea: 'ropa' },
  { id: 'camperas', label: 'Camperas y buzos', linea: 'ropa' },
  { id: 'shorts', label: 'Shorts', linea: 'ropa' },
  { id: 'pantalones', label: 'Joggers y calzas', linea: 'ropa' },
  { id: 'running', label: 'Running', linea: 'zapatillas' },
  { id: 'urbanas', label: 'Urbanas', linea: 'zapatillas' },
];

const TALLES = {
  ropa: ['S', 'M', 'L', 'XL', 'XXL'],
  zapatillas: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
};
const TODOS_TALLES = [...TALLES.ropa, ...TALLES.zapatillas];
/* Tablas orientativas: contorno de pecho en ropa y largo del pie en zapatillas (talles argentinos), en cm */
const TABLA_TALLES = {
  ropa: [['S', 88, 94], ['M', 95, 101], ['L', 102, 108], ['XL', 109, 116], ['XXL', 117, 124]],
  zapatillas: [['35', 22, 22.6], ['36', 22.7, 23.3], ['37', 23.4, 24], ['38', 24.1, 24.6], ['39', 24.7, 25.3], ['40', 25.4, 26], ['41', 26.1, 26.6], ['42', 26.7, 27.3], ['43', 27.4, 28], ['44', 28.1, 28.6], ['45', 28.7, 29.3]],
};

/* Stock por talle: talles y cantidades en el mismo orden */
const stock = (talles, cant) => Object.fromEntries(talles.map((t, i) => [t, cant[i] ?? 0]));
const ROPA = TALLES.ropa;
const PIES = TALLES.zapatillas;

const M_REMERA = 'Poliéster dry fit · secado rápido';
const M_CAPUCHA = 'Poliéster con elastano · cierre completo';
const M_SHORT_RUN = 'Poliéster liviano · vivos reflectivos';
const M_JOGGER = 'Frisa liviana · puño elástico';
const M_CALZA = 'Suplex · cintura alta';
const M_KNIT = 'Capellada de malla tejida · suela de EVA';
const M_URBANA = 'Cuero sintético · suela de goma';
const D_REMERA = 'Corte raglan con paneles de red a los costados. Liviana para entrenar y cómoda para el día a día.';
const D_CAPUCHA = 'Campera de entrenamiento con capucha y cierre completo. La tela con elastano acompaña el movimiento.';
const D_SHORT_RUN = 'Short liviano con vivos reflectivos y paneles microperforados para correr.';
const D_JOGGER = 'Jogger de frisa liviana con cintura con cordón, puño elástico y bolsillos laterales.';
const D_CALZA = 'Calza larga de suplex con cintura alta y costuras planas que no marcan.';
const D_KNIT = 'Capellada tejida que respira y suela de EVA liviana, para correr o caminar todo el día.';
const D_URBANA = 'Urbana de cuero sintético con suela de goma. Combina con jogger, short o jean.';

const PRODUCTOS = [
  { id: 1, modelo: 'running-knit', nombre: 'Zapatilla running knit · Blanca y negra', categoria: 'running', color: 'Blanco y negro', precio: 48900, descuento: 0, stock: stock(PIES, [6, 10, 14, 18, 20, 22, 20, 16, 10, 6, 3]), material: M_KNIT, nuevo: false, img: 'zapatilla-running-blanca-1x1.webp', foco: [0.56, 0.60, 1.05], descripcion: D_KNIT },
  { id: 2, modelo: 'remera-raglan', nombre: 'Remera deportiva raglan · Azul', categoria: 'remeras', color: 'Azul', precio: 12900, descuento: 0, stock: stock(ROPA, [30, 48, 52, 36, 18]), material: M_REMERA, nuevo: false, img: 'remera-deportiva-azul-1x1.webp', foco: [0.50, 0.50, 1], descripcion: D_REMERA },
  { id: 3, modelo: 'rompeviento', nombre: 'Campera rompeviento con capucha · Negra y gris', categoria: 'camperas', color: 'Negro y gris', precio: 42900, descuento: 0, stock: stock(ROPA, [8, 16, 18, 12, 6]), material: 'Microfibra rompeviento · capucha fija', nuevo: false, img: 'campera-rompeviento-1x1.webp', foco: [0.50, 0.47, 1], descripcion: 'Corta el viento y la llovizna. Bicolor, con capucha fija y bolsillos laterales con cierre.' },
  { id: 4, modelo: 'trainer', nombre: 'Zapatilla trainer · Azul marino', categoria: 'urbanas', color: 'Azul marino', precio: 54900, descuento: 0, stock: stock(PIES.slice(3), [8, 12, 16, 16, 12, 8, 5, 2]), material: 'Malla y gamuza sintética · suela de goma', nuevo: false, img: 'zapatilla-azul-marino-1x1.webp', foco: [0.58, 0.56, 1.08], descripcion: 'Malla con apliques de gamuza sintética y suela alta con amortiguación.' },
  { id: 5, modelo: 'short-training', nombre: 'Short de entrenamiento · Negro', categoria: 'shorts', color: 'Negro', precio: 15900, descuento: 0, stock: stock(ROPA, [24, 40, 44, 30, 14]), material: 'Microfibra liviana · laterales de red', nuevo: false, img: 'short-deportivo-negro-1x1.webp', foco: [0.50, 0.46, 1], descripcion: 'Cintura elástica con cordón, bolsillos laterales y aberturas de red para ventilar.' },
  { id: 6, modelo: 'air', nombre: 'Zapatilla con cámara de aire · Verde militar', categoria: 'urbanas', color: 'Verde militar', precio: 59900, descuento: 0, stock: stock(PIES.slice(1, 10), [4, 6, 10, 12, 14, 12, 8, 4, 2]), material: 'Malla transpirable · cámara de aire en el talón', nuevo: true, img: 'zapatilla-verde-militar-1x1.webp', foco: [0.52, 0.56, 1.08], descripcion: 'Malla tejida con cámara de aire en el talón. Liviana y cómoda para todos los días.' },
  { id: 7, modelo: 'campera-capucha', nombre: 'Campera deportiva con capucha · Negra', categoria: 'camperas', color: 'Negro', precio: 38900, descuento: 0, stock: stock(ROPA, [10, 18, 20, 14, 8]), material: M_CAPUCHA, nuevo: false, img: 'local-conjuntos-9x16.webp', foco: [0.40, 0.19, 1.9], descripcion: D_CAPUCHA },
  { id: 8, modelo: 'urbana', nombre: 'Zapatilla urbana · Negra', categoria: 'urbanas', color: 'Negro', precio: 44900, descuento: 0, stock: stock(PIES, [5, 8, 12, 16, 18, 18, 16, 12, 8, 5, 2]), material: M_URBANA, nuevo: false, img: 'local-conjuntos-9x16.webp', foco: [0.60, 0.875, 2.4], descripcion: D_URBANA },
  { id: 9, modelo: 'remera-raglan', nombre: 'Remera deportiva raglan · Blanca', categoria: 'remeras', color: 'Blanco', precio: 12900, descuento: 0, stock: stock(ROPA, [36, 56, 60, 40, 20]), material: M_REMERA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.36, 0.46, 2.1], descripcion: D_REMERA },
  { id: 10, modelo: 'running-contraste', nombre: 'Zapatilla running · Blanca y verde', categoria: 'running', color: 'Blanco y verde', precio: 52900, descuento: 0, stock: stock(PIES.slice(3), [6, 10, 12, 12, 10, 6, 4, 2]), material: 'Malla transpirable · suela con amortiguación', nuevo: false, img: 'pared-zapatillas-1x1.webp', foco: [0.23, 0.47, 3], descripcion: 'Malla transpirable con aplique en contraste y suela con amortiguación para correr.' },
  { id: 11, modelo: 'rompeviento-liviano', nombre: 'Rompeviento liviano estampado · Gris claro', categoria: 'camperas', color: 'Gris claro', precio: 36900, descuento: 15, stock: stock(ROPA, [6, 12, 14, 8, 4]), material: 'Nylon liviano · capucha con cordón', nuevo: false, img: 'flatlay-ropa-deportiva-1x1.webp', foco: [0.74, 0.32, 1.8], descripcion: 'Liviano y estampado, con capucha regulable y puños elásticos. Se guarda en poco espacio.' },
  { id: 12, modelo: 'short-running', nombre: 'Short running con vivos · Negro', categoria: 'shorts', color: 'Negro', precio: 14900, descuento: 0, stock: stock(ROPA, [20, 34, 36, 24, 10]), material: M_SHORT_RUN, nuevo: false, img: 'flatlay-ropa-deportiva-1x1.webp', foco: [0.20, 0.71, 2], descripcion: D_SHORT_RUN },
  { id: 13, modelo: 'calza', nombre: 'Calza deportiva larga · Azul marino', categoria: 'pantalones', color: 'Azul marino', precio: 17900, descuento: 0, stock: stock(ROPA, [18, 26, 22, 12, 6]), material: M_CALZA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.73, 0.90, 2.1], descripcion: D_CALZA },
  { id: 14, modelo: 'running-camara', nombre: 'Zapatilla running con cámara · Blanca y gris', categoria: 'running', color: 'Blanco y gris', precio: 62900, descuento: 0, stock: stock(PIES.slice(1), [3, 5, 8, 10, 12, 12, 10, 8, 4, 2]), material: 'Malla y sintético · cámara de aire visible', nuevo: true, img: 'pared-zapatillas-1x1.webp', foco: [0.45, 0.62, 3.2], descripcion: 'Suela con cámara de aire visible y capellada de malla con apliques en negro.' },
  { id: 15, modelo: 'buzo-cierre', nombre: 'Buzo con capucha y cierre · Gris melange', categoria: 'camperas', color: 'Gris melange', precio: 34900, descuento: 0, stock: stock(ROPA, [0, 1, 2, 2, 0]), material: 'Frisa de algodón y poliéster · capucha', nuevo: false, img: 'local-conjuntos-9x16.webp', foco: [0.82, 0.19, 3.2], descripcion: 'Buzo de frisa con capucha, cierre completo y bolsillos. Abriga sin hacer volumen.' },
  { id: 16, modelo: 'remera-raglan', nombre: 'Remera deportiva raglan · Negra', categoria: 'remeras', color: 'Negro', precio: 12900, descuento: 0, stock: stock(ROPA, [34, 58, 61, 40, 22]), material: M_REMERA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.14, 0.42, 2.5], descripcion: D_REMERA },
  { id: 17, modelo: 'remera-raglan', nombre: 'Remera deportiva raglan · Gris melange', categoria: 'remeras', color: 'Gris melange', precio: 12900, descuento: 0, stock: stock(ROPA, [20, 32, 30, 18, 8]), material: M_REMERA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.58, 0.52, 2.1], descripcion: D_REMERA },
  { id: 18, modelo: 'remera-raglan', nombre: 'Remera deportiva raglan · Azul marino', categoria: 'remeras', color: 'Azul marino', precio: 12900, descuento: 0, stock: stock(ROPA, [26, 40, 44, 30, 14]), material: M_REMERA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.81, 0.57, 2], descripcion: D_REMERA },
  { id: 19, modelo: 'campera-capucha', nombre: 'Campera deportiva con capucha · Verde militar', categoria: 'camperas', color: 'Verde militar', precio: 38900, descuento: 0, stock: stock(ROPA, [6, 12, 14, 10, 4]), material: M_CAPUCHA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.52, 0.27, 2.6], descripcion: D_CAPUCHA },
  { id: 20, modelo: 'campera-capucha', nombre: 'Campera deportiva con capucha · Gris', categoria: 'camperas', color: 'Gris', precio: 38900, descuento: 0, stock: stock(ROPA, [0, 0, 0, 0, 0]), material: M_CAPUCHA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.90, 0.35, 3], descripcion: D_CAPUCHA },
  { id: 21, modelo: 'campera-franja', nombre: 'Campera de entrenamiento con franja · Azul marino', categoria: 'camperas', color: 'Azul marino', precio: 39900, descuento: 0, stock: stock(ROPA, [8, 14, 16, 10, 5]), material: 'Poliéster tricot · cuello alto', nuevo: true, img: 'local-conjuntos-9x16.webp', foco: [0.14, 0.18, 2], descripcion: 'Campera de entrenamiento de cuello alto con franja blanca en el pecho y bolsillos con cierre.' },
  { id: 22, modelo: 'short-running', nombre: 'Short running con vivos · Gris', categoria: 'shorts', color: 'Gris', precio: 14900, descuento: 10, stock: stock(ROPA, [12, 20, 22, 14, 6]), material: M_SHORT_RUN, nuevo: false, img: 'flatlay-ropa-deportiva-1x1.webp', foco: [0.63, 0.78, 2], descripcion: D_SHORT_RUN },
  { id: 23, modelo: 'jogger', nombre: 'Jogger de frisa · Gris melange', categoria: 'pantalones', color: 'Gris melange', precio: 24900, descuento: 0, stock: stock(ROPA, [14, 22, 24, 16, 8]), material: M_JOGGER, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.30, 0.84, 2], descripcion: D_JOGGER },
  { id: 24, modelo: 'jogger', nombre: 'Jogger de frisa · Negro', categoria: 'pantalones', color: 'Negro', precio: 24900, descuento: 0, stock: stock(ROPA, [16, 26, 28, 18, 10]), material: M_JOGGER, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.08, 0.66, 3.2], descripcion: D_JOGGER },
  { id: 25, modelo: 'calza', nombre: 'Calza deportiva larga · Negra', categoria: 'pantalones', color: 'Negro', precio: 17900, descuento: 0, stock: stock(ROPA, [24, 34, 30, 16, 8]), material: M_CALZA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.56, 0.88, 2], descripcion: D_CALZA },
  { id: 26, modelo: 'calza', nombre: 'Calza deportiva larga · Verde militar', categoria: 'pantalones', color: 'Verde militar', precio: 17900, descuento: 20, stock: stock(ROPA, [8, 12, 10, 6, 2]), material: M_CALZA, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.92, 0.93, 2.8], descripcion: D_CALZA },
  { id: 27, modelo: 'running-knit', nombre: 'Zapatilla running knit · Gris claro', categoria: 'running', color: 'Gris claro', precio: 48900, descuento: 0, stock: stock(PIES.slice(0, 7), [6, 10, 14, 16, 14, 10, 6]), material: M_KNIT, nuevo: false, img: 'ropa-deportiva-mesa-1x1.webp', foco: [0.19, 0.22, 3.4], descripcion: D_KNIT },
  { id: 28, modelo: 'urbana', nombre: 'Zapatilla urbana · Blanca', categoria: 'urbanas', color: 'Blanco', precio: 44900, descuento: 10, stock: stock(PIES.slice(0, 10), [4, 8, 12, 14, 16, 16, 12, 10, 6, 3]), material: M_URBANA, nuevo: false, img: 'local-conjuntos-9x16.webp', foco: [0.60, 0.75, 3], descripcion: D_URBANA },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const stockDe = (p, t) => (p && t && p.stock[t]) || 0;
const stockTotal = p => Object.values(p.stock).reduce((s, n) => s + n, 0);
const catDe = id => CATEGORIAS.find(c => c.id === id) || { label: id, linea: 'ropa' };
const esZapatilla = p => catDe(p.categoria).linea === 'zapatillas';
const colorCss = c => {
  const v = COLORES[c];
  return Array.isArray(v) ? `linear-gradient(135deg, ${v[0]} 50%, ${v[1]} 50%)` : v || '#999999';
};
const tallesDe = p => TODOS_TALLES.filter(t => t in p.stock);
const contarTalle = t => PRODUCTOS.filter(p => stockDe(p, t) > 0).length;

function rango(p) {
  const t = tallesDe(p);
  return t.length > 1 ? `${t[0]}–${t[t.length - 1]}` : t[0];
}

function recorte(p, ar = 1) {
  const [w, h] = IMG[p.img] || [1, 1];
  const [cx, cy, z] = p.foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c, vh = 1 / c;
  const px = w > vw ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px, y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

/* ---------- Carrito (línea = producto + talle) ---------- */
const Cart = {
  KEY: 'soberana_cart_v2',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle) {
    const max = stockDe(producto, talle);
    if (max <= 0 || qty <= 0) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, max) });
    this.save(items);
    return Math.min(qty, max);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === Number(id) && i.talle === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, stockDe(p, talle) || 1)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === Number(id) && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

/* ---------- Talle elegido (compartido por las dos páginas) ---------- */
const Talle = {
  KEY: 'soberana_talle_v2',
  actual: null,
  init() {
    try { const t = window.sessionStorage.getItem(this.KEY); if (TODOS_TALLES.includes(t)) this.actual = t; } catch { this.actual = null; }
    const u = new URLSearchParams(location.search).get('talle');
    if (TODOS_TALLES.includes(u)) this.actual = u;
  },
  set(t) {
    this.actual = TODOS_TALLES.includes(t) ? t : null;
    try {
      if (this.actual) window.sessionStorage.setItem(this.KEY, this.actual);
      else window.sessionStorage.removeItem(this.KEY);
    } catch { /* sin sessionStorage el talle vive solo en esta página */ }
    document.dispatchEvent(new CustomEvent('talle:cambio'));
  },
};

/* ---------- Toast ---------- */
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

/* ---------- Anti-copia ---------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ---------- Barra de modelos ---------- */
function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) { bar.classList.remove('gw-modelos--scrolling'); return; }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
}

/* ---------- Nav mobile ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

/* ---------- Reveals ---------- */
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`; });
  });
  revealsListos = true;
  if (!('IntersectionObserver' in window) || reduceMotion) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
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
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => el.classList.add('in'), 500);
  });
}

/* ---------- Focus trap (modales/drawers) ---------- */
let ultimoFoco = null;
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ---------- Filtros compartidos ---------- */
const Filtro = { lineas: new Set(), categorias: new Set(), colores: new Set(), precioMax: null, q: '', orden: 'relevancia' };
const PAGINA = 16;
let visibles = PAGINA;

function filtrar() {
  const t = Talle.actual;
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (t && stockDe(p, t) <= 0) return false;
    if (Filtro.lineas.size && !Filtro.lineas.has(catDe(p.categoria).linea)) return false;
    if (Filtro.categorias.size && !Filtro.categorias.has(p.categoria)) return false;
    if (Filtro.colores.size && !Filtro.colores.has(p.color)) return false;
    if (Filtro.precioMax && precioFinal(p) > Filtro.precioMax) return false;
    if (palabras.length) {
      const hay = normalizar(`${p.nombre} ${p.color} ${catDe(p.categoria).label} ${LINEAS[catDe(p.categoria).linea]} ${p.material}`);
      if (!palabras.every(w => hay.includes(w))) return false;
    }
    return true;
  });
  if (Filtro.orden === 'precio-asc') lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (Filtro.orden === 'precio-desc') lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (Filtro.orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = [...lista].sort((a, b) => (stockTotal(a) > 0 ? 0 : 1) - (stockTotal(b) > 0 ? 0 : 1));
  return lista;
}

const Catalogo = { render: null, irA: null };

function badgesHTML(p) {
  if (stockTotal(p) <= 0) return '<span class="prod-badge agotado">Sin stock</span>';
  const b = [];
  if (p.nuevo) b.push('<span class="prod-badge nuevo">Nuevo</span>');
  if (p.descuento > 0) b.push(`<span class="prod-badge off">-${p.descuento}%</span>`);
  else if (stockTotal(p) <= 6) b.push('<span class="prod-badge">Últimas unidades</span>');
  return b.join('');
}
function precioHTML(p) {
  if (stockTotal(p) <= 0) return '<span class="prod-sin-stock">Sin stock por ahora</span>';
  return `<div class="prod-precio">${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${formatearPrecio(precioFinal(p))}</span></div>`;
}
function tallesHTML(p) {
  return `<div class="prod-talles" aria-label="Talles">${tallesDe(p).map(t => `<span class="${stockDe(p, t) > 0 ? (t === Talle.actual ? 'activo' : '') : 'sin'}">${t}</span>`).join('')}</div>`;
}

function cardHTML(p) {
  const t = Talle.actual;
  const agotado = stockTotal(p) <= 0;
  const conTalle = !!t && stockDe(p, t) > 0;
  const b = badgesHTML(p);
  return `<article class="prod-card" data-animate data-id="${p.id}">
    <button type="button" class="prod-media recorte" data-open-quickview="${p.id}" style="${recorte(p, 0.8)}" aria-label="Ver ${esc(p.nombre)}">
      ${b ? `<span class="prod-badges">${b}</span>` : ''}
      <span class="etiqueta prod-rango">${esc(rango(p))}</span>
      <img src="images/${p.img}" alt="${esc(p.nombre)}" width="600" height="750" loading="lazy">
      <span class="prod-ver">Vista rápida</span>
    </button>
    <div class="prod-body">
      <span class="prod-cat"><i style="--c:${colorCss(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      ${tallesHTML(p)}
      <div class="prod-actions">
        ${conTalle ? `<div class="stepper" data-stepper="${p.id}"><button type="button" data-step="-1" aria-label="Restar">−</button><span data-step-val>1</span><button type="button" data-step="1" aria-label="Sumar">+</button></div>` : ''}
        <button type="button" class="prod-add${conTalle ? '' : ' elegir'}" data-add="${p.id}" ${agotado ? 'disabled' : ''} aria-label="${agotado ? 'Sin stock' : conTalle ? `Agregar talle ${t} al carrito` : `Ver talles de ${esc(p.nombre)}`}">${agotado ? 'Sin stock' : conTalle ? 'Agregar' : 'Ver talles'}</button>
      </div>
    </div>
  </article>`;
}

function filaHTML(p) {
  const t = Talle.actual;
  const agotado = stockTotal(p) <= 0;
  const conTalle = !!t && stockDe(p, t) > 0;
  return `<article class="fila" data-animate data-id="${p.id}">
    <div class="fila-texto">
      <span class="prod-cat"><i style="--c:${colorCss(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}</span>
      <h4 class="fila-titulo"><button type="button" class="fila-nombre" data-open-quickview="${p.id}">${esc(p.nombre)}</button></h4>
      ${precioHTML(p)}
      ${tallesHTML(p)}
    </div>
    <div class="fila-foto">
      <button type="button" class="recorte" data-open-quickview="${p.id}" style="${recorte(p)}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.img}" alt="${esc(p.nombre)}" width="300" height="300" loading="lazy"></button>
      <button type="button" class="fila-mas" data-add="${p.id}" ${agotado ? 'disabled' : ''} aria-label="${agotado ? 'Sin stock' : conTalle ? `Sumar 1 en talle ${t} al pedido` : `Elegir talle de ${esc(p.nombre)}`}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>
  </article>`;
}

function agregarDesde(root, id) {
  const p = getProducto(id);
  if (!p) return;
  const t = Talle.actual;
  if (!t || stockDe(p, t) <= 0) { openQuickview(p.id); return; }
  const val = root.querySelector(`[data-stepper="${p.id}"] [data-step-val]`);
  const qty = val ? parseInt(val.textContent, 10) || 1 : 1;
  const n = Cart.add(p, qty, t);
  if (n) showToast(`Sumaste ${n} × ${p.nombre} (talle ${t})`);
}

function wireAcciones(root) {
  root.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const st = step.closest('[data-stepper]');
      const p = getProducto(st.dataset.stepper);
      const val = st.querySelector('[data-step-val]');
      const max = stockDe(p, Talle.actual) || 1;
      val.textContent = Math.max(1, Math.min(max, (parseInt(val.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregarDesde(root, add.dataset.add); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(ver.dataset.openQuickview);
  });
}

function scrollSuave(el) {
  el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Catálogo en grilla (Modelo Q) ---------- */
function initCatalogoGrilla() {
  const root = document.querySelector('[data-catalogo="grilla"]');
  if (!root) return;
  const grid = root.querySelector('.catalogo-grid');
  const filtros = root.querySelector('.filtros');
  const resultados = document.querySelector('[data-resultados]');
  const talleActivo = document.querySelector('[data-talle-activo]');
  const buscador = document.querySelector('[data-buscador]');
  const orden = document.querySelector('[data-orden]');
  const vermas = document.querySelector('[data-vermas]');
  const inicio = document.querySelector('[data-catalogo-inicio]');
  const precio = root.querySelector('[data-precio]');
  const precioValor = root.querySelector('[data-precio-valor]');
  const verResultados = root.querySelector('[data-ver-resultados]');

  const lineasBox = root.querySelector('[data-grupo="linea"]');
  const catsBox = root.querySelector('[data-grupo="categoria"]');
  const coloresBox = root.querySelector('[data-grupo="color"]');
  lineasBox.innerHTML = Object.entries(LINEAS).map(([id, label]) => `<label class="filtro-opcion"><input type="checkbox" data-f="linea" value="${id}"> ${label}</label>`).join('');
  catsBox.innerHTML = CATEGORIAS.map(c => `<label class="filtro-opcion"><input type="checkbox" data-f="categoria" value="${c.id}"> ${c.label}<em data-cuenta-cat="${c.id}"></em></label>`).join('');
  const colores = [...new Set(PRODUCTOS.map(p => p.color))];
  coloresBox.innerHTML = colores.map(c => `<label class="swatch"><input type="checkbox" data-f="color" value="${esc(c)}"><span class="swatch-dot" style="--c:${colorCss(c)}"></span>${esc(c)}</label>`).join('');
  const precios = PRODUCTOS.map(precioFinal);
  const pMin = Math.floor(Math.min(...precios) / 1000) * 1000;
  const pMax = Math.ceil(Math.max(...precios) / 1000) * 1000;
  precio.min = pMin; precio.max = pMax; precio.step = 1000; precio.value = pMax;
  const pintarPrecio = () => { precioValor.textContent = `Hasta ${formatearPrecio(Number(precio.value))}`; };
  pintarPrecio();

  const leer = () => {
    Filtro.lineas = new Set([...root.querySelectorAll('input[data-f="linea"]:checked')].map(i => i.value));
    Filtro.categorias = new Set([...root.querySelectorAll('input[data-f="categoria"]:checked')].map(i => i.value));
    Filtro.colores = new Set([...root.querySelectorAll('input[data-f="color"]:checked')].map(i => i.value));
    Filtro.precioMax = Number(precio.value) < pMax ? Number(precio.value) : null;
  };
  const escribir = () => {
    root.querySelectorAll('input[data-f="linea"]').forEach(i => { i.checked = Filtro.lineas.has(i.value); });
    root.querySelectorAll('input[data-f="categoria"]').forEach(i => { i.checked = Filtro.categorias.has(i.value); });
    root.querySelectorAll('input[data-f="color"]').forEach(i => { i.checked = Filtro.colores.has(i.value); });
    precio.value = Filtro.precioMax || pMax; pintarPrecio();
    if (buscador) buscador.value = Filtro.q;
  };

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    const lista = filtrar();
    const t = Talle.actual;
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}${t ? ` en talle ${esc(t)}` : ''}`;
    if (talleActivo) {
      talleActivo.hidden = !t;
      talleActivo.querySelector('[data-talle-activo-txt]').textContent = t ? `Talle ${t}` : '';
    }
    if (verResultados) verResultados.textContent = `Ver ${productosTxt(lista.length)}`;
    root.querySelectorAll('[data-cuenta-cat]').forEach(em => {
      em.textContent = PRODUCTOS.filter(p => p.categoria === em.dataset.cuentaCat && (!t || stockDe(p, t) > 0)).length;
    });
    if (!lista.length) {
      grid.innerHTML = `<div class="catalogo-vacio"><b>Nada por acá</b><span>No hay productos con esos filtros${t ? ` en talle ${esc(t)}` : ''}.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver todo el catálogo</button></div>`;
      vermas.hidden = true;
      return;
    }
    grid.innerHTML = lista.slice(0, visibles).map(cardHTML).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más productos (${lista.length - Math.min(visibles, lista.length)})`;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  const limpiar = () => {
    Filtro.lineas.clear(); Filtro.categorias.clear(); Filtro.colores.clear(); Filtro.precioMax = null; Filtro.q = ''; Filtro.orden = 'relevancia';
    if (orden) orden.value = 'relevancia';
    escribir(); render(true);
  };

  root.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leer(); render(true); } });
  precio.addEventListener('input', () => { pintarPrecio(); leer(); render(true); });
  root.querySelector('.filtros-limpiar')?.addEventListener('click', limpiar);
  grid.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar-todo]')) { Talle.set(null); limpiar(); }
  });
  buscador?.addEventListener('input', () => { Filtro.q = buscador.value; render(true); });
  buscador?.closest('form')?.addEventListener('submit', e => e.preventDefault());
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });
  talleActivo?.addEventListener('click', () => Talle.set(null));
  wireAcciones(grid);

  const toggle = document.querySelector('.filtros-toggle');
  const cerrar = root.querySelector('.filtros-cerrar');
  let fondo = null;
  const cerrarFiltros = () => {
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

  document.addEventListener('talle:cambio', () => render(true));

  Catalogo.render = render;
  Catalogo.irA = () => scrollSuave(inicio);
  Catalogo.categoria = id => { Filtro.lineas.clear(); Filtro.categorias = new Set([id]); escribir(); render(true); scrollSuave(inicio); };
  Catalogo.linea = id => { Filtro.categorias.clear(); Filtro.lineas = new Set([id]); escribir(); render(true); scrollSuave(inicio); };
  Catalogo.buscar = () => { scrollSuave(inicio); setTimeout(() => buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 450); };

  render(true);
}

/* ---------- Pedido por lista (Modelo E) ---------- */
function initCatalogoLista() {
  const root = document.querySelector('[data-catalogo="lista"]');
  if (!root) return;
  const tabs = root.querySelector('[data-tabs]');
  const grupos = root.querySelector('[data-grupos]');
  const vermas = root.querySelector('[data-vermas]');
  const resultados = root.querySelector('[data-resultados]');
  const buscador = root.querySelector('[data-buscador]');
  const barra = root.querySelector('[data-pedido-barra]');
  const inicio = root.querySelector('[data-catalogo-inicio]');
  let tab = 'todas';

  const TABS = [{ id: 'todas', label: 'Todo' }, ...Object.entries(LINEAS).map(([id, label]) => ({ id: `linea:${id}`, label })), ...CATEGORIAS.map(c => ({ id: `cat:${c.id}`, label: c.label }))];
  const cuenta = id => {
    const t = Talle.actual;
    return PRODUCTOS.filter(p => (!t || stockDe(p, t) > 0) && (id === 'todas' || (id.startsWith('linea:') ? catDe(p.categoria).linea === id.slice(6) : p.categoria === id.slice(4)))).length;
  };
  const pintarTabs = () => {
    tabs.innerHTML = TABS.map(x => `<button type="button" class="pedido-tab" data-tab="${x.id}" aria-pressed="${x.id === tab}">${esc(x.label)}<em>${cuenta(x.id)}</em></button>`).join('');
  };
  const aplicarTab = () => {
    Filtro.lineas = new Set(tab.startsWith('linea:') ? [tab.slice(6)] : []);
    Filtro.categorias = new Set(tab.startsWith('cat:') ? [tab.slice(4)] : []);
  };

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    aplicarTab();
    pintarTabs();
    const lista = filtrar();
    const t = Talle.actual;
    if (resultados) resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}${t ? ` en talle ${esc(t)}` : ''}`;
    if (!lista.length) {
      grupos.innerHTML = `<div class="catalogo-vacio"><b>Nada por acá</b><span>No hay productos${t ? ` en talle ${esc(t)}` : ''} con esa búsqueda.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver todos los productos</button></div>`;
      vermas.hidden = true;
      return;
    }
    const corte = lista.slice(0, visibles);
    const orden = Filtro.orden === 'relevancia' ? CATEGORIAS.map(c => c.id).filter(id => corte.some(p => p.categoria === id)) : [null];
    grupos.innerHTML = orden.map(catId => {
      const items = catId ? corte.filter(p => p.categoria === catId) : corte;
      const total = catId ? lista.filter(p => p.categoria === catId).length : lista.length;
      const cuentaTxt = items.length < total ? `${items.length} de ${total} productos` : productosTxt(total);
      return `<div class="pedido-grupo"><h3>${catId ? esc(catDe(catId).label) : 'Productos'}<em>${cuentaTxt}</em></h3><div class="pedido-filas">${items.map(filaHTML).join('')}</div></div>`;
    }).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más productos (${lista.length - Math.min(visibles, lista.length)})`;
    revelarNuevos(grupos);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  const pintarBarra = () => {
    if (!barra) return;
    const n = Cart.count();
    barra.hidden = n === 0;
    barra.querySelector('[data-barra-txt]').textContent = `Ver pedido · ${unidadesTxt(n)}`;
    barra.querySelector('[data-barra-total]').textContent = formatearPrecio(Cart.total());
  };

  tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; tab = b.dataset.tab; render(true); });
  buscador?.addEventListener('input', () => { Filtro.q = buscador.value; render(true); });
  buscador?.closest('form')?.addEventListener('submit', e => e.preventDefault());
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });
  grupos.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) { tab = 'todas'; Filtro.q = ''; if (buscador) buscador.value = ''; Talle.set(null); render(true); } });
  barra?.addEventListener('click', openCartDrawer);
  wireAcciones(grupos);
  document.addEventListener('talle:cambio', () => render(true));
  document.addEventListener('cart:updated', pintarBarra);

  Catalogo.render = render;
  Catalogo.irA = () => scrollSuave(inicio);
  Catalogo.categoria = id => { tab = `cat:${id}`; render(true); scrollSuave(inicio); };
  Catalogo.linea = id => { tab = `linea:${id}`; render(true); scrollSuave(inicio); };
  Catalogo.buscar = () => { scrollSuave(inicio); setTimeout(() => buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 450); };

  render(true);
  pintarBarra();
}

/* ---------- Componente: Tu talle + guía por medidas ---------- */
/* Cada escala arma su cinta: rango en cm, paso del input, marcas de la regla (fina y gruesa) y cada cuánto va un número */
const ESCALAS = {
  ropa: {
    cinta: [85, 130], paso: 1, marcas: [1, 5], numeros: 10, margen: 6, inicial: 100,
    medida: 'Contorno de pecho', calce: ['Calce justo', 'Holgado'], subir: 'Subimos un talle para que te quede holgado.',
    nota: 'Medida orientativa: medí el ancho de una remera que te quede bien, apoyada sobre una mesa, y multiplicalo por dos.',
  },
  zapatillas: {
    cinta: [22, 30], paso: 0.1, marcas: [0.5, 1], numeros: 1, margen: 0.5, inicial: 25.5,
    medida: 'Largo del pie', calce: ['Pie normal', 'Pie ancho'], subir: 'Con pie ancho conviene un número más.',
    nota: 'Medida orientativa: pisá una hoja con el talón contra la pared, marcá la punta del dedo más largo y medí.',
  },
};
const escalaDe = t => TALLES.zapatillas.includes(t) ? 'zapatillas' : 'ropa';
const productosTxt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
const unidadesTxt = n => `${n} ${n === 1 ? 'unidad' : 'unidades'}`;
const cmTxt = (cm, paso) => paso < 1 ? cm.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : String(cm);

function calcularTalle(escala, cm, calce) {
  const tabla = TABLA_TALLES[escala];
  const cfg = ESCALAS[escala];
  if (!tabla || !cfg || !Number.isFinite(cm) || cm <= 0) return { error: true };
  if (cm < tabla[0][1] - cfg.margen) return { fuera: true };
  let i = tabla.findIndex(fila => cm <= fila[2]);
  if (i === -1) return { fuera: true };
  let nota = '';
  if (calce === 'holgado') {
    if (i < tabla.length - 1) { i += 1; nota = cfg.subir; }
    else nota = 'Ya es el talle más grande de la tabla.';
  }
  const [talle, min, max] = tabla[i];
  return { talle, min, max, nota, n: contarTalle(talle) };
}

function initTallePanel() {
  const panel = document.querySelector('[data-talle-panel]');
  if (!panel) return;
  const opciones = panel.querySelector('[data-talle-opciones]');
  const todos = panel.querySelector('[data-talle-todos]');
  const escalas = panel.querySelector('[data-escalas]');
  const input = panel.querySelector('[data-guia-medida]');
  const label = panel.querySelector('[data-guia-label]');
  const valor = panel.querySelector('[data-guia-valor]');
  const segs = panel.querySelector('[data-cinta-talles]');
  const regla = panel.querySelector('[data-cinta-regla]');
  const res = panel.querySelector('[data-guia-resultado]');
  const calceBox = panel.querySelector('[data-calce]');
  const nota = panel.querySelector('[data-guia-nota]');
  if (!opciones || !escalas || !input || !res) return;
  let escala = Talle.actual ? escalaDe(Talle.actual) : 'ropa';
  let calce = 'justo';
  const ultimo = { ropa: ESCALAS.ropa.inicial, zapatillas: ESCALAS.zapatillas.inicial };

  const pintarOpciones = () => {
    escalas.querySelectorAll('[data-escala]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.escala === escala)));
    opciones.innerHTML = TALLES[escala].map(t => {
      const n = contarTalle(t);
      return `<button type="button" class="talle-chip" data-talle="${t}" aria-pressed="${t === Talle.actual}" aria-label="Talle ${t}: ${productosTxt(n)} con stock" ${n ? '' : 'disabled'}>${t}</button>`;
    }).join('');
    todos.hidden = !Talle.actual;
  };

  const calcular = () => {
    const cfg = ESCALAS[escala];
    const dec = cfg.paso < 1 ? 10 : 1;
    const cm = Math.round(Number(input.value) * dec) / dec;
    ultimo[escala] = cm;
    const txt = cmTxt(cm, cfg.paso);
    valor.textContent = `${txt} cm`;
    const r = calcularTalle(escala, cm, calce);
    segs.querySelectorAll('[data-cinta-talle]').forEach(s => s.classList.toggle('activo', !r.fuera && s.dataset.cintaTalle === r.talle));
    if (r.fuera || r.error) {
      input.setAttribute('aria-valuetext', `${txt} centímetros, fuera de la tabla`);
      res.innerHTML = `<p class="guia-res">Esa medida queda fuera de la tabla.<small>Escribinos y te asesoramos con el talle.</small></p><a class="btn btn-ghost" href="${wspHref(`Hola! Necesito asesoramiento de talle: ${cfg.medida.toLowerCase()} de ${txt} cm.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>`;
      return;
    }
    input.setAttribute('aria-valuetext', `${txt} centímetros, talle ${r.talle}`);
    res.innerHTML = `<p class="guia-res">Te recomendamos<b>${r.talle}</b>${r.nota ? `<small>${r.nota}</small>` : ''}</p><button type="button" class="btn btn-cta" data-usar-talle="${r.talle}" ${r.n ? '' : 'disabled'}>Ver ${productosTxt(r.n)} en talle ${r.talle}</button>`;
  };

  const pintarCinta = () => {
    const cfg = ESCALAS[escala];
    const [min, max] = cfg.cinta;
    const rango = max - min;
    input.min = min; input.max = max; input.step = cfg.paso; input.value = ultimo[escala];
    label.textContent = cfg.medida;
    if (nota) nota.textContent = cfg.nota;
    calceBox?.querySelectorAll('[data-calce-valor]').forEach((b, i) => { b.textContent = cfg.calce[i]; });
    regla.style.setProperty('--rango', rango);
    regla.style.setProperty('--fina', cfg.marcas[0]);
    regla.style.setProperty('--gruesa', cfg.marcas[1]);
    const filas = TABLA_TALLES[escala];
    segs.innerHTML = filas.map(([t, a, b], i) => {
      const fin = filas[i + 1] ? filas[i + 1][1] : b + cfg.paso;
      const l = Math.max(0, (a - min) / rango * 100);
      const r = Math.min(100, (fin - min) / rango * 100);
      return `<span class="cinta-talle" data-cinta-talle="${t}" style="left:${l.toFixed(2)}%;width:${(r - l).toFixed(2)}%">${t}</span>`;
    }).join('');
    let nums = '';
    for (let v = Math.floor(min / cfg.numeros) * cfg.numeros + cfg.numeros; v < max; v += cfg.numeros) nums += `<span class="cinta-num" style="left:${((v - min) / rango * 100).toFixed(2)}%">${v}</span>`;
    regla.innerHTML = nums;
    calcular();
  };

  input.addEventListener('input', calcular);
  escalas.addEventListener('click', e => {
    const b = e.target.closest('[data-escala]');
    if (!b || b.dataset.escala === escala) return;
    escala = b.dataset.escala;
    pintarOpciones(); pintarCinta();
  });
  calceBox?.addEventListener('click', e => {
    const b = e.target.closest('[data-calce-valor]');
    if (!b) return;
    calce = b.dataset.calceValor;
    calceBox.querySelectorAll('[data-calce-valor]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    calcular();
  });
  panel.addEventListener('click', e => {
    const chip = e.target.closest('[data-talle]');
    if (chip) { Talle.set(Talle.actual === chip.dataset.talle ? null : chip.dataset.talle); return; }
    const usar = e.target.closest('[data-usar-talle]');
    if (usar) { Talle.set(usar.dataset.usarTalle); Catalogo.irA?.(); }
  });
  todos.addEventListener('click', () => Talle.set(null));
  document.addEventListener('talle:cambio', () => {
    if (Talle.actual && escalaDe(Talle.actual) !== escala) { escala = escalaDe(Talle.actual); pintarCinta(); }
    pintarOpciones();
  });
  pintarOpciones();
  pintarCinta();
}

/* ---------- Vista rápida ---------- */
function openQuickview(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  const t = Talle.actual;
  const media = modal.querySelector('[data-qv-media]');
  media.setAttribute('style', recorte(p));
  media.innerHTML = `<img src="images/${p.img}" alt="${esc(p.nombre)}" width="700" height="700">`;
  const par = esZapatilla(p);
  const cuantas = n => par ? `${n} ${n === 1 ? 'par' : 'pares'}` : unidadesTxt(n);
  modal.querySelector('[data-qv-cat]').innerHTML = `<i style="--c:${colorCss(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}`;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-precio]').innerHTML = stockTotal(p) <= 0 ? '<span class="prod-sin-stock">Sin stock por ahora</span>' : `${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${formatearPrecio(precioFinal(p))}</span><small class="qv-material">${par ? 'por par' : 'por unidad'}</small>`;
  modal.querySelector('[data-qv-material]').textContent = p.material;
  modal.querySelector('[data-qv-desc]').textContent = p.descripcion;
  const filas = modal.querySelector('[data-qv-talles]');
  filas.innerHTML = tallesDe(p).map(k => {
    const s = stockDe(p, k);
    const q0 = k === t && s > 0 ? 1 : 0;
    return `<div class="qv-talle${k === t ? ' activo' : ''}" data-qv-talle="${k}">
      <span class="qv-talle-nombre">${k}</span>
      <span class="qv-talle-stock${s ? '' : ' sin'}">${s ? `${s} disponibles` : 'Sin stock'}</span>
      <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar talle ${k}" ${s ? '' : 'disabled'}>−</button><span data-qv-cant>${q0}</span><button type="button" data-qv-step="1" aria-label="Sumar talle ${k}" ${s ? '' : 'disabled'}>+</button></div>
    </div>`;
  }).join('');
  const resumen = () => {
    const u = [...filas.querySelectorAll('[data-qv-cant]')].reduce((s, el) => s + (parseInt(el.textContent, 10) || 0), 0);
    modal.querySelector('[data-qv-unidades]').textContent = cuantas(u);
    modal.querySelector('[data-qv-subtotal]').textContent = formatearPrecio(u * precioFinal(p));
    modal.querySelector('[data-qv-add]').disabled = u === 0;
  };
  filas.onclick = e => {
    const b = e.target.closest('[data-qv-step]');
    if (!b) return;
    const fila = b.closest('[data-qv-talle]');
    const cant = fila.querySelector('[data-qv-cant]');
    const max = stockDe(p, fila.dataset.qvTalle);
    cant.textContent = Math.max(0, Math.min(max, (parseInt(cant.textContent, 10) || 0) + parseInt(b.dataset.qvStep, 10)));
    resumen();
  };
  resumen();
  /* Curva: suma una unidad en cada talle que todavía tiene stock disponible */
  const curva = modal.querySelector('[data-qv-curva]');
  curva.disabled = stockTotal(p) <= 0;
  curva.onclick = () => {
    filas.querySelectorAll('[data-qv-talle]').forEach(fila => {
      const cant = fila.querySelector('[data-qv-cant]');
      const q = parseInt(cant.textContent, 10) || 0;
      if (q < stockDe(p, fila.dataset.qvTalle)) cant.textContent = q + 1;
    });
    resumen();
  };
  modal.querySelector('[data-qv-add]').onclick = () => {
    let total = 0;
    filas.querySelectorAll('[data-qv-talle]').forEach(fila => {
      const q = parseInt(fila.querySelector('[data-qv-cant]').textContent, 10) || 0;
      if (q > 0) total += Cart.add(p, q, fila.dataset.qvTalle);
    });
    if (total) { showToast(`Sumaste ${cuantas(total)} de ${p.nombre}`); closeQuickview(); }
  };
  modal.querySelector('[data-qv-consulta]').href = wspHref(`Hola! Quiero consultar por cantidad de: ${p.nombre}.`);
  const hermanos = PRODUCTOS.filter(x => x.modelo === p.modelo);
  const colores = modal.querySelector('[data-qv-colores]');
  colores.closest('[data-qv-colores-wrap]').hidden = hermanos.length < 2;
  colores.innerHTML = hermanos.map(x => `<button type="button" class="qv-color" data-qv-color="${x.id}" aria-current="${x.id === p.id}"><i class="color-dot" style="--c:${colorCss(x.color)}"></i>${esc(x.color)}</button>`).join('');
  colores.onclick = e => { const b = e.target.closest('[data-qv-color]'); if (b && Number(b.dataset.qvColor) !== p.id) openQuickview(b.dataset.qvColor); };

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
  ultimoFoco?.focus?.();
}
function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });
}

/* ---------- Carrito: UI ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
function renderCart() {
  const itemsEl = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (!itemsEl) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    itemsEl.innerHTML = `<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío.<br>Elegí tu talle y sumá productos.</p></div>`;
    footer.hidden = true;
    return;
  }
  footer.hidden = false;
  itemsEl.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="cart-item">
      <div class="recorte" style="${recorte(p)}"><img src="images/${p.img}" alt="${esc(p.nombre)}" width="150" height="150" loading="lazy"></div>
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="cart-item-talle">Talle ${esc(i.talle)}</span>
        <div class="cart-item-fila">
          <div class="stepper" data-cart-linea="${p.id}|${esc(i.talle)}"><button type="button" data-cart-step="-1" aria-label="Restar">−</button><span>${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar">+</button></div>
          <span class="cart-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        </div>
        <button type="button" class="cart-quitar" data-cart-quitar="${p.id}|${esc(i.talle)}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) {
    const lineas = items.map(i => `- ${i.qty} × ${getProducto(i.id).nombre} (talle ${i.talle})`);
    wsp.href = wspHref(`Hola! Quiero consultar este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}
function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
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
  ultimoFoco?.focus?.();
}
function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-cerrar')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  document.querySelector('[data-cart-items]')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const [id, talle] = step.closest('[data-cart-linea]').dataset.cartLinea.split('|');
      const it = Cart.get().find(i => i.id === Number(id) && i.talle === talle);
      if (it) Cart.setQty(id, talle, it.qty + parseInt(step.dataset.cartStep, 10));
      return;
    }
    const quitar = e.target.closest('[data-cart-quitar]');
    if (quitar) { const [id, talle] = quitar.dataset.cartQuitar.split('|'); Cart.remove(id, talle); }
  });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
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

/* ---------- Momento propio: Ropa ↔ Zapatillas ---------- */
function initWipe() {
  document.querySelectorAll('[data-wipe]').forEach(w => {
    const copyA = w.querySelector('.copy-a');
    const copyB = w.querySelector('.copy-b');
    const linea = w.querySelector('.wipe-linea');
    const datoN = w.querySelector('[data-wipe-n]');
    if (!copyA || !copyB || !linea || !datoN) return;
    const zapas = PRODUCTOS.filter(p => esZapatilla(p) && stockTotal(p) > 0);
    const TOTAL = zapas.reduce((s, p) => s + stockTotal(p), 0);
    const DIGITOS = String(TOTAL).length;
    w.querySelectorAll('[data-wipe-modelos]').forEach(el => { el.textContent = new Set(zapas.map(p => p.modelo)).size; });
    if (reduceMotion) { w.classList.add('is-static'); datoN.textContent = TOTAL; return; }
    const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const pintar = p => {
      const wv = 108 - 116 * clamp01((p - 0.04) / 0.72);
      w.style.setProperty('--w', wv.toFixed(2));
      const a = clamp01((wv - 36) / 14);
      const b = clamp01((44 - wv) / 16);
      copyA.style.opacity = a; copyA.style.transform = `translateX(${((1 - a) * -28).toFixed(1)}px)`; copyA.style.pointerEvents = a < 0.15 ? 'none' : '';
      copyB.style.opacity = b; copyB.style.transform = `translateX(${((1 - b) * 28).toFixed(1)}px)`; copyB.style.pointerEvents = b < 0.15 ? 'none' : '';
      datoN.textContent = String(Math.round(TOTAL * clamp01((100 - wv) / 100))).padStart(DIGITOS, '0');
      linea.style.opacity = wv > 99.5 || wv < 0.5 ? 0 : 1;
      linea.classList.toggle('dato-derecha', wv < 32);
    };
    const update = () => {
      const r = w.getBoundingClientRect();
      const total = r.height - (window.innerHeight - OFF);
      pintar(total > 0 ? clamp01((OFF - r.top) / total) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}

/* ---------- Enlaces que filtran el catálogo ---------- */
function initAtajos() {
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat-link]');
    const lin = e.target.closest('[data-linea-link]');
    const bus = e.target.closest('[data-foco-buscador]');
    const tal = e.target.closest('[data-ir-talle]');
    if (cat && Catalogo.categoria) { e.preventDefault(); Catalogo.categoria(cat.dataset.catLink); }
    else if (lin && Catalogo.linea) { e.preventDefault(); Catalogo.linea(lin.dataset.lineaLink); }
    else if (bus && Catalogo.buscar) { e.preventDefault(); Catalogo.buscar(); }
    else if (tal) { e.preventDefault(); scrollSuave(document.querySelector('[data-talle-panel]')); }
  });
}

/* ---------- Movimiento de entrada ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  const portada = document.querySelector('.portada');
  if (portada) {
    const mostrar = () => portada.classList.add('in');
    requestAnimationFrame(() => requestAnimationFrame(mostrar));
    setTimeout(mostrar, 600);
  }
  const hero = document.querySelector('.hero-talle');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from(hero.querySelectorAll('.hero-h1 .linea > span'), { yPercent: 108, duration: 1, stagger: 0.11 })
    .from(hero.querySelector('.marca-label'), { y: -46, rotate: 12, opacity: 0, duration: 0.95, ease: 'back.out(1.7)' }, '-=0.75')
    .from(hero.querySelectorAll('.hero-kicker, .hero-pie > *'), { y: 22, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.6');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');
  Talle.init();
  initNav();
  initModelBarScroll();
  initCatalogoGrilla();
  initCatalogoLista();
  initTallePanel();
  initAtajos();
  initQuickview();
  initCartUI();
  initFloats();
  initWipe();
  updateCartBadge();
  initReveals();
  initHeroMotion();
});
