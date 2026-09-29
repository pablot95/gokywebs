const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const WSP = '5492974098295';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'lamparas-sal-9x16.webp': [1071, 1904],
  'cuenco-16x9.webp': [1898, 1068],
  'buda-incienso-1x1.webp': [1072, 1072],
  'sahumos-1x1.webp': [1062, 1062],
  'piedras-1x1.webp': [1062, 1062],
  'aromaterapia-1x1.webp': [1072, 1072],
};

const CATEGORIAS = [
  { id: 'sahumar', label: 'Para sahumar', largo: 'Sahumerios, sahumos y hierbas' },
  { id: 'encender', label: 'Para encender', largo: 'Velas, velones y lámparas de sal' },
  { id: 'piedras', label: 'Piedras y cristales', largo: 'Piedras y cristales' },
  { id: 'aromaterapia', label: 'Aromaterapia y baño', largo: 'Difusores, aceites, sales y jabones' },
  { id: 'budas', label: 'Budas y deidades', largo: 'Budas y deidades' },
];

const COLORES = { Blanco: '#F4F1EA', Rojo: '#B3372B', Naranja: '#D2691E', Amarillo: '#D4A017', Verde: '#16A34A', Azul: '#2563EB', Violeta: '#7C4DBA' };

const CHAKRAS = [
  { id: 'raiz', n: 1, nombre: 'Raíz', sanscrito: 'Muladhara', color: '#B3372B', tema: 'Sentirte en casa', frase: 'Se lo asocia con la seguridad, el cuerpo y la sensación de estar con los pies en la tierra.', piedras: 'Obsidiana y ojo de tigre', aroma: 'Mirra', vela: 'Rojo', recomendados: [[18], [10], [8, 'Rojo']] },
  { id: 'sacro', n: 2, nombre: 'Sacro', sanscrito: 'Svadhisthana', color: '#D2691E', tema: 'Crear y disfrutar', frase: 'Se lo asocia con la creatividad, el disfrute y las emociones.', piedras: 'Ojo de tigre', aroma: 'Naranja', vela: 'Naranja', recomendados: [[11], [4], [21, 'Naranja']] },
  { id: 'plexo', n: 3, nombre: 'Plexo solar', sanscrito: 'Manipura', color: '#D4A017', tema: 'Confiar en vos', frase: 'Se lo asocia con la confianza, la voluntad y la energía para hacer.', piedras: 'Ojo de tigre', aroma: 'Canela y romero', vela: 'Amarillo', recomendados: [[15], [1, 'Canela'], [8, 'Amarillo']] },
  { id: 'corazon', n: 4, nombre: 'Corazón', sanscrito: 'Anahata', color: '#16A34A', tema: 'Amar y soltar', frase: 'Se lo asocia con el amor, el perdón y los vínculos.', piedras: 'Cuarzo rosa y aventurina', aroma: 'Rosa', vela: 'Verde', recomendados: [[14], [3], [8, 'Verde']] },
  { id: 'garganta', n: 5, nombre: 'Garganta', sanscrito: 'Vishuddha', color: '#2563EB', tema: 'Decir lo que sentís', frase: 'Se lo asocia con la comunicación y la forma de expresarte.', piedras: 'Lapislázuli', aroma: 'Eucalipto', vela: 'Azul', recomendados: [[16], [21, 'Eucalipto'], [8, 'Azul']] },
  { id: 'tercer-ojo', n: 6, nombre: 'Tercer ojo', sanscrito: 'Ajna', color: '#4F46E5', tema: 'Escuchar tu intuición', frase: 'Se lo asocia con la intuición, la claridad y los sueños.', piedras: 'Amatista y lapislázuli', aroma: 'Lavanda', vela: 'Violeta', recomendados: [[12], [1, 'Lavanda'], [9]] },
  { id: 'corona', n: 7, nombre: 'Corona', sanscrito: 'Sahasrara', color: '#7C4DBA', tema: 'Meditar y conectar', frase: 'Se lo asocia con la espiritualidad y la conexión con algo más grande.', piedras: 'Cuarzo cristal y amatista', aroma: 'Sándalo', vela: 'Blanco', recomendados: [[13], [2], [8, 'Blanco']] },
];

