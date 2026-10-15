const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492234263419';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'textil', nombre: 'Línea Textil & Gabinete', bajada: 'Fundas, mantas, almohadones y rodillos', img: 'images/linea-textil.webp',
    texto: 'Fundas ajustables con y sin orificio facial, mantas soft, fundas de almohadón y rodillos de alta densidad para vestir la camilla.',
    subs: [{ id: 'fundas', nombre: 'Fundas para camilla' }, { id: 'mantas', nombre: 'Mantas y cubrecamillas' }, { id: 'almohadones', nombre: 'Almohadones y rodillos' }] },
  { id: 'aroma', nombre: 'Aromaterapia & Ambiente', bajada: 'Velas de soja, sahumos y flores secas', img: 'images/aromaterapia.webp',
    texto: 'Velas artesanales de cera de soja, sahumos y bouquets de flores secas para la sala y la recepción.',
    subs: [{ id: 'velas', nombre: 'Velas de soja' }, { id: 'sahumos', nombre: 'Sahumos' }, { id: 'flores', nombre: 'Flores secas' }] },
  { id: 'relax', nombre: 'Relax & Bienestar', bajada: 'Almohadillas térmicas y tazas', img: 'images/relax.webp',
    texto: 'Almohadillas térmicas de semillas y lavanda, y tazas de gres para el ritual del té después de la sesión.',
    subs: [{ id: 'almohadillas', nombre: 'Almohadillas térmicas' }, { id: 'tazas', nombre: 'Tazas' }] },
];
const OPCIONES = {
  medida: { nombre: 'Medida', verbo: 'Elegir medida', valores: ['Angosta · 180 × 60 cm', 'Estándar · 185 × 70 cm', 'Ancha · 190 × 80 cm'] },
  rodillo: { nombre: 'Medida', verbo: 'Elegir medida', valores: ['Ø 15 × 50 cm', 'Ø 20 × 60 cm'] },
  aroma: { nombre: 'Aroma', verbo: 'Elegir aroma', valores: ['Lavanda', 'Eucalipto', 'Vainilla y coco'] },
  termica: { nombre: 'Aroma', verbo: 'Elegir aroma', valores: ['Lavanda', 'Sin aroma'] },
};
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: null, max: 10000 },
  { id: '10a25', nombre: '$10.000 a $25.000', min: 10001, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS_CAT = {
  textil: 'textil textiles gabinete camilla camillas sabana sabanas funda fundas tela',
  aroma: 'aromaterapia ambiente aroma aromas deco decoracion',
  relax: 'relax bienestar calor regalo',
};
const E = { textil: 'images/linea-textil.webp', aroma: 'images/aromaterapia.webp', relax: 'images/relax.webp', esencia: 'images/esencia.webp', camilla: 'images/camilla-vestida.webp', ritual: 'images/hero-ritual.webp' };

const PRODUCTOS = [
  { id: 'funda-ajustable', nombre: 'Funda ajustable para camilla', cat: 'textil', sub: 'fundas', precio: 32900, descuento: 0, stock: 14, alta: 1, rango: 1, op: 'medida', pers: true,
    img: 'images/p-funda-ajustable.webp', escena: E.textil, alt: 'Funda ajustable de tela natural doblada sobre una camilla', meta: 'Sin orificio facial · elástico en todo el contorno',
    desc: 'Se calza como una sábana ajustable y queda tensa durante toda la sesión. Tela suave al tacto, pensada para el lavado frecuente del gabinete.' },
  { id: 'funda-orificio', nombre: 'Funda ajustable con orificio facial', cat: 'textil', sub: 'fundas', precio: 34900, descuento: 0, stock: 10, alta: 2, rango: 5, op: 'medida', pers: true,
    img: 'images/p-funda-orificio.webp', escena: E.camilla, alt: 'Camilla vestida con funda ajustable y apoya-rostro cubierto', meta: 'Con orificio facial · elástico reforzado',
    desc: 'Para camillas con apertura para el rostro: el orificio va marcado y terminado, así la funda no se corre cuando la persona se acuesta boca abajo.' },
  { id: 'cubrecamilla', nombre: 'Cubrecamilla de lienzo con caída', cat: 'textil', sub: 'mantas', precio: 27900, descuento: 0, stock: 9, alta: 3, op: 'medida', pers: true,
    img: 'images/p-cubrecamilla.webp', escena: E.textil, alt: 'Cubrecamilla de lienzo natural que cae por el borde de la camilla', meta: 'Lienzo natural · cae a los costados',
    desc: 'Va por encima de la funda y cae a los lados de la camilla. Le da un acabado prolijo al gabinete y protege la funda entre sesiones.' },
  { id: 'manta-soft', nombre: 'Manta soft para gabinete', cat: 'textil', sub: 'mantas', precio: 28900, descuento: 0, stock: 12, alta: 4, rango: 4, pers: true,
    img: 'images/p-manta-soft.webp', escena: E.textil, alt: 'Manta soft color arena doblada sobre la camilla', meta: 'Textura premium · 150 × 200 cm',
    desc: 'Abriga sin pesar durante masajes y tratamientos faciales. Se dobla fácil y vuelve a su forma después del lavado.' },
  { id: 'manta-flecos', nombre: 'Manta tejida con flecos', cat: 'textil', sub: 'mantas', precio: 36900, descuento: 0, stock: 6, alta: 5, rango: 10,
    img: 'images/p-manta-flecos.webp', escena: E.esencia, alt: 'Manta tejida en tonos crudos con flecos anudados', meta: 'Tejido grueso · flecos anudados a mano',
    desc: 'Para el pie de la camilla o el sillón de espera. Los flecos se anudan a mano, uno por uno.' },
  { id: 'pie-tejido', nombre: 'Pie de camilla tejido', cat: 'textil', sub: 'mantas', precio: 24900, descuento: 0, stock: 8, alta: 6,
    img: 'images/p-pie-tejido.webp', escena: E.camilla, alt: 'Pie de camilla tejido en hilo crudo sobre una camilla vestida', meta: 'Hilo crudo · 60 × 180 cm',
    desc: 'Cruza la camilla de lado a lado y suma textura sin tapar la funda. Abriga los pies y queda lindo en las fotos del gabinete.' },
  { id: 'almohadon-rayado', nombre: 'Funda de almohadón rayada', cat: 'textil', sub: 'almohadones', precio: 13900, descuento: 0, stock: 15, alta: 7, pers: true,
    img: 'images/p-almohadon-rayado.webp', escena: E.camilla, alt: 'Almohadón con funda de lino crudo y rayas finas', meta: 'Lino rústico · 40 × 60 cm',
    desc: 'Funda con cierre oculto para almohadones de apoyo. Las rayas finas acompañan cualquier funda lisa.' },
  { id: 'rodillo', nombre: 'Rodillo cilíndrico de alta densidad', cat: 'textil', sub: 'almohadones', precio: 26900, descuento: 0, stock: 10, alta: 8, rango: 7, op: 'rodillo', pers: true,
    img: 'images/p-rodillo.webp', escena: E.textil, alt: 'Dos rodillos cilíndricos tapizados en tela natural sobre la camilla', meta: 'Alta densidad · funda removible',
    desc: 'Sostiene rodillas, tobillos o cervicales sin aplastarse con el uso. La funda se saca para lavarla.' },
  { id: 'rodillo-faja', nombre: 'Funda para rodillo con faja tejida', cat: 'textil', sub: 'almohadones', precio: 15900, descuento: 0, stock: 7, alta: 9, op: 'rodillo',
    img: 'images/p-rodillo-faja.webp', escena: E.esencia, alt: 'Rodillo con funda de lino y una faja tejida en el centro', meta: 'Lino + faja de hilo tejido',
    desc: 'Renová un rodillo que ya tenés: la funda de lino lleva una faja tejida que le da el toque de gabinete holístico.' },
  { id: 'apoyarrostro', nombre: 'Funda para apoya-rostro', cat: 'textil', sub: 'fundas', precio: 9900, descuento: 0, stock: 20, alta: 10, pers: true,
    img: 'images/p-apoyarrostro.webp', escena: E.textil, alt: 'Apoya-rostro en forma de herradura cubierto con funda de tela', meta: 'Elastizada · se lava con la funda',
    desc: 'Cubre el apoya-rostro de la camilla y se cambia en segundos entre un turno y otro.' },

  { id: 'vela-vidrio', nombre: 'Vela de soja en vaso de vidrio', cat: 'aroma', sub: 'velas', precio: 8900, descuento: 0, stock: 24, alta: 11, rango: 2, op: 'aroma',
    img: 'images/p-vela-vidrio.webp', escena: E.aroma, alt: 'Vela de cera de soja encendida en un vaso de vidrio', meta: 'Cera de soja · mecha de algodón',
    desc: 'Vela artesanal de cera de soja en vaso de vidrio reutilizable. Elegí el aroma para la sala o la recepción.' },
  { id: 'vela-ceramica', nombre: 'Vela de soja en cuenco de cerámica', cat: 'aroma', sub: 'velas', precio: 12900, descuento: 0, stock: 12, alta: 12, op: 'aroma',
    img: 'images/p-vela-ceramica.webp', escena: E.aroma, alt: 'Vela encendida en un cuenco de cerámica moteada', meta: 'Cuenco de cerámica moteada',
    desc: 'Cuando la vela se termina, el cuenco queda para usar como portasahumos o para guardar cristales.' },
  { id: 'vela-ambar', nombre: 'Vela de soja en frasco ámbar', cat: 'aroma', sub: 'velas', precio: 11900, descuento: 0, stock: 3, alta: 13, op: 'aroma',
    img: 'images/p-vela-ambar.webp', escena: E.aroma, alt: 'Vela encendida dentro de un frasco de vidrio ámbar', meta: 'Frasco ámbar con tapa',
    desc: 'El vidrio ámbar tiñe la luz de la llama de un tono cálido. Viene con tapa para conservar el aroma.' },
  { id: 'vela-bowl', nombre: 'Vela de soja en bowl', cat: 'aroma', sub: 'velas', precio: 10900, descuento: 0, stock: 10, alta: 14, op: 'aroma',
    img: 'images/p-vela-bowl.webp', escena: E.esencia, alt: 'Vela encendida en un bowl de cerámica blanca', meta: 'Bowl de cerámica blanca',
    desc: 'Bowl ancho con mecha de algodón: ilumina parejo y luce en estantes y mesas auxiliares del gabinete.' },
  { id: 'sahumo-salvia', nombre: 'Sahumo de salvia blanca', cat: 'aroma', sub: 'sahumos', precio: 6900, descuento: 0, stock: 30, alta: 15, rango: 6,
    img: 'images/p-sahumo-salvia.webp', escena: E.aroma, alt: 'Atado de salvia blanca seca dentro de un cuenco de cerámica', meta: 'Atado artesanal · hilo de algodón',
    desc: 'Atado de salvia blanca para limpiar el ambiente antes o después de cada sesión.' },
  { id: 'palo-santo', nombre: 'Palo santo', cat: 'aroma', sub: 'sahumos', precio: 5900, descuento: 0, stock: 30, alta: 16,
    img: 'images/p-palo-santo.webp', escena: E.aroma, alt: 'Varita de palo santo apoyada sobre una mesa clara', meta: 'Pack de 3 varitas',
    desc: 'Varitas de palo santo para sahumar de a poco: se encienden, se apagan y se vuelven a usar.' },
  { id: 'flores-sahumar', nombre: 'Flores secas para sahumar', cat: 'aroma', sub: 'sahumos', precio: 5500, descuento: 0, stock: 18, alta: 17, tag: 'Nuevo',
    img: 'images/p-flores-sahumar.webp', escena: E.aroma, alt: 'Plato con flores secas de manzanilla y lavanda', meta: 'Manzanilla y lavanda · 30 g',
    desc: 'Mezcla de flores secas para quemar sobre carbón o dejar en un plato como aromatizante natural.' },
  { id: 'bouquet-jarron', nombre: 'Bouquet de flores secas con jarrón', cat: 'aroma', sub: 'flores', precio: 24900, descuento: 0, stock: 5, alta: 18, rango: 9,
    img: 'images/p-bouquet-jarron.webp', escena: E.aroma, alt: 'Bouquet de lavanda, eucalipto y flores secas en un jarrón de cerámica', meta: 'Lavanda, eucalipto y craspedia',
    desc: 'Bouquet armado a mano en jarrón de cerámica. Dura meses sin agua y no necesita cuidados.' },
  { id: 'bouquet-lavanda', nombre: 'Bouquet de lavanda y craspedia', cat: 'aroma', sub: 'flores', precio: 16900, descuento: 0, stock: 8, alta: 19,
    img: 'images/p-bouquet-lavanda.webp', escena: E.aroma, alt: 'Ramo de lavanda, craspedia y paniculata secas', meta: 'Sin jarrón · 40 cm',
    desc: 'Ramo seco listo para un frasco o un florero que ya tengas. Suma color sin restarle calma al ambiente.' },
  { id: 'ramito', nombre: 'Ramito atado de lavanda', cat: 'aroma', sub: 'flores', precio: 9900, descuento: 0, stock: 14, alta: 20, tag: 'Nuevo',
    img: 'images/p-ramito.webp', escena: E.esencia, alt: 'Ramito de lavanda y flores secas atado con hilo natural', meta: 'Atado con hilo natural',
    desc: 'Para dejar sobre la camilla al recibir a cada persona o para colgar detrás de la puerta.' },

  { id: 'almohadilla-lavanda', nombre: 'Almohadilla térmica de semillas y lavanda', cat: 'relax', sub: 'almohadillas', precio: 12900, descuento: 0, stock: 16, alta: 21, rango: 3, op: 'termica',
    img: 'images/p-almohadilla-lavanda.webp', escena: E.relax, alt: 'Almohadillas térmicas de lino con estampa de lavanda apiladas', meta: 'Semillas de lino · 18 × 40 cm',
    desc: 'Se calienta en el microondas y guarda el calor sobre cuello, espalda o abdomen. Rellena de semillas y lavanda.' },
  { id: 'almohadilla-salvia', nombre: 'Almohadilla térmica estampa salvia', cat: 'relax', sub: 'almohadillas', precio: 12900, descuento: 0, stock: 11, alta: 22, op: 'termica',
    img: 'images/p-almohadilla-salvia.webp', escena: E.relax, alt: 'Almohadilla térmica verde salvia con estampa de ramas', meta: 'Semillas de lino · 18 × 40 cm',
    desc: 'La misma almohadilla de semillas, con estampa de ramas en verde salvia. Ideal para regalar a clientas.' },
  { id: 'almohadilla-cervical', nombre: 'Almohadilla cervical de lino y lavanda', cat: 'relax', sub: 'almohadillas', precio: 14900, descuento: 0, stock: 9, alta: 23, tag: 'Nuevo', op: 'termica',
    img: 'images/p-almohadilla-cervical.webp', escena: E.ritual, alt: 'Almohadilla de lino natural con flores de lavanda sobre mantas dobladas', meta: 'Forma cervical · funda de lino',
    desc: 'Pensada para el cuello: se acomoda sobre los hombros y reparte el calor de forma pareja.' },
  { id: 'taza-bicolor', nombre: 'Taza de gres bicolor', cat: 'relax', sub: 'tazas', precio: 9900, descuento: 0, stock: 12, alta: 24,
    img: 'images/p-taza-bicolor.webp', escena: E.relax, alt: 'Taza de gres blanca moteada con base color terracota', meta: 'Gres · 350 ml',
    desc: 'Para la infusión de bienvenida o el té después del masaje. Esmaltada por dentro, base al natural.' },
  { id: 'taza-moteada', nombre: 'Taza de gres moteada', cat: 'relax', sub: 'tazas', precio: 9900, descuento: 0, stock: 12, alta: 25,
    img: 'images/p-taza-moteada.webp', escena: E.ritual, alt: 'Taza de gres color crema con pintitas, llena de té', meta: 'Gres · 300 ml',
    desc: 'Taza de gres con esmalte crema y pintitas, de las que se sostienen con las dos manos.' },
  { id: 'taza-loto', nombre: 'Taza loto grabada', cat: 'relax', sub: 'tazas', precio: 11900, descuento: 0, stock: 10, alta: 26, rango: 8,
    img: 'images/p-taza-loto.webp', escena: E.esencia, alt: 'Taza de cerámica con una flor de loto grabada', meta: 'Cerámica grabada · 300 ml',
    desc: 'Con una flor de loto grabada. Un regalo para clientas o un detalle para la recepción.' },
];

const ESCENAS = [
  { id: 'gabinete', puntos: [['funda-ajustable', 24, 37], ['rodillo', 66, 26], ['manta-soft', 47, 57], ['apoyarrostro', 86, 52], ['cubrecamilla', 40, 85]],
    pie: 'Todo en la misma paleta cruda: combiná fundas, mantas y rodillos sin pensar.', cat: 'textil' },
  { id: 'aromas', puntos: [['bouquet-jarron', 33, 16], ['vela-ambar', 79, 46], ['vela-vidrio', 52, 56], ['sahumo-salvia', 14, 59], ['vela-ceramica', 69, 66], ['palo-santo', 24, 82]],
    pie: 'Las velas vienen en tres aromas: lavanda, eucalipto y vainilla y coco.', cat: 'aroma' },
  { id: 'pausa', puntos: [['taza-bicolor', 87, 22], ['almohadilla-lavanda', 52, 44], ['almohadilla-salvia', 34, 66]],
    pie: 'Las almohadillas se calientan en el microondas y vienen con lavanda o sin aroma.', cat: 'relax' },
];
const MOSAICO = ['funda-orificio', 'manta-flecos', 'taza-loto', 'almohadilla-cervical', 'rodillo-faja', 'vela-bowl', 'ramito'];

function crearTienda(coleccion, { extra = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([p.nombre, p.meta, p.desc, p.sub, extra(p),
    ...(p.op ? OPCIONES[p.op].valores : []), p.pers ? 'personalizable personalizado logo a medida' : ''].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.pers && !p.pers) return false;
    if (f.destacado === true && !p.rango) return false;
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
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || a.alta - b.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', desde = 0, limite = POR_PAGINA } = {}) {
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    const items = ordenados.slice(desde, desde + limite);
    return { items: items.map(copia), total: ordenados.length, hayMas: desde + items.length < ordenados.length };
  }
  function contar(filtros = {}) { return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0); }
  function obtener(id) { const p = visibles.find(x => x.id === id); return p ? copia(p) : null; }
  function minimo(filtros = {}) { return visibles.filter(p => coincide(p, filtros)).reduce((m, p) => Math.min(m, final(p)), Infinity); }
  return { consultar, contar, obtener, minimo };
}
const Tienda = crearTienda(PRODUCTOS, { extra: p => `${ETIQUETAS_CAT[p.cat] || ''} ${CATEGORIAS.find(c => c.id === p.cat)?.subs.find(s => s.id === p.sub)?.nombre || ''}` });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;

