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

const WSP = '5493469694020';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_TALLE = 'pequenos_talle';

const CATEGORIAS = [
  { id: 'recien-nacidos', nombre: 'Recién nacidos', rango: 'RN a 3 meses', tono: 'rn', img: 'images/e-recien-nacidos.webp',
    bajada: 'Bodies, enteritos, escarpines y mantas para los primeros meses.' },
  { id: 'bebes', nombre: 'Bebés', rango: '6 meses a 2 años', tono: 'bebe', img: 'images/e-bebes.webp',
    bajada: 'Jardineros, enteritos, cárdigans y conjuntos para gatear y dar los primeros pasos.' },
  { id: 'ninos', nombre: 'Niños', rango: 'Talle 2 a 18', tono: 'nino', img: 'images/e-ninos.webp',
    bajada: 'Camperas, buzos, remeras, vestidos y jeans para el jardín, la escuela y la plaza.' },
  { id: 'accesorios', nombre: 'Accesorios', rango: 'Para todas las etapas', tono: 'acc', img: 'images/e-accesorios.webp',
    bajada: 'Mochilas, gorros, calzado y mantas para completar el ropero.' },
];
const TIPOS = {
  bodies: 'Bodies y enteritos', abrigos: 'Abrigos y tejidos', remeras: 'Remeras y buzos', pantalones: 'Pantalones y jardineros',
  vestidos: 'Vestidos', conjuntos: 'Conjuntos', calzado: 'Calzado', accesorios: 'Mochilas, gorros y mantas',
};
const PARA = { nena: 'Nena', nene: 'Nene', unisex: 'Unisex' };
const COLORES = {
  Crudo: '#EDE3D2', Natural: '#D9CBB4', Celeste: '#A9C6E3', 'Verde salvia': '#8FA88A', Beige: '#CDB896', Arena: '#B59A78', Rayado: '#3A3A40',
  Blanco: '#F5F3EE', Mostaza: '#D2A64A', Lila: '#B9A6D6', 'Azul marino': '#26324F', Marrón: '#7A5B45', 'Verde agua': '#BFE0D2',
  Rosa: '#E8B7B9', 'Rosa viejo': '#C98E8A', Gris: '#C9CBCF', Azul: '#3E5F8C',
};
const RANGOS = {
  hasta15: { nombre: 'Hasta $15.000', max: 15000 },
  '15a25': { nombre: '$15.000 a $25.000', min: 15001, max: 25000 },
  mas25: { nombre: 'Más de $25.000', min: 25001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const TALLES = [
  { t: 'RN', edad: 'Recién nacido', cm: [46, 56], tono: 'rn' },
  { t: '3M', edad: '0 a 3 meses', cm: [56, 62], tono: 'rn' },
  { t: '6M', edad: '3 a 6 meses', cm: [62, 68], tono: 'bebe' },
  { t: '9M', edad: '6 a 9 meses', cm: [68, 74], tono: 'bebe' },
  { t: '12M', edad: '9 a 12 meses', cm: [74, 80], tono: 'bebe' },
  { t: '18M', edad: '12 a 18 meses', cm: [80, 86], tono: 'bebe' },
  { t: '2', edad: '18 meses a 2 años', cm: [86, 92], tono: 'bebe' },
  { t: '4', edad: '3 a 4 años', cm: [92, 104], tono: 'nino' },
  { t: '6', edad: '5 a 6 años', cm: [104, 116], tono: 'nino' },
  { t: '8', edad: '7 a 8 años', cm: [116, 128], tono: 'nino' },
  { t: '10', edad: '9 a 10 años', cm: [128, 140], tono: 'nino' },
  { t: '12', edad: '11 a 12 años', cm: [140, 152], tono: 'nino' },
  { t: '14', edad: '13 a 14 años', cm: [152, 160], tono: 'nino' },
  { t: '16', edad: '15 a 16 años', cm: [160, 166], tono: 'nino' },
  { t: '18', edad: '17 a 18 años', cm: [166, 176], tono: 'nino' },
];
const CALZADO = [['17', '10,5'], ['18', '11,2'], ['19', '11,8'], ['20', '12,5'], ['21', '13,2'], ['22', '13,8']];
const T_BEBE = ['RN', '3M', '6M', '9M', '12M', '18M'];
const T_NINO = ['2', '4', '6', '8', '10', '12', '14', '16', '18'];
const T_CALZADO = CALZADO.map(c => c[0]);
const GRUPOS_TALLE = [['Bebés', T_BEBE], ['Niños', T_NINO], ['Calzado', T_CALZADO], ['Accesorios', ['Único']]];
const ALTO_MIN = TALLES[0].cm[0];
const ALTO_MAX = TALLES[TALLES.length - 1].cm[1];
const tl = (lista, stocks) => lista.map((v, i) => ({ v, stock: stocks[i] ?? 0 }));
const unico = stock => [{ v: 'Único', stock }];

const PRODUCTOS = [
  { id: 'body-celeste', nombre: 'Body de algodón manga corta', corto: 'Suave para sus primeros días', cat: 'recien-nacidos', tipo: 'bodies', para: 'unisex', precio: 9900, descuento: 0, color: 'Celeste', ops: tl(['RN', '3M', '6M', '9M', '12M'], [6, 8, 7, 5, 3]), rango: 1, alta: 9,
    img: 'images/p-body-celeste.webp', alt: 'Body celeste de algodón con manga corta y cuello americano, extendido sobre fondo crema',
    desc: 'Algodón peinado, cuello americano para pasarlo fácil por la cabeza y broches en la entrepierna para cambiar el pañal sin desvestirlo.', tags: ['body', 'bodies', 'algodon', 'celeste', 'manga corta', 'bebe', 'recien nacido'] },
  { id: 'enterito-muselina', nombre: 'Enterito de muselina con botones', cat: 'recien-nacidos', tipo: 'bodies', para: 'unisex', precio: 24900, descuento: 0, color: 'Crudo', ops: tl(['RN', '3M', '6M', '9M'], [3, 5, 4, 2]), rango: 2, alta: 10,
    img: 'images/p-enterito-muselina.webp', alt: 'Enterito de muselina color crudo con botones de madera y mangas largas, colgado en una percha',
    desc: 'Muselina de algodón con textura arrugada, botones de madera al frente y puños con elástico suave. Liviano y fresco para la media estación.', tags: ['enterito', 'muselina', 'crudo', 'manga larga', 'botones', 'recien nacido'] },
  { id: 'jardinero-jean', nombre: 'Jardinero de jean con tiradores', corto: 'Cómodo y versátil para cada aventura', cat: 'bebes', tipo: 'pantalones', para: 'unisex', precio: 28900, descuento: 0, color: 'Celeste', ops: tl(['9M', '12M', '18M', '2', '4'], [2, 4, 5, 4, 2]), rango: 3, alta: 8,
    img: 'images/p-jardinero-jean.webp', alt: 'Jardinero de jean celeste con tiradores, bolsillo pechera y botamangas dobladas',
    desc: 'Denim liviano lavado celeste, tiradores regulables con botón y bolsillo en la pechera. Las botamangas se doblan y se bajan a medida que crece.', tags: ['jardinero', 'jean', 'denim', 'celeste', 'enterito', 'overol'] },
  { id: 'campera-lluvia', nombre: 'Campera impermeable con capucha', cat: 'ninos', tipo: 'abrigos', para: 'unisex', precio: 38900, descuento: 0, color: 'Mostaza', ops: tl(['2', '4', '6', '8', '10'], [2, 4, 5, 3, 2]), rango: 4, alta: 30,
    img: 'images/p-campera-lluvia.webp', alt: 'Campera impermeable color mostaza con capucha forrada, broches y dos bolsillos con tapa',
    desc: 'Tela que repele el agua, capucha forrada, broches a presión y bolsillos con tapa. Para los días de lluvia camino al jardín o la escuela.', tags: ['campera', 'impermeable', 'lluvia', 'mostaza', 'amarilla', 'capucha', 'abrigo', 'piloto'] },
  { id: 'escarpines-tejidos', nombre: 'Escarpines tejidos con puño', cat: 'recien-nacidos', tipo: 'calzado', para: 'unisex', precio: 8900, descuento: 0, color: 'Natural', ops: tl(['RN', '3M', '6M'], [5, 6, 3]), rango: 5, alta: 20,
    img: 'images/p-escarpines-tejidos.webp', alt: 'Par de escarpines tejidos color natural con puño acanalado',
    desc: 'Punto de algodón con puño acanalado que no se sale del pie. Suela blanda para los que todavía no caminan.', tags: ['escarpines', 'botitas', 'tejido', 'natural', 'calzado', 'recien nacido'] },
  { id: 'saquito-calado', nombre: 'Saquito calado de hilo', cat: 'recien-nacidos', tipo: 'abrigos', para: 'nena', precio: 19900, descuento: 0, color: 'Rosa', ops: tl(['RN', '3M', '6M', '9M'], [2, 3, 3, 1]), rango: 6, alta: 14,
    img: 'images/p-saquito-calado.webp', alt: 'Saquito rosa de hilo con puntos calados y botones, junto a unas guillerminas',
    desc: 'Hilo de algodón con puntos calados y botones nacarados. Abriga sin pesar sobre el body o el enterito.', tags: ['saquito', 'saco', 'calado', 'rosa', 'hilo', 'tejido', 'nena'] },
  { id: 'cardigan-verde', nombre: 'Cárdigan de punto con botones', cat: 'bebes', tipo: 'abrigos', para: 'unisex', precio: 22900, descuento: 0, color: 'Verde salvia', ops: tl(['6M', '9M', '12M', '18M', '2'], [2, 3, 4, 3, 2]), rango: 7, alta: 26,
    img: 'images/p-cardigan-verde.webp', alt: 'Cárdigan de punto verde salvia con botones de madera, extendido',
    desc: 'Punto de algodón verde salvia con botones de madera y puños acanalados. Combina con el pantalón de gabardina.', tags: ['cardigan', 'saco', 'tejido', 'verde', 'botones', 'abrigo'] },
  { id: 'vestido-lila', nombre: 'Vestido de lino con volados', cat: 'ninos', tipo: 'vestidos', para: 'nena', precio: 26900, descuento: 0, color: 'Lila', ops: tl(['2', '4', '6', '8'], [3, 4, 3, 2]), rango: 8, alta: 24,
    img: 'images/p-vestido-lila.webp', alt: 'Vestido lila de lino con mangas de volado y falda con dos niveles, en una percha de madera',
    desc: 'Lino y algodón color lila, mangas con volado, falda en dos niveles y botones en la espalda.', tags: ['vestido', 'lino', 'lila', 'volados', 'nena', 'verano'] },
  { id: 'buzo-frisa', nombre: 'Buzo de frisa cuello redondo', cat: 'ninos', tipo: 'remeras', para: 'unisex', precio: 24900, descuento: 0, color: 'Azul marino', ops: tl(['4', '6', '8', '10', '12', '14', '16'], [3, 5, 6, 5, 4, 3, 2]), rango: 9, alta: 28,
    img: 'images/p-buzo-frisa.webp', alt: 'Buzo azul marino de frisa con cuello redondo y puños acanalados, extendido',
    desc: 'Frisa de algodón por dentro, cuello redondo y puños acanalados. El básico para el colegio y el fin de semana.', tags: ['buzo', 'frisa', 'azul', 'marino', 'colegio', 'basico'] },
  { id: 'mochila-jardin', nombre: 'Mochila de jardín con bolsillo', corto: 'Ideal para la guardería y sus paseos', cat: 'accesorios', tipo: 'accesorios', para: 'unisex', precio: 26900, descuento: 0, color: 'Rosa', ops: unico(6), rango: 10, alta: 7,
    img: 'images/p-mochila-jardin.webp', alt: 'Mochila rosa de lona con bolsillo delantero verde y crudo, cierres y tiras regulables',
    desc: 'Lona resistente con bolsillo delantero, cierre doble y tiras acolchadas regulables. Entra la muda, la vianda y la botellita.', tags: ['mochila', 'jardin', 'guarderia', 'rosa', 'lona', 'escuela'] },
  { id: 'pantalon-gabardina', nombre: 'Pantalón de gabardina con cintura elástica', cat: 'bebes', tipo: 'pantalones', para: 'unisex', precio: 18900, descuento: 0, color: 'Beige', ops: tl(['9M', '12M', '18M', '2', '4'], [2, 4, 4, 3, 2]), alta: 22,
    img: 'images/p-pantalon-gabardina.webp', alt: 'Pantalón de gabardina beige con cintura elástica, botón y botamangas dobladas, junto al cárdigan verde',
    desc: 'Gabardina de algodón con cintura elástica, botón de madera y bolsillos. Se pone y se saca fácil.', tags: ['pantalon', 'gabardina', 'beige', 'chino', 'cintura elastica'] },
  { id: 'enterito-estampado', nombre: 'Enterito manga corta con animalitos', cat: 'bebes', tipo: 'bodies', para: 'unisex', precio: 17900, descuento: 0, color: 'Arena', ops: tl(['6M', '9M', '12M', '18M'], [3, 3, 2, 0]), alta: 16,
    img: 'images/p-enterito-estampado.webp', alt: 'Enterito de manga corta color arena con estampa de animalitos y botones, colgado en un perchero',
    desc: 'Algodón color arena con estampa de animalitos, botones al frente y bolsillo en el pecho.', tags: ['enterito', 'estampado', 'animales', 'arena', 'manga corta', 'verano'] },
  { id: 'conjunto-rayado', nombre: 'Conjunto rayado de remera y short', cat: 'bebes', tipo: 'conjuntos', para: 'unisex', precio: 21900, descuento: 10, color: 'Rayado', ops: tl(['12M', '18M', '2', '4'], [3, 4, 3, 2]), alta: 27,
    img: 'images/p-conjunto-rayado.webp', alt: 'Conjunto de remera y short con rayas blancas y negras, con gorro y zapatillas al lado',
    desc: 'Remera y short de algodón rayado, short con cintura elástica y cordón. El gorro y las zapatillas de la foto no están incluidos.', tags: ['conjunto', 'rayado', 'remera', 'short', 'verano', 'rayas'] },
  { id: 'set-gorro-escarpines', nombre: 'Set de gorro y escarpines de lana', cat: 'recien-nacidos', tipo: 'accesorios', para: 'unisex', precio: 14900, descuento: 0, colores: ['Rosa viejo', 'Mostaza'], ops: tl(['RN', '3M', '6M'], [2, 4, 3]), alta: 13,
    img: 'images/p-set-gorro-escarpines.webp', alt: 'Gorros tejidos rosa viejo y mostaza con escarpines de lana y un osito tejido sobre una manta',
    desc: 'Gorro y escarpines tejidos a juego. Elegí rosa viejo o mostaza. El osito de la foto no está incluido.', tags: ['gorro', 'escarpines', 'lana', 'tejido', 'set', 'regalo', 'nacimiento'] },
  { id: 'manta-tejida', nombre: 'Manta tejida para cuna', cat: 'recien-nacidos', tipo: 'accesorios', para: 'unisex', precio: 29900, descuento: 0, color: 'Natural', ops: unico(4), alta: 11,
    img: 'images/p-manta-tejida.webp', alt: 'Mantas tejidas en tonos natural y crudo, dobladas una sobre otra',
    desc: 'Tejido de punto grueso en algodón, para la cuna, el cochecito o el huevito. Mide 80 × 100 cm.', tags: ['manta', 'tejida', 'cuna', 'cochecito', 'natural', 'regalo'] },
  { id: 'zapatillas-lona', nombre: 'Zapatillas de lona con cordones', cat: 'accesorios', tipo: 'calzado', para: 'unisex', precio: 19900, descuento: 0, color: 'Blanco', ops: tl(T_CALZADO, [2, 3, 4, 3, 2, 1]), alta: 21,
    img: 'images/p-zapatillas-lona.webp', alt: 'Zapatilla de lona blanca y marrón con cordones, puesta en un pie de bebé',
    desc: 'Lona con puntera de goma, cordones y suela flexible para los primeros pasos.', tags: ['zapatillas', 'lona', 'calzado', 'blanco', 'primeros pasos'] },
  { id: 'pantuflas-osito', nombre: 'Pantuflas de peluche osito', cat: 'accesorios', tipo: 'calzado', para: 'unisex', precio: 14900, descuento: 0, color: 'Natural', ops: tl(T_CALZADO, [3, 3, 2, 2, 1, 0]), alta: 12,
    img: 'images/p-pantuflas-osito.webp', alt: 'Pantuflas de peluche con cara de osito puestas en los pies de un bebé',
    desc: 'Peluche suave con cara de osito y suela antideslizante. Para andar por casa en invierno.', tags: ['pantuflas', 'osito', 'peluche', 'calzado', 'invierno'] },
  { id: 'sweater-rayado', nombre: 'Sweater rayado con cuello polo', cat: 'ninos', tipo: 'abrigos', para: 'nene', precio: 27900, descuento: 0, color: 'Marrón', ops: tl(['2', '4', '6'], [2, 3, 1]), alta: 19,
    img: 'images/p-sweater-rayado.webp', alt: 'Sweater tejido marrón con rayas crudas y cuello polo, colgado de un perchero',
    desc: 'Tejido de algodón marrón con rayas crudas, cuello polo con botones y puños acanalados.', tags: ['sweater', 'pulover', 'rayado', 'marron', 'polo', 'tejido', 'nene'] },
  { id: 'remera-verde-agua', nombre: 'Remera de algodón lisa', cat: 'ninos', tipo: 'remeras', para: 'unisex', precio: 11900, descuento: 15, color: 'Verde agua', ops: tl(['4', '6', '8', '10', '12', '14', '16', '18'], [4, 5, 6, 6, 5, 4, 3, 2]), alta: 25,
    img: 'images/p-remera-verde-agua.webp', alt: 'Remera verde agua de algodón doblada sobre fondo claro con ramas de algodón',
    desc: 'Jersey de algodón peinado, cuello redondo y manga corta. Va sola o debajo del buzo.', tags: ['remera', 'lisa', 'verde', 'agua', 'algodon', 'basica', 'manga corta'] },
  { id: 'vestido-rosa', nombre: 'Vestido de lino sin mangas', cat: 'ninos', tipo: 'vestidos', para: 'nena', precio: 23900, descuento: 0, color: 'Rosa', ops: tl(['2', '4', '6', '8', '10'], [2, 3, 4, 2, 0]), alta: 29,
    img: 'images/p-vestido-rosa.webp', alt: 'Vestido rosa de lino sin mangas con falda fruncida, extendido sobre una mesa clara',
    desc: 'Lino rosa con falda fruncida, terminación festoneada y botones en la espalda.', tags: ['vestido', 'lino', 'rosa', 'sin mangas', 'nena', 'verano'] },
  { id: 'campera-matelaseada', nombre: 'Campera matelaseada con capucha', cat: 'ninos', tipo: 'abrigos', para: 'nena', precio: 36900, descuento: 0, color: 'Rosa', ops: tl(['2', '4', '6', '8'], [1, 3, 2, 2]), alta: 23,
    img: 'images/p-campera-matelaseada.webp', alt: 'Campera matelaseada rosa estampada con capucha y puños rojos, colgada en una percha',
    desc: 'Matelaseado liviano con capucha, cierre al frente y puños elastizados. Abriga en la media estación.', tags: ['campera', 'matelaseada', 'rosa', 'capucha', 'abrigo', 'nena'] },
  { id: 'remeras-vivos', nombre: 'Remera manga larga con vivos', cat: 'ninos', tipo: 'remeras', para: 'unisex', precio: 13900, descuento: 0, colores: ['Celeste', 'Azul marino', 'Gris'], ops: tl(['6', '8', '10', '12', '14', '16'], [3, 4, 4, 3, 2, 2]), alta: 17,
    img: 'images/p-remeras-vivos.webp', alt: 'Remeras celeste, azul marino y gris apiladas, con cuello de vivos de colores',
    desc: 'Algodón con cuello de vivos en contraste. Elegí celeste, azul marino o gris.', tags: ['remera', 'manga larga', 'vivos', 'celeste', 'azul', 'gris', 'colegio'] },
  { id: 'jean-recto', nombre: 'Jean recto de denim', cat: 'ninos', tipo: 'pantalones', para: 'unisex', precio: 29900, descuento: 0, color: 'Azul', ops: tl(['8', '10', '12', '14', '16', '18'], [2, 3, 4, 4, 3, 2]), alta: 18,
    img: 'images/p-jean-recto.webp', alt: 'Jeans azules de denim doblados y apilados, con costuras y bolsillo trasero a la vista',
    desc: 'Denim azul de cinco bolsillos con pierna recta y cintura con elástico interno regulable.', tags: ['jean', 'denim', 'azul', 'pantalon', 'recto', 'adolescente'] },
  { id: 'gorro-tejido', nombre: 'Gorro tejido de lana', cat: 'accesorios', tipo: 'accesorios', para: 'unisex', precio: 9900, descuento: 0, color: 'Celeste', ops: unico(8), alta: 15,
    img: 'images/p-gorro-tejido.webp', alt: 'Gorro tejido de lana celeste sobre una mesa de madera con ovillos',
    desc: 'Lana suave tejida en punto jersey con borde acanalado. Se adapta de 1 a 6 años.', tags: ['gorro', 'lana', 'tejido', 'celeste', 'invierno'] },
  { id: 'borrador-short', nombre: 'Short de baño (borrador)', cat: 'ninos', tipo: 'pantalones', para: 'unisex', precio: 1, descuento: 0, color: 'Azul', ops: tl(['4'], [0]), alta: 0, visible: false,
    img: 'images/p-jean-recto.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const coloresDe = p => (p.colores && p.colores.length ? p.colores : p.color ? [p.color] : []);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), talles = lista(f.talles), colores = lista(f.colores), tipos = lista(f.tipos);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipos.length && !tipos.includes(p.tipo)) return false;
    if (f.para && !(p.para === f.para || p.para === 'unisex')) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (talles.length && !p.ops.some(o => talles.includes(o.v) && (!f.stock || o.stock > 0))) return false;
    if (colores.length && !coloresDe(p).some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, TIPOS[p.tipo], PARA[p.para], p.desc, ...coloresDe(p), ...p.ops.map(o => o.v), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
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
const talleDe = v => String(v).split(' · ').pop();
const stockDe = (p, v) => p.ops.find(o => o.v === talleDe(v))?.stock || 0;
const pideEleccion = p => p.ops.length > 1 || coloresDe(p).length > 1;
const etiquetaTalle = v => (v === 'Único' ? 'Talle único' : T_CALZADO.includes(v) ? `N° ${v}` : `Talle ${v}`);
const talleTexto = v => (T_CALZADO.includes(v) ? `N° ${v}` : v === 'Único' ? 'talle único' : `talle ${v}`);
const varTexto = (p, v) => {
  const t = talleDe(v);
  const partes = String(v).split(' · ');
  const color = partes.length > 1 ? partes[0] : coloresDe(p).length > 1 ? coloresDe(p)[0] : '';
  return [color, t === 'Único' ? '' : talleTexto(t)].filter(Boolean).join(' · ');
};
const leerTalle = () => { try { return localStorage.getItem(KEY_TALLE) || ''; } catch { return ''; } };
const guardarTalle = t => { try { localStorage.setItem(KEY_TALLE, t); } catch (e) { void e; } };

const Cart = {
  KEY: 'pequenos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v) || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return Math.min(qty, max);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  corazon: '<svg class="ico-corazon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21Z"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  return `<span class="swatches" aria-label="Color: ${esc(coloresDe(p).join(' o '))}">${coloresDe(p).map(c => `<i style="--sw:${COLORES[c] || '#ccc'}" title="${esc(c)}"></i>`).join('')}</span>`;
}
function tallesResumen(p) {
  if (p.ops.length === 1) return p.ops[0].v === 'Único' ? 'Talle único' : esc(p.ops[0].v);
  const pre = T_CALZADO.includes(p.ops[0].v) ? 'N° ' : '';
  return pre + p.ops.map(o => (o.stock > 0 ? esc(o.v) : `<del>${esc(o.v)}</del>`)).join('<span aria-hidden="true"> · </span>');
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const cat = catDe(p.cat);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 6) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}" data-tono="${esc(cat?.tono || '')}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(cat?.nombre || '')}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    <p class="pcard__talles">${tallesResumen(p)}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
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

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const etapas = box.querySelector('[data-drop-etapas]');
    const tipos = box.querySelector('[data-drop-tipos]');
    if (!btn || !panel || !etapas) return;
    etapas.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" data-tono="${c.tono}" href="${URL_CATALOGO}?cat=${c.id}"${sel.cat === c.id && !sel.tipo ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span class="nav-drop__txt"><span>${esc(c.nombre)}</span><small>${esc(c.rango)}</small></span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    if (tipos) tipos.innerHTML = Object.entries(TIPOS).map(([k, v]) => `<li><a href="${URL_CATALOGO}?tipo=${k}"${sel.tipo === k && !sel.cat ? ' aria-current="page"' : ''}>${esc(v)} <small>${Tienda.contar({ tipos: [k] })}</small></a></li>`).join('');
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
  if (sel.cat) document.querySelectorAll(`.nav-link[href*="cat=${sel.cat}"]`).forEach(a => a.setAttribute('aria-current', 'page'));
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

const IDS_TRES = ['body-celeste', 'jardinero-jean', 'mochila-jardin'];
function initTres() {
  const cont = document.querySelector('[data-tres]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { ids: IDS_TRES }, orden: 'destacados', limite: 3 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => `<li class="tres__item" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <article class="tres__card" data-id="${esc(p.id)}">
      <a class="tres__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200"></a>
      <div class="tres__txt">
        <h3 class="tres__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
        <p class="tres__corto">${esc(p.corto || '')}</p>
        <p class="tres__precio">${formatearPrecio(precioFinal(p))}</p>
        <a class="btn btn--cta btn--sm" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">Ver producto</a>
      </div>
    </article>
  </li>`).join('');
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { excluir: IDS_TRES }, orden: 'nuevos', limite: 8 });
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: {}, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  const todo = `<a class="mosaico__todo" href="${URL_CATALOGO}?orden=nuevos" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver todo el catálogo</span><span class="mosaico__todo-n">${Tienda.contar({})} productos de RN a talle 18</span>${ICO.flecha}</a>`;
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function initVitrina() {
  const box = document.querySelector('[data-vitrina]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-vitrina-tab]')];
  const grid = box.querySelector('[data-vitrina-grid]');
  const etapa = box.querySelector('[data-vitrina-etapa]');
  const panel = box.querySelector('[role="tabpanel"]');
  if (!tabs.length || !grid || !etapa) return;
  const pintar = (id, primera) => {
    const c = catDe(id);
    if (!c) return;
    tabs.forEach(t => {
      const activa = t.dataset.vitrinaTab === id;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      if (activa) panel?.setAttribute('aria-labelledby', t.id);
    });
    box.dataset.tono = c.tono;
    const n = Tienda.contar({ cat: id });
    etapa.href = `${URL_CATALOGO}?cat=${id}`;
    etapa.innerHTML = `<span class="vitrina__foto"><img src="${esc(c.img)}" alt="" width="720" height="960"></span>
      <span class="vitrina__etapa-txt"><span class="vitrina__etapa-nom">${esc(c.nombre)}</span><span class="vitrina__etapa-rango">${esc(c.rango)}</span><span class="vitrina__etapa-bajada">${esc(c.bajada)}</span><span class="vitrina__etapa-cta">Ver ${n} ${n === 1 ? 'producto' : 'productos'} ${ICO.flecha}</span></span>`;
    const { items } = Tienda.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    if (!primera) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined' && !primera) ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.vitrinaTab, false));
    t.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[j].focus();
      pintar(tabs[j].dataset.vitrinaTab, false);
    });
  });
  pintar(tabs[0].dataset.vitrinaTab, true);
}

function talleParaAltura(cm) {
  return TALLES.find(t => cm < t.cm[1]) || TALLES[TALLES.length - 1];
}
function initTalle() {
  const box = document.querySelector('[data-talle]');
  if (!box) return;
  const regla = box.querySelector('[data-regla]');
  const rango = box.querySelector('#talleAltura');
  const salida = box.querySelector('[data-talle-cm]');
  const edadSel = box.querySelector('#talleEdad');
  const nEl = box.querySelector('[data-talle-n]');
  const detEl = box.querySelector('[data-talle-det]');
  const ver = box.querySelector('[data-talle-ver]');
  const wsp = box.querySelector('[data-talle-wsp]');
  const marca = box.querySelector('[data-regla-marca]');
  const modos = [...box.querySelectorAll('[data-talle-modo]')];
  if (!regla || !rango || !nEl) return;
  const pos = cm => ((Math.min(Math.max(cm, ALTO_MIN), ALTO_MAX) - ALTO_MIN) / (ALTO_MAX - ALTO_MIN)) * 100;
  regla.querySelector('[data-regla-tramos]').innerHTML = TALLES.map(t => `<button type="button" class="regla__tramo" data-tono="${t.tono}" data-regla-talle="${esc(t.t)}" style="left:${pos(t.cm[0]).toFixed(3)}%;width:${(pos(t.cm[1]) - pos(t.cm[0])).toFixed(3)}%" aria-label="${esc(etiquetaTalle(t.t))}: ${esc(t.edad)}, ${t.cm[0]} a ${t.cm[1]} cm"><span>${esc(t.t)}</span></button>`).join('');
  const cmBox = regla.querySelector('[data-regla-cm]');
  if (cmBox) cmBox.innerHTML = Array.from({ length: 13 }, (_, i) => 50 + i * 10).map(v => `<span style="left:${pos(v).toFixed(3)}%">${v}</span>`).join('');
  if (edadSel) edadSel.innerHTML = TALLES.map(t => `<option value="${esc(t.t)}">${esc(t.edad)}</option>`).join('');
  let modo = 'altura';
  let cm = parseInt(rango.value, 10) || 98;
  const pintar = (t, centrar) => {
    nEl.textContent = t.t === 'RN' ? 'RN' : t.t;
    box.querySelector('[data-talle-pre]').textContent = /M$/.test(t.t) || t.t === 'RN' ? 'Talle de bebé' : 'Talle';
    detEl.textContent = `${t.edad} · ${t.cm[0]} a ${t.cm[1]} cm`;
    const n = Tienda.contar({ talles: [t.t], stock: true });
    ver.href = `${URL_CATALOGO}?talle=${encodeURIComponent(t.t)}`;
    ver.querySelector('span').textContent = n ? `Ver ${n} ${n === 1 ? 'prenda' : 'prendas'} en ${talleTexto(t.t)}` : 'Ver el catálogo completo';
    const dato = modo === 'altura' ? `mide ${cm} cm` : `tiene ${t.edad.toLowerCase()}`;
    wsp.href = wspLink(`Hola Pequeños! Mi hijo/a ${dato} y en la guía de la web me sale ${talleTexto(t.t)}. ¿Me ayudás a elegir?`);
    regla.querySelectorAll('[data-regla-talle]').forEach(b => b.classList.toggle('es-actual', b.dataset.reglaTalle === t.t));
    const p = modo === 'altura' ? pos(cm) : pos((t.cm[0] + t.cm[1]) / 2);
    if (marca) {
      marca.style.left = `${p}%`;
      marca.querySelector('span').textContent = modo === 'altura' ? `${cm} cm` : t.edad;
    }
    box.dataset.tono = t.tono;
    guardarTalle(t.t);
    if (centrar) {
      const vp = regla.closest('.regla__vp');
      if (vp && vp.scrollWidth > vp.clientWidth) vp.scrollTo({ left: Math.max(0, (p / 100) * vp.scrollWidth - vp.clientWidth / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };
  const porAltura = centrar => {
    cm = parseInt(rango.value, 10) || cm;
    if (salida) salida.textContent = `${cm} cm`;
    rango.setAttribute('aria-valuetext', `${cm} centímetros`);
    pintar(talleParaAltura(cm), centrar);
  };
  const ponerModo = m => {
    modo = m;
    modos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talleModo === m)));
    box.querySelectorAll('[data-modo-panel]').forEach(pn => { pn.hidden = pn.dataset.modoPanel !== m; });
    if (m === 'edad' && edadSel) pintar(TALLES.find(t => t.t === edadSel.value) || TALLES[7], true);
    else porAltura(true);
  };
  rango.addEventListener('input', () => porAltura(false));
  rango.addEventListener('change', () => porAltura(true));
  edadSel?.addEventListener('change', () => pintar(TALLES.find(t => t.t === edadSel.value) || TALLES[7], true));
  modos.forEach(b => b.addEventListener('click', () => ponerModo(b.dataset.talleModo)));
  regla.addEventListener('click', e => {
    const b = e.target.closest('[data-regla-talle]');
    if (!b) return;
    const t = TALLES.find(x => x.t === b.dataset.reglaTalle);
    if (!t) return;
    if (modo === 'edad' && edadSel) { edadSel.value = t.t; pintar(t, true); return; }
    rango.value = String(Math.round((t.cm[0] + t.cm[1]) / 2));
    porAltura(true);
  });
  const guardado = TALLES.find(t => t.t === leerTalle());
  if (guardado) rango.value = String(Math.round((guardado.cm[0] + guardado.cm[1]) / 2));
  if (edadSel) edadSel.value = (guardado || TALLES[7]).t;
  porAltura(false);
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function pickerHTML(p, colorSel) {
  const colores = coloresDe(p);
  const filaColor = colores.length > 1
    ? `<p class="picker__tit">Elegí el color</p><div class="picker__colores">${colores.map(c => `<button type="button" class="picker__color" data-picker-color="${esc(c)}" aria-pressed="${c === colorSel}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div>`
    : '';
  const calzado = T_CALZADO.includes(p.ops[0].v);
  const guardado = leerTalle();
  return `<div class="picker__head"><p class="picker__tit">${calzado ? 'Elegí el número' : 'Elegí el talle'}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    ${filaColor}
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op${o.v === guardado ? ' es-suyo' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(etiquetaTalle(o.v))}${o.stock > 0 ? '' : ', sin stock'}">${esc(o.v)}</button>`).join('')}</div>`;
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí el talle: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.dataset.color = coloresDe(p)[0] || '';
  pk.innerHTML = pickerHTML(p, pk.dataset.color) + (qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : '');
  (card.querySelector('.pcard__media') || card).appendChild(pk);
  (pk.querySelector('.picker__op.es-suyo:not([disabled])') || pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast('Ese talle no tiene stock por ahora.'); return; }
  if (comprar) { abrirCarrito(); return; }
  const detalle = varTexto(p, v);
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${detalle ? ` (${detalle})` : ''} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (pideEleccion(p)) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const colorBtn = e.target.closest('[data-picker-color]');
    if (colorBtn) {
      const pk = colorBtn.closest('.picker');
      pk.dataset.color = colorBtn.dataset.pickerColor;
      pk.querySelectorAll('[data-picker-color]').forEach(b => b.setAttribute('aria-pressed', String(b === colorBtn)));
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const v = coloresDe(p).length > 1 ? `${pk.dataset.color} · ${opBtn.dataset.pickerOp}` : opBtn.dataset.pickerOp;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, v, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, talle: '', color: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  const guardado = leerTalle();
  const suyo = p.ops.find(o => o.v === guardado && o.stock > 0);
  qvEstado.talle = p.ops.length === 1 && p.ops[0].stock > 0 ? p.ops[0].v : suyo ? suyo.v : '';
  qvEstado.color = coloresDe(p)[0] || '';
  qvEstado.qty = 1;
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: coloresDe(p).join(', '),
    brand: { '@type': 'Brand', name: 'Pequeños' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function guiaHTML(p) {
  const calzado = T_CALZADO.includes(p.ops[0].v);
  if (p.ops[0].v === 'Único') return '';
  const propios = new Set(p.ops.map(o => o.v));
  const tabla = calzado
    ? `<table><thead><tr><th scope="col">Número</th><th scope="col">Largo del pie</th></tr></thead><tbody>${CALZADO.filter(c => propios.has(c[0])).map(c => `<tr${c[0] === qvEstado.talle ? ' class="es-actual"' : ''}><th scope="row">${c[0]}</th><td>${c[1]} cm</td></tr>`).join('')}</tbody></table>`
    : `<table><thead><tr><th scope="col">Talle</th><th scope="col">Edad</th><th scope="col">Altura</th></tr></thead><tbody>${TALLES.filter(t => propios.has(t.t)).map(t => `<tr${t.t === qvEstado.talle ? ' class="es-actual"' : ''}><th scope="row">${esc(t.t)}</th><td>${esc(t.edad)}</td><td>${t.cm[0]}-${t.cm[1]} cm</td></tr>`).join('')}</tbody></table>`;
  return `<details class="qv__det"><summary>${ICO.regla}Guía de talles</summary>
    <div class="guia">${tabla}<p class="guia__nota">Medidas de referencia. Si está justo en el límite, conviene el talle siguiente.</p></div></details>`;
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const colores = coloresDe(p);
  const op = p.ops.find(o => o.v === qvEstado.talle);
  const calzado = T_CALZADO.includes(p.ops[0].v);
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí ${calzado ? 'el número' : 'un talle'} para ver la disponibilidad` : op.stock <= 2 ? `Quedan ${op.stock} en ${talleTexto(op.v)}` : op.v === 'Único' ? 'En stock' : `${etiquetaTalle(op.v)} en stock`;
  const selColor = colores.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">Color: <b>${esc(qvEstado.color)}</b></p><div class="qv__colores" role="radiogroup" aria-label="Color">${colores.map(c => `<button type="button" class="qv__color" role="radio" aria-checked="${c === qvEstado.color}" data-qv-color="${esc(c)}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div></div>`
    : `<p class="qv__color-fijo">${swatchesHTML(p)}Color: ${esc(colores[0] || '')}</p>`;
  const selTalle = p.ops.length > 1
    ? `<div class="qv__var" data-qv-talles><p class="qv__var-tit">${calzado ? 'Número' : 'Talle'}${qvEstado.talle ? `: <b>${esc(qvEstado.talle)}</b>` : ''}</p><div class="qv__ops" role="radiogroup" aria-label="${calzado ? 'Número' : 'Talle'}">${p.ops.map(o => `<button type="button" class="qv__op" role="radio" aria-checked="${o.v === qvEstado.talle}" data-qv-talle="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${esc(o.v)}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>Elegí ${calzado ? 'el número' : 'un talle'} para sumarlo al carrito.</p></div>`
    : '<p class="qv__var-tit">Talle único</p>';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(TIPOS[p.tipo] || '')}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio')}
      ${selColor}
      ${selTalle}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${guiaHTML(p)}
      <a class="qv__wsp" href="${wspLink(`Hola Pequeños! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : '¿Dudas con el talle? Preguntá por WhatsApp'}</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También para ${esc((catDe(p.cat)?.nombre || '').toLowerCase())}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="300"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
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
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const talleBtn = e.target.closest('[data-qv-talle]');
    if (talleBtn) {
      qvEstado.talle = talleBtn.dataset.qvTalle;
      const max = p.ops.find(o => o.v === qvEstado.talle)?.stock || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      pintarQV();
      qv.querySelector(`[data-qv-talle="${CSS.escape(qvEstado.talle)}"]`)?.focus();
      return;
    }
    const colorBtn = e.target.closest('[data-qv-color]');
    if (colorBtn) {
      qvEstado.color = colorBtn.dataset.qvColor;
      pintarQV();
      qv.querySelector(`[data-qv-color="${CSS.escape(qvEstado.color)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = p.ops.find(o => o.v === qvEstado.talle)?.stock || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.talle) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    const v = coloresDe(p).length > 1 ? `${qvEstado.color} · ${qvEstado.talle}` : qvEstado.talle;
    if (comprar) { const n = Cart.add(p, qvEstado.qty, v); if (!n) { showToast('Ese talle no tiene stock por ahora.'); return; } cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, v, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
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
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.corazon}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí el talle en cualquier prenda y sumala acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="72" height="90">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(varTexto(p, i.v) || 'Talle único')} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const d = varTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${d ? ` (${d})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Pequeños! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
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
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
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
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const todosTalles = new Set(GRUPOS_TALLE.flatMap(g => g[1]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    para: valido(PARAMS.get('para'), PARA),
    tipos: new Set(lista('tipo').filter(t => TIPOS[t])),
    talles: new Set(lista('talle').filter(t => todosTalles.has(t))),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo', tono: '' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip chip--etapa" data-tono="${c.tono}" data-filtro="cat" data-valor="${c.id}" aria-pressed="false"><span>${esc(c.nombre)}</span>${c.rango ? `<small>${esc(c.rango)}</small>` : ''}</button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas las etapas')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-tipo-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TIPOS).map(([k, v]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="tipo"><span>${esc(v)}</span><span class="opt__n" data-cuenta-tipo="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-para-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todo'], ...Object.entries(PARA).filter(([k]) => k !== 'unisex')].map(([k, v]) => `<label class="seg"><input type="radio" name="f-para" value="${k}" data-filtro="para"><span>${esc(v)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-talle-opciones]').forEach(cont => {
    cont.innerHTML = GRUPOS_TALLE.map(([nombre, talles]) => `<div class="tgrupo"><p class="tgrupo__tit">${esc(nombre)}</p><div class="tgrupo__ops">${talles.map(t => `<label class="talle-op"><input type="checkbox" value="${esc(t)}" data-f="talle"><span>${esc(t)}</span></label>`).join('')}</div></div>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.para && sin !== 'para') f.para = estado.para;
    if (estado.tipos.size && sin !== 'tipo') f.tipos = [...estado.tipos];
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.talles.size && sin !== 'talle') f.talles = [...estado.talles];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.tipos.forEach(t => chips.push(['tipo', t, TIPOS[t]]));
    estado.talles.forEach(t => chips.push(['talle', t, etiquetaTalle(t)]));
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.para) chips.push(['para', '', `Para ${PARA[estado.para].toLowerCase()}`]);
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="talle"]').forEach(el => { el.checked = estado.talles.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    document.querySelectorAll('input[data-f="tipo"]').forEach(el => { el.checked = estado.tipos.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-tipo]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('tipo'), tipos: [el.dataset.cuentaTipo] }); });
    const enPanel = estado.talles.size + estado.colores.size + estado.tipos.size + (estado.para ? 1 : 0) + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    let titulo = cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Todo el catálogo';
    if (!cat && estado.tipos.size === 1) titulo = TIPOS[[...estado.tipos][0]];
    if (!cat && estado.talles.size === 1 && !estado.tipos.size) titulo = `Prendas en ${talleTexto([...estado.talles][0])}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? `${cat.rango}. ${cat.bajada}` : 'Ropa y accesorios para bebés y niños, desde recién nacidos hasta talle 18 aprox. Elegí el talle en cada prenda y sumala al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todo el catálogo'; miga.textContent = titulo; }
    document.title = `${titulo} — Pequeños`;
    document.body.dataset.tono = cat ? cat.tono : '';
    document.querySelectorAll('.nav-drop__cat, .nav-drop__tipos a, .nav-link[href*="cat="]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = (u.searchParams.get('cat') || '') === estado.cat && (u.searchParams.get('tipo') || '') === (estado.tipos.size === 1 ? [...estado.tipos][0] : '') && (estado.cat || estado.tipos.size);
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'para', 'tipo', 'talle', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.para) u.searchParams.set('para', estado.para);
    if (estado.tipos.size) u.searchParams.set('tipo', [...estado.tipos].join(','));
    if (estado.talles.size) u.searchParams.set('talle', [...estado.talles].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.para = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.talles.clear(); estado.colores.clear(); estado.tipos.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'talle' ? estado.talles : multi.dataset.f === 'tipo' ? estado.tipos : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'talle') estado.talles.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'tipo') estado.tipos.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
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
  if (filtros && getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  filtros?.addEventListener('scroll', () => filtros.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), { passive: true });
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, tipo: estado.tipos.size === 1 ? [...estado.tipos][0] : '' };
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const punto = [-33.4354763, -60.7859487];
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(punto, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap', maxZoom: 19,
    }).addTo(mapa);
    const icono = L.divIcon({ className: 'mapa-pin', html: ICO.corazon, iconSize: [40, 40], iconAnchor: [20, 36] });
    L.marker(punto, { icon: icono, title: 'Pequeños · Juan de Garay 553' }).addTo(mapa).bindPopup('<b>Pequeños</b><br>Juan de Garay 553, Santa Teresa');
  } catch (e) { console.error(e); }
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initTres,
  initRail,
  initMosaico,
  initVitrina,
  initCuentas,
  initTalle,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
  initMapa,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
