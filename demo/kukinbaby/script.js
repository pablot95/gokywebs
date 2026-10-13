const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WSP = '5491164546160';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const HOME = MODELO === '2' ? 'modelo-2.html' : './';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const wa = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;

const TALLES = [
  { id: '0', edad: '0 a 3 meses', corto: '0-3 m', altura: 'hasta 61 cm', peso: 'hasta 6 kg' },
  { id: '1', edad: '3 a 6 meses', corto: '3-6 m', altura: '61 a 67 cm', peso: '6 a 8 kg' },
  { id: '2', edad: '6 a 9 meses', corto: '6-9 m', altura: '67 a 72 cm', peso: '8 a 9 kg' },
  { id: '3', edad: '9 a 12 meses', corto: '9-12 m', altura: '72 a 76 cm', peso: '9 a 10 kg' },
  { id: '4', edad: '12 a 18 meses', corto: '12-18 m', altura: '76 a 83 cm', peso: '10 a 11,5 kg' },
  { id: '5', edad: '18 a 24 meses', corto: '18-24 m', altura: '83 a 89 cm', peso: '11,5 a 13 kg' },
  { id: '6', edad: '2 a 3 años', corto: '2-3 años', altura: '89 a 97 cm', peso: '13 a 15 kg' },
];
const TALLE_IDS = [...TALLES.map(t => t.id), 'U'];

const CATEGORIAS = [
  { id: 'sets', nombre: 'Sets esenciales', frase: 'Bodies, pantalones y conjuntos que combinan entre sí.', foto: 'col-sets', alt: 'Bodies azul, crudo y verde con pantalones, medias y capota tejida', mini: 'p-set-esencial' },
  { id: 'tejidos', nombre: 'Tejidos y abrigo', frase: 'Saquitos, cardigans y gorros para los días frescos.', foto: 'col-tejidos', alt: 'Saquitos tejidos apilados, gorros con orejitas y baberos con puntilla', mini: 'p-saquito-calado' },
  { id: 'recien', nombre: 'Recién nacidos', frase: 'Enteritos, camperita y manta para la llegada a casa.', foto: 'col-recien', alt: 'Campera de corderito con orejitas, enterito de ositos, gorro y escarpines celestes', mini: 'p-campera-corderito' },
  { id: 'vestidos', nombre: 'Vestidos y enteritos', frase: 'Volados, lino y estampas para salir de paseo.', foto: 'col-vestidos', alt: 'Vestidos y jardineros de lino colgados en un perchero de madera', mini: 'p-vestido-lino-rosa' },
  { id: 'accesorios', nombre: 'Accesorios', frase: 'Gorros, medias, baberos, escarpines y mantas.', foto: null, mini: 'p-baberos-puntilla' },
];

const TONOS = [
  { id: 'crudo', nombre: 'Crudo' },
  { id: 'rosa', nombre: 'Rosa' },
  { id: 'salvia', nombre: 'Verde salvia' },
  { id: 'celeste', nombre: 'Celeste' },
  { id: 'azul', nombre: 'Azul' },
];

const PRECIOS = [
  { id: 'h15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15-30', nombre: '$15.000 a $30.000', min: 15000, max: 30000 },
  { id: 'm30', nombre: 'Más de $30.000', min: 30000, max: Infinity },
];

const ESCENAS = { '01': 'ropero-vertical', '02': 'perchero', '03': 'col-sets', '04': 'col-tejidos', '05': 'col-recien', '06': 'col-vestidos' };
const R = (a, b) => TALLES.slice(a, b + 1).map(t => t.id);

