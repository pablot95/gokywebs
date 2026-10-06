const WSP = '5491153409379';
const MIN_COMPRA = 80000;
const API_MAX = 100;
const PASO = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esModelo2 = document.body.classList.contains('m2');

const FOTOS = {
  dormitorio: ['dormitorio-16x9.webp', 1672, 941, 'Dormitorio con sábanas blancas, manta tejida bordó, mantas dobladas en un estante y alfombras'],
  cama: ['cama-9x16.webp', 941, 1672, 'Cama tendida con acolchado blanco, manta rosa viejo y sábanas floreadas'],
  sabanas: ['sabanas-1x1.webp', 1254, 1254, 'Pila de sábanas blancas, floreadas, rosas y frambuesa'],
  mantas: ['mantas-1x1.webp', 1254, 1254, 'Mantas de piel sintética, corderito y tejida sobre un sillón'],
  alfombra: ['alfombra-1x1.webp', 1254, 1254, 'Alfombra clásica crema con medallón y guarda frambuesa'],
  surtido: ['surtido-1x1.webp', 1254, 1254, 'Sábanas dobladas, mantas enrolladas y una manta rayada con flecos']
};

const CATS = { sabanas: 'Sábanas', mantas: 'Mantas', alfombras: 'Alfombras' };

const TELAS = {
  percal: 'Percal 200 hilos',
  algodon: 'Algodón 180 hilos',
  microfibra: 'Microfibra',
  polar: 'Polar soft',
  corderito: 'Corderito',
  piel: 'Piel sintética',
  tejida: 'Tejida',
  flannel: 'Flannel',
  plush: 'Plush',
  clasica: 'Clásica',
  shaggy: 'Shaggy',
  natural: 'Tejido natural'
};

const CAMAS = {
  1: { n: '1 plaza', w: 80, l: 190 },
  15: { n: '1 ½ plaza', w: 100, l: 190 },
  2: { n: '2 plazas', w: 140, l: 190 },
  q: { n: 'Queen', w: 160, l: 200 },
  k: { n: 'King', w: 200, l: 200 }
};
const TODAS = ['1', '15', '2', 'q', 'k'];

const MED = {
  s15: { n: '1 ½ plaza', camas: ['1', '15'], aj: [100, 190], pl: [180, 250], fundas: 1 },
  s25: { n: '2 ½ plazas', camas: ['2'], aj: [140, 190], pl: [230, 250], fundas: 2 },
  sq: { n: 'Queen', camas: ['q'], aj: [160, 200], pl: [250, 260], fundas: 2 },
  sk: { n: 'King', camas: ['k'], aj: [200, 200], pl: [290, 270], fundas: 2 },
  m130: { n: '130 × 170', camas: TODAS, txt: 'Para el sillón o los pies de la cama' },
  m150: { n: '150 × 200', camas: ['1', '15'], txt: 'Para 1 y 1 ½ plaza' },
  m200: { n: '200 × 220', camas: ['2'], txt: 'Para 2 plazas' },
  m220: { n: '220 × 240', camas: ['q'], txt: 'Para Queen' },
  m240: { n: '240 × 260', camas: ['k'], txt: 'Para King' },
  a60: { n: '60 × 120', camas: TODAS, txt: 'Para los pies de la cama o la entrada' },
  a100: { n: '100 × 150', camas: ['1', '15'], txt: 'Para el costado de la cama' },
  a120: { n: '120 × 170', camas: ['1', '15'], txt: 'Debajo de 1 o 1 ½ plaza' },
  a160: { n: '160 × 230', camas: ['2', 'q'], txt: 'Debajo de 2 plazas o Queen' },
  a200: { n: '200 × 290', camas: ['q', 'k'], txt: 'Debajo de Queen o King' }
};

const JUEGOS = (s15, s25, sq, sk) => ({ s15, s25, sq, sk });

