/* global PRODUCTOS, RUBROS, CALCULOS, ENVIO_GRATIS_DESDE, gsap, ScrollTrigger */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168396276';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getRubro = id => RUBROS.find(r => r.id === id);

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ── Carrito ── */
const Cart = {
  KEY: 'adf_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 999);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 999) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 999)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

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

/* ── Cards ── */
function cardHTML(p) {
  const pf = precioFinal(p);
  const sinStock = p.stock <= 0;
  const badge = p.descuento > 0
    ? `<span class="card-badge off">-${p.descuento}%</span>`
    : (p.destacado ? '<span class="card-badge">Más vendido</span>' : '');
  const precio = p.descuento > 0
    ? `<strong>${formatearPrecio(pf)}</strong><s>${formatearPrecio(p.precio)}</s>`
    : `<strong>${formatearPrecio(pf)}</strong>`;
  const acciones = sinStock
    ? '<p class="card-sinstock">Sin stock — consultanos por reposición</p>'
    : `<div class="card-acciones">
        <div class="stepper">
          <button type="button" data-menos="${esc(p.id)}" aria-label="Quitar uno">−</button>
          <input type="number" value="1" min="1" max="${p.stock}" data-qty="${esc(p.id)}" aria-label="Cantidad de ${esc(p.nombre)}" inputmode="numeric">
          <button type="button" data-mas="${esc(p.id)}" aria-label="Sumar uno">+</button>
        </div>
        <button class="btn btn-primary" type="button" data-agregar="${esc(p.id)}">Agregar</button>
      </div>`;
  return `<article class="card">
    <div class="card-media" data-ver="${esc(p.id)}" role="button" tabindex="0" aria-label="Ver ${esc(p.nombre)}">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="lazy">${badge}
    </div>
    <div class="card-body">
      <span class="card-rubro">${esc(getRubro(p.rubro)?.label || '')}</span>
      <h3 data-ver="${esc(p.id)}">${esc(p.nombre)}</h3>
      <div class="card-precio">${precio}</div>
      <span class="card-unidad">por ${esc(p.unidad)}</span>
    </div>
    ${acciones}
  </article>`;
}

function qtyDe(id) {
  const input = document.querySelector(`[data-qty="${CSS.escape(id)}"]`);
  return Math.max(1, parseInt(input?.value, 10) || 1);
}

/* ── Destacados ── */
function renderDestacados() {
  const cont = document.getElementById('gridDestacados');
  if (!cont) return;
  cont.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 6).map(cardHTML).join('');
}

/* ── Rail de rubros ── */
function renderRubros() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  rail.innerHTML = RUBROS.map(r => {
    const cuenta = PRODUCTOS.filter(p => p.rubro === r.id).length;
    return `<a class="rubro-card" href="#catalogo" data-rubro="${esc(r.id)}">
      <img src="${esc(r.img)}" alt="${esc(r.label)}" width="1254" height="1254" loading="lazy">
      <span class="cuenta">${cuenta}</span>
      <span class="rubro-card-txt"><h3>${esc(r.label)}</h3><p>${esc(r.bajada)}</p></span>
    </a>`;
  }).join('');
}