const PRODUCTOS = [
  {
    id: 1, slug: 'sahumerios-en-varilla', nombre: 'Sahumerios en varilla · caja x 20', cat: 'sahumar', precio: 3900, descuento: 0, stock: 40, orden: 5,
    variantes: { tipo: 'aroma', titulo: 'Aroma', opciones: [{ v: 'Sándalo', chakra: 'corona' }, { v: 'Lavanda', chakra: 'tercer-ojo' }, { v: 'Palo santo' }, { v: 'Mirra', chakra: 'raiz' }, { v: 'Canela', chakra: 'plexo' }, { v: 'Rosas', chakra: 'corazon' }] },
    chakras: [], tags: 'incienso varitas aroma',
    desc: 'Varillas de combustión lenta para perfumar un ambiente mientras meditás, leés o trabajás. Elegí el aroma.',
    img: 'buda-incienso-1x1.webp', foco: [0.78, 0.32, 1.9], galeria: [['buda-incienso-1x1.webp', [0.66, 0.62, 1.4]]],
    alt: 'Varilla de sahumerio encendida con su hilo de humo, junto a una figura de Buda',
  },
  {
    id: 2, slug: 'sahumo-de-salvia-blanca', nombre: 'Sahumo de salvia blanca', cat: 'sahumar', precio: 7800, descuento: 0, stock: 18, orden: 2,
    chakras: ['corona'], tags: 'limpieza energetica purificar casa atado',
    desc: 'Atado de salvia blanca seca para sahumar la casa cuando sentís que el ambiente está pesado.',
    img: 'sahumos-1x1.webp', foco: [0.13, 0.5, 3], galeria: [['sahumos-1x1.webp', [0.5, 0.5, 1]]],
    alt: 'Atado de salvia blanca seca atado con hilo, junto a hojas de eucalipto',
  },
  {
    id: 3, slug: 'sahumo-de-rosas-y-salvia', nombre: 'Sahumo de rosas y salvia', cat: 'sahumar', precio: 8600, descuento: 0, stock: 12, orden: 8,
    chakras: ['corazon'], tags: 'amor armonia atado',
    desc: 'Salvia envuelta en pétalos de rosa secos, para sahumar con una intención de amor y armonía.',
    img: 'sahumos-1x1.webp', foco: [0.34, 0.46, 2], galeria: [['sahumos-1x1.webp', [0.5, 0.5, 1]]],
    alt: 'Atado de salvia envuelto en pétalos de rosa secos',
  },
  {
    id: 4, slug: 'sahumo-de-calendula', nombre: 'Sahumo de caléndula', cat: 'sahumar', precio: 8600, descuento: 0, stock: 10, orden: 13,
    chakras: ['plexo', 'sacro'], tags: 'flores atado',
    desc: 'Salvia y flores de caléndula secas: un atado luminoso para empezar el día o abrir un espacio nuevo.',
    img: 'sahumos-1x1.webp', foco: [0.64, 0.44, 1.9], galeria: [['sahumos-1x1.webp', [0.68, 0.33, 3]]],
    alt: 'Atado de salvia con flores de caléndula naranjas',
  },
  {
    id: 5, slug: 'hierbas-para-sahumar', nombre: 'Hierbas para sahumar · 50 g', cat: 'sahumar', precio: 5200, descuento: 0, stock: 20, orden: 18,
    chakras: ['raiz'], tags: 'romero ruda laurel carbon proteccion resinas',
    desc: 'Romero, ruda y laurel secos para quemar sobre carbón o en un hornillo.',
    img: 'sahumos-1x1.webp', foco: [0.14, 0.12, 3.2], galeria: [],
    alt: 'Cuenco de madera con hierbas secas para sahumar',
  },
  {
    id: 6, slug: 'petalos-de-rosa-secos', nombre: 'Pétalos de rosa secos · 30 g', cat: 'sahumar', precio: 4600, descuento: 0, stock: 15, orden: 20,
    chakras: ['corazon'], tags: 'rosas baño altar',
    desc: 'Para sahumar, armar un altar o sumar a un baño de sales.',
    img: 'sahumos-1x1.webp', foco: [0.15, 0.87, 3], galeria: [],
    alt: 'Pétalos de rosa secos sobre una mesa de madera',
  },
  {
    id: 7, slug: 'ramito-de-eucalipto', nombre: 'Ramito de eucalipto seco', cat: 'sahumar', precio: 4200, descuento: 0, stock: 14, orden: 23,
    chakras: ['garganta'], tags: 'eucalipto ducha vapor',
    desc: 'Hojas de eucalipto para sahumar o para colgar en la ducha y perfumar el vapor.',
    img: 'sahumos-1x1.webp', foco: [0.85, 0.9, 3], galeria: [],
    alt: 'Hojas de eucalipto seco junto a un cuenco de madera',
  },
  {
    id: 8, slug: 'velon-de-7-dias', nombre: 'Velón de 7 días', cat: 'encender', precio: 6800, descuento: 0, stock: 30, orden: 9,
    variantes: { tipo: 'color', titulo: 'Color', opciones: [{ v: 'Blanco', chakra: 'corona' }, { v: 'Rojo', chakra: 'raiz' }, { v: 'Naranja', chakra: 'sacro' }, { v: 'Amarillo', chakra: 'plexo' }, { v: 'Verde', chakra: 'corazon' }, { v: 'Azul', chakra: 'garganta' }, { v: 'Violeta', chakra: 'tercer-ojo' }] },
    chakras: [], tags: 'vela velon colores intencion velomancia',
    desc: 'Vela en vaso de vidrio para acompañar una intención durante varios días. Elegí el color.',
    img: 'lamparas-sal-9x16.webp', foco: [0.29, 0.93, 2], galeria: [],
    alt: 'Vela encendida dentro de un vaso de vidrio',
  },
  {
    id: 9, slug: 'vela-de-soja-con-lavanda', nombre: 'Vela de soja con lavanda', cat: 'encender', precio: 11900, descuento: 0, stock: 9, orden: 7,
    chakras: ['tercer-ojo'], tags: 'vela aromatica soja',
    desc: 'Vela de cera de soja en vaso de vidrio, con aroma a lavanda.',
    img: 'aromaterapia-1x1.webp', foco: [0.9, 0.83, 3], galeria: [['aromaterapia-1x1.webp', [0.5, 0.5, 1]]],
    alt: 'Vela blanca encendida en un vaso de vidrio',
  },
  {
    id: 10, slug: 'lampara-de-sal-del-himalaya', nombre: 'Lámpara de sal del Himalaya', cat: 'encender', precio: 24900, descuento: 0, stock: 8, orden: 3,
    variantes: { tipo: 'peso', titulo: 'Tamaño', opciones: [{ v: '2 a 3 kg', precio: 24900 }, { v: '4 a 6 kg', precio: 36900 }] },
    chakras: ['raiz', 'sacro'], tags: 'lampara sal rosada luz calida',
    desc: 'Bloque de sal rosada sobre base de madera, con cable y lamparita. Da una luz cálida y tenue.',
    img: 'lamparas-sal-9x16.webp', foco: [0.35, 0.3, 1.25], galeria: [['lamparas-sal-9x16.webp', [0.5, 0.55, 1]], ['lamparas-sal-9x16.webp', [0.17, 0.56, 1.7]]],
    alt: 'Lámpara de sal rosada encendida, de forma irregular',
  },
  {
    id: 11, slug: 'lampara-de-sal-pulida', nombre: 'Lámpara de sal pulida · forma huevo', cat: 'encender', precio: 22000, descuento: 10, stock: 6, orden: 15,
    chakras: ['raiz', 'sacro'], tags: 'lampara sal pulida mesa de luz',
    desc: 'Sal rosada pulida en forma de huevo, sobre base de madera torneada. Ideal para la mesa de luz.',
    img: 'lamparas-sal-9x16.webp', foco: [0.66, 0.66, 1.6], galeria: [['lamparas-sal-9x16.webp', [0.6, 0.72, 1.1]]],
    alt: 'Lámpara de sal pulida en forma de huevo, encendida sobre una base de madera',
  },
  {
    id: 12, slug: 'drusa-de-amatista', nombre: 'Drusa de amatista', cat: 'piedras', precio: 28900, descuento: 0, stock: 2, orden: 6,
    chakras: ['tercer-ojo', 'corona'], tags: 'geoda violeta cristal',
    desc: 'Geoda de amatista con sus cristales a la vista. Cada pieza es única: la tuya puede variar en forma y tamaño.',
    img: 'piedras-1x1.webp', foco: [0.41, 0.26, 2], galeria: [['piedras-1x1.webp', [0.5, 0.5, 1]]],
    alt: 'Drusa de amatista violeta con los cristales a la vista',
  },
  {
    id: 13, slug: 'punta-de-cuarzo-cristal', nombre: 'Punta de cuarzo cristal', cat: 'piedras', precio: 12900, descuento: 0, stock: 11, orden: 14,
    chakras: ['corona'], tags: 'cuarzo blanco transparente punta',
    desc: 'Punta de cuarzo transparente para el altar, el escritorio o para meditar con ella en la mano.',
    img: 'piedras-1x1.webp', foco: [0.72, 0.22, 2.2], galeria: [],
    alt: 'Punta de cuarzo cristal transparente',
  },
  {
    id: 14, slug: 'cuarzo-rosa-rodado', nombre: 'Cuarzo rosa rodado', cat: 'piedras', precio: 3200, descuento: 0, stock: 50, orden: 11,
    chakras: ['corazon'], tags: 'amor piedra rosa',
    desc: 'Piedra rodada de cuarzo rosa, para llevar con vos o dejar en la mesa de luz.',
    img: 'piedras-1x1.webp', foco: [0.2, 0.55, 2.8], galeria: [],
    alt: 'Piedra rodada de cuarzo rosa',
  },
  {
    id: 15, slug: 'ojo-de-tigre-rodado', nombre: 'Ojo de tigre rodado', cat: 'piedras', precio: 3200, descuento: 0, stock: 45, orden: 17,
    chakras: ['plexo', 'raiz'], tags: 'piedra marron dorada',
    desc: 'Piedra rodada de ojo de tigre, con vetas doradas que cambian con la luz.',
    img: 'piedras-1x1.webp', foco: [0.46, 0.63, 2.8], galeria: [],
    alt: 'Piedra rodada de ojo de tigre con vetas doradas',
  },
  {
    id: 16, slug: 'lapislazuli-rodado', nombre: 'Lapislázuli rodado', cat: 'piedras', precio: 4600, descuento: 0, stock: 30, orden: 19,
    chakras: ['garganta', 'tercer-ojo'], tags: 'piedra azul',
    desc: 'Piedra rodada de lapislázuli: azul profundo con puntos dorados.',
    img: 'piedras-1x1.webp', foco: [0.71, 0.72, 2.8], galeria: [],
    alt: 'Piedra rodada de lapislázuli azul con puntos dorados',
  },
  {
    id: 17, slug: 'aventurina-verde-rodada', nombre: 'Aventurina verde rodada', cat: 'piedras', precio: 2900, descuento: 0, stock: 40, orden: 22,
    chakras: ['corazon'], tags: 'piedra verde brillo',
    desc: 'Piedra rodada de aventurina, verde, con brillos que aparecen al moverla.',
    img: 'piedras-1x1.webp', foco: [0.59, 0.49, 3.8], galeria: [],
    alt: 'Piedra rodada de aventurina verde con brillos',
  },
  {
    id: 18, slug: 'obsidiana-dorada-rodada', nombre: 'Obsidiana dorada rodada', cat: 'piedras', precio: 3600, descuento: 0, stock: 25, orden: 24,
    chakras: ['raiz'], tags: 'piedra negra oscura proteccion',
    desc: 'Piedra rodada oscura con reflejos dorados.',
    img: 'piedras-1x1.webp', foco: [0.73, 0.55, 3.4], galeria: [],
    alt: 'Piedra rodada oscura con reflejos dorados',
  },
  {
    id: 19, slug: 'set-7-piedras-chakras', nombre: 'Set de 7 piedras de los chakras', cat: 'piedras', precio: 16000, descuento: 15, stock: 12, orden: 1, nuevo: true,
    chakras: ['raiz', 'sacro', 'plexo', 'corazon', 'garganta', 'tercer-ojo', 'corona'], tags: 'kit set siete chakras armonizacion',
    desc: 'Siete piedras rodadas, una por chakra, en bolsita de tela. Para meditar o acompañar una armonización.',
    img: 'piedras-1x1.webp', foco: [0.5, 0.52, 1.05], galeria: [['piedras-1x1.webp', [0.45, 0.62, 1.6]]],
    alt: 'Amatista, cuarzos y piedras rodadas de colores sobre una rodaja de tronco',
  },
  {
    id: 20, slug: 'difusor-ultrasonico', nombre: 'Difusor ultrasónico símil madera', cat: 'aromaterapia', precio: 38900, descuento: 0, stock: 5, orden: 10,
    chakras: [], tags: 'difusor humidificador aromatizador',
    desc: 'Difusor de aromas con luz cálida: se usa con agua y unas gotas de aceite esencial.',
    img: 'aromaterapia-1x1.webp', foco: [0.63, 0.45, 1.35], galeria: [['aromaterapia-1x1.webp', [0.5, 0.5, 1]]],
    alt: 'Difusor de aromas de madera clara soltando vapor',
  },
  {
    id: 21, slug: 'aceite-esencial', nombre: 'Aceite esencial · 10 ml', cat: 'aromaterapia', precio: 7200, descuento: 0, stock: 35, orden: 4,
    variantes: { tipo: 'aroma', titulo: 'Aroma', opciones: [{ v: 'Lavanda', chakra: 'tercer-ojo' }, { v: 'Eucalipto', chakra: 'garganta' }, { v: 'Naranja', chakra: 'sacro' }, { v: 'Menta', chakra: 'garganta' }, { v: 'Romero', chakra: 'plexo' }, { v: 'Ylang ylang', chakra: 'corazon' }] },
    chakras: [], tags: 'aceite esencial aromaterapia hornillo',
    desc: 'Aceite esencial para difusor u hornillo. Elegí el aroma.',
    img: 'aromaterapia-1x1.webp', foco: [0.51, 0.77, 2.1], galeria: [],
    alt: 'Tres frascos de vidrio ámbar de aceite esencial',
  },
  {
    id: 22, slug: 'sales-de-bano-lavanda', nombre: 'Sales de baño con lavanda · 500 g', cat: 'aromaterapia', precio: 6900, descuento: 0, stock: 16, orden: 16,
    chakras: ['tercer-ojo'], tags: 'sales baño relax',
    desc: 'Sal rosada con flores de lavanda, en frasco de vidrio con tapa de corcho.',
    img: 'aromaterapia-1x1.webp', foco: [0.15, 0.62, 2.2], galeria: [],
    alt: 'Frasco de vidrio con sales de baño rosadas y flores secas',
  },
  {
    id: 23, slug: 'jabon-artesanal-lavanda', nombre: 'Jabón artesanal de lavanda', cat: 'aromaterapia', precio: 4800, descuento: 0, stock: 20, orden: 21, nuevo: true,
    chakras: ['tercer-ojo'], tags: 'jabon barra',
    desc: 'Jabón en barra con flores de lavanda secas.',
    img: 'aromaterapia-1x1.webp', foco: [0.36, 0.92, 3], galeria: [],
    alt: 'Jabón artesanal en barra con flores de lavanda',
  },
  {
    id: 24, slug: 'buda-meditando', nombre: 'Buda meditando · 30 cm', cat: 'budas', precio: 32900, descuento: 0, stock: 3, orden: 12,
    chakras: ['corona'], tags: 'buda estatua figura meditacion deidad',
    desc: 'Figura de Buda en posición de meditación, en resina con terminación símil bronce.',
    img: 'buda-incienso-1x1.webp', foco: [0.33, 0.35, 1.3], galeria: [],
    alt: 'Figura de Buda meditando con terminación símil bronce',
  },
];