const PRODUCTOS = [
  { id: 'body-hojitas', nombre: 'Body manga larga Hojitas', cat: 'sets', precio: 16900, descuento: 0, talles: R(0, 4), tono: 'crudo', stock: 14, destacado: true, img: 'p-body-hojitas', escena: '03', desc: 'Body de manga larga con estampa de hojitas y broches abajo para cambiarlo rápido. Combina con el pantalón Hojitas.', tags: ['body', 'estampado', 'manga larga', 'algodon'] },
  { id: 'pantalon-morley-bosque', nombre: 'Pantalón morley Bosque', cat: 'sets', precio: 15900, descuento: 0, talles: R(0, 5), tono: 'salvia', stock: 9, nuevo: true, img: 'p-pantalon-morley-verde', escena: '03', desc: 'Pantalón de morley acanalado con cintura elastizada y cordón. Los puños en el tobillo evitan que se suba.', tags: ['pantalon', 'morley', 'verde'] },
  { id: 'pantalon-hojitas', nombre: 'Pantalón Hojitas con moño', cat: 'sets', precio: 15900, descuento: 0, talles: R(0, 4), tono: 'crudo', stock: 11, img: 'p-pantalon-hojitas', escena: '03', desc: 'Pantalón estampado con moño azul en la cintura y puños suaves. Va con el body Hojitas o con cualquier body liso.', tags: ['pantalon', 'estampado', 'moño'] },
  { id: 'set-esencial', nombre: 'Set esencial 5 piezas', cat: 'sets', precio: 46900, descuento: 10, talles: R(0, 3), tono: 'azul', stock: 6, destacado: true, portada: true, img: 'p-set-esencial', escena: '03', desc: 'Tres bodies de manga larga (azul, crudo y verde) y dos pantalones que combinan entre sí. Ideal para regalar o para armar la base del ropero.', tags: ['set', 'regalo', 'body', 'pantalon', 'ajuar'] },
  { id: 'body-azul-noche', nombre: 'Body manga larga Azul noche', cat: 'sets', precio: 14900, descuento: 0, talles: R(0, 6), tono: 'azul', stock: 18, nuevo: true, img: 'p-body-marino', escena: '03', desc: 'Body liso de manga larga en azul noche, con broches abajo. El básico que combina con todo.', tags: ['body', 'liso', 'manga larga', 'basico'] },
  { id: 'conjunto-morley-rosa', nombre: 'Conjunto morley Rosa empolvado', cat: 'sets', precio: 32900, descuento: 0, talles: R(1, 5), tono: 'rosa', stock: 7, destacado: true, img: 'p-morley-rosa', escena: '06', desc: 'Saquito y pantalón de morley acanalado con botones de madera, en un rosa suave.', tags: ['conjunto', 'morley', 'saquito'] },
  { id: 'conjunto-morley-salvia', nombre: 'Conjunto morley Salvia', cat: 'sets', precio: 32900, descuento: 0, talles: R(1, 5), tono: 'salvia', stock: 3, nuevo: true, img: 'p-morley-salvia', escena: '06', desc: 'Saquito y pantalón de morley acanalado con botones de madera, en verde salvia.', tags: ['conjunto', 'morley', 'saquito', 'verde'] },

  { id: 'saquito-calado', nombre: 'Saquito tejido calado', cat: 'tejidos', precio: 34900, descuento: 0, talles: R(0, 4), tono: 'crudo', stock: 8, destacado: true, img: 'p-saquito-calado', escena: '04', desc: 'Saquito tejido con punto calado y botones de madera. Abriga sin pesar y queda lindo arriba de un body.', tags: ['saquito', 'tejido', 'lana', 'abrigo'] },
  { id: 'cardigan-florcitas', nombre: 'Cardigan Florcitas con volados', cat: 'tejidos', precio: 29900, descuento: 0, talles: R(1, 5), tono: 'crudo', stock: 10, nuevo: true, img: 'p-cardigan-floral', escena: '04', desc: 'Cardigan estampado con florcitas, volados en los hombros y botones de madera.', tags: ['cardigan', 'saquito', 'estampado', 'volados'] },
  { id: 'gorro-osito-rosa', nombre: 'Gorro tejido Osito rosa', cat: 'tejidos', precio: 11900, descuento: 0, talles: R(0, 4), tono: 'rosa', stock: 15, destacado: true, img: 'p-gorro-orejitas', escena: '04', desc: 'Gorro tejido con orejitas de oso, en rosa empolvado. Cubre bien las orejas.', tags: ['gorro', 'tejido', 'orejitas', 'abrigo'] },
  { id: 'saquito-florcitas', nombre: 'Saquito de algodón Florcitas', cat: 'tejidos', precio: 24900, descuento: 0, talles: R(1, 4), tono: 'crudo', stock: 0, img: 'p-saquito-floral', escena: '06', desc: 'Saquito liviano de algodón estampado, con botones de madera. Para la media estación.', tags: ['saquito', 'algodon', 'estampado'] },
  { id: 'saquito-celeste', nombre: 'Saquito celeste con body', cat: 'tejidos', precio: 31900, descuento: 0, talles: R(0, 4), tono: 'celeste', stock: 6, nuevo: true, img: 'p-saquito-celeste', escena: '02', desc: 'Saquito tejido celeste con bolsillos, que viene con un body estampado al tono.', tags: ['saquito', 'tejido', 'body', 'conjunto'] },
  { id: 'saquito-azul-rayado', nombre: 'Saquito azul noche y body rayado', cat: 'tejidos', precio: 31900, descuento: 15, talles: R(1, 5), tono: 'azul', stock: 5, img: 'p-saquito-marino-rayado', escena: '02', desc: 'Saquito tejido azul noche con un body a rayas. Un clásico marinero para salir.', tags: ['saquito', 'tejido', 'body', 'rayado', 'conjunto'] },

  { id: 'campera-corderito', nombre: 'Campera corderito con orejitas', cat: 'recien', precio: 42900, descuento: 0, talles: R(0, 3), tono: 'celeste', stock: 6, destacado: true, img: 'p-campera-corderito', escena: '05', desc: 'Campera de corderito con capucha de orejitas, bolsillos y botones de madera. Suave por dentro y por fuera.', tags: ['campera', 'corderito', 'abrigo', 'orejitas'] },
  { id: 'enterito-ositos', nombre: 'Enterito Ositos del bosque', cat: 'recien', precio: 27900, descuento: 0, talles: R(0, 2), tono: 'crudo', stock: 12, nuevo: true, img: 'p-enterito-ositos', escena: '05', desc: 'Enterito con estampa de ositos y pinos, botones al frente y puños en los tobillos.', tags: ['enterito', 'estampado', 'ositos'] },
  { id: 'manta-osito', nombre: 'Manta corderito Osito', cat: 'recien', precio: 36900, descuento: 0, talles: ['U'], tono: 'crudo', stock: 4, destacado: true, img: 'p-manta-osito', escena: '05', desc: 'Manta de corderito con un osito bordado y borde celeste. Para el cochecito, la cuna o la llegada a casa.', tags: ['manta', 'corderito', 'regalo', 'cuna'] },
  { id: 'enterito-florcitas-pie', nombre: 'Enterito Florcitas con pie', cat: 'recien', precio: 25900, descuento: 0, talles: R(0, 2), tono: 'crudo', stock: 9, img: 'p-enterito-estampado', escena: '02', desc: 'Enterito con pie y estampa de florcitas azules, con botones al frente para cambiarlo fácil.', tags: ['enterito', 'con pie', 'estampado', 'pijama'] },
  { id: 'conjunto-globitos', nombre: 'Conjunto Globitos 2 piezas', cat: 'recien', precio: 28900, descuento: 0, talles: R(0, 3), tono: 'crudo', stock: 8, img: 'p-conjunto-globitos', escena: '02', desc: 'Saquito y pantalón estampados con globitos celestes. Liviano para los primeros meses.', tags: ['conjunto', 'estampado', 'globitos'] },

  { id: 'body-vestido-floral', nombre: 'Body vestido Floral manga larga', cat: 'vestidos', precio: 27900, descuento: 0, talles: R(0, 4), tono: 'crudo', stock: 7, destacado: true, img: 'p-body-vestido-floral', escena: '06', desc: 'Body con faldita, volados en los hombros y estampa floral. Un vestido que se prende abajo.', tags: ['body', 'vestido', 'floral', 'volados'] },
  { id: 'vestido-lino-rosa', nombre: 'Vestido de lino Rosa', cat: 'vestidos', precio: 29900, descuento: 0, talles: R(1, 6), tono: 'rosa', stock: 9, nuevo: true, img: 'p-vestido-lino-rosa', escena: '06', desc: 'Vestido de lino rosa con volados en los hombros. Fresco para el día y lindo para un cumple.', tags: ['vestido', 'lino', 'volados'] },
  { id: 'jardinero-lino-salvia', nombre: 'Jardinero de lino Salvia', cat: 'vestidos', precio: 28900, descuento: 0, talles: R(1, 6), tono: 'salvia', stock: 10, img: 'p-jardinero-salvia', escena: '06', desc: 'Jardinero corto de lino verde salvia, con bolsillo al frente y botones de madera.', tags: ['jardinero', 'enterito', 'lino', 'verde'] },
  { id: 'vestido-florcitas-volados', nombre: 'Vestido Florcitas con volados', cat: 'vestidos', precio: 31900, descuento: 0, talles: R(2, 6), tono: 'crudo', stock: 6, img: 'p-vestido-volados', escena: '06', desc: 'Vestido estampado con florcitas, volados en los hombros y frunce en la cintura.', tags: ['vestido', 'floral', 'volados'] },
  { id: 'body-muselina-volados', nombre: 'Body de muselina con volados', cat: 'vestidos', precio: 22900, descuento: 0, talles: R(0, 4), tono: 'salvia', stock: 8, nuevo: true, img: 'p-body-muselina', escena: '02', desc: 'Body de muselina verde agua con volados en los hombros y botones al frente.', tags: ['body', 'muselina', 'volados', 'enterito'] },
  { id: 'blusa-puntilla-bombacha', nombre: 'Blusa cuello puntilla y bombacha', cat: 'vestidos', precio: 33900, descuento: 0, talles: R(1, 5), tono: 'crudo', stock: 2, img: 'p-blusa-puntilla', escena: '02', desc: 'Blusa con cuello de puntilla y bombacha de lino con moño. Un conjunto para ocasiones especiales.', tags: ['blusa', 'bombacha', 'puntilla', 'conjunto'] },
  { id: 'enterito-pied-de-poule', nombre: 'Enterito pied de poule', cat: 'vestidos', precio: 27900, descuento: 20, talles: R(0, 4), tono: 'azul', stock: 6, img: 'p-enterito-pied', escena: '02', desc: 'Enterito con pie a cuadritos azules, con cierre de botones al frente.', tags: ['enterito', 'cuadros', 'con pie'] },

  { id: 'medias-x3', nombre: 'Medias de algodón x3', cat: 'accesorios', precio: 8900, descuento: 0, talles: R(0, 3), tono: 'azul', stock: 20, img: 'p-medias-x3', escena: '03', desc: 'Pack de tres pares de medias con puño doblado: crudo, azul noche y verde.', tags: ['medias', 'pack', 'accesorio'] },
  { id: 'capota-tejida', nombre: 'Capota tejida Azul noche', cat: 'accesorios', precio: 12900, descuento: 0, talles: R(0, 3), tono: 'azul', stock: 9, img: 'p-capota-tejida', escena: '03', desc: 'Capota tejida a mano con cordón para atar debajo del mentón.', tags: ['capota', 'gorro', 'tejido'] },
  { id: 'baberos-puntilla', nombre: 'Baberos con puntilla x3', cat: 'accesorios', precio: 13900, descuento: 0, talles: ['U'], tono: 'crudo', stock: 12, img: 'p-baberos-puntilla', escena: '04', desc: 'Tres baberos estampados con borde de puntilla tejida y abrojo atrás.', tags: ['babero', 'pack', 'accesorio'] },
  { id: 'manta-muselina-cerezas', nombre: 'Manta de muselina Cerezas', cat: 'accesorios', precio: 19900, descuento: 0, talles: ['U'], tono: 'crudo', stock: 7, img: 'p-manta-muselina', escena: '04', desc: 'Manta liviana de muselina con cerezas bordadas. Sirve de arrullo, de manta de paseo o de cambiador.', tags: ['manta', 'muselina', 'arrullo'] },
  { id: 'gorro-pompones-celeste', nombre: 'Gorro con pompones Celeste', cat: 'accesorios', precio: 11900, descuento: 0, talles: R(0, 4), tono: 'celeste', stock: 10, img: 'p-gorro-pompones', escena: '05', desc: 'Gorro tejido con dos pompones y tiras para atar. Para las salidas de invierno.', tags: ['gorro', 'tejido', 'pompones', 'abrigo'] },
  { id: 'escarpines-corderito', nombre: 'Escarpines de corderito', cat: 'accesorios', precio: 13900, descuento: 0, talles: R(0, 2), tono: 'celeste', stock: 8, img: 'p-escarpines-corderito', escena: '05', desc: 'Escarpines celestes con interior de corderito y cordones para ajustar.', tags: ['escarpines', 'calzado', 'corderito'] },
  { id: 'gorro-pompon-azul', nombre: 'Gorro con pompón Azul', cat: 'accesorios', precio: 10900, descuento: 0, talles: R(1, 6), tono: 'azul', stock: 11, img: 'p-gorro-pompon-azul', escena: '01', desc: 'Gorro tejido con doblez y un pompón grande arriba.', tags: ['gorro', 'tejido', 'pompon'] },
];

