const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493412806110';
const MARCA = 'Maxfran Indumentaria';
const POR_PAGINA = 16;
const TOPE_LINEA = 99;
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
  { id: 'conjuntos', nombre: 'Conjuntos deportivos', corto: 'Conjuntos', bajada: 'Fútbol, arquero e invierno', img: 'images/p-conjunto.webp' },
  { id: 'camisetas', nombre: 'Camisetas personalizadas', corto: 'Camisetas', bajada: 'Con nombre, número y sponsors', img: 'images/p-camiseta.webp' },
  { id: 'invierno', nombre: 'Línea de invierno', corto: 'Invierno', bajada: 'Camperas, buzos, pantalones y gorros', img: 'images/p-campera.webp' },
];
const TALLES = [
  { id: 'n8', nombre: '8', largo: 'Niño 8', grupo: 'nino' },
  { id: 'n10', nombre: '10', largo: 'Niño 10', grupo: 'nino' },
  { id: 'n12', nombre: '12', largo: 'Niño 12', grupo: 'nino' },
  { id: 'n14', nombre: '14', largo: 'Niño 14', grupo: 'nino' },
  { id: 's', nombre: 'S', largo: 'S', grupo: 'adulto' },
  { id: 'm', nombre: 'M', largo: 'M', grupo: 'adulto' },
  { id: 'l', nombre: 'L', largo: 'L', grupo: 'adulto' },
  { id: 'xl', nombre: 'XL', largo: 'XL', grupo: 'adulto' },
  { id: 'xxl', nombre: 'XXL', largo: 'XXL', grupo: 'adulto' },
  { id: 'unico', nombre: 'Único', largo: 'Talle único', grupo: 'unico' },
];
const T_TODOS = ['n8', 'n10', 'n12', 'n14', 's', 'm', 'l', 'xl', 'xxl'];
const T_ADULTO = ['s', 'm', 'l', 'xl', 'xxl'];
const PRECIOS = [
  { id: 'hasta-25000', nombre: 'Hasta $25.000', min: null, max: 25000 },
  { id: '25000-45000', nombre: '$25.001 a $45.000', min: 25001, max: 45000 },
  { id: 'mas-45000', nombre: 'Más de $45.000', min: 45001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const PRODUCTOS = [
  {
    id: 'conjunto-futbol', cat: 'conjuntos', rango: 1, nombre: 'Conjunto de fútbol sublimado', talles: T_TODOS,
    img: { src: 'images/p-conjunto.webp', lado: 1000, alt: 'Conjunto de fútbol azul marino con paneles rojos y blancos: camiseta y short' },
    opciones: [
      { id: 'cs', nombre: 'Camiseta + short', precio: 34900 },
      { id: 'csm', nombre: 'Camiseta + short + medias', precio: 41900 },
    ],
    desc: 'Camiseta y short sublimados con los colores del club, el escudo y los sponsors, con el nombre y el número de cada jugador.',
    incluye: ['Escudo y sponsors sublimados', 'Nombre y número en la espalda', 'Número en el short'],
    claves: ['futbol', 'equipo', 'camiseta', 'short', 'pantalon corto', 'titular', 'suplente', 'medias'],
  },
  {
    id: 'camiseta-personalizada', cat: 'camisetas', rango: 2, nombre: 'Camiseta de fútbol personalizada', talles: T_TODOS,
    img: { src: 'images/p-camiseta.webp', lado: 900, alt: 'Camiseta de fútbol a bastones azules y blancos con cuello en V' },
    opciones: [
      { id: 'nn', nombre: 'Con nombre y número', precio: 24900 },
      { id: 'lisa', nombre: 'Sin personalizar', precio: 21900 },
    ],
    desc: 'Sublimada a todo color: bastones, rayas o el diseño de tu club, con escudo, sponsors, nombre y número.',
    claves: ['futbol', 'rayas', 'bastones', 'nombre', 'numero', 'sublimada', 'remera'],
  },
  {
    id: 'conjunto-arquero', cat: 'conjuntos', rango: 3, nombre: 'Conjunto de arquero manga larga', talles: T_TODOS,
    img: { src: 'images/p-arquero.webp', lado: 1000, alt: 'Conjunto de arquero negro con detalles amarillos y rojos: buzo de manga larga con protecciones en los codos y short' },
    opciones: [
      { id: 'bs', nombre: 'Buzo + short', precio: 44900 },
      { id: 'bp', nombre: 'Buzo + pantalón largo', precio: 52900 },
    ],
    desc: 'Buzo de manga larga con protecciones en los codos y short, en un color distinto al del resto del equipo.',
    claves: ['arquero', 'golero', 'portero', 'buzo', 'manga larga', 'protecciones', 'futbol'],
  },
  {
    id: 'campera-deportiva', cat: 'invierno', rango: 4, nombre: 'Campera deportiva con cierre', talles: T_TODOS,
    img: { src: 'images/p-campera.webp', lado: 1000, alt: 'Campera deportiva azul marino con cierre, cuello alto y vivos celestes' },
    opciones: [
      { id: 'escudo', nombre: 'Con escudo del club', precio: 49900 },
    ],
    desc: 'Campera de cuello alto con cierre y vivos en contraste, para el banco, los viajes y el entrenamiento.',
    claves: ['campera', 'abrigo', 'invierno', 'cierre', 'banco', 'entrenamiento'],
  },
  {
    id: 'buzo-capucha', cat: 'invierno', rango: 5, nombre: 'Buzo con capucha', talles: T_TODOS,
    img: { src: 'images/p-buzo.webp', lado: 1000, alt: 'Buzo con capucha azul marino con mangas negras y bolsillo canguro' },
    opciones: [
      { id: 'bicolor', nombre: 'Bicolor', precio: 39900 },
      { id: 'sublimado', nombre: 'Sublimado con el diseño del club', precio: 46900 },
    ],
    desc: 'Buzo con capucha y bolsillo canguro, bicolor o sublimado entero con el diseño del club.',
    claves: ['buzo', 'canguro', 'hoodie', 'capucha', 'abrigo', 'invierno', 'sublimado'],
  },
  {
    id: 'conjunto-invierno', cat: 'conjuntos', rango: 6, nombre: 'Conjunto de invierno con capucha', talles: T_TODOS,
    img: { src: 'images/p-invierno.webp', lado: 1000, alt: 'Conjunto de invierno negro y gris: campera con capucha y cierre, y pantalón largo' },
    opciones: [
      { id: 'cp', nombre: 'Campera + pantalón', precio: 79900 },
    ],
    desc: 'Campera con capucha y cierre más pantalón largo, en los colores del club, para entrenar y viajar en invierno.',
    incluye: ['Campera con capucha', 'Pantalón largo con puños'],
    claves: ['conjunto', 'invierno', 'campera', 'pantalon', 'abrigo', 'entrenamiento', 'jogging'],
  },
  {
    id: 'musculosa', cat: 'camisetas', rango: 7, nombre: 'Musculosa deportiva sin mangas', talles: T_TODOS,
    img: { src: 'images/p-musculosa.webp', lado: 1000, alt: 'Musculosa deportiva sin mangas verde oscuro con textura geométrica' },
    opciones: [
      { id: 'sola', nombre: 'Musculosa', precio: 19900 },
      { id: 'short', nombre: 'Musculosa + short', precio: 29900 },
    ],
    desc: 'Sin mangas, para básquet, vóley o fútbol en verano, con el diseño del club sublimado.',
    claves: ['musculosa', 'sin mangas', 'basquet', 'voley', 'verano', 'camiseta'],
  },
  {
    id: 'pantalon-deportivo', cat: 'invierno', rango: 8, nombre: 'Pantalón deportivo con franjas', talles: T_TODOS,
    img: { src: 'images/p-pantalon.webp', lado: 1000, alt: 'Pantalón deportivo largo azul marino con franjas blancas a los costados' },
    opciones: [
      { id: 'largo', nombre: 'Pantalón largo', precio: 27900 },
    ],
    desc: 'Pantalón largo con cintura elastizada y franjas a los costados, para entrenar o completar el conjunto de invierno.',
    claves: ['pantalon', 'jogging', 'largo', 'franjas', 'invierno', 'entrenamiento'],
  },
  {
    id: 'chomba-dt', cat: 'camisetas', rango: 9, nombre: 'Chomba para el cuerpo técnico', talles: T_ADULTO,
    img: { src: 'images/p-chomba.webp', lado: 900, alt: 'Chomba gris con franja vertical azul y blanca, vivos azules y escudo del club al frente' },
    opciones: [
      { id: 'sigla', nombre: 'Con sigla en la espalda', precio: 29900 },
      { id: 'lisa', nombre: 'Sin sigla', precio: 27900 },
    ],
    desc: 'Chomba con cuello y los colores del club para el DT y el cuerpo técnico, con el escudo al frente y la sigla en la espalda.',
    claves: ['chomba', 'dt', 'tecnico', 'entrenador', 'cuerpo tecnico', 'polo'],
  },
  {
    id: 'gorro-tejido', cat: 'invierno', rango: 10, nombre: 'Gorro tejido con los colores del club', talles: ['unico'],
    img: { src: 'images/p-gorro.webp', lado: 1000, alt: 'Gorro tejido con franjas rojas, blancas y negras y doblez negro' },
    opciones: [
      { id: 'gorro', nombre: 'Gorro', precio: 12900 },
    ],
    desc: 'Gorro tejido con doblez, en franjas con los colores del club. Para la hinchada, el banco o el plantel.',
    claves: ['gorro', 'lana', 'tejido', 'hinchada', 'invierno', 'accesorio'],
  },
];

PRODUCTOS.forEach(p => { p.desde = Math.min(...p.opciones.map(o => o.precio)); p.base = p.opciones[0].precio; });

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const talleDe = id => TALLES.find(t => t.id === id) || null;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, catDe(p.cat).corto,
    ...(p.opciones || []).map(o => o.nombre), ...(p.incluye || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !talle.some(t => p.talles.includes(t))) return false;
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
const talleValido = (p, t) => (p?.talles?.length === 1 ? p.talles[0] : (p?.talles?.includes(t) ? t : ''));
const talleTxt = t => (t === 'unico' ? 'Talle único' : `Talle ${talleDe(t)?.largo || ''}`);
const talleMin = t => (t === 'unico' ? 'talle único' : `talle ${talleDe(t)?.grupo === 'nino' ? (talleDe(t)?.largo || '').toLowerCase() : talleDe(t)?.largo || ''}`);
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'maxfran_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = 'U', t = '', qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    const tt = talleValido(producto, t);
    if (!tt) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv && i.t === tt);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, t: tt, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, t, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v && i.t === t);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v, t) { this.save(this.get().filter(i => !(i.id === id && i.v === v && i.t === t))); },
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
      const t = talleValido(p, i.t);
      if (!t) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v && x.t === t);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || t !== i.t || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, t, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
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
function abrirCapa(el, { alCerrar, previo = document.activeElement, onKey: extra } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else if (extra && extra(e)) return;
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
function talleSelectHTML(p) {
  if (p.talles.length === 1) return `<p class="prod__talle-unico">${esc(talleTxt(p.talles[0]))}</p>`;
  const grupo = g => p.talles.filter(t => talleDe(t)?.grupo === g).map(t => `<option value="${esc(t)}">${esc(talleDe(t).nombre)}</option>`).join('');
  const ad = grupo('adulto'), ni = grupo('nino');
  return `<label class="prod__talle"><span class="sr-only">Talle de ${esc(p.nombre)}</span><select data-talle-sel><option value="">Talle</option>${ad ? `<optgroup label="Adultos">${ad}</optgroup>` : ''}${ni ? `<optgroup label="Niños">${ni}</optgroup>` : ''}</select></label>`;
}
function opcionesHTML(p, sel = null) {
  const v = varValida(p, sel);
  if (p.opciones.length < 2) return `<p class="qv__unica">${esc(p.opciones[0].nombre)}</p>`;
  return `<div class="opciones" role="group" aria-label="Presentación" data-opciones>${p.opciones.map(o => `<button type="button" class="opcion-btn" data-opcion="${esc(o.id)}" aria-pressed="${o.id === v}"><b>${esc(o.nombre)}</b><small>${formatearPrecio(o.precio)}</small></button>`).join('')}</div>`;
}
function tallesBotonesHTML(p, sel = '') {
  if (p.talles.length === 1) return `<p class="qv__unica">${esc(talleTxt(p.talles[0]))}</p>`;
  const grupo = (g, t) => {
    const ts = p.talles.filter(x => talleDe(x)?.grupo === g);
    return ts.length ? `<div class="talles-grupo"><span>${t}</span><div>${ts.map(x => `<button type="button" class="talle-btn" data-talle="${esc(x)}" aria-pressed="${x === sel}">${esc(talleDe(x).nombre)}</button>`).join('')}</div></div>` : '';
  };
  return `<div class="talles-btns" role="group" aria-label="Talle" data-talles>${grupo('adulto', 'Adultos')}${grupo('nino', 'Niños')}</div>`;
}

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
};
function cardHTML(p, estilo = 'ficha', anim = 'subir', n = 0) {
  const a = ANIMS[anim] || '';
  const cat = catDe(p.cat);
  const dorsal = estilo === 'dorsal' ? `<span class="prod__dorsal" aria-hidden="true">${String(n).padStart(2, '0')}</span>` : '';
  return `<article class="prod prod--${estilo}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button><span class="prod__cat">${esc(cat.corto)}</span>${dorsal}</div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__precio precio">${p.opciones.length > 1 ? '<small>Desde</small> ' : ''}${formatearPrecio(p.desde)}</p>
    <div class="prod__compra">${talleSelectHTML(p)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function elegirOpcion(cont, v) {
  const p = cont && getProducto(cont.dataset.id);
  if (!p) return;
  const vv = varValida(p, v);
  cont.querySelectorAll('[data-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.opcion === vv)));
  cont.querySelectorAll('[data-precio]').forEach(el => { el.textContent = formatearPrecio(precioDe(p, vv)); });
  cont.querySelectorAll('[data-det]').forEach(el => { el.textContent = detalleVar(p, vv); });
}
function elegirTalle(cont, t) {
  cont?.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === t)));
  cont?.querySelector('[data-talles]')?.classList.remove('falta');
}
const opcionElegida = cont => cont?.querySelector('[data-opcion][aria-pressed="true"]')?.dataset.opcion || null;
const talleElegido = cont => cont?.querySelector('[data-talle-sel]')?.value || cont?.querySelector('[data-talle][aria-pressed="true"]')?.dataset.talle || '';
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'prenda', 'prendas')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleVar(p, i.v)}, ${talleMin(i.t)}) — ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\nEscudo, colores, nombres y números: te los paso por acá.`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}|${esc(i.t)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleVar(p, i.v))} · <b>${esc(talleTxt(i.t))}</b> · ${formatearPrecio(precioDe(p, i.v))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)} ${esc(talleMin(i.t))}">${ICO.x}</button>
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
    cuenta.textContent = n ? plural(n, 'prenda', 'prendas') : '';
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
      const [id, v, t] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v && x.t === t);
      if (it) Cart.setQty(id, v, t, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v, t] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v, t);
    if (p) showToast(`Sacaste «${p.nombre}» (${talleMin(t)}) del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, t, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, t, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${talleMin(talleValido(p, t))}) al pedido`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function pedirTalle(cont) {
  const sel = cont?.querySelector('[data-talle-sel]');
  if (sel) {
    sel.closest('.prod__talle')?.classList.add('falta');
    sel.focus({ preventScroll: true });
  }
  cont?.querySelector('[data-talles]')?.classList.add('falta');
  showToast('Elegí el talle para sumarlo al pedido');
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle-sel]');
    if (sel) sel.closest('.prod__talle')?.classList.toggle('falta', !sel.value);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const p = getProducto(id);
      const t = talleValido(p, talleElegido(cont));
      if (!t) { pedirTalle(cont); return; }
      const n = sumar(id, null, t, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, t: talleElegido(qv.closest('[data-id]')) });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null, t = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  const tt = talleValido(p, t);
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media"><figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></figure></div>
  <div class="qv__info">
    <p class="qv__meta"><span class="qv__cat">${esc(catDe(p.cat).nombre)}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv"><span data-precio>${formatearPrecio(precioDe(p, vv))}</span> <small data-det>${esc(detalleVar(p, vv))}</small></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${p.incluye ? `<ul class="qv__incluye">${p.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    <div class="qv__bloque"><p class="qv__label">Presentación</p>${opcionesHTML(p, vv)}</div>
    <div class="qv__bloque"><p class="qv__label">Talle</p>${tallesBotonesHTML(p, tt)}</div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA} para mi equipo.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También para el equipo</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(r.desde)}</small></button></li>`).join('')}</ul></div>` : ''}`;
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
    const tb = e.target.closest('[data-talle]');
    if (tb) { elegirTalle(cont, tb.dataset.talle); return; }
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
      const t = talleValido(p, talleElegido(cont));
      if (!t) { pedirTalle(cont); return; }
      const n = Cart.add(p, v, t, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${talleMin(t)}) al pedido`);
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

