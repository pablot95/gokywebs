const WHATSAPP_NUMBER = '5492994026404';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const waLink = lineas => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.filter(Boolean).join('\n'))}`;

let stPendiente = null;
function refrescarST() {
  if (typeof ScrollTrigger === 'undefined') return;
  clearTimeout(stPendiente);
  stPendiente = setTimeout(() => ScrollTrigger.refresh(), 120);
}

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6l6-6"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 18l6-6"/><path d="M13 6l6 6"/></svg>'
};

const IMG = {
  hero: ['images/hero-collar-perlas-acero-2200x1469.webp', 2200, 1469],
  collar: ['images/collar-cristal-de-roca-2000x1333.webp', 2000, 1333],
  pulsera: ['images/pulsera-piedras-naturales-1600x1067.webp', 1600, 1067],
  aros: ['images/aros-perla-acero-1400x1400.webp', 1400, 1400],
  tiraCristal: ['images/tira-cristal-facetado-1800x2700.webp', 1800, 2700],
  perlas: ['images/tira-perlas-de-rio-1400x995.webp', 1400, 995],
  mostacillones: ['images/mostacillones-1400x933.webp', 1400, 933],
  citrino: ['images/tira-citrino-facetado-1200x1600.webp', 1200, 1600],
  fornituras: ['images/fornituras-acero-1200x1800.webp', 1200, 1800]
};

const LINEAS = { lista: 'Lista para usar', crear: 'Para crear' };
const CATS = { collares: 'Collares', pulseras: 'Pulseras', aros: 'Aros', tiras: 'Tiras de cuentas', mostacillones: 'Mostacillones', tanza: 'Tanza', fornituras: 'Fornituras' };
const MATS = { cristal: 'Cristal de roca', piedras: 'Piedras naturales', perlas: 'Perlas', acero: 'Acero quirúrgico', vidrio: 'Vidrio', nylon: 'Nylon' };

const PRODUCTOS = [
  {
    id: 'collar-cristal', nombre: 'Collar de cristal de roca', linea: 'lista', cat: 'collares', material: ['cristal', 'acero'],
    img: IMG.collar, alt: 'Collar de cristal de roca facetado sobre fondo blanco', pos: '55% 50%',
    spec: '36 cm + 5 de extensión · acero quirúrgico', precio: 16900, stock: 8,
    desc: 'Rondelas de cristal de roca facetado, enhebradas en tanza y terminadas con mosquetón y extensión de acero quirúrgico. Mide 36 cm y llega a 41 con la extensión.',
    ficha: [['Material', 'Cristal de roca facetado'], ['Largo', '36 cm + 5 de extensión'], ['Cierre', 'Mosquetón de acero quirúrgico']],
    tags: 'collar choker cristal transparente facetado acero bijouterie'
  },
  {
    id: 'pulsera-piedras', nombre: 'Pulsera de piedras naturales', linea: 'lista', cat: 'pulseras', material: ['piedras', 'acero'],
    img: IMG.pulsera, alt: 'Pulsera de piedras naturales con aguamarina y cuarzo sobre fondo blanco', pos: '50% 50%',
    spec: '18 cm + 3 de extensión · cierre de acero', precio: 13400, stock: 6,
    desc: 'Aguamarina, cuarzo cristal y cuarzo ahumado en piezas irregulares, con separadores y cierre de acero quirúrgico. Como son piedras naturales, cada pulsera sale un poco distinta.',
    ficha: [['Piedras', 'Aguamarina, cuarzo cristal y ahumado'], ['Largo', '18 cm + 3 de extensión'], ['Cierre', 'Acero quirúrgico']],
    tags: 'pulsera piedras aguamarina cuarzo ahumado natural bijouterie'
  },
  {
    id: 'aros-perla', nombre: 'Aros de perla con argolla de acero', linea: 'lista', cat: 'aros', material: ['perlas', 'acero'],
    img: IMG.aros, alt: 'Aros de perla con argolla dorada sobre una bandeja blanca', pos: '50% 45%',
    spec: 'argolla de 12 mm · acero quirúrgico dorado', precio: 9800, stock: 10,
    desc: 'Perla en gota colgada de una argolla chica de acero quirúrgico dorado. Se venden de a par.',
    ficha: [['Material', 'Perla y acero quirúrgico dorado'], ['Argolla', '12 mm'], ['Presentación', 'Par']],
    tags: 'aros argollas perla dorado bijouterie'
  },
  {
    id: 'collar-perlas-acero', nombre: 'Collar de perlas y cadena de acero', linea: 'lista', cat: 'collares', material: ['perlas', 'acero'],
    img: IMG.hero, alt: 'Collar de perlas y cadena de acero quirúrgico con mosquetón y gota de perla, puesto', pos: '60% 45%', espejo: true,
    spec: '42 cm · perlas y cadena de bolitas', precio: 21500, stock: 5, badge: 'Nuevo',
    desc: 'Dos vueltas unidas por un mosquetón: una de perlas clásicas y otra de cadena de bolitas de acero quirúrgico, con una gota de perla al frente.',
    ficha: [['Material', 'Perlas clásicas y acero quirúrgico'], ['Largo', '42 cm'], ['Cierre', 'Mosquetón de acero quirúrgico']],
    tags: 'collar perlas cadena bolitas mosqueton acero gota bijouterie'
  },
  {
    id: 'tira-cristal', nombre: 'Tira de cristal de roca facetado', linea: 'crear', cat: 'tiras', material: ['cristal'],
    img: IMG.tiraCristal, alt: 'Cuentas de cristal facetado sueltas sobre fondo negro', pos: '50% 62%',
    spec: 'rondela facetada · tira de 38 cm', varTitulo: 'Medida', varDefault: '8', stock: 40, nombreCuenta: 'cristales',
    variantes: [
      { v: '4', label: '4 mm', precio: 2600, porTira: 126, mmHilo: 3, rango: '4-5' },
      { v: '6', label: '6 mm', precio: 3400, porTira: 84, mmHilo: 4.5, rango: '6-7' },
      { v: '8', label: '8 mm', precio: 4300, porTira: 63, mmHilo: 6, rango: '8-9' }
    ],
    desc: 'Cristal de roca facetado en rondela, transparente con reflejo tornasol. Se vende por tira de 38 cm: la cantidad de cuentas depende de la medida.',
    ficha: [['Forma', 'Rondela facetada'], ['Largo de la tira', '38 cm']],
    tags: 'cristal de roca tira cuentas facetado rondela transparente insumo'
  },
  {
    id: 'tira-citrino', nombre: 'Tira de citrino facetado', linea: 'crear', cat: 'tiras', material: ['piedras'],
    img: IMG.citrino, alt: 'Tira de citrino facetado al sol', pos: '50% 50%',
    spec: 'piedra natural · tira de 38 cm', varTitulo: 'Medida', varDefault: '8', stock: 15, badge: 'Nuevo', nombreCuenta: 'cuentas de citrino',
    variantes: [
      { v: '6', label: '6 mm', precio: 6900, porTira: 84, mmHilo: 4.5, rango: '6-7' },
      { v: '8', label: '8 mm', precio: 8800, porTira: 63, mmHilo: 6, rango: '8-9' }
    ],
    desc: 'Citrino facetado en rondela, en tira de 38 cm. El tono va del amarillo pálido al miel y cambia de una tira a otra.',
    ficha: [['Piedra', 'Citrino'], ['Forma', 'Rondela facetada'], ['Largo de la tira', '38 cm']],
    tags: 'citrino piedra natural cuarzo amarillo tira facetado cuentas insumo'
  },
  {
    id: 'tira-perlas', nombre: 'Tira de perlas de río', linea: 'crear', cat: 'tiras', material: ['perlas'],
    img: IMG.perlas, alt: 'Tiras de perlas de río amontonadas', pos: '50% 50%',
    spec: 'perla cultivada · tira de 38 cm', varTitulo: 'Medida', varDefault: '6-7', stock: 20, nombreCuenta: 'perlas',
    variantes: [
      { v: '4-5', label: '4-5 mm', precio: 7900, porTira: 84, mmHilo: 4.5, rango: '4-5' },
      { v: '6-7', label: '6-7 mm', precio: 10500, porTira: 58, mmHilo: 6.5, rango: '6-7' },
      { v: '8-9', label: '8-9 mm', precio: 14900, porTira: 44, mmHilo: 8.5, rango: '8-9' }
    ],
    desc: 'Perlas cultivadas de agua dulce, de forma levemente irregular. Por eso se miden por rango y no por milímetro exacto.',
    ficha: [['Perla', 'Cultivada de agua dulce'], ['Largo de la tira', '38 cm']],
    tags: 'perlas rio cultivadas agua dulce tira nacar cuentas insumo'
  },
  {
    id: 'mostacillones', nombre: 'Mostacillones', linea: 'crear', cat: 'mostacillones', material: ['vidrio'],
    img: IMG.mostacillones, alt: 'Mostacillones celestes, rojos y amarillos saliendo de una bolsa', pos: '50% 50%',
    spec: 'vidrio · bolsa de 50 g', varTitulo: 'Color', varDefault: 'celeste', stock: 60,
    variantes: [
      { v: 'celeste', label: 'Celeste', precio: 2400 },
      { v: 'rojo', label: 'Rojo', precio: 2400 },
      { v: 'amarillo', label: 'Amarillo', precio: 2400 },
      { v: 'surtido', label: 'Surtido', precio: 2600 }
    ],
    desc: 'Mostacillones de vidrio en bolsa de 50 g, en color liso o surtido.',
    ficha: [['Material', 'Vidrio'], ['Presentación', 'Bolsa de 50 g']],
    tags: 'mostacillas mostacillones vidrio colores bolsa insumo'
  },
  {
    id: 'tanza', nombre: 'Tanza cristal', linea: 'crear', cat: 'tanza', material: ['nylon'], tile: true,
    alt: 'Tanza cristal', spec: 'nylon transparente · carrete de 25 m', varTitulo: 'Grosor', varDefault: '0,30', stock: 80,
    variantes: [
      { v: '0,25', label: '0,25 mm', precio: 1700 },
      { v: '0,30', label: '0,30 mm', precio: 1900 },
      { v: '0,40', label: '0,40 mm', precio: 2200 }
    ],
    desc: 'Tanza de nylon transparente en carrete de 25 m. 0,25 mm para cuentas chicas y mostacillones, 0,30 mm para 6 y 8 mm, 0,40 mm para piedras y collares largos.',
    ficha: [['Material', 'Nylon transparente'], ['Presentación', 'Carrete de 25 m']],
    tags: 'tanza hilo nylon transparente carrete insumo'
  },
  {
    id: 'fornituras', nombre: 'Fornituras de acero quirúrgico', linea: 'crear', cat: 'fornituras', material: ['acero'],
    img: IMG.fornituras, alt: 'Caja organizadora con argollas, mosquetones y terminales de acero', pos: '50% 60%',
    spec: '10 mosquetones, 20 terminales, 20 argollas', varTitulo: 'Terminación', varDefault: 'plateado', stock: 30,
    variantes: [
      { v: 'plateado', label: 'Plateado', precio: 6900 },
      { v: 'dorado', label: 'Dorado', precio: 7900 }
    ],
    desc: 'Juego de fornituras de acero quirúrgico para cerrar 10 piezas: 10 mosquetones, 20 terminales y 20 argollas.',
    ficha: [['Material', 'Acero quirúrgico'], ['Alcanza para', '10 piezas']],
    tags: 'fornituras acero quirurgico mosqueton mosquetones terminales argollas cierres insumo'
  }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getVar = (p, v) => p?.variantes ? (p.variantes.find(x => x.v === v) || p.variantes.find(x => x.v === p.varDefault) || p.variantes[0]) : null;
const precioDe = (p, v) => getVar(p, v)?.precio ?? p?.precio ?? 0;
const precioDesde = p => p.variantes ? Math.min(...p.variantes.map(x => x.precio)) : p.precio;

const Cart = {
  KEY: 'yanzon_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); }
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

function imgHTML(p) {
  if (p.tile) return `<span class="tanza-tile" role="img" aria-label="${esc(p.alt)}"><span class="tanza-tile__hilo"></span><span class="tanza-tile__txt"><b>0,30</b><span>mm · tanza cristal</span></span></span>`;
  const [src, w, h] = p.img;
  return `<img src="${src}" width="${w}" height="${h}" alt="${esc(p.alt)}" decoding="async" style="object-position:${p.pos || '50% 50%'}${p.espejo ? ';transform:scaleX(-1)' : ''}">`;
}

function nombreConVar(p, v) {
  const vr = getVar(p, v);
  return vr ? `${p.nombre} · ${vr.label}` : p.nombre;
}

function sumar(id, v, qty = 1, silencio = false) {
  const p = getProducto(id); if (!p) return;
  const vr = getVar(p, v);
  Cart.add(p, qty, vr ? vr.v : '');
  if (!silencio) showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${nombreConVar(p, vr?.v)}`);
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const Capas = { abierta: null, trigger: null };

