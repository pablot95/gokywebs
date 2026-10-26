'use strict';

const WA = '5491130722394';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const LEGAL_SUPLEMENTO = 'Suplemento dietario. Leé el rótulo y consultá a tu médico antes de consumirlo.';

const CATEGORIAS = [
  { id: 'proteinas', nombre: 'Proteínas', img: 'images/p-whey.webp', resumen: 'Whey, isolate, vegetal y ganadores de peso' },
  { id: 'creatina', nombre: 'Creatina', img: 'images/p-creatina.webp', resumen: 'Monohidrato en polvo o en cápsulas' },
  { id: 'rendimiento', nombre: 'Pre-entreno y aminoácidos', img: 'images/p-preentreno.webp', resumen: 'Pre-entreno, BCAA y glutamina' },
  { id: 'shakers', nombre: 'Shakers y packs', img: 'images/p-shaker.webp', resumen: 'Para mezclar y para arrancar' },
  { id: 'barritas', nombre: 'Barritas proteicas', img: 'images/p-barrita.webp', resumen: 'Por unidad o en caja de 12' },
];

const OBJETIVOS = [
  { id: 'masa', nombre: 'Ganar masa muscular', resumen: 'Whey, isolate, proteína vegetal y ganadores de peso.', img: 'images/p-whey.webp' },
  { id: 'fuerza', nombre: 'Fuerza y potencia', resumen: 'Creatina en polvo o en cápsulas y pre-entreno.', img: 'images/p-creatina.webp' },
  { id: 'recuperacion', nombre: 'Recuperación', resumen: 'Proteína, BCAA y glutamina para después de entrenar.', img: 'images/p-bcaa.webp' },
  { id: 'snack', nombre: 'Snack proteico', resumen: 'Barritas para el bolso, la oficina o la previa.', img: 'images/p-barrita-crocante.webp' },
];

const PRECIOS = {
  'hasta-35': [0, 35000, 'Hasta $35.000'],
  '35-70': [35000, 70000, '$35.000 a $70.000'],
  'mas-70': [70000, Infinity, 'Más de $70.000'],
};

