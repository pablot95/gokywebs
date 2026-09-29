const WSP = '5491124673069';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ES_M2 = document.body.classList.contains('m2');
const POR_PAGINA = 16;
const MAPA_COORDS = [-34.6037, -58.3816];

const IMG = {
  'lenceria-1x1.webp': [1254, 1254],
  'bikinis-1x1.webp': [1254, 1254],
  'camisones-1x1.webp': [1254, 1254],
  'conjuntos-1x1.webp': [1254, 1254],
  'local-16x9.webp': [1672, 941],
  'local-9x16.webp': [941, 1672],
};

const TALLES_CORPINO = ['85', '90', '95', '100', '105', '110'];
const TALLES_PRENDA = ['S', 'M', 'L', 'XL', 'XXL'];

const CATEGORIAS = [
  { id: 'conjuntos', nombre: 'Conjuntos', tinte: 'rosa' },
  { id: 'corpinos', nombre: 'Corpiños', tinte: 'durazno' },
  { id: 'bombachas', nombre: 'Bombachas', tinte: 'lila' },
  { id: 'bikinis', nombre: 'Bikinis', tinte: 'agua' },
  { id: 'noche', nombre: 'Camisones y pijamas', tinte: 'manteca' },
];

const SINONIMOS = {
  conjuntos: 'conjunto conjuntos set lenceria',
  corpinos: 'corpino corpinos brasier sosten top lenceria',
  bombachas: 'bombacha bombachas culotte colaless tanga vedetina ropa interior lenceria',
  bikinis: 'bikini bikinis malla mallas traje de bano playa pileta verano',
  noche: 'camison camisones pijama pijamas bata babydoll dormir noche',
};

const COLORES = [
  { id: 'rojo', nombre: 'Rojo', hex: '#E00000' },
  { id: 'bordo', nombre: 'Bordó', hex: '#7A1025' },
  { id: 'rosa', nombre: 'Rosa', hex: '#F4A6BC' },
  { id: 'fucsia', nombre: 'Fucsia', hex: '#E0197A' },
  { id: 'lila', nombre: 'Lila', hex: '#B79CF0' },
  { id: 'celeste', nombre: 'Celeste', hex: '#9CC3E8' },
  { id: 'turquesa', nombre: 'Turquesa', hex: '#127C86' },
  { id: 'naranja', nombre: 'Naranja', hex: '#F26B1D' },
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
  { id: 'negro', nombre: 'Negro', hex: '#141116' },
  { id: 'nude', nombre: 'Nude', hex: '#E9C3B0' },
  { id: 'estampado', nombre: 'Estampado', hex: '' },
];

