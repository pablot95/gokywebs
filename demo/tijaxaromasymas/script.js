document.documentElement.classList.add('js');

const WSP = '5493492278287';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const clamp01 = v => Math.min(1, Math.max(0, v));
const suave = t => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const mezcla = (a, b, t) => a + (b - a) * t;
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const fmtNum = (n, d = 1) => n.toLocaleString('es-AR', { maximumFractionDigits: d });
const cuantos = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;

const FOTOS = {
  1: ['tijax_1.webp', 941, 1672],
  2: ['tijax_2.webp', 1672, 941],
  3: ['tijax_3.webp', 1254, 1254],
  4: ['tijax_4.webp', 1254, 1254],
  5: ['tijax_5.webp', 1254, 1254],
  6: ['tijax_6.webp', 1254, 1254]
};

const CATEGORIAS = [
  { id: 'bases', nombre: 'Bases y aglutinantes', corto: 'Bases', linea: 'insumos', img: 6, foco: [0.3, 0.48, 1.7] },
  { id: 'varillas', nombre: 'Varillas', corto: 'Varillas', linea: 'insumos', img: 6, foco: [0.86, 0.84, 1.8] },
  { id: 'esencias', nombre: 'Esencias puras', corto: 'Esencias', linea: 'insumos', img: 4, foco: [0.5, 0.52, 1.45] },
  { id: 'aceites', nombre: 'Aceites, resinas y flores', corto: 'Aceites y resinas', linea: 'insumos', img: 6, foco: [0.17, 0.33, 1.8] },
  { id: 'color', nombre: 'Color y solventes', corto: 'Color y solventes', linea: 'insumos', img: 6, foco: [0.44, 0.18, 2.1] },
  { id: 'kits', nombre: 'Kits para hacer', corto: 'Kits', linea: 'insumos', img: 6, foco: [0.5, 0.5, 1.05] },
  { id: 'sahumerios', nombre: 'Sahumerios artesanales', corto: 'Sahumerios', linea: 'listos', img: 3, foco: [0.45, 0.42, 1.35] },
  { id: 'casa', nombre: 'Para tu casa y el auto', corto: 'Casa y auto', linea: 'listos', img: 5, foco: [0.5, 0.55, 1.4] }
];

const LINEAS = { insumos: 'Insumos para hacer', listos: 'Listos para usar' };

const PRECIOS = [
  ['0-5000', 'Hasta $5.000'],
  ['5000-15000', '$5.000 a $15.000'],
  ['15000-40000', '$15.000 a $40.000'],
  ['40000-99999999', 'Más de $40.000']
];

const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const nombreCat = id => getCategoria(id)?.nombre || '';
const lineaDe = p => getCategoria(p.cat)?.linea || 'insumos';
const dims = k => FOTOS[k] ? [FOTOS[k][1], FOTOS[k][2]] : [1, 1];

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

function imgTag(k, alt = '') {
  const [w, h] = dims(k);
  return `<img src="images/${FOTOS[k]?.[0] || ''}" width="${w}" height="${h}" alt="${esc(alt)}">`;
}