const ORDENES = {
  destacados: 'Más pedidos',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const PRODUCTOS = [
  {
    id: 'whey-protein', nombre: 'Whey Protein concentrada', cat: 'proteinas', obj: ['masa', 'recuperacion'], img: 'images/p-whey.webp',
    desc: 'Proteína de suero concentrada para sumar proteína a tu día: después de entrenar, en el desayuno o como colación. Se mezcla en el shaker con agua o leche.',
    pres: [{ id: '2lb', nombre: '2 lb · 908 g', precio: 64900, stock: 18, porciones: 30 }, { id: '5lb', nombre: '5 lb · 2,27 kg', precio: 142900, stock: 7, porciones: 75 }],
    sabores: ['Chocolate', 'Vainilla', 'Frutilla', 'Cookies & cream'], descuento: 0, destacado: 1,
  },
  {
    id: 'creatina-monohidrato', nombre: 'Creatina monohidrato micronizada', cat: 'creatina', obj: ['fuerza'], img: 'images/p-creatina.webp',
    desc: 'Creatina monohidrato micronizada y sin sabor: se mezcla con agua, con jugo o con tu proteína. Una medida de 5 g por porción.',
    pres: [{ id: '300g', nombre: '300 g', precio: 32900, stock: 24, porciones: 60 }, { id: '500g', nombre: '500 g', precio: 49900, stock: 12, porciones: 100 }, { id: '1kg', nombre: '1 kg', precio: 89900, stock: 5, porciones: 200 }],
    sabores: [], descuento: 0, destacado: 2,
  },
  {
    id: 'pre-entreno', nombre: 'Pre-entreno en polvo', cat: 'rendimiento', obj: ['fuerza'], img: 'images/p-preentreno.webp',
    desc: 'Polvo para mezclar con agua antes de entrenar. Contiene cafeína: leé el rótulo antes de consumirlo y no lo combines con otras fuentes de cafeína.',
    pres: [{ id: '300g', nombre: '300 g', precio: 42900, stock: 10, porciones: 30 }],
    sabores: ['Limonada', 'Frutos rojos', 'Mango'], descuento: 0, destacado: 3,
  },
  {
    id: 'whey-isolate', nombre: 'Whey Isolate', cat: 'proteinas', obj: ['masa', 'recuperacion'], img: 'images/p-isolate.webp',
    desc: 'Proteína de suero aislada, con menos grasa y lactosa que la concentrada. Se disuelve rápido y queda liviana.',
    pres: [{ id: '2lb', nombre: '2 lb · 908 g', precio: 89900, stock: 4, porciones: 30 }],
    sabores: ['Chocolate', 'Vainilla'], descuento: 10, destacado: 4,
  },
  {
    id: 'shaker-600', nombre: 'Shaker con resorte 600 ml', cat: 'shakers', obj: [], img: 'images/p-shaker.webp',
    desc: 'Shaker de 600 ml con resorte mezclador para que la proteína quede sin grumos. Tapa con pico y traba, para llevar en el bolso.',
    pres: [{ id: '600ml', nombre: '600 ml', precio: 8900, stock: 30 }],
    sabores: [], descuento: 0, destacado: 5,
  },
  {
    id: 'barrita-proteica', nombre: 'Barrita proteica 20 g', cat: 'barritas', obj: ['snack'], img: 'images/p-barrita.webp',
    desc: 'Barrita con cobertura y 20 g de proteína. Para el bolso, la oficina o la previa del entrenamiento.',
    pres: [{ id: 'unidad', nombre: 'Unidad', precio: 2400, stock: 60 }, { id: 'caja12', nombre: 'Caja x 12', precio: 26900, stock: 9 }],
    sabores: ['Chocolate', 'Maní', 'Cookies'], descuento: 0, destacado: 6,
  },
  {
    id: 'pack-arranque', nombre: 'Pack Arranque: whey + creatina + shaker', cat: 'shakers', obj: ['masa', 'fuerza'], img: 'images/p-pack-inicio.webp',
    desc: 'Para empezar con todo: Whey Protein 2 lb del sabor que elijas, creatina monohidrato 300 g y el shaker de 600 ml.',
    pres: [{ id: 'pack', nombre: 'Pack de 3 productos', precio: 106700, stock: 6 }],
    sabores: ['Chocolate', 'Vainilla', 'Frutilla', 'Cookies & cream'], descuento: 12, destacado: 7,
  },
  {
    id: 'proteina-doypack', nombre: 'Whey Protein en doypack', cat: 'proteinas', obj: ['masa', 'recuperacion'], img: 'images/p-doypack.webp',
    desc: 'La misma whey en bolsa con cierre zip: ocupa menos lugar en la alacena y rinde 33 porciones.',
    pres: [{ id: '1kg', nombre: '1 kg', precio: 58900, stock: 14, porciones: 33 }],
    sabores: ['Chocolate', 'Dulce de leche', 'Banana'], descuento: 0, nuevo: true,
  },
  {
    id: 'proteina-vegetal', nombre: 'Proteína vegetal de arveja y arroz', cat: 'proteinas', obj: ['masa'], img: 'images/p-vegetal.webp',
    desc: 'Proteína de arveja y arroz, sin lácteos. Para quienes no consumen proteína de origen animal.',
    pres: [{ id: '1kg', nombre: '1 kg', precio: 61900, stock: 8, porciones: 30 }],
    sabores: ['Chocolate', 'Natural'], descuento: 0, nuevo: true,
  },
  {
    id: 'ganador-peso', nombre: 'Ganador de peso', cat: 'proteinas', obj: ['masa'], img: 'images/p-ganador.webp',
    desc: 'Mezcla de proteínas y carbohidratos para sumar calorías en el día. Se prepara con leche, después de entrenar o entre comidas.',
    pres: [{ id: '1-5kg', nombre: '1,5 kg', precio: 39900, stock: 11, porciones: 15 }, { id: '3kg', nombre: '3 kg', precio: 72900, stock: 6, porciones: 30 }],
    sabores: ['Chocolate', 'Vainilla'], descuento: 0,
  },
  {
    id: 'creatina-capsulas', nombre: 'Creatina en cápsulas', cat: 'creatina', obj: ['fuerza'], img: 'images/p-creatina-caps.webp',
    desc: 'La misma creatina monohidrato en cápsulas, para tomar sin preparar nada.',
    pres: [{ id: '120caps', nombre: '120 cápsulas', precio: 29900, stock: 13, porciones: 30 }],
    sabores: [], descuento: 0,
  },
  {
    id: 'bcaa', nombre: 'Aminoácidos BCAA 2:1:1', cat: 'rendimiento', obj: ['recuperacion'], img: 'images/p-bcaa.webp',
    desc: 'Aminoácidos de cadena ramificada (leucina, isoleucina y valina) en proporción 2:1:1, en cápsulas.',
    pres: [{ id: '120caps', nombre: '120 cápsulas', precio: 26900, stock: 16, porciones: 30 }],
    sabores: [], descuento: 0,
  },
  {
    id: 'glutamina', nombre: 'Glutamina en polvo', cat: 'rendimiento', obj: ['recuperacion'], img: 'images/p-glutamina.webp',
    desc: 'Glutamina en polvo y sin sabor. Se suma al shake de proteína o a un vaso de agua.',
    pres: [{ id: '300g', nombre: '300 g', precio: 31900, stock: 9, porciones: 60 }],
    sabores: [], descuento: 0,
  },
  {
    id: 'barrita-crocante', nombre: 'Barrita crocante con proteína', cat: 'barritas', obj: ['snack'], img: 'images/p-barrita-crocante.webp',
    desc: 'Barrita crocante de cereales con proteína y cobertura de chocolate.',
    pres: [{ id: 'unidad', nombre: 'Unidad', precio: 2200, stock: 48 }, { id: 'caja12', nombre: 'Caja x 12', precio: 24500, stock: 3 }],
    sabores: ['Chocolate amargo', 'Coco'], descuento: 0, nuevo: true,
  },
  {
    id: 'barrita-avena', nombre: 'Barrita de avena y proteína', cat: 'barritas', obj: ['snack'], img: 'images/p-barrita-avena.webp',
    desc: 'Barrita de avena con proteína, en envoltorio kraft. Liviana para la media mañana o la previa.',
    pres: [{ id: 'unidad', nombre: 'Unidad', precio: 1900, stock: 40 }, { id: 'caja12', nombre: 'Caja x 12', precio: 20900, stock: 7 }],
    sabores: ['Avena y cacao', 'Avena y frutos rojos'], descuento: 0,
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conDescuento = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100) / 100) * 100 : precio);
const presDe = (p, presId) => p.pres.find(x => x.id === presId) || p.pres[0];
const precioDesde = p => Math.min(...p.pres.map(x => conDescuento(p, x.precio)));
const precioListaDesde = p => Math.min(...p.pres.map(x => x.precio));
const stockTotal = p => p.pres.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const objDe = id => OBJETIVOS.find(o => o.id === id);
const necesitaOpciones = p => p.pres.length > 1 || p.sabores.length > 1;
const esSuplemento = p => p.cat !== 'shakers' && p.cat !== 'barritas';
const textoBoton = p => (p.sabores.length > 1 ? 'Elegir sabor' : p.pres.length > 1 ? 'Elegir tamaño' : 'Agregar');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), obj = lista(f.obj), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (obj.length && !obj.some(o => p.obj.includes(o))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v >= max) return false;
    }
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.destacado && !p.destacado) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'nuevos': return (a, b) => Number(!!b.nuevo) - Number(!!a.nuevo) || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || Number(!!b.nuevo) - Number(!!a.nuevo) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, ...p.obj.map(o => objDe(o)?.nombre), p.desc, ...p.sabores, ...p.pres.map(x => x.nombre),
      p.descuento > 0 ? 'oferta descuento promo' : '', p.nuevo ? 'nuevo novedad' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
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

