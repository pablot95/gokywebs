const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491133038653';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'hamburguesas', nombre: 'Hamburguesas', img: 'images/p-triple.webp',
    bajada: 'De uno a cuatro medallones con cheddar, todas con papas fritas.' },
  { id: 'nuggets-panchos', nombre: 'Nuggets y panchos', img: 'images/p-panchos.webp',
    bajada: 'Ocho nuggets o dos panchos, siempre con papas fritas.' },
  { id: 'promos', nombre: 'Promos', img: 'images/p-promo.webp',
    bajada: 'Combos para compartir, con lo que ahorrás contra pedir cada cosa por separado.' },
  { id: 'bebidas', nombre: 'Bebidas', img: 'images/p-latas.webp',
    bajada: 'Latitas de Coca-Cola y Sprite para acompañar el pedido.' },
];
const SABORES = { coca: 'Coca-Cola', sprite: 'Sprite' };
const MEDALLONES = { 1: 'Simple', 2: 'Doble', 3: 'Triple', 4: 'Cuádruple' };
const RANGOS = {
  hasta8: { nombre: 'Hasta $8.000', max: 8000 },
  '8a12': { nombre: '$8.001 a $12.000', min: 8001, max: 12000 },
  mas12: { nombre: 'Más de $12.000', min: 12001 },
};
const ORDENES = { carta: 'Orden de la carta', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const DESTACADOS_HOME = ['hamburguesa-simple', 'hamburguesa-doble', 'nuggets-x8', 'panchos-x2'];
const PROMO_HOME = 'promo-panchos-nuggets';

const PRODUCTOS = [
  { id: 'hamburguesa-simple', nombre: 'Hamburguesa simple con papas', corto: 'Simple', cats: ['hamburguesas'], med: 1, rango: 1,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 8500 }], descuento: 0, papas: true,
    img: 'images/p-simple.webp', galeria: ['images/p-simple.webp'],
    alt: 'Hamburguesa simple con cheddar, lechuga, tomate y cebolla morada, con papas fritas al lado',
    desc: 'Un medallón con cheddar, lechuga, tomate y cebolla morada. Viene con papas fritas.',
    tags: ['simple', 'un medallon', 'cheddar', 'lechuga', 'tomate', 'cebolla', 'burger', 'papas'] },
  { id: 'hamburguesa-doble', nombre: 'Hamburguesa doble con papas', corto: 'Doble', cats: ['hamburguesas'], med: 2, rango: 2,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 10500 }], descuento: 0, papas: true,
    img: 'images/p-doble.webp', galeria: ['images/p-doble.webp'],
    alt: 'Hamburguesa doble con dos medallones y cheddar derretido, lechuga y tomate, sobre una bandeja con papas fritas',
    desc: 'Dos medallones con doble cheddar derretido, lechuga y tomate. Viene con papas fritas.',
    tags: ['doble', 'dos medallones', 'cheddar', 'lechuga', 'tomate', 'burger', 'papas'] },
  { id: 'hamburguesa-triple', nombre: 'Hamburguesa triple con papas', corto: 'Triple', cats: ['hamburguesas'], med: 3, rango: 3,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 12500 }], descuento: 0, papas: true,
    img: 'images/p-triple.webp', galeria: ['images/p-triple.webp'],
    alt: 'Hamburguesa triple con tres medallones, cheddar, lechuga, tomate, cebolla morada y pepinos en pan con sésamo, con papas fritas',
    desc: 'Tres medallones con cheddar, lechuga, tomate, cebolla morada y pepinos, en pan con sésamo. Viene con papas fritas.',
    tags: ['triple', 'tres medallones', 'cheddar', 'pepinos', 'sesamo', 'cebolla', 'burger', 'papas'] },
  { id: 'hamburguesa-cuadruple', nombre: 'Hamburguesa cuádruple con papas', corto: 'Cuádruple', cats: ['hamburguesas'], med: 4, rango: 4,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 14500 }], descuento: 0, papas: true,
    img: 'images/p-cuadruple.webp', galeria: ['images/p-cuadruple.webp'],
    alt: 'Hamburguesa cuádruple con cuatro medallones y cuatro fetas de cheddar, lechuga y tomate, con papas fritas',
    desc: 'Cuatro medallones y cuatro fetas de cheddar, con lechuga y tomate. Para el hambre en serio. Viene con papas fritas.',
    tags: ['cuadruple', 'cuatro medallones', 'cheddar', 'grande', 'burger', 'papas'] },
  { id: 'nuggets-x8', nombre: '8 nuggets con papas', corto: '8 nuggets', cats: ['nuggets-panchos'], rango: 5,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 8900 }], descuento: 0, papas: true,
    img: 'images/p-nuggets.webp', galeria: ['images/p-nuggets.webp'],
    alt: 'Ocho nuggets de pollo dorados sobre papel, con papas fritas al costado',
    desc: 'Ocho nuggets de pollo dorados y crocantes. Vienen con papas fritas.',
    tags: ['nuggets', 'pollo', 'ocho', 'crocantes', 'papas'] },
  { id: 'panchos-x2', nombre: '2 panchos con papas', corto: '2 panchos', cats: ['nuggets-panchos'], rango: 6,
    ops: [{ v: 'clasicos', nombre: 'Clásicos', precio: 7500 }, { v: 'cheddar-bacon', nombre: 'Con cheddar y bacon', precio: 9000 }], descuento: 0, papas: true,
    img: 'images/p-panchos.webp', galeria: ['images/p-panchos.webp'],
    alt: 'Dos panchos con ketchup y mostaza sobre una bandeja de metal, con papas fritas',
    desc: 'Dos panchos con salchicha, ketchup y mostaza. Vienen con papas fritas. También los hacemos con cheddar y bacon.',
    tags: ['panchos', 'pancho', 'hot dog', 'salchicha', 'ketchup', 'mostaza', 'cheddar', 'bacon', 'papas'] },
  { id: 'promo-panchos-nuggets', nombre: 'Promo 2 panchos + 8 nuggets', corto: 'Promo para compartir', cats: ['promos'], rango: 7,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 14500 }], descuento: 0, papas: true,
    incluye: [['panchos-x2', 'clasicos'], ['nuggets-x8', 'u']],
    img: 'images/p-promo.webp', galeria: ['images/p-promo.webp', 'images/p-panchos.webp', 'images/p-nuggets.webp'],
    alt: 'Ocho nuggets de pollo y dos panchos con ketchup y mostaza, uno al lado del otro',
    desc: 'Dos panchos clásicos y ocho nuggets, con papas fritas. El combo ideal para compartir.',
    tags: ['promo', 'combo', 'compartir', 'panchos', 'nuggets', 'papas', 'oferta'] },
  { id: 'lata', nombre: 'Lata de gaseosa', corto: 'Lata 354 ml', cats: ['bebidas'], rango: 8,
    sabores: ['coca', 'sprite'],
    ops: [{ v: '354', nombre: 'Lata 354 ml', precio: 1800 }], descuento: 0,
    img: 'images/p-latas.webp', galeria: ['images/p-latas.webp'],
    alt: 'Una lata de Coca-Cola y una lata de Sprite frías, con gotas de agua',
    desc: 'Lata de 354 ml, de Coca-Cola o Sprite, para acompañar el pedido.',
    tags: ['lata', 'latita', 'gaseosa', 'bebida', 'coca', 'coca cola', 'sprite', 'refresco'] },
  { id: 'borrador-veggie', nombre: 'Hamburguesa veggie (borrador)', cats: ['hamburguesas'], med: 1, visible: false,
    ops: [{ v: 'u', nombre: 'Con papas', precio: 1 }], descuento: 0, img: 'images/p-simple.webp', galeria: [], alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const opDe = (p, v) => p.ops.find(o => o.v === String(v)) || p.ops[0];
const vDefault = p => p.ops[0].v;
const precioLista = (p, v) => opDe(p, v).precio;
const precioOp = (p, v) => (p.descuento > 0 ? redondear(precioLista(p, v) * (1 - p.descuento / 100)) : precioLista(p, v));
const precioDesde = p => Math.min(...p.ops.map(o => precioOp(p, o.v)));
const catDe = id => CATEGORIAS.find(c => c.id === id);
const pideSabor = p => Array.isArray(p.sabores) && p.sabores.length > 1;
const tieneOps = p => p.ops.length > 1;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cats = lista(f.cat), meds = lista(f.med).map(Number), excluir = lista(f.excluir);
    if (cats.length && !p.cats.some(c => cats.includes(c))) return false;
    if (meds.length && !meds.includes(p.med)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null || f.precioMax != null) {
      const dentro = p.ops.some(o => {
        const n = precioOp(p, o.v);
        return (f.precioMin == null || n >= f.precioMin) && (f.precioMax == null || n <= f.precioMax);
      });
      if (!dentro) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'carta', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.corto, ...p.cats.map(c => catDe(c)?.nombre), p.desc, MEDALLONES[p.med],
      ...p.ops.map(o => o.nombre), ...(p.sabores || []).map(s => SABORES[s]), ...(p.tags || []),
      p.incluye ? 'promo combo' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'carta', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const HORARIO = { abre: 19, cierra: 1, dias: [0, 1, 4, 5, 6] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function partesAR(fecha) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
  const get = t => f.find(x => x.type === t)?.value || '';
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), hora: (parseInt(get('hour'), 10) || 0) % 24 };
}
function estadoLocal(fecha = new Date()) {
  const { dia, hora } = partesAR(fecha);
  const abre = d => HORARIO.dias.includes(d);
  const ayer = (dia + 6) % 7;
  if (hora >= HORARIO.abre && abre(dia)) return { abierto: true, turno: dia, texto: 'Abierto ahora', detalle: 'Tomamos pedidos hasta la 01 h' };
  if (hora < HORARIO.cierra && abre(ayer)) return { abierto: true, turno: ayer, texto: 'Abierto ahora', detalle: 'Tomamos pedidos hasta la 01 h' };
  if (hora < HORARIO.abre && abre(dia)) return { abierto: false, turno: dia, texto: 'Cerrado ahora', detalle: 'Abrimos hoy a las 19 h' };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (abre(d)) return { abierto: false, turno: dia, texto: 'Cerrado ahora', detalle: k === 1 ? 'Abrimos mañana a las 19 h' : `Abrimos el ${DIAS[d]} a las 19 h` };
  }
  return { abierto: false, turno: dia, texto: 'Cerrado ahora', detalle: '' };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const lineaKey = (id, v, s) => `${id}|${v}|${s || ''}`;
