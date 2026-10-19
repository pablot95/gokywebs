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

const WSP = '5491125296946';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'maquillaje', nombre: 'Maquillaje', bajada: 'Bases, labiales, paletas, máscaras y pinceles para armar tu look.', img: 'images/p-labial.webp',
    subs: { rostro: 'Rostro', ojoslabios: 'Ojos y labios', pinceles: 'Pinceles' } },
  { id: 'skincare', nombre: 'Skincare', bajada: 'Limpieza, sérums, hidratación y protección solar para tu rutina de todos los días.', img: 'images/p-serum.webp',
    subs: { limpieza: 'Limpieza', serums: 'Sérums y aceites', hidratacion: 'Hidratación', proteccion: 'Protección solar' } },
  { id: 'perfumes', nombre: 'Perfumes', bajada: 'Eau de parfum, eau de toilette, body mists y perfumes en aceite.', img: 'images/p-perfume-edp.webp',
    subs: { edp: 'Eau de parfum', edt: 'Eau de toilette', mist: 'Body mist', aceites: 'Perfumes en aceite' } },
  { id: 'bijou', nombre: 'Bijouterie', bajada: 'Aros, collares, pulseras y anillos en dorado y plateado.', img: 'images/p-aros-trenzados.webp',
    subs: { aros: 'Aros', collares: 'Collares', pulseras: 'Pulseras', anillos: 'Anillos' } },
];
const COLORES = {
  Nude: '#D6B19C', Rosado: '#D89CA1', Terracota: '#B0624A', Rojo: '#9E2A2B', Malva: '#8E5E73', Marrón: '#7A5443', Dorado: '#C8A257', Plateado: '#BCC0C6',
};
const RANGOS = {
  hasta12: { nombre: 'Hasta $12.000', max: 12000 },
  '12a20': { nombre: '$12.000 a $20.000', min: 12001, max: 20000 },
  mas20: { nombre: 'Más de $20.000', min: 20001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const unico = stock => [{ v: 'Único', stock }];
const tonos = lista => lista.map(([v, sw, stock]) => ({ v, sw, stock }));
const simples = lista => lista.map(([v, stock]) => ({ v, stock }));

const PRODUCTOS = [
  { id: 'labial-cremoso', nombre: 'Labial cremoso mate', cat: 'maquillaje', sub: 'ojoslabios', precio: 12900, descuento: 0, opcion: 'Tono', rango: 1, alta: 10,
    ops: tonos([['Nude rosado', '#C48A83', 6], ['Terracota', '#A65A45', 4], ['Rojo clásico', '#9A2A2C', 5], ['Malva', '#8C5D72', 0]]), colores: ['Nude', 'Terracota', 'Rojo', 'Malva'],
    img: 'images/p-labial.webp', alt: 'Labial nude en estuche rosado con detalle dorado sobre una piedra de travertino',
    desc: 'Textura cremosa que seca en un mate cómodo, sin tirar. Cubre de una pasada y se puede superponer para un tono más intenso.',
    uso: 'Aplicalo directo desde el centro del labio hacia afuera. Para un efecto difuminado, dale toques con la yema del dedo.', tags: ['labial', 'lapiz labial', 'labios', 'mate', 'rouge', 'nude', 'rojo'] },
  { id: 'paleta-nude', nombre: 'Paleta de sombras Nude 10 tonos', cat: 'maquillaje', sub: 'ojoslabios', precio: 24900, descuento: 15, opcion: null, rango: 2, alta: 9,
    ops: unico(7), colores: ['Nude', 'Marrón'],
    img: 'images/p-paleta-sombras.webp', alt: 'Paleta de diez sombras en tonos nude, rosados y marrones, con espejo en la tapa',
    desc: 'Diez tonos entre mates y satinados, del champagne al chocolate. Trae espejo en la tapa para retocar donde estés.',
    uso: 'Los mates claros van en todo el párpado; los satinados, en el centro y en el lagrimal. El marrón profundo marca el pliegue.', tags: ['sombras', 'paleta', 'ojos', 'nude', 'satinado', 'mate'] },
  { id: 'perfume-edp', nombre: 'Eau de parfum floral 100 ml', cat: 'perfumes', sub: 'edp', precio: 39900, descuento: 0, opcion: null, rango: 3, alta: 8,
    ops: unico(6), colores: [],
    img: 'images/p-perfume-edp.webp', alt: 'Frasco de perfume de vidrio con tapa facetada sobre un bloque de travertino al sol',
    desc: 'Notas de jazmín, pera y almizcle blanco sobre un fondo de vainilla suave. Frasco de vidrio facetado con atomizador.',
    uso: 'Rociá a unos 15 cm sobre muñecas, cuello y detrás de las orejas. No frotes: así el aroma dura más.', tags: ['perfume', 'fragancia', 'eau de parfum', 'floral', 'jazmin', 'vainilla'] },
  { id: 'serum-hialuronico', nombre: 'Sérum facial con ácido hialurónico', cat: 'skincare', sub: 'serums', precio: 19900, descuento: 0, opcion: null, rango: 4, alta: 7,
    ops: unico(8), colores: [],
    img: 'images/p-serum.webp', alt: 'Frasco gotero de vidrio con sérum transparente entre piedras y una rama de olivo',
    desc: 'Textura acuosa que se absorbe rápido y deja la piel hidratada y lisa. Frasco gotero de 30 ml.',
    uso: 'Tres o cuatro gotas sobre la piel limpia, a la mañana y a la noche, antes de la crema.', tags: ['serum', 'acido hialuronico', 'hidratacion', 'rostro'] },
  { id: 'mascara-volumen', nombre: 'Máscara de pestañas volumen', cat: 'maquillaje', sub: 'ojoslabios', precio: 11900, descuento: 0, opcion: null, rango: 5, alta: 6,
    ops: unico(12), colores: [],
    img: 'images/p-mascara.webp', alt: 'Máscara de pestañas en envase rosado nude con el cepillo afuera',
    desc: 'Cepillo de fibras que separa y carga desde la raíz. Negro intenso que no se descascara durante el día.',
    uso: 'Movimientos en zigzag desde la raíz hacia las puntas. Para más volumen, una segunda capa antes de que seque.', tags: ['mascara', 'rimel', 'pestañas', 'ojos', 'volumen'] },
  { id: 'crema-hidratante', nombre: 'Crema hidratante facial', cat: 'skincare', sub: 'hidratacion', precio: 17900, descuento: 0, opcion: null, rango: 6, alta: 5,
    ops: unico(11), colores: [],
    img: 'images/p-crema.webp', alt: 'Pote de vidrio abierto con crema blanca sobre una piedra de travertino',
    desc: 'Crema liviana para todo tipo de piel, ideal como base del maquillaje. Pote de vidrio de 50 g.',
    uso: 'Después del sérum, una cantidad del tamaño de una lenteja en rostro y cuello, con movimientos hacia arriba.', tags: ['crema', 'hidratante', 'facial', 'rostro', 'hidratacion'] },
  { id: 'pulsera-dorada', nombre: 'Pulsera de eslabones dorada', cat: 'bijou', sub: 'pulseras', precio: 12900, descuento: 0, opcion: null, rango: 7, alta: 4,
    ops: unico(7), colores: ['Dorado'],
    img: 'images/p-pulsera-dorada.webp', alt: 'Pulsera de eslabones rectangulares dorados sobre una superficie de piedra clara',
    desc: 'Eslabones rectangulares con baño dorado y cierre a presión. Largo de 18 cm.',
    uso: 'Guardala en su bolsita, lejos del perfume y del agua, para que el baño dure más.', tags: ['pulsera', 'dorada', 'eslabones', 'bijou'] },
  { id: 'aros-trenzados', nombre: 'Aros argolla trenzados', cat: 'bijou', sub: 'aros', precio: 10900, descuento: 0, opcion: null, rango: 8, alta: 3,
    ops: unico(9), colores: ['Dorado'],
    img: 'images/p-aros-trenzados.webp', alt: 'Par de aros argolla dorados con textura trenzada sobre papel madera',
    desc: 'Argollas medianas con textura trenzada, de acero con baño dorado y cierre a presión.',
    uso: 'Limpialos con un paño seco después de usarlos y guardalos por separado.', tags: ['aros', 'argollas', 'dorados', 'trenzados', 'bijou'] },
  { id: 'base-liquida', nombre: 'Base líquida acabado natural', cat: 'maquillaje', sub: 'rostro', precio: 21900, descuento: 0, opcion: 'Tono', alta: 30,
    ops: tonos([['01 Porcelana', '#EBCDB6', 3], ['02 Marfil', '#E0BC9E', 5], ['03 Beige', '#CFA682', 6], ['04 Canela', '#B78665', 4], ['05 Moka', '#8C5F46', 2]]), colores: ['Nude', 'Marrón'],
    img: 'images/p-base-liquida.webp', alt: 'Frasco de base líquida color beige con tapa negra sobre papel madera',
    desc: 'Cobertura media que se puede construir y un acabado natural que no marca líneas. Frasco de vidrio de 30 ml con dosificador.',
    uso: 'Probá el tono en la mandíbula con luz natural. Aplicala del centro hacia afuera con pincel o esponja húmeda.', tags: ['base', 'maquillaje', 'cobertura', 'rostro', 'piel'] },
  { id: 'aros-cuadrados', nombre: 'Aros cuadrados plateados', cat: 'bijou', sub: 'aros', precio: 9900, descuento: 0, opcion: null, alta: 29,
    ops: unico(15), colores: ['Plateado'],
    img: 'images/p-aros-cuadrados.webp', alt: 'Par de aros argolla cuadrados plateados sobre una superficie de piedra',
    desc: 'Argollas cuadradas de acero con cierre a presión. Livianas para usar todo el día.',
    uso: 'Limpialos con un paño seco y guardalos por separado para que no se rayen.', tags: ['aros', 'argollas', 'plateados', 'cuadrados', 'bijou', 'acero'] },
  { id: 'aceite-facial', nombre: 'Aceite facial nutritivo', cat: 'skincare', sub: 'serums', precio: 16900, descuento: 0, opcion: null, alta: 28,
    ops: unico(5), colores: [],
    img: 'images/p-aceite-facial.webp', alt: 'Frasco gotero de vidrio con aceite dorado apoyado sobre una piedra',
    desc: 'Mezcla de aceites vegetales para pieles secas o con tirantez. Frasco gotero de 30 ml.',
    uso: 'Dos o tres gotas a la noche, entibiadas entre las manos y aplicadas con un masaje suave.', tags: ['aceite', 'facial', 'nutritivo', 'piel seca', 'oil'] },
  { id: 'eau-de-toilette', nombre: 'Eau de toilette cítrica 50 ml', cat: 'perfumes', sub: 'edt', precio: 27900, descuento: 0, opcion: null, alta: 27,
    ops: unico(8), colores: [],
    img: 'images/p-eau-de-toilette.webp', alt: 'Frasco de perfume esmerilado con tapa plateada sobre un fondo color arena',
    desc: 'Bergamota, flor de azahar y té blanco. Fresca y liviana para usar de día.',
    uso: 'Rociá sobre la piel limpia y volvé a aplicar a media tarde si querés renovarla.', tags: ['perfume', 'eau de toilette', 'citrico', 'fresco', 'fragancia'] },
  { id: 'trio-piel', nombre: 'Trío de piel: base, corrector y polvo', cat: 'maquillaje', sub: 'rostro', precio: 34900, descuento: 0, opcion: 'Tono', alta: 26,
    ops: tonos([['Claro', '#E8C6AC', 3], ['Medio', '#D0A381', 4], ['Trigueño', '#A97A59', 2]]), colores: ['Nude', 'Marrón'],
    img: 'images/p-trio-piel.webp', alt: 'Base líquida, corrector en barra y polvo compacto en tonos piel sobre fondo durazno',
    desc: 'Los tres pasos de la piel en el mismo tono: base fluida, corrector de alta cobertura y polvo compacto para sellar.',
    uso: 'Primero la base, después el corrector solo donde haga falta y, para terminar, el polvo en la zona T.', tags: ['corrector', 'base', 'polvo compacto', 'kit', 'set', 'piel'] },
  { id: 'collar-corazon', nombre: 'Collar con dije corazón', cat: 'bijou', sub: 'collares', precio: 13500, descuento: 0, opcion: null, alta: 25,
    ops: unico(6), colores: ['Dorado'],
    img: 'images/p-collar-corazon.webp', alt: 'Collar de cadena fina dorada con un dije de corazón calado sobre tela blanca',
    desc: 'Cadena fina con baño dorado y un dije de corazón calado. Largo de 45 cm con alargue.',
    uso: 'Sacátelo para bañarte o ir a la pileta, así el baño dorado dura más.', tags: ['collar', 'corazon', 'dije', 'cadena', 'dorado', 'bijou'] },
  { id: 'body-mist', nombre: 'Body mist vainilla y coco 200 ml', cat: 'perfumes', sub: 'mist', precio: 13900, descuento: 20, opcion: null, alta: 24,
    ops: unico(12), colores: [],
    img: 'images/p-body-mist.webp', alt: 'Frasco de bruma corporal con atomizador sobre un pedestal claro',
    desc: 'Bruma corporal liviana para refrescarte durante el día. Se puede usar sobre la piel y el pelo.',
    uso: 'Rociala sobre el cuerpo después de bañarte o cada vez que quieras renovar el aroma.', tags: ['body mist', 'splash', 'bruma', 'vainilla', 'coco', 'perfume'] },
  { id: 'iluminador', nombre: 'Iluminador compacto rosado', cat: 'maquillaje', sub: 'rostro', precio: 13900, descuento: 0, opcion: null, alta: 23,
    ops: unico(9), colores: ['Rosado'],
    img: 'images/p-iluminador.webp', alt: 'Iluminador compacto rosado con relieve en estuche negro junto a un labial',
    desc: 'Polvo prensado con brillo fino rosado. Ilumina sin marcar textura.',
    uso: 'Con un pincel chico, en lo alto de los pómulos, el puente de la nariz y el arco de la ceja.', tags: ['iluminador', 'highlighter', 'glow', 'brillo', 'rostro'] },
  { id: 'protector-solar', nombre: 'Protector solar facial FPS 50', cat: 'skincare', sub: 'proteccion', precio: 18500, descuento: 0, opcion: null, alta: 22,
    ops: unico(3), colores: [],
    img: 'images/p-protector-solar.webp', alt: 'Envase blanco de protector solar sobre un fondo color durazno',
    desc: 'Textura fluida de rápida absorción que no deja la cara blanca. Se puede usar debajo del maquillaje. 50 ml.',
    uso: 'Último paso de tu rutina de día. Renovalo cada dos horas si estás al sol.', tags: ['protector', 'solar', 'fps', 'spf', 'sol', 'proteccion'] },
  { id: 'perfume-rollon', nombre: 'Perfume en aceite roll-on 10 ml', cat: 'perfumes', sub: 'aceites', precio: 9900, descuento: 0, opcion: 'Aroma', alta: 21,
    ops: simples([['Ámbar', 5], ['Rosa', 4], ['Vainilla', 0]]), colores: [],
    img: 'images/p-perfume-rollon.webp', alt: 'Dos frascos chicos de perfume en aceite con tapa dorada sobre un pedestal blanco',
    desc: 'Perfume concentrado en aceite, sin alcohol. Entra en cualquier cartera.',
    uso: 'Pasalo por las muñecas y el cuello. Al ser en aceite, con poco alcanza para todo el día.', tags: ['perfume', 'aceite', 'roll on', 'arabe', 'ambar', 'rosa', 'vainilla'] },
  { id: 'anillos-plata', nombre: 'Set de anillos abiertos plateados', cat: 'bijou', sub: 'anillos', precio: 14900, descuento: 0, opcion: 'Talle', alta: 20,
    ops: simples([['14', 4], ['16', 6], ['18', 2]]), colores: ['Plateado'],
    img: 'images/p-anillos-plata.webp', alt: 'Anillos plateados de distintos diseños sobre un fondo rosado viejo',
    desc: 'Tres anillos abiertos de acero en terminación lisa, martillada y trenzada. Se ajustan un poco al dedo.',
    uso: 'Si estás entre dos talles, elegí el más grande: al ser abiertos se pueden cerrar un poco.', tags: ['anillos', 'set', 'plateados', 'acero', 'bijou'] },
  { id: 'polvo-suelto', nombre: 'Polvo suelto translúcido', cat: 'maquillaje', sub: 'rostro', precio: 14500, descuento: 10, opcion: null, alta: 16,
    ops: unico(10), colores: [],
    img: 'images/p-polvo-suelto.webp', alt: 'Polvo suelto translúcido en un recipiente de vidrio junto a un frasco de base',
    desc: 'Sella la base y controla el brillo sin agregar color. Pote con tamiz para dosificar.',
    uso: 'Con una borla o un pincel grande, presioná sobre la zona T y retirá el exceso.', tags: ['polvo', 'sellador', 'translucido', 'rostro', 'matificante'] },
  { id: 'set-pinceles', nombre: 'Set de 3 pinceles para rostro', cat: 'maquillaje', sub: 'pinceles', precio: 18900, descuento: 0, opcion: null, alta: 15,
    ops: unico(6), colores: [],
    img: 'images/p-pinceles.webp', alt: 'Tres pinceles de maquillaje con mango nude y virola dorada junto a un pote de polvo',
    desc: 'Pincel angular para contorno, plano para base y uno chico para corrector. Cerdas sintéticas suaves.',
    uso: 'Lavalos una vez por semana con agua tibia y jabón neutro, y dejalos secar acostados.', tags: ['pinceles', 'brochas', 'kabuki', 'set', 'maquillaje'] },
  { id: 'gel-limpiador', nombre: 'Gel limpiador facial', cat: 'skincare', sub: 'limpieza', precio: 12500, descuento: 0, opcion: null, alta: 14,
    ops: unico(14), colores: [],
    img: 'images/p-gel-limpiador.webp', alt: 'Pomo de gel limpiador color crema sobre mármol con una tela de fondo',
    desc: 'Limpia sin resecar y saca el maquillaje liviano. Pomo de 150 ml.',
    uso: 'A la mañana y a la noche, sobre la piel húmeda. Masajeá un minuto y enjuagá con agua tibia.', tags: ['limpiador', 'gel', 'desmaquillante', 'limpieza', 'rostro'] },
  { id: 'aros-argolla', nombre: 'Aros argolla dorados lisos', cat: 'bijou', sub: 'aros', precio: 8900, descuento: 0, opcion: null, alta: 13,
    ops: unico(18), colores: ['Dorado'],
    img: 'images/p-aros-argolla.webp', alt: 'Par de aros argolla dorados lisos sobre un bloque blanco',
    desc: 'Argollas chicas y gruesas de acero con baño dorado. Las de todos los días.',
    uso: 'Limpialos con un paño seco después de usarlos.', tags: ['aros', 'argollas', 'dorados', 'lisos', 'bijou'] },
  { id: 'collar-strass', nombre: 'Collar fino con dije de strass', cat: 'bijou', sub: 'collares', precio: 11900, descuento: 0, opcion: null, alta: 12,
    ops: unico(0), colores: ['Dorado'],
    img: 'images/p-collar-dije.webp', alt: 'Collar de cadena fina dorada con un dije chico de strass sobre un fondo rosado',
    desc: 'Cadena muy fina con baño dorado y un dije chico de strass. Largo de 42 cm.',
    uso: 'Ideal para combinar con otros collares de distinto largo.', tags: ['collar', 'strass', 'dije', 'cadena', 'dorado', 'bijou'] },
  { id: 'borrador-gloss', nombre: 'Gloss labial (borrador)', cat: 'maquillaje', sub: 'ojoslabios', precio: 1, descuento: 0, opcion: null, alta: 0, visible: false,
    ops: unico(0), colores: [], img: 'images/p-labial.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = p => catDe(p.cat)?.subs?.[p.sub] || '';

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.sub && p.sub !== f.sub) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (colores.length && !(p.colores || []).some(c => colores.includes(c))) return false;
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
      p.nombre, catDe(p.cat)?.nombre, subDe(p), p.desc, ...(p.colores || []), ...(p.opcion ? p.ops.map(o => o.v) : []), ...(p.tags || []),
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
const varTexto = (p, v) => (!p.opcion || v === 'Único' ? '' : `${p.opcion.toLowerCase()} ${v}`);
const tituloEleccion = p => (p.opcion === 'Talle' ? 'Elegí tu talle' : p.opcion === 'Aroma' ? 'Elegí el aroma' : 'Elegí tu tono');

const Cart = {
  KEY: 'jym_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  gota: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7c3.3 4 5.5 7.3 5.5 10.3a5.5 5.5 0 0 1-11 0c0-3 2.2-6.3 5.5-10.3Z"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  const conColor = p.ops.filter(o => o.sw);
  if (!conColor.length) return '';
  return `<span class="swatches" aria-hidden="true">${conColor.map(o => `<i style="--sw:${o.sw}"${o.stock > 0 ? '' : ' class="agotado"'}></i>`).join('')}</span>`;
}
function varResumen(p) {
  if (!p.opcion) return '';
  const n = p.ops.length;
  if (p.opcion === 'Tono') return `<p class="pcard__var">${swatchesHTML(p)}<span>${n} tonos</span></p>`;
  if (p.opcion === 'Talle') return `<p class="pcard__var"><span>Talles ${p.ops.map(o => (o.stock > 0 ? esc(o.v) : `<del>${esc(o.v)}</del>`)).join(' · ')}</span></p>`;
  return `<p class="pcard__var"><span>${n} aromas</span></p>`;
}

function cardHTML(p, { anim = true, clase = '', paso = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  let badge = '';
  if (sinStock) badge = '<span class="pcard__badge pcard__badge--sin">Sin stock</span>';
  else if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (stockTotal(p) <= 4) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${paso ? `<span class="pcard__paso">${esc(paso)}</span>` : esc(subDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${varResumen(p)}
    ${precioHTML(p, 'pcard__precio')}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.bolsa}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
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

function initMenuTienda(catActual = '', subActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const actual = c.id === catActual && !subActual;
      return `<li class="nav-drop__col">
      <a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${actual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="52" height="52"><span>${esc(c.nombre)}</span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a>
      <ul class="nav-drop__subs">${Object.entries(c.subs).map(([k, v]) => `<li><a href="${URL_CATALOGO}?cat=${c.id}&amp;sub=${k}"${c.id === catActual && k === subActual ? ' aria-current="page"' : ''}>${esc(v)} <small>${Tienda.contar({ cat: c.id, sub: k })}</small></a></li>`).join('')}</ul>
    </li>`;
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
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = String(Tienda.contar({})); });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.innerHTML = `<b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s>` : ''}`;
  });
}

function idsDestacados() {
  return Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items.map(p => p.id);
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { excluir: idsDestacados() }, orden: 'nuevos', limite: 8 });
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

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

const GUIA = [
  { id: 'piel', nombre: 'Piel lista', tip: 'Elegí la base por tono. Si dudás entre dos, mandanos una foto con luz natural y te ayudamos.', ids: ['base-liquida', 'trio-piel', 'polvo-suelto', 'iluminador'], link: 'cat=maquillaje&sub=rostro', linkTxt: 'Ver todo rostro' },
  { id: 'ojos', nombre: 'Ojos y labios', tip: 'La paleta Nude combina con los cuatro tonos del labial cremoso: del nude rosado al rojo clásico.', ids: ['labial-cremoso', 'paleta-nude', 'mascara-volumen', 'set-pinceles'], link: 'cat=maquillaje&sub=ojoslabios', linkTxt: 'Ver ojos y labios' },
  { id: 'rutina', nombre: 'Rutina de skincare', tip: 'El orden importa: limpiá, aplicá el sérum, hidratá y, de día, terminá con protector.', ids: ['gel-limpiador', 'serum-hialuronico', 'crema-hidratante', 'protector-solar'], pasos: ['Limpiar', 'Tratar', 'Hidratar', 'Proteger'], link: 'cat=skincare', linkTxt: 'Ver todo skincare' },
  { id: 'perfumes', nombre: 'Perfumes', tip: 'El eau de parfum dura más en la piel; el body mist es para refrescarte durante el día.', ids: ['perfume-edp', 'eau-de-toilette', 'body-mist', 'perfume-rollon'], link: 'cat=perfumes', linkTxt: 'Ver todos los perfumes' },
  { id: 'bijou', nombre: 'Bijou', tip: 'Acero con baño dorado o plateado, liviano para usar todo el día y combinar entre sí.', ids: ['aros-trenzados', 'pulsera-dorada', 'collar-corazon', 'anillos-plata'], link: 'cat=bijou', linkTxt: 'Ver toda la bijouterie' },
];
function initGuia() {
  const box = document.querySelector('[data-guia]');
  if (!box) return;
  const tabs = box.querySelector('[data-guia-tabs]');
  const tip = box.querySelector('[data-guia-tip]');
  const grid = box.querySelector('[data-guia-grid]');
  const link = box.querySelector('[data-guia-link]');
  const panel = box.querySelector('[role="tabpanel"]');
  if (!tabs || !grid) return;
  tabs.innerHTML = GUIA.map((g, i) => `<button type="button" role="tab" class="guia__tab" id="guia-tab-${g.id}" data-guia-id="${g.id}" aria-selected="${i === 0}" aria-controls="guiaPanel" tabindex="${i === 0 ? 0 : -1}">${esc(g.nombre)}</button>`).join('');
  const pintar = (g, primera) => {
    const { items } = Tienda.consultar({ filtros: { ids: g.ids }, orden: 'destacados', limite: g.ids.length });
    items.sort((a, b) => g.ids.indexOf(a.id) - g.ids.indexOf(b.id));
    items.forEach(cachear);
    grid.innerHTML = items.map((p, i) => cardHTML(p, { paso: g.pasos ? `Paso ${i + 1} · ${g.pasos[i]}` : '' })).join('');
    if (tip) tip.textContent = g.tip;
    if (link) { link.href = `${URL_CATALOGO}?${g.link}`; link.querySelector('span').textContent = g.linkTxt; }
    panel?.setAttribute('aria-labelledby', `guia-tab-${g.id}`);
    if (!primera) { revelarNuevos(grid); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
  };
  const elegir = (btn, foco) => {
    tabs.querySelectorAll('[role="tab"]').forEach(b => { const on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    if (foco) btn.focus();
    pintar(GUIA.find(g => g.id === btn.dataset.guiaId), false);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[role="tab"]'); if (b && b.getAttribute('aria-selected') !== 'true') elegir(b, false); });
  tabs.addEventListener('keydown', e => {
    const lista = [...tabs.querySelectorAll('[role="tab"]')];
    const i = lista.indexOf(document.activeElement);
    if (i < 0) return;
    let j = -1;
    if (e.key === 'ArrowRight') j = (i + 1) % lista.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + lista.length) % lista.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = lista.length - 1;
    if (j < 0) return;
    e.preventDefault();
    elegir(lista[j], true);
  });
  pintar(GUIA[0], true);
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
  pk.setAttribute('aria-label', `${tituloEleccion(p)}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tituloEleccion(p))}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op${o.sw ? ' picker__op--tono' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(p.opcion)} ${esc(o.v)}${o.stock > 0 ? '' : ', sin stock'}">${o.sw ? `<i style="--sw:${o.sw}"></i>` : ''}${esc(o.v)}</button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  (pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(p.opcion ? `Ese ${p.opcion.toLowerCase()} no tiene stock por ahora.` : 'Sin stock por ahora.'); return; }
  if (comprar) { abrirCarrito(); return; }
  const detalle = varTexto(p, v);
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

const qvEstado = { p: null, v: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  qvEstado.v = p.ops.length === 1 ? p.ops[0].v : (p.ops.find(o => o.stock > 0)?.v || '');
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, category: catDe(p.cat)?.nombre,
    brand: { '@type': 'Brand', name: 'JyM' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, sub: p.sub, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  const extra = rel.length < 3 ? Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)], stock: true }, orden: 'destacados', limite: 3 - rel.length }).items : [];
  const relacionados = [...rel, ...extra];
  relacionados.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const op = p.ops.find(o => o.v === qvEstado.v);
  const nombreOp = (p.opcion || '').toLowerCase();
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí un ${nombreOp} para ver la disponibilidad` : op.stock <= 0 ? `Sin stock en ${op.v}` : op.stock <= 3 ? `Quedan ${op.stock}${p.opcion ? ` en ${op.v}` : ''}` : p.opcion ? `${op.v}: en stock` : 'En stock';
  const selector = p.opcion
    ? `<div class="qv__var"><p class="qv__var-tit">${esc(p.opcion)}${qvEstado.v ? `: <b>${esc(qvEstado.v)}</b>` : ''}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(p.opcion)}">${p.ops.map(o => `<button type="button" class="qv__op${o.sw ? ' qv__op--tono' : ''}" role="radio" aria-checked="${o.v === qvEstado.v}" data-qv-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${o.sw ? `<i style="--sw:${o.sw}"></i>` : ''}${esc(o.v)}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>${esc(tituloEleccion(p))} para sumarlo al carrito.</p></div>`
    : '';
  const sinVar = !!p.opcion && (!op || op.stock <= 0);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(subDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio')}
      ${selector}
      <p class="qv__stock${sinStock || sinVar ? ' qv__stock--sin' : ''}">${sinStock || sinVar ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.bolsa}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${p.uso ? `<details class="qv__det"><summary>${ICO.gota}Cómo se usa</summary><p>${esc(p.uso)}</p></details>` : ''}
      <a class="qv__wsp" href="${wspLink(`Hola JyM! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : p.opcion === 'Tono' ? '¿Dudas con el tono? Preguntanos por WhatsApp' : '¿Tenés dudas? Preguntanos por WhatsApp'}</span></a>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
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
      qvEstado.qty = Math.min(qvEstado.qty, stockDe(p, qvEstado.v) || 1);
      pintarQV();
      qv.querySelector(`[data-qv-op="${CSS.escape(qvEstado.v)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = stockDe(p, qvEstado.v) || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.v || !(stockDe(p, qvEstado.v) > 0)) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { const n = Cart.add(p, qvEstado.qty, qvEstado.v); if (!n) { showToast('Sin stock por ahora.'); return; } cerrarQV(); abrirCarrito(); return; }
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
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.bolsa}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí tu tono favorito y sumalo acá. El carrito queda guardado aunque cierres la página.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const d = varTexto(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${d ? esc(d.charAt(0).toUpperCase() + d.slice(1)) + ' · ' : ''}${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const d = varTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${d ? ` (${d})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola JyM! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
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
  if (!grid) return { cat: '', sub: '' };
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    sub: '',
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  if (estado.cat) estado.sub = valido(PARAMS.get('sub'), catIds[estado.cat].subs);
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const subsBox = document.querySelector('[data-subs]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la tienda')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.sub && sin !== 'cat' && sin !== 'sub') f.sub = estado.sub;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarSubs = () => {
    if (!subsBox) return;
    const cat = catIds[estado.cat];
    subsBox.hidden = !cat;
    if (!cat) { subsBox.innerHTML = ''; return; }
    subsBox.innerHTML = [['', `Todo ${cat.nombre.toLowerCase()}`], ...Object.entries(cat.subs)].map(([k, v]) => `<button type="button" class="chip chip--sub" data-filtro="sub" data-valor="${k}" aria-pressed="${estado.sub === k}">${esc(v)}</button>`).join('');
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarSubs();
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    const enPanel = estado.colores.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    let titulo = cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Novedades' : 'Toda la tienda';
    if (cat && estado.sub) titulo = cat.subs[estado.sub];
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Maquillaje, skincare, perfumes y bijouterie. Filtrá por categoría, tono o precio y sumá al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !estado.ofertas && estado.orden !== 'nuevos'; miga.textContent = titulo; }
    document.title = `${titulo} — JyM`;
    document.querySelectorAll('.nav-drop__cat, .nav-drop__subs a').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = u.searchParams.get('cat') === estado.cat && (u.searchParams.get('sub') || '') === estado.sub;
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.sub) u.searchParams.set('sub', estado.sub);
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
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
    estado.cat = ''; estado.sub = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f="color"]');
    if (multi) {
      if (multi.checked) estado.colores.add(multi.value); else estado.colores.delete(multi.value);
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
      const f = b.dataset.filtro;
      estado[f] = b.dataset.valor || '';
      if (f === 'cat') estado.sub = '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'color') estado.colores.delete(quitar.dataset.valor);
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
  if (filtros && getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, sub: estado.sub };
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const listo = () => requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero--listo')));
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('hero--listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onStart: listo });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-chip, .hero-sello', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const recorrido = parseFloat(el.dataset.parallax) || 40;
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${((self.progress - 0.5) * recorrido).toFixed(1)}px`; },
    });
  });
}

initModelBarScroll();
initNav();
initCuentas();
initRail();
initVistaPrevia();
initGuia();
const actual = initCatalogo();
initMenuTienda(actual.cat, actual.sub);
initTarjetas();
initQV();
initCarrito();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initReveals();
initHeroMotion();
initParallax();
