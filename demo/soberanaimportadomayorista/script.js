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
  'remeras-lisas-1x1.webp': [1254, 1254],
  'local-chombas-gorras-1x1.webp': [1254, 1254],
  'taller-bordado-dtf-1x1.webp': [1254, 1254],
  'ropa-trabajo-1x1.webp': [1254, 1254],
  'portada-local-16x9.webp': [1672, 941],
  'bordados-9x16.webp': [941, 1672],
};

const COLORES = {
  'Blanco': '#FFFFFF', 'Negro': '#17191C', 'Gris melange': '#B9BEC6', 'Azul marino': '#1F2B4D',
  'Verde militar': '#4D5B36', 'Bordó': '#7A1F2C', 'Crudo': '#EFE8D8', 'Gris': '#7D848D',
  'Beige': '#CDB78F', 'Verde inglés': '#1E4A33', 'Azul jean': '#34506F',
};

const LINEAS = { lisa: 'Ropa lisa', trabajo: 'Ropa de trabajo' };
const CATEGORIAS = [
  { id: 'remeras', label: 'Remeras', linea: 'lisa' },
  { id: 'chombas', label: 'Chombas', linea: 'lisa' },
  { id: 'buzos', label: 'Buzos', linea: 'lisa' },
  { id: 'camperas', label: 'Camperas', linea: 'trabajo' },
  { id: 'pantalones', label: 'Pantalones', linea: 'trabajo' },
  { id: 'camisas', label: 'Camisas', linea: 'trabajo' },
  { id: 'delantales', label: 'Delantales', linea: 'trabajo' },
  { id: 'gorras', label: 'Gorras', linea: 'lisa' },
];

const TALLES = {
  arriba: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  pantalon: ['38', '40', '42', '44', '46', '48', '50', '52', '54'],
  unico: ['Único'],
};
const TODOS_TALLES = [...TALLES.arriba, ...TALLES.pantalon, ...TALLES.unico];
const TABLA_TALLES = {
  arriba: [['S', 88, 94], ['M', 95, 101], ['L', 102, 108], ['XL', 109, 116], ['XXL', 117, 124], ['3XL', 125, 133]],
  pantalon: [['38', 74, 77], ['40', 78, 81], ['42', 82, 85], ['44', 86, 89], ['46', 90, 93], ['48', 94, 97], ['50', 98, 101], ['52', 102, 105], ['54', 106, 109]],
};

const T_REMERA = 'Jersey 24/1 · 100% algodón peinado · 180 g/m²';
const T_CHOMBA = 'Piqué · 50% algodón, 50% poliéster';
const T_BUZO = 'Frisa invisible · algodón y poliéster';
const T_CARGO = 'Gabardina 100% algodón · 6 bolsillos';
const T_CAMISA = 'Sarga 100% algodón · doble bolsillo con tapa';
const T_GORRA = 'Gabardina · 6 paneles · cierre regulable';
const D_REMERA = 'La base de cualquier uniforme: cuello reforzado y costura doble en ruedo y mangas. Lista para bordar o estampar.';
const D_CHOMBA = 'Piqué que mantiene la forma lavado tras lavado, con cuello y puños tejidos. Ideal para atención al público.';
const D_BUZO = 'Frisa invisible con bolsillo canguro y capucha forrada. Abriga sin hacer volumen.';
const D_CARGO = 'Seis bolsillos, costuras reforzadas y cintura con presillas anchas. Talles del 38 al 54.';
const D_GORRA = 'Visera curva y cierre regulable. El frente liso queda justo para un bordado.';

