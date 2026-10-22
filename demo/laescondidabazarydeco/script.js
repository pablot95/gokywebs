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

const MARCA = 'La Escondida';
const WSP = '5493329678818';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'bazar', nombre: 'Bazar', lema: 'Objetos que acompañan', bajada: 'Vajilla de gres, vasos y jarras de vidrio acanalado, juegos de té y frascos para la alacena.', img: 'images/p-jarra-vasos.webp' },
  { id: 'deco', nombre: 'Deco', lema: 'Espacios con personalidad', bajada: 'Almohadones, canastos de fibra natural, floreros de cerámica y velas para cada rincón de la casa.', img: 'images/cat-deco.webp' },
  { id: 'blanqueria', nombre: 'Blanquería', lema: 'Confort en tu hogar', bajada: 'Sábanas, acolchados, mantas, toallas y mantelería de algodón y lino, con la medida de cada pieza a la vista.', img: 'images/p-toallas-algodon.webp' },
];
const AMBIENTES = { mesa: 'Mesa', cocina: 'Cocina', living: 'Living', dormitorio: 'Dormitorio', bano: 'Baño' };
const COLORES = { Blanco: '#FFFFFF', Crema: '#EDE4D3', Arena: '#D8C3A2', Salvia: '#93A889', Natural: '#B98E5E', Transparente: '#DDE7E6' };
const TIPOS = {
  medida: { nombre: 'Medida', elegir: 'Elegí la medida', plural: 'medidas' },
  color: { nombre: 'Color', elegir: 'Elegí el color', plural: 'colores' },
  capacidad: { nombre: 'Capacidad', elegir: 'Elegí la capacidad', plural: 'capacidades' },
  presentacion: { nombre: 'Presentación', elegir: 'Elegí la presentación', plural: 'presentaciones' },
  tamano: { nombre: 'Tamaño', elegir: 'Elegí el tamaño', plural: 'tamaños' },
};
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 20000 },
  '20a45': { nombre: '$20.000 a $45.000', min: 20001, max: 45000 },
  mas45: { nombre: 'Más de $45.000', min: 45001 },
};
const ORDENES = { destacados: 'Más elegidos', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const COLCHONES = [
  ['1 plaza', '80 × 190 cm'],
  ['1½ plaza', '90 × 190 cm'],
  ['2 plazas', '140 × 190 cm'],
  ['Queen', '160 × 200 cm'],
  ['King', '180 × 200 cm'],
];

const PRODUCTOS = [
  { id: 'vajilla-acanalada', nombre: 'Juego de vajilla de gres acanalado', cat: 'bazar', amb: ['mesa'], tipo: 'presentacion', precio: 64900, descuento: 0, colores: ['Crema'], rango: 1, alta: 6,
    ops: [{ v: '4 personas', c: 'x4', det: '12 piezas', precio: 64900, stock: 5 }, { v: '6 personas', c: 'x6', det: '18 piezas', precio: 92900, stock: 3 }],
    img: 'images/p-vajilla-acanalada.webp', alt: 'Plato playo, plato de postre y bowl de gres crema con relieve acanalado, junto a una servilleta verde',
    desc: 'Plato playo, plato de postre y bowl por persona, en gres esmaltado crema con relieve acanalado. Se apilan sin ocupar lugar en la alacena.', tags: ['vajilla', 'platos', 'plato', 'bowl', 'gres', 'ceramica', 'acanalado', 'mesa'] },
  { id: 'sabanas-algodon', nombre: 'Juego de sábanas de algodón 180 hilos', cat: 'blanqueria', amb: ['dormitorio'], tipo: 'medida', precio: 42900, descuento: 0, colores: ['Blanco'], rango: 2, alta: 8,
    ops: [{ v: '1 plaza', c: '1 pl', det: '80 × 190 cm', precio: 42900, stock: 6 }, { v: '1½ plaza', c: '1½', det: '90 × 190 cm', precio: 47900, stock: 5 }, { v: '2 plazas', c: '2 pl', det: '140 × 190 cm', precio: 56900, stock: 7 }, { v: 'Queen', c: 'Queen', det: '160 × 200 cm', precio: 64900, stock: 3 }, { v: 'King', c: 'King', det: '180 × 200 cm', precio: 71900, stock: 0 }],
    img: 'images/p-sabanas-algodon.webp', alt: 'Juego de sábanas blancas de algodón dobladas sobre una cama, con fundas verde salvia y una manta waffle',
    desc: 'Sábana ajustable, sábana plana y dos fundas de almohada en algodón 180 hilos con vainilla al tono. La ajustable cubre colchones de hasta 30 cm de alto.', tags: ['sabanas', 'sabana', 'juego de sabanas', 'algodon', 'cama', 'blanco', 'ajustable'] },
  { id: 'jarra-vasos', nombre: 'Set jarra y 6 vasos acanalados', cat: 'bazar', amb: ['mesa'], tipo: 'presentacion', precio: 46900, descuento: 0, colores: ['Transparente'], rango: 3, alta: 9,
    ops: [{ v: 'Set', det: 'Jarra de 1,5 L y 6 vasos de 300 ml', precio: 46900, stock: 4 }],
    img: 'images/p-jarra-vasos.webp', alt: 'Jarra de vidrio acanalado con asa y seis vasos al tono sobre una mesada de mármol claro',
    desc: 'Jarra de vidrio acanalado de 1,5 litros con seis vasos de 300 ml al tono. Para el agua de la mesa o una limonada en el patio.', tags: ['jarra', 'vasos', 'vaso', 'vidrio', 'acanalado', 'set', 'mesa', 'agua'] },
  { id: 'toallas-algodon', nombre: 'Juego de toalla y toallón de algodón', cat: 'blanqueria', amb: ['bano'], tipo: 'color', precio: 29900, descuento: 0, colores: ['Crema', 'Salvia'], rango: 4, alta: 7,
    ops: [{ v: 'Crema', det: 'Toalla 50 × 90 cm y toallón 70 × 140 cm', precio: 29900, stock: 8 }, { v: 'Salvia', det: 'Toalla 50 × 90 cm y toallón 70 × 140 cm', precio: 29900, stock: 6 }],
    img: 'images/p-toallas-algodon.webp', alt: 'Toallas y toallones de algodón crema y verde salvia apilados y atados con una cinta',
    desc: 'Toalla y toallón de rizo de algodón de 500 g/m², con guarda tejida. Suaves desde el primer lavado.', tags: ['toalla', 'toallon', 'toallas', 'baño', 'algodon', 'rizo'] },
  { id: 'almohadon-texturado', nombre: 'Funda de almohadón texturada 45 × 45', cat: 'deco', amb: ['living', 'dormitorio'], tipo: 'color', precio: 15900, descuento: 0, colores: ['Arena', 'Salvia'], rango: 5, alta: 10,
    ops: [{ v: 'Arena', det: '45 × 45 cm', precio: 15900, stock: 8 }, { v: 'Salvia', det: '45 × 45 cm', precio: 15900, stock: 6 }],
    img: 'images/p-almohadon-texturado.webp', alt: 'Dos almohadones de tela texturada, uno arena y otro verde salvia, con una manta tejida con flecos',
    desc: 'Funda de tela con trama gruesa y cierre oculto. Combinala en arena y salvia sobre el sillón o la cama.', tags: ['almohadon', 'almohadones', 'funda', 'cojin', 'living', 'sillon', 'textura'] },
  { id: 'frascos-bambu', nombre: 'Frasco hermético con tapa de bambú', cat: 'bazar', amb: ['cocina'], tipo: 'capacidad', precio: 8900, descuento: 0, colores: ['Transparente', 'Natural'], rango: 6, alta: 11,
    ops: [{ v: '600 ml', det: 'Ideal para especias o arroz', precio: 8900, stock: 12 }, { v: '1 L', det: 'Para avena, legumbres o azúcar', precio: 11900, stock: 9 }, { v: '1,6 L', det: 'Para fideos o harina', precio: 14900, stock: 0 }, { v: 'Set de 3', det: 'Un frasco de cada medida', precio: 32900, stock: 4 }],
    img: 'images/p-frascos-bambu.webp', alt: 'Tres frascos de vidrio con tapa de bambú llenos de fideos, arroz y avena sobre una mesada',
    desc: 'Vidrio grueso con tapa de bambú y burlete de silicona que cierra hermético. Se ve qué queda y la alacena queda ordenada.', tags: ['frasco', 'frascos', 'hermetico', 'bambu', 'vidrio', 'cocina', 'alacena', 'guardado'] },
  { id: 'canastos-jacinto', nombre: 'Canastos de jacinto de agua', cat: 'deco', amb: ['living', 'bano', 'dormitorio'], tipo: 'presentacion', precio: 28900, descuento: 0, colores: ['Natural'], rango: 7, alta: 5,
    ops: [{ v: 'Con tapa', det: '40 cm de alto', precio: 39900, stock: 3 }, { v: 'Cesto', det: '30 cm de alto, con asas', precio: 28900, stock: 4 }, { v: 'Set de 2', det: 'Con tapa y cesto', precio: 62900, stock: 2 }],
    img: 'images/p-canastos-jacinto.webp', alt: 'Canasto tejido de jacinto de agua con tapa y cesto con asas, junto a un bowl de cerámica',
    desc: 'Tejidos a mano en fibra de jacinto de agua. Para mantas en el living, toallas en el baño o juguetes en el dormitorio.', tags: ['canasto', 'canastos', 'cesto', 'fibra natural', 'jacinto', 'guardado', 'organizador'] },
  { id: 'juego-te', nombre: 'Juego de té de gres: tetera y 2 tazas', cat: 'bazar', amb: ['mesa'], tipo: 'presentacion', precio: 54900, descuento: 0, colores: ['Crema'], rango: 8, alta: 4,
    ops: [{ v: 'Juego', det: 'Tetera de 1 L y 2 tazas con plato', precio: 54900, stock: 2 }],
    img: 'images/p-juego-te.webp', alt: 'Tetera redonda de gres crema y dos tazas con plato sobre una mesa de madera',
    desc: 'Tetera de un litro con tapa y dos tazas de 250 ml con su plato, en gres crema de borde tostado.', tags: ['te', 'tetera', 'tazas', 'taza', 'gres', 'desayuno', 'merienda'] },
  { id: 'vasos-acanalados', nombre: 'Vasos de vidrio acanalado x6', cat: 'bazar', amb: ['mesa'], tipo: 'presentacion', precio: 27900, descuento: 10, colores: ['Transparente'], alta: 3,
    ops: [{ v: 'x6', det: '6 vasos de 300 ml', precio: 27900, stock: 7 }],
    img: 'images/p-vasos-acanalados.webp', alt: 'Seis vasos bajos de vidrio acanalado sobre una mesada de mármol claro',
    desc: 'Vasos bajos de vidrio acanalado de 300 ml. Combinan con la jarra del set.', tags: ['vasos', 'vaso', 'vidrio', 'acanalado', 'mesa'] },
  { id: 'taza-te', nombre: 'Taza de té con plato', cat: 'bazar', amb: ['mesa'], tipo: 'presentacion', precio: 13900, descuento: 0, colores: ['Crema'], alta: 2,
    ops: [{ v: 'Unidad', det: '250 ml', precio: 13900, stock: 8 }, { v: 'Par', det: '2 tazas con plato', precio: 25900, stock: 5 }],
    img: 'images/p-taza-te.webp', alt: 'Taza de gres crema con su plato sobre una mesa de madera clara',
    desc: 'Taza de gres crema de 250 ml con plato al tono. Sumala al juego de té si en casa son más.', tags: ['taza', 'tazas', 'te', 'cafe', 'gres', 'plato'] },
  { id: 'bowls-acanalados', nombre: 'Bowls de gres acanalado', cat: 'bazar', amb: ['mesa', 'cocina'], tipo: 'presentacion', precio: 18900, descuento: 0, colores: ['Crema'], alta: 1,
    ops: [{ v: 'Par', c: 'x2', det: '15 cm de diámetro', precio: 18900, stock: 6 }, { v: 'Set de 4', c: 'x4', det: '15 cm de diámetro', precio: 34900, stock: 4 }],
    img: 'images/p-bowls-acanalados.webp', alt: 'Bowls de gres crema acanalados apilados sobre platos al tono',
    desc: 'Bowl de 15 cm de diámetro y 7 cm de alto para cereales, sopas o ensaladas. Del mismo gres que el juego de vajilla.', tags: ['bowl', 'bowls', 'cuenco', 'gres', 'acanalado', 'cocina'] },
  { id: 'tazones-artesanales', nombre: 'Tazón de cerámica artesanal', cat: 'bazar', amb: ['mesa', 'cocina'], tipo: 'presentacion', precio: 11900, descuento: 0, colores: ['Crema', 'Arena'], alta: 13,
    ops: [{ v: 'Unidad', det: '350 ml', precio: 11900, stock: 10 }, { v: 'Set de 4', det: 'En tonos crema y arena', precio: 42900, stock: 3 }],
    img: 'images/p-tazones-gres.webp', alt: 'Tazones y bowls de cerámica artesanal en tonos crema sobre una mesa de madera',
    desc: 'Tazón sin asa de cerámica hecha a mano: cada pieza tiene su variación de tono. Para el café con leche o un helado.', tags: ['tazon', 'taza', 'mug', 'ceramica', 'artesanal', 'cafe'] },
  { id: 'almohadon-rayas', nombre: 'Almohadón rectangular a rayas', cat: 'deco', amb: ['living'], tipo: 'presentacion', precio: 21900, descuento: 0, colores: ['Crema', 'Salvia'], alta: 6,
    ops: [{ v: 'Con relleno', det: '30 × 50 cm, relleno de vellón', precio: 21900, stock: 5 }],
    img: 'images/p-almohadon-rayas.webp', alt: 'Almohadón rectangular crema con rayas verde salvia delante de un almohadón verde',
    desc: 'Almohadón lumbar de tela crema con rayas verde salvia, con relleno de vellón siliconado. Va bien delante de dos de 45 × 45.', tags: ['almohadon', 'rectangular', 'rayas', 'lumbar', 'living', 'sillon'] },
  { id: 'floreros-ceramica', nombre: 'Set de floreros de cerámica blanca x3', cat: 'deco', amb: ['living'], tipo: 'presentacion', precio: 36900, descuento: 0, colores: ['Blanco'], alta: 12,
    ops: [{ v: 'Set de 3', det: 'De 12, 22 y 30 cm de alto', precio: 36900, stock: 3 }],
    img: 'images/p-floreros-ceramica.webp', alt: 'Tres floreros de cerámica blanca de distintas alturas con ramitas secas, junto a una vela',
    desc: 'Tres floreros de cerámica blanca mate en distintas alturas. Lucen solos o con unas ramas secas.', tags: ['florero', 'floreros', 'jarron', 'ceramica', 'blanco', 'living'] },
  { id: 'jarron-asas', nombre: 'Jarrón de cerámica con asas', cat: 'deco', amb: ['living', 'mesa'], tipo: 'tamano', precio: 29900, descuento: 0, colores: ['Blanco'], alta: 7,
    ops: [{ v: 'Mediano', det: '25 cm de alto', precio: 29900, stock: 2 }, { v: 'Grande', det: '35 cm de alto', precio: 41900, stock: 1 }],
    img: 'images/p-jarron-asas.webp', alt: 'Jarrón de cerámica blanca con dos asas y un ramo de flores silvestres secas',
    desc: 'Jarrón de cerámica blanca esmaltada con dos asas, de estilo campo. Para flores secas o un ramo del jardín.', tags: ['jarron', 'florero', 'asas', 'ceramica', 'blanco', 'flores secas'] },
  { id: 'velas-burbuja', nombre: 'Vela burbuja de cera de soja', cat: 'deco', amb: ['living', 'dormitorio', 'bano'], tipo: 'color', precio: 9900, descuento: 0, colores: ['Blanco', 'Arena'], alta: 14,
    ops: [{ v: 'Blanco', det: '6 × 6 cm', precio: 9900, stock: 10 }, { v: 'Arena', det: '6 × 6 cm', precio: 9900, stock: 7 }],
    img: 'images/p-velas-burbuja.webp', alt: 'Velas con forma de cubo de burbujas en blanco y arena sobre una manta de piel sintética',
    desc: 'Vela de cera de soja con forma de cubo de burbujas. Decora apagada y, si la prendés, dura unas 15 horas.', tags: ['vela', 'velas', 'burbuja', 'soja', 'deco', 'regalo'] },
  { id: 'fundas-lino', nombre: 'Fundas de almohada de lino x2', cat: 'blanqueria', amb: ['dormitorio'], tipo: 'color', precio: 22900, descuento: 0, colores: ['Salvia', 'Blanco'], alta: 5,
    ops: [{ v: 'Salvia', det: '50 × 70 cm', precio: 22900, stock: 6 }, { v: 'Blanco', det: '50 × 70 cm', precio: 22900, stock: 4 }],
    img: 'images/p-fundas-lino.webp', alt: 'Almohadas con fundas de lino verde salvia sobre sábanas blancas',
    desc: 'Dos fundas de lino lavado con terminación de pestaña. Frescas en verano y cada vez más suaves con los lavados.', tags: ['fundas', 'funda', 'almohada', 'lino', 'salvia', 'cama'] },
  { id: 'manta-waffle', nombre: 'Manta waffle de algodón', cat: 'blanqueria', amb: ['dormitorio', 'living'], tipo: 'medida', precio: 45900, descuento: 15, colores: ['Crema'], alta: 8,
    ops: [{ v: '1½ plaza', c: '1½', det: '150 × 220 cm', precio: 45900, stock: 3 }, { v: '2 plazas', c: '2 pl', det: '220 × 240 cm', precio: 54900, stock: 2 }],
    img: 'images/p-manta-waffle.webp', alt: 'Manta crema de tejido waffle doblada sobre una cama',
    desc: 'Tejido waffle de algodón, liviano y abrigado a la vez. A los pies de la cama o sobre el sillón.', tags: ['manta', 'waffle', 'algodon', 'cama', 'pie de cama', 'crema'] },
  { id: 'acolchado-blanco', nombre: 'Acolchado de algodón blanco', cat: 'blanqueria', amb: ['dormitorio'], tipo: 'medida', precio: 69900, descuento: 0, colores: ['Blanco'], alta: 9,
    ops: [{ v: '1½ plaza', c: '1½', det: '160 × 240 cm', precio: 69900, stock: 2 }, { v: '2 plazas', c: '2 pl', det: '230 × 250 cm', precio: 84900, stock: 3 }, { v: 'Queen', c: 'Queen', det: '250 × 260 cm', precio: 94900, stock: 1 }],
    img: 'images/p-acolchado-blanco.webp', alt: 'Cama con acolchado y almohadas blancas de algodón',
    desc: 'Acolchado de percal de algodón con relleno de fibra siliconada, liviano para todo el año. Se lava en lavarropas.', tags: ['acolchado', 'edredon', 'cama', 'blanco', 'algodon', 'invierno'] },
  { id: 'pie-de-cama', nombre: 'Pie de cama tejido con flecos', cat: 'blanqueria', amb: ['dormitorio', 'living'], tipo: 'medida', precio: 38900, descuento: 0, colores: ['Arena'], alta: 4,
    ops: [{ v: 'Único', det: '130 × 170 cm', precio: 38900, stock: 4 }],
    img: 'images/p-pie-de-cama.webp', alt: 'Manta tejida en tono arena con flecos sobre una cama',
    desc: 'Manta tejida en hilado de algodón con flecos en los bordes. A los pies de la cama o sobre el respaldo del sillón.', tags: ['pie de cama', 'manta', 'tejida', 'flecos', 'arena', 'cama'] },
  { id: 'mantel-lino', nombre: 'Mantel de lino lavado con volado', cat: 'blanqueria', amb: ['mesa'], tipo: 'medida', precio: 39900, descuento: 0, colores: ['Crema'], alta: 10,
    ops: [{ v: 'Rectangular 150 × 200', c: '150×200', det: 'Mesa de 4 a 6', precio: 39900, stock: 3 }, { v: 'Rectangular 150 × 250', c: '150×250', det: 'Mesa de 6 a 8', precio: 46900, stock: 2 }, { v: 'Redondo de 180', c: 'Ø 180', det: 'Mesa redonda de 4', precio: 42900, stock: 2 }],
    img: 'images/p-mantel-lino.webp', alt: 'Mantel de lino lavado color crema con volado en el borde y una taza de té encima',
    desc: 'Lino lavado con volado en todo el borde. No hace falta plancharlo: el arrugado es parte del encanto.', tags: ['mantel', 'lino', 'mesa', 'volado', 'mantelería'] },
  { id: 'servilletas-lino', nombre: 'Servilletas de lino x4', cat: 'blanqueria', amb: ['mesa'], tipo: 'color', precio: 16900, descuento: 0, colores: ['Crema', 'Salvia'], alta: 11,
    ops: [{ v: 'Crema', det: '45 × 45 cm', precio: 16900, stock: 9 }, { v: 'Salvia', det: '45 × 45 cm', precio: 16900, stock: 5 }],
    img: 'images/p-servilletas-lino.webp', alt: 'Plato blanco con una servilleta de lino crema doblada y una ramita verde',
    desc: 'Cuatro servilletas de lino lavado con dobladillo. Combinan con el mantel y con la vajilla de gres.', tags: ['servilletas', 'servilleta', 'lino', 'mesa', 'mantelería'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const conDescuento = (p, n) => (p.descuento > 0 ? redondear(n * (1 - p.descuento / 100)) : n);
const opDe = (p, v) => p.ops.find(o => o.v === v);
const precioLista = (p, v) => opDe(p, v)?.precio ?? p.precio;
const precioOp = (p, v) => conDescuento(p, precioLista(p, v));
const precioDesde = p => Math.min(...p.ops.map(o => conDescuento(p, o.precio ?? p.precio)));
const variaPrecio = p => new Set(p.ops.map(o => o.precio ?? p.precio)).size > 1;
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const stockDe = (p, v) => opDe(p, v)?.stock || 0;
const unico = p => p.ops.length === 1;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const tipoDe = p => TIPOS[p.tipo] || TIPOS.presentacion;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), amb = lista(f.amb), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.excluirCat && p.cat === f.excluirCat) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (amb.length && !p.amb.some(a => amb.includes(a))) return false;
    if (colores.length && !p.colores.some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioDesde(p) < f.precioMin) return false;
    if (f.precioMax != null && precioDesde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
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
      p.nombre, catDe(p.cat)?.nombre, p.desc, ...p.colores, ...p.amb.map(a => AMBIENTES[a]), ...p.ops.filter(o => o.stock > 0).map(o => `${o.v} ${o.det || ''}`), ...(p.tags || []),
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
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 3 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

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
const varTexto = (p, v) => {
  const o = opDe(p, v);
  if (!o) return '';
  if (unico(p)) return o.det || '';
  if (p.tipo === 'color') return `Color ${o.v}`;
  return o.det ? `${o.v} · ${o.det}` : o.v;
};

const Cart = {
  KEY: 'laescondida_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v);
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
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p && opDe(p, i.v) ? s + precioOp(p, i.v) * i.qty : s; }, 0); },
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
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  compartir: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/></svg>',
  camion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  const desde = variaPrecio(p);
  const base = desde ? Math.min(...p.ops.map(o => o.precio ?? p.precio)) : p.precio;
  return `<p class="${clase}">${desde ? '<small>desde</small>' : ''}<b>${formatearPrecio(precioDesde(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  return `<span class="swatches" aria-label="Colores: ${esc(p.colores.join(', '))}">${p.colores.map(c => `<i style="--sw:${COLORES[c] || '#ccc'}" title="${esc(c)}"></i>`).join('')}</span>`;
}
function opsHTML(p) {
  if (unico(p)) return '';
  const items = p.ops.map(o => {
    const cls = o.stock > 0 ? (o.stock <= 1 ? 'es-ultimo' : '') : 'es-agotado';
    const txt = `${tipoDe(p).nombre} ${o.v}${o.det && p.tipo !== 'color' ? ` (${o.det})` : ''}${o.stock > 0 ? (o.stock <= 1 ? ', última unidad' : ', con stock') : ', sin stock'}`;
    const sw = p.tipo === 'color' ? `<i style="--sw:${COLORES[o.v] || '#ccc'}"></i>` : '';
    return `<li${cls ? ` class="${cls}"` : ''} aria-label="${esc(txt)}">${sw}${esc(o.c || o.v)}</li>`;
  }).join('');
  return `<ul class="ops" aria-label="${esc(tipoDe(p).nombre)}: opciones">${items}</ul>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 3) badge = '<span class="pcard__badge">Últimas unidades</span>';
  else if (p.alta >= 12) badge = '<span class="pcard__badge">Nuevo</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(catDe(p.cat)?.nombre)}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    ${opsHTML(p)}${unico(p) ? '' : `<p class="pcard__opsn">${p.ops.length} ${esc(tipoDe(p).plural)}</p>`}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === sel.cat ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="54" height="54"><span><span class="nav-drop__nombre">${esc(c.nombre)}</span><small>${n} ${n === 1 ? 'producto' : 'productos'} · ${esc(c.lema.toLowerCase())}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1101px)');
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
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const valor = el.dataset.cuenta;
    const n = Tienda.contar(valor === 'todo' ? {} : { cat: valor });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 18;
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