const Servidor = (() => {
  const API_MAX = 100;
  const g = (k, q, precio, extra = {}) => ({ k, q, u: 'g', precio, ...extra });
  const cc = (k, q, precio, extra = {}) => ({ k, q, u: 'cc', precio, ...extra });
  const un = (k, q, ul, precio, extra = {}) => ({ k, q, u: 'u', ul, precio, ...extra });
  const unico = (k, precio) => ({ k, q: 1, u: null, precio });
  const esencia = (id, aroma, img, foco, rank, desc, tags, extra = {}) => ({
    id, nombre: `Esencia pura de ${aroma}`, cat: 'esencias', pres: [cc('50 cc', 50, 5900), cc('250 cc', 250, 19500, { mayor: true })],
    stock: 24, img, foco, rank, desc, tags: `esencia aroma perfume ${tags}`, ...extra
  });
  const sahumerio = (id, nombre, img, foco, rank, desc, tags, extra = {}) => ({
    id, nombre, cat: 'sahumerios', pres: [un('Paquete x 8', 1, 'paquete', 1800, { c: 'paquete' }), un('Caja x 12 paquetes', 12, 'paquete', 17500, { mayor: true, c: 'caja x 12' })],
    stock: 40, img, foco, rank, desc, tags: `sahumerio sahumerios incienso varilla paquete caja por mayor reventa ${tags}`, ...extra
  });

  const BD = [
    { id: 'kit-inicial', nombre: 'Kit inicial para hacer sahumerios', cat: 'kits', pres: [unico('Kit', 36900)], stock: 15, img: 6, foco: [0.52, 0.5, 1.08], rank: 1,
      desc: 'Todo lo de la primera tanda en una sola compra. Los aromas de las esencias y los colores se eligen al confirmar el pedido.',
      contenido: [['Harina de pino malla 120', '1 kg'], ['Varillas de pino', '200 g'], ['Goma xántica', '100 g'], ['Nitrato de potasio', '20 g'], ['Esencias puras', '2 × 50 cc'], ['Colorantes', '3 × 20 cc'], ['Alcohol de cereal 96°', '1 L']],
      tags: 'kit combo inicial principiante empezar primera tanda' },
    esencia('esencia-lavanda', 'lavanda', 4, [0.28, 0.62, 1.9], 2, 'Floral y fresca, de las más pedidas para sahumerios, difusores y brumas.', 'lavanda floral relajante'),
    sahumerio('sahumerio-lavanda', 'Sahumerios artesanales de lavanda', 3, [0.6, 0.55, 2.1], 3, 'Hechos a mano con harina de madera y esencia pura de lavanda. Por paquete para tu casa o por caja para revender.', 'lavanda'),
    { id: 'harina-pino-120', nombre: 'Harina de madera de pino malla 120', cat: 'bases', pres: [g('1 kg', 1000, 5500), g('5 kg', 5000, 24900, { mayor: true })], stock: 60, img: 6, foco: [0.32, 0.49, 2.2], rank: 4,
      desc: 'La base de todo sahumerio de varilla y de los conos. Tamizada en malla 120: fina y pareja para que la pasta se pegue sin grumos.',
      tags: 'harina aserrin madera pino base malla 120 polvo' },
    { id: 'aromatizador-auto-limon', nombre: 'Difusor colgante para auto · limón', cat: 'casa', pres: [unico('Unidad', 4500)], stock: 30, img: 5, foco: [0.8, 0.6, 2.8], rank: 5,
      desc: 'El difusor de Tijax para colgar en el espejo del auto, con aroma a limón.',
      tags: 'aromatizador auto colgante difusor limon citrico tijax' },
    { id: 'goma-xantica', nombre: 'Goma xántica', cat: 'bases', pres: [g('100 g', 100, 6200), g('250 g', 250, 14500)], stock: 30, img: 6, foco: [0.28, 0.47, 3], rank: 6,
      desc: 'El aglutinante que une la harina y la pega a la varilla. Rinde mucho: con 100 g alcanza para un kilo de harina.',
      tags: 'goma xantica aglutinante pegamento ligante' },
    { id: 'varillas-pino-20', nombre: 'Varillas de pino para sahumerios · 20 cm', cat: 'varillas', pres: [g('200 g', 200, 3200), g('1 kg', 1000, 12900, { mayor: true })], stock: 40, img: 6, foco: [0.86, 0.84, 2.1], rank: 7,
      desc: 'Varillas rectas y secas, listas para bañar en la pasta. Con 200 g alcanza para un kilo de harina.',
      tags: 'varillas palitos pino 20 cm' },
    { id: 'kit-profesional', nombre: 'Kit profesional para producir sahumerios', cat: 'kits', pres: [unico('Kit', 164000)], antes: 170000, stock: 6, img: 2, foco: [0.5, 0.55, 1.05], rank: 8,
      desc: 'Para producir en cantidad: bases, aditivos, esencias y colorantes en tamaño grande, con guantes, goteros y un regalo.',
      contenido: [['Harina de pino malla 120', '5 kg'], ['Carbonilla micronizada malla 120', '1 kg'], ['Goma xántica', '250 g'], ['Nitrato de potasio', '250 g'], ['Varillas de pino', '1 kg'], ['Esencias puras', '2 × 250 cc'], ['Colorantes líquidos', '3 × 100 cc'], ['DPG', '250 cc'], ['Glicerina vegetal', '250 cc'], ['Caolín', '250 g'], ['Regulador de quemado', '250 g'], ['Harina de mandioca', '500 g'], ['Resinoides', '100 cc'], ['Guantes y goteros pipeta', '3'], ['De regalo: harina de arroz', '500 g']],
      tags: 'kit combo profesional emprender produccion grande mayor' },
    { id: 'nitrato-potasio', nombre: 'Nitrato de potasio', cat: 'bases', pres: [g('250 g', 250, 6500), g('1 kg', 1000, 21500, { mayor: true })], stock: 30, img: 6, foco: [0.37, 0.43, 3.8], rank: 9,
      desc: 'Hace que el sahumerio se consuma parejo de punta a punta, sin apagarse a mitad. Se usa poco: unos 20 g por kilo de harina.',
      tags: 'nitrato potasio salitre combustion quemado' },
    esencia('esencia-palo-santo', 'palo santo', 4, [0.63, 0.45, 2.3], 10, 'Amaderada con un fondo cítrico, ideal para limpiar ambientes.', 'palo santo amaderado limpieza'),
    { id: 'sahumerios-en-blanco', nombre: 'Sahumerios en blanco para perfumar', cat: 'varillas', pres: [un('x 100', 100, 'varilla', 6900), un('x 500', 500, 'varilla', 29900, { mayor: true })], stock: 25, img: 1, foco: [0.52, 0.77, 2.2], rank: 11, nuevo: true,
      desc: 'Ya bañados y secos, sin aroma: solo falta perfumarlos con la esencia que elijas. Ideales para ferias y para armar tu propia línea.',
      tags: 'sahumerios blanco sin aroma para perfumar varilla' },
    { id: 'conos-ruda', nombre: 'Conos artesanales de ruda', cat: 'sahumerios', pres: [un('Caja x 10 conos', 1, 'caja', 2200, { c: 'caja x 10' }), un('Bulto x 12 cajas', 12, 'caja', 21900, { mayor: true, c: 'bulto x 12' })], stock: 30, img: 3, foco: [0.17, 0.66, 2.3], rank: 12,
      desc: 'Conos de harina de madera con esencia de ruda, la clásica para la protección de la casa.',
      tags: 'conos ruda incienso proteccion caja bulto por mayor' },
    { id: 'difusor-varillas', nombre: 'Difusor de varillas', cat: 'casa', pres: [unico('125 ml', 9900), unico('250 ml', 15900)], stock: 18, img: 5, foco: [0.44, 0.55, 1.9], rank: 13,
      desc: 'Frasco de vidrio con varillas de ratán: el aroma se reparte solo, sin fuego ni electricidad. El aroma se elige al confirmar.',
      tags: 'difusor varillas ratan ambiente casa' },
    esencia('esencia-sandalo', 'sándalo', 1, [0.6, 0.63, 2.4], 14, 'Amaderada, cálida y profunda. Combina muy bien con vainilla.', 'sandalo amaderado'),
    { id: 'colorante-liquido', nombre: 'Colorante líquido para sahumerios', cat: 'color', pres: [cc('20 cc', 20, 2100), cc('100 cc', 100, 6500)], stock: 40, img: 6, foco: [0.37, 0.16, 2.8], rank: 15,
      desc: 'Se suma al perfumado para teñir los sahumerios. Consultá los colores disponibles al confirmar el pedido.',
      tags: 'colorante color tinte liquido' },
    { id: 'alcohol-cereal', nombre: 'Alcohol de cereal 96°', cat: 'color', pres: [cc('1 L', 1000, 8900), cc('5 L', 5000, 39900, { mayor: true })], stock: 30, img: 4, foco: [0.49, 0.58, 2.6], rank: 16,
      desc: 'Para diluir esencias y colorantes al perfumar sahumerios, y para hacer brumas y aromatizadores.',
      tags: 'alcohol cereal 96 solvente diluir' },
    { id: 'bruma-textil', nombre: 'Bruma textil', cat: 'casa', pres: [unico('250 ml', 7900), unico('500 ml', 12900)], stock: 22, img: 5, foco: [0.64, 0.52, 2], rank: 17,
      desc: 'Perfume para sábanas, almohadas, cortinas y ropa. Se rocía a unos 30 cm y seca en minutos.',
      tags: 'bruma textil sabanas ropa perfume spray' },
    { id: 'carbonilla-120', nombre: 'Carbonilla micronizada malla 120', cat: 'bases', pres: [g('1 kg', 1000, 9500)], stock: 20, img: 6, foco: [0.6, 0.46, 1.9], rank: 18,
      desc: 'Carbón vegetal molido muy fino. Mezclado con la harina de pino da sahumerios oscuros y una combustión más pareja.',
      tags: 'carbon carbonilla negro oscuro micronizada' },
    sahumerio('sahumerio-palo-santo', 'Sahumerios artesanales de palo santo', 3, [0.84, 0.78, 2], 19, 'Hechos a mano con esencia de palo santo. Por paquete o por caja para revender.', 'palo santo'),
    esencia('esencia-vainilla', 'vainilla', 1, [0.86, 0.58, 2.6], 20, 'Dulce y envolvente, para sahumerios de casa y aromatizadores.', 'vainilla dulce'),
    { id: 'atado-salvia-lavanda', nombre: 'Atado de salvia y lavanda', cat: 'sahumerios', pres: [un('Unidad', 1, 'atado', 4900, { c: 'unidad' }), un('Pack x 6', 6, 'atado', 26500, { mayor: true, c: 'pack x 6' })], stock: 20, img: 3, foco: [0.37, 0.22, 2.3], rank: 21,
      desc: 'Hierbas secas atadas a mano para sahumar la casa: se enciende la punta, se apaga la llama y se deja humear.',
      tags: 'atado salvia lavanda hierbas sahumo limpieza' },
    esencia('esencia-ruda', 'ruda', 6, [0.5, 0.22, 2.6], 22, 'Herbal e intensa, la clásica para la protección del hogar.', 'ruda herbal proteccion'),
    { id: 'kit-perfumado', nombre: 'Kit para perfumar sahumerios', cat: 'kits', pres: [unico('Kit', 19900)], stock: 12, img: 4, foco: [0.5, 0.55, 1.1], rank: 23,
      desc: 'Para quien compra sahumerios en blanco y los perfuma a gusto. Los aromas se eligen al confirmar.',
      contenido: [['Esencias puras a elección', '2 × 50 cc'], ['DPG', '250 cc'], ['Colorante líquido', '20 cc'], ['Goteros pipeta', '3']],
      tags: 'kit perfumar perfumado esencias blanco' },
    { id: 'dpg', nombre: 'DPG (dipropilenglicol)', cat: 'color', pres: [cc('250 cc', 250, 7500), cc('1 L', 1000, 24000, { mayor: true })], stock: 20, img: 2, foco: [0.4, 0.42, 2.5], rank: 24,
      desc: 'Solvente sin olor que fija la esencia en el sahumerio y en los difusores de varillas.',
      tags: 'dpg dipropilenglicol fijador solvente difusor' },
    esencia('esencia-limon', 'limón', 4, [0.76, 0.38, 2.1], 25, 'Cítrica y limpia, para cocinas, baños y el auto.', 'limon citrico'),
    { id: 'resinoide-benjui', nombre: 'Resinoide de benjuí', cat: 'aceites', pres: [cc('100 cc', 100, 12000)], stock: 14, img: 6, foco: [0.21, 0.2, 2.5], rank: 26,
      desc: 'Fija el aroma y le da cuerpo: unas gotas en la esencia y el sahumerio perfuma por más tiempo.',
      tags: 'resinoide benjui fijador resina' },
    sahumerio('sahumerio-sandalo', 'Sahumerios artesanales de sándalo', 2, [0.18, 0.42, 3], 27, 'Hechos a mano con esencia de sándalo. Por paquete o por caja para revender.', 'sandalo'),
    { id: 'copal-lagrimas', nombre: 'Copal en lágrimas', cat: 'aceites', pres: [g('50 g', 50, 4500), g('250 g', 250, 18900, { mayor: true })], stock: 16, img: 2, foco: [0.55, 0.77, 2.8], rank: 28,
      desc: 'Resina natural para quemar sobre carbón o moler y sumar a la masa. Humo blanco y limpio.',
      tags: 'copal resina lagrimas carbon' },
    { id: 'aceite-naranja', nombre: 'Aceite esencial de naranja dulce', cat: 'aceites', pres: [cc('10 cc', 10, 4800), cc('30 cc', 30, 11900)], stock: 18, img: 4, foco: [0.17, 0.47, 1.9], rank: 29,
      desc: 'Aceite esencial puro, cítrico y luminoso, para hornitos, difusores eléctricos y perfumados.',
      tags: 'aceite esencial naranja citrico hornito aromaterapia' },
    { id: 'varillas-bambu-30', nombre: 'Varillas de bambú · 30 cm', cat: 'varillas', pres: [g('200 g', 200, 3600), g('1 kg', 1000, 14900, { mayor: true })], stock: 24, img: 2, foco: [0.19, 0.5, 2.8], rank: 30,
      desc: 'Más largas, para sahumerios de mayor duración. Llevan más pasta por varilla.',
      tags: 'varillas palitos bambu 30 cm' },
    { id: 'conos-colores', nombre: 'Conos de colores surtidos', cat: 'sahumerios', pres: [un('Caja x 10 conos', 1, 'caja', 2400)], stock: 26, img: 2, foco: [0.9, 0.72, 2.6], rank: 31, nuevo: true,
      desc: 'Conos teñidos con colorante, en aromas surtidos. Un regalo fácil para la feria.',
      tags: 'conos colores surtidos incienso' },
    { id: 'glicerina-vegetal', nombre: 'Glicerina vegetal', cat: 'color', pres: [cc('250 cc', 250, 4500)], stock: 20, img: 6, foco: [0.59, 0.16, 2.6], rank: 32,
      desc: 'Le da cuerpo al perfumado y ayuda a que el aroma dure más en la varilla.',
      tags: 'glicerina vegetal fijador' },
    { id: 'aromatizador-ambiente', nombre: 'Aromatizador de ambiente en spray', cat: 'casa', pres: [unico('250 ml', 7500)], stock: 20, img: 2, foco: [0.73, 0.43, 2.4], rank: 33,
      desc: 'Spray para el living, la cocina o el baño. El aroma se elige al confirmar.',
      tags: 'aromatizador ambiente spray casa' },
    { id: 'difusor-tapa-madera', nombre: 'Difusor con tapa de madera', cat: 'casa', pres: [unico('200 ml', 13900)], stock: 10, img: 1, foco: [0.4, 0.43, 2], rank: 34,
      desc: 'Frasco de vidrio grueso con tapa de madera y varillas naturales.',
      tags: 'difusor varillas madera ambiente casa' },
    { id: 'atado-romero-calendula', nombre: 'Atado de romero y caléndula', cat: 'sahumerios', pres: [un('Unidad', 1, 'atado', 4900)], stock: 15, img: 3, foco: [0.38, 0.48, 2.4], rank: 35,
      desc: 'Romero con flores de caléndula, atado a mano para sahumar la casa.',
      tags: 'atado romero calendula hierbas sahumo' },
    { id: 'lavanda-flor', nombre: 'Lavanda en flor seca', cat: 'aceites', pres: [g('50 g', 50, 3900)], stock: 22, img: 6, foco: [0.45, 0.89, 2.4], rank: 36,
      desc: 'Flores de lavanda secas para decorar sahumerios, sumar a los atados o perfumar cajones.',
      tags: 'lavanda flores secas decorar hierbas' },
    { id: 'petalos-rosa', nombre: 'Pétalos de rosa secos', cat: 'aceites', pres: [g('30 g', 30, 3600)], stock: 18, img: 6, foco: [0.33, 0.76, 2.3], rank: 37,
      desc: 'Para decorar sahumerios artesanales y armar mezclas de hierbas.',
      tags: 'rosa petalos flores secas decorar' },
    { id: 'aceite-romero', nombre: 'Aceite esencial de romero', cat: 'aceites', pres: [cc('10 cc', 10, 5200), cc('30 cc', 30, 12900)], stock: 12, img: 4, foco: [0.84, 0.63, 2.4], rank: 38,
      desc: 'Herbal y fresco, para hornitos y difusores eléctricos.',
      tags: 'aceite esencial romero herbal hornito aromaterapia' },
    { id: 'sandalo-rojo', nombre: 'Sándalo rojo en astillas', cat: 'bases', pres: [g('100 g', 100, 6800)], stock: 4, img: 6, foco: [0.92, 0.61, 2.8], rank: 39,
      desc: 'Astillas para moler y sumar a la base, o para quemar sobre carbón. Aroma amaderado y suave.',
      tags: 'sandalo madera astillas rojo' },
    { id: 'olibano-lagrimas', nombre: 'Olíbano en lágrimas', cat: 'aceites', pres: [g('50 g', 50, 5400)], stock: 0, img: 6, foco: [0.15, 0.36, 2.2], rank: 40,
      desc: 'Incienso en resina: aroma resinoso y cítrico, el clásico de los templos.',
      tags: 'olibano incienso resina lagrimas' }
  ];

  const porId = new Map(BD.map(p => [p.id, p]));
  const textos = new Map();
  const texto = p => {
    if (!textos.has(p.id)) {
      const t = norm([p.nombre, nombreCat(p.cat), LINEAS[lineaDe(p)], p.desc, p.tags, p.pres.map(x => x.k).join(' ')].join(' '));
      textos.set(p.id, { t, w: t.split(/[^a-z0-9]+/).filter(Boolean) });
    }
    return textos.get(p.id);
  };
  const precioMin = p => Math.min(...p.pres.map(x => x.precio));
  const tieneMayor = p => p.pres.some(x => x.mayor);
  const enRango = (p, k) => { const [a, b] = k.split('-').map(Number); const v = precioMin(p); return v >= a && v <= b; };

  const preparar = (f = {}) => ({
    linea: LINEAS[f.linea] ? f.linea : '',
    cats: Array.isArray(f.cats) ? f.cats.filter(c => getCategoria(c)) : [],
    mayor: !!f.mayor,
    oferta: !!f.oferta,
    nuevo: !!f.nuevo,
    precios: Array.isArray(f.precios) ? f.precios.filter(k => PRECIOS.some(([x]) => x === k)) : [],
    terminos: norm(f.q || '').split(/\s+/).filter(Boolean).slice(0, 8)
  });

  const cumple = (p, f, salvo = '') => {
    if (salvo !== 'linea' && f.linea && lineaDe(p) !== f.linea) return false;
    if (salvo !== 'cats' && f.cats.length && !f.cats.includes(p.cat)) return false;
    if (salvo !== 'mayor' && f.mayor && !tieneMayor(p)) return false;
    if (salvo !== 'oferta' && f.oferta && !(p.antes > 0)) return false;
    if (salvo !== 'nuevo' && f.nuevo && !p.nuevo) return false;
    if (salvo !== 'precios' && f.precios.length && !f.precios.some(k => enRango(p, k))) return false;
    if (f.terminos.length) {
      const { t, w } = texto(p);
      if (!f.terminos.every(x => (x.length <= 2 ? w.includes(x) : t.includes(x)))) return false;
    }
    return true;
  };

  const ordenar = (lista, orden) => {
    const l = lista.slice();
    if (orden === 'menor') return l.sort((a, b) => precioMin(a) - precioMin(b) || a.rank - b.rank);
    if (orden === 'mayor') return l.sort((a, b) => precioMin(b) - precioMin(a) || a.rank - b.rank);
    if (orden === 'nuevos') return l.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    return l.sort((a, b) => a.rank - b.rank);
  };

  const copia = p => JSON.parse(JSON.stringify(p));
  const tope = n => Math.max(1, Math.min(API_MAX, Math.floor(Number(n)) || 16));

  return {
    API_MAX,
    productos(params = {}) {
      const limite = tope(params.limite);
      const desde = Math.max(0, parseInt(params.cursor, 10) || 0);
      const f = preparar(params);
      const lista = ordenar(BD.filter(p => cumple(p, f)), params.orden);
      const items = lista.slice(desde, desde + limite).map(copia);
      const fin = desde + items.length;
      return { items, total: lista.length, siguiente: fin < lista.length ? String(fin) : null };
    },
    destacados(limite = 8) {
      return ordenar(BD.filter(p => p.stock > 0), 'pedidos').slice(0, tope(limite)).map(copia);
    },
    producto(id) {
      const p = porId.get(id);
      return p ? copia(p) : null;
    },
    porIds(ids = []) {
      return [...new Set(ids)].slice(0, API_MAX).map(id => porId.get(id)).filter(Boolean).map(copia);
    },
    relacionados(id, limite = 3) {
      const p = porId.get(id);
      if (!p) return [];
      return ordenar(BD.filter(x => x.cat === p.cat && x.id !== id && x.stock > 0), 'pedidos').slice(0, tope(limite)).map(copia);
    },
    conteos(params = {}) {
      const f = preparar(params);
      const cuenta = (salvo, pred) => BD.reduce((n, p) => n + (cumple(p, f, salvo) && pred(p) ? 1 : 0), 0);
      return {
        total: cuenta('', () => true),
        cats: Object.fromEntries(CATEGORIAS.map(c => [c.id, cuenta('cats', p => p.cat === c.id)])),
        mayor: cuenta('mayor', tieneMayor),
        oferta: cuenta('oferta', p => p.antes > 0),
        nuevo: cuenta('nuevo', p => !!p.nuevo),
        precios: Object.fromEntries(PRECIOS.map(([k]) => [k, cuenta('precios', p => enRango(p, k))]))
      };
    },
    resumen() {
      return { total: BD.length, cats: Object.fromEntries(CATEGORIAS.map(c => [c.id, BD.filter(p => p.cat === c.id).length])) };
    }
  };
})();

