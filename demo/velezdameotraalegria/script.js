(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ================= DATA ================= */
  const CATEGORIAS = [
    { id: 'conjuntos-adultos', nombre: 'Conjuntos Adultos' },
    { id: 'conjuntos-ninos', nombre: 'Conjuntos Niños' },
    { id: 'buzos', nombre: 'Buzos' },
    { id: 'camperas', nombre: 'Camperas' },
  ];

  const PRODUCTOS = [
    {
      id: 1, slug: 'conjunto-rompeviento-hombre', nombre: 'Conjunto Vélez Rompeviento Hombre',
      categoria: 'conjuntos-adultos', publico: 'Hombres', precio: 72000, descuento: 0, stock: 14,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'Conjunto completo de campera y pantalón rompeviento, en tela elastizada liviana con el escudo de Vélez bordado. Pensado para el uso diario, no solo para la cancha.',
      imagenes: ['images/conjunto-masculino-rompeviento_4x5.webp'],
      destacado: true,
    },
    {
      id: 2, slug: 'conjunto-rompeviento-mujer', nombre: 'Conjunto Vélez Rompeviento Mujer',
      categoria: 'conjuntos-adultos', publico: 'Mujeres', precio: 72000, descuento: 10, stock: 11,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'Campera con capucha y pantalón a tono, en rompeviento azul y marino con el escudo de Vélez. Corte cómodo para el uso de todos los días.',
      imagenes: ['images/conjunto-femenino-rompeviento_4x5.webp'],
      destacado: true,
    },
    {
      id: 3, slug: 'conjunto-crop-mujer', nombre: 'Conjunto Vélez Crop Mujer',
      categoria: 'conjuntos-adultos', publico: 'Mujeres', precio: 70000, descuento: 0, stock: 9,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'Campera crop y pantalón oversize en tela rompeviento elastizada, con el escudo de Vélez. El conjunto más pedido para combinar cómodo y con identidad.',
      imagenes: ['images/conjunto-femenino-azul_4x5.webp'],
      destacado: true,
    },
    {
      id: 4, slug: 'conjunto-nino-gorra', nombre: 'Conjunto Vélez + Gorra Niños',
      categoria: 'conjuntos-ninos', publico: 'Niños', precio: 58000, descuento: 0, stock: 16,
      talles: ['4-6', '8-10', '12-14'],
      descripcion: 'Campera, pantalón y gorra a juego con el escudo de Vélez, para que los más chicos anden con los colores puestos todo el año.',
      imagenes: ['images/conjunto-azul-con-gorra_4x5.webp'],
      destacado: true,
    },
    {
      id: 5, slug: 'buzo-canguro', nombre: 'Buzo Canguro Vélez',
      categoria: 'buzos', publico: 'Unisex', precio: 38000, descuento: 15, stock: 20,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'Buzo canguro de algodón con capucha, bolsillo frontal y el escudo de Vélez bordado en el pecho. El básico de guardarropa para cualquier día.',
      imagenes: ['images/buzo-canguro-soft_4x5.webp'],
      destacado: true,
    },
    {
      id: 6, slug: 'campera-rompeviento-hombre', nombre: 'Campera Vélez Rompeviento Hombre',
      categoria: 'camperas', publico: 'Hombres', precio: 42000, descuento: 0, stock: 13,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'La campera rompeviento del conjunto, también por separado. Con capucha, cierre completo y el escudo de Vélez bordado.',
      imagenes: ['images/campera-rompeviento-hombre_4x5.webp'],
      destacado: true,
    },
    {
      id: 7, slug: 'campera-rompeviento-mujer', nombre: 'Campera Vélez Rompeviento Mujer',
      categoria: 'camperas', publico: 'Mujeres', precio: 42000, descuento: 0, stock: 10,
      talles: ['S', 'M', 'L', 'XL'],
      descripcion: 'Campera rompeviento con capucha y el escudo de Vélez, para usar sola o combinada con cualquier pantalón.',
      imagenes: ['images/campera-rompeviento-mujer_4x5.webp'],
      destacado: false,
    },
  ];

  /* ================= HELPERS ================= */
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
  const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
  const getProducto = id => PRODUCTOS.find(p => p.id === id);
  const getCategoria = id => CATEGORIAS.find(c => c.id === id);

  /* ================= CART ================= */
  const Cart = {
    KEY: 'vda_cart',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
    add(producto, qty = 1, talle = null) {
      const items = this.get();
      const existing = items.find(i => i.id === producto.id && i.talle === talle);
      if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
      else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
      this.save(items);
    },
    setQty(id, talle, qty) {
      const items = this.get();
      const it = items.find(i => i.id === id && i.talle === talle);
      if (!it) return;
      const p = getProducto(id);
      it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
      this.save(items);
    },
    remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  };

  const Wishlist = {
    KEY: 'vda_wishlist',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(ids) { localStorage.setItem(this.KEY, JSON.stringify(ids)); },
    has(id) { return this.get().includes(id); },
    toggle(id) {
      const ids = this.get();
      const idx = ids.indexOf(id);
      if (idx === -1) ids.push(id); else ids.splice(idx, 1);
      this.save(ids);
      return ids.includes(id);
    },
  };

  /* ================= TOAST ================= */
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

  /* ================= REVEALS (canonico) ================= */
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
  function revelarNuevos(container) {
    if (!revealsListos) return;
    const els = container.querySelectorAll('[data-animate]:not(.in)');
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    });
  }

  /* ================= PRODUCT CARD ================= */
  function crearProductCard(p) {
    const cat = getCategoria(p.categoria);
    const final = precioFinal(p);
    const card = document.createElement('article');
    card.className = 'prod-card';
    card.dataset.id = p.id;
    card.setAttribute('data-animate', '');
    card.style.opacity = '0';
    card.style.transform = 'translateY(36px)';
    card.innerHTML = `
      <div class="prod-media" data-open-modal>
        <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="1122" height="1402">
        <div class="prod-badges">${p.descuento > 0 ? `<span class="prod-badge">-${p.descuento}%</span>` : ''}</div>
        <button type="button" class="wishlist-btn${Wishlist.has(p.id) ? ' is-active' : ''}" data-wishlist aria-label="Guardar en favoritos">
          <svg viewBox="0 0 24 24" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.8 5.4 4.1c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.4.7 5 4.1 3.4 7.6C19.5 16.4 12 21 12 21Z"/></svg>
        </button>
      </div>
      <div class="prod-info">
        <span class="prod-cat">${esc(cat?.nombre || '')}</span>
        <h3 class="prod-name">${esc(p.nombre)}</h3>
        <div class="prod-price-row">
          <span class="prod-price">${formatearPrecio(final)}</span>
          ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : ''}
        </div>
        <div class="prod-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="prod-add" data-add>Agregar</button>
        </div>
      </div>`;

    card.querySelector('.prod-media').addEventListener('click', () => abrirModal(p));
    card.querySelector('.prod-name').addEventListener('click', () => abrirModal(p));
    card.querySelector('.prod-name').style.cursor = 'pointer';

    const heart = card.querySelector('[data-wishlist]');
    heart.addEventListener('click', e => {
      e.stopPropagation();
      const active = Wishlist.toggle(p.id);
      heart.classList.toggle('is-active', active);
    });

    let qty = 1;
    const qtyEl = card.querySelector('[data-qty]');
    card.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      qty = Math.max(1, Math.min(p.stock ?? 99, qty + Number(btn.dataset.step)));
      qtyEl.textContent = qty;
    }));
    card.querySelector('[data-add]').addEventListener('click', e => {
      e.stopPropagation();
      Cart.add(p, qty, p.talles[0]);
      showToast(`¡Agregado! ${p.nombre} en tu carrito.`);
    });

    return card;
  }

  /* ================= RAIL DESTACADOS ================= */
  function renderRail() {
    const rail = document.getElementById('railDestacados');
    if (!rail) return;
    const destacados = PRODUCTOS.filter(p => p.destacado);
    rail.innerHTML = '';
    destacados.forEach(p => rail.appendChild(crearProductCard(p)));
  }

  function initRailDrag(rail) {
    if (!rail) return;
    let startX = 0, scrollStart = 0, pointerId = null, moved = false;
    const THRESHOLD = 6;

    rail.addEventListener('pointerdown', e => {
      pointerId = e.pointerId;
      startX = e.clientX;
      scrollStart = rail.scrollLeft;
      moved = false;
    });
    rail.addEventListener('pointermove', e => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > THRESHOLD) {
        moved = true;
        rail.classList.add('dragging');
        try { rail.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
      }
      if (moved) rail.scrollLeft = scrollStart - dx;
    });
    const end = e => {
      if (pointerId === null || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;
      if (moved) {
        const killClick = ev => { ev.stopPropagation(); ev.preventDefault(); rail.removeEventListener('click', killClick, true); };
        rail.addEventListener('click', killClick, true);
      }
      try { rail.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      rail.classList.remove('dragging');
      pointerId = null; moved = false;
    };
    rail.addEventListener('pointerup', end);
    rail.addEventListener('pointercancel', end);
    rail.addEventListener('pointerleave', e => { if (pointerId !== null) end(e); });
  }

  function initRailArrows() {
    const rail = document.getElementById('railDestacados');
    const prev = document.getElementById('railPrev');
    const next = document.getElementById('railNext');
    if (!rail || !prev || !next) return;
    const update = () => {
      const inicio = parseFloat(window.getComputedStyle(rail).paddingInlineStart) || 0;
      prev.disabled = rail.scrollLeft <= inicio + 2;
      next.disabled = rail.scrollLeft >= (rail.scrollWidth - rail.clientWidth) - 2;
    };
    const step = () => (rail.querySelector('.prod-card')?.getBoundingClientRect().width || 240) + 18;
    prev.addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: 'smooth' }));
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ================= FILTROS + CATALOGO ================= */
  let filtroState = { categoria: '', publico: '', talle: '', q: '' };
  let catalogoVisibleCount = 16;

  function filtrarProductos() {
    const qNorm = normalizar(filtroState.q.trim());
    return PRODUCTOS.filter(p => {
      if (filtroState.categoria && p.categoria !== filtroState.categoria) return false;
      if (filtroState.publico && p.publico !== filtroState.publico) return false;
      if (filtroState.talle && !p.talles.includes(filtroState.talle)) return false;
      if (qNorm) {
        const cat = getCategoria(p.categoria);
        const haystack = normalizar(`${p.nombre} ${cat?.nombre || ''} ${p.publico} ${p.descripcion}`);
        if (!haystack.includes(qNorm)) return false;
      }
      return true;
    });
  }

  function renderCatalogo(reset) {
    if (reset) catalogoVisibleCount = 16;
    const resultados = filtrarProductos();
    const grid = document.getElementById('catalogoGrid');
    const sinResultados = document.getElementById('sinResultados');
    const verMasBtn = document.getElementById('verMasBtn');
    const countEl = document.getElementById('resultadosCount');
    if (!grid) return;

    countEl.textContent = resultados.length === 1 ? '1 producto encontrado' : `${resultados.length} productos encontrados`;

    if (!resultados.length) {
      grid.innerHTML = '';
      sinResultados.hidden = false;
      verMasBtn.hidden = true;
      return;
    }
    sinResultados.hidden = true;

    const visibles = resultados.slice(0, catalogoVisibleCount);
    grid.innerHTML = '';
    visibles.forEach(p => grid.appendChild(crearProductCard(p)));
    revelarNuevos(grid);

    verMasBtn.hidden = resultados.length <= catalogoVisibleCount;
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function initFiltros() {
    document.querySelectorAll('.chip-group').forEach(group => {
      const key = group.dataset.filter;
      group.addEventListener('click', e => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        group.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === btn));
        filtroState[key] = btn.dataset.value;
        renderCatalogo(true);
      });
    });

    const buscador = document.getElementById('buscador');
    let debounceTimer;
    buscador.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => { filtroState.q = buscador.value; renderCatalogo(true); }, 180);
    });

    function resetFiltros() {
      filtroState = { categoria: '', publico: '', talle: '', q: '' };
      buscador.value = '';
      document.querySelectorAll('.chip-group').forEach(group => {
        group.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('is-active', i === 0));
      });
      renderCatalogo(true);
    }
    document.getElementById('limpiarFiltros').addEventListener('click', resetFiltros);
    document.getElementById('sinResultadosReset').addEventListener('click', resetFiltros);

    const toggle = document.getElementById('filtrosToggle');
    const panel = document.getElementById('filtrosPanel');
    const mqMobile = window.matchMedia('(max-width: 780px)');
    const syncPanel = () => {
      if (mqMobile.matches) { panel.hidden = toggle.getAttribute('aria-expanded') !== 'true'; }
      else { panel.hidden = false; }
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    mqMobile.addEventListener('change', syncPanel);
    syncPanel();

    document.getElementById('verMasBtn').addEventListener('click', () => {
      catalogoVisibleCount += 16;
      renderCatalogo(false);
    });
  }

  function initCategorias() {
    document.querySelectorAll('.cat-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const cat = tile.dataset.cat;
        filtroState.categoria = cat;
        document.querySelectorAll('[data-filter="categoria"] .chip').forEach(c => c.classList.toggle('is-active', c.dataset.value === cat));
        renderCatalogo(true);
        document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ================= MODAL VISTA RAPIDA ================= */
  let lastFocused = null;

  function abrirModal(p) {
    const cat = getCategoria(p.categoria);
    const final = precioFinal(p);
    let talleSel = p.talles[0];
    let qty = 1;
    const body = document.getElementById('modalBody');
    const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);

    body.innerHTML = `
      <div class="modal-media"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="1122" height="1402"></div>
      <div class="modal-info">
        <span class="prod-cat">${esc(cat?.nombre || '')}</span>
        <h3 id="modalProdTitle">${esc(p.nombre)}</h3>
        <div class="modal-price-row">
          <span class="prod-price">${formatearPrecio(final)}</span>
          ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s><span class="prod-badge">-${p.descuento}%</span>` : ''}
        </div>
        <p class="modal-desc">${esc(p.descripcion)}</p>
        <div>
          <span class="prod-cat" style="display:block;margin-bottom:.5rem">Talle</span>
          <div class="modal-talles" data-talles>
            ${p.talles.map((t, i) => `<button type="button" class="talle-btn${i === 0 ? ' is-active' : ''}" data-talle="${esc(t)}">${esc(t)}</button>`).join('')}
          </div>
        </div>
        <div class="modal-actions">
          <div class="stepper" data-stepper>
            <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
            <span data-qty>1</span>
            <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="btn btn-primary" data-add-cart>Agregar al carrito</button>
          <button type="button" class="btn btn-ghost" data-buy-now>Comprar ahora</button>
        </div>
        ${relacionados.length ? `
        <div class="modal-relacionados">
          <h4>También te puede interesar</h4>
          <div class="relacionados-grid">
            ${relacionados.map(r => `<div class="relacionado-card" data-rel="${r.id}" role="button" tabindex="0"><img src="${esc(r.imagenes[0])}" alt="${esc(r.nombre)}" width="300" height="375" loading="lazy"><span>${esc(r.nombre)}</span></div>`).join('')}
          </div>
        </div>` : ''}
      </div>`;

    body.querySelectorAll('[data-talle]').forEach(btn => btn.addEventListener('click', () => {
      talleSel = btn.dataset.talle;
      body.querySelectorAll('[data-talle]').forEach(b => b.classList.toggle('is-active', b === btn));
    }));

    const qtyEl = body.querySelector('[data-qty]');
    body.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      qty = Math.max(1, Math.min(p.stock ?? 99, qty + Number(btn.dataset.step)));
      qtyEl.textContent = qty;
    }));

    body.querySelector('[data-add-cart]').addEventListener('click', () => {
      Cart.add(p, qty, talleSel);
      showToast(`¡Agregado! ${p.nombre} (talle ${talleSel}).`);
    });
    body.querySelector('[data-buy-now]').addEventListener('click', () => {
      Cart.add(p, qty, talleSel);
      cerrarModal();
      abrirCarrito();
    });
    body.querySelectorAll('[data-rel]').forEach(el => {
      const open = () => { const rp = getProducto(Number(el.dataset.rel)); if (rp) abrirModal(rp); };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalProducto');
    backdrop.hidden = false;
    modal.hidden = false;
    modal.setAttribute('aria-labelledby', 'modalProdTitle');
    requestAnimationFrame(() => { backdrop.classList.add('open'); modal.classList.add('open'); });
    document.body.classList.add('no-scroll');
    window.history.replaceState(null, '', `?producto=${encodeURIComponent(p.slug)}`);
    lastFocused = document.activeElement;
    document.getElementById('modalCloseBtn').focus();
  }

  function cerrarModal() {
    const backdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modalProducto');
    if (modal.hidden) return;
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    window.history.replaceState(null, '', location.pathname);
    setTimeout(() => { modal.hidden = true; backdrop.hidden = true; }, 320);
    lastFocused?.focus();
  }

  function initModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', cerrarModal);
    document.getElementById('modalBackdrop').addEventListener('click', cerrarModal);
  }

  /* ================= CARRITO / DRAWER ================= */
  function renderCartDrawer() {
    const items = Cart.get();
    const wrap = document.getElementById('cartItems');
    if (!wrap) return;
    if (!items.length) {
      wrap.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
        <p>Tu carrito está vacío.<br><a href="#tienda" data-close-cart>Ver el catálogo</a></p>
      </div>`;
      wrap.querySelector('[data-close-cart]')?.addEventListener('click', cerrarCarrito);
    } else {
      wrap.innerHTML = items.map(i => {
        const p = getProducto(i.id);
        if (!p) return '';
        return `<div class="cart-item" data-id="${p.id}" data-talle="${esc(i.talle ?? '')}">
          <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="64" height="64">
          <div class="cart-item-info">
            <strong>${esc(p.nombre)}</strong>
            <span>${i.talle ? `Talle ${esc(i.talle)} · ` : ''}${formatearPrecio(precioFinal(p))}</span>
            <div class="stepper" data-stepper style="margin-top:.4rem">
              <button type="button" data-step="-1" aria-label="Restar cantidad">&minus;</button>
              <span>${i.qty}</span>
              <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-remove>Quitar</button>
        </div>`;
      }).join('');

      wrap.querySelectorAll('.cart-item').forEach(el => {
        const pid = Number(el.dataset.id);
        const talle = el.dataset.talle || null;
        const current = Cart.get().find(i => i.id === pid && (i.talle ?? null) === talle);
        if (!current) return;
        el.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
          Cart.setQty(pid, talle, current.qty + Number(btn.dataset.step));
        }));
        el.querySelector('[data-remove]').addEventListener('click', () => Cart.remove(pid, talle));
      });
    }
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
  }

  function abrirCarrito() {
    renderCartDrawer();
    document.getElementById('drawerBackdrop').hidden = false;
    document.getElementById('cartDrawer').hidden = false;
    requestAnimationFrame(() => {
      document.getElementById('drawerBackdrop').classList.add('open');
      document.getElementById('cartDrawer').classList.add('open');
    });
    document.body.classList.add('no-scroll');
    lastFocused = document.activeElement;
    document.getElementById('cartCloseBtn').focus();
  }
  function cerrarCarrito() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    if (drawer.hidden) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 380);
    lastFocused?.focus();
  }

  function initCartDrawer() {
    document.getElementById('cartBtn').addEventListener('click', abrirCarrito);
    document.getElementById('cartFloat').addEventListener('click', abrirCarrito);
    document.getElementById('cartCloseBtn').addEventListener('click', cerrarCarrito);
    document.getElementById('drawerBackdrop').addEventListener('click', cerrarCarrito);
    document.getElementById('checkoutBtn').addEventListener('click', () => {
      if (!Cart.count()) { showToast('Tu carrito está vacío.'); return; }
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
      if (!reduceMotion && typeof confetti === 'function') {
        confetti({ particleCount: 90, spread: 74, origin: { y: 0.65 }, colors: ['#0052CC', '#4C8DFF', '#D4A72C', '#FFFFFF'] });
      }
    });
    document.addEventListener('cart:updated', renderCartDrawer);
  }

  function updateCartBadge() {
    const n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(b => {
      b.textContent = n;
      b.hidden = n === 0;
      b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
    });
  }
  document.addEventListener('cart:updated', updateCartBadge);

  /* ================= FLOTANTES ================= */
  function initFloats() {
    const wsp = document.getElementById('wsp-float');
    const cart = document.getElementById('cartFloat');
    const sync = () => {
      const scrolled = window.scrollY > 600;
      wsp?.classList.toggle('visible', scrolled);
      cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
    };
    window.addEventListener('scroll', sync, { passive: true });
    document.addEventListener('cart:updated', sync);
    sync();
  }

  /* ================= NAV MOBILE (canonico) ================= */
  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (!toggle || !nav) return;
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
    const desktopMq = window.matchMedia('(min-width: 769px)');
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

  /* ================= FOCUS TRAP OVERLAYS ================= */
  function trapFocus(container, e) {
    const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', e => {
    const cartOpen = document.getElementById('cartDrawer')?.classList.contains('open');
    const modalOpen = document.getElementById('modalProducto')?.classList.contains('open');
    if (!cartOpen && !modalOpen) return;
    if (e.key === 'Escape') {
      if (modalOpen) cerrarModal(); else if (cartOpen) cerrarCarrito();
    } else if (e.key === 'Tab') {
      trapFocus(modalOpen ? document.getElementById('modalProducto') : document.getElementById('cartDrawer'), e);
    }
  });

  /* ================= ANTI-COPIA ================= */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  /* ================= POR QUE VDA (sticky chapters) ================= */
  function initPorque() {
    const pasos = document.querySelectorAll('[data-porque-paso]');
    const imgs = document.querySelectorAll('[data-porque-img]');
    if (!pasos.length || !imgs.length) return;
    const activate = i => {
      pasos.forEach((el, idx) => el.classList.toggle('is-on', idx === i));
      imgs.forEach((el, idx) => el.classList.toggle('is-on', idx === i));
    };
    if (!('IntersectionObserver' in window)) { activate(0); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activate(Number(entry.target.dataset.porquePaso));
      });
    }, { threshold: 0.6 });
    pasos.forEach(el => io.observe(el));
  }

  /* ================= HERO: zoom sutil de la foto ================= */
  function initHeroPhotoZoom() {
    const photo = document.getElementById('heroPhoto');
    if (!photo || typeof gsap === 'undefined' || reduceMotion) return;
    gsap.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 1.3, ease: 'power3.out', delay: 0.15 });
  }

  /* ================= DEEP LINK ?producto=slug ================= */
  function checkDeepLink() {
    const params = new URLSearchParams(location.search);
    const slug = params.get('producto');
    if (!slug) return;
    const p = PRODUCTOS.find(x => x.slug === slug);
    if (p) abrirModal(p);
  }

  /* ================= INIT ================= */
  document.addEventListener('DOMContentLoaded', () => {
    renderRail();
    renderCatalogo(true);
    initCategorias();
    initFiltros();
    initModal();
    initCartDrawer();
    initReveals();
    initNav();
    initRailDrag(document.getElementById('railDestacados'));
    initRailArrows();
    initFloats();
    initHeroPhotoZoom();
    initPorque();
    updateCartBadge();
    checkDeepLink();
    const anioEl = document.getElementById('anioActual');
    if (anioEl) anioEl.textContent = new Date().getFullYear();
  });
})();