const PRODUCTOS = [
  { id: 'conjunto-bordo', cod: 'WL-101', nombre: 'Conjunto Bordó', cat: 'conjuntos', color: 'bordo', colorNombre: 'Bordó', tela: 'Encaje', talles: ['85', '90', '95', '100', '105'], precio: 52900, descuento: 0, stock: 9, rank: 3, img: 'conjuntos-1x1.webp', foco: [0.30, 0.61, 1.75], vistas: [['conjuntos-1x1.webp', [0.38, 0.6, 1.15]]], alt: 'Conjunto de encaje bordó: corpiño con aro y colaless', desc: 'Corpiño con aro y taza soft de encaje bordó, con moñito al centro, y colaless de la misma puntilla.' },
  { id: 'conjunto-negro-encaje', cod: 'WL-102', nombre: 'Conjunto Negro con Portaligas', cat: 'conjuntos', color: 'negro', colorNombre: 'Negro', tela: 'Encaje', talles: ['85', '90', '95', '100'], precio: 56900, descuento: 0, stock: 5, rank: 17, img: 'conjuntos-1x1.webp', foco: [0.74, 0.37, 2.0], vistas: [['conjuntos-1x1.webp', [0.72, 0.4, 1.3]]], alt: 'Conjunto negro de encaje con portaligas', desc: 'Corpiño de encaje negro con breteles regulables, bombacha y portaligas al tono con broches dorados.' },
  { id: 'conjunto-rosa-encaje', cod: 'WL-103', nombre: 'Conjunto Rosa Encaje', cat: 'conjuntos', color: 'rosa', colorNombre: 'Rosa', tela: 'Encaje', talles: ['85', '90', '95', '100', '105'], precio: 49900, descuento: 0, stock: 11, rank: 7, img: 'conjuntos-1x1.webp', foco: [0.76, 0.72, 1.75], vistas: [['conjuntos-1x1.webp', [0.7, 0.62, 1.2]]], alt: 'Conjunto de encaje rosa con moños de raso', desc: 'Encaje rosa chicle con moño de raso en el corpiño y en la bombacha. Taza soft con aro.' },
  { id: 'conjunto-lavanda', cod: 'WL-104', nombre: 'Conjunto Lavanda', cat: 'conjuntos', color: 'lila', colorNombre: 'Lila', tela: 'Encaje', talles: ['85', '90', '95', '100'], precio: 46900, descuento: 0, stock: 7, rank: 23, img: 'local-16x9.webp', foco: [0.128, 0.36, 1.85], vistas: [['local-16x9.webp', [0.2, 0.42, 1.2]]], alt: 'Conjunto de encaje lila puesto en un maniquí', desc: 'Corpiño con aro y bombacha de encaje lila, suaves al tacto, con moñito al centro.' },
  { id: 'conjunto-fucsia', cod: 'WL-105', nombre: 'Conjunto Fucsia Push-up', cat: 'conjuntos', color: 'fucsia', colorNombre: 'Fucsia', tela: 'Microfibra', talles: ['85', '90', '95', '100'], precio: 39900, descuento: 20, stock: 12, rank: 1, img: 'local-16x9.webp', foco: [0.415, 0.77, 2.3], vistas: [['local-16x9.webp', [0.5, 0.72, 1.45]]], alt: 'Conjunto push-up fucsia con bombacha de puntilla', desc: 'Push-up fucsia de microfibra y bombacha con puntilla en las piernas. Levanta y marca sin apretar.' },
  { id: 'conjunto-turquesa', cod: 'WL-106', nombre: 'Conjunto Turquesa', cat: 'conjuntos', color: 'turquesa', colorNombre: 'Turquesa', tela: 'Encaje', talles: ['85', '90', '95', '100'], precio: 42900, descuento: 0, stock: 6, rank: 11, img: 'local-16x9.webp', foco: [0.585, 0.745, 2.4], vistas: [['local-16x9.webp', [0.55, 0.7, 1.45]]], alt: 'Conjunto de encaje turquesa sobre la mesa del local', desc: 'Encaje turquesa con taza soft y bombacha tiro medio al tono.' },
  { id: 'conjunto-flores', cod: 'WL-107', nombre: 'Conjunto Flores de Colores', cat: 'conjuntos', color: 'estampado', colorNombre: 'Estampado', tela: 'Microfibra', talles: ['85', '90', '95', '100'], precio: 36900, descuento: 0, stock: 8, rank: 26, img: 'local-16x9.webp', foco: [0.2, 0.85, 2.3], vistas: [['local-16x9.webp', [0.25, 0.75, 1.4]]], alt: 'Conjunto estampado con flores de colores', desc: 'Estampado de flores de colores, con taza armada y bombacha tiro bajo al tono.' },
  { id: 'corpino-rubi', cod: 'WL-111', nombre: 'Corpiño Rubí', cat: 'corpinos', color: 'rojo', colorNombre: 'Rojo', tela: 'Encaje', talles: ['85', '90', '95', '100', '105'], precio: 29900, descuento: 0, stock: 10, rank: 9, img: 'lenceria-1x1.webp', foco: [0.265, 0.2, 2.1], vistas: [['lenceria-1x1.webp', [0.4, 0.35, 1.25]]], alt: 'Corpiño de encaje rojo con aro', desc: 'Encaje rojo con aro, taza soft y espalda de puntilla. Hace juego con la Bombacha Rubí.' },
  { id: 'corpino-corazones', cod: 'WL-112', nombre: 'Corpiño Corazones', cat: 'corpinos', color: 'blanco', colorNombre: 'Blanco', tela: 'Algodón', talles: ['85', '90', '95', '100'], precio: 24900, descuento: 20, stock: 14, rank: 2, img: 'lenceria-1x1.webp', foco: [0.695, 0.2, 2.15], vistas: [['lenceria-1x1.webp', [0.62, 0.45, 1.25]]], alt: 'Corpiño blanco con corazoncitos rojos y moño rojo', desc: 'Algodón blanco con corazoncitos rojos, puntilla en el borde y moño rojo al centro. Hace juego con la Bombacha Corazones.' },
  { id: 'corpino-flores', cod: 'WL-113', nombre: 'Corpiño Jardín', cat: 'corpinos', color: 'rosa', colorNombre: 'Rosa', tela: 'Encaje', talles: ['85', '90', '95', '100', '105'], precio: 31900, descuento: 0, stock: 8, rank: 21, img: 'lenceria-1x1.webp', foco: [0.29, 0.44, 2.1], vistas: [['lenceria-1x1.webp', [0.35, 0.55, 1.3]]], alt: 'Corpiño push-up rosa con flores bordadas', desc: 'Push-up rosa con flores bordadas y puntilla. Hace juego con la Bombacha Jardín.' },
  { id: 'corpino-noche', cod: 'WL-114', nombre: 'Corpiño Negro Soft', cat: 'corpinos', color: 'negro', colorNombre: 'Negro', tela: 'Microfibra', talles: ['85', '90', '95', '100', '105', '110'], precio: 27900, descuento: 0, stock: 16, rank: 15, img: 'lenceria-1x1.webp', foco: [0.735, 0.45, 2.05], vistas: [['lenceria-1x1.webp', [0.7, 0.55, 1.3]]], alt: 'Corpiño negro de microfibra con puntilla', desc: 'Microfibra negra con puntilla, taza soft y breteles regulables. Va con todo.' },
  { id: 'corpino-soft-nude', cod: 'WL-115', nombre: 'Corpiño Nude sin Costuras', cat: 'corpinos', color: 'nude', colorNombre: 'Nude', tela: 'Microfibra', talles: ['85', '90', '95', '100', '105', '110'], precio: 22900, descuento: 0, stock: 3, rank: 28, img: 'local-9x16.webp', foco: [0.83, 0.655, 2.05], vistas: [['local-9x16.webp', [0.6, 0.68, 1.3]]], alt: 'Corpiños nude de taza moldeada sobre la mesa del local', desc: 'Taza moldeada lisa y sin costuras: no se marca debajo de la remera.' },
  { id: 'bombacha-rubi', cod: 'WL-121', nombre: 'Bombacha Rubí', cat: 'bombachas', color: 'rojo', colorNombre: 'Rojo', tela: 'Encaje', talles: ['S', 'M', 'L', 'XL'], precio: 12900, descuento: 0, stock: 15, rank: 18, img: 'lenceria-1x1.webp', foco: [0.255, 0.625, 2.3], vistas: [['lenceria-1x1.webp', [0.4, 0.62, 1.3]]], alt: 'Bombacha culotte de encaje rojo', desc: 'Culotte de encaje rojo con moñito al frente. Hace juego con el Corpiño Rubí.' },
  { id: 'bombacha-flores', cod: 'WL-122', nombre: 'Bombacha Jardín', cat: 'bombachas', color: 'rosa', colorNombre: 'Rosa', tela: 'Tul', talles: ['S', 'M', 'L', 'XL'], precio: 13900, descuento: 0, stock: 9, rank: 22, img: 'lenceria-1x1.webp', foco: [0.245, 0.8, 2.15], vistas: [['lenceria-1x1.webp', [0.35, 0.72, 1.3]]], alt: 'Bombacha de tul rosa con flores bordadas', desc: 'Tul rosa con flores bordadas y puntilla en las piernas. Hace juego con el Corpiño Jardín.' },
  { id: 'bombacha-corazones', cod: 'WL-123', nombre: 'Bombacha Corazones', cat: 'bombachas', color: 'blanco', colorNombre: 'Blanco', tela: 'Algodón', talles: ['S', 'M', 'L', 'XL', 'XXL'], precio: 8900, descuento: 25, stock: 20, rank: 6, img: 'lenceria-1x1.webp', foco: [0.56, 0.77, 2.5], vistas: [['lenceria-1x1.webp', [0.55, 0.7, 1.35]]], alt: 'Bombacha de algodón blanca con corazoncitos rojos', desc: 'Algodón con corazoncitos rojos y moño al frente. Cómoda para todos los días.' },
  { id: 'culotte-malva', cod: 'WL-124', nombre: 'Culotte Malva de Algodón', cat: 'bombachas', color: 'lila', colorNombre: 'Malva', tela: 'Algodón', talles: ['S', 'M', 'L', 'XL', 'XXL'], precio: 9900, descuento: 15, stock: 18, rank: 12, img: 'lenceria-1x1.webp', foco: [0.785, 0.83, 2.45], vistas: [['lenceria-1x1.webp', [0.7, 0.75, 1.35]]], alt: 'Culotte de algodón acanalado color malva con puntilla', desc: 'Algodón acanalado malva con puntilla y moño. Tiro medio, no se marca.' },
  { id: 'bombacha-noche', cod: 'WL-125', nombre: 'Bombacha Negra Encaje', cat: 'bombachas', color: 'negro', colorNombre: 'Negro', tela: 'Encaje', talles: ['S', 'M', 'L', 'XL'], precio: 11900, descuento: 0, stock: 12, rank: 25, img: 'lenceria-1x1.webp', foco: [0.78, 0.625, 2.4], vistas: [['lenceria-1x1.webp', [0.72, 0.58, 1.35]]], alt: 'Bombacha de encaje negro con moñito', desc: 'Encaje negro elastizado, tiro bajo, con moñito al frente.' },
  { id: 'culotte-puntilla', cod: 'WL-126', nombre: 'Culotte de Puntilla', cat: 'bombachas', color: 'rosa', colorNombre: 'Rosa', tela: 'Puntilla', talles: ['S', 'M', 'L', 'XL', 'XXL'], precio: 10900, descuento: 0, stock: 25, rank: 29, img: 'local-9x16.webp', foco: [0.6, 0.79, 2.3], vistas: [['local-9x16.webp', [0.55, 0.75, 1.35]]], alt: 'Bandeja del local con culottes de puntilla rosa', desc: 'Puntilla elastizada, suave y sin costuras al costado.' },
  { id: 'bikini-fucsia', cod: 'WL-131', nombre: 'Bikini Triángulo Fucsia', cat: 'bikinis', color: 'fucsia', colorNombre: 'Fucsia', tela: 'Lycra', talles: ['S', 'M', 'L'], precio: 34900, descuento: 0, stock: 8, rank: 20, nuevo: true, img: 'bikinis-1x1.webp', foco: [0.25, 0.3, 1.95], vistas: [['bikinis-1x1.webp', [0.3, 0.35, 1.3]]], alt: 'Bikini triángulo fucsia con lazos', desc: 'Corpiño triángulo con lazo al cuello y bombacha regulable con lazos al costado.' },
  { id: 'bikini-tropical', cod: 'WL-132', nombre: 'Bikini Tropical', cat: 'bikinis', color: 'estampado', colorNombre: 'Estampado', tela: 'Lycra', talles: ['S', 'M', 'L'], precio: 38900, descuento: 0, stock: 6, rank: 4, nuevo: true, img: 'bikinis-1x1.webp', foco: [0.69, 0.3, 1.95], vistas: [['bikinis-1x1.webp', [0.62, 0.35, 1.3]]], alt: 'Bikini estampado con hojas verdes', desc: 'Estampado de hojas verdes, triángulo con lazo al cuello y bombacha con tiras.' },
  { id: 'bikini-naranja', cod: 'WL-133', nombre: 'Bikini Triángulo Naranja', cat: 'bikinis', color: 'naranja', colorNombre: 'Naranja', tela: 'Lycra', talles: ['S', 'M', 'L', 'XL'], precio: 34900, descuento: 0, stock: 7, rank: 14, nuevo: true, img: 'bikinis-1x1.webp', foco: [0.3, 0.68, 1.85], vistas: [['bikinis-1x1.webp', [0.35, 0.62, 1.3]]], alt: 'Bikini triángulo naranja con lazos', desc: 'Naranja furioso: triángulo con frunce y bombacha con lazos al costado.' },
  { id: 'bikini-cerezas', cod: 'WL-134', nombre: 'Bikini Cerezas', cat: 'bikinis', color: 'estampado', colorNombre: 'Estampado', tela: 'Lycra', talles: ['S', 'M', 'L'], precio: 36900, descuento: 0, stock: 2, rank: 8, nuevo: true, img: 'bikinis-1x1.webp', foco: [0.79, 0.7, 1.85], vistas: [['bikinis-1x1.webp', [0.7, 0.65, 1.3]]], alt: 'Bikini blanco estampado con cerecitas rojas', desc: 'Blanco con cerecitas rojas, triángulo con lazo al cuello y bombacha tiro medio.' },
  { id: 'camison-jardin', cod: 'WL-141', nombre: 'Camisón Jardín', cat: 'noche', color: 'estampado', colorNombre: 'Estampado', tela: 'Algodón', talles: ['S', 'M', 'L', 'XL'], precio: 39900, descuento: 0, stock: 7, rank: 5, img: 'camisones-1x1.webp', foco: [0.36, 0.37, 1.55], vistas: [['local-16x9.webp', [0.895, 0.37, 1.7]], ['camisones-1x1.webp', [0.45, 0.4, 1.1]]], alt: 'Camisón blanco con rosas y puntilla', desc: 'Algodón blanco con rosas, puntilla en el escote y en el ruedo, y moño de raso.' },
  { id: 'camison-rosa-viejo', cod: 'WL-142', nombre: 'Camisón Rosa Viejo', cat: 'noche', color: 'rosa', colorNombre: 'Rosa viejo', tela: 'Modal', talles: ['S', 'M', 'L', 'XL', 'XXL'], precio: 37900, descuento: 0, stock: 9, rank: 19, img: 'camisones-1x1.webp', foco: [0.525, 0.38, 1.95], vistas: [['camisones-1x1.webp', [0.5, 0.4, 1.2]]], alt: 'Camisón rosa viejo con escote de encaje', desc: 'Modal rosa viejo con escote de encaje y ruedo de puntilla.' },
  { id: 'camison-celeste', cod: 'WL-143', nombre: 'Camisón Celeste', cat: 'noche', color: 'celeste', colorNombre: 'Celeste', tela: 'Satén', talles: ['S', 'M', 'L', 'XL'], precio: 36900, descuento: 0, stock: 5, rank: 24, img: 'camisones-1x1.webp', foco: [0.625, 0.4, 2.1], vistas: [['camisones-1x1.webp', [0.6, 0.42, 1.25]]], alt: 'Camisón de satén celeste con encaje en el busto', desc: 'Satén celeste con encaje en el busto. Fresco para el verano.' },
  { id: 'camison-negro', cod: 'WL-144', nombre: 'Camisón Negro Encaje', cat: 'noche', color: 'negro', colorNombre: 'Negro', tela: 'Satén', talles: ['S', 'M', 'L', 'XL'], precio: 41900, descuento: 0, stock: 4, rank: 30, img: 'camisones-1x1.webp', foco: [0.82, 0.42, 2.5], vistas: [['camisones-1x1.webp', [0.75, 0.42, 1.3]]], alt: 'Camisón largo negro con escote de encaje', desc: 'Satén negro largo, con escote de encaje y cintura marcada.' },
  { id: 'babydoll-rosa', cod: 'WL-145', nombre: 'Babydoll de Tul Rosa', cat: 'noche', color: 'rosa', colorNombre: 'Rosa', tela: 'Tul', talles: ['S', 'M', 'L'], precio: 33900, descuento: 0, stock: 6, rank: 13, img: 'local-16x9.webp', foco: [0.725, 0.33, 1.75], vistas: [['local-16x9.webp', [0.78, 0.35, 1.2]]], alt: 'Babydoll de tul rosa con corpiño de encaje, en un maniquí', desc: 'Tul rosa transparente con corpiño de encaje, moño al centro y colaless al tono.' },
  { id: 'pijama-saten-rosa', cod: 'WL-146', nombre: 'Pijama Satén Rosa', cat: 'noche', color: 'rosa', colorNombre: 'Rosa', tela: 'Satén', talles: ['S', 'M', 'L', 'XL', 'XXL'], precio: 54900, descuento: 0, stock: 5, rank: 27, img: 'camisones-1x1.webp', foco: [0.22, 0.88, 2.3], vistas: [['camisones-1x1.webp', [0.3, 0.82, 1.4]]], alt: 'Pijama de satén rosa estampado con ribete negro, doblado', desc: 'Camisa con ribete negro y pantalón largo, de satén rosa con flores.' },
  { id: 'pijama-saten-lila', cod: 'WL-147', nombre: 'Pijama Satén Lila', cat: 'noche', color: 'lila', colorNombre: 'Lila', tela: 'Satén', talles: ['S', 'M', 'L', 'XL'], precio: 52900, descuento: 30, stock: 7, rank: 10, img: 'camisones-1x1.webp', foco: [0.515, 0.86, 2.6], vistas: [['camisones-1x1.webp', [0.5, 0.8, 1.4]]], alt: 'Pijama de satén lila doblado con moño', desc: 'Satén lila, camisa manga larga y pantalón, con moño en la presilla.' },
  { id: 'bata-saten-rosa', cod: 'WL-148', nombre: 'Bata Satén Rosa', cat: 'noche', color: 'rosa', colorNombre: 'Rosa', tela: 'Satén', talles: ['S', 'M', 'L', 'XL'], precio: 58900, descuento: 20, stock: 6, rank: 16, img: 'conjuntos-1x1.webp', foco: [0.27, 0.3, 1.75], vistas: [['conjuntos-1x1.webp', [0.3, 0.4, 1.2]]], alt: 'Bata corta de satén rosa con puños de encaje', desc: 'Bata corta de satén rosa con puños de encaje y cinto para atar.' },
];

