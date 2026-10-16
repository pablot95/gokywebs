'use strict';

const nada = () => {};

const WSP = '5491128451300';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
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

const LANG_KEY = 'punchcolor_lang';
let LANG = (() => {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'es' || q === 'en') { localStorage.setItem(LANG_KEY, q); return q; }
    const g = localStorage.getItem(LANG_KEY);
    if (g === 'es' || g === 'en') return g;
  } catch { nada(); }
  return /^es\b/i.test(navigator.language || 'es') ? 'es' : 'en';
})();
const T = (es, en) => (LANG === 'en' ? en : es);
const tx = v => (Array.isArray(v) ? (LANG === 'en' ? v[1] : v[0]) : v);

const EN = {
  'hero.eyebrow': 'Original prints',
  'hero.h1': 'Backpacks, pencil cases and planners that add color to every day',
  'hero.lead': 'Cats, stars and geometric prints on backpacks, pencil cases and organizers that match each other. Pick your print and take it everywhere.',
  'hero.cta': 'Shop now',
  'hero.wsp': 'Ask on WhatsApp',
  'hero.pagos': 'Pay with Mercado Pago or, from abroad, with Payoneer.',
  'nav.tienda': 'Shop',
  'nav.verTodo': 'See the whole catalog',
  'nav.estampas': 'Prints',
  'nav.resenas': 'Reviews',
  'nav.visita': 'Hours & assistant',
  'hdr.consultas': 'Questions',
  'cats.h2': 'What are you looking for?',
  'rail.h2': 'House favorites',
  'rail.h2b': 'Just in',
  'rail.verTodo': 'See all',
  'marca.h2': 'Prints you won’t find on any other backpack',
  'marca.p': 'Punch Color is a designer’s brand: every print is original and repeats on backpack, pencil case and organizer, so everything matches. Fun, yes, and made to be used every day.',
  'marca.p1t': 'Original design',
  'marca.p1': 'Prints are drawn for Punch Color: no off-the-shelf fabrics.',
  'marca.p2t': 'Made for every day',
  'marca.p2': 'Zippers, handles and pockets for school, college or the office.',
  'marca.p3t': 'Everything matches',
  'marca.p3': 'Each print has its backpack, its organizer and its full set.',
  'tienda.h2': 'Pick your print',
  'tienda.lead': 'Each print has its backpack, its organizer and its set.',
  'tienda.cta': 'See the whole catalog',
  'gal.h2': 'Up close',
  'gal.lead': 'Tap a photo to see it bigger.',
  'res.h2': 'Reviews from people who use Punch Color',
  'res.vacio': 'No reviews published yet. The first one could be yours: tell us which print you chose and how it worked out.',
  'res.recomendar': 'Recommend Punch Color on WhatsApp',
  'res.formT': 'Tell us what you think',
  'res.nombre': 'Your name',
  'res.producto': 'What did you buy?',
  'res.elegir': 'Choose a product',
  'res.puntaje': 'Your rating',
  'res.texto': 'Your review',
  'res.ok': 'I agree that Punch Color may publish my review with my name.',
  'res.enviar': 'Send my review',
  'res.errNombre': 'Add your name to sign the review.',
  'res.errProducto': 'Choose the product you use.',
  'res.errEstrellas': 'Pick from 1 to 5 stars.',
  'res.errTexto': 'Write at least a few words (10 letters).',
  'res.errOk': 'We need your OK to publish it.',
  'vis.h2': 'Visit the shop or ask our assistant',
  'vis.dirL': 'Address',
  'vis.dirNota': '· inside Librería Colorete',
  'vis.horasL': 'Opening hours',
  'vis.lv': 'Monday to Friday',
  'vis.lvH': '9 am–1 pm and 4–8 pm',
  'vis.sab': 'Saturday',
  'vis.sabH': '9 am–1 pm',
  'vis.dom': 'Sunday',
  'vis.cerrado': 'Closed',
  'bot.nombre': 'Punch Color assistant',
  'bot.estado': 'Answers right away, at any time',
  'cierre.h2': 'Picked your print yet?',
  'cierre.p': 'Buy online from any country, or message us on WhatsApp and we’ll help you choose.',
  'foot.p': 'Backpacks, pencil cases, planners and organizers with original prints.',
  'foot.tienda': 'Shop',
  'foot.ayuda': 'Help',
  'foot.asistente': 'Assistant and hours',
  'foot.pagos': 'Payment methods',
  'foot.ar': 'Orders from Argentina',
  'foot.ext': 'Orders from other countries',
  'cart.t': 'Your cart',
  'cat.inicio': 'Home',
  'cat.tienda': 'Shop',
  'cat.h1': 'Punch Color shop',
  'cat.lead': 'Backpacks, pencil cases, planners, organizers and bags with original prints. Filter by print and mix and match.',
  'cat.filtrar': 'Filter',
  'cat.categoria': 'Category',
  'cat.estampa': 'Print',
  'cat.precio': 'Price',
  'cat.limpiar': 'Clear filters',
  'cat.filtros': 'Filters',
  'cat.ordenar': 'Sort by',
  'cat.buscar': 'Search',
  'cat.vacioT': 'Nothing matches that search',
  'cat.vacioP': 'Try another word or remove a filter. You can also ask us on WhatsApp.',
  'cat.preguntar': 'Ask on WhatsApp',
  'cat.verMas': 'Load more',
  'cat.verRes': 'See results',
  'a.cerrarMenu': 'Close menu',
  'a.abrirMenu': 'Open menu',
  'a.inicio': 'Punch Color, home',
  'a.buscar': 'Search',
  'a.buscarProd': 'Search products',
  'a.buscarBtn': 'Search',
  'a.abrirCarrito': 'Open cart',
  'a.anteriores': 'Previous',
  'a.siguientes': 'Next',
  'a.estampas': 'Prints',
  'a.categorias': 'Categories',
  'a.est5': '5 stars',
  'a.est4': '4 stars',
  'a.est3': '3 stars',
  'a.est2': '2 stars',
  'a.est1': '1 star',
  'a.mapa': 'Map: Saavedra 589',
  'a.botLog': 'Conversation with the assistant',
  'a.botInput': 'Your question for the assistant',
  'a.botEnviar': 'Send question',
  'a.miga': 'Breadcrumb',
  'a.catalogo': 'Catalog',
  'a.filtros': 'Filters',
  'a.cerrarFiltros': 'Close filters',
  'a.filtrarEstampa': 'Filter by print',
  'a.catBuscar': 'Search the shop',
  'a.wsp': 'Message us on WhatsApp',
  'a.tuCarrito': 'Your cart',
  'a.cerrarCarrito': 'Close cart',
  'a.vistaRapida': 'Product quick view',
  'a.cerrar': 'Close',
  'a.fotoAmpliada': 'Enlarged photo',
  'a.fotoAnt': 'Previous photo',
  'a.fotoSig': 'Next photo',
  'ph.nombre': 'E.g.: Sofi from Rosario',
  'ph.texto': 'How did it work out day to day?',
  'ph.bot': 'Type your question',
  'ph.catBuscar': 'Search: backpack, cats, planner…',
  'alt.heroCartucheras': 'Two Night Cats pencil tubes: a cream cat and a blue cat among stars and moons',
  'alt.mochilaVert': 'Night Cats backpack from the front: red, white and blue cats among stars on a black background',
  'alt.detalle': 'Fabric close-up: a sleeping white cat and stars next to the red zipper',
  'alt.g0': 'Girl from behind wearing the Night Cats backpack and a red sweater',
  'alt.g1': 'Pop Geometry backpack and folding organizer on a white table',
  'alt.g2': 'Night Cats planner, notebook and pencil cases on a white desk with red supplies',
  'alt.g3': 'Cats in Orbit backpack and organizer, with purple cats and colorful planets',
  'alt.g4': 'Night Cats set: backpack, planner and pencil case together',
  'alt.local': 'Front of Librería Colorete with its round signs and the sidewalk painted in colors',
};
const TITULOS = {
  home: ['Punch Color — Mochilas, cartucheras y agendas de diseño propio', 'Punch Color — Backpacks, pencil cases and planners with original prints'],
  catalogo: ['Tienda — Punch Color', 'Shop — Punch Color'],
};

const CATEGORIAS = [
  { id: 'mochilas', n: ['Mochilas', 'Backpacks'], img: 'images/p-mochila-gatos-noche.webp' },
  { id: 'cartucheras', n: ['Cartucheras', 'Pencil cases'], img: 'images/p-cartuchera-tubo.webp' },
  { id: 'organizadores', n: ['Organizadores', 'Organizers'], img: 'images/p-organizador-orbita.webp' },
  { id: 'agendas', n: ['Agendas', 'Planners'], img: 'images/p-agenda-gatos-noche.webp' },
  { id: 'bolsos', n: ['Bolsos', 'Bags'], img: 'images/p-tote-gatos-noche.webp' },
  { id: 'sets', n: ['Sets', 'Sets'], img: 'images/p-set-geometria.webp' },
];
const ESTAMPAS = [
  { id: 'gatos-de-noche', n: ['Gatos de noche', 'Night Cats'], sw: 'images/g-detalle.webp', sp: '78% 62%', sz: '260%', escena: 'images/g-coleccion.webp',
    d: ['Gatos que duermen entre lunas, estrellas y hojas, sobre fondo negro.', 'Cats napping among moons, stars and leaves on a black background.'] },
  { id: 'geometria-pop', n: ['Geometría pop', 'Pop Geometry'], sw: 'images/p-mochila-geometria.webp', sp: '40% 30%', sz: '320%', escena: 'images/g-geometria.webp',
    d: ['Bloques de fucsia, amarillo y turquesa cortados por líneas negras.', 'Blocks of fuchsia, yellow and turquoise cut by black lines.'] },
  { id: 'gatos-en-orbita', n: ['Gatos en órbita', 'Cats in Orbit'], sw: 'images/p-mochila-orbita.webp', sp: '55% 42%', sz: '300%', escena: 'images/g-orbita.webp',
    d: ['Gatos violetas que flotan entre planetas, estrellas y franjas de color.', 'Purple cats floating among planets, stars and stripes of color.'] },
  { id: 'radar-turquesa', n: ['Radar turquesa', 'Turquoise Radar'], sw: 'images/p-mochila-radar.webp', sp: '50% 32%', sz: '300%', escena: 'images/g-radar.webp',
    d: ['Círculos de radar, triángulos y destellos en gris, turquesa y amarillo.', 'Radar circles, triangles and sparks in gray, turquoise and yellow.'] },
];
const PRECIOS = [
  { id: 'hasta', n: ['Hasta $25.000', 'Up to US$ 22'], ars: [-1, 25000], usd: [-1, 22] },
  { id: 'medio', n: ['$25.000 a $70.000', 'US$ 22 to US$ 60'], ars: [25000, 70000], usd: [22, 60] },
  { id: 'mas', n: ['Más de $70.000', 'Over US$ 60'], ars: [70000, Infinity], usd: [60, Infinity] },
];
const ORDENES = [
  { id: 'destacados', n: ['Destacados', 'Featured'] },
  { id: 'nuevos', n: ['Más nuevos', 'Newest'] },
  { id: 'precio-asc', n: ['Menor precio', 'Price: low to high'] },
  { id: 'precio-desc', n: ['Mayor precio', 'Price: high to low'] },
  { id: 'nombre', n: ['Nombre (A-Z)', 'Name (A-Z)'] },
];

