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

const WSP = '5491169618895';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const MAX_UNIDADES = 10;

const CATEGORIAS = [
  { id: 'vestidos', nombre: 'Vestidos de egresada', corto: 'Vestidos', bajada: 'Largos, con corset bordado y la falda que soñaste, cosidos a tu medida.' },
  { id: 'conjuntos', nombre: 'Trajes y conjuntos', corto: 'Trajes y conjuntos', bajada: 'Trajes sastre, faldas de tul, tops y chaquetas bordadas para combinar a tu gusto.' },
  { id: 'bordados', nombre: 'Bordados a mano', corto: 'Bordados', bajada: 'Pedrería, perlas, canutillo e hilo sobre tu prenda o sobre una nueva.' },
];
const COLORES = {
  azul: 'Azul', rosa: 'Rosa', verde: 'Verde', negro: 'Negro', lila: 'Lila',
  dorado: 'Dorado', marfil: 'Marfil', turquesa: 'Turquesa', plata: 'Plateado',
};
const PRECIOS = {
  'hasta-100': { nombre: 'Hasta $100.000', max: 100000 },
  '100-250': { nombre: '$100.000 a $250.000', min: 100001, max: 250000 },
  '250-400': { nombre: '$250.000 a $400.000', min: 250001, max: 400000 },
  'mas-400': { nombre: 'Más de $400.000', min: 400001 },
};
const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];
const TALLES = ['A medida', 'XS', 'S', 'M', 'L', 'XL'];
const TONOS_BORDADO = ['Como en la foto', 'Dorado', 'Plateado', 'Al tono de tu prenda'];
const DIMENSIONES = { 'mmr-01': [941, 1672], 'mmr-02': [1672, 941] };
const dimDe = src => {
  const base = String(src).split('/').pop().replace('.webp', '');
  if (DIMENSIONES[base]) return DIMENSIONES[base];
  return base.startsWith('mmr-') ? [1254, 1254] : [640, 640];
};

