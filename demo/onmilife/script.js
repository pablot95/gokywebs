const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const WSP = '5491132793483';
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const FORMATOS = { polvos: 'Polvos', capsulas: 'Cápsulas', bebibles: 'Bebibles', infusiones: 'Infusiones' };

const NECESIDADES = {
  energia: { nombre: 'Energía', titulo: 'Para los días largos', texto: 'Vitaminas del grupo B, multivitamínico, proteína vegetal y electrolitos para acompañar una rutina activa.', foto: 'p-proteina-arveja' },
  descanso: { nombre: 'Descanso', titulo: 'Para bajar un cambio a la noche', texto: 'Magnesio, ashwagandha y una infusión de lavanda y tilo para el final del día.', foto: 'p-te-lavanda-tilo' },
  digestion: { nombre: 'Digestión', titulo: 'Para sentirte más liviano', texto: 'Probióticos, fibra prebiótica, aloe y una infusión de menta y manzanilla.', foto: 'p-infusion-digestiva' },
  piel: { nombre: 'Piel y cabello', titulo: 'Para cuidarte desde adentro', texto: 'Colágeno en polvo, bebible y en sobres, más biotina con zinc.', foto: 'p-colageno-vitc' },
  articulaciones: { nombre: 'Articulaciones', titulo: 'Para moverte con comodidad', texto: 'Colágeno, cúrcuma con pimienta negra, omega 3 y citrato de magnesio.', foto: 'p-colageno-neutro' },
  defensas: { nombre: 'Defensas', titulo: 'Para los cambios de estación', texto: 'Vitamina C con zinc, multivitamínico y una infusión de hibisco y frutos rojos.', foto: 'p-infusion-hibisco' },
};

