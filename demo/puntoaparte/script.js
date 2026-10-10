const WHATSAPP_NUMBER = '5493518060245';
const POR_PAGINA = 16;
const PRECIO_TOPE = 130000;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = {
  noche: 'Noche',
  dia: 'Día a día',
  interior: 'Ropa interior',
  bijou: 'Bijouterie',
  carteras: 'Carteras',
};

const COLORES = {
  negro: 'Negro',
  blanco: 'Blanco',
  crudo: 'Crudo',
  camel: 'Camel',
  gris: 'Gris',
  nude: 'Nude',
  rosa: 'Rosa',
  fucsia: 'Fucsia',
  bordo: 'Bordó',
  champagne: 'Champagne',
  dorado: 'Dorado',
  plateado: 'Plateado',
  azul: 'Azul',
  verde: 'Verde',
  suela: 'Suela',
};

const PRODUCTOS = [
  { id: 'pa01', slug: 'vestido-lencero-negro', nombre: 'Vestido lencero negro', categoria: 'noche', tipo: 'Vestidos', precio: 89900, descuento: 0, stock: 6, talles: ['S', 'M', 'L'], colores: ['negro'], img: 'vestido-lencero-negro', nuevo: true, tags: ['satén', 'breteles', 'midi', 'fiesta'], alt: 'Vestido lencero negro de breteles finos colgado en una percha blanca', desc: 'Caída suave, breteles finos regulables y largo a media pierna. Va solo con sandalias o con un blazer encima.' },
  { id: 'pa02', slug: 'vestido-lentejuelas', nombre: 'Vestido de lentejuelas bronce', categoria: 'noche', tipo: 'Vestidos', precio: 129900, descuento: 0, stock: 3, talles: ['S', 'M', 'L'], colores: ['dorado'], img: 'vestido-lentejuelas', nuevo: true, tags: ['brillos', 'fiesta', 'lentejuelas'], alt: 'Detalle de un vestido bordado con lentejuelas bronce y plateadas', desc: 'Lentejuelas que se mueven con la luz, escote redondo y forro interior suave. Para la fiesta en la que querés que te vean llegar.' },
  { id: 'pa03', slug: 'top-lurex', nombre: 'Top de lúrex plateado', categoria: 'noche', tipo: 'Tops', precio: 42900, descuento: 0, stock: 8, talles: ['S', 'M', 'L', 'XL'], colores: ['plateado'], img: 'top-lurex', tags: ['brillo', 'top', 'lúrex'], alt: 'Top de lúrex plateado con cuello redondo sobre una percha de metal', desc: 'Tejido con hilo metalizado, cuello redondo y manga corta. De día con jean, de noche con falda.' },
  { id: 'pa04', slug: 'conjunto-tul', nombre: 'Blusa de tul y pantalón negro', categoria: 'noche', tipo: 'Conjuntos', precio: 114000, descuento: 15, stock: 4, talles: ['S', 'M', 'L'], colores: ['negro'], img: 'vestido-tul-encaje', tags: ['tul', 'encaje', 'conjunto', 'pantalón'], alt: 'Blusa de tul negro con lunares bordados y pantalón negro colgados juntos en una percha', desc: 'Blusa de tul con lunares bordados y volado de encaje, más pantalón de vestir al tono. Se venden juntos.' },
  { id: 'pa05', slug: 'falda-terciopelo', nombre: 'Falda de terciopelo champagne', categoria: 'noche', tipo: 'Faldas', precio: 64900, descuento: 0, stock: 5, talles: ['S', 'M', 'L'], colores: ['champagne'], img: 'falda-terciopelo', nuevo: true, tags: ['terciopelo', 'midi', 'falda'], alt: 'Falda de terciopelo champagne colgada en una percha de madera dentro de un probador', desc: 'Terciopelo con brillo suave, cintura alta y largo midi. Combina con el top de lúrex o con una camisa blanca.' },
  { id: 'pa06', slug: 'vestido-saten-rosa', nombre: 'Vestido camisero de satén rosa', categoria: 'noche', tipo: 'Vestidos', precio: 98900, descuento: 0, stock: 5, talles: ['S', 'M', 'L'], colores: ['rosa'], img: 'vestido-saten-rosa', tags: ['satén', 'camisero', 'lazo'], alt: 'Detalle de un vestido camisero de satén rosa con lazo a la cintura', desc: 'Satén de caída pesada, botones forrados y lazo a la cintura para marcarla a tu gusto.' },
  { id: 'pa07', slug: 'vestido-floreado', nombre: 'Vestido cruzado floreado', categoria: 'dia', tipo: 'Vestidos', precio: 69900, descuento: 0, stock: 7, talles: ['S', 'M', 'L'], colores: ['rosa'], img: 'vestido-floreado', nuevo: true, tags: ['floreado', 'estampado', 'cruzado'], alt: 'Vestido cruzado rosa con flores grandes colgado en una percha de madera', desc: 'Escote cruzado con lazo al costado, breteles finos y estampa de flores grandes. Fresco para la media estación.' },
  { id: 'pa08', slug: 'camisa-blanca', nombre: 'Camisa blanca de lino', categoria: 'dia', tipo: 'Camisas', precio: 54900, descuento: 0, stock: 10, talles: ['S', 'M', 'L', 'XL'], colores: ['blanco'], img: 'camisa-blanca', tags: ['lino', 'camisa', 'básico'], alt: 'Camisa blanca de lino colgada en una percha de metal', desc: 'Lino liviano, cuello clásico y bolsillo al pecho. Abierta, cerrada o atada a la cintura.' },
  { id: 'pa09', slug: 'jean-recto', nombre: 'Jean recto tiro alto', categoria: 'dia', tipo: 'Jeans', precio: 62900, descuento: 0, stock: 12, talles: ['36', '38', '40', '42', '44'], colores: ['azul'], img: 'jean-recto', tags: ['jean', 'denim', 'tiro alto'], alt: 'Pila de jeans azules doblados sobre una mesa blanca', desc: 'Denim rígido de lavado medio, tiro alto y botamanga recta. El jean que va con todo.' },
  { id: 'pa10', slug: 'sweater-tejido', nombre: 'Sweater de punto inglés', categoria: 'dia', tipo: 'Tejidos', precio: 59000, descuento: 20, stock: 6, talles: ['S', 'M', 'L'], colores: ['camel', 'crudo', 'gris'], img: 'sweater-tejido', tags: ['tejido', 'sweater', 'abrigo'], alt: 'Tres sweaters de punto inglés en camel, crudo y gris apoyados uno sobre otro', desc: 'Punto inglés grueso con escote en V. Elegí el color: camel, crudo o gris.' },
  { id: 'pa11', slug: 'vestido-estampado', nombre: 'Vestido midi de breteles estampado', categoria: 'dia', tipo: 'Vestidos', precio: 66900, descuento: 0, stock: 5, talles: ['S', 'M', 'L'], colores: ['verde'], img: 'vestido-estampado', tags: ['estampado', 'midi', 'viscosa'], alt: 'Vestido de breteles con micro estampa verde y blanca colgado en un placard', desc: 'Viscosa con micro estampa, escote en V y largo midi. Liviano para los días de calor.' },
  { id: 'pa12', slug: 'blazer-crudo', nombre: 'Blazer de lino crudo', categoria: 'dia', tipo: 'Blazers', precio: 94900, descuento: 0, stock: 4, talles: ['S', 'M', 'L'], colores: ['crudo'], img: 'blazer-crudo', tags: ['blazer', 'lino', 'sastrero', 'saco'], alt: 'Blazer de lino color crudo colgado en una percha negra', desc: 'Saco sastrero de lino con solapa clásica. Le da otra vuelta a cualquier jean.' },
  { id: 'pa13', slug: 'corpino-encaje-fucsia', nombre: 'Corpiño bustier de encaje fucsia', categoria: 'interior', tipo: 'Corpiños', precio: 36900, descuento: 0, stock: 6, talles: ['85', '90', '95', '100'], colores: ['fucsia'], img: 'corpino-encaje-fucsia', nuevo: true, tags: ['encaje', 'bustier', 'corpiño', 'lencería'], alt: 'Corpiño bustier de encaje fucsia con flores bordadas sobre una mesa blanca', desc: 'Encaje con flores bordadas, aro y breteles regulables. Para usar o para dejar asomar.' },
  { id: 'pa14', slug: 'corpino-nude', nombre: 'Corpiño soft satinado nude', categoria: 'interior', tipo: 'Corpiños', precio: 29900, descuento: 0, stock: 9, talles: ['85', '90', '95', '100'], colores: ['nude'], img: 'corpino-nude', tags: ['soft', 'satinado', 'básico', 'corpiño', 'lencería'], alt: 'Corpiño satinado color nude colgado en una percha dorada junto a un collar de perlas', desc: 'Taza soft sin costuras, terminación satinada y breteles regulables. No se marca debajo de remeras finas.' },
  { id: 'pa15', slug: 'bralette-volados', nombre: 'Bralette con volados rosa', categoria: 'interior', tipo: 'Bralettes', precio: 24900, descuento: 0, stock: 7, talles: ['S', 'M', 'L'], colores: ['rosa'], img: 'conjunto-rosa', tags: ['bralette', 'algodón', 'sin aro', 'lencería'], alt: 'Bralette rosa con volados colgado en una percha negra', desc: 'Algodón liviano con volados en los bordes y sin aro. Cómodo para estar en casa.' },
  { id: 'pa16', slug: 'pijama-saten', nombre: 'Pijama de satén blanco', categoria: 'interior', tipo: 'Pijamas', precio: 57900, descuento: 0, stock: 5, talles: ['S', 'M', 'L', 'XL'], colores: ['blanco'], img: 'pijama-saten', tags: ['pijama', 'satén', 'dormir'], alt: 'Pijama de satén blanco de camisa y pantalón', desc: 'Camisa de manga larga con botones y pantalón con cintura elástica. Satén suave y fresco.' },
  { id: 'pa17', slug: 'conjunto-negro', nombre: 'Conjunto de encaje negro', categoria: 'interior', tipo: 'Conjuntos', precio: 45000, descuento: 10, stock: 3, talles: ['85', '90', '95', '100'], colores: ['negro'], img: 'conjunto-negro', tags: ['encaje', 'conjunto', 'lencería', 'corpiño'], alt: 'Conjunto de corpiño y bombacha de encaje negro sobre una sábana blanca', desc: 'Corpiño con aro y bombacha de encaje elastizado. El clásico que nunca falla.' },
  { id: 'pa18', slug: 'body-bordo', nombre: 'Body de encaje bordó', categoria: 'interior', tipo: 'Bodys', precio: 49900, descuento: 0, stock: 4, talles: ['S', 'M', 'L'], colores: ['bordo'], img: 'body-bordo', nuevo: true, tags: ['body', 'encaje', 'lencería'], alt: 'Body de encaje bordó con hombros caídos colgado de un tendedero', desc: 'Encaje con hombros caídos y broche abajo. Como lencería o como top con un pantalón de vestir.' },
  { id: 'pa19', slug: 'argollas-doradas', nombre: 'Argollas doradas torneadas', categoria: 'bijou', tipo: 'Aros', precio: 14900, descuento: 0, stock: 15, talles: ['Único'], colores: ['dorado'], img: 'argollas-doradas', tags: ['aros', 'argollas', 'acero'], alt: 'Par de argollas doradas con textura torneada sobre una tela blanca', desc: 'Argollas de acero dorado con textura torneada, de 4 cm. Livianas para usar todo el día.' },
  { id: 'pa20', slug: 'aros-perla', nombre: 'Aros mini argolla con perla', categoria: 'bijou', tipo: 'Aros', precio: 16900, descuento: 0, stock: 10, talles: ['Único'], colores: ['dorado'], img: 'aros-perla', nuevo: true, tags: ['aros', 'perla', 'argollas'], alt: 'Aros de argolla dorada con perla colgante sobre un plato de cerámica blanca', desc: 'Argollitas doradas con perla colgante. Delicados para todos los días.' },
  { id: 'pa21', slug: 'collar-dijes', nombre: 'Collar largo con dijes', categoria: 'bijou', tipo: 'Collares', precio: 18900, descuento: 0, stock: 8, talles: ['Único'], colores: ['dorado'], img: 'collar-dijes', tags: ['collar', 'dije', 'cadena'], alt: 'Collar dorado de cadena fina con dije calado y medalla, sobre una mesa blanca', desc: 'Cadena fina con dije calado y medalla lisa. Solo o en capas con otros collares.' },
  { id: 'pa22', slug: 'pulsera-placas', nombre: 'Pulsera de hilo con placas', categoria: 'bijou', tipo: 'Pulseras', precio: 12900, descuento: 0, stock: 12, talles: ['Único'], colores: ['negro', 'azul', 'dorado'], img: 'pulseras', tags: ['pulsera', 'esmaltada', 'hilo'], alt: 'Pulseras de hilo con placas esmaltadas en negro, azul y dorado sobre un exhibidor', desc: 'Hilo encerado con placas esmaltadas y nudo corredizo. Elegí el color o llevá varias.' },
  { id: 'pa23', slug: 'cartera-redonda', nombre: 'Cartera redonda matelasé', categoria: 'carteras', tipo: 'Bandoleras', precio: 69900, descuento: 0, stock: 5, talles: ['Único'], colores: ['negro'], img: 'cartera-redonda', nuevo: true, tags: ['cartera', 'matelasé', 'cadena', 'bandolera'], alt: 'Cartera redonda negra acolchada con cadena dorada', desc: 'Ecocuero acolchado con cadena dorada para llevar al hombro o cruzada.' },
  { id: 'pa24', slug: 'cartera-bordo', nombre: 'Cartera de mano bordó', categoria: 'carteras', tipo: 'Carteras de mano', precio: 74900, descuento: 0, stock: 4, talles: ['Único'], colores: ['bordo'], img: 'cartera-bordo', tags: ['cartera', 'asas'], alt: 'Cartera de mano bordó con textura símil lagarto y doble asa', desc: 'Textura símil lagarto, doble asa y cierre de punta a punta. Entran billetera, celular y maquillaje.' },
  { id: 'pa25', slug: 'sobre-cuero', nombre: 'Sobre de cuero suela', categoria: 'carteras', tipo: 'Sobres', precio: 38900, descuento: 0, stock: 6, talles: ['Único'], colores: ['suela'], img: 'sobre-cuero', tags: ['sobre', 'cuero', 'clutch'], alt: 'Sobre de cuero color suela con dos broches sobre fondo claro', desc: 'Cuero suela con dos broches. Para la noche o como organizador dentro de una cartera grande.' },
  { id: 'pa26', slug: 'clutch-fruncido', nombre: 'Clutch fruncido con cadena', categoria: 'carteras', tipo: 'Sobres', precio: 46000, descuento: 15, stock: 2, talles: ['Único'], colores: ['blanco'], img: 'clutch-blanco', tags: ['clutch', 'fiesta', 'cadena', 'sobre'], alt: 'Clutch blanco fruncido con boquilla y cadena plateada apoyado en el piso', desc: 'Fruncido suave, boquilla plateada y cadena desmontable. Para casamientos y fiestas de día.' },
];