const ORDEN_VITRINA = ['saquito-calado', 'campera-corderito', 'set-esencial', 'gorro-osito-rosa', 'manta-osito', 'conjunto-morley-rosa', 'body-vestido-floral', 'body-hojitas',
  'pantalon-morley-bosque', 'cardigan-florcitas', 'saquito-celeste', 'enterito-ositos', 'conjunto-morley-salvia', 'body-azul-noche', 'body-muselina-volados', 'vestido-lino-rosa',
  'medias-x3', 'enterito-pied-de-poule', 'baberos-puntilla', 'jardinero-lino-salvia', 'gorro-pompones-celeste', 'blusa-puntilla-bombacha', 'pantalon-hojitas', 'vestido-florcitas-volados',
  'saquito-azul-rayado', 'escarpines-corderito', 'capota-tejida', 'manta-muselina-cerezas', 'gorro-pompon-azul', 'saquito-florcitas', 'conjunto-globitos', 'enterito-florcitas-pie'];
PRODUCTOS.sort((a, b) => ORDEN_VITRINA.indexOf(a.id) - ORDEN_VITRINA.indexOf(b.id));

const intentar = fn => { try { fn(); return true; } catch { return false; } };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getTalle = id => TALLES.find(t => t.id === id);
const esUnico = p => p.talles.length === 1 && p.talles[0] === 'U';
const nombreTalle = t => t === 'U' ? 'Talle único' : `Talle ${t}`;

const Cart = {
  KEY: 'kukinbaby_cart',
  get() {
    try {
      const items = JSON.parse(localStorage.getItem(this.KEY)) || [];
      return items.filter(i => getProducto(i.id) && TALLE_IDS.includes(i.talle));
    } catch { return []; }
  },
  save(items) {
    intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items)));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, talle = 'U') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const LIMITE_SERVIDOR = 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function coincide(p, f) {
  if (p.visible === false) return false;
  if (f.destacado && !p.destacado) return false;
  if (f.nuevo && !p.nuevo) return false;
  if (f.cat?.length && !f.cat.includes(p.cat)) return false;
  if (f.talle?.length && !f.talle.some(t => p.talles.includes(t))) return false;
  if (f.tono?.length && !f.tono.includes(p.tono)) return false;
  if (f.stock && p.stock <= 0) return false;
  if (f.precio?.length) {
    const v = precioFinal(p);
    if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
  }
  if (f.q) {
    const texto = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, TONOS.find(t => t.id === p.tono)?.nombre, ...(p.tags || []), ...p.talles.map(t => 'talle ' + t)].join(' '));
    if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
  }
  return true;
}

