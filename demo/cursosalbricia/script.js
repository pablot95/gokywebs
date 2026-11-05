const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492215343430';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const fmtDur = min => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${String(m).padStart(2, '0')} min` : `${h} h`;
};

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  nivel: svg('<path d="M6 20v-5M12 20v-9M18 20V6"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>'),
  clases: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>'),
  video: svg('<circle cx="12" cy="12" r="9"/><path d="m10 8.8 5 3.2-5 3.2z"/>'),
  pdf: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  flecha: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  libro: svg('<path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H10a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H2z"/><path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H14a2 2 0 0 0-2 2v15a2 2 0 0 1 2-2h8z"/>'),
  carritoMas: svg('<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/>'),
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  batidor: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="rotate(-30 20 20)"><path d="M20 38.5V27"/><path d="M20 27C11.5 21 12 2.5 20 2.5S28.5 21 20 27z"/><path d="M20 27C15.5 21 14.5 6.5 20 2.5M20 27C24.5 21 25.5 6.5 20 2.5M20 27V2.5"/></g></svg>',
};

const CATEGORIAS = [
  { id: 'pasteleria', nombre: 'Pastelería' },
  { id: 'decoracion', nombre: 'Decoración de tortas' },
  { id: 'panaderia', nombre: 'Panadería' },
  { id: 'alfajores', nombre: 'Alfajores' },
  { id: 'seminarios', nombre: 'Seminarios temáticos' },
];
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const NIVELES = ['Inicial', 'Intermedio', 'Avanzado'];
const DURACIONES = [
  { id: 'corto', test: m => m <= 75 },
  { id: 'medio', test: m => m > 75 && m <= 120 },
  { id: 'largo', test: m => m > 120 },
];
const PRECIOS = [
  { id: 'hasta20', test: p => p <= 20000 },
  { id: '20a35', test: p => p > 20000 && p <= 35000 },
  { id: 'mas35', test: p => p > 35000 },
];
const ORDENES = {
  rec: (a, b) => a.orden - b.orden,
  'precio-asc': (a, b) => precioFinal(a) - precioFinal(b) || a.orden - b.orden,
  'precio-desc': (a, b) => precioFinal(b) - precioFinal(a) || a.orden - b.orden,
  corto: (a, b) => a.duracion - b.duracion || a.orden - b.orden,
};

const DOCENTE = {
  id: 'albricia',
  nombre: 'Albricia',
  rol: 'Pastelera de @albricia_tortas',
  bio: 'Las clases las da la pastelera de @albricia_tortas, con el paso a paso completo de cada receta, de la mezcla al terminado.',
  redes: 'https://www.instagram.com/albricia_tortas/',
  credencialesVerificadas: false,
};

const IMG_TAM = { 'torta-flores.webp': [900, 1600], 'torta-chocolate.webp': [1600, 900] };