const varTexto = (p, v, s) => [p && tieneOps(p) ? opDe(p, v).nombre : '', SABORES[s]].filter(Boolean).join(' · ');
const detalleMsg = (p, v, s) => [p && tieneOps(p) ? opDe(p, v).nombre.toLowerCase() : '', SABORES[s]].filter(Boolean).join(' · ');
const ahorroDe = p => {
  if (!Array.isArray(p.incluye)) return 0;
  const suma = p.incluye.reduce((t, [id, v]) => { const x = getProducto(id); return x ? t + precioOp(x, v) : t; }, 0);
  return Math.max(0, suma - precioOp(p, vDefault(p)));
};

const Cart = {
  KEY: 'burgeradoani_cart',
  get() { try { const a = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(a) ? a : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = vDefault(producto), s = '') {
    const items = this.get();
    const existing = items.find(i => lineaKey(i.id, i.v, i.s) === lineaKey(producto.id, v, s));
    if (existing) existing.qty = Math.min(existing.qty + qty, 20);
    else items.push({ id: producto.id, v: String(v), s: s || '', qty: Math.min(qty, 20) });
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get(); const it = items.find(i => lineaKey(i.id, i.v, i.s) === key); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20)); this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => lineaKey(i.id, i.v, i.s) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.v) * i.qty : s; }, 0); },
};

