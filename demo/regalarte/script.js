const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP = '5491150518126';
const API_LIMITE = 100;
const POR_PAGINA = 16;

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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wspHref = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const vistos = new Map();
const getProducto = id => vistos.get(id);

const CATEGORIAS = [
  { id: 'libreria', nombre: 'Librería', img: 'images/cat-libreria.webp' },
  { id: 'jugueteria', nombre: 'Juguetería', img: 'images/cat-jugueteria.webp' },
  { id: 'regaleria', nombre: 'Regalería', img: 'images/cat-regaleria.webp' },
  { id: 'cotillon', nombre: 'Cotillón', img: 'images/cat-cotillon.webp' },
  { id: 'tecno', nombre: 'Tecno y 3D', img: 'images/cat-tecno.webp' },
];
const catDe = id => CATEGORIAS.find(c => c.id === id);
const RANGOS_PRECIO = { '0-5000': 'Hasta $5.000', '5000-15000': 'De $5.000 a $15.000', '15000-30000': 'De $15.000 a $30.000', '30000-': 'Más de $30.000' };

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  tacho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Servidor = (() => {
  const P = (id, nombre, cat, sub, precio, img, extra) => Object.freeze({ id, nombre, cat, sub, precio, img: `images/${img}.webp`, descuento: 0, stock: 10, destacado: 0, promo: 0, nuevo: false, opciones: null, etiquetas: '', kicker: '', corto: '', desc: '', alt: '', ...extra });
  const COLECCION = Object.freeze([
    P('lib-libreta-elastico', 'Libreta tapa dura con elástico A5', 'libreria', 'Cuadernos', 9900, 'p-cuaderno-elastico', { stock: 14, destacado: 1, opciones: { nombre: 'Color', valores: ['Crema', 'Aqua', 'Petróleo'] }, etiquetas: 'libreta agenda anotador notas bullet journal', desc: 'Libreta A5 de tapa dura con 96 hojas lisas y elástico para que no se abra en la mochila. Sirve para apuntes, agenda o dibujo.', alt: 'Libreta blanca de tapa dura con elástico petróleo sobre cuadernos espiralados' }),
    P('lib-cuaderno-espiral', 'Cuaderno espiral A4 · 120 hojas cuadriculadas', 'libreria', 'Cuadernos', 8600, 'p-cuaderno-espiral', { stock: 20, opciones: { nombre: 'Tapa', valores: ['Petróleo', 'Celeste'] }, etiquetas: 'cuaderno escolar secundaria facultad cuadriculado', desc: 'Cuaderno A4 con espiral doble y 120 hojas cuadriculadas. Tapa dura que aguanta todo el año.', alt: 'Cuadernos espiralados azul petróleo y celeste con anillos dorados' }),
    P('lib-cuaderno-estampado', 'Cuaderno universitario tapa estampada', 'libreria', 'Cuadernos', 7400, 'p-cuadernos-estampados', { stock: 18, nuevo: true, opciones: { nombre: 'Diseño', valores: ['Corazones', 'Lunares', 'Panda'] }, etiquetas: 'cuaderno escolar rayado universitario', desc: 'Cuaderno universitario de 80 hojas rayadas con tapas estampadas. Hay diseños de corazones, lunares y panda.', alt: 'Mesa con cuadernos de tapas estampadas en rosa, lila y verde agua' }),
    P('lib-resaltadores', 'Resaltadores pastel · set x4', 'libreria', 'Escritura', 5800, 'p-resaltadores', { stock: 25, descuento: 15, promo: 5, kicker: 'Útiles', etiquetas: 'resaltador marcador fluo subrayar lettering', desc: 'Set de 4 resaltadores en tonos pastel con punta biselada, para subrayar y para lettering.', alt: 'Resaltadores en tonos verde agua, celeste y menta' }),
    P('lib-lapiceras-gel', 'Lapiceras de gel pastel · x10', 'libreria', 'Escritura', 7800, 'p-lapiceras-gel', { stock: 16, destacado: 4, etiquetas: 'lapicera birome boligrafo gel colores', desc: 'Diez lapiceras de gel en colores pastel, de trazo suave. Van bien para apuntes y para decorar el cuaderno.', alt: 'Vasos con lapiceras de gel en colores pastel sobre una mesa de madera' }),
    P('lib-lapices-color', 'Lápices de colores tonos agua · x12', 'libreria', 'Arte', 6900, 'p-lapices-color', { stock: 12, etiquetas: 'lapices colores dibujo pintar escolar', desc: 'Doce lápices de colores en la gama de los verdes y los azules, para dibujar y pintar.', alt: 'Lápices de colores verdes y azul petróleo junto a una bandeja con clips dorados' }),
    P('lib-gomas', 'Gomas de borrar · pack x3', 'libreria', 'Escritura', 2400, 'p-gomas', { stock: 40, etiquetas: 'goma borrar escolar', desc: 'Tres gomas de borrar, blanca y de colores, que no manchan la hoja.', alt: 'Gomas de borrar verde agua y blanca sobre mármol' }),
    P('lib-washi', 'Cintas washi decoradas · x3', 'libreria', 'Arte', 3900, 'p-cinta-washi', { stock: 22, nuevo: true, etiquetas: 'cinta washi scrapbooking manualidades decorar', desc: 'Tres rollos de cinta washi decorada para agendas, scrapbooking y paquetes de regalo.', alt: 'Rollos de cinta washi verde agua y con lunares en un cuenco de cerámica' }),
    P('lib-notas', 'Notas adhesivas pastel · 4 blocks', 'libreria', 'Oficina', 4200, 'p-notas-adhesivas', { stock: 30, etiquetas: 'notas adhesivas post it anotador', desc: 'Cuatro blocks de notas autoadhesivas en colores pastel, para el escritorio o la heladera.', alt: 'Blocks de notas adhesivas celeste y amarillo pastel en una bandeja de mármol' }),
    P('lib-portalapices', 'Portalápices de cerámica acanalado', 'libreria', 'Oficina', 6500, 'p-portalapices', { stock: 8, opciones: { nombre: 'Color', valores: ['Menta', 'Blanco'] }, etiquetas: 'portalapices organizador escritorio lapicero', desc: 'Portalápices de cerámica acanalada para ordenar lapiceras, lápices y tijeras.', alt: 'Portalápices de cerámica acanalada con lápices y lapiceras' }),
    P('lib-regla-tijera', 'Regla de 30 cm y tijera dorada', 'libreria', 'Oficina', 5200, 'p-regla-tijera', { stock: 10, etiquetas: 'regla tijera escolar', desc: 'Regla transparente de 30 cm y tijera de hojas doradas, para la cartuchera o el escritorio.', alt: 'Regla transparente de 30 centímetros y tijera dorada sobre el escritorio' }),
    P('lib-combo-escritorio', 'Combo escritorio: libreta + resaltadores + notas', 'libreria', 'Combos', 19900, 'p-combo-escritorio', { stock: 9, descuento: 10, promo: 2, kicker: 'Para el escritorio', corto: 'Combo escritorio', etiquetas: 'combo regalo libreta resaltadores notas', desc: 'Libreta A5 con elástico, set de 4 resaltadores pastel y 4 blocks de notas adhesivas, todo junto con descuento.', alt: 'Libreta, cuadernos, resaltadores y lápices en tonos agua sobre mármol' }),
    P('jug-oso', 'Oso de peluche con moño · 45 cm', 'jugueteria', 'Peluches', 24900, 'p-oso', { stock: 6, destacado: 2, etiquetas: 'oso peluche regalo bebe nacimiento cumpleaños', desc: 'Oso de peluche de 45 cm, suave y con moño de raso. Un regalo que no falla en cumpleaños y nacimientos.', alt: 'Oso de peluche marrón con moño de raso turquesa' }),
    P('jug-conejo', 'Conejo de peluche orejas largas · 35 cm', 'jugueteria', 'Peluches', 18500, 'p-conejo', { stock: 7, descuento: 10, promo: 6, kicker: 'Juguetería', corto: 'Conejo de peluche', etiquetas: 'conejo peluche bebe', desc: 'Conejo de peluche de 35 cm con orejas largas y pelaje bien suave.', alt: 'Conejo de peluche blanco de orejas largas' }),
    P('jug-jirafa', 'Jirafa de peluche · 40 cm', 'jugueteria', 'Peluches', 19900, 'p-jirafa', { stock: 0, etiquetas: 'jirafa peluche bebe', desc: 'Jirafa de peluche de 40 cm con manchas bordadas.', alt: 'Jirafa de peluche con manchas marrones en un estante' }),
    P('jug-muneca', 'Muñeca de trapo con vestido floreado', 'jugueteria', 'Muñecas', 16800, 'p-muneca', { stock: 5, nuevo: true, etiquetas: 'muñeca trapo tela nena', desc: 'Muñeca de trapo con trenzas de lana y vestido floreado. Para más de 3 años.', alt: 'Muñeca de trapo con trenzas de lana y vestido floreado' }),
    P('jug-torre-aros', 'Torre de aros apilables de madera', 'jugueteria', 'Didácticos', 12900, 'p-torre-aros', { stock: 9, destacado: 5, etiquetas: 'torre aros apilar madera bebe didactico encastre', desc: 'Torre de madera con aros de colores para apilar por tamaño. Para más de 1 año.', alt: 'Torre de aros de madera en turquesa, amarillo y petróleo' }),
    P('jug-bloques', 'Bloques de madera · 24 piezas', 'jugueteria', 'Didácticos', 15500, 'p-bloques', { stock: 8, etiquetas: 'bloques madera construccion encastre didactico', desc: 'Veinticuatro bloques de madera en formas y colores para construir casas, torres y caminos.', alt: 'Bloques de madera de colores apilados sobre una alfombra' }),
    P('jug-autito', 'Autito de madera con ruedas de colores', 'jugueteria', 'Didácticos', 9800, 'p-autito', { stock: 11, descuento: 10, promo: 7, kicker: 'Juguetería', corto: 'Autito de madera', etiquetas: 'auto autito madera arrastre', desc: 'Autito de madera con ruedas de colores que giran de verdad, para arrastrar por el piso.', alt: 'Autito de madera con ruedas turquesa' }),
    P('jug-laberinto', 'Laberinto de cuentas de madera', 'jugueteria', 'Didácticos', 13900, 'p-laberinto', { stock: 6, etiquetas: 'laberinto cuentas motricidad didactico madera', desc: 'Laberinto de alambre con cuentas de madera para pasar de un lado al otro. Ayuda con la motricidad fina.', alt: 'Laberinto de cuentas de madera de colores' }),
    P('reg-taza-blanca', 'Taza de cerámica blanca con borde dorado', 'regaleria', 'Tazas', 8900, 'p-taza-blanca', { stock: 15, destacado: 3, etiquetas: 'taza ceramica regalo dia de la madre cafe', desc: 'Taza de cerámica blanca de 350 ml con borde y asa dorados.', alt: 'Taza blanca de cerámica con borde y asa dorados' }),
    P('reg-taza-petroleo', 'Taza de cerámica petróleo con asa dorada', 'regaleria', 'Tazas', 9500, 'p-taza-petroleo', { stock: 12, descuento: 15, promo: 4, kicker: 'Para regalar', etiquetas: 'taza ceramica regalo cafe', desc: 'Taza de cerámica color petróleo con asa dorada, para el café de todos los días.', alt: 'Taza de cerámica color petróleo con asa dorada' }),
    P('reg-vela', 'Vela aromática en vaso tallado', 'regaleria', 'Deco', 11200, 'p-vela', { stock: 10, opciones: { nombre: 'Aroma', valores: ['Vainilla', 'Coco', 'Lavanda'] }, etiquetas: 'vela aromatica deco regalo', desc: 'Vela aromática en vaso de vidrio tallado con borde dorado.', alt: 'Vela encendida en vaso de vidrio tallado con borde dorado' }),
    P('reg-suculenta', 'Mini suculenta en maceta dorada', 'regaleria', 'Deco', 7900, 'p-suculenta', { stock: 9, nuevo: true, etiquetas: 'suculenta planta maceta deco', desc: 'Suculenta natural en maceta blanca con base dorada. Un detalle chico para el escritorio.', alt: 'Suculenta en maceta blanca y dorada' }),
    P('reg-bombonera', 'Bombonera de vidrio con tapa dorada', 'regaleria', 'Deco', 10400, 'p-bombonera', { stock: 6, etiquetas: 'bombonera frasco vidrio golosinas deco', desc: 'Frasco de vidrio con tapa dorada para golosinas, botones o lo que quieras guardar.', alt: 'Frasco de vidrio con tapa dorada lleno de confites turquesa y blancos' }),
    P('reg-combo-madre', 'Combo taza + vela aromática', 'regaleria', 'Combos', 20100, 'p-combo-taza-vela', { stock: 8, descuento: 10, destacado: 6, promo: 1, kicker: 'Día de la Madre · dom 18/10', corto: 'Combo taza + vela', etiquetas: 'combo dia de la madre regalo taza vela', desc: 'Taza blanca con borde dorado y vela aromática en vaso tallado. El regalo para el domingo 18, con descuento.', alt: 'Taza blanca con borde dorado y vela aromática en vaso tallado' }),
    P('reg-bolsa-lunares', 'Bolsa de regalo con lunares dorados', 'regaleria', 'Envoltorios', 3200, 'p-bolsa-lunares', { stock: 35, opciones: { nombre: 'Tamaño', valores: ['Mediana', 'Grande'] }, etiquetas: 'bolsa regalo envoltorio', desc: 'Bolsa de regalo blanca con lunares dorados y manijas de cordón.', alt: 'Bolsa de regalo blanca con lunares dorados y papel seda petróleo' }),
    P('reg-bolsa-petroleo', 'Bolsa de regalo petróleo con cordón dorado', 'regaleria', 'Envoltorios', 3200, 'p-bolsa-petroleo', { stock: 35, opciones: { nombre: 'Tamaño', valores: ['Mediana', 'Grande'] }, etiquetas: 'bolsa regalo envoltorio', desc: 'Bolsa de regalo color petróleo con manijas de cordón dorado.', alt: 'Bolsa de regalo color petróleo con manijas de cordón dorado' }),
    P('reg-caja-mono', 'Caja de regalo con moño de raso', 'regaleria', 'Envoltorios', 5600, 'p-caja-mono', { stock: 14, etiquetas: 'caja regalo moño envoltorio', desc: 'Caja de regalo blanca con moño de raso petróleo.', alt: 'Caja de regalo blanca con moño de raso petróleo' }),
    P('reg-caja-kraft', 'Caja kraft con cinta celeste', 'regaleria', 'Envoltorios', 4800, 'p-caja-kraft', { stock: 14, etiquetas: 'caja kraft regalo envoltorio', desc: 'Caja de cartón kraft con cinta celeste, lista para regalar.', alt: 'Caja de regalo de cartón kraft con cinta celeste' }),
    P('cot-globos', 'Globos perlados turquesa y dorado · x25', 'cotillon', 'Globos', 5900, 'p-globos', { stock: 20, destacado: 7, etiquetas: 'globos cumpleaños fiesta cotillon', desc: 'Bolsa de 25 globos perlados en turquesa, dorado y blanco para cumpleaños y fiestas.', alt: 'Globos perlados turquesa, dorado y blanco' }),
    P('cot-papel-seda', 'Papel seda celeste · 10 pliegos', 'cotillon', 'Decoración', 2300, 'p-papel-seda', { stock: 40, etiquetas: 'papel seda envolver pompones decoracion', desc: 'Diez pliegos de papel seda celeste para envolver o armar pompones.', alt: 'Papel seda celeste asomando de una bolsa de regalo' }),
    P('cot-monos', 'Moños metalizados dorados · x6', 'cotillon', 'Decoración', 3500, 'p-monos', { stock: 25, etiquetas: 'moños moño regalo decoracion dorado', desc: 'Seis moños metalizados dorados autoadhesivos para terminar cualquier paquete.', alt: 'Moños metalizados dorados sobre la mesa' }),
    P('tec-auriculares-vincha', 'Auriculares inalámbricos de vincha', 'tecno', 'Audio', 32900, 'p-auriculares-vincha', { stock: 5, destacado: 8, opciones: { nombre: 'Color', valores: ['Petróleo', 'Negro'] }, etiquetas: 'auriculares bluetooth vincha musica', desc: 'Auriculares inalámbricos de vincha con almohadillas acolchadas y micrófono para llamadas.', alt: 'Auriculares de vincha color petróleo junto a un estuche blanco' }),
    P('tec-auriculares-inear', 'Auriculares in-ear inalámbricos con estuche', 'tecno', 'Audio', 21500, 'p-auriculares-inear', { stock: 9, descuento: 10, promo: 3, kicker: 'Tecno', etiquetas: 'auriculares bluetooth in ear inalambricos', desc: 'Auriculares in-ear inalámbricos con estuche de carga. Livianos para el día a día.', alt: 'Estuche de auriculares inalámbricos blancos abierto sobre el escritorio' }),
    P('tec-reloj-blanco', 'Reloj despertador digital LED · blanco', 'tecno', 'Relojes', 17900, 'p-reloj-blanco', { stock: 7, nuevo: true, etiquetas: 'reloj despertador digital alarma led', desc: 'Reloj despertador digital con display LED, alarma y luz suave.', alt: 'Reloj despertador digital blanco con la hora en LED' }),
    P('tec-reloj-negro', 'Reloj despertador digital LED · negro', 'tecno', 'Relojes', 17900, 'p-reloj-negro', { stock: 0, etiquetas: 'reloj despertador digital alarma led', desc: 'Reloj despertador digital con display LED, alarma y luz suave, en negro.', alt: 'Reloj despertador digital negro con display LED' }),
    P('tec-gato-3d', 'Gato geométrico impreso en 3D', 'tecno', 'Impresión 3D', 8900, 'p-gato-3d', { stock: 10, opciones: { nombre: 'Color', valores: ['Turquesa', 'Blanco'] }, etiquetas: 'gato 3d impresion deco figura', desc: 'Gato geométrico impreso en 3D, de 15 cm de alto. Queda bien en estantes y escritorios.', alt: 'Gato geométrico turquesa impreso en 3D junto a un florero blanco' }),
    P('tec-florero-3d', 'Florero espiral impreso en 3D', 'tecno', 'Impresión 3D', 9600, 'p-florero-3d', { stock: 8, etiquetas: 'florero 3d impresion deco', desc: 'Florero de diseño espiral impreso en 3D, para flores secas.', alt: 'Florero blanco de diseño espiral impreso en 3D' }),
  ]);

  const RANGOS = { '0-5000': [0, 5000], '5000-15000': [5000, 15000], '15000-30000': [15000, 30000], '30000-': [30000, Infinity] };
  const ORDEN_CAT = Object.fromEntries(CATEGORIAS.map((c, i) => [c.id, i]));
  const PUESTO = new Map();
  CATEGORIAS.forEach(c => {
    COLECCION.filter(p => p.cat === c.id)
      .sort((a, b) => (Number(b.nuevo) - Number(a.nuevo)) || (Number(b.descuento > 0) - Number(a.descuento > 0)) || norm(a.nombre).localeCompare(norm(b.nombre), 'es'))
      .forEach((p, i) => PUESTO.set(p.id, i));
  });
  const textoDe = p => norm([p.nombre, catDe(p.cat)?.nombre, p.sub, p.desc, p.etiquetas].join(' '));
  const coincide = (p, q) => {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    if (!palabras.length) return true;
    const t = textoDe(p);
    return palabras.every(w => t.includes(w));
  };
  const filtrar = f => COLECCION.filter(p => {
    const precio = precioFinal(p);
    const rango = RANGOS[f.precio];
    return (!f.cat || p.cat === f.cat)
      && (!f.sub.length || f.sub.includes(p.sub))
      && (!rango || (precio >= rango[0] && precio < rango[1]))
      && (!f.promo || p.descuento > 0)
      && (!f.stock || p.stock > 0)
      && coincide(p, f.q);
  });
  const claveDe = (orden, q) => {
    const nq = norm(q).trim();
    if (orden === 'precio-asc') return p => [precioFinal(p), p.id];
    if (orden === 'precio-desc') return p => [-precioFinal(p), p.id];
    if (orden === 'nombre') return p => [norm(p.nombre), p.id];
    return p => [nq && norm(p.nombre).includes(nq) ? 0 : 1, p.stock > 0 ? 0 : 1, PUESTO.get(p.id) ?? 99, ORDEN_CAT[p.cat] ?? 9, p.id];
  };
  const comparar = (a, b) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) continue;
      return typeof a[i] === 'number' && typeof b[i] === 'number' ? a[i] - b[i] : String(a[i]).localeCompare(String(b[i]), 'es');
    }
    return 0;
  };
  const codificar = k => window.btoa(String.fromCharCode(...new window.TextEncoder().encode(JSON.stringify(k))));
  const decodificar = c => {
    try { return JSON.parse(new window.TextDecoder().decode(Uint8Array.from(window.atob(c), ch => ch.charCodeAt(0)))); } catch { return null; }
  };
  const copia = p => JSON.parse(JSON.stringify(p));

  function productos(params = {}) {
    const limite = Math.max(1, Math.min(Math.floor(Number(params.limite)) || POR_PAGINA, API_LIMITE));
    let resp;
    if (Array.isArray(params.ids)) {
      const ids = params.ids.slice(0, API_LIMITE);
      resp = { items: COLECCION.filter(p => ids.includes(p.id)).map(copia), cursor: null };
    } else if (params.vista === 'ficha') {
      const p = COLECCION.find(x => x.id === params.id);
      resp = { items: p ? [copia(p)] : [], cursor: null };
    } else if (params.vista === 'portada') {
      resp = { items: COLECCION.filter(p => p.destacado).sort((a, b) => a.destacado - b.destacado).slice(0, limite).map(copia), cursor: null };
    } else if (params.vista === 'promos') {
      resp = { items: COLECCION.filter(p => p.promo && p.descuento > 0 && p.stock > 0).sort((a, b) => a.promo - b.promo).slice(0, limite).map(copia), cursor: null };
    } else if (params.vista === 'relacionados') {
      const base = COLECCION.find(x => x.id === params.id);
      resp = { items: base ? COLECCION.filter(p => p.cat === base.cat && p.id !== base.id && p.stock > 0).slice(0, limite).map(copia) : [], cursor: null };
    } else if (params.vista === 'conteos') {
      const conteos = {};
      const subs = {};
      COLECCION.forEach(p => {
        conteos[p.cat] = (conteos[p.cat] || 0) + 1;
        subs[p.cat] = subs[p.cat] || {};
        subs[p.cat][p.sub] = (subs[p.cat][p.sub] || 0) + 1;
      });
      resp = { items: [], cursor: null, conteos, subs, total: COLECCION.length };
    } else {
      const f = { cat: String(params.cat || ''), sub: Array.isArray(params.sub) ? params.sub : [], precio: String(params.precio || ''), promo: !!params.promo, stock: !!params.stock, q: String(params.q || '').slice(0, 60) };
      const orden = ['relevancia', 'precio-asc', 'precio-desc', 'nombre'].includes(params.orden) ? params.orden : 'relevancia';
      const clave = claveDe(orden, f.q);
      const lista = filtrar(f).map(p => ({ p, k: clave(p) })).sort((a, b) => comparar(a.k, b.k));
      const desde = params.cursor ? decodificar(params.cursor) : null;
      const inicio = Array.isArray(desde) ? lista.findIndex(x => comparar(x.k, desde) > 0) : 0;
      const pagina = inicio < 0 ? [] : lista.slice(inicio, inicio + limite);
      const hayMas = inicio >= 0 && inicio + limite < lista.length;
      resp = { items: pagina.map(x => copia(x.p)), cursor: hayMas && pagina.length ? codificar(pagina[pagina.length - 1].k) : null, total: lista.length };
    }
    return Promise.resolve(resp);
  }

  return { productos };
})();