const CURSOS = [
  {
    id: 'c01', slug: 'tortas-humedas-de-chocolate', titulo: 'Tortas húmedas de chocolate', categoria: 'pasteleria', nivel: 'Inicial', modalidad: 'Online, clases grabadas',
    precio: 34000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'torta-chocolate.webp', alt: 'Torta de chocolate de tres capas con ganache chorreada y una porción cortada',
    descripcionCorta: 'Bizcochuelo húmedo, almíbar, relleno de dulce de leche y ganache para una torta de tres pisos.',
    descripcionCompleta: 'Armás una torta de chocolate de tres capas de punta a punta: el bizcochuelo que no se seca, el almíbar, el relleno y una ganache brillante para cubrirla y hacerle el chorreado.',
    resultados: ['Un bizcochuelo de chocolate húmedo que se corta parejo', 'Ganache para cubrir y para chorrear, en su punto', 'Una torta de tres pisos armada, nivelada y cubierta'],
    requisitos: ['Batidora de mano o planetaria', 'Molde redondo de 20 o 22 cm', 'Espátula y una base para tortas'],
    etiquetas: ['torta', 'chocolate', 'ganache', 'bizcochuelo', 'dulce de leche', 'cumpleaños'],
    modulos: [
      ['El bizcochuelo', [['Ingredientes y mise en place', 12, 'video', 1], ['Batido y horneado', 18, 'video'], ['Receta del bizcochuelo', 4, 'pdf']]],
      ['Almíbar, relleno y armado', [['Almíbar para humedecer', 8, 'video'], ['Nivelar y cortar las capas', 14, 'video'], ['Rellenar y apilar sin que se corra', 16, 'video']]],
      ['Ganache y terminación', [['Ganache para cubrir', 15, 'video'], ['Chorreado y rulos de chocolate', 17, 'video'], ['Receta de la ganache', 3, 'pdf']]],
    ],
  },
  {
    id: 'c02', slug: 'lemon-pie-y-tartas-clasicas', titulo: 'Lemon pie y tartas clásicas', categoria: 'pasteleria', nivel: 'Inicial', modalidad: 'Online, clases grabadas',
    precio: 32000, descuento: 0, destacado: true, nuevo: false, badge: 'Para empezar',
    portada: 'lemon-pie.webp', alt: 'Lemon pie con merengue dorado en picos sobre un plato de cerámica',
    descripcionCorta: 'Masa sablée, crema de limón y merengue italiano dorado con soplete.',
    descripcionCompleta: 'Una masa quebrada que no se encoge, una crema de limón firme y un merengue italiano que se sostiene. Con la misma base salen otras tartas clásicas de la vitrina.',
    resultados: ['Masa sablée estirada, forrada y horneada en blanco', 'Crema de limón que corta limpio', 'Merengue italiano estable y dorado'],
    requisitos: ['Tartera de 22 a 24 cm', 'Batidora', 'Termómetro de cocina (recomendado)'],
    etiquetas: ['lemon pie', 'tarta', 'limon', 'merengue', 'masa sable', 'masa quebrada'],
    modulos: [
      ['Masa sablée', [['La masa sin amasar de más', 14, 'video', 1], ['Forrar la tartera', 10, 'video'], ['Horneado en blanco', 9, 'video']]],
      ['Crema de limón', [['Cocción de la crema', 16, 'video'], ['Punto y enfriado', 8, 'video'], ['Receta de la crema', 3, 'pdf']]],
      ['Merengue y otras tartas', [['Merengue italiano con almíbar', 18, 'video'], ['Armado y dorado', 10, 'video'], ['Variantes con frutillas y frutos rojos', 12, 'video']]],
    ],
  },
  {
    id: 'c03', slug: 'flores-de-buttercream', titulo: 'Flores de buttercream para tortas', categoria: 'decoracion', nivel: 'Intermedio', modalidad: 'Online, clases grabadas',
    precio: 48000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'torta-flores.webp', alt: 'Torta alta cubierta con buttercream y decorada con flores naranjas de manga',
    descripcionCorta: 'Buttercream estable, colores y picos para flores, pimpollos, hojas y tallos sobre la torta.',
    descripcionCompleta: 'Preparás un buttercream que aguanta la manga y lo usás para cubrir y decorar: flores de cinco pétalos, pimpollos, hojas y tallos, ubicados para que la torta se vea armoniosa de todos lados.',
    resultados: ['Buttercream liso para cubrir y firme para decorar', 'Flores, pimpollos y hojas con distintos picos', 'Una composición floral pensada para la torta entera'],
    requisitos: ['Haber cubierto alguna torta antes', 'Mangas descartables y picos de pétalo, hoja y redondo', 'Espátula y base giratoria'],
    etiquetas: ['flores', 'buttercream', 'manga', 'picos', 'decoracion', 'torta decorada'],
    modulos: [
      ['Buttercream que aguanta', [['Merengue suizo y manteca', 16, 'video', 1], ['Colorear sin cortar la crema', 10, 'video'], ['Receta y conservación', 3, 'pdf']]],
      ['Picos y flores', [['Cómo cargar la manga', 8, 'video'], ['Flor de cinco pétalos', 24, 'video'], ['Pimpollos, hojas y tallos', 26, 'video']]],
      ['La torta terminada', [['Cubierta lisa con textura', 20, 'video'], ['Ubicar las flores', 22, 'video'], ['Borde de conchitas', 9, 'video']]],
    ],
  },
  {
    id: 'c04', slug: 'cupcakes-decorados-con-manga', titulo: 'Cupcakes decorados con manga', categoria: 'decoracion', nivel: 'Inicial', modalidad: 'Online, clases grabadas',
    precio: 29000, descuento: 15, destacado: true, nuevo: false, badge: '',
    portada: 'cupcakes.webp', alt: 'Cupcakes de vainilla con crema blanca en rosa y remolino sobre una bandeja con pie',
    descripcionCorta: 'Cupcakes de vainilla esponjosos y cuatro decorados con manga: rosa, remolino, estrella y doble color.',
    descripcionCompleta: 'Horneás cupcakes de vainilla que quedan altos y esponjosos y los decorás con una crema firme. Cuatro decorados distintos con dos picos para armar una docena que se vea pareja.',
    resultados: ['Cupcakes que crecen parejos y no se hunden', 'Cuatro decorados con pico de estrella y pico abierto', 'Una docena lista para regalar'],
    requisitos: ['Placa para muffins y pirotines', 'Manga y pico de estrella grande', 'Batidora'],
    etiquetas: ['cupcakes', 'manga', 'crema', 'vainilla', 'decoracion', 'muffins'],
    modulos: [
      ['La base', [['Masa de vainilla', 12, 'video', 1], ['Llenado y horneado parejo', 9, 'video'], ['Receta de los cupcakes', 2, 'pdf']]],
      ['La crema', [['Crema de manteca firme', 11, 'video'], ['Colores suaves', 7, 'video'], ['Cargar la manga sin aire', 6, 'video']]],
      ['Decorados', [['Rosa y remolino', 12, 'video'], ['Estrella y doble color', 12, 'video'], ['Presentación en caja', 6, 'video']]],
    ],
  },
  {
    id: 'c05', slug: 'pan-de-masa-madre', titulo: 'Pan de masa madre en casa', categoria: 'panaderia', nivel: 'Intermedio', modalidad: 'Online, clases grabadas',
    precio: 38000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'pan-masa-madre.webp', alt: 'Hogaza de masa madre con corteza dorada y dos rebanadas sobre una tabla de madera',
    descripcionCorta: 'De la masa madre activa a la hogaza con corteza crocante y miga abierta, en el horno de tu casa.',
    descripcionCompleta: 'Arrancás tu masa madre, aprendés a leer cuándo está lista y hacés una hogaza con pliegues, fermentación en frío y greñado, horneada en olla para lograr la corteza.',
    resultados: ['Masa madre propia, activa y alimentada', 'Una hogaza con miga abierta y corteza crocante', 'Un cronograma que entra en tu semana'],
    requisitos: ['Olla de hierro o apta para horno con tapa', 'Balanza de cocina', 'Paciencia: el pan lleva dos días'],
    etiquetas: ['pan', 'masa madre', 'hogaza', 'fermentacion', 'panaderia', 'levadura natural'],
    modulos: [
      ['La masa madre', [['Arranque y alimentación', 22, 'video', 1], ['Cómo saber si está activa', 12, 'video'], ['Cronograma de alimentación', 3, 'pdf']]],
      ['Amasado y fermentación', [['Autólisis y mezcla', 16, 'video'], ['Pliegues en el bowl', 20, 'video'], ['Fermentación en frío', 10, 'video']]],
      ['Formado y horneado', [['Preformado y formado', 24, 'video'], ['Greñado', 12, 'video'], ['Horneado en olla', 18, 'video']]],
    ],
  },
  {
    id: 'c06', slug: 'medialunas-y-croissants', titulo: 'Medialunas y croissants de manteca', categoria: 'panaderia', nivel: 'Avanzado', modalidad: 'Online, clases grabadas',
    precio: 45000, descuento: 0, destacado: true, nuevo: true, badge: '',
    portada: 'croissants.webp', alt: 'Croissants de manteca recién horneados sobre una rejilla',
    descripcionCorta: 'Masa hojaldrada con manteca, laminado a mano y formado de medialunas y croissants.',
    descripcionCompleta: 'El curso más largo de panadería: masa leudada, empaste de manteca, vueltas de laminado sin que se escape la manteca, formado, leudado y horneado para que se vean las capas.',
    resultados: ['Laminado con tres vueltas simples, sin romper la manteca', 'Medialunas de manteca y croissants con capas a la vista', 'Almíbar y pintado para el brillo'],
    requisitos: ['Haber hecho masas leudadas antes', 'Palote y regla', 'Lugar en la heladera para la masa'],
    etiquetas: ['medialunas', 'croissants', 'hojaldre', 'laminado', 'manteca', 'facturas'],
    modulos: [
      ['Masa y manteca', [['La masa base', 18, 'video', 1], ['Placa de manteca', 14, 'video'], ['Receta y cronograma', 4, 'pdf']]],
      ['Laminado', [['Empaste', 16, 'video'], ['Tres vueltas simples', 28, 'video'], ['Qué hacer si la manteca se rompe', 12, 'video']]],
      ['Formado', [['Cortar los triángulos', 14, 'video'], ['Enrollar medialunas y croissants', 22, 'video'], ['Leudado controlado', 15, 'video']]],
      ['Horno y terminación', [['Pintado y horneado', 18, 'video'], ['Almíbar y brillo', 10, 'video'], ['Congelar y hornear después', 12, 'video']]],
    ],
  },
  {
    id: 'c07', slug: 'alfajores-de-maicena', titulo: 'Alfajores de maicena', categoria: 'alfajores', nivel: 'Inicial', modalidad: 'Online, clases grabadas',
    precio: 22000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'alfajores-maicena.webp', alt: 'Tres alfajores de maicena con dulce de leche y coco rallado en el borde',
    descripcionCorta: 'Tapitas que se deshacen, dulce de leche repostero y coco rallado en el borde.',
    descripcionCompleta: 'La receta de alfajores de maicena con tapitas tiernas que no se quiebran al armar, el punto del dulce de leche y el rebozado en coco, con trucos para hornear tandas parejas.',
    resultados: ['Tapitas de maicena tiernas y del mismo tamaño', 'Armado prolijo con dulce de leche repostero', 'Cómo guardarlos para que sigan tiernos'],
    requisitos: ['Cortante redondo de 5 a 6 cm', 'Placas para horno', 'Manga o cuchara para el relleno'],
    etiquetas: ['alfajores', 'maicena', 'dulce de leche', 'coco', 'tapitas'],
    modulos: [
      ['La masa', [['Cremado y mezcla', 10, 'video', 1], ['Estirado parejo', 8, 'video'], ['Receta de las tapitas', 2, 'pdf']]],
      ['Horneado', [['Cortar y acomodar en la placa', 7, 'video'], ['El punto justo de cocción', 9, 'video'], ['Enfriado', 5, 'video']]],
      ['Armado', [['Rellenar con dulce de leche', 9, 'video'], ['Coco en el borde', 6, 'video'], ['Guardar y regalar', 6, 'video']]],
    ],
  },
  {
    id: 'c08', slug: 'alfajores-banados-en-chocolate', titulo: 'Alfajores bañados en chocolate', categoria: 'alfajores', nivel: 'Intermedio', modalidad: 'Online, clases grabadas',
    precio: 30000, descuento: 0, destacado: true, nuevo: false, badge: '',
    portada: 'alfajores-chocolate.webp', alt: 'Alfajores bañados en chocolate, uno cortado al medio con dulce de leche',
    descripcionCorta: 'Tapas de cacao, relleno generoso de dulce de leche y un baño de chocolate que queda brillante.',
    descripcionCompleta: 'Hacés tapas de cacao húmedas, las armás con dulce de leche y las bañás con chocolate templado o cobertura, para que queden brillantes, parejas y con buen corte.',
    resultados: ['Tapas de cacao tiernas', 'Baño de chocolate brillante y parejo', 'Alfajores listos para empaquetar'],
    requisitos: ['Cortante redondo de 6 a 7 cm', 'Chocolate cobertura semiamargo', 'Rejilla y tenedor de baño'],
    etiquetas: ['alfajores', 'chocolate', 'baño', 'cobertura', 'templado', 'dulce de leche', 'cacao'],
    modulos: [
      ['Tapas de cacao', [['Masa de cacao', 12, 'video', 1], ['Horneado sin que se sequen', 8, 'video'], ['Receta de las tapas', 2, 'pdf']]],
      ['Armado', [['Relleno de dulce de leche', 8, 'video'], ['Prensado parejo', 6, 'video'], ['Reposo antes del baño', 5, 'video']]],
      ['El baño', [['Templado fácil del chocolate', 18, 'video'], ['Bañar y escurrir', 12, 'video'], ['Empaquetado', 8, 'video']]],
    ],
  },
  {
    id: 'c09', slug: 'seminario-tartaletas-de-frutos-rojos', titulo: 'Seminario: tartaletas de frutos rojos', categoria: 'seminarios', nivel: 'Intermedio', modalidad: 'Seminario online, grabado',
    precio: 18000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'tartaletas.webp', alt: 'Tartaletas individuales con crema pastelera, frambuesas y azúcar impalpable',
    descripcionCorta: 'Tartaletas individuales con crema pastelera de vainilla, frambuesas y azúcar impalpable.',
    descripcionCompleta: 'Un seminario corto y enfocado: masa dulce para tartaletas individuales, crema pastelera de vainilla y el armado con frutos rojos para una mesa dulce.',
    resultados: ['Masa dulce que mantiene la forma en moldes chicos', 'Crema pastelera lisa y con cuerpo', 'Una tanda de tartaletas iguales para presentar'],
    requisitos: ['Moldes para tartaletas individuales', 'Manga con pico liso', 'Frutos rojos frescos o congelados'],
    etiquetas: ['tartaletas', 'frutos rojos', 'frambuesas', 'crema pastelera', 'mesa dulce', 'seminario'],
    modulos: [
      ['Masa dulce', [['Masa y forrado de los moldes', 12, 'video', 1], ['Horneado en blanco', 6, 'video'], ['Receta de la masa', 2, 'pdf']]],
      ['Crema pastelera', [['Cocción', 10, 'video'], ['Textura y enfriado', 5, 'video'], ['Saborizar la crema', 5, 'video']]],
      ['Armado', [['Rellenar con manga', 6, 'video'], ['Frutos rojos y brillo', 7, 'video'], ['Presentación', 5, 'video']]],
    ],
  },
  {
    id: 'c10', slug: 'seminario-cremas-y-rellenos', titulo: 'Seminario: cremas y rellenos para tortas', categoria: 'seminarios', nivel: 'Inicial', modalidad: 'Seminario online, grabado',
    precio: 16000, descuento: 0, destacado: false, nuevo: true, badge: '',
    portada: 'cremas.webp', alt: 'Batidor de alambre levantando una crema de manteca suave en un bowl',
    descripcionCorta: 'Chantilly estabilizada, pastelera, buttercream y ganache montada: cuándo usar cada una.',
    descripcionCompleta: 'Cuatro cremas básicas de la pastelería, explicadas para que sepas cuál conviene para rellenar, cuál para cubrir y cuál aguanta mejor fuera de la heladera.',
    resultados: ['Cuatro cremas base, con sus puntos', 'Cuál usar para rellenar y cuál para cubrir', 'Cómo estabilizar la crema para que no se baje'],
    requisitos: ['Batidora', 'Bowl frío para la chantilly', 'Termómetro (opcional)'],
    etiquetas: ['cremas', 'rellenos', 'chantilly', 'buttercream', 'ganache', 'pastelera', 'seminario'],
    modulos: [
      ['Cremas batidas', [['Chantilly estabilizada', 10, 'video', 1], ['Ganache montada', 9, 'video'], ['Recetas de las cremas batidas', 2, 'pdf']]],
      ['Cremas cocidas', [['Crema pastelera', 11, 'video'], ['Crema diplomática', 7, 'video'], ['Errores comunes', 5, 'video']]],
      ['Cremas de manteca', [['Buttercream americano', 8, 'video'], ['Merengue suizo', 10, 'video'], ['Tabla: qué crema para qué torta', 2, 'pdf']]],
    ],
  },
  {
    id: 'c11', slug: 'seminario-galletitas-linzer', titulo: 'Seminario: galletitas linzer para regalar', categoria: 'seminarios', nivel: 'Inicial', modalidad: 'Seminario online, grabado',
    precio: 15000, descuento: 0, destacado: false, nuevo: false, badge: '',
    portada: 'galletitas-linzer.webp', alt: 'Galletitas linzer en forma de corazón y estrella con mermelada y azúcar impalpable',
    descripcionCorta: 'Galletitas de manteca con ventana de mermelada, cortadas en corazones y estrellas.',
    descripcionCompleta: 'Una masa de manteca y almendras que se corta con prolijidad, se hornea pareja y se arma con mermelada de frambuesa. Pensadas para cajas de regalo.',
    resultados: ['Masa de manteca que no se deforma en el horno', 'Galletitas armadas con ventana de mermelada', 'Cajas de regalo listas para entregar'],
    requisitos: ['Cortantes de corazón y estrella', 'Cortante chico para la ventana', 'Palote'],
    etiquetas: ['galletitas', 'linzer', 'mermelada', 'manteca', 'regalo', 'seminario', 'cookies'],
    modulos: [
      ['La masa', [['Masa de manteca y almendras', 9, 'video', 1], ['Reposo y estirado', 7, 'video'], ['Receta de la masa', 2, 'pdf']]],
      ['Corte y horneado', [['Cortar con ventana', 8, 'video'], ['Horneado parejo', 6, 'video'], ['Enfriado', 3, 'video']]],
      ['Armado', [['Mermelada en su punto', 7, 'video'], ['Armado y azúcar impalpable', 6, 'video'], ['Caja de regalo', 5, 'video']]],
    ],
  },
];

