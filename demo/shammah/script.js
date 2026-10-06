'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WSP = '5491134210953';
const PASO = 16;
const FOTOS = {
  1: ['shammah-percha.webp', 941, 1672],
  2: ['shammah-mesa.webp', 1672, 941],
  3: ['shammah-marfil.webp', 1254, 1254],
  4: ['shammah-petroleo.webp', 1254, 1254],
  5: ['shammah-rosa.webp', 1254, 1254],
  6: ['shammah-coleccion.webp', 1254, 1254]
};
const COLORES = [
  { id: 'marfil', nombre: 'Marfil', hex: '#EFE5D3', sin: 'blanco crudo natural' },
  { id: 'rosa', nombre: 'Rosa empolvado', hex: '#E5B7AF', sin: 'rosado nude' },
  { id: 'celeste', nombre: 'Celeste', hex: '#A8BDE3', sin: 'azul claro lavanda' },
  { id: 'petroleo', nombre: 'Petróleo', hex: '#1D5E64', sin: 'verde turquesa teal' },
  { id: 'azul', nombre: 'Azul noche', hex: '#1E2A5A', sin: 'azul marino navy oscuro' }
];
const LINEAS = { romantica: 'Romántica', sexy: 'Sexy', noche: 'De noche' };
const CATEGORIAS = [
  { id: 'conjunto', nombre: 'Conjuntos', uno: 'Conjunto' },
  { id: 'portaligas', nombre: 'Con portaligas', uno: 'Con portaligas' },
  { id: 'corpino', nombre: 'Corpiños', uno: 'Corpiño' },
  { id: 'bombacha', nombre: 'Bombachas', uno: 'Bombacha' },
  { id: 'camison', nombre: 'Camisones y babydolls', uno: 'Camisón' },
  { id: 'bata', nombre: 'Batas y pijamas', uno: 'Bata y pijama' },
  { id: 'top', nombre: 'Tops', uno: 'Top' }
];
const SISTEMA = { conjunto: 'corpino', portaligas: 'corpino', corpino: 'corpino', bombacha: 'bombacha', camison: 'noche', bata: 'noche', top: 'noche' };
const TALLES_CORPINO = ['85', '90', '95', '100', '105'];
const TALLES_LETRA = ['S', 'M', 'L', 'XL', 'XXL'];
const COPAS = ['A', 'B', 'C', 'D'];
const EQUIV = { 85: 'S', 90: 'M', 95: 'L', 100: 'XL', 105: 'XXL' };
const PRECIOS = [['0-15000', 'Hasta $15.000'], ['15000-30000', '$15.000 a $30.000'], ['30000-45000', '$30.000 a $45.000'], ['45000-999999', 'Más de $45.000']];
const TABLA_CORPINO = [['85', 68, 72], ['90', 73, 77], ['95', 78, 82], ['100', 83, 87], ['105', 88, 92]];
const TABLA_COPA = [['A', 12, 14], ['B', 14, 16], ['C', 16, 18], ['D', 18, 20]];
const TABLA_CADERA = [['S', 88, 93], ['M', 94, 99], ['L', 100, 105], ['XL', 106, 111], ['XXL', 112, 117]];
const TABLA_BUSTO = [['S', 82, 89], ['M', 90, 95], ['L', 96, 101], ['XL', 102, 107], ['XXL', 108, 113]];
const AB_DATOS = [
  { color: 'marfil', frase: 'Blanco, pero nada inocente' },
  { color: 'rosa', frase: 'Romántica, y sin pedir permiso' },
  { color: 'celeste', frase: 'Suave como un domingo sin alarma' },
  { color: 'petroleo', frase: 'El color que se anima' },
  { color: 'azul', frase: 'Para cuando baja la luz' }
];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.min(1, Math.max(0, v));
const arr = v => (Array.isArray(v) ? v : v ? [v] : []);
const colorDe = id => COLORES.find(c => c.id === id) || COLORES[0];
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const icono = (id, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const listaY = l => (l.length > 1 ? `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}` : l.join(''));
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offsetBarra = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const ordenTalle = t => {
  const i = TALLES_CORPINO.indexOf(t);
  return i >= 0 ? i : 10 + TALLES_LETRA.indexOf(t);
};
const rangoTalles = p => (p.talles.length > 1 ? `${p.talles[0]}–${p.talles[p.talles.length - 1]}` : p.talles[0] || '');

function irA(sel) {
  const el = sel === '#top' ? document.body : document.querySelector(sel);
  el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function recorteVars(k, foco, ar = 0.75) {
  const [w, h] = FOTOS[k] ? [FOTOS[k][1], FOTOS[k][2]] : [1200, 1200];
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
  return { op: `${pct(px)} ${pct(py)}`, to: `${pct(fx)} ${pct(fy)}`, z: String(z) };
}

function recorteEstilo(k, foco, ar) {
  const v = recorteVars(k, foco, ar);
  return `--op:${v.op};--to:${v.to};--z:${v.z}`;
}

function aplicarRecorte(el) {
  const partes = (el.dataset.recorte || '').split('|').map(Number);
  if (partes.length < 4 || !FOTOS[partes[0]]) return;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const v = recorteVars(partes[0], partes.slice(1), r.width / r.height);
  el.style.setProperty('--op', v.op);
  el.style.setProperty('--to', v.to);
  el.style.setProperty('--z', v.z);
}

function aplicarRecortes(cont = document) {
  $$('[data-recorte]', cont).forEach(aplicarRecorte);
}

function fotoHTML(col, alt, ar, extra = '') {
  const [k, cx, cy, z] = col.f;
  const [src, w, h] = FOTOS[k];
  return `<span class="recorte${extra ? ' ' + extra : ''}" data-recorte="${k}|${cx}|${cy}|${z}" style="${recorteEstilo(k, [cx, cy, z], ar)}"><img src="images/${src}" width="${w}" height="${h}" alt="${esc(alt)}"></span>`;
}

const Servidor = (() => {
  const API_MAX = 100;
  const col = (c, k, cx, cy, z) => ({ c, f: [k, cx, cy, z] });
  const BD = [
    { id: 'conjunto-aurora', nombre: 'Conjunto Aurora', cat: 'conjunto', linea: 'romantica', precio: 38900, stock: 9, rank: 3,
      talles: ['85', '90', '95', '100', '105'], copas: ['B', 'C'], colores: [col('marfil', 3, 0.55, 0.52, 1)],
      desc: 'Corpiño balconette de encaje con aro y colaless al tono, con breteles finos y un moño chico en el centro.',
      tags: 'encaje balconette aro colaless tanga novia' },
    { id: 'conjunto-valentina', nombre: 'Conjunto Valentina', cat: 'conjunto', linea: 'romantica', precio: 36900, stock: 8, rank: 1, nuevo: true,
      talles: ['85', '90', '95', '100'], copas: ['B', 'C'], colores: [col('rosa', 5, 0.5, 0.52, 1)],
      desc: 'Encaje de flores en rosa empolvado, con moños de satén en el corpiño y en los laterales de la bombacha.',
      tags: 'encaje flores floral moños saten' },
    { id: 'conjunto-marina', nombre: 'Conjunto Marina', cat: 'conjunto', linea: 'sexy', precio: 41900, stock: 7, rank: 2, nuevo: true,
      talles: ['85', '90', '95', '100', '105'], copas: ['B', 'C', 'D'], colores: [col('petroleo', 4, 0.5, 0.5, 1)],
      desc: 'Copas de satén con encaje encima y bombacha de satén con laterales de encaje. Un petróleo profundo que brilla con la luz.',
      tags: 'saten encaje brillo moños' },
    { id: 'conjunto-olivia', nombre: 'Conjunto Olivia', cat: 'conjunto', linea: 'sexy', precio: 42900, stock: 10, rank: 5, nuevo: true,
      talles: ['85', '90', '95', '100', '105'], copas: ['B', 'C', 'D'],
      colores: [col('azul', 6, 0.195, 0.245, 2.2), col('petroleo', 6, 0.82, 0.235, 2.2)],
      desc: 'Encaje floral de punta a punta, con un moño chico en el centro. Corpiño con aro y bombacha con transparencias.',
      tags: 'encaje floral transparencia transparente aro moño' },
    { id: 'conjunto-ines', nombre: 'Conjunto Inés', cat: 'conjunto', linea: 'romantica', precio: 37900, stock: 6, rank: 7, nuevo: true,
      talles: ['85', '90', '95', '100'], copas: ['A', 'B', 'C'], colores: [col('marfil', 6, 0.51, 0.255, 2.2)],
      desc: 'Tul marfil bordado con flores celestes. Es el conjunto de la línea Inés, que también tiene babydoll.',
      tags: 'tul bordado flores floral celestes estampado' },
    { id: 'conjunto-alma', nombre: 'Conjunto Alma', cat: 'conjunto', linea: 'romantica', precio: 33900, stock: 14, rank: 4,
      talles: ['85', '90', '95', '100', '105'], copas: ['B', 'C', 'D'],
      colores: [col('marfil', 1, 0.19, 0.77, 2.3), col('rosa', 1, 0.57, 0.745, 2.3), col('celeste', 1, 0.86, 0.7, 2.7)],
      desc: 'Corpiño de copa armada con encaje encima y bombacha de encaje al tono. El conjunto para todos los días, en tres colores.',
      tags: 'encaje copa armada diario clasico' },
    { id: 'conjunto-nerea', nombre: 'Conjunto Nerea', cat: 'conjunto', linea: 'sexy', precio: 42000, descuento: 15, stock: 5, rank: 9,
      talles: ['85', '90', '95', '100'], copas: ['B', 'C'], colores: [col('petroleo', 2, 0.495, 0.5, 1.95)],
      desc: 'Corpiño de encaje con aro y culotte de encaje al tono, con un moño chico en la cintura.',
      tags: 'encaje culotte aro' },
    { id: 'conjunto-julieta', nombre: 'Conjunto Julieta con portaligas', cat: 'portaligas', linea: 'sexy', precio: 54900, stock: 6, rank: 6,
      talles: ['85', '90', '95', '100'], copas: ['B', 'C'],
      colores: [col('marfil', 1, 0.14, 0.37, 2.9), col('rosa', 1, 0.385, 0.37, 2.9), col('celeste', 1, 0.585, 0.37, 2.9), col('petroleo', 1, 0.76, 0.36, 2.9)],
      desc: 'Tres piezas: corpiño de encaje con aro, bombacha al tono y portaligas con broches dorados.',
      tags: 'portaligas liguero ligas tres piezas encaje broches' },
    { id: 'corpino-lis', nombre: 'Corpiño Lis de encaje', cat: 'corpino', linea: 'romantica', precio: 26900, stock: 9, rank: 10,
      talles: ['85', '90', '95', '100', '105'], copas: ['B', 'C', 'D'], colores: [col('celeste', 2, 0.22, 0.35, 2.1)],
      desc: 'Copa entera de encaje celeste, con aro y breteles regulables.',
      tags: 'encaje aro copa entera breteles' },
    { id: 'corpino-clara', nombre: 'Corpiño Clara push-up', cat: 'corpino', linea: 'romantica', precio: 27900, stock: 2, rank: 13,
      talles: ['85', '90', '95', '100'], copas: ['A', 'B', 'C'], colores: [col('marfil', 2, 0.235, 0.61, 2.6)],
      desc: 'Push-up de encaje marfil con borde festoneado y un moño chico en el centro.',
      tags: 'push up pushup realce encaje festoneado' },
    { id: 'culotte-mia', nombre: 'Culotte Mía de encaje', cat: 'bombacha', linea: 'romantica', precio: 11900, stock: 20, rank: 8,
      talles: ['S', 'M', 'L', 'XL', 'XXL'],
      colores: [col('azul', 2, 0.1, 0.765, 2.9), col('celeste', 2, 0.17, 0.86, 2.9), col('rosa', 2, 0.3, 0.73, 2.9), col('marfil', 2, 0.37, 0.86, 2.9)],
      desc: 'Culotte de encaje con un moño chico adelante, en cuatro colores para combinar con todos los corpiños.',
      tags: 'culotte bombacha encaje moño' },
    { id: 'bombacha-valentina', nombre: 'Bombacha Valentina', cat: 'bombacha', linea: 'romantica', precio: 12900, stock: 12, rank: 15,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('rosa', 5, 0.5, 0.76, 1.6)],
      desc: 'La bombacha del conjunto Valentina, para llevar sola: encaje de flores y moños de satén a los costados.',
      tags: 'bombacha encaje flores moños' },
    { id: 'bombacha-marina', nombre: 'Bombacha Marina de satén', cat: 'bombacha', linea: 'sexy', precio: 13900, stock: 10, rank: 12,
      talles: ['S', 'M', 'L', 'XL', 'XXL'], colores: [col('petroleo', 4, 0.5, 0.77, 1.55)],
      desc: 'Satén petróleo con laterales de encaje y moños chicos. La bombacha del conjunto Marina.',
      tags: 'bombacha saten encaje moños brillo' },
    { id: 'colaless-aurora', nombre: 'Colaless Aurora', cat: 'bombacha', linea: 'romantica', precio: 10900, stock: 15, rank: 17,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('marfil', 3, 0.58, 0.75, 1.55)],
      desc: 'El colaless de encaje del conjunto Aurora, con tiras finas y un dije chico adelante.',
      tags: 'colaless tanga encaje bombacha' },
    { id: 'camison-selene', nombre: 'Camisón Selene de satén', cat: 'camison', linea: 'noche', precio: 38900, stock: 8, rank: 11,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('petroleo', 6, 0.83, 0.73, 1.8), col('rosa', 2, 0.72, 0.37, 2.5)],
      desc: 'Camisón de satén con escote en V de encaje y breteles finos.',
      tags: 'camison saten escote encaje breteles dormir' },
    { id: 'camison-nocturna', nombre: 'Camisón Nocturna de encaje', cat: 'camison', linea: 'noche', precio: 44900, stock: 3, rank: 14,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('azul', 2, 0.655, 0.37, 2.5)],
      desc: 'Encaje y tul azul noche con transparencias, breteles finos y busto armado.',
      tags: 'camison encaje tul transparencia transparente sexy' },
    { id: 'babydoll-ines', nombre: 'Babydoll Inés', cat: 'camison', linea: 'noche', precio: 34900, stock: 7, rank: 16, nuevo: true,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('marfil', 6, 0.6, 0.69, 1.95)],
      desc: 'Tul marfil con flores celestes bordadas en el busto y un volado de puntilla en el ruedo.',
      tags: 'babydoll baby doll tul bordado flores celestes puntilla' },
    { id: 'bata-amira', nombre: 'Bata Amira', cat: 'bata', linea: 'noche', precio: 52900, stock: 6, rank: 18,
      talles: ['S', 'M', 'L', 'XL', 'XXL'], colores: [col('azul', 6, 0.27, 0.73, 1.8), col('marfil', 2, 0.91, 0.4, 1.9)],
      desc: 'Bata de satén con mangas y puños de encaje y lazo a la cintura.',
      tags: 'bata kimono saten encaje mangas lazo' },
    { id: 'pijama-noa', nombre: 'Pijama Noa de satén', cat: 'bata', linea: 'noche', precio: 48900, stock: 7, rank: 19,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('azul', 2, 0.82, 0.78, 1.5)],
      desc: 'Camisa y pantalón de satén con vivos en contraste y botones forrados.',
      tags: 'pijama saten camisa pantalon vivos dormir' },
    { id: 'top-luna', nombre: 'Top Luna de satén', cat: 'top', linea: 'noche', precio: 22000, descuento: 10, stock: 11, rank: 20,
      talles: ['S', 'M', 'L', 'XL'], colores: [col('rosa', 2, 0.6, 0.8, 1.8)],
      desc: 'Top de satén con escote de encaje y breteles finos, para dormir o para debajo de un saco.',
      tags: 'top camisola musculosa saten encaje breteles' }
  ];

  const porId = new Map(BD.map(p => [p.id, p]));
  const textos = new Map();
  const texto = p => {
    if (!textos.has(p.id)) {
      const t = norm([p.nombre, catDe(p.cat).nombre, catDe(p.cat).uno, LINEAS[p.linea], p.desc, p.tags, p.talles.join(' '),
        p.colores.map(c => `${colorDe(c.c).nombre} ${colorDe(c.c).sin}`).join(' ')].join(' '));
      textos.set(p.id, { t, w: t.split(/[^a-z0-9]+/).filter(Boolean) });
    }
    return textos.get(p.id);
  };
  const enRango = (p, k) => {
    const [a, b] = k.split('-').map(Number);
    const v = precioFinal(p);
    return v >= a && v <= b;
  };
  const validarMt = mt => {
    if (!mt || typeof mt !== 'object') return null;
    const v = {
      corpino: TALLES_CORPINO.includes(mt.corpino) ? mt.corpino : null,
      copa: COPAS.includes(mt.copa) ? mt.copa : null,
      bombacha: TALLES_LETRA.includes(mt.bombacha) ? mt.bombacha : null,
      noche: TALLES_LETRA.includes(mt.noche) ? mt.noche : null
    };
    return v.corpino || v.bombacha || v.noche ? v : null;
  };
  const preparar = (f = {}) => ({
    lineas: arr(f.lineas).filter(l => LINEAS[l]),
    cats: arr(f.cats).filter(c => CATEGORIAS.some(x => x.id === c)),
    talles: arr(f.talles).filter(t => TALLES_CORPINO.includes(t) || TALLES_LETRA.includes(t)),
    colores: arr(f.colores).filter(c => COLORES.some(x => x.id === c)),
    precios: arr(f.precios).filter(k => PRECIOS.some(([x]) => x === k)),
    nuevo: !!f.nuevo,
    oferta: !!f.oferta,
    mt: validarMt(f.mt),
    terminos: norm(f.q || '').split(/\s+/).filter(Boolean).slice(0, 8)
  });
  const encajaMt = (p, mt) => {
    const s = SISTEMA[p.cat];
    if (s === 'corpino') {
      if (!mt.corpino || !p.talles.includes(mt.corpino)) return false;
      return !(mt.copa && p.copas && !p.copas.includes(mt.copa));
    }
    const t = s === 'bombacha' ? mt.bombacha : mt.noche;
    return !!t && p.talles.includes(t);
  };
  const cumple = (p, f, salvo = '') => {
    if (salvo !== 'lineas' && f.lineas.length && !f.lineas.includes(p.linea)) return false;
    if (salvo !== 'cats' && f.cats.length && !f.cats.includes(p.cat)) return false;
    if (salvo !== 'talles' && f.talles.length && !p.talles.some(t => f.talles.includes(t))) return false;
    if (salvo !== 'colores' && f.colores.length && !p.colores.some(c => f.colores.includes(c.c))) return false;
    if (salvo !== 'precios' && f.precios.length && !f.precios.some(k => enRango(p, k))) return false;
    if (salvo !== 'nuevo' && f.nuevo && !p.nuevo) return false;
    if (salvo !== 'oferta' && f.oferta && !(p.descuento > 0)) return false;
    if (salvo !== 'mt' && f.mt && !encajaMt(p, f.mt)) return false;
    if (f.terminos.length) {
      const { t, w } = texto(p);
      if (!f.terminos.every(x => (x.length <= 2 ? w.includes(x) : t.includes(x)))) return false;
    }
    return true;
  };
  const ordenar = (lista, orden) => {
    const l = lista.slice();
    if (orden === 'menor') return l.sort((a, b) => precioFinal(a) - precioFinal(b) || a.rank - b.rank);
    if (orden === 'mayor') return l.sort((a, b) => precioFinal(b) - precioFinal(a) || a.rank - b.rank);
    if (orden === 'nuevos') return l.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    return l.sort((a, b) => a.rank - b.rank);
  };
  const copia = p => JSON.parse(JSON.stringify(p));
  const tope = n => Math.max(1, Math.min(API_MAX, Math.floor(Number(n)) || PASO));
  const extremos = lista => {
    const l = [...new Set(lista)].sort((a, b) => ordenTalle(a) - ordenTalle(b));
    return l.length ? [l[0], l[l.length - 1]] : null;
  };

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
    producto(id) {
      const p = porId.get(id);
      return p ? copia(p) : null;
    },
    porIds(ids = []) {
      return [...new Set(arr(ids))].slice(0, API_MAX).map(id => porId.get(id)).filter(Boolean).map(copia);
    },
    relacionados(id, limite = 3) {
      const p = porId.get(id);
      if (!p) return [];
      const otros = BD.filter(x => x.id !== id && x.stock > 0);
      const mismos = ordenar(otros.filter(x => x.linea === p.linea), 'destacados');
      const resto = ordenar(otros.filter(x => x.linea !== p.linea && x.cat === p.cat), 'destacados');
      return [...mismos, ...resto].slice(0, tope(limite)).map(copia);
    },
    conteos(params = {}) {
      const f = preparar(params);
      const cuenta = (salvo, pred) => BD.reduce((n, p) => n + (cumple(p, f, salvo) && pred(p) ? 1 : 0), 0);
      return {
        total: cuenta('', () => true),
        lineas: Object.fromEntries(Object.keys(LINEAS).map(l => [l, cuenta('lineas', p => p.linea === l)])),
        cats: Object.fromEntries(CATEGORIAS.map(c => [c.id, cuenta('cats', p => p.cat === c.id)])),
        talles: Object.fromEntries([...TALLES_CORPINO, ...TALLES_LETRA].map(t => [t, cuenta('talles', p => p.talles.includes(t))])),
        colores: Object.fromEntries(COLORES.map(c => [c.id, cuenta('colores', p => p.colores.some(x => x.c === c.id))])),
        precios: Object.fromEntries(PRECIOS.map(([k]) => [k, cuenta('precios', p => enRango(p, k))])),
        nuevo: cuenta('nuevo', p => !!p.nuevo),
        oferta: cuenta('oferta', p => p.descuento > 0)
      };
    },
    porColor() {
      return Object.fromEntries(COLORES.map(c => {
        const l = BD.filter(p => p.colores.some(x => x.c === c.id));
        return [c.id, {
          total: l.length,
          desde: l.length ? Math.min(...l.map(precioFinal)) : 0,
          corpino: extremos(l.filter(p => SISTEMA[p.cat] === 'corpino').flatMap(p => p.talles)),
          letras: extremos(l.filter(p => SISTEMA[p.cat] !== 'corpino').flatMap(p => p.talles))
        }];
      }));
    },
    miTalle(mt, limite = 3) {
      const f = preparar({ mt });
      if (!f.mt) return { total: 0, ejemplos: [] };
      const l = ordenar(BD.filter(p => cumple(p, f)), 'destacados');
      return { total: l.length, ejemplos: l.slice(0, tope(limite)).map(copia) };
    },
    resumen() {
      return { total: BD.length, lineas: Object.fromEntries(Object.keys(LINEAS).map(l => [l, BD.filter(p => p.linea === l).length])) };
    }
  };
})();

