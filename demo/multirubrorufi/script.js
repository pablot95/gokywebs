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

const MARCA = 'MultirubroRufi';
const WSP = '5493773469187';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'hogar', nombre: 'Hogar y blanquería', corto: 'Hogar', bajada: 'Ventiladores, planchas, toallones y manteles.', img: 'images/p-ventilador.webp', alt: 'Ventilador de pie negro en un living con piso de madera', ico: 'casa' },
  { id: 'cocina', nombre: 'Cocinas y electro', corto: 'Cocinas', bajada: 'Cocinas a gas, microondas, pavas, licuadoras y más.', img: 'images/p-microondas.webp', alt: 'Microondas de acero sobre una mesada de cocina', ico: 'olla' },
  { id: 'tv', nombre: 'Televisores', corto: 'Televisores', bajada: 'Smart TV, soportes de pared y controles.', img: 'images/p-soporte-tv.webp', alt: 'Televisor amurado a la pared sobre un banco de madera', ico: 'tv' },
  { id: 'celulares', nombre: 'Celulares', corto: 'Celulares', bajada: 'Equipos, auriculares y cargadores.', img: 'images/p-celular.webp', alt: 'Celular de frente y de espaldas sobre una mesa de mármol', ico: 'celu' },
  { id: 'bazar', nombre: 'Bazar', corto: 'Bazar', bajada: 'Ollas, vasos, vajilla, frascos y termos.', img: 'images/p-utensilios.webp', alt: 'Utensilios de bambú en un portautensilios negro', ico: 'vaso' },
];
const RANGOS = {
  hasta30: { nombre: 'Hasta $30.000', max: 29999 },
  '30a100': { nombre: '$30.000 a $100.000', min: 30000, max: 100000 },
  '100a400': { nombre: '$100.000 a $400.000', min: 100001, max: 400000 },
  mas400: { nombre: 'Más de $400.000', min: 400001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Nuevos ingresos', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { Pulgadas: 'Elegí las pulgadas', Memoria: 'Elegí la memoria', Pack: 'Elegí el pack', Medida: 'Elegí la medida', Cable: 'Elegí el cable' };

const PRODUCTOS = [
  { id: 'smart-tv-4k', nombre: 'Smart TV LED 4K', cat: 'tv', tipo: 'Pulgadas', ops: [{ v: '43"', precio: 499990 }, { v: '50"', precio: 629990 }, { v: '55"', precio: 749990 }],
    descuento: 0, stock: 6, destacado: 1, alta: 12, img: 'images/p-tv.webp', alt: 'Smart TV de pantalla plana con un paisaje de montañas y lago, sobre fondo gris',
    desc: 'Imagen 4K, apps de streaming y control por voz desde el control remoto. Trae patas de apoyo y se puede amurar con soporte.', tags: ['tele', 'television', 'smart', 'led', 'netflix', 'youtube'] },
  { id: 'celular-128', nombre: 'Celular 6,6" con triple cámara', cat: 'celulares', tipo: 'Memoria', ops: [{ v: '128 GB', precio: 389990 }, { v: '256 GB', precio: 459990 }],
    descuento: 0, stock: 8, destacado: 2, alta: 13, img: 'images/p-celular.webp', alt: 'Celular azul visto de frente y de espaldas sobre una mesa de mármol',
    desc: 'Pantalla de 6,6 pulgadas, triple cámara trasera y batería para todo el día. Liberado para cualquier compañía.', tags: ['celu', 'smartphone', 'telefono', 'movil', 'android'] },
  { id: 'cocina-5-hornallas', nombre: 'Cocina a gas de acero, 5 hornallas', cat: 'cocina', tipo: null, ops: [{ v: '76 cm', precio: 689990 }],
    descuento: 0, stock: 3, destacado: 3, alta: 11, img: 'images/p-cocina.webp', alt: 'Cocina a gas de acero inoxidable con cinco hornallas y una olla negra arriba',
    desc: 'Cinco hornallas con parrillas de hierro, horno con luz y puerta de vidrio. Consultanos si la necesitás para gas natural o envasado.', tags: ['horno', 'hornallas', 'gas', 'anafe'] },
  { id: 'pava-electrica', nombre: 'Pava eléctrica de acero 1,7 L', cat: 'cocina', tipo: null, ops: [{ v: '1,7 L', precio: 42990 }],
    descuento: 10, stock: 14, destacado: 4, alta: 10, img: 'images/p-pava.webp', alt: 'Pava eléctrica de acero con manija negra sobre una mesada de mármol',
    desc: 'Corte automático al hervir y base giratoria. Para el mate, el té o el café de filtro.', tags: ['mate', 'te', 'agua', 'hervidor', 'jarra'] },
  { id: 'licuadora-vidrio', nombre: 'Licuadora con vaso de vidrio 1,5 L', cat: 'cocina', tipo: null, ops: [{ v: '1,5 L', precio: 89990 }],
    descuento: 0, stock: 7, destacado: 5, alta: 9, img: 'images/p-licuadora.webp', alt: 'Licuadora de acero con vaso de vidrio lleno de frutas y espinaca',
    desc: 'Vaso de vidrio de 1,5 litros, cuchillas de acero y perilla de velocidades con pulso. Pica hielo.', tags: ['licuado', 'batido', 'smoothie', 'jugo'] },
  { id: 'microondas-20', nombre: 'Microondas digital 20 L', cat: 'cocina', tipo: null, ops: [{ v: '20 L', precio: 219990 }],
    descuento: 0, stock: 5, destacado: 6, alta: 8, img: 'images/p-microondas.webp', alt: 'Microondas de acero con puerta negra sobre una mesada blanca',
    desc: 'Panel digital con programas rápidos, descongelado por peso y plato giratorio de vidrio.', tags: ['micro', 'microonda', 'calentar', 'descongelar'] },
  { id: 'ventilador-pie', nombre: 'Ventilador de pie de 16", 5 aspas', cat: 'hogar', tipo: null, ops: [{ v: '16"', precio: 89990 }],
    descuento: 0, stock: 9, destacado: 7, alta: 7, img: 'images/p-ventilador.webp', alt: 'Ventilador de pie negro de cinco aspas en un living con piso de madera',
    desc: 'Tres velocidades, altura regulable y base cuadrada firme. Para el verano correntino.', tags: ['verano', 'calor', 'aire', 'ventilacion'] },
  { id: 'bateria-ollas', nombre: 'Batería de ollas de acero x 4 con tapa de vidrio', cat: 'bazar', tipo: null, ops: [{ v: 'Set x 4', precio: 129990 }],
    descuento: 0, stock: 4, destacado: 8, alta: 6, img: 'images/p-ollas.webp', alt: 'Cuatro ollas y cacerolas de acero inoxidable con tapas de vidrio sobre mármol',
    desc: 'Dos ollas con asas y dos cacerolas con mango, todas con tapa de vidrio. Sirven para gas y eléctrica.', tags: ['ollas', 'cacerola', 'cocina', 'acero'] },
  { id: 'tostadora-acero', nombre: 'Tostadora de acero, 2 ranuras', cat: 'cocina', tipo: null, ops: [{ v: '2 ranuras', precio: 54990 }],
    descuento: 0, stock: 10, alta: 5, img: 'images/p-tostadora.webp', alt: 'Tostadora de acero con dos tostadas doradas saliendo de las ranuras',
    desc: 'Siete niveles de tostado, función descongelar y bandeja para las migas.', tags: ['tostadas', 'desayuno', 'pan'] },
  { id: 'batidora-mano', nombre: 'Batidora de mano, 5 velocidades', cat: 'cocina', tipo: null, ops: [{ v: 'Rosa', precio: 39990 }],
    descuento: 0, stock: 12, nuevo: true, alta: 24, img: 'images/p-batidora.webp', alt: 'Batidora de mano rosa batiendo una masa en un bowl blanco',
    desc: 'Cinco velocidades y dos pares de batidores. Liviana para tortas, cremas y merengues.', tags: ['batir', 'torta', 'reposteria', 'merengue'] },
  { id: 'licuadora-portatil', nombre: 'Licuadora portátil recargable', cat: 'cocina', tipo: null, ops: [{ v: '400 ml', precio: 27990 }],
    descuento: 0, stock: 15, nuevo: true, alta: 23, img: 'images/p-licuadora-portatil.webp', alt: 'Licuadora portátil con frutas y semillas adentro',
    desc: 'Se carga por USB y la llevás a donde quieras. Vaso de 400 ml con tapa.', tags: ['licuado', 'batido', 'usb', 'gym', 'portatil'] },
  { id: 'juego-agua', nombre: 'Juego de agua de vidrio, 7 piezas', cat: 'bazar', tipo: null, ops: [{ v: 'Jarra + 6 vasos', precio: 35000 }],
    descuento: 0, stock: 8, nuevo: true, alta: 25, img: 'images/p-juego-agua.webp', alt: 'Jarra de vidrio con agua y un vaso sobre una mesa de madera',
    desc: 'Jarra de vidrio y seis vasos al tono. Para la mesa de todos los días o para regalar.', tags: ['jarra', 'vasos', 'regalo', 'mesa'] },
  { id: 'vasos-tallados', nombre: 'Vasos de vidrio tallado', cat: 'bazar', tipo: 'Pack', ops: [{ v: 'Altos x 6', precio: 18990 }, { v: 'Bajos x 4', precio: 12990 }],
    descuento: 0, stock: 20, nuevo: true, alta: 22, img: 'images/p-vasos.webp', alt: 'Vasos de vidrio tallado con diseño cuadriculado',
    desc: 'Vidrio grueso con tallado cuadriculado. Vienen en pack de 6 altos o de 4 bajos.', tags: ['vasos', 'vidrio', 'cristaleria', 'mesa'] },
  { id: 'bowls-flores', nombre: 'Bowls de cerámica con flores x 2', cat: 'bazar', tipo: null, ops: [{ v: 'Set x 2', precio: 16990 }],
    descuento: 0, stock: 11, nuevo: true, alta: 21, img: 'images/p-bowls.webp', alt: 'Dos bowls de cerámica blanca con flores violetas pintadas',
    desc: 'Dos bowls de cerámica con flores violetas pintadas. Para cereales, ensaladas o postres.', tags: ['bowl', 'compotera', 'ceramica', 'desayuno'] },
  { id: 'toallones-algodon', nombre: 'Toallones de algodón x 3', cat: 'hogar', tipo: null, ops: [{ v: 'Blancos', precio: 32990 }],
    descuento: 0, stock: 9, nuevo: true, alta: 20, img: 'images/p-toallones.webp', alt: 'Tres toallones blancos enrollados sobre un sillón de macramé',
    desc: 'Tres toallones de algodón suave y absorbente, en blanco.', tags: ['toalla', 'baño', 'blanqueria', 'algodon'] },
  { id: 'termo-acero', nombre: 'Termo de acero inoxidable 1 L', cat: 'bazar', tipo: null, ops: [{ v: '1 L', precio: 34990 }],
    descuento: 0, stock: 13, nuevo: true, alta: 19, img: 'images/p-termo.webp', alt: 'Termo de acero inoxidable sobre una mesa de madera al aire libre',
    desc: 'Doble pared de acero: mantiene el agua caliente para el mate por horas. Pico cebador.', tags: ['mate', 'termo', 'agua', 'acero', 'camping'] },
  { id: 'mantel-antimanchas', nombre: 'Mantel antimanchas rayado', cat: 'hogar', tipo: 'Medida', ops: [{ v: 'Redondo 1,50 m', precio: 19990 }, { v: 'Rectangular 1,40 × 2 m', precio: 22990 }],
    descuento: 0, stock: 12, nuevo: true, alta: 18, img: 'images/p-mantel.webp', alt: 'Mantel rayado gris y blanco sobre una mesa redonda con dos platos',
    desc: 'Tela antimanchas que se limpia con un trapo húmedo. Rayado gris y blanco.', tags: ['mantel', 'mesa', 'cocina', 'blanqueria'] },
  { id: 'frascos-hermeticos', nombre: 'Frascos de vidrio con tapa hermética x 3', cat: 'bazar', tipo: null, ops: [{ v: 'Set x 3', precio: 19990 }],
    descuento: 0, stock: 16, nuevo: true, alta: 17, img: 'images/p-frascos.webp', alt: 'Frascos de vidrio con tapa negra con arroz y fideos',
    desc: 'Tres frascos de distintos tamaños con tapa hermética. Para fideos, arroz, yerba o legumbres.', tags: ['frasco', 'alacena', 'orden', 'yerba', 'vidrio'] },
  { id: 'vajilla-blanca', nombre: 'Juego de vajilla blanca, 12 piezas', cat: 'bazar', tipo: null, ops: [{ v: '12 piezas', precio: 59990 }],
    descuento: 15, stock: 5, alta: 4, img: 'images/p-vajilla.webp', alt: 'Platos de porcelana blanca apilados con una taza arriba',
    desc: 'Cuatro platos playos, cuatro hondos y cuatro de postre en porcelana blanca con borde texturado.', tags: ['platos', 'vajilla', 'porcelana', 'mesa'] },
  { id: 'utensilios-bambu', nombre: 'Utensilios de bambú con portautensilios', cat: 'bazar', tipo: null, ops: [{ v: 'Set x 4', precio: 14990 }],
    descuento: 0, stock: 18, alta: 3, img: 'images/p-utensilios.webp', alt: 'Espátulas y cucharas de bambú en un portautensilios negro calado',
    desc: 'Tres utensilios de bambú y un portautensilios de metal calado. No rayan las ollas.', tags: ['cuchara', 'espatula', 'madera', 'cocina'] },
  { id: 'plancha-vapor', nombre: 'Plancha a vapor con suela antiadherente', cat: 'hogar', tipo: null, ops: [{ v: 'Rosa', precio: 36990 }],
    descuento: 0, stock: 7, alta: 2, img: 'images/p-plancha.webp', alt: 'Plancha a vapor rosa y blanca parada sobre su base',
    desc: 'Vapor regulable, golpe de vapor y suela antiadherente que se desliza fácil.', tags: ['planchar', 'ropa', 'vapor'] },
  { id: 'auriculares-bt', nombre: 'Auriculares inalámbricos con estuche', cat: 'celulares', tipo: null, ops: [{ v: 'Blancos', precio: 29990 }],
    descuento: 15, stock: 10, alta: 16, img: 'images/p-auriculares.webp', alt: 'Auriculares inalámbricos blancos junto a su estuche de carga abierto',
    desc: 'Conexión Bluetooth y estuche que los carga mientras los guardás. Micrófono para llamadas.', tags: ['bluetooth', 'musica', 'auricular', 'inalambrico'] },
  { id: 'cargador-usb', nombre: 'Cargador USB de pared con cable', cat: 'celulares', tipo: 'Cable', ops: [{ v: 'USB-C', precio: 12990 }, { v: 'Micro USB', precio: 12990 }],
    descuento: 0, stock: 25, alta: 15, img: 'images/p-cargador.webp', alt: 'Cargador USB blanco de pared con su cable sobre una mesa',
    desc: 'Cargador de pared con un metro de cable. Elegí la ficha que usa tu celular.', tags: ['cargador', 'cable', 'usb', 'celu'] },
  { id: 'soporte-tv', nombre: 'Soporte de pared para TV de 32" a 65"', cat: 'tv', tipo: null, ops: [{ v: '32" a 65"', precio: 24990 }],
    descuento: 0, stock: 8, alta: 14, img: 'images/p-soporte-tv.webp', alt: 'Televisor amurado a la pared sobre un banco de madera',
    desc: 'Soporte fijo de acero para colgar la tele a la pared. Incluye tornillos y tarugos.', tags: ['soporte', 'amurar', 'pared', 'tele'] },
  { id: 'control-universal', nombre: 'Control remoto universal para TV', cat: 'tv', tipo: null, ops: [{ v: 'Universal', precio: 9990 }],
    descuento: 0, stock: 0, alta: 1, img: 'images/p-control.webp', alt: 'Control remoto negro con botones numerados sobre una mesa de madera',
    desc: 'Sirve para la mayoría de los televisores. Funciona con dos pilas AAA (no incluidas).', tags: ['control', 'remoto', 'tele'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.destacado) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([p.nombre, cat?.nombre, cat?.corto, p.desc, p.tipo, ...p.ops.map(op => op.v), ...(p.tags || [])].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

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
      if (palabras.every(w => textoDe(p).includes(w))) {
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
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];
const catDe = id => CATEGORIAS.find(c => c.id === id) || null;
const preciosDistintos = p => new Set(p.ops.map(op => op.precio)).size > 1;

const Cart = {
  KEY: 'multirubrorufi_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getProducto(i.id) && i.qty > 0) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento, el carrito vive en la página */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const op = opDe(producto, v).v;
    const tope = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, v: op, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
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

const ICO = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev: '<svg class="cat__flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  tacho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  casa: '<svg class="cat__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  olla: '<svg class="cat__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
  tv: '<svg class="cat__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/></svg>',
  celu: '<svg class="cat__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
  vaso: '<svg class="cat__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/></svg>',
};

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

function badgesHTML(p) {
  const b = [];
  if (!(p.stock > 0)) b.push('<span class="badge badge--sin">Sin stock</span>');
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo ingreso</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--ult">Últimas unidades</span>');
  return b.length ? `<div class="pcard__badges">${b.join('')}</div>` : '';
}

function precioHTML(p, op = null) {
  if (op) {
    const final = precioOp(p, op);
    return `<span class="precio${p.descuento > 0 ? ' precio--off' : ''}">${formatearPrecio(final)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}`;
  }
  const min = precioDesde(p);
  const orig = Math.min(...p.ops.map(o => o.precio));
  return `${preciosDistintos(p) ? '<span class="desde">desde</span>' : ''}<span class="precio${p.descuento > 0 ? ' precio--off' : ''}">${formatearPrecio(min)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(orig)}</s>` : ''}`;
}

function stepperHTML(nombre, max, valor = 1) {
  return `<div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button>
          <input type="number" value="${valor}" min="1" max="${Math.max(1, max)}" aria-label="Cantidad de ${esc(nombre)}" readonly>
          <button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>`;
}

function cardHTML(p, { clase = 'pgrid__item', anim = 'subir', compacta = false } = {}) {
  const cat = catDe(p.cat);
  const href = `${URL_CATALOGO}?producto=${p.id}`;
  const agotado = !(p.stock > 0);
  return `<li class="${clase}"${anim ? ANIM[anim] : ''}>
    <article class="pcard${compacta ? ' pcard--compacta' : ''}" data-id="${p.id}">
      <div class="pcard__media ph">
        <div class="pcard__img" data-qv="${p.id}"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></div>
        ${badgesHTML(p)}
      </div>
      <div class="pcard__body">
        <p class="pcard__cat">${esc(cat?.corto || '')}</p>
        <h3 class="pcard__nombre"><a href="${href}" data-qv="${p.id}">${esc(p.nombre)}</a></h3>
        <div class="pcard__precio">${precioHTML(p)}</div>
        <div class="prod-actions">
          ${compacta ? '' : stepperHTML(p.nombre, p.stock)}
          <button type="button" class="btn btn--cta prod-add" data-add="${p.id}"${agotado ? ' disabled' : ''}><span class="lbl-largo">${agotado ? 'Sin stock' : 'Agregar al carrito'}</span><span class="lbl-corto">${agotado ? 'Sin stock' : 'Agregar'}</span></button>
        </div>
        ${agotado || compacta ? '' : `<button type="button" class="pcard__ya" data-buy="${p.id}">Comprar ahora</button>`}
      </div>
    </article>
  </li>`;
}

function pickerHTML(p, modo) {
  const titulo = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const conPrecio = preciosDistintos(p);
  return `<div class="pcard__picker" data-picker role="group" aria-label="${esc(titulo)}">
    <div class="pcard__picker-head"><span>${esc(titulo)}</span><button type="button" data-picker-close aria-label="Cerrar opciones">${ICO.cerrar}</button></div>
    <div class="ops">${p.ops.map(op => `<button type="button" class="op" data-pick="${esc(op.v)}" data-modo="${modo}">${esc(op.v)}${conPrecio ? `<small>${formatearPrecio(precioOp(p, op))}</small>` : ''}</button>`).join('')}</div>
  </div>`;
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function renderNavcat() {
  const list = document.querySelector('[data-navcat-list]');
  if (!list) return;
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  list.innerHTML = CATEGORIAS.map(c => `<li class="navcat__item"><a href="${URL_CATALOGO}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}>
    <span class="navcat__thumb"><img src="${c.img}" alt="" width="1200" height="1200" loading="lazy"></span>
    <span><span class="navcat__nombre">${esc(c.nombre)}</span><span class="navcat__cant">${Tienda.contar({ cat: c.id })} productos</span></span>
  </a></li>`).join('');
}

function renderFooterCats() {
  const ul = document.querySelector('[data-footer-cats]');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
}

function renderTotales() {
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-precio-desde]').forEach(el => {
    const p = getProducto(el.dataset.precioDesde);
    if (p) el.textContent = `desde ${formatearPrecio(precioDesde(p))}`;
  });
}

function renderCats() {
  const ul = document.querySelector('[data-cats]');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li${ANIM.escala}><a class="cat__link" href="${URL_CATALOGO}?cat=${c.id}">
      <span class="cat__media ph"><img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1200" decoding="async"></span>
      <span class="cat__pie">${ICO[c.ico] || ''}<span class="cat__nombre">${esc(c.corto)}</span>${ICO.chev}</span>
    </a></li>`).join('');
}

function renderRubros() {
  const ul = document.querySelector('[data-rubros]');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}">
      <span class="rubros__thumb"><img src="${c.img}" alt="" width="1200" height="1200" decoding="async"></span>
      <span class="rubros__nombre">${esc(c.nombre)}</span>
      <span class="rubros__cant">${Tienda.contar({ cat: c.id })}</span>
    </a></li>`).join('');
}

const filtroVista = el => (el.dataset.filtro === 'nuevo' ? { filtros: { nuevo: true }, orden: 'nuevos' } : { filtros: { destacado: true }, orden: 'destacados' });

function renderRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { filtros, orden } = filtroVista(track);
  const { items } = Tienda.consultar({ filtros, orden, limite: 8 });
  track.innerHTML = items.map(p => cardHTML(cachear(p), { clase: 'rail-item', anim: 'der', compacta: true })).join('');
}

function renderVista() {
  const ul = document.querySelector('[data-vista]');
  if (!ul) return;
  const { filtros, orden } = filtroVista(ul);
  const { items } = Tienda.consultar({ filtros, orden, limite: 8 });
  ul.innerHTML = items.map(p => cardHTML(cachear(p), { compacta: true })).join('');
}

const HORARIOS = {
  1: [[8.5, 12.5], [16.5, 20.5]],
  2: [[8.5, 12.5], [16.5, 20.5]],
  3: [[8.5, 12.5], [16.5, 20.5]],
  4: [[8.5, 12.5], [16.5, 20.5]],
  5: [[8.5, 12.5], [16.5, 20.5]],
  6: [[8.5, 12.5], [16.5, 20.5]],
  0: [],
};
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const horaTxt = h => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

function ahoraArgentina(fecha = new Date()) {
  const ar = new Date(fecha.getTime() - 3 * 3600 * 1000);
  return { dia: ar.getUTCDay(), hora: ar.getUTCHours() + ar.getUTCMinutes() / 60 };
}

function estadoLocal(fecha = new Date()) {
  const { dia, hora } = ahoraArgentina(fecha);
  const turno = (HORARIOS[dia] || []).find(([a, b]) => hora >= a && hora < b);
  if (turno) return { abierto: true, texto: `Abierto ahora · cierra a las ${horaTxt(turno[1])}` };
  const proxHoy = (HORARIOS[dia] || []).find(([a]) => a > hora);
  if (proxHoy) return { abierto: false, texto: `Cerrado ahora · abre hoy a las ${horaTxt(proxHoy[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const t = HORARIOS[d];
    if (t && t.length) return { abierto: false, texto: `Cerrado ahora · abre ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${horaTxt(t[0][0])}` };
  }
  return { abierto: false, texto: 'Cerrado ahora' };
}

function initHorario() {
  const pintar = () => {
    const e = estadoLocal();
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = e.texto;
    });
    const { dia } = ahoraArgentina();
    document.querySelectorAll('[data-horario-dia]').forEach(li => li.classList.toggle('is-hoy', li.dataset.horarioDia.split(',').includes(String(dia))));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = L.latLng(-29.1039, -58.342);
    const mapa = L.map(el, { center: centro, zoom: 14, scrollWheelZoom: false, dragging: !window.matchMedia('(pointer: coarse)').matches, tap: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin', html: '<span class="pin__dot"></span>', iconSize: [44, 44], iconAnchor: [22, 22] });
    L.marker(centro, { icon: icono, keyboard: false, title: `${MARCA} · Felipe Yofre` }).addTo(mapa);
    const banda = el.closest('.local--m2');
    const ajustar = () => {
      mapa.invalidateSize();
      mapa.setView(centro, 14, { animate: false });
      if (banda && window.innerWidth > 760) mapa.panBy([-Math.round(el.clientWidth * 0.24), 0], { animate: false });
    };
    ajustar();
    window.addEventListener('load', ajustar);
    let t = 0;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(ajustar, 200); }, { passive: true });
  } catch { /* el mapa es un extra: si falla, la ficha con la dirección sigue */ }
}

function cantidadDe(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function resetStepper(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  if (input) input.value = '1';
}
function bumpBoton(btn) {
  if (!btn || reduceMotion || typeof btn.animate !== 'function') return;
  btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('[data-picker]').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  const media = card.querySelector('.pcard__media');
  if (!media) return;
  const previo = media.querySelector('[data-picker]');
  cerrarPickers();
  if (previo && previo.querySelector('[data-pick]')?.dataset.modo === modo) return;
  media.insertAdjacentHTML('beforeend', pickerHTML(p, modo));
  media.querySelector('[data-pick]')?.focus({ preventScroll: true });
}

function agregar(p, qty, v, modo, origen) {
  if (!p || !(p.stock > 0)) return;
  Cart.add(p, qty, v);
  if (modo === 'buy') { openCartDrawer(origen); return; }
  const op = opDe(p, v);
  showToast(`Sumaste ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''} al carrito.`);
}

function initProductos() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); openQV(qv.dataset.qv, qv); return; }

    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.closest('[data-stepper]')?.querySelector('input');
      if (!input) return;
      const max = parseInt(input.max, 10) || 99;
      input.value = String(Math.min(max, Math.max(1, (parseInt(input.value, 10) || 1) + Number(step.dataset.step))));
      return;
    }

    const cerrar = e.target.closest('[data-picker-close]');
    if (cerrar) { cerrar.closest('[data-picker]')?.remove(); return; }

    const pick = e.target.closest('[data-pick]');
    if (pick) {
      const card = pick.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p) return;
      const qty = cantidadDe(card);
      pick.closest('[data-picker]')?.remove();
      resetStepper(card);
      agregar(p, qty, pick.dataset.pick, pick.dataset.modo, card.querySelector('[data-add]'));
      return;
    }

    const add = e.target.closest('[data-add], [data-buy]');
    if (add) {
      const modo = add.hasAttribute('data-buy') ? 'buy' : 'add';
      const p = getProducto(add.dataset.add || add.dataset.buy);
      if (!p || !(p.stock > 0)) return;
      bumpBoton(add);
      const card = add.closest('.pcard');
      if (p.ops.length > 1) {
        if (card) abrirPicker(card, p, modo);
        else openQV(p.id, add);
        return;
      }
      const qty = cantidadDe(card);
      resetStepper(card);
      agregar(p, qty, p.ops[0].v, modo, add);
      return;
    }

    if (!e.target.closest('[data-picker]')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('[data-picker]');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus();
  });
}

function trapFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const focos = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const overlays = new Set();
function bloquearScroll(clave, on) {
  if (on) overlays.add(clave); else overlays.delete(clave);
  document.body.classList.toggle('no-scroll', overlays.size > 0);
}

const QV = { el: null, panel: null, content: null, origen: null, id: null, op: null };
function setParamProducto(id) {
  try {
    const url = new URL(location.href);
    if (id) url.searchParams.set('producto', id); else url.searchParams.delete('producto');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch { /* sin history */ }
}
function setLdProducto(p) {
  const ld = document.getElementById('ld-producto');
  if (!ld) return;
  if (!p) { ld.textContent = '{}'; return; }
  const base = 'https://gokywebs.com/demo/multirubrorufi/';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: base + p.img, description: p.desc,
    category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${base}${URL_CATALOGO}?producto=${p.id}` },
  });
}

function qvHTML(p) {
  const cat = catDe(p.cat);
  const op = QV.op;
  const agotado = !(p.stock > 0);
  const titulo = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stockTxt = agotado ? 'Sin stock por ahora. Escribinos y te avisamos cuando vuelva a entrar.' : p.stock <= 3 ? `Quedan ${p.stock} unidades.` : 'Disponible.';
  return `<div class="qv__grid">
    <div class="qv__media"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200">${badgesHTML(p)}</div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre || '')}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precio" data-qv-precio>${precioHTML(p, op)}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.ops.length > 1
        ? `<div><p class="qv__label">${esc(titulo)}</p><div class="ops" role="group" aria-label="${esc(titulo)}">${p.ops.map(o => `<button type="button" class="op" data-qv-op="${esc(o.v)}" aria-pressed="${o.v === op.v}">${esc(o.v)}${preciosDistintos(p) ? `<small>${formatearPrecio(precioOp(p, o))}</small>` : ''}</button>`).join('')}</div></div>`
        : `<p class="qv__label">Presentación: <span class="qv__valor">${esc(op.v)}</span></p>`}
      <p class="qv__stock">${stockTxt}</p>
      <div class="qv__acciones">
        ${stepperHTML(p.nombre, p.stock)}
        <button type="button" class="btn btn--cta" data-qv-add${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-buy${agotado ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola ${MARCA}! Quería consultar por: ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por WhatsApp</a>
    </div>
  </div>
  ${rel.length ? `<div class="qv__rel"><p class="qv__rel-titulo">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="1200" height="1200"><span class="qv__rel-txt"><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
}

function openQV(id, origen = null) {
  const p = getProducto(id);
  if (!p || !QV.el) return;
  cerrarPickers();
  if (!QV.el.hidden && QV.id === id) return;
  QV.id = id;
  QV.op = p.ops[0];
  if (QV.el.hidden) QV.origen = origen || document.activeElement;
  QV.content.innerHTML = qvHTML(p);
  QV.panel.scrollTop = 0;
  setParamProducto(id);
  setLdProducto(p);
  if (QV.el.hidden) {
    QV.el.hidden = false;
    bloquearScroll('qv', true);
    requestAnimationFrame(() => requestAnimationFrame(() => QV.el.classList.add('open')));
  }
  QV.panel.focus({ preventScroll: true });
}
function closeQV() {
  if (!QV.el || QV.el.hidden) return;
  QV.el.classList.remove('open');
  QV.id = null;
  setParamProducto(null);
  setLdProducto(null);
  bloquearScroll('qv', false);
  setTimeout(() => { if (!QV.el.classList.contains('open')) QV.el.hidden = true; }, reduceMotion ? 0 : 320);
  const o = QV.origen;
  QV.origen = null;
  if (o && document.contains(o)) o.focus({ preventScroll: true });
}
function initQV() {
  QV.el = document.getElementById('quickview');
  if (!QV.el) return;
  QV.panel = QV.el.querySelector('.qv__panel');
  QV.content = QV.el.querySelector('[data-qv-content]');
  QV.el.addEventListener('click', e => {
    if (e.target.closest('[data-qv-close]')) { closeQV(); return; }
    const p = getProducto(QV.id);
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      QV.op = opDe(p, opBtn.dataset.qvOp);
      QV.el.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === opBtn)));
      const precio = QV.el.querySelector('[data-qv-precio]');
      if (precio) precio.innerHTML = precioHTML(p, QV.op);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { openQV(rel.dataset.qvRel); return; }
    const add = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (add) {
      const qty = cantidadDe(QV.el);
      const modo = add.hasAttribute('data-qv-buy') ? 'buy' : 'add';
      bumpBoton(add);
      resetStepper(QV.el);
      if (modo === 'buy') {
        Cart.add(p, qty, QV.op.v);
        const origen = QV.origen;
        closeQV();
        openCartDrawer(origen);
      } else {
        agregar(p, qty, QV.op.v, 'add');
      }
    }
  });
  QV.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeQV(); return; }
    trapFoco(QV.panel, e);
  });
}

const Drawer = { el: null, bd: null, origen: null };
function renderCart(animar = false) {
  const body = document.querySelector('[data-cart-lines]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    foot.hidden = true;
    body.innerHTML = `<div class="carrito-vacio">
      <span class="carrito-vacio__ico">${ICO.carrito}</span>
      <strong>Tu carrito está vacío</strong>
      <p>Mirá los nuevos ingresos y sumá lo que necesites para tu casa.</p>
      <a class="btn btn--ink" href="${URL_CATALOGO}">Volver al catálogo ${ICO.flecha}</a>
    </div>`;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map((it, i) => {
    const p = getProducto(it.id);
    const op = opDe(p, it.v);
    return `<div class="cline${animar ? ' cline--in' : ''}" style="animation-delay:${Math.min(i * 50, 300)}ms" data-line="${p.id}" data-v="${esc(op.v)}">
      <div class="cline__img"><img src="${p.img}" alt="" width="1200" height="1200"></div>
      <div>
        <div class="cline__top">
          <div><p class="cline__nombre">${esc(p.nombre)}</p><p class="cline__op">${esc(op.v)}</p></div>
          <button type="button" class="cline__rm" data-rm aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.tacho}</button>
        </div>
        <div class="cline__row">
          <div class="stepper">
            <button type="button" data-cstep="-1" aria-label="Restar uno">${ICO.menos}</button>
            <input type="number" value="${it.qty}" min="1" max="${Math.max(1, p.stock)}" aria-label="Cantidad de ${esc(p.nombre)}" readonly>
            <button type="button" data-cstep="1" aria-label="Sumar uno">${ICO.mas}</button>
          </div>
          <span class="cline__precio">${formatearPrecio(precioOp(p, op) * it.qty)}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  const total = Cart.total();
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(total); });
  const lineas = items.map(it => { const p = getProducto(it.id); const op = opDe(p, it.v); return `- ${it.qty} × ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * it.qty)}`; });
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) wsp.href = wspLink(`Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}`);
}
function openCartDrawer(origen) {
  if (!Drawer.el) return;
  cerrarPickers();
  Drawer.origen = origen instanceof Element ? origen : document.activeElement;
  renderCart(true);
  Drawer.el.hidden = false;
  Drawer.bd.hidden = false;
  bloquearScroll('drawer', true);
  requestAnimationFrame(() => requestAnimationFrame(() => { Drawer.el.classList.add('open'); Drawer.bd.classList.add('open'); }));
  Drawer.el.focus({ preventScroll: true });
}
function closeCartDrawer() {
  if (!Drawer.el || Drawer.el.hidden) return;
  Drawer.el.classList.remove('open');
  Drawer.bd.classList.remove('open');
  bloquearScroll('drawer', false);
  setTimeout(() => { if (!Drawer.el.classList.contains('open')) { Drawer.el.hidden = true; Drawer.bd.hidden = true; } }, reduceMotion ? 0 : 380);
  const o = Drawer.origen;
  Drawer.origen = null;
  if (o && document.contains(o)) o.focus({ preventScroll: true });
}
function initCart() {
  Drawer.el = document.getElementById('cart-drawer');
  Drawer.bd = document.querySelector('[data-drawer-backdrop]');
  if (!Drawer.el || !Drawer.bd) return;
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', () => openCartDrawer(b)));
  Drawer.bd.addEventListener('click', closeCartDrawer);
  Drawer.el.addEventListener('click', e => {
    if (e.target.closest('[data-drawer-close]')) { closeCartDrawer(); return; }
    if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const line = e.target.closest('[data-line]');
    if (!line) return;
    const id = line.dataset.line, v = line.dataset.v;
    if (e.target.closest('[data-rm]')) { Cart.remove(id, v); return; }
    const st = e.target.closest('[data-cstep]');
    if (st) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(st.dataset.cstep));
    }
  });
  Drawer.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCartDrawer(); return; }
    trapFoco(Drawer.el, e);
  });
  document.addEventListener('cart:updated', () => {
    if (!Drawer.el.hidden) {
      const foco = document.activeElement;
      const linea = foco?.closest?.('[data-line]');
      const clave = linea ? [linea.dataset.line, linea.dataset.v, foco.dataset.cstep ? `[data-cstep="${foco.dataset.cstep}"]` : null] : null;
      renderCart(false);
      if (clave && clave[2]) {
        const nueva = [...Drawer.el.querySelectorAll('[data-line]')].find(l => l.dataset.line === clave[0] && l.dataset.v === clave[1]);
        (nueva?.querySelector(clave[2]) || Drawer.el).focus({ preventScroll: true });
      } else if (foco && !document.contains(foco)) Drawer.el.focus({ preventScroll: true });
    }
  });
  window.addEventListener('storage', e => { if (e.key === Cart.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });
}

