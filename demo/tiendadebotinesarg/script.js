const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5493413808470';
const IG = 'https://www.instagram.com/TIENDADEBOTINES_ARG/';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const TALLES = [38, 39, 40, 41, 42, 43, 44, 45];
const TABLA_TALLES = {
  38: { us: '6½', eu: '39', cm: 24.5 },
  39: { us: '7', eu: '40', cm: 25 },
  40: { us: '8', eu: '41', cm: 26 },
  41: { us: '8½', eu: '42', cm: 26.5 },
  42: { us: '9½', eu: '43', cm: 27.5 },
  43: { us: '10', eu: '44', cm: 28 },
  44: { us: '11', eu: '45', cm: 29 },
  45: { us: '12', eu: '46', cm: 30 },
};
const CATEGORIAS = [
  { id: 'fg', codigo: 'FG', nombre: 'Césped natural', corto: 'Tapones para pasto natural', img: 'p-perla' },
  { id: 'tf', codigo: 'TF', nombre: 'Sintético multitaco', corto: 'Multitapones para sintético y fútbol 5', img: 'p-multitaco' },
  { id: 'in', codigo: 'IN', nombre: 'Futsal y piso', corto: 'Suela plana de goma', img: 'p-futsal' },
];
const COLORES = {
  negro: ['Negro', '#151515'],
  blanco: ['Blanco', '#F7F7F7'],
  rojo: ['Rojo', '#B5372E'],
  azul: ['Azul', '#2D4C9E'],
  verde: ['Verde lima', '#93B23C'],
  naranja: ['Naranja', '#D2702F'],
  plata: ['Plata', '#B9BDC2'],
};
const PRECIOS = {
  'hasta-100': ['Hasta $100.000', 0, 100000],
  '100-130': ['$100.000 a $130.000', 100001, 130000],
  'mas-130': ['Más de $130.000', 130001, Infinity],
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio' };
const MAX_ENCARGUE = 3;
const POR_PAGINA = 16;

const PRODUCTOS = [
  { id: 'perla', nombre: 'Modelo Perla', cat: 'fg', colores: ['blanco', 'plata'], precio: 149900, descuento: 0, stock: { 39: 2, 40: 3, 41: 1, 43: 2 }, rango: 1, alta: 20261020, img: 'p-perla', ancho: 900, alt: 'botines blancos con refuerzos plateados sobre el césped de un estadio al atardecer', corto: 'Blanco y plata', desc: 'Capellada blanca texturizada, refuerzo plateado en el talón y tapones para césped natural. El par que se ve desde la tribuna.', ficha: [['Capellada', 'Sintética texturizada'], ['Suela', 'Tapones cónicos y láminas'], ['Caña', 'Baja, con cuello de punto']] },
  { id: 'negro', nombre: 'Modelo Negro', cat: 'fg', colores: ['negro', 'blanco'], precio: 119900, descuento: 0, stock: { 38: 1, 40: 2, 41: 3, 42: 2, 44: 1 }, rango: 2, alta: 20260925, img: 'p-negro', ancho: 900, alt: 'par de botines negros con talón y tapones blancos sobre un bloque de cemento', corto: 'Negro con talón blanco', desc: 'Negro con relieve y el talón y los tapones en blanco. Va con cualquier camiseta y no pasa de moda.', ficha: [['Capellada', 'Sintética con relieve'], ['Suela', 'Tapones cónicos'], ['Caña', 'Baja, con cuello de punto']] },
  { id: 'rojo', nombre: 'Modelo Rojo', cat: 'fg', colores: ['rojo', 'negro'], precio: 119900, descuento: 0, stock: { 39: 1, 40: 2, 41: 2, 42: 1 }, rango: 3, alta: 20261001, img: 'p-rojo', ancho: 1000, alt: 'botines rojos enteros con suela negra de tapones sobre fondo blanco', corto: 'Rojo entero, suela negra', desc: 'Rojo de los cordones a la capellada, con suela negra de tapones. Para que te vean llegar al área.', ficha: [['Capellada', 'Sintética con textura en relieve'], ['Suela', 'Tapones cónicos'], ['Caña', 'Media, con cuello de punto']] },
  { id: 'azul', nombre: 'Modelo Azul', cat: 'fg', colores: ['azul', 'plata'], precio: 129900, descuento: 0, stock: { 40: 1, 41: 2, 42: 3, 43: 1, 44: 2 }, rango: 4, alta: 20260930, img: 'p-azul', ancho: 1000, alt: 'botines azules con vetas plateadas y tapones azules sobre fondo gris', corto: 'Azul con vetas plateadas', desc: 'Azul con vetas plateadas y un cuello de punto que abraza el tobillo. Liviano para correr la banda.', ficha: [['Capellada', 'Sintética con vetas metalizadas'], ['Suela', 'Tapones cónicos y láminas'], ['Caña', 'Media, con cuello de punto']] },
  { id: 'lima', nombre: 'Modelo Lima', cat: 'fg', colores: ['verde', 'negro'], precio: 110000, descuento: 10, stock: { 38: 2, 39: 3, 40: 2, 41: 4, 42: 2, 43: 1 }, rango: 5, alta: 20260915, img: 'p-lima', ancho: 1000, alt: 'botines verde lima con talón negro sobre fondo gris', corto: 'Verde lima, talón negro', desc: 'Verde lima con el talón en negro, el más visible del catálogo. La capellada se limpia fácil después del partido.', ficha: [['Capellada', 'Sintética lisa'], ['Suela', 'Tapones cónicos'], ['Caña', 'Baja']] },
  { id: 'naranja', nombre: 'Modelo Naranja', cat: 'fg', colores: ['naranja', 'blanco'], precio: 109900, descuento: 0, stock: { 41: 1, 42: 2, 43: 2, 45: 1 }, rango: 6, alta: 20261015, img: 'p-naranja', ancho: 1000, alt: 'botines naranjas con rayas blancas y suela blanca sobre fondo gris', corto: 'Naranja con rayas blancas', desc: 'Naranja con rayas blancas en el costado y suela blanca. Tapones repartidos para frenar y arrancar en césped natural.', ficha: [['Capellada', 'Sintética texturizada'], ['Suela', 'Tapones cónicos'], ['Caña', 'Baja']] },
  { id: 'plata', nombre: 'Modelo Plata', cat: 'fg', colores: ['plata'], precio: 139900, descuento: 0, stock: {}, rango: 7, alta: 20261018, img: 'p-plata', ancho: 1000, alt: 'botines plateados metalizados con cordones y tapones lila sobre fondo gris', corto: 'Plateado con detalles lila', desc: 'Plateado metalizado con cordones y tapones lila. Lo traemos por encargue en el talle que nos pidas.', ficha: [['Capellada', 'Sintética metalizada'], ['Suela', 'Tapones cónicos y láminas'], ['Caña', 'Baja']] },
  { id: 'multitaco-marino', nombre: 'Modelo Multitaco Marino', cat: 'tf', colores: ['azul'], precio: 89900, descuento: 0, stock: { 38: 2, 39: 2, 40: 3, 41: 2, 42: 1 }, rango: 8, alta: 20260920, img: 'p-multitaco', ancho: 1000, alt: 'botines multitaco azul marino y celeste con suela de goma de tapones cortos', corto: 'Marino y celeste, multitaco', desc: 'Azul marino y celeste con suela de multitapones de goma, para sintético y canchas de fútbol 5.', ficha: [['Capellada', 'Sintética con relieve'], ['Suela', 'Multitapones de goma'], ['Caña', 'Baja']] },
  { id: 'futsal-negro', nombre: 'Modelo Futsal Negro', cat: 'in', colores: ['negro'], precio: 84900, descuento: 0, stock: { 39: 1, 40: 2, 41: 2, 42: 2, 43: 1, 44: 1 }, rango: 9, alta: 20260910, img: 'p-futsal', ancho: 1000, alt: 'zapatillas de futsal negras con suela de goma color miel sobre fondo blanco', corto: 'Negro con suela de goma miel', desc: 'Negro entero con suela de goma color miel que no marca el piso. Para futsal, salón y canchas de baldosa.', ficha: [['Capellada', 'Sintética lisa con costuras'], ['Suela', 'Goma plana antideslizante'], ['Caña', 'Baja']] },
  { id: 'celeste', nombre: 'Modelo Celeste', cat: 'fg', colores: ['azul'], precio: 109900, descuento: 0, stock: {}, rango: 99, alta: 20250101, visible: false, img: 'p-azul', ancho: 1000, alt: '', corto: '', desc: '', ficha: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261012;
const stockDe = (p, t) => Number(p?.stock?.[t]) || 0;
const tallesEnStock = p => TALLES.filter(t => stockDe(p, t) > 0);
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const foto = (p, chica) => `images/${p.img}${chica ? '-480' : ''}.webp`;
const lista = v => (Array.isArray(v) ? v : v || v === 0 ? [v] : []);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle).map(Number), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !talle.some(t => stockDe(p, t) > 0)) return false;
    if (color.length && !color.some(c => p.colores.includes(c))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [, min, max] = PRECIOS[f.precio];
      const v = precioFinal(p);
      if (v < min || v > max) return false;
    }
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, prioriza) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const base = (() => {
      switch (orden) {
        case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
        case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
        case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
        default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
      }
    })();
    const t = Number(prioriza);
    if (!TALLES.includes(t)) return base;
    return (a, b) => (stockDe(b, t) > 0) - (stockDe(a, t) > 0) || base(a, b);
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.prioriza));
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
    const cat = catDe(p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, p.corto, p.desc, cat?.nombre, cat?.codigo, cat?.corto, ...p.ficha.map(f => f[1]),
      ...p.colores.map(c => COLORES[c]?.[0]), ...tallesEnStock(p).map(t => `talle ${t}`),
      tallesEnStock(p).length ? 'stock' : 'encargue', p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '',
      p.cat === 'tf' ? 'sintetico futbol 5 multitapones' : '', p.cat === 'in' ? 'salon baldosa piso futsal' : '', p.cat === 'fg' ? 'pasto cesped natural tapones' : '',
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

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const leer = k => { try { return localStorage.getItem(k); } catch { return null; } };
const guardar = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch { return false; } };

