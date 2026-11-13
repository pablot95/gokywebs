const WHATSAPP_NUMBER = '5492914976233';
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
let PRODUCTOS = [];
let memoryCart = [];
let revealsListos = false;
const _normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        /^ebook-[a-z0-9-]+$/.test(item.id) &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        !seen.has(item.id) &&
        seen.add(item.id),
    )
    .slice(0, 40)
    .map((item) => ({ id: item.id, qty: 1 }));
}
function rememberProducts(items) {
  const needed = new Set(Cart.get().map((item) => item.id));
  const map = new Map(
    PRODUCTOS.filter((p) => needed.has(p.id)).map((p) => [p.id, p]),
  );
  items.slice(0, 100).forEach((p) => {
    if (p && typeof p.id === 'string' && Number.isFinite(p.precio))
      map.set(p.id, p);
  });
  PRODUCTOS = [...map.values()].slice(-100);
}
async function queryProducts(params, signal) {
  const response = await window.fetch(
    'api.php?' + new URLSearchParams(params),
    { signal, cache: 'no-store' },
  );
  if (!response.ok) throw new Error('No pudimos cargar la biblioteca.');
  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length > 100)
    throw new Error('Respuesta inesperada.');
  return data;
}
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) {
    nuevos.forEach((el) => el.classList.add('in'));
    return;
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      nuevos.forEach((el, i) => {
        const d = Math.min(i * 0.06, 0.6);
        el.style.transitionDelay = `${d}s`;
        el.classList.add('in');
        setTimeout(
          () => {
            el.style.transitionDelay = '';
          },
          (d + 1.2) * 1000,
        );
      }),
    ),
  );
}
function refreshScroll() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}
function cardHTML(p) {
  const available = p.stock > 0;
  return `<article class="prod-card" data-animate="subir" style="opacity:0;transform:translateY(32px)"><button class="prod-media" type="button" data-product="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="images/${esc(p.imagen)}" alt="Portada ilustrativa de ${esc(p.nombre)}" width="1024" height="1024"><span class="prod-badge">${available ? 'Ebook · Muestra' : 'En preparación'}</span><span class="prod-eye">${arrow}</span></button><div class="prod-info"><p class="prod-type">Facundo Lesur · Digital</p><h3 class="prod-title">${esc(p.nombre)}</h3><p class="prod-price">${available ? `${formatearPrecio(precioFinal(p))} <small>Precio de muestra</small>` : '<span class="prod-coming">Próximamente</span>'}</p><div class="prod-actions">${available ? `<button type="button" class="btn btn-primary prod-add" data-add="${esc(p.id)}">Agregar al carrito ${arrow}</button>` : `<button type="button" class="btn btn-outline prod-add" data-product="${esc(p.id)}">Conocer la propuesta ${arrow}</button>`}</div>${available ? `<button type="button" class="text-btn prod-buy" data-buy="${esc(p.id)}">Comprar ahora</button>` : ''}</div></article>`;
}
let catalogController;
async function loadCatalog() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  catalogController?.abort();
  catalogController = new window.AbortController();
  const q = document.getElementById('searchInput').value.trim();
  const stock = document.getElementById('stockFilter').value;
  grid.setAttribute('aria-busy', 'true');
  document.getElementById('loadError').hidden = true;
  document.getElementById('emptyState').hidden = true;
  document.getElementById('resultCount').textContent = 'Buscando lecturas…';
  try {
    const data = await queryProducts(
      { scope: 'home', limit: '2', q, stock },
      catalogController.signal,
    );
    rememberProducts(data.items);
    grid.innerHTML = data.items.map(cardHTML).join('');
    document.getElementById('emptyState').hidden = data.items.length > 0;
    document.getElementById('resultCount').textContent =
      `${data.total} ${data.total === 1 ? 'lectura' : 'lecturas'} · Biblioteca digital`;
    const url = new URL(location.href);
    q ? url.searchParams.set('q', q) : url.searchParams.delete('q');
    stock
      ? url.searchParams.set('stock', stock)
      : url.searchParams.delete('stock');
    window.history.replaceState(null, '', url);
    grid.setAttribute('aria-busy', 'false');
    if (!revealsListos) initReveals();
    else revelarNuevos(grid);
    refreshScroll();
  } catch (err) {
    if (err.name === 'AbortError') return;
    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'false');
    document.getElementById('loadError').hidden = false;
    document.getElementById('resultCount').textContent =
      'La biblioteca está momentáneamente sin conexión.';
    if (!revealsListos) initReveals();
  }
}
function initCatalog() {
  if (!document.getElementById('productGrid')) return;
  const input = document.getElementById('searchInput');
  const filter = document.getElementById('stockFilter');
  const params = new URLSearchParams(location.search);
  input.value = (params.get('q') || '').slice(0, 80);
  filter.value = params.get('stock') === '1' ? '1' : '';
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(loadCatalog, 280);
  });
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timer);
    loadCatalog();
  });
  filter.addEventListener('change', loadCatalog);
  const clear = () => {
    clearTimeout(timer);
    input.value = '';
    filter.value = '';
    loadCatalog();
  };
  document.getElementById('clearFilters').addEventListener('click', clear);
  document.querySelector('[data-clear]')?.addEventListener('click', clear);
  document
    .getElementById('retryProducts')
    .addEventListener('click', loadCatalog);
}
let activeOverlay = null;
let lastFocus = null;
function openDialog(id) {
  if (!activeOverlay) lastFocus = document.activeElement;
  if (activeOverlay) activeOverlay.hidden = true;
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.hidden = false;
  activeOverlay = overlay;
  document.body.classList.add('no-scroll');
  document.querySelector('main')?.setAttribute('inert', '');
  document.querySelector('.site-header')?.setAttribute('inert', '');
  document.querySelector('.site-footer')?.setAttribute('inert', '');
  overlay.querySelector('[data-close-dialog]')?.focus();
}
function closeDialog() {
  if (!activeOverlay) return;
  activeOverlay.hidden = true;
  activeOverlay = null;
  document.body.classList.remove('no-scroll');
  document
    .querySelectorAll('main[inert],.site-header[inert],.site-footer[inert]')
    .forEach((el) => el.removeAttribute('inert'));
  lastFocus?.focus();
}
function trapFocus(e, container) {
  if (e.key !== 'Tab') return;
  const focusable = [
    ...container.querySelectorAll(
      'a[href],button:not(:disabled),input:not(:disabled),select,[tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length && !el.closest('[hidden]'));
  const first = focusable[0],
    last = focusable.at(-1);
  if (!first) return;
  if (
    e.shiftKey &&
    (document.activeElement === first ||
      !container.contains(document.activeElement))
  ) {
    e.preventDefault();
    last.focus();
  } else if (
    !e.shiftKey &&
    (document.activeElement === last ||
      !container.contains(document.activeElement))
  ) {
    e.preventDefault();
    first.focus();
  }
}
function initDialogs() {
  document
    .querySelectorAll('[data-close-dialog]')
    .forEach((el) => el.addEventListener('click', closeDialog));
  document.querySelectorAll('.overlay').forEach((el) =>
    el.addEventListener('click', (e) => {
      if (e.target === el) closeDialog();
    }),
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDialog();
    const panel =
      activeOverlay?.querySelector('[role="dialog"]') ||
      document.querySelector('.main-nav.open');
    if (panel) trapFocus(e, panel);
  });
  document
    .querySelectorAll('[data-open-cart]')
    .forEach((button) => button.addEventListener('click', openCartDrawer));
}
function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  const items = Cart.get().filter((item) => getProducto(item.id)?.stock > 0);
  container.innerHTML = items.length
    ? items
        .map((item) => {
          const p = getProducto(item.id);
          return `<article class="cart-line"><img src="images/${esc(p.imagen)}" alt="${esc(p.nombre)}" width="80" height="80"><div><h3>${esc(p.nombre)}</h3><p>${formatearPrecio(precioFinal(p))} · 1 ebook digital</p><button type="button" data-remove="${esc(item.id)}">Quitar del carrito</button></div></article>`;
        })
        .join('')
    : `<div class="cart-empty"><p>Una lectura te espera.</p><span>Todavía no agregaste ningún ebook.</span><a class="btn btn-outline" href="#biblioteca" data-return-shop>Explorar la biblioteca ${arrow}</a></div>`;
  document.getElementById('cartSummary').hidden = !items.length;
  document.getElementById('cartTotal').textContent = formatearPrecio(
    Cart.total(),
  );
  container
    .querySelector('[data-return-shop]')
    ?.addEventListener('click', closeDialog);
}
function openCartDrawer() {
  renderCart();
  openDialog('cartOverlay');
}
function addProduct(id, open = false) {
  const p = getProducto(id);
  if (!p || p.stock <= 0) return;
  const exists = Cart.get().some((item) => item.id === id);
  Cart.add(p, 1);
  if (open) openCartDrawer();
  else
    showToast(
      exists
        ? 'Esta lectura ya está en tu carrito.'
        : 'Tu próxima lectura ya está en el carrito.',
    );
}
async function openProduct(id) {
  let p = getProducto(id);
  if (!p) {
    try {
      const data = await queryProducts({
        scope: 'lookup',
        ids: id,
        limit: '1',
      });
      rememberProducts(data.items);
      p = getProducto(id);
    } catch {
      showToast('No pudimos abrir esta lectura. Volvé a intentar.');
      return;
    }
  }
  if (!p) return;
  const available = p.stock > 0;
  const others = PRODUCTOS.filter(
    (item) => item.id !== p.id && item.categoria === p.categoria,
  ).slice(0, 2);
  document.getElementById('quickContent').innerHTML =
    `<div class="quick-grid"><div><img class="quick-image" id="quickImage" src="images/${esc(p.imagen)}" alt="${esc(p.nombre)}: imagen ilustrativa" width="1024" height="1024"><div class="quick-thumbs">${p.galeria.map((src, i) => `<button type="button" data-image="${esc(src)}" aria-label="Ver ${i ? 'página real de cierre del ebook' : 'portada ilustrativa'}"><img src="images/${esc(src)}" alt="" width="60" height="60"></button>`).join('')}</div><p class="demo-note">${p.galeria.length > 1 ? 'Portada ilustrativa. La segunda imagen es una página real enviada por Facundo.' : 'Portada ilustrativa del próximo ebook.'}</p></div><div class="quick-info"><p class="eyebrow">FACUNDO LESUR / EBOOK</p><h2>${esc(p.nombre)}</h2><p>${esc(p.descripcion)}</p><strong>${available ? formatearPrecio(precioFinal(p)) + ' · Precio de muestra' : 'En preparación'}</strong><div class="quick-actions">${available ? `<button class="btn btn-primary" type="button" data-add="${esc(p.id)}">Agregar al carrito</button><button class="btn btn-outline" type="button" data-buy="${esc(p.id)}">Comprar ahora</button>` : ''}<a class="text-link" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola Facundo, quisiera consultar por ' + (available ? 'tu ebook disponible.' : 'tu próximo ebook.'))}" target="_blank" rel="noopener noreferrer">Consultar a Facundo ${arrow}</a></div>${others.length ? `<div class="related"><p>También en la biblioteca</p>${others.map((item) => `<button type="button" data-product="${esc(item.id)}"><img src="images/${esc(item.imagen)}" alt="" width="60" height="60"><span>${esc(item.nombre)}</span>${arrow}</button>`).join('')}</div>` : ''}</div></div>`;
  let schema = document.getElementById('productSchema');
  if (!schema) {
    schema = document.createElement('script');
    schema.id = 'productSchema';
    schema.type = 'application/ld+json';
    document.head.appendChild(schema);
  }
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.descripcion,
    image: new URL('images/' + p.imagen, location.href).href,
    brand: { '@type': 'Brand', name: 'Facuu.coach' },
    disambiguatingDescription: 'Ficha demostrativa, título y precio ilustrativos. La compra online no está activada.',
  };
  if (available) productSchema.offers = {
    '@type': 'Offer',
    price: precioFinal(p),
    priceCurrency: 'ARS',
    availability: 'https://schema.org/InStock',
    description: 'Precio de muestra de la demo, consultar valor real a Facundo.',
  };
  schema.textContent = JSON.stringify(productSchema);
  openDialog('quickOverlay');
}
async function hydrateCart() {
  const items = Cart.get();
  if (!items.length) {
    updateCartBadge();
    return;
  }
  try {
    const data = await queryProducts({
      scope: 'lookup',
      limit: '40',
      ids: items.map((i) => i.id).join(','),
    });
    rememberProducts(data.items);
    Cart.save(
      items.filter((item) =>
        data.items.some((p) => p.id === item.id && p.stock > 0),
      ),
    );
  } catch {
    updateCartBadge();
  }
}
function initShopEvents() {
  document.addEventListener('click', (e) => {
    const product = e.target.closest('[data-product]');
    const add = e.target.closest('[data-add]');
    const buy = e.target.closest('[data-buy]');
    const remove = e.target.closest('[data-remove]');
    const image = e.target.closest('[data-image]');
    if (product) openProduct(product.dataset.product);
    if (add) addProduct(add.dataset.add);
    if (buy) addProduct(buy.dataset.buy, true);
    if (remove) {
      Cart.remove(remove.dataset.remove);
      renderCart();
    }
    if (image) {
      const img = document.getElementById('quickImage');
      img.src = 'images/' + image.dataset.image;
      img.alt = image.getAttribute('aria-label');
    }
  });
  document.addEventListener('cart:updated', renderCart);
  window.addEventListener('storage', (e) => {
    if (e.key === Cart.KEY) hydrateCart();
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    if (Cart.count())
      showToast(
        '¡Genial! El pago online se activa al pasar la web a producción.',
      );
  });
}
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(
    hero.querySelectorAll('.hero-eyebrow'),
    { y: 18, opacity: 0, duration: 0.9 },
    0.1,
  )
    .from(
      hero.querySelectorAll('h1'),
      { y: 32, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' },
      0.2,
    )
    .from(
      hero.querySelectorAll('.hero-lead'),
      { y: 26, opacity: 0, duration: 1 },
      0.35,
    )
    .from(
      hero.querySelectorAll('.hero-ctas .btn'),
      {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        clearProps: 'transform,opacity',
      },
      0.45,
    )
    .from(
      hero.querySelectorAll('.hero-badge'),
      {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        clearProps: 'transform,opacity',
      },
      0.6,
    );
}
function initAdmin() {
  const list = document.getElementById('adminProducts');
  if (!list) return;
  const input = document.getElementById('adminSearch');
  const more = document.getElementById('adminMore');
  const count = document.getElementById('adminCount');
  let cursor = null,
    controller,
    timer,
    shown = 0;
  const edits = new Map();
  async function load(next = false) {
    controller?.abort();
    controller = new window.AbortController();
    const query = { scope: 'admin', limit: '100', q: input.value.trim() };
    if (next && cursor) query.cursor = cursor;
    else shown = 0;
    list.setAttribute('aria-busy', 'true');
    more.disabled = true;
    count.textContent = 'Cargando biblioteca…';
    try {
      const data = await queryProducts(query, controller.signal);
      cursor = data.nextCursor;
      const first = shown + 1;
      shown += data.items.length;
      list.innerHTML =
        data.items
          .map(
            (p) =>
              `<article class="admin-product"><img src="images/${esc(p.imagen)}" alt="${esc(p.nombre)}" width="70" height="70"><div><h2>${esc(p.nombre)}</h2><p>${p.stock > 0 ? 'Disponible · precio ilustrativo' : 'En preparación'}</p></div><label>Precio de prueba<input type="number" min="0" max="9999999" step="1" data-admin-price="${esc(p.id)}" value="${edits.get(p.id) ?? p.precio}" aria-label="Precio de prueba de ${esc(p.nombre)}"></label><span class="admin-status" id="status-${esc(p.id)}">${edits.has(p.id) ? 'Cambio de prueba' : 'Sin cambios'}</span></article>`,
          )
          .join('') ||
        '<p>No hay ebooks que coincidan. Probá otra palabra.</p>';
      count.textContent = data.items.length
        ? `Mostrando ${first}–${shown} de ${data.total} · Esta página: ${data.items.length} productos`
        : 'Sin resultados';
      more.hidden = !cursor;
      more.disabled = false;
      list.setAttribute('aria-busy', 'false');
    } catch (err) {
      if (err.name === 'AbortError') return;
      count.textContent =
        'No pudimos cargar la biblioteca. Usá Buscar para volver a intentar.';
      list.setAttribute('aria-busy', 'false');
      more.disabled = false;
    }
  }
  document.getElementById('adminSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timer);
    load();
  });
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => load(), 300);
  });
  more.addEventListener('click', () => load(true));
  document.getElementById('adminReset').addEventListener('click', () => {
    input.value = '';
    load();
  });
  list.addEventListener('input', (e) => {
    if (!e.target.matches('[data-admin-price]')) return;
    const el = e.target,
      value = Number(el.value),
      status = document.getElementById('status-' + el.dataset.adminPrice);
    if (!el.value || !Number.isInteger(value) || value < 0 || value > 9999999) {
      el.setAttribute('aria-invalid', 'true');
      status.textContent = 'Ingresá un precio válido';
      return;
    }
    el.removeAttribute('aria-invalid');
    edits.set(el.dataset.adminPrice, value);
    if (edits.size > 100) edits.delete(edits.keys().next().value);
    status.textContent = 'Cambio de prueba';
  });
  load();
}
async function init() {
  if (document.body.dataset.pagina === 'admin') {
    initAdmin();
    return;
  }
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')
    gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollTrigger !== 'undefined')
    window.addEventListener('load', () => ScrollTrigger.refresh());
  initNav();
  initDialogs();
  initShopEvents();
  initFloats();
  initModelBarScroll();
  initCatalog();
  initHeroMotion();
  const menu = document.getElementById('mainNav');
  const menuMq = window.matchMedia('(max-width:768px)');
  const syncMenuRole = () => {
    if (menuMq.matches) {
      menu.setAttribute('role', 'dialog');
      menu.setAttribute('aria-modal', 'true');
    } else {
      menu.removeAttribute('role');
      menu.removeAttribute('aria-modal');
      document.body.classList.remove('no-scroll');
      menu.classList.remove('open');
      document.querySelector('.nav-backdrop')?.classList.remove('open');
      document
        .getElementById('menuToggle')
        .setAttribute('aria-expanded', 'false');
    }
  };
  menuMq.addEventListener('change', syncMenuRole);
  syncMenuRole();
  document
    .querySelectorAll('details')
    .forEach((el) => el.addEventListener('toggle', refreshScroll));
  await loadCatalog();
  await hydrateCart();
  if (typeof gsap === 'undefined')
    document
      .querySelectorAll('[data-animate]')
      .forEach((el) => el.classList.add('in'));
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug) {
    try {
      const data = await queryProducts({ scope: 'lookup', slug, limit: '1' });
      rememberProducts(data.items);
      if (data.items[0]) openProduct(data.items[0].id);
    } catch {
      void 0;
    }
  }
}

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (
    k === 'f12' ||
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
    (e.ctrlKey && k === 'u')
  ) {
    e.preventDefault();
  }
});