function initRail() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  let abajo = false, movido = false, inicioX = 0, inicioScroll = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    abajo = true; movido = false; inicioX = e.clientX; inicioScroll = rail.scrollLeft;
    rail.classList.add('is-drag');
  });
  rail.addEventListener('pointermove', e => {
    if (!abajo) return;
    const delta = e.clientX - inicioX;
    if (Math.abs(delta) > 6) movido = true;
    rail.scrollLeft = inicioScroll - delta;
  });
  const soltar = () => { abajo = false; rail.classList.remove('is-drag'); };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointerleave', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopPropagation(); } }, true);
  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const fin = rail.scrollWidth - rail.clientWidth;
    const adelante = e.deltaY > 0;
    if ((adelante && rail.scrollLeft >= fin - 1) || (!adelante && rail.scrollLeft <= 1)) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });

  rail.addEventListener('click', e => {
    const card = e.target.closest('[data-rubro]');
    if (!card) return;
    e.preventDefault();
    estado.rubro = card.dataset.rubro;
    estado.visibles = PASO;
    sincronizarChips();
    renderCatalogo();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── Catálogo ── */
const PASO = 12;
const estado = { rubro: 'todos', busqueda: '', visibles: PASO };

function filtrar() {
  const q = norm(estado.busqueda.trim());
  return PRODUCTOS.filter(p => {
    if (estado.rubro !== 'todos' && p.rubro !== estado.rubro) return false;
    if (!q) return true;
    const heno = norm([p.nombre, p.desc, p.unidad, getRubro(p.rubro)?.label, (p.specs || []).join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
}

function renderChips() {
  const cont = document.getElementById('chipsRubro');
  if (!cont) return;
  cont.innerHTML = [{ id: 'todos', label: 'Todos' }, ...RUBROS]
    .map(r => `<button type="button" class="chip${r.id === estado.rubro ? ' is-on' : ''}" data-chip="${esc(r.id)}">${esc(r.label)}</button>`)
    .join('');
}

function sincronizarChips() {
  document.querySelectorAll('[data-chip]').forEach(c => c.classList.toggle('is-on', c.dataset.chip === estado.rubro));
}

function renderCatalogo() {
  const cont = document.getElementById('gridCatalogo');
  if (!cont) return;
  const lista = filtrar();
  const visibles = lista.slice(0, estado.visibles);

  cont.innerHTML = visibles.length
    ? visibles.map(cardHTML).join('')
    : `<div class="vacio">
        <b>No encontramos ese material</b>
        <p>Probá con otra palabra o pedinos que lo consigamos.</p>
        <a class="btn btn-primary" href="https://wa.me/${WSP}?text=${encodeURIComponent('Hola ADF, busco un material que no encontré en la web: ')}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      </div>`;

  const contador = document.getElementById('contadorResultados');
  if (contador) {
    contador.textContent = lista.length
      ? `${lista.length} material${lista.length === 1 ? '' : 'es'}${estado.visibles < lista.length ? ` · mostrando ${visibles.length}` : ''}`
      : '';
  }
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = estado.visibles >= lista.length;
  const limpiar = document.getElementById('limpiarFiltros');
  if (limpiar) limpiar.hidden = estado.rubro === 'todos' && !estado.busqueda;

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  renderChips();
  renderCatalogo();

  document.getElementById('chipsRubro')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-chip]');
    if (!chip) return;
    estado.rubro = chip.dataset.chip;
    estado.visibles = PASO;
    sincronizarChips();
    renderCatalogo();
  });

  const buscar = document.getElementById('buscar');
  let t;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.busqueda = buscar.value; estado.visibles = PASO; renderCatalogo(); }, 180);
  });

  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PASO; renderCatalogo(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    estado.rubro = 'todos'; estado.busqueda = ''; estado.visibles = PASO;
    if (buscar) buscar.value = '';
    sincronizarChips(); renderCatalogo();
  });
}

/* ── Acciones sobre productos (delegadas) ── */
function initAcciones() {
  document.addEventListener('click', e => {
    const mas = e.target.closest('[data-mas]');
    const menos = e.target.closest('[data-menos]');
    const agregar = e.target.closest('[data-agregar]');
    const ver = e.target.closest('[data-ver]');

    if (mas || menos) {
      const id = (mas || menos).dataset.mas || (mas || menos).dataset.menos;
      const input = document.querySelector(`[data-qty="${CSS.escape(id)}"]`);
      if (!input) return;
      const p = getProducto(id);
      const actual = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, Math.min(mas ? actual + 1 : actual - 1, p?.stock ?? 999));
      return;
    }
    if (agregar) {
      const p = getProducto(agregar.dataset.agregar);
      if (!p) return;
      Cart.add(p, qtyDe(p.id));
      showToast(`${p.nombre} agregado`);
      return;
    }
    if (ver) {
      abrirProducto(ver.dataset.ver);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const ver = e.target.closest('[data-ver]');
    if (ver && e.target.matches('.card-media')) { e.preventDefault(); abrirProducto(ver.dataset.ver); }
  });
}

