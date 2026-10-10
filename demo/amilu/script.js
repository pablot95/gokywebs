const WHATSAPP_NUMBER = '5491138704242';
const POR_PAGINA = 16;
const PRECIO_TOPE = 300000;
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
  prendas: 'Prendas intervenidas',
  collares: 'Collares',
  aros: 'Aros',
  pulseras: 'Pulseras',
  bolsos: 'Bolsos y bolsitos',
};

const COLORES = {
  crudo: 'Crudo',
  terracota: 'Terracota',
  jean: 'Jean',
  madera: 'Madera',
  negro: 'Negro',
  coral: 'Coral',
  mostaza: 'Mostaza',
  verde: 'Verde agua',
  rojo: 'Rojo',
  multi: 'Multicolor',
};

const PRODUCTOS = [
  { id: 'am01', slug: 'campera-mujer-de-sol', nombre: 'Campera «Mujer de sol»', categoria: 'prendas', tipo: 'Campera', precio: 289000, stock: 1, talle: 'M', colores: ['crudo', 'terracota'], img: 'campera-mujer-de-sol', galeria: ['campera-mujer-de-sol', 'campera-mujer-de-sol-detalle'], tags: ['bordado', 'bordada', 'sol', 'pájaros', 'flores', 'apliques', 'espalda'], materiales: ['Gabardina de algodón cruda', 'Bordado a mano', 'Apliques de tela', 'Hilo dorado'], medidas: { Espalda: '46 cm', Largo: '62 cm', Manga: '60 cm' }, alt: 'Espalda de una campera cruda con una mujer de perfil, un sol y pájaros bordados a mano', desc: 'Una mujer de perfil con flores en el pelo, un sol de hilo en espiral y dos pájaros: toda la espalda bordada a mano. Las mangas siguen con ramas floreadas y los puños cierran con una guarda.' },
  { id: 'am02', slug: 'saco-jardin', nombre: 'Saco «Jardín»', categoria: 'prendas', tipo: 'Saco kimono', precio: 238000, stock: 1, talle: 'Único', colores: ['terracota'], img: 'saco-jardin', tags: ['kimono', 'flores', 'bordado', 'crochet', 'puntilla'], materiales: ['Lienzo teñido terracota', 'Flores bordadas', 'Puntilla tejida al crochet'], medidas: { Espalda: '54 cm', Largo: '70 cm', Manga: '56 cm' }, alt: 'Saco kimono terracota con flores bordadas y bordes de puntilla colgado de una escalera de madera', desc: 'Saco amplio, de corte kimono, con flores bordadas en el frente y la espalda y bordes de puntilla tejida al crochet. Va abierto, sobre lo que tengas puesto.' },
  { id: 'am03', slug: 'campera-pez', nombre: 'Campera de jean «Pez»', categoria: 'prendas', tipo: 'Campera de jean', precio: 196000, stock: 1, talle: 'L', colores: ['jean'], img: 'campera-pez', tags: ['jean', 'denim', 'aplique', 'manga corta', 'pez'], materiales: ['Jean', 'Aplique de jean lavado', 'Pespunte a mano'], medidas: { Espalda: '52 cm', Largo: '66 cm', Manga: '24 cm' }, alt: 'Espalda de una campera de jean de manga corta con un pez grande aplicado en jean más claro', desc: 'Manga corta y un pez enorme en la espalda, recortado en jean más claro y cosido a mano con pespunte visible. Liviana para la media estación.' },
  { id: 'am04', slug: 'campera-retazos', nombre: 'Campera de jean «Retazos»', categoria: 'prendas', tipo: 'Campera de jean', precio: 178000, stock: 0, talle: 'S', colores: ['jean', 'negro'], img: 'campera-patchwork', tags: ['jean', 'denim', 'patchwork', 'retazos', 'estampado'], materiales: ['Jean de dos tonos', 'Retazos estampados', 'Costura a mano y a máquina'], medidas: { Espalda: '42 cm', Largo: '56 cm', Manga: '58 cm' }, alt: 'Campera de jean de dos tonos con retazos estampados en blanco y negro', desc: 'Jean de dos tonos con retazos de estampas en blanco y negro cosidos en el frente y las mangas.' },
  { id: 'am05', slug: 'chaleco-margaritas', nombre: 'Chaleco de jean «Margaritas»', categoria: 'prendas', tipo: 'Chaleco', precio: 142000, stock: 1, talle: 'S', colores: ['jean', 'mostaza'], img: 'chaleco-margaritas', tags: ['jean', 'denim', 'chaleco', 'flores', 'cinta', 'vichy', 'crochet'], materiales: ['Jean', 'Cinta de vichy', 'Centros tejidos al crochet'], medidas: { Espalda: '40 cm', Largo: '52 cm', Sisa: '22 cm' }, alt: 'Chaleco de jean con margaritas de cinta de vichy amarilla, rosa y azul cosidas en el frente', desc: 'Margaritas de cinta de vichy cosidas una por una, con el centro tejido al crochet. Se usa abierto sobre una remera o abrochado como top.' },
  { id: 'am06', slug: 'campera-tapiz', nombre: 'Campera de jean «Tapiz»', categoria: 'prendas', tipo: 'Campera de jean', precio: 264000, stock: 1, talle: 'XL', colores: ['jean', 'multi'], img: 'campera-tapiz', tags: ['jean', 'denim', 'apliques', 'guardas', 'lentejuelas', 'mostacillas', 'espalda', 'tapiz'], materiales: ['Jean', 'Guardas tejidas', 'Cordón dorado y lentejuelas', 'Tapiz de mostacillas'], medidas: { Espalda: '56 cm', Largo: '70 cm', Manga: '62 cm' }, alt: 'Espalda de una campera de jean con guardas tejidas, espirales doradas con lentejuelas y un tapiz de mostacillas', desc: 'Guardas tejidas en los hombros, espirales de cordón dorado con lentejuelas y, en el centro de la espalda, un tapiz de mostacillas con flecos. La más trabajada de la tanda.' },
  { id: 'am07', slug: 'collar-atardecer', nombre: 'Collar «Atardecer» de tres vueltas', categoria: 'collares', tipo: 'Collar', precio: 46000, stock: 2, talle: 'Único', colores: ['madera', 'terracota'], img: 'collar-atardecer', tags: ['borlas', 'medallón', 'cuentas', 'madera'], materiales: ['Cuentas de madera y piedra', 'Borlas de hilo', 'Medallón de metal'], alt: 'Collar de tres vueltas de cuentas de madera con medallón y borlas terracota en un busto de yute', desc: 'Tres vueltas de cuentas de madera y piedra, con un medallón al centro y borlas de hilo terracota. Hace juego con el saco «Jardín».' },
  { id: 'am08', slug: 'collar-rojinegro', nombre: 'Collar largo de cuentas rojinegras', categoria: 'collares', tipo: 'Collar', precio: 24000, stock: 3, talle: 'Único', colores: ['rojo', 'negro'], img: 'collar-rojinegro', tags: ['cuentas', 'largo', 'rojo', 'negro'], materiales: ['Cuentas negras mate', 'Cuentas rojinegras', 'Separadores plateados'], alt: 'Collar largo de cuentas negras mate y cuentas rojinegras sobre un tronco de madera', desc: 'Largo para usar en una vuelta o en dos: cuentas negras mate y cuentas rojinegras con separadores plateados.' },
  { id: 'am09', slug: 'collar-aros-madera', nombre: 'Collar largo de aros de madera', categoria: 'collares', tipo: 'Collar', precio: 32000, stock: 2, talle: 'Único', colores: ['madera', 'mostaza'], img: 'collar-aros-madera', tags: ['madera', 'aros', 'largo', 'cuentas'], materiales: ['Aros de madera', 'Cuentas de madera'], alt: 'Collar largo con aros de madera mostaza y cuentas de madera en tonos tierra', desc: 'Aros de madera mostaza y cuentas en tonos tierra, en un collar largo que se ve de lejos. Liviano, aunque no parezca.' },
  { id: 'am10', slug: 'aros-coral', nombre: 'Aros de ratán con flecos coral', categoria: 'aros', tipo: 'Aros', precio: 18500, stock: 3, talle: 'Único', colores: ['coral', 'crudo'], img: 'aros-coral', tags: ['ratán', 'flecos', 'rafia', 'verano'], materiales: ['Ratán tejido', 'Flecos de rafia'], alt: 'Aros de ratán tejido en forma de rombo con flecos de rafia coral', desc: 'Rombos de ratán tejido con flecos de rafia color coral. Livianos, para usar todo el verano.' },
  { id: 'am11', slug: 'aros-negros', nombre: 'Aros de ratán con flecos negros', categoria: 'aros', tipo: 'Aros', precio: 18500, stock: 2, talle: 'Único', colores: ['negro', 'crudo'], img: 'aros-negros', tags: ['ratán', 'flecos', 'rafia'], materiales: ['Ratán tejido', 'Flecos de rafia'], alt: 'Aros de ratán tejido en forma de rombo con flecos de rafia negra sobre una mesa de madera', desc: 'El mismo rombo de ratán, con flecos negros: más sobrio e igual de liviano.' },
  { id: 'am12', slug: 'aros-mostacillas', nombre: 'Aros largos de mostacillas', categoria: 'aros', tipo: 'Aros', precio: 14500, stock: 4, talle: 'Único', colores: ['crudo', 'mostaza'], img: 'aros-largos', tags: ['mostacillas', 'largos', 'colgantes'], materiales: ['Mostacillas', 'Cuentas facetadas'], alt: 'Aros largos de mostacillas blancas con cuentas amarillas colgando de una rama', desc: 'Una hilera larga de mostacillas blancas que termina en cuentas amarillas. Se mueven con vos.' },
  { id: 'am13', slug: 'aros-vidrio', nombre: 'Aros de vidrio de mar', categoria: 'aros', tipo: 'Aros', precio: 16500, stock: 2, talle: 'Único', colores: ['verde'], img: 'aros-vidrio', tags: ['vidrio', 'colgantes', 'perla'], materiales: ['Vidrio esmerilado', 'Cuenta perlada', 'Gancho de metal'], alt: 'Aros de vidrio esmerilado verde agua con una cuenta perlada colgando', desc: 'Cuentas de vidrio esmerilado verde agua con una cuenta perlada que cuelga abajo. Delicados para todos los días.' },
  { id: 'am14', slug: 'pulsera-piedras', nombre: 'Pulsera de piedras y madera', categoria: 'pulseras', tipo: 'Pulsera', precio: 12500, stock: 4, talle: 'Único', colores: ['madera', 'terracota'], img: 'pulseras-piedras', tags: ['piedras', 'madera', 'elástico', 'cuentas'], materiales: ['Piedras', 'Cuentas de madera', 'Elástico'], alt: 'Pulseras de piedras y cuentas de madera en tonos tierra apiladas en un exhibidor', desc: 'Piedras y cuentas de madera en tonos tierra, con elástico para ponértela sin broche. Queda linda sola o con otras.' },
  { id: 'am15', slug: 'pulsera-negra', nombre: 'Pulsera de cuentas negras', categoria: 'pulseras', tipo: 'Pulsera', precio: 11000, stock: 3, talle: 'Único', colores: ['negro'], img: 'pulsera-negra', tags: ['cuentas', 'elástico', 'facetadas'], materiales: ['Cuentas facetadas', 'Elástico'], alt: 'Pulsera de cuentas negras y plateadas facetadas sobre una mesa oscura', desc: 'Cuentas negras y plateadas facetadas que brillan apenas con la luz. Para todos los días.' },
  { id: 'am16', slug: 'bolsita-bordada', nombre: 'Bolsita de tela bordada', categoria: 'bolsos', tipo: 'Bolsita', precio: 21000, stock: 2, talle: 'Único', colores: ['crudo'], img: 'neceser-bordado', tags: ['bordado', 'flores', 'regalo', 'neceser'], materiales: ['Tela de algodón', 'Bordado a mano', 'Cordón con perla'], alt: 'Bolsita blanca con cordón, bordada con ramas y flores rosadas', desc: 'Bolsita con cordón, bordada con ramas y flores rosadas. Para los aros, el maquillaje o para regalar algo adentro.' },
  { id: 'am17', slug: 'morral-crochet', nombre: 'Morral tejido al crochet', categoria: 'bolsos', tipo: 'Morral', precio: 34000, stock: 2, talle: 'Único', colores: ['crudo'], img: 'bolso-crochet', tags: ['crochet', 'tejido', 'morral', 'bordado'], materiales: ['Hilo de algodón', 'Tejido al crochet', 'Ramita bordada'], alt: 'Morral tejido al crochet en hilo crudo con borde marrón y una ramita bordada', desc: 'Tejido al crochet en hilo crudo, con borde marrón y una ramita bordada en el frente. Correa larga para llevarlo cruzado.' },
  { id: 'am18', slug: 'morralitos-crochet', nombre: 'Morralitos tejidos (el par)', categoria: 'bolsos', tipo: 'Morral', precio: 19500, stock: 2, talle: 'Único', colores: ['crudo'], img: 'minibolsos-crochet', tags: ['crochet', 'tejido', 'chicos', 'celular'], materiales: ['Hilo de algodón', 'Tejido al crochet', 'Flor bordada'], alt: 'Dos morralitos tejidos al crochet en hilo crudo con una florcita bordada', desc: 'Dos morralitos al crochet con una flor bordada: para el celular o las llaves. Se venden juntos.' },
  { id: 'am19', slug: 'cartera-cuentas-madera', nombre: 'Cartera de cuentas de madera', categoria: 'bolsos', tipo: 'Cartera', precio: 38000, stock: 0, talle: 'Único', colores: ['madera'], img: 'bolso-madera', tags: ['madera', 'cuentas', 'cartera'], materiales: ['Cuentas de madera', 'Correa fina'], alt: 'Cartera de cuentas de madera enhebradas apoyada en el borde de una ventana', desc: 'Cuentas de madera enhebradas una por una, con una correa fina para llevarla al hombro.' },
];

