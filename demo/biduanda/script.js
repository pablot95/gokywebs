const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493402552402';
const ES_M2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FOTOS = {
  '01': { src: 'images/biduanda_01_vertical_9x16.webp', w: 941, h: 1672 },
  '02': { src: 'images/biduanda_02_horizontal_16x9.webp', w: 1672, h: 941 },
  '03': { src: 'images/biduanda_03_macetas_1x1.webp', w: 1254, h: 1254 },
  '04': { src: 'images/biduanda_04_sustratos_fertilizantes_1x1.webp', w: 1254, h: 1254 },
  '05': { src: 'images/biduanda_05_kokedamas_1x1.webp', w: 1254, h: 1254 },
  '06': { src: 'images/biduanda_06_taller_kokedamas_1x1.webp', w: 1254, h: 1254 }
};

const CATS = { plantas: 'Plantas', macetas: 'Macetas', sustratos: 'Sustratos y fertilizantes', kokedamas: 'Kokedamas' };
const CAT_CORTA = { plantas: 'Planta', macetas: 'Maceta', sustratos: 'Para la tierra', kokedamas: 'Kokedama', talleres: 'Taller' };
const LUZ = { sol: 'Sol directo', clara: 'Luz clara', sombra: 'Media sombra' };
const RIEGO = { poco: 'Poco riego', medio: 'Riego medio', seguido: 'Riego seguido' };
const SECTORES = [
  { id: '02', nombre: 'La mesa', alt: 'La mesa grande del vivero', aria: 'la mesa grande' },
  { id: '01', nombre: 'Invernadero', alt: 'El invernadero del vivero', aria: 'el invernadero' },
  { id: '03', nombre: 'Macetas', alt: 'El estante de las macetas', aria: 'el estante de macetas' },
  { id: '04', nombre: 'Tierra', alt: 'La mesa de sustratos y fertilizantes', aria: 'la mesa de tierra y abono' },
  { id: '05', nombre: 'Kokedamas', alt: 'Las kokedamas colgadas y sobre la mesa', aria: 'el rincón de las kokedamas' }
];
const TIP_KOKE = 'Sumergí la bola en agua 10 minutos cuando la sientas liviana (cada 5 a 7 días) y dejala escurrir antes de colgarla.';