const ORDENES = {
  destacados: (a, b) => (b.p.destacado ? 1 : 0) - (a.p.destacado ? 1 : 0) || (b.p.nuevo ? 1 : 0) - (a.p.nuevo ? 1 : 0) || a.i - b.i,
  'precio-asc': (a, b) => precioFinal(a.p) - precioFinal(b.p) || a.i - b.i,
  'precio-desc': (a, b) => precioFinal(b.p) - precioFinal(a.p) || a.i - b.i,
  nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i,
};

function consultarProductos({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
  const tope = Math.min(Math.max(1, Math.floor(limite) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
  const lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(x => coincide(x.p, filtros)).sort(ORDENES[orden] || ORDENES.destacados).map(x => x.p);
  const desde = cursor ? lista.findIndex(p => p.id === cursor) + 1 : 0;
  const items = desde > 0 || !cursor ? lista.slice(desde, desde + tope) : [];
  const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
  return Promise.resolve({ items, siguiente, total: lista.length });
}

function obtenerProducto(id) {
  const p = getProducto(id);
  return Promise.resolve(p && p.visible !== false ? p : null);
}

function contarPor(campo) {
  const n = {};
  PRODUCTOS.forEach(p => {
    if (p.visible === false) return;
    (campo === 'talle' ? p.talles : [p[campo]]).forEach(v => { n[v] = (n[v] || 0) + 1; });
  });
  return n;
}

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  subirChico: 'data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICON_FB = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.57-.14-2.88-.14C11.9 2 10 3.66 10 6.7v2.8H7v4h3V22h4z"/></svg>';
const ICON_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICON_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
const ICON_HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

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

function tallesTexto(p) {
  if (esUnico(p)) return 'Talle único';
  const t = p.talles.map(Number);
  const seguidos = t.every((v, i) => i === 0 || v === t[i - 1] + 1);
  if (t.length === 1) return `Talle ${t[0]}`;
  return seguidos ? `Talles ${t[0]} a ${t[t.length - 1]}` : `Talles ${t.join(', ')}`;
}

function miniReglaHTML(p) {
  if (esUnico(p)) return '<p class="mini-regla mini-regla--u">Talle único</p>';
  return `<p class="mini-regla"><span class="sr-only">${tallesTexto(p)}</span>${TALLES.map(t => `<i class="${p.talles.includes(t.id) ? 'on' : ''}" aria-hidden="true">${t.id}</i>`).join('')}</p>`;
}

function badgesHTML(p) {
  let b = '';
  if (p.stock <= 0) b = '<span class="badge badge--agotado">Sin stock</span>';
  else if (p.descuento > 0) b = `<span class="badge badge--off">-${Math.round(p.descuento)}%</span>`;
  else if (p.nuevo) b = '<span class="badge badge--nuevo">Nuevo</span>';
  else if (p.stock <= 3) b = '<span class="badge badge--ultimas">Últimas unidades</span>';
  return b ? `<span class="badges">${b}</span>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<span class="precio precio--final">${formatearPrecio(precioFinal(p))}</span><s class="precio--antes">${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function stepperHTML(p, label) {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="${esc(label)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>`;
}

function cardHTML(p, { animar = true, portada = false, compacta = false } = {}) {
  const cat = getCategoria(p.cat);
  const agotado = p.stock <= 0;
  return `<article class="prod${agotado ? ' prod--agotado' : ''}${portada ? ' prod--portada' : ''}" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
    <div class="prod__media">
      <button class="prod__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"></span></button>
      ${badgesHTML(p)}
    </div>
    <div class="prod__info">
      <p class="prod__cat">${esc(cat?.nombre)}</p>
      <h3 class="prod__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      ${miniReglaHTML(p)}
      <p class="prod__precio">${precioHTML(p)}</p>
      ${agotado
        ? `<a class="btn btn--line prod-aviso" href="${wa('Hola! ¿Cuándo vuelve a entrar el ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`
        : compacta
        ? `<div class="prod-actions"><button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON_CARRITO}<span>Agregar<span class="add-extra"> al carrito</span></span></button></div>`
        : `<div class="prod-actions">
        ${stepperHTML(p, 'Cantidad de ' + p.nombre)}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON_CARRITO}<span>Agregar<span class="add-extra"> al carrito</span></span></button>
      </div>
      <button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function miniHTML(p) {
  return `<li ${ANIM.der}><article class="mini" data-id="${esc(p.id)}">
    <div class="mini__media">
      <button class="mini__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"></span></button>
      ${badgesHTML(p)}
      ${p.stock > 0 ? `<button class="mini__add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON_MAS}</button>` : ''}
    </div>
    <div class="mini__info">
      <p class="mini__cat">${esc(getCategoria(p.cat)?.nombre)}</p>
      <h3 class="mini__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p>${precioHTML(p)}</p>
    </div>
  </article></li>`;
}

function renderMenus() {
  const porCat = contarPor('cat');
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? (params.get('cat') || '') : '';
  const talleActual = PAGINA === 'catalogo' ? (params.get('talle') || '') : '';
  document.querySelectorAll('[data-cat-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
      <span class="cat-link__img"><img src="images/${c.mini}.webp" alt="" width="640" height="800"></span>
      <span class="cat-link__nombre">${esc(c.nombre)}</span>
      <span class="cat-link__n">${porCat[c.id] || 0}</span></a></li>`).join('')
      + `<li class="cat-link--todo"><a href="${CATALOGO}">Ver todo el catálogo ${ICON_FLECHA}</a></li>`;
  });
  document.querySelectorAll('[data-talle-menu]').forEach(ul => {
    ul.innerHTML = TALLES.map(t => `<li><a href="${CATALOGO}?talle=${t.id}"${talleActual === t.id ? ' aria-current="page"' : ''}><span class="num">${t.id}</span><small>${t.corto}</small></a></li>`).join('')
      + `<li><a href="${HOME}#guia-talles"><span class="num">?</span><small>Guía</small></a></li>`;
  });
  document.querySelectorAll('[data-cat-links]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
  });
  document.querySelectorAll('[data-talle-links]').forEach(ul => {
    ul.innerHTML = TALLES.map(t => `<li><a href="${CATALOGO}?talle=${t.id}" aria-label="Prendas en talle ${t.id}">${t.id}</a></li>`).join('');
  });
  document.querySelectorAll('[data-regla-links]').forEach(ol => {
    ol.innerHTML = TALLES.map(t => `<li><a class="regla__t" href="${CATALOGO}?talle=${t.id}" aria-label="Ver prendas en talle ${t.id} (${t.edad})"><span class="regla__n">${t.id}</span><span class="regla__e">${t.corto}</span></a></li>`).join('');
  });
  const total = Object.values(porCat).reduce((a, b) => a + b, 0);
  document.querySelectorAll('[data-total-catalogo]').forEach(el => { el.textContent = `(${total} prendas)`; });
}