const ORDEN = ['am01', 'am09', 'am10', 'am02', 'am16', 'am03', 'am07', 'am14', 'am12', 'am17', 'am06', 'am13', 'am05', 'am15', 'am08', 'am04', 'am11', 'am18', 'am19'];
const MOSAICO = ['am06', 'am05', 'am08', 'am11', 'am18'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const IMGN = (nombre, w) => `images/p-${nombre}-${w}.webp`;
const IMG = (p, w) => IMGN(p.img, w);
const esUnica = p => p.categoria === 'prendas';
const vendida = p => p.stock <= 0;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wsp = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

const Cart = {
  KEY: 'amilu_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, items); document.dispatchEvent(new CustomEvent('cart:updated')); },
  tiene(id) { return this.get().some(i => i.id === id); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
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
  const desktopMq = window.matchMedia(nav.dataset.mq || '(min-width: 1025px)');
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

function initHeaderSolido() {
  const header = document.querySelector('.site-header--sobre');
  const hero = document.querySelector('.hero--inmersivo');
  if (!header || !hero) return;
  let frame = 0;
  const sync = () => {
    frame = 0;
    const limite = hero.getBoundingClientRect().bottom - header.offsetHeight;
    header.classList.toggle('is-solido', limite <= 0);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(sync); }, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
  paso('.compacto-wordmark', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.12);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'transform,opacity,filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.accesos-titulo, .acceso', { x: 40, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.35);
  paso('.sello', { scale: 0.85, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--inmersivo');
  const img = hero?.querySelector('[data-hero-img]');
  if (img) gsap.to(img, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function detalleTexto(p) {
  return p.talle === 'Único' ? 'Talle único' : `Talle ${p.talle}`;
}

function badgesHTML(p) {
  if (vendida(p)) return '<div class="card-badges"><span class="badge badge--vendida">Vendida</span></div>';
  if (esUnica(p)) return '<div class="card-badges"><span class="badge badge--unica">Pieza única</span></div>';
  return '';
}

function fotoHTML(p, sizes) {
  return `<img src="${IMG(p, 600)}" srcset="${IMG(p, 600)} 600w, ${IMG(p, 1200)} 1200w" sizes="${sizes}" width="600" height="750" loading="lazy" alt="${esc(p.alt)}">`;
}

function mensajeParecida(p) {
  return `Hola Amilu, vi ${p.nombre} en la web y ya está vendida. ¿Van a tener alguna parecida?`;
}

function accionesHTML(p) {
  if (vendida(p)) {
    return `<a class="prod-add" href="${wsp(mensajeParecida(p))}" target="_blank" rel="noopener"><span class="lbl-largo">Preguntar por una parecida</span><span class="lbl-corto">Consultar</span></a>`;
  }
  return `<button type="button" class="prod-add" data-add="${p.id}"><span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span></button>
        <button type="button" class="prod-comprar" data-comprar="${p.id}">Comprar ahora</button>`;
}

function cardHTML(p) {
  return `<article class="card${vendida(p) ? ' card--vendida' : ''}" data-id="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <div class="card-media">
      <button type="button" class="card-foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, '(max-width: 768px) 50vw, (max-width: 1180px) 33vw, 330px')}</button>
      ${badgesHTML(p)}
    </div>
    <div class="card-info">
      <p class="card-cat">${esc(CATEGORIAS[p.categoria])}</p>
      <h3 class="card-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="precio">${formatearPrecio(p.precio)}</p>
      <p class="card-detalle">${esc(detalleTexto(p))}</p>
      <div class="prod-actions">
        ${accionesHTML(p)}
      </div>
    </div>
  </article>`;
}

function renderMosaico() {
  const cont = document.getElementById('mosaico');
  if (!cont) return;
  cont.innerHTML = MOSAICO.map(getProducto).filter(Boolean).map((p, i) => `<button type="button" class="tesela${i === 0 ? ' tesela--grande' : ''}" data-quick="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(40px)" aria-label="Ver ${esc(p.nombre)}">
      <span class="tesela-foto"><img src="${IMG(p, i === 0 ? 1200 : 600)}" srcset="${IMG(p, 600)} 600w, ${IMG(p, 1200)} 1200w" sizes="${i === 0 ? '(max-width: 900px) 100vw, 600px' : '(max-width: 900px) 50vw, 290px'}" width="600" height="750" loading="lazy" alt="${esc(p.alt)}"></span>
      <span class="tesela-txt"><span class="tesela-nombre">${esc(p.nombre)}</span><span class="tesela-precio">${formatearPrecio(p.precio)}</span></span>
    </button>`).join('');
}

const normalizar = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const INDICE = new Map(PRODUCTOS.map(p => [p.id, normalizar([p.nombre, p.tipo, CATEGORIAS[p.categoria], p.desc, p.talle, ...(p.tags || []), ...(p.materiales || []), ...p.colores.map(c => COLORES[c])].join(' '))]));
const INDICE_FUERTE = new Map(PRODUCTOS.map(p => [p.id, normalizar([p.nombre, p.tipo, ...(p.tags || [])].join(' '))]));

const estado = { q: '', cats: new Set(), talles: new Set(), colores: new Set(), disponibles: false, precioMax: PRECIO_TOPE, orden: 'destacados', visibles: POR_PAGINA };
let pintadas = 0;

function filtrados() {
  const palabras = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cats.size && !estado.cats.has(p.categoria)) return false;
    if (estado.talles.size && !estado.talles.has(p.talle)) return false;
    if (estado.colores.size && !p.colores.some(c => estado.colores.has(c))) return false;
    if (estado.disponibles && vendida(p)) return false;
    if (p.precio > estado.precioMax) return false;
    if (palabras.length) {
      const texto = INDICE.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  const porOrden = (a, b) => ORDEN.indexOf(a.id) - ORDEN.indexOf(b.id);
  const puntaje = p => palabras.filter(w => (INDICE_FUERTE.get(p.id) || '').includes(w)).length;
  const alFinal = (a, b) => (vendida(a) ? 1 : 0) - (vendida(b) ? 1 : 0);
  const criterios = {
    destacados: palabras.length ? (a, b) => alFinal(a, b) || puntaje(b) - puntaje(a) || porOrden(a, b) : porOrden,
    menor: (a, b) => alFinal(a, b) || a.precio - b.precio,
    mayor: (a, b) => alFinal(a, b) || b.precio - a.precio,
  };
  return lista.sort(criterios[estado.orden] || porOrden);
}

function renderCatalogo(modo = 'reset') {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const lista = filtrados();
  const total = lista.length;
  const mostrar = lista.slice(0, estado.visibles);
  if (modo === 'mas') grid.insertAdjacentHTML('beforeend', mostrar.slice(pintadas).map(cardHTML).join(''));
  else grid.innerHTML = mostrar.map(cardHTML).join('');
  pintadas = mostrar.length;

  const vacio = document.querySelector('[data-vacio]');
  if (vacio) vacio.hidden = total > 0;
  const pie = document.querySelector('.catalogo-pie');
  if (pie) pie.hidden = total === 0;
  const pieTxt = document.querySelector('[data-pie-txt]');
  if (pieTxt) pieTxt.textContent = mostrar.length < total ? `Mostrando ${mostrar.length} de ${total}` : `Estás viendo ${plural(total, 'pieza', 'piezas')}`;
  const verMas = document.querySelector('[data-ver-mas]');
  if (verMas) {
    const restan = total - mostrar.length;
    verMas.hidden = restan <= 0;
    verMas.textContent = `Ver más piezas (${Math.min(restan, POR_PAGINA)})`;
  }
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = total ? plural(total, 'pieza', 'piezas') : 'Sin resultados'; });
  document.querySelectorAll('[data-count-n]').forEach(el => { el.textContent = total ? plural(total, 'pieza', 'piezas') : 'resultados'; });
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
  document.querySelectorAll('[data-chip-talle]').forEach(b => {
    const v = b.dataset.chipTalle;
    const activo = v === 'todos' ? estado.talles.size === 0 : estado.talles.size === 1 && estado.talles.has(v);
    b.setAttribute('aria-pressed', String(activo));
  });
  document.querySelectorAll('input[data-f]').forEach(inp => {
    const set = inp.dataset.f === 'cat' ? estado.cats : inp.dataset.f === 'talle' ? estado.talles : estado.colores;
    inp.checked = set.has(inp.value);
  });
  document.querySelectorAll('[data-f-disponibles]').forEach(inp => { inp.checked = estado.disponibles; });
  document.querySelectorAll('[data-precio]').forEach(r => { r.value = String(estado.precioMax); });
  document.querySelectorAll('[data-precio-out]').forEach(o => { o.textContent = formatearPrecio(estado.precioMax); });
  document.querySelectorAll('[data-orden]').forEach(s => { s.value = estado.orden; });
  document.querySelectorAll('[data-q]').forEach(i => { if (document.activeElement !== i) i.value = estado.q; });
  const activos = estado.cats.size + estado.talles.size + estado.colores.size + (estado.disponibles ? 1 : 0) + (estado.precioMax < PRECIO_TOPE ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(n => { n.textContent = activos; n.hidden = activos === 0; });

  const cont = document.querySelector('[data-activos]');
  if (!cont) return;
  const tags = [];
  estado.cats.forEach(c => tags.push({ k: `cat:${c}`, t: CATEGORIAS[c] }));
  estado.talles.forEach(t => tags.push({ k: `talle:${t}`, t: t === 'Único' ? 'Talle único' : `Talle ${t}` }));
  estado.colores.forEach(c => tags.push({ k: `color:${c}`, t: COLORES[c] }));
  if (estado.disponibles) tags.push({ k: 'disponibles', t: 'Sin las vendidas' });
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
  estado.disponibles = false;
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
    const chipTalle = e.target.closest('[data-chip-talle]');
    if (chipTalle) {
      const v = chipTalle.dataset.chipTalle;
      estado.talles = new Set(v === 'todos' ? [] : [v]);
      estado.visibles = POR_PAGINA;
      renderCatalogo();
      return;
    }
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
      if (tipo === 'disponibles') estado.disponibles = false;
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
    const disp = e.target.closest('[data-f-disponibles]');
    if (disp) { estado.disponibles = disp.checked; estado.visibles = POR_PAGINA; renderCatalogo(); return; }
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
  const contar = lista => PRODUCTOS.filter(p => lista.includes(p.categoria)).length;
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const v = el.dataset.catN;
    const lista = v === 'todo' ? Object.keys(CATEGORIAS) : v.split(',');
    el.textContent = plural(contar(lista), 'pieza', 'piezas');
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
  const sync = () => {
    if (esDrawer()) {
      if (!abierto) { panel.hidden = true; if (backdrop) backdrop.hidden = true; }
    } else {
      if (abierto) { abierto = false; bloquear('filtros', false); }
      panel.classList.remove('open');
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      panel.hidden = false;
      if (backdrop) { backdrop.hidden = true; backdrop.classList.remove('open'); }
    }
  };
  lateral?.addEventListener('change', sync);
  sync();
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
    brand: { '@type': 'Brand', name: 'Amilu' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: p.precio,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: `${location.origin}${location.pathname}?producto=${p.slug}`,
    },
  });
}

function agregar(p, { comprar = false } = {}) {
  if (vendida(p)) return false;
  const yaEsta = Cart.get().find(i => i.id === p.id);
  if (yaEsta && yaEsta.qty >= p.stock) {
    if (comprar) abrirCarrito();
    else showToast(esUnica(p) ? `${p.nombre} ya está en tu carrito: es una pieza única.` : `Ya sumaste todas las unidades de ${p.nombre}.`);
    return false;
  }
  Cart.add(p, 1);
  if (comprar) abrirCarrito();
  else showToast(`Listo: ${p.nombre} ya está en tu carrito.`);
  return true;
}

function initQuickView() {
  const back = document.getElementById('qv');
  if (!back) return;
  const dlg = back.querySelector('.qv');
  const $ = s => back.querySelector(s);
  const img = $('[data-qv-img]');
  const thumbs = $('[data-qv-thumbs]');
  const cat = $('[data-qv-cat]');
  const nombre = $('[data-qv-nombre]');
  const precio = $('[data-qv-precio]');
  const est = $('[data-qv-estado]');
  const desc = $('[data-qv-desc]');
  const mat = $('[data-qv-mat]');
  const matWrap = $('[data-qv-mat-wrap]');
  const med = $('[data-qv-med]');
  const medWrap = $('[data-qv-med-wrap]');
  const addBtn = $('[data-qv-add]');
  const comprarBtn = $('[data-qv-comprar]');
  const wspLink = $('[data-qv-wsp]');
  const wspTxt = $('[data-qv-wsp-txt]');
  const rel = $('[data-qv-rel]');
  let actual = null;
  let disparador = null;
  let abierto = false;
  let cierre = 0;

  const mostrarFoto = (nombreImg, alt) => {
    img.src = IMGN(nombreImg, 1200);
    img.srcset = `${IMGN(nombreImg, 600)} 600w, ${IMGN(nombreImg, 1200)} 1200w`;
    img.sizes = '(max-width: 900px) 100vw, 500px';
    img.alt = alt;
  };

  function abrir(id, opts = {}) {
    const p = getProducto(id);
    if (!p) return;
    actual = p;
    if (!abierto) disparador = opts.disparador || document.activeElement;
    mostrarFoto(p.img, p.alt);
    const galeria = p.galeria || [];
    thumbs.hidden = galeria.length < 2;
    thumbs.innerHTML = galeria.length < 2 ? '' : galeria.map((g, i) => `<button type="button" data-qv-thumb="${esc(g)}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1} de ${galeria.length}"><img src="${IMGN(g, 600)}" width="600" height="750" alt=""></button>`).join('');
    cat.textContent = `${CATEGORIAS[p.categoria]} · ${p.tipo}`;
    nombre.textContent = p.nombre;
    precio.textContent = formatearPrecio(p.precio);
    est.classList.toggle('is-vendida', vendida(p));
    est.textContent = vendida(p) ? `Vendida · era talle ${p.talle === 'Único' ? 'único' : p.talle}` : esUnica(p) ? `Pieza única · talle ${p.talle === 'Único' ? 'único' : p.talle}` : 'Disponible · talle único';
    desc.textContent = p.desc;
    matWrap.hidden = !(p.materiales || []).length;
    mat.innerHTML = (p.materiales || []).map(m => `<li>${esc(m)}</li>`).join('');
    medWrap.hidden = !p.medidas;
    med.innerHTML = p.medidas ? Object.entries(p.medidas).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('') : '';
    addBtn.hidden = vendida(p);
    comprarBtn.hidden = vendida(p);
    wspTxt.textContent = vendida(p) ? 'Preguntar por una parecida' : 'Consultar por WhatsApp';
    wspLink.href = wsp(vendida(p) ? mensajeParecida(p) : `Hola Amilu, quiero consultar por ${p.nombre} (${formatearPrecio(p.precio)}). ¿Sigue disponible?`);
    const mismos = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id && !vendida(x));
    const otros = PRODUCTOS.filter(x => x.categoria !== p.categoria && !vendida(x));
    rel.innerHTML = [...mismos, ...otros].slice(0, 3).map(r => `<button type="button" class="qv-rel-item" data-qv-rel-id="${r.id}"><span><img src="${IMG(r, 600)}" width="600" height="750" alt="${esc(r.alt)}"></span>${esc(r.nombre)}</button>`).join('');
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
    $('[data-qv-cerrar]').focus({ preventScroll: true });
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
    const th = e.target.closest('[data-qv-thumb]');
    if (th && actual) {
      mostrarFoto(th.dataset.qvThumb, actual.alt);
      thumbs.querySelectorAll('[data-qv-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th)));
    }
  });
  addBtn.addEventListener('click', () => {
    if (!actual) return;
    const p = actual;
    if (agregar(p)) cerrar();
  });
  comprarBtn.addEventListener('click', () => {
    if (!actual) return;
    const p = actual;
    cerrar(false);
    agregar(p, { comprar: true });
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
    const add = e.target.closest('[data-add], [data-comprar]');
    if (!add) return;
    const p = getProducto(add.dataset.add || add.dataset.comprar);
    if (!p) return;
    agregar(p, { comprar: add.hasAttribute('data-comprar') });
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
  const wspBtn = drawer.querySelector('[data-cart-wsp]');
  let abierto = false;
  let disparador = null;
  let cierre = 0;
  const trash = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M9 7V4.5h6V7M6 7l1 13h10l1-13"/></svg>';
  const variante = p => (p.talle === 'Único' ? 'Talle único' : `Talle ${p.talle}`);
  const render = () => {
    const items = Cart.get().filter(it => getProducto(it.id));
    const n = items.reduce((s, i) => s + i.qty, 0);
    resumen.textContent = n ? `(${n})` : '';
    vacio.hidden = items.length > 0;
    lineas.hidden = items.length === 0;
    foot.hidden = items.length === 0;
    lineas.innerHTML = items.map(it => {
      const p = getProducto(it.id);
      const control = p.stock > 1
        ? `<div class="stepper">
              <button type="button" data-linea-menos="${p.id}" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button>
              <span>${it.qty}</span>
              <button type="button" data-linea-mas="${p.id}" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
            </div>`
        : '<span class="linea-cart-unica">Pieza única</span>';
      return `<div class="linea-cart">
        <div class="linea-cart-foto"><img src="${IMG(p, 600)}" width="600" height="750" alt="${esc(p.alt)}"></div>
        <div class="linea-cart-info">
          <p class="linea-cart-nombre">${esc(p.nombre)}</p>
          <p class="linea-cart-var">${esc(variante(p))}</p>
          <p class="precio">${formatearPrecio(p.precio * it.qty)}</p>
          <div class="linea-cart-fila">${control}</div>
        </div>
        <button type="button" class="linea-cart-quitar" data-linea-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">${trash}</button>
      </div>`;
    }).join('');
    const total = Cart.total();
    totalEl.textContent = formatearPrecio(total);
    const texto = [
      'Hola Amilu, quiero hacer este pedido:',
      '',
      ...items.map(it => { const p = getProducto(it.id); return `${it.qty}x ${p.nombre} | ${variante(p)} | ${formatearPrecio(p.precio * it.qty)}`; }),
      '',
      `Total: ${formatearPrecio(total)}`,
      '¿Me confirman que siguen disponibles y cómo seguimos?',
    ];
    wspBtn.href = wsp(texto.join('\n'));
  };
  const abrir = () => {
    if (abierto) return;
    clearTimeout(cierre);
    disparador = document.activeElement;
    Cart.syncStock(PRODUCTOS);
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
      const id = (menos || mas).dataset.lineaMenos || (menos || mas).dataset.lineaMas;
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + (mas ? 1 : -1));
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
  const wspF = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wspF?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => abrirCarrito());
  sync();
}

const DETALLES = [
  { img: 'detalle-sol', titulo: 'El sol, en espiral', texto: 'Hilo terracota bordado en espiral desde el centro hacia afuera, con rayos finos en hilo dorado.', alt: 'Sol bordado en espiral con hilo terracota y rayos dorados' },
  { img: 'detalle-pajaro', titulo: 'Un pájaro de plumas sueltas', texto: 'Cada pluma va en un tono distinto de terracota y ocre, en puntadas largas que le dan volumen.', alt: 'Pájaro bordado con plumas en tonos terracota y ocre' },
  { img: 'detalle-rostro', titulo: 'El rostro, en hilo fino', texto: 'El pelo, en puntadas negras apretadas; la cara, apenas sombreada. Las flores del peinado van aplicadas encima.', alt: 'Rostro de mujer de perfil bordado con pelo negro y flores en el peinado' },
  { img: 'detalle-flor', titulo: 'Flores con relieve', texto: 'Pétalos bordados en capas que sobresalen de la tela, con el centro hecho de nudos.', alt: 'Flor naranja bordada en capas con relieve y centro de nudos' },
];

function initCerca() {
  const sec = document.getElementById('cerca');
  if (!sec) return;
  const img = sec.querySelector('[data-cerca-img]');
  const num = sec.querySelector('[data-cerca-num]');
  const titulo = sec.querySelector('[data-cerca-titulo]');
  const texto = sec.querySelector('[data-cerca-texto]');
  const botones = [...sec.querySelectorAll('[data-punto]')];
  if (!img || !botones.length) return;
  DETALLES.forEach(d => { const pre = new window.Image(); pre.src = `images/${d.img}.webp`; });
  let actual = 0;
  let espera = 0;
  const mostrar = i => {
    if (i === actual) return;
    actual = i;
    const d = DETALLES[i];
    botones.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.punto) === i)));
    num.textContent = `Detalle ${i + 1} de ${DETALLES.length}`;
    titulo.textContent = d.titulo;
    texto.textContent = d.texto;
    clearTimeout(espera);
    const cambiar = () => {
      img.src = `images/${d.img}.webp`;
      img.alt = d.alt;
      requestAnimationFrame(() => img.classList.add('is-on'));
    };
    if (reduceMotion) { cambiar(); return; }
    img.classList.remove('is-on');
    espera = setTimeout(cambiar, 260);
  };
  sec.addEventListener('click', e => {
    const b = e.target.closest('[data-punto]');
    if (b) mostrar(Number(b.dataset.punto));
  });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wsp(a.dataset.wspMsg); });
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
initCuentas();
renderMosaico();
renderCatalogo();
initReveals();
initNav();
initHeaderSolido();
initHeroMotion();
initParallax();
initCatalogo();
initFiltros();
initQuickView();
initTarjetas();
initCarrito();
initFloats();
initCerca();
initWspLinks();
initAnio();
Cart.syncStock(PRODUCTOS);
updateCartBadge();
initDeepLink();