const Api = {
  async productos(params = {}) {
    const r = await Servidor.productos(params);
    if (!r || !Array.isArray(r.items) || r.items.length > API_LIMITE) throw new Error('Respuesta de productos fuera del límite');
    r.items.forEach(p => vistos.set(p.id, p));
    return r;
  },
};

const Cart = {
  KEY: 'regalarte_cart',
  memoria: [],
  sinStorage: false,
  get() {
    if (this.sinStorage) return this.memoria.map(i => ({ ...i }));
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string' && Number.isFinite(i.qty) && i.qty > 0) : [];
    } catch { return []; }
  },
  save(items) {
    this.memoria = items.map(i => ({ ...i }));
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, op = '') {
    if (!producto || producto.stock <= 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
    return true;
  },
  setQty(id, op, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.op || '') === op);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get();
    let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll');
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
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
  cart?.addEventListener('click', () => abrirCarrito(cart));
  sync();
}

function badgesHTML(p) {
  const b = [];
  if (p.stock <= 0) b.push('<span class="badge badge--agotado">Sin stock</span>');
  else if (p.descuento > 0) b.push(`<span class="badge badge--promo">-${p.descuento}%</span>`);
  if (p.nuevo && p.stock > 0) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<s>${formatearPrecio(p.precio)}</s><span>${formatearPrecio(precioFinal(p))}</span>`
    : `<span>${formatearPrecio(p.precio)}</span>`;
}

function stepperHTML(p, extra = '') {
  return `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"${extra}><button type="button" data-paso="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}

