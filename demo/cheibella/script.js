const WSP = '5491168761234';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const r = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const CATEGORIAS = [
  { id: 'no-caminantes', nombre: 'No caminantes', talles: [15, 18], img: 'images/cat-no-caminantes.webp' },
  { id: 'ninos', nombre: 'Niños', talles: [19, 34], img: 'images/cat-ninos.webp' },
  { id: 'adolescentes', nombre: 'Adolescentes', talles: [35, 40], img: 'images/cat-adolescentes.webp' },
  { id: 'adultos', nombre: 'Adultos', talles: [35, 45], img: 'images/cat-adultos.webp' },
  { id: 'papeleria', nombre: 'Papelería', talles: null, img: 'images/cat-papeleria.webp' }
];

const TIPOS = {
  zapatillas: 'Zapatillas', sandalias: 'Sandalias', guillerminas: 'Guillerminas', botitas: 'Botitas',
  mocasines: 'Mocasines', panchas: 'Panchas', pantuflas: 'Pantuflas',
  cuadernos: 'Cuadernos y libretas', cartucheras: 'Cartucheras', escritura: 'Escritura', notas: 'Notas adhesivas'
};

const PRODUCTOS = [
  { id: 'botita-corderoy', cod: '1101', nombre: 'Botita de corderoy con corderito', cat: 'no-caminantes', tipo: 'botitas', color: 'Camel', talles: r(15, 18), precio: 12900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-b1.webp', amb: 'images/etapa-bebes.webp', desc: 'Corderoy suave con cuello de corderito y cordón de algodón. Suela flexible para los que todavía no caminan.' },
  { id: 'guillermina-lino', cod: '1102', nombre: 'Guillermina de lino con moño', cat: 'no-caminantes', tipo: 'guillerminas', color: 'Rosa', talles: r(15, 18), precio: 11900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-b2.webp', amb: 'images/etapa-bebes.webp', desc: 'Lino liviano con moño cosido y abrojo atrás. Plantilla acolchada.' },
  { id: 'zapatilla-lona-bebe', cod: '1103', nombre: 'Zapatilla de lona con elástico', cat: 'no-caminantes', tipo: 'zapatillas', color: 'Verde salvia', talles: r(16, 18), precio: 12500, descuento: 0, stock: 20, nuevo: false, img: 'images/p-b3.webp', amb: 'images/etapa-bebes.webp', desc: 'Lona con cordones elásticos que no se desatan y puntera de goma blanda.' },
  { id: 'guillermina-bordada', cod: '1104', nombre: 'Guillermina bordada con volado', cat: 'no-caminantes', tipo: 'guillerminas', color: 'Blanco', talles: r(15, 17), precio: 13900, descuento: 0, stock: 20, nuevo: true, img: 'images/p-b4.webp', amb: 'images/etapa-bebes.webp', desc: 'Bordado calado y volado de algodón, para bautismos y fiestas.' },
  { id: 'zapatilla-jean', cod: '1105', nombre: 'Zapatilla de jean con doble abrojo', cat: 'no-caminantes', tipo: 'zapatillas', color: 'Azul jean', talles: r(16, 18), precio: 12900, descuento: 15, stock: 20, nuevo: false, img: 'images/p-b5.webp', amb: 'images/etapa-bebes.webp', desc: 'Denim con doble abrojo para calzarla en un segundo y puntera reforzada.' },
  { id: 'mocasin-flecos', cod: '1106', nombre: 'Mocasín con flecos', cat: 'no-caminantes', tipo: 'mocasines', color: 'Suela', talles: r(15, 18), precio: 13500, descuento: 0, stock: 20, nuevo: false, img: 'images/p-b6.webp', amb: 'images/etapa-bebes.webp', desc: 'Símil cuero con flecos y elástico en el tobillo para que no se salga.' },
  { id: 'pantufla-osito', cod: '1107', nombre: 'Pantufla tejida osito', cat: 'no-caminantes', tipo: 'pantuflas', color: 'Celeste', talles: r(15, 18), precio: 9900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-b7.webp', amb: 'images/etapa-bebes.webp', desc: 'Tejido de punto con carita de oso y puño alto que abriga el tobillo.' },
  { id: 'zapatilla-ositos', cod: '1108', nombre: 'Zapatilla estampada con ositos', cat: 'no-caminantes', tipo: 'zapatillas', color: 'Crudo', talles: r(16, 18), precio: 12900, descuento: 0, stock: 3, nuevo: false, img: 'images/p-b8.webp', amb: 'images/etapa-bebes.webp', desc: 'Lona estampada con ositos, cordones elásticos y talonera de tela.' },
  { id: 'zapatilla-deportiva', cod: '2201', nombre: 'Zapatilla deportiva con abrojo', cat: 'ninos', tipo: 'zapatillas', color: 'Lila', talles: r(21, 28), precio: 24900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-n1.webp', amb: 'images/etapa-ninos.webp', desc: 'Capellada de malla respirable, abrojo ancho y suela liviana de goma.' },
  { id: 'zapatilla-lona-nino', cod: '2202', nombre: 'Zapatilla de lona con cordón', cat: 'ninos', tipo: 'zapatillas', color: 'Azul marino', talles: r(22, 34), precio: 21900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-n2.webp', amb: 'images/etapa-ninos.webp', desc: 'La clásica de lona con puntera de goma: va del cole a la plaza.' },
  { id: 'sandalia-troquelada', cod: '2203', nombre: 'Sandalia troquelada con abrojo', cat: 'ninos', tipo: 'sandalias', color: 'Rosa', talles: r(19, 28), precio: 18900, descuento: 20, stock: 20, nuevo: false, img: 'images/p-n3.webp', amb: 'images/etapa-ninos.webp', desc: 'Troquelado de flores, abrojo en el tobillo y plantilla anatómica.' },
  { id: 'zapatilla-trekking', cod: '2204', nombre: 'Zapatilla trekking con abrojo', cat: 'ninos', tipo: 'zapatillas', color: 'Verde oliva', talles: r(24, 34), precio: 27900, descuento: 0, stock: 20, nuevo: true, img: 'images/p-n4.webp', amb: 'images/etapa-ninos.webp', desc: 'Malla y símil gamuza, cordón con abrojo y suela con tacos.' },
  { id: 'zapatilla-pastel', cod: '2205', nombre: 'Zapatilla urbana pastel', cat: 'ninos', tipo: 'zapatillas', color: 'Blanco y pastel', talles: r(27, 34), precio: 26900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-n5.webp', amb: 'images/etapa-ninos.webp', desc: 'Símil cuero con detalles en rosa y celeste, cordones y suela cosida.' },
  { id: 'guillermina-escolar', cod: '2206', nombre: 'Guillermina escolar', cat: 'ninos', tipo: 'guillerminas', color: 'Azul marino', talles: r(26, 34), precio: 23900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-n6.webp', amb: 'images/etapa-ninos.webp', desc: 'La del uniforme: símil cuero, abrojo y suela de goma.' },
  { id: 'zapatilla-tejida-nino', cod: '2207', nombre: 'Zapatilla tejida con elástico', cat: 'ninos', tipo: 'zapatillas', color: 'Gris y rosa', talles: r(23, 30), precio: 22900, descuento: 10, stock: 20, nuevo: false, img: 'images/p-n7.webp', amb: 'images/etapa-ninos.webp', desc: 'Tejido liviano con cordón elástico y abrojo: se la ponen sin ayuda.' },
  { id: 'sandalia-hebillas-nino', cod: '2208', nombre: 'Sandalia de dos hebillas', cat: 'ninos', tipo: 'sandalias', color: 'Suela', talles: r(24, 34), precio: 19900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-n8.webp', amb: 'images/etapa-ninos.webp', desc: 'Plantilla de corcho, dos hebillas regulables y suela de goma.' },
  { id: 'zapatilla-tejida', cod: '3301', nombre: 'Zapatilla tejida liviana', cat: 'adolescentes', tipo: 'zapatillas', color: 'Rosa viejo', talles: r(35, 40), precio: 34900, descuento: 0, stock: 20, nuevo: true, img: 'images/p-t1.webp', amb: 'images/promos.webp', desc: 'Tejido tipo media con cordones y suela gruesa de espuma.' },
  { id: 'zapatilla-bicolor', cod: '3302', nombre: 'Zapatilla urbana bicolor', cat: 'adolescentes', tipo: 'zapatillas', color: 'Blanco y beige', talles: r(35, 40), precio: 36900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-t2.webp', amb: 'images/promos.webp', desc: 'Símil cuero con gamuza beige en la puntera y el talón.' },
  { id: 'zapatilla-lona-clasica', cod: '3303', nombre: 'Zapatilla de lona clásica', cat: 'adolescentes', tipo: 'zapatillas', color: 'Azul', talles: r(35, 40), precio: 29900, descuento: 15, stock: 20, nuevo: false, img: 'images/p-a5.webp', amb: 'images/etapa-adultos.webp', desc: 'Lona resistente con suela blanca vulcanizada, la de todos los días.' },
  { id: 'zapatilla-plataforma', cod: '3304', nombre: 'Zapatilla plataforma con cordón grueso', cat: 'adolescentes', tipo: 'zapatillas', color: 'Rosa y crudo', talles: r(35, 40), precio: 42900, descuento: 0, stock: 4, nuevo: false, img: 'images/p-c1.webp', amb: 'images/etapa-adolescentes.webp', desc: 'Suela plataforma, paneles en rosa y cordón grueso tipo soga.' },
  { id: 'zapatilla-gamuza', cod: '4401', nombre: 'Zapatilla urbana con gamuza', cat: 'adultos', tipo: 'zapatillas', color: 'Blanco', talles: r(35, 44), precio: 39900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-a1.webp', amb: 'images/etapa-adultos.webp', desc: 'Símil cuero blanco con detalles en gamuza y suela de goma cosida.' },
  { id: 'pancha-tejida', cod: '4402', nombre: 'Pancha tejida', cat: 'adultos', tipo: 'panchas', color: 'Azul marino', talles: r(39, 45), precio: 32900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-a2.webp', amb: 'images/etapa-adultos.webp', desc: 'Tejido elástico sin cordones y plantilla acolchada: se pone y se saca en un segundo.' },
  { id: 'mocasin-gamuza', cod: '4403', nombre: 'Mocasín de gamuza', cat: 'adultos', tipo: 'mocasines', color: 'Suela', talles: r(39, 45), precio: 45900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-a3.webp', amb: 'images/etapa-adultos.webp', desc: 'Gamuza con costura a la vista y suela de goma flexible.' },
  { id: 'pancha-lona', cod: '4404', nombre: 'Pancha de lona', cat: 'adultos', tipo: 'panchas', color: 'Beige', talles: r(35, 40), precio: 26900, descuento: 10, stock: 20, nuevo: false, img: 'images/p-a4.webp', amb: 'images/etapa-adultos.webp', desc: 'Lona liviana con elásticos a los costados, para el verano.' },
  { id: 'sandalia-corcho', cod: '4405', nombre: 'Sandalia con hebillas y corcho', cat: 'adultos', tipo: 'sandalias', color: 'Marrón', talles: r(36, 44), precio: 34900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-a6.webp', amb: 'images/etapa-adultos.webp', desc: 'Tiras de símil cuero con hebillas, plantilla de corcho y suela de goma.' },
  { id: 'sandalia-cruzada', cod: '4406', nombre: 'Sandalia cruzada de gamuza', cat: 'adultos', tipo: 'sandalias', color: 'Verde oliva', talles: r(35, 40), precio: 31900, descuento: 0, stock: 20, nuevo: false, img: 'images/p-a7.webp', amb: 'images/etapa-adultos.webp', desc: 'Tiras cruzadas de gamuza, abrojo en el talón y plantilla de corcho.' },
  { id: 'sandalia-brillo', cod: '4407', nombre: 'Sandalia de tiras con brillo', cat: 'adultos', tipo: 'sandalias', color: 'Negro', talles: r(35, 40), precio: 27900, descuento: 0, stock: 20, nuevo: true, img: 'images/p-c2.webp', amb: null, desc: 'Tiras de símil cuero y una de brillo, plantilla acolchada y suela baja.' },
  { id: 'sandalia-cruzada-brillo', cod: '4408', nombre: 'Sandalia cruzada con brillo', cat: 'adultos', tipo: 'sandalias', color: 'Negro', talles: r(35, 40), precio: 28900, descuento: 15, stock: 20, nuevo: false, img: 'images/p-c3.webp', amb: null, desc: 'Tiras anchas cruzadas, una de brillo, y suela baja de goma.' },
  { id: 'cuaderno-anillado', cod: '7001', nombre: 'Cuaderno anillado A5', cat: 'papeleria', tipo: 'cuadernos', color: 'Rosa', talles: [], precio: 6900, descuento: 0, stock: 40, nuevo: false, img: 'images/p-p1.webp', amb: 'images/promos.webp', desc: 'Tapa dura forrada, 80 hojas rayadas y anillado doble metálico.' },
  { id: 'cartuchera-lino', cod: '7002', nombre: 'Cartuchera de lino con cierre', cat: 'papeleria', tipo: 'cartucheras', color: 'Verde', talles: [], precio: 7900, descuento: 0, stock: 40, nuevo: false, img: 'images/p-p2.webp', amb: 'images/promos.webp', desc: 'Lino con cierre metálico y forro interior: entra todo lo del cole.' },
  { id: 'cartuchera-grande', cod: '7003', nombre: 'Cartuchera grande de lino', cat: 'papeleria', tipo: 'cartucheras', color: 'Rosa', talles: [], precio: 8900, descuento: 10, stock: 40, nuevo: false, img: 'images/p-p3.webp', amb: 'images/promos.webp', desc: 'Doble capacidad, cierre metálico y base reforzada.' },
  { id: 'set-boligrafos', cod: '7004', nombre: 'Set de 3 bolígrafos', cat: 'papeleria', tipo: 'escritura', color: 'Pastel', talles: [], precio: 4900, descuento: 0, stock: 40, nuevo: false, img: 'images/p-p4.webp', amb: 'images/promos.webp', desc: 'Tinta azul de trazo fino y cuerpo metalizado en tres colores.' },
  { id: 'notas-adhesivas', cod: '7005', nombre: 'Taco de notas adhesivas', cat: 'papeleria', tipo: 'notas', color: 'Rosa', talles: [], precio: 2400, descuento: 0, stock: 40, nuevo: false, img: 'images/p-p5.webp', amb: 'images/promos.webp', desc: '100 hojas de 7,5 × 7,5 cm con adhesivo que se despega sin romper.' },
  { id: 'libreta-floral', cod: '7006', nombre: 'Set libreta floral y block', cat: 'papeleria', tipo: 'cuadernos', color: 'Floral', talles: [], precio: 5900, descuento: 0, stock: 40, nuevo: true, img: 'images/p-p6.webp', amb: 'images/promos.webp', desc: 'Libreta de tapa estampada con un block de hojas lisas.' }
];

const DESTACADOS = ['sandalia-cruzada-brillo', 'sandalia-troquelada', 'zapatilla-jean', 'zapatilla-plataforma', 'zapatilla-trekking', 'mocasin-gamuza'];

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const rangoTalles = p => p.talles.length ? (p.talles.length > 1 ? `${p.talles[0]} al ${p.talles[p.talles.length - 1]}` : `${p.talles[0]}`) : '';
const rangoCorto = p => p.talles.length ? `${p.talles[0]}–${p.talles[p.talles.length - 1]}` : '';
const unidad = (p, n) => p.talles.length ? (n === 1 ? 'par' : 'pares') : (n === 1 ? 'unidad' : 'unidades');
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

const Cart = {
  KEY: 'cheibella_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = null) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.talle ?? null) === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.talle ?? null) === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle ?? null) === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function prepararDatos() {
  const grupos = CATEGORIAS.map(c => PRODUCTOS.filter(p => p.cat === c.id));
  let n = 0;
  for (let i = 0; grupos.some(g => g[i]); i++) grupos.forEach(g => { if (g[i]) g[i]._orden = n++; });
  PRODUCTOS.forEach(p => {
    p._busca = norm([p.nombre, p.color, nombreCat(p.cat), TIPOS[p.tipo], 'mod ' + p.cod, p.cod, p.desc, p.talles.length ? 'talle ' + p.talles.join(' ') : ''].join(' '));
  });
  document.querySelectorAll('[data-n-promos]').forEach(el => { el.textContent = PRODUCTOS.filter(p => p.descuento > 0).length; });
  document.querySelectorAll('[data-n-cat]').forEach(el => { el.textContent = PRODUCTOS.filter(p => p.cat === el.dataset.nCat).length; });
}

const estado = { q: '', cats: new Set(), tipos: new Set(), talle: null, precio: '', promo: false, orden: 'destacados', visibles: 16 };

function filtrar() {
  const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cats.size && !estado.cats.has(p.cat)) return false;
    if (estado.tipos.size && !estado.tipos.has(p.tipo)) return false;
    if (estado.talle && !p.talles.includes(estado.talle)) return false;
    if (estado.promo && !(p.descuento > 0)) return false;
    if (estado.precio) {
      const [min, max] = estado.precio.split('-').map(Number);
      const v = precioFinal(p);
      if ((min > 0 && v <= min) || v > max) return false;
    }
    if (palabras.length && !palabras.every(w => p._busca.includes(w))) return false;
    return true;
  });
  const orden = {
    destacados: (a, b) => a._orden - b._orden,
    menor: (a, b) => precioFinal(a) - precioFinal(b),
    mayor: (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es')
  }[estado.orden] || ((a, b) => a._orden - b._orden);
  return lista.sort(orden);
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<p class="precio precio--promo"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`
    : `<p class="precio"><b>${formatearPrecio(p.precio)}</b></p>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--promo">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.stock <= 5) b.push('<span class="badge badge--ultimas">Últimos pares</span>');
  return b.join('');
}

function stepperHTML(p) {
  return `<div class="stepper" data-stepper data-max="${p.stock ?? 99}"><button type="button" data-paso="-1" aria-label="Restar uno" disabled>−</button><output aria-label="Cantidad">1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

function cardHTML(p, variante = 'subir') {
  const anim = variante === 'der' ? 'data-animate="der" style="opacity:0;transform:translateX(64px)"' : variante === 'nada' ? '' : 'data-animate="subir" style="opacity:0;transform:translateY(44px)"';
  return `<li class="card-wrap" ${anim}>
    <article class="card" data-id="${p.id}">
      <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        <img src="${BASE}${p.img}" width="560" height="560" alt="${esc(p.nombre)}, color ${esc(p.color.toLowerCase())}">
        <span class="card__badges">${badgesHTML(p)}</span>
        <span class="card__etiqueta"><b>MOD. ${p.cod}</b><span>${p.talles.length ? 'T ' + rangoCorto(p) : 'Unidad'}</span></span>
      </button>
      <div class="card__cuerpo">
        <h3 class="card__nombre">${esc(p.nombre)}</h3>
        ${precioHTML(p)}
        <div class="prod-actions">
          ${stepperHTML(p)}
          <button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar<span class="lbl-mas">&nbsp;al carrito</span></button>
        </div>
        <button type="button" class="btn btn--line prod-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </article>
  </li>`;
}

function filaHTML(p, animar = true) {
  const anim = animar ? 'data-animate="subir" style="opacity:0;transform:translateY(24px)"' : '';
  const talle = p.talles.length
    ? `<label class="fila__talle"><span class="sr-only">Talle de ${esc(p.nombre)}</span><select class="select" data-talle-sel><option value="">Talle</option>${p.talles.map(t => `<option value="${t}"${estado.talle === t ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`
    : '<p class="fila__unidad">Por unidad</p>';
  return `<li class="fila-wrap" ${anim}>
    <article class="fila" data-id="${p.id}">
      <button type="button" class="fila__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${BASE}${p.img}" width="560" height="560" alt="${esc(p.nombre)}, color ${esc(p.color.toLowerCase())}"></button>
      <div class="fila__info">
        <h3 class="fila__nombre">${esc(p.nombre)}</h3>
        <p class="fila__meta"><span>MOD. ${p.cod} · ${esc(p.color)}${p.talles.length ? ' · Talles ' + rangoTalles(p) : ''}</span>${badgesHTML(p)}</p>
      </div>
      ${talle}
      <div class="fila__precio">${precioHTML(p)}<small>${p.talles.length ? 'por par' : 'por unidad'}</small></div>
      ${stepperHTML(p)}
      <button type="button" class="btn btn--cta fila__add" data-add="${p.id}">Agregar</button>
    </article>
  </li>`;
}

function render(opciones = {}) {
  const lista = filtrar();
  const grilla = document.getElementById('grilla');
  const filas = document.getElementById('filas');
  const cont = grilla || filas;
  if (!cont) return;
  const desde = opciones.agregar ? cont.children.length : 0;
  const hasta = Math.min(estado.visibles, lista.length);
  const html = lista.slice(desde, hasta).map(p => grilla ? cardHTML(p) : filaHTML(p)).join('');
  if (opciones.agregar) cont.insertAdjacentHTML('beforeend', html);
  else cont.innerHTML = html;
  document.querySelectorAll('[data-n-res]').forEach(el => { el.textContent = lista.length; });
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const cab = document.querySelector('.filas__cab');
  if (cab) cab.hidden = lista.length === 0;
  const verMas = document.getElementById('verMas');
  if (verMas) {
    const resto = lista.length - hasta;
    verMas.hidden = resto <= 0;
    verMas.textContent = `Ver ${Math.min(16, resto)} modelos más`;
  }
  sincronizarFiltros();
  revelarNuevos(cont);
  refrescar();
}

function initFiltrosUI() {
  const fCats = document.getElementById('fCats');
  if (fCats) fCats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"> ${esc(c.nombre)} <span class="n">${PRODUCTOS.filter(p => p.cat === c.id).length}</span></label>`).join('');
  const fTipos = document.getElementById('fTipos');
  if (fTipos) fTipos.innerHTML = Object.entries(TIPOS).map(([id, nombre]) => `<label class="check"><input type="checkbox" data-f="tipo" value="${id}"> ${esc(nombre)} <span class="n">${PRODUCTOS.filter(p => p.tipo === id).length}</span></label>`).join('');
  const fTalle = document.getElementById('fTalle');
  if (fTalle) {
    const grupo = (label, a, b) => `<optgroup label="${label}">${r(a, b).map(t => `<option value="${t}">Talle ${t}</option>`).join('')}</optgroup>`;
    fTalle.innerHTML = '<option value="">Todos los talles</option>' + grupo('Bebés', 15, 18) + grupo('Chicos', 19, 34) + grupo('Adolescentes y adultos', 35, 45);
    fTalle.addEventListener('change', () => { estado.talle = fTalle.value ? Number(fTalle.value) : null; estado.visibles = 16; render(); });
  }
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f="cat"]')) { t.checked ? estado.cats.add(t.value) : estado.cats.delete(t.value); estado.visibles = 16; render(); }
    if (t.matches('input[data-f="tipo"]')) { t.checked ? estado.tipos.add(t.value) : estado.tipos.delete(t.value); estado.visibles = 16; render(); }
    if (t.matches('input[name="precio"]')) { estado.precio = t.value; estado.visibles = 16; render(); }
    if (t.id === 'fPromo') { estado.promo = t.checked; estado.visibles = 16; render(); }
    if (t.id === 'orden') { estado.orden = t.value; estado.visibles = 16; render(); }
    if (t.matches('[data-talle-sel]')) t.closest('.fila__talle')?.classList.remove('falta');
  });
  const q = document.getElementById('q');
  if (q) {
    let timer = 0;
    q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { estado.q = q.value.trim(); estado.visibles = 16; render(); }, 160); });
    q.closest('form')?.addEventListener('submit', e => {
      e.preventDefault(); clearTimeout(timer); estado.q = q.value.trim(); estado.visibles = 16; render();
      if (esModelo2) irA('#solapas');
    });
  }
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += 16; render({ agregar: true }); });
}

function sincronizarFiltros() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.has(i.value); });
  document.querySelectorAll('input[data-f="tipo"]').forEach(i => { i.checked = estado.tipos.has(i.value); });
  document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  const fTalle = document.getElementById('fTalle'); if (fTalle) fTalle.value = estado.talle ? String(estado.talle) : '';
  const fPromo = document.getElementById('fPromo'); if (fPromo) fPromo.checked = estado.promo;
  const orden = document.getElementById('orden'); if (orden) orden.value = estado.orden;
  const q = document.getElementById('q'); if (q && document.activeElement !== q) q.value = estado.q;
  document.querySelectorAll('[data-solapa]').forEach(b => {
    const v = b.dataset.solapa;
    const on = v === 'promos' ? estado.promo && !estado.cats.size : v === '' ? !estado.cats.size && !estado.promo : estado.cats.size === 1 && estado.cats.has(v);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const activos = document.getElementById('activos');
  if (!activos) return;
  const x = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  const chips = [];
  if (!esModelo2) estado.cats.forEach(c => chips.push([`cat:${c}`, nombreCat(c)]));
  estado.tipos.forEach(t => chips.push([`tipo:${t}`, TIPOS[t]]));
  if (estado.talle) chips.push(['talle', `Talle ${estado.talle}`]);
  if (estado.precio) chips.push(['precio', document.querySelector(`input[name="precio"][value="${estado.precio}"]`)?.parentElement.textContent.trim() || 'Precio']);
  if (estado.promo && !esModelo2) chips.push(['promo', 'Solo promos']);
  if (estado.q) chips.push(['q', `“${estado.q}”`]);
  activos.innerHTML = chips.map(([k, t]) => `<button type="button" class="activo" data-quitar="${esc(k)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${x}</button>`).join('');
}

function quitarFiltro(k) {
  if (k.startsWith('cat:')) estado.cats.delete(k.slice(4));
  else if (k.startsWith('tipo:')) estado.tipos.delete(k.slice(5));
  else if (k === 'talle') estado.talle = null;
  else if (k === 'precio') estado.precio = '';
  else if (k === 'promo') estado.promo = false;
  else if (k === 'q') estado.q = '';
  estado.visibles = 16;
  render();
}

function limpiarFiltros() {
  Object.assign(estado, { q: '', talle: null, precio: '', promo: false, visibles: 16 });
  estado.cats.clear(); estado.tipos.clear();
  render();
}

function irA(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offModelos() - 8;
  window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function aplicarCategoria(cat) {
  estado.cats = new Set([cat]);
  estado.tipos.clear(); estado.promo = false; estado.q = ''; estado.precio = ''; estado.visibles = 16;
  if (estado.talle && !PRODUCTOS.some(p => p.cat === cat && p.talles.includes(estado.talle))) estado.talle = null;
  render();
  setTimeout(() => irA(esModelo2 ? '#solapas' : '#tienda'), 0);
}

function aplicarPromos() {
  estado.cats.clear(); estado.tipos.clear(); estado.q = ''; estado.precio = ''; estado.talle = null; estado.promo = true; estado.visibles = 16;
  render();
  setTimeout(() => irA(esModelo2 ? '#solapas' : '#tienda'), 0);
}

function aplicarTalle(t) {
  estado.cats.clear(); estado.tipos.clear(); estado.q = ''; estado.precio = ''; estado.promo = false; estado.talle = t; estado.visibles = 16;
  render();
  setTimeout(() => irA(esModelo2 ? '#solapas' : '#tienda'), 0);
}

function initCirculos() {
  const ul = document.getElementById('circulos');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
      <a class="circulo" href="#tienda" data-cat="${c.id}">
        <span class="circulo__foto"><img src="${c.img}" width="440" height="440" alt=""></span>
        <span class="circulo__nombre">${esc(c.nombre)}</span>
        <span class="circulo__dato">${c.talles ? `Talles ${c.talles[0]} al ${c.talles[1]}` : 'Útiles y cuadernos'}</span>
      </a>
    </li>`).join('');
}

function initSolapas() {
  const cont = document.getElementById('solapas');
  if (!cont) return;
  const anim = 'data-animate="subir" style="opacity:0;transform:translateY(24px)"';
  cont.innerHTML = `<button type="button" class="solapa solapa--sin-foto" data-solapa="" aria-pressed="true" ${anim}>Todo <span class="n">${PRODUCTOS.length}</span></button>`
    + CATEGORIAS.map(c => `<button type="button" class="solapa" data-solapa="${c.id}" aria-pressed="false" ${anim}><img src="${c.img}" width="440" height="440" alt="">${esc(c.nombre)} <span class="n">${PRODUCTOS.filter(p => p.cat === c.id).length}</span></button>`).join('')
    + `<button type="button" class="solapa" data-solapa="promos" aria-pressed="false" ${anim}><img src="images/cat-promos.webp" width="440" height="440" alt="">Promos <span class="n">${PRODUCTOS.filter(p => p.descuento > 0).length}</span></button>`;
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-solapa]');
    if (!b) return;
    const v = b.dataset.solapa;
    estado.cats.clear(); estado.promo = false; estado.visibles = 16;
    if (v === 'promos') estado.promo = true;
    else if (v) {
      estado.cats.add(v);
      if (estado.talle && !PRODUCTOS.some(p => p.cat === v && p.talles.includes(estado.talle))) estado.talle = null;
    }
    render();
  });
}

function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS.map(getProducto).filter(Boolean).map(p => cardHTML(p, 'der')).join('');
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('button:not([data-quick]), select, input')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
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

function initRailFlechas() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  if (!vp || !track || !prev || !next) return;
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  sync();
}

function initPromoRot() {
  const box = document.getElementById('promoRot');
  if (!box) return;
  const msgs = [...box.querySelectorAll('.hb__msg')];
  const dots = [...box.querySelectorAll('.hb__dots i')];
  const MS = 5500;
  let i = 0, timer = 0, inicio = 0, restante = MS, pausa = false;
  const programar = ms => {
    clearTimeout(timer);
    if (reduceMotion || pausa) return;
    inicio = performance.now(); restante = ms;
    timer = setTimeout(() => ir(i + 1), ms);
  };
  const ir = n => {
    i = (n + msgs.length) % msgs.length;
    msgs.forEach((m, k) => m.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => { d.classList.remove('is-on'); d.classList.toggle('is-done', k < i); });
    void box.offsetWidth;
    dots[i]?.classList.add('is-on');
    programar(MS);
  };
  const pausar = () => { if (pausa) return; pausa = true; box.classList.add('is-pausa'); clearTimeout(timer); restante = Math.max(400, restante - (performance.now() - inicio)); };
  const seguir = () => { if (!pausa) return; pausa = false; box.classList.remove('is-pausa'); programar(restante); };
  box.addEventListener('mouseenter', pausar);
  box.addEventListener('mouseleave', seguir);
  box.addEventListener('focusin', pausar);
  box.addEventListener('focusout', seguir);
  document.querySelector('[data-promo-prev]')?.addEventListener('click', () => ir(i - 1));
  document.querySelector('[data-promo-next]')?.addEventListener('click', () => ir(i + 1));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausar(); else seguir(); });
  box.style.setProperty('--promo-ms', `${MS}ms`);
  programar(MS);
}

function initEtapas() {
  const track = document.getElementById('etapasTrack');
  if (!track) return;
  const escena = track.querySelector('.etapas__escena');
  const imgs = [...track.querySelectorAll('.etapas__img')];
  const textos = [...track.querySelectorAll('.etapa')];
  const numero = document.getElementById('etapaTalle');
  const meta = document.getElementById('etapaMeta');
  const cta = document.getElementById('etapaCta');
  const cinta = track.querySelector('.cinta-m');
  const tira = document.getElementById('etapasTira');
  if (!escena || !cinta || !tira) return;
  const ETAPAS = [[15, 18, 'Bebés'], [19, 34, 'Niños'], [35, 40, 'Adolescentes'], [41, 45, 'Adultos']];
  const N = Math.min(textos.length, ETAPAS.length);
  tira.innerHTML = r(15, 45).map(t => {
    const e = ETAPAS.find(x => x[0] === t);
    return `<span class="cinta-m__celda" data-t="${t}">${e ? `<em>${e[2]}</em>` : ''}<b>${t}</b></span>`;
  }).join('');
  const celdas = [...tira.children];
  const cuantos = t => PRODUCTOS.filter(p => p.talles.includes(t)).length;
  let etapa = -1, talle = 0;
  const activar = (i, t) => {
    if (i !== etapa) {
      etapa = i;
      imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
      textos.forEach((x, k) => { x.classList.toggle('is-on', k === i); x.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    }
    if (t !== talle) {
      talle = t;
      const n = cuantos(t);
      if (numero) numero.textContent = t;
      if (meta) meta.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'} en talle ${t}`;
      if (cta) { cta.textContent = n === 1 ? `Ver el modelo en talle ${t}` : `Ver los ${n} modelos en talle ${t}`; cta.dataset.talleIr = t; }
      celdas.forEach(c => c.classList.toggle('is-on', Number(c.dataset.t) === t));
    }
  };
  let frame = 0;
  const calcular = () => {
    frame = 0;
    const total = Math.max(1, track.offsetHeight - escena.offsetHeight);
    const p = Math.min(1, Math.max(0, (offModelos() - track.getBoundingClientRect().top) / total));
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    const local = Math.min(1, Math.max(0, p * N - i));
    const [a, b] = ETAPAS[i];
    const idx = Math.min(30.999, (a - 15) + local * (b - a + 1));
    activar(i, Math.min(45, 15 + Math.floor(idx)));
    const ancho = celdas[0]?.getBoundingClientRect().width || 72;
    const x = cinta.clientWidth / 2 - Math.max(.5, idx) * ancho;
    tira.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    if (!reduceMotion && imgs[i]) imgs[i].style.transform = `scale(${(1.06 - local * 0.06).toFixed(4)})`;
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(calcular); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  window.addEventListener('load', calcular);
  calcular();
}

const ESCALAS = {
  bebes: { talles: r(15, 18), cm: [9, 12], holgura: 1, para: 'un bebé', etiquetas: [15, 16, 17, 18], marcasCm: [9, 10, 11, 12] },
  chicos: { talles: r(19, 34), cm: [11.5, 22.5], holgura: 1, para: 'un chico', etiquetas: [19, 22, 25, 28, 31, 34], marcasCm: [12, 14, 16, 18, 20, 22] },
  grandes: { talles: r(35, 45), cm: [22, 30], holgura: 0.5, para: 'un adolescente o adulto', etiquetas: [35, 37, 39, 41, 43, 45], marcasCm: [22, 24, 26, 28, 30] }
};
const talleDesdePie = (cm, esc) => Math.min(esc.talles[esc.talles.length - 1], Math.max(esc.talles[0], Math.ceil((cm + esc.holgura) * 1.5 - 1e-9)));

function initTalle() {
  const card = document.querySelector('.talle__card');
  if (!card) return;
  const segs = [...card.querySelectorAll('.seg input[name="escala"]')];
  const chips = document.getElementById('talleChips');
  const pie = document.getElementById('pie');
  const pieVal = document.getElementById('pieVal');
  const reco = document.getElementById('talleReco');
  const recoTxt = reco?.previousElementSibling;
  const ver = document.getElementById('talleVer');
  const wsp = document.getElementById('talleWsp');
  const talles = document.getElementById('cintaTalles');
  const cms = document.getElementById('cintaCm');
  const st = { escala: 'chicos', talle: null, modo: 'cinta' };
  const pos = (cm, esc) => ((cm - esc.cm[0]) / (esc.cm[1] - esc.cm[0])) * 100;
  const cmTexto = cm => `${String(cm).replace('.', ',')} cm`;
  const pintarEscala = () => {
    const esc = ESCALAS[st.escala];
    chips.innerHTML = esc.talles.map(t => `<button type="button" class="talle-chip" role="radio" aria-checked="false" data-talle="${t}">${t}</button>`).join('');
    pie.min = esc.cm[0]; pie.max = esc.cm[1];
    const medio = Math.round(((esc.cm[0] + esc.cm[1]) / 2) * 2) / 2;
    pie.value = medio;
    talles.innerHTML = esc.etiquetas.map(t => {
      const cm = Math.min(esc.cm[1], Math.max(esc.cm[0], (t - 0.5) / 1.5 - esc.holgura));
      return `<b style="left:${pos(cm, esc).toFixed(2)}%">${t}</b>`;
    }).join('');
    cms.innerHTML = esc.marcasCm.map(cm => `<b style="left:${pos(cm, esc).toFixed(2)}%">${cm}</b>`).join('');
    segs.forEach(s => { s.checked = s.value === st.escala; });
    st.modo = 'cinta';
    actualizar();
  };
  const actualizar = () => {
    const esc = ESCALAS[st.escala];
    const cm = Number(pie.value);
    pieVal.textContent = cmTexto(cm);
    if (st.modo === 'cinta') st.talle = talleDesdePie(cm, esc);
    reco.textContent = st.talle;
    if (recoTxt) recoTxt.textContent = st.modo === 'cinta' ? 'Talle recomendado' : 'Talle elegido';
    chips.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-checked', Number(b.dataset.talle) === st.talle ? 'true' : 'false'));
    const n = PRODUCTOS.filter(p => p.talles.includes(st.talle)).length;
    ver.textContent = n === 1 ? `Ver el modelo en talle ${st.talle}` : `Ver los ${n} modelos en talle ${st.talle}`;
    ver.toggleAttribute('aria-disabled', n === 0);
    const texto = st.modo === 'cinta'
      ? `Hola Chei bella! El pie mide ${cmTexto(cm)} y es para ${esc.para}. La web me sugiere talle ${st.talle}, ¿me lo confirmás?`
      : `Hola Chei bella! Busco talle ${st.talle} para ${esc.para}. ¿Qué modelos tienen?`;
    wsp.href = wspLink(texto);
  };
  segs.forEach(s => s.addEventListener('change', () => { if (s.checked) { st.escala = s.value; pintarEscala(); } }));
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-talle]');
    if (!b) return;
    st.talle = Number(b.dataset.talle); st.modo = 'chip';
    actualizar();
  });
  pie.addEventListener('input', () => { st.modo = 'cinta'; actualizar(); });
  ver.addEventListener('click', e => {
    e.preventDefault();
    if (ver.hasAttribute('aria-disabled')) return;
    aplicarTalle(st.talle);
    showToast(`Te mostramos los modelos en talle ${st.talle}`);
  });
  pintarEscala();
  initTalle.elegirEscala = cat => {
    st.escala = cat === 'no-caminantes' ? 'bebes' : cat === 'ninos' ? 'chicos' : 'grandes';
    pintarEscala();
  };
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

function lineasPedido() {
  return Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
}

function textoPedido(intro) {
  const lineas = lineasPedido();
  if (!lineas.length) return `Hola Chei bella! ${intro}`;
  const detalle = lineas.map(i => `• ${i.qty} × ${i.p.nombre} (MOD. ${i.p.cod}${i.talle ? `, talle ${i.talle}` : ''}): ${formatearPrecio(precioFinal(i.p) * i.qty)}`).join('\n');
  return `Hola Chei bella! ${intro}\n${detalle}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function actualizarLinksPedido() {
  document.querySelectorAll('[data-pedido-wsp]').forEach(a => {
    const mayor = a.dataset.pedidoWsp === 'mayor';
    a.href = wspLink(textoPedido(mayor ? 'Quiero el precio por mayor de este pedido:' : 'Quiero hacer este pedido:'));
  });
}

function renderCarrito() {
  const ul = document.getElementById('drawerItems');
  if (!ul) return;
  const lineas = lineasPedido();
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  ul.innerHTML = lineas.map((i, k) => `<li class="d-item" style="animation-delay:${Math.min(k * 0.05, 0.3)}s" data-linea="${i.id}" data-talle="${i.talle ?? ''}">
      <img src="${BASE}${i.p.img}" width="560" height="560" alt="">
      <div class="d-item__info">
        <p class="d-item__nombre">${esc(i.p.nombre)}</p>
        <p class="d-item__meta">MOD. ${i.p.cod}${i.talle ? ` · Talle ${i.talle}` : ''} · ${formatearPrecio(precioFinal(i.p))} c/u</p>
        <div class="d-item__fila">
          <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output aria-label="Cantidad">${i.qty}</output><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= (i.p.stock ?? 99) ? ' disabled' : ''}>+</button></div>
          <p class="d-item__precio">${formatearPrecio(precioFinal(i.p) * i.qty)}</p>
        </div>
        <button type="button" class="d-item__quitar" data-linea-quitar>Quitar</button>
      </div>
    </li>`).join('');
  if (vacio) vacio.hidden = lineas.length > 0;
  if (pie) pie.hidden = lineas.length === 0;
  const n = Cart.count();
  const drawerN = document.getElementById('drawerN');
  if (drawerN) drawerN.textContent = n ? `(${n})` : '';
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function renderPedido() {
  const ul = document.getElementById('pedidoLineas');
  if (!ul) return;
  const lineas = lineasPedido();
  ul.innerHTML = lineas.map(i => `<li class="pedido__linea"><b>${esc(i.p.nombre)}</b><em>${formatearPrecio(precioFinal(i.p) * i.qty)}</em><span>${i.qty} ${unidad(i.p, i.qty)}${i.talle ? ` · talle ${i.talle}` : ''}</span></li>`).join('');
  const vacio = document.getElementById('pedidoVacio');
  if (vacio) vacio.hidden = lineas.length > 0;
  const total = document.getElementById('pedidoTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

let focoPrevio = null;
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d || !d.hidden) return;
  focoPrevio = document.activeElement;
  renderCarrito();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => { d.classList.add('open'); d.querySelector('.drawer__panel')?.focus(); });
  setTimeout(() => { if (!d.classList.contains('open')) d.classList.add('open'); }, 60);
}

function cerrarCarrito() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  focoPrevio?.focus?.();
}

function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  d.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); focoAtrapado(d, e); });
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const li = e.target.closest('[data-linea]');
    if (!li) return;
    const id = li.dataset.linea;
    const talle = li.dataset.talle ? Number(li.dataset.talle) : null;
    const it = Cart.get().find(x => x.id === id && (x.talle ?? null) === talle);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) Cart.setQty(id, talle, it.qty + Number(paso.dataset.lineaPaso));
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(id, talle);
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (!d.hidden) renderCarrito();
    renderPedido();
    actualizarLinksPedido();
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

let qv = { p: null, talle: null, foto: 0, pedir: false };
function htmlQuick() {
  const p = qv.p;
  const fotos = [p.img, p.amb].filter(Boolean);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const talles = p.talles.length ? `
      <div class="qv__talles-tit"><span>Talle</span><a href="#talle" data-ir-talle="${p.cat}">¿No sabés el talle?</a></div>
      <div class="qv__talles${qv.pedir && !qv.talle ? ' falta' : ''}" role="radiogroup" aria-label="Talle">${p.talles.map(t => `<button type="button" class="talle-chip" role="radio" aria-checked="${qv.talle === t}" data-qv-talle="${t}">${t}</button>`).join('')}</div>
      <p class="qv__aviso"${qv.pedir && !qv.talle ? '' : ' hidden'}>Elegí el talle y lo sumamos al carrito.</p>` : '';
  return `<div class="qv__galeria">
      <div class="qv__foto"><img src="${BASE}${fotos[qv.foto] || p.img}" width="1100" height="1100" alt="${esc(p.nombre)}, color ${esc(p.color.toLowerCase())}"></div>
      ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-pressed="${k === qv.foto}" aria-label="Ver foto ${k + 1}"><img src="${BASE}${f}" width="200" height="200" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__etiqueta">MOD. ${p.cod} · ${esc(p.color)}${p.talles.length ? ' · Talles ' + rangoTalles(p) : ''}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p)}
      <p class="qv__desc">${esc(p.desc)}</p>
      ${talles}
      <div class="qv__acciones">
        ${stepperHTML(p)}
        <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
    </div>
    ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><ul>${rel.map(x => `<li><button type="button" data-quick="${x.id}"><img src="${BASE}${x.img}" width="560" height="560" alt=""><span><b>${esc(x.nombre)}</b>${formatearPrecio(precioFinal(x))}</span></button></li>`).join('')}</ul></div>` : ''}`;
}

function inyectarLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: `MOD-${p.cod}`, color: p.color,
    image: `https://gokywebs.com/demo/cheibella/${p.img}`, description: p.desc, brand: { '@type': 'Brand', name: 'Chei bella' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
}

function abrirQuick(id, opciones = {}) {
  const p = getProducto(id);
  const m = document.getElementById('quick');
  const cont = document.getElementById('qv');
  if (!p || !m || !cont) return;
  const yaAbierto = !m.hidden;
  if (!yaAbierto) focoPrevio = document.activeElement;
  qv = { p, talle: opciones.talle ?? (estado.talle && p.talles.includes(estado.talle) ? estado.talle : null), foto: 0, pedir: !!opciones.pedirTalle };
  cont.innerHTML = htmlQuick();
  inyectarLdProducto(p);
  try { history.replaceState(null, '', `?producto=${encodeURIComponent(p.id)}${location.hash}`); } catch { }
  const panel = m.querySelector('.modal__panel');
  if (panel) panel.scrollTop = 0;
  if (!yaAbierto) {
    m.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => m.classList.add('open'));
    setTimeout(() => { if (!m.classList.contains('open')) m.classList.add('open'); }, 60);
  }
  const foco = qv.pedir && p.talles.length ? cont.querySelector('[data-qv-talle]') : panel;
  setTimeout(() => foco?.focus(), 30);
}

