const WSP = '5493517584411';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FOTOS = {
  '01': ['01_hero_16x9.webp', 1672, 941],
  '02': ['02_vertical_9x16.webp', 941, 1672],
  '03': ['03_lenceria_mujer_1x1.webp', 1254, 1254],
  '04': ['04_hombre_1x1.webp', 1254, 1254],
  '05': ['05_belleza_1x1.webp', 1254, 1254],
  '06': ['06_blanco_hogar_1x1.webp', 1254, 1254]
};

const CATEGORIAS = [
  { id: 'lenceria', nombre: 'Lencería', img: '03', foco: [0.36, 0.33, 1.6] },
  { id: 'dormir', nombre: 'Para dormir', img: '02', foco: [0.33, 0.42, 1.8] },
  { id: 'hombre', nombre: 'Hombre', img: '04', foco: [0.3, 0.6, 1.5] },
  { id: 'perfumeria', nombre: 'Perfumería', img: '05', foco: [0.72, 0.47, 1.6] },
  { id: 'cuidado', nombre: 'Cuidado y maquillaje', img: '05', foco: [0.25, 0.62, 1.7] },
  { id: 'blanco', nombre: 'Blanco', img: '06', foco: [0.5, 0.5, 1.4] }
];

const MARCAS = ['Natura', 'Avon', 'Bagués', 'Vitnik'];
const T_NUM = ['85', '90', '95', '100', '105'];
const T_LETRA = ['S', 'M', 'L', 'XL', 'XXL'];
const MEDIDAS = { '1 plaza': '80×190', '2 plazas': '140×190', Queen: '160×200', King: '180×200' };
const PRECIOS = [
  ['0-10000', 'Hasta $10.000'],
  ['10000-25000', '$10.000 a $25.000'],
  ['25000-50000', '$25.000 a $50.000'],
  ['50000-9999999', 'Más de $50.000']
];
const AYUDA_REVISTA = {
  Natura: { ej: '76420', txt: 'En la revista de Natura, el código es el número entre paréntesis, debajo del precio.' },
  Avon: { ej: '53817-2', txt: 'En el folleto de Avon, el código lleva un guion al final, como 53817-2.' },
  Bagués: { ej: '30215', txt: 'Copiá el código tal cual figura junto al producto en la revista de Bagués.' },
  Vitnik: { ej: '2287', txt: 'Copiá el código tal cual figura junto a la prenda en el catálogo de Vitnik.' }
};

const r = (ini, fin) => T_NUM.slice(T_NUM.indexOf(ini), T_NUM.indexOf(fin) + 1);
const l = (ini, fin) => T_LETRA.slice(T_LETRA.indexOf(ini), T_LETRA.indexOf(fin) + 1);