function cardHTML(p, anim = 'subir') {
  const estado = anim === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(48px)';
  const attr = anim ? ` data-animate="${anim}" style="${estado}"` : '';
  const agotado = p.stock <= 0;
  const acciones = agotado
    ? `<a class="prod-consulta" href="${wspHref(`Hola RegalArte, ¿cuándo les vuelve a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando entre</a>`
    : `<div class="prod-actions">${stepperHTML(p)}<button class="prod-add" type="button" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICON.carrito}<span>Agregar</span></button></div><button class="prod-ya" type="button" data-ya="${p.id}">Comprar ahora</button>`;
  return `<article class="prod${agotado ? ' prod--agotado' : ''}" data-id="${p.id}"${attr}>
    <button class="prod-foto" type="button" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="800">${badgesHTML(p)}</button>
    <p class="tag prod-precio">${precioHTML(p)}</p>
    <div class="prod-info"><p class="prod-cat">${esc(p.sub)}</p><h3 class="prod-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>${acciones}</div>
  </article>`;
}

function cardRailHTML(p) {
  const accion = p.stock > 0
    ? `<div class="prod-actions"><button class="prod-add" type="button" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICON.carrito}<span>Agregar</span></button></div>`
    : `<a class="prod-consulta" href="${wspHref(`Hola RegalArte, ¿cuándo les vuelve a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando entre</a>`;
  return `<article class="prod prod--rail" data-id="${p.id}" data-animate="der" style="opacity:0;transform:translateX(64px)">
    <button class="prod-foto" type="button" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="800">${badgesHTML(p)}</button>
    <p class="tag prod-precio">${precioHTML(p)}</p>
    <div class="prod-info"><p class="prod-cat">${esc(p.sub)}</p><h3 class="prod-nombre">${esc(p.nombre)}</h3>${accion}</div>
  </article>`;
}

