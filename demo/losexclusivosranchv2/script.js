(function () {
  'use strict';

  const BASE = location.pathname.includes('/producto/') ? '../' : '';
  const WA = window.WHATSAPP || '5491100000000';
  const ENVIO_GRATIS = window.ENVIO_GRATIS_DESDE || 25000;
  const PRODUCTOS = window.PRODUCTOS || [];
  const CATEGORIAS = window.CATEGORIAS || [];

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
  const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
  const getProducto = id => PRODUCTOS.find(p => p.id === id);
  const catName = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  // ───────── Cart ─────────
  const Cart = {
    KEY: 'losexclusivosranchv3_cart',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
    add(producto, qty = 1) {
      const items = this.get();
      const existing = items.find(i => i.id === producto.id);
      if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
      else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
      this.save(items);
    },
    setQty(id, qty) {
      const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
      const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
    },
    remove(id) { this.save(this.get().filter(i => i.id !== id)); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  };
  window.Cart = Cart; window.LERstore = { esc, formatearPrecio, precioFinal, getProducto, catName, productCard, wireProductGrid, BASE, waLink };

  // ───────── Wishlist ─────────
  const Wish = {
    KEY: 'losexclusivosranchv3_wishlist',
    get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
    has(id) { return this.get().includes(id); },
    toggle(id) { const l = this.get(); const i = l.indexOf(id); if (i >= 0) l.splice(i, 1); else l.push(id); localStorage.setItem(this.KEY, JSON.stringify(l)); return this.has(id); },
  };

  // ───────── Toast ─────────
  function showToast(msg) {
    let wrap = $('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.setAttribute('role', 'status');
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3000);
  }
  window.showToast = showToast;

  // ───────── Card template ─────────
  function productCard(p) {
    const pf = precioFinal(p);
    const badge = p.descuento > 0
      ? `<span class="sello sello--red">-${p.descuento}%</span>`
      : (p.badge ? `<span class="sello${p.badge === 'Nuevo' ? ' sello--green' : ''}">${esc(p.badge)}</span>` : '');
    const faved = Wish.has(p.id) ? ' active' : '';
    return `<article class="card" data-animate style="opacity:0;transform:translateY(30px)">
      <div class="card__media">
        <div class="card__badges">${badge}</div>
        <button class="card__fav${faved}" data-fav="${p.id}" aria-label="Guardar ${esc(p.nombre)}"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg></button>
        <a href="${BASE}producto/index.html?id=${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${BASE}${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy"></a>
      </div>
      <div class="card__body">
        <span class="card__cat">${esc(catName(p.categoria))}</span>
        <h3 class="card__name"><a href="${BASE}producto/index.html?id=${p.id}">${esc(p.nombre)}</a></h3>
        <span class="card__unit">${esc(p.unidad)}</span>
        <div class="card__price"><span class="now">${formatearPrecio(pf)}</span>${p.descuento > 0 ? `<span class="was">${formatearPrecio(p.precio)}</span>` : ''}</div>
        <div class="card__actions">
          <div class="qty" data-qty>
            <button type="button" data-dec aria-label="Restar cantidad">−</button>
            <input type="text" inputmode="numeric" value="1" data-qty-input aria-label="Cantidad">
            <button type="button" data-inc aria-label="Sumar cantidad">+</button>
          </div>
          <div class="card__btns">
            <button class="btn btn--sm btn--add" data-add="${p.id}">Agregar</button>
            <button class="btn btn--sm btn--buy" data-buy="${p.id}">Comprar ahora</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function readQty(card) {
    const input = $('[data-qty-input]', card);
    const v = parseInt((input?.value || '1').replace(/\D/g, ''), 10);
    return Math.max(1, isNaN(v) ? 1 : v);
  }

  function wireProductGrid(grid) {
    if (!grid || grid.dataset.wired) return;
    grid.dataset.wired = '1';
    grid.addEventListener('click', e => {
      const card = e.target.closest('.card'); if (!card) return;
      const inc = e.target.closest('[data-inc]');
      const dec = e.target.closest('[data-dec]');
      const input = $('[data-qty-input]', card);
      if (inc) { input.value = readQty(card) + 1; return; }
      if (dec) { input.value = Math.max(1, readQty(card) - 1); return; }
      const addBtn = e.target.closest('[data-add]');
      const buyBtn = e.target.closest('[data-buy]');
      const favBtn = e.target.closest('[data-fav]');
      if (favBtn) {
        const on = Wish.toggle(favBtn.dataset.fav);
        favBtn.classList.toggle('active', on);
        showToast(on ? '💛 Guardado en tus favoritos' : 'Quitado de favoritos');
        return;
      }
      if (addBtn) {
        const p = getProducto(addBtn.dataset.add); if (!p) return;
        Cart.add(p, readQty(card));
        addBtn.textContent = '¡Agregado!'; addBtn.classList.add('added');
        setTimeout(() => { addBtn.textContent = 'Agregar'; addBtn.classList.remove('added'); }, 1400);
        showToast(`${p.nombre} · sumado al pedido`);
      }
      if (buyBtn) {
        const p = getProducto(buyBtn.dataset.buy); if (!p) return;
        Cart.add(p, readQty(card));
        openCart();
      }
    });
    $$('[data-qty-input]', grid).forEach(i => i.addEventListener('input', () => { i.value = i.value.replace(/\D/g, ''); }));
  }

  // ───────── Home renders ─────────
  function renderCats() {
    const grid = $('#cats-grid'); if (!grid) return;
    grid.innerHTML = CATEGORIAS.map(c => `
      <a class="cat-card" href="catalogo.html?cat=${c.id}" data-animate style="opacity:0;transform:translateY(28px)">
        <img src="${c.img}" alt="${esc(c.nombre)}" width="1200" height="1200" loading="lazy">
        <span class="cat-card__arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        <span class="cat-card__body"><b>${esc(c.nombre)}</b><span>${esc(c.desc)}</span></span>
      </a>`).join('');
  }

  function renderFeatured() {
    const grid = $('#featured-grid'); if (!grid) return;
    const feats = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
    grid.innerHTML = feats.map(productCard).join('');
    wireProductGrid(grid);
  }

  // ───────── Cart drawer ─────────
  const overlay = $('#overlay');
  const drawer = $('#cart-drawer');
  let lastFocus = null;

  function openCart() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    overlay.classList.add('open'); drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();
    renderCart();
    setTimeout(() => $('#cart-close')?.focus(), 60);
    document.addEventListener('keydown', onDrawerKey);
  }
  function closeCart() {
    overlay.classList.remove('open'); drawer.classList.remove('open');
    document.body.style.overflow = '';
    window.lenis?.start();
    document.removeEventListener('keydown', onDrawerKey);
    lastFocus?.focus?.();
  }
  function onDrawerKey(e) {
    if (e.key === 'Escape') { closeCart(); return; }
    if (e.key === 'Tab') {
      const f = $$('button, a, input', drawer).filter(el => !el.disabled && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function renderCart() {
    const items = Cart.get();
    const box = $('#cart-items'); const foot = $('#cart-foot');
    if (!box) return;
    if (!items.length) {
      box.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <b>Tu pedido está vacío</b>
        <span>Sumá fiambres, quesos o pollo y armá tu picada.</span>
        <div style="margin-top:1.2rem"><a class="btn btn--primary" href="${BASE}catalogo.html">Ver catálogo</a></div>
      </div>`;
      foot.hidden = true;
      $('#ship-msg').style.display = 'none';
      return;
    }
    $('#ship-msg').style.display = '';
    box.innerHTML = items.map(i => {
      const p = getProducto(i.id); if (!p) return '';
      const pf = precioFinal(p);
      return `<div class="cart-item">
        <img src="${BASE}${p.img}" alt="${esc(p.nombre)}" width="64" height="64">
        <div>
          <div class="cart-item__name">${esc(p.nombre)}</div>
          <div class="cart-item__price">${formatearPrecio(pf)} <span style="color:var(--color-text-muted);font-weight:400">· ${esc(p.unidad)}</span></div>
          <div class="qty" data-cart-qty="${p.id}">
            <button type="button" data-cdec aria-label="Restar">−</button>
            <input type="text" inputmode="numeric" value="${i.qty}" data-cqty aria-label="Cantidad">
            <button type="button" data-cinc aria-label="Sumar">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-display);font-weight:600;color:var(--color-ink)">${formatearPrecio(pf * i.qty)}</div>
          <button class="cart-item__remove" data-cremove="${p.id}">Quitar</button>
        </div>
      </div>`;
    }).join('');
    foot.hidden = false;
    $('#cart-total').textContent = formatearPrecio(Cart.total());
    updateShipBar();
  }

  function updateShipBar() {
    const total = Cart.total();
    const fill = $('#ship-bar-fill'); const text = $('#ship-text');
    if (!fill || !text) return;
    if (total >= ENVIO_GRATIS) {
      text.innerHTML = '¡Tenés <b>envío gratis</b>! 🎉';
      fill.style.width = '100%';
    } else {
      const falta = ENVIO_GRATIS - total;
      text.innerHTML = `Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis`;
      fill.style.width = Math.min(100, (total / ENVIO_GRATIS) * 100) + '%';
    }
  }

  function wireCartDrawer() {
    $('#cart-toggle')?.addEventListener('click', openCart);
    $('#cart-close')?.addEventListener('click', closeCart);
    overlay?.addEventListener('click', closeCart);
    $('#cart-items')?.addEventListener('click', e => {
      const rem = e.target.closest('[data-cremove]');
      const inc = e.target.closest('[data-cinc]');
      const dec = e.target.closest('[data-cdec]');
      if (rem) { Cart.remove(rem.dataset.cremove); return; }
      const wrap = e.target.closest('[data-cart-qty]'); if (!wrap) return;
      const id = wrap.dataset.cartQty; const cur = Cart.get().find(i => i.id === id)?.qty || 1;
      if (inc) Cart.setQty(id, cur + 1);
      if (dec) Cart.setQty(id, cur - 1);
    });
    $('#cart-items')?.addEventListener('change', e => {
      const input = e.target.closest('[data-cqty]'); if (!input) return;
      const wrap = input.closest('[data-cart-qty]');
      const v = parseInt(input.value.replace(/\D/g, ''), 10);
      Cart.setQty(wrap.dataset.cartQty, isNaN(v) ? 1 : v);
    });
    $('#cart-checkout')?.addEventListener('click', () => {
      const items = Cart.get(); if (!items.length) return;
      const lines = items.map(i => { const p = getProducto(i.id); return p ? `• ${i.qty}x ${p.nombre} — ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean);
      const msg = `¡Hola Los Exclusivos Ranch! 👋 Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${formatearPrecio(Cart.total())}\n\n¿Me confirman disponibilidad y envío? ¡Gracias!`;
      window.open(waLink(msg), '_blank', 'noopener');
    });
  }

  function updateCartCount() {
    const n = Cart.count();
    const el = $('#cart-count'); if (!el) return;
    el.textContent = n; el.hidden = n === 0;
    if (n > 0) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }

  // ───────── WhatsApp links ─────────
  function wireWhatsApp() {
    const generic = waLink('¡Hola Los Exclusivos Ranch! 👋 Quería hacer una consulta y un pedido 🛒');
    ['#hero-wsp', '#final-wsp', '#wsp-float', '#footer-wsp', '#footer-wsp2'].forEach(sel => { const el = $(sel); if (el) el.href = generic; });
    const fl = $('#wsp-float');
    if (fl) window.addEventListener('scroll', () => { fl.classList.toggle('visible', window.scrollY > 600); }, { passive: true });
  }

  // ───────── Mobile nav ─────────
  function wireMobileNav() {
    const nav = $('#mobile-nav'); const toggle = $('#menu-toggle'); const close = $('#mobile-nav-close');
    if (!nav || !toggle) return;
    const open = () => { nav.classList.add('open'); overlay.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    const hide = () => { nav.classList.remove('open'); if (!drawer?.classList.contains('open')) overlay.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    toggle.addEventListener('click', open);
    close?.addEventListener('click', hide);
    $$('a', nav).forEach(a => a.addEventListener('click', hide));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) hide(); });
    overlay?.addEventListener('click', () => { if (nav.classList.contains('open')) hide(); });
  }

  // ───────── Animations ─────────
  function initAnimations() {
    const gsapOK = typeof gsap !== 'undefined';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gsapOK || reduced) {
      $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    // Hero: entrada en capas al cargar
    const heroEls = $$('.hero [data-animate]');
    if (heroEls.length) gsap.to(heroEls, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.15 });

    // Resto: reveal al scroll con cascada
    const rest = $$('[data-animate]').filter(el => !el.closest('.hero'));
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.batch(rest, {
        start: 'top 86%',
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true }),
      });
      rest.forEach(el => { if (!el.style.filter) el.style.filter = 'blur(6px)'; });
      window.addEventListener('load', () => ScrollTrigger.refresh());
    } else {
      rest.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }

  // ───────── Init ─────────
  document.addEventListener('DOMContentLoaded', () => {
    $('#year') && ($('#year').textContent = new Date().getFullYear());
    renderCats();
    renderFeatured();
    wireCartDrawer();
    wireWhatsApp();
    wireMobileNav();
    updateCartCount();
    document.addEventListener('cart:updated', () => { updateCartCount(); if (drawer?.classList.contains('open')) renderCart(); });
    initAnimations();
  });
})();
