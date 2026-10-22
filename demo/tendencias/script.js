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

const WSP = '5491144302454';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'audio', nombre: 'Audio', img: 'images/cat-auriculares.webp', bajada: 'Auriculares inalámbricos, de vincha y parlantes portátiles para llevar la música a todos lados.',
    subs: [{ id: 'auriculares', nombre: 'Auriculares' }, { id: 'parlantes', nombre: 'Parlantes' }] },
  { id: 'tecnologia', nombre: 'Tecnología', img: 'images/cat-celulares.webp', bajada: 'Celulares, relojes inteligentes y gadgets para el escritorio y el living.',
    subs: [{ id: 'celulares', nombre: 'Celulares' }, { id: 'relojes', nombre: 'Relojes inteligentes' }, { id: 'gadgets', nombre: 'Gadgets' }] },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/cat-accesorios.webp', bajada: 'Carga, soportes y orden para el celular, la compu y el escritorio.',
    subs: [{ id: 'carga', nombre: 'Carga y baterías' }, { id: 'escritorio', nombre: 'Escritorio' }, { id: 'contenido', nombre: 'Fotos y videos' }] },
  { id: 'hogar', nombre: 'Hogar', img: 'images/cat-hogar.webp', bajada: 'Lámparas, humidificadores y objetos para tu casa que se volvieron tendencia en redes.',
    subs: [{ id: 'iluminacion', nombre: 'Iluminación' }, { id: 'bienestar', nombre: 'Bienestar' }] },
];
const USOS = {
  escritorio: { nombre: 'Escritorio y home office', corto: 'Escritorio' },
  musica: { nombre: 'Música y llamadas', corto: 'Música' },
  salir: { nombre: 'Para salir y viajar', corto: 'Para salir' },
  cuarto: { nombre: 'Para tu cuarto', corto: 'Tu cuarto' },
  crear: { nombre: 'Fotos y videos', corto: 'Fotos y videos' },
};
const PRECIOS = {
  'hasta-30': { nombre: 'Hasta $30.000', min: 0, max: 30000 },
  '30-80': { nombre: '$30.000 a $80.000', min: 30000, max: 80000 },
  '80-200': { nombre: '$80.000 a $200.000', min: 80000, max: 200000 },
  'mas-200': { nombre: 'Más de $200.000', min: 200000, max: Infinity },
};
const DISPONIBILIDAD = { stock: 'En stock', oferta: 'Con descuento', nuevo: 'Recién llegados' };
const ORDENES = { destacados: 'En tendencia', nuevos: 'Lo más nuevo', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const NUEVO_DESDE = 19;
const TOP_RAIL = 8;
const TOP_RANKING = 5;

const PRODUCTOS = [
  { id: 'auriculares-vincha', nombre: 'Auriculares de vincha con cancelación de ruido', cat: 'audio', sub: 'auriculares', usos: ['musica', 'salir', 'escritorio'],
    precio: 89900, descuento: 15, stock: 6, rango: 1, alta: 14, img: 'images/p-auriculares-vincha.webp',
    alt: 'Auriculares de vincha negros con almohadillas de cuero sintético, apoyados sobre un bloque de piedra',
    dato: 'Cancelación activa · 40 h de batería',
    specs: ['Bluetooth 5.3, conectados a 2 equipos a la vez', 'Cancelación activa de ruido y modo ambiente', 'Hasta 40 h de batería (30 h con cancelación)', 'Plegables, con estuche de viaje'],
    desc: 'Almohadillas mullidas, vincha regulable y un modo ambiente para escuchar lo que pasa sin sacártelos. Para viajar, trabajar o desconectarte un rato.' },
  { id: 'auriculares-pro', nombre: 'Auriculares in-ear con cancelación activa', cat: 'audio', sub: 'auriculares', usos: ['musica', 'salir'],
    precio: 54900, stock: 9, rango: 2, alta: 18, img: 'images/p-auriculares-pro.webp',
    alt: 'Auriculares in-ear blancos dentro de su estuche de carga abierto, sobre una mesa clara',
    dato: 'Cancelación activa · estuche con carga',
    specs: ['Cancelación activa y modo transparencia', 'Controles táctiles en cada auricular', 'Hasta 6 h por carga y 24 h con el estuche', 'El estuche carga por USB-C o sin cables'],
    desc: 'Chiquitos, livianos y con cancelación de ruido para el colectivo o la oficina. Tocás el auricular para pausar, pasar de tema o atender.' },
  { id: 'reloj-inteligente', nombre: 'Reloj inteligente con pantalla AMOLED', cat: 'tecnologia', sub: 'relojes', usos: ['salir'],
    precio: 64900, stock: 10, rango: 3, alta: 15, img: 'images/p-reloj-inteligente.webp',
    alt: 'Reloj inteligente negro de pantalla cuadrada con malla de silicona, parado sobre una mesada de piedra',
    dato: 'Pantalla 1,8″ · hasta 7 días',
    specs: ['Pantalla AMOLED de 1,8″', 'Pasos, ritmo cardíaco y horas de sueño', 'Avisos de WhatsApp y llamadas en la muñeca', 'Hasta 7 días de batería'],
    desc: 'Ves las notificaciones sin sacar el celular, medís tus pasos y cómo dormiste. Malla de silicona suave para usarlo todo el día.' },
  { id: 'auriculares-tws', nombre: 'Auriculares inalámbricos compactos', cat: 'audio', sub: 'auriculares', usos: ['musica', 'salir'],
    precio: 32900, descuento: 10, stock: 14, rango: 4, alta: 9, img: 'images/p-auriculares-tws.webp',
    alt: 'Auriculares inalámbricos blancos y redondos dentro de su estuche ovalado abierto, sobre piedra gris',
    dato: 'Bluetooth 5.3 · 28 h con estuche',
    specs: ['Bluetooth 5.3 con emparejamiento automático', 'Hasta 7 h por carga y 28 h con el estuche', 'Resisten salpicaduras y transpiración (IPX4)', 'Micrófono para llamadas'],
    desc: 'Los de todos los días: se conectan solos al abrir el estuche y entran en cualquier bolsillo.' },
  { id: 'lampara-hongo', nombre: 'Lámpara hongo LED recargable', cat: 'hogar', sub: 'iluminacion', usos: ['cuarto', 'escritorio'],
    precio: 27900, stock: 9, rango: 5, alta: 1, img: 'images/p-lampara-hongo.webp',
    alt: 'Lámpara con forma de hongo encendida con luz cálida, sobre una mesa de luz junto a una planta y un libro',
    dato: 'Táctil · 3 tonos de luz',
    specs: ['Tocás la parte de arriba para prenderla', '3 tonos de luz y brillo regulable', 'Batería recargable: hasta 8 h encendida', 'Se carga por USB-C'],
    desc: 'La lámpara que aparece en todos los cuartos de las redes: luz cálida, sin cables a la vista y lista para llevar de la mesa de luz al escritorio.' },
  { id: 'mini-proyector', nombre: 'Mini proyector portátil', cat: 'tecnologia', sub: 'gadgets', usos: ['cuarto', 'escritorio'],
    precio: 139900, descuento: 15, stock: 3, rango: 6, alta: 20, img: 'images/p-proyector.webp',
    alt: 'Mini proyector blanco con correa verde y cabezal giratorio, sobre una superficie clara',
    galeria: [{ img: 'images/g-proyector-escritorio.webp', alt: 'El mini proyector sobre un escritorio, con el cabezal girado hacia el costado' }],
    dato: 'Imagen de hasta 120″ · gira 180°',
    specs: ['Proyecta de 40″ a 120″ en la pared', 'Cabezal que gira 180° para proyectar en el techo', 'Wi-Fi y bluetooth para conectar el celular', 'Parlante incorporado'],
    desc: 'Una pantalla grande donde quieras: en la pared del cuarto, en el techo para ver series acostado o en el patio.' },
  { id: 'teclado-patitas', nombre: 'Teclado mecánico con teclas de patitas', cat: 'tecnologia', sub: 'gadgets', usos: ['escritorio', 'crear'],
    precio: 79900, stock: 4, rango: 7, alta: 22, img: 'images/p-teclado-patitas.webp',
    alt: 'Teclado mecánico lila con teclas en colores pastel que tienen dibujadas huellitas de gato',
    dato: 'Teclas intercambiables · USB-C',
    specs: ['Teclas con huellitas en colores pastel', 'Switches mecánicos intercambiables', 'Luz de fondo regulable', 'Cable USB-C desmontable'],
    desc: 'El teclado que convierte el escritorio en el rincón más lindo de la casa. Suena y se siente como un mecánico de verdad.' },
  { id: 'lampara-atardecer', nombre: 'Lámpara proyectora de atardecer', cat: 'hogar', sub: 'iluminacion', usos: ['cuarto', 'crear'],
    precio: 19900, descuento: 20, stock: 16, rango: 8, alta: 17, img: 'images/p-lampara-atardecer.webp',
    alt: 'Lámpara de pie metálica que proyecta un círculo de luz naranja de atardecer sobre una pared oscura',
    dato: 'Luz de atardecer · cabezal giratorio',
    specs: ['Proyecta un círculo de luz cálida en la pared', 'Cabezal que gira 180°', 'Luz ideal para fotos y videos', 'Conexión USB'],
    desc: 'La luz de la hora dorada, a cualquier hora. Para el cuarto, para sacarte fotos o para grabar tus videos.' },
  { id: 'parlante-mini', nombre: 'Parlante bluetooth portátil', cat: 'audio', sub: 'parlantes', usos: ['musica', 'salir', 'cuarto'],
    precio: 42900, stock: 8, rango: 9, alta: 11, img: 'images/p-parlante-mini.webp',
    alt: 'Parlante bluetooth cilíndrico negro con tela tejida y correa de silicona, sobre una mesa con plantas',
    galeria: [{ img: 'images/g-parlante-correa.webp', alt: 'El parlante bluetooth negro con su correa, de cerca' }],
    dato: 'Sonido 360° · resiste salpicaduras',
    specs: ['Bluetooth 5.3, alcance de 10 m', 'Hasta 12 h de música', 'Correa de silicona para colgarlo', 'Se conecta con otro igual para sonido estéreo'],
    desc: 'Chico pero con buen volumen, para la mesa, la pileta o la mochila. La correa lo cuelga de donde quieras.' },
  { id: 'celular-5g', nombre: 'Celular 5G de 6,1″', cat: 'tecnologia', sub: 'celulares', usos: ['crear', 'salir'],
    precio: 499900, stock: 0, rango: 10, alta: 16, img: 'images/p-celular-5g.webp',
    alt: 'Celular gris oscuro de espaldas con cámara doble, parado sobre una mesada de mármol',
    variantes: { nombre: 'Memoria', opciones: [{ id: '128', nombre: '128 GB', extra: 0, stock: 5 }, { id: '256', nombre: '256 GB', extra: 70000, stock: 2 }] },
    dato: 'Pantalla 6,1″ · cámara doble',
    specs: ['Pantalla OLED de 6,1″', 'Cámara doble de 50 MP con modo noche', '8 GB de RAM', 'Batería de 4.500 mAh con carga rápida'],
    desc: 'Compacto, liviano y con 5G. La cámara doble con modo noche saca buenas fotos aunque haya poca luz.' },
  { id: 'celular-67', nombre: 'Celular de 6,7″ con batería de 5.000 mAh', cat: 'tecnologia', sub: 'celulares', usos: ['salir', 'crear'],
    precio: 389900, stock: 0, rango: 0, alta: 12, img: 'images/g-celular-mesa.webp',
    alt: 'Celular negro de pantalla grande apoyado sobre una mesa clara, con la luz de la ventana reflejada',
    variantes: { nombre: 'Memoria', opciones: [{ id: '128', nombre: '128 GB', extra: 0, stock: 4 }, { id: '256', nombre: '256 GB', extra: 55000, stock: 3 }] },
    dato: 'Pantalla 6,7″ · 5.000 mAh',
    specs: ['Pantalla de 6,7″ a 120 Hz', 'Batería de 5.000 mAh para todo el día', 'Cámara principal de 64 MP', 'Lector de huella en la pantalla'],
    desc: 'Pantalla grande para series y videos, y una batería que aguanta de la mañana a la noche.' },
  { id: 'despertador-retro', nombre: 'Reloj despertador retro con parlante', cat: 'audio', sub: 'parlantes', usos: ['cuarto', 'musica'],
    precio: 46900, stock: 4, rango: 0, alta: 21, img: 'images/p-reloj-despertador.webp',
    alt: 'Reloj despertador retro verde petróleo con dígitos grandes y un parlante al costado, sobre un mueble de madera',
    dato: 'Reloj, alarma y parlante bluetooth',
    specs: ['Dígitos grandes con 3 niveles de brillo', 'Parlante bluetooth para tu música o podcasts', 'Dos alarmas y radio FM', 'Se carga por USB-C'],
    desc: 'Diseño retro para la mesa de luz: te despierta con tu música y a la noche se convierte en parlante.' },
  { id: 'bateria-llavero', nombre: 'Batería de llavero para reloj inteligente', cat: 'accesorios', sub: 'carga', usos: ['salir'],
    precio: 29900, stock: 0, rango: 0, alta: 19, img: 'images/p-bateria-portatil.webp',
    alt: 'Cuatro baterías de llavero con mosquetón en crema, bordó, terracota y durazno, apoyadas contra una pared',
    variantes: { nombre: 'Color', opciones: [{ id: 'crema', nombre: 'Crema', extra: 0, stock: 3 }, { id: 'bordo', nombre: 'Bordó', extra: 0, stock: 4 }, { id: 'terracota', nombre: 'Terracota', extra: 0, stock: 2 }, { id: 'durazno', nombre: 'Durazno', extra: 0, stock: 0 }] },
    dato: 'Carga tu reloj sin cables',
    specs: ['Base magnética para relojes con carga inalámbrica', 'Batería de 2.000 mAh', 'Mosquetón para colgarla de la mochila o las llaves', 'Se recarga por USB-C'],
    desc: 'Le das una carga al reloj en cualquier lado: la colgás de las llaves y te olvidás.' },
  { id: 'cargador-inalambrico', nombre: 'Cargador inalámbrico de 15 W', cat: 'accesorios', sub: 'carga', usos: ['escritorio', 'cuarto'],
    precio: 24900, stock: 15, rango: 0, alta: 6, img: 'images/p-cargador-inalambrico.webp',
    alt: 'Celular negro apoyado sobre un cargador inalámbrico redondo con superficie símil mármol y aro dorado',
    dato: 'Carga rápida · base símil mármol',
    specs: ['Carga rápida de hasta 15 W', 'Para celulares con carga inalámbrica (Qi)', 'Base símil mármol con aro dorado', 'Incluye cable USB-C'],
    desc: 'Apoyás el celular y carga, sin buscar el cable. Queda lindo en la mesa de luz o en el escritorio.' },
  { id: 'tripode-selfie', nombre: 'Palo de selfie y trípode con control', cat: 'accesorios', sub: 'contenido', usos: ['crear', 'salir'],
    precio: 22900, stock: 11, rango: 0, alta: 13, img: 'images/p-tripode-selfie.webp',
    alt: 'Mano sosteniendo un palo de selfie negro con un celular, con las patas del trípode cerradas',
    dato: 'Trípode + control bluetooth',
    specs: ['Se extiende hasta 100 cm', 'Las patas se abren para usarlo de trípode', 'Control remoto bluetooth desmontable', 'Gira 360° para fotos verticales u horizontales'],
    desc: 'Para tus videos, las fotos de grupo o las videollamadas: lo parás en la mesa y disparás con el control.' },
  { id: 'soporte-aluminio', nombre: 'Soporte de aluminio para celular y tablet', cat: 'accesorios', sub: 'escritorio', usos: ['escritorio', 'crear'],
    precio: 18900, stock: 20, rango: 0, alta: 4, img: 'images/p-soporte-aluminio.webp',
    alt: 'Soporte plegable de aluminio plateado para celular, sobre un escritorio junto a una notebook',
    dato: 'Plegable · ángulo regulable',
    specs: ['Aluminio con base antideslizante', 'Altura y ángulo regulables', 'Para celulares y tablets de 4″ a 13″', 'Se pliega para llevarlo en la mochila'],
    desc: 'El celular a la altura de los ojos para videollamadas, recetas o series mientras trabajás.' },
  { id: 'organizador-cables', nombre: 'Organizador de cables de silicona', cat: 'accesorios', sub: 'escritorio', usos: ['escritorio'],
    precio: 7900, stock: 30, rango: 0, alta: 3, img: 'images/p-organizador-cables.webp',
    alt: 'Organizador de silicona verde salvia sosteniendo dos cables blancos en el borde de un escritorio de madera',
    dato: 'Para 2 cables · adhesivo',
    specs: ['Sostiene 2 cables en el borde del escritorio', 'Silicona suave en verde salvia', 'Se pega con adhesivo', 'Para cables de carga, auriculares o mouse'],
    desc: 'Se terminaron los cables que se caen detrás del escritorio. Lo pegás y cada cable queda en su lugar.' },
  { id: 'teclado-compacto', nombre: 'Teclado mecánico compacto de 68 teclas', cat: 'tecnologia', sub: 'gadgets', usos: ['escritorio'],
    precio: 69900, stock: 6, rango: 0, alta: 7, img: 'images/p-teclado-compacto.webp',
    alt: 'Teclado mecánico compacto con teclas gris oscuro, gris claro y una tecla naranja, sobre un escritorio de madera',
    dato: 'Bluetooth y cable · 68 teclas',
    specs: ['Formato compacto de 68 teclas', 'Se conecta por bluetooth a 3 equipos o por cable', 'Funciona con Windows, Mac, Android y iPhone', 'Batería recargable'],
    desc: 'Ocupa menos lugar que uno común y pasás de la compu a la tablet con un botón.' },
  { id: 'humidificador', nombre: 'Humidificador difusor símil madera', cat: 'hogar', sub: 'bienestar', usos: ['cuarto', 'escritorio'],
    precio: 26900, stock: 10, rango: 0, alta: 10, img: 'images/p-humidificador.webp',
    alt: 'Humidificador difusor redondo con terminación símil madera, sobre una superficie blanca',
    dato: 'Ultrasónico · luz LED',
    specs: ['Humidificador ultrasónico de 300 ml', 'Le podés sumar unas gotas de esencia', 'Luz LED en 7 colores', 'Se apaga solo cuando se queda sin agua'],
    desc: 'Humedece el ambiente y, con unas gotas de esencia, perfuma el cuarto. Con luz suave para la noche.' },
  { id: 'lampara-luna', nombre: 'Lámpara luna 3D', cat: 'hogar', sub: 'iluminacion', usos: ['cuarto'],
    precio: 24900, stock: 0, rango: 0, alta: 8, img: 'images/p-lampara-luna.webp',
    alt: 'Lámpara con forma de luna encendida sobre una base de madera, junto a un farol con velas',
    dato: '16 colores · control remoto',
    specs: ['Textura de luna impresa en 3D', '16 colores y brillo regulable', 'Control remoto y encendido táctil', 'Base de madera incluida'],
    desc: 'Una luna llena en la mesa de luz, del blanco al color que quieras.' },
  { id: 'gua-sha', nombre: 'Set de rodillo y gua sha de cuarzo rosa', cat: 'hogar', sub: 'bienestar', usos: ['cuarto'],
    precio: 16900, stock: 12, rango: 0, alta: 5, img: 'images/p-gua-sha.webp',
    alt: 'Rodillo facial doble y piedra gua sha de cuarzo rosa sobre una placa de mármol blanco',
    dato: 'Cuarzo rosa · 2 piezas',
    specs: ['Rodillo doble y piedra gua sha', 'Cuarzo rosa', 'Para usar con tu crema o sérum', 'Se guarda en la heladera para un efecto frío'],
    desc: 'El ritual de skincare de las redes: masajeás la cara con tu crema y desinflamás en dos minutos.' },
  { id: 'licuadora-portatil', nombre: 'Licuadora portátil recargable', cat: 'hogar', sub: 'bienestar', usos: ['salir'],
    precio: 31900, stock: 8, rango: 0, alta: 23, img: 'images/p-licuadora-portatil.webp',
    alt: 'Licuadora portátil con vaso transparente cargada de melón, semillas y avena, sobre una mesa con sol',
    dato: 'Vaso de 400 ml · USB-C',
    specs: ['Vaso de 400 ml que sirve de botella', 'Batería para unos 15 licuados por carga', 'Cuchillas de acero inoxidable', 'Se carga por USB-C'],
    desc: 'Tu licuado en el gimnasio, la oficina o la facu: licuás y tomás del mismo vaso.' },
  { id: 'ventilador-retro', nombre: 'Ventilador de escritorio retro', cat: 'hogar', sub: 'bienestar', usos: ['escritorio', 'cuarto'],
    precio: 34900, stock: 5, rango: 0, alta: 2, img: 'images/p-ventilador-retro.webp',
    alt: 'Ventilador de escritorio chico en crema y dorado, con estilo retro, sobre una mesa blanca',
    dato: 'Silencioso · 3 velocidades',
    specs: ['Diseño retro en crema y dorado', '3 velocidades', 'Cabezal inclinable', 'Funciona por USB o con batería'],
    desc: 'Para el escritorio o la mesa de luz en verano: chico, silencioso y lindo de ver.' },
  { id: 'borrador-anillo-luz', nombre: 'Aro de luz (borrador)', cat: 'accesorios', sub: 'contenido', usos: ['crear'],
    precio: 25900, stock: 4, rango: 0, alta: 0, visible: false, img: 'images/p-tripode-selfie.webp', alt: '', dato: '', specs: [], desc: '' },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
  if (!p.galeria) p.galeria = [];
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = (catId, subId) => catDe(catId)?.subs.find(s => s.id === subId);
const opcionesDe = p => (p.variantes ? p.variantes.opciones : []);
const opcionDe = (p, v) => opcionesDe(p).find(o => o.id === v);
const tieneVariantes = p => opcionesDe(p).length > 0;
const stockDe = (p, v = '') => (tieneVariantes(p) ? (opcionDe(p, v)?.stock ?? 0) : p.stock);
const stockTotal = p => (tieneVariantes(p) ? opcionesDe(p).reduce((s, o) => s + o.stock, 0) : p.stock);
const hayStock = p => stockTotal(p) > 0;
const primeraOpcion = p => (opcionesDe(p).find(o => o.stock > 0) || opcionesDe(p)[0])?.id || '';
const precioLista = (p, v = '') => p.precio + (opcionDe(p, v)?.extra || 0);
const precioDe = (p, v = '') => (p.descuento > 0 ? redondear(precioLista(p, v) * (1 - p.descuento / 100)) : precioLista(p, v));
const precioDesde = p => (tieneVariantes(p) ? Math.min(...opcionesDe(p).map(o => precioDe(p, o.id))) : precioDe(p));
const esNuevo = p => p.alta >= NUEVO_DESDE;
const enRango = (p, n) => p.rango > 0 && p.rango <= n;
const nombreLinea = (p, v) => (opcionDe(p, v) ? `${p.nombre} · ${opcionDe(p, v).nombre}` : p.nombre);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), subs = lista(f.subs), usos = lista(f.usos), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (subs.length && !subs.includes(p.sub)) return false;
    if (usos.length && !usos.some(u => p.usos.includes(u))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const r = PRECIOS[f.precio], v = precioDesde(p);
      if (v < r.min || v >= r.max) return false;
    }
    if (f.stock && !hayStock(p)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.nuevo && !esNuevo(p)) return false;
    if (f.rangoMax && !enRango(p, f.rangoMax)) return false;
    if (f.sinRango && enRango(p, f.sinRango)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || (hayStock(b) - hayStock(a)) || b.alta - a.alta || desempate(a, b);
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
    const cat = catDe(p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, subDe(p.cat, p.sub)?.nombre, p.dato, ...p.specs, p.desc,
      ...p.usos.map(u => USOS[u]?.nombre), ...opcionesDe(p).map(o => o.nombre),
      p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '',
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

const Cart = {
  KEY: 'tendencias_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id, v = '') { return this.get().filter(i => i.id === id && (i.v || '') === v).reduce((s, i) => s + i.qty, 0); },
  add(producto, v = '', qty = 1) {
    const libre = stockDe(producto, v) - this.enCarrito(producto.id, v);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, v, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.v || '') === v);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) : 1));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v || '') * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      const max = p ? stockDe(p, i.v || '') : 0;
      if (max <= 0) { changed = true; return false; }
      if (i.qty > max) { i.qty = max; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  opciones: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10"/><path d="M18 7h2"/><circle cx="16" cy="7" r="2"/><path d="M4 17h4"/><path d="M12 17h8"/><circle cx="10" cy="17" r="2"/></svg>',
  campana: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
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

const subNombre = p => subDe(p.cat, p.sub)?.nombre || catDe(p.cat)?.nombre || '';

function precioHTML(p, clase = 'precio') {
  const desde = tieneVariantes(p) && opcionesDe(p).some(o => o.extra > 0);
  const base = tieneVariantes(p) ? primeraOpcion(p) : '';
  const final = desde ? precioDesde(p) : precioDe(p, base);
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(desde ? p.precio : precioLista(p, base))}</s>` : '';
  return `<p class="${clase}">${desde ? '<small>Desde</small>' : ''}<b>${formatearPrecio(final)}</b>${tachado}</p>`;
}

function badgeHTML(p) {
  if (!hayStock(p)) return '<span class="etiqueta etiqueta--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (esNuevo(p)) return '<span class="etiqueta etiqueta--nuevo">Nuevo</span>';
  if (stockTotal(p) <= 4) return `<span class="etiqueta">Quedan ${stockTotal(p)}</span>`;
  return '';
}

function accionHTML(p) {
  if (!hayStock(p)) return `<a class="prod-add prod-add--avisar" href="${wspLink(`Hola Tendencias! Quiero que me avisen cuando vuelva: ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.campana}<span>Avisame</span></a>`;
  if (tieneVariantes(p)) return `<button type="button" class="prod-add prod-add--elegir" data-quick="${esc(p.id)}" aria-label="Elegir ${esc(p.variantes.nombre.toLowerCase())} de ${esc(p.nombre)}">${ICO.opciones}<span>Elegir</span></button>`;
  return `<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
}

function cardHTML(p, { anim = true, clase = '', animTipo = 'subir', rank = 0, ya = true } = {}) {
  const estado = animTipo === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(40px)';
  const directo = ya && hayStock(p) && !tieneVariantes(p);
  return `<article class="pcard${clase ? ' ' + clase : ''}" data-id="${esc(p.id)}"${anim ? ` data-animate="${animTipo}" style="${estado}"` : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badgeHTML(p)}
    ${rank ? `<span class="pcard__rank" aria-label="Puesto ${rank} en tendencia">#${rank}</span>` : ''}
    ${directo ? `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>` : ''}
  </div>
  <div class="pcard__info">
    <p class="pcard__sub">${esc(subNombre(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__dato">${esc(p.dato)}</p>
    <div class="pcard__pie">
      ${precioHTML(p)}
      <div class="prod-actions">${accionHTML(p)}</div>
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

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const subs = c.subs.map(s => `<a href="${URL_CATALOGO}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('');
      return `<li class="nav-drop__item"><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'producto' : 'productos'}</small></span></a><p class="nav-drop__subs">${subs}</p></li>`;
    }).join('');
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

function initCuentas() {
  const productos = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [cat, sub] = (el.dataset.cuenta || '').split(':');
    el.textContent = productos(Tienda.contar({ ...(cat ? { cat } : {}), ...(sub ? { subs: [sub] } : {}) }));
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const orden = cont.dataset.orden || 'nuevos';
    const filtros = cont.dataset.sinRango ? { sinRango: parseInt(cont.dataset.sinRango, 10) } : {};
    const { items } = Tienda.consultar({ filtros, orden, limite });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => cardHTML(p, { ya: false })).join('');
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, label, button')) return;
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
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    const prev = rail.querySelector('[data-rail-paso="-1"]');
    const next = rail.querySelector('[data-rail-paso="1"]');
    if (!vp || !track) return;
    const { items } = Tienda.consultar({ filtros: { rangoMax: TOP_RAIL }, orden: 'destacados', limite: TOP_RAIL });
    items.forEach(cachear);
    track.innerHTML = items.map(p => `<li class="rail-item">${cardHTML(p, { animTipo: 'der', rank: p.rango, ya: false })}</li>`).join('');
    initRailDrag(vp);
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 20;
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function rankAccion(p) {
  if (!hayStock(p)) return `<a class="btn btn--cta" href="${wspLink(`Hola Tendencias! Quiero que me avisen cuando vuelva: ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.campana}Avisame cuando vuelva</a>`;
  if (tieneVariantes(p)) return `<button type="button" class="btn btn--cta" data-quick="${esc(p.id)}">${ICO.opciones}Elegir ${esc(p.variantes.nombre.toLowerCase())}</button>`;
  return `<button type="button" class="btn btn--cta" data-add="${esc(p.id)}">${ICO.carrito}Agregar al carrito</button>`;
}

function initRanking() {
  const box = document.querySelector('[data-ranking]');
  if (!box) return;
  const lista = box.querySelector('[data-rank-lista]');
  const foto = box.querySelector('[data-rank-foto]');
  const info = box.querySelector('[data-rank-info]');
  if (!lista || !foto || !info) return;
  const { items } = Tienda.consultar({ filtros: { rangoMax: TOP_RANKING }, orden: 'destacados', limite: TOP_RANKING });
  items.forEach(cachear);
  lista.innerHTML = items.map((p, i) => `<li><button type="button" class="rank__fila" data-rank="${esc(p.id)}" aria-pressed="${i === 0}" aria-controls="rankDetalle">
    <span class="rank__n">${String(i + 1).padStart(2, '0')}</span>
    <img class="rank__mini" src="${esc(p.img)}" alt="" width="120" height="120">
    <span class="rank__txt"><b>${esc(p.nombre)}</b><small>${esc(p.dato)}</small></span>
    <span class="rank__precio">${formatearPrecio(precioDesde(p))}</span>
  </button></li>`).join('');
  let actual = '';
  const elegir = (id, animar = true) => {
    const p = getProducto(id);
    if (!p || id === actual) return;
    actual = id;
    lista.querySelectorAll('[data-rank]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.rank === id)));
    const pintar = () => {
      foto.src = p.img; foto.alt = p.alt;
      const n = items.findIndex(x => x.id === id) + 1;
      info.innerHTML = `<p class="rank__pos">#${n} en tendencia</p>
        <p class="rank__nombre">${esc(p.nombre)}</p>
        ${precioHTML(p, 'precio precio--grande')}
        <div class="rank__acc">${rankAccion(p)}<button type="button" class="btn btn--line" data-quick="${esc(p.id)}">Ver detalle</button></div>`;
    };
    if (!animar || reduceMotion) { pintar(); return; }
    box.classList.add('rank--cambia');
    setTimeout(() => { pintar(); box.classList.remove('rank--cambia'); }, 180);
  };
  const desdeEvento = e => e.target.closest('[data-rank]');
  lista.addEventListener('click', e => { const b = desdeEvento(e); if (b) elegir(b.dataset.rank); });
  lista.addEventListener('focusin', e => { const b = desdeEvento(e); if (b) elegir(b.dataset.rank); });
  const fino = window.matchMedia('(hover: hover) and (pointer: fine)');
  lista.addEventListener('mouseover', e => { if (!fino.matches) return; const b = desdeEvento(e); if (b) elegir(b.dataset.rank); });
  if (items[0]) elegir(items[0].id, false);
}

function initUsos() {
  const box = document.querySelector('[data-usos]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-uso-tab]')];
  const grid = box.querySelector('[data-uso-grid]');
  const link = box.querySelector('[data-uso-link]');
  if (!tabs.length || !grid) return;
  const pintar = (uso, animar) => {
    const filtros = uso === 'nuevos' ? { sinRango: TOP_RANKING } : { usos: [uso] };
    const { items } = Tienda.consultar({ filtros, orden: uso === 'nuevos' ? 'nuevos' : 'destacados', limite: 8 });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p, { ya: false })).join('');
    if (link) {
      const total = uso === 'nuevos' ? Tienda.contar({}) : Tienda.contar({ usos: [uso] });
      link.href = uso === 'nuevos' ? `${URL_CATALOGO}?orden=nuevos` : `${URL_CATALOGO}?uso=${uso}`;
      link.querySelector('span').textContent = uso === 'nuevos' ? `Ver los ${total} productos` : `Ver los ${total} productos para ${USOS[uso].corto.toLowerCase()}`;
    }
    const tab = tabs.find(t => t.dataset.usoTab === uso);
    if (tab) grid.setAttribute('aria-labelledby', tab.id);
    if (animar) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const elegir = (t, foco = false) => {
    tabs.forEach(b => {
      const activo = b === t;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    if (foco) t.focus();
    pintar(t.dataset.usoTab, true);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      elegir(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
  const inicial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  pintar(inicial.dataset.usoTab, false);
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, v = '', { qty = 1, comprar = false } = {}) {
  const n = Cart.add(p, v, qty);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id, v)) { abrirCarrito(); return 0; }
    showToast(stockDe(p, v) > 0 ? `Ya tenés en el carrito todas las unidades que quedan de ${nombreLinea(p, v)}.` : `${nombreLinea(p, v)} está sin stock por ahora.`);
    return 0;
  }
  if (comprar) { abrirCarrito(); return n; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${nombreLinea(p, v)} al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
  return n;
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !quick.closest('.qv')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      if (tieneVariantes(p)) { abrirQV(p.id, add); return; }
      const n = sumarAlCarrito(p, '', { comprar: add.hasAttribute('data-comprar') });
      if (n && !add.hasAttribute('data-comprar') && !reduceMotion) { add.classList.remove('sumado'); void add.offsetWidth; add.classList.add('sumado'); }
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvVariante = '';
let qvFoto = 0;
function abrirQV(id, origen, variante) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  qvVariante = tieneVariantes(p) ? (opcionDe(p, variante) ? variante : primeraOpcion(p)) : '';
  qvFoto = 0;
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
  if (ld) {
    const ofertas = tieneVariantes(p) ? opcionesDe(p) : [{ id: '', nombre: '', stock: p.stock }];
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
      category: `${catDe(p.cat)?.nombre} > ${subNombre(p)}`,
      offers: ofertas.map(o => ({ '@type': 'Offer', name: o.nombre || p.nombre, priceCurrency: 'ARS', price: precioDe(p, o.id), availability: stockDe(p, o.id) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })),
    });
  }
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const v = qvVariante;
  const fotos = [{ img: p.img, alt: p.alt }, ...p.galeria];
  const foto = fotos[qvFoto] || fotos[0];
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = stockDe(p, v);
  const libre = stock - Cart.enCarrito(p.id, v);
  const sin = stock <= 0;
  const estadoStock = sin ? 'Sin stock por ahora' : stock <= 4 ? `Últimas ${stock} unidades` : 'En stock';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__media"><img src="${esc(foto.img)}" alt="${esc(foto.alt)}" width="1000" height="1000">${badgeHTML(p)}</div>
      ${fotos.length > 1 ? `<div class="qv__thumbs" role="group" aria-label="Fotos del producto">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-qv-foto="${i}" aria-pressed="${i === qvFoto}" aria-label="Ver foto ${i + 1} de ${fotos.length}"><img src="${esc(f.img)}" alt="" width="120" height="120"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(catDe(p.cat)?.nombre)} · ${esc(subNombre(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__dato">${esc(p.dato)}</p>
      <div class="qv__precio-fila">${tieneVariantes(p) ? `<p class="precio precio--grande"><b>${formatearPrecio(precioDe(p, v))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioLista(p, v))}</s>` : ''}</p>` : precioHTML(p, 'precio precio--grande')}<span class="qv__stock${sin ? ' qv__stock--sin' : stock <= 4 ? ' qv__stock--pocas' : ''}">${esc(estadoStock)}</span></div>
      <p class="qv__desc">${esc(p.desc)}</p>
      <ul class="qv__specs">${p.specs.map(s => `<li>${ICO.check}<span>${esc(s)}</span></li>`).join('')}</ul>
      ${tieneVariantes(p) ? `<fieldset class="qv__vars"><legend>${esc(p.variantes.nombre)}: <b>${esc(opcionDe(p, v)?.nombre || '')}</b></legend><div class="vars">${opcionesDe(p).map(o => `<label class="var${o.stock <= 0 ? ' var--sin' : ''}"><input type="radio" name="qv-var" value="${esc(o.id)}"${o.id === v ? ' checked' : ''}${o.stock <= 0 ? ' disabled' : ''}><span>${esc(o.nombre)}${o.extra > 0 ? ` <small>+${formatearPrecio(p.descuento > 0 ? redondear(o.extra * (1 - p.descuento / 100)) : o.extra)}</small>` : ''}${o.stock <= 0 ? ' <small>sin stock</small>' : ''}</span></label>`).join('')}</div></fieldset>` : ''}
      <div class="qv__acc">
        ${sin
          ? `<a class="btn btn--cta" href="${wspLink(`Hola Tendencias! Quiero que me avisen cuando vuelva: ${nombreLinea(p, v)}.`)}" target="_blank" rel="noopener">${ICO.campana}Avisame cuando vuelva</a>`
          : `${libre > 0 ? `<div class="stepper stepper--grande" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${libre}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>` : ''}
        <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está en tu carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Tendencias! Tengo una consulta sobre: ${nombreLinea(p, v)}.`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con la compatibilidad? Preguntanos por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-qv-otro="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${tieneVariantes(r) ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
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
  qv.addEventListener('change', e => {
    const r = e.target.closest('input[name="qv-var"]');
    if (!r || !qvActual) return;
    qvVariante = r.value;
    pintarQV();
    qv.querySelector(`input[name="qv-var"][value="${CSS.escape(qvVariante)}"]`)?.focus({ preventScroll: true });
  });
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const f = e.target.closest('[data-qv-foto]');
    if (f) { qvFoto = parseInt(f.dataset.qvFoto, 10) || 0; pintarQV(); qv.querySelector(`[data-qv-foto="${qvFoto}"]`)?.focus({ preventScroll: true }); return; }
    const otro = e.target.closest('[data-qv-otro]');
    if (otro) { abrirQV(otro.dataset.qvOtro, ultimoFoco); qv.querySelector('.qv__panel').scrollTop = 0; return; }
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qvVariante, qty);
      if (!Cart.enCarrito(p.id, qvVariante)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, qvVariante, { qty });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null, PARAMS.get('opcion') || '');
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
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
    body.innerHTML = `<div class="cart-vacio">${ICO.bolsa}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Arrancá por lo que está en tendencia: auriculares, lámparas y gadgets para tu escritorio.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const v = i.v || '';
    const max = stockDe(p, v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-linea-v="${esc(v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${opcionDe(p, v) ? `${esc(p.variantes.nombre)}: ${esc(opcionDe(p, v).nombre)} · ` : ''}${formatearPrecio(precioDe(p, v))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(nombreLinea(p, v))}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, v) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${nombreLinea(p, i.v || '')}: ${formatearPrecio(precioDe(p, i.v || '') * i.qty)}`; }).join('\n');
  const msg = `Hola Tendencias! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi zona para la entrega: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El envío o el retiro se coordinan por WhatsApp después de la compra.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  Cart.syncStock();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    const v = linea.dataset.lineaV || '';
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, v, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"][data-linea-v="${CSS.escape(v)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
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
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    subs: new Set(),
    usos: new Set(lista('uso').filter(u => USOS[u])),
    disp: new Set(lista('disp').filter(d => DISPONIBILIDAD[d])),
    precio: valido(PARAMS.get('precio'), PRECIOS),
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const subsValidas = () => (estado.cat ? catIds[estado.cat].subs.map(s => s.id) : []);
  lista('sub').filter(s => subsValidas().includes(s)).forEach(s => estado.subs.add(s));
  const SETS = { sub: estado.subs, uso: estado.usos, disp: estado.disp };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');
  const subsBox = [...document.querySelectorAll('[data-sub-opciones]')];

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoTab = cont.dataset.catOpciones === 'tabs';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoTab
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los productos')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-uso-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(USOS).map(([k, u]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="uso"><span>${esc(u.nombre)}</span><span class="opt__n" data-cuenta-filtro-uso="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-uso-chips]').forEach(cont => {
    cont.innerHTML = Object.entries(USOS).map(([k, u]) => `<button type="button" class="chip" data-chip-uso="${k}" aria-pressed="false">${esc(u.corto)}</button>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-precio="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-disp-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(DISPONIBILIDAD).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="disp"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-disp="${k}"></span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const pintarSubs = () => {
    subsBox.forEach(cont => {
      const grupo = cont.closest('[data-sub-grupo]');
      const cat = catIds[estado.cat];
      if (grupo) grupo.hidden = !cat;
      if (!cat) { cont.innerHTML = ''; return; }
      const comoChips = cont.dataset.subOpciones === 'chips';
      cont.innerHTML = cat.subs.map(s => (comoChips
        ? `<button type="button" class="chip" data-chip-sub="${s.id}" aria-pressed="false">${esc(s.nombre)} <small data-cuenta-filtro-sub="${s.id}"></small></button>`
        : `<label class="opt"><input type="checkbox" value="${s.id}" data-f="sub"><span>${esc(s.nombre)}</span><span class="opt__n" data-cuenta-filtro-sub="${s.id}"></span></label>`)).join('');
    });
  };

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.subs.size && sin !== 'sub' && sin !== 'cat') f.subs = [...estado.subs];
    if (estado.usos.size && sin !== 'uso') f.usos = [...estado.usos];
    if (estado.precio && sin !== 'precio') f.precio = estado.precio;
    if (sin !== 'disp') estado.disp.forEach(d => { f[d] = true; });
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.subs.forEach(v => chips.push(['sub', v, subDe(estado.cat, v)?.nombre || v]));
    estado.usos.forEach(v => chips.push(['uso', v, USOS[v].nombre]));
    if (estado.precio) chips.push(['precio', '', PRECIOS[estado.precio].nombre]);
    estado.disp.forEach(v => chips.push(['disp', v, DISPONIBILIDAD[v]]));
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    document.querySelectorAll('[data-chip-uso]').forEach(b => b.setAttribute('aria-pressed', String(estado.usos.has(b.dataset.chipUso))));
    document.querySelectorAll('[data-chip-sub]').forEach(b => b.setAttribute('aria-pressed', String(estado.subs.has(b.dataset.chipSub))));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-sub]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('sub'), subs: [el.dataset.cuentaFiltroSub] }); });
    document.querySelectorAll('[data-cuenta-filtro-uso]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('uso'), usos: [el.dataset.cuentaFiltroUso] }); });
    document.querySelectorAll('[data-cuenta-filtro-precio]').forEach(el => { const k = el.dataset.cuentaFiltroPrecio; el.textContent = Tienda.contar({ ...filtrosDe('precio'), ...(k ? { precio: k } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-disp]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('disp'), [el.dataset.cuentaFiltroDisp]: true }); });
    const enPanel = estado.disp.size + (estado.precio ? 1 : 0)
      + (document.querySelector('#filtros [data-uso-opciones]') ? estado.usos.size : 0)
      + (document.querySelector('#filtros [data-sub-opciones]') ? estado.subs.size : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const sub = estado.subs.size === 1 ? subDe(estado.cat, [...estado.subs][0]) : null;
    const uso = !cat && estado.usos.size === 1 ? USOS[[...estado.usos][0]] : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : uso ? uso.nombre : estado.disp.size === 1 && estado.disp.has('nuevo') ? 'Recién llegados' : estado.disp.size === 1 && estado.disp.has('oferta') ? 'Productos con descuento' : 'Todos los productos';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Audio, tecnología, accesorios y objetos para tu casa que se volvieron tendencia. Filtrá por categoría, uso o precio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todos los productos'; miga.textContent = titulo; }
    document.title = `${titulo} — Tendencias`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'uso', 'precio', 'disp', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.subs.size) u.searchParams.set('sub', [...estado.subs].join(','));
    if (estado.usos.size) u.searchParams.set('uso', [...estado.usos].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.disp.size) u.searchParams.set('disp', [...estado.disp].join(','));
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
    if (agregar && !res.items.length) showToast('No hay más productos para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const cambiarCat = id => { if (estado.cat !== id) estado.subs.clear(); estado.cat = id; pintarSubs(); };
  const limpiar = () => {
    cambiarCat(''); estado.precio = ''; estado.q = '';
    Object.values(SETS).forEach(s => s.clear());
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = SETS[multi.dataset.f];
      if (!set) return;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    if (el.dataset.filtro === 'cat') cambiarCat(el.value); else estado[el.dataset.filtro] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      if (b.dataset.filtro === 'cat') cambiarCat(b.dataset.valor || ''); else estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const chipUso = e.target.closest('[data-chip-uso]');
    if (chipUso) {
      const k = chipUso.dataset.chipUso;
      if (estado.usos.has(k)) estado.usos.delete(k); else estado.usos.add(k);
      aplicar();
      return;
    }
    const chipSub = e.target.closest('[data-chip-sub]');
    if (chipSub) {
      const k = chipSub.dataset.chipSub;
      if (estado.subs.has(k)) estado.subs.delete(k); else estado.subs.add(k);
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = '';
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
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

  pintarSubs();
  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('.raya--hero', { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, clearProps: 'transform' }, 0.2);
  paso('h1', { y: 34, opacity: 0, duration: 1.2 }, 0.25);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.rank__cab', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.45);
  paso('.rank__fila', { x: 28, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform,opacity' }, 0.5);
  paso('.rank__info', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initRanking,
  initUsos,
  initVistaPrevia,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
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