async function initConteos() {
  const r = await Api.productos({ vista: 'conteos' });
  subConteos = r.subs || {};
  const cuentas = r.conteos || {};
  document.querySelectorAll('[data-conteo]').forEach(el => {
    const n = cuentas[el.dataset.conteo] || 0;
    el.textContent = n === 1 ? '1 producto' : `${n} productos`;
  });
  document.querySelectorAll('[data-n]').forEach(el => {
    const k = el.dataset.n;
    el.textContent = k ? (cuentas[k] || 0) : (r.total || 0);
  });
}

async function initPreciosPromo() {
  const els = [...document.querySelectorAll('[data-precio-de]')];
  if (!els.length) return;
  const ids = [...new Set(els.flatMap(el => el.dataset.precioDe.split(/\s+/)))];
  await Api.productos({ ids });
  els.forEach(el => {
    const ps = el.dataset.precioDe.split(/\s+/).map(getProducto).filter(Boolean);
    if (!ps.length) return;
    el.innerHTML = ps.map(p => `${esc(p.corto || p.nombre)} <strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? ` <span class="pp-desc">-${p.descuento}%</span>` : ''}`).join('<span class="pp-sep"> · </span>');
  });
}

function intentar(fn) {
  try { fn(); return true; } catch { return false; }
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, [data-stepper]')) return;
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
      intentar(() => vp.setPointerCapture?.(pointerId));
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      intentar(() => vp.releasePointerCapture?.(pointerId));
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

async function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = await Api.productos({ vista: 'portada', limite: 6 });
  track.innerHTML = items.map(cardRailHTML).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  if (!vp || !prev || !next) return;
  const paso = () => {
    const card = track.firstElementChild;
    return card ? (card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16)) * 2 : 520;
  };
  const actualizar = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
}

