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

const WSP = '5493484311313';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'membrillo', nombre: 'Membrillo', img: 'images/p-membrillo.webp',
    bajada: 'El clásico de siempre: hojaldre dorado con dulce de membrillo, secos o bañados en almíbar.' },
  { id: 'batata', nombre: 'Batata', img: 'images/p-batata.webp',
    bajada: 'Hojaldre casero con dulce de batata, más suave y menos ácido que el membrillo.' },
  { id: 'dulce-de-leche', nombre: 'Dulce de leche', img: 'images/p-dulce-de-leche.webp',
    bajada: 'Rellenos con dulce de leche repostero, cremoso adentro y crocante por fuera.' },
  { id: 'surtidos', nombre: 'Surtidos y bandejas', img: 'images/p-surtidos.webp',
    bajada: 'Los tres sabores juntos, en caja para regalar o en bandeja para compartir.' },
];
const SABORES = { membrillo: 'Membrillo', batata: 'Batata', 'dulce-de-leche': 'Dulce de leche' };
const PRES = {
  6: { nombre: 'Media docena', corto: '6 u.' },
  12: { nombre: 'Docena', corto: '12 u.' },
  24: { nombre: 'Dos docenas', corto: '24 u.' },
  36: { nombre: 'Tres docenas', corto: '36 u.' },
};
const TERM = { clasico: 'Clásicos', almibar: 'Con almíbar' };
const RANGOS = {
  hasta10: { nombre: 'Hasta $10.000', max: 10000 },
  '10a20': { nombre: '$10.000 a $20.000', min: 10001, max: 20000 },
  mas20: { nombre: 'Más de $20.000', min: 20001 },
};
const ORDENES = { destacados: 'Los más pedidos', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const SABORES_HOME = ['pastelitos-membrillo', 'pastelitos-batata', 'pastelitos-dulce-de-leche'];

const PRODUCTOS = [
  { id: 'pastelitos-membrillo', nombre: 'Pastelitos de membrillo', cats: ['membrillo'], term: 'clasico', rango: 1,
    ops: [{ v: '6', precio: 7900 }, { v: '12', precio: 14900 }], descuento: 0,
    img: 'images/p-membrillo.webp', galeria: ['images/p-membrillo.webp', 'images/detalle-hojaldre.webp'],
    alt: 'Dos pastelitos de hojaldre dorado con dulce de membrillo en el centro, sobre un plato de cerámica',
    corto: 'Hojaldre crocante con dulce de membrillo',
    desc: 'Hojaldre casero frito hasta quedar dorado, con dulce de membrillo en el centro. Crocantes por fuera y tiernos donde está el dulce.',
    tags: ['membrillo', 'clasico', 'criollos', 'docena', 'media docena', 'mate', 'merienda'] },
  { id: 'pastelitos-batata', nombre: 'Pastelitos de batata', cats: ['batata'], term: 'clasico', rango: 2,
    ops: [{ v: '6', precio: 7900 }, { v: '12', precio: 14900 }], descuento: 0,
    img: 'images/p-batata.webp', galeria: ['images/p-batata.webp'],
    alt: 'Dos pastelitos de hojaldre con dulce de batata a la vista, sobre un plato claro',
    corto: 'Dulce de batata, más suave y menos ácido',
    desc: 'Hojaldre casero con dulce de batata: más suave y menos ácido que el membrillo, para los que lo prefieren así.',
    tags: ['batata', 'camote', 'clasico', 'criollos', 'docena', 'media docena'] },
  { id: 'pastelitos-dulce-de-leche', nombre: 'Pastelitos de dulce de leche', cats: ['dulce-de-leche'], term: 'clasico', rango: 3,
    ops: [{ v: '6', precio: 8400 }, { v: '12', precio: 15900 }], descuento: 0,
    img: 'images/p-dulce-de-leche.webp', galeria: ['images/p-dulce-de-leche.webp'],
    alt: 'Pastelito de hojaldre partido al medio con dulce de leche cremoso adentro, junto a otro entero',
    corto: 'Dulce de leche cremoso adentro',
    desc: 'Hojaldre casero relleno con dulce de leche repostero, que queda cremoso adentro y no se escapa al morder.',
    tags: ['dulce de leche', 'ddl', 'cremoso', 'docena', 'media docena'] },
  { id: 'pastelitos-almibar', nombre: 'Pastelitos con almíbar', cats: ['membrillo', 'batata', 'dulce-de-leche'], term: 'almibar', rango: 4,
    sabores: ['membrillo', 'batata', 'dulce-de-leche'], real: true,
    ops: [{ v: '6', precio: 8400 }, { v: '12', precio: 15900 }], descuento: 0,
    img: 'images/p-dulce-almibar.webp', galeria: ['images/p-dulce-almibar.webp', 'images/p-membrillo-almibar.webp', 'images/p-batata-almibar.webp'],
    alt: 'Pastelitos caseros en forma de flor bañados en almíbar, sobre una bandeja celeste',
    corto: 'Bañados en almíbar, con el relleno que elijas',
    desc: 'Los pastelitos de la casa bañados en almíbar después de fritos: brillantes, más dulces y con las capas bien marcadas. Elegí el relleno.',
    tags: ['almibar', 'bañados', 'flor', 'criollos', 'receta de la casa', 'membrillo', 'batata', 'dulce de leche'] },
  { id: 'pastelitos-surtidos', nombre: 'Pastelitos surtidos', cats: ['surtidos'], term: 'clasico', rango: 5,
    ops: [{ v: '6', precio: 8200 }, { v: '12', precio: 15400 }], descuento: 0,
    img: 'images/p-surtidos.webp', galeria: ['images/p-surtidos.webp'],
    alt: 'Plato con pastelitos surtidos de membrillo, batata y dulce de leche',
    corto: 'Los tres sabores, en partes iguales',
    desc: 'Los tres sabores en el mismo pedido: membrillo, batata y dulce de leche en partes iguales (2 de cada uno en la media docena, 4 en la docena).',
    tags: ['surtidos', 'mixtos', 'variados', 'tres sabores', 'docena', 'media docena'] },
  { id: 'caja-regalo', nombre: 'Caja para regalar', cats: ['surtidos'], term: 'clasico', rango: 6,
    ops: [{ v: '6', precio: 9200 }, { v: '12', precio: 16900 }], descuento: 0,
    img: 'images/p-caja.webp', galeria: ['images/p-caja.webp'],
    alt: 'Caja de cartón kraft abierta con seis pastelitos de hojaldre dorado',
    corto: 'Surtidos en caja kraft, listos para llevar',
    desc: 'Pastelitos surtidos en caja de cartón kraft, listos para llevar a una visita o regalar en un cumpleaños.',
    tags: ['caja', 'regalo', 'regalar', 'kraft', 'cumpleaños', 'visita', 'surtidos'] },
  { id: 'bandeja-compartir', nombre: 'Bandeja para compartir', cats: ['surtidos'], term: 'clasico', rango: 7,
    ops: [{ v: '24', precio: 29900 }, { v: '36', precio: 43900 }], descuento: 10,
    img: 'images/p-bandeja.webp', galeria: ['images/p-bandeja.webp', 'images/hero-pastelitos.webp'],
    alt: 'Bandeja de cerámica con pastelitos de membrillo apilados sobre una mesa de madera',
    corto: 'Dos o tres docenas para la mesa dulce',
    desc: 'Dos o tres docenas surtidas en bandeja, para cumpleaños, reuniones del trabajo o la mesa dulce de un evento.',
    tags: ['bandeja', 'compartir', 'cumpleaños', 'evento', 'reunion', 'mesa dulce', 'surtidos', 'oferta'] },
  { id: 'borrador-mini', nombre: 'Mini pastelitos (borrador)', cats: ['surtidos'], term: 'clasico', visible: false,
    ops: [{ v: '24', precio: 1 }], descuento: 0, img: 'images/p-surtidos.webp', galeria: [], alt: '', corto: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const opDe = (p, v) => p.ops.find(o => o.v === String(v)) || p.ops[0];
const vDefault = p => (p.ops.find(o => o.v === '12') || p.ops[0]).v;
const precioLista = (p, v) => opDe(p, v).precio;
const precioOp = (p, v) => (p.descuento > 0 ? redondear(precioLista(p, v) * (1 - p.descuento / 100)) : precioLista(p, v));
const precioDesde = p => Math.min(...p.ops.map(o => precioOp(p, o.v)));
const unidades = v => parseInt(v, 10) || 1;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const pideSabor = p => Array.isArray(p.sabores) && p.sabores.length > 1;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cats = lista(f.cat), terms = lista(f.term), pres = lista(f.pres), excluir = lista(f.excluir);
    if (cats.length && !p.cats.some(c => cats.includes(c))) return false;
    if (terms.length && !terms.includes(p.term)) return false;
    if (pres.length && !p.ops.some(o => pres.includes(o.v))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
      p.nombre, ...p.cats.map(c => catDe(c)?.nombre), TERM[p.term], p.corto, p.desc,
      ...p.ops.map(o => PRES[o.v]?.nombre), ...(p.sabores || []).map(s => SABORES[s]), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
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

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const lineaKey = (id, v, s) => `${id}|${v}|${s || ''}`;
const varTexto = (v, s) => [PRES[v]?.nombre, SABORES[s]].filter(Boolean).join(' · ');

const Cart = {
  KEY: 'pastelitoslacordobesa_cart',
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
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
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

function saborHTML(p, ctxSabor = '') {
  if (pideSabor(p)) {
    const dots = p.sabores.map(s => `<span class="dot dot--${s}"></span>`).join('');
    return `<p class="prod-sabor"><span class="dots">${dots}</span>${ctxSabor ? `Relleno de ${esc(SABORES[ctxSabor].toLowerCase())}` : 'Elegí el relleno'}</p>`;
  }
  const c = p.cats[0];
  return `<p class="prod-sabor"><span class="dots"><span class="dot dot--${c}"></span></span>${esc(c === 'surtidos' ? 'Tres sabores' : catDe(c)?.nombre)}</p>`;
}

function presHTML(p, v) {
  if (p.ops.length < 2) return `<p class="pres-unica">${esc(PRES[p.ops[0].v].nombre)}</p>`;
  return `<div class="pres" role="group" aria-label="Presentación">${p.ops.map(o =>
    `<button type="button" class="pres-btn" data-v="${o.v}" aria-pressed="${o.v === v}" aria-label="${esc(PRES[o.v].nombre)}">${esc(PRES[o.v].corto)}</button>`).join('')}</div>`;
}

function precioHTML(p, v) {
  const fin = precioOp(p, v);
  const tachado = p.descuento > 0 ? ` <s>${formatearPrecio(precioLista(p, v))}</s>` : '';
  return `<strong>${formatearPrecio(fin)}</strong>${tachado}<span class="prod-unit">${formatearPrecio(fin / unidades(v))} c/u</span>`;
}

const stepperHTML = () => `<div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Uno menos">${ICO.minus}</button><output aria-live="polite">1</output><button type="button" data-step="1" aria-label="Uno más">${ICO.plus}</button></div>`;

function badgesHTML(p) {
  const b = [p.real ? '<span class="badge badge--real">Foto real</span>' : '', p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''].join('');
  return b ? `<span class="prod-badges">${b}</span>` : '';
}

function cardHTML(p, anim = true, ctxSabor = '') {
  const v = vDefault(p);
  const s = pideSabor(p) && p.sabores.includes(ctxSabor) ? ctxSabor : '';
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="prod-card" data-id="${esc(p.id)}" data-v="${v}" data-s="${s}"${a}>
    <button type="button" class="prod-media" data-quick aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200">${badgesHTML(p)}</button>
    <div class="prod-body">
      ${saborHTML(p, s)}
      <h3 class="prod-name"><button type="button" data-quick>${esc(p.nombre)}</button></h3>
      ${presHTML(p, v)}
      <p class="prod-price">${precioHTML(p, v)}</p>
      <div class="prod-actions">${stepperHTML()}<button type="button" class="btn btn--cta prod-add" data-add>${pideSabor(p) && !s ? 'Elegir' : 'Agregar'}</button></div>
      <button type="button" class="prod-buy" data-buy>Comprar ahora</button>
    </div>
  </article>`;
}

function saborCardHTML(p) {
  const c = p.cats[0];
  const cat = catDe(c);
  const v = vDefault(p);
  const href = `${URL_CATALOGO}?cat=${c}`;
  return `<article class="sabor-card sabor-card--${c}" data-id="${esc(p.id)}" data-v="${v}" data-s="" data-animate="subir" style="opacity:0;transform:translateY(48px)">
    <a class="sabor-media" href="${href}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200"></a>
    <div class="sabor-body">
      <h3 class="sabor-name"><a href="${href}">${esc(cat.nombre)}</a></h3>
      <p class="sabor-corto">${esc(p.corto)}</p>
      <div class="sabor-row">${presHTML(p, v)}<p class="prod-price">${precioHTML(p, v)}</p></div>
      <div class="sabor-actions"><button type="button" class="btn btn--cta prod-add" data-add>Agregar<span class="add-extra"> al pedido</span></button><a class="sabor-link" href="${href}">Ver los de ${esc(cat.nombre.toLowerCase())} ${ICO.chevron}</a></div>
    </div>
  </article>`;
}

function filaHTML(p, anim = true, ctxSabor = '') {
  const v = vDefault(p);
  const s = pideSabor(p) && p.sabores.includes(ctxSabor) ? ctxSabor : '';
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : '';
  return `<article class="carta-fila" data-id="${esc(p.id)}" data-v="${v}" data-s="${s}"${a}>
    <button type="button" class="carta-foto" data-quick aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200">${p.real ? '<span class="badge badge--real">Foto real</span>' : ''}</button>
    <div class="carta-info">
      ${saborHTML(p, s)}
      <h3 class="carta-nombre"><button type="button" data-quick>${esc(p.nombre)}</button></h3>
      <p class="carta-corto">${esc(p.corto)}</p>
      ${presHTML(p, v)}
    </div>
    <div class="carta-compra">
      <p class="prod-price">${precioHTML(p, v)}</p>
      <button type="button" class="carta-sumar" data-add aria-label="Sumar ${esc(p.nombre)} al pedido">${ICO.plus}<span>${pideSabor(p) && !s ? 'Elegir' : 'Sumar'}</span></button>
    </div>
  </article>`;
}

function qtyDe(box) {
  const out = box.querySelector('.stepper output');
  return Math.max(1, parseInt(out?.textContent || '1', 10) || 1);
}

function elegirPres(box, v) {
  const p = getProducto(box.dataset.id);
  if (!p) return;
  box.dataset.v = v;
  box.querySelectorAll('.pres-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  const precio = box.querySelector('.prod-price');
  if (precio) precio.innerHTML = precioHTML(p, v);
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
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${varTexto(v, s).toLowerCase()} de ${p.nombre.toLowerCase().replace('pastelitos ', '')}`);
}

function initCompra() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof Element) || t.closest('#qv') || t.closest('#cart-drawer')) return;
    const box = t.closest('[data-id]');
    if (!box) return;
    const pres = t.closest('.pres-btn');
    if (pres) { elegirPres(box, pres.dataset.v); return; }
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
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'La Cordobesa' },
    offers: p.ops.map(o => ({ '@type': 'Offer', name: PRES[o.v].nombre, price: precioOp(p, o.v), priceCurrency: 'ARS', availability: 'https://schema.org/InStock' })),
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
  const sabores = pideSabor(p) ? `<fieldset class="qv-opts"><legend>Relleno</legend><div class="qv-opt-row">${p.sabores.map(s => `<button type="button" class="opt-btn" data-qv-s="${s}" aria-pressed="${s === st.s}"><span class="dot dot--${s}"></span>${esc(SABORES[s])}</button>`).join('')}</div></fieldset>` : '';
  const pres = `<fieldset class="qv-opts"><legend>Presentación</legend><div class="qv-opt-row">${p.ops.map(o => `<button type="button" class="opt-btn" data-qv-v="${o.v}" aria-pressed="${o.v === st.v}">${esc(PRES[o.v].nombre)}<small>${formatearPrecio(precioOp(p, o.v))}</small></button>`).join('')}</div></fieldset>`;
  const rel = Tienda.consultar({ filtros: { cat: p.cats, excluir: [p.id] }, limite: 3 }).items;
  const extra = rel.length < 3 ? Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items : [];
  const relacionados = [...rel, ...extra].map(cachear);
  const falta = pideSabor(p) && !st.s;
  const msg = `Hola La Cordobesa! Quería consultar por ${p.nombre.toLowerCase()} (${varTexto(st.v, st.s).toLowerCase()}).`;
  qv.body.innerHTML = `<div class="qv-grid">
    <div class="qv-galeria">
      <div class="qv-main"><img src="${esc(gal[st.img] || p.img)}" alt="${esc(p.alt)}" width="1200" height="1200">${badgesHTML(p)}</div>
      ${thumbs}
    </div>
    <div class="qv-info">
      ${saborHTML(p, st.s)}
      <h2 class="qv-title">${esc(p.nombre)}</h2>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${sabores}
      ${pres}
      <p class="prod-price qv-price">${precioHTML(p, st.v)}</p>
      <div class="qv-actions">
        <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-step="-1" aria-label="Uno menos">${ICO.minus}</button><output aria-live="polite">${st.qty}</output><button type="button" data-qv-step="1" aria-label="Uno más">${ICO.plus}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add>${falta ? 'Elegí el relleno' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button>
      </div>
      <a class="qv-wsp" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a>
      ${relacionados.length ? `<div class="qv-rel"><p class="qv-rel-title">También te puede gustar</p><div class="qv-rel-grid">${relacionados.map(r => `<button type="button" class="qv-rel-item" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="120" height="120"><span>${esc(r.nombre)}</span><small>desde ${formatearPrecio(precioDesde(r))}</small></button>`).join('')}</div></div>` : ''}
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
    if (!(t instanceof Element)) return;
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
        showToast('Elegí el relleno: membrillo, batata o dulce de leche');
        qv.el.querySelector('[data-qv-s]')?.focus();
        return;
      }
      Cart.add(p, st.qty, st.v, st.s);
      const comprar = buy || st.comprar;
      cerrarVista();
      if (comprar) openCartDrawer();
      else showToast(`Sumaste ${st.qty > 1 ? st.qty + ' × ' : ''}${varTexto(st.v, st.s).toLowerCase()} de ${p.nombre.toLowerCase().replace('pastelitos ', '')}`);
    }
  });
  qv.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrarVista(); return; }
    atraparFoco(qv.el.querySelector('.qv-panel'), e);
  });
  const slug = PARAMS.get('producto');
  if (slug && getProducto(slug)) abrirVista(slug);
}

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
    return p ? `• ${i.qty} × ${p.nombre} (${varTexto(i.v, i.s).toLowerCase()}): ${formatearPrecio(precioOp(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola La Cordobesa! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Coordinamos el envío con Moto Uber?`;
}

function pintarCarrito() {
  const cont = document.getElementById('cart-items');
  const foot = document.getElementById('cart-foot');
  if (!cont || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cont.innerHTML = `<div class="cart-vacio"><img src="images/p-surtidos.webp" alt="" width="1200" height="1200"><p class="cart-vacio-title">Tu pedido está vacío</p><p>Elegí una docena de tu sabor favorito y la sumamos acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver los pastelitos</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  cont.innerHTML = `<ul class="cart-lista">${items.map(i => {
    const p = getProducto(i.id);
    const key = lineaKey(i.id, i.v, i.s);
    return `<li class="cart-linea" data-key="${esc(key)}">
      <img src="${esc(p.img)}" alt="" width="1200" height="1200">
      <div class="cart-linea-info"><p class="cart-linea-nombre">${esc(p.nombre)}</p><p class="cart-linea-var">${esc(varTexto(i.v, i.s))}</p>
        <div class="stepper stepper--sm" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-cart-step="-1" aria-label="Uno menos">${ICO.minus}</button><output>${i.qty}</output><button type="button" data-cart-step="1" aria-label="Uno más">${ICO.plus}</button></div></div>
      <div class="cart-linea-precio"><strong>${formatearPrecio(precioOp(p, i.v) * i.qty)}</strong><button type="button" class="cart-quitar" data-cart-remove aria-label="Quitar ${esc(p.nombre)}">${ICO.trash}</button></div>
    </li>`;
  }).join('')}</ul>`;
  document.getElementById('cart-total').textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cart-wsp');
  if (wsp) wsp.href = wspLink(mensajePedido(items));
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
  document.addEventListener('cart:updated', () => { updateCartBadge(); if (drawer.el && !drawer.el.hidden) pintarCarrito(); });
  updateCartBadge();
  if (!drawer.el) return;
  drawer.el.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest('[data-drawer-close]')) { cerrarCarrito(); return; }
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
  drawer.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrarCarrito(); return; }
    atraparFoco(drawer.el.querySelector('.drawer-panel'), e);
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
    }).join('') + `<a class="drop-all" href="${URL_CATALOGO}">Ver todo el catálogo ${ICO.arrow}</a>`;
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
    document.addEventListener('click', e => { if (hoverMq.matches && e.target instanceof Node && !drop.contains(e.target)) set(false); });
    drop.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('open')) { e.stopPropagation(); set(false); btn.focus(); } });
  });
}