const PRODUCTOS = [
  { id: 'percal-blanco', nombre: 'Juego de sábanas percal 200 hilos blanco', cat: 'sabanas', tela: 'percal', bolsillo: 35, foto: 'sabanas', foco: [0.43, 0.3, 1.9], vars: JUEGOS(34900, 41900, 46900, 52900), rank: 1, top: true, desc: 'Percal de algodón de 200 hilos con vainilla de tres líneas en el doblez. Trae sábana ajustable con elástico en todo el contorno, sábana plana y fundas.', tags: 'blanco blanca liso lisa hotel vainilla' },
  { id: 'chunky-bordo', nombre: 'Manta tejida gruesa bordó con flecos', cat: 'mantas', tela: 'tejida', foto: 'dormitorio', foco: [0.69, 0.56, 2], vars: { m130: 39900 }, rank: 2, desc: 'Tejido grueso y suave, con flecos en las puntas. Va a los pies de la cama o sobre el sillón.', tags: 'bordo tejido grueso chunky flecos pie de cama' },
  { id: 'clasica-medallon', nombre: 'Alfombra clásica Medallón crema y frambuesa', cat: 'alfombras', tela: 'clasica', foto: 'alfombra', foco: [0.5, 0.6, 1.15], vars: { a120: 54900, a160: 89900, a200: 139900 }, rank: 3, desc: 'Medallón central y guarda floral en frambuesa sobre fondo crema. Pelo corto, para el living o el dormitorio.', tags: 'persa living dormitorio clasica medallon crema' },
  { id: 'piel-rosa', nombre: 'Manta de piel sintética rosa', cat: 'mantas', tela: 'piel', foto: 'mantas', foco: [0.63, 0.56, 1.3], vars: { m150: 45900, m200: 59900 }, rank: 4, nuevo: true, desc: 'Pelo largo y suave que pasa del blanco al rosa. Para la cama o el sillón.', tags: 'piel pelo largo peluda rosa blanca' },
  { id: 'micro-ramitas', nombre: 'Juego de sábanas microfibra Ramitas', cat: 'sabanas', tela: 'microfibra', bolsillo: 30, foto: 'surtido', foco: [0.28, 0.31, 2.4], vars: JUEGOS(15900, 18900, 21900, 24900), rank: 5, desc: 'Microfibra estampada con ramitas rosas sobre fondo blanco. Trae ajustable, plana y fundas.', tags: 'estampada estampado floreada flores ramitas' },
  { id: 'shaggy-rosa', nombre: 'Alfombra shaggy rosa de pelo largo', cat: 'alfombras', tela: 'shaggy', foto: 'dormitorio', foco: [0.78, 0.93, 2.1], vars: { a120: 49900, a160: 84900 }, rank: 6, desc: 'Pelo largo y mullido en rosa, para el costado de la cama o el living.', tags: 'peluda pelo largo rosa shaggy' },
  { id: 'corderito-crudo', nombre: 'Manta corderito crudo', cat: 'mantas', tela: 'corderito', foto: 'mantas', foco: [0.27, 0.35, 2.6], vars: { m150: 32900, m200: 39900, m220: 45900 }, rank: 7, desc: 'Corderito de rulo cerrado en color crudo, con reverso suave.', tags: 'sherpa corderito crudo blanco abrigo' },
  { id: 'estampado-cerezo', nombre: 'Juego de sábanas Flor de cerezo', cat: 'sabanas', tela: 'algodon', bolsillo: 30, foto: 'sabanas', foco: [0.52, 0.53, 2.3], vars: JUEGOS(28900, 33900, 37900, 41900), descuento: 10, rank: 8, desc: 'Algodón de 180 hilos estampado con ramas de cerezo en rojo y rosa sobre blanco.', tags: 'estampada estampado floreada flores cerezo roja' },
  { id: 'guarda-floral', nombre: 'Alfombra Guarda floral para pie de cama', cat: 'alfombras', tela: 'clasica', foto: 'alfombra', foco: [0.8, 0.8, 2.6], vars: { a60: 19900, a100: 34900 }, rank: 9, desc: 'La guarda floral de la Medallón en formato chico, para los pies de la cama o la entrada.', tags: 'pie de cama entrada chica guarda floral' },
  { id: 'percal-rosa', nombre: 'Juego de sábanas percal 200 hilos rosa', cat: 'sabanas', tela: 'percal', bolsillo: 35, foto: 'sabanas', foco: [0.8, 0.34, 2.1], vars: JUEGOS(34900, 41900, 46900, 52900), rank: 10, nuevo: true, desc: 'El mismo percal de 200 hilos con vainilla de tres líneas, en rosa empolvado.', tags: 'rosa empolvado liso lisa vainilla' },
  { id: 'tejida-frambuesa', nombre: 'Manta tejida trenzada frambuesa', cat: 'mantas', tela: 'tejida', foto: 'mantas', foco: [0.22, 0.44, 2.8], vars: { m130: 34900 }, rank: 11, desc: 'Tejido trenzado grueso en frambuesa, para los pies de la cama o el sillón.', tags: 'trenzada tejida frambuesa bordo roja' },
  { id: 'micro-rosa', nombre: 'Juego de sábanas microfibra lisa rosa', cat: 'sabanas', tela: 'microfibra', bolsillo: 30, foto: 'surtido', foco: [0.3, 0.405, 2.8], vars: JUEGOS(14900, 17900, 19900, 22900), rank: 12, desc: 'Microfibra lisa en rosa, con ajustable, plana y fundas.', tags: 'lisa liso rosa economica' },
  { id: 'natural-tejida', nombre: 'Alfombra tejida natural', cat: 'alfombras', tela: 'natural', foto: 'dormitorio', foco: [0.33, 0.86, 2], vars: { a120: 39900, a160: 64900 }, rank: 13, desc: 'Tejido plano de trama gruesa en crudo y beige.', tags: 'yute natural beige cruda tejida' },
  { id: 'polar-rosa', nombre: 'Manta polar soft rosa', cat: 'mantas', tela: 'polar', foto: 'dormitorio', foco: [0.1, 0.39, 2.2], vars: { m150: 12900, m200: 15900, m220: 18900 }, rank: 14, desc: 'Polar soft liviano en rosa, en tres medidas.', tags: 'polar soft liviana rosa economica' },
  { id: 'algodon-frambuesa', nombre: 'Juego de sábanas algodón 180 hilos frambuesa', cat: 'sabanas', tela: 'algodon', bolsillo: 30, foto: 'sabanas', foco: [0.55, 0.8, 2.4], vars: JUEGOS(26900, 31900, 35900, 39900), rank: 15, desc: 'Algodón de 180 hilos en frambuesa, con vainilla en el doblez.', tags: 'frambuesa bordo roja lisa liso' },
  { id: 'sherpa-rosa', nombre: 'Manta sherpa rosa', cat: 'mantas', tela: 'corderito', foto: 'surtido', foco: [0.78, 0.41, 2.6], vars: { m150: 27900, m200: 33900 }, rank: 16, desc: 'Sherpa de rulo suave en rosa, abrigada y liviana.', tags: 'sherpa corderito rosa' },
  { id: 'persa-rosa', nombre: 'Alfombra persa rosa y bordó', cat: 'alfombras', tela: 'clasica', foto: 'cama', foco: [0.5, 0.94, 2], vars: { a160: 79900, a200: 124900 }, rank: 17, desc: 'Diseño persa en rosa, bordó y crema, para debajo de la cama.', tags: 'persa clasica rosa bordo' },
  { id: 'micro-cuadros', nombre: 'Juego de sábanas microfibra Cuadrillé', cat: 'sabanas', tela: 'microfibra', bolsillo: 30, foto: 'surtido', foco: [0.3, 0.47, 3], vars: JUEGOS(15900, 18900, 21900, 24900), rank: 18, desc: 'Microfibra blanca con cuadrillé rosa. Trae ajustable, plana y fundas.', tags: 'cuadros cuadrille escocesa rosa blanca' },
  { id: 'flannel-floral', nombre: 'Manta flannel floral', cat: 'mantas', tela: 'flannel', foto: 'mantas', foco: [0.36, 0.22, 2.8], vars: { m150: 21900, m200: 26900 }, descuento: 15, rank: 19, desc: 'Flannel suave estampado con flores rosas y frambuesa.', tags: 'flannel floreada flores estampada' },
  { id: 'ajustable-extra', nombre: 'Sábana ajustable bolsillo 40 cm blanca', cat: 'sabanas', tela: 'percal', bolsillo: 40, solo: true, foto: 'sabanas', foco: [0.45, 0.39, 2.6], vars: JUEGOS(16900, 19900, 22900, 25900), rank: 20, desc: 'Solo la sábana ajustable, en percal de 200 hilos, con bolsillo de 40 cm para colchones altos o con pillow.', tags: 'ajustable bajera extra alta pillow colchon alto' },
  { id: 'plush-bordo', nombre: 'Manta plush bordó con relieve', cat: 'mantas', tela: 'plush', foto: 'surtido', foco: [0.8, 0.6, 2.6], vars: { m150: 24900, m200: 29900, m220: 34900 }, rank: 21, desc: 'Plush con relieve en bordó, suave de los dos lados.', tags: 'plush bordo relieve' },
  { id: 'algodon-malva', nombre: 'Juego de sábanas algodón 180 hilos malva', cat: 'sabanas', tela: 'algodon', bolsillo: 35, foto: 'surtido', foco: [0.3, 0.54, 3], vars: JUEGOS(26900, 31900, 35900, 39900), rank: 22, desc: 'Algodón de 180 hilos en malva, con bolsillo de 35 cm.', tags: 'malva rosa viejo lisa liso' },
  { id: 'tejida-rosa', nombre: 'Manta tejida rosa viejo con flecos', cat: 'mantas', tela: 'tejida', foto: 'cama', foco: [0.24, 0.62, 1.6], vars: { m130: 29900 }, rank: 23, desc: 'Tejido de punto en rosa viejo con flecos, para los pies de la cama.', tags: 'tejida rosa viejo flecos pie de cama' },
  { id: 'micro-hojas', nombre: 'Juego de sábanas microfibra Hojas rojas', cat: 'sabanas', tela: 'microfibra', bolsillo: 30, foto: 'surtido', foco: [0.4, 0.66, 2.8], vars: JUEGOS(15900, 18900, 21900, 24900), rank: 24, desc: 'Microfibra blanca con hojas rojas y rosas. Trae ajustable, plana y fundas.', tags: 'estampada estampado hojas roja' },
  { id: 'rayada-flecos', nombre: 'Manta rayada crudo y frambuesa con flecos', cat: 'mantas', tela: 'tejida', foto: 'surtido', foco: [0.72, 0.85, 2.2], vars: { m130: 24900 }, rank: 25, desc: 'Tejido rayado en crudo y frambuesa con flecos anudados.', tags: 'rayada rayas flecos cruda' }
];

const RANGOS = {
  p1: [0, 20000, 'Hasta $20.000'],
  p2: [20000, 40000, '$20.000 a $40.000'],
  p3: [40000, 80000, '$40.000 a $80.000'],
  p4: [80000, Infinity, 'Más de $80.000']
};