const PRODUCTOS = [
  { id: 'vestido-noche-azul', nombre: 'Vestido largo Noche Azul', cat: 'vestidos', precio: 485000, descuento: 0,
    img: 'images/mmr-01.webp', pos: 'center 16%', detalle: ['images/d-corset-azul.webp'],
    alt: 'Vestido largo azul francés con corset de encaje bordado en pedrería y falda de gasa',
    desc: 'Corset de encaje con pedrería bordada a mano, escote en V y falda larga de gasa con mucho vuelo. Lo cosemos a tu medida y en el color que elijas.',
    tela: 'Gasa y encaje', bordado: 'Pedrería y canutillo al tono', color: 'azul',
    colores: ['Azul noche', 'Verde esmeralda', 'Bordó', 'Negro', 'Lila'], talles: TALLES,
    tags: ['largo', 'corset', 'gasa', 'pedreria', 'azul frances', 'egresada', 'v'], rango: 1, alta: 9 },
  { id: 'vestido-rosa-perla', nombre: 'Vestido Rosa Perla', cat: 'vestidos', precio: 455000, descuento: 0,
    img: 'images/mmr-03.webp', pos: 'center 30%', detalle: ['images/d-escote-perlas.webp'],
    alt: 'Vestido rosa de satén con escote en V bordado con perlas y falda amplia con pliegues',
    desc: 'Satén rosa con escote en V bordado con perlas y mostacillas, y una falda amplia con pliegues que se mueve cuando bailás.',
    tela: 'Satén', bordado: 'Perlas y mostacillas', color: 'rosa',
    colores: ['Rosa empolvado', 'Celeste', 'Marfil', 'Lila', 'Coral suave'], talles: TALLES,
    tags: ['princesa', 'perlas', 'saten', 'pliegues', 'amplio', 'egresada'], rango: 2, alta: 8 },
  { id: 'vestido-esmeralda', nombre: 'Vestido Esmeralda de mangas largas', cat: 'vestidos', precio: 520000, descuento: 0,
    img: 'images/mmr-08.webp', pos: 'center 35%', detalle: ['images/d-pedreria-esmeralda.webp'],
    alt: 'Vestido largo verde esmeralda con mangas de tul y bordado plateado en el escote y la cintura',
    desc: 'Mangas largas de tul transparente, escote profundo y cintura marcada con un bordado plateado de hojas. Falda de gasa hasta el piso.',
    tela: 'Gasa y tul', bordado: 'Hilo plateado y strass', color: 'verde',
    colores: ['Verde esmeralda', 'Azul noche', 'Bordó', 'Negro', 'Champagne'], talles: TALLES,
    tags: ['mangas', 'tul', 'plateado', 'hojas', 'largo', 'egresada'], rango: 3, alta: 7 },
  { id: 'traje-sastre-solapas', nombre: 'Traje sastre con solapas bordadas', cat: 'conjuntos', precio: 430000, descuento: 0,
    img: 'images/mmr-04.webp', pos: 'center 40%', detalle: ['images/d-solapa-bordada.webp'],
    alt: 'Traje sastre negro de saco y pantalón palazzo, con las solapas bordadas en canutillo plateado',
    desc: 'Saco entallado y pantalón palazzo de tiro alto. Las solapas llevan un bordado de ramas en canutillo y strass, para brillar sin vestido.',
    tela: 'Crepe sastrero', bordado: 'Canutillo y strass plateado', color: 'negro',
    colores: ['Negro', 'Azul noche', 'Blanco', 'Bordó', 'Verde inglés'], talles: TALLES,
    tags: ['traje', 'saco', 'pantalon', 'blazer', 'palazzo', 'solapas', 'egresado'], rango: 4, alta: 6 },
  { id: 'chaqueta-marfil-oro', nombre: 'Chaqueta corta marfil bordada en oro', cat: 'conjuntos', precio: 268000, descuento: 0,
    img: 'images/p-chaqueta-marfil.webp', pos: 'center', detalle: ['images/mmr-02.webp'],
    alt: 'Chaqueta corta color marfil con flores y hojas bordadas en hilo dorado',
    desc: 'Chaqueta corta de cuello redondo, cubierta de flores y hojas bordadas en hilo dorado. Para usar sobre un vestido o con un pantalón sastre.',
    tela: 'Shantung marfil', bordado: 'Hilo dorado y perlas', color: 'marfil',
    colores: ['Marfil', 'Negro', 'Azul noche', 'Rosa', 'Verde inglés'], talles: TALLES,
    tags: ['chaqueta', 'bolero', 'saco', 'dorado', 'flores', 'oro'], rango: 5, alta: 5 },
  { id: 'falda-tul-lavanda', nombre: 'Falda de tul lavanda con flores bordadas', cat: 'conjuntos', precio: 235000, descuento: 0,
    img: 'images/mmr-06.webp', pos: 'center 55%', detalle: ['images/d-flores-tul.webp'],
    alt: 'Falda larga de varias capas de tul lavanda con pequeñas flores bordadas',
    desc: 'Varias capas de tul con flores bordadas a mano en lila, rosa y verde. Combina con un top corset o un body.',
    tela: 'Tul', bordado: 'Flores en hilo y mostacilla', color: 'lila',
    colores: ['Lavanda', 'Rosa', 'Celeste', 'Marfil', 'Negro'], talles: TALLES,
    tags: ['falda', 'pollera', 'tul', 'flores', 'capas', 'lavanda'], rango: 6, alta: 4 },
  { id: 'top-corset-dorado', nombre: 'Top corset bordado en dorado', cat: 'conjuntos', precio: 198000, descuento: 0,
    img: 'images/mmr-07.webp', pos: 'center 45%', detalle: ['images/d-hojas-oro.webp'],
    alt: 'Top corset color champagne bordado con hojas de canutillo dorado y breteles finos',
    desc: 'Corset con ballenas, breteles finos y un bordado de hojas en canutillo y perlas doradas. Va con falda de tul o con un pantalón sastre.',
    tela: 'Satén champagne', bordado: 'Canutillo y perlas doradas', color: 'dorado',
    colores: ['Champagne', 'Negro', 'Marfil', 'Rosa', 'Azul noche'], talles: TALLES,
    tags: ['top', 'corset', 'dorado', 'hojas', 'breteles', 'champagne'], rango: 7, alta: 3 },
  { id: 'bolero-azul-plata', nombre: 'Bolero azul noche con ramas plateadas', cat: 'conjuntos', precio: 252000, descuento: 0,
    img: 'images/mmr-09.webp', pos: 'center 40%', detalle: ['images/d-ramas-plata.webp'],
    alt: 'Bolero azul marino de mangas largas con ramas y hojas bordadas en hilo plateado',
    desc: 'Bolero de mangas largas con ramas y hojas bordadas en hilo plateado y un ribete trenzado en los bordes.',
    tela: 'Paño liviano', bordado: 'Hilo plateado y cordón', color: 'azul',
    colores: ['Azul noche', 'Negro', 'Bordó', 'Verde inglés', 'Marfil'], talles: TALLES,
    tags: ['bolero', 'chaqueta', 'plateado', 'ramas', 'mangas', 'marino'], rango: 8, alta: 2 },
  { id: 'bordado-pedreria-floral', nombre: 'Bordado floral con pedrería para corset', cat: 'bordados', precio: 120000, descuento: 0,
    img: 'images/mmr-05.webp', pos: 'center', detalle: [],
    alt: 'Corset de tul turquesa bordado con flores de pedrería, perlas y lentejuelas',
    desc: 'Flores en relieve con pedrería, perlas y lentejuelas sobre el corset de tu vestido. El valor es de referencia para un corset: lo confirmamos cuando vemos tu prenda.',
    tela: 'Tu prenda o una nueva', bordado: 'Pedrería, perlas y lentejuelas', color: 'turquesa',
    colores: TONOS_BORDADO, talles: null,
    tags: ['corset', 'flores', 'pedreria', 'lentejuelas', 'relieve', 'turquesa'], rango: 9, alta: 14 },
  { id: 'bordado-escote-perlas', nombre: 'Escote bordado con perlas', cat: 'bordados', precio: 78000, descuento: 0,
    img: 'images/d-escote-perlas.webp', pos: 'center', detalle: [],
    alt: 'Escote en V de satén rosa bordado con perlas y mostacillas',
    desc: 'Un borde de perlas y mostacillas que sigue la forma de tu escote. Queda bien en satén, crepe o tul.',
    tela: 'Tu prenda o una nueva', bordado: 'Perlas y mostacillas', color: 'marfil',
    colores: TONOS_BORDADO, talles: null,
    tags: ['escote', 'perlas', 'borde', 'v', 'mostacillas'], rango: 10, alta: 13 },
  { id: 'bordado-flores-tul', nombre: 'Flores bordadas sobre tul', cat: 'bordados', precio: 95000, descuento: 0,
    img: 'images/d-flores-tul.webp', pos: 'center', detalle: [],
    alt: 'Tul lavanda con pequeñas flores bordadas en hilo rosa, lila y verde',
    desc: 'Flores pequeñas sembradas sobre una falda, una capa o un velo de tul. Elegís los colores del hilo.',
    tela: 'Tu prenda o una nueva', bordado: 'Hilo de seda y mostacilla', color: 'lila',
    colores: TONOS_BORDADO, talles: null,
    tags: ['tul', 'flores', 'falda', 'velo', 'capa'], rango: 11, alta: 12 },
  { id: 'bordado-hojas-oro', nombre: 'Hojas en canutillo dorado', cat: 'bordados', precio: 88000, descuento: 0,
    img: 'images/d-hojas-oro.webp', pos: 'center', detalle: [],
    alt: 'Hojas bordadas en canutillo y perlas doradas sobre satén champagne',
    desc: 'Ramas de hojas en canutillo y perlas doradas para un top, un corset o el cinturón de un vestido.',
    tela: 'Tu prenda o una nueva', bordado: 'Canutillo y perlas doradas', color: 'dorado',
    colores: TONOS_BORDADO, talles: null,
    tags: ['hojas', 'dorado', 'canutillo', 'top', 'cinturon', 'oro'], rango: 12, alta: 11 },
  { id: 'bordado-ramas-plata', nombre: 'Ramas en hilo plateado para chaqueta', cat: 'bordados', precio: 82000, descuento: 0,
    img: 'images/d-ramas-plata.webp', pos: 'center', detalle: [],
    alt: 'Ramas y hojas bordadas en hilo plateado sobre paño azul marino',
    desc: 'Ramas y hojas en hilo plateado para las mangas y el frente de una chaqueta o un bolero.',
    tela: 'Tu prenda o una nueva', bordado: 'Hilo plateado', color: 'plata',
    colores: TONOS_BORDADO, talles: null,
    tags: ['ramas', 'plateado', 'chaqueta', 'mangas', 'bolero'], rango: 13, alta: 10 },
  { id: 'bordado-solapas', nombre: 'Solapas bordadas para saco', cat: 'bordados', precio: 64000, descuento: 0,
    img: 'images/d-solapa-bordada.webp', pos: 'center', detalle: [],
    alt: 'Solapa de saco negro bordada con ramas de canutillo plateado y strass',
    desc: 'Bordamos las solapas de tu saco o blazer con ramas de canutillo y strass. Ideal para el traje de la fiesta.',
    tela: 'Tu prenda o una nueva', bordado: 'Canutillo y strass', color: 'plata',
    colores: TONOS_BORDADO, talles: null,
    tags: ['solapas', 'saco', 'blazer', 'traje', 'strass'], rango: 14, alta: 1 },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.includes(p.color)) return false;
    const rango = f.precio ? PRECIOS[f.precio] : null;
    if (rango) {
      const v = precioFinal(p);
      if (rango.min != null && v < rango.min) return false;
      if (rango.max != null && v > rango.max) return false;
    }
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, p.desc, p.tela, p.bordado, COLORES[p.color], cat?.nombre, cat?.corto,
      ...(p.colores || []), ...(p.tags || []),
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
const getProducto = id => {
  if (!cacheProductos.has(id)) {
    const p = Tienda.obtener(id);
    if (p) cacheProductos.set(id, p);
    return p;
  }
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id);
const badgeDe = p => (p.talles ? 'A medida' : 'Sobre tu prenda');

