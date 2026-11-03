const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168234849';
const MARCA = 'Melendez';
const POR_PAGINA = 16;
const MAX_CANT = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'remeras', nombre: 'Remeras', bajada: 'Oversize y clásicas, lisas o lavadas', img: 'images/p-remera-blanca.webp' },
  { id: 'gorras', nombre: 'Gorras', bajada: 'Seis paneles, en cinco colores', img: 'images/p-gorra-azul.webp' },
];
const LINEAS = [
  { id: 'santooz', nombre: 'Línea Santooz', bajada: 'Bordado y estampa en Old English', img: 'images/p-gorra-santooz-negras.webp' },
  { id: 'lisa', nombre: 'Lisas' },
];
const CALCES = [
  { id: 'oversize', nombre: 'Oversize' },
  { id: 'clasica', nombre: 'Clásica' },
];
const TALLES = ['S', 'M', 'L', 'XL', 'XXL'].map(t => ({ id: t, nombre: t }));
const COLORES = [
  { id: 'negro', nombre: 'Negro', hex: '#1B1A18' },
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
  { id: 'gris', nombre: 'Gris', hex: '#8E8A84' },
  { id: 'arena', nombre: 'Arena', hex: '#D8C7A4' },
  { id: 'oliva', nombre: 'Oliva', hex: '#5C6236' },
  { id: 'azul', nombre: 'Azul noche', hex: '#24304D' },
];
const PRECIOS = [
  { id: 'hasta25', nombre: 'Hasta $25.000', min: null, max: 25000 },
  { id: '25a30', nombre: '$25.001 a $30.000', min: 25001, max: 30000 },
  { id: 'mas30', nombre: 'Más de $30.000', min: 30001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const MEDIDAS = {
  oversize: { S: [56, 72], M: [58, 74], L: [60, 76], XL: [62, 78], XXL: [64, 80] },
  clasica: { S: [48, 69], M: [51, 71], L: [54, 73], XL: [57, 75], XXL: [60, 77] },
};
const LETRAS = [
  { id: 'negras', nombre: 'Letras negras', hex: '#161412' },
  { id: 'tono', nombre: 'Tono sobre tono', hex: '#C8B38E' },
  { id: 'blancas', nombre: 'Letras blancas', hex: '#FFFFFF' },
];

const PRODUCTOS = [
  { id: 'remera-santooz-777', nombre: 'Remera Santooz 777', cat: 'remeras', linea: 'santooz', calce: 'oversize', color: 'blanco', precio: 36000, rango: 1, etiqueta: 'Frente y espalda', var: 'talle',
    imgs: [
      { src: 'images/p-santooz-777-frente.webp', lado: 959, nombre: 'Frente', alt: 'Remera blanca oversize con alas, aureola y el número 777 estampados en negro adelante' },
      { src: 'images/p-santooz-777-espalda.webp', lado: 959, nombre: 'Espalda', alt: 'Espalda de la remera blanca con «SantooZ» estampado en letras góticas negras' },
    ],
    desc: 'Remera blanca de calce oversize. Adelante, alas con aureola y el 777; en la espalda, la firma «SantooZ» en Old English.',
    claves: ['alas', 'aureola', 'angel', 'estampa', 'estampada', 'old english', 'gotica', 'firma', 'blanca'] },
  { id: 'gorra-santooz', nombre: 'Gorra Santooz bordada', cat: 'gorras', linea: 'santooz', calce: null, color: 'arena', precio: 28000, rango: 2, etiqueta: 'Bordada', var: 'letras',
    imgs: [
      { src: 'images/p-gorra-santooz-negras.webp', lado: 624, v: 'negras', nombre: 'Letras negras', alt: 'Gorra beige con «Santooz» bordado en letras negras' },
      { src: 'images/p-gorra-santooz-tono.webp', lado: 936, v: 'tono', nombre: 'Tono sobre tono', alt: 'Gorra beige con «Santooz» bordado en el mismo color que la gorra' },
      { src: 'images/p-gorra-santooz-blancas.webp', lado: 643, v: 'blancas', nombre: 'Letras blancas', alt: 'Gorra beige con «Santooz» bordado en letras blancas' },
    ],
    desc: 'Gorra beige de seis paneles con «Santooz» bordado al frente en letras góticas. Elegí las letras: del mismo color que la gorra, negras o blancas.',
    claves: ['bordado', 'bordada', 'old english', 'gotica', 'beige', 'crema', 'letras'] },
  { id: 'remera-oversize-negra', nombre: 'Remera oversize negra', cat: 'remeras', linea: 'lisa', calce: 'oversize', color: 'negro', precio: 29000, rango: 3, etiqueta: 'Oversize', var: 'talle', percha: true,
    imgs: [{ src: 'images/p-remera-negra.webp', lado: 1000, alt: 'Remera negra oversize lisa colgada de una percha de madera' }],
    desc: 'Negra y lisa, de hombros caídos y cuello redondo con ribete. La base para usar sola o debajo de todo.',
    claves: ['lisa', 'basica', 'hombros caidos'] },
  { id: 'remera-oversize-blanca', nombre: 'Remera oversize blanca', cat: 'remeras', linea: 'lisa', calce: 'oversize', color: 'blanco', precio: 29000, rango: 4, etiqueta: 'Oversize', var: 'talle', percha: true,
    imgs: [{ src: 'images/p-remera-blanca.webp', lado: 1000, alt: 'Remera blanca oversize lisa colgada de una percha de madera' }],
    desc: 'Blanca y lisa, de calce amplio y hombros caídos. La que combina con cualquier gorra.',
    claves: ['lisa', 'basica', 'hombros caidos'] },
  { id: 'gorra-crema', nombre: 'Gorra crema', cat: 'gorras', linea: 'lisa', calce: null, color: 'arena', precio: 22000, rango: 5, etiqueta: '', var: 'unico',
    imgs: [{ src: 'images/p-gorra-crema.webp', lado: 900, alt: 'Gorra color crema de seis paneles apoyada sobre un bloque de piedra' }],
    desc: 'Lisa, color crema, de seis paneles y visera curva con costuras paralelas.',
    claves: ['lisa', 'beige', 'crema', 'visera curva'] },
  { id: 'remera-lavada-humo', nombre: 'Remera lavada gris humo', cat: 'remeras', linea: 'lisa', calce: 'oversize', color: 'gris', precio: 32000, rango: 6, etiqueta: 'Lavada', var: 'talle', percha: true, sinStock: ['XXL'],
    imgs: [{ src: 'images/p-remera-humo.webp', lado: 1000, alt: 'Remera oversize gris oscuro con efecto lavado colgada de una percha' }],
    desc: 'Gris oscuro con efecto lavado y terminaciones gastadas. Calce oversize, como la negra y la blanca.',
    claves: ['lavada', 'acid wash', 'gastada', 'vintage', 'gris oscuro'] },
  { id: 'gorra-negra', nombre: 'Gorra negra', cat: 'gorras', linea: 'lisa', calce: null, color: 'negro', precio: 22000, rango: 7, etiqueta: '', var: 'unico',
    imgs: [{ src: 'images/p-gorra-negra.webp', lado: 1000, alt: 'Gorra negra lisa de seis paneles con visera curva' }],
    desc: 'Negra y lisa, de seis paneles con ojalillos bordados y visera curva.',
    claves: ['lisa', 'visera curva'] },
  { id: 'remera-clasica-oliva', nombre: 'Remera clásica oliva', cat: 'remeras', linea: 'lisa', calce: 'clasica', color: 'oliva', precio: 26000, rango: 8, etiqueta: 'Calce clásico', var: 'talle', percha: true,
    imgs: [{ src: 'images/p-remera-oliva.webp', lado: 1000, alt: 'Remera verde oliva de calce clásico colgada de una percha' }],
    desc: 'Verde oliva, de calce clásico: más al cuerpo y con la manga en su lugar.',
    claves: ['lisa', 'verde', 'militar'] },
  { id: 'remera-clasica-arena', nombre: 'Remera clásica arena', cat: 'remeras', linea: 'lisa', calce: 'clasica', color: 'arena', precio: 26000, rango: 9, etiqueta: 'Calce clásico', var: 'talle',
    imgs: [{ src: 'images/p-remera-arena.webp', lado: 1000, alt: 'Remera color arena de calce clásico, lisa, sobre fondo claro' }],
    desc: 'Color arena, lisa y de calce clásico. Va con la gorra crema o con la Santooz.',
    claves: ['lisa', 'beige', 'crema'] },
  { id: 'gorra-azul', nombre: 'Gorra azul noche', cat: 'gorras', linea: 'lisa', calce: null, color: 'azul', precio: 22000, rango: 10, etiqueta: '', var: 'unico',
    imgs: [{ src: 'images/p-gorra-azul.webp', lado: 1000, alt: 'Gorra azul marino lisa de seis paneles con visera curva' }],
    desc: 'Azul noche, lisa, de seis paneles y visera curva con costuras.',
    claves: ['lisa', 'marino', 'visera curva'] },
  { id: 'gorra-gris', nombre: 'Gorra gris lavada', cat: 'gorras', linea: 'lisa', calce: null, color: 'gris', precio: 22000, rango: 11, etiqueta: 'Lavada', var: 'unico',
    imgs: [{ src: 'images/p-gorra-gris.webp', lado: 1000, alt: 'Gorra gris claro con efecto lavado, de seis paneles' }],
    desc: 'Gris claro con efecto lavado. Seis paneles y visera curva.',
    claves: ['lavada', 'gastada', 'vintage', 'visera curva'] },
];

const talleLibre = (p, t) => p.var === 'talle' && TALLES.some(x => x.id === t) && !(p.sinStock || []).includes(t);
function opcionValida(p, v) {
  if (p.var === 'talle') return talleLibre(p, v) ? v : '';
  if (p.var === 'letras') return LETRAS.some(l => l.id === v) ? v : 'negras';
  return 'U';
}
function textoVar(p, v) {
  if (p.var === 'talle') return v ? `Talle ${v}` : 'Sin talle';
  if (p.var === 'letras') return LETRAS.find(l => l.id === v)?.nombre || '';
  return 'Talle único';
}
const imgVar = (p, v) => (p.var === 'letras' ? p.imgs.find(i => i.v === v) : null) || p.imgs[0];
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
function metaDe(p) {
  const a = p.linea === 'santooz' ? 'Santooz' : (p.calce ? nombreDe(CALCES, p.calce) : nombreDe(CATEGORIAS, p.cat).replace(/s$/, ''));
  return `${a} · ${nombreDe(COLORES, p.color)}`;
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, nombreDe(CATEGORIAS, p.cat), nombreDe(LINEAS, p.linea), nombreDe(CALCES, p.calce),
    nombreDe(COLORES, p.color), ...(p.claves || []), p.var === 'talle' ? `talle ${TALLES.map(t => t.id).join(' ')}` : 'talle unico',
    p.var === 'letras' ? LETRAS.map(l => l.nombre).join(' ') : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), linea = lista(f.linea), calce = lista(f.calce), talle = lista(f.talle), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (linea.length && !linea.includes(p.linea)) return false;
    if (calce.length && !calce.includes(p.calce)) return false;
    if (talle.length && !talle.some(t => talleLibre(p, t))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'melendez_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const op = opcionValida(producto, v);
    if (!op) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === op);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: op, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_CANT)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  linea(i) { const p = getProducto(i.id); return p ? precioFinal(p) * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = opcionValida(p, i.v);
      if (!v) { changed = true; return false; }
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, i.qty || 1)); changed = true; }
      return true;
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15.5 15.5 3 21 8.5 8.5 21z"/><path d="m7.5 11.5 2 2M10.5 8.5l2 2M13.5 5.5l2 2"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

