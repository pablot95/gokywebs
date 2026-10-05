const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5493424239234';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const clamp01 = v => Math.min(1, Math.max(0, v));
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const raiz = t => (t.length > 4 ? t.replace(/(es|s)$/, '') : t);
const linkWsp = lineas => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;

const CATEGORIAS = { menus: 'Menús de la semana', dulces: 'Dulces', masas: 'Panes y masas' };

const MOMENTOS = [
  { id: 'desayuno', nombre: 'Desayuno', hora: '08:30', frase: 'En el desayuno', toca: 'el desayuno' },
  { id: 'almuerzo', nombre: 'Almuerzo', hora: '13:00', frase: 'Al mediodía', toca: 'el almuerzo' },
  { id: 'merienda', nombre: 'Merienda', hora: '17:30', frase: 'En la merienda', toca: 'la merienda' },
  { id: 'cena', nombre: 'Cena', hora: '21:00', frase: 'A la noche', toca: 'la cena' },
];

const MENU_SEMANA = [
  { dia: 'lunes', corto: 'Lun', comidas: [['Tostadas de pan de semillas con palta y tomate', 10], ['Pollo grillado con vegetales asados', 35], ['Yogur con frutos rojos y almendras', 5], ['Tortilla de espinaca y queso', 25]] },
  { dia: 'martes', corto: 'Mar', comidas: [['Muffins de huevo y espinaca', 25], ['Salmón con brócoli y batata', 30], ['Bolitas de dátiles y coco', 15], ['Fideos de zucchini con langostinos', 20]] },
  { dia: 'miércoles', corto: 'Mié', comidas: [['Panqueques de banana y huevo', 15], ['Ensalada de repollo, edamame y almendras', 15], ['Licuado verde con manzana', 5], ['Pizza con base de coliflor', 40]] },
  { dia: 'jueves', corto: 'Jue', comidas: [['Pudding de chía con frutos rojos', 5], ['Carne picada con guacamole y hojas verdes', 25], ['Muffins de almendra y arándanos', 30], ['Buñuelos de espinaca con salsa de yogur', 25]] },
  { dia: 'viernes', corto: 'Vie', comidas: [['Huevos revueltos con hongos', 10], ['Albóndigas con morrones y brócoli', 35], ['Bastones de zanahoria con hummus', 10], ['Wraps de huevo con pollo y hojas verdes', 20]] },
  { dia: 'sábado', corto: 'Sáb', comidas: [['Omelette de queso y tomates cherry', 10], ['Hamburguesas caseras al plato con ensalada', 25], ['Torta de coco y limón', 50], ['Tarta sin masa de calabaza y queso', 40]] },
  { dia: 'domingo', corto: 'Dom', comidas: [['Bowl de yogur con granola sin cereales', 5], ['Pollo al horno con calabaza', 60], ['Brownie de almendras', 35], ['Sopa crema de zapallo con semillas', 30]] },
];