function renderColecciones() {
  const ul = document.getElementById('colGrid');
  if (!ul) return;
  const porCat = contarPor('cat');
  ul.innerHTML = CATEGORIAS.filter(c => c.foto).map(c => `<li ${ANIM.subir}><a class="col-card" href="${CATALOGO}?cat=${c.id}">
    <span class="col-card__foto"><img src="images/${c.foto}.webp" alt="${esc(c.alt)}" width="1254" height="1254" decoding="async"></span>
    <span class="col-card__txt">
      <span class="col-card__nombre">${esc(c.nombre)}</span>
      <span class="col-card__frase">${esc(c.frase)}</span>
      <span class="col-card__cta">Ver ${porCat[c.id] || 0} prendas ${ICON_FLECHA}</span>
    </span></a></li>`).join('');
}

async function renderHome() {
  for (const ul of document.querySelectorAll('[data-rail-productos]')) {
    const tipo = ul.dataset.railProductos;
    const { items } = await consultarProductos({ filtros: { [tipo]: true }, limite: 8 });
    ul.innerHTML = items.map(miniHTML).join('');
  }
  const grid = document.getElementById('gridNovedades');
  if (grid) {
    const { items } = await consultarProductos({ filtros: { nuevo: true }, limite: 8 });
    grid.innerHTML = items.map(p => cardHTML(p, { compacta: true })).join('');
  }
  const mos = document.getElementById('mosaico');
  if (mos) {
    const { items } = await consultarProductos({ filtros: { destacado: true }, limite: 7 });
    const { total } = await consultarProductos({ limite: 1 });
    items.sort((a, b) => (b.portada ? 1 : 0) - (a.portada ? 1 : 0));
    mos.innerHTML = items.map((p, i) => cardHTML(p, { portada: i === 0, compacta: true })).join('')
      + `<a class="mosaico__cta" href="${CATALOGO}" ${ANIM.subir}>
        <span class="mosaico__cta-titulo">${total} prendas, del talle 0 al 6</span>
        <span class="mosaico__cta-txt">Bodies, enteritos, tejidos, vestidos y accesorios en un mismo catálogo.</span>
        <span class="btn btn--primary">Ver todo el catálogo ${ICON_FLECHA}</span></a>`;
  }
}

const Catalogo = {
  estado: { cat: [], talle: [], tono: [], precio: [], stock: false, q: '', orden: 'destacados' },
  buffer: [], siguiente: null, total: 0, mostrar: 16, PASO: 16, pintados: 0, pedido: 0,
};

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const lista = (k, validos) => (p.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  const e = Catalogo.estado;
  e.cat = lista('cat', CATEGORIAS.map(c => c.id));
  e.talle = lista('talle', TALLE_IDS);
  e.tono = lista('tono', TONOS.map(t => t.id));
  e.precio = lista('precio', PRECIOS.map(x => x.id));
  e.stock = p.get('stock') === '1';
  e.q = (p.get('q') || '').trim().slice(0, 60);
  e.orden = Object.keys(ORDENES).includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  if (e.cat.length) p.set('cat', e.cat.join(','));
  if (e.talle.length) p.set('talle', e.talle.join(','));
  if (e.tono.length) p.set('tono', e.tono.join(','));
  if (e.precio.length) p.set('precio', e.precio.join(','));
  if (e.stock) p.set('stock', '1');
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function filtrosActivos() {
  const e = Catalogo.estado;
  return e.cat.length + e.talle.length + e.tono.length + e.precio.length + (e.stock ? 1 : 0);
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const f = inp.dataset.f;
    inp.checked = f === 'stock' ? e.stock : (e[f] || []).includes(inp.value);
  });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  const badge = document.getElementById('filtrosN');
  if (badge) badge.textContent = n ? `(${n})` : '';

  const unaCat = e.cat.length === 1 ? getCategoria(e.cat[0]) : null;
  const unTalle = !unaCat && e.talle.length === 1 ? e.talle[0] : null;
  const titulo = unaCat ? unaCat.nombre : unTalle ? nombreTalle(unTalle) : 'Catálogo completo';
  const h1 = document.getElementById('catTitulo');
  if (h1) h1.textContent = titulo;
  const miga = document.getElementById('migaCat');
  if (miga) { miga.hidden = !(unaCat || unTalle); miga.textContent = unaCat || unTalle ? titulo : ''; }
  document.title = `${unaCat || unTalle ? titulo : 'Catálogo'} — Kukin baby`;
  document.querySelectorAll('[data-cat-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-talle-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('talle');
    if (unTalle && id === unTalle) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('#catPills a').forEach(a => {
    const id = a.dataset.pill;
    const activo = id ? (e.cat.length === 1 && e.cat[0] === id) : !e.cat.length;
    if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });

  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.nombre })),
      ...e.talle.map(id => ({ f: 'talle', v: id, t: nombreTalle(id) })),
      ...e.tono.map(id => ({ f: 'tono', v: id, t: TONOS.find(x => x.id === id)?.nombre })),
      ...e.precio.map(id => ({ f: 'precio', v: id, t: PRECIOS.find(x => x.id === id)?.nombre })),
      ...(e.stock ? [{ f: 'stock', v: '1', t: 'Con stock' }] : []),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('');
  }
}