const PARADAS = [
  { id: 'polar-rosa', f: [0.13, 0.42], z: 1.35 },
  { id: 'percal-blanco', f: [0.47, 0.45], z: 1.2 },
  { id: 'chunky-bordo', f: [0.68, 0.55], z: 1.35 },
  { id: 'shaggy-rosa', f: [0.78, 0.9], z: 1.45 }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const clamp01 = v => Math.min(1, Math.max(0, v));
const suave = t => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const normal = s => String(s ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/⁄/g, '/').replace(/×/g, 'x').toLowerCase().replace(/(\d)\s*x\s*(\d)/g, '$1x$2').replace(/(\d)\s*1\/2/g, '$1-1/2');
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const cantidad = v => Math.max(1, Math.min(99, Math.floor(Number(v)) || 1));
const varsDe = p => Object.keys(p.vars);
const precioBase = (p, v) => p.vars[v] ?? Math.min(...Object.values(p.vars));
const precioFinal = (p, v) => { const b = precioBase(p, v); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const precioDesde = p => Math.min(...varsDe(p).map(v => precioFinal(p, v)));
const varParaCama = (p, cama) => (cama ? varsDe(p).find(v => MED[v]?.camas.includes(cama)) || null : null);
const nombreVar = v => MED[v]?.n || '';
const lineaDe = p => `${CATS[p.cat]} · ${TELAS[p.tela]}`;
const precioParaFiltro = (p, cama) => { const v = varParaCama(p, cama); return v ? precioFinal(p, v) : precioDesde(p); };
const cuantos = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;

function textoMedida(p, v) {
  const m = MED[v];
  if (!m) return '';
  if (!m.aj) return m.txt;
  const b = p.bolsillo || 30;
  if (p.solo) return `Ajustable ${m.aj[0]} × ${m.aj[1]} × ${b} cm`;
  return `Ajustable ${m.aj[0]} × ${m.aj[1]} × ${b} · plana ${m.pl[0]} × ${m.pl[1]} · ${m.fundas === 1 ? '1 funda' : '2 fundas'}`;
}

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId];
  if (!f) return '';
  const w = f[1];
  const h = f[2];
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

function imgTag(fotoId, alt = '') {
  const f = FOTOS[fotoId];
  return f ? `<img src="images/${f[0]}" width="${f[1]}" height="${f[2]}" alt="${esc(alt)}">` : '';
}

const textos = new Map();
function textoDe(p) {
  if (!textos.has(p.id)) {
    const partes = [p.nombre, CATS[p.cat], TELAS[p.tela], p.desc, p.tags, p.bolsillo ? `bolsillo ${p.bolsillo}` : '', ...varsDe(p).map(v => `${MED[v].n} ${MED[v].txt || ''} ${MED[v].camas.map(c => CAMAS[c].n).join(' ')}`)];
    const texto = normal(partes.join(' '));
    textos.set(p.id, { texto, palabras: texto.split(/[^a-z0-9/]+/).filter(Boolean) });
  }
  return textos.get(p.id);
}

const Servidor = {
  consultar(f = {}) {
    const terminos = normal(f.q || '').split(/\s+/).filter(Boolean);
    const lista = PRODUCTOS.filter(p => {
      if (f.cats?.length && !f.cats.includes(p.cat)) return false;
      if (f.cama && !varParaCama(p, f.cama)) return false;
      if (f.bolsillo && p.cat === 'sabanas' && (p.bolsillo || 30) < f.bolsillo) return false;
      if (f.telas?.length && !f.telas.includes(p.tela)) return false;
      if (f.precios?.length && !f.precios.some(k => { const r = RANGOS[k]; const v = precioParaFiltro(p, f.cama); return r && v >= r[0] && v < r[1]; })) return false;
      if (f.oferta && !(p.descuento > 0)) return false;
      if (terminos.length) {
        const t = textoDe(p);
        if (!terminos.every(w => (w.length <= 2 ? t.palabras.includes(w) : t.texto.includes(w)))) return false;
      }
      return true;
    });
    const precio = p => precioParaFiltro(p, f.cama);
    const orden = f.orden || 'pedidos';
    if (orden === 'menor') lista.sort((a, b) => precio(a) - precio(b) || a.rank - b.rank);
    else if (orden === 'mayor') lista.sort((a, b) => precio(b) - precio(a) || a.rank - b.rank);
    else if (orden === 'nuevos') lista.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    else lista.sort((a, b) => a.rank - b.rank);
    return lista;
  },
  productos(params = {}) {
    const limite = Math.max(1, Math.min(API_MAX, Math.floor(Number(params.limite)) || PASO));
    const desde = Math.max(0, parseInt(params.cursor, 10) || 0);
    const lista = this.consultar(params);
    const items = lista.slice(desde, desde + limite);
    const fin = desde + items.length;
    return { items, total: lista.length, siguiente: fin < lista.length ? String(fin) : null };
  },
  conteo(f = {}) {
    return this.consultar(f).length;
  }
};

const Cart = {
  KEY: 'blanqueriaisrael_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => getProducto(i.id)?.vars[i.v] != null && i.qty > 0) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, v, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); }
};

function calcMedidas(cama, alto) {
  const k = CAMAS[cama] ? cama : '2';
  const c = CAMAS[k];
  const a = Math.max(15, Math.min(38, Number(alto) || 25));
  const r10 = n => Math.ceil(n / 10) * 10;
  const alfombra = { 1: 'a120', 15: 'a120', 2: 'a160', q: 'a200', k: 'a200' }[k];
  const [ra, rb] = MED[alfombra].n.split(' × ').map(Number);
  return {
    cama: k,
    c,
    alto: a,
    bolsillo: a <= 25 ? 30 : a <= 30 ? 35 : 40,
    juego: { 1: 's15', 15: 's15', 2: 's25', q: 'sq', k: 'sk' }[k],
    plana: [r10(c.w + 2 * (a + 15)), r10(c.l + a + 35)],
    manta: { 1: 'm150', 15: 'm150', 2: 'm200', q: 'm220', k: 'm240' }[k],
    alfombra,
    asoma: Math.round((Math.max(ra, rb) - c.w) / 2)
  };
}

function textoPedido(items) {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    return `• ${i.qty} × ${p.nombre} (${nombreVar(i.v)}): ${formatearPrecio(precioFinal(p, i.v) * i.qty)}`;
  });
  return `Hola Blanquería Israel, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(items.reduce((s, i) => s + precioFinal(getProducto(i.id), i.v) * i.qty, 0))}`;
}