function pedirPagina(params) {
  const r = Servidor.productos(params);
  if (!r || !Array.isArray(r.items) || r.items.length > Servidor.API_MAX) throw new Error('La respuesta de productos supera el tope de 100.');
  return r;
}

const getProducto = id => Servidor.producto(id);
const tieneMayor = p => p.pres.some(x => x.mayor);
const precioDesde = p => Math.min(...p.pres.map(x => x.precio));
const presDesde = p => p.pres.reduce((m, x, i) => (x.precio < p.pres[m].precio ? i : m), 0);

function precioUnidad(p, pr) {
  if (!pr || !pr.u) return null;
  if (pr.u === 'g') return { v: (pr.precio / pr.q) * 1000, txt: 'el kg', base: 'kg' };
  if (pr.u === 'cc') {
    const litro = p.pres.some(x => x.u === 'cc' && x.q >= 1000);
    return litro ? { v: (pr.precio / pr.q) * 1000, txt: 'el litro', base: 'litro' } : { v: (pr.precio / pr.q) * 100, txt: 'cada 100 cc', base: '100 cc' };
  }
  if (pr.u === 'u' && pr.q > 1) return { v: pr.precio / pr.q, txt: `c/${pr.ul}`, base: pr.ul };
  return null;
}

function ahorroDe(p, i) {
  const pr = p.pres[i];
  const u = precioUnidad(p, pr);
  if (!u || i === 0) return 0;
  const base = precioUnidad(p, p.pres[0]);
  if (!base || base.base !== u.base) return 0;
  const a = Math.round((1 - u.v / base.v) * 100);
  return a >= 3 ? a : 0;
}