function cerrarQuick() {
  const m = document.getElementById('quick');
  if (!m || m.hidden) return;
  m.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { m.hidden = true; }, reduceMotion ? 0 : 320);
  try { history.replaceState(null, '', location.pathname + location.hash); } catch { }
  focoPrevio?.focus?.();
}

function initQuick() {
  const m = document.getElementById('quick');
  if (!m) return;
  m.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarQuick(); focoAtrapado(m, e); });
  m.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-modal]')) { cerrarQuick(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { qv.foto = Number(foto.dataset.qvFoto); const cont = document.getElementById('qv'); const qty = cont.querySelector('[data-stepper] output')?.textContent; cont.innerHTML = htmlQuick(); if (qty) ponerCantidad(cont.querySelector('[data-stepper]'), Number(qty)); cont.querySelector(`[data-qv-foto="${qv.foto}"]`)?.focus(); return; }
    const t = e.target.closest('[data-qv-talle]');
    if (t) {
      qv.talle = Number(t.dataset.qvTalle);
      m.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-checked', b === t ? 'true' : 'false'));
      m.querySelector('.qv__talles')?.classList.remove('falta');
      const aviso = m.querySelector('.qv__aviso'); if (aviso) aviso.hidden = true;
      return;
    }
    const irTalle = e.target.closest('[data-ir-talle]');
    if (irTalle) { e.preventDefault(); const cat = irTalle.dataset.irTalle; cerrarQuick(); initTalle.elegirEscala?.(cat); setTimeout(() => irA('#talle'), 60); return; }
    const agregarBtn = e.target.closest('[data-qv-agregar], [data-qv-comprar]');
    if (agregarBtn) {
      const p = qv.p;
      if (p.talles.length && !qv.talle) {
        m.querySelector('.qv__talles')?.classList.add('falta');
        const aviso = m.querySelector('.qv__aviso'); if (aviso) aviso.hidden = false;
        m.querySelector('[data-qv-talle]')?.focus();
        return;
      }
      const qty = Number(m.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, qv.talle);
      if (agregarBtn.hasAttribute('data-qv-comprar')) { cerrarQuick(); setTimeout(abrirCarrito, reduceMotion ? 0 : 340); }
      else showToast(`${p.nombre}${qv.talle ? ', talle ' + qv.talle : ''}: ${qty} ${unidad(p, qty)} en el carrito`);
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

function agregarDesde(boton, comprar = false) {
  const id = boton.dataset.add || boton.dataset.buy;
  const p = getProducto(id);
  if (!p) return;
  const caja = boton.closest('.card, .fila');
  const qty = Number(caja?.querySelector('[data-stepper] output')?.textContent) || 1;
  let talle = null;
  if (p.talles.length) {
    const sel = caja?.querySelector('[data-talle-sel]');
    if (sel) {
      talle = sel.value ? Number(sel.value) : null;
      if (!talle) {
        sel.closest('.fila__talle')?.classList.add('falta');
        sel.focus();
        showToast(`Elegí el talle de ${p.nombre}`);
        return;
      }
    } else {
      talle = estado.talle && p.talles.includes(estado.talle) ? estado.talle : null;
      if (!talle) { abrirQuick(p.id, { pedirTalle: true }); return; }
    }
  }
  Cart.add(p, qty, talle);
  ponerCantidad(caja?.querySelector('[data-stepper]'), 1);
  if (comprar) abrirCarrito();
  else showToast(`${p.nombre}${talle ? ', talle ' + talle : ''}: ${qty} ${unidad(p, qty)} en el carrito`);
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
    const buy = t.closest('[data-buy]');
    if (buy) { agregarDesde(buy, true); return; }
    const talleIr = t.closest('[data-talle-ir]');
    if (talleIr) { e.preventDefault(); aplicarTalle(Number(talleIr.dataset.talleIr)); return; }
    const quick = t.closest('[data-quick]');
    if (quick) { abrirQuick(quick.dataset.quick); return; }
    const cat = t.closest('a[data-cat]');
    if (cat) { e.preventDefault(); aplicarCategoria(cat.dataset.cat); return; }
    const promo = t.closest('[data-promo-ir]');
    if (promo) { e.preventDefault(); aplicarPromos(); return; }
    if (t.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (t.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (t.closest('[data-limpiar]')) { limpiarFiltros(); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) { quitarFiltro(quitar.dataset.quitar); return; }
    if (t.closest('[data-ir-buscar]')) {
      irA('#tienda');
      setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 500);
    }
  });
}