function estadoHoy(d = new Date()) {
  const dia = d.getDay();
  const h = d.getHours() + d.getMinutes() / 60;
  if (dia >= 1 && dia <= 4) {
    if (h >= 8 && h < 21) return { t: 'Abierto ahora, hasta las 21 h', abierto: true };
    if (h < 8) return { t: 'Hoy abrimos a las 8 h', abierto: false };
    return { t: dia === 4 ? 'Cerrado ahora · el viernes consultá el horario' : 'Cerrado ahora · mañana abrimos a las 8 h', abierto: false };
  }
  if (dia === 5) return { t: 'Hoy viernes: consultá el horario', abierto: false };
  if (dia === 6) return { t: 'Hoy sábado: cerrado · el domingo abrimos', abierto: false };
  return { t: 'Hoy domingo: abierto', abierto: true };
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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

const ICONO_CARRITO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONO_REGLA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/></svg>';
const ICONO_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

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
  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
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
  const img = hero.querySelector('[data-hero-img] img');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('.pila-h1 .banda'), { x: -36, opacity: 0, duration: 1, stagger: 0.09, clearProps: 'transform,opacity' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.etiqueta'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.orillo'), { y: 16, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
}

function initCabH() {
  const medir = () => {
    const h = [...document.querySelectorAll('.aviso, .site-header')].reduce((s, el) => s + el.offsetHeight, 0);
    if (h) document.documentElement.style.setProperty('--cab-h', `${h}px`);
  };
  medir();
  window.addEventListener('resize', medir, { passive: true });
  document.fonts?.ready?.then(medir);
}

function initRecortesFijos() {
  document.querySelectorAll('[data-recorte]').forEach(el => {
    const foco = (el.dataset.foco || '0.5,0.5,1').split(',').map(Number);
    el.setAttribute('style', recorte(el.dataset.recorte, foco, parseFloat(el.dataset.ar) || 1));
  });
}

function initHoy() {
  const e = estadoHoy();
  document.querySelectorAll('[data-hoy]').forEach(el => {
    el.textContent = e.t;
    el.closest('.aviso__hoy, .etiqueta, .header-m__min')?.classList.toggle('es-abierto', e.abierto);
  });
  const dia = String(new Date().getDay());
  document.querySelectorAll('[data-horario] li').forEach(li => li.classList.toggle('hoy', (li.dataset.dias || '').split(',').includes(dia)));
}

function initPreciosFijos() {
  document.querySelectorAll('[data-desde]').forEach(el => {
    const p = getProducto(el.dataset.desde);
    if (p) el.textContent = formatearPrecio(precioDesde(p));
  });
  document.querySelectorAll('[data-n-cat]').forEach(el => { el.textContent = Servidor.conteo({ cats: [el.dataset.nCat] }); });
}

const FILTRO = { q: '', cats: new Set(), cama: '', bolsillo: 0, telas: new Set(), precios: new Set(), oferta: false, orden: 'pedidos' };
const PAGINA = { siguiente: null, mostrados: 0, total: 0 };
const paramsDeFiltro = () => ({ q: FILTRO.q, cats: [...FILTRO.cats], cama: FILTRO.cama, bolsillo: FILTRO.bolsillo, telas: [...FILTRO.telas], precios: [...FILTRO.precios], oferta: FILTRO.oferta, orden: FILTRO.orden });

function cardHTML(p, animar = true, grande = false) {
  const unica = varsDe(p).length === 1 ? varsDe(p)[0] : null;
  const k = varParaCama(p, FILTRO.cama) || unica;
  const precio = k ? precioFinal(p, k) : precioDesde(p);
  const original = p.descuento > 0 ? (k ? precioBase(p, k) : Math.min(...Object.values(p.vars))) : 0;
  const badges = [
    grande && p.top ? '<span class="badge badge--top">Más pedido</span>' : '',
    p.nuevo ? '<span class="badge badge--nuevo">Nuevo</span>' : '',
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : ''
  ].join('');
  const cta = k
    ? `<button type="button" class="card__cta" data-add="${p.id}" data-v="${k}" aria-label="Agregar ${esc(p.nombre)}, ${esc(nombreVar(k))}, al carrito">${ICONO_CARRITO_MAS}<span class="card__cta-t">Agregar</span></button>`
    : `<button type="button" class="card__cta" data-quick="${p.id}" aria-label="Elegir la medida de ${esc(p.nombre)}">${ICONO_REGLA}<span class="card__cta-t">Elegir medida</span></button>`;
  return `<article class="card${grande ? ' card--grande' : ''}" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
    <button type="button" class="card__abrir" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><span class="recorte" style="${recorte(p.foto, p.foco, 1)}">${imgTag(p.foto, p.nombre)}</span></button>
    ${badges ? `<div class="card__badges">${badges}</div>` : ''}
    <div class="card__info">
      <p class="card__linea">${esc(lineaDe(p))}</p>
      <h3 class="card__t">${esc(p.nombre)}</h3>
      <div class="card__fila"><p class="card__precio"><small>${esc(k ? nombreVar(k) : 'Desde')}</small><b>${formatearPrecio(precio)}</b>${original ? `<s>${formatearPrecio(original)}</s>` : ''}</p>${cta}</div>
    </div>
  </article>`;
}

const stepperHTML = (n = 1) => `<div class="stepper"><button type="button" data-delta="-1" aria-label="Restar uno">−</button><input type="number" inputmode="numeric" min="1" max="99" value="${n}" aria-label="Cantidad"><button type="button" data-delta="1" aria-label="Sumar uno">+</button></div>`;
const precioFilaHTML = (p, k) => `<b>${formatearPrecio(precioFinal(p, k))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, k))}</s>` : ''}`;

function filaHTML(p, animar = true) {
  const vs = varsDe(p);
  const k = varParaCama(p, FILTRO.cama) || vs[0];
  const medida = vs.length > 1
    ? `<label class="fila__medida"><span class="sr-only">Medida de ${esc(p.nombre)}</span><select data-medida>${vs.map(v => `<option value="${v}"${v === k ? ' selected' : ''}>${esc(MED[v].n)}</option>`).join('')}</select></label>`
    : `<p class="fila__unica">${esc(MED[k].n)} cm</p>`;
  const sub = [TELAS[p.tela], p.bolsillo ? `bolsillo ${p.bolsillo} cm` : ''].filter(Boolean).join(' · ');
  const badges = [p.nuevo ? '<span class="badge badge--nuevo">Nuevo</span>' : '', p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : ''].join('');
  return `<li class="fila" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(24px)"' : ''}>
    <button type="button" class="fila__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><span class="recorte" style="${recorte(p.foto, p.foco, 1)}">${imgTag(p.foto, p.nombre)}</span></button>
    <div class="fila__nombre"><button type="button" class="fila__t" data-quick="${p.id}">${esc(p.nombre)}</button><p class="fila__sub"><span>${esc(sub)}</span>${badges}</p></div>
    ${medida}
    <p class="fila__precio">${precioFilaHTML(p, k)}</p>
    ${stepperHTML(1)}
    <button type="button" class="btn btn--cta fila__sumar" data-sumar>Sumar</button>
  </li>`;
}

function contenedorCatalogo() {
  return document.getElementById(esModelo2 ? 'lista' : 'grilla');
}

function itemHTML(p, k, primeraPagina) {
  return esModelo2 ? filaHTML(p) : cardHTML(p, true, primeraPagina && k === 0);
}

function render() {
  const cont = contenedorCatalogo();
  if (!cont) return;
  const pag = Servidor.productos({ ...paramsDeFiltro(), cursor: '0', limite: PASO });
  PAGINA.siguiente = pag.siguiente;
  PAGINA.total = pag.total;
  PAGINA.mostrados = pag.items.length;
  cont.innerHTML = pag.items.map((p, k) => itemHTML(p, k, true)).join('');
  actualizarMeta();
  revelarNuevos(cont);
  refrescar();
}

function verMas() {
  const cont = contenedorCatalogo();
  if (!cont || !PAGINA.siguiente) return;
  const pag = Servidor.productos({ ...paramsDeFiltro(), cursor: PAGINA.siguiente, limite: PASO });
  PAGINA.siguiente = pag.siguiente;
  PAGINA.total = pag.total;
  PAGINA.mostrados += pag.items.length;
  cont.insertAdjacentHTML('beforeend', pag.items.map((p, k) => itemHTML(p, k, false)).join(''));
  actualizarMeta();
  revelarNuevos(cont);
  refrescar();
}

function filtrosActivos() {
  const chips = [];
  if (FILTRO.q) chips.push(['q', '', `“${FILTRO.q}”`]);
  if (!esModelo2) FILTRO.cats.forEach(c => chips.push(['cat', c, CATS[c]]));
  if (FILTRO.cama && !esModelo2) chips.push(['cama', '', `Colchón ${CAMAS[FILTRO.cama].n}`]);
  if (FILTRO.bolsillo) chips.push(['bolsillo', '', `Bolsillo de ${FILTRO.bolsillo} cm o más`]);
  FILTRO.telas.forEach(t => chips.push(['tela', t, TELAS[t]]));
  FILTRO.precios.forEach(k => chips.push(['precio', k, RANGOS[k][2]]));
  if (FILTRO.oferta) chips.push(['oferta', '', 'Con descuento']);
  return chips;
}

function actualizarMeta() {
  const n = document.getElementById('resN');
  if (n) n.textContent = PAGINA.total ? `${cuantos(PAGINA.total)}${PAGINA.total > PAGINA.mostrados ? ` · ves ${PAGINA.mostrados}` : ''}` : 'Sin resultados';
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = PAGINA.total > 0;
  const btn = document.getElementById('verMas');
  if (btn) {
    const resto = PAGINA.total - PAGINA.mostrados;
    btn.hidden = !PAGINA.siguiente || resto <= 0;
    btn.textContent = `Ver ${Math.min(PASO, resto)} más`;
  }
  const chips = filtrosActivos();
  const caja = document.getElementById('chipsActivos');
  if (caja) caja.innerHTML = chips.map(([k, v, txt]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(txt)}">${esc(txt)}${ICONO_X}</button>`).join('');
  const nf = document.getElementById('nFiltros');
  if (nf) { const c = chips.filter(x => x[0] !== 'q').length; nf.textContent = c; nf.hidden = !c; }
  const ver = document.getElementById('verResultados');
  if (ver) ver.textContent = PAGINA.total ? `Ver ${cuantos(PAGINA.total)}` : 'Sin resultados';
}

