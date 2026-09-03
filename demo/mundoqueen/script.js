const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const WSP = '5493888444909';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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

/* ---------- DATOS ---------- */
const CATEGORIAS = [
  { id: 'unas', nombre: 'Uñas', bajada: 'Esmaltes, geles y todo lo del pulido', img: 'images/p3-geles-paleta.webp' },
  { id: 'pestanas', nombre: 'Pestañas', bajada: 'Bandejas, pinzas y kits de extensión', img: 'images/p5-cajas-pestanas.webp' },
  { id: 'perfumeria', nombre: 'Perfumería', bajada: 'Perfumes, splash y cuidado', img: 'images/p6-perfume.webp' },
  { id: 'boutique', nombre: 'Boutique', bajada: 'Accesorios y detalles para regalar', img: 'images/p7-aros.webp' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Esmalte semipermanente Rosa Queen', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p1-esmaltes-color.webp', tags: 'esmalte semipermanente rosa color', desc: 'Semipermanente de alta cobertura, dos capas y listo. Rinde entre tres y cuatro semanas con el sellador correcto.' },
  { id: 2, nombre: 'Esmalte semipermanente Nude Clásico', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p2-esmaltes-nude.webp', tags: 'esmalte semipermanente nude beige', desc: 'El nude que más sale del salón. Queda parejo sobre uña corta y no amarillea.' },
  { id: 3, nombre: 'Esmalte semipermanente Magenta Night', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p1-esmaltes-color.webp', badge: 'Nuevo', tags: 'esmalte semipermanente magenta fucsia', desc: 'Magenta profundo, el color de la casa. Muy pigmentado: con una sola capa ya cubre.' },
  { id: 4, nombre: 'Esmalte semipermanente Rojo Cereza', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p1-esmaltes-color.webp', tags: 'esmalte semipermanente rojo cereza', desc: 'Rojo clásico con fondo frío. El más pedido para fiestas y eventos.' },
  { id: 5, nombre: 'Esmalte semipermanente Coral Verano', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p2-esmaltes-nude.webp', tags: 'esmalte semipermanente coral naranja', desc: 'Coral cálido, ideal para piel morena. Se lleva muy bien con uña corta y cuadrada.' },
  { id: 6, nombre: 'Esmalte semipermanente Lila Suave', cat: 'unas', precio: 8900, descuento: 0, img: 'images/p1-esmaltes-color.webp', tags: 'esmalte semipermanente lila violeta', desc: 'Lila empolvado, de los que quedan bien todo el año. Cobertura media, se recomienda en dos capas.' },
  { id: 7, nombre: 'Set de esmaltes x3 tonos nude', cat: 'unas', precio: 24500, descuento: 15, img: 'images/p2-esmaltes-nude.webp', tags: 'set esmaltes nude combo', desc: 'Tres nudes que se complementan: uno rosado, uno beige y uno más tostado. El combo básico para arrancar.' },
  { id: 8, nombre: 'Paleta de exhibición 36 tonos', cat: 'unas', precio: 18900, descuento: 0, img: 'images/p3-geles-paleta.webp', tags: 'paleta exhibidor muestrario tonos', desc: 'Muestrario abanico con 36 tonos pintados, para que la clienta elija sin abrir frascos.' },
  { id: 9, nombre: 'Gel constructor transparente 30 g', cat: 'unas', precio: 15600, descuento: 0, img: 'images/p3-geles-paleta.webp', tags: 'gel constructor esculpido transparente', desc: 'Gel de media densidad, autonivelante. Sirve para esculpido y para kapping sobre uña natural.' },
  { id: 10, nombre: 'Kit de iniciación en uñas', cat: 'unas', precio: 89000, descuento: 10, img: 'images/p3-geles-paleta.webp', badge: 'Más vendido', tags: 'kit inicio principiante unas combo', desc: 'Todo lo necesario para arrancar: geles, esmaltes base, tips, pinceles y limas. Armado por nosotras según lo que realmente se usa.' },

  { id: 11, nombre: 'Bandeja de pestañas C 0.15 mixta', cat: 'pestanas', precio: 12400, descuento: 0, img: 'images/a3-pestanas.webp', tags: 'bandeja pestanas curvatura c extension', desc: 'Bandeja de 16 líneas con largos de 8 a 14 mm. Fibra mate, sin brillo plástico.' },
  { id: 12, nombre: 'Bandeja de pestañas D 0.10 volumen', cat: 'pestanas', precio: 13900, descuento: 0, img: 'images/a3-pestanas.webp', tags: 'bandeja pestanas volumen ruso curvatura d', desc: 'Para técnica de volumen: abre fácil en abanico y no se pega entre sí.' },
  { id: 13, nombre: 'Pestañas postizas por tira x5', cat: 'pestanas', precio: 6800, descuento: 0, img: 'images/p4-pestanas-pinza.webp', tags: 'pestanas postizas tira reutilizable', desc: 'Cinco pares de tira, banda flexible. Reutilizables si se limpian con cuidado.' },
  { id: 14, nombre: 'Pinza recta profesional', cat: 'pestanas', precio: 9700, descuento: 0, img: 'images/p4-pestanas-pinza.webp', tags: 'pinza tweezer recta acero herramienta', desc: 'Acero inoxidable, punta fina y cierre parejo. La que usamos en el salón todos los días.' },
  { id: 15, nombre: 'Caja de extensiones surtidas x10', cat: 'pestanas', precio: 41000, descuento: 12, img: 'images/p5-cajas-pestanas.webp', tags: 'caja extensiones surtido combo pestanas', desc: 'Diez bandejas con curvaturas y espesores variados, para tener stock sin comprar de a una.' },
  { id: 16, nombre: 'Kit de iniciación en pestañas', cat: 'pestanas', precio: 76000, descuento: 0, img: 'images/p5-cajas-pestanas.webp', badge: 'Más vendido', tags: 'kit inicio principiante pestanas combo', desc: 'Bandejas, adhesivo, pinzas, pads y primer. El armado que le damos a quien recién termina el curso.' },

  { id: 17, nombre: 'Perfume floral 100 ml', cat: 'perfumeria', precio: 32900, descuento: 0, img: 'images/p6-perfume.webp', tags: 'perfume floral mujer fragancia', desc: 'Salida cítrica y fondo floral blanco. Buena permanencia para uso diario.' },
  { id: 18, nombre: 'Perfume amaderado 100 ml', cat: 'perfumeria', precio: 32900, descuento: 0, img: 'images/p6-perfume.webp', tags: 'perfume amaderado unisex fragancia', desc: 'Amaderado seco, con un fondo de vainilla suave. Rinde más de noche que de día.' },
  { id: 19, nombre: 'Body splash cítrico 250 ml', cat: 'perfumeria', precio: 14500, descuento: 0, img: 'images/p6-perfume.webp', tags: 'body splash citrico fresco', desc: 'Fresco y liviano, pensado para después del baño. No mancha la ropa.' },
  { id: 20, nombre: 'Set perfume + body splash', cat: 'perfumeria', precio: 42000, descuento: 15, img: 'images/p6-perfume.webp', tags: 'set perfume splash combo regalo', desc: 'La combinación que más se regala: el perfume y su splash de la misma familia olfativa.' },
  { id: 21, nombre: 'Perfume de autor 50 ml', cat: 'perfumeria', precio: 27900, descuento: 0, img: 'images/p6-perfume.webp', badge: 'Nuevo', tags: 'perfume autor nicho fragancia', desc: 'Fragancia de nicho, más concentrada. Con dos aplicaciones alcanza.' },

  { id: 22, nombre: 'Aros colgantes dorados', cat: 'boutique', precio: 11900, descuento: 0, img: 'images/p7-aros.webp', tags: 'aros colgantes dorados accesorio', desc: 'Colgantes livianos, no tiran del lóbulo. Baño dorado sobre base de acero.' },
  { id: 23, nombre: 'Aros minimalistas de acero', cat: 'boutique', precio: 8600, descuento: 0, img: 'images/p7-aros.webp', tags: 'aros minimalistas acero quirurgico', desc: 'Acero quirúrgico, aptos para uso diario y para piel sensible.' },
  { id: 24, nombre: 'Set de aros x3 pares', cat: 'boutique', precio: 19500, descuento: 10, img: 'images/p7-aros.webp', tags: 'set aros combo tres pares regalo', desc: 'Tres pares que combinan entre sí: uno chico de uso diario, uno mediano y uno colgante.' },
  { id: 25, nombre: 'Collar de acero dorado', cat: 'boutique', precio: 13400, descuento: 0, img: 'images/p7-aros.webp', tags: 'collar cadena acero dorado accesorio', desc: 'Cadena fina con cierre reforzado. No se oscurece con el uso.' },
];

const DESTACADOS = [10, 16, 3, 15, 1, 17, 22, 8];

const TONOS = [
  { id: 'rosa', nombre: 'Rosa Queen', hex: '#E86A9E', prod: 1 },
  { id: 'nude', nombre: 'Nude Clásico', hex: '#C9A48C', prod: 2 },
  { id: 'magenta', nombre: 'Magenta Night', hex: '#C2158F', prod: 3 },
  { id: 'cereza', nombre: 'Rojo Cereza', hex: '#A81232', prod: 4 },
  { id: 'coral', nombre: 'Coral Verano', hex: '#F0714F', prod: 5 },
  { id: 'lila', nombre: 'Lila Suave', hex: '#A78BC9', prod: 6 },
];

/* ---------- CARRITO ---------- */
const Cart = {
  KEY: 'mundoqueen_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

/* ---------- REVEALS ---------- */
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
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

/* ---------- NAV ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

/* ---------- CATEGORÍAS ---------- */
function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<li class="cat" data-animate="up" style="opacity:0;transform:translateY(22px)">
      <button type="button" class="cat-btn" data-cat="${esc(c.id)}">
        <span class="cat-img"><img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="1200" height="1200" decoding="async"><span class="cat-brillo" aria-hidden="true"></span></span>
        <span class="cat-txt">
          <b>${esc(c.nombre)}</b>
          <i>${esc(c.bajada)}</i>
          <em>${n} producto${n === 1 ? '' : 's'}</em>
        </span>
      </button>
    </li>`;
  }).join('');
  grid.querySelectorAll('.cat-btn').forEach(b => {
    b.addEventListener('click', () => {
      filtroCat = b.dataset.cat;
      document.querySelectorAll('#chipsCat .chip').forEach(c => {
        const on = c.dataset.cat === filtroCat;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      renderCatalogo(true);
      document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- CARD DE PRODUCTO ---------- */
function cardHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const cat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const badge = p.descuento > 0 ? `-${p.descuento}%` : (p.badge || '');
  const badgeCls = p.descuento > 0 ? 'prod-badge prod-badge-off' : 'prod-badge';
  const anim = opts.anim === false ? '' : ' data-animate="up" style="opacity:0;transform:translateY(20px)"';
  return `<article class="prod" data-id="${p.id}"${anim}>
    <button type="button" class="prod-img" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async">
      ${badge ? `<span class="${badgeCls}">${esc(badge)}</span>` : ''}
      <span class="prod-brillo" aria-hidden="true"></span>
    </button>
    <div class="prod-body">
      <span class="prod-cat">${esc(cat)}</span>
      <h3 class="prod-nom"><button type="button" data-ver="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-precio">
        <b>${formatearPrecio(fin)}</b>
        ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
          <span data-qty="${p.id}">1</span>
          <button type="button" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function bindCards(cont) {
  if (!cont) return;
  cont.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', ev => {
    if (cont.dataset.dragged === '1') return;
    abrirQuickView(Number(ev.currentTarget.dataset.ver));
  }));
  cont.querySelectorAll('[data-stepper]').forEach(st => {
    const id = Number(st.dataset.stepper);
    st.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
      const span = st.querySelector(`[data-qty="${id}"]`);
      const v = Math.max(1, Math.min(99, Number(span.textContent) + Number(b.dataset.step)));
      span.textContent = v;
    }));
  });
  cont.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const id = Number(b.dataset.add);
    const p = getProducto(id);
    if (!p) return;
    const span = cont.querySelector(`[data-qty="${id}"]`);
    const qty = span ? Number(span.textContent) : 1;
    Cart.add(p, qty);
    showToast(`${p.nombre} — agregado al pedido`);
    if (span) span.textContent = '1';
  }));
}