const GUIA = {
  adulto: [
    { t: 's', min: 0, max: 167, ancho: 50, largo: 70 },
    { t: 'm', min: 168, max: 175, ancho: 53, largo: 72 },
    { t: 'l', min: 176, max: 183, ancho: 56, largo: 74 },
    { t: 'xl', min: 184, max: 190, ancho: 59, largo: 76 },
    { t: 'xxl', min: 191, max: 999, ancho: 62, largo: 78 },
  ],
  nino: [
    { t: 'n8', min: 0, max: 131, ancho: 40, largo: 55 },
    { t: 'n10', min: 132, max: 141, ancho: 42, largo: 58 },
    { t: 'n12', min: 142, max: 151, ancho: 45, largo: 61 },
    { t: 'n14', min: 152, max: 999, ancho: 47, largo: 64 },
  ],
};
const ALTURAS = { adulto: { min: 150, max: 205, def: 172 }, nino: { min: 110, max: 165, def: 136 } };

function sugerirTalle({ grupo = 'adulto', altura, cuerpo = 'normal' } = {}) {
  const g = GUIA[grupo] ? grupo : 'adulto';
  const r = ALTURAS[g];
  const h = Math.min(Math.max(parseInt(altura, 10) || r.def, r.min), r.max);
  const filas = GUIA[g];
  let i = filas.findIndex(f => h >= f.min && h <= f.max);
  if (i < 0) i = filas.length - 1;
  if (cuerpo === 'ancha') i = Math.min(i + 1, filas.length - 1);
  return { grupo: g, altura: h, cuerpo, ...filas[i] };
}

