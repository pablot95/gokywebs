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

const WSP = '5492920542636';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'electricidad', nombre: 'Electricidad', img: 'images/t-electricidad.webp', corto: 'Cables, térmicas e iluminación' },
  { id: 'gas', nombre: 'Gas', img: 'images/t-gas.webp', corto: 'Llaves de paso y conexiones de bronce' },
  { id: 'agua', nombre: 'Agua', img: 'images/t-agua.webp', corto: 'Conexiones de cobre para agua fría y caliente' },
  { id: 'cloacas', nombre: 'Cloacas', img: 'images/t-cloacas.webp', corto: 'Codos y ramales de PVC para desagüe' },
  { id: 'buloneria', nombre: 'Bulones y tornillos', img: 'images/t-buloneria.webp', corto: 'Bulones, tuercas, arandelas, tornillos, tarugos y clavos' },
  { id: 'herramientas', nombre: 'Herramientas', img: 'images/t-herramientas.webp', corto: 'Eléctricas, de mano, mechas y cajas' },
  { id: 'hierros', nombre: 'Hierros estructurales', img: 'images/t-hierros.webp', corto: 'Caños estructurales en barras de 6 m' },
  { id: 'chapas', nombre: 'Chapas', img: 'images/t-chapas.webp', corto: 'Chapa acanalada galvanizada en varios largos' },
];
const SUBS = {
  cables: 'Cables', proteccion: 'Protección y tableros', iluminacion: 'Iluminación',
  llaves: 'Llaves de paso', conexiones: 'Conexiones de bronce',
  cobre: 'Conexiones de cobre',
  pvc: 'Conexiones de PVC',
  bulones: 'Bulones', tuercas: 'Tuercas y arandelas', tornillos: 'Tornillos', tarugos: 'Tarugos', clavos: 'Clavos',
  electricas: 'Herramientas eléctricas', manuales: 'Herramientas de mano', accesorios: 'Mechas y accesorios', guardado: 'Cajas y guardado',
  canos: 'Caños estructurales',
  acanaladas: 'Chapas acanaladas',
};
const MEDIDAS = ['1/4"', '5/16"', '3/8"', '1/2"', '3/4"', '1"'];
const RANGOS = {
  hasta5: { nombre: 'Hasta $5.000', max: 5000 },
  '5a30': { nombre: '$5.000 a $30.000', min: 5001, max: 30000 },
  mas30: { nombre: 'Más de $30.000', min: 30001 },
};
const ORDENES = { destacados: 'Lo más pedido', nuevos: 'Recién ingresados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const op = (v, cod, precio, stock) => ({ v, cod, precio, stock });

const PRODUCTOS = [
  { id: 'cable-unipolar', nombre: 'Cable unipolar normalizado', cat: 'electricidad', sub: 'cables', material: 'Cobre', unidad: 'Rollo de 100 m', opNombre: 'Sección', descuento: 0, rango: 2, alta: 4,
    ops: [op('1,5 mm²', '10112', 48900, 14), op('2,5 mm²', '10125', 72500, 22), op('4 mm²', '10140', 112000, 9), op('6 mm²', '10160', 164000, 4)],
    img: 'images/p-cable.webp', alt: 'Rollo de cable unipolar azul atado con precintos, junto a un interruptor termomagnético',
    desc: 'Conductor de cobre con aislación de PVC para instalaciones domiciliarias. Rollo cerrado de 100 metros. Si necesitás otro color, consultanos.',
    tags: ['cable', 'cables', 'unipolar', 'conductor', 'cobre', 'rollo', 'instalacion electrica'] },
  { id: 'termica', nombre: 'Interruptor termomagnético para riel DIN', cat: 'electricidad', sub: 'proteccion', material: '', unidad: 'Por unidad', opNombre: 'Polos y corriente', descuento: 0, rango: 6, alta: 7,
    ops: [op('1 polo · 10 A', '10210', 9800, 20), op('1 polo · 16 A', '10216', 9800, 26), op('2 polos · 20 A', '10220', 19600, 15), op('2 polos · 32 A', '10232', 21400, 8), op('3 polos · 40 A', '10340', 38900, 3)],
    img: 'images/p-termica.webp', alt: 'Tres interruptores termomagnéticos blancos de uno, dos y tres polos',
    desc: 'Protege cada circuito de sobrecargas y cortocircuitos. Se monta en riel DIN, en tableros de casas y comercios. Si no sabés qué amperaje lleva tu tablero, mandanos una foto.',
    tags: ['termica', 'termicas', 'termomagnetica', 'llave termica', 'interruptor', 'tablero', 'riel din', 'breaker'] },
  { id: 'lampara-led', nombre: 'Lámpara LED gota rosca E27', cat: 'electricidad', sub: 'iluminacion', material: '', unidad: 'Por unidad', opNombre: 'Potencia y luz', descuento: 15, rango: 0, alta: 22,
    ops: [op('9 W · luz fría', '10309', 2900, 60), op('9 W · luz cálida', '10319', 2900, 44), op('12 W · luz fría', '10312', 3900, 38)],
    img: 'images/px-lampara.webp', alt: 'Lámpara LED blanca con rosca E27 sobre fondo claro',
    desc: 'Rosca común E27 y encendido instantáneo. Elegí luz fría para trabajar o luz cálida para los ambientes de la casa.',
    tags: ['lampara', 'lamparas', 'foco', 'focos', 'led', 'bombita', 'e27', 'luz'] },
  { id: 'llave-esferica-gas', nombre: 'Llave esférica para gas con mariposa', cat: 'gas', sub: 'llaves', material: 'Bronce', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 1, alta: 9,
    ops: [op('1/2"', '20112', 14900, 18), op('3/4"', '20134', 21800, 10), op('1"', '20110', 33500, 4)],
    img: 'images/p-llave-gas.webp', alt: 'Llave esférica de bronce con manija mariposa amarilla',
    desc: 'Cuerpo de bronce y manija mariposa amarilla, la que identifica la línea de gas. Rosca hembra y macho. La instalación de gas la tiene que hacer un gasista matriculado.',
    tags: ['llave de paso', 'llave esferica', 'esferica', 'mariposa', 'gas', 'bronce'] },
  { id: 'codo-bronce', nombre: 'Codo de bronce 90° macho-macho', cat: 'gas', sub: 'conexiones', material: 'Bronce', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 0, alta: 11,
    ops: [op('1/2"', '20212', 5900, 30), op('3/4"', '20234', 8400, 16)],
    img: 'images/p-codo-bronce.webp', alt: 'Codo de bronce a 90 grados con rosca macho en los dos extremos',
    desc: 'Conexión roscada de bronce para cambiar de dirección la cañería. Rosca macho en los dos extremos.',
    tags: ['codo', 'codos', 'bronce', '90', 'rosca', 'conexion', 'accesorio'] },
  { id: 'niple-bronce', nombre: 'Niple de bronce hexagonal', cat: 'gas', sub: 'conexiones', material: 'Bronce', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 0, alta: 15,
    ops: [op('1/2"', '20312', 3200, 40), op('3/4"', '20334', 4600, 25), op('1"', '20310', 7300, 12)],
    img: 'images/p-niple.webp', alt: 'Niple hexagonal de bronce con rosca macho en ambos lados',
    desc: 'Une dos piezas con rosca hembra. El hexágono del centro permite ajustarlo con llave.',
    tags: ['niple', 'niples', 'bronce', 'hexagonal', 'union', 'rosca'] },
  { id: 'buje-reduccion', nombre: 'Buje de reducción de bronce', cat: 'gas', sub: 'conexiones', material: 'Bronce', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 0, alta: 18,
    ops: [op('3/4" a 1/2"', '20412', 3900, 22), op('1" a 3/4"', '20434', 5800, 14)],
    img: 'images/p-buje.webp', alt: 'Buje de reducción de bronce con rosca macho por fuera y hembra por dentro',
    desc: 'Reduce la medida de una salida: rosca macho por fuera y hembra por dentro.',
    tags: ['buje', 'bujes', 'reduccion', 'reductor', 'bronce'] },
  { id: 'codo-cobre', nombre: 'Codo de cobre 90° para soldar', cat: 'agua', sub: 'cobre', material: 'Cobre', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 7, alta: 6,
    ops: [op('1/2"', '30112', 3400, 50), op('3/4"', '30134', 5200, 34), op('1"', '30110', 8900, 12)],
    img: 'images/p-codo-cobre.webp', alt: 'Codo de cobre a 90 grados para soldar',
    desc: 'Para cañería de cobre de agua fría y caliente. Se suelda con estaño y pasta para soldar.',
    tags: ['codo', 'codos', 'cobre', '90', 'soldar', 'agua', 'cañeria'] },
  { id: 'te-cobre', nombre: 'Te de cobre para soldar', cat: 'agua', sub: 'cobre', material: 'Cobre', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 0, alta: 13,
    ops: [op('1/2"', '30212', 4900, 28), op('3/4"', '30234', 7600, 18), op('1"', '30210', 12400, 6)],
    img: 'images/p-te-cobre.webp', alt: 'Te de cobre para soldar con tres bocas',
    desc: 'Saca una derivación a 90° de la línea principal de agua.',
    tags: ['te', 'tee', 't', 'cobre', 'derivacion', 'soldar', 'agua'] },
  { id: 'cupla-cobre', nombre: 'Cupla de cobre para soldar', cat: 'agua', sub: 'cobre', material: 'Cobre', unidad: 'Por unidad', opNombre: 'Medida', descuento: 0, rango: 0, alta: 20,
    ops: [op('1/2"', '30312', 1900, 60), op('3/4"', '30334', 2900, 40), op('1"', '30310', 4800, 15)],
    img: 'images/p-cupla-cobre.webp', alt: 'Cupla de cobre para unir dos caños de la misma medida',
    desc: 'Une dos tramos de caño de cobre de la misma medida.',
    tags: ['cupla', 'cuplas', 'union', 'manguito', 'cobre', 'agua'] },
  { id: 'codo-pvc', nombre: 'Codo de PVC 90° para desagüe', cat: 'cloacas', sub: 'pvc', material: 'PVC', unidad: 'Por unidad', opNombre: 'Diámetro', descuento: 0, rango: 5, alta: 5,
    ops: [op('Ø 40 mm', '40140', 1900, 45), op('Ø 50 mm', '40150', 2600, 38), op('Ø 63 mm', '40163', 3900, 22), op('Ø 110 mm', '40111', 7800, 16)],
    img: 'images/p-codo-pvc.webp', alt: 'Codos de PVC gris a 90 grados de distintos diámetros',
    desc: 'PVC gris para desagües cloacales y pluviales. Se une con adhesivo para PVC.',
    tags: ['codo', 'codos', 'pvc', 'cloaca', 'cloacas', 'desague', 'caño', '110', '63', '50', '40'] },
  { id: 'ramal-pvc', nombre: 'Ramal T de PVC a 90°', cat: 'cloacas', sub: 'pvc', material: 'PVC', unidad: 'Por unidad', opNombre: 'Diámetro', descuento: 0, rango: 0, alta: 12,
    ops: [op('Ø 63 mm', '40263', 5900, 14), op('Ø 110 mm', '40211', 11900, 9)],
    img: 'images/p-ramal-pvc.webp', alt: 'Ramal en forma de T de PVC gris',
    desc: 'Para sumar una descarga a la línea principal de cloaca.',
    tags: ['ramal', 'te', 'tee', 't', 'pvc', 'cloaca', 'desague', '110'] },
  { id: 'bulon-hexagonal', nombre: 'Bulón hexagonal zincado rosca Whitworth', cat: 'buloneria', sub: 'bulones', material: 'Acero zincado', unidad: 'Bolsa x 10', opNombre: 'Medida', descuento: 0, rango: 3, alta: 3,
    ops: [op('1/4" x 1"', '50114', 2400, 40), op('5/16" x 1 1/2"', '50516', 3900, 32), op('3/8" x 2"', '50382', 6200, 26), op('1/2" x 3"', '50123', 12800, 12)],
    img: 'images/p-bulon.webp', alt: 'Bulones hexagonales zincados con tuercas y arandelas',
    desc: 'Acero zincado, rosca Whitworth (BSW). Bolsa de 10 unidades: sumá tuercas y arandelas de la misma medida.',
    tags: ['bulon', 'bulones', 'tornillo', 'hexagonal', 'zincado', 'whitworth', 'bsw'] },
  { id: 'tuerca-hexagonal', nombre: 'Tuerca hexagonal zincada', cat: 'buloneria', sub: 'tuercas', material: 'Acero zincado', unidad: 'Bolsa x 10', opNombre: 'Medida', descuento: 0, rango: 0, alta: 10,
    ops: [op('1/4"', '50214', 900, 60), op('5/16"', '50216', 1200, 48), op('3/8"', '50238', 1600, 40), op('1/2"', '50212', 2900, 22)],
    img: 'images/p-tuerca.webp', alt: 'Tuercas hexagonales zincadas junto a una arandela',
    desc: 'Rosca Whitworth, para los bulones de la misma medida. Bolsa de 10 unidades.',
    tags: ['tuerca', 'tuercas', 'hexagonal', 'zincada', 'whitworth'] },
  { id: 'arandela-plana', nombre: 'Arandela plana zincada', cat: 'buloneria', sub: 'tuercas', material: 'Acero zincado', unidad: 'Bolsa x 10', opNombre: 'Medida', descuento: 0, rango: 0, alta: 14,
    ops: [op('1/4"', '50314', 600, 80), op('5/16"', '50316', 800, 64), op('3/8"', '50338', 1100, 50), op('1/2"', '50312', 1700, 30)],
    img: 'images/p-arandela.webp', alt: 'Arandelas planas zincadas con una tuerca',
    desc: 'Reparte la carga del ajuste y protege la superficie. Bolsa de 10 unidades.',
    tags: ['arandela', 'arandelas', 'plana', 'zincada'] },
  { id: 'tornillo-t1', nombre: 'Tornillo T1 punta aguja para placa de yeso', cat: 'buloneria', sub: 'tornillos', material: 'Acero', unidad: 'Por caja', opNombre: 'Presentación', descuento: 10, rango: 0, alta: 21,
    ops: [op('8 x 1/2" · caja x 100', '50418', 3900, 30), op('8 x 1/2" · caja x 1000', '50419', 29900, 6)],
    img: 'images/px-tornillo-t1.webp', alt: 'Tornillos T1 de cabeza tanque esparcidos sobre una mesa de madera',
    desc: 'Cabeza tanque y punta aguja para fijar perfiles y placas de yeso en construcción en seco.',
    tags: ['tornillo', 'tornillos', 't1', 'punta aguja', 'durlock', 'placa', 'yeso', 'steel framing', 'autoperforante'] },
  { id: 'tarugo-nylon', nombre: 'Tarugo de nylon', cat: 'buloneria', sub: 'tarugos', material: 'Nylon', unidad: 'Bolsa x 100', opNombre: 'Medida', descuento: 0, rango: 0, alta: 17,
    ops: [op('N° 6', '50506', 2300, 40), op('N° 8', '50508', 3200, 36), op('N° 10', '50510', 4400, 20)],
    img: 'images/px-tarugos.webp', alt: 'Montón de tarugos de nylon blancos',
    desc: 'Para fijar con tornillo en ladrillo, hormigón o placa. Usá la mecha de la misma medida que el tarugo.',
    tags: ['tarugo', 'tarugos', 'taco', 'tacos', 'nylon', 'anclaje', 'fijacion'] },
  { id: 'clavo-paris', nombre: 'Clavo punta París', cat: 'buloneria', sub: 'clavos', material: 'Acero', unidad: 'Por kilo', opNombre: 'Largo', descuento: 0, rango: 0, alta: 8,
    ops: [op('1 1/2"', '50615', 4800, 30), op('2"', '50620', 4600, 34), op('2 1/2"', '50625', 4500, 28), op('3"', '50630', 4500, 20)],
    img: 'images/px-clavos.webp', alt: 'Tres clavos de acero cruzados sobre fondo gris',
    desc: 'Clavo de acero de cabeza plana para carpintería y obra. Se vende por kilo.',
    tags: ['clavo', 'clavos', 'paris', 'punta paris'] },
  { id: 'taladro-12v', nombre: 'Taladro atornillador inalámbrico 12 V', cat: 'herramientas', sub: 'electricas', material: '', unidad: 'Por unidad', opNombre: 'Kit', descuento: 10, rango: 4, alta: 19,
    ops: [op('Con 1 batería y cargador', '60112', 119900, 7), op('Con 2 baterías y cargador', '60122', 149900, 3)],
    img: 'images/p-taladro.webp', alt: 'Taladro atornillador inalámbrico azul y negro con una mecha, sobre una mesa de trabajo',
    desc: 'Mandril autoajustable y regulación de torque para atornillar sin pasarte. Perfora madera y metal y resuelve los arreglos de la casa.',
    tags: ['taladro', 'atornillador', 'inalambrico', 'bateria', '12v', 'herramienta electrica'] },
  { id: 'juego-mechas', nombre: 'Juego de mechas para metal', cat: 'herramientas', sub: 'accesorios', material: 'Acero', unidad: 'Por juego', opNombre: 'Presentación', descuento: 0, rango: 0, alta: 16,
    ops: [op('x 5 (3 a 8 mm)', '60205', 8900, 18), op('x 13 (1,5 a 6,5 mm)', '60213', 16500, 9)],
    img: 'images/p-mechas.webp', alt: 'Mechas para metal de distintos diámetros sobre una mesa de trabajo',
    desc: 'Acero rápido para perforar hierro, aluminio y madera. Estuche con las medidas marcadas.',
    tags: ['mecha', 'mechas', 'broca', 'brocas', 'metal', 'juego'] },
  { id: 'caja-herramientas', nombre: 'Caja de herramientas metálica', cat: 'herramientas', sub: 'guardado', material: 'Acero', unidad: 'Por unidad', opNombre: 'Largo', descuento: 0, rango: 8, alta: 2,
    ops: [op('16"', '60316', 34900, 6), op('19"', '60319', 42900, 4)],
    img: 'images/p-caja.webp', alt: 'Caja de herramientas metálica negra con un martillo, una pinza y una llave ajustable delante',
    desc: 'Chapa de acero con dos trabas y manija. Las herramientas de la foto no vienen incluidas.',
    tags: ['caja', 'caja de herramientas', 'valija', 'metalica', 'guardado'] },
  { id: 'destornilladores', nombre: 'Juego de 3 destornilladores', cat: 'herramientas', sub: 'manuales', material: '', unidad: 'Por juego', opNombre: 'Juego', descuento: 0, rango: 0, alta: 23,
    ops: [op('3 medidas', '60403', 9900, 15)],
    img: 'images/px-destornilladores.webp', alt: 'Tres destornilladores con mango amarillo y negro sobre una mesa de madera',
    desc: 'Tres largos de punta y mango con agarre, para los arreglos de todos los días.',
    tags: ['destornillador', 'destornilladores', 'juego', 'plano', 'phillips', 'herramienta de mano'] },
  { id: 'cano-estructural', nombre: 'Caño estructural cuadrado', cat: 'hierros', sub: 'canos', material: 'Acero', unidad: 'Barra de 6 m', opNombre: 'Medida y espesor', descuento: 0, rango: 0, alta: 1,
    ops: [op('20 x 20 x 1,6 mm', '70120', 16900, 24), op('30 x 30 x 1,6 mm', '70130', 24500, 18), op('40 x 40 x 2 mm', '70140', 39800, 12), op('50 x 50 x 2 mm', '70150', 49900, 8)],
    img: 'images/p-cano.webp', alt: 'Paquete de caños estructurales cuadrados de acero atados con fleje',
    desc: 'Acero para estructuras, rejas, portones y tinglados. Barra de 6 metros: consultanos por cortes y envío.',
    tags: ['caño', 'caños', 'caño estructural', 'tubo', 'hierro', 'hierros', 'perfil', 'cuadrado', 'estructural'] },
  { id: 'chapa-acanalada', nombre: 'Chapa acanalada galvanizada C25', cat: 'chapas', sub: 'acanaladas', material: 'Acero galvanizado', unidad: 'Por chapa', opNombre: 'Largo', descuento: 0, rango: 0, alta: 24,
    ops: [op('2 m', '80120', 28900, 30), op('3 m', '80130', 43300, 24), op('4 m', '80140', 57700, 16), op('5 m', '80150', 72100, 10), op('6 m', '80160', 86500, 6)],
    img: 'images/p-chapa.webp', alt: 'Pila de chapas acanaladas galvanizadas',
    desc: 'Calibre 25, para techos, tinglados y cerramientos. Contanos las medidas del techo y te ayudamos a calcular cuántas chapas llevar.',
    tags: ['chapa', 'chapas', 'acanalada', 'galvanizada', 'techo', 'zinc', 'c25', 'sinusoidal'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const normBusqueda = s => norm(s)
  .replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4').replace(/²/g, '2')
  .replace(/["“”″]|''/g, '').replace(/\bpulgadas?\b/g, ' ').replace(/(\d),(\d)/g, '$1.$2')
  .replace(/\s+/g, ' ').trim();
const VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'para', 'con', 'y', 'en', 'x', 'a', 'un', 'una', 'por']);
const redondear = n => Math.round(n / 10) * 10;
const precioOp = (p, o) => (p.descuento > 0 ? redondear(o.precio * (1 - p.descuento / 100)) : o.precio);
const opDe = (p, v) => p.ops.find(o => o.v === v);
const desde = p => Math.min(...p.ops.map(o => precioOp(p, o)));
const desdeLista = p => Math.min(...p.ops.map(o => o.precio));
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const partesMedida = v => String(v).split(' · ')[0].split(/ x | a /).map(s => s.trim());
const tieneMedida = (p, m) => p.ops.some(o => partesMedida(o.v).includes(m));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), materiales = lista(f.materiales), medidas = lista(f.medidas);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.sub && p.sub !== f.sub) return false;
    if (materiales.length && !materiales.includes(p.material)) return false;
    if (medidas.length && !medidas.some(m => tieneMedida(p, m))) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !(p.rango > 0)) return false;
    if (f.noDestacado && p.rango > 0) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
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
    textoBusqueda.set(p.id, normBusqueda([
      p.nombre, catDe(p.cat)?.nombre, SUBS[p.sub], p.material, p.unidad, p.desc, ...p.ops.map(o => `${o.v} ${o.cod}`), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9./ø]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const palabrasDe = q => normBusqueda(q).split(' ').filter(w => w && !VACIAS.has(w));
const coincideCorta = (p, w) => (w.length === 1 ? tokensDe(p).has(w) : [...tokensDe(p)].some(t => t.startsWith(w)));
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? coincideCorta(p, w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = palabrasDe(q);
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
const opInicial = p => p.ops.find(o => o.stock > 0) || p.ops[0];
const unaOpcion = p => p.ops.length === 1;
let PREF = { q: '', medidas: [] };
function opPreferida(p) {
  const conStock = p.ops.filter(o => o.stock > 0);
  const porMedida = conStock.find(o => PREF.medidas.some(m => partesMedida(o.v).includes(m)));
  if (porMedida) return porMedida;
  const palabras = palabrasDe(PREF.q).filter(w => /\d/.test(w));
  const porTexto = palabras.length && conStock.find(o => palabras.every(w => normBusqueda(`${o.v} ${o.cod}`).includes(w)));
  return porTexto || opInicial(p);
}

const Cart = {
  KEY: 'ferreterialaveinticinco_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = opDe(producto, v)?.stock || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? opDe(p, v)?.stock || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const o = p && opDe(p, i.v); return o ? s + precioOp(p, o) * i.qty : s; }, 0); },
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
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  caja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>',
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

function medidasResumen(p) {
  if (unaOpcion(p)) return esc(p.ops[0].v);
  const largo = p.ops.reduce((n, o) => n + o.v.length + 3, 0);
  if (largo > 34) return `${p.ops.length} opciones`;
  return p.ops.map(o => (o.stock > 0 ? esc(o.v) : `<del>${esc(o.v)}</del>`)).join('<span aria-hidden="true"> · </span>');
}
function precioCardHTML(p, clase) {
  const varios = !unaOpcion(p) && new Set(p.ops.map(o => o.precio)).size > 1;
  return `<p class="${clase}">${varios ? '<small>desde</small>' : ''}<b>${formatearPrecio(desde(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(desdeLista(p))}</s>` : ''}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--off">-${p.descuento}%</span>`;
  const st = stockTotal(p);
  if (st > 0 && st <= 8) return '<span class="badge">Últimas unidades</span>';
  return '';
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const cat = catDe(p.cat);
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></a>
    ${badgeHTML(p)}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta"><span class="cod">Cód. ${esc(p.ops[0].cod)}</span><span>${esc(cat?.nombre || '')}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__medidas">${medidasResumen(p)}</p>
    <div class="pcard__pie">${precioCardHTML(p, 'pcard__precio')}<p class="pcard__unidad">${esc(p.unidad)}</p></div>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
</article>`;
}

function filaHTML(p, { anim = true } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const o = opPreferida(p);
  const cat = catDe(p.cat);
  const selector = unaOpcion(p)
    ? `<p class="fila__op-fija"><span>${esc(p.opNombre)}</span>${esc(o.v)}</p>`
    : `<label class="fila__op"><span>${esc(p.opNombre)}</span><select data-fila-op aria-label="${esc(p.opNombre)}: ${esc(p.nombre)}">${p.ops.map(x => `<option value="${esc(x.v)}"${x === o ? ' selected' : ''}${x.stock > 0 ? '' : ' disabled'}>${esc(x.v)}</option>`).join('')}</select></label>`;
  return `<article class="fila${sinStock ? ' fila--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="izq" style="opacity:0;transform:translateX(-48px)"' : ''}>
  <a class="fila__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></a>
  <div class="fila__txt">
    <p class="fila__meta"><span class="cod">Cód. <span data-fila-cod>${esc(o.cod)}</span></span><span>${esc(cat?.nombre || '')}</span>${p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
    <h3 class="fila__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="fila__unidad">${esc(p.unidad)}</p>
  </div>
  ${selector}
  <p class="fila__precio"><b data-fila-precio>${formatearPrecio(precioOp(p, o))}</b>${p.descuento > 0 ? `<s data-fila-lista>${formatearPrecio(o.precio)}</s>` : ''}</p>
  <div class="prod-actions">
    <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
    <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
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
    const lista = box.querySelector('[data-drop-rubros]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map((c, i) => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${sel.cat === c.id ? ' aria-current="page"' : ''}><span class="nav-drop__n">${String(i + 1).padStart(2, '0')}</span><img src="${esc(c.img)}" alt="" width="48" height="48"><span class="nav-drop__txt"><span>${esc(c.nombre)}</span><small>${esc(c.corto)}</small></span></a></li>`).join('');
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

function initSugerencias() {
  document.querySelectorAll('[data-sugerir]').forEach((form, n) => {
    const input = form.querySelector('input[type="search"]');
    if (!input) return;
    const box = document.createElement('div');
    box.className = 'sugeridos';
    box.id = `sugeridos-${n}`;
    box.hidden = true;
    form.appendChild(box);
    input.setAttribute('aria-controls', box.id);
    input.setAttribute('aria-autocomplete', 'list');
    let t = 0;
    const cerrar = () => { box.hidden = true; input.setAttribute('aria-expanded', 'false'); };
    const pintar = () => {
      const q = input.value.trim();
      if (q.length < 2) { cerrar(); return; }
      const { items, cursor } = buscarPaginado(Tienda, { q, orden: 'destacados', limite: 5 });
      items.forEach(cachear);
      const todo = `${URL_CATALOGO}?q=${encodeURIComponent(q)}`;
      box.innerHTML = items.length
        ? `<ul>${items.map(p => `<li><a class="sugerido" href="${URL_CATALOGO}?producto=${esc(p.id)}" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="44" height="44"><span><b>${esc(p.nombre)}</b><small>Cód. ${esc(p.ops[0].cod)} · ${esc(catDe(p.cat)?.nombre || '')}</small></span><em>${formatearPrecio(desde(p))}</em></a></li>`).join('')}</ul><a class="sugeridos__todo" href="${todo}">Ver ${cursor ? 'todos los' : 'los'} resultados para «${esc(q)}» ${ICO.flecha}</a>`
        : `<p class="sugeridos__nada">No aparece en la web. <a href="${wspLink(`Hola Ferretería La 25! Estoy buscando: ${q}. ¿Lo tienen?`)}" target="_blank" rel="noopener">Preguntanos por WhatsApp</a></p>`;
      box.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(pintar, 160); });
    input.addEventListener('focus', () => { if (input.value.trim().length >= 2) pintar(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { cerrar(); return; }
      if (e.key === 'ArrowDown' && !box.hidden) { e.preventDefault(); box.querySelector('a')?.focus(); }
    });
    box.addEventListener('keydown', e => {
      const links = [...box.querySelectorAll('a')];
      const i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[Math.min(i + 1, links.length - 1)]?.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) input.focus(); else links[i - 1].focus(); }
      if (e.key === 'Escape') { cerrar(); input.focus(); }
    });
    box.addEventListener('click', e => { if (e.target.closest('a')) setTimeout(cerrar, 0); });
    document.addEventListener('click', e => { if (!form.contains(e.target)) cerrar(); });
    form.addEventListener('focusout', e => { if (!form.contains(e.relatedTarget) && !document.getElementById('qv')?.contains(e.relatedTarget)) setTimeout(() => { if (!form.contains(document.activeElement)) cerrar(); }, 0); });
  });
}

function initPreciosSueltos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(desde(p));
  });
  document.querySelectorAll('[data-cod-de]').forEach(el => {
    const p = getProducto(el.dataset.codDe);
    if (p) el.textContent = p.ops[0].cod;
  });
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function initRails() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('[data-rail-track]');
    if (!track) return;
    const nuevos = vp.dataset.rail === 'nuevos';
    const { items } = Tienda.consultar({ filtros: nuevos ? { noDestacado: true } : { destacado: true }, orden: nuevos ? 'nuevos' : 'destacados', limite: 8 });
    pintarRail(track, items);
    initRailDrag(vp);
    const caja = vp.closest('[data-rail-box]') || document;
    const prev = caja.querySelector('[data-rail-prev]');
    const next = caja.querySelector('[data-rail-next]');
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
  });
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

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { noDestacado: true }, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initListaDestacados() {
  const cont = document.querySelector('[data-lista]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => filaHTML(p)).join('');
}

function initIndice() {
  const box = document.querySelector('[data-indice]');
  if (!box) return;
  const fotos = [...box.querySelectorAll('[data-indice-foto]')];
  const items = [...box.querySelectorAll('[data-indice-item]')];
  const activar = id => {
    items.forEach(it => it.classList.toggle('es-activo', it.dataset.indiceItem === id));
    fotos.forEach(f => f.classList.toggle('es-activa', f.dataset.indiceFoto === id));
  };
  items.forEach(it => {
    it.addEventListener('mouseenter', () => activar(it.dataset.indiceItem));
    it.addEventListener('focusin', () => activar(it.dataset.indiceItem));
  });
  activar(items[0]?.dataset.indiceItem);
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
  pk.setAttribute('aria-label', `Elegí ${p.opNombre.toLowerCase()}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">Elegí ${esc(p.opNombre.toLowerCase())}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}><span>${esc(o.v)}</span><b>${o.stock > 0 ? formatearPrecio(precioOp(p, o)) : 'Sin stock'}</b></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} ${p.unidad.toLowerCase().startsWith('bolsa') ? 'bolsas' : 'unidades'}.</p>` : ''}`;
  (card.querySelector('.pcard__media') || card).appendChild(pk);
  (pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(opDe(p, v)?.stock ? 'Ya tenés en el carrito todo el stock de esa medida.' : 'Esa medida no tiene stock por ahora.'); return; }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${unaOpcion(p) ? '' : ` (${v})`} al carrito`);
}

function initTarjetas() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-fila-op]');
    if (!sel) return;
    const fila = sel.closest('.fila');
    const p = getProducto(fila?.dataset.id);
    const o = p && opDe(p, sel.value);
    if (!o) return;
    fila.querySelector('[data-fila-cod]').textContent = o.cod;
    fila.querySelector('[data-fila-precio]').textContent = formatearPrecio(precioOp(p, o));
    const lista = fila.querySelector('[data-fila-lista]');
    if (lista) lista.textContent = formatearPrecio(o.precio);
    const n = fila.querySelector('[data-qty]');
    if (n) n.textContent = String(Math.min(parseInt(n.textContent, 10) || 1, Math.max(o.stock, 1)));
  });
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
      const card = step.closest('.pcard, .fila');
      const p = card ? getProducto(card.dataset.id) : null;
      const sel = card?.querySelector('[data-fila-op]');
      const max = p ? (sel ? opDe(p, sel.value)?.stock || 1 : Math.max(...p.ops.map(o => o.stock), 1)) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard, .fila');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      const sel = card.querySelector('[data-fila-op]');
      if (sel) { sumarAlCarrito(p, qty, sel.value, comprar); return; }
      if (!unaOpcion(p)) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
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