const PRODUCTOS = [
  { id: 'colageno-vitc', nombre: 'Colágeno hidrolizado con vitamina C', pres: 'Polvo · 300 g · frutos rojos', formato: 'polvos', para: ['piel', 'articulaciones'], precio: 24900, descuento: 0, stock: 18, img: 'p-colageno-vitc', escena: 'linea-polvos', destacado: true, tags: 'colageno vitamina c', desc: 'Colágeno hidrolizado con vitamina C en polvo, sabor frutos rojos. Se disuelve en agua, jugo o yogur.' },
  { id: 'magnesio-bisglicinato', nombre: 'Magnesio bisglicinato', pres: '60 cápsulas', formato: 'capsulas', para: ['descanso'], precio: 15900, descuento: 0, stock: 24, img: 'p-magnesio-bisglicinato', escena: 'linea-capsulas', destacado: true, tags: 'magnesio mineral', desc: 'Magnesio en forma de bisglicinato, en cápsulas. Una forma práctica de sumar este mineral a tu rutina.' },
  { id: 'te-lavanda-tilo', nombre: 'Infusión de lavanda y tilo', pres: 'Caja · 20 saquitos', formato: 'infusiones', para: ['descanso'], precio: 6900, descuento: 0, stock: 30, img: 'p-te-lavanda-tilo', escena: 'linea-infusiones', destacado: true, tags: 'te saquitos sin cafeina', desc: 'Mezcla de lavanda, tilo y flores en saquitos, para una taza tibia al final del día. Sin cafeína.' },
  { id: 'colageno-bebible', nombre: 'Colágeno bebible sabor granada', pres: 'Doypack · 500 ml', formato: 'bebibles', para: ['piel'], precio: 18000, descuento: 15, stock: 9, img: 'p-colageno-bebible', escena: 'bebibles-vertical', destacado: true, tags: 'colageno liquido', desc: 'Colágeno listo para tomar, sabor granada, en doypack con tapa. Agitá antes de servir.' },
  { id: 'vitamina-c-zinc', nombre: 'Vitamina C + zinc', pres: '60 cápsulas', formato: 'capsulas', para: ['defensas'], precio: 11900, descuento: 0, stock: 32, img: 'p-vitamina-c-zinc', escena: 'linea-capsulas', destacado: true, tags: 'vitamina c zinc', desc: 'Vitamina C con zinc en cápsulas, para sumar a tu alimentación en los cambios de estación.' },
  { id: 'proteina-arveja', nombre: 'Proteína vegetal de arveja', pres: 'Polvo · 450 g · vainilla', formato: 'polvos', para: ['energia'], precio: 29800, descuento: 0, stock: 4, img: 'p-proteina-arveja', escena: 'linea-bebibles', destacado: true, tags: 'proteina vegana licuado', desc: 'Proteína de arveja en polvo, sabor vainilla. Se mezcla con agua, leche vegetal o en licuados.' },
  { id: 'omega-3', nombre: 'Omega 3', pres: '60 cápsulas blandas', formato: 'capsulas', para: ['articulaciones'], precio: 17500, descuento: 0, stock: 15, img: 'p-omega-3', escena: 'linea-capsulas', tags: 'omega aceite de pescado', desc: 'Omega 3 en cápsulas blandas, una forma simple de sumar estos ácidos grasos a tu dieta.' },
  { id: 'infusion-digestiva', nombre: 'Infusión de menta y manzanilla', pres: 'Caja · 20 saquitos', formato: 'infusiones', para: ['digestion'], precio: 6500, descuento: 0, stock: 26, img: 'p-infusion-digestiva', escena: 'linea-infusiones', destacado: true, tags: 'te saquitos digestiva', desc: 'Menta y manzanilla en saquitos, una infusión suave para después de comer.' },
  { id: 'vitaminas-b', nombre: 'Shot de vitaminas del grupo B', pres: 'Doypack · 250 ml', formato: 'bebibles', para: ['energia'], precio: 10900, descuento: 0, stock: 20, img: 'p-vitaminas-b', escena: 'bebibles-vertical', tags: 'vitamina b complejo', desc: 'Shot de vitaminas del grupo B listo para tomar, en doypack de 250 ml.' },
  { id: 'probioticos', nombre: 'Probióticos', pres: '30 cápsulas', formato: 'capsulas', para: ['digestion'], precio: 19900, descuento: 0, stock: 11, img: 'p-probioticos', escena: 'hero-mesa', nuevo: true, tags: 'probiotico flora', desc: 'Probióticos en cápsulas para acompañar tu alimentación de todos los días.' },
  { id: 'colageno-neutro', nombre: 'Colágeno hidrolizado neutro', pres: 'Polvo · 500 g', formato: 'polvos', para: ['articulaciones', 'piel'], precio: 32500, descuento: 10, stock: 12, img: 'p-colageno-neutro', escena: 'linea-capsulas', tags: 'colageno sin sabor', desc: 'Colágeno hidrolizado sin sabor, para sumar a cualquier bebida o comida.' },
  { id: 'ashwagandha', nombre: 'Ashwagandha', pres: '60 cápsulas', formato: 'capsulas', para: ['descanso'], precio: 15400, descuento: 0, stock: 3, img: 'p-ashwagandha', escena: 'linea-bebibles', tags: 'adaptogeno raiz', desc: 'Extracto de ashwagandha en cápsulas, una raíz tradicional de la herbolaria india.' },
  { id: 'infusion-hibisco', nombre: 'Infusión de hibisco y frutos rojos', pres: 'Caja · 20 saquitos', formato: 'infusiones', para: ['defensas'], precio: 6900, descuento: 0, stock: 22, img: 'p-infusion-hibisco', escena: 'linea-infusiones', tags: 'te saquitos rosa jamaica', desc: 'Hibisco con frutos rojos en saquitos: una infusión de color intenso, rica fría o caliente.' },
  { id: 'aloe-bebible', nombre: 'Aloe vera bebible', pres: 'Doypack · 500 ml', formato: 'bebibles', para: ['digestion'], precio: 9800, descuento: 0, stock: 14, img: 'p-aloe-bebible', escena: 'linea-bebibles', tags: 'aloe sabila', desc: 'Aloe vera listo para tomar, en doypack de 500 ml.' },
  { id: 'biotina-zinc', nombre: 'Biotina + zinc', pres: '60 cápsulas', formato: 'capsulas', para: ['piel'], precio: 12600, descuento: 0, stock: 19, img: 'p-biotina-zinc', escena: 'linea-polvos', tags: 'biotina pelo unas', desc: 'Biotina con zinc en cápsulas, para tu rutina de cuidado desde adentro.' },
  { id: 'citrato-magnesio', nombre: 'Citrato de magnesio en polvo', pres: 'Polvo · 250 g', formato: 'polvos', para: ['articulaciones'], precio: 13400, descuento: 0, stock: 16, img: 'p-citrato-magnesio', escena: 'linea-capsulas', tags: 'magnesio mineral', desc: 'Citrato de magnesio en polvo para disolver en agua.' },
  { id: 'multivitaminico', nombre: 'Multivitamínico diario', pres: '60 cápsulas', formato: 'capsulas', para: ['energia', 'defensas'], precio: 16800, descuento: 0, stock: 21, img: 'p-multivitaminico', escena: 'linea-bebibles', tags: 'vitaminas minerales', desc: 'Vitaminas y minerales en una sola cápsula diaria.' },
  { id: 'sobres-colageno', nombre: 'Colágeno en sobres monodosis', pres: 'Caja · 15 sobres', formato: 'polvos', para: ['piel'], precio: 14500, descuento: 0, stock: 0, img: 'p-sobres-colageno', escena: 'linea-polvos', tags: 'colageno sobres', desc: 'Colágeno en sobres monodosis, para llevar en la cartera o en la mochila.' },
  { id: 'fibra-prebiotica', nombre: 'Fibra prebiótica en polvo', pres: 'Polvo · 200 g', formato: 'polvos', para: ['digestion'], precio: 12800, descuento: 0, stock: 17, img: 'p-fibra-prebiotica', escena: 'bebibles-vertical', nuevo: true, tags: 'fibra prebiotico', desc: 'Fibra prebiótica en polvo para sumar a tus comidas y bebidas.' },
  { id: 'curcuma', nombre: 'Cúrcuma con pimienta negra', pres: '60 cápsulas', formato: 'capsulas', para: ['articulaciones'], precio: 14200, descuento: 0, stock: 13, img: 'p-curcuma', escena: 'hero-mesa', tags: 'curcuma turmeric', desc: 'Cúrcuma con pimienta negra en cápsulas.' },
  { id: 'electrolitos', nombre: 'Bebible de electrolitos', pres: 'Doypack · 250 ml', formato: 'bebibles', para: ['energia'], precio: 7900, descuento: 0, stock: 28, img: 'p-electrolitos', escena: 'hero-mesa', nuevo: true, tags: 'hidratacion sales', desc: 'Bebible de electrolitos listo para tomar, en doypack de 250 ml.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const POCAS = 5;

const Cart = {
  KEY: 'onmilife_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  qtyDe(id) { return this.get().find(i => i.id === id)?.qty || 0; },
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

const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const irA = id => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

const ICONOS = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  flecha: '<svg class="i-flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
};

function stepperHTML(max, extraClass = '') {
  const tope = Math.max(1, max);
  return `<div class="stepper ${extraClass}" role="group" aria-label="Cantidad" data-max="${tope}">
    <button type="button" data-step="-1" aria-label="Restar uno" disabled>${ICONOS.menos}</button>
    <span class="stepper-n" aria-live="polite">1</span>
    <button type="button" data-step="1" aria-label="Sumar uno"${tope <= 1 ? ' disabled' : ''}>${ICONOS.mas}</button>
  </div>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.stock <= 0) b.push('<span class="badge badge--sin">Sin stock</span>');
  else if (p.stock <= POCAS) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  return b.join('');
}

function precioHTML(p) {
  return `<strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}`;
}

function cardHTML(p, anim = 'subir') {
  const attr = anim === 'subir' ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const acciones = p.stock > 0
    ? `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}">${ICONOS.carrito}<span>Agregar<span class="add-extra"> al carrito</span></span></button></div>
       <button type="button" class="card-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<div class="prod-actions"><a class="prod-avisar" href="${waLink(`Hola Onmilife, ¿cuándo vuelve a entrar ${p.nombre} (${p.pres})?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a></div>`;
  return `<article class="card" data-prod="${p.id}"${attr}>
    <button type="button" class="card-media" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <img src="images/${p.img}.webp" alt="${esc(`${p.nombre}, ${p.pres}`)}" width="640" height="800" decoding="async">
      <span class="card-badges">${badgesHTML(p)}</span>
    </button>
    <div class="card-body">
      <p class="card-pres">${esc(p.pres)}</p>
      <h3 class="card-name">${esc(p.nombre)}</h3>
      <p class="card-price">${precioHTML(p)}</p>
      ${acciones}
    </div>
  </article>`;
}

function cardRailHTML(p) {
  return `<article class="card card--rail" data-prod="${p.id}">
    <button type="button" class="card-media" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <img src="images/${p.img}.webp" alt="${esc(`${p.nombre}, ${p.pres}`)}" width="640" height="800" decoding="async">
      <span class="card-badges">${badgesHTML(p)}</span>
    </button>
    <div class="card-body">
      <p class="card-pres">${esc(p.pres)}</p>
      <h3 class="card-name">${esc(p.nombre)}</h3>
      <div class="card-fila">
        <p class="card-price">${precioHTML(p)}</p>
        ${p.stock > 0 ? `<button type="button" class="card-mas" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICONOS.mas}</button>` : ''}
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

const capas = [];
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function abrirCapa(panel, cerrar, volver = document.activeElement) {
  capas.push({ panel, cerrar, volver });
  document.body.classList.add('no-scroll');
}

function quitarCapa(panel) {
  const i = capas.findIndex(c => c.panel === panel);
  if (i < 0) return;
  const [c] = capas.splice(i, 1);
  if (!capas.length) document.body.classList.remove('no-scroll');
  if (c.volver && document.contains(c.volver) && c.volver.getClientRects().length) c.volver.focus({ preventScroll: true });
}

document.addEventListener('keydown', e => {
  const c = capas[capas.length - 1];
  if (!c) return;
  if (e.key === 'Escape') { e.preventDefault(); c.cerrar(); return; }
  if (e.key !== 'Tab') return;
  const f = $$(ENFOCABLES, c.panel).filter(el => el.getClientRects().length);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (!c.panel.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
  else if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
});

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
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

const estado = { q: '', formato: new Set(), para: new Set(), precio: new Set(), stock: false, orden: 'destacados', visibles: 16 };
const POR_PAGINA = 16;
let resultados = [];

const ETIQUETAS_PRECIO = { '0-10000': 'Hasta $10.000', '10000-20000': '$10.000 a $20.000', '20000-': 'Más de $20.000' };
const enRango = (v, r) => { const [a, b] = r.split('-'); return v >= Number(a) && (b === '' || v < Number(b)); };

function pasa(p, sin) {
  if (estado.q) {
    const hay = norm([p.nombre, p.pres, FORMATOS[p.formato], p.para.map(n => NECESIDADES[n].nombre).join(' '), p.tags, p.desc].join(' '));
    if (!estado.q.split(/\s+/).every(t => hay.includes(t))) return false;
  }
  if (sin !== 'formato' && estado.formato.size && !estado.formato.has(p.formato)) return false;
  if (sin !== 'para' && estado.para.size && !p.para.some(n => estado.para.has(n))) return false;
  if (sin !== 'precio' && estado.precio.size && ![...estado.precio].some(r => enRango(precioFinal(p), r))) return false;
  if (sin !== 'stock' && estado.stock && p.stock <= 0) return false;
  return true;
}

function ordenar(lista) {
  const l = [...lista];
  if (estado.orden === 'menor') l.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'mayor') l.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'az') l.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return l;
}

function cantidadFiltros() {
  return estado.formato.size + estado.para.size + estado.precio.size + (estado.stock ? 1 : 0);
}

function sincronizarChecks() {
  $$('#filtros input[data-f]').forEach(i => {
    const f = i.dataset.f;
    i.checked = f === 'stock' ? estado.stock : estado[f].has(i.value);
  });
  const q = $('#cat-q');
  if (q && norm(q.value.trim()) !== estado.q) q.value = estado.q;
}

function limpiarFiltros(conBusqueda = true) {
  estado.formato.clear(); estado.para.clear(); estado.precio.clear(); estado.stock = false;
  if (conBusqueda) { estado.q = ''; const q = $('#cat-q'); if (q) q.value = ''; const hq = $('#header-q'); if (hq) hq.value = ''; }
}

function renderChips() {
  const cont = $('#chips-activos');
  if (!cont) return;
  const chips = [];
  if (estado.q) chips.push([`q:`, `“${estado.q}”`]);
  estado.formato.forEach(v => chips.push([`formato:${v}`, FORMATOS[v]]));
  estado.para.forEach(v => chips.push([`para:${v}`, NECESIDADES[v].nombre]));
  estado.precio.forEach(v => chips.push([`precio:${v}`, ETIQUETAS_PRECIO[v]]));
  if (estado.stock) chips.push(['stock:1', 'Solo con stock']);
  cont.hidden = !chips.length;
  cont.innerHTML = chips.map(([k, t]) => `<button type="button" class="chip-x" data-quitar="${esc(k)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('')
    + (chips.length ? '<button type="button" class="chips-limpiar" data-limpiar>Limpiar filtros</button>' : '');
}

function renderConteos() {
  $$('[data-n-f]').forEach(el => {
    const [g, v] = el.dataset.nF.split(':');
    const n = PRODUCTOS.filter(p => pasa(p, g) && (g === 'formato' ? p.formato === v : g === 'para' ? p.para.includes(v) : g === 'precio' ? enRango(precioFinal(p), v) : p.stock > 0)).length;
    el.textContent = n;
  });
  const n = cantidadFiltros();
  $$('[data-filtros-n]').forEach(b => { b.textContent = n; b.hidden = !n; });
}

function renderCatalogo() {
  const grid = $('#catalogo-grid');
  if (!grid) return;
  resultados = ordenar(PRODUCTOS.filter(p => pasa(p)));
  estado.visibles = POR_PAGINA;
  grid.innerHTML = resultados.slice(0, estado.visibles).map(p => cardHTML(p)).join('');
  actualizarPie();
  renderChips();
  renderConteos();
  revelarNuevos(grid);
  refrescarST();
}

function actualizarPie() {
  const total = resultados.length;
  const cuenta = $('#cat-count');
  if (cuenta) cuenta.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
  const vacio = $('#cat-vacio');
  if (vacio) vacio.hidden = total > 0;
  const mas = $('#cat-mas');
  if (mas) mas.hidden = total <= estado.visibles;
  const ver = $('#filtros-ver');
  if (ver) ver.textContent = total ? `Ver ${total} ${total === 1 ? 'producto' : 'productos'}` : 'Sin resultados';
}

function verMas() {
  const grid = $('#catalogo-grid');
  const desde = estado.visibles;
  estado.visibles += POR_PAGINA;
  grid.insertAdjacentHTML('beforeend', resultados.slice(desde, estado.visibles).map(p => cardHTML(p)).join(''));
  actualizarPie();
  revelarNuevos(grid);
  refrescarST();
}

function filtrarPor(grupo, valor) {
  limpiarFiltros();
  estado[grupo].add(valor);
  sincronizarChecks();
  renderCatalogo();
  irA('tienda');
}

function initCatalogo() {
  const grid = $('#catalogo-grid');
  if (!grid) return;
  const filtros = $('#filtros');
  filtros?.addEventListener('submit', e => e.preventDefault());
  filtros?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const f = i.dataset.f;
    if (f === 'stock') estado.stock = i.checked;
    else if (i.checked) estado[f].add(i.value);
    else estado[f].delete(i.value);
    renderCatalogo();
  });

  const q = $('#cat-q');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = norm(q.value.trim()); renderCatalogo(); }, 180);
  });
  $('#cat-buscar')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    estado.q = norm(q.value.trim());
    renderCatalogo();
  });

  $('#header-buscar')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#header-q').value.trim();
    estado.q = norm(v);
    if (q) q.value = v;
    renderCatalogo();
    irA('tienda');
  });

  $$('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    irA('tienda');
    setTimeout(() => q?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  }));

  $('#cat-orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  $('#cat-mas')?.addEventListener('click', verMas);

  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const [g, v] = quitar.dataset.quitar.split(':');
      if (g === 'q') { estado.q = ''; if (q) q.value = ''; }
      else if (g === 'stock') estado.stock = false;
      else estado[g].delete(v);
      sincronizarChecks();
      renderCatalogo();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      limpiarFiltros();
      sincronizarChecks();
      renderCatalogo();
      return;
    }
    const cat = e.target.closest('[data-cat]');
    if (cat) { filtrarPor('formato', cat.dataset.cat); return; }
    const nec = e.target.closest('[data-ver-necesidad]');
    if (nec) filtrarPor('para', nec.dataset.verNecesidad);
  });

  initFiltrosMobile();
  renderCatalogo();
}

