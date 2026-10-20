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

const WSP = '5491166511070';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'juguetes', nombre: 'Juguetes', ico: 'bloques', img: 'images/p-tren-madera.webp', bajada: 'Juguetes de madera, peluches y vehículos para regalar desde el primer año.' },
  { id: 'cotillon', nombre: 'Cotillón', ico: 'cotillon', img: 'images/p-vasos-fiesta.webp', bajada: 'Vasos, platos, globos, velas y sorbetes para armar la mesa del cumple.' },
  { id: 'bazar', nombre: 'Bazar', ico: 'taza', img: 'images/p-frascos-bambu.webp', bajada: 'Tazas, frascos, vasos y tablas para la cocina de todos los días.' },
  { id: 'libreria', nombre: 'Librería', ico: 'lapiz', img: 'images/p-lapices-colores.webp', bajada: 'Cuadernos, lápices, acuarelas y marcadores para el cole y para dibujar en casa.' },
  { id: 'regaleria', nombre: 'Regalería', ico: 'regalo', img: 'images/p-caja-regalo.webp', bajada: 'Cajas de regalo, velas aromáticas y portarretratos para quedar bien.' },
];
const OCASIONES = {
  cumple: { nombre: 'Un cumpleaños', corto: 'cumpleaños', img: 'images/o-cumple.webp', alt: 'Torta blanca con una vela dorada en forma de siete y flores naranjas al costado', texto: 'Vasos, platos, globos, velas y sorbetes para la mesa.' },
  regalo: { nombre: 'Un regalo', corto: 'regalo', img: 'images/o-regalo.webp', alt: 'Dos cajas de regalo de cartón madera atadas con cintas rosa y verde agua', texto: 'Peluches, juguetes de madera y detalles con moño.' },
  cole: { nombre: 'La vuelta al cole', corto: 'cole', img: 'images/o-cole.webp', alt: 'Cuaderno espiralado de tapa madera con lápices, clips y gomas sobre fondo rosado', texto: 'Cuadernos, lápices, acuarelas y marcadores.' },
  casa: { nombre: 'Algo para la casa', corto: 'casa', img: 'images/o-casa.webp', alt: 'Tablas de madera para picar apoyadas contra una pared blanca', texto: 'Tazas, frascos, tablas y vasos para todos los días.' },
};
const PARA = {
  bebes: { nombre: 'Un bebé', detalle: 'de 0 a 2 años', filtro: 'Bebés (0 a 2)' },
  chicos: { nombre: 'Un chico', detalle: 'de 3 a 7 años', filtro: 'Chicos (3 a 7)' },
  grandes: { nombre: 'Uno más grande', detalle: 'de 8 a 12 años', filtro: 'Más grandes (8 a 12)' },
  adultos: { nombre: 'Un adulto', detalle: 'para la casa o el escritorio', filtro: 'Adultos' },
};
const RANGOS = {
  hasta10: { nombre: 'Hasta $10.000', max: 10000 },
  '10a20': { nombre: '$10.000 a $20.000', min: 10001, max: 20000 },
  mas20: { nombre: 'Más de $20.000', min: 20001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const unico = stock => [{ v: 'Único', stock }];

const PRODUCTOS = [
  { id: 'tazas-ceramica', nombre: 'Taza de cerámica esmaltada', cat: 'bazar', ocasiones: ['casa', 'regalo'], para: ['adultos'], unidad: '350 ml', opLabel: 'Color', precio: 7900, descuento: 0, rango: 1, alta: 14,
    ops: [{ v: 'Arena', hex: '#C9A27E', stock: 6 }, { v: 'Salvia', hex: '#8E9C86', stock: 4 }, { v: 'Rosa', hex: '#D9AFA6', stock: 5 }, { v: 'Crema', hex: '#EDE4D6', stock: 0 }],
    img: 'images/p-tazas-ceramica.webp', alt: 'Cuatro tazas de cerámica esmaltada en arena, verde salvia, rosa y crema sobre una mesada de mármol',
    desc: 'Taza de cerámica con esmalte mate por fuera y brillante por dentro. Va al microondas y al lavavajillas. Se vende por unidad: elegí el color.', tags: ['taza', 'tazas', 'mug', 'ceramica', 'cafe', 'te', 'desayuno', 'cocina'] },
  { id: 'camion-volcador', nombre: 'Camión volcador amarillo', cat: 'juguetes', ocasiones: ['regalo', 'cumple'], para: ['chicos'], unidad: '32 cm de largo', opLabel: 'Medida', precio: 18500, descuento: 10, rango: 2, alta: 16, ops: unico(5),
    img: 'images/p-camion-volcador.webp', alt: 'Camión volcador de juguete amarillo con ruedas negras sobre un piso de cemento claro',
    desc: 'Camión de plástico resistente con caja que se levanta para volcar la carga y ruedas que giran libres. Ideal para el arenero y para jugar en el piso.', tags: ['camion', 'camioncito', 'volcador', 'vehiculo', 'auto', 'amarillo', 'arena'] },
  { id: 'oso-peluche', nombre: 'Oso de peluche clásico', cat: 'juguetes', ocasiones: ['regalo'], para: ['bebes', 'chicos', 'grandes', 'adultos'], unidad: '35 cm', opLabel: 'Medida', precio: 22900, descuento: 0, rango: 3, alta: 12, ops: unico(4),
    img: 'images/p-oso-peluche.webp', alt: 'Oso de peluche marrón claro sentado sobre una mesa de madera',
    desc: 'Oso de peluche de pelo suave color caramelo, con hocico bordado y patas con almohadilla. Mide 35 cm sentado.', tags: ['oso', 'osito', 'peluche', 'peluches', 'teddy', 'marron', 'regalo'] },
  { id: 'globos-pastel', nombre: 'Globos perlados pastel x25', cat: 'cotillon', ocasiones: ['cumple'], para: [], unidad: 'Bolsa x25', opLabel: 'Color', precio: 5400, descuento: 15, rango: 4, alta: 11,
    ops: [{ v: 'Pastel surtido', hex: '#CDE3F0', stock: 18 }, { v: 'Rosa', hex: '#F2C6D6', stock: 9 }, { v: 'Blanco', hex: '#F6F4F0', stock: 6 }],
    img: 'images/p-globos-pastel.webp', alt: 'Ramo de globos perlados en tonos pastel celeste, rosa, lila y amarillo sobre fondo blanco',
    desc: 'Bolsa de 25 globos de látex de 12 pulgadas con terminación perlada. Se inflan con aire o con helio.', tags: ['globos', 'globo', 'pastel', 'perlados', 'cumple', 'fiesta', 'decoracion', 'helio'] },
  { id: 'osito-crochet', nombre: 'Osito tejido a crochet', cat: 'juguetes', ocasiones: ['regalo'], para: ['bebes'], unidad: '25 cm', opLabel: 'Medida', precio: 15900, descuento: 0, rango: 5, alta: 15, ops: unico(3),
    img: 'images/p-osito-crochet.webp', alt: 'Osito lila tejido a crochet con vestido floreado, acostado entre ramitas de flores blancas',
    desc: 'Osito tejido a crochet con hilo de algodón y vestido de tela floreada. Un regalo suave para un nacimiento o un baby shower.', tags: ['osito', 'oso', 'crochet', 'tejido', 'amigurumi', 'bebe', 'nacimiento', 'baby shower', 'lila'] },
  { id: 'cohete-madera', nombre: 'Cohete de madera para apilar', cat: 'juguetes', ocasiones: ['regalo'], para: ['chicos'], unidad: '6 piezas', opLabel: 'Medida', precio: 19800, descuento: 0, rango: 6, alta: 13, ops: unico(4),
    img: 'images/p-cohete-madera.webp', alt: 'Cohete de juguete de madera rojo y blanco con ventana redonda, sobre fondo blanco',
    desc: 'Cohete de madera pintada que se desarma en seis piezas para apilar y volver a armar, con un astronauta adentro.', tags: ['cohete', 'madera', 'apilar', 'encastre', 'espacio', 'rojo', 'didactico'] },
  { id: 'vela-aromatica', nombre: 'Vela aromática de soja en frasco', cat: 'regaleria', ocasiones: ['regalo', 'casa'], para: ['adultos'], unidad: '180 g', opLabel: 'Aroma', precio: 11900, descuento: 10, rango: 7, alta: 10,
    ops: [{ v: 'Vainilla', stock: 5 }, { v: 'Lavanda', stock: 4 }, { v: 'Coco', stock: 2 }],
    img: 'images/p-vela-aromatica.webp', alt: 'Vela blanca en frasco de vidrio sobre una mesa clara, con ramitas de lavanda al costado',
    desc: 'Vela de cera de soja en frasco de vidrio con tapa, unas 30 horas de duración. Elegí el aroma.', tags: ['vela', 'velas', 'aromatica', 'soja', 'aroma', 'vainilla', 'lavanda', 'coco', 'deco'] },
  { id: 'acuarelas', nombre: 'Acuarelas en pastillas x24', cat: 'libreria', ocasiones: ['cole', 'regalo'], para: ['chicos', 'grandes'], unidad: 'Caja x24', opLabel: 'Medida', precio: 7200, descuento: 0, rango: 8, alta: 9, ops: unico(8),
    img: 'images/p-acuarelas.webp', alt: 'Paleta de acuarelas en pastillas redondas de muchos colores, vista desde arriba',
    desc: 'Estuche con 24 pastillas de acuarela y un pincel. Colores que se mezclan bien con poca agua.', tags: ['acuarela', 'acuarelas', 'pintura', 'pinturas', 'pincel', 'dibujo', 'arte', 'colegio'] },
  { id: 'tren-madera', nombre: 'Tren de madera con 3 vagones', cat: 'juguetes', ocasiones: ['regalo', 'cumple'], para: ['bebes', 'chicos'], unidad: '4 piezas', opLabel: 'Medida', precio: 24900, descuento: 0, rango: 9, alta: 8, ops: unico(3),
    img: 'images/p-tren-madera.webp', alt: 'Tren de juguete de madera natural con locomotora y dos vagones en verde, rosa y celeste',
    desc: 'Locomotora y vagones de madera con imán para engancharlos, y bloques de colores para cargar. Pintura al agua.', tags: ['tren', 'trencito', 'madera', 'vagones', 'locomotora', 'bloques', 'didactico'] },
  { id: 'conejo-peluche', nombre: 'Conejo de peluche con moño', cat: 'juguetes', ocasiones: ['regalo'], para: ['bebes', 'chicos', 'grandes'], unidad: '40 cm', opLabel: 'Medida', precio: 26500, descuento: 0, rango: 10, alta: 7, ops: unico(2),
    img: 'images/p-conejo-peluche.webp', alt: 'Conejo de peluche beige de orejas largas sentado junto a una caja de regalo con moño rosa',
    desc: 'Conejo de peluche de pelo largo y suave con orejas caídas y moño de raso. Mide 40 cm sentado. La caja de la foto se vende aparte.', tags: ['conejo', 'conejito', 'peluche', 'peluches', 'beige', 'moño', 'pascua', 'regalo'] },
  { id: 'caja-regalo', nombre: 'Caja de regalo blanca con moño', cat: 'regaleria', ocasiones: ['regalo', 'cumple'], para: [], unidad: '20 × 15 × 10 cm', opLabel: 'Medida', precio: 4800, descuento: 0, rango: 11, alta: 6, ops: unico(12),
    img: 'images/p-caja-regalo.webp', alt: 'Caja de regalo blanca atada con una cinta de raso fucsia y un moño grande',
    desc: 'Caja de cartón rígido blanca con tapa y cinta de raso fucsia para atar el moño. Lista para guardar un regalo chico.', tags: ['caja', 'cajas', 'regalo', 'packaging', 'moño', 'cinta', 'blanca', 'fucsia'] },
  { id: 'frascos-bambu', nombre: 'Frascos de vidrio con tapa de bambú x3', cat: 'bazar', ocasiones: ['casa', 'regalo'], para: ['adultos'], unidad: 'Set x3', opLabel: 'Medida', precio: 16900, descuento: 0, rango: 12, alta: 5, ops: unico(6),
    img: 'images/p-frascos-bambu.webp', alt: 'Frascos de vidrio con tapa de bambú llenos de fideos, avena, frutos secos y legumbres',
    desc: 'Set de tres frascos de vidrio de distintos tamaños con tapa de bambú y burlete. Para fideos, legumbres, galletitas o frutos secos.', tags: ['frasco', 'frascos', 'vidrio', 'bambu', 'hermetico', 'cocina', 'alacena', 'orden'] },
  { id: 'encastre-madera', nombre: 'Encastre de madera de colores', cat: 'juguetes', ocasiones: ['regalo'], para: ['bebes', 'chicos'], unidad: '16 piezas', opLabel: 'Medida', precio: 16400, descuento: 0, alta: 27, ops: unico(5),
    img: 'images/p-encastre-madera.webp', alt: 'Juego de encastre de madera con piezas rojas, naranjas, amarillas, verdes y azules sobre una base',
    desc: 'Base de madera con cinco torres para encastrar piezas por forma y color. Ayuda a ordenar, contar y combinar colores.', tags: ['encastre', 'madera', 'didactico', 'montessori', 'colores', 'formas', 'bebe'] },
  { id: 'xilofon', nombre: 'Xilofón de colores de 8 notas', cat: 'juguetes', ocasiones: ['regalo', 'cumple'], para: ['bebes', 'chicos'], unidad: '2 palillos', opLabel: 'Medida', precio: 13900, descuento: 0, alta: 26, ops: unico(6),
    img: 'images/p-xilofon.webp', alt: 'Xilofón de juguete con láminas de colores del arcoíris y un palillo, sobre fondo celeste claro',
    desc: 'Xilofón de ocho láminas de metal de colores sobre base de madera, con dos palillos de punta redonda.', tags: ['xilofon', 'xilofono', 'musica', 'musical', 'instrumento', 'colores', 'bebe'] },
  { id: 'platos-festoneados', nombre: 'Platos festoneados con borde dorado x8', cat: 'cotillon', ocasiones: ['cumple'], para: [], unidad: 'Pack x8 · 23 cm', opLabel: 'Medida', precio: 7800, descuento: 0, alta: 25, ops: unico(10),
    img: 'images/p-platos-festoneados.webp', alt: 'Pila de platos de cartón rosa claro con borde festoneado dorado sobre un mantel rosa',
    desc: 'Platos de cartón rosa claro con borde festoneado en dorado. Aptos para torta, sándwiches y bocaditos.', tags: ['platos', 'plato', 'carton', 'descartables', 'dorado', 'rosa', 'cumple', 'mesa', 'fiesta'] },
  { id: 'sorbetes-locos', nombre: 'Sorbetes locos x6', cat: 'cotillon', ocasiones: ['cumple'], para: [], unidad: 'Pack x6', opLabel: 'Medida', precio: 3600, descuento: 0, alta: 24, ops: unico(14),
    img: 'images/p-sorbetes-locos.webp', alt: 'Sorbetes de plástico con formas de rulos y anteojos en rosa, amarillo, naranja y celeste',
    desc: 'Seis sorbetes reutilizables con rulos y formas divertidas, en colores surtidos. Se lavan con agua tibia.', tags: ['sorbetes', 'sorbete', 'pajitas', 'popotes', 'cumple', 'fiesta', 'colores'] },
  { id: 'vasos-vidrio', nombre: 'Vasos de vidrio lisos x6', cat: 'bazar', ocasiones: ['casa'], para: ['adultos'], unidad: 'Set x6 · 300 ml', opLabel: 'Medida', precio: 12600, descuento: 0, alta: 23, ops: unico(4),
    img: 'images/p-vasos-vidrio.webp', alt: 'Dos vasos de vidrio transparente lisos sobre fondo blanco, uno parado y otro acostado',
    desc: 'Set de seis vasos de vidrio liso de 300 ml, de base gruesa. Van al lavavajillas.', tags: ['vasos', 'vaso', 'vidrio', 'cristal', 'agua', 'cocina', 'mesa'] },
  { id: 'cuaderno-espiral', nombre: 'Cuaderno espiralado A5 de 80 hojas', cat: 'libreria', ocasiones: ['cole'], para: ['grandes', 'adultos'], unidad: '80 hojas rayadas', opLabel: 'Tapa', precio: 5600, descuento: 0, alta: 22,
    ops: [{ v: 'Crema', hex: '#EFE8DA', stock: 9 }, { v: 'Rosa', hex: '#E8B9C4', stock: 7 }],
    img: 'images/p-cuaderno-espiral.webp', alt: 'Cuaderno espiralado de tapa crema sobre cuadernos rosas, con lápices de colores al costado',
    desc: 'Cuaderno A5 con espiral metálico y 80 hojas rayadas de 80 g. Tapa dura lisa para personalizar.', tags: ['cuaderno', 'cuadernos', 'espiral', 'espiralado', 'a5', 'hojas', 'rayado', 'colegio', 'escuela'] },
  { id: 'marcadores', nombre: 'Marcadores de colores x10', cat: 'libreria', ocasiones: ['cole'], para: ['chicos', 'grandes'], unidad: 'Estuche x10', opLabel: 'Medida', precio: 6400, descuento: 0, alta: 21, ops: unico(11),
    img: 'images/p-marcadores.webp', alt: 'Marcadores de colores dentro de un frasco de vidrio, vistos desde arriba',
    desc: 'Diez marcadores de punta redonda con tinta al agua, lavable de la ropa con agua y jabón.', tags: ['marcadores', 'marcador', 'fibras', 'fibrones', 'colores', 'dibujo', 'colegio'] },
  { id: 'portarretrato', nombre: 'Portarretrato de madera 13 × 18', cat: 'regaleria', ocasiones: ['regalo', 'casa'], para: ['adultos'], unidad: 'Foto de 13 × 18 cm', opLabel: 'Medida', precio: 8700, descuento: 0, alta: 20, ops: unico(6),
    img: 'images/p-portarretrato.webp', alt: 'Portarretrato de madera clara con paspartú blanco apoyado sobre un mueble, junto a una planta',
    desc: 'Marco de madera clara con paspartú blanco y vidrio, para fotos de 13 × 18 cm. Se apoya o se cuelga.', tags: ['portarretrato', 'portarretratos', 'marco', 'cuadro', 'foto', 'madera', 'deco'] },
  { id: 'vasos-fiesta', nombre: 'Vasos de cartón rosa y dorado x8', cat: 'cotillon', ocasiones: ['cumple'], para: [], unidad: 'Pack x8 · 250 ml', opLabel: 'Medida', precio: 6900, descuento: 0, alta: 4, ops: unico(10),
    img: 'images/p-vasos-fiesta.webp', alt: 'Vasos de cartón rosa y blancos con borde dorado sobre una mesa de cumpleaños con flores',
    desc: 'Vasos de cartón para bebidas frías con borde dorado, en rosa y blanco. Combinan con los platos festoneados.', tags: ['vasos', 'vaso', 'carton', 'descartables', 'dorado', 'rosa', 'cumple', 'fiesta', 'mesa'] },
  { id: 'vela-numero', nombre: 'Vela número dorada', cat: 'cotillon', ocasiones: ['cumple'], para: [], unidad: '7 cm de alto', opLabel: 'Número', precio: 2900, descuento: 0, alta: 3,
    ops: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((v, i) => ({ v, stock: [3, 6, 5, 4, 4, 3, 2, 3, 2, 0][i] })),
    img: 'images/p-vela-numero.webp', alt: 'Torta blanca con una vela dorada en forma de siete encendida y flores naranjas al costado',
    desc: 'Vela dorada con forma de número para la torta. Elegí el número que necesitás. La torta y las flores de la foto no se incluyen.', tags: ['vela', 'velas', 'numero', 'dorada', 'torta', 'cumple', 'cumpleaños'] },
  { id: 'lapices-colores', nombre: 'Lápices de colores x24', cat: 'libreria', ocasiones: ['cole', 'regalo'], para: ['chicos', 'grandes'], unidad: 'Caja x24', opLabel: 'Medida', precio: 8900, descuento: 0, alta: 2, ops: unico(9),
    img: 'images/p-lapices-colores.webp', alt: 'Lápices de colores en un vaso de vidrio y en una caja de madera, sobre cuadernos',
    desc: 'Caja de 24 lápices de colores de mina blanda que pintan parejo. El vaso y los cuadernos de la foto se venden aparte.', tags: ['lapices', 'lapiz', 'colores', 'pintar', 'dibujo', 'colegio', 'escuela', 'utiles'] },
  { id: 'cuaderno-kraft', nombre: 'Cuaderno espiralado tapa kraft', cat: 'libreria', ocasiones: ['cole'], para: ['grandes', 'adultos'], unidad: '60 hojas lisas', opLabel: 'Medida', precio: 4900, descuento: 0, alta: 1, ops: unico(8),
    img: 'images/p-cuaderno-kraft.webp', alt: 'Cuaderno espiralado de tapa kraft con lápices, gomas y clips sobre fondo rosado',
    desc: 'Cuaderno de tapa de cartón kraft con espiral y 60 hojas lisas, para bocetos, notas o agenda.', tags: ['cuaderno', 'kraft', 'espiral', 'bocetos', 'liso', 'agenda', 'notas'] },
  { id: 'tablas-madera', nombre: 'Tabla de madera para picar', cat: 'bazar', ocasiones: ['casa', 'regalo'], para: ['adultos'], unidad: '40 × 20 cm', opLabel: 'Medida', precio: 14500, descuento: 0, alta: 0, ops: unico(5),
    img: 'images/p-tablas-madera.webp', alt: 'Tablas de madera para picar con mango, de distintos tonos, apoyadas contra una pared blanca',
    desc: 'Tabla de madera maciza con mango y agujero para colgar. Sirve para picar y para presentar quesos y fiambres.', tags: ['tabla', 'tablas', 'madera', 'picar', 'cocina', 'picada', 'asado'] },
  { id: 'cajas-kraft', nombre: 'Cajas kraft con cinta x2', cat: 'regaleria', ocasiones: ['regalo'], para: [], unidad: 'Set x2', opLabel: 'Medida', precio: 5900, descuento: 0, alta: 0, ops: unico(7),
    img: 'images/p-cajas-kraft.webp', alt: 'Dos cajas de regalo de cartón kraft atadas con cintas rosa y verde agua, entre plantas',
    desc: 'Dos cajas de cartón kraft con tapa, una grande y una chica, con cintas para atar.', tags: ['caja', 'cajas', 'kraft', 'regalo', 'packaging', 'cinta'] },
  { id: 'bloques-madera', nombre: 'Bloques de madera natural y rosa x20', cat: 'juguetes', ocasiones: ['regalo'], para: ['bebes', 'chicos'], unidad: '20 piezas', opLabel: 'Medida', precio: 21900, descuento: 0, alta: 0, ops: unico(4),
    img: 'images/p-bloques-madera.webp', alt: 'Bloques de madera natural y rosa con forma de casita, cubos y arco sobre una mesa',
    desc: 'Veinte bloques de madera lijada en tonos natural y rosa: cubos, arcos, triángulos y cilindros para construir.', tags: ['bloques', 'cubos', 'madera', 'construccion', 'didactico', 'rosa', 'bebe'] },
  { id: 'borrador-guirnalda', nombre: 'Guirnalda de banderines (borrador)', cat: 'cotillon', ocasiones: ['cumple'], para: [], opLabel: 'Medida', precio: 1, descuento: 0, alta: 0, ops: unico(0), visible: false,
    img: 'images/p-vasos-fiesta.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 10) * 10;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), ocasion = lista(f.ocasion), para = lista(f.para);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (ocasion.length && !(p.ocasiones || []).some(o => ocasion.includes(o))) return false;
    if (para.length && !(p.para || []).some(o => para.includes(o))) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
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
      p.nombre, catDe(p.cat)?.nombre, p.desc, p.unidad, ...(p.ocasiones || []).map(o => OCASIONES[o]?.nombre), ...p.ops.map(o => o.v), ...(p.tags || []),
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
const stockDe = (p, v) => p.ops.find(o => o.v === v)?.stock || 0;
const pideEleccion = p => p.ops.length > 1;
const opTexto = (p, v) => (v === 'Único' ? '' : p.opLabel === 'Número' ? `N° ${v}` : `${p.opLabel.toLowerCase()} ${v}`);
const queElegir = p => ({ Color: 'el color', Número: 'el número', Aroma: 'el aroma', Tapa: 'la tapa' }[p.opLabel] || 'una opción');

const Cart = {
  KEY: '4princesas_cart',
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
  regalo: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
  bloques: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/></svg>',
  cotillon: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>',
  taza: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>',
  lapiz: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
  torta: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>',
  mochila: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
  casa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ICO_OCASION = { cumple: ICO.torta, regalo: ICO.regalo, cole: ICO.mochila, casa: ICO.casa };

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
function opsResumen(p) {
  if (p.ops.length === 1) return esc(p.unidad || '');
  if (p.opLabel === 'Número') return `Números del ${esc(p.ops[0].v)} al ${esc(p.ops[p.ops.length - 1].v)}`;
  const n = p.ops.filter(o => o.stock > 0).length;
  const que = { Color: 'colores', Aroma: 'aromas', Tapa: 'tapas' }[p.opLabel] || 'opciones';
  const puntos = p.ops.some(o => o.hex) ? `<span class="pcard__puntos" aria-hidden="true">${p.ops.map(o => `<i style="--c:${esc(o.hex || '#ddd')}"${o.stock > 0 ? '' : ' class="sin"'}></i>`).join('')}</span>` : '';
  return `${puntos}${n} ${n === 1 ? que.replace(/es$|s$/, '') : que}`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const cat = catDe(p.cat);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 3) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}" data-cat="${esc(p.cat)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(cat?.nombre || '')}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    <p class="pcard__ops">${opsResumen(p)}</p>
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
    nav.querySelector('input, a, .nav-drop__btn')?.focus();
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

function initBuscador() {
  const btn = document.querySelector('[data-buscar-abrir]');
  const panel = document.getElementById('hbuscar');
  if (!btn || !panel) return;
  const input = panel.querySelector('input');
  const abrir = () => { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); input?.focus({ preventScroll: true }); };
  const cerrar = (foco = true) => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (foco) btn.focus({ preventScroll: true }); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  panel.querySelector('[data-buscar-cerrar]')?.addEventListener('click', () => cerrar());
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) cerrar(false); });
}

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const cats = box.querySelector('[data-drop-cats]');
    const ocas = box.querySelector('[data-drop-ocasiones]');
    if (!btn || !panel || !cats) return;
    cats.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${sel.cat === c.id && !sel.ocasion ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="64" height="48"><span class="nav-drop__txt">${esc(c.nombre)}</span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    if (ocas) ocas.innerHTML = Object.entries(OCASIONES).map(([k, o]) => `<li><a href="${URL_CATALOGO}?ocasion=${k}"${sel.ocasion === k && !sel.cat ? ' aria-current="page"' : ''}>${ICO_OCASION[k]}<span>${esc(o.nombre)}</span><small>${Tienda.contar({ ocasion: k })}</small></a></li>`).join('');
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
  if (sel.cat && !sel.ocasion) document.querySelectorAll(`.nav-link[href$="cat=${sel.cat}"]`).forEach(a => a.setAttribute('aria-current', 'page'));
  if (sel.ocasion && !sel.cat) document.querySelectorAll(`.nav-link[href$="ocasion=${sel.ocasion}"]`).forEach(a => a.setAttribute('aria-current', 'page'));
}