const PRODUCTOS = [
  { id: 1, modelo: 'remera', nombre: 'Remera lisa · Blanca', categoria: 'remeras', color: 'Blanco', precio: 9900, descuento: 0, stock: { S: 40, M: 60, L: 55, XL: 38, XXL: 20, '3XL': 12 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'remeras-lisas-1x1.webp', foco: [0.19, 0.28, 2.3], descripcion: D_REMERA },
  { id: 2, modelo: 'remera', nombre: 'Remera lisa · Negra', categoria: 'remeras', color: 'Negro', precio: 9900, descuento: 0, stock: { S: 34, M: 58, L: 61, XL: 40, XXL: 22, '3XL': 10 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'remeras-lisas-1x1.webp', foco: [0.51, 0.31, 2.3], descripcion: D_REMERA },
  { id: 3, modelo: 'remera', nombre: 'Remera lisa · Gris melange', categoria: 'remeras', color: 'Gris melange', precio: 9900, descuento: 0, stock: { S: 20, M: 32, L: 30, XL: 18, XXL: 8, '3XL': 0 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'remeras-lisas-1x1.webp', foco: [0.84, 0.32, 2.3], descripcion: D_REMERA },
  { id: 4, modelo: 'remera', nombre: 'Remera lisa · Azul marino', categoria: 'remeras', color: 'Azul marino', precio: 9900, descuento: 0, stock: { S: 26, M: 40, L: 44, XL: 30, XXL: 14, '3XL': 6 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'remeras-lisas-1x1.webp', foco: [0.33, 0.67, 2.3], descripcion: D_REMERA },
  { id: 5, modelo: 'remera', nombre: 'Remera lisa · Verde militar', categoria: 'remeras', color: 'Verde militar', precio: 9900, descuento: 0, stock: { S: 12, M: 24, L: 26, XL: 16, XXL: 6, '3XL': 0 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: true, img: 'remeras-lisas-1x1.webp', foco: [0.61, 0.71, 2.3], descripcion: D_REMERA },
  { id: 6, modelo: 'remera', nombre: 'Remera lisa · Bordó', categoria: 'remeras', color: 'Bordó', precio: 9900, descuento: 15, stock: { S: 8, M: 14, L: 12, XL: 6, XXL: 2, '3XL': 0 }, tela: T_REMERA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'remeras-lisas-1x1.webp', foco: [0.88, 0.75, 2.3], descripcion: D_REMERA },

  { id: 7, modelo: 'chomba', nombre: 'Chomba piqué · Azul marino', categoria: 'chombas', color: 'Azul marino', precio: 17900, descuento: 0, stock: { S: 10, M: 24, L: 28, XL: 20, XXL: 10, '3XL': 4 }, tela: T_CHOMBA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.11, 0.32, 3.0], descripcion: D_CHOMBA },
  { id: 8, modelo: 'chomba', nombre: 'Chomba piqué · Verde militar', categoria: 'chombas', color: 'Verde militar', precio: 17900, descuento: 0, stock: { S: 6, M: 14, L: 16, XL: 10, XXL: 4, '3XL': 0 }, tela: T_CHOMBA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.245, 0.33, 3.2], descripcion: D_CHOMBA },
  { id: 9, modelo: 'chomba', nombre: 'Chomba piqué · Gris', categoria: 'chombas', color: 'Gris', precio: 17900, descuento: 10, stock: { S: 0, M: 9, L: 12, XL: 7, XXL: 3, '3XL': 0 }, tela: T_CHOMBA, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.345, 0.32, 3.2], descripcion: D_CHOMBA },

  { id: 10, modelo: 'buzo', nombre: 'Buzo canguro con capucha · Crudo', categoria: 'buzos', color: 'Crudo', precio: 26900, descuento: 0, stock: { S: 8, M: 16, L: 18, XL: 12, XXL: 6, '3XL': 0 }, tela: T_BUZO, tecnicas: ['Bordado', 'DTF'], nuevo: true, img: 'taller-bordado-dtf-1x1.webp', foco: [0.45, 0.33, 1.8], descripcion: D_BUZO },
  { id: 11, modelo: 'buzo', nombre: 'Buzo canguro con capucha · Gris melange', categoria: 'buzos', color: 'Gris melange', precio: 26900, descuento: 10, stock: { S: 10, M: 20, L: 22, XL: 14, XXL: 8, '3XL': 3 }, tela: T_BUZO, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'taller-bordado-dtf-1x1.webp', foco: [0.43, 0.68, 1.8], descripcion: D_BUZO },
  { id: 12, modelo: 'buzo', nombre: 'Buzo canguro con capucha · Verde militar', categoria: 'buzos', color: 'Verde militar', precio: 26900, descuento: 0, stock: { S: 0, M: 0, L: 2, XL: 1, XXL: 0, '3XL': 0 }, tela: T_BUZO, tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'taller-bordado-dtf-1x1.webp', foco: [0.86, 0.24, 2.8], descripcion: D_BUZO },

  { id: 13, modelo: 'softshell', nombre: 'Campera softshell reflectiva · Azul marino', categoria: 'camperas', color: 'Azul marino', precio: 58900, descuento: 0, stock: { S: 0, M: 6, L: 10, XL: 9, XXL: 6, '3XL': 4 }, tela: 'Softshell tres capas · cinta reflectiva en torso y mangas', tecnicas: ['Bordado'], nuevo: false, img: 'portada-local-16x9.webp', foco: [0.88, 0.40, 2.4], descripcion: 'Corta el viento y la llovizna, con cinta reflectiva para trabajar en la calle o de noche.' },
  { id: 14, modelo: 'campera-trabajo', nombre: 'Campera de trabajo · Negra', categoria: 'camperas', color: 'Negro', precio: 49900, descuento: 20, stock: { S: 4, M: 8, L: 10, XL: 8, XXL: 4, '3XL': 2 }, tela: 'Gabardina · cierre frontal y bolsillos con cierre', tecnicas: ['Bordado'], nuevo: false, img: 'portada-local-16x9.webp', foco: [0.74, 0.38, 1.8], descripcion: 'Gabardina resistente con cierre frontal y bolsillos con cierre, para el uso diario en el taller.' },
  { id: 15, modelo: 'campera-gabardina', nombre: 'Campera de gabardina · Azul marino', categoria: 'camperas', color: 'Azul marino', precio: 45900, descuento: 0, stock: { S: 2, M: 10, L: 14, XL: 12, XXL: 6, '3XL': 3 }, tela: 'Gabardina 100% algodón · puños con abrojo', tecnicas: ['Bordado'], nuevo: false, img: 'ropa-trabajo-1x1.webp', foco: [0.19, 0.30, 2.0], descripcion: 'Campera de gabardina de algodón con puños regulables y bolsillo interior.' },

  { id: 16, modelo: 'cargo', nombre: 'Pantalón cargo de trabajo · Azul marino', categoria: 'pantalones', color: 'Azul marino', precio: 32900, descuento: 0, stock: { 38: 4, 40: 10, 42: 14, 44: 16, 46: 12, 48: 8, 50: 6, 52: 3, 54: 2 }, tela: T_CARGO, tecnicas: [], nuevo: false, img: 'ropa-trabajo-1x1.webp', foco: [0.17, 0.76, 2.0], descripcion: D_CARGO },
  { id: 17, modelo: 'cargo', nombre: 'Pantalón cargo de trabajo · Verde militar', categoria: 'pantalones', color: 'Verde militar', precio: 32900, descuento: 0, stock: { 38: 2, 40: 8, 42: 12, 44: 10, 46: 8, 48: 5, 50: 2, 52: 0, 54: 0 }, tela: T_CARGO, tecnicas: [], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.74, 0.56, 2.2], descripcion: D_CARGO },
  { id: 18, modelo: 'cargo', nombre: 'Pantalón cargo de trabajo · Beige', categoria: 'pantalones', color: 'Beige', precio: 32900, descuento: 0, stock: { 38: 0, 40: 6, 42: 9, 44: 8, 46: 6, 48: 4, 50: 2, 52: 1, 54: 0 }, tela: T_CARGO, tecnicas: [], nuevo: true, img: 'local-chombas-gorras-1x1.webp', foco: [0.89, 0.81, 3.0], descripcion: D_CARGO },

  { id: 19, modelo: 'camisa-mc', nombre: 'Camisa de trabajo manga corta · Gris', categoria: 'camisas', color: 'Gris', precio: 24900, descuento: 0, stock: { S: 4, M: 12, L: 16, XL: 12, XXL: 6, '3XL': 2 }, tela: T_CAMISA, tecnicas: ['Bordado'], nuevo: false, img: 'ropa-trabajo-1x1.webp', foco: [0.48, 0.30, 2.2], descripcion: 'Sarga de algodón con doble bolsillo con tapa y botones reforzados.' },
  { id: 20, modelo: 'camisa-ml', nombre: 'Camisa de trabajo manga larga · Gris', categoria: 'camisas', color: 'Gris', precio: 27900, descuento: 0, stock: { S: 0, M: 8, L: 12, XL: 10, XXL: 5, '3XL': 3 }, tela: T_CAMISA, tecnicas: ['Bordado'], nuevo: false, img: 'ropa-trabajo-1x1.webp', foco: [0.65, 0.70, 2.3], descripcion: 'La misma sarga en manga larga, con puños abotonados para regular.' },

  { id: 21, modelo: 'delantal-gabardina', nombre: 'Delantal pechera de gabardina · Verde inglés', categoria: 'delantales', color: 'Verde inglés', precio: 14900, descuento: 0, stock: { 'Único': 30 }, tela: 'Gabardina · bolsillo frontal y tiras regulables', tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'bordados-9x16.webp', foco: [0.14, 0.45, 2.2], descripcion: 'Pechera regulable y bolsillo frontal amplio. En la foto, con un bordado de ejemplo en el bolsillo.' },
  { id: 22, modelo: 'delantal-jean', nombre: 'Delantal pechera de jean · Azul', categoria: 'delantales', color: 'Azul jean', precio: 19900, descuento: 0, stock: { 'Único': 18 }, tela: 'Denim · tiras símil cuero y bolsillos múltiples', tecnicas: ['Bordado', 'DTF'], nuevo: false, img: 'ropa-trabajo-1x1.webp', foco: [0.69, 0.40, 2.4], descripcion: 'Denim resistente con tiras símil cuero y bolsillos para herramientas.' },

  { id: 23, modelo: 'gorra', nombre: 'Gorra 6 paneles · Negra', categoria: 'gorras', color: 'Negro', precio: 7900, descuento: 0, stock: { 'Único': 40 }, tela: T_GORRA, tecnicas: ['Bordado'], nuevo: false, img: 'taller-bordado-dtf-1x1.webp', foco: [0.08, 0.78, 2.6], descripcion: D_GORRA },
  { id: 24, modelo: 'gorra', nombre: 'Gorra 6 paneles · Azul marino', categoria: 'gorras', color: 'Azul marino', precio: 7900, descuento: 0, stock: { 'Único': 25 }, tela: T_GORRA, tecnicas: ['Bordado'], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.33, 0.52, 3.0], descripcion: D_GORRA },
  { id: 25, modelo: 'gorra', nombre: 'Gorra 6 paneles · Verde militar', categoria: 'gorras', color: 'Verde militar', precio: 7900, descuento: 0, stock: { 'Único': 0 }, tela: T_GORRA, tecnicas: ['Bordado'], nuevo: false, img: 'local-chombas-gorras-1x1.webp', foco: [0.50, 0.50, 3.0], descripcion: D_GORRA },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const stockDe = (p, t) => (p && t && p.stock[t]) || 0;
const stockTotal = p => Object.values(p.stock).reduce((s, n) => s + n, 0);
const catDe = id => CATEGORIAS.find(c => c.id === id) || { label: id, linea: 'lisa' };
const colorHex = c => COLORES[c] || '#999999';
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
  KEY: 'soberana_cart',
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
  KEY: 'soberana_talle',
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
      const hay = normalizar(`${p.nombre} ${p.color} ${catDe(p.categoria).label} ${LINEAS[catDe(p.categoria).linea]} ${p.tela}`);
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
      <span class="prod-cat"><i style="--c:${colorHex(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}</span>
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
      <span class="prod-cat"><i style="--c:${colorHex(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}</span>
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
  coloresBox.innerHTML = colores.map(c => `<label class="swatch"><input type="checkbox" data-f="color" value="${esc(c)}"><span class="swatch-dot" style="--c:${colorHex(c)}"></span>${esc(c)}</label>`).join('');
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
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'prenda' : 'prendas'}${t ? ` en talle ${esc(t)}` : ''}`;
    if (talleActivo) {
      talleActivo.hidden = !t;
      talleActivo.querySelector('[data-talle-activo-txt]').textContent = t ? `Talle ${t}` : '';
    }
    if (verResultados) verResultados.textContent = `Ver ${lista.length} ${lista.length === 1 ? 'prenda' : 'prendas'}`;
    root.querySelectorAll('[data-cuenta-cat]').forEach(em => {
      em.textContent = PRODUCTOS.filter(p => p.categoria === em.dataset.cuentaCat && (!t || stockDe(p, t) > 0)).length;
    });
    if (!lista.length) {
      grid.innerHTML = `<div class="catalogo-vacio"><b>Nada por acá</b><span>No hay prendas con esos filtros${t ? ` en talle ${esc(t)}` : ''}.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver todo el catálogo</button></div>`;
      vermas.hidden = true;
      return;
    }
    grid.innerHTML = lista.slice(0, visibles).map(cardHTML).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más prendas (${lista.length - Math.min(visibles, lista.length)})`;
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

  const TABS = [{ id: 'todas', label: 'Todas' }, { id: 'linea:lisa', label: LINEAS.lisa }, { id: 'linea:trabajo', label: LINEAS.trabajo }, ...CATEGORIAS.map(c => ({ id: `cat:${c.id}`, label: c.label }))];
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
    if (resultados) resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'prenda' : 'prendas'}${t ? ` en talle ${esc(t)}` : ''}`;
    if (!lista.length) {
      grupos.innerHTML = `<div class="catalogo-vacio"><b>Nada por acá</b><span>No hay prendas${t ? ` en talle ${esc(t)}` : ''} con esa búsqueda.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver todas las prendas</button></div>`;
      vermas.hidden = true;
      return;
    }
    const corte = lista.slice(0, visibles);
    const orden = Filtro.orden === 'relevancia' ? CATEGORIAS.map(c => c.id).filter(id => corte.some(p => p.categoria === id)) : [null];
    grupos.innerHTML = orden.map(catId => {
      const items = catId ? corte.filter(p => p.categoria === catId) : corte;
      const total = catId ? lista.filter(p => p.categoria === catId).length : lista.length;
      const cuentaTxt = items.length < total ? `${items.length} de ${total} prendas` : `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
      return `<div class="pedido-grupo"><h3>${catId ? esc(catDe(catId).label) : 'Prendas'}<em>${cuentaTxt}</em></h3><div class="pedido-filas">${items.map(filaHTML).join('')}</div></div>`;
    }).join('');
    vermas.hidden = visibles >= lista.length;
    vermas.textContent = `Ver más prendas (${lista.length - Math.min(visibles, lista.length)})`;
    revelarNuevos(grupos);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  const pintarBarra = () => {
    if (!barra) return;
    const n = Cart.count();
    barra.hidden = n === 0;
    barra.querySelector('[data-barra-txt]').textContent = `Ver pedido · ${n} ${n === 1 ? 'prenda' : 'prendas'}`;
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
function calcularTalle(escala, cm, calce) {
  const tabla = TABLA_TALLES[escala];
  if (!tabla || !Number.isFinite(cm) || cm <= 0) return { error: true };
  if (cm < tabla[0][1] - 6) return { fuera: true };
  let i = tabla.findIndex(fila => cm <= fila[2]);
  if (i === -1) return { fuera: true };
  let nota = '';
  if (calce === 'holgado') {
    if (i < tabla.length - 1) { i += 1; nota = 'Subimos un talle para que te quede holgado.'; }
    else nota = 'Ya es el talle más grande de la tabla.';
  }
  const [talle, min, max] = tabla[i];
  return { talle, min, max, nota, n: contarTalle(talle) };
}

function initTallePanel() {
  const panel = document.querySelector('[data-talle-panel]');
  if (!panel) return;
  panel.querySelectorAll('[data-talle-chips]').forEach(cont => {
    const escala = cont.dataset.talleChips;
    cont.innerHTML = TALLES[escala].map(t => {
      const n = contarTalle(t);
      return `<button type="button" class="talle-chip" data-talle="${t}" aria-pressed="false" aria-label="Talle ${t}: ${n} ${n === 1 ? 'prenda' : 'prendas'} con stock" ${n ? '' : 'disabled'}>${t}<small>${n}</small></button>`;
    }).join('');
  });
  const todos = panel.querySelector('[data-talle-todos]');
  const sync = () => {
    panel.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === Talle.actual)));
    todos?.setAttribute('aria-pressed', String(!Talle.actual));
  };
  panel.addEventListener('click', e => {
    const chip = e.target.closest('[data-talle]');
    if (chip) Talle.set(Talle.actual === chip.dataset.talle ? null : chip.dataset.talle);
    const usar = e.target.closest('[data-usar-talle]');
    if (usar) { Talle.set(usar.dataset.usarTalle); Catalogo.irA?.(); }
  });
  todos?.addEventListener('click', () => Talle.set(null));
  document.addEventListener('talle:cambio', sync);
  sync();

  const form = panel.querySelector('[data-talle-guia]');
  if (!form) return;
  const prenda = form.querySelector('[data-guia-prenda]');
  const medida = form.querySelector('[data-guia-medida]');
  const label = form.querySelector('[data-guia-label]');
  const res = form.querySelector('[data-guia-resultado]');
  prenda.addEventListener('change', () => {
    const pant = prenda.value === 'pantalon';
    label.textContent = pant ? 'Cintura (cm)' : 'Pecho (cm)';
    medida.value = pant ? 86 : 100;
    res.innerHTML = '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const calce = form.querySelector('input[name="calce"]:checked')?.value || 'justo';
    const r = calcularTalle(prenda.value, Number(String(medida.value).replace(',', '.')), calce);
    const parte = prenda.value === 'pantalon' ? 'Cintura' : 'Pecho';
    if (r.error) { res.innerHTML = '<div class="guia-res"><p>Ingresá la medida en centímetros, por ejemplo <b>100</b>.</p></div>'; medida.focus(); return; }
    if (r.fuera) {
      res.innerHTML = `<div class="guia-res"><p>Esa medida queda fuera de nuestra tabla. <b>Escribinos por WhatsApp</b> y te asesoramos con el talle.</p><a class="btn btn-ghost-claro" href="${wspHref(`Hola! Necesito asesoramiento de talle: ${parte.toLowerCase()} de ${medida.value} cm.`)}" target="_blank" rel="noopener">Consultar talle</a></div>`;
      return;
    }
    res.innerHTML = `<div class="guia-res"><span class="guia-res-talle">${r.talle}</span><div>
      <p>${parte} de <b>${r.min} a ${r.max} cm</b>. ${r.nota}</p>
      <p><b>${r.n} ${r.n === 1 ? 'prenda' : 'prendas'}</b> con stock en talle ${r.talle}.</p>
      <button type="button" class="btn btn-cta" data-usar-talle="${r.talle}">Ver prendas en talle ${r.talle}</button></div></div>`;
  });
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
  modal.querySelector('[data-qv-cat]').innerHTML = `<i style="--c:${colorHex(p.color)}"></i>${esc(catDe(p.categoria).label)} · ${esc(p.color)}`;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-precio]').innerHTML = stockTotal(p) <= 0 ? '<span class="prod-sin-stock">Sin stock por ahora</span>' : `${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${formatearPrecio(precioFinal(p))}</span><small class="qv-tela">por unidad</small>`;
  modal.querySelector('[data-qv-tela]').textContent = p.tela;
  modal.querySelector('[data-qv-desc]').textContent = p.descripcion;
  modal.querySelector('[data-qv-tecnicas]').innerHTML = p.tecnicas.length ? p.tecnicas.map(x => `<span class="etiqueta">Acepta ${esc(x.toLowerCase() === 'dtf' ? 'DTF' : x.toLowerCase())}</span>`).join('') : '';
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
    modal.querySelector('[data-qv-unidades]').textContent = `${u} ${u === 1 ? 'prenda' : 'prendas'}`;
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
  modal.querySelector('[data-qv-add]').onclick = () => {
    let total = 0;
    filas.querySelectorAll('[data-qv-talle]').forEach(fila => {
      const q = parseInt(fila.querySelector('[data-qv-cant]').textContent, 10) || 0;
      if (q > 0) total += Cart.add(p, q, fila.dataset.qvTalle);
    });
    if (total) { showToast(`Sumaste ${total} ${total === 1 ? 'prenda' : 'prendas'} de ${p.nombre}`); closeQuickview(); }
  };
  const logo = modal.querySelector('[data-qv-logo]');
  logo.hidden = !p.tecnicas.length;
  logo.href = wspHref(`Hola! Quiero consultar ${p.tecnicas.join(' o ').toLowerCase().replace('dtf', 'DTF')} para: ${p.nombre}.`);
  const hermanos = PRODUCTOS.filter(x => x.modelo === p.modelo);
  const colores = modal.querySelector('[data-qv-colores]');
  colores.closest('[data-qv-colores-wrap]').hidden = hermanos.length < 2;
  colores.innerHTML = hermanos.map(x => `<button type="button" class="qv-color" data-qv-color="${x.id}" aria-current="${x.id === p.id}"><i class="color-dot" style="--c:${colorHex(x.color)}"></i>${esc(x.color)}</button>`).join('');
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
    itemsEl.innerHTML = `<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío.<br>Elegí tu talle y sumá prendas.</p></div>`;
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