/* ---------- RAIL: LOS MÁS ELEGIDOS ---------- */
function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  const items = DESTACADOS.map(getProducto).filter(Boolean);
  track.innerHTML = items.map(p => `<div class="rail-item">${cardHTML(p, { anim: false })}</div>`).join('');
  bindCards(track);

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  setTimeout(sync, 400);

  // drag con el mouse (endurecido: try/catch en el pointer capture)
  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      track.dataset.dragged = '1';
      setTimeout(() => { track.dataset.dragged = '0'; }, 60);
    }
    moved = false; pointerId = null;
  };
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
    e.preventDefault();
  });
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

/* ---------- CATÁLOGO ---------- */
let filtroCat = 'todos';
let visibles = 16;
const PAGINA = 16;

function productosFiltrados() {
  const q = normalizar(document.getElementById('buscar')?.value || '').trim();
  const orden = document.getElementById('orden')?.value || 'destacado';
  let lista = PRODUCTOS.filter(p => filtroCat === 'todos' || p.cat === filtroCat);
  if (q) {
    const cats = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre]));
    lista = lista.filter(p => normalizar(`${p.nombre} ${p.tags} ${cats[p.cat] || ''} ${p.desc}`).includes(q));
  }
  const idx = id => { const i = DESTACADOS.indexOf(id); return i === -1 ? 99 : i; };
  if (orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => idx(a.id) - idx(b.id) || a.id - b.id);
  return lista;
}

