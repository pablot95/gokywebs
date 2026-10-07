document.documentElement.classList.add('js');

const WSP = '5492805069143';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PRODUCTO_URL = new URLSearchParams(location.search).get('producto');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const clamp01 = v => Math.min(1, Math.max(0, v));
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const fmtCm = cm => `${cm} cm`;
const FLECHA = '<svg class="flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONO_MAS = '<svg class="add-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const FOTOS = {
  hero: ['01_hero_16x9.webp', 1672, 941],
  vitrina: ['02_galeria_9x16.webp', 941, 1672],
  alien: ['03_alien_1x1.webp', 1254, 1254],
  mothman: ['04_criptido_alado_1x1.webp', 1254, 1254],
  bigfoot: ['05_bigfoot_1x1.webp', 1254, 1254]
};

const CATEGORIAS = [
  { id: 'aliens', nombre: 'Aliens', t1: 'Llegaron', t2: 'de arriba', ir: 'Ver los aliens', tile: ['hero', [0.25, 0.44, 1.3]] },
  { id: 'criptidos', nombre: 'Críptidos', t1: 'Nadie los', t2: 'pudo atrapar', ir: 'Ver los críptidos', tile: ['hero', [0.84, 0.44, 1.28]] },
  { id: 'ovnis', nombre: 'Ovnis', t1: 'Se ven', t2: 'de noche', ir: 'Ver los ovnis', tile: ['vitrina', [0.54, 0.19, 1.75]] }
];

const FORMATOS = [
  { id: 'figura', nombre: 'Figuras' },
  { id: 'busto', nombre: 'Bustos' },
  { id: 'nave', nombre: 'Naves' }
];

const MATERIAL = ['Material', 'Resina impresa en 3D'];
const PINTURA = ['Terminación', 'Pintada a mano'];

const PRODUCTOS = [
  { id: 'mothman', exp: 'Exp. 002', nombre: 'Mothman sobre tronco', corto: 'Mothman', cat: 'criptidos', formato: 'figura', rank: 1,
    caso: 'Point Pleasant, Virginia Occidental · 1966', real: 210, medida: 'alto', realTxt: 'el Mothman mide 2,1 m',
    tallas: [[20, 58000], [30, 86000], [40, 124000]], img: 'mothman', foco: [0.5, 0.5, 1], esc: ['vitrina', [0.69, 0.375, 1.88], 1],
    desc: 'Alas abiertas con veladuras de rojo, ojos que brillan y las garras clavadas en un tronco con musgo.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Tronco y roca con musgo']],
    tags: 'mothman hombre polilla alas rojas ojos rojos point pleasant virginia criptido tronco' },
  { id: 'bigfoot', exp: 'Exp. 003', nombre: 'Bigfoot en marcha', corto: 'Bigfoot', cat: 'criptidos', formato: 'figura', rank: 2,
    caso: 'Bluff Creek, California · 1967', real: 240, medida: 'alto', realTxt: 'el Bigfoot mide 2,4 m',
    tallas: [[20, 56000], [30, 84000], [40, 120000]], img: 'bigfoot', foco: [0.5, 0.5, 1], esc: ['vitrina', [0.255, 0.578, 2.1], 0.75],
    desc: 'En plena caminata, con el pelaje trabajado mechón por mechón y una base de roca con musgo y raíces.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Roca con musgo y raíces']],
    tags: 'bigfoot pie grande sasquatch yeti simio peludo bluff creek california criptido bosque' },
  { id: 'busto-gris', exp: 'Exp. 001', nombre: 'Busto «Gris»', corto: 'Busto gris', cat: 'aliens', formato: 'busto', rank: 3,
    caso: 'Roswell, Nuevo México · 1947', real: 45, medida: 'alto', realTxt: 'a tamaño real mediría 45 cm',
    tallas: [[20, 52000], [30, 78000], [40, 112000]], img: 'alien', foco: [0.5, 0.48, 1.02], esc: ['vitrina', [0.16, 0.276, 2.85], 0.75],
    desc: 'El visitante clásico: cráneo enorme, ojos negros y una piel gris con arrugas y venas pintadas a pincel.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Pedestal negro']],
    tags: 'alien gris grey extraterrestre busto ojos negros roswell cabeza visitante' },
  { id: 'platillo', exp: 'Exp. 004', nombre: 'Platillo con soporte', corto: 'Platillo', cat: 'ovnis', formato: 'nave', rank: 4,
    caso: 'Monte Rainier, Washington · 1947', real: 1200, medida: 'diámetro', realTxt: 'el platillo mide 12 m de diámetro',
    tallas: [[20, 42000], [30, 63000], [40, 89000]], img: 'vitrina', foco: [0.526, 0.178, 2.4], esc: ['vitrina', [0.526, 0.18, 2.35], 1.333],
    desc: 'Platillo metálico con detalles rojos en el borde, montado sobre su soporte. Para la repisa o el escritorio.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Soporte negro']],
    tags: 'ovni ufo platillo volador nave plato disco metal kenneth arnold soporte' },
  { id: 'gris-alto', exp: 'Exp. 005', nombre: 'El Alto', corto: 'El Alto', cat: 'aliens', formato: 'figura', rank: 5,
    caso: 'Caso abierto · diseño del taller', real: 210, medida: 'alto', realTxt: 'un gris alto mide 2,1 m',
    tallas: [[20, 44000], [30, 66000], [40, 94000]], img: 'vitrina', foco: [0.893, 0.484, 2.35], esc: ['vitrina', [0.893, 0.484, 3.3], 0.75],
    desc: 'El más alto del grupo: piernas largas, un paso adelante y una base de roca con musgo.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Roca con musgo']],
    tags: 'alien gris grey alto extraterrestre de pie cuerpo entero figura' },
  { id: 'chupacabras', exp: 'Exp. 006', nombre: 'Chupacabras', corto: 'Chupacabras', cat: 'criptidos', formato: 'figura', rank: 6,
    caso: 'Canóvanas, Puerto Rico · 1995', real: 150, medida: 'largo', realTxt: 'el chupacabras mide 1,5 m de largo',
    tallas: [[15, 38000], [20, 50000], [30, 72000]], img: 'vitrina', foco: [0.744, 0.727, 4.1], esc: ['vitrina', [0.744, 0.727, 4.1], 1],
    desc: 'Cuatro patas, lomo de púas y la boca abierta. El críptido de las leyendas de campo, sobre su base de roca.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Roca']],
    tags: 'chupacabras chupacabra criptido puas leyenda campo puerto rico bestia' },
  { id: 'busto-estriado', exp: 'Exp. 007', nombre: 'Busto «Estriado»', corto: 'Busto estriado', cat: 'aliens', formato: 'busto', rank: 7, nuevo: true,
    caso: 'Caso abierto · diseño del taller', real: 50, medida: 'alto', realTxt: 'a tamaño real mediría 50 cm',
    tallas: [[20, 55000], [30, 82000], [40, 118000]], img: 'vitrina', foco: [0.887, 0.114, 2.95], esc: ['vitrina', [0.887, 0.114, 3.9], 0.75],
    desc: 'Un gris de otra rama: cráneo con estrías, mirada pesada y el cuello marcado hasta los hombros.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Pedestal negro']],
    tags: 'alien busto estriado craneo estrias extraterrestre cabeza insectoide' },
  { id: 'gris-de-pie', exp: 'Exp. 008', nombre: 'Gris de pie', corto: 'Gris de pie', cat: 'aliens', formato: 'figura', rank: 8,
    caso: 'Caso abierto · diseño del taller', real: 120, medida: 'alto', realTxt: 'un gris mide 1,2 m',
    tallas: [[15, 36000], [25, 55000], [35, 79000]], img: 'hero', foco: [0.332, 0.569, 2], esc: ['vitrina', [0.329, 0.314, 4.2], 0.75],
    desc: 'Gris delgado sobre una roca, con brazos largos y la cabeza apenas inclinada.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Roca con musgo']],
    tags: 'alien gris grey de pie delgado extraterrestre cuerpo entero figura chico' },
  { id: 'gris-acecho', exp: 'Exp. 009', nombre: 'Gris al acecho', corto: 'Al acecho', cat: 'aliens', formato: 'figura', rank: 9, nuevo: true,
    caso: 'Caso abierto · diseño del taller', real: 70, medida: 'alto', realTxt: 'agazapado, mide 70 cm',
    tallas: [[15, 34000], [20, 45000], [30, 66000]], img: 'vitrina', foco: [0.723, 0.58, 4.1], esc: ['vitrina', [0.723, 0.58, 4.1], 1],
    desc: 'Agazapado y listo para saltar, con la columna marcada y los dedos apoyados en la roca.',
    ficha: [MATERIAL, PINTURA, ['Base', 'Roca']],
    tags: 'alien gris agazapado acecho salto extraterrestre figura criatura' }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const nombreFormato = id => ({ figura: 'Figura', busto: 'Busto', nave: 'Nave' }[id] || '');