function initCuentas() {
  const txt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = txt(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-ocasion]').forEach(el => { el.textContent = txt(Tienda.contar({ ocasion: el.dataset.cuentaOcasion })); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

const IDS_RAIL = ['tazas-ceramica', 'camion-volcador', 'oso-peluche', 'globos-pastel', 'osito-crochet', 'cohete-madera', 'vela-aromatica', 'acuarelas'];
const IDS_NUEVOS = ['encastre-madera', 'xilofon', 'platos-festoneados', 'sorbetes-locos', 'vasos-vidrio', 'cuaderno-espiral', 'marcadores', 'portarretrato'];
const IDS_VITRINA = { cumple: ['globos-pastel', 'platos-festoneados'], regalo: ['oso-peluche', 'vela-aromatica'], cole: ['acuarelas', 'marcadores'], casa: ['tazas-ceramica', 'vasos-vidrio'] };
const IDS_MOSAICO = ['camion-volcador', 'osito-crochet', 'encastre-madera', 'cohete-madera', 'xilofon', 'sorbetes-locos', 'cuaderno-espiral', 'portarretrato'];

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { ids: IDS_RAIL }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
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

function initNovedades() {
  const grid = document.querySelector('[data-novedades]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { ids: IDS_NUEVOS }, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { ids: IDS_MOSAICO }, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  const orden = IDS_MOSAICO.map(id => items.find(p => p.id === id)).filter(Boolean);
  const total = Tienda.contar({});
  const todo = `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-n">${total}</span><span class="mosaico__todo-tit">Ver todo el catálogo</span><span class="mosaico__todo-sub">Juguetes, cotillón, bazar, librería y regalería</span>${ICO.flecha}</a>`;
  cont.innerHTML = orden.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function initOcasionesLista() {
  const box = document.querySelector('[data-ocasiones-lista]');
  if (!box) return;
  const fotos = [...box.querySelectorAll('[data-ocasion-foto]')];
  const filas = [...box.querySelectorAll('[data-ocasion]')];
  const activar = k => {
    fotos.forEach(f => f.classList.toggle('is-activa', f.dataset.ocasionFoto === k));
    filas.forEach(f => f.classList.toggle('is-activa', f.dataset.ocasion === k));
  };
  filas.forEach(f => {
    f.addEventListener('mouseenter', () => activar(f.dataset.ocasion));
    f.addEventListener('focus', () => activar(f.dataset.ocasion));
  });
  activar(filas[0]?.dataset.ocasion);
}

function initVitrina() {
  const box = document.querySelector('[data-vitrina]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panel = box.querySelector('[data-vitrina-panel]');
  if (!tabs.length || !panel) return;
  const pintar = (k, primera) => {
    const o = OCASIONES[k];
    if (!o) return;
    tabs.forEach(t => {
      const activa = t.dataset.tab === k;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${k}`);
    const { items } = Tienda.consultar({ filtros: { ids: IDS_VITRINA[k] }, orden: 'destacados', limite: 2 });
    items.forEach(cachear);
    const n = Tienda.contar({ ocasion: k });
    panel.innerHTML = `<a class="vitrina__ocasion" href="${URL_CATALOGO}?ocasion=${k}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
        <span class="vitrina__foto"><img src="${esc(o.img)}" alt="${esc(o.alt)}" width="800" height="1000"></span>
        <span class="vitrina__txt"><span class="vitrina__ico">${ICO_OCASION[k]}</span><span class="vitrina__nom">${esc(o.nombre)}</span><span class="vitrina__bajada">${esc(o.texto)}</span><span class="vitrina__ver">Ver los ${n} productos ${ICO.flecha}</span></span>
      </a>${items.map(p => cardHTML(p)).join('')}`;
    if (!primera) revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined' && !primera) ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.tab, false));
    t.addEventListener('keydown', e => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const sig = tabs[(i + dir + tabs.length) % tabs.length];
      sig.focus();
      pintar(sig.dataset.tab, false);
    });
  });
  pintar(tabs[0].dataset.tab, true);
}

function initRegalo() {
  const box = document.querySelector('[data-regalo]');
  if (!box) return;
  const res = box.querySelector('[data-regalo-res]');
  const titulo = box.querySelector('[data-regalo-tit]');
  const ver = box.querySelector('[data-regalo-ver]');
  const wsp = box.querySelector('[data-regalo-wsp]');
  if (!res || !ver) return;
  const valor = name => box.querySelector(`input[name="${name}"]:checked`)?.value;
  const pintar = primera => {
    const para = valor('regalo-para') || 'chicos';
    const rango = valor('regalo-precio') || 'hasta10';
    const r = RANGOS[rango];
    const f = { para, stock: true };
    if (r.min != null) f.precioMin = r.min;
    if (r.max != null) f.precioMax = r.max;
    let { items } = Tienda.consultar({ filtros: f, orden: 'destacados', limite: 3 });
    let cerca = false;
    if (!items.length) {
      cerca = true;
      const todos = Tienda.consultar({ filtros: { para, stock: true }, orden: 'destacados', limite: 100 }).items;
      const centro = r.max != null && r.min != null ? (r.min + r.max) / 2 : r.max != null ? r.max : r.min;
      items = todos.sort((a, b) => Math.abs(precioFinal(a) - centro) - Math.abs(precioFinal(b) - centro)).slice(0, 3);
    }
    items.forEach(cachear);
    const quien = `${PARA[para].nombre.toLowerCase()} ${PARA[para].detalle}`;
    if (titulo) titulo.textContent = cerca ? `No tenemos ideas justo en ese rango para ${quien}: estas son las más cercanas.` : `Ideas para ${quien}, ${r.nombre.toLowerCase()}:`;
    res.innerHTML = items.map(p => {
      const elegir = pideEleccion(p);
      return `<li class="idea" data-animate="subir" style="opacity:0;transform:translateY(24px)">
        <button type="button" class="idea__foto" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="240" height="240"></button>
        <div class="idea__txt"><p class="idea__cat">${esc(catDe(p.cat)?.nombre)}</p><p class="idea__nom">${esc(p.nombre)}</p>${precioHTML(p, 'idea__precio')}</div>
        <button type="button" class="idea__add" ${elegir ? `data-quick="${esc(p.id)}"` : `data-idea-add="${esc(p.id)}"`} aria-label="${elegir ? 'Elegir opción' : 'Agregar al carrito'}: ${esc(p.nombre)}">${elegir ? ICO.flecha : ICO.mas}</button>
      </li>`;
    }).join('');
    const total = Tienda.contar({ para });
    ver.href = `${URL_CATALOGO}?para=${para}${cerca ? '' : `&precio=${rango}`}`;
    ver.querySelector('span').textContent = cerca ? `Ver las ${total} ideas para ${PARA[para].nombre.toLowerCase()}` : 'Ver todas las ideas en ese rango';
    if (wsp) wsp.href = wspLink(`Hola 4PRINCESAS! Busco un regalo para ${quien}, ${r.nombre.toLowerCase()}. ¿Qué me recomiendan?`);
    if (!primera) revelarNuevos(res);
  };
  box.addEventListener('change', e => { if (e.target.matches('input[type="radio"]')) pintar(false); });
  res.addEventListener('click', e => {
    const b = e.target.closest('[data-idea-add]');
    if (!b) return;
    const p = getProducto(b.dataset.ideaAdd);
    if (p) sumarAlCarrito(p, 1, p.ops[0].v, false);
  });
  pintar(true);
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí ${queElegir(p)}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">Elegí ${queElegir(p)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(p.opLabel)} ${esc(o.v)}${o.stock > 0 ? '' : ', sin stock'}">${o.hex ? `<i style="--c:${esc(o.hex)}" aria-hidden="true"></i>` : ''}${esc(o.v)}</button>`).join('')}</div>${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  (pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast('Esa opción no tiene stock por ahora.'); return; }
  if (comprar) { abrirCarrito(); return; }
  const detalle = opTexto(p, v);
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
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, opBtn.dataset.pickerOp, pk.dataset.modo === 'comprar');
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

const qvEstado = { p: null, op: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  qvEstado.op = p.ops.length === 1 && p.ops[0].stock > 0 ? p.ops[0].v : '';
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: '4PRINCESAS' }, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  let { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], ocasion: p.ocasiones || [], stock: true }, orden: 'destacados', limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const mismaCat = rel.every(r => r.cat === p.cat);
  const sinStock = !(stockTotal(p) > 0);
  const op = p.ops.find(o => o.v === qvEstado.op);
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí ${queElegir(p)} para ver la disponibilidad` : op.stock <= 2 ? `Quedan ${op.stock}${op.v === 'Único' ? '' : ` en ${opTexto(p, op.v)}`}` : 'En stock';
  const selOp = p.ops.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">${esc(p.opLabel)}${qvEstado.op ? `: <b>${esc(qvEstado.op)}</b>` : ''}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(p.opLabel)}">${p.ops.map(o => `<button type="button" class="qv__op${o.hex ? ' qv__op--color' : ''}" role="radio" aria-checked="${o.v === qvEstado.op}" data-qv-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${o.hex ? `<i style="--c:${esc(o.hex)}" aria-hidden="true"></i>` : ''}${esc(o.v)}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>Elegí ${queElegir(p)} para sumarlo al carrito.</p></div>`
    : `<p class="qv__unidad">${esc(p.unidad || '')}</p>`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}${p.ops.length > 1 && p.unidad ? ` · ${esc(p.unidad)}` : ''}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio')}
      ${selOp}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      <a class="qv__wsp" href="${wspLink(`Hola 4PRINCESAS! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : 'Consultá por WhatsApp'}</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">${mismaCat ? `También en ${esc((catDe(p.cat)?.nombre || '').toLowerCase())}` : 'Va bien con esto'}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="240"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
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
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = opBtn.dataset.qvOp;
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      pintarQV();
      qv.querySelector(`[data-qv-op="${window.CSS.escape(qvEstado.op)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.op) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { const n = Cart.add(p, qvEstado.qty, qvEstado.op); if (!n) { showToast('Esa opción no tiene stock por ahora.'); return; } cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, qvEstado.op, false);
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
    body.innerHTML = `<div class="cart-vacio">${ICO.regalo}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Sumá un juguete, el cotillón del cumple o ese detalle para regalar.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const d = opTexto(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="76" height="76">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${d ? `${esc(d.charAt(0).toUpperCase() + d.slice(1))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const d = opTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${d ? ` (${d})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola 4PRINCESAS! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">Después de confirmar, te escribimos para coordinar la entrega.</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}

function confeti(origen) {
  if (reduceMotion || !origen) return;
  const r = origen.getBoundingClientRect();
  const capa = document.createElement('div');
  capa.className = 'confeti';
  capa.setAttribute('aria-hidden', 'true');
  const colores = ['#A62A72', '#F2C6D6', '#C9A27E', '#8E9C86', '#CDE3F0', '#B08A4E'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('i');
    const ang = (-150 + Math.random() * 120) * Math.PI / 180;
    const dist = 90 + Math.random() * 140;
    s.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top}px;background:${colores[i % colores.length]};--dx:${(Math.cos(ang) * dist).toFixed(1)}px;--dy:${(Math.sin(ang) * dist).toFixed(1)}px;--rot:${Math.round(Math.random() * 540 - 270)}deg;animation-delay:${(Math.random() * 0.08).toFixed(2)}s`;
    capa.appendChild(s);
  }
  document.body.appendChild(capa);
  setTimeout(() => capa.remove(), 1500);
}

function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    const fin = e.target.closest('[data-finalizar]');
    if (fin) { confeti(fin); showToast('¡Genial! El pago online se activa al pasar la web a producción.'); }
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
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    ocasion: valido(PARAMS.get('ocasion'), OCASIONES),
    para: valido(PARAMS.get('para'), PARA),
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
    const opciones = [{ id: '', nombre: 'Todo', ico: 'regalo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${c.id ? ICO[c.ico] : ''}<span>${esc(c.nombre)}</span><span class="chip__n" data-cuenta-filtro-cat="${c.id}"></span></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas las categorías')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-ocasion-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todas'], ...Object.entries(OCASIONES).map(([k, o]) => [k, o.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-ocasion" value="${k}" data-filtro="ocasion"><span>${esc(n)}</span><span class="opt__n" data-cuenta-ocasion-f="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-para-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Para cualquiera'], ...Object.entries(PARA).map(([k, o]) => [k, o.filtro])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-para" value="${k}" data-filtro="para"><span>${esc(n)}</span><span class="opt__n" data-cuenta-para-f="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.ocasion && sin !== 'ocasion') f.ocasion = estado.ocasion;
    if (estado.para && sin !== 'para') f.para = estado.para;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.ocasion) chips.push(['ocasion', OCASIONES[estado.ocasion].nombre]);
    if (estado.para) chips.push(['para', PARA[estado.para].filtro]);
    if (estado.precio) chips.push(['precio', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', 'Con descuento']);
    if (estado.stock) chips.push(['stock', 'Solo con stock']);
    if (estado.q) chips.push(['q', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, t]) => `<button type="button" class="activo" data-quitar="${f}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-ocasion-f]').forEach(el => {
      const k = el.dataset.cuentaOcasionF;
      el.textContent = Tienda.contar({ ...filtrosDe('ocasion'), ...(k ? { ocasion: k } : {}) });
    });
    document.querySelectorAll('[data-cuenta-para-f]').forEach(el => {
      const k = el.dataset.cuentaParaF;
      el.textContent = Tienda.contar({ ...filtrosDe('para'), ...(k ? { para: k } : {}) });
    });
    const enPanel = (estado.ocasion ? 1 : 0) + (estado.para ? 1 : 0) + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const oc = OCASIONES[estado.ocasion];
    let titulo = cat ? cat.nombre : oc ? `Para ${oc.nombre.toLowerCase()}` : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Todo el catálogo';
    if (cat && oc) titulo = `${cat.nombre} para ${oc.nombre.toLowerCase()}`;
    if (!cat && !oc && estado.para) titulo = `Ideas para ${PARA[estado.para].nombre.toLowerCase()}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : oc ? oc.texto : estado.para ? `Juguetes y regalos pensados para ${PARA[estado.para].nombre.toLowerCase()} ${PARA[estado.para].detalle}.` : 'Juguetes, cotillón, bazar, librería y regalería con precio y stock a la vista. Elegí y sumalo al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todo el catálogo'; miga.textContent = titulo; }
    document.title = `${titulo} — 4PRINCESAS`;
    document.querySelectorAll('.nav-drop__cat, [data-drop-ocasiones] a, .nav-link[href*="?"]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = (u.searchParams.get('cat') || '') === estado.cat && (u.searchParams.get('ocasion') || '') === estado.ocasion && (estado.cat || estado.ocasion);
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'ocasion', 'para', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.ocasion) u.searchParams.set('ocasion', estado.ocasion);
    if (estado.para) u.searchParams.set('para', estado.para);
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
    estado.cat = ''; estado.ocasion = ''; estado.para = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
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
      if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
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
  if (filtros && window.getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  filtros?.addEventListener('scroll', () => filtros.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), { passive: true });
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, ocasion: estado.ocasion };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-kicker', { y: 22, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.38);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.bento__cat', { y: 26, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform,opacity' }, 0.5);
  paso('.bento__alto', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.35);
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
  initBuscador,
  initRail,
  initNovedades,
  initMosaico,
  initVitrina,
  initRegalo,
  initOcasionesLista,
  initCuentas,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
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
