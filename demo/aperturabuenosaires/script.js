const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158174530';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'botas', nombre: 'Botas', img: 'images/bota-recoleta.webp' },
  { id: 'mocasines', nombre: 'Mocasines', img: 'images/mocasin-santafe-suela.webp' },
  { id: 'zapatos', nombre: 'Zapatos', img: 'images/oxford-ayacucho.webp' },
  { id: 'sandalias', nombre: 'Sandalias', img: 'images/sandalia-parana.webp' },
  { id: 'zapatillas', nombre: 'Zapatillas', img: 'images/zapatilla-riobamba.webp' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro', hex: '#1D1B1A' },
  { id: 'suela', nombre: 'Suela', hex: '#A0643A' },
  { id: 'marron', nombre: 'Marrón', hex: '#5A3826' },
  { id: 'bordo', nombre: 'Bordó', hex: '#5E1E25' },
  { id: 'rojo', nombre: 'Rojo', hex: '#A8302E' },
  { id: 'crema', nombre: 'Crema', hex: '#EDE5D3' },
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
];
const TACOS = [
  { id: 'plano', nombre: 'Plano (hasta 1 cm)' },
  { id: 'bajo', nombre: 'Bajo (2 a 3 cm)' },
  { id: 'medio', nombre: 'Medio (4 a 6 cm)' },
];
const TALLES = ['35', '36', '37', '38', '39', '40', '41'];
const PRECIOS = [
  { id: 'hasta120', nombre: 'Hasta $120.000', min: null, max: 120000 },
  { id: '120a160', nombre: '$120.000 a $160.000', min: 120001, max: 160000 },
  { id: 'mas160', nombre: 'Más de $160.000', min: 160001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  botas: 'bota botas botineta botinetas cana alta invierno', mocasines: 'mocasin mocasines loafer antifaz',
  zapatos: 'zapato zapatos balerina balerinas chatita oxford acordonado cordones destalonado guillermina', sandalias: 'sandalia sandalias verano tiras', zapatillas: 'zapatilla zapatillas urbana sneaker',
  negro: 'negro negra', suela: 'suela camel tostado', marron: 'marron chocolate', bordo: 'bordo vino', rojo: 'rojo roja colorado', crema: 'crema hueso beige', blanco: 'blanco blanca',
  plano: 'plano chato chata sin taco', bajo: 'taco bajo', medio: 'taco medio',
};

const Tienda = crearTienda([
  { id: 'bota-recoleta', nombre: 'Bota Recoleta', cat: 'botas', color: 'marron', taco: 'bajo', precio: 239000, descuento: 15, alta: 12, rango: 1,
    stock: { 35: 1, 36: 2, 37: 2, 38: 2, 39: 1, 40: 1 },
    img: 'images/bota-recoleta.webp', alt: 'Par de botas de caña alta de cuero marrón con cierre interno',
    galeria: [{ src: 'images/g-cierre.webp', alt: 'Caña de la Bota Recoleta con el cierre interno de punta a punta' }],
    desc: 'Bota de caña alta en cuero vacuno marrón, con cierre interno de punta a punta y forro de cuero vacuno. Taco de 3 cm para caminar todo el día.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '3 cm'], ['Cierre', 'Interno, de punta a punta']] },
  { id: 'balerina-montevideo', nombre: 'Balerina Montevideo', cat: 'zapatos', color: 'rojo', taco: 'plano', precio: 96000, descuento: 0, alta: 20, rango: 2,
    stock: { 35: 3, 36: 4, 37: 4, 38: 3, 39: 2, 40: 1 },
    img: 'images/balerina-montevideo.webp', alt: 'Par de balerinas de cuero rojo con moño de tiento',
    galeria: [{ src: 'images/g-mono.webp', alt: 'Moño de tiento de cuero de la Balerina Montevideo' }],
    desc: 'Balerina de cuero vacuno rojo con moño de tiento de cuero y forro de cuero vacuno. Punta redonda y taco de 1 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '1 cm'], ['Detalle', 'Moño de tiento']] },
  { id: 'mocasin-santafe-suela', nombre: 'Mocasín Santa Fe', variante: 'Suela', linea: 'santafe', cat: 'mocasines', color: 'suela', taco: 'bajo', precio: 128000, descuento: 0, alta: 18, rango: 3,
    stock: { 35: 2, 36: 4, 37: 5, 38: 4, 39: 3, 40: 2, 41: 1 },
    img: 'images/mocasin-santafe-suela.webp', alt: 'Par de mocasines de cuero color suela con antifaz y pespunte a la vista',
    galeria: [{ src: 'images/mocasin-santafe-suela-ancho.webp', alt: 'Mocasines Santa Fe color suela vistos de costado' }],
    desc: 'Mocasín de antifaz con pespunte a la vista, en cuero vacuno color suela y forrado en cuero vacuno. Taco de 2 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '2 cm'], ['Costura', 'Pespunte a la vista']] },
  { id: 'sandalia-parana', nombre: 'Sandalia Paraná', cat: 'sandalias', color: 'suela', taco: 'medio', precio: 112000, descuento: 0, alta: 26, rango: 4,
    stock: { 35: 2, 36: 3, 37: 0, 38: 3, 39: 2, 40: 1 },
    img: 'images/sandalia-parana.webp', alt: 'Par de sandalias de tiras cruzadas de cuero suela con taco ancho',
    galeria: [{ src: 'images/g-taco.webp', alt: 'Taco ancho de 6 cm de la Sandalia Paraná' }],
    desc: 'Sandalia de tiras cruzadas en cuero vacuno suela, con pulsera regulable con hebilla y taco ancho de 6 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Plantilla', 'Cuero vacuno'], ['Taco', '6 cm, ancho'], ['Pulsera', 'Con hebilla']] },
  { id: 'botineta-callao', nombre: 'Botineta Callao', cat: 'botas', color: 'negro', taco: 'medio', precio: 159000, descuento: 0, alta: 16, rango: 5,
    stock: { 35: 2, 36: 3, 37: 4, 38: 3, 39: 2, 40: 0 },
    img: 'images/botineta-callao.webp', imgAlta: 'images/botineta-callao-alta.webp', alt: 'Par de botinetas de cuero negro con cierre interno y taco de 5,5 cm',
    galeria: [{ src: 'images/botineta-callao-alta.webp', alt: 'Botinetas Callao enteras sobre un pedestal claro' }],
    desc: 'Botineta de cuero vacuno negro con cierre interno, forro de cuero vacuno y taco de 5,5 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '5,5 cm'], ['Cierre', 'Interno']] },
  { id: 'mocasin-santafe-negro', nombre: 'Mocasín Santa Fe', variante: 'Negro', linea: 'santafe', cat: 'mocasines', color: 'negro', taco: 'bajo', precio: 128000, descuento: 0, alta: 14, rango: 6,
    stock: { 35: 1, 36: 3, 37: 4, 38: 4, 39: 2, 40: 2, 41: 0 },
    img: 'images/mocasin-santafe-negro.webp', alt: 'Par de mocasines de cuero negro con antifaz y forro de cuero natural',
    galeria: [{ src: 'images/forro-detalle.webp', alt: 'El forro de cuero natural del Mocasín Santa Fe negro, visto de cerca' }],
    desc: 'Mocasín de antifaz con pespunte a la vista, en cuero vacuno negro y forrado en cuero vacuno. Taco de 2 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '2 cm'], ['Costura', 'Pespunte a la vista']] },
  { id: 'destalonado-pena', nombre: 'Destalonado Peña', cat: 'zapatos', color: 'crema', taco: 'medio', precio: 118000, descuento: 0, alta: 22, rango: 7,
    stock: { 35: 1, 36: 2, 37: 3, 38: 3, 39: 2, 40: 0 },
    img: 'images/destalonado-pena.webp', alt: 'Par de zapatos destalonados de cuero crema con pulsera de hebilla y taco ancho',
    galeria: [{ src: 'images/g-hebilla.webp', alt: 'Pulsera con hebilla del Destalonado Peña con el forro natural' }],
    desc: 'Zapato destalonado en cuero vacuno crema, con pulsera de hebilla al talón y taco de 4,5 cm. El forro natural asoma en la pulsera.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '4,5 cm'], ['Pulsera', 'Con hebilla']] },
  { id: 'oxford-ayacucho', nombre: 'Oxford Ayacucho', cat: 'zapatos', color: 'bordo', taco: 'bajo', precio: 134000, descuento: 0, alta: 10, rango: 8,
    stock: { 35: 2, 36: 2, 37: 3, 38: 3, 39: 2, 40: 2, 41: 1 },
    img: 'images/oxford-ayacucho.webp', alt: 'Par de zapatos acordonados de cuero bordó con puntera cosida',
    galeria: [{ src: 'images/g-cordones.webp', alt: 'Cordones y puntera cosida del Oxford Ayacucho' }],
    desc: 'Acordonado de cuero vacuno bordó, con puntera cosida y forro de cuero vacuno. Taco de 2,5 cm.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Taco', '2,5 cm'], ['Cierre', 'Cordones']] },
  { id: 'zapatilla-riobamba', nombre: 'Zapatilla Riobamba', cat: 'zapatillas', color: 'blanco', taco: 'plano', precio: 119000, descuento: 0, alta: 30, rango: 9, tag: 'nuevo',
    stock: { 35: 3, 36: 4, 37: 5, 38: 5, 39: 4, 40: 3, 41: 2 },
    img: 'images/zapatilla-riobamba.webp', alt: 'Par de zapatillas urbanas de cuero blanco con suela de goma',
    desc: 'Zapatilla urbana de cuero vacuno blanco, forrada en cuero vacuno, con suela de goma cosida.',
    datos: [['Capellada', 'Cuero vacuno'], ['Forro', 'Cuero vacuno'], ['Suela', 'Goma cosida'], ['Cierre', 'Cordones']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreEn = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.variante || '', p.desc, ETIQUETAS[p.cat] || '', nombreEn(CATEGORIAS, p.cat),
    ETIQUETAS[p.color] || '', nombreEn(COLORES, p.color), ETIQUETAS[p.taco] || '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const hayTalle = (p, talles) => talles.some(t => (Number(p.stock?.[t]) || 0) > 0);

  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), taco = lista(f.taco), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (taco.length && !taco.includes(p.taco)) return false;
    if (talle.length && !hayTalle(p, talle)) return false;
    if (f.linea && p.linea !== f.linea) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => `${a.nombre} ${a.variante || ''}`.localeCompare(`${b.nombre} ${b.variante || ''}`, 'es') || desempate(a, b);
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
    const candidatos = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = candidatos.findIndex(p => p.id === cursor);
      i = k < 0 ? candidatos.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q || !String(q).trim()) {
      items.push(...candidatos.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < candidatos.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < candidatos.length && items.length < lim) {
      const tanda = candidatos.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < candidatos.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const colorDe = id => COLORES.find(c => c.id === id) || { nombre: '', hex: '#ccc' };
const nombreDe = p => (p.variante ? `${p.nombre} · ${p.variante}` : p.nombre);
const stockDe = (p, t) => (p && p.stock ? Number(p.stock[t]) || 0 : 0);
const tallesDe = p => TALLES.filter(t => p.stock && t in p.stock);
const tallesConStock = p => tallesDe(p).filter(t => stockDe(p, t) > 0);
const rangoTalles = p => { const t = tallesConStock(p); return t.length ? (t.length === 1 ? t[0] : `${t[0]} al ${t[t.length - 1]}`) : 'agotado'; };
const modelos = n => `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const KEY_TALLE = 'aperturabsas_talle';
let tallePref = String(leer(KEY_TALLE, '') || '');

const ICO = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Cart = {
  KEY: 'aperturabsas_cart',
  get() {
    const a = leer(this.KEY, []);
    if (!Array.isArray(a)) return [];
    return a.filter(i => i && getProducto(i.id) && i.qty > 0 && stockDe(getProducto(i.id), String(i.t)) > 0)
      .map(i => ({ id: i.id, t: String(i.t), qty: Math.min(i.qty, stockDe(getProducto(i.id), String(i.t))) }));
  },
  save(items) {
    guardar(this.KEY, items.map(({ id, t, qty }) => ({ id, t, qty })));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, t, qty = 1) {
    const items = this.get();
    const max = stockDe(producto, t);
    if (!max) return false;
    const existing = items.find(i => i.id === producto.id && i.t === t);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, t, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) > antes;
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    it.qty = Math.max(1, Math.min(qty, stockDe(getProducto(it.id), it.t)));
    this.save(items);
  },
  maxDe(idx) { const it = this.get()[idx]; return it ? stockDe(getProducto(it.id), it.t) : 1; },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--desc">-${p.descuento}%</span>`;
  const total = tallesDe(p).reduce((s, t) => s + stockDe(p, t), 0);
  if (total <= 10) return '<span class="badge badge--ultimas">Últimos pares</span>';
  if (p.tag === 'nuevo') return '<span class="badge">Nuevo</span>';
  return '';
}
const ANIM_CARD = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';
function talleOptions(p) {
  const pref = tallePref && stockDe(p, tallePref) > 0 ? tallePref : '';
  return '<option value="">Talle</option>' + tallesDe(p).map(t => {
    const s = stockDe(p, t);
    return `<option value="${t}"${s ? '' : ' disabled'}${t === pref ? ' selected' : ''}>${t}${s ? '' : ' · agotado'}</option>`;
  }).join('');
}
function cardHTML(p, tipo = '', animar = true) {
  const nom = nombreDe(p);
  const alta = tipo === 'alta' && p.imgAlta;
  const src = alta ? p.imgAlta : p.img;
  const dims = alta ? 'width="900" height="1600"' : 'width="1200" height="1200"';
  return `<article class="card${tipo ? ` card--${tipo}` : ''}" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(nom)}">${badgeHTML(p)}<img src="${src}" ${dims} alt="${esc(p.alt)}" decoding="async"></button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)} · ${esc(colorDe(p.color).nombre)}</p>
      <h3 class="card__nombre">${esc(nom)}</h3>
      ${precioHTML(p)}
      <div class="prod-actions"><select class="talle-sel" data-talle-sel="${p.id}" aria-label="Talle de ${esc(nom)}">${talleOptions(p)}</select><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(nom)} al carrito">${ICO.carrito}<span class="prod-add__txt">Agregar</span></button></div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function vcardHTML(p, alta = false, animar = true) {
  const nom = nombreDe(p);
  const usarAlta = alta && p.imgAlta;
  const src = usarAlta ? p.imgAlta : p.img;
  const dims = usarAlta ? 'width="900" height="1600"' : 'width="1200" height="1200"';
  return `<article class="vcard${alta ? ' vcard--alta' : ''}" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(nom)}">${badgeHTML(p)}<img src="${src}" ${dims} alt="${esc(p.alt)}" decoding="async"></button>
    <div class="vcard__info">
      <h3 class="vcard__nombre">${esc(nom)}</h3>
      <p class="vcard__meta">${esc(colorDe(p.color).nombre)} · talles ${esc(rangoTalles(p))}</p>
      <p class="vcard__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <button type="button" class="vcard__add" data-quick="${p.id}" aria-label="Elegir talle de ${esc(nom)}">${ICO.carrito}</button>
    </div>
  </article>`;
}

let revealsListos = false;
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'scale' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__nota span, .etiqueta'), { y: 16, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}
function initSello() {
  const anillos = document.querySelectorAll('.sello__anillo');
  if (!anillos.length || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  anillos.forEach(a => gsap.to(a, { rotation: 240, svgOrigin: '60 60', ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 1.2 } }));
}
function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero [data-hero-img]');
  if (img) gsap.to(img, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
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
    nav.querySelector('.nav-drop__btn, a')?.focus();
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
  const lista = document.querySelector('[data-menu-categorias]');
  if (lista) {
    const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" width="44" height="44" alt=""><span class="nav-drop__nom">${esc(c.nombre)}</span><span class="nav-drop__cant">${n}</span></a></li>`;
    }).join('');
  }
  const drop = document.querySelector('[data-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const hover = window.matchMedia('(hover: hover) and (min-width: 961px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (hover.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (hover.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!drop.contains(e.target) && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(el, bd) {
  el.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); bd.classList.add('open'); }));
}
function cerrarCapa(el, bd, despues) {
  el.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => {
    el.hidden = true; bd.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open, .visor.open')) document.body.classList.remove('no-scroll');
    despues?.();
  }, 320);
}

const Drawer = {
  el: null, bd: null, origen: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const paso = e.target.closest('[data-linea-step]');
      if (paso) {
        const idx = Number(paso.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaStep));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const idx = Number(quitar.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        Cart.remove(idx);
        if (it) showToast(`Sacaste ${nombreDe(getProducto(it.id))} del carrito.`);
        this.el.querySelector('.drawer__cab button')?.focus();
        return;
      }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-catalogo]')) this.close();
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-cart]');
      if (b) { e.preventDefault(); this.open(b); }
    });
    this.render();
  },
  render() {
    if (!this.el) return;
    const body = this.el.querySelector('[data-lineas]');
    const foot = this.el.querySelector('[data-foot]');
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="carrito-vacio">${ICO.carrito}<h3>Tu carrito está vacío</h3><p>Elegí un modelo, marcá tu talle y sumalo: queda guardado acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}" data-ir-catalogo>Ver el catálogo</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map((it, idx) => {
      const p = getProducto(it.id);
      const max = Cart.maxDe(idx);
      return `<div class="linea" data-idx="${idx}" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <img src="${p.img}" width="72" height="72" alt="">
        <div><p class="linea__nom">${esc(nombreDe(p))}</p><p class="linea__op">Talle ${esc(it.t)} · ${esc(colorDe(p.color).nombre)}</p>
          <div class="linea__fila"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar un par"${it.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${it.qty}</output><button type="button" data-linea-step="1" aria-label="Sumar un par"${it.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="linea__quitar" data-quitar>Quitar</button></div></div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open(origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.render();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__cab button')?.focus(), 60);
  },
  close() {
    if (!this.el || !this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};
function openCartDrawer() { Drawer.open(); }

const Modal = {
  el: null, bd: null, origen: null, p: null, t: '', qty: 1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const mini = e.target.closest('[data-mini]');
      if (mini) {
        const img = this.el.querySelector('.vista__principal img');
        img.src = mini.dataset.mini; img.alt = mini.dataset.alt || '';
        this.el.querySelectorAll('[data-mini]').forEach(b => b.setAttribute('aria-pressed', String(b === mini)));
        return;
      }
      const talle = e.target.closest('[data-talle]');
      if (talle) { this.elegirTalle(talle.dataset.talle); return; }
      const paso = e.target.closest('[data-vstep]');
      if (paso) { this.qty += Number(paso.dataset.vstep); this.syncQty(); return; }
      if (e.target.closest('[data-vadd]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vahora]')) { this.agregar(true); return; }
      if (e.target.closest('[data-ir-guia]')) { this.close(false); return; }
      const rel = e.target.closest('[data-rel]');
      if (rel) this.mostrar(rel.dataset.rel, this.t);
    });
  },
  elegirTalle(t) {
    if (!this.p || !stockDe(this.p, t)) return;
    this.t = t;
    this.el.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === t)));
    const aviso = this.el.querySelector('[data-talle-aviso]');
    if (aviso) aviso.hidden = true;
    const info = this.el.querySelector('[data-talle-stock]');
    const s = stockDe(this.p, t);
    if (info) info.textContent = s <= 2 ? `Quedan ${s === 1 ? '1 par' : `${s} pares`} en talle ${t}.` : `Hay stock en talle ${t}.`;
    this.syncQty();
  },
  maximo() {
    if (!this.p || !this.t) return 1;
    const enCarrito = Cart.get().filter(i => i.id === this.p.id && i.t === this.t).reduce((s, i) => s + i.qty, 0);
    return Math.max(1, stockDe(this.p, this.t) - enCarrito);
  },
  syncQty() {
    const max = this.maximo();
    this.qty = Math.max(1, Math.min(this.qty, max));
    const out = this.el.querySelector('[data-vqty]');
    if (out) out.textContent = this.qty;
    const menos = this.el.querySelector('[data-vstep="-1"]'), mas = this.el.querySelector('[data-vstep="1"]');
    if (menos) menos.disabled = this.qty <= 1;
    if (mas) mas.disabled = this.qty >= max;
  },
  agregar(ahora) {
    const p = this.p;
    if (!p) return;
    if (!this.t) {
      const aviso = this.el.querySelector('[data-talle-aviso]');
      if (aviso) aviso.hidden = false;
      this.el.querySelector('[data-talle]:not([disabled])')?.focus();
      return;
    }
    const sumo = Cart.add(p, this.t, this.qty);
    if (ahora) {
      this.close(false);
      setTimeout(() => Drawer.open(this.origen), 340);
    } else {
      showToast(sumo ? `Sumaste ${nombreDe(p)} talle ${this.t} al carrito.` : `Ya tenés todos los pares que quedan en talle ${this.t}.`);
      this.syncQty();
    }
  },
  html(p) {
    const fotos = [{ src: p.img, alt: p.alt }, ...(p.galeria || [])];
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const hermanos = p.linea ? Tienda.consultar({ filtros: { linea: p.linea }, limite: 10 }).items : [];
    const color = colorDe(p.color);
    const msg = `Hola Apertura! Quiero consultar por el ${nombreDe(p)} que vi en la web.`;
    const coloresHTML = hermanos.length > 1
      ? `<div class="colores"><span>Color: <b>${esc(color.nombre)}</b></span>${hermanos.map(h => {
        const c = colorDe(h.color);
        return h.id === p.id ? `<span class="color-act" style="background:${c.hex}" title="${esc(c.nombre)}"></span>` : `<button type="button" data-rel="${h.id}" style="background:${c.hex}" aria-label="Ver en ${esc(c.nombre)}"></button>`;
      }).join('')}</div>`
      : `<div class="colores"><span>Color: <b>${esc(color.nombre)}</b></span></div>`;
    return `<div class="vista">
      <div class="vista__galeria">
        <div class="vista__principal"><img src="${fotos[0].src}" alt="${esc(fotos[0].alt)}" width="1200" height="1200"></div>
        ${fotos.length > 1 ? `<div class="vista__miniaturas">${fotos.map((f, i) => `<button type="button" data-mini="${f.src}" data-alt="${esc(f.alt)}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
      </div>
      <div class="vista__info">
        <p class="vista__cat">${esc(catDe(p.cat).nombre)} · cuero vacuno</p>
        <h2>${esc(nombreDe(p))}</h2>
        ${precioHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        ${coloresHTML}
        <fieldset class="talles"><legend>Elegí tu talle</legend><div class="talles__lista">${tallesDe(p).map(t => `<button type="button" data-talle="${t}" aria-pressed="false"${stockDe(p, t) ? '' : ' disabled aria-label="Talle ' + t + ' agotado"'}>${t}</button>`).join('')}</div><p class="talles__aviso" data-talle-aviso hidden>Elegí tu talle para sumarlo al carrito.</p><p class="talles__stock" data-talle-stock></p><a class="talles__guia" href="#guia" data-ir-guia>¿No sabés tu talle? Medí tu pie</a></fieldset>
        <div class="vista__compra">
          <div class="stepper"><button type="button" data-vstep="-1" aria-label="Restar un par">${ICO.menos}</button><output data-vqty aria-live="polite">1</output><button type="button" data-vstep="1" aria-label="Sumar un par">${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vadd>Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-vahora>Comprar ahora</button>
        </div>
        <dl class="vista__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <a class="link-wsp vista__wsp" href="${waLink(msg)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por este modelo</a>
        ${rel.length ? `<div class="relacionados"><h3>También te puede interesar</h3><div class="relacionados__lista">${rel.map(r => `<button type="button" data-rel="${r.id}"><img src="${r.img}" alt="" width="200" height="200">${esc(nombreDe(r))}</button>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  },
  mostrar(id, talle) {
    const p = getProducto(id);
    if (!p) return;
    this.p = p; this.t = ''; this.qty = 1;
    this.el.querySelector('[data-modal-cuerpo]').innerHTML = this.html(p);
    this.el.setAttribute('aria-label', `Detalle: ${nombreDe(p)}`);
    this.el.scrollTop = 0;
    const pref = [talle, tallePref].find(t => t && stockDe(p, t) > 0);
    if (pref) this.elegirTalle(pref);
    this.syncQty();
    const guia = this.el.querySelector('[data-ir-guia]');
    if (guia) guia.href = document.getElementById('guia') ? '#guia' : `${HOME_URL}#guia`;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', id); history.replaceState(null, '', u); }
  },
  open(id, origen, talle) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.mostrar(id, talle);
    if (!this.el.classList.contains('open')) abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
  },
  close(devolver = true) {
    if (!this.el || !this.el.classList.contains('open')) return;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); history.replaceState(null, '', u); }
    cerrarCapa(this.el, this.bd, () => { if (devolver) this.origen?.focus?.(); });
  },
};

