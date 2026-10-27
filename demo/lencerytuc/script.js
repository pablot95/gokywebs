const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493815024671';
const MARCA = 'Lencery Tuc';
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
  { id: 'conjuntos', nombre: 'Conjuntos', bajada: 'Encaje, algodón y bralettes', img: 'images/p-conjunto-encaje-negro.webp',
    texto: 'Corpiño y bombacha al tono: de encaje con aro, bralette sin aro o de algodón para todos los días.', subs: [] },
  { id: 'corpinos', nombre: 'Corpiños y bombachas', bajada: 'Soft, lisos y packs', img: 'images/p-corpino-soft-nude.webp',
    texto: 'Corpiños soft que no se notan debajo de la ropa y bombachas de algodón en pack.',
    subs: [{ id: 'corpinos', nombre: 'Corpiños' }, { id: 'bombachas', nombre: 'Bombachas' }] },
  { id: 'camisolines', nombre: 'Camisolines', bajada: 'Satén con encaje', img: 'images/p-camisolin-negro.webp',
    texto: 'Camisolín de satén con encaje y su short al tono, en negro y bordó.', subs: [] },
  { id: 'pijamas', nombre: 'Pijamas', bajada: 'Satén, corto y largo', img: 'images/p-pijama-azul.webp',
    texto: 'Pijamas de satén con camisa de solapa: corto para el calor, largo para el invierno.', subs: [] },
];
const MOMENTOS = [
  { id: 'diario', num: '01', nombre: 'Todos los días', frase: 'Algodón y soft que no se notan',
    texto: 'Lo que te ponés a la mañana y te olvidás que lo tenés puesto: algodón, taza lisa y bombachas que no marcan.',
    piezas: ['conjunto-algodon-rosa', 'corpino-soft-nude', 'pack-bombachas', 'bralette-encaje-marfil'] },
  { id: 'noche', num: '02', nombre: 'Una noche especial', frase: 'Encaje y satén',
    texto: 'Encaje negro, camisolines de satén y el bralette marfil, para regalarte o para regalar.',
    piezas: ['conjunto-encaje-negro', 'camisolin-negro', 'camisolin-bordo', 'bralette-encaje-marfil'] },
  { id: 'descanso', num: '03', nombre: 'Para dormir', frase: 'Satén fresco de la cama al desayuno',
    texto: 'Pijamas de satén con camisa de solapa y el camisolín con short, que también sirve para dormir.',
    piezas: ['pijama-saten-marfil', 'pijama-saten-azul', 'camisolin-bordo'] },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro' }, { id: 'marfil', nombre: 'Marfil' }, { id: 'rosa', nombre: 'Rosa' }, { id: 'nude', nombre: 'Nude' },
  { id: 'bordo', nombre: 'Bordó' }, { id: 'azul', nombre: 'Azul noche' }, { id: 'surtido', nombre: 'Surtido' },
];
const LETRAS = ['S', 'M', 'L', 'XL', 'XXL'];
const CORPINO = ['85', '90', '95', '100', '105'];
const TALLES = [...LETRAS, ...CORPINO];
const PRECIOS = [
  { id: 'hasta25', nombre: 'Hasta $25.000', min: null, max: 25000 },
  { id: '25a35', nombre: '$25.000 a $35.000', min: 25001, max: 35000 },
  { id: 'mas35', nombre: 'Más de $35.000', min: 35001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  conjuntos: 'conjunto conjuntos set corpino bombacha', corpinos: 'corpino corpinos sosten brasier bombacha bombachas culotte',
  bombachas: 'bombacha bombachas culotte vedetina colaless', camisolines: 'camisolin camisolines babydoll baby doll short lenceria',
  pijamas: 'pijama pijamas dormir camisa pantalon',
  diario: 'diario todos los dias comodo algodon', noche: 'noche especial regalo sexy', descanso: 'dormir descanso cama',
  negro: 'negro negra', marfil: 'marfil crema crudo blanco', rosa: 'rosa rosado', nude: 'nude piel beige',
  bordo: 'bordo vino borravino rojo', azul: 'azul marino noche', surtido: 'surtido colores negro blanco rosa',
};
const T_LETRAS = { tipo: 'Talle', ops: LETRAS };
const T_CORPINO = { tipo: 'Talle', ops: CORPINO };
const DESTACADAS = ['conjunto-encaje-negro', 'pijama-saten-marfil', 'camisolin-negro'];

const PRODUCTOS_BASE = [
  { id: 'conjunto-encaje-negro', corto: 'Conjunto de encaje', nombre: 'Conjunto de Encaje Negro con Aro', cat: 'conjuntos', sub: '', color: 'negro', precio: 34900, descuento: 0, stock: 8, alta: 24, rango: 1,
    var: T_CORPINO, agotados: ['105'], img: 'images/p-conjunto-encaje-negro.webp', extra: null,
    alt: 'Conjunto de encaje negro: corpiño con aro y culotte con encaje floral', desc: 'Corpiño con aro y taza de encaje floral, breteles regulables y moño al centro. Culotte de encaje al tono, de tiro medio.' },
  { id: 'pijama-saten-marfil', corto: 'Pijama de satén', nombre: 'Pijama de Satén Marfil Manga Corta', cat: 'pijamas', sub: '', color: 'marfil', precio: 39900, descuento: 0, stock: 6, alta: 26, rango: 2,
    var: T_LETRAS, agotados: [], img: 'images/p-pijama-marfil.webp', extra: { src: 'images/pijama-ancho.webp', ar: '16/9' },
    alt: 'Pijama de satén marfil: camisa de manga corta con solapa y short con moño', desc: 'Camisa de satén con cuello solapa, ribete al tono y bolsillo. Short con cintura elástica y moño para atar.' },
  { id: 'camisolin-negro', corto: 'Camisolín', nombre: 'Camisolín de Satén y Encaje Negro con Short', cat: 'camisolines', sub: '', color: 'negro', precio: 32900, descuento: 0, stock: 7, alta: 25, rango: 3,
    var: { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] }, agotados: [], img: 'images/p-camisolin-negro.webp', extra: { src: 'images/camisolin-alto.webp', ar: '9/16' },
    alt: 'Camisolín negro de satén con escote y ruedo de encaje, con short al tono', desc: 'Camisolín de satén con escote y ruedo de encaje de pestañas, breteles finos regulables y moño. Short al tono con laterales de encaje.' },
  { id: 'conjunto-algodon-rosa', corto: 'Conjunto de algodón', nombre: 'Conjunto de Algodón Rosa con Puntilla', cat: 'conjuntos', sub: '', color: 'rosa', precio: 21900, descuento: 0, stock: 12, alta: 22, rango: 4,
    var: { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] }, agotados: [], img: 'images/p-conjunto-algodon-rosa.webp', extra: null,
    alt: 'Conjunto de algodón rosa: bralette sin aro con puntilla y bombacha tiro alto', desc: 'Bralette de algodón sin aro con puntilla en el escote y bombacha tiro alto con laterales de encaje. Para usar todo el día.' },
  { id: 'camisolin-bordo', corto: 'Camisolín bordó', nombre: 'Camisolín de Satén Bordó con Short', cat: 'camisolines', sub: '', color: 'bordo', precio: 32900, descuento: 0, stock: 5, alta: 30, rango: 5, tag: 'Nuevo',
    var: { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] }, agotados: [], img: 'images/p-camisolin-bordo.webp', extra: null,
    alt: 'Camisolín de satén bordó con copas de encaje y short con puntilla', desc: 'Satén bordó con copas de encaje, moño al centro y breteles regulables. Short al tono con puntilla en el ruedo.' },
  { id: 'bralette-encaje-marfil', corto: 'Bralette de encaje', nombre: 'Conjunto Bralette de Encaje Marfil', cat: 'conjuntos', sub: '', color: 'marfil', precio: 27900, descuento: 0, stock: 9, alta: 28, rango: 6, tag: 'Nuevo',
    var: { tipo: 'Talle', ops: ['S', 'M', 'L'] }, agotados: [], img: 'images/p-bralette-marfil.webp', extra: null,
    alt: 'Conjunto de encaje marfil: bralette triangular sin aro y bombacha de encaje', desc: 'Bralette triangular de encaje sin aro, con base elástica y breteles finos. Bombacha de encaje al tono, liviana.' },
  { id: 'corpino-soft-nude', corto: 'Corpiño soft', nombre: 'Corpiño Soft Liso Nude', cat: 'corpinos', sub: 'corpinos', color: 'nude', precio: 23900, descuento: 0, stock: 14, alta: 21, rango: 7,
    var: T_CORPINO, agotados: [], img: 'images/p-corpino-soft-nude.webp', extra: null,
    alt: 'Corpiño soft liso color nude con taza moldeada y breteles regulables', desc: 'Taza moldeada lisa, sin costuras a la vista, y breteles regulables. No se nota debajo de la remera.' },
  { id: 'pack-bombachas', corto: 'Pack x3 bombachas', nombre: 'Pack x3 Bombachas de Algodón con Puntilla', cat: 'corpinos', sub: 'bombachas', color: 'surtido', precio: 15900, descuento: 0, stock: 20, alta: 23, rango: 8,
    var: T_LETRAS, agotados: [], img: 'images/p-pack-bombachas.webp', extra: null,
    alt: 'Tres bombachas de algodón con puntilla en negro, blanco y rosa', desc: 'Tres bombachas tiro alto de algodón con puntilla y moñito: una negra, una blanca y una rosa.' },
  { id: 'pijama-saten-azul', corto: 'Pijama largo', nombre: 'Pijama de Satén Azul Noche Manga Larga', cat: 'pijamas', sub: '', color: 'azul', precio: 46900, descuento: 0, stock: 4, alta: 27, rango: 9,
    var: T_LETRAS, agotados: ['S'], img: 'images/p-pijama-azul.webp', extra: null,
    alt: 'Pijama de satén azul noche: camisa de manga larga con solapa y pantalón largo', desc: 'Camisa de satén de manga larga con cuello solapa, ribete y bolsillo. Pantalón largo con cintura elástica y cordón.' },

  { id: 'body-encaje-proximo', corto: 'Body de encaje', nombre: 'Body de Encaje', cat: 'conjuntos', sub: '', color: 'negro', precio: 36900, descuento: 0, stock: 0, alta: 31, visible: false,
    var: T_LETRAS, agotados: [], img: 'images/p-conjunto-encaje-negro.webp', extra: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
];
PRODUCTOS_BASE.forEach(p => { p.momentos = MOMENTOS.filter(m => m.piezas.includes(p.id)).map(m => m.id); });

