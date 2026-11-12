const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
document.documentElement.classList.add('js');

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

const WSP = '5493492312215';
const MARCA = 'Real Print 3D';
const CATEGORIAS = [
  { id: 'monocolor', nombre: 'Impresiones monocolor', titulo: 'Impresiones monocolor', bajada: 'Deco, escritorio y accesorios', img: 'images/p-florero.webp' },
  { id: 'piezas', nombre: 'Piezas a medida', titulo: 'Piezas a medida', bajada: 'Engranajes, clips y soportes', img: 'images/p-engranaje.webp' },
  { id: 'figuras', nombre: 'Figuras pintadas', titulo: 'Figuras pintadas a mano', bajada: 'De acción y de colección', img: 'images/p-dragon-pintado.webp' },
];
const TIPOS = [
  { id: 'deco', nombre: 'Deco y plantas', uno: 'Deco' },
  { id: 'escritorio', nombre: 'Escritorio y organización', uno: 'Escritorio' },
  { id: 'tecnicas', nombre: 'Piezas técnicas', uno: 'Pieza técnica' },
  { id: 'coleccion', nombre: 'Figuras y colección', uno: 'Figura' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: 0, max: 10000 },
  { id: '10a25', nombre: '$10.000 a $25.000', min: 10000, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25000, max: null },
];
const COLORES = [
  { id: 'celeste', nombre: 'Celeste', hex: '#87CEEB' },
  { id: 'blanco', nombre: 'Blanco', hex: '#F4F6F8' },
  { id: 'negro', nombre: 'Negro', hex: '#1B2230' },
  { id: 'azul', nombre: 'Azul eléctrico', hex: '#2D4FB0' },
];
const TODOS = COLORES.map(c => c.id);
const PRODUCTOS = [
  { id: 'florero-espiral', rango: 1, cats: ['monocolor'], tipo: 'deco', nombre: 'Florero espiral', nota: 'Estrías en espiral, alto aprox. 20 cm', precio: 18900, descuento: 0, etiqueta: 'Nuevo', colores: TODOS, color: 'celeste', img: 'images/p-florero.webp', alt: 'Florero celeste impreso en 3D con estrías en espiral', desc: 'Florero de una sola pieza con estrías que giran en espiral de la base a la boca. Ideal para flores secas o ramas decorativas.', ficha: ['Impresión monocolor', 'Alto aprox. 20 cm', 'Una sola pieza', 'En el color que elijas'], claves: ['florero', 'jarron', 'espiral', 'deco', 'flores', 'vaso'] },
  { id: 'dragon-pintado', rango: 2, cats: ['figuras'], tipo: 'coleccion', nombre: 'Dragón pintado sobre base', nota: 'Figura de colección pintada a mano', precio: 64900, descuento: 0, etiqueta: 'Pintado a mano', img: 'images/p-dragon-pintado.webp', alt: 'Dragón verde de colección pintado a mano, sobre una base con rocas y pasto', desc: 'Dragón de colección impreso en alta definición, postprocesado y pintado a mano con base, sombras y detalles a pincel, sobre una base con rocas y pasto.', ficha: ['Pintado a mano', 'Postprocesado y sellado', 'Base con terreno', 'Alto aprox. 18 cm'], claves: ['dragon', 'figura', 'pintada', 'coleccion', 'fantasia', 'miniatura', 'rol'] },
  { id: 'dragon-articulado', rango: 3, cats: ['monocolor'], tipo: 'coleccion', nombre: 'Dragón articulado', nota: 'Alas, cuello y cola que se mueven', precio: 29900, descuento: 0, colores: TODOS, color: 'negro', img: 'images/p-dragon.webp', alt: 'Dragón articulado negro impreso en 3D con las alas abiertas', desc: 'Dragón impreso con las articulaciones ya armadas: mueve las alas, el cuello y cada segmento de la cola. Para jugar o para la repisa.', ficha: ['Impresión monocolor', 'Articulado, sin armar', 'Largo aprox. 35 cm', 'En el color que elijas'], claves: ['dragon', 'articulado', 'flexi', 'juguete', 'figura'] },
  { id: 'soporte-celular', rango: 4, cats: ['monocolor', 'piezas'], tipo: 'escritorio', nombre: 'Soporte para celular', nota: 'Para el escritorio o la mesa de luz', precio: 7900, descuento: 10, colores: TODOS, color: 'celeste', img: 'images/p-soporte.webp', alt: 'Soporte celeste para celular impreso en 3D', desc: 'Soporte inclinado para apoyar el celular mientras cargás, mirás una receta o hacés una videollamada.', ficha: ['Impresión monocolor', 'Ángulo de lectura cómodo', 'Para cualquier celular', 'En el color que elijas'], claves: ['soporte', 'celular', 'telefono', 'escritorio', 'base'] },
  { id: 'robot-pintado', rango: 5, cats: ['figuras'], tipo: 'coleccion', nombre: 'Robot de acción pintado', nota: 'Terminación metalizada, pintado a mano', precio: 54900, descuento: 0, etiqueta: 'Pintado a mano', img: 'images/p-robot.webp', alt: 'Robot de acción azul y plateado, pintado y postprocesado a mano', desc: 'Robot de acción impreso, lijado y pintado a mano en azul y plateado metalizado, con desgaste en los bordes para que se vea real.', ficha: ['Pintado a mano', 'Terminación metalizada', 'Postprocesado y sellado', 'Alto aprox. 16 cm'], claves: ['robot', 'figura', 'accion', 'pintada', 'mecha', 'coleccion'] },
  { id: 'maceta-geometrica', rango: 6, cats: ['monocolor'], tipo: 'deco', nombre: 'Maceta geométrica', nota: 'Facetas en espiral, para suculentas', precio: 11900, descuento: 0, colores: TODOS, color: 'blanco', img: 'images/p-maceta.webp', alt: 'Maceta blanca geométrica impresa en 3D', desc: 'Maceta de facetas que giran alrededor, pensada para suculentas, cactus o como portalápices.', ficha: ['Impresión monocolor', 'Diámetro aprox. 10 cm', 'Para suculentas', 'En el color que elijas'], claves: ['maceta', 'geometrica', 'suculenta', 'cactus', 'deco', 'planta'] },
  { id: 'organizador', rango: 7, cats: ['monocolor'], tipo: 'escritorio', nombre: 'Organizador de escritorio', nota: 'Compartimentos escalonados', precio: 15900, descuento: 0, colores: TODOS, color: 'negro', img: 'images/p-organizador.webp', alt: 'Organizador de escritorio negro con compartimentos, impreso en 3D', desc: 'Organizador con compartimentos de distintas alturas para lapiceras, tarjetas, clips y el celular.', ficha: ['Impresión monocolor', 'Compartimentos escalonados', 'Para el escritorio', 'En el color que elijas'], claves: ['organizador', 'escritorio', 'lapicero', 'portalapices', 'oficina'] },
  { id: 'engranaje', rango: 8, cats: ['piezas'], tipo: 'tecnicas', nombre: 'Engranaje recto de repuesto', nota: '30 dientes, se hace a la medida', precio: 8900, descuento: 0, colores: TODOS, color: 'blanco', img: 'images/p-engranaje.webp', alt: 'Engranaje blanco de 30 dientes impreso en 3D', desc: 'Engranaje recto de 30 dientes para reemplazar uno roto. Si necesitás otra medida o cantidad de dientes, mandanos la pieza original en el pedido personalizado.', ficha: ['Impresión monocolor', '30 dientes', 'Medida a pedido', 'En el color que elijas'], claves: ['engranaje', 'repuesto', 'pieza', 'tecnica', 'rueda', 'dentada'] },
  { id: 'clips-cables', rango: 9, cats: ['piezas', 'monocolor'], tipo: 'escritorio', nombre: 'Clips para cables x4', nota: 'Ordenan los cargadores', precio: 5900, descuento: 0, colores: TODOS, color: 'celeste', img: 'images/p-clips.webp', alt: 'Cuatro clips celestes para cables impresos en 3D, encastrados entre sí', desc: 'Cuatro clips que se encastran entre sí para tener los cables del cargador siempre a mano en el borde del escritorio.', ficha: ['Impresión monocolor', 'Cuatro clips encastrables', 'Para cables de cargador', 'En el color que elijas'], claves: ['clips', 'cables', 'organizador', 'cargador', 'escritorio'] },
  { id: 'prueba-oculto', rango: 99, cats: ['monocolor'], tipo: 'deco', nombre: 'Producto de prueba', nota: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-maceta.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};
const lineaDe = p => catDe(p.cats[0]).nombre;
const detalleDe = p => `${catDe(p.cats[0]).nombre.replace('Impresiones ', '').replace(/^m/, 'M')} · ${TIPOS.find(t => t.id === p.tipo)?.uno || ''}`;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, ...p.cats.map(c => `${catDe(c).nombre} ${catDe(c).titulo}`), nombreDe(TIPOS, p.tipo),
    ...(p.ficha || []), ...(p.claves || []), ...(p.colores || []).map(c => nombreDe(COLORES, c)),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !p.cats.some(c => cat.includes(c))) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && texto.includes(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const colorValido = (p, c) => (p?.colores?.length ? (p.colores.includes(c) ? c : p.color || p.colores[0]) : '');
const claveDe = i => `${i.id}|${i.color || ''}`;
const varianteTexto = (p, i) => (p?.colores?.length && i.color ? `Color ${nombreDe(COLORES, i.color).toLowerCase()}` : '');

const Cart = {
  KEY: 'realprint3d_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, { color = '' } = {}, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const linea = { id: producto.id, color: colorValido(producto, color) };
    const k = claveDe(linea);
    const existing = items.find(i => claveDe(i) === k);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ ...linea, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => claveDe(i) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveDe(i) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const color = colorValido(p, i.color);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const linea = { id: p.id, color, qty };
      const previa = limpias.find(x => claveDe(x) === claveDe(linea));
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || color !== (i.color || '')) changed = true;
      limpias.push(linea);
    });
    if (changed) this.save(limpias);
  },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  capas: '<svg class="capas" viewBox="0 0 28 20" aria-hidden="true"><rect class="capas__c3" x="8" y="1" width="12" height="4" rx="2"/><rect class="capas__c2" x="4" y="8" width="20" height="4" rx="2"/><rect class="capas__c1" x="0" y="15" width="28" height="4" rx="2"/></svg>',
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
  const otros = ['tipo', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}


