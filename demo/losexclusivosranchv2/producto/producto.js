(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const store = window.LERstore;
    if (!store) return;
    const { esc, formatearPrecio, precioFinal, getProducto, catName, productCard, wireProductGrid } = store;
    const PRODUCTOS = window.PRODUCTOS || [];

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const p = id ? getProducto(id) : null;

    const foundBlock = $('#product-found');
    const notFoundBlock = $('#product-notfound');

    if (!p) {
      foundBlock.remove();
      notFoundBlock.hidden = false;
      return;
    }

    notFoundBlock.remove();

    // ── meta / título ──
    document.title = `${p.nombre} — Los Exclusivos Ranch`;
    $('#page-desc')?.setAttribute('content', p.desc || p.nombre);

    // ── JSON-LD Product ──
    const pf = precioFinal(p);
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nombre,
      image: `https://gokywebs.com/demo/losexclusivosranch/${p.img}`,
      description: p.desc || p.nombre,
      brand: { '@type': 'Brand', name: p.marca || 'Los Exclusivos Ranch' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        price: pf,
        availability: (p.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };
    const ldEl = $('#product-jsonld');
    if (ldEl) ldEl.textContent = JSON.stringify(jsonld);

    // ── breadcrumb ──
    $('#breadcrumb').innerHTML = `
      <a href="../index.html">Inicio</a><span class="sep">/</span>
      <a href="../catalogo.html">Catálogo</a><span class="sep">/</span>
      <a href="../catalogo.html?cat=${p.categoria}">${esc(catName(p.categoria))}</a><span class="sep">/</span>
      <span class="current">${esc(p.nombre)}</span>`;

    // ── render principal ──
    $('#detail-img').src = `../${p.img}`;
    $('#detail-img').alt = p.nombre;
    $('#detail-cat').textContent = catName(p.categoria);
    $('#detail-name').textContent = p.nombre;
    $('#detail-unit').textContent = p.unidad;
    $('#detail-price-now').textContent = formatearPrecio(pf);
    if (p.descuento > 0) {
      const was = $('#detail-price-was'); was.textContent = formatearPrecio(p.precio); was.hidden = false;
    }
    $('#detail-desc').textContent = p.desc || '';

    const badges = $('#detail-badges');
    let badgeHtml = '';
    if (p.descuento > 0) badgeHtml += `<span class="sello sello--red">-${p.descuento}%</span>`;
    else if (p.badge) badgeHtml += `<span class="sello${p.badge === 'Nuevo' ? ' sello--green' : ''}">${esc(p.badge)}</span>`;
    badges.innerHTML = badgeHtml;

    // ── favorito ──
    const WISH_KEY = 'losexclusivosranchv3_wishlist';
    const getWish = () => { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch { return []; } };
    const favBtn = $('#detail-fav');
    const syncFav = () => favBtn.classList.toggle('active', getWish().includes(p.id));
    syncFav();
    favBtn.addEventListener('click', () => {
      const list = getWish(); const i = list.indexOf(p.id);
      if (i >= 0) list.splice(i, 1); else list.push(p.id);
      localStorage.setItem(WISH_KEY, JSON.stringify(list));
      syncFav();
      window.showToast?.(i >= 0 ? 'Quitado de favoritos' : '💛 Guardado en tus favoritos');
    });

    // ── cantidad + acciones ──
    const qtyWrap = $('#detail-actions');
    const qtyInput = $('[data-qty-input]', qtyWrap);
    const readQty = () => {
      const v = parseInt((qtyInput.value || '1').replace(/\D/g, ''), 10);
      return Math.max(1, isNaN(v) ? 1 : v);
    };
    qtyWrap.addEventListener('click', e => {
      if (e.target.closest('[data-inc]')) qtyInput.value = readQty() + 1;
      if (e.target.closest('[data-dec]')) qtyInput.value = Math.max(1, readQty() - 1);
    });
    qtyInput.addEventListener('input', () => { qtyInput.value = qtyInput.value.replace(/\D/g, ''); });

    $('#detail-add').addEventListener('click', () => {
      window.Cart.add(p, readQty());
      const btn = $('#detail-add');
      btn.textContent = '¡Agregado!'; btn.classList.add('added');
      setTimeout(() => { btn.textContent = 'Agregar al carrito'; btn.classList.remove('added'); }, 1400);
      window.showToast?.(`${p.nombre} · sumado al pedido`);
    });
    $('#detail-buy').addEventListener('click', () => {
      window.Cart.add(p, readQty());
      $('#cart-toggle')?.click();
    });

    // ── sticky add-to-cart mobile ──
    const sticky = $('#sticky-add');
    if (sticky) {
      $('#sticky-name').textContent = p.nombre;
      $('#sticky-price').textContent = formatearPrecio(pf);
      $('#sticky-add-btn').addEventListener('click', () => {
        window.Cart.add(p, readQty());
        window.showToast?.(`${p.nombre} · sumado al pedido`);
      });
      const trigger = $('#detail-actions');
      if (trigger && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => sticky.classList.toggle('visible', !entry.isIntersecting));
        }, { threshold: 0 });
        io.observe(trigger);
      }
    }

    // Las cards de productCard() traen data-animate con opacity:0 inline. El
    // ScrollTrigger.batch de script.js#initAnimations() ya corrió sobre el DOM
    // que existía al cargar la página, así que estas grillas (insertadas ahora)
    // necesitan su propio reveal explícito o quedarían invisibles para siempre.
    const gsapOK = typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function revealGrid(grid) {
      if (!grid) return;
      const cards = $$('.card', grid);
      if (!cards.length) return;
      if (gsapOK) {
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.from(cards, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', stagger: 0.08 });
      } else {
        cards.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      }
    }

    // ── relacionados (misma categoría) ──
    const related = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
    const relatedGrid = $('#related-grid');
    const relatedSection = $('#related-section');
    if (related.length) {
      relatedGrid.innerHTML = related.map(productCard).join('');
      wireProductGrid(relatedGrid);
      revealGrid(relatedGrid);
    } else if (relatedSection) {
      relatedSection.hidden = true;
    }

    // ── vistos recientemente ──
    const RECENT_KEY = 'losexclusivosranchv3_vistos';
    const getRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; } };
    let recent = getRecent().filter(rid => rid !== p.id);
    recent.unshift(p.id);
    recent = recent.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));

    const recentIds = recent.filter(rid => rid !== p.id);
    const recentSection = $('#recent-section');
    const recentGrid = $('#recent-grid');
    if (recentIds.length && recentSection) {
      const recentProducts = recentIds.map(rid => getProducto(rid)).filter(Boolean);
      if (recentProducts.length) {
        recentGrid.innerHTML = recentProducts.map(productCard).join('');
        wireProductGrid(recentGrid);
        revealGrid(recentGrid);
        recentSection.hidden = false;
      }
    }

    if (typeof ScrollTrigger !== 'undefined') {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
  });
})();
