const WA = '5492227526335';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const CATEGORIAS = [
  { id: 'sombreros', nombre: 'Sombreros', img: 'images/cat-sombreros.webp' },
  { id: 'indumentaria', nombre: 'Indumentaria', img: 'images/cat-indumentaria.webp' },
  { id: 'calzado', nombre: 'Calzado', img: 'images/cat-calzado.webp' },
  { id: 'marroquineria', nombre: 'Marroquinería', img: 'images/cat-marroquineria.webp' },
  { id: 'talabarteria', nombre: 'Talabartería', img: 'images/cat-talabarteria.webp' },
  { id: 'regaleria', nombre: 'Regalería', img: 'images/cat-regaleria.webp' },
];
const MATERIALES = { cuero: 'Cuero', lana: 'Lana', fieltro: 'Fieltro', alpaca: 'Alpaca', tejido: 'Tejido pampa' };
const PRECIOS = { 'hasta-50': [0, 50000], '50-150': [50001, 150000], 'mas-150': [150001, Infinity] };
const TALLES_ROPA = ['S', 'M', 'L', 'XL', 'XXL'];
const HORARIO = { 0: [], 1: [[540, 720], [960, 1200]], 2: [[540, 720], [960, 1200]], 3: [[540, 720], [960, 1200]], 4: [[540, 720], [960, 1200]], 5: [[540, 720], [960, 1200]], 6: [[570, 780], [1020, 1200]] };
const LOCAL = { lat: -35.1871012, lng: -59.0961341 };