const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;
const swatchesHTML = p => (p.colores?.length ? `<span class="prod__colores" aria-hidden="true">${p.colores.map(c => `<i style="--sw:${COLORES.find(x => x.id === c)?.hex}"></i>`).join('')}<small>${p.colores.length} colores</small></span>` : '');

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(32px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(44px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const badge = p.etiqueta ? `<span class="prod__badge${p.colores ? '' : ' prod__badge--mano'}">${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  const color = p.colores ? ` en ${nombreDe(COLORES, p.color).toLowerCase()}` : '';
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900" decoding="async"></button>${badge}${off}${swatchesHTML(p)}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(detalleDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions"><button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)}${esc(color)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const v = varianteTexto(p, i);
    return `• ${i.qty} × ${p.nombre}${v ? ` (${v.toLowerCase()})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = esc(claveDe(i));
  const v = varianteTexto(p, i);
  const hex = COLORES.find(c => c.id === i.color)?.hex;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="900" height="900">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${v ? `<i style="--sw:${hex}"></i>${esc(v)}` : esc(lineaDe(p))}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
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
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => claveDe(x) === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const id = q.dataset.quitar.split('|')[0];
    const p = getProducto(id);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, color, n) {
  const c = p.colores && color ? ` en ${nombreDe(COLORES, color).toLowerCase()}` : '';
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${c} al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, p.color, Cart.add(p, { color: p.color }, 1));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, { color: p.color }, 1);
      window.abrirCarrito?.(cm);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { tipo: p.tipo, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cats, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function coloresHTML(p) {
  if (!p.colores?.length) return '';
  return `<fieldset class="opciones qv__colores"><legend>Color de filamento: <b data-qv-color-nombre>${esc(nombreDe(COLORES, p.color))}</b></legend><div class="opciones__fila">${p.colores.map(id => {
    const c = COLORES.find(x => x.id === id);
    return `<label class="op-chip op-chip--color"><input type="radio" name="qv-color" value="${c.id}"${c.id === p.color ? ' checked' : ''}><span><i style="--sw:${c.hex}"></i>${esc(c.nombre)}</span></label>`;
  }).join('')}</div></fieldset>`;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const nota = p.colores ? `Foto ilustrativa en ${nombreDe(COLORES, p.color).toLowerCase()}: lo imprimimos en el color que elijas.` : 'Foto ilustrativa: cada figura se pinta a mano y puede variar en los detalles.';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></figure>
    <p class="qv__nota-foto">${esc(nota)}</p>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(`${lineaDe(p)} · ${nombreDe(TIPOS, p.tipo)}`)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    ${precioHTML(p)}
    ${coloresHTML(p)}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Otra medida u otro color? Preguntanos</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('change', e => {
    if (!e.target.matches('input[name="qv-color"]')) return;
    const n = modal.querySelector('[data-qv-color-nombre]');
    if (n) n.textContent = nombreDe(COLORES, e.target.value);
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
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
      const color = cont.querySelector('input[name="qv-color"]:checked')?.value || p.color;
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, { color }, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, color, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: nombreDe(TIPOS, p.tipo), brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

const DESTACADOS = { limite: 8 };
function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar(DESTACADOS).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const n = Tienda.contar({});
  cont.innerHTML = Tienda.consultar({ ...DESTACADOS, limite: 5 }).items.map(p => cardHTML(p)).join('')
    + `<a class="placa__todo" href="${CATALOGO_URL}"${ANIMS.subir}>${ICO.capas}<span class="placa__n">${n}</span><b>impresiones en el catálogo</b><small>Monocolor, piezas a medida y figuras pintadas.</small><em>Ver todo el catálogo ${ICO.flecha}</em></a>`;
}

const TIPOS_PEDIDO = { monocolor: 'Impresión monocolor', pieza: 'Pieza a medida', figura: 'Figura pintada', otro: 'Otra idea' };
function codigoPedido() {
  const d = new Date();
  return `RP-${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
}
function initPedido() {
  document.querySelectorAll('[data-pedido]').forEach(form => {
    const err = form.querySelector('[data-pedido-error]');
    const ok = form.parentElement.querySelector('[data-pedido-ok]');
    const colorBox = form.querySelector('[data-pedido-color]');
    const notaFig = form.querySelector('[data-pedido-figura]');
    const archivo = form.querySelector('input[type="file"]');
    const archivoNombre = form.querySelector('[data-archivo-nombre]');
    const btn = form.querySelector('button[type="submit"]');
    const cant = form.elements.cantidad;
    const sync = () => {
      const tipo = form.querySelector('input[name="tipo"]:checked')?.value;
      const fig = tipo === 'figura';
      colorBox.hidden = fig;
      notaFig.hidden = !fig;
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    form.addEventListener('change', e => {
      if (e.target.name === 'tipo') sync();
      if (e.target === archivo) {
        const f = archivo.files?.[0];
        archivoNombre.textContent = f ? f.name : 'Elegí un STL, 3MF, OBJ o una foto';
        archivo.closest('.archivo').classList.toggle('is-lleno', !!f);
      }
    });
    form.addEventListener('input', () => { if (err) err.hidden = true; form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid')); });
    cant.addEventListener('blur', () => { cant.value = String(Math.max(1, Math.min(parseInt(cant.value, 10) || 1, 50))); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const detalle = form.elements.detalle, nombre = form.elements.nombre;
      const falta = detalle.value.trim().length < 6 ? detalle : !nombre.value.trim() ? nombre : null;
      if (falta) {
        falta.setAttribute('aria-invalid', 'true');
        err.textContent = falta === detalle ? 'Contanos en pocas palabras qué querés imprimir.' : 'Decinos tu nombre para saber a quién le respondemos.';
        err.hidden = false; falta.focus(); return;
      }
      const tipo = form.querySelector('input[name="tipo"]:checked')?.value || 'monocolor';
      const colorId = form.querySelector('input[name="color"]:checked')?.value || 'celeste';
      const color = tipo === 'figura' ? 'Pintada a mano (colores a charlar)' : colorId === 'otro' ? 'Otro (lo charlamos)' : nombreDe(COLORES, colorId);
      const n = Math.max(1, Math.min(parseInt(cant.value, 10) || 1, 50));
      const medida = form.elements.medida.value.trim();
      const arch = archivo.files?.[0]?.name || '';
      const cod = codigoPedido();
      const filas = [['Tipo', TIPOS_PEDIDO[tipo]], ['Qué es', detalle.value.trim()], ['Medida', medida || 'A definir'], ['Cantidad', String(n)], ['Color', color], ...(arch ? [['Archivo', `${arch} (te lo mando por acá)`]] : [])];
      const msg = `Hola! Soy ${nombre.value.trim()} y quiero hacer un pedido en ${MARCA} (${cod}):\n${filas.map(([k, v]) => `• ${k}: ${v}`).join('\n')}\n¿Me pasás el presupuesto?`;
      const txt = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Preparando…';
      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = txt;
        ok.innerHTML = `<div class="pedido-ok__head">${ICO.capas}<div><p class="pedido-ok__t">Pedido ${esc(cod)} listo</p><p>Revisalo y mandalo: te respondemos con el presupuesto.</p></div></div>
  <dl class="pedido-ok__lista">${filas.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <a class="btn btn--wsp btn--block" href="${esc(wspHref(msg))}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
  <button type="button" class="btn btn--ghost btn--block" data-pedido-otro>Cargar otro pedido</button>
  <p class="pedido-ok__nota">En la web terminada, cada pedido también queda guardado en el panel de ${MARCA} para ir imprimiéndolos en orden.</p>`;
        form.hidden = true;
        ok.hidden = false;
        ok.focus({ preventScroll: true });
        ok.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        showToast('¡Listo! Revisá tu pedido y mandalo por WhatsApp.');
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 800);
    });
    ok.addEventListener('click', e => {
      if (!e.target.closest('[data-pedido-otro]')) return;
      form.reset();
      archivoNombre.textContent = 'Elegí un STL, 3MF, OBJ o una foto';
      archivo.closest('.archivo').classList.remove('is-lleno');
      sync();
      ok.hidden = true; ok.innerHTML = '';
      form.hidden = false;
      form.elements.detalle.focus();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
    sync();
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pedido-tipo]');
    if (!a) return;
    const r = document.querySelector(`[data-pedido] input[name="tipo"][value="${a.dataset.pedidoTipo}"]`);
    if (r) { r.checked = true; r.dispatchEvent(new CustomEvent('change', { bubbles: true })); }
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
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    tipo: valida(params.get('tipo'), TIPOS),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => (grupo === 'cat' && MODELO === '2'
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('tipo')) return TIPOS.find(x => x.id === e.tipo[0])?.nombre || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
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
function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
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
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desdeA('.hero1__foto', { y: 40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.15);
  desdeA('.hero-eyebrow .capas rect', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8, stagger: { each: 0.1, from: 'end' }, ease: 'power3.out' }, 0.2);
  desdeA('h1', { y: 28, opacity: 0, duration: 1.1 }, 0.25);
  desdeA('h1', { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'steps(10)', clearProps: 'clipPath' }, 0.25);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.5);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62);
  desdeA('.hero__sello', { y: 18, scale: 0.94, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero1__foto img, .hero2__fondo img').forEach(el => {
    gsap.to(el, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initRail, initMosaico, initPedido, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
