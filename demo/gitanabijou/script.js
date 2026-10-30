const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491169645954';
const MARCA = 'Gitanabijou';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'pulseras', nombre: 'Pulseras', uno: 'Pulsera', bajada: 'Elásticas, a la medida de tu muñeca', img: 'images/p-pulsera-onix.webp' },
  { id: 'collares', nombre: 'Collares', uno: 'Collar', bajada: 'De cuentas enteras o con dije', img: 'images/p-collar-amatista.webp' },
  { id: 'rosarios', nombre: 'Rosarios', uno: 'Rosario', bajada: 'De nácar y de madera', img: 'images/p-rosario-nacar.webp' },
  { id: 'piedras', nombre: 'Piedras', uno: 'Piedra', bajada: 'Para tener cerca o regalar', img: 'images/p-drusa-amatista.webp' },
];
const PIEDRAS = [
  { id: 'amatista', nombre: 'Amatista', color: '#8E79B3' },
  { id: 'cuarzo-rosa', nombre: 'Cuarzo rosa', color: '#E6B9B6' },
  { id: 'onix', nombre: 'Ónix', color: '#25272C' },
  { id: 'turquesa', nombre: 'Turquesa', color: '#3E9F9A' },
  { id: 'nacar', nombre: 'Nácar', color: '#EEE7D8' },
  { id: 'madera', nombre: 'Madera', color: '#7A4A2B' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: null, max: 15000 },
  { id: '15a22', nombre: '$15.000 a $22.000', min: 15001, max: 22000 },
  { id: 'mas22', nombre: 'Más de $22.000', min: 22001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  pulseras: 'pulsera pulseras elastica muñeca brazalete', collares: 'collar collares cadena gargantilla dije colgante',
  rosarios: 'rosario rosarios religioso cruz virgen comunion bautismo regalo', piedras: 'piedra piedras cristal mineral decoracion energia regalo',
  amatista: 'amatista violeta lila', 'cuarzo-rosa': 'cuarzo rosa rosado', onix: 'onix ónix negro negra', turquesa: 'turquesa celeste verde agua',
  nacar: 'nacar nácar perla blanco', madera: 'madera marron',
};

const Tienda = crearTienda([
  { id: 'collar-turquesa-mandala', nombre: 'Collar de turquesa con dije mandala', cat: 'collares', piedras: ['turquesa'], precio: 24900, descuento: 0, stock: 6, alta: 30, rango: 1, tag: 'nuevo',
    var: { tipo: 'Largo', ops: ['45 cm', '50 cm'] }, img: 'images/p-collar-turquesa.webp', galeria: ['images/hero-busto.webp'],
    alt: 'Collar de cuentas de turquesa con separadores plateados y dije redondo con una flor, sobre un busto de lino',
    desc: 'Cuentas de turquesa de 8 mm con separadores plateados y un dije redondo con una flor mandala calada. Cierre de mosquetón.',
    datos: [['Piedra', 'Turquesa'], ['Cuentas', '8 mm'], ['Dije', 'Mandala plateado']] },
  { id: 'pulsera-cuarzo-rosa', nombre: 'Pulsera de cuarzo rosa con separadores plateados', cat: 'pulseras', piedras: ['cuarzo-rosa'], precio: 12900, descuento: 0, stock: 14, alta: 29, rango: 2,
    var: { tipo: 'Medida', ops: ['15 cm', '16 cm', '17 cm', '18 cm'] }, img: 'images/p-pulsera-cuarzo-rosa.webp', galeria: ['images/pulsera-lino.webp'],
    alt: 'Pulsera de cuentas de cuarzo rosa alternadas con bolitas plateadas, sobre un lino claro',
    desc: 'Cuentas de cuarzo rosa de 6 mm alternadas con bolitas plateadas, armada en hilo elástico. Elegí la medida de tu muñeca.',
    datos: [['Piedra', 'Cuarzo rosa'], ['Cuentas', '6 mm'], ['Armado', 'Hilo elástico']] },
  { id: 'pulsera-onix', nombre: 'Pulsera de ónix con separador tibetano', cat: 'pulseras', piedras: ['onix'], precio: 11500, descuento: 0, stock: 12, alta: 26, rango: 3,
    var: { tipo: 'Medida', ops: ['15 cm', '16 cm', '17 cm', '18 cm'] }, img: 'images/p-pulsera-onix.webp', galeria: ['images/g-onix.webp'],
    alt: 'Pulsera de cuentas negras de ónix con un separador plateado trabajado, sobre una piedra clara',
    desc: 'Cuentas de ónix negro de 10 mm y un separador plateado trabajado. Elástica, para usar sola o combinada.',
    datos: [['Piedra', 'Ónix'], ['Cuentas', '10 mm'], ['Armado', 'Hilo elástico']] },
  { id: 'collar-amatista', nombre: 'Collar de amatista', cat: 'collares', piedras: ['amatista'], precio: 21500, descuento: 0, stock: 5, alta: 25, rango: 4,
    var: { tipo: 'Largo', ops: ['42 cm', '45 cm'] }, img: 'images/p-collar-amatista.webp', galeria: ['images/g-amatista.webp'],
    alt: 'Collar de cuentas de amatista violeta con cierre plateado, extendido sobre un lino',
    desc: 'Cuentas de amatista de 8 mm, enteras y pulidas, con cierre de mosquetón plateado.',
    datos: [['Piedra', 'Amatista'], ['Cuentas', '8 mm'], ['Cierre', 'Mosquetón plateado']] },
  { id: 'rosario-nacar', nombre: 'Rosario de nácar con medalla de la Virgen', cat: 'rosarios', piedras: ['nacar'], precio: 18900, descuento: 0, stock: 7, alta: 24, rango: 5,
    img: 'images/p-rosario-nacar.webp', galeria: ['images/g-nacar.webp'],
    alt: 'Rosario de cuentas blancas de nácar con medalla de la Virgen y cruz plateada con Cristo',
    desc: 'Cuentas de nácar blanco unidas con eslabones plateados, medalla de la Virgen y cruz con Cristo.',
    datos: [['Material', 'Nácar'], ['Medalla', 'Virgen, plateada'], ['Cruz', 'Plateada con Cristo']] },
  { id: 'drusa-amatista', nombre: 'Drusa de amatista', cat: 'piedras', piedras: ['amatista'], precio: 28000, descuento: 0, stock: 1, alta: 23, rango: 6, tag: 'unica',
    img: 'images/p-drusa-amatista.webp', galeria: ['images/g-drusa.webp'],
    alt: 'Drusa de cristales de amatista violeta sobre su base de roca gris',
    desc: 'Grupo de cristales de amatista sobre su base de roca. Cada drusa es única, con su forma y su tono.',
    datos: [['Piedra', 'Amatista en bruto'], ['Tamaño', 'Mediana, 8 a 10 cm']] },
  { id: 'colgante-turquesa-cuero', nombre: 'Colgante de turquesa en cordón de cuero', cat: 'collares', piedras: ['turquesa'], precio: 15800, descuento: 0, stock: 8, alta: 28, rango: 7,
    img: 'images/p-colgante-turquesa.webp', galeria: ['images/g-colgante.webp'],
    alt: 'Colgante de piedra turquesa envuelta en alambre plateado, colgando de un cordón de cuero',
    desc: 'Piedra de turquesa rodada, envuelta a mano con alambre plateado, en cordón de cuero con cadenita para regular el largo.',
    datos: [['Piedra', 'Turquesa rodada'], ['Cordón', 'Cuero, regulable']] },
  { id: 'corazon-cuarzo-rosa', nombre: 'Corazón de cuarzo rosa pulido', cat: 'piedras', piedras: ['cuarzo-rosa'], precio: 16500, descuento: 0, stock: 9, alta: 27, rango: 8,
    img: 'images/p-corazon-cuarzo.webp', galeria: ['images/g-corazon.webp'],
    alt: 'Corazón de cuarzo rosa pulido sobre un fondo gris claro',
    desc: 'Corazón de cuarzo rosa pulido, para la mesa de luz, el escritorio o para regalar.',
    datos: [['Piedra', 'Cuarzo rosa'], ['Tamaño', '5 cm']] },
  { id: 'rosario-madera', nombre: 'Rosario de madera con cruz', cat: 'rosarios', piedras: ['madera'], precio: 13500, descuento: 10, stock: 10, alta: 22, rango: 9,
    img: 'images/p-rosario-madera.webp', galeria: ['images/g-madera.webp'],
    alt: 'Rosario de cuentas de madera anudadas con una cruz de madera maciza, sobre un lino',
    desc: 'Cuentas de madera lustrada, anudadas a mano en hilo encerado, con cruz de madera maciza.',
    datos: [['Material', 'Madera lustrada'], ['Armado', 'Anudado a mano']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, ETIQUETAS[p.cat] || '', ...(p.piedras || []).map(x => ETIQUETAS[x] || x), ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), piedra = lista(f.piedra), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (piedra.length && !(p.piedras || []).some(x => piedra.includes(x))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'gitanabijou_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const enCarrito = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const libre = Math.max(0, (producto.stock ?? 99) - enCarrito);
    const suma = Math.min(qty, libre);
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === (v || ''));
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: v || '', qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === (v || '')); if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i !== it && i.id === id).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otros)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
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
function abrirCapa(el, { alCerrar } = {}) {
  const previo = document.activeElement;
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
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 380);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  if (p.tag === 'nuevo') b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.tag === 'unica') b.push('<span class="badge badge--unica">Pieza única</span>');
  else if (p.stock > 0 && p.stock <= 5) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<div class="prod__badges">${b.join('')}</div>` : '';
}
function precioHTML(p) {
  return p.descuento > 0
    ? `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`
    : `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