/* ── Vista rápida ── */
let ultimoFocoProd = null;
function abrirProducto(id) {
  const p = getProducto(id);
  const dialog = document.getElementById('prodDialog');
  if (!p || !dialog) return;
  ultimoFocoProd = document.activeElement;
  const pf = precioFinal(p);
  document.getElementById('prodImg').src = p.img;
  document.getElementById('prodImg').alt = p.nombre;
  document.getElementById('prodRubro').textContent = getRubro(p.rubro)?.label || '';
  document.getElementById('prodTitulo').textContent = p.nombre;
  document.getElementById('prodUnidad').textContent = `Precio por ${p.unidad} · ${p.stock > 0 ? `${p.stock} disponibles` : 'sin stock'}`;
  document.getElementById('prodDesc').textContent = p.desc;
  document.getElementById('prodSpecs').innerHTML = (p.specs || []).map(s => `<li>${esc(s)}</li>`).join('');
  document.getElementById('prodPrecio').innerHTML = p.descuento > 0
    ? `<strong>${formatearPrecio(pf)}</strong><s>${formatearPrecio(p.precio)}</s>`
    : `<strong>${formatearPrecio(pf)}</strong>`;
  const qty = document.getElementById('prodQty');
  qty.value = 1;
  qty.max = Math.max(1, p.stock);
  dialog.dataset.producto = p.id;
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');
  dialog.showModal();
}

function initProdDialog() {
  const dialog = document.getElementById('prodDialog');
  if (!dialog) return;
  const qty = document.getElementById('prodQty');
  const unlock = () => { document.body.classList.remove('no-scroll'); document.documentElement.classList.remove('no-scroll'); };
  const cerrar = () => {
    if (!dialog.open) return;
    dialog.close();
    unlock();
    ultimoFocoProd?.focus();
  };
  document.getElementById('prodClose')?.addEventListener('click', cerrar);
  dialog.addEventListener('click', e => { if (e.target === dialog) cerrar(); });
  dialog.addEventListener('cancel', cerrar);
  dialog.addEventListener('close', unlock);

  dialog.querySelector('[data-prod-menos]')?.addEventListener('click', () => { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); });
  dialog.querySelector('[data-prod-mas]')?.addEventListener('click', () => {
    const max = parseInt(qty.max, 10) || 999;
    qty.value = Math.min(max, (parseInt(qty.value, 10) || 1) + 1);
  });

  const agregarDesdeModal = abrir => {
    const p = getProducto(dialog.dataset.producto);
    if (!p) return;
    Cart.add(p, Math.max(1, parseInt(qty.value, 10) || 1));
    cerrar();
    if (abrir) abrirCarrito();
    else showToast(`${p.nombre} agregado`);
  };
  document.getElementById('prodAgregar')?.addEventListener('click', () => agregarDesdeModal(false));
  document.getElementById('prodComprar')?.addEventListener('click', () => agregarDesdeModal(true));
}

/* ── Drawer del carrito ── */
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const scrim = document.getElementById('scrim');
  drawer.classList.add('open'); drawer.removeAttribute('inert');
  scrim.hidden = false;
  requestAnimationFrame(() => scrim.classList.add('open'));
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const scrim = document.getElementById('scrim');
  drawer.classList.remove('open'); drawer.setAttribute('inert', '');
  scrim.classList.remove('open');
  setTimeout(() => { scrim.hidden = true; }, 300);
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
}

