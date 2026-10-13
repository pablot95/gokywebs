const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WSP = '5492233494992';
const ES_M2 = document.body.classList.contains('m2');
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = ES_M2 ? 'catalogo-2.html' : 'catalogo.html';

const CATEGORIAS = [
  { id: 'chocolate', nombre: 'Bañados en chocolate', corto: 'Chocolate', img: 'images/p-choco-corte.webp' },
  { id: 'maicena', nombre: 'Maicena', corto: 'Maicena', img: 'images/p-maicena-pila.webp' },
  { id: 'blanco', nombre: 'Chocolate blanco', corto: 'Blancos', img: 'images/p-blanco-hilos.webp' },
  { id: 'cajas', nombre: 'Cajas y regalos', corto: 'Cajas', img: 'images/p-necochea.webp' },
];

const PRECIOS = [
  { id: 'hasta-3000', nombre: 'Hasta $3.000', min: 0, max: 3001 },
  { id: '3000-10000', nombre: '$3.001 a $10.000', min: 3001, max: 10001 },
  { id: 'mas-10000', nombre: 'Más de $10.000', min: 10001, max: Infinity },
];

const PROMOS_FILTRO = [
  { id: 'docena', nombre: 'Entran en la docena −15%' },
  { id: 'ofertas', nombre: 'Con descuento' },
];

const PROMO_DOCENA = { minimo: 12, pct: 15 };
const CUPONES = { GROSO10: 10 };
const LIMITE_SERVIDOR = 100;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getCategoria = id => CATEGORIAS.find(c => c.id === id);