function renderCatalogo(reset = false) {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!grid) return;
  if (reset) visibles = PAGINA;
  const lista = productosFiltrados();
  const mostrar = lista.slice(0, visibles);

  grid.innerHTML = mostrar.map(p => cardHTML(p)).join('');
  bindCards(grid);
  revelarNuevos(grid);

  if (vacio) vacio.hidden = lista.length !== 0;
  if (res) res.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  if (verMas) verMas.hidden = lista.length <= visibles;
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const chips = document.getElementById('chipsCat');
  if (chips) {
    chips.innerHTML = [{ id: 'todos', nombre: 'Todo' }, ...CATEGORIAS].map(c =>
      `<button type="button" class="chip${c.id === 'todos' ? ' is-on' : ''}" data-cat="${esc(c.id)}" aria-pressed="${c.id === 'todos'}">${esc(c.nombre)}</button>`
    ).join('');
    chips.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
      filtroCat = c.dataset.cat;
      chips.querySelectorAll('.chip').forEach(x => {
        const on = x.dataset.cat === filtroCat;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      renderCatalogo(true);
    }));
  }
  document.getElementById('buscar')?.addEventListener('input', () => renderCatalogo(true));
  document.getElementById('orden')?.addEventListener('change', () => renderCatalogo(true));
  document.getElementById('verMas')?.addEventListener('click', () => { visibles += PAGINA; renderCatalogo(); });

  const limpiar = () => {
    const b = document.getElementById('buscar'); if (b) b.value = '';
    const o = document.getElementById('orden'); if (o) o.value = 'destacado';
    filtroCat = 'todos';
    document.querySelectorAll('#chipsCat .chip').forEach(x => {
      const on = x.dataset.cat === 'todos';
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderCatalogo(true);
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);

  renderCatalogo(true);
}

/* ---------- VISTA RÁPIDA ---------- */
let qvUltimoFoco = null;
function abrirQuickView(id) {
  const p = getProducto(id);
  const bd = document.getElementById('qvBackdrop');
  const cont = document.getElementById('qvIn');
  if (!p || !bd || !cont) return;
  const fin = precioFinal(p);
  const cat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const sugeridos = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `
    <div class="qv-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async"></div>
    <div class="qv-txt">
      <span class="qv-cat">${esc(cat)}</span>
      <h3>${esc(p.nombre)}</h3>
      <p class="qv-precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><em>-${p.descuento}%</em>` : ''}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <div class="qv-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
          <span data-qty="${p.id}">1</span>
          <button type="button" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-primary" data-add="${p.id}">Agregar al pedido</button>
        <button type="button" class="btn btn-ghost" id="qvComprar">Comprar ahora</button>
      </div>
      ${sugeridos.length ? `<div class="qv-sug"><span>También te puede servir</span><div>${sugeridos.map(s => `<button type="button" data-ver="${s.id}"><img src="${esc(s.img)}" alt="${esc(s.nombre)}" width="1200" height="1200" loading="lazy" decoding="async"><i>${esc(s.nombre)}</i></button>`).join('')}</div></div>` : ''}
    </div>`;
  bindCards(cont);
  document.getElementById('qvComprar')?.addEventListener('click', () => {
    const span = cont.querySelector(`[data-qty="${p.id}"]`);
    Cart.add(p, span ? Number(span.textContent) : 1);
    cerrarQuickView();
    abrirDrawer();
  });
  qvUltimoFoco = document.activeElement;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('qvClose')?.focus();
}
function cerrarQuickView() {
  const bd = document.getElementById('qvBackdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  if (!document.getElementById('drawer')?.hidden) return;
  document.body.classList.remove('no-scroll');
  qvUltimoFoco?.focus?.();
}
function initQuickView() {
  const bd = document.getElementById('qvBackdrop');
  if (!bd) return;
  document.getElementById('qvClose')?.addEventListener('click', cerrarQuickView);
  bd.addEventListener('click', e => { if (e.target === bd) cerrarQuickView(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bd.hidden) cerrarQuickView(); });
  bd.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...bd.querySelectorAll('button, a[href], input, select, textarea')].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- DRAWER ---------- */
let drUltimoFoco = null;
function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="dr-vacio">
      <span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg></span>
      <h3>Todavía no elegiste nada</h3>
      <p>Agregá lo que necesites y lo cerramos por WhatsApp.</p>
      <button type="button" class="btn btn-primary" data-cerrar-drawer>Ver la tienda</button>
    </div>`;
    foot.innerHTML = '';
    body.querySelector('[data-cerrar-drawer]')?.addEventListener('click', cerrarDrawer);
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="dr-item">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
      <div class="dr-info">
        <b>${esc(p.nombre)}</b>
        <span>${formatearPrecio(precioFinal(p))}</span>
        <div class="stepper stepper-sm">
          <button type="button" data-dr-menos="${p.id}" aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button type="button" data-dr-mas="${p.id}" aria-label="Sumar uno">+</button>
        </div>
      </div>
      <button type="button" class="dr-quitar" data-dr-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>`;
  }).join('');
  const total = Cart.total();
  const lineas = items.map(i => { const p = getProducto(i.id); return p ? `• ${p.nombre} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean);
  const msg = `Hola Mundo Queen, quiero hacer este pedido:\n${lineas.join('\n')}\n\nTotal: ${formatearPrecio(total)}`;
  foot.innerHTML = `
    <div class="dr-total"><span>Total</span><b>${formatearPrecio(total)}</b></div>
    <a class="btn btn-primary dr-wsp" href="https://wa.me/${WSP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>
    <button type="button" class="btn btn-ghost" id="drFinalizar">Finalizar compra</button>
    <button type="button" class="dr-vaciar" id="drVaciar">Vaciar el pedido</button>`;
  body.querySelectorAll('[data-dr-menos]').forEach(b => b.addEventListener('click', () => {
    const id = Number(b.dataset.drMenos);
    const it = Cart.get().find(x => x.id === id);
    if (it && it.qty <= 1) Cart.remove(id); else Cart.setQty(id, (it?.qty || 1) - 1);
  }));
  body.querySelectorAll('[data-dr-mas]').forEach(b => b.addEventListener('click', () => {
    const id = Number(b.dataset.drMas);
    const it = Cart.get().find(x => x.id === id);
    Cart.setQty(id, (it?.qty || 1) + 1);
  }));
  body.querySelectorAll('[data-dr-quitar]').forEach(b => b.addEventListener('click', () => Cart.remove(Number(b.dataset.drQuitar))));
  document.getElementById('drVaciar')?.addEventListener('click', () => { Cart.clear(); showToast('Pedido vaciado'); });
  document.getElementById('drFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}
function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!dr || !bd) return;
  drUltimoFoco = document.activeElement;
  renderDrawer();
  bd.hidden = false; dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}