function pedirPagina(params) {
  const r = Servidor.productos(params);
  if (!r || !Array.isArray(r.items) || r.items.length > Servidor.API_MAX) throw new Error('La respuesta de productos supera el tope de 100.');
  return r;
}

const getProducto = id => Servidor.producto(id);
const lineaKey = i => `${i.id}|${i.color}|${i.talle}`;

const Cart = {
  KEY: 'shammah_cart',
  memoria: [],
  get() {
    let items;
    try { items = JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { items = this.memoria; }
    if (!Array.isArray(items)) items = [];
    const prods = new Map(Servidor.porIds(items.map(i => i?.id)).map(p => [p.id, p]));
    return items.filter(i => {
      const p = prods.get(i?.id);
      return p && p.colores.some(c => c.c === i.color) && p.talles.includes(i.talle) && Number.isFinite(Number(i.qty)) && Number(i.qty) > 0;
    }).map(i => ({ id: i.id, color: i.color, talle: i.talle, qty: Math.min(Math.floor(Number(i.qty)), prods.get(i.id).stock || 99) }));
  },
  save(items) {
    this.memoria = items;
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, color, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.color === color && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, color, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get();
    const it = items.find(i => lineaKey(i) === key);
    if (!it) return;
    const p = getProducto(it.id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  qtyDe(key) { return this.get().find(i => lineaKey(i) === key)?.qty || 0; },
  remove(key) { this.save(this.get().filter(i => lineaKey(i) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    const items = this.get();
    const prods = new Map(Servidor.porIds(items.map(i => i.id)).map(p => [p.id, p]));
    return items.reduce((s, i) => { const p = prods.get(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0);
  }
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const talleGuardado = () => {
  try { return JSON.parse(localStorage.getItem('shammah_talle')) || null; } catch { return null; }
};
const talleMioPara = p => {
  const mt = talleGuardado();
  if (!mt) return null;
  const s = SISTEMA[p.cat];
  const t = s === 'corpino' ? mt.corpino : s === 'bombacha' ? mt.bombacha : mt.noche;
  return t && p.talles.includes(t) ? t : null;
};

function agregarAlCarrito(p, color, talle, qty, abrir = false) {
  const antes = Cart.get().find(i => i.id === p.id && i.color === color && i.talle === talle)?.qty || 0;
  if (antes >= p.stock) { showToast('Ya tenés todas las unidades disponibles de este modelo'); return false; }
  Cart.add(p, color, talle, qty);
  const despues = Cart.get().find(i => i.id === p.id && i.color === color && i.talle === talle)?.qty || 0;
  if (despues - antes < qty) showToast(`Sumamos ${despues - antes}: es lo que queda de ${p.nombre}`);
  else showToast(`${p.nombre} · ${colorDe(color).nombre} · talle ${talle}, al carrito`);
  if (abrir) abrirCarrito();
  return true;
}

function precioHTML(p) {
  if (p.descuento > 0) return `<span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`;
  return `<span>${formatearPrecio(p.precio)}</span>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<span class="prod-badges">${b.join('')}</span>` : '';
}

const qtyCard = new Map();

function cardHTML(p, animar = true) {
  const nom = esc(p.nombre);
  const c0 = p.colores[0];
  const alt = p.colores[1];
  const qty = Math.min(qtyCard.get(p.id) || 1, p.stock || 1);
  return `<li class="prod" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : ''}>
    <article class="prod-card">
      <div class="prod-fig">
        <button type="button" class="prod-media" data-quick="${p.id}" aria-label="Ver ${nom}">
          ${fotoHTML(c0, `${p.nombre} en ${colorDe(c0.c).nombre}`, 0.8)}${alt ? fotoHTML(alt, '', 0.8, 'recorte--alt') : ''}${badgesHTML(p)}
        </button>
        <div class="prod-tray" data-tray hidden></div>
      </div>
      <div class="prod-body">
        <h3 class="prod-name" data-quick="${p.id}">${nom}</h3>
        <div class="prod-fila">
          <p class="prod-price">${precioHTML(p)}</p>
          <p class="prod-colores"><span class="sr-only">${p.colores.length > 1 ? 'Colores' : 'Color'}: ${esc(listaY(p.colores.map(c => colorDe(c.c).nombre)))}. Talles</span>${p.colores.map(c => `<span class="dot" style="--sw:${colorDe(c.c).hex}"></span>`).join('')}<span class="prod-talles">${rangoTalles(p)}</span></p>
        </div>
        <div class="prod-actions">
          <div class="stepper" role="group" aria-label="Cantidad de ${nom}"><button type="button" data-menos aria-label="Uno menos"${qty <= 1 ? ' disabled' : ''}>${icono('i-menos')}</button><span class="stepper-n" data-n>${qty}</span><button type="button" data-mas aria-label="Uno más"${qty >= p.stock ? ' disabled' : ''}>${icono('i-mas')}</button></div>
          <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nom}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button>
        </div>
        <button type="button" class="prod-comprar" data-comprar="${p.id}">Comprar ahora</button>
      </div>
    </article>
  </li>`;
}

function trayHTML(p, modo) {
  const mio = talleMioPara(p);
  const c0 = colorDe(p.colores[0].c).nombre;
  const tit = SISTEMA[p.cat] === 'corpino' ? 'Talle de corpiño' : 'Elegí tu talle';
  return `<div class="prod-tray-cab"><p class="prod-tray-tit">${tit} · ${esc(c0)}</p><button type="button" class="prod-tray-x" data-tray-x aria-label="Cerrar la elección de talle">${icono('i-x')}</button></div>
    <div class="prod-tray-chips" role="group" aria-label="${tit}">${p.talles.map(t => `<button type="button" class="chip-talle${t === mio ? ' es-tuyo' : ''}" data-talle-card="${t}" data-modo="${modo}">${t}</button>`).join('')}</div>`;
}

const estado = { q: '', lineas: [], cats: [], talles: [], colores: [], precios: [], nuevo: false, oferta: false, mt: null, orden: 'destacados', siguiente: null, mostrados: 0, total: 0 };

const filtrosActuales = () => ({
  q: estado.q, lineas: estado.lineas, cats: estado.cats, talles: estado.talles, colores: estado.colores,
  precios: estado.precios, nuevo: estado.nuevo, oferta: estado.oferta, mt: estado.mt, orden: estado.orden
});

function resetFiltros() {
  Object.assign(estado, { q: '', lineas: [], cats: [], talles: [], colores: [], precios: [], nuevo: false, oferta: false, mt: null });
  const q = $('#q');
  if (q) q.value = '';
}

function renderCatalogo(agregar = false) {
  const grid = $('#catalogo');
  if (!grid) return;
  const r = pedirPagina({ ...filtrosActuales(), cursor: agregar ? estado.siguiente : null, limite: PASO });
  const html = r.items.map(p => cardHTML(p)).join('');
  if (agregar) grid.insertAdjacentHTML('beforeend', html);
  else grid.innerHTML = html;
  estado.siguiente = r.siguiente;
  estado.total = r.total;
  estado.mostrados = agregar ? estado.mostrados + r.items.length : r.items.length;
  aplicarRecortes(grid);
  pintarConteos();
  pintarActivos();
  actualizarPieCatalogo();
  revelarNuevos(grid);
  refrescarScroll();
}

function actualizarPieCatalogo() {
  const vacio = $('[data-vacio]');
  const mas = $('[data-ver-mas]');
  const mostrando = $('[data-mostrando]');
  const n = $('[data-tienda-n]');
  if (vacio) vacio.hidden = estado.total > 0;
  if (mas) {
    const quedan = estado.total - estado.mostrados;
    mas.hidden = !estado.siguiente;
    mas.textContent = quedan > 0 ? `Ver ${Math.min(PASO, quedan)} ${Math.min(PASO, quedan) === 1 ? 'modelo más' : 'modelos más'}` : 'Ver más modelos';
  }
  if (mostrando) mostrando.textContent = estado.total ? `Mostrando ${estado.mostrados} de ${cuantos(estado.total, 'modelo', 'modelos')}` : '';
  if (n) n.textContent = estado.total ? `${cuantos(estado.total, 'modelo', 'modelos')} confeccionados en el taller` : 'Sin modelos para estos filtros';
  const verRes = $('[data-ver-resultados]');
  if (verRes) verRes.textContent = estado.total ? `Ver ${cuantos(estado.total, 'modelo', 'modelos')}` : 'Sin resultados';
}

function pintarOpcionesFiltro() {
  const cats = $('[data-filtro-cats]');
  if (cats) cats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cats" value="${c.id}"><span>${esc(c.nombre)}</span><span class="n" data-n-f="cats-${c.id}"></span></label>`).join('');
  $$('[data-filtro-talles]').forEach(cont => {
    const lista = cont.dataset.filtroTalles === 'corpino' ? TALLES_CORPINO : TALLES_LETRA;
    cont.innerHTML = lista.map(t => `<label class="chip-check"><input type="checkbox" data-f="talles" value="${t}" aria-label="Talle ${t}"><span>${t}</span></label>`).join('');
  });
  const cols = $('[data-filtro-colores]');
  if (cols) cols.innerHTML = COLORES.map(c => `<label class="check"><input type="checkbox" data-f="colores" value="${c.id}"><span class="muestra-tela" style="--sw:${c.hex}"></span><span>${esc(c.nombre)}</span><span class="n" data-n-f="colores-${c.id}"></span></label>`).join('');
  const pre = $('[data-filtro-precios]');
  if (pre) pre.innerHTML = PRECIOS.map(([k, t]) => `<label class="check"><input type="checkbox" data-f="precios" value="${k}"><span>${esc(t)}</span><span class="n" data-n-f="precios-${k}"></span></label>`).join('');
  const ext = $('[data-filtro-extra]');
  if (ext) ext.innerHTML = `<label class="check"><input type="checkbox" data-f="nuevo" value="1"><span>Lo nuevo del taller</span><span class="n" data-n-f="nuevo"></span></label><label class="check"><input type="checkbox" data-f="oferta" value="1"><span>Con descuento</span><span class="n" data-n-f="oferta"></span></label>`;
}

function sincronizarControles() {
  $$('input[data-f]').forEach(inp => {
    const g = inp.dataset.f;
    inp.checked = g === 'nuevo' || g === 'oferta' ? !!estado[g] : (estado[g] || []).includes(inp.value);
  });
  $$('[data-linea-chip]').forEach(b => {
    const v = b.dataset.lineaChip;
    b.setAttribute('aria-pressed', String(v ? estado.lineas.includes(v) : !estado.lineas.length));
  });
  const orden = $('[data-orden]');
  if (orden) orden.value = estado.orden;
}

function pintarConteos() {
  const c = Servidor.conteos(filtrosActuales());
  const poner = (key, n) => {
    const el = $(`[data-n-f="${key}"]`);
    if (el) el.textContent = n;
    const lab = el?.closest('.check');
    if (lab) lab.classList.toggle('vacio', !n);
  };
  CATEGORIAS.forEach(x => poner(`cats-${x.id}`, c.cats[x.id]));
  COLORES.forEach(x => poner(`colores-${x.id}`, c.colores[x.id]));
  PRECIOS.forEach(([k]) => poner(`precios-${k}`, c.precios[k]));
  poner('nuevo', c.nuevo);
  poner('oferta', c.oferta);
  $$('input[data-f="talles"]').forEach(inp => { inp.disabled = !c.talles[inp.value] && !inp.checked; });
  const activos = estado.cats.length + estado.talles.length + estado.colores.length + estado.precios.length + (estado.nuevo ? 1 : 0) + (estado.oferta ? 1 : 0) + (estado.mt ? 1 : 0);
  const badge = $('[data-filtros-n]');
  if (badge) { badge.textContent = activos; badge.hidden = !activos; }
}

function textoMiTalle(mt) {
  return [mt.corpino ? `${mt.corpino}${mt.copa ? ' ' + mt.copa : ''}` : '', mt.bombacha || '', mt.noche && mt.noche !== mt.bombacha ? mt.noche : ''].filter(Boolean).join(' · ');
}

function pintarActivos() {
  const cont = $('[data-activos]');
  if (!cont) return;
  const chips = [];
  const chip = (txt, quitar) => chips.push(`<button type="button" class="chip-activo" data-quitar-filtro="${esc(quitar)}">${esc(txt)}${icono('i-x')}</button>`);
  if (estado.q) chip(`“${estado.q}”`, 'q');
  if (estado.mt) chip(`Tu talle: ${textoMiTalle(estado.mt)}`, 'mt');
  estado.lineas.forEach(l => chip(LINEAS[l], `lineas:${l}`));
  estado.cats.forEach(x => chip(catDe(x).nombre, `cats:${x}`));
  estado.talles.forEach(t => chip(`Talle ${t}`, `talles:${t}`));
  estado.colores.forEach(x => chip(colorDe(x).nombre, `colores:${x}`));
  estado.precios.forEach(k => chip(PRECIOS.find(([x]) => x === k)?.[1] || k, `precios:${k}`));
  if (estado.nuevo) chip('Lo nuevo', 'nuevo');
  if (estado.oferta) chip('Con descuento', 'oferta');
  if (chips.length > 1) chips.push('<button type="button" class="chip-activo chip-activo--limpiar" data-limpiar>Limpiar todo</button>');
  cont.innerHTML = chips.join('');
  cont.hidden = !chips.length;
}

function syncURL() {
  const ps = new URLSearchParams();
  if (estado.lineas.length) ps.set('linea', estado.lineas.join(','));
  if (estado.cats.length) ps.set('cat', estado.cats.join(','));
  if (estado.talles.length) ps.set('talle', estado.talles.join(','));
  if (estado.colores.length) ps.set('color', estado.colores.join(','));
  if (estado.precios.length) ps.set('precio', estado.precios.join(','));
  if (estado.nuevo) ps.set('nuevo', '1');
  if (estado.oferta) ps.set('oferta', '1');
  if (estado.q) ps.set('q', estado.q);
  if (estado.orden !== 'destacados') ps.set('orden', estado.orden);
  const qs = ps.toString();
  try { window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch { return; }
}

function aplicarParams(ps) {
  const lista = (k, validos) => (ps.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  estado.lineas = lista('linea', Object.keys(LINEAS)).slice(0, 1);
  estado.cats = lista('cat', CATEGORIAS.map(c => c.id));
  estado.talles = lista('talle', [...TALLES_CORPINO, ...TALLES_LETRA]);
  estado.colores = lista('color', COLORES.map(c => c.id));
  estado.precios = lista('precio', PRECIOS.map(([k]) => k));
  estado.nuevo = ps.get('nuevo') === '1';
  estado.oferta = ps.get('oferta') === '1';
  estado.q = (ps.get('q') || '').slice(0, 60);
  const orden = ps.get('orden');
  estado.orden = ['destacados', 'nuevos', 'menor', 'mayor'].includes(orden) ? orden : 'destacados';
  const q = $('#q');
  if (q) q.value = estado.q;
}

function filtrarYMostrar(cambios, destino = '#tienda') {
  resetFiltros();
  Object.assign(estado, cambios);
  sincronizarControles();
  renderCatalogo();
  syncURL();
  irA(destino);
}

const mqFiltrosFijos = window.matchMedia('(min-width: 1025px)');
const filtrosSonDrawer = () => !(document.body.classList.contains('m2') && mqFiltrosFijos.matches);
let filtrosOpener = null;

function abrirFiltros() {
  const aside = $('#filtros');
  if (!aside || !filtrosSonDrawer()) return;
  filtrosOpener = document.activeElement;
  aside.classList.add('abierto');
  const fondo = $('.filtros-fondo');
  if (fondo) fondo.hidden = false;
  $('[data-abrir-filtros]')?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
  setTimeout(() => aside.querySelector('.filtros-cerrar')?.focus(), 60);
}

function cerrarFiltros() {
  const aside = $('#filtros');
  if (!aside?.classList.contains('abierto')) return;
  aside.classList.remove('abierto');
  const fondo = $('.filtros-fondo');
  if (fondo) fondo.hidden = true;
  $('[data-abrir-filtros]')?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
  filtrosOpener?.focus?.();
}

function initTienda() {
  const grid = $('#catalogo');
  if (!grid) return;
  pintarOpcionesFiltro();
  const ps = new URLSearchParams(location.search);
  aplicarParams(ps);
  sincronizarControles();
  renderCatalogo();

  const aside = $('#filtros');
  aside?.addEventListener('change', e => {
    const inp = e.target.closest('input[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'nuevo' || g === 'oferta') estado[g] = inp.checked;
    else {
      const set = new Set(estado[g]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      estado[g] = [...set];
    }
    renderCatalogo();
    syncURL();
  });

  $$('[data-linea-chip]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.lineaChip;
    estado.lineas = v ? [v] : [];
    sincronizarControles();
    renderCatalogo();
    syncURL();
  }));

  $('[data-orden]')?.addEventListener('change', e => {
    estado.orden = e.target.value;
    renderCatalogo();
    syncURL();
  });

  const q = $('#q');
  let tq = 0;
  q?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => {
      estado.q = q.value.trim().slice(0, 60);
      renderCatalogo();
      syncURL();
    }, 260);
  });
  $('[data-buscar]')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(tq);
    estado.q = (q?.value || '').trim().slice(0, 60);
    renderCatalogo();
    syncURL();
    q?.blur();
  });

  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const [g, v] = quitar.dataset.quitarFiltro.split(':');
      if (g === 'q') { estado.q = ''; if (q) q.value = ''; }
      else if (g === 'mt') estado.mt = null;
      else if (g === 'nuevo' || g === 'oferta') estado[g] = false;
      else estado[g] = estado[g].filter(x => x !== v);
      sincronizarControles();
      renderCatalogo();
      syncURL();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      resetFiltros();
      sincronizarControles();
      renderCatalogo();
      syncURL();
    }
  });

  $('[data-ver-mas]')?.addEventListener('click', () => {
    if (estado.siguiente) renderCatalogo(true);
  });

  $('[data-abrir-filtros]')?.addEventListener('click', abrirFiltros);
  $$('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  aside?.addEventListener('keydown', e => atraparFoco(aside, e));
  mqFiltrosFijos.addEventListener('change', () => { if (!filtrosSonDrawer()) cerrarFiltros(); });

  const prod = ps.get('producto');
  if (prod && Servidor.producto(prod)) setTimeout(() => abrirQuick(prod, null, null), 300);
  if (location.hash === '#tienda' && [...ps.keys()].length) window.addEventListener('load', () => irA('#tienda'));
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      const opener = quick.matches('button, a') ? quick : quick.closest('.prod')?.querySelector('.prod-media') || quick;
      abrirQuick(quick.dataset.quick, null, opener);
      return;
    }
    const li = e.target.closest('.prod');
    if (!li) return;
    const p = getProducto(li.dataset.id);
    if (!p) return;
    const stepN = li.querySelector('[data-n]');
    if (e.target.closest('[data-menos]') || e.target.closest('[data-mas]')) {
      const n = Math.max(1, Math.min((qtyCard.get(p.id) || 1) + (e.target.closest('[data-mas]') ? 1 : -1), p.stock || 1));
      qtyCard.set(p.id, n);
      if (stepN) stepN.textContent = n;
      const menos = li.querySelector('[data-menos]');
      const mas = li.querySelector('[data-mas]');
      if (menos) menos.disabled = n <= 1;
      if (mas) mas.disabled = n >= p.stock;
      return;
    }
    const tray = li.querySelector('[data-tray]');
    if (e.target.closest('[data-tray-x]')) {
      if (tray) tray.hidden = true;
      li.querySelector('[data-add]')?.focus();
      return;
    }
    const add = e.target.closest('[data-add]') || e.target.closest('[data-comprar]');
    if (add && tray) {
      const modo = add.hasAttribute('data-comprar') ? 'comprar' : 'agregar';
      if (!tray.hidden && tray.dataset.modo === modo) { tray.hidden = true; return; }
      $$('[data-tray]:not([hidden])').forEach(t => { t.hidden = true; });
      tray.dataset.modo = modo;
      tray.innerHTML = trayHTML(p, modo);
      tray.hidden = false;
      (tray.querySelector('.es-tuyo') || tray.querySelector('[data-talle-card]'))?.focus();
      return;
    }
    const chip = e.target.closest('[data-talle-card]');
    if (chip && tray) {
      const ok = agregarAlCarrito(p, p.colores[0].c, chip.dataset.talleCard, qtyCard.get(p.id) || 1, chip.dataset.modo === 'comprar');
      if (ok) {
        tray.hidden = true;
        qtyCard.set(p.id, 1);
        if (stepN) stepN.textContent = '1';
        const menos = li.querySelector('[data-menos]');
        if (menos) menos.disabled = true;
      }
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const abierta = $('[data-tray]:not([hidden])');
    if (abierta && !document.body.classList.contains('no-scroll')) {
      abierta.hidden = true;
      abierta.closest('.prod')?.querySelector('[data-add]')?.focus();
    }
  });
}

function initColecciones() {
  const r = Servidor.resumen();
  $$('[data-col-n]').forEach(el => { el.textContent = cuantos(r.lineas[el.dataset.colN] || 0, 'modelo', 'modelos'); });
}

function initEnlacesFiltro() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="?"]');
    if (!a || e.defaultPrevented) return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (!$('#catalogo')) return;
    e.preventDefault();
    resetFiltros();
    aplicarParams(url.searchParams);
    sincronizarControles();
    renderCatalogo();
    syncURL();
    irA(url.hash || '#tienda');
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const sel = a.getAttribute('href');
    if (sel.length < 2 || !document.querySelector(sel)) return;
    e.preventDefault();
    irA(sel);
  });
  $$('[data-ir-buscar]').forEach(b => b.addEventListener('click', () => {
    irA('#tienda');
    setTimeout(() => $('#q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }));
  $$('[data-hero-talle]').forEach(b => b.addEventListener('click', () => filtrarYMostrar({ talles: [b.dataset.heroTalle] })));
}

let carritoOpener = null;

function abrirCarrito() {
  const d = $('#drawer');
  if (!d) return;
  carritoOpener = document.activeElement;
  pintarCarrito();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer-panel')?.focus();
}

function cerrarCarrito() {
  const d = $('#drawer');
  if (!d || d.hidden) return;
  d.hidden = true;
  document.body.classList.remove('no-scroll');
  carritoOpener?.focus?.();
}

function pintarCarrito() {
  const d = $('#drawer');
  if (!d) return;
  const items = Cart.get();
  const prods = new Map(Servidor.porIds(items.map(i => i.id)).map(p => [p.id, p]));
  const lista = $('[data-drawer-items]', d);
  const vacio = $('[data-drawer-vacio]', d);
  const pie = $('[data-drawer-pie]', d);
  const n = Cart.count();
  $('[data-drawer-n]', d).textContent = n ? `(${cuantos(n, 'prenda', 'prendas')})` : '';
  lista.hidden = !items.length;
  pie.hidden = !items.length;
  vacio.hidden = !!items.length;
  lista.innerHTML = items.map((i, k) => {
    const p = prods.get(i.id);
    if (!p) return '';
    const c = p.colores.find(x => x.c === i.color) || p.colores[0];
    const key = esc(lineaKey(i));
    return `<li class="drawer-item" style="animation-delay:${Math.min(k * 0.05, 0.3)}s">
      ${fotoHTML(c, `${p.nombre} en ${colorDe(c.c).nombre}`, 0.8)}
      <div class="drawer-item-info">
        <p class="drawer-item-nombre">${esc(p.nombre)}</p>
        <p class="drawer-item-var"><span class="dot" style="--sw:${colorDe(c.c).hex}"></span>${esc(colorDe(c.c).nombre)} · Talle ${esc(i.talle)}</p>
        <div class="drawer-item-fila">
          <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-carrito-menos="${key}" aria-label="Uno menos"${i.qty <= 1 ? ' disabled' : ''}>${icono('i-menos')}</button><span class="stepper-n">${i.qty}</span><button type="button" data-carrito-mas="${key}" aria-label="Uno más"${i.qty >= p.stock ? ' disabled' : ''}>${icono('i-mas')}</button></div>
          <b class="drawer-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</b>
        </div>
        <button type="button" class="drawer-quitar" data-quitar="${key}">Quitar</button>
      </div>
    </li>`;
  }).join('');
  aplicarRecortes(lista);
  const total = Cart.total();
  $('[data-drawer-total]', d).textContent = formatearPrecio(total);
  const lineas = items.map(i => {
    const p = prods.get(i.id);
    return p ? `• ${i.qty} × ${p.nombre} · ${colorDe(i.color).nombre} · talle ${i.talle} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  const wsp = $('[data-drawer-wsp]', d);
  if (wsp) wsp.href = wspHref(`Hola SHAMMAH! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}`);
}

function initCarrito() {
  const d = $('#drawer');
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const menos = e.target.closest('[data-carrito-menos]');
    const mas = e.target.closest('[data-carrito-mas]');
    const quitar = e.target.closest('[data-quitar]');
    const ir = e.target.closest('[data-carrito-ir]');
    if (menos || mas) {
      const key = (menos || mas).dataset.carritoMenos || (menos || mas).dataset.carritoMas;
      const attr = menos ? 'data-carrito-menos' : 'data-carrito-mas';
      Cart.setQty(key, Cart.qtyDe(key) + (mas ? 1 : -1));
      pintarCarrito();
      const nuevo = [...d.querySelectorAll(`[${attr}]`)].find(b => b.getAttribute(attr) === key);
      (nuevo && !nuevo.disabled ? nuevo : d.querySelector('.drawer-panel'))?.focus();
      return;
    }
    if (quitar) {
      Cart.remove(quitar.dataset.quitar);
      pintarCarrito();
      d.querySelector('.drawer-panel')?.focus();
      showToast('Listo, la sacamos del carrito');
      return;
    }
    if (ir) {
      cerrarCarrito();
      irA(ir.dataset.carritoIr);
      return;
    }
    if (e.target.closest('[data-checkout]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  d.addEventListener('keydown', e => atraparFoco(d, e));
}

const QV = { p: null, color: null, talle: null, qty: 1, opener: null };

function abrirQuick(id, color, opener) {
  const m = $('#quick');
  const p = getProducto(id);
  if (!m || !p) return;
  const yaAbierto = !m.hidden;
  QV.p = p;
  QV.color = p.colores.some(c => c.c === color) ? color : p.colores[0].c;
  QV.talle = talleMioPara(p);
  QV.qty = 1;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  $$('[data-tray]:not([hidden])').forEach(t => { t.hidden = true; });
  pintarQuick();
  m.hidden = false;
  document.body.classList.add('no-scroll');
  const panel = m.querySelector('.modal-panel');
  if (panel) { panel.scrollTop = 0; panel.focus(); }
  aplicarRecortes(m);
}

function cerrarQuick() {
  const m = $('#quick');
  if (!m || m.hidden) return;
  m.hidden = true;
  if (!$('#drawer') || $('#drawer').hidden) document.body.classList.remove('no-scroll');
  QV.opener?.focus?.();
}

function pintarQuick() {
  const cont = $('[data-qv]');
  const { p, color, talle, qty } = QV;
  if (!cont || !p) return;
  const c = p.colores.find(x => x.c === color) || p.colores[0];
  const sis = SISTEMA[p.cat];
  const mio = talleMioPara(p);
  const rel = Servidor.relacionados(p.id, 3);
  const nombreColor = colorDe(c.c).nombre;
  const msg = `Hola SHAMMAH! Quiero consultar por ${p.nombre} en ${nombreColor.toLowerCase()}${talle ? `, talle ${talle}` : ''}.`;
  const notaTalle = sis === 'corpino'
    ? `Copas ${listaY(p.copas || [])}.${p.cat !== 'corpino' ? ` La bombacha viene en el talle que le corresponde${talle ? ` (${talle} → ${EQUIV[talle]})` : ' (por ejemplo, 90 → M)'}.` : ''} `
    : '';
  cont.innerHTML = `
    <div class="qv-galeria">
      <div class="qv-foto">${fotoHTML(c, `${p.nombre} en ${nombreColor}`, 0.75)}${badgesHTML(p)}</div>
      ${p.colores.length > 1 ? `<div class="qv-minis" role="group" aria-label="Fotos por color">${p.colores.map(x => `<button type="button" class="qv-mini" data-qv-color="${x.c}" aria-pressed="${x.c === c.c}" aria-label="Ver en ${esc(colorDe(x.c).nombre)}">${fotoHTML(x, '', 0.8)}</button>`).join('')}</div>` : ''}
    </div>
    <div class="qv-info">
      <p class="qv-meta">${esc(catDe(p.cat).uno)} · ${esc(LINEAS[p.linea])}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio">${precioHTML(p)}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <div>
        <p class="qv-grupo-tit">Color: <span>${esc(nombreColor)}</span></p>
        <div class="qv-colores" role="group" aria-label="Elegí el color">${p.colores.map(x => `<button type="button" class="chip-color" data-qv-color="${x.c}" aria-pressed="${x.c === c.c}"><span class="dot" style="--sw:${colorDe(x.c).hex}"></span>${esc(colorDe(x.c).nombre)}</button>`).join('')}</div>
      </div>
      <div>
        <p class="qv-grupo-tit">${sis === 'corpino' ? 'Talle de corpiño' : 'Talle'}${talle ? `: <span>${esc(talle)}</span>` : ''}${mio ? ' <span>· el punto marca tu talle según la guía</span>' : ''}</p>
        <div class="qv-talles" role="group" aria-label="Elegí el talle">${p.talles.map(t => `<button type="button" class="chip-talle${t === mio ? ' es-tuyo' : ''}" data-qv-talle="${t}" aria-pressed="${t === talle}">${t}</button>`).join('')}</div>
      </div>
      <p class="qv-nota">${esc(notaTalle)}<button type="button" data-ir-talle>¿No sabés tu talle? Calculalo en un minuto</button></p>
      <div class="qv-acciones">
        <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-menos aria-label="Uno menos"${qty <= 1 ? ' disabled' : ''}>${icono('i-menos')}</button><span class="stepper-n">${qty}</span><button type="button" data-qv-mas aria-label="Uno más"${qty >= p.stock ? ' disabled' : ''}>${icono('i-mas')}</button></div>
        <button type="button" class="btn btn--cta" data-qv-agregar>${icono('i-carrito-mas')}Agregar al carrito</button>
        <button type="button" class="btn btn--line qv-comprar" data-qv-comprar>Comprar ahora</button>
      </div>
      <a class="qv-wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${icono('i-wsp')}Preguntar por esta prenda</a>
      <p class="qv-pagos">Pagás con Mercado Pago, transferencia o efectivo.</p>
    </div>
    ${rel.length ? `<div class="qv-rel"><p class="qv-rel-tit">También te puede interesar</p><div class="qv-rel-lista">${rel.map(r => `<button type="button" class="qv-rel-item" data-quick="${r.id}">${fotoHTML(r.colores[0], '', 0.75)}<span class="qv-rel-nombre">${esc(r.nombre)}</span><span class="qv-rel-precio">${formatearPrecio(precioFinal(r))}</span></button>`).join('')}</div></div>` : ''}`;
  aplicarRecortes(cont);
}

function initQuick() {
  const m = $('#quick');
  if (!m) return;
  m.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-modal]')) { cerrarQuick(); return; }
    const { p } = QV;
    if (!p) return;
    const enfocar = sel => m.querySelector(sel)?.focus();
    const col = e.target.closest('[data-qv-color]');
    if (col) {
      QV.color = col.dataset.qvColor;
      const cual = col.classList.contains('qv-mini') ? 'qv-mini' : 'chip-color';
      pintarQuick();
      enfocar(`.${cual}[data-qv-color="${QV.color}"]`);
      return;
    }
    const tal = e.target.closest('[data-qv-talle]');
    if (tal) {
      QV.talle = tal.dataset.qvTalle;
      pintarQuick();
      enfocar(`[data-qv-talle="${QV.talle}"]`);
      return;
    }
    if (e.target.closest('[data-qv-menos]') || e.target.closest('[data-qv-mas]')) {
      const mas = !!e.target.closest('[data-qv-mas]');
      QV.qty = Math.max(1, Math.min(QV.qty + (mas ? 1 : -1), p.stock || 1));
      pintarQuick();
      const b = m.querySelector(mas ? '[data-qv-mas]' : '[data-qv-menos]');
      (b && !b.disabled ? b : m.querySelector('[data-qv-agregar]'))?.focus();
      return;
    }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (!QV.talle) {
        showToast('Elegí tu talle primero');
        m.querySelector('[data-qv-talle]')?.focus();
        return;
      }
      const ok = agregarAlCarrito(p, QV.color, QV.talle, QV.qty, false);
      if (ok && comprar) {
        cerrarQuick();
        abrirCarrito();
      }
      return;
    }
    if (e.target.closest('[data-ir-talle]')) {
      cerrarQuick();
      irA('#talle');
    }
  });
  m.addEventListener('keydown', e => atraparFoco(m, e));
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', cont).filter(el => el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden');
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !cont.contains(document.activeElement) || document.activeElement === cont.querySelector('[tabindex="-1"]'))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#quick')?.hidden) { cerrarQuick(); return; }
  if (!$('#drawer')?.hidden) { cerrarCarrito(); return; }
  if ($('#filtros')?.classList.contains('abierto')) cerrarFiltros();
});

function calcularTalle(bajo, busto, cadera) {
  const avisos = [];
  let corpino = null;
  if (bajo <= 72) corpino = '85';
  else if (bajo <= 77) corpino = '90';
  else if (bajo <= 82) corpino = '95';
  else if (bajo <= 87) corpino = '100';
  else if (bajo <= 92) corpino = '105';
  if (bajo < 66) avisos.push('Tu bajo busto es menor que nuestro 85: escribinos y te decimos qué modelos te ajustan bien.');
  if (!corpino) avisos.push('Tu bajo busto pide un talle 110: lo vemos juntas por WhatsApp.');
  else if ([72, 73, 77, 78, 82, 83, 87, 88].includes(bajo)) avisos.push('Estás justo entre dos talles: si te gusta más suelto, elegí el más grande; el corpiño también ajusta con los broches.');
  const dif = busto - bajo;
  let copa = 'A';
  if (dif >= 18) copa = 'D';
  else if (dif >= 16) copa = 'C';
  else if (dif >= 14) copa = 'B';
  if (dif < 11) avisos.push('La diferencia entre busto y bajo busto es chica: revisá las medidas o consultanos.');
  if (dif >= 20) avisos.push('Tu copa es más grande que la D: escribinos y te asesoramos.');
  const letra = (v, tabla) => {
    if (v > tabla[tabla.length - 1][2]) return null;
    return (tabla.find(([, , b]) => v <= b) || tabla[0])[0];
  };
  const bombacha = letra(cadera, TABLA_CADERA);
  const porBusto = letra(busto, TABLA_BUSTO);
  if (!bombacha) avisos.push('Tu cadera pide un talle más grande que el XXL: consultanos por WhatsApp.');
  const noche = !bombacha || !porBusto ? null : (TALLES_LETRA.indexOf(porBusto) > TALLES_LETRA.indexOf(bombacha) ? porBusto : bombacha);
  return { corpino, copa: corpino ? copa : null, bombacha, noche, avisos };
}

function initTalle() {
  const root = $('[data-talle]');
  if (!root) return;
  const medidas = { bajo: 74, busto: 90, cadera: 98 };
  const guardadas = (() => {
    try { return JSON.parse(localStorage.getItem('shammah_medidas')); } catch { return null; }
  })();
  if (guardadas && ['bajo', 'busto', 'cadera'].every(k => Number.isFinite(guardadas[k]))) {
    medidas.bajo = Math.min(98, Math.max(64, guardadas.bajo));
    medidas.busto = Math.min(122, Math.max(76, guardadas.busto));
    medidas.cadera = Math.min(122, Math.max(84, guardadas.cadera));
  }
  let modo = 'medir';
  let elegido = { corpino: '90', copa: 'C', bombacha: 'M', noche: 'M' };
  let res = null;

  const tbCorpino = $('[data-tabla-corpino]', root);
  if (tbCorpino) tbCorpino.innerHTML = TABLA_CORPINO.map(([t, a, b]) => `<tr data-fila-corpino="${t}"><td>${t}</td><td>${a} a ${b} cm</td><td>${EQUIV[t]}</td></tr>`).join('');
  const tbCopa = $('[data-tabla-copa]', root);
  if (tbCopa) tbCopa.innerHTML = TABLA_COPA.map(([c, a, b]) => `<tr data-fila-copa="${c}"><td>${c}</td><td>${a} a ${b} cm</td></tr>`).join('');
  const tbLetra = $('[data-tabla-letra]', root);
  if (tbLetra) tbLetra.innerHTML = TABLA_CADERA.map(([t, a, b]) => `<tr data-fila-letra="${t}"><td>${t}</td><td>${a} a ${b} cm</td></tr>`).join('');

  const chipsSe = (sel, lista, clave) => {
    const cont = $(`[data-se="${sel}"]`, root);
    if (!cont) return;
    cont.innerHTML = lista.map(t => `<button type="button" class="chip-talle" data-se-${sel}="${t}" aria-pressed="${elegido[clave] === t}">${t}</button>`).join('');
  };
  const pintarChipsSe = () => {
    chipsSe('corpino', TALLES_CORPINO, 'corpino');
    chipsSe('copa', COPAS, 'copa');
    chipsSe('letra', TALLES_LETRA, 'bombacha');
  };

  const escalas = {
    bajo: () => TABLA_CORPINO.map(([t, a, b]) => [t, (a + b) / 2]),
    busto: () => [80, 90, 100, 110, 120].map(v => [String(v), v]),
    cadera: () => TABLA_CADERA.map(([t, a, b]) => [t, (a + b) / 2])
  };
  const marcaActiva = { bajo: () => res?.corpino, busto: () => null, cadera: () => res?.bombacha };

  const pintarMedida = (clave, animar) => {
    const box = $(`[data-medida="${clave}"]`, root);
    if (!box) return;
    const rango = $('[data-rango]', box);
    const v = medidas[clave];
    rango.value = v;
    const min = Number(rango.min);
    const max = Number(rango.max);
    rango.style.setProperty('--fill', `${((v - min) / (max - min)) * 100}%`);
    rango.setAttribute('aria-valuetext', `${v} centímetros`);
    const val = $('[data-medida-valor]', box);
    if (val && val.textContent !== String(v)) {
      val.textContent = v;
      if (animar) { const pv = val.parentElement; pv.classList.remove('cambia'); void pv.offsetWidth; pv.classList.add('cambia'); }
    }
    const esc2 = $(`[data-escala="${clave}"]`, box);
    if (esc2) {
      const activa = marcaActiva[clave]();
      esc2.innerHTML = escalas[clave]().filter(([, x]) => x >= min && x <= max).map(([t, x]) => `<span class="${t === activa ? 'on' : ''}" style="left:${((x - min) / (max - min)) * 100}%">${t}</span>`).join('');
    }
  };

  const valorAnim = (el, txt) => {
    if (!el || el.textContent === txt) return;
    el.textContent = txt;
    el.classList.remove('cambia'); void el.offsetWidth; el.classList.add('cambia');
  };

  const calcular = animar => {
    if (modo === 'medir') res = calcularTalle(medidas.bajo, medidas.busto, medidas.cadera);
    else res = { ...elegido, avisos: [] };
    ['bajo', 'busto', 'cadera'].forEach(k => pintarMedida(k, animar));
    const pill = $('[data-copa-pill]', root);
    if (pill) pill.textContent = res.copa ? `copa ${res.copa}` : 'copa —';
    valorAnim($('[data-res-corpino]', root), res.corpino ? `${res.corpino} ${res.copa || ''}`.trim() : 'Consultanos');
    valorAnim($('[data-res-bombacha]', root), res.bombacha || '—');
    valorAnim($('[data-res-noche]', root), res.noche || '—');
    const aviso = $('[data-res-aviso]', root);
    if (aviso) { aviso.textContent = res.avisos[0] || ''; aviso.hidden = !res.avisos.length; }
    $$('[data-fila-corpino]', root).forEach(tr => tr.classList.toggle('on', tr.dataset.filaCorpino === res.corpino));
    $$('[data-fila-copa]', root).forEach(tr => tr.classList.toggle('on', tr.dataset.filaCopa === res.copa));
    $$('[data-fila-letra]', root).forEach(tr => tr.classList.toggle('on', tr.dataset.filaLetra === res.bombacha));
    const mt = { corpino: res.corpino, copa: res.copa, bombacha: res.bombacha, noche: res.noche };
    const m = Servidor.miTalle(mt, 3);
    const ver = $('[data-res-ver]', root);
    if (ver) {
      ver.disabled = !m.total;
      if (!m.total) ver.textContent = 'Sin prendas en ese talle por ahora';
      else if (m.total === Servidor.resumen().total) ver.textContent = `Todo el taller viene en tu talle: ver las ${m.total}`;
      else ver.textContent = `Ver ${cuantos(m.total, 'prenda', 'prendas')} en tu talle`;
    }
    const thumbs = $('[data-res-thumbs]', root);
    if (thumbs) {
      thumbs.innerHTML = m.ejemplos.map(p => `<li><button type="button" class="res-thumb" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p.colores[0], '', 0.8)}</button></li>`).join('');
      aplicarRecortes(thumbs);
    }
    const wsp = $('[data-res-wsp]', root);
    if (wsp) {
      const base = modo === 'medir'
        ? `Me medí: bajo busto ${medidas.bajo} cm, busto ${medidas.busto} cm y cadera ${medidas.cadera} cm.`
        : 'Ya sé mi talle.';
      const tal = `${res.corpino ? `Corpiño ${res.corpino}${res.copa ? ' copa ' + res.copa : ''}` : 'Corpiño: no me da en la tabla'}${res.bombacha ? `, bombacha ${res.bombacha}` : ''}.`;
      wsp.href = wspHref(`Hola SHAMMAH! ${base} ${tal} ¿Me ayudan a elegir?`);
    }
    if (!animar) return;
    try {
      localStorage.setItem('shammah_talle', JSON.stringify(mt));
      if (modo === 'medir') localStorage.setItem('shammah_medidas', JSON.stringify(medidas));
    } catch { return; }
  };

  $$('[data-medida]', root).forEach(box => {
    const clave = box.dataset.medida;
    const rango = $('[data-rango]', box);
    rango.addEventListener('input', () => { medidas[clave] = Number(rango.value); calcular(true); });
    $$('[data-paso]', box).forEach(b => b.addEventListener('click', () => {
      const v = Math.min(Number(rango.max), Math.max(Number(rango.min), medidas[clave] + Number(b.dataset.paso)));
      if (v === medidas[clave]) return;
      medidas[clave] = v;
      calcular(true);
    }));
  });

  $$('[data-talle-modo]', root).forEach(b => b.addEventListener('click', () => {
    modo = b.dataset.talleModo;
    $$('[data-talle-modo]', root).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-talle-panel]', root).forEach(p => { p.hidden = p.dataset.tallePanel !== modo; });
    if (modo === 'se' && res) elegido = { corpino: res.corpino || '90', copa: res.copa || 'B', bombacha: res.bombacha || 'M', noche: res.noche || res.bombacha || 'M' };
    pintarChipsSe();
    calcular(false);
    refrescarScroll();
  }));

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-se-corpino], [data-se-copa], [data-se-letra]');
    if (!b) return;
    if (b.dataset.seCorpino) elegido.corpino = b.dataset.seCorpino;
    if (b.dataset.seCopa) elegido.copa = b.dataset.seCopa;
    if (b.dataset.seLetra) { elegido.bombacha = b.dataset.seLetra; elegido.noche = b.dataset.seLetra; }
    const attr = [...b.attributes].find(a => a.name.startsWith('data-se-'));
    pintarChipsSe();
    calcular(true);
    if (attr) root.querySelector(`[${attr.name}="${attr.value}"]`)?.focus();
  });

  $('[data-res-ver]', root)?.addEventListener('click', () => {
    if (!res) return;
    filtrarYMostrar({ mt: { corpino: res.corpino, copa: res.copa, bombacha: res.bombacha, noche: res.noche } });
  });

  pintarChipsSe();
  calcular(false);
}

function initAbanico() {
  const ab = $('[data-abanico]');
  if (!ab) return;
  const cartas = $$('.carta', ab);
  if (!cartas.length) return;
  const resumen = Servidor.porColor();
  const dato = $('[data-ab-dato]', ab);
  const mqCelu = window.matchMedia('(max-width: 760px)');
  let activo = -1;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    ab.classList.add('listo');
    const io = new IntersectionObserver(es => {
      if (es.some(x => x.isIntersecting)) { ab.classList.add('entro'); io.disconnect(); }
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    io.observe(ab);
  }

  const pintarDato = i => {
    const d = AB_DATOS[i];
    const c = colorDe(d.color);
    const r = resumen[d.color] || { total: 0, desde: 0 };
    const rangos = [r.corpino ? `${r.corpino[0]} a ${r.corpino[1]}` : '', r.letras ? `${r.letras[0]} a ${r.letras[1]}` : ''].filter(Boolean).join(' y ');
    $('[data-ab-i]', ab).textContent = String(i + 1).padStart(2, '0');
    $('[data-ab-frase]', ab).textContent = d.frase;
    $('[data-ab-color]', ab).textContent = c.nombre;
    $('[data-ab-sw]', ab).style.setProperty('--sw', c.hex);
    $('[data-ab-info]', ab).textContent = `${cuantos(r.total, 'modelo', 'modelos')} en ${c.nombre.toLowerCase()} · talles ${rangos} · desde ${formatearPrecio(r.desde)}`;
    const ver = $('[data-ab-ver]', ab);
    ver.href = `?color=${d.color}#tienda`;
    ver.textContent = r.total === 1 ? `Ver el modelo en ${c.nombre.toLowerCase()}` : `Ver los ${r.total} en ${c.nombre.toLowerCase()}`;
    $('[data-ab-wsp]', ab).href = wspHref(`Hola SHAMMAH! Quiero ver lo que tienen en ${c.nombre.toLowerCase()}.`);
    ab.style.setProperty('--halo', c.hex);
    if (dato) { dato.classList.remove('cambia'); void dato.offsetWidth; dato.classList.add('cambia'); }
  };

  const setActivo = i => {
    if (i === activo) return;
    activo = i;
    cartas.forEach((c, k) => {
      c.classList.toggle('activa', k === i);
      c.style.setProperty('--zi', String(20 - Math.abs(k - i) * 2 + (k > i ? 0 : 1)));
      c.querySelector('.carta-btn')?.setAttribute('aria-pressed', String(k === i));
    });
    pintarDato(i);
  };

  const abrir = o => {
    const paso = mqCelu.matches ? 12 : 14;
    cartas.forEach((c, k) => c.style.setProperty('--rot', `${((k - (cartas.length - 1) / 2) * paso * o).toFixed(2)}deg`));
  };

  if (reduceMotion) {
    ab.classList.add('is-static');
    abrir(1);
    setActivo(0);
    cartas.forEach((c, k) => c.querySelector('.carta-btn')?.addEventListener('click', () => setActivo(k)));
    return;
  }

  const suave = t => 1 - Math.pow(1 - t, 3);
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = ab.getBoundingClientRect();
    const off = offsetBarra();
    const recorrido = r.height - (window.innerHeight - off);
    const p = recorrido > 0 ? clamp01((off - r.top) / recorrido) : 0;
    if (r.top < window.innerHeight * 0.8) ab.classList.add('entro');
    abrir(suave(clamp01(p / 0.16)));
    setActivo(Math.min(cartas.length - 1, Math.max(0, Math.floor(((p - 0.16) / 0.84) * cartas.length))));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  cartas.forEach((c, k) => c.querySelector('.carta-btn')?.addEventListener('click', () => {
    const r = ab.getBoundingClientRect();
    const off = offsetBarra();
    const recorrido = r.height - (window.innerHeight - off);
    const objetivo = 0.16 + ((k + 0.5) / cartas.length) * 0.84;
    window.scrollTo({ top: window.scrollY + r.top - off + objetivo * recorrido, behavior: 'smooth' });
  }));
  abrir(0);
  setActivo(0);
  update();
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
    .from(hero.querySelectorAll('.muestrario, .por-talle'), { opacity: 0, duration: 0.9, clearProps: 'opacity' }, 0.62)
    .from(hero.querySelectorAll('.muestra, .por-talle-fila'), { y: 16, opacity: 0, duration: 1, stagger: 0.07, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  $$('.col-arco img, .hero--m1 .hero-foto img').forEach(img => {
    gsap.fromTo(img, { '--py': '-3%' }, {
      '--py': '3%',
      ease: 'none',
      scrollTrigger: { trigger: img.closest('.col-arco, .hero-foto'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

function initResize() {
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { aplicarRecortes(); refrescarScroll(); }, 160);
  }, { passive: true });
  window.addEventListener('load', () => aplicarRecortes());
}

initModelBarScroll();
initNav();
initColecciones();
initTienda();
initTarjetas();
initTalle();
initAbanico();
initCarrito();
initQuick();
initEnlacesFiltro();
initFloats();
aplicarRecortes();
initReveals();
initHeroMotion();
initParallax();
initResize();
updateCartBadge();