const ICO = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  cartPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.5 9.5v4M11.5 11.5h4"/></svg>',
  papas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10h14l-1.6 10.2a1 1 0 0 1-1 .8H7.6a1 1 0 0 1-1-.8z"/><path d="M8 10 7.2 3.5M11 10V3M14 10l.5-6.5M17 10l1-5"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function precioHTML(p, v) {
  const fin = precioOp(p, v);
  const tachado = p.descuento > 0 ? ` <s>${formatearPrecio(precioLista(p, v))}</s>` : '';
  return `<strong>${formatearPrecio(fin)}</strong>${tachado}`;
}

const stepperHTML = (n = 1) => `<div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Uno menos">${ICO.minus}</button><output aria-live="polite">${n}</output><button type="button" data-step="1" aria-label="Uno más">${ICO.plus}</button></div>`;

function badgesHTML(p) {
  const b = [p.incluye ? '<span class="badge badge--promo">Promo</span>' : '', p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''].join('');
  return b ? `<span class="prod-badges">${b}</span>` : '';
}

function notaHTML(p) {
  if (pideSabor(p)) return `<button type="button" class="prod-nota" data-quick>${p.sabores.map(s => esc(SABORES[s])).join(' o ')}</button>`;
  if (tieneOps(p)) return `<button type="button" class="prod-nota" data-quick>${p.ops.map((o, i) => esc(i ? o.nombre.toLowerCase() : o.nombre)).join(' o ')}</button>`;
  if (p.incluye) return `<p class="prod-nota prod-nota--ahorro">Ahorrás ${formatearPrecio(ahorroDe(p))}</p>`;
  if (p.papas) return `<p class="prod-nota">${ICO.papas}Con papas fritas</p>`;
  return '';
}

function cardHTML(p, anim = true) {
  const v = vDefault(p);
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const elegir = pideSabor(p);
  return `<article class="prod-card" data-id="${esc(p.id)}" data-v="${v}" data-s=""${a}>
    <button type="button" class="prod-media" data-quick aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgesHTML(p)}</button>
    <div class="prod-body">
      <h3 class="prod-name"><button type="button" data-quick>${esc(p.nombre)}</button></h3>
      ${notaHTML(p)}
      <p class="prod-price">${precioHTML(p, v)}</p>
      <div class="prod-actions">${stepperHTML()}<button type="button" class="btn btn--cta prod-add" data-add aria-label="${elegir ? 'Elegir' : 'Agregar'} ${esc(p.nombre)}">${ICO.cartPlus}<span>${elegir ? 'Elegir' : 'Agregar'}</span></button></div>
      <button type="button" class="prod-buy" data-buy>Comprar ahora</button>
    </div>
  </article>`;
}

function filaHTML(p, anim = true) {
  const v = vDefault(p);
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : '';
  const elegir = pideSabor(p);
  const ah = ahorroDe(p);
  return `<article class="carta-fila" data-id="${esc(p.id)}" data-v="${v}" data-s=""${a}>
    <button type="button" class="carta-foto" data-quick aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></button>
    <div class="carta-info">
      <h3 class="carta-nombre"><button type="button" data-quick>${esc(p.nombre)}</button></h3>
      <p class="carta-desc">${esc(p.desc)}</p>
      ${tieneOps(p) || elegir ? notaHTML(p) : ''}
    </div>
    <div class="carta-compra">
      <p class="prod-price">${precioHTML(p, v)}${ah > 0 ? `<span class="prod-ahorro">Ahorrás ${formatearPrecio(ah)}</span>` : ''}</p>
      <button type="button" class="carta-sumar" data-add aria-label="${elegir ? 'Elegir' : 'Sumar'} ${esc(p.nombre)} al pedido">${ICO.plus}<span>${elegir ? 'Elegir' : 'Sumar'}</span></button>
    </div>
  </article>`;
}

function qtyDe(box) {
  const out = box.querySelector('.stepper output');
  return Math.max(1, parseInt(out?.textContent || '1', 10) || 1);
}

function textoSumado(p, qty, v, s) {
  const extra = detalleMsg(p, v, s);
  return `Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre.toLowerCase()}${extra ? ` (${extra})` : ''}`;
}

function agregarDesde(box, comprar) {
  const p = getProducto(box.dataset.id);
  if (!p) return;
  const v = box.dataset.v || vDefault(p);
  const s = box.dataset.s || '';
  const qty = qtyDe(box);
  if (pideSabor(p) && !s) { abrirVista(p.id, { v, s, qty, comprar }); return; }
  Cart.add(p, qty, v, s);
  const out = box.querySelector('.stepper output');
  if (out) out.textContent = '1';
  const btn = box.querySelector('[data-add]');
  if (btn) { btn.classList.remove('sumado'); void btn.offsetWidth; btn.classList.add('sumado'); }
  if (comprar) openCartDrawer();
  else showToast(textoSumado(p, qty, v, s));
}

function initCompra() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof window.Element) || t.closest('#qv') || t.closest('#cart-drawer') || t.closest('#pedido-panel')) return;
    const box = t.closest('[data-id]');
    if (!box) return;
    const step = t.closest('[data-step]');
    if (step) {
      const out = box.querySelector('.stepper output');
      if (out) out.textContent = String(Math.max(1, Math.min(20, qtyDe(box) + parseInt(step.dataset.step, 10))));
      return;
    }
    if (t.closest('[data-quick]')) { abrirVista(box.dataset.id, { v: box.dataset.v, s: box.dataset.s, qty: qtyDe(box) }); return; }
    if (t.closest('[data-add]')) { agregarDesde(box, false); return; }
    if (t.closest('[data-buy]')) agregarDesde(box, true);
  });
}

function focusables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = focusables(cont);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let overlaysAbiertos = 0;
function bloquearScroll(on) {
  overlaysAbiertos = Math.max(0, overlaysAbiertos + (on ? 1 : -1));
  document.body.classList.toggle('no-scroll', overlaysAbiertos > 0);
}

function ldProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'Burger Adonai' },
    offers: p.ops.map(o => ({ '@type': 'Offer', name: o.nombre, price: precioOp(p, o.v), priceCurrency: 'ARS', availability: 'https://schema.org/InStock' })),
  });
}

