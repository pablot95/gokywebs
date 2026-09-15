document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WSP = '5491127993901';
const PLANES = [3, 6, 9, 12];
const PLAN_DEFAULT = 12;
const ENVIO_GRATIS_DESDE = 350000;

const RUBROS = [
  { id: 'heladeras', nombre: 'Heladeras' },
  { id: 'lavado', nombre: 'Lavado' },
  { id: 'tv', nombre: 'TV y audio' },
  { id: 'cocina', nombre: 'Cocina' },
  { id: 'limpieza', nombre: 'Limpieza' },
];

const PRODUCTOS = [
  {
    id: 'heladera-french-door',
    nombre: 'Heladera French Door No Frost con dispenser',
    rubro: 'heladeras',
    img: 'images/heladera-french-door_1x1.webp',
    alt: 'Heladera french door de acero inoxidable con dispenser de agua en una cocina blanca',
    precio: 1849000,
    descuento: 0,
    stock: 6,
    badge: 'Más elegida',
    etiquetas: 'inox acero no frost dispenser agua freezer abajo grande familia',
    desc: 'La heladera que ordena toda la cocina: dos puertas arriba, freezer cajón abajo y dispenser de agua sin abrir la puerta. Frío No Frost parejo en todos los estantes, sin escarcha ni descongelado manual.',
    specs: ['No Frost — nunca más raspar hielo', 'Dispenser de agua fría en la puerta', 'Estantes de vidrio templado regulables', 'Bajo consumo clase A', 'Garantía oficial 12 meses'],
    variantes: [
      { id: '425', nombre: '425 litros', precio: 1529000 },
      { id: '550', nombre: '550 litros', precio: 1849000 },
    ],
  },
  {
    id: 'lavarropas-frontal',
    nombre: 'Lavarropas carga frontal 1400 rpm',
    rubro: 'lavado',
    img: 'images/lavarropas-frontal_1x1.webp',
    alt: 'Lavarropas de carga frontal color acero instalado en un lavadero blanco',
    precio: 989000,
    descuento: 0,
    stock: 8,
    badge: 'Entrega rápida',
    etiquetas: 'lavarropas frontal 9 kg 12 kg centrifugado vapor lavado',
    desc: 'Carga frontal con 1400 revoluciones de centrifugado: la ropa sale casi seca y el tendido dura la mitad. Quince programas, entre ellos lavado rápido de 30 minutos y ciclo para ropa delicada.',
    specs: ['1400 rpm de centrifugado', '15 programas de lavado', 'Ciclo rápido de 30 minutos', 'Traba para chicos', 'Garantía oficial 12 meses'],
    variantes: [
      { id: '9kg', nombre: '9 kg', precio: 989000 },
      { id: '12kg', nombre: '12 kg', precio: 1239000 },
    ],
  },
  {
    id: 'smart-tv-4k',
    nombre: 'Smart TV 4K UHD con control por voz',
    rubro: 'tv',
    img: 'images/smart-tv_1x1.webp',
    alt: 'Smart TV de pantalla grande sobre un rack blanco en un living luminoso',
    precio: 1199000,
    descuento: 0,
    stock: 10,
    badge: 'Nuevo',
    etiquetas: 'televisor smart tv 4k uhd 50 55 65 pulgadas hdr netflix',
    desc: 'Panel 4K con HDR y todas las apps instaladas de fábrica. Tres entradas HDMI para la consola, el decodificador y la barra de sonido, sin andar desenchufando nada.',
    specs: ['Resolución 4K UHD con HDR', 'Todas las apps de streaming', '3 HDMI y 2 USB', 'Control remoto con micrófono', 'Garantía oficial 12 meses'],
    variantes: [
      { id: '50', nombre: '50 pulgadas', precio: 749000 },
      { id: '55', nombre: '55 pulgadas', precio: 879000 },
      { id: '65', nombre: '65 pulgadas', precio: 1199000 },
    ],
  },
  {
    id: 'microondas-30l',
    nombre: 'Microondas digital 30 litros acero',
    rubro: 'cocina',
    img: 'images/microondas_1x1.webp',
    alt: 'Microondas digital de acero inoxidable sobre la mesada de una cocina blanca',
    precio: 389000,
    descuento: 0,
    stock: 12,
    badge: '',
    etiquetas: 'microondas grill 30 litros acero inoxidable descongelar',
    desc: 'Treinta litros reales: entra una fuente de horno sin girarla de costado. Diez niveles de potencia, grill y menú de descongelado por peso.',
    specs: ['30 litros de capacidad', 'Grill incorporado', 'Descongelado por peso', 'Plato giratorio de vidrio', 'Garantía oficial 12 meses'],
    variantes: [],
  },
  {
    id: 'freidora-aire-6l',
    nombre: 'Freidora de aire digital 6 litros',
    rubro: 'cocina',
    img: 'images/freidora-de-aire_1x1.webp',
    alt: 'Freidora de aire negra sobre una mesada blanca junto a un plato de salmón y verduras',
    precio: 219900,
    descuento: 15,
    stock: 14,
    badge: '',
    etiquetas: 'freidora de aire air fryer 6 litros digital sin aceite',
    desc: 'Seis litros para cocinar para cuatro de una sola vez. Ocho programas táctiles y canasto antiadherente que va al lavavajillas.',
    specs: ['6 litros de capacidad', '8 programas táctiles', 'Canasto apto lavavajillas', 'Apagado automático', 'Garantía oficial 12 meses'],
    variantes: [],
  },
  {
    id: 'aspiradora-inalambrica',
    nombre: 'Aspiradora inalámbrica 25 kPa',
    rubro: 'limpieza',
    img: 'images/aspiradora-inalambrica_1x1.webp',
    alt: 'Aspiradora inalámbrica roja apoyada sobre la alfombra de un living',
    precio: 279000,
    descuento: 10,
    stock: 9,
    badge: '',
    etiquetas: 'aspiradora inalambrica escoba bateria sin cable alfombra',
    desc: 'Veinticinco kilopascales de succión sin cable dando vueltas. Cuarenta minutos de batería, cabezal con luz y accesorios para sillones, auto y rincones.',
    specs: ['25 kPa de succión', '40 minutos de autonomía', 'Cabezal con luz LED', 'Filtro HEPA lavable', 'Garantía oficial 12 meses'],
    variantes: [],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getRubro = id => RUBROS.find(r => r.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function varianteMasBarata(p) {
  return p.variantes.reduce((a, b) => (b.precio < a.precio ? b : a), p.variantes[0]);
}
function getVariante(p, vid) {
  if (!p || !p.variantes.length) return null;
  return p.variantes.find(v => v.id === vid) || varianteMasBarata(p);
}
function precioBase(p, vid) {
  const v = getVariante(p, vid);
  return v ? v.precio : p.precio;
}
function vidDefault(p) {
  return p.variantes.length ? varianteMasBarata(p).id : null;
}
function precioFinal(p, vid) {
  const base = precioBase(p, vid);
  return p.descuento > 0 ? Math.round(base * (1 - p.descuento / 100)) : base;
}
function cuotaDe(monto, planes = PLAN_DEFAULT) {
  return Math.round(monto / planes);
}

const Cart = {
  KEY: 'creditoscrecer_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, vid, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === vid);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v: vid, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, vid, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === vid);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, vid) { this.save(this.get().filter(i => !(i.id === id && i.v === vid))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p, i.v) * i.qty : s;
    }, 0);
  },
};