const HORARIOS = { 0: null, 1: [10, 20], 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [10, 14] };
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const PREPARACION_H = 2;
const ENVIOS = {
  caba: { nombre: 'Moto en CABA', etiqueta: 'moto en CABA', costo: 4900, min: 1, max: 1 },
  gba: { nombre: 'Moto en GBA', etiqueta: 'moto en GBA', costo: 6900, min: 1, max: 2 },
  pais: { nombre: 'Correo a todo el país', etiqueta: 'correo', costo: 8900, min: 3, max: 6 },
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getColor = id => COLORES.find(c => c.id === id);
const dims = img => IMG[img] || [1200, 1200];
const clamp01 = v => Math.min(1, Math.max(0, v));
const pad2 = n => String(n).padStart(2, '0');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim();
const tinteClase = p => 'tinte-' + (getCategoria(p.cat)?.tinte || 'rosa');
const rangoTalles = p => (p.talles.length > 1 ? `${p.talles[0]} a ${p.talles[p.talles.length - 1]}` : p.talles[0]);
const cuantas = n => `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

function irA(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
}

function recorte(img, foco, ar = 1) {
  const [w, h] = dims(img);
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw + 0.5 ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh + 0.5 ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function precioHTML(p) {
  const final = formatearPrecio(precioFinal(p));
  if (p.descuento > 0) return `<span class="precio precio--promo"><span class="precio-final">${final}</span><s>${formatearPrecio(p.precio)}</s></span>`;
  return `<span class="precio"><span class="precio-final">${final}</span></span>`;
}

function etiquetasHTML(p) {
  const out = [];
  if (p.descuento > 0) out.push(`<span class="etq etq--promo">Promo −${p.descuento}%</span>`);
  if (p.nuevo) out.push('<span class="etq etq--nuevo">Nuevo</span>');
  if (p.stock <= 3) out.push('<span class="etq etq--ultimas">Últimas unidades</span>');
  return out.join('');
}

function dotHTML(p) {
  const c = getColor(p.color);
  return c && c.hex ? `<span class="dot" style="--c:${c.hex}"></span>` : '<span class="dot dot--estampado"></span>';
}

const Cart = {
  KEY: 'wawilenceria_cart',
  memoria: [],
  get() {
    let items;
    try { items = JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { items = this.memoria; }
    if (!Array.isArray(items)) items = [];
    return items
      .filter(i => i && getProducto(i.id) && getProducto(i.id).talles.includes(String(i.talle)) && Number(i.qty) > 0)
      .map(i => ({ id: i.id, talle: String(i.talle), qty: Math.min(Math.floor(Number(i.qty)), getProducto(i.id).stock) }));
  },
  save(items) {
    this.memoria = items;
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage: queda en memoria */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const enOtros = items.filter(i => i.id === producto.id && i.talle !== talle).reduce((s, i) => s + i.qty, 0);
    const tope = Math.max(0, (producto.stock ?? 99) - enOtros);
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else if (tope > 0) items.push({ id: producto.id, talle, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    const p = getProducto(id);
    const enOtros = items.filter(i => i.id === id && i.talle !== talle).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - enOtros));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const estado = { cats: new Set(), promo: false, q: '', talles: new Set(), colores: new Set(), precioMax: null, orden: 'destacados', visibles: POR_PAGINA };
const PRECIO_MIN = Math.min(...PRODUCTOS.map(precioFinal));
const PRECIO_MAX = Math.max(...PRODUCTOS.map(precioFinal));

function textoBusqueda(p) {
  return ' ' + normalizar(`${p.nombre} ${getCategoria(p.cat)?.nombre} ${p.colorNombre} ${getColor(p.color)?.nombre} ${p.tela} ${p.desc} ${SINONIMOS[p.cat] || ''} ${p.cod} talle ${p.talles.join(' ')} ${p.descuento > 0 ? 'promo oferta descuento' : ''} ${p.nuevo ? 'nuevo nueva temporada' : ''}`) + ' ';
}

const INDICE = new Map(PRODUCTOS.map(p => [p.id, textoBusqueda(p)]));

function coincide(p, termino) {
  const hay = INDICE.get(p.id) || '';
  if (termino.length <= 2) return hay.includes(' ' + termino + ' ');
  return hay.includes(termino);
}

function filtrar(opciones = {}) {
  const e = { ...estado, ...opciones };
  const terminos = normalizar(e.q).split(' ').filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (e.cats.size && !e.cats.has(p.cat)) return false;
    if (e.promo && !(p.descuento > 0)) return false;
    if (e.talles.size && !p.talles.some(t => e.talles.has(t))) return false;
    if (e.colores.size && !e.colores.has(p.color)) return false;
    if (e.precioMax != null && precioFinal(p) > e.precioMax) return false;
    if (terminos.length && !terminos.every(t => coincide(p, t))) return false;
    return true;
  });
  const orden = {
    destacados: (a, b) => a.rank - b.rank,
    menor: (a, b) => precioFinal(a) - precioFinal(b) || a.rank - b.rank,
    mayor: (a, b) => precioFinal(b) - precioFinal(a) || a.rank - b.rank,
    az: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  }[e.orden] || ((a, b) => a.rank - b.rank);
  return lista.sort(orden);
}

function hayFiltros() {
  return estado.cats.size > 0 || estado.promo || estado.q.trim() !== '' || estado.talles.size > 0 || estado.colores.size > 0 || estado.precioMax != null;
}

function finPromo(ahora = new Date()) {
  const fin = new Date(ahora);
  fin.setDate(fin.getDate() + ((7 - fin.getDay()) % 7));
  fin.setHours(23, 59, 59, 0);
  if (fin <= ahora) fin.setDate(fin.getDate() + 7);
  return fin;
}

function textoCuenta(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  return d > 0 ? `${d} d ${pad2(h)}:${pad2(m)}:${pad2(seg)}` : `${pad2(h)}:${pad2(m)}:${pad2(seg)}`;
}

function inicioDia(fecha) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diasEntre(a, b) {
  return Math.round((inicioDia(b) - inicioDia(a)) / 86400000);
}

function horaTexto(fecha) {
  return `${fecha.getHours()}:${pad2(fecha.getMinutes())}`;
}

function cuandoTexto(fecha, ahora) {
  const d = diasEntre(ahora, fecha);
  if (d === 0) return 'hoy';
  if (d === 1) return 'mañana';
  return `el ${DIAS_LARGO[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}`;
}

function estadoLocal(ahora = new Date()) {
  const h = HORARIOS[ahora.getDay()];
  const hora = ahora.getHours() + ahora.getMinutes() / 60;
  if (h && hora >= h[0] && hora < h[1]) return { abierto: true, texto: `Abierto ahora · hasta las ${h[1]} h` };
  if (h && hora < h[0]) return { abierto: false, texto: `Cerrado · abrimos hoy a las ${h[0]} h` };
  for (let i = 1; i <= 7; i += 1) {
    const d = new Date(ahora);
    d.setDate(d.getDate() + i);
    const hh = HORARIOS[d.getDay()];
    if (hh) return { abierto: false, texto: `Cerrado · abrimos ${i === 1 ? 'mañana' : 'el ' + DIAS_LARGO[d.getDay()]} a las ${hh[0]} h` };
  }
  return { abierto: false, texto: 'Cerrado' };
}

function listoRetiro(ahora = new Date()) {
  const h = HORARIOS[ahora.getDay()];
  if (h) {
    const apertura = new Date(ahora);
    apertura.setHours(h[0] + 1, 0, 0, 0);
    let t = new Date(Math.max(ahora.getTime() + PREPARACION_H * 3600000, apertura.getTime()));
    const mins = t.getMinutes();
    if (mins % 30) t = new Date(t.getTime() + (30 - (mins % 30)) * 60000);
    t.setSeconds(0, 0);
    const cierre = new Date(ahora);
    cierre.setHours(h[1], 0, 0, 0);
    if (t.getTime() <= cierre.getTime() - 30 * 60000 && diasEntre(ahora, t) === 0) return t;
  }
  for (let i = 1; i <= 7; i += 1) {
    const d = new Date(ahora);
    d.setDate(d.getDate() + i);
    const hh = HORARIOS[d.getDay()];
    if (hh) {
      d.setHours(hh[0] + 1, 0, 0, 0);
      return d;
    }
  }
  return null;
}

function zonaCP(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 4);
  if (digitos.length < 4) return null;
  const n = Number(digitos);
  if (n >= 1000 && n <= 1499) return 'caba';
  if (n >= 1600 && n <= 1899) return 'gba';
  if (n >= 1900 && n <= 9431) return 'pais';
  return 'invalido';
}

function sumarHabiles(desde, n) {
  const d = new Date(desde);
  let sumados = 0;
  while (sumados < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) sumados += 1;
  }
  return d;
}

function estimacionEnvio(zona, ahora = new Date()) {
  const e = ENVIOS[zona];
  if (!e) return null;
  return { ...e, desde: sumarHabiles(ahora, e.min), hasta: sumarHabiles(ahora, e.max) };
}

const Entrega = {
  KEY: 'wawilenceria_entrega',
  modo: 'retiro',
  cp: '',
  cargar() {
    try {
      const d = JSON.parse(localStorage.getItem(this.KEY)) || {};
      if (d.modo === 'envio' || d.modo === 'retiro') this.modo = d.modo;
      if (typeof d.cp === 'string') this.cp = d.cp.slice(0, 8);
    } catch { /* primera visita */ }
  },
  guardar() {
    try { localStorage.setItem(this.KEY, JSON.stringify({ modo: this.modo, cp: this.cp })); } catch { /* sin storage */ }
    document.dispatchEvent(new CustomEvent('entrega:updated'));
  },
  resumen(ahora = new Date()) {
    if (this.modo === 'retiro') {
      const t = listoRetiro(ahora);
      return t ? `retiro en el local (${cuandoTexto(t, ahora)} desde las ${horaTexto(t)})` : 'retiro en el local';
    }
    const z = zonaCP(this.cp);
    const est = z && z !== 'invalido' ? estimacionEnvio(z, ahora) : null;
    if (!est) return 'envío a domicilio (paso el código postal)';
    const llega = est.min === est.max ? cuandoTexto(est.desde, ahora) : `entre ${cuandoTexto(est.desde, ahora)} y ${cuandoTexto(est.hasta, ahora)}`;
    return `envío al CP ${this.cp.replace(/\D/g, '').slice(0, 4)} (${est.etiqueta}), llega ${llega}, envío estimado ${formatearPrecio(est.costo)}`;
  },
};

function mensajePedido() {
  const items = Cart.get();
  if (!items.length) return `Hola WAWI! Quiero hacer una consulta. Me interesa ${Entrega.resumen()}.`;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    return `• ${p.nombre} (talle ${i.talle}) x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  });
  return `Hola WAWI! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\nEntrega: ${Entrega.resumen()}.`;
}