CURSOS.forEach((c, i) => {
  c.orden = i;
  c.docenteId = DOCENTE.id;
  c.trailer = null;
  c.modulos = c.modulos.map(([titulo, clases], mi) => ({
    id: `${c.id}-m${mi + 1}`,
    titulo,
    clases: clases.map(([t, duracion, tipo, preview], ci) => ({ id: `${c.id}-m${mi + 1}-c${ci + 1}`, titulo: t, duracion, tipo, preview: !!preview })),
  }));
  const clases = c.modulos.flatMap(m => m.clases);
  c.duracion = clases.reduce((s, k) => s + k.duracion, 0);
  c.cantidadClases = clases.length;
  c.incluye = [`${c.cantidadClases} clases grabadas`, 'Recetas en PDF para descargar', 'Acceso desde tu cuenta de alumno'];
  c.buscable = norm([c.titulo, catNombre(c.categoria), c.nivel, c.modalidad, c.descripcionCorta, c.descripcionCompleta, DOCENTE.nombre, ...c.etiquetas, ...clases.map(k => k.titulo)].join(' '));
});

const getCurso = id => CURSOS.find(c => c.id === id);
const getCursoSlug = slug => CURSOS.find(c => c.slug === slug);

const Cart = {
  KEY: 'cursosalbricia_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => getCurso(i?.id)) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  has(id) { return this.get().some(i => i.id === id); },
  add(curso) {
    if (!curso || this.has(curso.id)) return false;
    const items = this.get();
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); },
  ahorro() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + (c.precio - precioFinal(c)) : s; }, 0); },
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