const PRODUCTOS = [
  { id: 'corpino-encaje-rosa', nombre: 'Corpiño de encaje rosa viejo', cat: 'lenceria', precio: 21900, talles: r('85', '100'), stock: 8, img: '03', foco: [0.32, 0.14, 2.5], color: 'Rosa viejo', desc: 'Encaje floral sobre taza con aro y breteles regulables. Combina con la bombacha de encaje del mismo tono.', tags: 'corpino sosten bra encaje aro' },
  { id: 'corpino-soft-nude', nombre: 'Corpiño soft nude con puntilla', cat: 'lenceria', precio: 18900, talles: r('85', '105'), stock: 10, img: '03', foco: [0.36, 0.36, 2.6], color: 'Nude', desc: 'Taza lisa que no se marca debajo de la remera, con puntilla en el borde y moño al centro.', tags: 'corpino sosten bra liso soft puntilla' },
  { id: 'corpino-encaje-marfil', nombre: 'Corpiño de encaje marfil', cat: 'lenceria', precio: 22500, descuento: 15, talles: r('85', '100'), stock: 6, img: '03', foco: [0.39, 0.48, 2.4], color: 'Marfil', desc: 'Encaje marfil sobre taza con aro y moño de raso. Para usar solo o con la culotte al tono.', tags: 'corpino sosten bra encaje blanco crudo' },
  { id: 'bombacha-encaje-rosa', nombre: 'Bombacha de encaje rosa viejo', cat: 'lenceria', precio: 7900, talles: l('S', 'XL'), stock: 14, img: '03', foco: [0.22, 0.71, 2.4], color: 'Rosa viejo', desc: 'Tiro medio, encaje elastizado y moño al frente.', tags: 'bombacha calzon encaje' },
  { id: 'bombacha-raso-nude', nombre: 'Bombacha de raso nude', cat: 'lenceria', precio: 6900, talles: l('S', 'XXL'), stock: 16, img: '03', foco: [0.36, 0.77, 2.6], color: 'Nude', desc: 'Raso suave con cintura de puntilla, tiro medio.', tags: 'bombacha calzon raso satin' },
  { id: 'culotte-encaje-marfil', nombre: 'Culotte de encaje marfil', cat: 'lenceria', precio: 8400, nuevo: true, talles: l('S', 'XL'), stock: 12, img: '03', foco: [0.47, 0.83, 2.4], color: 'Marfil', desc: 'Corte culotte de encaje floral con moño de raso.', tags: 'bombacha culotte encaje' },
  { id: 'conjunto-encaje-rosa', nombre: 'Conjunto de encaje rosa', cat: 'lenceria', precio: 27900, descuento: 10, talles: r('85', '100'), stock: 7, img: '01', foco: [0.25, 0.45, 1.9], color: 'Rosa', desc: 'Corpiño con aro y bombacha de encaje al tono. Elegí el talle del corpiño y la bombacha viene en el talle que le corresponde.', tags: 'conjunto corpino bombacha encaje regalo' },
  { id: 'corpino-encaje-celeste', nombre: 'Corpiño de encaje celeste', cat: 'lenceria', precio: 23900, nuevo: true, talles: r('85', '100'), stock: 5, img: '02', foco: [0.76, 0.25, 3], color: 'Celeste', desc: 'Encaje celeste sobre tul, con taza con aro y breteles finos.', tags: 'corpino sosten bra encaje azul' },

  { id: 'camisola-raso-rosa', nombre: 'Camisola de raso con encaje', cat: 'dormir', precio: 29900, talles: l('S', 'XL'), stock: 6, img: '03', foco: [0.78, 0.3, 2], color: 'Rosa', desc: 'Raso rosa con escote de encaje y breteles regulables. Va con el short de raso al tono.', tags: 'camisola pijama raso satin dormir' },
  { id: 'short-raso-rosa', nombre: 'Short de raso con moño', cat: 'dormir', precio: 16900, talles: l('S', 'XL'), stock: 9, img: '03', foco: [0.73, 0.64, 2.2], color: 'Rosa', desc: 'Cintura elastizada con moño y ruedo de encaje.', tags: 'short pijama raso satin dormir' },
  { id: 'bata-raso-celeste', nombre: 'Bata de raso celeste con puntilla', cat: 'dormir', precio: 44900, descuento: 20, talles: l('S', 'XL'), stock: 4, img: '02', foco: [0.1, 0.43, 2.2], color: 'Celeste', desc: 'Bata larga con lazo a la cintura y puntilla en las mangas y el ruedo.', tags: 'bata salida de cama raso' },
  { id: 'camison-raso-marfil', nombre: 'Camisón largo de raso marfil', cat: 'dormir', precio: 34900, talles: l('S', 'XL'), stock: 5, img: '02', foco: [0.3, 0.45, 2.8], color: 'Marfil', desc: 'Largo a media pierna, breteles finos y ruedo de encaje.', tags: 'camison pijama raso satin dormir' },
  { id: 'camison-encaje-celeste', nombre: 'Camisón de encaje celeste', cat: 'dormir', precio: 32900, nuevo: true, talles: l('S', 'XL'), stock: 6, img: '02', foco: [0.45, 0.45, 2.8], color: 'Celeste', desc: 'Encaje celeste en el busto y falda de raso con vuelo.', tags: 'camison pijama encaje dormir' },
  { id: 'camisola-raso-champagne', nombre: 'Camisola de raso champagne', cat: 'dormir', precio: 27500, talles: l('S', 'XL'), stock: 0, img: '01', foco: [0.48, 0.86, 2.6], color: 'Champagne', desc: 'Raso champagne con encaje en el escote, liviana para las noches de calor.', tags: 'camisola pijama raso satin dormir' },

  { id: 'pack-boxers-lisos', nombre: 'Pack x3 boxers lisos', cat: 'hombre', precio: 21900, descuento: 10, talles: l('S', 'XXL'), stock: 12, img: '04', foco: [0.27, 0.62, 2.1], color: 'Azul, gris y celeste', desc: 'Tres boxers lisos en azul, gris y celeste, con elástico ancho.', tags: 'boxer calzoncillo ropa interior hombre pack' },
  { id: 'boxer-gris', nombre: 'Boxer gris con elástico azul', cat: 'hombre', precio: 7900, talles: l('S', 'XXL'), stock: 15, img: '01', foco: [0.79, 0.78, 2.4], color: 'Gris', desc: 'Corte clásico con elástico azul marino.', tags: 'boxer calzoncillo ropa interior hombre' },
  { id: 'pack-soquetes', nombre: 'Pack x3 soquetes', cat: 'hombre', precio: 8900, stock: 20, img: '04', foco: [0.53, 0.8, 2.6], color: 'Blanco, gris y negro', desc: 'Blanco, gris y negro, con puño acanalado. Talle 39 al 44.', tags: 'medias soquetes hombre pack' },
  { id: 'remera-basica-blanca', nombre: 'Remera básica blanca', cat: 'hombre', marca: 'Vitnik', cod: '2214', precio: 15900, talles: l('S', 'XXL'), stock: 10, img: '04', foco: [0.58, 0.24, 2.6], color: 'Blanco', desc: 'Cuello redondo y manga corta, para abajo de la camisa o sola.', tags: 'remera camiseta hombre' },
  { id: 'jogger-gris', nombre: 'Jogger gris con cordón', cat: 'hombre', marca: 'Vitnik', cod: '2287', precio: 29900, talles: l('S', 'XXL'), stock: 8, img: '04', foco: [0.77, 0.6, 2.2], color: 'Gris melange', desc: 'Puño en el tobillo, cintura con cordón y bolsillos.', tags: 'jogger pantalon deportivo buzo hombre' },
  { id: 'bata-waffle-azul', nombre: 'Bata waffle azul', cat: 'hombre', precio: 42900, talles: l('M', 'XL'), stock: 4, img: '04', foco: [0.22, 0.27, 2.1], color: 'Azul marino', desc: 'Tejido waffle con cuello chal y cinto.', tags: 'bata salida de bano hombre' },

  { id: 'eau-parfum-floral', nombre: 'Eau de parfum floral 100 ml', cat: 'perfumeria', marca: 'Natura', cod: '76420', precio: 58900, stock: 6, img: '05', foco: [0.65, 0.47, 2.6], desc: 'Fragancia floral para ella en frasco facetado con tapa dorada.', tags: 'perfume fragancia mujer floral' },
  { id: 'perfume-rose', nombre: 'Perfume femenino rosé 75 ml', cat: 'perfumeria', marca: 'Avon', cod: '53817-2', precio: 24900, descuento: 15, stock: 9, img: '05', foco: [0.83, 0.47, 2.5], desc: 'Floral frutal en frasco rosado con tapa dorada.', tags: 'perfume fragancia mujer rosa' },
  { id: 'colonia-amaderada', nombre: 'Colonia masculina amaderada 100 ml', cat: 'perfumeria', marca: 'Bagués', cod: '30215', precio: 19900, stock: 8, img: '04', foco: [0.85, 0.2, 4], desc: 'Notas amaderadas para él, en frasco de vidrio grueso.', tags: 'perfume fragancia colonia hombre' },
  { id: 'body-splash-vainilla', nombre: 'Body splash de vainilla 200 ml', cat: 'perfumeria', marca: 'Bagués', cod: '30488', precio: 12900, nuevo: true, stock: 12, img: '02', foco: [0.2, 0.66, 2.4], desc: 'Bruma liviana para el cuerpo, para retocar durante el día.', tags: 'perfume fragancia splash colonia mujer' },
  { id: 'eau-toilette-citrica', nombre: 'Eau de toilette cítrica 50 ml', cat: 'perfumeria', marca: 'Avon', cod: '48120-7', precio: 18900, stock: 7, img: '01', foco: [0.485, 0.38, 3.6], desc: 'Cítrica y fresca, en un frasco que entra en la cartera.', tags: 'perfume fragancia mujer citrica' },

  { id: 'crema-facial', nombre: 'Crema facial hidratante 50 g', cat: 'cuidado', marca: 'Natura', cod: '65031', precio: 21900, stock: 9, img: '05', foco: [0.41, 0.66, 3.2], desc: 'Textura liviana para la mañana y la noche.', tags: 'crema facial cara hidratante cuidado' },
  { id: 'emulsion-corporal', nombre: 'Emulsión corporal con dosificador 400 ml', cat: 'cuidado', marca: 'Natura', cod: '70214', precio: 18900, descuento: 20, stock: 11, img: '05', foco: [0.49, 0.38, 2.4], desc: 'Hidratación para todo el cuerpo, con válvula dosificadora.', tags: 'crema corporal cuerpo hidratante' },
  { id: 'base-liquida', nombre: 'Base líquida tono medio 30 ml', cat: 'cuidado', marca: 'Avon', cod: '27195-3', precio: 14900, stock: 10, img: '05', foco: [0.34, 0.43, 2.8], desc: 'Cobertura media y terminación natural.', tags: 'maquillaje base' },
  { id: 'labial-cremoso', nombre: 'Labial cremoso rosa', cat: 'cuidado', marca: 'Avon', cod: '10982-1', precio: 7900, stock: 18, img: '05', foco: [0.79, 0.62, 3.4], desc: 'Color rosa con terminación cremosa.', tags: 'maquillaje labial lapiz de labios' },
  { id: 'polvo-compacto', nombre: 'Polvo compacto con espejo', cat: 'cuidado', marca: 'Bagués', cod: '41207', precio: 9900, stock: 13, img: '05', foco: [0.17, 0.6, 3], desc: 'Estuche dorado con espejo y esponja.', tags: 'maquillaje polvo compacto' },
  { id: 'paleta-sombras', nombre: 'Paleta de sombras nude', cat: 'cuidado', marca: 'Avon', cod: '36650-8', precio: 13900, nuevo: true, stock: 9, img: '05', foco: [0.86, 0.77, 3], desc: 'Cuatro tonos nude, mate y satinado.', tags: 'maquillaje sombras ojos' },
  { id: 'serum-facial', nombre: 'Sérum facial con gotero 30 ml', cat: 'cuidado', marca: 'Natura', cod: '88540', precio: 26900, stock: 6, img: '05', foco: [0.535, 0.53, 3.4], desc: 'Gotero para dosificar; se aplica antes de la crema.', tags: 'serum facial cara cuidado' },
  { id: 'set-brochas', nombre: 'Set de brochas de maquillaje', cat: 'cuidado', marca: 'Bagués', cod: '41862', precio: 15900, stock: 7, img: '05', foco: [0.08, 0.4, 2.5], desc: 'Brochas para base, polvo y sombras, con mango dorado.', tags: 'maquillaje brochas pinceles' },

  { id: 'juego-toallas-blanco', nombre: 'Juego de toalla y toallón blanco', cat: 'blanco', precio: 32900, stock: 10, img: '06', foco: [0.42, 0.47, 2.3], color: 'Blanco', desc: 'Toalla de 50×90 y toallón de 70×140, de rizo grueso.', tags: 'toalla toallon bano blanco regalo' },
  { id: 'sabanas-blancas', nombre: 'Juego de sábanas blancas', cat: 'blanco', medidas: { '1 plaza': 39900, '2 plazas': 49900, Queen: 58900, King: 64900 }, stock: 8, img: '06', foco: [0.78, 0.55, 2.3], color: 'Blanco', desc: 'Sábana ajustable, sábana plana y fundas. Elegí la medida de tu colchón.', tags: 'sabanas juego de sabanas cama' },
  { id: 'toallon-gris-perla', nombre: 'Toallón gris perla', cat: 'blanco', precio: 19900, descuento: 10, stock: 12, img: '01', foco: [0.82, 0.3, 2.4], color: 'Gris perla', desc: 'Toallón de 70×140 con guarda en relieve.', tags: 'toallon toalla bano' },
  { id: 'manta-sherpa', nombre: 'Manta sherpa marfil', cat: 'blanco', medidas: { '1 plaza': 36900, '2 plazas': 46900 }, stock: 6, img: '06', foco: [0.16, 0.76, 2.2], color: 'Marfil', desc: 'Abrigada y suave, para el sillón o la cama.', tags: 'manta frazada cama sillon' },
  { id: 'pie-cama-tejido', nombre: 'Pie de cama tejido rosa', cat: 'blanco', medidas: { '2 plazas': 41900, Queen: 47900 }, descuento: 10, stock: 5, img: '06', foco: [0.75, 0.32, 2.4], color: 'Rosa', desc: 'Tejido con relieve y flecos en los extremos.', tags: 'pie de cama manta tejida cama' },
  { id: 'acolchado-matelaseado', nombre: 'Acolchado matelaseado blanco', cat: 'blanco', medidas: { '2 plazas': 89900, Queen: 99900, King: 109900 }, nuevo: true, stock: 4, img: '02', foco: [0.78, 0.75, 2], color: 'Blanco con vivo azul', desc: 'Matelaseado en rombos con vivo azul en el borde.', tags: 'acolchado cubrecama edredon cama' },
  { id: 'almohadon-rosa', nombre: 'Almohadón rosa viejo 45×45', cat: 'blanco', precio: 14900, stock: 10, img: '06', foco: [0.72, 0.15, 2.6], color: 'Rosa viejo', desc: 'Funda con cierre y relleno incluido.', tags: 'almohadon decoracion cama sillon' }
];