const MED_MOCHILA = ['40 × 30 × 13 cm', '15.7 × 11.8 × 5.1 in'];
const MED_ORG = ['24 × 13 cm cerrado', '9.4 × 5.1 in closed'];
const D_MOCHILA_DOBLE = ['Mochila con bolsillo frontal de doble cierre, bolsillo lateral y manija acolchada.', 'Backpack with a double-zip front pocket, side pocket and padded handle.'];
const D_ORG = ['Organizador que se pliega como un libro y entra en la mochila: tus útiles ordenados y a mano.', 'Organizer that folds like a book and fits in your backpack: your supplies tidy and at hand.'];

const Tienda = crearTienda([
  { id: 'mochila-gatos-de-noche', cat: 'mochilas', est: 'gatos-de-noche', destacado: true, rango: 1, alta: 6, stock: 8, precio: 72000, usd: 62,
    n: ['Mochila Gatos de noche', 'Night Cats Backpack'],
    d: ['Mochila con bolsillo frontal con cierre, manija y tiradores rojos. La estampa Gatos de noche la cubre de punta a punta: gatos que duermen entre lunas, estrellas y hojas.', 'Backpack with a zippered front pocket, top handle and red zipper pulls. The Night Cats print covers it end to end: cats napping among moons, stars and leaves.'],
    med: MED_MOCHILA, img: 'images/p-mochila-gatos-noche.webp', gal: ['images/g-en-uso.webp', 'images/g-detalle.webp'],
    alt: ['Mochila negra con gatos rojos, blancos y azules entre estrellas', 'Black backpack with red, white and blue cats among stars'], tags: 'gato gatos estrellas luna negra escuela cat cats stars moon black school' },
  { id: 'mochila-geometria-pop', cat: 'mochilas', est: 'geometria-pop', destacado: true, rango: 2, alta: 9, stock: 7, precio: 68000, usd: 58, etiqueta: 'nuevo',
    n: ['Mochila Geometría pop', 'Pop Geometry Backpack'],
    d: [D_MOCHILA_DOBLE[0] + ' Bloques de fucsia, amarillo y turquesa cortados por líneas negras.', D_MOCHILA_DOBLE[1] + ' Blocks of fuchsia, yellow and turquoise cut by black lines.'],
    med: MED_MOCHILA, img: 'images/p-mochila-geometria.webp', gal: ['images/g-geometria.webp'],
    alt: ['Mochila con bloques fucsia, amarillos y turquesa y líneas negras', 'Backpack with fuchsia, yellow and turquoise blocks and black lines'], tags: 'geometrica geometria colores fucsia amarillo turquesa geometric colorful' },
  { id: 'cartuchera-tubo-gatos-de-noche', cat: 'cartucheras', est: 'gatos-de-noche', destacado: true, rango: 3, alta: 5, stock: 14, precio: 19500, usd: 17,
    n: ['Cartuchera tubo Gatos de noche', 'Night Cats Pencil Tube'],
    d: ['Cartuchera tubo con cierre rojo y tirador redondo. Viene en dos diseños: con el gato crema o con el gato azul.', 'Tube pencil case with a red zipper and round pull. Comes in two designs: the cream cat or the blue cat.'],
    med: ['21 × 8 × 8 cm', '8.3 × 3.1 × 3.1 in'], img: 'images/p-cartuchera-tubo.webp', gal: ['images/hero-cartucheras.webp'],
    vars: [{ id: 'crema', n: ['Gato crema', 'Cream cat'], img: 'images/p-cartuchera-crema.webp' }, { id: 'azul', n: ['Gato azul', 'Blue cat'], img: 'images/p-cartuchera-azul.webp' }],
    alt: ['Dos cartucheras tubo negras, una con un gato crema y otra con un gato azul', 'Two black pencil tubes, one with a cream cat and one with a blue cat'], tags: 'cartuchera lapicera estuche tubo gato gatos pencil case pouch cat' },
  { id: 'agenda-gatos-de-noche', cat: 'agendas', est: 'gatos-de-noche', destacado: true, rango: 4, alta: 4, stock: 10, precio: 28000, usd: 24,
    n: ['Agenda Gatos de noche', 'Night Cats Planner'],
    d: ['Agenda anillada con tapa dura, elástico rojo para cerrarla y un gato crema entre lunas y estrellas en la tapa.', 'Spiral-bound planner with a hard cover, red elastic band and a cream cat among moons and stars on the cover.'],
    med: ['A5 · 15 × 21 cm', 'A5 · 5.9 × 8.3 in'], img: 'images/p-agenda-gatos-noche.webp', gal: ['images/g-agenda.webp'],
    alt: ['Agenda anillada negra con un gato crema, una luna roja y estrellas', 'Black spiral planner with a cream cat, a red moon and stars'], tags: 'agenda cuaderno anillado planner notebook diary gato cat' },
  { id: 'tote-gatos-de-noche', cat: 'bolsos', est: 'gatos-de-noche', destacado: true, rango: 5, alta: 2, stock: 3, precio: 34000, usd: 29,
    n: ['Bolso tote Gatos de noche', 'Night Cats Tote Bag'],
    d: ['Bolso tote con manijas largas para llevar al hombro: un gato rojo y uno azul entre estrellas, hojas y una luna.', 'Tote bag with long shoulder handles: a red cat and a blue cat among stars, leaves and a moon.'],
    med: ['38 × 40 cm', '15 × 15.7 in'], img: 'images/p-tote-gatos-noche.webp', gal: [],
    alt: ['Bolso tote negro con un gato rojo y uno azul entre estrellas', 'Black tote bag with a red cat and a blue cat among stars'], tags: 'bolso tote cartera bag shopper gato cat' },
  { id: 'organizador-escritorio-gatos-de-noche', cat: 'organizadores', est: 'gatos-de-noche', destacado: true, rango: 6, alta: 3, stock: 6, precio: 26000, usd: 23,
    n: ['Organizador de escritorio Gatos de noche', 'Night Cats Desk Organizer'],
    d: ['Organizador de escritorio con dos compartimentos: uno para lápices y tijeras, otro para anotadores y post-its.', 'Desk organizer with two compartments: one for pens and scissors, one for notepads and sticky notes.'],
    med: ['22 × 11 × 10 cm', '8.7 × 4.3 × 3.9 in'], img: 'images/p-organizador-escritorio.webp', gal: [],
    alt: ['Organizador de escritorio negro con gatos, con lápices, tijera y anotadores', 'Black desk organizer with cats, holding pens, scissors and notepads'], tags: 'organizador escritorio portalapices desk organizer pen holder oficina office gato cat' },
  { id: 'mochila-gatos-en-orbita', cat: 'mochilas', est: 'gatos-en-orbita', destacado: true, rango: 7, alta: 12, stock: 6, precio: 68000, usd: 58, etiqueta: 'nuevo',
    n: ['Mochila Gatos en órbita', 'Cats in Orbit Backpack'],
    d: [D_MOCHILA_DOBLE[0] + ' Gatos violetas que flotan entre planetas, estrellas y franjas de fucsia, amarillo y turquesa.', D_MOCHILA_DOBLE[1] + ' Purple cats floating among planets, stars and stripes of fuchsia, yellow and turquoise.'],
    med: MED_MOCHILA, img: 'images/p-mochila-orbita.webp', gal: ['images/g-orbita.webp'],
    alt: ['Mochila fucsia, amarilla y turquesa con gatos violetas y planetas', 'Fuchsia, yellow and turquoise backpack with purple cats and planets'], tags: 'gato gatos planetas espacio rosa fucsia cat cats planets space pink' },
  { id: 'set-gatos-de-noche', cat: 'sets', est: 'gatos-de-noche', rango: 8, alta: 1, stock: 5, precio: 109000, usd: 94,
    n: ['Set Gatos de noche: mochila, cartuchera y agenda', 'Night Cats Set: backpack, pencil case and planner'],
    d: ['Las tres piezas con la misma estampa: la mochila, la cartuchera tubo con el gato crema y la agenda anillada.', 'All three pieces in the same print: the backpack, the cream-cat pencil tube and the spiral planner.'],
    med: ['Mochila 40 × 30 × 13 cm · cartuchera 21 × 8 × 8 cm · agenda A5', 'Backpack 15.7 × 11.8 × 5.1 in · pencil tube 8.3 × 3.1 in · A5 planner'],
    img: 'images/p-set-gatos-noche.webp', gal: ['images/g-set.webp', 'images/g-coleccion.webp'],
    alt: ['Mochila, agenda y cartuchera Gatos de noche juntas', 'Night Cats backpack, planner and pencil case together'], tags: 'set combo regalo kit escolar gift school' },
  { id: 'organizador-geometria-pop', cat: 'organizadores', est: 'geometria-pop', rango: 9, alta: 8, stock: 9, precio: 24000, usd: 21,
    n: ['Organizador plegable Geometría pop', 'Pop Geometry Folding Organizer'],
    d: [D_ORG[0] + ' Misma estampa que la mochila Geometría pop.', D_ORG[1] + ' Same print as the Pop Geometry backpack.'],
    med: MED_ORG, img: 'images/p-organizador-geometria.webp', gal: ['images/g-geometria.webp'],
    alt: ['Organizador plegable con bloques fucsia, amarillos y turquesa', 'Folding organizer with fuchsia, yellow and turquoise blocks'], tags: 'organizador plegable estuche cartuchera folding organizer pencil case geometrica geometric' },
  { id: 'set-geometria-pop', cat: 'sets', est: 'geometria-pop', rango: 10, alta: 7, stock: 4, precio: 86000, usd: 74,
    n: ['Set Geometría pop: mochila y organizador', 'Pop Geometry Set: backpack and organizer'],
    d: ['La mochila y el organizador plegable con la misma estampa, listos para arrancar el año.', 'The backpack and folding organizer in the same print, ready for the new school year.'],
    med: ['Mochila 40 × 30 × 13 cm · organizador 24 × 13 cm', 'Backpack 15.7 × 11.8 × 5.1 in · organizer 9.4 × 5.1 in'],
    img: 'images/p-set-geometria.webp', gal: ['images/g-geometria.webp'],
    alt: ['Mochila y organizador Geometría pop juntos', 'Pop Geometry backpack and organizer together'], tags: 'set combo regalo kit escolar gift school geometrica geometric' },
  { id: 'organizador-gatos-en-orbita', cat: 'organizadores', est: 'gatos-en-orbita', rango: 11, alta: 11, stock: 8, precio: 24000, usd: 21,
    n: ['Organizador plegable Gatos en órbita', 'Cats in Orbit Folding Organizer'],
    d: [D_ORG[0] + ' Misma estampa que la mochila Gatos en órbita.', D_ORG[1] + ' Same print as the Cats in Orbit backpack.'],
    med: MED_ORG, img: 'images/p-organizador-orbita.webp', gal: ['images/g-orbita.webp'],
    alt: ['Organizador plegable fucsia y amarillo con gatos violetas', 'Fuchsia and yellow folding organizer with purple cats'], tags: 'organizador plegable estuche cartuchera folding organizer pencil case gato cat planetas' },
  { id: 'set-gatos-en-orbita', cat: 'sets', est: 'gatos-en-orbita', rango: 12, alta: 10, stock: 4, precio: 86000, usd: 74,
    n: ['Set Gatos en órbita: mochila y organizador', 'Cats in Orbit Set: backpack and organizer'],
    d: ['La mochila y el organizador plegable con la misma estampa, listos para arrancar el año.', 'The backpack and folding organizer in the same print, ready for the new school year.'],
    med: ['Mochila 40 × 30 × 13 cm · organizador 24 × 13 cm', 'Backpack 15.7 × 11.8 × 5.1 in · organizer 9.4 × 5.1 in'],
    img: 'images/p-set-orbita.webp', gal: ['images/g-orbita.webp'],
    alt: ['Mochila y organizador Gatos en órbita juntos', 'Cats in Orbit backpack and organizer together'], tags: 'set combo regalo kit escolar gift school gato cat' },
  { id: 'mochila-radar-turquesa', cat: 'mochilas', est: 'radar-turquesa', rango: 13, alta: 15, stock: 5, precio: 68000, usd: 58, etiqueta: 'nuevo',
    n: ['Mochila Radar turquesa', 'Turquoise Radar Backpack'],
    d: [D_MOCHILA_DOBLE[0] + ' Círculos de radar, triángulos y destellos en gris, turquesa y amarillo, con un toque de rojo.', D_MOCHILA_DOBLE[1] + ' Radar circles, triangles and sparks in gray, turquoise and yellow, with a touch of red.'],
    med: MED_MOCHILA, img: 'images/p-mochila-radar.webp', gal: ['images/g-radar.webp'],
    alt: ['Mochila gris y turquesa con círculos de radar y triángulos', 'Gray and turquoise backpack with radar circles and triangles'], tags: 'gris turquesa retro radar geometrica gray grey turquoise teal geometric' },
  { id: 'organizador-radar-turquesa', cat: 'organizadores', est: 'radar-turquesa', rango: 14, alta: 14, stock: 7, precio: 24000, usd: 21,
    n: ['Organizador plegable Radar turquesa', 'Turquoise Radar Folding Organizer'],
    d: [D_ORG[0] + ' Misma estampa que la mochila Radar turquesa.', D_ORG[1] + ' Same print as the Turquoise Radar backpack.'],
    med: MED_ORG, img: 'images/p-organizador-radar.webp', gal: ['images/g-radar.webp'],
    alt: ['Organizador plegable gris con un círculo amarillo y triángulos', 'Gray folding organizer with a yellow circle and triangles'], tags: 'organizador plegable estuche cartuchera folding organizer pencil case gris turquesa' },
  { id: 'set-radar-turquesa', cat: 'sets', est: 'radar-turquesa', rango: 15, alta: 13, stock: 3, precio: 86000, usd: 74,
    n: ['Set Radar turquesa: mochila y organizador', 'Turquoise Radar Set: backpack and organizer'],
    d: ['La mochila y el organizador plegable con la misma estampa, listos para arrancar el año.', 'The backpack and folding organizer in the same print, ready for the new school year.'],
    med: ['Mochila 40 × 30 × 13 cm · organizador 24 × 13 cm', 'Backpack 15.7 × 11.8 × 5.1 in · organizer 9.4 × 5.1 in'],
    img: 'images/p-set-radar.webp', gal: ['images/g-radar.webp'],
    alt: ['Mochila y organizador Radar turquesa juntos', 'Turquoise Radar backpack and organizer together'], tags: 'set combo regalo kit escolar gift school gris turquesa' },
  { id: 'agenda-geometria-pop', cat: 'agendas', est: 'geometria-pop', rango: 16, alta: 16, stock: 0, precio: 28000, usd: 24, visible: false,
    n: ['Agenda Geometría pop', 'Pop Geometry Planner'], d: ['Próximo ingreso.', 'Coming soon.'], med: ['A5', 'A5'],
    img: 'images/p-organizador-geometria.webp', gal: [], alt: ['Próximo ingreso', 'Coming soon'], tags: '' },
], {
  tope: 100,
  texto: p => [p.n.join(' '), ...nombres(CATEGORIAS, p.cat), ...nombres(ESTAMPAS, p.est), p.d.join(' '), p.tags, (p.vars || []).map(v => v.n.join(' ')).join(' ')].join(' '),
});

