(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const model = document.body.dataset.model;
  const page = document.body.dataset.page;
  const catalogUrl = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const categories = { reposteria: 'Repostería', ceramica: 'Cerámica', porcelana: 'Porcelana fría' };
  const money = value => Number(value || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  const safe = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  let lastFocus = null;
  let toastTimer;

  if (model === '2') {
    $$('a[href]').forEach(link => {
      if (link.closest('.gw-modelos')) return;
      const href = link.getAttribute('href');
      if (href === './') link.setAttribute('href', 'modelo-2.html');
      if (href.startsWith('./#')) link.setAttribute('href', `modelo-2.html${href.slice(1)}`);
      if (href.startsWith('catalogo.html')) link.setAttribute('href', `catalogo-2.html${href.slice('catalogo.html'.length)}`);
    });
  }

  const toast = message => {
    const el = $('.toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3300);
  };

  const menuButton = $('.menu-toggle');
  const mainNav = $('#main-nav');
  menuButton?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  const categoryNav = $('.nav-categories');
  $('.nav-cat-toggle')?.addEventListener('click', () => {
    const open = categoryNav.classList.toggle('open');
    $('.nav-cat-toggle').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (categoryNav && !categoryNav.contains(event.target)) {
      categoryNav.classList.remove('open');
      $('.nav-cat-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
  let barTimer;
  window.addEventListener('scroll', () => {
    const bar = $('.gw-modelos');
    if (!bar) return;
    bar.classList.add('scrolling');
    clearTimeout(barTimer);
    barTimer = setTimeout(() => bar.classList.remove('scrolling'), 120);
  }, { passive: true });

  const readCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('cb3d_cart') || '[]');
      return Array.isArray(stored) ? stored.filter(item => item && item.id && item.qty > 0).slice(0, 100) : [];
    } catch { return []; }
  };
  let cart = readCart();
  const saveCart = () => {
    try { localStorage.setItem('cb3d_cart', JSON.stringify(cart)); } catch { /* private browsing */ }
    renderCart();
  };
  const addCart = product => {
    const item = cart.find(entry => entry.id === product.id);
    if (item) item.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    saveCart();
    toast(`${product.name} se sumó a tu bolsa`);
  };
  const renderCart = () => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });
    const list = $('[data-cart-items]');
    if (list) {
      list.innerHTML = cart.length ? cart.map(item => `<div class="cart-item"><img src="images/${safe(item.image)}" alt=""><div><strong>${safe(item.name)}</strong><small>${item.qty} × ${money(item.price)}</small><button type="button" data-remove="${safe(item.id)}">Quitar</button></div><strong>${money(item.qty * item.price)}</strong></div>`).join('') : `<p>Tu bolsa está esperando una idea.</p><a class="text-link" href="${catalogUrl}">Explorar cortantes ↗</a>`;
      $$('[data-remove]', list).forEach(button => button.addEventListener('click', () => {
        cart = cart.filter(item => item.id !== button.dataset.remove);
        saveCart();
      }));
    }
    const total = $('[data-cart-total]');
    if (total) total.textContent = money(cart.reduce((sum, item) => sum + item.qty * item.price, 0));
  };
  renderCart();
  const overlay = $('[data-overlay]');
  const cartDrawer = $('[data-cart-drawer]');
  const closeOverlay = () => {
    if (overlay) overlay.hidden = true;
    if (cartDrawer) cartDrawer.hidden = true;
    $('.quick-dialog')?.remove();
    document.body.classList.remove('overlay-open');
    lastFocus?.focus();
  };
  $$('[data-cart-open]').forEach(button => button.addEventListener('click', () => {
    lastFocus = button;
    if (overlay) overlay.hidden = false;
    if (cartDrawer) cartDrawer.hidden = false;
    document.body.classList.add('overlay-open');
    $('[data-cart-close]')?.focus();
  }));
  $('[data-cart-close]')?.addEventListener('click', closeOverlay);
  overlay?.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeOverlay(); });
  $('[data-checkout]')?.addEventListener('click', () => toast('El pago online se activa al pasar la web a producción.'));

  const productCard = product => `<article class="product-card"><button type="button" class="product-image" data-quick="${safe(product.id)}" aria-label="Ver ${safe(product.name)}"><img src="images/${safe(product.image)}" alt="${safe(product.name)}" loading="lazy"></button><div class="product-info"><small>${safe(categories[product.category] || '')}</small><h3>${safe(product.name)}</h3><strong class="price">${money(product.price)}</strong><div class="product-actions"><button type="button" class="add" data-add="${safe(product.id)}">Agregar +</button><button type="button" class="quick" data-quick="${safe(product.id)}" aria-label="Ver detalles de ${safe(product.name)}">Ver</button></div></div></article>`;
  const productsOnPage = new Map();
  const bindProducts = root => {
    $$('[data-add]', root).forEach(button => { if (button.dataset.bound) return; button.dataset.bound = '1'; button.addEventListener('click', () => {
      const product = productsOnPage.get(button.dataset.add);
      if (product) addCart(product);
    }); });
    $$('[data-quick]', root).forEach(button => { if (button.dataset.bound) return; button.dataset.bound = '1'; button.addEventListener('click', () => {
      const product = productsOnPage.get(button.dataset.quick);
      if (!product) return;
      lastFocus = button;
      overlay.hidden = false;
      document.body.classList.add('overlay-open');
      const dialog = document.createElement('div');
      dialog.className = 'quick-dialog';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-label', product.name);
      dialog.innerHTML = `<img src="images/${safe(product.image)}" alt="${safe(product.name)}"><div class="quick-body"><button type="button" class="quick-close" aria-label="Cerrar detalles">×</button><p class="eyebrow">${safe(categories[product.category] || '')}</p><h2>${safe(product.name)}</h2><p>${safe(product.description)}</p><p class="price">${money(product.price)}</p><button type="button" class="btn btn-primary quick-add">Agregar a la bolsa +</button><p class="demo-note">Producto y precio ilustrativos para esta demo.</p></div>`;
      document.body.append(dialog);
      $('.quick-close', dialog).addEventListener('click', closeOverlay);
      $('.quick-add', dialog).addEventListener('click', () => { addCart(product); closeOverlay(); });
      $('.quick-close', dialog).focus();
    }); });
  };

  const fetchPage = async (scope, { limit, cursor = '', cat = '', q = '' } = {}, signal) => {
    const params = new URLSearchParams({ scope, limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    if (cat) params.set('cat', cat);
    if (q) params.set('q', q);
    const response = await fetch(`api.php?${params}`, { signal });
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');
    const data = await response.json();
    if (!Array.isArray(data.items) || data.items.length > limit || data.items.length > 100) throw new Error('Página inválida');
    return data;
  };
  const remember = items => items.forEach(item => productsOnPage.set(item.id, item));

  if (page === 'home') {
    const rail = $('[data-home-products]');
    if (rail) fetchPage('home', { limit: 8 }).then(data => {
      remember(data.items);
      rail.innerHTML = data.items.map(productCard).join('');
      bindProducts(rail);
    }).catch(() => { rail.innerHTML = '<p>Los productos no están disponibles en este momento. Escribinos por WhatsApp para consultar.</p>'; });
  }

  if (page === 'catalog') {
    const grid = $('[data-catalog-products]');
    const search = $('[data-search]');
    const more = $('[data-load-more]');
    const empty = $('[data-empty]');
    const resultLabel = $('[data-result-label]');
    const params = new URLSearchParams(location.search);
    let cat = categories[params.get('cat')] ? params.get('cat') : '';
    let q = (params.get('q') || '').slice(0, 80);
    let cursor = '';
    let request;
    let debounce;
    search.value = q;
    const updateUrl = () => {
      const url = new URL(location.href);
      if (cat) url.searchParams.set('cat', cat); else url.searchParams.delete('cat');
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      url.searchParams.delete('cursor');
      history.replaceState(null, '', url);
    };
    const updateFilters = () => $$('[data-cat]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cat === cat)));
    const load = async append => {
      request?.abort();
      request = new AbortController();
      if (!append) { grid.innerHTML = '<p class="loading">Buscando formas…</p>'; cursor = ''; }
      more.hidden = true;
      try {
        const data = await fetchPage('catalog', { limit: 16, cursor, cat, q }, request.signal);
        remember(data.items);
        const cards = data.items.map(productCard).join('');
        if (append) grid.insertAdjacentHTML('beforeend', cards); else grid.innerHTML = cards;
        bindProducts(grid);
        cursor = data.nextCursor || '';
        more.hidden = !data.hasMore;
        empty.hidden = grid.children.length > 0;
        resultLabel.textContent = cat ? `Cortantes para ${categories[cat].toLowerCase()}` : 'Explorá todos los productos';
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (!append) grid.innerHTML = '<p>No pudimos cargar los productos. Probá de nuevo en un momento.</p>';
      }
    };
    updateFilters();
    load(false);
    $$('[data-cat]').forEach(button => button.addEventListener('click', () => { cat = button.dataset.cat; updateFilters(); updateUrl(); load(false); }));
    search.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { q = search.value.trim().slice(0, 80); updateUrl(); load(false); }, 250); });
    more.addEventListener('click', () => { if (cursor) load(true); });
    $('[data-clear]')?.addEventListener('click', () => { cat = ''; q = ''; search.value = ''; updateFilters(); updateUrl(); load(false); });
  }

  if (page === 'admin') {
    const list = $('[data-admin-list]');
    const search = $('[data-admin-search]');
    const more = $('[data-admin-more]');
    const status = $('[data-admin-status]');
    let cursor = '';
    let q = '';
    let count = 0;
    let controller;
    let debounce;
    const load = async append => {
      controller?.abort();
      controller = new AbortController();
      if (!append) { list.innerHTML = '<p style="padding:20px">Cargando productos…</p>'; cursor = ''; count = 0; }
      more.hidden = true;
      try {
        const data = await fetchPage('admin', { limit: 100, cursor, q }, controller.signal);
        const rows = data.items.map(item => `<div class="admin-row"><img src="images/${safe(item.image)}" alt=""><span><strong>${safe(item.name)}</strong><small>${safe(item.id)}</small></span><span class="admin-cat">${safe(categories[item.category] || '')}</span><strong>${money(item.price)}</strong></div>`).join('');
        if (append) list.insertAdjacentHTML('beforeend', rows); else list.innerHTML = rows || '<p style="padding:20px">No encontramos productos con esa búsqueda.</p>';
        count += data.items.length;
        cursor = data.nextCursor || '';
        more.hidden = !data.hasMore;
        status.textContent = `${count} producto${count === 1 ? '' : 's'} cargado${count === 1 ? '' : 's'} · hasta 100 por consulta`;
      } catch (error) {
        if (error.name === 'AbortError') return;
        list.innerHTML = '<p style="padding:20px">No pudimos cargar los productos.</p>';
      }
    };
    load(false);
    more.addEventListener('click', () => { if (cursor) load(true); });
    search.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { q = search.value.trim().slice(0, 80); load(false); }, 250); });
  }
})();