async function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, talle: e.talle, tono: e.tono, precio: e.precio, stock: e.stock, q: e.q };
  const pedido = ++Catalogo.pedido;
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    const r = await consultarProductos({ filtros, orden: e.orden, limite: LIMITE_SERVIDOR });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer = r.items; Catalogo.siguiente = r.siguiente; Catalogo.total = r.total; Catalogo.pintados = 0;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = await consultarProductos({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_SERVIDOR });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer.push(...r.items); Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'prenda' : 'prendas'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    mas.hidden = Catalogo.pintados >= Catalogo.total;
    mas.textContent = `Ver más prendas (${Math.max(0, Catalogo.total - Catalogo.pintados)})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

async function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const porCat = contarPor('cat');
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="f-n">${porCat[c.id] || 0}</span></label>`).join('');
  const fTalle = document.getElementById('fTalle');
  if (fTalle) fTalle.innerHTML = TALLES.map(t => `<label class="f-talle" title="${t.edad}"><input type="checkbox" data-f="talle" value="${t.id}" aria-label="Talle ${t.id} (${t.edad})"><span aria-hidden="true">${t.id}</span></label>`).join('')
    + '<label class="f-talle f-talle--u"><input type="checkbox" data-f="talle" value="U" aria-label="Talle único"><span aria-hidden="true">Único</span></label>';
  const fTono = document.getElementById('fTono');
  if (fTono) fTono.innerHTML = TONOS.map(t => `<label class="f-check"><input type="checkbox" data-f="tono" value="${t.id}"><span class="tono tono--${t.id}" aria-hidden="true"></span><span>${esc(t.nombre)}</span></label>`).join('');
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = PRECIOS.map(x => `<label class="f-check"><input type="checkbox" data-f="precio" value="${x.id}"><span>${esc(x.nombre)}</span></label>`).join('');
  const pills = document.getElementById('catPills');
  if (pills) pills.innerHTML = `<a href="${CATALOGO}" data-pill="">Todo</a>` + CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}" data-pill="${c.id}">${esc(c.nombre)}</a>`).join('');

  leerURLCatalogo();
  sincronizarControles();
  await cargarCatalogo(true);

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const e = Catalogo.estado; const f = inp.dataset.f;
    if (f === 'stock') e.stock = inp.checked;
    else e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
    aplicarCambioCatalogo();
  });
  const form = document.getElementById('buscadorForm');
  const buscar = document.getElementById('buscar');
  let t = 0;
  form?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); });
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 260);
  });
  document.getElementById('orden')?.addEventListener('change', ev => { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); });
  document.addEventListener('click', ev => {
    const quitar = ev.target.closest('[data-quitar]');
    if (quitar) {
      const e = Catalogo.estado; const f = quitar.dataset.quitar; const v = quitar.dataset.valor;
      if (f === 'stock') e.stock = false; else if (f === 'q') e.q = ''; else e[f] = e[f].filter(x => x !== v);
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      Object.assign(Catalogo.estado, { cat: [], talle: [], tono: [], precio: [], stock: false, q: '' });
      aplicarCambioCatalogo();
      return;
    }
    const pill = ev.target.closest('#catPills a');
    if (pill) {
      ev.preventDefault();
      Catalogo.estado.cat = pill.dataset.pill ? [pill.dataset.pill] : [];
      aplicarCambioCatalogo();
    }
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    Catalogo.mostrar += Catalogo.PASO;
    cargarCatalogo(false);
  });
  initFiltrosDrawer();
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const abrir = document.getElementById('filtrosOpen');
  if (!panel || !abrir) return;
  const esDrawer = () => MODELO === '2' || !window.matchMedia('(min-width: 1025px)').matches;
  let bd = null;
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd?.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (bd) bd.hidden = true; }, 300);
    abrir.focus();
  };
  const open = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; bd.hidden = true; document.body.appendChild(bd); bd.addEventListener('click', cerrar); }
    bd.hidden = false;
    requestAnimationFrame(() => bd.classList.add('open'));
    panel.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  abrir.addEventListener('click', open);
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  panel.addEventListener('keydown', e => {
    if (!esDrawer() || !panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    atraparFoco(panel, e);
  });
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  const panel = hero.querySelector('.hero-panel');
  if (panel) tl.from(panel, { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-card'), { y: 30, opacity: 0, duration: 1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.regla--links li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-full__foto');
  if (!foto) return;
  gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--full', start: 'top top', end: 'bottom top', scrub: true } });
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
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initDropdowns() {
  const drops = [...document.querySelectorAll('[data-drop]')];
  if (!drops.length) return;
  const desk = window.matchMedia('(min-width: 1025px)');
  const cerrar = d => { d.classList.remove('open'); d.querySelector('.nav-drop__btn')?.setAttribute('aria-expanded', 'false'); };
  drops.forEach(d => {
    const btn = d.querySelector('.nav-drop__btn');
    let t = 0;
    const abrir = () => {
      clearTimeout(t);
      drops.forEach(o => { if (o !== d) cerrar(o); });
      d.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    };
    btn.addEventListener('click', () => (d.classList.contains('open') ? cerrar(d) : abrir()));
    d.addEventListener('mouseenter', () => { if (desk.matches) abrir(); });
    d.addEventListener('mouseleave', () => { if (desk.matches) t = setTimeout(() => cerrar(d), 120); });
    d.addEventListener('focusout', e => { if (desk.matches && !d.contains(e.relatedTarget)) cerrar(d); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) { e.stopPropagation(); cerrar(d); btn.focus(); } });
  });
  document.addEventListener('click', e => { if (desk.matches && !e.target.closest('[data-drop]')) drops.forEach(cerrar); });
}

function initSearch() {
  const btn = document.querySelector('[data-search-toggle]');
  const form = document.getElementById('headerSearch');
  if (!btn || !form) return;
  btn.addEventListener('click', () => {
    const enPagina = document.getElementById('buscar');
    if (enPagina) {
      enPagina.scrollIntoView({ block: 'center' });
      enPagina.focus();
      return;
    }
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) form.querySelector('input')?.focus();
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
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
  cart?.addEventListener('click', e => abrirCarrito(e.currentTarget));
  sync();
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

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const sec = vp.closest('section');
    const track = vp.querySelector('.rail-track');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 240) + 16;
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
        intentar(() => vp.setPointerCapture?.(pointerId));
      }
      if (moved) vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      intentar(() => vp.releasePointerCapture?.(pointerId));
      vp.classList.remove('dragging');
      if (moved) {
        const kill = ev => { ev.preventDefault(); ev.stopPropagation(); };
        vp.addEventListener('click', kill, { capture: true, once: true });
        setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
      }
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
  });
}