const Tienda = crearTienda(PRODUCTOS_BASE, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.corto, p.cat, p.sub, p.desc, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ETIQUETAS[p.color] || '', ...(p.momentos || []).map(m => ETIQUETAS[m] || m),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), momento = lista(f.momento), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (momento.length && !(p.momentos || []).some(m => momento.includes(m))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !(p.var?.ops || []).some(t => talle.includes(t) && !(p.agotados || []).includes(t))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden, q) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const palabras = q ? norm(q).split(/\s+/).filter(Boolean) : [];
    const rel = p => (palabras.every(w => norm(`${p.nombre} ${ETIQUETAS[p.cat] || ''}`).includes(w)) ? 0 : 1);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (palabras.length ? rel(a) - rel(b) : 0) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.q));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {}, momentos = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.var?.ops || []).forEach(t => { if (!(p.agotados || []).includes(t)) talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
      (p.momentos || []).forEach(m => { momentos[m] = (momentos[m] || 0) + 1; });
    });
    return { talles, colores, momentos };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
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
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const varTxt = (p, op) => `talle ${op}`;
const disponibles = p => (p.var?.ops || []).filter(t => !(p.agotados || []).includes(t));
const rangoTalles = p => {
  const ops = p.var?.ops || [];
  return ops.length > 1 ? `Talles ${ops[0]} a ${ops[ops.length - 1]}` : ops.length ? `Talle ${ops[0]}` : '';
};

