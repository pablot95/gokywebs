const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492215660308';

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
  { id: 'vinos', nombre: 'Vinos y espumantes', img: 'images/cat-vinos.webp' },
  { id: 'destilados', nombre: 'Destilados', img: 'images/cat-destilados.webp' },
  { id: 'aperitivos', nombre: 'Aperitivos', img: 'images/cat-aperitivos.webp' },
  { id: 'cervezas', nombre: 'Cervezas', img: 'images/cat-cervezas.webp' },
  { id: 'sin-alcohol', nombre: 'Sin alcohol', img: 'images/cat-sin-alcohol.webp' },
  { id: 'regalos', nombre: 'Regalos y combos', img: 'images/cat-regalos.webp' },
];
const OCASIONES = { regalar: 'Para regalar', brindar: 'Para brindar', asado: 'Para el asado', previa: 'Para la previa' };
const PRECIOS = { 'hasta-10': [0, 10000], '10-25': [10001, 25000], '25-45': [25001, 45000], 'mas-45': [45001, Infinity] };

const PRODUCTOS = [
  { id: 'malbec-reserva', nombre: 'Malbec Reserva', cat: 'vinos', pres: '750 ml', precio: 18900, descuento: 0, stock: 24, ocasiones: ['asado', 'regalar'], rango: 1, alta: 20260915, img: 'p-malbec-reserva', alt: 'Botella de Malbec Reserva junto a una copa vacía sobre mármol', corto: 'Tinto · Mendoza', desc: 'Tinto de Mendoza con paso por roble: frutos rojos maduros, algo de vainilla y taninos suaves. Acompaña carnes asadas, pastas con salsa y quesos estacionados.', ficha: [['Tipo', 'Vino tinto'], ['Origen', 'Mendoza'], ['Graduación', '14 %'], ['Servir', 'De 16 a 18 °C']] },
  { id: 'extra-brut', nombre: 'Espumante Extra Brut', cat: 'vinos', pres: '750 ml', precio: 24500, descuento: 0, stock: 30, ocasiones: ['brindar', 'regalar'], rango: 2, alta: 20260920, img: 'p-extra-brut', alt: 'Botella de espumante con cápsula dorada junto a flores blancas', corto: 'Espumante · Método tradicional', desc: 'Burbuja fina y persistente, con notas de pan tostado y manzana verde. Para el brindis de las fiestas o para regalar con un par de copas.', ficha: [['Tipo', 'Espumante extra brut'], ['Origen', 'Mendoza'], ['Graduación', '12 %'], ['Servir', 'De 6 a 8 °C']] },
  { id: 'whisky-blend', nombre: 'Whisky Blend', cat: 'destilados', pres: '750 ml', precio: 54900, descuento: 0, stock: 9, ocasiones: ['regalar'], rango: 3, alta: 20260901, img: 'p-whisky', alt: 'Botella cuadrada de whisky color ámbar sobre mármol', corto: 'Destilado · Ámbar', desc: 'Blend suave, con notas de miel, caramelo y un final apenas ahumado. Se toma solo, con una piedra de hielo o en cócteles clásicos.', ficha: [['Tipo', 'Whisky blend'], ['Estilo', 'Suave, apenas ahumado'], ['Graduación', '40 %'], ['Servir', 'Solo o con hielo']] },
  { id: 'gin-london-dry', nombre: 'Gin London Dry', cat: 'destilados', pres: '700 ml', precio: 32900, descuento: 0, stock: 14, ocasiones: ['previa', 'regalar'], rango: 4, alta: 20260905, img: 'p-gin', alt: 'Botella de gin transparente con bayas de enebro al lado', corto: 'Destilado · Enebro y cítricos', desc: 'Gin seco con enebro, cáscara de limón y coriandro. Con tónica, hielo y una rodaja de pomelo es el clásico de la previa.', ficha: [['Tipo', 'Gin London Dry'], ['Botánicos', 'Enebro, limón, coriandro'], ['Graduación', '40 %'], ['Servir', 'Con tónica y hielo']] },
  { id: 'cabernet-sauvignon', nombre: 'Cabernet Sauvignon', cat: 'vinos', pres: '750 ml', precio: 16500, descuento: 0, stock: 18, ocasiones: ['asado'], rango: 5, alta: 20260901, img: 'p-cabernet', alt: 'Botella de Cabernet Sauvignon con dos copas de vino tinto', corto: 'Tinto · Mendoza', desc: 'Tinto de cuerpo medio con notas de pimiento, ciruela y especias. Pide carnes a la parrilla, guisos y comidas de olla.', ficha: [['Tipo', 'Vino tinto'], ['Origen', 'Mendoza'], ['Graduación', '13,5 %'], ['Servir', 'De 16 a 18 °C']] },
  { id: 'ipa-x3', nombre: 'Cerveza IPA artesanal ×3', cat: 'cervezas', pres: '3 × 500 ml', precio: 12600, descuento: 0, stock: 16, ocasiones: ['asado', 'previa'], rango: 6, alta: 20260910, img: 'p-ipa-x3', alt: 'Tres botellas de cerveza ámbar con gotas de condensación', corto: 'Cerveza · Lupulada', desc: 'Tres botellas de IPA con lúpulo cítrico y amargor marcado. Bien fría para el asado o una juntada con amigos.', ficha: [['Tipo', 'IPA'], ['Presentación', '3 botellas de 500 ml'], ['Graduación', '6,5 %'], ['Servir', 'De 4 a 6 °C']] },
  { id: 'caja-brindis', nombre: 'Caja Brindis', cat: 'regalos', pres: 'Espumante + 2 copas', precio: 58900, descuento: 0, stock: 8, ocasiones: ['regalar', 'brindar'], rango: 7, alta: 20261010, img: 'p-caja-brindis', alt: 'Caja de regalo con un espumante y dos copas sobre viruta', corto: 'Regalo · Lista para entregar', desc: 'Caja con un Espumante Extra Brut y dos copas de cristal, sobre viruta y con tapa con moño. Lista para regalar en las fiestas.', ficha: [['Incluye', 'Espumante 750 ml y 2 copas'], ['Presentación', 'Caja con tapa y moño'], ['Ideal para', 'Fiestas y aniversarios'], ['Entrega', 'Armada, lista para regalar']] },
  { id: 'licorera-cristal', nombre: 'Licorera de cristal', cat: 'regalos', pres: '750 ml', precio: 42800, descuento: 0, stock: 2, ocasiones: ['regalar'], rango: 8, alta: 20260925, img: 'p-licorera', alt: 'Licorera de cristal tallado con tapón, con whisky adentro', corto: 'Regalo · Con tapón de cristal', desc: 'Licorera tallada con tapón de cristal, para servir whisky, ron o licores en la mesa. Se entrega vacía, en caja.', ficha: [['Material', 'Cristal tallado'], ['Capacidad', '750 ml'], ['Incluye', 'Tapón de cristal y caja'], ['Uso', 'Whisky, ron o licores']] },
  { id: 'aperitivo-rojo', nombre: 'Aperitivo Rojo Bitter', cat: 'aperitivos', pres: '750 ml', precio: 9800, descuento: 15, stock: 22, ocasiones: ['previa'], rango: 9, alta: 20260801, img: 'p-aperitivo-rojo', alt: 'Botella de aperitivo rojo junto a una naranja', corto: 'Aperitivo · Naranja amarga', desc: 'Amargo y cítrico, con naranja y hierbas. Con soda y una rodaja de naranja, o como base de un spritz.', ficha: [['Tipo', 'Aperitivo bitter'], ['Sabor', 'Naranja amarga y hierbas'], ['Graduación', '25 %'], ['Servir', 'Con soda y hielo']] },
  { id: 'estuche-vasos', nombre: 'Estuche de 2 vasos de cristal', cat: 'regalos', pres: '2 vasos tallados', precio: 36500, descuento: 0, stock: 6, ocasiones: ['regalar'], rango: 10, alta: 20261010, img: 'p-estuche-vasos', alt: 'Estuche forrado en satén con dos vasos bajos de cristal tallado', corto: 'Regalo · Cristal tallado', desc: 'Dos vasos bajos de cristal tallado en estuche forrado en satén, con moño. Para acompañar un whisky o regalar solo.', ficha: [['Material', 'Cristal tallado'], ['Incluye', '2 vasos bajos'], ['Presentación', 'Estuche de satén con moño'], ['Ideal con', 'Whisky Blend']] },
  { id: 'degustacion-x3', nombre: 'Pack degustación ×3', cat: 'cervezas', pres: '3 × 330 ml', precio: 13200, descuento: 10, stock: 10, ocasiones: ['previa', 'regalar'], rango: 11, alta: 20261005, img: 'p-degustacion', alt: 'Tres botellas de cerveza artesanal sin etiqueta sobre fondo durazno', corto: 'Cerveza · Scotch, Stout y Honey', desc: 'Una roja, una negra y una de miel para probar estilos. Lindo para regalar a quien disfruta de la cerveza artesanal.', ficha: [['Estilos', 'Scotch, Stout y Honey'], ['Presentación', '3 botellas de 330 ml'], ['Graduación', 'Entre 5 y 7 %'], ['Servir', 'De 6 a 8 °C']] },
  { id: 'torrontes', nombre: 'Torrontés', cat: 'vinos', pres: '750 ml', precio: 13900, descuento: 0, stock: 20, ocasiones: ['previa', 'brindar'], rango: 12, alta: 20260810, img: 'p-torrontes', alt: 'Botella de vino blanco con una copa servida y frutillas', corto: 'Blanco · Salta', desc: 'Blanco aromático de los Valles Calchaquíes, con flores blancas y durazno. Bien frío para entradas, pescados y comidas especiadas.', ficha: [['Tipo', 'Vino blanco'], ['Origen', 'Salta'], ['Graduación', '13 %'], ['Servir', 'De 8 a 10 °C']] },
  { id: 'amargo-hierbas', nombre: 'Amargo de Hierbas', cat: 'aperitivos', pres: '750 ml', precio: 15600, descuento: 0, stock: 12, ocasiones: ['previa', 'asado'], rango: 13, alta: 20260815, img: 'p-amargo', alt: 'Botella negra de amargo entre espigas secas', corto: 'Aperitivo · Hierbas', desc: 'Amargo oscuro de hierbas y especias, para después del asado o con cola y mucho hielo.', ficha: [['Tipo', 'Amargo'], ['Sabor', 'Hierbas y especias'], ['Graduación', '30 %'], ['Servir', 'Con cola o solo']] },
  { id: 'rosado-malbec', nombre: 'Rosado de Malbec', cat: 'vinos', pres: '750 ml', precio: 14200, descuento: 0, stock: 0, ocasiones: ['previa'], rango: 14, alta: 20260820, img: 'p-rosado', alt: 'Botella de vino rosado sobre una tabla de madera con una copa', corto: 'Rosado · Mendoza', desc: 'Rosado seco y fresco, con frutillas y cerezas. Para la tarde, ensaladas y tablas de fiambres.', ficha: [['Tipo', 'Vino rosado'], ['Origen', 'Mendoza'], ['Graduación', '12,5 %'], ['Servir', 'De 8 a 10 °C']] },
  { id: 'cerveza-golden', nombre: 'Cerveza Golden', cat: 'cervezas', pres: '500 ml', precio: 4200, descuento: 0, stock: 40, ocasiones: ['asado'], rango: 15, alta: 20260801, img: 'p-golden', alt: 'Botella de cerveza rubia con condensación', corto: 'Cerveza · Rubia', desc: 'Rubia liviana y refrescante, con cuerpo suave y poco amargor.', ficha: [['Tipo', 'Golden Ale'], ['Presentación', 'Botella de 500 ml'], ['Graduación', '5 %'], ['Servir', 'De 4 a 6 °C']] },
  { id: 'agua-tonica', nombre: 'Agua tónica', cat: 'sin-alcohol', pres: '500 ml', precio: 2900, descuento: 0, stock: 36, ocasiones: ['previa'], rango: 16, alta: 20260801, img: 'p-tonica', alt: 'Botella de agua tónica sin etiqueta con un vaso bajo', corto: 'Sin alcohol · Para gin', desc: 'Tónica de burbuja fina y amargor justo, pensada para acompañar el gin o tomar sola con limón.', ficha: [['Tipo', 'Agua tónica'], ['Presentación', 'Botella de 500 ml'], ['Graduación', 'Sin alcohol'], ['Servir', 'Bien fría']] },
  { id: 'jugo-naranja', nombre: 'Jugo de naranja exprimido', cat: 'sin-alcohol', pres: '1 L', precio: 4800, descuento: 0, stock: 14, ocasiones: ['previa'], rango: 17, alta: 20261001, img: 'p-jugo', alt: 'Botella de jugo de naranja con sorbete junto a media naranja', corto: 'Sin alcohol · Natural', desc: 'Jugo de naranja exprimido, sin azúcar agregada. Para el desayuno, para los chicos o para preparar tragos frescos.', ficha: [['Tipo', 'Jugo exprimido'], ['Presentación', 'Botella de 1 L'], ['Graduación', 'Sin alcohol'], ['Servir', 'Frío']] },
  { id: 'agua-con-gas', nombre: 'Agua con gas', cat: 'sin-alcohol', pres: '1 L', precio: 2300, descuento: 0, stock: 48, ocasiones: ['asado'], rango: 18, alta: 20260701, img: 'p-agua-con-gas', alt: 'Botella de vidrio de agua con gas con gotas de condensación', corto: 'Sin alcohol · En vidrio', desc: 'Agua mineral gasificada en botella de vidrio. Para la mesa, para cortar el vino o para tragos largos.', ficha: [['Tipo', 'Agua mineral con gas'], ['Presentación', 'Botella de vidrio de 1 L'], ['Graduación', 'Sin alcohol'], ['Servir', 'Bien fría']] },
  { id: 'gaseosa-pomelo', nombre: 'Gaseosa de pomelo rosado', cat: 'sin-alcohol', pres: '500 ml', precio: 2600, descuento: 0, stock: 30, ocasiones: ['previa'], rango: 19, alta: 20261008, img: 'p-pomelo', alt: 'Botella de gaseosa rosada con un vaso servido', corto: 'Sin alcohol · Cítrica', desc: 'Pomelo rosado con poca azúcar y mucha burbuja. Sola, con hielo, o para alargar un aperitivo.', ficha: [['Tipo', 'Gaseosa'], ['Sabor', 'Pomelo rosado'], ['Graduación', 'Sin alcohol'], ['Servir', 'Con hielo']] },
  { id: 'set-copas-x4', nombre: 'Set de 4 copas de vino', cat: 'regalos', pres: '4 copas', precio: 29900, descuento: 0, stock: 10, ocasiones: ['regalar'], rango: 20, alta: 20260920, img: 'p-set-copas', alt: 'Cuatro copas de vino de cristal embaladas con viruta de papel', corto: 'Regalo · Cristal', desc: 'Cuatro copas de cristal para tinto o blanco, embaladas en caja con viruta.', ficha: [['Material', 'Cristal'], ['Incluye', '4 copas'], ['Presentación', 'Caja con viruta'], ['Ideal con', 'Malbec Reserva']] },
  { id: 'kit-flautas', nombre: 'Kit de 2 copas flauta', cat: 'regalos', pres: '2 copas + caja', precio: 21500, descuento: 0, stock: 12, ocasiones: ['brindar', 'regalar'], rango: 21, alta: 20261015, img: 'p-kit-flautas', alt: 'Dos copas flauta con espumante junto a una caja de regalo con moño dorado', corto: 'Regalo · Para el brindis', desc: 'Dos copas flauta de cristal en caja de regalo con moño. Para acompañar un espumante en el brindis de fin de año.', ficha: [['Material', 'Cristal'], ['Incluye', '2 copas flauta'], ['Presentación', 'Caja con moño'], ['Ideal con', 'Espumante Extra Brut']] },
  { id: 'caja-regalo', nombre: 'Caja regalo con moño', cat: 'regalos', pres: 'Para 1 botella', precio: 8900, descuento: 0, stock: 25, ocasiones: ['regalar'], rango: 22, alta: 20261012, img: 'p-caja-regalo', alt: 'Caja de regalo blanca con moño negro', corto: 'Regalo · Para envolver', desc: 'Caja de cartulina blanca con moño negro, del tamaño justo para una botella de vino o espumante.', ficha: [['Material', 'Cartulina rígida'], ['Capacidad', '1 botella de 750 ml'], ['Detalle', 'Moño de cinta negra'], ['Ideal con', 'Cualquier vino o espumante']] },
  { id: 'sidra-pera', nombre: 'Sidra de pera', cat: 'vinos', pres: '750 ml', precio: 7400, descuento: 0, stock: 0, ocasiones: ['brindar'], rango: 99, alta: 20250101, visible: false, img: 'p-extra-brut', alt: '', corto: '', desc: '', ficha: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261008;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const foto = (p, chica) => `images/${p.img}${chica ? '-480' : ''}.webp`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), ocasion = lista(f.ocasion), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (ocasion.length && !ocasion.some(o => p.ocasiones.includes(o))) return false;
    if (f.precio && PRECIOS[f.precio]) {
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
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
      p.nombre, p.pres, catDe(p.cat)?.nombre, p.corto, p.desc, ...p.ficha.map(f => f[1]), ...p.ocasiones.map(o => OCASIONES[o]),
      p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '',
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

const Cart = {
  KEY: 'aromabouquet_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
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

const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const WSP_ICO = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"></use></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = p => wa(`¡Hola Aroma Bouquet! Quiero consultar por ${p.nombre} (${p.pres}).`);

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">−${p.descuento}%</span></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Aroma Bouquet! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;

function cardV(p, anim = true) {
  const acc = p.stock > 0
    ? `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}">Agregar</button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard"${anim ? ` ${ANIM_SUBIR}` : ''}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, true)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="(min-width: 1100px) 300px, (min-width: 761px) 33vw, 50vw" alt="${esc(p.alt)}" width="480" height="600"></button>
    <div class="pcard__body">
      <p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pcard__pres">${esc(p.pres)}</p>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}

function cardT(p, grande = false) {
  const add = p.stock > 0
    ? `<button type="button" class="ptile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('plus')}</button>`
    : '<span class="ptile__sin">Sin stock</span>';
  return `<article class="ptile" ${ANIM_SUBIR}>
    <button type="button" class="ptile__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, !grande)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="${grande ? '(min-width: 901px) 50vw, 100vw' : '(min-width: 901px) 25vw, 50vw'}" alt="${esc(p.alt)}" width="480" height="600"></button>
    <div class="ptile__info">
      <div><p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p><h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>${precioHTML(p)}</div>
      ${add}
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 901px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  const txt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : txt(n);
  });
  document.querySelectorAll('[data-cuenta-oca]').forEach(el => {
    const n = Tienda.contar({ ocasion: el.dataset.cuentaOca });
    el.textContent = el.closest('.chk') ? n : txt(n);
  });
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  const items = Tienda.consultar({ orden: 'destacados', limite: 8 }).items;
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardV(p, false)}</div>`).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 18;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerId = e.pointerId; startX = e.clientX; startScroll = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId !== e.pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
    vp.classList.remove('dragging');
    if (moved) vp.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

function initVitrina() {
  const cont = document.querySelector('[data-vitrina]');
  if (!cont) return;
  const ids = cont.dataset.vitrina.split(',');
  const items = Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: 8 }).items;
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const items = Tienda.consultar({ orden: 'destacados', limite: 5 }).items;
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => cardT(p, i === 0)).join('');
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const esM2 = document.body.dataset.modelo === '2';
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
  const chips = document.querySelector('[data-chips-cat]');
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), ocasion: Object.keys(OCASIONES) };
  const estado = { cat: [], ocasion: [], precio: '', stock: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.ocasion = listaURL('ocasion');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';

  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="">Todo <small>${Tienda.contar({})}</small></button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  }

  const filtrosDe = () => ({ cat: estado.cat, ocasion: estado.ocasion, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.ocasion.length) p.set('ocasion', estado.ocasion.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    try { window.history.replaceState(null, '', s ? `?${s}` : location.pathname); } catch { /* file:// */ }
  };
  const sincronizarUI = () => {
    filtrosEl.querySelectorAll('input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    filtrosEl.querySelectorAll('input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    chips?.querySelectorAll('[data-chip]').forEach(b => {
      const v = b.dataset.chip;
      b.setAttribute('aria-pressed', String(v ? estado.cat.length === 1 && estado.cat[0] === v : !estado.cat.length));
    });
    const n = (esM2 ? 0 : estado.cat.length) + estado.ocasion.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (esM2 ? cardT(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'producto' : 'productos'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : '';
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
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    estado.cat = b.dataset.chip ? [b.dataset.chip] : [];
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], ocasion: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const drawerFiltros = () => esM2 || window.matchMedia('(max-width: 1024px)').matches;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    filtrosEl.setAttribute('role', 'dialog');
    filtrosEl.setAttribute('aria-modal', 'true');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    filtrosEl.removeAttribute('role');
    filtrosEl.removeAttribute('aria-modal');
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
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => { if (!drawerFiltros()) cerrarFiltros(); });

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
  return `<div class="linea">
    <div class="linea__foto"><img src="${foto(p, true)}" alt="" width="480" height="600"></div>
    <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(p.pres)}</p></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}"><button type="button" data-linea-step="-1" data-id="${p.id}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= p.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Aroma Bouquet! Vi la web y quiero hacer una consulta.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${p.nombre} (${p.pres}) — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  return wa(`¡Hola Aroma Bouquet! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Elegí una bebida o un regalo y sumalo con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (selector && drawer) (drawer.querySelector(selector) || drawer.querySelector('button:not([disabled])'))?.focus();
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
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const comprar = p.stock > 0
    ? `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al carrito</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} unidades</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<figure class="qv__foto"><img src="${foto(p)}" alt="${esc(p.alt)}" width="900" height="1125"></figure>
  <div class="qv__info">
    <p class="pcard__cat">${esc(cat?.nombre)} · ${esc(p.corto)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="pcard__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="ficha-dl">${p.ficha.map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="rasgos">${p.ocasiones.map(o => `<span class="rasgo">${OCASIONES[o]}</span>`).join('')}</div>
    ${comprar}
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${foto(r, true)}" alt="" width="480" height="600"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  qv.querySelector('.qv__panel').setAttribute('aria-label', `Detalle: ${p.nombre}`);
  document.getElementById('ldProducto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ldProducto';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(foto(p), location.href).href, description: p.desc,
    category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
  document.head.appendChild(ld);
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
  document.getElementById('ldProducto')?.remove();
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
      const it = Cart.get().find(i => i.id === t.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const st = t.closest('.pcard, .qv__comprar')?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
    if (enCarrito >= p.stock) { showToast(`Ya tenés todas las unidades de ${p.nombre} en el carrito`); return; }
    Cart.add(p, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${p.nombre} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, v);
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id, null);
}

initCuentas();
initNavDrop();
initRail();
initVitrina();
initMosaico();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initFloats();
Cart.syncStock();
updateCartBadge();
renderCarrito();
initDelegacion();
initHeroMotion();
abrirDesdeURL();