const Tienda = crearTienda(PRODUCTOS, { tope: TOPE_CONSULTA });

const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) {
    const p = Tienda.obtener(id);
    if (p) cacheProductos.set(id, p);
  }
  return cacheProductos.get(id) || null;
};

const Cart = {
  KEY: 'nucleosport_cart',
  clave: (id, pres, sabor) => `${id}|${pres}|${sabor || ''}`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, { pres, sabor } = {}) {
    const pr = presDe(producto, pres);
    const items = this.get();
    const k = this.clave(producto.id, pr.id, sabor);
    const existing = items.find(i => this.clave(i.id, i.pres, i.sabor) === k);
    const tope = pr.stock ?? 99;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, pres: pr.id, sabor: sabor || '', qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i.id, i.pres, i.sabor) === k);
    if (!it) return;
    const p = getProducto(it.id);
    const tope = p ? presDe(p, it.pres).stock ?? 99 : 99;
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i.id, i.pres, i.sabor) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      const pr = presDe(p, i.pres);
      return { ...i, clave: this.clave(i.id, i.pres, i.sabor), producto: p, presentacion: pr, unitario: conDescuento(p, pr.precio) };
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.unitario * l.qty, 0); },
};

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const urlProducto = id => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  camion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
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

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (stockTotal(p) > 0 && p.pres.every(x => x.stock <= 5)) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<div class="prod-badges">${b.join('')}</div>` : '';
}

function precioHTML(p) {
  const desde = new Set(p.pres.map(x => x.precio)).size > 1;
  const final = precioDesde(p);
  const lista = precioListaDesde(p);
  return `<p class="prod-precio">${desde ? '<span class="prod-desde">desde</span> ' : ''}<strong>${formatearPrecio(final)}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(lista)}</s>` : ''}</p>`;
}