const Cart = {
  KEY: 'tiendadebotinesarg_cart',
  get() {
    try {
      const v = JSON.parse(leer(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getProducto(i.id) && TALLES.includes(Number(i.talle)) && i.qty > 0).map(i => ({ id: i.id, talle: Number(i.talle), qty: Number(i.qty) })) : [];
    } catch { return []; }
  },
  save(items) { guardar(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  maxDe(p, talle) { const s = stockDe(p, talle); return s > 0 ? s : MAX_ENCARGUE; },
  add(producto, talle, qty = 1) {
    const t = Number(talle);
    if (!producto || !TALLES.includes(t)) return;
    const items = this.get();
    const max = this.maxDe(producto, t);
    const existing = items.find(i => i.id === producto.id && i.talle === t);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, talle: t, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === Number(talle)); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, this.maxDe(p, it.talle))); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === Number(talle)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const MiTalle = {
  KEY: 'tiendadebotinesarg_talle',
  get() { const t = Number(leer(this.KEY)); return TALLES.includes(t) ? t : null; },
  set(t) {
    const n = Number(t);
    guardar(this.KEY, TALLES.includes(n) ? String(n) : null);
    document.dispatchEvent(new CustomEvent('talle:cambio'));
  },
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

const esModelo2 = () => document.body.dataset.modelo === '2';
const paginaCatalogo = () => (esModelo2() ? 'catalogo-2.html' : 'catalogo.html');
const paginaHome = () => (esModelo2() ? 'modelo-2.html' : './');
const enHome = () => document.body.dataset.pagina === 'home';
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const ICONO_FLECHA = '<svg class="flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONO_CERRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

let filtroTalleCatalogo = null;
const talleParaCards = () => MiTalle.get() ?? filtroTalleCatalogo;

function precioHTML(p) {
  return p.descuento > 0
    ? `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></p>`
    : `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
function tiraTexto(p) {
  const en = tallesEnStock(p);
  return en.length ? `En stock: talles ${en.join(', ')}. El resto, por encargue.` : 'Todos los talles por encargue.';
}
function tiraHTML(p, t) {
  return `<ol class="tira" aria-label="${esc(tiraTexto(p))}">${TALLES.map(x => `<li class="${stockDe(p, x) > 0 ? 's' : 'e'}${x === t ? ' mio' : ''}">${x}</li>`).join('')}</ol>`;
}
function botonCard(p, t) {
  if (!t) return { txt: 'Elegir talle', accion: 'elegir' };
  return stockDe(p, t) > 0 ? { txt: `Agregar · ${t}`, accion: 'agregar' } : { txt: `Encargar · ${t}`, accion: 'agregar' };
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--oferta">-${p.descuento}%</span>`;
  if (!tallesEnStock(p).length) return '<span class="badge badge--encargue">Por encargue</span>';
  if (esNuevo(p)) return '<span class="badge">Nuevo</span>';
  return '';
}
function cardHTML(p, { talle = null, animar = true, clase = '' } = {}) {
  const cat = catDe(p.cat);
  const b = botonCard(p, talle);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const grande = clase.includes('pcard--grande');
  const sizes = grande ? '(max-width: 700px) 92vw, 620px' : '(max-width: 700px) 46vw, (max-width: 1100px) 31vw, 300px';
  return `<article class="pcard ${clase}" data-id="${esc(p.id)}"${anim}>
    <button type="button" class="pcard__media" data-abrir="${esc(p.id)}">
      <img src="${grande ? foto(p) : foto(p, true)}" srcset="${foto(p, true)} 480w, ${foto(p)} ${p.ancho}w" sizes="${sizes}" width="480" height="480" alt="${esc(p.nombre)}: ${esc(p.alt)}">
      <span class="pcard__sup">${cat.codigo}</span>${badgeHTML(p)}
    </button>
    <div class="pcard__info">
      <h3 class="pcard__nombre"><button type="button" data-abrir="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="pcard__linea">${esc(cat.nombre)} · ${esc(p.corto)}</p>
      ${precioHTML(p)}
      ${tiraHTML(p, talle)}
      <div class="pcard__acciones"><button type="button" class="btn btn--cta prod-add" data-accion="${b.accion}" data-id="${esc(p.id)}">${b.txt}</button></div>
    </div>
  </article>`;
}
function actualizarCards() {
  const t = talleParaCards();
  document.querySelectorAll('.pcard[data-id]').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p) return;
    card.querySelectorAll('.tira li').forEach(li => li.classList.toggle('mio', Number(li.textContent) === t));
    const btn = card.querySelector('[data-accion]');
    if (!btn) return;
    const b = botonCard(p, t);
    btn.textContent = b.txt;
    btn.dataset.accion = b.accion;
  });
}
function avisoAgregado(p, t) {
  if (stockDe(p, t) > 0) showToast(`${p.nombre} talle ${t} al carrito.`);
  else showToast(`${p.nombre} talle ${t} por encargue: te confirmamos la llegada.`);
}
function etiquetaHTML(p) {
  const cat = catDe(p.cat);
  return `<span class="etiqueta__marca"><span>TIENDADEBOTINES_ARG</span><span>${esNuevo(p) ? 'Nuevo' : 'Ref. ' + String(p.rango).padStart(2, '0')}</span></span>
    <span class="etiqueta__fila"><span class="etiqueta__modelo">${esc(p.nombre)}</span><span class="etiqueta__sup">${cat.codigo}</span></span>
    <span class="etiqueta__talles"><span class="etiqueta__ar">AR</span>${TALLES.map(t => `<span class="${stockDe(p, t) > 0 ? 's' : 'e'}">${t}</span>`).join('')}</span>
    <span class="etiqueta__fila etiqueta__fila--pie"><span class="codigo-barras"></span><span class="etiqueta__precio">${formatearPrecio(precioFinal(p))}</span></span>`;
}