const REGALOS = [
  { id: 'conjunto-encaje-rosa', cats: ['lenceria', 'dormir'], rotulo: 'Lencería y para dormir' },
  { id: 'pack-boxers-lisos', cats: ['hombre'], rotulo: 'Hombre' },
  { id: 'eau-parfum-floral', cats: ['perfumeria', 'cuidado'], rotulo: 'Perfumería y cuidado' },
  { id: 'juego-toallas-blanco', cats: ['blanco'], rotulo: 'Blanco' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const nombreCat = id => getCategoria(id)?.nombre || '';
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const soloDigitos = s => String(s ?? '').replace(/\D/g, '');
const clamp01 = v => Math.min(1, Math.max(0, v));
const suave = t => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const fotoArchivo = k => FOTOS[k]?.[0] || '';
const dims = k => FOTOS[k] ? [FOTOS[k][1], FOTOS[k][2]] : [1, 1];

const opciones = p => p.medidas ? Object.keys(p.medidas) : (p.talles || []);
const tipoOpcion = p => p.medidas ? 'medida' : (p.talles?.length ? 'talle' : null);
const precioBase = (p, op) => (p.medidas ? (p.medidas[op] ?? Math.min(...Object.values(p.medidas))) : p.precio);
const precioFinal = (p, op) => { const b = precioBase(p, op); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const precioDesde = p => (p.medidas ? Math.min(...Object.keys(p.medidas).map(k => precioFinal(p, k))) : precioFinal(p));
const varia = p => !!p.medidas && new Set(Object.values(p.medidas)).size > 1;
const rangoTalles = p => { const o = opciones(p); return o.length ? (o.length > 1 ? `${o[0]} a ${o[o.length - 1]}` : o[0]) : ''; };
const cuantos = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;

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
  return `<img src="images/${fotoArchivo(k)}" width="${w}" height="${h}" alt="${esc(alt)}">`;
}

const Cart = {
  KEY: 'nazik_cart',
  memoria: [],
  sinStorage: false,
  get() {
    let items = this.memoria;
    if (!this.sinStorage) { try { items = JSON.parse(localStorage.getItem(this.KEY)); } catch { items = this.memoria; } }
    if (!Array.isArray(items)) items = [];
    return items.filter(i => {
      const p = getProducto(i?.id);
      if (!p || !(i.qty > 0)) return false;
      const ops = opciones(p);
      return ops.length ? ops.includes(i.talle) : i.talle == null;
    }).map(i => ({ id: i.id, talle: i.talle ?? null, qty: Math.min(Math.floor(i.qty), getProducto(i.id).stock || 1) }));
  },
  save(items) {
    this.memoria = items;
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, talle = null) {
    if (!producto || !(producto.stock > 0)) return;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.talle) * i.qty : s; }, 0); }
};

const Revista = {
  KEY: 'nazik_revista',
  memoria: [],
  sinStorage: false,
  get() {
    let items = this.memoria;
    if (!this.sinStorage) { try { items = JSON.parse(localStorage.getItem(this.KEY)); } catch { items = this.memoria; } }
    if (!Array.isArray(items)) return [];
    return items.filter(i => MARCAS.includes(i?.marca) && /^\d{4,7}$/.test(soloDigitos(i.cod)) && i.qty > 0).map(i => ({ marca: i.marca, cod: String(i.cod), qty: Math.min(Math.floor(i.qty), 20) }));
  },
  save(items) {
    this.memoria = items;
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; }
    document.dispatchEvent(new CustomEvent('revista:updated'));
  },
  add(marca, cod, qty) {
    const items = this.get();
    const it = items.find(i => i.marca === marca && soloDigitos(i.cod) === soloDigitos(cod));
    if (it) it.qty = Math.min(it.qty + qty, 20);
    else items.push({ marca, cod, qty: Math.min(qty, 20) });
    this.save(items);
  },
  remove(k) { const items = this.get(); items.splice(k, 1); this.save(items); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); }
};

function buscarPorCodigo(marca, cod) {
  const d = soloDigitos(cod);
  if (d.length < 4) return null;
  return PRODUCTOS.find(p => p.marca === marca && p.cod && soloDigitos(p.cod) === d) || null;
}

function textoRevista(items) {
  if (!items.length) return 'Hola Nazik! Quiero hacer un pedido de revista.';
  const lineas = items.map(i => `• ${i.marca} · cód. ${i.cod} × ${i.qty}`).join('\n');
  return `Hola Nazik! Quiero pedir estos productos de las revistas:\n${lineas}\n¿Me confirmás precio y cuándo llegan?`;
}

function textoPedido(lineas, intro) {
  if (!lineas.length) return `Hola Nazik! ${intro}`;
  const detalle = lineas.map(i => `• ${i.qty} × ${i.p.nombre}${i.talle ? ` (${tipoOpcion(i.p) === 'medida' ? 'medida' : 'talle'} ${i.talle})` : ''}: ${formatearPrecio(precioFinal(i.p, i.talle) * i.qty)}`).join('\n');
  return `Hola Nazik! ${intro}\n${detalle}\nTotal: ${formatearPrecio(lineas.reduce((s, i) => s + precioFinal(i.p, i.talle) * i.qty, 0))}`;
}