const imgHTML = c => {
  const [w, h] = IMG_TAM[c.portada] || [1000, 1000];
  return `<img src="images/${c.portada}" width="${w}" height="${h}" alt="${esc(c.alt)}" decoding="async">`;
};

function badgeHTML(c) {
  if (c.descuento > 0) return `<span class="badge">-${c.descuento}%</span>`;
  if (c.badge) return `<span class="badge badge--azul">${esc(c.badge)}</span>`;
  if (c.nuevo) return '<span class="badge">Nuevo</span>';
  return '';
}

function precioHTML(c) {
  const tachado = c.descuento > 0 ? `<s class="descuento-txt">${formatearPrecio(c.precio)}</s>` : '';
  return `<span class="precio"><span class="precio-final">${formatearPrecio(precioFinal(c))}</span>${tachado}</span>`;
}

function metaHTML(c) {
  return `<ul class="meta"><li>${ICON.nivel}${esc(c.nivel)}</li><li>${ICON.reloj}${fmtDur(c.duracion)}</li><li>${ICON.clases}${c.cantidadClases} clases</li></ul>`;
}

function fichaHTML(c) {
  return `<article class="ficha" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <div class="ficha-foto">${imgHTML(c)}${badgeHTML(c)}</div>
    <div class="ficha-body">
      <p class="ficha-cat">${esc(catNombre(c.categoria))}</p>
      <h3 class="ficha-titulo">${esc(c.titulo)}</h3>
      ${metaHTML(c)}
      <div class="ficha-pie">${precioHTML(c)}
        <div class="ficha-acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.slug}">Ver curso</button><button type="button" class="btn btn--sm btn--cta" data-inscribir="${c.id}">Inscribirme</button></div>
      </div>
    </div>
  </article>`;
}