const ICONO_CARRITO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno" ${valor <= 1 ? 'disabled' : ''}>−</button><output aria-live="polite">${valor}</output><button type="button" data-mas aria-label="Sumar uno" ${valor >= max ? 'disabled' : ''}>+</button></div>`;
}

function badgesHTML(p) {
  const b = [];
  if (!(p.stock > 0)) b.push('<span class="badge badge--agotado">Sin stock</span>');
  if (p.antes > 0 && p.stock > 0) b.push(`<span class="badge badge--oferta">-${Math.round((1 - p.pres[0].precio / p.antes) * 100)}%</span>`);
  if (p.nuevo && p.stock > 0) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (lineaDe(p) === 'listos' && tieneMayor(p) && p.stock > 0) b.push('<span class="badge badge--mayor">Por mayor</span>');
  if (p.stock > 0 && p.stock <= 5) b.push('<span class="badge badge--mayor">Quedan pocas</span>');
  return b.join('');
}

function lineaCard(p) {
  const pres = p.pres.map(x => x.c || x.k);
  const txt = pres.length > 1 ? `${pres[0]} o ${pres[pres.length - 1]}` : (pres[0] === 'Kit' || pres[0] === 'Unidad' ? '' : pres[0]);
  return `${esc(getCategoria(p.cat)?.corto || '')}${txt ? ` · ${esc(txt)}` : ''}`;
}

function precioHTML(p) {
  const i = presDesde(p);
  const pr = p.pres[i];
  const varias = p.pres.length > 1;
  return `<p class="precio">${varias ? '<small>Desde</small>' : ''}<b>${formatearPrecio(pr.precio)}</b>${p.antes > 0 ? `<s>${formatearPrecio(p.antes)}</s>` : ''}${varias ? '' : `<small>${esc(pr.k === 'Kit' || pr.k === 'Unidad' ? '' : pr.k)}</small>`}</p>`;
}

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="btn btn--line btn--chico prod-aviso" href="${esc(wspLink(`Hola Tijax! Avisame cuando vuelva: ${p.nombre}`))}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;
  return `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="btn btn--cta btn--chico prod-add" data-add="${p.id}" data-pres="${presDesde(p)}" aria-label="Agregar al carrito: ${esc(p.nombre)} · ${esc(p.pres[presDesde(p)].k)}"><span class="lbl-long">Agregar</span><span class="lbl-short">Agregar</span>${ICONO_CARRITO_MAS}</button></div>`;
}

function cardHTML(p, anim = 'subir') {
  const estados = { subir: 'opacity:0;transform:translateY(44px)', der: 'opacity:0;transform:translateX(64px)' };
  const a = anim ? ` data-animate="${anim}" style="${estados[anim]}"` : '';
  const agotado = !(p.stock > 0);
  return `<li class="card-wrap"${a}>
    <article class="card${agotado ? ' card--agotado' : ''}" data-id="${p.id}">
      <div class="card-media">
        <button type="button" class="card-foto recorte" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}" style="${recorte(p.img, p.foco, 1.25)}">${imgTag(p.img, p.nombre)}</button>
        <span class="card-badges">${badgesHTML(p)}</span>
        ${agotado ? '' : `<button type="button" class="card-comprar" data-comprar="${p.id}" data-pres="${presDesde(p)}">Comprar ahora</button>`}
      </div>
      <div class="card-cuerpo">
        <p class="card-linea">${lineaCard(p)}</p>
        <h3 class="card-nombre">${esc(p.nombre)}</h3>
        ${precioHTML(p)}
        ${accionesHTML(p)}
      </div>
    </article>
  </li>`;
}

