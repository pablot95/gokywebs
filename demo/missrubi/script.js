const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492974577931';
const MARCA = 'Miss Rubi';
const POR_PAGINA = 16;
const CUOTAS = 3;
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
  { id: 'arriba', nombre: 'Blusas y tops', bajada: 'Blusas, tops de satén y remeras', img: 'images/p-top-saten.webp',
    texto: 'Blusas con volados, tops de satén y remeras de morley para combinar con todo.' },
  { id: 'pantalones', nombre: 'Pantalones', bajada: 'Jeans wide leg y sastreros', img: 'images/p-pantalon-sastrero.webp',
    texto: 'Jeans wide leg y pantalones sastreros de tiro alto, del 36 al 46.' },
  { id: 'vestidos', nombre: 'Vestidos y polleras', bajada: 'Largo midi, al cuerpo y con vuelo', img: 'images/p-pollera-midi.webp',
    texto: 'Vestidos y polleras midi para el día y para salir.' },
  { id: 'abrigos', nombre: 'Sacos y tejidos', bajada: 'Blazers y cárdigans livianos', img: 'images/p-cardigan-camel.webp',
    texto: 'Blazers de lino y cárdigans de punto para las mañanas frescas.' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro' }, { id: 'natural', nombre: 'Natural' }, { id: 'denim', nombre: 'Denim celeste' },
  { id: 'camel', nombre: 'Camel' }, { id: 'rosa', nombre: 'Rosa viejo' }, { id: 'blanco', nombre: 'Blanco' }, { id: 'oliva', nombre: 'Verde oliva' },
];
const T_LETRAS = ['S', 'M', 'L', 'XL'];
const T_NUMEROS = ['36', '38', '40', '42', '44', '46'];
const TALLES = [...T_LETRAS, ...T_NUMEROS];
const PRECIOS = [
  { id: 'hasta25', nombre: 'Hasta $25.000', min: null, max: 25000 },
  { id: '25a40', nombre: '$25.000 a $40.000', min: 25001, max: 40000 },
  { id: 'mas40', nombre: 'Más de $40.000', min: 40001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  arriba: 'blusa blusas top tops remera remeras musculosa camisa', pantalones: 'pantalon pantalones jean jeans wide leg sastrero',
  vestidos: 'vestido vestidos pollera polleras falda midi', abrigos: 'saco sacos blazer cardigan tejido tejidos abrigo',
  negro: 'negro negra', natural: 'natural crudo beige lino', denim: 'denim jean celeste azul', camel: 'camel marron beige',
  rosa: 'rosa rosado viejo', blanco: 'blanco blanca', oliva: 'oliva verde militar',
};

const Tienda = crearTienda([
  { id: 'blazer-lino-natural', nombre: 'Blazer de lino', cat: 'abrigos', color: 'natural', tela: 'Lino con viscosa',
    precio: 54900, descuento: 0, alta: 20, rango: 1,
    talles: { S: 2, M: 4, L: 3, XL: 1 }, img: 'images/p-blazer-lino.webp', escena: 'images/escena-blazer.webp',
    alt: 'Blazer de lino color natural con solapa, dos botones y bolsillos con tapa',
    desc: 'Solapa clásica, dos botones y bolsillos con tapa. Liviano y forrado: va con jean, con sastrero o sobre un vestido.' },
  { id: 'jean-wide-leg', nombre: 'Jean wide leg tiro alto', cat: 'pantalones', color: 'denim', tela: 'Denim rígido',
    precio: 38900, descuento: 0, alta: 22, rango: 2,
    talles: { 36: 2, 38: 4, 40: 5, 42: 3, 44: 2, 46: 1 }, img: 'images/p-jean-wide-leg.webp', escena: null,
    alt: 'Jean wide leg celeste de tiro alto con pierna ancha y recta',
    desc: 'Tiro alto, cinco bolsillos y pierna ancha que cae recta hasta el piso. Lavado celeste clásico.' },
  { id: 'blusa-clara-volados', nombre: 'Blusa clara con volados', cat: 'arriba', color: 'natural', tela: 'Algodón plisado',
    precio: 29900, descuento: 0, alta: 21, rango: 3,
    talles: { S: 3, M: 5, L: 4, XL: 0 }, img: 'images/p-blusa-clara.webp', escena: null,
    alt: 'Blusa clara de algodón con cuello con volado, botones y mangas globo, colgada en una percha',
    desc: 'Cuello con volado, botones al frente, manga globo con puño fruncido y una textura plisada que no se marca.' },
  { id: 'vestido-midi-negro', nombre: 'Vestido midi negro de breteles', cat: 'vestidos', color: 'negro', tela: 'Crepe con elastano',
    precio: 46900, descuento: 0, alta: 26, rango: 4, tag: 'Nuevo',
    talles: { S: 2, M: 3, L: 3, XL: 1 }, img: 'images/p-vestido-negro.webp', escena: 'images/hero-vestido.webp',
    alt: 'Vestido midi negro de breteles anchos y escote cuadrado sobre un maniquí',
    desc: 'Escote cuadrado, breteles anchos, cortes que marcan la cintura y un tajo al frente. Largo midi.' },
  { id: 'cardigan-camel', nombre: 'Cárdigan de punto camel', cat: 'abrigos', color: 'camel', tela: 'Punto de algodón',
    precio: 34900, descuento: 0, alta: 25, rango: 5, tag: 'Nuevo',
    talles: { S: 3, M: 4, L: 4, XL: 2 }, img: 'images/p-cardigan-camel.webp', escena: null,
    alt: 'Cárdigan camel de punto con escote en V y botones, doblado',
    desc: 'Escote en V, botones carey y puños acanalados. Abriga sin pesar: solo o sobre una remera.' },
  { id: 'pantalon-sastrero-negro', nombre: 'Pantalón sastrero negro', cat: 'pantalones', color: 'negro', tela: 'Gabardina con elastano',
    precio: 36900, descuento: 0, alta: 23, rango: 6,
    talles: { 36: 1, 38: 3, 40: 4, 42: 4, 44: 2, 46: 0 }, img: 'images/p-pantalon-sastrero.webp', escena: null,
    alt: 'Pantalón sastrero negro de tiro alto con pinzas y pierna recta',
    desc: 'Tiro alto, pinzas al frente y pierna recta con raya marcada. Del trabajo a la cena.' },
  { id: 'top-saten-rosa', nombre: 'Top de satén con breteles', cat: 'arriba', color: 'rosa', tela: 'Satén',
    precio: 24900, descuento: 15, alta: 24, rango: 7,
    talles: { S: 2, M: 3, L: 2, XL: 0 }, img: 'images/p-top-saten.webp', escena: null,
    alt: 'Top de satén rosa viejo con escote drapeado y breteles finos, colgado en una percha',
    desc: 'Escote drapeado, breteles finos regulables y caída suave. Solo, con blazer o debajo del cárdigan.' },
  { id: 'remera-morley-blanca', nombre: 'Remera de morley acanalada', cat: 'arriba', color: 'blanco', tela: 'Morley de algodón',
    precio: 15900, descuento: 0, alta: 19, rango: 8,
    talles: { S: 6, M: 8, L: 6, XL: 4 }, img: 'images/p-remera-morley.webp', escena: null,
    alt: 'Remera blanca de morley acanalado con cuello redondo, doblada',
    desc: 'Cuello redondo, manga corta y tejido acanalado que se adapta al cuerpo. El básico que va con todo.' },
  { id: 'pollera-midi-oliva', nombre: 'Pollera midi de lino oliva', cat: 'vestidos', color: 'oliva', tela: 'Lino',
    precio: 32900, descuento: 0, alta: 27, rango: 9, tag: 'Nuevo',
    talles: { S: 2, M: 4, L: 3, XL: 2 }, img: 'images/p-pollera-midi.webp', escena: null,
    alt: 'Pollera midi de lino verde oliva con vuelo, colgada en una percha',
    desc: 'Tiro alto, cintura lisa con cierre al costado y vuelo amplio hasta media pierna.' },

  { id: 'chaleco-proximo', nombre: 'Chaleco de sastrería', cat: 'abrigos', color: 'negro', tela: 'Gabardina',
    precio: 39900, descuento: 0, alta: 30, visible: false,
    talles: { S: 0, M: 0, L: 0 }, img: 'images/p-pantalon-sastrero.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
].map(p => ({ ...p, var: { tipo: 'Talle', ops: Object.keys(p.talles).sort((a, b) => TALLES.indexOf(a) - TALLES.indexOf(b)) }, stock: Object.values(p.talles).reduce((s, n) => s + n, 0) })), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, p.tela, ETIQUETAS[p.cat] || '', ETIQUETAS[p.color] || '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const conStock = (p, t) => (p.talles?.[t] || 0) > 0;

  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !talle.some(t => conStock(p, t))) return false;
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
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const quedan = items.length === lim && base.slice(i).some(p => coincideTexto(p, q));
    return { items: items.map(copia), cursor: quedan ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      Object.keys(p.talles || {}).forEach(t => { if (conStock(p, t)) talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
    });
    return { talles, colores };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const ELEGIDOS = ['blazer-lino-natural', 'jean-wide-leg', 'blusa-clara-volados'];
const LOOKS = [
  { id: 'lunes', dia: 'Lunes', corto: 'Lun', nombre: 'Oficina sin vueltas',
    texto: 'Blazer de lino sobre la remera de morley y el sastrero negro: prolijo de 9 a 18 y cómodo todo el día.',
    piezas: ['blazer-lino-natural', 'remera-morley-blanca', 'pantalon-sastrero-negro'] },
  { id: 'martes', dia: 'Martes', corto: 'Mar', nombre: 'Jean y blusa',
    texto: 'La blusa con volados levanta cualquier jean. Con el wide leg queda largo y liviano.',
    piezas: ['blusa-clara-volados', 'jean-wide-leg'] },
  { id: 'miercoles', dia: 'Miércoles', corto: 'Mié', nombre: 'Mañana fresca',
    texto: 'Cárdigan camel abierto sobre la remera blanca y el jean: abriga sin pesar.',
    piezas: ['cardigan-camel', 'remera-morley-blanca', 'jean-wide-leg'] },
  { id: 'jueves', dia: 'Jueves', corto: 'Jue', nombre: 'After office',
    texto: 'El top de satén con el sastrero negro va directo de la oficina a la salida.',
    piezas: ['top-saten-rosa', 'pantalon-sastrero-negro'] },
  { id: 'viernes', dia: 'Viernes', corto: 'Vie', nombre: 'Cena con amigas',
    texto: 'Vestido negro midi y el blazer de lino sobre los hombros, por si refresca a la salida.',
    piezas: ['vestido-midi-negro', 'blazer-lino-natural'] },
  { id: 'sabado', dia: 'Sábado', corto: 'Sáb', nombre: 'Paseo y mate',
    texto: 'Pollera midi oliva con la remera de morley y el cárdigan atado a la cintura.',
    piezas: ['pollera-midi-oliva', 'remera-morley-blanca', 'cardigan-camel'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const valorCuota = monto => Math.ceil(monto / CUOTAS);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const stockDe = (p, op) => (op ? p.talles?.[op] || 0 : p.stock);
const esPantalon = p => p.cat === 'pantalones';

const TABLA_ARRIBA = [
  { t: 'S', busto: '86-90', cintura: '66-70', cadera: '92-96' }, { t: 'M', busto: '90-94', cintura: '70-74', cadera: '96-100' },
  { t: 'L', busto: '94-100', cintura: '74-80', cadera: '100-106' }, { t: 'XL', busto: '100-106', cintura: '80-86', cadera: '106-112' },
];
const TABLA_PANTALON = [
  { t: '36', cintura: '64-67', cadera: '90-93' }, { t: '38', cintura: '68-71', cadera: '94-97' }, { t: '40', cintura: '72-75', cadera: '98-101' },
  { t: '42', cintura: '76-79', cadera: '102-105' }, { t: '44', cintura: '80-83', cadera: '106-109' }, { t: '46', cintura: '84-87', cadera: '110-113' },
];

const Cart = {
  KEY: 'missrubi_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const tope = stockDe(producto, op);
    if (tope <= 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, op, qty: Math.min(qty, tope) });
    this.save(items);
    return true;
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, op) : 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'missrubi_favs',
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
  percha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.6L3.4 15.2a1.4 1.4 0 0 0 .8 2.5h15.6a1.4 1.4 0 0 0 .8-2.5L12 9.1"/></svg>',
  cinta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v8H3z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${nombreDe(CATEGORIAS, p.cat)} · ${nombreDe(COLORES, p.color)}`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function cuotasHTML(monto) {
  return `<p class="cuotas">${CUOTAS} × <strong>${formatearPrecio(valorCuota(monto))}</strong> sin interés</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 8) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
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
  return `<span class="prod__talles" aria-hidden="true"><span class="prod__talles-tit">Talles</span>${p.var.ops.map(t => `<span${stockDe(p, t) ? '' : ' class="sin"'}>${esc(t)}</span>`).join('')}</span>`;
}
function opcionesTalle(p, elegido = '') {
  return `<option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}"${stockDe(p, o) ? '' : ' disabled'}${elegido === o ? ' selected' : ''}>${esc(o)}${stockDe(p, o) ? '' : ' · sin stock'}</option>`).join('')}`;
}
function selectTalleHTML(p) {
  return `<label class="var-sel"><span class="sr-only">Talle de ${esc(p.nombre)}</span><select data-op>${opcionesTalle(p)}</select></label>`;
}

function cardHTML(p, extra = '') {
  const nombre = esc(p.nombre);
  return `<article class="prod${extra ? ' ' + extra : ''}">
    <div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      ${cuotasHTML(precioFinal(p))}
      <div class="prod__acciones">${selectTalleHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function miniHTML(p) {
  return `<a class="mini" href="${urlProducto(p)}" data-qv="${p.id}">
    <span class="mini__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="400" height="400" decoding="async"></span>
    <div class="mini__txt"><span class="mini__nombre">${esc(p.nombre)}</span>${precioHTML(p)}${cuotasHTML(precioFinal(p))}<span class="mini__ver">Elegir talle${ICON.flecha}</span></div>
  </a>`;
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
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="60" height="60" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1"><span class="rombo" aria-hidden="true"></span>Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver toda la tienda ${ICON.flecha}</a></div>`;
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
  if (PAGINA === 'catalogo' && catActual) {
    document.querySelectorAll('.main-nav > a').forEach(a => {
      if (new URL(a.href, location.href).searchParams.get('cat') === catActual) a.setAttribute('aria-current', 'page');
    });
  }
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-m1__kicker'), { y: 18, opacity: 0, duration: 0.9 }, 0.36)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-m2__pagos > li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function initElegidos() {
  const lista = document.getElementById('elegidosLista');
  if (!lista) return;
  lista.innerHTML = Tienda.consultar({ filtros: { ids: ELEGIDOS }, orden: 'destacados', limite: 3 }).items
    .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, 'prod--centro')}</li>`).join('');
}
function initVitrina() {
  const box = document.getElementById('vitrina');
  if (!box) return;
  const pie = box.querySelector('.hero-m2__vitrina-pie');
  const html = Tienda.consultar({ filtros: { ids: ELEGIDOS }, orden: 'destacados', limite: 3 }).items
    .map(p => `<div class="mini-wrap" data-animate="der" style="opacity:0;transform:translateX(40px)">${miniHTML(p)}</div>`).join('');
  if (pie) pie.insertAdjacentHTML('beforebegin', html); else box.insertAdjacentHTML('beforeend', html);
}
function recienLlegado() {
  return Tienda.consultar({ filtros: { excluir: ELEGIDOS }, orden: 'nuevos', limite: 6 }).items;
}
function initNuevosGrid() {
  const grid = document.getElementById('nuevosGrid');
  if (!grid) return;
  grid.innerHTML = recienLlegado().map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
}

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  track.innerHTML = recienLlegado().map(p => `<li data-animate="der" style="opacity:0;transform:translateX(48px)">${cardHTML(p)}</li>`).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 18;
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('button, select, input')) return;
    pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) { matar = true; setTimeout(() => { matar = false; }, 0); }
    vp.classList.remove('dragging');
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
}

function initLooks() {
  const tabsBox = document.getElementById('looksTabs');
  const panel = document.getElementById('lookPanel');
  if (!tabsBox || !panel) return;
  const dia = new Date().getDay();
  const hoy = dia >= 1 && dia <= 6 ? dia - 1 : -1;
  const estado = { i: hoy >= 0 ? hoy : 0, talles: {} };
  tabsBox.innerHTML = LOOKS.map((l, k) => `<button type="button" class="looks__tab" role="tab" id="look-tab-${l.id}" aria-controls="lookPanel" aria-selected="${k === estado.i}" tabindex="${k === estado.i ? 0 : -1}">
      <span class="looks__tab-dia"><span class="tab-largo">${esc(l.dia)}</span></span>${k === hoy ? '<span class="looks__tab-hoy">Hoy</span>' : ''}</button>`).join('');
  const tabs = [...tabsBox.querySelectorAll('[role="tab"]')];

  const piezasDe = look => look.piezas.map(getProducto).filter(Boolean);
  const mensaje = look => {
    const ps = piezasDe(look).map(p => `${p.nombre}${estado.talles[p.id] ? ` (talle ${estado.talles[p.id]})` : ''}`);
    return `Hola ${MARCA}! Me gustó el look del ${look.dia.toLowerCase()} «${look.nombre}»: ${ps.join(', ')}. ¿Lo tienen disponible?`;
  };
  function render() {
    const look = LOOKS[estado.i];
    const piezas = piezasDe(look);
    const total = piezas.reduce((s, p) => s + precioFinal(p), 0);
    panel.setAttribute('aria-labelledby', `look-tab-${look.id}`);
    panel.innerHTML = `<div class="look">
      <div class="look__fotos look__fotos--${piezas.length}">${piezas.map(p => `<button type="button" class="look__foto" data-qv-abrir="${p.id}" aria-label="Ver el detalle: ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" decoding="async"></button>`).join('')}</div>
      <div class="look__info">
        <p class="eyebrow">${esc(look.dia)} · ${piezas.length} prendas</p>
        <h3 class="look__nombre">${esc(look.nombre)}</h3>
        <p class="look__texto">${esc(look.texto)}</p>
        <ul class="look__piezas">${piezas.map(p => `<li class="look__pieza">
          <p class="look__pieza-nombre">${esc(p.nombre)}</p>
          ${precioHTML(p)}
          <label class="var-sel"><span class="sr-only">Talle de ${esc(p.nombre)}</span><select data-look-talle="${p.id}">${opcionesTalle(p, estado.talles[p.id] || '')}</select></label>
        </li>`).join('')}</ul>
        <div class="look__total"><span>Total del look</span><strong>${formatearPrecio(total)}</strong>${cuotasHTML(total)}</div>
        <p class="look__aviso" id="lookAviso" aria-live="polite"></p>
        <div class="look__acciones">
          <button type="button" class="btn btn--cta" data-look-sumar>Sumar el look al carrito${ICON.carritoMas}</button>
          <a class="btn btn--line btn--wsp" data-look-wsp href="${wspHref(mensaje(look))}" target="_blank" rel="noopener">${ICON.wsp}Pedir el look por WhatsApp</a>
        </div>
      </div>
    </div>`;
    refrescarTriggers();
  }
  function elegir(k, foco) {
    estado.i = (k + LOOKS.length) % LOOKS.length;
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === estado.i)); t.tabIndex = j === estado.i ? 0 : -1; });
    render();
    if (foco) tabs[estado.i].focus();
  }
  tabsBox.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) elegir(tabs.indexOf(t));
  });
  tabsBox.addEventListener('keydown', e => {
    const k = tabs.indexOf(document.activeElement);
    if (k < 0) return;
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); elegir(k + 1, true); }
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); elegir(k - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); elegir(0, true); }
    else if (e.key === 'End') { e.preventDefault(); elegir(LOOKS.length - 1, true); }
  });
  panel.addEventListener('change', e => {
    const sel = e.target.closest('[data-look-talle]');
    if (!sel) return;
    estado.talles[sel.dataset.lookTalle] = sel.value;
    sel.removeAttribute('aria-invalid');
    const aviso = document.getElementById('lookAviso');
    if (aviso && !panel.querySelector('[data-look-talle][aria-invalid="true"]')) aviso.textContent = '';
    const a = panel.querySelector('[data-look-wsp]');
    if (a) a.href = wspHref(mensaje(LOOKS[estado.i]));
  });
  panel.addEventListener('click', e => {
    const btn = e.target.closest('[data-look-sumar]');
    if (!btn) return;
    const sels = [...panel.querySelectorAll('[data-look-talle]')];
    const faltan = sels.filter(s => !s.value);
    sels.forEach(s => (s.value ? s.removeAttribute('aria-invalid') : s.setAttribute('aria-invalid', 'true')));
    const aviso = document.getElementById('lookAviso');
    if (faltan.length) {
      if (aviso) aviso.textContent = faltan.length === sels.length ? 'Elegí el talle de cada prenda para sumar el look.' : `Te falta elegir el talle de ${faltan.length === 1 ? 'una prenda' : faltan.length + ' prendas'}.`;
      faltan[0].focus();
      return;
    }
    let n = 0;
    sels.forEach(s => { const p = getProducto(s.dataset.lookTalle); if (p && Cart.add(p, 1, s.value)) n++; });
    if (aviso) aviso.textContent = '';
    const look = LOOKS[estado.i];
    showToast(`Sumaste el look del ${look.dia.toLowerCase()} (${n} prendas) al carrito.`);
  });
  render();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const crear = () => {
    const centro = [-45.8648, -67.4806];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: '', html: '<span class="pin-rubi"></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
    L.marker(centro, { icon: icono, title: 'Miss Rubi, dirección a confirmar', keyboard: false }).addTo(mapa);
    setTimeout(() => mapa.invalidateSize(), 400);
    window.addEventListener('load', () => mapa.invalidateSize());
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(es => {
    if (es.some(x => x.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
}

const QV = { p: null, op: '', foto: 0, opener: null };
function guiaHTML(p) {
  const pant = esPantalon(p);
  const tabla = pant ? TABLA_PANTALON : TABLA_ARRIBA;
  const filas = tabla.filter(f => p.var.ops.includes(f.t)).map(f => `<tr${QV.op === f.t ? ' class="es-tuyo"' : ''}><th scope="row">${esc(f.t)}</th>${pant ? '' : `<td>${f.busto}</td>`}<td>${f.cintura}</td><td>${f.cadera}</td><td>${stockDe(p, f.t) ? stockDe(p, f.t) : 'Sin stock'}</td></tr>`).join('');
  return `<details class="qv__medidas">
    <summary>${ICON.cinta}Guía de talles</summary>
    <table><caption class="sr-only">Guía de talles de ${esc(p.nombre)}, medidas del cuerpo en centímetros</caption>
      <thead><tr><th scope="col">Talle</th>${pant ? '' : '<th scope="col">Busto</th>'}<th scope="col">Cintura</th><th scope="col">Cadera</th><th scope="col">Stock</th></tr></thead>
      <tbody>${filas}</tbody></table>
    <p>Medidas del cuerpo, en centímetros. Si estás entre dos talles, escribinos y te ayudamos a elegir.</p>
  </details>`;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto] || fotos[0];
  const forma = actual.src.includes('hero-vestido') ? ' qv__principal--alta' : actual.src.includes('escena') ? ' qv__principal--ancha' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual.src}" alt="${esc(actual.alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto de la prenda'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <div class="qv__pago">
          <p><span class="rombo" aria-hidden="true"></span><span><strong>${CUOTAS} cuotas sin interés</strong> de ${formatearPrecio(valorCuota(precioFinal(p)))}</span></p>
          <p><span class="rombo" aria-hidden="true"></span><span><strong>Descuento</strong> pagando por transferencia o en efectivo</span></p>
        </div>
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__ficha"><div><dt>Tela</dt><dd>${esc(p.tela)}</dd></div><div><dt>Color</dt><dd>${esc(nombreDe(COLORES, p.color))}</dd></div><div><dt>Categoría</dt><dd>${esc(cat?.nombre || '')}</dd></div></dl>
        <div>
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}"${stockDe(p, o) ? '' : ' disabled aria-label="Talle ' + esc(o) + ', sin stock"'}>${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>
        <div class="qv__compra">
          ${stepperHTML(QV.op ? stockDe(p, QV.op) : 1)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        ${guiaHTML(p)}
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>Más ${esc(cat?.nombre?.toLowerCase() || 'prendas')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, color: nombreDe(COLORES, p.color), material: p.tela,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p;
  QV.op = p.var.ops.includes(op) && stockDe(p, op) > 0 ? op : '';
  QV.foto = 0;
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
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      const abiertas = modal.querySelector('.qv__medidas')?.open;
      renderQV();
      const det = modal.querySelector('.qv__medidas');
      if (det && abiertas) det.open = true;
      modal.querySelector(`[data-qv-op="${window.CSS.escape(QV.op)}"]`)?.focus();
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (!QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarla al carrito.';
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (talle ${QV.op}) al carrito.`);
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
      <p class="linea__meta">${op ? `Talle ${esc(op)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(stockDe(p, op), i.qty)}
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
    items.innerHTML = `<div class="drawer__vacio">${ICON.percha}<p>Tu carrito está vacío. Hay blusas, jeans y vestidos esperando tu talle.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const pago = document.getElementById('cartPago');
  if (pago) pago.innerHTML = `o ${CUOTAS} cuotas sin interés de <strong>${formatearPrecio(valorCuota(total))}</strong> · con descuento por transferencia o efectivo`;
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (talle ${i.op})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, '¿Me pasan el precio con transferencia o efectivo?'].join('\n');
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
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
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
    if (abrir) {
      const sel = document.querySelector(`[data-look-talle="${window.CSS.escape(abrir.dataset.qvAbrir)}"]`);
      abrirQV(abrir.dataset.qvAbrir, abrir, sel?.value || '');
      return;
    }
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
      const op = add.closest('.prod__acciones')?.querySelector('[data-op]')?.value || '';
      if (!op) { abrirQV(p.id, add); return; }
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre} (talle ${op}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const op = comprar.closest('.prod__body')?.querySelector('[data-op]')?.value || '';
      if (!op) { abrirQV(p.id, comprar); return; }
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
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const compatibles = () => {
    const f = Tienda.facetas(e.cat ? { cat: e.cat } : {});
    e.talle = e.talle.filter(t => f.talles[t]);
  };
  compatibles();

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
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  const chipTalle = t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const letras = T_LETRAS.filter(t => fac.talles[t]);
    const numeros = T_NUMEROS.filter(t => fac.talles[t]);
    if (letras.length || numeros.length) grupos.push(`<fieldset class="f-grupo"><legend>Talle con stock</legend>
      ${letras.length ? `<p class="f-sub">Blusas, vestidos, polleras y sacos</p><div class="f-talles">${letras.map(chipTalle).join('')}</div>` : ''}
      ${numeros.length ? `<p class="f-sub">Pantalones</p><div class="f-talles">${numeros.map(chipTalle).join('')}</div>` : ''}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const titulo = cat ? cat.nombre : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.talle.length ? 'En tu talle' : e.orden === 'nuevos' ? 'Recién llegado' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.oferta ? 'Prendas con descuento, mientras haya talle.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : e.talle.length ? `Prendas con stock en talle ${e.talle.join(' y ')}.` : 'Blusas, pantalones, vestidos, polleras, sacos y tejidos. Elegís tu talle, lo sumás al carrito y pagás en 3 cuotas sin interés.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else if (id) a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'color', 'talle', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una prenda y aparece acá.'
      : 'No encontramos prendas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
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
    if (grupo === 'cat') { e.cat = inp.value; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
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
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.color = []; e.talle = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-todo, .cats-oferta, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
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
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
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
  requestAnimationFrame(() => { form.style.transition = ''; });
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

[initCatsMenu, initElegidos, initVitrina, initRail, initNuevosGrid, initLooks, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initMapa, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