const Fav = {
  KEY: 'creditoscrecer_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const list = this.get();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    document.dispatchEvent(new CustomEvent('fav:updated'));
    return i < 0;
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

function wsp(texto) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
}

function trapFocus(panel, e) {
  if (e.key !== 'Tab') return;
  const foco = panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- catálogo ---------- */

const grid = document.getElementById('gridProductos');
const catCount = document.getElementById('catCount');
const sinResultados = document.getElementById('sinResultados');
const inputBuscar = document.getElementById('buscador');
const selOrden = document.getElementById('orden');
const chipsRubro = document.getElementById('chipsRubro');

let filtroRubro = 'todos';
let soloFav = false;
let cardBatch = [];

function textoBuscable(p) {
  return normalizar([p.nombre, getRubro(p.rubro)?.nombre || '', p.desc, p.etiquetas, p.variantes.map(v => v.nombre).join(' ')].join(' '));
}

function productosFiltrados() {
  const q = normalizar(inputBuscar ? inputBuscar.value.trim() : '');
  const favs = Fav.get();
  let lista = PRODUCTOS.filter(p => (filtroRubro === 'todos' || p.rubro === filtroRubro) && (!soloFav || favs.includes(p.id)));
  if (q) {
    const palabras = q.split(/\s+/);
    lista = lista.filter(p => { const t = textoBuscable(p); return palabras.every(w => t.includes(w)); });
  }
  const orden = selOrden ? selOrden.value : 'destacados';
  if (orden === 'precio-asc') lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
  if (orden === 'precio-desc') lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
  if (orden === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}

function cardHTML(p) {
  const v = getVariante(p, null);
  const final = precioFinal(p, v?.id);
  const base = precioBase(p, v?.id);
  const cuota = cuotaDe(final);
  const desde = p.variantes.length > 1 ? '<span class="price-desde">Desde</span>' : '';
  const badge = p.descuento > 0
    ? `<span class="card-badge">-${p.descuento}%</span>`
    : (p.badge ? `<span class="card-badge is-blue">${esc(p.badge)}</span>` : '');
  return `
    <article class="card" data-id="${p.id}" data-flip-id="${p.id}">
      <div class="card-media" data-quick="${p.id}" role="button" tabindex="0" aria-label="Ver la ficha de ${esc(p.nombre)}">
        <img src="${p.img}" alt="${esc(p.alt)}" width="1254" height="1254" loading="lazy" decoding="async">
        ${badge}
        <button type="button" class="card-fav${Fav.has(p.id) ? ' is-on' : ''}" data-fav="${p.id}" aria-label="Guardar ${esc(p.nombre)} en favoritos" aria-pressed="${Fav.has(p.id)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <button type="button" class="card-quick" data-quick="${p.id}" tabindex="-1">Ver ficha</button>
      </div>
      <div class="card-body">
        <p class="card-rubro">${esc(getRubro(p.rubro)?.nombre || '')}</p>
        <h3 class="card-name">${esc(p.nombre)}</h3>
        <div class="card-price">
          ${desde}
          <span class="price-now">${formatearPrecio(final)}</span>
          ${p.descuento > 0 ? `<s class="price-old">${formatearPrecio(base)}</s>` : ''}
        </div>
        <p class="card-cuota">12 cuotas de <strong>${formatearPrecio(cuota)}</strong></p>
        <div class="card-actions">
          <div class="qty" data-qty>
            <button type="button" data-step="-1" aria-label="Quitar una unidad">−</button>
            <span data-val>1</span>
            <button type="button" data-step="1" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="btn btn-primary card-add" data-add="${p.id}">Agregar</button>
        </div>
        <button type="button" class="card-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </article>`;
}

function revealCards(cards) {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  cardBatch.forEach(t => t.kill());
  cardBatch = [];
  gsap.set(cards, { opacity: 0, y: 46, scale: .95 });
  if (typeof ScrollTrigger !== 'undefined') {
    cardBatch = ScrollTrigger.batch(cards, {
      start: 'top 92%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: .8, stagger: .12, ease: 'power3.out', overwrite: true }),
    });
    ScrollTrigger.refresh();
  } else {
    gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: .7, stagger: .1 });
  }
  setTimeout(() => cards.forEach(c => { if (parseFloat(window.getComputedStyle(c).opacity) < .05) gsap.set(c, { opacity: 1, y: 0, scale: 1 }); }), 1500);
}