const Cart = {
  KEY: 'homadeco_cart',
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
const ENTREGA_KEY = 'homadeco_entrega';
const ENTREGAS = { envio: 'Envío a domicilio (todo el país)', mdp: 'Retiro o entrega en Mar del Plata' };
const leerEntrega = () => { try { const v = localStorage.getItem(ENTREGA_KEY); return ENTREGAS[v] ? v : 'envio'; } catch { return 'envio'; } };

const SVG = (d, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true"${extra}>${d}</svg>`;
const ICON = {
  flecha: SVG('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  menos: SVG('<path d="M5 12h14"/>'),
  mas: SVG('<path d="M12 5v14M5 12h14"/>'),
  cerrar: SVG('<path d="M18 6 6 18M6 6l12 12"/>'),
  carritoMas: SVG('<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/>'),
  ajustes: SVG('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
  tijera: SVG('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>'),
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="badge">${esc(p.tag)}</span>`);
  if (p.pers) b.push('<span class="badge badge--salvia">Personalizable</span>');
  if (!p.tag && p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--claro">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
function addRoundHTML(p) {
  const nombre = esc(p.nombre);
  return p.op
    ? `<button type="button" class="add-round" data-qv-abrir="${p.id}" aria-label="${OPCIONES[p.op].verbo}: ${nombre}">${ICON.ajustes}</button>`
    : `<button type="button" class="add-round" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function cardHTML(p, variante = 'card', { grande = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="720" height="720">`;
  if (variante === 'foto') {
    return `<article class="prod prod-foto${grande ? ' prod-foto--grande' : ''}">
      <span class="prod-foto__sizer"></span>
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver detalle: ${nombre}">${img}${badgesHTML(p)}</a>
      <div class="prod-foto__info">
        <p class="prod__meta">${esc(p.meta)}</p>
        <h3 class="prod__nombre">${nombre}</h3>
        <div class="prod-foto__fila">${precioHTML(p)}${addRoundHTML(p)}</div>
      </div>
    </article>`;
  }
  if (variante === 'fila') {
    return `<article class="prod prod-fila">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
      <div class="prod__body">
        <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
        <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
        <div class="prod__pie">${precioHTML(p)}${addRoundHTML(p)}</div>
      </div>
    </article>`;
  }
  const acciones = p.op
    ? `<button type="button" class="prod-add" data-qv-abrir="${p.id}" aria-label="${OPCIONES[p.op].verbo}: ${nombre}">${ICON.ajustes}<span class="lbl-long">${OPCIONES[p.op].verbo}</span><span class="lbl-short">Elegir</span></button>`
    : `${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button>`;
  return `<article class="prod prod-card">
    <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
    <div class="prod__body">
      <p class="prod__meta">${esc(p.meta)}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod-actions">${acciones}</div>
      ${p.op ? '' : `<button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>`}
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
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="48" height="48">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
      </a><div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>`).join('')
      + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
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
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.etiqueta, .sello, .hero2__lista li'), { scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
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
    const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 300) + 16;
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-desde]').forEach(el => {
    const m = Tienda.minimo({ cat: el.dataset.desde });
    if (Number.isFinite(m)) el.textContent = formatearPrecio(m);
  });
  const rail = document.getElementById('railDestacados');
  if (rail) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
    rail.innerHTML = items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, 'fila')}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaico');
  if (mosaico) {
    const items = MOSAICO.map(getProducto).filter(Boolean);
    mosaico.innerHTML = items.map((p, k) => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p, 'foto', { grande: k === 0 })}</li>`).join('')
      + `<li class="mosaico__cta-li" data-animate="subir" style="opacity:0;transform:translateY(36px)"><a class="mosaico-cta" href="${CATALOGO_URL}"><strong>Todo el catálogo, con filtros por línea, precio y personalización</strong><span>Ver el catálogo completo ${ICON.flecha}</span></a></li>`;
  }
}

function initEscena() {
  const sec = document.getElementById('escena');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('[role="tab"]')];
  const fotos = [...sec.querySelectorAll('.escena__foto img')];
  const capa = sec.querySelector('.escena__puntos');
  const lista = sec.querySelector('#escenaLista');
  const pie = sec.querySelector('[data-escena-pie]');
  const link = sec.querySelector('[data-escena-link]');
  const panel = sec.querySelector('[role="tabpanel"]');
  if (!tabs.length || !capa || !lista) return;
  capa.innerHTML = ESCENAS.map(es => `<div class="puntos" data-puntos="${es.id}" hidden>${es.puntos.map(([id, x, y]) => {
    const p = getProducto(id);
    return p ? `<button type="button" class="punto" style="--x:${x}%;--y:${y}%" data-punto="${id}" aria-label="${esc(p.nombre)}: ver en la lista"><span></span></button>` : '';
  }).join('')}</div>`).join('');
  const marcar = id => {
    sec.querySelectorAll('[data-punto]').forEach(b => b.classList.toggle('activo', b.dataset.punto === id));
    lista.querySelectorAll('[data-item]').forEach(li => li.classList.toggle('activo', li.dataset.item === id));
  };
  let actual = '';
  const activar = (id, foco = false) => {
    const es = ESCENAS.find(x => x.id === id) || ESCENAS[0];
    if (es.id === actual) return;
    actual = es.id;
    tabs.forEach(t => {
      const on = t.dataset.escena === es.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
      if (on && panel) panel.setAttribute('aria-labelledby', t.id);
    });
    fotos.forEach(img => img.classList.toggle('activa', img.dataset.escena === es.id));
    capa.querySelectorAll('[data-puntos]').forEach(d => { d.hidden = d.dataset.puntos !== es.id; });
    lista.innerHTML = es.puntos.map(([pid]) => {
      const p = getProducto(pid);
      if (!p) return '';
      return `<li class="escena__item" data-item="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(28px)">
        <img src="${p.img}" alt="" width="64" height="64">
        <div><h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${esc(p.nombre)}</a></h3>${precioHTML(p)}</div>
        ${addRoundHTML(p)}
      </li>`;
    }).join('');
    if (pie) pie.textContent = es.pie;
    if (link) link.href = `${CATALOGO_URL}?cat=${es.cat}`;
    revelarNuevos(lista);
    refrescarTriggers();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.dataset.escena));
    t.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let j = i;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      activar(tabs[j].dataset.escena, true);
    });
  });
  capa.addEventListener('click', e => {
    const b = e.target.closest('[data-punto]');
    if (!b) return;
    marcar(b.dataset.punto);
    const li = lista.querySelector(`[data-item="${b.dataset.punto}"]`);
    if (li) {
      const r = li.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) li.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      li.querySelector('a')?.focus({ preventScroll: true });
    }
  });
  capa.addEventListener('mouseover', e => { const b = e.target.closest('[data-punto]'); if (b) marcar(b.dataset.punto); });
  lista.addEventListener('mouseover', e => { const li = e.target.closest('[data-item]'); if (li) marcar(li.dataset.item); });
  lista.addEventListener('focusin', e => { const li = e.target.closest('[data-item]'); if (li) marcar(li.dataset.item); });
  activar(ESCENAS[0].id);
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = cat?.subs?.find(s => s.id === p.sub);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `Ambiente: ${p.alt}` }];
  const opc = p.op ? OPCIONES[p.op] : null;
  const msg = `Hola Homa! Quiero consultar por ${p.nombre}${QV.op ? ` (${QV.op})` : ''}.`;
  const msgMayor = `Hola Homa! Equipo un gabinete y quiero precio por cantidad de ${p.nombre}.`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="720" height="720"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto del ambiente' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}${sub ? ` · ${esc(sub.nombre)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="prod__meta">${esc(p.meta)}</p>
        ${opc ? `<div class="qv__opciones">
          <p><span>${opc.nombre}</span>${p.op === 'medida' ? `<a href="${HOME_URL}#medidas" data-qv-salir>Ver guía de medidas</a>` : ''}</p>
          <div class="qv__ops" role="group" aria-label="Elegí ${opc.nombre.toLowerCase()}">${opc.valores.map(v => `<button type="button" class="qv__op" data-qv-op="${esc(v)}" aria-pressed="${QV.op === v}">${esc(v)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--ghost" data-qv-comprar>Comprar ahora</button>
        </div>
        ${p.pers ? `<div class="qv__nota">${ICON.tijera}<p><strong>Personalizable.</strong> La hacemos en otra medida, en otro color o con el logo de tu gabinete. Consultanos antes de comprar.</p></div>` : ''}
        <div class="qv__links">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <a href="${wspHref(msgMayor)}" target="_blank" rel="noopener">${ICON.wsp}Pedir precio por mayor</a>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="200" height="200"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: 'Homa Deco Holística' },
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
function cerrarQV(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  if (devolverFoco) QV.opener?.focus?.({ preventScroll: true });
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (e.target.closest('[data-qv-salir]')) { cerrarQV(false); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Homa! Quiero consultar por ${QV.p.nombre} (${QV.op}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (p.op && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí ${OPCIONES[p.op].nombre === 'Medida' ? 'una medida' : 'un aroma'} para agregar al carrito.`;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op);
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
      <p class="linea__meta">${op ? `${esc(op)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
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
    items.innerHTML = `<div class="drawer__vacio"><p class="italica">Tu carrito está en calma.</p><p>Todavía no sumaste nada. Empezá por una funda para la camilla o una vela para la sala.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const entrega = leerEntrega();
  foot.querySelectorAll('input[name="entrega"]').forEach(r => { r.checked = r.value === entrega; });
  const texto = ['Hola Homa! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${i.op})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, `Entrega: ${ENTREGAS[entrega]}`].join('\n');
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
  cartOpener?.focus?.({ preventScroll: true });
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
  d.addEventListener('change', e => {
    const r = e.target.closest('input[name="entrega"]');
    if (!r) return;
    try { localStorage.setItem(ENTREGA_KEY, r.value); } catch (err) { void err; }
    renderCarrito();
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
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
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
      const qty = Number(add.closest('.prod-actions')?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty);
      showToast(`Sumaste ${p.nombre} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.prod__body')?.querySelector('.prod-actions [data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty);
      abrirCarrito();
    }
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !items.length) return;
  const img = visor.querySelector('.visor__img');
  const cap = visor.querySelector('[data-visor-cap]');
  let i = 0, opener = null;
  const pintar = () => {
    const b = items[i];
    img.src = b.dataset.visor;
    img.alt = b.querySelector('img')?.alt || '';
    if (cap) cap.textContent = `${b.dataset.visorCap || ''} · ${i + 1} de ${items.length}`;
  };
  const abrir = k => {
    i = k; opener = document.activeElement; pintar();
    visor.hidden = false; Capas.abrir(visor);
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    setTimeout(() => visor.querySelector('.visor__cerrar')?.focus(), 60);
  };
  const cerrar = () => {
    visor.classList.remove('open');
    setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 300);
    Capas.cerrar(visor);
    opener?.focus?.({ preventScroll: true });
  };
  const mover = d => { i = (i + d + items.length) % items.length; pintar(); };
  items.forEach((b, k) => b.addEventListener('click', () => abrir(k)));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) cerrar();
    else if (e.target.closest('[data-visor-prev]')) mover(-1);
    else if (e.target.closest('[data-visor-next]')) mover(1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrar(); }
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'ArrowLeft') mover(-1);
    atraparFoco(visor, e);
  });
}

