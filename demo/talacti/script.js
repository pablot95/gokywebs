document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5493886147102';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'fiambres', nombre: 'Fiambres', img: 'images/cat-fiambres.webp',
    bajada: 'Cocidos, crudos y salames cortados en el peso que necesites. Precios por kilo.',
    subs: [{ id: 'cocidos', nombre: 'Cocidos' }, { id: 'crudos', nombre: 'Crudos y curados' }, { id: 'salames', nombre: 'Salames' }] },
  { id: 'quesos', nombre: 'Quesos', img: 'images/cat-quesos.webp',
    bajada: 'Duros para rallar, semiduros para la picada, blandos y azules para untar. Precios por kilo.',
    subs: [{ id: 'duros', nombre: 'Duros' }, { id: 'semiduros', nombre: 'Semiduros' }, { id: 'blandos', nombre: 'Blandos' }, { id: 'azules', nombre: 'Azules' }] },
  { id: 'bebidas', nombre: 'Bebidas', img: 'images/cat-bebidas.webp',
    bajada: 'Vinos y aperitivos para acompañar, y bebidas sin alcohol. Se venden por unidad.',
    subs: [{ id: 'vinos', nombre: 'Vinos' }, { id: 'aperitivos', nombre: 'Aperitivos' }, { id: 'sin-alcohol', nombre: 'Sin alcohol' }] },
];
const VENTAS = { peso: 'Al corte, por peso', unidad: 'Por unidad' };
const ORDENES = { destacados: 'Destacados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const PESOS = [
  { id: '100', label: '100 g', g: 100 },
  { id: '250', label: '250 g', g: 250 },
  { id: '500', label: '500 g', g: 500 },
  { id: '1000', label: '1 kg', g: 1000 },
];
const PESO_DEFAULT = '250';
const HORARIOS = {
  0: [[540, 780]],
  1: [[510, 810], [1050, 1290]], 2: [[510, 810], [1050, 1290]], 3: [[510, 810], [1050, 1290]],
  4: [[510, 810], [1050, 1290]], 5: [[510, 810], [1050, 1290]], 6: [[510, 810], [1050, 1290]],
};
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const Servidor = crearServidor([
  { id: 'jamon-cocido', nombre: 'Jamón cocido natural', cat: 'fiambres', sub: 'cocidos', venta: 'peso', kg: 16900, rango: 1, alta: 19,
    img: 'p-jamon-cocido', px: 800, tags: ['sándwich', 'feteado fino'],
    alt: 'Fetas de jamón cocido natural en un plato sobre la tabla',
    desc: 'Jamón cocido natural, feteado fino al momento. El de todos los días: para el sándwich, la tostada o la picada.' },
  { id: 'jamon-crudo', nombre: 'Jamón crudo estacionado', cat: 'fiambres', sub: 'crudos', venta: 'peso', kg: 38900, rango: 2, alta: 18,
    img: 'p-jamon-crudo', px: 800, tags: ['picada', 'feteado fino'],
    alt: 'Fetas finas de jamón crudo estacionado con aceitunas sobre una tabla',
    desc: 'Jamón crudo estacionado, en fetas finas para que se deshaga. Va directo a la tabla, con queso y una copa de tinto.' },
  { id: 'salame-milan', nombre: 'Salame tipo milán', cat: 'fiambres', sub: 'salames', venta: 'peso', kg: 24500, rango: 3, alta: 17,
    img: 'p-salame-milan', px: 800, tags: ['picada'],
    alt: 'Salame tipo milán en pieza y en rodajas sobre una tabla con romero',
    desc: 'Picado fino, suave y parejo. Lo cortamos en rodajas finas o te llevás la pieza, como lo pidas.' },
  { id: 'bondiola-curada', nombre: 'Bondiola curada', cat: 'fiambres', sub: 'crudos', venta: 'peso', kg: 34900, rango: 6, alta: 16,
    img: 'p-bondiola', px: 640, tags: ['picada', 'feteado fino'],
    alt: 'Fetas de bondiola curada en una tabla de madera junto a un bowl de aceitunas',
    desc: 'Bondiola curada con su vetado de grasa, en fetas finas. Más intensa que el crudo, con un punto de especias.' },
  { id: 'jamon-crudo-trozo', nombre: 'Jamón crudo en trozo', cat: 'fiambres', sub: 'crudos', venta: 'peso', kg: 33900, alta: 15,
    img: 'p-crudo-trozo', px: 470, tags: ['picada', 'en pieza'],
    alt: 'Pieza de jamón crudo sobre el mostrador, junto a salames y quesos',
    desc: 'El crudo en trozo, para cortarlo en casa a cuchillo o en tacos para la picada.' },
  { id: 'salame-picado-grueso', nombre: 'Salame picado grueso', cat: 'fiambres', sub: 'salames', venta: 'peso', kg: 22900, alta: 14,
    img: 'p-salame-grueso', px: 470, tags: ['picada'],
    alt: 'Salames de picado grueso atados con hilo y rodajas sobre la tabla',
    desc: 'Salame de picado grueso, atado con hilo, con más carácter que el milán. Va bien en rodajas gruesas.' },
  { id: 'salame-colonia-caroya', nombre: 'Salame tipo Colonia Caroya', cat: 'fiambres', sub: 'salames', venta: 'peso', kg: 27900, alta: 13,
    img: 'p-salame-caroya', px: 350, tags: ['picada', 'estacionado'],
    alt: 'Salame tipo Colonia Caroya cortado, junto a fetas de crudo y queso',
    desc: 'Al estilo cordobés, estacionado y con la piel enmohecida. Se corta grueso, a cuchillo, para la tabla.' },
  { id: 'salame-de-campo', nombre: 'Salame de campo', cat: 'fiambres', sub: 'salames', venta: 'peso', kg: 25900, descuento: 10, alta: 12,
    img: 'p-salame-campo', px: 500, tags: ['picada', 'estacionado'],
    alt: 'Salame de campo en pieza con rodajas y pan',
    desc: 'Salame de campo de picado medio, con la piel blanca del estacionamiento. Rinde mucho en la picada.' },
  { id: 'salamin-picado-fino', nombre: 'Salamín picado fino', cat: 'fiambres', sub: 'salames', venta: 'unidad', precio: 6900, presentacion: 'Unidad de 250 g aprox.', alta: 11,
    img: 'p-salamin', px: 380, tags: ['picada', 'en pieza'],
    alt: 'Salamines colgados en el mostrador de la fiambrería',
    desc: 'Salamín entero y estacionado, listo para cortar. Se vende por unidad, de unos 250 g.' },

  { id: 'queso-reggianito', nombre: 'Queso reggianito', cat: 'quesos', sub: 'duros', venta: 'peso', kg: 26900, rango: 4, alta: 10,
    img: 'p-reggianito', px: 800, tags: ['para rallar', 'picada'],
    alt: 'Horma de queso reggianito con trozos desgranados sobre papel',
    desc: 'Queso duro, estacionado y desgranado. Para rallar sobre la pasta o en trozos para la picada.' },
  { id: 'queso-brie', nombre: 'Queso brie', cat: 'quesos', sub: 'blandos', venta: 'peso', kg: 31900, rango: 5, alta: 9,
    img: 'p-brie', px: 800, tags: ['para untar', 'picada'],
    alt: 'Queso brie entero con una porción cortada sobre una tabla',
    desc: 'Pasta blanda y cremosa, con corteza blanca. Sacalo de la heladera media hora antes y untalo en pan tostado.' },
  { id: 'vino-malbec', nombre: 'Vino tinto Malbec 750 ml', cat: 'bebidas', sub: 'vinos', venta: 'unidad', precio: 8900, presentacion: 'Botella de 750 ml', rango: 7, alta: 3,
    img: 'p-malbec', px: 800, tags: ['con alcohol', 'tinto'],
    alt: 'Botella de vino tinto Malbec y una copa servida junto a una tabla de quesos',
    desc: 'Tinto Malbec, frutado y amable. El compañero de la tabla de fiambres y quesos.' },
  { id: 'queso-azul', nombre: 'Queso azul', cat: 'quesos', sub: 'azules', venta: 'peso', kg: 28900, rango: 8, alta: 8,
    img: 'p-azul', px: 500, tags: ['picada', 'para untar'],
    alt: 'Cubos de queso azul junto a otros quesos y nueces en una tabla',
    desc: 'Azul intenso y cremoso. En cubos para la picada o derretido sobre una carne.' },
  { id: 'queso-pategras', nombre: 'Queso pategrás', cat: 'quesos', sub: 'semiduros', venta: 'peso', kg: 19900, alta: 7,
    img: 'p-pategras', px: 300, tags: ['picada', 'en cubos'],
    alt: 'Horma de queso pategrás junto a otros quesos en el mostrador',
    desc: 'Semiduro, suave y con ojos chicos. El queso de la picada clásica, en cubos o en fetas.' },
  { id: 'queso-sardo', nombre: 'Queso sardo', cat: 'quesos', sub: 'duros', venta: 'peso', kg: 23900, alta: 6,
    img: 'p-sardo', px: 330, tags: ['para rallar'],
    alt: 'Cuña de queso sardo con corteza sobre una tabla con crudo y aceitunas',
    desc: 'Duro y algo picante, con corteza oscura. Para rallar o en lascas finas.' },
  { id: 'queso-fontina', nombre: 'Queso fontina', cat: 'quesos', sub: 'semiduros', venta: 'peso', kg: 21900, alta: 5,
    img: 'p-fontina', px: 300, tags: ['para gratinar', 'picada'],
    alt: 'Triángulos de queso fontina sobre la tabla',
    desc: 'Semiduro y untuoso, se derrite muy bien. En triángulos para la tabla o para gratinar.' },
  { id: 'queso-maquina', nombre: 'Queso de máquina en fetas', cat: 'quesos', sub: 'semiduros', venta: 'peso', kg: 15900, descuento: 10, alta: 4,
    img: 'p-maquina', px: 460, tags: ['sándwich', 'feteado fino'],
    alt: 'Fetas de queso de máquina apiladas en una tabla junto a un vaso de agua con gas',
    desc: 'El queso del sándwich de miga y del tostado, feteado al momento.' },
  { id: 'vermut-rojo', nombre: 'Vermut rojo 1 l', cat: 'bebidas', sub: 'aperitivos', venta: 'unidad', precio: 7500, presentacion: 'Botella de 1 l', alta: 2,
    img: 'p-vermut', px: 340, tags: ['con alcohol', 'aperitivo'],
    alt: 'Copa y jarra de vermut rojo sobre el mostrador',
    desc: 'Para el aperitivo antes de la picada: con soda, hielo y una rodaja de naranja.' },
  { id: 'agua-con-gas', nombre: 'Agua mineral con gas 750 ml', cat: 'bebidas', sub: 'sin-alcohol', venta: 'unidad', precio: 2900, presentacion: 'Botella de vidrio de 750 ml', alta: 1,
    img: 'p-agua-con-gas', px: 800, tags: ['sin alcohol'],
    alt: 'Botella de vidrio de agua con gas y dos vasos con hielo',
    desc: 'Bien fría, en botella de vidrio. Para acompañar la picada sin alcohol.' },
], { tope: 100 });