const Cart = {
  KEY: 'lencerytuc_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'lencerytuc_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 4) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tallesHTML(p) {
  if (!p.var) return '';
  return `<span class="prod__talles" aria-hidden="true">${p.var.ops.map(t => `<span${(p.agotados || []).includes(t) ? ' class="is-agotado"' : ''}>${esc(t)}</span>`).join('')}</span>`;
}

function cardHTML(p, { compacta = false, grande = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async">`;
  const foto = `<a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}">
      ${media}
      <div class="prod__body">
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir talle y agregar: ${nombre}">${ICON.carritoMas}</button></div>
      </div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">Talle de ${nombre}</span><select data-op><option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}"${(p.agotados || []).includes(o) ? ' disabled' : ''}>${esc(o)}${(p.agotados || []).includes(o) ? ' · agotado' : ''}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      ${titulo}
      ${precioHTML(p)}
      <div class="prod-actions">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function destHTML(p) {
  return `<article class="dest">
    <span class="dest__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></span>
    <div class="dest__body">
      <h3 class="dest__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${esc(p.corto)}</a></h3>
      <span class="dest__regla" aria-hidden="true"></span>
      ${precioHTML(p)}
      <p class="dest__talles">${esc(rangoTalles(p))}</p>
      <button type="button" class="btn btn--cta btn--chico" data-qv-abrir="${p.id}">Ver producto${ICON.flecha}</button>
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        ${c.subs.length ? `<div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>` : ''}
      </div>`).join('') + '</div>'
      + `<div class="cats-momentos"><p class="cats-momentos__tit">Por momento</p>${MOMENTOS.map(m => `<a href="${CATALOGO_URL}?momento=${m.id}"><span>${m.num}</span>${esc(m.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, duration: 1.1 }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-alto'), { x: 48, y: 24, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, 0.35)
    .from(hero.querySelectorAll('.hero-sello, .indice li'), { y: 18, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top top', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(5 * s.progress).toFixed(2)}%`; },
    });
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const dest = document.getElementById('destacadasLista');
  if (dest) {
    dest.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADAS }, orden: 'destacados', limite: DESTACADAS.length }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${destHTML(p)}</li>`).join('');
  }
  const prev = document.getElementById('previewGrid');
  if (prev) {
    prev.innerHTML = Tienda.consultar({ filtros: { excluir: DESTACADAS }, orden: 'destacados', limite: 6 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p)}</li>`).join('');
  }
  const mos = document.getElementById('mosaicoGrid');
  if (mos) {
    mos.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 5 }).items
      .map((p, i) => `<li class="${i === 0 ? 'mosaico__grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p, { compacta: true, grande: i === 0 })}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-momento-n]').forEach(el => {
    const n = Tienda.contar({ momento: el.dataset.momentoN });
    el.textContent = `Ver ${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-total-tienda]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initIndice() {
  const box = document.querySelector('[data-indice]');
  const foto = document.getElementById('indiceFoto');
  if (!box || !foto) return;
  const capas = [...foto.querySelectorAll('img')];
  const base = capas[0]?.getAttribute('src');
  let activa = 0;
  const mostrar = src => {
    const actual = capas[activa];
    if (!src || actual.getAttribute('src') === src) return;
    const otra = capas[1 - activa];
    otra.src = src;
    otra.alt = '';
    otra.classList.add('is-on');
    actual.classList.remove('is-on');
    activa = 1 - activa;
  };
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 861px)');
  box.querySelectorAll('a[data-img]').forEach(a => {
    a.addEventListener('mouseenter', () => { if (hoverMq.matches) mostrar(a.dataset.img); });
    a.addEventListener('focus', () => mostrar(a.dataset.img));
  });
  box.addEventListener('mouseleave', () => { if (hoverMq.matches) mostrar(base); });
}