const Cart = {
  KEY: 'mismejoresrecuedos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  clave: i => `${i.id}|${i.t || ''}|${i.c || ''}`,
  add(producto, qty = 1, t = null, c = null) {
    if (!producto) return false;
    const items = this.get();
    const nuevo = { id: producto.id, t: t || null, c: c || null, qty: 0 };
    const existing = items.find(i => this.clave(i) === this.clave(nuevo));
    if (existing) existing.qty = Math.min(existing.qty + qty, MAX_UNIDADES);
    else { nuevo.qty = Math.min(qty, MAX_UNIDADES); items.push(nuevo); }
    this.save(items);
    return true;
  },
  setQty(clave, qty) {
    const items = this.get(); const it = items.find(i => this.clave(i) === clave); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_UNIDADES)); this.save(items);
  },
  remove(clave) { this.save(this.get().filter(i => this.clave(i) !== clave)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

const ICO_CART = '<svg class="ico ico-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICO_TRASH = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
const ICO_SHARE = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/></svg>';
const ICO_WSP = '<svg class="ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
  izq: 'data-animate="izq" style="opacity:0;transform:translateX(-40px)"',
};

function imgTag(src, alt, extra = '') {
  const [w, h] = dimDe(src);
  return `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}"${extra}>`;
}

function cardHTML(p, { anim = 'subir', extraCls = '' } = {}) {
  const det = p.detalle[0];
  const foto = MODELO === '2';
  const cat = catDe(p.cat);
  const datos = `<p class="card__cat">${esc(cat?.corto)}</p>
        <h3 class="card__nombre"><button type="button" data-qv="${p.id}">${esc(p.nombre)}</button></h3>
        <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>`;
  return `<li class="card${foto ? ' card--foto' : ''}${extraCls}" data-id="${p.id}" ${anim ? ANIM[anim] : ''}>
      <div class="card__media">
        <button type="button" class="card__abrir" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}" tabindex="-1">
          ${imgTag(p.img, p.alt, ` style="object-position:${p.pos}"`)}
          ${det ? `<img class="card__detalle" src="${det}" alt="" width="640" height="640">` : ''}
        </button>
        <span class="card__badge">${badgeDe(p)}</span>
        ${det ? '<span class="card__ver" aria-hidden="true">Ver el bordado</span>' : ''}
        ${foto ? `<div class="card__sobre">${datos}</div>` : ''}
      </div>
      <div class="card__body">
        ${foto ? '' : datos}
        <div class="prod-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar uno">−</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar uno">+</button>
          </div>
          <button type="button" class="prod-add" data-add="${p.id}">Agregar<span class="prod-add__mas"> al carrito</span></button>
        </div>
        <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </li>`;
}

function tileHTML(p, area) {
  const det = p.detalle[0];
  const cat = catDe(p.cat);
  return `<li class="tile tile--${area}" data-id="${p.id}" ${ANIM.subir}>
      <button type="button" class="tile__abrir" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${imgTag(p.img, p.alt, ` style="object-position:${p.pos}"`)}
        ${det ? `<img class="card__detalle" src="${det}" alt="" width="640" height="640">` : ''}
      </button>
      <span class="card__badge">${badgeDe(p)}</span>
      <div class="tile__sobre">
        <p class="card__cat">${esc(cat?.corto)}</p>
        <h3 class="tile__nombre">${esc(p.nombre)}</h3>
        <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      </div>
      <button type="button" class="tile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_CART}</button>
    </li>`;
}

function miniHTML(p) {
  return `<li class="mini" data-id="${p.id}" ${ANIM.subir}>
      <button type="button" class="mini__media" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}" tabindex="-1">${imgTag(p.img, p.alt)}</button>
      <div class="mini__texto">
        <h4 class="mini__nombre"><button type="button" data-qv="${p.id}">${esc(p.nombre)}</button></h4>
        <p class="mini__bordado">${esc(p.bordado)}</p>
        <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      </div>
      <button type="button" class="mini__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_CART}</button>
    </li>`;
}

function filaHTML(p) {
  return `<li class="fila" data-id="${p.id}" ${ANIM.subir}>
      <button type="button" class="fila__media" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}" tabindex="-1">${imgTag(p.img, p.alt)}</button>
      <div class="fila__texto">
        <h4 class="fila__nombre"><button type="button" data-qv="${p.id}">${esc(p.nombre)}</button></h4>
        <p class="fila__bordado">${esc(p.bordado)}</p>
      </div>
      <p class="fila__precio">${formatearPrecio(precioFinal(p))}</p>
      <button type="button" class="btn btn--linea btn--chico fila__add" data-add="${p.id}">Agregar</button>
    </li>`;
}

function initColeccionHome() {
  const rail = document.querySelector('[data-coleccion="rail"]');
  const mosaico = document.querySelector('[data-coleccion="mosaico"]');
  const bordados = document.querySelector('[data-coleccion="bordados"]');
  if (rail || mosaico) {
    const { items } = Tienda.consultar({ filtros: { cat: ['vestidos', 'conjuntos'] }, orden: 'destacados', limite: 8 });
    items.forEach(cachearProducto);
    if (rail) rail.innerHTML = items.map(p => cardHTML(p, { anim: 'der', extraCls: ' card--rail' })).join('');
    if (mosaico) {
      const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      mosaico.innerHTML = items.map((p, i) => tileHTML(p, areas[i])).join('');
    }
  }
  if (bordados) {
    const { items } = Tienda.consultar({ filtros: { cat: 'bordados' }, orden: 'destacados', limite: 8 });
    items.forEach(cachearProducto);
    bordados.innerHTML = items.map(p => (bordados.classList.contains('filas') ? filaHTML(p) : miniHTML(p))).join('');
  }
}

function cachearProducto(p) { if (p && !cacheProductos.has(p.id)) cacheProductos.set(p.id, p); }

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: [el.dataset.cuentaCat] });
    el.textContent = `${n} ${n === 1 ? 'diseño' : 'diseños'}`;
  });
  document.querySelectorAll('[data-cuenta-color]').forEach(el => {
    const n = Tienda.contar({ color: [el.dataset.cuentaColor] });
    el.textContent = String(n);
    if (!n) el.closest('li')?.setAttribute('hidden', '');
  });
}

