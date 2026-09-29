/* global Flip, performance */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const clamp01 = v => Math.max(0, Math.min(1, v));
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const WSP = '5491154192628';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const IMG = {
  'cocina-16x9.webp': [1672, 941],
  'lavarropas-9x16.webp': [941, 1672],
  'freidora-1x1.webp': [1254, 1254],
  'cafetera-1x1.webp': [1254, 1254],
  'licuadora-1x1.webp': [1254, 1254],
  'aspiradora-1x1.webp': [1254, 1254],
};

const ICONOS = {
  blanca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 13.5h14M12 2.5v11M10 6v4M14 6v4"/></svg>',
  lavado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M4 7h16"/><circle cx="12" cy="14" r="4.5"/><path d="M7.5 4.8h.01"/></svg>',
  cocina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h.01M18 12h.01M18 15h.01"/></svg>',
  cafe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9Z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5c0 1.5-1 1.5-1 3M12 2.5c0 1.5-1 1.5-1 3"/></svg>',
  limpieza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3.5 9.5 17"/><rect x="13.5" y="2" width="5" height="5" rx="1.5"/><path d="M5 17.5h9a2 2 0 0 1 2 2v.5H3v-.5a2 2 0 0 1 2-2Z"/></svg>',
  mesada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4h19v4h-19zM2.5 18.5h19M7 18.5v-7h5v7M15 18.5v-5h4v5"/></svg>',
  medir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/></svg>',
};

const CATEGORIAS = [
  { id: 'blanca', label: 'Línea blanca', largo: 'Heladeras y lavarropas', frase: 'línea blanca' },
  { id: 'cocina', label: 'Cocina', largo: 'Micro, freidora y tostadora', frase: 'la cocina' },
  { id: 'cafe', label: 'Café y licuados', largo: 'Cafeteras y licuadoras', frase: 'café y licuados' },
  { id: 'limpieza', label: 'Limpieza', largo: 'Aspiradoras', frase: 'limpieza' },
];

const TERMINACIONES = [
  { id: 'acero', label: 'Acero inoxidable', color: '#B9BEC6' },
  { id: 'negro', label: 'Negro', color: '#1F2937' },
  { id: 'blanco', label: 'Blanco', color: '#F4F5F7' },
  { id: 'color', label: 'Con color', color: '#2563EB' },
];

const PRODUCTOS = [
  {
    id: 1, slug: 'heladera-french-door', corto: 'Heladera French Door', nombre: 'Heladera French Door No Frost con dispenser', cat: 'blanca', precio: 2899999, descuento: 0, stock: 4, orden: 1,
    energia: 'A+', terminacion: 'acero', medidor: 'heladera', forma: 'heladera', tags: 'heladera no frost french door dispenser agua freezer acero inoxidable',
    variantes: { tipo: 'capacidad', titulo: 'Capacidad', opciones: [{ v: '540 L', precio: 2899999, medidas: [84, 177, 73] }, { v: '600 L', precio: 3299999, medidas: [91, 178, 75] }] },
    desc: 'Dos puertas arriba y cajón freezer abajo. No Frost, dispenser de agua en la puerta y luz LED.',
    img: 'cocina-16x9.webp', foco: [0.205, 0.32, 2], galeria: [['cocina-16x9.webp', [0.16, 0.45, 3.6]]],
    alt: 'Heladera French Door de acero inoxidable con dispenser de agua',
  },
  {
    id: 2, slug: 'lavarropas-inverter', corto: 'Lavarropas inverter', nombre: 'Lavarropas carga frontal inverter', cat: 'blanca', precio: 999999, descuento: 0, stock: 6, orden: 3, nuevo: true,
    energia: 'A', terminacion: 'blanco', medidor: 'lavarropas', forma: 'lavarropas', tags: 'lavarropas automatico frontal inverter ropa',
    variantes: { tipo: 'capacidad', titulo: 'Capacidad', opciones: [{ v: '8 kg', precio: 999999, medidas: [60, 85, 55] }, { v: '10 kg', precio: 1249999, medidas: [60, 85, 62] }] },
    desc: 'Motor inverter, 15 programas y centrifugado regulable. De carga frontal: entra debajo de una mesada.',
    img: 'lavarropas-9x16.webp', foco: [0.51, 0.525, 1.2], galeria: [['lavarropas-9x16.webp', [0.55, 0.33, 3.4]]],
    alt: 'Lavarropas blanco de carga frontal con toallas de colores en el tambor',
  },
  {
    id: 3, slug: 'microondas-digital', corto: 'Microondas', nombre: 'Microondas digital de acero', cat: 'cocina', precio: 219999, descuento: 0, stock: 9, orden: 6,
    terminacion: 'acero', medidor: 'mesada', forma: 'microondas', extra: { ancho: 6, motivo: 'la ventilación de los costados' }, tags: 'microondas digital acero',
    variantes: { tipo: 'capacidad', titulo: 'Capacidad', opciones: [{ v: '25 L', precio: 219999, medidas: [48, 28, 38] }, { v: '30 L', precio: 269999, medidas: [52, 31, 42] }] },
    desc: 'Panel digital, 10 niveles de potencia y descongelado por peso.',
    img: 'cocina-16x9.webp', foco: [0.405, 0.48, 3.2], galeria: [],
    alt: 'Microondas de acero con panel digital sobre la mesada',
  },
  {
    id: 4, slug: 'freidora-de-aire-5', corto: 'Freidora de aire', nombre: 'Freidora de aire 5 L', cat: 'cocina', precio: 149999, descuento: 15, stock: 10, orden: 2,
    terminacion: 'negro', medidor: 'mesada', forma: 'freidora', medidas: [29, 33, 36], extra: { alto: 5, prof: 5, motivo: 'la salida de aire caliente' }, tags: 'freidora aire airfryer sin aceite papas',
    desc: 'Cocina crocante con muy poco aceite. Canasto antiadherente y perilla con temporizador.',
    img: 'freidora-1x1.webp', foco: [0.55, 0.5, 1.05], galeria: [['freidora-1x1.webp', [0.5, 0.47, 2.1]]],
    alt: 'Freidora de aire negra con papas fritas en el canasto',
  },
  {
    id: 5, slug: 'tostadora-acero', corto: 'Tostadora', nombre: 'Tostadora 2 ranuras de acero', cat: 'cocina', precio: 54999, descuento: 0, stock: 14, orden: 8,
    terminacion: 'acero', medidor: 'mesada', forma: 'tostadora', medidas: [30, 19, 18], tags: 'tostadora pan desayuno acero',
    desc: 'Dos ranuras anchas, siete niveles de tostado y bandeja para migas.',
    img: 'cocina-16x9.webp', foco: [0.87, 0.64, 3], galeria: [],
    alt: 'Tostadora de acero con dos tostadas',
  },
  {
    id: 6, slug: 'cafetera-espresso', corto: 'Cafetera espresso', nombre: 'Cafetera espresso 15 bar con espumador', cat: 'cafe', precio: 249999, descuento: 0, stock: 7, orden: 5, nuevo: true,
    terminacion: 'acero', medidor: 'mesada', forma: 'cafetera', medidas: [29, 31, 26], tags: 'cafetera espresso cafe capuccino espumador',
    desc: 'Bomba de 15 bar para espresso con crema y vaporizador para espumar la leche.',
    img: 'cafetera-1x1.webp', foco: [0.5, 0.52, 1.05], galeria: [['cafetera-1x1.webp', [0.55, 0.62, 2.2]]],
    alt: 'Cafetera espresso negra y de acero con dos cafés recién servidos',
  },
  {
    id: 7, slug: 'cafetera-de-filtro', corto: 'Cafetera de filtro', nombre: 'Cafetera de filtro 1,5 L', cat: 'cafe', precio: 79999, descuento: 0, stock: 12, orden: 4,
    terminacion: 'negro', medidor: 'mesada', forma: 'cafetera', medidas: [25, 36, 22], tags: 'cafetera filtro cafe jarra',
    desc: 'Jarra de vidrio de 1,5 L, placa que mantiene el café caliente y filtro permanente.',
    img: 'cocina-16x9.webp', foco: [0.712, 0.59, 2.75], galeria: [],
    alt: 'Cafetera de filtro con jarra de vidrio',
  },
  {
    id: 8, slug: 'licuadora-vaso-vidrio', corto: 'Licuadora de vidrio', nombre: 'Licuadora con vaso de vidrio 1,5 L', cat: 'cafe', precio: 89999, descuento: 0, stock: 11, orden: 7,
    terminacion: 'acero', medidor: 'mesada', forma: 'licuadora', medidas: [20, 40, 20], extra: { alto: 10, motivo: 'para sacar el vaso' }, tags: 'licuadora batidos licuados vidrio frutas',
    desc: 'Vaso de vidrio de 1,5 L, cinco velocidades y función pulso para picar hielo.',
    img: 'licuadora-1x1.webp', foco: [0.52, 0.5, 1.05], galeria: [['licuadora-1x1.webp', [0.52, 0.8, 2.4]]],
    alt: 'Licuadora de acero con vaso de vidrio lleno de frutas',
  },
  {
    id: 9, slug: 'licuadora-1000w', corto: 'Licuadora 1.000 W', nombre: 'Licuadora 1.000 W con vaso de 2 L', cat: 'cafe', precio: 119999, descuento: 0, stock: 8, orden: 9,
    terminacion: 'acero', medidor: 'mesada', forma: 'licuadora', medidas: [22, 44, 22], extra: { alto: 10, motivo: 'para sacar el vaso' }, tags: 'licuadora potente batidos licuados hielo',
    desc: 'Motor de 1.000 W para batidos, hielo y sopas. Vaso de 2 L con tapa dosificadora.',
    img: 'cocina-16x9.webp', foco: [0.585, 0.545, 2.35], galeria: [],
    alt: 'Licuadora de acero con el vaso lleno de frutas',
  },
  {
    id: 10, slug: 'aspiradora-inalambrica', corto: 'Aspiradora inalámbrica', nombre: 'Aspiradora inalámbrica tipo escoba', cat: 'limpieza', precio: 349999, descuento: 0, stock: 3, orden: 10,
    terminacion: 'color', tags: 'aspiradora inalambrica escoba sin cable bateria',
    desc: 'Sin cables: batería recargable, cepillo motorizado y soporte para colgarla en la pared.',
    img: 'aspiradora-1x1.webp', foco: [0.55, 0.5, 1.05], galeria: [['aspiradora-1x1.webp', [0.6, 0.2, 2.6]]],
    alt: 'Aspiradora inalámbrica tipo escoba apoyada contra la pared del living',
  },
];

