const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491159222799';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const fmtNum = (n, d = 1) => Number(n).toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtCant = q => (Number.isInteger(q) ? String(q) : fmtNum(q, 1));
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const tramo = (p, a, b) => clamp01((p - a) / (b - a));
const suave = t => t * t * (3 - 2 * t);
const mezcla = (a, b, t) => a + (b - a) * t;
const normalizar = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const redondear = q => Math.round(q * 2) / 2;
const arribaMedio = v => Math.ceil(v * 2 - 1e-9) / 2;

const ICON = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
};

const IMG = {
  'dormitorio.webp': [1080, 1373],
  'toallas.webp': [1005, 900],
  'toallas-detalle.webp': [714, 488],
  'manta-detalle.webp': [1092, 488],
  'cortinas-ojales.webp': [1092, 687],
  'cortinas-largas.webp': [988, 570],
  'rollers.webp': [988, 609],
  'telas-rollos.webp': [714, 687],
  'telas-estantes.webp': [689, 570],
  'barrales.webp': [689, 609],
};

const COLORES = {
  blanco: ['Blanco', '#FFFFFF'],
  crudo: ['Crudo', '#EFE7D8'],
  arena: ['Arena', '#DCC8A8'],
  'gris-perla': ['Gris perla', '#D5D8D8'],
  gris: ['Gris', '#9AA1A4'],
  'gris-oscuro': ['Gris oscuro', '#4F565A'],
  negro: ['Negro', '#222628'],
  salvia: ['Salvia', '#A9BDA2'],
  rosa: ['Rosa', '#EBC3C9'],
  celeste: ['Celeste', '#A9C9E6'],
  azul: ['Azul', '#476DAE'],
  marino: ['Azul marino', '#2B3A5C'],
  mostaza: ['Mostaza', '#D6A63A'],
  floral: ['Floral', 'linear-gradient(135deg,#F4EFE6 0 38%,#8FB28A 38% 62%,#E8B9C2 62%)'],
  acero: ['Acero', 'linear-gradient(135deg,#E6E9EB,#9DA4A9)'],
};

const CATEGORIAS = [
  { id: 'sabanas', nombre: 'Sábanas', amb: 'dormitorio' },
  { id: 'acolchados', nombre: 'Acolchados y mantas', amb: 'dormitorio' },
  { id: 'almohadas', nombre: 'Almohadas y fundas', amb: 'dormitorio' },
  { id: 'toallas', nombre: 'Toallas y toallones', amb: 'bano' },
  { id: 'cortinas', nombre: 'Cortinas', amb: 'ventanas' },
  { id: 'rollers', nombre: 'Rollers y paneles', amb: 'ventanas' },
  { id: 'barrales', nombre: 'Barrales y accesorios', amb: 'ventanas' },
  { id: 'telas', nombre: 'Telas por metro', amb: 'telas' },
];

const AMBIENTES = {
  dormitorio: { nombre: 'Dormitorio', cats: ['sabanas', 'acolchados', 'almohadas'] },
  bano: { nombre: 'Baño', cats: ['toallas'] },
  ventanas: { nombre: 'Ventanas', cats: ['cortinas', 'rollers', 'barrales'] },
  telas: { nombre: 'Telas por metro', cats: ['telas'] },
};