const qv = { el: null, body: null, estado: null, ultimoFoco: null };
function abrirVista(id, { v, s = '', qty = 1, comprar = false } = {}) {
  const p = getProducto(id);
  if (!p || !qv.el) return;
  const vOk = p.ops.some(o => o.v === v) ? v : vDefault(p);
  const sOk = pideSabor(p) ? (p.sabores.includes(s) ? s : '') : '';
  qv.estado = { id: p.id, v: vOk, s: sOk, qty: Math.max(1, qty || 1), img: 0, comprar };
  pintarVista();
  if (qv.el.hidden) {
    qv.ultimoFoco = document.activeElement;
    qv.el.hidden = false;
    bloquearScroll(true);
    void qv.el.offsetWidth;
    qv.el.classList.add('open');
  }
  qv.el.querySelector('.qv-close')?.focus();
  ldProducto(p);
}

function pintarVista() {
  const st = qv.estado;
  const p = getProducto(st.id);
  if (!p) return;
  const gal = p.galeria && p.galeria.length ? p.galeria : [p.img];
  const thumbs = gal.length > 1 ? `<div class="qv-thumbs">${gal.map((src, i) => `<button type="button" class="qv-thumb" data-qv-img="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === st.img}"><img src="${esc(src)}" alt="" width="120" height="120"></button>`).join('')}</div>` : '';
  const sabores = pideSabor(p) ? `<fieldset class="qv-opts"><legend>Sabor</legend><div class="qv-opt-row">${p.sabores.map(s => `<button type="button" class="opt-btn" data-qv-s="${s}" aria-pressed="${s === st.s}">${esc(SABORES[s])}</button>`).join('')}</div></fieldset>` : '';
  const ops = tieneOps(p) ? `<fieldset class="qv-opts"><legend>¿Cómo los querés?</legend><div class="qv-opt-row">${p.ops.map(o => `<button type="button" class="opt-btn" data-qv-v="${o.v}" aria-pressed="${o.v === st.v}">${esc(o.nombre)}<small>${formatearPrecio(precioOp(p, o.v))}</small></button>`).join('')}</div></fieldset>` : '';
  const ah = ahorroDe(p);
  const incluye = Array.isArray(p.incluye) ? `<ul class="qv-incluye">${p.incluye.map(([id, v]) => { const x = getProducto(id); return x ? `<li>${esc(x.nombre)}${tieneOps(x) ? ` (${esc(opDe(x, v).nombre.toLowerCase())})` : ''}<span>${formatearPrecio(precioOp(x, v))}</span></li>` : ''; }).join('')}</ul><p class="qv-ahorro">Ahorrás ${formatearPrecio(ah)} contra pedirlos por separado</p>` : '';
  const rel = Tienda.consultar({ filtros: { cat: p.cats, excluir: [p.id] }, limite: 3 }).items;
  const extra = rel.length < 3 ? Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items : [];
  const relacionados = [...rel, ...extra].map(cachear);
  const falta = pideSabor(p) && !st.s;
  const det = detalleMsg(p, st.v, st.s);
  const msg = `Hola Burger Adonai! Quería consultar por ${p.nombre.toLowerCase()}${det ? ` (${det})` : ''}.`;
  qv.body.innerHTML = `<div class="qv-grid">
    <div class="qv-galeria">
      <div class="qv-main"><img src="${esc(gal[st.img] || p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgesHTML(p)}</div>
      ${thumbs}
    </div>
    <div class="qv-info">
      <p class="qv-cat">${esc(catDe(p.cats[0])?.nombre)}${p.papas ? ` · ${ICO.papas}con papas fritas` : ''}</p>
      <h2 class="qv-title">${esc(p.nombre)}</h2>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${incluye}
      ${ops}
      ${sabores}
      <p class="prod-price qv-price">${precioHTML(p, st.v)}</p>
      <div class="qv-actions">
        <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-step="-1" aria-label="Uno menos">${ICO.minus}</button><output aria-live="polite">${st.qty}</output><button type="button" data-qv-step="1" aria-label="Uno más">${ICO.plus}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add>${falta ? 'Elegí el sabor' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button>
      </div>
      <a class="qv-wsp" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a>
      ${relacionados.length ? `<div class="qv-rel"><p class="qv-rel-title">También te puede gustar</p><div class="qv-rel-grid">${relacionados.map(r => `<button type="button" class="qv-rel-item" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="120" height="120"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioDesde(r))}</small></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}

function cerrarVista() {
  if (!qv.el || qv.el.hidden) return;
  qv.el.classList.remove('open');
  bloquearScroll(false);
  setTimeout(() => { qv.el.hidden = true; }, 320);
  document.getElementById('ld-producto')?.remove();
  if (qv.ultimoFoco && document.contains(qv.ultimoFoco)) qv.ultimoFoco.focus();
}

function initVista() {
  qv.el = document.getElementById('qv');
  qv.body = document.getElementById('qv-body');
  if (!qv.el || !qv.body) return;
  qv.el.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof window.Element)) return;
    const st = qv.estado;
    if (t.closest('[data-qv-close]')) { cerrarVista(); return; }
    if (!st) return;
    const p = getProducto(st.id);
    const img = t.closest('[data-qv-img]');
    if (img) { st.img = parseInt(img.dataset.qvImg, 10) || 0; pintarVista(); qv.el.querySelector(`[data-qv-img="${st.img}"]`)?.focus(); return; }
    const sb = t.closest('[data-qv-s]');
    if (sb) { st.s = sb.dataset.qvS; pintarVista(); qv.el.querySelector(`[data-qv-s="${st.s}"]`)?.focus(); return; }
    const vb = t.closest('[data-qv-v]');
    if (vb) { st.v = vb.dataset.qvV; pintarVista(); qv.el.querySelector(`[data-qv-v="${st.v}"]`)?.focus(); return; }
    const step = t.closest('[data-qv-step]');
    if (step) { st.qty = Math.max(1, Math.min(20, st.qty + parseInt(step.dataset.qvStep, 10))); qv.el.querySelector('.qv-actions output').textContent = st.qty; return; }
    const rel = t.closest('[data-qv-rel]');
    if (rel) { abrirVista(rel.dataset.qvRel); return; }
    const add = t.closest('[data-qv-add]'), buy = t.closest('[data-qv-buy]');
    if (add || buy) {
      if (pideSabor(p) && !st.s) {
        showToast('Elegí el sabor: Coca-Cola o Sprite');
        qv.el.querySelector('[data-qv-s]')?.focus();
        return;
      }
      Cart.add(p, st.qty, st.v, st.s);
      const comprar = buy || st.comprar;
      cerrarVista();
      if (comprar) openCartDrawer();
      else showToast(textoSumado(p, st.qty, st.v, st.s));
    }
  });
  qv.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrarVista(); return; }
    atraparFoco(qv.el.querySelector('.qv-panel'), e);
  });
  const slug = PARAMS.get('producto');
  if (slug && getProducto(slug)) abrirVista(slug);
}

const pedido = { entrega: 'delivery', nota: '' };
const drawer = { el: null, ultimoFoco: null };
function openCartDrawer() {
  if (!drawer.el) return;
  pintarCarrito();
  if (!drawer.el.hidden) return;
  drawer.ultimoFoco = document.activeElement;
  drawer.el.hidden = false;
  bloquearScroll(true);
  void drawer.el.offsetWidth;
  drawer.el.classList.add('open');
  drawer.el.querySelector('.drawer-close')?.focus();
}
function cerrarCarrito() {
  if (!drawer.el || drawer.el.hidden) return;
  drawer.el.classList.remove('open');
  bloquearScroll(false);
  setTimeout(() => { drawer.el.hidden = true; }, 360);
  if (drawer.ultimoFoco && document.contains(drawer.ultimoFoco)) drawer.ultimoFoco.focus();
}

function mensajePedido(items) {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const det = detalleMsg(p, i.v, i.s);
    return `• ${i.qty} × ${p.nombre}${det ? ` (${det})` : ''}: ${formatearPrecio(precioOp(p, i.v) * i.qty)}`;
  }).filter(Boolean);
  const entrega = pedido.entrega === 'retiro' ? 'Paso a retirar' : 'Delivery (te paso la dirección)';
  const nota = pedido.nota.trim() ? `\nAclaraciones: ${pedido.nota.trim()}` : '';
  return `Hola Burger Adonai! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\nEntrega: ${entrega}${nota}`;
}

function actualizarWspPedido() {
  const items = Cart.get().filter(i => getProducto(i.id));
  const href = items.length ? wspLink(mensajePedido(items)) : wspLink('Hola Burger Adonai! Quiero hacer un pedido.');
  document.querySelectorAll('[data-wsp-pedido]').forEach(a => { a.href = href; });
}

function pintarCarrito() {
  const cont = document.getElementById('cart-items');
  const foot = document.getElementById('cart-foot');
  const extra = document.getElementById('cart-extra');
  if (!cont || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cont.innerHTML = `<div class="cart-vacio"><img src="images/p-doble.webp" alt="" width="1000" height="1000"><p class="cart-vacio-title">Tu pedido está vacío</p><p>Todavía no sumaste ninguna burger. Arrancá por la doble, que nunca falla.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver el menú</a></div>`;
    foot.hidden = true;
    if (extra) extra.hidden = true;
    return;
  }
  foot.hidden = false;
  if (extra) extra.hidden = false;
  cont.innerHTML = `<ul class="cart-lista">${items.map(i => {
    const p = getProducto(i.id);
    const key = lineaKey(i.id, i.v, i.s);
    const det = varTexto(p, i.v, i.s);
    return `<li class="cart-linea" data-key="${esc(key)}">
      <img src="${esc(p.img)}" alt="" width="1000" height="1000">
      <div class="cart-linea-info"><p class="cart-linea-nombre">${esc(p.nombre)}</p>${det ? `<p class="cart-linea-var">${esc(det)}</p>` : ''}
        <div class="stepper stepper--sm" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-cart-step="-1" aria-label="Uno menos">${ICO.minus}</button><output>${i.qty}</output><button type="button" data-cart-step="1" aria-label="Uno más">${ICO.plus}</button></div></div>
      <div class="cart-linea-precio"><strong>${formatearPrecio(precioOp(p, i.v) * i.qty)}</strong><button type="button" class="cart-quitar" data-cart-remove aria-label="Quitar ${esc(p.nombre)}">${ICO.trash}</button></div>
    </li>`;
  }).join('')}</ul>`;
  const upsell = document.getElementById('cart-upsell');
  const lata = getProducto('lata');
  if (upsell) {
    const tieneBebida = items.some(i => getProducto(i.id)?.cats.includes('bebidas'));
    upsell.hidden = tieneBebida || !lata;
    if (lata && !tieneBebida) upsell.innerHTML = `<p class="upsell-titulo">¿Le sumás una latita? <span>${formatearPrecio(precioOp(lata, '354'))}</span></p><div class="upsell-row">${lata.sabores.map(s => `<button type="button" class="upsell-btn" data-upsell="${s}">${ICO.plus}${esc(SABORES[s])}</button>`).join('')}</div>`;
  }
  document.getElementById('cart-total').textContent = formatearPrecio(Cart.total());
  actualizarWspPedido();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  drawer.el = document.getElementById('cart-drawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.addEventListener('cart:updated', () => { updateCartBadge(); actualizarWspPedido(); if (drawer.el && !drawer.el.hidden) pintarCarrito(); });
  updateCartBadge();
  actualizarWspPedido();
  if (!drawer.el) return;
  drawer.el.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof window.Element)) return;
    if (t.closest('[data-drawer-close]')) { cerrarCarrito(); return; }
    const up = t.closest('[data-upsell]');
    if (up) { const lata = getProducto('lata'); if (lata) { Cart.add(lata, 1, '354', up.dataset.upsell); showToast(`Sumaste una lata de ${SABORES[up.dataset.upsell]}`); } return; }
    const linea = t.closest('[data-key]');
    if (linea) {
      const key = linea.dataset.key;
      const it = Cart.get().find(i => lineaKey(i.id, i.v, i.s) === key);
      const step = t.closest('[data-cart-step]');
      if (step && it) {
        const nueva = it.qty + parseInt(step.dataset.cartStep, 10);
        if (nueva < 1) Cart.remove(key); else Cart.setQty(key, nueva);
        return;
      }
      if (t.closest('[data-cart-remove]')) { Cart.remove(key); drawer.el.querySelector('.drawer-close')?.focus(); return; }
    }
    if (t.closest('#cart-checkout')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.el.addEventListener('change', e => {
    const t = e.target;
    if (t instanceof window.HTMLInputElement && t.name === 'entrega') { pedido.entrega = t.value; actualizarWspPedido(); }
  });
  drawer.el.addEventListener('input', e => {
    const t = e.target;
    if (t instanceof window.HTMLTextAreaElement && t.id === 'cart-nota') { pedido.nota = t.value.slice(0, 160); actualizarWspPedido(); }
  });
  drawer.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrarCarrito(); return; }
    atraparFoco(drawer.el.querySelector('.drawer-panel'), e);
  });
}

function initPanelPedido() {
  const panel = document.getElementById('pedido-panel');
  if (!panel) return;
  const lista = panel.querySelector('[data-pedido-lista]');
  const total = panel.querySelector('[data-pedido-total]');
  const pie = panel.querySelector('[data-pedido-pie]');
  const pintar = () => {
    const items = Cart.get().filter(i => getProducto(i.id));
    panel.classList.toggle('con-items', items.length > 0);
    if (pie) pie.hidden = !items.length;
    if (!items.length) {
      lista.innerHTML = '<p class="pedido-vacio">Todavía no sumaste nada. Tocá <strong>Sumar</strong> en lo que se te antoje y lo vas viendo acá.</p>';
      return;
    }
    lista.innerHTML = `<ul>${items.map(i => {
      const p = getProducto(i.id);
      const key = lineaKey(i.id, i.v, i.s);
      const det = varTexto(p, i.v, i.s);
      return `<li class="pedido-linea" data-pkey="${esc(key)}"><div class="pedido-linea-info"><p>${esc(p.nombre)}</p>${det ? `<small>${esc(det)}</small>` : ''}</div><div class="stepper stepper--sm" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-p-step="-1" aria-label="Uno menos">${ICO.minus}</button><output>${i.qty}</output><button type="button" data-p-step="1" aria-label="Uno más">${ICO.plus}</button></div><strong>${formatearPrecio(precioOp(p, i.v) * i.qty)}</strong></li>`;
    }).join('')}</ul>`;
    if (total) total.textContent = formatearPrecio(Cart.total());
  };
  panel.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof window.Element)) return;
    const step = t.closest('[data-p-step]');
    const li = t.closest('[data-pkey]');
    if (step && li) {
      const key = li.dataset.pkey;
      const it = Cart.get().find(i => lineaKey(i.id, i.v, i.s) === key);
      if (!it) return;
      const nueva = it.qty + parseInt(step.dataset.pStep, 10);
      if (nueva < 1) Cart.remove(key); else Cart.setQty(key, nueva);
      return;
    }
    if (t.closest('[data-pedido-finalizar]')) openCartDrawer();
  });
  document.addEventListener('cart:updated', pintar);
  pintar();
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    if (nav.classList.contains('open')) document.body.classList.remove('no-scroll');
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlaysAbiertos > 0) document.body.classList.add('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
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

function marcarCategoriaActiva(cats) {
  const act = cats && cats.length === 1 ? cats[0] : '';
  document.querySelectorAll('[data-menu-cats] .drop-link').forEach(a => {
    if (PAGINA === 'catalogo' && a.dataset.cat === act) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function initMenuCats() {
  document.querySelectorAll('[data-menu-cats]').forEach(box => {
    box.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<a class="drop-link" data-cat="${c.id}" href="${URL_CATALOGO}?cat=${c.id}"><img src="${esc(c.img)}" alt="" width="96" height="96"><span><strong>${esc(c.nombre)}</strong><small>${n} ${n === 1 ? 'opción' : 'opciones'}</small></span></a>`;
    }).join('') + `<a class="drop-all" href="${URL_CATALOGO}">Ver todo el menú ${ICO.arrow}</a>`;
  });
  marcarCategoriaActiva(PAGINA === 'catalogo' ? (PARAMS.get('cat') || '').split(',') : []);
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 961px)');
  document.querySelectorAll('[data-drop]').forEach(drop => {
    const btn = drop.querySelector('.nav-drop-btn');
    if (!btn) return;
    let timer = 0;
    const set = open => { drop.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!drop.classList.contains('open')));
    drop.addEventListener('mouseenter', () => { if (!hoverMq.matches) return; clearTimeout(timer); set(true); });
    drop.addEventListener('mouseleave', () => { if (!hoverMq.matches) return; clearTimeout(timer); timer = setTimeout(() => set(false), 120); });
    drop.addEventListener('focusout', e => { if (hoverMq.matches && !drop.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', e => { if (hoverMq.matches && e.target instanceof window.Node && !drop.contains(e.target)) set(false); });
    drop.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('open')) { e.stopPropagation(); set(false); btn.focus(); } });
  });
}