function renderCatalogo(conFlip) {
  if (!grid) return;
  const lista = productosFiltrados();
  const usarFlip = conFlip && typeof window.Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion && grid.children.length;
  const estado = usarFlip ? window.Flip.getState(grid.querySelectorAll('.card')) : null;

  grid.innerHTML = lista.map(cardHTML).join('');
  const cards = [...grid.children];

  if (catCount) {
    const sufijo = soloFav ? ' en tus favoritos' : ' disponibles';
    catCount.textContent = lista.length === 1
      ? '1 producto' + (soloFav ? ' en tus favoritos' : ' disponible')
      : `${lista.length} productos${sufijo}`;
  }
  if (sinResultados) sinResultados.hidden = lista.length > 0;

  if (estado) {
    window.Flip.from(estado, {
      duration: .55, ease: 'power2.inOut', stagger: .02, absolute: true, scale: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .88 }, { opacity: 1, scale: 1, duration: .45, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .88, duration: .28 }),
      onComplete: () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); },
    });
  } else {
    revealCards(cards);
  }
}

function initCatalogo() {
  if (!grid) return;

  if (chipsRubro) {
    chipsRubro.innerHTML = [{ id: 'todos', nombre: 'Todos' }, ...RUBROS]
      .map(r => `<button type="button" class="chip${r.id === 'todos' ? ' is-on' : ''}" data-rubro="${r.id}" aria-pressed="${r.id === 'todos'}">${esc(r.nombre)}</button>`).join('');
    chipsRubro.addEventListener('click', e => {
      const btn = e.target.closest('[data-rubro]');
      if (!btn) return;
      filtroRubro = btn.dataset.rubro;
      soloFav = false;
      chipsRubro.querySelectorAll('.chip').forEach(c => {
        const on = c === btn;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      renderCatalogo(true);
    });
  }

  let debounce;
  inputBuscar?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => renderCatalogo(true), 180);
  });
  selOrden?.addEventListener('change', () => renderCatalogo(true));

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    filtroRubro = 'todos';
    soloFav = false;
    if (inputBuscar) inputBuscar.value = '';
    if (selOrden) selOrden.value = 'destacados';
    chipsRubro?.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.rubro === 'todos';
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    renderCatalogo(true);
    inputBuscar?.focus();
  });

  grid.addEventListener('click', e => {
    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      const box = stepBtn.closest('[data-qty]');
      const val = box.querySelector('[data-val]');
      const n = Math.max(1, Math.min(99, parseInt(val.textContent, 10) + parseInt(stepBtn.dataset.step, 10)));
      val.textContent = n;
      return;
    }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const on = Fav.toggle(fav.dataset.fav);
      fav.classList.toggle('is-on', on);
      fav.setAttribute('aria-pressed', String(on));
      showToast(on ? 'Guardado en favoritos' : 'Lo sacamos de favoritos');
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, add.closest('.card'), false); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) { agregar(buy.dataset.buy, buy.closest('.card'), true); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick, quick); }
  });

  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const media = e.target.closest('.card-media[data-quick]');
    if (!media) return;
    e.preventDefault();
    abrirModal(media.dataset.quick, media);
  });

  renderCatalogo(false);
}

