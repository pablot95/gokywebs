(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const page = document.body.dataset.page;
  const model = /(?:modelo-2|catalogo-2)\.html$/.test(location.pathname) ? '2' : '1';
  document.body.dataset.model = model;
  document.body.classList.toggle('model-two', model === '2');
  document.body.classList.toggle('model-one', model === '1');
  const catalogUrl = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const categories = { conjuntos: 'Conjuntos', soft: 'Taza soft', loungewear: 'Para estar en casa' };
  const money = amount => Number(amount || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let lastFocus = null;
  let toastTimer;

  if (model === '2') {
    $$('a[href]').forEach(link => {
      if (link.closest('.model-switch')) return;
      const href = link.getAttribute('href');
      if (href === './') link.setAttribute('href', 'modelo-2.html');
      else if (href.startsWith('./#')) link.setAttribute('href', `modelo-2.html${href.slice(1)}`);
      else if (href.startsWith('catalogo.html')) link.setAttribute('href', `catalogo-2.html${href.slice('catalogo.html'.length)}`);
    });
  }

  const menu = $('#main-nav');
  const menuButton = $('.menu-toggle');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  const navGroup = $('.nav-group');
  $('.nav-group-toggle')?.addEventListener('click', () => {
    const open = navGroup.classList.toggle('open');
    $('.nav-group-toggle').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (navGroup && !navGroup.contains(event.target)) {
      navGroup.classList.remove('open');
      $('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
  let barTimer;
  window.addEventListener('scroll', () => {
    const bar = $('.model-switch');
    if (!bar) return;
    bar.classList.add('scrolling');
    clearTimeout(barTimer);
    barTimer = setTimeout(() => bar.classList.remove('scrolling'), 120);
  }, { passive: true });

  const toast = message => {
    const el = $('.toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
  };
  const readCart = () => {
    try {
      const value = JSON.parse(localStorage.getItem('elodie_cart') || '[]');
      return Array.isArray(value) ? value.filter(x => x && x.id && x.qty > 0).slice(0, 100) : [];
    } catch { return []; }
  };
  let cart = readCart();
  const saveCart = () => {
    try { localStorage.setItem('elodie_cart', JSON.stringify(cart)); } catch { /* storage unavailable */ }
    renderCart();
  };
  const renderCart = () => {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });
    const list = $('[data-cart-items]');
    if (list) {
      list.innerHTML = cart.length ? cart.map(item => `<div class="cart-row"><img src="images/${escapeHtml(item.image)}" alt=""><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.color)} · Talle ${escapeHtml(item.size)} · ${item.qty} × ${money(item.price)}</small><button type="button" data-remove="${escapeHtml(item.key)}">Quitar</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join('') : `<p>Tu bolsa está esperando una elección.</p><a class="underlink" href="${catalogUrl}">Explorar colección ↗</a>`;
      $$('[data-remove]', list).forEach(button => button.addEventListener('click', () => {
        cart = cart.filter(item => item.key !== button.dataset.remove);
        saveCart();
      }));
    }
    const total = $('[data-cart-total]');
    if (total) total.textContent = money(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  };
  renderCart();
  const overlay = $('[data-overlay]');
  const drawer = $('[data-cart-drawer]');
  const closeOverlay = () => {
    if (overlay) overlay.hidden = true;
    if (drawer) drawer.hidden = true;
    $('.quick-modal')?.remove();
    document.body.classList.remove('overlay-open');
    lastFocus?.focus();
  };
  $$('[data-cart-open]').forEach(button => button.addEventListener('click', () => {
    lastFocus = button;
    overlay.hidden = false;
    drawer.hidden = false;
    document.body.classList.add('overlay-open');
    $('[data-cart-close]')?.focus();
  }));
  $('[data-cart-close]')?.addEventListener('click', closeOverlay);
  overlay?.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeOverlay();
    if (event.key !== 'Tab') return;
    const active = $('.quick-modal') || (!drawer?.hidden && drawer);
    if (!active) return;
    const focusable = $$('button,a[href],input,select', active).filter(el => !el.disabled && !el.hidden);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  $('[data-checkout]')?.addEventListener('click', () => toast('El pago online con Mercado Pago se habilita en la tienda final.'));

  const products = new Map();
  const remember = items => items.forEach(item => products.set(item.id, item));
  const card = item => `<article class="product-card"><button type="button" class="product-photo" data-view="${escapeHtml(item.id)}" aria-label="Ver ${escapeHtml(item.name)}"><img src="images/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy"></button><div class="product-body"><small>${escapeHtml(categories[item.category] || '')}</small><h3>${escapeHtml(item.name)}</h3><span class="product-price">${money(item.price)}</span><button type="button" class="card-action" data-view="${escapeHtml(item.id)}">Elegir color y talle ↗</button></div></article>`;
  const showProduct = (item, trigger) => {
    lastFocus = trigger;
    let selectedColor = 0;
    let selectedSize = '';
    overlay.hidden = false;
    document.body.classList.add('overlay-open');
    const modal = document.createElement('div');
    modal.className = 'quick-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', item.name);
    modal.innerHTML = `<img data-variant-image src="images/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"><div class="quick-body"><button type="button" class="quick-close" aria-label="Cerrar producto">×</button><p class="eyebrow">${escapeHtml(categories[item.category] || '')}</p><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p><p class="product-price">${money(item.price)}</p><div class="variant-group"><label>Elegí un color</label><div class="color-options">${item.colors.map((color, index) => `<button type="button" data-color="${index}" aria-pressed="${index === 0}"><span class="color-dot" style="background:${escapeHtml(color.hex)}"></span>${escapeHtml(color.name)}</button>`).join('')}</div></div><div class="variant-group"><label>Elegí un talle</label><div class="size-options">${item.sizes.map(size => `<button type="button" data-size="${escapeHtml(size)}" aria-pressed="false">${escapeHtml(size)}</button>`).join('')}</div></div><button type="button" class="button button-dark" data-add-variant>Sumar a mi bolsa ↗</button><p class="fixture-note">Talles, colores y disponibilidad reales a confirmar.</p></div>`;
    document.body.append(modal);
    $('.quick-close', modal).addEventListener('click', closeOverlay);
    $$('[data-color]', modal).forEach(button => button.addEventListener('click', () => {
      selectedColor = Number(button.dataset.color);
      $$('[data-color]', modal).forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      $('[data-variant-image]', modal).src = `images/${item.colors[selectedColor].image}`;
    }));
    $$('[data-size]', modal).forEach(button => button.addEventListener('click', () => {
      selectedSize = button.dataset.size;
      $$('[data-size]', modal).forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    }));
    $('[data-add-variant]', modal).addEventListener('click', () => {
      if (!selectedSize) { toast('Elegí un talle para sumar el conjunto.'); return; }
      const color = item.colors[selectedColor];
      const key = `${item.id}|${color.name}|${selectedSize}`;
      const existing = cart.find(x => x.key === key);
      if (existing) existing.qty += 1;
      else cart.push({ key, id: item.id, name: item.name, color: color.name, size: selectedSize, image: color.image, price: item.price, qty: 1 });
      saveCart();
      closeOverlay();
      toast(`${item.name} se sumó a tu bolsa`);
    });
    $('.quick-close', modal).focus();
  };
  const bindCards = root => root.addEventListener('click', event => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    const item = products.get(button.dataset.view);
    if (item) showProduct(item, button);
  });

  const fetchPage = async (scope, { limit, cursor = '', cat = '', q = '' } = {}, signal) => {
    const params = new URLSearchParams({ scope, limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    if (cat) params.set('cat', cat);
    if (q) params.set('q', q);
    const response = await fetch(`api.php?${params}`, { signal });
    if (!response.ok) throw new Error('No se pudo cargar la colección');
    const data = await response.json();
    if (!Array.isArray(data.items) || data.items.length > limit || data.items.length > 100) throw new Error('Página inválida');
    return data;
  };
  if (page === 'home') {
    const target = $('[data-home-products]');
    bindCards(target);
    fetchPage('home', { limit: 4 }).then(data => {
      remember(data.items);
      target.innerHTML = data.items.map(card).join('');
    }).catch(() => { target.innerHTML = '<p>No pudimos cargar la colección. Consultanos por WhatsApp.</p>'; });
  }
  if (page === 'catalog') {
    const grid = $('[data-catalog-products]');
    const more = $('[data-load-more]');
    const search = $('[data-search]');
    const empty = $('[data-empty]');
    const params = new URLSearchParams(location.search);
    let cat = categories[params.get('cat')] ? params.get('cat') : '';
    let q = (params.get('q') || '').slice(0, 80);
    let cursor = '';
    let controller;
    let debounce;
    search.value = q;
    if (params.has('buscar')) setTimeout(() => search.focus(), 100);
    bindCards(grid);
    const updateUrl = () => {
      const url = new URL(location.href);
      if (cat) url.searchParams.set('cat', cat); else url.searchParams.delete('cat');
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      url.searchParams.delete('buscar');
      history.replaceState(null, '', url);
    };
    const updateButtons = () => $$('[data-cat]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cat === cat)));
    const load = async append => {
      controller?.abort();
      controller = new AbortController();
      if (!append) { cursor = ''; grid.innerHTML = '<p>Cargando colección…</p>'; }
      more.hidden = true;
      try {
        const data = await fetchPage('catalog', { limit: 16, cursor, cat, q }, controller.signal);
        remember(data.items);
        if (append) grid.insertAdjacentHTML('beforeend', data.items.map(card).join(''));
        else grid.innerHTML = data.items.map(card).join('');
        cursor = data.nextCursor || '';
        more.hidden = !data.hasMore;
        empty.hidden = grid.children.length > 0;
        $('[data-result-count]').textContent = cat ? `Piezas de ${categories[cat].toLowerCase()}` : 'Explorá todos los productos';
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (!append) grid.innerHTML = '<p>No pudimos cargar la colección en este momento.</p>';
      }
    };
    updateButtons(); load(false);
    $$('[data-cat]').forEach(button => button.addEventListener('click', () => { cat = button.dataset.cat; updateButtons(); updateUrl(); load(false); }));
    search.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { q = search.value.trim().slice(0, 80); updateUrl(); load(false); }, 250); });
    more.addEventListener('click', () => { if (cursor) load(true); });
    $('[data-clear]').addEventListener('click', () => { cat = ''; q = ''; search.value = ''; updateButtons(); updateUrl(); load(false); });
  }
  if (page === 'admin') {
    const list = $('[data-admin-list]');
    const search = $('[data-admin-search]');
    const more = $('[data-admin-more]');
    const status = $('[data-admin-status]');
    let cursor = '', q = '', count = 0, controller, debounce;
    const load = async append => {
      controller?.abort(); controller = new AbortController();
      if (!append) { cursor = ''; count = 0; list.innerHTML = '<p style="padding:20px">Cargando productos…</p>'; }
      more.hidden = true;
      try {
        const data = await fetchPage('admin', { limit: 100, cursor, q }, controller.signal);
        const rows = data.items.map(item => `<div class="admin-row"><img src="images/${escapeHtml(item.image)}" alt=""><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.id)}</small></span><span class="admin-category">${escapeHtml(categories[item.category] || '')}</span><strong>${money(item.price)}</strong></div>`).join('');
        if (append) list.insertAdjacentHTML('beforeend', rows);
        else list.innerHTML = rows || '<p style="padding:20px">No encontramos productos con esa búsqueda.</p>';
        count += data.items.length;
        cursor = data.nextCursor || '';
        more.hidden = !data.hasMore;
        status.textContent = `${count} producto${count === 1 ? '' : 's'} cargado${count === 1 ? '' : 's'} · máximo 100 por consulta`;
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