function nombres(arr, id) { return arr.find(x => x.id === id)?.n || []; }

function crearTienda(coleccion, { tope = 100, texto = p => p.n.join(' ') } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm(texto(p))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat), est = lista(f.est), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (est.length && !est.includes(p.est)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.destacado) return false;
    if (f.precio) {
      const r = PRECIOS.find(x => x.id === f.precio);
      if (r) {
        const [min, max] = f.moneda === 'usd' ? r.usd : r.ars;
        const v = f.moneda === 'usd' ? p.usd : p.precio;
        if (!(v > min && v <= max)) return false;
      }
    }
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const t = indice.get(p.id) || '';
      if (!palabras.every(w => t.includes(w) || (w.length > 3 && w.endsWith('s') && t.includes(w.slice(0, -1))))) return false;
    }
    return true;
  }
  function comparador(orden, moneda) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const pr = p => (moneda === 'usd' ? p.usd : p.precio);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => pr(a) - pr(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => pr(b) - pr(a) || desempate(a, b);
      case 'nombre': return (a, b) => tx(a.n).localeCompare(tx(b.n), LANG === 'en' ? 'en' : 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.moneda));
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const moneda = () => (LANG === 'en' ? 'usd' : 'ars');
const montoDe = p => (LANG === 'en' ? p.usd : p.precio);
const formatearMonto = n => (LANG === 'en' ? 'US$ ' + Math.round(n).toLocaleString('en-US') : '$' + Math.round(n).toLocaleString('es-AR'));
const formatearPrecio = p => formatearMonto(montoDe(p));
const getProducto = id => Tienda.obtener(id);
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const cuantos = n => (n === 1 ? T('1 producto', '1 product') : T(`${n} productos`, `${n} products`));
const catDe = id => CATEGORIAS.find(c => c.id === id);
const estDe = id => ESTAMPAS.find(e => e.id === id);
const swStyle = e => (e ? `--sw:url('${e.sw}');--sp:${e.sp};--sz:${e.sz}` : '');
const ICO = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Cart = {
  KEY: 'punchcolor_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { nada(); } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + montoDe(p) * i.qty : s; }, 0); },
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

function aplicarTextos() {
  const en = LANG === 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.es == null) el.dataset.es = el.innerHTML;
    const k = el.dataset.i18n;
    el.innerHTML = en && EN[k] != null ? EN[k] : el.dataset.es;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(',').forEach(par => {
      const [attr, k] = par.split(':').map(s => s.trim());
      const clave = 'es' + attr.replace(/[^a-z]/gi, '');
      if (el.dataset[clave] == null) el.dataset[clave] = el.getAttribute(attr) || '';
      el.setAttribute(attr, en && EN[k] != null ? EN[k] : el.dataset[clave]);
    });
  });
  document.documentElement.lang = en ? 'en' : 'es-AR';
  const t = TITULOS[PAGINA];
  if (t && PAGINA === 'home') document.title = tx(t);
  document.querySelectorAll('.lang__btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
}