function initFiltrosMobile() {
  const filtros = $('#filtros');
  const btn = $('#btn-filtrar');
  if (!filtros || !btn) return;
  const bd = document.createElement('div');
  bd.className = 'filtros-backdrop';
  document.body.appendChild(bd);
  const mq = window.matchMedia('(max-width: 1024px)');
  const cerrar = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); bd.classList.remove('open');
    filtros.removeAttribute('role'); filtros.removeAttribute('aria-modal');
    btn.setAttribute('aria-expanded', 'false');
    quitarCapa(filtros);
  };
  const abrir = () => {
    filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    filtros.classList.add('open'); bd.classList.add('open');
    filtros.setAttribute('role', 'dialog'); filtros.setAttribute('aria-modal', 'true');
    btn.setAttribute('aria-expanded', 'true');
    abrirCapa(filtros, cerrar);
    setTimeout(() => $('#filtros-cerrar')?.focus(), 60);
  };
  btn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  $('#filtros-cerrar')?.addEventListener('click', cerrar);
  $('#filtros-ver')?.addEventListener('click', () => { cerrar(); irA('tienda'); });
  $('#filtros-limpiar')?.addEventListener('click', () => { limpiarFiltros(false); sincronizarChecks(); renderCatalogo(); });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

function initLineas() {
  $$('[data-count-cat]').forEach(el => {
    const n = PRODUCTOS.filter(p => p.formato === el.dataset.countCat).length;
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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
  const vp = $('#rail');
  const track = $('#rail-track');
  if (!vp || !track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 7)
    .map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardRailHTML(p)}</div>`).join('');
  initRailDrag(vp);
  const prev = $('#rail-prev');
  const next = $('#rail-next');
  const paso = () => {
    const item = track.querySelector('.rail-item');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return item ? (item.getBoundingClientRect().width + gap) * (vp.clientWidth > 900 ? 2 : 1) : vp.clientWidth * 0.8;
  };
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    const reposo = parseFloat(window.getComputedStyle(vp).scrollPaddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.max(2, inicio - reposo + 2);
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  let f = 0;
  vp.addEventListener('scroll', () => { if (!f) f = requestAnimationFrame(() => { f = 0; sync(); }); }, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initGuia() {
  const tabs = $$('.guia-tab');
  const panel = $('#guia-panel');
  if (!tabs.length || !panel) return;
  const foto = $('#guia-foto');
  const etiqueta = $('#guia-etiqueta span');
  let actual = '';

  const pintar = (id, animar) => {
    const n = NECESIDADES[id];
    if (!n || id === actual) return;
    actual = id;
    const prods = PRODUCTOS.filter(p => p.para.includes(id));
    tabs.forEach(t => {
      const sel = t.dataset.necesidad === id;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = `
      <h3>${esc(n.titulo)}</h3>
      <p>${esc(n.texto)}</p>
      <ul class="guia-lista">${prods.map(p => `<li><button type="button" class="guia-item" data-quick="${p.id}">
        <span class="guia-item-txt"><strong>${esc(p.nombre)}</strong><span>${esc(p.pres)}${p.stock <= 0 ? ' · Sin stock' : ''}</span></span>
        <span class="guia-item-precio">${formatearPrecio(precioFinal(p))}</span>${ICONOS.flecha}</button></li>`).join('')}</ul>
      <p class="guia-nota">${ICONOS.info}<span>Acompañan, no reemplazan una consulta: si tomás medicación, hablalo con tu médico.</span></p>
      <button type="button" class="btn btn--dark guia-cta" data-ver-necesidad="${id}">Ver los ${prods.length} en la tienda ${ICONOS.flecha}</button>`;
    if (animar && !reduceMotion) {
      panel.classList.remove('guia-anim');
      void panel.offsetWidth;
      panel.classList.add('guia-anim');
    }
    if (etiqueta) etiqueta.textContent = n.nombre;
    if (foto && !animar) {
      const im = $('img', foto);
      if (im && !im.src.endsWith(`${n.foto}.webp`)) im.src = `images/${n.foto}.webp`;
    } else if (foto) {
      const viejas = $$('img', foto);
      const img = document.createElement('img');
      img.src = `images/${n.foto}.webp`;
      img.alt = '';
      img.width = 640; img.height = 800;
      if (!reduceMotion) img.className = 'sale';
      foto.appendChild(img);
      const mostrar = () => requestAnimationFrame(() => requestAnimationFrame(() => {
        img.classList.remove('sale');
        viejas.forEach(v => { v.classList.add('sale'); setTimeout(() => v.remove(), 750); });
      }));
      if (img.complete) mostrar(); else { img.onload = mostrar; img.onerror = mostrar; }
    }
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.necesidad, true));
    t.addEventListener('keydown', e => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j < 0) return;
      e.preventDefault();
      tabs[j].focus();
      pintar(tabs[j].dataset.necesidad, true);
    });
  });
  const inicial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  pintar(inicial.dataset.necesidad, false);
}

function animarBadge(b) {
  b.classList.remove('bump');
  void b.offsetWidth;
  b.classList.add('bump');
}

function updateCartBadge(bump = false) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    if (bump && n) animarBadge(b);
  });
}

const drawer = $('#cart-drawer');
const drawerBd = $('#cart-backdrop');

function cartItemHTML(i, animar) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<div class="drawer-item${animar ? ' entra' : ''}" data-item="${p.id}">
    <div class="drawer-foto"><img src="images/${p.img}.webp" alt="" width="640" height="800"></div>
    <div class="drawer-item-txt">
      <strong>${esc(p.nombre)}</strong>
      <span>${esc(p.pres)} · ${formatearPrecio(precioFinal(p))} c/u</span>
      <div class="drawer-item-fila">
        <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-cart-step="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
          <span class="stepper-n">${i.qty}</span>
          <button type="button" data-cart-step="1" aria-label="Sumar uno"${i.qty >= p.stock ? ' disabled' : ''}>${ICONOS.mas}</button>
        </div>
        <span class="drawer-sub">${formatearPrecio(precioFinal(p) * i.qty)}</span>
      </div>
      <button type="button" class="drawer-quitar" data-cart-quitar>Quitar</button>
    </div>
  </div>`;
}

function mensajePedido(items) {
  const lineas = items.map(i => { const p = getProducto(i.id); return p ? `• ${i.qty} × ${p.nombre} (${p.pres}): ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean);
  return `Hola Onmilife, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function renderCart(animar = false) {
  const body = $('#cart-body');
  const foot = $('#cart-foot');
  if (!body) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const n = Cart.count();
  $$('[data-cart-resumen]').forEach(el => { el.textContent = n ? `· ${n} ${n === 1 ? 'producto' : 'productos'}` : ''; });
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <span class="drawer-vacio-icono">${ICONOS.bolsa}</span>
      <h3>Tu carrito está vacío</h3>
      <p>Sumá colágeno, vitaminas o una infusión para tu rutina.</p>
      <button type="button" class="btn btn--cta" data-ir-tienda>Ir a la tienda</button>
    </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = `<div class="drawer-items">${items.map(i => cartItemHTML(i, animar)).join('')}</div>`;
  const total = $('#cart-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = $('#cart-wsp');
  if (wsp) wsp.href = waLink(mensajePedido(items));
}

function openCartDrawer() {
  if (!drawer || drawer.classList.contains('open')) return;
  let volver = document.activeElement;
  if (qv && !qv.hidden) {
    volver = capas.find(c => c.panel === qv)?.volver || volver;
    cerrarQV(false);
  }
  renderCart(true);
  drawer.removeAttribute('inert');
  drawer.classList.add('open');
  drawerBd?.classList.add('open');
  abrirCapa(drawer, closeCartDrawer, volver);
  setTimeout(() => $('#cart-cerrar')?.focus(), 60);
}

function closeCartDrawer() {
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  drawerBd?.classList.remove('open');
  drawer.setAttribute('inert', '');
  quitarCapa(drawer);
}

function initCartDrawer() {
  if (!drawer) return;
  $('#cart-cerrar')?.addEventListener('click', closeCartDrawer);
  drawerBd?.addEventListener('click', closeCartDrawer);
  $('#cart-body')?.addEventListener('click', e => {
    if (e.target.closest('[data-ir-tienda]')) { closeCartDrawer(); irA('tienda'); return; }
    const item = e.target.closest('[data-item]');
    if (!item) return;
    const id = item.dataset.item;
    const step = e.target.closest('[data-cart-step]');
    if (step) { Cart.setQty(id, Cart.qtyDe(id) + Number(step.dataset.cartStep)); return; }
    if (e.target.closest('[data-cart-quitar]')) {
      const p = getProducto(id);
      Cart.remove(id);
      if (p) showToast(`Sacaste ${p.nombre} del carrito`);
      setTimeout(() => { if (drawer.classList.contains('open')) ($('#cart-cerrar'))?.focus(); }, 0);
    }
  });
  $('#cart-finalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCart(false); });
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  let wspVisto = false;
  const sync = () => {
    const scrolled = window.scrollY > 600;
    if (scrolled) wspVisto = true;
    wsp?.classList.toggle('visible', wspVisto);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function leerCantidad(cont) {
  return Math.max(1, Number(cont?.querySelector('.stepper-n')?.textContent) || 1);
}

function resetStepper(cont) {
  const st = cont?.querySelector('.stepper[data-max]');
  if (!st) return;
  st.querySelector('.stepper-n').textContent = '1';
  const [menos, mas] = st.querySelectorAll('[data-step]');
  menos.disabled = true;
  mas.disabled = Number(st.dataset.max) <= 1;
}

function agregar(id, cont) {
  const p = getProducto(id);
  if (!p || p.stock <= 0) return false;
  const qty = leerCantidad(cont);
  const antes = Cart.qtyDe(id);
  if (antes >= p.stock) { showToast(`Ya tenés las ${p.stock} unidades disponibles en el carrito`); return false; }
  Cart.add(p, qty);
  const sumadas = Cart.qtyDe(id) - antes;
  updateCartBadge(true);
  showToast(sumadas < qty ? `Sumaste ${sumadas}: es el stock disponible de ${p.nombre}` : `Sumaste ${sumadas} × ${p.nombre} al carrito`);
  resetStepper(cont);
  return true;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const st = step.closest('.stepper');
      const n = st.querySelector('.stepper-n');
      const max = Number(st.dataset.max) || 99;
      const v = Math.max(1, Math.min(max, (Number(n.textContent) || 1) + Number(step.dataset.step)));
      n.textContent = v;
      const [menos, mas] = st.querySelectorAll('[data-step]');
      menos.disabled = v <= 1;
      mas.disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, add.closest('[data-prod]')); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const id = buy.dataset.buy;
      const p = getProducto(id);
      const cont = buy.closest('[data-prod]');
      if (p && Cart.qtyDe(id) < p.stock) { Cart.add(p, leerCantidad(cont)); updateCartBadge(true); resetStepper(cont); }
      openCartDrawer();
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQV(quick.dataset.quick);
  });
}

const qv = $('#qv');
const qvDialog = $('#qv-dialog');

function qvHTML(p) {
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.formato === p.formato && x.stock > 0)
    .concat(PRODUCTOS.filter(x => x.id !== p.id && x.formato !== p.formato && x.para.some(n => p.para.includes(n)) && x.stock > 0))
    .slice(0, 3);
  const stockTxt = p.stock <= 0 ? 'Sin stock por ahora' : p.stock <= POCAS ? `Últimas ${p.stock} unidades` : 'En stock';
  const stockCls = p.stock <= 0 ? 'sin' : p.stock <= POCAS ? 'pocas' : '';
  const acciones = p.stock > 0
    ? `<div class="qv-acciones" data-prod="${p.id}">${stepperHTML(p.stock)}
        <button type="button" class="prod-add" data-add="${p.id}">${ICONOS.carrito}<span>Agregar al carrito</span></button>
        <button type="button" class="btn btn--ghost" data-buy="${p.id}">Comprar ahora</button></div>`
    : `<div class="qv-acciones"><a class="btn btn--cta" href="${waLink(`Hola Onmilife, ¿cuándo vuelve a entrar ${p.nombre} (${p.pres})?`)}" target="_blank" rel="noopener">Avisame por WhatsApp cuando llegue</a></div>`;
  return `<button type="button" class="qv-cerrar" data-qv-cerrar aria-label="Cerrar el detalle">${ICONOS.cerrar}</button>
    <div class="qv-galeria">
      <div class="qv-principal"><img id="qv-img" src="images/${p.img}.webp" alt="${esc(`${p.nombre}, ${p.pres}`)}" width="640" height="800"></div>
      <div class="qv-thumbs">
        <button type="button" class="qv-thumb" aria-pressed="true" data-qv-src="images/${p.img}.webp" data-fit="cover" aria-label="Ver la foto del producto"><img src="images/${p.img}.webp" alt="" width="640" height="800"></button>
        <button type="button" class="qv-thumb" aria-pressed="false" data-qv-src="images/${p.escena}.webp" data-fit="contain" aria-label="Ver la foto de la línea"><img src="images/${p.escena}.webp" alt="" width="1000" height="1000"></button>
      </div>
    </div>
    <div class="qv-info">
      <div class="qv-tags"><span class="qv-tag qv-tag--formato">${FORMATOS[p.formato]}</span>${p.para.map(n => `<span class="qv-tag">${esc(NECESIDADES[n].nombre)}</span>`).join('')}</div>
      <h2>${esc(p.nombre)}</h2>
      <p class="qv-pres">${esc(p.pres)}</p>
      <p class="qv-precio">${precioHTML(p)}${p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
      <p class="qv-stock ${stockCls}">${stockTxt}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <p class="qv-uso"><strong>Modo de uso:</strong> seguí la indicación del envase o la de tu profesional de la salud.</p>
      ${acciones}
      <a class="link-flecha qv-wsp" href="${waLink(`Hola Onmilife, quiero consultar por ${p.nombre} (${p.pres}).`)}" target="_blank" rel="noopener"><span>Consultar por este producto</span>${ICONOS.flecha}</a>
      <p class="qv-legal">Suplemento dietario. No es un medicamento ni reemplaza un tratamiento. Consultá a tu médico si estás embarazada, en período de lactancia o tomás medicación.</p>
      ${rel.length ? `<div class="qv-relacionados"><p>También te puede interesar</p><div class="qv-rel-lista">${rel.map(r => `<button type="button" class="qv-rel" data-quick="${r.id}"><span class="qv-rel-foto"><img src="images/${r.img}.webp" alt="" width="640" height="800"></span><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;
}

function ldProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!p) { s?.remove(); return; }
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  const url = new URL(location.href);
  url.search = `?producto=${p.id}`;
  url.hash = '';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    sku: p.id,
    image: new URL(`images/${p.img}.webp`, location.href).href,
    brand: { '@type': 'Brand', name: 'Onmilife' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: url.href },
  });
}

function urlProducto(id) {
  try {
    const url = new URL(location.href);
    if (id) url.searchParams.set('producto', id); else url.searchParams.delete('producto');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch { /* sin history */ }
}

function abrirQV(id) {
  const p = getProducto(id);
  if (!p || !qv || !qvDialog) return;
  const yaAbierto = !qv.hidden;
  qvDialog.innerHTML = qvHTML(p);
  qvDialog.scrollTop = 0;
  ldProducto(p);
  urlProducto(p.id);
  if (!yaAbierto) {
    qv.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
    abrirCapa(qv, cerrarQV);
  }
  setTimeout(() => $('[data-qv-cerrar]', qvDialog)?.focus(), 60);
}

function cerrarQV(devolverFoco = true) {
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  qv.hidden = true;
  qvDialog.innerHTML = '';
  ldProducto(null);
  urlProducto('');
  const i = capas.findIndex(c => c.panel === qv);
  if (i >= 0) {
    if (devolverFoco) quitarCapa(qv);
    else { capas.splice(i, 1); if (!capas.length) document.body.classList.remove('no-scroll'); }
  }
}

function initQV() {
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('[data-qv-cerrar]')) { cerrarQV(); return; }
    const th = e.target.closest('[data-qv-src]');
    if (th) {
      const img = $('#qv-img', qvDialog);
      if (!img) return;
      img.src = th.dataset.qvSrc;
      img.style.objectFit = th.dataset.fit;
      $$('[data-qv-src]', qvDialog).forEach(b => b.setAttribute('aria-pressed', String(b === th)));
    }
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQV(id);
}

function initLeeScroll() {
  const el = $('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  const ws = $$('.w', el);
  if (reduceMotion) { ws.forEach(w => w.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.45)));
    const n = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
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
    .from(hero.querySelectorAll('.sello, .hero-badge, .hero-mini'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  $$('.arco img, .marca-foto img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

document.addEventListener('cart:updated', () => updateCartBadge());
Cart.syncStock(PRODUCTOS);
initModelBarScroll();
initLineas();
initCatalogo();
initRail();
initGuia();
initLeeScroll();
initReveals();
initNav();
initAcciones();
initCartDrawer();
initQV();
initFloats();
initHeroMotion();
initParallax();
updateCartBadge();