function initEstado() {
  const cortos = document.querySelectorAll('[data-estado-corto]');
  const largos = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('[data-dia]');
  if (!cortos.length && !largos.length && !filas.length) return;
  const pintar = () => {
    const st = estadoLocal();
    cortos.forEach(el => { el.classList.toggle('is-open', st.abierto); el.innerHTML = `<span class="estado-dot" aria-hidden="true"></span>${esc(st.texto)}`; });
    largos.forEach(el => { el.classList.toggle('is-open', st.abierto); el.innerHTML = `<span class="estado-dot" aria-hidden="true"></span><strong>${esc(st.texto)}</strong><span>${esc(st.detalle)}</span>`; });
    filas.forEach(f => {
      const hoy = Number(f.dataset.dia) === st.turno;
      f.classList.toggle('hoy', hoy);
      const tag = f.querySelector('.hoy-tag');
      if (tag) tag.hidden = !hoy;
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-34.567, -58.6);
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: false }).setView(centro, 14);
  L.control.zoom({ position: 'topright' }).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span class="pin-in"><img src="images/logo.jpg" alt="" width="150" height="150"></span>', iconSize: [56, 56], iconAnchor: [28, 28] });
  L.marker(centro, { icon: icono, alt: 'Burger Adonai en Loma Hermosa', keyboard: false }).addTo(mapa);
}