const alCambiarIdioma = [];
function initLang() {
  document.querySelectorAll('.lang__btn').forEach(b => b.addEventListener('click', () => {
    const nuevo = b.dataset.lang;
    if (nuevo === LANG) return;
    LANG = nuevo;
    try { localStorage.setItem(LANG_KEY, LANG); } catch { nada(); }
    aplicarTextos();
    alCambiarIdioma.forEach(fn => { try { fn(); } catch { nada(); } });
    document.dispatchEvent(new CustomEvent('cart:updated'));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    showToast(T('Listo: la tienda está en español y con precios en pesos.', 'Done: the shop is in English with prices in US dollars.'));
  }));
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
const animAttr = (tipo, anim) => {
  if (!anim) return '';
  const est = {
    subir: 'opacity:0;transform:translateY(40px)',
    der: 'opacity:0;transform:translateX(56px)',
    escala: 'opacity:0;transform:translateY(20px) scale(.92)',
  }[tipo];
  return ` data-animate="${tipo}" style="${est}"`;
};

function badgeHTML(p) {
  if (p.stock > 0 && p.stock <= 3) return `<span class="badge badge--ultimas">${T('Últimas unidades', 'Last units')}</span>`;
  if (p.etiqueta === 'nuevo') return `<span class="badge">${T('Nuevo', 'New')}</span>`;
  return '';
}
function estLinea(p, cls) {
  const e = estDe(p.est);
  return e ? `<p class="${cls}"><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span>${esc(tx(e.n))}</p>` : '';
}
function cardM1(p, tipo = 'subir', anim = true, compacta = false) {
  const nombre = esc(tx(p.n));
  const conVar = (p.vars || []).length > 0;
  const foto = `<button type="button" class="pcard__foto ph" data-quick="${p.id}" aria-label="${T('Ver', 'View')} ${nombre}">
      <img src="${p.img}" alt="${esc(tx(p.alt))}" width="720" height="900">${badgeHTML(p)}
    </button>`;
  if (compacta) {
    return `<article class="pcard pcard--compacta"${animAttr(tipo, anim)} data-id="${p.id}">
    ${foto}
    <div class="pcard__info">
      ${estLinea(p, 'pcard__est')}
      <h3 class="pcard__nombre">${nombre}</h3>
      <div class="pcard__fila"><p class="pcard__precio">${formatearPrecio(p)}</p><button type="button" class="pcard__mas" ${conVar ? `data-quick="${p.id}"` : `data-add="${p.id}"`} aria-label="${conVar ? T('Elegir diseño de', 'Choose design for') : T('Agregar al carrito:', 'Add to cart:')} ${nombre}">${ICO.mas}</button></div>
    </div>
  </article>`;
  }
  return `<article class="pcard"${animAttr(tipo, anim)} data-id="${p.id}">
    ${foto}
    <div class="pcard__info">
      ${estLinea(p, 'pcard__est')}
      <h3 class="pcard__nombre">${nombre}</h3>
      <p class="pcard__precio">${formatearPrecio(p)}</p>
      <div class="prod-actions">
        ${conVar ? '' : `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="${T('Restar uno', 'One less')}">−</button><span data-cant>1</span><button type="button" data-step="1" aria-label="${T('Sumar uno', 'One more')}">+</button></div>`}
        <button type="button" class="prod-add" ${conVar ? `data-quick="${p.id}"` : `data-add="${p.id}"`}>${conVar ? T('Elegir diseño', 'Choose design') : `<span class="lbl-largo">${T('Agregar al carrito', 'Add to cart')}</span><span class="lbl-corto">${T('Agregar', 'Add')}</span>`}</button>
      </div>
      <button type="button" class="prod-buy" ${conVar ? `data-quick="${p.id}"` : `data-buy="${p.id}"`}>${T('Comprar ahora', 'Buy now')}</button>
    </div>
  </article>`;
}
function cardM2(p, tipo = 'subir', anim = true) {
  const nombre = esc(tx(p.n));
  const conVar = (p.vars || []).length > 0;
  return `<article class="fcard"${animAttr(tipo, anim)} data-id="${p.id}">
    <button type="button" class="fcard__foto ph" data-quick="${p.id}" aria-label="${T('Ver', 'View')} ${nombre}">
      <img src="${p.img}" alt="${esc(tx(p.alt))}" width="720" height="900">${badgeHTML(p)}
    </button>
    <div class="fcard__info">
      ${estLinea(p, 'fcard__est')}
      <h3 class="fcard__nombre">${nombre}</h3>
      <div class="fcard__fila">
        <p class="fcard__precio">${formatearPrecio(p)}</p>
        <button type="button" class="fcard__add" ${conVar ? `data-quick="${p.id}"` : `data-add="${p.id}"`} aria-label="${conVar ? T('Elegir diseño de', 'Choose design for') : T('Agregar al carrito:', 'Add to cart:')} ${nombre}"><span class="fcard__lbl">${conVar ? T('Elegir', 'Choose') : T('Agregar', 'Add')}</span><span class="fcard__ico">${ICO.mas}</span></button>
      </div>
    </div>
  </article>`;
}
const card = (p, tipo, anim, compacta) => (MODELO === '2' ? cardM2(p, tipo, anim) : cardM1(p, tipo, anim, compacta));

function initAccionesCards() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const st = step.closest('[data-stepper]');
      const out = st?.querySelector('[data-cant]');
      if (!out) return;
      const p = getProducto(st.closest('[data-id]')?.dataset.id);
      const n = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(step.dataset.step), p?.stock ?? 99));
      out.textContent = n;
      return;
    }
    const q = e.target.closest('[data-quick]');
    if (q) { abrirQuick(q.dataset.quick, q); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const cant = parseInt(add.closest('[data-id]')?.querySelector('[data-cant]')?.textContent, 10) || 1;
      Cart.add(p, cant);
      showToast(T(`Sumaste ${cant > 1 ? cant + ' × ' : ''}${tx(p.n)} al carrito.`, `Added ${cant > 1 ? cant + ' × ' : ''}${tx(p.n)} to your cart.`));
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      const cant = parseInt(buy.closest('[data-id]')?.querySelector('[data-cant]')?.textContent, 10) || 1;
      Cart.add(p, cant);
      abrirDrawer(buy);
    }
  });
}

