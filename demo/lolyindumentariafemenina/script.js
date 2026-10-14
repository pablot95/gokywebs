const WHATSAPP_NUMBER = '5491163085785';
const wa = lineas => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent([].concat(lineas).join('\n'))}`;

const TALLES = [
  { id: '44', busto: 100, cintura: 84, cadera: 108 },
  { id: '46', busto: 104, cintura: 88, cadera: 112 },
  { id: '48', busto: 108, cintura: 92, cadera: 116 },
  { id: '50', busto: 112, cintura: 96, cadera: 120 },
  { id: '52', busto: 116, cintura: 100, cadera: 124 },
  { id: '54', busto: 120, cintura: 104, cadera: 128 },
  { id: '56', busto: 124, cintura: 108, cadera: 132 },
  { id: '58', busto: 128, cintura: 112, cadera: 136 },
  { id: '60', busto: 132, cintura: 116, cadera: 140 },
];
const TALLE_IDS = TALLES.map(t => t.id);
const R = (a, b) => TALLE_IDS.slice(TALLE_IDS.indexOf(a), TALLE_IDS.indexOf(b) + 1);

const CATEGORIAS = [
  { id: 'blusas', nombre: 'Blusas y camisas', corto: 'Blusas', frase: 'Escotes en V, mangas 3/4 y telas que caen sueltas.', foto: 'col-blusas', alt: 'Mujer con blusa fucsia de mangas abullonadas y jean', mini: 'p-blusa-fucsia' },
  { id: 'pantalones', nombre: 'Pantalones y jeans', corto: 'Pantalones', frase: 'Tiro alto, pierna amplia y cinturas que no se abren.', foto: 'col-pantalones', alt: 'Pantalón palazzo beige con musculosa al tono', mini: 'p-palazzo-beige' },
  { id: 'conjuntos', nombre: 'Conjuntos y monos', corto: 'Conjuntos', frase: 'Blazer y pantalón al tono, o un mono y listo.', foto: 'col-conjuntos', alt: 'Conjunto de blazer y pantalón verde oliva con musculosa negra', mini: 'p-conjunto-verde' },
  { id: 'kimonos', nombre: 'Kimonos y blazers', corto: 'Kimonos', frase: 'Capas livianas para tapar y combinar.', foto: 'col-estampados', alt: 'Blusa con estampa animal y pantalón negro', mini: 'p-kimono-animal' },
  { id: 'remeras', nombre: 'Remeras y musculosas', corto: 'Musculosas', frase: 'Básicos de algodón con breteles anchos.', foto: null, mini: 'p-musculosa-beige' },
];

const COLORES = [
  { id: 'negro', nombre: 'Negro' },
  { id: 'beige', nombre: 'Beige' },
  { id: 'crudo', nombre: 'Crudo' },
  { id: 'verde', nombre: 'Verde oliva' },
  { id: 'azul', nombre: 'Azul jean' },
  { id: 'fucsia', nombre: 'Fucsia' },
  { id: 'terracota', nombre: 'Terracota' },
  { id: 'animal', nombre: 'Estampado' },
];

const PRECIOS = [
  { id: 'h40', nombre: 'Hasta $40.000', min: 0, max: 40000 },
  { id: '40-50', nombre: '$40.000 a $50.000', min: 40000, max: 50000 },
  { id: 'm50', nombre: 'Más de $50.000', min: 50000, max: Infinity },
];

const ESCENAS = {
  'col-blusas': 'col-blusas', 'col-pantalones': 'col-pantalones', 'col-conjuntos': 'col-conjuntos',
  'col-estampados': 'col-estampados', 'look-vertical': 'look-vertical', 'tienda-horizontal': 'tienda-horizontal',
};

const LIMITE_CONSULTA = 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;

function crearTienda(coleccion) {
  const datos = coleccion.map((p, i) => Object.freeze({ ...p, talles: Object.freeze([...p.talles]), orden: i }));
  const porId = new Map(datos.map(p => [p.id, p]));

  const coincide = (p, f) => {
    if (p.visible === false) return false;
    if (f.destacado && !p.destacado) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.cat?.length && !f.cat.includes(p.cat)) return false;
    if (f.talle?.length && !f.talle.some(t => p.talles.includes(t))) return false;
    if (f.color?.length && !f.color.includes(p.color)) return false;
    if (f.stock && p.stock <= 0) return false;
    if (f.excluir?.length && f.excluir.includes(p.id)) return false;
    if (f.precio?.length) {
      const v = precioFinal(p);
      if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
    }
    if (f.q) {
      const cat = CATEGORIAS.find(c => c.id === p.cat);
      const texto = normalizar([p.nombre, cat?.nombre, p.desc, COLORES.find(c => c.id === p.color)?.nombre, ...(p.tags || []), ...p.talles.map(t => 'talle ' + t)].join(' '));
      if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
    }
    return true;
  };

  const ORDENES = {
    destacados: (a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a.orden - b.orden,
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.orden - b.orden,
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b) || a.orden - b.orden,
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a) || a.orden - b.orden,
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden - b.orden,
  };

  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_CONSULTA } = {}) {
    const tope = Math.min(Math.max(1, Math.floor(Number(limite)) || LIMITE_CONSULTA), LIMITE_CONSULTA);
    const cmp = ORDENES[orden] || ORDENES.destacados;
    const items = [];
    let total = 0;
    let pasado = !cursor;
    let siguiente = null;
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(cmp);
    for (const p of ordenados) {
      total++;
      if (!pasado) { if (p.id === cursor) pasado = true; continue; }
      if (items.length < tope) items.push(p);
      else if (!siguiente) siguiente = items[items.length - 1].id;
    }
    if (cursor && !porId.has(cursor)) return Promise.resolve({ items: [], siguiente: null, total });
    return Promise.resolve({ items, siguiente, total });
  }

  const obtener = id => { const p = porId.get(id); return p && p.visible !== false ? p : null; };

  function contar(campo) {
    const n = {};
    datos.forEach(p => {
      if (p.visible === false) return;
      (campo === 'talle' ? p.talles : [p[campo]]).forEach(v => { n[v] = (n[v] || 0) + 1; });
    });
    return n;
  }

  return { consultar, obtener, contar, ORDENES: Object.keys(ORDENES) };
}

const Tienda = crearTienda([
  { id: 'blusa-paris-fucsia', nombre: 'Blusa París fucsia', cat: 'blusas', precio: 42900, descuento: 0, talles: R('44', '58'), color: 'fucsia', stock: 12, destacado: true, hd: true, img: 'p-blusa-fucsia', escena: 'col-blusas', desc: 'Blusa de gasa con escote en V, frunce en los hombros y mangas 3/4 con elástico. Suelta, cae sin marcar.', tags: ['blusa', 'gasa', 'escote v', 'mangas abullonadas', 'rosa'] },
  { id: 'kimono-hojas', nombre: 'Kimono Hojas', cat: 'kimonos', precio: 39900, descuento: 0, talles: R('44', '60'), color: 'animal', stock: 10, destacado: true, nuevo: true, img: 'p-kimono-hojas', escena: 'look-vertical', desc: 'Kimono liviano con estampa de hojas en crudo sobre negro y mangas anchas. Abierto, para llevar arriba de un mono o una musculosa.', tags: ['kimono', 'estampado', 'hojas', 'abrigo liviano', 'negro'] },
  { id: 'pantalon-palazzo-beige', nombre: 'Pantalón Palazzo beige', cat: 'pantalones', precio: 48900, descuento: 0, talles: R('46', '56'), color: 'beige', stock: 10, destacado: true, hd: true, img: 'p-palazzo-beige', escena: 'col-pantalones', desc: 'Palazzo de tiro alto con pinzas y bolsillos. Pierna amplia que estiliza y no aprieta en la cadera.', tags: ['pantalon', 'palazzo', 'wide leg', 'tiro alto', 'vestir'] },
  { id: 'conjunto-olivia', nombre: 'Conjunto Olivia', cat: 'conjuntos', precio: 89900, descuento: 0, talles: R('44', '50'), color: 'verde', stock: 6, destacado: true, hd: true, img: 'p-conjunto-verde', escena: 'col-conjuntos', desc: 'Blazer y pantalón de vestir en verde oliva. Se usan juntos para una ocasión o por separado con un jean o una musculosa.', tags: ['conjunto', 'blazer', 'pantalon', 'sastrero', 'verde'] },
  { id: 'blusa-animal-print', nombre: 'Blusa Animal Print', cat: 'blusas', precio: 46900, descuento: 0, talles: R('50', '60'), color: 'animal', stock: 9, destacado: true, hd: true, img: 'p-blusa-animal', escena: 'col-estampados', desc: 'Camisola con escote en V, estampa animal y mangas 3/4 con puño elastizado. Va con pantalón negro o con jean.', tags: ['blusa', 'camisola', 'animal print', 'leopardo', 'estampado'] },
  { id: 'kimono-animal', nombre: 'Kimono largo Animal Print', cat: 'kimonos', precio: 42900, descuento: 0, talles: R('44', '60'), color: 'animal', stock: 8, destacado: true, img: 'p-kimono-animal', escena: 'tienda-horizontal', desc: 'Kimono largo de gasa con estampa animal y mangas 3/4. Arriba de un total black cambia todo el look.', tags: ['kimono', 'largo', 'animal print', 'estampado', 'gasa'] },
  { id: 'mono-lazo-negro', nombre: 'Mono con lazo negro', cat: 'conjuntos', precio: 64900, descuento: 0, talles: R('44', '50'), color: 'negro', stock: 7, destacado: true, img: 'p-mono-lazo', escena: 'look-vertical', desc: 'Mono de crepe con escote recto, lazo en la cintura y pierna amplia con bolsillos. Una sola prenda y salís vestida.', tags: ['mono', 'enterito', 'crepe', 'wide leg', 'negro'] },
  { id: 'jean-tiro-alto', nombre: 'Jean elastizado tiro alto', cat: 'pantalones', precio: 45900, descuento: 0, talles: R('46', '60'), color: 'azul', stock: 14, destacado: true, img: 'p-jean-tiro-alto', escena: 'col-blusas', desc: 'Jean con elastano, tiro alto y una cintura que no se abre atrás. Lavado celeste medio, de los que van con todo.', tags: ['jean', 'denim', 'elastizado', 'tiro alto', 'celeste'] },
  { id: 'camisa-beige', nombre: 'Camisa de fibrana beige', cat: 'blusas', precio: 38900, descuento: 0, talles: R('54', '60'), color: 'beige', stock: 7, nuevo: true, img: 'p-camisa-beige', escena: 'tienda-horizontal', desc: 'Camisa de fibrana con botones al frente y mangas para arremangar. Fresca para la media estación.', tags: ['camisa', 'fibrana', 'botones', 'beige'] },
  { id: 'blazer-terracota', nombre: 'Blazer liviano terracota', cat: 'kimonos', precio: 69900, descuento: 0, talles: R('46', '52'), color: 'terracota', stock: 3, nuevo: true, img: 'p-blazer-terracota', escena: 'tienda-horizontal', desc: 'Blazer desestructurado, sin forrar, con solapa y mangas para arremangar. El abrigo liviano del entretiempo.', tags: ['blazer', 'saco', 'abrigo liviano', 'naranja', 'oxido'] },
  { id: 'pantalon-sastrero-negro', nombre: 'Pantalón sastrero negro', cat: 'pantalones', precio: 44900, descuento: 0, talles: R('44', '60'), color: 'negro', stock: 16, img: 'p-pantalon-sastrero', escena: 'col-estampados', desc: 'Pantalón recto de tiro alto con pretina ancha y bolsillos. El básico que combina con todas las blusas.', tags: ['pantalon', 'sastrero', 'recto', 'basico', 'vestir'] },
  { id: 'pantalon-cinturon', nombre: 'Pantalón pinzado con cinturón', cat: 'pantalones', precio: 47900, descuento: 15, talles: R('44', '50'), color: 'negro', stock: 5, img: 'p-pantalon-cinturon', escena: 'tienda-horizontal', desc: 'Pantalón negro con pinzas y presillas. Viene con cinturón de cuero ecológico y hebilla dorada.', tags: ['pantalon', 'pinzas', 'cinturon', 'vestir'] },
  { id: 'musculosa-escote-cuadrado', nombre: 'Musculosa escote cuadrado', cat: 'remeras', precio: 18900, descuento: 0, talles: R('44', '60'), color: 'beige', stock: 20, nuevo: true, img: 'p-musculosa-beige', escena: 'col-pantalones', desc: 'Musculosa de algodón con lycra, escote cuadrado y breteles anchos que tapan el corpiño.', tags: ['musculosa', 'remera', 'algodon', 'basico', 'breteles anchos'] },
  { id: 'pantalon-sastrero-verde', nombre: 'Pantalón sastrero verde oliva', cat: 'pantalones', precio: 47900, descuento: 0, talles: R('44', '50'), color: 'verde', stock: 6, img: 'p-pantalon-verde', escena: 'col-conjuntos', desc: 'Pantalón de crepe con pinzas y raya marcada. Es el del Conjunto Olivia y también se vende solo.', tags: ['pantalon', 'sastrero', 'crepe', 'verde'] },
  { id: 'pantalon-gabardina-crudo', nombre: 'Pantalón de gabardina crudo', cat: 'pantalones', precio: 46900, descuento: 0, talles: R('54', '60'), color: 'crudo', stock: 0, img: 'p-pantalon-crudo', escena: 'tienda-horizontal', desc: 'Gabardina con elastano, tiro alto y pierna recta. Combina con un blazer o con una remera blanca.', tags: ['pantalon', 'gabardina', 'recto', 'blanco', 'crudo'] },
]);

const getProducto = id => Tienda.obtener(id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const intentar = fn => { try { return fn(); } catch { return undefined; } };

const MiTalle = {
  KEY: 'loly_talle',
  get() { const t = intentar(() => localStorage.getItem(this.KEY)); return TALLE_IDS.includes(t) ? t : null; },
  set(t) {
    if (!TALLE_IDS.includes(t)) return;
    intentar(() => localStorage.setItem(this.KEY, t));
    document.dispatchEvent(new CustomEvent('talle:cambio', { detail: t }));
  },
  clear() {
    intentar(() => localStorage.removeItem(this.KEY));
    document.dispatchEvent(new CustomEvent('talle:cambio', { detail: null }));
  },
};

const Cart = {
  KEY: 'loly_cart',
  get() {
    const items = intentar(() => JSON.parse(localStorage.getItem(this.KEY))) || [];
    return Array.isArray(items) ? items.filter(i => getProducto(i.id) && TALLE_IDS.includes(i.talle) && i.qty > 0) : [];
  },
  save(items) {
    intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items)));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, talle) {
    if (!producto.talles.includes(talle)) return;
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function tallesTexto(p) {
  const t = p.talles;
  if (t.length === 1) return `Talle ${t[0]}`;
  const seguidos = t.every((v, i) => i === 0 || TALLE_IDS.indexOf(v) === TALLE_IDS.indexOf(t[i - 1]) + 1);
  return seguidos ? `Talles ${t[0]} al ${t[t.length - 1]}` : `Talles ${t.join(', ')}`;
}

function sugerirTalle(busto, cadera) {
  const b = Number(busto); const c = Number(cadera);
  if (!(b >= 60 && b <= 220) && !(c >= 60 && c <= 220)) return { estado: 'invalido' };
  const okB = t => !(b >= 60 && b <= 220) || b <= t.busto + 2;
  const okC = t => !(c >= 60 && c <= 220) || c <= t.cadera + 2;
  const t = TALLES.find(x => okB(x) && okC(x));
  if (!t) return { estado: 'mayor' };
  if (t.id === TALLES[0].id && ((b && b < TALLES[0].busto - 8) || (c && c < TALLES[0].cadera - 8))) return { estado: 'menor', talle: t.id };
  return { estado: 'ok', talle: t.id };
}

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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  subirChico: 'data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
  escala: 'data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

const ICON = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function dispHTML(p) {
  const mi = MiTalle.get();
  if (!mi || p.stock <= 0) return `<span class="disp" data-disp="${esc(p.id)}" hidden></span>`;
  const hay = p.talles.includes(mi);
  return `<span class="disp ${hay ? 'disp--si' : 'disp--no'}" data-disp="${esc(p.id)}">${hay ? `Hay en tu ${mi}` : `Sin tu ${mi}`}</span>`;
}

function pintarDisponibilidad() {
  const mi = MiTalle.get();
  document.querySelectorAll('[data-disp]').forEach(el => {
    const p = getProducto(el.dataset.disp);
    if (!p || !mi || p.stock <= 0) { el.hidden = true; return; }
    const hay = p.talles.includes(mi);
    el.hidden = false;
    el.className = `disp ${hay ? 'disp--si' : 'disp--no'}`;
    el.textContent = hay ? `Hay en tu ${mi}` : `Sin tu ${mi}`;
  });
}

function badgeHTML(p) {
  let b = '';
  if (p.stock <= 0) b = '<span class="etq-badge etq-badge--agotado">Sin stock</span>';
  else if (p.descuento > 0) b = `<span class="etq-badge etq-badge--off">-${Math.round(p.descuento)}%</span>`;
  else if (p.nuevo) b = '<span class="etq-badge">Nuevo</span>';
  else if (p.stock <= 3) b = '<span class="etq-badge etq-badge--ultimas">Últimas</span>';
  return b;
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<span class="precio precio--final">${formatearPrecio(precioFinal(p))}</span><s class="precio--antes">${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

function stepperHTML(p, label) {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="${p.stock}" inputmode="numeric" aria-label="${esc(label)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}

function avisoHTML(p) {
  return `<a class="btn btn--line prod-aviso" href="${wa(`Hola Loly! ¿Vuelve a entrar el ${p.nombre}? Lo vi sin stock en la tienda online.`)}" target="_blank" rel="noopener noreferrer">Avisame cuando vuelva</a>`;
}

function cardHTML(p, { animar = true } = {}) {
  const cat = getCategoria(p.cat);
  const agotado = p.stock <= 0;
  return `<article class="prod${agotado ? ' prod--agotado' : ''}" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
    <div class="prod__media">
      <button class="prod__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"></span></button>
      ${badgeHTML(p)}
      ${dispHTML(p)}
    </div>
    <div class="prod__info">
      <p class="prod__cat">${esc(cat?.corto)}</p>
      <h3 class="prod__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="prod__talles">${tallesTexto(p)}</p>
      <p class="prod__precio">${precioHTML(p)}</p>
      ${agotado ? avisoHTML(p) : `<div class="prod-actions">
        ${stepperHTML(p, 'Cantidad de ' + p.nombre)}
        <button class="btn btn--cta prod-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span>Agregar</span></button>
      </div>
      <button class="prod-buy" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function filaHTML(p) {
  const agotado = p.stock <= 0;
  return `<li ${ANIM.subir}><article class="fila${agotado ? ' prod--agotado' : ''}" data-id="${esc(p.id)}">
    <div class="fila__media">
      <button class="fila__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"></span></button>
      ${badgeHTML(p)}
    </div>
    <div class="fila__info">
      <h3 class="fila__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="fila__precio">${precioHTML(p)}</p>
      <p class="fila__talles">${tallesTexto(p)}</p>
      ${dispHTML(p)}
      ${agotado ? avisoHTML(p) : `<button class="btn btn--cta fila__add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span>Agregar</span></button>`}
    </div>
  </article></li>`;
}

function mosaicoHTML(p, grande) {
  const agotado = p.stock <= 0;
  return `<li class="mos${grande ? ' mos--grande' : ''}" ${ANIM.subir}><article class="mos__card${agotado ? ' prod--agotado' : ''}" data-id="${esc(p.id)}">
    <div class="mos__media">
      <button class="mos__foto" type="button" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800" decoding="async"></span></button>
      ${badgeHTML(p)}
      ${dispHTML(p)}
      ${agotado ? '' : `<button class="mos__add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.mas}<span>Agregar</span></button>`}
    </div>
    <div class="mos__info">
      <h3 class="mos__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="mos__precio">${precioHTML(p)}</p>
    </div>
    <p class="mos__talles">${tallesTexto(p)}</p>
  </article></li>`;
}

function renderMenus() {
  const porCat = Tienda.contar('cat');
  const porTalle = Tienda.contar('talle');
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? (params.get('cat') || '') : '';
  const talleActual = PAGINA === 'catalogo' ? (params.get('talle') || '') : '';
  document.querySelectorAll('[data-cat-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
      <span class="cat-link__img"><img src="images/${c.mini}.webp" alt="" width="640" height="800"></span>
      <span class="cat-link__nombre">${esc(c.nombre)}</span>
      <span class="cat-link__n">${porCat[c.id] || 0}</span></a></li>`).join('')
      + `<li class="cat-link--todo"><a href="${CATALOGO}">Ver todo el catálogo ${ICON.flecha}</a></li>`;
  });
  document.querySelectorAll('[data-talle-menu]').forEach(ul => {
    ul.innerHTML = TALLES.map(t => `<li><a class="etq etq--link" href="${CATALOGO}?talle=${t.id}"${talleActual === t.id ? ' aria-current="page"' : ''} aria-label="Talle ${t.id}: ${porTalle[t.id] || 0} prendas"><span class="etq__n">${t.id}</span><small>${porTalle[t.id] || 0}</small></a></li>`).join('')
      + '<li class="talle-links__guia"><button type="button" class="link-guia" data-abrir-talle>¿No sabés tu talle? Calculalo</button></li>';
  });
  document.querySelectorAll('[data-cat-links]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
  });
}