function metaDe(p) {
  return `${catDe(p.cat)?.nombre || ''} · ${p.pres.length > 1 ? `${p.pres.length} tamaños` : esc(p.pres[0].nombre)}`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="prod" data-id="${esc(p.id)}"${anim}>
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="900" height="900" decoding="async"></a>
      ${badgesHTML(p)}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" tabindex="-1">${esc(p.nombre)}</a></h3>
      ${precioHTML(p)}
      <div class="prod-actions">
        ${necesitaOpciones(p) ? `<button type="button" class="prod-add prod-add--opciones" data-add="${esc(p.id)}">${textoBoton(p)}</button>` : `<div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">1</output>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICONOS.carrito}<span class="prod-add-txt">Agregar</span></button>`}
      </div>
    </div>
  </article>`;
}

function miniHTML(p) {
  return `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">
    <article class="mini">
      <a class="mini-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="900" height="900" decoding="async" draggable="false"></a>
      ${badgesHTML(p)}
      <div class="mini-body">
        <p class="prod-meta">${metaDe(p)}</p>
        <h3 class="mini-nombre">${esc(p.nombre)}</h3>
        ${precioHTML(p)}
      </div>
      <button type="button" class="mini-add" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${ICONOS.mas}</button>
    </article>
  </li>`;
}

function rankHTML(p, n) {
  return `<li class="rank" data-animate="subir" style="opacity:0;transform:translateY(48px)">
    <span class="rank-n" aria-hidden="true">${String(n).padStart(2, '0')}</span>
    <a class="rank-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="900" height="900" decoding="async"></a>
    <div class="rank-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="rank-nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
    </div>
    <button type="button" class="rank-add" data-add="${esc(p.id)}">${textoBoton(p)}</button>
  </li>`;
}

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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
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
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats-btn');
  const panel = cont.querySelector('.nav-cats-panel');
  const lista = cont.querySelector('[data-menu-cats]');
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${paginaCatalogo()}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="900" height="900" loading="lazy"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} productos</small></span></a></li>`).join('');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (hover.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (hover.matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (hover.matches && !cont.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  $$('[data-cuenta-cat]').forEach(el => { el.textContent = `${Tienda.contar({ cat: el.dataset.cuentaCat })} productos`; });
  $$('[data-cuenta-obj]').forEach(el => { el.textContent = `${Tienda.contar({ obj: el.dataset.cuentaObj })} productos`; });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
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
  sync();
}

let abrirCarrito = () => {};
let abrirVista = () => {};

function bloquear(on) {
  document.body.classList.toggle('no-scroll', on);
}

function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
      <header class="drawer-head">
        <h2>Tu pedido <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <p class="drawer-zona">${ICONOS.camion}<span>Entregas en el día en CABA y Vicente López</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--line btn--block" data-pedido-wsp href="${waLink('Hola Nucleosport! Quiero hacer un pedido.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
      </footer>
    </aside>`);
  const drawer = $('#drawer');
  const bd = $('#drawer-bd');
  const body = $('[data-drawer-body]', drawer);
  const foot = $('[data-drawer-foot]', drawer);
  let opener = null;
  let timer = 0;

  const pintar = () => {
    const lineas = Cart.lineas();
    $('[data-drawer-cuenta]', drawer).textContent = lineas.length ? `(${Cart.count()})` : '';
    foot.hidden = !lineas.length;
    if (!lineas.length) {
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.carrito}<p><strong>Tu carrito está vacío.</strong> Arrancá por los más pedidos: proteína, creatina y un buen shaker.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver al catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.img)}" alt="" width="900" height="900">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${esc(l.presentacion.nombre)}${l.sabor ? ` · ${esc(l.sabor)}` : ''}</p>
          <div class="linea-acciones">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-paso="-1" aria-label="Restar uno"${l.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
              <output aria-label="Cantidad">${l.qty}</output>
              <button type="button" data-linea-paso="1" aria-label="Sumar uno"${l.qty >= (l.presentacion.stock ?? 99) ? ' disabled' : ''}>${ICONOS.mas}</button>
            </div>
            <button type="button" class="linea-quitar" data-linea-quitar aria-label="Quitar ${esc(l.producto.nombre)}">${ICONOS.basura}</button>
          </div>
        </div>
        <p class="linea-precio">${formatearPrecio(l.unitario * l.qty)}</p>
      </li>`).join('')}</ul>`;
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(Cart.total());
    const texto = ['Hola Nucleosport! Quiero hacer este pedido:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre} (${l.presentacion.nombre}${l.sabor ? `, ${l.sabor}` : ''}) ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`, 'Mi barrio o localidad es: '].join('\n');
    $('[data-pedido-wsp]', drawer).href = waLink(texto);
  };

  const abrir = () => {
    opener = document.activeElement;
    clearTimeout(timer);
    pintar();
    drawer.hidden = false; bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
    drawer.querySelector('.drawer-close').focus();
  };
  const cerrar = () => {
    drawer.classList.remove('open'); bd.classList.remove('open');
    bloquear(false);
    timer = setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
    opener?.focus?.();
  };
  abrirCarrito = abrir;
  bd.addEventListener('click', cerrar);
  drawer.querySelector('.drawer-close').addEventListener('click', cerrar);
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    const li = e.target.closest('.linea');
    if (!li) return;
    const k = li.dataset.clave;
    const it = Cart.get().find(i => Cart.clave(i.id, i.pres, i.sabor) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  $('[data-finalizar]', drawer).addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle del producto">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media"><img src="images/p-whey.webp" alt="" width="900" height="900" data-qv-img></div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const img = $('[data-qv-img]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const pr = presDe(p, estado.pres);
    const unit = conDescuento(p, pr.precio);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { destacado: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const sinStock = !(pr.stock > 0);
    info.innerHTML = `
      <p class="qv-meta">${esc(catDe(p.cat)?.nombre)}${p.obj.length ? ` · ${p.obj.map(o => esc(objDe(o)?.nombre)).join(' · ')}` : ''}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio"><strong>${formatearPrecio(unit)}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(pr.precio)}</s> <span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${p.pres.length > 1 ? `<fieldset class="opciones" data-grupo="pres"><legend>Tamaño</legend><div class="chips">${p.pres.map(x => `<label class="chip"><input type="radio" name="qv-pres" value="${esc(x.id)}"${x.id === pr.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.nombre)}</span></label>`).join('')}</div></fieldset>` : `<p class="qv-pres">Presentación: <strong>${esc(pr.nombre)}</strong></p>`}
      ${p.sabores.length > 1 ? `<fieldset class="opciones${estado.falta ? ' opciones--falta' : ''}" data-grupo="sabor"><legend>Sabor ${estado.sabor ? '' : '<span class="opciones-aviso">· elegí uno</span>'}</legend><div class="chips">${p.sabores.map(s => `<label class="chip"><input type="radio" name="qv-sabor" value="${esc(s)}"${s === estado.sabor ? ' checked' : ''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>` : p.sabores.length === 1 ? `<p class="qv-pres">Sabor: <strong>${esc(p.sabores[0])}</strong></p>` : ''}
      <p class="qv-stock">${sinStock ? 'Sin stock en este tamaño.' : pr.stock <= 5 ? `Quedan ${pr.stock} en este tamaño.` : 'En stock · entrega en el día en CABA y Vicente López.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <dl class="qv-ficha">
        <div><dt>Presentación</dt><dd>${esc(pr.nombre)}</dd></div>
        ${pr.porciones ? `<div><dt>Porciones aprox.</dt><dd>${pr.porciones}</dd></div>` : ''}
        ${p.sabores.length ? `<div><dt>Sabores</dt><dd>${p.sabores.map(esc).join(', ')}</dd></div>` : ''}
        <div><dt>Categoría</dt><dd>${esc(catDe(p.cat)?.nombre)}</dd></div>
      </dl>
      ${esSuplemento(p) ? `<p class="qv-legal">${LEGAL_SUPLEMENTO}</p>` : ''}
      ${rel.length ? `<div class="qv-rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    img.src = p.img;
    img.alt = p.nombre;
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href,
      offers: p.pres.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: conDescuento(p, x.precio), availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const agregar = () => {
    const p = estado.p;
    if (p.sabores.length > 1 && !estado.sabor) {
      estado.falta = true;
      pintar();
      info.querySelector('[data-grupo="sabor"] input')?.focus();
      showToast('Elegí un sabor para agregarlo.');
      return false;
    }
    const sabor = p.sabores.length === 1 ? p.sabores[0] : estado.sabor;
    Cart.add(p, estado.qty, { pres: estado.pres, sabor });
    showToast(`${p.nombre}${sabor ? ` · ${sabor}` : ''} al carrito`);
    return true;
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    const pr = p.pres.find(x => x.stock > 0) || p.pres[0];
    estado = { p, pres: pr.id, sabor: p.sabores.length === 1 ? p.sabores[0] : null, qty: Math.max(1, Math.min(qty, pr.stock || 1)), falta: false };
    if (bd.hidden) opener = document.activeElement;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    const objetivo = foco === 'opciones' ? info.querySelector('.opciones input:not(:disabled)') : null;
    (objetivo || bd.querySelector('.qv-close')).focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    window.history.replaceState(null, '', url);
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
    opener?.focus?.();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name === 'qv-pres') {
      estado.pres = e.target.value;
      const pr = presDe(estado.p, estado.pres);
      estado.qty = Math.min(estado.qty, pr.stock || 1);
      pintar();
      info.querySelector(`input[name="qv-pres"][value="${window.CSS.escape(estado.pres)}"]`)?.focus();
    }
    if (e.target.name === 'qv-sabor') {
      estado.sabor = e.target.value;
      estado.falta = false;
      pintar();
      info.querySelector(`input[name="qv-sabor"][value="${window.CSS.escape(estado.sabor)}"]`)?.focus();
    }
  });
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const pr = presDe(estado.p, estado.pres);
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), pr.stock || 1));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]')) { if (agregar()) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregar()) { cerrar(); abrirCarrito(); } }
  });
  const inicial = new URLSearchParams(location.search).get('producto');
  if (inicial && getProducto(inicial)) abrir(inicial);
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      e.preventDefault();
      abrirVista(ver.dataset.ver);
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('output');
      out.textContent = Math.max(1, Math.min(99, Number(out.textContent) + Number(paso.dataset.paso)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const p = getProducto(add.dataset.add);
    if (!p) return;
    const qty = Number(add.closest('.prod')?.querySelector('[data-stepper] output')?.textContent) || 1;
    if (necesitaOpciones(p)) { abrirVista(p.id, { qty, foco: 'opciones' }); return; }
    Cart.add(p, qty, { pres: p.pres[0].id, sabor: p.sabores[0] || '' });
    showToast(`${p.nombre} al carrito`);
    add.classList.remove('ok'); void add.offsetWidth; add.classList.add('ok');
  });
}

function initRail() {
  const track = document.querySelector('[data-rail="destacados"]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  track.innerHTML = items.map(miniHTML).join('');
  const vp = track.closest('.rail-vp');
  const sec = track.closest('section');
  const prev = sec.querySelector('[data-rail-prev]');
  const next = sec.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 16;
  const flechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) {
      const matar = ev => { ev.preventDefault(); ev.stopPropagation(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 0);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}

function initVistaPrevia() {
  const grid = document.querySelector('[data-grilla="completa"]');
  if (grid) {
    const destacados = Tienda.consultar({ filtros: { destacado: true }, limite: 8 }).items.map(p => p.id);
    const { items } = Tienda.consultar({ filtros: { excluir: destacados }, orden: 'destacados', limite: 8 });
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
  }
  const rank = document.querySelector('[data-grilla="ranking"]');
  if (rank) {
    const { items } = Tienda.consultar({ orden: 'destacados', limite: 8 });
    rank.innerHTML = items.map((p, i) => rankHTML(p, i + 1)).join('');
  }
}

function initObjetivos() {
  const cont = document.querySelector('[data-puertas]');
  if (!cont) return;
  const puertas = $$('.puerta', cont);
  const activar = el => puertas.forEach(p => p.classList.toggle('activa', p === el));
  puertas.forEach(p => {
    p.addEventListener('mouseenter', () => activar(p));
    p.addEventListener('focusin', () => activar(p));
  });
}

function initCatalogo() {
  const app = document.querySelector('[data-catalogo-app]');
  if (!app) return;
  const grid = $('[data-resultados]', app);
  const verMas = $('[data-ver-mas]', app);
  const contador = $('[data-contador]', app);
  const vacio = $('[data-vacio]', app);
  const chipsActivos = $('[data-activos]', app);
  const buscador = $('#cat-q', app);
  const orden = $('#cat-orden', app);
  const panel = $('[data-filtros]', app);
  const abrirFiltros = $('[data-abrir-filtros]', app);
  const cuentaRes = $('[data-cuenta-res]', app);
  const miga = document.querySelector('[data-miga]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="obj"]', panel).innerHTML = OBJETIVOS.map(o => `<label class="chk"><input type="checkbox" data-f="obj" value="${o.id}"><span>${esc(o.nombre)}</span><small>${Tienda.contar({ obj: o.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk chk--radio"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    obj: validos(params.get('obj'), OBJETIVOS.map(o => o.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    oferta: params.get('oferta') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, obj: estado.obj, precio: estado.precio, oferta: estado.oferta });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    $$('input[data-f="cat"]', panel).forEach(i => { i.checked = estado.cat.includes(i.value); });
    $$('input[data-f="obj"]', panel).forEach(i => { i.checked = estado.obj.includes(i.value); });
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    $('input[data-f="oferta"]', panel).checked = estado.oferta;
    if (miga) {
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      miga.innerHTML = c ? `<a href="${paginaCatalogo()}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.nombre)}</span>` : '<span aria-current="page">Catálogo</span>';
    }
    $$('[data-menu-cats] a').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && cat === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'obj', 'precio', 'oferta', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.obj.length) u.searchParams.set('obj', estado.obj.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.oferta) u.searchParams.set('oferta', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.obj.map(o => ['obj', o, objDe(o).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
      ...(estado.oferta ? [['oferta', '', 'Con descuento']] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay productos con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], obj: [], precio: '', oferta: false }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'obj') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'precio') estado.precio = e.target.value;
    if (f === 'oferta') estado.oferta = e.target.checked;
    aplicar();
  });
  orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
  let t = 0;
  buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  $('[data-form-buscar]', app).addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas.addEventListener('click', () => pintar(true));
  app.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const k = quitar.dataset.quitar;
      if (k === 'q') estado.q = '';
      else if (k === 'cat' || k === 'obj') estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      else if (k === 'precio') estado.precio = '';
      else if (k === 'oferta') estado.oferta = false;
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  const cerrarPanel = () => { panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false'); bloquear(false); abrirFiltros.focus(); };
  abrirFiltros.addEventListener('click', () => {
    panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true'); bloquear(true);
    panel.querySelector('input')?.focus();
  });
  $$('[data-cerrar-filtros]', panel).forEach(b => b.addEventListener('click', cerrarPanel));
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches && panel.classList.contains('open')) { panel.classList.remove('open'); bloquear(false); } });

  sincronizarUI();
  pintar();
  if (location.hash === '#buscar') buscador.focus();
}

const zonaEstado = { zonas: null, promesa: null, mapa: null, capas: new Map() };
const ALIAS_ZONA = { caba: 'CABA', capital: 'CABA', 'capital federal': 'CABA', 'ciudad de buenos aires': 'CABA', 'ciudad autonoma de buenos aires': 'CABA' };

function cargarZonas() {
  if (!zonaEstado.promesa) {
    zonaEstado.promesa = window.fetch('zonas.json').then(r => r.json()).then(d => { zonaEstado.zonas = d.zonas; return d.zonas; }).catch(() => { zonaEstado.zonas = []; return []; });
  }
  return zonaEstado.promesa;
}

function buscarZona(texto, zonas) {
  const t = norm(texto).replace(/^(barrio|localidad|partido)( de)? /, '');
  if (!t) return { tipo: 'vacio' };
  if (ALIAS_ZONA[t]) return { tipo: 'caba' };
  const exacta = zonas.find(z => norm(z.n) === t);
  if (exacta) return { tipo: 'ok', zona: exacta };
  const empieza = zonas.filter(z => norm(z.n).startsWith(t));
  if (empieza.length === 1) return { tipo: 'ok', zona: empieza[0] };
  const contiene = empieza.length ? empieza : zonas.filter(z => norm(z.n).includes(t));
  if (contiene.length === 1) return { tipo: 'ok', zona: contiene[0] };
  if (contiene.length > 1) return { tipo: 'varias', opciones: contiene.slice(0, 6) };
  return { tipo: 'fuera', texto: texto.trim() };
}

function initZona() {
  const sec = document.querySelector('[data-zona]');
  if (!sec) return;
  const form = $('[data-zona-form]', sec);
  const input = $('#zona-input', sec);
  const res = $('[data-zona-res]', sec);
  const lista = $('#zona-lista', sec);
  const mapaEl = $('#mapa-zona', sec);
  const catalogo = paginaCatalogo();

  const estiloBase = z => ({ color: '#2B6B22', weight: 1, opacity: 0.55, fillColor: z.z === 'vl' ? '#4FA63A' : '#63C548', fillOpacity: 0.22 });
  const copia = $('.zona-copy', sec);
  const margen = extra => {
    const mr = mapaEl.getBoundingClientRect();
    const cr = copia?.getBoundingClientRect();
    const pisa = cr && cr.left < mr.right && cr.right > mr.left && cr.top < mr.bottom && cr.bottom > mr.top;
    const tapa = pisa ? Math.max(0, cr.right - mr.left) + 16 : 0;
    return { paddingTopLeft: [tapa + extra, extra], paddingBottomRight: [extra, extra + 24] };
  };
  const dibujar = zonas => {
    if (typeof L === 'undefined' || !mapaEl || zonaEstado.mapa) return;
    const mapa = L.map(mapaEl, { scrollWheelZoom: false, zoomControl: false, attributionControl: true, dragging: !L.Browser.mobile, tap: false });
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap · Barrios: Buenos Aires Data', maxZoom: 18 }).addTo(mapa);
    const grupo = L.featureGroup().addTo(mapa);
    zonas.forEach(z => {
      const capa = L.polygon(z.p, estiloBase(z)).addTo(grupo);
      capa.bindTooltip(z.n, { sticky: true, direction: 'top', className: 'zona-tip' });
      capa.on('click', () => { input.value = z.n; consultar(z.n); });
      zonaEstado.capas.set(z.n, { capa, z });
    });
    mapa.fitBounds(grupo.getBounds(), margen(12));
    zonaEstado.mapa = mapa;
    zonaEstado.limites = grupo.getBounds();
    if (zonaEstado.sel) resaltar(zonaEstado.sel);
  };
  const resaltar = nombre => {
    zonaEstado.sel = nombre;
    zonaEstado.mapa?.invalidateSize();
    zonaEstado.capas.forEach(({ capa, z }) => capa.setStyle(z.n === nombre ? { color: '#0C0F0C', weight: 2, opacity: 1, fillColor: '#63C548', fillOpacity: 0.62 } : estiloBase(z)));
    const sel = zonaEstado.capas.get(nombre);
    if (sel && zonaEstado.mapa) { sel.capa.bringToFront(); zonaEstado.mapa.flyToBounds(sel.capa.getBounds(), { ...margen(40), maxZoom: 14, duration: reduceMotion ? 0 : 0.8 }); }
    else if (!nombre && zonaEstado.mapa && zonaEstado.limites) zonaEstado.mapa.flyToBounds(zonaEstado.limites, { ...margen(12), duration: reduceMotion ? 0 : 0.8 });
  };
  const botones = (msj, conCatalogo) => `<div class="zona-ctas">${conCatalogo ? `<a class="btn btn--cta" href="${catalogo}">Ver productos ${ICONOS.flecha}</a>` : ''}<a class="btn btn--line" href="${esc(waLink(msj))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>${conCatalogo ? 'Coordinar por WhatsApp' : 'Consultar por WhatsApp'}</span></a></div>`;
  const mostrar = r => {
    res.hidden = false;
    res.className = `zona-res zona-res--${r.tipo === 'ok' || r.tipo === 'caba' ? 'si' : r.tipo === 'fuera' ? 'no' : 'info'}`;
    if (r.tipo === 'vacio') { res.innerHTML = '<p>Escribí un barrio de CABA o una localidad de Vicente López.</p>'; resaltar(null); return; }
    if (r.tipo === 'caba') { res.innerHTML = `<p><strong>Sí, en toda CABA la entrega es en el día.</strong> Hacé tu pedido y coordinamos el horario por WhatsApp.</p>${botones('Hola Nucleosport! Estoy en CABA y quiero hacer un pedido con entrega en el día.', true)}`; resaltar(null); return; }
    if (r.tipo === 'ok') {
      const donde = r.zona.z === 'vl' ? `${r.zona.n} (Vicente López)` : `${r.zona.n} (CABA)`;
      res.innerHTML = `<p><strong>Sí, ${esc(donde)} tiene entrega en el día.</strong> Hacé tu pedido y coordinamos el horario por WhatsApp.</p>${botones(`Hola Nucleosport! Estoy en ${donde} y quiero hacer un pedido con entrega en el día.`, true)}`;
      resaltar(r.zona.n);
      return;
    }
    if (r.tipo === 'varias') {
      res.innerHTML = `<p>¿Cuál de estos?</p><div class="zona-opciones">${r.opciones.map(z => `<button type="button" class="chip-btn" data-zona-op="${esc(z.n)}">${esc(z.n)}</button>`).join('')}</div>`;
      return;
    }
    res.innerHTML = `<p><strong>${esc(r.texto)} todavía no está en la zona de entrega en el día.</strong> Escribinos y vemos cómo hacértelo llegar.</p>${botones(`Hola Nucleosport! Estoy en ${r.texto}. ¿Cómo me puede llegar un pedido?`, false)}`;
    resaltar(null);
  };
  const consultar = async texto => {
    const zonas = await cargarZonas();
    mostrar(buscarZona(texto, zonas));
  };
  const preparar = () => cargarZonas().then(zonas => {
    if (!lista.children.length) lista.innerHTML = zonas.map(z => `<option value="${esc(z.n)}">${z.z === 'vl' ? 'Vicente López' : 'CABA'}</option>`).join('');
    dibujar(zonas);
  });
  form.addEventListener('submit', e => { e.preventDefault(); consultar(input.value); });
  input.addEventListener('focus', preparar, { once: true });
  sec.addEventListener('click', e => {
    const op = e.target.closest('[data-zona-op], [data-zona-chip]');
    if (!op) return;
    const n = op.dataset.zonaOp || op.dataset.zonaChip;
    input.value = n;
    consultar(n);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => { if (entries.some(en => en.isIntersecting)) { io.disconnect(); preparar(); } }, { rootMargin: '600px 0px' });
    io.observe(sec);
  } else preparar();
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
    .from(hero.querySelectorAll('.hero-raya'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.45)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto) gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function iniciar() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  initAntiCopia();
  initModelBarScroll();
  initCuentas();
  initMenuCategorias();
  initNav();
  initRail();
  initVistaPrevia();
  initCatalogo();
  initObjetivos();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initFloats();
  initZona();
  initHeroMotion();
  initReveals();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
}