function initMenuCategorias() {
  const listas = document.querySelectorAll('[data-menu-cats]');
  const pintar = () => {
    const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    listas.forEach(ul => {
      ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40">${esc(tx(c.n))}<small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
    });
  };
  pintar();
  alCambiarIdioma.push(pintar);
}
function initNavCats() {
  const wrap = document.querySelector('[data-navcats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const desktop = window.matchMedia('(min-width: 961px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (desktop.matches && hover.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (desktop.matches && hover.matches) t = setTimeout(cerrar, 120); });
  wrap.addEventListener('focusout', e => { if (desktop.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && desktop.matches) { cerrar(); btn.focus(); } });
  desktop.addEventListener('change', cerrar);
}
function initSwatches() {
  const cierre = document.querySelector('[data-cierre-sw]');
  const links = document.querySelector('[data-estampas-links]');
  const pintar = () => {
    if (cierre) cierre.innerHTML = ESTAMPAS.map(e => `<li><span class="sw" style="${swStyle(e)}"></span></li>`).join('');
    if (links) links.innerHTML = ESTAMPAS.map(e => `<li><a href="${CATALOGO_URL}?est=${e.id}"><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span>${esc(tx(e.n))}</a></li>`).join('');
  };
  pintar();
  alCambiarIdioma.push(pintar);
}

function initCats() {
  const ul = document.querySelector('[data-cats-grid]');
  if (!ul) return;
  let primera = true;
  const pintar = () => {
    ul.innerHTML = CATEGORIAS.map(c => `<li class="cat-c"${animAttr('escala', primera)}><a href="${CATALOGO_URL}?cat=${c.id}"><span class="cat-c__img ph"><img src="${c.img}" alt="" width="720" height="900"></span><span><span class="cat-c__n">${esc(tx(c.n))}</span><span class="cat-c__cant">${cuantos(Tienda.contar({ cat: c.id }))}</span></span></a></li>`).join('');
    primera = false;
  };
  pintar();
  alCambiarIdioma.push(pintar);
}
function initHeroCats() {
  const ul = document.querySelector('[data-hero-cats]');
  if (!ul) return;
  const pintar = () => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"><img src="${c.img}" alt="" width="30" height="30">${esc(tx(c.n))} <small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  };
  pintar();
  alCambiarIdioma.push(pintar);
}
let railIds = [];
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  let primera = true;
  const pintar = () => {
    const { items } = MODELO === '2'
      ? Tienda.consultar({ orden: 'nuevos', limite: 7 })
      : Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 7 });
    railIds = items.map(p => p.id);
    track.innerHTML = items.map(p => `<li class="rail-item"${animAttr('der', primera)}>${card(p, 'subir', false, true)}</li>`).join('');
    primera = false;
  };
  pintar();
  alCambiarIdioma.push(pintar);
  const vp = document.querySelector('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}
function initRailDrag(vp) {
  if (!vp) return;
  let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { nada(); }
    }
    if (moved) vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { nada(); }
    if (moved) {
      const matar = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}
function initPreview() {
  const grid = document.querySelector('[data-preview]');
  if (!grid) return;
  let primera = true;
  const pintar = () => {
    const { items } = Tienda.consultar({ filtros: { excluir: railIds }, orden: 'nuevos', limite: 8 });
    grid.innerHTML = items.map(p => card(p, 'subir', primera)).join('');
    primera = false;
  };
  pintar();
  alCambiarIdioma.push(pintar);
}
function initEstampasTabs() {
  const tabs = document.querySelector('[data-estampas-tabs]');
  const panel = document.querySelector('[data-estampas-panel]');
  if (!tabs || !panel) return;
  let actual = ESTAMPAS[0].id;
  let primera = true;
  const pintarTabs = () => {
    tabs.innerHTML = ESTAMPAS.map(e => `<button type="button" class="etab" role="tab" id="etab-${e.id}" aria-controls="estampasPanel" aria-selected="${e.id === actual}" tabindex="${e.id === actual ? 0 : -1}" data-est="${e.id}"${animAttr('escala', primera)}><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span>${esc(tx(e.n))}</button>`).join('');
  };
  const pintarPanel = anim => {
    const e = estDe(actual);
    const total = Tienda.contar({ est: e.id });
    const { items } = Tienda.consultar({ filtros: { est: e.id }, orden: 'destacados', limite: 3 });
    panel.setAttribute('aria-labelledby', `etab-${e.id}`);
    panel.innerHTML = `<figure class="est-escena"${anim ? ' data-animate="mascara" style="clip-path:inset(100% 0 0 0)"' : ''}><img src="${e.escena}" alt="${esc(tx(e.n))}" width="720" height="960"></figure>
      <div class="est-lado">
        <div${animAttr('subir', anim)}><h3 class="est-lado__nombre">${esc(tx(e.n))}</h3><p class="est-lado__desc">${esc(tx(e.d))}</p>
        <a class="link-flecha" href="${CATALOGO_URL}?est=${e.id}">${T(`Ver los ${total} productos de esta estampa`, `See all ${total} products in this print`)}${ICO.flecha}</a></div>
        <div class="est-prods catalogo-grid">${items.map(p => cardM2(p, 'subir', anim)).join('')}</div>
      </div>`;
  };
  pintarTabs();
  pintarPanel(true);
  primera = false;
  const elegir = (id, foco) => {
    if (id === actual) return;
    actual = id;
    pintarTabs();
    pintarPanel(false);
    if (!reduceMotion) panel.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
    if (foco) tabs.querySelector(`[data-est="${id}"]`)?.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.addEventListener('click', ev => { const b = ev.target.closest('[data-est]'); if (b) elegir(b.dataset.est, false); });
  tabs.addEventListener('keydown', ev => {
    const i = ESTAMPAS.findIndex(e => e.id === actual);
    let j = null;
    if (ev.key === 'ArrowRight') j = (i + 1) % ESTAMPAS.length;
    if (ev.key === 'ArrowLeft') j = (i - 1 + ESTAMPAS.length) % ESTAMPAS.length;
    if (ev.key === 'Home') j = 0;
    if (ev.key === 'End') j = ESTAMPAS.length - 1;
    if (j != null) { ev.preventDefault(); elegir(ESTAMPAS[j].id, true); }
  });
  alCambiarIdioma.push(() => { pintarTabs(); tabs.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); pintarPanel(false); });
}

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid || PAGINA !== 'catalogo') return;
  const verMas = document.querySelector('[data-ver-mas]');
  const contador = document.querySelector('[data-contador]');
  const chips = document.querySelector('[data-chips]');
  const vacio = document.querySelector('[data-vacio]');
  const inputQ = document.querySelector('[data-q]');
  const selOrden = document.querySelector('[data-orden]');
  const fCats = document.querySelector('[data-f-cats]');
  const fEst = document.querySelector('[data-f-estampas]');
  const fPre = document.querySelector('[data-f-precios]');
  const pills = document.querySelector('[data-f-pills]');
  const selCat = document.querySelector('[data-sel-cat]');
  const selPre = document.querySelector('[data-sel-precio]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const nFiltros = document.querySelector('[data-n-filtros]');

  const params = new URLSearchParams(location.search);
  const validos = (v, arr) => (v || '').split(',').map(s => s.trim()).filter(id => arr.some(x => x.id === id));
  const estado = {
    cat: validos(params.get('cat'), CATEGORIAS),
    est: validos(params.get('est'), ESTAMPAS),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.some(o => o.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && estado.cat.length > 1) estado.cat = estado.cat.slice(0, 1);
  let cursor = null;
  let mostrados = 0;

  const filtros = () => ({ cat: estado.cat, est: estado.est, precio: estado.precio, q: estado.q, moneda: moneda() });
  const contarCon = extra => Tienda.contar({ ...filtros(), ...extra });

  function pintarFiltros() {
    if (fCats) fCats.innerHTML = CATEGORIAS.map(c => { const n = contarCon({ cat: [c.id] }); return `<label class="fopt${n ? '' : ' vacio'}"><input type="checkbox" data-f="cat" value="${c.id}"${estado.cat.includes(c.id) ? ' checked' : ''}><span>${esc(tx(c.n))}</span><span class="fopt__n">${n}</span></label>`; }).join('');
    if (fEst) fEst.innerHTML = ESTAMPAS.map(e => { const n = contarCon({ est: [e.id] }); return `<label class="fopt${n ? '' : ' vacio'}"><input type="checkbox" data-f="est" value="${e.id}"${estado.est.includes(e.id) ? ' checked' : ''}><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span><span>${esc(tx(e.n))}</span><span class="fopt__n">${n}</span></label>`; }).join('');
    if (fPre) fPre.innerHTML = PRECIOS.map(r => { const n = contarCon({ precio: r.id }); return `<label class="fopt${n ? '' : ' vacio'}"><input type="checkbox" data-f="precio" value="${r.id}"${estado.precio === r.id ? ' checked' : ''}><span>${esc(tx(r.n))}</span><span class="fopt__n">${n}</span></label>`; }).join('');
    if (pills) pills.innerHTML = ESTAMPAS.map(e => `<button type="button" class="pill" data-pill="${e.id}" aria-pressed="${estado.est.includes(e.id)}"><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span>${esc(tx(e.n))} <small>${contarCon({ est: [e.id] })}</small></button>`).join('');
    if (selCat) selCat.innerHTML = `<option value="">${T('Todas', 'All')}</option>` + CATEGORIAS.map(c => `<option value="${c.id}"${estado.cat[0] === c.id ? ' selected' : ''}>${esc(tx(c.n))} (${contarCon({ cat: [c.id] })})</option>`).join('');
    if (selPre) selPre.innerHTML = `<option value="">${T('Todos', 'Any')}</option>` + PRECIOS.map(r => `<option value="${r.id}"${estado.precio === r.id ? ' selected' : ''}>${esc(tx(r.n))}</option>`).join('');
    if (selOrden) selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${estado.orden === o.id ? ' selected' : ''}>${esc(tx(o.n))}</option>`).join('');
    if (inputQ && document.activeElement !== inputQ) inputQ.value = estado.q;
  }
  function pintarChips() {
    const lista = [
      ...estado.cat.map(id => ({ k: 'cat', id, t: tx(catDe(id).n) })),
      ...estado.est.map(id => ({ k: 'est', id, t: tx(estDe(id).n) })),
      ...(estado.precio ? [{ k: 'precio', id: estado.precio, t: tx(PRECIOS.find(r => r.id === estado.precio).n) }] : []),
      ...(estado.q ? [{ k: 'q', id: estado.q, t: `“${estado.q}”` }] : []),
    ];
    chips.innerHTML = lista.map(c => `<button type="button" class="chip" data-chip="${c.k}" data-val="${esc(c.id)}" aria-label="${T('Quitar filtro', 'Remove filter')}: ${esc(c.t)}">${esc(c.t)}${ICO.x}</button>`).join('');
    if (nFiltros) { const n = estado.cat.length + estado.est.length + (estado.precio ? 1 : 0); nFiltros.textContent = n; nFiltros.hidden = !n; }
    if (migaCat) {
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      migaCat.hidden = !c;
      migaCat.textContent = c ? tx(c.n) : '';
    }
  }
  function actualizarUrl() {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.est.length) p.set('est', estado.est.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod) p.set('producto', prod);
    const s = p.toString();
    window.history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }
  function cargar(reiniciar, anim = true) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const pagina = Tienda.consultar({ filtros: filtros(), orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = pagina.cursor;
    mostrados += pagina.items.length;
    grid.insertAdjacentHTML('beforeend', pagina.items.map(p => card(p, 'subir', anim)).join(''));
    const total = Tienda.contar(filtros());
    contador.textContent = total ? T(`Mostrando ${mostrados} de ${total} ${total === 1 ? 'producto' : 'productos'}`, `Showing ${mostrados} of ${total} ${total === 1 ? 'product' : 'products'}`) : '';
    vacio.hidden = total > 0;
    verMas.hidden = !cursor;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() {
    pintarFiltros();
    pintarChips();
    actualizarUrl();
    cargar(true);
  }

  document.addEventListener('change', e => {
    const f = e.target.closest('input[data-f]');
    if (f) {
      if (f.dataset.f === 'precio') estado.precio = f.checked ? f.value : '';
      else {
        const arr = estado[f.dataset.f];
        estado[f.dataset.f] = f.checked ? [...new Set([...arr, f.value])] : arr.filter(x => x !== f.value);
      }
      aplicar();
      return;
    }
    if (e.target === selOrden) { estado.orden = selOrden.value; aplicar(); }
    if (e.target === selCat) { estado.cat = selCat.value ? [selCat.value] : []; aplicar(); }
    if (e.target === selPre) { estado.precio = selPre.value; aplicar(); }
  });
  pills?.addEventListener('click', e => {
    const b = e.target.closest('[data-pill]');
    if (!b) return;
    const id = b.dataset.pill;
    estado.est = estado.est.includes(id) ? estado.est.filter(x => x !== id) : [...estado.est, id];
    aplicar();
  });
  chips.addEventListener('click', e => {
    const c = e.target.closest('[data-chip]');
    if (!c) return;
    const k = c.dataset.chip, v = c.dataset.val;
    if (k === 'precio') estado.precio = '';
    else if (k === 'q') estado.q = '';
    else estado[k] = estado[k].filter(x => x !== v);
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    estado.cat = []; estado.est = []; estado.precio = ''; estado.q = '';
    aplicar();
  }));
  let tq = 0;
  inputQ?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { estado.q = inputQ.value.trim().slice(0, 60); pintarChips(); actualizarUrl(); pintarFiltros(); cargar(true); }, 260);
  });
  document.querySelector('[data-cat-buscar]')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(tq);
    estado.q = inputQ.value.trim().slice(0, 60);
    aplicar();
  });
  verMas.addEventListener('click', () => cargar(false));

  initFiltrosMobile();
  aplicar();
  if (params.has('q')) setTimeout(() => inputQ?.focus({ preventScroll: true }), 300);
  alCambiarIdioma.push(() => { pintarFiltros(); pintarChips(); cargar(true, false); });
}
function initFiltrosMobile() {
  const panel = document.getElementById('filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!panel || !abrirBtn) return;
  const fondo = document.createElement('div');
  fondo.className = 'filtros-fondo';
  document.body.appendChild(fondo);
  const mq = window.matchMedia('(max-width: 960px)');
  const abrir = () => {
    panel.classList.add('open'); fondo.classList.add('open'); document.body.classList.add('no-scroll');
    abrirBtn.setAttribute('aria-expanded', 'true');
    panel.querySelector('.filtros__in')?.classList.add('in');
    panel.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); fondo.classList.remove('open'); document.body.classList.remove('no-scroll');
    abrirBtn.setAttribute('aria-expanded', 'false');
    abrirBtn.focus();
  };
  abrirBtn.addEventListener('click', abrir);
  fondo.addEventListener('click', cerrar);
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
  panel.addEventListener('keydown', e => atraparFoco(e, panel));
}

function atraparFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function abrirCapa(capa, opener) {
  capa._opener = opener || document.activeElement;
  capa.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => capa.classList.add('open')));
}
function cerrarCapa(capa) {
  if (capa.hidden) return;
  capa.classList.remove('open');
  const quedan = [...document.querySelectorAll('.drawer, .qv, .visor')].some(c => c !== capa && !c.hidden);
  if (!quedan) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!capa.classList.contains('open')) capa.hidden = true; }, reduceMotion ? 0 : 380);
  const op = capa._opener;
  if (op && document.contains(op)) op.focus({ preventScroll: true });
}

const drawer = document.getElementById('drawer');
function abrirDrawer(opener) {
  if (!drawer) return;
  const qv = document.getElementById('qv');
  if (qv && !qv.hidden) cerrarCapa(qv);
  pintarCarrito();
  abrirCapa(drawer, opener);
  setTimeout(() => drawer.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true }), 60);
}
function pintarCarrito() {
  if (!drawer) return;
  const lineasEl = drawer.querySelector('[data-cart-lineas]');
  const pie = drawer.querySelector('[data-cart-pie]');
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!items.length) {
    lineasEl.innerHTML = `<div class="cart-vacio"><span class="punto punto--grande" aria-hidden="true"></span><h3>${T('Tu carrito está vacío', 'Your cart is empty')}</h3><p>${T('Elegí una estampa y sumá lo que te guste.', 'Pick a print and add whatever you like.')}</p><a class="btn btn--cta" href="${CATALOGO_URL}">${T('Volver al catálogo', 'Back to the catalog')}</a></div>`;
    pie.innerHTML = '';
    return;
  }
  lineasEl.innerHTML = items.map(i => {
    const v = (i.p.vars || []).find(x => x.id === i.v);
    return `<div class="linea" data-linea="${i.id}" data-v="${esc(i.v || '')}">
      <img src="${i.p.img}" alt="" width="70" height="88">
      <div>
        <p class="linea__nombre">${esc(tx(i.p.n))}</p>
        ${v ? `<p class="linea__var">${T('Diseño', 'Design')}: ${esc(tx(v.n))}</p>` : ''}
        <div class="linea__fila">
          <div class="stepper"><button type="button" data-lq="-1" aria-label="${T('Restar uno', 'One less')}"${i.qty <= 1 ? ' disabled' : ''}>−</button><span>${i.qty}</span><button type="button" data-lq="1" aria-label="${T('Sumar uno', 'One more')}"${i.qty >= (i.p.stock ?? 99) ? ' disabled' : ''}>+</button></div>
          <p class="linea__precio">${formatearMonto(montoDe(i.p) * i.qty)}</p>
        </div>
        <button type="button" class="linea__quitar" data-quitar>${T('Quitar', 'Remove')}</button>
      </div>
    </div>`;
  }).join('');
  const total = Cart.total();
  const msg = [T('Hola Punch Color, quiero hacer este pedido:', 'Hi Punch Color, I’d like to order:'),
    ...items.map(i => { const v = (i.p.vars || []).find(x => x.id === i.v); return `• ${i.qty} × ${tx(i.p.n)}${v ? ' (' + tx(v.n) + ')' : ''} — ${formatearMonto(montoDe(i.p) * i.qty)}`; }),
    `${T('Total', 'Total')}: ${formatearMonto(total)}`].join('\n');
  pie.innerHTML = `<div class="drawer__total"><span>${T('Total', 'Total')}</span><strong>${formatearMonto(total)}</strong></div>
    <p class="drawer__nota">${T('Pagás con Mercado Pago. ¿Comprás desde otro país? Pasá la tienda a English: ves los precios en dólares y pagás con Payoneer. El envío lo coordinamos por WhatsApp.', 'Pay with Payoneer, in US dollars. Shopping from Argentina? Switch the shop to Español to see prices in pesos and pay with Mercado Pago. Shipping is arranged over WhatsApp.')}</p>
    <button type="button" class="btn btn--cta" data-finalizar>${T('Finalizar compra', 'Check out')}</button>
    <a class="btn btn--ghost" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO.wsp}${T('Enviar el pedido por WhatsApp', 'Send the order on WhatsApp')}</a>`;
}
function initCartUI() {
  if (!drawer) return;
  Cart.syncStock();
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrirDrawer(b)));
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarCapa(drawer); return; }
    const lin = e.target.closest('[data-linea]');
    const q = e.target.closest('[data-lq]');
    if (lin && q) { const it = Cart.get().find(i => i.id === lin.dataset.linea && (i.v || '') === lin.dataset.v); if (it) Cart.setQty(it.id, it.v, it.qty + Number(q.dataset.lq)); return; }
    if (lin && e.target.closest('[data-quitar]')) { Cart.remove(lin.dataset.linea, lin.dataset.v); return; }
    if (e.target.closest('[data-finalizar]')) {
      showToast(T('¡Genial! El pago online se activa al pasar la web a producción.', 'Great! Online payment goes live when the site is published.'));
    }
  });
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCapa(drawer); atraparFoco(e, drawer.querySelector('.drawer__panel')); });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintarCarrito(); });
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
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
}

const qv = document.getElementById('qv');
let qvActual = null;
function abrirQuick(id, opener) {
  const p = getProducto(id);
  if (!p || !qv) return;
  qvActual = { id, v: p.vars?.[0]?.id || '', img: 0 };
  pintarQuick();
  if (qv.hidden) abrirCapa(qv, opener);
  setTimeout(() => qv.querySelector('.qv__cerrar')?.focus({ preventScroll: true }), 60);
  inyectarLdProducto(p);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', id); window.history.replaceState(null, '', u);
  }
}
function pintarQuick() {
  const p = getProducto(qvActual.id);
  if (!p) return;
  const cont = qv.querySelector('[data-qv]');
  const e = estDe(p.est);
  const v = (p.vars || []).find(x => x.id === qvActual.v);
  const fotos = [p.img, ...(p.gal || [])];
  const principal = fotos[qvActual.img] || p.img;
  const { items: combina } = Tienda.consultar({ filtros: { est: p.est, excluir: [p.id] }, orden: 'destacados', limite: 3 });
  const msg = T(`Hola Punch Color, quería consultar por: ${tx(p.n)}${v ? ' (' + tx(v.n) + ')' : ''}`, `Hi Punch Color, I have a question about: ${tx(p.n)}${v ? ' (' + tx(v.n) + ')' : ''}`);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__main"><img src="${principal}" alt="${esc(tx(p.alt))}" width="720" height="900"></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-qimg="${i}" aria-label="${T('Foto', 'Photo')} ${i + 1}"${i === qvActual.img ? ' aria-current="true"' : ''}><img src="${f}" alt="" width="58" height="72"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      ${e ? `<p class="qv__est"><span class="sw" style="${swStyle(e)}" aria-hidden="true"></span>${T('Estampa', 'Print')}: ${esc(tx(e.n))}</p>` : ''}
      <h2>${esc(tx(p.n))}</h2>
      <p class="qv__precio">${formatearPrecio(p)}</p>
      <p class="qv__desc">${esc(tx(p.d))}</p>
      <dl class="qv__med"><dt>${T('Medidas', 'Size')}</dt><dd>${esc(tx(p.med))}</dd></dl>
      ${(p.vars || []).length ? `<fieldset class="qv__vars"><legend>${T('Elegí el diseño', 'Choose the design')}</legend><div class="qv__vars-fila">${p.vars.map(x => `<label class="var-op"><input type="radio" name="qv-var" value="${x.id}"${x.id === qvActual.v ? ' checked' : ''}><img src="${x.img}" alt="" width="150" height="47">${esc(tx(x.n))}</label>`).join('')}</div></fieldset>` : ''}
      <div class="qv__comprar" data-id="${p.id}">
        <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="${T('Restar uno', 'One less')}">−</button><span data-cant>1</span><button type="button" data-step="1" aria-label="${T('Sumar uno', 'One more')}">+</button></div>
        <button type="button" class="btn btn--cta" data-qadd>${T('Agregar al carrito', 'Add to cart')}</button>
        <button type="button" class="btn btn--ghost" data-qbuy>${T('Comprar ahora', 'Buy now')}</button>
      </div>
      <p class="qv__stock">${p.stock <= 3 ? T(`Quedan ${p.stock} unidades.`, `Only ${p.stock} left.`) : T('Disponible.', 'In stock.')} ${T('Pagás con Mercado Pago o, desde otro país, con Payoneer.', 'Pay with Payoneer from abroad, or Mercado Pago in Argentina.')}</p>
      <a class="link-flecha qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${T('Consultar por WhatsApp', 'Ask on WhatsApp')}${ICO.flecha}</a>
      ${combina.length ? `<div class="qv__combina"><h3>${T('Combiná con la misma estampa', 'Match it with the same print')}</h3><ul>${combina.map(c => `<li><button type="button" data-qotro="${c.id}"><img src="${c.img}" alt="" width="120" height="150">${esc(tx(c.n))}</button></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>`;
}
function inyectarLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.n[0], description: p.d[0],
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'Punch Color' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function initQuickView() {
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQuick(); return; }
    const t = e.target.closest('[data-qimg]');
    if (t) { qvActual.img = Number(t.dataset.qimg); pintarQuick(); qv.querySelector(`[data-qimg="${t.dataset.qimg}"]`)?.focus(); return; }
    const otro = e.target.closest('[data-qotro]');
    if (otro) { abrirQuick(otro.dataset.qotro, qv._opener); qv.querySelector('.qv__panel').scrollTop = 0; return; }
    const p = getProducto(qvActual?.id);
    if (!p) return;
    const cant = parseInt(qv.querySelector('[data-cant]')?.textContent, 10) || 1;
    if (e.target.closest('[data-qadd]')) {
      Cart.add(p, cant, qvActual.v);
      const v = (p.vars || []).find(x => x.id === qvActual.v);
      showToast(T(`Sumaste ${tx(p.n)}${v ? ' (' + tx(v.n) + ')' : ''} al carrito.`, `Added ${tx(p.n)}${v ? ' (' + tx(v.n) + ')' : ''} to your cart.`));
    }
    if (e.target.closest('[data-qbuy]')) { Cart.add(p, cant, qvActual.v); abrirDrawer(qv._opener); }
  });
  qv.addEventListener('change', e => {
    if (e.target.name === 'qv-var') { qvActual.v = e.target.value; const cant = qv.querySelector('[data-cant]')?.textContent; pintarQuick(); const out = qv.querySelector('[data-cant]'); if (out && cant) out.textContent = cant; qv.querySelector(`input[value="${e.target.value}"]`)?.focus(); }
  });
  qv.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarQuick(); atraparFoco(e, qv.querySelector('.qv__panel')); });
  alCambiarIdioma.push(() => { if (!qv.hidden && qvActual) pintarQuick(); });
}
function cerrarQuick() {
  cerrarCapa(qv);
  if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u); }
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuick(id, null);
}