function initFiltrosDrawer() {
  const f = document.getElementById('filtros');
  const btn = document.getElementById('abrirFiltros');
  if (!f || !btn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let fondo = document.querySelector('.filtros-fondo');
  if (!fondo) { fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; document.body.appendChild(fondo); }
  const abrir = () => {
    f.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    f.classList.add('open'); fondo.classList.add('open');
    f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(() => f.querySelector('.filtros__cerrar')?.focus(), 40);
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

function initNews() {
  const form = document.getElementById('news');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const error = document.getElementById('newsError');
  const boton = form.querySelector('button[type="submit"]');
  input?.addEventListener('input', () => { input.removeAttribute('aria-invalid'); if (error) error.hidden = true; });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    if (!ok) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'newsError');
      if (error) error.hidden = false;
      input.focus();
      return;
    }
    const texto = boton.textContent;
    boton.disabled = true; boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false; boton.textContent = texto;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuick(id);
}

prepararDatos();
initModelBarScroll();
initCirculos();
initRail();
initSolapas();
initFiltrosUI();
render();
initTalle();
initEtapas();
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
initReveals();
initHeroMotion();
initPromoRot();
initRailDrag(document.getElementById('railVp'));
initRailFlechas();
initNav();
initCarrito();
initFloats();
initQuick();
initFiltrosDrawer();
initNews();
initDelegacion();
updateCartBadge();
renderPedido();
actualizarLinksPedido();
abrirDesdeURL();