const Servidor = (() => {
  const coleccion = [
    { id: 'clasico', nombre: 'Clásico de chocolate', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 2800, descuento: 0, stock: 40, destacado: true, img: 'images/p-clasico.webp', img2: 'images/p-ddl-corte.webp', alt: 'Alfajores de chocolate en un plato de cerámica, uno partido al medio con dulce de leche', relleno: 'Dulce de leche', desc: 'Galletas de cacao, dulce de leche repostero y baño de chocolate semiamargo. El de siempre, hecho a mano.', tags: ['negro', 'semiamargo'] },
    { id: 'groso', nombre: 'El Groso, doble dulce de leche', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3600, descuento: 0, stock: 24, destacado: true, portada: true, img: 'images/p-groso.webp', img2: 'images/p-necochea.webp', alt: 'Pila de alfajores de chocolate y uno cortado que deja ver una capa gruesa de dulce de leche', relleno: 'Doble dulce de leche', desc: 'Dos capas de dulce de leche entre galletas de cacao, bañado en chocolate semiamargo. Para los que siempre piden más relleno.', tags: ['doble', 'relleno', 'negro'] },
    { id: 'ddl', nombre: 'Dulce de leche intenso', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3000, descuento: 0, stock: 18, img: 'images/p-ddl-corte.webp', alt: 'Alfajor de chocolate partido con el dulce de leche oscuro a la vista', relleno: 'Dulce de leche oscuro', desc: 'Galletas de cacao húmedas con dulce de leche bien oscuro y baño de chocolate semiamargo.', tags: ['negro'] },
    { id: 'cafe', nombre: 'Chocolate y café', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3000, descuento: 0, stock: 22, destacado: true, img: 'images/p-cafe.webp', img2: 'images/p-cafe-corte.webp', alt: 'Alfajores de chocolate sobre una tabla de madera junto a una taza de café', relleno: 'Dulce de leche con café', desc: 'Dulce de leche con café y baño de chocolate con leche. Va directo con un cortado.', tags: ['cafe', 'mocca'] },
    { id: 'amargo', nombre: 'Chocolate amargo', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3200, descuento: 0, stock: 12, nuevo: true, img: 'images/p-amargo.webp', alt: 'Alfajor bañado en chocolate amargo con textura de puntitos, dentro de una caja', relleno: 'Dulce de leche', desc: 'Baño de chocolate amargo, galletas de cacao y dulce de leche. Menos dulce, más chocolate.', tags: ['amargo', 'negro'] },
    { id: 'florsal', nombre: 'Chocolate y flor de sal', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3300, descuento: 0, stock: 3, destacado: true, nuevo: true, img: 'images/p-flor-sal.webp', alt: 'Alfajor de chocolate con escamas de sal por encima', relleno: 'Dulce de leche', desc: 'Chocolate semiamargo con escamas de sal arriba: el dulce de leche se siente todavía más.', tags: ['sal', 'salado'] },
    { id: 'avellanas', nombre: 'Chocolate y avellanas', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3400, descuento: 0, stock: 15, img: 'images/p-avellanas.webp', alt: 'Alfajor de chocolate cubierto de avellanas tostadas picadas', relleno: 'Dulce de leche', desc: 'Bañado en chocolate y cubierto de avellanas tostadas picadas.', tags: ['frutos secos', 'avellana'] },
    { id: 'cocochoco', nombre: 'Chocolate y coco', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 3000, descuento: 0, stock: 20, img: 'images/p-coco-choco.webp', alt: 'Alfajor de chocolate con el borde pasado por coco rallado', relleno: 'Dulce de leche', desc: 'Baño de chocolate y borde de coco rallado, para los que no se deciden entre los dos.', tags: ['coco'] },
    { id: 'chocoleche', nombre: 'Chocolate con leche', cat: 'chocolate', unidad: true, contenido: '1 alfajor', precio: 2900, descuento: 0, stock: 30, img: 'images/p-choco-corte.webp', alt: 'Alfajor de chocolate con leche cortado sobre papel manteca', relleno: 'Dulce de leche', desc: 'Baño de chocolate con leche, más suave. El preferido de los chicos.', tags: ['leche', 'suave'] },
    { id: 'maicena', nombre: 'Maicena tradicional', cat: 'maicena', unidad: true, contenido: '1 alfajor', precio: 2300, descuento: 0, stock: 40, destacado: true, img: 'images/p-maicena.webp', img2: 'images/p-maicena-pila.webp', alt: 'Alfajores de maicena con azúcar impalpable sobre una tabla de madera', relleno: 'Dulce de leche', desc: 'Tapitas de maicena que se deshacen, dulce de leche y azúcar impalpable por encima.', tags: ['maicena', 'impalpable'] },
    { id: 'maicenacoco', nombre: 'Maicena con coco', cat: 'maicena', unidad: true, contenido: '1 alfajor', precio: 2400, descuento: 0, stock: 30, img: 'images/p-maicena-coco.webp', img2: 'images/p-maicena-corte.webp', alt: 'Alfajor de maicena con el borde de dulce de leche pasado por coco', relleno: 'Dulce de leche', desc: 'El de maicena de siempre, con el borde de dulce de leche pasado por coco rallado.', tags: ['maicena', 'coco'] },
    { id: 'alfajorcitos', nombre: 'Alfajorcitos de maicena x12', cat: 'maicena', unidad: false, contenido: 'Bolsa de 12', precio: 7900, descuento: 10, stock: 16, img: 'images/p-maicena-corte.webp', alt: 'Alfajorcito de maicena partido con dulce de leche y coco', relleno: 'Dulce de leche', desc: 'Doce alfajorcitos de maicena de un bocado, para la merienda o la mesa dulce.', tags: ['mini', 'bocado', 'maicena'] },
    { id: 'pistacho', nombre: 'Blanco y pistacho', cat: 'blanco', unidad: true, contenido: '1 alfajor', precio: 3500, descuento: 0, stock: 10, destacado: true, nuevo: true, img: 'images/p-pistacho.webp', alt: 'Alfajor bañado en chocolate blanco con pistachos picados', relleno: 'Dulce de leche', desc: 'Baño de chocolate blanco con pistachos picados por encima.', tags: ['pistacho', 'frutos secos'] },
    { id: 'blancohilos', nombre: 'Blanco con hilos de chocolate', cat: 'blanco', unidad: true, contenido: '1 alfajor', precio: 3100, descuento: 0, stock: 0, img: 'images/p-blanco-hilos.webp', alt: 'Alfajor de chocolate blanco decorado con hilos de chocolate', relleno: 'Dulce de leche', desc: 'Chocolate blanco con hilos de chocolate semiamargo y un toque de avellana.', tags: ['blanco'] },
    { id: 'caja6', nombre: 'Caja surtida x6', cat: 'cajas', unidad: false, contenido: 'Caja de 6', precio: 18500, descuento: 10, stock: 14, destacado: true, img: 'images/p-caja6.webp', alt: 'Caja de cartón abierta con seis alfajores de distintos sabores', relleno: 'Surtido', desc: 'Seis sabores en caja de cartón: avellanas, pistacho, amargo, blanco con hilos, flor de sal y coco.', tags: ['regalo', 'surtido', 'caja'] },
    { id: 'caja12', nombre: 'Caja surtida x12', cat: 'cajas', unidad: false, contenido: 'Caja de 12', precio: 35000, descuento: 15, stock: 8, destacado: true, img: 'images/p-mix.webp', alt: 'Alfajores de chocolate y de maicena con coco sobre papel manteca', relleno: 'Surtido', desc: 'Doce alfajores de chocolate, maicena y café en una caja lista para regalar o compartir.', tags: ['regalo', 'surtido', 'caja', 'docena'] },
    { id: 'cajamaicena', nombre: 'Caja de maicena x12', cat: 'cajas', unidad: false, contenido: 'Caja de 12', precio: 25000, descuento: 10, stock: 9, img: 'images/p-maicena-pila.webp', alt: 'Alfajores de maicena apilados con azúcar impalpable', relleno: 'Dulce de leche', desc: 'Doce alfajores de maicena con azúcar impalpable, en caja.', tags: ['maicena', 'caja', 'docena'] },
    { id: 'cajacafe', nombre: 'Caja chocolate y café x6', cat: 'cajas', unidad: false, contenido: 'Caja de 6', precio: 17000, descuento: 0, stock: 9, img: 'images/p-cafe-corte.webp', alt: 'Alfajor de chocolate y café partido sobre papel manteca', relleno: 'Dulce de leche con café', desc: 'Seis alfajores de chocolate y café, para regalar con un paquete de café.', tags: ['regalo', 'cafe', 'caja'] },
    { id: 'cajanecochea', nombre: 'Caja Necochea x9', cat: 'cajas', unidad: false, contenido: 'Caja de 9', precio: 27900, descuento: 0, stock: 6, nuevo: true, img: 'images/p-necochea.webp', alt: 'Alfajores de chocolate apilados con el mar de Necochea al atardecer de fondo', relleno: 'Surtido de chocolate', desc: 'Nueve alfajores bañados en chocolate: clásico, El Groso y dulce de leche intenso. La que se lleva de regalo desde la costa.', tags: ['regalo', 'caja', 'necochea'] },
  ];

  const coincide = (p, f) => {
    if (p.visible === false) return false;
    if (f.destacado === true && !p.destacado) return false;
    if (f.destacado === false && p.destacado) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.excluir?.length && f.excluir.includes(p.id)) return false;
    if (f.cat?.length && !f.cat.includes(p.cat)) return false;
    if (f.promo?.length && !f.promo.some(id => (id === 'docena' && p.unidad) || (id === 'ofertas' && p.descuento > 0))) return false;
    if (f.stock && p.stock <= 0) return false;
    if (f.precio?.length) {
      const v = precioFinal(p);
      if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
    }
    if (f.q) {
      const texto = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.relleno, p.contenido, p.desc, ...(p.tags || [])].join(' '));
      if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
    }
    return true;
  };

  const ORDENES = {
    destacados: (a, b) => (b.p.destacado ? 1 : 0) - (a.p.destacado ? 1 : 0) || (b.p.nuevo ? 1 : 0) - (a.p.nuevo ? 1 : 0) || (b.p.stock > 0 ? 1 : 0) - (a.p.stock > 0 ? 1 : 0) || a.i - b.i,
    'precio-asc': (a, b) => precioFinal(a.p) - precioFinal(b.p) || a.i - b.i,
    'precio-desc': (a, b) => precioFinal(b.p) - precioFinal(a.p) || a.i - b.i,
    nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i,
  };

  const copia = p => ({ ...p, tags: [...(p.tags || [])] });

  return {
    consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
      const tope = Math.min(Math.max(1, Math.floor(limite) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
      const lista = coleccion.map((p, i) => ({ p, i })).filter(x => coincide(x.p, filtros)).sort(ORDENES[orden] || ORDENES.destacados).map(x => x.p);
      let desde = 0;
      if (cursor) {
        const k = lista.findIndex(p => p.id === cursor);
        if (k < 0) return { items: [], siguiente: null, total: lista.length };
        desde = k + 1;
      }
      const items = lista.slice(desde, desde + tope).map(copia);
      const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
      return { items, siguiente, total: lista.length };
    },
    contar(filtros = {}) {
      return coleccion.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
    },
    obtener(id) {
      const p = coleccion.find(x => x.id === id);
      return p ? copia(p) : null;
    },
  };
})();