const PRODUCTOS = [
  {
    id: 'sombrero-fieltro', nombre: 'Sombrero de fieltro ala ancha', marca: 'Lagomarsino', cat: 'sombreros', precio: 128000, descuento: 0, stock: 6,
    img: 'images/p-sombrero-fieltro.webp', alt: 'Sombrero de fieltro color arena con cinta de cuero marrón, sobre una mesa de lino',
    material: ['fieltro', 'cuero'], rango: 1, alta: 20260910,
    var: { tipo: 'Talle', opciones: ['55', '56', '57', '58', '59', '60'] },
    desc: 'Sombrero de fieltro de ala ancha con cinta de cuero cosida. Firme, abriga y mantiene la forma: va con bombacha de campo o con jean.',
    cuidado: 'Guardalo apoyado sobre la copa, nunca sobre el ala. Si se moja, dejalo secar a la sombra.',
  },
  {
    id: 'bolso-viajero', nombre: 'Bolso de viaje de cuero', marca: '', cat: 'marroquineria', precio: 245000, descuento: 0, stock: 3,
    img: 'images/p-bolso-viajero.webp', alt: 'Bolso de viaje de cuero marrón con manijas y correa, sobre una mesa de madera',
    material: ['cuero'], rango: 2, alta: 20260901,
    desc: 'Bolso de viaje de cuero con manijas, correa regulable y herrajes de bronce. Entra la ropa de un fin de semana en el campo.',
    cuidado: 'Limpialo con un paño seco y nutrí el cuero cada tanto. Evitá dejarlo al sol.',
  },
  {
    id: 'cinto-faja', nombre: 'Cinto faja pampa con cuero', marca: '', cat: 'talabarteria', precio: 46000, descuento: 0, stock: 12,
    img: 'images/p-cinto-faja.webp', alt: 'Cinto tejido con guarda pampa azul y crudo, con punta de cuero y hebilla de metal',
    material: ['tejido', 'cuero'], rango: 3, alta: 20260901,
    var: { tipo: 'Talle', opciones: ['85', '90', '95', '100', '105', '110', '115'] },
    desc: 'Cinto de faja tejida con guarda pampa y terminaciones de cuero, con hebilla de metal. El talle es el largo en centímetros hasta el agujero del medio.',
    cuidado: 'Engrasá el cuero cada tanto para que no se reseque. El tejido se limpia con un paño húmedo.',
  },
  {
    id: 'botas', nombre: 'Botas de cuero con elástico', marca: '', cat: 'calzado', precio: 198000, descuento: 0, stock: 8,
    img: 'images/p-botas.webp', alt: 'Par de botas de cuero marrón con elástico lateral, sobre un piso de madera',
    material: ['cuero'], rango: 4, alta: 20261005,
    var: { tipo: 'Talle', opciones: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
    desc: 'Botas de cuero con elástico a los costados y suela cosida. Se ponen y se sacan sin cordones, para el campo y para el pueblo.',
    cuidado: 'Limpialas con un paño seco y nutrí el cuero con crema cada tanto.',
  },
  {
    id: 'cartera-tote', nombre: 'Cartera tote de cuero', marca: '', cat: 'marroquineria', precio: 168000, descuento: 0, stock: 4,
    img: 'images/p-cartera-tote.webp', alt: 'Cartera tote de cuero color suela con dos manijas',
    material: ['cuero'], rango: 5, alta: 20260920,
    desc: 'Cartera tote de cuero con dos manijas y costuras a la vista. Amplia para el día a día.',
    cuidado: 'Limpiala con un paño seco y nutrí el cuero cada tanto. Evitá dejarla al sol.',
  },
  {
    id: 'mate-cuero', nombre: 'Mate forrado en cuero con virola', marca: '', cat: 'regaleria', precio: 32000, descuento: 0, stock: 15,
    img: 'images/p-mate-cuero.webp', alt: 'Mate forrado en cuero marrón con virola de metal y bombilla',
    material: ['cuero', 'alpaca'], rango: 6, alta: 20260901,
    desc: 'Mate de calabaza forrado en cuero cosido a mano, con virola de alpaca. Un regalo que se usa todos los días.',
    cuidado: 'Curalo antes del primer uso y dejalo secar boca abajo después de cada mateada.',
  },
  {
    id: 'pulover-trenzado', nombre: 'Pulóver de lana trenzado', marca: '', cat: 'indumentaria', precio: 86000, descuento: 0, stock: 9,
    img: 'images/p-pulover-trenzado.webp', alt: 'Pulóver de lana color crudo con trenzas, doblado sobre una mesa de madera',
    material: ['lana'], rango: 7, alta: 20261010,
    var: { tipo: 'Talle', opciones: TALLES_ROPA },
    desc: 'Pulóver de lana con trenzas y cuello redondo, color crudo. Abriga de verdad en las mañanas de campo.',
    cuidado: 'Lavalo a mano con agua fría y secalo en horizontal, a la sombra.',
  },
  {
    id: 'billetera', nombre: 'Billetera de cuero', marca: '', cat: 'marroquineria', precio: 42000, descuento: 0, stock: 14,
    img: 'images/p-billetera.webp', alt: 'Billetera de cuero marrón cerrada, apoyada sobre un mantel de lino',
    material: ['cuero'], rango: 8, alta: 20260901,
    desc: 'Billetera de cuero de dos hojas, con lugar para billetes y tarjetas. Con el uso el cuero toma color.',
    cuidado: 'Limpiala con un paño seco. Evitá que se moje.',
  },
  {
    id: 'montura', nombre: 'Montura a medida', marca: '', cat: 'talabarteria', precio: null, descuento: 0, stock: 1,
    img: 'images/p-montura.webp', alt: 'Montura de cuero con estribo, sobre una matra roja en el lomo de un caballo',
    material: ['cuero'], rango: 9, alta: 20260901,
    desc: 'Montura de cuero que se hace a medida del caballo y del jinete. Escribinos con lo que necesitás y te pasamos precio y plazo.',
    cuidado: 'Engrasá el cuero cada tanto y guardala bajo techo, lejos de la humedad.',
  },
  {
    id: 'neceser', nombre: 'Neceser de cuero', marca: '', cat: 'marroquineria', precio: 58000, descuento: 0, stock: 7,
    img: 'images/p-neceser.webp', alt: 'Neceser de cuero color suela con cierre metálico y manija lateral',
    material: ['cuero'], rango: 10, alta: 20260915,
    desc: 'Neceser de cuero con cierre y manija lateral. Para el viaje o para regalar.',
    cuidado: 'Limpialo con un paño seco y nutrí el cuero cada tanto.',
  },
  {
    id: 'zapatos', nombre: 'Zapatos de cuero acordonados', marca: '', cat: 'calzado', precio: 165000, descuento: 0, stock: 5,
    img: 'images/p-zapatos.webp', alt: 'Par de zapatos de cuero color suela con cordones, sobre una piedra',
    material: ['cuero'], rango: 11, alta: 20260901,
    var: { tipo: 'Talle', opciones: ['39', '40', '41', '42', '43', '44', '45'] },
    desc: 'Zapatos de cuero con cordones y puntera lisa. Para vestir con bombacha o pantalón de vestir.',
    cuidado: 'Limpialos con un paño seco y nutrí el cuero con crema cada tanto.',
  },
  {
    id: 'pulover-camel', nombre: 'Pulóver de lana camel', marca: '', cat: 'indumentaria', precio: 79000, descuento: 0, stock: 3,
    img: 'images/p-pulover-camel.webp', alt: 'Pulóver tejido color camel junto a otro tejido crudo',
    material: ['lana'], rango: 12, alta: 20261012,
    var: { tipo: 'Talle', opciones: TALLES_ROPA },
    desc: 'Pulóver tejido en punto grueso, color camel. Holgado y abrigado.',
    cuidado: 'Lavalo a mano con agua fría y secalo en horizontal, a la sombra.',
  },
  {
    id: 'cartera-suela', nombre: 'Cartera de cuero suela', marca: '', cat: 'marroquineria', precio: 175000, descuento: 0, stock: 2,
    img: 'images/p-cartera-suela.webp', alt: 'Cartera de cuero color suela con manijas y herrajes',
    material: ['cuero'], rango: 13, alta: 20260901,
    desc: 'Cartera de cuero color suela con manijas firmes y herrajes metálicos.',
    cuidado: 'Limpiala con un paño seco y nutrí el cuero cada tanto. Evitá dejarla al sol.',
  },
  {
    id: 'portafolio-suela', nombre: 'Portafolio de cuero', marca: '', cat: 'marroquineria', precio: 210000, descuento: 0, stock: 2,
    img: 'images/p-portafolio-suela.webp', alt: 'Portafolio de cuero marrón con solapa y cierre metálico',
    material: ['cuero'], rango: 14, alta: 20260901,
    desc: 'Portafolio de cuero con solapa, cierre metálico y dos manijas. Entra una notebook y papeles.',
    cuidado: 'Limpialo con un paño seco y nutrí el cuero cada tanto.',
  },
  {
    id: 'monedero', nombre: 'Monedero de cuero', marca: '', cat: 'regaleria', precio: 24000, descuento: 0, stock: 20,
    img: 'images/p-monedero.webp', alt: 'Monedero de cuero color suela con tarjetas, sobre una mesa de madera clara',
    material: ['cuero'], rango: 15, alta: 20260901,
    desc: 'Monedero de cuero con cierre, para monedas y un par de tarjetas. Un regalo chico que dura.',
    cuidado: 'Limpialo con un paño seco. Evitá que se moje.',
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.precio == null ? null : p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const aMedida = p => p.precio == null;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261001;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const valor = p => (aMedida(p) ? Infinity : precioFinal(p));
  function coincide(p, f) {
    const cat = lista(f.cat), material = lista(f.material), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (material.length && !material.some(x => p.material.includes(x))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      if (aMedida(p)) return false;
      const [min, max] = PRECIOS[f.precio];
      const v = precioFinal(p);
      if (v < min || v > max) return false;
    }
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => valor(a) - valor(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => (aMedida(a) - aMedida(b)) || precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
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
      p.nombre, p.marca, catDe(p.cat)?.nombre, ...p.material.map(m => MATERIALES[m]), ...(p.var ? p.var.opciones.map(o => `talle ${o}`) : []), p.desc,
      aMedida(p) ? 'a medida encargo' : '', esNuevo(p) ? 'nuevo novedad' : '',
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

const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esM2 = () => document.body.dataset.modelo === '2';
const paginaCatalogo = () => (esM2() ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'estilopolo_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string').map(i => ({ id: i.id, v: typeof i.v === 'string' ? i.v : '', qty: Math.max(1, parseInt(i.qty, 10) || 1) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enOtras(items, id, v) { return items.filter(i => i.id === id && i.v !== v).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    if (aMedida(producto)) return false;
    const items = this.get();
    const max = Math.max(0, (producto.stock ?? 99) - this.enOtras(items, producto.id, v));
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (!max || (existing && existing.qty >= max)) return false;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return true;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id);
    const max = Math.max(1, (p?.stock ?? 99) - this.enOtras(items, id, v));
    it.qty = Math.max(1, Math.min(qty, max)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && !aMedida(p) ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false; const usados = {};
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      const varOk = p && (p.var ? p.var.opciones.includes(i.v) : i.v === '');
      if (!p || p.stock <= 0 || aMedida(p) || !varOk) { changed = true; return false; }
      const libre = p.stock - (usados[i.id] || 0);
      if (libre <= 0) { changed = true; return false; }
      if (i.qty > libre) { i.qty = libre; changed = true; }
      usados[i.id] = (usados[i.id] || 0) + i.qty;
      return true;
    });
    if (changed) this.save(filtered);
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICO_BOLSA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICO_FLECHA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};
const nombreConVar = (p, v) => (v ? `${p.nombre} (talle ${v})` : p.nombre);
const waProducto = (p, v = '') => wa(aMedida(p) ? `¡Hola Estilo Polo! Quiero consultar por una ${p.nombre.toLowerCase()}.` : `¡Hola Estilo Polo! Quiero consultar por ${nombreConVar(p, v)}.`);
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Estilo Polo! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;
const precioTexto = p => (aMedida(p) ? 'A medida' : formatearPrecio(precioFinal(p)));
const precioHTML = p => {
  if (aMedida(p)) return '<p class="precio precio--medida"><span>A medida</span><small>Precio a consultar</small></p>';
  if (p.descuento > 0) return `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">−${p.descuento}%</span></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
};
const metaDe = p => [p.marca, catDe(p.cat)?.nombre].filter(Boolean)[0] || '';

function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (!aMedida(p) && p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;

function accionesHTML(p, m2) {
  const tono = m2 ? 'btn--line' : 'btn--cta';
  if (aMedida(p)) return `<a class="btn ${tono} btn--sm prod-consultar" href="${waProducto(p)}" target="_blank" rel="noopener">${WSP_ICO}<span>Consultar</span></a>`;
  if (p.stock <= 0) return `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  if (p.var) return `<button type="button" class="btn ${tono} btn--sm prod-elegir" data-open="${p.id}">Elegir ${esc(p.var.tipo.toLowerCase())}</button>`;
  return `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn ${tono} btn--sm prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_BOLSA}<span class="prod-add__txt">Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
}

function cardHTML(p, { anim = 'subir', clase = '' } = {}) {
  const m2 = esM2();
  return `<article class="pcard${m2 ? ' pcard--m2' : ''}${clase ? ` ${clase}` : ''}" ${ANIM[anim] || ANIM.subir}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900">${m2 ? `<span class="pcard__etiqueta">${precioTexto(p)}</span>` : ''}</button>
    <div class="pcard__body">
      <p class="pcard__marca">${esc(metaDe(p))}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${m2 ? '' : precioHTML(p)}
      <div class="pcard__acc">${accionesHTML(p, m2)}</div>
    </div>
  </article>`;
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  const palabra = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : palabra(n);
  });
  document.querySelectorAll('[data-cuenta-mat]').forEach(el => {
    const n = Tienda.contar({ material: el.dataset.cuentaMat });
    el.textContent = el.closest('.chk') ? n : palabra(n);
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function enlaceGaleria(link, cat) {
  if (!link) return;
  link.href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
  link.querySelector('span').textContent = cat ? `Ver todo en ${catDe(cat).nombre.toLowerCase()}` : 'Ver todo el catálogo';
}

function initGaleria() {
  const root = document.querySelector('[data-galeria]');
  if (!root) return;
  const grid = root.querySelector('[data-gal-grid]');
  const tabs = [...root.querySelectorAll('[data-gal-cat]')];
  const link = root.querySelector('[data-gal-todo]');
  const pintar = (cat, animar) => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: 8 });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.galCat === cat)));
    enlaceGaleria(link, cat);
    if (animar) { revelarNuevos(grid); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-pressed') !== 'true') pintar(t.dataset.galCat, true); }));
  pintar('', false);
}

function visorHTML(p) {
  return `<figure class="visor__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900">${badgesHTML(p)}</figure>
    <div class="visor__info">
      <p class="pcard__marca">${esc([p.marca, catDe(p.cat)?.nombre].filter(Boolean).join(' · '))}</p>
      <h3 class="visor__nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      <p class="visor__desc">${esc(p.desc)}</p>
      <div class="pcard__acc">${accionesHTML(p, false)}</div>
      <button type="button" class="link-flecha visor__detalle" data-open="${p.id}">Ver detalle ${ICO_FLECHA}</button>
    </div>`;
}

function initVisor() {
  const root = document.querySelector('[data-visor]');
  if (!root) return;
  const vista = root.querySelector('[data-visor-vista]');
  const minis = root.querySelector('[data-visor-minis]');
  const tabs = [...root.querySelectorAll('[data-gal-cat]')];
  const link = root.querySelector('[data-gal-todo]');
  let items = [];
  const mostrar = (id, animar) => {
    const p = items.find(x => x.id === id) || items[0];
    if (!p) return;
    vista.innerHTML = visorHTML(p);
    minis.querySelectorAll('[data-visor-id]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.visorId === p.id)));
    if (animar && !reduceMotion) { vista.classList.remove('cambio'); void vista.offsetWidth; vista.classList.add('cambio'); }
  };
  const pintar = (cat, animar) => {
    items = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: 8 }).items;
    items.forEach(cachear);
    minis.innerHTML = items.map(p => `<li ${ANIM.escala}><button type="button" class="visor__mini" data-visor-id="${p.id}" aria-pressed="false" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="" width="900" height="900"><span>${esc(p.nombre)}</span></button></li>`).join('');
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.galCat === cat)));
    enlaceGaleria(link, cat);
    mostrar(items[0]?.id, animar);
    if (animar) { revelarNuevos(minis); refrescarST(); }
  };
  minis.addEventListener('click', e => { const b = e.target.closest('[data-visor-id]'); if (b) mostrar(b.dataset.visorId, true); });
  tabs.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-pressed') !== 'true') pintar(t.dataset.galCat, true); }));
  pintar('', false);
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function ahoraEnLobos() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia, min: parseInt(val('hour'), 10) * 60 + parseInt(val('minute'), 10) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
function estadoLocal({ dia, min }) {
  const abierto = HORARIO[dia].find(([a, c]) => min >= a && min < c);
  if (abierto) return { abierto: true, texto: `Abierto ahora · cierra a las ${hhmm(abierto[1])}` };
  const hoy = HORARIO[dia].find(([a]) => a > min);
  if (hoy) return { abierto: false, texto: `Cerrado · abre hoy a las ${hhmm(hoy[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d].length) return { abierto: false, texto: `Cerrado · abre ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${hhmm(HORARIO[d][0][0])}` };
  }
  return { abierto: false, texto: 'Cerrado' };
}
function initHorario() {
  const pills = document.querySelectorAll('[data-estado-local]');
  if (!pills.length) return;
  const pintar = () => {
    const ahora = ahoraEnLobos();
    const e = estadoLocal(ahora);
    pills.forEach(el => { el.textContent = e.texto; el.classList.toggle('estado--abierto', e.abierto); });
    document.querySelectorAll('[data-dias]').forEach(fila => {
      const dias = fila.dataset.dias.split(',').map(Number);
      fila.classList.toggle('hoy', dias.includes(ahora.dia));
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([LOCAL.lat, LOCAL.lng], 16);
  const subir = () => { if (el.closest('.mapa-wrap--ancho')) mapa.panBy([0, el.clientHeight * 0.22], { animate: false }); };
  subir();
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [30, 40], iconAnchor: [15, 40] });
  L.marker([LOCAL.lat, LOCAL.lng], { icon: icono, title: 'Estilo Polo, Moreno 152' }).addTo(mapa).bindPopup('<b>Estilo Polo</b><br>Moreno 152, Lobos');
  const ajustar = () => { mapa.invalidateSize(); mapa.setView([LOCAL.lat, LOCAL.lng], mapa.getZoom(), { animate: false }); subir(); };
  window.addEventListener('load', ajustar);
  setTimeout(ajustar, 1500);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const tituloBase = titulo?.textContent || '';
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), material: Object.keys(MATERIALES) };
  const estado = { cat: [], material: [], precio: '', stock: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.material = listaURL('material');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';

  const filtrosDe = () => ({ cat: estado.cat, material: estado.material, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.material.length) p.set('material', estado.material.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    document.querySelectorAll('#filtros input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    const n = estado.cat.length + estado.material.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    const unaCat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const unMat = !unaCat && estado.material.length === 1 ? MATERIALES[estado.material[0]] : '';
    const rotulo = unaCat ? unaCat.nombre : unMat ? `Productos de ${unMat.toLowerCase()}` : '';
    if (rotulo) {
      migaCat.hidden = false;
      migaCat.textContent = rotulo;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
    if (titulo) titulo.textContent = rotulo || tituloBase;
  };
  const palabra = n => (n === 1 ? 'producto' : 'productos');
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${palabra(mostrados)} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${palabra(total)}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], material: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p) {
  const v = esc(item.v);
  return `<div class="linea">
    <div class="linea__foto"><img src="${p.img}" alt="" width="900" height="900"></div>
    <div class="linea__txt"><p class="linea__nombre">${esc(p.nombre)}</p>${p.var ? `<p class="linea__var">${esc(p.var.tipo)}: ${v}</p>` : ''}</div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}" data-v="${v}"><button type="button" data-linea-step="-1" data-id="${p.id}" data-v="${v}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" data-v="${v}" aria-label="Sumar uno de ${esc(p.nombre)}">+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}" data-v="${v}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Estilo Polo! Vi la web y quiero consultar por sus productos.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${nombreConVar(p, i.v)} — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  return wa(`¡Hola Estilo Polo! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas]');
  let selector = null;
  if (enLineas && activo.dataset.id) {
    const clave = `[data-id="${CSS.escape(activo.dataset.id)}"][data-v="${CSS.escape(activo.dataset.v || '')}"]`;
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"]${clave}`;
  }
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Elegí un sombrero, un cinto o un mate y sumalo con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p)).join('');
    const pie = document.querySelector('[data-drawer-pie]');
    if (pie) pie.hidden = vacio;
    drawer.querySelectorAll('[data-stepper]').forEach(st => {
      const id = st.dataset.linea;
      const it = items.find(x => x.i.id === id && x.i.v === (st.dataset.v || ''));
      if (!it) return;
      const max = Math.max(1, it.p.stock - Cart.enOtras(Cart.get(), id, it.i.v));
      st.querySelector('input').max = max;
      st.querySelector('[data-linea-step="1"]').disabled = it.i.qty >= max;
    });
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (enLineas && drawer) {
    const destino = (selector && drawer.querySelector(selector)) || drawer.querySelector('button:not([disabled])') || document.querySelector('.drawer__cerrar');
    destino?.focus();
  }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], material: p.material, stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const variantes = p.var ? `<fieldset class="var" data-var><legend>${esc(p.var.tipo)}: <span data-var-elegido>elegí uno</span></legend><div class="var__ops">${p.var.opciones.map(o => `<label class="var__op"><input type="radio" name="qvVar" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div></fieldset>` : '';
  let comprar;
  if (aMedida(p)) comprar = `<div class="qv__comprar"><a class="btn btn--cta" href="${waProducto(p)}" target="_blank" rel="noopener" data-qv-wsp>${WSP_ICO}<span>Consultar precio y plazo</span></a></div>`;
  else if (p.stock > 0) comprar = `${variantes}<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">${ICO_BOLSA}<span class="prod-add__txt">Agregar al carrito</span></button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}</p>` : ''}`;
  else comprar = `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  const mats = p.material.map(m => `<span class="rasgo">${MATERIALES[m]}</span>`).join('');
  const cuidado = p.cuidado ? `<details class="qv__uso"><summary>Cuidado</summary><p>${esc(p.cuidado)}</p></details>` : '';
  const consulta = aMedida(p) ? '' : `<a class="link-wsp" href="${waProducto(p)}" target="_blank" rel="noopener" data-qv-wsp>${WSP_ICO}Consultar por WhatsApp</a>`;
  return `<figure class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"><figcaption>Foto ilustrativa</figcaption></figure>
  <div class="qv__info">
    <p class="pcard__marca">${esc([p.marca, cat?.nombre].filter(Boolean).join(' · '))}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="rasgos" aria-label="Materiales">${mats}</div>
    ${comprar}
    ${cuidado}
    ${consulta}
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="900" height="900"></span><b>${esc(r.nombre)}</b><small>${precioTexto(r)}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    const base = { '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, category: catDe(p.cat)?.nombre };
    if (p.marca) base.brand = { '@type': 'Brand', name: p.marca };
    if (!aMedida(p)) base.offers = { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' };
    ld.textContent = JSON.stringify(base);
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const v = t.dataset.v || '';
      const it = Cart.get().find(i => i.id === t.dataset.id && i.v === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar, t.dataset.v || '');
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0 || aMedida(p)) return;
    const caja = t.closest('.pcard, .qv__info, .visor__info');
    let v = '';
    if (p.var) {
      v = caja?.querySelector('input[name="qvVar"]:checked')?.value || '';
      if (!v) {
        const grupo = caja?.querySelector('[data-var]');
        if (!grupo) { abrirProducto(p.id, t); return; }
        grupo.classList.remove('falta'); void grupo.offsetWidth; grupo.classList.add('falta');
        grupo.querySelector('input')?.focus();
        showToast(`Elegí el ${p.var.tipo.toLowerCase()} antes de agregarlo`);
        return;
      }
    }
    const st = caja?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    if (!Cart.add(p, qty, v)) { showToast(`Ya tenés todas las unidades de ${p.nombre} en el carrito`); return; }
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${nombreConVar(p, v)} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const radio = e.target.closest('input[name="qvVar"]');
    if (radio) {
      const grupo = radio.closest('[data-var]');
      grupo.classList.remove('falta');
      const el = grupo.querySelector('[data-var-elegido]');
      if (el) el.textContent = radio.value;
      const p = getProducto(document.querySelector('.qv__info [data-add]')?.dataset.add);
      const link = document.querySelector('.qv__info [data-qv-wsp]');
      if (p && link) link.href = waProducto(p, radio.value);
      return;
    }
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, st.dataset.v || '', v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-regla', { scaleX: 0, duration: 1, clearProps: 'transform' }, 0.4);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-lema', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero__inset', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.55);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id);
}

Cart.syncStock();
[initCuentas, initNavDrop, initGaleria, initVisor, initCatalogo, renderCarrito, initReveals, initNav, initModelBarScroll, initFloats, updateCartBadge, initDelegacion, initHeroMotion, initHorario, initMapa, abrirDesdeURL].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
