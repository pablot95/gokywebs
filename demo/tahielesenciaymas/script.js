(() => {
  'use strict';

  const model = document.body.dataset.modelo || '1';
  const page = document.body.dataset.pagina || 'home';
  const catalogUrl = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const categories = [
    { id: 'hombre', label: 'Perfumes hombre', image: '03_perfumes_hombre_1x1.jpg' },
    { id: 'mujer', label: 'Perfumes mujer', image: '04_perfumes_mujer_belleza_1x1.jpg' },
    { id: 'belleza', label: 'Belleza y cuidado', image: '04_perfumes_mujer_belleza_1x1.jpg' },
    { id: 'electronica', label: 'Electrónica', image: '05_electronica_1x1.jpg' },
    { id: 'bazar', label: 'Bazar y decoración', image: '06_bazar_decoracion_1x1.jpg' }
  ];
  const productCache = new Map();
  const money = number => '$' + Number(number || 0).toLocaleString('es-AR');
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const categoryName = id => categories.find(category => category.id === id)?.label || id;
  const imageUrl = product => 'images/' + encodeURIComponent(product.image);

  async function fetchPage(view, limit, cursor) {
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('view', view);
    url.searchParams.set('limit', String(limit));
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
    return response.json();
  }
  async function fetchProduct(id) {
    if (productCache.has(id)) return productCache.get(id);
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('id', id);
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.item) productCache.set(id, data.item);
    return data.item || null;
  }
  function rememberVisible(products) { products.forEach(product => productCache.set(product.id, product)); }

  function initModelBarScroll() {
    const bar = document.querySelector('.gw-modelos');
    if (!bar) return;
    let showTimer = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.scrollY <= 8) { bar.classList.remove('gw-modelos--scrolling'); return; }
      bar.classList.add('gw-modelos--scrolling');
      clearTimeout(showTimer);
      showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
    };
    window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  }

  let revealObserver;
  function revealNew(root = document) {
    const elements = [...root.querySelectorAll('[data-animate]:not(.in)')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); } });
      }, { threshold: 0, rootMargin: '0px 0px 70px 0px' });
    }
    elements.forEach(element => revealObserver.observe(element));
    const sweep = () => elements.forEach(element => {
      if (element.classList.contains('in')) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < innerHeight + 70 && rect.bottom > -70) element.classList.add('in');
    });
    requestAnimationFrame(sweep);
  }
  window.addEventListener('load', () => revealNew());
  window.addEventListener('scroll', () => revealNew(), { passive: true });
  window.addEventListener('resize', () => revealNew());

  const menu = document.querySelector('[data-main-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  function setMenu(open) {
    if (!menu || !menuToggle) return;
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', open);
  }
  menuToggle?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  const categoryMenu = document.querySelector('.category-menu');
  document.querySelectorAll('[data-category-menu]').forEach(container => {
    container.innerHTML = categories.map(category => `<a href="${catalogUrl}?cat=${category.id}">${safe(category.label)} <small>Explorar ↗</small></a>`).join('') + `<a href="${catalogUrl}">Ver toda la tienda <small>↗</small></a>`;
  });
  document.addEventListener('click', event => { if (categoryMenu?.open && !categoryMenu.contains(event.target)) categoryMenu.open = false; });

  document.querySelectorAll('[data-search-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const q = form.querySelector('input[name="q"]')?.value.trim() || '';
    if (page === 'catalogo') {
      const field = document.querySelector('[data-catalog-search] input[name="q"]');
      if (field) field.value = q;
      applyCatalogFilters();
      field?.focus();
    } else location.href = catalogUrl + (q ? '?q=' + encodeURIComponent(q) : '');
  }));

  let toastTimer;
  function toast(message) {
    const host = document.querySelector('[data-toast]');
    if (!host) return;
    host.innerHTML = `<p>${safe(message)}</p>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { host.innerHTML = ''; }, 3300);
  }

  function productCard(product) {
    return `<article class="product-card" data-product-id="${safe(product.id)}" data-animate="subir" style="opacity:0;transform:translateY(28px)"><button type="button" class="product-photo" data-product-view="${safe(product.id)}" aria-label="Ver ${safe(product.name)}"><img src="${imageUrl(product)}" alt="${safe(product.name)}" width="500" height="500" loading="lazy"><span>TAHIEL</span></button><div class="product-info"><span class="category-label">${safe(categoryName(product.category))}</span><h3 class="product-title">${safe(product.name)}</h3><p class="product-presentation">${safe(product.presentation)}</p><p class="product-price">${money(product.price)}</p><div class="prod-actions"><button type="button" class="prod-view" data-product-view="${safe(product.id)}" aria-label="Ver detalle de ${safe(product.name)}">↗</button><button type="button" class="prod-add" data-product-add="${safe(product.id)}">Agregar</button></div></div></article>`;
  }
  function categoryCard(category) {
    return `<a class="category-card" href="${catalogUrl}?cat=${category.id}" data-animate="subir" style="opacity:0;transform:translateY(30px)"><figure><img src="images/${category.image}" width="500" height="500" loading="lazy" alt="${safe(category.label)} de Tahiel Esencia y Más"></figure><span>${safe(category.label)} <i aria-hidden="true">↗</i></span></a>`;
  }
  function initCategories() {
    document.querySelectorAll('[data-category-grid]').forEach(container => {
      container.innerHTML = categories.map(categoryCard).join('');
      revealNew(container);
    });
  }
  function initRailDrag(rail) {
    if (!rail) return;
    let down = false, startX = 0, startScroll = 0, dragged = false;
    rail.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') return; down = true; dragged = false; startX = event.clientX; startScroll = rail.scrollLeft; });
    rail.addEventListener('pointermove', event => { if (!down) return; const distance = event.clientX - startX; if (Math.abs(distance) > 6 && !dragged) { dragged = true; try { rail.setPointerCapture(event.pointerId); } catch (_) {} } if (dragged) rail.scrollLeft = startScroll - distance; });
    const stop = event => { down = false; try { rail.releasePointerCapture(event.pointerId); } catch (_) {} };
    rail.addEventListener('pointerup', stop); rail.addEventListener('pointercancel', stop);
    rail.addEventListener('click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } }, true);
  }
  async function initHome() {
    initCategories();
    const rail = document.querySelector('[data-featured-rail]');
    const grid = document.querySelector('[data-preview-grid]');
    try {
      const featured = await fetchPage('home', 8, null);
      rememberVisible(featured.items);
      if (rail) { rail.innerHTML = featured.items.map(productCard).join(''); initRailDrag(rail); revealNew(rail); }
      if (grid) {
        const preview = await fetchPage('home', 8, featured.nextCursor);
        rememberVisible(preview.items);
        grid.innerHTML = preview.items.map(productCard).join('');
        revealNew(grid);
      }
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    } catch (_) {
      if (rail) rail.innerHTML = '<p>No pudimos mostrar los productos de muestra. Probá más tarde.</p>';
      if (grid) grid.innerHTML = '<p>No pudimos mostrar la vista previa del catálogo.</p>';
    }
  }

  const catalogState = { cursor: null, hasMore: true, matches: [], visible: 0, busy: false, category: '', q: '', generation: 0 };
  function filterProduct(product, state) {
    if (state.category && product.category !== state.category) return false;
    if (!state.q) return true;
    return normalize([product.name, product.category, categoryName(product.category), product.presentation, product.description].join(' ')).includes(normalize(state.q));
  }
  function urlFilters() {
    const url = new URL(location.href);
    catalogState.category = categories.some(category => category.id === url.searchParams.get('cat')) ? url.searchParams.get('cat') : '';
    catalogState.q = (url.searchParams.get('q') || '').slice(0, 80);
  }
  function syncFilterUrl() {
    const url = new URL(location.href);
    if (catalogState.category) url.searchParams.set('cat', catalogState.category); else url.searchParams.delete('cat');
    if (catalogState.q) url.searchParams.set('q', catalogState.q); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }
  function renderFilterOptions() {
    const container = document.querySelector('[data-filter-options]');
    if (!container) return;
    const options = [{ id: '', label: 'Todas las categorías' }, ...categories];
    container.innerHTML = options.map(category => `<label><input type="radio" name="catalog-category" value="${category.id}" ${catalogState.category === category.id ? 'checked' : ''}><span>${safe(category.label)}</span></label>`).join('');
    container.addEventListener('change', event => { catalogState.category = event.target.value; applyCatalogFilters(); });
  }
  async function fillTo(target, state, view, generation) {
    while (state.matches.length < target && state.hasMore && state.generation === generation) {
      const pageData = await fetchPage(view, view === 'admin' ? 10 : 16, state.cursor);
      if (state.generation !== generation) return;
      state.cursor = pageData.nextCursor;
      state.hasMore = Boolean(pageData.hasMore);
      const matches = pageData.items.filter(product => filterProduct(product, state));
      rememberVisible(matches);
      state.matches.push(...matches);
      if (!pageData.items.length) state.hasMore = false;
    }
  }
  async function showCatalog(target) {
    if (catalogState.busy) return;
    catalogState.busy = true;
    const generation = catalogState.generation;
    const grid = document.querySelector('[data-catalog-grid]');
    const more = document.querySelector('[data-load-more]');
    if (more) more.disabled = true;
    try {
      await fillTo(target, catalogState, 'catalog', generation);
      if (catalogState.generation !== generation) return;
      catalogState.visible = Math.min(target, catalogState.matches.length);
      if (grid) { grid.innerHTML = catalogState.matches.slice(0, catalogState.visible).map(productCard).join(''); revealNew(grid); }
      document.querySelector('[data-empty]')?.toggleAttribute('hidden', catalogState.visible > 0);
      if (more) more.hidden = !catalogState.hasMore && catalogState.matches.length <= catalogState.visible;
      const counter = document.querySelector('[data-result-count]');
      if (counter) counter.textContent = catalogState.visible + (catalogState.hasMore ? '+ productos' : catalogState.visible === 1 ? ' producto' : ' productos');
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    } catch (_) { toast('No pudimos cargar los productos. Intentá de nuevo.'); }
    finally {
      catalogState.busy = false;
      if (more) more.disabled = false;
      if (catalogState.generation !== generation) showCatalog(16);
    }
  }
  function applyCatalogFilters() {
    if (page !== 'catalogo') return;
    catalogState.q = document.querySelector('[data-catalog-search] input[name="q"]')?.value.trim().slice(0, 80) || '';
    catalogState.cursor = null; catalogState.hasMore = true; catalogState.matches = []; catalogState.visible = 0; catalogState.generation++;
    syncFilterUrl();
    document.querySelectorAll('input[name="catalog-category"]').forEach(input => { input.checked = input.value === catalogState.category; });
    const crumb = document.querySelector('[data-breadcrumb-category]');
    if (crumb) crumb.textContent = catalogState.category ? categoryName(catalogState.category) : 'Catálogo';
    showCatalog(16);
  }
  function initCatalog() {
    urlFilters();
    renderFilterOptions();
    const search = document.querySelector('[data-catalog-search]');
    if (search) {
      search.querySelector('input[name="q"]').value = catalogState.q;
      search.addEventListener('submit', event => { event.preventDefault(); applyCatalogFilters(); });
    }
    document.querySelectorAll('[data-clear-filters]').forEach(button => button.addEventListener('click', () => {
      catalogState.category = '';
      if (search) search.querySelector('input[name="q"]').value = '';
      applyCatalogFilters();
    }));
    document.querySelector('[data-load-more]')?.addEventListener('click', () => showCatalog(catalogState.visible + 16));
    const crumb = document.querySelector('[data-breadcrumb-category]');
    if (crumb) crumb.textContent = catalogState.category ? categoryName(catalogState.category) : 'Catálogo';
    showCatalog(16);
  }

  const Cart = {
    KEY: 'tahiel_demo_cart',
    get() { try { const data = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(data) ? data.filter(item => /^[a-z0-9-]+$/.test(item.id) && Number.isInteger(item.qty) && item.qty > 0) : []; } catch (_) { return []; } },
    save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (_) {} document.dispatchEvent(new Event('cart:updated')); },
    add(product, qty = 1) { const items = this.get(); const found = items.find(item => item.id === product.id); if (found) found.qty = Math.min(product.stock, found.qty + qty); else items.push({ id: product.id, qty: Math.min(product.stock, qty) }); this.save(items); },
    setQty(id, qty) { const items = this.get(); const found = items.find(item => item.id === id); if (found) { found.qty = Math.max(1, Math.min(productCache.get(id)?.stock || 99, qty)); this.save(items); } },
    remove(id) { this.save(this.get().filter(item => item.id !== id)); },
    count() { return this.get().reduce((sum, item) => sum + item.qty, 0); }
  };
  async function renderCart() {
    const items = Cart.get();
    document.querySelectorAll('[data-cart-count]').forEach(node => { node.textContent = String(Cart.count()); });
    document.querySelector('.cart-float')?.classList.toggle('visible', Cart.count() > 0 || window.scrollY > 600);
    const host = document.querySelector('[data-cart-lines]');
    if (!host) return;
    if (!items.length) { host.innerHTML = `<div class="empty-state"><h3>Tu pedido está vacío</h3><p>Explorá perfumes, belleza, electrónica y bazar.</p><a class="btn btn-outline" href="${catalogUrl}">Ver la tienda</a></div>`; document.querySelector('[data-cart-total]').textContent = money(0); return; }
    const products = await Promise.all(items.map(item => fetchProduct(item.id)));
    let total = 0;
    host.innerHTML = items.map((item, index) => { const product = products[index]; if (!product) return ''; total += product.price * item.qty; return `<div class="cart-line"><img src="${imageUrl(product)}" alt="" width="72" height="72"><div><strong>${safe(product.name)}</strong><small>${money(product.price)} por presentación</small><div class="cart-line-controls"><button type="button" data-cart-minus="${safe(item.id)}" aria-label="Restar uno">−</button><span>${item.qty}</span><button type="button" data-cart-plus="${safe(item.id)}" aria-label="Sumar uno">+</button></div></div><button type="button" data-cart-remove="${safe(item.id)}" aria-label="Quitar ${safe(product.name)}">×</button></div>`; }).join('');
    document.querySelector('[data-cart-total]').textContent = money(total);
  }
  document.addEventListener('cart:updated', renderCart);
  window.addEventListener('scroll', () => document.querySelector('.cart-float')?.classList.toggle('visible', Cart.count() > 0 || window.scrollY > 600), { passive: true });
  let focusBeforeOverlay = null;
  function openPanel(panel) {
    focusBeforeOverlay = document.activeElement;
    document.querySelector('[data-overlay]').hidden = false;
    panel.hidden = false;
    document.body.classList.add('no-scroll');
    panel.querySelector('button')?.focus();
  }
  function closePanels() {
    document.querySelector('[data-overlay]').hidden = true;
    document.querySelector('[data-cart-drawer]').hidden = true;
    document.querySelector('[data-product-dialog]').hidden = true;
    document.body.classList.remove('no-scroll');
    focusBeforeOverlay?.focus?.();
    const url = new URL(location.href); url.searchParams.delete('producto'); history.replaceState(null, '', url);
  }
  document.querySelector('[data-overlay]')?.addEventListener('click', closePanels);
  document.querySelectorAll('[data-cart-close],[data-dialog-close]').forEach(button => button.addEventListener('click', closePanels));
  document.querySelectorAll('[data-cart-open]').forEach(button => button.addEventListener('click', () => { renderCart(); openPanel(document.querySelector('[data-cart-drawer]')); }));
  document.querySelector('[data-checkout]')?.addEventListener('click', async () => {
    const items = Cart.get();
    if (!items.length) { toast('Sumá algún producto antes de consultar.'); return; }
    const products = await Promise.all(items.map(item => fetchProduct(item.id)));
    const lines = items.map((item, index) => products[index] ? `• ${products[index].name} × ${item.qty}` : '').filter(Boolean);
    const message = `Hola Tahiel, quiero consultar por estos productos de la demo:\n${lines.join('\n')}\nEntiendo que el pago es solo por transferencia y que los precios de la demo son ilustrativos.`;
    window.location.href = 'https://wa.me/5491139295703?text=' + encodeURIComponent(message);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (menu?.classList.contains('open')) setMenu(false); if (categoryMenu?.open) categoryMenu.open = false; if (!document.querySelector('[data-overlay]')?.hidden) closePanels(); }
    if (event.key !== 'Tab') return;
    const panel = !document.querySelector('[data-product-dialog]')?.hidden ? document.querySelector('[data-product-dialog]') : !document.querySelector('[data-cart-drawer]')?.hidden ? document.querySelector('[data-cart-drawer]') : null;
    if (!panel) return;
    const focusables = [...panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')];
    if (!focusables.length) return;
    if (event.shiftKey && document.activeElement === focusables[0]) { event.preventDefault(); focusables.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusables.at(-1)) { event.preventDefault(); focusables[0].focus(); }
  });

  async function openProduct(id) {
    const product = await fetchProduct(id);
    if (!product) return;
    const related = [...productCache.values()].filter(other => other.category === product.category && other.id !== product.id).slice(0, 3);
    const host = document.querySelector('[data-product-detail]');
    host.innerHTML = `<div class="detail-grid"><div class="detail-media"><img src="${imageUrl(product)}" alt="${safe(product.name)}" width="700" height="700"></div><div class="detail-content"><p class="eyebrow">${safe(categoryName(product.category))} / TAHIEL</p><h2>${safe(product.name)}</h2><p>${safe(product.description)}</p><div class="detail-price">${money(product.price)}</div><div class="detail-meta"><div><span>Presentación</span><strong>${safe(product.presentation)}</strong></div><div><span>Disponibilidad demo</span><strong>${product.stock} unidades</strong></div></div><div class="detail-actions"><label class="sr-only" for="detail-qty">Cantidad</label><input id="detail-qty" type="number" min="1" max="${product.stock}" value="1"><button class="btn btn-accent" type="button" data-detail-add="${safe(product.id)}">Agregar al pedido</button></div><p class="sample-note">Precio, presentación y stock de muestra. Envíos a todo el país y pago solo por transferencia.</p></div></div>${related.length ? `<div class="detail-related"><h3>También te puede interesar</h3><div class="related-list">${related.map(other => `<button type="button" data-product-view="${safe(other.id)}"><img src="${imageUrl(other)}" alt="" width="45" height="45"><span>${safe(other.name)}</span></button>`).join('')}</div></div>` : ''}`;
    openPanel(document.querySelector('[data-product-dialog]'));
    const url = new URL(location.href); url.searchParams.set('producto', id); history.replaceState(null, '', url);
  }
  document.addEventListener('click', async event => {
    const view = event.target.closest('[data-product-view]');
    if (view) { await openProduct(view.dataset.productView); return; }
    const add = event.target.closest('[data-product-add],[data-detail-add]');
    if (add) { const product = await fetchProduct(add.dataset.productAdd || add.dataset.detailAdd); if (!product) return; const qty = add.dataset.detailAdd ? Math.max(1, Math.min(product.stock, Number(document.querySelector('#detail-qty')?.value) || 1)) : 1; Cart.add(product, qty); toast('Se agregó a tu pedido.'); return; }
    const minus = event.target.closest('[data-cart-minus]'); if (minus) { const item = Cart.get().find(row => row.id === minus.dataset.cartMinus); if (item) item.qty <= 1 ? Cart.remove(item.id) : Cart.setQty(item.id, item.qty - 1); return; }
    const plus = event.target.closest('[data-cart-plus]'); if (plus) { const item = Cart.get().find(row => row.id === plus.dataset.cartPlus); if (item) Cart.setQty(item.id, item.qty + 1); return; }
    const remove = event.target.closest('[data-cart-remove]'); if (remove) Cart.remove(remove.dataset.cartRemove);
  });

  async function initAdminDemo() {
    const state = { cursor: null, hasMore: true, matches: [], visible: 0, busy: false, q: '', category: '', generation: 0 };
    const search = document.querySelector('[data-admin-search]');
    const grid = document.querySelector('[data-admin-grid]');
    const more = document.querySelector('[data-admin-more]');
    const counter = document.querySelector('[data-admin-count]');
    async function render(target) {
      if (state.busy) return;
      state.busy = true; more.disabled = true;
      const generation = state.generation;
      try {
        await fillTo(target, state, 'admin', generation);
        if (state.generation !== generation) return;
        state.visible = Math.min(target, state.matches.length);
        grid.innerHTML = state.matches.slice(0, state.visible).map(product => `<li><img src="${imageUrl(product)}" alt="" width="58" height="58"><div><strong>${safe(product.name)}</strong><small>${safe(categoryName(product.category))} · ${safe(product.presentation)}</small></div><b>${money(product.price)}</b></li>`).join('') || '<li>No hay coincidencias. Probá con otra palabra.</li>';
        more.hidden = !state.hasMore && state.matches.length <= state.visible;
        counter.textContent = `${state.visible}${state.hasMore ? '+' : ''} ${state.visible === 1 && !state.hasMore ? 'producto visible' : 'productos visibles'}`;
      } catch (_) { counter.textContent = 'No se pudo cargar la lista'; }
      finally { state.busy = false; more.disabled = false; if (state.generation !== generation) render(10); }
    }
    search?.addEventListener('submit', event => { event.preventDefault(); state.q = search.querySelector('input').value.trim().slice(0, 80); state.cursor = null; state.hasMore = true; state.matches = []; state.visible = 0; state.generation++; render(10); });
    more?.addEventListener('click', () => render(state.visible + 10));
    render(10);
  }

  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && ['s', 'u', 'p'].includes(event.key.toLowerCase())) event.preventDefault(); });
  initModelBarScroll();
  revealNew();
  renderCart();
  if (page === 'home') initHome();
  if (page === 'catalogo') initCatalog();
  if (page === 'admin') initAdminDemo();
  const requested = new URL(location.href).searchParams.get('producto');
  if (requested && /^[a-z0-9-]+$/.test(requested)) openProduct(requested);
})();