const getProducto = id => Servidor.obtener(id);

const Cart = {
  KEY: 'grosoalfajor_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch {} document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  qtyDe(id) { return this.get().find(i => i.id === id)?.qty || 0; },
};

const Cupon = {
  KEY: 'grosoalfajor_cupon',
  get() { try { const c = localStorage.getItem(this.KEY); return c && CUPONES[c] ? c : ''; } catch { return ''; } },
  set(c) {
    try { if (c) localStorage.setItem(this.KEY, c); else localStorage.removeItem(this.KEY); } catch {}
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
};

function resumenCarrito() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(l => l.p);
  const lista = lineas.reduce((s, l) => s + l.p.precio * l.qty, 0);
  const subtotal = lineas.reduce((s, l) => s + precioFinal(l.p) * l.qty, 0);
  const sueltos = lineas.filter(l => l.p.unidad);
  const cantSueltos = sueltos.reduce((s, l) => s + l.qty, 0);
  const baseSueltos = sueltos.reduce((s, l) => s + precioFinal(l.p) * l.qty, 0);
  const docena = cantSueltos >= PROMO_DOCENA.minimo ? Math.round(baseSueltos * PROMO_DOCENA.pct / 100) : 0;
  const codigo = Cupon.get();
  const cupon = codigo ? Math.round((subtotal - docena) * CUPONES[codigo] / 100) : 0;
  const total = subtotal - docena - cupon;
  return {
    lineas, subtotal, cantSueltos, docena, codigo, cupon, total,
    faltan: cantSueltos > 0 && cantSueltos < PROMO_DOCENA.minimo ? PROMO_DOCENA.minimo - cantSueltos : 0,
    ahorro: lista - total,
  };
}

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_TICKET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M9 9h.01M15 15h.01M15 9l-6 6"/></svg>';
const ICON_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function badgesHTML(p) {
  let b = '';
  if (p.stock <= 0) b = '<span class="badge badge--agotado">Sin stock</span>';
  else if (p.descuento > 0) b = `<span class="badge badge--off">−${Math.round(p.descuento)}%</span>`;
  else if (p.nuevo) b = '<span class="badge">Nuevo</span>';
  else if (p.stock <= 3) b = '<span class="badge badge--ultimas">Últimas unidades</span>';
  return b ? `<span class="badges">${b}</span>` : '';
}

function precioHTML(p) {
  const cu = p.unidad ? '<span class="precio__cu">c/u</span>' : '';
  return p.descuento > 0
    ? `<span class="precio precio--final">${formatearPrecio(precioFinal(p))}</span><s class="precio--antes">${formatearPrecio(p.precio)}</s>${cu}`
    : `<span class="precio">${formatearPrecio(p.precio)}</span>${cu}`;
}

function stepperHTML(p, valor = 1, clase = '') {
  const max = Math.max(1, p.stock);
  return `<div class="stepper ${clase}" data-stepper>
    <button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button>
    <input type="number" value="${valor}" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" ${p.stock <= 0 ? 'disabled' : ''}>
    <button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button>
  </div>`;
}