function talleDeCard(el) {
  return el.closest('.card, .vcard')?.querySelector('[data-talle-sel]') || null;
}
function pedirTalle(sel) {
  if (!sel) return;
  sel.setAttribute('aria-invalid', 'true');
  sel.focus();
  showToast('Elegí tu talle para sumarlo al carrito.');
}
function initCardAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { Modal.open(quick.dataset.quick, quick, talleDeCard(quick)?.value || ''); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const sel = talleDeCard(add);
      if (!sel) { Modal.open(p.id, add); return; }
      if (!sel.value) { pedirTalle(sel); return; }
      const sumo = Cart.add(p, sel.value, 1);
      showToast(sumo ? `Sumaste ${nombreDe(p)} talle ${sel.value} al carrito.` : `Ya tenés todos los pares que quedan en talle ${sel.value}.`);
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      return;
    }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) {
      const p = getProducto(ahora.dataset.ahora);
      if (!p) return;
      const sel = talleDeCard(ahora);
      if (!sel || !sel.value) { pedirTalle(sel); return; }
      Cart.add(p, sel.value, 1);
      Drawer.open(ahora);
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle-sel]');
    if (sel) sel.removeAttribute('aria-invalid');
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

function initConteos() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = modelos(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-precio-de]').forEach(el => { const p = getProducto(el.dataset.precioDe); if (p) el.textContent = formatearPrecio(precioFinal(p)); });
}
function porIds(lista) {
  const ids = lista.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  const items = Tienda.consultar({ filtros: { ids }, limite: ids.length }).items;
  return ids.map(id => items.find(p => p.id === id)).filter(Boolean);
}
function initPreview() {
  const fichas = document.querySelector('[data-fichas]');
  if (fichas) fichas.innerHTML = porIds(fichas.dataset.fichas).map(p => cardHTML(p)).join('');
  const bento = document.querySelector('[data-bento]');
  if (bento) bento.innerHTML = porIds(bento.dataset.bento).map((p, i) => cardHTML(p, i === 0 ? 'alta' : 'fila')).join('');
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) mosaico.innerHTML = porIds(mosaico.dataset.mosaico).map((p, i) => vcardHTML(p, i === 0)).join('');
}