const ORDEN = ['pa06', 'pa08', 'pa14', 'pa24', 'pa04', 'pa21', 'pa12', 'pa17', 'pa03', 'pa26', 'pa09', 'pa19', 'pa16', 'pa11', 'pa25', 'pa10', 'pa15', 'pa22', 'pa01', 'pa07', 'pa13', 'pa23', 'pa02', 'pa20', 'pa18', 'pa05'];

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const claveLinea = i => `${i.id}|${i.talle || ''}|${i.color || ''}`;
const IMG = (p, w) => `${BASE}images/p-${p.img}-${w}.webp`;

function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

const Cart = {
  KEY: 'puntoaparte_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, items); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '', color = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.talle || '') === talle && (i.color || '') === color);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, color, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(clave, qty) {
    const items = this.get(); const it = items.find(i => claveLinea(i) === clave); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(clave) { this.save(this.get().filter(i => claveLinea(i) !== clave)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const bloqueos = new Set();
function bloquear(nombre, activo) {
  if (activo) bloqueos.add(nombre);
  else bloqueos.delete(nombre);
  document.body.classList.toggle('no-scroll', bloqueos.size > 0);
}

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLES)].filter(el => el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden');
  if (!els.length) return;
  const primero = els[0];
  const ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

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
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia(nav.dataset.mq || '(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquear('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquear('nav', true);
    nav.querySelector('a')?.focus();
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

function initTopH() {
  if (!document.body.classList.contains('m1')) return;
  const aviso = document.querySelector('.aviso');
  const header = document.querySelector('.site-header');
  if (!aviso || !header) return;
  const medir = () => document.documentElement.style.setProperty('--top-h', `${aviso.offsetHeight + header.offsetHeight}px`);
  medir();
  window.addEventListener('resize', medir, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, pos) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, pos);
  };
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  paso('.estado-pill, .hero-eyebrow', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.1);
  paso('.ficha-wordmark', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.12);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'transform,opacity,filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-wordmark', { yPercent: 24, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.5);
  paso('.ficha-datos > div, .ficha-foto--alta-wrap', { y: 24, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.62);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--vidriera');
  const pic = hero?.querySelector('[data-hero-img]');
  if (pic) gsap.to(pic, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

const DOMINGOS_ESPECIALES = { '2026-10-18': 'el Día de la Madre' };

function ahoraCordoba() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Cordoba', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const v = t => partes.find(p => p.type === t)?.value || '';
    const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dia: dias[v('weekday')], min: (Number(v('hour')) % 24) * 60 + Number(v('minute')), fecha: `${v('year')}-${v('month')}-${v('day')}` };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes(), fecha: d.toISOString().slice(0, 10) };
  }
}