function cardHTML(p, { anim = 'subir', animar = true, grande = false } = {}) {
  const cat = getCategoria(p.cat);
  const agotado = p.stock <= 0;
  const link = `${URL_CATALOGO}?producto=${encodeURIComponent(p.id)}`;
  return `<article class="card${grande ? ' card--grande' : ''}${agotado ? ' card--agotado' : ''}" data-id="${esc(p.id)}" ${animar ? ANIM[anim] : ''}>
    <a class="card__media" href="${link}" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" decoding="async">
      ${p.img2 ? `<img class="card__alt" src="${p.img2}" alt="" aria-hidden="true" width="600" height="600" decoding="async">` : ''}
      ${badgesHTML(p)}
    </a>
    <div class="card__info">
      <p class="card__cat">${esc(cat?.corto || '')}<span class="card__cont"> · ${esc(p.contenido)}</span></p>
      <h3 class="card__name"><a href="${link}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      <p class="card__price">${precioHTML(p)}</p>
      <div class="prod-actions">
        ${stepperHTML(p)}
        <button type="button" class="btn btn--cta prod-add" data-add="${esc(p.id)}" ${agotado ? 'disabled' : ''}>${ICON_CARRITO}<span>${agotado ? 'Sin stock' : 'Agregar'}</span></button>
      </div>
      <button type="button" class="card__buy" data-buy="${esc(p.id)}" ${agotado ? 'disabled' : ''}>Comprar ahora</button>
    </div>
  </article>`;
}

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

let cerrarFiltrosFn = null;

const Overlay = {
  abiertos: [],
  abrir(el, { foco } = {}) {
    if (!el || !el.hidden) return;
    const previo = document.activeElement;
    this.abiertos.push({ el, previo });
    el.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
    const panel = el.querySelector('[role="dialog"]') || el;
    setTimeout(() => (foco || panel).focus({ preventScroll: true }), 40);
  },
  cerrar(el, { devolverFoco = true } = {}) {
    const k = this.abiertos.findIndex(o => o.el === el);
    if (k < 0) return;
    const { previo } = this.abiertos[k];
    this.abiertos.splice(k, 1);
    el.classList.remove('open');
    setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, 360);
    if (!this.abiertos.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll');
    if (devolverFoco && previo && document.contains(previo)) previo.focus({ preventScroll: true });
  },
  tope() { return this.abiertos[this.abiertos.length - 1]?.el || null; },
};

function trapFocus(panel, e) {
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

document.addEventListener('keydown', e => {
  const top = Overlay.tope();
  if (!top) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    if (top.id === 'qv') cerrarVistaRapida();
    else if (top.id === 'cartDrawer') closeCartDrawer();
    else if (top.id === 'filtros' && cerrarFiltrosFn) cerrarFiltrosFn();
    else Overlay.cerrar(top);
  } else if (e.key === 'Tab') {
    trapFocus(top.querySelector('[role="dialog"]') || top, e);
  }
});

function openCartDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  renderCart();
  Overlay.abrir(d);
}

function closeCartDrawer() {
  Overlay.cerrar(document.getElementById('cartDrawer'));
}

function mensajePedido(r) {
  const lineas = r.lineas.map(l => `• ${l.qty} × ${l.p.nombre} (${formatearPrecio(precioFinal(l.p) * l.qty)})`);
  const extras = [];
  if (r.docena) extras.push(`Promo docena: −${formatearPrecio(r.docena)}`);
  if (r.cupon) extras.push(`Código ${r.codigo}: −${formatearPrecio(r.cupon)}`);
  return ['¡Hola Groso! Quiero hacer este pedido:', ...lineas, ...extras, `Total: ${formatearPrecio(r.total)}`].join('\n');
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body || !foot) return;
  const r = resumenCarrito();
  document.querySelectorAll('[data-cart-items]').forEach(el => { el.textContent = r.lineas.length ? `(${Cart.count()})` : ''; });
  if (!r.lineas.length) {
    body.innerHTML = `<div class="cart-vacio">
      <p class="cart-vacio__title">Tu caja está vacía</p>
      <p>Un clásico de chocolate nunca falla. O sumá doce sueltos y la docena sale con 15% off.</p>
      <a class="btn btn--cta" href="${URL_CATALOGO}">Ver los alfajores ${ICON_FLECHA}</a>
    </div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="cart-lineas">${r.lineas.map(l => `<li class="cart-linea">
      <img src="${l.p.img}" alt="" width="72" height="72" decoding="async">
      <div class="cart-linea__info">
        <p class="cart-linea__name">${esc(l.p.nombre)}</p>
        <p class="cart-linea__meta">${esc(l.p.contenido)} · ${formatearPrecio(precioFinal(l.p))}${l.p.descuento > 0 ? ` <s>${formatearPrecio(l.p.precio)}</s>` : ''}</p>
        <div class="cart-linea__row">
          <div class="stepper stepper--chico">
            <button type="button" data-cart-step="-1" data-id="${esc(l.id)}" aria-label="Restar uno de ${esc(l.p.nombre)}">${ICON_MENOS}</button>
            <span class="stepper__n" aria-live="polite">${l.qty}</span>
            <button type="button" data-cart-step="1" data-id="${esc(l.id)}" aria-label="Sumar uno de ${esc(l.p.nombre)}" ${l.qty >= l.p.stock ? 'disabled' : ''}>${ICON_MAS}</button>
          </div>
          <p class="cart-linea__total">${formatearPrecio(precioFinal(l.p) * l.qty)}</p>
        </div>
      </div>
      <button type="button" class="cart-linea__quitar" data-cart-remove="${esc(l.id)}" aria-label="Quitar ${esc(l.p.nombre)}">${ICON_X}</button>
    </li>`).join('')}</ul>
    ${r.docena
      ? `<p class="cart-promo cart-promo--ok">${ICON_TICKET}<span><strong>Docena Groso aplicada:</strong> 15% off en tus ${r.cantSueltos} alfajores sueltos.</span></p>`
      : r.faltan
        ? `<p class="cart-promo">${ICON_TICKET}<span>Sumá <strong>${r.faltan} ${r.faltan === 1 ? 'alfajor suelto' : 'alfajores sueltos'}</strong> más y la docena sale con 15% off.</span></p>`
        : ''}`;

  foot.innerHTML = `${r.codigo
      ? `<div class="cupon cupon--ok"><span class="cupon__chip">${ICON_TICKET}${esc(r.codigo)} · −${CUPONES[r.codigo]}%</span><button type="button" class="link-btn" data-cupon-quitar>Quitar</button></div>`
      : `<form class="cupon" id="cuponForm" novalidate>
          <label class="cupon__label" for="cuponInput">¿Tenés un código de descuento?</label>
          <div class="cupon__row">
            <input id="cuponInput" type="text" autocomplete="off" placeholder="Ej.: GROSO10" maxlength="20">
            <button type="submit" class="btn btn--ghost btn--chico">Aplicar</button>
          </div>
          <p class="cupon__error" id="cuponError" hidden></p>
        </form>`}
    <dl class="totales">
      <div><dt>Subtotal</dt><dd>${formatearPrecio(r.subtotal)}</dd></div>
      ${r.docena ? `<div class="totales__desc"><dt>Promo docena (−15%)</dt><dd>−${formatearPrecio(r.docena)}</dd></div>` : ''}
      ${r.cupon ? `<div class="totales__desc"><dt>Código ${esc(r.codigo)}</dt><dd>−${formatearPrecio(r.cupon)}</dd></div>` : ''}
      <div class="totales__total"><dt>Total</dt><dd>${formatearPrecio(r.total)}</dd></div>
    </dl>
    ${r.ahorro > 0 ? `<p class="ahorro">Con las promos ahorrás ${formatearPrecio(r.ahorro)}</p>` : ''}
    <button type="button" class="btn btn--cta btn--block" data-checkout>Finalizar compra</button>
    <a class="btn-wsp-pedido" href="https://wa.me/${WSP}?text=${encodeURIComponent(mensajePedido(r))}" target="_blank" rel="noopener">${ICON_WSP}<span>Prefiero pedir por WhatsApp</span></a>`;
}