function renderCategorias() {
  const porCat = Tienda.contar('cat');
  const circ = document.getElementById('catCirculos');
  if (circ) {
    circ.innerHTML = CATEGORIAS.map(c => `<li ${ANIM.escala}><a class="circ" href="${CATALOGO}?cat=${c.id}">
      <span class="circ__foto"><img src="images/${c.mini}.webp" alt="" width="640" height="800" decoding="async"></span>
      <span class="circ__nombre">${esc(c.corto)}</span>
      <span class="circ__n">${porCat[c.id] || 0} prendas</span></a></li>`).join('')
      + `<li ${ANIM.escala}><a class="circ circ--todo" href="${CATALOGO}"><span class="circ__foto">${ICON.flecha}</span><span class="circ__nombre">Ver todo</span><span class="circ__n">${Object.values(porCat).reduce((a, b) => a + b, 0)} prendas</span></a></li>`;
  }
  const col = document.getElementById('colGrid');
  if (col) {
    col.innerHTML = CATEGORIAS.filter(c => c.foto).map(c => `<li ${ANIM.subir}><a class="col-card" href="${CATALOGO}?cat=${c.id}">
      <span class="col-card__foto"><img src="images/${c.foto}.webp" alt="${esc(c.alt)}" width="1000" height="1000" decoding="async"></span>
      <span class="col-card__txt">
        <span class="col-card__nombre">${esc(c.nombre)}</span>
        <span class="col-card__frase">${esc(c.frase)}</span>
        <span class="col-card__cta">Ver ${porCat[c.id] || 0} prendas ${ICON.flecha}</span>
      </span></a></li>`).join('');
  }
}