const PRODUCTOS = [
  { id: 'sabanas-lisas', nombre: 'Juego de sábanas lisas 180 hilos', cat: 'sabanas', precio: 32900, descuento: 0, medidas: [['1½ plaza', 0], ['2 plazas', 5000], ['2½ plazas', 9000], ['Queen', 15000], ['King', 21000]], colores: ['blanco', 'arena', 'gris-perla', 'salvia'], foto: 'dormitorio.webp', foco: [0.5, 0.42, 1.05], alt: 'Cama vestida con sábanas blancas lisas y almohadas', destacado: true, desc: 'Sábana ajustable con elástico, sábana plana y fundas. Percal suave que se lava y se plancha fácil.', ficha: [['Incluye', 'Ajustable, plana y fundas'], ['Tela', 'Percal 180 hilos']], tags: 'percal juego cama' },
  { id: 'sabanas-200', nombre: 'Juego de sábanas 200 hilos', cat: 'sabanas', precio: 41900, descuento: 0, medidas: [['2½ plazas', 0], ['Queen', 6000], ['King', 12000]], colores: ['blanco', 'gris-perla'], foto: 'dormitorio.webp', foco: [0.3, 0.55, 1.6], alt: 'Sábanas blancas de 200 hilos y almohadón salvia sobre la cama', nuevo: true, desc: 'Más cuerpo y más suavidad para la cama de todos los días.', ficha: [['Incluye', 'Ajustable, plana y 2 fundas'], ['Tela', '200 hilos']], tags: 'algodon percal juego cama' },
  { id: 'acolchado-reversible', nombre: 'Acolchado reversible', cat: 'acolchados', precio: 69900, descuento: 0, medidas: [['2½ plazas', 0], ['Queen', 10000], ['King', 20000]], colores: ['blanco', 'arena', 'salvia'], foto: 'dormitorio.webp', foco: [0.24, 0.86, 1.35], alt: 'Acolchado blanco extendido sobre la cama', destacado: true, desc: 'Liviano para el entretiempo y abrigado si lo sumás a la frazada. Un lado liso y otro con pespunte.', ficha: [['Relleno', 'Fibra siliconada'], ['Lavado', 'En lavarropas, programa delicado']], tags: 'acolchado plumon edredon cubrecama' },
  { id: 'pie-de-cama', nombre: 'Pie de cama tejido', cat: 'acolchados', precio: 32900, descuento: 10, colores: ['arena', 'crudo'], foto: 'dormitorio.webp', foco: [0.78, 0.83, 1.75], galeria: [['manta-detalle.webp', [0.6, 0.5, 1]]], alt: 'Pie de cama tejido color arena sobre el acolchado', destacado: true, desc: 'Textura en relieve que abriga los pies y viste la cama en dos segundos.', ficha: [['Medida', '1,30 × 2,10 m'], ['Tejido', 'Relieve tipo nido de abeja']], tags: 'manta pie de cama tejida' },
  { id: 'manta-textura', nombre: 'Manta de textura', cat: 'acolchados', precio: 27900, descuento: 0, colores: ['crudo', 'arena'], foto: 'manta-detalle.webp', foco: [0.68, 0.5, 1.15], alt: 'Detalle de una manta tejida en relieve color crudo', desc: 'Para el sillón o los pies de la cama: tejido en relieve, suave y con peso.', ficha: [['Medida', '1,50 × 2,00 m']], tags: 'manta plaid sillon' },
  { id: 'almohada-fibra', nombre: 'Almohada de fibra siliconada', cat: 'almohadas', precio: 14900, descuento: 0, medidas: [['50 × 70 cm', 0], ['50 × 90 cm', 3000]], foto: 'dormitorio.webp', foco: [0.44, 0.36, 2.4], alt: 'Almohada blanca sobre la cama', desc: 'Firme y esponjosa: recupera la forma después de cada lavado.', ficha: [['Funda', 'Algodón con vivo'], ['Relleno', 'Fibra siliconada']], tags: 'almohada' },
  { id: 'funda-almohadon', nombre: 'Funda de almohadón de lino', cat: 'almohadas', precio: 7900, descuento: 0, colores: ['salvia', 'rosa', 'blanco'], foto: 'dormitorio.webp', foco: [0.12, 0.43, 2.4], alt: 'Almohadón con funda de lino verde salvia', nuevo: true, desc: 'Funda de 50 × 50 cm con cierre invisible. Para sumar color sin cambiar toda la cama.', tags: 'almohadon funda lino deco' },
  { id: 'fundas-almohada', nombre: 'Fundas de almohada x 2', cat: 'almohadas', precio: 9900, descuento: 0, colores: ['rosa', 'blanco', 'gris-perla'], foto: 'dormitorio.webp', foco: [0.36, 0.26, 2.6], alt: 'Fundas de almohada rosa empolvado', desc: 'Par de fundas de 50 × 70 cm. Combinan con las sábanas lisas.', tags: 'funda almohada par' },
  { id: 'toalla-toallon', nombre: 'Juego de toalla y toallón', cat: 'toallas', precio: 20000, descuento: 0, colores: ['azul', 'celeste', 'blanco', 'arena', 'rosa'], foto: 'toallas.webp', foco: [0.37, 0.55, 1.9], alt: 'Pila de toallas y toallones azules en el estante', destacado: true, desc: 'Rizo de algodón que seca rápido. Toalla de 50 × 90 y toallón de 70 × 130 cm.', ficha: [['Incluye', 'Toalla y toallón'], ['Tela', 'Rizo de algodón']], tags: 'toalla toallon juego bano' },
  { id: 'toallon-500', nombre: 'Toallón 500 g', cat: 'toallas', precio: 16900, descuento: 0, colores: ['blanco', 'arena'], foto: 'toallas.webp', foco: [0.79, 0.36, 1.6], alt: 'Toallones blancos gruesos apilados', desc: 'Más gramos, más abrazo: 70 × 140 cm, grueso y absorbente.', tags: 'toallon grueso bano' },
  { id: 'toalla-mano', nombre: 'Toalla de mano', cat: 'toallas', precio: 6900, descuento: 0, colores: ['arena', 'blanco', 'rosa'], foto: 'toallas.webp', foco: [0.79, 0.7, 1.7], alt: 'Toallas de mano color arena apiladas', desc: 'La de todos los días en el baño o la cocina. 40 × 60 cm.', tags: 'toalla mano bano cocina' },
  { id: 'toallon-rizo', nombre: 'Toallón de rizo francés', cat: 'toallas', precio: 18900, descuento: 0, colores: ['rosa', 'celeste'], foto: 'toallas-detalle.webp', foco: [0.6, 0.24, 1.3], alt: 'Toallones de rizo francés rosa en el estante', nuevo: true, desc: 'Rizo con relieve y secado rápido. 70 × 140 cm.', tags: 'toallon rizo frances bano' },
  { id: 'set-bano', nombre: 'Set de baño x 3', cat: 'toallas', precio: 29900, descuento: 0, colores: ['celeste', 'blanco'], foto: 'toallas-detalle.webp', foco: [0.42, 0.8, 1.45], alt: 'Set de toallas celestes doblado', desc: 'Toallón, toalla y toalla de mano del mismo color, para estrenar o regalar.', tags: 'set bano regalo toallas' },
  { id: 'cortina-blackout', nombre: 'Cortina blackout con ojales', cat: 'cortinas', precio: 34900, descuento: 0, colores: ['gris', 'gris-oscuro', 'arena', 'blanco'], foto: 'cortinas-ojales.webp', foco: [0.74, 0.48, 2.2], alt: 'Cortinas blackout grises con ojales colgadas en el barral', destacado: true, desc: 'Un paño de 1,40 × 2,20 m que no deja pasar la luz. Ojales metálicos para barral de hasta 28 mm.', ficha: [['Medida', '1,40 × 2,20 m'], ['Ojales', '8 metálicos']], tags: 'cortina blackout oscurecer dormitorio' },
  { id: 'cortina-lino', nombre: 'Cortina de lino con ojales', cat: 'cortinas', precio: 29900, descuento: 0, colores: ['crudo', 'blanco'], foto: 'cortinas-ojales.webp', foco: [0.44, 0.52, 2.1], alt: 'Cortinas de lino crudo con ojales', desc: 'Filtra la luz y deja el ambiente luminoso. Paño de 1,40 × 2,20 m.', ficha: [['Medida', '1,40 × 2,20 m']], tags: 'cortina lino living' },
  { id: 'cortina-tropical', nombre: 'Juego de cortinas tropical', cat: 'cortinas', precio: 22900, descuento: 15, colores: ['arena', 'gris', 'blanco', 'rosa'], foto: 'cortinas-largas.webp', foco: [0.22, 0.45, 1.6], alt: 'Cortinas de tropical mecánico en tonos arena', desc: 'Dos paños de 1,40 × 2,00 m en tropical mecánico, con presillas para barral.', ficha: [['Incluye', '2 paños'], ['Medida', '1,40 × 2,00 m cada uno']], tags: 'cortina tropical juego' },
  { id: 'cortina-voile', nombre: 'Cortina de voile con ojales', cat: 'cortinas', precio: 19900, descuento: 0, colores: ['blanco', 'crudo'], foto: 'cortinas-largas.webp', foco: [0.5, 0.42, 1.5], alt: 'Cortinas de voile blancas hasta el piso', desc: 'Liviana y luminosa, para usar sola o delante de un blackout.', ficha: [['Medida', '2,80 × 2,20 m']], tags: 'cortina voile visillo' },
  { id: 'roller-screen', nombre: 'Roller sunscreen a medida', cat: 'rollers', precio: 44900, descuento: 0, unidad: 'm2', sis: ['roller', 'screen'], foto: 'rollers.webp', foco: [0.12, 0.6, 1.8], alt: 'Roller sunscreen translúcido instalado en la ventana', desc: 'Tela técnica que filtra el sol y deja ver hacia afuera. Se fabrica a la medida de tu ventana.', ficha: [['Mínimo', '1 m²'], ['Accionamiento', 'Cadena con contrapeso']], tags: 'roller sunscreen screen a medida' },
  { id: 'roller-blackout', nombre: 'Roller blackout a medida', cat: 'rollers', precio: 39900, descuento: 0, unidad: 'm2', sis: ['roller', 'blackout'], foto: 'rollers.webp', foco: [0.43, 0.42, 1.25], alt: 'Roller blackout gris instalado', destacado: true, desc: 'Oscurece por completo: ideal para dormitorios. Se fabrica a la medida de tu ventana.', ficha: [['Mínimo', '1 m²'], ['Accionamiento', 'Cadena con contrapeso']], tags: 'roller blackout a medida' },
  { id: 'roller-duo', nombre: 'Roller dúo día y noche', cat: 'rollers', precio: 52900, descuento: 0, unidad: 'm2', sis: ['roller', 'duo'], foto: 'rollers.webp', foco: [0.68, 0.58, 2.0], alt: 'Roller dúo con franjas que regulan la luz', nuevo: true, desc: 'Franjas que se superponen para dejar pasar la luz o cortarla, con la misma cortina.', ficha: [['Mínimo', '1 m²']], tags: 'roller duo zebra dia noche a medida' },
  { id: 'panel-oriental', nombre: 'Panel oriental a medida', cat: 'rollers', precio: 41900, descuento: 0, unidad: 'm2', sis: ['panel', 'screen'], foto: 'rollers.webp', foco: [0.55, 0.5, 1.1], alt: 'Paneles y rollers en tonos neutros', desc: 'Paneles de 60 cm que se corren sobre un riel de varias vías. Para ventanales y divisiones.', ficha: [['Paneles', '60 cm de ancho']], tags: 'panel oriental japones riel a medida' },
  { id: 'bandas-verticales', nombre: 'Bandas verticales a medida', cat: 'rollers', precio: 29900, descuento: 0, unidad: 'm2', sis: ['bandas', 'pvc'], foto: 'rollers.webp', foco: [0.88, 0.55, 2.0], alt: 'Bandas verticales instaladas en un ventanal', desc: 'Bandas de 89 mm que giran para regular la luz. Para ventanales y oficinas.', ficha: [['Bandas', '89 mm']], tags: 'bandas verticales oficina a medida' },
  { id: 'barral-120', nombre: 'Barral extensible 1,20 a 2,10 m', cat: 'barrales', precio: 19900, descuento: 0, colores: ['acero', 'negro'], foto: 'barrales.webp', foco: [0.2, 0.26, 1.8], alt: 'Terminal de bola de un barral de acero', desc: 'Caño de 19 mm con terminales de bola y soportes incluidos.', ficha: [['Largo', 'Extensible de 1,20 a 2,10 m'], ['Incluye', '2 soportes y 2 terminales']], tags: 'barral cortina extensible' },
  { id: 'barral-200', nombre: 'Barral extensible 2,00 a 3,60 m', cat: 'barrales', precio: 27900, descuento: 0, colores: ['negro', 'acero'], foto: 'barrales.webp', foco: [0.2, 0.8, 1.8], alt: 'Terminal de bola negro de un barral', destacado: true, desc: 'Caño de 25 mm con soporte central para ventanas anchas.', ficha: [['Largo', 'Extensible de 2,00 a 3,60 m'], ['Incluye', '3 soportes y 2 terminales']], tags: 'barral cortina extensible ancho' },
  { id: 'soportes', nombre: 'Soportes para barral x 2', cat: 'barrales', precio: 6900, descuento: 0, colores: ['blanco', 'negro'], foto: 'barrales.webp', foco: [0.8, 0.3, 1.9], alt: 'Soportes metálicos para barral', desc: 'Soportes de pared para caños de 19 y 25 mm, con tornillos y tarugos.', tags: 'soporte barral' },
  { id: 'argollas', nombre: 'Argollas con gancho x 10', cat: 'barrales', precio: 3900, descuento: 0, colores: ['acero', 'negro'], foto: 'barrales.webp', foco: [0.82, 0.68, 2.2], alt: 'Argollas con gancho para cortinas', desc: 'Para colgar cortinas con presillas o con ganchos de cabezal.', tags: 'argollas ganchos accesorios' },
  { id: 'tela-voile', nombre: 'Voile liso por metro', cat: 'telas', precio: 7900, descuento: 0, unidad: 'm', colores: ['blanco', 'crudo'], foto: 'telas-estantes.webp', foco: [0.56, 0.6, 1.5], alt: 'Rollo de voile blanco en el estante', destacado: true, desc: 'Ancho de 2,80 m: se usa de alto, así una ventana de hasta 2,55 m sale sin costuras.', ficha: [['Ancho', '2,80 m']], tags: 'voile tela cortina metro' },
  { id: 'tela-lino', nombre: 'Lino rústico por metro', cat: 'telas', precio: 12900, descuento: 0, unidad: 'm', colores: ['arena', 'gris-perla'], foto: 'telas-rollos.webp', foco: [0.72, 0.4, 1.55], alt: 'Rollo de lino rústico color arena', desc: 'Textura natural para cortinas, almohadones y manteles.', ficha: [['Ancho', '2,80 m']], tags: 'lino tela metro' },
  { id: 'tela-blackout', nombre: 'Blackout por metro', cat: 'telas', precio: 11900, descuento: 0, unidad: 'm', colores: ['blanco', 'gris'], foto: 'telas-rollos.webp', foco: [0.22, 0.4, 1.8], alt: 'Rollo de tela blackout blanca', desc: 'Corta la luz por completo: para cortinas de dormitorio.', ficha: [['Ancho', '2,80 m']], tags: 'blackout tela metro' },
  { id: 'tela-tusor', nombre: 'Tusor por metro', cat: 'telas', precio: 6900, descuento: 0, unidad: 'm', colores: ['rosa', 'blanco', 'arena'], foto: 'telas-estantes.webp', foco: [0.25, 0.42, 1.75], alt: 'Rollo de tusor rosa en el estante', desc: 'Algodón con cuerpo para cortinas, fundas y manteles.', ficha: [['Ancho', '1,50 m']], tags: 'tusor tela algodon metro' },
  { id: 'tela-vichy', nombre: 'Vichy por metro', cat: 'telas', precio: 5900, descuento: 0, unidad: 'm', colores: ['marino'], foto: 'telas-rollos.webp', foco: [0.75, 0.87, 2.0], alt: 'Rollo de tela vichy azul marino', desc: 'El cuadrillé de siempre, para cortinas de cocina, manteles y repasadores.', ficha: [['Ancho', '1,50 m']], tags: 'vichy cuadrille cocina metro' },
  { id: 'tela-floral', nombre: 'Estampado floral por metro', cat: 'telas', precio: 8900, descuento: 0, unidad: 'm', colores: ['floral'], foto: 'telas-estantes.webp', foco: [0.78, 0.13, 2.0], alt: 'Rollo de algodón estampado con flores y hojas', nuevo: true, desc: 'Algodón estampado con flores y hojas.', ficha: [['Ancho', '1,50 m']], tags: 'estampado floral algodon metro' },
  { id: 'tela-gabardina', nombre: 'Gabardina por metro', cat: 'telas', precio: 6500, descuento: 0, unidad: 'm', colores: ['mostaza', 'arena'], foto: 'telas-estantes.webp', foco: [0.8, 0.9, 2.0], alt: 'Rollo de gabardina color mostaza', desc: 'Resistente y fácil de coser: almohadones, fundas y cortinas de cocina.', ficha: [['Ancho', '1,50 m']], tags: 'gabardina tela metro' },
  { id: 'tela-batista', nombre: 'Batista por metro', cat: 'telas', precio: 6200, descuento: 0, unidad: 'm', colores: ['celeste', 'blanco'], foto: 'telas-rollos.webp', foco: [0.3, 0.8, 1.7], alt: 'Rollo de batista celeste', desc: 'Liviana y fresca, para cortinas de cocina o visillos.', ficha: [['Ancho', '1,50 m']], tags: 'batista tela metro' },
];