const PRODUCTOS = [
  { id: 'monstera', cat: 'plantas', nombre: 'Monstera deliciosa', precio: 28500, descuento: 0, stock: 6, foto: '02', foco: [0.14, 0.28, 1.9],
    luz: ['clara'], riego: 'medio', mascotas: false, facil: true, medida: 'Maceta N°20 · 60 a 80 cm de alto',
    desc: 'La de las hojas con cortes. Con luz clara y sin sol fuerte, saca una hoja nueva cada pocas semanas.',
    tips: ['Regá cuando la tierra de arriba esté seca, más o menos cada 7 a 10 días.', 'Pasale un paño húmedo a las hojas para sacarles el polvo.'],
    alt: 'Monstera de hojas grandes y recortadas', pins: [['02', 0.15, 0.24], ['01', 0.2, 0.18]] },
  { id: 'k-estromante', cat: 'kokedamas', nombre: 'Kokedama colgante de estromante', precio: 21500, descuento: 0, stock: 3, foto: '05', foco: [0.84, 0.37, 2.7],
    luz: ['clara'], riego: 'medio', mascotas: true, medida: 'Bola de 15 cm · con hilo para colgar',
    desc: 'Hojas verdes, crema y rosa que de noche se levantan. La más colorida del vivero, lista para colgar.',
    tips: [TIP_KOKE, 'Luz clara sin sol directo, para que no pierda el rosado.'],
    alt: 'Kokedama colgante de estromante con hojas verdes, crema y rosa', pins: [['05', 0.84, 0.35]] },
  { id: 'm-mostaza', cat: 'macetas', nombre: 'Maceta esmaltada mostaza', precio: 12500, descuento: 0, stock: 6, foto: '03', foco: [0.885, 0.79, 3.8],
    medida: 'N°18 · cerámica esmaltada con agujero',
    desc: 'Amarillo mostaza brillante. Con una planta de hojas verde oscuro adentro, queda de revista.',
    tips: ['Tiene agujero de drenaje: usala con un plato abajo.'],
    alt: 'Maceta de cerámica esmaltada color mostaza', pins: [['03', 0.89, 0.71]] },
  { id: 'orquidea', cat: 'plantas', nombre: 'Orquídea Phalaenopsis', corto: 'Orquídea', precio: 24900, descuento: 0, stock: 5, foto: '02', foco: [0.665, 0.31, 2.2],
    luz: ['clara'], riego: 'poco', mascotas: true, medida: 'Maceta N°12 · dos varas en flor',
    desc: 'Flores rosas que duran entre dos y tres meses. Va en corteza de pino, no en tierra.',
    tips: ['Regá por inmersión cada 7 a 10 días, cuando las raíces se ven plateadas.', 'Al lado de una ventana con cortina: luz clara, sin sol directo.'],
    alt: 'Orquídea Phalaenopsis con flores rosas', pins: [['02', 0.67, 0.24], ['01', 0.16, 0.39]] },
  { id: 'sustrato', cat: 'sustratos', nombre: 'Sustrato universal con perlita', precio: 4900, descuento: 0, stock: 25, foto: '04', foco: [0.47, 0.52, 2.4],
    medida: 'Turba, compost y perlita', varTitulo: 'Tamaño de la bolsa', varCorto: 'tamaño',
    vars: [{ id: '10', label: '10 litros', precio: 4900 }, { id: '25', label: '25 litros', precio: 9900 }, { id: '50', label: '50 litros', precio: 17500 }],
    desc: 'Liviano y aireado, con perlita para que drene. Sirve para casi todas las plantas de interior y de balcón.',
    tips: ['Para trasplantar una maceta N°20 alcanza con la bolsa de 10 litros.'],
    alt: 'Bolsa abierta de sustrato oscuro con perlita', pins: [['04', 0.47, 0.4]] },
  { id: 'espatifilo', cat: 'plantas', nombre: 'Espatifilo (cuna de Moisés)', corto: 'Espatifilo', precio: 13900, descuento: 0, stock: 9, foto: '01', foco: [0.56, 0.34, 1.95],
    luz: ['sombra', 'clara'], riego: 'medio', mascotas: false, facil: true, medida: 'Maceta N°17 · 50 cm de alto',
    desc: 'Flores blancas y hojas brillantes. Avisa cuando tiene sed: baja las hojas y se levanta apenas la regás.',
    tips: ['Regá cuando veas las hojas un poco caídas o la tierra seca arriba.', 'Con luz clara florece más.'],
    alt: 'Espatifilo con flores blancas y hojas brillantes', pins: [['01', 0.56, 0.24]] },
  { id: 'k-hipoestes', cat: 'kokedamas', nombre: 'Kokedama de hipoestes', precio: 13900, descuento: 0, stock: 7, foto: '05', foco: [0.45, 0.8, 3.3],
    luz: ['clara'], riego: 'seguido', mascotas: true, medida: 'Bola de 11 cm · con base de madera',
    desc: 'Hojas rosas con pintitas verdes. Chiquita y alegre, para un escritorio o una mesa de luz.',
    tips: [TIP_KOKE],
    alt: 'Kokedama de hipoestes de hojas rosas sobre una rodaja de madera', pins: [['05', 0.45, 0.77]] },
  { id: 'm-relieve', cat: 'macetas', nombre: 'Maceta esmaltada con relieve de hojas', precio: 11900, descuento: 0, stock: 8, foto: '02', foco: [0.37, 0.5, 3.3],
    medida: 'Cerámica verde botella con agujero', varTitulo: 'Tamaño', varCorto: 'tamaño',
    vars: [{ id: '14', label: 'N°14', precio: 11900 }, { id: '20', label: 'N°20', precio: 18900 }],
    desc: 'Cerámica verde botella con hojas en relieve. Se luce sola o con una planta de hojas grandes.',
    tips: ['La N°20 le queda justa a una monstera o a un espatifilo.'],
    alt: 'Maceta de cerámica verde esmaltada con hojas en relieve', pins: [['02', 0.37, 0.44]] },
  { id: 'sansevieria', cat: 'plantas', nombre: 'Sansevieria (lengua de suegra)', precio: 14500, descuento: 0, stock: 10, foto: '03', foco: [0.68, 0.33, 2.2],
    luz: ['sol', 'clara', 'sombra'], riego: 'poco', mascotas: false, facil: true, medida: 'Maceta N°20 · 60 cm de alto',
    desc: 'Hojas firmes con bordes amarillos. Se banca la sombra, el sol y los olvidos: casi imposible de matar.',
    tips: ['Regá cada 2 o 3 semanas, y menos en invierno.', 'El único error posible es regarla de más.'],
    alt: 'Sansevieria de hojas largas con bordes amarillos en maceta de barro', pins: [['03', 0.68, 0.2]] },
  { id: 'fert-liquido', cat: 'sustratos', nombre: 'Fertilizante líquido', precio: 6500, descuento: 0, stock: 20, foto: '04', foco: [0.73, 0.57, 3.3],
    medida: 'Botella de 500 ml', varTitulo: 'Tipo', varCorto: 'tipo',
    vars: [{ id: 'crecimiento', label: 'Crecimiento' }, { id: 'floracion', label: 'Floración' }],
    desc: 'Se mezcla con el agua del riego cada 15 días en primavera y verano. Crecimiento para hojas, floración para plantas con flor.',
    tips: ['Una tapita cada litro de agua. En invierno, no hace falta.'],
    alt: 'Botellas blancas de fertilizante líquido con tapa verde y tapa amarilla', pins: [['04', 0.72, 0.47], ['02', 0.645, 0.58]] },
  { id: 'anturio', cat: 'plantas', nombre: 'Anturio', precio: 16900, descuento: 0, stock: 9, foto: '02', foco: [0.245, 0.48, 2.6],
    luz: ['clara'], riego: 'medio', mascotas: false, medida: 'Maceta N°14 · 35 a 45 cm de alto', varTitulo: 'Color de la flor', varCorto: 'color',
    vars: [{ id: 'rosa', label: 'Rosa', foto: '02', foco: [0.245, 0.48, 2.6] }, { id: 'rojo', label: 'Rojo', foto: '01', foco: [0.78, 0.51, 3.1] }],
    desc: 'Sus flores duran semanas y vuelven a salir todo el año si tiene luz clara y el aire no está muy seco.',
    tips: ['Regá una vez por semana, sin dejar agua en el plato.', 'Rociá las hojas en los días de calefacción.'],
    alt: 'Anturio con flores en forma de corazón', pins: [['02', 0.25, 0.44, 'rosa'], ['01', 0.76, 0.47, 'rojo']] },
  { id: 'k-asplenio', cat: 'kokedamas', nombre: 'Kokedama colgante de asplenio', precio: 18900, descuento: 0, stock: 4, foto: '05', foco: [0.52, 0.32, 2.6],
    luz: ['sombra'], riego: 'medio', mascotas: true, medida: 'Bola de 14 cm · con hilo para colgar',
    desc: 'Helecho nido de ave en una bola de musgo, lista para colgar. Hojas onduladas de un verde brillante.',
    tips: [TIP_KOKE],
    alt: 'Kokedama colgante de helecho nido de ave', pins: [['05', 0.52, 0.32]] },
  { id: 'echeveria', cat: 'plantas', nombre: 'Echeveria', precio: 3900, descuento: 0, stock: 20, foto: '01', foco: [0.36, 0.735, 3.6],
    luz: ['sol'], riego: 'poco', mascotas: true, facil: true, medida: 'Maceta N°10 · roseta de 8 cm',
    desc: 'Roseta gris celeste de hojas carnosas. Quiere sol y muy poca agua: la suculenta para empezar.',
    tips: ['Regá solo cuando la tierra esté seca del todo.', 'Con sustrato que drene rápido, o mezclado con perlita.'],
    alt: 'Echeverias en una maceta rosa acanalada', pins: [['02', 0.585, 0.65], ['01', 0.36, 0.7]] },
  { id: 'm-confeti', cat: 'macetas', nombre: 'Maceta confeti', precio: 8900, descuento: 10, stock: 9, foto: '03', foco: [0.7, 0.78, 3.9],
    medida: 'N°14 · cerámica con pintitas de colores',
    desc: 'Base blanca con pintitas de colores, como un helado de confites. Para alegrar un estante.',
    tips: ['Tiene agujero de drenaje: usala con un plato abajo.'],
    alt: 'Maceta blanca con pintitas de colores', pins: [['03', 0.7, 0.72]] },
  { id: 'potus', cat: 'plantas', nombre: 'Potus', precio: 7500, descuento: 0, stock: 16, foto: '01', foco: [0.16, 0.82, 2.5],
    luz: ['sombra', 'clara'], riego: 'medio', mascotas: false, facil: true, medida: 'Maceta N°14 · guías de 40 cm', varTitulo: 'Variedad', varCorto: 'variedad',
    vars: [{ id: 'neon', label: 'Neón', foto: '01', foco: [0.16, 0.82, 2.5] }, { id: 'marmolado', label: 'Marmolado', foto: '04', foco: [0.15, 0.55, 3.0] }],
    desc: 'El más fácil de todos: crece en cualquier rincón con un poco de luz y se puede guiar o dejar colgar.',
    tips: ['Regá cuando la tierra esté seca arriba.', 'Si las guías se estiran mucho, cortalas y ponelas en agua: echan raíz.'],
    alt: 'Potus de hojas en forma de corazón', pins: [['01', 0.14, 0.78, 'neon'], ['04', 0.15, 0.5, 'marmolado']] },
  { id: 'corteza', cat: 'sustratos', nombre: 'Corteza de pino', precio: 4500, descuento: 0, stock: 15, foto: '04', foco: [0.63, 0.32, 3.3],
    medida: 'Bolsa de 5 litros',
    desc: 'El sustrato de las orquídeas. También sirve para cubrir la tierra de las macetas y que no se seque tan rápido.',
    tips: ['Para orquídeas, remojala una hora antes de usarla.'],
    alt: 'Bolsa abierta de corteza de pino en trozos', pins: [['04', 0.63, 0.27], ['02', 0.83, 0.33]] },
  { id: 'zamioculca', cat: 'plantas', nombre: 'Zamioculca', precio: 16500, descuento: 0, stock: 7, foto: '03', foco: [0.87, 0.48, 3.0],
    luz: ['sombra', 'clara'], riego: 'poco', mascotas: false, facil: true, medida: 'Maceta N°17 · 45 cm de alto',
    desc: 'Hojas brillantes, como enceradas. Guarda agua en la raíz y aguanta rincones con poca luz.',
    tips: ['Regá cada 15 días, cuando la tierra esté seca.', 'Crece lento: no hace falta trasplantarla seguido.'],
    alt: 'Zamioculca de hojas brillantes en maceta blanca acanalada', pins: [['03', 0.88, 0.36]] },
  { id: 'k-culantrillo', cat: 'kokedamas', nombre: 'Kokedama de culantrillo', precio: 17900, descuento: 0, stock: 5, foto: '05', foco: [0.75, 0.74, 2.6],
    luz: ['sombra'], riego: 'seguido', mascotas: true, medida: 'Bola de 14 cm · con base de madera',
    desc: 'Helecho de hojitas finas y tallos negros. Le encanta la humedad: ideal para un baño con ventana.',
    tips: [TIP_KOKE, 'No dejes que la bola se seque del todo.'],
    alt: 'Kokedama de culantrillo sobre una rodaja de madera', pins: [['05', 0.73, 0.7]] },
  { id: 'fitonia', cat: 'plantas', nombre: 'Fitonia', precio: 5900, descuento: 0, stock: 14, foto: '02', foco: [0.385, 0.6, 3.4],
    luz: ['sombra'], riego: 'seguido', mascotas: true, medida: 'Maceta N°10 · 15 cm de alto',
    desc: 'Hojas con nervaduras rosas, como pintadas a mano. Chiquita, ideal para un escritorio o un terrario.',
    tips: ['Le gusta la tierra apenas húmeda: si se desmaya, regá y en una hora se levanta.'],
    alt: 'Fitonia de hojas con nervaduras rosas', pins: [['02', 0.385, 0.56]] },
  { id: 'm-terracota', cat: 'macetas', nombre: 'Maceta de terracota', precio: 2900, descuento: 0, stock: 30, foto: '03', foco: [0.35, 0.47, 2.9],
    medida: 'Barro cocido con agujero', varTitulo: 'Tamaño', varCorto: 'tamaño',
    vars: [{ id: '12', label: 'N°12', precio: 2900 }, { id: '16', label: 'N°16', precio: 4500 }, { id: '24', label: 'N°24', precio: 8900 }],
    desc: 'La de toda la vida. El barro respira y deja secar la tierra más rápido: ideal para suculentas y cactus.',
    tips: ['Mojala antes de trasplantar para que no le robe agua a la tierra.'],
    alt: 'Maceta de terracota con una planta de hojas verdes', pins: [['03', 0.35, 0.42]] },
  { id: 'collar', cat: 'plantas', nombre: 'Collar de perlas', precio: 8900, descuento: 0, stock: 10, foto: '01', foco: [0.72, 0.75, 3.0],
    luz: ['clara'], riego: 'poco', mascotas: false, medida: 'Maceta colgante N°14 · tiras de 30 cm',
    desc: 'Tiras de bolitas verdes que caen del estante. Guarda agua en cada perla, así que pide poco riego.',
    tips: ['Regá cada 10 a 14 días, cuando las perlas se ven un poco arrugadas.', 'Un rato de sol suave de mañana le hace bien.'],
    alt: 'Collar de perlas colgando de un banco de madera', pins: [['02', 0.3, 0.64], ['01', 0.7, 0.66]] },
  { id: 'perlita', cat: 'sustratos', nombre: 'Perlita', precio: 4200, descuento: 0, stock: 18, foto: '04', foco: [0.32, 0.68, 3.8],
    medida: 'Bolsa de 5 litros',
    desc: 'Piedritas blancas y livianas que se mezclan con la tierra para que no se apelmace y drene mejor.',
    tips: ['Una parte de perlita cada tres de sustrato, para suculentas y cactus.'],
    alt: 'Bol de madera con perlita blanca', pins: [['04', 0.32, 0.64]] },
  { id: 'k-potus', cat: 'kokedamas', nombre: 'Kokedama de potus', precio: 15900, descuento: 0, stock: 6, foto: '05', foco: [0.17, 0.7, 2.7],
    luz: ['sombra', 'clara'], riego: 'medio', mascotas: false, facil: true, medida: 'Bola de 14 cm · con base de madera',
    desc: 'El potus de siempre en versión kokedama, sobre una rodaja de tronco. La más fácil para arrancar.',
    tips: [TIP_KOKE],
    alt: 'Kokedama de potus sobre una rodaja de madera', pins: [['05', 0.17, 0.68]] },
  { id: 'kalanchoe', cat: 'plantas', nombre: 'Kalanchoe', precio: 5500, descuento: 15, stock: 12, foto: '01', foco: [0.44, 0.535, 3.1],
    luz: ['sol'], riego: 'poco', mascotas: false, medida: 'Maceta N°12 · en flor',
    desc: 'Ramilletes de flores coral que duran semanas. Planta de sol, de las que perdonan un olvido.',
    tips: ['Regá cada 10 días: entre riego y riego, que la tierra se seque.', 'Sacale las flores secas para que vuelva a florecer.'],
    alt: 'Kalanchoe con flores coral en maceta de barro', pins: [['01', 0.44, 0.5]] },
  { id: 'm-petroleo', cat: 'macetas', nombre: 'Maceta petróleo acanalada con plato', precio: 13900, descuento: 0, stock: 5, foto: '03', foco: [0.18, 0.7, 3.5],
    medida: 'N°16 · cerámica esmaltada con plato',
    desc: 'Verde petróleo con canaletas verticales y plato al tono, que junta el agua del riego.',
    tips: ['Vaciá el plato media hora después de regar.'],
    alt: 'Maceta acanalada verde petróleo con plato', pins: [['03', 0.18, 0.63]] },
  { id: 'aglaonema', cat: 'plantas', nombre: 'Aglaonema', precio: 15500, descuento: 0, stock: 7, foto: '02', foco: [0.515, 0.39, 2.5],
    luz: ['sombra', 'clara'], riego: 'medio', mascotas: false, facil: true, medida: 'Maceta N°17 · 40 a 50 cm de alto',
    desc: 'Hojas verdes con vetas claras y bordes rosados. Aguanta rincones con poca luz sin perder el color.',
    tips: ['Regá cuando los primeros 2 cm de tierra estén secos.', 'Lejos de las corrientes de aire frío.'],
    alt: 'Aglaonema de hojas verdes con vetas claras', pins: [['02', 0.52, 0.32]] },
  { id: 'k-muehlenbeckia', cat: 'kokedamas', nombre: 'Kokedama colgante de muehlenbeckia', precio: 16900, descuento: 0, stock: 5, foto: '05', foco: [0.25, 0.3, 2.6],
    luz: ['clara'], riego: 'seguido', mascotas: true, medida: 'Bola de 13 cm · con hilo para colgar',
    desc: 'Una cascada de hojitas redondas que cae alrededor de la bola. Queda hermosa en una ventana.',
    tips: [TIP_KOKE],
    alt: 'Kokedama colgante de muehlenbeckia de hojitas redondas', pins: [['05', 0.25, 0.3]] },
  { id: 'fert-granulado', cat: 'sustratos', nombre: 'Fertilizante granulado de liberación lenta', precio: 7200, descuento: 0, stock: 3, foto: '02', foco: [0.74, 0.68, 3.6],
    medida: 'Frasco de 250 g',
    desc: 'Granitos que se van disolviendo con cada riego y alimentan la planta durante unos tres meses.',
    tips: ['Una cucharadita sobre la tierra de una maceta N°17.'],
    alt: 'Frascos de vidrio con fertilizante granulado', pins: [['02', 0.735, 0.64], ['04', 0.43, 0.74]] },
  { id: 'peperomia', cat: 'plantas', nombre: 'Peperomia sandía', precio: 7900, descuento: 0, stock: 4, foto: '03', foco: [0.56, 0.7, 3.5],
    luz: ['clara'], riego: 'poco', mascotas: true, medida: 'Maceta N°12 · 20 cm de alto',
    desc: 'Hojas redondas con rayas plateadas, igual que una sandía. Chiquita y fácil, para una mesa de luz.',
    tips: ['Regá cuando la tierra esté seca hasta la mitad de la maceta.', 'Luz clara sin sol directo.'],
    alt: 'Peperomia sandía de hojas rayadas en maceta rosa y blanca', pins: [['03', 0.56, 0.63]] },
  { id: 'cactus', cat: 'plantas', nombre: 'Cactus bola', corto: 'Cactus', precio: 4200, descuento: 0, stock: 15, foto: '01', foco: [0.545, 0.7, 3.6],
    luz: ['sol'], riego: 'poco', mascotas: false, facil: true, medida: 'Maceta N°10 · 10 cm de alto',
    desc: 'Redondo y con espinas doradas. Sol pleno y agua casi nunca: aguanta vacaciones largas.',
    tips: ['En verano, un riego cada dos o tres semanas; en invierno, casi nada.', 'Cuidado con las espinas si hay chicos o mascotas.'],
    alt: 'Cactus redondo con espinas doradas en maceta clara', pins: [['01', 0.545, 0.66]] },
  { id: 'm-terrazo', cat: 'macetas', nombre: 'Maceta terrazo blanca', precio: 9500, descuento: 0, stock: 10, foto: '03', foco: [0.405, 0.7, 3.8],
    medida: 'N°16 · cemento con granito',
    desc: 'Cemento claro con granitos negros. Pesada y firme: ideal para plantas que crecen alto.',
    tips: ['Tiene agujero de drenaje: usala con un plato abajo.'],
    alt: 'Maceta blanca de terrazo con granitos negros', pins: [['03', 0.41, 0.63], ['02', 0.23, 0.64]] },
  { id: 'mezcla-interior', cat: 'sustratos', nombre: 'Mezcla para plantas de interior', precio: 5900, descuento: 0, stock: 12, foto: '02', foco: [0.91, 0.54, 3.9],
    medida: 'Bolsa de 5 litros',
    desc: 'Con corteza y perlita, para monsteras, potus, filodendros y todas las de hoja grande.',
    tips: ['Ideal para el trasplante de primavera.'],
    alt: 'Bolsa transparente de sustrato oscuro con perlita', pins: [['02', 0.91, 0.48]] },
  { id: 'helecho', cat: 'plantas', nombre: 'Helecho serrucho', corto: 'Helecho', precio: 11900, descuento: 0, stock: 8, foto: '01', foco: [0.84, 0.9, 2.9],
    luz: ['sombra'], riego: 'seguido', mascotas: true, medida: 'Canasto N°17 · 40 cm de alto',
    desc: 'Frondas largas y arqueadas, de un verde bien vivo. Se luce colgado o arriba de un mueble.',
    tips: ['Tierra siempre apenas húmeda, nunca encharcada.', 'Rocialo seguido si el ambiente es seco.'],
    alt: 'Helecho serrucho de frondas largas en un canasto', pins: [['02', 0.93, 0.3], ['01', 0.84, 0.86]] },
  { id: 'taller', cat: 'talleres', nombre: 'Taller de kokedamas', precio: 26000, descuento: 0, stock: 99, foto: '06', foco: [0.4, 0.34, 1.8], oculto: true,
    medida: '2 horas · incluye planta y materiales', desc: '', alt: 'Taller de kokedamas' }
];