function renderChoosers() {
  const mi = MiTalle.get();
  document.querySelectorAll('[data-talle-chooser]').forEach(box => {
    const animar = box.hasAttribute('data-animar');
    box.innerHTML = TALLES.map(t => `<span class="etq-wrap"${animar ? ' ' + ANIM.escala : ''}><button type="button" class="etq etq--chip" data-mi-talle="${t.id}" aria-pressed="${mi === t.id}" aria-label="Talle ${t.id}"><span class="etq__n">${t.id}</span></button></span>`).join('');
  });
}

function sincronizarTalle() {
  const mi = MiTalle.get();
  document.querySelectorAll('[data-mi-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.miTalle === mi)));
  document.querySelectorAll('[data-mi-talle-label]').forEach(el => { el.textContent = mi || '—'; });
  document.querySelectorAll('.mi-talle-btn').forEach(b => {
    b.classList.toggle('mi-talle-btn--on', !!mi);
    b.setAttribute('aria-label', mi ? `Tu talle: ${mi}. Cambiar talle` : 'Elegir tu talle');
    b.classList.remove('bump'); void b.offsetWidth; if (mi) b.classList.add('bump');
  });
  pintarDisponibilidad();
}

const Home = { pedido: 0 };
async function renderHome() {
  const fila = document.getElementById('gridTalle');
  const mos = document.getElementById('mosaico');
  if (!fila && !mos) return;
  const mi = MiTalle.get();
  const pedido = ++Home.pedido;
  const filtros = mi ? { talle: [mi], stock: true } : { destacado: true };
  const { items, total } = await Tienda.consultar({ filtros, orden: 'destacados', limite: 8 });
  if (pedido !== Home.pedido) return;
  if (fila) fila.innerHTML = items.map(filaHTML).join('');
  if (mos) {
    const grande = items.findIndex(p => p.hd && p.stock > 0);
    const orden = grande > 0 ? [items[grande], ...items.filter((_, i) => i !== grande)] : items;
    const totalCat = Object.values(Tienda.contar('cat')).reduce((a, b) => a + b, 0);
    const vis = orden.slice(0, 7);
    const celdas = vis.length ? vis.length + 3 : 0;
    const celdasM = vis.length ? vis.length + 1 : 0;
    const span = (4 - (celdas % 4)) % 4 || 4;
    const spanM = celdasM % 2 ? 1 : 2;
    mos.innerHTML = vis.map((p, i) => mosaicoHTML(p, i === 0)).join('')
      + `<li class="mos mos--cta" data-animate="subir" style="--span:${span};--span-m:${spanM};opacity:0;transform:translateY(44px)"><a class="mos__vertodo" href="${mi ? `${CATALOGO}?talle=${mi}` : CATALOGO}"><span class="mos__vertodo-n">${mi ? total : totalCat}</span><span class="mos__vertodo-txt">${mi ? `prendas en talle ${mi}` : 'prendas en el catálogo'}</span><span class="btn btn--line btn--claro">Ver todas ${ICON.flecha}</span></a></li>`;
  }
  const estado = document.querySelector('[data-estado-talle]');
  if (estado) estado.innerHTML = mi
    ? `En talle <strong>${mi}</strong> hay ${total} ${total === 1 ? 'prenda' : 'prendas'} con stock.`
    : 'Elegí tu talle arriba y te mostramos solo lo que hay.';
  document.querySelectorAll('[data-ver-talle]').forEach(a => {
    a.href = mi ? `${CATALOGO}?talle=${mi}` : CATALOGO;
    const txt = a.querySelector('span') || a;
    txt.textContent = mi ? `Ver las ${total} prendas en talle ${mi}` : 'Ver todo el catálogo';
  });
  revelarNuevos(fila || mos);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

const Catalogo = {
  estado: { cat: [], talle: [], color: [], precio: [], stock: false, nuevo: false, q: '', orden: 'destacados' },
  buffer: [], siguiente: null, total: 0, mostrar: 16, PASO: 16, pintados: 0, pedido: 0,
};

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const lista = (k, validos) => [...new Set((p.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v)))];
  const e = Catalogo.estado;
  e.cat = lista('cat', CATEGORIAS.map(c => c.id));
  e.talle = lista('talle', TALLE_IDS);
  e.color = lista('color', COLORES.map(c => c.id));
  e.precio = lista('precio', PRECIOS.map(x => x.id));
  e.stock = p.get('stock') === '1';
  e.nuevo = p.get('nuevo') === '1';
  e.q = (p.get('q') || '').trim().slice(0, 60);
  e.orden = Tienda.ORDENES.includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  if (e.cat.length) p.set('cat', e.cat.join(','));
  if (e.talle.length) p.set('talle', e.talle.join(','));
  if (e.color.length) p.set('color', e.color.join(','));
  if (e.precio.length) p.set('precio', e.precio.join(','));
  if (e.stock) p.set('stock', '1');
  if (e.nuevo) p.set('nuevo', '1');
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function filtrosActivos() {
  const e = Catalogo.estado;
  return e.cat.length + e.talle.length + e.color.length + e.precio.length + (e.stock ? 1 : 0) + (e.nuevo ? 1 : 0);
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const f = inp.dataset.f;
    inp.checked = (f === 'stock' || f === 'nuevo') ? e[f] : (e[f] || []).includes(inp.value);
  });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = n ? `(${n})` : ''; });

  const unaCat = e.cat.length === 1 ? getCategoria(e.cat[0]) : null;
  const unTalle = e.talle.length === 1 ? e.talle[0] : null;
  const titulo = unaCat && unTalle ? `${unaCat.nombre} en talle ${unTalle}` : unaCat ? unaCat.nombre : unTalle ? `Prendas en talle ${unTalle}` : e.nuevo ? 'Novedades' : 'Catálogo completo';
  const h1 = document.getElementById('catTitulo');
  if (h1) h1.textContent = titulo;
  const miga = document.getElementById('migaCat');
  if (miga) { const hay = titulo !== 'Catálogo completo'; miga.hidden = !hay; miga.textContent = hay ? titulo : ''; }
  document.title = `${titulo === 'Catálogo completo' ? 'Catálogo' : titulo} — Loly Indumentaria femenina`;
  document.querySelectorAll('[data-cat-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-talle-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('talle');
    if (unTalle && id === unTalle) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('#catPills a').forEach(a => {
    const id = a.dataset.pill;
    const activo = id ? (e.cat.length === 1 && e.cat[0] === id) : !e.cat.length;
    if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const solo = document.getElementById('soloMiTalle');
  if (solo) {
    const mi = MiTalle.get();
    solo.hidden = !mi || (e.talle.length === 1 && e.talle[0] === mi);
    solo.textContent = mi ? `Ver solo talle ${mi}` : '';
  }
  const chips = document.getElementById('chipsActivos');
  if (chips) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.nombre })),
      ...e.talle.map(id => ({ f: 'talle', v: id, t: `Talle ${id}` })),
      ...e.color.map(id => ({ f: 'color', v: id, t: COLORES.find(x => x.id === id)?.nombre })),
      ...e.precio.map(id => ({ f: 'precio', v: id, t: PRECIOS.find(x => x.id === id)?.nombre })),
      ...(e.stock ? [{ f: 'stock', v: '1', t: 'Con stock' }] : []),
      ...(e.nuevo ? [{ f: 'nuevo', v: '1', t: 'Novedades' }] : []),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chips.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON.x}</button>`).join('');
  }
}

async function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, talle: e.talle, color: e.color, precio: e.precio, stock: e.stock, nuevo: e.nuevo, q: e.q };
  const pedido = ++Catalogo.pedido;
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    const r = await Tienda.consultar({ filtros, orden: e.orden, limite: LIMITE_CONSULTA });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer = r.items; Catalogo.siguiente = r.siguiente; Catalogo.total = r.total; Catalogo.pintados = 0;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = await Tienda.consultar({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_CONSULTA });
    if (pedido !== Catalogo.pedido) return;
    Catalogo.buffer.push(...r.items); Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'prenda' : 'prendas'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    mas.hidden = Catalogo.pintados >= Catalogo.total;
    mas.textContent = `Ver más prendas (${Math.max(0, Catalogo.total - Catalogo.pintados)})`;
  }
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

async function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const porCat = Tienda.contar('cat');
  const porTalle = Tienda.contar('talle');
  const porColor = Tienda.contar('color');
  const fTalle = document.getElementById('fTalle');
  if (fTalle) fTalle.innerHTML = TALLES.map(t => `<label class="f-talle"><input type="checkbox" data-f="talle" value="${t.id}" aria-label="Talle ${t.id} (${porTalle[t.id] || 0} prendas)"><span class="etq etq--chip" aria-hidden="true"><span class="etq__n">${t.id}</span></span></label>`).join('');
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="f-n">${porCat[c.id] || 0}</span></label>`).join('');
  const fColor = document.getElementById('fColor');
  if (fColor) fColor.innerHTML = COLORES.filter(c => porColor[c.id]).map(c => `<label class="f-check"><input type="checkbox" data-f="color" value="${c.id}"><span class="tono tono--${c.id}" aria-hidden="true"></span><span>${esc(c.nombre)}</span><span class="f-n">${porColor[c.id] || 0}</span></label>`).join('');
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = PRECIOS.map(x => `<label class="f-check"><input type="checkbox" data-f="precio" value="${x.id}"><span>${esc(x.nombre)}</span></label>`).join('');
  const pills = document.getElementById('catPills');
  if (pills) pills.innerHTML = `<a href="${CATALOGO}" data-pill="">Todo</a>` + CATEGORIAS.map(c => `<a href="${CATALOGO}?cat=${c.id}" data-pill="${c.id}">${esc(c.corto)}</a>`).join('');

  leerURLCatalogo();
  sincronizarControles();
  await cargarCatalogo(true);

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const e = Catalogo.estado; const f = inp.dataset.f;
    if (f === 'stock' || f === 'nuevo') e[f] = inp.checked;
    else e[f] = inp.checked ? [...new Set([...e[f], inp.value])] : e[f].filter(v => v !== inp.value);
    aplicarCambioCatalogo();
  });
  const form = document.getElementById('buscadorForm');
  const buscar = document.getElementById('buscar');
  let t = 0;
  form?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); });
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 280);
  });
  document.getElementById('orden')?.addEventListener('change', ev => { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); });
  document.addEventListener('click', ev => {
    const quitar = ev.target.closest('[data-quitar]');
    if (quitar) {
      const e = Catalogo.estado; const f = quitar.dataset.quitar; const v = quitar.dataset.valor;
      if (f === 'stock' || f === 'nuevo') e[f] = false; else if (f === 'q') e.q = ''; else e[f] = e[f].filter(x => x !== v);
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.closest('[data-limpiar]')) {
      Object.assign(Catalogo.estado, { cat: [], talle: [], color: [], precio: [], stock: false, nuevo: false, q: '' });
      aplicarCambioCatalogo();
      return;
    }
    if (ev.target.closest('#soloMiTalle')) {
      const mi = MiTalle.get();
      if (mi) { Catalogo.estado.talle = [mi]; aplicarCambioCatalogo(); }
      return;
    }
    const pill = ev.target.closest('#catPills a');
    if (pill) {
      ev.preventDefault();
      Catalogo.estado.cat = pill.dataset.pill ? [pill.dataset.pill] : [];
      aplicarCambioCatalogo();
    }
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    Catalogo.mostrar += Catalogo.PASO;
    cargarCatalogo(false);
  });
  if (new URLSearchParams(location.search).has('q')) document.getElementById('buscar')?.focus({ preventScroll: true });
  initFiltrosDrawer();
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  const abrir = document.getElementById('filtrosOpen');
  if (!panel || !abrir) return;
  const esDrawer = () => MODELO === '2' || !window.matchMedia('(min-width: 1025px)').matches;
  let bd = null;
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd?.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (bd) bd.hidden = true; }, 300);
    abrir.focus();
  };
  const open = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; bd.hidden = true; document.body.appendChild(bd); bd.addEventListener('click', cerrar); }
    bd.hidden = false;
    requestAnimationFrame(() => bd.classList.add('open'));
    panel.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  abrir.addEventListener('click', open);
  panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  panel.addEventListener('keydown', e => {
    if (!esDrawer() || !panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    atraparFoco(panel, e);
  });
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
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.09, duration: 1.8, stagger: 0.12 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-datos li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72)
    .from(hero.querySelectorAll('.hero-panel__txt'), { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.5)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, rotate: -8, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-full__foto img');
  if (foto) gsap.to(foto, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero-full', start: 'top top', end: 'bottom top', scrub: true } });
  const num = document.querySelector('.curva__num');
  if (num) gsap.fromTo(num, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: num, start: 'top bottom', end: 'bottom top', scrub: true } });
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
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a, [data-abrir-talle]')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initDropdowns() {
  const drops = [...document.querySelectorAll('[data-drop]')];
  if (!drops.length) return;
  const desk = window.matchMedia('(min-width: 1025px)');
  const cerrar = d => { d.classList.remove('open'); d.querySelector('.nav-drop__btn')?.setAttribute('aria-expanded', 'false'); };
  drops.forEach(d => {
    const btn = d.querySelector('.nav-drop__btn');
    let t = 0;
    const abrir = () => {
      clearTimeout(t);
      drops.forEach(o => { if (o !== d) cerrar(o); });
      d.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
    };
    btn.addEventListener('click', () => (d.classList.contains('open') ? cerrar(d) : abrir()));
    d.addEventListener('mouseenter', () => { if (desk.matches) abrir(); });
    d.addEventListener('mouseleave', () => { if (desk.matches) t = setTimeout(() => cerrar(d), 120); });
    d.addEventListener('focusout', e => { if (desk.matches && !d.contains(e.relatedTarget)) cerrar(d); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && d.classList.contains('open')) { e.stopPropagation(); cerrar(d); btn.focus(); } });
  });
  document.addEventListener('click', e => { if (desk.matches && !e.target.closest('[data-drop]')) drops.forEach(cerrar); });
}