function agregar(id, card, abrir) {
  const p = getProducto(id);
  if (!p) return;
  const qty = card ? parseInt(card.querySelector('[data-val]')?.textContent || '1', 10) : 1;
  Cart.add(p, vidDefault(p), qty);
  if (abrir) abrirCarrito();
  else showToast('¡Listo! Ya está en tu carrito');
}

/* ---------- carrito ---------- */

const drawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItems = document.getElementById('cartItems');
const cartFoot = document.getElementById('cartFoot');
const cartEnvio = document.getElementById('cartEnvio');
const cartBadge = document.getElementById('cartBadge');
let ultimoFocoCarrito = null;

function abrirCarrito() {
  if (!drawer) return;
  ultimoFocoCarrito = document.activeElement;
  drawer.classList.add('open');
  cartBackdrop?.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(drawer.querySelectorAll('.cart-line'), { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: .4, stagger: .06, ease: 'power2.out', delay: .12 });
  }
}
function cerrarCarrito() {
  if (!drawer) return;
  drawer.classList.remove('open');
  cartBackdrop?.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFocoCarrito?.focus();
}

function renderCarrito() {
  const items = Cart.get();
  const total = Cart.total();

  if (cartBadge) {
    const n = Cart.count();
    cartBadge.textContent = n;
    cartBadge.hidden = n === 0;
    if (n > 0) { cartBadge.classList.remove('bump'); void cartBadge.offsetWidth; cartBadge.classList.add('bump'); }
  }

  if (cartEnvio) {
    if (!items.length) cartEnvio.innerHTML = '';
    else if (total >= ENVIO_GRATIS_DESDE) {
      cartEnvio.className = 'cart-envio is-free';
      cartEnvio.innerHTML = `<strong>¡Tenés entrega e instalación sin cargo! 🎉</strong><div class="envio-bar"><i style="width:100%"></i></div>`;
    } else {
      const falta = ENVIO_GRATIS_DESDE - total;
      cartEnvio.className = 'cart-envio';
      cartEnvio.innerHTML = `Te faltan <strong>${formatearPrecio(falta)}</strong> para la entrega sin cargo<div class="envio-bar"><i style="width:${Math.round(total / ENVIO_GRATIS_DESDE * 100)}%"></i></div>`;
    }
  }

  if (!cartItems || !cartFoot) return;

  if (!items.length) {
    cartItems.innerHTML = `
      <div class="cart-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 3h2.2l2.3 11.2a1.8 1.8 0 0 0 1.8 1.4h8.6a1.8 1.8 0 0 0 1.8-1.4L21 7H6"/><circle cx="9.5" cy="20" r="1.6"/><circle cx="17.5" cy="20" r="1.6"/></svg>
        <h3>Todavía no elegiste nada</h3>
        <p>Mirá el catálogo: cada producto te muestra la cuota antes de agregarlo.</p>
      </div>`;
    cartFoot.innerHTML = `<button type="button" class="btn btn-primary" data-cerrar-carrito>Ver el catálogo</button>`;
    return;
  }

  cartItems.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const v = getVariante(p, i.v);
    const unit = precioFinal(p, i.v);
    return `
      <div class="cart-line">
        <div class="cart-line-media"><img src="${p.img}" alt="${esc(p.alt)}" width="1254" height="1254" loading="lazy" decoding="async"></div>
        <div>
          <h3>${esc(p.nombre)}</h3>
          ${v ? `<p class="var">${esc(v.nombre)}</p>` : ''}
          <p class="pr">${formatearPrecio(unit * i.qty)}</p>
          <p class="cu">12 × ${formatearPrecio(cuotaDe(unit * i.qty))}</p>
        </div>
        <div class="cart-line-side">
          <div class="qty">
            <button type="button" data-cline="-1" data-id="${p.id}" data-v="${i.v ?? ''}" aria-label="Quitar una unidad">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cline="1" data-id="${p.id}" data-v="${i.v ?? ''}" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="line-del" data-del="${p.id}" data-v="${i.v ?? ''}">Quitar</button>
        </div>
      </div>`;
  }).join('');

  const mensaje = 'Hola Créditos Crecer, quiero avanzar con este pedido:\n\n' +
    items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      const v = getVariante(p, i.v);
      return `• ${p.nombre}${v ? ' (' + v.nombre + ')' : ''} x${i.qty} — ${formatearPrecio(precioFinal(p, i.v) * i.qty)}`;
    }).filter(Boolean).join('\n') +
    `\n\nTotal: ${formatearPrecio(total)}\nMe interesa el plan de 12 cuotas de ${formatearPrecio(cuotaDe(total))}.`;

  cartFoot.innerHTML = `
    <div class="cart-total"><span>Total</span><span>${formatearPrecio(total)}</span></div>
    <p class="cart-cuota">o 12 cuotas de <strong>${formatearPrecio(cuotaDe(total))}</strong></p>
    <button type="button" class="btn btn-primary" id="finalizar">Finalizar compra</button>
    <a class="btn btn-blue" href="${wsp(mensaje)}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
    <button type="button" class="line-del" id="vaciar">Vaciar el carrito</button>`;
}

