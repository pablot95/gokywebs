const WA = '5493512565566';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'sahumerios', nombre: 'Sahumerios', img: 'images/cat-sahumerios.webp' },
  { id: 'esferas', nombre: 'Esferas', img: 'images/cat-esferas.webp' },
  { id: 'velas', nombre: 'Velas', img: 'images/cat-velas.webp' },
  { id: 'kits', nombre: 'Kits', img: 'images/cat-kits.webp' },
  { id: 'esencias', nombre: 'Esencias', img: 'images/cat-esencias.webp' },
  { id: 'lamparas', nombre: 'Lámparas de sal', img: 'images/cat-lamparas.webp' },
  { id: 'budas', nombre: 'Budas', img: 'images/cat-budas.webp' },
  { id: 'base', nombre: 'Base de cemento', img: 'images/cat-base.webp' },
];
const INTENCIONES = { limpieza: 'Limpieza', proteccion: 'Protección', armonia: 'Armonía', calma: 'Calma', abundancia: 'Abundancia', amor: 'Amor' };
const INTENCION_TXT = {
  limpieza: 'Para empezar de cero: después de una mudanza, una visita o una semana pesada.',
  proteccion: 'Para cuidar la casa y a los tuyos, en la entrada y en los rincones.',
  armonia: 'Para que el ambiente se sienta en paz: el living, el cuarto o el consultorio.',
  calma: 'Para bajar un cambio: meditar, leer o cerrar el día.',
  abundancia: 'Para abrir caminos: un trabajo, un proyecto nuevo o un comienzo.',
  amor: 'Para el amor propio, la pareja o un regalo con intención.',
};
const MARCAS = { aromanza: 'Aromanza', sagrada: 'Sagrada Madre', fenix: 'By Fénix' };
const PRECIOS = { 'hasta-2': [0, 2000], '2-8': [2001, 8000], 'mas-8': [8001, Infinity] };
const USO = {
  sahumerios: 'Encendé la punta, dejá que prenda unos segundos y apagá la llama: el humo sale solo. Siempre sobre un portasahumerio y lejos de cortinas.',
  esferas: 'Apoyala sobre una base de cemento o un plato que resista el calor, encendela y dejá que haga brasa. No la dejes sola mientras arde.',
  velas: 'La primera vez, dejala prendida hasta que se derrita toda la superficie. Recortá la mecha antes de volver a encenderla.',
  kits: 'Viene en su caja, lista para regalar o para usar en casa. Lo que trae hoy cada kit te lo confirmamos por WhatsApp.',
  esencias: 'Poné agua en el platito del hornito, sumá unas gotas de esencia y prendé una vela de té abajo. Nunca lo dejes sin agua.',
  lamparas: 'Enchufala y dejala prendida unas horas: da una luz cálida y tenue. Ubicala lejos de la humedad.',
  budas: 'Para el living, el altar o el escritorio. Se limpia con un paño seco.',
  base: 'Apoyá la varilla o el palo santo y dejá que la ceniza caiga sobre la base. Se limpia con un paño seco.',
};