const TALLER = {
  cupo: 10,
  horarios: { 3: ['18:30', '20:30'], 6: ['10:30', '12:30'] },
  plantas: [
    { id: 'helecho', nombre: 'Helecho', foto: '06', foco: [0.4, 0.3, 3.1] },
    { id: 'fitonia', nombre: 'Fitonia', foto: '06', foco: [0.86, 0.45, 3.3] },
    { id: 'potus', nombre: 'Potus', foto: '05', foco: [0.17, 0.7, 2.7] },
    { id: 'hipoestes', nombre: 'Hipoestes', foto: '05', foco: [0.45, 0.8, 3.3] }
  ]
};

const LUCES = [
  { id: 'sol', lux: 30000, bg: [255, 246, 220], em: '#B45309', b: 1.1, s: 1.22, so: 1, vo: 0, sx: 84, sy: 6, foco: [0.46, 0.6], pins: ['kalanchoe', 'echeveria', 'cactus'] },
  { id: 'clara', lux: 5000, bg: [241, 247, 237], em: '#15803D', b: 1, s: 1.04, so: .35, vo: .12, sx: 62, sy: 20, foco: [0.46, 0.52], pins: ['orquidea', 'anturio', 'collar'] },
  { id: 'sombra', lux: 800, bg: [225, 235, 228], em: '#0F766E', b: .8, s: .84, so: 0, vo: .7, sx: 30, sy: 40, foco: [0.5, 0.8], pins: ['espatifilo', 'potus', 'helecho'] }
];

const DIAS_JS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const byId = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const isoDe = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fechaDeIso = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const fechaLarga = d => `${DIAS_JS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

const varDef = p => (p.vars && p.vars.length ? p.vars[0].id : '');
const getVar = (p, v) => (p.vars || []).find(x => x.id === v) || null;
const precioBase = (p, v) => { const x = getVar(p, v); return x && x.precio ? x.precio : p.precio; };
const precioFinal = (p, v = varDef(p)) => { const b = precioBase(p, v); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const variaPrecio = p => !!(p.vars && new Set(p.vars.map(x => x.precio || p.precio)).size > 1);
const precioDesde = p => (p.vars ? Math.min(...p.vars.map(x => precioFinal(p, x.id))) : precioFinal(p));
const fotoDe = (p, v) => { const x = getVar(p, v); return x && x.foto ? { foto: x.foto, foco: x.foco } : { foto: p.foto, foco: p.foco }; };
const VISIBLES = PRODUCTOS.filter(p => !p.oculto);

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId] || { w: 1, h: 1 };
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / f.w, 1 / f.h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = f.w > vw + 0.5 ? clamp01((cx * f.w - vw / 2) / (f.w - vw)) : 0.5;
  const py = f.h > vh + 0.5 ? clamp01((cy * f.h - vh / 2) / (f.h - vh)) : 0.5;
  const x0 = (f.w - vw) * px;
  const y0 = (f.h - vh) * py;
  const fx = z > 1 ? clamp01((cx * f.w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * f.h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fotoHTML(fotoId, foco, ar, clase = '', extra = '', alt = '') {
  const f = FOTOS[fotoId];
  return `<div class="recorte ${clase}"${extra} style="${recorte(fotoId, foco, ar)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(alt)}"></div>`;
}

/* ---------- taller: fechas y cupos ---------- */
function proximasFechas(n = 4) {
  const res = [];
  const ahora = new Date();
  const base = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 12);
  for (let k = 0; k < 60 && res.length < n; k++) {
    const dia = new Date(base);
    dia.setDate(base.getDate() + k);
    const h = TALLER.horarios[dia.getDay()];
    if (!h) continue;
    const [hh, mm] = h[0].split(':').map(Number);
    const inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hh, mm);
    if (inicio - ahora < 2 * 3600 * 1000) continue;
    res.push({ iso: isoDe(dia), fecha: dia, desde: h[0], hasta: h[1] });
  }
  return res;
}
const FECHAS = proximasFechas(4);
const ocupadosDe = iso => { const [, m, d] = iso.split('-').map(Number); return 3 + ((d * 5 + m * 3) % 6); };
const tallerPlanta = id => TALLER.plantas.find(x => x.id === id);
const partesTaller = v => { const [iso, planta] = String(v || '').split('|'); return { iso, planta }; };
function tallerLabel(v) {
  const { iso, planta } = partesTaller(v);
  const f = FECHAS.find(x => x.iso === iso);
  const d = fechaDeIso(iso || '2000-01-01');
  const hora = f ? f.desde : (TALLER.horarios[d.getDay()] || [''])[0];
  const pl = tallerPlanta(planta);
  return `${mayus(DIAS_CORTOS[d.getDay()])} ${d.getDate()}/${d.getMonth() + 1} · ${hora}${pl ? ` · con ${pl.nombre.toLowerCase()}` : ''}`;
}
function varLabel(p, v) {
  if (p.id === 'taller') return tallerLabel(v);
  const x = getVar(p, v);
  return x ? x.label : '';
}

/* ---------- carrito ---------- */
const Cart = {
  KEY: 'biduanda_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  enTaller(iso) { return this.get().filter(i => i.id === 'taller' && partesTaller(i.v).iso === iso).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const suma = Math.max(0, Math.min(qty, stockLibre(producto, v)));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.v || '') === v);
    const p = getProducto(id);
    if (!it || !p) return;
    it.qty = Math.max(1, Math.min(qty, it.qty + stockLibre(p, v)));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); }
};

function stockLibre(p, v) {
  if (!p) return 0;
  if (p.id === 'taller') {
    const { iso } = partesTaller(v);
    if (!FECHAS.some(f => f.iso === iso)) return 0;
    return Math.max(0, TALLER.cupo - ocupadosDe(iso) - Cart.enTaller(iso));
  }
  return Math.max(0, p.stock - Cart.enCarrito(p.id));
}

function sanearCarrito() {
  let items;
  try { items = JSON.parse(localStorage.getItem(Cart.KEY)) || []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  const limpios = [];
  items.forEach(i => {
    const p = i && getProducto(i.id);
    if (!p) return;
    let v = String(i.v || '');
    if (p.id === 'taller') {
      const { iso, planta } = partesTaller(v);
      if (!FECHAS.some(f => f.iso === iso) || !tallerPlanta(planta)) return;
      const ya = limpios.filter(x => x.id === 'taller' && partesTaller(x.v).iso === iso).reduce((s, x) => s + x.qty, 0);
      const qty = Math.min(Math.max(1, Number(i.qty) || 1), TALLER.cupo - ocupadosDe(iso) - ya);
      if (qty > 0) limpios.push({ id: 'taller', v, qty });
      return;
    }
    if (p.stock <= 0) return;
    if (p.vars) { if (!getVar(p, v)) v = varDef(p); } else v = '';
    const ya = limpios.filter(x => x.id === p.id).reduce((s, x) => s + x.qty, 0);
    const qty = Math.min(Math.max(1, Number(i.qty) || 1), p.stock - ya);
    if (qty <= 0) return;
    const igual = limpios.find(x => x.id === p.id && x.v === v);
    if (igual) igual.qty += qty; else limpios.push({ id: p.id, v, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { limpios.length = 0; }
}

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

/* ---------- íconos ---------- */
const IC = {
  sol: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  clara: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.95 12.65a4 4 0 0 0-5.93-4.13"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>',
  sombra: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
  riego: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  mascotas: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>',
  carrito: '<svg class="lbl-icon ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/><circle cx="9.5" cy="20" r="1.5" class="ic-fill"/><circle cx="17.5" cy="20" r="1.5" class="ic-fill"/></svg>'
};

function cuidaHTML(p) {
  if (!p.luz) return '';
  const l = p.luz[0];
  const items = [
    `<li class="c-${l}">${IC[l]}<span>${esc(LUZ[l])}</span></li>`,
    p.riego ? `<li class="c-riego">${IC.riego}<span>${esc(RIEGO[p.riego])}</span></li>` : '',
    p.mascotas ? `<li class="c-mascotas">${IC.mascotas}<span>Apta mascotas</span></li>` : ''
  ];
  return `<ul class="cuida" aria-label="Cuidados">${items.join('')}</ul>`;
}

function precioHTML(p, v) {
  const desde = v === undefined && variaPrecio(p);
  const vv = v === undefined ? varDef(p) : v;
  const f = desde ? precioDesde(p) : precioFinal(p, vv);
  const tachado = p.descuento > 0 && !desde ? `<s class="precio__o">${formatearPrecio(precioBase(p, vv))}</s>` : '';
  return `<p class="precio">${desde ? '<span class="precio__desde">desde</span>' : ''}<span class="precio__f">${formatearPrecio(f)}</span>${tachado}</p>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">−${p.descuento}%</span>`);
  if (p.stock <= 0) b.push('<span class="badge badge--sin">Sin stock</span>');
  else if (p.stock <= 3) b.push(`<span class="badge badge--poco">Quedan ${p.stock}</span>`);
  if (b.length < 2 && p.facil) b.push('<span class="badge badge--facil">Fácil</span>');
  return b.slice(0, 2).join('');
}