function initGuia() {
  const box = document.querySelector('[data-guia]');
  if (!box) return;
  const rango = box.querySelector('#guiaAltura');
  const out = box.querySelector('#guiaAlturaV');
  const talleEl = box.querySelector('[data-guia-talle]');
  const medEl = box.querySelector('[data-guia-med]');
  const ver = box.querySelector('[data-guia-ver]');
  const verT = box.querySelector('[data-guia-t]');
  const wsp = box.querySelector('[data-guia-wsp]');
  let grupoActual = 'adulto';
  const leer = () => ({
    grupo: box.querySelector('input[name="guia-grupo"]:checked')?.value || 'adulto',
    altura: rango.value,
    cuerpo: box.querySelector('input[name="guia-cuerpo"]:checked')?.value || 'normal',
  });
  const pintar = () => {
    const f = leer();
    if (f.grupo !== grupoActual) {
      grupoActual = f.grupo;
      const r = ALTURAS[f.grupo];
      rango.min = r.min; rango.max = r.max; rango.value = r.def; f.altura = r.def;
      box.querySelectorAll('[data-tabla]').forEach(t => { t.hidden = t.dataset.tabla !== f.grupo; });
    }
    const s = sugerirTalle(f);
    const nombre = talleDe(s.t)?.largo || '';
    out.textContent = `${s.altura} cm`;
    talleEl.textContent = talleDe(s.t)?.nombre || '';
    talleEl.classList.remove('salta'); void talleEl.offsetWidth; if (!reduceMotion) talleEl.classList.add('salta');
    medEl.textContent = `Camiseta: ${s.ancho} cm de ancho · ${s.largo} cm de largo`;
    box.querySelectorAll('[data-talle-fila]').forEach(tr => tr.classList.toggle('activa', tr.dataset.talleFila === s.t));
    ver.href = `${CATALOGO_URL}?talle=${s.t}`;
    verT.textContent = nombre;
    wsp.href = wspHref(`Hola! Para un jugador de ${s.altura} cm${s.cuerpo === 'ancha' ? ' de contextura ancha' : ''} la web me sugiere el talle ${nombre}. Quiero confirmar los talles de mi equipo.`);
  };
  rango.addEventListener('input', pintar);
  box.addEventListener('change', e => { if (e.target.matches('input[type="radio"]')) pintar(); });
  pintar();
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
  const otros = ['talle', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="1000" height="1000"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(r.n, 'producto', 'productos')}</em></a></li>`;
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

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
  cont.innerHTML = Tienda.consultar({ limite }).items.map(p => cardHTML(p, cont.dataset.estilo || 'ficha', 'der')).join('');
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
      cont.innerHTML = Tienda.consultar({ filtros, limite }).items.map((p, i) => cardHTML(p, estilo, 'subir', i + 1)).join('');
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
      return card ? (card.getBoundingClientRect().width + gap) * Math.max(1, Math.floor(vp.clientWidth / ((card.getBoundingClientRect().width || 1) + gap)) - 1 || 1) : vp.clientWidth * 0.8;
    };
    const sync = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const items = [...document.querySelectorAll('[data-visor-item]')].map(li => ({ src: li.dataset.src, w: li.dataset.w, h: li.dataset.h, club: li.dataset.club, desc: li.dataset.desc, alt: li.dataset.alt }));
  if (!items.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const club = visor.querySelector('[data-visor-club]');
  const desc = visor.querySelector('[data-visor-desc]');
  const num = visor.querySelector('[data-visor-n]');
  let i = 0;
  const mostrar = k => {
    i = (k + items.length) % items.length;
    const it = items[i];
    img.src = it.src; img.alt = it.alt; img.width = it.w; img.height = it.h;
    club.textContent = it.club; desc.textContent = it.desc;
    num.textContent = `${i + 1} / ${items.length}`;
    visor.querySelector('.visor__fig')?.classList.toggle('vertical', Number(it.h) > Number(it.w));
  };
  const mover = d => mostrar(i + d);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor-abrir]');
    if (!b) return;
    mostrar(Number(b.dataset.visorAbrir) || 0);
    abrirCapa(visor, {
      previo: b,
      onKey: ev => {
        if (ev.key === 'ArrowRight') { mover(1); return true; }
        if (ev.key === 'ArrowLeft') { mover(-1); return true; }
        return false;
      },
    });
    setTimeout(() => visor.querySelector('.visor__close')?.focus(), 60);
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) { cerrarCapa(visor); return; }
    const p = e.target.closest('[data-visor-paso]');
    if (p) mover(Number(p.dataset.visorPaso));
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
  const estilo = MODELO === '2' ? 'dorsal' : 'ficha';
  const params = new URLSearchParams(location.search);
  const TALLES_F = TALLES.filter(t => t.grupo !== 'unico');
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, talle: TALLES_F };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    talle: valida(params.get('talle'), TALLES_F),
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
  const opcionTalle = (item, marcado, n) => `<label class="talle-op${n ? '' : ' is-cero'}"><input type="checkbox" data-f="talle" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cat]').innerHTML = CATEGORIAS.map(it => opcion('checkbox', 'cat', it, e.cat.includes(it.id), Tienda.contar({ ...filtros('cat'), cat: it.id }))).join('');
    const tg = g => TALLES_F.filter(t => t.grupo === g).map(it => opcionTalle(it, e.talle.includes(it.id), Tienda.contar({ ...filtros('talle'), talle: it.id }))).join('');
    panel.querySelector('[data-f-talle]').innerHTML = `<p class="talle-g">Adultos</p><div class="talle-fila">${tg('adulto')}</div><p class="talle-g">Niños</p><div class="talle-fila">${tg('nino')}</div>`;
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.talle.length === 1) return `Talle ${talleDe(e.talle[0])?.largo || ''}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...e.talle.map(id => ({ k: 'talle', id, t: `Talle ${talleDe(id)?.largo || ''}` })),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Indumentaria para todo el equipo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, ropa deportiva para equipos`;
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
    grid.insertAdjacentHTML('beforeend', res.items.map((p, i) => cardHTML(p, estilo, 'subir', mostrados + i + 1)).join(''));
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
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero2__dorsal', { xPercent: -12, opacity: 0, duration: 1.6, clearProps: 'transform,opacity' }, 0.1);
  desde('.hero-eyebrow', { x: -24, opacity: 0, duration: 0.9 }, 0.15);
  desde('h1', { y: 40, opacity: 0, duration: 1.1 }, 0.25);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58);
  desde('.hero-badge', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.72);
}

initRail();
initPreviews();
initMenuCategorias();
initCatalogo();
initGuia();
initReveals();
initHeroMotion();
initRails();
initVisor();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