function initMenuColeccion() {
  const params = new URLSearchParams(location.search);
  const actual = PAGINA === 'catalogo' ? (params.get('cat') || '').split(',')[0] : '';
  document.querySelectorAll('[data-menu-coleccion]').forEach(ul => {
    const footer = ul.dataset.menuColeccion === 'footer';
    const filas = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: [c.id] });
      const cur = actual === c.id ? ' aria-current="page"' : '';
      return footer
        ? `<li><a href="${URL_CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`
        : `<li><a href="${URL_CATALOGO}?cat=${c.id}"${cur}><span>${esc(c.nombre)}</span><small>${n} ${n === 1 ? 'diseño' : 'diseños'}</small></a></li>`;
    });
    filas.push(footer
      ? `<li><a href="${URL_CATALOGO}">Ver todo el catálogo</a></li>`
      : `<li class="menu-col__todo"><a href="${URL_CATALOGO}">Ver todo el catálogo</a></li>`);
    ul.innerHTML = filas.join('');
  });

  const wrap = document.querySelector('.menu-col');
  const btn = wrap?.querySelector('.menu-col__btn');
  const panel = wrap?.querySelector('.menu-col__panel');
  if (!wrap || !btn || !panel) return;
  const hoverMq = window.matchMedia('(min-width: 961px) and (hover: hover)');
  let salida = 0;
  const abrir = () => { clearTimeout(salida); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('abierto'); };
  const cerrar = () => { clearTimeout(salida); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('abierto'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(salida); salida = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (!panel.hidden && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('button, a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

const focoSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const capasAbiertas = [];
function crearCapa(el, { alCerrar } = {}) {
  let previo = null;
  let ocultar = 0;
  const abierta = () => el.classList.contains('abierto');
  const trap = e => {
    if (capasAbiertas[capasAbiertas.length - 1] !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const focos = [...el.querySelectorAll(focoSelector)].filter(f => f.offsetParent !== null || f === document.activeElement);
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };
  function abrir(foco) {
    clearTimeout(ocultar);
    if (!abierta()) previo = document.activeElement;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('abierto');
    document.body.classList.add('no-scroll');
    if (!capasAbiertas.includes(el)) capasAbiertas.push(el);
    document.addEventListener('keydown', trap);
    (foco || el.querySelector(focoSelector))?.focus({ preventScroll: true });
  }
  function cerrar() {
    if (!abierta()) return;
    el.classList.remove('abierto');
    const i = capasAbiertas.indexOf(el);
    if (i >= 0) capasAbiertas.splice(i, 1);
    if (!capasAbiertas.length) document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', trap);
    ocultar = setTimeout(() => { if (!abierta()) el.hidden = true; }, reduceMotion ? 0 : 320);
    if (previo && document.contains(previo)) previo.focus({ preventScroll: true });
    alCerrar?.();
  }
  return { abrir, cerrar, abierta };
}

let Drawer = null;
function initDrawer() {
  const el = document.getElementById('drawer');
  if (!el) return;
  Drawer = crearCapa(el);
  el.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => Drawer.cerrar()));
  const lista = document.getElementById('drawerLista');
  lista.addEventListener('click', e => {
    const li = e.target.closest('[data-clave]');
    if (!li) return;
    const clave = li.dataset.clave;
    const item = Cart.get().find(i => Cart.clave(i) === clave);
    if (!item) return;
    const paso = e.target.closest('[data-linea-step]');
    if (paso) Cart.setQty(clave, item.qty + Number(paso.dataset.lineaStep));
    if (e.target.closest('[data-linea-quitar]')) {
      const p = getProducto(item.id);
      Cart.remove(clave);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
    }
  });
  document.getElementById('btnFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

function renderDrawer() {
  const lista = document.getElementById('drawerLista');
  if (!lista) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  vacio.hidden = items.length > 0;
  pie.hidden = items.length === 0;
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const ops = [i.t, i.c].filter(Boolean).join(' · ');
    return `<li class="linea" data-clave="${esc(Cart.clave(i))}">
        <span class="linea__foto">${imgTag(p.img, p.alt, ` style="object-position:${p.pos}"`)}</span>
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          ${ops ? `<p class="linea__ops">${esc(ops)}</p>` : ''}
          <div class="linea__fila">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-step="-1" aria-label="Restar uno">−</button>
              <span>${i.qty}</span>
              <button type="button" data-linea-step="1" aria-label="Sumar uno">+</button>
            </div>
            <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
          </div>
        </div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO_TRASH}</button>
      </li>`;
  }).join('');
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
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

function agregar(id, qty = 1, t, c) {
  const p = getProducto(id);
  if (!p) return false;
  const talle = p.talles ? (t || 'A medida') : null;
  const color = c || p.colores[0];
  Cart.add(p, qty, talle, color);
  return { p, talle, color };
}

function qtyDeCard(boton) {
  const n = Number(boton.closest('.card')?.querySelector('[data-qty]')?.textContent);
  return n > 0 ? n : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const r = agregar(add.dataset.add, qtyDeCard(add));
      if (r) showToast(`Sumaste ${r.p.nombre}${r.talle ? ', a medida' : ''} al carrito`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, qtyDeCard(buy))) Drawer?.abrir();
      return;
    }
    const paso = e.target.closest('[data-step]');
    if (paso) {
      const out = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out) out.textContent = Math.max(1, Math.min(MAX_UNIDADES, Number(out.textContent) + Number(paso.dataset.step)));
      return;
    }
    if (e.target.closest('[data-open-cart]')) Drawer?.abrir();
  });
}

