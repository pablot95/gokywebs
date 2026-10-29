const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491140574229';
const MARCA = 'essen_tir_lacocina';
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
  { id: 'cacerolas', nombre: 'Cacerolas', bajada: 'Redonda y con mango', img: 'images/p-cacerola-mango.webp',
    texto: 'Cacerolas redondas para guisos, salsas y arroces, de 16 a 28 cm.' },
  { id: 'sartenes', nombre: 'Sartenes', bajada: 'Clásica y honda con tapa', img: 'images/p-sarten-rosa.webp',
    texto: 'Sartenes para salteados, milanesas, bifes y huevos, de 20 a 28 cm.' },
  { id: 'cuadrada', nombre: 'Línea cuadrada', bajada: 'Cacerola, bifera y sartén doble', img: 'images/p-cacerola-cuadrada.webp',
    texto: 'Piezas cuadradas: más superficie para dorar, grillar y hacer tostados.' },
  { id: 'reposteria', nombre: 'Repostería y vapor', bajada: 'Budinera y vaporera', img: 'images/p-budinera.webp',
    texto: 'Budinera para tortas y budines, y vaporera que se apoya sobre tu cacerola.' },
];
const COLORES = [
  { id: 'terracota', nombre: 'Terracota', img: 'images/p-cacerola-cuadrada.webp', alt: 'Cacerola cuadrada color terracota con tapa' },
  { id: 'rosa', nombre: 'Rosa', img: 'images/p-cacerola-mango.webp', alt: 'Cacerola rosa con mango negro y tapa de vidrio' },
  { id: 'azul', nombre: 'Azul', img: 'images/p-bifera.webp', alt: 'Bifera grill azul noche con estrías' },
  { id: 'acero', nombre: 'Acero', img: 'images/p-vaporera.webp', alt: 'Vaporera de acero inoxidable con asas' },
];
const PRECIOS = [
  { id: 'hasta200', nombre: 'Hasta $200.000', min: null, max: 200000 },
  { id: '200a300', nombre: '$200.000 a $300.000', min: 200001, max: 300000 },
  { id: 'mas300', nombre: 'Más de $300.000', min: 300001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  cacerolas: 'cacerola cacerolas olla ollas', sartenes: 'sarten sartenes', cuadrada: 'cuadrada cuadrado linea cuadrada',
  reposteria: 'reposteria vapor torta tortas', terracota: 'terracota naranja ladrillo', rosa: 'rosa rosado',
  azul: 'azul marino noche pizarra', acero: 'acero inoxidable plateado metal',
};

const Tienda = crearTienda([
  { id: 'cacerola-redonda', nombre: 'Cacerola redonda', cat: 'cacerolas', color: 'terracota', material: 'Aluminio fundido',
    uso: 'Guisos, salsas y arroces', tags: 'olla guiso estofado puchero', rango: 1,
    img: 'images/p-cacerola-redonda.webp', extra: 'images/hero-cacerola-terracota.webp',
    alt: 'Cacerola redonda color terracota con tapa y perilla, sobre una mesada de mármol',
    desc: 'La cacerola de todos los días: tapa que cierra bien, asas firmes y paredes gruesas que reparten el calor parejo. Del fuego a la mesa.',
    medidas: [{ id: '20', nombre: '20 cm', cap: '2,5 L', precio: 289000, stock: 3 }, { id: '24', nombre: '24 cm', cap: '4,3 L', precio: 369000, stock: 5 }, { id: '28', nombre: '28 cm', cap: '7 L', precio: 459000, stock: 2 }] },
  { id: 'sarten', nombre: 'Sartén', cat: 'sartenes', color: 'rosa', material: 'Aluminio fundido',
    uso: 'Huevos, milanesas y salteados', tags: 'bife bifes milanesa huevo', rango: 2,
    img: 'images/p-sarten-rosa.webp', extra: null,
    alt: 'Sartén rosa con interior antiadherente negro y mango oscuro, sobre una mesada',
    desc: 'Antiadherente para cocinar con muy poco aceite y un mango largo y cómodo. Va bien para huevos, milanesas, bifes y verduras salteadas.',
    medidas: [{ id: '20', nombre: '20 cm', cap: '', precio: 169000, stock: 6 }, { id: '24', nombre: '24 cm', cap: '', precio: 199000, stock: 5 }, { id: '28', nombre: '28 cm', cap: '', precio: 239000, stock: 3 }] },
  { id: 'cacerola-cuadrada', nombre: 'Cacerola cuadrada', cat: 'cuadrada', color: 'terracota', material: 'Aluminio fundido',
    uso: 'Carnes, guisos y tortas', tags: 'olla pollo pastas bizcochuelo', rango: 3,
    img: 'images/p-cacerola-cuadrada.webp', extra: null,
    alt: 'Cacerola cuadrada color terracota con tapa y asas anchas, sobre una mesada',
    desc: 'Más superficie que una redonda de la misma medida: entra un pollo trozado o una tanda grande de verduras. Tapa con perilla y asas anchas.',
    medidas: [{ id: '22', nombre: '22 cm', cap: '3,5 L', precio: 339000, stock: 3 }, { id: '26', nombre: '26 cm', cap: '5,2 L', precio: 419000, stock: 2 }] },
  { id: 'sarten-honda', nombre: 'Sartén honda con tapa', cat: 'sartenes', color: 'azul', material: 'Aluminio fundido',
    uso: 'Salteados, risottos y salsas', tags: 'wok salteadora risotto', rango: 4,
    img: 'images/p-sarten-honda.webp', extra: 'images/sarten-azul-ancha.webp',
    alt: 'Sartén honda azul pizarra con interior claro y mango negro, sobre una mesada',
    desc: 'Paredes altas y tapa para cocinar con poco aceite y terminar la salsa en la misma sartén. El interior claro deja ver el dorado.',
    medidas: [{ id: '24', nombre: '24 cm', cap: '', precio: 249000, stock: 4 }, { id: '28', nombre: '28 cm', cap: '', precio: 299000, stock: 3 }] },
  { id: 'cacerola-mango', nombre: 'Cacerola con mango y tapa de vidrio', cat: 'cacerolas', color: 'rosa', material: 'Aluminio fundido',
    uso: 'Salsas, arroz y porciones chicas', tags: 'jarro olla chica leche', rango: 5,
    img: 'images/p-cacerola-mango.webp', extra: null,
    alt: 'Cacerola rosa con mango negro largo y tapa de vidrio, sobre una mesada',
    desc: 'Mango largo y tapa de vidrio para ver la cocción sin destapar. Ideal para salsas, arroz o para cocinar para una o dos personas.',
    medidas: [{ id: '16', nombre: '16 cm', cap: '1,5 L', precio: 199000, stock: 4 }, { id: '18', nombre: '18 cm', cap: '2 L', precio: 229000, stock: 3 }] },
  { id: 'bifera', nombre: 'Bifera grill', cat: 'cuadrada', color: 'azul', material: 'Aluminio fundido',
    uso: 'Carnes y verduras grilladas', tags: 'grill plancha parrilla bife churrasco', rango: 6,
    img: 'images/p-bifera.webp', extra: null,
    alt: 'Bifera grill cuadrada azul noche con estrías y mango negro, sobre una mesada',
    desc: 'Estrías marcadas para grillar carnes y verduras con las rayas de la parrilla, mientras la grasa queda abajo.',
    medidas: [{ id: '26', nombre: '26 cm', cap: '', precio: 259000, stock: 3 }] },
  { id: 'budinera', nombre: 'Budinera', cat: 'reposteria', color: 'terracota', material: 'Aluminio fundido',
    uso: 'Budines, roscas y tortas', tags: 'molde budin rosca torta', rango: 7,
    img: 'images/p-budinera.webp', extra: null,
    alt: 'Budinera color terracota con tubo central y bordes ondulados, sobre una mesada',
    desc: 'Molde con tubo central para que la masa se cocine pareja de punta a punta. El antiadherente ayuda a desmoldar entera.',
    medidas: [{ id: '24', nombre: '24 cm', cap: '', precio: 189000, stock: 4 }] },
  { id: 'sarten-doble', nombre: 'Sartén doble para tostados', cat: 'cuadrada', color: 'azul', material: 'Aluminio fundido',
    uso: 'Tostados, omelettes y panqueques', tags: 'sandwichera tostadora tostado panquequera omelette', rango: 8,
    img: 'images/p-sarten-doble.webp', extra: null,
    alt: 'Sartén doble cuadrada azul noche con bisagra y dos mangos, sobre una mesada',
    desc: 'Dos mitades unidas por una bisagra: se da vuelta entera sobre la hornalla. Tostados parejos y omelettes que no se rompen.',
    medidas: [{ id: 'u', nombre: 'Medida única', cap: '', precio: 219000, stock: 4 }] },
  { id: 'vaporera', nombre: 'Vaporera', cat: 'reposteria', color: 'acero', material: 'Acero inoxidable',
    uso: 'Verduras y pescados al vapor', tags: 'vapor verduras pescado', rango: 9,
    img: 'images/p-vaporera.webp', extra: null,
    alt: 'Vaporera de acero inoxidable con agujeros y dos asas, sobre una mesada',
    desc: 'Se apoya sobre tu cacerola: el vapor cocina las verduras y conservan su color. Asas laterales para levantarla sin quemarte.',
    medidas: [{ id: 'p24', nombre: 'Para 24 cm', cap: '', precio: 129000, stock: 4 }, { id: 'p28', nombre: 'Para 28 cm', cap: '', precio: 149000, stock: 2 }] },
].map(p => ({ ...p, stock: p.medidas.reduce((s, m) => s + m.stock, 0) })), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreEn = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, nombreEn(CATEGORIAS, p.cat), nombreEn(COLORES, p.color), p.desc, p.uso, p.material, p.tags,
    p.medidas.map(m => m.nombre).join(' '), ETIQUETAS[p.cat] || '', ETIQUETAS[p.color] || '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => Math.min(...p.medidas.map(m => m.precio));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
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
    const colores = {};
    visibles.forEach(p => { if (coincide(p, filtros)) colores[p.color] = (colores[p.color] || 0) + 1; });
    return { colores };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const GUIA = {
  guisos: { main: 'cacerola-redonda', medida: { 2: '20', 4: '24', 6: '28' }, comp: 'cacerola-mango', compMedida: { 2: '16', 4: '18', 6: '18' },
    porque: { 2: 'Con 20 cm hacés un guiso para dos y te queda algo para el táper.', 4: 'La de 24 cm es la medida de familia: entra un guiso para cuatro y sobra.', 6: 'Con 28 cm cocinás de una sola vez para cinco o más.' },
    compTxt: 'Para la salsa o el arroz de al lado' },
  plancha: { main: 'bifera', medida: { 2: '26', 4: '26', 6: '26' }, comp: 'sarten', compMedida: { 2: '20', 4: '24', 6: '28' },
    porque: { 2: 'Grillás carnes y verduras con las marcas de la parrilla, sin prender el fuego.', 4: 'Grillás carnes y verduras con las marcas de la parrilla, sin prender el fuego.', 6: 'Grillás por tandas con las marcas de la parrilla, y la sartén grande te ayuda con el resto.' },
    compTxt: 'Para la guarnición salteada' },
  salteados: { main: 'sarten', medida: { 2: '20', 4: '24', 6: '28' }, comp: 'sarten-honda', compMedida: { 2: '24', 4: '24', 6: '28' },
    porque: { 2: 'La de 20 cm es justa para dos milanesas o un salteado chico.', 4: 'Con 24 cm entran cuatro milanesas o un salteado para la familia.', 6: 'La de 28 cm te deja cocinar en una sola tanda para cinco o más.' },
    compTxt: 'Con paredes altas y tapa, para salsas y risottos' },
  tortas: { main: 'budinera', medida: { 2: '24', 4: '24', 6: '24' }, comp: 'cacerola-cuadrada', compMedida: { 2: '22', 4: '22', 6: '26' },
    porque: { 2: 'El tubo central hace que budines y roscas se cocinen parejos.', 4: 'El tubo central hace que budines y roscas se cocinen parejos.', 6: 'El tubo central hace que budines y roscas se cocinen parejos, aunque sean grandes.' },
    compTxt: 'Para bizcochuelos y tortas húmedas' },
  vapor: { main: 'vaporera', medida: { 2: 'p24', 4: 'p24', 6: 'p28' }, comp: 'cacerola-redonda', compMedida: { 2: '24', 4: '24', 6: '28' },
    porque: { 2: 'Se apoya sobre la cacerola: las verduras se cocinan al vapor y conservan su color.', 4: 'Se apoya sobre la cacerola: las verduras se cocinan al vapor y conservan su color.', 6: 'La de 28 cm te deja hacer verduras al vapor para toda la mesa.' },
    compTxt: 'La cacerola de la medida justa para la vaporera' },
  tostados: { main: 'sarten-doble', medida: { 2: 'u', 4: 'u', 6: 'u' }, comp: 'sarten', compMedida: { 2: '20', 4: '24', 6: '24' },
    porque: { 2: 'Se da vuelta entera: tostados parejos y omelettes que no se rompen.', 4: 'Se da vuelta entera: tostados parejos y omelettes que no se rompen.', 6: 'Se da vuelta entera: salen tostados parejos, uno atrás de otro.' },
    compTxt: 'Para huevos revueltos y panqueques' },
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const medidaDe = (p, op) => p?.medidas.find(m => m.id === op) || null;
const unica = p => p.medidas.length === 1;
const precioDe = (p, op) => medidaDe(p, op)?.precio ?? Math.min(...p.medidas.map(m => m.precio));
const desdeDe = p => Math.min(...p.medidas.map(m => m.precio));
const stockDe = (p, op) => (op ? medidaDe(p, op)?.stock || 0 : p.stock);
const medidaTxt = m => (m ? `${m.nombre}${m.cap ? ` · ${m.cap}` : ''}` : '');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'essentirlacocina_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const tope = stockDe(producto, op);
    if (!op || tope <= 0) return false;
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && medidaDe(p, i.op) ? s + precioDe(p, i.op) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'essentirlacocina_favs',
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
  tarjeta: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  olla: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${nombreDe(CATEGORIAS, p.cat)} · ${nombreDe(COLORES, p.color)}`;
}
function precioHTML(p, op = '') {
  const m = medidaDe(p, op);
  if (m || unica(p)) return `<p class="precio"><span class="precio__final">${formatearPrecio(precioDe(p, op))}</span></p>`;
  return `<p class="precio"><span class="precio__desde">Desde</span><span class="precio__final">${formatearPrecio(desdeDe(p))}</span></p>`;
}
function cuotasHTML() {
  return `<p class="cuotas">${ICON.tarjeta}Cuotas sin interés</p>`;
}
function badgesHTML(p) {
  return p.stock <= 3 ? '<span class="prod__badges"><span class="etiqueta etiqueta--clara">Últimas unidades</span></span>' : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function medidasChipHTML(p) {
  if (unica(p)) return '';
  return `<span class="prod__medidas" aria-hidden="true"><span class="prod__medidas-tit">Medidas</span>${p.medidas.map(m => esc(m.nombre)).join(' · ')}</span>`;
}
function opcionesMedida(p, elegido = '') {
  return `<option value="">Medida</option>${p.medidas.map(m => `<option value="${esc(m.id)}"${m.stock ? '' : ' disabled'}${elegido === m.id ? ' selected' : ''}>${esc(m.nombre)}${m.stock ? '' : ' · sin stock'}</option>`).join('')}`;
}
function selectMedidaHTML(p) {
  return `<label class="var-sel"><span class="sr-only">Medida de ${esc(p.nombre)}</span><select data-op="${p.id}">${opcionesMedida(p)}</select></label>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  return `<article class="prod">
    <div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>${badgesHTML(p)}${favHTML(p)}${medidasChipHTML(p)}</div>
    <div class="prod__body">
      <p class="prod__meta"><i class="dot--${p.color}" aria-hidden="true"></i>${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      ${cuotasHTML()}
      <div class="prod-actions">${unica(p) ? '' : selectMedidaHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="60" height="60" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-pie"><span class="cats-pie__nota">Envío sin costo a todo el país</span><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
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
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-m1__kicker, .hero-m2__kicker'), { y: 18, opacity: 0, duration: 0.9 }, 0.34)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.54)
    .from(hero.querySelectorAll('.beneficios > li'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
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

function initCatsGrid() {
  const ul = document.getElementById('catsGrid');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => {
    const n = Tienda.contar({ cat: c.id });
    return `<li data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="cat-card" href="${CATALOGO_URL}?cat=${c.id}">
      <span class="cat-card__foto"><img src="${c.img}" alt="" width="600" height="600" decoding="async"></span>
      <span class="cat-card__pie"><span><span class="cat-card__nombre">${esc(c.nombre)}</span><span class="cat-card__n">${n} ${n === 1 ? 'modelo' : 'modelos'} · ${esc(c.bajada.toLowerCase())}</span></span><span class="cat-card__ir">Ver ${ICON.flecha}</span></span>
    </a></li>`;
  }).join('');
}
function initColoresGrid() {
  const ul = document.getElementById('coloresGrid');
  if (!ul) return;
  ul.innerHTML = COLORES.map(c => {
    const n = Tienda.contar({ color: c.id });
    return `<li data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="color-tile" href="${CATALOGO_URL}?color=${c.id}">
      <img src="${c.img}" alt="${esc(c.alt)}" width="600" height="800" decoding="async">
      <span class="color-tile__txt"><span class="color-tile__nombre"><i class="dot--${c.id}" aria-hidden="true"></i>${esc(c.nombre)}</span><span class="color-tile__n">${n} ${n === 1 ? 'pieza' : 'piezas'}${ICON.flecha}</span></span>
    </a></li>`;
  }).join('');
}
function initElegidas() {
  const ul = document.getElementById('elegidasGrid');
  if (!ul) return;
  ul.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
    .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
}

function initGuia() {
  const form = document.getElementById('guiaForm');
  const box = document.getElementById('guiaResultado');
  if (!form || !box) return;
  const leer = () => {
    const valor = n => form.querySelector(`input[name="${n}"]:checked`)?.value;
    const personas = ['2', '4', '6'].includes(valor('personas')) ? valor('personas') : '4';
    const plato = GUIA[valor('plato')] ? valor('plato') : 'guisos';
    return { personas, plato };
  };
  const quienes = { 2: '1 o 2 personas', 4: '3 o 4 personas', 6: '5 o más' };
  let sugerencia = null;
  function render(animar) {
    const { personas, plato } = leer();
    const g = GUIA[plato];
    const p = getProducto(g.main), c = getProducto(g.comp);
    if (!p || !c) return;
    const op = g.medida[personas], opc = g.compMedida[personas];
    const m = medidaDe(p, op), mc = medidaDe(c, opc);
    sugerencia = { p, op, c, opc };
    const total = precioDe(p, op) + precioDe(c, opc);
    const msg = `Hola! Usé la guía de medidas de la web (cocino para ${quienes[personas]}). Me interesa: ${p.nombre} (${m?.nombre}) y ${c.nombre} (${mc?.nombre}). ¿Qué cuotas sin interés tengo con mi banco?`;
    box.innerHTML = `<div class="res${animar ? ' cambia' : ''}">
      <button type="button" class="res__foto" data-qv-abrir="${p.id}" data-op="${esc(op)}" aria-label="Ver el detalle: ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" decoding="async"></button>
      <div class="res__info">
        <p class="eyebrow">Te sugerimos</p>
        <h3 class="res__tit">${esc(p.nombre)}</h3>
        <span class="res__medida">${esc(medidaTxt(m))}</span>
        ${precioHTML(p, op)}
        <p class="res__porque">${esc(g.porque[personas])}</p>
        <div class="res__comp"><img src="${c.img}" alt="" width="128" height="128" decoding="async"><div class="res__comp-txt"><small>${esc(g.compTxt)}</small><strong>${esc(c.nombre)} · ${esc(mc?.nombre || '')}</strong></div>${precioHTML(c, opc)}</div>
        <div class="res__total"><span>Las dos, con envío sin costo</span><strong>${formatearPrecio(total)}</strong></div>
        <div class="res__acciones">
          <button type="button" class="btn btn--cta" data-guia-sumar>Sumar las dos al carrito${ICON.carritoMas}</button>
          <a class="btn btn--line btn--wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
        </div>
        <p class="res__nota">Sugerencia orientativa. Si dudás entre dos medidas, escribinos y te ayudamos.</p>
      </div>
    </div>`;
    refrescarTriggers();
  }
  form.addEventListener('change', () => render(true));
  box.addEventListener('click', e => {
    if (!e.target.closest('[data-guia-sumar]') || !sugerencia) return;
    const { p, op, c, opc } = sugerencia;
    const ok = [Cart.add(p, 1, op), Cart.add(c, 1, opc)].filter(Boolean).length;
    showToast(ok === 2 ? `Sumaste ${p.nombre} y ${c.nombre} al carrito.` : 'Una de las piezas no tiene stock en esa medida: escribinos y te ayudamos.');
  });
  render(false);
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.extra) fotos.push({ src: p.extra, alt: `Otra vista: ${p.alt}` });
  const m = medidaDe(p, QV.op);
  const msg = `Hola! Quiero consultar por ${p.nombre}${m ? ` (${m.nombre})` : ''}. ¿Qué cuotas sin interés tengo con mi banco?`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto] || fotos[0];
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${actual.src}" alt="${esc(actual.alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p, QV.op)}
        <div class="qv__pago">
          <p>${ICON.camion}<span><strong>Envío sin costo</strong> a todo el país</span></p>
          <p>${ICON.tarjeta}<span><strong>Cuotas sin interés</strong> con diferentes bancos: te confirmamos las vigentes</span></p>
        </div>
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__ficha"><div><dt>Material</dt><dd>${esc(p.material)}</dd></div><div><dt>Color</dt><dd>${esc(nombreDe(COLORES, p.color))}</dd></div><div><dt>Ideal para</dt><dd>${esc(p.uso)}</dd></div></dl>
        <div>
          <p class="f-grupo__titulo">Medida</p>
          <div class="qv__ops" role="group" aria-label="Elegí la medida">${p.medidas.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o.id)}" aria-pressed="${QV.op === o.id}"${o.stock ? '' : ` disabled aria-label="${esc(o.nombre)}, sin stock"`}>${esc(o.nombre)}${o.cap ? `<small>${esc(o.cap)}</small>` : ''}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>
        <div class="qv__compra">
          ${stepperHTML(QV.op ? stockDe(p, QV.op) : 1)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>Más ${esc(cat?.nombre?.toLowerCase() || 'productos')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${unica(r) ? '' : 'Desde '}${formatearPrecio(desdeDe(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) {
    const precios = p.medidas.map(x => x.precio);
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, color: nombreDe(COLORES, p.color), material: p.material,
      image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: 'Essen' },
      offers: precios.length > 1
        ? { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: Math.min(...precios), highPrice: Math.max(...precios), offerCount: precios.length, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
        : { '@type': 'Offer', priceCurrency: 'ARS', price: precios[0], availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  }
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p;
  QV.op = medidaDe(p, op) && stockDe(p, op) > 0 ? op : unica(p) && p.stock > 0 ? p.medidas[0].id : '';
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
      renderQV();
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
        if (aviso) aviso.textContent = 'Elegí la medida para sumarla al carrito.';
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (${medidaDe(p, QV.op)?.nombre}) al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  const m = medidaDe(p, i.op);
  if (!p || !m) return '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(i.op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(m.nombre)} · ${formatearPrecio(m.precio)} c/u</p>
      ${stepperHTML(m.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(m.precio * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => medidaDe(getProducto(i.id), i.op));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.olla}<p>Tu carrito está vacío. Hay cacerolas, sartenes y bifera esperando su medida.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola! Quiero hacer este pedido en ${MARCA}:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    const m = medidaDe(p, i.op);
    return `- ${i.qty} × ${p.nombre} (${m.nombre}): ${formatearPrecio(m.precio * i.qty)}`;
  }), `Total: ${formatearPrecio(total)} con envío sin costo`, '¿Qué cuotas sin interés tengo con mi banco?'].join('\n');
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
  document.addEventListener('change', e => {
    const sel = e.target.closest('.prod select[data-op]');
    if (!sel) return;
    const p = getProducto(sel.dataset.op);
    const precio = sel.closest('.prod')?.querySelector('.precio');
    if (p && precio) precio.outerHTML = precioHTML(p, sel.value);
    sel.removeAttribute('aria-invalid');
  });
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
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.op || ''); return; }
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
      const op = unica(p) ? p.medidas[0].id : add.closest('.prod-actions')?.querySelector('[data-op]')?.value || '';
      if (!op) { abrirQV(p.id, add); return; }
      if (!Cart.add(p, 1, op)) { showToast('Esa medida no tiene stock por ahora: escribinos y te avisamos.'); return; }
      showToast(`Sumaste ${p.nombre} (${medidaDe(p, op)?.nombre}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const op = unica(p) ? p.medidas[0].id : comprar.closest('.prod__body')?.querySelector('[data-op]')?.value || '';
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
    cat: valido(params.get('cat'), CATEGORIAS), color: multi('color', COLORES),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };

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
      ${opcion('radio', 'cat', '', 'Todos los productos', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id] || e.color.includes(c.id));
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio desde</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const color = !cat && e.color.length === 1 ? COLORES.find(c => c.id === e.color[0]) : null;
    const titulo = cat ? cat.nombre : color ? `Color ${color.nombre.toLowerCase()}` : e.fav ? 'Tus favoritos' : 'Todos los productos';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : color ? `Piezas Essen en ${color.nombre.toLowerCase()}, con la medida a elección.` : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Cacerolas, sartenes, línea cuadrada, budinera y vaporera Essen. Elegís la medida, la sumás al carrito y te la enviamos sin costo a todo el país.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : color ? color.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : color ? `${CATALOGO_URL}?color=${color.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
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
    ['cat', 'color', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
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
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una pieza y aparece acá.'
      : 'No encontramos piezas con esos filtros. Probá con otra palabra, como «olla» o «grill», o sacá algún filtro.';
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
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
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.color = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
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
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-todo, .main-nav > a, .footer__col a');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.color = (u.searchParams.get('color') || '').split(',').filter(v => COLORES.some(c => c.id === v));
    e.orden = 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
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

[initCatsMenu, initCatsGrid, initColoresGrid, initElegidas, initGuia, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