function actualizarLinksPedido() {
  const href = wspHref(mensajePedido());
  document.querySelectorAll('[data-wsp-pedido], [data-wsp-entrega]').forEach(a => { a.href = href; });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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
  const desktopMq = window.matchMedia('(min-width: 1024px)');
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
  cart?.addEventListener('click', () => Drawer.abrir(cart));
  sync();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    nuevos.forEach((el, i) => {
      const demora = Math.min(i * 0.05, 0.5);
      el.style.transitionDelay = `${demora}s`;
      el.classList.add('in');
      setTimeout(() => { el.style.transitionDelay = ''; }, (demora + 0.9) * 1000);
    });
  }));
}

function trapFoco(contenedor, e) {
  if (e.key !== 'Tab') return;
  const f = [...contenedor.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function aplicarRecortes(raiz = document) {
  raiz.querySelectorAll('[data-recorte]').forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    el.setAttribute('style', recorte(img, [Number(cx), Number(cy), Number(z)], 1));
  });
}

const filaQty = new Map();

function filaHTML(p) {
  const qty = filaQty.get(p.id) || 1;
  const nom = esc(p.nombre);
  const [w, h] = dims(p.img);
  return `<li class="fila ${tinteClase(p)}" data-id="${p.id}" data-animate="izq" style="opacity:0;transform:translateX(-24px)">
    <button type="button" class="fila-foto recorte" data-qv="${p.id}" aria-label="Ver ${nom}" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"></button>
    <div class="fila-info">
      <p class="fila-nombre"><button type="button" class="fila-link" data-qv="${p.id}">${nom}</button></p>
      <p class="fila-meta">${dotHTML(p)}<span>${esc(p.colorNombre)} · ${esc(p.tela)}</span><span class="fila-cod">${p.cod}</span></p>
      <p class="fila-etqs">${etiquetasHTML(p)}</p>
    </div>
    <div class="fila-precio">${precioHTML(p)}</div>
    <div class="fila-acciones">
      <label class="fila-talle"><span class="sr-only">Talle de ${nom}</span><select class="sel" data-talle><option value="">Talle</option>${p.talles.map(t => `<option value="${t}">${t}</option>`).join('')}</select></label>
      <div class="stepper" role="group" aria-label="Cantidad de ${nom}"><button type="button" data-menos aria-label="Uno menos"${qty <= 1 ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-menos"/></svg></button><span class="stepper-n" data-n>${qty}</span><button type="button" data-mas aria-label="Uno más"${qty >= p.stock ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-mas"/></svg></button></div>
      <button type="button" class="btn-agregar" data-add="${p.id}" aria-label="Agregar ${nom} al pedido"><svg class="i" aria-hidden="true"><use href="#i-carrito-mas"/></svg><span class="lbl-largo">Agregar</span></button>
    </div>
  </li>`;
}

function cardHTML(p) {
  const nom = esc(p.nombre);
  const qty = filaQty.get(p.id) || 1;
  const [w, h] = dims(p.img);
  return `<li class="card ${tinteClase(p)}" data-id="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(46px)">
    <div class="card-media">
      <button type="button" class="card-foto recorte" data-qv="${p.id}" aria-label="Ver ${nom}" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"></button>
      <div class="card-etqs">${p.nuevo ? '<span class="etq etq--nuevo">Nuevo</span>' : ''}${p.stock <= 3 ? '<span class="etq etq--ultimas">Últimas</span>' : ''}</div>
      ${p.descuento > 0 ? `<span class="card-tag">−${p.descuento}%</span>` : ''}
      <div class="card-talles" data-bandeja hidden>
        <div class="card-talles-cab"><span>¿Qué talle?</span><button type="button" data-cerrar-bandeja aria-label="Cerrar los talles"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button></div>
        <div class="card-talles-lista">${p.talles.map(t => `<button type="button" class="chip" data-talle-card="${t}" aria-label="Talle ${t}">${t}</button>`).join('')}</div>
      </div>
    </div>
    <div class="card-cuerpo">
      <p class="card-cat">${esc(getCategoria(p.cat)?.nombre)}</p>
      <h3 class="card-nombre"><button type="button" data-qv="${p.id}"><span>${nom}</span></button></h3>
      ${precioHTML(p)}
      <p class="card-meta">${dotHTML(p)}<span>${esc(p.colorNombre)} · Talles ${esc(rangoTalles(p))}</span></p>
      <div class="prod-actions">
        <div class="stepper" role="group" aria-label="Cantidad de ${nom}"><button type="button" data-menos aria-label="Uno menos"${qty <= 1 ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-menos"/></svg></button><span class="stepper-n" data-n>${qty}</span><button type="button" data-mas aria-label="Uno más"${qty >= p.stock ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-mas"/></svg></button></div>
        <button type="button" class="btn btn-linea prod-add" data-add="${p.id}" aria-label="Agregar ${nom} al carrito"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span><svg class="lbl-icon" aria-hidden="true"><use href="#i-carrito-mas"/></svg></button>
      </div>
    </div>
  </li>`;
}

const Catalogo = {
  cont: null,
  init() {
    this.cont = document.querySelector('[data-catalogo]');
    if (!this.cont) return;
    this.cont.addEventListener('click', e => this.onClick(e));
    this.cont.addEventListener('change', e => {
      const sel = e.target.closest('select[data-talle]');
      if (sel) sel.classList.remove('falta');
    });
    document.querySelectorAll('[data-ver-mas]').forEach(b => b.addEventListener('click', () => {
      estado.visibles += POR_PAGINA;
      this.render({ mantener: true });
    }));
    document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
      limpiarFiltros();
      this.render();
    }));
    document.addEventListener('click', e => {
      if (!e.target.closest('.card-media') && !e.target.closest('[data-add]')) document.querySelectorAll('[data-bandeja]:not([hidden])').forEach(b => { b.hidden = true; });
    });
    this.render();
  },
  render(opciones = {}) {
    if (!this.cont) return;
    const lista = filtrar();
    const visibles = lista.slice(0, estado.visibles);
    const yaHabia = opciones.mantener ? this.cont.children.length : 0;
    const html = visibles.slice(yaHabia).map(p => (ES_M2 ? cardHTML(p) : filaHTML(p))).join('');
    if (opciones.mantener) this.cont.insertAdjacentHTML('beforeend', html);
    else this.cont.innerHTML = html;
    const n = lista.length;
    document.querySelectorAll('[data-result-count]').forEach(el => { el.textContent = n ? cuantas(n) : 'Sin resultados'; });
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = n ? `Ver ${cuantas(n)}` : 'Sin resultados'; });
    document.querySelectorAll('[data-vacio]').forEach(el => { el.hidden = n > 0; });
    document.querySelectorAll('[data-ver-mas]').forEach(el => { el.hidden = visibles.length >= n; });
    document.querySelectorAll('[data-ver-mas-n]').forEach(el => { el.textContent = n > POR_PAGINA ? `Mostrando ${visibles.length} de ${n}` : ''; });
    document.querySelectorAll('[data-limpiar]').forEach(el => { if (!el.closest('[data-vacio]') && !el.closest('.filtros-pie')) el.hidden = !hayFiltros(); });
    sincronizarControles();
    revelarNuevos(this.cont);
    refrescarScroll();
  },
  onClick(e) {
    const qv = e.target.closest('[data-qv]');
    if (qv) { QuickView.abrir(qv.dataset.qv, qv); return; }
    const item = e.target.closest('[data-id]');
    if (!item) return;
    const p = getProducto(item.dataset.id);
    if (!p) return;
    const nEl = item.querySelector('[data-n]');
    if (e.target.closest('[data-menos]') || e.target.closest('[data-mas]')) {
      const actual = filaQty.get(p.id) || 1;
      const nuevo = Math.max(1, Math.min(p.stock, actual + (e.target.closest('[data-mas]') ? 1 : -1)));
      filaQty.set(p.id, nuevo);
      if (nEl) nEl.textContent = nuevo;
      item.querySelector('[data-menos]').disabled = nuevo <= 1;
      item.querySelector('[data-mas]').disabled = nuevo >= p.stock;
      return;
    }
    if (e.target.closest('[data-cerrar-bandeja]')) {
      item.querySelector('[data-bandeja]').hidden = true;
      item.querySelector('[data-add]')?.focus();
      return;
    }
    const chipTalle = e.target.closest('[data-talle-card]');
    if (chipTalle) {
      agregar(p, chipTalle.dataset.talleCard, filaQty.get(p.id) || 1);
      item.querySelector('[data-bandeja]').hidden = true;
      this.resetQty(item, p);
      return;
    }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    if (ES_M2) {
      if (p.talles.length === 1) { agregar(p, p.talles[0], filaQty.get(p.id) || 1); this.resetQty(item, p); return; }
      const bandeja = item.querySelector('[data-bandeja]');
      document.querySelectorAll('[data-bandeja]:not([hidden])').forEach(b => { if (b !== bandeja) b.hidden = true; });
      bandeja.hidden = !bandeja.hidden;
      if (!bandeja.hidden) bandeja.querySelector('[data-talle-card]')?.focus();
      return;
    }
    const sel = item.querySelector('select[data-talle]');
    if (!sel?.value) {
      sel?.classList.remove('falta'); void sel?.offsetWidth; sel?.classList.add('falta');
      sel?.focus();
      showToast('Elegí el talle primero');
      return;
    }
    agregar(p, sel.value, filaQty.get(p.id) || 1);
    add.classList.add('hecho');
    const lbl = add.querySelector('.lbl-largo');
    if (lbl) lbl.textContent = 'Sumado';
    setTimeout(() => { add.classList.remove('hecho'); if (lbl) lbl.textContent = 'Agregar'; }, 1300);
    this.resetQty(item, p);
  },
  resetQty(item, p) {
    filaQty.set(p.id, 1);
    const nEl = item.querySelector('[data-n]');
    if (nEl) nEl.textContent = 1;
    const menos = item.querySelector('[data-menos]');
    if (menos) menos.disabled = true;
    const mas = item.querySelector('[data-mas]');
    if (mas) mas.disabled = p.stock <= 1;
  },
};