function precioKg(p) { return p.venta === 'peso' ? Math.round(p.kg * (1 - (p.descuento || 0) / 100)) : 0; }
function precioDe(p, v) {
  if (!p) return 0;
  if (p.venta === 'peso') {
    const o = PESOS.find(x => x.id === v) || PESOS.find(x => x.id === PESO_DEFAULT);
    return Math.round((p.kg * o.g / 1000) * (1 - (p.descuento || 0) / 100) / 10) * 10;
  }
  return Math.round(p.precio * (1 - (p.descuento || 0) / 100));
}
function precioRef(p) { return p.venta === 'peso' ? precioKg(p) : precioDe(p); }

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const catDe = id => CATEGORIAS.find(c => c.id === id);
  const subDe = (cat, sub) => catDe(cat)?.subs.find(s => s.id === sub)?.nombre || '';
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, catDe(p.cat)?.nombre, subDe(p.cat, p.sub), p.desc, VENTAS[p.venta], p.presentacion, ...(p.tags || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), venta = lista(f.venta), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.sub)) return false;
    if (venta.length && !venta.includes(p.venta)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioRef(a) - precioRef(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioRef(b) - precioRef(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => ({
    id: c.id, cantidad: contar({ cat: c.id }), subs: c.subs.map(s => ({ id: s.id, cantidad: contar({ cat: c.id, tipo: s.id }) })),
  }));
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Servidor.obtener(id);
const pesoDe = v => PESOS.find(o => o.id === v) || null;
const varValida = (p, v) => (p?.venta === 'peso' ? (pesoDe(v) ? v : PESO_DEFAULT) : '');
const imgDe = p => `images/${p.img}.webp`;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const nombreSub = p => catDe(p.cat)?.subs.find(s => s.id === p.sub)?.nombre || '';
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const kgTexto = g => (g / 1000).toLocaleString('es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' kg';
function metaDe(p) {
  return p.venta === 'peso' ? `${nombreSub(p)} · al corte` : `${nombreSub(p)} · por unidad`;
}
function lineaTexto(p, v, qty) {
  if (p.venta === 'peso') return `${qty > 1 ? qty + ' × ' : ''}${pesoDe(v)?.label || ''} de ${p.nombre}`;
  return `${qty} × ${p.nombre}`;
}

const Cart = {
  KEY: 'talacti_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 30);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 30) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 30)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer.open, .modal:not([hidden]), .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  subirCh: ' data-animate="subir" style="opacity:0;transform:translateY(22px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(60px)"',
};
function stepperHTML(nombre) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function precioHTML(p) {
  if (p.venta === 'peso') {
    return `<div class="pcard__precio"><p class="precio-kg"><strong>${formatearPrecio(precioKg(p))}</strong><span>/kg</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.kg)}</s>` : ''}</p><p class="precio-sel" data-precio-sel>${pesoDe(PESO_DEFAULT).label}: ${formatearPrecio(precioDe(p, PESO_DEFAULT))}</p></div>`;
  }
  return `<div class="pcard__precio"><p class="precio-kg"><strong>${formatearPrecio(precioDe(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p><p class="precio-sel">${esc(p.presentacion || '')}</p></div>`;
}
function pesoSelectHTML(p) {
  return `<label class="peso-sel"><span class="sr-only">Peso de ${esc(p.nombre)}</span><select data-peso-sel>${PESOS.map(o => `<option value="${o.id}"${o.id === PESO_DEFAULT ? ' selected' : ''}>${o.label}</option>`).join('')}</select></label>`;
}
function cardHTML(p, { rail = false, anim = true } = {}) {
  const a = anim ? (rail ? ANIM.der : ANIM.subir) : '';
  const n = esc(p.nombre);
  const badge = p.descuento > 0 ? `<span class="pcard__badge">-${p.descuento}%</span>` : '';
  const foto = `<button type="button" class="pcard__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${badge}</button>`;
  const control = p.venta === 'peso' ? pesoSelectHTML(p) : stepperHTML(p.nombre);
  const acciones = `<div class="prod-actions">${control}<button type="button" class="btn btn-cta prod-add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carrito}<span>Agregar</span></button></div>`;
  return `<article class="pcard${rail ? ' pcard--rail' : ''}"${a}>${foto}
    <div class="pcard__info"><p class="pcard__meta">${esc(metaDe(p))}</p><h3 class="pcard__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3>${precioHTML(p)}
    ${acciones}${rail ? '' : `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`}</div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
document.addEventListener('cart:updated', updateCartBadge);

function waPedido() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) return waLink('¡Hola, TAlacTI! Quiero hacer un pedido.');
  const txt = lineas.map(({ p, v, qty }) => `• ${lineaTexto(p, v, qty)}: ${formatearPrecio(precioDe(p, v) * qty)}`).join('\n');
  return waLink(`¡Hola, TAlacTI! Quiero hacer este pedido:\n${txt}\nTotal estimado: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos la entrega?`);
}

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p) return false;
  const vv = varValida(p, v);
  Cart.add(p, qty, vv);
  showToast(`Sumaste ${lineaTexto(p, vv, qty)} al pedido`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.pcard, .qv, .prod-actions, .qv__acciones, .fila')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 20)) : 1;
}
function varDe(btn) {
  if (btn.dataset.v) return btn.dataset.v;
  return btn.closest('.pcard, .fila')?.querySelector('[data-peso-sel]')?.value || '';
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, 20));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, cantidadDe(add), varDe(add));
      add.classList.remove('agregado'); void add.offsetWidth; add.classList.add('agregado');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, cantidadDe(buy), varDe(buy))) { cerrarQuickView(false); abrirCarrito(); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, quick); return; }
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, 20));
    const sel = e.target.closest('[data-peso-sel]');
    if (sel) {
      const card = sel.closest('.pcard');
      const p = getProducto(card?.querySelector('[data-add]')?.dataset.add);
      const out = card?.querySelector('[data-precio-sel]');
      if (p && out) out.textContent = `${pesoDe(sel.value)?.label}: ${formatearPrecio(precioDe(p, sel.value))}`;
    }
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
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); syncNoScroll();
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); } else atraparFoco(nav, e);
  });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatMenu() {
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const resumen = Servidor.resumen();
  const href = catalogoHref();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const activa = enCatalogo ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = `<div class="nav-cats__cols">${CATEGORIAS.map(c => {
    const r = resumen.find(x => x.id === c.id);
    const subs = c.subs.map(s => `<li><a href="${href}?cat=${c.id}&amp;tipo=${s.id}">${esc(s.nombre)}</a></li>`).join('');
    return `<div class="nav-cats__col"><a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="52" height="52"><span>${esc(c.nombre)}</span><span class="nav-cats__cant">${r?.cantidad || 0}</span></a><ul class="nav-cats__subs">${subs}</ul></div>`;
  }).join('')}</div><a class="nav-cats__todo" href="${href}">Ver todo el catálogo ${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open') && hoverMq.matches) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target) && hoverMq.matches) cerrar(); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.querySelectorAll('[data-cant-cat]').forEach(el => {
    const n = resumen.find(r => r.id === el.dataset.cantCat)?.cantidad || 0;
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function franjasTexto(dia) {
  const f = HORARIOS[dia] || [];
  if (!f.length) return 'Cerrado';
  return f.map(([a, b]) => `${hhmm(a)} a ${hhmm(b)}`).join(' y ');
}
function ahoraLocal() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Jujuy', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia: dia < 0 ? new Date().getDay() : dia, min: Number(val('hour')) * 60 + Number(val('minute')) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
function estadoLocal({ dia, min }) {
  const hoy = HORARIOS[dia] || [];
  const actual = hoy.find(([a, b]) => min >= a && min < b);
  if (actual) return { abierto: true, corto: `Abierto · hasta ${hhmm(actual[1])}`, largo: `Abierto ahora · cierra a las ${hhmm(actual[1])}` };
  const luego = hoy.find(([a]) => a > min);
  if (luego) return { abierto: false, corto: `Cerrado · abre ${hhmm(luego[0])}`, largo: `Cerrado ahora · abre hoy a las ${hhmm(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const f = HORARIOS[d] || [];
    if (f.length) {
      const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
      return { abierto: false, corto: `Cerrado · abre ${cuando} ${hhmm(f[0][0])}`, largo: `Cerrado ahora · abre ${cuando} a las ${hhmm(f[0][0])}` };
    }
  }
  return { abierto: false, corto: 'Cerrado', largo: 'Cerrado' };
}
function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  const hoyEls = document.querySelectorAll('[data-hoy]');
  const filas = document.querySelectorAll('[data-dia]');
  if (!els.length && !hoyEls.length && !filas.length) return;
  const pintar = () => {
    const ahora = ahoraLocal();
    const st = estadoLocal(ahora);
    els.forEach(el => {
      el.textContent = el.dataset.estado === 'largo' ? st.largo : st.corto;
      el.closest('[data-estado-wrap]')?.classList.toggle('is-cerrado', !st.abierto);
    });
    hoyEls.forEach(el => { el.textContent = franjasTexto(ahora.dia); });
    filas.forEach(f => {
      const es = Number(f.dataset.dia) === ahora.dia;
      f.classList.toggle('is-hoy', es);
      if (es) f.setAttribute('aria-current', 'date'); else f.removeAttribute('aria-current');
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function pintarTicket(t, p, v) {
  if (!t || !p) return;
  const set = (sel, txt) => { const el = t.querySelector(sel); if (el) el.textContent = txt; };
  set('[data-t-nombre]', p.nombre);
  if (p.venta === 'peso') {
    set('[data-t-cant-l]', 'Peso');
    set('[data-t-cant]', kgTexto(pesoDe(v)?.g || 250));
    set('[data-t-unit-l]', '$/kg');
    set('[data-t-unit]', formatearPrecio(precioKg(p)));
  } else {
    set('[data-t-cant-l]', 'Cant.');
    set('[data-t-cant]', '1 u.');
    set('[data-t-unit-l]', 'Precio');
    set('[data-t-unit]', formatearPrecio(precioDe(p)));
  }
  set('[data-t-total]', formatearPrecio(precioDe(p, v)));
}
function initTicketHero() {
  const t = document.querySelector('.hero [data-ticket]');
  if (!t) return;
  pintarTicket(t, getProducto(t.dataset.ticket), t.dataset.peso || PESO_DEFAULT);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const panel = hero.querySelector('.hero__regla');
  if (panel) tl.from(panel, { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, clearProps: 'transform' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  const ticket = hero.querySelector('.ticket');
  if (ticket) tl.from(ticket, { clipPath: 'inset(0% 0% 100% 0%)', y: -14, duration: 1.2, ease: 'power3.out', clearProps: 'clipPath,transform' }, 0.75);
  const ficha = hero.querySelector('.hero__ficha');
  if (ficha) tl.from(ficha, { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const tk = document.querySelector('.hero--split .hero__ticket');
    if (tk) gsap.to(tk, { y: -36, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    const media = document.querySelector('.hero--portada .hero__media img');
    if (media) gsap.to(media, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    const local = document.querySelector('.horarios__foto img');
    if (local) gsap.fromTo(local, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.horarios', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const items = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  const vp = document.getElementById('railDest');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) * 2;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, select, .stepper, [data-add]')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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

function renderPreview() {
  const grid = document.getElementById('previewGrid');
  if (!grid) return;
  const items = Servidor.consultar({ filtros: { destacado: false }, orden: 'destacados', limite: 8 }).items;
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function filaHTML(p) {
  const n = esc(p.nombre);
  const v = varValida(p, PESO_DEFAULT);
  const control = p.venta === 'peso'
    ? `<div class="fila__pesos" role="group" aria-label="Peso de ${n}">${PESOS.map(o => `<button type="button" class="chip-peso" data-fila-peso="${o.id}" aria-pressed="${o.id === v}">${o.label}</button>`).join('')}</div>`
    : `<div class="fila__pesos fila__pesos--unidad"><span class="fila__pres">${esc(p.presentacion || '')}</span>${stepperHTML(p.nombre)}</div>`;
  const unit = p.venta === 'peso' ? `${formatearPrecio(precioKg(p))} el kg` : formatearPrecio(precioDe(p)) + ' c/u';
  return `<article class="fila" data-fila="${p.id}"${ANIM.subirCh}>
    <button type="button" class="fila__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${p.descuento > 0 ? `<span class="pcard__badge">-${p.descuento}%</span>` : ''}</button>
    <div class="fila__txt"><button type="button" class="fila__nombre" data-quick="${p.id}">${n}</button><p class="fila__meta"><span>${esc(nombreSub(p))}</span><span class="fila__unit">${unit}${p.descuento > 0 ? ` <s>${formatearPrecio(p.venta === 'peso' ? p.kg : p.precio)}</s>` : ''}</span></p></div>
    ${control}
    <div class="fila__acc"><span class="fila__total" data-fila-total>${formatearPrecio(precioDe(p, v))}</span><button type="button" class="fila__add" data-add="${p.id}" data-v="${v}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}</button></div>
  </article>`;
}
function renderMostrador() {
  const tabs = document.getElementById('mostTabs');
  const panel = document.getElementById('mostPanel');
  if (!tabs || !panel) return;
  const ticket = document.querySelector('[data-ticket-vivo]');
  const tAdd = document.querySelector('[data-ticket-add]');
  const resumen = Servidor.resumen();
  tabs.innerHTML = CATEGORIAS.map((c, i) => `<button type="button" class="tab" role="tab" id="tab-${c.id}" data-tab="${c.id}" aria-controls="mostPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><span class="tab__n">${resumen.find(r => r.id === c.id)?.cantidad || 0}</span></button>`).join('');
  const elegir = (p, v) => {
    pintarTicket(ticket, p, v);
    if (tAdd) { tAdd.dataset.add = p.id; tAdd.dataset.v = v; tAdd.setAttribute('aria-label', `Sumar ${lineaTexto(p, v, 1)} al pedido`); }
    if (ticket && !reduceMotion) { ticket.classList.remove('is-print'); void ticket.offsetWidth; ticket.classList.add('is-print'); }
  };
  const mostrar = (id, animar) => {
    const c = catDe(id);
    if (!c) return;
    tabs.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    const res = Servidor.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 6 });
    panel.innerHTML = res.items.map(filaHTML).join('') +
      `<div class="mostrador__pie"${ANIM.subirCh}><p>${res.total > res.items.length ? `Mostramos ${res.items.length} de ${res.total} ${esc(c.nombre.toLowerCase())}.` : `${res.total} ${esc(c.nombre.toLowerCase())} en el mostrador.`} ${esc(c.bajada)}</p><a class="link-flecha" href="${catalogoHref()}?cat=${id}"><span>Ver ${esc(c.nombre.toLowerCase())} en el catálogo</span>${ICON.flecha}</a></div>`;
    if (res.items[0]) elegir(res.items[0], varValida(res.items[0], PESO_DEFAULT));
    if (animar) { revelarNuevos(panel); refrescarScroll(); }
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) mostrar(b.dataset.tab, true); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const bs = [...tabs.querySelectorAll('[data-tab]')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
    bs[j].focus(); mostrar(bs[j].dataset.tab, true);
  });
  panel.addEventListener('click', e => {
    const chip = e.target.closest('[data-fila-peso]');
    const fila = e.target.closest('.fila');
    if (!fila) return;
    const p = getProducto(fila.dataset.fila);
    if (!p) return;
    if (chip) {
      const v = chip.dataset.filaPeso;
      fila.querySelectorAll('[data-fila-peso]').forEach(b => b.setAttribute('aria-pressed', String(b === chip)));
      const add = fila.querySelector('[data-add]');
      if (add) add.dataset.v = v;
      const tot = fila.querySelector('[data-fila-total]');
      if (tot) tot.textContent = formatearPrecio(precioDe(p, v));
      elegir(p, v);
      return;
    }
    if (e.target.closest('[data-add]')) elegir(p, fila.querySelector('[data-add]')?.dataset.v || '');
  });
  mostrar(CATEGORIAS[0].id, false);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-24.1858, -65.2995];
  const tactil = window.matchMedia('(hover: none)').matches;
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !tactil, tap: false, zoomControl: true, attributionControl: true }).setView(centro, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.marker(centro, {
    icon: L.divIcon({ className: 'mapa-pin', html: '<span class="mapa-pin__dot"></span><span class="mapa-pin__label">TAlacTI</span>', iconSize: [0, 0] }),
    keyboard: false,
  }).addTo(mapa);
  const fix = () => mapa.invalidateSize();
  window.addEventListener('load', fix);
  if ('ResizeObserver' in window) new window.ResizeObserver(fix).observe(el);
}

let qvUltimoFoco = null;
function abrirQuickView(id, trigger) {
  const modal = document.getElementById('quickView');
  const cont = document.getElementById('qvContenido');
  const p = getProducto(id);
  if (!modal || !cont || !p) return;
  if (modal.hidden) qvUltimoFoco = trigger || document.activeElement;
  const n = esc(p.nombre);
  const vIni = varValida(p, PESO_DEFAULT);
  const c = catDe(p.cat);
  const fotos = [imgDe(p), c?.img].filter(Boolean);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const pesos = p.venta === 'peso' ? `<fieldset class="qv__var"><legend>Peso</legend><div class="qv__ops">${PESOS.map(o => `<button type="button" class="qv__op" data-op="${o.id}" aria-pressed="${o.id === vIni}">${o.label}<small>${formatearPrecio(precioDe(p, o.id))}</small></button>`).join('')}</div></fieldset>` : '';
  const unitario = p.venta === 'peso'
    ? `<span class="qv__unit">${formatearPrecio(precioKg(p))} el kg${p.descuento > 0 ? ` <s>${formatearPrecio(p.kg)}</s>` : ''}</span>`
    : `<span class="qv__unit">${esc(p.presentacion || '')}${p.descuento > 0 ? ` · <s>${formatearPrecio(p.precio)}</s>` : ''}</span>`;
  cont.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__principal"><img src="${fotos[0]}" alt="${esc(p.alt)}" width="640" height="640" data-qv-img>${p.descuento > 0 ? `<span class="pcard__badge">-${p.descuento}%</span>` : ''}</div>
      <div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-foto="${f}" aria-pressed="${i === 0}" aria-label="Ver la foto ${i + 1}"><img src="${f}" alt="" width="64" height="64"></button>`).join('')}</div>
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(c?.nombre || '')} · ${esc(nombreSub(p))}</p>
      <h2 class="qv__nombre">${n}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioDe(p, vIni))}</span>${unitario}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${pesos}
      <div class="qv__acciones">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta" data-add="${p.id}" data-v="${vIni}">${ICON.carrito}<span>Agregar al pedido</span></button><button type="button" class="btn btn-ghost" data-buy="${p.id}" data-v="${vIni}">Comprar ahora</button></div>
      <p class="qv__nota">${p.venta === 'peso' ? 'Se pesa al cortar: el total puede variar unos gramos. ' : ''}Retiro en el local o entrega a coordinar por WhatsApp.</p>
    </div>
    ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="54" height="54"><span>${esc(r.nombre)}<small>${r.venta === 'peso' ? formatearPrecio(precioKg(r)) + ' el kg' : formatearPrecio(precioDe(r))}</small></span></button>`).join('')}</div></div>` : ''}`;
  const pintarFoto = src => {
    const im = cont.querySelector('[data-qv-img]');
    if (im) im.src = src;
    cont.querySelectorAll('[data-foto]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.foto === src)));
  };
  cont.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    cont.querySelectorAll('[data-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('[data-add], [data-buy]').forEach(x => { x.dataset.v = b.dataset.op; });
    const el = cont.querySelector('[data-qv-precio]');
    if (el) el.textContent = formatearPrecio(precioDe(p, b.dataset.op));
  }));
  cont.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => pintarFoto(b.dataset.foto)));
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(imgDe(p), location.href).href, brand: { '@type': 'Brand', name: 'TAlacTI' }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDe(p, vIni), availability: 'https://schema.org/InStock' } });
  const yaAbierto = !modal.hidden;
  modal.hidden = false;
  cont.parentElement.scrollTop = 0;
  syncNoScroll();
  if (!yaAbierto) requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  modal.querySelector('.modal__cerrar')?.focus();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQuickView(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  syncNoScroll();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  if (devolverFoco && qvUltimoFoco?.isConnected) qvUltimoFoco.focus();
}
function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close-modal]')) cerrarQuickView(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarQuickView();
    else atraparFoco(modal, e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, null);
}