let toastWrap = null;
function showToast(msg) {
  if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.className = 'toast-wrap'; toastWrap.setAttribute('aria-live', 'polite'); document.body.appendChild(toastWrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  toastWrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const Cart = {
  KEY: 'tijax_cart',
  memoria: [],
  sinStorage: false,
  leer() {
    let items = this.memoria;
    if (!this.sinStorage) {
      try { const v = JSON.parse(localStorage.getItem(this.KEY)); items = Array.isArray(v) ? v : []; } catch { items = this.memoria; }
    }
    return Array.isArray(items) ? items : [];
  },
  get() {
    const crudo = this.leer().filter(i => i && typeof i.id === 'string' && Number.isInteger(i.p) && i.qty > 0);
    const prods = new Map(Servidor.porIds(crudo.map(i => i.id)).map(p => [p.id, p]));
    const vistos = new Set();
    return crudo.filter(i => {
      const p = prods.get(i.id);
      const clave = `${i.id}|${i.p}`;
      if (!p || !(p.stock > 0) || !p.pres[i.p] || vistos.has(clave)) return false;
      vistos.add(clave);
      return true;
    }).map(i => ({ id: i.id, p: i.p, qty: Math.min(Math.floor(i.qty), prods.get(i.id).stock), prod: prods.get(i.id) }));
  },
  save(items) {
    const limpio = items.map(({ id, p, qty }) => ({ id, p, qty }));
    this.memoria = limpio;
    try { localStorage.setItem(this.KEY, JSON.stringify(limpio)); } catch { this.sinStorage = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(id, p = 0, qty = 1) {
    const prod = getProducto(id);
    if (!prod || !(prod.stock > 0) || !prod.pres[p]) return 0;
    const items = this.get();
    const it = items.find(i => i.id === id && i.p === p);
    const antes = it ? it.qty : 0;
    const nuevo = Math.min(antes + Math.max(1, qty), prod.stock);
    if (it) it.qty = nuevo; else items.push({ id, p, qty: nuevo });
    this.save(items);
    return nuevo - antes;
  },
  setQty(id, p, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.p === p);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, it.prod.stock));
    this.save(items);
  },
  remove(id, p) { this.save(this.get().filter(i => !(i.id === id && i.p === p))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.prod.pres[i.p].precio * i.qty, 0); }
};

function avisarAgregado(p, presIdx, sumados) {
  if (!p) return;
  if (sumados > 0) showToast(`Sumaste ${p.nombre}${p.pres.length > 1 ? ` · ${p.pres[presIdx].k}` : ''} al carrito`);
  else showToast(`Ya tenés todo el stock disponible de ${p.nombre}`);
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
document.addEventListener('cart:updated', updateCartBadge);

const hayOverlay = () => !!document.querySelector('.main-nav.open, .drawer.is-open, .modal.is-open, .filtros.open');
function liberarScroll() { if (!hayOverlay()) document.body.classList.remove('no-scroll'); }

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden');
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function cerrarNavSiAbierto() {
  const nav = document.getElementById('mainNav');
  if (nav?.classList.contains('open')) document.getElementById('navClose')?.click();
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

function initFamilias() {
  const ul = document.getElementById('circulos');
  if (!ul) return;
  const r = Servidor.resumen();
  ul.innerHTML = CATEGORIAS.map((c, i) => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
    <a class="circulo-link" href="?cat=${c.id}#tienda" data-cat="${c.id}">
      <span class="circulo-wrap"><span class="circulo recorte" style="${recorte(c.img, c.foco)}">${imgTag(c.img, '')}</span><span class="circulo-folio">${String(i + 1).padStart(2, '0')}</span></span>
      <span class="circulo-nombre">${esc(c.nombre)}</span>
      <span class="circulo-n">${cuantos(r.cats[c.id] || 0)}</span>
    </a>
  </li>`).join('');
  document.querySelectorAll('[data-n-familias]').forEach(el => { el.textContent = `${CATEGORIAS.length} familias`; });
  document.querySelectorAll('[data-n-productos]').forEach(el => { el.textContent = cuantos(r.total); });
}

const PASO = 16;
const estado = { q: '', linea: '', cats: [], mayor: false, oferta: false, nuevo: false, precios: [], orden: 'pedidos', siguiente: null, total: 0, mostrados: 0 };
const filtrosActuales = () => ({ q: estado.q, linea: estado.linea, cats: estado.cats.slice(), mayor: estado.mayor, oferta: estado.oferta, nuevo: estado.nuevo, precios: estado.precios.slice(), orden: estado.orden });

function leerUrl() {
  const u = new URLSearchParams(location.search);
  const cats = (u.get('cat') || '').split(',').filter(c => getCategoria(c));
  return {
    cats,
    linea: LINEAS[u.get('linea')] ? u.get('linea') : '',
    mayor: u.get('mayor') === '1',
    q: (u.get('q') || '').slice(0, 60),
    producto: u.get('producto') || ''
  };
}

function escribirUrl() {
  const u = new URLSearchParams(location.search);
  ['cat', 'linea', 'mayor', 'q'].forEach(k => u.delete(k));
  if (estado.cats.length) u.set('cat', estado.cats.join(','));
  if (estado.linea) u.set('linea', estado.linea);
  if (estado.mayor) u.set('mayor', '1');
  if (estado.q) u.set('q', estado.q);
  const qs = u.toString();
  window.history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
}

function cargarCatalogo({ agregar = false } = {}) {
  const grilla = document.getElementById('grilla');
  if (!grilla) return;
  const r = pedirPagina({ ...filtrosActuales(), cursor: agregar ? estado.siguiente : null, limite: PASO });
  const html = r.items.map(p => cardHTML(p)).join('');
  if (agregar) { grilla.insertAdjacentHTML('beforeend', html); estado.mostrados += r.items.length; }
  else { grilla.innerHTML = html; estado.mostrados = r.items.length; }
  estado.siguiente = r.siguiente;
  estado.total = r.total;
  pintarEstadoTienda();
  revelarNuevos(grilla);
  refrescar();
}

function pintarEstadoTienda() {
  const vacio = document.getElementById('tiendaVacio');
  const grilla = document.getElementById('grilla');
  const pie = document.querySelector('.tienda-pie');
  const verMas = document.getElementById('verMas');
  const progreso = document.getElementById('tiendaProgreso');
  const n = document.getElementById('tiendaN');
  const nTxt = document.getElementById('tiendaNTxt');
  if (n) n.textContent = estado.total;
  if (nTxt) nTxt.textContent = estado.total === 1 ? 'producto' : 'productos';
  if (vacio) {
    vacio.hidden = estado.total > 0;
    const vq = document.getElementById('vacioQ');
    if (vq) vq.textContent = estado.q ? `«${estado.q}»` : 'eso';
    const vw = document.getElementById('vacioWsp');
    if (vw) vw.href = wspLink(`Hola Tijax! Busco ${estado.q ? `«${estado.q}»` : 'un insumo'} y no lo vi en la tienda. ¿Lo tienen?`);
  }
  if (grilla) grilla.hidden = estado.total === 0;
  if (pie) pie.hidden = estado.total === 0;
  if (verMas) verMas.hidden = !estado.siguiente;
  if (progreso) {
    progreso.textContent = `Mostrando ${estado.mostrados} de ${estado.total}`;
    progreso.style.setProperty('--avance', `${estado.total ? Math.round((estado.mostrados / estado.total) * 100) : 0}%`);
  }
  pintarFacetas();
  pintarActivos();
  sincronizarControles();
}

function pintarFacetas() {
  const c = Servidor.conteos(filtrosActuales());
  document.querySelectorAll('[data-fn-cat]').forEach(el => {
    const v = c.cats[el.dataset.fnCat] ?? 0;
    el.textContent = v;
    el.closest('.f-check')?.classList.toggle('is-cero', v === 0);
  });
  ['mayor', 'oferta', 'nuevo'].forEach(k => {
    const el = document.querySelector(`[data-fn="${k}"]`);
    if (el) { el.textContent = c[k]; el.closest('.f-check')?.classList.toggle('is-cero', c[k] === 0); }
  });
  document.querySelectorAll('[data-fn-precio]').forEach(el => {
    const v = c.precios[el.dataset.fnPrecio] ?? 0;
    el.textContent = v;
    el.closest('.f-check')?.classList.toggle('is-cero', v === 0);
  });
  document.querySelectorAll('[data-chip-n]').forEach(el => {
    const id = el.dataset.chipN;
    el.textContent = id ? (c.cats[id] ?? 0) : '';
  });
  document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = c.total; });
  const activos = estado.cats.length + estado.precios.length + (estado.mayor ? 1 : 0) + (estado.oferta ? 1 : 0) + (estado.nuevo ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = activos; el.hidden = activos === 0; });
}

function pintarActivos() {
  const ul = document.getElementById('activos');
  if (!ul) return;
  const chips = [];
  if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
  if (estado.linea) chips.push(['linea', '', LINEAS[estado.linea]]);
  estado.cats.forEach(c => chips.push(['cat', c, nombreCat(c)]));
  if (estado.mayor) chips.push(['mayor', '', 'Por mayor']);
  if (estado.oferta) chips.push(['oferta', '', 'En oferta']);
  if (estado.nuevo) chips.push(['nuevo', '', 'Nuevos']);
  estado.precios.forEach(k => chips.push(['precio', k, PRECIOS.find(([x]) => x === k)?.[1] || '']));
  ul.innerHTML = chips.map(([t, v, txt]) => `<li class="activo">${esc(txt)}<button type="button" data-quitar-filtro="${t}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(txt)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`).join('');
  ul.hidden = chips.length === 0;
}

function sincronizarControles() {
  document.querySelectorAll('[data-linea-btn]').forEach(b => {
    const on = b.dataset.lineaBtn === estado.linea;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.includes(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = estado.precios.includes(i.value); });
  ['mayor', 'oferta', 'nuevo'].forEach(k => { const i = document.querySelector(`input[data-f="${k}"]`); if (i) i.checked = estado[k]; });
  document.querySelectorAll('[data-chip]').forEach(b => {
    const id = b.dataset.chip;
    const on = id ? (estado.cats.length === 1 && estado.cats[0] === id) : estado.cats.length === 0;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const q = document.getElementById('q');
  if (q && document.activeElement !== q) q.value = estado.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = estado.orden;
}

function aplicar(cambios = {}, { url = true } = {}) {
  Object.assign(estado, cambios);
  if (estado.linea) estado.cats = estado.cats.filter(c => getCategoria(c)?.linea === estado.linea);
  cargarCatalogo();
  if (url) escribirUrl();
}

function irATienda(cambios, { foco = false, limpiar = true } = {}) {
  if (limpiar) aplicar({ q: '', linea: '', cats: [], mayor: false, oferta: false, nuevo: false, precios: [], ...cambios });
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (foco) setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 500);
}

function initCatalogo() {
  const grilla = document.getElementById('grilla');
  if (!grilla) return;
  const fFam = document.getElementById('fFam');
  if (fFam) fFam.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><em data-fn-cat="${c.id}"></em></label>`).join('');
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = PRECIOS.map(([k, txt]) => `<label class="f-check"><input type="checkbox" data-f="precio" value="${k}"><span>${esc(txt)}</span><em data-fn-precio="${k}"></em></label>`).join('');
  const chips = document.getElementById('chipsFam');
  if (chips) chips.innerHTML = `<li><button type="button" class="chip" data-chip="" aria-pressed="true">Todas</button></li>` + CATEGORIAS.map(c => `<li><button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.nombre)}<em data-chip-n="${c.id}"></em></button></li>`).join('');

  const url = leerUrl();
  Object.assign(estado, { cats: url.cats, linea: url.linea, mayor: url.mayor, q: url.q });
  if (estado.linea) estado.cats = estado.cats.filter(c => getCategoria(c)?.linea === estado.linea);
  cargarCatalogo();

  document.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const f = i.dataset.f;
    if (f === 'cat') aplicar({ cats: [...document.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value) });
    else if (f === 'precio') aplicar({ precios: [...document.querySelectorAll('input[data-f="precio"]:checked')].map(x => x.value) });
    else aplicar({ [f]: i.checked });
  });

  document.querySelectorAll('[data-linea-btn]').forEach(b => b.addEventListener('click', () => aplicar({ linea: b.dataset.lineaBtn })));
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    const id = b.dataset.chip;
    aplicar({ cats: id ? [id] : [], linea: id && estado.linea && getCategoria(id)?.linea !== estado.linea ? '' : estado.linea });
  });

  const q = document.getElementById('q');
  let tq = 0;
  q?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => aplicar({ q: q.value.trim().slice(0, 60) }), 260); });
  document.querySelector('[data-tienda-buscar]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); aplicar({ q: (q?.value || '').trim().slice(0, 60) }); });
  document.getElementById('orden')?.addEventListener('change', e => aplicar({ orden: e.target.value }, { url: false }));

  const hq = document.getElementById('hq');
  document.querySelector('[data-header-buscar]')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = (hq?.value || '').trim().slice(0, 60);
    irATienda({ q: v });
    if (hq) hq.value = '';
  });

  document.getElementById('verMas')?.addEventListener('click', () => {
    if (!estado.siguiente) return;
    cargarCatalogo({ agregar: true });
  });

  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const t = quitar.dataset.quitarFiltro;
      const v = quitar.dataset.valor;
      if (t === 'q') aplicar({ q: '' });
      else if (t === 'linea') aplicar({ linea: '' });
      else if (t === 'cat') aplicar({ cats: estado.cats.filter(c => c !== v) });
      else if (t === 'precio') aplicar({ precios: estado.precios.filter(k => k !== v) });
      else aplicar({ [t]: false });
      return;
    }
    if (e.target.closest('[data-limpiar]')) aplicar({ q: '', linea: '', cats: [], mayor: false, oferta: false, nuevo: false, precios: [] });
  });

  initFiltrosCajon();
}

function initFiltrosCajon() {
  const panel = document.getElementById('filtros');
  const abrir = document.querySelector('[data-filtros-abrir]');
  if (!panel || !abrir) return;
  const fondo = document.createElement('div');
  fondo.className = 'filtros-fondo';
  document.body.appendChild(fondo);
  const esCajon = () => document.querySelector('.tienda--cajon') || window.matchMedia('(max-width: 1024px)').matches;
  let opener = null;
  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    fondo.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', tecla);
    liberarScroll();
    (opener && opener !== document.body && panel.contains(opener) === false ? opener : abrir).focus({ preventScroll: true });
  };
  const open = () => {
    if (!esCajon()) return;
    cerrarNavSiAbierto();
    opener = document.activeElement;
    panel.classList.add('open');
    fondo.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => panel.querySelector('.filtros-cerrar')?.focus(), 60);
  };
  abrir.addEventListener('click', open);
  fondo.addEventListener('click', cerrar);
  panel.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  window.matchMedia('(max-width: 1024px)').addEventListener('change', () => { if (!esCajon()) cerrar(); });
}

function initFiltrosEntrada() {
  const f = document.querySelector('.tienda--lateral .filtros');
  if (!f) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { f.classList.add('is-in'); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { f.classList.add('is-in'); io.disconnect(); }
  }), { threshold: 0 });
  io.observe(f);
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin captura el arrastre igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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
  const track = document.getElementById('railTrack');
  if (!track) return;
  const vp = track.closest('.hscroll');
  track.innerHTML = Servidor.destacados(8).map(p => cardHTML(p, 'der')).join('');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => { const c = track.querySelector('.card-wrap'); return c ? c.getBoundingClientRect().width + parseFloat(window.getComputedStyle(track).columnGap || '16') : 280; };
  const estadoFlechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estadoFlechas, { passive: true });
  window.addEventListener('resize', estadoFlechas, { passive: true });
  estadoFlechas();
}

function initMensajes() {
  const caja = document.querySelector('.mensajes');
  if (!caja) return;
  const slides = [...caja.querySelectorAll('.mensaje')];
  const dots = [...caja.querySelectorAll('.mensajes-dot')];
  if (slides.length < 2) return;
  let i = 0;
  let timer = 0;
  let pausa = false;
  const ir = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  };
  const programar = () => {
    window.clearInterval(timer);
    if (reduceMotion) return;
    timer = window.setInterval(() => { if (!pausa && !document.hidden) ir(i + 1); }, 6000);
  };
  caja.querySelector('[data-msj-next]')?.addEventListener('click', () => { ir(i + 1); window.clearInterval(timer); });
  caja.addEventListener('mouseenter', () => { pausa = true; });
  caja.addEventListener('mouseleave', () => { pausa = false; });
  caja.addEventListener('focusin', () => { pausa = true; });
  caja.addEventListener('focusout', () => { pausa = false; });
  ir(0);
  programar();
}

function initCarrito() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  const panel = drawer.querySelector('.drawer-panel');
  const lista = document.getElementById('drawerItems');
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  const totalEl = document.getElementById('drawerTotal');
  const nEl = document.getElementById('drawerN');
  const wsp = document.getElementById('drawerWsp');
  let opener = null;
  let tCierre = 0;

  const render = () => {
    const items = Cart.get();
    lista.innerHTML = items.map((it, k) => {
      const pr = it.prod.pres[it.p];
      return `<li class="d-item" style="--i:${k}" data-linea-carrito="${it.id}" data-p="${it.p}">
        <span class="d-foto recorte" style="${recorte(it.prod.img, it.prod.foco)}">${imgTag(it.prod.img, '')}</span>
        <p class="d-nombre">${esc(it.prod.nombre)}${it.prod.pres.length > 1 || (pr.k !== 'Kit' && pr.k !== 'Unidad') ? `<small>${esc(pr.k)}</small>` : ''}</p>
        <b class="d-precio">${formatearPrecio(pr.precio * it.qty)}</b>
        <div class="d-acciones">
          <div class="stepper"><button type="button" data-d-menos aria-label="Restar uno de ${esc(it.prod.nombre)}" ${it.qty <= 1 ? 'disabled' : ''}>−</button><output>${it.qty}</output><button type="button" data-d-mas aria-label="Sumar uno de ${esc(it.prod.nombre)}" ${it.qty >= it.prod.stock ? 'disabled' : ''}>+</button></div>
          <button type="button" class="d-quitar" data-d-quitar>Quitar</button>
        </div>
      </li>`;
    }).join('');
    const n = items.reduce((s, it) => s + it.qty, 0);
    const total = items.reduce((s, it) => s + it.prod.pres[it.p].precio * it.qty, 0);
    lista.hidden = !items.length;
    vacio.hidden = !!items.length;
    pie.hidden = !items.length;
    totalEl.textContent = formatearPrecio(total);
    nEl.textContent = n ? `(${n})` : '';
    const lineas = items.map(it => `• ${it.prod.nombre}${it.prod.pres.length > 1 ? ` (${it.prod.pres[it.p].k})` : ''} × ${it.qty} — ${formatearPrecio(it.prod.pres[it.p].precio * it.qty)}`).join('\n');
    wsp.href = wspLink(items.length ? `Hola Tijax! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(total)}\n¿Me confirman disponibilidad y envío?` : 'Hola Tijax! Quiero hacer un pedido.');
  };

  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };

  const abrir = (desde) => {
    cerrarNavSiAbierto();
    if (document.getElementById('quick')?.classList.contains('is-open')) cerrarQuick(false);
    opener = desde || document.activeElement;
    clearTimeout(tCierre);
    render();
    drawer.hidden = false;
    drawer.classList.add('animando');
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => drawer.classList.remove('animando'), 900);
    setTimeout(() => panel.querySelector('.drawer-cerrar')?.focus(), 60);
  };

  const cerrar = () => {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    document.removeEventListener('keydown', tecla);
    tCierre = setTimeout(() => { drawer.hidden = true; liberarScroll(); }, reduceMotion ? 0 : 380);
    if (reduceMotion) liberarScroll();
    opener?.focus?.({ preventScroll: true });
  };

  window.abrirCarrito = abrir;
  window.cerrarCarrito = cerrar;

  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrir(b)));
  drawer.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('is-open')) render(); });

  lista.addEventListener('click', e => {
    const li = e.target.closest('[data-linea-carrito]');
    if (!li) return;
    const id = li.dataset.lineaCarrito;
    const p = Number(li.dataset.p);
    const actual = Cart.get().find(i => i.id === id && i.p === p);
    if (!actual) return;
    if (e.target.closest('[data-d-menos]')) Cart.setQty(id, p, actual.qty - 1);
    else if (e.target.closest('[data-d-mas]')) Cart.setQty(id, p, actual.qty + 1);
    else if (e.target.closest('[data-d-quitar]')) { Cart.remove(id, p); showToast(`Sacaste ${actual.prod.nombre} del carrito`); }
    if (!Cart.get().length) panel.querySelector('.drawer-cerrar')?.focus();
  });

  drawer.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  drawer.querySelectorAll('[data-carrito-ir]').forEach(b => b.addEventListener('click', () => {
    cerrar();
    const cat = b.dataset.carritoIr;
    setTimeout(() => irATienda(cat === 'bases' ? { linea: 'insumos' } : { cats: [cat] }), reduceMotion ? 0 : 300);
  }));
}

let cerrarQuick = () => {};

function initQuick() {
  const modal = document.getElementById('quick');
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  const qv = document.getElementById('qv');
  let opener = null;
  let actual = null;
  let sel = 0;
  let tCierre = 0;
  let ld = document.getElementById('ldProducto');

  const pintarPrecio = () => {
    const p = actual;
    const pr = p.pres[sel];
    const u = precioUnidad(p, pr);
    const ah = ahorroDe(p, sel);
    qv.querySelector('[data-qv-precio]').textContent = formatearPrecio(pr.precio);
    const ue = qv.querySelector('[data-qv-unidad]');
    ue.textContent = u ? `${formatearPrecio(u.v)} ${u.txt}` : '';
    const ae = qv.querySelector('[data-qv-ahorro]');
    ae.hidden = !ah;
    ae.textContent = ah ? `Ahorrás ${ah} % ${u ? (u.base === 'kg' ? 'por kilo' : u.base === 'litro' ? 'por litro' : u.base === '100 cc' ? 'cada 100 cc' : `por ${u.base}`) : ''}` : '';
    qv.querySelectorAll('[data-qv-pres]').forEach(b => b.setAttribute('aria-checked', Number(b.dataset.qvPres) === sel ? 'true' : 'false'));
  };

  const render = () => {
    const p = actual;
    const agotado = !(p.stock > 0);
    const rel = Servidor.relacionados(p.id, 3);
    const varias = p.pres.length > 1;
    qv.innerHTML = `
      <div class="qv-foto recorte" style="${recorte(p.img, p.foco)}">${imgTag(p.img, p.nombre)}<span class="card-badges">${badgesHTML(p)}</span></div>
      <div class="qv-info">
        <p class="qv-linea">${esc(nombreCat(p.cat))} · ${esc(LINEAS[lineaDe(p)])}</p>
        <p class="qv-nombre">${esc(p.nombre)}</p>
        <div class="qv-precio"><b data-qv-precio></b>${p.antes > 0 ? `<s>${formatearPrecio(p.antes)}</s>` : ''}<span class="qv-unidad" data-qv-unidad></span></div>
        <span class="qv-ahorro" data-qv-ahorro hidden></span>
        ${varias ? `<p class="qv-sub">Presentación</p><div class="qv-pres" role="radiogroup" aria-label="Presentación">${p.pres.map((x, i) => `<button type="button" class="qv-pres-btn" role="radio" aria-checked="${i === sel}" data-qv-pres="${i}"><b>${esc(x.k)}</b><span>${formatearPrecio(x.precio)}${x.mayor ? ' · por mayor' : ''}</span></button>`).join('')}</div>` : `<p class="qv-sub">Presentación: ${esc(p.pres[0].k)}</p>`}
        ${agotado ? `<a class="btn btn--line" href="${esc(wspLink(`Hola Tijax! Avisame cuando vuelva: ${p.nombre}`))}" target="_blank" rel="noopener">Avisame cuando vuelva</a>` : `<div class="qv-acciones">${stepperHTML(p.stock)}<button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button><button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button></div>`}
        <p class="qv-desc">${esc(p.desc)}</p>
        ${p.contenido ? `<p class="qv-sub">Qué trae</p><ul class="qv-contenido">${p.contenido.map(([a, b]) => `<li><span>${esc(a)}</span><b>${esc(b)}</b></li>`).join('')}</ul>` : ''}
        ${rel.length ? `<p class="qv-sub">También te puede interesar</p><div class="qv-rel">${rel.map(r => `<button type="button" class="qv-rel-item" data-quick="${r.id}"><span class="recorte" style="${recorte(r.img, r.foco)}">${imgTag(r.img, '')}</span><span>${esc(r.nombre)}</span><b>${p.pres.length > 1 || r.pres.length > 1 ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div>` : ''}
      </div>`;
    pintarPrecio();
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ldProducto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(`images/${FOTOS[p.img][0]}`, location.href).href, category: nombreCat(p.cat), offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.pres.map(x => x.precio)), offerCount: p.pres.length, availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } });
  };

  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };

  const escribirProducto = id => {
    const u = new URLSearchParams(location.search);
    if (id) u.set('producto', id); else u.delete('producto');
    const qs = u.toString();
    window.history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  };

  const abrir = (id, presIdx, desde) => {
    const p = getProducto(id);
    if (!p) return;
    cerrarNavSiAbierto();
    actual = p;
    sel = Number.isInteger(presIdx) && p.pres[presIdx] ? presIdx : presDesde(p);
    const yaAbierto = modal.classList.contains('is-open');
    if (!yaAbierto) opener = desde || document.activeElement;
    clearTimeout(tCierre);
    render();
    escribirProducto(p.id);
    if (yaAbierto) { panel.scrollTop = 0; panel.focus({ preventScroll: true }); return; }
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => panel.focus({ preventScroll: true }), 60);
  };

  const cerrar = (devolverFoco = true) => {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', tecla);
    escribirProducto('');
    tCierre = setTimeout(() => { modal.hidden = true; liberarScroll(); }, reduceMotion ? 0 : 340);
    if (reduceMotion) liberarScroll();
    if (devolverFoco) opener?.focus?.({ preventScroll: true });
  };

  cerrarQuick = cerrar;
  window.abrirQuick = abrir;

  modal.querySelectorAll('[data-cerrar-modal]').forEach(b => b.addEventListener('click', () => cerrar()));
  qv.addEventListener('click', e => {
    const pb = e.target.closest('[data-qv-pres]');
    if (pb) { sel = Number(pb.dataset.qvPres); pintarPrecio(); return; }
    const qty = Number(qv.querySelector('.stepper output')?.textContent || 1);
    if (e.target.closest('[data-qv-add]')) {
      const sumados = Cart.add(actual.id, sel, qty);
      avisarAgregado(actual, sel, sumados);
      return;
    }
    if (e.target.closest('[data-qv-comprar]')) {
      Cart.add(actual.id, sel, qty);
      cerrar(false);
      window.abrirCarrito?.(opener);
    }
  });

  const u = leerUrl();
  if (u.producto && getProducto(u.producto)) abrir(u.producto, null, document.getElementById('grilla') || document.body);
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  let enCarrito = Cart.count();
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || enCarrito > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', () => { enCarrito = Cart.count(); sync(); });
  cart?.addEventListener('click', () => window.abrirCarrito?.(cart));
  sync();
}

