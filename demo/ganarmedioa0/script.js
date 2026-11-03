const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492234979361';
const MARCA = 'Ganar medio a 0';
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
  { id: 'argentina', nombre: 'Fútbol argentino', bajada: 'River y Boca', img: 'images/p-boca-azul-oro.webp' },
  { id: 'europa', nombre: 'Europa', bajada: 'Milan, Roma, United y Como', img: 'images/p-milan-rossonera.webp' },
  { id: 'brasil', nombre: 'Brasil', bajada: 'Santos y la Seleção', img: 'images/p-brasil-10.webp' },
];
const CLUBES = [
  { id: 'boca', nombre: 'Boca Juniors' },
  { id: 'river', nombre: 'River Plate' },
  { id: 'milan', nombre: 'AC Milan' },
  { id: 'roma', nombre: 'AS Roma' },
  { id: 'manutd', nombre: 'Manchester United' },
  { id: 'como', nombre: 'Como 1907' },
  { id: 'santos', nombre: 'Santos' },
  { id: 'brasil', nombre: 'Selección de Brasil' },
];
const TALLES = ['S', 'M', 'L', 'XL', 'XXL'].map(t => ({ id: t, nombre: t }));
const COLORES = [
  { id: 'blanca', nombre: 'Blanca', hex: '#FFFFFF' },
  { id: 'azul', nombre: 'Azul', hex: '#2446A8' },
  { id: 'roja', nombre: 'Roja', hex: '#B5302B' },
  { id: 'amarilla', nombre: 'Amarilla', hex: '#E9C93A' },
];
const PRECIOS = [
  { id: 'hasta70', nombre: 'Hasta $70.000', min: null, max: 70000 },
  { id: 'mas70', nombre: 'Más de $70.000', min: 70001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacadas' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Club (A-Z)' },
];
const MEDIDAS = { S: [49, 70], M: [52, 72], L: [55, 74], XL: [58, 76], XXL: [61, 78] };