function initTotales() {
  const n = Tienda.contar();
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = n; });
}

function initSaboresHome() {
  const grid = document.getElementById('sabores-grid');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { ids: SABORES_HOME }, limite: SABORES_HOME.length });
  items.forEach(cachear);
  grid.innerHTML = items.map(saborCardHTML).join('');
}

function initVistaPrevia() {
  const grid = document.getElementById('preview-grid');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { excluir: SABORES_HOME }, limite: 8 });
  items.forEach(cachear);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initCarta() {
  const lista = document.getElementById('carta-lista');
  if (!lista) return;
  const tabs = [...document.querySelectorAll('[data-carta-tab]')];
  const pintar = cat => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, limite: 8 });
    items.forEach(cachear);
    const extra = items.length % 2 ? `<div class="carta-extra" data-animate="subir" style="opacity:0;transform:translateY(24px)"><p>¿Necesitás más cantidad?<span>Escribinos por WhatsApp y coordinamos el pedido.</span></p><a class="btn btn--claro" href="${wspLink('Hola La Cordobesa! Quería consultar por un pedido grande de pastelitos.')}" target="_blank" rel="noopener">${ICO.wsp}Escribir</a></div>` : '';
    lista.innerHTML = items.map(p => filaHTML(p, true, cat)).join('') + extra;
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
  const h1Base = titulo?.textContent || '';
  const bajadaBase = bajada?.textContent || '';

  const lista = k => (PARAMS.get(k) || '').split(',').filter(Boolean);
  const estado = {
    q: (PARAMS.get('q') || '').slice(0, 60),
    cat: lista('cat').filter(id => catDe(id)),
    term: lista('term').filter(t => TERM[t]),
    pres: lista('pres').filter(v => PRES[v]),
    precio: RANGOS[PARAMS.get('precio')] ? PARAMS.get('precio') : '',
    orden: ORDENES[PARAMS.get('orden')] ? PARAMS.get('orden') : 'destacados',
  };

  const grupo = (titulo, f, opciones) => `<fieldset class="f-grupo" data-animate="subir" style="opacity:0;transform:translateY(24px)"><legend>${titulo}</legend>${opciones.map(([v, nombre, n]) =>
    `<label class="f-check"><input type="checkbox" data-f="${f}" value="${v}"><span>${esc(nombre)}</span><small>${n}</small></label>`).join('')}</fieldset>`;
  if (form) {
    form.innerHTML = [
      grupo('Sabor', 'cat', CATEGORIAS.map(c => [c.id, c.nombre, Tienda.contar({ cat: c.id })])),
      grupo('Terminación', 'term', Object.entries(TERM).map(([k, n]) => [k, n, Tienda.contar({ term: k })])),
      grupo('Presentación', 'pres', Object.entries(PRES).map(([k, o]) => [k, o.nombre, Tienda.contar({ pres: k })])),
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
    if (titulo) titulo.textContent = una ? (una.id === 'surtidos' ? 'Surtidos y bandejas' : `Pastelitos de ${una.nombre.toLowerCase()}`) : h1Base;
    if (bajada) bajada.textContent = una ? una.bajada : bajadaBase;
    if (miga) { miga.hidden = !una; miga.textContent = una ? una.nombre : ''; }
    document.title = una ? `${una.nombre} — Pastelitos La Cordobesa` : 'Catálogo — Pastelitos La Cordobesa';
    const activos = estado.cat.length + estado.term.length + estado.pres.length + (estado.precio ? 1 : 0);
    if (badgeFiltros) { badgeFiltros.textContent = activos; badgeFiltros.hidden = !activos; }
    form?.querySelector('[data-limpiar]')?.toggleAttribute('disabled', !activos && !estado.q);
    marcarCategoriaActiva(estado.cat);
  };

  const escribirURL = () => {
    const u = new URLSearchParams();
    if (estado.q) u.set('q', estado.q);
    ['cat', 'term', 'pres'].forEach(k => { if (estado[k].length) u.set(k, estado[k].join(',')); });
    if (estado.precio) u.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.set('orden', estado.orden);
    const qs = u.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  const filtrosDe = () => {
    const r = RANGOS[estado.precio];
    return { cat: estado.cat, term: estado.term, pres: estado.pres, precioMin: r?.min, precioMax: r?.max };
  };

  let cursor = null;
  let mostrados = 0;
  const pintar = agregar => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const ctx = estado.cat.length === 1 && SABORES[estado.cat[0]] ? estado.cat[0] : '';
    const html = res.items.map(p => cardHTML(p, true, ctx)).join('');
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
    if (!(i instanceof HTMLInputElement)) return;
    if (i.name === 'precio') estado.precio = i.value;
    else if (i.dataset.f) estado[i.dataset.f] = [...form.querySelectorAll(`input[data-f="${i.dataset.f}"]:checked`)].map(x => x.value);
    aplicar();
  });
  const limpiar = () => { estado.q = ''; estado.cat = []; estado.term = []; estado.pres = []; estado.precio = ''; aplicar(); };
  form?.addEventListener('click', e => { if (e.target instanceof Element && e.target.closest('[data-limpiar]')) limpiar(); });
  document.getElementById('cat-limpiar')?.addEventListener('click', () => { limpiar(); buscador?.focus(); });
  chips.forEach(c => c.addEventListener('click', () => { estado.cat = c.dataset.chipCat ? [c.dataset.chipCat] : []; aplicar(); }));
  orden?.addEventListener('change', () => { estado.orden = ORDENES[orden.value] ? orden.value : 'destacados'; aplicar(); });
  let tBusca = 0;
  buscador?.addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  buscador?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBusca); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas?.addEventListener('click', () => pintar(true));

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

function initLee() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' '); });
  if (reduceMotion) { els.forEach(el => el.querySelectorAll('.w').forEach(w => w.classList.add('on'))); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45)));
      const ws = el.querySelectorAll('.w');
      const n = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  update();
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = vp?.firstElementChild;
    if (!vp || !track) return;
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
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
        try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
      }
      if (moved) vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      requestAnimationFrame(() => vp.classList.remove('dragging'));
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
    vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    const sync = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    const paso = dir => vp.scrollBy({ left: dir * Math.max(240, vp.clientWidth * 0.7), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => paso(-1));
    next?.addEventListener('click', () => paso(1));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
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

initModelBarScroll();
initModeloQuery();
initTotales();
initMenuCats();
initSaboresHome();
initVistaPrevia();
initCarta();
initCatalogo();
initCompra();
initVista();
initCarrito();
initFloats();
initLee();
initRail();
initReveals();
initNav();
initHeroMotion();
initParallax();