function sincronizarUI() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = FILTRO.cats.has(i.value); });
  document.querySelectorAll('input[data-f="tela"]').forEach(i => { i.checked = FILTRO.telas.has(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = FILTRO.precios.has(i.value); });
  document.querySelectorAll('input[data-f="oferta"]').forEach(i => { i.checked = FILTRO.oferta; });
  document.querySelectorAll('[data-cama-filtro]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.camaFiltro === FILTRO.cama)));
  document.querySelectorAll('.lista-tab').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.tab ? FILTRO.cats.has(t.dataset.tab) : FILTRO.cats.size === 0)));
  const q = document.getElementById('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
  const fCama = document.getElementById('fCama');
  if (fCama) fCama.value = FILTRO.cama;
}

function limpiarFiltros(conOrden = false) {
  FILTRO.q = '';
  FILTRO.cats.clear();
  FILTRO.cama = '';
  FILTRO.bolsillo = 0;
  FILTRO.telas.clear();
  FILTRO.precios.clear();
  FILTRO.oferta = false;
  if (conOrden) FILTRO.orden = 'pedidos';
}

function quitarFiltro(k, v) {
  if (k === 'q') FILTRO.q = '';
  else if (k === 'cat') FILTRO.cats.delete(v);
  else if (k === 'cama') { FILTRO.cama = ''; FILTRO.bolsillo = 0; }
  else if (k === 'bolsillo') FILTRO.bolsillo = 0;
  else if (k === 'tela') FILTRO.telas.delete(v);
  else if (k === 'precio') FILTRO.precios.delete(v);
  else if (k === 'oferta') FILTRO.oferta = false;
  sincronizarUI();
  render();
}

function irA(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function aplicarCategoria(cat) {
  limpiarFiltros();
  if (CATS[cat]) FILTRO.cats.add(cat);
  sincronizarUI();
  render();
  irA('#tienda');
}

function initFiltrosUI() {
  const fc = document.getElementById('fCats');
  if (fc) fc.innerHTML = Object.keys(CATS).map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c}"><span>${CATS[c]}</span><span class="f-n">${Servidor.conteo({ cats: [c] })}</span></label>`).join('');
  const fca = document.getElementById('fCamas');
  if (fca) fca.innerHTML = TODAS.map(k => `<button type="button" class="f-chip" data-cama-filtro="${k}" aria-pressed="false">${CAMAS[k].n}</button>`).join('');
  const ft = document.getElementById('fTelas');
  if (ft) ft.innerHTML = Object.keys(TELAS).map(t => `<label class="f-check"><input type="checkbox" data-f="tela" value="${t}"><span>${TELAS[t]}</span><span class="f-n">${Servidor.conteo({ telas: [t] })}</span></label>`).join('');
  const fp = document.getElementById('fPrecios');
  if (fp) fp.innerHTML = Object.keys(RANGOS).map(k => `<label class="f-check"><input type="checkbox" data-f="precio" value="${k}"><span>${RANGOS[k][2]}</span><span class="f-n">${Servidor.conteo({ precios: [k] })}</span></label>`).join('');
  const fCama = document.getElementById('fCama');
  if (fCama) fCama.innerHTML = `<option value="">Todas las medidas</option>${TODAS.map(k => `<option value="${k}">${CAMAS[k].n}</option>`).join('')}`;
  document.querySelectorAll('.lista-tab').forEach(t => {
    const span = t.querySelector('span');
    if (span) span.textContent = Servidor.conteo({ cats: t.dataset.tab ? [t.dataset.tab] : [] });
  });
}

function initFiltrosDrawer() {
  const btn = document.getElementById('abrirFiltros');
  const panel = document.getElementById('filtros');
  if (!btn || !panel) return;
  const cerrarBtn = document.getElementById('cerrarFiltros');
  const ver = document.getElementById('verResultados');
  const cuerpo = panel.querySelector('.filtros__cuerpo');
  const mq = window.matchMedia('(max-width: 1024px)');
  let fondo = document.querySelector('.filtros-fondo');
  if (!fondo) { fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; document.body.appendChild(fondo); }
  const abrir = () => {
    if (!mq.matches) return;
    cuerpo?.classList.add('in');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.classList.add('open');
    fondo.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(() => cerrarBtn?.focus(), 60);
  };
  const cerrar = (devolver = true) => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    fondo.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (devolver) btn.focus();
  };
  btn.addEventListener('click', abrir);
  cerrarBtn?.addEventListener('click', () => cerrar());
  fondo.addEventListener('click', () => cerrar());
  ver?.addEventListener('click', () => { cerrar(false); irA('#tienda'); });
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); return; }
    focoAtrapado(panel, e);
  });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(false); else cuerpo?.classList.add('in'); });
  if (mq.matches) cuerpo?.classList.add('in');
}

function initBuscador() {
  const form = document.getElementById('buscador');
  const input = document.getElementById('q');
  if (!form || !input) return;
  let t = 0;
  const aplicar = () => {
    const v = input.value.trim().slice(0, 60);
    if (v === FILTRO.q) return false;
    FILTRO.q = v;
    render();
    return true;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    aplicar();
    if (esModelo2) irA('#tienda');
  });
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(aplicar, 280);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