const foto = (id, alt, altE) => [
  { src: `images/p-${id}.webp`, w: 960, h: 1200, nombre: 'Camiseta', alt },
  { src: `images/e-${id}.webp`, w: 960, h: 1200, nombre: 'Así llega', alt: altE || `${alt}, con las bolsas de ${MARCA} atrás` },
];
const PRODUCTOS = [
  { id: 'boca-azul-oro', club: 'boca', modelo: 'Azul y oro', cat: 'argentina', color: 'azul', precio: 68000, rango: 1, etiqueta: 'Titular',
    imgs: foto('boca-azul-oro', 'Camiseta de Boca Juniors azul con la franja oro en el pecho, sobre una mesa blanca'),
    desc: 'Azul con la franja oro en el pecho y el cuello en V con vivos dorados. La de siempre, en corte versión jugador.',
    claves: ['xeneize', 'cabj', 'azul y oro', 'amarilla', 'betsson', 'local'] },
  { id: 'river-banda', club: 'river', modelo: 'Banda roja', cat: 'argentina', color: 'blanca', precio: 68000, rango: 2, etiqueta: 'Titular', sinStock: ['XXL'],
    imgs: foto('river-banda', 'Camiseta de River Plate blanca con la banda roja cruzada, sobre una mesa blanca'),
    desc: 'Blanca con la banda roja cruzada, cuello negro y tres tiras negras en los hombros.',
    claves: ['millonario', 'carp', 'banda', 'betano', 'local'] },
  { id: 'milan-rossonera', club: 'milan', modelo: 'Rossonera', cat: 'europa', color: 'roja', precio: 74000, rango: 3, etiqueta: 'Titular', sinStock: ['S'],
    imgs: foto('milan-rossonera', 'Camiseta del AC Milan a rayas rojas y negras, sobre una mesa blanca'),
    desc: 'Rayas rojas y negras con una trama tono sobre tono, mangas negras y cuello redondo.',
    claves: ['rossoneri', 'italia', 'serie a', 'negra', 'rayas', 'emirates', 'local'] },
  { id: 'brasil-10', club: 'brasil', modelo: 'Amarilla con el 10', cat: 'brasil', color: 'amarilla', precio: 72000, rango: 4, etiqueta: 'Titular', sinStock: ['S', 'XXL'],
    imgs: foto('brasil-10', 'Camiseta amarilla de la Selección de Brasil con el número 10 en verde, sobre una mesa blanca'),
    desc: 'Amarilla con el 10 en verde, cuello en V verde y vivos turquesa a los costados.',
    claves: ['selecao', 'seleção', 'seleccion', 'canarinha', '10', 'verde', 'local'] },
  { id: 'manutd-azul', club: 'manutd', modelo: 'Azul', cat: 'europa', color: 'azul', precio: 74000, rango: 5, etiqueta: 'Alternativa', sinStock: ['XL'],
    imgs: foto('manutd-azul', 'Camiseta del Manchester United azul con detalles rojos, sobre una mesa blanca'),
    desc: 'Azul francia con tiras rojas en los hombros y el cuello en V con vivos rojos y blancos.',
    claves: ['united', 'red devils', 'inglaterra', 'premier', 'snapdragon'] },
  { id: 'como-azul', club: 'como', modelo: 'Azul', cat: 'europa', color: 'azul', precio: 74000, rango: 6, etiqueta: 'Titular',
    imgs: foto('como-azul', 'Camiseta del Como 1907 azul con rayas finas tono sobre tono y cuello polo, sobre una mesa blanca'),
    desc: 'Azul con rayas finas tono sobre tono y cuello polo con vivos de color.',
    claves: ['italia', 'serie a', 'revolut', 'polo', 'local'] },
  { id: 'boca-rayada', club: 'boca', modelo: 'Rayada blanca y azul', cat: 'argentina', color: 'blanca', precio: 68000, rango: 7, etiqueta: 'Alternativa', sinStock: ['S'],
    imgs: foto('boca-rayada', 'Camiseta de Boca Juniors blanca con rayas finas azules y la franja lisa en el pecho, sobre una mesa blanca'),
    desc: 'Blanca con rayas finas azul marino, la franja lisa del sponsor en el pecho y cuello redondo azul.',
    claves: ['xeneize', 'cabj', 'rayas', 'betsson', 'suplente'] },
  { id: 'roma-blanca', club: 'roma', modelo: 'Blanca con franja', cat: 'europa', color: 'blanca', precio: 74000, rango: 8, etiqueta: 'Alternativa', sinStock: ['XXL'],
    imgs: foto('roma-blanca', 'Camiseta de la AS Roma blanca con una franja granate y amarilla en el pecho, sobre una mesa blanca'),
    desc: 'Blanca con la franja granate y amarilla en el pecho, cuello y tiras granates en los hombros.',
    claves: ['giallorossi', 'italia', 'serie a', 'eurobet', 'suplente'] },
  { id: 'river-rayada', club: 'river', modelo: 'Rayada roja y blanca', cat: 'argentina', color: 'roja', precio: 68000, rango: 9, etiqueta: 'Alternativa', sinStock: ['M'],
    imgs: foto('river-rayada', 'Camiseta de River Plate a rayas rojas y blancas con vivos negros, sobre una mesa blanca'),
    desc: 'Rayada roja y blanca con vivos negros entre las rayas y tiras en los hombros.',
    claves: ['millonario', 'carp', 'rayas', 'betano', 'suplente'] },
  { id: 'santos-blanca', club: 'santos', modelo: 'Blanca', cat: 'brasil', color: 'blanca', precio: 72000, rango: 10, etiqueta: 'Titular', sinStock: ['XL'],
    imgs: foto('santos-blanca', 'Camiseta del Santos blanca con detalles grises a los costados, sobre una mesa blanca'),
    desc: 'Blanca con paneles grises a los costados, cuello redondo y los sponsors en negro.',
    claves: ['peixe', 'brasileirao', 'umbro', 'local'] },
  { id: 'como-blanca', club: 'como', modelo: 'Blanca', cat: 'europa', color: 'blanca', precio: 74000, rango: 11, etiqueta: 'Alternativa', sinStock: ['S', 'M'],
    imgs: foto('como-blanca', 'Camiseta del Como 1907 blanca con rayas finas tono sobre tono, sobre una mesa blanca'),
    desc: 'Blanca con rayas finas tono sobre tono y detalles azul marino en el cuello y los hombros.',
    claves: ['italia', 'serie a', 'revolut', 'suplente'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const talleLibre = (p, t) => TALLES.some(x => x.id === t) && !(p.sinStock || []).includes(t);
const opcionValida = (p, v) => (talleLibre(p, v) ? v : '');
const textoVar = (p, v) => (v ? `Talle ${v}` : 'Sin talle');
const nombreCompleto = p => `${nombreDe(CLUBES, p.club)} · ${p.modelo}`;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    nombreDe(CLUBES, p.club), p.modelo, p.etiqueta, p.desc, nombreDe(CATEGORIAS, p.cat), nombreDe(COLORES, p.color),
    ...(p.claves || []), 'version jugador camiseta', `talle ${TALLES.map(t => t.id).filter(t => talleLibre(p, t)).join(' ')}`,
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), club = lista(f.club), talle = lista(f.talle), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (club.length && !club.includes(p.club)) return false;
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
      case 'nombre': return (a, b) => nombreCompleto(a).localeCompare(nombreCompleto(b), 'es') || desempate(a, b);
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
  KEY: 'ganarmedioa0_cart',
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

function botonCompra(p, clase, talle = '') {
  if (talle && talleLibre(p, talle)) return `<button type="button" class="${clase}" data-sumar="${esc(p.id)}" data-v="${esc(talle)}" aria-label="Sumar ${esc(nombreCompleto(p))} en talle ${esc(talle)} al carrito">${ICO.mas}<span>Sumar talle ${esc(talle)}</span></button>`;
  return `<button type="button" class="${clase}" data-qv="${esc(p.id)}" data-elegir aria-label="Elegir talle de ${esc(nombreCompleto(p))}">${ICO.mas}<span>Elegir talle</span></button>`;
}
function tallesHTML(p, marcado = '') {
  return `<ul class="prod__talles" aria-label="Talles en stock: ${TALLES.filter(t => talleLibre(p, t.id)).map(t => t.id).join(', ')}">${TALLES.map(t => `<li class="${talleLibre(p, t.id) ? '' : 'sin'}${t.id === marcado ? ' es' : ''}" aria-hidden="true">${t.id}</li>`).join('')}</ul>`;
}
function mediaHTML(p) {
  const b = p.imgs[1] ? `<img class="prod__img prod__img--b" src="${esc(p.imgs[1].src)}" alt="" width="${p.imgs[1].w}" height="${p.imgs[1].h}" decoding="async">` : '';
  return `<div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].w}" height="${p.imgs[0].h}" decoding="async">${b}</div>`;
}
function cardHTML(p, estilo = 'ficha', animar = true, talle = '') {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const badge = p.etiqueta ? `<span class="prod__badge${p.etiqueta === 'Titular' ? ' prod__badge--titular' : ''}">${esc(p.etiqueta)}</span>` : '';
  const precio = `<p class="precio">${formatearPrecio(precioFinal(p))}</p>`;
  const nombre = `<h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(nombreDe(CLUBES, p.club))}</button></h3><p class="prod__var">${esc(p.modelo)}</p>`;
  if (estilo === 'dorsal') {
    return `<article class="prod prod--dorsal" data-id="${esc(p.id)}"${anim}>
  ${mediaHTML(p)}${badge}
  <div class="prod__placa">
    <div class="prod__fila"><div>${nombre}</div>${precio}</div>
    ${tallesHTML(p, talle)}
    <div class="prod-actions">${botonCompra(p, 'btn btn--cta btn--sm prod-add', talle)}</div>
  </div>
</article>`;
  }
  return `<article class="prod prod--ficha" data-id="${esc(p.id)}"${anim}>
  ${mediaHTML(p)}${badge}
  <div class="prod__info">
    <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
    ${nombre}
    ${tallesHTML(p, talle)}
    ${precio}
    <div class="prod-actions">${botonCompra(p, 'btn btn--cta btn--sm prod-add', talle)}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'camiseta' : 'camisetas'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${nombreCompleto(p)} (${textoVar(p, i.v)}) — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Me pasan el costo del envío por Vía Cargo a mi ciudad?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const clave = esc(claveLinea(i.id, i.v));
  const im = p.imgs[0];
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(im.src)}" alt="" width="${im.w}" height="${im.h}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(nombreDe(CLUBES, p.club))}</p><p class="linea__var">${esc(p.modelo)} · ${esc(textoVar(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(nombreCompleto(p))}">${ICO.x}</button></div>
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
    cuenta.textContent = n ? `${n} ${n === 1 ? 'camiseta' : 'camisetas'}` : '';
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

function sumar(id, v = '', qty = 1) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, qty, v);
  if (!n) { showToast(talleLibre(p, v) ? `Ya tenés ${MAX_CANT} iguales en el carrito` : 'Ese talle no está en stock: consultalo por WhatsApp'); return 0; }
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${nombreCompleto(p)} (${textoVar(p, v)}) al carrito`);
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

function chipsTalle(p, actual, attr) {
  return TALLES.map(t => {
    const sin = !talleLibre(p, t.id);
    return `<button type="button" class="chip chip--talle" ${attr}="${t.id}" aria-pressed="${t.id === actual}"${sin ? ` disabled aria-label="Talle ${t.id} sin stock"` : ''}>${t.id}${sin ? '<small>sin stock</small>' : ''}</button>`;
  }).join('');
}
function medidaTexto(t) {
  const m = t ? MEDIDAS[t] : null;
  if (!m) return 'Elegí un talle para ver sus medidas.';
  return `Talle ${t}: ${m[0]} cm de ancho y ${m[1]} de largo, medida en plano.`;
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '', elegir = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: opcionValida(p, v), qty: 1, foto: 0 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const sinStock = TALLES.filter(t => !talleLibre(p, t.id)).map(t => t.id);
  const thumbs = p.imgs.length > 1 ? `<div class="qv__thumbs" role="group" aria-label="Fotos">${p.imgs.map((im, k) => `<button type="button" class="qv__thumb" data-qv-foto="${k}" aria-pressed="false" aria-label="Ver ${esc(im.nombre || `foto ${k + 1}`)}"><img src="${esc(im.src)}" alt="" width="${im.w}" height="${im.h}"><span>${esc(im.nombre || '')}</span></button>`).join('')}</div>` : '';
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img data-qv-img src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].w}" height="${p.imgs[0].h}"></div>
    ${thumbs}
  </div>
  <div class="qv__info">
    <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(p.etiqueta)} · Versión jugador</p>
    <h2>${esc(nombreDe(CLUBES, p.club))}<small>${esc(p.modelo)}</small></h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__var"><p class="qv__var-t">Talle: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="Talle">${chipsTalle(p, qvEstado.v, 'data-qv-op')}</div><p class="qv__medida" data-qv-medida></p>
    ${sinStock.length ? `<a class="qv__consultar" href="${wspHref(`Hola! Quiero consultar disponibilidad de la ${nombreCompleto(p)} en talle ${sinStock.join(' o ')}.`)}" target="_blank" rel="noopener">¿No está tu talle? Consultá disponibilidad ${ICO.flecha}</a>` : ''}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Unidades"><button type="button" data-qv-paso="-1" aria-label="Restar una unidad" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí un talle para sumarla al carrito.</p>
    <a class="qv__wsp" href="${wspHref(`Hola! Quiero consultar por la ${nombreCompleto(p)}.`)}" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar disponibilidad por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.imgs[0].src)}" alt="" width="${r.imgs[0].w}" height="${r.imgs[0].h}"><span>${esc(nombreDe(CLUBES, r.club))}</span><small>${esc(r.modelo)} · ${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => {
      const foco = elegir ? modal.querySelector('[data-qv-op]:not([disabled])') : null;
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
  if (img.getAttribute('src') !== im.src) { img.src = im.src; img.alt = im.alt; }
  modal.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.qvFoto) === qvEstado.foto)));
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === qvEstado.v)));
  modal.querySelector('[data-qv-elegida]').textContent = qvEstado.v || 'elegí uno';
  modal.querySelector('[data-qv-medida]').textContent = medidaTexto(qvEstado.v);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioFinal(p) * qvEstado.qty);
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  const detalle = qvEstado.v ? ` en talle ${qvEstado.v}` : '';
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar disponibilidad de la ${nombreCompleto(p)}${detalle}${qvEstado.qty > 1 ? `, ${qvEstado.qty} unidades` : ''}.`);
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
    const f = e.target.closest('[data-qv-foto]');
    if (f) { qvEstado.foto = Number(f.dataset.qvFoto); pintarQv(); return; }
    const op = e.target.closest('[data-qv-op]');
    if (op && !op.disabled) { qvEstado.v = op.dataset.qvOp; aviso.hidden = true; pintarQv(); return; }
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
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${nombreCompleto(p)} (${textoVar(p, qvEstado.v)}) al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: `Camiseta ${nombreCompleto(p)} versión jugador`, description: p.desc,
    image: new URL(p.imgs[0].src, location.href).href, color: nombreDe(COLORES, p.color), size: TALLES.filter(t => talleLibre(p, t.id)).map(t => t.id),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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
  const otros = ['club', 'talle', 'color', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="960" height="1200"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
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
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.resumen });
    el.textContent = `${r.n} ${r.n === 1 ? 'camiseta' : 'camisetas'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function productosPorIds(ids, filtros = {}) {
  const res = Tienda.consultar({ filtros: { ...filtros, ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.dataset.preview || '').split(',').map(s => s.trim()).filter(Boolean);
    const limite = Number(cont.dataset.limite) || 8;
    const estilo = MODELO === '2' ? 'dorsal' : 'ficha';
    const sec = cont.closest('section');
    const contador = sec?.querySelector('[data-vt-n]');
    const pintar = (tab = '') => {
      let prods, talle = '';
      if (tab) {
        const [k, v] = tab.split(':');
        if (k === 'talle') talle = v;
        prods = Tienda.consultar({ filtros: { [k]: v }, limite }).items;
      } else prods = productosPorIds(ids);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo, true, talle)).join('');
      if (contador) {
        const n = tab ? Tienda.contar({ [tab.split(':')[0]]: tab.split(':')[1] }) : Tienda.contar({});
        contador.textContent = talle ? `${n} ${n === 1 ? 'camiseta' : 'camisetas'} en ${talle}` : `${n} camisetas en total`;
      }
    };
    pintar();
    if (!cont.hasAttribute('data-tabs')) return;
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function talleDe(ancho, suelta = false) {
  const ts = Object.keys(MEDIDAS);
  const max = MEDIDAS[ts[ts.length - 1]][0];
  if (ancho > max + 2) return { t: null, base: null, fuera: 'grande' };
  let k = 0, dif = Infinity;
  ts.forEach((t, i) => { const d = Math.abs(MEDIDAS[t][0] - ancho); if (d <= dif) { dif = d; k = i; } });
  const base = ts[k];
  if (!suelta) return { t: base, base, fuera: ancho < MEDIDAS[ts[0]][0] - 3 ? 'chica' : '' };
  if (k + 1 >= ts.length) return { t: null, base, fuera: 'grande' };
  return { t: ts[k + 1], base, fuera: '' };
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
  let suelta = false;
  const pintar = () => {
    const ancho = Number(rango.value);
    valor.textContent = `${ancho} cm`;
    const r = talleDe(ancho, suelta);
    letra.textContent = r.t || 'XXL+';
    letra.classList.toggle('es-largo', !r.t || r.t.length > 2);
    letra.classList.remove('salta'); void letra.offsetWidth; letra.classList.add('salta');
    const m = r.t ? MEDIDAS[r.t] : null;
    if (!r.t) detalle.textContent = `Tu prenda mide ${ancho} cm${suelta ? ' y te gusta suelta' : ''}: más que nuestro XXL. Escribinos y vemos cuál te queda bien.`;
    else if (suelta) detalle.textContent = `Al cuerpo te iría el ${r.base}, pero como te gusta suelta te conviene el ${r.t}: ${m[0]} cm de ancho y ${m[1]} de largo.`;
    else detalle.textContent = `Tu prenda mide ${ancho} cm. El ${r.t} versión jugador mide ${m[0]} de ancho y ${m[1]} de largo${r.fuera === 'chica' ? ': te va a quedar un poco más suelta' : ''}.`;
    tabla.innerHTML = Object.entries(MEDIDAS).map(([t, [a, l]]) => `<tr${t === r.t ? ' class="es-tuyo"' : ''}><th scope="row">${t}</th><td>${a}</td><td>${l}</td></tr>`).join('');
    ver.hidden = !r.t;
    if (r.t) {
      const n = Tienda.contar({ talle: r.t });
      ver.href = `${CATALOGO_URL}?talle=${r.t}`;
      ver.innerHTML = `Ver las ${n} en ${r.t} ${ICO.flecha}`;
    }
    wsp.href = wspHref(`Hola! Quiero consultar el talle de una camiseta versión jugador: mi prenda mide ${ancho} cm de axila a axila y me gusta ${suelta ? 'más suelta' : 'al cuerpo'}.${r.t ? ` La guía me sugiere el ${r.t}.` : ''}`);
  };
  sec.addEventListener('click', e => {
    const c = e.target.closest('[data-t-calce]');
    if (c) {
      suelta = c.dataset.tCalce === 'suelta';
      sec.querySelectorAll('[data-t-calce]').forEach(b => b.setAttribute('aria-pressed', String(b === c)));
      pintar(); return;
    }
    const p = e.target.closest('[data-t-paso]');
    if (p) { rango.value = Math.min(Number(rango.max), Math.max(Number(rango.min), Number(rango.value) + Number(p.dataset.tPaso))); pintar(); }
  });
  rango.addEventListener('input', pintar);
  pintar();
}

function mensajeEncargo({ club = '', cual = '', talle = '' } = {}) {
  const c = String(club).trim().slice(0, 60);
  if (!c) return 'Hola! Busco una camiseta que no está en la web. ¿La pueden conseguir?';
  const tipo = cual && cual !== 'La que tengan' ? ` ${cual.toLowerCase()}` : '';
  return `Hola! Busco la camiseta${tipo} de ${c}, versión jugador${talle ? `, en talle ${talle}` : ''}. ¿La pueden conseguir?`;
}
function initEncargo() {
  document.querySelectorAll('[data-encargo]').forEach(form => {
    const club = form.querySelector('[data-e-club]');
    const cual = form.querySelector('[data-e-cual]');
    const msg = form.querySelector('[data-e-msg]');
    const wsp = form.querySelector('[data-e-wsp]');
    const errClub = club.closest('.campo').querySelector('.campo__error');
    const errTalle = form.querySelector('[data-e-talle-err]');
    const talle = () => form.querySelector('[data-e-talles] input:checked')?.value || '';
    const pintar = () => {
      const t = mensajeEncargo({ club: club.value, cual: cual.value, talle: talle() });
      msg.textContent = t;
      wsp.href = wspHref(t);
    };
    const validar = () => {
      const okClub = club.value.trim().length > 1;
      const okTalle = !!talle();
      errClub.hidden = okClub; club.setAttribute('aria-invalid', String(!okClub));
      errTalle.hidden = okTalle;
      return okClub && okTalle;
    };
    form.addEventListener('input', () => { pintar(); if (!errClub.hidden || !errTalle.hidden) validar(); });
    form.addEventListener('change', pintar);
    wsp.addEventListener('click', e => {
      if (!validar()) {
        e.preventDefault();
        (club.value.trim().length > 1 ? form.querySelector('[data-e-talles] input') : club).focus();
        showToast('Completá el club y tu talle para armar el mensaje');
      }
    });
    pintar();
  });
}

function estadoHorario(fecha = new Date()) {
  const dia = fecha.getDay();
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const abre = 10, cierra = 20;
  if (dia >= 1 && dia <= 6 && h >= abre && h < cierra) return { abierto: true, texto: `Ahora estamos atendiendo, hasta las ${cierra} h` };
  let prox = dia;
  if (dia === 0 || (dia === 6 && h >= cierra)) prox = 1;
  else if (h >= cierra) prox = dia + 1;
  const nombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const cuando = prox === dia ? 'hoy' : (prox === (dia + 1) % 7 ? 'mañana' : `el ${nombres[prox]}`);
  return { abierto: false, texto: `Te respondemos ${cuando} desde las ${abre} h` };
}
function initHorario() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const r = estadoHorario(ahora);
    els.forEach(el => { el.textContent = r.texto; el.classList.toggle('abierto', r.abierto); });
  };
  pintar();
  setInterval(pintar, 60000);
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
  const estilo = MODELO === '2' ? 'dorsal' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, club: CLUBES, talle: TALLES, color: COLORES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    club: valida(params.get('club'), CLUBES),
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
    const talle = e.talle.length === 1 ? ` en talle ${e.talle[0]}` : '';
    if (solo.every(k => k === 'club' || k === 'talle') && e.club.length === 1) return `${nombreDe(CLUBES, e.club[0])}${talle}`;
    if (solo.every(k => k === 'cat' || k === 'talle') && e.cat.length === 1) return `${nombreDe(CATEGORIAS, e.cat[0])}${talle}`;
    if (solo.length === 1 && e.talle.length === 1) return `Camisetas en talle ${e.talle[0]}`;
    if (solo.length === 1 && e.color.length === 1) return `Camisetas ${nombreDe(COLORES, e.color[0]).toLowerCase()}s`;
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
    if (titulo) titulo.textContent = t || 'Camisetas versión jugador';
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
    const talle = e.talle.length === 1 ? e.talle[0] : '';
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo, true, talle)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'camiseta' : 'camisetas'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'las' : `las ${total}`; });
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
  desde('.hero__rayas i', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.3, stagger: 0.12, clearProps: 'transform' }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-kicker', { x: -24, opacity: 0, duration: 1 }, 0.38);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn, .buscador-hero > *', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero__logo', { scale: 0.92, rotate: -18, opacity: 0, duration: 1.3, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.75);
}

initPreviews();
initResumenes();
initMenuCategorias();
initTalles();
initEncargo();
initHorario();
initCatalogo();
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