function initResenas() {
  const form = document.getElementById('resenaForm');
  if (!form) return;
  const sel = form.querySelector('#resProducto');
  const lista = document.querySelector('[data-resenas-pend]');
  const KEY = 'punchcolor_resenas';
  const leer = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const pintarOpciones = () => {
    const val = sel.value;
    const { items } = Tienda.consultar({ orden: 'nombre', limite: 100 });
    sel.innerHTML = `<option value="">${T('Elegí un producto', 'Choose a product')}</option>` + items.map(p => `<option value="${p.id}">${esc(tx(p.n))}</option>`).join('');
    sel.value = val;
  };
  const pintarPend = () => {
    lista.innerHTML = leer().map(r => {
      const p = getProducto(r.producto);
      return `<li class="res-card"><div class="res-card__top"><strong>${esc(r.nombre)}</strong><span class="res-card__estado">${T('Pendiente de aprobación', 'Pending approval')}</span></div><p class="res-card__est" aria-label="${r.estrellas} ${T('de 5 estrellas', 'out of 5 stars')}">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</p>${p ? `<p class="res-card__prod">${esc(tx(p.n))}</p>` : ''}<p>${esc(r.texto)}</p></li>`;
    }).join('');
  };
  pintarOpciones();
  pintarPend();
  alCambiarIdioma.push(() => { pintarOpciones(); pintarPend(); });
  const campos = {
    nombre: { el: form.querySelector('#resNombre'), err: form.querySelector('#resNombreErr'), ok: v => v.trim().length >= 2 },
    producto: { el: sel, err: form.querySelector('#resProductoErr'), ok: v => !!v },
    texto: { el: form.querySelector('#resTexto'), err: form.querySelector('#resTextoErr'), ok: v => v.trim().replace(/\s+/g, '').length >= 10 },
  };
  const marcar = (c, valido) => { c.el.setAttribute('aria-invalid', String(!valido)); c.err.hidden = valido; };
  Object.values(campos).forEach(c => c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') marcar(c, c.ok(c.el.value)); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    Object.values(campos).forEach(c => { const v = c.ok(c.el.value); marcar(c, v); if (!v && !primero) primero = c.el; });
    const est = form.querySelector('input[name="estrellas"]:checked');
    form.querySelector('#resEstrellasErr').hidden = !!est;
    if (!est && !primero) primero = form.querySelector('#est5');
    const ok = form.querySelector('input[name="ok"]');
    form.querySelector('#resOkErr').hidden = ok.checked;
    if (!ok.checked && !primero) primero = ok;
    if (primero) { primero.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true; btn.textContent = T('Enviando…', 'Sending…');
    setTimeout(() => {
      const nueva = { nombre: campos.nombre.el.value.trim().slice(0, 40), producto: sel.value, estrellas: Number(est.value), texto: campos.texto.el.value.trim().slice(0, 400) };
      try { localStorage.setItem(KEY, JSON.stringify([nueva, ...leer()].slice(0, 5))); } catch { nada(); }
      pintarPend();
      form.reset();
      btn.disabled = false; btn.innerHTML = txt;
      showToast(T('¡Gracias! Tu reseña queda pendiente: se publica cuando Punch Color la revisa.', 'Thanks! Your review is pending: it goes live once Punch Color checks it.'));
    }, 800);
  });
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const btns = [...document.querySelectorAll('[data-galeria]')];
  if (!visor || !btns.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const cap = visor.querySelector('[data-visor-cap]');
  let i = 0;
  const mostrar = n => {
    i = (n + btns.length) % btns.length;
    const src = btns[i].querySelector('img');
    img.src = src.getAttribute('src'); img.alt = src.alt; img.width = src.width; img.height = src.height;
    img.setAttribute('width', src.getAttribute('width')); img.setAttribute('height', src.getAttribute('height'));
    cap.textContent = src.alt;
  };
  btns.forEach((b, n) => b.addEventListener('click', () => { mostrar(n); abrirCapa(visor, b); setTimeout(() => visor.querySelector('.visor__cerrar')?.focus({ preventScroll: true }), 60); }));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) cerrarCapa(visor);
    else if (e.target.closest('[data-visor-prev]')) mostrar(i - 1);
    else if (e.target.closest('[data-visor-next]')) mostrar(i + 1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarCapa(visor);
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
    atraparFoco(e, visor.querySelector('.visor__panel'));
  });
  let x0 = null;
  visor.addEventListener('pointerdown', e => { x0 = e.clientX; });
  visor.addEventListener('pointerup', e => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) mostrar(i + (dx < 0 ? 1 : -1)); });
  if (MODELO === '2') initRailDrag(document.querySelector('[data-gal-vp]'));
}

