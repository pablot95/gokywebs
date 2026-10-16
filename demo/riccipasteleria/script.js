document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGINA = document.body.dataset.pagina || 'home';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const WSP = '5491140411160';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const POR_PAGINA = 16;
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const CATEGORIAS = [
  { id: 'tortas', nombre: 'Tortas de cumpleaños', img: 'images/p-torta.webp' },
  { id: 'tartas', nombre: 'Tartas dulces', img: 'images/p-tarta.webp' },
  { id: 'mini', nombre: 'Mini tortas', img: 'images/p-minitorta.webp' },
  { id: 'chocotortas', nombre: 'Chocotortas', img: 'images/p-chocotorta.webp' },
  { id: 'brownies', nombre: 'Brownies', img: 'images/p-brownies.webp' },
  { id: 'masas', nombre: 'Cupcakes y masas', img: 'images/p-cupcakes.webp' },
  { id: 'mesas', nombre: 'Mesas dulces', img: 'images/p-mesa-vitrina.webp' },
];

const PRECIOS = [
  { id: 'hasta-15000', nombre: 'Hasta $15.000', max: 15000 },
  { id: '15000-30000', nombre: '$15.000 a $30.000', min: 15000, max: 30000 },
  { id: 'mas-30000', nombre: 'Más de $30.000', min: 30001 },
];

const ORDENES = ['destacados', 'nuevos', 'precio-asc', 'precio-desc', 'nombre'];

const tamTorta = (a, b, c) => [
  { id: '20', nombre: '20 cm', nota: '8 a 10 porciones', precio: a },
  { id: '24', nombre: '24 cm', nota: '12 a 15 porciones', precio: b },
  { id: '28', nombre: '28 cm', nota: '18 a 20 porciones', precio: c },
];
const tamTarta = (a, b) => [
  { id: '22', nombre: '22 cm', nota: '6 a 8 porciones', precio: a },
  { id: '26', nombre: '26 cm', nota: '10 a 12 porciones', precio: b },
];

function nombreDe(lista, id) { return lista.find(x => x.id === id)?.nombre || ''; }

