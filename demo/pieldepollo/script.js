document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492646200439';
const ENVIO_GRATIS_DESDE = 35000;

const CATEGORIAS = {
  frescos: 'Frescos',
  deshuesados: 'Deshuesados',
  listos: 'Listos para cocinar',
  combos: 'Combos'
};

const PRODUCTOS = [
  {
    id: 'pollo-entero',
    nombre: 'Pollo entero fresco',
    cat: 'frescos',
    unidad: 'kg',
    precio: 4900,
    descuento: 0,
    badge: 'El más pedido',
    peso: 'Pieza de 2 a 2,4 kg',
    desc: 'Pollo de granja faenado el mismo día. Llega limpio, sin menudos, listo para el horno o la parrilla. Si lo querés trozado o abierto a la mariposa, lo preparamos sin cargo.',
    optLabel: 'Cómo lo cortamos',
    opciones: ['Entero', 'Trozado en 8', 'A la mariposa'],
    imgs: ['images/pollo-entero-fresco_1254x1254.webp', 'images/recorte-pollo-entero_900x551.webp'],
    dim: [1254, 1254],
    tags: ['pollo', 'entero', 'asado', 'horno', 'parrilla']
  },
  {
    id: 'pata-muslo',
    nombre: 'Pata muslo',
    cat: 'frescos',
    unidad: 'kg',
    precio: 5200,
    descuento: 0,
    badge: '',
    peso: 'Unidades de 300 a 380 g',
    desc: 'El corte del horno del domingo: jugoso, con piel y hueso. También te lo deshuesamos para rellenar o hacer al disco.',
    optLabel: 'Cómo lo cortamos',
    opciones: ['Con hueso', 'Deshuesada', 'Separada en pata y muslo'],
    imgs: ['images/pata-muslo-de-pollo_1254x1254.webp', 'images/recorte-pata-muslo_900x540.webp'],
    dim: [1254, 1254],
    tags: ['pata', 'muslo', 'horno', 'guiso']
  },
  {
    id: 'alitas',
    nombre: 'Alitas de pollo',
    cat: 'frescos',
    unidad: 'kg',
    precio: 5400,
    descuento: 15,
    badge: '',
    peso: 'Aprox. 14 alitas por kilo',
    desc: 'Frescas del día, ideales para la picada, el horno o la freidora de aire. Las separamos en bandeja y alón si las vas a marinar.',
    optLabel: 'Cómo lo cortamos',
    opciones: ['Enteras', 'Separadas en bandeja y alón'],
    imgs: ['images/alitas-de-pollo_1254x1254.webp', 'images/recorte-alitas_900x526.webp'],
    dim: [1254, 1254],
    tags: ['alitas', 'alas', 'picada', 'freidora']
  },
  {
    id: 'pechuga',
    nombre: 'Pechuga sin hueso',
    cat: 'deshuesados',
    unidad: 'kg',
    precio: 8900,
    descuento: 0,
    badge: 'Sin piel',
    peso: 'Suprema de 220 a 280 g',
    desc: 'Pechuga limpia, sin hueso ni piel, prolija para milanesa casera, wok o plancha. La cortamos en filetes finos o en cubos según lo que vayas a cocinar.',
    optLabel: 'Cómo lo cortamos',
    opciones: ['Entera', 'En filetes', 'En cubos'],
    imgs: ['images/pechugas-de-pollo_1254x1254.webp', 'images/recorte-pechugas_900x559.webp'],
    dim: [1254, 1254],
    tags: ['pechuga', 'suprema', 'filet', 'milanesa', 'wok']
  },
  {
    id: 'milanesas',
    nombre: 'Milanesas de pollo',
    cat: 'listos',
    unidad: 'kg',
    precio: 9800,
    descuento: 0,
    badge: 'Rebozadas hoy',
    peso: 'Aprox. 8 milanesas por kilo',
    desc: 'De pechuga, rebozadas en el día con pan rallado casero. Van directo del freezer a la sartén o al horno.',
    optLabel: 'Rebozado',
    opciones: ['Clásico', 'Con provenzal', 'Sin sal'],
    imgs: ['images/milanesas-de-pollo_1254x1254.webp', 'images/recorte-milanesas_900x452.webp'],
    dim: [1254, 1254],
    tags: ['milanesa', 'milanesas', 'rebozado', 'pechuga']
  },
  {
    id: 'brochetas',
    nombre: 'Brochetas marinadas',
    cat: 'listos',
    unidad: 'u',
    precio: 2400,
    descuento: 0,
    badge: 'Listo para la parrilla',
    peso: 'Cada una, unos 180 g',
    desc: 'Cubos de pechuga con morrón y cebolla, marinados por nosotros el mismo día. Se hacen en diez minutos a fuego medio.',
    optLabel: 'Marinado',
    opciones: ['Criolla', 'Provenzal', 'Barbacoa'],
    imgs: ['images/brochetas-de-pollo-marinadas_1254x1254.webp', 'images/recorte-brochetas_900x569.webp'],
    dim: [1254, 1254],
    tags: ['brocheta', 'brochetas', 'pincho', 'parrilla', 'marinado']
  },
  {
    id: 'combo-parrillero',
    nombre: 'Combo parrillero',
    cat: 'combos',
    unidad: 'u',
    precio: 32000,
    descuento: 0,
    badge: '5 kg surtidos',
    peso: 'Pollo trozado, alitas, pata muslo y brochetas',
    desc: 'La caja del domingo: un pollo entero trozado, un kilo de alitas, un kilo de pata muslo y cuatro brochetas. Alcanza para seis personas tranquilo.',
    optLabel: 'Armado',
    opciones: ['Tal cual la foto', 'Sin menudos', 'Todo trozado chico'],
    imgs: ['images/surtido-de-productos-de-pollo_1619x971.webp'],
    dim: [1600, 960],
    tags: ['combo', 'parrilla', 'caja', 'familia', 'surtido']
  },
  {
    id: 'caja-semanal',
    nombre: 'Caja semanal',
    cat: 'combos',
    unidad: 'u',
    precio: 46000,
    descuento: 0,
    badge: 'Envasado por porción',
    peso: '7 kg fraccionados',
    desc: 'Pechuga, pata muslo, milanesas y pollo entero, todo envasado por porción y etiquetado para que lo lleves derecho al freezer.',
    optLabel: 'Armado',
    opciones: ['Surtido clásico', 'Más pechuga', 'Más milanesas'],
    imgs: ['images/empaques-y-pedidos-para-ecommerce_1122x1402.webp'],
    dim: [1122, 1402],
    tags: ['caja', 'semanal', 'freezer', 'envasado', 'porcion']
  }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const pasoDe = p => p.unidad === 'kg' ? 0.5 : 1;
const unidadCorta = p => p.unidad === 'kg' ? 'el kilo' : 'cada una';
const fmtQty = (p, q) => p.unidad === 'kg'
  ? q.toLocaleString('es-AR', { minimumFractionDigits: q % 1 ? 1 : 0, maximumFractionDigits: 1 }) + ' kg'
  : q + (q === 1 ? ' unidad' : ' unidades');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'pieldepollo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, corte = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.corte === corte);
    if (existing) existing.qty = Math.round((existing.qty + qty) * 10) / 10;
    else items.push({ id: producto.id, corte, qty });
    this.save(items);
  },
  setQty(id, corte, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.corte === corte);
    if (!it) return;
    const p = getProducto(id);
    const min = pasoDe(p || { unidad: 'u' });
    it.qty = Math.max(min, Math.round(qty * 10) / 10);
    this.save(items);
  },
  remove(id, corte) { this.save(this.get().filter(i => !(i.id === id && i.corte === corte))); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioFinal(p) * i.qty : s;
    }, 0);
  }
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