function renderCarrito() {
  const cont = document.getElementById('cartItems');
  if (!cont) return;
  const items = Cart.get();

  cont.innerHTML = items.length
    ? items.map(i => {
        const p = getProducto(i.id);
        if (!p) return '';
        return `<div class="cart-item">
          <img src="${esc(p.img)}" alt="" width="62" height="62" loading="lazy">
          <div>
            <h4>${esc(p.nombre)}</h4>
            <small>${formatearPrecio(precioFinal(p))} por ${esc(p.unidad)}</small>
            <div class="stepper">
              <button type="button" data-cart-menos="${esc(p.id)}" aria-label="Quitar uno">−</button>
              <input type="number" value="${i.qty}" min="1" max="${p.stock}" data-cart-qty="${esc(p.id)}" aria-label="Cantidad" inputmode="numeric">
              <button type="button" data-cart-mas="${esc(p.id)}" aria-label="Sumar uno">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</div>
            <button type="button" class="cart-quitar" data-cart-quitar="${esc(p.id)}">Quitar</button>
          </div>
        </div>`;
      }).join('')
    : `<div class="cart-vacio">
        <b>Todavía no cargaste nada</b>
        <p>Sumá materiales o usá la calculadora para que te arme el pedido.</p>
        <a class="btn btn-ghost" href="#calculadora" data-cerrar-carrito>Ir a la calculadora</a>
      </div>`;

  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  document.getElementById('cartCheckout').disabled = !items.length;

  const envio = document.getElementById('cartEnvio');
  if (envio) {
    if (!items.length) { envio.innerHTML = ''; envio.className = 'cart-envio'; }
    else if (total >= ENVIO_GRATIS_DESDE) {
      envio.className = 'cart-envio listo';
      envio.innerHTML = `¡Tenés la entrega bonificada! 🎉<div class="cart-barra"><i style="width:100%"></i></div>`;
    } else {
      const falta = ENVIO_GRATIS_DESDE - total;
      envio.className = 'cart-envio';
      envio.innerHTML = `Te faltan <strong>${formatearPrecio(falta)}</strong> para la entrega bonificada<div class="cart-barra"><i style="width:${Math.round(total / ENVIO_GRATIS_DESDE * 100)}%"></i></div>`;
    }
  }
}

function actualizarBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (!badge) return;
  const n = Cart.count();
  badge.textContent = n;
  badge.classList.toggle('has', n > 0);
  badge.classList.remove('bump');
  void badge.offsetWidth;
  if (n > 0) badge.classList.add('bump');
}

function initCarrito() {
  document.getElementById('cartToggle')?.addEventListener('click', abrirCarrito);
  document.getElementById('cartClose')?.addEventListener('click', cerrarCarrito);
  document.getElementById('scrim')?.addEventListener('click', cerrarCarrito);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('cartDrawer')?.classList.contains('open')) cerrarCarrito();
  });

  document.getElementById('cartItems')?.addEventListener('click', e => {
    const mas = e.target.closest('[data-cart-mas]');
    const menos = e.target.closest('[data-cart-menos]');
    const quitar = e.target.closest('[data-cart-quitar]');
    const irCalc = e.target.closest('[data-cerrar-carrito]');
    if (irCalc) { cerrarCarrito(); return; }
    if (quitar) { Cart.remove(quitar.dataset.cartQuitar); return; }
    if (mas || menos) {
      const id = mas ? mas.dataset.cartMas : menos.dataset.cartMenos;
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      Cart.setQty(id, mas ? actual + 1 : actual - 1);
    }
  });
  document.getElementById('cartItems')?.addEventListener('change', e => {
    const input = e.target.closest('[data-cart-qty]');
    if (!input) return;
    Cart.setQty(input.dataset.cartQty, parseInt(input.value, 10) || 1);
  });

  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('cart:updated', () => { actualizarBadge(); renderCarrito(); });
  actualizarBadge();
  renderCarrito();
}

/* ── Calculadora ── */
let calcActual = 'pared';
let calcUltimo = [];

function calcularMateriales(tipo, m2, espesorCm) {
  const receta = CALCULOS[tipo];
  if (!receta) return [];
  const m3 = receta.espesor ? m2 * (espesorCm / 100) : 0;
  return receta.items.map(item => {
    const p = getProducto(item.id);
    if (!p) return null;
    const bruto = item.porM3 != null ? m3 * item.porM3 : m2 * item.porM2;
    const conDesperdicio = bruto * 1.1;
    const paso = item.redondeo || 1;
    const cantidad = Math.max(paso, Math.ceil(conDesperdicio / paso) * paso);
    return { producto: p, cantidad: Number(cantidad.toFixed(paso < 1 ? 1 : 0)) };
  }).filter(Boolean);
}