let carritoUltimoFoco = null;
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.carrito}<h3>Tu pedido está vacío</h3><p>Todavía no sumaste nada. Arrancá por un crudo, un queso para la tabla y algo para tomar.</p><a class="btn btn-cta" href="${catalogoHref()}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = lineas.map(({ p, v, qty }, k) => {
    const detalle = p.venta === 'peso' ? `${pesoDe(v)?.label || ''} · ${formatearPrecio(precioKg(p))} el kg` : (p.presentacion || '');
    return `<div class="linea" data-id="${p.id}" data-v="${v || ''}"${animar ? ` style="animation-delay:${Math.min(k * 0.05, 0.3)}s"` : ' style="animation:none"'}>
      <img src="${imgDe(p)}" alt="" width="72" height="72">
      <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(detalle)}</p>
        <div class="linea__fila"><div class="stepper" data-stepper><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="30" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
        <span class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</span>
        <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del pedido">${ICON.basura}</button></div>
      </div></div>`;
  }).join('');
  if (total) total.textContent = formatearPrecio(Cart.total());
}
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  carritoUltimoFoco = document.activeElement;
  renderCarrito(true);
  drawer.removeAttribute('inert');
  drawer.classList.add('open'); bd?.classList.add('open');
  syncNoScroll();
  drawer.querySelector('[data-close-cart]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open'); bd?.classList.remove('open');
  drawer.setAttribute('inert', '');
  syncNoScroll();
  if (carritoUltimoFoco?.isConnected) carritoUltimoFoco.focus();
}
function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('.linea');
    if (!linea) return;
    const { id, v } = linea.dataset;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v)?.qty || 1;
      Cart.setQty(id, v, actual + Number(step.dataset.lineaStep));
    }
    if (e.target.closest('[data-quitar]')) Cart.remove(id, v);
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.linea input');
    if (!input) return;
    const { id, v } = input.closest('.linea').dataset;
    Cart.setQty(id, v, parseInt(input.value, 10) || 1);
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(false); });
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarCarrito();
    else atraparFoco(drawer, e);
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