function focoAtrapado(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function pedidoHTML() {
  const items = Cart.get();
  if (!items.length) {
    return `<div class="pvacio"><svg viewBox="0 0 64 64" aria-hidden="true"><use href="#pila"/></svg><p class="pvacio__t">Todavía no sumaste nada</p><p>La compra mínima es de $80.000 y podés combinar sábanas, mantas y alfombras.</p><button type="button" class="btn btn--tinta" data-ir-tienda>Ver la blanquería</button></div>`;
  }
  const total = Cart.total();
  const falta = Math.max(0, MIN_COMPRA - total);
  const pct = Math.min(100, Math.round((total / MIN_COMPRA) * 100));
  const min = `<div class="pmin${falta ? '' : ' ok'}"><div class="pmin__barra" role="progressbar" aria-label="Avance hacia la compra mínima" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="--p:${pct}%"></span></div><p class="pmin__t">${falta ? `Te faltan <b>${formatearPrecio(falta)}</b> para la compra mínima de $80.000. Podés combinar sábanas, mantas y alfombras.` : 'Llegaste a la compra mínima de $80.000.'}</p></div>`;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    const pu = precioFinal(p, i.v);
    return `<li class="plinea" data-id="${p.id}" data-v="${i.v}">
      <span class="plinea__foto recorte" style="${recorte(p.foto, p.foco, 1)}">${imgTag(p.foto, '')}</span>
      <div><p class="plinea__t">${esc(p.nombre)}</p><p class="plinea__m">${esc(nombreVar(i.v))} · ${formatearPrecio(pu)} c/u</p><button type="button" class="plinea__quitar" data-quitar>Quitar</button></div>
      <div class="plinea__der"><p class="plinea__precio">${formatearPrecio(pu * i.qty)}</p>${stepperHTML(i.qty)}</div>
    </li>`;
  }).join('');
  return `${min}<ul class="plineas">${lineas}</ul><div class="ppie"><p class="ptotal"><span>Total</span><b>${formatearPrecio(total)}</b></p><button type="button" class="btn btn--cta btn--bloque" data-checkout>Finalizar compra</button><a class="btn btn--bloque pwsp" href="${wspLink(textoPedido(items))}" target="_blank" rel="noopener">${ICONO_WSP}<span>Mandar el pedido por WhatsApp</span></a></div>`;
}

function renderPedidos() {
  const activo = document.activeElement;
  const linea = activo?.closest?.('.plinea');
  const memo = linea && activo.closest('[data-pedido]') ? { id: linea.dataset.id, v: linea.dataset.v, delta: activo.dataset.delta, input: activo.tagName === 'INPUT', cont: activo.closest('[data-pedido]') } : null;
  const html = pedidoHTML();
  document.querySelectorAll('[data-pedido]').forEach(c => { c.innerHTML = html; });
  if (memo) {
    const l = memo.cont.querySelector(`.plinea[data-id="${memo.id}"][data-v="${memo.v}"]`);
    const el = l && (memo.input ? l.querySelector('.stepper input') : l.querySelector(`[data-delta="${memo.delta}"]`));
    el?.focus();
  }
}
document.addEventListener('cart:updated', renderPedidos);

let focoCarrito = null;
let timerCarrito = 0;
function abrirCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  clearTimeout(timerCarrito);
  if (d.hidden) focoCarrito = document.activeElement;
  renderPedidos();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  void d.offsetWidth;
  d.classList.add('open');
  setTimeout(() => d.querySelector('.drawer-panel')?.focus(), 60);
}

function cerrarCarrito(devolver = true) {
  const d = document.getElementById('carrito');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  if (document.getElementById('vista')?.hidden !== false) document.body.classList.remove('no-scroll');
  clearTimeout(timerCarrito);
  timerCarrito = setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolver) focoCarrito?.focus?.();
}