const talla = (p, cm) => p?.tallas.find(t => t[0] === cm);
const precioDe = (p, cm) => (talla(p, cm) || p?.tallas[0] || [0, 0])[1];
const medidaTxt = p => `de ${p?.medida || 'alto'}`;

function escalaRatio(real, cm) {
  const r = real / cm;
  if (r >= 3) return String(Math.round(r));
  return (Math.round(r * 10) / 10).toLocaleString('es-AR');
}

function calcRecorte(w, h, ar, foco) {
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw + 0.5 ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh + 0.5 ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return { op: `${pct(px)} ${pct(py)}`, to: `${pct(fx)} ${pct(fy)}`, z };
}

function aplicarFocos(raiz = document) {
  const lista = raiz.matches?.('[data-foco]') ? [raiz] : [];
  raiz.querySelectorAll?.('[data-foco]').forEach(el => lista.push(el));
  lista.forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    const w = +img.getAttribute('width') || img.naturalWidth;
    const h = +img.getAttribute('height') || img.naturalHeight;
    const r = el.getBoundingClientRect();
    if (!w || !h || r.width < 2 || r.height < 2) return;
    const foco = el.dataset.foco.split(/\s+/).map(Number);
    const v = calcRecorte(w, h, r.width / r.height, foco);
    el.style.setProperty('--op', v.op);
    el.style.setProperty('--to', v.to);
    el.style.setProperty('--z', v.z);
  });
}

function imgTag(k, alt = '') {
  const f = FOTOS[k];
  if (!f) return '';
  return `<img src="images/${f[0]}" width="${f[1]}" height="${f[2]}" alt="${esc(alt)}">`;
}

function filtrarProductos(lista, { q = '', cat = '', formatos = [], orden = 'destacadas' } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  const res = lista.filter(p => {
    if (cat && p.cat !== cat) return false;
    if (formatos.length && !formatos.includes(p.formato)) return false;
    if (!palabras.length) return true;
    const pajar = norm([p.nombre, p.corto, nombreCat(p.cat), nombreFormato(p.formato), p.caso, p.desc, p.tags, p.exp].join(' '));
    return palabras.every(w => pajar.includes(w));
  });
  const ordenes = {
    destacadas: (a, b) => a.rank - b.rank,
    'precio-asc': (a, b) => a.tallas[0][1] - b.tallas[0][1] || a.rank - b.rank,
    'precio-desc': (a, b) => b.tallas[0][1] - a.tallas[0][1] || a.rank - b.rank,
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es')
  };
  return res.sort(ordenes[orden] || ordenes.destacadas);
}

const HORARIOS = { 0: [], 1: [[600, 780], [960, 1200]], 2: [[600, 780], [960, 1200]], 3: [[600, 780], [960, 1200]], 4: [[600, 780], [960, 1200]], 5: [[600, 780], [960, 1200]], 6: [[600, 840]] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const hhmm = m => (m % 60 ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}` : String(Math.floor(m / 60)));

function estadoTaller(dia, min) {
  const hoy = HORARIOS[dia] || [];
  const tramo = hoy.find(([a, b]) => min >= a && min < b);
  if (tramo) {
    const falta = tramo[1] - min;
    return { abierto: true, texto: falta <= 60 ? `Abierto ahora · cierra en ${falta} min` : `Abierto ahora · cierra a las ${hhmm(tramo[1])} h` };
  }
  const luego = hoy.find(([a]) => a > min);
  if (luego) return { abierto: false, texto: `Cerrado · abre hoy a las ${hhmm(luego[0])} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const t = HORARIOS[d] || [];
    if (t.length) return { abierto: false, texto: `Cerrado · abre ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${hhmm(t[0][0])} h` };
  }
  return { abierto: false, texto: 'Cerrado' };
}