function initMedidasHash() {
  const abrir = () => {
    if (location.hash !== '#medidas') return;
    const d = document.getElementById('medidas');
    if (d && !d.open) { d.open = true; refrescarTriggers(); }
  };
  abrir();
  window.addEventListener('hashchange', abrir);
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const reglas = {
    nombre: v => v.trim().length >= 2 || 'Contanos tu nombre.',
    whatsapp: v => v.replace(/\D/g, '').length >= 10 || 'Dejanos un WhatsApp con código de área, por ejemplo 223 426 3419.',
    tipo: v => !!v || 'Elegí qué tipo de consulta es.',
    mensaje: v => v.trim().length >= 10 || 'Contanos un poco más: medidas, cantidades o qué querés personalizar.',
  };
  const validar = campo => {
    const regla = reglas[campo.name];
    if (!regla) return true;
    const r = regla(campo.value);
    const err = document.getElementById(`err-${campo.name}`);
    const ok = r === true;
    campo.setAttribute('aria-invalid', String(!ok));
    if (err) err.textContent = ok ? '' : r;
    return ok;
  };
  form.addEventListener('blur', e => { if (e.target.name && reglas[e.target.name] && e.target.value) validar(e.target); }, true);
  form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') validar(e.target); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input, select, textarea')].filter(c => reglas[c.name]);
    const malos = campos.filter(c => !validar(c));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      campos.forEach(c => c.removeAttribute('aria-invalid'));
      btn.disabled = false; btn.innerHTML = txt;
    }, 800);
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const subsDe = cat => CATEGORIAS.find(c => c.id === cat)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], pers: params.get('pers') === '1',
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = (params.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
  const variante = MODELO === '2' ? 'foto' : 'card';

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.pers) f.pers = true;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, grupo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}>${etiqueta}${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Línea</legend>
      ${opcion('radio', 'cat', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}))}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }))).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo de producto</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', 'sub', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }))).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', 'precio', '', 'Cualquier precio', !e.precio)}
      ${PRECIOS.map(r => opcion('radio', 'precio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Para tu gabinete</legend>
      ${opcion('checkbox', 'pers', 'pers', '1', 'Personalizable con tu logo, color o medida', e.pers, Tienda.contar({ ...base, pers: true }))}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const titulo = sub ? sub.nombre : cat ? cat.nombre : 'Catálogo completo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Textiles para la camilla, velas de soja, sahumos, flores secas y almohadillas térmicas para gabinetes de masajes y estética.';
    document.title = `${titulo} — Homa Deco Holística`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    if (e.pers) quitar.push(['pers', '1', 'Personalizable']);
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'pers', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.pers) u.searchParams.set('pers', '1');
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, desde: mostrados, limite: POR_PAGINA });
    total = res.total;
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p, variante)}</li>`).join(''));
    mostrados += res.items.length;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !res.hayMas;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    e.sub = e.sub.filter(v => subsDe(e.cat).some(s => s.id === v));
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
    else if (grupo === 'pers') e.pers = inp.checked;
    else {
      const set = new Set(e.sub);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e.sub = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.pers = false; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'pers') e.pers = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e.sub = e.sub.filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = [];
    aplicar();
  });
  document.querySelectorAll('.cats-item, .cats-subs a, .cats-todo, [data-cat-link]').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.pers = false; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));

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
  function cerrar(devolver = true) {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    if (devolver) abrirBtn.focus();
  }
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { cerrar(false); form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', () => cerrar());
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
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

initCatsMenu();
initHome();
initEscena();
initCatalogo();
initReveals();
initNav();
initHeroMotion();
initRails();
initQV();
initCarrito();
initAcciones();
initFloats();
initVisor();
initMedidasHash();
initForm();
initModelBarScroll();
updateCartBadge();