function atraparFoco(e) {
  if (e.key !== 'Tab') return;
  const els = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const first = els[0], last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

function hayOverlayAbierto() {
  return !!document.querySelector('.capa.open, .filtros.open, .main-nav.open');
}

function abrirCapa(el, trigger) {
  if (!el) return;
  if (Capas.abierta && Capas.abierta !== el) cerrarCapa(Capas.abierta, false);
  Capas.abierta = el;
  Capas.trigger = trigger || document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  el.addEventListener('keydown', atraparFoco);
  setTimeout(() => (el.querySelector('[data-foco]') || el.querySelector(FOCUSABLE))?.focus({ preventScroll: true }), 80);
}

function cerrarCapa(el = Capas.abierta, devolver = true) {
  if (!el || el.hidden) return;
  el.classList.remove('open');
  el.removeEventListener('keydown', atraparFoco);
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, 400);
  if (Capas.abierta === el) Capas.abierta = null;
  if (!hayOverlayAbierto()) document.body.classList.remove('no-scroll');
  if (el.id === 'vista' && location.search.includes('producto=')) window.history.replaceState(null, '', location.pathname + location.hash);
  if (devolver && Capas.trigger && document.contains(Capas.trigger)) Capas.trigger.focus({ preventScroll: true });
}

function openCartDrawer(e) {
  renderCarrito();
  abrirCapa(document.getElementById('drawer'), e?.currentTarget || document.activeElement);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function stepperHTML(valor = 1, min = 1) {
  return `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Uno menos"${valor <= min ? ' disabled' : ''}>${ICO.menos}</button><output>${valor}</output><button type="button" data-paso="1" aria-label="Uno más">${ICO.mas}</button></div>`;
}

function leerStepper(st) { return parseInt(st?.querySelector('output')?.textContent, 10) || 1; }

function moverStepper(st, paso, max = 99) {
  const out = st.querySelector('output');
  const n = Math.max(1, Math.min(max, leerStepper(st) + paso));
  out.textContent = n;
  const menos = st.querySelector('[data-paso="-1"]');
  if (menos) menos.disabled = n <= 1;
  return n;
}

function renderCarrito() {
  const cont = document.querySelector('[data-drawer-items]');
  const vacio = document.querySelector('[data-drawer-vacio]');
  const pie = document.querySelector('[data-drawer-foot]');
  if (!cont) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    cont.innerHTML = ''; if (vacio) vacio.hidden = false; if (pie) pie.hidden = true; return;
  }
  if (vacio) vacio.hidden = true; if (pie) pie.hidden = false;
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id); const vr = getVar(p, i.v);
    return `<div class="linea-carrito" data-id="${esc(i.id)}" data-v="${esc(i.v || '')}">
      <div class="linea-carrito__img">${imgHTML(p)}</div>
      <div class="linea-carrito__info">
        <p class="linea-carrito__nombre">${esc(p.nombre)}</p>
        <p class="linea-carrito__var">${vr ? esc(p.varTitulo) + ': ' + esc(vr.label) : esc(p.spec)}</p>
        ${stepperHTML(i.qty)}
      </div>
      <div class="linea-carrito__lado">
        <p class="linea-carrito__precio precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
        <button type="button" class="quitar" data-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  const total = document.querySelector('[data-drawer-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function initCarrito() {
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', openCartDrawer));
  const cont = document.querySelector('[data-drawer-items]');
  cont?.addEventListener('click', e => {
    const linea = e.target.closest('.linea-carrito'); if (!linea) return;
    const id = linea.dataset.id, v = linea.dataset.v || '';
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (actual) Cart.setQty(id, v, actual.qty + parseInt(paso.dataset.paso, 10));
      return;
    }
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, v); showToast('Lo sacamos del carrito'); }
  });
  document.querySelector('[data-finalizar]')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    const drawer = document.getElementById('drawer');
    if (drawer && !drawer.hidden) {
      const foco = document.activeElement?.closest?.('.linea-carrito');
      const clave = foco ? foco.dataset.id + '|' + foco.dataset.v : null;
      const paso = document.activeElement?.dataset?.paso;
      renderCarrito();
      if (clave) {
        const [id, v] = clave.split('|');
        const nueva = [...document.querySelectorAll('.linea-carrito')].find(l => l.dataset.id === id && l.dataset.v === v);
        (nueva?.querySelector(`[data-paso="${paso}"]:not([disabled])`) || nueva?.querySelector('[data-paso="1"]'))?.focus({ preventScroll: true });
      }
    }
  });
  updateCartBadge();
}

function initCapas() {
  document.addEventListener('click', e => {
    const cerrar = e.target.closest('[data-cerrar-capa]');
    if (cerrar && cerrar.closest('.capa')) {
      const capa = cerrar.closest('.capa');
      cerrarCapa(capa, !cerrar.matches('a'));
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && Capas.abierta) cerrarCapa(Capas.abierta);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!hayOverlayAbierto()) document.body.classList.remove('no-scroll');
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
    if (desktopMq.matches) { nav.removeAttribute('inert'); nav.classList.remove('open'); bd.classList.remove('open'); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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

function initPreciosSueltos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioDesde(p));
  });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-sumar]');
    if (s) { sumar(s.dataset.sumar, s.dataset.variante || ''); return; }
    const a = e.target.closest('[data-abrir-producto]');
    if (a) { abrirProducto(a.dataset.abrirProducto, a); return; }
    const fm = e.target.closest('[data-filtrar-material]');
    if (fm) { Tienda.desdeAfuera({ material: fm.dataset.filtrarMaterial }); return; }
    const fl = e.target.closest('[data-filtrar-linea]');
    if (fl) { Tienda.desdeAfuera({ linea: fl.dataset.filtrarLinea }); }
  });
}

function lprodHTML(p) {
  const tiene = !!p.variantes;
  const precio = tiene ? `desde ${formatearPrecio(precioDesde(p))}` : formatearPrecio(p.precio);
  const accion = tiene
    ? `<button type="button" class="btn btn--line btn--sm" data-abrir-producto="${p.id}">Elegir ${esc(p.varTitulo.toLowerCase())}</button>`
    : `<button type="button" class="btn btn--solid btn--sm" data-sumar="${p.id}">Agregar</button>`;
  return `<div class="lprod">
    <div class="lprod__info"><span class="tag${p.linea === 'crear' ? ' tag--crear' : ''}">${LINEAS[p.linea]}</span><p class="lprod__nombre">${esc(p.nombre)}</p><p class="lprod__spec">${esc(p.spec)}</p></div>
    <div class="lprod__lado"><p class="lprod__precio precio">${precio}</p>${accion}</div>
  </div>`;
}

function initLineas() {
  document.querySelectorAll('[data-lprods]').forEach(cont => {
    cont.innerHTML = cont.dataset.lprods.split(',').map(id => getProducto(id.trim())).filter(Boolean).map(lprodHTML).join('');
  });
  const list = document.querySelector('.lineas--tabs .tabs');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const cuenta = list.querySelector('.tabs__cuenta');
  const activa = () => tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  const mover = t => {
    if (!cuenta || !t) return;
    cuenta.style.setProperty('--x', `${t.offsetLeft + t.offsetWidth / 2 - cuenta.offsetWidth / 2}px`);
  };
  const activar = (t, foco) => {
    tabs.forEach(b => {
      const sel = b === t;
      b.setAttribute('aria-selected', String(sel));
      b.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      if (sel && !reduceMotion) { panel.classList.remove('is-entrando'); void panel.offsetWidth; panel.classList.add('is-entrando'); }
    });
    mover(t);
    if (foco) t.focus();
    refrescarST();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  mover(activa());
  window.addEventListener('resize', () => mover(activa()), { passive: true });
  document.fonts?.ready?.then(() => mover(activa()));
}

function initMundos() {
  const sec = document.querySelector('.mundos');
  if (!sec) return;
  const track = sec.querySelector('.mundos__track');
  const escena = sec.querySelector('.mundos__escena');
  const copyA = sec.querySelector('.mundo--a .mundo__copy');
  const copyB = sec.querySelector('.mundo--b .mundo__copy');
  const palabraA = sec.querySelector('.mundo--a .mundo__palabra');
  const linea = sec.querySelector('.mundos__linea');
  const cuenta = sec.querySelector('[data-mundos-cuenta]');
  const TOTAL = 57;
  if (!track || !escena || !copyA || !copyB) return;
  if (reduceMotion) { sec.classList.add('is-static'); if (cuenta) cuenta.textContent = TOTAL; return; }
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const tramo = (p, a, b) => clamp01((p - a) / (b - a));
  const suave = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const offset = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const progreso = () => {
    const r = track.getBoundingClientRect();
    const off = offset();
    const total = r.height - (window.innerHeight - off);
    return total > 0 ? clamp01((off - r.top) / total) : 0;
  };
  const copia = (el, o, dx) => {
    el.style.opacity = o.toFixed(3);
    el.style.transform = `translateX(${(dx * (1 - o)).toFixed(1)}px)`;
    el.style.pointerEvents = o < .15 ? 'none' : '';
    el.style.visibility = o < .01 ? 'hidden' : '';
  };
  const pintar = p => {
    const w = 104 - 108 * suave(tramo(p, .06, .8));
    escena.style.setProperty('--w', w.toFixed(2));
    copia(copyA, clamp01((w - 36) / 14), -20);
    copia(copyB, clamp01((44 - w) / 16), 20);
    if (palabraA) palabraA.style.transform = `translateX(${(-6 * tramo(p, 0, .8)).toFixed(2)}%)`;
    const n = Math.round(TOTAL * clamp01((100 - w) / 100));
    if (cuenta && cuenta.textContent !== String(n)) cuenta.textContent = n;
    if (linea) {
      linea.classList.toggle('is-der', w < 36);
      linea.style.opacity = w > 99.5 || w < .5 ? '0' : '1';
    }
  };
  let pendiente = false;
  const tick = () => { pendiente = false; pintar(progreso()); };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar(progreso());
}

const PIEZAS = { 18: 'Pulsera', 24: 'Tobillera', 36: 'Choker', 45: 'Collar', 60: 'Collar largo' };

function calcularInsumos({ largo, prod, v, piezas }) {
  const p = getProducto(prod);
  const vr = getVar(p, v);
  const porPieza = Math.ceil((largo * 10 - 20) / vr.mmHilo);
  const total = porPieza * piezas;
  const tiras = Math.ceil(total / vr.porTira);
  const sobran = tiras * vr.porTira - total;
  const tanzaV = vr.mmHilo <= 3 ? '0,25' : (prod === 'tira-citrino' || largo >= 60 ? '0,40' : '0,30');
  const tanzaPorPieza = largo + 20;
  const carretes = Math.ceil((tanzaPorPieza * piezas) / 2500);
  const juegos = Math.ceil(piezas / 10);
  const tanza = getProducto('tanza');
  const forn = getProducto('fornituras');
  const pesos = tiras * vr.precio + carretes * precioDe(tanza, tanzaV) + juegos * precioDe(forn, 'plateado');
  return { p, vr, porPieza, total, tiras, sobran, tanzaV, tanzaPorPieza, carretes, juegos, pesos };
}

function initCalc() {
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const rango = form.querySelector('#calc-largo');
  const salidaLargo = form.querySelector('[data-c-largo-out]');
  const medidas = form.querySelector('[data-c-medidas]');
  const piezasSt = form.querySelector('[data-c-piezas]');
  const q = sel => document.querySelector(sel);
  const estado = { largo: 36, prod: 'tira-cristal', v: '8', piezas: 1 };
  const pintarMedidas = () => {
    const p = getProducto(estado.prod);
    if (!p.variantes.some(x => x.v === estado.v)) estado.v = p.varDefault;
    medidas.innerHTML = p.variantes.map(x => `<label class="chip"><input type="radio" name="calc-medida" value="${esc(x.v)}"${x.v === estado.v ? ' checked' : ''}><span>${esc(x.label)} <small>${formatearPrecio(x.precio)}</small></span></label>`).join('');
  };
  const tira = (n, svg) => {
    const dib = Math.min(n, 240);
    const x0 = 12, x1 = 588, cy = 15;
    const paso = (x1 - x0) / dib;
    const r = Math.max(1.1, Math.min(7, paso * .42));
    const medio = Math.floor(dib / 2);
    let s = `<path d="M${x0} ${cy}H${x1}M${x0} 6V24M${x1} 6V24" stroke="#000" stroke-width="1" fill="none"/>`;
    for (let i = 0; i < dib; i++) {
      const cx = x0 + paso * (i + .5);
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="${r.toFixed(2)}" fill="${i === medio ? '#FFFF00' : '#000'}" stroke="#000" stroke-width=".8"/>`;
    }
    svg.innerHTML = s;
  };
  const render = () => {
    const c = calcularInsumos(estado);
    const nombre = c.p.nombreCuenta || 'cuentas';
    q('[data-c-cuentas]').textContent = c.total.toLocaleString('es-AR');
    q('[data-c-cuentas-label]').textContent = `${nombre} de ${c.vr.label}`;
    const tipo = PIEZAS[estado.largo];
    q('[data-c-pieza]').textContent = estado.piezas > 1
      ? `${c.porPieza} por pieza de ${estado.largo} cm, con 2 cm para el cierre`
      : `${tipo ? tipo + ' de ' : 'Pieza de '}${estado.largo} cm, con 2 cm para el cierre`;
    q('[data-c-tiras]').textContent = c.tiras;
    q('[data-c-tiras-det]').textContent = `${c.vr.porTira} por tira · ${c.sobran ? 'te sobran ' + c.sobran : 'sin sobrantes'}`;
    q('[data-c-tanza-mm]').textContent = `${c.tanzaV} mm`;
    q('[data-c-tanza-det]').textContent = `${c.tanzaPorPieza} cm por pieza · carrete de 25 m`;
    q('[data-c-tanza]').textContent = `${c.carretes} ${c.carretes === 1 ? 'carrete' : 'carretes'}`;
    q('[data-c-forn]').textContent = `${c.juegos} ${c.juegos === 1 ? 'juego' : 'juegos'}`;
    q('[data-c-total]').textContent = formatearPrecio(c.pesos);
    salidaLargo.textContent = `${estado.largo} cm`;
    const svg = q('[data-c-tira]');
    if (svg) tira(c.porPieza, svg);
    const materialTxt = { 'tira-cristal': 'cristal de roca', 'tira-perlas': 'perlas de río', 'tira-citrino': 'citrino' }[estado.prod];
    const wsp = q('[data-c-wsp]');
    if (wsp) wsp.href = waLink([
      'Hola Yanzón, calculé mi pieza en la web:',
      `${estado.piezas} × ${(tipo || 'pieza').toLowerCase()} de ${estado.largo} cm con ${materialTxt} de ${c.vr.label}`,
      `${c.total} ${nombre} → ${c.tiras} ${c.tiras === 1 ? 'tira' : 'tiras'} de 38 cm`,
      `Tanza ${c.tanzaV} mm: ${c.carretes} ${c.carretes === 1 ? 'carrete' : 'carretes'}`,
      `Fornituras de acero: ${c.juegos} ${c.juegos === 1 ? 'juego' : 'juegos'}`,
      `Estimado: ${formatearPrecio(c.pesos)}`,
      '¿Me confirman si hay stock?'
    ]);
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'calc-pieza') { estado.largo = parseInt(t.value, 10); rango.value = estado.largo; }
    if (t.name === 'calc-material') { estado.prod = t.value; pintarMedidas(); }
    if (t.name === 'calc-medida') estado.v = t.value;
    render();
  });
  rango.addEventListener('input', () => {
    estado.largo = parseInt(rango.value, 10);
    form.querySelectorAll('input[name="calc-pieza"]').forEach(r => { r.checked = parseInt(r.value, 10) === estado.largo; });
    render();
  });
  piezasSt.addEventListener('click', e => {
    const b = e.target.closest('[data-paso]'); if (!b) return;
    estado.piezas = moverStepper(piezasSt, parseInt(b.dataset.paso, 10), 20);
    piezasSt.querySelector('[data-paso="1"]').disabled = estado.piezas >= 20;
    render();
  });
  q('[data-c-sumar]')?.addEventListener('click', () => {
    const c = calcularInsumos(estado);
    sumar(estado.prod, c.vr.v, c.tiras, true);
    sumar('tanza', c.tanzaV, c.carretes, true);
    sumar('fornituras', 'plateado', c.juegos, true);
    showToast(`Sumaste ${c.tiras} ${c.tiras === 1 ? 'tira' : 'tiras'}, la tanza y las fornituras de tu pieza`);
  });
  pintarMedidas();
  render();
}