const _BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const formatearPrecio = (n) => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = (p) =>
  p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = (id) => PRODUCTOS.find((p) => p.id === id);

const Cart = {
  KEY: 'facuucoach_cart',
  get() {
    try {
      return cleanCart(JSON.parse(localStorage.getItem(this.KEY)));
    } catch {
      return cleanCart(memoryCart);
    }
  },
  save(items) {
    memoryCart = cleanCart(items);
    try {
      localStorage.setItem(this.KEY, JSON.stringify(memoryCart));
    } catch {
      void 0;
    }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find((i) => i.id === producto.id);
    if (existing)
      existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else
      items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id) {
    this.save(this.get().filter((i) => i.id !== id));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  },
  syncStock(productos) {
    const items = this.get();
    let changed = false;
    const filtered = items.filter((i) => {
      const p = productos.find((x) => x.id === i.id);
      if (!p || p.stock <= 0) {
        changed = true;
        return false;
      }
      if (i.qty > p.stock) {
        i.qty = p.stock;
        changed = true;
      }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open');
    bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    bd.classList.add('open');
    nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () =>
    nav.classList.contains('open') ? close() : open(),
  );
  closeBtn?.addEventListener('click', () => {
    close();
    toggle.focus();
  });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(
      () => {
        el.style.transitionDelay = '';
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -7% 0px' },
  );
  items.forEach((el) => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600 || wsp?.classList.contains('visible');
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach((b) => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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
    showTimer = setTimeout(
      () => bar.classList.remove('gw-modelos--scrolling'),
      120,
    );
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

init();