const GUIA_TALLES = [['35', 22.4, 23.0], ['36', 23.1, 23.6], ['37', 23.7, 24.3], ['38', 24.4, 25.0], ['39', 25.1, 25.6], ['40', 25.7, 26.3], ['41', 26.4, 27.0]];
function talleDePie(cm) {
  const v = Math.round(cm * 10) / 10;
  if (v < GUIA_TALLES[0][1]) return { fuera: 'menor', v };
  if (v > GUIA_TALLES[GUIA_TALLES.length - 1][2]) return { fuera: 'mayor', v };
  const i = GUIA_TALLES.findIndex(([, a, b]) => v >= a - 0.001 && v <= b + 0.001);
  const [t, a, b] = GUIA_TALLES[i];
  return { t, i, a, b, v };
}
function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const rango = g.querySelector('[data-guia-rango]');
  const valor = g.querySelector('[data-guia-valor]');
  const marca = g.querySelector('[data-guia-marca]');
  const celdas = [...g.querySelectorAll('[data-guia-regla] span')];
  const talleEl = g.querySelector('[data-guia-talle]');
  const titulo = g.querySelector('[data-guia-titulo]');
  const detalle = g.querySelector('[data-guia-detalle]');
  const lista = g.querySelector('[data-guia-modelos]');
  const linkCat = g.querySelector('[data-guia-catalogo]');
  const wsp = g.querySelector('[data-guia-wsp]');
  const catUrl = g.dataset.catalogoUrl || CATALOGO_URL;
  const num = (n, d = 1) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pintar = (guardarPref) => {
    const r = talleDePie(Number(rango.value));
    valor.textContent = `${num(r.v)} cm`;
    if (r.fuera) {
      celdas.forEach(c => c.classList.remove('on'));
      marca.style.left = r.fuera === 'menor' ? '0%' : '100%';
      talleEl.textContent = r.fuera === 'menor' ? '<35' : '>41';
      titulo.textContent = 'Tu pie queda fuera de la tabla';
      detalle.textContent = 'Trabajamos del 35 al 41: escribinos y te asesoramos.';
      lista.innerHTML = '';
      linkCat.href = catUrl;
      linkCat.firstChild.textContent = 'Ver todos los modelos ';
      wsp.href = waLink(`Hola Apertura! Medí mi pie y me dio ${num(r.v)} cm. ¿Tienen algo en mi talle?`);
      return;
    }
    celdas.forEach((c, k) => c.classList.toggle('on', k === r.i));
    const frac = Math.min(1, Math.max(0, (r.v - r.a + 0.05) / (r.b - r.a + 0.1)));
    marca.style.left = `${((r.i + frac) / GUIA_TALLES.length) * 100}%`;
    talleEl.textContent = r.t;
    titulo.textContent = `Tu talle es ${r.t}`;
    const total = Tienda.contar({ talle: [r.t] });
    detalle.textContent = `Pie de ${num(r.a)} a ${num(r.b)} cm · ${modelos(total)} con stock en tu talle`;
    const items = Tienda.consultar({ filtros: { talle: [r.t] }, limite: 4 }).items;
    lista.innerHTML = items.map(p => `<button type="button" class="guia__sumar" data-guia-sumar="${p.id}" data-talle="${r.t}"><img src="${p.img}" alt="" width="52" height="52"><span>${esc(nombreDe(p))}<small>Sumar talle ${r.t} · ${formatearPrecio(precioFinal(p))}</small></span></button>`).join('');
    linkCat.href = `${catUrl}?talle=${r.t}`;
    linkCat.firstChild.textContent = `Ver los ${modelos(total)} en talle ${r.t} `;
    wsp.href = waLink(`Hola Apertura! Medí mi pie: ${num(r.v)} cm (talle ${r.t} según la guía). ¿Me ayudan a elegir un modelo?`);
    if (guardarPref) {
      tallePref = r.t;
      guardar(KEY_TALLE, r.t);
      document.querySelectorAll('[data-talle-sel]').forEach(sel => {
        if (sel.value) return;
        const op = sel.querySelector(`option[value="${r.t}"]:not([disabled])`);
        if (op) sel.value = r.t;
      });
    }
  };
  rango.addEventListener('input', () => pintar(true));
  g.addEventListener('click', e => {
    const b = e.target.closest('[data-guia-paso]');
    if (b) {
      const v = Math.round((Number(rango.value) + Number(b.dataset.guiaPaso) / 10) * 10) / 10;
      rango.value = Math.min(Number(rango.max), Math.max(Number(rango.min), v));
      pintar(true);
      return;
    }
    const s = e.target.closest('[data-guia-sumar]');
    if (s) {
      const p = getProducto(s.dataset.guiaSumar);
      const sumo = Cart.add(p, s.dataset.talle, 1);
      showToast(sumo ? `Sumaste ${nombreDe(p)} talle ${s.dataset.talle} al carrito.` : `Ya tenés todos los pares que quedan en talle ${s.dataset.talle}.`);
    }
  });
  if (tallePref) {
    const fila = GUIA_TALLES.find(x => x[0] === tallePref);
    if (fila) rango.value = Math.round(((fila[1] + fila[2]) / 2) * 10) / 10;
  }
  pintar(false);
}