function initMomentos() {
  const grid = document.getElementById('momentoGrid');
  const panel = document.getElementById('momentoPanel');
  if (!grid || !panel) return;
  const box = grid.closest('.momentos');
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const frase = document.getElementById('momentoFrase');
  const texto = document.getElementById('momentoTexto');
  const ver = document.getElementById('momentoVer');
  const mostrar = (id, foco) => {
    const m = MOMENTOS.find(x => x.id === id) || MOMENTOS[0];
    tabs.forEach(t => {
      const on = t.dataset.momento === m.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', t.id); if (foco) t.focus(); }
    });
    const prods = Tienda.consultar({ filtros: { momento: m.id }, orden: 'destacados', limite: 4 }).items;
    frase.textContent = m.frase;
    texto.textContent = m.texto;
    grid.dataset.n = String(prods.length);
    grid.innerHTML = prods.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p, { compacta: true })}</li>`).join('');
    const n = Tienda.contar({ momento: m.id });
    ver.href = `${CATALOGO_URL}?momento=${m.id}`;
    ver.querySelector('b').textContent = `Ver los ${n} de «${m.nombre}»`;
    revelarNuevos(grid);
    refrescarTriggers();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) mostrar(t.dataset.momento);
  });
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    mostrar(tabs[j].dataset.momento, true);
  });
  mostrar(tabs[0]?.dataset.momento);
}

const TABLA_CORPINO = [
  { t: '85', hasta: 85 }, { t: '90', hasta: 90 }, { t: '95', hasta: 95 }, { t: '100', hasta: 100 }, { t: '105', hasta: 106 },
];
const TABLA_LETRAS = [
  { t: 'S', busto: 88, cadera: 94 }, { t: 'M', busto: 93, cadera: 99 }, { t: 'L', busto: 98, cadera: 104 },
  { t: 'XL', busto: 104, cadera: 110 }, { t: 'XXL', busto: 110, cadera: 118 },
];
function talleSugerido({ busto = 0, cadera = 0 } = {}) {
  if (!(busto > 0) && !(cadera > 0)) return null;
  let fuera = false;
  let corpino = null;
  if (busto > 0) {
    const i = TABLA_CORPINO.findIndex(f => busto <= f.hasta);
    if (i < 0) fuera = true;
    corpino = TABLA_CORPINO[i < 0 ? TABLA_CORPINO.length - 1 : i].t;
  }
  let idx = 0;
  [['busto', busto], ['cadera', cadera]].forEach(([k, v]) => {
    if (!(v > 0)) return;
    const i = TABLA_LETRAS.findIndex(f => v <= f[k]);
    if (i < 0) { fuera = true; idx = TABLA_LETRAS.length - 1; } else idx = Math.max(idx, i);
  });
  return { corpino, letra: TABLA_LETRAS[idx].t, fuera };
}
function initGuiaTalles() {
  const form = document.getElementById('guiaTalles');
  if (!form) return;
  const res = document.getElementById('guiaRes');
  const resCorpino = document.getElementById('guiaCorpino');
  const resLetra = document.getElementById('guiaLetra');
  const resTxt = document.getElementById('guiaTxt');
  const ver = document.getElementById('guiaVer');
  const wsp = document.getElementById('guiaWsp');
  const num = id => Number(String(document.getElementById(id)?.value || '').replace(',', '.')) || 0;
  const pintar = () => {
    const datos = { busto: num('guiaBusto'), cadera: num('guiaCadera') };
    const r = talleSugerido(datos);
    res.classList.toggle('is-listo', !!r);
    if (!r) {
      resCorpino.textContent = '—';
      resLetra.textContent = '—';
      resTxt.textContent = 'Cargá tu busto o tu cadera y te decimos qué talle pedir.';
      ver.hidden = true;
      wsp.href = wspHref(`Hola ${MARCA}! Quiero que me ayuden a elegir el talle.`);
      return;
    }
    const talles = [r.corpino, r.letra].filter(Boolean);
    const n = Tienda.contar({ talle: talles });
    resCorpino.textContent = r.corpino || 'Sumá tu busto';
    resLetra.textContent = r.letra;
    resTxt.textContent = r.fuera
      ? 'Alguna medida pasa la tabla. Escribinos y te decimos cómo calza cada modelo antes de comprar.'
      : `${n} ${n === 1 ? 'producto viene' : 'productos vienen'} en tu talle. Si estás entre dos, elegí el más grande.`;
    ver.hidden = !n || r.fuera;
    ver.href = `${CATALOGO_URL}?talle=${talles.join(',')}`;
    const medidas = [datos.busto && `busto ${datos.busto} cm`, datos.cadera && `cadera ${datos.cadera} cm`].filter(Boolean).join(' y ');
    wsp.href = wspHref(`Hola ${MARCA}! Según la guía soy ${r.corpino ? `corpiño ${r.corpino} y ` : ''}talle ${r.letra}, con ${medidas}. ¿Me lo confirman?`);
  };
  form.addEventListener('input', pintar);
  form.addEventListener('submit', e => { e.preventDefault(); pintar(); });
  pintar();
}

const QV = { p: null, op: '', foto: 0, opener: null };
function combinaCon(p) {
  let rel = Tienda.consultar({ filtros: { momento: p.momentos || [], excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  if (!rel.length) rel = Tienda.consultar({ filtros: { excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  return rel;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = combinaCon(p);
  const fotos = [{ src: p.img, alt: p.alt, ar: '1/1' }];
  if (p.extra) fotos.push({ src: p.extra.src, alt: `Otra vista: ${p.alt}`, ar: p.extra.ar });
  const f = fotos[QV.foto] || fotos[0];
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''}.`;
  const on = Favs.has(p.id);
  const agot = p.agotados || [];
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal" style="--ar:${f.ar}"><img src="${f.src}" alt="${esc(f.alt)}" width="1200" height="1200"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((x, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${x.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${conVar(p) ? `<div class="qv__talles">
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}"${agot.includes(o) ? ` disabled aria-label="Talle ${esc(o)} agotado"` : ''}>${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite">${agot.length ? `Sin stock en ${agot.join(', ')}.` : ''}</p>
          <a class="qv__guia" href="${HOME_URL}#talles">¿No sabés tu talle? Usá la guía</a>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar talle por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>Para combinar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.corto)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = disponibles(p).includes(op) ? op : ''; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (e.target.closest('.qv__guia') && PAGINA === 'home') { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (talle ${QV.op}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''} al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.bolsa}<p>Tu carrito está vacío. El conjunto de encaje y el pijama de satén te esperan con tu talle.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const acciones = add.closest('.prod-actions');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (talle ${op})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod-actions');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      Cart.add(p, 1, op);
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], momento: multi('momento', MOMENTOS), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let pagina = [], cursorSrv = null, agotado = false, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.momento.length) f.momento = e.momento;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat && subsDe(e.cat).length > 1) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    const tallaBox = arr => arr.filter(t => fac.talles[t]).map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('');
    const letras = tallaBox(LETRAS), nums = tallaBox(CORPINO);
    if (letras || nums) grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend>${letras ? `<div class="f-talles">${letras}</div>` : ''}${nums ? `<p class="f-nota">Corpiños con talle de contorno</p><div class="f-talles">${nums}</div>` : ''}</fieldset>`);
    const momentos = MOMENTOS.filter(m => fac.momentos[m.id]);
    if (momentos.length) grupos.push(`<fieldset class="f-grupo"><legend>Para qué</legend>
      ${momentos.map(m => opcion('checkbox', `momento-${m.id}`, m.id, esc(m.nombre), e.momento.includes(m.id), fac.momentos[m.id], 'momento')).join('')}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span><small>${fac.colores[c.id]}</small></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const momento = !cat && e.momento.length === 1 ? MOMENTOS.find(m => m.id === e.momento[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : momento ? momento.nombre : e.fav ? 'Tus favoritos' : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : momento ? momento.texto : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Conjuntos, corpiños, bombachas, camisolines y pijamas. Elegís tu talle y lo sumás al carrito.';
    document.title = `${titulo} — ${MARCA} · Lencería y ropa interior`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : momento ? momento.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : momento ? `${CATALOGO_URL}?momento=${momento.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.momento.length ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.momento.forEach(v => quitar.push(['momento', v, nombreDe(MOMENTOS, v)]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'momento', 'color', 'talle', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.momento.length) u.searchParams.set('momento', e.momento.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  const pedirPagina = () => {
    const r = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor: cursorSrv, limite: Tienda.TOPE });
    pagina = pagina.concat(r.items);
    cursorSrv = r.cursor;
    agotado = !r.cursor;
  };
  function pintar(reiniciar) {
    if (reiniciar) { pagina = []; cursorSrv = null; agotado = false; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    if (pagina.length - mostrados < POR_PAGINA && !agotado) pedirPagina();
    const nuevos = pagina.slice(mostrados, mostrados + POR_PAGINA);
    grid.insertAdjacentHTML('beforeend', nuevos.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p)}</li>`).join(''));
    mostrados += nuevos.length;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : 'No encontramos productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = mostrados >= pagina.length && agotado;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    if (!e.cat) e.sub = [];
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'fav') e.fav = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.momento = []; e.color = []; e.talle = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'fav') e.fav = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = []; e.momento = [];
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-momentos a, .cats-todo, .footer__col a');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.momento = (u.searchParams.get('momento') || '').split(',').filter(v => MOMENTOS.some(x => x.id === v));
    e.color = []; e.talle = []; e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  const enfocarBuscador = () => { if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60); };
  enfocarBuscador();
  window.addEventListener('hashchange', enfocarBuscador);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  form.style.transition = 'none';
  modo();
  void form.offsetWidth;
  form.style.transition = '';
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initMomentos, initGuiaTalles, initCatalogo, initReveals, initNav, initIndice, initHeroMotion, initParallax,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