function initCart() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCart(); });
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cart-close]')) { closeCartDrawer(); return; }
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const id = step.dataset.id;
      const actual = Cart.qtyDe(id);
      const n = actual + Number(step.dataset.cartStep);
      if (n <= 0) Cart.remove(id); else Cart.setQty(id, n);
      return;
    }
    const quitar = e.target.closest('[data-cart-remove]');
    if (quitar) { Cart.remove(quitar.dataset.cartRemove); return; }
    if (e.target.closest('[data-cupon-quitar]')) { Cupon.set(''); return; }
    if (e.target.closest('[data-checkout]')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  d.addEventListener('submit', e => {
    if (e.target.id !== 'cuponForm') return;
    e.preventDefault();
    const input = document.getElementById('cuponInput');
    const err = document.getElementById('cuponError');
    const codigo = (input?.value || '').trim().toUpperCase();
    if (CUPONES[codigo]) {
      Cupon.set(codigo);
      showToast(`Código ${codigo} aplicado: ${CUPONES[codigo]}% off`);
    } else if (err && input) {
      err.textContent = codigo ? 'Ese código no existe o ya venció. Probá con GROSO10.' : 'Escribí el código antes de aplicarlo.';
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'cuponError');
      input.focus();
    }
  });
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  updateCartBadge();
}

function cantidadDesde(btn) {
  const input = btn.closest('.card, .qv__compra')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function agregar(id, qty, { abrir = false } = {}) {
  const p = getProducto(id);
  if (!p || p.stock <= 0) return false;
  const yaEsta = Cart.qtyDe(id);
  if (yaEsta >= p.stock) {
    showToast(`No quedan más unidades de ${p.nombre} por ahora.`);
    return false;
  }
  const suma = Math.min(qty, p.stock - yaEsta);
  Cart.add(p, suma);
  if (abrir) openCartDrawer();
  else showToast(`${suma > 1 ? `${suma} × ` : ''}${p.nombre}: ya está en tu pedido`);
  return true;
}

document.addEventListener('click', e => {
  const step = e.target.closest('[data-step]');
  if (step) {
    const input = step.closest('[data-stepper]')?.querySelector('input');
    if (input && !input.disabled) {
      const max = parseInt(input.max, 10) || 99;
      input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
    }
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    if (agregar(add.dataset.add, cantidadDesde(add))) {
      add.classList.remove('pop'); void add.offsetWidth; add.classList.add('pop');
    }
    return;
  }
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    const enModal = buy.closest('#qv');
    const qty = cantidadDesde(buy);
    if (enModal) cerrarVistaRapida({ devolverFoco: false });
    agregar(buy.dataset.buy, qty, { abrir: true });
    return;
  }
  const quick = e.target.closest('[data-quick]');
  if (quick) {
    e.preventDefault();
    abrirVistaRapida(quick.dataset.quick);
    return;
  }
  const cup = e.target.closest('[data-aplicar-cupon]');
  if (cup) {
    const c = cup.dataset.aplicarCupon;
    Cupon.set(c);
    showToast(`Listo: el código ${c} ya quedó aplicado en tu carrito.`);
  }
});

document.addEventListener('change', e => {
  const input = e.target.closest('[data-stepper] input');
  if (!input) return;
  const max = parseInt(input.max, 10) || 99;
  input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
});

function escribirLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'Groso alfajor' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}