const RAIL = [2, 10, 12, 1, 8, 21];

const SERVICIOS = [
  { id: 'armonizacion', cat: 'piedras', cta: 'Reservar por WhatsApp', msg: 'Hola! Quiero reservar una armonización de chakras. ¿Qué días tienen?', ver: n => `Ver las ${n} piedras` },
  { id: 'limpieza', cat: 'sahumar', cta: 'Reservar por WhatsApp', msg: 'Hola! Quiero reservar una limpieza energética. ¿Cómo la coordinamos?', ver: n => `Ver los ${n} para sahumar` },
  { id: 'velomancia', cat: 'encender', cta: 'Reservar por WhatsApp', msg: 'Hola! Quiero reservar una velomancia. ¿Qué días tienen?', ver: n => `Ver los ${n} para encender` },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const catDe = id => CATEGORIAS.find(c => c.id === id) || { id, label: id, largo: id };
const chakraDe = id => CHAKRAS.find(c => c.id === id);
const opcionesDe = p => p?.variantes?.opciones || [];
const opcionDe = (p, v) => opcionesDe(p).find(o => o.v === v);
const varianteValida = (p, v) => (opcionesDe(p).length ? !!opcionDe(p, v) : !v);
const varDefault = p => opcionesDe(p)[0]?.v || '';
const chakrasDe = p => [...new Set([...(p.chakras || []), ...opcionesDe(p).map(o => o.chakra).filter(Boolean)])];
const conDescuento = (p, base) => (p.descuento > 0 ? Math.round(base * (1 - p.descuento / 100)) : base);
const precioBase = (p, v = varDefault(p)) => opcionDe(p, v)?.precio ?? p.precio;
const precioDe = (p, v = varDefault(p)) => conDescuento(p, precioBase(p, v));
const precioDesde = p => Math.min(...(opcionesDe(p).length ? opcionesDe(p).map(o => precioDe(p, o.v)) : [precioDe(p)]));
const productosDeCat = id => PRODUCTOS.filter(p => p.cat === id);
const productosDeChakra = id => PRODUCTOS.filter(p => chakrasDe(p).includes(id));
const nombreConVariante = (p, v) => (v ? `${p.nombre} · ${v}` : p.nombre);

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const Cart = {
  KEY: 'sadhanaterra_cart',
  enMemoria: null,
  leer() {
    if (this.enMemoria) return this.enMemoria.map(i => ({ ...i }));
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  get() {
    const crudo = this.leer();
    if (!Array.isArray(crudo)) return [];
    return crudo.reduce((lista, i) => {
      const p = getProducto(i?.id);
      const v = typeof i?.v === 'string' ? i.v : '';
      const qty = Math.floor(Number(i?.qty));
      if (!p || !varianteValida(p, v) || !(qty > 0) || p.stock <= 0) return lista;
      const previo = lista.find(x => x.id === p.id && x.v === v);
      if (previo) previo.qty = Math.min(previo.qty + qty, p.stock);
      else lista.push({ id: p.id, v, qty: Math.min(qty, p.stock) });
      return lista;
    }, []);
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); this.enMemoria = null; } catch { this.enMemoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = varDefault(producto)) {
    if (!producto || !varianteValida(producto, v)) return 0;
    const items = this.get();
    const enLinea = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const existing = items.find(i => i.id === producto.id && i.v === v);
    const cupo = Math.max(0, (producto.stock ?? 99) - enLinea);
    const suma = Math.min(qty, cupo);
    if (suma <= 0) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === Number(id) && i.v === v);
    if (!it) return;
    const p = getProducto(id);
    const otras = items.filter(i => i.id === Number(id) && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otras));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === Number(id) && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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
  const desktopMq = window.matchMedia('(min-width: 1000px)');
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

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  revealsListos = true;
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
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => el.classList.add('in'), 500);
  });
}