const etiquetaCard = p => [CATEGORIAS.find(c => c.id === p.cat)?.uno, ...(p.piedras || []).map(x => nombreDe(PIEDRAS, x))].filter(Boolean).join(' · ');

function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const clases = estilo === 'h' ? 'prod prod--ficha prod--h' : estilo === 'vitrina' ? 'prod prod--vitrina' : 'prod prod--ficha';
  const accion = conVar(p)
    ? `<button type="button" class="btn btn--ghost btn--sm prod-add" data-qv="${esc(p.id)}">Elegir ${esc(p.var.tipo.toLowerCase())}</button>`
    : estilo === 'h' ? `<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${esc(p.id)}">Agregar</button>`
    : `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output aria-live="polite">1</output><button type="button" data-paso="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div><button type="button" class="btn btn--cta btn--sm prod-add" data-add="${esc(p.id)}">Agregar</button>`;
  return `<article class="${clases}" data-id="${esc(p.id)}"${anim}>
  <button type="button" class="prod__media" data-qv="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">${badgesHTML(p)}<img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></button>
  <div class="prod__body">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p)}
    <div class="prod-actions">${accion}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'pieza' : 'piezas'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre}${i.v ? ` (${p.var?.tipo?.toLowerCase() || 'opción'} ${i.v})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
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
    cuenta.textContent = n ? `${n} ${n === 1 ? 'pieza' : 'piezas'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => {
      const p = getProducto(i.id);
      if (!p) return '';
      const otros = items.filter(x => x !== i && x.id === i.id).reduce((s, x) => s + x.qty, 0);
      const tope = (p.stock ?? 99) - otros;
      return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="76" height="76">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p>${i.v ? `<p class="linea__var">${esc(p.var?.tipo || 'Opción')}: ${esc(i.v)}</p>` : ''}</div>
    <button type="button" class="linea__quitar" data-quitar="${esc(claveLinea(i.id, i.v))}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${esc(claveLinea(i.id, i.v))}" data-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${esc(claveLinea(i.id, i.v))}" data-paso="1" aria-label="Sumar uno"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p></div>
  </div>
</li>`;
    }).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { const [id, v] = q.dataset.quitar.split('|'); Cart.remove(id, v); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const [id, v] = b.dataset.linea.split('|');
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = () => { pintar(); abrirCapa(drawer); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', window.abrirCarrito));
  pintar();
}

function initCompras() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-id]');
      const p = card ? getProducto(card.dataset.id) : null;
      const out = st.querySelector('output');
      const max = Math.max(1, p?.stock ?? 99);
      const n = Math.max(1, Math.min(max, Number(out.textContent) + Number(paso.dataset.paso)));
      out.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const out = add.closest('.prod-actions')?.querySelector('output');
      const qty = Number(out?.textContent || 1);
      const sumo = Cart.add(p, qty);
      if (sumo) {
        showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre} al carrito`);
        if (out) { out.textContent = 1; const st = out.closest('[data-stepper]'); st.querySelector('[data-paso="-1"]').disabled = true; st.querySelector('[data-paso="1"]').disabled = (p.stock ?? 99) <= 1; }
      } else showToast('Ya tenés en el carrito todas las unidades disponibles');
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const fotos = [p.img, ...(p.galeria || [])];
  qvEstado = { id: p.id, v: '', qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(fotos[0])}" alt="${esc(p.alt)}" width="1200" height="1200" data-qv-foto></div>
    ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, k) => `<button type="button" data-qv-thumb="${esc(f)}" aria-pressed="${k === 0}" aria-label="Ver foto ${k + 1}"><img src="${esc(f)}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv__info">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${conVar(p) ? `<div class="qv__var"><p>${esc(p.var.tipo)}: <span data-qv-elegida>elegí una opción</span></p><div class="chips" role="group" aria-label="${esc(p.var.tipo)}">${p.var.ops.map(o => `<button type="button" class="chip" data-qv-op="${esc(o)}" aria-pressed="false">${esc(o)}</button>`).join('')}</div><p class="qv__error" data-qv-error hidden>Elegí ${esc(p.var.tipo.toLowerCase())} para sumarla al carrito.</p></div>` : ''}
    <dl class="qv__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="qv__acciones">
      <div class="stepper"><button type="button" data-qv-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__stock">${p.stock === 1 ? 'Queda 1 sola' : `Hay ${p.stock} disponibles`} · Armado a mano</p>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
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
    const th = e.target.closest('[data-qv-thumb]');
    if (th) {
      modal.querySelector('[data-qv-foto]').src = th.dataset.qvThumb;
      modal.querySelectorAll('[data-qv-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th)));
      return;
    }
    const op = e.target.closest('[data-qv-op]');
    if (op) {
      qvEstado.v = op.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => { const on = b === op; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-on', on); });
      modal.querySelector('[data-qv-elegida]').textContent = qvEstado.v;
      modal.querySelector('[data-qv-error]').hidden = true;
      return;
    }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const max = Math.max(1, p.stock ?? 99);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(paso.dataset.qvPaso)));
      modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
      modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
      modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= max;
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (conVar(p) && !qvEstado.v) {
        const err = modal.querySelector('[data-qv-error]');
        err.hidden = false;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const sumo = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!sumo) { showToast('Ya tenés en el carrito todas las unidades disponibles'); return; }
      if (comprar) { cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(); }
      else showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre}${qvEstado.v ? ` (${qvEstado.v})` : ''} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
  const header = document.querySelector('.site-header');
  const marcar = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', marcar, { passive: true });
  marcar();
}