const estado = { cat: 'all', q: '' };
const grid = document.getElementById('gridProductos');
const vacio = document.getElementById('vacio');
const resultados = document.getElementById('resultados');
const limpiarBtn = document.getElementById('limpiar');

function cardHTML(p) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="card-badge">-${p.descuento}%</span>`
    : (p.badge ? `<span class="card-badge is-off">${esc(p.badge)}</span>` : '');
  const precio = p.descuento > 0
    ? `<s>${formatearPrecio(p.precio)}</s><b>${formatearPrecio(final)}</b>`
    : `<b>${formatearPrecio(final)}</b>`;
  return `
  <article class="card" data-id="${p.id}" data-cat="${p.cat}">
    <button type="button" class="card-open" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="${p.dim[0]}" height="${p.dim[1]}" loading="lazy" decoding="async">
      ${badge}
      <span class="card-ver">Ver más</span>
    </button>
    <div class="card-body">
      <p class="card-cat">${esc(CATEGORIAS[p.cat] || '')}</p>
      <h3 class="card-name">${esc(p.nombre)}</h3>
      <p class="card-price">${precio}<em>${unidadCorta(p)}</em></p>
      <div class="card-qty">
        <button type="button" class="qty-btn" data-step="-1" aria-label="Quitar cantidad de ${esc(p.nombre)}">−</button>
        <span class="qty-val" data-qty>${fmtQty(p, 1)}</span>
        <button type="button" class="qty-btn" data-step="1" aria-label="Sumar cantidad de ${esc(p.nombre)}">+</button>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary btn-add">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost btn-now">Comprar ahora</button>
      </div>
    </div>
  </article>`;
}

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(cardHTML).join('');
  grid.querySelectorAll('.card').forEach(card => {
    card.dataset.qty = '1';
    card.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = getProducto(card.dataset.id);
        if (!p) return;
        const paso = pasoDe(p);
        const actual = parseFloat(card.dataset.qty);
        const nueva = Math.max(paso, Math.round((actual + paso * Number(btn.dataset.step)) * 10) / 10);
        card.dataset.qty = String(nueva);
        card.querySelector('[data-qty]').textContent = fmtQty(p, nueva);
      });
    });
    card.querySelector('.card-open').addEventListener('click', () => abrirModal(card.dataset.id));
    card.querySelector('.btn-add').addEventListener('click', () => {
      const p = getProducto(card.dataset.id);
      if (!p) return;
      Cart.add(p, parseFloat(card.dataset.qty), p.opciones[0]);
      showToast('¡Agregado! Ya está en tu pedido');
    });
    card.querySelector('.btn-now').addEventListener('click', () => {
      const p = getProducto(card.dataset.id);
      if (!p) return;
      Cart.add(p, parseFloat(card.dataset.qty), p.opciones[0]);
      abrirDrawer();
    });
  });
}

function coincide(p) {
  if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
  if (!estado.q) return true;
  const q = normalizar(estado.q);
  const heno = normalizar([p.nombre, CATEGORIAS[p.cat], p.desc, p.peso, p.tags.join(' '), p.opciones.join(' ')].join(' '));
  return q.split(/\s+/).every(t => heno.includes(t));
}

function aplicarFiltros() {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card'));
  const usarFlip = typeof window.Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion;
  const state = usarFlip ? window.Flip.getState(cards) : null;
  let visibles = 0;
  cards.forEach(card => {
    const p = getProducto(card.dataset.id);
    const ok = p ? coincide(p) : false;
    card.style.display = ok ? '' : 'none';
    if (ok) visibles++;
  });
  if (state) {
    window.Flip.from(state, {
      duration: 0.5,
      ease: 'power2.out',
      absolute: true,
      stagger: 0.03,
      onEnter: els => gsap.fromTo(els, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.05, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, duration: 0.2 })
    });
  }
  if (vacio) vacio.hidden = visibles > 0;
  if (resultados) resultados.textContent = visibles === 1 ? '1 producto' : `${visibles} productos`;
  if (limpiarBtn) limpiarBtn.hidden = estado.cat === 'all' && !estado.q;
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initFiltros() {
  const buscar = document.getElementById('buscar');
  const clear = document.getElementById('buscarClear');
  document.querySelectorAll('#chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#chips .chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      estado.cat = chip.dataset.cat;
      aplicarFiltros();
    });
  });
  buscar?.addEventListener('input', () => {
    estado.q = buscar.value.trim();
    if (clear) clear.hidden = !estado.q;
    aplicarFiltros();
  });
  clear?.addEventListener('click', () => {
    if (buscar) buscar.value = '';
    estado.q = '';
    clear.hidden = true;
    aplicarFiltros();
    buscar?.focus();
  });
  const reset = () => {
    estado.cat = 'all';
    estado.q = '';
    if (buscar) buscar.value = '';
    if (clear) clear.hidden = true;
    document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
    aplicarFiltros();
  };
  limpiarBtn?.addEventListener('click', reset);
  document.getElementById('vacioReset')?.addEventListener('click', reset);
}

const drawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
let ultimoFocoDrawer = null;

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const envio = document.getElementById('cartEnvio');
  const badge = document.getElementById('cartBadge');
  if (!body || !foot || !envio) return;
  const items = Cart.get();
  const total = Cart.total();

  if (badge) {
    const n = Cart.count();
    badge.textContent = String(n);
    badge.style.display = n ? 'grid' : 'none';
  }

  if (!items.length) {
    envio.hidden = true;
    body.innerHTML = `
      <div class="cart-vacio">
        <span class="cart-vacio-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></span>
        <h3>Todavía no cargaste nada</h3>
        <p>Pasá por el mostrador y elegí los cortes: te los preparamos como los pidas.</p>
        <button type="button" class="btn btn-primary" data-cerrar-drawer>Ver el mostrador</button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  envio.hidden = false;
  const falta = ENVIO_GRATIS_DESDE - total;
  const pct = Math.min(100, Math.round(total / ENVIO_GRATIS_DESDE * 100));
  envio.innerHTML = falta > 0
    ? `<span>Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis</span><span class="envio-barra"><i style="width:${pct}%"></i></span>`
    : `<span><b>¡Tenés envío gratis! 🎉</b> Te lo llevamos hoy mismo</span><span class="envio-barra"><i style="width:100%"></i></span>`;

  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
      <div class="cart-item" data-id="${p.id}" data-corte="${esc(i.corte)}">
        <img src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="74" height="74" loading="lazy" decoding="async">
        <div>
          <h4>${esc(p.nombre)}</h4>
          <p class="cart-item-corte">${esc(i.corte || '')}</p>
          <div class="cart-item-row">
            <div class="cart-qty">
              <button type="button" data-step="-1" aria-label="Quitar cantidad de ${esc(p.nombre)}">−</button>
              <span>${fmtQty(p, i.qty)}</span>
              <button type="button" data-step="1" aria-label="Sumar cantidad de ${esc(p.nombre)}">+</button>
            </div>
            <span class="cart-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
          </div>
          <button type="button" class="cart-quitar">Quitar</button>
        </div>
      </div>`;
  }).join('');

  body.querySelectorAll('.cart-item').forEach(row => {
    const id = row.dataset.id;
    const corte = row.dataset.corte;
    const p = getProducto(id);
    row.querySelectorAll('.cart-qty button').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = Cart.get().find(x => x.id === id && x.corte === corte);
        if (!it || !p) return;
        Cart.setQty(id, corte, it.qty + pasoDe(p) * Number(btn.dataset.step));
      });
    });
    row.querySelector('.cart-quitar').addEventListener('click', () => Cart.remove(id, corte));
  });

  foot.innerHTML = `
    <div class="cart-total"><span>Total estimado</span><b>${formatearPrecio(total)}</b></div>
    <p class="cart-nota">El peso final puede variar unos gramos. Te lo confirmamos antes de cobrar.</p>
    <button type="button" class="btn btn-primary btn-block" id="finalizar">Finalizar compra</button>
    <a class="btn btn-ghost btn-block" id="pedirWsp" href="#" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>`;

  document.getElementById('finalizar').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  const wsp = document.getElementById('pedirWsp');
  const detalle = items.map(i => {
    const p = getProducto(i.id);
    return p ? `• ${p.nombre} (${i.corte}) — ${fmtQty(p, i.qty)} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean).join('\n');
  wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Piel de Pollo, quiero hacer este pedido:\n${detalle}\n\nTotal estimado: ${formatearPrecio(total)}`)}`;
}