function fechaMas(fecha, dias) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function estadoLocal() {
  const { dia, min, fecha } = ahoraCordoba();
  const hoyEspecial = DOMINGOS_ESPECIALES[fecha];
  if (hoyEspecial) return { abierto: true, texto: `Hoy domingo abrimos por ${hoyEspecial}` };
  if (dia >= 1 && dia <= 6) {
    if (min >= 540 && min < 1260) return { abierto: true, texto: 'Abierto ahora · hasta las 21 h' };
    if (min < 540) return { abierto: false, texto: 'Cerrado ahora · abrimos hoy a las 9' };
    if (dia === 6) {
      const manana = DOMINGOS_ESPECIALES[fechaMas(fecha, 1)];
      return { abierto: false, texto: manana ? `Cerrado ahora · mañana abrimos por ${manana}` : 'Cerrado ahora · abrimos el lunes a las 9' };
    }
    return { abierto: false, texto: 'Cerrado ahora · abrimos mañana a las 9' };
  }
  return { abierto: false, texto: 'Hoy domingo cerramos · abrimos el lunes a las 9' };
}

function initEstado() {
  const pills = document.querySelectorAll('[data-estado]');
  const pintar = () => {
    const e = estadoLocal();
    pills.forEach(p => { p.textContent = e.texto; p.classList.toggle('is-abierto', e.abierto); });
  };
  if (pills.length) { pintar(); window.setInterval(pintar, 60000); }
  const especiales = document.querySelectorAll('[data-aviso-especial]');
  const { fecha } = ahoraCordoba();
  if (especiales.length && fecha >= '2026-10-04' && fecha <= '2026-10-18') {
    especiales.forEach(el => { el.textContent = fecha === '2026-10-18' ? 'Hoy, Día de la Madre, también abrimos' : 'Domingo 18 de octubre, Día de la Madre: abrimos'; });
  }
}