const PASO_CATALOGO = 16;
const FILTROS = {
  cat: Object.entries(CATS),
  material: [['cristal', 'Cristal de roca'], ['piedras', 'Piedras naturales'], ['perlas', 'Perlas'], ['acero', 'Acero quirúrgico']],
  medida: [['4-5', '4-5 mm'], ['6-7', '6-7 mm'], ['8-9', '8-9 mm']],
  precio: [['todos', 'Todos'], ['hasta5', 'Hasta $5.000'], ['5a10', '$5.000 a $10.000'], ['mas10', 'Más de $10.000']]
};

const Tienda = {
  estado: { q: '', linea: 'todo', cat: new Set(), material: new Set(), medida: new Set(), precio: 'todos', orden: 'destacados', mostrar: PASO_CATALOGO },
  grid: null,
  pasa(p, st, ignorar) {
    if (ignorar !== 'linea' && st.linea !== 'todo' && p.linea !== st.linea) return false;
    if (ignorar !== 'cat' && st.cat.size && !st.cat.has(p.cat)) return false;
    if (ignorar !== 'material' && st.material.size && !p.material.some(m => st.material.has(m))) return false;
    if (ignorar !== 'medida' && st.medida.size && !(p.variantes || []).some(x => x.rango && st.medida.has(x.rango))) return false;
    if (ignorar !== 'precio' && st.precio !== 'todos') {
      const pr = precioDesde(p);
      if (st.precio === 'hasta5' && pr > 5000) return false;
      if (st.precio === '5a10' && (pr < 5000 || pr > 10000)) return false;
      if (st.precio === 'mas10' && pr <= 10000) return false;
    }
    if (ignorar !== 'q' && st.q.trim()) {
      const hay = norm([p.nombre, p.spec, p.desc, p.tags, CATS[p.cat], LINEAS[p.linea], ...p.material.map(m => MATS[m] || m), ...(p.variantes || []).map(x => x.label)].join(' '));
      if (!norm(st.q).split(/\s+/).filter(Boolean).every(w => hay.includes(w))) return false;
    }
    return true;
  },
  tieneValor(p, grupo, valor) {
    if (grupo === 'cat') return p.cat === valor;
    if (grupo === 'material') return p.material.includes(valor);
    if (grupo === 'medida') return (p.variantes || []).some(x => x.rango === valor);
    if (grupo === 'precio') {
      if (valor === 'todos') return true;
      const pr = precioDesde(p);
      return valor === 'hasta5' ? pr <= 5000 : valor === '5a10' ? pr >= 5000 && pr <= 10000 : pr > 10000;
    }
    return false;
  },
  resultados() {
    const st = this.estado;
    const lista = PRODUCTOS.filter(p => this.pasa(p, st));
    if (st.orden === 'menor') lista.sort((a, b) => precioDesde(a) - precioDesde(b));
    if (st.orden === 'mayor') lista.sort((a, b) => precioDesde(b) - precioDesde(a));
    return lista;
  },
  cardHTML(p) {
    const tiene = !!p.variantes;
    const vd = tiene ? getVar(p, p.varDefault) : null;
    const select = tiene
      ? `<label class="card__var"><span class="sr-only">${esc(p.varTitulo)} de ${esc(p.nombre)}</span><select data-card-var>${p.variantes.map(x => `<option value="${esc(x.v)}"${x.v === p.varDefault ? ' selected' : ''}>${esc(x.label)} · ${formatearPrecio(x.precio)}</option>`).join('')}</select>${ICO.chevron}</label>`
      : '';
    return `<article class="card${tiene ? ' tiene-var' : ''}" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(40px)">
      <button type="button" class="card__img${p.tile ? ' card__img--tanza' : ''}" data-abrir-producto="${p.id}" aria-label="Ver la ficha de ${esc(p.nombre)}">${imgHTML(p)}<span class="card__qv">Vista rápida</span>${p.badge ? `<span class="card__badge">${esc(p.badge)}</span>` : ''}</button>
      <div class="card__body">
        <p class="card__linea">${LINEAS[p.linea]}</p>
        <h3 class="card__nombre">${esc(p.nombre)}</h3>
        <p class="card__spec">${esc(p.spec)}</p>
        <p class="card__precio precio" data-card-precio>${formatearPrecio(tiene ? vd.precio : p.precio)}</p>
        ${select}
        <div class="prod-actions">
          ${stepperHTML(1)}
          <button type="button" class="btn btn--solid btn--sm prod-add" data-card-sumar>Agregar</button>
        </div>
        <button type="button" class="card__comprar" data-card-comprar>Comprar ahora</button>
      </div>
    </article>`;
  },
  tileHTML() {
    return `<div class="tile-ayuda" data-animate style="opacity:0;transform:translateY(40px)">
      <p class="eyebrow">¿Otra medida o color?</p>
      <p class="tile-ayuda__t">Preguntanos por medidas, colores o cantidades que no veas acá.</p>
      <div class="tile-ayuda__acciones">
        <a class="btn btn--solid btn--sm" href="${waLink(['Hola Yanzón, busco algo que no vi en la tienda:'])}" target="_blank" rel="noopener noreferrer">Preguntar por WhatsApp</a>
        <a class="link-flecha" href="#calculadora"><span>Calcular mi pieza</span>${ICO.flecha}</a>
      </div>
    </div>`;
  },
  pintarFiltros() {
    document.querySelectorAll('[data-filtro]').forEach(fs => {
      const grupo = fs.dataset.filtro;
      const tipo = grupo === 'precio' ? 'radio' : 'checkbox';
      fs.insertAdjacentHTML('beforeend', FILTROS[grupo].map(([valor, label]) => `<label class="check"><input type="${tipo}" name="f-${grupo}" value="${esc(valor)}"${grupo === 'precio' && valor === 'todos' ? ' checked' : ''}><span>${esc(label)}</span><span class="n" data-n="${grupo}:${esc(valor)}"></span></label>`).join(''));
    });
  },
  contarFiltros() {
    const st = this.estado;
    document.querySelectorAll('[data-n]').forEach(el => {
      const [grupo, valor] = el.dataset.n.split(':');
      const n = PRODUCTOS.filter(p => this.pasa(p, st, grupo) && this.tieneValor(p, grupo, valor)).length;
      el.textContent = n;
      el.closest('.check')?.classList.toggle('is-vacio', n === 0);
    });
    const activos = st.cat.size + st.material.size + st.medida.size + (st.precio !== 'todos' ? 1 : 0);
    document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = activos ? `(${activos})` : ''; });
  },
  sincronizarControles() {
    const st = this.estado;
    document.querySelectorAll('[data-filtro] input').forEach(i => {
      const grupo = i.name.slice(2);
      i.checked = grupo === 'precio' ? st.precio === i.value : st[grupo].has(i.value);
    });
    document.querySelectorAll('.seg [data-linea]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.linea === st.linea)));
    const buscar = document.getElementById('buscar'); if (buscar && buscar.value !== st.q) buscar.value = st.q;
    const orden = document.getElementById('orden'); if (orden) orden.value = st.orden;
  },
  render(animar = true) {
    if (!this.grid) return;
    const lista = this.resultados();
    const visibles = lista.slice(0, this.estado.mostrar);
    const total = lista.length;
    this.grid.innerHTML = visibles.map(p => this.cardHTML(p)).join('') + (total && visibles.length === total ? this.tileHTML() : '');
    const cuenta = document.querySelector('[data-tienda-count]');
    if (cuenta) cuenta.textContent = total === PRODUCTOS.length ? `${total} productos` : `${total} de ${PRODUCTOS.length} productos`;
    document.querySelectorAll('[data-filtros-total]').forEach(el => { el.textContent = total; });
    const vacio = document.querySelector('[data-tienda-vacio]'); if (vacio) vacio.hidden = total > 0;
    const verMas = document.querySelector('[data-ver-mas]'); if (verMas) verMas.hidden = total <= this.estado.mostrar;
    this.contarFiltros();
    this.ajustarTile();
    if (animar) revelarNuevos(this.grid);
    refrescarST();
  },
  ajustarTile() {
    const tile = this.grid?.querySelector('.tile-ayuda');
    if (!tile) return;
    const cols = window.getComputedStyle(this.grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
    const n = this.grid.querySelectorAll('.card').length;
    const resto = n % cols;
    tile.style.setProperty('--span', resto ? cols - resto : cols);
  },
  cambiar(fn) {
    fn(this.estado);
    this.estado.mostrar = PASO_CATALOGO;
    this.sincronizarControles();
    this.render();
  },
  limpiar() {
    this.cambiar(st => { st.q = ''; st.linea = 'todo'; st.cat.clear(); st.material.clear(); st.medida.clear(); st.precio = 'todos'; });
  },
  desdeAfuera({ material, linea, cat }) {
    this.cambiar(st => {
      st.q = ''; st.cat.clear(); st.material.clear(); st.medida.clear(); st.precio = 'todos'; st.linea = 'todo';
      if (material) st.material.add(material);
      if (linea) st.linea = linea;
      if (cat) st.cat.add(cat);
    });
    const sec = document.getElementById('tienda');
    if (sec) sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  },
  init() {
    this.grid = document.getElementById('catalogo');
    if (!this.grid) return;
    this.pintarFiltros();
    this.render(false);
    document.querySelectorAll('[data-filtro]').forEach(fs => fs.addEventListener('change', e => {
      const i = e.target; const grupo = fs.dataset.filtro;
      this.cambiar(st => {
        if (grupo === 'precio') st.precio = i.value;
        else if (i.checked) st[grupo].add(i.value); else st[grupo].delete(i.value);
      });
    }));
    document.querySelectorAll('.seg [data-linea]').forEach(b => b.addEventListener('click', () => this.cambiar(st => { st.linea = b.dataset.linea; })));
    let espera = null;
    document.getElementById('buscar')?.addEventListener('input', e => {
      clearTimeout(espera);
      const valor = e.target.value;
      espera = setTimeout(() => this.cambiar(st => { st.q = valor; }), 160);
    });
    document.getElementById('orden')?.addEventListener('change', e => this.cambiar(st => { st.orden = e.target.value; }));
    document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => this.limpiar()));
    document.querySelector('[data-ver-mas]')?.addEventListener('click', () => { this.estado.mostrar += PASO_CATALOGO; this.render(); });
    window.addEventListener('resize', () => this.ajustarTile(), { passive: true });
    this.grid.addEventListener('click', e => {
      const card = e.target.closest('.card'); if (!card) return;
      const p = getProducto(card.dataset.id); if (!p) return;
      const st = card.querySelector('[data-stepper]');
      const paso = e.target.closest('[data-paso]');
      if (paso) { moverStepper(st, parseInt(paso.dataset.paso, 10), p.stock ?? 99); return; }
      const v = card.querySelector('[data-card-var]')?.value || '';
      if (e.target.closest('[data-card-sumar]')) { sumar(p.id, v, leerStepper(st)); return; }
      if (e.target.closest('[data-card-comprar]')) { sumar(p.id, v, leerStepper(st), true); openCartDrawer({ currentTarget: e.target.closest('[data-card-comprar]') }); }
    });
    this.grid.addEventListener('change', e => {
      const sel = e.target.closest('[data-card-var]'); if (!sel) return;
      const card = sel.closest('.card'); const p = getProducto(card?.dataset.id);
      const precio = card?.querySelector('[data-card-precio]');
      if (p && precio) precio.textContent = formatearPrecio(precioDe(p, sel.value));
    });
    this.initFiltrosMobile();
  },
  initFiltrosMobile() {
    const panel = document.getElementById('filtros');
    const abrir = document.querySelector('[data-abrir-filtros]');
    if (!panel || !abrir) return;
    const bd = document.createElement('div');
    bd.className = 'filtros-backdrop';
    panel.parentNode.insertBefore(bd, panel);
    const mq = window.matchMedia('(max-width: 900px)');
    const cerrar = (devolver = true) => {
      if (!panel.classList.contains('open')) return;
      panel.classList.remove('open'); bd.classList.remove('open');
      abrir.setAttribute('aria-expanded', 'false');
      panel.removeEventListener('keydown', atraparFoco);
      panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
      if (!hayOverlayAbierto()) document.body.classList.remove('no-scroll');
      if (devolver) abrir.focus({ preventScroll: true });
    };
    const abrirPanel = () => {
      panel.classList.add('open'); bd.classList.add('open');
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
      abrir.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      panel.addEventListener('keydown', atraparFoco);
      setTimeout(() => panel.querySelector(FOCUSABLE)?.focus({ preventScroll: true }), 80);
    };
    abrir.addEventListener('click', abrirPanel);
    bd.addEventListener('click', () => cerrar());
    panel.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => cerrar()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrar(); });
    mq.addEventListener('change', () => { if (!mq.matches) cerrar(false); });
  }
};