function initCarrito() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirCarrito);
  document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
  cartBackdrop?.addEventListener('click', cerrarCarrito);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) cerrarCarrito();
  });
  drawer?.addEventListener('keydown', e => trapFocus(drawer, e));

  cartItems?.addEventListener('click', e => {
    const step = e.target.closest('[data-cline]');
    if (step) {
      const items = Cart.get();
      const v = step.dataset.v === '' ? null : step.dataset.v;
      const it = items.find(i => i.id === step.dataset.id && i.v === v);
      if (it) Cart.setQty(step.dataset.id, v, it.qty + parseInt(step.dataset.cline, 10));
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del, del.dataset.v === '' ? null : del.dataset.v); showToast('Lo sacamos del carrito'); }
  });

  cartFoot?.addEventListener('click', e => {
    if (e.target.closest('#finalizar')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (e.target.closest('#vaciar')) { Cart.clear(); showToast('Carrito vacío'); }
    if (e.target.closest('[data-cerrar-carrito]')) {
      cerrarCarrito();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  document.addEventListener('cart:updated', renderCarrito);
  renderCarrito();
}

/* ---------- favoritos ---------- */

function initFav() {
  const badge = document.getElementById('favBadge');
  const btn = document.getElementById('favBtn');
  const pintar = () => {
    const n = Fav.get().length;
    if (badge) { badge.textContent = n; badge.hidden = n === 0; }
    btn?.classList.toggle('is-on', n > 0);
  };
  document.addEventListener('fav:updated', pintar);
  btn?.addEventListener('click', () => {
    const ids = Fav.get();
    if (!ids.length && !soloFav) { showToast('Todavía no guardaste ningún favorito'); return; }
    soloFav = !soloFav;
    filtroRubro = 'todos';
    if (inputBuscar) inputBuscar.value = '';
    chipsRubro?.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.rubro === 'todos' && !soloFav;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    renderCatalogo(true);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    showToast(soloFav ? `Mostrando tus ${ids.length} ${ids.length === 1 ? 'favorito' : 'favoritos'}` : 'Volvimos al catálogo completo');
  });
  pintar();
}

/* ---------- ficha (modal) ---------- */

const modal = document.getElementById('modalProducto');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBody = document.getElementById('modalBody');
let ultimoFocoModal = null;
let modalEstado = { id: null, v: null, qty: 1 };

function pintarModal() {
  const p = getProducto(modalEstado.id);
  if (!p || !modalBody) return;
  const v = getVariante(p, modalEstado.v);
  const final = precioFinal(p, v?.id);
  const base = precioBase(p, v?.id);
  const rel = PRODUCTOS.filter(x => x.rubro === p.rubro && x.id !== p.id).slice(0, 3);
  const relOtros = rel.length ? rel : PRODUCTOS.filter(x => x.id !== p.id).slice(0, 3);
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;

  modalBody.innerHTML = `
    <div class="md-grid">
      <div class="md-media"><img src="${p.img}" alt="${esc(p.alt)}" width="1254" height="1254" decoding="async"></div>
      <div class="md-info">
        <p class="md-rubro">${esc(getRubro(p.rubro)?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="md-desc">${esc(p.desc)}</p>
        <div class="md-price">
          <span class="price-now">${formatearPrecio(final)}</span>
          ${p.descuento > 0 ? `<s class="price-old">${formatearPrecio(base)}</s>` : ''}
        </div>
        <p class="md-cuota">12 cuotas de ${formatearPrecio(cuotaDe(final))} · 6 cuotas de ${formatearPrecio(cuotaDe(final, 6))}</p>
        ${p.variantes.length ? `<div class="md-vars" role="group" aria-label="Elegí el modelo">
          ${p.variantes.map(x => `<button type="button" class="md-var${x.id === v.id ? ' is-on' : ''}" data-var="${x.id}" aria-pressed="${x.id === v.id}">${esc(x.nombre)}</button>`).join('')}
        </div>` : ''}
        <ul class="md-specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="md-actions">
          <div class="qty" data-qty>
            <button type="button" data-mstep="-1" aria-label="Quitar una unidad">−</button>
            <span data-val>${modalEstado.qty}</span>
            <button type="button" data-mstep="1" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="btn btn-primary" data-madd>Agregar al carrito</button>
          <button type="button" class="btn btn-ghost" data-mbuy>Comprar ahora</button>
        </div>
      </div>
    </div>
    <div class="md-rel">
      <h3>También te puede interesar</h3>
      <div class="md-rel-grid">
        ${relOtros.map(r => `
          <button type="button" class="md-rel-card" data-rel="${r.id}">
            <img src="${r.img}" alt="" aria-hidden="true" width="1254" height="1254" loading="lazy" decoding="async">
            <span class="md-rel-txt"><b>${esc(r.nombre)}</b><i>${r.variantes.length > 1 ? 'Desde ' : ''}${formatearPrecio(precioFinal(r, null))}</i></span>
          </button>`).join('')}
      </div>
    </div>`;
}

function abrirModal(id, origen) {
  const p = getProducto(id);
  if (!p || !modal) return;
  ultimoFocoModal = origen || document.activeElement;
  modalEstado = { id, v: vidDefault(p), qty: 1 };
  pintarModal();
  modal.classList.add('open');
  modalBackdrop?.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modalBackdrop?.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFocoModal?.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modalBackdrop?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) cerrarModal();
  });
  modal?.addEventListener('keydown', e => trapFocus(modal, e));

  modalBody?.addEventListener('click', e => {
    const varBtn = e.target.closest('[data-var]');
    if (varBtn) { modalEstado.v = varBtn.dataset.var; pintarModal(); return; }
    const step = e.target.closest('[data-mstep]');
    if (step) {
      modalEstado.qty = Math.max(1, Math.min(99, modalEstado.qty + parseInt(step.dataset.mstep, 10)));
      modalBody.querySelector('[data-val]').textContent = modalEstado.qty;
      return;
    }
    const rel = e.target.closest('[data-rel]');
    if (rel) { abrirModal(rel.dataset.rel, ultimoFocoModal); return; }
    const p = getProducto(modalEstado.id);
    if (!p) return;
    if (e.target.closest('[data-madd]')) {
      Cart.add(p, modalEstado.v, modalEstado.qty);
      showToast('¡Listo! Ya está en tu carrito');
      return;
    }
    if (e.target.closest('[data-mbuy]')) {
      Cart.add(p, modalEstado.v, modalEstado.qty);
      cerrarModal();
      abrirCarrito();
    }
  });
}