const Tienda = crearTienda([
  { id: 'torta-frutos-rojos', nombre: 'Torta de crema y frutos rojos', cat: 'tortas', rango: 1, alta: 12, descuento: 0,
    opciones: tamTorta(38000, 52000, 68000), meta: '3 tamaños · hasta 20 porciones', badge: 'La más pedida',
    img: 'images/p-torta.webp', alt: 'Torta de crema peinada con frutillas, arándanos, frambuesas y moras',
    desc: 'Bizcochuelo de vainilla, relleno de crema chantilly y dulce de frutos rojos, cubierta peinada y corona de frutillas, arándanos, frambuesas y moras.', tags: 'cumpleanos crema frutillas vainilla' },
  { id: 'torta-chocolate', nombre: 'Torta de chocolate y avellanas', cat: 'tortas', rango: 3, alta: 9, descuento: 0,
    opciones: tamTorta(40000, 55000, 72000), meta: '3 tamaños · hasta 20 porciones',
    img: 'images/p-torta-chocolate.webp', escena: 'images/vitrina.webp', alt: 'Torta de chocolate con rosetas de ganache y avellanas',
    desc: 'Bizcochuelo de cacao, relleno de ganache y dulce de leche, cubierta de chocolate semiamargo con rosetas y avellanas tostadas.', tags: 'cumpleanos cacao ganache dulce de leche' },
  { id: 'torta-chantilly', nombre: 'Torta Chantilly con frutillas', cat: 'tortas', rango: 9, alta: 7, descuento: 0,
    opciones: tamTorta(36000, 49000, 64000), meta: '3 tamaños · hasta 20 porciones',
    img: 'images/p-torta-chantilly.webp', escena: 'images/vitrina.webp', alt: 'Torta blanca de crema chantilly con frutos rojos',
    desc: 'Vainilla, crema chantilly y frutillas frescas en el relleno, terminada con copos de crema y frutos rojos.', tags: 'cumpleanos crema frutillas' },
  { id: 'torta-personalizada', nombre: 'Torta de cumpleaños personalizada', cat: 'tortas', rango: 5, alta: 11, descuento: 0,
    opciones: tamTorta(45000, 60000, 78000), meta: 'Relleno y colores a elección', badge: 'A tu gusto',
    img: 'images/p-torta-personalizada.webp', escena: 'images/pastelera.webp', alt: 'Torta de crema decorada con frutillas y flores sobre un giratorio',
    desc: 'Elegís el relleno y los colores; decoramos con frutas, flores comestibles o el nombre de quien cumple. Los detalles los coordinamos por WhatsApp.', tags: 'cumpleanos nombre infantil personalizada tematica' },
  { id: 'tarta-frutos-rojos', nombre: 'Tarta enrejada de frutos rojos', cat: 'tartas', rango: 7, alta: 8, descuento: 0,
    opciones: tamTarta(24000, 30000), meta: '2 tamaños · hasta 12 porciones',
    img: 'images/p-tarta.webp', alt: 'Tarta enrejada de frutos rojos recién horneada',
    desc: 'Masa sablée de manteca, relleno de frutos rojos cocidos y enrejado dorado al horno.', tags: 'pie frambuesa moras arandanos' },
  { id: 'tarta-frutillas', nombre: 'Tarta de frutillas y crema pastelera', cat: 'tartas', rango: 0, alta: 6, descuento: 0,
    opciones: tamTarta(26000, 33000), meta: '2 tamaños · hasta 12 porciones',
    img: 'images/p-tarta-frutillas.webp', escena: 'images/vitrina.webp', alt: 'Tarta de frutillas, arándanos y moras sobre crema pastelera',
    desc: 'Base crocante, crema pastelera de vainilla y frutillas, arándanos y moras con brillo.', tags: 'frutillas crema pastelera' },
  { id: 'lemon-pie', nombre: 'Lemon pie', cat: 'tartas', rango: 6, alta: 10, descuento: 0,
    opciones: tamTarta(23000, 29000), meta: '2 tamaños · hasta 12 porciones',
    img: 'images/p-lemon-pie.webp', escena: 'images/cupcakes.webp', alt: 'Lemon pie con merengue gratinado',
    desc: 'Masa quebrada, crema de limón bien ácida y merengue italiano gratinado.', tags: 'limon merengue tarta' },
  { id: 'tarteletas-frutas', nombre: 'Tarteletas de frutas (x 6)', cat: 'tartas', rango: 0, alta: 5, descuento: 0,
    precio: 15500, meta: 'Caja de 6 unidades',
    img: 'images/p-tarteleta-frutas.webp', escena: 'images/cupcakes.webp', alt: 'Tarteleta con crema pastelera, frutillas, kiwi y arándanos',
    desc: 'Seis tarteletas con crema pastelera y frutas de estación: frutillas, kiwi, arándanos y frambuesas.', tags: 'tarteleta frutas kiwi caja' },
  { id: 'tarteletas-frambuesa', nombre: 'Tarteletas de frambuesa y limón (x 12)', cat: 'tartas', rango: 0, alta: 15, descuento: 0,
    precio: 19000, meta: 'Docena surtida', badge: 'Nuevo',
    img: 'images/p-tarteletas-frambuesa.webp', escena: 'images/vitrina.webp', alt: 'Tarteletas de frambuesa y de limón con pistachos',
    desc: 'Docena surtida: frambuesas sobre crema de vainilla y crema de limón con pistachos. Ideales para la mesa dulce.', tags: 'tarteleta frambuesa limon docena mesa dulce' },
  { id: 'minitorta-frutillas', nombre: 'Mini torta de frutillas', cat: 'mini', rango: 4, alta: 17, descuento: 0,
    precio: 9800, meta: 'Individual · 1 a 2 porciones', badge: 'Nuevo',
    img: 'images/p-minitorta.webp', alt: 'Mini torta de frutillas con crema y frutos rojos',
    desc: 'Bizcocho de vainilla, crema diplomática y frutillas enteras alrededor. Coronada con frutos rojos y menta.', tags: 'individual frutillas regalo' },
  { id: 'mini-cheesecakes', nombre: 'Mini cheesecakes de maracuyá (x 6)', cat: 'mini', rango: 0, alta: 16, descuento: 0,
    precio: 16500, meta: 'Caja de 6 unidades', badge: 'Nuevo',
    img: 'images/p-mini-cheesecakes.webp', escena: 'images/mesa-dulce.webp', alt: 'Mini cheesecakes con gelée de maracuyá y merengue',
    desc: 'Base de galletita, crema de queso y gelée de maracuyá con un copo de merengue.', tags: 'cheesecake maracuya individual mesa dulce' },
  { id: 'bocaditos-chocolate', nombre: 'Bocaditos de chocolate (x 12)', cat: 'mini', rango: 0, alta: 13, descuento: 0,
    precio: 15000, meta: 'Docena',
    img: 'images/p-bocaditos-chocolate.webp', escena: 'images/mesa-dulce.webp', alt: 'Bocaditos de chocolate en capas con perla de chocolate',
    desc: 'Capas de bizcocho de cacao y mousse de chocolate, con una perla de chocolate arriba.', tags: 'chocolate mousse mesa dulce docena' },
  { id: 'mini-tarteletas', nombre: 'Mini tarteletas de frutos rojos (x 12)', cat: 'mini', rango: 0, alta: 4, descuento: 0,
    precio: 17500, meta: 'Docena',
    img: 'images/p-mini-tarteletas.webp', escena: 'images/mesa-dulce.webp', alt: 'Mini tarteletas de frutos rojos sobre una fuente con pie dorado',
    desc: 'Tarteletas de un bocado con crema de vainilla, frutillas, frambuesas y arándanos.', tags: 'tarteleta frutos rojos mesa dulce docena' },
  { id: 'brownies-caja', nombre: 'Brownies (caja x 6)', cat: 'brownies', rango: 8, alta: 3, descuento: 0,
    precio: 12500, meta: 'Caja de 6 cuadrados',
    img: 'images/p-brownies.webp', alt: 'Brownies de chocolate apilados en un plato',
    desc: 'Brownie húmedo de chocolate semiamargo, con costra crocante arriba. Cortado en cuadrados grandes.', tags: 'chocolate caja merienda regalo' },
  { id: 'brownies-mesa', nombre: 'Cuadraditos de brownie (x 24)', cat: 'brownies', rango: 0, alta: 2, descuento: 10,
    precio: 21000, meta: 'Bandeja de 24 bocados',
    img: 'images/p-brownie-cuadrados.webp', escena: 'images/brownies.webp', alt: 'Cuadraditos de brownie de chocolate',
    desc: 'Bandeja de 24 bocados de brownie para la mesa dulce o la oficina.', tags: 'chocolate bandeja mesa dulce oficina' },
  { id: 'chocotorta', nombre: 'Chocotorta', cat: 'chocotortas', rango: 2, alta: 1, descuento: 0,
    opciones: [
      { id: '20', nombre: '20 cm', nota: '8 porciones', precio: 26000 },
      { id: '24', nombre: '24 cm', nota: '12 porciones', precio: 34000 },
      { id: 'bandeja', nombre: 'Bandeja 30 × 20', nota: '20 porciones', precio: 46000 },
    ], meta: '3 tamaños · hasta 20 porciones',
    img: 'images/p-chocotorta.webp', alt: 'Chocotorta en capas con dulce de leche y galletitas de chocolate',
    desc: 'Galletitas de chocolate, dulce de leche y queso crema, en capas bien cargadas y con lluvia de galletita por arriba.', tags: 'chocolinas dulce de leche clasica' },
  { id: 'chocotorta-porcion', nombre: 'Chocotorta individual', cat: 'chocotortas', rango: 0, alta: 18, descuento: 0,
    precio: 6500, meta: 'Porción en su cajita', badge: 'Nuevo',
    img: 'images/p-chocotorta-porcion.webp', escena: 'images/chocotorta.webp', alt: 'Porción de chocotorta con capas de dulce de leche',
    desc: 'Una porción generosa en su cajita, para el antojo de la tarde.', tags: 'porcion individual chocolinas' },
  { id: 'cupcakes-chocolate', nombre: 'Cupcakes de chocolate (x 6)', cat: 'masas', rango: 10, alta: 14, descuento: 0,
    precio: 14000, meta: 'Caja de 6 unidades',
    img: 'images/p-cupcakes-chocolate.webp', escena: 'images/cupcakes.webp', alt: 'Cupcakes de chocolate con crema de cacao y virutas',
    desc: 'Cupcake de cacao con frosting de chocolate y virutas. Caja de seis.', tags: 'cupcake chocolate merienda cumpleanos' },
  { id: 'cupcakes-vainilla', nombre: 'Cupcakes de vainilla y frutos rojos (x 6)', cat: 'masas', rango: 0, alta: 19, descuento: 0,
    precio: 14000, meta: 'Caja de 6 unidades', badge: 'Nuevo',
    img: 'images/p-cupcakes-vainilla.webp', escena: 'images/cupcakes.webp', alt: 'Cupcakes de vainilla con crema, frambuesas y arándanos',
    desc: 'Cupcake de vainilla con crema batida, frambuesas y arándanos. Caja de seis.', tags: 'cupcake vainilla frutos rojos merienda' },
  { id: 'profiteroles', nombre: 'Profiteroles de crema (x 12)', cat: 'masas', rango: 0, alta: 20, descuento: 0,
    precio: 13500, meta: 'Docena',
    img: 'images/p-profiteroles.webp', escena: 'images/vitrina.webp', alt: 'Profiteroles rellenos de crema con azúcar impalpable',
    desc: 'Masa choux crocante rellena de crema pastelera, con azúcar impalpable.', tags: 'profiterol choux crema masas secas docena' },
  { id: 'eclairs', nombre: 'Éclairs de chocolate (x 6)', cat: 'masas', rango: 0, alta: 21, descuento: 0,
    precio: 15000, meta: 'Caja de 6 unidades',
    img: 'images/p-eclairs.webp', escena: 'images/vitrina.webp', alt: 'Éclairs con cobertura de chocolate y avellanas',
    desc: 'Masa choux rellena de crema de vainilla, cubierta de chocolate y avellanas picadas.', tags: 'eclair choux chocolate masas' },
  { id: 'caja-masas', nombre: 'Caja surtida de masas (x 12)', cat: 'masas', rango: 0, alta: 22, descuento: 0,
    precio: 18500, meta: 'Docena surtida',
    img: 'images/p-cupcakes.webp', alt: 'Cupcakes, tarteletas de frutas y lemon pie en la vitrina',
    desc: 'Cupcakes, tarteletas, lemon pie y profiteroles: una caja para la merienda o para regalar.', tags: 'surtido regalo merienda docena' },
  { id: 'mesa-dulce', nombre: 'Mesa dulce a medida', cat: 'mesas', rango: 11, alta: -2, descuento: 0,
    medida: true, meta: 'Para tu evento · a cotizar',
    img: 'images/p-mesa-dulce.webp', escena: 'images/mesa-dulce.webp', alt: 'Mesa dulce con mini cheesecakes, tarteletas y bocaditos de chocolate',
    desc: 'Armamos la mesa según tu evento y la cantidad de invitados: torta principal, mini tortas, tarteletas, bocaditos y masas. Escribinos con la fecha y te pasamos una propuesta con precio.', tags: 'evento cumpleanos bautismo baby shower casamiento empresa presupuesto' },
  { id: 'mesa-tortas-masas', nombre: 'Mesa dulce de tortas y masas', cat: 'mesas', rango: 0, alta: -1, descuento: 0,
    medida: true, meta: 'Para fiestas grandes · a cotizar',
    img: 'images/p-mesa-vitrina.webp', escena: 'images/vitrina.webp', alt: 'Mesa con tortas en altura, profiteroles, tarteletas y éclairs',
    desc: 'Dos o tres tortas en altura con profiteroles, tarteletas y éclairs, pensada para cumpleaños grandes y fiestas de fin de año.', tags: 'evento fiesta fin de ano tortas presupuesto' },
  { id: 'torta-zanahoria', nombre: 'Torta de zanahoria', cat: 'tortas', rango: 0, alta: 0, descuento: 0, visible: false,
    precio: 30000, img: 'images/p-torta.webp', alt: 'Próximamente', desc: 'Próximamente.' },
], {
  tope: 100,
  texto: p => [p.nombre, nombreDe(CATEGORIAS, p.cat), p.desc, p.meta, p.tags, (p.opciones || []).map(o => `${o.nombre} ${o.nota}`).join(' '), p.medida ? 'a medida cotizar presupuesto' : ''].join(' '),
});

