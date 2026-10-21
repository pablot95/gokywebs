const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491172372324';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const MAX_DECANTS = 10;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'arabes', nombre: 'Árabes', img: 'images/cat-arabes.webp', bajada: 'Perfumes árabes originales: ámbar, especias y oud, con mucha duración en la piel.' },
  { id: 'nicho', nombre: 'De nicho', img: 'images/cat-nicho.webp', bajada: 'Casas de nicho para probar en decant antes de ir por el frasco.' },
  { id: 'disenador', nombre: 'De diseñador', img: 'images/cat-disenador.webp', bajada: 'Las fragancias de diseñador que más se piden, en frasco o en decant.' },
];
const FORMATOS_FILTRO = { decant: 'Decants de 5 y 10 ml', entero: 'Frascos sellados' };
const FAMILIAS = {
  ambar: { nombre: 'Ámbar y especias', corto: 'ámbar y especias' },
  amaderado: { nombre: 'Amaderados', corto: 'amaderados' },
  dulce: { nombre: 'Dulces', corto: 'dulces' },
  floral: { nombre: 'Florales', corto: 'florales' },
  fresco: { nombre: 'Frescos y cítricos', corto: 'frescos y cítricos' },
};
const PERFILES = { masculino: 'Masculino', femenino: 'Femenino', unisex: 'Unisex' };
const MOMENTOS = { dia: 'De día', noche: 'De noche' };
const ORDENES = { destacados: 'Más pedidos', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const NUEVO_DESDE = 13;

const PRODUCTOS = [
  { id: 'khamrah', nombre: 'Khamrah', casa: 'Lattafa', cat: 'arabes', conc: 'EDP', ml: 100, perfil: 'unisex', familias: ['ambar', 'dulce'], momentos: ['noche'],
    notas: { salida: 'Canela, nuez moscada, bergamota', corazon: 'Dátiles, praliné, nardo', fondo: 'Vainilla, haba tonka, benjuí' },
    precios: { d5: 7500, d10: 13500, entero: 89000 }, stockEntero: 4, rango: 1, alta: 12,
    img: 'images/p-khamrah.webp', alt: 'Frasco de perfume árabe de vidrio tallado color ámbar con tapa dorada labrada, sobre piedra al sol',
    desc: 'Dulce y especiado: canela y dátiles sobre un fondo de vainilla y praliné. De los árabes más pedidos para la noche y el invierno.' },
  { id: 'baccarat-rouge-540', nombre: 'Baccarat Rouge 540', casa: 'Maison Francis Kurkdjian', cat: 'nicho', conc: 'EDP', ml: 70, perfil: 'unisex', familias: ['ambar', 'floral'], momentos: ['dia', 'noche'],
    notas: { salida: 'Azafrán, jazmín', corazon: 'Ámbar gris, cedro', fondo: 'Resina de abeto, ambroxan' },
    precios: { d5: 42000, d10: 78000, entero: 760000 }, stockEntero: 1, rango: 2, alta: 8,
    img: 'images/p-br540.webp', alt: 'Frasco rectangular de vidrio con perfume dorado y tapa negra, junto a un vidrio acanalado celeste',
    desc: 'Aireado y ambarado, con azafrán y jazmín sobre cedro. Una estela que se reconoce: ideal para probarlo primero en decant.' },
  { id: 'yara', nombre: 'Yara', casa: 'Lattafa', cat: 'arabes', conc: 'EDP', ml: 100, perfil: 'femenino', familias: ['dulce', 'floral'], momentos: ['dia', 'noche'],
    notas: { salida: 'Orquídea, heliotropo, mandarina', corazon: 'Acorde gourmand, frutas tropicales', fondo: 'Vainilla, almizcle, sándalo' },
    precios: { d5: 6000, d10: 10500, entero: 72000 }, stockEntero: 5, rango: 3, alta: 11,
    img: 'images/p-yara.webp', alt: 'Frasco cuadrado de perfume rosado con tapa facetada transparente, entre pétalos claros',
    desc: 'Cremoso y dulce, con orquídea y vainilla. Suave para el día y con presencia de noche.' },
  { id: 'asad', nombre: 'Asad', casa: 'Lattafa', cat: 'arabes', conc: 'EDP', ml: 100, perfil: 'masculino', familias: ['amaderado', 'ambar'], momentos: ['noche'],
    notas: { salida: 'Pimienta negra, ananá, tabaco', corazon: 'Café, iris, pachulí', fondo: 'Ámbar, vainilla, maderas secas' },
    precios: { d5: 6500, d10: 11500, entero: 78000 }, stockEntero: 3, rango: 4, alta: 9,
    img: 'images/p-asad.webp', alt: 'Frasco de perfume árabe dorado con calados y tapa en forma de cúpula, sobre mármol',
    desc: 'Especiado y potente: pimienta negra y tabaco con un fondo ambarado. Rinde muchas horas en la piel.' },
  { id: 'hawas', nombre: 'Hawas for Him', casa: 'Rasasi', cat: 'arabes', conc: 'EDP', ml: 100, perfil: 'masculino', familias: ['fresco', 'ambar'], momentos: ['dia'],
    notas: { salida: 'Manzana, bergamota, limón, canela', corazon: 'Notas acuáticas, ciruela, cardamomo', fondo: 'Ámbar gris, almizcle, pachulí' },
    precios: { d5: 8000, d10: 14000, entero: 98000 }, descuento: 10, stockEntero: 2, rango: 5, alta: 10,
    img: 'images/p-hawas.webp', alt: 'Frasco de perfume azul con tapa plateada junto a una lima cortada y hojas, con el mar de fondo',
    desc: 'Fresco y acuático, con un toque de ciruela y ámbar gris. Pensado para el calor y para todos los días.' },
  { id: 'aventus', nombre: 'Aventus', casa: 'Creed', cat: 'nicho', conc: 'EDP', ml: 100, perfil: 'masculino', familias: ['amaderado', 'fresco'], momentos: ['dia', 'noche'],
    notas: { salida: 'Ananá, bergamota, grosella negra, manzana', corazon: 'Abedul, pachulí, jazmín', fondo: 'Almizcle, musgo de roble, vainilla' },
    precios: { d5: 36000, d10: 66000, entero: 690000 }, stockEntero: 0, rango: 6, alta: 5,
    img: 'images/p-aventus.webp', alt: 'Frasco cilíndrico de vidrio verde oscuro con tapa negra, sobre cemento con luz de ventana',
    desc: 'Frutal y amaderado: ananá y abedul ahumado sobre musgo y almizcle. Un clásico del nicho que conviene probar en decant.' },
  { id: 'sauvage', nombre: 'Sauvage', casa: 'Dior', cat: 'disenador', conc: 'EDP', ml: 100, perfil: 'masculino', familias: ['fresco', 'amaderado'], momentos: ['dia', 'noche'],
    notas: { salida: 'Bergamota, pimienta', corazon: 'Lavanda, nuez moscada, anís estrellado', fondo: 'Ambroxan, vainilla' },
    precios: { d5: 14000, d10: 25000, entero: 245000 }, stockEntero: 3, rango: 7, alta: 6,
    img: 'images/p-sauvage.webp', alt: 'Frasco cuadrado de perfume claro con collar dorado junto a su caja sellada con celofán',
    desc: 'Fresco y especiado, con bergamota y pimienta sobre ambroxan. Va con todo y en cualquier momento.' },
  { id: 'amber-oud-gold', nombre: 'Amber Oud Gold Edition', casa: 'Al Haramain', cat: 'arabes', conc: 'EDP', ml: 120, perfil: 'unisex', familias: ['dulce', 'ambar'], momentos: ['dia', 'noche'],
    notas: { salida: 'Bergamota, notas verdes', corazon: 'Melón, ananá, ámbar', fondo: 'Almizcle, vainilla, maderas' },
    precios: { d5: 8000, d10: 14500, entero: 96000 }, stockEntero: 2, rango: 8, alta: 7,
    img: 'images/p-amber-oud-gold.webp', alt: 'Frasco redondo de perfume dorado con tapa metálica, sobre travertino con luz cálida',
    desc: 'Frutal y ambarado, con una estela dulce que se nota al pasar. Funciona de día y de noche.' },
  { id: 'libre', nombre: 'Libre', casa: 'Yves Saint Laurent', cat: 'disenador', conc: 'EDP', ml: 90, perfil: 'femenino', familias: ['floral', 'ambar'], momentos: ['dia', 'noche'],
    notas: { salida: 'Lavanda, mandarina, grosella negra', corazon: 'Azahar, jazmín', fondo: 'Vainilla, almizcle, ámbar gris' },
    precios: { d5: 15000, d10: 27000, entero: 230000 }, stockEntero: 2, rango: 9, alta: 14,
    img: 'images/p-libre.webp', alt: 'Frasco de perfume rosado de cerca, con tapa de cristal y pétalos blancos',
    desc: 'Floral con carácter: lavanda y azahar sobre vainilla. Elegante de día y con presencia de noche.' },
  { id: 'bleu-de-chanel', nombre: 'Bleu de Chanel', casa: 'Chanel', cat: 'disenador', conc: 'EDP', ml: 100, perfil: 'masculino', familias: ['amaderado', 'fresco'], momentos: ['dia', 'noche'],
    notas: { salida: 'Pomelo, limón, menta', corazon: 'Jengibre, nuez moscada, jazmín', fondo: 'Incienso, cedro, sándalo' },
    precios: { d5: 16000, d10: 29000, entero: 280000 }, stockEntero: 2, rango: 10, alta: 3,
    img: 'images/p-bleu.webp', alt: 'Frasco cilíndrico de vidrio ahumado con tapa negra, entre otros dos frascos sobre mármol',
    desc: 'Cítrico y amaderado, con incienso y cedro. Fácil de usar, de oficina o de salida.' },
  { id: 'layton', nombre: 'Layton', casa: 'Parfums de Marly', cat: 'nicho', conc: 'EDP', ml: 125, perfil: 'masculino', familias: ['dulce', 'ambar'], momentos: ['noche'],
    notas: { salida: 'Manzana, lavanda, bergamota', corazon: 'Geranio, violeta, jazmín', fondo: 'Vainilla, cardamomo, pimienta, guayaco' },
    precios: { d5: 28000, d10: 50000, entero: 520000 }, stockEntero: 1, rango: 11, alta: 4,
    img: 'images/p-layton.webp', alt: 'Frasco esférico de perfume ámbar con tapa dorada, de cerca, sobre piedra clara',
    desc: 'Manzana y lavanda con un fondo de vainilla especiada. Cálido, envolvente y muy de noche.' },
  { id: 'oud-for-greatness', nombre: 'Oud for Greatness', casa: 'Initio', cat: 'nicho', conc: 'EDP', ml: 90, perfil: 'unisex', familias: ['amaderado', 'ambar'], momentos: ['noche'],
    notas: { salida: 'Azafrán, nuez moscada, lavanda', corazon: 'Oud', fondo: 'Pachulí, almizcle' },
    precios: { d5: 32000, d10: 58000, entero: null }, stockEntero: 0, rango: 12, alta: 13,
    img: 'images/p-oud-for-greatness.webp', alt: 'Frasco cilíndrico de vidrio verde con tapa negra brillante, en una sombra de ventana',
    desc: 'Oud ahumado con azafrán y lavanda, profundo y persistente. Por ahora lo tenemos solo en decant.' },
  { id: 'la-vie-est-belle', nombre: 'La Vie Est Belle', casa: 'Lancôme', cat: 'disenador', conc: 'EDP', ml: 100, perfil: 'femenino', familias: ['dulce', 'floral'], momentos: ['dia', 'noche'],
    notas: { salida: 'Grosella negra, pera', corazon: 'Iris, jazmín, azahar', fondo: 'Praliné, vainilla, pachulí, haba tonka' },
    precios: { d5: 14000, d10: 25000, entero: 235000 }, stockEntero: 2, rango: 13, alta: 1,
    img: 'images/p-la-vie-est-belle.webp', alt: 'Frasco cuadrado transparente con perfume claro y collar dorado, sobre mármol con luz celeste',
    desc: 'Iris y praliné sobre vainilla: dulce, luminoso y fácil de llevar todo el día.' },
  { id: 'acqua-di-gio-profondo', nombre: 'Acqua di Giò Profondo', casa: 'Giorgio Armani', cat: 'disenador', conc: 'EDP', ml: 125, perfil: 'masculino', familias: ['fresco'], momentos: ['dia'],
    notas: { salida: 'Notas marinas, bergamota, mandarina verde', corazon: 'Romero, lavanda, ciprés', fondo: 'Pachulí, almizcle, ámbar' },
    precios: { d5: 12000, d10: 22000, entero: 210000 }, stockEntero: 3, rango: 0, alta: 2,
    img: 'images/p-adg-profondo.webp', alt: 'Frasco cuadrado de perfume azul de cerca, con tapa plateada y una lima al lado',
    desc: 'Marino y aromático, con romero y bergamota. El fresco para el verano y los días de calor.' },
  { id: 'borrador-oud-mood', nombre: 'Oud Mood (borrador)', casa: 'Lattafa', cat: 'arabes', conc: 'EDP', ml: 100, perfil: 'unisex', familias: ['amaderado'], momentos: ['noche'],
    notas: { salida: '-', corazon: '-', fondo: '-' }, precios: { d5: 7000, d10: 12500, entero: 85000 }, stockEntero: 1, rango: 0, alta: 0, visible: false,
    img: 'images/p-khamrah.webp', alt: '', desc: '' },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stockEntero == null) p.stockEntero = 0;
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const tieneEntero = p => p.precios.entero != null;
const hayEntero = p => tieneEntero(p) && p.stockEntero > 0;
const precioDe = (p, f) => {
  if (f === 'entero') return tieneEntero(p) ? (p.descuento > 0 ? redondear(p.precios.entero * (1 - p.descuento / 100)) : p.precios.entero) : null;
  return p.precios[f] ?? null;
};
const precioDesde = p => p.precios.d5;
const formatoNombre = (p, f) => (f === 'entero' ? `Frasco ${p.ml} ml` : f === 'd10' ? 'Decant 10 ml' : 'Decant 5 ml');
const formatoCorto = (p, f) => (f === 'entero' ? `${p.ml} ml` : f === 'd10' ? '10 ml' : '5 ml');
const formatosDe = p => ['d5', 'd10', ...(tieneEntero(p) ? ['entero'] : [])];

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), familias = lista(f.familias), perfiles = lista(f.perfiles), casas = lista(f.casas), momentos = lista(f.momentos);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (familias.length && !familias.some(x => p.familias.includes(x))) return false;
    if (perfiles.length && !perfiles.includes(p.perfil)) return false;
    if (casas.length && !casas.includes(p.casa)) return false;
    if (momentos.length && !momentos.some(x => p.momentos.includes(x))) return false;
    if (f.formato === 'entero' && !hayEntero(p)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
  function casas(filtros = {}) {
    return [...new Set(visibles.filter(p => coincide(p, filtros)).map(p => p.casa))].sort((a, b) => a.localeCompare(b, 'es'));
  }
  return { TOPE: tope, consultar, contar, obtener, casas };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.casa, catDe(p.cat)?.nombre, p.conc, PERFILES[p.perfil], ...p.familias.map(f => FAMILIAS[f]?.nombre),
      ...p.momentos.map(m => MOMENTOS[m]), p.notas.salida, p.notas.corazon, p.notas.fondo, p.desc,
      tieneEntero(p) ? 'frasco entero sellado' : 'solo decant', 'decant', p.descuento > 0 ? 'oferta descuento' : '',
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'svfragance_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  maximo(p, f) { return f === 'entero' ? (hayEntero(p) ? p.stockEntero : 0) : MAX_DECANTS; },
  enCarrito(id, f) { return this.get().filter(i => i.id === id && i.f === f).reduce((s, i) => s + i.qty, 0); },
  add(producto, f, qty = 1) {
    if (precioDe(producto, f) == null) return 0;
    const libre = this.maximo(producto, f) - this.enCarrito(producto.id, f);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.f === f);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, f, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, f, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.f === f);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p ? this.maximo(p, f) : 1));
    this.save(items);
  },
  remove(id, f) { this.save(this.get().filter(i => !(i.id === id && i.f === f))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const pr = p ? precioDe(p, i.f) : null; return pr ? s + pr * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  gota: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6"/><path d="M10 3v3"/><path d="M14 3v3"/><rect x="8" y="6" width="8" height="15" rx="2"/><path d="M8 12h8"/></svg>',
  frasco: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2.5" width="6" height="4" rx="1"/><path d="M10 6.5v2"/><path d="M14 6.5v2"/><rect x="5" y="8.5" width="14" height="13" rx="2.5"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ficha = p => `${p.conc} · ${FAMILIAS[p.familias[0]]?.nombre || ''}`;

function precioHTML(p, f, clase = 'precio') {
  const final = precioDe(p, f);
  const tachado = f === 'entero' && p.descuento > 0 ? `<s>${formatearPrecio(p.precios.entero)}</s>` : '';
  return `<p class="${clase}" data-precio><b>${formatearPrecio(final)}</b>${tachado}<span class="precio__f">${esc(formatoNombre(p, f))}</span></p>`;
}

function selectorHTML(p, f, nombre) {
  return `<div class="formatos" role="radiogroup" aria-label="Tamaño de ${esc(p.nombre)}" data-formatos="${esc(p.id)}">${formatosDe(p).map(k => {
    const sin = k === 'entero' && !hayEntero(p);
    return `<label class="formato${sin ? ' formato--sin' : ''}"><input type="radio" name="${nombre}" value="${k}"${k === f ? ' checked' : ''}${sin ? ' disabled' : ''}><span>${esc(formatoCorto(p, k))}</span></label>`;
  }).join('')}</div>`;
}

function badgeHTML(p, f) {
  if (!tieneEntero(p)) return '<span class="etiqueta etiqueta--decant">Solo en decant</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}% en frasco</span>`;
  if (p.alta >= NUEVO_DESDE) return '<span class="etiqueta">Recién llegado</span>';
  if (p.rango && p.rango <= 3) return '<span class="etiqueta">De los más pedidos</span>';
  if (!hayEntero(p) && f !== 'entero') return '<span class="etiqueta etiqueta--decant">Frasco sin stock</span>';
  return '';
}

let cardSeq = 0;
function cardHTML(p, { anim = true, clase = '', formato = '', animTipo = 'subir' } = {}) {
  const f = formato === 'entero' && hayEntero(p) ? 'entero' : 'd5';
  const nombre = `fmt-${p.id}-${++cardSeq}`;
  const estado = animTipo === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(40px)';
  return `<article class="pcard${clase ? ' ' + clase : ''}" data-id="${esc(p.id)}" data-f="${f}"${anim ? ` data-animate="${animTipo}" style="${estado}"` : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badgeHTML(p, f)}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__casa">${esc(p.casa)}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__meta">${esc(ficha(p))}</p>
    ${selectorHTML(p, f, nombre)}
    <div class="pcard__pie">
      ${precioHTML(p, f)}
      <div class="prod-actions"><button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    </div>
  </div>
</article>`;
}

function actualizarCard(card, f) {
  const p = getProducto(card.dataset.id);
  if (!p || precioDe(p, f) == null) return;
  card.dataset.f = f;
  const pr = card.querySelector('[data-precio]');
  if (pr) {
    pr.outerHTML = precioHTML(p, f);
    const nuevo = card.querySelector('[data-precio]');
    if (!reduceMotion) { nuevo.classList.add('precio--cambia'); setTimeout(() => nuevo.classList.remove('precio--cambia'), 450); }
  }
  const media = card.querySelector('.pcard__media');
  const viejo = media?.querySelector('.etiqueta');
  const html = badgeHTML(p, f);
  if (viejo) viejo.remove();
  if (html && media) media.querySelector('.pcard__foto')?.insertAdjacentHTML('afterend', html);
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'perfume' : 'perfumes'}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  const perfumes = n => `${n} ${n === 1 ? 'perfume' : 'perfumes'}`;
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = perfumes(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-cuenta-entero]').forEach(el => { el.textContent = perfumes(Tienda.contar({ formato: 'entero' })); });
  document.querySelectorAll('[data-cuenta-decant]').forEach(el => { el.textContent = perfumes(Tienda.contar({})); });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const mosaico = cont.hasAttribute('data-mosaico');
    const excluir = (cont.dataset.excluir || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const orden = cont.dataset.orden || 'nuevos';
    const animTipo = cont.dataset.anim || 'subir';
    const { items } = Tienda.consultar({ filtros: { excluir }, orden, limite });
    items.forEach(cachear);
    const total = Tienda.contar({});
    const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-n">${total}</span><span class="mosaico__todo-tit">Ver los ${total} perfumes</span><span class="mosaico__todo-txt">Árabes, de nicho y de diseñador, con filtros por familia, perfil y tamaño.</span>${ICO.flecha}</a>` : '';
    cont.innerHTML = items.map((p, i) => cardHTML(p, { animTipo, clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, label, button')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    const prev = rail.querySelector('[data-rail-paso="-1"]');
    const next = rail.querySelector('[data-rail-paso="1"]');
    if (!vp || !track) return;
    const ids = (rail.dataset.ids || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(rail.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ filtros: ids.length ? { ids } : { destacado: true }, orden: ids.length ? 'ids' : 'destacados', limite });
    items.forEach(cachear);
    track.innerHTML = items.map(p => `<li class="rail-item">${cardHTML(p, { animTipo: 'der' })}</li>`).join('');
    initRailDrag(vp);
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 20;
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initCasas() {
  const box = document.querySelector('[data-casas]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-casa-tab]')];
  const grid = box.querySelector('[data-casa-grid]');
  const link = box.querySelector('[data-casa-link]');
  const bajada = box.querySelector('[data-casa-bajada]');
  if (!tabs.length || !grid) return;
  const pintar = (id, animar) => {
    const cat = catDe(id) || CATEGORIAS[0];
    const { items } = Tienda.consultar({ filtros: { cat: cat.id }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    const total = Tienda.contar({ cat: cat.id });
    if (link) { link.href = `${URL_CATALOGO}?cat=${cat.id}`; link.querySelector('span').textContent = `Ver los ${total} perfumes ${cat.nombre.toLowerCase()}`; }
    if (bajada) bajada.textContent = cat.bajada;
    grid.setAttribute('aria-labelledby', `casa-${cat.id}`);
    if (animar) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const elegir = (t, foco = false) => {
    tabs.forEach(b => {
      const activo = b === t;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    if (foco) t.focus();
    pintar(t.dataset.casaTab, true);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      elegir(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
  const inicial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  pintar(inicial.dataset.casaTab, false);
}

function miniHTML(p, motivo) {
  return `<li class="mini">
    <button type="button" class="mini__foto" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="120" height="120"></button>
    <div class="mini__txt"><p class="mini__casa">${esc(p.casa)}</p><p class="mini__nombre">${esc(p.nombre)}</p><p class="mini__motivo">${esc(motivo)}</p></div>
    <button type="button" class="mini__add" data-mini-add="${esc(p.id)}">${ICO.gota}<span>Decant 5 ml · ${formatearPrecio(precioDe(p, 'd5'))}</span></button>
  </li>`;
}

function initBuscador() {
  const box = document.querySelector('[data-buscador]');
  if (!box) return;
  const famBox = box.querySelector('[data-bus-familias]');
  const res = box.querySelector('[data-bus-res]');
  if (!famBox || !res) return;
  famBox.innerHTML = Object.entries(FAMILIAS).map(([k, f]) => `<button type="button" class="chip" data-bus-familia="${k}" aria-pressed="${k === 'ambar' || k === 'dulce' ? 'true' : 'false'}">${esc(f.nombre)}</button>`).join('');
  const estado = { familias: new Set(['ambar', 'dulce']), momento: 'noche', perfil: '' };
  const pintar = () => {
    famBox.querySelectorAll('[data-bus-familia]').forEach(b => b.setAttribute('aria-pressed', String(estado.familias.has(b.dataset.busFamilia))));
    box.querySelectorAll('[data-bus-momento]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.busMomento === estado.momento)));
    box.querySelectorAll('[data-bus-perfil]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.busPerfil === estado.perfil)));
    const filtros = {};
    if (estado.perfil) filtros.perfiles = [estado.perfil, 'unisex'];
    const { items } = Tienda.consultar({ filtros, orden: 'destacados', limite: Tienda.TOPE });
    const fams = [...estado.familias];
    const puntaje = p => {
      let s = 0;
      fams.forEach(f => { if (p.familias[0] === f) s += 3; else if (p.familias.includes(f)) s += 2; });
      if (estado.momento && p.momentos.includes(estado.momento)) s += 2;
      if (estado.perfil && p.perfil === estado.perfil) s += 1;
      return s;
    };
    const elegidos = items.map(p => ({ p, s: puntaje(p) })).filter(x => !fams.length || fams.some(f => x.p.familias.includes(f))).sort((a, b) => b.s - a.s || (a.p.rango || 99) - (b.p.rango || 99)).slice(0, 3);
    elegidos.forEach(x => cachear(x.p));
    const motivo = p => {
      const comunes = p.familias.filter(f => estado.familias.has(f)).map(f => FAMILIAS[f].corto);
      const partes = [];
      if (comunes.length) partes.push(comunes.join(' y '));
      if (estado.momento && p.momentos.includes(estado.momento)) partes.push(estado.momento === 'dia' ? 'para el día' : 'para la noche');
      return partes.length ? `${partes.join(', ')}`.replace(/^./, c => c.toUpperCase()) : FAMILIAS[p.familias[0]].nombre;
    };
    const fam = fams.length === 1 ? fams[0] : '';
    const linkCat = `${URL_CATALOGO}?${fams.length ? `familia=${fams.join(',')}` : ''}${estado.perfil ? `${fams.length ? '&' : ''}perfil=${estado.perfil},unisex` : ''}`;
    const cuantos = Tienda.contar({ ...(fams.length ? { familias: fams } : {}), ...(estado.perfil ? { perfiles: [estado.perfil, 'unisex'] } : {}) });
    res.innerHTML = elegidos.length
      ? `<p class="bus__res-tit">Para empezar, probá estos en decant</p><ul class="minis">${elegidos.map(x => miniHTML(x.p, motivo(x.p))).join('')}</ul><a class="link-todo" href="${linkCat}">Ver ${cuantos === 1 ? 'el perfume' : `los ${cuantos} perfumes`}${fam ? ` ${FAMILIAS[fam].corto}` : ' que coinciden'} ${ICO.flecha}</a>`
      : `<p class="bus__res-tit">No encontramos uno con esa combinación.</p><a class="link-wsp" href="${wspLink('Hola SV Fragance! Busco un perfume y no sé cuál elegir. ¿Me recomendás?')}" target="_blank" rel="noopener">${ICO.wsp}Pedinos una recomendación</a>`;
  };
  box.addEventListener('click', e => {
    const fam = e.target.closest('[data-bus-familia]');
    if (fam) { const k = fam.dataset.busFamilia; if (estado.familias.has(k)) estado.familias.delete(k); else estado.familias.add(k); pintar(); return; }
    const mom = e.target.closest('[data-bus-momento]');
    if (mom) { estado.momento = mom.dataset.busMomento; pintar(); return; }
    const per = e.target.closest('[data-bus-perfil]');
    if (per) { estado.perfil = per.dataset.busPerfil; pintar(); return; }
    const add = e.target.closest('[data-mini-add]');
    if (add) { const p = getProducto(add.dataset.miniAdd); if (p) sumarAlCarrito(p, 'd5'); }
  });
  pintar();
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, f, { qty = 1, comprar = false } = {}) {
  const n = Cart.add(p, f, qty);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id, f)) { abrirCarrito(); return; }
    showToast(f === 'entero' ? (hayEntero(p) ? `Ya tenés en el carrito los ${p.stockEntero} frascos que quedan de ${p.nombre}.` : `${p.nombre} no tiene frasco en stock: probalo en decant.`) : `Llegaste al máximo de ${MAX_DECANTS} decants iguales por pedido.`);
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${p.nombre} (${formatoNombre(p, f).toLowerCase()}) al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('change', e => {
    const radio = e.target.closest('.pcard [data-formatos] input');
    if (!radio) return;
    actualizarCard(radio.closest('.pcard'), radio.value);
  });
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      const card = quick.closest('.pcard');
      abrirQV(quick.dataset.quick, quick, card?.dataset.f);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, card?.dataset.f || 'd5', { comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvFormato = 'd5';
function abrirQV(id, origen, formato) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  qvFormato = formato && precioDe(p, formato) != null && (formato !== 'entero' || hayEntero(p)) ? formato : 'd5';
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: `${p.casa} ${p.nombre}`, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: p.casa },
    offers: formatosDe(p).map(f => ({ '@type': 'Offer', name: formatoNombre(p, f), priceCurrency: 'ARS', price: precioDe(p, f), availability: f === 'entero' && !hayEntero(p) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' })),
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const f = qvFormato;
  const { items: rel } = Tienda.consultar({ filtros: { familias: [p.familias[0]], excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const libre = Cart.maximo(p, f) - Cart.enCarrito(p.id, f);
  const ml = f === 'entero' ? p.ml : f === 'd10' ? 10 : 5;
  const porMl = Math.round(precioDe(p, f) / ml);
  const muestra = f === 'entero'
    ? { img: 'images/sellado.webp', txt: 'Así llega el frasco: entero y sellado, como sale de fábrica.' }
    : { img: 'images/decants.webp', txt: `Así llega el decant: ${ml} ml en atomizador, fraccionado de un frasco original.` };
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgeHTML(p, f)}</div>
      <figure class="qv__muestra"><img src="${muestra.img}" alt="" width="1000" height="1000"><figcaption>${esc(muestra.txt)}</figcaption></figure>
    </div>
    <div class="qv__info">
      <p class="qv__casa">${esc(p.casa)} · ${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__ficha-corta">${esc(p.conc)} · ${esc(PERFILES[p.perfil])} · ${esc(p.momentos.map(m => MOMENTOS[m].toLowerCase()).join(' y '))}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__familias">${p.familias.map(k => `<li>${esc(FAMILIAS[k].nombre)}</li>`).join('')}</ul>
      <dl class="piramide">
        <div><dt>Salida</dt><dd>${esc(p.notas.salida)}</dd></div>
        <div><dt>Corazón</dt><dd>${esc(p.notas.corazon)}</dd></div>
        <div><dt>Fondo</dt><dd>${esc(p.notas.fondo)}</dd></div>
      </dl>
      <fieldset class="qv__formatos">
        <legend>Elegí el tamaño</legend>
        ${formatosDe(p).map(k => {
          const sin = k === 'entero' && !hayEntero(p);
          return `<label class="qv-fmt${sin ? ' qv-fmt--sin' : ''}"><input type="radio" name="qv-formato" value="${k}"${k === f ? ' checked' : ''}${sin ? ' disabled' : ''}><span class="qv-fmt__ico">${k === 'entero' ? ICO.frasco : ICO.gota}</span><span class="qv-fmt__txt"><b>${esc(formatoNombre(p, k))}</b><small>${sin ? 'Sin stock por ahora' : k === 'entero' ? `Sellado · quedan ${p.stockEntero}` : 'Fraccionado de frasco original'}</small></span><span class="qv-fmt__precio">${formatearPrecio(precioDe(p, k))}${k === 'entero' && p.descuento > 0 ? `<s>${formatearPrecio(p.precios.entero)}</s>` : ''}</span></label>`;
        }).join('')}
      </fieldset>
      <p class="qv__ml">Te sale <b>${formatearPrecio(porMl)}</b> el ml en ${esc(formatoNombre(p, f).toLowerCase())}.</p>
      <div class="qv__acc">
        ${libre > 0 ? `<div class="stepper stepper--grande" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${libre}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>` : ''}
        <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está en tu carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola SV Fragance! Tengo una consulta sobre ${p.casa} ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con este perfume? Consultá por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">Si te gustan los ${esc(FAMILIAS[p.familias[0]].corto)}, probá también</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><small>${esc(r.casa)}</small><b>Desde ${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('change', e => {
    const r = e.target.closest('input[name="qv-formato"]');
    if (!r || !qvActual) return;
    qvFormato = r.value;
    pintarQV();
    qv.querySelector(`input[name="qv-formato"][value="${qvFormato}"]`)?.focus({ preventScroll: true });
  });
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qvFormato, qty);
      if (!Cart.enCarrito(p.id, qvFormato)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, qvFormato, { qty });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null, PARAMS.get('formato') === 'entero' ? 'entero' : 'd5');
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => { const p = getProducto(i.id); return p && precioDe(p, i.f) != null; });
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.gota}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Empezá por un decant de 5 ml: es la forma más fácil de conocer un perfume.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const max = Cart.maximo(p, i.f);
    return `<li class="linea" data-linea="${esc(i.id)}" data-linea-f="${i.f}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__casa">${esc(p.casa)}</p><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(formatoNombre(p, i.f))} · ${formatearPrecio(precioDe(p, i.f))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)} ${esc(formatoNombre(p, i.f))}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.f) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.casa} ${p.nombre}, ${formatoNombre(p, i.f).toLowerCase()}: ${formatearPrecio(precioDe(p, i.f) * i.qty)}`; }).join('\n');
  const msg = `Hola SV Fragance! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi zona para la entrega: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">La entrega o el envío se coordinan por WhatsApp después de la compra.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    const f = linea.dataset.lineaF;
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, f);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && i.f === f);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, f, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"][data-linea-f="${f}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const CASAS = Object.fromEntries(Tienda.casas().map(c => [norm(c).replace(/[^a-z0-9]+/g, '-'), c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    formato: valido(PARAMS.get('formato'), FORMATOS_FILTRO),
    familias: new Set(lista('familia').filter(c => FAMILIAS[c])),
    perfiles: new Set(lista('perfil').filter(c => PERFILES[c])),
    momentos: new Set(lista('momento').filter(c => MOMENTOS[c])),
    casas: new Set(lista('casa').filter(c => CASAS[c])),
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const SETS = { familia: estado.familias, perfil: estado.perfiles, momento: estado.momentos, casa: estado.casas };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoTab = cont.dataset.catOpciones === 'tabs';
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoTab
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los perfumes')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-formato-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los tamaños'], ...Object.entries(FORMATOS_FILTRO)].map(([k, n]) => `<label class="opt"><input type="radio" name="f-formato" value="${k}" data-filtro="formato"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-formato="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-formato-chips]').forEach(cont => {
    cont.innerHTML = [['', 'Todos'], ...Object.entries(FORMATOS_FILTRO)].map(([k, n]) => `<button type="button" class="chip" data-filtro="formato" data-valor="${k}" aria-pressed="false">${esc(k ? n : 'Todos los tamaños')}</button>`).join('');
  });
  document.querySelectorAll('[data-familia-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(FAMILIAS).map(([k, f]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="familia"><span>${esc(f.nombre)}</span><span class="opt__n" data-cuenta-filtro-familia="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-familia-chips]').forEach(cont => {
    cont.innerHTML = Object.entries(FAMILIAS).map(([k, f]) => `<button type="button" class="chip" data-chip-familia="${k}" aria-pressed="false">${esc(f.nombre)}</button>`).join('');
  });
  document.querySelectorAll('[data-perfil-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(PERFILES).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="perfil"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-perfil="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-momento-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(MOMENTOS).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="momento"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-momento="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-casa-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(CASAS).map(([k, n]) => `<label class="opt" data-opt-casa="${k}"><input type="checkbox" value="${k}" data-f="casa"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-casa="${k}"></span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.formato === 'entero' && sin !== 'formato') f.formato = 'entero';
    if (estado.familias.size && sin !== 'familia') f.familias = [...estado.familias];
    if (estado.perfiles.size && sin !== 'perfil') f.perfiles = [...estado.perfiles];
    if (estado.momentos.size && sin !== 'momento') f.momentos = [...estado.momentos];
    if (estado.casas.size && sin !== 'casa') f.casas = [...estado.casas].map(k => CASAS[k]);
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.formato) chips.push(['formato', '', FORMATOS_FILTRO[estado.formato]]);
    estado.familias.forEach(v => chips.push(['familia', v, FAMILIAS[v].nombre]));
    estado.perfiles.forEach(v => chips.push(['perfil', v, PERFILES[v]]));
    estado.momentos.forEach(v => chips.push(['momento', v, MOMENTOS[v]]));
    estado.casas.forEach(v => chips.push(['casa', v, CASAS[v]]));
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    document.querySelectorAll('[data-chip-familia]').forEach(b => b.setAttribute('aria-pressed', String(estado.familias.has(b.dataset.chipFamilia))));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-formato]').forEach(el => { const k = el.dataset.cuentaFiltroFormato; el.textContent = Tienda.contar({ ...filtrosDe('formato'), ...(k === 'entero' ? { formato: 'entero' } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-familia]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('familia'), familias: [el.dataset.cuentaFiltroFamilia] }); });
    document.querySelectorAll('[data-cuenta-filtro-perfil]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('perfil'), perfiles: [el.dataset.cuentaFiltroPerfil] }); });
    document.querySelectorAll('[data-cuenta-filtro-momento]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('momento'), momentos: [el.dataset.cuentaFiltroMomento] }); });
    document.querySelectorAll('[data-cuenta-filtro-casa]').forEach(el => {
      const k = el.dataset.cuentaFiltroCasa;
      const n = Tienda.contar({ ...filtrosDe('casa'), casas: [CASAS[k]] });
      el.textContent = n;
      const opt = el.closest('[data-opt-casa]');
      if (opt) opt.hidden = n === 0 && !estado.casas.has(k);
    });
    const enPanel = estado.familias.size + estado.perfiles.size + estado.momentos.size + estado.casas.size
      + (document.querySelector('#filtros [data-formato-opciones]') && estado.formato ? 1 : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0)
      - (document.querySelector('[data-familia-chips]') ? estado.familias.size : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? (estado.formato === 'decant' ? `Decants ${cat.nombre.toLowerCase()}` : cat.nombre) : estado.formato === 'decant' ? 'Decants' : estado.formato === 'entero' ? 'Frascos sellados' : 'Todos los perfumes';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : estado.formato === 'decant' ? 'Cada perfume en decant de 5 o 10 ml, fraccionado de un frasco original. Para probarlo antes de ir por el frasco.' : estado.formato === 'entero' ? 'Frascos originales, enteros y sellados. Solo los que tenemos en stock hoy.' : 'Árabes, de nicho y de diseñador, en frasco sellado o en decant. Filtrá por familia, perfil o casa.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !(cat || estado.formato); miga.textContent = titulo; }
    document.title = `${titulo} — SV Fragance`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'formato', 'familia', 'perfil', 'momento', 'casa', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.formato) u.searchParams.set('formato', estado.formato);
    Object.entries(SETS).forEach(([k, set]) => { if (set.size) u.searchParams.set(k, [...set].join(',')); });
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p, { formato: estado.formato })).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'perfume' : 'perfumes'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más perfumes para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.formato = ''; estado.q = '';
    Object.values(SETS).forEach(s => s.clear());
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = SETS[multi.dataset.f];
      if (!set) return;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    estado[el.dataset.filtro] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-chip-familia]');
    if (chip) {
      const k = chip.dataset.chipFamilia;
      if (estado.familias.has(k)) estado.familias.delete(k); else estado.familias.add(k);
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero__trazo', { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.55);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.puerta__txt', { y: 20, opacity: 0, duration: 1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero__sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-5 + 5 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initCasas,
  initVistaPrevia,
  initBuscador,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