/* ---------- simulador ---------- */

function initSimulador() {
  const sel = document.getElementById('simProducto');
  const planes = document.getElementById('simPlanes');
  const outCuota = document.getElementById('simCuota');
  const outTotal = document.getElementById('simTotal');
  const outN = document.getElementById('simCuotas');
  const cta = document.getElementById('simWsp');
  if (!sel || !planes) return;

  let plan = PLAN_DEFAULT;

  sel.innerHTML = PRODUCTOS.flatMap(p => (
    p.variantes.length
      ? p.variantes.map(v => `<option value="${p.id}|${v.id}">${esc(p.nombre)} — ${esc(v.nombre)}</option>`)
      : [`<option value="${p.id}|">${esc(p.nombre)}</option>`]
  )).join('');

  planes.innerHTML = PLANES.map(n => `<button type="button" class="sim-plan${n === plan ? ' is-on' : ''}" data-plan="${n}" aria-pressed="${n === plan}">${n}</button>`).join('');

  function pintar() {
    const [pid, vid] = String(sel.value).split('|');
    const p = getProducto(pid) || PRODUCTOS[0];
    const v = getVariante(p, vid || null);
    const total = precioFinal(p, v?.id);
    const cuota = cuotaDe(total, plan);
    if (outCuota) outCuota.textContent = formatearPrecio(cuota);
    if (outTotal) outTotal.textContent = formatearPrecio(total);
    if (outN) outN.textContent = plan;
    if (cta) cta.href = wsp(`Hola Créditos Crecer, quiero consultar por ${p.nombre}${v ? ' de ' + v.nombre : ''} en ${plan} cuotas de ${formatearPrecio(cuota)} (total ${formatearPrecio(total)}).`);
  }

  sel.addEventListener('change', pintar);
  planes.addEventListener('click', e => {
    const btn = e.target.closest('[data-plan]');
    if (!btn) return;
    plan = parseInt(btn.dataset.plan, 10);
    planes.querySelectorAll('.sim-plan').forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    pintar();
    if (typeof gsap !== 'undefined' && !reduceMotion) {
      gsap.fromTo(outCuota, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .4, ease: 'power2.out' });
    }
  });

  pintar();
}