function abrirProducto(id, trigger, vInicial) {
  const p = getProducto(id);
  const modal = document.getElementById('vista');
  if (!p || !modal) return;
  const media = modal.querySelector('[data-vista-media]');
  const info = modal.querySelector('[data-vista-info]');
  let v = p.variantes ? getVar(p, vInicial).v : '';
  modal.setAttribute('aria-label', `Ficha de ${p.nombre}`);
  media.innerHTML = imgHTML(p);
  const rel = PRODUCTOS.filter(x => x.id !== p.id && (x.material.some(m => p.material.includes(m) && m !== 'acero') || x.cat === p.cat)).slice(0, 3);
  const relLista = rel.length ? rel : PRODUCTOS.filter(x => x.id !== p.id && x.linea === p.linea).slice(0, 3);
  info.innerHTML = `
    <p class="eyebrow">${LINEAS[p.linea]} · ${esc(CATS[p.cat])}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="modal__precio precio" data-vista-precio>${formatearPrecio(precioDe(p, v))}</p>
    ${p.variantes ? `<fieldset class="modal__vars"><legend>${esc(p.varTitulo)}</legend><div class="chips">${p.variantes.map(x => `<label class="chip"><input type="radio" name="vista-var" value="${esc(x.v)}"${x.v === v ? ' checked' : ''}><span>${esc(x.label)}</span></label>`).join('')}</div></fieldset>` : ''}
    ${getVar(p, v)?.porTira ? `<div class="modal__cota" aria-label="Largo de la tira"><i></i><span data-vista-cota></span></div>` : ''}
    <dl class="modal__ficha">${p.ficha.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
    <p class="modal__desc">${esc(p.desc)}</p>
    <div class="modal__acciones">
      ${stepperHTML(1)}
      <button type="button" class="btn btn--solid prod-add" data-vista-sumar data-foco>Agregar al carrito</button>
      <button type="button" class="btn btn--line" data-vista-comprar>Comprar ahora</button>
    </div>
    <a class="link-flecha" data-vista-wsp href="#" target="_blank" rel="noopener noreferrer"><span>Consultar por WhatsApp</span>${ICO.flecha}</a>
    ${relLista.length ? `<div class="modal__rel"><h3>También te puede interesar</h3><div class="modal__rel-lista">${relLista.map(x => `<button type="button" class="rel" data-rel="${x.id}"><span class="rel__img">${imgHTML(x)}</span><span>${esc(x.nombre)}</span></button>`).join('')}</div></div>` : ''}`;
  const precio = info.querySelector('[data-vista-precio]');
  const cota = info.querySelector('[data-vista-cota]');
  const wsp = info.querySelector('[data-vista-wsp]');
  const st = info.querySelector('[data-stepper]');
  const actualizar = () => {
    precio.textContent = formatearPrecio(precioDe(p, v));
    const vr = getVar(p, v);
    if (cota && vr?.porTira) cota.textContent = `Tira de 38 cm · ${vr.porTira} cuentas de ${vr.label}`;
    wsp.href = waLink([`Hola Yanzón, me interesa: ${nombreConVar(p, v)}`, `Cantidad: ${leerStepper(st)}`, '¿Me confirman si hay stock?']);
  };
  info.onchange = e => { if (e.target.name === 'vista-var') { v = e.target.value; actualizar(); } };
  info.onclick = e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) { moverStepper(st, parseInt(paso.dataset.paso, 10), p.stock ?? 99); actualizar(); return; }
    if (e.target.closest('[data-vista-sumar]')) { sumar(p.id, v, leerStepper(st)); return; }
    if (e.target.closest('[data-vista-comprar]')) { sumar(p.id, v, leerStepper(st), true); openCartDrawer({ currentTarget: Capas.trigger }); return; }
    const r = e.target.closest('[data-rel]');
    if (r) { const t = Capas.trigger; abrirProducto(r.dataset.rel, t); }
  };
  actualizar();
  if (modal.hidden) abrirCapa(modal, trigger);
  else { info.scrollTop = 0; setTimeout(() => info.querySelector('[data-foco]')?.focus({ preventScroll: true }), 40); }
  window.history.replaceState(null, '', `${location.pathname}?producto=${p.id}${location.hash}`);
}