const necesitaTalle = p => p.talles.length > 1;
const necesitaColor = p => p.colores.length > 1;

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge">Últimas unidades</span>');
  return b.length ? `<div class="card-badges">${b.join('')}</div>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<span class="precio-final">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s>`
    : formatearPrecio(p.precio);
}

function tallesTexto(p) {
  const base = p.talles[0] === 'Único' ? 'Talle único' : `Talles ${p.talles.join(' · ')}`;
  return p.colores.length > 1 ? `${base} · ${p.colores.length} colores` : base;
}

function botonCard(p) {
  if (necesitaTalle(p)) return 'Elegir talle';
  if (necesitaColor(p)) return 'Elegir color';
  return '<span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span>';
}

function fotoHTML(p, sizes) {
  return `<img src="${IMG(p, 600)}" srcset="${IMG(p, 600)} 600w, ${IMG(p, 1200)} 1200w" sizes="${sizes}" width="600" height="750" alt="${esc(p.alt)}">`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  return `<article class="card" data-id="${p.id}"${anim}>
    <div class="card-media">
      <button type="button" class="card-foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, '(max-width: 768px) 50vw, (max-width: 1180px) 33vw, 340px')}</button>
      ${badgesHTML(p)}
      <span class="card-ver" aria-hidden="true">Vista rápida</span>
    </div>
    <div class="card-info">
      <p class="card-cat">${esc(CATEGORIAS[p.categoria])} · ${esc(p.tipo)}</p>
      <h3 class="card-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="card-precio-fila">
        <p class="precio">${precioHTML(p)}</p>
        <button type="button" class="card-comprar" data-comprar="${p.id}">Comprar ahora</button>
      </div>
      <p class="card-talles">${esc(tallesTexto(p))}</p>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-menos aria-label="Restar una unidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-mas aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">${botonCard(p)}</button>
      </div>
    </div>
  </article>`;
}

function railHTML(p) {
  return `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(56px)">
    <article class="card" data-id="${p.id}">
      <div class="card-media">
        <button type="button" class="card-foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, '(max-width: 768px) 60vw, 290px')}</button>
        ${badgesHTML(p)}
        <span class="card-ver" aria-hidden="true">Vista rápida</span>
      </div>
      <div class="card-info">
        <h3 class="card-nombre">${esc(p.nombre)}</h3>
        <p class="precio">${precioHTML(p)}</p>
      </div>
    </article>
  </div>`;
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const lista = PRODUCTOS.filter(p => p.nuevo).sort((a, b) => ORDEN.indexOf(a.id) - ORDEN.indexOf(b.id)).slice(0, 6);
  track.innerHTML = lista.map(railHTML).join('');
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { dragging = false; }
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
  const vp = document.getElementById('railVp');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => {
    const item = track.querySelector('.rail-item');
    if (!item) return 300;
    return item.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 0);
  };
  const actualizar = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  window.addEventListener('load', actualizar);
  actualizar();
}

const normalizar = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const INDICE = new Map(PRODUCTOS.map(p => [p.id, normalizar([p.nombre, p.tipo, CATEGORIAS[p.categoria], p.desc, ...(p.tags || []), ...p.colores.map(c => COLORES[c])].join(' '))]));
const INDICE_FUERTE = new Map(PRODUCTOS.map(p => [p.id, normalizar([p.nombre, p.tipo, ...(p.tags || [])].join(' '))]));

const estado = { q: '', cats: new Set(), talles: new Set(), colores: new Set(), precioMax: PRECIO_TOPE, orden: 'destacados', visibles: POR_PAGINA };
let pintadas = 0;

function filtrados() {
  const palabras = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cats.size && !estado.cats.has(p.categoria)) return false;
    if (estado.talles.size && !p.talles.some(t => estado.talles.has(t))) return false;
    if (estado.colores.size && !p.colores.some(c => estado.colores.has(c))) return false;
    if (precioFinal(p) > estado.precioMax) return false;
    if (palabras.length) {
      const texto = INDICE.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  const porOrden = (a, b) => ORDEN.indexOf(a.id) - ORDEN.indexOf(b.id);
  const puntaje = p => palabras.filter(w => (INDICE_FUERTE.get(p.id) || '').includes(w)).length;
  const criterios = {
    destacados: palabras.length ? (a, b) => puntaje(b) - puntaje(a) || porOrden(a, b) : porOrden,
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || porOrden(a, b),
    menor: (a, b) => precioFinal(a) - precioFinal(b),
    mayor: (a, b) => precioFinal(b) - precioFinal(a),
  };
  return lista.sort(criterios[estado.orden] || porOrden);
}

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