const qvEstado = { p: null, v: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  qvEstado.v = opPreferida(p).v;
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, sku: p.ops[0].cod,
    brand: { '@type': 'Brand', name: 'Ferretería La 25' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desde(p), highPrice: Math.max(...p.ops.map(o => precioOp(p, o))), offerCount: p.ops.length, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const o = opDe(p, qvEstado.v);
  const sinStock = !(stockTotal(p) > 0);
  const stockTxt = !o || !o.stock ? 'Sin stock por ahora en esta medida' : o.stock <= 5 ? `Quedan ${o.stock} en stock` : 'En stock';
  const tabla = `<div class="qv__var"><p class="qv__var-tit">${esc(p.opNombre)}</p>
    <div class="vtabla" role="radiogroup" aria-label="${esc(p.opNombre)}">
      <p class="vtabla__head" aria-hidden="true"><span>${esc(p.opNombre)}</span><span>Código</span><span>Precio</span></p>
      ${p.ops.map(x => `<button type="button" class="vtabla__fila" role="radio" aria-checked="${x.v === qvEstado.v}" data-qv-op="${esc(x.v)}"${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.v)}</span><span class="cod">${esc(x.cod)}</span><span><b>${x.stock > 0 ? formatearPrecio(precioOp(p, x)) : 'Sin stock'}</b></span></button>`).join('')}
    </div></div>`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800">${badgeHTML(p)}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(SUBS[p.sub] || '')}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="etiqueta etiqueta--qv">
        <p class="etiqueta__cod">Cód. <b>${esc(o?.cod || '')}</b>${unaOpcion(p) ? '' : ` · ${esc(qvEstado.v)}`}</p>
        <p class="etiqueta__precio"><b>${formatearPrecio(o ? precioOp(p, o) : desde(p))}</b>${p.descuento > 0 && o ? `<s>${formatearPrecio(o.precio)}</s>` : ''}</p>
        <p class="etiqueta__unidad">${esc(p.unidad)}${p.material ? ` · ${esc(p.material)}` : ''}</p>
      </div>
      ${unaOpcion(p) ? '' : tabla}
      <p class="qv__stock${!o || !o.stock ? ' qv__stock--sin' : ''}">${!o || !o.stock ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      <a class="qv__wsp" href="${wspLink(`Hola Ferretería La 25! Tengo una consulta sobre: ${p.nombre}${unaOpcion(p) ? '' : ` (${qvEstado.v})`}, cód. ${o?.cod || ''}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : '¿Dudas con la medida? Preguntá por WhatsApp'}</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También en ${esc((catDe(p.cat)?.nombre || '').toLowerCase())}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="240"><span>${esc(r.nombre)}</span><b>${formatearPrecio(desde(r))}</b></button>`).join('')}</div></div>` : ''}
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
      qvEstado.v = opBtn.dataset.qvOp;
      qvEstado.qty = Math.min(qvEstado.qty, opDe(p, qvEstado.v)?.stock || 1);
      pintarQV();
      qv.querySelector(`[data-qv-op="${CSS.escape(qvEstado.v)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = opDe(p, qvEstado.v)?.stock || 1;
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (comprar) {
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n && !Cart.get().some(i => i.id === p.id && i.v === qvEstado.v)) { showToast('Esa medida no tiene stock por ahora.'); return; }
      cerrarQV(); abrirCarrito(); return;
    }
    sumarAlCarrito(p, qvEstado.qty, qvEstado.v, false);
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
  const items = Cart.get().filter(i => { const p = getProducto(i.id); return p && opDe(p, i.v); });
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.caja}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Buscá por nombre, medida o código y sumá lo que necesitás para la obra.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const o = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="72" height="72">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${unaOpcion(p) ? '' : `${esc(i.v)} · `}Cód. ${esc(o.cod)} · ${formatearPrecio(precioOp(p, o))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, o) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const o = opDe(p, i.v); return `- ${i.qty} × ${p.nombre}${unaOpcion(p) ? '' : ` ${i.v}`} (cód. ${o.cod}): ${formatearPrecio(precioOp(p, o) * i.qty)}`; }).join('\n');
  const msg = `Hola Ferretería La 25! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
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
  const filas = grid.dataset.vista === 'filas';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const materialesUsados = [...new Set(PRODUCTOS.map(p => p.material).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    sub: '',
    materiales: new Set(lista('material').filter(m => materialesUsados.includes(m))),
    medidas: new Set(lista('medida').filter(m => MEDIDAS.includes(m))),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const subValida = s => s && SUBS[s] && PRODUCTOS.some(p => p.sub === s && (!estado.cat || p.cat === estado.cat));
  estado.sub = subValida(PARAMS.get('sub')) ? PARAMS.get('sub') : '';
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const vacioWsp = document.querySelector('[data-vacio-wsp]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');
  const subGrupo = document.querySelector('[data-sub-grupo]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los rubros')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-material-opciones]').forEach(cont => {
    cont.innerHTML = materialesUsados.map(m => `<label class="opt"><input type="checkbox" value="${esc(m)}" data-f="material"><span>${esc(m)}</span><span class="opt__n" data-cuenta-material="${esc(m)}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-medida-opciones]').forEach(cont => {
    cont.innerHTML = MEDIDAS.map(m => `<label class="medida-op"><input type="checkbox" value="${esc(m)}" data-f="medida"><span>${esc(m)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.sub && sin !== 'sub' && sin !== 'cat') f.sub = estado.sub;
    if (estado.materiales.size && sin !== 'material') f.materiales = [...estado.materiales];
    if (estado.medidas.size && sin !== 'medida') f.medidas = [...estado.medidas];
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const pintarSubs = () => {
    if (!subGrupo) return;
    const cont = subGrupo.querySelector('[data-sub-opciones]');
    const subs = estado.cat ? [...new Set(PRODUCTOS.filter(p => p.cat === estado.cat).map(p => p.sub))] : [];
    subGrupo.hidden = subs.length < 2;
    if (cont) cont.innerHTML = subs.length < 2 ? '' : [['', 'Todo el rubro'], ...subs.map(s => [s, SUBS[s]])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-sub" value="${k}" data-filtro="sub"${(estado.sub || '') === k ? ' checked' : ''}><span>${esc(n)}</span></label>`).join('');
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.sub) chips.push(['sub', '', SUBS[estado.sub]]);
    estado.materiales.forEach(m => chips.push(['material', m, m]));
    estado.medidas.forEach(m => chips.push(['medida', m, `Medida ${m}`]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    pintarSubs();
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="material"]').forEach(el => { el.checked = estado.materiales.has(el.value); });
    document.querySelectorAll('input[data-f="medida"]').forEach(el => { el.checked = estado.medidas.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-material]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('material'), materiales: [el.dataset.cuentaMaterial] }); });
    const enPanel = estado.materiales.size + estado.medidas.size + (estado.sub ? 1 : 0) + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = estado.sub ? SUBS[estado.sub] : cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.medidas.size === 1 ? `Todo en ${[...estado.medidas][0]}` : 'Todo el catálogo';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? `${cat.corto}. Elegí la medida y sumalo al carrito.` : 'Electricidad, gas, agua, cloacas, bulonería, herramientas, hierros y chapas. Buscá por nombre, medida o código.';
    const migaCat = document.querySelector('[data-miga-cat]');
    if (migaCat) {
      migaCat.hidden = !cat || !estado.sub;
      const a = migaCat.querySelector('a');
      if (a && cat) { a.textContent = cat.nombre; a.setAttribute('href', `${URL_CATALOGO}?cat=${cat.id}`); }
    }
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todo el catálogo'; miga.textContent = titulo; }
    document.title = `${titulo} — Ferretería La 25`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (estado.cat && (u.searchParams.get('cat') || '') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'material', 'medida', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.sub) u.searchParams.set('sub', estado.sub);
    if (estado.materiales.size) u.searchParams.set('material', [...estado.materiales].join(','));
    if (estado.medidas.size) u.searchParams.set('medida', [...estado.medidas].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    PREF = { q: estado.q, medidas: [...estado.medidas] };
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (filas ? filaHTML(p) : cardHTML(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (vacioWsp) vacioWsp.setAttribute('href', wspLink(estado.q ? `Hola Ferretería La 25! Estoy buscando: ${estado.q}. ¿Lo tienen?` : 'Hola Ferretería La 25! Estoy buscando un artículo que no encontré en la web.'));
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
    estado.cat = ''; estado.sub = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.materiales.clear(); estado.medidas.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'medida' ? estado.medidas : estado.materiales;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    if (f === 'cat') estado.sub = '';
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      if (b.dataset.filtro === 'cat') estado.sub = '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'material') estado.materiales.delete(quitar.dataset.valor);
      else if (f === 'medida') estado.medidas.delete(quitar.dataset.valor);
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
  const filtrosFijos = () => filtros && getComputedStyle(filtros).position === 'fixed';
  if (filtrosFijos()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  filtros?.addEventListener('scroll', () => filtros.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), { passive: true });
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat };
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
  paso('.hero-ctas .btn, .hero-buscar', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-chips .chip-busca', { y: 14, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.75);
  paso('.sello, .hero-etiqueta', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
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
  initRails,
  initVistaPrevia,
  initListaDestacados,
  initIndice,
  initPreciosSueltos,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initSugerencias,
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