const HORARIOS = { 0: [], 1: [[540, 780], [960, 1200]], 2: [[540, 780], [960, 1200]], 3: [[540, 780], [960, 1200]], 4: [[540, 780], [960, 1200]], 5: [[540, 780], [960, 1200]], 6: [[540, 780]] };
const DIAS = [['domingo', 'Sunday'], ['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'], ['jueves', 'Thursday'], ['viernes', 'Friday'], ['sábado', 'Saturday']];
function ahoraAR() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { dia, min: Number(get('hour')) * 60 + Number(get('minute')) };
  } catch {
    const d = new Date(); return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
const hhmm = m => { const h = Math.floor(m / 60), mm = m % 60; return LANG === 'en' ? `${((h + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}` : `${h}${mm ? ':' + String(mm).padStart(2, '0') : ''} h`; };
function estadoLocal() {
  const { dia, min } = ahoraAR();
  const franja = (HORARIOS[dia] || []).find(([a, b]) => min >= a && min < b);
  if (franja) return { abierto: true, texto: T(`Abierto ahora · hasta las ${hhmm(franja[1])}`, `Open now · until ${hhmm(franja[1])}`), dia };
  for (let k = 0; k < 8; k++) {
    const d = (dia + k) % 7;
    const sig = (HORARIOS[d] || []).find(([a]) => k > 0 || a > min);
    if (sig) {
      const cuando = k === 0 ? T('hoy', 'today') : k === 1 ? T('mañana', 'tomorrow') : T(`el ${DIAS[d][0]}`, `on ${DIAS[d][1]}`);
      return { abierto: false, texto: T(`Cerrado ahora · abrimos ${cuando} a las ${hhmm(sig[0])}`, `Closed now · we open ${cuando} at ${hhmm(sig[0])}`), dia };
    }
  }
  return { abierto: false, texto: T('Cerrado ahora', 'Closed now'), dia };
}
function initVisita() {
  const pill = document.querySelector('[data-estado]');
  if (pill) {
    const txt = pill.querySelector('[data-estado-txt]');
    const pintar = () => {
      const s = estadoLocal();
      pill.classList.toggle('abierto', s.abierto);
      pill.classList.toggle('cerrado', !s.abierto);
      txt.textContent = s.texto;
      document.querySelectorAll('.horas [data-dia]').forEach(f => {
        const [a, b] = f.dataset.dia.split('-').map(Number);
        f.classList.toggle('hoy', b != null ? s.dia >= a && s.dia <= b : s.dia === a);
      });
    };
    pintar();
    window.setInterval(pintar, 60000);
    alCambiarIdioma.push(pintar);
  }
  const el = document.getElementById('mapa');
  if (!el || typeof window.L === 'undefined') return;
  try {
    const lat = -34.6037, lng = -58.3816;
    const Lf = window.L;
    const mapa = Lf.map(el, { scrollWheelZoom: false, dragging: !Lf.Browser.mobile, tap: false, zoomControl: false, attributionControl: true }).setView([lat, lng], 15);
    Lf.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icon = Lf.divIcon({ className: '', html: '<div class="mapa-pin"></div>', iconSize: [38, 38], iconAnchor: [19, 19] });
    Lf.marker([lat, lng], { icon, title: 'Punch Color' }).addTo(mapa).bindPopup('<strong>Punch Color</strong><br>Saavedra 589 · Librería Colorete');
    const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { mapa.invalidateSize(); io.disconnect(); } });
    io.observe(el);
    window.addEventListener('load', () => mapa.invalidateSize());
  } catch { nada(); }
}