function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => { dr.hidden = true; bd.hidden = true; }, 320);
  if (document.getElementById('qvBackdrop')?.hidden !== false) document.body.classList.remove('no-scroll');
  drUltimoFoco?.focus?.();
}
function initDrawer() {
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('drawer')?.hidden === false) cerrarDrawer();
  });
  const dr = document.getElementById('drawer');
  dr?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...dr.querySelectorAll('button, a[href], input')].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  document.addEventListener('cart:updated', () => { if (dr && !dr.hidden) renderDrawer(); });
  updateCartBadge();
}

/* ---------- FLOTANTES ---------- */
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ---------- BLOQUE INTERACTIVO: PROBADOR DE COLOR ---------- */
function initProbador() {
  const wrapTonos = document.getElementById('pbTonos');
  const unas = document.getElementById('pbUnas');
  const elTono = document.getElementById('pbTono');
  const elProd = document.getElementById('pbProd');
  if (!wrapTonos || !unas || !elProd) return;

  let sel = TONOS[0].id;

  wrapTonos.innerHTML = TONOS.map(t =>
    `<button type="button" class="tono${t.id === sel ? ' is-on' : ''}" data-tono="${esc(t.id)}" aria-pressed="${t.id === sel}" title="${esc(t.nombre)}">
      <span style="background:${esc(t.hex)}"></span><i>${esc(t.nombre)}</i>
    </button>`).join('');

  const pintar = () => {
    const t = TONOS.find(x => x.id === sel);
    if (!t) return;
    unas.style.setProperty('--tono', t.hex);
    if (elTono) elTono.textContent = t.nombre;
    const p = getProducto(t.prod);
    if (!p) { elProd.innerHTML = ''; return; }
    const fin = precioFinal(p);
    elProd.innerHTML = `
      <div class="pb-prod-in">
        <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async">
        <div>
          <span class="pb-prod-lbl">El esmalte que lo hace</span>
          <h3>${esc(p.nombre)}</h3>
          <p class="pb-prod-precio">${formatearPrecio(fin)}</p>
        </div>
      </div>
      <div class="pb-prod-cta">
        <button type="button" class="btn btn-primary" data-add="${p.id}">Agregar al pedido</button>
        <button type="button" class="btn btn-ghost" data-ver="${p.id}">Ver detalle</button>
      </div>`;
    bindCards(elProd);
  };

  wrapTonos.querySelectorAll('.tono').forEach(b => b.addEventListener('click', () => {
    sel = b.dataset.tono;
    wrapTonos.querySelectorAll('.tono').forEach(x => {
      const on = x.dataset.tono === sel;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    pintar();
  }));

  pintar();
}

/* ---------- HERO ---------- */
function initHero() {
  document.querySelectorAll('.hero-vitrina > [data-animate]').forEach((el, i) => {
    el.style.transitionDelay = `${(0.18 + i * 0.12).toFixed(2)}s`;
  });
}

/* ---------- TEXTO QUE SE LEE CON EL SCROLL ---------- */
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ---------- DEVOLUCIÓN DE DEMO ---------- */
const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    window.lenis?.stop();
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

/* ---------- ARRANQUE ---------- */
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initCategorias();
initRail();
initCatalogo();
initProbador();
initReveals();
initNav();
initDrawer();
initQuickView();
initFloats();
initHero();
initLeeScroll();
initFeedbackFloat();
