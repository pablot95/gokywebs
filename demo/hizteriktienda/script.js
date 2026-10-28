const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491122785779';
const MARCA = 'Hizteriktienda';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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

const CATEGORIAS = [
  { id: 'vestir', nombre: 'Vestir', bajada: 'Blazers, blusas, camisas y pantalones', img: 'images/p-blazer-violeta.webp',
    texto: 'Blazers entallados, blusas y camisas de satén y pantalones sastreros para la oficina o un evento.',
    subs: [{ id: 'blazers', nombre: 'Blazers' }, { id: 'blusas', nombre: 'Blusas y camisas' }, { id: 'pantalones', nombre: 'Pantalones' }] },
  { id: 'fiesta', nombre: 'Fiesta', bajada: 'Vestidos, monos, faldas y tops', img: 'images/p-midi-bordo.webp',
    texto: 'Vestidos largos y midi, monos de gasa, faldas metalizadas y tops con brillo para la noche.',
    subs: [{ id: 'vestidos', nombre: 'Vestidos' }, { id: 'monos', nombre: 'Monos' }, { id: 'faldas', nombre: 'Faldas' }, { id: 'tops', nombre: 'Tops' }] },
];
const OCASIONES = [
  { id: 'oficina', nombre: 'Oficina y reuniones', texto: 'Blazers, blusas, camisas y pantalones para verte prolija de lunes a viernes.' },
  { id: 'evento', nombre: 'Evento de día', texto: 'Bautismos, comuniones, cumpleaños y cócteles: prendas con caída que se lucen de día.' },
  { id: 'noche', nombre: 'Fiesta de noche', texto: 'Casamientos, fiestas de egresados y galas: vestidos largos, monos y brillo.' },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro', alt: 'negro', hex: '#1E1C20' },
  { id: 'bordo', nombre: 'Bordó', alt: 'bordó', hex: '#5E1A26' },
  { id: 'esmeralda', nombre: 'Verde esmeralda', alt: 'verde esmeralda', hex: '#1F6B50' },
  { id: 'violeta', nombre: 'Violeta', alt: 'violeta', hex: '#4F2378' },
  { id: 'fucsia', nombre: 'Fucsia', alt: 'fucsia', hex: '#A8266A' },
  { id: 'azul', nombre: 'Azul noche', alt: 'azul noche', hex: '#1C2A52' },
  { id: 'dorado', nombre: 'Dorado', alt: 'dorado', hex: '#C2A57E' },
  { id: 'plateado', nombre: 'Plateado', alt: 'plateado', hex: '#B5B2BA' },
  { id: 'marfil', nombre: 'Marfil', alt: 'marfil', hex: '#E9DFCF' },
  { id: 'rosa', nombre: 'Rosa empolvado', alt: 'rosa empolvado', hex: '#E3B4BC' },
];
const TALLES = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42', '44', '46'];
const PRECIOS = [
  { id: 'hasta60', nombre: 'Hasta $60.000', min: null, max: 60000 },
  { id: '60a90', nombre: '$60.000 a $90.000', min: 60001, max: 90000 },
  { id: 'mas90', nombre: 'Más de $90.000', min: 90001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  vestir: 'vestir formal oficina elegante', fiesta: 'fiesta noche gala evento casamiento',
  vestidos: 'vestido vestidos largo midi', monos: 'mono monos enterito jumpsuit', faldas: 'falda faldas pollera plisada', tops: 'top tops musculosa lentejuelas brillo',
  blazers: 'blazer blazers saco chaqueta', blusas: 'blusa blusas camisa camisas', pantalones: 'pantalon pantalones sastrero palazzo',
  oficina: 'oficina trabajo reunion', evento: 'evento dia bautismo comunion cumpleanos coctel', noche: 'noche fiesta casamiento egresados gala',
  negro: 'negro negra', bordo: 'bordo bordeaux vino', esmeralda: 'verde esmeralda', violeta: 'violeta morado lila', fucsia: 'fucsia magenta rosa',
  azul: 'azul noche marino', dorado: 'dorado dorada oro metalizado', plateado: 'plateado plateada plata metalizado', marfil: 'marfil crudo blanco hueso', rosa: 'rosa empolvado palo',
};
const LETRAS = ['S', 'M', 'L', 'XL'];
const DESTACADOS = ['vestido-largo-saten', 'blazer-entallado', 'blusa-saten-mono'];

const Tienda = crearTienda([
  { id: 'vestido-largo-saten', nombre: 'Vestido largo de satén cruzado', cat: 'fiesta', sub: 'vestidos', uso: ['noche'], precio: 119900, descuento: 0, alta: 30, rango: 1, tag: 'Nuevo',
    foto: 'vestido', vista: 'alta', talles: LETRAS,
    colores: ['negro', 'bordo', 'esmeralda'], stock: { negro: [3, 5, 2, 1], bordo: [2, 3, 0, 1], esmeralda: [1, 2, 2, 0] },
    alt: 'Vestido largo de satén en {c} con escote en V cruzado, frunce en la cintura y volado al costado',
    desc: 'Satén con caída, escote en V cruzado y breteles anchos. El frunce en la cintura marca la silueta y el volado lateral acompaña el paso hasta el piso.' },
  { id: 'blazer-entallado', nombre: 'Blazer entallado de un botón', cat: 'vestir', sub: 'blazers', uso: ['oficina', 'evento'], precio: 89900, descuento: 0, alta: 29, rango: 2,
    foto: 'blazer', vista: 'ancha', talles: ['XS', 'S', 'M', 'L', 'XL'],
    colores: ['violeta', 'fucsia', 'negro'], stock: { violeta: [1, 3, 4, 2, 1], fucsia: [0, 2, 3, 2, 1], negro: [2, 4, 5, 3, 2] },
    alt: 'Blazer entallado en {c} con solapa, un botón y bolsillos con tapa',
    desc: 'Corte entallado con solapa clásica, un botón y bolsillos con tapa. Forrado por dentro para que caiga prolijo sobre una blusa o un vestido.' },
  { id: 'blusa-saten-mono', nombre: 'Blusa de satén con moño', cat: 'vestir', sub: 'blusas', uso: ['oficina', 'evento'], precio: 54900, descuento: 0, alta: 28, rango: 3,
    foto: 'blusa', talles: LETRAS,
    colores: ['fucsia', 'violeta', 'esmeralda'], stock: { fucsia: [3, 4, 3, 2], violeta: [2, 3, 2, 1], esmeralda: [1, 2, 0, 1] },
    alt: 'Blusa de satén en {c} con moño largo en el cuello y mangas abullonadas con puño',
    desc: 'Satén brillante con lazo largo en el cuello y mangas abullonadas que terminan en puño. Va por dentro de un pantalón sastrero o con una falda.' },
  { id: 'falda-plisada', nombre: 'Falda plisada metalizada', cat: 'fiesta', sub: 'faldas', uso: ['evento', 'noche'], precio: 69900, descuento: 0, alta: 27, rango: 4, tag: 'Nuevo',
    foto: 'falda', talles: ['S', 'M', 'L'],
    colores: ['dorado', 'plateado'], stock: { dorado: [3, 4, 2], plateado: [2, 3, 1] },
    alt: 'Falda midi plisada metalizada en {c} con pretina lisa',
    desc: 'Plisado fino en tela metalizada, con pretina lisa y largo midi. Se mueve con la luz: con un top de lentejuelas o con una camisa de satén.' },
  { id: 'vestido-midi-gasa', nombre: 'Vestido midi de gasa cruzado', cat: 'fiesta', sub: 'vestidos', uso: ['evento', 'noche'], precio: 84900, descuento: 0, alta: 26, rango: 5,
    foto: 'midi', talles: LETRAS,
    colores: ['bordo', 'esmeralda', 'azul'], stock: { bordo: [2, 3, 3, 1], esmeralda: [1, 2, 2, 1], azul: [2, 2, 1, 0] },
    alt: 'Vestido midi de gasa en {c} con escote cruzado, mangas abullonadas, lazo en la cintura y volado',
    desc: 'Gasa liviana con escote cruzado, mangas largas abullonadas y lazo en la cintura. La falda termina en un volado asimétrico.' },
  { id: 'pantalon-sastrero', nombre: 'Pantalón sastrero tiro alto', cat: 'vestir', sub: 'pantalones', uso: ['oficina', 'evento'], precio: 64900, descuento: 0, alta: 25, rango: 6,
    foto: 'pantalon', talles: ['36', '38', '40', '42', '44', '46'],
    colores: ['negro', 'azul'], stock: { negro: [2, 4, 5, 4, 2, 1], azul: [1, 2, 3, 3, 1, 0] },
    alt: 'Pantalón sastrero de tiro alto en {c}, con pinzas y pierna ancha',
    desc: 'Tiro alto con pinzas, bolsillos al costado y pierna ancha recta que llega al piso con taco. Combina con el blazer o con una blusa de satén.' },
  { id: 'top-lentejuelas', nombre: 'Top de lentejuelas con escote drapeado', cat: 'fiesta', sub: 'tops', uso: ['noche'], precio: 45900, descuento: 0, alta: 23, rango: 7,
    foto: 'top', talles: ['S', 'M', 'L'],
    colores: ['plateado', 'dorado'], stock: { plateado: [3, 4, 2], dorado: [2, 2, 1] },
    alt: 'Top de lentejuelas en {c} con breteles finos y escote drapeado',
    desc: 'Lentejuelas en toda la prenda, breteles finos y escote drapeado. Con la falda plisada o con el pantalón sastrero, para la noche.' },
  { id: 'camisa-saten', nombre: 'Camisa de satén manga larga', cat: 'vestir', sub: 'blusas', uso: ['oficina'], precio: 49900, descuento: 0, alta: 24, rango: 8,
    foto: 'camisa', talles: LETRAS,
    colores: ['marfil', 'rosa'], stock: { marfil: [3, 5, 4, 2], rosa: [2, 3, 2, 0] },
    alt: 'Camisa de satén de manga larga en {c} con cuello camisero y botones nacarados',
    desc: 'Satén suave con cuello camisero, botones nacarados y puños. Para la oficina con pantalón sastrero o abierta sobre un top.' },
  { id: 'mono-gasa', nombre: 'Mono de gasa con mangas volado', cat: 'fiesta', sub: 'monos', uso: ['evento', 'noche'], precio: 94900, descuento: 0, alta: 22, rango: 9,
    foto: 'mono', talles: LETRAS,
    colores: ['azul', 'bordo', 'negro'], stock: { azul: [2, 3, 2, 1], bordo: [1, 2, 1, 0], negro: [2, 3, 3, 2] },
    alt: 'Mono largo de gasa en {c} con escote cruzado, mangas volado y pierna ancha',
    desc: 'Escote cruzado, mangas cortas con volado, cintura marcada y pierna ancha. Una sola prenda resuelta para un casamiento o un cumpleaños.' },

  { id: 'vestido-corto-proximo', nombre: 'Vestido corto de lentejuelas', cat: 'fiesta', sub: 'vestidos', uso: ['noche'], precio: 79900, descuento: 0, alta: 31, visible: false,
    foto: 'top', talles: LETRAS, colores: ['plateado'], stock: { plateado: [0, 0, 0, 0] }, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '',
    ...(p.colores || []).map(c => ETIQUETAS[c] || c), ...(p.uso || []).map(u => ETIQUETAS[u] || u),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const unidades = (p, c, t) => p.stock?.[c]?.[(p.talles || []).indexOf(t)] || 0;

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), uso = lista(f.uso), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (uso.length && !(p.uso || []).some(u => uso.includes(u))) return false;
    const colores = color.length ? (p.colores || []).filter(c => color.includes(c)) : (p.colores || []);
    if (color.length && !colores.length) return false;
    if (talle.length && !talle.some(t => colores.some(c => unidades(p, c, t) > 0))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden, q) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const palabras = q ? norm(q).split(/\s+/).filter(Boolean) : [];
    const rel = p => (palabras.every(w => norm(`${p.nombre} ${ETIQUETAS[p.sub] || ''}`).includes(w)) ? 0 : 1);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (palabras.length ? rel(a) - rel(b) : 0) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.q));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {}, usos = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.talles || []).forEach(t => { if ((p.colores || []).some(c => unidades(p, c, t) > 0)) talles[t] = (talles[t] || 0) + 1; });
      (p.colores || []).forEach(c => { colores[c] = (colores[c] || 0) + 1; });
      (p.uso || []).forEach(u => { usos[u] = (usos[u] || 0) + 1; });
    });
    return { talles, colores, usos };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const colorDe = id => COLORES.find(c => c.id === id) || { id, nombre: id, alt: id, hex: '#ccc' };
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const fotoDe = (p, c) => `images/p-${p.foto}-${c}.webp`;
const vistaDe = (p, c) => (p.vista ? `images/${p.foto}-${c}.webp` : null);
const altDe = (p, c) => p.alt.replace('{c}', colorDe(c).alt);
const unidadesDe = (p, c, t) => p?.stock?.[c]?.[(p.talles || []).indexOf(t)] || 0;
const colorValido = (p, c) => (p.colores.includes(c) ? c : p.colores[0]);
const varTxt = (p, c, t) => `color ${colorDe(c).nombre.toLowerCase()}${t ? `, talle ${t}` : ''}`;