const BOT = {
  chips: [
    { k: 'horario', n: ['Horarios', 'Opening hours'] },
    { k: 'envios', n: ['Envíos', 'Shipping'] },
    { k: 'pagos', n: ['Medios de pago', 'Payment'] },
    { k: 'humano', n: ['Hablar con una persona', 'Talk to a person'] },
  ],
  claves: {
    saludo: ['hola', 'buenas', 'buen dia', 'buenos dias', 'buenas tardes', 'hey', 'hi', 'hello', 'good morning'],
    gracias: ['gracias', 'genial', 'perfecto', 'buenisimo', 'thanks', 'thank you', 'great'],
    horario: ['horario', 'hora', 'abren', 'abierto', 'abiertos', 'cierran', 'atienden', 'atencion', 'hours', 'open', 'close', 'closing', 'when'],
    ubicacion: ['donde', 'direccion', 'ubicacion', 'ubicados', 'local', 'retirar', 'retiro', 'mapa', 'where', 'address', 'location', 'shop', 'store', 'visit', 'pick up', 'pickup'],
    pagos: ['pago', 'pagar', 'pagos', 'mercado', 'mp', 'tarjeta', 'payoneer', 'transferencia', 'cuotas', 'efectivo', 'dolar', 'dolares', 'pay', 'payment', 'card', 'paypal', 'usd', 'dollar'],
    envios: ['envio', 'envios', 'envian', 'enviar', 'mandan', 'llega', 'exterior', 'pais', 'correo', 'interior', 'ship', 'shipping', 'delivery', 'deliver', 'country', 'international', 'worldwide', 'abroad'],
    medidas: ['medida', 'medidas', 'tamano', 'grande', 'chica', 'capacidad', 'cm', 'notebook', 'size', 'sizes', 'dimension', 'big', 'fit', 'laptop'],
    mayor: ['mayor', 'mayorista', 'cantidad', 'revender', 'reventa', 'colegio', 'empresa', 'wholesale', 'bulk', 'resell', 'school order'],
    estampa: ['estampa', 'estampas', 'diseno', 'disenos', 'dibujo', 'print', 'prints', 'pattern', 'design', 'designs'],
    humano: ['persona', 'humano', 'hablar', 'whatsapp', 'wsp', 'telefono', 'llamar', 'human', 'person', 'talk', 'call', 'phone'],
  },
  catClaves: {
    mochilas: ['mochila', 'mochilas', 'backpack', 'backpacks'],
    cartucheras: ['cartuchera', 'cartucheras', 'estuche', 'lapicera', 'pencil', 'pencil case'],
    organizadores: ['organizador', 'organizadores', 'organizer', 'organizers', 'portalapices'],
    agendas: ['agenda', 'agendas', 'cuaderno', 'planner', 'planners', 'notebook'],
    bolsos: ['bolso', 'bolsos', 'tote', 'bag', 'bags', 'cartera'],
    sets: ['set', 'sets', 'combo', 'kit', 'regalo', 'gift'],
  },
};
function initBot() {
  const log = document.getElementById('botLog');
  const form = document.getElementById('botForm');
  const input = document.getElementById('botInput');
  const chipsEl = document.querySelector('[data-bot-chips]');
  if (!log || !form) return;
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const tiene = (t, lista) => lista.some(w => new RegExp(`(^|[^a-z])${w}([^a-z]|$)`).test(t));
  const agregar = (html, quien) => {
    const div = document.createElement('div');
    div.className = `msg msg--${quien}`;
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  };
  const responder = html => {
    const t = agregar('<i></i><i></i><i></i>', 'bot');
    t.classList.add('msg--escribiendo');
    t.setAttribute('aria-hidden', 'true');
    setTimeout(() => { t.remove(); agregar(html, 'bot'); }, reduceMotion ? 0 : 650);
  };
  const linkWsp = (msg, texto) => `<a class="btn btn--cta" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO.wsp}${texto}</a>`;
  const saludo = () => {
    const s = estadoLocal();
    return s.abierto
      ? T(`¡Hola! Soy el asistente de Punch Color. Ahora estamos en el local (${s.texto.toLowerCase()}), así que también podés escribirnos por WhatsApp. ¿En qué te ayudo?`, `Hi! I’m the Punch Color assistant. We’re at the shop right now (${s.texto.toLowerCase()}), so you can also message us on WhatsApp. How can I help?`)
      : T(`¡Hola! Ahora no estamos atendiendo (${s.texto.toLowerCase()}). Soy el asistente de Punch Color: te respondo lo más común y lo que no sepa te lo dejo listo para mandar por WhatsApp.`, `Hi! We’re not available right now (${s.texto.toLowerCase()}). I’m the Punch Color assistant: I’ll answer the most common questions, and anything I don’t know I’ll get ready for you to send on WhatsApp.`);
  };
  const respuestas = {
    saludo: () => T('¡Hola! Preguntame por horarios, medios de pago, envíos, medidas o cualquier producto.', 'Hi! Ask me about hours, payment, shipping, sizes or any product.'),
    gracias: () => T('¡De nada! Si querés seguir mirando, la tienda está acá: ', 'You’re welcome! If you want to keep browsing, the shop is here: ') + `<a href="${CATALOGO_URL}">${T('ver la tienda', 'see the shop')}</a>.`,
    horario: () => `${T('Atendemos de lunes a viernes de 9 a 13 y de 16 a 20 h, y los sábados de 9 a 13 h. Los domingos está cerrado.', 'We’re open Monday to Friday 9 am–1 pm and 4–8 pm, and Saturday 9 am–1 pm. Closed on Sunday.')} <strong>${estadoLocal().texto}.</strong> ${T('La tienda online funciona siempre.', 'The online shop is always open.')}`,
    ubicacion: () => T('Estamos en Saavedra 589, en el local de Librería Colorete. Más arriba tenés el mapa. Si querés retirar un pedido, avisanos antes por WhatsApp.', 'We’re at Saavedra 589, inside Librería Colorete. The map is right next to this chat. If you want to pick up an order, let us know on WhatsApp first.'),
    pagos: () => T('Desde Argentina pagás con Mercado Pago. Desde otro país, con Payoneer: tocá «EN» arriba y ves los precios en dólares.', 'From abroad you pay with Payoneer, in US dollars. From Argentina you pay with Mercado Pago: tap “ES” at the top to see prices in pesos.'),
    envios: () => T('Enviamos a todo el país y al exterior. El envío lo coordinamos por WhatsApp según tu destino, y te pasamos el costo antes de pagar.', 'We ship across Argentina and abroad. We arrange shipping on WhatsApp depending on where you are, and tell you the cost before you pay.') + linkWsp(T('Hola Punch Color, quería consultar el envío a: ', 'Hi Punch Color, I’d like to ask about shipping to: '), T('Consultar mi envío', 'Ask about my shipping')),
    medidas: () => T('Las mochilas miden 40 × 30 × 13 cm, las cartucheras tubo 21 × 8 × 8 cm, los organizadores plegables 24 × 13 cm cerrados y las agendas son A5. Cada producto tiene sus medidas en la ficha: tocá la foto y las ves.', 'Backpacks are 15.7 × 11.8 × 5.1 in, pencil tubes 8.3 × 3.1 × 3.1 in, folding organizers 9.4 × 5.1 in closed and planners are A5. Each product shows its size: tap the photo to see it.'),
    mayor: () => T('Para compras por cantidad (colegios, regalos empresariales o reventa) escribinos por WhatsApp y lo vemos juntos.', 'For bulk orders (schools, corporate gifts or resale) message us on WhatsApp and we’ll work it out together.') + linkWsp(T('Hola Punch Color, quería consultar por una compra por cantidad.', 'Hi Punch Color, I’d like to ask about a bulk order.'), T('Consultar por cantidad', 'Ask about bulk orders')),
    estampa: () => T('Hoy hay cuatro estampas: ', 'There are four prints right now: ') + ESTAMPAS.map(e => `<a href="${CATALOGO_URL}?est=${e.id}">${esc(tx(e.n))}</a>`).join(', ') + T('. Cada una tiene su mochila, su organizador y su set.', '. Each one has its backpack, organizer and set.'),
    humano: () => T('¡Dale! Te paso con Punch Color por WhatsApp. Si ahora no estamos, te responden apenas vuelvan.', 'Sure! Here’s Punch Color on WhatsApp. If we’re away right now, you’ll get an answer as soon as we’re back.') + linkWsp(T('Hola Punch Color, quería hacer una consulta.', 'Hi Punch Color, I have a question.'), T('Escribir por WhatsApp', 'Message on WhatsApp')),
  };
  const respuestaCategoria = cat => {
    const c = catDe(cat);
    const { items } = Tienda.consultar({ filtros: { cat, moneda: moneda() }, orden: 'precio-asc', limite: 1 });
    const n = Tienda.contar({ cat });
    if (!items.length) return null;
    return T(`Tenemos ${n} ${tx(c.n).toLowerCase()}, desde ${formatearPrecio(items[0])}. `, `We have ${n} ${tx(c.n).toLowerCase()}, from ${formatearPrecio(items[0])}. `) + `<a href="${CATALOGO_URL}?cat=${cat}">${T(`Ver ${tx(c.n).toLowerCase()}`, `See ${tx(c.n).toLowerCase()}`)}</a>.`;
  };
  const pensar = texto => {
    const t = norm(texto);
    const orden = ['humano', 'horario', 'ubicacion', 'pagos', 'envios', 'medidas', 'mayor', 'estampa'];
    const k = orden.find(x => tiene(t, BOT.claves[x]));
    const cat = Object.keys(BOT.catClaves).find(c => tiene(t, BOT.catClaves[c]));
    if (k && k !== 'estampa') return respuestas[k]();
    if (cat) return respuestaCategoria(cat) || respuestas.estampa();
    if (k) return respuestas[k]();
    if (tiene(t, BOT.claves.gracias)) return respuestas.gracias();
    if (tiene(t, BOT.claves.saludo)) return respuestas.saludo();
    return T('Esa no la tengo. Te dejo tu pregunta lista para mandar por WhatsApp: te responden apenas vuelvan.', 'I don’t have that one. I’ve got your question ready to send on WhatsApp: you’ll get an answer as soon as we’re back.') +
      linkWsp(T('Hola Punch Color, les escribo desde la web: ', 'Hi Punch Color, writing from the website: ') + texto, T('Mandar mi pregunta', 'Send my question'));
  };
  const pintarChips = () => {
    chipsEl.innerHTML = BOT.chips.map(c => `<button type="button" class="bot__chip" data-bot="${c.k}">${esc(tx(c.n))}</button>`).join('');
  };
  const reiniciar = () => { log.innerHTML = ''; agregar(saludo(), 'bot'); pintarChips(); };
  reiniciar();
  chipsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-bot]');
    if (!b) return;
    agregar(esc(b.textContent), 'yo');
    responder(respuestas[b.dataset.bot]());
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim().slice(0, 160);
    if (!v) { input.focus(); return; }
    agregar(esc(v), 'yo');
    input.value = '';
    responder(pensar(v));
  });
  alCambiarIdioma.push(reiniciar);
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
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(e, nav); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-m2__sq img', { scale: 1.12, duration: 1.8 }, 0.1);
  paso('.hero-m1__card', { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.12);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.22);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-pagos, .hero-m2__cats li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero-sello .logo', { scale: 0.92, rotate: -25, opacity: 0, duration: 1.1, ease: 'back.out(2.2)', clearProps: 'transform,opacity' }, 0.7);
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

aplicarTextos();
initLang();
initMenuCategorias();
initSwatches();
initCats();
initHeroCats();
initRail();
initPreview();
initEstampasTabs();
initCatalogo();
initReveals();
initNav();
initNavCats();
initAccionesCards();
initCartUI();
initFloats();
initQuickView();
initResenas();
initGaleria();
initVisita();
initBot();
initHeroMotion();
initModelBarScroll();
updateCartBadge();
abrirProductoDeUrl();