function agregar(p, talle, qty = 1) {
  Cart.add(p, String(talle), qty);
  showToast(`Sumaste ${p.nombre} · talle ${talle}${qty > 1 ? ` x${qty}` : ''}`);
}

function limpiarFiltros() {
  estado.cats.clear();
  estado.promo = false;
  estado.q = '';
  estado.talles.clear();
  estado.colores.clear();
  estado.precioMax = null;
  estado.visibles = POR_PAGINA;
  document.querySelectorAll('[data-q]').forEach(i => { i.value = ''; });
  guardarURL();
}

function elegirCategoria(cat) {
  estado.cats.clear();
  estado.promo = false;
  if (cat === 'promo') estado.promo = true;
  else if (cat && cat !== 'todo' && getCategoria(cat)) estado.cats.add(cat);
  estado.visibles = POR_PAGINA;
  guardarURL();
  Catalogo.render();
}

function catActual() {
  if (estado.promo && !estado.cats.size) return 'promo';
  if (estado.cats.size === 1 && !estado.promo) return [...estado.cats][0];
  if (!estado.cats.size && !estado.promo) return 'todo';
  return '';
}

function sincronizarControles() {
  const actual = catActual();
  document.querySelectorAll('.tab[data-cat], .cat-circulo[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === actual)));
  document.querySelectorAll('[data-sel-talle]').forEach(s => { s.value = estado.talles.size === 1 ? [...estado.talles][0] : ''; });
  document.querySelectorAll('[data-sel-color]').forEach(s => { s.value = estado.colores.size === 1 ? [...estado.colores][0] : ''; });
  document.querySelectorAll('[data-sel-orden]').forEach(s => { s.value = estado.orden; });
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.has(i.value); });
  document.querySelectorAll('input[data-f="promo"]').forEach(i => { i.checked = estado.promo; });
  document.querySelectorAll('[data-f-talle]').forEach(b => b.setAttribute('aria-pressed', String(estado.talles.has(b.dataset.fTalle))));
  document.querySelectorAll('[data-f-color]').forEach(b => b.setAttribute('aria-pressed', String(estado.colores.has(b.dataset.fColor))));
  document.querySelectorAll('input[data-f="precio"]').forEach(r => {
    r.value = estado.precioMax ?? r.max;
    const txt = r.closest('.rango')?.querySelector('[data-precio-max]');
    if (txt) txt.textContent = `Hasta ${formatearPrecio(Number(r.value))}`;
  });
  const chips = document.querySelector('[data-chips-activos]');
  if (chips) {
    const out = [];
    if (estado.promo) out.push(['promo', '', 'Promo time']);
    estado.cats.forEach(c => out.push(['cat', c, getCategoria(c)?.nombre]));
    estado.talles.forEach(t => out.push(['talle', t, `Talle ${t}`]));
    estado.colores.forEach(c => out.push(['color', c, getColor(c)?.nombre]));
    if (estado.precioMax != null) out.push(['precio', '', `Hasta ${formatearPrecio(estado.precioMax)}`]);
    if (estado.q.trim()) out.push(['q', '', `«${estado.q.trim()}»`]);
    chips.innerHTML = out.map(([tipo, valor, txt]) => `<button type="button" class="chip-activo" data-quitar="${tipo}" data-valor="${esc(valor)}" aria-label="Quitar el filtro ${esc(txt)}">${esc(txt)}<svg class="i" aria-hidden="true"><use href="#i-x"/></svg></button>`).join('');
  }
}

function guardarURL() {
  try {
    const url = new URL(window.location.href);
    ['cat', 'q'].forEach(k => url.searchParams.delete(k));
    const c = catActual();
    if (c && c !== 'todo') url.searchParams.set('cat', c);
    if (estado.q.trim()) url.searchParams.set('q', estado.q.trim());
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch { /* URL no disponible */ }
}

function leerURL() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat === 'promo') estado.promo = true;
  else if (cat && getCategoria(cat)) estado.cats.add(cat);
  const q = params.get('q');
  if (q) {
    estado.q = q.slice(0, 60);
    document.querySelectorAll('[data-q]').forEach(i => { i.value = estado.q; });
  }
}

function initBuscador() {
  const form = document.querySelector('[data-buscador]');
  const input = form?.querySelector('[data-q]');
  if (!form || !input) return;
  let t = 0;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      estado.q = input.value.slice(0, 60);
      estado.visibles = POR_PAGINA;
      guardarURL();
      Catalogo.render();
    }, 180);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    estado.q = input.value.slice(0, 60);
    estado.visibles = POR_PAGINA;
    guardarURL();
    Catalogo.render();
    input.blur();
    irA('#tienda');
  });
}

function initCategorias() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-cat]');
    if (!el || el.closest('[data-catalogo]')) return;
    e.preventDefault();
    elegirCategoria(el.dataset.cat);
    if (el.closest('.tabs') || el.closest('.cat-circulos')) {
      if (el.closest('.cat-circulos')) irA('#tienda');
      return;
    }
    irA('#tienda');
  });
  const counts = { todo: PRODUCTOS.length, promo: PRODUCTOS.filter(p => p.descuento > 0).length };
  CATEGORIAS.forEach(c => { counts[c.id] = PRODUCTOS.filter(p => p.cat === c.id).length; });
  document.querySelectorAll('[data-count]').forEach(el => { if (counts[el.dataset.count] != null) el.textContent = counts[el.dataset.count]; });
}

function initListaSelects() {
  const selTalle = document.querySelector('[data-sel-talle]');
  if (selTalle) {
    selTalle.insertAdjacentHTML('beforeend', `<optgroup label="Corpiños y conjuntos">${TALLES_CORPINO.map(t => `<option value="${t}">Talle ${t}</option>`).join('')}</optgroup><optgroup label="Bombachas, bikinis y camisones">${TALLES_PRENDA.map(t => `<option value="${t}">Talle ${t}</option>`).join('')}</optgroup>`);
    selTalle.addEventListener('change', () => {
      estado.talles.clear();
      if (selTalle.value) estado.talles.add(selTalle.value);
      estado.visibles = POR_PAGINA;
      Catalogo.render();
    });
  }
  const selColor = document.querySelector('[data-sel-color]');
  if (selColor) {
    const usados = COLORES.filter(c => PRODUCTOS.some(p => p.color === c.id));
    selColor.insertAdjacentHTML('beforeend', usados.map(c => `<option value="${c.id}">${c.nombre}</option>`).join(''));
    selColor.addEventListener('change', () => {
      estado.colores.clear();
      if (selColor.value) estado.colores.add(selColor.value);
      estado.visibles = POR_PAGINA;
      Catalogo.render();
    });
  }
  document.querySelectorAll('[data-sel-orden]').forEach(sel => sel.addEventListener('change', () => {
    estado.orden = sel.value;
    estado.visibles = POR_PAGINA;
    Catalogo.render();
  }));
}