const Cart = {
  KEY: 'hizteriktienda_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  igual(i, id, color, talle) { return i.id === id && i.color === color && i.talle === talle; },
  add(producto, qty, color, talle) {
    const max = unidadesDe(producto, color, talle);
    if (max <= 0) return false;
    const items = this.get();
    const existing = items.find(i => this.igual(i, producto.id, color, talle));
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, color, talle, qty: Math.min(qty, max) });
    this.save(items);
    return true;
  },
  setQty(id, color, talle, qty) {
    const items = this.get(); const it = items.find(i => this.igual(i, id, color, talle)); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, unidadesDe(p, color, talle) || 1)); this.save(items);
  },
  remove(id, color, talle) { this.save(this.get().filter(i => !this.igual(i, id, color, talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'hizteriktienda_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ENTREGAS = [
  { id: 'envio', nombre: 'Envío a domicilio', txt: 'Te confirmamos el costo y el día de entrega según tu zona.' },
  { id: 'retiro', nombre: 'Retiro', txt: 'Coordinamos el punto y el horario por WhatsApp.' },
];
const PAGOS = [
  { id: 'mp', nombre: 'Mercado Pago', txt: 'Tarjeta de crédito, débito o dinero en cuenta.' },
  { id: 'transferencia', nombre: 'Transferencia bancaria', txt: 'Te pasamos los datos al confirmar el pedido.' },
  { id: 'efectivo', nombre: 'Efectivo', txt: 'Al retirar el pedido.', soloRetiro: true },
];
const Checkout = {
  KEY: 'hizteriktienda_checkout',
  get() {
    let v = {};
    try { v = JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { v = {}; }
    const entrega = ENTREGAS.some(x => x.id === v.entrega) ? v.entrega : 'envio';
    let pago = PAGOS.some(x => x.id === v.pago) ? v.pago : 'mp';
    if (pago === 'efectivo' && entrega !== 'retiro') pago = 'mp';
    return { entrega, pago };
  },
  set(cambios) {
    const v = { ...this.get(), ...cambios };
    if (v.pago === 'efectivo' && v.entrega !== 'retiro') v.pago = 'mp';
    try { localStorage.setItem(this.KEY, JSON.stringify(v)); } catch (e) { void e; }
    return v;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  abajo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  percha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.6L3.4 15.2a1.4 1.4 0 0 0 .8 2.5h15.6a1.4 1.4 0 0 0 .8-2.5L12 9.1"/></svg>',
  camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${subDe(p)?.nombre || ''} · ${nombreDe(CATEGORIAS, p.cat)}`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function stockTotal(p, c) {
  return (p.stock?.[c] || []).reduce((s, n) => s + n, 0);
}
function badgesHTML(p, c) {
  const b = [];
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (stockTotal(p, c) <= 5) b.push('<span class="etiqueta etiqueta--clara">Últimas en este color</span>');
  return b.join('');
}
const urlProducto = (p, c) => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}${c ? `&tono=${c}` : ''}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  const m = Math.max(1, max);
  return `<div class="stepper" data-stepper data-max="${m}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= m ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function swatchesHTML(p, c, { nombre = true } = {}) {
  return `<div class="prod__colores" role="group" aria-label="Color de ${esc(p.nombre)}">${p.colores.map(id => {
    const col = colorDe(id);
    return `<button type="button" class="sw" data-sw="${id}" aria-pressed="${id === c}" aria-label="${esc(col.nombre)}" style="--sw:${col.hex}"></button>`;
  }).join('')}${nombre ? `<span class="prod__color-nombre" data-color-nombre>${esc(colorDe(c).nombre)}</span>` : ''}</div>`;
}
function opcionesTalle(p, c, valor = '') {
  return `<option value="">Elegí tu talle</option>${p.talles.map(t => {
    const n = unidadesDe(p, c, t);
    return `<option value="${esc(t)}"${!n ? ' disabled' : ''}${n && t === valor ? ' selected' : ''}>${esc(t)}${!n ? ' · sin stock' : n === 1 ? ' · última' : ''}</option>`;
  }).join('')}`;
}

function cardHTML(p, { color = '', compacta = false, grande = false } = {}) {
  const c = colorValido(p, color);
  const nombre = esc(p.nombre);
  const img = `<img src="${fotoDe(p, c)}" alt="${esc(altDe(p, c))}" width="1000" height="1000" decoding="async">`;
  const foto = `<a class="prod__foto" href="${urlProducto(p, c)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}<span class="prod__badges">${badgesHTML(p, c)}</span>${favHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p, c)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}" data-prod="${p.id}" data-color="${c}">
      ${media}
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        ${titulo}
        ${precioHTML(p)}
        <div class="prod__fila">${swatchesHTML(p, c, { nombre: false })}<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir talle y agregar: ${nombre}">${ICON.carritoMas}</button></div>
      </div>
    </article>`;
  }
  return `<article class="prod" data-prod="${p.id}" data-color="${c}">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      ${precioHTML(p)}
      ${swatchesHTML(p, c)}
      <div class="prod__acciones"><label class="var-sel"><span class="sr-only">Talle de ${nombre}</span><select data-talle>${opcionesTalle(p, c)}</select></label><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function cambiarColorCard(card, c) {
  const p = getProducto(card.dataset.prod);
  if (!p || !p.colores.includes(c)) return;
  card.dataset.color = c;
  card.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sw === c)));
  const img = card.querySelector('.prod__foto img');
  if (img) {
    const nueva = new window.Image();
    nueva.src = fotoDe(p, c);
    img.classList.add('is-cambiando');
    const poner = () => { img.src = nueva.src; img.alt = altDe(p, c); img.classList.remove('is-cambiando'); };
    if (nueva.complete) poner(); else { nueva.onload = poner; nueva.onerror = poner; }
  }
  card.querySelectorAll('[data-qv]').forEach(a => { a.href = urlProducto(p, c); });
  const nom = card.querySelector('[data-color-nombre]');
  if (nom) nom.textContent = colorDe(c).nombre;
  const sel = card.querySelector('[data-talle]');
  if (sel) { const v = sel.value; sel.innerHTML = opcionesTalle(p, c, v); }
  const badges = card.querySelector('.prod__badges');
  if (badges) badges.innerHTML = badgesHTML(p, c);
}
function precargarColores(card) {
  if (!card || card.dataset.precargado) return;
  card.dataset.precargado = '1';
  const p = getProducto(card.dataset.prod);
  p?.colores.forEach(c => { const i = new window.Image(); i.src = fotoDe(p, c); });
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="60" height="60" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-momentos"><p class="cats-momentos__tit">Por ocasión</p>${OCASIONES.map(m => `<a href="${CATALOGO_URL}?uso=${m.id}">${esc(m.nombre)} <span class="cats-item__n">${Tienda.contar({ uso: m.id })}</span></a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-todo" href="${CATALOGO_URL}">Ver toda la tienda ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
  if (PAGINA === 'catalogo' && catActual) {
    document.querySelectorAll('.main-nav > a').forEach(a => {
      if (new URL(a.href, location.href).searchParams.get('cat') === catActual) a.setAttribute('aria-current', 'page');
    });
  }
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  paso('.hero-circulo, .probador__arco', { scale: 0.86, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, 0);
  paso('.hero-prenda, .probador__fotos', { y: 56, opacity: 0, duration: 1.2, stagger: 0.14, clearProps: 'transform,opacity' }, 0.05);
  hero.querySelectorAll('.arco path').forEach(path => {
    const largo = path.getTotalLength ? path.getTotalLength() : 0;
    if (!largo) return;
    tl.fromTo(path, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, 0.25);
  });
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.12);
  paso('h1', { y: 44, opacity: 0, duration: 1.1 }, 0.22);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas > *', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  paso('.hero-vertical', { opacity: 0, duration: 1.2 }, 0.7);
  paso('.hero-ficha, .probador__panel', { y: 30, opacity: 0, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, 0.8);
}

function initHome() {
  if (PAGINA !== 'home') return;
  const lista = document.getElementById('destacadosLista');
  if (lista) {
    lista.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADOS }, limite: DESTACADOS.length }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaicoLista');
  if (mosaico) {
    mosaico.innerHTML = Tienda.consultar({ filtros: { excluir: PROBADOR }, orden: 'nuevos', limite: 5 }).items
      .map((p, i) => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { compacta: true, grande: i === 0 })}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
  });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function initColores() {
  const box = document.getElementById('colores');
  if (!box) return;
  const tabsBox = document.getElementById('coloresTabs');
  const grid = document.getElementById('coloresGrid');
  const ver = document.getElementById('coloresVer');
  const txt = document.getElementById('coloresTxt');
  if (!tabsBox || !grid) return;
  const conStock = COLORES.filter(c => Tienda.contar({ color: c.id }));
  tabsBox.innerHTML = [`<button type="button" class="color-tab color-tab--todos" role="tab" id="ct-todos" data-color-tab="" aria-selected="true" aria-controls="coloresGrid"><i aria-hidden="true"></i>Todos</button>`,
    ...conStock.map(c => `<button type="button" class="color-tab" role="tab" id="ct-${c.id}" data-color-tab="${c.id}" aria-selected="false" tabindex="-1" aria-controls="coloresGrid" style="--sw:${c.hex}"><i aria-hidden="true"></i>${esc(c.nombre)} <small>${Tienda.contar({ color: c.id })}</small></button>`)].join('');
  const tabs = [...tabsBox.querySelectorAll('[role="tab"]')];
  const mostrar = (id, foco) => {
    tabs.forEach(t => {
      const on = t.dataset.colorTab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { grid.setAttribute('aria-labelledby', t.id); if (foco) { t.focus(); t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } }
    });
    const res = id
      ? Tienda.consultar({ filtros: { color: id }, orden: 'destacados', limite: 8 })
      : Tienda.consultar({ filtros: { excluir: DESTACADOS }, orden: 'destacados', limite: 8 });
    grid.dataset.n = String(res.items.length);
    grid.innerHTML = res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { color: id })}</li>`).join('');
    const nombre = id ? colorDe(id).nombre.toLowerCase() : '';
    if (ver) {
      ver.href = id ? `${CATALOGO_URL}?color=${id}` : CATALOGO_URL;
      ver.querySelector('span').textContent = id ? `Ver todo en ${nombre}` : 'Ver todo el catálogo';
    }
    if (txt) {
      const n = id ? Tienda.contar({ color: id }) : Tienda.contar({});
      txt.textContent = id ? `${n} ${n === 1 ? 'prenda viene' : 'prendas vienen'} en ${nombre}.` : `${n} prendas, cada una en dos o tres colores.`;
    }
    revelarNuevos(grid);
    refrescarTriggers();
  };
  tabsBox.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) mostrar(t.dataset.colorTab);
  });
  tabsBox.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    mostrar(tabs[j].dataset.colorTab, true);
  });
  mostrar('');
}

const PROBADOR = ['vestido-largo-saten', 'blazer-entallado', 'blusa-saten-mono', 'mono-gasa'];
function initProbador() {
  const box = document.getElementById('probador');
  if (!box) return;
  const fotos = [...box.querySelectorAll('[data-prob-foto]')];
  const prendas = document.getElementById('probPrendas');
  const nombre = document.getElementById('probNombre');
  const precio = document.getElementById('probPrecio');
  const colores = document.getElementById('probColores');
  const colorLbl = document.getElementById('probColor');
  const talles = document.getElementById('probTalles');
  const stock = document.getElementById('probStock');
  const agregar = document.getElementById('probAgregar');
  const detalle = document.getElementById('probDetalle');
  if (!fotos.length || !prendas) return;
  const items = PROBADOR.map(getProducto).filter(Boolean);
  const e = { p: items[0], color: items[0].colores[0], talle: '' };
  let visible = 0;
  const fotoEscena = (p, c) => (p.vista === 'alta' ? vistaDe(p, c) : fotoDe(p, c));
  prendas.innerHTML = items.map(p => `<button type="button" class="probador__prenda" data-prob-prenda="${p.id}" aria-pressed="${p.id === e.p.id}" aria-label="Probar ${esc(p.nombre)}"><img src="${fotoDe(p, p.colores[0])}" alt="" width="56" height="56"></button>`).join('');
  const ponerFoto = () => {
    const src = fotoEscena(e.p, e.color);
    const actual = fotos[visible];
    if (actual.getAttribute('src') === src) { actual.alt = altDe(e.p, e.color); return; }
    const sig = fotos[1 - visible];
    const mostrarSig = () => {
      sig.alt = altDe(e.p, e.color);
      sig.removeAttribute('data-oculta');
      actual.setAttribute('data-oculta', '');
      visible = 1 - visible;
    };
    sig.onload = mostrarSig;
    sig.src = src;
    if (sig.complete) { sig.onload = null; mostrarSig(); }
  };
  const pintar = () => {
    const p = e.p;
    prendas.querySelectorAll('[data-prob-prenda]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.probPrenda === p.id)));
    nombre.textContent = p.nombre;
    precio.textContent = formatearPrecio(precioFinal(p));
    colores.innerHTML = swatchesHTML(p, e.color, { nombre: false }).replace('class="prod__colores"', 'class="prod__colores" data-prob-sw');
    colorLbl.textContent = colorDe(e.color).nombre;
    if (e.talle && !unidadesDe(p, e.color, e.talle)) e.talle = '';
    talles.innerHTML = p.talles.map(t => {
      const n = unidadesDe(p, e.color, t);
      return `<button type="button" class="talle" data-prob-talle="${esc(t)}" aria-pressed="${t === e.talle}"${!n ? ' disabled aria-label="Talle ' + esc(t) + ' sin stock"' : ''}>${esc(t)}${n === 1 ? '<span class="talle__ultimo">Última</span>' : ''}</button>`;
    }).join('');
    const n = e.talle ? unidadesDe(p, e.color, e.talle) : 0;
    stock.classList.remove('is-aviso');
    stock.textContent = e.talle ? (n === 1 ? `Queda la última en talle ${e.talle}.` : `Hay ${n} en talle ${e.talle}.`) : 'Elegí un talle para ver el stock.';
    detalle.href = urlProducto(p, e.color);
    detalle.dataset.qv = p.id;
    ponerFoto();
  };
  box.addEventListener('click', ev => {
    const pr = ev.target.closest('[data-prob-prenda]');
    if (pr) { e.p = getProducto(pr.dataset.probPrenda); e.color = e.p.colores[0]; e.talle = ''; pintar(); return; }
    const sw = ev.target.closest('[data-prob-sw] [data-sw]');
    if (sw) { ev.stopPropagation(); e.color = sw.dataset.sw; pintar(); return; }
    const t = ev.target.closest('[data-prob-talle]');
    if (t && !t.disabled) { e.talle = t.dataset.probTalle; pintar(); }
  });
  box.addEventListener('pointerenter', () => items.forEach(p => p.colores.forEach(c => { const i = new window.Image(); i.src = fotoEscena(p, c); })), { once: true });
  agregar.addEventListener('click', () => {
    if (!e.talle) {
      stock.textContent = `Elegí tu talle para sumar ${e.p.nombre.toLowerCase()} al carrito.`;
      stock.classList.add('is-aviso');
      talles.querySelector('.talle:not(:disabled)')?.focus();
      return;
    }
    if (Cart.add(e.p, 1, e.color, e.talle)) showToast(`Sumaste ${e.p.nombre} (${varTxt(e.p, e.color, e.talle)}) al carrito.`);
  });
  detalle.addEventListener('click', ev => { ev.preventDefault(); abrirQV(e.p.id, detalle, { color: e.color, talle: e.talle }); });
  pintar();
}

const GUIA = {
  letras: { cols: ['Talle', 'Busto', 'Cintura', 'Cadera'], filas: [['XS', '82-86', '62-66', '88-92'], ['S', '86-90', '66-70', '92-96'], ['M', '90-94', '70-74', '96-100'], ['L', '94-100', '74-80', '100-106'], ['XL', '100-106', '80-86', '106-112']] },
  numeros: { cols: ['Talle', 'Cintura', 'Cadera'], filas: [['36', '64', '90'], ['38', '68', '94'], ['40', '72', '98'], ['42', '76', '102'], ['44', '80', '106'], ['46', '84', '110']] },
};
function guiaHTML(p) {
  const g = /^\d/.test(p.talles[0]) ? GUIA.numeros : GUIA.letras;
  const filas = g.filas.filter(f => p.talles.includes(f[0]));
  return `<details class="qv__guia"><summary>¿Qué talle soy? Ver medidas ${ICON.abajo}</summary><div class="qv__guia-cuerpo">
    <table><thead><tr>${g.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${filas.map(f => `<tr>${f.map((v, i) => (i ? `<td>${v} cm</td>` : `<th scope="row">${v}</th>`)).join('')}</tr>`).join('')}</tbody></table>
    <p>Medidas del cuerpo, de referencia. Si estás entre dos talles, elegí el más grande o escribinos y te lo confirmamos.</p></div></details>`;
}

const QV = { p: null, color: '', talle: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const c = QV.color;
  const fotos = [{ src: fotoDe(p, c), alt: altDe(p, c) }];
  if (p.vista) fotos.push({ src: vistaDe(p, c), alt: `Otra vista: ${altDe(p, c)}` });
  if (QV.foto >= fotos.length) QV.foto = 0;
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre} (${varTxt(p, c, QV.talle)}).`;
  const on = Favs.has(p.id);
  const n = QV.talle ? unidadesDe(p, c, QV.talle) : 0;
  cont.innerHTML = `
    <div class="qv__grid" data-qv-prod="${p.id}">
      <div class="qv__galeria">
        <div class="qv__principal${QV.foto === 1 ? ' qv__principal--alta' : ''}"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="1000" height="1000"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la prenda entera' : 'Ver la foto de la prenda'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || '')}${sub ? ' · ' : ''}${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <div>
          <p class="qv__lbl">Color <b>${esc(colorDe(c).nombre)}</b></p>
          ${swatchesHTML(p, c, { nombre: false }).replace('class="prod__colores"', 'class="prod__colores" data-qv-sw')}
        </div>
        <div>
          <p class="qv__lbl">Talle ${QV.talle ? `<b>${esc(QV.talle)}</b>` : ''}</p>
          <div class="talles" role="group" aria-label="Elegí tu talle">${p.talles.map(t => {
            const u = unidadesDe(p, c, t);
            return `<button type="button" class="talle" data-qv-talle="${esc(t)}" aria-pressed="${QV.talle === t}"${!u ? ` disabled aria-label="Talle ${esc(t)} sin stock en ${esc(colorDe(c).nombre.toLowerCase())}"` : ''}>${esc(t)}${u === 1 ? '<span class="talle__ultimo">Última</span>' : ''}</button>`;
          }).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite">${QV.talle ? (n === 1 ? `Queda la última en talle ${esc(QV.talle)}.` : `Hay ${n} en talle ${esc(QV.talle)}.`) : ''}</p>
        </div>
        ${guiaHTML(p)}
        <div class="qv__compra">
          ${stepperHTML(n || 1)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar talle o color por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        <p class="qv__pagos">${ICON.camion}<span>Pagás con Mercado Pago, transferencia o efectivo al retirar. Envío a domicilio o retiro. <a href="${HOME_URL}#pagos">Ver pagos y entregas</a></span></p>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${fotoDe(r, r.colores[0])}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(fotoDe(p, c), location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA }, color: colorDe(c).nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p, c) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, { color = '', talle = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.color = colorValido(p, color); QV.talle = talle && unidadesDe(p, QV.color, talle) ? talle : ''; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); u.searchParams.set('tono', QV.color); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); u.searchParams.delete('tono'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const reenfocar = sel => modal.querySelector(sel)?.focus();
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (e.target.closest('.qv__pagos a') && PAGINA === 'home') { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); reenfocar(`[data-qv-foto="${QV.foto}"]`); return; }
    const sw = e.target.closest('[data-qv-sw] [data-sw]');
    if (sw) {
      e.stopPropagation();
      QV.color = sw.dataset.sw;
      if (QV.talle && !unidadesDe(QV.p, QV.color, QV.talle)) QV.talle = '';
      renderQV(); reenfocar(`[data-qv-sw] [data-sw="${QV.color}"]`);
      return;
    }
    const t = e.target.closest('[data-qv-talle]');
    if (t && !t.disabled) { QV.talle = t.dataset.qvTalle; renderQV(); reenfocar(`[data-qv-talle="${QV.talle}"]`); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (!QV.talle) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-talle]:not(:disabled)')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.color, QV.talle);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (${varTxt(p, QV.color, QV.talle)}) al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const col = colorDe(i.color);
  return `<li class="linea" data-linea="${p.id}" data-linea-color="${esc(i.color)}" data-linea-talle="${esc(i.talle)}">
    <img src="${fotoDe(p, i.color)}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta"><i style="--sw:${col.hex}" aria-hidden="true"></i>${esc(col.nombre)} · Talle ${esc(i.talle)} · ${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(unidadesDe(p, i.color, i.talle), i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function checkoutHTML() {
  const co = Checkout.get();
  const op = (grupo, x, marcado, deshab) => `<label class="co__op"><input type="radio" name="co-${grupo}" value="${x.id}" data-co="${grupo}"${marcado ? ' checked' : ''}${deshab ? ' disabled' : ''}><span>${esc(x.nombre)}</span><small>${esc(deshab ? 'Solo si elegís retiro.' : x.txt)}</small></label>`;
  return `<div class="co">
    <fieldset class="co__grupo"><legend>¿Cómo lo recibís?</legend>${ENTREGAS.map(x => op('entrega', x, co.entrega === x.id, false)).join('')}</fieldset>
    <fieldset class="co__grupo"><legend>¿Cómo pagás?</legend>${PAGOS.map(x => op('pago', x, co.pago === x.id, x.soloRetiro && co.entrega !== 'retiro')).join('')}</fieldset>
  </div>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.percha}<p>Tu carrito está vacío. Elegí un color, tu talle y sumá la prenda.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>${checkoutHTML()}`;
  foot.hidden = false;
  const total = Cart.total();
  const co = Checkout.get();
  const entrega = nombreDe(ENTREGAS, co.entrega), pago = nombreDe(PAGOS, co.pago);
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const resumen = document.getElementById('cartResumen');
  if (resumen) resumen.textContent = `${entrega} · ${pago}${co.entrega === 'envio' ? ' · el envío se confirma aparte' : ''}`;
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${colorDe(i.color).nombre}, talle ${i.talle}): ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, `Entrega: ${entrega}`, `Pago: ${pago}`].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, color = linea.dataset.lineaColor, talle = linea.dataset.lineaTalle;
    const it = Cart.get().find(i => Cart.igual(i, id, color, talle));
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, color, talle); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, color, talle, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, color, talle, it.qty - 1);
  });
  d.addEventListener('change', e => {
    const r = e.target.closest('[data-co]');
    if (!r) return;
    Checkout.set({ [r.dataset.co]: r.value });
    const scroll = document.getElementById('cartItems')?.scrollTop || 0;
    renderCarrito();
    const items = document.getElementById('cartItems');
    if (items) items.scrollTop = scroll;
    d.querySelector(`[data-co="${r.dataset.co}"][value="${r.value}"]`)?.focus();
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    if (scrolled) wsp?.classList.add('visible');
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('pointerover', e => { const card = e.target.closest?.('[data-prod]'); if (card) precargarColores(card); }, { passive: true });
  document.addEventListener('focusin', e => { const card = e.target.closest?.('[data-prod]'); if (card) precargarColores(card); });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle]');
    if (sel) sel.closest('.var-sel')?.classList.remove('is-falta');
  });
  document.addEventListener('click', e => {
    const sw = e.target.closest('[data-prod] [data-sw]');
    if (sw) { cambiarColorCard(sw.closest('[data-prod]'), sw.dataset.sw); return; }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const card = e.target.closest('[data-prod]');
    const colorCard = card?.dataset.color || '';
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv') && !qv.id) { e.preventDefault(); abrirQV(qv.dataset.qv, qv, { color: colorCard || new URL(qv.href, location.href).searchParams.get('tono') || '' }); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, { color: colorCard }); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    const comprar = e.target.closest('[data-comprar]');
    const boton = add || comprar;
    if (boton && card) {
      const p = getProducto(boton.dataset.add || boton.dataset.comprar);
      if (!p) return;
      const sel = card.querySelector('[data-talle]');
      const talle = sel?.value || '';
      if (!talle) {
        const wrap = sel?.closest('.var-sel');
        if (wrap) { wrap.classList.remove('is-falta'); void wrap.offsetWidth; wrap.classList.add('is-falta'); }
        abrirQV(p.id, boton, { color: colorCard });
        return;
      }
      Cart.add(p, 1, colorCard, talle);
      if (comprar) { abrirCarrito(); return; }
      showToast(`Sumaste ${p.nombre} (${varTxt(p, colorCard, talle)}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], uso: multi('uso', OCASIONES), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];
  const compatibles = () => {
    if (!e.cat) e.sub = [];
    const f = Tienda.facetas(e.cat ? { cat: e.cat } : {});
    e.talle = e.talle.filter(t => f.talles[t]);
    e.color = e.color.filter(c => f.colores[c]);
  };
  compatibles();

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.uso.length) f.uso = e.uso;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const colorCard = p => e.color.find(c => p.colores.includes(c)) || '';
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const facTalles = e.color.length ? Tienda.facetas({ ...base, color: e.color }).talles : fac.talles;
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Línea</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Prenda</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i style="--sw:${c.hex}" aria-hidden="true"></i><span>${esc(c.nombre)}</span><small>${fac.colores[c.id]}</small></label>`).join('')}</div></fieldset>`);
    const talles = TALLES.filter(t => facTalles[t] || e.talle.includes(t));
    if (talles.length) grupos.push(`<fieldset class="f-grupo"><legend>Talle con stock</legend><div class="f-talles">
      ${talles.map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`);
    const usos = OCASIONES.filter(u => fac.usos[u.id]);
    if (usos.length) grupos.push(`<fieldset class="f-grupo"><legend>Ocasión</legend>
      ${usos.map(u => opcion('checkbox', `uso-${u.id}`, u.id, esc(u.nombre), e.uso.includes(u.id), fac.usos[u.id], 'uso')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const uso = !cat && e.uso.length === 1 ? OCASIONES.find(u => u.id === e.uso[0]) : null;
    const color = !cat && !uso && e.color.length === 1 ? colorDe(e.color[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : uso ? uso.nombre : color ? `En ${color.nombre.toLowerCase()}` : e.fav ? 'Tus favoritos' : e.orden === 'nuevos' ? 'Recién llegadas' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : uso ? uso.texto : color ? `Las prendas que vienen en ${color.nombre.toLowerCase()}, con la foto en ese color.` : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Ropa de vestir y de fiesta. Tocás un color, ves la prenda en ese color y elegís tu talle con el stock a la vista.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : uso ? uso.nombre : color ? color.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : uso ? `${CATALOGO_URL}?uso=${uso.id}` : color ? `${CATALOGO_URL}?color=${color.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else if (id) a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.uso.length ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      ...OCASIONES.map(u => `<a class="chip" href="${CATALOGO_URL}?uso=${u.id}" data-chip-uso="${u.id}"${!e.cat && e.uso.length === 1 && e.uso[0] === u.id ? ' aria-current="page"' : ''}>${esc(u.nombre)} <small>${Tienda.contar({ uso: u.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.uso.forEach(v => quitar.push(['uso', v, nombreDe(OCASIONES, v)]));
    e.color.forEach(v => quitar.push(['color', v, colorDe(v).nombre]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'uso', 'color', 'talle', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.uso.length) u.searchParams.set('uso', e.uso.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { color: colorCard(p) })}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una prenda y aparece acá.'
      : 'No encontramos prendas con esos filtros. Probá con otro color o talle, o sacá algún filtro.';
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'fav') e.fav = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.uso = []; e.color = []; e.talle = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'fav') e.fav = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-uso]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-uso')) { e.cat = ''; e.sub = []; e.uso = [a.dataset.chipUso]; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.uso = []; if (!e.cat) { e.color = []; e.talle = []; } }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-momentos a, .cats-todo, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.uso = (u.searchParams.get('uso') || '').split(',').filter(v => OCASIONES.some(x => x.id === v));
    e.color = (u.searchParams.get('color') || '').split(',').filter(v => COLORES.some(x => x.id === v));
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.talle = []; e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod, null, { color: params.get('tono') || '' }), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initColores, initProbador, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