function updateCartBadge(bump = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    if (bump && n) { void b.offsetWidth; b.classList.add('bump'); }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll('nav', true);
    nav.querySelector('a, .navcat__btn')?.focus();
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

function initNavcat() {
  const wrap = document.querySelector('[data-navcat]');
  if (!wrap) return;
  const btn = wrap.querySelector('.navcat__btn');
  const desk = window.matchMedia('(min-width: 981px)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let timer = 0;
  let abiertoPorHover = 0;
  const abrir = () => { clearTimeout(timer); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    if (wrap.classList.contains('open') && Date.now() - abiertoPorHover > 350) cerrar();
    else abrir();
  });
  wrap.addEventListener('mouseenter', () => { if (desk.matches && hover.matches && !wrap.classList.contains('open')) { abrir(); abiertoPorHover = Date.now(); } });
  wrap.addEventListener('mouseleave', () => { if (desk.matches && hover.matches) timer = setTimeout(cerrar, 140); });
  wrap.addEventListener('focusout', e => { if (desk.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desk.matches && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
  desk.addEventListener('change', cerrar);
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('button, input')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('[data-rail-track]');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => {
    const it = track.querySelector('.rail-item');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return it ? (it.getBoundingClientRect().width + gap) * (window.innerWidth > 1024 ? 2 : 1) : 300;
  };
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
  if (img) tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0);
  const visual = hero.querySelector('.hero__visual');
  if (visual) tl.from(visual, { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1 }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.busquedas li'), { y: 14, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.etiqueta'), { rotation: 22, y: -26, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.55)', clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.hero__estado'), { y: 12, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.9);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const rango = parseFloat(el.dataset.parallax) || 5;
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${((self.progress - 0.5) * 2 * rango).toFixed(2)}%`; },
    });
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

const Catalogo = { estado: null, cursor: null, mostrados: 0, total: 0 };
function leerURL() {
  const sp = new URLSearchParams(location.search);
  const ids = CATEGORIAS.map(c => c.id);
  const cats = (sp.get('cat') || '').split(',').map(s => s.trim()).filter(c => ids.includes(c));
  const orden = Object.prototype.hasOwnProperty.call(ORDENES, sp.get('orden')) ? sp.get('orden') : 'destacados';
  const precio = Object.prototype.hasOwnProperty.call(RANGOS, sp.get('precio')) ? sp.get('precio') : '';
  return {
    cats: MODELO === '2' ? cats.slice(0, 1) : [...new Set(cats)],
    q: (sp.get('q') || '').slice(0, 60),
    orden,
    precio,
    nuevo: sp.get('nuevo') === '1',
    oferta: sp.get('oferta') === '1',
    stock: sp.get('stock') === '1',
  };
}
function escribirURL() {
  const e = Catalogo.estado;
  const sp = new URLSearchParams();
  if (e.cats.length) sp.set('cat', e.cats.join(','));
  if (e.q) sp.set('q', e.q);
  if (e.orden !== 'destacados') sp.set('orden', e.orden);
  if (e.precio) sp.set('precio', e.precio);
  if (e.nuevo) sp.set('nuevo', '1');
  if (e.oferta) sp.set('oferta', '1');
  if (e.stock) sp.set('stock', '1');
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) sp.set('producto', prod);
  const qs = sp.toString();
  try { history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '')); } catch { /* sin history */ }
  sp.delete('producto');
  const otro = MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html';
  const qsOtro = sp.toString();
  document.querySelectorAll(`.gw-modelos__btn[href^="${otro}"]`).forEach(a => { a.setAttribute('href', otro + (qsOtro ? `?${qsOtro}` : '')); });
}
function filtrosDe() {
  const e = Catalogo.estado;
  const r = RANGOS[e.precio];
  return { cat: e.cats, nuevo: e.nuevo, oferta: e.oferta, stock: e.stock, precioMin: r?.min ?? null, precioMax: r?.max ?? null };
}
function filtrosActivos() {
  const e = Catalogo.estado;
  return (MODELO === '2' ? 0 : e.cats.length) + (e.precio ? 1 : 0) + (e.nuevo ? 1 : 0) + (e.oferta ? 1 : 0) + (e.stock ? 1 : 0);
}

function pintarCabecera() {
  const e = Catalogo.estado;
  const h1 = document.querySelector('[data-cat-h1]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-miga-actual]');
  const cat = e.cats.length === 1 ? catDe(e.cats[0]) : null;
  let titulo = 'Todo el catálogo';
  let texto = 'Cocinas, televisores, celulares, pequeños electro, bazar y blanquería. Buscá, filtrá y sumá al carrito.';
  if (cat) { titulo = cat.nombre; texto = cat.bajada; }
  else if (e.nuevo && !e.cats.length) { titulo = 'Nuevos ingresos'; texto = 'Lo último que llegó al local.'; }
  if (h1) h1.textContent = titulo;
  if (bajada) bajada.textContent = texto;
  if (miga) {
    miga.hidden = !cat && !(e.nuevo && !e.cats.length);
    miga.textContent = cat ? cat.nombre : 'Nuevos ingresos';
  }
  document.title = `${titulo === 'Todo el catálogo' ? 'Catálogo' : titulo} — ${MARCA}`;
  document.querySelectorAll('[data-navcat-list] a').forEach(a => {
    const id = new URL(a.href).searchParams.get('cat');
    if (cat && id === cat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function pintarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cats.includes(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
  ['nuevo', 'oferta', 'stock'].forEach(k => document.querySelectorAll(`input[data-f="${k}"]`).forEach(i => { i.checked = e[k]; }));
  document.querySelectorAll('[data-chip]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.chip === (e.cats[0] || ''))));
  const q = document.querySelector('[data-q]');
  if (q && q.value !== e.q) q.value = e.q;
  const clear = document.querySelector('[data-q-clear]');
  if (clear) clear.hidden = !e.q;
  const orden = document.querySelector('[data-orden]');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
  const limpiar = document.querySelector('[data-limpiar]');
  if (limpiar) limpiar.hidden = !(n || e.q || (MODELO === '2' && e.cats.length));
  const vacioWsp = document.querySelector('[data-vacio-wsp]');
  if (vacioWsp) vacioWsp.href = wspLink(e.q ? `Hola ${MARCA}! Busqué «${e.q}» en la web y no lo encontré. ¿Lo tienen en el local?` : `Hola ${MARCA}! Estoy buscando un producto que no encontré en la web.`);
}

function renderCatalogo(agregar = false) {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid) return;
  const e = Catalogo.estado;
  const res = buscarPaginado(Tienda, { q: e.q, filtros: filtrosDe(), orden: e.orden, cursor: agregar ? Catalogo.cursor : null, limite: POR_PAGINA });
  res.items.forEach(cachear);
  Catalogo.cursor = res.cursor;
  if (!agregar) { grid.innerHTML = ''; Catalogo.mostrados = 0; Catalogo.total = e.q ? null : Tienda.contar(filtrosDe()); }
  grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
  Catalogo.mostrados += res.items.length;
  if (agregar && !res.items.length) Catalogo.cursor = null;
  const vacio = document.querySelector('[data-vacio]');
  if (vacio) vacio.hidden = Catalogo.mostrados > 0;
  grid.hidden = Catalogo.mostrados === 0;
  const vermas = document.querySelector('[data-vermas]');
  if (vermas) vermas.hidden = !Catalogo.cursor;
  const info = document.querySelector('[data-vermas-info]');
  const contador = document.querySelector('[data-contador]');
  const total = Catalogo.total;
  const etiqueta = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  if (contador) {
    contador.textContent = e.q
      ? `${Catalogo.mostrados}${Catalogo.cursor ? '+' : ''} ${Catalogo.mostrados === 1 && !Catalogo.cursor ? 'resultado' : 'resultados'} para «${e.q}»`
      : etiqueta(total);
  }
  if (info) info.textContent = total != null ? `Mostrando ${Catalogo.mostrados} de ${total}` : `Mostrando ${Catalogo.mostrados}`;
  document.querySelectorAll('[data-filtros-total]').forEach(el => { el.textContent = total != null ? etiqueta(total) : `${Catalogo.mostrados}${Catalogo.cursor ? '+' : ''} resultados`; });
  pintarControles();
  if (!agregar) { pintarCabecera(); escribirURL(); }
  revelarNuevos(grid);
  refrescarTriggers();
}

function initFiltrosDrawer() {
  const panel = document.querySelector('[data-filtros]');
  if (!panel) return;
  const bd = document.querySelector('[data-filtros-backdrop]');
  const abrirBtn = document.querySelector('[data-filtros-abrir]');
  const esDrawer = () => panel.classList.contains('filtros--drawer') || window.matchMedia('(max-width: 900px)').matches;
  let origen = null;
  const abrir = () => {
    if (!esDrawer()) return;
    origen = document.activeElement;
    panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    panel.classList.add('open');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    if (bd) { bd.hidden = false; requestAnimationFrame(() => bd.classList.add('open')); }
    abrirBtn?.setAttribute('aria-expanded', 'true');
    bloquearScroll('filtros', true);
    panel.querySelector('[data-filtros-cerrar]')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    if (bd) { bd.classList.remove('open'); setTimeout(() => { if (!panel.classList.contains('open')) bd.hidden = true; }, 300); }
    abrirBtn?.setAttribute('aria-expanded', 'false');
    bloquearScroll('filtros', false);
    if (origen && document.contains(origen)) origen.focus({ preventScroll: true });
  };
  abrirBtn?.addEventListener('click', abrir);
  bd?.addEventListener('click', cerrar);
  panel.addEventListener('click', e => { if (e.target.closest('[data-filtros-cerrar]')) cerrar(); });
  panel.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (panel.classList.contains('open')) trapFoco(panel, e);
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => { if (!panel.classList.contains('filtros--drawer')) cerrar(); });
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid) return;
  Catalogo.estado = leerURL();

  const fCats = document.querySelector('[data-f-cats]');
  if (fCats) {
    fCats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"> ${esc(c.nombre)} <span class="check__cant">${Tienda.contar({ cat: c.id })}</span></label>`).join('');
  }
  const fPrecio = document.querySelector('[data-f-precio]');
  if (fPrecio) {
    fPrecio.innerHTML = `<label class="check"><input type="radio" name="precio" data-f="precio" value=""> Todos los precios</label>`
      + Object.entries(RANGOS).map(([k, r]) => `<label class="check"><input type="radio" name="precio" data-f="precio" value="${k}"> ${esc(r.nombre)}</label>`).join('');
  }
  const chips = document.querySelector('[data-chips]');
  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="" aria-pressed="false">Todos <small>${Tienda.contar({})}</small></button>`
      + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.corto)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
    chips.addEventListener('click', e => {
      const c = e.target.closest('[data-chip]');
      if (!c) return;
      Catalogo.estado.cats = c.dataset.chip ? [c.dataset.chip] : [];
      renderCatalogo();
    });
  }
  const orden = document.querySelector('[data-orden]');
  if (orden) {
    orden.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    orden.addEventListener('change', () => { Catalogo.estado.orden = Object.prototype.hasOwnProperty.call(ORDENES, orden.value) ? orden.value : 'destacados'; renderCatalogo(); });
  }
  document.querySelector('[data-filtros]')?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const est = Catalogo.estado;
    const f = i.dataset.f;
    if (f === 'cat') est.cats = [...document.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value);
    else if (f === 'precio') est.precio = i.value;
    else est[f] = i.checked;
    renderCatalogo();
  });
  const q = document.querySelector('[data-q]');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = q.value.trim().slice(0, 60); renderCatalogo(); }, 220);
  });
  document.querySelector('[data-csearch]')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    Catalogo.estado.q = (q?.value || '').trim().slice(0, 60);
    renderCatalogo();
    q?.blur();
  });
  document.querySelector('[data-q-clear]')?.addEventListener('click', () => {
    Catalogo.estado.q = '';
    if (q) { q.value = ''; q.focus(); }
    renderCatalogo();
  });
  const limpiarTodo = () => {
    Catalogo.estado = { cats: [], q: '', orden: Catalogo.estado.orden, precio: '', nuevo: false, oferta: false, stock: false };
    renderCatalogo();
  };
  document.querySelectorAll('[data-limpiar], [data-vacio-limpiar]').forEach(b => b.addEventListener('click', limpiarTodo));
  document.querySelector('[data-vermas-btn]')?.addEventListener('click', () => renderCatalogo(true));

  document.querySelectorAll('[data-hsearch]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const v = (form.querySelector('input')?.value || '').trim().slice(0, 60);
    Catalogo.estado.q = v;
    renderCatalogo();
    document.querySelector('.catalogo')?.scrollIntoView({ block: 'start' });
  }));
  document.querySelectorAll('a.hsearch-mobile').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    q?.focus({ preventScroll: true });
    document.querySelector('.catalogo')?.scrollIntoView({ block: 'start' });
  }));
  document.querySelectorAll('.main-nav a[href*="catalogo"]').forEach(a => a.addEventListener('click', e => {
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname) return;
    e.preventDefault();
    history.replaceState(null, '', url.pathname + url.search);
    Catalogo.estado = leerURL();
    renderCatalogo();
    window.scrollTo({ top: 0 });
  }));

  renderCatalogo();
  if (new URLSearchParams(location.search).get('buscar') === '1') setTimeout(() => q?.focus({ preventScroll: true }), 300);
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) openQV(id);
}

renderNavcat();
renderFooterCats();
renderTotales();
renderCats();
renderRubros();
renderRail();
renderVista();
initCatalogo();
initReveals();
initNav();
initNavcat();
initProductos();
initQV();
initCart();
initFloats();
initRail();
initFiltrosDrawer();
initHorario();
initMapa();
initHeroMotion();
initParallax();
initModelBarScroll();
updateCartBadge(false);
document.addEventListener('cart:updated', () => updateCartBadge(true));
initDeepLink();