const SISTEMAS = {
  tela: { nombre: 'Cortina de tela', mats: [
    { id: 'voile', nombre: 'Voile', prod: 'tela-voile', fr: 2.5, ancho: 2.8, color: '#F1F4F1', op: 0.7 },
    { id: 'lino', nombre: 'Lino', prod: 'tela-lino', fr: 2, ancho: 2.8, color: '#DCCFB9', op: 0.96 },
    { id: 'blackout', nombre: 'Blackout', prod: 'tela-blackout', fr: 2, ancho: 2.8, color: '#8F989C', op: 1 },
    { id: 'tusor', nombre: 'Tusor', prod: 'tela-tusor', fr: 2.2, ancho: 1.5, color: '#EBC7CB', op: 0.95 },
  ] },
  roller: { nombre: 'Roller', mats: [
    { id: 'screen', nombre: 'Sunscreen', prod: 'roller-screen', color: '#D9D6CE', op: 0.66 },
    { id: 'blackout', nombre: 'Blackout', prod: 'roller-blackout', color: '#A19C93', op: 1 },
    { id: 'duo', nombre: 'Dúo día y noche', prod: 'roller-duo', color: '#C4BFB4', op: 0.94, rayas: true },
  ] },
  panel: { nombre: 'Panel oriental', mats: [
    { id: 'screen', nombre: 'Screen', prod: 'panel-oriental', color: '#DAD7CF', op: 0.74 },
    { id: 'blackout', nombre: 'Blackout', prod: 'panel-oriental', color: '#9E9A91', op: 1 },
  ] },
  bandas: { nombre: 'Bandas verticales', mats: [
    { id: 'pvc', nombre: 'PVC', prod: 'bandas-verticales', color: '#E3E1DA', op: 0.96 },
    { id: 'tela', nombre: 'Tela', prod: 'bandas-verticales', color: '#CFC7B6', op: 0.92 },
  ] },
};

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esMedida = p => p?.unidad === 'm2';
const esMetro = p => p?.unidad === 'm';
const pasoDe = p => (esMetro(p) ? 0.5 : 1);
const tieneMedidas = p => (p?.medidas?.length || 0) > 1;
const precioBase = (p, m = 0) => p.precio + (p.medidas?.[m]?.[1] || 0);
const precioFinal = (p, m = 0) => (p.descuento > 0 ? Math.round(precioBase(p, m) * (1 - p.descuento / 100)) : precioBase(p, m));
const nombreColor = k => COLORES[k]?.[0] || '';

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w - vw > 0.5 ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h - vh > 0.5 ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const imgAttrs = img => `width="${IMG[img]?.[0] || 800}" height="${IMG[img]?.[1] || 800}"`;
const intentar = fn => {
  try { fn(); } catch (err) { return err; }
  return null;
};

const Cart = {
  KEY: 'centrotextil_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items))); document.dispatchEvent(new CustomEvent('cart:updated')); },
  igual(i, id, m, c) { return i.id === id && (i.m || 0) === (m || 0) && (i.c || '') === (c || ''); },
  add(producto, qty = 1, m = 0, c = '') {
    const items = this.get();
    const existing = items.find(i => this.igual(i, producto.id, m, c));
    if (existing) existing.qty = Math.min(redondear(existing.qty + qty), 99);
    else items.push({ id: producto.id, m, c, qty: Math.min(redondear(qty), 99) });
    this.save(items);
  },
  setQty(index, qty) {
    const items = this.get();
    const it = items[index];
    if (!it) return;
    it.qty = Math.max(1, Math.min(redondear(qty), 99));
    this.save(items);
  },
  remove(index) { const items = this.get(); items.splice(index, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + (esMetro(getProducto(i.id)) ? 1 : i.qty), 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.m) * i.qty : s; }, 0); },
};

function varTexto(p, it) {
  const partes = [];
  if (tieneMedidas(p)) partes.push(p.medidas[it.m || 0][0]);
  if (it.c) partes.push(nombreColor(it.c));
  return partes.join(' · ');
}

function dotsHTML(p, max = 5) {
  if (!p.colores?.length) return '';
  const lista = p.colores.slice(0, max).map(k => `<i class="dot" style="--dc:${COLORES[k][1]}"></i>`).join('');
  const mas = p.colores.length > max ? `<span class="dots__mas">+${p.colores.length - max}</span>` : '';
  return `<span class="dots" role="img" aria-label="Colores: ${esc(p.colores.map(nombreColor).join(', '))}">${lista}${mas}</span>`;
}

function precioHTML(p) {
  const desde = tieneMedidas(p) || esMedida(p) ? '<span class="precio__desde">desde</span> ' : '';
  const unidad = esMetro(p) ? '<span class="precio__u">/ m</span>' : esMedida(p) ? '<span class="precio__u">/ m²</span>' : '';
  const fin = formatearPrecio(precioFinal(p));
  if (p.descuento > 0) return `${desde}<s>${formatearPrecio(precioBase(p))}</s> ${fin}${unidad}`;
  return `${desde}${fin}${unidad}`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (esMetro(p)) b.push('<span class="badge">Por metro</span>');
  if (esMedida(p)) b.push('<span class="badge">A medida</span>');
  return b.length ? `<span class="card__badges">${b.join('')}</span>` : '';
}

function stepperHTML(p, q = 1) {
  return `<div class="stepper" data-step="${p.id}"><button type="button" data-menos aria-label="Restar">−</button><span class="stepper__n" data-n data-v="${q}">${fmtCant(q)}</span>${esMetro(p) ? '<span class="stepper__u">m</span>' : ''}<button type="button" data-mas aria-label="Sumar">+</button></div>`;
}

function accionesHTML(p) {
  if (esMedida(p)) return `<button type="button" class="prod-add prod-add--suave" data-medir="${p.id}">Medir y cotizar</button>`;
  if (tieneMedidas(p)) return `<button type="button" class="prod-add" data-quick="${p.id}">Elegir medida</button>`;
  return `${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}">Agregar</button>`;
}

const mqCardCuadrada = window.matchMedia('(min-width: 769px)');
const mqCardAncha = window.matchMedia('(min-width: 1360px)');
const arCard = () => {
  if (!document.body.classList.contains('m2') || !mqCardCuadrada.matches) return 0.8;
  return mqCardAncha.matches ? 1.25 : 1;
};