function initDelegados() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-menos], [data-stepper] [data-mas]');
    if (step) {
      const st = step.closest('[data-stepper]');
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      const v = Math.max(1, Math.min(max, Number(out.textContent || 1) + (step.hasAttribute('data-mas') ? 1 : -1)));
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      const p = getProducto(id);
      const pres = Number(add.dataset.pres || 0);
      const card = add.closest('.card');
      const qty = card ? Number(card.querySelector('.stepper output')?.textContent || 1) : 1;
      const sumados = Cart.add(id, pres, qty);
      avisarAgregado(p, pres, sumados);
      if (card && sumados > 0) {
        const out = card.querySelector('.stepper output');
        if (out) { out.textContent = '1'; const st = out.closest('[data-stepper]'); st.querySelector('[data-menos]').disabled = true; st.querySelector('[data-mas]').disabled = Number(st.dataset.max) <= 1; }
      }
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const card = comprar.closest('.card');
      const qty = card ? Number(card.querySelector('.stepper output')?.textContent || 1) : 1;
      Cart.add(comprar.dataset.comprar, Number(comprar.dataset.pres || 0), qty);
      window.abrirCarrito?.(comprar);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      window.abrirQuick?.(quick.dataset.quick, null, quick);
      return;
    }
    const link = e.target.closest('a[data-cat], a[data-linea], a[data-mayor]');
    if (link && document.getElementById('grilla')) {
      e.preventDefault();
      const cambios = {};
      if (link.dataset.cat) cambios.cats = [link.dataset.cat];
      if (link.dataset.linea) cambios.linea = link.dataset.linea;
      if (link.dataset.mayor) cambios.mayor = true;
      irATienda(cambios);
      return;
    }
    if (e.target.closest('[data-ir-buscar]')) irATienda({}, { foco: true, limpiar: false });
  });
}

function fillPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(p.pres[0].precio);
  });
}

function initCalc() {
  const sec = document.getElementById('calculadora');
  const rango = document.getElementById('calcRango');
  if (!sec || !rango) return;
  const num = document.getElementById('calcNum');
  const unidad = document.getElementById('calcUnidad');
  const lista = document.getElementById('calcLista');
  const costoEl = document.getElementById('calcCosto');
  const totalEl = document.getElementById('calcTotal');
  const agregar = document.getElementById('calcAgregar');
  const wsp = document.getElementById('calcWsp');
  const segs = [...sec.querySelectorAll('input[name="largo"]')];
  const RINDE_KG = 500;
  const LARGO = {
    20: { f: 1, varillas: 'varillas-pino-20', txt: 'sahumerios de 20 cm' },
    30: { f: 1.5, varillas: 'varillas-bambu-30', txt: 'sahumerios de 30 cm' }
  };
  const ESENCIAS = ['esencia-lavanda', 'esencia-palo-santo', 'esencia-sandalo', 'esencia-vainilla', 'esencia-ruda', 'esencia-limon'];
  const RECETA = [
    { id: 'harina-pino-120', nombre: 'Harina de pino malla 120', u: 'g', porKg: 1000 },
    { id: 'goma-xantica', nombre: 'Goma xántica', u: 'g', porKg: 100 },
    { id: 'nitrato-potasio', nombre: 'Nitrato de potasio', u: 'g', porKg: 20 },
    { id: 'varillas', nombre: 'Varillas', u: 'g', porKg: 200 },
    { id: 'esencia', nombre: 'Esencia pura', u: 'cc', porKg: 100 },
    { id: 'colorante-liquido', nombre: 'Colorante líquido', u: 'cc', porKg: 60 },
    { id: 'alcohol-cereal', nombre: 'Alcohol de cereal 96°', u: 'cc', porKg: 1000 }
  ];
  const nombresEsencia = Servidor.porIds(ESENCIAS);
  let largo = segs.find(r => r.checked)?.value || '20';
  let aroma = ESENCIAS[0];
  let compra = [];

  const cantidadTxt = (v, u) => {
    if (u === 'g') return v >= 1000 ? `${fmtNum(v / 1000, 2)} kg` : `${fmtNum(Math.ceil(v), 0)} g`;
    return v >= 1000 ? `${fmtNum(v / 1000, 2)} L` : `${fmtNum(Math.ceil(v), 0)} cc`;
  };

  const mejorCompra = (pres, necesidad) => {
    const ops = pres.map((x, i) => ({ ...x, i })).sort((a, b) => a.q - b.q);
    const chica = ops[0];
    const grande = ops[ops.length - 1];
    if (ops.length === 1) {
      const n = Math.max(1, Math.ceil(necesidad / chica.q));
      return { costo: n * chica.precio, comprado: n * chica.q, lineas: [{ p: chica.i, n, k: chica.k }] };
    }
    let mejor = null;
    const maxG = Math.ceil(necesidad / grande.q);
    for (let gq = 0; gq <= maxG; gq++) {
      const resto = Math.max(0, necesidad - gq * grande.q);
      const cq = Math.ceil(resto / chica.q);
      if (gq + cq === 0) continue;
      const costo = gq * grande.precio + cq * chica.precio;
      if (!mejor || costo < mejor.costo || (costo === mejor.costo && gq + cq < mejor.n)) {
        mejor = {
          costo, n: gq + cq, comprado: gq * grande.q + cq * chica.q,
          lineas: [gq ? { p: grande.i, n: gq, k: grande.k } : null, cq ? { p: chica.i, n: cq, k: chica.k } : null].filter(Boolean)
        };
      }
    }
    return mejor;
  };

  const calcular = () => {
    const n = Number(rango.value);
    const L = LARGO[largo];
    const kg = (n * L.f) / RINDE_KG;
    const ids = RECETA.map(r => (r.id === 'varillas' ? L.varillas : r.id === 'esencia' ? aroma : r.id));
    const prods = new Map(Servidor.porIds(ids).map(p => [p.id, p]));
    let total = 0;
    let exacto = 0;
    compra = RECETA.map((r, k) => {
      const p = prods.get(ids[k]);
      const necesidad = r.porKg * kg;
      const m = mejorCompra(p.pres, necesidad);
      total += m.costo;
      exacto += necesidad * (m.costo / m.comprado);
      return { r, p, necesidad, m };
    });
    return { n, total, porUnidad: exacto / n };
  };

  const pintar = () => {
    const { n, total, porUnidad } = calcular();
    const pct = ((n - Number(rango.min)) / (Number(rango.max) - Number(rango.min))) * 100;
    rango.style.setProperty('--p', `${pct.toFixed(1)}%`);
    rango.setAttribute('aria-valuetext', `${n.toLocaleString('es-AR')} ${LARGO[largo].txt}`);
    num.textContent = n.toLocaleString('es-AR');
    unidad.textContent = LARGO[largo].txt;
    lista.innerHTML = compra.map(({ r, p, necesidad, m }) => {
      const nombre = r.id === 'esencia'
        ? `Esencia pura de <select data-calc-aroma aria-label="Aroma de la esencia">${nombresEsencia.map(e => `<option value="${e.id}"${e.id === aroma ? ' selected' : ''}>${esc(e.nombre.replace('Esencia pura de ', ''))}</option>`).join('')}</select>`
        : esc(r.id === 'varillas' ? p.nombre.replace(' para sahumerios', '') : r.nombre);
      const llevas = m.lineas.map(l => `${l.n} × ${l.k}`).join(' + ');
      return `<li class="calc-item"><span class="ci-nombre">${nombre}</span><b class="ci-precio">${formatearPrecio(m.costo)}</b><span class="ci-detalle">Necesitás ${cantidadTxt(necesidad, r.u)} · llevás ${esc(llevas)}</span></li>`;
    }).join('');
    costoEl.textContent = formatearPrecio(porUnidad);
    totalEl.textContent = formatearPrecio(total);
    const lineas = compra.map(({ p, m }) => `• ${p.nombre}: ${m.lineas.map(l => `${l.n} × ${l.k}`).join(' + ')}`).join('\n');
    wsp.href = wspLink(`Hola Tijax! Quiero los insumos para ${n.toLocaleString('es-AR')} ${LARGO[largo].txt}:\n${lineas}\nTotal estimado: ${formatearPrecio(total)}`);
  };

  rango.addEventListener('input', pintar);
  segs.forEach(r => r.addEventListener('change', () => {
    if (!r.checked) return;
    largo = r.value;
    pintar();
  }));
  lista.addEventListener('change', e => {
    const s = e.target.closest('[data-calc-aroma]');
    if (!s) return;
    aroma = s.value;
    pintar();
    lista.querySelector('[data-calc-aroma]')?.focus();
  });
  agregar.addEventListener('click', () => {
    let topes = 0;
    compra.forEach(({ p, m }) => m.lineas.forEach(l => { const s = Cart.add(p.id, l.p, l.n); if (s < l.n) topes++; }));
    showToast(topes ? 'Sumamos la lista; en algunos insumos llegaste al stock disponible' : `Sumaste la lista para ${Number(rango.value).toLocaleString('es-AR')} sahumerios al carrito`);
    window.abrirCarrito?.(agregar);
  });
  pintar();
}