async function initTicket() {
  const t = document.querySelector('[data-ticket]');
  if (!t) return;
  const cont = t.querySelector('[data-ticket-slides]');
  const dots = t.querySelector('[data-ticket-dots]');
  const barra = t.querySelector('[data-ticket-barra]');
  const { items } = await Api.productos({ vista: 'promos', limite: 3 });
  if (!items.length) { t.hidden = true; return; }
  cont.innerHTML = items.map((p, i) => `
    <article class="ticket-slide${i === 0 ? ' is-on' : ''}" data-id="${p.id}"${i ? ' aria-hidden="true" inert' : ''}>
      <p class="ticket-kicker">${esc(p.kicker || catDe(p.cat)?.nombre)}</p>
      <p class="ticket-nombre">${esc(p.nombre)}</p>
      <p class="ticket-precios"><s>${formatearPrecio(p.precio)}</s><strong>${formatearPrecio(precioFinal(p))}</strong><span class="pp-desc">-${p.descuento}%</span></p>
      <button class="btn btn--compra btn--chico" type="button" data-add="${p.id}">${ICON.carrito}Agregar al pedido</button>
    </article>`).join('');
  dots.innerHTML = items.map((p, i) => `<button class="ticket-dot${i === 0 ? ' is-on' : ''}" type="button" data-ticket-ir="${i}" aria-label="Ver la promo ${i + 1} de ${items.length}" aria-pressed="${i === 0}"></button>`).join('');
  const slides = [...cont.children];
  const puntos = [...dots.children];
  let actual = 0;
  const correr = () => {
    if (!barra || reduceMotion || slides.length < 2) return;
    barra.classList.remove('corre'); void barra.offsetWidth; barra.classList.add('corre');
  };
  const ir = n => {
    actual = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === actual;
      s.classList.toggle('is-on', on);
      s.toggleAttribute('inert', !on);
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
    puntos.forEach((d, k) => { d.classList.toggle('is-on', k === actual); d.setAttribute('aria-pressed', String(k === actual)); });
    if (!reduceMotion) { t.classList.remove('balancea'); void t.offsetWidth; t.classList.add('balancea'); }
    correr();
  };
  dots.addEventListener('click', e => { const d = e.target.closest('[data-ticket-ir]'); if (d) ir(Number(d.dataset.ticketIr)); });
  barra?.addEventListener('animationend', () => ir(actual + 1));
  let hover = false, foco = false;
  const pausa = () => t.classList.toggle('pausado', hover || foco || document.hidden);
  t.addEventListener('mouseenter', () => { hover = true; pausa(); });
  t.addEventListener('mouseleave', () => { hover = false; pausa(); });
  t.addEventListener('focusin', () => { foco = true; pausa(); });
  t.addEventListener('focusout', () => { foco = false; pausa(); });
  document.addEventListener('visibilitychange', pausa);
  correr();
}

async function initTiles() {
  const cont = document.querySelector('[data-tiles]');
  if (!cont) return;
  const { items } = await Api.productos({ vista: 'promos', limite: 4 });
  cont.innerHTML = items.map(p => `
    <article class="tile" data-id="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(48px)">
      <button class="tile-foto" type="button" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="640" height="800"></button>
      ${badgesHTML(p)}
      <div class="tile-info">
        <p class="tile-kicker">${esc(p.kicker || catDe(p.cat)?.nombre)}</p>
        <h3 class="tile-nombre">${esc(p.nombre)}</h3>
        <div class="tile-fila"><p class="tag">${precioHTML(p)}</p><button class="tile-add" type="button" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICON.carrito}</button></div>
      </div>
    </article>`).join('');
}

const estado = { cat: '', sub: [], precio: '', promo: false, stock: false, q: '', orden: 'relevancia' };
const catalogo = { cursor: null, total: 0, mostrados: 0, seq: 0, cargando: false };
let subConteos = {};
let subsDe = null;
let qTimer = 0;

function renderSubs() {
  if (subsDe === estado.cat) {
    document.querySelectorAll('input[data-f="sub"]').forEach(c => { c.checked = estado.sub.includes(c.value); });
    return;
  }
  subsDe = estado.cat;
  document.querySelectorAll('[data-subs]').forEach(cont => {
    if (!estado.cat) { cont.innerHTML = '<p class="filtro-ayuda">Elegí un pasillo para ver sus secciones.</p>'; return; }
    const subs = subConteos[estado.cat] || {};
    cont.innerHTML = Object.keys(subs).map(s => `<label class="opcion"><input type="checkbox" data-f="sub" value="${esc(s)}"${estado.sub.includes(s) ? ' checked' : ''}> ${esc(s)} <span class="n">${subs[s]}</span></label>`).join('');
  });
}

function renderActivos() {
  const items = [];
  if (estado.q) items.push(['q', `“${estado.q}”`]);
  if (estado.cat) items.push(['cat', catDe(estado.cat)?.nombre || estado.cat]);
  estado.sub.forEach(s => items.push([`sub:${s}`, s]));
  if (estado.precio) items.push(['precio', RANGOS_PRECIO[estado.precio]]);
  if (estado.promo) items.push(['promo', 'Con descuento']);
  if (estado.stock) items.push(['stock', 'Con stock']);
  document.querySelectorAll('[data-activos]').forEach(cont => {
    cont.innerHTML = items.map(([k, t]) => `<span class="pill">${esc(t)}<button type="button" data-quitar-filtro="${esc(k)}" aria-label="Quitar el filtro ${esc(t)}">${ICON.cerrar}</button></span>`).join('')
      + (items.length > 1 ? '<button class="link-limpiar" type="button" data-limpiar>Limpiar todo</button>' : '');
  });
}