const PRODUCTOS = [
  {
    id: 'esfera-armonia', nombre: 'Esferas mágicas Armonía x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 20,
    img: 'images/p-esfera-armonia.webp', alt: 'Esferas de hierbas y resinas en un bowl de cerámica blanco',
    intenciones: ['armonia'], rango: 1, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza, hechas con hierbas y resinas. La de armonía es la que más se lleva para el living o para después de una discusión.',
  },
  {
    id: 'palo-santo-corto', nombre: 'Sahumerio palo santo corto', marca: 'sagrada', cat: 'sahumerios', precio: 1300, descuento: 0, stock: 30,
    img: 'images/p-palo-santo-corto.webp', alt: 'Varillas de sahumerio clavadas en la arena al atardecer',
    intenciones: ['limpieza', 'proteccion'], rango: 2, alta: 20260801,
    var: { tipo: 'Aroma', opciones: ['Incienso', 'Lavanda', 'Puro', 'Sándalo'] },
    desc: 'La línea de palo santo corto de Sagrada Madre: varillas que perfuman sin invadir. Elegí el aroma: incienso, lavanda, palo santo puro o sándalo.',
  },
  {
    id: 'kit-abundancia', nombre: 'Kit Abundancia · Ginger by Fénix mini', marca: 'fenix', cat: 'kits', precio: 16000, descuento: 0, stock: 5,
    img: 'images/p-kit-abundancia.webp', alt: 'Caja de kit abierta con sahumerios, un atado de hierbas y un portasahumerio de cemento',
    intenciones: ['abundancia'], rango: 3, alta: 20260920,
    desc: 'Kit de la línea Ginger by Fénix armado para la abundancia, en caja lista para regalar. Ideal para un comienzo: un local nuevo, un trabajo o una mudanza.',
  },
  {
    id: 'vela-alba', nombre: 'Vela Alba de Fénix', marca: 'fenix', cat: 'velas', precio: 8000, descuento: 0, stock: 6,
    img: 'images/p-vela-alba.webp', alt: 'Vela en vaso de vidrio con tapa de madera, junto a raíz de jengibre',
    intenciones: ['calma'], rango: 4, alta: 20260910,
    desc: 'Vela artesanal de la línea By Fénix, hecha a mano. Una luz suave para la mesa de luz o el baño, cuando querés cerrar el día tranquila.',
  },
  {
    id: 'sahumerio-triangular', nombre: 'Sahumerio triangular', marca: 'sagrada', cat: 'sahumerios', precio: 1600, descuento: 0, stock: 24,
    img: 'images/p-sahumerio-triangular.webp', alt: 'Sahumerio encendido en un portasahumerio redondo, sobre una bandeja con más varillas',
    intenciones: ['limpieza', 'proteccion', 'calma'], rango: 5, alta: 20260801,
    var: { tipo: 'Aroma', opciones: ['31 hierbas', 'Benjuí Yagra', 'Sándalo', 'Palo santo y mirra', 'Incienso ámbar'] },
    desc: 'Sahumerios de Sagrada Madre en presentación triangular. Las 31 hierbas y el palo santo con mirra se eligen para limpiar la casa; el sándalo y el benjuí, para bajar un cambio a la noche.',
  },
  {
    id: 'lampara-sal', nombre: 'Lámpara de sal', marca: '', cat: 'lamparas', precio: 19800, descuento: 0, stock: 4,
    img: 'images/p-lampara-sal.webp', alt: 'Lámpara de sal encendida sobre una base de madera',
    intenciones: ['armonia', 'calma'], rango: 6, alta: 20260801,
    desc: 'Lámpara de sal con base de madera. Encendida da una luz anaranjada y tenue, linda para el cuarto o el rincón donde meditás.',
  },
  {
    id: 'esfera-limpieza', nombre: 'Esferas mágicas Limpieza x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 18,
    img: 'images/p-esfera-limpieza.webp', alt: 'Esferas de hierbas secas apiladas en un bowl de cerámica',
    intenciones: ['limpieza'], rango: 7, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza para limpiar el ambiente. Se usan mucho al mudarse o cuando la casa se siente cargada.',
  },
  {
    id: 'portasahumerio-sagrado', nombre: 'Portasahumerio sagrado', marca: '', cat: 'base', precio: 5000, descuento: 0, stock: 8,
    img: 'images/p-portasahumerio-sagrado.webp', alt: 'Portasahumerio redondo de cemento con una varilla, junto a otro rectangular',
    intenciones: [], rango: 8, alta: 20260801,
    desc: 'Portasahumerio de cemento con terminación lisa. Sostiene la varilla derecha y junta la ceniza.',
  },
  {
    id: 'magistrales', nombre: 'Sahumerios magistrales con resinas', marca: 'aromanza', cat: 'sahumerios', precio: 1400, descuento: 0, stock: 20,
    img: 'images/p-magistrales.webp', alt: 'Varillas de sahumerio artesanal sobre piedra, junto a un portasahumerio de cerámica',
    intenciones: ['limpieza', 'proteccion'], rango: 9, alta: 20260801,
    desc: 'Los magistrales de Aromanza llevan resinas en la masa: el humo es más denso y el aroma queda en el ambiente un buen rato después de apagarse.',
  },
  {
    id: 'buda-meditando', nombre: 'Buda meditando grande', marca: '', cat: 'budas', precio: 8000, descuento: 0, stock: 3,
    img: 'images/p-buda-meditando.webp', alt: 'Figura de Buda blanco meditando junto a un palo santo humeante sobre una bandeja',
    intenciones: ['calma', 'armonia'], rango: 10, alta: 20260801,
    desc: 'Buda sentado en posición de meditación, tamaño grande. Queda lindo en el altar, junto a la bandeja de sahumar.',
  },
  {
    id: 'esencia-hornito', nombre: 'Esencia líquida para hornito', marca: '', cat: 'esencias', precio: 3000, descuento: 0, stock: 40,
    img: 'images/p-esencia-hornito.webp', alt: 'Dos frascos goteros de esencia color ámbar sobre piedra, con jengibre',
    intenciones: ['armonia', 'calma', 'limpieza', 'amor'], rango: 11, alta: 20260801,
    var: { tipo: 'Aroma', opciones: ['Zen · armonía', 'Flor oriental · pureza', 'Frescura del bosque · liberación', 'La vida es bella · optimismo', 'Titanium · fortaleza', 'Real champa · espiritualismo', 'Taj Mahal', 'Mystic garden', 'Lavanda del valle', 'Vainilla encantada', 'Berry kiss'] },
    desc: 'Esencia líquida para usar en el hornito, en once aromas. Unas gotas alcanzan para perfumar un ambiente entero.',
  },
  {
    id: 'natural-premium', nombre: 'Sahumerio natural premium slim', marca: 'sagrada', cat: 'sahumerios', precio: 1700, descuento: 0, stock: 18,
    img: 'images/p-natural-premium.webp', alt: 'Atado de sahumerios naturales con hilo, sobre un plato de cerámica',
    intenciones: ['abundancia', 'armonia'], rango: 12, alta: 20260901,
    var: { tipo: 'Aroma', opciones: ['Uva', 'Melón'] },
    desc: 'La versión slim del natural premium de Sagrada Madre: varilla más fina y aroma frutal. Ideal para ambientes chicos o para tener prendido mientras trabajás.',
  },
  {
    id: 'velas-x6', nombre: 'Velas aromáticas x 6', marca: '', cat: 'velas', precio: 3200, descuento: 0, stock: 14,
    img: 'images/p-velas-x6.webp', alt: 'Vela aromática de columna con dos velas en lata, sobre una bandeja de madera',
    intenciones: ['amor', 'armonia'], rango: 13, alta: 20260801,
    var: { tipo: 'Aroma', opciones: ['Naranja y pimienta', 'Berry kiss', 'Limones de Sorrento'] },
    desc: 'Pack de seis velas aromáticas del mismo aroma. Para tener siempre a mano en la mesa, el baño o el escritorio.',
  },
  {
    id: 'kit-armonia', nombre: 'Kit Armonía · Ginger by Fénix mini', marca: 'fenix', cat: 'kits', precio: 16000, descuento: 0, stock: 6,
    img: 'images/p-kit-armonia.webp', alt: 'Atado de hierbas y portasahumerio de cemento dentro de una caja de kit',
    intenciones: ['armonia'], rango: 14, alta: 20260920,
    desc: 'Kit de la línea Ginger by Fénix armado para la armonía, en caja lista para regalar.',
  },
  {
    id: 'esfera-abre-caminos', nombre: 'Esferas mágicas Abre caminos x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 16,
    img: 'images/p-esfera-abre-caminos.webp', alt: 'Primer plano de esferas de hierbas y resinas en un bowl blanco',
    intenciones: ['abundancia'], rango: 15, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza para abrir caminos: se eligen antes de una entrevista, un viaje o un proyecto nuevo.',
  },
  {
    id: 'palo-santo-cortezas', nombre: 'Palo santo con cortezas', marca: 'aromanza', cat: 'sahumerios', precio: 2500, descuento: 0, stock: 15,
    img: 'images/p-palo-santo-cortezas.webp', alt: 'Mano sosteniendo un trozo de palo santo con la punta encendida',
    intenciones: ['limpieza', 'armonia'], rango: 16, alta: 20260801,
    desc: 'Madera de palo santo con su corteza, para encender y pasar por los ambientes. Se prende de una punta, arde unos segundos y se apaga: la brasa suelta el humo.',
  },
  {
    id: 'kit-luz-y-paz', nombre: 'Kit Luz y paz · Ginger by Fénix pro', marca: 'fenix', cat: 'kits', precio: 22000, descuento: 0, stock: 3,
    img: 'images/p-kit-luz-y-paz.webp', alt: 'Varillas de sahumerio y flores secas dentro de una caja de cartón',
    intenciones: ['calma', 'limpieza'], rango: 17, alta: 20261015,
    desc: 'La versión pro del kit Ginger by Fénix, armada para la luz y la paz. Un regalo completo para alguien que está empezando a sahumar.',
  },
  {
    id: 'vela-sakura', nombre: 'Vela Sakura', marca: 'fenix', cat: 'velas', precio: 9000, descuento: 0, stock: 5,
    img: 'images/p-vela-sakura.webp', alt: 'Dos velas de cera clara en vasos, con sus mechas sostenidas',
    intenciones: ['amor', 'calma'], rango: 18, alta: 20261012,
    desc: 'Vela artesanal By Fénix con aroma floral, hecha a mano. Para regalar o para una noche tranquila en casa.',
  },
  {
    id: 'esfera-amor', nombre: 'Esferas mágicas Amor x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 14,
    img: 'images/p-esfera-amor.webp', alt: 'Esferas de hierbas secas en el borde de un bowl de cerámica',
    intenciones: ['amor'], rango: 19, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza para el amor: el propio, el de pareja o para acompañar un regalo.',
  },
  {
    id: 'difusor', nombre: 'Difusor aromático 60 cc', marca: 'aromanza', cat: 'esencias', precio: 4500, descuento: 0, stock: 10,
    img: 'images/p-difusor.webp', alt: 'Frasco gotero ámbar de esencia en primer plano',
    intenciones: ['armonia', 'calma'], rango: 20, alta: 20260801,
    desc: 'Difusor aromático de Aromanza en frasco de 60 cc, para perfumar un ambiente sin fuego.',
  },
  {
    id: 'kit-proteccion', nombre: 'Kit Protección · Ginger by Fénix mini', marca: 'fenix', cat: 'kits', precio: 16000, descuento: 0, stock: 4,
    img: 'images/p-kit-proteccion.webp', alt: 'Sahumerios de hierbas acomodados en una caja de kit con relleno de papel',
    intenciones: ['proteccion'], rango: 21, alta: 20260920,
    desc: 'Kit de la línea Ginger by Fénix armado para la protección, en caja lista para regalar.',
  },
  {
    id: 'velas-x10', nombre: 'Velas aromáticas x 10', marca: '', cat: 'velas', precio: 6000, descuento: 0, stock: 12,
    img: 'images/p-velas-x10.webp', alt: 'Vela blanca encendida junto a un frasco gotero',
    intenciones: ['abundancia', 'armonia'], rango: 22, alta: 20260801,
    var: { tipo: 'Aroma', opciones: ['Diamante negro', 'Naranja', 'Uva dulce', 'Mango y maracuyá', 'Lemon premium', 'Vainillas encantadas'] },
    desc: 'Pack de diez velas aromáticas del mismo aroma, el que más rinde para usar todos los días.',
  },
  {
    id: 'esfera-fortuna', nombre: 'Esferas mágicas Fortuna x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 3,
    img: 'images/p-esfera-fortuna.webp', alt: 'Esferas de hierbas y resinas vistas de cerca',
    intenciones: ['abundancia'], rango: 23, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza para la fortuna. Se suelen prender en la entrada de la casa o del local.',
  },
  {
    id: 'sahumador-cemento', nombre: 'Sahumador grande de cemento', marca: '', cat: 'base', precio: 2300, descuento: 0, stock: 12,
    img: 'images/p-sahumador-cemento.webp', alt: 'Palo santo encendido sobre un plato apoyado en un bloque de cemento',
    intenciones: [], rango: 24, alta: 20260801,
    desc: 'Sahumador grande de cemento, firme y pesado: aguanta palo santo, esferas y conos sin moverse.',
  },
  {
    id: 'buda-orando', nombre: 'Buda orando grande', marca: '', cat: 'budas', precio: 8000, descuento: 0, stock: 2,
    img: 'images/p-buda-orando.webp', alt: 'Figura de Buda en piedra blanca con las manos juntas',
    intenciones: ['calma', 'proteccion'], rango: 25, alta: 20260801,
    desc: 'Buda con las manos juntas, tamaño grande. Para la entrada de la casa o el rincón de meditación.',
  },
  {
    id: 'esfera-siete-poderes', nombre: 'Esferas mágicas 7 poderes x4', marca: 'aromanza', cat: 'esferas', precio: 1100, descuento: 0, stock: 12,
    img: 'images/p-esfera-siete-poderes.webp', alt: 'Esferas de hierbas apiladas en un bowl, en primer plano',
    intenciones: ['proteccion'], rango: 26, alta: 20260815,
    desc: 'Caja de cuatro esferas mágicas de Aromanza de los 7 poderes, de las más elegidas para proteger la casa.',
  },
  {
    id: 'oval-cemento', nombre: 'Bandeja oval de cemento grande', marca: '', cat: 'base', precio: 7000, descuento: 0, stock: 5,
    img: 'images/p-oval-cemento.webp', alt: 'Bandeja de cemento con un sahumerio, una vela, un frasco de esencia y una lámpara de sal',
    intenciones: [], rango: 27, alta: 20260801,
    desc: 'Bandeja oval de cemento, tamaño grande. Entra el sahumerio, una vela y la esencia: el rincón de sahumar queda armado en un solo lugar.',
  },
  {
    id: 'vela-terra', nombre: 'Vela Terra Ánfora', marca: 'fenix', cat: 'velas', precio: 8000, descuento: 0, stock: 4,
    img: 'images/p-vela-terra.webp', alt: 'Vela en frasco de vidrio ámbar vista desde arriba',
    intenciones: ['calma', 'armonia'], rango: 28, alta: 20260910,
    desc: 'Vela artesanal By Fénix, hecha a mano. De aroma suave, para tener prendida mientras leés o trabajás.',
  },
  {
    id: 'bombitas-chakras', nombre: 'Bombitas 7 chakras', marca: 'sagrada', cat: 'esferas', precio: 1700, descuento: 0, stock: 10,
    img: 'images/p-bombitas-chakras.webp', alt: 'Bombitas aromáticas de hierbas apiladas en un bowl',
    intenciones: ['armonia', 'calma'], rango: 29, alta: 20261005,
    desc: 'Bombitas de Sagrada Madre de la línea 7 chakras: hierbas compactas que arden despacio y perfuman el ambiente.',
  },
  {
    id: 'buda-relax', nombre: 'Buda relax mediano', marca: '', cat: 'budas', precio: 4500, descuento: 0, stock: 6,
    img: 'images/p-buda-relax.webp', alt: 'Busto de Buda oscuro sobre una mesa de madera',
    intenciones: ['calma'], rango: 30, alta: 20260801,
    desc: 'Buda relax, tamaño mediano. Entra en un estante, la mesa de luz o el escritorio.',
  },
  {
    id: 'portasahumerios-vibes', nombre: 'Portasahumerios vibes', marca: '', cat: 'base', precio: 1500, descuento: 0, stock: 20,
    img: 'images/p-portasahumerios-vibes.webp', alt: 'Portasahumerio de cerámica moteada con una varilla encendida',
    intenciones: [], rango: 31, alta: 20260801,
    desc: 'Portasahumerio chico para una varilla. Junta la ceniza y entra en cualquier lado.',
  },
  {
    id: 'lampara-manos', nombre: 'Lámpara de sal manos', marca: '', cat: 'lamparas', precio: 22000, descuento: 0, stock: 0,
    img: 'images/p-lampara-manos.webp', alt: 'Lámpara de sal rosada encendida junto a flores secas',
    intenciones: ['armonia', 'calma'], rango: 32, alta: 20260801,
    desc: 'Lámpara de sal sostenida por unas manos, una pieza para regalar. Encendida da una luz cálida y tenue.',
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const marcaDe = p => MARCAS[p.marca] || '';
const esNuevo = p => p.alta >= 20261001;
const paraInt = id => `para ${id === 'amor' ? 'el' : 'la'} ${INTENCIONES[id].toLowerCase()}`;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), intencion = lista(f.intencion), marca = lista(f.marca), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (intencion.length && !intencion.some(x => p.intenciones.includes(x))) return false;
    if (marca.length && !marca.includes(p.marca)) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioFinal(p);
      if (v < min || v > max) return false;
    }
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
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
      p.nombre, marcaDe(p), catDe(p.cat)?.nombre, ...p.intenciones.map(i => INTENCIONES[i]), ...(p.var ? p.var.opciones : []), p.desc,
      p.cat === 'base' ? 'portasahumerio sahumador accesorio para sahumar' : '', p.cat === 'esencias' ? 'hornito aceite aroma' : '',
      p.cat === 'sahumerios' ? 'incienso varilla sahumerio' : '', esNuevo(p) ? 'nuevo novedad' : '',
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