let VistaRapida = null;
let estadoQV = null;
function initVistaRapida() {
  const el = document.getElementById('qv');
  if (!el) return;
  VistaRapida = crearCapa(el, {
    alCerrar: () => {
      if (PAGINA !== 'catalogo') return;
      const params = new URLSearchParams(location.search);
      if (params.has('producto')) { params.delete('producto'); history.replaceState(null, '', `${location.pathname}${params.toString() ? '?' + params : ''}`); }
    },
  });
  el.querySelectorAll('[data-qv-cerrar]').forEach(b => b.addEventListener('click', () => VistaRapida.cerrar()));
  const cuerpo = document.getElementById('qvCuerpo');
  cuerpo.addEventListener('click', e => {
    if (!estadoQV) return;
    const p = estadoQV.p;
    const th = e.target.closest('[data-qv-img]');
    if (th) { estadoQV.img = Number(th.dataset.qvImg); pintarFotoQV(); return; }
    const paso = e.target.closest('[data-qv-step]');
    if (paso) {
      estadoQV.qty = Math.max(1, Math.min(MAX_UNIDADES, estadoQV.qty + Number(paso.dataset.qvStep)));
      cuerpo.querySelector('[data-qv-qty]').textContent = estadoQV.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]') || e.target.closest('[data-qv-buy]')) {
      const comprar = !!e.target.closest('[data-qv-buy]');
      agregar(p.id, estadoQV.qty, estadoQV.talle, estadoQV.color);
      if (comprar) { VistaRapida.cerrar(); Drawer?.abrir(); }
      else showToast(`Sumaste ${p.nombre}${estadoQV.talle ? ` (${estadoQV.talle.toLowerCase()})` : ''} al carrito`);
      return;
    }
    if (e.target.closest('[data-qv-share]')) compartir(p);
  });
  cuerpo.addEventListener('change', e => {
    if (!estadoQV) return;
    if (e.target.name === 'qvTalle') estadoQV.talle = e.target.value;
    if (e.target.name === 'qvColor') estadoQV.color = e.target.value;
    actualizarWspQV();
  });
}

function mensajeProducto(p, talle, color) {
  const ops = [talle, color].filter(Boolean).join(', ');
  return `Hola! Me interesa el diseño "${p.nombre}"${ops ? ` (${ops})` : ''} de la web de Mis mejores recuerdos. ¿Me pasás más info?`;
}

function actualizarWspQV() {
  const a = document.getElementById('qvWsp');
  if (a && estadoQV) a.href = wspLink(mensajeProducto(estadoQV.p, estadoQV.talle, estadoQV.color));
}