function renderCatalogo(modo = 'reset') {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const lista = filtrados();
  const total = lista.length;
  const mostrar = lista.slice(0, estado.visibles);
  if (modo === 'mas') grid.insertAdjacentHTML('beforeend', mostrar.slice(pintadas).map(p => cardHTML(p)).join(''));
  else grid.innerHTML = mostrar.map(p => cardHTML(p)).join('');
  pintadas = mostrar.length;

  const vacio = document.querySelector('[data-vacio]');
  if (vacio) vacio.hidden = total > 0;
  const pie = document.querySelector('.catalogo-pie');
  if (pie) pie.hidden = total === 0;
  const pieTxt = document.querySelector('[data-pie-txt]');
  if (pieTxt) pieTxt.textContent = mostrar.length < total ? `Mostrando ${mostrar.length} de ${total}` : `Estás viendo ${plural(total, 'producto', 'productos')}`;
  const verMas = document.querySelector('[data-ver-mas]');
  if (verMas) {
    const restan = total - mostrar.length;
    verMas.hidden = restan <= 0;
    verMas.textContent = `Ver más prendas (${Math.min(restan, POR_PAGINA)})`;
  }
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = total ? plural(total, 'producto', 'productos') : 'Sin resultados'; });
  document.querySelectorAll('[data-count-n]').forEach(el => { el.textContent = total ? plural(total, 'producto', 'productos') : 'resultados'; });
  syncUI();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function mismasCats(lista) {
  if (estado.cats.size !== lista.length) return false;
  return lista.every(c => estado.cats.has(c));
}

function syncUI() {
  document.querySelectorAll('[data-chip-cat]').forEach(b => {
    const v = b.dataset.chipCat;
    const activo = v === 'todo' ? estado.cats.size === 0 : mismasCats(v.split(','));
    b.setAttribute('aria-pressed', String(activo));
  });
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const set = inp.dataset.f === 'cat' ? estado.cats : inp.dataset.f === 'talle' ? estado.talles : estado.colores;
    inp.checked = set.has(inp.value);
  });
  document.querySelectorAll('[data-precio]').forEach(r => { r.value = String(estado.precioMax); });
  document.querySelectorAll('[data-precio-out]').forEach(o => { o.textContent = formatearPrecio(estado.precioMax); });
  document.querySelectorAll('[data-orden]').forEach(s => { s.value = estado.orden; });
  document.querySelectorAll('[data-q]').forEach(i => { if (document.activeElement !== i) i.value = estado.q; });
  const activos = estado.cats.size + estado.talles.size + estado.colores.size + (estado.precioMax < PRECIO_TOPE ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(n => { n.textContent = activos; n.hidden = activos === 0; });

  const cont = document.querySelector('[data-activos]');
  if (!cont) return;
  const tags = [];
  estado.cats.forEach(c => tags.push({ k: `cat:${c}`, t: CATEGORIAS[c] }));
  estado.talles.forEach(t => tags.push({ k: `talle:${t}`, t: `Talle ${t}` }));
  estado.colores.forEach(c => tags.push({ k: `color:${c}`, t: COLORES[c] }));
  if (estado.precioMax < PRECIO_TOPE) tags.push({ k: 'precio', t: `Hasta ${formatearPrecio(estado.precioMax)}` });
  if (estado.q.trim()) tags.push({ k: 'q', t: `“${estado.q.trim()}”` });
  const x = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  cont.innerHTML = tags.length
    ? tags.map(t => `<button type="button" class="tag-activo" data-quitar="${esc(t.k)}" aria-label="Quitar filtro ${esc(t.t)}">${esc(t.t)}${x}</button>`).join('') + '<button type="button" class="tag-limpiar" data-limpiar>Limpiar todo</button>'
    : '';
}

function aplicarCats(valor) {
  estado.cats = new Set(!valor || valor === 'todo' ? [] : valor.split(',').filter(c => CATEGORIAS[c]));
  estado.visibles = POR_PAGINA;
  renderCatalogo();
}

function limpiarFiltros() {
  estado.q = '';
  estado.cats.clear();
  estado.talles.clear();
  estado.colores.clear();
  estado.precioMax = PRECIO_TOPE;
  estado.visibles = POR_PAGINA;
  renderCatalogo();
}

function irATienda(enfocarBuscador = false) {
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (enfocarBuscador) {
    const input = [...document.querySelectorAll('#tienda [data-q]')].find(i => i.getClientRects().length);
    setTimeout(() => input?.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }
}

function initCatalogo() {
  if (!document.getElementById('grid')) return;
  let espera = 0;
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-chip-cat]');
    if (chip) { aplicarCats(chip.dataset.chipCat); return; }
    const link = e.target.closest('a[data-cat]');
    if (link) { e.preventDefault(); aplicarCats(link.dataset.cat); irATienda(); return; }
    if (e.target.closest('[data-ir-buscar]')) { irATienda(true); return; }
    if (e.target.closest('[data-ver-mas]')) { estado.visibles += POR_PAGINA; renderCatalogo('mas'); return; }
    if (e.target.closest('[data-limpiar]')) { limpiarFiltros(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const [tipo, valor] = quitar.dataset.quitar.split(':');
      if (tipo === 'cat') estado.cats.delete(valor);
      if (tipo === 'talle') estado.talles.delete(valor);
      if (tipo === 'color') estado.colores.delete(valor);
      if (tipo === 'precio') estado.precioMax = PRECIO_TOPE;
      if (tipo === 'q') estado.q = '';
      estado.visibles = POR_PAGINA;
      renderCatalogo();
    }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('input[data-f]');
    if (inp) {
      const set = inp.dataset.f === 'cat' ? estado.cats : inp.dataset.f === 'talle' ? estado.talles : estado.colores;
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      estado.visibles = POR_PAGINA;
      renderCatalogo();
      return;
    }
    const sel = e.target.closest('[data-orden]');
    if (sel) { estado.orden = sel.value; estado.visibles = POR_PAGINA; renderCatalogo(); }
  });
  document.addEventListener('input', e => {
    const rango = e.target.closest('[data-precio]');
    if (rango) {
      estado.precioMax = Number(rango.value) || PRECIO_TOPE;
      estado.visibles = POR_PAGINA;
      renderCatalogo();
      return;
    }
    const q = e.target.closest('[data-q]');
    if (q) {
      estado.q = q.value;
      document.querySelectorAll('[data-q]').forEach(i => { if (i !== q) i.value = q.value; });
      clearTimeout(espera);
      espera = setTimeout(() => { estado.visibles = POR_PAGINA; renderCatalogo(); }, 140);
    }
  });
  document.querySelectorAll('[data-buscador]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(espera);
    const q = f.querySelector('[data-q]');
    estado.q = q ? q.value : estado.q;
    estado.visibles = POR_PAGINA;
    renderCatalogo();
    irATienda();
  }));
}

