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

const WSP = '5493416422669';
const MARCA = 'Macramé';
const CATEGORIAS = [
  { id: 'pared', nombre: 'Tapices y espejos', corto: 'Pared', titulo: 'Tapices y espejos de pared', bajada: 'Para vestir una pared', img: 'images/p-espejo.webp' },
  { id: 'plantas', nombre: 'Plantas y guardado', corto: 'Plantas', titulo: 'Plantas y guardado', bajada: 'Portamacetas y canastos', img: 'images/p-portamaceta.webp' },
  { id: 'textiles', nombre: 'Mesa y almohadones', corto: 'Mesa y textiles', titulo: 'Mesa y almohadones', bajada: 'Caminos, posavasos y fundas', img: 'images/p-almohadon.webp' },
  { id: 'accesorios', nombre: 'Accesorios', corto: 'Accesorios', titulo: 'Accesorios de macramé', bajada: 'Bolsos y llaveros', img: 'images/p-bolso.webp' },
];
const TIPOS = [
  { id: 'living', nombre: 'Living', uno: 'Living' },
  { id: 'dormitorio', nombre: 'Dormitorio', uno: 'Dormitorio' },
  { id: 'comedor', nombre: 'Cocina y comedor', uno: 'Comedor' },
  { id: 'balcon', nombre: 'Balcón y plantas', uno: 'Balcón' },
  { id: 'salir', nombre: 'Para llevar', uno: 'Para llevar' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15a35', nombre: '$15.000 a $35.000', min: 15000, max: 35000 },
  { id: 'mas35', nombre: 'Más de $35.000', min: 35000, max: null },
];
const COLORES = [
  { id: 'natural', nombre: 'Natural', hex: '#EFE6D3' },
  { id: 'arena', nombre: 'Arena', hex: '#D6BF98' },
  { id: 'salvia', nombre: 'Salvia', hex: '#9FB096' },
  { id: 'terracota', nombre: 'Terracota', hex: '#B9693F' },
];
const TODOS = COLORES.map(c => c.id);
const PRODUCTOS = [
  { id: 'tapiz-rombos', rango: 1, cats: ['pared'], tipo: 'living', nombre: 'Tapiz Rombos', nota: '50 × 90 cm, con varilla de madera', precio: 46900, descuento: 0, etiqueta: 'Nuevo', colores: TODOS, color: 'natural', img: 'images/p-tapiz.webp', alt: 'Tapiz de macramé color natural con rombos y flecos largos, colgado de una varilla de madera', desc: 'Tapiz anudado a mano con una guarda de rombos y flecos largos que terminan en punta. Viene con su varilla de madera y el cordón para colgarlo.', ficha: ['Anudado a mano', '50 × 90 cm aprox.', 'Varilla de madera incluida', 'En el color de hilo que elijas'], claves: ['tapiz', 'tapices', 'pared', 'colgante', 'deco', 'boho', 'rombos', 'flecos'] },
  { id: 'portamaceta-colgante', rango: 2, cats: ['plantas'], tipo: 'balcon', nombre: 'Portamaceta colgante', nota: 'Para macetas de hasta 16 cm', precio: 17900, descuento: 0, colores: TODOS, color: 'natural', img: 'images/p-portamaceta.webp', alt: 'Portamaceta de macramé color natural colgado de un aro de madera, con una maceta de barro y un potus', desc: 'Portamaceta colgante con aro de madera, cuatro tramos de nudos y borla larga. La maceta y la planta de la foto son ilustrativas: no se incluyen.', ficha: ['Anudado a mano', 'Largo total 95 cm aprox.', 'Macetas de hasta 16 cm', 'Aro de madera para colgar'], claves: ['portamaceta', 'portamacetas', 'colgante', 'maceta', 'planta', 'plantas', 'colgador'] },
  { id: 'espejo-mandala', rango: 3, cats: ['pared'], tipo: 'dormitorio', nombre: 'Espejo Mandala', nota: 'Espejo de 20 cm, total 45 cm', precio: 39900, descuento: 0, colores: TODOS, color: 'natural', img: 'images/p-espejo.webp', alt: 'Espejo redondo con un marco de macramé natural en forma de mandala con flecos', desc: 'Espejo redondo con marco de macramé en forma de mandala, con picos de nudos y flecos peinados. Se cuelga de un clavo con su presilla.', ficha: ['Anudado a mano', 'Espejo de 20 cm', 'Diámetro total 45 cm aprox.', 'Presilla para colgar'], claves: ['espejo', 'mandala', 'pared', 'redondo', 'deco', 'boho'] },
  { id: 'funda-rombos', rango: 4, cats: ['textiles'], tipo: 'living', nombre: 'Funda de almohadón Rombos', nota: '45 × 45 cm, sin relleno', precio: 26900, descuento: 0, colores: TODOS, color: 'natural', img: 'images/p-almohadon.webp', alt: 'Almohadón con funda de macramé natural con rombos y flecos, apoyado sobre un banco de madera', desc: 'Funda de almohadón con frente de macramé en rombos y flecos al pie, sobre una base de tela de algodón con cierre. Se vende sin relleno.', ficha: ['Frente anudado a mano', '45 × 45 cm', 'Cierre en la parte de atrás', 'Sin relleno'], claves: ['almohadon', 'almohadones', 'funda', 'almohada', 'sillon', 'rombos', 'cama'] },
  { id: 'camino-mesa', rango: 5, cats: ['textiles'], tipo: 'comedor', nombre: 'Camino de mesa Rombos', nota: '35 × 150 cm, con flecos', precio: 37900, descuento: 0, colores: TODOS, color: 'natural', img: 'images/p-camino.webp', alt: 'Camino de mesa de macramé natural con rombos y flecos, sobre una mesa de madera clara', desc: 'Camino de mesa anudado en rombos con centros de estrella y flecos en las dos puntas. Para la mesa del comedor, un aparador o el pie de la cama.', ficha: ['Anudado a mano', '35 × 150 cm aprox.', 'Flecos en las dos puntas', 'En el color de hilo que elijas'], claves: ['camino', 'mesa', 'mantel', 'cocina', 'rombos', 'aparador'] },
  { id: 'bolso-red', rango: 6, cats: ['accesorios'], tipo: 'salir', nombre: 'Bolso red con aro de madera', nota: 'Tejido en red, asa de madera', precio: 31900, descuento: 10, colores: TODOS, color: 'natural', img: 'images/p-bolso.webp', alt: 'Bolso de macramé natural tejido en red con un aro de madera como asa y flecos al pie', desc: 'Bolso tejido en red de nudos con asa de aro de madera y flecos al pie. Para la playa, el mercado o colgado como deco.', ficha: ['Anudado a mano', 'Asa de aro de madera', '35 × 30 cm aprox.', 'En el color de hilo que elijas'], claves: ['bolso', 'cartera', 'red', 'playa', 'mercado', 'aro', 'accesorio'] },
  { id: 'canasto-redondo', rango: 7, cats: ['plantas'], tipo: 'living', nombre: 'Canasto redondo', nota: '25 cm de diámetro', precio: 22900, descuento: 0, colores: TODOS, color: 'natural', img: 'images/p-canasto.webp', alt: 'Canasto redondo de macramé natural con base tejida y paredes caladas', desc: 'Canasto redondo con base firme y paredes caladas. Para guardar mantas, revistas o como cubremaceta.', ficha: ['Anudado a mano', '25 cm de diámetro, 15 cm de alto', 'Base firme', 'En el color de hilo que elijas'], claves: ['canasto', 'cesto', 'canasta', 'guardado', 'organizador', 'cubremaceta'] },
  { id: 'posavasos-mandala', rango: 8, cats: ['textiles'], tipo: 'comedor', nombre: 'Posavasos Mandala x4', nota: 'Cuatro posavasos de 11 cm', precio: 13900, descuento: 0, etiqueta: 'Set x4', colores: TODOS, color: 'natural', img: 'images/p-posavasos.webp', alt: 'Cuatro posavasos redondos de macramé natural con dibujo de mandala, sobre una mesa de madera', desc: 'Juego de cuatro posavasos redondos con dibujo de mandala y borde de flecos cortos. Lindos para regalar.', ficha: ['Anudados a mano', 'Cuatro de 11 cm', 'Borde de flecos', 'En el color de hilo que elijas'], claves: ['posavasos', 'posavaso', 'mandala', 'mesa', 'cocina', 'regalo', 'set'] },
  { id: 'llavero-hoja', rango: 9, cats: ['accesorios'], tipo: 'salir', nombre: 'Llavero Hoja', nota: 'Con argolla de bronce', precio: 5900, descuento: 0, etiqueta: 'Nuevo', colores: TODOS, color: 'salvia', img: 'images/p-llavero.webp', alt: 'Llavero de macramé en forma de hoja color verde salvia con argolla de bronce, sobre una piedra', desc: 'Llavero en forma de hoja con nervadura trenzada y flecos peinados, con argolla de bronce. Para las llaves, la mochila o para regalar.', ficha: ['Anudado a mano', '12 cm de largo aprox.', 'Argolla de bronce', 'En el color de hilo que elijas'], claves: ['llavero', 'llaveros', 'hoja', 'pluma', 'regalo', 'mochila', 'accesorio'] },
  { id: 'prueba-oculto', rango: 99, cats: ['pared'], tipo: 'living', nombre: 'Producto de prueba', nota: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-tapiz.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
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
const detalleDe = p => `${catDe(p.cats[0]).corto} · ${TIPOS.find(t => t.id === p.tipo)?.uno || ''}`;

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
const varianteTexto = (p, i) => (p?.colores?.length && i.color ? `Hilo ${nombreDe(COLORES, i.color).toLowerCase()}` : '');

const Cart = {
  KEY: 'macrame_demo_cart',
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

const NUDO_SVG = '<svg class="nudo" viewBox="0 0 24 34" aria-hidden="true"><path class="nudo__f nudo__f1" d="M5 9v14"/><path class="nudo__f nudo__f2" d="M8.5 12.5v16"/><path class="nudo__f nudo__f3" d="M12 16v16"/><path class="nudo__f nudo__f4" d="M15.5 12.5v16"/><path class="nudo__f nudo__f5" d="M19 9v14"/><path class="nudo__r" d="M12 2l7 7l-7 7l-7 -7z"/><path class="nudo__x" d="M9 6l6 6M15 6l-6 6"/></svg>';
const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.930.32-5.610-1.204-4.706-1.950-7.737-6.730-7.973-7.040-.226-.310-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  nudo: NUDO_SVG,
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
  const color = p.colores ? ` en hilo ${nombreDe(COLORES, p.color).toLowerCase()}` : '';
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
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'pieza', 'piezas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const v = varianteTexto(p, i);
    return `• ${i.qty} × ${p.nombre}${v ? ` (${v.toLowerCase()})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido de macramé:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
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
    cuenta.textContent = n ? plural(n, 'pieza', 'piezas') : '';
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
  const c = p.colores && color ? ` en hilo ${nombreDe(COLORES, color).toLowerCase()}` : '';
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
  return `<fieldset class="opciones qv__colores"><legend>Color del hilo: <b data-qv-color-nombre>${esc(nombreDe(COLORES, p.color))}</b></legend><div class="opciones__fila">${p.colores.map(id => {
    const c = COLORES.find(x => x.id === id);
    return `<label class="op-chip op-chip--color"><input type="radio" name="qv-color" value="${c.id}"${c.id === p.color ? ' checked' : ''}><span><i style="--sw:${c.hex}"></i>${esc(c.nombre)}</span></label>`;
  }).join('')}</div></fieldset>`;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const nota = `Foto ilustrativa en hilo ${nombreDe(COLORES, p.color).toLowerCase()}: cada pieza se anuda a mano y puede variar un poco.`;
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
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una consulta sobre «${p.nombre}».`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Otra medida u otro color? Preguntanos</span></a>
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
    + `<a class="mosaico__todo" href="${CATALOGO_URL}"${ANIMS.subir}>${ICO.nudo}<span class="mosaico__n">${n}</span><b>piezas en la tienda</b><small>Tapices, portamacetas, textiles y accesorios.</small><em>Ver toda la tienda ${ICO.flecha}</em></a>`;
}

const TIPOS_PEDIDO = { tapiz: 'Tapiz o espejo', portamaceta: 'Portamaceta o canasto', mesa: 'Camino, posavasos o almohadón', otro: 'Otra idea' };
const ARCHIVO_VACIO = 'Sumá una foto de referencia';
function codigoPedido() {
  const d = new Date();
  return `MC-${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
}
function initPedido() {
  document.querySelectorAll('[data-pedido]').forEach(form => {
    const err = form.querySelector('[data-pedido-error]');
    const ok = form.parentElement.querySelector('[data-pedido-ok]');
    const archivo = form.querySelector('input[type="file"]');
    const archivoNombre = form.querySelector('[data-archivo-nombre]');
    const btn = form.querySelector('button[type="submit"]');
    const cant = form.elements.cantidad;
    form.addEventListener('change', e => {
      if (e.target === archivo) {
        const f = archivo.files?.[0];
        archivoNombre.textContent = f ? f.name : ARCHIVO_VACIO;
        archivo.closest('.archivo').classList.toggle('is-lleno', !!f);
      }
    });
    form.addEventListener('input', () => { if (err) err.hidden = true; form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid')); });
    cant.addEventListener('blur', () => { cant.value = String(Math.max(1, Math.min(parseInt(cant.value, 10) || 1, 20))); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const detalle = form.elements.detalle, nombre = form.elements.nombre;
      const falta = detalle.value.trim().length < 6 ? detalle : !nombre.value.trim() ? nombre : null;
      if (falta) {
        falta.setAttribute('aria-invalid', 'true');
        err.textContent = falta === detalle ? 'Contanos en pocas palabras qué pieza te imaginás.' : 'Decinos tu nombre para saber a quién le respondemos.';
        err.hidden = false; falta.focus(); return;
      }
      const tipo = form.querySelector('input[name="tipo"]:checked')?.value || 'tapiz';
      const colorId = form.querySelector('input[name="color"]:checked')?.value || 'natural';
      const color = colorId === 'otro' ? 'Otro (lo charlamos)' : nombreDe(COLORES, colorId);
      const n = Math.max(1, Math.min(parseInt(cant.value, 10) || 1, 20));
      const medida = form.elements.medida.value.trim();
      const arch = archivo.files?.[0]?.name || '';
      const cod = codigoPedido();
      const filas = [['Pieza', TIPOS_PEDIDO[tipo] || TIPOS_PEDIDO.otro], ['Idea', detalle.value.trim()], ['Medida', medida || 'A definir'], ['Cantidad', String(n)], ['Hilo', color], ...(arch ? [['Foto', `${arch} (te la mando por acá)`]] : [])];
      const msg = `Hola! Soy ${nombre.value.trim()} y quiero encargar una pieza de macramé a medida (${cod}):\n${filas.map(([k, v]) => `• ${k}: ${v}`).join('\n')}\n¿Me pasás el presupuesto?`;
      const txt = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Preparando…';
      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = txt;
        ok.innerHTML = `<div class="pedido-ok__head">${ICO.nudo}<div><p class="pedido-ok__t">Pedido ${esc(cod)} listo</p><p>Revisalo y mandalo: te respondemos con el presupuesto.</p></div></div>
  <dl class="pedido-ok__lista">${filas.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <a class="btn btn--wsp btn--block" href="${esc(wspHref(msg))}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
  <button type="button" class="btn btn--ghost btn--block" data-pedido-otro>Armar otro pedido</button>
  <p class="pedido-ok__nota">En la web terminada, cada pedido también queda guardado en tu panel para que lo veas y lo respondas en orden.</p>`;
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
      archivoNombre.textContent = ARCHIVO_VACIO;
      archivo.closest('.archivo').classList.remove('is-lleno');
      ok.hidden = true; ok.innerHTML = '';
      form.hidden = false;
      form.elements.detalle.focus();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pedido-tipo]');
    if (!a) return;
    const r = document.querySelector(`[data-pedido] input[name="tipo"][value="${a.dataset.pedidoTipo}"]`);
    if (r) r.checked = true;
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
    if (titulo) titulo.textContent = t || 'Toda la tienda';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Tienda'} — ${MARCA}, tienda de ejemplo`;
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
    contador.innerHTML = `${total} <small>${total === 1 ? 'pieza' : 'piezas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
  desdeA('.hero1__blob', { scale: 0.86, opacity: 0, transformOrigin: '50% 50%', duration: 1.6, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__foto', { y: 40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.05);
  desdeA('.hero2__ficha', { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1);
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.2);
  desdeA('h1', { y: 30, opacity: 0, duration: 1.1 }, 0.28);
  desdeA('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.48);
  desdeA('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero__etiqueta', { y: -26, rotation: -14, opacity: 0, transformOrigin: '50% 0%', duration: 1.4, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }, 0.75);
  desdeA('.hero__datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero1__foto img, .hero2__fondo img').forEach(el => {
    gsap.to(el, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }));
}

[initRail, initMosaico, initPedido, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails, initFaq,
  initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