function cardHTML(p, anim = true) {
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  const simple = !esMedida(p) && !tieneMedidas(p);
  return `<li class="cat-item"${a}><article class="card" data-id="${p.id}">
    <button type="button" class="card__media recorte" data-quick="${p.id}" style="${recorte(p.foto, p.foco, arCard())}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.foto}" alt="${esc(p.alt)}" ${imgAttrs(p.foto)} draggable="false"><span class="card__ver" aria-hidden="true">Vista rápida</span></button>
    ${badgesHTML(p)}
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat)?.nombre)}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      ${dotsHTML(p)}
      <p class="card__precio">${precioHTML(p)}</p>
      <div class="prod-actions">${accionesHTML(p)}</div>
      ${simple ? `<button type="button" class="prod-comprar" data-comprar="${p.id}">Comprar ahora</button>` : ''}
    </div>
  </article></li>`;
}

function railHTML(p) {
  const accion = esMedida(p)
    ? `data-medir="${p.id}" aria-label="Cotizar ${esc(p.nombre)} con tu medida"`
    : tieneMedidas(p)
      ? `data-quick="${p.id}" aria-label="Elegir la medida de ${esc(p.nombre)}"`
      : `data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"`;
  return `<li class="rail-item" data-animate="subir" style="opacity:0;transform:translateY(36px)"><article class="rcard">
    <button type="button" class="rcard__media recorte" data-quick="${p.id}" style="${recorte(p.foto, p.foco, 0.8)}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${p.foto}" alt="${esc(p.alt)}" ${imgAttrs(p.foto)} draggable="false">${badgesHTML(p)}</button>
    <div class="rcard__info"><h3 class="rcard__nombre">${esc(p.nombre)}</h3>${dotsHTML(p)}<p class="rcard__precio">${precioHTML(p)}</p></div>
    <button type="button" class="rcard__add" ${accion}>${ICON.mas}</button>
  </article></li>`;
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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function irA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function aplicarRecortes(root = document) {
  root.querySelectorAll('.recorte[data-foco]').forEach(el => {
    const f = el.dataset.foco.split(' ').map(Number);
    el.setAttribute('style', recorte(el.dataset.img, f, Number(el.dataset.ar) || 1));
  });
}

function contar() {
  document.querySelectorAll('[data-amb-count]').forEach(el => {
    const amb = AMBIENTES[el.dataset.ambCount];
    if (amb) el.textContent = PRODUCTOS.filter(p => amb.cats.includes(p.cat)).length;
  });
  document.querySelectorAll('[data-cat-count]').forEach(el => {
    el.textContent = PRODUCTOS.filter(p => p.cat === el.dataset.catCount).length;
  });
  document.querySelectorAll('[data-count-cat]').forEach(el => {
    el.textContent = PRODUCTOS.filter(p => p.cat === el.dataset.countCat).length;
  });
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = espaciar(PRODUCTOS.filter(p => p.destacado)).slice(0, 8).map(railHTML).join('');
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

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => {
    const it = track.querySelector('.rail-item');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return it ? (it.getBoundingClientRect().width + gap) * 2 : 320;
  };
  const flechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

const POR_PAGINA = 16;
const estado = { q: '', cats: new Set(), colores: new Set(), precio: 'todos', orden: 'rel', visibles: POR_PAGINA };

function filtrar() {
  const palabras = normalizar(estado.q).trim().split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cats.size && !estado.cats.has(p.cat)) return false;
    if (estado.colores.size && !(p.colores || []).some(c => estado.colores.has(c))) return false;
    const pr = precioFinal(p);
    if (estado.precio === 'hasta15' && pr > 15000) return false;
    if (estado.precio === '15a40' && (pr < 15000 || pr > 40000)) return false;
    if (estado.precio === 'mas40' && pr < 40000) return false;
    if (palabras.length) {
      const cat = catDe(p.cat);
      const texto = normalizar([p.nombre, cat?.nombre, AMBIENTES[cat?.amb]?.nombre, p.desc, p.tags, (p.colores || []).map(nombreColor).join(' ')].join(' '));
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  const idx = p => PRODUCTOS.indexOf(p);
  if (estado.orden === 'menor') return lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  if (estado.orden === 'mayor') return lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  if (estado.orden === 'az') return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return espaciar(lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || idx(a) - idx(b)));
}

function espaciar(lista) {
  const resto = [...lista];
  const out = [];
  while (resto.length) {
    let i = resto.findIndex(p => ![1, 2, 3, 4].some(k => out[out.length - k]?.foto === p.foto));
    if (i < 0) i = resto.findIndex(p => out[out.length - 1]?.foto !== p.foto);
    if (i < 0) i = 0;
    out.push(resto.splice(i, 1)[0]);
  }
  return out;
}

function resumenCatalogo(n) {
  const unidad = n === 1 ? 'producto' : 'productos';
  if (estado.q.trim()) return `${n} ${n === 1 ? 'resultado' : 'resultados'} para «${estado.q.trim()}»`;
  if (estado.cats.size) {
    const amb = Object.values(AMBIENTES).find(a => a.cats.length === estado.cats.size && a.cats.every(c => estado.cats.has(c)));
    if (amb) return `${n} ${unidad} en ${amb.nombre}`;
    if (estado.cats.size === 1) return `${n} ${unidad} en ${catDe([...estado.cats][0])?.nombre}`;
  }
  return `${n} ${unidad} para el dormitorio, el baño y las ventanas`;
}

function renderCatalogo(mas = false) {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrar();
  const antes = mas ? Math.min(estado.visibles, lista.length) : 0;
  estado.visibles = mas ? estado.visibles + POR_PAGINA : POR_PAGINA;
  const visibles = lista.slice(0, estado.visibles);
  if (mas) grid.insertAdjacentHTML('beforeend', visibles.slice(antes).map(p => cardHTML(p)).join(''));
  else grid.innerHTML = visibles.map(p => cardHTML(p)).join('');
  const resumen = document.getElementById('catResumen');
  if (resumen) resumen.textContent = resumenCatalogo(lista.length);
  const pie = document.getElementById('catPie');
  if (pie) pie.textContent = lista.length ? `Mostrando ${visibles.length} de ${lista.length}` : '';
  const verMas = document.getElementById('verMas');
  if (verMas) {
    const faltan = lista.length - visibles.length;
    verMas.hidden = faltan <= 0;
    verMas.textContent = `Ver ${Math.min(POR_PAGINA, faltan)} productos más`;
  }
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  document.querySelectorAll('#catPills [data-pill]').forEach(b => {
    const c = b.dataset.pill;
    b.setAttribute('aria-pressed', String(c ? estado.cats.size === 1 && estado.cats.has(c) : estado.cats.size === 0));
  });
  renderChips();
  revelarNuevos(grid);
  refrescar();
}

function renderChips() {
  const cont = document.getElementById('chipsActivos');
  if (!cont) return;
  const chips = [];
  if (estado.q.trim()) chips.push(`<button type="button" class="chip-x" data-quitar="q">«${esc(estado.q.trim())}» ${ICON.x}</button>`);
  estado.cats.forEach(c => chips.push(`<button type="button" class="chip-x" data-quitar="cat" data-v="${c}">${esc(catDe(c)?.nombre)} ${ICON.x}</button>`));
  estado.colores.forEach(c => chips.push(`<button type="button" class="chip-x" data-quitar="color" data-v="${c}">${esc(nombreColor(c))} ${ICON.x}</button>`));
  const precios = { hasta15: 'Hasta $15.000', '15a40': '$15.000 a $40.000', mas40: 'Más de $40.000' };
  if (precios[estado.precio]) chips.push(`<button type="button" class="chip-x" data-quitar="precio">${precios[estado.precio]} ${ICON.x}</button>`);
  cont.innerHTML = chips.join('');
  const n = document.getElementById('filtrosN');
  if (n) {
    const total = estado.cats.size + estado.colores.size + (precios[estado.precio] ? 1 : 0);
    n.textContent = total;
    n.hidden = total === 0;
  }
}

function sincronizarFiltros() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.has(i.value); });
  document.querySelectorAll('input[data-f="color"]').forEach(i => { i.checked = estado.colores.has(i.value); });
  document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  const q = document.getElementById('catQ');
  if (q && q.value !== estado.q) q.value = estado.q;
  const qh = document.getElementById('qHeader');
  if (qh && document.activeElement !== qh) qh.value = estado.q;
}

function limpiarFiltros() {
  estado.q = '';
  estado.cats.clear();
  estado.colores.clear();
  estado.precio = 'todos';
  sincronizarFiltros();
  renderCatalogo();
}

function filtrarPor({ amb, cat } = {}) {
  estado.q = '';
  estado.colores.clear();
  estado.precio = 'todos';
  estado.cats = new Set(amb && AMBIENTES[amb] ? AMBIENTES[amb].cats : cat ? [cat] : []);
  sincronizarFiltros();
  renderCatalogo();
  irA('tienda');
}

function renderSwatches() {
  const cont = document.getElementById('swatches');
  if (!cont) return;
  const usados = Object.keys(COLORES).filter(k => PRODUCTOS.some(p => p.colores?.includes(k)));
  cont.innerHTML = usados.map(k => `<label class="sw" title="${esc(nombreColor(k))}"><input type="checkbox" data-f="color" value="${k}" aria-label="${esc(nombreColor(k))}"><span style="--dc:${COLORES[k][1]}"></span></label>`).join('');
}