const RAIL = [1, 4, 2, 6, 10, 8];

const TIPOS_MEDIDOR = [
  { id: 'heladera', label: 'Heladera', icono: 'blanca', holgura: { ancho: 5, alto: 10, prof: 10 }, rango: { ancho: [60, 120], alto: [150, 220], prof: [55, 100] }, def: { ancho: 90, alto: 190, prof: 85 }, uno: 'heladera', varios: 'heladeras', fem: true, cat: 'blanca' },
  { id: 'lavarropas', label: 'Lavarropas', icono: 'lavado', holgura: { ancho: 2, alto: 2, prof: 8 }, rango: { ancho: [50, 90], alto: [70, 120], prof: [45, 90] }, def: { ancho: 64, alto: 90, prof: 68 }, uno: 'lavarropas', varios: 'lavarropas', cat: 'blanca' },
  { id: 'mesada', label: 'Mesada', icono: 'mesada', holgura: { ancho: 4, alto: 8, prof: 5 }, rango: { ancho: [20, 120], alto: [25, 80], prof: [20, 70] }, def: { ancho: 70, alto: 50, prof: 50 }, uno: 'equipo', varios: 'equipos', cat: 'cocina' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const catDe = id => CATEGORIAS.find(c => c.id === id) || { id, label: id, largo: id, frase: id };
const terminacionDe = id => TERMINACIONES.find(t => t.id === id);
const opcionesDe = p => p?.variantes?.opciones || [];
const opcionDe = (p, v) => opcionesDe(p).find(o => o.v === v);
const varianteValida = (p, v) => (opcionesDe(p).length ? !!opcionDe(p, v) : !v);
const varDefault = p => opcionesDe(p)[0]?.v || '';
const conDescuento = (p, base) => (p.descuento > 0 ? Math.round(base * (1 - p.descuento / 100)) : base);
const precioBase = (p, v = varDefault(p)) => opcionDe(p, v)?.precio ?? p.precio;
const precioDe = (p, v = varDefault(p)) => conDescuento(p, precioBase(p, v));
const precioDesde = p => Math.min(...(opcionesDe(p).length ? opcionesDe(p).map(o => precioDe(p, o.v)) : [precioDe(p)]));
const medidasDe = (p, v = varDefault(p)) => opcionDe(p, v)?.medidas || p.medidas || null;
const productosDeCat = id => PRODUCTOS.filter(p => p.cat === id);
const nombreConVariante = (p, v) => (v ? `${p.nombre} · ${v}` : p.nombre);
const cortoConVariante = (p, v) => (v ? `${p.corto} · ${v}` : p.corto);
const cm = n => `${n} cm`;
const medidasTxt = m => `${m[0]} × ${m[1]} × ${m[2]} cm`;

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const Cart = {
  KEY: 'electrohogarsanvi_cart',
  enMemoria: null,
  leer() {
    if (this.enMemoria) return this.enMemoria.map(i => ({ ...i }));
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; }
  },
  get() {
    const crudo = this.leer();
    if (!Array.isArray(crudo)) return [];
    return crudo.reduce((lista, i) => {
      const p = getProducto(i?.id);
      const v = typeof i?.v === 'string' ? i.v : '';
      const qty = Math.floor(Number(i?.qty));
      if (!p || !varianteValida(p, v) || !(qty > 0) || p.stock <= 0) return lista;
      const previo = lista.find(x => x.id === p.id && x.v === v);
      if (previo) previo.qty = Math.min(previo.qty + qty, p.stock);
      else lista.push({ id: p.id, v, qty: Math.min(qty, p.stock) });
      return lista;
    }, []);
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); this.enMemoria = null; } catch { this.enMemoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = varDefault(producto)) {
    if (!producto || !varianteValida(producto, v)) return 0;
    const items = this.get();
    const enLinea = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const existing = items.find(i => i.id === producto.id && i.v === v);
    const suma = Math.min(qty, Math.max(0, (producto.stock ?? 99) - enLinea));
    if (suma <= 0) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === Number(id) && i.v === v);
    if (!it) return;
    const p = getProducto(id);
    const otras = items.filter(i => i.id === Number(id) && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otras));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === Number(id) && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1000px)');
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

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

let ultimoFoco = null;
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

const scrollSuave = el => el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function pintarRecortes() {
  document.querySelectorAll('[data-recorte]').forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    const r = el.getBoundingClientRect();
    const ar = r.width && r.height ? r.width / r.height : 1;
    el.setAttribute('style', recorte(img, [Number(cx), Number(cy), Number(z)], ar));
  });
}

function initRecortesEstaticos() {
  pintarRecortes();
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(pintarRecortes, 160); }, { passive: true });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    el.textContent = cuantos(productosDeCat(el.dataset.cuentaCat).length, 'producto', 'productos');
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    const lista = productosDeCat(el.dataset.desde);
    if (!lista.length) return;
    el.textContent = `desde ${formatearPrecio(Math.min(...lista.map(precioDesde)))}`;
    const n = el.nextElementSibling;
    if (n) n.textContent = cuantos(lista.length, 'modelo', 'modelos');
  });
  document.querySelectorAll('[data-total-tienda]').forEach(el => {
    el.textContent = `${cuantos(PRODUCTOS.length, 'producto', 'productos')} en ${CATEGORIAS.length} categorías, con las medidas en cada ficha.`;
  });
}