function checkout() {
  const total = Cart.total();
  if (!total) { showToast('Tu pedido está vacío: sumá algo de la blanquería.'); return; }
  if (total < MIN_COMPRA) { showToast(`La compra mínima es de $80.000: te faltan ${formatearPrecio(MIN_COMPRA - total)}.`); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function agregar(id, v, qty = 1) {
  const p = getProducto(id);
  if (!p) return false;
  const k = v && p.vars[v] != null ? v : (varsDe(p).length === 1 ? varsDe(p)[0] : null);
  if (!k) { abrirVista(id); return false; }
  Cart.add(p, k, cantidad(qty));
  showToast(`Sumaste ${cantidad(qty) > 1 ? `${cantidad(qty)} × ` : ''}${p.nombre} (${nombreVar(k)})`);
  return true;
}

let qv = { p: null, v: null, foto: 0 };
let focoVista = null;
let timerVista = 0;

function qvPrecioHTML(p, v) {
  return `<b>${formatearPrecio(precioFinal(p, v))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, v))}</s>` : ''}<span>${esc(nombreVar(v))}</span>`;
}

function qvWsp(p, v) {
  return wspLink(`Hola Blanquería Israel, quiero consultar por ${p.nombre} en ${nombreVar(v)}.`);
}

function vistaHTML() {
  const { p, v } = qv;
  const vs = varsDe(p);
  const fotos = [{ foco: p.foco, alt: p.nombre }, { foco: [0.5, 0.5, 1], alt: FOTOS[p.foto][3] }];
  const f = fotos[qv.foto] || fotos[0];
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => a.rank - b.rank).slice(0, 3);
  const medidas = vs.length > 1
    ? `<fieldset class="qv-medidas"><legend>Elegí la medida</legend>${vs.map(k => `<label class="qv-med${k === v ? ' is-on' : ''}"><input type="radio" name="qv-med" value="${k}"${k === v ? ' checked' : ''}><b>${esc(MED[k].n)}</b><span>${esc(textoMedida(p, k))}</span><em>${formatearPrecio(precioFinal(p, k))}</em></label>`).join('')}</fieldset>`
    : `<p class="qv-unica"><b>${esc(MED[v].n)} cm</b> · ${esc(textoMedida(p, v))}</p>`;
  return `<div class="qv-galeria">
      <div class="qv-foto recorte" style="${recorte(p.foto, f.foco, 1)}">${imgTag(p.foto, f.alt)}</div>
      <div class="qv-minis">${fotos.map((x, i) => `<button type="button" class="qv-mini" data-qv-foto="${i}" aria-pressed="${i === qv.foto}" aria-label="${i ? 'Ver la foto completa' : 'Ver el producto de cerca'}"><span class="recorte" style="${recorte(p.foto, x.foco, 1)}">${imgTag(p.foto, '')}</span></button>`).join('')}</div>
    </div>
    <div class="qv-info">
      <p class="qv-linea">${esc(lineaDe(p))}</p>
      <h2 class="qv-t">${esc(p.nombre)}</h2>
      <p class="qv-precio" id="qvPrecio">${qvPrecioHTML(p, v)}</p>
      ${medidas}
      <div class="qv-comprar">${stepperHTML(1)}<button type="button" class="btn btn--cta" data-qv-agregar>${ICONO_CARRITO_MAS}Agregar al carrito</button><button type="button" class="btn btn--borde" data-qv-comprar>Comprar ahora</button></div>
      <p class="qv-desc">${esc(p.desc)}</p>
      <a class="qv-wsp" id="qvWsp" href="${qvWsp(p, v)}" target="_blank" rel="noopener">${ICONO_WSP}Consultar por WhatsApp</a>
      ${rel.length ? `<div class="qv-rel"><p class="qv-rel__t">También te puede interesar</p><div class="qv-rel__grid">${rel.map(x => `<button type="button" data-quick="${x.id}"><span class="recorte" style="${recorte(x.foto, x.foco, 1)}">${imgTag(x.foto, '')}</span><span>${esc(x.nombre)}</span><b>${formatearPrecio(precioDesde(x))}</b></button>`).join('')}</div></div>` : ''}
    </div>`;
}

function inyectarLd(p) {
  let s = document.getElementById('ldProducto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ldProducto'; document.head.appendChild(s); }
  const precios = varsDe(p).map(v => precioFinal(p, v));
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(`images/${FOTOS[p.foto][0]}`, location.href).href,
    description: p.desc,
    brand: { '@type': 'Brand', name: 'Blanquería Israel' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: Math.min(...precios), highPrice: Math.max(...precios), offerCount: precios.length, availability: 'https://schema.org/InStock' }
  });
}

function abrirVista(id, v) {
  const p = getProducto(id);
  const m = document.getElementById('vista');
  const caja = document.getElementById('qv');
  if (!p || !m || !caja) return;
  clearTimeout(timerVista);
  const yaAbierta = !m.hidden && m.classList.contains('open');
  if (!yaAbierta) focoVista = document.activeElement;
  qv = { p, v: v && p.vars[v] != null ? v : (varParaCama(p, FILTRO.cama) || varsDe(p)[0]), foto: 0 };
  caja.innerHTML = vistaHTML();
  inyectarLd(p);
  const panel = m.querySelector('.modal-panel');
  if (!yaAbierta) {
    m.hidden = false;
    document.body.classList.add('no-scroll');
    void m.offsetWidth;
    m.classList.add('open');
  }
  if (panel) { panel.scrollTop = 0; panel.focus(); }
  try { history.replaceState(null, '', `?producto=${p.id}`); } catch { }
}

function cerrarVista(devolver = true) {
  const m = document.getElementById('vista');
  if (!m || m.hidden) return;
  m.classList.remove('open');
  if (document.getElementById('carrito')?.hidden !== false) document.body.classList.remove('no-scroll');
  clearTimeout(timerVista);
  timerVista = setTimeout(() => { m.hidden = true; }, reduceMotion ? 0 : 320);
  try { history.replaceState(null, '', location.pathname); } catch { }
  if (devolver) focoVista?.focus?.();
}

function pintarPrecioVista() {
  const { p, v } = qv;
  const precio = document.getElementById('qvPrecio');
  if (precio) precio.innerHTML = qvPrecioHTML(p, v);
  const wsp = document.getElementById('qvWsp');
  if (wsp) wsp.href = qvWsp(p, v);
  document.querySelectorAll('.qv-med').forEach(l => l.classList.toggle('is-on', l.querySelector('input')?.value === v));
}

function initModales() {
  const carrito = document.getElementById('carrito');
  const vista = document.getElementById('vista');
  carrito?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    focoAtrapado(carrito, e);
  });
  vista?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarVista(); return; }
    focoAtrapado(vista, e);
  });
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const quick = t.closest('[data-quick]');
    if (quick) { e.preventDefault(); abrirVista(quick.dataset.quick); return; }
    const add = t.closest('[data-add]');
    if (add) { agregar(add.dataset.add, add.dataset.v, 1); return; }
    const cat = t.closest('[data-cat]');
    if (cat) { e.preventDefault(); aplicarCategoria(cat.dataset.cat); return; }
    if (t.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (t.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    if (t.closest('[data-cerrar-vista]')) { cerrarVista(); return; }
    if (t.closest('[data-checkout]')) { checkout(); return; }
    if (t.closest('[data-ir-tienda]')) { cerrarCarrito(false); irA('#tienda'); return; }
    if (t.closest('[data-limpiar]')) { limpiarFiltros(); sincronizarUI(); render(); return; }
    if (t.closest('#verMas')) { verMas(); return; }
    const quitarF = t.closest('[data-quitar-filtro]');
    if (quitarF) { quitarFiltro(quitarF.dataset.quitarFiltro, quitarF.dataset.valor); return; }
    const camaF = t.closest('[data-cama-filtro]');
    if (camaF) { const k = camaF.dataset.camaFiltro; FILTRO.cama = FILTRO.cama === k ? '' : k; if (!FILTRO.cama) FILTRO.bolsillo = 0; sincronizarUI(); render(); return; }
    const tab = t.closest('.lista-tab');
    if (tab) { FILTRO.cats = new Set(tab.dataset.tab ? [tab.dataset.tab] : []); sincronizarUI(); render(); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) { const l = quitar.closest('.plinea'); if (l) Cart.remove(l.dataset.id, l.dataset.v); return; }
    const delta = t.closest('[data-delta]');
    if (delta) {
      const input = delta.parentElement?.querySelector('input');
      if (!input) return;
      const n = cantidad(Number(input.value) + Number(delta.dataset.delta));
      input.value = n;
      const l = delta.closest('.plinea');
      if (l) Cart.setQty(l.dataset.id, l.dataset.v, n);
      return;
    }
    const sumar = t.closest('[data-sumar]');
    if (sumar) {
      const fila = sumar.closest('.fila');
      const p = fila && getProducto(fila.dataset.id);
      if (!p) return;
      const sel = fila.querySelector('[data-medida]');
      const input = fila.querySelector('.stepper input');
      if (agregar(p.id, sel ? sel.value : varsDe(p)[0], cantidad(input?.value)) && input) input.value = 1;
      return;
    }
    const foto = t.closest('[data-qv-foto]');
    if (foto && qv.p) { qv.foto = Number(foto.dataset.qvFoto) || 0; document.getElementById('qv').innerHTML = vistaHTML(); document.querySelector(`[data-qv-foto="${qv.foto}"]`)?.focus(); return; }
    const qvAdd = t.closest('[data-qv-agregar], [data-qv-comprar]');
    if (qvAdd && qv.p) {
      const input = document.querySelector('#qv .stepper input');
      if (agregar(qv.p.id, qv.v, cantidad(input?.value)) && qvAdd.hasAttribute('data-qv-comprar')) { cerrarVista(false); abrirCarrito(); }
    }
  });

  document.addEventListener('change', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('input[name="qv-med"]')) { qv.v = t.value; pintarPrecioVista(); return; }
    if (t.matches('.plinea .stepper input')) { const l = t.closest('.plinea'); Cart.setQty(l.dataset.id, l.dataset.v, cantidad(t.value)); return; }
    if (t.matches('.stepper input')) { t.value = cantidad(t.value); return; }
    if (t.matches('[data-medida]')) {
      const fila = t.closest('.fila');
      const p = fila && getProducto(fila.dataset.id);
      const precio = fila?.querySelector('.fila__precio');
      if (p && precio) precio.innerHTML = precioFilaHTML(p, t.value);
      return;
    }
    if (t.matches('input[data-f]')) {
      const f = t.dataset.f;
      if (f === 'oferta') FILTRO.oferta = t.checked;
      else {
        const set = { cat: FILTRO.cats, tela: FILTRO.telas, precio: FILTRO.precios }[f];
        if (set) { if (t.checked) set.add(t.value); else set.delete(t.value); }
      }
      render();
      return;
    }
    if (t.matches('#orden')) { FILTRO.orden = t.value; render(); return; }
    if (t.matches('#fCama')) { FILTRO.cama = t.value; if (!FILTRO.cama) FILTRO.bolsillo = 0; render(); }
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

function initMedidas() {
  const radios = [...document.querySelectorAll('input[name="cama"]')];
  const alto = document.getElementById('medAlto');
  if (!radios.length || !alto) return;
  const $ = id => document.getElementById(id);
  const S = 320;
  const pc = v => `${((v / S) * 100).toFixed(2)}%`;
  const caja = (el, x, y, w, h) => { if (!el) return; el.style.left = pc(x); el.style.top = pc(y); el.style.width = pc(w); el.style.height = pc(h); };
  const dims = n => n.split(' × ').map(Number);
  let ultimo = null;
  const pintar = () => {
    const cama = radios.find(r => r.checked)?.value || '2';
    const r = calcMedidas(cama, alto.value);
    ultimo = r;
    radios.forEach(x => x.closest('.med-cama')?.classList.toggle('is-on', x.checked));
    $('medAltoV').textContent = `${r.alto} cm`;
    $('medJuego').textContent = MED[r.juego].n;
    $('medAjustable').textContent = `${r.c.w} × ${r.c.l} cm · bolsillo de ${r.bolsillo} cm`;
    $('medPlana').textContent = `${r.plana[0]} × ${r.plana[1]} cm o más`;
    $('medManta').textContent = `${MED[r.manta].n} cm`;
    $('medAlfombra').textContent = `${MED[r.alfombra].n} cm, asoma ${r.asoma} cm por lado`;
    $('medNotaC').textContent = `${r.c.w} × ${r.c.l} × ${r.alto} cm`;
    const n = Servidor.conteo({ cama: r.cama, bolsillo: r.bolsillo });
    $('medVer').textContent = `Ver los ${n} productos para ${CAMAS[r.cama].n}`;
    $('medWsp').href = wspLink(`Hola Blanquería Israel, tengo un colchón de ${CAMAS[r.cama].n} (${r.c.w} × ${r.c.l} cm, ${r.alto} cm de alto). ¿Qué tienen en esa medida?`);
    const perfil = document.querySelector('.med-perfil');
    if (perfil) { perfil.style.setProperty('--alto', r.alto); perfil.style.setProperty('--bolsillo', r.bolsillo); }
    const top = 14;
    caja($('planoColchon'), (S - r.c.w) / 2, top, r.c.w, r.c.l);
    const [ra, rb] = dims(MED[r.alfombra].n);
    const ancho = Math.max(ra, rb);
    const fondo = Math.min(ra, rb);
    caja($('planoAlfombra'), (S - ancho) / 2, top + r.c.l * 0.36, ancho, fondo);
    const [mw, ml] = dims(MED[r.manta].n);
    caja($('planoManta'), (S - mw) / 2, top + r.c.l * 0.32, mw, ml * 0.72);
    $('planoColchonT').textContent = `${r.c.w} × ${r.c.l}`;
    $('planoAlfombraT').textContent = `Alfombra ${MED[r.alfombra].n}`;
    $('planoMantaT').textContent = `Manta ${MED[r.manta].n}`;
  };
  radios.forEach(x => x.addEventListener('change', pintar));
  alto.addEventListener('input', pintar);
  $('medVer')?.addEventListener('click', e => {
    e.preventDefault();
    if (!ultimo) return;
    limpiarFiltros();
    FILTRO.cama = ultimo.cama;
    FILTRO.bolsillo = ultimo.bolsillo;
    sincronizarUI();
    render();
    irA('#tienda');
  });
  pintar();
}

function initRecorrido() {
  const pista = document.getElementById('recPista');
  const visual = document.getElementById('recVisual');
  const foto = document.getElementById('recFoto');
  if (!pista || !visual || !foto) return;
  const escena = pista.querySelector('.rec-escena');
  const pasos = [...pista.querySelectorAll('.rec-paso')];
  const pins = [...pista.querySelectorAll('.rec-pin')];
  const puntos = [...pista.querySelectorAll('.rec-puntos i')];
  const nEl = document.getElementById('recI');
  const totEl = document.getElementById('recTotal');
  const minEl = document.getElementById('recMin');
  const totBox = totEl?.closest('.rec-total');
  const ratio = FOTOS.dormitorio[1] / FOTOS.dormitorio[2];
  const acumulado = PARADAS.map((s, i) => PARADAS.slice(0, i + 1).reduce((t, x) => t + precioDesde(getProducto(x.id)), 0));
  let baseW = 0;
  let baseH = 0;
  let Vw = 0;
  let Vh = 0;
  let actual = -1;
  let frame = 0;
  const medir = () => {
    Vw = visual.clientWidth;
    Vh = visual.clientHeight;
    if (!Vw || !Vh) return;
    if (Vw / Vh > ratio) { baseW = Vw; baseH = Vw / ratio; } else { baseH = Vh; baseW = Vh * ratio; }
    foto.style.width = `${baseW}px`;
    foto.style.height = `${baseH}px`;
  };
  const camara = (fx, fy, z) => {
    const W = baseW * z;
    const H = baseH * z;
    const tx = Math.min(0, Math.max(Vw - W, Vw / 2 - fx * W));
    const ty = Math.min(0, Math.max(Vh - H, Vh / 2 - fy * H));
    foto.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${z.toFixed(4)})`;
    const inv = `scale(${(1 / z).toFixed(4)})`;
    pins.forEach(pin => { pin.style.transform = inv; });
  };
  const activar = i => {
    actual = i;
    pasos.forEach((el, k) => el.classList.toggle('is-on', k === i));
    pins.forEach((el, k) => el.classList.toggle('is-on', k === i));
    puntos.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (nEl) nEl.textContent = String(i + 1).padStart(2, '0');
    const tot = acumulado[i];
    const falta = MIN_COMPRA - tot;
    if (totEl) totEl.textContent = formatearPrecio(tot);
    if (minEl) minEl.textContent = falta > 0 ? `Te faltan ${formatearPrecio(falta)} para la compra mínima` : 'Ya pasa la compra mínima de $80.000';
    totBox?.classList.toggle('ok', falta <= 0);
  };
  const update = () => {
    frame = 0;
    if (!baseW) medir();
    const r = pista.getBoundingClientRect();
    const colchon = parseFloat(window.getComputedStyle(pista).paddingBottom) || 0;
    const recorrido = r.height - colchon - escena.offsetHeight;
    const p = recorrido > 0 ? clamp01((offModelos() - r.top) / recorrido) : 0;
    const tramo = p * (PARADAS.length - 1);
    const i0 = Math.min(PARADAS.length - 2, Math.floor(tramo));
    const fr = tramo - i0;
    const e = suave((fr - 0.22) / 0.56);
    const a = PARADAS[i0];
    const b = PARADAS[i0 + 1];
    const zz = s => (Vw < 700 ? 1 + (s.z - 1) * 0.6 : s.z);
    camara(lerp(a.f[0], b.f[0], e), lerp(a.f[1], b.f[1], e), lerp(zz(a), zz(b), e));
    const idx = fr < 0.5 ? i0 : i0 + 1;
    if (idx !== actual) activar(idx);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { medir(); update(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(() => { medir(); update(); }).observe(visual);
  medir();
  activar(0);
  update();
}

function abrirDesdeURL() {
  try {
    const id = new URLSearchParams(location.search).get('producto');
    if (id && getProducto(id)) abrirVista(id);
  } catch { }
}

function iniciar() {
  initModelBarScroll();
  initCabH();
  initRecortesFijos();
  initHoy();
  initFiltrosUI();
  sincronizarUI();
  render();
  initMedidas();
  initPreciosFijos();
  renderPedidos();
  initReveals();
  initHeroMotion();
  initNav();
  initFiltrosDrawer();
  initBuscador();
  initDelegacion();
  initModales();
  initFloats();
  updateCartBadge();
  initRecorrido();
  abrirDesdeURL();
}

iniciar();