function initEtiquetas() {
  document.querySelectorAll('[data-etiqueta]').forEach(el => {
    const p = getProducto(el.dataset.etiqueta);
    if (p) el.innerHTML = etiquetaHTML(p);
  });
}

function initMenuCats() {
  const items = CATEGORIAS.map(c => ({ c, n: Tienda.contar({ cat: c.id }) }));
  const actual = document.body.dataset.pagina === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  document.querySelectorAll('[data-menu-cats]').forEach(ul => {
    ul.innerHTML = items.map(({ c, n }) => `<li><a href="${paginaCatalogo()}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="images/${c.img}-480.webp" width="52" height="52" alt=""><span><span class="menu-cat__nombre">${esc(c.nombre)}</span><span class="menu-cat__meta">${c.codigo} · ${n} ${n === 1 ? 'modelo' : 'modelos'}</span></span></a></li>`).join('');
  });
  document.querySelectorAll('[data-footer-cats]').forEach(ul => {
    ul.innerHTML = items.map(({ c }) => `<li><a href="${paginaCatalogo()}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
  });
}

function initMenuCat() {
  const wrap = document.querySelector('.menu-cat');
  if (!wrap) return;
  const btn = wrap.querySelector('.menu-cat__btn');
  const mqDesk = window.matchMedia('(min-width: 961px)');
  let timer = 0;
  let abiertoEn = 0;
  const abrir = () => { clearTimeout(timer); if (!wrap.classList.contains('open')) abiertoEn = Date.now(); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    if (wrap.classList.contains('open')) { if (mqDesk.matches && Date.now() - abiertoEn < 400) return; cerrar(); } else abrir();
  });
  wrap.addEventListener('pointerenter', e => { if (mqDesk.matches && e.pointerType === 'mouse') abrir(); });
  wrap.addEventListener('pointerleave', e => { if (mqDesk.matches && e.pointerType === 'mouse') timer = setTimeout(cerrar, 120); });
  document.addEventListener('click', e => { if (mqDesk.matches && !wrap.contains(e.target)) cerrar(); });
  wrap.addEventListener('focusout', e => { if (mqDesk.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
}

function initLupa() {
  document.querySelectorAll('[data-lupa]').forEach(a => {
    a.setAttribute('href', `${paginaCatalogo()}?buscar=1`);
    a.addEventListener('click', e => {
      const input = document.getElementById('qCat');
      if (!input) return;
      e.preventDefault();
      input.focus();
      input.scrollIntoView({ block: 'center' });
    });
  });
}

function initSelTalle() {
  const sels = document.querySelectorAll('[data-sel-talle]');
  sels.forEach(sel => {
    sel.insertAdjacentHTML('beforeend', TALLES.map(t => `<option value="${t}">Talle ${t}</option>`).join(''));
    sel.value = MiTalle.get() ?? '';
    sel.addEventListener('change', () => MiTalle.set(sel.value));
  });
  document.addEventListener('talle:cambio', () => sels.forEach(s => { s.value = MiTalle.get() ?? ''; }));
}

function initPreview() {
  const grid = document.querySelector('[data-preview]');
  if (!grid) return;
  const vidriera = grid.dataset.modo === 'vidriera';
  const selSup = document.querySelector('[data-sel-sup]');
  const linkTodos = document.querySelectorAll('[data-link-catalogo]');
  const limite = Math.min(Number(grid.dataset.limite) || 8, Tienda.TOPE);
  if (selSup) selSup.insertAdjacentHTML('beforeend', CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nombre)} · ${c.codigo}</option>`).join(''));
  const render = () => {
    const cat = selSup?.value || '';
    const t = MiTalle.get();
    const { items } = Tienda.consultar({ filtros: { cat, prioriza: t }, limite });
    items.forEach(cachear);
    const n = Tienda.contar({ cat });
    const href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
    const txt = n === 1 ? 'Ver el modelo' : `Ver los ${n} modelos`;
    let html = items.map((p, i) => cardHTML(p, { talle: t, clase: vidriera && i === 0 ? 'pcard--grande' : '' })).join('');
    if (vidriera) html += `<div class="vidriera__todos-wrap" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><a class="vidriera__todos" href="${href}"><span class="vidriera__todos-n">${n}</span><span class="vidriera__todos-txt">${txt} con todos los talles ${ICONO_FLECHA}</span></a></div>`;
    grid.innerHTML = html;
    linkTodos.forEach(a => { a.href = href; const s = a.querySelector('[data-total-txt]'); if (s) s.textContent = txt; });
    revelarNuevos(grid);
    refrescarST();
  };
  selSup?.addEventListener('change', render);
  document.addEventListener('talle:cambio', render);
  render();
}

function initSuperficies() {
  const ul = document.querySelector('[data-superficies]');
  if (!ul) return;
  const tiles = [
    ...CATEGORIAS.map(c => ({ href: `${paginaCatalogo()}?cat=${c.id}`, img: c.img, codigo: c.codigo, nombre: c.nombre, n: Tienda.contar({ cat: c.id }) })),
    { href: paginaCatalogo(), img: 'p-rojo', codigo: '38 al 45', nombre: 'Todos los modelos', n: Tienda.contar() },
  ];
  ul.innerHTML = tiles.map(t => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><a class="sup-tile" href="${t.href}"><span class="sup-tile__img"><img src="images/${t.img}-480.webp" width="76" height="76" alt=""></span><span class="sup-tile__codigo">${esc(t.codigo)}</span><span class="sup-tile__nombre">${esc(t.nombre)}</span><span class="sup-tile__n">${t.n} ${t.n === 1 ? 'modelo' : 'modelos'}</span></a></li>`).join('');
}

function initCatalogo() {
  if (document.body.dataset.pagina !== 'catalogo') return;
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const listaParam = (k, validos) => (params.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  const estado = {
    cat: listaParam('cat', CATEGORIAS.map(c => c.id)),
    talle: listaParam('talle', TALLES.map(String)).map(Number),
    color: listaParam('color', Object.keys(COLORES)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  const contador = document.querySelector('[data-contador]');
  const vacio = document.querySelector('[data-vacio]');
  const verMas = document.querySelector('[data-ver-mas]');
  const limpiar = document.querySelectorAll('[data-limpiar]');
  const inputQ = document.getElementById('qCat');
  const selOrden = document.querySelector('[data-orden]');
  const grupos = document.querySelector('[data-filtros-grupos]');
  const chips = document.querySelector('[data-chips-sup]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const miga = document.querySelector('[data-miga-cat]');
  const nFiltros = document.querySelector('[data-filtros-n]');
  const verResultados = document.querySelector('[data-ver-resultados]');
  const tituloBase = titulo?.textContent || '';
  let cursor = null;
  let mostrados = 0;

  if (grupos) {
    const conSup = !grupos.hasAttribute('data-sin-sup');
    grupos.innerHTML = `${conSup ? `<fieldset class="f-grupo"><legend>Superficie</legend>${CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)} <small>${c.codigo}</small></span><span class="f-n">${Tienda.contar({ cat: c.id })}</span></label>`).join('')}</fieldset>` : ''}
      <fieldset class="f-grupo"><legend>Talle en stock</legend><div class="f-talles">${TALLES.map(t => `<label class="f-talle"><input type="checkbox" data-f="talle" value="${t}" aria-label="Talle ${t} en stock"><span>${t}</span></label>`).join('')}</div></fieldset>
      <fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">${Object.entries(COLORES).map(([k, [nombre, hex]]) => `<label class="f-color"><input type="checkbox" data-f="color" value="${k}"><span class="f-color__punto" style="--c:${hex}"></span><span>${esc(nombre)}</span></label>`).join('')}</div></fieldset>
      <fieldset class="f-grupo"><legend>Precio</legend><div class="f-precios"><label class="f-precio"><input type="radio" name="precio" value=""><span>Todos los precios</span></label>${Object.entries(PRECIOS).map(([k, [nombre]]) => `<label class="f-precio"><input type="radio" name="precio" value="${k}"><span>${esc(nombre)}</span></label>`).join('')}</div></fieldset>`;
  }
  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="">Todos <small>${Tienda.contar()}</small></button>${CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}">${esc(c.nombre)} <small>${c.codigo}</small></button>`).join('')}`;
  }
  if (selOrden) selOrden.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = () => ({ cat: estado.cat, talle: estado.talle, color: estado.color, precio: estado.precio });
  const activos = () => estado.cat.length + estado.talle.length + estado.color.length + (estado.precio ? 1 : 0) + (estado.q ? 1 : 0);

  function sincronizarURL() {
    const u = new URLSearchParams();
    if (estado.cat.length) u.set('cat', estado.cat.join(','));
    if (estado.talle.length) u.set('talle', estado.talle.join(','));
    if (estado.color.length) u.set('color', estado.color.join(','));
    if (estado.precio) u.set('precio', estado.precio);
    if (estado.q) u.set('q', estado.q);
    if (estado.orden !== 'destacados') u.set('orden', estado.orden);
    const s = u.toString();
    history.replaceState(null, '', s ? `?${s}` : location.pathname);
  }
  function pintarControles() {
    document.querySelectorAll('[data-f]').forEach(inp => {
      const k = inp.dataset.f;
      inp.checked = k === 'talle' ? estado.talle.includes(Number(inp.value)) : estado[k].includes(inp.value);
    });
    document.querySelectorAll('input[name="precio"]').forEach(r => { r.checked = r.value === estado.precio; });
    chips?.querySelectorAll('[data-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.chip === '' ? !estado.cat.length : estado.cat.length === 1 && estado.cat[0] === ch.dataset.chip)));
    if (selOrden) selOrden.value = estado.orden;
    if (inputQ && document.activeElement !== inputQ) inputQ.value = estado.q;
    const n = activos();
    limpiar.forEach(b => { b.hidden = n === 0; });
    if (nFiltros) { const f = n - (estado.q ? 1 : 0); nFiltros.textContent = f; nFiltros.hidden = f === 0; }
    const cat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    if (titulo) titulo.textContent = cat ? `Botines para ${cat.nombre.toLowerCase()}` : tituloBase;
    if (miga) { miga.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; }
    document.title = `${cat ? `Botines para ${cat.nombre.toLowerCase()}` : 'Catálogo de botines'} — TIENDADEBOTINES_ARG`;
    filtroTalleCatalogo = estado.talle.length === 1 ? estado.talle[0] : null;
  }
  function render(agregar = false) {
    pintarControles();
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    const html = res.items.map(p => cardHTML(p, { talle: talleParaCards() })).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    cursor = res.cursor;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    const txt = total == null
      ? `${mostrados} ${mostrados === 1 ? 'modelo' : 'modelos'} para «${estado.q}»${cursor ? ', y hay más' : ''}`
      : `${total} ${total === 1 ? 'modelo' : 'modelos'}`;
    if (contador) contador.textContent = txt;
    if (verResultados) verResultados.textContent = mostrados ? `Ver ${total == null ? 'resultados' : txt}` : 'Ver resultados';
    sincronizarURL();
    revelarNuevos(grid);
    refrescarST();
  }

  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-f], input[name="precio"]');
    if (!inp) return;
    if (inp.name === 'precio') estado.precio = inp.value;
    else {
      const k = inp.dataset.f;
      const v = k === 'talle' ? Number(inp.value) : inp.value;
      estado[k] = inp.checked ? [...new Set([...estado[k], v])] : estado[k].filter(x => x !== v);
    }
    render();
  });
  chips?.addEventListener('click', e => {
    const ch = e.target.closest('[data-chip]');
    if (!ch) return;
    estado.cat = ch.dataset.chip ? [ch.dataset.chip] : [];
    render();
  });
  selOrden?.addEventListener('change', () => { estado.orden = ORDENES[selOrden.value] ? selOrden.value : 'destacados'; render(); });
  let tq = 0;
  inputQ?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = inputQ.value.trim().slice(0, 60); render(); }, 260); });
  document.querySelector('[data-cat-buscar]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = (inputQ?.value || '').trim().slice(0, 60); render(); });
  limpiar.forEach(b => b.addEventListener('click', () => { Object.assign(estado, { cat: [], talle: [], color: [], precio: '', q: '' }); render(); }));
  verMas?.addEventListener('click', () => render(true));

  render();
  if (params.has('buscar') && inputQ) { inputQ.focus(); }
  const slug = params.get('producto');
  if (slug && getProducto(slug)) setTimeout(() => abrirModal(slug), 60);
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  if (!panel) return;
  const abrirBtns = document.querySelectorAll('[data-abrir-filtros]');
  const capa = document.querySelector('.filtros-capa');
  const mq = window.matchMedia('(max-width: 1024px)');
  const esDrawer = () => esModelo2() || mq.matches;
  let soltar = null;
  let ultimo = null;
  const sync = () => {
    if (esDrawer()) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); }
    else { panel.removeAttribute('inert'); panel.removeAttribute('role'); panel.removeAttribute('aria-modal'); cerrar(true); }
  };
  const abrir = () => {
    panel.closest('.filtros-col')?.classList.add('in');
    ultimo = document.activeElement;
    panel.classList.add('open'); panel.removeAttribute('inert'); capa?.classList.add('open');
    document.body.classList.add('no-scroll');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    soltar = atrapar(panel);
    panel.querySelector('[data-cerrar-filtros]')?.focus();
  };
  function cerrar(silencioso) {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); capa?.classList.remove('open');
    if (esDrawer()) panel.setAttribute('inert', '');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    soltar?.(); soltar = null;
    sincronizarScroll();
    if (!silencioso) ultimo?.focus?.();
  }
  abrirBtns.forEach(b => b.addEventListener('click', abrir));
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
  capa?.addEventListener('click', () => cerrar());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });
  mq.addEventListener('change', sync);
  sync();
}