function abrirVistaRapida(id) {
  const qv = document.getElementById('qv');
  const body = document.getElementById('qvBody');
  const p = getProducto(id);
  if (!qv || !body || !p) return;
  const cat = getCategoria(p.cat);
  const relacionados = Servidor.consultar({ filtros: { cat: [p.cat], excluir: [p.id], stock: true }, limite: 3 }).items;
  const fotos = [p.img, p.img2].filter(Boolean);
  const agotado = p.stock <= 0;
  body.innerHTML = `<div class="qv__galeria">
      <div class="qv__foto"><img id="qvFoto" src="${p.img}" alt="${esc(p.alt)}" width="700" height="700" decoding="async">${badgesHTML(p)}</div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, k) => `<button type="button" class="qv__thumb" data-foto="${f}" aria-label="Ver foto ${k + 1}" aria-pressed="${k === 0}"><img src="${f}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre || '')} · ${esc(p.contenido)}</p>
      <h2 class="qv__name" id="qvTitulo">${esc(p.nombre)}</h2>
      <p class="qv__precio">${precioHTML(p)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__datos">
        <li><span>Relleno</span>${esc(p.relleno)}</li>
        <li><span>Presentación</span>${esc(p.contenido)}</li>
        <li><span>Disponibilidad</span>${agotado ? 'Sin stock por ahora' : p.stock <= 3 ? `Quedan ${p.stock}` : 'Hay stock'}</li>
      </ul>
      ${p.unidad ? `<p class="qv__promo">${ICON_TICKET}<span>Entra en la <strong>promo docena</strong>: desde 12 alfajores sueltos, 15% off en el carrito.</span></p>` : ''}
      ${p.descuento > 0 ? `<p class="qv__promo">${ICON_TICKET}<span>Ahorrás ${formatearPrecio(p.precio - precioFinal(p))} con el ${p.descuento}% de descuento.</span></p>` : ''}
      <div class="qv__compra">
        ${stepperHTML(p)}
        <button type="button" class="btn btn--cta" data-add="${esc(p.id)}" ${agotado ? 'disabled' : ''}>${ICON_CARRITO}<span>${agotado ? 'Sin stock' : 'Agregar al carrito'}</span></button>
        <button type="button" class="btn btn--ghost" data-buy="${esc(p.id)}" ${agotado ? 'disabled' : ''}>Comprar ahora</button>
      </div>
      ${agotado ? `<a class="qv__aviso" href="https://wa.me/${WSP}?text=${encodeURIComponent(`¡Hola Groso! ¿Cuándo vuelve el ${p.nombre}?`)}" target="_blank" rel="noopener">${ICON_WSP}<span>Avisame cuando vuelva</span></a>` : ''}
      ${relacionados.length ? `<div class="qv__rel">
        <p class="qv__rel-title">También te puede gustar</p>
        <ul>${relacionados.map(r => `<li><a href="${URL_CATALOGO}?producto=${r.id}" data-quick="${r.id}"><img src="${r.img}" alt="" width="80" height="80"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioFinal(r))}</strong></a></li>`).join('')}</ul>
      </div>` : ''}
    </div>`;
  body.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => {
    const img = document.getElementById('qvFoto');
    if (img) img.src = b.dataset.foto;
    body.querySelectorAll('[data-foto]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  escribirLdProducto(p);
  if (qv.hidden) Overlay.abrir(qv);
  else body.scrollTop = 0;
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    history.replaceState(null, '', u);
  }
}

function cerrarVistaRapida(opts) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  Overlay.cerrar(qv, opts);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    history.replaceState(null, '', u);
  }
}

function initVistaRapida() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => { if (e.target.closest('[data-qv-close]')) cerrarVistaRapida(); });
}

function initMenuCategorias() {
  document.querySelectorAll('[data-cat-menu]').forEach(menu => {
    menu.innerHTML = `<ul class="drop__list">${CATEGORIAS.map(c => `<li><a class="drop__item" href="${URL_CATALOGO}?cat=${c.id}" data-cat-link="${c.id}">
        <img src="${c.img}" alt="" width="56" height="56" decoding="async">
        <span class="drop__txt"><span class="drop__name">${esc(c.nombre)}</span><span class="drop__n">${Servidor.contar({ cat: [c.id] })} productos</span></span>
      </a></li>`).join('')}</ul>
      <a class="drop__all" href="${URL_CATALOGO}">Ver todo el catálogo ${ICON_FLECHA}</a>`;
  });
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
  document.querySelectorAll('.nav-drop').forEach(drop => {
    const btn = drop.querySelector('.nav-drop__btn');
    const panel = drop.querySelector('.nav-drop__panel');
    if (!btn || !panel) return;
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    drop.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    drop.addEventListener('mouseleave', () => { if (hoverMq.matches) t = setTimeout(cerrar, 120); });
    document.addEventListener('click', e => { if (hoverMq.matches && !drop.contains(e.target)) cerrar(); });
    drop.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); e.stopPropagation(); }
    });
    drop.addEventListener('focusout', e => { if (hoverMq.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Overlay.abiertos.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-drop__btn')?.focus();
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('button, input')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch {}
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch {}
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

function initRail(rail) {
  const vp = rail.querySelector('.rail-vp');
  const track = rail.querySelector('.rail-track');
  const prev = rail.querySelector('[data-rail-prev]');
  const next = rail.querySelector('[data-rail-next]');
  if (!vp || !track) return;
  initRailDrag(vp);
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-lista]').forEach(cont => {
    const tipo = cont.dataset.lista;
    const filtros = tipo === 'destacados' ? { destacado: true } : { destacado: false, stock: true };
    const { items } = Servidor.consultar({ filtros, limite: 8 });
    const enRail = cont.classList.contains('rail-track');
    const mosaico = cont.classList.contains('mosaico');
    if (mosaico) items.sort((a, b) => (b.portada ? 1 : 0) - (a.portada ? 1 : 0));
    let html = items.map((p, k) => cardHTML(p, { anim: enRail ? 'der' : 'subir', grande: mosaico && k === 0 })).join('');
    if (mosaico) {
      html += `<a class="mosaico__todo" href="${URL_CATALOGO}" ${ANIM.subir}>
        <span class="mosaico__n">${Servidor.contar({})}</span>
        <span class="mosaico__txt">alfajores y cajas para elegir</span>
        <span class="mosaico__cta">Ver todo el catálogo ${ICON_FLECHA}</span>
      </a>`;
    }
    cont.innerHTML = html;
  });
  document.querySelectorAll('[data-total-catalogo]').forEach(el => { el.textContent = Servidor.contar({}); });
  document.querySelectorAll('[data-cat-tiles]').forEach(cont => {
    const forma = cont.dataset.catTiles;
    cont.innerHTML = CATEGORIAS.map(c => {
      const n = Servidor.contar({ cat: [c.id] });
      return forma === 'circulos'
        ? `<li ${ANIM.escala}><a class="cat-circ" href="${URL_CATALOGO}?cat=${c.id}">
            <span class="cat-circ__foto"><img src="${c.img}" alt="" width="240" height="240" decoding="async"></span>
            <span class="cat-circ__name">${esc(c.nombre)}</span>
            <span class="cat-circ__n">${n} ${n === 1 ? 'producto' : 'productos'}</span>
          </a></li>`
        : `<li ${ANIM.subir}><a class="cat-card" href="${URL_CATALOGO}?cat=${c.id}">
            <span class="cat-card__foto"><img src="${c.img}" alt="" width="500" height="660" decoding="async"></span>
            <span class="cat-card__txt"><span class="cat-card__name">${esc(c.nombre)}</span><span class="cat-card__n">${n} ${n === 1 ? 'producto' : 'productos'} ${ICON_FLECHA}</span></span>
          </a></li>`;
    }).join('');
  });
  document.querySelectorAll('.rail').forEach(initRail);
}

function initHeroSlider() {
  const hero = document.querySelector('.hero--banner');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero__slide')];
  const dots = [...hero.querySelectorAll('.hero__dot')];
  if (slides.length < 2) return;
  let i = 0;
  let timer = 0;
  const ir = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-active', on);
      s.toggleAttribute('inert', !on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  };
  const stop = () => clearInterval(timer);
  const play = () => { stop(); if (!reduceMotion) timer = setInterval(() => ir(i + 1), 6500); };
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); play(); }));
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', play);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', e => { if (!hero.contains(e.relatedTarget)) play(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  ir(0);
  play();
}

const Catalogo = { PASO: 16, mostrar: 16, pintados: 0, buffer: [], siguiente: null, total: 0, estado: { cat: [], promo: [], precio: [], stock: false, q: '', orden: 'destacados' } };

function leerURLCatalogo() {
  const u = new URLSearchParams(location.search);
  const lista = (k, validos) => (u.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  Catalogo.estado = {
    cat: lista('cat', CATEGORIAS.map(c => c.id)),
    promo: lista('promo', PROMOS_FILTRO.map(x => x.id)),
    precio: lista('precio', PRECIOS.map(x => x.id)),
    stock: u.get('stock') === '1',
    q: (u.get('q') || '').slice(0, 60),
    orden: ['destacados', 'precio-asc', 'precio-desc', 'nombre'].includes(u.get('orden')) ? u.get('orden') : 'destacados',
  };
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const u = new URL(location.href);
  ['cat', 'promo', 'precio', 'stock', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
  if (e.cat.length) u.searchParams.set('cat', e.cat.join(','));
  if (e.promo.length) u.searchParams.set('promo', e.promo.join(','));
  if (e.precio.length) u.searchParams.set('precio', e.precio.join(','));
  if (e.stock) u.searchParams.set('stock', '1');
  if (e.q) u.searchParams.set('q', e.q);
  if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
  history.replaceState(null, '', u);
  sincronizarBarraModelos();
}

function sincronizarBarraModelos() {
  if (PAGINA !== 'catalogo') return;
  const u = new URLSearchParams(location.search);
  u.delete('producto');
  const qs = u.toString() ? `?${u}` : '';
  document.querySelectorAll('.gw-modelos__btn').forEach(a => {
    a.href = (a.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html') + qs;
  });
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const f = inp.dataset.f;
    inp.checked = f === 'stock' ? e.stock : (e[f] || []).includes(inp.value);
  });
  const q = document.getElementById('buscar');
  if (q && q.value !== e.q) q.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;

  const unaCat = e.cat.length === 1 && !e.promo.length ? getCategoria(e.cat[0]) : null;
  const soloPromo = !e.cat.length && e.promo.length === 1 ? PROMOS_FILTRO.find(x => x.id === e.promo[0]) : null;
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const nombre = unaCat ? unaCat.nombre : soloPromo ? (soloPromo.id === 'docena' ? 'Promo docena' : 'Ofertas') : '';
  if (titulo) titulo.textContent = nombre || 'Todos los alfajores';
  if (miga) { miga.hidden = !nombre; miga.textContent = nombre; }
  document.title = `${nombre || 'Catálogo'} — Groso alfajor`;
  document.querySelectorAll('[data-cat-link]').forEach(a => {
    if (unaCat && a.dataset.catLink === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.nombre })),
      ...e.promo.map(id => ({ f: 'promo', v: id, t: PROMOS_FILTRO.find(x => x.id === id)?.nombre })),
      ...e.precio.map(id => ({ f: 'precio', v: id, t: PRECIOS.find(x => x.id === id)?.nombre })),
      ...(e.stock ? [{ f: 'stock', v: '1', t: 'Con stock' }] : []),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('');
    chips.hidden = !items.length;
  }
  const n = e.cat.length + e.promo.length + e.precio.length + (e.stock ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
}

function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, promo: e.promo, precio: e.precio, stock: e.stock, q: e.q };
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    Catalogo.pintados = 0;
    const r = Servidor.consultar({ filtros, orden: e.orden, limite: LIMITE_SERVIDOR });
    Catalogo.buffer = r.items;
    Catalogo.siguiente = r.siguiente;
    Catalogo.total = r.total;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = Servidor.consultar({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_SERVIDOR });
    Catalogo.buffer.push(...r.items);
    Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-resultados]').forEach(b => { b.textContent = `Ver ${Catalogo.total} ${Catalogo.total === 1 ? 'resultado' : 'resultados'}`; });
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    const quedan = Math.max(0, Catalogo.total - Catalogo.pintados);
    mas.hidden = quedan === 0;
    mas.textContent = `Ver más (${quedan})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const grupo = (id, items, f) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = items.map(x => `<label class="f-check"><input type="checkbox" data-f="${f}" value="${x.id}"><span>${esc(x.nombre)}</span>${x.n !== undefined ? `<span class="f-n">${x.n}</span>` : ''}</label>`).join('');
  };
  grupo('fCat', CATEGORIAS.map(c => ({ ...c, n: Servidor.contar({ cat: [c.id] }) })), 'cat');
  grupo('fPromo', PROMOS_FILTRO.map(x => ({ ...x, n: Servidor.contar({ promo: [x.id] }) })), 'promo');
  grupo('fPrecio', PRECIOS, 'precio');

  leerURLCatalogo();
  sincronizarControles();
  sincronizarBarraModelos();
  cargarCatalogo(true);

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (inp) {
      const f = inp.dataset.f;
      const e = Catalogo.estado;
      if (f === 'stock') e.stock = inp.checked;
      else e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.id === 'orden') { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); }
  });

  const buscar = document.getElementById('buscar');
  let t = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 220);
  });
  buscar?.closest('form')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    Catalogo.estado.q = buscar.value.trim().slice(0, 60);
    aplicarCambioCatalogo();
    buscar.blur();
  });

  document.getElementById('chipsActivos')?.addEventListener('click', ev => {
    const c = ev.target.closest('[data-quitar]');
    if (!c) return;
    const e = Catalogo.estado;
    const f = c.dataset.quitar;
    if (f === 'stock') e.stock = false;
    else if (f === 'q') e.q = '';
    else e[f] = e[f].filter(v => v !== c.dataset.valor);
    aplicarCambioCatalogo();
  });

  const limpiar = () => {
    Catalogo.estado = { cat: [], promo: [], precio: [], stock: false, q: '', orden: Catalogo.estado.orden };
    aplicarCambioCatalogo();
  };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiar));

  document.getElementById('verMas')?.addEventListener('click', () => {
    Catalogo.mostrar += Catalogo.PASO;
    cargarCatalogo(false);
  });

  const panel = document.getElementById('filtros');
  const dialogo = panel?.querySelector('.filtros__panel');
  const mqMovil = window.matchMedia('(max-width: 1023px)');
  const abierto = () => Overlay.abiertos.some(o => o.el === panel);
  const syncFiltrosPanel = () => {
    if (!panel) return;
    if (mqMovil.matches) { if (!abierto()) panel.hidden = true; }
    else { panel.hidden = false; panel.classList.remove('open'); }
  };
  const abrirFiltros = () => {
    if (!panel || !mqMovil.matches) return;
    dialogo?.setAttribute('role', 'dialog');
    dialogo?.setAttribute('aria-modal', 'true');
    dialogo?.setAttribute('aria-label', 'Filtros');
    Overlay.abrir(panel);
  };
  const cerrarFiltros = () => {
    Overlay.cerrar(panel);
    ['role', 'aria-modal', 'aria-label'].forEach(a => dialogo?.removeAttribute(a));
  };
  cerrarFiltrosFn = cerrarFiltros;
  document.getElementById('abrirFiltros')?.addEventListener('click', abrirFiltros);
  panel?.addEventListener('click', e => { if (e.target.closest('[data-filtros-close]')) cerrarFiltros(); });
  mqMovil.addEventListener('change', () => {
    if (!mqMovil.matches && abierto()) cerrarFiltros();
    syncFiltrosPanel();
    setTimeout(syncFiltrosPanel, 400);
  });
  syncFiltrosPanel();

  const pid = new URLSearchParams(location.search).get('producto');
  if (pid && getProducto(pid)) abrirVistaRapida(pid);
  if (location.hash === '#buscar' && buscar) setTimeout(() => buscar.focus(), 300);
}

function initHeaderSearch() {
  document.querySelectorAll('form.search').forEach(f => {
    f.addEventListener('submit', e => {
      const q = f.querySelector('input')?.value.trim();
      if (!q) { e.preventDefault(); location.href = `${URL_CATALOGO}#buscar`; }
    });
  });
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
  const scope = hero.querySelector('.hero__slide.is-active') || hero;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = scope.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'scale,transform' }, 0);
  tl.from(scope.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(scope.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter,transform,opacity' }, 0.2)
    .from(scope.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
    .from(scope.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge, .hero__dots'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initMenuCategorias();
initHome();
initCatalogo();
initHeroSlider();
initReveals();
initNav();
initCart();
initVistaRapida();
initFloats();
initModelBarScroll();
initHeaderSearch();
initHeroMotion();
initParallax();