function crearTienda(coleccion, { tope = 100, texto = p => p.nombre } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm(texto(p))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => (p.opciones?.length ? Math.min(...p.opciones.map(o => o.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(desde(p) * (1 - p.descuento / 100)) : desde(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (lista(f.excluir).includes(p.id)) return false;
    if (f.destacado === true && !(p.rango > 0)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if ((f.precioMin != null || f.precioMax != null) && p.medida) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const t = indice.get(p.id) || '';
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const conPrecio = (a, b) => (a.medida ? 1 : 0) - (b.medida ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => conPrecio(a, b) || final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => conPrecio(a, b) || final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conOpciones = p => (p?.opciones || []).length > 0;
const opcionDe = (p, v) => (p?.opciones || []).find(o => o.id === v) || null;
const precioBase = (p, v) => opcionDe(p, v)?.precio ?? (conOpciones(p) ? Math.min(...p.opciones.map(o => o.precio)) : p.precio);
const precioFinal = (p, v) => {
  const b = precioBase(p, v);
  return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b;
};
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const msgMedida = p => `Hola Ricci, quiero cotizar: ${p.nombre}. Fecha del evento: · Invitados: `;

const ICON = {
  carrito: '<svg aria-hidden="true"><use href="#i-carrito"/></svg>',
  wsp: '<svg aria-hidden="true"><use href="#i-wsp"/></svg>',
  flecha: '<svg aria-hidden="true"><use href="#i-flecha"/></svg>',
  cerrar: '<svg aria-hidden="true"><use href="#i-cerrar"/></svg>',
  reloj: '<svg aria-hidden="true"><use href="#i-reloj"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12h14"/></svg>',
  tamano: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/></g></svg>',
  basura: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5"/></svg>',
};

const Cart = {
  KEY: 'riccipasteleria_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { console.warn('No se pudo guardar el carrito', err); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === (v || ''));
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v: v || '', qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === (v || '')); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
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

const HORARIO = [
  { dias: [1, 2, 3, 4, 5], abre: 9, cierra: 19 },
  { dias: [6], abre: 9, cierra: 14 },
  { dias: [0], abre: null, cierra: null },
];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function ahoraBA() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => partes.find(p => p.type === t)?.value;
    const mapa = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dia = mapa[get('weekday')];
    const hora = Number(get('hour')) + Number(get('minute')) / 60;
    if (dia == null || Number.isNaN(hora)) throw new Error('fecha');
    return { dia, hora };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), hora: d.getHours() + d.getMinutes() / 60 };
  }
}
function estadoHorario({ dia, hora } = ahoraBA()) {
  const hoy = HORARIO.find(h => h.dias.includes(dia));
  if (hoy && hoy.abre != null && hora >= hoy.abre && hora < hoy.cierra) {
    return { abierto: true, texto: `Abierto ahora · hasta las ${hoy.cierra} h` };
  }
  for (let k = 0; k < 8; k++) {
    const d = (dia + k) % 7;
    const h = HORARIO.find(x => x.dias.includes(d));
    if (!h || h.abre == null) continue;
    if (k === 0 && hora >= h.abre) continue;
    const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, texto: `Cerrado · abrimos ${cuando} a las ${h.abre} h` };
  }
  return { abierto: false, texto: 'Consultanos por WhatsApp' };
}
function initHorario() {
  const pintar = () => {
    const ahora = ahoraBA();
    const est = estadoHorario(ahora);
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.textContent = est.texto;
      el.classList.toggle('estado--abierto', est.abierto);
    });
    document.querySelectorAll('[data-dias]').forEach(li => {
      const dias = li.dataset.dias.split(',').map(Number);
      li.classList.toggle('hoy', dias.includes(ahora.dia));
    });
  };
  pintar();
  setInterval(pintar, 60000);
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
function sincronizarBarraModelos() {
  if (PAGINA !== 'catalogo') return;
  const otro = document.querySelector(`.gw-modelos__btn[data-modelo="${MODELO === '2' ? '1' : '2'}"]`);
  if (!otro) return;
  const base = MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html';
  otro.setAttribute('href', base + location.search);
}

function initNavCats() {
  const box = document.querySelector('[data-nav-cats]');
  if (!box) return;
  const btn = box.querySelector('.nav-cats__btn');
  const panel = box.querySelector('.nav-cats__panel');
  const activas = PAGINA === 'catalogo' ? catsDeURL() : [];
  panel.innerHTML = CATEGORIAS.map(c => {
    const cur = activas.length === 1 && activas[0] === c.id ? ' aria-current="page"' : '';
    return `<a class="cat-link" href="${CATALOGO_URL}?cat=${c.id}"${cur}><img src="${c.img}" alt="" width="44" height="44" loading="lazy"><span class="cat-link__nombre">${esc(c.nombre)}</span><span class="cat-link__n">${Tienda.contar({ cat: [c.id] })}</span></a>`;
  }).join('') + `<a class="cat-link cat-link--todo" href="${CATALOGO_URL}">Ver todo el catálogo${ICON.flecha}</a>`;
  const desk = window.matchMedia('(min-width: 961px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); box.classList.add('abierto'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); box.classList.remove('abierto'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  box.addEventListener('mouseenter', () => { if (desk.matches && hover.matches) abrir(); });
  box.addEventListener('mouseleave', () => { if (desk.matches && hover.matches) t = setTimeout(cerrar, 140); });
  document.addEventListener('click', e => { if (desk.matches && !panel.hidden && !box.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && desk.matches) { cerrar(); btn.focus(); } });
  desk.addEventListener('change', cerrar);
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
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHeaderSearch() {
  const form = document.querySelector('[data-header-search]');
  if (!form) return;
  form.setAttribute('action', CATALOGO_URL);
  form.addEventListener('submit', e => {
    const valor = form.querySelector('input')?.value.trim() || '';
    if (PAGINA === 'catalogo') {
      e.preventDefault();
      const q = document.getElementById('q');
      if (q) { q.value = valor || q.value; q.dispatchEvent(new Event('input', { bubbles: true })); q.focus(); q.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); }
      return;
    }
    e.preventDefault();
    location.href = `${CATALOGO_URL}?q=${encodeURIComponent(valor)}`;
  });
}

function precioHTML(p, v) {
  if (p.medida) return '<p class="card__precio card__precio--medida">A cotizar</p>';
  const desde = conOpciones(p) && !v ? '<span class="card__desde">desde</span>' : '';
  const orig = p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, v))}</s><span class="off">-${p.descuento}%</span>` : '';
  return `<p class="card__precio">${desde}<span class="card__monto">${formatearPrecio(precioFinal(p, v))}</span>${orig}</p>`;
}
function badgeDe(p) {
  if (p.descuento > 0) return `Ahorrás ${p.descuento}%`;
  return p.badge || '';
}
function cardHTML(p) {
  const badge = badgeDe(p) ? `<span class="card__badge">${esc(badgeDe(p))}</span>` : '';
  const meta = p.meta ? `<p class="card__meta">${esc(p.meta)}</p>` : '';
  let acciones;
  if (p.medida) {
    acciones = `<a class="prod-add prod-add--alt" href="${wspHref(msgMedida(p))}" target="_blank" rel="noopener" aria-label="Cotizar ${esc(p.nombre)} por WhatsApp">${ICON.wsp}<span class="lbl">Cotizar</span></a>`;
  } else if (conOpciones(p)) {
    acciones = `<button type="button" class="prod-add prod-add--alt" data-quick="${p.id}" aria-label="Elegir tamaño de ${esc(p.nombre)}">${ICON.tamano}<span class="lbl"><span class="lbl-largo">Elegir tamaño</span><span class="lbl-corto">Tamaño</span></span></button>`;
  } else {
    acciones = `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><output aria-label="Cantidad">1</output><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span class="lbl">Agregar</span></button>`;
  }
  return `<article class="card" data-id="${p.id}"><button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><span class="recorte"><img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" decoding="async"></span>${badge}</button><div class="card__info"><h3 class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</h3>${meta}${precioHTML(p)}</div><div class="prod-actions">${acciones}</div></article>`;
}
const liHTML = p => `<li class="prod" data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`;

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