function initRubros() {
  document.querySelectorAll('[data-rubro]').forEach(cont => {
    const cat = cont.dataset.rubro;
    if (!catDe(cat)) return;
    const { items } = Tienda.consultar({ filtros: { cat, stock: true }, orden: 'destacados', limite: 3 });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => cardHTML(p)).join('');
  });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function pickerHTML(p) {
  const conDet = p.tipo !== 'color';
  const op = o => `<button type="button" class="picker__op${conDet ? ' picker__op--det' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(tipoDe(p).nombre)} ${esc(o.v)}${o.det ? `, ${esc(o.det)}` : ''}${variaPrecio(p) ? `, ${formatearPrecio(precioOp(p, o.v))}` : ''}${o.stock > 0 ? (o.stock <= 1 ? ', última unidad' : '') : ', sin stock'}">${p.tipo === 'color' ? `<i style="--sw:${COLORES[o.v] || '#ccc'}"></i>` : ''}${esc(o.v)}${conDet && o.det ? `<small>${esc(o.det)}</small>` : ''}</button>`;
  return `<div class="picker__head"><p class="picker__tit">${esc(tipoDe(p).elegir)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(op).join('')}</div>`;
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `${tipoDe(p).elegir}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = pickerHTML(p) + (qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : '');
  card.appendChild(pk);
  (pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(stockDe(p, v) ? 'Ya tenés todo el stock de esa opción en el carrito.' : 'Esa opción no tiene stock por ahora.'); if (comprar) abrirCarrito(); return; }
  if (comprar) { abrirCarrito(); return; }
  const det = unico(p) ? '' : (p.tipo === 'color' ? opDe(p, v)?.v : v);
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${det ? ` (${det})` : ''} al carrito`);
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
      if (unico(p)) { sumarAlCarrito(p, parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1, p.ops[0].v, comprar); return; }
      abrirPicker(card, p, comprar ? 'comprar' : 'agregar');
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

