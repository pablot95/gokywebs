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

const WSP = '5491168555730';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const SALUDO = 'Hola, Revestimientos Nick!';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'porcelanato', nombre: 'Porcelanato', bajada: 'Símil mármol y símil madera, de 60 × 60 a 80 × 160.', img: 'images/p-calacatta.webp', xs: 'images/p-calacatta-xs.webp' },
  { id: 'marmol', nombre: 'Mármol', bajada: 'Placas pulidas de piedra natural.', img: 'images/p-verde.webp', xs: 'images/p-verde-xs.webp' },
  { id: 'travertino', nombre: 'Travertino', bajada: 'Piedra natural apomazada para pisos y paredes.', img: 'images/p-travertino.webp', xs: 'images/p-travertino-xs.webp' },
  { id: 'piedras', nombre: 'Piedras', bajada: 'Paneles de piedra para muros y fachadas.', img: 'images/p-piedra.webp', xs: 'images/p-piedra-xs.webp' },
  { id: 'ceramica', nombre: 'Cerámica', bajada: 'Esmaltada, en colores, para baños y cocinas.', img: 'images/p-ceramica.webp', xs: 'images/p-ceramica-xs.webp' },
  { id: 'venecitas', nombre: 'Venecitas', bajada: 'Mallas de vidrio para piletas, baños y duchas.', img: 'images/p-venecitas.webp', xs: 'images/p-venecitas-xs.webp' },
  { id: 'liquido', nombre: 'Porcelanato líquido', bajada: 'Piso continuo, sin juntas y de alto brillo.', img: 'images/p-liquido.webp', xs: 'images/p-liquido-xs.webp' },
];
const USOS = {
  pisos: { nombre: 'Pisos', para: 'para pisos', txt: 'Porcelanato en gran formato, símil madera, travertino y porcelanato líquido para pisos de interior.' },
  paredes: { nombre: 'Paredes', para: 'para paredes', txt: 'Paneles de piedra, cerámica esmaltada, mármol y porcelanato para revestir muros.' },
  bano: { nombre: 'Baño', para: 'para el baño', txt: 'Porcelanato pulido, cerámica, mármol y venecitas para pisos, paredes y duchas.' },
  cocina: { nombre: 'Cocina', para: 'para la cocina', txt: 'Cerámica para el salpicadero y porcelanato o mármol para pisos y paredes.' },
  exterior: { nombre: 'Exterior', para: 'para exterior', txt: 'Piedra laja para frentes y quinchos, y travertino para galerías y patios.' },
  pileta: { nombre: 'Pileta', para: 'para la pileta', txt: 'Venecitas para el vaso y travertino para el borde y el solárium.' },
};
const ASPECTOS = { marmol: 'Símil mármol', madera: 'Símil madera', natural: 'Piedra natural', color: 'Color', continuo: 'Sin juntas' };
const RANGOS = {
  hasta30: { nombre: 'Hasta $30.000 el m²', max: 30000 },
  '30a50': { nombre: '$30.000 a $50.000 el m²', min: 30001, max: 50000 },
  mas50: { nombre: 'Más de $50.000 el m²', min: 50001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio por m²', 'precio-desc': 'Mayor precio por m²', nombre: 'Nombre (A-Z)' };
const TRABAJOS = {
  pisos: 'Pisos de porcelanato y cerámica',
  paredes: 'Revestimiento de paredes',
  banos: 'Baños y cocinas',
  piletas: 'Piletas con venecitas',
  piedra: 'Muros y fachadas de piedra',
  liquido: 'Porcelanato líquido',
};
const NOTA_NATURAL = 'Es piedra natural: el tono y el dibujo cambian de una pieza a otra.';

const PRODUCTOS = [
  { id: 'porcelanato-calacatta', nombre: 'Porcelanato Calacatta blanco pulido', cat: 'porcelanato', aspecto: 'marmol', terminacion: 'Pulido', venta: 'caja',
    usos: ['pisos', 'paredes', 'bano', 'cocina'],
    ops: [{ v: '60 × 60 cm', pm2: 32900, m2: 1.44, piezas: 4 }, { v: '60 × 120 cm', pm2: 38900, m2: 1.44, piezas: 2 }],
    descuento: 0, stock: 40, rango: 1, alta: 9, img: 'images/p-calacatta.webp', xs: 'images/p-calacatta-xs.webp', alt: 'Placa de porcelanato blanco con vetas grises en un exhibidor',
    desc: 'Blanco con vetas grises bien marcadas y superficie pulida de alto brillo. En 60 × 120 lleva menos juntas y el ambiente se ve más grande.',
    tags: ['statuario', 'carrara', 'blanco', 'brillante', 'gran formato', 'marmolado'] },
  { id: 'porcelanato-crema', nombre: 'Porcelanato Crema marfil pulido', cat: 'porcelanato', aspecto: 'marmol', terminacion: 'Pulido', venta: 'caja',
    usos: ['pisos', 'paredes', 'bano'],
    ops: [{ v: '60 × 120 cm', pm2: 36900, m2: 1.44, piezas: 2 }, { v: '80 × 160 cm', pm2: 47900, m2: 2.56, piezas: 2 }],
    descuento: 0, stock: 24, rango: 2, alta: 12, img: 'images/p-crema.webp', xs: 'images/p-crema-xs.webp', alt: 'Superficie de porcelanato color marfil con vetas suaves color arena',
    desc: 'Fondo marfil con vetas color arena, en gran formato. Combina con maderas claras y griferías doradas.',
    tags: ['beige', 'botticino', 'marfil', 'crema', 'brillante', 'gran formato', 'marmolado'] },
  { id: 'porcelanato-madera', nombre: 'Porcelanato símil madera roble', cat: 'porcelanato', aspecto: 'madera', terminacion: 'Mate', venta: 'caja',
    usos: ['pisos'],
    ops: [{ v: '20 × 120 cm', pm2: 27900, m2: 1.44, piezas: 6 }, { v: '26 × 160 cm', pm2: 31900, m2: 1.66, piezas: 4 }],
    descuento: 0, stock: 36, rango: 3, alta: 8, img: 'images/p-madera.webp', xs: 'images/p-madera-xs.webp', alt: 'Tablas de porcelanato símil madera de roble apoyadas en el piso',
    desc: 'Tablas con el veteado y el tono del roble, en terminación mate. Se coloca como un piso de madera y no hay que pulirlo ni plastificarlo.',
    tags: ['madera', 'roble', 'tablas', 'piso', 'deck', 'parquet'] },
  { id: 'porcelanato-gris', nombre: 'Porcelanato gris símil mármol pulido', cat: 'porcelanato', aspecto: 'marmol', terminacion: 'Pulido', venta: 'caja',
    usos: ['pisos', 'paredes', 'bano', 'cocina'],
    ops: [{ v: '60 × 60 cm', pm2: 29900, m2: 1.44, piezas: 4 }, { v: '60 × 120 cm', pm2: 35900, m2: 1.44, piezas: 2 }],
    descuento: 0, stock: 30, rango: 4, alta: 7, img: 'images/p-gris.webp', xs: 'images/p-gris-xs.webp', alt: 'Placa de porcelanato gris con vetas onduladas y superficie brillante',
    desc: 'Gris con vetas onduladas, al estilo de un mármol bardiglio. En pisos de mucho uso disimula el polvo mejor que un blanco.',
    tags: ['gris', 'bardiglio', 'brillante', 'marmolado'] },
  { id: 'marmol-verde', nombre: 'Mármol verde Guatemala pulido', cat: 'marmol', aspecto: 'natural', terminacion: 'Pulido', venta: 'caja',
    usos: ['paredes', 'bano', 'cocina'],
    ops: [{ v: '30 × 60 cm', pm2: 84900, m2: 0.72, piezas: 4 }, { v: '60 × 60 cm', pm2: 89900, m2: 0.72, piezas: 2 }],
    descuento: 0, stock: 8, rango: 5, alta: 10, img: 'images/p-verde.webp', xs: 'images/p-verde-xs.webp', alt: 'Placa de mármol verde oscuro con vetas blancas, pulida',
    desc: 'Mármol verde oscuro con vetas blancas: cada placa tiene su propio dibujo. Para revestir baños, frentes de barra y paredes que se quieren lucir.',
    nota: NOTA_NATURAL, tags: ['verde', 'guatemala', 'piedra natural', 'brillante'] },
  { id: 'travertino-clasico', nombre: 'Travertino clásico apomazado', cat: 'travertino', aspecto: 'natural', terminacion: 'Apomazado', venta: 'caja',
    usos: ['pisos', 'paredes', 'exterior', 'pileta'],
    ops: [{ v: '40 × 40 cm', pm2: 49900, m2: 0.96, piezas: 6 }, { v: '30 × 60 cm', pm2: 52900, m2: 1.08, piezas: 6 }],
    descuento: 0, stock: 14, rango: 6, alta: 6, img: 'images/p-travertino.webp', xs: 'images/p-travertino-xs.webp', alt: 'Placas de travertino color arena apiladas, con sus poros naturales',
    desc: 'Travertino color arena con sus poros naturales y la superficie apomazada, sin brillo. Clásico en bordes de pileta, galerías y pisos de interior.',
    nota: NOTA_NATURAL, tags: ['beige', 'arena', 'piedra natural', 'borde', 'solarium', 'romano'] },
  { id: 'piedra-laja-negra', nombre: 'Panel de piedra laja negra', cat: 'piedras', aspecto: 'natural', terminacion: 'Natural', venta: 'caja',
    usos: ['paredes', 'exterior'],
    ops: [{ v: '15 × 60 cm', pm2: 34900, m2: 0.54, piezas: 6 }],
    descuento: 0, stock: 20, rango: 7, alta: 11, img: 'images/p-piedra.webp', xs: 'images/p-piedra-xs.webp', alt: 'Panel de piedra laja negra en tiras irregulares superpuestas',
    desc: 'Tiras de laja negra pegadas en paneles de 15 × 60, para armar un muro de piedra sin colocar pieza por pieza. Para frentes, quinchos y paredes de living.',
    nota: NOTA_NATURAL, tags: ['negra', 'pizarra', 'laja', 'fachada', 'frente', 'muro', 'quincho'] },
  { id: 'venecitas-azul', nombre: 'Venecitas de vidrio azul mix', cat: 'venecitas', aspecto: 'color', terminacion: 'Brillante', venta: 'caja',
    usos: ['pileta', 'bano'],
    ops: [{ v: 'Malla 30 × 30 cm', pm2: 21900, m2: 1.98, piezas: 22, pieza: 'mallas' }],
    descuento: 0, stock: 50, rango: 8, alta: 5, img: 'images/p-venecitas.webp', xs: 'images/p-venecitas-xs.webp', alt: 'Malla de venecitas de vidrio cuadradas en varios tonos de azul',
    desc: 'Venecitas de vidrio de 2,5 × 2,5 cm en tres tonos de azul, armadas en mallas de 30 × 30. La caja trae 22 mallas.',
    tags: ['azul', 'pileta', 'piscina', 'vidrio', 'mosaico', 'ducha'] },
  { id: 'ceramica-verde', nombre: 'Cerámica esmaltada verde salvia', cat: 'ceramica', aspecto: 'color', terminacion: 'Brillante', venta: 'caja',
    usos: ['paredes', 'bano', 'cocina'],
    ops: [{ v: '13 × 13 cm', pm2: 33900, m2: 0.51, piezas: 30 }],
    descuento: 0, stock: 4, rango: 9, alta: 13, img: 'images/p-ceramica.webp', xs: 'images/p-ceramica-xs.webp', alt: 'Azulejos cuadrados de cerámica verde con esmalte brillante y bordes irregulares',
    desc: 'Azulejo verde salvia con esmalte brillante y bordes con relieve, de aire artesanal. Para el salpicadero de la cocina y las paredes del baño.',
    tags: ['verde', 'azulejo', 'salpicadero', 'artesanal', 'zellige'] },
  { id: 'porcelanato-liquido', nombre: 'Porcelanato líquido blanco perla', cat: 'liquido', aspecto: 'continuo', terminacion: 'Alto brillo', venta: 'kit',
    usos: ['pisos'],
    ops: [{ v: 'Kit para 5 m²', pm2: 27900, m2: 5 }, { v: 'Kit para 10 m²', pm2: 26900, m2: 10 }],
    descuento: 0, stock: 10, rango: 10, alta: 4, img: 'images/p-liquido.webp', xs: 'images/p-liquido-xs.webp', alt: 'Piso blanco continuo y brillante que refleja las luces del techo',
    desc: 'Revestimiento autonivelante que queda como un piso continuo, sin juntas y con brillo espejo. Lo vendemos en kits por superficie y también lo aplicamos.',
    nota: 'Se aplica sobre una carpeta firme y nivelada. Si querés que lo apliquemos nosotros, pedí el presupuesto de colocación.',
    tags: ['epoxi', 'resina', 'autonivelante', 'sin juntas', 'continuo', 'blanco'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/×/g, 'x').toLowerCase();
const precioM2 = (p, op) => (p.descuento > 0 ? Math.round(op.pm2 * (1 - p.descuento / 100)) : op.pm2);
const precioUnidad = (p, op) => Math.round(precioM2(p, op) * op.m2);
const desdeM2 = p => Math.min(...p.ops.map(op => precioM2(p, op)));
const unidadDe = (p, n = 1) => (p.venta === 'kit' ? (n === 1 ? 'kit' : 'kits') : (n === 1 ? 'caja' : 'cajas'));
const fmtNum = n => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 });
const fmtM2 = n => `${fmtNum(n)} m²`;
const leerNumero = v => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : 0; };

function calcularCajas(m2, extra, m2Unidad) {
  if (!(m2 > 0) || !(m2Unidad > 0)) return { n: 0, conExtra: 0, total: 0 };
  const conExtra = m2 * (1 + (extra || 0) / 100);
  const n = Math.ceil(conExtra / m2Unidad - 1e-9);
  return { n, conExtra, total: Math.round(n * m2Unidad * 100) / 100 };
}

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.pm2 * (1 - p.descuento / 100)) : op.pm2)));
  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), aspecto = lista(f.aspecto), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (uso.length && !(p.usos || []).some(u => uso.includes(u))) return false;
    if (aspecto.length && !aspecto.includes(p.aspecto)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, p.desc, ASPECTOS[p.aspecto], p.terminacion,
      ...(p.usos || []).map(u => `${USOS[u]?.nombre || ''} ${USOS[u]?.para || ''}`),
      ...p.ops.map(op => `${op.v} ${String(op.v).replace(/\s/g, '')}`), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

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
      if (palabras.every(w => textoDe(p).includes(w))) {
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
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];

const Cart = {
  KEY: 'revestimientosnick_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnidad(p, opDe(p, i.v)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  cajas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

const catNombre = p => CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
const medidaCorta = op => String(op.v).replace(/ cm$/, '');
function lineaUnidad(p, op) {
  if (p.venta === 'kit') return `${op.v} · ${formatearPrecio(precioUnidad(p, op))}`;
  return `Caja de ${fmtM2(op.m2)} · ${formatearPrecio(precioUnidad(p, op))}`;
}
function detalleUnidad(p, op) {
  if (p.venta === 'kit') return `Rinde ${fmtM2(op.m2)}`;
  return `Caja de ${fmtM2(op.m2)} · ${op.piezas} ${op.pieza || 'piezas'}`;
}

function cardHTML(p, { anim = true } = {}) {
  const varias = p.ops.length > 1;
  const op0 = p.ops[0];
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (p.stock > 0 && p.stock <= 5) badge = `<span class="pcard__badge">Últimas ${unidadDe(p, 2)}</span>`;
  else if (p.alta >= 12) badge = '<span class="pcard__badge pcard__badge--nuevo">Nuevo ingreso</span>';
  const sinStock = !(p.stock > 0);
  const linea = varias ? `${p.ops.map(medidaCorta).join(' · ')}` : lineaUnidad(p, op0);
  return `<article class="pcard" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></div>
    <span class="pcard__aspecto">${esc(ASPECTOS[p.aspecto] || '')}</span>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(catNombre(p))} · ${esc(p.terminacion)}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__precio">${varias ? '<span class="desde">desde</span>' : ''}<b>${formatearPrecio(desdeM2(p))}</b><span class="pcard__m2">el m²</span>${p.descuento > 0 ? `<s>${formatearPrecio(Math.min(...p.ops.map(o => o.pm2)))}</s>` : ''}</p>
    <p class="pcard__caja">${esc(linea)}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar una ${unidadDe(p)}">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar una ${unidadDe(p)}">${ICO.mas}</button></div>
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
  if (PAGINA === 'catalogo') {
    bar.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => {
      a.addEventListener('click', () => {
        const u = new URLSearchParams(location.search);
        u.delete('producto');
        const qs = u.toString();
        a.setAttribute('href', a.getAttribute('href').split('?')[0] + (qs ? '?' + qs : ''));
      });
    });
  }
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
    nav.querySelector('a, .nav-dd__btn')?.focus();
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

function initDropdowns(actual = {}) {
  document.querySelectorAll('[data-cats-lista]').forEach(lista => {
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === actual.cat ? ' aria-current="page"' : ''}><img src="${c.xs}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><span class="nav-dd__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
  });
  document.querySelectorAll('[data-usos-lista]').forEach(lista => {
    lista.innerHTML = Object.entries(USOS).map(([id, u]) => `<li><a href="${URL_CATALOGO}?uso=${id}"${id === actual.uso ? ' aria-current="page"' : ''}><span>${esc(u.nombre)}</span><span class="nav-dd__n">${Tienda.contar({ uso: id })}</span></a></li>`).join('');
  });
  document.querySelectorAll('[data-dd]').forEach(box => {
    const btn = box.querySelector('.nav-dd__btn');
    const panel = box.querySelector('.nav-dd__panel');
    if (!btn || !panel) return;
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => {
      clearTimeout(t);
      document.querySelectorAll('[data-dd] .nav-dd__panel').forEach(p => { if (p !== panel && hoverMq.matches) { p.hidden = true; p.closest('[data-dd]')?.querySelector('.nav-dd__btn')?.setAttribute('aria-expanded', 'false'); } });
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
    };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
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
      try { vp.setPointerCapture?.(pointerId); } catch (e) { void e; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (e) { void e; }
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

function initAmbientes() {
  const tabs = document.querySelector('[data-amb-tabs]');
  const grid = document.querySelector('[data-amb-grid]');
  if (!tabs || !grid) return;
  const ids = Object.keys(USOS);
  let actual = ids[0];
  tabs.innerHTML = ids.map(id => `<button type="button" role="tab" class="amb-tab" id="ambTab-${id}" aria-controls="ambPanel" aria-selected="${id === actual}" tabindex="${id === actual ? 0 : -1}" data-uso="${id}">${esc(USOS[id].nombre)}<small>${Tienda.contar({ uso: id })}</small></button>`).join('');
  const panel = document.getElementById('ambPanel');
  const tit = document.querySelector('[data-amb-tit]');
  const txt = document.querySelector('[data-amb-txt]');
  const link = document.querySelector('[data-amb-link]');
  const pintar = () => {
    const u = USOS[actual];
    const { items } = Tienda.consultar({ filtros: { uso: actual }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    const total = Tienda.contar({ uso: actual });
    if (tit) tit.textContent = `${u.nombre}`;
    if (txt) txt.textContent = u.txt;
    if (link) {
      link.href = `${URL_CATALOGO}?uso=${actual}`;
      link.querySelector('span').textContent = `Ver ${total === 1 ? 'el producto' : `los ${total} productos`} ${u.para}`;
    }
    panel?.setAttribute('aria-labelledby', `ambTab-${actual}`);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    tabs.querySelectorAll('[role="tab"]').forEach(b => {
      const on = b.dataset.uso === actual;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[role="tab"]');
    if (!b || b.dataset.uso === actual) return;
    actual = b.dataset.uso;
    pintar();
  });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const i = ids.indexOf(actual);
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length;
    actual = ids[j];
    pintar();
    const b = tabs.querySelector(`[data-uso="${actual}"]`);
    b?.focus();
    b?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  pintar();
}

function initCuentas() {
  const txt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  document.querySelectorAll('[data-cuenta-cat-txt]').forEach(el => { el.textContent = txt(Tienda.contar({ cat: el.dataset.cuentaCatTxt })); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = p.venta === 'kit' ? 'Elegí el kit' : 'Elegí la medida';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span><b>${esc(op.v)}</b><small>${esc(detalleUnidad(p, op))}</small></span><span class="picker__precio">${formatearPrecio(precioM2(p, op))}<small>el m²</small></span></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} ${unidadDe(p, qty)}.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

function textoSumado(p, qty, op) {
  const medida = p.ops.length > 1 ? ` (${op.v})` : '';
  return `Sumaste ${qty} ${unidadDe(p, qty)} de ${p.nombre}${medida}: ${fmtM2(Math.round(qty * op.m2 * 100) / 100)}`;
}
function sumarAlCarrito(p, qty, v, comprar) {
  Cart.add(p, qty, v);
  if (comprar) abrirCarrito();
  else showToast(textoSumado(p, qty, opDe(p, v)));
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
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
      const max = p?.stock || 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
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
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
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
  if (e.key !== 'Tab') return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1, m2: '' };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = p.ops.length > 1 ? p.ops.length - 1 : 0; qvEstado.qty = 1; qvEstado.m2 = '';
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Revestimientos Nick' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: Math.min(...p.ops.map(op => precioUnidad(p, op))), highPrice: Math.max(...p.ops.map(op => precioUnidad(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function resumenQV() {
  const p = qvEstado.p;
  const op = p.ops[qvEstado.op];
  const m2 = Math.round(qvEstado.qty * op.m2 * 100) / 100;
  return `${qvEstado.qty} ${unidadDe(p, qvEstado.qty)} · ${fmtM2(m2)} · <b>${formatearPrecio(precioUnidad(p, op) * qvEstado.qty)}</b>`;
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const { items: rel } = Tienda.consultar({ filtros: { uso: p.usos[0], excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = p.stock > 5 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock} ${unidadDe(p, p.stock)}` : 'Sin stock por ahora';
  const extra = p.venta === 'kit' ? 0 : 10;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"><span class="pcard__aspecto">${esc(ASPECTOS[p.aspecto] || '')}</span></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catNombre(p))} · ${esc(p.terminacion)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span>${formatearPrecio(precioM2(p, op))}</span><small>el m²</small></p>
      <p class="qv__unidad">${ICO.cajas}<span>${esc(detalleUnidad(p, op))} · ${formatearPrecio(precioUnidad(p, op))} ${p.venta === 'kit' ? 'el kit' : 'la caja'}</span></p>
      ${p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">${p.venta === 'kit' ? 'Kit' : 'Medida'}</p><div class="qv__ops" role="radiogroup" aria-label="${p.venta === 'kit' ? 'Kit' : 'Medida'}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b><span>${formatearPrecio(precioM2(p, o))} el m²</span></button>`).join('')}</div></div>` : ''}
      <div class="qv__calc">
        <label class="qv__calc-campo"><span>¿Cuántos m² vas a cubrir?</span><span class="campo-txt__in"><input type="text" inputmode="decimal" autocomplete="off" placeholder="Ej.: 12,5" value="${esc(qvEstado.m2)}" data-qv-m2><em>m²</em></span></label>
        <p class="qv__calc-nota">${extra ? `Te sumamos el ${extra} % para cortes y redondeamos a ${unidadDe(p, 2)} enteras.` : 'Redondeamos a kits enteros.'}</p>
      </div>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar una ${unidadDe(p)}">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar una ${unidadDe(p)}">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${p.stock > 0 ? '' : ' disabled'}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <p class="qv__resumen" data-qv-resumen aria-live="polite">${resumenQV()}</p>
      <p class="qv__stock">${ICO.check}${esc(stock)} · envío o retiro a coordinar por WhatsApp</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Formato</dt><dd>${esc(p.ops.map(o => o.v).join(' / '))}</dd></div>
        <div><dt>Terminación</dt><dd>${esc(p.terminacion)}</dd></div>
        <div><dt>Para</dt><dd>${esc(p.usos.map(u => USOS[u]?.nombre).join(', '))}</dd></div>
      </dl>
      ${p.nota ? `<p class="qv__nota">${ICO.info}<span>${esc(p.nota)}</span></p>` : ''}
      <a class="qv__wsp" href="${wspLink(`${SALUDO} Tengo una consulta sobre: ${p.nombre} (${op.v})`)}" target="_blank" rel="noopener">${ICO.wsp}¿Dudas o querés que te lo coloquemos? Escribinos</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También ${esc(USOS[p.usos[0]]?.para || '')}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.xs)}" alt="" width="240" height="240"><span>${esc(r.nombre)}</span><b>${formatearPrecio(desdeM2(r))} el m²</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function actualizarQVCantidad() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  const n = qv.querySelector('[data-qv-qty]');
  if (n) n.textContent = String(qvEstado.qty);
  const r = qv.querySelector('[data-qv-resumen]');
  if (r) r.innerHTML = resumenQV();
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
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      const m2 = leerNumero(qvEstado.m2);
      if (m2) qvEstado.qty = Math.max(1, Math.min(qvEstado.p.stock || 99, calcularCajas(m2, qvEstado.p.venta === 'kit' ? 0 : 10, qvEstado.p.ops[qvEstado.op].m2).n));
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      actualizarQVCantidad();
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const op = p.ops[qvEstado.op];
      const comprar = add.hasAttribute('data-qv-comprar');
      Cart.add(p, qvEstado.qty, op.v);
      if (comprar) { cerrarQV(); abrirCarrito(); }
      else showToast(textoSumado(p, qvEstado.qty, op));
    }
  });
  qv.addEventListener('input', e => {
    const inp = e.target.closest('[data-qv-m2]');
    if (!inp || !qvEstado.p) return;
    qvEstado.m2 = inp.value;
    const m2 = leerNumero(inp.value);
    if (m2) {
      const p = qvEstado.p;
      const { n } = calcularCajas(m2, p.venta === 'kit' ? 0 : 10, p.ops[qvEstado.op].m2);
      qvEstado.qty = Math.max(1, Math.min(p.stock || 99, n));
      actualizarQVCantidad();
    }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = new URLSearchParams(location.search).get('producto');
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
  const m2Total = Math.round(items.reduce((s, i) => { const p = getProducto(i.id); return s + i.qty * opDe(p, i.v).m2; }, 0) * 100) / 100;
  if (cuenta) cuenta.textContent = items.length ? `(${fmtM2(m2Total)})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.regla}<p class="cart-vacio__tit">Tu pedido está vacío</p><p>Elegí el material, poné los m² y te decimos cuántas cajas llevar.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.xs)}" alt="" width="74" height="74">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(op.v)} · ${fmtM2(Math.round(i.qty * op.m2 * 100) / 100)} · ${formatearPrecio(precioUnidad(p, op))} ${p.venta === 'kit' ? 'el kit' : 'la caja'}</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar una ${unidadDe(p)}">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar una ${unidadDe(p)}">${ICO.mas}</button></div>
        <span class="linea__u">${unidadDe(p, i.qty)}</span>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioUnidad(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const op = opDe(p, i.v); return `- ${i.qty} ${unidadDe(p, i.qty)} de ${p.nombre} (${op.v}, ${fmtM2(Math.round(i.qty * op.m2 * 100) / 100)}): ${formatearPrecio(precioUnidad(p, op) * i.qty)}`; }).join('\n');
  const msg = `${SALUDO} Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\n¿Me confirman el envío o el retiro?`;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">${ICO.regla}${fmtM2(m2Total)} en total · el envío o el retiro lo coordinamos por WhatsApp</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); }
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
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

function initCalculadora() {
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const selProd = form.querySelector('[data-calc-prod]');
  const selOp = form.querySelector('[data-calc-op]');
  const dims = form.querySelector('[data-calc-dims]');
  const caja = form.querySelector('[data-calc-m2-campo]');
  const largo = form.querySelector('[data-calc-largo]');
  const ancho = form.querySelector('[data-calc-ancho]');
  const m2In = form.querySelector('[data-calc-m2]');
  const extraBox = form.querySelector('[data-calc-extra-box]');
  const res = document.querySelector('[data-calc-res]');
  if (!selProd || !selOp || !res) return;
  const out = k => res.querySelector(`[data-calc-${k}]`);
  const { items } = Tienda.consultar({ orden: 'destacados', limite: 100 });
  items.forEach(cachear);
  selProd.innerHTML = CATEGORIAS.map(c => {
    const deCat = items.filter(p => p.cat === c.id);
    return deCat.length ? `<optgroup label="${esc(c.nombre)}">${deCat.map(p => `<option value="${esc(p.id)}">${esc(p.nombre)}</option>`).join('')}</optgroup>` : '';
  }).join('');
  const pintarOps = () => {
    const p = getProducto(selProd.value);
    if (!p) return;
    selOp.innerHTML = p.ops.map((op, i) => `<option value="${i}">${esc(op.v)} · ${esc(p.venta === 'kit' ? `rinde ${fmtM2(op.m2)}` : `caja de ${fmtM2(op.m2)}`)}</option>`).join('');
    if (p.ops.length > 1) selOp.value = String(p.ops.length - 1);
    selOp.disabled = p.ops.length < 2;
    if (extraBox) extraBox.hidden = p.venta === 'kit';
  };
  const estado = { p: null, op: null, n: 0 };
  const calcular = () => {
    const p = getProducto(selProd.value);
    if (!p) return;
    const op = p.ops[Number(selOp.value)] || p.ops[0];
    const modo = form.querySelector('input[name="calcModo"]:checked')?.value || 'dims';
    if (dims) dims.hidden = modo !== 'dims';
    if (caja) caja.hidden = modo !== 'm2';
    const m2 = modo === 'dims' ? Math.round(leerNumero(largo?.value) * leerNumero(ancho?.value) * 100) / 100 : leerNumero(m2In?.value);
    const extra = p.venta === 'kit' ? 0 : Number(form.querySelector('input[name="calcExtra"]:checked')?.value || 10);
    const r = calcularCajas(m2, extra, op.m2);
    estado.p = p; estado.op = op; estado.n = r.n;
    const btnAdd = res.querySelector('[data-calc-add]');
    const wsp = res.querySelector('[data-calc-wsp]');
    res.classList.toggle('is-vacio', !r.n);
    if (!r.n) {
      out('n').textContent = '—';
      out('unidad').textContent = p.venta === 'kit' ? 'kits' : 'cajas';
      out('detalle').textContent = 'Poné el largo y el ancho del ambiente (o los m²) para calcular.';
      out('total').textContent = '—';
      if (btnAdd) { btnAdd.disabled = true; btnAdd.querySelector('span').textContent = 'Sumar al carrito'; }
      return;
    }
    out('n').textContent = String(r.n);
    out('unidad').textContent = unidadDe(p, r.n);
    out('detalle').textContent = p.venta === 'kit'
      ? `${r.n === 1 ? 'Rinde' : 'Rinden'} ${fmtM2(r.total)} para tus ${fmtM2(m2)}.`
      : `${fmtM2(r.total)} en total: tus ${fmtM2(m2)} más el ${extra} % para cortes.`;
    out('total').textContent = formatearPrecio(precioUnidad(p, op) * r.n);
    if (btnAdd) { btnAdd.disabled = !(p.stock > 0); btnAdd.querySelector('span').textContent = `Sumar ${r.n} ${unidadDe(p, r.n)} al carrito`; }
    if (wsp) wsp.href = wspLink(`${SALUDO} Necesito cubrir ${fmtM2(m2)} con ${p.nombre} (${op.v}). Según la calculadora son ${r.n} ${unidadDe(p, r.n)}. ¿Me pasan el presupuesto con la colocación?`);
  };
  selProd.addEventListener('change', () => { pintarOps(); calcular(); });
  form.addEventListener('input', calcular);
  form.addEventListener('change', e => { if (e.target !== selProd) calcular(); });
  form.addEventListener('submit', e => e.preventDefault());
  res.querySelector('[data-calc-add]')?.addEventListener('click', () => {
    const { p, op, n } = estado;
    if (!p || !n) return;
    const max = p.stock || 0;
    const yaEnCarrito = Cart.get().find(i => i.id === p.id && i.v === op.v)?.qty || 0;
    const entra = Math.max(0, Math.min(n, max - yaEnCarrito));
    if (!entra) { showToast(`Ya tenés en el carrito todo el stock de ${p.nombre}. Escribinos y lo conseguimos.`); return; }
    Cart.add(p, entra, op.v);
    if (entra < n) showToast(`Tenemos ${max} ${unidadDe(p, max)} en stock: sumamos ${entra}. Las que faltan las consultamos por WhatsApp.`);
    else showToast(textoSumado(p, entra, op));
  });
  pintarOps();
  calcular();
}

function initPresupuesto() {
  const form = document.querySelector('[data-presu]');
  if (!form) return;
  const err = form.querySelector('[data-presu-error]');
  const marcar = id => {
    const r = form.querySelector(`input[name="trabajo"][value="${id}"]`);
    if (r) { r.checked = true; if (err) err.hidden = true; }
  };
  const inicial = new URLSearchParams(location.search).get('trabajo');
  if (inicial && TRABAJOS[inicial]) marcar(inicial);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-trabajo]');
    if (!a) return;
    e.preventDefault();
    marcar(a.dataset.trabajo);
    const sec = document.getElementById('colocacion');
    sec?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', '#colocacion');
  });
  form.addEventListener('change', e => { if (e.target.name === 'trabajo' && err) err.hidden = true; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const trabajo = form.querySelector('input[name="trabajo"]:checked')?.value;
    if (!trabajo) {
      if (err) { err.textContent = 'Elegí qué querés revestir y te armamos el mensaje.'; err.hidden = false; }
      form.querySelector('input[name="trabajo"]')?.focus();
      return;
    }
    const m2 = leerNumero(form.querySelector('[data-presu-m2]')?.value);
    const zona = (form.querySelector('[data-presu-zona]')?.value || '').trim().slice(0, 60);
    const material = form.querySelector('input[name="material"]:checked')?.value || '';
    const MAT = { compro: 'lo compro con ustedes', tengo: 'ya lo tengo', nose: 'todavía no lo elegí' };
    const msg = [
      `${SALUDO} Quiero un presupuesto de colocación.`,
      `Trabajo: ${TRABAJOS[trabajo]}`,
      `Superficie: ${m2 ? fmtM2(m2) : 'a medir'}`,
      `Zona: ${zona || 'a confirmar'}`,
      material ? `El material: ${MAT[material]}` : '',
    ].filter(Boolean).join('\n');
    window.open(wspLink(msg), '_blank', 'noopener');
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const GRUPOS = {
    cat: { opciones: CATEGORIAS.map(c => [c.id, c.nombre]), todos: 'Todos los materiales' },
    uso: { opciones: Object.entries(USOS).map(([k, u]) => [k, u.nombre]), todos: 'Todos los ambientes' },
    aspecto: { opciones: Object.entries(ASPECTOS), todos: 'Todos' },
    precio: { opciones: Object.entries(RANGOS).map(([k, r]) => [k, r.nombre]), todos: 'Cualquier precio' },
  };
  const estado = {
    cat: valido(params.get('cat'), catIds),
    uso: valido(params.get('uso'), USOS),
    aspecto: valido(params.get('aspecto'), ASPECTOS),
    precio: valido(params.get('precio'), RANGOS),
    stock: params.get('stock') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');

  document.querySelectorAll('[data-opciones]').forEach(cont => {
    const f = cont.dataset.opciones;
    const g = GRUPOS[f];
    if (!g) return;
    const botones = cont.dataset.modo === 'botones';
    const lista = [['', g.todos], ...g.opciones];
    cont.innerHTML = lista.map(([id, nombre]) => (botones
      ? `<button type="button" class="chip" data-filtro="${f}" data-valor="${id}" aria-pressed="false">${esc(id ? nombre : g.todos.split(' ')[0])}${f === 'precio' ? '' : ` <small data-cuenta-f="${f}" data-valor="${id}"></small>`}</button>`
      : `<label class="opt"><input type="radio" name="f-${f}" value="${id}" data-filtro="${f}"><span>${esc(nombre)}</span>${f === 'precio' ? '' : `<span class="opt__n" data-cuenta-f="${f}" data-valor="${id}"></span>`}</label>`)).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.uso && sin !== 'uso') f.uso = estado.uso;
    if (estado.aspecto && sin !== 'aspecto') f.aspecto = estado.aspecto;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === estado[f];
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f]));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-f]').forEach(el => {
      const f = el.dataset.cuentaF;
      const id = el.dataset.valor;
      el.textContent = Tienda.contar({ ...filtrosDe(f), ...(id ? { [f]: id } : {}) });
    });
    const activos = ['cat', 'uso', 'aspecto', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const uso = USOS[estado.uso];
    const titulo = cat ? `${cat.nombre}${uso ? ' ' + uso.para : ''}` : uso ? `Revestimientos ${uso.para}` : 'Todo el catálogo';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? `${cat.bajada} Precio por m² y por caja.` : uso ? uso.txt : 'Porcelanato, mármol, travertino, piedras, cerámica, venecitas y porcelanato líquido, con el precio por m² y por caja.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !uso; miga.textContent = titulo; }
    document.title = `${titulo} — Revestimientos Nick`;
    document.querySelectorAll('[data-cats-lista] a').forEach(a => {
      if (estado.cat && a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-usos-lista] a').forEach(a => {
      if (estado.uso && a.getAttribute('href') === `${URL_CATALOGO}?uso=${estado.uso}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'uso', 'aspecto', 'precio', 'q', 'orden', 'stock', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.uso) u.searchParams.set('uso', estado.uso);
    if (estado.aspecto) u.searchParams.set('aspecto', estado.aspecto);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
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

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) { estado[b.dataset.filtro] = b.dataset.valor || ''; aplicar(); return; }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.uso = ''; estado.aspecto = ''; estado.precio = ''; estado.stock = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (params.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, uso: estado.uso };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-badge', { y: 24, scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
  paso('.regla__cinta', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.3, ease: 'power3.inOut', clearProps: 'transform' }, 0.5);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initAmbientes,
  initCuentas,
  () => { const actual = PAGINA === 'catalogo' ? initCatalogo() : {}; initDropdowns(actual || {}); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initCalculadora,
  initPresupuesto,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