const ICONO_CARRITO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function badgeHTML(p) {
  if (p.stock <= 0) return '<span class="prod-badge">Sin stock</span>';
  if (p.descuento > 0) return `<span class="prod-badge desc">-${p.descuento}%</span>`;
  if (p.nuevo) return '<span class="prod-badge nuevo">Nuevo</span>';
  if (p.stock <= 3) return '<span class="prod-badge">Últimas unidades</span>';
  return '';
}

const energiaHTML = (p, clase = '') => (p.energia ? `<span class="energia ${clase}" data-clase="${p.energia}" title="Eficiencia energética ${p.energia}">${p.energia}</span>` : '');

function precioHTML(p, v = varDefault(p)) {
  const base = precioBase(p, v);
  const final = precioDe(p, v);
  return p.descuento > 0 ? `<s>${formatearPrecio(base)}</s><span class="con-desc">${formatearPrecio(final)}</span>` : `<span>${formatearPrecio(final)}</span>`;
}

function metaHTML(p, v = varDefault(p)) {
  const partes = [`<span>${esc(catDe(p.cat).label)}</span>`];
  if (v) partes.push(`<span>${esc(v)}</span>`);
  const m = medidasDe(p, v);
  if (m) partes.push(`<span>${m[0]} cm de ancho</span>`);
  return partes.join('<span aria-hidden="true">·</span>');
}

const Filtro = { cats: new Set(), terminaciones: new Set(), precioMax: null, q: '', orden: 'destacados', ids: null, idsTxt: '', sugeridas: new Map() };
const varMostrada = p => (Filtro.sugeridas.has(p.id) && varianteValida(p, Filtro.sugeridas.get(p.id)) ? Filtro.sugeridas.get(p.id) : varDefault(p));

function cardInnerHTML(p) {
  const v = varMostrada(p);
  const nombre = nombreConVariante(p, v);
  return `<button type="button" class="prod-media recorte" data-open-quickview="${p.id}" data-v="${esc(v)}" style="${recorte(p.img, p.foco, 1)}" aria-label="Ver ${esc(nombre)}">
      ${badgeHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="600" height="600">
      ${energiaHTML(p, 'prod-energia')}
    </button>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="meta">${metaHTML(p, v)}</p>
      <div class="prod-pie">
        <p class="precio">${precioHTML(p, v)}</p>
        <div class="prod-actions">
          ${p.stock > 0 ? `<button type="button" class="btn-add prod-add" data-add="${p.id}" data-v="${esc(v)}" aria-label="Agregar ${esc(nombre)} al carrito">${ICONO_CARRITO_MAS}<span>Agregar</span></button>` : '<button type="button" class="btn-add prod-add" disabled>Sin stock</button>'}
        </div>
      </div>
    </div>`;
}

const cardHTML = p => `<article class="prod cat-${p.cat}" data-id="${p.id}" data-v="${esc(varMostrada(p))}">${cardInnerHTML(p)}</article>`;

function railCardHTML(p) {
  const v = varDefault(p);
  return `<button type="button" class="rail-card cat-${p.cat}" data-open-quickview="${p.id}" aria-label="Ver ${esc(nombreConVariante(p, v))}">
    <span class="rail-media recorte" style="${recorte(p.img, p.foco, 1)}">
      ${badgeHTML(p)}
      <img src="images/${p.img}" alt="${esc(p.alt)}" width="480" height="480">
      ${energiaHTML(p, 'prod-energia')}
    </span>
    <span class="rail-body">
      <span class="rail-nombre">${esc(p.nombre)}</span>
      <span class="meta">${metaHTML(p, v)}</span>
      <span class="rail-fila"><span class="precio">${opcionesDe(p).length > 1 ? '<small class="desde">desde</small>' : ''}${precioHTML(p, v)}</span><span class="rail-ver" aria-hidden="true">Ver</span></span>
    </span>
  </button>`;
}