const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esM2 = () => document.body.dataset.modelo === '2';
const paginaCatalogo = () => (esM2() ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'gingersahumos_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string').map(i => ({ id: i.id, v: typeof i.v === 'string' ? i.v : '', qty: Math.max(1, parseInt(i.qty, 10) || 1) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enOtras(items, id, v) { return items.filter(i => i.id === id && i.v !== v).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const max = Math.max(0, (producto.stock ?? 99) - this.enOtras(items, producto.id, v));
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (!max || (existing && existing.qty >= max)) return false;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return true;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id);
    const max = Math.max(1, (p?.stock ?? 99) - this.enOtras(items, id, v));
    it.qty = Math.max(1, Math.min(qty, max)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false; const usados = {};
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      const varOk = p && (p.var ? p.var.opciones.includes(i.v) : i.v === '');
      if (!p || p.stock <= 0 || !varOk) { changed = true; return false; }
      const libre = p.stock - (usados[i.id] || 0);
      if (libre <= 0) { changed = true; return false; }
      if (i.qty > libre) { i.qty = libre; changed = true; }
      usados[i.id] = (usados[i.id] || 0) + i.qty;
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICO_BOLSA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICO_FLECHA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
};
const nombreConVar = (p, v) => (v ? `${p.nombre} (${v})` : p.nombre);
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Ginger! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;
const precioHTML = p => (p.descuento > 0
  ? `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">−${p.descuento}%</span></p>`
  : `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`);

function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;

function accionesHTML(p, m2) {
  if (p.stock <= 0) return `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  const tono = m2 ? 'btn--line' : 'btn--cta';
  if (p.var) return `<button type="button" class="btn ${tono} btn--sm prod-elegir" data-open="${p.id}">Elegir ${esc(p.var.tipo.toLowerCase())}</button>`;
  return `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn ${tono} btn--sm prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_BOLSA}<span class="prod-add__txt">Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
}

function cardHTML(p, { anim = 'subir', clase = '' } = {}) {
  const m2 = esM2();
  const meta = marcaDe(p) || catDe(p.cat)?.nombre || '';
  const ints = p.intenciones.map(i => INTENCIONES[i]).join(' · ');
  return `<article class="pcard${m2 ? ' pcard--m2' : ''}${clase ? ` ${clase}` : ''}" ${ANIM[anim] || ANIM.subir}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900">${m2 ? `<span class="pcard__etiqueta">${formatearPrecio(precioFinal(p))}</span>` : ''}</button>
    <div class="pcard__body">
      <p class="pcard__marca">${esc(meta)}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${ints ? `<p class="pcard__int">${ints}</p>` : ''}
      ${m2 ? '' : precioHTML(p)}
      <div class="pcard__acc">${accionesHTML(p, m2)}</div>
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCatCounts() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-int]').forEach(el => { el.textContent = Tienda.contar({ intencion: el.dataset.cuentaInt }); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, label, [data-add], [data-buy], [data-step], .prod-elegir')) return;
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
    const limite = Math.min(parseInt(rail.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ filtros: { stock: true }, orden: 'destacados', limite });
    items.forEach(cachear);
    track.innerHTML = items.map(p => `<li class="rail-item">${cardHTML(p, { anim: 'der' })}</li>`).join('');
    initRailDrag(vp);
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
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

function initIntencion() {
  const root = document.querySelector('[data-intencion]');
  if (!root) return;
  const grid = root.querySelector('[data-int-grid]');
  const tabs = [...root.querySelectorAll('[data-int]')];
  const desc = root.querySelector('[data-int-desc]');
  const linkCat = root.querySelector('[data-int-catalogo]');
  const linkWsp = root.querySelector('[data-int-wsp]');
  const lim = Math.min(parseInt(root.dataset.limite, 10) || 8, 8);
  const pintar = (id, animar) => {
    if (!INTENCIONES[id]) return;
    const { items } = Tienda.consultar({ filtros: { intencion: [id] }, orden: 'destacados', limite: lim });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    const total = Tienda.contar({ intencion: [id] });
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.int === id)));
    if (desc) desc.textContent = INTENCION_TXT[id];
    if (linkCat) {
      linkCat.href = `${paginaCatalogo()}?intencion=${id}`;
      linkCat.querySelector('span').textContent = total > items.length ? `Ver los ${total} productos ${paraInt(id)}` : `Ver todo ${paraInt(id)}`;
    }
    if (linkWsp) linkWsp.href = wa(`¡Hola Ginger! Busco algo ${paraInt(id)}. ¿Qué me recomiendan?`);
    if (animar) { revelarNuevos(grid); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-pressed') !== 'true') pintar(t.dataset.int, true); }));
  pintar(tabs.find(t => t.getAttribute('aria-pressed') === 'true')?.dataset.int || 'limpieza', false);
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { stock: true }, orden: 'destacados', limite: 7 });
  items.forEach(cachear);
  const total = Tienda.contar({});
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('')
    + `<a class="mosaico__todo" href="${paginaCatalogo()}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__n">${total}</span><span class="mosaico__tit">Ver todo el catálogo</span><span class="mosaico__txt">Sahumerios, esferas, velas, kits, esencias, lámparas, budas y bases.</span>${ICO_FLECHA}</a>`;
}

function initLectura() {
  document.querySelectorAll('[data-lectura]').forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    el.innerHTML = palabras.map(w => `<span class="lw">${esc(w)}</span>`).join(' ');
    const spans = [...el.querySelectorAll('.lw')];
    if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh * 0.88 - r.top) / (vh * 0.45 + r.height), 0), 1);
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    };
    window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const tituloBase = titulo?.textContent || '';
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), intencion: Object.keys(INTENCIONES), marca: Object.keys(MARCAS) };
  const estado = { cat: [], intencion: [], marca: [], precio: '', stock: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.intencion = listaURL('intencion');
  estado.marca = listaURL('marca');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';

  const filtrosDe = () => ({ cat: estado.cat, intencion: estado.intencion, marca: estado.marca, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.intencion.length) p.set('intencion', estado.intencion.join(','));
    if (estado.marca.length) p.set('marca', estado.marca.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    document.querySelectorAll('#filtros input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    const n = estado.cat.length + estado.intencion.length + estado.marca.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    const unaCat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const unaInt = !unaCat && estado.intencion.length === 1 ? paraInt(estado.intencion[0]) : '';
    const rotulo = unaCat ? unaCat.nombre : unaInt ? unaInt.charAt(0).toUpperCase() + unaInt.slice(1) : '';
    if (rotulo) {
      migaCat.hidden = false;
      migaCat.textContent = rotulo;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
    if (titulo) titulo.textContent = rotulo || tituloBase;
  };
  const palabra = n => (n === 1 ? 'producto' : 'productos');
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${palabra(mostrados)} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${palabra(total)}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], intencion: [], marca: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p) {
  const v = esc(item.v);
  return `<div class="linea">
    <div class="linea__foto"><img src="${p.img}" alt="" width="900" height="900"></div>
    <div class="linea__txt"><p class="linea__nombre">${esc(p.nombre)}</p>${p.var ? `<p class="linea__var">${esc(p.var.tipo)}: ${v}</p>` : ''}</div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}" data-v="${v}"><button type="button" data-linea-step="-1" data-id="${p.id}" data-v="${v}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" data-v="${v}" aria-label="Sumar uno de ${esc(p.nombre)}">+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}" data-v="${v}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Ginger! Vi la web y quiero consultar por sus productos.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${nombreConVar(p, i.v)} — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  return wa(`¡Hola Ginger! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas]');
  let selector = null;
  if (enLineas && activo.dataset.id) {
    const clave = `[data-id="${CSS.escape(activo.dataset.id)}"][data-v="${CSS.escape(activo.dataset.v || '')}"]`;
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"]${clave}`;
  }
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Elegí un sahumerio, una vela o una esfera y sumalo con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p)).join('');
    const pie = document.querySelector('[data-drawer-pie]');
    if (pie) pie.hidden = vacio;
    drawer.querySelectorAll('[data-stepper]').forEach(st => {
      const id = st.dataset.linea;
      const it = items.find(x => x.i.id === id && x.i.v === (st.dataset.v || ''));
      if (!it) return;
      const max = Math.max(1, it.p.stock - Cart.enOtras(Cart.get(), id, it.i.v));
      st.querySelector('input').max = max;
      st.querySelector('[data-linea-step="1"]').disabled = it.i.qty >= max;
    });
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (enLineas && drawer) {
    const destino = (selector && drawer.querySelector(selector)) || drawer.querySelector('button:not([disabled])') || document.querySelector('.drawer__cerrar');
    if (destino && !destino.disabled) destino.focus();
    else drawer.querySelector('button:not([disabled])')?.focus();
  }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], intencion: p.intenciones, stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const variantes = p.var ? `<fieldset class="var" data-var><legend>${esc(p.var.tipo)}: <span data-var-elegido>elegí uno</span></legend><div class="var__ops">${p.var.opciones.map(o => `<label class="var__op"><input type="radio" name="qvVar" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div></fieldset>` : '';
  const comprar = p.stock > 0
    ? `${variantes}<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">${ICO_BOLSA}<span class="prod-add__txt">Agregar al carrito</span></button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  const ints = p.intenciones.map(i => `<span class="rasgo">${INTENCIONES[i]}</span>`).join('');
  const uso = USO[p.cat] && p.id !== 'difusor' ? `<details class="qv__uso"><summary>Cómo se usa</summary><p>${esc(USO[p.cat])}</p></details>` : '';
  return `<figure class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"><figcaption>Foto ilustrativa</figcaption></figure>
  <div class="qv__info">
    <p class="pcard__marca">${esc([marcaDe(p), cat?.nombre].filter(Boolean).join(' · '))}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${ints ? `<div class="rasgos" aria-label="Intenciones">${ints}</div>` : ''}
    ${comprar}
    ${uso}
    <a class="link-wsp" href="${wa(`¡Hola Ginger! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener" data-qv-wsp>${WSP_ICO}Consultar por WhatsApp</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="900" height="900"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, ...(marcaDe(p) ? { brand: { '@type': 'Brand', name: marcaDe(p) } } : {}),
      image: new URL(p.img, location.href).href, description: p.desc, category: catDe(p.cat)?.nombre,
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const v = t.dataset.v || '';
      const it = Cart.get().find(i => i.id === t.dataset.id && i.v === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar, t.dataset.v || '');
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const caja = t.closest('.pcard, .qv__info');
    let v = '';
    if (p.var) {
      v = caja?.querySelector('input[name="qvVar"]:checked')?.value || '';
      if (!v) {
        const grupo = caja?.querySelector('[data-var]');
        if (!grupo) { abrirProducto(p.id, t); return; }
        grupo.classList.remove('falta'); void grupo.offsetWidth; grupo.classList.add('falta');
        grupo.querySelector('input')?.focus();
        showToast(`Elegí el ${p.var.tipo.toLowerCase()} antes de agregarlo`);
        return;
      }
    }
    const st = caja?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    if (!Cart.add(p, qty, v)) { showToast(`Ya tenés todas las unidades de ${p.nombre} en el carrito`); return; }
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${nombreConVar(p, v)} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const radio = e.target.closest('input[name="qvVar"]');
    if (radio) {
      const grupo = radio.closest('[data-var]');
      grupo.classList.remove('falta');
      const el = grupo.querySelector('[data-var-elegido]');
      if (el) el.textContent = radio.value;
      const p = getProducto(document.querySelector('.qv__info [data-add]')?.dataset.add);
      const link = document.querySelector('[data-qv-wsp]');
      if (p && link) link.href = wa(`¡Hola Ginger! Quiero consultar por ${nombreConVar(p, radio.value)}.`);
      return;
    }
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, st.dataset.v || '', v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-marcas', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero__sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id);
}

Cart.syncStock();
initCatCounts();
initNavDrop();
initRail();
initIntencion();
initMosaico();
initCatalogo();
renderCarrito();
initReveals();
initLectura();
initNav();
initModelBarScroll();
initFloats();
updateCartBadge();
initDelegacion();
initHeroMotion();
abrirDesdeURL();
