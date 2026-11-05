const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492915650301';
const MARCA = 'Punto pan';
const POR_PAGINA = 16;
const TOPE_LINEA = 50;
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
  { id: 'panaderia', nombre: 'Panadería', corto: 'Panadería', bajada: 'Masa madre, baguettes y medialunas', img: 'images/p-baguette.webp' },
  { id: 'pasteleria', nombre: 'Pastelería', corto: 'Pastelería', bajada: 'Tortas, tartas, masas y alfajores', img: 'images/p-tarta.webp' },
  { id: 'catering', nombre: 'Cátering dulce y salado', corto: 'Cátering', bajada: 'Sándwiches de miga y masas finas', img: 'images/p-masas-finas.webp' },
];
const SABORES = [
  { id: 'dulce', nombre: 'Dulce' },
  { id: 'salado', nombre: 'Salado' },
];
const PRECIOS = [
  { id: 'hasta-6000', nombre: 'Hasta $6.000', min: null, max: 6000 },
  { id: '6000-15000', nombre: '$6.001 a $15.000', min: 6001, max: 15000 },
  { id: 'mas-15000', nombre: 'Más de $15.000', min: 15001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const PRODUCTOS = [
  {
    id: 'medialunas', cat: 'panaderia', sabor: 'dulce', rango: 1, nombre: 'Medialunas de manteca',
    img: { src: 'images/p-medialunas.webp', lado: 900, alt: 'Medialunas de manteca doradas y brillantes en una bandeja de horno' },
    opciones: [
      { id: 'docena', nombre: 'Docena', detalle: '12 medialunas', precio: 9900 },
      { id: 'media', nombre: 'Media docena', detalle: '6 medialunas', precio: 5400 },
    ],
    desc: 'Hojaldradas, con manteca y un almíbar suave por arriba. Las de siempre para el desayuno o la merienda.',
    claves: ['facturas', 'factura', 'desayuno', 'merienda', 'manteca', 'croissant'],
  },
  {
    id: 'pan-masa-madre', cat: 'panaderia', sabor: 'salado', rango: 2, nombre: 'Pan de masa madre',
    img: { src: 'images/p-masa-madre.webp', lado: 900, alt: 'Hogaza de pan de masa madre con corte en la corteza, sobre un lienzo de lino' },
    opciones: [
      { id: 'hogaza', nombre: 'Hogaza', detalle: '800 g aprox.', precio: 6800 },
      { id: 'media', nombre: 'Media hogaza', detalle: '400 g aprox.', precio: 3700 },
    ],
    desc: 'Fermentación lenta con masa madre: corteza crocante y miga húmeda y alveolada. Bien guardado, rinde varios días.',
    claves: ['masa madre', 'hogaza', 'pan de campo', 'campo', 'sourdough', 'pan'],
  },
  {
    id: 'torta-chocolate', cat: 'pasteleria', sabor: 'dulce', rango: 3, nombre: 'Torta de chocolate',
    img: { src: 'images/p-torta.webp', lado: 900, alt: 'Torta de chocolate de tres capas con copos de ganache, con una porción cortada' },
    opciones: [
      { id: 'entera', nombre: 'Entera', detalle: '20 cm, 12 porciones', precio: 36000 },
      { id: 'porcion', nombre: 'Porción', detalle: '1 porción', precio: 3600 },
    ],
    desc: 'Tres capas de bizcochuelo de chocolate con relleno y cobertura de ganache. Para cumpleaños, consultanos otros tamaños.',
    claves: ['torta', 'cumpleaños', 'chocolate', 'ganache', 'postre'],
  },
  {
    id: 'alfajores', cat: 'pasteleria', sabor: 'dulce', rango: 4, nombre: 'Alfajores de dulce de leche',
    img: { src: 'images/p-alfajores.webp', lado: 900, alt: 'Alfajores de masa tierna rellenos de dulce de leche con azúcar impalpable' },
    opciones: [
      { id: 'x12', nombre: 'Caja x 12', detalle: '12 alfajores', precio: 15900 },
      { id: 'x6', nombre: 'Caja x 6', detalle: '6 alfajores', precio: 8400 },
    ],
    desc: 'Tapas tiernas, bien rellenos de dulce de leche y con azúcar impalpable. Ideales para regalar.',
    claves: ['alfajor', 'dulce de leche', 'regalo', 'merienda'],
  },
  {
    id: 'tarta-frutos-rojos', cat: 'pasteleria', sabor: 'dulce', rango: 5, nombre: 'Tarta de frutos rojos',
    img: { src: 'images/p-tarta.webp', lado: 900, alt: 'Tarta de crema pastelera con frutillas, frambuesas, arándanos y moras' },
    opciones: [
      { id: 'entera', nombre: 'Entera', detalle: '22 cm, 8 porciones', precio: 27500 },
      { id: 'individual', nombre: 'Individual', detalle: '1 tartita', precio: 4900 },
    ],
    desc: 'Masa sablée, crema pastelera y frutillas, frambuesas, arándanos y moras frescas por arriba.',
    claves: ['tarta', 'frutillas', 'frutos rojos', 'crema pastelera', 'postre'],
  },
  {
    id: 'baguette', cat: 'panaderia', sabor: 'salado', rango: 6, nombre: 'Baguette',
    img: { src: 'images/p-baguette.webp', lado: 900, alt: 'Dos baguettes doradas sobre una tabla de madera, una cortada en rodajas' },
    opciones: [
      { id: 'x1', nombre: '1 unidad', detalle: '1 baguette', precio: 2600 },
      { id: 'x2', nombre: '2 unidades', detalle: '2 baguettes', precio: 4900 },
    ],
    desc: 'Corteza fina y crocante, miga liviana. Para sándwiches, tostadas o para acompañar la comida.',
    claves: ['pan', 'flauta', 'baguet', 'sandwich'],
  },
  {
    id: 'masas-secas', cat: 'pasteleria', sabor: 'dulce', rango: 7, nombre: 'Masas secas con dulce',
    img: { src: 'images/p-masas-secas.webp', lado: 900, alt: 'Masas secas de manteca con centro de dulce de frambuesa en un plato' },
    opciones: [
      { id: 'medio', nombre: '½ kg', detalle: 'Medio kilo', precio: 11800 },
      { id: 'cuarto', nombre: '¼ kg', detalle: 'Un cuarto kilo', precio: 6200 },
    ],
    desc: 'Masas de manteca con centro de dulce de frambuesa, para el mate o el té.',
    claves: ['masitas', 'pepas', 'galletitas', 'mate', 'te', 'frambuesa'],
  },
  {
    id: 'sandwiches-miga', cat: 'catering', sabor: 'salado', rango: 8, nombre: 'Sándwiches de miga triples',
    img: { src: 'images/p-sandwiches.webp', lado: 900, alt: 'Bandeja de sándwiches de miga triples de jamón y queso, huevo y tomate' },
    opciones: [
      { id: '12', nombre: 'Docena', detalle: '12 sándwiches', precio: 14400, n: 12 },
      { id: '24', nombre: 'Bandeja x 24', detalle: '24 sándwiches', precio: 27600, n: 24 },
      { id: '48', nombre: 'Bandeja x 48', detalle: '48 sándwiches', precio: 54000, n: 48 },
    ],
    desc: 'Triples de pan de miga surtidos, armados en el día para tu reunión o evento.',
    incluye: ['Jamón y queso', 'Huevo', 'Tomate y lechuga'],
    claves: ['miga', 'sandwich', 'sanguches', 'triples', 'jamon', 'queso', 'cumpleaños', 'evento', 'catering'],
  },
  {
    id: 'masas-finas', cat: 'catering', sabor: 'dulce', rango: 9, nombre: 'Masas finas surtidas',
    img: { src: 'images/p-masas-finas.webp', lado: 900, alt: 'Bandeja de masas finas: tarteletas de frutas, bombas de crema, brownies con pistacho y magdalenas' },
    opciones: [
      { id: '30', nombre: 'Bandeja x 30', detalle: '30 masas finas', precio: 26500, n: 30 },
      { id: '60', nombre: 'Bandeja x 60', detalle: '60 masas finas', precio: 50000, n: 60 },
    ],
    desc: 'Bocados dulces surtidos para la mesa de tu evento.',
    incluye: ['Tarteletas de frutas', 'Bombas de crema', 'Brownies con pistacho', 'Magdalenas'],
    claves: ['masas finas', 'petit fours', 'mesa dulce', 'bocaditos', 'evento', 'catering', 'cumpleaños'],
  },
];

PRODUCTOS.forEach(p => { p.desde = Math.min(...p.opciones.map(o => o.precio)); p.base = p.opciones[0].precio; });

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, catDe(p.cat).corto, nombreDe(SABORES, p.sabor),
    ...(p.opciones || []).flatMap(o => [o.nombre, o.detalle]), ...(p.incluye || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sabor = lista(f.sabor), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sabor.length && !sabor.includes(p.sabor)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.desde < f.precioMin) return false;
    if (f.precioMax != null && p.desde > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => (a.base ?? a.desde) - (b.base ?? b.desde) || desempate(a, b);
      case 'precio-desc': return (a, b) => (b.base ?? b.desde) - (a.base ?? a.desde) || desempate(a, b);
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
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, p.desde); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opcionDe = (p, v) => (p?.opciones ? p.opciones.find(o => o.id === v) || null : null);
const varValida = (p, v) => (p?.opciones?.length ? (opcionDe(p, v) ? v : p.opciones[0].id) : 'U');
const precioDe = (p, v) => (p?.opciones?.length ? (opcionDe(p, v) || p.opciones[0]).precio : p?.precio || 0);
const detalleVar = (p, v) => (p?.opciones?.length ? (opcionDe(p, v) || p.opciones[0]).nombre : '');
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'puntopan_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = 'U', qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const botonSumar = (p, txt = 'Agregar') => `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>${txt}</span></button>`;
function presentacionHTML(p, v) {
  return `<label class="prod__pres"><span class="sr-only">Presentación de ${esc(p.nombre)}</span><select data-opcion-sel>${p.opciones.map(o => `<option value="${esc(o.id)}"${o.id === v ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('')}</select></label>`;
}
function opcionesHTML(p, sel = null) {
  const v = varValida(p, sel);
  return `<div class="opciones" role="group" aria-label="Presentación" data-opciones>${p.opciones.map(o => `<button type="button" class="opcion-btn" data-opcion="${esc(o.id)}" aria-pressed="${o.id === v}"><b>${esc(o.nombre)}</b><small>${esc(o.detalle)} · ${formatearPrecio(o.precio)}</small></button>`).join('')}</div>`;
}

function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const v = varValida(p, null);
  const cat = catDe(p.cat);
  return `<article class="prod prod--${estilo}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button><span class="prod__cat">${esc(cat.corto)}</span></div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__precio precio" data-precio>${formatearPrecio(precioDe(p, v))}</p>
    <div class="prod__compra">${presentacionHTML(p, v)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function elegirOpcion(cont, v) {
  const p = cont && getProducto(cont.dataset.id);
  if (!p) return;
  const vv = varValida(p, v);
  cont.querySelectorAll('[data-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.opcion === vv)));
  cont.querySelectorAll('[data-opcion-sel]').forEach(s => { s.value = vv; });
  cont.querySelectorAll('[data-precio]').forEach(el => { el.textContent = formatearPrecio(precioDe(p, vv)); });
  cont.querySelectorAll('[data-det]').forEach(el => { el.textContent = opcionDe(p, vv)?.detalle || ''; });
}
const opcionElegida = cont => cont?.querySelector('[data-opcion-sel]')?.value || cont?.querySelector('[data-opcion][aria-pressed="true"]')?.dataset.opcion || null;
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleVar(p, i.v)}) — ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleVar(p, i.v))} · ${formatearPrecio(precioDe(p, i.v))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
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
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${detalleVar(p, varValida(p, v))}) al pedido`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-opcion-sel]');
    if (sel) elegirOpcion(sel.closest('[data-id]'), sel.value);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const op = e.target.closest('[data-opcion]');
    if (op) { elegirOpcion(op.closest('[data-id]'), op.dataset.opcion); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out) out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const n = sumar(id, opcionElegida(cont), cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out) out.textContent = '1';
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: opcionElegida(qv.closest('[data-id]')) });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media"><figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></figure></div>
  <div class="qv__info">
    <p class="qv__meta"><span class="qv__cat">${esc(catDe(p.cat).nombre)}</span><span>${esc(nombreDe(SABORES, p.sabor))}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv"><span data-precio>${formatearPrecio(precioDe(p, vv))}</span> <small data-det>${esc(opcionDe(p, vv)?.detalle || '')}</small></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${p.incluye ? `<ul class="qv__incluye">${p.incluye.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    ${opcionesHTML(p, vv)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(r.desde)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const op = e.target.closest('[data-opcion]');
    if (op) { elegirOpcion(cont, op.dataset.opcion); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const v = opcionElegida(cont);
      const n = Cart.add(p, v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${detalleVar(p, varValida(p, v))}) al pedido`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: p.desde, highPrice: Math.max(...p.opciones.map(o => o.precio)), offerCount: p.opciones.length, availability: 'https://schema.org/InStock' },
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

const PORCIONES = {
  merienda: { ambos: [4, 4], salado: [6, 0], dulce: [0, 6] },
  reunion: { ambos: [6, 4], salado: [8, 0], dulce: [0, 6] },
  largo: { ambos: [8, 3], salado: [10, 0], dulce: [0, 5] },
};
const MOMENTOS = { merienda: 'Desayuno o merienda', reunion: 'Cumpleaños o reunión', largo: 'Almuerzo o evento largo' };
const SERVIR = { ambos: 'Dulce y salado', salado: 'Salado', dulce: 'Dulce' };
const PERSONAS_MIN = 6, PERSONAS_MAX = 300;

function calcularCatering({ personas = 20, momento = 'reunion', linea = 'ambos' } = {}) {
  const n = Math.min(Math.max(parseInt(personas, 10) || PERSONAS_MIN, PERSONAS_MIN), PERSONAS_MAX);
  const m = PORCIONES[momento] ? momento : 'reunion';
  const l = PORCIONES[m][linea] ? linea : 'ambos';
  const [porS, porM] = PORCIONES[m][l];
  const lineas = [];
  const docenas = Math.ceil((porS * n) / 12);
  if (docenas) {
    const b48 = Math.floor(docenas / 4), r = docenas % 4;
    if (b48) lineas.push({ id: 'sandwiches-miga', v: '48', qty: b48 });
    if (r >= 2) lineas.push({ id: 'sandwiches-miga', v: '24', qty: 1 });
    if (r % 2 === 1) lineas.push({ id: 'sandwiches-miga', v: '12', qty: 1 });
  }
  const bandejas = Math.ceil((porM * n) / 30);
  if (bandejas) {
    const b60 = Math.floor(bandejas / 2);
    if (b60) lineas.push({ id: 'masas-finas', v: '60', qty: b60 });
    if (bandejas % 2) lineas.push({ id: 'masas-finas', v: '30', qty: 1 });
  }
  const total = lineas.reduce((s, x) => { const p = getProducto(x.id); return p ? s + precioDe(p, x.v) * x.qty : s; }, 0);
  return { personas: n, momento: m, linea: l, sandwiches: docenas * 12, masas: bandejas * 30, lineas, total };
}

function detallePacks(res, id) {
  const p = getProducto(id);
  return res.lineas.filter(x => x.id === id).map(x => {
    const n = opcionDe(p, x.v)?.n || 0;
    if (n === 12) return plural(x.qty, 'docena', 'docenas');
    return `${plural(x.qty, 'bandeja', 'bandejas')} de ${n}`;
  }).join(' + ');
}
function fechaTxt(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}
function textoCatering(res, fecha = '') {
  const partes = [];
  if (res.sandwiches) partes.push(`${res.sandwiches} sándwiches de miga`);
  if (res.masas) partes.push(`${res.masas} masas finas`);
  const f = fechaTxt(fecha);
  return `Hola! Quiero consultar por el cátering de ${MARCA}.\nPara: ${res.personas} personas · ${MOMENTOS[res.momento]} · ${SERVIR[res.linea]}${f ? `\nFecha: ${f}` : ''}\nSugerencia de la web: ${partes.join(' y ')} (total estimado ${formatearPrecio(res.total)}).`;
}

function initCalculadora() {
  const box = document.querySelector('[data-calc]');
  if (!box) return;
  const inp = box.querySelector('#calcPersonas');
  const fecha = box.querySelector('#calcFecha');
  const res = box.querySelector('[data-calc-res]');
  const wsp = box.querySelector('[data-calc-wsp]');
  const sumarBtn = box.querySelector('[data-calc-sumar]');
  let ultimo = null;
  try { fecha.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10); } catch { }
  const leer = () => ({
    personas: inp.value,
    momento: box.querySelector('input[name="calc-momento"]:checked')?.value,
    linea: box.querySelector('input[name="calc-linea"]:checked')?.value,
  });
  const pintar = () => {
    ultimo = calcularCatering(leer());
    const r = ultimo;
    const filas = [];
    if (r.sandwiches) filas.push(`<li><b>${r.sandwiches}</b><span>sándwiches de miga<small>${esc(detallePacks(r, 'sandwiches-miga'))}</small></span></li>`);
    if (r.masas) filas.push(`<li><b>${r.masas}</b><span>masas finas<small>${esc(detallePacks(r, 'masas-finas'))}</small></span></li>`);
    res.innerHTML = `<p class="calc__para">Para ${r.personas} personas te sugerimos</p><ul class="calc__lista">${filas.join('')}</ul><p class="calc__total"><span>Total estimado</span><output>${formatearPrecio(r.total)}</output></p>`;
    wsp.href = wspHref(textoCatering(r, fecha.value));
  };
  const fijar = n => { inp.value = Math.min(Math.max(parseInt(n, 10) || PERSONAS_MIN, PERSONAS_MIN), PERSONAS_MAX); pintar(); };
  box.addEventListener('click', e => {
    const paso = e.target.closest('[data-calc-paso]');
    if (paso) fijar((parseInt(inp.value, 10) || 0) + Number(paso.dataset.calcPaso));
  });
  box.addEventListener('change', e => {
    if (e.target === inp) fijar(inp.value);
    else pintar();
  });
  inp.addEventListener('input', () => { const n = parseInt(inp.value, 10); if (n >= PERSONAS_MIN && n <= PERSONAS_MAX) pintar(); });
  sumarBtn.addEventListener('click', () => {
    if (!ultimo || !ultimo.lineas.length) return;
    ultimo.lineas.forEach(x => Cart.add(getProducto(x.id), x.v, x.qty));
    showToast(`Sumamos el cátering para ${ultimo.personas} personas a tu pedido`);
    if (!reduceMotion) { sumarBtn.classList.remove('sumado'); void sumarBtn.offsetWidth; sumarBtn.classList.add('sumado'); }
  });
  pintar();
}

function initFicha() {
  const ficha = document.querySelector('.ficha[data-id]');
  if (!ficha) return;
  const p = getProducto(ficha.dataset.id);
  const el = ficha.querySelector('[data-ficha-precio]');
  if (p && el) el.textContent = formatearPrecio(precioDe(p, null));
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['sabor', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(r.n, 'producto', 'productos')}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
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

function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const estilo = cont.dataset.estilo || 'ficha';
    const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      const [k, v] = tab ? tab.split(':') : [];
      const filtros = k ? { [k]: v } : {};
      cont.innerHTML = Tienda.consultar({ filtros, limite }).items.map(p => cardHTML(p, estilo)).join('');
      if (verTodo) verTodo.href = k ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
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
  const GRUPOS = { cat: CATEGORIAS, sabor: SABORES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    sabor: valida(params.get('sabor'), SABORES),
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
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.sabor.length === 1) return e.sabor[0] === 'dulce' ? 'Lo dulce' : 'Lo salado';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Panadería, pastelería y cátering';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, panadería en Bahía Blanca`;
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
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
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
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, filter: 'saturate(.35) brightness(1.1) sepia(.12)', duration: 1.8, clearProps: 'filter' }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-badge', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

initPreviews();
initMenuCategorias();
initCatalogo();
initFicha();
initCalculadora();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