function initSearch() {
  const btn = document.querySelector('[data-search-toggle]');
  const form = document.getElementById('headerSearch');
  if (!btn || !form) return;
  btn.addEventListener('click', () => {
    const enPagina = document.getElementById('buscar');
    if (enPagina) {
      enPagina.scrollIntoView({ block: 'center' });
      enPagina.focus();
      return;
    }
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) form.querySelector('input')?.focus();
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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
  cart?.addEventListener('click', e => abrirCarrito(e.currentTarget));
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

function leerCantidad(cont) {
  const inp = cont?.querySelector('.stepper input');
  const v = parseInt(inp?.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 1;
}

function intentarAgregar(p, qty, modo, opener) {
  if (!p || p.stock <= 0) return;
  const mi = MiTalle.get();
  if (mi && p.talles.includes(mi)) {
    Cart.add(p, qty, mi);
    showToast(`Sumaste ${p.nombre} · talle ${mi}`);
    if (modo === 'buy') abrirCarrito(opener);
    return;
  }
  abrirQV(p.id, opener, { pedirTalle: true, qty });
}

function initCompra() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const inp = step.parentElement.querySelector('input');
      const max = parseInt(inp.max, 10) || 99;
      inp.value = Math.max(1, Math.min(max, (parseInt(inp.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const chip = e.target.closest('[data-mi-talle]');
    if (chip) {
      const t = chip.dataset.miTalle;
      if (MiTalle.get() === t) MiTalle.clear(); else MiTalle.set(t);
      return;
    }
    if (e.target.closest('[data-abrir-talle]')) { abrirTalleModal(e.target.closest('[data-abrir-talle]')); return; }
    const add = e.target.closest('[data-add], [data-buy]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.buy);
      const card = add.closest('.prod, .fila, .mos__card');
      intentarAgregar(p, leerCantidad(card), add.dataset.buy ? 'buy' : 'add', add);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQV(quick.dataset.quick, quick);
  });
  document.addEventListener('input', e => {
    const inp = e.target.closest('.stepper input');
    if (!inp || inp.closest('.linea')) return;
    const max = parseInt(inp.max, 10) || 99;
    const v = parseInt(inp.value, 10);
    if (Number.isFinite(v) && v > max) inp.value = max;
  });
  document.addEventListener('talle:cambio', e => {
    sincronizarTalle();
    renderHome();
    if (PAGINA === 'catalogo') sincronizarControles();
    if (e.detail) showToast(`Listo: te mostramos primero lo que hay en talle ${e.detail}`);
  });
}

const Drawer = { opener: null };
function abrirCarrito(opener) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  Drawer.opener = opener || document.activeElement;
  renderCarrito();
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
  document.body.classList.add('no-scroll');
  drawer.querySelector('[data-close-drawer]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  if (document.getElementById('quickView')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  Drawer.opener?.focus?.();
}

function renderCarrito() {
  const cont = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!cont) return;
  const items = Cart.get();
  if (!items.length) {
    cont.innerHTML = `<div class="carrito-vacio">${ICON.bolsa}<p class="carrito-vacio__titulo">Todavía no sumaste prendas</p><p>Elegí tu talle, tocá «Agregar» y la prenda aparece acá.</p><a class="btn btn--primary" href="${CATALOGO}">Volver al catálogo</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="linea" data-linea="${esc(i.id)}" data-talle="${esc(i.talle)}">
      <div class="linea__img"><img src="images/${p.img}.webp" alt="" width="640" height="800"></div>
      <div>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__talle"><span class="etq etq--mini"><span class="etq__n">${esc(i.talle)}</span></span> Talle ${esc(i.talle)}</p>
        <div class="stepper stepper--chico"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${i.qty}" min="1" max="${p.stock}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
      </div>
      <div class="linea__der">
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
        <button type="button" class="linea__quitar" data-linea-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const link = document.getElementById('cartWsp');
  if (link) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `- ${p.nombre} (talle ${i.talle}) x${i.qty}: ${formatearPrecio(precioFinal(p) * i.qty)}`; });
    link.href = wa(['Hola Loly! Quiero hacer este pedido de la tienda online:', ...lineas, `Total: ${formatearPrecio(Cart.total())}`, '¿Cómo coordinamos el envío?']);
  }
}

function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrirCarrito(b)));
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.querySelectorAll('[data-close-drawer]').forEach(b => b.addEventListener('click', cerrarCarrito));
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); atraparFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('a[href]') && !e.target.closest('#cartWsp')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea; const talle = linea.dataset.talle;
    const it = Cart.get().find(i => i.id === id && i.talle === talle);
    if (e.target.closest('[data-linea-quitar]')) { Cart.remove(id, talle); return; }
    const step = e.target.closest('[data-linea-step]');
    if (step && it) Cart.setQty(id, talle, it.qty + Number(step.dataset.lineaStep));
  });
  drawer.addEventListener('change', e => {
    const inp = e.target.closest('[data-linea-qty]');
    if (!inp) return;
    const linea = inp.closest('[data-linea]');
    Cart.setQty(linea.dataset.linea, linea.dataset.talle, parseInt(inp.value, 10) || 1);
  });
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderCarrito(); });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
}

const QV = { opener: null, talle: null, id: null };
function mensajeTalleQV(p, pedir) {
  const mi = MiTalle.get();
  if (QV.talle) return `Talle ${QV.talle} elegido`;
  if (pedir && mi && !p.talles.includes(mi)) return `No hay en tu talle ${mi}: elegí otro o consultanos`;
  return pedir ? 'Elegí el talle para sumarla' : 'Elegí el talle';
}

async function abrirQV(id, opener, { pedirTalle = false, qty = 1 } = {}) {
  const qv = document.getElementById('quickView');
  const cont = document.getElementById('qvContent');
  if (!qv || !cont) return;
  const p = getProducto(id);
  if (!p) return;
  const mi = MiTalle.get();
  QV.opener = opener || document.activeElement; QV.id = p.id; QV.talle = mi && p.talles.includes(mi) ? mi : null;
  const cat = getCategoria(p.cat);
  const escena = ESCENAS[p.escena];
  const { items } = await Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, limite: 3 });
  const agotado = p.stock <= 0;
  const url = new URL(`${CATALOGO}?producto=${p.id}`, location.href).href;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__foto" id="qvFoto"><img src="images/${p.img}.webp" alt="${esc(p.nombre)}" width="640" height="800"></div>
      <div class="qv__thumbs">
        <button type="button" class="qv__thumb" aria-pressed="true" data-qv-foto="${p.img}" aria-label="Ver la prenda"><img src="images/${p.img}.webp" alt="" width="640" height="800"></button>
        ${escena ? `<button type="button" class="qv__thumb" aria-pressed="false" data-qv-foto="${escena}" data-qv-escena aria-label="Ver el look completo"><img src="images/${escena}.webp" alt="" width="640" height="800"></button>` : ''}
      </div>
    </div>
    <div class="qv__info">
      <p class="prod__cat">${esc(cat?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${precioHTML(p)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <div class="qv__talles${pedirTalle && !QV.talle ? ' falta' : ''}" id="qvTalles">
        <div class="qv__talles-head"><span id="qvTalleMsg">${esc(mensajeTalleQV(p, pedirTalle))}</span><button type="button" class="link-guia" data-abrir-talle>¿Cuál es mi talle?</button></div>
        <div class="qv__talle-ops">${TALLES.map(t => {
          const hay = p.talles.includes(t.id) && !agotado;
          return `<button type="button" class="etq etq--chip" data-qv-talle="${t.id}" aria-pressed="${QV.talle === t.id}" aria-label="Talle ${t.id}${hay ? '' : ', sin stock'}"${hay ? '' : ' disabled'}><span class="etq__n">${t.id}</span></button>`;
        }).join('')}</div>
      </div>
      <p class="qv__stock">${agotado ? 'Sin stock por ahora: escribinos y te avisamos cuando vuelva.' : p.stock <= 3 ? `${tallesTexto(p)} · quedan ${p.stock} unidades.` : `${tallesTexto(p)} · hay stock.`}</p>
      ${agotado
        ? `<div class="qv__acciones">${avisoHTML(p)}</div>`
        : `<div class="qv__acciones">${stepperHTML(p, 'Cantidad')}<button type="button" class="btn btn--cta" data-qv-add>${ICON.carrito} Agregar al carrito</button><button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button></div>`}
      <a class="qv__wsp" id="qvWsp" href="${wa(`Hola Loly! Quiero consultar por ${p.nombre}${QV.talle ? ` en talle ${QV.talle}` : ''}.`)}" target="_blank" rel="noopener noreferrer">${ICON.wsp} Consultar por esta prenda</a>
      ${items.length ? `<div class="qv__mas"><p class="qv__mas-titulo">Para combinar</p><ul>${items.map(m => `<li><button type="button" data-qv-otro="${esc(m.id)}"><span class="linea__img"><img src="images/${m.img}.webp" alt="" width="640" height="800"></span><span>${esc(m.nombre)}</span><strong>${formatearPrecio(precioFinal(m))}</strong></button></li>`).join('')}</ul></div>` : ''}
    </div>
  </div>`;
  const inpQty = cont.querySelector('.qv__acciones .stepper input');
  if (inpQty) inpQty.value = Math.min(qty, p.stock);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: cat?.nombre, size: p.talles.join(', '), brand: { '@type': 'Brand', name: 'Loly Indumentaria femenina' }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', url } });
  if (qv.hidden) {
    qv.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  }
  document.body.classList.add('no-scroll');
  qv.querySelector('.qv__panel').scrollTop = 0;
  if (pedirTalle && !QV.talle) qv.querySelector('[data-qv-talle]:not(:disabled)')?.focus();
  else qv.querySelector('.qv__close')?.focus();
  const params = new URLSearchParams(location.search);
  params.set('producto', p.id);
  window.history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
}

function cerrarQV() {
  const qv = document.getElementById('quickView');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 350);
  const params = new URLSearchParams(location.search);
  params.delete('producto');
  const qs = params.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  QV.opener?.focus?.();
}

function initQV() {
  const qv = document.getElementById('quickView');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-close-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      const box = document.getElementById('qvFoto');
      box.classList.toggle('qv__foto--escena', foto.hasAttribute('data-qv-escena'));
      box.querySelector('img').src = `images/${foto.dataset.qvFoto}.webp`;
      return;
    }
    const t = e.target.closest('[data-qv-talle]');
    if (t) {
      QV.talle = t.dataset.qvTalle;
      qv.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      document.getElementById('qvTalles')?.classList.remove('falta');
      const msg = document.getElementById('qvTalleMsg');
      if (msg) msg.textContent = `Talle ${QV.talle} elegido`;
      const p = getProducto(QV.id);
      const w = document.getElementById('qvWsp');
      if (w && p) w.href = wa(`Hola Loly! Quiero consultar por ${p.nombre} en talle ${QV.talle}.`);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (add) {
      const p = getProducto(QV.id);
      if (!p) return;
      if (!QV.talle) {
        const box = document.getElementById('qvTalles');
        box.classList.remove('falta'); void box.offsetWidth; box.classList.add('falta');
        const msg = document.getElementById('qvTalleMsg');
        if (msg) msg.textContent = 'Elegí un talle para seguir';
        box.querySelector('[data-qv-talle]:not(:disabled)')?.focus();
        return;
      }
      const qty = leerCantidad(qv.querySelector('.qv__acciones'));
      Cart.add(p, qty, QV.talle);
      showToast(`Sumaste ${p.nombre} · talle ${QV.talle}`);
      if (add.hasAttribute('data-qv-buy')) { const op = QV.opener; cerrarQV(); abrirCarrito(op); }
      return;
    }
    const otro = e.target.closest('[data-qv-otro]');
    if (otro) abrirQV(otro.dataset.qvOtro, QV.opener);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!document.getElementById('talleModal')?.hidden) return; cerrarQV(); return; }
    atraparFoco(qv, e);
  });
}