function ahoraEnChubut() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const v = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
    return { dia: dia < 0 ? new Date().getDay() : dia, min: (+v('hour') % 24) * 60 + +v('minute') };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}

const Cart = {
  KEY: 'inhumans3dstudio_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(v)) return [];
      return v.filter(i => i && talla(getProducto(i.id), i.cm) && Number.isFinite(i.qty) && i.qty > 0).map(i => ({ id: i.id, cm: i.cm, qty: Math.min(Math.floor(i.qty), 99) }));
    } catch {
      return [];
    }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinGuardar = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, cm, qty = 1) {
    if (!producto || !talla(producto, cm)) return;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.cm === cm);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, cm, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, cm, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.cm === cm);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, cm) { this.save(this.get().filter(i => !(i.id === id && i.cm === cm))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + precioDe(getProducto(i.id), i.cm) * i.qty, 0); }
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function agregar(id, cm, qty = 1) {
  const p = getProducto(id);
  const c = Number(cm) || p?.tallas[0][0];
  if (!p || !talla(p, c)) return false;
  Cart.add(p, c, qty);
  showToast(`${p.nombre} · ${fmtCm(c)} al carrito`);
  return true;
}

let capasAbiertas = 0;
function bloquear(si) {
  capasAbiertas = Math.max(0, capasAbiertas + (si ? 1 : -1));
  document.body.classList.toggle('no-scroll', capasAbiertas > 0);
}

function mostrarCapa(el) {
  if (!el) return;
  clearTimeout(el._cierre);
  el.hidden = false;
  void el.offsetWidth;
  el.classList.add('open');
}

function ocultarCapa(el, ms = 380) {
  if (!el) return;
  el.classList.remove('open');
  clearTimeout(el._cierre);
  el._cierre = setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : ms);
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  let abierto = false;
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (abierto) { abierto = false; bloquear(false); }
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    if (!abierto) { abierto = true; bloquear(true); }
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge, .inm-card .wordmark'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