function filaHTML(c, i) {
  return `<article class="fila" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="fila-foto">${imgHTML(c)}</div>
    <div class="fila-info">
      <p class="fila-cat"><span class="fila-num">${String(i + 1).padStart(2, '0')}</span> · ${esc(catNombre(c.categoria))}</p>
      <h3 class="fila-titulo">${esc(c.titulo)}</h3>
      <p class="fila-desc">${esc(c.descripcionCorta)}</p>
      ${metaHTML(c)}
    </div>
    <div class="fila-lado">${badgeHTML(c)}${precioHTML(c)}
      <div class="ficha-acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.slug}">Ver curso</button><button type="button" class="btn btn--sm btn--cta" data-inscribir="${c.id}">Inscribirme</button></div>
    </div>
  </article>`;
}

function cardHTML(c) {
  return `<article class="curso-card" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <button type="button" class="curso-foto" data-ver="${c.slug}" aria-label="Ver el curso ${esc(c.titulo)}">${imgHTML(c)}${badgeHTML(c)}</button>
    <div class="curso-body">
      <p class="curso-cat">${esc(catNombre(c.categoria))}</p>
      <h3 class="curso-titulo"><button type="button" data-ver="${c.slug}">${esc(c.titulo)}</button></h3>
      ${metaHTML(c)}
      <div class="curso-pie">${precioHTML(c)}
        <div class="curso-acciones"><button type="button" class="btn btn--sm btn--linea" data-ver="${c.slug}">Ver curso</button><button type="button" class="btn-icono" data-add="${c.id}" aria-label="Agregar ${esc(c.titulo)} al carrito">${ICON.carritoMas}</button></div>
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

const abiertos = new Set();
function overlay(nombre, abierto) {
  if (abierto) abiertos.add(nombre); else abiertos.delete(nombre);
  const nav = document.getElementById('mainNav');
  document.body.classList.toggle('no-scroll', abiertos.size > 0 || !!nav?.classList.contains('open'));
}

const FOCUSABLES = 'a[href], button:not([disabled]), select, input, summary, [tabindex]:not([tabindex="-1"])';
function atraparFoco(e, cont) {
  if (e.key !== 'Tab' || !cont) return;
  const f = [...cont.querySelectorAll(FOCUSABLES)].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === cont)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const estado = { q: '', cat: '', nivel: '', dur: '', precio: '', orden: 'rec', visibles: 12 };
const POR_TANDA = 12;
let cursoAbierto = '';

function filtrados() {
  const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
  const dur = DURACIONES.find(d => d.id === estado.dur);
  const pre = PRECIOS.find(p => p.id === estado.precio);
  return CURSOS.filter(c =>
    (!estado.cat || c.categoria === estado.cat) &&
    (!estado.nivel || c.nivel === estado.nivel) &&
    (!dur || dur.test(c.duracion)) &&
    (!pre || pre.test(precioFinal(c))) &&
    palabras.every(w => c.buscable.includes(w))
  ).sort(ORDENES[estado.orden] || ORDENES.rec);
}

function syncURL() {
  const p = new URLSearchParams();
  if (estado.cat) p.set('cat', estado.cat);
  if (estado.q) p.set('q', estado.q);
  if (estado.nivel) p.set('nivel', estado.nivel);
  if (estado.dur) p.set('dur', estado.dur);
  if (estado.precio) p.set('precio', estado.precio);
  if (cursoAbierto) p.set('curso', cursoAbierto);
  const qs = p.toString();
  try { history.replaceState(null, '', `${location.pathname}${qs ? '?' + qs : ''}${location.hash}`); } catch (e) { }
}

function filtrosActivos() {
  return [estado.cat, estado.nivel, estado.dur, estado.precio].filter(Boolean).length;
}

function actualizarControles() {
  document.querySelectorAll('[data-chip]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chip === estado.cat)));
  const set = (id, v) => { const el = document.getElementById(id); if (el && el.value !== v) el.value = v; };
  set('fNivel', estado.nivel);
  set('fDur', estado.dur);
  set('fPrecio', estado.precio);
  set('fOrden', estado.orden);
  set('q', estado.q);
  const n = filtrosActivos();
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
}

function actualizarPie(lista) {
  const count = document.getElementById('catCount');
  if (count) count.textContent = `${lista.length} ${lista.length === 1 ? 'curso' : 'cursos'}`;
  document.querySelectorAll('[data-ver-n]').forEach(b => { b.textContent = lista.length ? `Ver ${lista.length} ${lista.length === 1 ? 'curso' : 'cursos'}` : 'Sin resultados'; });
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const mas = document.getElementById('verMas');
  if (mas) mas.hidden = lista.length <= estado.visibles;
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = !(filtrosActivos() || estado.q);
}

function renderCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrados();
  grid.innerHTML = lista.slice(0, estado.visibles).map(cardHTML).join('');
  actualizarControles();
  actualizarPie(lista);
  refreshAddButtons(grid);
  revelarNuevos(grid);
  syncURL();
}

function verMas() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrados();
  const antes = estado.visibles;
  estado.visibles += POR_TANDA;
  grid.insertAdjacentHTML('beforeend', lista.slice(antes, estado.visibles).map(cardHTML).join(''));
  actualizarPie(lista);
  refreshAddButtons(grid);
  revelarNuevos(grid);
}

function initCatalogoUI() {
  const chips = document.getElementById('chipsCat');
  if (!chips) return;
  const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
  chips.innerHTML = opciones.map(o => {
    const n = o.id ? CURSOS.filter(c => c.categoria === o.id).length : CURSOS.length;
    return `<button type="button" class="chip" data-chip="${o.id}" aria-pressed="false"><span>${esc(o.nombre)}</span><span class="chip-n">${n}</span></button>`;
  }).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    estado.cat = b.dataset.chip;
    estado.visibles = POR_TANDA;
    renderCatalogo();
  });
  [['fNivel', 'nivel'], ['fDur', 'dur'], ['fPrecio', 'precio'], ['fOrden', 'orden']].forEach(([id, key]) => {
    document.getElementById(id)?.addEventListener('change', e => {
      estado[key] = e.target.value || (key === 'orden' ? 'rec' : '');
      estado.visibles = POR_TANDA;
      renderCatalogo();
    });
  });
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value.slice(0, 60); estado.visibles = POR_TANDA; renderCatalogo(); }, 180);
  });
  document.getElementById('buscador')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    estado.q = (q?.value || '').slice(0, 60);
    estado.visibles = POR_TANDA;
    renderCatalogo();
    q?.blur();
  });
  const limpiarTodo = () => {
    Object.assign(estado, { q: '', cat: '', nivel: '', dur: '', precio: '', orden: 'rec', visibles: POR_TANDA });
    renderCatalogo();
  };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarTodo));
  document.getElementById('verMas')?.addEventListener('click', verMas);
}

function aplicarCategoria(cat) {
  if (cat && !CATEGORIAS.some(c => c.id === cat)) cat = '';
  Object.assign(estado, { cat, q: '', nivel: '', dur: '', precio: '', visibles: POR_TANDA });
  renderCatalogo();
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initConteos() {
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    const n = CURSOS.filter(c => c.categoria === el.dataset.catCount).length;
    el.textContent = `${n} ${n === 1 ? 'curso' : 'cursos'}`;
  });
}

function renderDestacados() {
  const cont = document.getElementById('destacadosGrid');
  if (!cont) return;
  const orden = ['c02', 'c04', 'c08', 'c06'];
  const lista = orden.map(getCurso).filter(c => c?.destacado).slice(0, 4);
  cont.innerHTML = cont.dataset.variante === 'filas' ? lista.map(filaHTML).join('') : lista.map(fichaHTML).join('');
  refreshAddButtons(cont);
}

function refreshAddButtons(cont = document) {
  const ids = new Set(Cart.get().map(i => i.id));
  cont.querySelectorAll('[data-add]').forEach(b => {
    const c = getCurso(b.dataset.add);
    if (!c) return;
    const en = ids.has(c.id);
    b.classList.toggle('en-carrito', en);
    b.setAttribute('aria-pressed', String(en));
    if (b.classList.contains('btn-icono')) b.setAttribute('aria-label', en ? `${c.titulo}: ya está en tu carrito` : `Agregar ${c.titulo} al carrito`);
    else b.textContent = en ? 'Ya está en tu carrito' : 'Agregar al carrito';
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function agregar(id) {
  const c = getCurso(id);
  if (!c) return;
  if (Cart.add(c)) showToast(`Sumaste «${c.titulo}» a tu carrito.`);
  else showToast('Ese curso ya está en tu carrito.');
}

function modalHTML(c) {
  const msg = `Hola! Quiero consultar por el curso «${c.titulo}» de Cursos Albricia.`;
  const lista = arr => `<ul class="mc-lista">${arr.map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>`;
  const modulos = c.modulos.map((m, i) => {
    const min = m.clases.reduce((s, k) => s + k.duracion, 0);
    const clases = m.clases.map(k => `<li class="clase">${k.tipo === 'pdf' ? ICON.pdf : ICON.video}<span>${esc(k.titulo)}${k.preview ? '<span class="tag-preview">Vista previa</span>' : ''}</span><span class="clase-dur">${k.tipo === 'pdf' ? 'PDF' : fmtDur(k.duracion)}</span></li>`).join('');
    return `<details class="modulo"${i === 0 ? ' open' : ''}><summary><span class="modulo-tit"><span>Módulo ${i + 1}</span><strong>${esc(m.titulo)}</strong></span><span class="modulo-dur">${m.clases.length} clases · ${fmtDur(min)}<span class="mas-menos" aria-hidden="true"></span></span></summary><ol class="clases">${clases}</ol></details>`;
  }).join('');
  return `<div class="mc-top">
      <div class="mc-foto">${imgHTML(c)}</div>
      <div class="mc-info">
        <p class="ficha-cat">${esc(catNombre(c.categoria))}</p>
        <h2>${esc(c.titulo)}</h2>
        <p class="mc-desc">${esc(c.descripcionCompleta)}</p>
        <dl class="mc-datos">
          <div><dt>Duración</dt><dd>${fmtDur(c.duracion)}</dd></div>
          <div><dt>Clases</dt><dd>${c.cantidadClases} en ${c.modulos.length} módulos</dd></div>
          <div><dt>Nivel</dt><dd>${esc(c.nivel)}</dd></div>
          <div><dt>Modalidad</dt><dd>${esc(c.modalidad)}</dd></div>
        </dl>
        <div class="mc-compra">${badgeHTML(c)}${precioHTML(c)}</div>
        <div class="mc-botones"><button type="button" class="btn btn--cta" data-inscribir="${c.id}">Inscribirme</button><button type="button" class="btn btn--linea" data-add="${c.id}">Agregar al carrito</button></div>
      </div>
    </div>
    <div class="mc-cuerpo">
      <div class="mc-bloque">
        <h3>Programa</h3>
        ${modulos}
      </div>
      <div>
        <div class="mc-bloque"><h3>Lo que vas a lograr</h3>${lista(c.resultados)}</div>
        <div class="mc-bloque"><h3>Antes de empezar</h3>${lista(c.requisitos)}</div>
        <div class="mc-bloque"><h3>Incluye</h3>${lista(c.incluye)}</div>
        <div class="mc-bloque mc-docente"><span class="mc-docente-sello">${ICON.batidor}</span><p><strong>Quién enseña</strong>${esc(DOCENTE.bio)}</p></div>
        <a class="mc-wsp" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por este curso</a>
      </div>
    </div>`;
}

let modalOrigen = null;
function abrirCurso(slug, origen) {
  const c = getCursoSlug(slug);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modalContenido');
  if (!c || !modal || !cont) return;
  cont.innerHTML = modalHTML(c);
  refreshAddButtons(cont);
  modalOrigen = origen || document.activeElement;
  modal.hidden = false;
  overlay('modal', true);
  const panel = modal.querySelector('.modal-panel');
  panel.scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  panel.focus({ preventScroll: true });
  cursoAbierto = c.slug;
  syncURL();
}

function cerrarModal(devolverFoco = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  overlay('modal', false);
  cursoAbierto = '';
  syncURL();
  setTimeout(() => { if (!modal.classList.contains('open')) modal.hidden = true; }, reduceMotion ? 0 : 320);
  if (devolverFoco && modalOrigen && document.contains(modalOrigen)) modalOrigen.focus({ preventScroll: true });
}

let drawerOrigen = null;
function renderDrawer() {
  const items = document.getElementById('drawerItems');
  const pie = document.getElementById('drawerPie');
  if (!items || !pie) return;
  const lista = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!lista.length) {
    items.innerHTML = `<div class="d-vacio">${ICON.libro}<p><strong>Todavía no elegiste ningún curso.</strong></p><p>Mirá los programas y sumá el que más te tiente.</p><button type="button" class="btn btn--cta" data-ir-catalogo>Ver los cursos</button></div>`;
    pie.hidden = true;
    return;
  }
  pie.hidden = false;
  items.innerHTML = lista.map(c => `<div class="d-item"><div class="d-foto">${imgHTML(c)}</div><div class="d-info"><strong>${esc(c.titulo)}</strong><span>${esc(c.modalidad)} · ${fmtDur(c.duracion)}</span></div><div class="d-lado">${precioHTML(c)}<button type="button" class="d-quitar" data-quitar="${c.id}" aria-label="Quitar ${esc(c.titulo)} del carrito">Quitar</button></div></div>`).join('');
  const sub = lista.reduce((s, c) => s + c.precio, 0);
  const ahorro = Cart.ahorro();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dSub', formatearPrecio(sub));
  set('dAhorro', '-' + formatearPrecio(ahorro));
  set('dTotal', formatearPrecio(Cart.total()));
  const fila = document.getElementById('dAhorroFila');
  if (fila) fila.hidden = ahorro <= 0;
}

function abrirDrawer(origen) {
  const d = document.getElementById('drawer');
  if (!d) return;
  renderDrawer();
  drawerOrigen = origen || document.activeElement;
  d.hidden = false;
  overlay('drawer', true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  d.querySelector('.drawer-panel')?.focus({ preventScroll: true });
}

function cerrarDrawer(devolverFoco = true) {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  overlay('drawer', false);
  setTimeout(() => { if (!d.classList.contains('open')) d.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolverFoco && drawerOrigen && document.contains(drawerOrigen)) drawerOrigen.focus({ preventScroll: true });
}

function inscribir(id) {
  const c = getCurso(id);
  if (!c) return;
  Cart.add(c);
  const modal = document.getElementById('modal');
  const desdeModal = modal && !modal.hidden;
  if (desdeModal) cerrarModal(false);
  abrirDrawer(desdeModal ? modalOrigen : document.activeElement);
}

let cerrarFiltros = () => { };
function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const btn = document.getElementById('abrirFiltros');
  if (!panel || !btn) return;
  let fondo = document.querySelector('.filtros-fondo');
  if (!fondo) { fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; document.body.appendChild(fondo); }
  const mq = window.matchMedia('(max-width: 768px)');
  const abrir = () => {
    panel.classList.add('open'); fondo.classList.add('open'); panel.removeAttribute('inert');
    btn.setAttribute('aria-expanded', 'true'); overlay('filtros', true);
    panel.querySelector('button, select')?.focus();
  };
  const cerrar = (foco = true) => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); fondo.classList.remove('open');
    if (mq.matches) panel.setAttribute('inert', '');
    btn.setAttribute('aria-expanded', 'false'); overlay('filtros', false);
    if (foco) btn.focus();
  };
  btn.addEventListener('click', abrir);
  fondo.addEventListener('click', () => cerrar());
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
  panel.addEventListener('keydown', e => { if (panel.classList.contains('open')) atraparFoco(e, panel); });
  const sync = () => {
    if (!mq.matches) { cerrar(false); panel.removeAttribute('inert'); }
    else if (!panel.classList.contains('open')) panel.setAttribute('inert', '');
  };
  mq.addEventListener('change', sync);
  sync();
  cerrarFiltros = cerrar;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const t = e.target;
    const ver = t.closest('[data-ver]');
    if (ver) { e.preventDefault(); abrirCurso(ver.dataset.ver, ver); return; }
    const ins = t.closest('[data-inscribir]');
    if (ins) { e.preventDefault(); inscribir(ins.dataset.inscribir); return; }
    const add = t.closest('[data-add]');
    if (add) { e.preventDefault(); agregar(add.dataset.add); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) {
      const c = getCurso(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      if (c) showToast(`Sacaste «${c.titulo}» del carrito.`);
      document.querySelector('.drawer-panel')?.focus({ preventScroll: true });
      return;
    }
    const cat = t.closest('[data-cat]');
    if (cat) { e.preventDefault(); aplicarCategoria(cat.dataset.cat); return; }
    if (t.closest('[data-cart-open]')) { abrirDrawer(t.closest('[data-cart-open]')); return; }
    if (t.closest('[data-cerrar]')) { cerrarModal(); return; }
    if (t.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (t.closest('[data-ir-catalogo]')) {
      cerrarDrawer(false);
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    if (t.closest('[data-acceso]')) { showToast('El acceso de alumnos se activa al pasar la plataforma a producción.'); return; }
    if (t.closest('[data-finalizar]')) { showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.'); }
  });
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('drawer');
    const modal = document.getElementById('modal');
    const drawerAbierto = drawer && !drawer.hidden;
    const modalAbierto = modal && !modal.hidden;
    if (e.key === 'Escape') {
      if (drawerAbierto) cerrarDrawer();
      else if (modalAbierto) cerrarModal();
      else if (abiertos.has('filtros')) cerrarFiltros();
      return;
    }
    if (drawerAbierto) atraparFoco(e, drawer.querySelector('.drawer-panel'));
    else if (modalAbierto) atraparFoco(e, modal.querySelector('.modal-panel'));
  });
  document.addEventListener('cart:updated', () => { refreshAddButtons(); renderDrawer(); });
  document.addEventListener('cart:updated', updateCartBadge);
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
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
  nav.querySelectorAll('a, [data-acceso]').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

function leerURL() {
  const p = new URLSearchParams(location.search);
  const cat = p.get('cat');
  if (cat && CATEGORIAS.some(c => c.id === cat)) estado.cat = cat;
  const nivel = p.get('nivel');
  if (NIVELES.includes(nivel)) estado.nivel = nivel;
  const dur = p.get('dur');
  if (DURACIONES.some(d => d.id === dur)) estado.dur = dur;
  const precio = p.get('precio');
  if (PRECIOS.some(x => x.id === precio)) estado.precio = precio;
  const q = p.get('q');
  if (q) estado.q = q.slice(0, 60);
  const curso = p.get('curso');
  return curso && getCursoSlug(curso) ? curso : '';
}

const cursoInicial = leerURL();
initConteos();
initCatalogoUI();
renderDestacados();
renderCatalogo();
initReveals();
initNav();
initModelBarScroll();
initAcciones();
initFloats();
initFiltrosDrawer();
updateCartBadge();
if (cursoInicial) abrirCurso(cursoInicial, null);
