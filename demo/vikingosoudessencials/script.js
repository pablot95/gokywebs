const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493534277854';
const ZONA = 'America/Argentina/Cordoba';
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
  { id: 'fragancias', nombre: 'Fragancias árabes', bajada: 'Oud, ámbar, almizcle y rosa', img: 'images/cat-fragancias.webp',
    texto: 'Eau de parfum de 50 a 100 ml. Cada ficha trae la salida, el corazón y el fondo del perfume.' },
  { id: 'indumentaria', nombre: 'Indumentaria', bajada: 'Abayas, kaftanes y chales', img: 'images/cat-indumentaria.webp',
    texto: 'Abayas, kaftanes, thobes y chales con bordado. El talle lo elegís en la ficha de cada prenda.',
    subs: [{ id: 'abayas', nombre: 'Abayas' }, { id: 'kaftanes', nombre: 'Kaftanes y thobes' }, { id: 'chales', nombre: 'Chales y pañuelos' }] },
  { id: 'sets', nombre: 'Sets y regalos', bajada: 'Cajas listas para regalar', img: 'images/cat-sets.webp',
    texto: 'Fragancia, chal y caja en un mismo pedido, listos para regalar.' },
  { id: 'accesorios', nombre: 'Accesorios', bajada: 'Sahumadores y oud para quemar', img: 'images/cat-accesorios.webp',
    texto: 'Sahumadores de bronce y oud en astillas para perfumar la casa.' },
];
const NOTAS = [
  { id: 'oud', nombre: 'Oud' }, { id: 'ambar', nombre: 'Ámbar' }, { id: 'almizcle', nombre: 'Almizcle' }, { id: 'rosa', nombre: 'Rosa' },
  { id: 'vainilla', nombre: 'Vainilla' }, { id: 'azafran', nombre: 'Azafrán' }, { id: 'maderas', nombre: 'Maderas' },
];
const PARA = [{ id: 'hombre', nombre: 'Hombre' }, { id: 'mujer', nombre: 'Mujer' }, { id: 'unisex', nombre: 'Unisex' }];
const TALLES = ['S', 'M', 'L', 'XL'];
const PRECIOS = [
  { id: 'hasta50', nombre: 'Hasta $50.000', min: null, max: 50000 },
  { id: '50a100', nombre: '$50.000 a $100.000', min: 50001, max: 100000 },
  { id: 'mas100', nombre: 'Más de $100.000', min: 100001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS_CAT = {
  fragancias: 'perfume perfumes fragancia fragancias eau de parfum edp arabe arabes',
  indumentaria: 'ropa prenda prendas indumentaria tunica bordado',
  sets: 'set sets regalo regalos caja cajas',
  accesorios: 'accesorio accesorios sahumador sahumadores bakhoor incienso mabkhara quemador oud',
};
const HORARIOS = { 0: null, 1: ['10:00', '20:00'], 2: ['10:00', '20:00'], 3: ['10:00', '20:00'], 4: ['10:00', '20:00'], 5: ['10:00', '20:00'], 6: ['10:00', '20:00'] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const E1 = 'images/mesa-oud.webp', E2 = 'images/hero-salon.webp', E3 = 'images/cat-fragancias.webp',
  E4 = 'images/cat-indumentaria.webp', E5 = 'images/cat-sets.webp', E6 = 'images/cat-accesorios.webp';
const TODOS = ['S', 'M', 'L', 'XL'];

const COLECCION = [
  { id: 'oud-al-layl', nombre: 'Oud Al Layl', cat: 'fragancias', precio: 98000, descuento: 0, stock: 12, alta: 20, rango: 1, ml: 100, para: 'unisex', nota: 'oud',
    notas: { salida: 'Azafrán y bergamota', corazon: 'Oud y rosa', fondo: 'Ámbar y almizcle' }, img: 'images/p-oud-al-layl.webp', escena: E1,
    alt: 'Frasco negro octogonal con tapa dorada labrada sobre mármol claro',
    desc: 'Abre con azafrán y se asienta en un oud con rosa. El fondo de ámbar lo sostiene en la piel durante el día.' },
  { id: 'amber-sultan', nombre: 'Amber Sultan', cat: 'fragancias', precio: 86000, descuento: 10, stock: 9, alta: 15, rango: 5, ml: 100, para: 'hombre', nota: 'ambar',
    notas: { salida: 'Cardamomo', corazon: 'Ámbar y benjuí', fondo: 'Vainilla y maderas' }, img: 'images/p-amber-sultan.webp', escena: E1,
    alt: 'Frasco de vidrio con perfume ámbar y tapa dorada al sol',
    desc: 'Ámbar cálido con un toque de cardamomo al abrir. Para la noche y los días de frío.' },
  { id: 'qasr-dhahab', nombre: 'Qasr Al Dhahab', cat: 'fragancias', precio: 79000, descuento: 0, stock: 10, alta: 12, ml: 100, para: 'mujer', nota: 'vainilla',
    notas: { salida: 'Pera y mandarina', corazon: 'Jazmín', fondo: 'Vainilla y almizcle' }, img: 'images/p-qasr-dhahab.webp', escena: E3,
    alt: 'Frasco dorado con tapa de cúpula labrada junto a otros perfumes',
    desc: 'Dulce y luminoso: fruta al principio, jazmín en el centro y un fondo de vainilla que queda en la ropa.' },
  { id: 'taj-al-oud', nombre: 'Taj Al Oud', cat: 'fragancias', precio: 112000, descuento: 0, stock: 7, alta: 25, rango: 3, ml: 100, para: 'unisex', nota: 'oud', tag: 'Nuevo',
    notas: { salida: 'Bergamota', corazon: 'Oud', fondo: 'Cuero y pachulí' }, img: 'images/p-taj-al-oud.webp', escena: E3,
    alt: 'Frasco cuadrado de vidrio con perfume dorado y tapa negra y dorada en forma de corona',
    desc: 'Un oud seco y elegante, con cuero en el fondo. Pocas atomizaciones alcanzan.' },
  { id: 'layali', nombre: 'Layali', cat: 'fragancias', precio: 92000, descuento: 0, stock: 8, alta: 14, rango: 7, ml: 100, para: 'mujer', nota: 'rosa',
    notas: { salida: 'Frutos rojos', corazon: 'Rosa', fondo: 'Oud suave y vainilla' }, img: 'images/p-layali.webp', escena: E3,
    alt: 'Frasco negro con arabesco dorado y tapa de cúpula',
    desc: 'Rosa intensa con frutos rojos y un oud suave de fondo. Pensado para la noche.' },
  { id: 'ward-taifi', nombre: 'Ward Taifi', cat: 'fragancias', precio: 64000, descuento: 0, stock: 11, alta: 30, ml: 50, para: 'mujer', nota: 'rosa',
    notas: { salida: 'Limón', corazon: 'Rosa de Taif', fondo: 'Almizcle blanco' }, img: 'images/p-ward-taifi.webp', escena: E3,
    alt: 'Frasco chico de cristal tallado con perfume ámbar y tapa dorada',
    desc: 'Una rosa fresca y limpia, de uso diario. Formato de 50 ml para llevar en la cartera.' },
  { id: 'hayba-oud', nombre: 'Hayba Oud', cat: 'fragancias', precio: 104000, descuento: 0, stock: 3, alta: 27, ml: 100, para: 'hombre', nota: 'oud',
    notas: { salida: 'Pimienta negra', corazon: 'Oud ahumado', fondo: 'Incienso' }, img: 'images/p-hayba-oud.webp', escena: E2,
    alt: 'Frasco negro cuadrado con grabado dorado sobre una bandeja de mármol',
    desc: 'Oud ahumado con pimienta e incienso. El más intenso de la casa.' },
  { id: 'ambar-cristal', nombre: 'Ámbar Cristal', cat: 'fragancias', precio: 76000, descuento: 0, stock: 10, alta: 9, ml: 100, para: 'unisex', nota: 'ambar',
    notas: { salida: 'Mandarina', corazon: 'Ámbar', fondo: 'Benjuí y vainilla' }, img: 'images/p-ambar-cristal.webp', escena: E2,
    alt: 'Frasco de cristal facetado con perfume dorado y tapa esférica',
    desc: 'Ámbar dulce y redondo, fácil de usar de día. Un buen primer perfume árabe.' },
  { id: 'khashab-reserve', nombre: 'Khashab Reserve', cat: 'fragancias', precio: 88000, descuento: 0, stock: 6, alta: 8, ml: 100, para: 'hombre', nota: 'maderas',
    notas: { salida: 'Cardamomo', corazon: 'Cedro y sándalo', fondo: 'Oud' }, img: 'images/p-khashab-reserve.webp', escena: E5,
    alt: 'Frasco cuadrado de vidrio ahumado con arabesco dorado',
    desc: 'Maderas secas de cedro y sándalo con un fondo de oud. Sobrio, para la oficina o la noche.' },
  { id: 'musk-tahara', nombre: 'Musk Tahara', cat: 'fragancias', precio: 58000, descuento: 0, stock: 14, alta: 33, ml: 80, para: 'unisex', nota: 'almizcle', tag: 'Nuevo',
    notas: { salida: 'Flores blancas', corazon: 'Almizcle', fondo: 'Talco suave' }, img: 'images/p-musk-tahara.webp', escena: E5,
    alt: 'Frasco alto de cristal dorado con tapa de cúpula acanalada',
    desc: 'Almizcle limpio, de piel recién bañada. Se puede usar solo o debajo de otro perfume.' },
  { id: 'zafaran-royal', nombre: 'Zafaran Royal', cat: 'fragancias', precio: 96000, descuento: 0, stock: 8, alta: 11, ml: 100, para: 'unisex', nota: 'azafran',
    notas: { salida: 'Azafrán', corazon: 'Rosa', fondo: 'Ámbar y oud' }, img: 'images/p-zafaran-royal.webp', escena: E6,
    alt: 'Frasco negro con tapa esférica dorada sobre una bandeja de mármol negro',
    desc: 'Azafrán especiado sobre rosa, con ámbar y oud de fondo. Deja estela.' },
  { id: 'filigrana-oud', nombre: 'Filigrana Oud', cat: 'fragancias', precio: 118000, descuento: 0, stock: 5, alta: 10, ml: 100, para: 'hombre', nota: 'oud',
    notas: { salida: 'Canela', corazon: 'Oud', fondo: 'Vainilla oscura' }, img: 'images/p-filigrana-oud.webp', escena: E6,
    alt: 'Frasco alto negro con filigrana dorada calada',
    desc: 'Oud con canela y vainilla oscura. Cálido y especiado, para el invierno.' },

  { id: 'abaya-hojas', nombre: 'Abaya negra con bordado de hojas', cat: 'indumentaria', sub: 'abayas', precio: 124000, descuento: 0, stock: 6, alta: 22, rango: 2, talles: TODOS,
    img: 'images/p-abaya-hojas.webp', escena: E6, alt: 'Abaya negra con ramas de hojas bordadas en hilo dorado',
    desc: 'Abaya negra de caída suave con ramas bordadas en hilo dorado sobre mangas y frente.' },
  { id: 'abaya-marfil', nombre: 'Abaya marfil bordada', cat: 'indumentaria', sub: 'abayas', precio: 124000, descuento: 0, stock: 5, alta: 32, talles: TODOS, tag: 'Nuevo',
    img: 'images/p-abaya-marfil.webp', escena: E6, alt: 'Abaya color marfil con bordado dorado vertical',
    desc: 'Marfil con bordado dorado a lo largo del frente. Para eventos y celebraciones.' },
  { id: 'abaya-guarda', nombre: 'Abaya negra con guarda dorada', cat: 'indumentaria', sub: 'abayas', precio: 109000, descuento: 0, stock: 7, alta: 7, talles: TODOS,
    img: 'images/p-abaya-guarda.webp', escena: E4, alt: 'Abaya negra abierta con guarda dorada en el borde, colgada en percha',
    desc: 'Abierta adelante, con guarda dorada en todo el borde. Se usa sobre cualquier prenda.' },
  { id: 'abaya-ceremonial', nombre: 'Abaya ceremonial negra y oro', cat: 'indumentaria', sub: 'abayas', precio: 138000, descuento: 0, stock: 2, alta: 6, talles: ['M', 'L'],
    img: 'images/p-abaya-ceremonial.webp', escena: E5, alt: 'Abayas negras con anchas guardas bordadas en dorado colgadas en un perchero',
    desc: 'Guardas anchas bordadas en dorado en mangas y ruedo. La pieza más elaborada de la colección.' },
  { id: 'kaftan-arena', nombre: 'Kaftan liviano arena', cat: 'indumentaria', sub: 'kaftanes', precio: 84000, descuento: 0, stock: 8, alta: 5, talles: TODOS,
    img: 'images/p-kaftan-arena.webp', escena: E4, alt: 'Kaftanes livianos en blanco y arena colgados en un perchero',
    desc: 'Tela liviana en color arena, de manga ancha. Fresco para el verano.' },
  { id: 'kaftan-bordado', nombre: 'Kaftan negro con medallón bordado', cat: 'indumentaria', sub: 'kaftanes', precio: 96000, descuento: 0, stock: 6, alta: 18, rango: 6, talles: TODOS,
    img: 'images/p-kaftan-bordado.webp', escena: E2, alt: 'Kaftanes negros y blancos colgados, uno con medallón bordado en dorado',
    desc: 'Kaftan negro con un medallón bordado en dorado en el pecho. Largo hasta el tobillo.' },
  { id: 'thobe-algodon', nombre: 'Thobe de algodón con borla', cat: 'indumentaria', sub: 'kaftanes', precio: 79000, descuento: 0, stock: 10, alta: 4, talles: TODOS,
    img: 'images/p-thobe-algodon.webp', escena: E4, alt: 'Thobes doblados en marfil, arena y negro con borla en el cuello',
    desc: 'Algodón con guarda tejida y borla en el cuello. En marfil, arena o negro: elegí el color por WhatsApp.' },
  { id: 'thobe-lino', nombre: 'Thobe de lino con cordón', cat: 'indumentaria', sub: 'kaftanes', precio: 82000, descuento: 15, stock: 7, alta: 29, talles: TODOS,
    img: 'images/p-thobe-lino.webp', escena: E2, alt: 'Thobes de lino doblados en blanco, negro y crudo atados con cordón dorado',
    desc: 'Lino con cordón dorado y guarda en el puño. Se arruga poco y respira.' },
  { id: 'ghutra-bordada', nombre: 'Pañuelo blanco con guarda bordada', cat: 'indumentaria', sub: 'chales', precio: 34000, descuento: 0, stock: 12, alta: 3, talles: ['Único'],
    img: 'images/p-ghutra-bordada.webp', escena: E1, alt: 'Pañuelo blanco doblado con guarda bordada en dorado',
    desc: 'Pañuelo blanco con guarda bordada en tonos dorados. Para la cabeza o los hombros.' },
  { id: 'chal-guarda', nombre: 'Chal negro con guarda dorada', cat: 'indumentaria', sub: 'chales', precio: 39000, descuento: 0, stock: 9, alta: 2, talles: ['Único'],
    img: 'images/p-chal-guarda.webp', escena: E1, alt: 'Chal negro con guarda ancha bordada en dorado y flecos',
    desc: 'Chal negro con guarda ancha bordada en dorado y terminación con flecos.' },
  { id: 'chal-marfil', nombre: 'Chal marfil de seda fría', cat: 'indumentaria', sub: 'chales', precio: 42000, descuento: 0, stock: 8, alta: 26, talles: ['Único'],
    img: 'images/p-chal-marfil.webp', escena: E5, alt: 'Chal marfil con bordado dorado junto a un rosario de cuentas negras',
    desc: 'Seda fría color marfil con bordado dorado en los bordes. Liviano y con mucha caída.' },
  { id: 'pashmina-negra', nombre: 'Pashmina negra bordada', cat: 'indumentaria', sub: 'chales', precio: 36000, descuento: 0, stock: 10, alta: 1, talles: ['Único'],
    img: 'images/p-pashmina-negra.webp', escena: E4, alt: 'Pashmina negra con bordado dorado sobre mármol',
    desc: 'Pashmina abrigada con bordado dorado en una punta. Para el invierno.' },

  { id: 'caja-marfil', nombre: 'Caja Marfil: fragancia y chal', cat: 'sets', precio: 158000, descuento: 0, stock: 4, alta: 28,
    img: 'images/p-caja-marfil.webp', escena: E5, alt: 'Caja de regalo marfil con moño negro y arabesco dorado',
    desc: 'Caja marfil con moño negro: una fragancia de 100 ml y un chal a elección. Escribinos cuáles querés.' },
  { id: 'set-noche', nombre: 'Set Noche: dos fragancias y bolsa', cat: 'sets', precio: 176000, descuento: 0, stock: 5, alta: 21, rango: 4,
    img: 'images/p-set-noche.webp', escena: E5, alt: 'Bolsa de regalo negra con arabesco dorado y dos frascos de perfume adelante',
    desc: 'Dos fragancias de la casa en bolsa negra con cordón dorado. Las elegís vos o te ayudamos por WhatsApp.' },
  { id: 'caja-chal', nombre: 'Caja con chal bordado', cat: 'sets', precio: 72000, descuento: 10, stock: 6, alta: 13,
    img: 'images/p-caja-chal.webp', escena: E5, alt: 'Caja marfil abierta con un chal negro bordado adentro',
    desc: 'Chal bordado en caja marfil con cierre dorado, lista para regalar.' },
  { id: 'set-bandeja', nombre: 'Set Bandeja: tres fragancias en mármol', cat: 'sets', precio: 248000, descuento: 0, stock: 3, alta: 16,
    img: 'images/p-set-bandeja.webp', escena: E6, alt: 'Tres frascos de perfume y un sahumador sobre una bandeja de mármol negro',
    desc: 'Tres fragancias de 100 ml sobre bandeja de mármol negro con borde dorado.' },

  { id: 'mabkhara-calada', nombre: 'Sahumador calado con oud', cat: 'accesorios', precio: 48000, descuento: 0, stock: 6, alta: 17,
    img: 'images/p-mabkhara-calada.webp', escena: E1, alt: 'Sahumador de bronce calado con astillas de oud humeando',
    desc: 'Mabkhara de bronce calado con un primer puñado de oud para estrenarla.' },
  { id: 'mabkhara-dorada', nombre: 'Sahumador dorado con tapa', cat: 'accesorios', precio: 54000, descuento: 0, stock: 7, alta: 19, rango: 8,
    img: 'images/p-mabkhara-dorada.webp', escena: E2, alt: 'Sahumador dorado calado con tapa de cúpula',
    desc: 'Sahumador dorado con tapa calada: el humo sale parejo y no se vuelan las brasas.' },
  { id: 'mabkhara-pie', nombre: 'Sahumador de pie', cat: 'accesorios', precio: 46000, descuento: 0, stock: 8, alta: 23,
    img: 'images/p-mabkhara-pie.webp', escena: E4, alt: 'Sahumador dorado de pie con tapa calada y humo',
    desc: 'Con pie alto y tapa calada, para dejar en una mesa o un mueble de entrada.' },
  { id: 'quemador-clasico', nombre: 'Quemador clásico de bronce', cat: 'accesorios', precio: 39000, descuento: 0, stock: 9, alta: 24,
    img: 'images/p-quemador-clasico.webp', escena: E5, alt: 'Quemador de bronce redondo con tapa calada',
    desc: 'Quemador redondo de bronce para bakhoor o astillas de oud.' },
  { id: 'oud-astillas', nombre: 'Oud en astillas 25 g', cat: 'accesorios', precio: 29000, descuento: 0, stock: 15, alta: 31, tag: 'Nuevo',
    img: 'images/p-oud-astillas.webp', escena: E5, alt: 'Cuenco oscuro con astillas de madera de oud',
    desc: 'Astillas de madera de oud para sahumar. Con 25 g tenés para varias semanas.' },

  { id: 'oud-al-layl-50', nombre: 'Oud Al Layl 50 ml', cat: 'fragancias', precio: 62000, descuento: 0, stock: 0, alta: 34, ml: 50, para: 'unisex', nota: 'oud', visible: false,
    notas: { salida: 'Azafrán y bergamota', corazon: 'Oud y rosa', fondo: 'Ámbar y almizcle' }, img: 'images/p-oud-al-layl.webp', escena: E1,
    alt: 'Frasco negro octogonal con tapa dorada labrada', desc: 'Próximo ingreso.' },
];

function crearTienda(coleccion, { tope = 100, extra = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.para, p.nota, p.desc, p.ml ? `${p.ml} ml` : '',
    ...(p.notas ? Object.values(p.notas) : []), ...(p.talles || []), extra(p),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), para = lista(f.para), nota = lista(f.nota), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (para.length && !para.includes(p.para)) return false;
    if (nota.length && !nota.includes(p.nota)) return false;
    if (talle.length && !(p.talles || []).some(t => talle.includes(t))) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const Tienda = crearTienda(COLECCION, { tope: 100, extra: p => ETIQUETAS_CAT[p.cat] || '' });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conTalle = p => (p.talles || []).length > 1;

const Cart = {
  KEY: 'vikingos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.talle || '') === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.talle || '') === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle || '') === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/></svg>',
  talle: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
  runa: '<svg class="runa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M6.5 7l11 10M17.5 7l-11 10"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  if (p.cat === 'fragancias') return `${p.ml} ml · ${nombreDe(PARA, p.para)}`;
  if (p.cat === 'indumentaria') return conTalle(p) ? `Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]}` : 'Talle único';
  return nombreDe(CATEGORIAS, p.cat);
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="badge">${esc(p.tag)}</span>`);
  else if (p.stock <= 3) b.push('<span class="badge badge--claro">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;

function cardHTML(p, { variante = MODELO === '2' ? 'foto' : 'clasica', grande = false, compacta = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="720" height="900" decoding="async">`;
  if (variante === 'foto') {
    const accion = conTalle(p)
      ? `<button type="button" class="prod-add" data-qv-abrir="${p.id}" aria-label="Elegir talle: ${nombre}">${ICON.talle}</button>`
      : `<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--foto${grande ? ' prod--grande' : ''}">
      <span class="prod__sizer"></span>
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver detalle: ${nombre}">${img}${badgesHTML(p)}</a>
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        <h3 class="prod__nombre">${nombre}</h3>
        ${precioHTML(p)}
        <div class="prod__acciones">${accion}</div>
      </div>
    </article>`;
  }
  const control = conTalle(p)
    ? `<label class="talle-sel"><span class="sr-only">Talle de ${nombre}</span><select data-talle>${p.talles.map(t => `<option value="${t}">${t}</option>`).join('')}</select></label>`
    : compacta ? '' : `<div class="stepper" data-stepper data-max="${p.stock}"><button type="button" data-menos aria-label="Restar uno" disabled>${ICON.menos}</button><output>1</output><button type="button" data-mas aria-label="Sumar uno">${ICON.mas}</button></div>`;
  return `<article class="prod${compacta ? ' prod--compacta' : ''}">
    <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      ${compacta ? '' : `<button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>`}
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
    panel.innerHTML = CATEGORIAS.map(c => `
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="44" height="44" decoding="async">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
      </a>${c.subs ? `<div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>` : ''}`).join('')
      + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function ahoraEnCordoba() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const v = t => partes.find(p => p.type === t)?.value;
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[v('weekday')] ?? new Date().getDay();
  return { dia, min: (parseInt(v('hour'), 10) % 24) * 60 + parseInt(v('minute'), 10) };
}
const aMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const horaCorta = s => (s.endsWith(':00') ? s.slice(0, -3) : s);
function estadoAtencion(ahora = ahoraEnCordoba()) {
  const hoy = HORARIOS[ahora.dia];
  if (hoy && ahora.min >= aMin(hoy[0]) && ahora.min < aMin(hoy[1])) {
    return { abierto: true, texto: 'Abierto ahora', detalle: `hasta las ${horaCorta(hoy[1])} h` };
  }
  for (let k = 0; k < 8; k++) {
    const d = (ahora.dia + k) % 7;
    const h = HORARIOS[d];
    if (!h || (k === 0 && ahora.min >= aMin(h[0]))) continue;
    const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, texto: 'Cerrado ahora', detalle: `abrimos ${cuando} a las ${horaCorta(h[0])} h` };
  }
  return { abierto: false, texto: 'Cerrado ahora', detalle: '' };
}
function initHorarios() {
  const pintar = () => {
    const ahora = ahoraEnCordoba();
    const e = estadoAtencion(ahora);
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      el.innerHTML = `<span class="estado__punto" aria-hidden="true"></span>${e.texto}`;
    });
    document.querySelectorAll('[data-estado-detalle]').forEach(el => { el.textContent = e.detalle ? `· ${e.detalle}` : ''; });
    document.querySelectorAll('[data-estado-pill]').forEach(el => el.classList.toggle('is-abierto', e.abierto));
    document.querySelectorAll('[data-dia]').forEach(li => li.classList.toggle('is-hoy', Number(li.dataset.dia) === ahora.dia));
    const nota = document.querySelector('[data-horario-nota]');
    if (nota) nota.textContent = e.abierto
      ? `Hoy atendemos ${e.detalle}. Escribinos y te respondemos en el momento.`
      : `Fuera de horario: ${e.detalle}. Dejanos tu mensaje y te respondemos apenas abrimos.`;
    document.querySelectorAll('[data-horario-cta]').forEach(a => {
      a.href = wspHref(e.abierto ? 'Hola Vikingos! ¿Están atendiendo? Quiero hacer una consulta.' : 'Hola Vikingos! Les dejo mi consulta para cuando abran: ');
      const txt = a.querySelector('[data-horario-cta-txt]');
      if (txt) txt.textContent = e.abierto ? 'Escribinos ahora' : 'Dejanos tu consulta';
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initHeroSlider() {
  const banner = document.querySelector('[data-slider]');
  if (!banner) return;
  const slides = [...banner.querySelectorAll('[data-slide]')];
  const dots = [...banner.querySelectorAll('.hero1__dot')];
  const dotsWrap = banner.querySelector('.hero1__dots');
  if (slides.length < 2) return;
  let i = 0;
  const ir = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-activa', on);
      if (on) { s.removeAttribute('aria-hidden'); s.removeAttribute('inert'); }
      else { s.setAttribute('aria-hidden', 'true'); s.setAttribute('inert', ''); }
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  };
  dots.forEach((d, k) => {
    d.addEventListener('click', () => ir(k));
    d.querySelector('span')?.addEventListener('animationend', () => { if (k === i) ir(i + 1); });
  });
  const pausar = v => dotsWrap?.classList.toggle('is-pausado', v);
  banner.addEventListener('mouseenter', () => pausar(true));
  banner.addEventListener('mouseleave', () => pausar(false));
  banner.addEventListener('focusin', () => pausar(true));
  banner.addEventListener('focusout', e => { if (!banner.contains(e.relatedTarget)) pausar(false); });
  document.addEventListener('visibilitychange', () => pausar(document.hidden));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const activa = hero.querySelector('.hero1__slide.is-activa') || hero;
  tl.from(activa.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(activa.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(activa.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(activa.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero1__side, .hero1__dots, .hero2__arco-borde, .sello, .hero-badge'), { y: 20, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
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
      try { vp.setPointerCapture?.(pointerId); } catch (e) { void e; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (e) { void e; }
    if (moved) requestAnimationFrame(() => vp.classList.remove('dragging'));
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initHome() {
  if (PAGINA !== 'home') return;
  const rail = document.getElementById('railDestacados');
  if (rail) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const grilla = document.getElementById('grillaNovedades');
  if (grilla) {
    const items = Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
    grilla.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaicoDestacados');
  if (mosaico) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    mosaico.innerHTML = items.map((p, k) => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'foto', grande: k === 0 })}</li>`).join('')
      + `<li data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="mosaico-cta" href="${CATALOGO_URL}">${ICON.runa}<strong>Todo el catálogo, con filtros por nota y talle</strong><span>Ver el catálogo ${ICON.flecha}</span></a></li>`;
  }
}

const QV = { p: null, talle: '', foto: 0, opener: null };
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = cat?.subs?.find(s => s.id === p.sub);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt, escena: false }, { src: p.escena, alt: `Ambiente: ${p.alt}`, escena: true }];
  const msg = `Hola Vikingos! Quiero consultar por ${p.nombre}${QV.talle && QV.talle !== 'Único' ? ` talle ${QV.talle}` : ''}.`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img id="qvImg" src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="720" height="900"${fotos[QV.foto].escena ? ' style="object-fit:contain;background:#1B1712"' : ''}></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto del ambiente' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}${sub ? ` · ${esc(sub.nombre)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.notas ? `<dl class="piramide">
          <div><dt>Salida</dt><dd>${esc(p.notas.salida)}</dd></div>
          <div><dt>Corazón</dt><dd>${esc(p.notas.corazon)}</dd></div>
          <div><dt>Fondo</dt><dd>${esc(p.notas.fondo)}</dd></div>
          <div><dt>Presentación</dt><dd>Eau de parfum · ${p.ml} ml · ${esc(nombreDe(PARA, p.para))}</dd></div>
        </dl>` : ''}
        ${conTalle(p) ? `<div>
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__talles" role="group" aria-label="Elegí el talle">${p.talles.map(t => `<button type="button" class="qv__talle" data-qv-talle="${t}" aria-pressed="${QV.talle === t}">${t}</button>`).join('')}</div>
          <p class="qv__talle-aviso" id="qvTalleAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--gold" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="720" height="900"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.talle = conTalle(p) ? '' : (p.talles?.[0] || ''); QV.foto = 0;
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
    const t = e.target.closest('[data-qv-talle]');
    if (t) {
      QV.talle = t.dataset.qvTalle;
      modal.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      const aviso = document.getElementById('qvTalleAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Vikingos! Quiero consultar por ${QV.p.nombre} talle ${QV.talle}.`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conTalle(p) && !QV.talle) {
        const aviso = document.getElementById('qvTalleAviso');
        if (aviso) aviso.textContent = 'Elegí un talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-talle]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conTalle(p) ? QV.talle : (p.talles?.[0] || ''));
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${conTalle(p) ? ` (talle ${QV.talle})` : ''} al carrito.`);
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
  const talle = i.talle || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-talle="${esc(talle)}">
    <img src="${p.img}" alt="" width="72" height="90">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${talle ? `Talle ${esc(talle)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
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
    items.innerHTML = `<div class="drawer__vacio">${ICON.runa}<p>Tu carrito está vacío. Empezá por una fragancia o una prenda.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Ir al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = ['Hola Vikingos! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.talle && i.talle !== 'Único' ? ` (talle ${i.talle})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
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
    const id = linea.dataset.linea, talle = linea.dataset.lineaTalle || '';
    const it = Cart.get().find(i => i.id === id && (i.talle || '') === talle);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, talle); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, talle, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, talle, it.qty - 1);
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
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
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
      const acciones = add.closest('.prod__acciones');
      const talle = acciones?.querySelector('[data-talle]')?.value || (p.talles?.[0] || '');
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, talle);
      showToast(`Sumaste ${p.nombre}${conTalle(p) ? ` (talle ${talle})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const talle = acciones?.querySelector('[data-talle]')?.value || (p.talles?.[0] || '');
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, talle);
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
    cat: valido(params.get('cat'), CATEGORIAS),
    sub: [], para: multi('para', PARA), nota: multi('nota', NOTAS), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = multi('sub', CATEGORIAS.find(c => c.id === 'indumentaria').subs);
  const compatibles = () => {
    if (e.cat && e.cat !== 'indumentaria') { e.sub = []; e.talle = []; }
    if (e.cat && e.cat !== 'fragancias') { e.para = []; e.nota = []; }
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
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.para.length) f.para = e.para;
    if (e.nota.length) f.nota = e.nota;
    if (e.talle.length) f.talle = e.talle;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${nombre.replace(/-.*$/, '')}"${marcado ? ' checked' : ''}>${etiqueta}${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}))}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }))).join('')}</fieldset>`);
    if (e.cat === 'indumentaria') grupos.push(`<fieldset class="f-grupo"><legend>Tipo de prenda</legend>
      ${CATEGORIAS[1].subs.map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: 'indumentaria', sub: s.id }))).join('')}</fieldset>`);
    if (!e.cat || e.cat === 'fragancias') {
      grupos.push(`<fieldset class="f-grupo"><legend>Nota principal</legend>
        ${NOTAS.map(n => opcion('checkbox', `nota-${n.id}`, n.id, n.nombre, e.nota.includes(n.id), Tienda.contar({ ...base, nota: n.id }))).join('')}</fieldset>`);
      grupos.push(`<fieldset class="f-grupo"><legend>Para</legend>
        ${PARA.map(x => opcion('checkbox', `para-${x.id}`, x.id, x.nombre, e.para.includes(x.id), Tienda.contar({ ...base, para: x.id }))).join('')}</fieldset>`);
    }
    if (!e.cat || e.cat === 'indumentaria') grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend><div class="f-talles">
      ${TALLES.map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio)}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const titulo = sub ? sub.nombre : cat ? cat.nombre : 'Catálogo completo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Fragancias árabes originales, indumentaria con bordado, sets para regalar y accesorios para sahumar.';
    document.title = `${titulo} — Vikingos oud + essencials`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; migaSep && (migaSep.hidden = !cat); miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(CATEGORIAS[1].subs, v)]));
    e.nota.forEach(v => quitar.push(['nota', v, `Nota: ${nombreDe(NOTAS, v)}`]));
    e.para.forEach(v => quitar.push(['para', v, `Para ${nombreDe(PARA, v).toLowerCase()}`]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    if (nBadge) { nBadge.textContent = quitar.length + (e.cat ? 1 : 0); nBadge.hidden = !(quitar.length + (e.cat ? 1 : 0)); }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'para', 'nota', 'talle', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.para.length) u.searchParams.set('para', e.para.join(','));
    if (e.nota.length) u.searchParams.set('nota', e.nota.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
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
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else {
      const set = new Set(e[grupo]);
      inp.checked ? set.add(inp.value) : set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.para = []; e.nota = []; e.talle = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = [];
    aplicar();
  });
  document.querySelectorAll('.cats-item, .cats-subs a, .cats-todo').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => CATEGORIAS[1].subs.some(s => s.id === v));
    e.para = []; e.nota = []; e.talle = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));

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
  modo();
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

initCatsMenu();
initHome();
initCatalogo();
initHorarios();
initReveals();
initNav();
initHeroSlider();
initHeroMotion();
initLeeScroll();
initRail();
initQV();
initCarrito();
initAcciones();
initFloats();
initModelBarScroll();
syncModelosLink();
updateCartBadge();