/* ---------- Momento propio: Lisa ↔ Con tu logo ---------- */
function initWipe() {
  document.querySelectorAll('[data-wipe]').forEach(w => {
    const copyA = w.querySelector('.copy-a');
    const copyB = w.querySelector('.copy-b');
    const linea = w.querySelector('.wipe-linea');
    const datoN = w.querySelector('[data-wipe-n]');
    if (!copyA || !copyB || !linea || !datoN) return;
    const TOTAL = PRODUCTOS.filter(p => p.tecnicas.length).length;
    w.querySelectorAll('[data-wipe-total]').forEach(el => { el.textContent = TOTAL; });
    if (reduceMotion) { w.classList.add('is-static'); datoN.textContent = TOTAL; return; }
    const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const pintar = p => {
      const wv = 108 - 116 * clamp01((p - 0.04) / 0.72);
      w.style.setProperty('--w', wv.toFixed(2));
      const a = clamp01((wv - 36) / 14);
      const b = clamp01((44 - wv) / 16);
      copyA.style.opacity = a; copyA.style.transform = `translateX(${((1 - a) * -28).toFixed(1)}px)`; copyA.style.pointerEvents = a < 0.15 ? 'none' : '';
      copyB.style.opacity = b; copyB.style.transform = `translateX(${((1 - b) * 28).toFixed(1)}px)`; copyB.style.pointerEvents = b < 0.15 ? 'none' : '';
      datoN.textContent = String(Math.round(TOTAL * clamp01((100 - wv) / 100))).padStart(2, '0');
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