let railIds = [];
function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const n = Tienda.contar({ cat: [el.dataset.catCount] });
    el.textContent = n === 1 ? '1 opción' : `${n} opciones`;
  });
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = total; });
  const track = document.getElementById('railTrack');
  if (track) {
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    railIds = items.map(p => p.id);
    track.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p)}</li>`).join('');
  }
  const grid = document.getElementById('prevGrid');
  if (grid) {
    const mosaico = grid.classList.contains('mosaico');
    const { items } = Tienda.consultar({ filtros: { excluir: railIds }, orden: 'nuevos', limite: mosaico ? 7 : 8 });
    const tile = mosaico ? `<li class="prod mosaico__tile" data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="mosaico__ver" href="${CATALOGO_URL}"><span class="mosaico__num">${total}</span><span class="mosaico__txt">productos en la tienda${ICON.flecha}</span></a></li>` : '';
    grid.innerHTML = items.map(liHTML).join('') + tile;
  }
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { vp.classList.add('dragging'); }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const destino = dx => {
    const pista = vp.firstElementChild;
    const inicio = parseFloat(getComputedStyle(pista).paddingInlineStart) || 0;
    const posiciones = [...pista.children].map(c => c.offsetLeft - inicio).filter(x => x >= 0);
    const max = vp.scrollWidth - vp.clientWidth;
    if (!posiciones.length) return vp.scrollLeft;
    let elegido;
    if (Math.abs(dx) > 60) {
      elegido = dx < 0 ? posiciones.find(x => x > startScroll + 2) : [...posiciones].reverse().find(x => x < startScroll - 2);
    }
    if (elegido == null) elegido = posiciones.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a));
    return Math.min(Math.max(elegido, 0), max);
  };
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
      const dx = (e?.clientX ?? startX) - startX;
      vp.scrollTo({ left: destino(dx), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), reduceMotion ? 0 : 480);
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
function initRails() {
  const vp = document.getElementById('railVp');
  if (vp) {
    initRailDrag(vp);
    const track = vp.querySelector('.rail-track');
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    const paso = () => {
      const card = track?.firstElementChild;
      if (!card) return vp.clientWidth * .8;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return (card.getBoundingClientRect().width + gap) * Math.max(1, Math.floor(vp.clientWidth / (card.getBoundingClientRect().width + gap)) - 0);
    };
    const sync = () => {
      if (!prev || !next || !track) return;
      prev.disabled = vp.scrollLeft <= 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }
  if (MODELO === '2') initRailDrag(document.querySelector('[data-cats-vp]'));
}

function catsDeURL() {
  const valor = new URLSearchParams(location.search).get('cat') || '';
  const validas = CATEGORIAS.map(c => c.id);
  return [...new Set(valor.split(',').map(s => s.trim()).filter(s => validas.includes(s)))];
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('catGrid');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('catVacio');
  const masInfo = document.querySelector('[data-mas-info]');
  const q = document.getElementById('q');
  const orden = document.getElementById('orden');
  const fCats = document.querySelector('[data-f-cats]');
  const fPrecios = document.querySelector('[data-f-precios]');
  const activos = document.querySelector('[data-activos]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const migaTienda = document.querySelector('[data-miga-tienda]');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const estado = {
    cat: catsDeURL(),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.includes(params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;
  q.value = estado.q;
  orden.value = estado.orden;

  fCats.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="f-check__n" data-n-cat="${c.id}">0</span></label>`).join('');
  fPrecios.innerHTML = [{ id: '', nombre: 'Todos' }, ...PRECIOS].map(x => `<label class="f-chip"><input type="radio" name="precio" value="${x.id}"><span>${esc(x.nombre)}</span></label>`).join('');

  const rango = id => { const r = PRECIOS.find(x => x.id === id); return r ? { precioMin: r.min ?? null, precioMax: r.max ?? null } : {}; };
  const filtrosDe = (sin = {}) => {
    const f = {};
    if (!sin.cat && estado.cat.length) f.cat = estado.cat;
    if (!sin.precio && estado.precio) Object.assign(f, rango(estado.precio));
    if (!sin.q && estado.q) f.q = estado.q;
    return f;
  };
  const sincronizarControles = () => {
    fCats.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cat.includes(i.value); });
    fPrecios.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  };
  const pintarConteos = () => {
    CATEGORIAS.forEach(c => {
      const n = Tienda.contar({ ...filtrosDe({ cat: true }), cat: [c.id] });
      const el = fCats.querySelector(`[data-n-cat="${c.id}"]`);
      if (el) { el.textContent = n; el.closest('.f-check')?.classList.toggle('sin-resultados', n === 0); }
    });
  };
  const pintarActivos = () => {
    const chips = [];
    estado.cat.forEach(id => chips.push(`<button type="button" class="activo" data-quitar="cat" data-valor="${id}">${esc(nombreDe(CATEGORIAS, id))}${ICON.cerrar}<span class="sr-only">Quitar filtro</span></button>`));
    if (estado.precio) chips.push(`<button type="button" class="activo" data-quitar="precio">${esc(nombreDe(PRECIOS, estado.precio))}${ICON.cerrar}<span class="sr-only">Quitar filtro</span></button>`);
    if (estado.q) chips.push(`<button type="button" class="activo" data-quitar="q">«${esc(estado.q)}»${ICON.cerrar}<span class="sr-only">Quitar búsqueda</span></button>`);
    activos.innerHTML = chips.join('');
    activos.hidden = !chips.length;
    const n = estado.cat.length + (estado.precio ? 1 : 0);
    const badge = document.querySelector('[data-n-filtros]');
    if (badge) { badge.textContent = n; badge.hidden = !n; }
  };
  const pintarMigas = () => {
    if (!migaCat) return;
    if (estado.cat.length === 1) {
      migaCat.textContent = nombreDe(CATEGORIAS, estado.cat[0]);
      migaCat.setAttribute('aria-current', 'page');
      migaCat.hidden = false;
      migaTienda?.removeAttribute('aria-current');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
      migaTienda?.setAttribute('aria-current', 'page');
    }
  };
  const sincronizarURL = () => {
    const sp = new URLSearchParams();
    if (estado.cat.length) sp.set('cat', estado.cat.join(','));
    if (estado.precio) sp.set('precio', estado.precio);
    if (estado.q) sp.set('q', estado.q);
    if (estado.orden !== 'destacados') sp.set('orden', estado.orden);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod && QV.p?.id === prod) sp.set('producto', prod);
    const qs = sp.toString().replace(/%2C/g, ',');
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    sincronizarBarraModelos();
  };
  function pintar(reiniciar) {
    const filtros = filtrosDe();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const pagina = Tienda.consultar({ filtros, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = pagina.cursor;
    grid.insertAdjacentHTML('beforeend', pagina.items.map(liHTML).join(''));
    mostrados += pagina.items.length;
    const total = Tienda.contar(filtros);
    document.querySelectorAll('[data-total]').forEach(el => { el.textContent = total; });
    const txt = document.querySelector('[data-total-txt]');
    if (txt) txt.textContent = total === 1 ? 'producto' : 'productos';
    vacio.hidden = total > 0;
    const vq = vacio.querySelector('[data-vacio-q]');
    if (vq) vq.textContent = estado.q ? `«${estado.q}»` : 'productos con esos filtros';
    const vw = vacio.querySelector('[data-vacio-wsp]');
    if (vw) vw.setAttribute('href', wspHref(`Hola Ricci, busco algo que no encontré en la tienda: ${estado.q}`));
    verMas.hidden = !cursor;
    masInfo.textContent = total ? `Estás viendo ${mostrados} de ${total}` : '';
    revelarNuevos(grid);
    refrescarScroll();
  }
  const aplicar = () => {
    sincronizarControles();
    pintarConteos();
    pintarActivos();
    pintarMigas();
    sincronizarURL();
    pintar(true);
  };
  fCats.addEventListener('change', e => {
    const i = e.target.closest('input[data-f="cat"]');
    if (!i) return;
    estado.cat = [...fCats.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value);
    aplicar();
  });
  fPrecios.addEventListener('change', e => {
    const i = e.target.closest('input[name="precio"]');
    if (!i) return;
    estado.precio = i.value;
    aplicar();
  });
  let tBusca = 0;
  q.addEventListener('input', () => {
    clearTimeout(tBusca);
    tBusca = setTimeout(() => { estado.q = q.value.trim().slice(0, 60); aplicar(); }, 220);
  });
  document.getElementById('buscador')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(tBusca);
    estado.q = q.value.trim().slice(0, 60);
    aplicar();
  });
  orden.addEventListener('change', () => { estado.orden = ORDENES.includes(orden.value) ? orden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => {
    const antes = grid.children.length;
    pintar(false);
    grid.children[antes]?.querySelector('.card__foto')?.focus({ preventScroll: true });
  });
  const limpiar = () => { estado.cat = []; estado.precio = ''; estado.q = ''; q.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    if (b.dataset.quitar === 'cat') estado.cat = estado.cat.filter(id => id !== b.dataset.valor);
    if (b.dataset.quitar === 'precio') estado.precio = '';
    if (b.dataset.quitar === 'q') { estado.q = ''; q.value = ''; }
    aplicar();
  });
  initFiltrosMobile();
  sincronizarControles();
  pintarConteos();
  pintarActivos();
  pintarMigas();
  sincronizarBarraModelos();
  pintar(true);
  if (params.has('q') && !params.get('producto')) setTimeout(() => q.focus({ preventScroll: true }), 300);
}