function atrapar(cont) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
  const onKey = e => {
    if (e.key !== 'Tab') return;
    const f = [...cont.querySelectorAll(sel)].filter(el => el.getClientRects().length && !el.closest('[inert]'));
    if (!f.length) return;
    const a = f[0];
    const z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  };
  cont.addEventListener('keydown', onKey);
  return () => cont.removeEventListener('keydown', onKey);
}

function sincronizarScroll() {
  const modal = document.getElementById('vistaRapida');
  const abierto = (modal && !modal.hidden) || document.getElementById('carrito')?.classList.contains('open') || document.getElementById('filtros')?.classList.contains('open') || document.getElementById('mainNav')?.classList.contains('open');
  document.body.classList.toggle('no-scroll', Boolean(abierto));
}

const Modal = { p: null, talle: null, cant: 1, ultimoFoco: null, soltar: null };

function relacionadosDe(p) {
  const mismos = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  const faltan = 3 - mismos.length;
  const otros = faltan > 0 ? Tienda.consultar({ filtros: { excluir: [p.id, ...mismos.map(x => x.id)] }, limite: faltan }).items : [];
  return [...mismos, ...otros].map(cachear);
}
function modalHTML(p) {
  const cat = catDe(p.cat);
  const guia = enHome() ? '#talles' : `${paginaHome()}#talles`;
  return `<div class="vr">
    <div class="vr__media"><img src="${foto(p)}" width="${p.ancho}" height="${p.ancho}" alt="${esc(p.nombre)}: ${esc(p.alt)}"><span class="pcard__sup">${cat.codigo}</span>${badgeHTML(p)}</div>
    <div class="vr__info">
      <p class="vr__sup">${esc(cat.nombre)} · ${esc(p.corto)}</p>
      <p class="vr__nombre">${esc(p.nombre)}</p>
      ${precioHTML(p)}
      <p class="vr__desc">${esc(p.desc)}</p>
      <fieldset class="talles-sel" data-talles-sel>
        <legend><span>Talle <small>(AR)</small></span><a class="talles-sel__guia" href="${guia}" data-guia-link>¿Cuál es mi talle?</a></legend>
        <div class="talles-sel__grid">${TALLES.map(t => { const s = stockDe(p, t); return `<label class="talle-op ${s > 0 ? 'is-stock' : 'is-encargue'}"><input type="radio" name="talleModal" value="${t}" aria-label="Talle ${t}, ${s > 0 ? 'en stock' : 'por encargue'}"><span class="talle-op__caja"><span class="talle-op__n">${t}</span><span class="talle-op__e">${s > 0 ? (s <= 2 ? `Quedan ${s}` : 'Stock') : 'Encargue'}</span></span></label>`; }).join('')}</div>
      </fieldset>
      <p class="talles-sel__estado" data-talle-estado aria-live="polite"></p>
      <div class="vr__compra">
        <div class="stepper"><button type="button" data-menos aria-label="Restar un par">−</button><output data-cant aria-live="polite">1</output><button type="button" data-mas aria-label="Sumar un par">+</button></div>
        <button type="button" class="btn btn--cta prod-add" data-modal-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn--linea" data-modal-comprar>Comprar ahora</button>
      </div>
      <dl class="ficha"><div><dt>Superficie</dt><dd>${esc(cat.nombre)} (${cat.codigo})</dd></div>${p.ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Talles</dt><dd>${esc(tiraTexto(p))}</dd></div></dl>
      <div class="relacionados"><p class="relacionados__titulo">También te puede interesar</p><ul>${relacionadosDe(p).map(r => `<li><button type="button" data-abrir="${esc(r.id)}"><img src="${foto(r, true)}" width="480" height="480" alt=""><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioFinal(r))}</strong></button></li>`).join('')}</ul></div>
    </div>
  </div>`;
}
function pintarModal() {
  const el = document.getElementById('vistaRapida');
  const p = Modal.p;
  if (!el || !p) return;
  const t = Modal.talle;
  el.querySelectorAll('input[name="talleModal"]').forEach(r => { r.checked = Number(r.value) === t; });
  const estadoEl = el.querySelector('[data-talle-estado]');
  const agregar = el.querySelector('[data-modal-agregar]');
  const comprar = el.querySelector('[data-modal-comprar]');
  const cantEl = el.querySelector('[data-cant]');
  const s = t ? stockDe(p, t) : 0;
  const max = t ? Cart.maxDe(p, t) : MAX_ENCARGUE;
  Modal.cant = Math.max(1, Math.min(Modal.cant, max));
  if (cantEl) cantEl.textContent = Modal.cant;
  el.querySelector('[data-menos]')?.toggleAttribute('disabled', Modal.cant <= 1);
  el.querySelector('[data-mas]')?.toggleAttribute('disabled', Modal.cant >= max);
  if (estadoEl) {
    if (!t) estadoEl.innerHTML = 'Elegí tu talle. Los de fondo blanco están en stock; los rayados, por encargue.';
    else if (s > 0) estadoEl.innerHTML = `<strong>Talle ${t} en stock</strong> · ${s === 1 ? 'queda 1 par' : `quedan ${s} pares`}.`;
    else estadoEl.innerHTML = `<strong>Talle ${t} por encargue</strong> · te confirmamos precio y llegada por WhatsApp.`;
  }
  if (agregar) agregar.textContent = t && s === 0 ? `Encargar talle ${t}` : 'Agregar al carrito';
  if (comprar) comprar.textContent = 'Comprar ahora';
}
function inyectarSchema(p) {
  let s = document.getElementById('ldProducto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(foto(p), location.href).href,
    brand: { '@type': 'Brand', name: 'TIENDADEBOTINES_ARG' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: tallesEnStock(p).length ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' },
  });
}
function abrirModal(id, { origen = null, enfocar = false, talle = null } = {}) {
  const el = document.getElementById('vistaRapida');
  const cont = el?.querySelector('[data-modal-contenido]');
  const p = getProducto(id);
  if (!el || !cont || !p) return;
  if (el.hidden) Modal.ultimoFoco = origen || document.activeElement;
  Modal.p = p;
  Modal.cant = 1;
  Modal.talle = talle ?? talleParaCards();
  cont.innerHTML = modalHTML(p);
  el.hidden = false;
  document.body.classList.add('no-scroll');
  Modal.soltar?.();
  Modal.soltar = atrapar(el);
  pintarModal();
  inyectarSchema(p);
  const dialog = el.querySelector('.modal__dialog');
  if (dialog) dialog.scrollTop = 0;
  const foco = enfocar ? (el.querySelector('input[name="talleModal"]:checked') || el.querySelector('input[name="talleModal"]')) : el.querySelector('[data-cerrar-modal]');
  foco?.focus({ preventScroll: true });
}
function cerrarModal() {
  const el = document.getElementById('vistaRapida');
  if (!el || el.hidden) return;
  el.hidden = true;
  Modal.soltar?.(); Modal.soltar = null;
  sincronizarScroll();
  if (Modal.ultimoFoco && document.contains(Modal.ultimoFoco)) Modal.ultimoFoco.focus({ preventScroll: true });
}
function initModal() {
  const el = document.getElementById('vistaRapida');
  if (!el) return;
  el.addEventListener('click', e => {
    if (e.target === el || e.target.closest('[data-cerrar-modal]')) { cerrarModal(); return; }
    if (e.target.closest('[data-guia-link]')) { cerrarModal(); return; }
    if (e.target.closest('[data-menos]')) { Modal.cant--; pintarModal(); return; }
    if (e.target.closest('[data-mas]')) { Modal.cant++; pintarModal(); return; }
    const agregar = e.target.closest('[data-modal-agregar]');
    const comprar = e.target.closest('[data-modal-comprar]');
    if (agregar || comprar) {
      if (!Modal.talle) {
        const fs = el.querySelector('[data-talles-sel]');
        fs?.classList.add('falta');
        const est = el.querySelector('[data-talle-estado]');
        if (est) est.innerHTML = '<strong>Elegí un talle para seguir.</strong> Si no sabés cuál, mirá la guía.';
        el.querySelector('input[name="talleModal"]')?.focus();
        return;
      }
      Cart.add(Modal.p, Modal.talle, Modal.cant);
      if (comprar) { cerrarModal(); abrirCarrito(); }
      else avisoAgregado(Modal.p, Modal.talle);
    }
  });
  el.addEventListener('change', e => {
    const r = e.target.closest('input[name="talleModal"]');
    if (!r) return;
    Modal.talle = Number(r.value);
    el.querySelector('[data-talles-sel]')?.classList.remove('falta');
    pintarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !el.hidden) cerrarModal(); });
}