function initTotales() {
  const n = Tienda.contar();
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = n; });
}

function initDestacados() {
  const grid = document.getElementById('destacados-grid');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { ids: DESTACADOS_HOME }, limite: DESTACADOS_HOME.length });
  items.forEach(cachear);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initMedallones() {
  const box = document.getElementById('medallones-box');
  if (!box) return;
  const { items } = Tienda.consultar({ filtros: { cat: 'hamburguesas', med: [1, 2, 3, 4] }, limite: 4 });
  items.forEach(cachear);
  if (!items.length) return;
  const botones = box.querySelector('[data-med-botones]');
  const foto = box.querySelector('[data-med-foto]');
  const num = box.querySelector('[data-med-num]');
  const nombre = box.querySelector('[data-med-nombre]');
  const desc = box.querySelector('[data-med-desc]');
  const precio = box.querySelector('[data-med-precio]');
  botones.innerHTML = items.map(p => `<button type="button" class="med-btn" data-med="${esc(p.id)}" aria-pressed="false"><span class="med-btn-num">${p.med}</span><span class="med-btn-txt">${esc(p.corto)}<small>${formatearPrecio(precioOp(p, vDefault(p)))}</small></span></button>`).join('');
  if (!reduceMotion) items.forEach(p => { const im = new window.Image(); im.src = p.img; });
  let actual = '';
  let primera = true;
  const elegir = (id, foco) => {
    const p = getProducto(id);
    if (!p || id === actual) return;
    actual = id;
    box.dataset.id = p.id;
    box.dataset.v = vDefault(p);
    botones.querySelectorAll('[data-med]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.med === id)));
    if (num) num.textContent = p.med;
    if (nombre) nombre.textContent = p.nombre;
    if (desc) desc.textContent = p.desc;
    if (precio) precio.innerHTML = precioHTML(p, vDefault(p));
    const out = box.querySelector('.stepper output');
    if (out) out.textContent = '1';
    if (foto) {
      const cambiar = () => { foto.src = p.img; foto.alt = p.alt; foto.classList.remove('saliendo'); };
      if (reduceMotion || primera) cambiar();
      else { foto.classList.add('saliendo'); setTimeout(cambiar, 220); }
    }
    primera = false;
    if (foco) botones.querySelector(`[data-med="${id}"]`)?.focus();
  };
  botones.addEventListener('click', e => {
    const b = e.target instanceof window.Element ? e.target.closest('[data-med]') : null;
    if (b) elegir(b.dataset.med, false);
  });
  botones.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const ids = items.map(p => p.id);
    const i = ids.indexOf(actual);
    elegir(ids[(i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length], true);
  });
  elegir(items.find(p => p.med === 2)?.id || items[0].id, false);
}