const POR_PAGINA = 16;
function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid || document.body.dataset.pagina !== 'catalogo') return;
  const params = new URLSearchParams(location.search);
  const catsValidas = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const valida = (v, mapa) => (v && Object.prototype.hasOwnProperty.call(mapa, v) ? v : '');
  const subsDe = cat => (cat ? catsValidas[cat].subs : CATEGORIAS.flatMap(c => c.subs.map(s => ({ ...s, cat: c.id }))));
  const st = {
    cat: valida(params.get('cat'), catsValidas),
    tipo: [],
    venta: (params.get('venta') || '').split(',').filter(s => VENTAS[s]),
    oferta: params.get('oferta') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valida(params.get('orden'), ORDENES) || 'destacados',
  };
  st.tipo = (params.get('tipo') || '').split(',').filter(s => subsDe(st.cat).some(x => x.id === s));
  const el = {
    titulo: document.getElementById('catTitulo'), bajada: document.getElementById('catBajada'), miga: document.getElementById('migaCat'),
    q: document.getElementById('q'), orden: document.getElementById('orden'), resumen: document.getElementById('resumen'),
    mas: document.getElementById('masWrap'), verMas: document.getElementById('verMas'), mostrando: document.getElementById('mostrando'),
    cats: document.getElementById('filtroCats'), tipos: document.getElementById('filtroTipos'), venta: document.getElementById('filtroVenta'),
    oferta: document.getElementById('filtroOferta'), filtros: document.getElementById('filtros'), abrir: document.getElementById('abrirFiltros'),
  };
  const bajadaBase = el.bajada?.textContent || '';
  const tituloBase = el.titulo?.textContent || 'Todos los productos';
  let cursor = null, mostrados = 0, total = 0;

  const pintarCats = () => {
    el.cats.innerHTML = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS].map(c => `<button type="button" class="filtro__cat" data-cat="${c.id}" aria-pressed="${st.cat === c.id}">${esc(c.nombre)}<span>${Servidor.contar(c.id ? { cat: c.id } : {})}</span></button>`).join('');
  };
  const pintarTipos = () => {
    el.tipos.innerHTML = subsDe(st.cat).map(s => {
      const n = Servidor.contar({ cat: s.cat || st.cat, tipo: s.id });
      return `<label class="check"><input type="checkbox" data-f="tipo" value="${s.id}"${st.tipo.includes(s.id) ? ' checked' : ''}>${esc(s.nombre)}<span>${n}</span></label>`;
    }).join('');
  };
  pintarCats();
  pintarTipos();
  el.venta.innerHTML = Object.entries(VENTAS).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="venta" value="${id}"${st.venta.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  if (el.oferta) el.oferta.checked = st.oferta;
  el.orden.innerHTML = Object.entries(ORDENES).map(([id, l]) => `<option value="${id}"${st.orden === id ? ' selected' : ''}>${esc(l)}</option>`).join('');
  el.q.value = st.q;

  const filtrosServidor = () => ({ cat: st.cat || undefined, tipo: st.tipo, venta: st.venta, oferta: st.oferta || undefined, q: st.q || undefined });
  const activos = () => (st.cat ? 1 : 0) + st.tipo.length + st.venta.length + (st.oferta ? 1 : 0) + (st.q ? 1 : 0);
  const nombreTipo = id => subsDe('').find(s => s.id === id)?.nombre || id;

  function escribirURL() {
    const u = new URL(location.href);
    ['cat', 'tipo', 'venta', 'oferta', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.cat) u.searchParams.set('cat', st.cat);
    if (st.tipo.length) u.searchParams.set('tipo', st.tipo.join(','));
    if (st.venta.length) u.searchParams.set('venta', st.venta.join(','));
    if (st.oferta) u.searchParams.set('oferta', '1');
    if (st.q) u.searchParams.set('q', st.q);
    if (st.orden !== 'destacados') u.searchParams.set('orden', st.orden);
    window.history.replaceState(null, '', u);
  }
  function pintarCabecera() {
    const c = catsValidas[st.cat];
    if (el.titulo) el.titulo.textContent = c ? c.nombre : tituloBase;
    if (el.bajada) el.bajada.textContent = c ? c.bajada : bajadaBase;
    if (el.miga) { el.miga.hidden = !c; const s = el.miga.querySelector('span:last-child'); if (s) s.textContent = c ? c.nombre : ''; }
    document.title = `${c ? c.nombre : 'Catálogo'} — TAlacTI, fiambrería en San Salvador de Jujuy`;
    el.cats.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === st.cat)));
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (st.cat && new URL(a.href).searchParams.get('cat') === st.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarResumen() {
    const chips = [];
    if (st.cat) chips.push(['cat', st.cat, catsValidas[st.cat].nombre]);
    st.tipo.forEach(t => chips.push(['tipo', t, nombreTipo(t)]));
    st.venta.forEach(t => chips.push(['venta', t, VENTAS[t]]));
    if (st.oferta) chips.push(['oferta', '1', 'Ofertas']);
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    el.resumen.innerHTML = `<span><strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}</span>` +
      chips.map(([k, v, l]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') +
      (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    document.querySelectorAll('[data-total]').forEach(s => { s.textContent = total; });
    const nf = document.querySelector('[data-nfiltros]');
    if (nf) nf.textContent = activos() ? `(${activos()})` : '';
  }
  function vacioHTML() {
    return `<div class="vacio"${ANIM.subirCh}><h2>Eso no está en el mostrador (todavía)</h2><p>Probá con otra palabra o sacá algún filtro. Si buscás un corte especial, preguntanos.</p><div class="vacio__ctas"><button type="button" class="btn btn-cta" data-limpiar>Limpiar filtros</button><a class="btn btn-ghost" href="${waLink('¡Hola, TAlacTI! Busco algo que no encontré en la web: ')}" target="_blank" rel="noopener">${ICON.wa}<span>Preguntanos por WhatsApp</span></a></div></div>`;
  }
  function cargar(reset) {
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
    if (reset) { grid.innerHTML = ''; mostrados = 0; }
    total = res.total; cursor = res.cursor;
    if (!total) grid.innerHTML = vacioHTML();
    else grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    el.mas.hidden = !cursor;
    if (el.mostrando) el.mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    pintarResumen();
    revelarNuevos(grid);
    refrescarScroll();
  }
  function aplicar() { pintarCabecera(); escribirURL(); cargar(true); }

  el.cats.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    st.cat = b.dataset.cat;
    st.tipo = st.tipo.filter(s => subsDe(st.cat).some(x => x.id === s));
    pintarTipos();
    aplicar();
  });
  el.filtros.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) {
      st[t.dataset.f] = [...el.filtros.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
      aplicar();
    } else if (t === el.oferta) { st.oferta = t.checked; aplicar(); }
  });
  el.orden.addEventListener('change', () => { st.orden = valida(el.orden.value, ORDENES) || 'destacados'; aplicar(); });
  let deb = 0;
  el.q.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { st.q = el.q.value.trim().slice(0, 60); aplicar(); }, 250); });
  document.getElementById('buscador')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); st.q = el.q.value.trim().slice(0, 60); aplicar(); });
  el.verMas.addEventListener('click', () => cargar(false));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(st, { cat: '', tipo: [], venta: [], oferta: false, q: '' });
      el.q.value = '';
      if (el.oferta) el.oferta.checked = false;
      el.filtros.querySelectorAll('input[type="checkbox"]').forEach(i => { i.checked = false; });
      pintarTipos();
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-quitar-filtro]');
    if (!chip) return;
    const k = chip.dataset.quitarFiltro, v = chip.dataset.valor;
    if (k === 'cat') { st.cat = ''; pintarTipos(); }
    else if (k === 'oferta') { st.oferta = false; if (el.oferta) el.oferta.checked = false; }
    else if (k === 'q') { st.q = ''; el.q.value = ''; }
    else { st[k] = st[k].filter(x => x !== v); const i = el.filtros.querySelector(`input[data-f="${k}"][value="${v}"]`); if (i) i.checked = false; }
    aplicar();
  });

  const mobileMq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  let filtrosFoco = null;
  const cerrarFiltros = () => {
    if (!el.filtros.classList.contains('open')) return;
    el.filtros.classList.remove('open'); bd.classList.remove('open');
    el.abrir?.setAttribute('aria-expanded', 'false');
    if (mobileMq.matches) el.filtros.setAttribute('inert', '');
    syncNoScroll();
    filtrosFoco?.focus();
  };
  const abrirFiltros = () => {
    filtrosFoco = document.activeElement;
    el.filtros.removeAttribute('inert');
    el.filtros.classList.add('open'); bd.classList.add('open');
    el.abrir?.setAttribute('aria-expanded', 'true');
    syncNoScroll();
    el.filtros.querySelector('[data-cerrar-filtros]')?.focus();
  };
  el.abrir?.addEventListener('click', abrirFiltros);
  bd.addEventListener('click', cerrarFiltros);
  el.filtros.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarFiltros(); });
  document.addEventListener('keydown', e => {
    if (!el.filtros.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros(); else atraparFoco(el.filtros, e);
  });
  const syncFiltros = () => {
    if (mobileMq.matches) {
      if (!el.filtros.classList.contains('open')) el.filtros.setAttribute('inert', '');
      el.filtros.querySelectorAll('[data-animate]').forEach(x => x.classList.add('in'));
    } else { el.filtros.removeAttribute('inert'); cerrarFiltros(); }
  };
  mobileMq.addEventListener('change', syncFiltros);
  syncFiltros();

  pintarCabecera();
  cargar(true);
  if (params.has('q') && !st.q) setTimeout(() => el.q.focus({ preventScroll: true }), 300);
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

[
  initModelBarScroll, initNav, initCatMenu, initEstado, initTicketHero, renderRail, renderPreview, renderMostrador,
  initAcciones, initQuickView, initCarrito, initFloats, initCatalogo, updateCartBadge, initReveals, initHeroMotion, initParallax, initMapa,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