function initProceso() {
  const sec = document.querySelector('.proceso');
  if (!sec) return;
  const pista = sec.querySelector('.proceso-pista');
  const visor = sec.querySelector('.visor');
  const img = sec.querySelector('.visor-img');
  const panel = sec.querySelector('.proceso-panel');
  const pasos = [...sec.querySelectorAll('.paso')];
  const dato = document.getElementById('visorDato');
  if (!pista || !visor || !img || !pasos.length) return;
  const PARADAS = [
    { x: 0.32, y: 0.49, s: 2.3, txt: 'Paso 01 · Harina de pino malla 120' },
    { x: 0.63, y: 0.47, s: 1.9, txt: 'Paso 02 · La pasta con goma y nitrato' },
    { x: 0.86, y: 0.84, s: 2.1, txt: 'Paso 03 · Varillas de pino' },
    { x: 0.48, y: 0.19, s: 2.3, txt: 'Paso 04 · Esencias puras' },
    { x: 0.5, y: 0.5, s: 1, txt: 'La mesa del kit inicial' }
  ];
  const N = Math.min(PARADAS.length, pasos.length);
  let actual = -1;
  let W = 0;
  let H = 0;

  const medir = () => { const r = visor.getBoundingClientRect(); W = r.width; H = r.height; };

  const activar = i => {
    if (i === actual) return;
    actual = i;
    pasos.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('is-on', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (dato) dato.textContent = PARADAS[i].txt;
  };

  const camara = ({ x, y, s }) => {
    if (!W || !H) medir();
    const D = Math.max(W, H);
    const ox = (W - D) / 2;
    const oy = (H - D) / 2;
    const px = ox + x * D;
    const py = oy + y * D;
    let tx = -s * (px - W / 2);
    let ty = -s * (py - H / 2);
    const txMax = s * (W / 2 - ox) - W / 2;
    const txMin = W / 2 - s * (ox + D - W / 2);
    const tyMax = s * (H / 2 - oy) - H / 2;
    const tyMin = H / 2 - s * (oy + D - H / 2);
    tx = Math.min(txMax, Math.max(txMin, tx));
    ty = Math.min(tyMax, Math.max(tyMin, ty));
    img.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
  };

  const progreso = () => {
    const off = offModelos();
    const r = pista.getBoundingClientRect();
    const total = r.height - (window.innerHeight - off);
    return total > 0 ? clamp01((off - r.top) / total) : 0;
  };

  const calcular = () => {
    const p = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    panel?.style.setProperty('--p', p.toFixed(4));
    const local = clamp01(p * N - i);
    const a = PARADAS[Math.max(0, i - 1)];
    const b = PARADAS[i];
    const k = i === 0 ? 1 : suave(local / 0.42);
    const deriva = 1 + 0.035 * suave((local - 0.42) / 0.58);
    camara({ x: mezcla(a.x, b.x, k), y: mezcla(a.y, b.y, k), s: mezcla(a.s, b.s, k) * (i === N - 1 ? 1 : deriva) });
  };

  sec.__calcular = calcular;

  if (reduceMotion) {
    sec.classList.add('proceso--estatico');
    pasos.forEach(p => { p.classList.add('is-on'); p.setAttribute('aria-hidden', 'false'); });
    if (dato) dato.textContent = 'La mesa del kit inicial';
    return;
  }

  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; calcular(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); }, { passive: true });
  window.addEventListener('load', () => { medir(); calcular(); });
  medir();
  calcular();
}

function initNews() {
  const form = document.querySelector('[data-news]');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button[type="submit"]');
  const error = form.parentElement.querySelector('.news-error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (error) error.hidden = ok;
    if (!ok) { input.focus(); return; }
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      btn.disabled = false;
      btn.textContent = txt;
    }, 800);
  });
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') { input.setAttribute('aria-invalid', 'false'); if (error) error.hidden = true; } });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.classList.add('hero-listo');
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => {
    const els = [...hero.querySelectorAll(sel)];
    if (els.length) tl.from(els, vars, pos);
  };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.banner-marca', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.05);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.15, clearProps: 'transform,opacity,filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 0.95, clearProps: 'transform,opacity' }, 0.4);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.8, stagger: 0.12, clearProps: 'transform,opacity' }, 0.5);
  desde('.receta-ficha, .mensajes', { y: 40, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.4);
  desde('.ficha-lista li', { x: 12, opacity: 0, duration: 0.5, stagger: 0.05, clearProps: 'transform,opacity' }, 0.6);
}

initModelBarScroll();
initNav();
initFamilias();
initCatalogo();
initRail();
initMensajes();
initCalc();
initProceso();
initCarrito();
initQuick();
initFloats();
updateCartBadge();
fillPrecios();
initNews();
initDelegados();
initReveals();
initFiltrosEntrada();
initHeroMotion();

(() => {
  const u = leerUrl();
  if ((u.cats.length || u.linea || u.mayor || u.q) && location.hash === '#tienda') {
    requestAnimationFrame(() => document.getElementById('tienda')?.scrollIntoView({ block: 'start' }));
  }
})();