/* ---------- nav, footer, whatsapp ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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

  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  mq.addEventListener('change', sync);
  sync();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initFooter() {
  const ul = document.getElementById('footRubros');
  if (ul) {
    ul.innerHTML = RUBROS.map(r => `<li><a href="#catalogo" data-foot-rubro="${r.id}">${esc(r.nombre)}</a></li>`).join('');
    ul.addEventListener('click', e => {
      const a = e.target.closest('[data-foot-rubro]');
      if (!a) return;
      filtroRubro = a.dataset.footRubro;
      soloFav = false;
      chipsRubro?.querySelectorAll('.chip').forEach(c => {
        const on = c.dataset.rubro === filtroRubro;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      renderCatalogo(true);
    });
  }
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
}

function initSchema() {
  const productos = PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    image: p.img,
    description: p.desc,
    brand: { '@type': 'Brand', name: 'Créditos Crecer' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: String(precioFinal(p, null)),
      availability: 'https://schema.org/InStock',
    },
  }));
  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': productos });
  document.body.appendChild(tag);
}

/* ---------- reveals ---------- */

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

/* ---------- movimiento ---------- */

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-bg img', { scale: 1.09, duration: 1.5, ease: 'power2.out' }, 0)
    .from('.hero-copy .eyebrow', { opacity: 0, y: 14, duration: .7 }, .1)
    .from('.hero-title .line-in', { yPercent: 112, duration: 1, stagger: .09 }, .18)
    .from('.hero-prod', { opacity: 0, x: 90, duration: 1.2 }, .3)
    .from('.hero-lead', { opacity: 0, y: 22, duration: .8 }, .55)
    .from('.hero-cta .btn', { opacity: 0, y: 18, duration: .6, stagger: .09 }, .7)
    .from('.hero-facts li', { opacity: 0, y: 12, duration: .5, stagger: .07 }, .85)
    .from('.hero-ticket', { opacity: 0, scale: .82, rotate: -16, duration: .75, ease: 'back.out(1.6)' }, .95);
}