function leerCantidad(card) {
  const inp = card?.querySelector('.stepper input');
  const v = parseInt(inp?.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 1;
}

function cerrarPicker(devolverFoco = false) {
  document.querySelectorAll('.talle-pick').forEach(pk => {
    if (devolverFoco) pk._opener?.focus();
    pk.remove();
  });
}

function abrirPicker(btn, modo) {
  const card = btn.closest('.prod, .mini');
  const p = getProducto(btn.dataset.add || btn.dataset.buy);
  if (!card || !p || p.stock <= 0) return;
  const qty = leerCantidad(card);
  if (esUnico(p)) { agregarAlCarrito(p, qty, 'U', modo); return; }
  cerrarPicker();
  const media = card.querySelector('.prod__media, .mini__media');
  media.insertAdjacentHTML('beforeend', `<div class="talle-pick" role="dialog" aria-label="Elegí el talle de ${esc(p.nombre)}">
    <div class="talle-pick__head"><p class="talle-pick__titulo">¿Qué talle?</p><button type="button" class="talle-pick__cerrar" data-pick-cerrar aria-label="Cancelar">${ICON_X}</button></div>
    <div class="talle-pick__ops">${p.talles.map(t => `<button type="button" data-pick-talle="${t}" aria-label="Talle ${t} (${getTalle(t)?.edad || ''})">${t}</button>`).join('')}</div>
  </div>`);
  const pick = media.querySelector('.talle-pick');
  pick._opener = btn; pick._qty = qty; pick._modo = modo; pick._id = p.id;
  pick.querySelector('[data-pick-talle]')?.focus();
}

function agregarAlCarrito(p, qty, talle, modo) {
  Cart.add(p, qty, talle);
  showToast(`Sumaste ${p.nombre}${talle !== 'U' ? ' · talle ' + talle : ''}`);
  if (modo === 'buy') abrirCarrito();
}

function initCompra() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const inp = step.parentElement.querySelector('input');
      const max = parseInt(inp.max, 10) || 99;
      inp.value = Math.max(1, Math.min(max, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const talle = e.target.closest('[data-pick-talle]');
    if (talle) {
      const pick = talle.closest('.talle-pick');
      const p = getProducto(pick._id);
      const opener = pick._opener;
      if (p) agregarAlCarrito(p, pick._qty, talle.dataset.pickTalle, pick._modo);
      pick.remove();
      if (pick._modo !== 'buy') opener?.focus();
      return;
    }
    if (e.target.closest('[data-pick-cerrar]')) { cerrarPicker(true); return; }
    const add = e.target.closest('[data-add], [data-buy]');
    if (add && !add.closest('.qv')) { abrirPicker(add, add.dataset.buy ? 'buy' : 'add'); return; }
    if (!e.target.closest('.talle-pick')) cerrarPicker();
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQV(quick.dataset.quick, quick);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.querySelector('.talle-pick')) cerrarPicker(true); });
  document.addEventListener('input', e => {
    const inp = e.target.closest('.stepper input');
    if (!inp || inp.closest('.linea')) return;
    const max = parseInt(inp.max, 10) || 99;
    const v = parseInt(inp.value, 10);
    if (Number.isFinite(v) && v > max) inp.value = max;
  });
}

const Drawer = { opener: null };
function abrirCarrito(opener) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  cerrarPicker();
  Drawer.opener = opener || document.activeElement;
  renderCarrito();
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
  document.body.classList.add('no-scroll');
  drawer.querySelector('[data-close-drawer]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  if (document.getElementById('quickView')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  Drawer.opener?.focus?.();
}

function renderCarrito() {
  const cont = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!cont) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = `<div class="carrito-vacio">${ICON_HEART}<p>Tu carrito está vacío</p><p>Elegí una prenda y su talle, y la vas a ver acá.</p><a class="btn btn--primary" href="${CATALOGO}">Ir al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="linea" data-linea="${esc(i.id)}" data-talle="${esc(i.talle)}">
      <div class="linea__img"><img src="images/${p.img}.webp" alt="" width="640" height="800"></div>
      <div>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__talle">${nombreTalle(i.talle)}${i.talle !== 'U' ? ' · ' + getTalle(i.talle)?.edad : ''}</p>
        <div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON_MENOS}</button><input type="number" value="${i.qty}" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON_MAS}</button></div>
      </div>
      <div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
        <button type="button" class="linea__quitar" data-linea-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const link = document.getElementById('cartWsp');
  if (link) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `- ${p.nombre} (${nombreTalle(i.talle).toLowerCase()}) x${i.qty}: ${formatearPrecio(precioFinal(p) * i.qty)}`; });
    link.href = wa(`Hola! Quiero consultar este pedido de Kukin baby:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}

function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrirCarrito(b)));
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.querySelectorAll('[data-close-drawer]').forEach(b => b.addEventListener('click', cerrarCarrito));
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); atraparFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('a[href]') && !e.target.closest('#cartWsp')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea; const talle = linea.dataset.talle;
    const it = Cart.get().find(i => i.id === id && i.talle === talle);
    if (e.target.closest('[data-linea-quitar]')) { Cart.remove(id, talle); return; }
    const step = e.target.closest('[data-linea-step]');
    if (step && it) Cart.setQty(id, talle, it.qty + Number(step.dataset.lineaStep));
  });
  drawer.addEventListener('change', e => {
    const inp = e.target.closest('[data-linea-qty]');
    if (!inp) return;
    const linea = inp.closest('[data-linea]');
    Cart.setQty(linea.dataset.linea, linea.dataset.talle, parseInt(inp.value, 10) || 1);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(); });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
}

