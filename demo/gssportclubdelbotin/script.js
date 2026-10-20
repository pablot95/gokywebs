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

const WSP = '5491158767881';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_CANCHA = 'gssport_cancha';

const CATEGORIAS = [
  { id: 'botines', nombre: 'Botines', dorsal: '01', img: 'images/c-botines.webp', bajada: 'Botines para césped natural, sintético y zapatillas de futsal, del 35 al 45.' },
  { id: 'pelotas', nombre: 'Pelotas', dorsal: '02', img: 'images/c-pelotas.webp', bajada: 'Pelotas cosidas en N° 4 y N° 5 para entrenar y para el partido.' },
  { id: 'guantes', nombre: 'Guantes', dorsal: '03', img: 'images/c-guantes.webp', bajada: 'Guantes de arquero con palma de látex, del talle 7 al 10.' },
  { id: 'indumentaria', nombre: 'Indumentaria', dorsal: '04', img: 'images/c-indumentaria.webp', bajada: 'Remeras de entrenamiento y medias largas para la cancha.' },
  { id: 'accesorios', nombre: 'Accesorios', dorsal: '05', img: 'images/c-accesorios.webp', bajada: 'Canilleras, bolsos y material para entrenar durante la semana.' },
];
const CANCHAS = {
  natural: { nombre: 'Césped natural', corto: 'Cancha de pasto', sigla: 'FG', suela: 'Tapones firmes',
    texto: 'Tapones largos y separados que se clavan en el pasto y te dan agarre para arrancar y frenar.',
    consejo: 'Si jugás en pasto todas las semanas, es la suela que más agarre te da.' },
  sintetico: { nombre: 'Sintético de 7 u 11', corto: 'Pasto sintético largo', sigla: 'FG/AG', suela: 'Tapones cortos y cónicos',
    texto: 'Tapones más cortos y redondeados, que entran y salen del pasto sintético sin trabarse.',
    consejo: 'Un botín FG/AG también te sirve para el pasto natural seco.' },
  sintetico5: { nombre: 'Fútbol 5', corto: 'Sintético de pasto corto', sigla: 'TF', suela: 'Multitaco',
    texto: 'Muchos tapones chicos de goma que reparten el peso sobre el pasto corto y el caucho.',
    consejo: 'Escribinos y te decimos qué multitacos hay en tu número.' },
  piso: { nombre: 'Piso o futsal', corto: 'Cancha techada', sigla: 'IN', suela: 'Suela lisa de goma',
    texto: 'Suela plana de goma que agarra en el piso de madera o de cemento alisado y no lo marca.',
    consejo: 'También es la indicada para entrenar en gimnasio.' },
};
const RANGOS = {
  hasta25: { nombre: 'Hasta $25.000', max: 25000 },
  '25a60': { nombre: '$25.000 a $60.000', min: 25001, max: 60000 },
  mas60: { nombre: 'Más de $60.000', min: 60001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const NUMEROS = [['35', '22,8'], ['36', '23,5'], ['37', '24,1'], ['38', '24,8'], ['39', '25,4'], ['40', '26,1'], ['41', '26,7'], ['42', '27,4'], ['43', '28'], ['44', '28,7'], ['45', '29,3']];
const T_CALZADO = NUMEROS.map(n => n[0]);
const GRUPOS_TALLE = [
  ['Calzado', T_CALZADO],
  ['Ropa y canilleras', ['S', 'M', 'L', 'XL', 'XXL']],
  ['Guantes', ['7', '8', '9', '10']],
  ['Medias', ['Niño', 'Adulto']],
  ['Pelotas', ['N° 4', 'N° 5']],
];
const tl = (lista, stocks) => lista.map((v, i) => ({ v, stock: stocks[i] ?? 0 }));
const unico = stock => [{ v: 'Único', stock }];

const PRODUCTOS = [
  { id: 'botin-velocidad', nombre: 'Botín de velocidad FG/AG negro y azul', cat: 'botines', canchas: ['natural', 'sintetico'], opLabel: 'Número', precio: 119990, descuento: 0, ops: tl(['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]), rango: 1, alta: 12,
    img: 'images/p-botin-velocidad.webp', alt: 'Par de botines negros con franjas y tapones azules sobre piso de cemento claro',
    desc: 'Capellada sintética liviana con relieve para el control, cordones al centro y tapones cónicos que sirven en césped natural y en sintético de pasto largo.', tags: ['botin', 'botines', 'futbol 11', 'velocidad', 'negro', 'azul', 'fg', 'ag', 'tapones', 'cesped', 'sintetico'] },
  { id: 'futsal-azul', nombre: 'Zapatilla de futsal azul con suela de goma', cat: 'botines', canchas: ['piso'], opLabel: 'Número', precio: 79990, descuento: 0, ops: tl(['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], [1, 2, 3, 3, 4, 4, 3, 2, 2, 0]), rango: 2, alta: 9,
    img: 'images/p-futsal-azul.webp', alt: 'Par de zapatillas de futsal azules con suela de goma color caramelo',
    desc: 'Capellada de cuero sintético con malla respirable a los costados y suela lisa de goma que agarra en el piso y no lo marca.', tags: ['futsal', 'zapatilla', 'zapatillas', 'piso', 'indoor', 'azul', 'goma', 'botines'] },
  { id: 'pelota-clasica', nombre: 'Pelota de fútbol cosida clásica', cat: 'pelotas', opLabel: 'Tamaño', precio: 34990, descuento: 0, ops: tl(['N° 4', 'N° 5'], [6, 14]), rango: 3, alta: 7,
    img: 'images/p-pelota-clasica.webp', alt: 'Pelota de fútbol de gajos blancos y negros cosidos, apoyada sobre cemento',
    desc: 'Gajos cosidos blancos y negros, el diseño de siempre, para entrenar y para el partido del fin de semana. La N° 5 es la de fútbol 11; la N° 4, para chicos de hasta 12 años.', tags: ['pelota', 'pelotas', 'cosida', 'blanca', 'negra', 'n5', 'n4', 'numero 5'] },
  { id: 'guantes-arquero', nombre: 'Guantes de arquero con palma de látex', cat: 'guantes', opLabel: 'Talle', precio: 54990, descuento: 0, ops: tl(['7', '8', '9', '10'], [2, 4, 4, 2]), rango: 4, alta: 10,
    img: 'images/p-guantes-arquero.webp', alt: 'Par de guantes de arquero negros con detalles turquesa, uno de dorso y otro de palma',
    desc: 'Palma de látex para el agarre, dorso con relieve para despejar de puño y muñequera con abrojo. Elegí el talle según el largo de tu mano.', tags: ['guantes', 'arquero', 'golero', 'latex', 'negro', 'turquesa'] },
  { id: 'remera-entrenamiento', nombre: 'Remera de entrenamiento de secado rápido', cat: 'indumentaria', opLabel: 'Talle', precio: 24990, descuento: 10, ops: tl(['S', 'M', 'L', 'XL', 'XXL'], [3, 6, 6, 4, 2]), rango: 5, alta: 8,
    img: 'images/p-remera-entrenamiento.webp', alt: 'Remera deportiva azul de manga corta con paneles de malla, extendida sobre fondo gris',
    desc: 'Tela de poliéster liviana con paneles de malla a los costados para ventilar. Cuello redondo y manga raglán.', tags: ['remera', 'camiseta', 'entrenamiento', 'azul', 'dry', 'secado rapido', 'indumentaria'] },
  { id: 'botin-clasico', nombre: 'Botín clásico de cuero sintético', cat: 'botines', canchas: ['natural'], opLabel: 'Número', precio: 94990, descuento: 0, ops: tl(['37', '38', '39', '40', '41', '42', '43', '44', '45'], [1, 2, 3, 4, 4, 3, 2, 1, 0]), rango: 6, alta: 11,
    img: 'images/p-botin-clasico.webp', alt: 'Par de botines negros de cuero sintético con tapones, junto a una pelota blanca y negra',
    desc: 'Capellada de cuero sintético con costuras horizontales, lengüeta acolchada y tapones FG para cancha de pasto. La pelota de la foto se vende aparte.', tags: ['botin', 'botines', 'clasico', 'cuero', 'negro', 'fg', 'tapones', 'cesped'] },
  { id: 'bolso-deportivo', nombre: 'Bolso deportivo con correa', cat: 'accesorios', opLabel: 'Talle', precio: 49990, descuento: 0, ops: unico(5), rango: 7, alta: 6,
    img: 'images/p-bolso-deportivo.webp', alt: 'Bolso deportivo azul marino con manijas, correa regulable y bolsillo lateral',
    desc: 'Bolso azul marino con compartimiento principal amplio, bolsillo lateral con cierre, manijas y correa regulable para colgarlo al hombro.', tags: ['bolso', 'bolsos', 'mochila', 'azul', 'marino', 'viaje', 'entrenamiento'] },
  { id: 'canilleras', nombre: 'Canilleras con tiras de ajuste', cat: 'accesorios', opLabel: 'Talle', precio: 16990, descuento: 0, ops: tl(['S', 'M', 'L'], [4, 6, 5]), rango: 8, alta: 3,
    img: 'images/p-canilleras.webp', alt: 'Par de canilleras negras rígidas con ranuras de ventilación y tiras elásticas',
    desc: 'Carcasa rígida con ranuras de ventilación y respaldo acolchado, con dos tiras elásticas para que no se muevan durante el partido.', tags: ['canilleras', 'espinilleras', 'proteccion', 'negro'] },
  { id: 'medias-futbol', nombre: 'Medias de fútbol largas', cat: 'indumentaria', opLabel: 'Talle', precio: 9990, descuento: 0, ops: tl(['Niño', 'Adulto'], [8, 12]), alta: 5,
    img: 'images/p-medias-futbol.webp', alt: 'Medias de fútbol azules dobladas junto a un par de canilleras negras',
    desc: 'Medias largas azules con puño acanalado, para usar sobre las canilleras. Niño va del 27 al 33 y adulto del 34 al 44. Las canilleras de la foto se venden aparte.', tags: ['medias', 'medias largas', 'azul', 'indumentaria'] },
  { id: 'escalera-coordinacion', nombre: 'Escalera de coordinación', cat: 'accesorios', opLabel: 'Talle', precio: 19990, descuento: 0, ops: unico(7), alta: 4,
    img: 'images/p-escalera.webp', alt: 'Escalera de coordinación con peldaños amarillos y cintas negras, plegada sobre el piso',
    desc: 'Peldaños de plástico y cintas regulables para trabajar velocidad de pies y coordinación en la práctica.', tags: ['escalera', 'coordinacion', 'agilidad', 'entrenamiento', 'amarilla'] },
  { id: 'platos-entrenamiento', nombre: 'Platos de entrenamiento x10', cat: 'accesorios', opLabel: 'Talle', precio: 14990, descuento: 0, ops: unico(9), alta: 2,
    img: 'images/x-entrenamiento.webp', alt: 'Pila de platos de entrenamiento naranjas junto a una escalera de coordinación amarilla',
    desc: 'Diez platos de plástico flexible para marcar circuitos, zonas y arcos de práctica. La escalera de la foto se vende aparte.', tags: ['platos', 'conos', 'conitos', 'entrenamiento', 'naranja', 'circuito'] },
  { id: 'borrador-short', nombre: 'Short de fútbol (borrador)', cat: 'indumentaria', opLabel: 'Talle', precio: 1, descuento: 0, ops: tl(['M'], [0]), alta: 0, visible: false,
    img: 'images/p-remera-entrenamiento.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 10) * 10;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), talles = lista(f.talles), canchas = lista(f.cancha);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (canchas.length && !(p.canchas || []).some(c => canchas.includes(c))) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (talles.length && !p.ops.some(o => talles.includes(o.v) && (!f.stock || o.stock > 0))) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, p.desc, ...(p.canchas || []).map(c => CANCHAS[c]?.nombre), ...p.ops.map(o => o.v), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

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
      if (coincideBusqueda(p, palabras)) {
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
const stockDe = (p, v) => p.ops.find(o => o.v === v)?.stock || 0;
const pideEleccion = p => p.ops.length > 1;
const opTexto = (p, v) => (v === 'Único' ? '' : p.opLabel === 'Número' ? `N° ${v}` : p.opLabel === 'Tamaño' ? v : `talle ${v}`);
const leerCancha = () => { try { return localStorage.getItem(KEY_CANCHA) || ''; } catch { return ''; } };
const guardarCancha = c => { try { localStorage.setItem(KEY_CANCHA, c); } catch (e) { void e; } };

const Cart = {
  KEY: 'gssport_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v) || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return Math.min(qty, max);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  pelota: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="m12 7.5 4 2.9-1.5 4.7h-5L8 10.4Z"/><path d="M12 7.5V2.6M16 10.4l4.6-1.5M14.5 15.1l2.8 4M9.5 15.1l-2.8 4M8 10.4 3.4 8.9"/></svg>',
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function opsResumen(p) {
  if (p.ops.length === 1) return p.ops[0].v === 'Único' ? 'Medida única' : esc(p.ops[0].v);
  const pre = p.opLabel === 'Número' ? 'N° ' : '';
  const vals = p.opLabel === 'Número' ? [p.ops[0], p.ops[p.ops.length - 1]] : p.ops;
  if (p.opLabel === 'Número') return `${pre}${esc(vals[0].v)} al ${esc(vals[1].v)}`;
  return p.ops.map(o => (o.stock > 0 ? esc(o.v) : `<del>${esc(o.v)}</del>`)).join('<span aria-hidden="true"> · </span>');
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const cat = catDe(p.cat);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 6) badge = '<span class="pcard__badge">Últimas unidades</span>';
  const canchas = (p.canchas || []).map(c => CANCHAS[c]?.sigla).filter(Boolean);
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta"><span>${esc(cat?.nombre || '')}</span>${canchas.length ? `<span class="pcard__suela">${esc(canchas.join(' · '))}</span>` : ''}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    <p class="pcard__talles">${opsResumen(p)}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
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
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const cats = box.querySelector('[data-drop-cats]');
    const canchas = box.querySelector('[data-drop-canchas]');
    if (!btn || !panel || !cats) return;
    cats.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${sel.cat === c.id && !sel.cancha ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="64" height="48"><span class="nav-drop__txt"><span>${esc(c.nombre)}</span></span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    if (canchas) canchas.innerHTML = Object.entries(CANCHAS).map(([k, c]) => `<li><a href="${URL_CATALOGO}?cat=botines&amp;cancha=${k}"${sel.cancha === k ? ' aria-current="page"' : ''}><b>${esc(c.sigla)}</b>${esc(c.nombre)} <small>${Tienda.contar({ cat: 'botines', cancha: k })}</small></a></li>`).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
  if (sel.cat) document.querySelectorAll(`.nav-link[href*="cat=${sel.cat}"]`).forEach(a => { if (!sel.cancha) a.setAttribute('aria-current', 'page'); });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initSlider() {
  const box = document.querySelector('[data-slider]');
  if (!box) return;
  const slides = [...box.querySelectorAll('[data-slide]')];
  const dots = [...box.querySelectorAll('[data-dot]')];
  if (slides.length < 2) return;
  let actual = 0;
  let timer = 0;
  let pausado = false;
  const ir = i => {
    actual = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const activa = k === actual;
      s.classList.toggle('is-activa', activa);
      if (activa) { s.removeAttribute('aria-hidden'); s.removeAttribute('inert'); }
      else { s.setAttribute('aria-hidden', 'true'); s.setAttribute('inert', ''); }
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === actual)));
  };
  const programar = () => {
    window.clearInterval(timer);
    if (reduceMotion || pausado) return;
    timer = window.setInterval(() => { if (!document.hidden) ir(actual + 1); }, 6500);
  };
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); programar(); }));
  box.addEventListener('mouseenter', () => { pausado = true; window.clearInterval(timer); });
  box.addEventListener('mouseleave', () => { pausado = false; programar(); });
  box.addEventListener('focusin', () => { pausado = true; window.clearInterval(timer); });
  box.addEventListener('focusout', e => { if (!box.contains(e.relatedTarget)) { pausado = false; programar(); } });
  ir(0);
  programar();
}

const IDS_RAIL = ['botin-velocidad', 'futsal-azul', 'pelota-clasica', 'guantes-arquero', 'remera-entrenamiento', 'botin-clasico'];
function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { ids: IDS_RAIL }, orden: 'destacados', limite: 8 });
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
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

function initNovedades() {
  const grid = document.querySelector('[data-novedades]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { excluir: IDS_RAIL }, orden: 'nuevos', limite: 4 });
  items.forEach(cachear);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  const total = Tienda.contar({});
  const todo = `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-n">${total}</span><span class="mosaico__todo-tit">Ver todo el catálogo</span><span class="mosaico__todo-sub">Botines, pelotas, guantes, indumentaria y accesorios</span>${ICO.flecha}</a>`;
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function initCancha() {
  const box = document.querySelector('[data-cancha]');
  if (!box) return;
  const ops = [...box.querySelectorAll('[data-cancha-op]')];
  const sigla = box.querySelector('[data-cancha-sigla]');
  const suela = box.querySelector('[data-cancha-suela]');
  const texto = box.querySelector('[data-cancha-texto]');
  const consejo = box.querySelector('[data-cancha-consejo]');
  const lista = box.querySelector('[data-cancha-lista]');
  const ver = box.querySelector('[data-cancha-ver]');
  const wsp = box.querySelector('[data-cancha-wsp]');
  if (!ops.length || !lista || !ver) return;
  const pintar = (id, primera) => {
    const c = CANCHAS[id];
    if (!c) return;
    ops.forEach(b => { b.checked = b.value === id; });
    box.dataset.cancha = id;
    sigla.textContent = c.sigla;
    suela.textContent = c.suela;
    texto.textContent = c.texto;
    consejo.textContent = c.consejo;
    const { items } = Tienda.consultar({ filtros: { cat: 'botines', cancha: id }, orden: 'destacados', limite: 3 });
    items.forEach(cachear);
    const n = Tienda.contar({ cat: 'botines', cancha: id });
    lista.innerHTML = items.length
      ? items.map(p => `<li><button type="button" class="cancha__prod" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="120" height="120"><span class="cancha__prod-txt"><span>${esc(p.nombre)}</span><b>${formatearPrecio(precioFinal(p))}</b></span>${ICO.flecha}</button></li>`).join('')
      : `<li class="cancha__vacio">${ICO.pelota}<span>Todavía no hay modelos ${esc(c.sigla)} cargados en la web.</span></li>`;
    ver.href = n ? `${URL_CATALOGO}?cat=botines&cancha=${id}` : `${URL_CATALOGO}?cat=botines`;
    ver.querySelector('span').textContent = n ? `Ver ${n === 1 ? 'el botín' : `los ${n} botines`} para ${c.nombre.toLowerCase()}` : 'Ver todos los botines';
    ver.classList.toggle('btn--cta', n > 0);
    ver.classList.toggle('btn--line', n === 0);
    wsp.classList.toggle('btn--wsp-fuerte', n === 0);
    wsp.href = wspLink(`Hola Gs Sport! Juego en ${c.nombre.toLowerCase()} (${c.corto.toLowerCase()}). ¿Qué botines ${c.sigla} tienen en mi número? Calzo el N° `);
    if (!primera) guardarCancha(id);
    if (!primera) revelarNuevos(lista);
  };
  ops.forEach(b => b.addEventListener('change', () => { if (b.checked) pintar(b.value, false); }));
  const guardada = leerCancha();
  pintar(CANCHAS[guardada] ? guardada : 'natural', true);
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí ${p.opLabel === 'Número' ? 'el número' : p.opLabel === 'Tamaño' ? 'el tamaño' : 'el talle'}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">Elegí ${p.opLabel === 'Número' ? 'el número' : p.opLabel === 'Tamaño' ? 'el tamaño' : 'el talle'}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(p.opLabel)} ${esc(o.v)}${o.stock > 0 ? '' : ', sin stock'}">${esc(o.v)}</button>`).join('')}</div>${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  (pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(`Ese ${p.opLabel === 'Número' ? 'número' : 'talle'} no tiene stock por ahora.`); return; }
  if (comprar) { abrirCarrito(); return; }
  const detalle = opTexto(p, v);
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${detalle ? ` (${detalle})` : ''} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
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
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (pideEleccion(p)) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
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
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, opBtn.dataset.pickerOp, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
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
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  qvEstado.op = p.ops.length === 1 && p.ops[0].stock > 0 ? p.ops[0].v : '';
  qvEstado.qty = 1;
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
    brand: { '@type': 'Brand', name: 'Gs Sport' }, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function guiaHTML(p) {
  if (p.opLabel !== 'Número') return '';
  const propios = new Set(p.ops.map(o => o.v));
  return `<details class="qv__det"><summary>${ICO.regla}Guía de números</summary>
    <div class="guia"><table><thead><tr><th scope="col">Número</th><th scope="col">Largo del pie</th></tr></thead><tbody>${NUMEROS.filter(n => propios.has(n[0])).map(n => `<tr${n[0] === qvEstado.op ? ' class="es-actual"' : ''}><th scope="row">${n[0]}</th><td>${n[1]} cm</td></tr>`).join('')}</tbody></table>
    <p class="guia__nota">Medí el pie apoyado en el piso, del talón a la punta del dedo más largo. Si estás entre dos números, elegí el más grande.</p></div></details>`;
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  let { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], cat: CATEGORIAS.map(c => c.id).filter(c => c !== p.cat), stock: true, destacado: true }, orden: 'destacados', limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const mismaCat = rel.every(r => r.cat === p.cat);
  const sinStock = !(stockTotal(p) > 0);
  const op = p.ops.find(o => o.v === qvEstado.op);
  const que = p.opLabel === 'Número' ? 'el número' : p.opLabel === 'Tamaño' ? 'el tamaño' : 'el talle';
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? `Elegí ${que} para ver la disponibilidad` : op.stock <= 2 ? `Quedan ${op.stock} en ${opTexto(p, op.v) || 'stock'}` : op.v === 'Único' ? 'En stock' : `${opTexto(p, op.v).replace(/^t/, 'T')} en stock`;
  const canchas = (p.canchas || []).map(c => `<li><b>${esc(CANCHAS[c].sigla)}</b>${esc(CANCHAS[c].nombre)}</li>`).join('');
  const selOp = p.ops.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">${esc(p.opLabel)}${qvEstado.op ? `: <b>${esc(qvEstado.op)}</b>` : ''}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(p.opLabel)}">${p.ops.map(o => `<button type="button" class="qv__op" role="radio" aria-checked="${o.v === qvEstado.op}" data-qv-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${esc(o.v)}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>Elegí ${que} para sumarlo al carrito.</p></div>`
    : '<p class="qv__var-tit">Medida única</p>';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio')}
      ${canchas ? `<ul class="qv__canchas" aria-label="Canchas">${canchas}</ul>` : ''}
      ${selOp}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${guiaHTML(p)}
      <a class="qv__wsp" href="${wspLink(`Hola Gs Sport! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : p.opLabel === 'Número' ? '¿Dudás con el número? Preguntá por WhatsApp' : 'Consultá por WhatsApp'}</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">${mismaCat ? `También en ${esc((catDe(p.cat)?.nombre || '').toLowerCase())}` : 'Completá tu equipo'}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="240"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
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
    const p = qvEstado.p;
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = opBtn.dataset.qvOp;
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      pintarQV();
      qv.querySelector(`[data-qv-op="${window.CSS.escape(qvEstado.op)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.op) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    if (comprar) { const n = Cart.add(p, qvEstado.qty, qvEstado.op); if (!n) { showToast('Esa opción no tiene stock por ahora.'); return; } cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, qvEstado.op, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
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
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.pelota}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí tu número en cualquier botín y sumalo acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="76" height="76">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(opTexto(p, i.v) || 'Medida única')} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const d = opTexto(p, i.v); return `- ${i.qty} × ${p.nombre}${d ? ` (${d})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Gs Sport! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__pagos">Pagás con Mercado Pago, transferencia o efectivo. <a href="${PAGINA === 'catalogo' ? (MODELO === '2' ? 'modelo-2.html' : './') : ''}#pagos" data-cerrar-cart>Ver formas de pago</a></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const todosTalles = new Set(GRUPOS_TALLE.flatMap(g => g[1]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    cancha: valido(PARAMS.get('cancha'), CANCHAS),
    talles: new Set(lista('talle').filter(t => todosTalles.has(t))),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo', dorsal: '00' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false"><small>${esc(c.dorsal)}</small><span>${esc(c.nombre)}</span><span class="chip__n" data-cuenta-filtro-cat="${c.id}"></span></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas las categorías')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-cancha-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todas'], ...Object.entries(CANCHAS).map(([k, c]) => [k, c.nombre, c.sigla])].map(([k, n, s]) => `<label class="opt"><input type="radio" name="f-cancha" value="${k}" data-filtro="cancha"><span>${s ? `<b class="opt__sigla">${esc(s)}</b>` : ''}${esc(n)}</span><span class="opt__n" data-cuenta-cancha="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-talle-opciones]').forEach(cont => {
    cont.innerHTML = GRUPOS_TALLE.map(([nombre, talles]) => `<div class="tgrupo"><p class="tgrupo__tit">${esc(nombre)}</p><div class="tgrupo__ops">${talles.map(t => `<label class="talle-op"><input type="checkbox" value="${esc(t)}" data-f="talle"><span>${esc(t)}</span></label>`).join('')}</div></div>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.cancha && sin !== 'cancha') f.cancha = estado.cancha;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.talles.size && sin !== 'talle') f.talles = [...estado.talles];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.cancha) chips.push(['cancha', '', `${CANCHAS[estado.cancha].sigla} · ${CANCHAS[estado.cancha].nombre}`]);
    estado.talles.forEach(t => chips.push(['talle', t, /^\d+$/.test(t) && T_CALZADO.includes(t) ? `N° ${t}` : `Talle ${t}`]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="talle"]').forEach(el => { el.checked = estado.talles.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-cancha]').forEach(el => {
      const k = el.dataset.cuentaCancha;
      el.textContent = Tienda.contar({ ...filtrosDe('cancha'), ...(k ? { cancha: k } : {}) });
    });
    const enPanel = estado.talles.size + (estado.cancha ? 1 : 0) + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    let titulo = cat ? cat.nombre : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Todo el catálogo';
    if (estado.cancha) titulo = `${cat ? cat.nombre : 'Botines'} para ${CANCHAS[estado.cancha].nombre.toLowerCase()}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = estado.cancha ? `${CANCHAS[estado.cancha].suela} (${CANCHAS[estado.cancha].sigla}). ${CANCHAS[estado.cancha].texto}` : cat ? cat.bajada : 'Botines, pelotas, guantes, indumentaria y accesorios de fútbol. Elegí tu número o talle y sumalo al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todo el catálogo'; miga.textContent = titulo; }
    document.title = `${titulo} — Gs Sport · Club del Botín`;
    document.querySelectorAll('.nav-drop__cat, [data-drop-canchas] a, .nav-link[href*="cat="]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = (u.searchParams.get('cat') || '') === estado.cat && (u.searchParams.get('cancha') || '') === estado.cancha && estado.cat;
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'cancha', 'talle', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.cancha) u.searchParams.set('cancha', estado.cancha);
    if (estado.talles.size) u.searchParams.set('talle', [...estado.talles].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
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
  const limpiar = () => {
    estado.cat = ''; estado.cancha = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.talles.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f="talle"]');
    if (multi) {
      if (multi.checked) estado.talles.add(multi.value); else estado.talles.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    if (f === 'cancha' && estado.cancha) estado.cat = 'botines';
    if (f === 'cat' && estado.cat !== 'botines') estado.cancha = '';
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      if (b.dataset.filtro === 'cat' && estado.cat !== 'botines') estado.cancha = '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'talle') estado.talles.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && window.getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  filtros?.addEventListener('scroll', () => filtros.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), { passive: true });
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, cancha: estado.cancha };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.is-activa .hero-eyebrow, .hero__txt .hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.is-activa .hero-lead, .hero__txt .hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.is-activa .hero-ctas .btn, .hero__txt .hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.planilla li', { x: -24, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.7);
  paso('.hero__dots, .hero__tag', { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initSlider,
  initRail,
  initNovedades,
  initMosaico,
  initCancha,
  initCuentas,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