const Tienda = {
  estado: { q: '', cat: '', formatos: [], orden: 'destacadas', mostrar: 16 },
  render: null,
  setCat(cat, irAlCatalogo = false) {
    this.estado.cat = CATEGORIAS.some(c => c.id === cat) ? cat : '';
    this.estado.mostrar = 16;
    this.render?.();
    if (irAlCatalogo) document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
};

function initCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const nEl = document.getElementById('tiendaN');
  const vacio = document.getElementById('catalogoVacio');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiar');
  const q = document.getElementById('q');
  const buscador = document.getElementById('buscador');
  const orden = document.getElementById('orden');
  const chipsCat = document.getElementById('chipsCat');
  const chipsFor = document.getElementById('chipsFormato');
  const filtros = document.getElementById('filtros');
  const toggle = document.getElementById('filtrosToggle');
  const filtrosN = document.getElementById('filtrosN');
  const st = Tienda.estado;
  const esM1 = document.body.classList.contains('m1');

  const params = new URLSearchParams(location.search);
  if (CATEGORIAS.some(c => c.id === params.get('cat'))) st.cat = params.get('cat');
  st.q = (params.get('q') || '').slice(0, 60);
  st.formatos = (params.get('formato') || '').split(',').filter(f => FORMATOS.some(x => x.id === f));
  if (['destacadas', 'precio-asc', 'precio-desc', 'nombre'].includes(params.get('orden'))) st.orden = params.get('orden');
  if (q) q.value = st.q;
  if (orden) orden.value = st.orden;

  const cuenta = id => PRODUCTOS.filter(p => p.cat === id).length;
  if (chipsCat) {
    chipsCat.innerHTML = `<button type="button" class="chip" data-f-cat="" aria-pressed="false">Todas <span>${PRODUCTOS.length}</span></button>` +
      CATEGORIAS.map(c => `<button type="button" class="chip" data-f-cat="${c.id}" aria-pressed="false">${esc(c.nombre)} <span>${cuenta(c.id)}</span></button>`).join('');
  }
  if (chipsFor) {
    chipsFor.innerHTML = FORMATOS.map(f => `<button type="button" class="chip" data-f-formato="${f.id}" aria-pressed="false">${esc(f.nombre)}</button>`).join('');
  }

  const sincronizarUrl = () => {
    const u = new URLSearchParams(location.search);
    const set = (k, v) => (v ? u.set(k, v) : u.delete(k));
    set('cat', st.cat);
    set('q', st.q.trim());
    set('formato', st.formatos.join(','));
    set('orden', st.orden === 'destacadas' ? '' : st.orden);
    u.delete('producto');
    const s = u.toString();
    try { window.history.replaceState(window.history.state, '', `${location.pathname}${s ? `?${s}` : ''}${location.hash}`); } catch { return; }
  };

  const columnas = () => {
    const t = window.getComputedStyle(grid).gridTemplateColumns;
    return t && t !== 'none' ? t.split(' ').filter(Boolean).length : 1;
  };

  const ajustarMosaico = () => {
    const n = grid.children.length;
    const cols = columnas();
    const ok = esM1 && n >= 5 && cols >= 2 && (n + 3) % cols === 0 && !st.q && !st.cat && !st.formatos.length && st.orden === 'destacadas';
    grid.classList.toggle('con-destacada', ok);
  };

  const cardHTML = p => {
    const [cm, precio] = p.tallas[0];
    return `<li class="card-wrap" data-animate="subir" style="opacity:0;transform:translateY(48px)">
      <article class="card" data-id="${p.id}">
        <button type="button" class="card-foto recorte" data-quick="${p.id}" data-foco="${p.foco.join(' ')}" aria-label="Ver la ficha de ${esc(p.nombre)}">${imgTag(p.img, p.nombre)}</button>
        <span class="card-exp" aria-hidden="true"><span class="sello">${esc(p.exp)}</span></span>
        ${p.nuevo ? '<span class="card-badge">Nuevo</span>' : ''}
        <div class="card-info">
          <p class="card-linea">${esc(nombreCat(p.cat))} · ${esc(nombreFormato(p.formato))}</p>
          <h3 class="card-nombre">${esc(p.nombre)}</h3>
          <p class="card-caso">${esc(p.caso)}</p>
          <div class="card-pie">
            <p class="card-precio"><span>${fmtCm(cm)}<em> ${esc(medidaTxt(p))}</em></span><b>${formatearPrecio(precio)}</b></p>
            <button type="button" class="card-add" data-add="${p.id}" data-cm="${cm}" aria-label="Agregar ${esc(p.nombre)} de ${cm} cm al carrito">${ICONO_MAS}<span class="add-txt">Agregar</span></button>
          </div>
        </div>
      </article>
    </li>`;
  };

  const pintarControles = () => {
    chipsCat?.querySelectorAll('[data-f-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fCat === st.cat)));
    chipsFor?.querySelectorAll('[data-f-formato]').forEach(b => b.setAttribute('aria-pressed', String(st.formatos.includes(b.dataset.fFormato))));
    const activos = (st.cat ? 1 : 0) + st.formatos.length + (st.orden !== 'destacadas' ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    if (limpiar) limpiar.hidden = !(activos || st.q.trim());
  };

  const render = () => {
    const lista = filtrarProductos(PRODUCTOS, st);
    const visibles = lista.slice(0, st.mostrar);
    grid.innerHTML = visibles.map(cardHTML).join('');
    if (nEl) nEl.textContent = lista.length === 1 ? '1 figura' : `${lista.length} figuras`;
    if (vacio) vacio.hidden = lista.length > 0;
    if (verMas) verMas.hidden = lista.length <= st.mostrar;
    pintarControles();
    ajustarMosaico();
    aplicarFocos(grid);
    revelarNuevos(grid);
    sincronizarUrl();
    refrescar();
  };
  Tienda.render = render;

  chipsCat?.addEventListener('click', e => {
    const b = e.target.closest('[data-f-cat]');
    if (!b) return;
    st.cat = b.dataset.fCat;
    st.mostrar = 16;
    render();
  });
  chipsFor?.addEventListener('click', e => {
    const b = e.target.closest('[data-f-formato]');
    if (!b) return;
    const f = b.dataset.fFormato;
    st.formatos = st.formatos.includes(f) ? st.formatos.filter(x => x !== f) : [...st.formatos, f];
    st.mostrar = 16;
    render();
  });
  orden?.addEventListener('change', () => { st.orden = orden.value; st.mostrar = 16; render(); });
  let tq = 0;
  q?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { st.q = q.value.slice(0, 60); st.mostrar = 16; render(); }, 180);
  });
  buscador?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(tq);
    st.q = q.value.slice(0, 60);
    st.mostrar = 16;
    render();
  });
  const limpiarTodo = () => {
    st.q = ''; st.cat = ''; st.formatos = []; st.orden = 'destacadas'; st.mostrar = 16;
    if (q) q.value = '';
    if (orden) orden.value = 'destacadas';
    render();
  };
  limpiar?.addEventListener('click', limpiarTodo);
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarTodo));
  verMas?.addEventListener('click', () => { st.mostrar += 16; render(); });
  toggle?.addEventListener('click', () => {
    const abierto = filtros.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', String(abierto));
    refrescar();
  });
  let tr = 0;
  window.addEventListener('resize', () => { clearTimeout(tr); tr = setTimeout(ajustarMosaico, 150); }, { passive: true });
  render();
}

function initEnlacesCat() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="?cat="], [data-cat]');
    if (!a || !document.getElementById('catalogo')) return;
    const cat = a.dataset.cat || new URLSearchParams(a.getAttribute('href').split('#')[0]).get('cat');
    if (!CATEGORIAS.some(c => c.id === cat)) return;
    e.preventDefault();
    const st = Tienda.estado;
    st.q = ''; st.formatos = [];
    const q = document.getElementById('q');
    if (q) q.value = '';
    Tienda.setCat(cat, true);
  });
}

function initColecciones() {
  const ul = document.getElementById('colecciones');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    const unidad = n === 1 ? (c.id === 'ovnis' ? 'nave' : 'figura') : (c.id === 'ovnis' ? 'naves' : 'figuras');
    return `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">
      <a class="col-card" href="?cat=${c.id}#tienda" data-cat="${c.id}">
        <span class="recorte" data-foco="${c.tile[1].join(' ')}">${imgTag(c.tile[0], '')}</span>
        <span class="col-txt">
          <span class="col-dato">${esc(c.nombre)} · ${n} ${unidad}</span>
          <span class="col-titulo">${esc(c.t1)} <span>${esc(c.t2)}</span></span>
          <span class="col-ir">${esc(c.ir)} ${FLECHA}</span>
        </span>
      </a>
    </li>`;
  }).join('');
}

