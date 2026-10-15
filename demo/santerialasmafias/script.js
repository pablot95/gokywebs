(() => {
  'use strict';
  const page = document.body.dataset.page;
  const model = document.body.dataset.model || '1';
  const catalogFile = model === '2' ? 'catalogo-2.html' : 'catalogo.html';
  const categories = { velones: 'Velones Fortaleza', velas: 'Velas', rosarios: 'Rosarios e incienso', imagenes: 'Imágenes religiosas' };
  const money = value => '$' + Number(value || 0).toLocaleString('es-AR');
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const image = product => 'images/' + encodeURIComponent(product.image);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function products(view, { limit, cursor = '', q = '', cat = '', sort = 'destacados' } = {}) {
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('view', view);
    url.searchParams.set('limit', String(Math.max(1, Math.min(view === 'home' ? 8 : 100, limit || 16))));
    if (cursor) url.searchParams.set('cursor', cursor);
    if (q) url.searchParams.set('q', q.slice(0, 80));
    if (cat) url.searchParams.set('cat', cat);
    if (sort !== 'destacados') url.searchParams.set('sort', sort);
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('No se pudo cargar la página de productos');
    return response.json();
  }

  async function productById(id) {
    if (!/^[a-z0-9-]{1,64}$/.test(id)) return null;
    const url = new URL('api/productos.php', location.href);
    url.searchParams.set('id', id);
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.item || null;
  }

  function card(product) {
    return `<article class="product-card" data-animate><button class="card-photo" type="button" data-product="${safe(product.id)}" aria-label="Ver detalle de ${safe(product.name)}"><img src="${image(product)}" width="1254" height="1254" alt="${safe(product.name)}, imagen ilustrativa"><span aria-hidden="true">↗</span></button><div class="card-body"><span class="card-category">${safe(categories[product.category])}</span><h3>${safe(product.name)}</h3><div class="card-bottom"><strong class="card-price">${money(product.price)}</strong><div class="card-actions"><button class="card-detail" type="button" data-product="${safe(product.id)}">Ver detalle</button><button class="card-add" type="button" data-add="${safe(product.id)}">Agregar +</button></div></div></div></article>`;
  }

  let revealObserver = null;
  function reveal(element) { element.classList.add('in'); }
  function watchReveals(root = document) {
    root.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
      if (reduceMotion || !('IntersectionObserver' in window)) reveal(el);
      else revealObserver.observe(el);
    });
  }
  function initReveals() {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => {
        let i = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = `${Math.min(i++ * .09, .54)}s`;
          reveal(el);
          revealObserver.unobserve(el);
          setTimeout(() => { el.style.transitionDelay = ''; }, 1250);
        });
      }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    }
    watchReveals();
    const sweep = () => document.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) { reveal(el); revealObserver?.unobserve(el); }
    });
    requestAnimationFrame(() => requestAnimationFrame(sweep));
    window.addEventListener('load', sweep);
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
  }

  function initModelBar() {
    const bar = document.querySelector('.gw-modelos');
    if (!bar) return;
    let timer = 0, frame = 0;
    window.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (scrollY <= 8) { bar.classList.remove('gw-modelos--scrolling'); return; }
        bar.classList.add('gw-modelos--scrolling');
        clearTimeout(timer);
        timer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
      });
    }, { passive: true });
  }

  function initNavigation() {
    const menu = document.querySelector('[data-menu]');
    const nav = document.querySelector('.main-nav');
    const cats = document.querySelector('.nav-categories');
    const catToggle = document.querySelector('.nav-category-toggle');
    if (!nav || !menu || !cats || !catToggle) return;
    const close = () => {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú');
      cats.classList.remove('is-open'); catToggle.setAttribute('aria-expanded', 'false');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    catToggle.addEventListener('click', () => {
      const open = !cats.classList.contains('is-open');
      cats.classList.toggle('is-open', open); catToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    const active = new URLSearchParams(location.search).get('cat');
    if (active && Object.hasOwn(categories, active)) nav.querySelectorAll('.category-menu a').forEach(a => { if (new URL(a.href).searchParams.get('cat') === active) a.setAttribute('aria-current', 'page'); });
  }

  function initRail() {
    const rail = document.querySelector('.model-1 [data-featured]');
    if (!rail) return;
    const prev = document.querySelector('[data-rail-prev]'), next = document.querySelector('[data-rail-next]');
    const update = () => {
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 3;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -rail.clientWidth * .76, behavior: reduceMotion ? 'instant' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * .76, behavior: reduceMotion ? 'instant' : 'smooth' }));
    rail.addEventListener('scroll', update, { passive: true });
    let startX = 0, startScroll = 0, dragging = false, suppress = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; startX = e.clientX; startScroll = rail.scrollLeft; dragging = false; });
    rail.addEventListener('pointermove', e => {
      if (!(e.buttons & 1) || e.pointerType === 'touch') return;
      const distance = e.clientX - startX;
      if (Math.abs(distance) < 6 && !dragging) return;
      dragging = true; suppress = true; rail.classList.add('is-dragging'); rail.scrollLeft = startScroll - distance; e.preventDefault();
    });
    const stop = () => { if (dragging) setTimeout(() => { suppress = false; }, 0); dragging = false; rail.classList.remove('is-dragging'); };
    rail.addEventListener('pointerup', stop); rail.addEventListener('pointercancel', stop);
    rail.addEventListener('click', e => { if (suppress) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    update();
    new MutationObserver(update).observe(rail, { childList: true });
  }

  async function initHome() {
    const featured = document.querySelector('[data-featured]');
    const preview = document.querySelector('[data-preview]');
    if (!featured || !preview) return;
    try {
      const first = await products('home', { limit: 6 });
      featured.innerHTML = first.items.map(card).join('') || '<p>Consultanos por WhatsApp para conocer la selección de la tienda.</p>';
      watchReveals(featured);
      const second = first.nextCursor ? await products('home', { limit: 4, cursor: first.nextCursor }) : { items: [] };
      preview.innerHTML = second.items.map(card).join('') || '<p>Muy pronto, más productos para descubrir.</p>';
      watchReveals(preview);
    } catch {
      featured.innerHTML = '<p>No pudimos cargar los productos. Probá de nuevo en unos minutos.</p>';
      preview.innerHTML = '';
    }
  }

  function initCatalog() {
    const grid = document.querySelector('[data-products]');
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    const state = {
      q: (params.get('q') || '').slice(0, 80),
      cat: Object.hasOwn(categories, params.get('cat')) ? params.get('cat') : '',
      sort: ['destacados', 'precio-asc', 'precio-desc'].includes(params.get('orden')) ? params.get('orden') : 'destacados',
      cursor: '', hasMore: true, count: 0, generation: 0, busy: false,
    };
    const form = document.querySelector('[data-catalog-search]');
    const input = form.querySelector('input');
    const sort = document.querySelector('[data-sort]');
    const more = document.querySelector('[data-more]');
    const count = document.querySelector('[data-count]');
    const clear = document.querySelector('[data-clear]');
    input.value = state.q; sort.value = state.sort;
    function sync() {
      document.querySelectorAll('[data-cat]').forEach(button => button.classList.toggle('is-active', button.dataset.cat === state.cat));
      clear.hidden = !state.q && !state.cat && state.sort === 'destacados';
      const url = new URL(location.href);
      state.q ? url.searchParams.set('q', state.q) : url.searchParams.delete('q');
      state.cat ? url.searchParams.set('cat', state.cat) : url.searchParams.delete('cat');
      state.sort !== 'destacados' ? url.searchParams.set('orden', state.sort) : url.searchParams.delete('orden');
      history.replaceState(null, '', url);
    }
    async function next() {
      if (state.busy || !state.hasMore) return;
      state.busy = true; more.hidden = true; grid.setAttribute('aria-busy', 'true');
      const generation = state.generation;
      try {
        const data = await products('catalog', { limit: 16, cursor: state.cursor, q: state.q, cat: state.cat, sort: state.sort });
        if (generation !== state.generation) return;
        if (!state.count && !data.items.length) grid.innerHTML = '<p class="empty-state">No encontramos productos con esos filtros. Probá otra búsqueda o limpiá los filtros.</p>';
        else grid.insertAdjacentHTML('beforeend', data.items.map(card).join(''));
        state.count += data.items.length;
        state.cursor = data.nextCursor || '';
        state.hasMore = data.hasMore;
        count.textContent = `${state.count} producto${state.count === 1 ? '' : 's'} en pantalla${state.hasMore ? ' · hay más para explorar' : ''}`;
        more.hidden = !state.hasMore;
        watchReveals(grid);
      } catch {
        if (generation === state.generation) { count.textContent = 'No pudimos cargar esta página.'; more.hidden = false; }
      } finally {
        if (generation === state.generation) { state.busy = false; grid.removeAttribute('aria-busy'); }
      }
    }
    function reset() {
      state.generation++; state.cursor = ''; state.hasMore = true; state.count = 0; state.busy = false;
      grid.innerHTML = '<p class="loading-state">Cargando productos...</p>';
      count.textContent = 'Buscando productos...'; more.hidden = true;
      sync();
      const generation = state.generation;
      next().then(() => { if (generation === state.generation) grid.querySelector('.loading-state')?.remove(); });
    }
    form.addEventListener('submit', e => { e.preventDefault(); state.q = input.value.trim().slice(0, 80); reset(); });
    document.querySelectorAll('[data-cat]').forEach(button => button.addEventListener('click', () => { state.cat = button.dataset.cat; reset(); }));
    sort.addEventListener('change', () => { state.sort = sort.value; reset(); });
    clear.addEventListener('click', () => { state.q = ''; state.cat = ''; state.sort = 'destacados'; input.value = ''; sort.value = state.sort; reset(); });
    more.addEventListener('click', next);
    reset();
  }

  function initAdmin() {
    const list = document.querySelector('[data-admin-list]');
    if (!list) return;
    const form = document.querySelector('[data-admin-search]');
    const count = document.querySelector('[data-admin-count]');
    const more = document.querySelector('[data-admin-more]');
    const state = { cursor: '', hasMore: true, count: 0, q: '', generation: 0, busy: false };
    async function next() {
      if (state.busy || !state.hasMore) return;
      state.busy = true; more.hidden = true;
      const generation = state.generation;
      try {
        const data = await products('admin', { limit: 10, cursor: state.cursor, q: state.q });
        if (generation !== state.generation) return;
        const rows = data.items.map(p => `<div class="admin-row"><img src="${image(p)}" alt="" width="60" height="60"><div><strong>${safe(p.name)}</strong><small>${safe(categories[p.category])} · ${p.visible ? 'Visible' : 'Oculto'} · ${safe(p.id)}</small></div><strong>${money(p.price)}</strong></div>`).join('');
        if (!state.count && !rows) list.innerHTML = '<p>No encontramos productos con esa búsqueda.</p>';
        else list.insertAdjacentHTML('beforeend', rows);
        state.count += data.items.length; state.cursor = data.nextCursor || ''; state.hasMore = data.hasMore;
        count.textContent = `${state.count} producto${state.count === 1 ? '' : 's'} en pantalla`;
        more.hidden = !state.hasMore;
      } catch { if (generation === state.generation) { count.textContent = 'No pudimos cargar la página.'; more.hidden = false; } }
      finally { if (generation === state.generation) state.busy = false; }
    }
    form.addEventListener('submit', e => {
      e.preventDefault(); state.q = form.querySelector('input').value.trim().slice(0, 80);
      state.generation++; state.cursor = ''; state.hasMore = true; state.count = 0; state.busy = false;
      list.innerHTML = ''; count.textContent = 'Buscando productos...'; next();
    });
    more.addEventListener('click', next);
    next();
  }

  let cart = [];
  try {
    const stored = JSON.parse(localStorage.getItem('santerialasmafias-cart') || '[]');
    if (Array.isArray(stored)) cart = stored.filter(x => x && /^[a-z0-9-]{1,64}$/.test(x.id) && Number.isInteger(x.qty) && x.qty > 0).slice(0, 100);
  } catch { cart = []; }
  const cartDrawer = document.querySelector('[data-cart]');
  const overlay = document.querySelector('[data-overlay]');
  const dialog = document.querySelector('[data-dialog]');
  let cartOpener = null, dialogOpener = null, toastTimer = 0;

  function toast(message) {
    const el = document.querySelector('[data-toast]');
    if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }
  function cartMessage() {
    const lines = ['Hola, quiero consultar por este pedido de Santeria las mafias:', ''];
    cart.forEach(item => lines.push(`• ${item.qty} × ${item.name} — ${money(item.qty * item.price)}`));
    lines.push('', `Total de muestra: ${money(cart.reduce((sum, item) => sum + item.qty * item.price, 0))}`, '¿Me confirman disponibilidad y precio final?');
    return lines.join('\n');
  }
  function renderCart() {
    const qty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = qty; });
    document.querySelector('.float-cart')?.classList.toggle('is-visible', qty > 0 || scrollY > 600);
    const host = document.querySelector('[data-cart-items]');
    if (!host) return;
    host.innerHTML = cart.length ? cart.map((item, i) => `<div class="cart-item"><img src="${safe(item.image)}" alt="" width="65" height="65"><div><strong>${safe(item.name)}</strong><small>${item.qty} × ${money(item.price)}</small><button type="button" data-remove="${i}">Quitar</button></div><strong>${money(item.qty * item.price)}</strong></div>`).join('') : `<p>Tu pedido está vacío. <a href="${catalogFile}">Explorá el catálogo</a> y elegí tus favoritos.</p>`;
    document.querySelector('[data-cart-total]').textContent = money(cart.reduce((sum, item) => sum + item.qty * item.price, 0));
    document.querySelector('[data-checkout]').href = 'https://wa.me/5491169560340?text=' + encodeURIComponent(cartMessage());
  }
  function saveCart() { try { localStorage.setItem('santerialasmafias-cart', JSON.stringify(cart)); } catch {} renderCart(); }
  function addToCart(product, qty = 1) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.qty = Math.min(99, existing.qty + qty);
    else cart.push({ id: product.id, name: product.name, price: product.price, image: image(product), qty });
    saveCart(); toast(`${product.name} se agregó al pedido.`);
  }
  function openCart(opener) {
    if (!cartDrawer) return;
    cartOpener = opener || document.activeElement;
    overlay.hidden = false; cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock'); renderCart(); cartDrawer.focus();
  }
  function closeCart() {
    if (!cartDrawer?.classList.contains('open')) return;
    cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true'); overlay.hidden = true;
    document.body.classList.remove('lock'); cartOpener?.focus();
  }
  function updateProductParam(id) {
    const url = new URL(location.href);
    id ? url.searchParams.set('producto', id) : url.searchParams.delete('producto');
    history.replaceState(null, '', url);
  }
  async function openProduct(id, opener) {
    if (!dialog) return;
    dialogOpener = opener || document.activeElement;
    const product = await productById(id);
    if (!product) { toast('No encontramos ese producto.'); return; }
    const relatedData = await products('catalog', { limit: 4, cat: product.category }).catch(() => ({ items: [] }));
    const related = relatedData.items.filter(p => p.id !== id).slice(0, 3);
    dialog.querySelector('[data-dialog-body]').innerHTML = `<div class="detail-grid"><div class="detail-photo"><img src="${image(product)}" alt="${safe(product.name)}, imagen ilustrativa" width="1254" height="1254"><span>Una selección para tu espacio · Santeria las mafias</span></div><div class="detail-info"><span class="eyebrow">${safe(categories[product.category])} · SANTERIA LAS MAFIAS</span><h2>${safe(product.name)}</h2><p>${safe(product.description)}</p><strong class="detail-price">${money(product.price)}</strong><div class="detail-qty"><label for="detail-qty">Cantidad</label><input id="detail-qty" type="number" min="1" max="99" value="1" inputmode="numeric"></div><button class="button button-primary" type="button" data-confirm-add="${safe(product.id)}">Agregar al pedido <span aria-hidden="true">↗</span></button><p class="demo-note">Producto, imagen y precio ilustrativos. Confirmá disponibilidad y precio final por WhatsApp.</p><div class="related"><strong>También podés explorar</strong>${related.map(p => `<a href="?producto=${safe(p.id)}" data-related="${safe(p.id)}">${safe(p.name)} ↗</a>`).join('') || `<a href="${catalogFile}?cat=${safe(product.category)}">Más de ${safe(categories[product.category])} ↗</a>`}</div></div></div>`;
    dialog.showModal(); document.body.classList.add('lock'); updateProductParam(id);
  }
  function closeProduct() { if (dialog?.open) dialog.close(); }
  dialog?.addEventListener('close', () => {
    if (dialog.open) return;
    document.body.classList.remove('lock'); updateProductParam(''); dialogOpener?.focus();
  });
  dialog?.addEventListener('click', e => { if (e.target === dialog) closeProduct(); });
  document.querySelector('[data-close-dialog]')?.addEventListener('click', closeProduct);
  overlay?.addEventListener('click', closeCart);
  document.querySelector('[data-close-cart]')?.addEventListener('click', closeCart);
  document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => openCart(button)));
  document.querySelector('[data-checkout]')?.addEventListener('click', e => { if (!cart.length) { e.preventDefault(); toast('Primero agregá un producto al pedido.'); } });
  document.addEventListener('click', async e => {
    const remove = e.target.closest('[data-remove]');
    if (remove) { cart.splice(Number(remove.dataset.remove), 1); saveCart(); return; }
    const related = e.target.closest('[data-related]');
    if (related) { e.preventDefault(); closeProduct(); await openProduct(related.dataset.related, related); return; }
    const detail = e.target.closest('[data-product]');
    if (detail) { openProduct(detail.dataset.product, detail); return; }
    const add = e.target.closest('[data-add]');
    if (add) { const product = await productById(add.dataset.add); if (product) addToCart(product); return; }
    const confirm = e.target.closest('[data-confirm-add]');
    if (confirm) {
      const product = await productById(confirm.dataset.confirmAdd);
      if (!product) return;
      const qty = Math.max(1, Math.min(99, Number(dialog.querySelector('#detail-qty').value) || 1));
      closeProduct(); addToCart(product, qty);
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
    if (e.key !== 'Tab' || !cartDrawer?.classList.contains('open')) return;
    const focusable = [...cartDrawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  initModelBar(); initNavigation(); initRail(); initReveals();
  if (page === 'home') initHome();
  if (page === 'catalog') initCatalog();
  if (page === 'admin') initAdmin();
  if (page !== 'admin') {
    renderCart();
    window.addEventListener('scroll', () => document.querySelector('.float-cart')?.classList.toggle('is-visible', cart.length > 0 || scrollY > 600), { passive: true });
    const requested = new URLSearchParams(location.search).get('producto');
    if (requested) openProduct(requested);
  }
})();