const Drawer = { ultimoFoco: null, soltar: null };
function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const cat = catDe(p.cat);
  const stock = stockDe(p, i.talle) > 0;
  const max = Cart.maxDe(p, i.talle);
  return `<li class="linea" data-linea="${esc(p.id)}" data-talle="${i.talle}">
    <span class="linea__img"><img src="${foto(p, true)}" width="76" height="76" alt=""></span>
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta"><span class="etq-mini">AR ${i.talle} · ${cat.codigo}</span><span class="estado ${stock ? '' : 'estado--encargue'}">${stock ? 'En stock' : 'Por encargue'}</span></p>
      <div class="linea__fila">
        <div class="stepper stepper--chico"><button type="button" data-linea-menos aria-label="Restar un par"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea-mas aria-label="Sumar un par"${i.qty >= max ? ' disabled' : ''}>+</button></div>
        <span class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
      </div>
    </div>
    <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)} talle ${i.talle}">${ICONO_CERRAR}</button>
  </li>`;
}
function renderCarrito() {
  const cont = document.querySelector('[data-cart-lista]');
  const pie = document.querySelector('[data-cart-pie]');
  if (!cont) return;
  const items = Cart.get();
  document.querySelectorAll('[data-cart-count-text]').forEach(s => { const n = Cart.count(); s.textContent = n ? `(${n})` : ''; });
  if (!items.length) {
    cont.innerHTML = `<div class="carrito-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío</p><p>Todavía no elegiste botines. Arrancá por tu talle.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Ver modelos ${ICONO_FLECHA}</a></div>`;
    if (pie) pie.hidden = true;
    return;
  }
  cont.innerHTML = `<ul>${items.map(lineaHTML).join('')}</ul>`;
  if (pie) pie.hidden = false;
  const total = document.querySelector('[data-cart-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const hayEncargue = items.some(i => stockDe(getProducto(i.id), i.talle) === 0);
  const nota = document.querySelector('[data-cart-nota]');
  if (nota) nota.hidden = !hayEncargue;
}
function abrirCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  Drawer.ultimoFoco = document.activeElement;
  renderCarrito();
  d.classList.add('open'); d.removeAttribute('inert');
  document.querySelector('.capa')?.classList.add('open');
  document.body.classList.add('no-scroll');
  Drawer.soltar?.(); Drawer.soltar = atrapar(d);
  d.querySelector('[data-cerrar-carrito]')?.focus();
}
function cerrarCarrito() {
  const d = document.getElementById('carrito');
  if (!d || !d.classList.contains('open')) return;
  d.classList.remove('open'); d.setAttribute('inert', '');
  document.querySelector('.capa')?.classList.remove('open');
  Drawer.soltar?.(); Drawer.soltar = null;
  sincronizarScroll();
  if (Drawer.ultimoFoco && document.contains(Drawer.ultimoFoco)) Drawer.ultimoFoco.focus({ preventScroll: true });
}
function initCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirCarrito));
  d.querySelector('[data-cerrar-carrito]')?.addEventListener('click', cerrarCarrito);
  document.querySelector('.capa')?.addEventListener('click', cerrarCarrito);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) cerrarCarrito(); });
  d.addEventListener('click', e => {
    const li = e.target.closest('[data-linea]');
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (!li) return;
    const id = li.dataset.linea;
    const t = Number(li.dataset.talle);
    const it = Cart.get().find(i => i.id === id && i.talle === t);
    if (!it) return;
    if (e.target.closest('[data-linea-menos]')) Cart.setQty(id, t, it.qty - 1);
    else if (e.target.closest('[data-linea-mas]')) Cart.setQty(id, t, it.qty + 1);
    else if (e.target.closest('[data-linea-quitar]')) Cart.remove(id, t);
  });
  document.addEventListener('cart:updated', () => { if (d.classList.contains('open')) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

function initAcciones() {
  document.addEventListener('click', e => {
    const abrir = e.target.closest('[data-abrir]');
    if (abrir && !abrir.closest('#vistaRapida .vr__media')) { e.preventDefault(); abrirModal(abrir.dataset.abrir, { origen: abrir }); return; }
    const acc = e.target.closest('[data-accion]');
    if (!acc) return;
    const p = getProducto(acc.dataset.id);
    if (!p) return;
    const t = talleParaCards();
    if (acc.dataset.accion === 'agregar' && t) { Cart.add(p, t, 1); avisoAgregado(p, t); }
    else abrirModal(p.id, { origen: acc, enfocar: true });
  });
  document.addEventListener('talle:cambio', actualizarCards);
}

function initEncargue() {
  const form = document.querySelector('[data-encargue]');
  if (!form) return;
  const selModelo = form.querySelector('#encModelo');
  const selTalle = form.querySelector('#encTalle');
  const selSup = form.querySelector('#encSup');
  const detalle = form.querySelector('#encDetalle');
  const nombre = form.querySelector('#encNombre');
  const vista = form.querySelector('[data-encargue-vista]');
  const enviar = form.querySelector('[data-encargue-enviar]');
  const { items } = Tienda.consultar({ limite: Tienda.TOPE });
  items.forEach(cachear);
  selModelo.insertAdjacentHTML('beforeend', items.map(p => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join(''));
  selTalle.insertAdjacentHTML('beforeend', `${TALLES.map(t => `<option value="${t}">${t}</option>`).join('')}<option value="otro">Otro talle</option>`);
  selSup.insertAdjacentHTML('beforeend', CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nombre)} (${c.codigo})</option>`).join(''));
  const params = new URLSearchParams(location.search);
  const pre = params.get('encargue');
  if (pre && getProducto(pre)) { selModelo.value = pre; selSup.value = getProducto(pre).cat; }
  const preT = params.get('talle');
  if (preT && TALLES.includes(Number(preT))) selTalle.value = preT;
  else if (MiTalle.get()) selTalle.value = String(MiTalle.get());
  const mensaje = () => {
    const p = getProducto(selModelo.value);
    const sup = catDe(selSup.value);
    const t = selTalle.value;
    const lineas = [
      '¡Hola! Quiero encargar unos botines.',
      `Modelo: ${p ? p.nombre : 'otro (te cuento abajo)'}`,
      `Talle: ${t ? (t === 'otro' ? 'otro (te cuento abajo)' : t) : 'a confirmar'}`,
      `Superficie: ${sup ? `${sup.nombre} (${sup.codigo})` : 'a confirmar'}`,
    ];
    if (detalle.value.trim()) lineas.push(`Detalle: ${detalle.value.trim()}`);
    if (nombre.value.trim()) lineas.push(`Soy ${nombre.value.trim()}.`);
    return lineas.join('\n');
  };
  const pintar = () => { const m = mensaje(); vista.textContent = m; enviar.href = wa(m); };
  selModelo.addEventListener('change', () => { const p = getProducto(selModelo.value); if (p) selSup.value = p.cat; });
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-encargar]');
    if (!b) return;
    const p = getProducto(b.dataset.encargar);
    if (p) { selModelo.value = p.id; selSup.value = p.cat; }
    if (b.dataset.talle && TALLES.includes(Number(b.dataset.talle))) selTalle.value = b.dataset.talle;
    pintar();
  });
  document.addEventListener('talle:cambio', () => { if (!selTalle.value && MiTalle.get()) { selTalle.value = String(MiTalle.get()); pintar(); } });
  pintar();
}

function initGuia() {
  const cont = document.querySelector('[data-guia]');
  if (!cont) return;
  const rango = cont.querySelector('#largoPie');
  const valor = cont.querySelector('[data-guia-valor]');
  const ar = cont.querySelector('[data-guia-ar]');
  const us = cont.querySelector('[data-guia-us]');
  const eu = cont.querySelector('[data-guia-eu]');
  const cm = cont.querySelector('[data-guia-cm]');
  const nota = cont.querySelector('[data-guia-nota]');
  const ver = cont.querySelector('[data-guia-ver]');
  const verTalle = cont.querySelector('[data-guia-talle]');
  const guardarBtn = cont.querySelector('[data-guia-guardar]');
  const tabla = document.querySelector('[data-tabla-talles]');
  if (tabla) {
    tabla.innerHTML = `<caption class="sr-only">Equivalencias orientativas de talles</caption><thead><tr><th scope="row">AR</th>${TALLES.map(t => `<th scope="col" data-col="${t}">${t}</th>`).join('')}</tr></thead><tbody>${[['US', 'us'], ['EU', 'eu'], ['CM', 'cm']].map(([n, k]) => `<tr><th scope="row">${n}</th>${TALLES.map(t => `<td data-col="${t}">${k === 'cm' ? String(TABLA_TALLES[t].cm).replace('.', ',') : TABLA_TALLES[t][k]}</td>`).join('')}</tr>`).join('')}</tbody>`;
  }
  const recomendar = largo => TALLES.find(t => TABLA_TALLES[t].cm >= largo) ?? 45;
  const mi = MiTalle.get();
  if (mi) rango.value = TABLA_TALLES[mi].cm;
  let actual = recomendar(Number(rango.value));
  const pintar = () => {
    const largo = Number(rango.value);
    const t = recomendar(largo);
    actual = t;
    const d = TABLA_TALLES[t];
    const txtLargo = `${largo.toFixed(1).replace('.', ',')} cm`;
    valor.textContent = txtLargo;
    rango.setAttribute('aria-valuetext', `${txtLargo}, talle ${t}`);
    rango.style.setProperty('--p', `${((largo - Number(rango.min)) / (Number(rango.max) - Number(rango.min))) * 100}%`);
    ar.textContent = `AR ${t}`;
    us.textContent = d.us;
    eu.textContent = d.eu;
    cm.textContent = String(d.cm).replace('.', ',');
    if (largo > 30) nota.textContent = 'Más de 30 cm: escribinos y lo vemos por encargue.';
    else if (largo < 24.3) nota.textContent = 'Menos de 24,5 cm: consultanos por talles más chicos.';
    else nota.textContent = 'Si estás entre dos talles o usás medias gruesas, elegí el más grande.';
    ver.href = `${paginaCatalogo()}?talle=${t}`;
    verTalle.textContent = t;
    const guardado = MiTalle.get() === t;
    guardarBtn.setAttribute('aria-pressed', String(guardado));
    guardarBtn.textContent = guardado ? 'Es tu talle guardado' : 'Guardar como mi talle';
    tabla?.querySelectorAll('[data-col]').forEach(c => c.classList.toggle('es-rec', Number(c.dataset.col) === t));
  };
  rango.addEventListener('input', pintar);
  ver.addEventListener('click', () => MiTalle.set(actual));
  guardarBtn.addEventListener('click', () => {
    if (MiTalle.get() === actual) return;
    MiTalle.set(actual);
    showToast(`Listo: vas a ver el talle ${actual} marcado en cada modelo.`);
  });
  document.addEventListener('talle:cambio', pintar);
  pintar();
}

const REFERENCIAS = [];
function initReferencias() {
  const cont = document.querySelector('[data-referencias]');
  if (!cont || !REFERENCIAS.length) return;
  cont.innerHTML = REFERENCIAS.map(r => `<article class="ref-card" data-animate="subir" style="opacity:0;transform:translateY(48px)"><div class="ref-card__foto"><img src="${esc(r.foto)}" width="480" height="600" alt="${esc(r.nombre)} con sus botines ${esc(r.modelo)}"></div><div class="ref-card__txt"><p class="ref-card__quien">${esc(r.nombre)}</p><p class="ref-card__modelo">${esc(r.modelo)} · talle ${esc(r.talle)}</p><p>${esc(r.texto)}</p></div></article>`).join('');
  cont.hidden = false;
  document.querySelectorAll('[data-ref-vacio]').forEach(el => { el.hidden = true; });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); sincronizarScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.menu-cat__btn')?.focus();
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { y: 30, rotate: -4, scale: 0.92, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const k = Number(el.dataset.parallax) || 0.05;
    ScrollTrigger.create({
      trigger: el.closest('section') || el,
      start: 'top top',
      end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${(self.progress * k * 100).toFixed(2)}%`; },
    });
  });
}

initSelTalle();
initMenuCats();
initEtiquetas();
initSuperficies();
initPreview();
initCatalogo();
initEncargue();
initGuia();
initReferencias();
initReveals();
initNav();
initMenuCat();
initLupa();
initAcciones();
initModal();
initCarrito();
initFiltrosDrawer();
initFloats();
updateCartBadge();
initModelBarScroll();
initHeroMotion();
initParallax();
document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