function initPromo() {
  const box = document.getElementById('promo-box');
  if (!box) return;
  const p = getProducto(PROMO_HOME);
  if (!p) { box.hidden = true; return; }
  const precio = box.querySelector('[data-promo-precio]');
  const ahorro = box.querySelector('[data-promo-ahorro]');
  if (precio) precio.innerHTML = precioHTML(p, vDefault(p));
  if (ahorro) ahorro.textContent = `Ahorrás ${formatearPrecio(ahorroDe(p))} contra pedirlos por separado`;
}

function initCarta() {
  const lista = document.getElementById('carta-lista');
  if (!lista) return;
  const tabs = [...document.querySelectorAll('[data-carta-tab]')];
  const pintar = cat => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, limite: 8 });
    items.forEach(cachear);
    lista.innerHTML = items.map(p => filaHTML(p)).join('');
    revelarNuevos(lista);
    refrescarScroll();
  };
  const activar = (tab, foco) => {
    tabs.forEach(x => { const on = x === tab; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    if (tab.id) lista.setAttribute('aria-labelledby', tab.id);
    if (foco) tab.focus();
    pintar(tab.dataset.cartaTab);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab, false));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
  pintar('');
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const form = document.getElementById('filtros');
  const buscador = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const cuenta = document.getElementById('cat-cuenta');
  const verMas = document.getElementById('ver-mas');
  const vacio = document.getElementById('cat-vacio');
  const titulo = document.getElementById('cat-titulo');
  const bajada = document.getElementById('cat-bajada');
  const miga = document.getElementById('miga-cat');
  const chips = [...document.querySelectorAll('[data-chip-cat]')];
  const panel = document.getElementById('filtros-panel');
  const abrirFiltros = document.getElementById('abrir-filtros');
  const badgeFiltros = document.getElementById('filtros-activos');
  const comoFila = grid.dataset.vista === 'filas';
  const h1Base = titulo?.textContent || '';
  const bajadaBase = bajada?.textContent || '';

  const lista = k => (PARAMS.get(k) || '').split(',').filter(Boolean);
  const estado = {
    q: (PARAMS.get('q') || '').slice(0, 60),
    cat: lista('cat').filter(id => catDe(id)),
    med: lista('med').filter(m => MEDALLONES[m]),
    precio: RANGOS[PARAMS.get('precio')] ? PARAMS.get('precio') : '',
    orden: ORDENES[PARAMS.get('orden')] ? PARAMS.get('orden') : 'carta',
  };

  const grupo = (tit, f, opciones) => `<fieldset class="f-grupo" data-animate="subir" style="opacity:0;transform:translateY(24px)"><legend>${tit}</legend>${opciones.map(([v, nombre, n]) =>
    `<label class="f-check"><input type="checkbox" data-f="${f}" value="${v}"><span>${esc(nombre)}</span><small>${n}</small></label>`).join('')}</fieldset>`;
  if (form) {
    form.innerHTML = [
      grupo('Categoría', 'cat', CATEGORIAS.map(c => [c.id, c.nombre, Tienda.contar({ cat: c.id })])),
      grupo('Medallones', 'med', Object.entries(MEDALLONES).map(([k, n]) => [k, `${n} (${k})`, Tienda.contar({ med: [Number(k)] })])),
      `<fieldset class="f-grupo" data-animate="subir" style="opacity:0;transform:translateY(24px)"><legend>Precio</legend>${Object.entries(RANGOS).map(([k, r]) =>
        `<label class="f-check f-radio"><input type="radio" name="precio" value="${k}"><span>${esc(r.nombre)}</span></label>`).join('')}</fieldset>`,
      '<button type="button" class="f-limpiar" data-limpiar>Limpiar filtros</button>',
    ].join('');
  }
  if (orden) orden.innerHTML = Object.entries(ORDENES).map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('');

  const sincronizarUI = () => {
    form?.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form?.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador && buscador.value !== estado.q) buscador.value = estado.q;
    if (orden) orden.value = estado.orden;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.chipCat === '' ? !estado.cat.length : estado.cat.length === 1 && estado.cat[0] === c.dataset.chipCat)));
    const una = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    if (titulo) titulo.textContent = una ? una.nombre : h1Base;
    if (bajada) bajada.textContent = una ? una.bajada : bajadaBase;
    if (miga) { miga.hidden = !una; miga.textContent = una ? una.nombre : ''; }
    document.title = una ? `${una.nombre} — Burger Adonai` : 'El menú — Burger Adonai';
    const activos = estado.cat.length + estado.med.length + (estado.precio ? 1 : 0);
    if (badgeFiltros) { badgeFiltros.textContent = activos; badgeFiltros.hidden = !activos; }
    form?.querySelector('[data-limpiar]')?.toggleAttribute('disabled', !activos && !estado.q);
    marcarCategoriaActiva(estado.cat);
  };

  const escribirURL = () => {
    const u = new URLSearchParams();
    if (estado.q) u.set('q', estado.q);
    ['cat', 'med'].forEach(k => { if (estado[k].length) u.set(k, estado[k].join(',')); });
    if (estado.precio) u.set('precio', estado.precio);
    if (estado.orden !== 'carta') u.set('orden', estado.orden);
    const qs = u.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  const filtrosDe = () => {
    const r = RANGOS[estado.precio];
    return { cat: estado.cat, med: estado.med.map(Number), precioMin: r?.min, precioMax: r?.max };
  };

  let cursor = null;
  let mostrados = 0;
  const pintar = agregar => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (comoFila ? filaHTML(p) : cardHTML(p))).join('');
    if (agregar) { grid.insertAdjacentHTML('beforeend', html); mostrados += res.items.length; }
    else { grid.innerHTML = html; mostrados = res.items.length; }
    if (verMas) verMas.hidden = !cursor;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»` : '';
      else cuenta.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'opción' : 'opciones'}`;
    }
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    revelarNuevos(grid);
    refrescarScroll();
  };

  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(false); };

  form?.addEventListener('change', e => {
    const i = e.target;
    if (!(i instanceof window.HTMLInputElement)) return;
    if (i.name === 'precio') estado.precio = i.value;
    else if (i.dataset.f) estado[i.dataset.f] = [...form.querySelectorAll(`input[data-f="${i.dataset.f}"]:checked`)].map(x => x.value);
    aplicar();
  });
  const limpiar = () => { estado.q = ''; estado.cat = []; estado.med = []; estado.precio = ''; aplicar(); };
  form?.addEventListener('click', e => { if (e.target instanceof window.Element && e.target.closest('[data-limpiar]')) limpiar(); });
  document.getElementById('cat-limpiar')?.addEventListener('click', () => { limpiar(); buscador?.focus(); });
  chips.forEach(c => c.addEventListener('click', () => { estado.cat = c.dataset.chipCat ? [c.dataset.chipCat] : []; aplicar(); }));
  orden?.addEventListener('change', () => { estado.orden = ORDENES[orden.value] ? orden.value : 'carta'; aplicar(); });
  let tBusca = 0;
  buscador?.addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  buscador?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBusca); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas?.addEventListener('click', () => pintar(true));
  if (PARAMS.has('q') && buscador) buscador.focus({ preventScroll: true });

  if (panel && abrirFiltros) {
    let ultimo = null;
    const abierto = () => panel.classList.contains('open');
    const cerrar = () => {
      if (!abierto()) return;
      panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false');
      bloquearScroll(false); panel.setAttribute('inert', '');
      ultimo?.focus();
    };
    const abrir = () => {
      ultimo = document.activeElement;
      panel.removeAttribute('inert'); panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true');
      bloquearScroll(true);
      panel.querySelector('.filtros-cerrar')?.focus();
    };
    const fijoMq = window.matchMedia(MODELO === '1' ? '(min-width: 1025px)' : '(min-width: 99999px)');
    const syncPanel = () => { if (fijoMq.matches) { cerrar(); panel.removeAttribute('inert'); } else if (!abierto()) panel.setAttribute('inert', ''); };
    fijoMq.addEventListener('change', syncPanel);
    syncPanel();
    abrirFiltros.addEventListener('click', abrir);
    document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
    panel.addEventListener('keydown', e => {
      if (!abierto()) return;
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
      atraparFoco(panel, e);
    });
  }

  sincronizarUI();
  pintar(false);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-dato', { y: 14, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  paso('.chispa', { scale: 0.92, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.9);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amp = parseFloat(el.dataset.parallax) || 4;
    gsap.fromTo(el, { yPercent: -amp }, {
      yPercent: amp, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
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

function initModeloQuery() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => {
    a.addEventListener('click', () => { a.href = a.getAttribute('href').split('?')[0] + location.search; });
  });
}

[
  initModelBarScroll, initModeloQuery, initTotales, initMenuCats, initEstado,
  initDestacados, initMedallones, initPromo, initCarta, initCatalogo,
  initCompra, initVista, initCarrito, initPanelPedido, initFloats,
  initMapa, initReveals, initNav, initHeroMotion, initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