const PRODUCTOS = [
  {
    id: 'cocina-plena', nombre: 'Cocina Plena', tapa: 'Menú día por día', cat: 'menus', tono: 'azul', motivo: 'planner', mesa: '#E6EEFD',
    bajada: 'Desayunos, almuerzos, meriendas y cenas para toda la semana', precio: 15000, descuento: 0, stock: 1,
    momentos: ['desayuno', 'almuerzo', 'merienda', 'cena'], cantidad: '28 comidas', badge: 'Menú de 7 días', destacado: true,
    desc: 'Transformá tu alimentación sin dejar de disfrutar. Una guía completa con desayunos, almuerzos, meriendas y cenas para toda la semana, sin harinas y con el menú armado día por día.',
    recetas: MENU_SEMANA.flatMap(d => d.comidas.map(c => c[0])),
  },
  {
    id: 'viandas', nombre: 'Viandas de la semana', tapa: 'Viandas de la semana', cat: 'menus', tono: 'tinta', motivo: 'tapers', mesa: '#E9EDF4',
    bajada: 'Cocinás el domingo y comés rico hasta el viernes', precio: 12500, descuento: 20, stock: 1,
    momentos: ['almuerzo', 'cena'], cantidad: '7 viandas',
    desc: 'Siete viandas sin harinas para cocinar en una tarde y guardar en la heladera. Para llevar al trabajo o tener la cena resuelta.',
    recetas: ['Pollo grillado con ensalada de pepino', 'Salmón con brócoli y batata', 'Fideos de zucchini con langostinos', 'Carne picada con guacamole', 'Albóndigas con morrones y brócoli', 'Ensalada de repollo, edamame y almendras', 'Pudding de chía con frutos rojos'],
  },
  {
    id: 'budines', nombre: 'Budines y tortas', tapa: 'Budines y tortas', cat: 'dulces', tono: 'durazno', motivo: 'anillos', mesa: '#FFF1E6',
    bajada: 'Dulces de almendra, coco y banana, sin harina de trigo', precio: 9900, descuento: 0, stock: 1,
    momentos: ['desayuno', 'merienda'], cantidad: '8 recetas',
    desc: 'Budines, tortas y muffins para la merienda, hechos con almendras, coco, banana y huevos. Sin harina de trigo y con sabor casero.',
    recetas: ['Budín de almendras', 'Budín de banana y nuez', 'Torta de coco y limón', 'Brownie de almendras', 'Muffins de almendra y arándanos', 'Torta de zanahoria', 'Bizcochuelo de coco', 'Cheesecake sin base'],
  },
  {
    id: 'desayunos', nombre: 'Desayunos y meriendas', tapa: 'Desayunos y meriendas', cat: 'dulces', tono: 'cielo', motivo: 'sol', mesa: '#EAF1FE',
    bajada: 'Dulces y salados, para arrancar el día y cortar la tarde', precio: 8900, descuento: 0, stock: 1,
    momentos: ['desayuno', 'merienda'], cantidad: '9 recetas',
    desc: 'Nueve ideas rápidas para la mañana y la tarde: tostadas de pan de semillas, panqueques, puddings y licuados, sin harinas.',
    recetas: ['Tostadas de pan de semillas con palta', 'Muffins de huevo y espinaca', 'Panqueques de banana y huevo', 'Pudding de chía con frutos rojos', 'Bolitas de dátiles y coco', 'Licuado verde con manzana', 'Yogur con frutos rojos y almendras', 'Huevos revueltos con hongos', 'Granola sin cereales'],
  },
  {
    id: 'masas', nombre: 'Panes, pizzas y tartas', tapa: 'Panes, pizzas y tartas', cat: 'masas', tono: 'naranja', motivo: 'porciones', mesa: '#FFEBDC',
    bajada: 'Masas sin harina para todos los días', precio: 9900, descuento: 0, stock: 1,
    momentos: ['desayuno', 'almuerzo', 'cena'], cantidad: '7 recetas',
    desc: 'Pan de semillas para tostar, pizza con base de coliflor y tartas sin masa. Lo que más se extraña, resuelto sin harina.',
    recetas: ['Pan de semillas', 'Pizza con base de coliflor', 'Pan de nube', 'Tarta sin masa de calabaza y queso', 'Tortilla de espinaca y queso', 'Buñuelos de espinaca', 'Grisines de queso y semillas'],
  },
  {
    id: 'wraps', nombre: 'Wraps y empanadas', tapa: 'Wraps y empanadas', cat: 'masas', tono: 'crema', motivo: 'ondas', mesa: '#F3EEE7',
    bajada: 'Masas de huevo, queso y verdura', precio: 8900, descuento: 0, stock: 1,
    momentos: ['almuerzo', 'cena'], cantidad: '6 recetas', badge: 'Nuevo',
    desc: 'Wraps de huevo, empanadas de masa de queso y tortillas de coliflor para armar almuerzos y cenas que se comen con la mano.',
    recetas: ['Wraps de huevo con pollo', 'Empanadas de masa de queso', 'Tortillas de coliflor', 'Tacos de lechuga con carne', 'Rolls de zucchini y ricota', 'Arrollado de espinaca'],
  },
];