function filtrarProductos(lista, est) {
  const palabras = norm(est.q).split(/\s+/).filter(Boolean);
  const out = lista.filter(p => {
    if (est.cats.size && !est.cats.has(p.cat)) return false;
    if (est.marcas.size && !est.marcas.has(p.marca)) return false;
    if (est.talles.size && !opciones(p).some(o => est.talles.has(o))) return false;
    if (est.ofertas && !(p.descuento > 0)) return false;
    if (est.precio) {
      const [min, max] = est.precio.split('-').map(Number);
      const v = precioDesde(p);
      if (v < min || v > max) return false;
    }
    return palabras.every(w => (w.length <= 2 ? p._tokens.has(w) : p._busca.includes(w)));
  });
  const orden = {
    recomendados: (a, b) => a._orden - b._orden,
    menor: (a, b) => precioDesde(a) - precioDesde(b),
    mayor: (a, b) => precioDesde(b) - precioDesde(a),
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a._orden - b._orden
  }[est.orden] || ((a, b) => a._orden - b._orden);
  return out.sort(orden);
}

function prepararDatos() {
  const grupos = CATEGORIAS.map(c => PRODUCTOS.filter(p => p.cat === c.id));
  let n = 0;
  for (let i = 0; grupos.some(g => g[i]); i++) grupos.forEach(g => { if (g[i]) g[i]._orden = n++; });
  PRODUCTOS.forEach(p => {
    p.descuento = p.descuento || 0;
    p.marca = p.marca || '';
    p.cod = p.cod || '';
    if (p.medidas) p.precio = Math.min(...Object.values(p.medidas));
    const texto = norm([p.nombre, p.marca, nombreCat(p.cat), p.color, p.desc, p.tags, opciones(p).join(' '), p.cod ? `cod ${p.cod} ${soloDigitos(p.cod)}` : ''].join(' '));
    p._busca = texto;
    p._tokens = new Set(texto.split(/[^a-z0-9]+/).filter(Boolean));
  });
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

const esModelo2 = document.body.classList.contains('m2');

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
      const rc = el.getBoundingClientRect();
      if (rc.bottom > 0 && rc.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
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
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-marcas li'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.06, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const marco = document.querySelector('[data-parallax]');
  const img = marco?.querySelector('img');
  if (!marco || !img) return;
  gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: marco, start: 'top top', end: 'bottom top', scrub: true } });
}

const estado = { q: '', cats: new Set(), marcas: new Set(), talles: new Set(), precio: '', ofertas: false, orden: 'recomendados', visibles: 16 };

function precioHTML(p, op) {
  const desde = !op && varia(p) ? '<span class="precio-desde">desde</span>' : '';
  const final = op ? precioFinal(p, op) : precioDesde(p);
  const base = op ? precioBase(p, op) : (p.medidas ? Math.min(...Object.values(p.medidas)) : p.precio);
  return p.descuento > 0
    ? `<p class="precio precio--promo">${desde}<b>${formatearPrecio(final)}</b><s>${formatearPrecio(base)}</s></p>`
    : `<p class="precio">${desde}<b>${formatearPrecio(final)}</b></p>`;
}

function badgesHTML(p) {
  const b = [];
  if (!(p.stock > 0)) b.push('<span class="badge badge--agotado">Sin stock</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--promo">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  return b.join('');
}

function stepperHTML(max = 99) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-paso="-1" aria-label="Restar uno" disabled>−</button><output aria-label="Cantidad">1</output><button type="button" data-paso="1" aria-label="Sumar uno"${max <= 1 ? ' disabled' : ''}>+</button></div>`;
}

const ICONO_CARRITO_MAS = '<svg class="lbl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="btn btn--line btn--chico prod-aviso" href="${wspLink(`Hola Nazik! Avisame cuando vuelva: ${p.nombre}`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;
  const tipo = tipoOpcion(p);
  if (tipo) return `<button type="button" class="btn btn--cta btn--chico prod-elegir" data-elegir="${p.id}">Elegir ${tipo}</button>`;
  return `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="btn btn--cta btn--chico prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICONO_CARRITO_MAS}</button></div>`;
}

function lineaMarca(p) {
  if (p.marca) return `${esc(p.marca)}${p.cod ? ` · Cód. ${esc(p.cod)}` : ''}`;
  const o = rangoTalles(p);
  return `${esc(nombreCat(p.cat))}${o ? ` · ${esc(o)}` : ''}`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  return `<li class="card-wrap"${anim}>
    <article class="card${p.stock > 0 ? '' : ' card--agotado'}" data-id="${p.id}">
      <button type="button" class="card-foto recorte" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}" style="${recorte(p.img, p.foco)}">
        ${imgTag(p.img, p.nombre)}
        <span class="card-badges">${badgesHTML(p)}</span>
        <span class="card-ver" aria-hidden="true">Vista rápida</span>
      </button>
      <div class="card-cuerpo">
        <p class="card-marca">${lineaMarca(p)}</p>
        <h3 class="card-nombre">${esc(p.nombre)}</h3>
        ${precioHTML(p)}
        ${accionesHTML(p)}
      </div>
    </article>
  </li>`;
}

function portadaHTML() {
  const cats = [...estado.cats];
  let foto = ['01', [0.5, 0.5, 1]];
  let titulo = 'Toda la tienda';
  if (cats.length === 1) { const c = getCategoria(cats[0]); foto = [c.img, [c.foco[0], c.foco[1], 1.05]]; titulo = c.nombre; }
  else if (cats.length === 2 && cats.includes('perfumeria') && cats.includes('cuidado')) { foto = ['05', [0.5, 0.5, 1]]; titulo = 'Perfumería y cuidado'; }
  else if (cats.length === 2 && cats.includes('lenceria') && cats.includes('dormir')) { foto = ['03', [0.5, 0.5, 1]]; titulo = 'Lencería y para dormir'; }
  else if (cats.length > 1) titulo = cats.map(nombreCat).join(' y ');
  return `<li class="portada" aria-hidden="true">
    <span class="portada-foto recorte" style="${recorte(foto[0], foto[1])}">${imgTag(foto[0])}</span>
    <span class="portada-texto"><span class="portada-kicker">Colección</span><span class="portada-tit">${esc(titulo)}</span><span class="portada-n" data-portada-n></span></span>
  </li>`;
}

function render(opciones2 = {}) {
  const lista = filtrarProductos(PRODUCTOS, estado);
  const grilla = document.getElementById('grilla');
  if (!grilla) return;
  const conPortada = esModelo2;
  const yaPintadas = grilla.querySelectorAll('.card-wrap').length;
  const desde = opciones2.agregar ? yaPintadas : 0;
  const hasta = Math.min(estado.visibles, lista.length);
  const html = lista.slice(desde, hasta).map(p => cardHTML(p)).join('');
  if (opciones2.agregar) grilla.insertAdjacentHTML('beforeend', html);
  else grilla.innerHTML = (conPortada && lista.length ? portadaHTML() : '') + html;
  document.querySelectorAll('[data-n-res]').forEach(el => { el.textContent = lista.length; });
  document.querySelectorAll('[data-portada-n]').forEach(el => { el.textContent = cuantos(lista.length); });
  const vacio = document.getElementById('vacio');
  if (vacio) {
    vacio.hidden = lista.length > 0;
    const q = document.getElementById('vacioQ');
    if (q) q.textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay productos con esos filtros.';
  }
  const verMas = document.getElementById('verMas');
  if (verMas) {
    const resto = lista.length - hasta;
    verMas.hidden = resto <= 0;
    verMas.textContent = `Ver ${Math.min(16, resto)} productos más`;
  }
  sincronizarFiltros();
  revelarNuevos(grilla);
  refrescar();
}