function botonCompra(p, clase) {
  if (p.var === 'unico') return `<button type="button" class="${clase}" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}<span>Agregar</span></button>`;
  const t = p.var === 'letras' ? 'Elegir letras' : 'Elegir talle';
  return `<button type="button" class="${clase}" data-qv="${esc(p.id)}" data-elegir aria-label="${t} de ${esc(p.nombre)}">${ICO.mas}<span>${t}</span></button>`;
}
function mediaHTML(p) {
  const b = p.imgs[1] ? `<img class="prod__img prod__img--b" src="${esc(p.imgs[1].src)}" alt="" width="${p.imgs[1].lado}" height="${p.imgs[1].lado}" decoding="async">` : '';
  return `<div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].lado}" height="${p.imgs[0].lado}" decoding="async">${b}</div>`;
}
function cardHTML(p, estilo = 'ficha', animar = true, extra = '') {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const cls = `prod prod--${estilo}${p.percha ? ' prod--percha' : ''}${p.imgs[1] ? ' prod--vuelta' : ''}${extra ? ` ${extra}` : ''}`;
  const badge = p.etiqueta ? `<span class="prod__badge${p.linea === 'santooz' ? ' prod__badge--firma' : ''}">${esc(p.etiqueta)}</span>` : '';
  const precio = `<p class="precio">${formatearPrecio(precioFinal(p))}</p>`;
  if (estilo === 'vitrina') {
    return `<article class="${cls}" data-id="${esc(p.id)}"${anim}>
  ${mediaHTML(p)}${badge}
  ${botonCompra(p, 'prod__sumar')}
  <div class="prod__ticket"><p class="prod__meta">${esc(metaDe(p))}</p><h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>${precio}</div>
</article>`;
  }
  return `<article class="${cls}" data-id="${esc(p.id)}"${anim}>
  ${mediaHTML(p)}${badge}
  <div class="prod__info">
    <p class="prod__meta">${esc(metaDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precio}
    <div class="prod-actions">${botonCompra(p, 'btn btn--cta btn--sm prod-add')}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'prenda' : 'prendas'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${textoVar(p, i.v)}) — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const clave = esc(claveLinea(i.id, i.v));
  const im = imgVar(p, i.v);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(im.src)}" alt="" width="${im.lado}" height="${im.lado}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoVar(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una unidad"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una unidad"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div><p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
  </div>
</li>`;
}
const partirClave = s => { const k = s.indexOf('|'); return [s.slice(0, k), s.slice(k + 1)]; };
function escucharLineas(lista) {
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(...partirClave(q.dataset.quitar)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const [id, v] = partirClave(b.dataset.linea);
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? `${n} ${n === 1 ? 'prenda' : 'prendas'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function initCarritoPanel() {
  const lista = document.querySelector('[data-sel-lista]');
  if (!lista) return;
  const vacio = document.querySelector('[data-sel-vacio]');
  const pie = document.querySelector('[data-sel-pie]');
  const total = document.querySelector('[data-sel-total]');
  const wsp = document.querySelector('[data-sel-wsp]');
  const pintar = () => {
    const items = Cart.get();
    lista.hidden = !items.length;
    vacio.hidden = items.length > 0;
    pie.hidden = !items.length;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function sumar(id, v = '', qty = 1) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, qty, v);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return 0; }
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre}${p.var === 'unico' ? '' : ` (${textoVar(p, opcionValida(p, v))})`} al carrito`);
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) { e.preventDefault(); sumar(s.dataset.sumar, s.dataset.v || ''); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv, { v: qv.dataset.v || '', elegir: qv.hasAttribute('data-elegir') }); }
  });
}