function initCatalogoUI() {
  const q = document.getElementById('catQ');
  if (!q) return;
  let t = 0;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value; renderCatalogo(); }, 160);
  });
  document.getElementById('catOrden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  document.getElementById('filtros')?.addEventListener('change', e => {
    const i = e.target;
    if (i.matches('input[data-f="cat"]')) { if (i.checked) estado.cats.add(i.value); else estado.cats.delete(i.value); }
    else if (i.matches('input[data-f="color"]')) { if (i.checked) estado.colores.add(i.value); else estado.colores.delete(i.value); }
    else if (i.matches('input[name="precio"]')) estado.precio = i.value;
    else return;
    renderCatalogo();
  });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('verMas')?.addEventListener('click', () => renderCatalogo(true));
  document.getElementById('chipsActivos')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const tipo = b.dataset.quitar;
    if (tipo === 'q') estado.q = '';
    else if (tipo === 'cat') estado.cats.delete(b.dataset.v);
    else if (tipo === 'color') estado.colores.delete(b.dataset.v);
    else if (tipo === 'precio') estado.precio = 'todos';
    sincronizarFiltros();
    renderCatalogo();
  });
  document.getElementById('catPills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-pill]');
    if (!b) return;
    estado.cats = new Set(b.dataset.pill ? [b.dataset.pill] : []);
    sincronizarFiltros();
    renderCatalogo();
  });
  if (document.body.classList.contains('m2')) [mqCardCuadrada, mqCardAncha].forEach(mq => mq.addEventListener('change', () => renderCatalogo()));
  const btn = document.getElementById('btnFiltrar');
  const panel = document.getElementById('filtros');
  btn?.addEventListener('click', () => {
    const abrir = !panel.classList.contains('abierto');
    panel.classList.toggle('abierto', abrir);
    panel.classList.add('in');
    btn.setAttribute('aria-expanded', String(abrir));
    refrescar();
  });
}

function initBuscador() {
  const form = document.getElementById('buscadorHeader');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const v = form.querySelector('input').value.trim();
    estado.q = v;
    estado.cats.clear();
    estado.colores.clear();
    estado.precio = 'todos';
    sincronizarFiltros();
    renderCatalogo();
    irA('tienda');
  });
  document.getElementById('buscarMovil')?.addEventListener('click', () => {
    irA('tienda');
    setTimeout(() => document.getElementById('catQ')?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  });
}

function agregar(p, q = 1, m = 0, c = '') {
  if (!p || esMedida(p)) return;
  Cart.add(p, q, m, c);
  const v = varTexto(p, { m, c });
  const cant = esMetro(p) ? `${fmtCant(q)} m de ` : q > 1 ? `${q} × ` : '';
  showToast(`Sumaste ${cant}${p.nombre}${v ? ` (${v})` : ''} al carrito`);
}

function cantidadDe(el) {
  const n = el.closest('.card, .rcard')?.querySelector('.stepper [data-n]');
  return Number(n?.dataset.v || 1);
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const el = e.target.closest('button, a');
    if (!el) return;
    const st = el.closest('.stepper[data-step]');
    if (st && (el.hasAttribute('data-menos') || el.hasAttribute('data-mas'))) {
      const p = getProducto(st.dataset.step);
      const n = st.querySelector('[data-n]');
      if (!p || !n) return;
      let v = Number(n.dataset.v || 1);
      v = el.hasAttribute('data-mas') ? Math.min(99, v + pasoDe(p)) : Math.max(1, v - pasoDe(p));
      n.dataset.v = v;
      n.textContent = fmtCant(v);
      return;
    }
    if (el.dataset.add) {
      const p = getProducto(el.dataset.add);
      agregar(p, cantidadDe(el), 0, p?.colores?.[0] || '');
      return;
    }
    if (el.dataset.comprar) {
      const p = getProducto(el.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantidadDe(el), 0, p.colores?.[0] || '');
      abrirDrawer(el);
      return;
    }
    if (el.dataset.quick) {
      e.preventDefault();
      abrirQuick(el.dataset.quick, el);
      return;
    }
    if (el.dataset.medir) {
      e.preventDefault();
      const p = getProducto(el.dataset.medir);
      cerrarOverlay(document.getElementById('qv'), false);
      if (p?.sis) medirPreset(p.sis[0], p.sis[1]);
      return;
    }
    if (el.dataset.preset) {
      e.preventDefault();
      medirPreset(el.dataset.preset);
      return;
    }
    if (el.dataset.amb) {
      e.preventDefault();
      filtrarPor({ amb: el.dataset.amb });
      return;
    }
    if (el.dataset.cat) {
      e.preventDefault();
      filtrarPor({ cat: el.dataset.cat });
      return;
    }
    if (el.hasAttribute('data-ver-todo')) {
      e.preventDefault();
      filtrarPor({});
    }
  });
}

function focusables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[inert]'));
}

function abrirOverlay(el, origen) {
  if (!el) return;
  clearTimeout(el._t);
  if (!el.classList.contains('open')) el._origen = origen || document.activeElement;
  el.hidden = false;
  void el.offsetWidth;
  el.classList.add('open');
  document.body.classList.add('no-scroll');
  const foco = el.querySelector('.modal__x, .drawer__cab [data-cerrar-drawer]');
  foco?.focus({ preventScroll: true });
}

function cerrarOverlay(el, devolver = true) {
  if (!el || el.hidden || !el.classList.contains('open')) return;
  el.classList.remove('open');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.hidden = true; }, reduceMotion ? 0 : 450);
  if (!document.querySelector('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll');
  if (devolver && el._origen && document.contains(el._origen)) el._origen.focus({ preventScroll: true });
}

let qv = null;

function fotosDe(p) {
  const fotos = [[p.foto, p.foco], ...(p.galeria || [])];
  if ((p.foco?.[2] || 1) > 1.2) fotos.push([p.foto, [p.foco[0], p.foco[1], 1]]);
  return fotos;
}