function agregar(p, qty = 1, v = varDefault(p)) {
  if (!p) return 0;
  const nombre = nombreConVariante(p, v);
  if (p.stock <= 0) { showToast(`${p.nombre} está sin stock por ahora`); return 0; }
  const n = Cart.add(p, qty, v);
  showToast(n ? `Sumaste ${n > 1 ? `${n} × ` : ''}${nombre} al carrito` : `Ya tenés en el carrito todas las unidades de ${p.nombre}`);
  return n;
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('[data-rail-track]');
  track.innerHTML = RAIL.map(getProducto).filter(Boolean).map(railCardHTML).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
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
      try { vp.setPointerCapture?.(pointerId); } catch { pointerId = null; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { if (pointerId !== null) vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (moved) {
      requestAnimationFrame(() => vp.classList.remove('dragging'));
      setTimeout(() => { moved = false; }, 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => {
    const card = track.querySelector('.rail-card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 18;
    return card ? card.getBoundingClientRect().width + gap : 300;
  };
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 4;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

const PAGINA = 16;
let visibles = PAGINA;
const Catalogo = {};

function textoBusqueda(p) {
  return normalizar([p.nombre, catDe(p.cat).label, catDe(p.cat).largo, p.desc, p.tags, terminacionDe(p.terminacion)?.label, p.energia ? `clase ${p.energia}` : '', ...opcionesDe(p).map(o => o.v)].filter(Boolean).join(' '));
}

function filtrar() {
  const palabras = normalizar(Filtro.q).split(/\s+/).filter(w => w.length > 1);
  let lista = PRODUCTOS.filter(p => {
    if (Filtro.ids && !Filtro.ids.has(p.id)) return false;
    if (Filtro.cats.size && !Filtro.cats.has(p.cat)) return false;
    if (Filtro.terminaciones.size && !Filtro.terminaciones.has(p.terminacion)) return false;
    if (Filtro.precioMax && precioDesde(p) > Filtro.precioMax) return false;
    if (palabras.length) {
      const t = textoBusqueda(p);
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
  });
  if (Filtro.orden === 'precio-asc') lista = [...lista].sort((a, b) => precioDesde(a) - precioDesde(b));
  else if (Filtro.orden === 'precio-desc') lista = [...lista].sort((a, b) => precioDesde(b) - precioDesde(a));
  else if (Filtro.orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = [...lista].sort((a, b) => a.orden - b.orden);
  return lista;
}

function contarHasta(el, destino) {
  if (!el) return;
  const desde = Number(el.textContent) || 0;
  if (reduceMotion || desde === destino) { el.textContent = destino; return; }
  const t0 = performance.now();
  const dur = 520;
  const paso = t => {
    const k = clamp01((t - t0) / dur);
    el.textContent = Math.round(desde + (destino - desde) * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
  setTimeout(() => { el.textContent = destino; }, dur + 120);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const seccion = root.closest('.tienda');
  const grid = root.querySelector('[data-grid]');
  const filtros = root.querySelector('.filtros');
  const resultados = root.querySelector('[data-resultados]');
  const buscador = root.querySelector('[data-buscador]');
  const orden = root.querySelector('[data-orden]');
  const vermas = root.querySelector('[data-vermas]');
  const vacio = root.querySelector('[data-vacio]');
  const inicio = root.querySelector('[data-catalogo-inicio]');
  const precio = root.querySelector('[data-precio]');
  const precioValor = root.querySelector('[data-precio-valor]');
  const verResultados = root.querySelector('[data-ver-resultados]');
  const activos = root.querySelector('[data-filtros-activos]');
  const barra = seccion.querySelector('[data-cat-barra]');
  const banda = seccion.querySelector('[data-cat-banda]');
  const bandaN = banda?.querySelector('[data-banda-n]');
  const bandaTxt = banda?.querySelector('[data-banda-txt]');

  grid.innerHTML = PRODUCTOS.map(cardHTML).join('');
  const cards = new Map([...grid.querySelectorAll('.prod')].map(el => [Number(el.dataset.id), el]));

  barra.innerHTML = `<button type="button" class="chip" data-chip-cat="" aria-pressed="true"><span class="chip-punto">${ICONOS.medir}</span>Todo<em>${PRODUCTOS.length}</em></button>` +
    CATEGORIAS.map(c => `<button type="button" class="chip cat-${c.id}" data-chip-cat="${c.id}" aria-pressed="false"><span class="chip-punto">${ICONOS[c.id]}</span>${esc(c.label)}<em>${productosDeCat(c.id).length}</em></button>`).join('');

  const opcion = (grupo, id, label, n, color) => `<label class="filtro-opcion"><input type="checkbox" data-f="${grupo}" value="${id}">${color ? `<i class="punto-color" style="--c:${color}"></i>` : ''} ${esc(label)}<em>${n}</em></label>`;
  root.querySelector('[data-grupo="cat"]').innerHTML = CATEGORIAS.map(c => opcion('cat', c.id, c.label, productosDeCat(c.id).length)).join('');
  root.querySelector('[data-grupo="terminacion"]').innerHTML = TERMINACIONES.filter(t => PRODUCTOS.some(p => p.terminacion === t.id)).map(t => opcion('terminacion', t.id, t.label, PRODUCTOS.filter(p => p.terminacion === t.id).length, t.color)).join('');

  const precios = PRODUCTOS.map(precioDesde);
  const pMin = Math.floor(Math.min(...precios) / 10000) * 10000;
  const pMax = Math.ceil(Math.max(...precios) / 10000) * 10000;
  precio.min = pMin; precio.max = pMax; precio.step = 10000; precio.value = pMax;
  const pintarPrecio = () => {
    precioValor.textContent = Number(precio.value) >= pMax ? 'Todos los precios' : `Hasta ${formatearPrecio(Number(precio.value))}`;
    precio.style.setProperty('--pct', `${((Number(precio.value) - pMin) / (pMax - pMin)) * 100}%`);
  };
  pintarPrecio();

  const sets = { cat: 'cats', terminacion: 'terminaciones' };
  const leer = () => {
    Object.entries(sets).forEach(([g, k]) => { Filtro[k] = new Set([...root.querySelectorAll(`input[data-f="${g}"]:checked`)].map(i => i.value)); });
    Filtro.precioMax = Number(precio.value) < pMax ? Number(precio.value) : null;
  };
  const escribir = () => {
    Object.entries(sets).forEach(([g, k]) => { root.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = Filtro[k].has(i.value); }); });
    precio.value = Filtro.precioMax || pMax;
    pintarPrecio();
    if (buscador) buscador.value = Filtro.q;
    if (orden) orden.value = Filtro.orden;
  };

  const chipsActivos = () => {
    const chips = [];
    if (Filtro.ids) chips.push({ tipo: 'ids', id: '', txt: Filtro.idsTxt || 'Los que entran' });
    Filtro.cats.forEach(id => chips.push({ tipo: 'cat', id, txt: catDe(id).label }));
    Filtro.terminaciones.forEach(id => chips.push({ tipo: 'terminacion', id, txt: terminacionDe(id)?.label || id }));
    if (Filtro.precioMax) chips.push({ tipo: 'precio', id: '', txt: `Hasta ${formatearPrecio(Filtro.precioMax)}` });
    if (Filtro.q.trim()) chips.push({ tipo: 'q', id: '', txt: `«${Filtro.q.trim()}»` });
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar="${c.tipo}|${esc(c.id)}" aria-label="Quitar el filtro ${esc(c.txt)}">${esc(c.txt)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`).join('');
  };

  const sincronizarBarra = () => {
    const unica = Filtro.cats.size === 1 && !Filtro.ids ? [...Filtro.cats][0] : (Filtro.cats.size === 0 && !Filtro.ids ? '' : null);
    barra.querySelectorAll('[data-chip-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chipCat === unica)));
  };

  const pintarBanda = n => {
    if (!banda) return;
    CATEGORIAS.forEach(c => banda.classList.toggle(`cat-${c.id}`, Filtro.cats.size === 1 && Filtro.cats.has(c.id)));
    const soloCat = Filtro.cats.size === 1 ? catDe([...Filtro.cats][0]) : null;
    const otros = Filtro.terminaciones.size || Filtro.precioMax || Filtro.q.trim() || Filtro.ids;
    const palabra = n === 1 ? 'producto' : 'productos';
    if (Filtro.ids && !soloCat) bandaTxt.textContent = `${palabra} que entran en tu espacio`;
    else if (soloCat) bandaTxt.textContent = `${palabra} de ${soloCat.frase}${otros ? ' con estos filtros' : ''}`;
    else bandaTxt.textContent = otros ? `${palabra} con estos filtros` : `${palabra} en toda la tienda`;
    contarHasta(bandaN, n);
  };

  const pintarVariantes = () => {
    cards.forEach((el, id) => {
      const p = getProducto(id);
      const v = varMostrada(p);
      if (el.dataset.v === v) return;
      el.dataset.v = v;
      el.innerHTML = cardInnerHTML(p);
    });
  };

  let flipActual = null;
  let reasientos = [];
  let idsPrev = new Set();
  const asentar = ids => {
    cards.forEach((el, id) => {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(el);
      ['opacity', 'transform', 'position', 'left', 'top', 'width', 'height', 'margin', 'translate', 'rotate', 'scale'].forEach(prop => el.style.removeProperty(prop));
      el.style.display = ids.has(id) ? '' : 'none';
    });
  };
  const ordenar = lista => {
    const vistos = new Set();
    lista.forEach(p => { grid.appendChild(cards.get(p.id)); vistos.add(p.id); });
    cards.forEach((el, id) => { if (!vistos.has(id)) grid.appendChild(el); });
  };
  const revelarTodo = () => cards.forEach(el => el.classList.remove('pre'));

  const render = (reset = true, animar = false) => {
    if (reset) visibles = PAGINA;
    const lista = filtrar();
    const ids = new Set(lista.slice(0, visibles).map(p => p.id));
    resultados.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;
    if (verResultados) verResultados.textContent = `Ver ${cuantos(lista.length, 'producto', 'productos')}`;
    chipsActivos();
    sincronizarBarra();
    pintarBanda(lista.length);
    vacio.hidden = lista.length > 0;
    const faltan = lista.length - Math.min(visibles, lista.length);
    vermas.hidden = faltan <= 0;
    vermas.textContent = `Ver ${cuantos(Math.min(faltan, PAGINA), 'producto más', 'productos más')}`;
    const conFlip = animar && !reduceMotion && typeof gsap !== 'undefined' && typeof Flip !== 'undefined';
    reasientos.forEach(clearTimeout);
    reasientos = [];
    if (flipActual) { flipActual.kill(); flipActual = null; }
    const reasentar = () => { asentar(idsPrev); refrescarTriggers(); };
    if (conFlip) {
      revelarTodo();
      asentar(idsPrev);
      const estado = Flip.getState([...cards.values()]);
      pintarVariantes();
      ordenar(lista);
      asentar(ids);
      idsPrev = ids;
      flipActual = Flip.from(estado, { duration: 0.62, ease: 'power3.inOut', stagger: 0.02, onComplete: reasentar });
      reasientos = [setTimeout(reasentar, 1000), setTimeout(reasentar, 2300)];
    } else {
      pintarVariantes();
      ordenar(lista);
      asentar(ids);
      idsPrev = ids;
      refrescarTriggers();
    }
  };

  const soltarMedidas = () => { Filtro.ids = null; Filtro.idsTxt = ''; Filtro.sugeridas = new Map(); };
  const limpiar = (animar = true) => {
    Filtro.cats.clear(); Filtro.terminaciones.clear(); Filtro.precioMax = null; Filtro.q = ''; Filtro.orden = 'destacados';
    soltarMedidas();
    escribir(); render(true, animar);
  };

  root.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leer(); render(true, true); } });
  precio.addEventListener('input', () => { pintarPrecio(); leer(); render(true); });
  root.querySelector('.filtros-limpiar')?.addEventListener('click', () => limpiar(true));
  vacio.addEventListener('click', e => { if (e.target.closest('[data-limpiar-todo]')) limpiar(true); });
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const [tipo, id] = b.dataset.quitar.split('|');
    if (tipo === 'cat') Filtro.cats.delete(id);
    if (tipo === 'terminacion') Filtro.terminaciones.delete(id);
    if (tipo === 'precio') Filtro.precioMax = null;
    if (tipo === 'q') Filtro.q = '';
    if (tipo === 'ids') soltarMedidas();
    escribir(); render(true, true);
  });
  barra.addEventListener('click', e => {
    const b = e.target.closest('[data-chip-cat]');
    if (!b) return;
    Filtro.cats = new Set(b.dataset.chipCat ? [b.dataset.chipCat] : []);
    soltarMedidas();
    escribir(); render(true, true);
  });
  let tBusca = 0;
  buscador?.addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(() => { Filtro.q = buscador.value; render(true, true); }, 180); });
  buscador?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); Filtro.q = buscador.value; render(true, true); });
  orden?.addEventListener('change', () => { Filtro.orden = orden.value; render(true, true); });
  vermas.addEventListener('click', () => { visibles += PAGINA; render(false, false); });

  const toggle = root.querySelector('.filtros-toggle');
  const cerrar = root.querySelector('.filtros-cerrar');
  let fondo = null;
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); fondo?.remove(); fondo = null; document.body.classList.remove('no-scroll');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  const abrirFiltros = () => {
    filtros.classList.add('open'); document.body.classList.add('no-scroll'); toggle?.setAttribute('aria-expanded', 'true');
    fondo = document.createElement('div'); fondo.className = 'filtros-fondo'; fondo.addEventListener('click', cerrarFiltros); document.body.appendChild(fondo);
    trapFocus(filtros); cerrar?.focus();
  };
  toggle?.addEventListener('click', abrirFiltros);
  cerrar?.addEventListener('click', () => { cerrarFiltros(); toggle?.focus(); });
  verResultados?.addEventListener('click', () => { cerrarFiltros(); scrollSuave(inicio); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) { cerrarFiltros(); toggle?.focus(); } });

  Catalogo.aplicar = ({ cats = [], q = '', ids = null, idsTxt = '', sugeridas = null } = {}) => {
    Filtro.cats = new Set(cats); Filtro.terminaciones.clear(); Filtro.precioMax = null; Filtro.q = q;
    Filtro.ids = ids ? new Set(ids) : null; Filtro.idsTxt = idsTxt; Filtro.sugeridas = sugeridas || new Map();
    escribir();
    scrollSuave(inicio);
    setTimeout(() => render(true, true), reduceMotion ? 0 : 380);
  };
  Catalogo.categoria = id => Catalogo.aplicar({ cats: [id] });
  Catalogo.buscarTexto = q => Catalogo.aplicar({ q });
  Catalogo.buscar = () => { scrollSuave(inicio); setTimeout(() => buscador?.focus({ preventScroll: true }), reduceMotion ? 0 : 500); };

  render(true, false);

  if (!reduceMotion && 'IntersectionObserver' in window && grid.getBoundingClientRect().top > window.innerHeight) {
    const primeros = [...cards.values()].filter(el => el.style.display !== 'none');
    primeros.forEach(el => el.classList.add('pre'));
    const io = new IntersectionObserver(entries => {
      if (!entries.some(en => en.isIntersecting)) return;
      io.disconnect();
      primeros.forEach((el, i) => {
        el.classList.add('revelando');
        setTimeout(() => el.classList.remove('pre'), Math.min(i * 70, 700));
      });
      setTimeout(() => cards.forEach(el => el.classList.remove('revelando', 'pre')), 1900);
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(grid);
    setTimeout(() => { if (grid.getBoundingClientRect().top < window.innerHeight) revelarTodo(); }, 4000);
  }
}

function initCatsHeader() {
  const nav = document.querySelector('[data-header-cats]');
  if (!nav) return;
  nav.innerHTML = CATEGORIAS.map(c => `<a class="chip cat-${c.id}" href="#tienda" data-cat-link="${c.id}"><span class="chip-punto">${ICONOS[c.id]}</span>${esc(c.label)}</a>`).join('') +
    `<a class="chip" href="#medidor"><span class="chip-punto">${ICONOS.medir}</span>¿Entra en tu casa?</a>`;
}

function initBanner() {
  const b = document.querySelector('[data-banner]');
  if (!b) return;
  const msgs = [...b.querySelectorAll('[data-msg]')];
  if (msgs.length < 2) return;
  let i = 0;
  let pausado = false;
  let t0 = performance.now();
  const DUR = 5200;
  const ir = k => {
    msgs[i].style.setProperty('--prog', '0%');
    i = (k + msgs.length) % msgs.length;
    msgs.forEach((m, j) => m.classList.toggle('is-active', j === i));
    t0 = performance.now();
  };
  b.addEventListener('mouseenter', () => { pausado = true; });
  b.addEventListener('mouseleave', () => { pausado = false; });
  b.addEventListener('focusin', () => { pausado = true; });
  b.addEventListener('focusout', () => { pausado = false; });
  if (reduceMotion) return;
  let ultimo = performance.now();
  const tick = t => {
    const dt = t - ultimo;
    ultimo = t;
    if (pausado || document.hidden || b.getBoundingClientRect().bottom <= 0) {
      t0 += dt;
    } else {
      const k = (t - t0) / DUR;
      msgs[i].style.setProperty('--prog', `${Math.min(100, k * 100).toFixed(1)}%`);
      if (k >= 1) ir(i + 1);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initHeroBusqueda() {
  const f = document.querySelector('[data-hero-busqueda]');
  if (!f) return;
  const input = f.querySelector('input');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    Catalogo.buscarTexto?.(q);
  });
}

function dibujarAparato(forma, x, y, w, h) {
  const r = Math.min(w, h) * 0.07;
  const vec = 'vector-effect="non-scaling-stroke"';
  const d = [];
  const linea = (x1, y1, x2, y2) => d.push(`<path class="aparato-detalle" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}" ${vec}/>`);
  const rect = (rx, ry, rw, rh, rr = r * 0.6) => d.push(`<rect class="aparato-detalle" x="${rx.toFixed(2)}" y="${ry.toFixed(2)}" width="${rw.toFixed(2)}" height="${rh.toFixed(2)}" rx="${rr.toFixed(2)}" ${vec}/>`);
  const circ = (cx, cy, cr) => d.push(`<circle class="aparato-detalle" cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${cr.toFixed(2)}" ${vec}/>`);
  let cuerpo = `<rect class="aparato-cuerpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r.toFixed(2)}" ${vec}/>`;
  if (forma === 'heladera') {
    const corte = y + h * 0.64;
    linea(x, corte, x + w, corte);
    linea(x + w / 2, y, x + w / 2, corte);
    linea(x + w * 0.44, y + h * 0.16, x + w * 0.44, y + h * 0.48);
    linea(x + w * 0.56, y + h * 0.16, x + w * 0.56, y + h * 0.48);
    linea(x + w * 0.3, corte + h * 0.07, x + w * 0.7, corte + h * 0.07);
    rect(x + w * 0.12, y + h * 0.22, w * 0.2, h * 0.16);
  } else if (forma === 'lavarropas') {
    linea(x, y + h * 0.17, x + w, y + h * 0.17);
    circ(x + w * 0.72, y + h * 0.085, Math.min(w, h) * 0.045);
    const cr = Math.min(w, h) * 0.31;
    circ(x + w / 2, y + h * 0.58, cr);
    circ(x + w / 2, y + h * 0.58, cr * 0.68);
  } else if (forma === 'microondas') {
    rect(x + w * 0.07, y + h * 0.16, w * 0.6, h * 0.68);
    [0.3, 0.5, 0.7].forEach(k => circ(x + w * 0.84, y + h * k, Math.min(w, h) * 0.05));
  } else if (forma === 'freidora') {
    cuerpo = `<rect class="aparato-cuerpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${(Math.min(w, h) * 0.3).toFixed(2)}" ${vec}/>`;
    linea(x + w * 0.04, y + h * 0.5, x + w * 0.96, y + h * 0.5);
    circ(x + w / 2, y + h * 0.28, Math.min(w, h) * 0.11);
    rect(x + w * 0.38, y + h * 0.6, w * 0.24, h * 0.1);
  } else if (forma === 'tostadora') {
    rect(x + w * 0.16, y + h * 0.08, w * 0.3, h * 0.08, 0.4);
    rect(x + w * 0.54, y + h * 0.08, w * 0.3, h * 0.08, 0.4);
    linea(x + w * 0.88, y + h * 0.35, x + w * 0.88, y + h * 0.6);
  } else if (forma === 'cafetera') {
    linea(x, y + h * 0.3, x + w, y + h * 0.3);
    rect(x + w * 0.22, y + h * 0.48, w * 0.44, h * 0.36);
    linea(x + w * 0.66, y + h * 0.56, x + w * 0.78, y + h * 0.66);
  } else if (forma === 'licuadora') {
    const baseY = y + h * 0.66;
    cuerpo = `<rect class="aparato-cuerpo" x="${x + w * 0.08}" y="${baseY.toFixed(2)}" width="${(w * 0.84).toFixed(2)}" height="${(h * 0.34).toFixed(2)}" rx="${r.toFixed(2)}" ${vec}/>` +
      `<path class="aparato-cuerpo" d="M${(x + w * 0.16).toFixed(2)} ${y.toFixed(2)}H${(x + w * 0.84).toFixed(2)}L${(x + w * 0.74).toFixed(2)} ${baseY.toFixed(2)}H${(x + w * 0.26).toFixed(2)}Z" ${vec}/>`;
    circ(x + w / 2, y + h * 0.83, Math.min(w, h) * 0.12);
    linea(x + w * 0.84, y + h * 0.12, x + w * 0.98, y + h * 0.12);
    linea(x + w * 0.98, y + h * 0.12, x + w * 0.9, y + h * 0.5);
  }
  return `<g class="aparato">${cuerpo}${d.join('')}</g>`;
}

function necesita(m, tipo, extra = {}) {
  const h = tipo.holgura;
  return { ancho: m[0] + h.ancho + (extra.ancho || 0), alto: m[1] + h.alto + (extra.alto || 0), prof: m[2] + h.prof + (extra.prof || 0) };
}

function candidatosMedidor(tipoId) {
  const lista = [];
  PRODUCTOS.filter(p => p.medidor === tipoId).forEach(p => {
    const ops = opcionesDe(p).filter(o => o.medidas);
    if (ops.length) ops.forEach(o => lista.push({ p, v: o.v, m: o.medidas }));
    else if (p.medidas) lista.push({ p, v: '', m: p.medidas });
  });
  return lista;
}

function evaluarHueco(tipoId, hueco) {
  const tipo = TIPOS_MEDIDOR.find(t => t.id === tipoId);
  const res = candidatosMedidor(tipoId).map(c => {
    const n = necesita(c.m, tipo, c.p.extra);
    const faltan = ['ancho', 'alto', 'prof'].filter(k => n[k] > hueco[k]).map(k => ({ k, cm: n[k] - hueco[k] }));
    const sobra = Math.min(...['ancho', 'alto', 'prof'].map(k => hueco[k] - n[k]));
    return { ...c, n, faltan, entra: !faltan.length, sobra, vol: c.m[0] * c.m[1] * c.m[2] };
  });
  const entran = res.filter(r => r.entra).sort((a, b) => b.vol - a.vol);
  const noEntran = res.filter(r => !r.entra).sort((a, b) => a.vol - b.vol);
  return { tipo, res: [...entran, ...noEntran], entran, noEntran, elegido: entran[0] || noEntran[0] };
}

const NOMBRE_MEDIDA = { ancho: 'ancho', alto: 'alto', prof: 'profundidad' };

function initMedidor() {
  const root = document.querySelector('[data-medidor]');
  if (!root) return;
  const tiposEl = root.querySelector('[data-medidor-tipos]');
  const svg = root.querySelector('[data-medidor-svg]');
  const visual = root.querySelector('[data-medidor-visual]');
  const sello = root.querySelector('[data-medidor-sello]');
  const res = root.querySelector('[data-medidor-res]');
  const inputs = [...root.querySelectorAll('[data-medida]')];
  const outs = Object.fromEntries([...root.querySelectorAll('[data-out]')].map(o => [o.dataset.out, o]));
  tiposEl.innerHTML = TIPOS_MEDIDOR.map(t => `<button type="button" class="medidor-tipo" role="radio" aria-checked="false" tabindex="-1" data-tipo="${t.id}">${ICONOS[t.icono]}<span>${esc(t.label)}</span></button>`).join('');
  const botones = [...tiposEl.querySelectorAll('[data-tipo]')];
  let tipoId = 'heladera';
  let ultimo = null;

  const hueco = () => Object.fromEntries(inputs.map(i => [i.dataset.medida, Number(i.value)]));

  const dibujar = (ev, h) => {
    const el = ev.elegido;
    const W = Math.max(h.ancho, el ? el.n.ancho : 0);
    const H = Math.max(h.alto, el ? el.n.alto : 0);
    const pad = Math.max(W, H) * 0.14;
    const fs = Math.max(W, H) * 0.058;
    svg.setAttribute('viewBox', `${(-pad).toFixed(1)} ${(-pad).toFixed(1)} ${(W + pad * 2).toFixed(1)} ${(H + pad * 2).toFixed(1)}`);
    const nx = (W - h.ancho) / 2;
    const ny = H - h.alto;
    let piezas = `<line class="nicho-cota-linea" x1="${(-pad).toFixed(1)}" y1="${H}" x2="${(W + pad).toFixed(1)}" y2="${H}" vector-effect="non-scaling-stroke"/>`;
    const barra = Math.max(pad * 0.55, fs * 1.6);
    if (tipoId === 'mesada') piezas += `<rect class="nicho-alacena" x="${(nx - pad * 0.3).toFixed(1)}" y="${(ny - barra).toFixed(1)}" width="${(h.ancho + pad * 0.6).toFixed(1)}" height="${barra.toFixed(1)}" rx="${(fs * 0.2).toFixed(2)}"/>`;
    piezas += `<rect class="nicho-pared" x="${nx}" y="${ny}" width="${h.ancho}" height="${h.alto}" vector-effect="non-scaling-stroke"/>`;
    if (el) {
      piezas += `<rect class="nicho-holgura" x="${((W - el.n.ancho) / 2).toFixed(2)}" y="${(H - el.n.alto).toFixed(2)}" width="${el.n.ancho}" height="${el.n.alto}" rx="${(fs * 0.2).toFixed(2)}" vector-effect="non-scaling-stroke"/>`;
      piezas += dibujarAparato(el.p.forma, (W - el.m[0]) / 2, H - el.m[1], el.m[0], el.m[1]);
    }
    const cotaY = tipoId === 'mesada' ? ny - barra / 2 + fs * 0.36 : ny - fs * 0.6;
    piezas += `<text class="nicho-cota" x="${(nx + h.ancho / 2).toFixed(1)}" y="${cotaY.toFixed(1)}" text-anchor="middle" font-size="${fs.toFixed(2)}">${h.ancho} cm</text>`;
    const tx = nx + h.ancho + fs * 0.6;
    const ty = ny + h.alto / 2;
    piezas += `<text class="nicho-cota" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="${fs.toFixed(2)}" transform="rotate(-90 ${tx.toFixed(1)} ${ty.toFixed(1)})" text-anchor="middle" dy="${(fs * 0.35).toFixed(2)}">${h.alto} cm</text>`;
    svg.innerHTML = piezas;
    visual.dataset.entra = el?.entra ? 'si' : 'no';
    if (sello) {
      sello.style.setProperty('--c', el?.entra ? '#0B7A3B' : '#C0261C');
      const quien = el ? (el.v ? `${el.p.corto.split(' ')[0]} ${el.v}` : el.p.corto) : '';
      const txt = !el ? 'Sin modelos para medir' : el.entra ? `${quien}: entra` : `${quien}: ${el.faltan[0].cm === 1 ? 'falta' : 'faltan'} ${cm(el.faltan[0].cm)} de ${NOMBRE_MEDIDA[el.faltan[0].k]}`;
      sello.querySelector('span').textContent = txt;
    }
  };

  const pintar = () => {
    const h = hueco();
    Object.entries(h).forEach(([k, v]) => { if (outs[k]) outs[k].innerHTML = `${v} <small>cm</small>`; });
    inputs.forEach(i => i.style.setProperty('--pct', `${((Number(i.value) - Number(i.min)) / (Number(i.max) - Number(i.min))) * 100}%`));
    const ev = evaluarHueco(tipoId, h);
    ultimo = { ev, h };
    dibujar(ev, h);
    const t = ev.tipo;
    const total = ev.res.length;
    const n = ev.entran.length;
    const nProd = new Set(ev.entran.map(r => r.p.id)).size;
    const item = r => {
      const f = r.faltan[0];
      const sobra = Math.max(0, Math.round(r.sobra));
      const nota = r.entra ? `${sobra === 1 ? 'sobra' : 'sobran'} ${cm(sobra)}` : `${f.cm === 1 ? 'falta' : 'faltan'} ${cm(f.cm)} de ${NOMBRE_MEDIDA[f.k]}${r.p.extra?.motivo && r.p.extra[f.k] ? ` (${r.p.extra.motivo})` : ''}`;
      return `<li class="medidor-item${r.entra ? '' : ' no'}"><i aria-hidden="true"></i><span>${esc(cortoConVariante(r.p, r.v))} <small>${esc(nota)}</small></span></li>`;
    };
    const titulo = n ? `${n === 1 ? 'Entra' : 'Entran'} <b>${n}</b> de ${total} ${total === 1 ? t.uno : t.varios}` : `No entra ${t.fem ? 'ninguna de las' : 'ninguno de los'} ${total} ${t.varios}`;
    const lugar = t.id === 'mesada' ? 'la mesada, debajo de la alacena' : `el hueco de ${t.id === 'heladera' ? 'la heladera' : 'el lavarropas'}`;
    const msg = `Hola! Medí ${lugar}: ${h.ancho} × ${h.alto} × ${h.prof} cm. ¿Me ayudan a elegir?`;
    res.innerHTML = `<p class="medidor-cuenta">${titulo}</p>
      <ul class="medidor-lista">${ev.res.map(item).join('')}</ul>
      <div class="medidor-acciones">
        ${n ? `<button type="button" class="btn btn-cta" data-medidor-ver>${nProd === 1 ? `Ver ${t.fem ? 'la' : 'el'} que entra` : `Ver ${t.fem ? 'las' : 'los'} que entran`}</button>` : `<button type="button" class="btn btn-cta" data-medidor-cat="${t.cat}">Ver ${esc(catDe(t.cat).label.toLowerCase())}</button>`}
        <a class="link" href="${wspHref(msg)}" target="_blank" rel="noopener">¿Dudas con la medida? Te ayudamos</a>
      </div>`;
  };

  const elegirTipo = (id, foco = false) => {
    tipoId = id;
    const t = TIPOS_MEDIDOR.find(x => x.id === id);
    botones.forEach(b => {
      const on = b.dataset.tipo === id;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && foco) b.focus();
    });
    inputs.forEach(i => {
      const k = i.dataset.medida;
      i.min = t.rango[k][0];
      i.max = t.rango[k][1];
      i.step = 1;
      i.value = t.def[k];
    });
    pintar();
  };

  tiposEl.addEventListener('click', e => { const b = e.target.closest('[data-tipo]'); if (b) elegirTipo(b.dataset.tipo); });
  tiposEl.addEventListener('keydown', e => {
    const i = TIPOS_MEDIDOR.findIndex(t => t.id === tipoId);
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % TIPOS_MEDIDOR.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + TIPOS_MEDIDOR.length) % TIPOS_MEDIDOR.length;
    if (j === null) return;
    e.preventDefault();
    elegirTipo(TIPOS_MEDIDOR[j].id, true);
  });
  inputs.forEach(i => i.addEventListener('input', pintar));
  res.addEventListener('click', e => {
    if (!ultimo || !Catalogo.aplicar) return;
    if (e.target.closest('[data-medidor-ver]')) {
      const { ev, h } = ultimo;
      const sugeridas = new Map();
      ev.entran.forEach(r => { if (r.v && !sugeridas.has(r.p.id)) sugeridas.set(r.p.id, r.v); });
      Catalogo.aplicar({ ids: [...new Set(ev.entran.map(r => r.p.id))], idsTxt: `Entran en ${h.ancho} × ${h.alto} × ${h.prof} cm`, sugeridas });
    }
    const cat = e.target.closest('[data-medidor-cat]');
    if (cat) Catalogo.categoria(cat.dataset.medidorCat);
  });
  elegirTipo('heladera');
}

function openQuickview(id, vInicial) {
  const p = getProducto(id);
  const modal = document.getElementById('quickview');
  if (!p || !modal) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  let v = vInicial && varianteValida(p, vInicial) ? vInicial : varDefault(p);
  let cant = 1;
  const vistas = [[p.img, p.foco], ...(p.galeria || [])];
  const media = modal.querySelector('[data-qv-media]');
  const thumbs = modal.querySelector('[data-qv-thumbs]');
  media.className = `qv-media recorte cat-${p.cat}`;
  const verVista = k => {
    const [img, foco] = vistas[k];
    media.setAttribute('style', recorte(img, foco, 1));
    media.innerHTML = `<img src="images/${img}" alt="${esc(p.alt)}" width="700" height="700">`;
    thumbs.querySelectorAll('[data-qv-vista]').forEach((t, j) => t.setAttribute('aria-current', String(j === k)));
  };
  thumbs.innerHTML = vistas.length > 1 ? vistas.map(([img, foco], k) => `<button type="button" class="qv-thumb recorte" data-qv-vista="${k}" style="${recorte(img, foco, 1)}" aria-label="Ver la foto ${k + 1} de ${vistas.length}"><img src="images/${img}" alt="" width="136" height="136"></button>`).join('') : '';
  thumbs.onclick = e => { const b = e.target.closest('[data-qv-vista]'); if (b) verVista(Number(b.dataset.qvVista)); };
  verVista(0);

  modal.querySelector('[data-qv-cat]').textContent = catDe(p.cat).largo;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  modal.querySelector('[data-qv-desc]').textContent = p.desc;
  const specsEl = modal.querySelector('[data-qv-specs]');
  const varTitulo = modal.querySelector('[data-qv-var-titulo]');
  const varEl = modal.querySelector('[data-qv-variantes]');
  const precioEl = modal.querySelector('[data-qv-precio]');
  const cantEl = modal.querySelector('[data-qv-cant]');
  const pintarCompra = () => {
    varEl.querySelectorAll('[data-qv-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvV === v)));
    varTitulo.textContent = v ? `${p.variantes.titulo}: ${v}` : '';
    const specs = [];
    const m = medidasDe(p, v);
    if (m) specs.push(['Medidas', `${esc(medidasTxt(m))}`]);
    if (p.energia) specs.push(['Eficiencia', energiaHTML(p)]);
    if (p.terminacion) specs.push(['Terminación', esc(terminacionDe(p.terminacion)?.label || '')]);
    specsEl.innerHTML = specs.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('');
    precioEl.innerHTML = precioHTML(p, v);
    cantEl.textContent = cant;
    modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por ${nombreConVariante(p, v)}.`);
  };
  const ops = opcionesDe(p);
  varTitulo.hidden = !ops.length;
  varEl.hidden = !ops.length;
  varEl.innerHTML = ops.map(o => `<button type="button" class="qv-var" data-qv-v="${esc(o.v)}" aria-pressed="false">${esc(o.v)}${o.precio ? ` <small>${formatearPrecio(conDescuento(p, o.precio))}</small>` : ''}</button>`).join('');
  varEl.onclick = e => { const b = e.target.closest('[data-qv-v]'); if (b) { v = b.dataset.qvV; pintarCompra(); } };
  modal.querySelectorAll('[data-qv-step]').forEach(b => { b.onclick = () => { cant = Math.max(1, Math.min(p.stock, cant + Number(b.dataset.qvStep))); pintarCompra(); }; });
  modal.querySelector('[data-qv-add]').onclick = () => { agregar(p, cant, v); closeQuickview(); };
  modal.querySelector('[data-qv-comprar]').onclick = () => { Cart.add(p, cant, v); closeQuickview(); openCartDrawer(); };
  pintarCompra();

  const rel = [...PRODUCTOS.filter(x => x.cat === p.cat), ...RAIL.map(getProducto)].filter((x, k, arr) => x && x.id !== p.id && arr.indexOf(x) === k).slice(0, 3);
  modal.querySelector('[data-qv-rel]').innerHTML = rel.map(x => `<button type="button" class="qv-rel cat-${x.cat}" data-open-quickview="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="200" height="200"></span><span>${esc(x.nombre)}</span><span class="meta">${formatearPrecio(precioDesde(x))}</span></button>`).join('');
  modal.querySelector('.qv-relacionados').hidden = !rel.length;

  if (modal.hidden) {
    modal.hidden = false;
    trapFocus(modal);
    document.body.classList.add('no-scroll');
    modal.querySelector('.quickview-cerrar')?.focus();
  } else {
    modal.querySelector('.quickview-panel').scrollTop = 0;
  }
}

function closeQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-cerrar')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function renderCart() {
  const itemsEl = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  if (!itemsEl) return;
  const items = Cart.get();
  if (!items.length) {
    itemsEl.innerHTML = '<div class="cart-vacio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Tu carrito está vacío.<br>Arrancá por la heladera o por la cafetera, como quieras.</p><a class="btn btn-ghost" href="#tienda" data-cart-cerrar-link>Ver la tienda</a></div>';
    footer.hidden = true;
    return;
  }
  footer.hidden = false;
  itemsEl.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const linea = `${p.id}|${esc(i.v)}`;
    return `<div class="cart-item">
      <div class="recorte cat-${p.cat}" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="156" height="156"></div>
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="meta">${i.v ? `${esc(p.variantes.titulo)}: ${esc(i.v)}` : esc(catDe(p.cat).label)}</span>
        <div class="cart-item-fila">
          <div class="stepper" data-cart-linea="${linea}"><button type="button" data-cart-step="-1" aria-label="Restar una unidad de ${esc(nombreConVariante(p, i.v))}">−</button><span>${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar una unidad de ${esc(nombreConVariante(p, i.v))}">+</button></div>
          <span class="cart-item-precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</span>
        </div>
        <button type="button" class="cart-quitar" data-cart-quitar="${linea}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${nombreConVariante(p, i.v)}`; });
    wsp.href = wspHref(`Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
  }
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  ultimoFoco = document.activeElement;
  renderCart();
  drawer.classList.add('open');
  document.querySelector('.cart-backdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  trapFocus(drawer);
  drawer.querySelector('.cart-cerrar')?.focus();
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open');
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.({ preventScroll: true });
}

function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-cerrar')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); });
  document.querySelector('[data-cart-items]')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const [id, v] = step.closest('[data-cart-linea]').dataset.cartLinea.split('|');
      const it = Cart.get().find(i => i.id === Number(id) && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.cartStep));
      return;
    }
    const quitar = e.target.closest('[data-cart-quitar]');
    if (quitar) { const [id, v] = quitar.dataset.cartQuitar.split('|'); Cart.remove(id, v); return; }
    if (e.target.closest('[data-cart-cerrar-link]')) closeCartDrawer();
  });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initAtajos() {
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat-link]');
    if (cat && Catalogo.categoria) { e.preventDefault(); Catalogo.categoria(cat.dataset.catLink); return; }
    const bus = e.target.closest('[data-foco-buscador]');
    if (bus && Catalogo.buscar) { e.preventDefault(); Catalogo.buscar(); return; }
    const add = e.target.closest('[data-add]');
    if (add) { const p = getProducto(add.dataset.add); agregar(p, 1, add.dataset.v ?? varDefault(p)); return; }
    const ver = e.target.closest('[data-open-quickview]');
    if (ver) openQuickview(Number(ver.dataset.openQuickview), ver.dataset.v);
  });
}

function initNewsletter() {
  const f = document.querySelector('[data-newsletter]');
  if (!f) return;
  const input = f.querySelector('input');
  const err = document.querySelector('[data-newsletter-error]');
  const btn = f.querySelector('button');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute('aria-invalid', String(!ok));
    err.textContent = ok ? '' : 'Revisá el email: le falta algo.';
    if (!ok) { input.focus(); return; }
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Suscribirme';
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      f.reset();
    }, 800);
  });
}

function initSchema() {
  const base = new URL('./', window.location.href).href;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tienda Electrohogar Sanvi',
    itemListElement: PRODUCTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nombre,
        description: p.desc,
        image: base + 'images/' + p.img,
        category: catDe(p.cat).largo,
        offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
      },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initDeepLink() {
  const slug = new URLSearchParams(window.location.search).get('producto');
  const p = slug && PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuickview(p.id);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const banner = document.querySelector('.banner');
  if (banner) {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.5)' } });
    tl.from(banner, { y: 30, scale: 0.97, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' })
      .from(banner.querySelectorAll('.banner-texto > *'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.09, clearProps: 'transform,opacity' }, 0.2)
      .from(banner.querySelector('.banner-media img'), { scale: 1.12, duration: 1.4, ease: 'power3.out', clearProps: 'transform' }, 0.1)
      .from(banner.querySelectorAll('.banner-msg'), { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, clearProps: 'transform,opacity' }, 0.55)
      .from(document.querySelector('.hero-banner .sticker'), { y: 30, rotate: 8, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.8);
  }
  const corto = document.querySelector('.hero-corto');
  if (corto) {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.5)' } });
    tl.from(corto.querySelectorAll('.migas, .hero-h1, .banner-bajada'), { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' })
      .from(corto.querySelector('.corto-media'), { y: 40, rotate: 12, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.15)
      .from(corto.querySelector('.sticker'), { y: 26, rotate: 8, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.5)
      .from(document.querySelectorAll('.header-cats .chip'), { y: 16, opacity: 0, duration: 0.5, stagger: 0.05, clearProps: 'transform,opacity' }, 0.1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCuentas();
  initCatsHeader();
  initRail();
  initCatalogo();
  initMedidor();
  initBanner();
  initHeroBusqueda();
  initQuickview();
  initCartUI();
  initFloats();
  initAtajos();
  initNewsletter();
  initSchema();
  updateCartBadge();
  initReveals();
  initHeroMotion();
  initDeepLink();
});