function renderCalculadora() {
  const receta = CALCULOS[calcActual];
  const m2 = Math.max(1, parseFloat(document.getElementById('calcM2')?.value) || 0);
  const esp = Math.max(1, parseInt(document.getElementById('calcEsp')?.value, 10) || 10);
  const campoEsp = document.querySelector('[data-campo-espesor]');
  if (campoEsp) campoEsp.hidden = !receta.espesor;
  const hint = document.querySelector('[data-calc-hint]');
  if (hint) hint.textContent = receta.hint;

  calcUltimo = calcularMateriales(calcActual, m2, esp);
  const cont = document.getElementById('calcResultado');
  if (!cont) return;

  const total = calcUltimo.reduce((s, r) => s + precioFinal(r.producto) * r.cantidad, 0);
  cont.innerHTML = calcUltimo.map(r => `
    <div class="calc-fila">
      <b>${r.cantidad}</b>
      <span>${esc(r.producto.nombre)}<br><i>${esc(r.producto.unidad)}${r.cantidad !== 1 ? 's' : ''}</i></span>
      <i>${formatearPrecio(precioFinal(r.producto) * r.cantidad)}</i>
    </div>`).join('') +
    `<div class="calc-total"><span>Total estimado</span><strong>${formatearPrecio(total)}</strong></div>`;
}