function initFiltrosUI() {
  const fCats = document.getElementById('fCats');
  if (fCats) fCats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="n">${PRODUCTOS.filter(p => p.cat === c.id).length}</span></label>`).join('');
  const fMarcas = document.getElementById('fMarcas');
  if (fMarcas) fMarcas.innerHTML = MARCAS.map(m => `<label class="check"><input type="checkbox" data-f="marca" value="${esc(m)}"><span>${esc(m)}</span><span class="n">${PRODUCTOS.filter(p => p.marca === m).length}</span></label>`).join('');
  const chips = arr => arr.map(t => `<button type="button" class="chip-f" data-talle-f="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('');
  const fTalles = document.getElementById('fTalles');
  if (fTalles) fTalles.innerHTML = `<p class="f-sub">Corpiños</p><div class="chips-f">${chips(T_NUM)}</div><p class="f-sub">Prendas</p><div class="chips-f">${chips(T_LETRA)}</div>`;
  const fMedidas = document.getElementById('fMedidas');
  if (fMedidas) fMedidas.innerHTML = `<div class="chips-f chips-f--medidas">${Object.entries(MEDIDAS).map(([m, cm]) => `<button type="button" class="chip-f" data-talle-f="${esc(m)}" aria-pressed="false">${esc(m)}<small>${cm}</small></button>`).join('')}</div>`;
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = [['', 'Todos los precios'], ...PRECIOS].map(([v, t]) => `<label class="check check--radio"><input type="radio" name="precio" value="${v}"${v === '' ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('');
  const pills = document.getElementById('pills');
  if (pills) pills.innerHTML = [['', 'Todo'], ...CATEGORIAS.map(c => [c.id, c.id === 'cuidado' ? 'Cuidado' : c.nombre])].map(([v, t]) => `<button type="button" class="pill" data-pill="${v}" aria-pressed="false">${esc(t)}</button>`).join('');

  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f="cat"]')) { t.checked ? estado.cats.add(t.value) : estado.cats.delete(t.value); estado.visibles = 16; render(); }
    if (t.matches('input[data-f="marca"]')) { t.checked ? estado.marcas.add(t.value) : estado.marcas.delete(t.value); estado.visibles = 16; render(); }
    if (t.matches('input[name="precio"]')) { estado.precio = t.value; estado.visibles = 16; render(); }
    if (t.id === 'fOfertas') { estado.ofertas = t.checked; estado.visibles = 16; render(); }
    if (t.id === 'orden') { estado.orden = t.value; estado.visibles = 16; render(); }
  });
  const q = document.getElementById('q');
  if (q) {
    let timer = 0;
    q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { estado.q = q.value.trim(); estado.visibles = 16; render(); }, 160); });
    q.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(timer); estado.q = q.value.trim(); estado.visibles = 16; render(); });
  }
  document.querySelectorAll('[data-header-buscar]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const v = form.querySelector('input')?.value.trim() || '';
    Object.assign(estado, { q: v, precio: '', ofertas: false, visibles: 16 });
    estado.cats.clear(); estado.marcas.clear(); estado.talles.clear();
    render();
    irA('#tienda');
  }));
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += 16; render({ agregar: true }); });
}

function contarFiltros() {
  return estado.cats.size + estado.marcas.size + estado.talles.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0);
}

function sincronizarFiltros() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.has(i.value); });
  document.querySelectorAll('input[data-f="marca"]').forEach(i => { i.checked = estado.marcas.has(i.value); });
  document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  document.querySelectorAll('[data-talle-f]').forEach(b => b.setAttribute('aria-pressed', estado.talles.has(b.dataset.talleF) ? 'true' : 'false'));
  const fOfertas = document.getElementById('fOfertas'); if (fOfertas) fOfertas.checked = estado.ofertas;
  const orden = document.getElementById('orden'); if (orden) orden.value = estado.orden;
  const q = document.getElementById('q'); if (q && document.activeElement !== q) q.value = estado.q;
  document.querySelectorAll('[data-pill]').forEach(b => {
    const v = b.dataset.pill;
    const on = v === '' ? estado.cats.size === 0 : estado.cats.size === 1 && estado.cats.has(v);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const n = contarFiltros();
  document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n; el.hidden = n === 0; });
  const activos = document.getElementById('activos');
  if (!activos) return;
  const x = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  const chips = [];
  if (!esModelo2) estado.cats.forEach(c => chips.push([`cat:${c}`, nombreCat(c)]));
  estado.marcas.forEach(m => chips.push([`marca:${m}`, m]));
  estado.talles.forEach(t => chips.push([`talle:${t}`, T_NUM.includes(t) || T_LETRA.includes(t) ? `Talle ${t}` : t]));
  if (estado.precio) chips.push(['precio', PRECIOS.find(([v]) => v === estado.precio)?.[1] || 'Precio']);
  if (estado.ofertas) chips.push(['ofertas', 'Solo ofertas']);
  if (estado.q) chips.push(['q', `«${estado.q}»`]);
  activos.innerHTML = chips.map(([k, t]) => `<button type="button" class="activo" data-quitar="${esc(k)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${x}</button>`).join('');
  activos.hidden = chips.length === 0;
}

function quitarFiltro(k) {
  if (k.startsWith('cat:')) estado.cats.delete(k.slice(4));
  else if (k.startsWith('marca:')) estado.marcas.delete(k.slice(6));
  else if (k.startsWith('talle:')) estado.talles.delete(k.slice(6));
  else if (k === 'precio') estado.precio = '';
  else if (k === 'ofertas') estado.ofertas = false;
  else if (k === 'q') estado.q = '';
  estado.visibles = 16;
  render();
}

function limpiarFiltros() {
  Object.assign(estado, { q: '', precio: '', ofertas: false, visibles: 16 });
  estado.cats.clear(); estado.marcas.clear(); estado.talles.clear();
  render();
}

function irA(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offModelos() - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
}

function aplicarCategorias(cats) {
  const validas = cats.filter(c => getCategoria(c));
  estado.cats = new Set(validas);
  estado.marcas.clear(); estado.talles.clear();
  Object.assign(estado, { q: '', precio: '', ofertas: false, visibles: 16 });
  render();
  setTimeout(() => irA('#tienda'), 0);
}

function initCirculos() {
  const ul = document.getElementById('circulos');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
      <a class="circulo" href="?cat=${c.id}#tienda" data-cat="${c.id}">
        <span class="circulo-foto recorte" style="${recorte(c.img, c.foco)}">${imgTag(c.img)}</span>
        <span class="circulo-nombre">${esc(c.nombre)}</span>
        <span class="circulo-dato">${cuantos(PRODUCTOS.filter(p => p.cat === c.id).length)}</span>
      </a>
    </li>`).join('');
}

function initConteos() {
  document.querySelectorAll('[data-n-cats]').forEach(el => {
    const cats = el.dataset.nCats.split(',');
    el.textContent = cuantos(PRODUCTOS.filter(p => cats.includes(p.cat)).length);
  });
  document.querySelectorAll('[data-n-total]').forEach(el => { el.textContent = PRODUCTOS.length; });
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

function focoAtrapado(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
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

function lineasCarrito() {
  return Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
}

function renderCarrito() {
  const ul = document.getElementById('drawerItems');
  if (!ul) return;
  const lineas = lineasCarrito();
  ul.innerHTML = lineas.map((i, k) => `<li class="d-item" style="animation-delay:${Math.min(k * 0.05, 0.3)}s" data-linea="${i.id}" data-talle="${esc(i.talle ?? '')}">
      <span class="d-item-foto recorte" style="${recorte(i.p.img, i.p.foco)}">${imgTag(i.p.img)}</span>
      <div class="d-item-info">
        <p class="d-item-nombre">${esc(i.p.nombre)}</p>
        <p class="d-item-meta">${i.talle ? `${tipoOpcion(i.p) === 'medida' ? 'Medida' : 'Talle'} ${esc(i.talle)} · ` : ''}${formatearPrecio(precioFinal(i.p, i.talle))} c/u</p>
        <div class="d-item-fila">
          <div class="stepper stepper--chico"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output aria-label="Cantidad">${i.qty}</output><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= (i.p.stock ?? 99) ? ' disabled' : ''}>+</button></div>
          <p class="d-item-precio">${formatearPrecio(precioFinal(i.p, i.talle) * i.qty)}</p>
        </div>
        <button type="button" class="d-item-quitar" data-linea-quitar>Quitar</button>
      </div>
    </li>`).join('');
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  if (vacio) vacio.hidden = lineas.length > 0;
  if (pie) pie.hidden = lineas.length === 0;
  ul.hidden = lineas.length === 0;
  const n = Cart.count();
  const drawerN = document.getElementById('drawerN');
  if (drawerN) drawerN.textContent = n ? `(${n})` : '';
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('drawerWsp');
  if (wsp) wsp.href = wspLink(textoPedido(lineas, 'Quiero hacer este pedido:'));
}

let focoPrevio = null;
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d || !d.hidden) return;
  focoPrevio = document.activeElement;
  renderCarrito();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { d.classList.add('open'); d.querySelector('.drawer-panel')?.focus(); });
  setTimeout(() => { if (!d.classList.contains('open')) d.classList.add('open'); }, 60);
}

function cerrarCarrito(devolver = true) {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  if (devolver) focoPrevio?.focus?.();
}

function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  d.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); focoAtrapado(d, e); });
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const ir = e.target.closest('[data-carrito-ir]');
    if (ir) { cerrarCarrito(false); setTimeout(() => aplicarCategorias([ir.dataset.carritoIr]), reduceMotion ? 0 : 200); return; }
    const li = e.target.closest('[data-linea]');
    if (!li) return;
    const id = li.dataset.linea;
    const talle = li.dataset.talle || null;
    const it = Cart.get().find(x => x.id === id && x.talle === talle);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      Cart.setQty(id, talle, it.qty + Number(paso.dataset.lineaPaso));
      requestAnimationFrame(() => d.querySelector(`[data-linea="${window.CSS.escape(id)}"][data-talle="${window.CSS.escape(talle ?? '')}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus());
    }
    if (e.target.closest('[data-linea-quitar]')) { Cart.remove(id, talle); d.querySelector('.drawer-panel')?.focus(); }
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (!d.hidden) renderCarrito();
  });
  updateCartBadge();
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