const TM = { opener: null };
function abrirTalleModal(opener) {
  const m = document.getElementById('talleModal');
  if (!m) return;
  TM.opener = opener || document.activeElement;
  sincronizarTalle();
  m.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('open')));
  document.body.classList.add('no-scroll');
  m.querySelector('.tm__close')?.focus();
}
function cerrarTalleModal() {
  const m = document.getElementById('talleModal');
  if (!m || m.hidden) return;
  m.classList.remove('open');
  if (document.getElementById('quickView')?.hidden !== false && document.getElementById('cartDrawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { m.hidden = true; }, 300);
  TM.opener?.focus?.();
}

function initTalleModal() {
  const m = document.getElementById('talleModal');
  if (!m) return;
  const tabla = document.getElementById('tmTabla');
  if (tabla) tabla.innerHTML = TALLES.map(t => `<tr data-fila-talle="${t.id}"><th scope="row"><span class="etq etq--mini"><span class="etq__n">${t.id}</span></span></th><td>${t.busto}</td><td>${t.cintura}</td><td>${t.cadera}</td></tr>`).join('');
  m.addEventListener('click', e => {
    if (e.target.closest('[data-close-tm]')) cerrarTalleModal();
    const usar = e.target.closest('[data-usar-talle]');
    if (usar) { MiTalle.set(usar.dataset.usarTalle); cerrarTalleModal(); }
  });
  m.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarTalleModal(); return; }
    atraparFoco(m, e);
  });
  const form = document.getElementById('tmForm');
  const out = document.getElementById('tmResultado');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const busto = form.elements.busto.value;
    const cadera = form.elements.cadera.value;
    const r = sugerirTalle(busto, cadera);
    m.querySelectorAll('[data-fila-talle]').forEach(tr => tr.classList.toggle('on', tr.dataset.filaTalle === r.talle));
    const medidas = [busto ? `busto ${busto} cm` : '', cadera ? `cadera ${cadera} cm` : ''].filter(Boolean).join(', ');
    if (r.estado === 'invalido') {
      out.innerHTML = '<p class="tm__res-txt">Cargá tu busto o tu cadera en centímetros (por ejemplo, 118).</p>';
      form.elements.busto.setAttribute('aria-invalid', 'true');
      form.elements.cadera.setAttribute('aria-invalid', 'true');
    } else if (r.estado === 'mayor') {
      out.innerHTML = `<p class="tm__res-txt">Tus medidas pasan nuestra tabla. Hay prendas amplias que te pueden andar: escribinos y te decimos cuáles.</p><a class="btn btn--line" href="${wa(`Hola Loly! Mis medidas son ${medidas}. ¿Qué prendas me quedan?`)}" target="_blank" rel="noopener noreferrer">${ICON.wsp} Consultar con mis medidas</a>`;
    } else {
      const extra = r.estado === 'menor' ? ' Nuestra curva arranca en el 44: si te queda grande, consultanos.' : '';
      out.innerHTML = `<p class="tm__res-txt">Te sugerimos el talle <span class="etq etq--mini"><span class="etq__n">${r.talle}</span></span>${extra}</p><button type="button" class="btn btn--cta" data-usar-talle="${r.talle}">Usar talle ${r.talle}</button><a class="tm__res-wsp" href="${wa(`Hola Loly! Mis medidas son ${medidas} y la tabla me da talle ${r.talle}. ¿Me lo confirmás?`)}" target="_blank" rel="noopener noreferrer">Confirmarlo por WhatsApp</a>`;
    }
    if (r.estado !== 'invalido') { form.elements.busto.removeAttribute('aria-invalid'); form.elements.cadera.removeAttribute('aria-invalid'); }
  });
}

function abrirProductoDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQV(id, null);
}

async function init() {
  initNav();
  initDropdowns();
  initSearch();
  initModelBarScroll();
  renderMenus();
  renderCategorias();
  renderChoosers();
  await renderHome();
  await initCatalogo();
  initReveals();
  initFloats();
  initCompra();
  initCarrito();
  initQV();
  initTalleModal();
  sincronizarTalle();
  updateCartBadge();
  initHeroMotion();
  initParallax();
  abrirProductoDesdeURL();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}
init();