function initCalculadora() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  renderCalculadora();

  document.querySelectorAll('[data-calc]').forEach(tab => {
    tab.addEventListener('click', () => {
      calcActual = tab.dataset.calc;
      document.querySelectorAll('[data-calc]').forEach(t => {
        t.classList.toggle('is-on', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      renderCalculadora();
    });
  });

  form.addEventListener('input', renderCalculadora);

  document.getElementById('calcAlCarrito')?.addEventListener('click', () => {
    if (!calcUltimo.length) return;
    calcUltimo.forEach(r => Cart.add(r.producto, Math.ceil(r.cantidad)));
    showToast('Materiales calculados agregados al carrito');
    abrirCarrito();
  });
}

/* ── Nav, reveals y movimiento ── */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll'); document.documentElement.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll'); document.documentElement.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const desktop = window.matchMedia('(min-width: 769px)');
  const syncInert = () => {
    if (desktop.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  syncInert();
  desktop.addEventListener('change', syncInert);
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
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
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

/* ── La cota: la pared que se mide y se convierte en lista ── */
function dibujarLadrillos() {
  const g = document.getElementById('cotaLadrillos');
  if (!g || g.childElementCount) return;
  /* El muro va de x 100 a 480 y de y 35 a 285: 12 ladrillos por hilada, 14 hiladas. */
  const x0 = 100, y0 = 35, ancho = 380, alto = 250, cols = 12, filas = 14;
  const w = ancho / cols, h = alto / filas;
  let svg = '';
  for (let f = 0; f < filas; f++) {
    const traba = f % 2 ? -w / 2 : 0;   // hiladas trabadas, como se levanta de verdad
    for (let c = traba ? -1 : 0; c < cols; c++) {
      const x = x0 + c * w + traba;
      const izq = Math.max(x, x0), der = Math.min(x + w, x0 + ancho);
      if (der - izq < 2) continue;
      svg += `<rect x="${izq.toFixed(1)}" y="${(y0 + alto - (f + 1) * h).toFixed(1)}" width="${(der - izq - 1.4).toFixed(1)}" height="${(h - 1.4).toFixed(1)}"/>`;
    }
  }
  g.innerHTML = svg;
}

function initCota() {
  const seccion = document.getElementById('cota');
  if (!seccion) return;
  dibujarLadrillos();

  const pasos = [...seccion.querySelectorAll('.cota-pasos li')];
  const chips = [...seccion.querySelectorAll('.cota-lista li')];
  const nums = [...seccion.querySelectorAll('[data-cota-num]')];

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    seccion.classList.add('is-static');
    pasos.forEach(li => li.classList.add('is-on'));
    nums.forEach(b => { b.textContent = b.dataset.cotaNum; });
    const clip = document.getElementById('cotaClipRect');
    if (clip) { clip.setAttribute('y', '35'); clip.setAttribute('height', '250'); }
    return;
  }

  const largo = el => { const l = el.getTotalLength(); gsap.set(el, { strokeDasharray: l, strokeDashoffset: l }); return l; };
  const muro = document.getElementById('cotaMuro');
  const horiz = document.getElementById('cotaHoriz');
  const vert = document.getElementById('cotaVert');
  [muro, horiz, vert].forEach(largo);
  gsap.set('#cotaLadrillos rect', { opacity: .78 });

  const contador = { v: 0 };
  const marcarPaso = progreso => {
    const activo = Math.min(pasos.length - 1, Math.floor(progreso * pasos.length));
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === activo));
  };
  marcarPaso(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: .55,
      onUpdate: self => marcarPaso(self.progress)
    }
  });

  tl.to(muro, { strokeDashoffset: 0, duration: 1, ease: 'none' })
    .to('#cotaGrupoH', { opacity: 1, duration: .2 }, '>-.15')
    .to(horiz, { strokeDashoffset: 0, duration: .8, ease: 'none' }, '<')
    .from('#cotaHorizTxt', { opacity: 0, y: 8, duration: .3 }, '>-.2')
    .to('#cotaGrupoV', { opacity: 1, duration: .2 })
    .to(vert, { strokeDashoffset: 0, duration: .8, ease: 'none' }, '<')
    .from('#cotaVertTxt', { opacity: 0, duration: .3 }, '>-.2')
    .to('#cotaArea', { opacity: 1, duration: .5, ease: 'power2.out' })
    .from('#cotaArea', { scale: .72, transformOrigin: '290px 158px', duration: .5, ease: 'back.out(1.7)' }, '<')
    .to('#cotaClipRect', { attr: { y: 35, height: 250 }, duration: 1.6, ease: 'none' }, '>.2')
    /* El número cede el lugar: primero cuenta, después deja ver la pared. */
    .to('#cotaArea', { opacity: .22, duration: .5, ease: 'power2.in' }, '<')
    .to(contador, {
      v: 1, duration: 1.6, ease: 'none',
      onUpdate: () => nums.forEach(b => { b.textContent = Math.round(contador.v * Number(b.dataset.cotaNum)); })
    }, '<')
    .to(chips, { opacity: 1, duration: .45, stagger: .12, ease: 'power2.out' }, '<.35')
    .from(chips, { y: 16, duration: .45, stagger: .12, ease: 'power2.out' }, '<')
    .to('.cota-pie', { opacity: 1, duration: .4 }, '>-.1');
}

function initMovimiento() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;

  gsap.from('.hero-copy > *', { y: 26, opacity: 0, duration: 1, stagger: .09, ease: 'power3.out', delay: .1 });
  gsap.fromTo('.hero-bg img', { scale: 1.14 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
  gsap.to('.hero-bg img', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });

  const trust = document.querySelectorAll('.trust-inner div');
  if (trust.length) {
    gsap.from(trust, {
      y: 18, opacity: 0, duration: .7, stagger: .09, ease: 'power2.out',
      scrollTrigger: { trigger: '.trust', start: 'top 88%' }
    });
  }

  const entregaImg = document.querySelector('.entrega img');
  if (entregaImg) {
    gsap.fromTo(entregaImg, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.entrega', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  }

  const panel = document.querySelector('.calc-panel');
  if (panel) {
    gsap.from(panel, {
      y: 34, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.calc', start: 'top 78%' }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  renderDestacados();
  renderRubros();
  initRail();
  initCatalogo();
  initAcciones();
  initProdDialog();
  initCarrito();
  initCalculadora();
  initNav();
  initWspFloat();
  initReveals();
  initCota();
  initMovimiento();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 180); }, { passive: true });
  }
});