let qv = { p: null, op: null, foto: 0, pedir: false };
function fotosDe(p) {
  const out = [[p.img, p.foco]];
  if (p.img !== '01' && p.img !== '02') out.push([p.img, [p.foco[0], p.foco[1], 1]]);
  else out.push([p.img, [p.foco[0], p.foco[1], Math.max(1, p.foco[2] * 0.55)]]);
  return out;
}

function htmlQuick() {
  const p = qv.p;
  const fotos = fotosDe(p);
  const [fImg, fFoco] = fotos[qv.foto] || fotos[0];
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id && x.stock > 0).slice(0, 3);
  const tipo = tipoOpcion(p);
  const ops = opciones(p);
  const falta = qv.pedir && tipo && !qv.op;
  const variantes = tipo ? `
      <div class="qv-ops-tit"><span>${tipo === 'medida' ? 'Medida' : 'Talle'}</span>${tipo === 'medida' ? '<span class="qv-ops-nota">Medida del colchón</span>' : ''}</div>
      <div class="qv-ops${falta ? ' falta' : ''}${tipo === 'medida' ? ' qv-ops--medidas' : ''}" role="radiogroup" aria-label="${tipo === 'medida' ? 'Medida' : 'Talle'}">${ops.map(o => `<button type="button" class="op-chip" role="radio" aria-checked="${qv.op === o}" data-qv-op="${esc(o)}">${tipo === 'medida' ? `${esc(o)}<small>${MEDIDAS[o] || ''}</small>` : esc(o)}</button>`).join('')}</div>
      <p class="qv-aviso"${falta ? '' : ' hidden'}>Elegí ${tipo === 'medida' ? 'la medida' : 'el talle'} y lo sumamos al carrito.</p>` : '';
  const acciones = p.stock > 0 ? `
      <div class="qv-acciones">
        ${stepperHTML(p.stock)}
        <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>` : '<p class="qv-agotado">Sin stock por ahora.</p>';
  const consulta = p.stock > 0 ? `Hola Nazik! Quiero consultar por: ${p.nombre}` : `Hola Nazik! Avisame cuando vuelva: ${p.nombre}`;
  return `<div class="qv-galeria">
      <div class="qv-foto recorte" style="${recorte(fImg, fFoco)}">${imgTag(fImg, p.nombre)}</div>
      <div class="qv-miniaturas">${fotos.map(([im, fo], k) => `<button type="button" class="qv-mini recorte" data-qv-foto="${k}" aria-pressed="${k === qv.foto}" aria-label="Ver la foto ${k + 1} de ${fotos.length}" style="${recorte(im, fo)}">${imgTag(im)}</button>`).join('')}</div>
    </div>
    <div class="qv-info">
      <p class="qv-etiqueta">${p.marca ? `${esc(p.marca)}${p.cod ? ` · Cód. ${esc(p.cod)}` : ''}` : esc(nombreCat(p.cat))}${p.color && norm(p.color) !== norm(nombreCat(p.cat)) ? ` · ${esc(p.color)}` : ''}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <div class="qv-precio">${precioHTML(p, qv.op || (varia(p) ? null : ops[0] || null))}</div>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${variantes}
      ${acciones}
      <a class="qv-consulta" href="${wspLink(consulta + (qv.op ? ` (${tipo} ${qv.op})` : ''))}" target="_blank" rel="noopener">${p.stock > 0 ? 'Consultar por WhatsApp' : 'Avisame por WhatsApp cuando vuelva'}</a>
    </div>
    ${rel.length ? `<div class="qv-rel"><p class="qv-rel-tit">También te puede interesar</p><ul>${rel.map(x => `<li><button type="button" data-quick="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco)}">${imgTag(x.img)}</span><span><b>${esc(x.nombre)}</b>${formatearPrecio(precioDesde(x))}</span></button></li>`).join('')}</ul></div>` : ''}`;
}

function inyectarLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.cod || p.id,
    image: `https://gokywebs.com/demo/nazik/images/${fotoArchivo(p.img)}`, description: p.desc,
    brand: { '@type': 'Brand', name: p.marca || 'Nazik' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
}

function ponerURL(url) {
  try { window.history.replaceState(null, '', url); return true; } catch { return false; }
}

function pintarQuick(enfocar) {
  const cont = document.getElementById('qv');
  if (!cont) return;
  const qty = cont.querySelector('[data-stepper] output')?.textContent;
  cont.innerHTML = htmlQuick();
  if (qty) ponerCantidad(cont.querySelector('[data-stepper]'), Number(qty));
  if (enfocar) cont.querySelector(enfocar)?.focus();
}

function abrirQuick(id, opts = {}) {
  const p = getProducto(id);
  const m = document.getElementById('quick');
  const cont = document.getElementById('qv');
  if (!p || !m || !cont) return;
  const yaAbierto = !m.hidden;
  if (!yaAbierto) focoPrevio = document.activeElement;
  const pre = opts.op ?? [...estado.talles].find(t => opciones(p).includes(t)) ?? null;
  qv = { p, op: pre, foto: 0, pedir: !!opts.pedir };
  cont.innerHTML = htmlQuick();
  inyectarLdProducto(p);
  ponerURL(`?producto=${encodeURIComponent(p.id)}${location.hash}`);
  const panel = m.querySelector('.modal-panel');
  if (panel) panel.scrollTop = 0;
  if (!yaAbierto) {
    m.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => m.classList.add('open'));
    setTimeout(() => { if (!m.classList.contains('open')) m.classList.add('open'); }, 60);
  }
  const foco = qv.pedir && tipoOpcion(p) ? cont.querySelector('[data-qv-op]') : panel;
  setTimeout(() => foco?.focus(), 30);
}

function cerrarQuick(devolver = true) {
  const m = document.getElementById('quick');
  if (!m || m.hidden) return;
  m.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { m.hidden = true; }, reduceMotion ? 0 : 320);
  ponerURL(location.pathname + location.hash);
  if (devolver) focoPrevio?.focus?.();
}