function stepperHTML(id) {
  return `<div class="stepper" data-stepper="${id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

function accionesHTML(p) {
  if (p.stock <= 0) return '<button type="button" class="btn btn--line btn--sm prod-add" disabled>Sin stock</button>';
  if (p.vars) return `<button type="button" class="btn btn--solid btn--sm prod-add card__add card__add--var" data-quick="${p.id}" aria-label="Elegir ${esc(p.varCorto || 'opción')}: ${esc(p.nombre)}">${IC.carrito}<span class="lbl-var">Elegir<span class="lbl-extra"> ${esc(p.varCorto || 'opción')}</span></span></button>`;
  const libre = stockLibre(p, '');
  return `${stepperHTML(p.id)}<button type="button" class="btn btn--solid btn--sm prod-add card__add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"${libre <= 0 ? ' disabled' : ''}>${IC.carrito}<span class="lbl-long">Agregar</span></button>`;
}

function cardHTML(p, animar = true) {
  const f = fotoDe(p, varDef(p));
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const comprar = p.stock > 0 && !p.vars ? `<button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>` : '';
  const flag = `<span class="flag flag--sm flag--${p.cat}">${esc(CAT_CORTA[p.cat])}</span>`;
  if (!ES_M2) {
    return `<article class="fila cat-${p.cat}" data-id="${p.id}"${anim}>
      <div class="fila__media">${fotoHTML(f.foto, f.foco, 1, '', ` data-quick="${p.id}"`, p.alt)}</div>
      <div class="fila__body">
        <div class="fila__top">${flag}${badgesHTML(p)}</div>
        <h3 class="fila__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
        <p class="fila__meta">${esc(p.medida)}</p>
        ${cuidaHTML(p)}
      </div>
      <div class="fila__side">
        ${precioHTML(p)}
        <div class="prod-actions">${accionesHTML(p)}</div>
        ${comprar}
        <button type="button" class="ver-mapa" data-ver-mapa="${p.id}">Ver en el mapa del vivero</button>
      </div>
    </article>`;
  }
  return `<article class="card cat-${p.cat}" data-id="${p.id}"${anim}>
    <div class="card__media">
      ${fotoHTML(f.foto, f.foco, 0.8, '', ` data-quick="${p.id}"`, p.alt)}
      <span class="card__flag">${flag}</span>
      <div class="card__badges">${badgesHTML(p)}</div>
    </div>
    <div class="card__body">
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${p.luz ? cuidaHTML(p) : `<p class="fila__meta">${esc(p.medida)}</p>`}
      <div class="card__pie">
        ${precioHTML(p)}
        <div class="prod-actions">${accionesHTML(p)}</div>
        ${comprar}
      </div>
    </div>
  </article>`;
}

/* ---------- catálogo ---------- */
const PASO = 16;
let visibles = PASO;
const FILTRO = { q: '', cats: new Set(), luz: new Set(), riego: new Set(), precio: new Set(), mascotas: false, orden: 'recomendados' };
const RANGOS = { hasta8: [0, 8000], de8a16: [8001, 16000], mas16: [16001, Infinity] };
const RANGOS_TXT = { hasta8: 'Hasta $8.000', de8a16: '$8.000 a $16.000', mas16: 'Más de $16.000' };

function textoDe(p) {
  return normal([p.nombre, CATS[p.cat], CAT_CORTA[p.cat], p.cat === 'plantas' ? '' : p.medida, p.desc, ...(p.luz || []).map(l => LUZ[l]), p.riego ? RIEGO[p.riego] : '',
    ...(p.vars || []).map(x => x.label), p.mascotas ? 'apta mascotas perro gato' : '', p.facil ? 'facil principiante' : ''].join(' '));
}

function filtrar() {
  const palabras = normal(FILTRO.q).split(/\s+/).filter(Boolean);
  let lista = VISIBLES.filter(p => {
    if (FILTRO.cats.size && !FILTRO.cats.has(p.cat)) return false;
    if (FILTRO.luz.size && !(p.luz || []).some(l => FILTRO.luz.has(l))) return false;
    if (FILTRO.riego.size && !FILTRO.riego.has(p.riego)) return false;
    if (FILTRO.mascotas && !p.mascotas) return false;
    if (FILTRO.precio.size && ![...FILTRO.precio].some(r => { const [a, b] = RANGOS[r]; const f = precioDesde(p); return f >= a && f <= b; })) return false;
    if (palabras.length) { const t = textoDe(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  if (FILTRO.orden === 'menor') lista = lista.slice().sort((a, b) => precioDesde(a) - precioDesde(b));
  else if (FILTRO.orden === 'mayor') lista = lista.slice().sort((a, b) => precioDesde(b) - precioDesde(a));
  return lista;
}

function tituloTienda() {
  const solo = (s, otros) => s.size === 1 && otros.every(o => !o.size);
  if (solo(FILTRO.cats, [FILTRO.luz, FILTRO.riego, FILTRO.precio]) && !FILTRO.q && !FILTRO.mascotas) return CATS[[...FILTRO.cats][0]];
  if (solo(FILTRO.luz, [FILTRO.cats, FILTRO.riego, FILTRO.precio]) && !FILTRO.q && !FILTRO.mascotas) return `Para ${LUZ[[...FILTRO.luz][0]].toLowerCase()}`;
  if (FILTRO.mascotas && !FILTRO.cats.size && !FILTRO.luz.size && !FILTRO.riego.size && !FILTRO.precio.size && !FILTRO.q) return 'Aptas mascotas';
  return 'Todo el vivero';
}

function pintarPills() {
  const cont = byId('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.q) pills.push(['q', '', `«${FILTRO.q}»`]);
  FILTRO.cats.forEach(c => pills.push(['cat', c, CATS[c]]));
  FILTRO.luz.forEach(l => pills.push(['luz', l, LUZ[l]]));
  FILTRO.riego.forEach(r => pills.push(['riego', r, RIEGO[r]]));
  FILTRO.precio.forEach(r => pills.push(['precio', r, RANGOS_TXT[r]]));
  if (FILTRO.mascotas) pills.push(['mascotas', '', 'Aptas mascotas']);
  cont.innerHTML = pills.map(([k, v, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('');
  cont.hidden = !pills.length;
  const clear = byId('f-clear');
  if (clear) clear.hidden = !pills.length;
}

function sincronizarControles() {
  const selects = [['f-cat', FILTRO.cats], ['f-luz', FILTRO.luz], ['f-riego', FILTRO.riego], ['f-precio', FILTRO.precio]];
  selects.forEach(([id, set]) => {
    const s = byId(id);
    if (!s) return;
    s.value = set.size ? [...set][0] : '';
    s.closest('.sel')?.classList.toggle('is-on', set.size > 0);
  });
  document.querySelectorAll('input[data-f="cat"]').forEach(c => { c.checked = FILTRO.cats.has(c.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(c => { c.checked = FILTRO.precio.has(c.value); });
  document.querySelectorAll('.f-chip[data-luz]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.luz.has(b.dataset.luz))));
  document.querySelectorAll('.f-chip[data-riego]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.riego.has(b.dataset.riego))));
  const m = byId('f-mascotas');
  if (m) m.checked = FILTRO.mascotas;
  const q = byId('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = byId('orden');
  if (orden) orden.value = FILTRO.orden;
}

function pintarCatalogo(reiniciar = true, yaVistos = 0) {
  const grid = byId('grid');
  if (!grid) return;
  if (reiniciar) visibles = PASO;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, visibles).map((p, k) => cardHTML(p, k >= yaVistos)).join('');
  const vacio = byId('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const count = byId('cat-count');
  if (count) count.textContent = lista.length ? plural(lista.length, 'producto', 'productos') : 'Sin resultados';
  const tit = byId('t-tienda');
  if (tit) {
    const t = tituloTienda();
    tit.textContent = ES_M2 ? t : (t === 'Todo el vivero' ? 'en el vivero' : t.startsWith('Para') ? t.toLowerCase() : `en ${t.toLowerCase()}`);
  }
  const mas = byId('ver-mas');
  const masN = byId('mas-n');
  const quedan = lista.length - visibles;
  if (mas) {
    mas.hidden = quedan <= 0;
    mas.textContent = `Ver ${Math.min(PASO, Math.max(quedan, 0))} más`;
  }
  if (masN) masN.textContent = quedan > 0 ? `Mostrando ${visibles} de ${lista.length}` : (lista.length > PASO ? `Estás viendo los ${lista.length}` : '');
  const masWrap = mas?.closest('.mas');
  if (masWrap) masWrap.hidden = !lista.length || (quedan <= 0 && lista.length <= PASO);
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  actualizarMapa(lista);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irATienda() {
  const t = byId('filtrar') || byId('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() {
  FILTRO.q = ''; FILTRO.cats = new Set(); FILTRO.luz = new Set(); FILTRO.riego = new Set(); FILTRO.precio = new Set(); FILTRO.mascotas = false;
}

function filtrarPor(tipo, valor, ir = true) {
  resetFiltros();
  if (tipo === 'cat' && CATS[valor]) FILTRO.cats = new Set([valor]);
  if (tipo === 'luz' && LUZ[valor]) FILTRO.luz = new Set([valor]);
  if (!ES_M2) setVista('lista');
  pintarCatalogo();
  if (ir) irATienda();
}

function limpiarFiltros() { resetFiltros(); pintarCatalogo(); }
function toggleSet(set, v) { if (set.has(v)) set.delete(v); else set.add(v); }

function initCatalogo() {
  const grid = byId('grid');
  if (!grid) return;
  const q = byId('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim(); pintarCatalogo(); }, 180); });
  byId('busca-form')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value.trim() : '';
    pintarCatalogo();
    irATienda();
  });
  [['f-cat', 'cats'], ['f-luz', 'luz'], ['f-riego', 'riego'], ['f-precio', 'precio']].forEach(([id, key]) => {
    byId(id)?.addEventListener('change', e => { FILTRO[key] = e.target.value ? new Set([e.target.value]) : new Set(); pintarCatalogo(); });
  });
  document.querySelectorAll('input[data-f="cat"]').forEach(c => c.addEventListener('change', () => { if (c.checked) FILTRO.cats.add(c.value); else FILTRO.cats.delete(c.value); pintarCatalogo(); }));
  document.querySelectorAll('input[data-f="precio"]').forEach(c => c.addEventListener('change', () => { if (c.checked) FILTRO.precio.add(c.value); else FILTRO.precio.delete(c.value); pintarCatalogo(); }));
  document.querySelectorAll('.f-chip[data-luz]').forEach(b => b.addEventListener('click', () => { toggleSet(FILTRO.luz, b.dataset.luz); pintarCatalogo(); }));
  document.querySelectorAll('.f-chip[data-riego]').forEach(b => b.addEventListener('click', () => { toggleSet(FILTRO.riego, b.dataset.riego); pintarCatalogo(); }));
  byId('f-mascotas')?.addEventListener('change', e => { FILTRO.mascotas = e.target.checked; pintarCatalogo(); });
  byId('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  byId('f-clear')?.addEventListener('click', limpiarFiltros);
  byId('f-clear-b')?.addEventListener('click', limpiarFiltros);
  byId('vacio-reset')?.addEventListener('click', limpiarFiltros);
  byId('ver-mas')?.addEventListener('click', () => { const antes = visibles; visibles += PASO; pintarCatalogo(false, antes); });
  byId('pills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro;
    const v = b.dataset.valor || '';
    if (k === 'q') FILTRO.q = '';
    if (k === 'cat') FILTRO.cats.delete(v);
    if (k === 'luz') FILTRO.luz.delete(v);
    if (k === 'riego') FILTRO.riego.delete(v);
    if (k === 'precio') FILTRO.precio.delete(v);
    if (k === 'mascotas') FILTRO.mascotas = false;
    pintarCatalogo();
  });
  const params = new URLSearchParams(location.search);
  let desdeURL = false;
  const cat = params.get('cat');
  const luz = params.get('luz');
  if (cat && CATS[cat]) { FILTRO.cats = new Set([cat]); desdeURL = true; }
  if (luz && LUZ[luz]) { FILTRO.luz = new Set([luz]); desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(irATienda, 60));
}

function pintarConteos() {
  document.querySelectorAll('[data-n]').forEach(el => {
    const [tipo, v] = el.dataset.n.split(':');
    let n = 0;
    if (tipo === 'cat') n = VISIBLES.filter(p => p.cat === v).length;
    if (tipo === 'luz') n = VISIBLES.filter(p => (p.luz || []).includes(v)).length;
    el.textContent = String(n);
  });
}

/* ---------- panel de filtros en celular (modelo B) ---------- */
function initFiltrosPanel() {
  const panel = byId('filtros');
  const toggle = byId('filtrosToggle');
  if (!panel || !toggle) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = null;
  const cerrar = () => {
    panel.classList.remove('open');
    bd?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const abrir = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    panel.removeAttribute('inert');
    panel.classList.add('open');
    bd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  toggle.addEventListener('click', () => (panel.classList.contains('open') ? cerrar() : abrir()));
  byId('filtrosClose')?.addEventListener('click', () => { cerrar(); toggle.focus(); });
  byId('filtrosVer')?.addEventListener('click', () => { cerrar(); irATienda(); });
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); toggle.focus(); }
    if (e.key === 'Tab') trap(e, panel);
  });
  const sync = () => {
    if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrar(); }
  };
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- mapa del vivero (modelo J) ---------- */
const PINS = [];
VISIBLES.forEach(p => (p.pins || []).forEach(([s, x, y, v]) => PINS.push({ id: p.id, v: v || '', s, x, y, cat: p.cat })));
const MAPA = { sector: '02', activo: null, activoV: '', tx: 0, ty: 0, m: null, ids: new Set(VISIBLES.map(p => p.id)) };

function medirEscena(vp, fotoId) {
  const f = FOTOS[fotoId];
  const W = vp.clientWidth;
  const H = vp.clientHeight;
  const a = f.w / f.h;
  let w = W;
  let h = W / a;
  if (h < H) { h = H; w = H * a; }
  return { W, H, w, h };
}

function mapaVisible() {
  const m = byId('mapa');
  return !!(m && m.offsetParent !== null && m.getClientRects().length);
}

function aplicarMapa(anim = true) {
  const stage = byId('mapa-stage');
  const foco = byId('mapa-foco');
  if (!stage || !MAPA.m) return;
  stage.classList.toggle('sin-anim', !anim);
  stage.style.width = `${MAPA.m.w}px`;
  stage.style.height = `${MAPA.m.h}px`;
  stage.style.transform = `translate3d(${MAPA.tx.toFixed(1)}px, ${MAPA.ty.toFixed(1)}px, 0)`;
  if (foco && MAPA.activo) {
    const pin = PINS.find(x => x.id === MAPA.activo && x.s === MAPA.sector && (!MAPA.activoV || !x.v || x.v === MAPA.activoV));
    if (pin) {
      foco.style.setProperty('--fx', `${(MAPA.tx + pin.x * MAPA.m.w).toFixed(0)}px`);
      foco.style.setProperty('--fy', `${(MAPA.ty + (pin.y - 0.04) * MAPA.m.h).toFixed(0)}px`);
    }
  }
  if (!anim) requestAnimationFrame(() => stage.classList.remove('sin-anim'));
}

function centrarMapa(fx, fy, anim = true) {
  const vp = byId('mapa-vp');
  if (!vp) return;
  MAPA.m = medirEscena(vp, MAPA.sector);
  const { W, H, w, h } = MAPA.m;
  MAPA.tx = clamp(W / 2 - fx * w, W - w, 0);
  MAPA.ty = clamp(H / 2 - fy * h, H - h, 0);
  aplicarMapa(anim);
}

function pinHTML(pin, k) {
  const p = getProducto(pin.id);
  const v = pin.v || varDef(p);
  const nombre = pin.v && p.vars ? `${p.nombre} ${varLabel(p, pin.v).toLowerCase()}` : p.nombre;
  const on = MAPA.ids.has(p.id);
  return `<button type="button" class="pin pin--${p.cat}${on ? '' : ' is-off'}${MAPA.activo === p.id ? ' is-activo' : ''}" style="--x:${(pin.x * 100).toFixed(1)}%;--y:${(pin.y * 100).toFixed(1)}%;--d:${(0.35 + k * 0.05).toFixed(2)}s" data-pin="${p.id}" data-v="${pin.v}" aria-label="${esc(nombre)}, ${formatearPrecio(precioFinal(p, v))}"><span class="pin__f"><b>${formatearPrecio(precioFinal(p, v))}</b><span class="pin__n">${esc(nombre)}</span></span></button>`;
}

function pintarPinsMapa(entrar = false) {
  const cont = byId('mapa-pins');
  if (!cont) return;
  cont.innerHTML = PINS.filter(x => x.s === MAPA.sector).map(pinHTML).join('');
  if (entrar && !reduceMotion) cont.querySelectorAll('.pin').forEach(el => el.classList.add('entra'));
}

function pintarTabsMapa() {
  const tabs = byId('mapa-tabs');
  if (!tabs) return;
  tabs.innerHTML = SECTORES.map(s => {
    const n = PINS.filter(x => x.s === s.id && MAPA.ids.has(x.id)).length;
    return `<button type="button" class="mapa__tab" data-sector="${s.id}" aria-pressed="${s.id === MAPA.sector}"${n ? '' : ' disabled'}>${esc(s.nombre)} <b>${n}</b></button>`;
  }).join('');
}

function setSector(s, entrar = true) {
  const img = byId('mapa-img');
  const stage = byId('mapa-stage');
  const vp = byId('mapa-vp');
  const sector = SECTORES.find(x => x.id === s);
  if (!img || !stage || !sector) return;
  if (s !== MAPA.sector) {
    MAPA.sector = s;
    stage.classList.add('is-cambio');
    img.src = FOTOS[s].src;
    img.width = FOTOS[s].w;
    img.height = FOTOS[s].h;
    img.alt = sector.alt;
    vp?.setAttribute('aria-label', `Mapa del vivero: ${sector.aria}`);
    const listo = () => stage.classList.remove('is-cambio');
    if (img.decode) img.decode().then(listo, listo); else setTimeout(listo, 200);
  }
  pintarTabsMapa();
  pintarPinsMapa(entrar);
}

function setActivo(id, v = '', anim = true) {
  const p = getProducto(id);
  if (!p || !byId('mapa-vp')) return;
  const deId = PINS.filter(x => x.id === id);
  if (!deId.length) return;
  const pin = deId.find(x => x.s === MAPA.sector && (!v || !x.v || x.v === v)) || deId.find(x => !v || !x.v || x.v === v) || deId[0];
  MAPA.activo = id;
  MAPA.activoV = pin.v;
  if (pin.s !== MAPA.sector) setSector(pin.s, false);
  byId('mapa-pins')?.querySelectorAll('.pin').forEach(el => el.classList.toggle('is-activo', el.dataset.pin === id && (!pin.v || el.dataset.v === pin.v)));
  byId('mapa-foco')?.classList.add('is-on');
  document.querySelectorAll('#grid .fila').forEach(f => f.classList.toggle('is-activo', f.dataset.id === id));
  centrarMapa(pin.x, pin.y - 0.08, anim);
  const pie = byId('mapa-pie');
  if (pie) pie.textContent = `${p.nombre} · ${formatearPrecio(precioFinal(p, pin.v || varDef(p)))} · tocá la etiqueta para verla de cerca`;
}

function actualizarMapa(lista) {
  if (!byId('mapa-vp')) return;
  MAPA.ids = new Set(lista.map(p => p.id));
  const aqui = PINS.filter(x => x.s === MAPA.sector && MAPA.ids.has(x.id)).length;
  if (!aqui && lista.length) {
    const cuenta = SECTORES.map(s => [s.id, PINS.filter(x => x.s === s.id && MAPA.ids.has(x.id)).length]).sort((a, b) => b[1] - a[1]);
    if (cuenta[0][1]) { setSector(cuenta[0][0]); centrarMapa(0.5, 0.5); return; }
  }
  if (MAPA.activo && !MAPA.ids.has(MAPA.activo)) {
    MAPA.activo = null;
    byId('mapa-foco')?.classList.remove('is-on');
  }
  pintarTabsMapa();
  byId('mapa-pins')?.querySelectorAll('.pin').forEach(el => el.classList.toggle('is-off', !MAPA.ids.has(el.dataset.pin)));
}

let vistaActual = 'lista';
function setVista(v) {
  const t = document.querySelector('.tienda-j');
  if (!t) return;
  vistaActual = v;
  t.classList.toggle('ver-mapa', v === 'mapa');
  document.querySelectorAll('[data-vista]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === v)));
  if (v === 'mapa') requestAnimationFrame(() => {
    if (MAPA.activo) setActivo(MAPA.activo, MAPA.activoV, false);
    else centrarMapa(0.5, 0.55, false);
  });
}

function initMapa() {
  const vp = byId('mapa-vp');
  const stage = byId('mapa-stage');
  const grid = byId('grid');
  if (!vp || !stage) return;
  pintarTabsMapa();
  pintarPinsMapa(true);
  centrarMapa(0.5, 0.55, false);

  byId('mapa-tabs')?.addEventListener('click', e => {
    const b = e.target.closest('[data-sector]');
    if (!b || b.disabled) return;
    MAPA.activo = null;
    byId('mapa-foco')?.classList.remove('is-on');
    document.querySelectorAll('#grid .fila.is-activo').forEach(f => f.classList.remove('is-activo'));
    setSector(b.dataset.sector);
    centrarMapa(0.5, 0.5, false);
    const pie = byId('mapa-pie');
    if (pie) pie.textContent = 'Tocá una etiqueta para ver la planta · arrastrá la foto para recorrer';
  });

  let drag = null;
  let bloquearClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !MAPA.m) return;
    drag = { x: e.clientX, y: e.clientY, tx: MAPA.tx, ty: MAPA.ty, id: e.pointerId, movido: false };
  });
  vp.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.movido) {
      if (Math.hypot(dx, dy) < 6) return;
      if (e.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      drag.movido = true;
      vp.classList.add('is-drag');
      stage.classList.add('is-drag');
      try { vp.setPointerCapture(e.pointerId); } catch { /* sin captura igual arrastra */ }
    }
    const { W, H, w, h } = MAPA.m;
    MAPA.tx = clamp(drag.tx + dx, W - w, 0);
    MAPA.ty = clamp(drag.ty + (e.pointerType === 'mouse' ? dy : 0), H - h, 0);
    stage.style.transform = `translate3d(${MAPA.tx.toFixed(1)}px, ${MAPA.ty.toFixed(1)}px, 0)`;
    byId('mapa-foco')?.classList.remove('is-on');
  });
  const soltar = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (drag.movido) {
      bloquearClick = true;
      setTimeout(() => { bloquearClick = false; }, 60);
      try { vp.releasePointerCapture(drag.id); } catch { /* ya liberado */ }
    }
    vp.classList.remove('is-drag');
    stage.classList.remove('is-drag');
    drag = null;
  };
  vp.addEventListener('pointerup', soltar);
  vp.addEventListener('pointercancel', soltar);
  vp.addEventListener('click', e => {
    if (bloquearClick) { e.preventDefault(); e.stopPropagation(); return; }
    const pin = e.target.closest('[data-pin]');
    if (pin) {
      e.stopPropagation();
      abrirModal(pin.dataset.pin, pin.dataset.v || '');
    }
  }, true);

  if (grid) {
    grid.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse' || !mapaVisible()) return;
      const f = e.target.closest('.fila');
      if (f && f.dataset.id !== MAPA.activo) setActivo(f.dataset.id);
    });
    grid.addEventListener('focusin', e => {
      if (!mapaVisible()) return;
      const f = e.target.closest('.fila');
      if (f && f.dataset.id !== MAPA.activo) setActivo(f.dataset.id);
    });
  }
  document.querySelectorAll('[data-vista]').forEach(b => b.addEventListener('click', () => setVista(b.dataset.vista)));

  let r = 0;
  window.addEventListener('resize', () => {
    clearTimeout(r);
    r = setTimeout(() => {
      if (!mapaVisible()) return;
      const pin = MAPA.activo && PINS.find(x => x.id === MAPA.activo && x.s === MAPA.sector);
      if (pin) centrarMapa(pin.x, pin.y - 0.08, false);
      else centrarMapa(0.5, 0.55, false);
    }, 120);
  }, { passive: true });
}

/* ---------- taller de kokedamas ---------- */
const T = { iso: '', planta: 'helecho', n: 1 };
const libresTaller = iso => Math.max(0, TALLER.cupo - ocupadosDe(iso) - Cart.enTaller(iso));

function initTaller() {
  const app = byId('taller-app');
  const dias = byId('t-dias');
  const plantas = byId('t-plantas');
  if (!app || !dias || !plantas) return;
  const primera = FECHAS.find(f => libresTaller(f.iso) > 0) || FECHAS[0];
  T.iso = primera ? primera.iso : '';
  dias.innerHTML = FECHAS.map((f, k) => `<label class="t-dia" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
      <input type="radio" name="t-dia" value="${f.iso}"${f.iso === T.iso ? ' checked' : ''}>
      <span class="t-dia__d">${DIAS_CORTOS[f.fecha.getDay()]} · ${MESES_CORTOS[f.fecha.getMonth()]}</span>
      <span class="t-dia__n">${f.fecha.getDate()}</span>
      <span class="t-dia__h">${f.desde} h</span>
      <span class="t-dia__q" data-q="${k}"></span>
    </label>`).join('');
  plantas.innerHTML = TALLER.plantas.map(pl => `<label class="t-planta">
      <input type="radio" name="t-planta" value="${pl.id}"${pl.id === T.planta ? ' checked' : ''}>
      ${fotoHTML(pl.foto, pl.foco, 1, '', '', `Kokedama de ${pl.nombre.toLowerCase()}`)}
      <span>${esc(pl.nombre)}</span>
    </label>`).join('');
  app.addEventListener('change', e => {
    if (e.target.name === 't-dia') { T.iso = e.target.value; T.n = 1; pintarTaller(); }
    if (e.target.name === 't-planta') { T.planta = e.target.value; pintarTaller(); }
  });
  byId('t-menos')?.addEventListener('click', () => { T.n = Math.max(1, T.n - 1); pintarTaller(); });
  byId('t-mas')?.addEventListener('click', () => { T.n = Math.min(Math.max(1, libresTaller(T.iso)), 4, T.n + 1); pintarTaller(); });
  byId('t-add')?.addEventListener('click', () => {
    const p = getProducto('taller');
    const f = FECHAS.find(x => x.iso === T.iso);
    if (!p || !f) return;
    const ok = Cart.add(p, T.n, `${T.iso}|${T.planta}`);
    if (!ok) { showToast('Ese día ya no quedan lugares: probá con otra fecha.'); return; }
    showToast(`Sumaste ${plural(ok, 'lugar', 'lugares')} al taller del ${fechaLarga(f.fecha)}.`);
    T.n = 1;
    pintarTaller();
  });
  pintarTaller();
}

function pintarTaller() {
  const app = byId('taller-app');
  if (!app || !T.iso) return;
  const f = FECHAS.find(x => x.iso === T.iso);
  if (!f) return;
  const libres = libresTaller(T.iso);
  T.n = Math.max(1, Math.min(T.n, Math.max(1, libres), 4));
  FECHAS.forEach((x, k) => {
    const l = libresTaller(x.iso);
    const q = app.querySelector(`[data-q="${k}"]`);
    if (q) {
      q.textContent = l ? (l === 1 ? 'queda 1 lugar' : `quedan ${l}`) : 'completo';
      q.classList.toggle('is-pocos', l > 0 && l <= 3);
    }
    const input = app.querySelector(`input[name="t-dia"][value="${x.iso}"]`);
    if (input) { input.disabled = l <= 0 && x.iso !== T.iso; input.checked = x.iso === T.iso; }
  });
  app.querySelectorAll('input[name="t-planta"]').forEach(i => { i.checked = i.value === T.planta; });
  const pl = tallerPlanta(T.planta);
  const set = (id, txt) => { const el = byId(id); if (el) el.textContent = txt; };
  set('t-cuando', `${mayus(fechaLarga(f.fecha))} · ${f.desde} a ${f.hasta}`);
  set('t-que', `Kokedama de ${pl.nombre.toLowerCase()}, con base de madera. Te la llevás puesta.`);
  set('t-n', String(T.n));
  set('t-total', formatearPrecio(getProducto('taller').precio * T.n));
  const ocup = ocupadosDe(T.iso);
  const tuyos = Cart.enTaller(T.iso);
  const asientos = byId('t-asientos');
  if (asientos) {
    asientos.innerHTML = Array.from({ length: TALLER.cupo }, (_, i) => {
      let c = 'is-libre';
      if (i < ocup) c = 'is-ocupado';
      else if (i < ocup + tuyos + (libres ? T.n : 0)) c = 'is-tuyo';
      return `<i class="asiento ${c}"></i>`;
    }).join('');
    asientos.setAttribute('aria-label', `${TALLER.cupo} lugares en la mesa: ${ocup} ocupados${tuyos ? `, ${tuyos} ya en tu carrito` : ''} y ${libres} libres`);
  }
  const lib = byId('t-libres');
  if (lib) lib.innerHTML = libres ? `<b>${libres === 1 ? 'Queda 1 lugar' : `Quedan ${libres} lugares`}</b>${tuyos ? ` · ${plural(tuyos, 'lugar', 'lugares')} ya en tu carrito` : ''}` : '<b>Este día está completo.</b> Elegí otra fecha.';
  const menos = byId('t-menos');
  const mas = byId('t-mas');
  if (menos) menos.disabled = T.n <= 1;
  if (mas) mas.disabled = T.n >= Math.min(4, libres);
  const add = byId('t-add');
  if (add) {
    add.disabled = libres <= 0;
    add.textContent = libres <= 0 ? 'Sin lugares ese día' : `Sumar ${plural(T.n, 'lugar', 'lugares')} al carrito`;
  }
  const wsp = byId('t-wsp');
  if (wsp) wsp.href = wspLink(`Hola Biduanda! Quiero reservar ${plural(T.n, 'lugar', 'lugares')} en el taller de kokedamas del ${fechaLarga(f.fecha)} a las ${f.desde}, con ${pl.nombre.toLowerCase()}. ¿Me confirman?`);
}

/* ---------- momento: la luz ---------- */
let luzActiva = -1;
const cuentaLuz = id => VISIBLES.filter(p => (p.luz || []).includes(id)).length;

function initLuz() {
  const cont = byId('luz-cont');
  const escena = byId('luz-escena');
  const visual = byId('luz-visual');
  const stage = byId('luz-stage');
  const pinsEl = byId('luz-pins');
  if (!cont || !escena || !visual || !stage) return;
  if (pinsEl) {
    pinsEl.innerHTML = LUCES.map((L, k) => L.pins.map(id => {
      const pin = PINS.find(x => x.id === id && x.s === '01');
      const p = getProducto(id);
      if (!pin || !p) return '';
      const v = pin.v || varDef(p);
      return `<button type="button" class="pin pin--${p.cat}" style="--x:${(pin.x * 100).toFixed(1)}%;--y:${(pin.y * 100).toFixed(1)}%" data-luz-pin="${k}" data-quick="${p.id}" data-v="${pin.v}" aria-label="${esc(p.nombre)}, ${formatearPrecio(precioFinal(p, v))}" tabindex="-1"><span class="pin__f"><b>${esc(p.corto || p.nombre)}</b></span></button>`;
    }).join('')).join('');
  }
  const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let medida = null;
  const medirStage = () => {
    medida = medirEscena(visual, '01');
    stage.style.width = `${medida.w}px`;
    stage.style.height = `${medida.h}px`;
  };
  const pintar = pos => {
    const i = Math.min(LUCES.length - 2, Math.floor(pos));
    const t = pos - i;
    const A = LUCES[i];
    const B = LUCES[i + 1];
    const bg = A.bg.map((c, k) => Math.round(lerp(c, B.bg[k], t)));
    escena.style.setProperty('--luz-bg', `rgb(${bg.join(',')})`);
    ['b', 's', 'so', 'vo'].forEach(k => escena.style.setProperty(`--${k}`, lerp(A[k], B[k], t).toFixed(3)));
    escena.style.setProperty('--sx', `${lerp(A.sx, B.sx, t).toFixed(1)}%`);
    escena.style.setProperty('--sy', `${lerp(A.sy, B.sy, t).toFixed(1)}%`);
    escena.style.setProperty('--m', `${(pos / (LUCES.length - 1) * 100).toFixed(1)}%`);
    const lux = Math.pow(10, lerp(Math.log10(A.lux), Math.log10(B.lux), t));
    const luxEl = byId('luz-lux');
    if (luxEl) luxEl.textContent = (Math.round(lux / 100) * 100).toLocaleString('es-AR');
    if (medida) {
      const fx = lerp(A.foco[0], B.foco[0], t);
      const fy = lerp(A.foco[1], B.foco[1], t);
      const tx = clamp(medida.W / 2 - fx * medida.w, medida.W - medida.w, 0);
      const ty = clamp(medida.H / 2 - fy * medida.h, medida.H - medida.h, 0);
      stage.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
    }
    activarLuz(Math.round(pos));
  };
  const estatica = reduceMotion;
  if (estatica) document.querySelector('.luz')?.classList.add('luz--estatica');
  let pos = 0;
  let frame = 0;
  const medir = () => {
    frame = 0;
    if (estatica) return;
    const total = cont.offsetHeight - escena.offsetHeight;
    const p = total > 0 ? clamp01((OFF() - cont.getBoundingClientRect().top) / total) : 0;
    const u = p * (LUCES.length - 1);
    const i = Math.min(LUCES.length - 2, Math.floor(u));
    const f = u - i;
    const tt = clamp01((f - 0.2) / 0.6);
    pos = i + tt * tt * (3 - 2 * tt);
    pintar(pos);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medirStage(); if (estatica) pintar(pos); else pedir(); }, { passive: true });
  document.querySelectorAll('[data-luz-ir]').forEach(b => b.addEventListener('click', () => {
    const k = Number(b.dataset.luzIr);
    if (estatica) { pos = k; pintar(pos); return; }
    const total = cont.offsetHeight - escena.offsetHeight;
    const top = cont.getBoundingClientRect().top + window.scrollY - OFF() + total * (k / (LUCES.length - 1));
    window.scrollTo({ top: Math.round(top), behavior: 'smooth' });
  }));
  byId('luz-cta')?.addEventListener('click', e => {
    e.preventDefault();
    filtrarPor('luz', LUCES[Math.max(0, luzActiva)].id);
  });
  medirStage();
  if (estatica) pintar(0); else medir();
}

function activarLuz(k) {
  if (k === luzActiva || !LUCES[k]) return;
  luzActiva = k;
  const L = LUCES[k];
  const escena = byId('luz-escena');
  if (escena) { escena.dataset.luz = String(k); escena.style.setProperty('--em', L.em); }
  document.querySelectorAll('.luz__paso').forEach(el => {
    const on = Number(el.dataset.paso) === k;
    el.classList.toggle('is-activo', on);
    if (on) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('[data-luz-pin]').forEach(el => {
    const on = Number(el.dataset.luzPin) === k;
    el.classList.toggle('is-on', on);
    el.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('[data-luz-ir]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.luzIr) === k)));
  const cta = byId('luz-cta');
  if (cta) cta.textContent = `Ver las ${cuentaLuz(L.id)} para ${LUZ[L.id].toLowerCase()}`;
}

/* ---------- carrito (drawer) ---------- */
let ultimoFoco = null;

function pedidoTexto() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const extra = varLabel(p, i.v);
    return `• ${i.qty} × ${p.nombre}${extra ? ` (${extra})` : ''} — ${formatearPrecio(precioFinal(p, i.v) * i.qty)}`;
  }).filter(Boolean);
  return `Hola Biduanda! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const v = i.v || '';
  const f = p.id === 'taller' ? (() => { const pl = tallerPlanta(partesTaller(v).planta); return pl ? { foto: pl.foto, foco: pl.foco } : { foto: p.foto, foco: p.foco }; })() : fotoDe(p, v);
  const libre = stockLibre(p, v);
  const extra = varLabel(p, v);
  const s = esc(v);
  return `<div class="linea">
    ${fotoHTML(f.foto, f.foco, 1, 'linea__img')}
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">${esc(CAT_CORTA[p.cat])}${extra ? ` · ${esc(extra)}` : ''}</p>
      <div class="linea__acts">
        <div class="stepper"><button type="button" data-linea="-1" data-id="${p.id}" data-v="${s}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" data-v="${s}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-v="${s}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p, v) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = byId('drawer-body');
  const foot = byId('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Arrancá por una planta que vaya con la luz de tu casa, o sumate al taller de kokedamas.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver las plantas</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (foot) {
    foot.hidden = false;
    const tot = byId('drawer-total');
    if (tot) tot.textContent = formatearPrecio(Cart.total());
    const n = byId('drawer-n');
    if (n) n.textContent = plural(Cart.count(), 'producto', 'productos');
    const wsp = byId('drawer-wsp');
    if (wsp) wsp.href = wspLink(pedidoTexto());
  }
}

function abrirDrawer() {
  const dr = byId('drawer');
  const bd = byId('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : byId('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  byId('drawer-close')?.focus();
}

function cerrarDrawer() {
  const dr = byId('drawer');
  const bd = byId('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initDrawer() {
  const dr = byId('drawer');
  if (!dr) return;
  byId('cart-header')?.addEventListener('click', abrirDrawer);
  byId('cart-float')?.addEventListener('click', abrirDrawer);
  byId('drawer-close')?.addEventListener('click', cerrarDrawer);
  byId('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar, q.dataset.v || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const v = paso.dataset.v || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && (x.v || '') === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); filtrarPor('cat', 'plantas'); }
  });
  byId('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let modalId = '';
let modalVar = '';
let modalVista = 0;

function tituloVista(p) {
  if (p.cat === 'plantas') return 'La planta';
  if (p.cat === 'kokedamas') return 'La kokedama';
  if (p.cat === 'macetas') return 'La maceta';
  return 'El producto';
}

function modalHTML(p, v) {
  const f = fotoDe(p, v);
  const libre = stockLibre(p, v);
  const vars = p.vars ? `<div class="m-vars"><p class="m-vars__t">${esc(p.varTitulo || 'Opción')}</p><div class="m-vars__lista">${p.vars.map(x => `<button type="button" class="m-var" data-var="${x.id}" aria-pressed="${x.id === v}">${esc(x.label)}${variaPrecio(p) ? ` · ${formatearPrecio(precioFinal(p, x.id))}` : ''}</button>`).join('')}</div></div>` : '';
  let stock = '<p class="m-stock">Hay stock para llevártela hoy.</p>';
  if (p.cat !== 'plantas' && p.cat !== 'kokedamas') stock = '<p class="m-stock">En stock.</p>';
  if (p.stock <= 0) stock = '<p class="m-stock m-stock--sin">Sin stock por ahora. Escribinos y te avisamos cuando vuelva.</p>';
  else if (libre <= 0) stock = '<p class="m-stock m-stock--sin">Ya tenés en el carrito todo el stock.</p>';
  else if (p.stock <= 3) stock = `<p class="m-stock m-stock--poco">${p.stock === 1 ? 'Queda 1' : `Quedan ${p.stock}`}</p>`;
  const cuidados = (p.tips || []).map(t => `<li>${esc(t)}</li>`).join('');
  const mascotas = p.luz && !p.mascotas ? '<li>Es tóxica si la mastican perros o gatos: mejor en un estante alto.</li>' : '';
  const rel = VISIBLES.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const relHTML = rel.map(x => { const fx = fotoDe(x, varDef(x)); return `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(fx.foto, fx.foco, 1)}<span>${esc(x.nombre)}</span><b>${formatearPrecio(precioDesde(x))}</b></button></li>`; }).join('');
  const vista = modalVista ? [f.foco[0], f.foco[1], 1] : f.foco;
  const extra = varLabel(p, v);
  return `<div class="m-grid cat-${p.cat}">
    <div class="m-fotos">
      ${fotoHTML(f.foto, vista, 0.8, 'm-foto', ' id="m-foto"', p.alt)}
      <div class="m-vistas" role="group" aria-label="Cómo ver la foto">
        <button type="button" class="m-vista" data-m-vista="0" aria-pressed="${!modalVista}">${tituloVista(p)}</button>
        <button type="button" class="m-vista" data-m-vista="1" aria-pressed="${!!modalVista}">En el vivero</button>
      </div>
    </div>
    <div class="m-info">
      <p><span class="flag flag--${p.cat}">${esc(CATS[p.cat])}</span></p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      ${precioHTML(p, v)}
      <p class="m-medida">${esc(p.medida)}</p>
      ${cuidaHTML(p)}
      <p class="m-desc">${esc(p.desc)}</p>
      ${vars}
      ${stock}
      <div class="m-compra">
        <div class="stepper stepper--modal" data-stepper="${p.id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>
        <button type="button" class="btn btn--solid" data-add-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button>
      </div>
      <button type="button" class="btn btn--line btn--block" data-comprar-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      <a class="m-wsp" href="${wspLink(`Hola Biduanda! Quiero consultar por ${p.nombre}${extra ? ` (${extra})` : ''}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      ${cuidados || mascotas ? `<div class="m-cuida"><p class="m-cuida__t">Cómo cuidarla</p><ul>${cuidados}${mascotas}</ul></div>` : ''}
      ${p.cat === 'kokedamas' ? '<p class="m-taller">¿Querés hacerla con tus manos? <a href="#talleres" data-ir-taller>Mirá el taller de kokedamas</a></p>' : ''}
      ${relHTML ? `<div class="m-rels"><p class="m-rels__t">También en ${esc(CATS[p.cat].toLowerCase())}</p><ul>${relHTML}</ul></div>` : ''}
    </div>
  </div>`;
}

function inyectarLD(p, v) {
  byId('ld-producto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ld-producto';
  const f = fotoDe(p, v);
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(FOTOS[f.foto].src, location.href).href,
    description: p.desc, category: CATS[p.cat], brand: { '@type': 'Brand', name: 'Biduanda' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: String(precioFinal(p, v)), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
  document.head.appendChild(ld);
}

function pintarModal(foco) {
  const p = getProducto(modalId);
  const cont = byId('modal-content');
  if (!p || !cont) return;
  cont.innerHTML = modalHTML(p, modalVar);
  if (foco) cont.querySelector(foco)?.focus();
}

function abrirModal(id, v = '') {
  const p = getProducto(id);
  const modal = byId('modal');
  const cont = byId('modal-content');
  if (!p || p.oculto || !modal || !cont) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  modalId = p.id;
  modalVar = p.vars ? (getVar(p, v) ? v : varDef(p)) : '';
  modalVista = 0;
  pintarModal();
  const box = modal.querySelector('.modal__box');
  if (box) box.scrollTop = 0;
  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  byId('modal-close')?.focus();
  inyectarLD(p, modalVar);
  try { window.history.replaceState(null, '', `${location.pathname}?producto=${p.id}`); } catch { /* sin historial */ }
}

function cerrarModal(sinFoco) {
  const modal = byId('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modalId = '';
  document.body.classList.remove('no-scroll');
  byId('ld-producto')?.remove();
  if (!sinFoco) ultimoFoco?.focus?.();
  try { window.history.replaceState(null, '', location.pathname); } catch { /* sin historial */ }
}

function cantidadDe(cont) {
  const out = cont?.querySelector('output');
  return out ? Math.max(1, Number(out.textContent) || 1) : 1;
}

function initModal() {
  const modal = byId('modal');
  if (!modal) return;
  byId('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const vista = e.target.closest('[data-m-vista]');
    if (vista) { modalVista = Number(vista.dataset.mVista); pintarModal(`[data-m-vista="${modalVista}"]`); return; }
    const vv = e.target.closest('[data-var]');
    if (vv) { modalVar = vv.dataset.var; pintarModal(`[data-var="${modalVar}"]`); return; }
    if (e.target.closest('[data-ir-taller]')) {
      e.preventDefault();
      cerrarModal(true);
      byId('talleres')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (add) {
      const p = getProducto(add.dataset.addModal || add.dataset.comprarModal);
      if (!p) return;
      const ok = Cart.add(p, cantidadDe(modal.querySelector('.stepper--modal')), modalVar);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de este producto.'); return; }
      if (add.dataset.comprarModal) { cerrarModal(true); abrirDrawer(); return; }
      const extra = varLabel(p, modalVar);
      showToast(`Agregaste ${p.nombre}${extra ? ` (${extra.toLowerCase()})` : ''} al carrito.`);
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
  document.addEventListener('cart:updated', () => { if (!modal.hidden && modalId) pintarModal(); });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id) && !getProducto(id).oculto) abrirModal(id);
}

/* ---------- acciones ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    if (e.target.closest('#mapa-vp')) return;
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick, quick.dataset.v || ''); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('.stepper');
      const out = st?.querySelector('output');
      const p = getProducto(st?.dataset.stepper);
      if (!out || !p) return;
      const v = st.classList.contains('stepper--modal') ? modalVar : '';
      const libre = Math.max(1, stockLibre(p, v));
      out.textContent = String(Math.max(1, Math.min(libre, (Number(out.textContent) || 1) + Number(paso.dataset.paso))));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = add.closest('.fila, .card');
      const ok = Cart.add(p, cantidadDe(card?.querySelector('.stepper')), '');
      showToast(ok ? `Agregaste ${plural(ok, 'unidad', 'unidades')} de ${p.nombre}.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const card = comprar.closest('.fila, .card');
      Cart.add(p, cantidadDe(card?.querySelector('.stepper')), '');
      abrirDrawer();
      return;
    }
    const verMapa = e.target.closest('[data-ver-mapa]');
    if (verMapa) {
      setVista('mapa');
      requestAnimationFrame(() => {
        setActivo(verMapa.dataset.verMapa, '', false);
        byId('mapa')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
      return;
    }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#modal')) {
      e.preventDefault();
      if (cat.dataset.cat) filtrarPor('cat', cat.dataset.cat);
      else { resetFiltros(); if (!ES_M2) setVista('lista'); pintarCatalogo(); irATienda(); }
    }
  });
}