function precioQV(p, m) {
  if (esMedida(p)) return `<span class="precio__desde">desde</span> ${formatearPrecio(precioFinal(p))}<span class="precio__u">/ m²</span>`;
  const fin = formatearPrecio(precioFinal(p, m));
  const u = esMetro(p) ? '<span class="precio__u">/ m</span>' : '';
  return p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, m))}</s> ${fin}${u}` : `${fin}${u}`;
}

function renderQuick() {
  const p = getProducto(qv.id);
  const body = document.getElementById('qvBody');
  if (!p || !body) return;
  const cat = catDe(p.cat);
  const ar = window.innerWidth <= 760 ? 1 : 0.8;
  const fotos = fotosDe(p);
  const f = fotos[qv.foto] || fotos[0];
  const medidas = tieneMedidas(p) ? `<div class="qv__opc"><p class="qv__lbl" id="qvLblM">Medida</p><div class="opciones" role="radiogroup" aria-labelledby="qvLblM">${p.medidas.map((m, i) => `<button type="button" class="opcion" role="radio" aria-checked="${i === qv.m}" data-qv-m="${i}">${esc(m[0])}</button>`).join('')}</div></div>` : '';
  const colores = p.colores?.length ? `<div class="qv__opc"><p class="qv__lbl" id="qvLblC">Color: <span>${esc(nombreColor(qv.c))}</span></p><div class="opciones" role="radiogroup" aria-labelledby="qvLblC">${p.colores.map(k => `<button type="button" class="opcion opcion--color" role="radio" aria-checked="${k === qv.c}" data-qv-c="${k}" aria-label="${esc(nombreColor(k))}"><i style="--dc:${COLORES[k][1]}"></i></button>`).join('')}</div></div>` : '';
  const acciones = esMedida(p)
    ? `<button type="button" class="btn btn--cta" data-medir="${p.id}">Calcular con mi medida</button><a class="btn btn--wsp" href="${wspLink(`Hola Centro Textil! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>`
    : `<div class="stepper"><button type="button" data-qv-menos aria-label="Restar">−</button><span class="stepper__n">${fmtCant(qv.q)}</span>${esMetro(p) ? '<span class="stepper__u">m</span>' : ''}<button type="button" data-qv-mas aria-label="Sumar">+</button></div><button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button><button type="button" class="btn btn--ghost" data-qv-comprar>Comprar ahora</button>`;
  const mismos = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat);
  const vecinos = PRODUCTOS.filter(x => x.id !== p.id && x.cat !== p.cat && catDe(x.cat)?.amb === cat?.amb);
  const tambien = [...mismos, ...vecinos].slice(0, 3);
  body.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__foto recorte" style="${recorte(f[0], f[1], ar)}"><img src="images/${f[0]}" alt="${esc(p.alt)}" ${imgAttrs(f[0])}>${badgesHTML(p)}</div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((x, i) => `<button type="button" class="qv__thumb recorte" data-qv-foto="${i}" aria-pressed="${i === qv.foto}" aria-label="Ver la foto ${i + 1}" style="${recorte(x[0], x[1], 1)}"><img src="images/${x[0]}" alt="" ${imgAttrs(x[0])}></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre)} · ${esc(AMBIENTES[cat?.amb]?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${precioQV(p, qv.m)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.ficha ? `<dl class="qv__ficha">${p.ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${medidas}
      ${colores}
      <div class="qv__acciones">${acciones}</div>
    </div>
    ${tambien.length ? `<div class="qv__tambien"><p class="qv__tambien-tit">También te puede interesar</p><div class="qv__mini-lista">${tambien.map(x => `<button type="button" class="mini" data-quick="${x.id}"><span class="mini__foto recorte" style="${recorte(x.foto, x.foco, 1)}"><img src="images/${x.foto}" alt="" ${imgAttrs(x.foto)}></span><span class="mini__txt"><b>${esc(x.nombre)}</b><span>${precioHTML(x)}</span></span></button>`).join('')}</div></div>` : ''}`;
}

function ldProducto(p) {
  let s = document.getElementById('ldProducto');
  if (!s) {
    s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'ldProducto';
    document.head.appendChild(s);
  }
  const url = location.href.split('#')[0];
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(`images/${p.foto}`, url).href,
    description: p.desc,
    brand: { '@type': 'Brand', name: 'Centro Textil' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', url },
  });
}

function abrirQuick(id, origen) {
  const p = getProducto(id);
  const modal = document.getElementById('qv');
  if (!p || !modal) return;
  qv = { id, m: 0, c: p.colores?.[0] || '', q: 1, foto: 0 };
  renderQuick();
  ldProducto(p);
  const panel = modal.querySelector('.modal__panel');
  if (panel) panel.scrollTop = 0;
  abrirOverlay(modal, origen);
}

function initQuick() {
  const modal = document.getElementById('qv');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrarOverlay(modal); return; }
    const b = e.target.closest('button');
    if (!b || !qv) return;
    const p = getProducto(qv.id);
    let foco;
    if (b.dataset.qvFoto) { qv.foto = Number(b.dataset.qvFoto); foco = `[data-qv-foto="${qv.foto}"]`; }
    else if (b.dataset.qvM) { qv.m = Number(b.dataset.qvM); foco = `[data-qv-m="${qv.m}"]`; }
    else if (b.dataset.qvC) { qv.c = b.dataset.qvC; foco = `[data-qv-c="${qv.c}"]`; }
    else if (b.hasAttribute('data-qv-mas')) { qv.q = Math.min(99, qv.q + pasoDe(p)); foco = '[data-qv-mas]'; }
    else if (b.hasAttribute('data-qv-menos')) { qv.q = Math.max(1, qv.q - pasoDe(p)); foco = '[data-qv-menos]'; }
    else if (b.hasAttribute('data-qv-agregar')) { agregar(p, qv.q, qv.m, qv.c); return; }
    else if (b.hasAttribute('data-qv-comprar')) {
      Cart.add(p, qv.q, qv.m, qv.c);
      const origen = modal._origen;
      cerrarOverlay(modal, false);
      abrirDrawer(origen);
      return;
    } else return;
    renderQuick();
    modal.querySelector(foco)?.focus({ preventScroll: true });
  });
}

function renderDrawer() {
  const lista = document.getElementById('drawerLista');
  const pie = document.getElementById('drawerPie');
  if (!lista) return;
  const items = Cart.get();
  if (!items.length) {
    lista.innerHTML = '<div class="drawer__vacio"><span class="orillo__dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><p class="drawer__vacio-tit">Tu carrito está vacío</p><p>¿Arrancamos por las sábanas o por la cortina que te falta?</p><button type="button" class="btn btn--ghost" data-ir-tienda>Ver la tienda</button></div>';
    if (pie) pie.hidden = true;
    return;
  }
  lista.innerHTML = items.map((it, i) => {
    const p = getProducto(it.id);
    if (!p) return '';
    const v = varTexto(p, it);
    return `<div class="linea" style="--i:${i}">
      <div class="linea__foto recorte" style="${recorte(p.foto, p.foco, 1)}"><img src="images/${p.foto}" alt="" ${imgAttrs(p.foto)}></div>
      <div class="linea__cuerpo">
        <p class="linea__nombre">${esc(p.nombre)}</p>
        ${v ? `<p class="linea__var">${esc(v)}</p>` : ''}
        <div class="linea__fila">
          <div class="stepper" data-linea="${i}"><button type="button" data-linea-menos aria-label="Restar">−</button><span class="stepper__n">${fmtCant(it.qty)}</span>${esMetro(p) ? '<span class="stepper__u">m</span>' : ''}<button type="button" data-linea-mas aria-label="Sumar">+</button></div>
          <span class="linea__precio">${formatearPrecio(precioFinal(p, it.m) * it.qty)}</span>
          <button type="button" class="linea__quitar" data-linea-quitar="${i}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (pie) pie.hidden = false;
}

