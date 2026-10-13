(() => {
  'use strict';
  const MODEL2 = document.body.dataset.modelo === '2';
  const HOME = MODEL2 ? 'modelo-2.html' : 'index.html';
  const CATALOG = MODEL2 ? 'catalogo-2.html' : 'catalogo.html';
  const CATEGORIES = [
    { id: 'pizzas', name: 'Pizzas', image: '03_LO_DE_BASIM_Pizzas_1x1.png' },
    { id: 'pizzetas', name: 'Pizzetas', image: '01_LO_DE_BASIM_Hero_9x16.png' },
    { id: 'empanadas', name: 'Empanadas', image: '04_LO_DE_BASIM_Empanadas_1x1.png' },
    { id: 'pernil', name: 'Pernil', image: '05_LO_DE_BASIM_Pernil_1x1.png' },
    { id: 'matambres', name: 'Matambres', image: '06_LO_DE_BASIM_Matambre_Postres_1x1.png' },
    { id: 'postres', name: 'Postres', image: '06_LO_DE_BASIM_Matambre_Postres_1x1.png' }
  ];
  const ALL_CATEGORIES = CATEGORIES;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const img = name => `images/${encodeURIComponent(name)}`;
  const linkToCategory = id => `${CATALOG}?cat=${encodeURIComponent(id)}`;
  const storeKey = 'lodebasim_cart';
  const cart = {
    get() { try { const items = JSON.parse(localStorage.getItem(storeKey)); return Array.isArray(items) ? items : []; } catch { return []; } },
    save(items) { localStorage.setItem(storeKey, JSON.stringify(items)); updateCart(); },
    add(p) { const items = this.get(); const current = items.find(item => item.id === p.id); if (current) current.qty = Math.min(99, current.qty + 1); else items.push({ id: p.id, name: p.name, image: p.image, qty: 1 }); this.save(items); toast(`${p.name} se sumó al pedido`); },
    count() { return this.get().reduce((total, item) => total + item.qty, 0); }
  };
  const knownProducts = new Map();
  const api = async (params = {}) => {
    const url = new URL('products.php', location.href);
    Object.entries(params).forEach(([key, value]) => { if (value !== null && value !== undefined && value !== '') url.searchParams.set(key, value); });
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('No pudimos cargar el catálogo.');
    const data = await response.json();
    if (!Array.isArray(data.products) || data.products.length > 100) throw new Error('Respuesta de catálogo inválida.');
    data.products.forEach(p => knownProducts.set(p.id, p));
    return data;
  };
  const renderCard = p => `<article class="product-card"><button class="product-image" type="button" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.name)}"><img src="${img(p.image)}" alt="${esc(p.name)} de LO DE BASIM" width="700" height="700"><span class="product-tag">${esc(categoryName(p.category))}</span></button><div class="product-info"><p class="eyebrow">Consultar precio</p><h3>${esc(p.name)}</h3><div class="prod-actions"><button class="prod-more" type="button" data-quick="${esc(p.id)}">Ver detalle</button><button class="prod-add" type="button" data-add="${esc(p.id)}">Sumar al pedido +</button></div></div></article>`;
  const categoryName = id => ALL_CATEGORIES.find(c => c.id === id)?.name || id;
  const toast = message => { let wrap = document.querySelector('.toast-wrap'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.append(wrap); } const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; wrap.append(el); setTimeout(() => el.remove(), 2900); };

  if (MODEL2) {
    document.querySelectorAll('a[href]:not(.gw-modelos__btn)').forEach(a => {
      const href = a.getAttribute('href');
      if (href === 'index.html') a.setAttribute('href', HOME);
      else if (href.startsWith('index.html#')) a.setAttribute('href', HOME + href.slice(10));
      else if (href === 'catalogo.html') a.setAttribute('href', CATALOG);
    });
  }
  document.querySelectorAll('[data-category-menu]').forEach(menu => {
    const activeCategory = document.body.dataset.pagina === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    menu.innerHTML = ALL_CATEGORIES.map(c => `<a href="${linkToCategory(c.id)}" ${activeCategory === c.id ? 'aria-current="page"' : ''}>${esc(c.name)}</a>`).join('') + `<a href="${CATALOG}">Ver todo el catálogo ↗</a>`;
  });
  const cards = document.querySelector('[data-category-cards]');
  if (cards) cards.innerHTML = CATEGORIES.map(c => `<a class="category-card" href="${linkToCategory(c.id)}"><img src="${img(c.image)}" alt="" width="500" height="500"><strong>${esc(c.name)}</strong><span aria-hidden="true">↗</span></a>`).join('');
  document.querySelectorAll('.nav-cats').forEach(details => {
    details.addEventListener('keydown', e => { if (e.key === 'Escape') { details.open = false; details.querySelector('summary')?.focus(); } });
    details.addEventListener('mouseleave', () => { if (matchMedia('(min-width:761px)').matches) setTimeout(() => { if (!details.matches(':hover') && !details.contains(document.activeElement)) details.open = false; }, 120); });
    details.addEventListener('mouseenter', () => { if (matchMedia('(min-width:761px)').matches) details.open = true; });
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-cats')) document.querySelectorAll('.nav-cats').forEach(d => d.open = false); });
  const nav = document.getElementById('main-nav'); const menuButton = document.querySelector('.menu-toggle');
  menuButton?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); }));

  async function initHome() {
    const featured = document.querySelector('[data-featured]'); const preview = document.querySelector('[data-preview]');
    if (!featured || !preview) return;
    try {
      const data = await api({ limit: 14 });
      const picked = data.products.filter(p => p.featured).slice(0, 6);
      const pickedIds = new Set(picked.map(p => p.id));
      featured.innerHTML = picked.map(renderCard).join('');
      preview.innerHTML = data.products.filter(p => !pickedIds.has(p.id)).slice(0, 8).map(renderCard).join('');
    } catch (error) {
      featured.textContent = 'No pudimos cargar los productos. Probá de nuevo más tarde.';
      preview.textContent = 'Podés consultarnos por WhatsApp.';
    }
  }
  let catalogRequest = 0;
  async function initCatalog() {
    const grid = document.querySelector('[data-catalog-grid]'); if (!grid) return;
    const form = document.querySelector('[data-search-form]'); const input = form.querySelector('input');
    const more = document.querySelector('[data-load-more]'); const empty = document.querySelector('[data-empty]');
    const heading = document.querySelector('[data-catalog-heading]'); const count = document.querySelector('[data-result-count]');
    const filters = document.querySelector('[data-filters]');
    const params = new URLSearchParams(location.search);
    let cat = ALL_CATEGORIES.some(c => c.id === params.get('cat')) ? params.get('cat') : '';
    let q = params.get('q') || '';
    let nextCursor = null;
    input.value = q;
    const syncUrl = () => { const url = new URL(location.href); if (cat) url.searchParams.set('cat', cat); else url.searchParams.delete('cat'); if (q) url.searchParams.set('q', q); else url.searchParams.delete('q'); history.replaceState(null, '', url); };
    const renderFilters = () => { filters.innerHTML = `<a href="${CATALOG}" data-filter="" ${!cat ? 'aria-current="page"' : ''}>Todo <span>↗</span></a>` + ALL_CATEGORIES.map(c => `<a href="${linkToCategory(c.id)}" data-filter="${c.id}" ${cat === c.id ? 'aria-current="page"' : ''}>${esc(c.name)} <span>↗</span></a>`).join(''); heading.textContent = cat ? categoryName(cat) : 'Todo el catálogo'; document.title = (cat ? categoryName(cat) + ' | ' : 'Catálogo | ') + 'LO DE BASIM'; };
    async function load(reset = false) {
      const request = ++catalogRequest;
      if (reset) { grid.innerHTML = ''; nextCursor = null; more.hidden = true; empty.hidden = true; count.textContent = 'Cargando productos…'; }
      more.disabled = true;
      try {
        const data = await api({ cat, q, limit: 16, cursor: reset ? null : nextCursor });
        if (request !== catalogRequest) return;
        grid.insertAdjacentHTML('beforeend', data.products.map(renderCard).join(''));
        nextCursor = data.nextCursor;
        more.hidden = !nextCursor; more.disabled = false;
        empty.hidden = data.count !== 0;
        count.textContent = `${data.count} ${data.count === 1 ? 'producto' : 'productos'}`;
      } catch (error) { if (request === catalogRequest) { count.textContent = error.message; more.hidden = true; } }
    }
    filters.addEventListener('click', e => { const link = e.target.closest('[data-filter]'); if (!link) return; e.preventDefault(); cat = link.dataset.filter; renderFilters(); syncUrl(); load(true); });
    form.addEventListener('submit', e => { e.preventDefault(); q = input.value.trim(); syncUrl(); load(true); });
    let debounce; input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { q = input.value.trim(); syncUrl(); load(true); }, 280); });
    more.addEventListener('click', () => { if (nextCursor) load(false); });
    document.querySelector('[data-clear-filters]')?.addEventListener('click', () => { cat = ''; q = ''; input.value = ''; renderFilters(); syncUrl(); load(true); });
    renderFilters(); syncUrl(); await load(true);
    const productId = params.get('producto');
    if (productId) { let p = knownProducts.get(productId); if (!p) { try { p = (await api({ id: productId, limit: 1 })).products[0]; } catch { p = null; } } if (p) openQuick(p); }
  }
  async function initAdmin() {
    const list = document.querySelector('[data-admin-list]'); if (!list) return;
    const form = document.querySelector('[data-admin-search]');
    const input = form.querySelector('input');
    const count = document.querySelector('[data-admin-count]');
    const more = document.querySelector('[data-admin-more]');
    let cursor = null; let query = ''; let requestId = 0;
    async function load(reset = false) {
      const current = ++requestId;
      if (reset) { cursor = null; list.innerHTML = ''; count.textContent = 'Buscando productos…'; more.hidden = true; }
      more.disabled = true;
      try {
        const page = await api({ limit: 100, q: query, cursor });
        if (current !== requestId) return;
        list.insertAdjacentHTML('beforeend', page.products.map(p => `<article class="admin-row"><img src="${img(p.image)}" alt="" width="62" height="62"><div><strong>${esc(p.name)}</strong><span>${esc(categoryName(p.category))}</span></div><span class="admin-id">${esc(p.id)}</span></article>`).join(''));
        cursor = page.nextCursor;
        count.textContent = `${page.count} ${page.count === 1 ? 'producto' : 'productos'} · ${list.children.length} en pantalla`;
        more.hidden = !cursor; more.disabled = false;
      } catch (error) { if (current === requestId) { count.textContent = error.message; more.hidden = true; } }
    }
    form.addEventListener('submit', e => { e.preventDefault(); query = input.value.trim(); load(true); });
    let debounce; input.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { query = input.value.trim(); load(true); }, 300); });
    more.addEventListener('click', () => { if (cursor) load(false); });
    await load(true);
  }

  const overlay = document.querySelector('[data-overlay]'); const drawer = document.querySelector('[data-cart-drawer]'); const quick = document.querySelector('[data-quick-modal]');
  let previousFocus = null;
  const closeOverlays = () => { overlay.hidden = true; drawer.hidden = true; quick.hidden = true; document.body.classList.remove('no-scroll'); previousFocus?.focus?.(); };
  const openOverlay = element => { previousFocus = document.activeElement; overlay.hidden = false; element.hidden = false; document.body.classList.add('no-scroll'); element.querySelector('button')?.focus(); };
  const updateCart = () => {
    const items = cart.get(); const count = cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; el.hidden = count === 0 && !el.closest('.drawer-head'); });
    const lines = document.querySelector('[data-cart-lines]');
    if (lines) lines.innerHTML = items.length ? items.map(item => `<div class="cart-line"><img src="${img(item.image)}" alt="" width="65" height="65"><div><h3>${esc(item.name)}</h3><button type="button" data-remove="${esc(item.id)}">Quitar</button></div><div class="qty-control"><button type="button" data-qty="${esc(item.id)}" data-delta="-1" aria-label="Restar uno">−</button><strong>${item.qty}</strong><button type="button" data-qty="${esc(item.id)}" data-delta="1" aria-label="Sumar uno">+</button></div></div>`).join('') : `<div class="cart-empty"><h3>Tu pedido espera.</h3><p>Explorá el catálogo y sumá lo que te guste.</p><a class="btn btn-dark" href="${CATALOG}">Ver catálogo ↗</a></div>`;
    const order = document.querySelector('[data-send-order]');
    if (order) { const message = items.length ? `Hola Laura, quiero consultar por este pedido de LO DE BASIM:\n${items.map(item => `• ${item.qty} × ${item.name}`).join('\n')}\n¿Me confirmás precio y disponibilidad?` : 'Hola Laura, quiero consultar por los productos de LO DE BASIM'; order.href = `https://wa.me/5491165426864?text=${encodeURIComponent(message)}`; }
    syncFloats();
  };
  const openQuick = p => { quick.innerHTML = `<button class="quick-close" type="button" data-close-overlay aria-label="Cerrar detalle">×</button><img src="${img(p.image)}" alt="${esc(p.name)}" width="600" height="600"><div class="quick-body"><p class="eyebrow">${esc(categoryName(p.category))}</p><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><p><strong>Precio y disponibilidad: a consultar.</strong></p><button class="btn btn-red" type="button" data-add="${esc(p.id)}">Sumar al pedido +</button></div>`; openOverlay(quick); };
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'); if (add) { const p = knownProducts.get(add.dataset.add); if (p) cart.add(p); return; }
    const detail = e.target.closest('[data-quick]'); if (detail) { const p = knownProducts.get(detail.dataset.quick); if (p) openQuick(p); return; }
    if (e.target.closest('[data-open-cart]')) { updateCart(); openOverlay(drawer); return; }
    if (e.target.closest('[data-close-overlay]')) { closeOverlays(); return; }
    const remove = e.target.closest('[data-remove]'); if (remove) { cart.save(cart.get().filter(item => item.id !== remove.dataset.remove)); return; }
    const qty = e.target.closest('[data-qty]'); if (qty) { const items = cart.get(); const item = items.find(item => item.id === qty.dataset.qty); if (item) { item.qty = Math.max(1, Math.min(99, item.qty + Number(qty.dataset.delta))); cart.save(items); } }
  });
  overlay?.addEventListener('click', closeOverlays);
  document.addEventListener('keydown', e => {
    if (!overlay) return;
    if (e.key === 'Escape' && !overlay.hidden) closeOverlays();
    if (e.key === 'Tab' && !overlay.hidden) { const active = !quick.hidden ? quick : drawer; const focusable = [...active.querySelectorAll('a[href],button:not([disabled]),input')].filter(el => !el.hidden); if (!focusable.length) return; const first = focusable[0], last = focusable.at(-1); if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  const floatButtons = document.querySelectorAll('.float-btn');
  function syncFloats() { const show = scrollY > 600; floatButtons.forEach(el => el.classList.toggle('visible', show || (el.classList.contains('cart-float') && cart.count() > 0))); }
  addEventListener('scroll', syncFloats, { passive: true });
  const modelBar = document.querySelector('.gw-modelos'); let modelTimer;
  addEventListener('scroll', () => { modelBar?.classList.add('scrolling'); clearTimeout(modelTimer); modelTimer = setTimeout(() => modelBar?.classList.remove('scrolling'), 120); }, { passive: true });
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); } }), { threshold: 0, rootMargin: '0px 0px 40px 0px' });
  document.querySelectorAll('[data-animate]').forEach(el => reveal.observe(el));
  updateCart(); initHome(); initCatalog(); initAdmin();
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => { const k = e.key.toLowerCase(); if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault(); });
})();
