(() => {
  'use strict';
  const page = document.body.dataset.pagina;
  const model = document.body.dataset.model || '1';
  const homeUrl = model === '2' ? 'modelo-2.html' : './';
  const catalogUrl = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const WA = '5491157225061';
  const categories = { paragolpes: 'Paragolpes', electronica: 'Electrónica', accesorios: 'Accesorios' };
  const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(n) || 0);
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const imageUrl = name => `images/${encodeURIComponent(name)}`;
  let toastTimer;
  function toast(message) {
    let box = document.querySelector('.toast');
    if (!box) { box = document.createElement('div'); box.className = 'toast'; box.setAttribute('role', 'status'); document.body.append(box); }
    box.textContent = message;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, 3400);
  }
  async function getPage(view, limit, cursor, cat = '', sort = 'destacados') {
    const params = new URLSearchParams({ view, limit: String(Math.min(100, limit)), cursor: cursor || '0' });
    if (cat) params.set('cat', cat);
    if (sort !== 'destacados') params.set('orden', sort);
    const response = await fetch(`api/productos.php?${params}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('No pudimos cargar los productos.');
    return response.json();
  }
  async function getProduct(id) {
    const response = await fetch(`api/productos.php?id=${encodeURIComponent(id)}`);
    if (!response.ok) throw new Error('Producto no disponible.');
    return (await response.json()).item;
  }
  const cache = new Map();
  function remember(p) {
    if (cache.has(p.id)) cache.delete(p.id);
    cache.set(p.id, p);
    if (cache.size > 32) cache.delete(cache.keys().next().value);
  }
  function label(category) { return categories[category] || category; }
  function card(p) {
    remember(p);
    return `<article class="product-card" data-product="${safe(p.id)}"><button class="product-image" type="button" data-detail="${safe(p.id)}" aria-label="Ver detalles de ${safe(p.name)}"><img src="${imageUrl(p.image)}" alt="${safe(p.name)}, imagen ilustrativa" loading="lazy" style="object-position:${safe(p.position || 'center')}"><span class="product-tag">Producto de muestra</span></button><div class="product-info"><span class="product-category">${safe(label(p.category))}</span><h3 class="product-name">${safe(p.name)}</h3><strong class="product-price">${money(p.price)}</strong><span class="product-sample">Precio ilustrativo</span><div class="product-actions"><button class="product-detail-btn" type="button" data-detail="${safe(p.id)}">Ver detalle</button><button class="product-add-btn" type="button" data-add="${safe(p.id)}" aria-label="Agregar ${safe(p.name)} al carrito">+</button></div></div></article>`;
  }
  function wireSharedLinks() {
    document.querySelectorAll('[data-home-link]').forEach(a => a.href = homeUrl);
    document.querySelectorAll('[data-catalog-link]').forEach(a => a.href = catalogUrl);
    document.querySelectorAll('[data-location-link]').forEach(a => a.href = `${homeUrl}#ubicacion`);
    document.querySelectorAll('[data-category-link]').forEach(a => a.href = `${catalogUrl}?cat=${encodeURIComponent(a.dataset.categoryLink)}`);
    const menu = document.querySelector('[data-category-menu]');
    if (menu) menu.innerHTML = Object.entries(categories).map(([key, value]) => `<a href="${catalogUrl}?cat=${key}">${value}</a>`).join('');
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === (page === 'home' ? 'home' : 'catalog')));
    document.querySelectorAll('[data-model-link]').forEach(a => {
      const other = a.dataset.modelLink;
      const target = page === 'catalogo' ? (other === '2' ? 'catalogo-2.html' : 'catalogo.html') : (other === '2' ? 'modelo-2.html' : './');
      a.href = target + (page === 'catalogo' ? location.search : '');
      a.classList.toggle('active', other === model);
      if (other === model) a.setAttribute('aria-current', 'page');
    });
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    toggle?.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', e => {
      const menu = document.querySelector('.category-menu');
      if (menu?.open && !menu.contains(e.target)) menu.open = false;
      if (nav?.classList.contains('open') && !nav.contains(e.target) && !toggle?.contains(e.target)) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { const menu = document.querySelector('.category-menu'); if (menu) menu.open = false; } });
    const switcher = document.querySelector('.model-switch');
    function updateFloats() {
      document.querySelector('.float-cart')?.toggleAttribute('hidden', window.scrollY < 550 && cartCount() === 0);
      switcher?.classList.toggle('is-hidden', window.scrollY > 550 || !!document.querySelector('dialog[open]'));
    }
    window.addEventListener('scroll', updateFloats, { passive: true });
    window.addEventListener('cartchange', updateFloats);
    updateFloats();
  }
  function readCart() {
    try {
      const raw = JSON.parse(localStorage.getItem('stockcentro-cart-v1') || '{}');
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
      return Object.fromEntries(Object.entries(raw).filter(([id, qty]) => /^[a-z0-9-]{1,64}$/.test(id) && Number.isInteger(qty) && qty > 0 && qty <= 99));
    } catch { return {}; }
  }
  let cart = readCart();
  function cartCount() { return Object.values(cart).reduce((sum, qty) => sum + qty, 0); }
  function syncCart() {
    localStorage.setItem('stockcentro-cart-v1', JSON.stringify(cart));
    document.querySelectorAll('[data-cart-count]').forEach(x => x.textContent = cartCount());
    window.dispatchEvent(new Event('cartchange'));
  }
  function addCart(id, qty = 1) { cart[id] = Math.min(99, (cart[id] || 0) + qty); syncCart(); toast('Producto agregado al carrito'); }
  function setCartQty(id, qty) { if (qty < 1) delete cart[id]; else cart[id] = Math.min(99, qty); syncCart(); renderCart(); }
  const productDialog = document.querySelector('#product-dialog');
  const cartDialog = document.querySelector('#cart-dialog');
  let currentProduct = null;
  let detailQty = 1;
  let priorFocus = null;
  async function openProduct(id, push = true) {
    if (!productDialog) return;
    priorFocus = document.activeElement;
    let p = cache.get(id);
    try { if (!p) p = await getProduct(id); } catch { toast('Este producto ya no está disponible.'); return; }
    remember(p); currentProduct = p; detailQty = 1;
    const advice = p.category === 'paragolpes' ? 'Antes de elegir, confirmá marca, modelo y año de tu vehículo.' : 'Consultá instalación, conexiones y compatibilidad antes de elegir.';
    productDialog.querySelector('[data-product-content]').innerHTML = `<div class="product-detail"><div class="detail-photo"><img src="${imageUrl(p.image)}" alt="${safe(p.name)}, imagen ilustrativa" style="object-position:${safe(p.position || 'center')}"></div><div class="detail-copy"><span class="eyebrow">${safe(label(p.category))} / Producto de muestra</span><h2>${safe(p.name)}</h2><p>${safe(p.description)}</p><div class="detail-price">${money(p.price)}</div><p class="detail-note">Precio ilustrativo · Consultá disponibilidad</p><div class="detail-advice"><strong>Para elegir bien</strong>${advice}</div><div class="detail-controls"><div class="qty-control" aria-label="Cantidad"><button type="button" data-detail-qty="-1" aria-label="Restar cantidad">−</button><span data-detail-qty-value>1</span><button type="button" data-detail-qty="1" aria-label="Sumar cantidad">+</button></div><div class="detail-buttons"><button type="button" class="button button-primary" data-detail-add>Agregar al carrito +</button><button type="button" class="button button-outline" data-detail-buy>Ver carrito →</button></div><a class="detail-wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero consultar por ' + p.name + ' de Stock centro')}" target="_blank" rel="noopener">Consultar este producto por WhatsApp ↗</a></div></div></div>`;
    if (!productDialog.open) productDialog.showModal();
    if (push) { const url = new URL(location.href); url.searchParams.set('producto', id); history.pushState({}, '', url); }
  }
  function closeProduct() { if (!productDialog?.open) return; productDialog.close(); const url = new URL(location.href); url.searchParams.delete('producto'); history.replaceState({}, '', url); priorFocus?.focus?.(); }
  async function renderCart() {
    if (!cartDialog) return;
    const area = cartDialog.querySelector('[data-cart-items]');
    const ids = Object.keys(cart);
    if (!ids.length) { area.innerHTML = '<div class="cart-empty"><h3>Tu carrito está vacío.</h3><p>Explorá el catálogo y agregá productos para armar tu consulta.</p></div>'; cartDialog.querySelector('[data-cart-total]').textContent = money(0); cartDialog.querySelector('[data-cart-whatsapp]').href = `https://wa.me/${WA}`; return; }
    const results = await Promise.all(ids.map(async id => { try { return cache.get(id) || await getProduct(id); } catch { return null; } }));
    const valid = results.filter(Boolean);
    let total = 0;
    area.innerHTML = valid.map(p => { remember(p); total += p.price * cart[p.id]; return `<div class="cart-row"><img src="${imageUrl(p.image)}" alt=""><div><h3>${safe(p.name)}</h3><p>${money(p.price * cart[p.id])}</p><div class="cart-row-actions"><div class="qty-control"><button type="button" data-cart-qty="-1" data-id="${safe(p.id)}" aria-label="Restar ${safe(p.name)}">−</button><span>${cart[p.id]}</span><button type="button" data-cart-qty="1" data-id="${safe(p.id)}" aria-label="Sumar ${safe(p.name)}">+</button></div><button type="button" data-cart-remove="${safe(p.id)}">Quitar</button></div></div></div>`; }).join('');
    cartDialog.querySelector('[data-cart-total]').textContent = money(total);
    const message = `Hola, quiero consultar por estos productos de Stock centro:\n${valid.map(p => `• ${cart[p.id]} × ${p.name}`).join('\n')}\nPrecios de muestra; quisiera confirmar disponibilidad y valores.`;
    cartDialog.querySelector('[data-cart-whatsapp]').href = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
  }
  async function openCart() { if (!cartDialog) return; priorFocus = document.activeElement; await renderCart(); cartDialog.showModal(); }
  function closeCart() { cartDialog?.close(); priorFocus?.focus?.(); }
  function wireShopping() {
    syncCart();
    document.addEventListener('click', async e => {
      const detail = e.target.closest('[data-detail]');
      if (detail) { await openProduct(detail.dataset.detail); return; }
      const add = e.target.closest('[data-add]');
      if (add) { addCart(add.dataset.add); return; }
      if (e.target.closest('[data-cart-open]')) { openCart(); return; }
      if (e.target.closest('[data-close-product]')) { closeProduct(); return; }
      if (e.target.closest('[data-close-cart]')) { closeCart(); return; }
      const qty = e.target.closest('[data-detail-qty]');
      if (qty) { detailQty = Math.max(1, Math.min(99, detailQty + Number(qty.dataset.detailQty))); productDialog.querySelector('[data-detail-qty-value]').textContent = detailQty; return; }
      if (e.target.closest('[data-detail-add]') && currentProduct) { addCart(currentProduct.id, detailQty); return; }
      if (e.target.closest('[data-detail-buy]') && currentProduct) { closeProduct(); openCart(); return; }
      const cartQty = e.target.closest('[data-cart-qty]');
      if (cartQty) { setCartQty(cartQty.dataset.id, (cart[cartQty.dataset.id] || 0) + Number(cartQty.dataset.cartQty)); return; }
      const remove = e.target.closest('[data-cart-remove]');
      if (remove) { setCartQty(remove.dataset.cartRemove, 0); return; }
      if (e.target.closest('[data-checkout]')) toast('Esta es una demo. El pago online se activa con la tienda definitiva.');
    });
    productDialog?.addEventListener('click', e => { if (e.target === productDialog) closeProduct(); });
    cartDialog?.addEventListener('click', e => { if (e.target === cartDialog) closeCart(); });
    productDialog?.addEventListener('close', () => { const url = new URL(location.href); if (url.searchParams.has('producto')) { url.searchParams.delete('producto'); history.replaceState({}, '', url); } });
    window.addEventListener('popstate', () => { const id = new URLSearchParams(location.search).get('producto'); if (id) openProduct(id, false); else if (productDialog?.open) productDialog.close(); });
    const deepId = new URLSearchParams(location.search).get('producto');
    if (deepId) openProduct(deepId, false);
  }
  function searchText(p) { return `${p.name} ${label(p.category)} ${p.description} ${p.keywords || ''}`.toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function normalizeQuery(q) { return q.toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
  function createPager({ view, size, grid, moreButton, count, empty, renderItem, searchInput, getCategory, getSort }) {
    let state = null;
    let generation = 0;
    async function fill(target) {
      const current = state; const version = generation;
      if (!current || current.loading) return;
      current.loading = true;
      moreButton.disabled = true;
      try {
        while (current.items.length < target && current.hasMore && version === generation) {
          const result = await getPage(view, size, current.cursor, getCategory(), getSort());
          if (version !== generation) return;
          if (result.hasMore && result.nextCursor === current.cursor) throw new Error('La página no avanzó.');
          current.cursor = result.nextCursor;
          current.hasMore = result.hasMore && result.nextCursor !== null;
          const term = normalizeQuery(searchInput?.value || '');
          for (const product of result.items) if (!term || searchText(product).includes(term)) current.items.push(product);
          if (result.items.length === 0 && !current.hasMore) break;
        }
        if (version !== generation) return;
        current.target = target;
        grid.innerHTML = current.items.slice(0, target).map(renderItem).join('');
        empty?.toggleAttribute('hidden', current.items.length !== 0);
        const visibleCount = Math.min(current.items.length, target);
        count.textContent = `${visibleCount} ${view === 'admin' ? (visibleCount === 1 ? 'producto en pantalla' : 'productos en pantalla') : (visibleCount === 1 ? 'producto visible' : 'productos visibles')}`;
        moreButton.hidden = !current.hasMore && current.items.length <= target;
        if (current.items.length > target) moreButton.hidden = false;
      } catch (error) {
        if (version === generation) { if (!current.items.length) grid.innerHTML = `<p class="loading">${safe(error.message)}</p>`; count.textContent = 'No disponible'; }
      } finally { if (version === generation) { current.loading = false; moreButton.disabled = false; } }
    }
    function reset() { generation++; state = { items: [], cursor: null, hasMore: true, target: 0, loading: false }; grid.innerHTML = '<p class="loading">Cargando productos…</p>'; moreButton.hidden = true; count.textContent = 'Cargando…'; fill(size); }
    moreButton.addEventListener('click', () => fill(state.target + size));
    return { reset };
  }
  async function initHome() {
    const grid = document.querySelector('[data-home-grid]');
    try { const result = await getPage('home', 8, null); grid.innerHTML = result.items.map(card).join('') || '<p class="loading">Próximamente vas a poder explorar productos acá.</p>'; }
    catch { grid.innerHTML = '<p class="loading">No pudimos cargar los productos. Probá nuevamente más tarde.</p>'; }
  }
  function initCatalog() {
    const params = new URLSearchParams(location.search);
    let cat = categories[params.get('cat')] ? params.get('cat') : '';
    let sort = ['destacados', 'precio-asc', 'precio-desc'].includes(params.get('orden')) ? params.get('orden') : 'destacados';
    const q = document.querySelector('#catalog-q');
    const sortEl = document.querySelector('[data-catalog-sort]');
    const chips = document.querySelector('[data-category-chips]');
    const crumb = document.querySelector('[data-breadcrumb-category]');
    q.value = params.get('q') || ''; sortEl.value = sort;
    function reflect() {
      chips.innerHTML = `<button class="chip ${!cat ? 'active' : ''}" type="button" data-cat="">Todos</button>` + Object.entries(categories).map(([key, name]) => `<button class="chip ${cat === key ? 'active' : ''}" type="button" data-cat="${key}">${name}</button>`).join('');
      crumb.textContent = cat ? `/ ${categories[cat]}` : '';
      const url = new URL(location.href);
      for (const key of ['cat', 'q', 'orden']) url.searchParams.delete(key);
      if (cat) url.searchParams.set('cat', cat);
      if (q.value.trim()) url.searchParams.set('q', q.value.trim());
      if (sort !== 'destacados') url.searchParams.set('orden', sort);
      history.replaceState({}, '', url);
      document.querySelectorAll('[data-model-link]').forEach(a => { const base = new URL(a.href); base.search = url.search; a.href = base; });
    }
    const pager = createPager({ view: 'catalog', size: 16, grid: document.querySelector('[data-catalog-grid]'), moreButton: document.querySelector('[data-catalog-more]'), count: document.querySelector('[data-result-count]'), empty: document.querySelector('[data-catalog-empty]'), renderItem: card, searchInput: q, getCategory: () => cat, getSort: () => sort });
    reflect(); pager.reset();
    chips.addEventListener('click', e => { const button = e.target.closest('[data-cat]'); if (!button) return; cat = button.dataset.cat; reflect(); pager.reset(); });
    sortEl.addEventListener('change', () => { sort = sortEl.value; reflect(); pager.reset(); });
    let debounce;
    q.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { reflect(); pager.reset(); }, 280); });
    document.querySelector('[data-catalog-search]').addEventListener('submit', e => { e.preventDefault(); clearTimeout(debounce); reflect(); pager.reset(); });
    document.querySelector('[data-clear-filters]').addEventListener('click', () => { cat = ''; sort = 'destacados'; q.value = ''; sortEl.value = sort; reflect(); pager.reset(); });
  }
  function initAdmin() {
    const q = document.querySelector('#admin-q');
    const pager = createPager({ view: 'admin', size: 4, grid: document.querySelector('[data-admin-list]'), moreButton: document.querySelector('[data-admin-more]'), count: document.querySelector('[data-admin-count]'), empty: null, searchInput: q, getCategory: () => '', getSort: () => 'destacados', renderItem: p => `<li class="admin-row"><img src="${imageUrl(p.image)}" alt=""><div><h3>${safe(p.name)}</h3><small>${safe(label(p.category))} · ${safe(p.id)}</small></div><strong>${money(p.price)}</strong><span class="status-pill ${p.visible ? '' : 'off'}">${p.visible ? 'Visible' : 'Oculto'}</span></li>` });
    pager.reset();
    let debounce;
    q.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(pager.reset, 280); });
    document.querySelector('[data-admin-search]').addEventListener('submit', e => { e.preventDefault(); clearTimeout(debounce); pager.reset(); });
  }
  if (page !== 'admin') { wireSharedLinks(); wireShopping(); if (page === 'home') initHome(); else if (page === 'catalogo') initCatalog(); }
  else initAdmin();
  document.addEventListener('contextmenu', e => { if (e.target.closest('img')) e.preventDefault(); });
  document.addEventListener('dragstart', e => { if (e.target.matches('img')) e.preventDefault(); });
})();