function initMenuCategorias() {
  const actual = new URLSearchParams(location.search).get('cat');
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${PAGINA === 'catalogo' && actual === c.id ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="44" height="44"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const hover = window.matchMedia('(hover: hover) and (min-width: 901px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (hover.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && window.matchMedia('(min-width: 901px)').matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.textContent = `${r.n} ${r.n === 1 ? 'pieza' : 'piezas'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-piedra-n]').forEach(el => {
    const n = Tienda.contar({ piedra: el.dataset.piedraN });
    el.textContent = `Ver ${n === 1 ? 'la pieza' : `las ${n} piezas`}`;
  });
  document.querySelectorAll('[data-total-tienda]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = cont.dataset.preview.split(',').map(s => s.trim()).filter(Boolean);
    const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 8) });
    const orden = new Map(ids.map((id, k) => [id, k]));
    const items = res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
    cont.innerHTML = items.map(p => cardHTML(p, cont.dataset.estilo || 'ficha')).join('');
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
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => (arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id));
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    piedra: valida(params.get('piedra'), PIEDRAS),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'piedra' && e.piedra.length) f.piedra = e.piedra;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n, extra = '') =>
    `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${extra}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cats]').innerHTML = CATEGORIAS.map(c => opcion('checkbox', 'cat', c, e.cat.includes(c.id), Tienda.contar({ ...filtros('cat'), cat: c.id }))).join('');
    panel.querySelector('[data-f-piedra]').innerHTML = PIEDRAS.map(pi => opcion('checkbox', 'piedra', pi, e.piedra.includes(pi.id), Tienda.contar({ ...filtros('piedra'), piedra: pi.id }), `<i class="punto" style="--c:${pi.color}"></i>`)).join('');
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...e.piedra.map(id => ({ k: 'piedra', id, t: nombreDe(PIEDRAS, id) })),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = e.cat.length + e.piedra.length + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const unaCat = e.cat.length === 1 ? CATEGORIAS.find(c => c.id === e.cat[0]) : null;
    if (titulo) titulo.textContent = unaCat ? unaCat.nombre : 'Toda la tienda';
    if (miga) { miga.hidden = !unaCat; miga.textContent = unaCat ? unaCat.nombre : ''; }
    document.title = `${unaCat ? unaCat.nombre : 'Tienda'} — ${MARCA} | Pulseras, collares, rosarios y piedras`;
  }
  function sincronizarUrl() {
    setParam('cat', e.cat); setParam('piedra', e.piedra); setParam('precio', e.precio); setParam('q', e.q);
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
      : `${total} <small>${total === 1 ? 'pieza' : 'piezas'}</small>`;
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
  const limpiar = () => { e.cat = []; e.piedra = []; e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (k === 'cat' || k === 'piedra') e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => { if (mq.matches) abrirPanel(); inputQ.focus(); }, 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  const tiles = [...document.querySelectorAll('[data-lb]')];
  if (!lb || !tiles.length) return;
  const img = lb.querySelector('[data-lb-img]');
  const tit = lb.querySelector('[data-lb-titulo]');
  const txt = lb.querySelector('[data-lb-texto]');
  const num = lb.querySelector('[data-lb-num]');
  const ver = lb.querySelector('[data-lb-ver]');
  let i = 0;
  const pintar = () => {
    const t = tiles[i].dataset;
    img.src = t.lbSrc; img.alt = t.lbAlt || '';
    tit.textContent = t.lbTitulo; txt.textContent = t.lbTexto;
    num.textContent = `${i + 1} de ${tiles.length}`;
    ver.dataset.producto = t.lbProducto;
  };
  tiles.forEach((b, k) => b.addEventListener('click', () => {
    if (b.closest('.rail-vp')?.dataset.arrastrado === '1') return;
    i = k; pintar(); abrirCapa(lb); setTimeout(() => lb.querySelector('.qv__close')?.focus(), 60);
  }));
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-lb-cerrar]')) { cerrarCapa(lb); return; }
    if (e.target.closest('[data-lb-prev]')) { i = (i - 1 + tiles.length) % tiles.length; pintar(); return; }
    if (e.target.closest('[data-lb-next]')) { i = (i + 1) % tiles.length; pintar(); return; }
    if (e.target.closest('[data-lb-ver]')) { const id = ver.dataset.producto; cerrarCapa(lb, { devolverFoco: false }); setTimeout(() => abrirVistaRapida(id), 40); }
  });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { i = (i + 1) % tiles.length; pintar(); }
    if (e.key === 'ArrowLeft') { i = (i - 1 + tiles.length) % tiles.length; pintar(); }
  });
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
  const flechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (vp.dataset.arrastrado === '1') { e.preventDefault(); e.stopPropagation(); } }, true);
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  const par = hero.querySelector('[data-parallax]');
  if (par && typeof ScrollTrigger !== 'undefined') {
    gsap.to(par, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

initPreviews();
initResumenes();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initLightbox();
initRail();
initFloats();
initModelBarScroll();
Cart.syncStock();
updateCartBadge();