function initFiltros() {
  const panel = document.querySelector('[data-filtros]');
  if (!panel) return;
  const cats = panel.querySelector('[data-f-cats]');
  if (cats) cats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="check-n">${PRODUCTOS.filter(p => p.cat === c.id).length}</span></label>`).join('');
  const talles = panel.querySelector('[data-f-talles]');
  if (talles) talles.innerHTML = [...TALLES_CORPINO, ...TALLES_PRENDA].map(t => `<button type="button" class="chip" data-f-talle="${t}" aria-pressed="false">${t}</button>`).join('');
  const colores = panel.querySelector('[data-f-colores]');
  if (colores) {
    colores.innerHTML = COLORES.filter(c => PRODUCTOS.some(p => p.color === c.id)).map(c => (
      c.hex ? `<button type="button" class="swatch" data-f-color="${c.id}" aria-pressed="false" aria-label="${c.nombre}" title="${c.nombre}" style="--c:${c.hex}"></button>`
        : `<button type="button" class="swatch dot--estampado" data-f-color="${c.id}" aria-pressed="false" aria-label="${c.nombre}" title="${c.nombre}"></button>`
    )).join('');
  }
  const rango = panel.querySelector('input[data-f="precio"]');
  if (rango) {
    const min = Math.floor(PRECIO_MIN / 1000) * 1000;
    const max = Math.ceil(PRECIO_MAX / 1000) * 1000;
    rango.min = String(min);
    rango.max = String(max);
    rango.step = '1000';
    rango.value = String(max);
    const desde = panel.querySelector('[data-precio-min]');
    if (desde) desde.textContent = `Desde ${formatearPrecio(PRECIO_MIN)}`;
    let t = 0;
    rango.addEventListener('input', () => {
      const v = Number(rango.value);
      const txt = panel.querySelector('[data-precio-max]');
      if (txt) txt.textContent = `Hasta ${formatearPrecio(v)}`;
      clearTimeout(t);
      t = setTimeout(() => {
        estado.precioMax = v >= max ? null : v;
        estado.visibles = POR_PAGINA;
        Catalogo.render();
      }, 120);
    });
  }
  panel.addEventListener('change', e => {
    const input = e.target.closest('input[data-f]');
    if (!input || input.dataset.f === 'precio') return;
    if (input.dataset.f === 'cat') { if (input.checked) estado.cats.add(input.value); else estado.cats.delete(input.value); }
    if (input.dataset.f === 'promo') estado.promo = input.checked;
    estado.visibles = POR_PAGINA;
    guardarURL();
    Catalogo.render();
  });
  panel.addEventListener('click', e => {
    const t = e.target.closest('[data-f-talle]');
    const c = e.target.closest('[data-f-color]');
    if (!t && !c) return;
    const set = t ? estado.talles : estado.colores;
    const v = t ? t.dataset.fTalle : c.dataset.fColor;
    if (set.has(v)) set.delete(v); else set.add(v);
    estado.visibles = POR_PAGINA;
    Catalogo.render();
  });
  document.querySelector('[data-chips-activos]')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const v = b.dataset.valor;
    ({
      promo: () => { estado.promo = false; },
      cat: () => estado.cats.delete(v),
      talle: () => estado.talles.delete(v),
      color: () => estado.colores.delete(v),
      precio: () => { estado.precioMax = null; },
      q: () => { estado.q = ''; document.querySelectorAll('[data-q]').forEach(i => { i.value = ''; }); },
    })[b.dataset.quitar]?.();
    estado.visibles = POR_PAGINA;
    guardarURL();
    Catalogo.render();
  });
  const abrir = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(max-width: 1024px)');
  let fondo = null;
  let volver = null;
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    fondo?.remove();
    fondo = null;
    document.body.classList.remove('no-scroll');
    abrir?.setAttribute('aria-expanded', 'false');
    volver?.focus();
  };
  abrir?.addEventListener('click', () => {
    volver = abrir;
    panel.classList.add('open');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    fondo = document.createElement('div');
    fondo.className = 'filtros-fondo';
    fondo.addEventListener('click', cerrar);
    document.body.appendChild(fondo);
    document.body.classList.add('no-scroll');
    abrir.setAttribute('aria-expanded', 'true');
    panel.querySelector('button, input')?.focus();
  });
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => {
    cerrar();
    if (b.hasAttribute('data-ver-n')) irA('#tienda');
  }));
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    else trapFoco(panel, e);
  });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

const PanelPedido = {
  init() {
    this.el = document.querySelector('[data-panel-pedido]');
    if (!this.el) return;
    this.lineas = this.el.querySelector('[data-pedido-lineas]');
    this.total = this.el.querySelector('[data-pedido-total]');
    this.vacio = this.el.querySelector('[data-pedido-vacio]');
    this.n = this.el.querySelector('[data-pedido-n]');
    this.prev = Cart.total();
    this.el.addEventListener('click', e => {
      const q = e.target.closest('[data-quitar-linea]');
      if (!q) return;
      const [id, talle] = q.dataset.quitarLinea.split('|');
      Cart.remove(id, talle);
    });
    document.addEventListener('cart:updated', () => this.render(true));
    this.render(false);
  },
  render(animar) {
    const items = Cart.get();
    const antes = new Set([...this.lineas.querySelectorAll('[data-linea]')].map(li => li.dataset.linea));
    this.lineas.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      const clave = `${i.id}|${i.talle}`;
      const nueva = animar && !antes.has(clave);
      return `<li class="pedido-linea ${tinteClase(p)}" data-linea="${clave}"${nueva ? '' : ' style="animation:none"'}>
        <span class="recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="" width="${dims(p.img)[0]}" height="${dims(p.img)[1]}"></span>
        <span><span class="pl-nombre">${esc(p.nombre)}</span><span class="pl-det">Talle ${i.talle} · x${i.qty}</span></span>
        <span class="pl-der"><span class="pl-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="pl-quitar" data-quitar-linea="${clave}" aria-label="Quitar ${esc(p.nombre)} talle ${i.talle}">Quitar</button></span>
      </li>`;
    }).join('');
    const total = Cart.total();
    this.vacio.hidden = items.length > 0;
    this.n.textContent = cuantas(Cart.count());
    this.total.textContent = formatearPrecio(total);
    if (animar && total > this.prev) { this.total.classList.remove('sube'); void this.total.offsetWidth; this.total.classList.add('sube'); }
    this.prev = total;
    const ultima = this.lineas.lastElementChild;
    if (animar && ultima) this.lineas.scrollTop = this.lineas.scrollHeight;
  },
};

const Drawer = {
  volver: null,
  init() {
    this.el = document.querySelector('[data-drawer]');
    this.fondo = document.querySelector('[data-drawer-fondo]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-cart-cuerpo]');
    this.pie = this.el.querySelector('[data-cart-pie]');
    document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => this.abrir(b)));
    this.el.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    this.fondo?.addEventListener('click', () => this.cerrar());
    this.el.addEventListener('keydown', e => {
      if (e.key !== 'Escape') trapFoco(this.el, e);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this.el.hidden) this.cerrar();
    });
    this.el.addEventListener('click', e => {
      const linea = e.target.closest('[data-linea]');
      if (e.target.closest('[data-ir-tienda]')) { this.cerrar(); irA('#tienda'); return; }
      if (e.target.closest('[data-ir-envios]')) { e.preventDefault(); this.cerrar(); irA('#envios'); return; }
      if (e.target.closest('[data-finalizar]')) return;
      if (!linea) return;
      const [id, talle] = linea.dataset.linea.split('|');
      const it = Cart.get().find(i => i.id === id && i.talle === talle);
      if (!it) return;
      if (e.target.closest('[data-quitar]')) Cart.remove(id, talle);
      else if (e.target.closest('[data-menos]')) { if (it.qty <= 1) Cart.remove(id, talle); else Cart.setQty(id, talle, it.qty - 1); }
      else if (e.target.closest('[data-mas]')) Cart.setQty(id, talle, it.qty + 1);
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('entrega:updated', () => this.render());
    this.render();
  },
  render() {
    const items = Cart.get();
    const activo = this.el.contains(document.activeElement) ? document.activeElement : null;
    const clave = activo?.closest('[data-linea]')?.dataset.linea;
    const control = activo ? ['data-mas', 'data-menos'].find(a => activo.hasAttribute(a)) : null;
    const devolver = () => {
      if (!activo || this.el.hidden) return;
      const nuevo = clave && control ? this.el.querySelector(`[data-linea="${clave}"] [${control}]`) : null;
      if (nuevo && !nuevo.disabled) nuevo.focus();
      else if (!this.el.contains(document.activeElement)) this.el.focus();
    };
    if (!items.length) {
      this.cuerpo.innerHTML = `<div class="drawer-vacio"><svg class="i" aria-hidden="true"><use href="#i-mono"/></svg><p class="drawer-vacio-tit">Tu pedido está vacío</p><p>Elegí una prenda, tu talle, y aparece acá.</p><button type="button" class="btn btn-cta" data-ir-tienda>Ir a la tienda</button></div>`;
      this.pie.innerHTML = '';
      devolver();
      return;
    }
    this.cuerpo.innerHTML = `<ul class="drawer-lineas">${items.map(i => {
      const p = getProducto(i.id);
      const stockLibre = p.stock - items.filter(x => x.id === i.id && x.talle !== i.talle).reduce((s, x) => s + x.qty, 0);
      return `<li class="dl ${tinteClase(p)}" data-linea="${i.id}|${i.talle}">
        <span class="recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="" width="${dims(p.img)[0]}" height="${dims(p.img)[1]}"></span>
        <div>
          <p class="dl-nombre">${esc(p.nombre)}</p>
          <p class="dl-det">Talle ${i.talle} · ${esc(p.colorNombre)}</p>
          <div class="dl-pie">
            <span class="dl-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
            <span class="dl-acciones">
              <span class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-menos aria-label="Uno menos"><svg class="i" aria-hidden="true"><use href="#i-menos"/></svg></button><span class="stepper-n">${i.qty}</span><button type="button" data-mas aria-label="Uno más"${i.qty >= stockLibre ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-mas"/></svg></button></span>
              <button type="button" class="dl-quitar" data-quitar aria-label="Quitar ${esc(p.nombre)}"><svg class="i" aria-hidden="true"><use href="#i-basura"/></svg></button>
            </span>
          </div>
        </div>
      </li>`;
    }).join('')}</ul>`;
    this.pie.innerHTML = `<div class="dp-total"><span>Total · ${cuantas(Cart.count())}</span><strong>${formatearPrecio(Cart.total())}</strong></div>
      <p class="dp-nota">Entrega: ${esc(Entrega.resumen())}. <a href="#envios" data-ir-envios>Cambiar</a></p>
      <button type="button" class="btn btn-cta btn-bloque" data-finalizar>Finalizar compra</button>
      <a class="btn btn-wsp btn-bloque" href="${wspHref(mensajePedido())}" target="_blank" rel="noopener" data-wsp-pedido><svg class="i" aria-hidden="true"><use href="#i-wsp"/></svg>Enviar pedido por WhatsApp</a>`;
    devolver();
  },
  abrir(origen) {
    if (!this.el) return;
    this.volver = origen || document.activeElement;
    this.render();
    this.el.hidden = false;
    this.fondo.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { this.el.classList.add('open'); this.fondo.classList.add('open'); this.el.focus(); });
  },
  cerrar() {
    if (!this.el || this.el.hidden) return;
    this.el.classList.remove('open');
    this.fondo.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { this.el.hidden = true; this.fondo.hidden = true; }, reduceMotion ? 0 : 380);
    this.volver?.focus?.();
  },
};

function initFinalizar() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-finalizar]');
    if (!b) return;
    if (!Cart.count()) {
      showToast('Tu pedido está vacío: sumá una prenda primero');
      return;
    }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}

const QuickView = {
  actual: null,
  talle: '',
  qty: 1,
  volver: null,
  init() {
    this.fondo = document.querySelector('[data-qv-fondo]');
    this.modal = document.querySelector('[data-qv-modal]');
    if (!this.fondo || !this.modal) return;
    this.cuerpo = this.modal.querySelector('[data-qv-cuerpo]');
    this.fondo.addEventListener('click', e => { if (e.target === this.fondo) this.cerrar(); });
    this.modal.querySelectorAll('[data-close-qv]').forEach(b => b.addEventListener('click', () => this.cerrar()));
    this.modal.addEventListener('keydown', e => {
      if (e.key !== 'Escape') trapFoco(this.modal, e);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this.fondo.hidden) this.cerrar();
    });
    this.modal.addEventListener('click', e => this.onClick(e));
    const slug = new URLSearchParams(window.location.search).get('producto');
    if (slug && getProducto(slug)) this.abrir(slug, null);
  },
  vistas(p) {
    return [[p.img, p.foco], ...(p.vistas || [])];
  },
  render() {
    const p = this.actual;
    const vistas = this.vistas(p);
    const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => a.rank - b.rank).slice(0, 3);
    const cat = getCategoria(p.cat);
    const [w, h] = dims(p.img);
    this.cuerpo.innerHTML = `<div class="qv ${tinteClase(p)}">
      <div class="qv-galeria">
        <div class="qv-foto recorte" data-qv-foto style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"></div>
        ${vistas.length > 1 ? `<div class="qv-thumbs">${vistas.map(([img, foco], k) => `<button type="button" class="qv-thumb recorte" data-qv-vista="${k}" aria-pressed="${k === 0}" aria-label="Ver la foto ${k + 1} de ${vistas.length}" style="${recorte(img, foco, 1)}"><img src="images/${img}" alt="" width="${dims(img)[0]}" height="${dims(img)[1]}"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv-info">
        <span class="qv-cat">${esc(cat?.nombre)}</span>
        <p class="qv-nombre">${esc(p.nombre)}</p>
        <p class="qv-meta">${dotHTML(p)}<span>${esc(p.colorNombre)} · ${esc(p.tela)} · ${p.cod}</span></p>
        <div class="qv-precio">${precioHTML(p)}</div>
        <div class="fila-etqs">${etiquetasHTML(p)}</div>
        <p class="qv-desc">${esc(p.desc)}</p>
        <p class="qv-talles-tit" id="qvTallesTit">Elegí tu talle</p>
        <div class="qv-talles" role="group" aria-labelledby="qvTallesTit">${p.talles.map(t => `<button type="button" class="chip" data-qv-talle="${t}" aria-pressed="${this.talle === t}">${t}</button>`).join('')}</div>
        <div class="qv-acciones">
          <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-menos aria-label="Uno menos"${this.qty <= 1 ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-menos"/></svg></button><span class="stepper-n" data-qv-n>${this.qty}</span><button type="button" data-qv-mas aria-label="Uno más"${this.qty >= p.stock ? ' disabled' : ''}><svg class="i" aria-hidden="true"><use href="#i-mas"/></svg></button></div>
          <button type="button" class="btn btn-ghost" data-qv-add>Agregar</button>
          <button type="button" class="btn btn-cta" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv-ayuda" href="${wspHref(`Hola WAWI! Tengo una duda con el talle de ${p.nombre} (${p.cod}).`)}" target="_blank" rel="noopener"><svg class="i" aria-hidden="true"><use href="#i-wsp"/></svg>¿Dudas con el talle? Preguntanos</a>
        ${rel.length ? `<p class="qv-rel-tit">También te puede interesar</p><div class="qv-rel">${rel.map(x => `<button type="button" class="qv-rel-item ${tinteClase(x)}" data-qv-rel="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="${dims(x.img)[0]}" height="${dims(x.img)[1]}"></span><span>${esc(x.nombre)}</span><span>${formatearPrecio(precioFinal(x))}</span></button>`).join('')}</div>` : ''}
      </div>
    </div>`;
  },
  abrir(id, origen) {
    const p = getProducto(id);
    if (!p || !this.modal) return;
    if (this.fondo.hidden) this.volver = origen || document.activeElement;
    this.actual = p;
    this.talle = p.talles.length === 1 ? p.talles[0] : '';
    this.qty = 1;
    this.render();
    this.jsonLd(p);
    this.fondo.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { this.fondo.classList.add('open'); this.modal.focus(); });
    this.modal.scrollTop = 0;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('producto', p.id);
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch { /* sin history */ }
  },
  cerrar() {
    if (!this.fondo || this.fondo.hidden) return;
    this.fondo.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { this.fondo.hidden = true; }, reduceMotion ? 0 : 260);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('producto');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch { /* sin history */ }
    this.volver?.focus?.();
  },
  jsonLd(p) {
    let s = document.getElementById('ldProducto');
    if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nombre,
      sku: p.cod,
      image: `https://gokywebs.com/demo/wawilenceria/images/${p.img}`,
      description: p.desc,
      brand: { '@type': 'Brand', name: 'WAWI Lencería' },
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  },
  onClick(e) {
    const p = this.actual;
    if (!p) return;
    const vista = e.target.closest('[data-qv-vista]');
    if (vista) {
      const [img, foco] = this.vistas(p)[Number(vista.dataset.qvVista)];
      const foto = this.cuerpo.querySelector('[data-qv-foto]');
      foto.setAttribute('style', recorte(img, foco, 1));
      const im = foto.querySelector('img');
      im.src = `images/${img}`;
      im.width = dims(img)[0];
      im.height = dims(img)[1];
      this.cuerpo.querySelectorAll('[data-qv-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    const talle = e.target.closest('[data-qv-talle]');
    if (talle) {
      this.talle = talle.dataset.qvTalle;
      this.cuerpo.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === talle)));
      return;
    }
    if (e.target.closest('[data-qv-menos]') || e.target.closest('[data-qv-mas]')) {
      this.qty = Math.max(1, Math.min(p.stock, this.qty + (e.target.closest('[data-qv-mas]') ? 1 : -1)));
      this.cuerpo.querySelector('[data-qv-n]').textContent = this.qty;
      this.cuerpo.querySelector('[data-qv-menos]').disabled = this.qty <= 1;
      this.cuerpo.querySelector('[data-qv-mas]').disabled = this.qty >= p.stock;
      return;
    }
    const add = e.target.closest('[data-qv-add]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (add || comprar) {
      if (!this.talle) {
        const grupo = this.cuerpo.querySelector('.qv-talles');
        grupo.classList.remove('falta'); void grupo.offsetWidth; grupo.classList.add('falta');
        grupo.querySelector('button')?.focus();
        showToast('Elegí tu talle primero');
        return;
      }
      agregar(p, this.talle, this.qty);
      if (comprar) {
        const volver = this.volver;
        this.cerrar();
        Drawer.abrir(volver);
      }
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) this.abrir(rel.dataset.qvRel, this.volver);
  },
};

function initEntrega() {
  const raiz = document.getElementById('envios');
  if (!raiz) return;
  const botones = raiz.querySelectorAll('[data-modo]');
  const cpWrap = raiz.querySelector('[data-cp-wrap]');
  const cp = raiz.querySelector('[data-cp]');
  const ayuda = raiz.querySelector('[data-cp-ayuda]');
  const semana = raiz.querySelector('[data-semana]');
  const res = raiz.querySelector('[data-resultado]');
  const estadoEl = document.querySelector('[data-estado-local]');
  if (cp) cp.value = Entrega.cp;

  const pintarEstado = () => {
    if (!estadoEl) return;
    const s = estadoLocal(new Date());
    estadoEl.className = `local-estado ${s.abierto ? 'abierto' : 'cerrado'}`;
    estadoEl.innerHTML = `<span class="punto-vivo" aria-hidden="true"></span>${esc(s.texto)}`;
  };

  const pintar = (animar = false) => {
    const ahora = new Date();
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === Entrega.modo)));
    cpWrap.hidden = Entrega.modo !== 'envio';
    let dSale = -1;
    let dDesde = -1;
    let dHasta = -1;
    let html;
    const items = Cart.count();
    const total = Cart.total();
    if (Entrega.modo === 'retiro') {
      const t = listoRetiro(ahora);
      dSale = t ? diasEntre(ahora, t) : -1;
      const cuando = t ? cuandoTexto(t, ahora) : '';
      html = `<p class="res-kicker"><svg class="i" aria-hidden="true"><use href="#i-local"/></svg>Retiro en el local</p>
        <p class="res-grande">${t ? `${cuando.charAt(0).toUpperCase() + cuando.slice(1)} desde las ${horaTexto(t)}` : 'Consultanos el día'}</p>
        <p class="res-det">Lo preparamos y te avisamos por WhatsApp cuando esté listo para retirar.</p>
        <p class="res-total">${items ? `Tu pedido: ${cuantas(items)} · ${formatearPrecio(total)}` : 'Tu pedido está vacío: sumá prendas desde la tienda.'}</p>`;
      cp?.removeAttribute('aria-invalid');
    } else {
      const z = zonaCP(Entrega.cp);
      if (!z || z === 'invalido') {
        const escribio = Entrega.cp.replace(/\D/g, '').length >= 4;
        if (cp) { if (escribio) cp.setAttribute('aria-invalid', 'true'); else cp.removeAttribute('aria-invalid'); }
        if (ayuda) ayuda.textContent = escribio ? 'Ese código postal no nos cierra: revisá los 4 números.' : 'Con los 4 números alcanza.';
        html = `<p class="res-kicker"><svg class="i" aria-hidden="true"><use href="#i-camion"/></svg>Envío a tu casa</p>
          <p class="res-grande">Poné tu código postal</p>
          <p class="res-det">Moto en CABA y GBA, correo al resto del país.</p>
          <p class="res-total">${items ? `Tu pedido: ${cuantas(items)} · ${formatearPrecio(total)}` : 'Tu pedido está vacío: sumá prendas desde la tienda.'}</p>`;
      } else {
        cp?.removeAttribute('aria-invalid');
        const est = estimacionEnvio(z, ahora);
        dDesde = diasEntre(ahora, est.desde);
        dHasta = diasEntre(ahora, est.hasta);
        dSale = dDesde;
        const llega = est.min === est.max ? `Llega ${cuandoTexto(est.desde, ahora)}` : `Llega entre ${cuandoTexto(est.desde, ahora)} y ${cuandoTexto(est.hasta, ahora)}`;
        if (ayuda) ayuda.textContent = z === 'caba' ? 'Estás en CABA: te lo lleva una moto.' : z === 'gba' ? 'Estás en el Gran Buenos Aires: te lo lleva una moto.' : 'Te lo mandamos por correo.';
        html = `<p class="res-kicker"><svg class="i" aria-hidden="true"><use href="#i-camion"/></svg>${esc(est.nombre)}</p>
          <p class="res-grande">${esc(llega)}</p>
          <p class="res-det">Envío estimado ${formatearPrecio(est.costo)}. Lo confirmamos por WhatsApp.</p>
          <p class="res-total">${items ? `Tu pedido ${formatearPrecio(total)} + envío ${formatearPrecio(est.costo)} = ${formatearPrecio(total + est.costo)}` : `Tu pedido está vacío: el envío estimado es ${formatearPrecio(est.costo)}.`}</p>`;
      }
    }
    if (res.innerHTML !== html) {
      res.innerHTML = html;
      if (animar && !reduceMotion) { res.classList.remove('cambia'); void res.offsetWidth; res.classList.add('cambia'); }
    }
    if (semana) {
      semana.innerHTML = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(ahora);
        d.setDate(d.getDate() + i);
        const h = HORARIOS[d.getDay()];
        const nombre = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DIAS[d.getDay()];
        const clases = ['dia'];
        if (!h) clases.push('dia--cerrado');
        if (i === 0) clases.push('dia--hoy');
        if (i === dSale) clases.push('dia--sale');
        else if (dDesde >= 0 && i > dDesde && i <= dHasta) clases.push('dia--rango');
        return `<div class="${clases.join(' ')}"><span class="dia-nombre">${nombre}</span><span class="dia-num">${d.getDate()}</span><span class="dia-hora">${h ? `${h[0]} a ${h[1]} h` : 'Cerrado'}</span></div>`;
      }).join('');
    }
    pintarEstado();
    actualizarLinksPedido();
  };

  botones.forEach(b => b.addEventListener('click', () => {
    Entrega.modo = b.dataset.modo;
    Entrega.guardar();
    pintar(true);
    if (Entrega.modo === 'envio' && !zonaCP(Entrega.cp)) cp?.focus();
  }));
  cp?.addEventListener('input', () => {
    const limpio = cp.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 8).toUpperCase();
    if (cp.value !== limpio) cp.value = limpio;
    Entrega.cp = limpio;
    Entrega.guardar();
    pintar(true);
  });
  document.addEventListener('cart:updated', () => pintar(false));
  window.setInterval(() => pintar(false), 60000);
  pintar(false);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  const crear = () => {
    if (typeof L === 'undefined' || el.dataset.listo) return;
    el.dataset.listo = '1';
    const mapa = L.map(el, { zoomControl: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false, dragging: false }).setView(MAPA_COORDS, 15);
    mapa.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    const icono = L.divIcon({ className: '', html: '<div class="pin-wawi"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-mono"/></svg></div>', iconSize: [46, 46], iconAnchor: [23, 56] });
    L.marker(MAPA_COORDS, { icon: icono, keyboard: false, interactive: false }).addTo(mapa);
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { crear(); io.disconnect(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
}

function initVuelta() {
  const track = document.querySelector('[data-vuelta]');
  const aro = document.querySelector('[data-aro]');
  const info = document.querySelector('[data-vuelta-info]');
  if (!track || !aro || !info) return;
  const seccion = track.closest('.vuelta');
  const prods = PRODUCTOS.filter(p => p.descuento > 0).sort((a, b) => a.rank - b.rank);
  const n = prods.length;
  if (!n) return;
  const paso = 360 / n;
  aro.insertAdjacentHTML('beforeend', prods.map((p, i) => {
    const [w, h] = dims(p.img);
    return `<div class="giro ${tinteClase(p)}" data-giro="${i}"><span class="giro-clip"></span><span class="giro-foto recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="" width="${w}" height="${h}"></span><p class="giro-nombre">${esc(p.nombre)}</p><span class="giro-tag">−${p.descuento}%</span></div>`;
  }).join(''));
  const cards = [...aro.querySelectorAll('.giro')];
  const estatico = reduceMotion;
  if (estatico) seccion.classList.add('is-static');
  let R = 240;
  let actual = -1;
  let theta = 0;

  const TILT = (10 * Math.PI) / 180;
  const PERSP = 1500;
  const HILO = 22;
  const medir = () => {
    const cw = cards[0].offsetWidth || 180;
    R = cw * 1.35;
    const yd = cards[0].offsetTop - HILO;
    const sAtras = PERSP / (PERSP + 2 * R * Math.cos(TILT));
    const sLado = PERSP / (PERSP + R * Math.cos(TILT));
    const alto = 2 * R * Math.sin(TILT) * sAtras;
    aro.style.perspectiveOrigin = `50% ${yd.toFixed(0)}px`;
    seccion.style.setProperty('--r', `${R.toFixed(0)}px`);
    aro.style.setProperty('--disco-w', `${(2 * R * sLado * 0.94 + cw * 0.3).toFixed(0)}px`);
    aro.style.setProperty('--disco-h', `${(alto + 20).toFixed(0)}px`);
    aro.style.setProperty('--disco-top', `${(yd - alto - 12).toFixed(0)}px`);
    aro.style.setProperty('--poste-top', `${(yd - alto / 2).toFixed(0)}px`);
  };

  const pintar = th => {
    cards.forEach((c, i) => {
      let a = i * paso - th;
      a = ((((a + 180) % 360) + 360) % 360) - 180;
      const rad = (a * Math.PI) / 180;
      const cos = Math.cos(rad);
      const x = Math.sin(rad) * R;
      const z = (cos - 1) * R;
      const giroY = Math.abs(a) <= 90 ? a : Math.sign(a) * (180 - Math.abs(a));
      c.style.transform = `rotateX(-10deg) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${giroY.toFixed(1)}deg)`;
      c.style.zIndex = String(Math.round(100 + cos * 100));
      c.style.opacity = (0.3 + (0.7 * (cos + 1)) / 2).toFixed(3);
      c.classList.toggle('frente', Math.abs(a) < paso / 2);
    });
    seccion.style.setProperty('--giro-em', `${(-7 + (th / (paso * (n - 1) || 1)) * 14).toFixed(2)}deg`);
  };

  const renderInfo = idx => {
    const p = prods[idx];
    info.innerHTML = `<div class="vi-fila vi-anim"><span class="vi-n">${pad2(idx + 1)} / ${pad2(n)}</span><span class="etq etq--promo">−${p.descuento}%</span>
        <span class="vi-flechas"><button type="button" data-vi="-1" aria-label="Prenda anterior del exhibidor"><svg class="i" aria-hidden="true"><use href="#i-izq"/></svg></button><button type="button" data-vi="1" aria-label="Prenda siguiente del exhibidor"><svg class="i" aria-hidden="true"><use href="#i-der"/></svg></button></span></div>
      <p class="vi-nombre vi-anim"><button type="button" class="vi-ver" data-vi-ver="${p.id}">${esc(p.nombre)}</button></p>
      <div class="vi-precio vi-anim">${precioHTML(p)}</div>
      <p class="vi-talles-tit vi-anim">Tocá tu talle y se suma al pedido</p>
      <div class="vi-talles vi-anim" role="group" aria-label="Talles de ${esc(p.nombre)}">${p.talles.map(t => `<button type="button" class="chip-talle" data-vi-talle="${t}" aria-label="Sumar ${esc(p.nombre)} talle ${t}">${t}</button>`).join('')}</div>`;
  };

  const ir = idx => {
    const k = ((idx % n) + n) % n;
    if (estatico) {
      theta = k * paso;
      pintar(theta);
      actual = k;
      renderInfo(k);
      return;
    }
    const off = offModelos();
    const top = track.getBoundingClientRect().top + window.scrollY;
    const recorrido = track.offsetHeight - (window.innerHeight - off);
    const y = top - off + (recorrido * k) / (n - 1);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const meseta = f => {
    if (f < 0.3) return 0;
    if (f > 0.7) return 1;
    const x = (f - 0.3) / 0.4;
    return x * x * (3 - 2 * x);
  };

  const calcular = () => {
    const off = offModelos();
    const r = track.getBoundingClientRect();
    if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
    const recorrido = r.height - (window.innerHeight - off);
    const p = recorrido > 0 ? clamp01((off - r.top) / recorrido) : 0;
    const t = p * (n - 1);
    const k = Math.min(n - 1, Math.floor(t));
    theta = paso * (k + (k < n - 1 ? meseta(t - k) : 0));
    pintar(theta);
    const idx = Math.round(theta / paso) % n;
    if (idx !== actual) { actual = idx; renderInfo(idx); }
  };

  info.addEventListener('click', e => {
    const flecha = e.target.closest('[data-vi]');
    if (flecha) { ir(actual + Number(flecha.dataset.vi)); return; }
    const ver = e.target.closest('[data-vi-ver]');
    if (ver) { QuickView.abrir(ver.dataset.viVer, ver); return; }
    const chip = e.target.closest('[data-vi-talle]');
    if (!chip) return;
    const p = prods[actual];
    agregar(p, chip.dataset.viTalle, 1);
    chip.classList.add('sumado');
    setTimeout(() => chip.classList.remove('sumado'), 1200);
  });
  aro.addEventListener('click', e => {
    const c = e.target.closest('[data-giro]');
    if (!c) return;
    const i = Number(c.dataset.giro);
    if (i === actual) QuickView.abrir(prods[i].id, c);
    else ir(i);
  });

  medir();
  if (estatico) {
    ir(0);
    window.addEventListener('resize', () => { medir(); pintar(theta); });
    return;
  }
  let pedido = 0;
  const pedir = () => { if (!pedido) pedido = requestAnimationFrame(() => { pedido = 0; calcular(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); });
  window.addEventListener('load', () => { medir(); calcular(); });
  pintar(0);
  actual = 0;
  renderInfo(0);
  calcular();
}

function initCountdown() {
  const els = document.querySelectorAll('[data-countdown]');
  if (!els.length) return;
  let fin = finPromo();
  const tick = () => {
    const ahora = new Date();
    if (fin <= ahora) fin = finPromo(ahora);
    const t = textoCuenta(fin - ahora);
    els.forEach(el => { if (el.textContent !== t) el.textContent = t; });
  };
  tick();
  window.setInterval(tick, 1000);
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const h1 = document.querySelector('.h1');
  if (!h1) return;
  document.body.classList.add('entrando');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => document.body.classList.remove('entrando') });
  tl.fromTo(h1.querySelector('.h1-a'), { yPercent: 18, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }, { yPercent: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, clearProps: 'clipPath,transform,opacity' })
    .from(h1.querySelectorAll('.arcoiris span'), { y: -34, rotation: () => gsap.utils.random(-18, 18), opacity: 0, duration: .75, ease: 'back.out(2.2)', stagger: .06 }, '-=.55')
    .from(h1.querySelector('.h1-b'), { scale: .8, rotation: -12, opacity: 0, duration: .6, ease: 'back.out(2)' }, '-=.35')
    .from('.tienda-bajada', { y: 18, opacity: 0, duration: .6 }, '-=.4')
    .from('.sello', { scale: .6, rotation: -40, opacity: 0, duration: .8, ease: 'back.out(1.8)' }, '-=.6');
  const pops = document.querySelectorAll('.tabs .tab, .cat-circulos .cat-circulo');
  if (pops.length) tl.from(pops, { y: 22, scale: .92, opacity: 0, duration: .55, stagger: .06, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, '-=.55');
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.querySelector('.cierre-foto img');
  if (img) {
    gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

document.addEventListener('cart:updated', actualizarLinksPedido);

Entrega.cargar();
leerURL();
aplicarRecortes();
initModelBarScroll();
initCountdown();
initCategorias();
initListaSelects();
initFiltros();
Catalogo.init();
initBuscador();
PanelPedido.init();
Drawer.init();
QuickView.init();
initFinalizar();
initEntrega();
initVuelta();
initReveals();
initNav();
initFloats();
updateCartBadge();
actualizarLinksPedido();
initMapa();
initHero();
initParallax();