const Cart = {
  KEY: 'cocinaplena_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  has(id) { return this.get().some(i => i.id === id); },
};

function momentoActual(fecha) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  if (h >= 5 && h < 11) return 0;
  if (h >= 11 && h < 15.5) return 1;
  if (h >= 15.5 && h < 19.5) return 2;
  if (h >= 19.5) return 3;
  return 0;
}
const minuscula = s => s.charAt(0).toLowerCase() + s.slice(1);
const horaTexto = f => `${String(f.getHours()).padStart(2, '0')}:${String(f.getMinutes()).padStart(2, '0')}`;
const minutosTexto = m => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`);

function tapaHTML(p) {
  return `<span class="tapa tapa--${p.tono}" data-motivo="${p.motivo}"><span class="tapa__marca">Cocina <b>plena</b></span><span class="tapa__titulo">${esc(p.tapa)}</span><span class="tapa__pie">PDF · ${esc(p.cantidad)}</span></span>`;
}

function precioHTML(p) {
  const final = precioFinal(p);
  return p.descuento > 0
    ? `<span class="precio precio--desc">${formatearPrecio(final)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(final)}</span>`;
}

function botonAgregarHTML(p) {
  return Cart.has(p.id)
    ? `<svg aria-hidden="true"><use href="#i-check"/></svg>En el carrito`
    : 'Agregar';
}

function cardHTML(p, coincidencia, extra) {
  const clases = ['ebook', extra.grande ? 'is-grande' : '', extra.impar ? 'es-ultimo-impar' : ''].filter(Boolean).join(' ');
  const entrada = extra.entrada ? ' data-animate="subir"' : '';
  const estilo = `--ebook-mesa:${p.mesa}` + (extra.entrada ? ';opacity:0;transform:translateY(44px)' : '');
  const trae = extra.grande ? `<ul class="ebook__trae">${p.recetas.slice(0, 3).map(r => `<li>${esc(r)}</li>`).join('')}<li class="mas">y ${p.recetas.length - 3} más</li></ul>` : '';
  return `<article class="${clases}" data-id="${p.id}"${entrada} style="${estilo}">
    <button type="button" class="ebook__abrir" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">
      ${p.badge ? `<span class="ebook__badge">${esc(p.badge)}</span>` : ''}
      ${p.descuento > 0 ? `<span class="ebook__badge ebook__badge--desc">-${p.descuento}%</span>` : ''}
      ${tapaHTML(p)}
    </button>
    <div class="ebook__info">
      <p class="ebook__cat"><span class="ebook__cat-nombre">${esc(CATEGORIAS[p.cat])} · </span>${esc(p.cantidad)}</p>
      <h3 class="ebook__nombre">${esc(p.nombre)}</h3>
      <p class="ebook__bajada">${esc(p.bajada)}</p>
      ${coincidencia ? `<p class="ebook__incluye">Incluye: <mark>${esc(coincidencia)}</mark></p>` : ''}
      ${trae}
      <div class="ebook__pie">
        <p class="ebook__precio">${precioHTML(p)}</p>
        <div class="prod-actions">
          <button type="button" class="btn btn-cta prod-add${Cart.has(p.id) ? ' en-carrito' : ''}" data-add="${p.id}">${botonAgregarHTML(p)}</button>
          <button type="button" class="btn btn-line prod-buy" data-buy="${p.id}">Comprar ahora</button>
        </div>
      </div>
    </div>
  </article>`;
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

const Catalogo = { q: '', cat: 'todos', momentos: new Set() };

function buscarEnProducto(p, tokens) {
  if (!tokens.length) return { ok: true, receta: '' };
  const pajar = normalizar([p.nombre, p.tapa, p.bajada, CATEGORIAS[p.cat], p.desc, p.cantidad, ...p.recetas, ...p.momentos].join(' '));
  if (!tokens.every(t => pajar.includes(t))) return { ok: false, receta: '' };
  const receta = p.recetas.find(r => tokens.every(t => normalizar(r).includes(t))) || p.recetas.find(r => tokens.some(t => normalizar(r).includes(t))) || '';
  return { ok: true, receta };
}

function filtrarProductos() {
  const tokens = normalizar(Catalogo.q).split(/\s+/).filter(Boolean).map(raiz);
  return PRODUCTOS.map(p => ({ p, ...buscarEnProducto(p, tokens) })).filter(({ p, ok }) => {
    if (!ok) return false;
    if (Catalogo.cat !== 'todos' && p.cat !== Catalogo.cat) return false;
    if (Catalogo.momentos.size && !p.momentos.some(m => Catalogo.momentos.has(m))) return false;
    return true;
  });
}

function filtrosActivos() {
  return Boolean(Catalogo.q.trim()) || Catalogo.cat !== 'todos' || Catalogo.momentos.size > 0;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const mosaico = grid.dataset.layout === 'mosaico';
  const lista = filtrarProductos();
  const activos = filtrosActivos();
  const hayGrande = mosaico && !activos && lista.some(({ p }) => p.destacado);
  const chicos = lista.filter(({ p }) => !(hayGrande && p.destacado)).length;
  grid.innerHTML = lista.map(({ p, receta }, k) => {
    const grande = hayGrande && p.destacado;
    const impar = mosaico && hayGrande && chicos % 2 === 1 && k === lista.length - 1;
    return cardHTML(p, Catalogo.q.trim() ? receta : '', { grande, impar, entrada: true });
  }).join('');
  const n = lista.length;
  const count = document.querySelector('[data-count]');
  if (count) count.textContent = n === 1 ? '1 ebook' : n ? `${n} ebooks` : 'Ningún ebook';
  document.querySelectorAll('[data-limpiar]').forEach(b => { if (b.classList.contains('link-limpiar')) b.hidden = !activos; });
  const vacio = document.getElementById('catalogoVacio');
  if (vacio) {
    vacio.hidden = n > 0;
    const vq = vacio.querySelector('[data-vacio-q]');
    if (vq) vq.textContent = Catalogo.q.trim() || 'ese filtro';
  }
  grid.hidden = n === 0;
  revelarNuevos(grid);
  refrescarScroll();
}

function sincronizarChips() {
  document.querySelectorAll('[data-cat]').forEach(b => {
    const on = b.dataset.cat === Catalogo.cat;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('[data-momento]').forEach(b => {
    const on = Catalogo.momentos.has(b.dataset.momento);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function irATienda() {
  const tienda = document.getElementById('tienda');
  if (tienda) tienda.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const input = document.getElementById('buscar');
  const form = document.getElementById('buscador');
  let t = 0;
  input?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.q = input.value; renderCatalogo(); }, 160);
  });
  form?.addEventListener('submit', e => {
    e.preventDefault();
    Catalogo.q = input?.value || '';
    renderCatalogo();
    input?.blur();
  });
  document.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
    Catalogo.cat = b.dataset.cat;
    sincronizarChips();
    renderCatalogo();
  }));
  document.querySelectorAll('[data-momento]').forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.momento;
    if (Catalogo.momentos.has(m)) Catalogo.momentos.delete(m); else Catalogo.momentos.add(m);
    sincronizarChips();
    renderCatalogo();
  }));
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Catalogo.q = ''; Catalogo.cat = 'todos'; Catalogo.momentos.clear();
    if (input) input.value = '';
    sincronizarChips();
    renderCatalogo();
  }));
  document.querySelectorAll('[data-sugerencia]').forEach(b => b.addEventListener('click', () => {
    Catalogo.q = b.dataset.sugerencia; Catalogo.cat = 'todos'; Catalogo.momentos.clear();
    if (input) input.value = Catalogo.q;
    sincronizarChips();
    renderCatalogo();
  }));
  renderCatalogo();
}

function initColecciones() {
  const botones = document.querySelectorAll('[data-coleccion]');
  if (!botones.length) return;
  botones.forEach(b => b.addEventListener('click', () => {
    Catalogo.cat = b.dataset.coleccion;
    Catalogo.q = ''; Catalogo.momentos.clear();
    const input = document.getElementById('buscar');
    if (input) input.value = '';
    sincronizarChips();
    renderCatalogo();
    irATienda();
  }));
  botones.forEach(b => {
    const n = PRODUCTOS.filter(p => p.cat === b.dataset.coleccion).length;
    const dato = b.querySelector('[data-coleccion-n]');
    if (dato) dato.textContent = `${CATEGORIAS[b.dataset.coleccion]} · ${n} ebooks`;
  });
}

function sincronizarBotones() {
  document.querySelectorAll('.prod-add[data-add]').forEach(b => {
    const p = getProducto(b.dataset.add);
    if (!p) return;
    const en = Cart.has(p.id);
    if (b.classList.contains('en-carrito') === en) return;
    b.classList.toggle('en-carrito', en);
    b.innerHTML = b.classList.contains('qv-add')
      ? (en ? '<svg aria-hidden="true"><use href="#i-check"/></svg>Ya está en tu carrito' : 'Agregar al carrito')
      : botonAgregarHTML(p);
  });
}

function agregar(id, abrir) {
  const p = getProducto(id);
  if (!p) return;
  if (Cart.has(id)) {
    if (abrir) abrirCarrito(); else showToast(`«${p.nombre}» ya está en tu carrito`);
    return;
  }
  Cart.add(p, 1);
  if (abrir) abrirCarrito(); else showToast(`Sumaste «${p.nombre}» al carrito`);
}

const Capa = { el: null, fondo: null, opener: null, timer: 0 };

function focoAtrapado(e) {
  if (!Capa.el || e.key !== 'Tab') return;
  const f = [...Capa.el.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirCapa(el, fondo, opener) {
  let previo = null;
  if (Capa.el && Capa.el !== el) { previo = Capa.opener; cerrarCapa(true); }
  clearTimeout(Capa.timer);
  Capa.el = el; Capa.fondo = fondo || null;
  Capa.opener = previo || opener || (document.activeElement instanceof window.HTMLElement ? document.activeElement : null);
  el.hidden = false;
  if (fondo) fondo.hidden = false;
  void el.offsetWidth;
  el.classList.add('open');
  fondo?.classList.add('open');
  document.body.classList.add('no-scroll');
  const foco = el.querySelector('[data-foco]') || el.querySelector('.icon-cerrar');
  setTimeout(() => foco?.focus({ preventScroll: true }), 30);
}

function cerrarCapa(sinFoco) {
  const { el, fondo, opener } = Capa;
  if (!el) return;
  el.classList.remove('open');
  fondo?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  Capa.el = null; Capa.fondo = null; Capa.opener = null;
  const ocultar = () => { el.hidden = true; if (fondo) fondo.hidden = true; };
  if (reduceMotion || sinFoco) ocultar(); else Capa.timer = setTimeout(ocultar, 380);
  if (!sinFoco && opener && document.contains(opener)) opener.focus({ preventScroll: true });
}

document.addEventListener('keydown', e => {
  if (!Capa.el) return;
  if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(); }
  else focoAtrapado(e);
});

function renderCarrito() {
  const lista = document.querySelector('[data-cart-lista]');
  if (!lista) return;
  const items = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  lista.innerHTML = items.map(({ p }) => `<li class="linea">
      <span class="linea__tapa">${tapaHTML(p)}</span>
      <span class="linea__txt"><b>${esc(p.nombre)}</b><small>PDF · ${esc(p.cantidad)}</small></span>
      <span class="linea__precio">${formatearPrecio(precioFinal(p))}</span>
      <button type="button" class="linea__quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito"><svg aria-hidden="true"><use href="#i-quitar"/></svg></button>
    </li>`).join('');
  const vacio = document.querySelector('[data-cart-vacio]');
  const pie = document.querySelector('[data-cart-pie]');
  if (vacio) vacio.hidden = items.length > 0;
  if (pie) pie.hidden = items.length === 0;
  lista.hidden = items.length === 0;
  const total = document.querySelector('[data-cart-total]');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirCarrito(opener) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  renderCarrito();
  abrirCapa(drawer, document.getElementById('drawerFondo'), opener);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  document.getElementById('drawerFondo')?.addEventListener('click', () => cerrarCapa());
  document.querySelector('[data-cart-close]')?.addEventListener('click', () => cerrarCapa());
  document.querySelector('[data-cart-ver]')?.addEventListener('click', () => { cerrarCapa(true); irATienda(); });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    sincronizarBotones();
    if (Capa.el?.id === 'cartDrawer') renderCarrito();
  });
}

function renderQuickView(p) {
  const cont = document.querySelector('[data-qv-contenido]');
  if (!cont) return;
  const otros = PRODUCTOS.filter(x => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 2);
  const visibles = p.recetas.slice(0, 8);
  const resto = p.recetas.length - visibles.length;
  const en = Cart.has(p.id);
  cont.innerHTML = `<div class="qv" style="--ebook-mesa:${p.mesa}">
      <div class="qv__mesa">${tapaHTML(p)}</div>
      <div class="qv__info">
        <p class="ebook__cat">${esc(CATEGORIAS[p.cat])}</p>
        <h2 class="qv__nombre" tabindex="-1" data-foco>${esc(p.nombre)}</h2>
        <p class="qv__bajada">${esc(p.bajada)}</p>
        <p class="qv__precio">${precioHTML(p)}${p.descuento > 0 ? `<span class="ebook__badge ebook__badge--desc qv__desc-badge">-${p.descuento}%</span>` : ''}</p>
        <ul class="qv__chips"><li>PDF</li><li>${esc(p.cantidad)}</li><li>${p.momentos.map(m => MOMENTOS.find(x => x.id === m)?.nombre).filter(Boolean).join(' · ')}</li></ul>
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__sub">Qué trae</p>
        <ul class="qv__recetas">${visibles.map(r => `<li>${esc(r)}</li>`).join('')}${resto > 0 ? `<li class="mas">y ${resto} más</li>` : ''}</ul>
        <div class="qv__acciones">
          <button type="button" class="btn btn-cta prod-add qv-add${en ? ' en-carrito' : ''}" data-add="${p.id}">${en ? '<svg aria-hidden="true"><use href="#i-check"/></svg>Ya está en tu carrito' : 'Agregar al carrito'}</button>
          <button type="button" class="btn btn-line" data-buy="${p.id}">Comprar ahora</button>
        </div>
        <div class="qv__otros">
          <p class="qv__sub">También te puede interesar</p>
          <div class="qv__otros-lista">${otros.map(o => `<button type="button" class="qv__otro" data-quick="${o.id}">${tapaHTML(o)}<span><b>${esc(o.nombre)}</b><small>${formatearPrecio(precioFinal(o))}</small></span></button>`).join('')}</div>
        </div>
      </div>
    </div>`;
}

function abrirQuickView(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  renderQuickView(p);
  if (Capa.el === modal) {
    modal.querySelector('.modal__caja')?.scrollTo({ top: 0 });
    setTimeout(() => modal.querySelector('[data-foco]')?.focus({ preventScroll: true }), 30);
    return;
  }
  abrirCapa(modal, null, opener);
}

function initQuickView() {
  document.querySelectorAll('[data-qv-close]').forEach(b => b.addEventListener('click', () => cerrarCapa()));
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirQuickView(slug);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, Capa.el ? Capa.opener : quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, Cart.has(add.dataset.add) && add.classList.contains('prod-add')); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) { agregar(buy.dataset.buy, true); return; }
    const addMenu = e.target.closest('[data-add-menu]');
    if (addMenu) { agregar(addMenu.dataset.addMenu, Cart.has(addMenu.dataset.addMenu)); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
    const abrir = e.target.closest('[data-cart-open]');
    if (abrir) abrirCarrito(abrir);
  });
  document.querySelectorAll('[data-precio]').forEach(el => {
    const p = getProducto(el.dataset.precio);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
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
  cart?.addEventListener('click', () => abrirCarrito(cart));
  sync();
}

function initMenuDia() {
  const sec = document.getElementById('menu');
  if (!sec) return;
  const tabs = sec.querySelector('[data-dias]');
  const lista = sec.querySelector('[data-comidas]');
  const totalEl = sec.querySelector('[data-total-min]');
  const ahoraEl = sec.querySelector('[data-ahora]');
  const wsp = sec.querySelector('[data-wsp-menu]');
  const panel = sec.querySelector('.planner__panel');
  if (!tabs || !lista) return;
  const ahora = new Date();
  const hoy = (ahora.getDay() + 6) % 7;
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() - hoy);
  tabs.innerHTML = MENU_SEMANA.map((d, i) => {
    const f = new Date(lunes);
    f.setDate(lunes.getDate() + i);
    return `<button type="button" class="dia-tab${i === hoy ? ' es-hoy' : ''}" role="tab" id="dia-${i}" aria-selected="false" aria-controls="plannerPanel" tabindex="-1" data-dia="${i}"><span class="dia-tab__nombre">${d.corto}</span><span class="dia-tab__fecha">${f.getDate()}</span>${i === hoy ? '<span class="sr-only">, hoy</span>' : ''}</button>`;
  }).join('');
  sec.querySelectorAll('.cinta__dias span').forEach((s, i) => s.classList.toggle('es-hoy', i === hoy));
  const botones = [...tabs.querySelectorAll('[data-dia]')];
  let actual = -1;
  const elegir = (i, conFoco, animar) => {
    if (i === actual) return;
    actual = i;
    const d = MENU_SEMANA[i];
    botones.forEach((b, k) => {
      const on = k === i;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (conFoco) botones[i].focus();
    panel?.setAttribute('aria-labelledby', `dia-${i}`);
    const enCurso = i === hoy ? momentoActual(new Date()) : -1;
    lista.innerHTML = d.comidas.map(([plato, min], k) => `<li class="comida${k === enCurso ? ' es-ahora' : ''}${animar && !reduceMotion ? ' entra' : ''}"${animar ? ` style="animation-delay:${(k * 0.06).toFixed(2)}s"` : ''}>
        <span class="comida__momento"><span class="comida__nombre">${MOMENTOS[k].nombre}</span><span class="comida__hora">${MOMENTOS[k].hora}</span><span class="comida__ahora">Ahora</span></span>
        <span class="comida__plato">${esc(plato)}</span>
        <span class="comida__min"><svg aria-hidden="true"><use href="#i-reloj"/></svg>${min} min</span>
      </li>`).join('');
    const total = d.comidas.reduce((s, c) => s + c[1], 0);
    if (totalEl) totalEl.textContent = minutosTexto(total);
    if (ahoraEl) {
      const f = new Date();
      if (i === hoy) {
        const h = f.getHours();
        ahoraEl.innerHTML = h < 5
          ? `Son las ${horaTexto(f)}. En unas horas, el desayuno: <b>${esc(minuscula(d.comidas[0][0]))}</b>.`
          : `Son las ${horaTexto(f)} y toca ${MOMENTOS[enCurso].toca}: <b>${esc(minuscula(d.comidas[enCurso][0]))}</b>.`;
      } else {
        ahoraEl.innerHTML = `El ${d.dia} arranca con <b>${esc(minuscula(d.comidas[0][0]))}</b>.`;
      }
    }
    if (wsp) wsp.href = linkWsp([`Hola Cocina Plena! Vi el menú del ${d.dia} en la web y quiero consultar por el ebook.`]);
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-dia]');
    if (b) elegir(Number(b.dataset.dia), false, true);
  });
  tabs.addEventListener('keydown', e => {
    const teclas = { ArrowRight: 1, ArrowLeft: -1, Home: 'inicio', End: 'fin' };
    if (!(e.key in teclas)) return;
    e.preventDefault();
    const v = teclas[e.key];
    const i = v === 'inicio' ? 0 : v === 'fin' ? botones.length - 1 : (actual + v + botones.length) % botones.length;
    elegir(i, true, true);
  });
  elegir(hoy, false, false);
}

function initHoy() {
  const el = document.querySelector('[data-hoy]');
  if (!el) return;
  const ahora = new Date();
  const hoy = (ahora.getDay() + 6) % 7;
  const m = momentoActual(ahora);
  const d = MENU_SEMANA[hoy];
  const dia = el.querySelector('[data-hoy-dia]');
  const texto = el.querySelector('[data-hoy-texto]');
  if (dia) dia.textContent = `Hoy · ${d.corto}`;
  if (texto) texto.textContent = `${MOMENTOS[m].frase}: ${minuscula(d.comidas[m][0])}`;
}

function initAntojos() {
  const sec = document.getElementById('antojos');
  if (!sec) return;
  const pista = sec.querySelector('.antojos__pista');
  const paginas = [...sec.querySelectorAll('.pagina')];
  const pasos = [...sec.querySelectorAll('.antojos__paso')];
  const marcas = [...sec.querySelectorAll('[data-marca]')];
  const numEl = sec.querySelector('[data-gramos-total]');
  const N = Math.min(pasos.length, paginas.length, 4);
  if (!pista || N < 2) return;
  if (reduceMotion) sec.classList.add('sin-movimiento');
  const gramos = pasos.map(p => Number(p.dataset.gramos) || 0);
  const d = 1 / (N - 1);
  let activo = -1;
  let frame = 0;
  let mostrado = gramos[0];
  let anim = 0;
  const off = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const recorrido = () => Math.max(1, pista.offsetHeight - (window.innerHeight - off()));
  const progreso = () => clamp01(-(pista.getBoundingClientRect().top - off()) / recorrido());
  const ponerNumero = v => { if (numEl) numEl.textContent = Math.round(v).toLocaleString('es-AR'); };
  const contar = meta => {
    window.cancelAnimationFrame(anim);
    if (reduceMotion || document.hidden) { mostrado = meta; ponerNumero(meta); return; }
    const desde = mostrado;
    const t0 = window.performance.now();
    const paso = ahora => {
      const k = clamp01((ahora - t0) / 650);
      mostrado = desde + (meta - desde) * (1 - Math.pow(1 - k, 3));
      ponerNumero(mostrado);
      if (k < 1) anim = requestAnimationFrame(paso);
    };
    anim = requestAnimationFrame(paso);
    setTimeout(() => { if (Math.round(mostrado) !== meta) { mostrado = meta; ponerNumero(meta); } }, 800);
  };
  const activar = i => {
    if (i === activo) return;
    activo = i;
    pasos.forEach((el, k) => el.classList.toggle('is-on', k === i));
    marcas.forEach((m, k) => {
      m.classList.toggle('is-on', k === i);
      if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
    contar(gramos.slice(0, i + 1).reduce((a, b) => a + b, 0));
  };
  const pintar = () => {
    frame = 0;
    const p = progreso();
    let idx = 0;
    paginas.forEach((pg, k) => {
      if (k >= N - 1) { pg.style.setProperty('--t', '0'); return; }
      const t = reduceMotion ? (p >= (k + 0.5) * d ? 1 : 0) : clamp01((p - k * d - 0.28 * d) / (0.44 * d));
      pg.style.setProperty('--t', t.toFixed(4));
      pg.classList.toggle('es-vuelta', t >= 0.5);
      if (t >= 0.5) idx = k + 1;
    });
    activar(idx);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(pintar); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pintar, { passive: true });
  window.addEventListener('load', pintar);
  marcas.forEach((m, k) => m.addEventListener('click', () => {
    const y = pista.getBoundingClientRect().top + window.scrollY - off() + recorrido() * (k * d) + (k ? 2 : 0);
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  pintar();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const tarjeta = hero.querySelector('.hero-inm__tarjeta');
  if (tarjeta) tl.from(tarjeta, { y: 40, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-hoy, .hero__ebook, .sello'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescarScroll));
}

initModelBarScroll();
initNav();
initAcciones();
initCatalogo();
initColecciones();
initMenuDia();
initHoy();
initAntojos();
initCarrito();
initQuickView();
initFloats();
initFaq();
updateCartBadge();
initReveals();
initHeroMotion();