function sincronizarControles() {
  document.querySelectorAll('[data-cat-btn]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.catBtn === estado.cat)));
  document.querySelectorAll('input[data-f="precio"]').forEach(r => { r.checked = r.value === estado.precio; });
  document.querySelectorAll('input[data-f="promo"]').forEach(c => { c.checked = estado.promo; });
  document.querySelectorAll('input[data-f="stock"]').forEach(c => { c.checked = estado.stock; });
  document.querySelectorAll('select[data-orden]').forEach(s => { s.value = estado.orden; });
  document.querySelectorAll('[data-q]').forEach(i => { if (document.activeElement !== i) i.value = estado.q; });
  document.querySelectorAll('[data-q-limpiar]').forEach(b => { b.hidden = !estado.q; });
  const header = document.getElementById('busca-header');
  if (header && document.activeElement !== header) header.value = estado.q;
  renderSubs();
  renderActivos();
}

function sincronizarURL() {
  const u = new URL(location.href);
  u.searchParams.delete('cat');
  u.searchParams.delete('q');
  if (estado.cat) u.searchParams.set('cat', estado.cat);
  if (estado.q) u.searchParams.set('q', estado.q);
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

function leerURL() {
  const u = new URL(location.href);
  const cat = u.searchParams.get('cat');
  if (cat && catDe(cat)) estado.cat = cat;
  const q = (u.searchParams.get('q') || '').trim().slice(0, 60);
  if (q) estado.q = q;
}

function ponerParam(k, v) {
  const u = new URL(location.href);
  if (v) u.searchParams.set(k, v); else u.searchParams.delete(k);
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

function actualizarPie() {
  const { total, mostrados, cursor, cargando } = catalogo;
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = total === 1 ? '1 producto' : `${total} productos`; });
  const mostr = document.querySelector('[data-mostrando]');
  if (mostr) mostr.textContent = total ? `Mostrando ${mostrados} de ${total}` : '';
  const btn = document.querySelector('[data-ver-mas]');
  if (btn) {
    btn.hidden = !cursor;
    btn.disabled = cargando;
    btn.textContent = cargando ? 'Cargando…' : `Ver ${Math.min(POR_PAGINA, Math.max(total - mostrados, 0))} más`;
  }
  const vacio = document.querySelector('[data-vacio]');
  if (vacio) {
    vacio.hidden = total !== 0 || cargando;
    const texto = vacio.querySelector('[data-vacio-texto]');
    if (texto) texto.textContent = estado.q ? `No encontramos «${estado.q}» con estos filtros. Probá con otra palabra o preguntanos.` : 'Probá sacando algún filtro.';
    const wsp = vacio.querySelector('[data-vacio-wsp]');
    if (wsp) wsp.href = wspHref(estado.q ? `Hola RegalArte, ¿tienen ${estado.q}?` : 'Hola RegalArte, estoy buscando algo que no encontré en la web.');
  }
}

async function cargarCatalogo(reset = true) {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const mio = ++catalogo.seq;
  catalogo.cargando = true;
  grid.classList.add('cargando');
  actualizarPie();
  let r;
  try {
    r = await Api.productos({ ...estado, sub: [...estado.sub], cursor: reset ? null : catalogo.cursor, limite: POR_PAGINA });
  } catch {
    if (mio !== catalogo.seq) return;
    catalogo.cargando = false;
    grid.classList.remove('cargando');
    actualizarPie();
    showToast('No pudimos cargar los productos. Probá de nuevo en un ratito.');
    return;
  }
  if (mio !== catalogo.seq) return;
  catalogo.cargando = false;
  grid.classList.remove('cargando');
  catalogo.cursor = r.cursor;
  catalogo.total = r.total ?? 0;
  if (reset) { grid.innerHTML = ''; catalogo.mostrados = 0; }
  grid.insertAdjacentHTML('beforeend', r.items.map(p => cardHTML(p)).join(''));
  catalogo.mostrados += r.items.length;
  actualizarPie();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicar() {
  sincronizarControles();
  cargarCatalogo(true);
  sincronizarURL();
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function limpiarFiltros() {
  Object.assign(estado, { cat: '', sub: [], precio: '', promo: false, stock: false, q: '' });
  aplicar();
}

function quitarFiltro(k) {
  if (k === 'q') estado.q = '';
  else if (k === 'cat') { estado.cat = ''; estado.sub = []; }
  else if (k.startsWith('sub:')) estado.sub = estado.sub.filter(s => s !== k.slice(4));
  else if (k === 'precio') estado.precio = '';
  else if (k === 'promo') estado.promo = false;
  else if (k === 'stock') estado.stock = false;
  aplicar();
}

function agregarDesde(btn, comprarYa = false) {
  const p = getProducto(btn.dataset.add || btn.dataset.ya);
  if (!p) return;
  if (p.stock <= 0) { showToast('Ese producto no tiene stock por ahora.'); return; }
  const cont = btn.closest('.quick, .prod, .ticket-slide, .tile');
  const input = cont?.querySelector('[data-stepper] input');
  const qty = Math.max(1, Math.min(parseInt(input?.value, 10) || 1, p.stock));
  const elegida = cont?.querySelector('.op.is-on')?.dataset.op;
  const op = elegida || p.opciones?.valores?.[0] || '';
  if (!Cart.add(p, qty, op)) return;
  if (input) input.value = 1;
  btn.classList.remove('agregado'); void btn.offsetWidth; btn.classList.add('agregado');
  if (comprarYa) {
    const origen = quickState.abierto ? quickState.origen : btn;
    if (quickState.abierto) cerrarQuick(false);
    abrirCarrito(origen);
  } else {
    showToast(`Sumaste ${qty > 1 ? `${qty} × ` : ''}${p.nombre}${op ? ` (${op})` : ''} a tu pedido`);
  }
}

const quickState = { abierto: false, origen: null };

function abrirCapa(el) {
  clearTimeout(el._cierre);
  el.hidden = false;
  void el.offsetWidth;
  el.classList.add('open');
  document.body.classList.add('no-scroll');
}

function cerrarCapa(el) {
  el.classList.remove('open');
  if (!document.querySelector('.modal.open, .drawer.open, .main-nav.open')) document.body.classList.remove('no-scroll');
  clearTimeout(el._cierre);
  el._cierre = setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 420);
}

function quickHTML(p, rel) {
  const cat = catDe(p.cat);
  const fotos = [{ src: p.img, alt: p.alt }, { src: cat?.img, alt: `${cat?.nombre} en el local` }].filter(f => f.src);
  const ops = p.opciones ? `<div class="quick-ops"><p class="quick-ops-tit">${esc(p.opciones.nombre)}</p><div class="quick-ops-lista" role="group" aria-label="${esc(p.opciones.nombre)}">${p.opciones.valores.map((v, i) => `<button type="button" class="op${i === 0 ? ' is-on' : ''}" data-op="${esc(v)}" aria-pressed="${i === 0}">${esc(v)}</button>`).join('')}</div></div>` : '';
  const stock = p.stock <= 0 ? '<p class="quick-stock agotado">Sin stock por ahora</p>' : `<p class="quick-stock">${p.stock <= 5 ? `Quedan ${p.stock} en el local` : 'Disponible en el local'}</p>`;
  const acciones = p.stock <= 0
    ? `<a class="btn btn--tinta" href="${wspHref(`Hola RegalArte, ¿cuándo les vuelve a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando entre</a>`
    : `${stepperHTML(p)}<button class="btn btn--compra" type="button" data-add="${p.id}">${ICON.carrito}Agregar al carrito</button><button class="btn btn--tinta" type="button" data-ya="${p.id}">Comprar ahora</button>`;
  const relHTML = rel.length ? `<div class="quick-rel"><p class="quick-rel-tit">También te puede interesar</p><div class="quick-rel-lista">${rel.map(r => `<button class="rel" type="button" data-quick="${r.id}"><span class="rel-foto"><img src="${r.img}" alt="" width="640" height="800"></span><span class="rel-nombre">${esc(r.nombre)}</span><span class="rel-precio">${formatearPrecio(precioFinal(r))}</span></button>`).join('')}</div></div>` : '';
  return `<div class="quick">
    <div class="quick-galeria">
      <figure class="quick-foto"><img data-quick-img src="${fotos[0].src}" alt="${esc(fotos[0].alt)}" width="640" height="800"></figure>
      <div class="quick-thumbs">${fotos.map((f, i) => `<button class="quick-thumb${i === 0 ? ' is-on' : ''}" type="button" data-thumb="${esc(f.src)}" data-thumb-alt="${esc(f.alt)}" aria-label="Ver foto ${i + 1}"><img src="${esc(f.src)}" alt="" width="640" height="800"></button>`).join('')}</div>
    </div>
    <div class="quick-info">
      <p class="prod-cat">${esc(cat?.nombre)} · ${esc(p.sub)}</p>
      <h2 class="quick-nombre">${esc(p.nombre)}</h2>
      <div class="quick-precios"><p class="tag">${precioHTML(p)}</p>${p.descuento > 0 ? `<span class="badge badge--promo">-${p.descuento}%</span>` : ''}</div>
      <p class="quick-desc">${esc(p.desc)}</p>
      ${ops}
      ${stock}
      <div class="quick-acciones">${acciones}</div>
      <a class="link-wsp" href="${wspHref(`Hola RegalArte, quería consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
      ${relHTML}
    </div>
  </div>`;
}

function inyectarLD(p) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(p.img, location.href).href,
    description: p.desc,
    sku: p.id,
    category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: location.href },
  };
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify(ld);
}

async function abrirQuick(id, origen) {
  const modal = document.getElementById('quick');
  if (!modal) return;
  let p = getProducto(id);
  try {
    if (!p) p = (await Api.productos({ vista: 'ficha', id })).items[0];
    if (!p) return;
    const { items: rel } = await Api.productos({ vista: 'relacionados', id: p.id, limite: 3 });
    modal.querySelector('[data-quick-body]').innerHTML = quickHTML(p, rel);
  } catch { return; }
  if (!quickState.abierto) {
    quickState.origen = origen || document.activeElement;
    quickState.abierto = true;
    abrirCapa(modal);
  }
  const panel = modal.querySelector('.modal-panel');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  ponerParam('producto', p.id);
  inyectarLD(p);
}

function cerrarQuick(devolverFoco = true) {
  const modal = document.getElementById('quick');
  if (!modal || !quickState.abierto) return;
  quickState.abierto = false;
  cerrarCapa(modal);
  ponerParam('producto', null);
  document.getElementById('ld-producto')?.remove();
  if (devolverFoco) quickState.origen?.focus?.({ preventScroll: true });
}

const carritoState = { abierto: false, origen: null };

function lineaKey(i) { return `${i.id}|${i.op || ''}`; }

function renderCarrito() {
  const cont = document.querySelector('[data-cart-items]');
  const pie = document.querySelector('[data-cart-foot]');
  if (!cont) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cont.dataset.claves = '';
    cont.innerHTML = '<div class="cart-vacio"><p class="cart-vacio-tit">Todavía no elegiste nada</p><p>Pasá por los pasillos y sumá lo que te guste.</p><a class="btn btn--tinta" href="#tienda" data-ir-tienda>Ver la tienda</a></div>';
    if (pie) pie.hidden = true;
    return;
  }
  const claves = items.map(lineaKey).join(',');
  if (cont.dataset.claves === claves && cont.querySelector('.lineas')) {
    items.forEach(i => {
      const p = getProducto(i.id);
      const li = [...cont.querySelectorAll('[data-linea]')].find(el => el.dataset.key === lineaKey(i));
      if (!li) return;
      const input = li.querySelector('[data-linea-qty]');
      if (input && document.activeElement !== input) input.value = i.qty;
      const precio = li.querySelector('.linea-precio');
      if (precio) precio.textContent = formatearPrecio(precioFinal(p) * i.qty);
    });
  } else {
    cont.dataset.claves = claves;
    cont.innerHTML = `<ul class="lineas">${items.map(i => {
      const p = getProducto(i.id);
      return `<li class="linea" data-linea data-key="${esc(lineaKey(i))}" data-id="${p.id}" data-op="${esc(i.op || '')}">
        <span class="linea-foto"><img src="${p.img}" alt="" width="640" height="800"></span>
        <div class="linea-info">
          <p class="linea-nombre">${esc(p.nombre)}</p>
          ${i.op ? `<p class="linea-op">${esc(p.opciones?.nombre || 'Opción')}: ${esc(i.op)}</p>` : ''}
          <p class="linea-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
          <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno de ${esc(p.nombre)}">${ICON.menos}</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${i.qty}" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-paso="1" aria-label="Sumar uno de ${esc(p.nombre)}">${ICON.mas}</button></div>
        </div>
        <button class="linea-x" type="button" data-linea-quitar aria-label="Quitar ${esc(p.nombre)} del pedido">${ICON.tacho}</button>
      </li>`;
    }).join('')}</ul>`;
  }
  if (pie) pie.hidden = false;
  const total = Cart.total();
  const totalEl = document.querySelector('[data-cart-total]');
  if (totalEl) totalEl.textContent = formatearPrecio(total);
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) {
    const lineas = ['Hola RegalArte, quiero hacer este pedido:', ...items.map(i => {
      const p = getProducto(i.id);
      return `• ${i.qty} × ${p.nombre}${i.op ? ` (${i.op})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
    }), `Total: ${formatearPrecio(total)}`, '¿Me confirman si está todo disponible?'];
    wsp.href = wspHref(lineas.join('\n'));
  }
}

function abrirCarrito(origen) {
  const d = document.getElementById('cart');
  if (!d) return;
  renderCarrito();
  if (!carritoState.abierto) {
    carritoState.origen = origen || document.activeElement;
    carritoState.abierto = true;
    abrirCapa(d);
  }
  d.querySelector('.drawer-panel')?.focus({ preventScroll: true });
}

function cerrarCarrito(devolverFoco = true) {
  const d = document.getElementById('cart');
  if (!d || !carritoState.abierto) return;
  carritoState.abierto = false;
  cerrarCapa(d);
  if (devolverFoco) carritoState.origen?.focus?.({ preventScroll: true });
}

function atraparFoco(cont, e) {
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[inert]'));
  if (!f.length) { e.preventDefault(); return; }
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !cont.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !cont.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}

function initEventos() {
  document.addEventListener('click', e => {
    const t = e.target;
    const quickBtn = t.closest('[data-quick]');
    if (quickBtn) { abrirQuick(quickBtn.dataset.quick, quickBtn); return; }
    const add = t.closest('[data-add]');
    if (add) { agregarDesde(add); return; }
    const ya = t.closest('[data-ya]');
    if (ya) { agregarDesde(ya, true); return; }
    const paso = t.closest('[data-paso]');
    if (paso) {
      const input = paso.parentElement.querySelector('input');
      if (input) {
        const max = Number(input.max) || 99;
        input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(paso.dataset.paso)));
      }
      return;
    }
    const lineaPaso = t.closest('[data-linea-paso]');
    if (lineaPaso) {
      const li = lineaPaso.closest('[data-linea]');
      const actual = Cart.get().find(i => lineaKey(i) === li.dataset.key);
      if (!actual) return;
      const nuevo = actual.qty + Number(lineaPaso.dataset.lineaPaso);
      if (nuevo < 1) Cart.remove(li.dataset.id, li.dataset.op);
      else Cart.setQty(li.dataset.id, li.dataset.op, nuevo);
      return;
    }
    const quitar = t.closest('[data-linea-quitar]');
    if (quitar) {
      const li = quitar.closest('[data-linea]');
      Cart.remove(li.dataset.id, li.dataset.op);
      document.querySelector('.drawer-panel')?.focus({ preventScroll: true });
      return;
    }
    const op = t.closest('.op');
    if (op) {
      op.parentElement.querySelectorAll('.op').forEach(b => { b.classList.toggle('is-on', b === op); b.setAttribute('aria-pressed', String(b === op)); });
      return;
    }
    const thumb = t.closest('[data-thumb]');
    if (thumb) {
      const img = document.querySelector('[data-quick-img]');
      if (img) { img.src = thumb.dataset.thumb; img.alt = thumb.dataset.thumbAlt || ''; }
      thumb.parentElement.querySelectorAll('[data-thumb]').forEach(b => b.classList.toggle('is-on', b === thumb));
      return;
    }
    if (t.closest('[data-close-quick]')) { cerrarQuick(); return; }
    if (t.closest('[data-close-cart]')) { cerrarCarrito(); return; }
    if (t.closest('[data-ir-tienda]')) { e.preventDefault(); cerrarCarrito(false); irATienda(); return; }
    const abrir = t.closest('[data-open-cart]');
    if (abrir) { abrirCarrito(abrir); return; }
    if (t.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const catLink = t.closest('[data-cat-link]');
    if (catLink) {
      e.preventDefault();
      Object.assign(estado, { cat: catDe(catLink.dataset.catLink) ? catLink.dataset.catLink : '', sub: [], precio: '', promo: false, stock: false, q: '' });
      aplicar();
      irATienda();
      return;
    }
    const catBtn = t.closest('[data-cat-btn]');
    if (catBtn) {
      const nueva = catBtn.dataset.catBtn;
      if (nueva !== estado.cat) { estado.cat = nueva; estado.sub = []; aplicar(); }
      return;
    }
    if (t.closest('[data-promo-link]')) {
      Object.assign(estado, { cat: '', sub: [], precio: '', promo: true, stock: false, q: '' });
      aplicar();
      irATienda();
      return;
    }
    const quitarF = t.closest('[data-quitar-filtro]');
    if (quitarF) { quitarFiltro(quitarF.dataset.quitarFiltro); return; }
    if (t.closest('[data-limpiar]')) { limpiarFiltros(); return; }
    if (t.closest('[data-q-limpiar]')) {
      estado.q = '';
      document.querySelectorAll('[data-q]').forEach(i => { i.value = ''; });
      aplicar();
      document.querySelector('[data-q]')?.focus();
      return;
    }
    if (t.closest('[data-ver-mas]')) { cargarCatalogo(false); return; }
    const tog = t.closest('[data-filtros-toggle]');
    if (tog) {
      const panel = document.getElementById(tog.getAttribute('aria-controls'));
      if (!panel) return;
      const abierto = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', abierto);
      if (abierto && panel.matches('[data-animate]:not(.in)')) panel.classList.add('in');
      document.querySelectorAll(`[data-filtros-toggle][aria-controls="${panel.id}"]`).forEach(b => b.setAttribute('aria-expanded', String(abierto)));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  });

  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('[data-stepper] input')) {
      const max = Number(t.max) || 99;
      t.value = Math.max(1, Math.min(max, parseInt(t.value, 10) || 1));
    } else if (t.matches('[data-linea-qty]')) {
      const li = t.closest('[data-linea]');
      Cart.setQty(li.dataset.id, li.dataset.op, parseInt(t.value, 10) || 1);
    } else if (t.matches('input[data-f="precio"]')) {
      estado.precio = t.value; aplicar();
    } else if (t.matches('input[data-f="sub"]')) {
      estado.sub = [...new Set([...document.querySelectorAll('input[data-f="sub"]:checked')].map(c => c.value))]; aplicar();
    } else if (t.matches('input[data-f="promo"]')) {
      estado.promo = t.checked; aplicar();
    } else if (t.matches('input[data-f="stock"]')) {
      estado.stock = t.checked; aplicar();
    } else if (t.matches('select[data-orden]')) {
      estado.orden = t.value; aplicar();
    }
  });

  document.addEventListener('input', e => {
    if (!e.target.matches('[data-q]')) return;
    estado.q = e.target.value.trim().slice(0, 60);
    document.querySelectorAll('[data-q-limpiar]').forEach(b => { b.hidden = !e.target.value; });
    clearTimeout(qTimer);
    qTimer = setTimeout(aplicar, 280);
  });

  document.querySelector('[data-busca-header]')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    Object.assign(estado, { cat: '', sub: [], precio: '', promo: false, stock: false, q: (input?.value || '').trim().slice(0, 60) });
    input?.blur();
    aplicar();
    irATienda();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (carritoState.abierto) { cerrarCarrito(); return; }
      if (quickState.abierto) { cerrarQuick(); return; }
    }
    if (e.key === 'Tab') {
      if (carritoState.abierto) atraparFoco(document.querySelector('#cart .drawer-panel'), e);
      else if (quickState.abierto) atraparFoco(document.querySelector('#quick .modal-panel'), e);
    }
  });

  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    renderCarrito();
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-panel', { y: 28, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05);
  desde('.hero-marca', { y: 50, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.05);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.15);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-ticket', { y: -46, rotate: -5, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }, 0.55);
  desde('.sello-costura, .cinta--costura', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
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

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const local = [-34.66004, -58.59305];
  const mapa = L.map(el, { center: local, zoom: 16, scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: false, attributionControl: false });
  L.control.attribution({ prefix: false }).addAttribution('© OpenStreetMap contributors').addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapa);
  L.circle(local, { radius: 90, color: '#0F6E75', weight: 1, fillColor: '#7ED3D3', fillOpacity: 0.3 }).addTo(mapa);
  L.marker(local, { icon: L.divIcon({ className: 'pin-regalarte', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 17] }), keyboard: false, title: 'RegalArte · Chile 28, Villa Luzuriaga' }).addTo(mapa);
}

async function cargarProductosDelCarrito() {
  const ids = [...new Set(Cart.get().map(i => i.id))].slice(0, API_LIMITE);
  if (!ids.length) return;
  const { items } = await Api.productos({ ids });
  Cart.syncStock(items);
}

function abrirProductoDeURL() {
  const id = new URL(location.href).searchParams.get('producto');
  if (id && /^[a-z0-9-]{3,60}$/.test(id)) abrirQuick(id);
}

(async function iniciar() {
  initModelBarScroll();
  initNav();
  initWspLinks();
  initEventos();
  leerURL();
  sincronizarControles();
  try {
    await cargarProductosDelCarrito();
    await initConteos();
    subsDe = null;
    renderSubs();
    await Promise.all([initRail(), initTicket(), initTiles(), initPreciosPromo(), cargarCatalogo(true)]);
  } catch {
    showToast('No pudimos cargar todos los productos. Recargá la página.');
  }
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  initReveals();
  initHeroMotion();
  initLeeScroll();
  initMapa();
  initFloats();
  updateCartBadge();
  renderCarrito();
  abrirProductoDeURL();
})();