const QV = { opener: null, talle: null, id: null };
async function abrirQV(id, opener) {
  const qv = document.getElementById('quickView');
  const cont = document.getElementById('qvContent');
  if (!qv || !cont) return;
  const p = await obtenerProducto(id);
  if (!p) return;
  cerrarPicker();
  QV.opener = opener || document.activeElement; QV.id = p.id; QV.talle = esUnico(p) ? 'U' : null;
  const cat = getCategoria(p.cat);
  const escena = ESCENAS[p.escena];
  const { items } = await consultarProductos({ filtros: { cat: [p.cat] }, limite: 4 });
  const mas = items.filter(x => x.id !== p.id).slice(0, 3);
  const agotado = p.stock <= 0;
  const url = new URL(`${CATALOGO}?producto=${p.id}`, location.href).href;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__foto" id="qvFoto"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800"></div>
      <div class="qv__thumbs">
        <button type="button" class="qv__thumb" aria-pressed="true" data-qv-foto="${p.img}" aria-label="Ver la prenda"><img src="images/${p.img}.webp" alt="" width="640" height="800"></button>
        ${escena ? `<button type="button" class="qv__thumb" aria-pressed="false" data-qv-foto="${escena}" data-qv-escena aria-label="Ver la prenda en su colección"><img src="images/${escena}.webp" alt="" width="640" height="800"></button>` : ''}
      </div>
    </div>
    <div class="qv__info">
      <p class="prod__cat">${esc(cat?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${precioHTML(p)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <div class="qv__talles" id="qvTalles">
        <div class="qv__talles-head"><span>${esUnico(p) ? 'Talle único' : 'Elegí el talle'}</span><a href="${HOME}#guia-talles">¿Qué talle le queda?</a></div>
        ${esUnico(p) ? '' : `<div class="qv__talle-ops">${TALLES.map(t => `<button type="button" data-qv-talle="${t.id}" aria-pressed="false" aria-label="Talle ${t.id}, ${t.edad}"${p.talles.includes(t.id) && !agotado ? '' : ' disabled'}>${t.id}</button>`).join('')}</div>`}
      </div>
      <p class="qv__stock">${agotado ? 'Sin stock por ahora: escribinos y te avisamos cuando vuelva.' : p.stock <= 3 ? `Quedan ${p.stock} unidades.` : `${tallesTexto(p)} · hay stock.`}</p>
      ${agotado
        ? `<div class="qv__acciones"><a class="btn btn--line" href="${wa('Hola! ¿Cuándo vuelve a entrar el ' + p.nombre + '?')}" target="_blank" rel="noopener">Avisame cuando vuelva</a></div>`
        : `<div class="qv__acciones">${stepperHTML(p, 'Cantidad')}<button type="button" class="btn btn--cta" data-qv-add>${ICON_CARRITO} Agregar al carrito</button><button type="button" class="btn btn--primary" data-qv-buy>Comprar ahora</button></div>`}
      <div class="qv__compartir">
        <span>Compartir:</span>
        <a class="qv__share" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener">${ICON_FB} Facebook</a>
        <a class="qv__share" href="https://api.whatsapp.com/send?text=${encodeURIComponent('Mirá esto de Kukin baby: ' + p.nombre + ' ' + url)}" target="_blank" rel="noopener">${ICON_WSP} WhatsApp</a>
        <button type="button" class="qv__share" data-qv-copiar="${esc(url)}">${ICON_LINK} Copiar link para TikTok</button>
      </div>
      ${mas.length ? `<div class="qv__mas"><p class="qv__mas-titulo">También te puede interesar</p><ul>${mas.map(m => `<li><button type="button" data-qv-otro="${esc(m.id)}"><span class="linea__img"><img src="images/${m.img}.webp" alt="" width="640" height="800"></span><span>${esc(m.nombre)}</span><strong>${formatearPrecio(precioFinal(m))}</strong></button></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: cat?.nombre, brand: { '@type': 'Brand', name: 'Kukin baby' }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', url } });
  if (qv.hidden) {
    qv.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  document.body.classList.add('no-scroll');
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus();
  const params = new URLSearchParams(location.search);
  params.set('producto', p.id);
  window.history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
}

function cerrarQV() {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 350);
  const params = new URLSearchParams(location.search);
  params.delete('producto');
  const qs = params.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  QV.opener?.focus?.();
}

function initQV() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      const box = document.getElementById('qvFoto');
      box.classList.toggle('qv__foto--escena', foto.hasAttribute('data-qv-escena'));
      box.querySelector('img').src = `images/${foto.dataset.qvFoto}.webp`;
      return;
    }
    const t = e.target.closest('[data-qv-talle]');
    if (t) {
      QV.talle = t.dataset.qvTalle;
      qv.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      document.getElementById('qvTalles')?.classList.remove('falta');
      const head = qv.querySelector('.qv__talles-head span');
      if (head) head.textContent = `Talle ${QV.talle} · ${getTalle(QV.talle)?.edad}`;
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (add) {
      const p = getProducto(QV.id);
      if (!p) return;
      if (!QV.talle) {
        const box = document.getElementById('qvTalles');
        box.classList.remove('falta'); void box.offsetWidth; box.classList.add('falta');
        const head = box.querySelector('.qv__talles-head span');
        if (head) head.textContent = 'Elegí un talle para seguir';
        box.querySelector('button:not(:disabled)')?.focus();
        return;
      }
      const qty = leerCantidad(qv.querySelector('.qv__acciones'));
      Cart.add(p, qty, QV.talle);
      showToast(`Sumaste ${p.nombre}${QV.talle !== 'U' ? ' · talle ' + QV.talle : ''}`);
      if (add.hasAttribute('data-qv-buy')) { cerrarQV(); abrirCarrito(QV.opener); }
      return;
    }
    const copiar = e.target.closest('[data-qv-copiar]');
    if (copiar) { copiarTexto(copiar.dataset.qvCopiar); return; }
    const otro = e.target.closest('[data-qv-otro]');
    if (otro) abrirQV(otro.dataset.qvOtro, QV.opener);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv, e);
  });
}

function copiarTexto(txt) {
  const ok = () => showToast('Link copiado: pegalo en tu TikTok, tu Facebook o donde quieras.');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(txt).then(ok).catch(() => copiarViejo(txt, ok));
  } else copiarViejo(txt, ok);
}
function copiarViejo(txt, ok) {
  const ta = document.createElement('textarea');
  ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); ok(); } catch { showToast('No pudimos copiar el link. Probá desde el botón de Facebook o WhatsApp.'); }
  ta.remove();
}

function initGuia() {
  const regla = document.querySelector('[data-guia-regla]');
  if (!regla) return;
  regla.insertAdjacentHTML('beforeend', TALLES.map(t => `<button type="button" class="regla__t" role="radio" aria-checked="false" tabindex="-1" data-guia-talle="${t.id}" aria-label="Talle ${t.id}"><span class="regla__n">${t.id}</span><span class="regla__e">${t.corto}</span></button>`).join(''));
  const marca = regla.querySelector('.regla__marca');
  const conteo = contarPor('talle');
  const datos = k => document.querySelector(`[data-guia="${k}"]`);
  const elegir = (id, foco = false) => {
    const t = getTalle(id); if (!t) return;
    const i = TALLES.indexOf(t);
    regla.querySelectorAll('[data-guia-talle]').forEach(b => {
      const on = b.dataset.guiaTalle === id;
      b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
    });
    marca?.style.setProperty('--i', i);
    datos('edad').textContent = t.edad;
    datos('altura').textContent = t.altura;
    datos('peso').textContent = t.peso;
    const cta = datos('cta');
    if (cta) { cta.href = `${CATALOGO}?talle=${t.id}`; cta.textContent = `Ver ${conteo[t.id] || 0} prendas en talle ${t.id}`; }
    const w = datos('wsp');
    if (w) w.href = wa(`Hola! Mi bebé tiene ${t.edad} y quiero consultar si le queda el talle ${t.id}.`);
  };
  regla.addEventListener('click', e => { const b = e.target.closest('[data-guia-talle]'); if (b) elegir(b.dataset.guiaTalle); });
  regla.addEventListener('keydown', e => {
    const b = e.target.closest('[data-guia-talle]'); if (!b) return;
    const i = TALLES.findIndex(t => t.id === b.dataset.guiaTalle);
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(TALLES.length - 1, i + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, i - 1);
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = TALLES.length - 1;
    if (n !== null) { e.preventDefault(); elegir(TALLES[n].id, true); }
  });
  elegir('2');
}

function abrirProductoDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQV(id, null);
}

async function init() {
  initNav();
  initDropdowns();
  initSearch();
  initModelBarScroll();
  renderMenus();
  renderColecciones();
  await renderHome();
  await initCatalogo();
  initGuia();
  initReveals();
  initRails();
  initFloats();
  initCompra();
  initCarrito();
  initQV();
  updateCartBadge();
  initHeroMotion();
  initParallax();
  abrirProductoDesdeURL();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}
init();