function abrirDrawer(origen) {
  renderDrawer();
  abrirOverlay(document.getElementById('drawer'), origen);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', e => abrirDrawer(e.currentTarget));
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarOverlay(drawer); return; }
    if (e.target.closest('[data-ir-tienda]')) { cerrarOverlay(drawer, false); irA('tienda'); return; }
    const b = e.target.closest('button');
    if (!b) return;
    const items = Cart.get();
    const st = b.closest('[data-linea]');
    if (st) {
      const i = Number(st.dataset.linea);
      const it = items[i];
      const p = getProducto(it?.id);
      if (!it || !p) return;
      const paso = pasoDe(p);
      const accion = b.hasAttribute('data-linea-mas') ? 'data-linea-mas' : 'data-linea-menos';
      Cart.setQty(i, it.qty + (accion === 'data-linea-mas' ? paso : -paso));
      drawer.querySelector(`[data-linea="${i}"] [${accion}]`)?.focus({ preventScroll: true });
      return;
    }
    if (b.dataset.lineaQuitar) {
      Cart.remove(Number(b.dataset.lineaQuitar));
      drawer.querySelector('.linea__quitar, [data-ir-tienda]')?.focus({ preventScroll: true });
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('keydown', e => {
    const abierto = ['qv', 'drawer'].map(id => document.getElementById(id)).find(x => x && x.classList.contains('open'));
    if (!abierto) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarOverlay(abierto); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(abierto);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!abierto.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  });
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
  let visto = false;
  const sync = () => {
    if (window.scrollY > 600) visto = true;
    wsp?.classList.toggle('visible', visto);
    cart?.classList.toggle('visible', visto || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
}

const med = { sis: 'tela', mat: 'voile', ancho: 180, alto: 200 };
let medirSet = null;

const matDe = st => SISTEMAS[st.sis].mats.find(m => m.id === st.mat) || SISTEMAS[st.sis].mats[0];

function calcularMedida(st) {
  const a = st.ancho / 100;
  const h = st.alto / 100;
  const mat = matDe(st);
  const prod = getProducto(mat.prod);
  const precio = prod ? precioFinal(prod) : 0;
  const m2txt = v => fmtNum(v, 2);
  const notaM2 = 'Precio de referencia por m². La medida final la tomamos con vos.';
  if (st.sis === 'tela') {
    let metros;
    let anchos = 0;
    if (mat.ancho >= 2.8) metros = arribaMedio(a * mat.fr + 0.4);
    else {
      anchos = Math.ceil((a * mat.fr) / (mat.ancho - 0.1));
      metros = arribaMedio(anchos * (h + 0.3));
    }
    const panos = a >= 1.2 ? 2 : 1;
    const largo = a + 0.3;
    const barral = largo <= 2.1 ? getProducto('barral-120') : largo <= 3.6 ? getProducto('barral-200') : null;
    const argollas = Math.ceil(a * mat.fr * 6);
    const packs = Math.ceil(argollas / 10);
    const pArg = getProducto('argollas');
    const total = metros * precio + (barral ? precioFinal(barral) : 0) + packs * precioFinal(pArg);
    const alta = mat.ancho >= 2.8 && h + 0.25 > mat.ancho;
    const lista = [
      `${fmtCant(metros)} m de ${mat.nombre.toLowerCase()}${anchos ? ` en ${anchos} anchos de 1,50 m` : ''}`,
      `${panos === 2 ? '2 paños' : '1 paño'} con fruncido ×${fmtNum(mat.fr, 1)}`,
      barral ? barral.nombre : 'Riel a medida, para más de 3,30 m',
      `${argollas} argollas (${packs} ${packs === 1 ? 'paquete' : 'paquetes'} x 10)`,
    ];
    const nota = alta
      ? 'Tu ventana es más alta que el ancho de la tela: la armamos con una costura o con tela de 3 m. Lo vemos por WhatsApp.'
      : 'Materiales a precio de lista. La confección la cotizamos con tu medida.';
    const wsp = `Hola Centro Textil! Medí mi ventana: ${st.ancho} × ${st.alto} cm. Quiero una cortina de ${mat.nombre.toLowerCase()}: calculé ${fmtCant(metros)} m de tela${barral ? `, ${barral.nombre.toLowerCase()}` : ''} y ${argollas} argollas. ¿Me pasan el precio de la confección?`;
    const carrito = [[prod, metros], barral ? [barral, 1] : null, [pArg, packs]].filter(x => x && x[0]);
    return { dato: `<b>${fmtCant(metros)} m</b> de ${esc(mat.nombre.toLowerCase())}`, lista, total, nota, carrito, wsp, metros, panos };
  }
  if (st.sis === 'roller') {
    const cant = a > 2.5 ? 2 : 1;
    const m2 = Math.max(1, Math.round(a * h * 100) / 100);
    const lista = [cant === 2 ? `2 rollers de ${Math.round(st.ancho / 2)} × ${st.alto} cm` : `1 roller de ${st.ancho} × ${st.alto} cm`, `Tela ${mat.nombre.toLowerCase()}, con cadena y contrapeso`, 'Se fabrica desde 1 m²'];
    const wsp = `Hola Centro Textil! Medí mi ventana: ${st.ancho} × ${st.alto} cm. Quiero cotizar ${cant === 2 ? '2 rollers' : 'un roller'} ${mat.nombre.toLowerCase()} (${m2txt(m2)} m²).`;
    return { dato: `<b>${m2txt(m2)} m²</b> de ${esc(mat.nombre.toLowerCase())}`, lista, total: m2 * precio, nota: notaM2, carrito: null, wsp, cant };
  }
  if (st.sis === 'panel') {
    const cant = Math.max(2, Math.ceil(a / 0.55));
    const vias = Math.min(5, cant);
    const m2 = Math.max(1, Math.round(cant * 0.6 * h * 100) / 100);
    const lista = [`${cant} paneles de 60 × ${st.alto} cm`, `Riel de ${vias} vías de ${fmtNum(a + 0.1, 2)} m`, `${m2txt(m2)} m² en ${mat.nombre.toLowerCase()}`];
    const wsp = `Hola Centro Textil! Medí mi ventana: ${st.ancho} × ${st.alto} cm. Quiero cotizar paneles orientales ${mat.nombre.toLowerCase()}: me dieron ${cant} paneles de 60 cm.`;
    return { dato: `<b>${cant} paneles</b> de 60 cm`, lista, total: m2 * precio, nota: notaM2, carrito: null, wsp, n: cant };
  }
  const cant = Math.ceil(a / 0.08);
  const m2 = Math.max(1, Math.round(a * h * 100) / 100);
  const lista = [`${cant} bandas de ${st.alto} cm de largo`, `Riel de ${fmtNum(a, 2)} m con cadena de giro`, `${m2txt(m2)} m² en ${mat.nombre.toLowerCase()}`];
  const wsp = `Hola Centro Textil! Medí mi ventana: ${st.ancho} × ${st.alto} cm. Quiero cotizar bandas verticales de ${mat.nombre.toLowerCase()}: me dieron ${cant} bandas.`;
  return { dato: `<b>${cant} bandas</b> de 89 mm`, lista, total: m2 * precio, nota: notaM2, carrito: null, wsp, n: cant };
}

function dibujarVentana(svg, st, r) {
  if (!svg) return;
  const W = 400, PISO = 300, MAXW = 236, MAXH = 190;
  const s = Math.min(MAXW / st.ancho, MAXH / st.alto);
  const w = st.ancho * s;
  const h = st.alto * s;
  const x0 = (W - w) / 2;
  const y0 = 58 + (MAXH - h) / 2;
  const mat = matDe(st);
  const n = v => v.toFixed(1);
  const p = [];
  p.push(`<defs><linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAFBFB"/><stop offset="1" stop-color="#C3ECEE"/></linearGradient><pattern id="rayasDuo" width="12" height="14" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="${mat.color}"/><rect y="8" width="12" height="6" fill="#FFFFFF" fill-opacity=".55"/></pattern></defs>`);
  p.push(`<rect x="0" y="0" width="${W}" height="${PISO}" fill="#FBF8F3"/><rect x="0" y="${PISO}" width="${W}" height="20" fill="#EFE6D8"/><line x1="0" y1="${PISO}" x2="${W}" y2="${PISO}" stroke="#E2D6C3"/>`);
  p.push(`<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" rx="2" fill="url(#vidrio)" stroke="#B9C9C8" stroke-width="3"/>`);
  p.push(`<line x1="${n(x0 + w / 2)}" y1="${n(y0)}" x2="${n(x0 + w / 2)}" y2="${n(y0 + h)}" stroke="#B9C9C8" stroke-width="2"/>`);
  p.push(`<rect x="${n(x0 - 8)}" y="${n(y0 + h)}" width="${n(w + 16)}" height="6" rx="2" fill="#E3DACB"/>`);
  let ext = 0;
  if (st.sis === 'tela') {
    ext = 15 * s;
    const xb0 = x0 - ext;
    const xb1 = x0 + w + ext;
    const yb = y0 - 16;
    const bajo = Math.min(PISO - 4, y0 + h + 24);
    const total = xb1 - xb0;
    const panos = r.panos || 2;
    const ancho = panos === 2 ? total * 0.33 : total * 0.46;
    const pliegues = Math.max(4, Math.min(16, Math.round((r.metros || 4) * 2.4 / panos)));
    const pano = x => {
      let d = `<rect x="${n(x)}" y="${n(yb)}" width="${n(ancho)}" height="${n(bajo - yb)}" fill="${mat.color}" fill-opacity="${mat.op}"/>`;
      for (let k = 1; k < pliegues; k += 2) d += `<rect x="${n(x + (ancho / pliegues) * k)}" y="${n(yb)}" width="${n(ancho / pliegues)}" height="${n(bajo - yb)}" fill="#173235" fill-opacity=".07"/>`;
      return d;
    };
    p.push(pano(xb0));
    if (panos === 2) p.push(pano(xb1 - ancho));
    p.push(`<line x1="${n(xb0 - 4)}" y1="${n(yb)}" x2="${n(xb1 + 4)}" y2="${n(yb)}" stroke="#56636A" stroke-width="3" stroke-linecap="round"/><circle cx="${n(xb0 - 6)}" cy="${n(yb)}" r="4.5" fill="#56636A"/><circle cx="${n(xb1 + 6)}" cy="${n(yb)}" r="4.5" fill="#56636A"/>`);
  } else if (st.sis === 'roller') {
    const cant = r.cant || 1;
    const g = cant === 2 ? 4 : 0;
    const wr = (w + 8 - g) / cant;
    const caida = h * 0.62;
    for (let k = 0; k < cant; k++) {
      const xr = x0 - 4 + k * (wr + g);
      p.push(`<rect x="${n(xr)}" y="${n(y0 - 2)}" width="${n(wr)}" height="${n(caida)}" fill="${mat.rayas ? 'url(#rayasDuo)' : mat.color}" fill-opacity="${mat.op}"/><rect x="${n(xr)}" y="${n(y0 - 2 + caida)}" width="${n(wr)}" height="5" rx="2" fill="#9D978C"/><rect x="${n(xr - 2)}" y="${n(y0 - 12)}" width="${n(wr + 4)}" height="10" rx="5" fill="#ECE8E1" stroke="#C8C1B5"/><line x1="${n(xr + wr - 6)}" y1="${n(y0)}" x2="${n(xr + wr - 6)}" y2="${n(y0 + h * 0.8)}" stroke="#8A847A" stroke-width="1.2" stroke-dasharray="2 2"/>`);
    }
  } else if (st.sis === 'panel') {
    const cant = r.n || 3;
    const xr0 = x0 - 8;
    const wt = w + 16;
    const pw = (wt / cant) * 1.08;
    const pasoX = cant > 1 ? (wt - pw) / (cant - 1) : 0;
    p.push(`<rect x="${n(xr0 - 2)}" y="${n(y0 - 16)}" width="${n(wt + 4)}" height="8" rx="2" fill="#D6D1C7"/>`);
    for (let k = 0; k < cant; k++) p.push(`<rect x="${n(xr0 + k * pasoX)}" y="${n(y0 - 8)}" width="${n(pw)}" height="${n(h + 16)}" fill="${mat.color}" fill-opacity="${mat.op}" stroke="#FFFFFF" stroke-opacity=".7"/>`);
  } else {
    const cant = r.n || 20;
    const xr0 = x0 - 6;
    const wt = w + 12;
    const paso = wt / cant;
    p.push(`<rect x="${n(xr0 - 2)}" y="${n(y0 - 14)}" width="${n(wt + 4)}" height="7" rx="2" fill="#D6D1C7"/>`);
    for (let k = 0; k < cant; k++) p.push(`<rect x="${n(xr0 + k * paso + paso * 0.1)}" y="${n(y0 - 7)}" width="${n(paso * 0.8)}" height="${n(h + 12)}" fill="${mat.color}" fill-opacity="${mat.op}"/>`);
  }
  const yc = y0 + h + 36;
  p.push(`<g class="cota"><line x1="${n(x0)}" y1="${n(yc)}" x2="${n(x0 + w)}" y2="${n(yc)}"/><line x1="${n(x0)}" y1="${n(yc - 5)}" x2="${n(x0)}" y2="${n(yc + 5)}"/><line x1="${n(x0 + w)}" y1="${n(yc - 5)}" x2="${n(x0 + w)}" y2="${n(yc + 5)}"/><text x="${n(x0 + w / 2)}" y="${n(yc - 6)}" text-anchor="middle">${st.ancho} cm</text></g>`);
  const xc = Math.min(W - 22, x0 + w + ext + 20);
  p.push(`<g class="cota"><line x1="${n(xc)}" y1="${n(y0)}" x2="${n(xc)}" y2="${n(y0 + h)}"/><line x1="${n(xc - 5)}" y1="${n(y0)}" x2="${n(xc + 5)}" y2="${n(y0)}"/><line x1="${n(xc - 5)}" y1="${n(y0 + h)}" x2="${n(xc + 5)}" y2="${n(y0 + h)}"/><text transform="translate(${n(xc + 13)} ${n(y0 + h / 2)}) rotate(-90)" text-anchor="middle">${st.alto} cm</text></g>`);
  svg.innerHTML = p.join('');
}

function initMedidor() {
  const root = document.getElementById('medir');
  if (!root) return;
  const sisInputs = [...root.querySelectorAll('input[name="sistema"]')];
  const mats = document.getElementById('mats');
  const ancho = document.getElementById('mAncho');
  const alto = document.getElementById('mAlto');
  const oA = document.getElementById('oAncho');
  const oH = document.getElementById('oAlto');
  const svg = document.getElementById('ventanaSvg');
  const dato = document.getElementById('mDato');
  const lista = document.getElementById('mLista');
  const total = document.getElementById('mTotal');
  const nota = document.getElementById('mNota');
  const btnCarrito = document.getElementById('mCarrito');
  const wsp = document.getElementById('mWsp');
  const lbl = document.getElementById('matLbl');
  if (!mats || !ancho || !alto) return;
  let ultimo = null;

  const pintarSistemas = () => sisInputs.forEach(i => { i.checked = i.value === med.sis; });
  const pintarMats = () => {
    const s = SISTEMAS[med.sis];
    if (lbl) lbl.textContent = med.sis === 'tela' ? 'Tela' : 'Material';
    mats.innerHTML = s.mats.map(m => `<label class="mat"><input class="sr-only" type="radio" name="material" value="${m.id}"${m.id === med.mat ? ' checked' : ''}><i style="--dc:${m.color}"></i>${esc(m.nombre)}</label>`).join('');
  };
  const pctRango = i => ((Number(i.value) - Number(i.min)) / (Number(i.max) - Number(i.min)) * 100).toFixed(1) + '%';
  const actualizar = () => {
    med.ancho = Number(ancho.value);
    med.alto = Number(alto.value);
    if (oA) oA.textContent = `${med.ancho} cm`;
    if (oH) oH.textContent = `${med.alto} cm`;
    ancho.style.setProperty('--p', pctRango(ancho));
    alto.style.setProperty('--p', pctRango(alto));
    const r = calcularMedida(med);
    ultimo = r;
    if (dato) dato.innerHTML = r.dato;
    if (lista) lista.innerHTML = r.lista.map(x => `<li>${esc(x)}</li>`).join('');
    if (total) total.textContent = formatearPrecio(r.total);
    if (nota) nota.textContent = r.nota;
    if (btnCarrito) btnCarrito.hidden = !r.carrito;
    if (wsp) {
      wsp.href = wspLink(r.wsp);
      wsp.textContent = r.carrito ? 'Pedir la confección por WhatsApp' : 'Pedir este presupuesto por WhatsApp';
    }
    dibujarVentana(svg, med, r);
  };
  const elegirSistema = sis => {
    if (!SISTEMAS[sis]) return;
    med.sis = sis;
    med.mat = SISTEMAS[sis].mats[0].id;
    pintarSistemas();
    pintarMats();
    actualizar();
  };
  sisInputs.forEach(i => i.addEventListener('change', () => { if (i.checked) elegirSistema(i.value); }));
  mats.addEventListener('change', e => {
    const i = e.target;
    if (i.name !== 'material' || !i.checked) return;
    med.mat = i.value;
    actualizar();
  });
  ancho.addEventListener('input', actualizar);
  alto.addEventListener('input', actualizar);
  btnCarrito?.addEventListener('click', () => {
    if (!ultimo?.carrito) return;
    ultimo.carrito.forEach(([p, q]) => Cart.add(p, q, 0, p.colores?.[0] || ''));
    const mat = matDe(med);
    showToast(`Sumaste ${fmtCant(ultimo.metros)} m de ${mat.nombre.toLowerCase()}, el barral y las argollas`);
  });
  medirSet = (sis, mat) => {
    if (!SISTEMAS[sis]) return;
    med.sis = sis;
    med.mat = mat && SISTEMAS[sis].mats.some(m => m.id === mat) ? mat : SISTEMAS[sis].mats[0].id;
    pintarSistemas();
    pintarMats();
    actualizar();
  };
  pintarSistemas();
  pintarMats();
  actualizar();
}

function medirPreset(sis, mat) {
  if (medirSet) medirSet(sis, mat);
  irA('medir');
}

function initMundos() {
  const sec = document.getElementById('mundos');
  if (!sec) return;
  const escena = sec.querySelector('.mundos__escena');
  const fotoA = sec.querySelector('.mundo--a .mundo__foto img');
  const fotoB = sec.querySelector('.mundo--b .mundo__foto img');
  const copyB = sec.querySelector('.mundo--b .mundo__copy');
  const linea = sec.querySelector('.mundos__linea');
  const dato = sec.querySelector('[data-dato]');
  const TOTAL = 5.3;
  if (!escena) return;
  if (reduceMotion) {
    sec.classList.add('is-static');
    if (dato) dato.textContent = fmtNum(TOTAL, 1);
    return;
  }
  const off = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const o = off();
    const total = r.height - (window.innerHeight - o);
    return total > 0 ? clamp01((o - r.top) / total) : 0;
  };
  const pintar = p => {
    const w = mezcla(108, -8, suave(tramo(p, 0.06, 0.78)));
    escena.style.setProperty('--w', w.toFixed(2));
    linea?.classList.toggle('is-off', w > 99.5 || w < 0.5);
    if (dato) dato.textContent = fmtNum(TOTAL * clamp01((100 - w) / 100), 1);
    if (fotoA) fotoA.style.transform = `scale(${mezcla(1, 1.06, p).toFixed(4)})`;
    if (fotoB) fotoB.style.transform = `scale(${mezcla(1.08, 1, suave(tramo(p, 0.2, 0.9))).toFixed(4)})`;
    if (copyB) copyB.style.transform = `translateY(${mezcla(26, 0, suave(tramo(p, 0.3, 0.62))).toFixed(1)}px)`;
  };
  const calcular = () => pintar(progreso());
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; calcular(); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
}

function initBanner() {
  const b = document.getElementById('banner');
  if (!b) return;
  const imgs = [...b.querySelectorAll('.banner__img')];
  const msgs = [...b.querySelectorAll('.banner__msg')];
  const num = b.querySelector('.banner__num b');
  const fotos = b.querySelector('.banner__fotos');
  if (imgs.length < 2) return;
  let i = 0;
  let timer = 0;
  let pausa = false;
  const ir = nIdx => {
    i = (nIdx + imgs.length) % imgs.length;
    imgs.forEach((x, k) => x.classList.toggle('is-on', k === i));
    msgs.forEach((x, k) => {
      const on = k === i;
      x.classList.toggle('is-on', on);
      x.inert = !on;
      x.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (num) num.textContent = i + 1;
  };
  const auto = () => {
    window.clearInterval(timer);
    if (!reduceMotion && !pausa && !document.hidden) timer = window.setInterval(() => ir(i + 1), 6000);
  };
  b.querySelector('[data-banner="prev"]')?.addEventListener('click', () => { ir(i - 1); auto(); });
  b.querySelector('[data-banner="next"]')?.addEventListener('click', () => { ir(i + 1); auto(); });
  fotos?.addEventListener('mouseenter', () => { pausa = true; window.clearInterval(timer); });
  fotos?.addEventListener('mouseleave', () => { pausa = false; auto(); });
  fotos?.addEventListener('focusin', () => { pausa = true; window.clearInterval(timer); });
  fotos?.addEventListener('focusout', () => { pausa = false; auto(); });
  document.addEventListener('visibilitychange', auto);
  ir(0);
  auto();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el) return;
  if (typeof L === 'undefined') {
    el.innerHTML = '<p class="mapa__sin">Boulogne Sur Mer, San Isidro</p>';
    return;
  }
  const pos = [-34.5089, -58.5655];
  const mapa = L.map(el, { center: pos, zoom: 15, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span class="pin__punto"></span>', iconSize: [28, 28], iconAnchor: [14, 14] });
  L.marker(pos, { icon: icono, title: 'Centro Textil · Boulogne', alt: 'Centro Textil' }).addTo(mapa).bindPopup('<b>Centro Textil</b><br>Boulogne Sur Mer, San Isidro');
  const ajustar = () => mapa.invalidateSize();
  window.addEventListener('load', ajustar);
  setTimeout(ajustar, 600);
}

function initNewsletter() {
  const f = document.getElementById('newsForm');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input[type="email"]');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
    inp.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (!ok) { showToast('Revisá el email: parece que le falta algo.'); inp.focus(); return; }
    const btn = f.querySelector('button');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      f.reset();
      inp.removeAttribute('aria-invalid');
      btn.disabled = false;
      btn.textContent = txt;
    }, 800);
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
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-plx]').forEach(el => {
    const amt = Number(el.dataset.plx) || 3;
    gsap.fromTo(el, { yPercent: -amt }, {
      yPercent: amt,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: el.dataset.plxStart || 'top bottom', end: 'bottom top', scrub: true },
    });
  });
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
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', renderDrawer);

aplicarRecortes();
contar();
renderRail();
renderSwatches();
renderCatalogo();
renderDrawer();
updateCartBadge();
initModelBarScroll();
initNav();
initBuscador();
initCatalogoUI();
initRail();
initDelegacion();
initQuick();
initDrawer();
initFloats();
initMedidor();
initMundos();
initBanner();
initMapa();
initNewsletter();
initHeroMotion();
initParallax();
initReveals();