function refrescarVistas() {
  document.querySelectorAll('#grid .fila, #grid .card').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p) return;
    const t = document.createElement('template');
    t.innerHTML = cardHTML(p, false);
    card.replaceChildren(...t.content.firstElementChild.childNodes);
  });
  pintarTaller();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', refrescarVistas);

/* ---------- formulario ---------- */
function initForm() {
  const form = byId('form-consulta');
  if (!form) return;
  const tel = byId('c-tel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const campos = [
    { el: byId('c-nombre'), ok: el => el.value.trim().length >= 2 },
    { el: tel, ok: el => (mask ? mask.unmaskedValue.length === 12 : el.value.replace(/\D/g, '').length >= 10) },
    { el: byId('c-msj'), ok: el => el.value.trim().length >= 4 }
  ].filter(c => c.el);
  const marcar = (c, mostrar) => {
    const bien = c.ok(c.el);
    const err = byId(`${c.el.id}-err`);
    if (mostrar || c.el.getAttribute('aria-invalid') === 'true') {
      c.el.setAttribute('aria-invalid', String(!bien));
      if (err) err.hidden = bien;
    }
    return bien;
  };
  campos.forEach(c => c.el.addEventListener('blur', () => { if (c.el.value) marcar(c, true); }));
  campos.forEach(c => c.el.addEventListener('input', () => marcar(c, false)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = campos.filter(c => !marcar(c, true));
    if (malos.length) {
      malos[0].el.focus();
      malos[0].el.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      if (mask) mask.value = '';
      campos.forEach(c => { c.el.setAttribute('aria-invalid', 'false'); const err = byId(`${c.el.id}-err`); if (err) err.hidden = true; });
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- entradas ---------- */
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
  if (!ES_M2) tl.from(hero, { y: 28, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter,transform,opacity' }, 0.22)
    .from(hero.querySelectorAll('.hero-lead, .migas'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58)
    .from(hero.querySelectorAll('.sello-marca, .estaca-w'), { y: -70, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, 0.62);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.taller__fig img, .contacto__fig img, .banda__fig img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
  });
}

/* ---------- menú ---------- */
function initNav() {
  const toggle = byId('menuToggle');
  const nav = byId('mainNav');
  const closeBtn = byId('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1100px)');
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
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

/* ---------- flotantes ---------- */
function initFloats() {
  const wsp = byId('wsp-float');
  const cart = byId('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

/* ---------- barra de modelos ---------- */
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

/* ---------- arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  sanearCarrito();
  pintarConteos();
  initModelBarScroll();
  initCatalogo();
  initMapa();
  initTaller();
  initLuz();
  initReveals();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  initHeroMotion();
  initParallax();
  initNav();
  initFiltrosPanel();
  initDrawer();
  initModal();
  initAcciones();
  initForm();
  initFloats();
  updateCartBadge();
  abrirDesdeURL();
});