function abrirDrawer() {
  if (!drawer) return;
  ultimoFocoDrawer = document.activeElement;
  drawer.classList.add('open');
  drawer.removeAttribute('inert');
  cartBackdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('#cartClose')?.focus();
}
function cerrarDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  cartBackdrop?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFocoDrawer?.focus();
}

function initCart() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  cartBackdrop?.addEventListener('click', cerrarDrawer);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('mostrador')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  document.addEventListener('cart:updated', () => {
    renderCart();
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  });
  renderCart();
}

const modal = document.getElementById('modalProducto');
const modalInner = document.getElementById('modalInner');
const modalBackdrop = document.getElementById('modalBackdrop');
let ultimoFocoModal = null;
let modalQty = 1;
let modalCorte = '';

function abrirModal(id) {
  const p = getProducto(id);
  if (!p || !modal || !modalInner) return;
  modalQty = 1;
  modalCorte = p.opciones[0];
  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? `<s>${formatearPrecio(p.precio)}</s><b>${formatearPrecio(final)}</b>`
    : `<b>${formatearPrecio(final)}</b>`;
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  modalInner.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">
        <div class="modal-foto"><img id="modalFoto" src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="${p.dim[0]}" height="${p.dim[1]}" decoding="async"></div>
        ${p.imgs.length > 1 ? `<div class="modal-thumbs">${p.imgs.map((src, i) => `<button type="button" class="${i === 0 ? 'is-on' : ''}" data-src="${src}" aria-label="Ver imagen ${i + 1} de ${esc(p.nombre)}"><img src="${src}" alt="" width="56" height="56"></button>`).join('')}</div>` : ''}
      </div>
      <div class="modal-info">
        <p class="card-cat">${esc(CATEGORIAS[p.cat] || '')}</p>
        <h3>${esc(p.nombre)}</h3>
        <p class="modal-precio">${precio}<em>${unidadCorta(p)} · ${esc(p.peso)}</em></p>
        <p class="modal-desc">${esc(p.desc)}</p>
        <span class="opt-label">${esc(p.optLabel)}</span>
        <div class="opciones" id="modalOpciones">
          ${p.opciones.map((o, i) => `<button type="button" class="opcion ${i === 0 ? 'is-on' : ''}" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}
        </div>
        <div class="modal-qty">
          <div class="card-qty">
            <button type="button" class="qty-btn" data-step="-1" aria-label="Quitar cantidad">−</button>
            <span class="qty-val" id="modalQtyVal">${fmtQty(p, modalQty)}</span>
            <button type="button" class="qty-btn" data-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <span class="cart-nota" id="modalSubtotal">${formatearPrecio(final * modalQty)}</span>
        </div>
        <div class="modal-acciones">
          <button type="button" class="btn btn-primary btn-block" id="modalAdd">Agregar al carrito</button>
          <button type="button" class="btn btn-ghost btn-block" id="modalNow">Comprar ahora</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `<div class="modal-relacionados">
      <h4>También te puede interesar</h4>
      <div class="rel-lista">${relacionados.map(r => `
        <button type="button" class="rel-item" data-rel="${r.id}">
          <img src="${r.imgs[0]}" alt="${esc(r.nombre)}" width="${r.dim[0]}" height="${r.dim[1]}" loading="lazy" decoding="async">
          <b>${esc(r.nombre)}</b>
          <span>${formatearPrecio(precioFinal(r))} ${unidadCorta(r)}</span>
        </button>`).join('')}</div>
    </div>` : ''}`;

  const actualizar = () => {
    modalInner.querySelector('#modalQtyVal').textContent = fmtQty(p, modalQty);
    modalInner.querySelector('#modalSubtotal').textContent = formatearPrecio(final * modalQty);
  };
  modalInner.querySelectorAll('.modal-qty .qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const paso = pasoDe(p);
      modalQty = Math.max(paso, Math.round((modalQty + paso * Number(btn.dataset.step)) * 10) / 10);
      actualizar();
    });
  });
  modalInner.querySelectorAll('#modalOpciones .opcion').forEach(btn => {
    btn.addEventListener('click', () => {
      modalInner.querySelectorAll('#modalOpciones .opcion').forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      modalCorte = btn.dataset.opt;
    });
  });
  modalInner.querySelectorAll('.modal-thumbs button').forEach(btn => {
    btn.addEventListener('click', () => {
      modalInner.querySelectorAll('.modal-thumbs button').forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      modalInner.querySelector('#modalFoto').src = btn.dataset.src;
    });
  });
  modalInner.querySelector('#modalAdd').addEventListener('click', () => {
    Cart.add(p, modalQty, modalCorte);
    showToast('¡Agregado! Ya está en tu pedido');
  });
  modalInner.querySelector('#modalNow').addEventListener('click', () => {
    Cart.add(p, modalQty, modalCorte);
    cerrarModal();
    abrirDrawer();
  });
  modalInner.querySelectorAll('.rel-item').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.rel));
  });

  if (!modal.classList.contains('open')) ultimoFocoModal = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  modalBackdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  modal.querySelector('#modalClose')?.focus();
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  modalBackdrop?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFocoModal?.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modalBackdrop?.addEventListener('click', cerrarModal);
}