function initCuentas() {
  const ropa = ['noche', 'dia', 'interior'];
  const contar = lista => PRODUCTOS.filter(p => lista.includes(p.categoria)).length;
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const v = el.dataset.catN;
    const lista = v === 'todo' ? Object.keys(CATEGORIAS) : v.split(',');
    const n = contar(lista);
    el.textContent = lista.every(c => ropa.includes(c)) ? plural(n, 'prenda', 'prendas') : plural(n, 'producto', 'productos');
  });
  document.querySelectorAll('[data-cat-cuenta]').forEach(el => { el.textContent = contar([el.dataset.catCuenta]); });
}

function initFiltros() {
  const panel = document.getElementById('filtros');
  if (!panel) return;
  const backdrop = document.querySelector('[data-filtros-backdrop]');
  const lateral = document.body.classList.contains('m2') ? window.matchMedia('(min-width: 1025px)') : null;
  const esDrawer = () => !lateral || !lateral.matches;
  let abierto = false;
  let disparador = null;
  let cierre = 0;
  const botones = () => document.querySelectorAll('[data-abrir-filtros]');
  const abrir = btn => {
    if (!esDrawer() || abierto) return;
    clearTimeout(cierre);
    disparador = btn || document.activeElement;
    panel.hidden = false;
    if (backdrop) backdrop.hidden = false;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    void panel.offsetWidth;
    panel.classList.add('open');
    backdrop?.classList.add('open');
    abierto = true;
    bloquear('filtros', true);
    botones().forEach(b => b.setAttribute('aria-expanded', 'true'));
    revelarNuevos(panel);
    panel.querySelector('[data-cerrar-filtros]')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!abierto) return;
    abierto = false;
    panel.classList.remove('open');
    backdrop?.classList.remove('open');
    bloquear('filtros', false);
    botones().forEach(b => b.setAttribute('aria-expanded', 'false'));
    cierre = setTimeout(() => {
      if (abierto) return;
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      if (esDrawer()) { panel.hidden = true; if (backdrop) backdrop.hidden = true; }
    }, reduceMotion ? 0 : 400);
    if (disparador?.isConnected) disparador.focus({ preventScroll: true });
  };
  const sync = (inicial = false) => {
    if (esDrawer()) {
      if (!abierto) { panel.hidden = true; if (backdrop) backdrop.hidden = true; }
    } else {
      if (abierto) { abierto = false; bloquear('filtros', false); }
      panel.classList.remove('open');
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      panel.hidden = false;
      if (backdrop) { backdrop.hidden = true; backdrop.classList.remove('open'); }
      if (!inicial) revelarNuevos(panel);
    }
  };
  lateral?.addEventListener('change', () => sync());
  sync(true);
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-abrir-filtros]');
    if (btn) { abrir(btn); return; }
    if (e.target.closest('[data-cerrar-filtros]')) { cerrar(); return; }
    if (backdrop && e.target === backdrop) cerrar();
  });
  document.addEventListener('keydown', e => {
    if (!abierto) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(panel, e);
  });
}

const QV = { abrir() {}, cerrar() {} };