function initCapitulo() {
  const stage = document.getElementById('chapterStage');
  const visual = document.getElementById('chapterVisual');
  const chChips = document.getElementById('chChips');
  const chTotal = document.getElementById('chTotal');
  const chFinal = document.getElementById('chFinal');
  const chCut = document.getElementById('chCut');
  const steps = [...document.querySelectorAll('#chapterSteps li')];
  if (!stage || !chChips) return;

  const p = getProducto('heladera-french-door');
  const total = precioFinal(p, '550');
  const cuota = cuotaDe(total);
  chChips.innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<li class="ch-chip"><b>${String(i + 1).padStart(2, '0')}/12</b><span>${formatearPrecio(cuota)}</span></li>`).join('');
  const totalN = chTotal?.querySelector('.ch-total-n');
  const totalCap = chTotal?.querySelector('.ch-total-cap');
  const finalN = chFinal?.querySelector('.ch-final-n');
  if (totalN) totalN.textContent = formatearPrecio(total);
  if (totalCap) totalCap.textContent = 'Heladera French Door · 550 litros';
  if (finalN) finalN.textContent = formatearPrecio(cuota);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    steps.forEach(s => s.classList.add('is-on'));
    return;
  }

  const chips = [...chChips.children];
  let offs = chips.map(() => ({ x: 0, y: -60 }));

  function medir() {
    gsap.set(chips, { clearProps: 'transform,opacity' });
    const cr = visual.getBoundingClientRect();
    const cx = cr.left + cr.width * 0.18;
    const cy = cr.top + cr.height * 0.12;
    offs = chips.map(el => {
      const r = el.getBoundingClientRect();
      return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
    });
  }

  let pasoActual = -1;
  function setPaso(progress) {
    const i = progress >= .78 ? 3 : progress >= .52 ? 2 : progress >= .24 ? 1 : 0;
    if (i === pasoActual) return;
    pasoActual = i;
    steps.forEach((s, n) => s.classList.toggle('is-on', n === i));
  }

  function armar(triggerVars) {
    const tl = gsap.timeline({
      scrollTrigger: Object.assign({
        trigger: stage,
        scrub: .6,
        invalidateOnRefresh: true,
        onRefreshInit: medir,
        onUpdate: self => setPaso(self.progress),
      }, triggerVars),
    });
    tl.to(chCut, { opacity: .42, duration: .8 }, 0)
      .to(chTotal, { scale: .34, opacity: .32, transformOrigin: 'left top', duration: 1, ease: 'power2.inOut' }, .7)
      .from(chips, {
        x: i => offs[i].x, y: i => offs[i].y, rotate: i => (i - 5.5) * 5,
        scale: .26, opacity: 0, duration: 1.1, ease: 'power3.out',
        stagger: { each: .05, from: 'center' },
      }, .8)
      .to(chCut, { opacity: 1, scale: 1, yPercent: 0, duration: 1.5, ease: 'power2.out' }, 1.9)
      .to(chips, {
        x: i => offs[i].x * .9, y: i => offs[i].y * .9, scale: .22, opacity: 0,
        duration: .9, ease: 'power2.in', stagger: { each: .03, from: 'end' },
      }, 2.7)
      .to(chFinal, { opacity: 1, scale: 1, duration: .75, ease: 'back.out(1.5)' }, 3);
    return tl;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    armar({ start: 'top top', end: '+=280%', pin: true, anticipatePin: 1 });
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    armar({ start: 'top top', end: 'bottom bottom' });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initScrollFx() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;

  const foto = document.querySelector('.ent-foto--b img');
  if (foto) {
    gsap.to(foto, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.ent-grid', start: 'top bottom', end: 'bottom top', scrub: .5 },
    });
  }

  const showCut = document.querySelector('.show-cut');
  if (showCut) {
    gsap.fromTo(showCut, { y: 60, rotate: 6, opacity: 0 }, {
      y: 0, rotate: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.showroom', start: 'top 62%' },
    });
  }

  const seam = document.querySelector('.seam-ticket');
  if (seam) {
    gsap.from(seam, {
      scale: .5, opacity: 0, rotate: -22, duration: .8, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.trust', start: 'top 88%' },
    });
  }

  gsap.utils.toArray('.chapter-intro h2, .cierre-in h2').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 34, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

/* ---------- arranque ---------- */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initCatalogo();
initCarrito();
initFav();
initModal();
initSimulador();
initNav();
initWspFloat();
initFooter();
initSchema();
initReveals();
initHero();
initCapitulo();
initScrollFx();
