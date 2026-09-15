(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const Shop = window.PinturaShop;
    if (!Shop) return;
    const { PRODUCTOS, CATEGORIAS, getProducto, precioFinal, formatearPrecio, esc, Cart, showToast, initQtyControls, initCartActions, BASE } = Shop;

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const pr = id ? getProducto(id) : null;
    const root = document.getElementById('producto-root');
    const notFound = document.getElementById('no-encontrado');
    const relSection = document.getElementById('relacionados-section');

    if (!pr) {
      root.remove();
      notFound.hidden = false;
      return;
    }

    const final = precioFinal(pr);

    document.getElementById('page-title').textContent = pr.nombre + ' — Pinturería Litoral';
    document.getElementById('page-desc').setAttribute('content', pr.desc.slice(0, 150));
    document.getElementById('og-title').setAttribute('content', pr.nombre + ' — Pinturería Litoral');
    document.getElementById('og-image').setAttribute('content', `../images/${pr.imagen}`);
    document.title = pr.nombre + ' — Pinturería Litoral';

    document.getElementById('ld-product').textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: pr.nombre,
      image: [`https://pinturerialitoral.com/images/${pr.imagen}`],
      description: pr.desc,
      brand: { '@type': 'Brand', name: 'Pinturería Litoral' },
      offers: {
        '@type': 'Offer',
        url: `https://pinturerialitoral.com/producto/index.html?id=${pr.id}`,
        priceCurrency: 'ARS',
        price: String(final),
        availability: pr.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition'
      }
    });

    root.innerHTML = `
      <section class="container" aria-label="Detalle del producto">
        <p class="crumbs"><a href="../index.html">Inicio</a> / <a href="../catalogo.html?cat=${encodeURIComponent(pr.categoria)}">${esc(CATEGORIAS[pr.categoria] || '')}</a> / ${esc(pr.nombre)}</p>
        <div class="producto-layout">
          <div class="producto-media">
            <div class="ph" style="--pc-bg:transparent;background:${({interior:'#EAF3EE',exterior:'#DCEEF3',esmaltes:'#FBEFE3',impermeabilizantes:'#E4F1EC',preparacion:'#F1EDE3',accesorios:'#EAF3EE'})[pr.categoria] || '#EAF3EE'}">
              <img src="../images/${pr.imagen}" width="1200" height="1200" alt="${esc(pr.nombre)}" style="mix-blend-mode:multiply" id="producto-img">
            </div>
          </div>
          <div class="producto-info" data-animate="up" style="transform:translateY(30px);opacity:0">
            <p class="kicker">${esc(CATEGORIAS[pr.categoria] || '')}</p>
            <h1>${esc(pr.nombre)}</h1>
            <span class="producto-uso">${esc(pr.uso)}</span>
            <div class="producto-price-row">
              <span class="price-now">${formatearPrecio(final)}</span>
              ${pr.descuento > 0 ? `<s class="price-was">${formatearPrecio(pr.precio)}</s><span class="product-badge" style="position:static">-${pr.descuento}%</span>` : ''}
            </div>
            <p class="producto-desc">${esc(pr.desc)}</p>
            <p class="producto-stock">${pr.stock > 0 ? `Stock disponible (${pr.stock} unidades)` : 'Sin stock por el momento'}</p>
            <div class="producto-actions">
              <div class="qty-row">
                <div class="qty-control" data-qty-for="${pr.id}">
                  <button type="button" data-qty-dec aria-label="Restar cantidad">&minus;</button>
                  <input type="text" inputmode="numeric" value="1" aria-label="Cantidad" readonly>
                  <button type="button" data-qty-inc aria-label="Sumar cantidad">+</button>
                </div>
              </div>
              <div class="btns">
                <button type="button" class="btn btn-ghost" data-add="${pr.id}">Agregar al carrito</button>
                <button type="button" class="btn btn-primary" data-buy="${pr.id}">Comprar ahora</button>
              </div>
            </div>
          </div>
        </div>
      </section>`;

    const infoEl = root.querySelector('.producto-info');
    if (infoEl) {
      if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.to(infoEl, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', delay: .1 });
      } else {
        infoEl.style.opacity = 1; infoEl.style.transform = 'none';
      }
    }

    initQtyControls(root);
    initCartActions(root);

    const relacionados = PRODUCTOS.filter(p => p.categoria === pr.categoria && p.id !== pr.id).slice(0, 4);
    if (relacionados.length) {
      document.getElementById('relacionados-grid').innerHTML = relacionados.map(p => Shop.productCardHTML(p)).join('');
      initQtyControls(document.getElementById('relacionados-grid'));
      relSection.hidden = false;
    }

    // vistos recientemente
    try {
      const KEY = 'pinturerialitoral_vistos';
      let vistos = JSON.parse(sessionStorage.getItem(KEY)) || [];
      vistos = vistos.filter(v => v !== pr.id);
      vistos.unshift(pr.id);
      vistos = vistos.slice(0, 8);
      sessionStorage.setItem(KEY, JSON.stringify(vistos));
    } catch (e) {}

    // sticky add-to-cart mobile
    const stickyBar = document.getElementById('sticky-atc');
    const stickyPrecio = document.getElementById('sticky-precio');
    const stickyAdd = document.getElementById('sticky-add');
    if (stickyBar) {
      stickyPrecio.textContent = formatearPrecio(final);
      const btns = root.querySelector('.producto-actions .btns');
      if (btns && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => stickyBar.classList.toggle('visible', !entry.isIntersecting));
        }, { threshold: 0 });
        io.observe(btns);
      }
      stickyAdd.addEventListener('click', () => {
        const qtyInput = document.querySelector(`[data-qty-for="${CSS.escape(pr.id)}"] input`);
        const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
        Cart.add(pr, qty);
        showToast('¡Agregado! Tu carrito te espera.');
      });
    }

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
})();