function initQuick() {
  const m = document.getElementById('quick');
  if (!m) return;
  m.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarQuick(); focoAtrapado(m, e); });
  m.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-modal]')) { cerrarQuick(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { qv.foto = Number(foto.dataset.qvFoto); pintarQuick(`[data-qv-foto="${qv.foto}"]`); return; }
    const op = e.target.closest('[data-qv-op]');
    if (op) { qv.op = op.dataset.qvOp; qv.pedir = false; pintarQuick(`[data-qv-op="${window.CSS.escape(qv.op)}"]`); return; }
    const btn = e.target.closest('[data-qv-agregar], [data-qv-comprar]');
    if (btn) {
      const p = qv.p;
      const tipo = tipoOpcion(p);
      if (tipo && !qv.op) { qv.pedir = true; pintarQuick('[data-qv-op]'); return; }
      const qty = Number(m.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, tipo ? qv.op : null);
      if (btn.hasAttribute('data-qv-comprar')) { cerrarQuick(false); setTimeout(abrirCarrito, reduceMotion ? 0 : 340); }
      else showToast(`Sumaste ${qty} × ${p.nombre}${qv.op ? ` (${qv.op})` : ''} al carrito`);
    }
  });
}

function ponerCantidad(stepper, n) {
  if (!stepper) return;
  const max = Number(stepper.dataset.max) || 99;
  const v = Math.max(1, Math.min(max, n));
  const out = stepper.querySelector('output');
  if (out) out.textContent = v;
  const [menos, mas] = stepper.querySelectorAll('[data-paso]');
  if (menos) menos.disabled = v <= 1;
  if (mas) mas.disabled = v >= max;
}

function agregarDesde(boton) {
  const p = getProducto(boton.dataset.add);
  if (!p) return;
  const caja = boton.closest('.card, .revista-hit');
  const qty = Number(caja?.querySelector('[data-stepper] output')?.textContent) || 1;
  if (tipoOpcion(p)) { abrirQuick(p.id, { pedir: true }); return; }
  Cart.add(p, qty, null);
  ponerCantidad(caja?.querySelector('[data-stepper]'), 1);
  showToast(`Sumaste ${qty} × ${p.nombre} al carrito`);
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target;
    const paso = t.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      ponerCantidad(st, (Number(st?.querySelector('output')?.textContent) || 1) + Number(paso.dataset.paso));
      return;
    }
    const add = t.closest('[data-add]');
    if (add) { agregarDesde(add); return; }
    const elegir = t.closest('[data-elegir]');
    if (elegir) { abrirQuick(elegir.dataset.elegir, { pedir: true }); return; }
    const quick = t.closest('[data-quick]');
    if (quick) { abrirQuick(quick.dataset.quick); return; }
    const cats = t.closest('a[data-cats]');
    if (cats) { e.preventDefault(); aplicarCategorias(cats.dataset.cats.split(',')); return; }
    const cat = t.closest('a[data-cat]');
    if (cat) { e.preventDefault(); aplicarCategorias([cat.dataset.cat]); return; }
    const pill = t.closest('[data-pill]');
    if (pill) { estado.cats = new Set(pill.dataset.pill ? [pill.dataset.pill] : []); estado.visibles = 16; render(); return; }
    const talleF = t.closest('[data-talle-f]');
    if (talleF) { const v = talleF.dataset.talleF; estado.talles.has(v) ? estado.talles.delete(v) : estado.talles.add(v); estado.visibles = 16; render(); return; }
    if (t.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (t.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (t.closest('[data-limpiar]')) { limpiarFiltros(); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) { quitarFiltro(quitar.dataset.quitar); return; }
    if (t.closest('[data-ir-buscar]')) {
      e.preventDefault();
      irA('#tienda');
      setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 500);
    }
  });
}

function initFiltrosDrawer() {
  const f = document.getElementById('filtros');
  const btn = document.getElementById('abrirFiltros');
  if (!f || !btn) return;
  const mq = window.matchMedia(esModelo2 ? '(min-width: 0px)' : '(max-width: 1024px)');
  let fondo = document.querySelector('.filtros-fondo');
  if (!fondo) { fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; document.body.appendChild(fondo); }
  const mostrar = () => f.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (mq.matches) mostrar();
  const abrir = () => {
    mostrar();
    f.classList.add('open'); fondo.classList.add('open');
    f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(() => f.querySelector('.filtros-cerrar')?.focus(), 40);
  };
  const cerrar = (devolver = true) => {
    if (!f.classList.contains('open')) return;
    f.classList.remove('open'); fondo.classList.remove('open');
    f.removeAttribute('role'); f.removeAttribute('aria-modal');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (devolver) btn.focus();
  };
  btn.addEventListener('click', abrir);
  fondo.addEventListener('click', () => cerrar());
  f.addEventListener('click', e => { if (e.target.closest('[data-filtros-cerrar]')) cerrar(); });
  f.addEventListener('keydown', e => { if (!f.classList.contains('open')) return; if (e.key === 'Escape') cerrar(); focoAtrapado(f, e); });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(false); });
}

function initRevista() {
  const form = document.getElementById('revistaForm');
  if (!form) return;
  const input = document.getElementById('revistaCod');
  const ayuda = document.getElementById('revistaAyuda');
  const error = document.getElementById('revistaError');
  const res = document.getElementById('revistaResultado');
  const ul = document.getElementById('revistaItems');
  const vacia = document.getElementById('revistaVacia');
  const wsp = document.getElementById('revistaWsp');
  const nEl = document.getElementById('revistaN');
  const stepper = form.querySelector('[data-stepper]');
  const marca = () => form.querySelector('input[name="revista-marca"]:checked')?.value || 'Natura';

  const pintarResultado = () => {
    const d = soloDigitos(input.value);
    const m = marca();
    const p = buscarPorCodigo(m, input.value);
    if (p) {
      const tipo = tipoOpcion(p);
      res.innerHTML = `<div class="revista-hit">
          <span class="revista-hit-foto recorte" style="${recorte(p.img, p.foco)}">${imgTag(p.img)}</span>
          <div class="revista-hit-info"><p class="revista-hit-tag">Lo tenemos en Nazik</p><p class="revista-hit-nombre">${esc(p.nombre)}</p>${precioHTML(p)}</div>
          ${tipo ? `<button type="button" class="btn btn--cta btn--chico" data-elegir="${p.id}">Elegir ${tipo}</button>` : `<button type="button" class="btn btn--cta btn--chico" data-revista-add="${p.id}">Agregar al carrito</button>`}
        </div>`;
      res.dataset.estado = 'hit';
    } else if (d.length >= 4) {
      res.innerHTML = `<p class="revista-msj"><b>${esc(m)} · cód. ${esc(input.value.trim())}</b> no está en la tienda online. Sumalo al pedido de revista y te confirmamos precio y entrega por WhatsApp.</p>`;
      res.dataset.estado = 'pedido';
    } else {
      res.innerHTML = `<p class="revista-msj">Escribí el código y te decimos si lo tenemos acá o si lo pedimos con la revista.</p>`;
      res.dataset.estado = 'vacio';
    }
  };

  const pintarLista = () => {
    const items = Revista.get();
    ul.innerHTML = items.map((i, k) => `<li class="revista-item"><span class="revista-item-marca">${esc(i.marca)}</span><span class="revista-item-cod">Cód. ${esc(i.cod)}</span><span class="revista-item-qty">× ${i.qty}</span><button type="button" class="revista-item-quitar" data-revista-quitar="${k}" aria-label="Quitar ${esc(i.marca)} código ${esc(i.cod)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`).join('');
    ul.hidden = items.length === 0;
    vacia.hidden = items.length > 0;
    const n = Revista.count();
    nEl.textContent = n ? `(${n})` : '';
    wsp.href = wspLink(textoRevista(items));
    wsp.setAttribute('aria-disabled', items.length ? 'false' : 'true');
    wsp.classList.toggle('is-off', !items.length);
  };

  const actualizarMarca = () => {
    const a = AYUDA_REVISTA[marca()];
    input.placeholder = `Ej.: ${a.ej}`;
    ayuda.textContent = a.txt;
    pintarResultado();
  };

  form.addEventListener('change', e => { if (e.target.name === 'revista-marca') actualizarMarca(); });
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^\d-]/g, '').slice(0, 9);
    input.removeAttribute('aria-invalid');
    error.hidden = true;
    pintarResultado();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = soloDigitos(input.value);
    if (d.length < 4 || d.length > 7) {
      input.setAttribute('aria-invalid', 'true');
      error.hidden = false;
      input.focus();
      return;
    }
    const qty = Number(stepper?.querySelector('output')?.textContent) || 1;
    const p = buscarPorCodigo(marca(), input.value);
    if (p) {
      if (tipoOpcion(p)) { abrirQuick(p.id, { pedir: true }); return; }
      Cart.add(p, qty, null);
      showToast(`Lo teníamos: sumaste ${qty} × ${p.nombre} al carrito`);
    } else {
      Revista.add(marca(), input.value.trim(), qty);
      showToast(`Sumaste ${marca()} · cód. ${input.value.trim()} × ${qty} al pedido de revista`);
    }
    input.value = '';
    ponerCantidad(stepper, 1);
    pintarResultado();
  });
  res.addEventListener('click', e => {
    const b = e.target.closest('[data-revista-add]');
    if (!b) return;
    const p = getProducto(b.dataset.revistaAdd);
    const qty = Number(stepper?.querySelector('output')?.textContent) || 1;
    if (!p) return;
    Cart.add(p, qty, null);
    showToast(`Sumaste ${qty} × ${p.nombre} al carrito`);
  });
  ul.addEventListener('click', e => {
    const b = e.target.closest('[data-revista-quitar]');
    if (!b) return;
    Revista.remove(Number(b.dataset.revistaQuitar));
    input.focus();
  });
  wsp.addEventListener('click', e => {
    if (Revista.get().length) return;
    e.preventDefault();
    showToast('Sumá al menos un código para mandar el pedido');
    input.focus();
  });
  document.addEventListener('revista:updated', pintarLista);
  actualizarMarca();
  pintarLista();
}

