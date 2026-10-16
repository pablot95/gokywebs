const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492235247840';
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
  { id: 'maquillaje', nombre: 'Maquillaje', bajada: 'Labios, ojos y rostro', img: 'images/cat-maquillaje.webp',
    texto: 'Labiales, gloss, paletas, rubores y brochas en tonos rosados y nude.',
    subs: [{ id: 'labios', nombre: 'Labios' }, { id: 'ojos', nombre: 'Ojos' }, { id: 'rostro', nombre: 'Rostro' }, { id: 'brochas', nombre: 'Brochas' }] },
  { id: 'acero', nombre: 'Accesorios de acero', bajada: 'Aros, collares, pulseras y anillos', img: 'images/cat-acero.webp',
    texto: 'Acero quirúrgico dorado y plateado: aros, collares, pulseras y anillos que no se oxidan con el uso.',
    subs: [{ id: 'aros', nombre: 'Aros' }, { id: 'collares', nombre: 'Collares' }, { id: 'pulseras', nombre: 'Pulseras' }, { id: 'anillos', nombre: 'Anillos' }] },
  { id: 'regaleria', nombre: 'Regalería', bajada: 'Detalles para regalar', img: 'images/cat-regaleria.webp',
    texto: 'Neceseres, espejos de cartera, colitas y llaveros para regalar o regalarte.',
    subs: [{ id: 'neceseres', nombre: 'Neceseres' }, { id: 'pelo', nombre: 'Para el pelo' }, { id: 'detalles', nombre: 'Detalles' }] },
];
const TONOS = [{ id: 'dorado', nombre: 'Dorado' }, { id: 'plateado', nombre: 'Plateado' }];
const PRECIOS = [
  { id: 'hasta9', nombre: 'Hasta $9.000', min: null, max: 9000 },
  { id: '9a13', nombre: '$9.000 a $13.000', min: 9001, max: 13000 },
  { id: 'mas13', nombre: 'Más de $13.000', min: 13001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  maquillaje: 'maquillaje make up makeup cosmetica belleza',
  acero: 'acero quirurgico bijou bijouterie joya joyas accesorio accesorios',
  regaleria: 'regalo regalos regaleria regalar',
  labios: 'labial labiales boca', ojos: 'sombra sombras ojo pestanas', rostro: 'cara piel', brochas: 'brocha pincel',
  aros: 'aro aritos aretes argolla', collares: 'collar cadena dije', pulseras: 'pulsera', anillos: 'anillo',
  neceseres: 'neceser cosmetiquera bolsito', pelo: 'colita colitas scrunchie gomita pelo', detalles: 'detalle',
};
const TALLES_ANILLO = { tipo: 'Talle', ops: ['14', '16', '18', '20'] };

const S1 = 'images/vertical-tocador.webp', S2 = 'images/hero-tocador.webp', S3 = 'images/cat-acero.webp',
  S4 = 'images/cat-maquillaje.webp', S5 = 'images/cat-regaleria.webp', S6 = 'images/cat-ofertas.webp';

const Tienda = crearTienda([
  { id: 'labial-mate', nombre: 'Labial mate', cat: 'maquillaje', sub: 'labios', precio: 9900, descuento: 0, stock: 14, alta: 12, rango: 1,
    var: { tipo: 'Tono', ops: ['Nude', 'Rosa viejo'] }, img: 'images/p-labial-mate.webp', escena: S4,
    alt: 'Dos labiales mate en tono nude y rosa viejo con estuche dorado y negro', desc: 'Color pleno en una pasada y terminación mate. Dos tonos para elegir: nude y rosa viejo.' },
  { id: 'paleta-rose-glow', nombre: 'Paleta de sombras Rosé Glow', cat: 'maquillaje', sub: 'ojos', precio: 16900, descuento: 0, stock: 8, alta: 22, rango: 2,
    img: 'images/p-paleta-rose-glow.webp', escena: S4,
    alt: 'Paleta de seis sombras rosadas, nude y chocolate con espejo', desc: 'Seis sombras entre nude, rosa y chocolate, mates y con brillo, en un estuche con espejo.' },
  { id: 'aros-chunky', nombre: 'Aros chunky dorados', cat: 'acero', sub: 'aros', tono: 'dorado', precio: 12500, descuento: 0, stock: 10, alta: 18, rango: 3,
    img: 'images/p-aros-chunky.webp', escena: S2,
    alt: 'Aros argolla anchos y abombados dorados en un estuche de terciopelo rosa', desc: 'Argollas anchas y abombadas, livianas para usar todo el día. Acero quirúrgico dorado.' },
  { id: 'collar-trebol', nombre: 'Collar trébol de madreperla', cat: 'acero', sub: 'collares', tono: 'dorado', precio: 14500, descuento: 0, stock: 7, alta: 16, rango: 4,
    img: 'images/p-collar-trebol.webp', escena: S3,
    alt: 'Collar de cadena fina dorada con un trébol de madreperla', desc: 'Cadena fina con un trébol de madreperla enmarcado en dorado. Para todos los días.' },
  { id: 'organizador-joyas', nombre: 'Organizador de joyas', cat: 'regaleria', sub: 'detalles', precio: 18900, descuento: 0, stock: 5, alta: 10, rango: 5,
    img: 'images/p-organizador-joyas.webp', escena: S3,
    alt: 'Organizador de pana rosa con anillos dorados y plateados', desc: 'Bandeja de pana rosa con rodillos para ordenar anillos y aros. Linda para dejar a la vista.' },
  { id: 'gloss-brillo', nombre: 'Gloss brillo rosado', cat: 'maquillaje', sub: 'labios', precio: 10500, descuento: 0, stock: 12, alta: 14, rango: 6,
    img: 'images/p-gloss-brillo.webp', escena: S4,
    alt: 'Gloss rosado con brillo en envase transparente y tapa negra', desc: 'Gloss con brillo y un toque de color rosado. Se usa solo o sobre el labial.' },
  { id: 'pulsera-eslabones', nombre: 'Pulsera de eslabones dorada', cat: 'acero', sub: 'pulseras', tono: 'dorado', precio: 15900, descuento: 0, stock: 6, alta: 9, rango: 7,
    img: 'images/p-pulsera-eslabones.webp', escena: S3,
    alt: 'Pulsera de eslabones gruesos dorados sobre un soporte de pana', desc: 'Eslabones gruesos y redondeados con cierre mosquetón. Para usar sola o con otras.' },
  { id: 'espejo-cartera', nombre: 'Espejo doble de cartera', cat: 'regaleria', sub: 'detalles', precio: 9900, descuento: 0, stock: 9, alta: 8, rango: 8,
    img: 'images/p-espejo-cartera.webp', escena: S5,
    alt: 'Espejo de cartera dorado abierto, de dos caras', desc: 'Espejo plegable dorado de dos caras, para retocarte en cualquier lado.' },

  { id: 'argollas-duo', nombre: 'Dúo de argollas lisas y con strass', cat: 'acero', sub: 'aros', tono: 'dorado', precio: 13500, descuento: 0, stock: 8, alta: 7,
    img: 'images/p-argollas-duo.webp', escena: S3,
    alt: 'Dos pares de argollas doradas, lisas y con strass, en un exhibidor negro', desc: 'Dos pares en uno: argollas lisas para el día y con strass para salir.' },
  { id: 'aros-cristal-rosa', nombre: 'Argollas con cristal rosa', cat: 'acero', sub: 'aros', tono: 'dorado', precio: 10900, descuento: 20, stock: 6, alta: 6,
    img: 'images/p-aros-cristal-rosa.webp', escena: S3,
    alt: 'Argollas doradas con un cristal rosa rectangular colgando', desc: 'Argolla chica con un cristal rosa rectangular que cuelga y se mueve.' },
  { id: 'aros-boton-rosa', nombre: 'Aros botón de piedra rosada', cat: 'acero', sub: 'aros', tono: 'dorado', precio: 8900, descuento: 0, stock: 15, alta: 5,
    img: 'images/p-aros-boton-rosa.webp', escena: S6,
    alt: 'Aros botón de piedra rosada con borde dorado', desc: 'Aros chiquitos de piedra rosada con borde dorado. Van con todo.' },
  { id: 'aros-corazon', nombre: 'Aros corazón dorados', cat: 'acero', sub: 'aros', tono: 'dorado', precio: 9500, descuento: 0, stock: 11, alta: 30, tag: 'Nuevo',
    img: 'images/p-aros-corazon.webp', escena: S2,
    alt: 'Aros con forma de corazón abombado dorados', desc: 'Corazones abombados de acero dorado, con cierre mariposa.' },
  { id: 'collar-medalla-strass', nombre: 'Collar medalla con strass', cat: 'acero', sub: 'collares', tono: 'plateado', precio: 13900, descuento: 10, stock: 5, alta: 4,
    img: 'images/p-collar-medalla-strass.webp', escena: S3,
    alt: 'Collar plateado con una medalla redonda cubierta de strass', desc: 'Medalla redonda cubierta de strass sobre cadena plateada. Brilla sin ser exagerada.' },
  { id: 'collar-doble-corazon', nombre: 'Collar doble medalla y corazón', cat: 'acero', sub: 'collares', tono: 'dorado', precio: 14900, descuento: 0, stock: 6, alta: 29, tag: 'Nuevo',
    img: 'images/p-collar-doble-corazon.webp', escena: S2,
    alt: 'Dos collares dorados, uno con medalla de madreperla y otro con un corazón de strass', desc: 'Dos cadenas en una: una medalla de madreperla y un corazón con strass.' },
  { id: 'collar-nacar', nombre: 'Collar medalla de nácar', cat: 'acero', sub: 'collares', tono: 'dorado', precio: 12900, descuento: 0, stock: 7, alta: 3,
    img: 'images/p-collar-nacar.webp', escena: S6,
    alt: 'Collar dorado con una medalla de nácar rosado', desc: 'Medalla de nácar rosado con borde dorado sobre cadena fina.' },
  { id: 'pulsera-medalla', nombre: 'Pulsera cadena con medalla', cat: 'acero', sub: 'pulseras', tono: 'dorado', precio: 16500, descuento: 0, stock: 4, alta: 21,
    img: 'images/p-pulsera-medalla.webp', escena: S6,
    alt: 'Pulsera de eslabones alargados dorados con una medalla chiquita', desc: 'Eslabones alargados con una medalla colgando y extensor para ajustarla.' },
  { id: 'pulsera-barbada', nombre: 'Pulsera barbada plateada', cat: 'acero', sub: 'pulseras', tono: 'plateado', precio: 14500, descuento: 0, stock: 6, alta: 2,
    img: 'images/p-pulsera-barbada.webp', escena: S3,
    alt: 'Pulsera de cadena barbada plateada sobre un soporte de pana', desc: 'Cadena barbada plateada, firme y con caída. Combina con el reloj.' },
  { id: 'anillo-liso-ancho', nombre: 'Anillo liso ancho dorado', cat: 'acero', sub: 'anillos', tono: 'dorado', precio: 9900, descuento: 0, stock: 9, alta: 11, var: TALLES_ANILLO,
    img: 'images/p-anillo-liso-ancho.webp', escena: S3,
    alt: 'Anillo dorado ancho y pulido en un organizador de pana rosa', desc: 'Anillo ancho y pulido, de los que se notan sin hacer ruido.' },
  { id: 'anillo-piedra-rosa', nombre: 'Anillo con piedra rosa', cat: 'acero', sub: 'anillos', tono: 'dorado', precio: 10500, descuento: 0, stock: 6, alta: 28, tag: 'Nuevo', var: TALLES_ANILLO,
    img: 'images/p-anillo-piedra-rosa.webp', escena: S3,
    alt: 'Anillo dorado fino con una piedra rosa cuadrada', desc: 'Anillo fino con una piedra rosa cuadrada. Combina con las argollas de cristal.' },
  { id: 'anillo-trenzado', nombre: 'Anillo trenzado dorado', cat: 'acero', sub: 'anillos', tono: 'dorado', precio: 8900, descuento: 0, stock: 10, alta: 13, var: TALLES_ANILLO,
    img: 'images/p-anillo-trenzado.webp', escena: S3,
    alt: 'Anillo trenzado dorado junto a una banda plateada sobre mármol rosa', desc: 'Aro trenzado que suma textura. Queda lindo solo o apilado.' },
  { id: 'anillo-banda-plateada', nombre: 'Anillo banda plateado', cat: 'acero', sub: 'anillos', tono: 'plateado', precio: 8500, descuento: 0, stock: 8, alta: 1, var: TALLES_ANILLO,
    img: 'images/p-anillo-banda-plateada.webp', escena: S3,
    alt: 'Anillo banda plateado de borde redondeado', desc: 'Banda lisa plateada de borde redondeado, cómoda para todos los días.' },
  { id: 'anillo-corazon', nombre: 'Anillo corazón esmaltado', cat: 'acero', sub: 'anillos', tono: 'dorado', precio: 9500, descuento: 0, stock: 7, alta: 24, var: TALLES_ANILLO,
    img: 'images/p-anillo-corazon.webp', escena: S5,
    alt: 'Anillo dorado fino con un corazón de esmalte rosa', desc: 'Anillo fino con un corazón de esmalte rosa enmarcado en dorado.' },

  { id: 'labial-cremoso-rosa', nombre: 'Labial cremoso rosa', cat: 'maquillaje', sub: 'labios', precio: 9500, descuento: 0, stock: 10, alta: 17,
    img: 'images/p-labial-cremoso-rosa.webp', escena: S2,
    alt: 'Labial cremoso rosa con estuche dorado y negro', desc: 'Textura cremosa con brillo suave en un rosa fácil de usar.' },
  { id: 'mascara-volumen', nombre: 'Máscara de pestañas volumen', cat: 'maquillaje', sub: 'ojos', precio: 8500, descuento: 0, stock: 13, alta: 15,
    img: 'images/p-mascara-volumen.webp', escena: S1,
    alt: 'Máscara de pestañas negra con el cepillo afuera', desc: 'Cepillo de fibras para separar y dar volumen. Color negro.' },
  { id: 'rubor-compacto', nombre: 'Rubor compacto rosa', cat: 'maquillaje', sub: 'rostro', precio: 8900, descuento: 0, stock: 9, alta: 26, tag: 'Nuevo',
    img: 'images/p-rubor-compacto.webp', escena: S4,
    alt: 'Rubor rosado compacto en estuche negro con espejo', desc: 'Rubor rosado en polvo compacto, con espejo en la tapa.' },
  { id: 'polvo-compacto', nombre: 'Polvo compacto con espejo', cat: 'maquillaje', sub: 'rostro', precio: 11500, descuento: 0, stock: 8, alta: 19,
    var: { tipo: 'Tono', ops: ['Claro', 'Medio'] }, img: 'images/p-polvo-compacto.webp', escena: S1,
    alt: 'Polvo compacto beige en estuche negro abierto con espejo', desc: 'Polvo para sellar el maquillaje y bajar brillos. Estuche con espejo, para la cartera.' },
  { id: 'set-brochas', nombre: 'Set de 3 brochas', cat: 'maquillaje', sub: 'brochas', precio: 13900, descuento: 10, stock: 7, alta: 20,
    img: 'images/p-set-brochas.webp', escena: S4,
    alt: 'Tres brochas de maquillaje con mango negro y virola rosé', desc: 'Brocha para polvo, para rubor y para difuminar sombras. Mango negro y virola rosé.' },
  { id: 'brocha-kabuki', nombre: 'Brocha para polvo', cat: 'maquillaje', sub: 'brochas', precio: 6900, descuento: 0, stock: 12, alta: 0,
    img: 'images/p-brocha-kabuki.webp', escena: S6,
    alt: 'Brocha grande para polvo con cerdas negras y virola dorada', desc: 'Brocha grande y suave para polvo suelto o compacto.' },

  { id: 'neceser-plush', nombre: 'Neceser plush rosa', cat: 'regaleria', sub: 'neceseres', precio: 15900, descuento: 0, stock: 6, alta: 25,
    img: 'images/p-neceser-plush.webp', escena: S5,
    alt: 'Neceser acolchado de plush rosa con cierre dorado', desc: 'Neceser acolchado de plush rosa con cierre dorado. Entra el maquillaje de todos los días.' },
  { id: 'neceser-cuero-rosa', nombre: 'Neceser símil cuero rosa', cat: 'regaleria', sub: 'neceseres', precio: 13500, descuento: 0, stock: 7, alta: 23,
    img: 'images/p-neceser-cuero-rosa.webp', escena: S1,
    alt: 'Neceser de símil cuero rosa con cierre dorado', desc: 'Neceser de símil cuero rosa con cierre dorado. Se limpia con un paño.' },
  { id: 'neceser-croco', nombre: 'Neceser croco negro', cat: 'regaleria', sub: 'neceseres', precio: 15000, descuento: 15, stock: 4, alta: 27,
    img: 'images/p-neceser-croco.webp', escena: S4,
    alt: 'Neceser negro símil croco con cierre dorado', desc: 'Neceser negro símil croco con cierre dorado, para el maquillaje o la cartera.' },
  { id: 'colita-terciopelo-perla', nombre: 'Colita de terciopelo con moño y perla', cat: 'regaleria', sub: 'pelo', precio: 5900, descuento: 0, stock: 14, alta: 31, tag: 'Nuevo',
    img: 'images/p-colita-terciopelo-perla.webp', escena: S5,
    alt: 'Scrunchie de terciopelo negro con un moñito dorado y una perla', desc: 'Scrunchie de terciopelo negro con un moñito dorado y una perla.' },
  { id: 'colita-saten', nombre: 'Colita de satén con ribete negro', cat: 'regaleria', sub: 'pelo', precio: 5500, descuento: 10, stock: 12, alta: 0,
    img: 'images/p-colita-saten.webp', escena: S6,
    alt: 'Scrunchie grande de satén rosa con ribete negro', desc: 'Scrunchie grande de satén rosa con ribete negro.' },
  { id: 'colita-terciopelo-rosa', nombre: 'Colita de terciopelo rosa', cat: 'regaleria', sub: 'pelo', precio: 4900, descuento: 0, stock: 16, alta: 0,
    img: 'images/p-colita-terciopelo-rosa.webp', escena: S2,
    alt: 'Scrunchie de terciopelo rosa con mucho volumen', desc: 'Scrunchie de terciopelo rosa, suave y con mucho volumen.' },
  { id: 'llavero-mono', nombre: 'Llavero moño, corazón y flor', cat: 'regaleria', sub: 'detalles', precio: 7900, descuento: 0, stock: 9, alta: 0,
    img: 'images/p-llavero-mono.webp', escena: S5,
    alt: 'Llavero dorado con moño de terciopelo negro, corazón y flor esmaltados y una perla', desc: 'Llavero con moño de terciopelo negro, corazón y flor esmaltados y una perla.' },
  { id: 'bandeja-flor', nombre: 'Bandejita flor para alhajas', cat: 'regaleria', sub: 'detalles', precio: 8500, descuento: 0, stock: 8, alta: 0,
    img: 'images/p-bandeja-flor.webp', escena: S5,
    alt: 'Bandejita de cerámica rosa con forma de flor y borde dorado con aros y un anillo', desc: 'Bandejita de cerámica rosa con borde dorado para dejar los anillos y aros.' },
  { id: 'caja-regalo', nombre: 'Caja de regalo con moño', cat: 'regaleria', sub: 'detalles', precio: 4900, descuento: 0, stock: 20, alta: 0,
    img: 'images/p-caja-regalo.webp', escena: S5,
    alt: 'Caja rosa con moño de raso negro', desc: 'Caja rosa con moño de raso negro para armar tu regalo.' },

  { id: 'body-splash-rosa', nombre: 'Body splash rosa', cat: 'maquillaje', sub: 'rostro', precio: 9900, descuento: 0, stock: 0, alta: 32, visible: false,
    img: 'images/p-colita-saten.webp', escena: S6, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.tono, p.desc, ...(p.var?.ops || []), ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), tono = lista(f.tono), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (tono.length && !tono.includes(p.tono)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);

const Cart = {
  KEY: 'amore_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'amore_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  elegir: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  const sub = subDe(p)?.nombre || '';
  if (p.cat === 'acero') return `${sub} · ${nombreDe(TONOS, p.tono)}`;
  return sub || nombreDe(CATEGORIAS, p.cat);
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="badge">${esc(p.tag)}</span>`);
  else if (p.stock <= 4) b.push('<span class="badge badge--claro">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p, { compacta = false, grande = false } = {}) {
  const nombre = esc(p.nombre);
  const estilo = MODELO === '2' ? 'editorial' : 'tarjeta';
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="560" height="560" decoding="async">`;
  const foto = compacta ? `<span class="prod__foto">${img}</span>` : `<a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}${badgesHTML(p)}${favHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    const accion = conVar(p)
      ? `<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir ${p.var.tipo.toLowerCase()}: ${nombre}">${ICON.elegir}</button>`
      : `<button type="button" class="prod-mini" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--${estilo} prod--compacta${grande ? ' prod--grande' : ''}">
      ${media}
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}${accion}</div>
      </div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">${esc(p.var.tipo)} de ${nombre}</span><select data-op>${p.var.ops.map(o => `<option value="${esc(o)}">${p.var.tipo === 'Talle' ? 'Talle ' : ''}${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod prod--${estilo}">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      ${precioHTML(p)}
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
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
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="48" height="48" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('')
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li, .sello'), { y: 16, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (moved) requestAnimationFrame(() => vp.classList.remove('dragging'));
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
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
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  const grilla = document.getElementById('grillaNovedades');
  if (grilla) {
    const items = Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
    grilla.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaicoDestacados');
  if (mosaico) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 7 }).items;
    mosaico.innerHTML = items.map((p, k) => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { compacta: true, grande: k === 0 })}</li>`).join('')
      + `<li data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="mosaico-cta" href="${CATALOGO_URL}"><span class="mosaico-cta__n">${Tienda.contar({})}</span><strong>productos entre maquillaje, acero y regalería</strong><span class="mosaico-cta__link">Ver todo el catálogo ${ICON.flecha}</span></a></li>`;
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const id = el.dataset.catN;
    const n = id === 'oferta' ? Tienda.contar({ oferta: true }) : Tienda.contar({ cat: id });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `En el tocador: ${p.alt}` }];
  const msg = `Hola Amore! Quiero consultar por ${p.nombre}${QV.op ? ` (${p.var.tipo.toLowerCase()} ${QV.op})` : ''}.`;
  const on = Favs.has(p.id);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="560" height="560"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto del ambiente' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}${sub ? ` · ${esc(sub.nombre)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.cat === 'acero' ? `<p class="qv__dato"><span>Material</span>Acero quirúrgico ${esc(nombreDe(TONOS, p.tono).toLowerCase())}</p>` : ''}
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">${esc(p.var.tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí ${esc(p.var.tipo.toLowerCase())}">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--rosa" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="560" height="560"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: 'Amore' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = ''; QV.foto = 0;
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
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Amore! Quiero consultar por ${QV.p.nombre} (${QV.p.var.tipo.toLowerCase()} ${QV.op}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí ${p.var.tipo === 'Tono' ? 'un tono' : 'un talle'} para sumarlo al carrito.`;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (${QV.op})` : ''} al carrito.`);
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
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(p.var?.tipo || '')} ${esc(op)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
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
    items.innerHTML = `<div class="drawer__vacio">${ICON.corazon}<p>Tu carrito está vacío. ¿Arrancamos por un labial o unos aros?</p><a class="btn btn--dark" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = ['Hola Amore! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${p.var?.tipo?.toLowerCase() || ''} ${i.op})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
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
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
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
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || p.var.ops[0]) : '';
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (${op})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || p.var.ops[0]) : '';
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], tono: multi('tono', TONOS),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];
  const compatibles = () => {
    if (!e.cat) e.sub = [];
    if (e.cat && e.cat !== 'acero') e.tono = [];
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
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.tono.length) f.tono = e.tono;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    if (!e.cat || e.cat === 'acero') grupos.push(`<fieldset class="f-grupo"><legend>Tono del acero</legend><div class="f-tonos">
      ${TONOS.map(t => `<label class="f-tono f-tono--${t.id}"><input type="checkbox" name="tono-${t.id}" value="${t.id}" data-f="tono"${e.tono.includes(t.id) ? ' checked' : ''}><span>${t.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const titulo = sub ? sub.nombre : cat ? cat.nombre : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.oferta ? 'Productos con descuento, mientras haya stock.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Maquillaje, accesorios de acero quirúrgico y regalería en un solo lugar.';
    document.title = `${titulo} — Amore`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.tono.forEach(v => quitar.push(['tono', v, `Acero ${nombreDe(TONOS, v).toLowerCase()}`]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'tono', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.tono.length) u.searchParams.set('tono', e.tono.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
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
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : 'No encontramos productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
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
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.tono = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.sub = []; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.tono = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });

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
document.addEventListener('favs:updated', syncFavs);

initCatsMenu();
initHome();
initCatalogo();
initReveals();
initNav();
initHeroMotion();
initParallax();
initRail();
initQV();
initCarrito();
initAcciones();
initFloats();
initFaq();
initModelBarScroll();
syncModelosLink();
updateCartBadge();
syncFavs();