function initFocusTrap() {
  const sel = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('open')) { cerrarModal(); return; }
      if (drawer?.classList.contains('open')) { cerrarDrawer(); return; }
    }
    if (e.key !== 'Tab') return;
    const panel = modal?.classList.contains('open') ? modal : (drawer?.classList.contains('open') ? drawer : null);
    if (!panel) return;
    const focusables = Array.from(panel.querySelectorAll(sel)).filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-block', { xPercent: 12, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-disc', { scale: 0.86, opacity: 0, duration: 1 }, 0.15)
    .from('.hero-piece-main', { y: 46, rotate: -7, opacity: 0, duration: 1.15 }, 0.25)
    .from('.hero-piece-sec', { y: 34, x: 24, opacity: 0, duration: 0.9 }, 0.55)
    .from('.hero-scene .tag-price', { y: -18, rotate: -14, opacity: 0, duration: 0.7 }, 0.7)
    .from('.hero-scene .tag-round', { scale: 0.92, opacity: 0, duration: 0.6 }, 0.82);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.nosotros-media img');
  if (foto) {
    gsap.fromTo(foto, { yPercent: -4, scale: 1.07 }, {
      yPercent: 4, scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: '.nosotros-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  const copy = document.querySelector('.nosotros-copy');
  if (copy) {
    gsap.fromTo(copy, { y: 26 }, {
      y: -18, ease: 'none',
      scrollTrigger: { trigger: '.nosotros', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  gsap.utils.toArray('.ben-ico').forEach((ico, i) => {
    gsap.from(ico, {
      scale: 0.86, rotate: -8, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.beneficios', start: 'top 78%' }
    });
  });
  gsap.from('.seam-cut', {
    y: 40, rotate: -18, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.seam-cut', start: 'top 92%' }
  });
  gsap.from('.cierre-cut', {
    y: 50, rotate: 12, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.cierre', start: 'top 72%' }
  });
}

const POS = [
  { fx: -0.30, fy: -0.30 },
  { fx: 0.30, fy: -0.30 },
  { fx: -0.35, fy: 0.02 },
  { fx: 0.35, fy: 0.02 },
  { fx: -0.21, fy: 0.33 },
  { fx: 0.21, fy: 0.33 }
];

function initDespiece() {
  const stage = document.getElementById('despieceStage');
  const visual = document.getElementById('despieceVisual');
  const pasos = document.getElementById('despiecePasos');
  if (!stage || !visual || !pasos) return;

  const piezas = Array.from(visual.querySelectorAll('.dp-corte'));
  const centro = document.getElementById('dpCentro');
  const ring = visual.querySelector('.despiece-ring');
  const items = Array.from(pasos.children);

  piezas.forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.prod));
  });

  const setStep = progress => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    items.forEach((li, n) => li.classList.toggle('is-on', n === i));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    items.forEach(li => li.classList.add('is-on'));
    return;
  }

  const construir = tl => {
    gsap.set(piezas, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.5, opacity: 0 });
    gsap.set(ring, { opacity: 0, scale: 0.72, rotate: 0 });
    gsap.set(centro, { scale: 1 });
    tl.to(centro, { scale: 0.78, duration: 0.3, ease: 'power2.out' }, 0.05)
      .to(ring, { opacity: 1, scale: 1, rotate: 26, duration: 0.95, ease: 'none' }, 0.05);
    [[0, 1], [2, 3], [4, 5]].forEach((par, n) => {
      const t = 0.2 + n * 0.25;
      par.forEach((idx, k) => {
        tl.to(piezas[idx], {
          x: () => POS[idx].fx * visual.clientWidth,
          y: () => POS[idx].fy * visual.clientHeight,
          scale: 1,
          opacity: 1,
          duration: 0.26,
          ease: 'power2.out'
        }, t + k * 0.05);
      });
    });
    tl.to({}, { duration: 0.06 });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    return () => { gsap.set([piezas, ring, centro], { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      gsap.set([piezas, ring, centro], { clearProps: 'all' });
    };
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

document.documentElement.classList.add('js-ready');
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('hero-in')));
renderGrid();
initFiltros();
aplicarFiltros();
initCart();
initModal();
initFocusTrap();
initNav();
initWspFloat();
initReveals();
initHero();
initParallax();
initDespiece();
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