function initForm() {
  const form = document.querySelector('[data-form-contacto]');
  if (!form) return;
  const tel = form.querySelector('#c-wsp');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [{ mask: '+{54} 9 (00) 0000-0000' }, { mask: '+{54} 9 (000) 000-0000' }, { mask: '+{54} 9 (0000) 00-0000' }] });
  }
  const campos = [
    ['#c-nombre', v => v.trim().length >= 2],
    ['#c-wsp', () => (mask ? mask.unmaskedValue : tel.value.replace(/\D/g, '')).replace(/^549?/, '').length >= 10],
    ['#c-msg', v => v.trim().length >= 5]
  ];
  const validar = (sel, ok) => {
    const el = form.querySelector(sel); const err = form.querySelector(sel + '-e');
    const bien = ok(el.value);
    el.setAttribute('aria-invalid', String(!bien));
    if (err) err.hidden = bien;
    return bien;
  };
  campos.forEach(([sel, ok]) => form.querySelector(sel)?.addEventListener('blur', () => { if (form.querySelector(sel).value) validar(sel, ok); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const todos = campos.map(([sel, ok]) => validar(sel, ok));
    if (todos.includes(false)) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = texto;
      form.reset(); mask?.updateValue();
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', refrescarST));
}

let revealsListos = false;
function initReveals() {
  revealsListos = true;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.07, 0.5)}s`; });
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const fondo = document.querySelector('.hero--fondo .hero__media-in');
  if (fondo) gsap.to(fondo, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--fondo', start: 'top top', end: 'bottom top', scrub: true } });
  const ancha = document.querySelector('.hero__ancha-in');
  if (ancha) gsap.to(ancha, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero__ancha', start: 'top bottom', end: 'bottom top', scrub: true } });
  document.querySelectorAll('.lineas--zigzag .linea__foto img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4, scale: 1.1 }, { yPercent: 4, scale: 1.1, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function abrirProductoDeUrl() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirProducto(slug, document.getElementById('tienda'));
}

initPreciosSueltos();
initLineas();
Tienda.init();
initCalc();
initMundos();
initCarrito();
initCapas();
initAcciones();
initNav();
initFloats();
initForm();
initFaq();
initReveals();
initParallax();
abrirProductoDeUrl();

if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