let ultimoFoco = null;
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

const scrollSuave = el => el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function pintarRecortes() {
  document.querySelectorAll('[data-recorte]').forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    const r = el.getBoundingClientRect();
    const ar = r.width && r.height ? r.width / r.height : 1;
    el.setAttribute('style', recorte(img, [Number(cx), Number(cy), Number(z)], ar));
  });
}

function initRecortesEstaticos() {
  pintarRecortes();
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(pintarRecortes, 160); }, { passive: true });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    el.textContent = cuantos(productosDeCat(el.dataset.cuentaCat).length, 'producto', 'productos');
  });
  document.querySelectorAll('[data-total-tienda-corto]').forEach(el => {
    el.textContent = `${cuantos(PRODUCTOS.length, 'producto', 'productos')} · ${cuantos(CATEGORIAS.length, 'categoría', 'categorías')}`;
  });
  document.querySelectorAll('[data-dato-cat]').forEach(el => {
    const lista = productosDeCat(el.dataset.datoCat);
    if (!lista.length) return;
    const palabra = el.dataset.datoCat === 'piedras' ? ['piedra', 'piedras'] : ['producto', 'productos'];
    el.textContent = `En la tienda: ${cuantos(lista.length, ...palabra)} desde ${formatearPrecio(Math.min(...lista.map(precioDesde)))}`;
  });
}

const ICONO_CARRITO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function badgeHTML(p) {
  if (p.stock <= 0) return '<span class="prod-badge">Sin stock</span>';
  if (p.descuento > 0) return `<span class="prod-badge desc">-${p.descuento}%</span>`;
  if (p.nuevo) return '<span class="prod-badge">Nuevo</span>';
  if (p.stock <= 3) return '<span class="prod-badge ultimas">Últimas unidades</span>';
  return '';
}

function precioHTML(p, v = varDefault(p)) {
  const base = precioBase(p, v);
  const final = precioDe(p, v);
  return p.descuento > 0 ? `<s>${formatearPrecio(base)}</s><span class="con-desc">${formatearPrecio(final)}</span>` : `<span>${formatearPrecio(final)}</span>`;
}

function metaHTML(p, v) {
  if (!v) return esc(catDe(p.cat).label);
  const t = p.variantes;
  const punto = t.tipo === 'color' ? `<i class="punto" style="--c:${COLORES[v] || '#ccc'}"></i> ` : '';
  return `${punto}${esc(t.titulo)}: ${esc(v)}`;
}

const Filtro = { cats: new Set(), chakras: new Set(), precioMax: null, q: '', orden: 'destacados' };

function varianteSugerida(p) {
  if (Filtro.chakras.size === 1) {
    const [ch] = [...Filtro.chakras];
    const op = opcionesDe(p).find(o => o.chakra === ch);
    if (op) return op.v;
  }
  return varDefault(p);
}

function cardHTML(p) {
  const v = varianteSugerida(p);
  const nombre = nombreConVariante(p, v);
  return `<article class="prod" data-animate style="opacity:0;transform:translateY(32px)">
    <button type="button" class="prod-media recorte" data-open-quickview="${p.id}" data-v="${esc(v)}" style="${recorte(p.img, p.foco, 1)}" aria-label="Ver ${esc(nombre)}">
      ${badgeHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="600">
    </button>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${metaHTML(p, v)}</p>
      <div class="prod-pie">
        <p class="precio">${precioHTML(p, v)}</p>
        <div class="prod-actions">
          ${p.stock > 0 ? `<button type="button" class="btn-add prod-add" data-add="${p.id}" data-v="${esc(v)}" aria-label="Agregar ${esc(nombre)} al carrito">${ICONO_CARRITO_MAS}<span>Agregar</span></button>` : '<button type="button" class="btn-add prod-add" disabled>Sin stock</button>'}
        </div>
      </div>
    </div>
  </article>`;
}

function railCardHTML(p) {
  const v = varDefault(p);
  const nombre = nombreConVariante(p, v);
  return `<article class="rail-card">
    <button type="button" class="rail-media recorte" data-open-quickview="${p.id}" style="${recorte(p.img, p.foco, 0.8)}" aria-label="Ver ${esc(nombre)}">
      ${badgeHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="480" height="600">
    </button>
    <div class="rail-body">
      <h3 class="rail-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${v ? metaHTML(p, v) : esc(catDe(p.cat).label)}</p>
      <div class="rail-fila">
        <p class="precio">${precioHTML(p, v)}</p>
        <button type="button" class="btn-add" data-add="${p.id}" data-v="${esc(v)}" aria-label="Agregar ${esc(nombre)} al carrito">${ICONO_CARRITO_MAS}<span>Agregar</span></button>
      </div>
    </div>
  </article>`;
}