const Visor = {
  el: null, bd: null, img: null, cap: null, items: [], i: 0, origen: null,
  init() {
    this.el = document.getElementById('visor');
    this.bd = document.querySelector('[data-visor-bd]');
    if (!this.el || !this.bd) return;
    this.img = this.el.querySelector('[data-visor-img]');
    this.cap = this.el.querySelector('[data-visor-cap]');
    this.items = [...document.querySelectorAll('[data-galeria] [data-visor]')];
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-visor]');
      if (b && this.items.includes(b)) this.open(this.items.indexOf(b), b);
    });
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-visor-cerrar]')) { this.close(); return; }
      const p = e.target.closest('[data-visor-paso]');
      if (p) this.paso(Number(p.dataset.visorPaso));
    });
    this.el.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowRight') this.paso(1);
      else if (e.key === 'ArrowLeft') this.paso(-1);
      else atrapar(this.el, e);
    });
  },
  mostrar() {
    const b = this.items[this.i];
    if (!b) return;
    this.img.src = b.dataset.src;
    this.img.alt = b.querySelector('img')?.alt || '';
    this.cap.innerHTML = `<b>${esc(b.dataset.titulo)}</b>${esc(b.dataset.texto)}`;
  },
  paso(d) { const n = this.items.length; if (!n) return; this.i = (this.i + d + n) % n; this.mostrar(); },
  open(i, origen) {
    this.i = i; this.origen = origen;
    this.mostrar();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('[data-visor-cerrar]')?.focus(), 60);
  },
  close() {
    if (!this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    if (!track) return;
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
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
        try { vp.setPointerCapture?.(pointerId); } catch { }
      }
      if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
    });
    const end = () => {
      if (!down) return;
      down = false;
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 1.5, behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 1.5, behavior: reduceMotion ? 'auto' : 'smooth' }));
    const sync = () => {
      if (!prev || !next) return;
      prev.disabled = vp.scrollLeft <= 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const pos = [-34.5957158, -58.3926491];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(pos, 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', iconSize: [26, 26] });
  L.marker(pos, { icon: icono, keyboard: false, alt: 'Apertura, Av. Santa Fe 1751' }).addTo(mapa).bindTooltip('Apertura · Av. Santa Fe 1751', { direction: 'top', offset: [0, -16] });
  setTimeout(() => mapa.invalidateSize(), 500);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const buscador = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const contador = document.querySelector('[data-contador]');
  const verMas = document.querySelector('[data-ver-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const params = new URLSearchParams(location.search);
  const TALLES_OP = TALLES.map(t => ({ id: t, nombre: t }));
  const valida = (lista, v) => lista.some(x => x.id === v);
  const multiples = (clave, lista) => (params.get(clave) || '').split(',').filter(v => valida(lista, v));
  const estado = {
    cat: multiples('cat', CATEGORIAS),
    color: multiples('color', COLORES),
    taco: multiples('taco', TACOS),
    talle: multiples('talle', TALLES_OP),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
    q: (params.get('q') || '').slice(0, 60),
  };
  const GRUPOS = { cat: CATEGORIAS, color: COLORES, taco: TACOS };
  Object.entries(GRUPOS).forEach(([g, lista]) => {
    const cont = form.querySelector(`[data-ops="${g}"]`);
    if (!cont) return;
    cont.innerHTML = lista.map(x => `<label class="opcion"><input type="checkbox" data-f="${g}" value="${x.id}"${estado[g].includes(x.id) ? ' checked' : ''}>${g === 'color' ? `<span class="opcion__dot" style="background:${x.hex}"></span>` : ''} ${esc(x.nombre)} <small>${Tienda.contar({ [g]: x.id })}</small></label>`).join('');
  });
  const tallesCont = form.querySelector('[data-ops="talle"]');
  if (tallesCont) {
    tallesCont.innerHTML = TALLES.map(t => `<label class="talle-chip" title="${modelos(Tienda.contar({ talle: [t] }))} en talle ${t}"><input type="checkbox" data-f="talle" value="${t}"${estado.talle.includes(t) ? ' checked' : ''} aria-label="Talle ${t}"><span aria-hidden="true">${t}</span></label>`).join('');
  }
  const precioCont = form.querySelector('[data-ops="precio"]');
  if (precioCont) {
    precioCont.innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(x => `<label class="opcion"><input type="radio" name="precio" value="${x.id}"${estado.precio === x.id ? ' checked' : ''}> ${esc(x.nombre)}</label>`).join('');
  }
  if (ordenSel) ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === estado.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  if (buscador) buscador.value = estado.q;
  if (estado.talle.length === 1) tallePref = estado.talle[0];

  const filtros = () => {
    const f = { cat: estado.cat, color: estado.color, taco: estado.taco, talle: estado.talle };
    const pr = PRECIOS.find(x => x.id === estado.precio);
    if (pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    if (estado.q.trim()) f.q = estado.q.trim();
    return f;
  };
  const syncUrl = () => {
    const u = new URL(location.href);
    ['cat', 'color', 'taco', 'talle', 'precio', 'orden', 'q', 'buscar'].forEach(k => u.searchParams.delete(k));
    ['cat', 'color', 'taco', 'talle'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    if (estado.q.trim()) u.searchParams.set('q', estado.q.trim());
    history.replaceState(null, '', u);
  };
  let cursor = null, mostrados = 0;
  const pintarCard = p => (MODELO === '2' ? vcardHTML(p) : cardHTML(p));
  function render(reiniciar) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const r = Tienda.consultar({ filtros: f, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = r.cursor;
    mostrados += r.items.length;
    if (reiniciar && !r.items.length) {
      grid.innerHTML = `<div class="vacio"><h2>No hay modelos con esos filtros</h2><p>Probá con otra palabra o sacá algún filtro: el catálogo tiene ${modelos(Tienda.contar({}))}.</p><button type="button" class="btn btn--cta" data-limpiar>Ver todos los modelos</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', r.items.map(pintarCard).join(''));
    }
    const total = f.q ? null : Tienda.contar(f);
    if (contador) contador.textContent = total != null ? `${modelos(total)}${total !== Tienda.contar({}) ? ' con estos filtros' : ''}` : `${modelos(mostrados)}${cursor ? ' o más' : ''} para «${f.q}»`;
    if (verMas) verMas.hidden = !cursor;
    if (miga) {
      const una = estado.cat.length === 1 ? catDe(estado.cat[0]).nombre : '';
      miga.hidden = !una; miga.textContent = una;
    }
    document.querySelectorAll('[data-menu-categorias] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const sincronizarControles = () => {
    form.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador) buscador.value = estado.q;
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) estado[t.dataset.f] = [...form.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
    if (t.name === 'precio') estado.precio = t.value;
    syncUrl(); render(true);
  });
  form.addEventListener('submit', e => e.preventDefault());
  const limpiar = () => {
    estado.cat = []; estado.color = []; estado.taco = []; estado.talle = []; estado.precio = ''; estado.q = '';
    sincronizarControles(); syncUrl(); render(true);
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-limpiar]')) limpiar(); });
  if (ordenSel) ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; syncUrl(); render(true); });
  let t = 0;
  if (buscador) {
    buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); }, 250); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); });
  }
  if (verMas) verMas.querySelector('button')?.addEventListener('click', () => render(false));
  render(true);
  if (params.has('buscar') && buscador) setTimeout(() => buscador.focus(), 300);

  const panel = document.querySelector('.filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(min-width: 901px)');
  let bd = null;
  const cerrarPanel = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  if (abrirBtn && panel) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd);
    abrirBtn.addEventListener('click', () => {
      panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll');
      abrirBtn.setAttribute('aria-expanded', 'true');
      panel.querySelector('button, input')?.focus();
    });
    bd.addEventListener('click', cerrarPanel);
    panel.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarPanel(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPanel(); else if (panel.classList.contains('open')) atrapar(panel, e); });
  }
  const detalles = [...document.querySelectorAll('.filtro')];
  const ajustarDetalles = () => {
    const comoBarra = MODELO === '2' && mq.matches;
    detalles.forEach(d => { d.open = !comoBarra; });
    if (mq.matches) cerrarPanel();
  };
  ajustarDetalles();
  mq.addEventListener('change', ajustarDetalles);
  if (MODELO === '2') {
    detalles.forEach(d => d.addEventListener('toggle', () => { if (d.open && mq.matches) detalles.forEach(o => { if (o !== d) o.open = false; }); }));
    document.addEventListener('click', e => { if (mq.matches && !e.target.closest('.filtro')) detalles.forEach(d => { d.open = false; }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mq.matches) detalles.forEach(d => { d.open = false; }); });
  }
}

function initBuscar() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    const input = document.getElementById('buscar');
    if (!input) return;
    e.preventDefault();
    input.scrollIntoView({ block: 'center' });
    input.focus();
  }));
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) Modal.open(id);
}

initMenuCategorias();
initConteos();
initPreview();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initHeroMotion();
initSello();
initParallax();
initLeeScroll();
initGuia();
initCardAcciones();
Drawer.init();
Modal.init();
Visor.init();
initRail();
initFloats();
updateCartBadge();
initBuscar();
abrirProductoDeUrl();
try { initMapa(); } catch (err) { }