function pintarFotoQV() {
  const p = estadoQV.p;
  const imgs = [p.img, ...p.detalle];
  const foto = document.getElementById('qvFoto');
  if (foto) {
    const [w, h] = dimDe(imgs[estadoQV.img]);
    foto.src = imgs[estadoQV.img];
    foto.width = w; foto.height = h;
    foto.style.objectPosition = estadoQV.img === 0 ? p.pos : 'center';
    foto.alt = estadoQV.img === 0 ? p.alt : `Detalle del bordado: ${p.bordado.toLowerCase()}`;
  }
  document.querySelectorAll('[data-qv-img]').forEach(b => {
    const on = Number(b.dataset.qvImg) === estadoQV.img;
    b.classList.toggle('is-activa', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function abrirVistaRapida(id) {
  const p = getProducto(id);
  if (!p || !VistaRapida) return;
  estadoQV = { p, img: 0, qty: 1, talle: p.talles ? 'A medida' : null, color: p.colores[0] };
  const cat = catDe(p.cat);
  const imgs = [p.img, ...p.detalle];
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  rel.forEach(cachearProducto);
  const etiquetaColor = p.talles ? 'Color de la tela' : 'Color del bordado';
  document.getElementById('qvCuerpo').innerHTML = `
    <div class="qv__galeria">
      <div class="qv__foto">${imgTag(p.img, p.alt, ` id="qvFoto" style="object-position:${p.pos}"`)}</div>
      ${imgs.length > 1 ? `<div class="qv__thumbs">${imgs.map((src, i) => `<button type="button" class="qv__thumb${i === 0 ? ' is-activa' : ''}" data-qv-img="${i}" aria-pressed="${i === 0}" aria-label="${i === 0 ? 'Ver la prenda' : 'Ver el detalle del bordado'}"><img src="${src}" alt="" width="640" height="640"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${formatearPrecio(precioFinal(p))}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>${p.talles ? 'Tela' : 'Se borda sobre'}</dt><dd>${esc(p.tela)}</dd></div>
        <div><dt>Bordado</dt><dd>${esc(p.bordado)}</dd></div>
      </dl>
      ${p.talles ? `<fieldset class="qv__ops">
        <legend>Talle</legend>
        <div class="chips-op">${p.talles.map((t, i) => `<label class="chip-op"><input type="radio" name="qvTalle" value="${esc(t)}"${i === 0 ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div>
        <p class="qv__ayuda">«A medida» es lo que hacemos siempre: te tomamos las medidas antes de cortar.</p>
      </fieldset>` : ''}
      <fieldset class="qv__ops">
        <legend>${etiquetaColor}</legend>
        <div class="chips-op">${p.colores.map((c, i) => `<label class="chip-op"><input type="radio" name="qvColor" value="${esc(c)}"${i === 0 ? ' checked' : ''}><span>${esc(c)}${i === 0 && p.talles ? ' <small>(foto)</small>' : ''}</span></label>`).join('')}</div>
      </fieldset>
      <div class="qv__compra">
        <div class="stepper">
          <button type="button" data-qv-step="-1" aria-label="Restar uno">−</button>
          <span data-qv-qty>1</span>
          <button type="button" data-qv-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn--cta qv__add" data-qv-add>Agregar al carrito</button>
      </div>
      <button type="button" class="btn btn--linea btn--ancho" data-qv-buy>Comprar ahora</button>
      <div class="qv__extra">
        <a class="qv__wsp" id="qvWsp" href="${wspLink(mensajeProducto(p, estadoQV.talle, estadoQV.color))}" target="_blank" rel="noopener">${ICO_WSP} Consultar este diseño</a>
        <button type="button" class="qv__share" data-qv-share>${ICO_SHARE} Compartir</button>
      </div>
      ${rel.length ? `<div class="qv__rel">
        <p class="qv__rel-t">También te puede interesar</p>
        <ul>${rel.map(r => `<li><button type="button" data-qv="${r.id}">${imgTag(r.img, r.alt, ` style="object-position:${r.pos}"`)}<span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul>
      </div>` : ''}
    </div>`;
  const ld = document.getElementById('ldProducto') || Object.assign(document.createElement('script'), { type: 'application/ld+json', id: 'ldProducto' });
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/PreOrder' },
  });
  if (!ld.parentNode) document.head.appendChild(ld);
  document.querySelector('#qv .qv__panel')?.scrollTo?.(0, 0);
  VistaRapida.abrir(document.querySelector('#qv .qv__cerrar'));
  if (PAGINA === 'catalogo') {
    const params = new URLSearchParams(location.search);
    params.set('producto', p.id);
    history.replaceState(null, '', `${location.pathname}?${params}`);
  }
}

function compartir(p) {
  const url = new URL(URL_CATALOGO, location.href);
  url.searchParams.set('producto', p.id);
  const datos = { title: p.nombre, text: `Mirá este diseño de Mis mejores recuerdos: ${p.nombre}`, url: url.href };
  if (navigator.share) { navigator.share(datos).catch(() => {}); return; }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url.href)
      .then(() => showToast('Copiamos el link: pegalo en tu historia o mandáselo a tu grupo'))
      .catch(() => showToast('No pudimos copiar el link. Probá de nuevo.'));
  } else showToast('Tu navegador no deja copiar el link desde acá.');
}

function initRailDrag(vp) {
  if (!vp) return;
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (!moved) return;
    vp.classList.remove('dragging');
    const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
    vp.addEventListener('click', kill, { capture: true, once: true });
    setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}

function initFlechas(vp, track, prev, next) {
  if (!vp || !prev || !next) return;
  const paso = () => {
    const item = track?.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return item ? (item.getBoundingClientRect().width + gap) * Math.max(1, Math.floor(vp.clientWidth / (item.getBoundingClientRect().width + gap)) - 1 || 1) : vp.clientWidth * 0.8;
  };
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRail() {
  const vp = document.getElementById('rail');
  if (!vp) return;
  initRailDrag(vp);
  initFlechas(vp, document.getElementById('railTrack'), document.querySelector('[data-rail-prev]'), document.querySelector('[data-rail-next]'));
}

let Visor = null;
function initGaleria() {
  const grid = document.getElementById('galGrid');
  const visor = document.getElementById('visor');
  if (!grid || !visor) return;
  const fotos = [...grid.querySelectorAll('[data-gal]')].map(b => {
    const img = b.querySelector('img');
    return { src: img.getAttribute('src'), alt: img.alt, w: img.width, h: img.height, cap: b.querySelector('.gal__cap')?.textContent || img.alt };
  });
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const cuenta = document.getElementById('visorCuenta');
  const wsp = document.getElementById('visorWsp');
  let i = 0;
  Visor = crearCapa(visor);
  const mostrar = n => {
    i = (n + fotos.length) % fotos.length;
    const f = fotos[i];
    img.src = f.src; img.alt = f.alt; img.width = f.w; img.height = f.h;
    cap.textContent = f.cap;
    cuenta.textContent = `${i + 1} de ${fotos.length}`;
    wsp.href = wspLink(`Hola! Vi en la galería de Mis mejores recuerdos el diseño "${f.cap}" y quiero algo parecido para mi fiesta.`);
  };
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-gal]');
    if (!b) return;
    mostrar(Number(b.dataset.gal));
    Visor.abrir(visor.querySelector('[data-visor-cerrar]'));
  });
  visor.querySelector('[data-visor-cerrar]').addEventListener('click', () => Visor.cerrar());
  visor.querySelector('[data-visor-prev]').addEventListener('click', () => mostrar(i - 1));
  visor.querySelector('[data-visor-next]').addEventListener('click', () => mostrar(i + 1));
  visor.addEventListener('click', e => { if (e.target === visor) Visor.cerrar(); });
  document.addEventListener('keydown', e => {
    if (!Visor.abierta()) return;
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  let x0 = null;
  visor.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  visor.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) mostrar(dx < 0 ? i + 1 : i - 1);
  });
  const vp = document.getElementById('galVp');
  if (MODELO === '2' && vp) {
    initRailDrag(vp);
    initFlechas(vp, grid, document.querySelector('[data-gal-prev]'), document.querySelector('[data-gal-next]'));
  }
}

function initStory() {
  const st = document.getElementById('story');
  if (!st) return;
  const imgs = [...st.querySelectorAll('.story__img')];
  const barras = [...st.querySelectorAll('.story__barra')];
  const DURACION = 5200;
  let i = 0, timer = 0;
  const mostrar = n => {
    i = (n + imgs.length) % imgs.length;
    imgs.forEach((im, k) => im.classList.toggle('is-activa', k === i));
    st.dataset.foto = String(i);
    barras.forEach((b, k) => { b.classList.toggle('is-llena', k < i || (reduceMotion && k <= i)); b.classList.remove('is-corriendo'); });
    void st.offsetWidth;
    clearTimeout(timer);
    if (reduceMotion) return;
    barras[i]?.classList.add('is-corriendo');
    timer = setTimeout(() => mostrar(i + 1), DURACION);
  };
  st.querySelector('.story__tap--prev')?.addEventListener('click', () => mostrar(i - 1));
  st.querySelector('.story__tap--next')?.addEventListener('click', () => mostrar(i + 1));
  mostrar(0);
}

const PLAZOS = {
  vestido: { ideal: 8, minimo: 5, nombre: 'un vestido largo' },
  traje: { ideal: 7, minimo: 5, nombre: 'un traje sastre' },
  conjunto: { ideal: 6, minimo: 4, nombre: 'un conjunto' },
  bordado: { ideal: 4, minimo: 2, nombre: 'un bordado sobre una prenda mía' },
};

function evaluarFecha(valor, tipo, hoy = new Date()) {
  const plazo = PLAZOS[tipo] || PLAZOS.vestido;
  if (!valor) return { estado: 'vacio', semanas: null, plazo };
  const base = new Date(hoy); base.setHours(0, 0, 0, 0);
  const fecha = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return { estado: 'vacio', semanas: null, plazo };
  const dias = Math.round((fecha - base) / 86400000);
  if (dias < 0) return { estado: 'pasada', dias, semanas: 0, plazo };
  const semanas = Math.floor(dias / 7);
  if (semanas >= plazo.ideal) return { estado: 'ok', dias, semanas, plazo };
  if (semanas >= plazo.minimo) return { estado: 'justo', dias, semanas, plazo };
  return { estado: 'corto', dias, semanas, plazo };
}

function initMedida() {
  const form = document.getElementById('formMedida');
  if (!form) return;
  const fecha = document.getElementById('mFecha');
  const tipo = document.getElementById('mTipo');
  const color = document.getElementById('mColor');
  const nombre = document.getElementById('mNombre');
  const res = document.getElementById('mResultado');
  const semanasEl = document.getElementById('mSemanas');
  const detalleEl = document.getElementById('mDetalle');
  const enviar = document.getElementById('mEnviar');
  const hoy = new Date();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  fecha.min = iso(hoy);
  const cuando = r => (r.semanas >= 1 ? `Faltan ${r.semanas} ${r.semanas === 1 ? 'semana' : 'semanas'}` : `Faltan ${r.dias} ${r.dias === 1 ? 'día' : 'días'}`);
  const actualizar = () => {
    const r = evaluarFecha(fecha.value, tipo.value, new Date());
    res.dataset.estado = r.estado;
    const pide = r.plazo.nombre;
    if (r.estado === 'vacio') {
      semanasEl.textContent = 'Elegí la fecha y te decimos cómo llegamos.';
      detalleEl.textContent = `Para ${pide} conviene arrancar unas ${r.plazo.ideal} semanas antes.`;
    } else if (r.estado === 'pasada') {
      semanasEl.textContent = 'Esa fecha ya pasó.';
      detalleEl.textContent = '¿La escribiste bien? Elegí el día de tu fiesta.';
    } else if (r.estado === 'ok') {
      semanasEl.textContent = `${cuando(r)}: llegamos con calma.`;
      detalleEl.textContent = 'Hay tiempo para el diseño, las medidas y las pruebas antes de la fiesta.';
    } else if (r.estado === 'justo') {
      semanasEl.textContent = `${cuando(r)}: llegamos si arrancamos esta semana.`;
      detalleEl.textContent = 'Escribinos hoy así coordinamos las medidas cuanto antes.';
    } else {
      semanasEl.textContent = `${cuando(r)}: es poco tiempo para ${pide}.`;
      detalleEl.textContent = tipo.value === 'bordado'
        ? 'Escribinos igual y vemos qué diseño entra en esos días.'
        : 'Escribinos igual: podemos bordar una prenda que ya tengas o ver un diseño más simple.';
    }
    const partes = [`Hola! Vi la web de Mis mejores recuerdos y quiero ${pide}`];
    if (fecha.value && r.estado !== 'pasada') partes[0] += ` para mi fiesta del ${new Date(`${fecha.value}T00:00:00`).toLocaleDateString('es-AR')}`;
    partes[0] += '.';
    if (color.value && color.value !== 'sin-definir') partes.push(`Me gusta el color ${color.options[color.selectedIndex].text.toLowerCase()}.`);
    if (nombre.value.trim()) partes.push(`Me llamo ${nombre.value.trim()}.`);
    enviar.href = wspLink(partes.join(' '));
  };
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  form.addEventListener('submit', e => e.preventDefault());
  enviar.addEventListener('click', e => {
    if (fecha.value) return;
    e.preventDefault();
    fecha.focus();
    fecha.setAttribute('aria-invalid', 'true');
    showToast('Contanos la fecha de tu fiesta y te decimos cómo llegamos');
  });
  fecha.addEventListener('input', () => fecha.removeAttribute('aria-invalid'));
  actualizar();
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valida = (lista, ok) => (lista || '').split(',').map(s => s.trim()).filter(v => ok(v));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: valida(params.get('cat'), v => !!catDe(v)),
    color: valida(params.get('color'), v => !!COLORES[v]),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    orden: ORDENES.includes(params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;
  const q = document.getElementById('catQ');
  const orden = document.getElementById('catOrden');
  const cuenta = document.getElementById('catCuenta');
  const chips = document.getElementById('catChips');
  const vacio = document.getElementById('catVacio');
  const mas = document.getElementById('catMas');
  const titulo = document.getElementById('cat-titulo');
  const bajada = document.getElementById('catBajada');
  const migaCat = document.getElementById('migaCat');
  const filtros = document.getElementById('filtros');
  const btnFiltrar = document.getElementById('btnFiltrar');
  const ver = document.getElementById('filtrosVer');
  const tituloBase = titulo.textContent;
  const bajadaBase = bajada.textContent;

  document.querySelector('[data-filtro-cats]').innerHTML = CATEGORIAS.map(c => `<label class="filtro-check"><input type="checkbox" data-f="cat" value="${c.id}"> <span>${esc(c.nombre)}</span> <small>${Tienda.contar({ cat: [c.id] })}</small></label>`).join('');

  const filtrosDe = () => ({ cat: estado.cat, color: estado.color, precio: estado.precio });
  const syncControles = () => {
    q.value = estado.q;
    orden.value = estado.orden;
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cat.includes(i.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(i => { i.checked = estado.color.includes(i.value); });
    document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  };
  const syncURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.color.length) p.set('color', estado.color.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const actual = new URLSearchParams(location.search).get('producto');
    if (actual) p.set('producto', actual);
    history.replaceState(null, '', `${location.pathname}${p.toString() ? '?' + p : ''}`);
  };
  const syncTitulo = () => {
    const unaCat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    if (unaCat) {
      titulo.textContent = unaCat.nombre;
      bajada.textContent = unaCat.bajada;
    } else if (!estado.cat.length && estado.color.length === 1) {
      titulo.textContent = `Diseños en ${COLORES[estado.color[0]].toLowerCase()}`;
      bajada.textContent = bajadaBase;
    } else {
      titulo.textContent = tituloBase;
      bajada.textContent = bajadaBase;
    }
    migaCat.hidden = !unaCat;
    if (unaCat) migaCat.querySelector('span').textContent = unaCat.nombre;
    document.querySelectorAll('[data-menu-coleccion] a[href*="?cat="]').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const pintarChips = () => {
    const lista = [
      ...estado.cat.map(v => ({ t: catDe(v).nombre, k: 'cat', v })),
      ...estado.color.map(v => ({ t: COLORES[v], k: 'color', v })),
      ...(estado.precio ? [{ t: PRECIOS[estado.precio].nombre, k: 'precio', v: estado.precio }] : []),
      ...(estado.q ? [{ t: `«${estado.q}»`, k: 'q', v: estado.q }] : []),
    ];
    chips.innerHTML = lista.map(c => `<button type="button" class="chip-activo" data-quitar="${c.k}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} <span aria-hidden="true">×</span></button>`).join('')
      + (lista.length ? '<button type="button" class="chip-limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const render = (sumar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: sumar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachearProducto);
    if (!sumar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    cursor = res.cursor;
    mostrados += res.items.length;
    const total = estado.q ? (cursor ? null : mostrados) : Tienda.contar(filtrosDe());
    const cuantos = n => `${n} ${n === 1 ? 'diseño' : 'diseños'}`;
    if (estado.q) cuenta.textContent = cursor ? `Más de ${mostrados} resultados` : `${mostrados} ${mostrados === 1 ? 'resultado' : 'resultados'}`;
    else cuenta.textContent = cuantos(total);
    if (ver) ver.textContent = total ? `Ver ${cuantos(total)}` : 'Ver resultados';
    vacio.hidden = mostrados > 0;
    mas.hidden = !cursor;
    if (!sumar) { pintarChips(); syncTitulo(); syncURL(); }
    revelarNuevos(grid);
    refrescarTriggers();
  };
  const cambiar = () => { syncControles(); render(false); };

  filtros.addEventListener('change', e => {
    const i = e.target;
    if (i.dataset.f === 'cat' || i.dataset.f === 'color') {
      const k = i.dataset.f;
      estado[k] = i.checked ? [...new Set([...estado[k], i.value])] : estado[k].filter(v => v !== i.value);
    } else if (i.name === 'precio') estado.precio = i.value;
    else return;
    render(false);
  });
  let t = 0;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = q.value.trim().slice(0, 60); render(false); }, 220); });
  document.getElementById('catBuscar').addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = q.value.trim().slice(0, 60); render(false); });
  orden.addEventListener('change', () => { estado.orden = ORDENES.includes(orden.value) ? orden.value : 'destacados'; render(false); });
  mas.addEventListener('click', () => render(true));
  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const k = quitar.dataset.quitar, v = quitar.dataset.valor;
      if (k === 'cat' || k === 'color') estado[k] = estado[k].filter(x => x !== v);
      else estado[k] = '';
      cambiar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(estado, { q: '', cat: [], color: [], precio: '' });
      cambiar();
    }
  });

  const mqMovil = window.matchMedia('(max-width: 960px)');
  const abrirFiltros = () => {
    filtros.classList.add('abierto'); document.body.classList.add('no-scroll', 'filtros-abiertos');
    btnFiltrar.setAttribute('aria-expanded', 'true');
    filtros.querySelector('input')?.focus({ preventScroll: true });
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('abierto')) return;
    filtros.classList.remove('abierto'); document.body.classList.remove('no-scroll', 'filtros-abiertos');
    btnFiltrar.setAttribute('aria-expanded', 'false');
    if (mqMovil.matches) btnFiltrar.focus({ preventScroll: true });
  };
  btnFiltrar.addEventListener('click', abrirFiltros);
  document.addEventListener('click', e => {
    if (filtros.classList.contains('abierto') && !filtros.contains(e.target) && !btnFiltrar.contains(e.target)) cerrarFiltros();
  });
  filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('abierto')) cerrarFiltros(); });
  mqMovil.addEventListener('change', () => { if (!mqMovil.matches) cerrarFiltros(); });

  syncControles();
  render(false);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) abrirVistaRapida(prod);
  if (params.get('buscar') === '1') {
    q.focus({ preventScroll: true });
    params.delete('buscar');
    syncURL();
  }
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'scale' }, 0);
  const story = hero.querySelector('.story');
  if (story) tl.from(story, { y: 48, duration: 1.4, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero__hilo'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.etiqueta, .hero__detalle'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    const fig = img.parentElement;
    ScrollTrigger.create({
      trigger: fig, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${((s.progress - 0.5) * -6).toFixed(2)}%`; },
    });
  });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
}

initColeccionHome();
initCuentas();
initMenuColeccion();
initDrawer();
initVistaRapida();
initAcciones();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initRail();
initGaleria();
initStory();
initMedida();
initHeroMotion();
initParallax();
initAnio();