function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const Capas = [];
function abrirCapa(capa) {
  if (!Capas.includes(capa)) Capas.push(capa);
  document.body.classList.add('no-scroll');
}
function cerrarCapa(capa) {
  const i = Capas.indexOf(capa);
  if (i >= 0) Capas.splice(i, 1);
  if (!Capas.length) document.body.classList.remove('no-scroll');
}
document.addEventListener('keydown', e => {
  const top = Capas[Capas.length - 1];
  if (!top) return;
  if (e.key === 'Escape') { e.preventDefault(); top.cerrar(); return; }
  atrapar(top.el, e);
});

function initFiltrosMobile() {
  const panel = document.getElementById('filtros');
  const abrirBtn = document.querySelector('[data-filtros-abrir]');
  if (!panel || !abrirBtn) return;
  const fondo = document.getElementById('overlayFondo');
  const mq = window.matchMedia('(max-width: 1024px)');
  const capa = { el: panel, cerrar: () => cerrar() };
  const abrir = () => {
    if (!mq.matches) return;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Filtros de la tienda');
    panel.classList.add('open');
    abrirBtn.setAttribute('aria-expanded', 'true');
    if (fondo) { fondo.hidden = false; requestAnimationFrame(() => fondo.classList.add('open')); fondo.onclick = () => cerrar(); }
    abrirCapa(capa);
    panel.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    panel.removeAttribute('aria-label');
    abrirBtn.setAttribute('aria-expanded', 'false');
    if (fondo && !document.querySelector('.drawer.open')) { fondo.classList.remove('open'); setTimeout(() => { if (!fondo.classList.contains('open')) fondo.hidden = true; }, 300); }
    cerrarCapa(capa);
    abrirBtn.focus();
  };
  abrirBtn.addEventListener('click', abrir);
  panel.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

const QV = { p: null, v: '', qty: 1, opener: null };
function qvHTML(p) {
  const fotos = [p.img, p.escena].filter(Boolean);
  const rel = Tienda.consultar({ filtros: { cat: p.cat === 'mesas' ? ['mini', 'masas'] : p.cat, excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  const thumbs = fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-qv-foto="${i}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1}"><img src="${f}" alt="" width="68" height="68"></button>`).join('')}</div>` : '';
  const opciones = conOpciones(p) ? `<div><p class="qv__label" id="qvOpLabel">Tamaño</p><div class="chips" role="group" aria-labelledby="qvOpLabel">${p.opciones.map(o => `<button type="button" class="chip" data-op="${o.id}" aria-pressed="${QV.v === o.id}">${esc(o.nombre)}<small>${esc(o.nota)} · ${formatearPrecio(precioFinal(p, o.id))}</small></button>`).join('')}</div></div>` : '';
  const compra = p.medida
    ? `<div class="qv__compra"><a class="btn btn--cta" href="${wspHref(msgMedida(p))}" target="_blank" rel="noopener">${ICON.wsp}Cotizar por WhatsApp</a></div><p class="qv__nota">${ICON.reloj}<span>Contanos la fecha y la cantidad de invitados: te pasamos una propuesta con precio.</span></p>`
    : `<div class="qv__compra"><div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICON.menos}</button><output id="qvQty" aria-label="Cantidad">1</output><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICON.mas}</button></div><button type="button" class="btn btn--cta" data-qv-add>${ICON.carrito}Agregar al carrito</button><button type="button" class="btn btn--ghost" data-qv-buy>Comprar ahora</button></div><p class="qv__nota">${ICON.reloj}<span>Se hace por encargo: el día de retiro lo coordinamos por WhatsApp.</span></p>`;
  const relHTML = rel.length ? `<div class="qv__rel"><p class="qv__label">También te puede gustar</p><div class="qv__rel-lista">${rel.map(r => `<button type="button" class="qv__rel-item" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : '';
  return `<div class="qv__galeria"><div class="qv__foto"><img id="qvImg" src="${fotos[0]}" alt="${esc(p.alt)}" width="720" height="720"></div>${thumbs}</div><div class="qv__info"><p class="qv__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p><h2 class="qv__nombre">${esc(p.nombre)}</h2><p class="qv__precio" id="qvPrecio">${qvPrecio(p)}</p>${opciones}<p class="qv__desc">${esc(p.desc)}</p>${compra}${relHTML}</div>`;
}
function qvPrecio(p) {
  if (p.medida) return 'A cotizar';
  const orig = p.descuento > 0 ? ` <s>${formatearPrecio(precioBase(p, QV.v))}</s> <span class="off">-${p.descuento}%</span>` : '';
  return `${formatearPrecio(precioFinal(p, QV.v))}${orig}`;
}
function ldProducto(p) {
  let s = document.getElementById('ldProducto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
  const base = 'https://gokywebs.com/demo/riccipasteleria/';
  const data = { '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: base + p.img, category: nombreDe(CATEGORIAS, p.cat), brand: { '@type': 'Brand', name: 'RICCI pastelería' } };
  if (!p.medida) data.offers = { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p, conOpciones(p) ? p.opciones[0].id : ''), availability: 'https://schema.org/PreOrder', url: `${base}${CATALOGO_URL}?producto=${p.id}` };
  s.textContent = JSON.stringify(data);
}
const capaQV = { el: null, cerrar: () => cerrarQV() };
function abrirQV(id, opener) {
  const fondo = document.getElementById('qv');
  const body = document.getElementById('qvBody');
  const p = getProducto(id);
  if (!fondo || !body || !p) return;
  const yaAbierto = !fondo.hidden;
  QV.p = p;
  QV.v = conOpciones(p) ? p.opciones[0].id : '';
  QV.qty = 1;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  body.innerHTML = qvHTML(p);
  body.scrollTop = 0;
  fondo.querySelector('.qv').scrollTop = 0;
  ldProducto(p);
  if (!yaAbierto) {
    fondo.hidden = false;
    capaQV.el = fondo.querySelector('.qv');
    requestAnimationFrame(() => requestAnimationFrame(() => fondo.classList.add('open')));
    abrirCapa(capaQV);
  }
  fondo.querySelector('[data-qv-close]')?.focus({ preventScroll: true });
  if (PAGINA === 'catalogo') {
    const sp = new URLSearchParams(location.search);
    sp.set('producto', p.id);
    history.replaceState(null, '', `?${sp.toString().replace(/%2C/g, ',')}`);
    sincronizarBarraModelos();
  }
}
function cerrarQV() {
  const fondo = document.getElementById('qv');
  if (!fondo || fondo.hidden) return;
  fondo.classList.remove('open');
  cerrarCapa(capaQV);
  setTimeout(() => { if (!fondo.classList.contains('open')) fondo.hidden = true; }, reduceMotion ? 0 : 300);
  if (PAGINA === 'catalogo') {
    const sp = new URLSearchParams(location.search);
    sp.delete('producto');
    const qs = sp.toString().replace(/%2C/g, ',');
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    sincronizarBarraModelos();
  }
  const op = QV.opener;
  QV.p = null;
  if (op && document.contains(op)) op.focus({ preventScroll: true });
}
function initQV() {
  const fondo = document.getElementById('qv');
  if (!fondo) return;
  fondo.addEventListener('click', e => {
    if (e.target === fondo || e.target.closest('[data-qv-close]')) { cerrarQV(); return; }
    const p = QV.p;
    if (!p) return;
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      const fotos = [p.img, p.escena].filter(Boolean);
      const img = document.getElementById('qvImg');
      img.src = fotos[+foto.dataset.qvFoto] || p.img;
      fondo.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      return;
    }
    const op = e.target.closest('[data-op]');
    if (op) {
      QV.v = op.dataset.op;
      fondo.querySelectorAll('[data-op]').forEach(b => b.setAttribute('aria-pressed', String(b === op)));
      document.getElementById('qvPrecio').innerHTML = qvPrecio(p);
      return;
    }
    const st = e.target.closest('[data-qv-step]');
    if (st) {
      QV.qty = Math.max(1, Math.min(20, QV.qty + Number(st.dataset.qvStep)));
      document.getElementById('qvQty').textContent = QV.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]')) {
      Cart.add(p, QV.qty, QV.v);
      const op2 = opcionDe(p, QV.v);
      showToast(`Sumaste ${QV.qty > 1 ? QV.qty + ' × ' : ''}${p.nombre}${op2 ? ' (' + op2.nombre + ')' : ''} al carrito`);
      return;
    }
    if (e.target.closest('[data-qv-buy]')) {
      Cart.add(p, QV.qty, QV.v);
      cerrarQV();
      setTimeout(() => abrirCarrito(), reduceMotion ? 0 : 200);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) abrirQV(rel.dataset.qvRel);
  });
}
function abrirProductoDeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirQV(id), 250);
}

const capaCarrito = { el: null, cerrar: () => cerrarCarrito() };
let carritoOpener = null;
function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = opcionDe(p, i.v);
  const detalle = op ? `${op.nombre} · ${op.nota}` : (p.meta || '');
  return `<li class="linea"><img src="${p.img}" alt="" width="72" height="72"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__op">${esc(detalle)}</p><div class="linea__fila"><div class="stepper"><button type="button" data-cart-step="-1" data-id="${p.id}" data-v="${esc(i.v || '')}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output aria-label="Cantidad">${i.qty}</output><button type="button" data-cart-step="1" data-id="${p.id}" data-v="${esc(i.v || '')}" aria-label="Sumar uno">${ICON.mas}</button></div><span class="linea__precio">${formatearPrecio(precioFinal(p, i.v) * i.qty)}</span></div></div><button type="button" class="linea__quitar" data-cart-remove data-id="${p.id}" data-v="${esc(i.v || '')}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></li>`;
}
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const label = document.querySelector('[data-cart-label]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const n = items.reduce((s, i) => s + i.qty, 0);
  if (label) label.textContent = n ? `(${n})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio"><span class="carrito-vacio__icono"><svg viewBox="0 0 96 96" aria-hidden="true"><use href="#feston" width="96" height="96" fill="#F6E7D3"/><path d="M30 52h36l-3 18H33z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M34 52c0-9 6-16 14-16s14 7 14 16" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="48" cy="31" r="3" fill="currentColor"/></svg></span><p>Tu carrito está vacío</p><p>¿Arrancamos por una torta?</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda</a></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = `<ul>${items.map(lineaHTML).join('')}</ul>`;
  if (!animar) body.querySelectorAll('.linea').forEach(l => { l.style.animation = 'none'; });
  else body.querySelectorAll('.linea').forEach((l, k) => { l.style.animationDelay = `${Math.min(k * 0.05, 0.3)}s`; });
  foot.innerHTML = `<div class="total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div><button type="button" class="btn btn--cta btn--bloque" data-checkout>Finalizar compra</button><p class="drawer__nota">El día de retiro y la decoración los coordinamos por WhatsApp.</p>`;
}
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const fondo = document.getElementById('overlayFondo');
  if (!drawer) return;
  if (!drawer.hidden) return;
  carritoOpener = document.activeElement;
  renderCarrito(true);
  drawer.hidden = false;
  if (fondo) { fondo.hidden = false; fondo.onclick = () => cerrarCarrito(); }
  capaCarrito.el = drawer;
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); fondo?.classList.add('open'); }));
  abrirCapa(capaCarrito);
  drawer.querySelector('[data-cart-close]')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const fondo = document.getElementById('overlayFondo');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  if (fondo && !document.querySelector('.filtros.open')) fondo.classList.remove('open');
  cerrarCapa(capaCarrito);
  setTimeout(() => {
    if (!drawer.classList.contains('open')) drawer.hidden = true;
    if (fondo && !fondo.classList.contains('open')) fondo.hidden = true;
  }, reduceMotion ? 0 : 380);
  if (carritoOpener && document.contains(carritoOpener)) carritoOpener.focus({ preventScroll: true });
}
function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cart-close]')) { cerrarCarrito(); return; }
    const st = e.target.closest('[data-cart-step]');
    if (st) {
      const it = Cart.get().find(i => i.id === st.dataset.id && (i.v || '') === (st.dataset.v || ''));
      if (it) Cart.setQty(st.dataset.id, st.dataset.v, it.qty + Number(st.dataset.cartStep));
      drawer.querySelector(`[data-cart-step="${st.dataset.cartStep}"][data-id="${st.dataset.id}"][data-v="${st.dataset.v}"]`)?.focus({ preventScroll: true });
      return;
    }
    const rm = e.target.closest('[data-cart-remove]');
    if (rm) { Cart.remove(rm.dataset.id, rm.dataset.v); drawer.querySelector('[data-cart-close]')?.focus({ preventScroll: true }); return; }
    if (e.target.closest('[data-checkout]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(false); });
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

function cantidadDe(btn) {
  const out = btn.closest('.prod-actions')?.querySelector('output');
  return Math.max(1, Math.min(20, parseInt(out?.textContent, 10) || 1));
}
function initAcciones() {
  document.addEventListener('click', e => {
    const abrirC = e.target.closest('[data-cart-open]');
    if (abrirC) { abrirCarrito(); return; }
    if (e.target.closest('#qv, #cartDrawer, #visor')) return;
    const quick = e.target.closest('[data-quick]');
    if (quick) { e.preventDefault(); abrirQV(quick.dataset.quick, quick); return; }
    const st = e.target.closest('[data-step]');
    if (st) {
      const out = st.parentElement.querySelector('output');
      out.textContent = Math.max(1, Math.min(20, (parseInt(out.textContent, 10) || 1) + Number(st.dataset.step)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const qty = cantidadDe(add);
      Cart.add(p, qty);
      showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre} al carrito`);
      add.classList.add('agregado');
      const lbl = add.querySelector('.lbl');
      const antes = lbl?.textContent;
      if (lbl) lbl.textContent = 'Listo';
      setTimeout(() => { add.classList.remove('agregado'); if (lbl) lbl.textContent = antes; }, 1300);
      const out = add.closest('.prod-actions')?.querySelector('output');
      if (out) out.textContent = '1';
    }
  });
}

const capaVisor = { el: null, cerrar: () => cerrarVisor() };
let visorOpener = null;
let visorIdx = 0;
let GALERIA = [];
function mostrarFoto(i) {
  if (!GALERIA.length) return;
  visorIdx = (i + GALERIA.length) % GALERIA.length;
  const f = GALERIA[visorIdx];
  const img = document.getElementById('visorImg');
  img.src = f.src;
  img.alt = f.alt;
  document.getElementById('visorCap').textContent = f.cap;
  document.getElementById('visorN').textContent = `${visorIdx + 1} / ${GALERIA.length}`;
}
function abrirVisor(i, opener) {
  const visor = document.getElementById('visor');
  if (!visor) return;
  visorOpener = opener;
  mostrarFoto(i);
  visor.hidden = false;
  capaVisor.el = visor;
  requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
  abrirCapa(capaVisor);
  visor.querySelector('[data-visor-close]')?.focus({ preventScroll: true });
}
function cerrarVisor() {
  const visor = document.getElementById('visor');
  if (!visor || visor.hidden) return;
  visor.classList.remove('open');
  cerrarCapa(capaVisor);
  setTimeout(() => { if (!visor.classList.contains('open')) visor.hidden = true; }, reduceMotion ? 0 : 300);
  if (visorOpener && document.contains(visorOpener)) visorOpener.focus({ preventScroll: true });
}
function initGaleria() {
  const btns = [...document.querySelectorAll('[data-gal]')];
  const visor = document.getElementById('visor');
  if (!btns.length || !visor) return;
  GALERIA = btns.map(b => ({ src: b.dataset.gal, cap: b.dataset.cap || '', alt: b.querySelector('img')?.alt || '' }));
  btns.forEach((b, i) => {
    b.setAttribute('aria-label', `Ver grande: ${b.dataset.cap || ''}`);
    b.addEventListener('click', () => abrirVisor(i, b));
  });
  visor.querySelector('[data-visor-close]')?.addEventListener('click', cerrarVisor);
  visor.querySelector('[data-visor-prev]')?.addEventListener('click', () => mostrarFoto(visorIdx - 1));
  visor.querySelector('[data-visor-next]')?.addEventListener('click', () => mostrarFoto(visorIdx + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'ArrowRight') mostrarFoto(visorIdx + 1);
    if (e.key === 'ArrowLeft') mostrarFoto(visorIdx - 1);
  });
  let x0 = null;
  visor.addEventListener('touchstart', e => { x0 = e.touches[0]?.clientX ?? null; }, { passive: true });
  visor.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? x0) - x0;
    if (Math.abs(dx) > 50) mostrarFoto(visorIdx + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const card = hero.querySelector('.hero__card');
  if (card) tl.from(card, { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}
function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--full');
  const img = hero?.querySelector('[data-hero-img]');
  if (!hero || !img) return;
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: s => { img.style.translate = `0 ${(s.progress * 6).toFixed(2)}%`; },
  });
}

[
  initModelBarScroll,
  initHorario,
  initNavCats,
  initNav,
  initHeaderSearch,
  initHome,
  initCatalogo,
  initRails,
  initGaleria,
  initQV,
  initCarrito,
  initAcciones,
  initFloats,
  updateCartBadge,
  initReveals,
  initHeroMotion,
  initParallax,
  abrirProductoDeURL,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });

if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