function initRegalos() {
  const sec = document.getElementById('regalos');
  if (!sec) return;
  const pista = sec.querySelector('.regalos-pista');
  const escena = sec.querySelector('.regalos-escena');
  const cajas = [...sec.querySelectorAll('[data-caja]')];
  const textos = [...sec.querySelectorAll('[data-regalo]')];
  const puntos = [...sec.querySelectorAll('[data-punto]')];
  const N = cajas.length;
  REGALOS.forEach((g, i) => {
    const p = getProducto(g.id);
    const t = textos[i];
    if (!p || !t) return;
    const lista = PRODUCTOS.filter(x => g.cats.includes(x.cat));
    const dato = t.querySelector('[data-regalo-dato]');
    if (dato) dato.textContent = `${g.rotulo} · ${cuantos(lista.length)} desde ${formatearPrecio(Math.min(...lista.map(precioDesde)))}`;
    const precio = t.querySelector('[data-regalo-precio]');
    if (precio) precio.innerHTML = precioHTML(p);
    const ver = t.querySelector('[data-regalo-ver]');
    if (ver) ver.textContent = `Ver ${lista.length === 1 ? 'el' : 'los'} ${lista.length}`;
  });
  sec.addEventListener('click', e => {
    const talle = e.target.closest('[data-regalo-talle]');
    if (talle) {
      const [id, op] = talle.dataset.regaloTalle.split('|');
      const p = getProducto(id);
      if (!p) return;
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre} (talle ${op}) al carrito`);
      return;
    }
    const add = e.target.closest('[data-regalo-add]');
    if (add) {
      const p = getProducto(add.dataset.regaloAdd);
      if (!p) return;
      Cart.add(p, 1, null);
      showToast(`Sumaste ${p.nombre} al carrito`);
    }
  });
  if (reduceMotion) {
    sec.classList.add('is-static');
    textos.forEach(t => { t.classList.add('activo'); t.removeAttribute('aria-hidden'); t.removeAttribute('inert'); });
    cajas.forEach(c => c.classList.add('abierta'));
    return;
  }
  let frame = 0;
  let activo = -1;
  const pone = (el, tr, op) => { if (!el) return; el.style.transform = tr; if (op !== undefined) el.style.opacity = op; };
  const update = () => {
    frame = 0;
    const OFF = offModelos();
    const rc = pista.getBoundingClientRect();
    const total = pista.offsetHeight - escena.offsetHeight;
    const p = total > 0 ? clamp01((OFF - rc.top) / total) : 0;
    const x = Math.min(p * N, N - 0.0001);
    cajas.forEach((c, i) => {
      const u = x - i;
      const ultima = i === N - 1;
      let op = 1, sc = 1, ty = 0;
      if (u < -0.16 || (!ultima && u >= 1)) { c.style.opacity = '0'; c.style.visibility = 'hidden'; return; }
      if (u < 0) { const e = (u + 0.16) / 0.16; op = suave(e); sc = 1.04 - 0.04 * suave(e); ty = -14 * (1 - suave(e)); }
      else if (!ultima && u > 0.86) { const e = (u - 0.86) / 0.14; op = 1 - suave(e); sc = 1 - 0.05 * suave(e); ty = 16 * suave(e); }
      c.style.visibility = 'visible';
      c.style.opacity = op.toFixed(3);
      c.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
      const a = suave((u - 0.06) / 0.26);
      const b = suave((u - 0.22) / 0.3);
      pone(c.querySelector('.caja-tapa'), `translate3d(${(a * 8).toFixed(1)}%, ${(-a * 64).toFixed(1)}%, 0) rotate(${(-a * 9).toFixed(2)}deg) scale(${(1 + a * 0.06).toFixed(3)})`, (1 - suave((a - 0.45) / 0.55)).toFixed(3));
      pone(c.querySelector('.caja-seda--a'), `translate3d(${(-b * 36).toFixed(1)}%, ${(-b * 48).toFixed(1)}%, 0) rotate(${(-2 - b * 12).toFixed(2)}deg)`, (1 - b * 0.96).toFixed(3));
      pone(c.querySelector('.caja-seda--b'), `translate3d(${(b * 32).toFixed(1)}%, ${(-b * 42).toFixed(1)}%, 0) rotate(${(1.5 + b * 10).toFixed(2)}deg)`, (1 - b * 0.96).toFixed(3));
      pone(c.querySelector('.caja-fondo img'), `scale(${(1.1 - 0.1 * b).toFixed(4)})`);
      c.classList.toggle('abierta', b > 0.6);
    });
    const idx = Math.min(N - 1, Math.floor(x + 0.08));
    if (idx !== activo) {
      activo = idx;
      textos.forEach((t, i) => {
        const on = i === idx;
        t.classList.toggle('activo', on);
        t.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) t.removeAttribute('inert'); else t.setAttribute('inert', '');
      });
      puntos.forEach((d, i) => d.classList.toggle('activo', i === idx));
      sec.dataset.paso = String(idx);
    }
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', update);
  update();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const pos = [-31.4167, -64.1833];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(pos, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span class="pin-sello"><span>N</span></span>', iconSize: [46, 46], iconAnchor: [23, 56] });
  L.marker(pos, { icon: icono, title: 'Nazik', keyboard: false }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function abrirDesdeURL() {
  const params = new URLSearchParams(location.search);
  const cats = (params.get('cat') || '').split(',').filter(c => getCategoria(c));
  if (cats.length) { estado.cats = new Set(cats); render(); }
  const id = params.get('producto');
  if (id && getProducto(id)) abrirQuick(id);
}

prepararDatos();
initModelBarScroll();
initCirculos();
initConteos();
initFiltrosUI();
render();
initReveals();
initHeroMotion();
initParallax();
initNav();
initCarrito();
initFloats();
initQuick();
initFiltrosDrawer();
initRevista();
initRegalos();
initDelegacion();
initMapa();
abrirDesdeURL();