function initEscala() {
  const figs = document.getElementById('escalaFigs');
  const stage = document.getElementById('escalaStage');
  const fig = document.getElementById('escalaFig');
  const foto = document.getElementById('escalaFoto');
  const rango = document.getElementById('escRango');
  if (!figs || !stage || !fig || !foto || !rango) return;
  const regla = document.getElementById('reglaV');
  const cota = document.getElementById('escalaCota');
  const cotaT = document.getElementById('escalaCotaT');
  const marcas = document.getElementById('escMarcas');
  const elNombre = document.getElementById('escNombre');
  const elAlto = document.getElementById('escAlto');
  const elMedida = document.getElementById('escMedida');
  const elRatio = document.getElementById('escRatio');
  const elPrecio = document.getElementById('escPrecio');
  const btnAgregar = document.getElementById('escAgregar');
  const wsp = document.getElementById('escWsp');
  const MAX = 45;
  let pid = 'bigfoot';
  let idx = 1;

  figs.innerHTML = PRODUCTOS.map(p => `<button type="button" class="fig-op" role="radio" data-fig="${p.id}" aria-checked="${p.id === pid}" tabindex="${p.id === pid ? 0 : -1}"><span class="fig-exp">${esc(p.exp)}</span><span class="n">${esc(p.corto)}</span></button>`).join('');
  if (regla) regla.innerHTML = [0, 10, 20, 30, 40].map(c => `<span style="--c:${c}">${c}</span>`).join('');

  const pintar = (animar = true) => {
    const p = getProducto(pid);
    if (!p) return;
    idx = Math.min(idx, p.tallas.length - 1);
    const [cm, precio] = p.tallas[idx];
    const H = stage.clientHeight;
    const W = stage.clientWidth;
    const piso = 30;
    const ar = p.esc[2] || 0.75;
    const porAncho = p.medida !== 'alto';
    const maxCm = p.tallas[p.tallas.length - 1][0];
    const derecha = porAncho ? 24 : 86;
    const uAlto = porAncho ? Math.min((H - piso - 30) / MAX, ((H - piso - 60) * ar) / maxCm) : (H - piso - 30) / MAX;
    const uAncho = (W - 84 - derecha) / ((porAncho ? maxCm : maxCm * ar) + 9.3);
    const u = Math.max(2.5, Math.min(uAlto, uAncho));
    stage.style.setProperty('--u', `${u}px`);
    const baseW = porAncho ? MAX * u : MAX * u * ar;
    const baseH = porAncho ? (MAX * u) / ar : MAX * u;
    const k = cm / MAX;
    const mateDer = 62 + u * 15 * 0.62;
    const fw = baseW * k;
    const fx = Math.min(W - derecha - fw / 2, Math.max(mateDer + 22 + fw / 2, W * 0.56));
    if (!animar) fig.style.transition = 'none';
    fig.style.setProperty('--fw', `${baseW}px`);
    fig.style.setProperty('--fh', `${baseH}px`);
    fig.style.setProperty('--k', k);
    fig.style.setProperty('--fig-x', `${fx}px`);
    const alturaVis = baseH * k;
    if (cota) {
      cota.classList.toggle('is-h', porAncho);
      if (porAncho) {
        cota.style.setProperty('--cota-x', `${fx - fw / 2}px`);
        cota.style.setProperty('--cota-y', `${alturaVis + 12}px`);
        cota.style.setProperty('--kc', clamp01(fw / (MAX * u)));
        cota.style.setProperty('--wc', `${fw}px`);
      } else {
        cota.style.setProperty('--cota-x', `${fx + fw / 2 + 10}px`);
        cota.style.setProperty('--kc', clamp01(alturaVis / (MAX * u)));
        cota.style.setProperty('--hc', `${alturaVis}px`);
      }
    }
    if (cotaT) cotaT.textContent = `${cm} cm${porAncho ? ` de ${p.medida}` : ''}`;
    if (!animar) { void fig.offsetWidth; fig.style.transition = ''; }

    const [fk, focoEsc] = p.esc;
    const img = foto.querySelector('img');
    const f = FOTOS[fk];
    if (img && f && img.getAttribute('src') !== `images/${f[0]}`) {
      img.src = `images/${f[0]}`;
      img.width = f[1];
      img.height = f[2];
    }
    if (img) img.alt = `${p.nombre} a ${cm} cm`;
    foto.dataset.foco = focoEsc.join(' ');
    aplicarFocos(foto);

    elNombre.textContent = p.nombre;
    elAlto.textContent = cm;
    elMedida.textContent = medidaTxt(p);
    elRatio.innerHTML = `Escala <b>1:${escalaRatio(p.real, cm)}</b> · ${esc(p.realTxt)}`;
    elPrecio.textContent = formatearPrecio(precio);
    btnAgregar.textContent = `Agregar · ${cm} cm`;
    btnAgregar.dataset.add = p.id;
    btnAgregar.dataset.cm = cm;
    if (wsp) wsp.href = wspLink(`Hola Inhumans, quiero ${p.nombre} de ${cm} cm (${formatearPrecio(precio)}). ¿Está disponible?`);
    rango.max = String(p.tallas.length - 1);
    rango.value = String(idx);
    rango.setAttribute('aria-valuetext', `${cm} cm`);
    if (marcas) {
      marcas.innerHTML = p.tallas.map((t, i) => `<span${i === idx ? ' class="on"' : ''}>${t[0]} cm</span>`).join('');
    }
  };

  const elegir = id => {
    if (!getProducto(id)) return;
    pid = id;
    idx = Math.min(1, getProducto(id).tallas.length - 1);
    figs.querySelectorAll('.fig-op').forEach(b => {
      const on = b.dataset.fig === id;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    pintar();
  };

  figs.addEventListener('click', e => {
    const b = e.target.closest('.fig-op');
    if (b) elegir(b.dataset.fig);
  });
  figs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const ids = PRODUCTOS.map(p => p.id);
    let i = ids.indexOf(pid);
    if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = ids.length - 1;
    else i = (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + ids.length) % ids.length;
    elegir(ids[i]);
    const b = figs.querySelector(`[data-fig="${ids[i]}"]`);
    b?.focus();
    b?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  rango.addEventListener('input', () => { idx = +rango.value || 0; pintar(); });
  btnAgregar.addEventListener('click', () => agregar(btnAgregar.dataset.add, btnAgregar.dataset.cm));
  let tr = 0;
  window.addEventListener('resize', () => { clearTimeout(tr); tr = setTimeout(() => pintar(false), 120); }, { passive: true });
  pintar(false);
}

function initSenal() {
  const pista = document.getElementById('senalPista');
  const escena = document.getElementById('senalEscena');
  if (!pista || !escena) return;
  const fotos = [...escena.querySelectorAll('.senal-foto')];
  const textos = [...escena.querySelectorAll('.senal-texto')];
  const ests = [...escena.querySelectorAll('.dial-est')];
  const dial = document.getElementById('senalDial');
  const aguja = document.getElementById('senalAguja');
  const freqEl = document.getElementById('senalFreq');
  const nEl = document.getElementById('senalN');
  const barras = [...document.querySelectorAll('#senalBarras i')];
  const canvas = document.getElementById('senalRuido');
  const btnAgregar = document.getElementById('senalAgregar');
  const btnFicha = document.getElementById('senalFicha');
  const lnkTodas = document.getElementById('senalTodas');
  const lnkLlegar = document.getElementById('senalLlegar');
  const F = [89.5, 94.1, 99.7, 105.3];
  const N = Math.min(F.length, textos.length, 4);
  let idx = 0;
  let frame = 0;
  let ruido = 0;
  let visible = false;
  let loop = 0;
  let ultimo = 0;
  const ctx = canvas?.getContext('2d');
  const dibujarRuido = () => {
    if (!ctx) return;
    const { width: w, height: h } = canvas;
    const data = ctx.createImageData(w, h);
    const d = data.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 46 + Math.random() * 150;
      d[i] = v; d[i + 1] = v * 0.9; d[i + 2] = v * 0.9; d[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
  };
  const animarRuido = t => {
    loop = 0;
    if (!visible || ruido < 0.02 || reduceMotion) return;
    if (t - ultimo > 80) { dibujarRuido(); ultimo = t; }
    loop = requestAnimationFrame(animarRuido);
  };
  const medirDial = () => { if (dial) dial.style.setProperty('--w', `${dial.clientWidth}px`); };

  const pintarAcciones = i => {
    const p = getProducto(textos[i]?.dataset.producto);
    const cm = Number(textos[i]?.dataset.cm) || p?.tallas[0][0];
    [btnAgregar, btnFicha].forEach(b => { if (b) b.hidden = !p; });
    [lnkTodas, lnkLlegar].forEach(a => { if (a) a.hidden = !!p; });
    if (!p) return;
    if (btnAgregar) {
      btnAgregar.dataset.add = p.id;
      btnAgregar.dataset.cm = cm;
      btnAgregar.setAttribute('aria-label', `Agregar ${p.nombre} de ${cm} cm al carrito`);
    }
    if (btnFicha) {
      btnFicha.dataset.quick = p.id;
      btnFicha.setAttribute('aria-label', `Ver la ficha de ${p.nombre}`);
    }
  };

  const activar = i => {
    if (i === idx) return;
    idx = i;
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    textos.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-hidden', String(!on));
    });
    ests.forEach((b, k) => b.classList.toggle('is-on', k === i));
    if (nEl) nEl.textContent = String(i + 1).padStart(2, '0');
    pintarAcciones(i);
  };

  const update = () => {
    frame = 0;
    const OFF = offModelos();
    const r = pista.getBoundingClientRect();
    const total = Math.max(1, pista.offsetHeight - escena.offsetHeight);
    const p = clamp01((OFF - r.top) / total);
    const pos = p * (N - 1);
    const i = Math.min(N - 1, Math.round(pos));
    const a = Math.min(N - 2, Math.floor(pos));
    const frac = pos - a;
    const f = F[a] + (F[a + 1] - F[a]) * frac;
    const dist = Math.min(1, Math.abs(pos - i) * 2);
    const s = clamp01((dist - 0.28) / 0.72);
    ruido = s * s * (3 - 2 * s) * 0.72;
    activar(i);
    if (freqEl) freqEl.textContent = f.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (aguja) aguja.parentElement.style.setProperty('--p', ((f - 88) / 20).toFixed(4));
    const lit = Math.round((1 - dist) * 5);
    barras.forEach((b, k) => b.classList.toggle('on', k < lit));
    if (canvas) canvas.style.setProperty('--ruido', ruido.toFixed(3));
    if (!reduceMotion) {
      const foto = fotos[i]?.querySelector('img');
      if (foto) foto.style.translate = `${(Math.sin(pos * 37) * 3 * ruido).toFixed(1)}px 0`;
    }
    if (!loop && visible && ruido >= 0.02 && !reduceMotion) loop = requestAnimationFrame(animarRuido);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };

  textos.forEach((t, k) => t.setAttribute('aria-hidden', String(k !== 0)));
  pintarAcciones(0);
  ests.forEach((b, k) => b.addEventListener('click', () => {
    const total = Math.max(1, pista.offsetHeight - escena.offsetHeight);
    const top = window.scrollY + pista.getBoundingClientRect().top - offModelos() + total * (k / (N - 1));
    window.scrollTo({ top: Math.round(top), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => {
      visible = es.some(x => x.isIntersecting);
      if (visible) pedir();
    }).observe(escena);
  } else visible = true;
  dibujarRuido();
  medirDial();
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medirDial(); pedir(); }, { passive: true });
  update();
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('#horarios [data-dias]');
  if (!els.length && !filas.length) return;
  const pintar = () => {
    const { dia, min } = ahoraEnChubut();
    const e = estadoTaller(dia, min);
    els.forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = e.texto;
    });
    filas.forEach(f => {
      const [a, b] = f.dataset.dias.split('-').map(Number);
      f.classList.toggle('hoy', b === undefined || Number.isNaN(b) ? dia === a : dia >= a && dia <= b);
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-43.2489, -65.3051];
  try {
    const mapa = L.map(el, { center: centro, zoom: 11, scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 4200, color: '#FF0000', weight: 2, dashArray: '6 6', fillColor: '#FF0000', fillOpacity: 0.12 }).addTo(mapa);
    L.circleMarker(centro, { radius: 6, color: '#FF0000', weight: 2, fillColor: '#FF0000', fillOpacity: 1 }).addTo(mapa);
  } catch {
    el.classList.add('sin-mapa');
  }
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBd');
  const lista = document.getElementById('drawerLista');
  if (!drawer || !lista) return;
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  const total = document.getElementById('drawerTotal');
  const cuenta = document.getElementById('drawerCuenta');
  const fin = document.getElementById('finalizar');
  const pedir = document.getElementById('pedirWsp');
  let opener = null;
  let abierto = false;

  const render = () => {
    const items = Cart.get();
    lista.innerHTML = items.map((it, k) => {
      const p = getProducto(it.id);
      const unit = precioDe(p, it.cm);
      return `<li class="d-item" style="--i:${k}" data-linea="${it.id}|${it.cm}">
        <span class="d-foto recorte" data-foco="${p.foco.join(' ')}">${imgTag(p.img, '')}</span>
        <p class="d-nombre">${esc(p.nombre)}<small>${fmtCm(it.cm)} ${esc(medidaTxt(p))} · ${formatearPrecio(unit)} c/u</small></p>
        <b class="d-precio">${formatearPrecio(unit * it.qty)}</b>
        <div class="d-acciones">
          <div class="stepper"><button type="button" data-d-menos aria-label="Restar uno de ${esc(p.nombre)}" ${it.qty <= 1 ? 'disabled' : ''}>−</button><output>${it.qty}</output><button type="button" data-d-mas aria-label="Sumar uno de ${esc(p.nombre)}" ${it.qty >= 99 ? 'disabled' : ''}>+</button></div>
          <button type="button" class="d-quitar" data-d-quitar>Quitar</button>
        </div>
      </li>`;
    }).join('');
    const n = items.reduce((s, i) => s + i.qty, 0);
    if (vacio) vacio.hidden = n > 0;
    if (pie) pie.hidden = n === 0;
    lista.hidden = n === 0;
    if (total) total.textContent = formatearPrecio(Cart.total());
    if (cuenta) cuenta.textContent = n ? `(${n})` : '';
    if (pedir) {
      const lineas = items.map(it => { const p = getProducto(it.id); return `• ${p.nombre} · ${it.cm} cm × ${it.qty} = ${formatearPrecio(precioDe(p, it.cm) * it.qty)}`; });
      pedir.href = wspLink(`Hola Inhumans, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
    }
    if (abierto) aplicarFocos(lista);
  };

  const abrir = desde => {
    opener = desde || document.activeElement;
    render();
    mostrarCapa(bd);
    mostrarCapa(drawer);
    if (!abierto) { abierto = true; bloquear(true); }
    aplicarFocos(lista);
    drawer.querySelector('[data-cerrar-drawer]')?.focus();
  };
  const cerrar = (devolver = true) => {
    if (!abierto) return;
    abierto = false;
    ocultarCapa(drawer);
    ocultarCapa(bd, 300);
    bloquear(false);
    if (devolver && opener && document.contains(opener)) opener.focus();
  };
  window.abrirCarrito = abrir;
  window.cerrarCarrito = cerrar;

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open-cart]');
    if (o) { e.preventDefault(); abrir(o); }
  });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) {
      const link = e.target.closest('a[href^="#"]');
      cerrar(!link);
      return;
    }
    const li = e.target.closest('[data-linea]');
    if (!li) return;
    const [id, cmTxt] = li.dataset.linea.split('|');
    const cm = Number(cmTxt);
    const it = Cart.get().find(i => i.id === id && i.cm === cm);
    if (!it) return;
    if (e.target.closest('[data-d-menos]')) Cart.setQty(id, cm, it.qty - 1);
    else if (e.target.closest('[data-d-mas]')) Cart.setQty(id, cm, it.qty + 1);
    else if (e.target.closest('[data-d-quitar]')) { Cart.remove(id, cm); showToast(`Quitaste ${getProducto(id)?.nombre}`); }
  });
  bd?.addEventListener('click', () => cerrar());
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(drawer, e);
  });
  fin?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', render);
  render();
}

function initQuickView() {
  const modal = document.getElementById('qv');
  const bd = document.getElementById('qvBd');
  const body = document.getElementById('qvBody');
  if (!modal || !body) return;
  let opener = null;
  let abierto = false;
  let actual = null;
  let cmSel = 0;
  let qty = 1;
  let ld = null;

  const pintarPrecio = () => {
    const p = actual;
    if (!p) return;
    body.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioDe(p, cmSel) * qty);
    body.querySelector('[data-qv-escala]').innerHTML = `${fmtCm(cmSel)} ${esc(medidaTxt(p))} · escala <b>1:${escalaRatio(p.real, cmSel)}</b>`;
    body.querySelectorAll('[data-qv-talla]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.qvTalla === cmSel)));
    body.querySelector('[data-qv-qty]').textContent = qty;
    body.querySelector('[data-qv-menos]').disabled = qty <= 1;
    const w = body.querySelector('[data-qv-wsp]');
    if (w) w.href = wspLink(`Hola Inhumans, quiero consultar por ${p.nombre} de ${cmSel} cm (${p.exp}).`);
  };

  const render = p => {
    const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    const relleno = rel.length < 3 ? PRODUCTOS.filter(x => x.id !== p.id && !rel.includes(x)).slice(0, 3 - rel.length) : [];
    const relacionados = [...rel, ...relleno];
    body.innerHTML = `
      <div class="qv-foto recorte" data-foco="${p.foco.join(' ')}">${imgTag(p.img, p.nombre)}<span class="sello">${esc(p.exp)}</span></div>
      <div class="qv-info">
        <p class="eyebrow qv-linea">${esc(nombreCat(p.cat))} · ${esc(nombreFormato(p.formato))}</p>
        <h2 class="qv-nombre">${esc(p.nombre)}</h2>
        <p class="qv-caso">Caso: <b>${esc(p.caso)}</b></p>
        <div>
          <p class="filtro-t">Tamaño</p>
          <div class="qv-tallas" role="group" aria-label="Tamaño">${p.tallas.map(([cm, pr]) => `<button type="button" class="qv-talla" data-qv-talla="${cm}" aria-pressed="false"><b>${cm} cm</b><span>${formatearPrecio(pr)}</span></button>`).join('')}</div>
        </div>
        <div class="qv-precio"><b data-qv-precio></b><span data-qv-escala></span></div>
        <div class="qv-compra">
          <div class="stepper"><button type="button" data-qv-menos aria-label="Restar uno">−</button><output data-qv-qty>1</output><button type="button" data-qv-mas aria-label="Sumar uno">+</button></div>
          <button type="button" class="btn btn--negro" data-qv-add>Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv-wsp" data-qv-wsp href="${esc(wspLink(`Hola Inhumans, quiero consultar por ${p.nombre}.`))}" target="_blank" rel="noopener">${ICONO_WSP}Consultar por WhatsApp</a>
        <p class="qv-desc">${esc(p.desc)} ${esc(p.realTxt.charAt(0).toUpperCase() + p.realTxt.slice(1))}.</p>
        <dl class="qv-ficha">${p.ficha.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}<div><dt>Expediente</dt><dd>${esc(p.exp)}</dd></div></dl>
        <p class="filtro-t">También te puede interesar</p>
        <div class="qv-rel">${relacionados.map(x => `<button type="button" class="qv-rel-item" data-quick="${x.id}"><span class="recorte" data-foco="${x.foco.join(' ')}">${imgTag(x.img, '')}</span><span>${esc(x.nombre)}</span><b>desde ${formatearPrecio(x.tallas[0][1])}</b></button>`).join('')}</div>
      </div>`;
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.exp, description: p.desc, image: new URL(`images/${FOTOS[p.img][0]}`, location.href).href, category: nombreCat(p.cat), brand: { '@type': 'Brand', name: 'Inhumans-3D Studio' }, offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: p.tallas[0][1], highPrice: p.tallas[p.tallas.length - 1][1], offerCount: p.tallas.length, availability: 'https://schema.org/InStock' } });
  };

  const abrir = (id, desde, cm) => {
    const p = getProducto(id);
    if (!p) return;
    actual = p;
    cmSel = talla(p, Number(cm)) ? Number(cm) : p.tallas[0][0];
    qty = 1;
    if (!abierto) opener = desde || document.activeElement;
    render(p);
    pintarPrecio();
    mostrarCapa(bd);
    mostrarCapa(modal);
    if (!abierto) { abierto = true; bloquear(true); }
    aplicarFocos(body);
    modal.querySelector('.qv').scrollTop = 0;
    modal.querySelector('[data-cerrar-qv]')?.focus();
  };
  const cerrar = (devolver = true) => {
    if (!abierto) return;
    abierto = false;
    ocultarCapa(modal, 400);
    ocultarCapa(bd, 300);
    bloquear(false);
    if (devolver && opener && document.contains(opener)) opener.focus();
  };

  document.addEventListener('click', e => {
    const q = e.target.closest('[data-quick]');
    if (q && !e.target.closest('[data-add]')) { e.preventDefault(); abrir(q.dataset.quick, abierto ? null : q); }
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]') || e.target === modal) { cerrar(); return; }
    const t = e.target.closest('[data-qv-talla]');
    if (t) { cmSel = +t.dataset.qvTalla; pintarPrecio(); return; }
    if (e.target.closest('[data-qv-menos]')) { qty = Math.max(1, qty - 1); pintarPrecio(); return; }
    if (e.target.closest('[data-qv-mas]')) { qty = Math.min(99, qty + 1); pintarPrecio(); return; }
    if (e.target.closest('[data-qv-add]')) { agregar(actual.id, cmSel, qty); return; }
    if (e.target.closest('[data-qv-comprar]')) {
      Cart.add(actual, cmSel, qty);
      cerrar(false);
      window.abrirCarrito?.(opener);
    }
  });
  bd?.addEventListener('click', () => cerrar());
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(modal, e);
  });
  if (PRODUCTO_URL && getProducto(PRODUCTO_URL)) abrir(PRODUCTO_URL, null);
}

function initAgregar() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b || b.id === 'escAgregar') return;
    e.preventDefault();
    agregar(b.dataset.add, b.dataset.cm);
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
  cart?.addEventListener('click', () => window.abrirCarrito?.(cart));
  sync();
}

function initGaleria() {
  const lb = document.getElementById('lightbox');
  const botones = [...document.querySelectorAll('[data-gal]')];
  if (!lb || !botones.length) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const marco = lb.querySelector('.lb-marco');
  let i = 0;
  let opener = null;
  let abierto = false;
  const pintar = () => {
    const b = botones[i];
    const src = b.querySelector('img');
    const rec = b.querySelector('.recorte');
    const w = +src.getAttribute('width');
    const h = +src.getAttribute('height');
    const foco = (rec?.dataset.foco || '0.5 0.5 1').split(/\s+/).map(Number);
    const r = rec?.getBoundingClientRect();
    const ar = foco[2] > 1 && r && r.height ? r.width / r.height : w / h;
    marco.style.setProperty('--ar', ar.toFixed(4));
    img.src = src.getAttribute('src');
    img.width = w;
    img.height = h;
    img.alt = src.alt;
    marco.dataset.foco = foco.join(' ');
    cap.textContent = `${b.querySelector('.gal-cap')?.textContent || ''} · ${i + 1} / ${botones.length}`;
    aplicarFocos(marco);
  };
  const abrir = k => {
    i = k;
    opener = botones[k];
    pintar();
    mostrarCapa(lb);
    if (!abierto) { abierto = true; bloquear(true); }
    aplicarFocos(marco);
    lb.querySelector('[data-cerrar-lb]')?.focus();
  };
  const cerrar = () => {
    if (!abierto) return;
    abierto = false;
    ocultarCapa(lb, 300);
    bloquear(false);
    opener?.focus();
  };
  const mover = d => { i = (i + d + botones.length) % botones.length; pintar(); };
  botones.forEach((b, k) => b.addEventListener('click', () => abrir(k)));
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-lb]') || e.target === lb) { cerrar(); return; }
    const n = e.target.closest('[data-lb]');
    if (n) mover(+n.dataset.lb);
  });
  lb.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else atraparFoco(lb, e);
  });
}

function initFocosResize() {
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => aplicarFocos(document), 140);
  }, { passive: true });
  window.addEventListener('load', () => aplicarFocos(document));
}

initModelBarScroll();
initNav();
initColecciones();
initCatalogo();
initEscala();
initSenal();
initEstado();
initDrawer();
initQuickView();
initAgregar();
initFloats();
initGaleria();
initEnlacesCat();
updateCartBadge();
aplicarFocos(document);
initFocosResize();
initReveals();
initHeroMotion();
initMapa();