function guiaMedidasHTML(p, resaltar) {
  const op = opDe(p, resaltar);
  return `<p class="guia__tit">Medí el colchón y elegí la medida que le corresponde</p><table><thead><tr><th scope="col">Medida</th><th scope="col">Colchón</th></tr></thead><tbody>${COLCHONES.map(([m, med]) => `<tr${op && op.v === m ? ' class="es-actual"' : ''}><th scope="row">${esc(m)}</th><td>${esc(med)}</td></tr>`).join('')}</tbody></table>`;
}

const qvEstado = { p: null, v: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  qvEstado.v = unico(p) ? p.ops[0].v : '';
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: p.colores.join(', '),
    brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(o => precioOp(p, o.v))), offerCount: p.ops.length, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { amb: p.amb, excluirCat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const op = opDe(p, qvEstado.v);
  const t = tipoDe(p);
  const nombreOp = t.nombre.toLowerCase();
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí ${t.elegir.replace('Elegí ', '')} para ver cuántas quedan` : op.stock === 1 ? 'Queda 1 unidad' : op.stock <= 3 ? `Quedan ${op.stock} unidades` : 'En stock';
  const precio = op ? `<p class="qv__precio"><b>${formatearPrecio(precioOp(p, op.v))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioLista(p, op.v))}</s>` : ''}${unico(p) ? '' : `<small>${esc(varTexto(p, op.v))}</small>`}</p>` : precioHTML(p, 'qv__precio');
  const conDet = p.tipo !== 'color';
  const boton = o => `<button type="button" class="qv__op${conDet ? ' qv__op--det' : ''}" role="radio" aria-checked="${o.v === qvEstado.v}" data-qv-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${p.tipo === 'color' ? `<i style="--sw:${COLORES[o.v] || '#ccc'}"></i>` : ''}${esc(o.v)}${conDet && o.det ? `<small>${esc(o.det)}</small>` : ''}</button>`;
  const selector = unico(p) ? `<p class="qv__colores">${esc(op?.det || '')}</p>` : `<div class="qv__var"><p class="qv__var-tit">${esc(t.nombre)}${qvEstado.v ? `: <b>${esc(qvEstado.v)}</b>` : ''}</p>
    <div class="qv__ops" role="radiogroup" aria-label="${esc(t.nombre)}">${p.ops.map(boton).join('')}</div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí ${esc(t.elegir.replace('Elegí ', ''))} para sumarlo al carrito.</p></div>`;
  const compartir = `${new URL(location.pathname, location.href).href}?producto=${p.id}`;
  const conGuia = p.cat === 'blanqueria' && p.tipo === 'medida' && COLCHONES.some(([m]) => opDe(p, m));
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(p.amb.map(a => AMBIENTES[a]).join(', '))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precio}
      <p class="qv__colores">${swatchesHTML(p)}${esc(p.colores.join(', '))}</p>
      ${selector}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${conGuia ? `<details class="qv__det" data-qv-guia><summary>${ICO.regla}Guía de medidas</summary><div class="guia">${guiaMedidasHTML(p, qvEstado.v)}<p class="guia__nota">¿Tu colchón mide distinto o es muy alto? Escribinos y te decimos cuál te queda.</p></div></details>` : ''}
      <p class="qv__envio">${ICO.camion}<span>Enviamos a todo el país desde Baradero. El costo te lo pasamos según tu código postal.</span></p>
      <div class="qv__links">
        <a class="qv__wsp" href="${wspLink(`Hola ${MARCA}! Quiero consultar por: ${p.nombre}${qvEstado.v && !unico(p) ? ` (${nombreOp} ${qvEstado.v})` : ''}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
        <a class="qv__share" href="https://wa.me/?text=${encodeURIComponent(`Mirá esto de ${MARCA}: ${p.nombre} ${compartir}`)}" target="_blank" rel="noopener">${ICO.compartir}<span>Compartir</span></a>
      </div>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">Combina con</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${variaPrecio(r) ? 'desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
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
      const guiaAbierta = qv.querySelector('[data-qv-guia]')?.open;
      pintarQV();
      if (guiaAbierta) qv.querySelector('[data-qv-guia]').open = true;
      qv.querySelector(`[data-qv-op="${window.CSS.escape(qvEstado.v)}"]`)?.focus();
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
    if (!qvEstado.v) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { Cart.add(p, qvEstado.qty, qvEstado.v); cerrarQV(); abrirCarrito(); return; }
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
    body.innerHTML = `<div class="cart-vacio"><span class="cart-vacio__ico">${ICO.bolsa}</span><p class="cart-vacio__tit">Tu carrito está vacío</p><p>Sumá una vajilla, unas sábanas o un canasto y te lo enviamos a donde estés.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver la tienda</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const det = varTexto(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${det ? `${esc(det)} · ` : ''}${formatearPrecio(precioOp(p, i.v))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, i.v) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const det = varTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${det ? ` (${det})` : ''}: ${formatearPrecio(precioOp(p, i.v) * i.qty)}`; }).join('\n');
  const msg = `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi código postal es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">${ICO.camion}<span>Enviamos a todo el país. El envío se calcula con tu código postal.</span></p>
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

const HORARIO = {
  0: [],
  1: [[570, 720], [990, 1170]],
  2: [[570, 720], [990, 1170]],
  3: [[570, 720], [990, 1170]],
  4: [[570, 720], [990, 1170]],
  5: [[570, 720], [990, 1170]],
  6: [[570, 900]],
};
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function ahoraBaradero() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const v = t => partes.find(x => x.type === t)?.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
  return { dia, min: parseInt(v('hour'), 10) * 60 + parseInt(v('minute'), 10) };
}
const horaTxt = m => `${Math.floor(m / 60)}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''}`;
function estadoLocal() {
  const { dia, min } = ahoraBaradero();
  const tramo = HORARIO[dia].find(([a, b]) => min >= a && min < b);
  if (tramo) return { abierto: true, largo: `Abierto ahora · cierra a las ${horaTxt(tramo[1])}`, corto: `Abierto · hasta las ${horaTxt(tramo[1])}` };
  const luego = HORARIO[dia].find(([a]) => a > min);
  if (luego) return { abierto: false, largo: `Cerrado ahora · abre hoy a las ${horaTxt(luego[0])}`, corto: `Abre hoy a las ${horaTxt(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d].length) {
      const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
      return { abierto: false, largo: `Cerrado ahora · abre ${cuando} a las ${horaTxt(HORARIO[d][0][0])}`, corto: `Abre ${cuando} a las ${horaTxt(HORARIO[d][0][0])}` };
    }
  }
  return { abierto: false, largo: 'Horario a confirmar', corto: 'Horario a confirmar' };
}
function initHorario() {
  if (!document.querySelector('[data-estado], [data-estado-corto], .horarios')) return;
  const pintar = () => {
    const e = estadoLocal();
    const { dia } = ahoraBaradero();
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.classList.toggle('estado--abierto', e.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = e.largo;
    });
    document.querySelectorAll('[data-estado-corto]').forEach(el => {
      el.textContent = e.corto;
      el.classList.toggle('estado-corto--abierto', e.abierto);
    });
    document.querySelectorAll('.horarios [data-dia]').forEach(li => {
      const [a, b] = li.dataset.dia.split('-').map(Number);
      li.classList.toggle('hoy', b != null ? dia >= a && dia <= b : dia === a);
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = L.latLng(-33.8114, -59.5046);
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    mapa.setView(centro, 14);
    if (MODELO === '2' && el.clientWidth > 760) mapa.panBy([-el.clientWidth * 0.2, 0], { animate: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 650, color: '#4A6543', weight: 1, fillColor: '#5E7D55', fillOpacity: .14 }).addTo(mapa);
    L.circleMarker(centro, { radius: 8, color: '#FAF9F6', weight: 2, fillColor: '#3B5235', fillOpacity: 1 }).addTo(mapa);
  } catch (e) { console.error(e); }
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    amb: new Set(lista('amb').filter(a => AMBIENTES[a])),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la tienda')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-amb-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(AMBIENTES).map(([k, n]) => `<label class="amb-op"><input type="checkbox" value="${k}" data-f="amb"><span>${esc(n)}</span></label>`).join('');
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
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.amb.size && sin !== 'amb') f.amb = [...estado.amb];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.amb.forEach(a => chips.push(['amb', a, AMBIENTES[a]]));
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
    document.querySelectorAll('input[data-f="amb"]').forEach(el => { el.checked = estado.amb.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    const enPanel = estado.amb.size + estado.colores.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Toda la tienda';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Bazar, deco y blanquería del local de Baradero, con envío a todo el país. Elegí la medida, el color o la presentación en cada producto y sumalo al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Toda la tienda'; miga.textContent = titulo; }
    document.title = `${titulo} — La Escondida · Bazar y Deco en Baradero`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if ((u.searchParams.get('cat') || '') === estado.cat && estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'amb', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.amb.size) u.searchParams.set('amb', [...estado.amb].join(','));
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
    estado.cat = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.amb.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'amb' ? estado.amb : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'amb') estado.amb.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
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
  if (filtros && window.getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
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
  return { cat: estado.cat };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.15);
  paso('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.25);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.5);
  paso('.hero-ctas > *', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.65);
  paso('.etiqueta-hero', { y: -24, rotation: 8, opacity: 0, duration: 1.3, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, 0.8);
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
  initRail,
  initRubros,
  initCuentas,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHorario,
  initMapa,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