function agregar(p, qty = 1, v = varDefault(p)) {
  if (!p) return 0;
  const nombre = nombreConVariante(p, v);
  if (p.stock <= 0) { showToast(`${p.nombre} está sin stock por ahora`); return 0; }
  const n = Cart.add(p, qty, v);
  showToast(n ? `Sumaste ${n > 1 ? `${n} × ` : ''}${nombre} al carrito` : `Ya tenés en el carrito todas las unidades de ${p.nombre}`);
  return n;
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  track.innerHTML = RAIL.map(getProducto).filter(Boolean).map(railCardHTML).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
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
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = null; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { if (pointerId !== null) vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (moved) {
      requestAnimationFrame(() => vp.classList.remove('dragging'));
      setTimeout(() => { moved = false; }, 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => {
    const card = track.querySelector('.rail-card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return card ? card.getBoundingClientRect().width + gap : 300;
  };
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 4;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

const PAGINA = 16;
let visibles = PAGINA;
const Catalogo = {};

function textoBusqueda(p) {
  const partes = [p.nombre, catDe(p.cat).label, p.desc, p.tags, ...opcionesDe(p).map(o => o.v), ...chakrasDe(p).map(id => chakraDe(id)?.nombre)];
  return normalizar(partes.filter(Boolean).join(' '));
}

function filtrar() {
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(w => w.length > 1);
  let lista = PRODUCTOS.filter(p => {
    if (Filtro.cats.size && !Filtro.cats.has(p.cat)) return false;
    if (Filtro.chakras.size && !chakrasDe(p).some(c => Filtro.chakras.has(c))) return false;
    if (Filtro.precioMax && precioDesde(p) > Filtro.precioMax) return false;
    if (palabras.length) {
      const t = textoBusqueda(p);
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  });
  if (Filtro.orden === 'precio-asc') lista = [...lista].sort((a, b) => precioDesde(a) - precioDesde(b));
  else if (Filtro.orden === 'precio-desc') lista = [...lista].sort((a, b) => precioDesde(b) - precioDesde(a));
  else if (Filtro.orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = [...lista].sort((a, b) => a.orden - b.orden);
  return lista;
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const filtros = root.querySelector('.filtros');
  const resultados = root.querySelector('[data-resultados]');
  const buscador = root.querySelector('[data-buscador]');
  const orden = root.querySelector('[data-orden]');
  const vermas = root.querySelector('[data-vermas]');
  const inicio = root.querySelector('[data-catalogo-inicio]');
  const precio = root.querySelector('[data-precio]');
  const precioValor = root.querySelector('[data-precio-valor]');
  const verResultados = root.querySelector('[data-ver-resultados]');
  const activos = root.querySelector('[data-filtros-activos]');

  const opcion = (grupo, id, label, n, color) => `<label class="filtro-opcion"><input type="checkbox" data-f="${grupo}" value="${id}">${color ? `<i class="punto" style="--c:${color}"></i>` : ''} ${esc(label)}<em>${n}</em></label>`;
  root.querySelector('[data-grupo="cat"]').innerHTML = CATEGORIAS.map(c => opcion('cat', c.id, c.label, productosDeCat(c.id).length)).join('');
  root.querySelector('[data-grupo="chakra"]').innerHTML = CHAKRAS.map(c => opcion('chakra', c.id, c.nombre, productosDeChakra(c.id).length, c.color)).join('');

  const precios = PRODUCTOS.map(precioDesde);
  const pMin = Math.floor(Math.min(...precios) / 1000) * 1000;
  const pMax = Math.ceil(Math.max(...precios) / 1000) * 1000;
  precio.min = pMin; precio.max = pMax; precio.step = 1000; precio.value = pMax;
  const pintarPrecio = () => {
    precioValor.textContent = Number(precio.value) >= pMax ? 'Todos los precios' : `Hasta ${formatearPrecio(Number(precio.value))}`;
    precio.style.setProperty('--pct', `${((Number(precio.value) - pMin) / (pMax - pMin)) * 100}%`);
  };
  pintarPrecio();

  const sets = { cat: 'cats', chakra: 'chakras' };
  const leer = () => {
    Object.entries(sets).forEach(([g, k]) => { Filtro[k] = new Set([...root.querySelectorAll(`input[data-f="${g}"]:checked`)].map(i => i.value)); });
    Filtro.precioMax = Number(precio.value) < pMax ? Number(precio.value) : null;
  };
  const escribir = () => {
    Object.entries(sets).forEach(([g, k]) => { root.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = Filtro[k].has(i.value); }); });
    precio.value = Filtro.precioMax || pMax;
    pintarPrecio();
    if (buscador) buscador.value = Filtro.q;
    if (orden) orden.value = Filtro.orden;
  };

  const chipsActivos = () => {
    const chips = [];
    Filtro.cats.forEach(id => chips.push({ tipo: 'cat', id, txt: catDe(id).label }));
    Filtro.chakras.forEach(id => chips.push({ tipo: 'chakra', id, txt: `Chakra ${chakraDe(id)?.nombre.toLowerCase()}`, color: chakraDe(id)?.color }));
    if (Filtro.precioMax) chips.push({ tipo: 'precio', id: '', txt: `Hasta ${formatearPrecio(Filtro.precioMax)}` });
    if (Filtro.q.trim()) chips.push({ tipo: 'q', id: '', txt: `«${Filtro.q.trim()}»` });
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar="${c.tipo}|${esc(c.id)}" aria-label="Quitar el filtro ${esc(c.txt)}">${c.color ? `<i style="--c:${c.color}"></i>` : ''}${esc(c.txt)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`).join('');
  };

  const render = (reset = true) => {
    if (reset) visibles = PAGINA;
    const lista = filtrar();
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;
    if (verResultados) verResultados.textContent = `Ver ${cuantos(lista.length, 'producto', 'productos')}`;
    chipsActivos();
    if (!lista.length) {
      grid.innerHTML = '<div class="catalogo-vacio"><b>Por ahora no tenemos eso en la web</b><span>Probá con otra palabra o limpiá los filtros. Si lo buscás para una intención puntual, preguntanos por WhatsApp.</span><button type="button" class="btn btn-ghost" data-limpiar-todo>Ver toda la tienda</button></div>';
      vermas.hidden = true;
      refrescarTriggers();
      return;
    }
    grid.innerHTML = lista.slice(0, visibles).map(cardHTML).join('');
    const faltan = lista.length - Math.min(visibles, lista.length);
    vermas.hidden = faltan <= 0;
    vermas.textContent = `Ver ${cuantos(Math.min(faltan, PAGINA), 'producto más', 'productos más')}`;
    revelarNuevos(grid);
    refrescarTriggers();
  };

  const limpiar = () => {
    Filtro.cats.clear(); Filtro.chakras.clear(); Filtro.precioMax = null; Filtro.q = ''; Filtro.orden = 'destacados';
    escribir(); render(true);
  };

  root.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leer(); render(true); } });
  precio.addEventListener('input', () => { pintarPrecio(); leer(); render(true); });
  root.querySelector('.filtros-limpiar')?.addEventListener('click', limpiar);
  grid.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) limpiar(); });
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [tipo, id] = b.dataset.quitar.split('|');
    if (tipo === 'cat') Filtro.cats.delete(id);
    if (tipo === 'chakra') Filtro.chakras.delete(id);
    if (tipo === 'precio') Filtro.precioMax = null;
    if (tipo === 'q') Filtro.q = '';
    escribir(); render(true);
  });
  buscador?.addEventListener('input', () => { Filtro.q = buscador.value; render(true); });
  buscador?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = buscador.value; render(true); });
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false); });

  const toggle = root.querySelector('.filtros-toggle');
  const cerrar = root.querySelector('.filtros-cerrar');
  let fondo = null;
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); fondo?.remove(); fondo = null; document.body.classList.remove('no-scroll');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  const abrirFiltros = () => {
    filtros.classList.add('open'); document.body.classList.add('no-scroll'); toggle?.setAttribute('aria-expanded', 'true');
    fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; fondo.addEventListener('click', cerrarFiltros); document.body.appendChild(fondo);
    trapFocus(filtros); cerrar?.focus();
  };
  toggle?.addEventListener('click', abrirFiltros);
  cerrar?.addEventListener('click', () => { cerrarFiltros(); toggle?.focus(); });
  verResultados?.addEventListener('click', () => { cerrarFiltros(); scrollSuave(inicio); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) { cerrarFiltros(); toggle?.focus(); } });

  Catalogo.render = render;
  Catalogo.aplicar = ({ cats = [], chakras = [], q = '' } = {}) => {
    Filtro.cats = new Set(cats); Filtro.chakras = new Set(chakras); Filtro.precioMax = null; Filtro.q = q;
    escribir(); render(true); scrollSuave(inicio);
  };
  Catalogo.categoria = id => Catalogo.aplicar({ cats: [id] });
  Catalogo.buscarTexto = q => Catalogo.aplicar({ q });
  Catalogo.buscar = () => { scrollSuave(inicio); setTimeout(() => buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 500); };

  render(true);
}

function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const col = g.querySelector('[data-guia-columna]');
  const res = g.querySelector('[data-guia-resultado]');
  col.innerHTML = CHAKRAS.map(c => `<button type="button" class="guia-op" role="radio" aria-checked="false" tabindex="-1" data-chakra="${c.id}" style="--c:${c.color}" aria-label="${esc(c.nombre)}: ${esc(c.tema)}"><span class="cuenta" aria-hidden="true"></span><span class="guia-op-txt" aria-hidden="true"><span class="guia-op-nombre">${esc(c.nombre)}</span><span class="guia-op-tema">${esc(c.tema)}</span></span></button>`).join('');
  const botones = [...col.querySelectorAll('.guia-op')];
  let actual = null;

  const pintar = (id, foco = false) => {
    const c = chakraDe(id);
    if (!c) return;
    actual = c;
    botones.forEach(b => {
      const on = b.dataset.chakra === id;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
    });
    const prods = c.recomendados.map(([pid, v]) => { const p = getProducto(pid); return { p, v: v || varDefault(p) }; }).filter(x => x.p && x.p.stock > 0 && varianteValida(x.p, x.v)).slice(0, 3);
    const total = productosDeChakra(c.id).length;
    const msg = `Hola! Me interesa una armonización de chakras. Me gustaría trabajar el chakra ${c.nombre.toLowerCase()} (${c.sanscrito}).`;
    res.style.setProperty('--c', c.color);
    res.innerHTML = `<div class="guia-res">
      <div class="guia-res-top">
        <span class="guia-res-cuenta" aria-hidden="true"></span>
        <div>
          <p class="guia-res-num">Chakra ${c.n} de 7 · ${esc(c.sanscrito)}</p>
          <p class="guia-res-nombre">${esc(c.nombre)}</p>
        </div>
      </div>
      <p class="guia-res-frase">${esc(c.frase)}</p>
      <dl class="guia-res-datos">
        <div><dt>Piedras</dt><dd>${esc(c.piedras)}</dd></div>
        <div><dt>Aroma</dt><dd>${esc(c.aroma)}</dd></div>
        <div><dt>Vela</dt><dd><i style="--v:${COLORES[c.vela]}"></i>${esc(c.vela)}</dd></div>
      </dl>
      <ul class="guia-res-prods">${prods.map(({ p, v }) => `<li class="guia-prod">
        <span class="guia-prod-media recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="200" height="200"></span>
        <span class="guia-prod-nombre">${esc(nombreConVariante(p, v))}</span>
        <div class="guia-prod-fila"><p class="precio">${precioHTML(p, v)}</p><button type="button" class="btn-icono" data-add="${p.id}" data-v="${esc(v)}" aria-label="Agregar ${esc(nombreConVariante(p, v))} al carrito">${ICONO_CARRITO_MAS}</button></div>
      </li>`).join('')}</ul>
      <div class="guia-res-acciones">
        <button type="button" class="btn btn-cta" data-guia-ver>Ver los ${total} del chakra ${esc(c.nombre.toLowerCase())}</button>
        <a class="link" href="${wspHref(msg)}" target="_blank" rel="noopener">Reservar una armonización</a>
      </div>
      <p class="guia-nota">Son correspondencias de la tradición: acompañan, no reemplazan una consulta de salud.</p>
    </div>`;
  };

  col.addEventListener('click', e => {
    const b = e.target.closest('.guia-op');
    if (b) pintar(b.dataset.chakra);
  });
  col.addEventListener('keydown', e => {
    const i = CHAKRAS.indexOf(actual);
    let j = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') j = Math.min(CHAKRAS.length - 1, i + 1);
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') j = Math.max(0, i - 1);
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = CHAKRAS.length - 1;
    if (j === null) return;
    e.preventDefault();
    pintar(CHAKRAS[j].id, true);
  });
  res.addEventListener('click', e => {
    if (e.target.closest('[data-guia-ver]') && actual && Catalogo.aplicar) Catalogo.aplicar({ chakras: [actual.id] });
  });
  pintar('corazon');
}

function initBanner() {
  const b = document.querySelector('[data-banner]');
  if (!b) return;
  const msgs = [...b.querySelectorAll('[data-msg]')];
  const cuentas = [...b.querySelectorAll('[data-banner-cuentas] i')];
  if (msgs.length < 2) return;
  let i = 0;
  let pausado = false;
  const ir = k => {
    i = (k + msgs.length) % msgs.length;
    msgs.forEach((m, j) => {
      const on = j === i;
      m.classList.toggle('is-active', on);
      m.toggleAttribute('inert', !on);
      if (on) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true');
    });
    cuentas.forEach((c, j) => c.classList.toggle('on', j === i));
  };
  b.querySelector('[data-banner-prev]')?.addEventListener('click', () => ir(i - 1));
  b.querySelector('[data-banner-next]')?.addEventListener('click', () => ir(i + 1));
  const tag = b.querySelector('.banner-tag');
  tag?.addEventListener('mouseenter', () => { pausado = true; });
  tag?.addEventListener('mouseleave', () => { pausado = false; });
  tag?.addEventListener('focusin', () => { pausado = true; });
  tag?.addEventListener('focusout', () => { pausado = false; });
  if (!reduceMotion) window.setInterval(() => { if (!pausado && !document.hidden && b.getBoundingClientRect().bottom > 0) ir(i + 1); }, 6000);
}

function initHeroBusqueda() {
  const f = document.querySelector('[data-hero-busqueda]');
  if (!f) return;
  const input = f.querySelector('input');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    Catalogo.buscarTexto?.(q);
  });
}

function initTirada() {
  const sec = document.querySelector('[data-tirada]');
  if (!sec) return;
  const track = sec.querySelector('.tirada');
  const cartas = [...sec.querySelectorAll('[data-carta]')];
  const copias = [...sec.querySelectorAll('[data-copy]')];
  const wsp = sec.querySelector('[data-tirada-wsp]');
  const ver = sec.querySelector('[data-tirada-ver]');
  const cuentas = [...sec.querySelectorAll('[data-tirada-cuentas] i')];
  const ayuda = sec.querySelector('[data-tirada-ayuda]');
  const textos = sec.querySelector('.tirada-textos');
  const medirTextos = () => {
    if (!textos || sec.classList.contains('is-static')) return;
    textos.style.minHeight = '';
    textos.style.minHeight = `${Math.ceil(Math.max(...copias.map(c => c.scrollHeight)))}px`;
  };
  medirTextos();
  window.addEventListener('resize', medirTextos, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(medirTextos);
  let activo = -1;
  const activar = i => {
    if (i === activo) return;
    activo = i;
    copias.forEach((c, j) => { c.classList.toggle('is-on', j === i); c.toggleAttribute('inert', j !== i); });
    cuentas.forEach((b, j) => b.classList.toggle('on', j === i));
    const s = SERVICIOS[i];
    if (wsp) { wsp.href = wspHref(s.msg); wsp.textContent = s.cta; }
    if (ver) { ver.dataset.catLink = s.cat; ver.textContent = s.ver(productosDeCat(s.cat).length); }
    if (ayuda) ayuda.textContent = i < cartas.length - 1 ? 'Seguí bajando para dar vuelta la carta' : 'Tirada completa: elegí tu sesión';
  };
  if (reduceMotion) {
    sec.classList.add('is-static');
    cartas.forEach(c => c.classList.remove('is-dorso'));
    copias.forEach(c => { c.classList.add('is-on'); c.removeAttribute('inert'); });
    return;
  }
  const SALIDAS = [0.18, 0.56];
  const DUR = 0.22;
  const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const pintar = p => {
    const x = SALIDAS.map(e => suave(clamp01((p - e) / DUR)));
    const ancho = cartas[0].offsetWidth || 300;
    cartas.forEach((c, k) => {
      const sale = k < x.length ? x[k] : 0;
      let prof = 0;
      for (let j = 0; j < k; j++) prof += 1 - (x[j] ?? 0);
      const giro = k === 0 ? 0 : (k % 2 ? 4.2 : -3.6) * prof;
      c.style.setProperty('--x', `${(prof * 16 - sale * ancho * 1.35).toFixed(1)}px`);
      c.style.setProperty('--y', `${(prof * 12 - sale * 46).toFixed(1)}px`);
      c.style.setProperty('--r', `${(giro - sale * 20).toFixed(2)}deg`);
      c.style.setProperty('--s', (1 - prof * 0.045).toFixed(3));
      c.style.setProperty('--o', (1 - clamp01((sale - 0.55) / 0.45)).toFixed(3));
      c.style.visibility = sale > 0.995 ? 'hidden' : '';
      c.classList.toggle('is-dorso', prof >= 1.5);
    });
    activar(x.filter(v => v >= 0.5).length);
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = track.getBoundingClientRect();
    const total = r.height - (window.innerHeight - OFF);
    pintar(total > 0 ? clamp01((OFF - r.top) / total) : 0);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', update);
  update();
}

function openQuickview(id, vInicial) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  let v = vInicial && varianteValida(p, vInicial) ? vInicial : varDefault(p);
  let cant = 1;
  const vistas = [[p.img, p.foco], ...(p.galeria || [])];
  const media = modal.querySelector('[data-qv-media]');
  const thumbs = modal.querySelector('[data-qv-thumbs]');
  const verVista = k => {
    const [img, foco] = vistas[k];
    media.setAttribute('style', recorte(img, foco, 1));
    media.innerHTML = `<img src="images/${img}" alt="${esc(p.alt)}" width="700" height="700">`;
    thumbs.querySelectorAll('[data-qv-vista]').forEach((t, j) => t.setAttribute('aria-current', String(j === k)));
  };
  thumbs.innerHTML = vistas.length > 1 ? vistas.map(([img, foco], k) => `<button type="button" class="qv-thumb recorte" data-qv-vista="${k}" style="${recorte(img, foco, 1)}" aria-label="Ver la foto ${k + 1} de ${vistas.length}"><img src="images/${img}" alt="" width="128" height="128"></button>`).join('') : '';
  thumbs.onclick = e => { const b = e.target.closest('[data-qv-vista]'); if (b) verVista(Number(b.dataset.qvVista)); };
  verVista(0);

  modal.querySelector('[data-qv-cat]').textContent = catDe(p.cat).largo;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-desc]').textContent = p.desc;
  const chakrasEl = modal.querySelector('[data-qv-chakras]');
  const ids = chakrasDe(p);
  chakrasEl.hidden = !ids.length || opcionesDe(p).some(o => o.chakra);
  chakrasEl.innerHTML = ids.map(id => { const c = chakraDe(id); return `<span><i style="--c:${c.color}"></i>Chakra ${esc(c.nombre.toLowerCase())}</span>`; }).join('');
  const varTitulo = modal.querySelector('[data-qv-var-titulo]');
  const varEl = modal.querySelector('[data-qv-variantes]');
  const precioEl = modal.querySelector('[data-qv-precio]');
  const cantEl = modal.querySelector('[data-qv-cant]');
  const pintarCompra = () => {
    varEl.querySelectorAll('[data-qv-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvV === v)));
    const op = opcionDe(p, v);
    varTitulo.textContent = op ? `${p.variantes.titulo}: ${v}${op.chakra ? ` · chakra ${chakraDe(op.chakra).nombre.toLowerCase()}` : ''}` : '';
    precioEl.innerHTML = precioHTML(p, v);
    cantEl.textContent = cant;
    modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por ${nombreConVariante(p, v)}.`);
  };
  const ops = opcionesDe(p);
  varTitulo.hidden = !ops.length;
  varEl.hidden = !ops.length;
  varEl.innerHTML = ops.map(o => `<button type="button" class="qv-var" data-qv-v="${esc(o.v)}" aria-pressed="false">${p.variantes.tipo === 'color' ? `<i style="--v:${COLORES[o.v]}"></i>` : ''}${esc(o.v)}${o.precio ? ` <small>${formatearPrecio(conDescuento(p, o.precio))}</small>` : ''}</button>`).join('');
  varEl.onclick = e => { const b = e.target.closest('[data-qv-v]'); if (b) { v = b.dataset.qvV; pintarCompra(); } };
  modal.querySelectorAll('[data-qv-step]').forEach(b => { b.onclick = () => { cant = Math.max(1, Math.min(p.stock, cant + Number(b.dataset.qvStep))); pintarCompra(); }; });
  modal.querySelector('[data-qv-add]').onclick = () => { agregar(p, cant, v); closeQuickview(); };
  modal.querySelector('[data-qv-comprar]').onclick = () => { Cart.add(p, cant, v); closeQuickview(); openCartDrawer(); };
  pintarCompra();

  const mismos = chakrasDe(p);
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat)
    .concat(PRODUCTOS.filter(x => x.id !== p.id && x.cat !== p.cat && chakrasDe(x).some(c => mismos.includes(c))))
    .filter((x, k, arr) => arr.indexOf(x) === k).slice(0, 3);
  modal.querySelector('[data-qv-rel]').innerHTML = rel.map(x => `<button type="button" class="qv-rel" data-open-quickview="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="200" height="200"></span><span>${esc(x.nombre)}</span><span class="meta">${formatearPrecio(precioDesde(x))}</span></button>`).join('');
  modal.querySelector('.qv-relacionados').hidden = !rel.length;

  if (modal.hidden) {
    modal.hidden = false;
    trapFocus(modal);
    document.body.classList.add('no-scroll');
    modal.querySelector('.quickview-cerrar')?.focus();
  } else {
    modal.querySelector('.quickview-panel').scrollTop = 0;
  }
}

function closeQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function renderCart() {
  const itemsEl = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (!itemsEl) return;
  const items = Cart.get();
  if (!items.length) {
    itemsEl.innerHTML = '<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío.<br>Empezá por un sahumo o una piedra.</p><a class="btn btn-ghost" href="#tienda" data-cart-cerrar-link>Ver la tienda</a></div>';
    footer.hidden = true;
    return;
  }
  footer.hidden = false;
  itemsEl.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const linea = `${p.id}|${esc(i.v)}`;
    return `<div class="cart-item">
      <div class="recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="152" height="152"></div>
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="meta">${i.v ? metaHTML(p, i.v) : esc(catDe(p.cat).label)}</span>
        <div class="cart-item-fila">
          <div class="stepper" data-cart-linea="${linea}"><button type="button" data-cart-step="-1" aria-label="Restar una unidad de ${esc(nombreConVariante(p, i.v))}">−</button><span>${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar una unidad de ${esc(nombreConVariante(p, i.v))}">+</button></div>
          <span class="cart-item-precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</span>
        </div>
        <button type="button" class="cart-quitar" data-cart-quitar="${linea}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${nombreConVariante(p, i.v)}`; });
    wsp.href = wspHref(`Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
  renderCart();
  drawer.classList.add('open');
  document.querySelector('.cart-backdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  trapFocus(drawer);
  drawer.querySelector('.cart-cerrar')?.focus();
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-cerrar')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  document.querySelector('[data-cart-items]')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const [id, v] = step.closest('[data-cart-linea]').dataset.cartLinea.split('|');
      const it = Cart.get().find(i => i.id === Number(id) && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.cartStep));
      return;
    }
    const quitar = e.target.closest('[data-cart-quitar]');
    if (quitar) { const [id, v] = quitar.dataset.cartQuitar.split('|'); Cart.remove(id, v); return; }
    if (e.target.closest('[data-cart-cerrar-link]')) closeCartDrawer();
  });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
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

function initAtajos() {
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat-link]');
    if (cat && Catalogo.categoria) { e.preventDefault(); Catalogo.categoria(cat.dataset.catLink); return; }
    const bus = e.target.closest('[data-foco-buscador]');
    if (bus && Catalogo.buscar) { e.preventDefault(); Catalogo.buscar(); return; }
    const q = e.target.closest('[data-buscar]');
    if (q && Catalogo.buscarTexto) { e.preventDefault(); Catalogo.buscarTexto(q.dataset.buscar); return; }
    const add = e.target.closest('[data-add]');
    if (add) { const p = getProducto(add.dataset.add); agregar(p, 1, add.dataset.v ?? varDefault(p)); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(Number(ver.dataset.openQuickview), ver.dataset.v);
  });
}

function initNewsletter() {
  const f = document.querySelector('[data-newsletter]');
  if (!f) return;
  const input = f.querySelector('input');
  const err = document.querySelector('[data-newsletter-error]');
  const btn = f.querySelector('button');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', String(!ok));
    err.textContent = ok ? '' : 'Revisá el email: le falta algo.';
    if (!ok) { input.focus(); return; }
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Suscribirme';
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      f.reset();
    }, 800);
  });
}

function initConsulta() {
  const f = document.querySelector('[data-consulta]');
  if (!f) return;
  const campos = {
    tema: f.querySelector('[name="tema"]'),
    nombre: f.querySelector('[name="nombre"]'),
    consulta: f.querySelector('[name="consulta"]'),
  };
  const marcar = (campo, msg) => {
    const box = campo.closest('.campo');
    box.classList.toggle('error', !!msg);
    campo.setAttribute('aria-invalid', String(!!msg));
    const out = box.querySelector('.campo-error');
    if (out) out.textContent = msg || '';
  };
  Object.values(campos).forEach(c => c?.addEventListener('input', () => marcar(c, '')));
  campos.tema?.addEventListener('change', () => marcar(campos.tema, ''));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const eTema = campos.tema.value ? '' : 'Elegí sobre qué es tu consulta.';
    const eNombre = campos.nombre.value.trim().length >= 2 ? '' : 'Contanos tu nombre.';
    marcar(campos.tema, eTema);
    marcar(campos.nombre, eNombre);
    if (eTema || eNombre) { (eTema ? campos.tema : campos.nombre).focus(); return; }
    const extra = campos.consulta.value.trim();
    const msg = `Hola! Soy ${campos.nombre.value.trim()}. Quiero consultar por: ${campos.tema.value.toLowerCase()}.${extra ? ` ${extra}` : ''}`;
    window.open(wspHref(msg), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con tu consulta lista.');
    f.reset();
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarTriggers));
}

function initSchema() {
  const base = new URL('./', window.location.href).href;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tienda Sadhana Terra',
    itemListElement: PRODUCTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        description: p.desc,
        image: base + 'images/' + p.img,
        category: catDe(p.cat).largo,
        offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
      },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initDeepLink() {
  const slug = new URLSearchParams(window.location.search).get('producto');
  const p = slug && PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuickview(p.id);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const titulo = document.querySelector('.banner-titulo');
  if (titulo) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const foto = document.querySelector('.banner-media img');
    tl.from(titulo.querySelectorAll('.etiqueta, .hero-h1, .banner-lado > *'), { y: 28, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' })
      .from(foto, { scale: 1.08, duration: 1.4, clearProps: 'transform' }, 0.1)
      .from(document.querySelector('.banner-tag'), { y: 36, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.45)
      .from(document.querySelector('.banner-foto .sello'), { scale: 0.92, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.6);
  }
  const compacto = document.querySelector('.compacto-grid');
  if (compacto) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(compacto.querySelectorAll('.etiqueta, .hero-h1, .bajada, .banner-ctas'), { y: 28, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' })
      .from(compacto.querySelector('.consulta-rapida'), { y: 40, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.25)
      .from(document.querySelector('.hero-compacto .sello'), { scale: 0.92, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.55);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCuentas();
  initRail();
  initCatalogo();
  initGuia();
  initBanner();
  initHeroBusqueda();
  initTirada();
  initQuickview();
  initCartUI();
  initFloats();
  initAtajos();
  initNewsletter();
  initConsulta();
  initFaq();
  initSchema();
  updateCartBadge();
  initReveals();
  initHeroMotion();
  initDeepLink();
});