function inyectarSchema(p) {
  let s = document.getElementById('schema-producto');
  if (!s) {
    s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'schema-producto';
    document.head.appendChild(s);
  }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(IMG(p, 1200), location.href).href,
    description: p.desc,
    category: CATEGORIAS[p.categoria],
    brand: { '@type': 'Brand', name: 'Punto & Aparte' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: precioFinal(p),
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${location.origin}${location.pathname}?producto=${p.slug}`,
    },
  });
}

function initQuickView() {
  const back = document.getElementById('qv');
  if (!back) return;
  const dlg = back.querySelector('.qv');
  const $ = s => back.querySelector(s);
  const img = $('[data-qv-img]');
  const cat = $('[data-qv-cat]');
  const nombre = $('[data-qv-nombre]');
  const precio = $('[data-qv-precio]');
  const desc = $('[data-qv-desc]');
  const gTalles = $('[data-qv-talles]');
  const gColores = $('[data-qv-colores]');
  const qtyEl = $('[data-qv-stepper] [data-qty]');
  const addBtn = $('[data-qv-add]');
  const wsp = $('[data-qv-wsp]');
  const rel = $('[data-qv-rel]');
  let actual = null;
  let qty = 1;
  let comprar = false;
  let disparador = null;
  let abierto = false;
  let cierre = 0;

  const opciones = (grupo, name, valores, etiqueta) => {
    grupo.querySelector('.qv-opciones').innerHTML = valores.map(v => `<label class="qv-opcion"><input type="radio" name="${name}" value="${esc(v)}"><span>${esc(etiqueta(v))}</span></label>`).join('');
  };
  const elegido = name => back.querySelector(`input[name="${name}"]:checked`)?.value || '';
  const actualizarWsp = () => {
    if (!actual) return;
    const t = elegido('qv-talle');
    const c = elegido('qv-color');
    const partes = [`Hola Punto & Aparte, quiero consultar por ${actual.nombre}`];
    if (t && t !== 'Único') partes.push(`talle ${t}`);
    if (c) partes.push(`color ${COLORES[c]}`);
    wsp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${partes.join(', ')}. ¿Lo tienen disponible?`)}`;
  };
  const marcarError = grupo => {
    grupo.classList.remove('is-error');
    void grupo.offsetWidth;
    grupo.classList.add('is-error');
    grupo.querySelector('input')?.focus({ preventScroll: true });
  };

  function abrir(id, opts = {}) {
    const p = getProducto(id);
    if (!p) return;
    actual = p;
    qty = Math.max(1, Math.min(opts.qty || 1, p.stock || 99));
    comprar = Boolean(opts.comprar);
    if (!abierto) disparador = opts.disparador || document.activeElement;
    img.src = IMG(p, 1200);
    img.srcset = `${IMG(p, 600)} 600w, ${IMG(p, 1200)} 1200w`;
    img.sizes = '(max-width: 900px) 100vw, 490px';
    img.alt = p.alt;
    cat.textContent = `${CATEGORIAS[p.categoria]} · ${p.tipo}`;
    nombre.textContent = p.nombre;
    precio.innerHTML = precioHTML(p);
    desc.textContent = p.desc;
    gTalles.classList.remove('is-error');
    gColores.classList.remove('is-error');
    opciones(gTalles, 'qv-talle', p.talles, v => (v === 'Único' ? 'Talle único' : v));
    if (!necesitaTalle(p)) gTalles.querySelector('input').checked = true;
    gColores.hidden = !necesitaColor(p);
    if (necesitaColor(p)) opciones(gColores, 'qv-color', p.colores, v => COLORES[v]);
    else gColores.querySelector('.qv-opciones').innerHTML = '';
    qtyEl.textContent = qty;
    addBtn.textContent = comprar ? 'Comprar ahora' : 'Agregar al carrito';
    const mismos = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id);
    const otros = PRODUCTOS.filter(x => x.categoria !== p.categoria);
    rel.innerHTML = [...mismos, ...otros].slice(0, 3).map(r => `<button type="button" class="qv-rel-item" data-qv-rel-id="${r.id}"><span><img src="${IMG(r, 600)}" width="600" height="750" alt="${esc(r.alt)}"></span>${esc(r.nombre)}</button>`).join('');
    actualizarWsp();
    inyectarSchema(p);
    clearTimeout(cierre);
    if (!abierto) {
      back.hidden = false;
      void back.offsetWidth;
      back.classList.add('open');
      abierto = true;
      bloquear('qv', true);
    }
    dlg.scrollTop = 0;
    const foco = opts.elegir
      ? (necesitaTalle(p) ? gTalles.querySelector('input') : gColores.querySelector('input'))
      : $('[data-qv-cerrar]');
    (foco || $('[data-qv-cerrar]')).focus({ preventScroll: true });
  }

  function cerrar(devolverFoco = true) {
    if (!abierto) return;
    abierto = false;
    back.classList.remove('open');
    bloquear('qv', false);
    cierre = setTimeout(() => { back.hidden = true; }, reduceMotion ? 0 : 320);
    if (devolverFoco && disparador?.isConnected) disparador.focus({ preventScroll: true });
  }

  back.addEventListener('click', e => {
    if (e.target === back || e.target.closest('[data-qv-cerrar]')) { cerrar(); return; }
    const relBtn = e.target.closest('[data-qv-rel-id]');
    if (relBtn) { abrir(relBtn.dataset.qvRelId); return; }
    if (e.target.closest('[data-qv-stepper] [data-menos]')) { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; }
    if (e.target.closest('[data-qv-stepper] [data-mas]')) { qty = Math.min(actual?.stock || 99, qty + 1); qtyEl.textContent = qty; }
  });
  back.addEventListener('change', e => {
    if (!e.target.matches('input[type="radio"]')) return;
    e.target.closest('.qv-grupo')?.classList.remove('is-error');
    actualizarWsp();
  });
  addBtn.addEventListener('click', () => {
    if (!actual) return;
    const talle = elegido('qv-talle');
    const color = necesitaColor(actual) ? elegido('qv-color') : actual.colores[0];
    if (!talle) { marcarError(gTalles); showToast('Elegí un talle para seguir.'); return; }
    if (!color) { marcarError(gColores); showToast('Elegí un color para seguir.'); return; }
    Cart.add(actual, qty, talle, color);
    const nombreP = actual.nombre;
    const irAlCarrito = comprar;
    cerrar(!irAlCarrito);
    if (irAlCarrito) abrirCarrito();
    else showToast(`Listo: ${nombreP} ya está en tu carrito.`);
  });
  document.addEventListener('keydown', e => {
    if (!abierto) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(dlg, e);
  });
  QV.abrir = abrir;
  QV.cerrar = cerrar;
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { QV.abrir(quick.dataset.quick, { disparador: quick }); return; }
    const stepper = e.target.closest('[data-stepper]');
    if (stepper) {
      const card = stepper.closest('.card');
      const p = getProducto(card?.dataset.id);
      const span = stepper.querySelector('[data-qty]');
      const actual = Number(span.textContent) || 1;
      if (e.target.closest('[data-menos]')) span.textContent = Math.max(1, actual - 1);
      if (e.target.closest('[data-mas]')) span.textContent = Math.min(p?.stock || 99, actual + 1);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.comprar;
    const p = getProducto(id);
    if (!p) return;
    const card = add.closest('.card');
    const span = card?.querySelector('[data-qty]');
    const qty = Number(span?.textContent) || 1;
    const comprar = add.hasAttribute('data-comprar');
    if (necesitaTalle(p) || necesitaColor(p)) {
      QV.abrir(id, { qty, elegir: true, comprar, disparador: add });
      return;
    }
    Cart.add(p, qty, p.talles[0], p.colores[0]);
    if (span) span.textContent = '1';
    if (comprar) abrirCarrito();
    else showToast(`Listo: ${p.nombre} ya está en tu carrito.`);
  });
}

let abrirCarrito = () => {};

function initCarrito() {
  const drawer = document.getElementById('carrito');
  const bd = document.querySelector('[data-cart-backdrop]');
  if (!drawer) return;
  const lineas = drawer.querySelector('[data-cart-lineas]');
  const vacio = drawer.querySelector('[data-cart-vacio]');
  const foot = drawer.querySelector('[data-cart-foot]');
  const totalEl = drawer.querySelector('[data-cart-total]');
  const resumen = drawer.querySelector('[data-cart-resumen]');
  const wsp = drawer.querySelector('[data-cart-wsp]');
  let abierto = false;
  let disparador = null;
  let cierre = 0;
  const trash = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M9 7V4.5h6V7M6 7l1 13h10l1-13"/></svg>';
  const variante = (p, it) => {
    const t = !it.talle || it.talle === 'Único' ? 'Talle único' : `Talle ${it.talle}`;
    return necesitaColor(p) && it.color ? `${t} · ${COLORES[it.color]}` : t;
  };
  const render = () => {
    const items = Cart.get().filter(it => getProducto(it.id));
    const n = items.reduce((s, i) => s + i.qty, 0);
    resumen.textContent = n ? `(${n})` : '';
    vacio.hidden = items.length > 0;
    lineas.hidden = items.length === 0;
    foot.hidden = items.length === 0;
    lineas.innerHTML = items.map(it => {
      const p = getProducto(it.id);
      const clave = esc(claveLinea(it));
      return `<div class="linea-cart">
        <div class="linea-cart-foto"><img src="${IMG(p, 600)}" width="600" height="750" alt="${esc(p.alt)}"></div>
        <div class="linea-cart-info">
          <p class="linea-cart-nombre">${esc(p.nombre)}</p>
          <p class="linea-cart-var">${esc(variante(p, it))}</p>
          <p class="precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
          <div class="linea-cart-fila">
            <div class="stepper">
              <button type="button" data-linea-menos="${clave}" aria-label="Restar una unidad">−</button>
              <span>${it.qty}</span>
              <button type="button" data-linea-mas="${clave}" aria-label="Sumar una unidad">+</button>
            </div>
            <button type="button" class="linea-cart-quitar" data-linea-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${trash}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const total = Cart.total();
    totalEl.textContent = formatearPrecio(total);
    const texto = [
      'Hola Punto & Aparte, quiero hacer este pedido:',
      '',
      ...items.map(it => { const p = getProducto(it.id); return `${it.qty}x ${p.nombre} | ${variante(p, it)} | ${formatearPrecio(precioFinal(p) * it.qty)}`; }),
      '',
      `Total: ${formatearPrecio(total)}`,
      '¿Me confirman disponibilidad y cómo seguimos?',
    ];
    wsp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto.join('\n'))}`;
  };
  const abrir = () => {
    if (abierto) return;
    clearTimeout(cierre);
    disparador = document.activeElement;
    render();
    drawer.hidden = false;
    if (bd) bd.hidden = false;
    drawer.classList.add('is-entrando');
    void drawer.offsetWidth;
    drawer.classList.add('open');
    bd?.classList.add('open');
    abierto = true;
    bloquear('carrito', true);
    drawer.querySelector('[data-cerrar-carrito]')?.focus({ preventScroll: true });
    setTimeout(() => drawer.classList.remove('is-entrando'), 900);
  };
  const cerrar = (devolverFoco = true) => {
    if (!abierto) return;
    abierto = false;
    drawer.classList.remove('open');
    bd?.classList.remove('open');
    bloquear('carrito', false);
    cierre = setTimeout(() => { drawer.hidden = true; if (bd) bd.hidden = true; }, reduceMotion ? 0 : 400);
    if (devolverFoco && disparador?.isConnected) disparador.focus({ preventScroll: true });
  };
  abrirCarrito = abrir;
  document.addEventListener('click', e => {
    if (e.target.closest('[data-abrir-carrito]')) abrir();
  });
  drawer.addEventListener('click', e => {
    const menos = e.target.closest('[data-linea-menos]');
    const mas = e.target.closest('[data-linea-mas]');
    const quitar = e.target.closest('[data-linea-quitar]');
    if (menos || mas) {
      const clave = (menos || mas).dataset.lineaMenos || (menos || mas).dataset.lineaMas;
      const it = Cart.get().find(i => claveLinea(i) === clave);
      if (it) Cart.setQty(clave, it.qty + (mas ? 1 : -1));
      return;
    }
    if (quitar) { Cart.remove(quitar.dataset.lineaQuitar); return; }
    if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const cerrarBtn = e.target.closest('[data-cerrar-carrito]');
    if (cerrarBtn) {
      const irTienda = cerrarBtn.hasAttribute('data-ir-tienda');
      cerrar(!irTienda);
      if (irTienda) irATienda();
    }
  });
  bd?.addEventListener('click', () => cerrar());
  document.addEventListener('keydown', e => {
    if (!abierto) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(drawer, e);
  });
  document.addEventListener('cart:updated', () => { if (abierto) render(); });
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
  cart?.addEventListener('click', () => abrirCarrito());
  sync();
}

function initDiaNoche() {
  const sec = document.querySelector('.dn');
  if (!sec) return;
  const escena = sec.querySelector('.dn-escena');
  const hora = sec.querySelector('[data-dn-hora]');
  const linea = sec.querySelector('.dn-linea');
  const fotoA = sec.querySelector('.dn-a .dn-foto img');
  const fotoB = sec.querySelector('.dn-b .dn-foto img');
  const ctaA = sec.querySelector('.dn-a .btn');
  const ctaB = sec.querySelector('.dn-b .btn');
  if (reduceMotion) { sec.classList.add('is-estatica'); return; }
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const tramo = (p, a, b) => clamp01((p - a) / (b - a));
  const suave = t => t * t * (3 - 2 * t);
  const mezcla = (a, b, t) => a + (b - a) * t;
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const tope = parseFloat(window.getComputedStyle(escena).top) || 0;
    const total = r.height - (window.innerHeight - tope);
    return total > 0 ? clamp01((tope - r.top) / total) : 0;
  };
  let ultimaHora = '';
  const pintar = p => {
    const w = mezcla(108, -8, suave(tramo(p, 0.06, 0.8)));
    escena.style.setProperty('--w', w.toFixed(2));
    const t = clamp01((108 - w) / 116);
    const mins = Math.round((540 + t * 720) / 10) * 10;
    const txt = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    if (txt !== ultimaHora) { hora.textContent = txt; ultimaHora = txt; }
    linea.style.opacity = w > 104 || w < -4 ? '0' : '1';
    if (fotoA) fotoA.style.transform = `scale(${mezcla(1.22, 1.32, p).toFixed(4)})`;
    if (fotoB) fotoB.style.transform = `scale(${mezcla(1.46, 1.32, suave(tramo(p, 0.2, 0.95))).toFixed(4)})`;
    if (ctaA) ctaA.tabIndex = w > 40 ? 0 : -1;
    if (ctaB) ctaB.tabIndex = w < 60 ? 0 : -1;
  };
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; pintar(progreso()); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pedir);
  pintar(progreso());
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initDeepLink() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (!slug) return;
  const p = PRODUCTOS.find(x => x.slug === slug);
  if (p) QV.abrir(p.id, { disparador: document.querySelector('.brand') });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

initModelBarScroll();
initTopH();
initEstado();
initCuentas();
renderRail();
renderCatalogo();
initReveals();
initNav();
initHeroMotion();
initParallax();
initRail();
initCatalogo();
initFiltros();
initQuickView();
initTarjetas();
initCarrito();
initFloats();
initDiaNoche();
initWspLinks();
initAnio();
updateCartBadge();
initDeepLink();