function chipsVar(p, actual, attr) {
  if (p.var === 'talle') {
    return TALLES.map(t => {
      const sin = (p.sinStock || []).includes(t.id);
      return `<button type="button" class="chip chip--talle" ${attr}="${t.id}" aria-pressed="${t.id === actual}"${sin ? ' disabled aria-label="Talle ' + t.id + ' sin stock"' : ''}>${t.id}${sin ? '<small>sin stock</small>' : ''}</button>`;
    }).join('');
  }
  if (p.var === 'letras') {
    return LETRAS.map(l => `<button type="button" class="chip chip--letras" ${attr}="${l.id}" aria-pressed="${l.id === actual}"><span class="swatch" style="--sw:${l.hex}"></span>${esc(l.nombre)}</button>`).join('');
  }
  return '';
}
function medidaTexto(p, t) {
  const m = p.calce && t ? MEDIDAS[p.calce]?.[t] : null;
  if (!m) return p.var === 'talle' ? 'Elegí un talle para ver sus medidas.' : '';
  return `Talle ${t}: ${m[0]} cm de ancho y ${m[1]} de largo, medida en plano.`;
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '', elegir = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: opcionValida(p, v), qty: 1, foto: 0 };
  if (p.var === 'letras') qvEstado.foto = Math.max(0, p.imgs.findIndex(i => i.v === qvEstado.v));
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const thumbs = p.imgs.length > 1 ? `<div class="qv__thumbs" role="group" aria-label="Fotos">${p.imgs.map((im, k) => `<button type="button" class="qv__thumb" data-qv-foto="${k}" aria-pressed="false" aria-label="Ver ${esc(im.nombre || `foto ${k + 1}`)}"><img src="${esc(im.src)}" alt="" width="${im.lado}" height="${im.lado}"><span>${esc(im.nombre || '')}</span></button>`).join('')}</div>` : '';
  const varTitulo = p.var === 'talle' ? 'Talle' : p.var === 'letras' ? 'Letras' : 'Talle';
  const varBloque = p.var === 'unico'
    ? '<p class="qv__var-t">Talle único</p>'
    : `<p class="qv__var-t">${varTitulo}: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="${varTitulo}">${chipsVar(p, qvEstado.v, 'data-qv-op')}</div>${p.var === 'talle' ? '<p class="qv__medida" data-qv-medida></p>' : ''}`;
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img data-qv-img src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].lado}" height="${p.imgs[0].lado}"></div>
    ${thumbs}
  </div>
  <div class="qv__info">
    <p class="prod__meta">${esc(p.linea === 'santooz' ? 'Línea Santooz' : nombreDe(CATEGORIAS, p.cat))} · ${esc(metaDe(p).split(' · ')[1])}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__var">${varBloque}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Unidades"><button type="button" data-qv-paso="-1" aria-label="Restar una unidad" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí un talle para sumarla al carrito.</p>
    <a class="qv__wsp" href="${wspHref(`Hola! Quiero consultar por la ${p.nombre}.`)}" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.imgs[0].src)}" alt="" width="${r.imgs[0].lado}" height="${r.imgs[0].lado}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => {
      const foco = elegir && p.var !== 'unico' ? modal.querySelector('[data-qv-op]:not([disabled])') : null;
      (foco || modal.querySelector('.qv__close'))?.focus();
    }, 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  const im = p.imgs[qvEstado.foto] || p.imgs[0];
  const img = modal.querySelector('[data-qv-img]');
  if (img.getAttribute('src') !== im.src) { img.src = im.src; img.alt = im.alt; img.width = im.lado; img.height = im.lado; }
  modal.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.qvFoto) === qvEstado.foto)));
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === qvEstado.v)));
  const elegida = modal.querySelector('[data-qv-elegida]');
  if (elegida) elegida.textContent = qvEstado.v ? (p.var === 'talle' ? qvEstado.v : textoVar(p, qvEstado.v)) : 'elegí uno';
  const med = modal.querySelector('[data-qv-medida]');
  if (med) med.textContent = medidaTexto(p, qvEstado.v);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioFinal(p) * qvEstado.qty);
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  const detalle = p.var === 'unico' ? '' : qvEstado.v ? ` (${textoVar(p, qvEstado.v)})` : '';
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por la ${p.nombre}${detalle}${qvEstado.qty > 1 ? `, ${qvEstado.qty} unidades` : ''}.`);
  ponerJsonLdProducto(p);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const aviso = modal.querySelector('[data-qv-aviso]');
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      qvEstado.foto = Number(foto.dataset.qvFoto);
      if (p.var === 'letras' && p.imgs[qvEstado.foto]?.v) qvEstado.v = p.imgs[qvEstado.foto].v;
      pintarQv(); return;
    }
    const op = e.target.closest('[data-qv-op]');
    if (op && !op.disabled) {
      qvEstado.v = op.dataset.qvOp;
      if (p.var === 'letras') qvEstado.foto = Math.max(0, p.imgs.findIndex(i => i.v === qvEstado.v));
      aviso.hidden = true; pintarQv(); return;
    }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (!opcionValida(p, qvEstado.v)) {
        aviso.hidden = false;
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return; }
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre}${p.var === 'unico' ? '' : ` (${textoVar(p, qvEstado.v)})`} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.imgs[0].src, location.href).href, brand: { '@type': 'Brand', name: p.linea === 'santooz' ? 'Santooz' : MARCA },
    color: nombreDe(COLORES, p.color),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { }
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
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(Boolean);
  const linea = (params.get('linea') || '').split(',').filter(Boolean);
  const entradas = [
    ...CATEGORIAS.map(c => ({ q: `cat=${c.id}`, n: c.nombre, b: c.bajada, img: c.img, f: { cat: c.id }, cur: cat.length === 1 && cat[0] === c.id && !linea.length })),
    { q: 'linea=santooz', n: LINEAS[0].nombre, b: LINEAS[0].bajada, img: LINEAS[0].img, f: { linea: 'santooz' }, cur: linea.length === 1 && linea[0] === 'santooz' && !cat.length },
  ];
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = entradas.map(x => {
      const r = Tienda.resumen(x.f);
      return `<li><a href="${CATALOGO_URL}?${x.q}"${PAGINA === 'catalogo' && x.cur ? ' aria-current="page"' : ''}><img src="${esc(x.img)}" alt="" width="1000" height="1000"><span><b>${esc(x.n)}</b><small>${esc(x.b)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1081px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1081px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  const filtros = { remeras: { cat: 'remeras' }, gorras: { cat: 'gorras' }, santooz: { linea: 'santooz' } };
  document.querySelectorAll('[data-resumen]').forEach(el => {
    const f = filtros[el.dataset.resumen];
    if (!f) return;
    const r = Tienda.resumen(f);
    el.textContent = `${r.n} ${r.n === 1 ? 'prenda' : 'prendas'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids, filtros = {}) {
  const res = Tienda.consultar({ filtros: { ...filtros, ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = idsDe(cont, 'data-preview');
    const mosaico = cont.hasAttribute('data-mosaico');
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = Tienda.consultar({ filtros: { [k]: v }, limite: 8 }).items;
      } else prods = productosPorIds(ids);
      let html = prods.map((p, k) => cardHTML(p, mosaico ? 'vitrina' : 'ficha', true, mosaico && k === 0 ? 'prod--grande' : '')).join('');
      if (mosaico) {
        const total = Tienda.contar({});
        html += `<a class="mosaico__cta" href="${CATALOGO_URL}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__num" aria-hidden="true">777</span><b>Ver las ${total} prendas</b><span>Con filtros por talle, color y calce ${ICO.flecha}</span></a>`;
      }
      cont.innerHTML = html;
    };
    pintar();
    if (!cont.hasAttribute('data-tabs')) return;
    const tabs = cont.closest('section')?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function initFirma() {
  const sec = document.getElementById('santooz');
  if (!sec) return;
  const body = sec.querySelector('[data-firma-body]');
  const thumbs = sec.querySelector('[data-firma-thumbs]');
  const img = sec.querySelector('[data-firma-img]');
  const fig = img.closest('figure');
  const est = { id: 'gorra-santooz', v: 'negras', foto: 0 };
  const cambiarFoto = im => {
    if (img.getAttribute('src') === im.src) return;
    fig.classList.add('cambia');
    setTimeout(() => {
      img.src = im.src; img.alt = im.alt; img.width = im.lado; img.height = im.lado;
      fig.classList.remove('cambia');
    }, reduceMotion ? 0 : 180);
  };
  const pintar = () => {
    const p = getProducto(est.id);
    if (!p) return;
    const im = p.imgs[est.foto] || p.imgs[0];
    cambiarFoto(im);
    thumbs.innerHTML = p.imgs.map((x, k) => `<button type="button" class="firma__thumb" data-f-foto="${k}" aria-pressed="${k === est.foto}" aria-label="Ver ${esc(x.nombre || '')}"><img src="${esc(x.src)}" alt="" width="${x.lado}" height="${x.lado}"><span>${esc(x.nombre || '')}</span></button>`).join('');
    const titulo = p.var === 'letras' ? 'Letras' : 'Talle';
    const elegida = est.v ? (p.var === 'talle' ? est.v : textoVar(p, est.v)) : 'elegí uno';
    body.innerHTML = `<div class="firma__precio"><p class="precio">${formatearPrecio(precioFinal(p))}</p><span class="firma__nombre">${esc(p.nombre)}</span></div>
<p class="firma__var-t">${titulo}: <b>${esc(elegida)}</b></p>
<div class="chips" role="group" aria-label="${titulo}">${chipsVar(p, est.v, 'data-f-op')}</div>
${p.var === 'talle' ? `<p class="firma__medida">${esc(medidaTexto(p, est.v))}</p>` : ''}
<p class="firma__aviso" data-f-aviso hidden>Elegí un talle para sumarla al carrito.</p>
<div class="firma__acc"><button type="button" class="btn btn--cta" data-f-agregar>Agregar al carrito</button><button type="button" class="btn btn--ghost" data-qv="${esc(p.id)}" data-v="${esc(est.v)}">Ver ficha completa</button></div>`;
  };
  sec.addEventListener('click', e => {
    const tab = e.target.closest('[data-firma]');
    if (tab) {
      if (tab.dataset.firma === est.id) return;
      sec.querySelectorAll('[data-firma]').forEach(b => b.setAttribute('aria-pressed', String(b === tab)));
      est.id = tab.dataset.firma; est.foto = 0;
      const p = getProducto(est.id);
      est.v = p.var === 'letras' ? 'negras' : '';
      pintar(); return;
    }
    const p = getProducto(est.id);
    const f = e.target.closest('[data-f-foto]');
    if (f) {
      est.foto = Number(f.dataset.fFoto);
      if (p.var === 'letras' && p.imgs[est.foto]?.v) est.v = p.imgs[est.foto].v;
      pintar(); return;
    }
    const op = e.target.closest('[data-f-op]');
    if (op && !op.disabled) {
      est.v = op.dataset.fOp;
      if (p.var === 'letras') est.foto = Math.max(0, p.imgs.findIndex(i => i.v === est.v));
      pintar(); return;
    }
    if (e.target.closest('[data-f-agregar]')) {
      if (!opcionValida(p, est.v)) { const a = body.querySelector('[data-f-aviso]'); a.hidden = false; body.querySelector('[data-f-op]:not([disabled])')?.focus(); return; }
      sumar(p.id, est.v);
    }
  });
  pintar();
}

function talleDe(calce, ancho) {
  const tabla = MEDIDAS[calce] || MEDIDAS.oversize;
  const ts = Object.keys(tabla);
  const max = tabla[ts[ts.length - 1]][0];
  if (ancho > max + 2) return { t: null, fuera: 'grande' };
  let mejor = ts[0], dif = Infinity;
  ts.forEach(t => { const d = Math.abs(tabla[t][0] - ancho); if (d <= dif) { dif = d; mejor = t; } });
  return { t: mejor, fuera: ancho < tabla[ts[0]][0] - 3 ? 'chica' : '' };
}
function initTalles() {
  const sec = document.getElementById('talles');
  if (!sec) return;
  const rango = sec.querySelector('[data-t-ancho]');
  const valor = sec.querySelector('[data-t-valor]');
  const letra = sec.querySelector('[data-t-letra]');
  const detalle = sec.querySelector('[data-t-detalle]');
  const tabla = sec.querySelector('[data-t-tabla]');
  const ver = sec.querySelector('[data-t-ver]');
  const wsp = sec.querySelector('[data-t-wsp]');
  let calce = 'oversize';
  const pintar = () => {
    const ancho = Number(rango.value);
    valor.textContent = `${ancho} cm`;
    const r = talleDe(calce, ancho);
    const nombreCalce = calce === 'oversize' ? 'oversize' : 'clásicas';
    letra.textContent = r.t || 'XXL+';
    letra.classList.remove('salta'); void letra.offsetWidth; letra.classList.add('salta');
    const m = r.t ? MEDIDAS[calce][r.t] : null;
    detalle.textContent = r.t
      ? `Tu remera mide ${ancho} cm. El ${r.t} de las remeras ${nombreCalce} mide ${m[0]} de ancho y ${m[1]} de largo${r.fuera === 'chica' ? ': te va a quedar un poco más suelta' : ''}.`
      : `Tu remera mide más que nuestro XXL ${nombreCalce}. Escribinos y vemos qué te queda bien.`;
    tabla.innerHTML = Object.entries(MEDIDAS[calce]).map(([t, [a, l]]) => `<tr${t === r.t ? ' class="es-tuyo"' : ''}><th scope="row">${t}</th><td>${a}</td><td>${l}</td></tr>`).join('');
    ver.hidden = !r.t;
    ver.href = `${CATALOGO_URL}?cat=remeras&calce=${calce}${r.t ? `&talle=${r.t}` : ''}`;
    ver.innerHTML = `Ver remeras ${nombreCalce}${r.t ? ` en ${r.t}` : ''} ${ICO.flecha}`;
    wsp.href = wspHref(`Hola! Quiero consultar el talle: mi remera mide ${ancho} cm de axila a axila y me gusta ${calce === 'oversize' ? 'holgada (oversize)' : 'al cuerpo (clásica)'}.${r.t ? ` La guía me sugiere el ${r.t}.` : ''}`);
  };
  sec.addEventListener('click', e => {
    const c = e.target.closest('[data-t-calce]');
    if (c) {
      calce = c.dataset.tCalce;
      sec.querySelectorAll('[data-t-calce]').forEach(b => b.setAttribute('aria-pressed', String(b === c)));
      pintar(); return;
    }
    const p = e.target.closest('[data-t-paso]');
    if (p) { rango.value = Math.min(Number(rango.max), Math.max(Number(rango.min), Number(rango.value) + Number(p.dataset.tPaso))); pintar(); }
  });
  rango.addEventListener('input', pintar);
  pintar();
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, linea: LINEAS, calce: CALCES, talle: TALLES, color: COLORES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    linea: valida(params.get('linea'), LINEAS),
    calce: valida(params.get('calce'), CALCES),
    talle: valida(params.get('talle'), TALLES),
    color: valida(params.get('color'), COLORES),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) => {
    const sw = grupo === 'color' ? `<span class="swatch" style="--sw:${item.hex}"></span>` : '';
    return `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${sw}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  };
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (e.linea.length === 1 && e.linea[0] === 'santooz' && solo.length === 1) return 'Línea Santooz';
    if (e.cat.length === 1 && solo.every(k => k === 'cat' || k === 'calce' || k === 'talle')) {
      const base = nombreDe(CATEGORIAS, e.cat[0]);
      const c = e.calce.length === 1 ? (e.calce[0] === 'oversize' ? ' oversize' : ' clásicas') : '';
      return `${base}${c}${e.talle.length === 1 ? ` en talle ${e.talle[0]}` : ''}`;
    }
    if (solo.length === 1 && e.color.length === 1) return `Prendas en ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: k === 'talle' ? `Talle ${id}` : nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Remeras y gorras';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'prenda' : 'prendas'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'las' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
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
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero__ancha', { y: 30, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.1);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

initPreviews();
initResumenes();
initMenuCategorias();
initFirma();
initTalles();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initCarritoPanel();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
